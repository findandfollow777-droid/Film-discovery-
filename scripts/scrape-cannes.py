#!/usr/bin/env python3
"""
ORBIT Cannes Scraper — Phase 1 (no TMDB)

Reads Wikipedia ceremony articles via the MediaWiki API. Cannes is
winners-only — every extracted row has result="won". No DLu cross-check
(unlike Oscar). 8 categories per ceremony per scope:
  Palme d'Or, Grand Prix, Jury Prize, Best Director, Best Actor,
  Best Actress, Best Screenplay, Caméra d'Or, Short Film Palme d'Or.

Wikipedia structure observations (verified across 2000, 2010, 2019, 2022,
2024, 2025):
  - URL pattern: https://en.wikipedia.org/wiki/{year}_Cannes_Film_Festival
  - Top-level Awards section: ^==\\s*(?:Official\\s+)?Awards?\\s*==
  - Within the Awards block, target categories appear as bullet lines.
  - Subsection heading names vary too widely to use as anchors
    ("In Competition" vs "Main Competition", "Caméra d'Or" vs
    "Golden Camera", "Short Film Palme d'Or" vs "Short films" etc.)
  - Match category bullets by wikilink target (e.g. [[Palme d'Or]])
    which is consistent across years even when the display text differs
    (e.g. "Prix du Jury" displayed against [[Jury Prize (...)|...]] target).
  - Tie format: parent line "* [[Category]]:" with sub-bullets "** ..."
    listing each tied winner.
  - Inline format for team awards (e.g. 2024 Best Actress, 4 actresses
    on one film): "* [[Category]]: [[A]], [[B]], [[C]], and [[D]] for
    ''[[Film]]''"
  - Special Mentions appear as sub-bullets and must be skipped.

Dependencies: stdlib + requests + mwparserfromhell (mwparserfromhell is
unused here — we parse line-by-line — kept as a soft import for parity
with scrape-oscar.py).
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
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-cannes-categories.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "cannes")
RAW_DIR = os.path.join(SCRAPED_DIR, "raw")

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "ORBIT-Awards-Scraper/1.0 (https://github.com/orbit-project/Film-discovery-)"
SCRAPE_VERSION = "scrape-cannes-v1.0.0"

# Cannes 2020 was cancelled — no awards given. The 2021 article covers the
# delayed return ceremony (74th). 2000-2025 with 2020 absent = 25 ceremonies.
SKIPPED_YEARS = {2020}
MIN_YEAR = 2000
MAX_YEAR = 2025

REQUEST_DELAY_SEC = 1.0

CSV_COLUMNS = [
    "year", "category_id", "result", "recipients_json", "film_title",
    "film_tmdb_id", "co_winner", "verified_status", "notes", "scraped_at",
]


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
    """Fetch wikitext for {year}_Cannes_Film_Festival."""
    page_title = f"{year}_Cannes_Film_Festival"
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
    path = os.path.join(RAW_DIR, f"cannes-{year}-wikipedia.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  Raw response saved to {path}")


# ---------------------------------------------------------------------------
# Awards block extraction
# ---------------------------------------------------------------------------

def extract_awards_block(wikitext):
    """Return the wikitext slice that is the top-level Awards section.

    Anchors on ^== Official Awards ==$ or ^== Awards ==$ (case-insensitive)
    and runs until the next == heading or end of text.
    """
    m = re.search(r"^==\s*(?:Official\s+)?Awards?\s*==", wikitext, re.MULTILINE | re.IGNORECASE)
    if not m:
        return None
    start = m.end()
    end_m = re.search(r"^==[^=]", wikitext[start:], re.MULTILINE)
    end = start + (end_m.start() if end_m else len(wikitext) - start)
    return wikitext[start:end]


# ---------------------------------------------------------------------------
# Bullet parsing
# ---------------------------------------------------------------------------

# Strip <ref ... /> self-closing and <ref ...>...</ref> spans.
RE_REF_TAG = re.compile(r"<ref[^>]*?/>|<ref[^>]*?>.*?</ref>", re.DOTALL | re.IGNORECASE)
# Strip <small>...</small> tags but keep content (some wikilinks live inside)
RE_SMALL_TAG = re.compile(r"</?small\s*[^>]*>", re.IGNORECASE)
# Unwrap {{lang|fr|<content>|italic=no}} or {{lang|fr|<content>}} keeping the
# second positional argument (content) but discarding the language code and
# any italic= flag. Used by 2002/2006/2011/2015/2016/2019 to wrap category
# wikilinks like {{lang|fr|[[Palme d'Or]]|italic=no}}.
RE_LANG_TEMPLATE = re.compile(
    r"\{\{[Ll]ang\|[^|}]+\|([^}|]+)(?:\|[^}]*)?\}\}"
)
# Strip {{efn|...}} / {{notetag|...}} / {{cite ...}}
RE_TEMPLATE_SIMPLE = re.compile(r"\{\{(?:efn|notetag|cite[^|}]*)\b[^{}]*\}\}", re.IGNORECASE)
# Strip generic bracket-balanced templates (catch-all for residual {{x|...}})
RE_TEMPLATE_GENERIC = re.compile(r"\{\{[^{}]*\}\}")


def unwrap_lang_templates(text):
    """Replace {{lang|<code>|<content>|italic=no}} with <content>.
    Run BEFORE generic template stripping so the inner content (often a
    wikilink) survives.
    """
    prev = None
    while text != prev:
        prev = text
        text = RE_LANG_TEMPLATE.sub(r"\1", text)
    return text


def clean_inline_wikitext(text):
    """Strip ref tags, small tags, and templates from a line.

    Lang templates ({{lang|fr|...|italic=no}}) are unwrapped first so
    inner content (often a wikilink) survives. Other templates are
    stripped entirely.
    """
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
    """Scan the Awards block for bullet lines matching each target category.

    Returns dict: category_id -> list of (parent_line_clean, sub_bullets[]).
    Sub-bullets are the lines immediately following the parent bullet that
    start with "**" (used for tie format and team listings).

    Two passes:
      Pass 1 — bullet-driven: scan top-level bullets and match by wikilink
      target or bold-display alias in the bullet itself. Catches Palme
      d'Or, Grand Prix, Jury Prize, Best Director, Best Actor, Best
      Actress, Best Screenplay (which all have inline category wikilinks).

      Pass 2 — section-heading-driven: find subsections whose heading
      contains a known category wikilink target (Caméra d'Or, Short
      Film Palme d'Or). All bullets in that subsection that haven't
      already been matched in Pass 1 belong to the section's category.
      Catches the cases where bullets are just "* ''Film'' by Director"
      with no inline category marker.
    """
    found = {c["id"]: [] for c in categories}

    target_lookup = {}
    for cat in categories:
        for tgt in cat.get("wikilink_targets", []):
            target_lookup[tgt.lower()] = cat["id"]

    lines = awards_block.split("\n")

    # Pass 1: bullet-driven matching
    matched_line_indices = set()
    i = 0
    while i < len(lines):
        line = lines[i]
        # Top-level bullet: starts with single * (not **) and the next
        # char is something other than another *. Permit all forms:
        # "* ", "*[", "*'", "*{", "*<" — needed because some category
        # bullets start with {{lang|...}} templates, italic markers, or
        # ref tags directly after the asterisk.
        if not line.startswith("*") or line.startswith("**"):
            i += 1
            continue
        body = line[1:].lstrip()

        # Unwrap lang templates BEFORE category matching so years that
        # use {{lang|fr|[[Palme d'Or]]|italic=no}} prefixes resolve to
        # the bare wikilink (matched by target_lookup).
        body = unwrap_lang_templates(body)

        cat_id = _match_bullet_category(body, target_lookup, categories)
        if cat_id is None:
            i += 1
            continue

        if "honorary" in body.lower():
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
    # bullets don't carry inline category wikilinks (Caméra d'Or, Short
    # Film Palme d'Or). Find ===Heading=== whose wikilink target matches
    # one of our category targets, then claim its top-level bullets.
    #
    # Stop collecting at the first top-level bullet that carries its own
    # inline category marker (bold prefix like "* '''Short Film Jury
    # Prize''':" or a category-wikilink prefix). Those bullets are
    # distinct sub-awards within the section, not winners of the
    # section's main category. Required for cer 2001 Short Film Palme
    # d'Or section which lists the actual Palme bullet first then a
    # separate "Short Film Jury Prize" sub-award with its own tie.
    for sec_start, sec_end, sec_cat_id in _find_category_sections(lines, target_lookup):
        if found.get(sec_cat_id):
            continue
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
            if "honorary" in body.lower():
                k += 1
                continue

            # Stop at any bullet that has its own category marker —
            # bold prefix with colon ("* '''X''':") or a wikilink
            # prefix with colon ("* [[X]]:"). Those are different
            # awards, not winners of this section's category.
            if _bullet_has_inline_category_marker(body):
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


def _bullet_has_inline_category_marker(body):
    """Return True if the bullet body looks like a distinct named
    sub-award rather than a plain film+director winner.

    Heuristic: bold-prefix-with-colon ("'''Name''':") or
    wikilink-prefix-with-colon ("[[Page]]:" / "[[Page|Display]]:") at
    the start indicates a different award being introduced.
    """
    if re.match(r"^\s*'''[^']+'''\s*:", body):
        return True
    # A wikilink prefix followed by colon is a category marker only if
    # the wikilink is NOT the film title (films are wrapped in italics).
    # If the bullet starts with ''[[...]]'' (italic film title), there's
    # no category marker. If it starts with [[X]]: (no italics), that's
    # a category marker.
    if re.match(r"^\s*\[\[[^\]]+\]\]\s*:", body) and not body.lstrip().startswith("''"):
        return True
    return False


def _find_category_sections(lines, target_lookup):
    """Yield (start_idx, end_idx, category_id) for === sub-sections whose
    heading wikilink target matches one of our category targets.

    end_idx is exclusive (next sub-section heading or end of lines).
    """
    section_indices = []
    for i, line in enumerate(lines):
        m = re.match(r"^\s*===+\s*(.+?)\s*===+\s*$", line)
        if m:
            section_indices.append((i, m.group(1)))
    section_indices.append((len(lines), None))

    for idx, (line_idx, heading) in enumerate(section_indices):
        if heading is None:
            continue
        # Skip Honorary Palme d'Or sections (separate category not in
        # our 8). Without this guard the substring fallback below would
        # incorrectly classify "Honorary Palme d'Or" as a Palme d'Or hit.
        heading_lower = heading.lower()
        if "honorary" in heading_lower:
            continue
        # Strip italic markers and templates from heading
        clean_heading = re.sub(r"\{\{[^}]*\}\}", "", heading)
        clean_heading = re.sub(r"''", "", clean_heading).strip()
        # Find wikilink in heading, if any
        wm = re.search(r"\[\[([^|\]]+)(?:\|[^\]]+)?\]\]", clean_heading)
        cat_id = None
        if wm:
            cat_id = target_lookup.get(wm.group(1).strip().lower())
        if cat_id is None:
            # Try matching the cleaned heading directly against display
            # aliases (e.g. "Golden Camera" plain-text heading). Only use
            # exact match here — substring matching is too permissive.
            heading_text = re.sub(r"\[\[|\]\]", "", clean_heading).strip().lower()
            display_lookup = {}
            display_lookup_data = [
                ("camera d'or", "cannes.camera_dor"),
                ("caméra d'or", "cannes.camera_dor"),
                ("golden camera", "cannes.camera_dor"),
                ("short film palme d'or", "cannes.short_film_palme_dor"),
                ("short films competition", "cannes.short_film_palme_dor"),
                ("short film competition", "cannes.short_film_palme_dor"),
                ("short films", "cannes.short_film_palme_dor"),
            ]
            for alias, cid in display_lookup_data:
                if heading_text == alias:
                    cat_id = cid
                    break
        if cat_id is None:
            continue
        next_line_idx = section_indices[idx + 1][0]
        yield (line_idx + 1, next_line_idx, cat_id)


def _match_bullet_category(body, target_lookup, categories):
    """Return category_id if this bullet body line matches one of the
    8 target categories, else None.

    Matching strategy (in order):
      1. First wikilink in the line (allowing optional leading italic
         markers): if its target matches a known wikilink_target, use
         that. Older Cannes articles (2000-2019, sporadically) wrap the
         category wikilink in italics: "''[[Palme d'Or]]'':".
      2. If no wikilink, first bolded segment ('''...'''): match against
         display_aliases.
      3. Else None.
    """
    # Allow leading italic markers (some years italicize category wikilinks)
    m = re.match(r"^\s*(?:'')?\s*\[\[([^|\]]+)(?:\|[^\]]+)?\]\](?:'')?\s*:?", body)
    if m:
        target = m.group(1).strip()
        cat_id = target_lookup.get(target.lower())
        if cat_id:
            return cat_id

    # Try bold-prefix display alias
    m = re.match(r"^\s*'''([^']+)''':", body)
    if m:
        display = m.group(1).strip().lower()
        for cat in categories:
            for alias in cat.get("display_aliases", []):
                if alias.lower() == display:
                    return cat["id"]
    return None


# ---------------------------------------------------------------------------
# Winner extraction
# ---------------------------------------------------------------------------

def extract_winners_from_bullet(parent_body, sub_bullets, cat):
    """Given a category-matched parent bullet and its sub-bullets, return a
    list of winner dicts: {film_title, recipients[], co_winner}.

    Cases:
      A) Parent has content after the category prefix (no sub-bullets, or
         sub-bullets are Special Mentions to skip):
         * "[[Cat]]: ''[[Film]]'' by [[Person]]"   → 1 winner
         * "[[Cat]]: [[Person1]], [[Person2]] for ''[[Film]]''" → split per
           split_co_recipients
      B) Parent is empty after the prefix; sub-bullets carry the winners
         (tie format):
         * "[[Cat]]:"
         * "** ''[[Film1]]'' by [[Dir1]]"
         * "** ''[[Film2]]'' by [[Dir2]]"
         → 2 winners, both co_winner=true
    """
    # Extract content after the category prefix
    content = _strip_category_prefix(parent_body, cat)
    content = clean_inline_wikitext(content)
    sub_bullets_clean = [clean_inline_wikitext(s) for s in sub_bullets]

    # Filter sub-bullets: skip "Special Mention" lines
    real_subs = [
        s for s in sub_bullets_clean
        if s and not _is_special_mention(s)
    ]

    if content:
        # Case A: parent line has content. Sub-bullets (if any) are
        # almost always Special Mentions — already filtered out above.
        # If split_co_recipients is true and the line lists multiple
        # recipients (e.g. team Best Actress), split_co_recipients controls
        # whether to split.
        winner = _parse_winner_line(content, cat)
        if not winner:
            return []

        # If the category is a person-typed split-co-recipients category
        # AND the line has multiple recipients ("A, B and C for Film"),
        # produce one row per recipient with co_winner=true.
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

    # Case B: parent is empty, sub-bullets are the winners (tie format).
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
    """Remove the leading "[[Cat|...]]:" or "'''Cat''':" prefix and return
    the remaining content."""
    # Remove first wikilink-prefix-with-colon
    m = re.match(r"^\s*\[\[[^\]]+\]\]\s*:\s*", body)
    if m:
        return body[m.end():]
    # Remove first bold-prefix-with-colon
    m = re.match(r"^\s*'''[^']+'''\s*:\s*", body)
    if m:
        return body[m.end():]
    return body


def _is_special_mention(text):
    """Detect Special Mention sub-bullets to skip."""
    text_lower = text.lower().lstrip("'").lstrip()
    return text_lower.startswith("special mention") or text_lower.startswith("'special mention")


def _parse_winner_line(content, cat):
    """Parse a single winner line into {film_title, recipients[]}.

    Cannes formats observed:
      F1: ''[[Film]]'' by [[Director]]                      (film-typed cats)
      F2: [[Person]] for ''[[Film]]''                       (person-typed)
      F3: [[Person1]], [[Person2]] for ''[[Film]]''         (team award)
      F4: ''[[Film]]'' by [[A]] and [[B]]                   (co-direction)
      F5: [[Person]] for ''[[Film]]''                       (no co's)
    """
    content = content.strip()
    if not content:
        return None

    # F1 / F4: starts with italic film title
    m = re.match(r"^''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''(.*)$", content)
    if m:
        film = (m.group(1) or m.group(2) or "").strip()
        rest = m.group(3).strip()
        # rest starts with " by ..." giving director(s)
        rest = re.sub(r"^\s*(?:by|de)\s+", "", rest, flags=re.IGNORECASE)
        recipients = _extract_persons(rest)
        # Drop spurious recipient artifacts (role/source labels)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        return {"film_title": film, "recipients": recipients}

    # F2 / F3 / F5: starts with person(s), then "for ''Film''"
    # Split on " for " (case-insensitive, only the first occurrence)
    parts = re.split(r"\s+for\s+", content, maxsplit=1, flags=re.IGNORECASE)
    if len(parts) == 2:
        left, right = parts[0].strip(), parts[1].strip()
        recipients = _extract_persons(left)
        recipients = [r for r in recipients if r.lower() not in NON_PERSON_NAMES]
        # Extract film from right (italic + optional wikilink)
        film_match = re.search(r"''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''", right)
        if film_match:
            film = (film_match.group(1) or film_match.group(2) or "").strip()
        else:
            film = re.sub(r"''", "", right).strip()
        return {"film_title": film, "recipients": recipients}

    # Fallback: try to extract film + first wikilinked person
    film_match = re.search(r"''(?:\[\[(?:[^|\]]*\|)?([^\]]+)\]\]|([^']+))''", content)
    film = ""
    if film_match:
        film = (film_match.group(1) or film_match.group(2) or "").strip()
    persons = _extract_persons(content)
    persons = [p for p in persons if p.lower() not in NON_PERSON_NAMES]
    if film or persons:
        return {"film_title": film, "recipients": persons}
    return None


# Filter list — same role-label / annotation classes used by the Oscar
# scraper, applied here to recipient extraction. Cannes is unlikely to hit
# most of these but the filter is cheap.
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
    """Extract person names from a fragment that may have multiple
    wikilinked or plain-text names separated by ', ' / ' and ' / ' & '.
    """
    # Drop italic film-title spans first so they aren't picked up as people
    text = re.sub(r"''[^']+''", "", text)
    # Find all wikilink display names
    persons = []
    for m in re.finditer(r"\[\[([^|\]]+)(?:\|([^\]]+))?\]\]", text):
        name = (m.group(2) or m.group(1)).strip()
        if name and len(name) > 1:
            persons.append(name)
    if persons:
        return persons
    # No wikilinks — fall back to comma/and-split on cleaned plain text
    cleaned = re.sub(r"\[\[|\]\]|''", "", text).strip()
    cleaned = re.sub(r"\s+&\s+", ", ", cleaned)
    cleaned = re.sub(r"\s+and\s+", ", ", cleaned)
    cleaned = re.sub(r"^by\s+", "", cleaned, flags=re.IGNORECASE)
    parts = [p.strip() for p in cleaned.split(",") if p.strip()]
    # Filter very short / numeric / role-label residues
    return [p for p in parts
            if len(p) > 1 and not p.isdigit()
            and p.lower() not in NON_PERSON_NAMES]


# ---------------------------------------------------------------------------
# Row building
# ---------------------------------------------------------------------------

def build_rows(year, categories, found, page_url):
    """Convert per-category winners into CSV rows."""
    rows = []
    scraped_at = datetime.now(timezone.utc).isoformat()

    for cat in categories:
        bullets = found.get(cat["id"], [])
        if not bullets:
            continue
        # Each bullet is one (parent, sub_bullets) match. Iterate all and
        # accumulate winners from each (typically one bullet per category).
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


# ---------------------------------------------------------------------------
# CSV output
# ---------------------------------------------------------------------------

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
        description="ORBIT Cannes Scraper — scrape Cannes ceremony data from Wikipedia"
    )
    parser.add_argument("--year", type=int, required=True,
                        help=f"Ceremony year (range {MIN_YEAR}-{MAX_YEAR}, 2020 cancelled)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Run scrape and show summary without writing CSV")
    args = parser.parse_args()

    year = args.year
    if year in SKIPPED_YEARS:
        print(f"ERROR: Year {year} is in the skipped-years list (Cannes was cancelled).")
        sys.exit(1)
    if year < MIN_YEAR or year > MAX_YEAR:
        print(f"ERROR: Year {year} outside scope [{MIN_YEAR}, {MAX_YEAR}].")
        sys.exit(1)
    today = date.today()
    if year > today.year + 1:
        print(f"ERROR: Year {year} is in the future.")
        sys.exit(1)

    print(f"Scraping {year} Cannes Film Festival")
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
        print("  FATAL: No 'Official Awards' or 'Awards' top-level section found.")
        sys.exit(1)
    print(f"  Awards block: {len(awards_block)} chars")

    print("\n[4] Matching category bullets")
    found = find_category_bullets(awards_block, categories)
    for cat in categories:
        n = len(found.get(cat["id"], []))
        print(f"  {cat['display_name']:30s}: {n} bullet match(es)")

    print(f"\n[5] Building rows")
    rows = build_rows(year, categories, found, page_url)
    print(f"  Total rows: {len(rows)}")

    # Summary
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
        print(f"  {cat['display_name']:30s}: {n} winner row(s){marker}")
        if n == 0:
            missing.append(cat["display_name"])

    csv_path = os.path.join(SCRAPED_DIR, f"cannes-{year}.csv")
    if args.dry_run:
        print(f"\n  --dry-run: would write to {csv_path}")
    else:
        write_csv(rows, csv_path)
        print(f"\n  [scrape-cannes {year}] Output: {csv_path}")

    if missing:
        print(f"\n  WARNING: {len(missing)} categories missing")
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
