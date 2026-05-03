#!/usr/bin/env python3
"""
ORBIT Venice Scraper — Phase 1 (no TMDB)

Reads Wikipedia ceremony articles via the MediaWiki API. Venice is
winners-only — every extracted row has result="won". No DLu cross-check.
9 categories per ceremony per scope:
  Golden Lion, Grand Jury Prize, Silver Lion (Best Director), Special
  Jury Prize, Volpi Cup Best Actor, Volpi Cup Best Actress, Best
  Screenplay (Premio Osella), Marcello Mastroianni Award, Lion of the
  Future / Luigi De Laurentis Award.

Wikipedia structure observations (verified across 2000, 2013, 2024):
  - URL pattern: https://en.wikipedia.org/wiki/{Nth}_Venice_International_Film_Festival
    where Nth = year - 1943 (57th = 2000, 82nd = 2025).
  - Top-level Awards section: ^==\\s*Official\\s+Awards\\s*==
  - Main Competition heading varies ("Main Competition" / "In
    Competition (''Venezia 70'')") — match by wikilink target instead.
  - Lion of the Future appears in a separate ===-level subsection;
    Pass 2 (section-heading-driven) handles it the same way the Cannes
    scraper handles Caméra d'Or / Short Film Palme d'Or.
  - Tie format: parent line "* [[Category]]:" with sub-bullets.
  - Italian aliases / display variations (e.g. "Grand Special Jury
    Prize" vs "Grand Jury Prize") — wikilink target is the reliable
    anchor.

Categories interpretation note (see scrape-venice-categories.json):
  - venice.silver_lion_grand_jury captures Wikipedia's
    [[Grand Jury Prize (Venice Film Festival)]] — a separate award from
    Silver Lion that runs across the full 2000-2025 scope.
  - venice.silver_lion_best_director captures Wikipedia's [[Silver Lion]]
    — the Best Director prize in modern era (2013+), and a film+director
    second-tier prize pre-2013. Both eras share the wikilink target.

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
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-venice-categories.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "venice")
RAW_DIR = os.path.join(SCRAPED_DIR, "raw")

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "ORBIT-Awards-Scraper/1.0 (https://github.com/orbit-project/Film-discovery-)"
SCRAPE_VERSION = "scrape-venice-v1.0.0"

MIN_YEAR = 2000
MAX_YEAR = 2025
SKIPPED_YEARS = set()  # Venice 2020 ran on reduced format but awarded prizes

REQUEST_DELAY_SEC = 1.0

CSV_COLUMNS = [
    "year", "category_id", "result", "recipients_json", "film_title",
    "film_tmdb_id", "co_winner", "verified_status", "notes", "scraped_at",
]


def year_to_ordinal(year):
    """Venice ceremonies map year -> ordinal: Nth = year - 1943.
       57th = 2000, 70th = 2013, 77th = 2020, 82nd = 2025."""
    n = year - 1943
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


def fetch_wikipedia_wikitext(year):
    ordinal = year_to_ordinal(year)
    page_title = f"{ordinal}_Venice_International_Film_Festival"
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
    path = os.path.join(RAW_DIR, f"venice-{year}-wikipedia.json")
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
# Bullet parsing — same architecture as Cannes
# ---------------------------------------------------------------------------

RE_REF_TAG = re.compile(r"<ref[^>]*?/>|<ref[^>]*?>.*?</ref>", re.DOTALL | re.IGNORECASE)
RE_SMALL_TAG = re.compile(r"</?small\s*[^>]*>", re.IGNORECASE)
RE_LANG_TEMPLATE = re.compile(
    r"\{\{[Ll]ang\|[^|}]+\|([^}|]+)(?:\|[^}]*)?\}\}"
)
RE_TEMPLATE_SIMPLE = re.compile(r"\{\{(?:efn|notetag|cite[^|}]*)\b[^{}]*\}\}", re.IGNORECASE)
RE_TEMPLATE_GENERIC = re.compile(r"\{\{[^{}]*\}\}")


def unwrap_lang_templates(text):
    prev = None
    while text != prev:
        prev = text
        text = RE_LANG_TEMPLATE.sub(r"\1", text)
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


def find_category_bullets(awards_block, categories):
    """Two-pass matcher mirroring scrape-cannes.py."""
    found = {c["id"]: [] for c in categories}

    target_lookup = {}
    for cat in categories:
        for tgt in cat.get("wikilink_targets", []):
            target_lookup[tgt.lower()] = cat["id"]

    lines = awards_block.split("\n")

    # Compute Pass 1 line range — restrict to the Main Competition
    # subsection so we don't pick up Orizzonti / Short Films / Venice
    # Classics / Lifetime Achievement bullets that share category targets
    # (e.g. cer 2024 has Special Jury Prize bullets in BOTH Main
    # Competition AND Orizzonti — only the Main Competition one is in
    # our 9-category scope).
    mc_start, mc_end = _find_main_competition_range(lines)

    # Pass 1: bullet-driven matching, restricted to Main Competition range
    matched_line_indices = set()
    i = mc_start
    while i < mc_end:
        line = lines[i]
        if not line.startswith("*") or line.startswith("**"):
            i += 1
            continue
        body = line[1:].lstrip()
        body = unwrap_lang_templates(body)

        cat_id = _match_bullet_category(body, target_lookup, categories)
        if cat_id is None:
            i += 1
            continue

        # Skip Lifetime Achievement / honorary lines that share the
        # Golden Lion / Silver Lion targets but appear in their own
        # subsections. The 'lifetime' substring is the cleanest signal.
        if "lifetime" in body.lower() or "honorary" in body.lower():
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

    # Pass 2: section-heading-driven matching for categories whose
    # bullets don't carry inline category wikilinks. Used here for
    # Lion of the Future (Luigi De Laurentis Award) which lives in a
    # separate ===-level subsection.
    cat_lookup_by_id = {c["id"]: c for c in categories}
    for sec_start, sec_end, sec_cat_id in _find_category_sections(lines, target_lookup):
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
            if "lifetime" in body.lower() or "honorary" in body.lower():
                k += 1
                continue

            # Stop at distinct sub-award bullets — but DO NOT stop at
            # a bold-prefix bullet whose display matches the section's
            # category aliases. Required for cer 2025 Lion of the
            # Future where the canonical winner bullet is
            # "* '''Luigi De Laurentiis Award for a Debut Film''': ..."
            # — a bold-prefix that names the SAME award the section is
            # labelled with, not a distinct sub-award.
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


def _find_main_competition_range(lines):
    """Return (start_idx, end_idx) of the Main Competition subsection
    inside the Official Awards block. Limits Pass 1 bullet scanning to
    the canonical main-competition awards (Golden Lion, Silver Lion,
    Volpi Cups, etc.) and excludes Orizzonti / Short Films / Venice
    Classics / Lifetime Achievement / Lion of the Future subsections
    which carry their own awards using the same wikilink targets.
    """
    section_indices = []
    for i, line in enumerate(lines):
        m = re.match(r"^\s*===+\s*(.+?)\s*===+\s*$", line)
        if m:
            section_indices.append((i, m.group(1)))

    # No subsections at all → scan the entire awards_block (e.g. cer
    # 2003 has top-level bullets directly under == Official Awards == ).
    if not section_indices:
        return (0, len(lines))

    MC_KEYWORDS = ("main competition", "in competition", "venezia")
    NON_MC_KEYWORDS = (
        "lifetime", "honorary", "orizzonti", "horizons", "short film",
        "short films", "venice classics", "lion of the future",
        "luigi de laurentiis", "luigi de laurentis", "controcampo",
        "venice spotlight", "venice immersive", "glory to the filmmaker",
        "special awards", "digital cinema", "venice 70", "future reloaded",
        "cinéfondation",
    )

    # Find first heading containing an MC keyword
    for i, (idx, hd) in enumerate(section_indices):
        hd_lower = hd.lower()
        if any(kw in hd_lower for kw in MC_KEYWORDS):
            mc_start = idx + 1
            mc_end = section_indices[i + 1][0] if i + 1 < len(section_indices) else len(lines)
            return (mc_start, mc_end)

    # No MC heading found. If the FIRST heading is a non-MC keyword,
    # scan from awards block start to that heading (handles cer 2003
    # where Main Competition bullets are above the first === heading).
    first_idx, first_hd = section_indices[0]
    if any(kw in first_hd.lower() for kw in NON_MC_KEYWORDS):
        return (0, first_idx)

    # Else: assume the first heading IS the main competition (unrecognised
    # name). Scan that heading's range.
    next_idx = section_indices[1][0] if len(section_indices) > 1 else len(lines)
    return (first_idx + 1, next_idx)


def _bullet_matches_section_aliases(body, section_cat):
    """Return True if a bold-prefix-with-colon bullet's display text matches
    one of the section_cat's display_aliases — meaning this is the
    section's canonical winner bullet, not a distinct sub-award.
    """
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


# Wikilink targets shared across multiple Venice award categories; for
# bullets with these targets, the wikilink display text must be inspected
# to disambiguate (e.g. [[Silver Lion|Silver Lion for Best Director]] vs
# [[Silver Lion|Silver Lion for Best Short Film]] — only the first is in
# our 9 categories; [[Golden Osella|Golden Osella for Best Screenplay]]
# vs [[Golden Osella|Golden Osella for Best Cinematography]] — only the
# first maps to best_screenplay).
AMBIGUOUS_TARGETS = {"silver lion", "golden osella"}


def _match_bullet_category(body, target_lookup, categories):
    # First wikilink match (allow leading italic markers)
    m = re.match(r"^\s*(?:'')?\s*\[\[([^|\]]+)(?:\|([^\]]+))?\]\](?:'')?\s*:?", body)
    if m:
        target = m.group(1).strip().lower()
        display = (m.group(2) or m.group(1)).strip().lower()

        # If target is ambiguous, REQUIRE a display-alias match.
        # Without this, [[Silver Lion|Silver Lion for Best Short Film]]
        # would incorrectly match silver_lion_best_director just because
        # the target "Silver Lion" is in that category's wikilink_targets.
        if target in AMBIGUOUS_TARGETS:
            for cat in categories:
                for alias in cat.get("display_aliases", []):
                    al = alias.lower()
                    if display == al or al in display:
                        return cat["id"]
            return None

        # Non-ambiguous target — direct lookup.
        cat_id = target_lookup.get(target)
        if cat_id:
            return cat_id

    # Bold-prefix display alias fallback
    m = re.match(r"^\s*'''([^']+)''':", body)
    if m:
        display = m.group(1).strip().lower()
        for cat in categories:
            for alias in cat.get("display_aliases", []):
                if alias.lower() == display:
                    return cat["id"]
    return None


def _bullet_has_inline_category_marker(body):
    if re.match(r"^\s*'''[^']+'''\s*:", body):
        return True
    if re.match(r"^\s*\[\[[^\]]+\]\]\s*:", body) and not body.lstrip().startswith("''"):
        return True
    return False


def _find_category_sections(lines, target_lookup):
    """Yield (start_idx, end_idx, category_id) for === sub-sections whose
    heading matches one of our category targets/aliases. Used for Lion of
    the Future (Luigi De Laurentis subsection).
    """
    section_indices = []
    for i, line in enumerate(lines):
        m = re.match(r"^\s*===+\s*(.+?)\s*===+\s*$", line)
        if m:
            section_indices.append((i, m.group(1)))
    section_indices.append((len(lines), None))

    # Distinctive substrings for Lion of the Future / Luigi De Laurentiis
    # heading detection. Headings vary widely:
    #   "Lion of the Future"
    #   "Luigi De Laurentis Award for Debut Feature"
    #   '"Luigi de Laurentis" Award for a Debut Film' (with quote chars)
    #   "''Luigi De Laurentiis'' Venice Award For A Debut Film"
    #   '"''Luigi de Laurentiis''" Award For A Debut Film (Lion of the Future)'
    # Looser substring match needed to cover all variants.
    LION_OF_FUTURE_SUBSTRINGS = (
        "lion of the future",
        "luigi de laurentiis",
        "luigi de laurentis",
    )

    for idx, (line_idx, heading) in enumerate(section_indices):
        if heading is None:
            continue
        if "lifetime" in heading.lower() or "honorary" in heading.lower():
            continue
        # Strip italic markers, templates, and double-quote chars from heading
        clean_heading = re.sub(r"\{\{[^}]*\}\}", "", heading)
        clean_heading = re.sub(r"''", "", clean_heading)
        clean_heading = clean_heading.replace('"', '').strip()
        wm = re.search(r"\[\[([^|\]]+)(?:\|[^\]]+)?\]\]", clean_heading)
        cat_id = None
        if wm:
            cat_id = target_lookup.get(wm.group(1).strip().lower())
        if cat_id is None:
            heading_text = re.sub(r"\[\[|\]\]", "", clean_heading).strip().lower()
            for sub in LION_OF_FUTURE_SUBSTRINGS:
                if sub in heading_text:
                    cat_id = "venice.lion_of_the_future"
                    break
        if cat_id is None:
            continue
        next_line_idx = section_indices[idx + 1][0]
        yield (line_idx + 1, next_line_idx, cat_id)


# ---------------------------------------------------------------------------
# Winner extraction — same as Cannes
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
        if not winner:
            return []
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
    # Bare wikilink prefix with optional " for Y" qualifier:
    # "[[Silver Lion]] for Best Director: " (cer 2014 Venice format
    # where the Best Director qualifier is plain text after the wikilink).
    m = re.match(r"^\s*\[\[[^\]]+\]\](?:\s+for\s+[^:]+)?\s*:\s*", body)
    if m:
        return body[m.end():]
    # Bold prefix with embedded apostrophes — bold-italic-bold combo
    # like cer 2014 Venice "* '''''Luigi De Laurentiis'' Award for a
    # Debut Film''': ...". Match 3-5 leading apostrophes through to
    # 3-5 trailing apostrophes + colon (non-greedy).
    m = re.match(r"^\s*'{3,5}.*?'{3,5}\s*:\s*", body, re.DOTALL)
    if m:
        return body[m.end():]
    # Simple bold prefix (no embedded apostrophes in display)
    m = re.match(r"^\s*'''[^']+'''\s*:\s*", body)
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

    # F1: starts with italic film title
    m = re.match(r"^''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''(.*)$", content)
    if m:
        film = (m.group(1) or m.group(2) or "").strip()
        rest = m.group(3).strip()
        rest = re.sub(r"^\s*(?:by|de)\s+", "", rest, flags=re.IGNORECASE)
        recipients = _extract_persons(rest)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        return {"film_title": film, "recipients": recipients}

    # F1b: starts with non-italic wikilinked film, then "by ..." (cer
    # 2002 Venice Silver Lion: '[[Oasis (2002 film)|Oasis]] by
    # [[Lee Chang-dong]]'). Some Venice rows in older years format the
    # film name without italic markers.
    m = re.match(r"^\[\[(?:[^|\]]*\|)?([^\]]+)\]\]\s+by\s+(.*)$", content, re.IGNORECASE)
    if m:
        film = m.group(1).strip()
        rest = m.group(2).strip()
        recipients = _extract_persons(rest)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        return {"film_title": film, "recipients": recipients}

    # F2/F3: starts with person(s), then "for ''Film''"
    parts = re.split(r"\s+for\s+", content, maxsplit=1, flags=re.IGNORECASE)
    if len(parts) == 2:
        left, right = parts[0].strip(), parts[1].strip()
        recipients = _extract_persons(left)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        film_match = re.search(r"''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''", right)
        if film_match:
            film = (film_match.group(1) or film_match.group(2) or "").strip()
        else:
            film = re.sub(r"''", "", right).strip()
        return {"film_title": film, "recipients": recipients}

    # Fallback
    film_match = re.search(r"''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''", content)
    film = ""
    if film_match:
        film = (film_match.group(1) or film_match.group(2) or "").strip()
    persons = _extract_persons(content)
    persons = [p for p in persons if p.lower() not in NON_PERSON_NAMES]
    if film or persons:
        return {"film_title": film, "recipients": persons}
    return None


NON_PERSON_NAMES = {
    "production design", "set decoration", "art direction",
    "set decorator", "art director",
    "posthumous award", "posthumous", "honorary award", "honorary",
    "the play", "the novel", "the book", "his novel", "her novel",
    "the short story", "the memoir", "the biography",
    "the screenplay", "the article", "the story",
    "special mention",
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
    cleaned = re.sub(r"\s+&\s+", ", ", cleaned)
    cleaned = re.sub(r"\s+and\s+", ", ", cleaned)
    cleaned = re.sub(r"^by\s+", "", cleaned, flags=re.IGNORECASE)
    parts = [p.strip() for p in cleaned.split(",") if p.strip()]
    return [p for p in parts
            if len(p) > 1 and not p.isdigit()
            and p.lower() not in NON_PERSON_NAMES]


# ---------------------------------------------------------------------------
# Row building
# ---------------------------------------------------------------------------

def build_rows(year, categories, found, page_url):
    rows = []
    scraped_at = datetime.now(timezone.utc).isoformat()
    for cat in categories:
        bullets = found.get(cat["id"], [])
        if not bullets:
            continue
        for parent_body, sub_bullets in bullets:
            winners = extract_winners_from_bullet(parent_body, sub_bullets, cat)
            for w in winners:
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
        description="ORBIT Venice Scraper — scrape Venice ceremony data from Wikipedia"
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
    print(f"Scraping {ordinal} Venice International Film Festival ({year})")
    print("=" * 60)

    print("\n[1] Loading categories")
    categories = load_categories()
    print(f"  Categories defined: {len(categories)}")
    for c in categories:
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
    found = find_category_bullets(awards_block, categories)
    for cat in categories:
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
    for cat in categories:
        n = cat_counts.get(cat["id"], 0)
        marker = "  ← MISSING" if n == 0 else ""
        print(f"  {cat['display_name']:50s}: {n} winner row(s){marker}")
        if n == 0:
            missing.append(cat["display_name"])

    csv_path = os.path.join(SCRAPED_DIR, f"venice-{year}.csv")
    if args.dry_run:
        print(f"\n  --dry-run: would write to {csv_path}")
    else:
        write_csv(rows, csv_path)
        print(f"\n  [scrape-venice {year}] Output: {csv_path}")

    if missing:
        print(f"\n  WARNING: {len(missing)} categories missing")
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
