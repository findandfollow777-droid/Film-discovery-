#!/usr/bin/env python3
"""
ORBIT Golden Globe Scraper — Phase 1 (no TMDB)

Reads Wikipedia ceremony articles via the MediaWiki API as the sole source.

PHASE 1 INVESTIGATION FINDINGS (2026-04-28):
============================================

Wikipedia URL pattern (Phase 1.3):
  Candidate A: https://en.wikipedia.org/w/api.php?action=parse
                 &page={ordinal}_Golden_Globe_Awards&format=json&prop=wikitext
    → 200 OK; the page redirects to "{ordinal} Golden Globes" (renamed
      circa 2024) but the API follows the redirect transparently when
      called with redirects=1. Verified for ceremonies 58, 82, 83.

  Candidate B: https://en.wikipedia.org/w/api.php?action=parse
                 &page=Golden_Globe_Awards_{year}&format=json&prop=wikitext
    → 404 missingtitle. Wikipedia does not maintain this URL form.

  Decision: Use Candidate A with redirects=1.

goldenglobes.com accessibility (Phase 1.4):
  - https://goldenglobes.com/awards-database/  → HTTP 200 (HTML, WordPress)
  - https://goldenglobes.com/winners-nominees/ → HTTP 200 BUT React-rendered
    (template class "page-template-page-winners-nominees-react"). Nominee
    data is fetched client-side; the static HTML payload contains no rows.
  - Project policy forbids headless browsers (no Selenium/Playwright).

Source strategy decision (Phase 1.5): PATH B (Wikipedia only)
  - Reason: goldenglobes.com /winners-nominees/ is JS-rendered; nominee
    data only resolves after client-side React hydration, which we cannot
    parse without a headless browser.
  - Same pattern as BAFTA scraper.
  - Every row gets flag "single_source_wikipedia_only".
  - verified_status: "auto_verified" (single-source-but-clean is
    acceptable per scope decision in handover v1.1).
  - No cross-check available.

Wikitext structure (verified on 83rd and 82nd Golden Globes pages):
  - {{Award category|<color>|[[Golden Globe Award for X|Display Name]]}}
  - * '''winner''' (single bullet, bold)
  - ** nominee (double bullet, optionally italic)
  - Display names sometimes change between ceremonies (e.g. acting
    categories renamed at the 83rd GG from "Best Actor" to
    "Best Male Actor"). wikipedia_section_aliases handles both forms.

Best Original Song format (GG-specific, differs from Oscars):
  Oscar:  "Song" from ''[[Film]]'' – credits
  GG:     "[[Song]]" (writers) – ''[[Film]]''
  i.e. on Golden Globe pages, the writers come BEFORE the en-dash and
  the film comes AFTER. _parse_song_entry handles this.

Ceremony year formula:
  N = year - 1943   (58th = 2001, 82nd = 2025, 83rd = 2026)

Dependencies: stdlib + requests + mwparserfromhell
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

try:
    import mwparserfromhell
except ImportError:
    print("ERROR: 'mwparserfromhell' is required. Install with: pip3 install mwparserfromhell")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-gg-categories.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "gg")
RAW_DIR = os.path.join(SCRAPED_DIR, "raw")

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "ORBIT-Awards-Scraper/1.0 (https://github.com/orbit-project/Film-discovery-)"
SCRAPE_VERSION = "scrape-gg-v1.0.0"

# Ceremony N = year - 1943. 58th = 2001 (scope floor), 83rd = 2026.
CEREMONY_YEAR_OFFSET = 1943
MIN_CEREMONY = 58  # year 2001

# Single-person recipient types — co-recipient splitting applies.
# Note: "writer" (Best Screenplay) is intentionally excluded; multi-name
# screenplay credits are kept together as a credited team rather than split.
# "songwriter" is also excluded; song credits live in the recipients array
# but multiple songwriters per song are kept together.
SINGLE_PERSON_RECIPIENT_TYPES = {
    "director", "actor", "actress", "composer",
}

# Rate limit: 1 request/sec
REQUEST_DELAY_SEC = 1.0

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ceremony_to_year(ceremony_num):
    return ceremony_num + CEREMONY_YEAR_OFFSET


def ordinal(n):
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def slugify(text):
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = s.strip("_")
    return s


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


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

def load_categories():
    with open(CATEGORIES_FILE, encoding="utf-8") as f:
        return json.load(f)


def active_categories(categories, year):
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
    for hn in cat.get("historical_names", []):
        if year >= hn["from"] and (hn["to"] is None or year <= hn["to"]):
            return hn["name"]
    return cat["display_name"]


# ---------------------------------------------------------------------------
# Wikipedia fetching
# ---------------------------------------------------------------------------

def fetch_wikipedia_wikitext(ceremony_num):
    page_title = f"{ordinal(ceremony_num)}_Golden_Globe_Awards"
    page_url = f"https://en.wikipedia.org/wiki/{page_title}"

    params = {
        "action": "parse",
        "page": page_title,
        "format": "json",
        "prop": "wikitext",
        "redirects": 1,  # follow the rename redirect to "{ordinal} Golden Globes"
    }
    headers = {"User-Agent": USER_AGENT}

    print(f"  Fetching Wikipedia: {page_title}")
    resp = fetch_with_retry(WIKIPEDIA_API, params=params, headers=headers)
    data = resp.json()

    if "error" in data:
        raise RuntimeError(f"Wikipedia API error: {data['error'].get('info', data['error'])}")

    resolved_title = data["parse"].get("title", page_title)
    if resolved_title != page_title.replace("_", " "):
        print(f"  Wikipedia redirected to: {resolved_title}")

    wikitext = data["parse"]["wikitext"]["*"]
    return wikitext, page_url, data


def save_raw_response(ceremony_num, data):
    os.makedirs(RAW_DIR, exist_ok=True)
    path = os.path.join(RAW_DIR, f"ceremony-{ceremony_num}-wikipedia.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"  Raw response saved to {path}")


# ---------------------------------------------------------------------------
# Wikitext parsing — same Award category template structure as BAFTA
# ---------------------------------------------------------------------------

def extract_category_sections(wikitext):
    parsed = mwparserfromhell.parse(wikitext)
    templates = parsed.filter_templates()

    award_templates = []
    for t in templates:
        tname = str(t.name).strip().lower()
        if tname in ("award category", "awardcategory"):
            award_templates.append(t)

    if not award_templates:
        return []

    full_text = str(parsed)
    results = []

    for i, tmpl in enumerate(award_templates):
        tmpl_str = str(tmpl)
        cat_name = _extract_category_name_from_template(tmpl_str)

        start_pos = full_text.find(tmpl_str)
        if start_pos == -1:
            continue
        start_pos += len(tmpl_str)

        # Bound the section. Always consider the next Award template, the
        # next "\n|}" table close, and the next "\n=+" heading — pick the
        # earliest. This matters on GG ceremony pages where film categories
        # and TV categories sit in separate tables, with honorary recipient
        # text between them. Without the table-end bound, the last film
        # category (Best Original Song) bleeds into the inter-table content.
        candidates = [len(full_text)]
        if i + 1 < len(award_templates):
            next_tmpl_str = str(award_templates[i + 1])
            next_pos = full_text.find(next_tmpl_str, start_pos)
            if next_pos != -1:
                candidates.append(next_pos)
        table_end = full_text.find("\n|}", start_pos)
        if table_end != -1:
            candidates.append(table_end)
        section_match = re.search(r'\n=+[^=\s]', full_text[start_pos:])
        if section_match:
            candidates.append(start_pos + section_match.start())
        end_pos = min(candidates)

        section_text = full_text[start_pos:end_pos].strip()
        results.append((cat_name, section_text))

    return results


def _extract_category_name_from_template(tmpl_str):
    m = re.search(r'\[\[[^|\]]*\|([^\]]+)\]\]', tmpl_str)
    if m:
        return m.group(1).strip()
    m = re.search(r'\[\[([^\]|]+)\]\]', tmpl_str)
    if m:
        return m.group(1).strip()
    parts = tmpl_str.strip('{}').split('|')
    if len(parts) >= 3:
        return parts[2].strip().strip('[]')
    return tmpl_str


def match_category_to_section(cat, sections, year):
    aliases = set()
    for alias in cat.get("wikipedia_section_aliases", []):
        aliases.add(alias.lower().strip())
    for hn in cat.get("historical_names", []):
        aliases.add(hn["name"].lower().strip())
    aliases.add(cat["display_name"].lower().strip())

    best_match = None
    for sect_name, sect_text in sections:
        sect_lower = sect_name.lower().strip()
        if sect_lower in aliases:
            return (sect_name, sect_text)
        for alias in aliases:
            if alias in sect_lower or sect_lower in alias:
                best_match = (sect_name, sect_text)

    return best_match


# ---------------------------------------------------------------------------
# Entry parsing
# ---------------------------------------------------------------------------

def parse_nominees_from_section(section_text, cat, year):
    lines = section_text.split("\n")
    entries = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        is_winner = False
        if stripped.startswith("* ") and not stripped.startswith("** "):
            is_winner = True
            content = stripped[2:]
        elif stripped.startswith("** "):
            content = stripped[3:]
        elif stripped.startswith("*"):
            if stripped.startswith("**"):
                content = stripped[2:]
            else:
                is_winner = True
                content = stripped[1:]
        else:
            continue

        content_clean = content.strip()
        # Strip trailing daggers and stray apostrophes
        content_clean = re.sub(r"\s*[‡†]?\s*'*\s*$", "", content_clean)
        # Strip surrounding bold markers (winner rows wrap entire content in ''')
        content_clean = content_clean.strip("'").strip()
        content_clean = re.sub(r"^'{2,3}", "", content_clean)
        content_clean = re.sub(r"'{2,3}$", "", content_clean)
        content_clean = content_clean.strip()

        if cat.get("has_subject_title", False):
            entry = _parse_song_entry(content_clean)
        else:
            entry = _parse_entry_line(content_clean, cat)
        entry["is_winner"] = is_winner
        entries.append(entry)

    return entries


def _protect_wikilink_dashes(text, placeholder):
    def _replace(m):
        return m.group(0).replace("–", placeholder).replace("—", placeholder)
    return re.sub(r'\[\[[^\]]*\]\]', _replace, text)


def _parse_song_entry(content):
    """
    Parse Best Original Song entry. Golden Globe Wikipedia format:
        "[[Song]]" ([[Writer1]], [[Writer2]], and [[Writer3]]) – ''[[Film]]''
    or  "Song" (Writer1, Writer2) – ''Film''

    Writers come BEFORE the en-dash, film AFTER.
    """
    result = {"name": "", "film": "", "role": "", "extra_names": [], "subject_title": ""}

    # Strip wiki templates that show up sometimes
    content = re.sub(r'\{\{(sort|double-dagger|double dagger|nom|won|efn[^}]*)\|?[^}]*\}\}',
                     '', content, flags=re.IGNORECASE)

    # Match the song name: "[[Song]]" OR "[[Page|Song]]" OR "Song" — at the start
    song_m = re.match(
        r'\s*"?\[\[([^|\]]+?)\|([^\]]+?)\]\]"?\s*'
        r'|\s*"?\[\[([^|\]]+?)\]\]"?\s*'
        r'|\s*"([^"]+)"\s*',
        content,
    )
    if song_m:
        # group ordering across the three alternatives
        subject = (song_m.group(2) or song_m.group(3) or song_m.group(4) or "").strip().strip('"')
        result["subject_title"] = subject
        remainder = content[song_m.end():]
    else:
        remainder = content

    # Now extract writers (parenthesized) and film (after the en-dash)
    # Writers section: leading "(...)" — may contain wikilinks
    writers_m = re.match(r'\s*\(([^)]*)\)\s*', remainder)
    writers_text = ""
    if writers_m:
        writers_text = writers_m.group(1)
        remainder = remainder[writers_m.end():]

    # Film comes after en-dash/em-dash
    DASH_PH = "\x00DASH\x00"
    rem_protected = _protect_wikilink_dashes(remainder, DASH_PH)
    parts = re.split(r'\s*[–—]\s*', rem_protected, maxsplit=1)
    parts = [p.replace(DASH_PH, "–") for p in parts]
    if len(parts) == 2:
        film_part = parts[1].strip()
    else:
        film_part = parts[0].strip()

    result["film"] = _extract_title(film_part)

    # Extract writer names from the parenthesized list
    if writers_text:
        names = _extract_all_names(writers_text)
        if names:
            result["name"] = names[0]
            result["extra_names"] = names[1:]
        else:
            # Fall back to comma-and-and split on the cleaned text
            cleaned = _clean_wikilinks(writers_text)
            parts2 = re.split(r',\s*|\s+and\s+', cleaned)
            parts2 = [p.strip() for p in parts2 if p.strip()]
            if parts2:
                result["name"] = parts2[0]
                result["extra_names"] = parts2[1:]

    return result


def _parse_entry_line(content, cat):
    result = {"name": "", "film": "", "role": "", "extra_names": [], "subject_title": ""}

    content = re.sub(r'\{\{sort\|[^}]*\}\}', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{double-dagger\}\}', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{double dagger\}\}', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{nom\}\}', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{won\}\}', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\{\{efn[^}]*\}\}', '', content, flags=re.IGNORECASE)

    # Some Best Motion Picture - Non-English entries trail the country
    # in parentheses, e.g. "''Film'' (Brazil)". Strip a trailing simple
    # country marker for film extraction; we don't store the country.
    content = re.sub(r"\s*\(([A-Z][A-Za-z .]+)\)\s*$", "", content)

    DASH_PLACEHOLDER = "\x00DASH\x00"
    protected = _protect_wikilink_dashes(content, DASH_PLACEHOLDER)

    parts = re.split(r'\s*[–—]\s*', protected, maxsplit=1)
    parts = [p.replace(DASH_PLACEHOLDER, "–") for p in parts]

    if len(parts) == 2:
        left = parts[0].strip()
        right = parts[1].strip()

        right_core = re.split(r';\s*based on\b', right, maxsplit=1)[0].strip()

        left_is_film = _looks_like_film(left)
        right_is_film = _looks_like_film(right_core)

        if left_is_film:
            result["film"] = _extract_title(left)
            result["name"] = _extract_person_name(right_core)
            result["extra_names"] = _extract_all_names(right_core)
        elif right_is_film:
            result["name"] = _extract_person_name(left)
            # Mirror left_is_film: capture every wikilinked name on the
            # person side, not just the first. Required for team-credited
            # Person-first wikitext like "[[A]] and [[B]] – ''Film''" so
            # downstream code (governed by split_co_recipients) can choose
            # to keep the team on a single row instead of dropping name B.
            result["extra_names"] = _extract_all_names(left)
            film_part = right_core
            as_match = re.split(r'\s+as\s+', film_part, maxsplit=1)
            if len(as_match) == 2:
                result["film"] = _extract_title(as_match[0])
                result["role"] = _clean_wikilinks(as_match[1]).strip()
            else:
                result["film"] = _extract_title(film_part)
        else:
            result["name"] = _extract_person_name(left)
            result["film"] = _extract_title(right_core)
    elif len(parts) == 1:
        single = parts[0].strip()
        if _looks_like_film(single):
            result["film"] = _extract_title(single)
        elif cat.get("tile_type") == "film":
            # Film-tile categories (e.g. GG Best Motion Picture - Drama)
            # often list only the film in the wikitext, with no producer
            # credits and no dash separator. The italic markers around the
            # film were already stripped by the bold-stripping pass that
            # runs in parse_nominees_from_section, so _looks_like_film
            # cannot detect them here. Trust tile_type instead.
            result["film"] = _extract_title(single)
        else:
            result["name"] = _extract_person_name(single)
            film_match = re.search(r"''(?:\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]|([^']+))''", single)
            if film_match:
                result["film"] = (film_match.group(2) or film_match.group(1) or
                                  film_match.group(3) or "").strip()

    result["name"] = _clean_wikilinks(result["name"]).strip()
    result["film"] = result["film"].strip("' ").strip()
    result["role"] = _clean_wikilinks(result["role"]).strip()

    return result


def _looks_like_film(text):
    return bool(re.search(r"''", text))


def _extract_title(text):
    m = re.search(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    if m:
        return (m.group(2) or m.group(1)).strip()
    return re.sub(r"'{2,}", "", text).strip()


def _extract_person_name(text):
    m = re.search(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    if m:
        return (m.group(2) or m.group(1)).strip()
    return _clean_wikilinks(text).strip()


def _extract_all_names(text):
    names = re.findall(r"\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]", text)
    result = []
    for link, display in names:
        name = (display or link).strip()
        if name and not name.isdigit() and len(name) > 2:
            result.append(name)
    return result


def _clean_wikilinks(text):
    text = re.sub(r"\[\[([^|\]]*?)\|([^\]]*?)\]\]", r"\2", text)
    text = re.sub(r"\[\[([^\]]*?)\]\]", r"\1", text)
    text = re.sub(r"'{2,}", "", text)
    text = re.sub(r"\{\{[^}]*\}\}", "", text)
    return text.strip()


# ---------------------------------------------------------------------------
# Row building
# ---------------------------------------------------------------------------

def _build_row_id(category_id, year, trailing_name):
    slug = slugify(trailing_name) if trailing_name else "unknown"
    return f"{category_id}.{year}.{slug}_unresolved"


def _split_co_recipients(name):
    if not name:
        return [name]
    cleaned = re.sub(r"\s*\([^)]*\)\s*", " ", name).strip()
    if "; " in cleaned:
        parts = [p.strip() for p in cleaned.split(";")]
    elif re.search(r'\s+and\s+', cleaned):
        parts = re.split(r',\s*|\s+and\s+', cleaned)
    elif " & " in cleaned:
        parts = [p.strip() for p in cleaned.split(" & ")]
    else:
        return [name]
    parts = [p.strip() for p in parts if p.strip()]
    if not parts:
        return [name]
    for p in parts:
        if len(p) < 3:
            return [name]
    return parts


def build_award_rows(entries, cat, year, page_url, ceremony_num):
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

        if is_single_person and name:
            split_names = _split_co_recipients(name)
        else:
            split_names = [name] if name else [""]

        if is_single_person and len(split_names) > 1:
            all_names = list(split_names)
            for individual_name in split_names:
                others = [n for n in all_names if n != individual_name]
                others_str = ", ".join(others)
                row = {
                    "id": _build_row_id(cat["id"], year, individual_name),
                    "ceremony_id": f"gg.{year}",
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
                    "source_citation": f"{ordinal(ceremony_num)} Golden Globe Awards Wikipedia article, {hist_name} section",
                    "scraped_at": scraped_at,
                    "scrape_version": SCRAPE_VERSION,
                    "verified_status": "auto_verified",
                    "flags": ["single_source_wikipedia_only", "co_recipient"],
                    "notes": f"Shared nomination. Co-recipient with {others_str}.",
                }
                rows.append(row)
        else:
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
                "ceremony_id": f"gg.{year}",
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
                "source_citation": f"{ordinal(ceremony_num)} Golden Globe Awards Wikipedia article, {hist_name} section",
                "scraped_at": scraped_at,
                "scrape_version": SCRAPE_VERSION,
                "verified_status": "auto_verified",
                "flags": ["single_source_wikipedia_only"],
                "notes": None,
            }
            rows.append(row)

    return rows


def detect_co_winners(rows):
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
        description="ORBIT Golden Globe Scraper — scrape GG ceremony data from Wikipedia"
    )
    parser.add_argument(
        "--ceremony", type=int, required=True,
        help=f"Ceremony number (min {MIN_CEREMONY}, e.g. 83 for 2026)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Run scrape and show summary without writing CSV"
    )
    args = parser.parse_args()

    ceremony_num = args.ceremony

    if ceremony_num < MIN_CEREMONY:
        print(f"ERROR: Ceremony {ceremony_num} is before the minimum supported ({MIN_CEREMONY}).")
        print(f"  This scraper only supports ceremonies from {MIN_CEREMONY} ({ceremony_to_year(MIN_CEREMONY)}) onwards.")
        sys.exit(1)

    year = ceremony_to_year(ceremony_num)
    today = date.today()
    max_year = today.year + 1
    if year > max_year:
        print(f"ERROR: Ceremony {ceremony_num} (year {year}) is in the future.")
        sys.exit(1)

    print(f"Scraping {ordinal(ceremony_num)} Golden Globe Awards ({year})")
    print("=" * 60)
    print(f"Source strategy: PATH B (Wikipedia only, single-source)")

    # Load categories
    print("\n[1] Loading categories")
    categories = load_categories()
    active_cats = active_categories(categories, year)
    print(f"  Active categories for {year}: {len(active_cats)}")

    # Fetch Wikipedia
    print(f"\n[2] Fetching Wikipedia article")
    try:
        wikitext, page_url, raw_data = fetch_wikipedia_wikitext(ceremony_num)
    except Exception as e:
        print(f"  FATAL: Could not fetch Wikipedia article: {e}")
        sys.exit(1)

    save_raw_response(ceremony_num, raw_data)

    # Parse wikitext
    print(f"\n[3] Parsing wikitext")
    sections = extract_category_sections(wikitext)
    print(f"  Found {len(sections)} category sections in wikitext")

    # Process each category
    print(f"\n[4] Processing categories")
    all_rows = []
    summary_lines = []
    categories_with_zero_rows = []

    for cat in active_cats:
        hist_name = get_historical_name(cat, year)
        match = match_category_to_section(cat, sections, year)

        if match is None:
            msg = f"  WARNING: No Wikipedia section found for {cat['display_name']} (looked for: {hist_name})"
            print(msg)
            categories_with_zero_rows.append(cat["display_name"])

            os.makedirs(RAW_DIR, exist_ok=True)
            err_path = os.path.join(RAW_DIR,
                                    f"ceremony-{ceremony_num}-{slugify(cat['display_name'])}.parse-error")
            with open(err_path, "w", encoding="utf-8") as f:
                f.write(f"Category: {cat['display_name']}\n")
                f.write(f"Historical name: {hist_name}\n")
                f.write(f"Aliases searched: {cat.get('wikipedia_section_aliases', [])}\n")
                f.write(f"\nAvailable sections:\n")
                for sname, _ in sections:
                    f.write(f"  - {sname}\n")
            summary_lines.append(
                f"[scrape-gg {ceremony_num}] {cat['display_name']}: "
                f"0 rows — section not found in Wikipedia"
            )
            continue

        sect_name, sect_text = match
        entries = parse_nominees_from_section(sect_text, cat, year)

        if not entries:
            categories_with_zero_rows.append(cat["display_name"])
            os.makedirs(RAW_DIR, exist_ok=True)
            err_path = os.path.join(RAW_DIR,
                                    f"ceremony-{ceremony_num}-{slugify(cat['display_name'])}.parse-error")
            with open(err_path, "w", encoding="utf-8") as f:
                f.write(f"Category: {cat['display_name']}\n")
                f.write(f"Section found: {sect_name}\n")
                f.write(f"Section text:\n{sect_text}\n")
            summary_lines.append(
                f"[scrape-gg {ceremony_num}] {cat['display_name']}: "
                f"0 rows — section found but parsing failed"
            )
            continue

        cat_rows = build_award_rows(entries, cat, year, page_url, ceremony_num)
        cat_rows = detect_co_winners(cat_rows)

        summary_lines.append(
            f"[scrape-gg {ceremony_num}] {cat['display_name']}: "
            f"{len(cat_rows)} rows (all single-source wikipedia)"
        )
        all_rows.extend(cat_rows)

    # Summary
    print(f"\n{'=' * 60}")
    print("SCRAPE SUMMARY")
    print(f"{'=' * 60}")
    for line in summary_lines:
        print(f"  {line}")

    auto_verified = sum(1 for r in all_rows if r["verified_status"] == "auto_verified")
    flagged_rows = sum(1 for r in all_rows if r["verified_status"] == "flagged")

    print(f"\n  [scrape-gg {ceremony_num}] TOTAL: {len(all_rows)} rows across "
          f"{len(active_cats)} categories")
    print(f"  [scrape-gg {ceremony_num}] Verified status: "
          f"{auto_verified} auto_verified, {flagged_rows} flagged")
    print(f"  [scrape-gg {ceremony_num}] Cross-check: all single-source (PATH B)")

    if categories_with_zero_rows:
        print(f"\n  WARNING: {len(categories_with_zero_rows)} categories with zero rows:")
        for c in categories_with_zero_rows:
            print(f"    - {c}")

    # Write output
    csv_path = os.path.join(SCRAPED_DIR, f"gg-ceremony-{ceremony_num}.csv")

    if args.dry_run:
        print(f"\n  --dry-run: would write to {csv_path}")
        print(f"  --dry-run: no CSV written")
    else:
        write_csv(all_rows, csv_path)
        print(f"\n  [scrape-gg {ceremony_num}] Output: {csv_path}")

    # Landmark verification (printed for human verification, not asserted)
    print(f"\n  === Landmark winners (verify against Wikipedia article) ===")
    landmark_cats = [
        "gg.best_motion_picture_drama",
        "gg.best_motion_picture_musical_comedy",
        "gg.best_director",
        "gg.best_screenplay",
        "gg.best_motion_picture_animated",
        "gg.best_motion_picture_non_english",
        "gg.best_original_score",
        "gg.best_original_song",
        "gg.cinematic_box_office_achievement",
    ]
    for cat_id in landmark_cats:
        won = [r for r in all_rows if r["category_id"] == cat_id and r["result"] == "won"]
        if won:
            r = won[0]
            name = r["recipients"][0]["name"] if r["recipients"] else "(none)"
            subj = r.get("subject_title")
            if subj:
                print(f"  {cat_id}: \"{subj}\" / {r['film_title']} / {name}")
            else:
                print(f"  {cat_id}: {name} / {r['film_title']}")
        else:
            print(f"  {cat_id}: no winner row found")

    # Source-strategy + summary footer
    print(f"\n  === Source strategy ===")
    print(f"  PATH B (Wikipedia only). Reasoning: goldenglobes.com /winners-nominees/")
    print(f"  is React-rendered (page-template-page-winners-nominees-react).")
    print(f"  Project policy forbids headless browsers, so static HTML is unparseable.")
    print(f"  Wikipedia is the sole accessible authoritative source.")

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
