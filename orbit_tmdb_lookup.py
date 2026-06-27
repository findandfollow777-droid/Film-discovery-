#!/usr/bin/env python3
"""
ORBIT — TMDB Person ID Lookup Pass
====================================
Reads every person-centric awards CSV in the ORBIT project,
looks up each nominee name via TMDB /search/person, and writes
enriched versions with real tmdb_id values filled in.

Run from your ORBIT project root:
    python orbit_tmdb_lookup.py

Requirements:
    pip install requests
"""

import csv
import json
import os
import time
import requests
from pathlib import Path
from collections import defaultdict

# ── Config ─────────────────────────────────────────────────────────────────

API_KEY   = "dd1b9aebd0769bc49a68b7853b6f4266"
BASE_URL  = "https://api.themoviedb.org/3"
CACHE_FILE = Path("orbit_tmdb_cache.json")   # persists between runs

# Rate limiting: TMDB allows ~40 requests / 10 seconds
REQUESTS_PER_BURST = 38
BURST_PAUSE        = 10.5   # seconds
INTER_REQUEST_GAP  = 0.12   # seconds between individual requests

# ── Files to enrich ─────────────────────────────────────────────────────────
# Format: (input_path, output_path)
# All paths relative to project root (where you run this script from)

FILES = [
    # CSVs in data/ directory (hyphenated names)
    ("data/person-data-raw.csv",         "enriched/persondataraw_enriched.csv"),
    ("data/golden-globe-extra.csv",      "enriched/goldenglobeextra_enriched.csv"),
    ("data/awards-7col-template.csv",    "enriched/awards7coltemplate_enriched.csv"),
    ("data/bafta-actor-data.csv",        "enriched/baftaactordata_enriched.csv"),
    ("data/bafta-actor-early.csv",       "enriched/baftaactorearly_enriched.csv"),
    ("data/bafta-actress-raw.csv",       "enriched/baftaactressraw_enriched.csv"),
    ("data/bafta-director-raw.csv",      "enriched/baftadirectorraw_enriched.csv"),
    ("data/gg-director-2000.csv",        "enriched/ggdirector2000_enriched.csv"),
    ("data/gg-director-early.csv",       "enriched/ggdirectorearly_enriched.csv"),
]

# Also enrich the output CSVs if they exist
OUTPUT_DIR = Path(".")   # CSVs are in the project root
PERSON_CENTRIC_OUTPUTS = [
    # Oscar
    "Oscar_Supporting_Actor_FULL CSV.csv",
    "Oscar_Supporting_Actress_FULL CSV.csv",
    "Oscar_Screenplay_FULL CSV.csv",
    "Oscar_Cinematography_WINNERS CSV.csv",
    "Oscar_Film_Editing_WINNERS CSV.csv",
    "Oscar_Original_Score_WINNERS CSV.csv",
    "Oscar_Original_Song_WINNERS CSV.csv",
    "Oscar_Sound_WINNERS CSV.csv",
    "Oscar_Production_Design_WINNERS CSV.csv",
    "Oscar_Costume_Design_WINNERS CSV.csv",
    "Oscar_Makeup_WINNERS CSV.csv",
    "Oscar_Visual_Effects_WINNERS CSV.csv",
    "Oscar_Animated_Feature_WINNERS.csv",
    "Oscar_Documentary_WINNERS CSV.csv",
    "Oscar_International_Feature_WINNERS CSV.csv",
    # Golden Globe
    "GoldenGlobe_Supporting_FULL CSV.csv",
    "GoldenGlobe_Screenplay_FULL CSV.csv",
    # BAFTA
    "BAFTA_Supporting_Actor_FULL CSV.csv",
    "BAFTA_Supporting_Actress_FULL CSV.csv",
    "BAFTA_Screenplay_FULL CSV.csv",
    "BAFTA_Cinematography_WINNERS CSV.csv",
    "BAFTA_Film_Editing_WINNERS CSV.csv",
    "BAFTA_Original_Score_WINNERS CSV.csv",
    "BAFTA_Sound_WINNERS CSV.csv",
    "BAFTA_Production_Design_WINNERS CSV.csv",
    "BAFTA_Costume_Design_WINNERS CSV.csv",
    "BAFTA_Makeup_WINNERS CSV.csv",
    "BAFTA_Visual_Effects_WINNERS CSV.csv",
    # Cannes
    "Cannes_Best_Actor_WINNERS CSV.csv",
    "Cannes_Best_Actress_WINNERS CSV.csv",
    # Berlin
    "Berlin_Silver_Bear_Actor_WINNERS CSV.csv",
    "Berlin_Silver_Bear_Actress_WINNERS CSV.csv",
]

# ── Helpers ─────────────────────────────────────────────────────────────────

def load_cache():
    if CACHE_FILE.exists():
        with open(CACHE_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_cache(cache):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def tmdb_lookup(name: str, cache: dict) -> int:
    """Return TMDB person ID for name, using cache. Returns 0 if not found."""
    if name in cache:
        return cache[name]

    # Multi-person credits like "John Williams; Ennio Morricone" — use first
    primary = name.split(";")[0].strip()
    # Some nominees have role annotations like "John Smith (dir.)" — strip
    primary = primary.split("(")[0].strip()

    try:
        r = requests.get(
            f"{BASE_URL}/search/person",
            params={"api_key": API_KEY, "query": primary},
            timeout=8,
        )
        if r.status_code == 200:
            results = r.json().get("results", [])
            tmdb_id = results[0]["id"] if results else 0
        elif r.status_code == 429:
            print(f"    ⚠️  Rate limited — sleeping 15s")
            time.sleep(15)
            return tmdb_lookup(name, cache)   # retry once
        else:
            print(f"    ⚠️  HTTP {r.status_code} for: {name}")
            tmdb_id = 0
    except Exception as e:
        print(f"    ⚠️  Error looking up '{name}': {e}")
        tmdb_id = 0

    cache[name] = tmdb_id
    return tmdb_id

def read_csv_flexible(path: Path):
    """Read a CSV that may or may not have a proper header row."""
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()

    # Find header row
    for i, line in enumerate(lines):
        lower = line.lower()
        if "nominee" in lower or "year" in lower:
            # This looks like a header
            reader = csv.DictReader(lines[i:])
            rows = list(reader)
            if rows and "nominee" in rows[0]:
                return reader.fieldnames, rows

    # No header found — use positional columns
    COLS = ["tmdb_id", "nominee", "year", "festival", "category", "won", "movie_title"]
    reader = csv.DictReader(lines, fieldnames=COLS)
    rows = [r for r in reader
            if r.get("nominee", "").strip().lower() not in ("nominee", "")]
    return COLS, rows

def enrich_file(input_path: Path, output_path: Path, cache: dict,
                request_counter: list):
    """Read input CSV, fill in tmdb_ids, write to output_path."""
    if not input_path.exists():
        print(f"  SKIP (not found): {input_path}")
        return 0, 0

    fieldnames, rows = read_csv_flexible(input_path)
    if "nominee" not in (fieldnames or []):
        print(f"  SKIP (no nominee column): {input_path.name}")
        return 0, 0

    output_path.parent.mkdir(parents=True, exist_ok=True)

    enriched = 0
    skipped  = 0
    already  = 0

    for row in rows:
        name = row.get("nominee", "").strip()
        if not name or name.lower() == "nominee":
            skipped += 1
            continue

        current_id = str(row.get("tmdb_id", "0")).strip()
        if current_id not in ("0", "", "None"):
            already += 1
            continue

        tmdb_id = tmdb_lookup(name, cache)
        row["tmdb_id"] = tmdb_id
        if tmdb_id:
            enriched += 1
        else:
            skipped += 1

        request_counter[0] += 1

        # Rate limiting
        if name not in cache or cache.get(name) is None:
            time.sleep(INTER_REQUEST_GAP)
            if request_counter[0] % REQUESTS_PER_BURST == 0:
                print(f"    ⏸  Burst limit — sleeping {BURST_PAUSE}s")
                time.sleep(BURST_PAUSE)

    # Write output
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames,
                                extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    return enriched, skipped

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("="*60)
    print("ORBIT TMDB ID Lookup Pass")
    print("="*60)

    cache = load_cache()
    print(f"Cache loaded: {len(cache)} names already resolved\n")

    request_counter = [0]   # mutable counter passed by ref
    total_enriched = 0
    total_skipped  = 0

    # ── Project root files ──
    print("── Project files ──")
    for inp, out in FILES:
        ip = Path(inp)
        op = Path(out)
        print(f"  {ip.name} → {op}")
        e, s = enrich_file(ip, op, cache, request_counter)
        total_enriched += e
        total_skipped  += s
        print(f"    ✓ enriched:{e}  skipped:{s}")
        save_cache(cache)   # save after each file

    # ── 17 output CSVs ──
    print("\n── Awards output CSVs ──")
    for fname in PERSON_CENTRIC_OUTPUTS:
        ip = OUTPUT_DIR / fname
        op = OUTPUT_DIR / "enriched" / fname
        print(f"  {fname}")
        e, s = enrich_file(ip, op, cache, request_counter)
        total_enriched += e
        total_skipped  += s
        print(f"    ✓ enriched:{e}  skipped:{s}")
        save_cache(cache)

    # ── Summary ──
    print("\n" + "="*60)
    print(f"DONE")
    print(f"  Total API requests made: {request_counter[0]}")
    print(f"  Total IDs filled in:     {total_enriched}")
    print(f"  Total not found / skip:  {total_skipped}")
    print(f"  Cache size now:          {len(cache)} names")
    print(f"\nEnriched files written to:")
    print(f"  enriched/   (project files)")
    print(f"  {OUTPUT_DIR}/enriched/  (award CSVs)")
    print("\nRun again any time — already-resolved names use the cache.")
    print("="*60)

if __name__ == "__main__":
    main()
