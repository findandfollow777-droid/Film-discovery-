#!/usr/bin/env python3
"""
ORBIT — TMDB Film ID RETRY Pass (Phase 1 cleanup)
==================================================
Re-attempts resolution for entries in data/tmdb-film-unresolved.txt
after applying title normalisation: strips &nbsp;/\\xa0, wikitext
[[X|Y]] → Y, "from X" prefixes, trailing paren translations, and
trailing single-bracket alt titles. Skips entries that look like
person names — those leaked from legacy CSV shape (GG cer 57
acting categories + Oscar score categories) and won't resolve
as films.

Run from project root after the main resolver:
    python3 scripts/resolve-film-tmdb-ids-retry.py

Reads/writes the same cache (data/tmdb-film-cache.json) and rewrites
the unresolved log (data/tmdb-film-unresolved.txt) with whatever
still cannot be resolved after retry.
"""

import csv
import html
import json
import os
import re
import sys
import time
import importlib.util
from pathlib import Path

# Load the original resolver as a module to reuse helpers
# (load_api_key, load_cache, save_cache, search_film, write_back_csvs,
# cache_key, parse_year_from_row).
_SCRIPT = Path(__file__).resolve().parent / "resolve-film-tmdb-ids.py"
_spec = importlib.util.spec_from_file_location("rftmdb", _SCRIPT)
_orig = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_orig)

PROJECT_ROOT   = _orig.PROJECT_ROOT
CACHE_FILE     = _orig.CACHE_FILE
UNRESOLVED_LOG = _orig.UNRESOLVED_LOG

# Tighten year-bracket for retry pass — drop the no_year fallback that
# the main resolver uses as a last resort. Entries reaching the retry
# pass already failed main resolution (including no_year), so no_year
# adds no signal and risks wrong matches on ambiguous titles like
# "The Door" → some unrelated 2004 film. ±1 keeps useful festival-lag
# tolerance without that risk.
_orig.YEAR_RETRY_OFFSETS = [0, -1, 1]

# Person-name overrides for entries with 3+ words or composite shapes
# that the 2-cap heuristic doesn't catch.
PERSON_NAMES_OVERRIDE = {
    "Haley Joel Osment",
    "Michael Clarke Duncan",
    "Joel Coen and Ethan Coen",
    "José Prats, Natalia Kyriacou, and Bernardo Angeletti",
}


def is_person_name(title: str) -> bool:
    """Heuristic: two capitalised words OR explicit override match.
    Excludes any title with HTML entities, wikitext, brackets, or
    colons — person names never carry those markers, but short-film
    titles often do (e.g., 'Tanghi Argentini&nbsp;', 'Himalaya: Caravan').
    """
    if title in PERSON_NAMES_OVERRIDE:
        return True
    if any(m in title for m in ('&', '\xa0', '[', ']', ':')):
        return False
    words = title.strip().split()
    if len(words) == 2 and all(w and w[0].isupper() for w in words):
        return True
    return False


def normalise_title(title: str) -> str:
    """Apply the Phase 1 cleanup transforms to a title string."""
    title = html.unescape(title)
    title = title.replace('\xa0', ' ')
    # Wikitext [[X|Y]] → Y, [[X]] → X
    title = re.sub(r'\[\[(?:[^\]|]+\|)?([^\]]+)\]\]', r'\1', title)
    # "from X" prefix
    title = re.sub(r'^from\s+', '', title, flags=re.IGNORECASE)
    # Trailing paren content
    title = re.sub(r'\s*\([^)]+\)\s*$', '', title)
    # Trailing single-bracket alt title (e.g. "(A) Torzija [(A) Torsion]")
    title = re.sub(r'\s*\[[^\]]+\]\s*$', '', title)
    # Collapse multiple spaces
    title = ' '.join(title.split())
    return title.strip()


def parse_unresolved_entry(line: str):
    """Split 'title|year' into (title, year_int_or_None).
    Strips any trailing search-trace annotation in parentheses
    e.g. '...|2017  (searched years: 2017, 2016, 2018, no_year)'.
    """
    line = re.sub(r'\s*\(searched years:[^)]*\)\s*$', '', line).rstrip()
    if '|' not in line:
        return line.strip(), None
    title, _, year_str = line.rpartition('|')
    title = title.strip()
    year_str = year_str.strip()
    try:
        return title, int(year_str)
    except ValueError:
        return title, None


def main():
    print("=" * 60)
    print("ORBIT TMDB Film ID Retry Pass (Phase 1 cleanup)")
    print("=" * 60)

    api_key = _orig.load_api_key()
    print(f"API key loaded (last 4: ...{api_key[-4:]})")

    cache = _orig.load_cache()
    print(f"Cache loaded: {len(cache)} entries")

    if not UNRESOLVED_LOG.exists():
        sys.exit(f"FATAL: {UNRESOLVED_LOG} not found")

    with open(UNRESOLVED_LOG, encoding="utf-8") as f:
        raw_lines = [l.rstrip('\n') for l in f
                     if l.strip() and not l.startswith('#')]

    print(f"Unresolved entries in file: {len(raw_lines)}")

    # Categorise
    person_skip = []
    nochange_skip = []
    retry_targets = []  # list of (orig_line, orig_title, year, normalised_title)

    for line in raw_lines:
        title, year = parse_unresolved_entry(line)
        if is_person_name(title):
            person_skip.append(line)
            continue
        normalised = normalise_title(title)
        if normalised == title:
            nochange_skip.append(line)
        elif not normalised:
            # Normalisation reduced to empty — skip
            nochange_skip.append(line)
        else:
            retry_targets.append((line, title, year, normalised))

    print(f"  Person-name entries (skip):      {len(person_skip)}")
    print(f"  Title unchanged (skip):          {len(nochange_skip)}")
    print(f"  Will retry with normalised title: {len(retry_targets)}")

    # Retry loop
    if retry_targets:
        print(f"\nRetrying {len(retry_targets)} normalised titles...")
        resolved_count = 0
        still_unresolved = []
        for line, title, year, normalised in retry_targets:
            result = _orig.search_film(normalised, year, api_key)
            tmdb_id = result.get("tmdb_id") if result else None
            orig_key = _orig.cache_key(title, year)
            if tmdb_id:
                cache[orig_key] = {
                    "tmdb_id":      tmdb_id,
                    "poster_path":  result.get("poster_path"),
                    "release_year": result.get("release_year"),
                }
                resolved_count += 1
                rel = result.get("release_year") or "?"
                print(f"  ✓ '{title[:48]}' → '{normalised[:48]}' = id={tmdb_id} ({rel})")
            else:
                still_unresolved.append(line)
                print(f"  ✗ '{title[:48]}' → '{normalised[:48]}' (still no match)")

        _orig.save_cache(cache)
        print(f"\nResolved this pass: {resolved_count} / {len(retry_targets)}")
    else:
        resolved_count = 0
        still_unresolved = []
        print("\nNothing to retry.")

    # Final unresolved set
    final_unresolved = sorted(person_skip + nochange_skip + still_unresolved)
    print(f"Final unresolved: {len(final_unresolved)} entries")

    # Rewrite unresolved log
    with open(UNRESOLVED_LOG, "w", encoding="utf-8") as f:
        f.write(f"# TMDB film resolution unresolved titles ({len(final_unresolved)})\n")
        f.write(f"# Format: title|honours_year\n")
        f.write(f"# After Phase 1 retry pass — remaining entries are\n")
        f.write(f"# either person names leaked from legacy CSV shape,\n")
        f.write(f"# or obscure titles with no clear TMDB match.\n\n")
        for l in final_unresolved:
            f.write(f"{l}\n")

    # Write resolved IDs back to CSVs (uses cache lookup; cache is keyed
    # by the original title|year so the existing CSV title strings still
    # match without modification).
    if resolved_count:
        print("\nWriting resolved IDs back to CSVs...")
        rows_updated, rows_left_empty, csvs_modified = _orig.write_back_csvs(cache)
        print(f"  CSVs modified:    {csvs_modified}")
        print(f"  Rows updated:     {rows_updated}")
        print(f"  Rows left empty:  {rows_left_empty}")

    print("\n" + "=" * 60)
    print(f"Retry pass complete.")
    print(f"  Newly resolved:    {resolved_count}")
    print(f"  Still unresolved:  {len(final_unresolved)}")
    print(f"  Cache file:        {CACHE_FILE.relative_to(PROJECT_ROOT)}")
    print(f"  Unresolved log:    {UNRESOLVED_LOG.relative_to(PROJECT_ROOT)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
