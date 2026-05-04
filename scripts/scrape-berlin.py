#!/usr/bin/env python3
"""
ORBIT Berlin Scraper — Phase 1 (no TMDB)

Reads Wikipedia ceremony articles via the MediaWiki API. Berlin is
winners-only — every extracted row has result="won". No DLu cross-check.
11 categories across the 2000-2025 lifecycle (7-9 active per ceremony):
  Golden Bear, Silver Bear Grand Jury Prize, Silver Bear for Best
  Director, Silver Bear for Best Actor (2000-2020), Silver Bear for
  Best Actress (2000-2020), Silver Bear for Best Leading Performance
  (2021+), Silver Bear for Best Supporting Performance (2021+), Silver
  Bear for Best Screenplay, Silver Bear for Outstanding Artistic
  Contribution, Alfred Bauer Prize (2000-2019), Best First Feature
  Award (2006+).

Wikipedia structure observations (verified across 2000, 2010, 2019,
2021, 2024):
  - URL pattern: https://en.wikipedia.org/wiki/{Nth}_Berlin_International_Film_Festival
    where Nth = year - 1950 (50th = 2000, 75th = 2025). Cer 2000 only
    resolves via the ordinal URL; cer 2006+ supports both year and
    ordinal redirects, but the ordinal pattern works for ALL years.
  - Top-level Awards section: ^==\\s*Official\\s+Awards\\s*==
  - Main Competition heading: === Main Competition === consistent.
  - Best First Feature Award appears in a separate ===-level subsection
    (=== Best First Feature Award === or === GWFF Best First Feature
    Award ===); Pass 2 (section-heading-driven) handles it.
  - Categories with stable wikilink targets are matched in Pass 1.
  - Outstanding Artistic Contribution display name varies (parenthetical
    specialty like 'Camera', 'editing', 'cinematography'); wikilink
    target consistent in cer 2024+ but bold-only in older years.
  - Lifecycle categories: scraper extracts ALL bullets per Pass 1, but
    the categories.json lifecycle fields (first_year/last_year) gate
    which categories are considered active per ceremony year.
  - 'Silver Bear Jury Prize' (no 'Grand') is a SEPARATE third prize
    introduced more recently; it is OUT OF SCOPE for the 11 user
    categories. Exact wikilink-target matching (Silver Bear Grand Jury
    Prize ≠ Silver Bear Jury Prize) filters it out automatically.

Dependencies: stdlib + requests
"""

import argparse
import csv
import json
import os
import re
import sys
import time
from datetime import date, datetime, timezone

try:
    import requests
except ImportError:
    print("ERROR: 'requests' is required. Install with: pip3 install requests")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-berlin-categories.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "berlin")
RAW_DIR = os.path.join(SCRAPED_DIR, "raw")

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "ORBIT-Awards-Scraper/1.0 (https://github.com/orbit-project/Film-discovery-)"
SCRAPE_VERSION = "scrape-berlin-v1.0.0"

MIN_YEAR = 2000
MAX_YEAR = 2025
SKIPPED_YEARS = set()

REQUEST_DELAY_SEC = 1.0

CSV_COLUMNS = [
    "year", "category_id", "result", "recipients_json", "film_title",
    "film_tmdb_id", "co_winner", "verified_status", "notes", "scraped_at",
]


def year_to_ordinal(year):
    """Berlin ceremonies map year -> ordinal: Nth = year - 1950.
       50th = 2000, 75th = 2025."""
    n = year - 1950
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fetch_with_retry(url, params=None, headers=None, max_retries=3):
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=30)
            resp.raise_for_status()
            time.sleep(REQUEST_DELAY_SEC)
            return resp
        except requests.RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  Retry {attempt+1}/{max_retries} after {wait}s: {e}")
            time.sleep(wait)


def load_categories():
    with open(CATEGORIES_FILE, encoding="utf-8") as f:
        return json.load(f)


def is_category_active(cat, year):
    """Return True if cat is active in the given ceremony year."""
    fy = cat.get("first_year", 0)
    ly = cat.get("last_year")
    if year < fy:
        return False
    if ly is not None and year > ly:
        return False
    return True


def fetch_wikipedia_wikitext(year):
    ordinal = year_to_ordinal(year)
    page_title = f"{ordinal}_Berlin_International_Film_Festival"
    page_url = f"https://en.wikipedia.org/wiki/{page_title}"
    params = {
        "action": "parse", "page": page_title,
        "format": "json", "prop": "wikitext", "redirects": "1",
    }
    headers = {"User-Agent": USER_AGENT}
    print(f"  Fetching Wikipedia: {page_title}")
    resp = fetch_with_retry(WIKIPEDIA_API, params=params, headers=headers)
    data = resp.json()
    if "error" in data:
        raise RuntimeError(f"Wikipedia API error: {data['error'].get('info', data['error'])}")
    return data["parse"]["wikitext"]["*"], page_url, data


def save_raw_response(year, data):
    os.makedirs(RAW_DIR, exist_ok=True)
    path = os.path.join(RAW_DIR, f"berlin-{year}-wikipedia.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  Raw response saved to {path}")


# ---------------------------------------------------------------------------
# Awards block extraction
# ---------------------------------------------------------------------------

def extract_awards_block(wikitext):
    """Return the wikitext slice that is the top-level 'Official Awards'
    section. Anchors on ^== Official Awards ==$ and runs until the next
    == heading or end of text."""
    m = re.search(r"^==\s*Official\s+Awards?\s*==", wikitext, re.MULTILINE | re.IGNORECASE)
    if not m:
        return None
    start = m.end()
    end_m = re.search(r"^==[^=]", wikitext[start:], re.MULTILINE)
    end = start + (end_m.start() if end_m else len(wikitext) - start)
    return wikitext[start:end]


# ---------------------------------------------------------------------------
# Bullet parsing — same architecture as Cannes/Venice
# ---------------------------------------------------------------------------

RE_REF_TAG = re.compile(r"<ref[^>]*?/>|<ref[^>]*?>.*?</ref>", re.DOTALL | re.IGNORECASE)
RE_SMALL_TAG = re.compile(r"</?small\s*[^>]*>", re.IGNORECASE)
RE_LANG_TEMPLATE = re.compile(
    r"\{\{[Ll]ang\|[^|}]+\|([^}|]+)(?:\|[^}]*)?\}\}"
)
# Interlanguage-link template {{ill|<English title>|<lang>|<native title>}}
# preserves the English title (first positional arg).
RE_ILL_TEMPLATE = re.compile(r"\{\{ill\|([^|}]+)(?:\|[^}]*)?\}\}", re.IGNORECASE)
RE_TEMPLATE_SIMPLE = re.compile(r"\{\{(?:efn|notetag|cite[^|}]*)\b[^{}]*\}\}", re.IGNORECASE)
RE_TEMPLATE_GENERIC = re.compile(r"\{\{[^{}]*\}\}")


def unwrap_lang_templates(text):
    prev = None
    while text != prev:
        prev = text
        text = RE_LANG_TEMPLATE.sub(r"\1", text)
        text = RE_ILL_TEMPLATE.sub(r"\1", text)
    return text


def clean_inline_wikitext(text):
    text = RE_REF_TAG.sub("", text)
    text = RE_SMALL_TAG.sub("", text)
    text = unwrap_lang_templates(text)
    prev = None
    while text != prev:
        prev = text
        text = RE_TEMPLATE_SIMPLE.sub("", text)
        text = RE_TEMPLATE_GENERIC.sub("", text)
    return text.strip()


def find_category_bullets(awards_block, categories, year):
    """Two-pass matcher mirroring scrape-venice.py.

    Only categories active in the given ceremony year (per first_year/
    last_year in categories.json) are eligible for matching. Inactive
    categories' bullets are silently skipped.
    """
    found = {c["id"]: [] for c in categories}

    target_lookup = {}
    for cat in categories:
        if not is_category_active(cat, year):
            continue
        for tgt in cat.get("wikilink_targets", []):
            target_lookup[tgt.lower()] = cat["id"]

    # Display-alias lookup for bold-only matching (Outstanding Artistic
    # Contribution years 2000-2021 use bold-only display). Active
    # categories only.
    display_lookup = {}
    for cat in categories:
        if not is_category_active(cat, year):
            continue
        for alias in cat.get("display_aliases", []):
            display_lookup[alias.lower()] = cat["id"]

    lines = awards_block.split("\n")

    mc_start, mc_end = _find_main_competition_range(lines)

    matched_line_indices = set()
    i = mc_start
    while i < mc_end:
        line = lines[i]
        if not line.startswith("*") or line.startswith("**"):
            i += 1
            continue
        body = line[1:].lstrip()
        body = unwrap_lang_templates(body)

        cat_id = _match_bullet_category(body, target_lookup, display_lookup)
        if cat_id is None:
            i += 1
            continue

        if "honorary" in body.lower() or "lifetime" in body.lower():
            i += 1
            continue

        sub_bullets = []
        j = i + 1
        while j < len(lines):
            sub = lines[j]
            if sub.startswith("**") and not sub.startswith("***"):
                sub_bullets.append(sub[2:].lstrip())
                matched_line_indices.add(j)
                j += 1
                continue
            if sub.strip() == "":
                j += 1
                continue
            break

        found[cat_id].append((body, sub_bullets))
        matched_line_indices.add(i)
        i = j

    # Pass 2: section-heading-driven matching for Best First Feature
    # (lives in a separate ===-level subsection).
    cat_lookup_by_id = {c["id"]: c for c in categories}
    for sec_start, sec_end, sec_cat_id in _find_category_sections(lines, target_lookup, year, categories):
        if found.get(sec_cat_id):
            continue
        section_cat = cat_lookup_by_id.get(sec_cat_id)
        k = sec_start
        while k < sec_end:
            line = lines[k]
            if k in matched_line_indices:
                k += 1
                continue
            if not line.startswith("*") or line.startswith("**"):
                k += 1
                continue
            body = line[1:].lstrip()
            body = unwrap_lang_templates(body)
            if "honorary" in body.lower() or "lifetime" in body.lower():
                k += 1
                continue

            if _bullet_has_inline_category_marker(body):
                if not _bullet_matches_section_aliases(body, section_cat):
                    break

            sub_bullets = []
            m = k + 1
            while m < sec_end:
                sub = lines[m]
                if sub.startswith("**") and not sub.startswith("***"):
                    sub_bullets.append(sub[2:].lstrip())
                    m += 1
                    continue
                if sub.strip() == "":
                    m += 1
                    continue
                break
            found[sec_cat_id].append((body, sub_bullets))
            k = m
    return found


def _match_bullet_category(body, target_lookup, display_lookup):
    """Match a bullet to a category by wikilink target or bold-display alias.

    Handles four bullet shapes:
      1. `[[Target]]: ...`               (bare wikilink + colon)
      2. `'''[[Target]]''': ...`         (bold-wrapped wikilink)
      3. `'''Display Alias''': ...`      (bold-only display alias)
      4. `Display Alias: ...`            (plain text + colon, no bold)
    """
    # Wikilink-target match — allow optional 2-3 leading apostrophes
    # (italic open or bold open) and matching trailing markers.
    m = re.match(r"^\s*(?:'{2,3})?\s*\[\[([^|\]]+)(?:\|([^\]]+))?\]\](?:'{2,3})?\s*:?", body)
    if m:
        target = m.group(1).strip().lower()
        cat_id = target_lookup.get(target)
        if cat_id:
            return cat_id

    # Bold-prefix display alias — handle both `'''Alias''': ...` and
    # `'''Alias:''' ...` (colon inside or outside the bold span).
    for pat in (r"^\s*'''([^']+)'''\s*:", r"^\s*'''([^']+):'''"):
        m = re.match(pat, body)
        if m:
            cat_id = _resolve_display(m.group(1), display_lookup)
            if cat_id:
                return cat_id

    # Plain-text display alias (no bold, no wikilink) followed by ':' —
    # e.g. cer 2011 'Outstanding Artistic Contribution (Camera): ...'.
    # Restrict to short prefix to avoid grabbing unrelated text.
    m = re.match(r"^\s*([A-Z][A-Za-z][^:\[]{1,80}?)\s*:\s", body)
    if m:
        cat_id = _resolve_display(m.group(1), display_lookup)
        if cat_id:
            return cat_id
    return None


def _resolve_display(display, display_lookup):
    display = display.strip().lower()
    cat_id = display_lookup.get(display)
    if cat_id:
        return cat_id
    no_paren = re.sub(r"\s*\([^)]+\)\s*$", "", display).strip()
    if no_paren and no_paren != display:
        cat_id = display_lookup.get(no_paren)
        if cat_id:
            return cat_id
    for alias, cid in display_lookup.items():
        if alias and alias in display:
            return cid
    return None


def _bullet_has_inline_category_marker(body):
    if re.match(r"^\s*'''[^']+'''\s*:", body):
        return True
    if re.match(r"^\s*\[\[[^\]]+\]\]\s*:", body) and not body.lstrip().startswith("''"):
        return True
    return False


def _bullet_matches_section_aliases(body, section_cat):
    if not section_cat:
        return False
    m = re.match(r"^\s*'''([^']+)''':", body)
    if not m:
        return False
    display = m.group(1).strip().lower()
    for alias in section_cat.get("display_aliases", []):
        al = alias.lower()
        if display == al or al in display or display in al:
            return True
    return False


def _find_main_competition_range(lines):
    """Return (start_idx, end_idx) of the Main Competition subsection
    inside the Official Awards block. Limits Pass 1 bullet scanning to
    the canonical main-competition awards and excludes Encounters /
    Honorary / Berlinale Camera / Best First Feature / etc subsections.
    """
    section_indices = []
    for i, line in enumerate(lines):
        m = re.match(r"^\s*===+\s*(.+?)\s*===+\s*$", line)
        if m:
            section_indices.append((i, m.group(1)))

    if not section_indices:
        return (0, len(lines))

    MC_KEYWORDS = ("main competition", "competition")
    NON_MC_KEYWORDS = (
        "honorary", "lifetime", "berlinale camera", "encounters",
        "best first feature", "gwff best first feature", "berlinale documentary",
        "panorama", "generation", "shorts", "short film",
        "berlinale special", "berlinale series", "perspektive",
        "forum", "retrospective", "kplus", "14plus",
    )

    for i, (idx, hd) in enumerate(section_indices):
        hd_lower = hd.lower()
        if any(kw in hd_lower for kw in MC_KEYWORDS):
            mc_start = idx + 1
            mc_end = section_indices[i + 1][0] if i + 1 < len(section_indices) else len(lines)
            return (mc_start, mc_end)

    first_idx, first_hd = section_indices[0]
    if any(kw in first_hd.lower() for kw in NON_MC_KEYWORDS):
        return (0, first_idx)

    next_idx = section_indices[1][0] if len(section_indices) > 1 else len(lines)
    return (first_idx + 1, next_idx)


def _find_category_sections(lines, target_lookup, year, categories):
    """Yield (start_idx, end_idx, category_id) for === sub-sections whose
    heading matches one of our category targets/aliases. Used here for
    Best First Feature Award.
    """
    section_indices = []
    for i, line in enumerate(lines):
        m = re.match(r"^\s*===+\s*(.+?)\s*===+\s*$", line)
        if m:
            section_indices.append((i, m.group(1)))
    section_indices.append((len(lines), None))

    BEST_FIRST_FEATURE_SUBSTRINGS = (
        "best first feature",
        "gwff best first feature",
    )

    for idx, (line_idx, heading) in enumerate(section_indices):
        if heading is None:
            continue
        if "honorary" in heading.lower() or "lifetime" in heading.lower():
            continue
        clean_heading = re.sub(r"\{\{[^}]*\}\}", "", heading)
        clean_heading = re.sub(r"''", "", clean_heading).replace('"', '').strip()
        wm = re.search(r"\[\[([^|\]]+)(?:\|[^\]]+)?\]\]", clean_heading)
        cat_id = None
        if wm:
            cat_id = target_lookup.get(wm.group(1).strip().lower())
        if cat_id is None:
            heading_text = re.sub(r"\[\[|\]\]", "", clean_heading).strip().lower()
            for sub in BEST_FIRST_FEATURE_SUBSTRINGS:
                if sub in heading_text:
                    # Honour lifecycle (best_first_feature only active 2006+)
                    cat_id = "berlin.best_first_feature"
                    bff_cat = next((c for c in categories if c["id"] == cat_id), None)
                    if bff_cat and not is_category_active(bff_cat, year):
                        cat_id = None
                    break
        if cat_id is None:
            continue
        next_line_idx = section_indices[idx + 1][0]
        yield (line_idx + 1, next_line_idx, cat_id)


# ---------------------------------------------------------------------------
# Winner extraction — same as Venice/Cannes
# ---------------------------------------------------------------------------

def extract_winners_from_bullet(parent_body, sub_bullets, cat):
    content = _strip_category_prefix(parent_body, cat)
    content = clean_inline_wikitext(content)
    sub_bullets_clean = [clean_inline_wikitext(s) for s in sub_bullets]
    real_subs = [
        s for s in sub_bullets_clean
        if s and not _is_special_mention(s)
    ]

    if content:
        winner = _parse_winner_line(content, cat)
        if winner and (winner["film_title"] or winner["recipients"]):
            if cat.get("split_co_recipients") and len(winner["recipients"]) > 1:
                return [
                    {"film_title": winner["film_title"],
                     "recipients": [r],
                     "co_winner": True}
                    for r in winner["recipients"]
                ]
            return [{"film_title": winner["film_title"],
                     "recipients": winner["recipients"],
                     "co_winner": False}]
        # Parent line had only a qualifier (e.g. '(cinematography)')
        # with no film/recipient — fall through to sub-bullet processing.

    if not real_subs:
        return []
    winners = []
    for sub in real_subs:
        w = _parse_winner_line(sub, cat)
        if w:
            winners.append({"film_title": w["film_title"],
                            "recipients": w["recipients"]})
    if not winners:
        return []
    is_tie = len(winners) > 1
    return [{"film_title": w["film_title"],
             "recipients": w["recipients"],
             "co_winner": is_tie}
            for w in winners]


def _strip_category_prefix(body, cat):
    # Bold-wrapped wikilink: '''[[Target]]''': ...
    m = re.match(r"^\s*'{2,3}\s*\[\[[^\]]+\]\]\s*'{2,3}\s*:\s*", body)
    if m:
        return body[m.end():]
    # Bare wikilink with optional " for Y:" qualifier
    m = re.match(r"^\s*\[\[[^\]]+\]\](?:\s+for\s+[^:]+)?\s*:\s*", body)
    if m:
        return body[m.end():]
    # Bold-italic-bold combo
    m = re.match(r"^\s*'{3,5}.*?'{3,5}\s*:\s*", body, re.DOTALL)
    if m:
        return body[m.end():]
    # Bold prefix with colon-inside variant: '''Alias:'''
    m = re.match(r"^\s*'''[^']+:'''\s*", body)
    if m:
        return body[m.end():]
    # Simple bold prefix
    m = re.match(r"^\s*'''[^']+'''\s*:\s*", body)
    if m:
        return body[m.end():]
    # Plain text prefix (display-alias path) — strip up to first ': '
    m = re.match(r"^\s*[A-Z][A-Za-z][^:\[]{1,80}?\s*:\s+", body)
    if m:
        return body[m.end():]
    return body


def _is_special_mention(text):
    text_lower = text.lower().lstrip("'").lstrip()
    return text_lower.startswith("special mention") or text_lower.startswith("'special mention")


def _parse_winner_line(content, cat):
    content = content.strip()
    if not content:
        return None

    # F1: italic film title first.
    # Use non-greedy `.+?` (not `[^']+`) so single apostrophes inside
    # the title (e.g. ''Boy's Choir'') don't break the match.
    m = re.match(r"^''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|(.+?))''(.*)$", content)
    if m:
        film = (m.group(1) or m.group(2) or "").strip()
        rest = m.group(3).strip()
        rest = re.sub(r"^\s*(?:by|de)\s+", "", rest, flags=re.IGNORECASE)
        recipients = _extract_persons(rest)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        return {"film_title": film, "recipients": recipients}

    # F1b: non-italic wikilinked film + by
    m = re.match(r"^\[\[(?:[^|\]]*\|)?([^\]]+)\]\]\s+by\s+(.*)$", content, re.IGNORECASE)
    if m:
        film = m.group(1).strip()
        rest = m.group(2).strip()
        recipients = _extract_persons(rest)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        return {"film_title": film, "recipients": recipients}

    # F2/F3: persons + " for ''Film''" (or " for [[Wikilinked|''Film'']]")
    parts = re.split(r"\s+for\s+", content, maxsplit=1, flags=re.IGNORECASE)
    if len(parts) == 2:
        left, right = parts[0].strip(), parts[1].strip()
        recipients = _extract_persons(left)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        film = _extract_film_from_segment(right)
        return {"film_title": film, "recipients": recipients}

    # F4: 'For the [Cast/Ensemble] of ''Film''' (cer 2007 OAC)
    m = re.match(r"^\s*for\s+the\s+(?:cast|ensemble)(?:\s+cast)?\s+of\s+(.*)$",
                 content, re.IGNORECASE)
    if m:
        film = _extract_film_from_segment(m.group(1))
        return {"film_title": film, "recipients": []}

    # Fallback
    film = _extract_film_from_segment(content)
    persons = _extract_persons(content)
    persons = [p for p in persons if p.lower() not in NON_PERSON_NAMES]
    if film or persons:
        return {"film_title": film, "recipients": persons}
    return None


def _extract_film_from_segment(segment):
    """Pull a film title out of a free-form text segment. Tries
    italic-wikilinked, italic-plain, bare-wikilinked-italic, then bare
    wikilink in last resort. Returns '' if no plausible film found."""
    # ''[[Target|Display]]'' or ''[[Target]]''
    m = re.search(r"''\[\[(?:[^|\]]*\|)?([^\]]+)\]\]''", segment)
    if m:
        return m.group(1).strip()
    # [[Target|''Display'']] (italic inside wikilink display)
    m = re.search(r"\[\[(?:[^|\]]*\|)''([^']+)''\]\]", segment)
    if m:
        return m.group(1).strip()
    # ''plain text'' (non-greedy to allow apostrophes inside)
    m = re.search(r"''(.+?)''", segment)
    if m:
        inner = m.group(1)
        wm = re.match(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]$", inner)
        return (wm.group(1) if wm else inner).strip()
    return ""


NON_PERSON_NAMES = {
    "production design", "set decoration", "art direction",
    "set decorator", "art director",
    "posthumous award", "posthumous", "honorary award", "honorary",
    "the play", "the novel", "the book", "his novel", "her novel",
    "the short story", "the memoir", "the biography",
    "the screenplay", "the article", "the story",
    "special mention",
    "the cast of", "the ensemble cast", "the actor ensemble of",
    "the actress ensemble of", "ensemble cast",
    "the cast", "the ensemble",
}


def _extract_persons(text):
    text = re.sub(r"''[^']+''", "", text)
    persons = []
    for m in re.finditer(r"\[\[([^|\]]+)(?:\|([^\]]+))?\]\]", text):
        name = (m.group(2) or m.group(1)).strip()
        if name and len(name) > 1:
            persons.append(name)
    if persons:
        return persons
    cleaned = re.sub(r"\[\[|\]\]|''", "", text).strip()
    # Strip trailing parenthetical specialty like '(cinematography)',
    # '(score)', '(editing)' — these qualify the award, not the
    # recipient list.
    cleaned = re.sub(r"\s*\([^)]*\)\s*$", "", cleaned).strip()
    cleaned = re.sub(r"\s+&\s+", ", ", cleaned)
    cleaned = re.sub(r"\s+and\s+", ", ", cleaned)
    cleaned = re.sub(r"^by\s+", "", cleaned, flags=re.IGNORECASE)
    parts = [p.strip() for p in cleaned.split(",") if p.strip()]
    return [p for p in parts
            if len(p) > 1 and not p.isdigit()
            and not (p.startswith("(") and p.endswith(")"))
            and p.lower() not in NON_PERSON_NAMES]


# ---------------------------------------------------------------------------
# Row building
# ---------------------------------------------------------------------------

def build_rows(year, categories, found, page_url):
    rows = []
    scraped_at = datetime.now(timezone.utc).isoformat()
    for cat in categories:
        if not is_category_active(cat, year):
            continue
        bullets = found.get(cat["id"], [])
        if not bullets:
            continue
        for parent_body, sub_bullets in bullets:
            winners = extract_winners_from_bullet(parent_body, sub_bullets, cat)
            for w in winners:
                if not w["recipients"]:
                    # Skip rows with no extractable recipient (e.g. cer
                    # 2007 OAC 'For the Ensemble Cast of The Good
                    # Shepherd' where no individuals are named).
                    # Phase 4 truth curation can backfill if needed.
                    continue
                row = {
                    "year": year,
                    "category_id": cat["id"],
                    "result": "won",
                    "recipients_json": json.dumps(
                        [{"name": n, "role": None,
                          "tmdb_person_id": None, "profile_path": None}
                         for n in w["recipients"]],
                        ensure_ascii=False),
                    "film_title": w["film_title"],
                    "film_tmdb_id": "",
                    "co_winner": "true" if w["co_winner"] else "false",
                    "verified_status": "auto_verified",
                    "notes": "",
                    "scraped_at": scraped_at,
                }
                rows.append(row)
    return rows


def write_csv(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="ORBIT Berlin Scraper — scrape Berlin Berlinale data from Wikipedia"
    )
    parser.add_argument("--year", type=int, required=True,
                        help=f"Ceremony year (range {MIN_YEAR}-{MAX_YEAR})")
    parser.add_argument("--dry-run", action="store_true",
                        help="Run scrape and show summary without writing CSV")
    args = parser.parse_args()

    year = args.year
    if year in SKIPPED_YEARS:
        print(f"ERROR: Year {year} is in the skipped-years list.")
        sys.exit(1)
    if year < MIN_YEAR or year > MAX_YEAR:
        print(f"ERROR: Year {year} outside scope [{MIN_YEAR}, {MAX_YEAR}].")
        sys.exit(1)
    today = date.today()
    if year > today.year + 1:
        print(f"ERROR: Year {year} is in the future.")
        sys.exit(1)

    ordinal = year_to_ordinal(year)
    print(f"Scraping {ordinal} Berlin International Film Festival ({year})")
    print("=" * 60)

    print("\n[1] Loading categories")
    categories = load_categories()
    active_cats = [c for c in categories if is_category_active(c, year)]
    print(f"  Categories defined: {len(categories)}; active for {year}: {len(active_cats)}")
    for c in active_cats:
        print(f"    - {c['display_name']} ({c['id']})")

    print(f"\n[2] Fetching Wikipedia article")
    try:
        wikitext, page_url, raw_data = fetch_wikipedia_wikitext(year)
    except Exception as e:
        print(f"  FATAL: Could not fetch Wikipedia article: {e}")
        sys.exit(1)
    save_raw_response(year, raw_data)

    print("\n[3] Locating Awards section")
    awards_block = extract_awards_block(wikitext)
    if not awards_block:
        print("  FATAL: No 'Official Awards' top-level section found.")
        sys.exit(1)
    print(f"  Awards block: {len(awards_block)} chars")

    print("\n[4] Matching category bullets")
    found = find_category_bullets(awards_block, categories, year)
    for cat in active_cats:
        n = len(found.get(cat["id"], []))
        print(f"  {cat['display_name']:50s}: {n} bullet match(es)")

    print(f"\n[5] Building rows")
    rows = build_rows(year, categories, found, page_url)
    print(f"  Total rows: {len(rows)}")

    print(f"\n{'=' * 60}")
    print("SCRAPE SUMMARY")
    print(f"{'=' * 60}")
    cat_counts = {}
    for r in rows:
        cat_counts[r["category_id"]] = cat_counts.get(r["category_id"], 0) + 1
    missing = []
    for cat in active_cats:
        n = cat_counts.get(cat["id"], 0)
        marker = "  ← MISSING" if n == 0 else ""
        print(f"  {cat['display_name']:50s}: {n} winner row(s){marker}")
        if n == 0:
            missing.append(cat["display_name"])

    csv_path = os.path.join(SCRAPED_DIR, f"berlin-{year}.csv")
    if args.dry_run:
        print(f"\n  --dry-run: would write to {csv_path}")
    else:
        write_csv(rows, csv_path)
        print(f"\n  [scrape-berlin {year}] Output: {csv_path}")

    if missing:
        # Berlin has many lifecycle / real-data gaps (Best Screenplay
        # pre-2008; Alfred Bauer cer 2003-2005; etc.). Treat missing
        # active-categories as a warning, not an exit-1 failure — the
        # wrapper's Phase D MISSING REVIEW is the authoritative signal,
        # and era_overrides in expectations.json suppress known gaps.
        print(f"\n  WARNING: {len(missing)} active categories missing "
              "(see wrapper Phase D for REVIEW-level analysis)")
    sys.exit(0)


if __name__ == "__main__":
    main()
