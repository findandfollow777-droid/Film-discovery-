#!/usr/bin/env python3
"""
ORBIT — TMDB Film ID Resolution Pass
=====================================
Reads every festival ceremony CSV in data/scraped/{festival}/, extracts
unique (film_title, honours_year) pairs needing TMDB resolution, searches
TMDB /search/movie for each, caches results, then writes film_tmdb_id,
film_poster_path, and film_release_year back to the CSVs.

Run from project root:
    python3 scripts/resolve-film-tmdb-ids.py

Resumable: cache (data/tmdb-film-cache.json) is loaded on each run, so
re-runs only hit TMDB for new or previously-unresolved titles.
"""

import csv
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import OrderedDict
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRAPED_DIR  = PROJECT_ROOT / "data" / "scraped"
CACHE_FILE   = PROJECT_ROOT / "data" / "tmdb-film-cache.json"
UNRESOLVED_LOG = PROJECT_ROOT / "data" / "tmdb-film-unresolved.txt"
CONFIG_FILE  = PROJECT_ROOT / "config.js"

BASE_URL = "https://api.themoviedb.org/3"

# Festival → honours-year convention
CEREMONY_YEAR_FESTIVALS = {"oscar", "bafta", "gg"}    # honours_year = year - 1
FESTIVAL_YEAR_FESTIVALS = {"cannes", "venice", "berlin"}  # honours_year = year

# Rate limiting (TMDB allows ~40 requests / 10 seconds)
REQUESTS_PER_BURST = 38
BURST_PAUSE       = 10.5
INTER_REQUEST_GAP = 0.12

# Year-search retry order (offsets relative to honours_year; None = no year filter)
YEAR_RETRY_OFFSETS = [0, -1, 1, None]

PROGRESS_INTERVAL = 50

# ── API key ───────────────────────────────────────────────────────────────────

def load_api_key() -> str:
    if not CONFIG_FILE.exists():
        sys.exit(f"FATAL: {CONFIG_FILE} not found")
    text = CONFIG_FILE.read_text(encoding="utf-8")

    # Try named-variable pattern first
    m = re.search(r"TMDB_API_KEY\s*=\s*['\"]([^'\"]+)['\"]", text)
    if m:
        return m.group(1)

    # Fall back to bare 32-char hex string (same pattern as resolve-tmdb-ids.py)
    m = re.search(r"['\"]([a-f0-9]{32})['\"]", text)
    if m:
        return m.group(1)

    sys.exit("FATAL: no TMDB API key found in config.js")


# ── Cache ─────────────────────────────────────────────────────────────────────

def load_cache() -> dict:
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            sys.exit(f"FATAL: {CACHE_FILE} is malformed JSON: {e}")
    return {}


def save_cache(cache: dict) -> None:
    tmp = CACHE_FILE.with_suffix(CACHE_FILE.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2, sort_keys=True)
    os.replace(tmp, CACHE_FILE)


def cache_key(title: str, honours_year) -> str:
    """Stable cache key: title|year (year may be empty for no-year-known titles)."""
    return f"{title}|{honours_year if honours_year is not None else ''}"


# ── TMDB search ───────────────────────────────────────────────────────────────

_request_count = 0


def tmdb_get(url: str, max_retries: int = 3) -> dict:
    """Rate-limited GET with retry on 429.

    Returns parsed JSON dict, or {} on hard failure.
    """
    global _request_count

    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(url, timeout=10) as resp:
                if resp.status == 200:
                    body = resp.read().decode("utf-8")
                    _request_count += 1
                    # Inter-request gap
                    time.sleep(INTER_REQUEST_GAP)
                    # Burst-pause check
                    if _request_count % REQUESTS_PER_BURST == 0:
                        print(f"    ⏸  burst limit — sleeping {BURST_PAUSE}s")
                        time.sleep(BURST_PAUSE)
                    return json.loads(body)
                # Unexpected non-429 status
                return {}
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"    ⚠️  429 rate-limited — sleeping 15s (attempt {attempt+1}/{max_retries})")
                time.sleep(15)
                continue
            print(f"    ⚠️  HTTP {e.code}: {url[:100]}")
            return {}
        except urllib.error.URLError as e:
            print(f"    ⚠️  network error: {e} — sleeping 5s (attempt {attempt+1}/{max_retries})")
            time.sleep(5)
            continue
        except Exception as e:
            print(f"    ⚠️  unexpected error: {e}")
            return {}

    return {}


def search_film(title: str, honours_year, api_key: str) -> dict:
    """Search TMDB for a film. Try exact year, then ±1, then no year filter.

    Returns dict with keys {tmdb_id, poster_path, release_year, searched} on success,
    or {searched: [...]} with no result keys on failure (still records what we tried).
    """
    searched = []
    for offset in YEAR_RETRY_OFFSETS:
        if offset is None or honours_year is None:
            year_param = None
            search_label = "no_year"
        else:
            year_param = honours_year + offset
            search_label = str(year_param)

        params = {
            "api_key": api_key,
            "query": title,
            "language": "en-US",
            "include_adult": "false",
        }
        if year_param is not None:
            params["year"] = str(year_param)

        url = f"{BASE_URL}/search/movie?{urllib.parse.urlencode(params)}"
        data = tmdb_get(url)
        searched.append(search_label)

        results = data.get("results", []) if data else []
        if results:
            top = results[0]
            release_date = top.get("release_date") or ""
            release_year = None
            if len(release_date) >= 4 and release_date[:4].isdigit():
                release_year = int(release_date[:4])
            return {
                "tmdb_id": top.get("id"),
                "poster_path": top.get("poster_path") or None,
                "release_year": release_year,
                "searched": searched,
            }

        # If we got an empty results array but the request succeeded,
        # only the year_param was wrong — try next offset.
        # If `data` is {} the request failed; still try next offset
        # since intermittent failures shouldn't poison the cache permanently.

        # Once we've tried no_year and still got nothing, stop.
        if year_param is None:
            break

    return {"searched": searched}


# ── CSV scanning ──────────────────────────────────────────────────────────────

def parse_year_from_row(row: dict, festival: str):
    """Derive honours_year from a row.

    Strategy:
      1. Use `year` column if present and parseable as int.
      2. Else parse from `ceremony_id` (e.g. "oscar.2025" → 2025).
      3. Apply festival convention: oscar/bafta/gg → year-1; others → year.
    Returns int or None.
    """
    year_str = (row.get("year") or "").strip()
    raw_year = None

    if year_str.isdigit():
        raw_year = int(year_str)
    else:
        cer_id = (row.get("ceremony_id") or "").strip()
        m = re.search(r"(\d{4})", cer_id)
        if m:
            raw_year = int(m.group(1))

    if raw_year is None:
        return None

    if festival in CEREMONY_YEAR_FESTIVALS:
        return raw_year - 1
    return raw_year


def needs_resolution(row: dict) -> bool:
    """Row needs film_tmdb_id resolution if title is non-empty and id is empty/0."""
    title = (row.get("film_title") or "").strip()
    tmdb_id = (row.get("film_tmdb_id") or "").strip()
    if not title or title.lower() in ("none", "null"):
        return False
    return tmdb_id in ("", "0", "None", "null")


def collect_targets() -> tuple:
    """Walk all data/scraped/{festival}/*.csv, build:

    Returns:
      targets: OrderedDict[(title, honours_year)] = None  (preserves first-seen order)
      missing_year_rows: list of (csv_path, row_id) — rows with no derivable year
      total_rows_needing: int — total CSV rows with empty film_tmdb_id
    """
    targets = OrderedDict()
    missing_year_rows = []
    total_rows_needing = 0

    festival_dirs = sorted(p for p in SCRAPED_DIR.iterdir()
                            if p.is_dir() and p.name in CEREMONY_YEAR_FESTIVALS | FESTIVAL_YEAR_FESTIVALS)

    for fest_dir in festival_dirs:
        festival = fest_dir.name
        for csv_path in sorted(fest_dir.glob("*.csv")):
            try:
                with open(csv_path, encoding="utf-8") as f:
                    for row in csv.DictReader(f):
                        if not needs_resolution(row):
                            continue
                        total_rows_needing += 1
                        title = row["film_title"].strip()
                        honours_year = parse_year_from_row(row, festival)
                        if honours_year is None:
                            missing_year_rows.append((str(csv_path.relative_to(PROJECT_ROOT)),
                                                       row.get("id", "(no id)")))
                            # Still add to targets without year so we can retry no-year search
                            targets.setdefault((title, None), None)
                        else:
                            targets.setdefault((title, honours_year), None)
            except Exception as e:
                print(f"  ⚠️  failed to scan {csv_path}: {e}")

    return targets, missing_year_rows, total_rows_needing


# ── CSV write-back ────────────────────────────────────────────────────────────

def write_back_csvs(cache: dict) -> tuple:
    """Update every festival CSV with cached resolution data.

    Returns: (rows_updated, rows_left_empty, csvs_modified)
    """
    rows_updated = 0
    rows_left_empty = 0
    csvs_modified = 0

    festival_dirs = sorted(p for p in SCRAPED_DIR.iterdir()
                            if p.is_dir() and p.name in CEREMONY_YEAR_FESTIVALS | FESTIVAL_YEAR_FESTIVALS)

    for fest_dir in festival_dirs:
        festival = fest_dir.name
        for csv_path in sorted(fest_dir.glob("*.csv")):
            modified = False
            try:
                with open(csv_path, encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    fieldnames = reader.fieldnames
                    rows = list(reader)
            except Exception as e:
                print(f"  ⚠️  failed to read {csv_path}: {e}")
                continue

            if not fieldnames:
                continue

            for row in rows:
                if not needs_resolution(row):
                    continue
                title = row["film_title"].strip()
                honours_year = parse_year_from_row(row, festival)
                key = cache_key(title, honours_year)
                hit = cache.get(key)
                if hit is None:
                    rows_left_empty += 1
                    continue
                # hit is a dict with {tmdb_id, poster_path, release_year}
                if hit.get("tmdb_id") is not None:
                    row["film_tmdb_id"] = str(hit["tmdb_id"])
                    if "film_poster_path" in fieldnames:
                        row["film_poster_path"] = hit.get("poster_path") or ""
                    if "film_release_year" in fieldnames:
                        ry = hit.get("release_year")
                        row["film_release_year"] = str(ry) if ry is not None else ""
                    rows_updated += 1
                    modified = True
                else:
                    rows_left_empty += 1

            if modified:
                tmp = csv_path.with_suffix(csv_path.suffix + ".tmp")
                with open(tmp, "w", encoding="utf-8", newline="") as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
                    writer.writeheader()
                    writer.writerows(rows)
                os.replace(tmp, csv_path)
                csvs_modified += 1

    return rows_updated, rows_left_empty, csvs_modified


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("ORBIT TMDB Film ID Resolution Pass")
    print("=" * 60)

    api_key = load_api_key()
    print(f"API key loaded (last 4: ...{api_key[-4:]})")

    cache = load_cache()
    print(f"Cache loaded: {len(cache)} entries already resolved")

    # ── Collect targets ──
    print("\nScanning festival CSVs for unresolved film_tmdb_id rows...")
    targets, missing_year_rows, total_rows_needing = collect_targets()
    print(f"  Total CSV rows needing resolution: {total_rows_needing}")
    print(f"  Unique (title, honours_year) pairs: {len(targets)}")
    if missing_year_rows:
        print(f"  Rows with no derivable year: {len(missing_year_rows)} "
              "(will use no-year search)")

    # Filter to uncached only
    uncached = [pair for pair in targets if cache_key(*pair) not in cache]
    cached = len(targets) - len(uncached)
    print(f"  Already in cache: {cached}")
    print(f"  Need TMDB lookup: {len(uncached)}")

    if not uncached:
        print("\nNothing to look up. Skipping straight to CSV write-back.")
    else:
        print(f"\nLooking up {len(uncached)} titles via TMDB...")
        resolved = 0
        unresolved = 0
        for i, (title, honours_year) in enumerate(uncached, 1):
            result = search_film(title, honours_year, api_key)
            key = cache_key(title, honours_year)
            if result.get("tmdb_id") is not None:
                cache[key] = {
                    "tmdb_id":      result["tmdb_id"],
                    "poster_path":  result.get("poster_path"),
                    "release_year": result.get("release_year"),
                }
                resolved += 1
            else:
                cache[key] = None
                unresolved += 1

            if i % PROGRESS_INTERVAL == 0:
                print(f"  [{i}/{len(uncached)}] resolved:{resolved} unresolved:{unresolved}")
                save_cache(cache)  # checkpoint

        save_cache(cache)
        print(f"\n  Lookup pass complete: resolved={resolved} unresolved={unresolved}")

    # ── Write back to CSVs ──
    print("\nWriting resolved IDs back to festival CSVs...")
    rows_updated, rows_left_empty, csvs_modified = write_back_csvs(cache)
    print(f"  CSVs modified: {csvs_modified}")
    print(f"  Rows updated:  {rows_updated}")
    print(f"  Rows left empty (cache miss / unresolved): {rows_left_empty}")

    # ── Unresolved log ──
    unresolved_entries = [(k, v) for k, v in cache.items() if v is None]
    if unresolved_entries:
        with open(UNRESOLVED_LOG, "w", encoding="utf-8") as f:
            f.write(f"# TMDB film resolution unresolved titles ({len(unresolved_entries)})\n")
            f.write(f"# Format: title|honours_year  (searched years: ...)\n\n")
            for key, _ in sorted(unresolved_entries):
                f.write(f"{key}\n")
        print(f"\n  Unresolved log: {UNRESOLVED_LOG.relative_to(PROJECT_ROOT)} "
              f"({len(unresolved_entries)} entries)")

    # ── Summary ──
    total_cached = len([v for v in cache.values() if v is not None])
    pct_resolved = (total_cached / max(1, len(cache))) * 100
    print("\n" + "=" * 60)
    print("=== TMDB Film Resolution Complete ===")
    print(f"Cache entries:    {len(cache)} total")
    print(f"  Resolved:       {total_cached} ({pct_resolved:.1f}%)")
    print(f"  Unresolved:     {len(cache) - total_cached}")
    print(f"CSV rows updated: {rows_updated}")
    print(f"CSV rows still empty: {rows_left_empty}")
    print(f"API requests this run: {_request_count}")
    print(f"Cache file: {CACHE_FILE.relative_to(PROJECT_ROOT)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
