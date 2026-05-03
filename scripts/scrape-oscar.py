#!/usr/bin/env python3
"""
ORBIT Oscar Scraper — Phase 1 (no TMDB)

Reads Wikipedia ceremony articles via the MediaWiki API as primary source,
cross-checks against the DLu/oscar_data community dataset, flags
disagreements for human review. Produces one CSV per ceremony in canonical
schema shape.

Dependencies: stdlib + requests + mwparserfromhell

Wikipedia wikitext structure observations (96th Academy Awards):
  - All award categories live inside a {{Award category|...}} template
    within the ===Awards=== subsection of ==Winners and nominees==.
  - Winner line: single bullet `* '''...'''` (bold, often with ‡ dagger)
  - Nominee lines: double bullet `** ...`
  - Film names: ''[[Film (disambiguation)|Film Title]]'' (italic wikilinks)
  - Person names: [[Person Name]] or [[Person Name|Display Name]]
  - Category header: {{Award category|#F9EFAA|[[Academy Award for X|Display Name]]}}
  - The pattern is consistent from at least ceremony 72 (2000) onwards.
  - Ordinal suffixes: 1st, 2nd, 3rd, 4th-20th, 21st, 22nd, 23rd, etc.
    (11th, 12th, 13th are exceptions).

DLu/oscar_data structure (oscars.csv, tab-separated):
  - Columns: Ceremony, Year, Class, CanonicalCategory, Category, Film,
    FilmId, Name, Nominees, NomineeIds, Winner, Detail, Note, Citation
  - Winner column: "True" for winners, empty for nominees
  - Year format: "YYYY/YY" (ceremony year span)
  - CanonicalCategory: ALL CAPS (e.g. "ACTOR IN A LEADING ROLE")
  - Post-ceremony-92, Sound Editing merged into Sound Mixing (category
    field becomes "SOUND" but canonical stays "SOUND MIXING")
"""

import argparse
import csv
import json
import os
import re
import sys
import time
from collections import defaultdict
from datetime import date, datetime, timezone

try:
    import requests
except ImportError:
    print("ERROR: 'requests' is required. Install with: pip3 install requests")
    sys.exit(1)

try:
    import mwparserfromhell
except ImportError:
    print("ERROR: 'mwparserfromhell' is required. Install with: pip3 install mwparserfromhell")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-oscar-categories.json")
DLU_CSV_PATH = os.path.join(REPO_ROOT, "data", "reference", "dlu-oscar-data.csv")
DLU_RAW_URL = "https://raw.githubusercontent.com/DLu/oscar_data/master/oscars.csv"
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "oscar")
RAW_DIR = os.path.join(SCRAPED_DIR, "raw")

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "ORBIT-Awards-Scraper/1.0 (https://github.com/orbit-project/Film-discovery-)"
SCRAPE_VERSION = "scrape-oscar-v1.2.0"

# Ceremony 72 = year 2000. Ceremony N = year (N + 1928).
CEREMONY_YEAR_OFFSET = 1928
MIN_CEREMONY = 72

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ceremony_to_year(ceremony_num):
    return ceremony_num + CEREMONY_YEAR_OFFSET


def ordinal(n):
    """Return ordinal string: 1->1st, 2->2nd, 3->3rd, 72->72nd, etc."""
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def slugify(text):
    """Slugify per schema §3.2: lowercase, replace non-alphanum with _, collapse."""
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = s.strip("_")
    return s


def fetch_with_retry(url, params=None, headers=None, max_retries=3):
    """GET with exponential backoff."""
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=30)
            resp.raise_for_status()
            return resp
        except requests.RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  Retry {attempt+1}/{max_retries} after {wait}s: {e}")
            time.sleep(wait)


# ---------------------------------------------------------------------------
# DLu data
# ---------------------------------------------------------------------------

def ensure_dlu_data():
    """Download DLu CSV if not cached. Return True if available."""
    if os.path.isfile(DLU_CSV_PATH):
        print(f"  DLu data cached at {DLU_CSV_PATH}")
        return True
    print(f"  Downloading DLu oscar_data from {DLU_RAW_URL}...")
    os.makedirs(os.path.dirname(DLU_CSV_PATH), exist_ok=True)
    try:
        resp = fetch_with_retry(DLU_RAW_URL, headers={"User-Agent": USER_AGENT})
        with open(DLU_CSV_PATH, "w", encoding="utf-8") as f:
            f.write(resp.text)
        print(f"  Saved to {DLU_CSV_PATH}")
        return True
    except Exception as e:
        print(f"  WARNING: Failed to download DLu data: {e}")
        return False


def load_dlu_rows(ceremony_num):
    """Load DLu rows for a specific ceremony. Returns list of dicts."""
    if not os.path.isfile(DLU_CSV_PATH):
        return []
    rows = []
    with open(DLU_CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for r in reader:
            if r.get("Ceremony", "") == str(ceremony_num):
                rows.append(r)
    return rows


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

def load_categories():
    """Load category definitions from JSON."""
    with open(CATEGORIES_FILE, encoding="utf-8") as f:
        return json.load(f)


def active_categories(categories, year):
    """Filter categories active in a given ceremony year."""
    active = []
    for cat in categories:
        fy = cat["first_year"]
        ly = cat["last_year"]
        if year < fy:
            continue
        if ly is not None and year > ly:
            continue
        active.append(cat)
    return active


def get_historical_name(cat, year):
    """Get the display name active in a given year from historical_names."""
    for hn in cat["historical_names"]:
        if year >= hn["from"] and (hn["to"] is None or year <= hn["to"]):
            return hn["name"]
    return cat["display_name"]


# ---------------------------------------------------------------------------
# Wikipedia fetching
# ---------------------------------------------------------------------------

def fetch_wikipedia_wikitext(ceremony_num):
    """Fetch wikitext for the ceremony article. Returns (wikitext, page_url)."""
    page_title = f"{ordinal(ceremony_num)}_Academy_Awards"
    page_url = f"https://en.wikipedia.org/wiki/{page_title}"

    params = {
        "action": "parse",
        "page": page_title,
        "format": "json",
        "prop": "wikitext",
    }
    headers = {"User-Agent": USER_AGENT}

    print(f"  Fetching Wikipedia: {page_title}")
    resp = fetch_with_retry(WIKIPEDIA_API, params=params, headers=headers)
    data = resp.json()

    if "error" in data:
        raise RuntimeError(f"Wikipedia API error: {data['error'].get('info', data['error'])}")

    wikitext = data["parse"]["wikitext"]["*"]
    return wikitext, page_url, data


def save_raw_response(ceremony_num, data):
    """Save raw API response JSON."""
    os.makedirs(RAW_DIR, exist_ok=True)
    path = os.path.join(RAW_DIR, f"ceremony-{ceremony_num}-wikipedia.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  Raw response saved to {path}")


# ---------------------------------------------------------------------------
# Wikitext parsing
# ---------------------------------------------------------------------------

def extract_category_sections(wikitext):
    """Extract category blocks from wikitext.

    Returns list of (category_display_name, section_text).
    Categories are delimited by {{Award category|...}} templates.
    """
    # Find all Award category templates and split text between them
    pattern = r'\{\{Award category\|[^|]*\|(?:\[\[(?:[^|\]]*?\|)?)?([^\]{}]*?)(?:\]\])?\}\}'

    results = []
    # Use mwparserfromhell for more robust parsing
    parsed = mwparserfromhell.parse(wikitext)
    templates = parsed.filter_templates()

    award_templates = []
    for t in templates:
        tname = str(t.name).strip().lower()
        # Handle both {{Award category|...}} and {{AwardCategory|...}}
        if tname in ("award category", "awardcategory"):
            award_templates.append(t)

    if not award_templates:
        return results

    full_text = str(parsed)

    for i, tmpl in enumerate(award_templates):
        # Extract category name from the template
        tmpl_str = str(tmpl)
        cat_name = _extract_category_name_from_template(tmpl_str)

        # Find the text between this template and the next (or end of awards section)
        start_pos = full_text.find(tmpl_str)
        if start_pos == -1:
            continue
        start_pos += len(tmpl_str)

        if i + 1 < len(award_templates):
            next_tmpl_str = str(award_templates[i + 1])
            end_pos = full_text.find(next_tmpl_str, start_pos)
            if end_pos == -1:
                end_pos = len(full_text)
        else:
            # Last category — go until table end |}, next section header, or end
            table_end = full_text.find("\n|}", start_pos)
            section_match = re.search(r'\n==[^=]', full_text[start_pos:])
            candidates = [len(full_text)]
            if table_end != -1:
                candidates.append(table_end)
            if section_match:
                candidates.append(start_pos + section_match.start())
            end_pos = min(candidates)

        section_text = full_text[start_pos:end_pos].strip()
        results.append((cat_name, section_text))

    return results


def _extract_category_name_from_template(tmpl_str):
    """Extract display name from {{Award category|color|[[link|Name]]}} or similar."""
    # Try pattern: [[Academy Award for X|Display Name]]
    m = re.search(r'\[\[[^|\]]*\|([^\]]+)\]\]', tmpl_str)
    if m:
        return m.group(1).strip()
    # Try pattern: [[Display Name]]
    m = re.search(r'\[\[([^\]|]+)\]\]', tmpl_str)
    if m:
        return m.group(1).strip()
    # Fallback: extract second parameter
    parts = tmpl_str.strip('{}').split('|')
    if len(parts) >= 3:
        return parts[2].strip().strip('[]')
    return tmpl_str


def match_category_to_section(cat, sections, year):
    """Find the section matching a category definition.

    Uses wikipedia_section_aliases and historical_names for matching.
    Returns (section_display_name, section_text) or None.
    """
    aliases = set()
    # Add all configured aliases
    for alias in cat.get("wikipedia_section_aliases", []):
        aliases.add(alias.lower().strip())
    # Add historical names
    for hn in cat.get("historical_names", []):
        aliases.add(hn["name"].lower().strip())
    # Add display name
    aliases.add(cat["display_name"].lower().strip())

    best_match = None
    for sect_name, sect_text in sections:
        sect_lower = sect_name.lower().strip()
        if sect_lower in aliases:
            return (sect_name, sect_text)
        # Fuzzy: check if any alias is a substring or vice versa
        for alias in aliases:
            if alias in sect_lower or sect_lower in alias:
                best_match = (sect_name, sect_text)

    return best_match


def parse_nominees_from_section(section_text, cat, year):
    """Parse winner and nominees from a category section's wikitext.

    Returns list of dicts: {name, film, is_winner, role, extra_names}
    """
    lines = section_text.split("\n")
    entries = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Determine winner vs nominee by bullet depth
        is_winner = False
        if stripped.startswith("* ") and not stripped.startswith("** "):
            is_winner = True
            content = stripped[2:]
        elif stripped.startswith("** "):
            content = stripped[3:]
        elif stripped.startswith("*"):
            # Could be * without space — treat as winner
            if stripped.startswith("**"):
                content = stripped[2:]
            else:
                is_winner = True
                content = stripped[1:]
        else:
            continue

        # Strip bold markers (winner indicator)
        content_clean = content.strip()
        # Remove trailing dagger symbols
        content_clean = re.sub(r"\s*[‡†]?\s*'*\s*$", "", content_clean)
        content_clean = content_clean.strip("'").strip()
        # Remove leading bold markers
        content_clean = re.sub(r"^'{2,3}", "", content_clean)
        content_clean = re.sub(r"'{2,3}$", "", content_clean)
        content_clean = content_clean.strip()

        entry = _parse_entry_line(content_clean, cat)
        entry["is_winner"] = is_winner
        entries.append(entry)

    return entries


def _parse_entry_line(content, cat):
    """Parse a single nominee/winner line into structured data.

    Handles patterns like:
      [[Person Name]] – ''[[Film (disambiguation)|Film Title]]'' as Character
      ''[[Film Title]]'' – [[Producer]], producer
    """
    result = {"name": "", "film": "", "role": "", "extra_names": [], "subject_title": ""}

    # Remove {{sort|...}} templates
    content = re.sub(r'\{\{sort\|[^}]*\}\}', '', content, flags=re.IGNORECASE)
    # Remove {{double-dagger}} and similar
    content = re.sub(r'\{\{double-dagger\}\}', '', content, flags=re.IGNORECASE)
    # Remove {{nom}} templates
    content = re.sub(r'\{\{nom\}\}', '', content, flags=re.IGNORECASE)
    # Remove {{won}} templates
    content = re.sub(r'\{\{won\}\}', '', content, flags=re.IGNORECASE)
    # Strip trailing "based on ..." source-attribution clauses from the
    # entire content before any further parsing. Resolves
    # oscar-adapted-screenplay-the-play-artifact-2026-05-03 — the
    # adapted-screenplay format "Writer; based on the X by Author – ''Film''"
    # was leaking source-work titles, generic source fragments, and
    # source-author names into recipients[].
    #
    # Protects content inside [[wikilinks]] from the strip. This handles
    # the cer 82 Precious case where "Based on" appears INSIDE the film
    # wikilink ("Precious: Based on the Novel 'Push' by Sapphire"); the
    # wikilink protection makes that internal text invisible to the
    # strip, so the film title survives intact.
    #
    # We deliberately DO NOT protect ''italic'' spans here because
    # parse_nominees_from_section's .strip("'") destroys the leading
    # italic markers on winner rows, leaving an orphan trailing '' or '''.
    # An italic-protection regex would then match greedily across that
    # asymmetric pair and capture the entire middle of the line —
    # including the "based on" clause we're trying to strip — defeating
    # the fix. Wikilink protection alone is sufficient for the cases that
    # matter (the "based on" clause never appears inside an italic span
    # without also being inside a wikilink in Oscar Wikipedia data).
    _PH = "\x01PROT_{}\x01"
    _protected_segments = []
    def _grab(m):
        _protected_segments.append(m.group(0))
        return _PH.format(len(_protected_segments) - 1)
    _work = re.sub(r"\[\[[^\]]+\]\]", _grab, content)
    _work = re.sub(r'\s*[;,(]?\s*\bbased on\b.*$', '', _work, flags=re.IGNORECASE).strip()
    for _i in range(len(_protected_segments) - 1, -1, -1):
        _work = _work.replace(_PH.format(_i), _protected_segments[_i])
    content = _work

    recipient_type = cat.get("recipient_type", "")
    has_subject = cat.get("has_subject_title", False)

    # Special handling for categories with subject_title (e.g. Best Original Song).
    # Pattern: "Song Name" from ''[[Film]]'' – credits
    if has_subject:
        # Match patterns like: "[[Song (dis)|Song]]" from, "[[Song]]" from, "Song" from
        song_match = re.match(
            r'"?\[\[(?:[^|\]]*\|)?([^\]]+)\]\]"?\s+from\s+'
            r'|"?\[\[([^\]]+)\]\]"?\s+from\s+'
            r'|"([^"]+)"\s+from\s+',
            content, re.IGNORECASE
        )
        if song_match:
            subject = (song_match.group(1) or song_match.group(2) or song_match.group(3) or "").strip().strip('"')
            # Strip residual wikitext markup ('''...''', [[...|...]], [[...]]) from the
            # captured subject. Resolves oscar-original-song-subject-title-markup-leak-2026-05-03:
            # cer 84 'Man or Muppet' was stored as "'''[[Man or Muppet]]" because
            # the regex capture preserved bold-marker and bracket fragments around
            # the song name. _clean_wikilinks is idempotent on already-clean strings.
            subject = _clean_wikilinks(subject).strip().strip('"')
            remainder = content[song_match.end():]
            # remainder is: ''[[Film]]'' – credits
            # Split on dash to get film part and credits part
            DASH_PH = "\x00DASH\x00"
            remainder_protected = _protect_wikilink_dashes(remainder, DASH_PH)
            parts = re.split(r'\s*[–—]\s*', remainder_protected, maxsplit=1)
            parts = [p.replace(DASH_PH, "–") for p in parts]

            film_part = parts[0].strip() if parts else ""
            credits_part = parts[1].strip() if len(parts) > 1 else ""

            result["subject_title"] = subject
            result["film"] = _extract_title(film_part)

            # Extract person names from credits
            # Strip "Music and lyrics by" / "Music by" / "Lyrics by" prefixes
            credits_clean = re.sub(
                r'^(?:Music\s+and\s+[Ll]yrics?\s+by|Music\s+by|[Ll]yrics?\s+by)\s+',
                '', credits_part).strip()
            if credits_clean:
                result["name"] = _extract_person_name(credits_clean)
                result["extra_names"] = _extract_all_names(credits_clean)
            return result

    # Protect dashes inside wikilinks from splitting.
    # Replace – inside [[...]] with a placeholder, split, then restore.
    DASH_PLACEHOLDER = "\x00DASH\x00"
    protected = _protect_wikilink_dashes(content, DASH_PLACEHOLDER)

    # Split on dash/endash/emdash separator (only unprotected ones)
    parts = re.split(r'\s*[–—]\s*', protected, maxsplit=1)
    # Restore dashes
    parts = [p.replace(DASH_PLACEHOLDER, "–") for p in parts]

    if len(parts) == 2:
        left = parts[0].strip()
        right = parts[1].strip()

        # Strip trailing "based on..." clauses from right side
        right_core = re.split(r';\s*based on\b', right, maxsplit=1)[0].strip()

        # Determine which side is the film and which is the person
        left_is_film = _looks_like_film(left)
        right_is_film = _looks_like_film(right_core)

        if left_is_film:
            # Film – Person pattern (Best Picture, writing categories, etc.)
            result["film"] = _extract_title(left)
            result["name"] = _extract_person_name(right_core)
            result["extra_names"] = _extract_all_names(right_core)
        elif right_is_film:
            # Person – Film pattern (acting, directing, etc.)
            result["name"] = _extract_person_name(left)
            # Mirror left_is_film: capture every wikilinked name on the
            # person side, not just the first. Required for team-credited
            # Person-first wikitext like "[[A]] and [[B]] – ''Film''" so
            # downstream code (governed by split_co_recipients) can choose
            # to keep the team on a single row instead of dropping name B.
            result["extra_names"] = _extract_all_names(left)
            film_part = right_core
            # Extract character name if present (after "as")
            as_match = re.split(r'\s+as\s+', film_part, maxsplit=1)
            if len(as_match) == 2:
                result["film"] = _extract_title(as_match[0])
                result["role"] = _clean_wikilinks(as_match[1]).strip()
            else:
                result["film"] = _extract_title(film_part)
        else:
            # Neither side has italic markers — default to person-centric
            result["name"] = _extract_person_name(left)
            result["film"] = _extract_title(right_core)
    elif len(parts) == 1:
        # No dash separator — could be just a film title or just a name
        single = parts[0].strip()
        if _looks_like_film(single):
            result["film"] = _extract_title(single)
        else:
            result["name"] = _extract_person_name(single)
            # Try to find a film in italics
            film_match = re.search(r"''(?:\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]|([^']+))''", single)
            if film_match:
                result["film"] = (film_match.group(2) or film_match.group(1) or
                                  film_match.group(3) or "").strip()

    # Clean up
    result["name"] = _clean_wikilinks(result["name"]).strip()
    result["film"] = result["film"].strip("' ").strip()
    result["role"] = _clean_wikilinks(result["role"]).strip()

    return result


def _protect_wikilink_dashes(text, placeholder):
    """Replace en-dash/em-dash inside [[...]] with a placeholder."""
    def _replace(m):
        return m.group(0).replace("–", placeholder).replace("—", placeholder)
    return re.sub(r'\[\[[^\]]*\]\]', _replace, text)


def _looks_like_film(text):
    """Check if text starts with or is primarily a film title (italic wikilinks)."""
    # Film titles are wrapped in '' (italic) in Wikipedia Oscar articles
    return bool(re.search(r"''", text))


def _extract_title(text):
    """Extract film title from wikitext like ''[[Film (year)|Film]]''."""
    # Try [[Film (disambiguation)|Display Title]]
    m = re.search(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    if m:
        return (m.group(2) or m.group(1)).strip()
    # Strip italic markers and return
    return re.sub(r"'{2,}", "", text).strip()


def _extract_person_name(text):
    """Extract person name from wikitext like [[Person Name|Display]].

    Skips wikilinks whose display text matches NON_PERSON_NAMES (role
    labels, editorial annotations, generic source-work fragments). Required
    so the FIRST wikilink in a 'Role: Name' style credit string isn't
    captured as the recipient — extends the role-label-artifact fix to
    cover the primary-name extraction path, not just the extras path.
    """
    for m in re.finditer(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text):
        name = (m.group(2) or m.group(1)).strip()
        if name.lower() not in NON_PERSON_NAMES:
            return name
    return _clean_wikilinks(text).strip()


def _extract_names_text(text):
    """Extract the first person name from a text that may contain multiple."""
    # Find all wikilinked names
    names = re.findall(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    if names:
        return (names[0][1] or names[0][0]).strip()
    # Fallback: clean text before comma
    clean = _clean_wikilinks(text)
    parts = clean.split(",")
    return parts[0].strip()


# Wikilinked strings that look like recipient names but are actually role
# labels, editorial annotations, or generic source-work fragments. Filtered
# out of recipient extraction in _extract_all_names.
#
# Resolves:
#   - oscar-production-design-role-label-artifact-2026-05-03 (role labels
#     "Production Design", "Set Decoration", "Art Direction" appearing as
#     wikilinks in the credits string for Production Design / Art Direction
#     winners across cer 72-89).
#   - oscar-documentary-feature-posthumous-award-artifact-2026-05-03
#     ("posthumous award" annotation captured as a recipient at cer 86
#     20 Feet from Stardom).
#   - Belt-and-braces backup for oscar-adapted-screenplay-the-play-artifact:
#     even though the "based on" clause is now stripped before this
#     function runs, the generic source-fragment phrases are kept here in
#     case Wikipedia formatting puts them outside a "based on" context.
NON_PERSON_NAMES = {
    # Production Design / Art Direction role labels
    "production design", "set decoration", "art direction",
    "set decorator", "art director",
    # Documentary editorial annotations
    "posthumous award", "posthumous", "honorary award", "honorary",
    # Generic source-work fragments (defensive — the based-on strip in
    # _parse_entry_line should already remove these)
    "the play", "the novel", "the book", "his novel", "her novel",
    "the short story", "the memoir", "the biography",
    "the screenplay", "the article", "the story",
}


def _extract_all_names(text):
    """Extract all person names from a text with multiple names."""
    names = re.findall(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    result = []
    for link, display in names:
        name = (display or link).strip()
        # Filter out non-person links (years, films, etc.)
        if name and not name.isdigit() and len(name) > 2:
            # Skip role labels / annotations / source-fragment phrases
            if name.lower() in NON_PERSON_NAMES:
                continue
            result.append(name)
    return result


def _clean_wikilinks(text):
    """Remove wikilink markup, keeping display text."""
    # [[link|display]] -> display
    text = re.sub(r"\[\[([^|\]]*?)\|([^\]]*?)\]\]", r"\2", text)
    # [[link]] -> link
    text = re.sub(r"\[\[([^\]]*?)\]\]", r"\1", text)
    # Remove remaining markup
    text = re.sub(r"'{2,}", "", text)
    text = re.sub(r"\{\{[^}]*\}\}", "", text)
    return text.strip()


# ---------------------------------------------------------------------------
# DLu cross-check
# ---------------------------------------------------------------------------

def crosscheck_with_dlu(wiki_rows, dlu_rows, cat, year):
    """Cross-check Wikipedia results against DLu data.

    Returns updated wiki_rows with verified_status and flags set,
    plus any extra rows from DLu that Wikipedia missed.
    """
    dlu_canonical = cat.get("dlu_canonical", "")
    cat_dlu = [r for r in dlu_rows if r.get("CanonicalCategory", "") == dlu_canonical]

    # Filter out honorary/sci-tech rows that aren't competitive
    cat_dlu = [r for r in cat_dlu
               if r.get("CanonicalCategory", "") not in (
                   "HONORARY AWARD", "JEAN HERSHOLT HUMANITARIAN AWARD",
                   "IRVING G. THALBERG MEMORIAL AWARD", "GORDON E. SAWYER AWARD",
               ) or dlu_canonical in (
                   "HONORARY AWARD", "JEAN HERSHOLT HUMANITARIAN AWARD",
               )]

    if not cat_dlu:
        # No DLu data for this category
        for row in wiki_rows:
            row["verified_status"] = "auto_verified"
            row["flags"].append("no_dlu_crosscheck_available")
        return wiki_rows, []

    # Try to match each wiki row to a DLu row
    matched_dlu_indices = set()

    for wrow in wiki_rows:
        best_match = None
        best_idx = None

        for idx, drow in enumerate(cat_dlu):
            if idx in matched_dlu_indices:
                continue
            score = _match_score(wrow, drow)
            if score > 0 and (best_match is None or score > best_match):
                best_match = score
                best_idx = idx

        if best_idx is not None:
            matched_dlu_indices.add(best_idx)
            drow = cat_dlu[best_idx]
            # Check agreement
            wiki_won = wrow["result"] == "won"
            dlu_won = (drow.get("Winner") or "").strip() == "True"

            if wiki_won == dlu_won:
                wrow["verified_status"] = "auto_verified"
                wrow["flags"].append("wikipedia_dlu_agree")
            else:
                wrow["verified_status"] = "flagged"
                wrow["flags"].append("wikipedia_dlu_disagree")
                dlu_name = drow.get("Name", "")
                dlu_film = drow.get("Film", "")
                wrow["notes"] = (
                    f"DLu disagrees on winner status. "
                    f"Wikipedia: {wrow['result']}, DLu: {'won' if dlu_won else 'nominated'}. "
                    f"DLu name: {dlu_name}, DLu film: {dlu_film}"
                )
        else:
            wrow["verified_status"] = "auto_verified"
            wrow["flags"].append("no_dlu_crosscheck_available")

    # Check for DLu rows not matched to any Wikipedia row
    extra_rows = []

    # Pre-compute stripped titles for wiki rows (alphanumeric only, lowercase)
    # for fuzzy fallback matching within this (year, category) group.
    wiki_stripped = {}
    for i, wrow in enumerate(wiki_rows):
        stripped = _strip_to_alphanum(wrow.get("film_title", ""))
        if stripped:
            wiki_stripped[stripped] = i

    for idx, drow in enumerate(cat_dlu):
        if idx in matched_dlu_indices:
            continue
        # DLu has a row we didn't find in Wikipedia
        dlu_name = (drow.get("Name") or "").strip()
        dlu_film = (drow.get("Film") or "").strip()
        dlu_won = (drow.get("Winner") or "").strip() == "True"

        if not dlu_name and not dlu_film:
            continue  # Skip empty rows (common in honorary awards)

        # Fuzzy fallback: strip both titles to alphanumerics and compare.
        # Only safe within a single (year, category) group.
        dlu_stripped = _strip_to_alphanum(dlu_film)
        if dlu_stripped and dlu_stripped in wiki_stripped:
            # Found a match — merge into the existing Wikipedia row
            wiki_idx = wiki_stripped[dlu_stripped]
            wrow = wiki_rows[wiki_idx]
            wrow["flags"].append("dlu_title_variance")
            wiki_title = wrow.get("film_title", "")
            existing_notes = wrow.get("notes") or ""
            merge_note = (
                f"DLu had this nomination as '{dlu_film}' "
                f"— same film as Wikipedia's '{wiki_title}', merged."
            )
            wrow["notes"] = f"{existing_notes}; {merge_note}".strip("; ") if existing_notes else merge_note
            continue

        extra = {
            "id": _build_row_id(cat["id"], year, dlu_name or dlu_film),
            "ceremony_id": f"oscar.{year}",
            "category_id": cat["id"],
            "year": year,
            "result": "won" if dlu_won else "nominated",
            "recipients": [{"name": dlu_name, "role": None,
                            "tmdb_person_id": None, "profile_path": None}],
            "film_tmdb_id": None,
            "film_title": dlu_film,
            "subject_title": None,
            "film_release_year": None,
            "film_poster_path": None,
            "source_url": DLU_RAW_URL,
            "source_citation": f"DLu/oscar_data, ceremony {drow.get('Ceremony', '')}",
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "scrape_version": SCRAPE_VERSION,
            "verified_status": "flagged",
            "flags": ["wikipedia_missing_dlu_present"],
            "notes": f"Found in DLu but not in Wikipedia parse. DLu name: {dlu_name}, film: {dlu_film}",
        }
        extra_rows.append(extra)

    return wiki_rows, extra_rows


def _match_score(wiki_row, dlu_row):
    """Score how well a wiki row matches a DLu row. 0 = no match."""
    score = 0
    wiki_film = wiki_row.get("film_title", "").lower().strip()
    dlu_film = dlu_row.get("Film", "").lower().strip()

    # Film match (most reliable)
    # Also check DLu Detail field — song names live there for Original Song
    dlu_detail = (dlu_row.get("Detail") or "").lower().strip()

    if wiki_film and dlu_film:
        # Normalize dashes for comparison
        wf_norm = re.sub(r"[–—―‐‑‒−]", "-", wiki_film)
        df_norm = re.sub(r"[–—―‐‑‒−]", "-", dlu_film)
        if wf_norm == df_norm:
            score += 3
        elif wf_norm in df_norm or df_norm in wf_norm:
            score += 2
        elif _normalize_title(wiki_film) == _normalize_title(dlu_film):
            score += 2
        # For songs: wiki_film might be the song name, which is in DLu Detail
        elif dlu_detail and _normalize_title(wiki_film) == _normalize_title(dlu_detail):
            score += 3

    # Subject title match (song name vs DLu Detail field)
    wiki_subject = wiki_row.get("subject_title", "")
    if wiki_subject and dlu_detail:
        if _normalize_title(wiki_subject) == _normalize_title(dlu_detail):
            score += 4  # Strong signal — song names are unique within a ceremony

    # Name match
    wiki_name = ""
    if wiki_row.get("recipients"):
        wiki_name = wiki_row["recipients"][0].get("name", "").lower().strip()
    dlu_name = dlu_row.get("Name", "").lower().strip()

    if wiki_name and dlu_name:
        if wiki_name == dlu_name:
            score += 2
        elif _normalize_name(wiki_name) == _normalize_name(dlu_name):
            score += 1
        elif wiki_name.split()[-1] == dlu_name.split()[-1]:
            # Last name match
            score += 1

    return score


def _normalize_title(title):
    """Normalize film title for fuzzy matching."""
    title = title.lower()
    title = re.sub(r"^the\s+", "", title)
    title = re.sub(r"\s*\([^)]*\)\s*", "", title)  # Remove parentheticals
    # Normalize all dash variants to a single hyphen
    title = re.sub(r"[–—―‐‑‒−]", "-", title)
    # Normalize & to "and"
    title = title.replace("&", "and")
    # Strip common accents via unicode decomposition
    import unicodedata
    nfkd = unicodedata.normalize("NFKD", title)
    title = "".join(c for c in nfkd if not unicodedata.combining(c))
    # Collapse whitespace
    title = re.sub(r"\s+", " ", title)
    return title.strip()


def _strip_to_alphanum(text):
    """Strip to lowercase alphanumerics only. Used for fuzzy title fallback."""
    import unicodedata
    nfkd = unicodedata.normalize("NFKD", text.lower())
    return re.sub(r"[^a-z0-9]", "", nfkd)


def _normalize_name(name):
    """Normalize person name for fuzzy matching."""
    # Remove accents roughly by stripping non-ASCII — crude but functional
    name = re.sub(r"[.,']", "", name.lower())
    return name.strip()


# ---------------------------------------------------------------------------
# Row building
# ---------------------------------------------------------------------------

def _build_row_id(category_id, year, trailing_name):
    """Build award row ID per schema."""
    slug = slugify(trailing_name) if trailing_name else "unknown"
    return f"{category_id}.{year}.{slug}_unresolved"


# Recipient types that represent a single credited individual.
# When multiple people share one of these, they are co-winners and
# must be split into separate rows.
SINGLE_PERSON_RECIPIENT_TYPES = {
    "director", "actor", "actress", "cinematographer",
    "editor", "composer",
}


def _split_co_recipients(name):
    """Split a combined recipient name into individual names.

    Handles "A and B", "A & B", "A; B", "A, B and C".
    Strips parenthetical group names like "(the Daniels)".
    Returns a list of individual name strings.
    """
    if not name:
        return [name]

    # Strip parenthetical group names
    cleaned = re.sub(r"\s*\([^)]*\)\s*", " ", name).strip()

    # Try splitting on "; " first (rare, 3+ recipients)
    if "; " in cleaned:
        parts = [p.strip() for p in cleaned.split(";")]
    # Then " and " or " & "
    elif re.search(r'\s+and\s+', cleaned):
        # Handle "A, B and C" pattern
        parts = re.split(r',\s*|\s+and\s+', cleaned)
    elif " & " in cleaned:
        parts = [p.strip() for p in cleaned.split(" & ")]
    else:
        return [name]

    # Filter empty parts
    parts = [p.strip() for p in parts if p.strip()]

    if not parts:
        return [name]

    # Safety: if any resulting name is shorter than 3 chars, it's likely
    # a bad split. Return the original name and flag it.
    for p in parts:
        if len(p) < 3:
            return [name]  # Caller will detect no split happened

    return parts


def build_award_rows(entries, cat, year, page_url, ceremony_num):
    """Convert parsed entries into award row dicts.

    For single-person categories where a recipient name contains multiple
    people (co-recipients), produce one row per person with co_winner flag.
    For multi-person/team categories, keep all recipients in one row.
    """
    rows = []
    scraped_at = datetime.now(timezone.utc).isoformat()
    hist_name = get_historical_name(cat, year)
    is_single_person = (
        cat.get("split_co_recipients", True)
        and cat.get("recipient_type", "") in SINGLE_PERSON_RECIPIENT_TYPES
    )

    for entry in entries:
        name = entry.get("name", "")
        film = entry.get("film", "")

        # Check for co-recipient splitting in single-person categories
        if is_single_person and name:
            split_names = _split_co_recipients(name)
        else:
            split_names = [name] if name else [""]

        if is_single_person and len(split_names) > 1:
            # Produce one row per co-recipient
            all_names = list(split_names)  # copy for notes
            for individual_name in split_names:
                others = [n for n in all_names if n != individual_name]
                others_str = ", ".join(others)

                row = {
                    "id": _build_row_id(cat["id"], year, individual_name),
                    "ceremony_id": f"oscar.{year}",
                    "category_id": cat["id"],
                    "year": year,
                    "result": "won" if entry["is_winner"] else "nominated",
                    "recipients": [{
                        "name": individual_name,
                        "role": entry.get("role") or None,
                        "tmdb_person_id": None,
                        "profile_path": None,
                    }],
                    "film_tmdb_id": None,
                    "film_title": film,
                    "subject_title": entry.get("subject_title") or None,
                    "film_release_year": None,
                    "film_poster_path": None,
                    "source_url": page_url,
                    "source_citation": f"{ordinal(ceremony_num)} Academy Awards Wikipedia article, {hist_name} section",
                    "scraped_at": scraped_at,
                    "scrape_version": SCRAPE_VERSION,
                    "verified_status": "unverified",
                    "flags": ["co_recipient"],
                    "notes": f"Shared nomination. Co-recipient with {others_str}.",
                }
                rows.append(row)
        else:
            # Standard single-row handling.
            #
            # When split_co_recipients=false on the category, we keep the
            # team as one row but still split the name string into atomic
            # recipients[] entries. This re-uses _split_co_recipients
            # (which originally split rows) to split the names within a
            # row. Single-name nominations pass through unchanged because
            # _split_co_recipients returns [name] when there's no
            # separator.
            should_split_in_row = (
                not cat.get("split_co_recipients", True)
                and cat.get("recipient_type", "") in SINGLE_PERSON_RECIPIENT_TYPES
            )
            if should_split_in_row and name:
                name_atoms = _split_co_recipients(name)
            else:
                name_atoms = [name] if name else []

            trailing = name or film
            # When the atoms successfully split a fused "A and B" name,
            # suppress the original fused string from extras (e.g.
            # _extract_all_names returns the same combined wikilink
            # display "[[Page|A and B]]") so it doesn't reappear.
            suppress = {name} if (should_split_in_row and len(name_atoms) > 1) else set()
            recipients = []
            seen = set()
            for atom in name_atoms:
                if not atom or atom in seen or atom in suppress:
                    continue
                recipients.append({
                    "name": atom,
                    "role": entry.get("role") or None,
                    "tmdb_person_id": None,
                    "profile_path": None,
                })
                seen.add(atom)
            # Add extra names for multi-recipient categories
            for extra in entry.get("extra_names", []):
                if not extra or extra in seen or extra in suppress:
                    continue
                recipients.append({
                    "name": extra,
                    "role": None,
                    "tmdb_person_id": None,
                    "profile_path": None,
                })
                seen.add(extra)

            row = {
                "id": _build_row_id(cat["id"], year, trailing),
                "ceremony_id": f"oscar.{year}",
                "category_id": cat["id"],
                "year": year,
                "result": "won" if entry["is_winner"] else "nominated",
                "recipients": recipients,
                "film_tmdb_id": None,
                "film_title": film,
                "subject_title": entry.get("subject_title") or None,
                "film_release_year": None,
                "film_poster_path": None,
                "source_url": page_url,
                "source_citation": f"{ordinal(ceremony_num)} Academy Awards Wikipedia article, {hist_name} section",
                "scraped_at": scraped_at,
                "scrape_version": SCRAPE_VERSION,
                "verified_status": "unverified",
                "flags": [],
                "notes": None,
            }
            rows.append(row)

    return rows


# ---------------------------------------------------------------------------
# Co-winner handling
# ---------------------------------------------------------------------------

def detect_co_winners(rows):
    """If multiple rows have result='won', mark them as co-winners."""
    winners = [r for r in rows if r["result"] == "won"]
    if len(winners) > 1:
        for w in winners:
            w["flags"].append("co_winner")
            existing = w.get("notes") or ""
            tie_note = f"Co-winner (tie with {len(winners)-1} other(s))"
            w["notes"] = f"{existing}; {tie_note}".strip("; ") if existing else tie_note
    return rows


# ---------------------------------------------------------------------------
# CSV output
# ---------------------------------------------------------------------------

CSV_COLUMNS = [
    "id", "ceremony_id", "category_id", "year", "result",
    "recipients_json", "film_tmdb_id", "film_title",
    "subject_title", "film_release_year", "film_poster_path",
    "source_url", "source_citation", "scraped_at",
    "scrape_version", "verified_status", "flags_json", "notes",
]


def row_to_csv_dict(row):
    """Convert internal row to CSV-friendly dict."""
    return {
        "id": row["id"],
        "ceremony_id": row["ceremony_id"],
        "category_id": row["category_id"],
        "year": row["year"],
        "result": row["result"],
        "recipients_json": json.dumps(row["recipients"], ensure_ascii=False),
        "film_tmdb_id": row.get("film_tmdb_id") or "",
        "film_title": row["film_title"],
        "subject_title": row.get("subject_title") or "",
        "film_release_year": row.get("film_release_year") or "",
        "film_poster_path": row.get("film_poster_path") or "",
        "source_url": row["source_url"],
        "source_citation": row["source_citation"],
        "scraped_at": row["scraped_at"],
        "scrape_version": row["scrape_version"],
        "verified_status": row["verified_status"],
        "flags_json": json.dumps(row["flags"]),
        "notes": row.get("notes") or "",
    }


def write_csv(rows, path):
    """Write rows to CSV with QUOTE_ALL."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for row in rows:
            writer.writerow(row_to_csv_dict(row))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="ORBIT Oscar Scraper — scrape Oscar ceremony data from Wikipedia"
    )
    parser.add_argument(
        "--ceremony", type=int, required=True,
        help=f"Ceremony number (min {MIN_CEREMONY}, e.g. 96 for 2024)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Run scrape and show summary without writing CSV"
    )
    args = parser.parse_args()

    ceremony_num = args.ceremony

    # Validate ceremony number
    if ceremony_num < MIN_CEREMONY:
        print(f"ERROR: Ceremony {ceremony_num} is before the minimum supported ({MIN_CEREMONY}).")
        print(f"  This scraper only supports ceremonies from {MIN_CEREMONY} ({ceremony_to_year(MIN_CEREMONY)}) onwards.")
        sys.exit(1)

    year = ceremony_to_year(ceremony_num)
    today = date.today()
    # Current year + 1 is a reasonable future ceiling — ceremonies happen in Feb/March
    # for the previous year's films
    max_year = today.year + 1
    if year > max_year:
        print(f"ERROR: Ceremony {ceremony_num} (year {year}) is in the future.")
        sys.exit(1)

    print(f"Scraping {ordinal(ceremony_num)} Academy Awards ({year})")
    print("=" * 60)

    # Step 1: Ensure DLu data
    print("\n[1] DLu reference data")
    dlu_available = ensure_dlu_data()
    dlu_rows = load_dlu_rows(ceremony_num) if dlu_available else []
    print(f"  DLu rows for ceremony {ceremony_num}: {len(dlu_rows)}")

    # Step 2: Load categories
    print("\n[2] Loading categories")
    categories = load_categories()
    active_cats = active_categories(categories, year)
    print(f"  Active categories for {year}: {len(active_cats)}")
    for c in active_cats:
        print(f"    - {c['display_name']} ({c['id']})")

    # Step 3: Fetch Wikipedia
    print(f"\n[3] Fetching Wikipedia article")
    try:
        wikitext, page_url, raw_data = fetch_wikipedia_wikitext(ceremony_num)
    except Exception as e:
        print(f"  FATAL: Could not fetch Wikipedia article: {e}")
        sys.exit(1)

    # Save raw response (even in dry-run — it's diagnostic)
    save_raw_response(ceremony_num, raw_data)

    # Step 4: Parse wikitext
    print(f"\n[4] Parsing wikitext")
    sections = extract_category_sections(wikitext)
    print(f"  Found {len(sections)} category sections in wikitext")

    # Step 5: Process each category
    print(f"\n[5] Processing categories")
    all_rows = []
    summary_lines = []
    categories_with_zero_rows = []
    total_flagged = 0

    for cat in active_cats:
        hist_name = get_historical_name(cat, year)
        match = match_category_to_section(cat, sections, year)

        if match is None:
            msg = f"  WARNING: No Wikipedia section found for {cat['display_name']} (looked for: {hist_name})"
            print(msg)
            categories_with_zero_rows.append(cat["display_name"])

            # Check if DLu has data we're missing
            dlu_canonical = cat.get("dlu_canonical", "")
            dlu_cat_rows = [r for r in dlu_rows if r.get("CanonicalCategory") == dlu_canonical]
            if dlu_cat_rows:
                # Create rows from DLu data since Wikipedia section wasn't found
                _, extra_rows = crosscheck_with_dlu([], dlu_rows, cat, year)
                if extra_rows:
                    all_rows.extend(extra_rows)
                    summary_lines.append(
                        f"[scrape-oscar {ceremony_num}] {cat['display_name']}: "
                        f"{len(extra_rows)} rows (0 wikipedia, {len(extra_rows)} dlu only — "
                        f"flagged wikipedia_missing_dlu_present)"
                    )
                    total_flagged += len(extra_rows)
                    continue

            # Save parse error info
            parse_err_dir = RAW_DIR
            os.makedirs(parse_err_dir, exist_ok=True)
            err_path = os.path.join(parse_err_dir,
                                     f"ceremony-{ceremony_num}-{slugify(cat['display_name'])}.parse-error")
            with open(err_path, "w", encoding="utf-8") as f:
                f.write(f"Category: {cat['display_name']}\n")
                f.write(f"Historical name: {hist_name}\n")
                f.write(f"Aliases searched: {cat.get('wikipedia_section_aliases', [])}\n")
                f.write(f"\nAvailable sections:\n")
                for sname, _ in sections:
                    f.write(f"  - {sname}\n")
            summary_lines.append(
                f"[scrape-oscar {ceremony_num}] {cat['display_name']}: "
                f"0 rows — section not found in Wikipedia"
            )
            continue

        sect_name, sect_text = match
        entries = parse_nominees_from_section(sect_text, cat, year)

        if not entries:
            categories_with_zero_rows.append(cat["display_name"])
            # Save parse error
            parse_err_dir = RAW_DIR
            os.makedirs(parse_err_dir, exist_ok=True)
            err_path = os.path.join(parse_err_dir,
                                     f"ceremony-{ceremony_num}-{slugify(cat['display_name'])}.parse-error")
            with open(err_path, "w", encoding="utf-8") as f:
                f.write(f"Category: {cat['display_name']}\n")
                f.write(f"Section found: {sect_name}\n")
                f.write(f"Section text:\n{sect_text}\n")
            summary_lines.append(
                f"[scrape-oscar {ceremony_num}] {cat['display_name']}: "
                f"0 rows — section found but parsing failed"
            )
            continue

        # Build award rows
        cat_rows = build_award_rows(entries, cat, year, page_url, ceremony_num)

        # Co-winner detection
        cat_rows = detect_co_winners(cat_rows)

        # Cross-check with DLu
        cat_rows, extra_rows = crosscheck_with_dlu(cat_rows, dlu_rows, cat, year)
        cat_rows.extend(extra_rows)

        # Count stats for summary
        wiki_count = len(cat_rows) - len(extra_rows)
        dlu_agree = sum(1 for r in cat_rows if "wikipedia_dlu_agree" in r["flags"])
        dlu_disagree = sum(1 for r in cat_rows if "wikipedia_dlu_disagree" in r["flags"])
        no_dlu = sum(1 for r in cat_rows if "no_dlu_crosscheck_available" in r["flags"])
        dlu_only = len(extra_rows)
        flagged = sum(1 for r in cat_rows if r["verified_status"] == "flagged")
        total_flagged += flagged

        parts = [f"{wiki_count} wikipedia"]
        if dlu_agree:
            parts.append(f"{dlu_agree} dlu agree")
        if dlu_disagree:
            parts.append(f"{dlu_disagree} dlu disagree")
        if no_dlu:
            parts.append(f"{no_dlu} no dlu match")
        if dlu_only:
            parts.append(f"{dlu_only} dlu only")

        summary_lines.append(
            f"[scrape-oscar {ceremony_num}] {cat['display_name']}: "
            f"{len(cat_rows)} rows ({', '.join(parts)})"
        )

        all_rows.extend(cat_rows)

    # Step 6: Summary
    print(f"\n{'=' * 60}")
    print("SCRAPE SUMMARY")
    print(f"{'=' * 60}")
    for line in summary_lines:
        print(f"  {line}")

    auto_verified = sum(1 for r in all_rows if r["verified_status"] == "auto_verified")
    flagged_rows = sum(1 for r in all_rows if r["verified_status"] == "flagged")
    unverified = sum(1 for r in all_rows if r["verified_status"] == "unverified")
    with_flag = sum(1 for r in all_rows
                    if r["verified_status"] == "auto_verified" and len(r["flags"]) > 0)

    print(f"\n  [scrape-oscar {ceremony_num}] TOTAL: {len(all_rows)} rows across "
          f"{len(active_cats)} categories")
    print(f"  [scrape-oscar {ceremony_num}] Verified status breakdown: "
          f"{auto_verified} auto_verified, {with_flag} with flags, {flagged_rows} flagged")
    print(f"  [scrape-oscar {ceremony_num}] Flagged rows requiring review: {flagged_rows}")

    if categories_with_zero_rows:
        print(f"\n  WARNING: {len(categories_with_zero_rows)} categories with zero rows:")
        for c in categories_with_zero_rows:
            print(f"    - {c}")

    # Step 7: Write output
    csv_path = os.path.join(SCRAPED_DIR, f"oscar-ceremony-{ceremony_num}.csv")

    if args.dry_run:
        print(f"\n  --dry-run: would write to {csv_path}")
        print(f"  --dry-run: no CSV written")
    else:
        write_csv(all_rows, csv_path)
        print(f"\n  [scrape-oscar {ceremony_num}] Output: {csv_path}")

    # Exit code
    if categories_with_zero_rows:
        print(f"\nExiting with code 1 — {len(categories_with_zero_rows)} categories produced zero rows")
        sys.exit(1)
    elif flagged_rows > 0:
        print(f"\nExiting with code 2 — {flagged_rows} rows flagged for review")
        sys.exit(2)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
