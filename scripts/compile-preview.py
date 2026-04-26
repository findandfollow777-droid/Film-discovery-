#!/usr/bin/env python3
"""
ORBIT Awards Preview Compiler

Reads the 26 Oscar ceremony CSVs and produces:
1. data/awards-data-v1.2-preview.json — canonical v1.2 JSON
2. data/awards-data-v1.2-preview-legacy.js — legacy-shaped JS for existing UI

Run: python3 scripts/compile-preview.py
"""

import csv
import json
import os
import glob
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-oscar-categories.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "oscar")
OUTPUT_JSON = os.path.join(REPO_ROOT, "data", "awards-data-v1.2-preview.json")
OUTPUT_LEGACY_JS = os.path.join(REPO_ROOT, "data", "awards-data-v1.2-preview-legacy.js")

# ---------------------------------------------------------------------------
# Load inputs
# ---------------------------------------------------------------------------

def load_categories():
    with open(CATEGORIES_FILE, encoding="utf-8") as f:
        return json.load(f)


def load_all_ceremony_csvs():
    """Load all oscar-ceremony-*.csv files. Return list of row dicts."""
    pattern = os.path.join(SCRAPED_DIR, "oscar-ceremony-*.csv")
    files = sorted(glob.glob(pattern))
    all_rows = []
    for path in files:
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                # Parse JSON-encoded fields
                r["recipients"] = json.loads(r["recipients_json"])
                r["flags"] = json.loads(r["flags_json"])
                r["year"] = int(r["year"])
                # Normalise empty strings to None
                for key in ("film_tmdb_id", "film_release_year", "film_poster_path",
                            "subject_title", "notes"):
                    if r.get(key) == "":
                        r[key] = None
                all_rows.append(r)
    return all_rows, files


def get_historical_name(cat, year):
    """Get the display name active in a given year from historical_names."""
    for hn in cat.get("historical_names", []):
        if year >= hn["from"] and (hn["to"] is None or year <= hn["to"]):
            return hn["name"]
    return cat["display_name"]


# ---------------------------------------------------------------------------
# Build v1.2 JSON
# ---------------------------------------------------------------------------

def build_v12_json(all_rows, categories, csv_files):
    """Build the canonical v1.2 JSON structure."""
    now = datetime.now(timezone.utc).isoformat()
    years = [r["year"] for r in all_rows]

    # Festival record
    festival = {
        "id": "oscar",
        "display_name": "Academy Awards (Oscars)",
        "short_name": "Oscar",
        "country": "United States",
        "first_year": 1929,
    }

    # Ceremony records
    ceremony_years = sorted(set(r["year"] for r in all_rows))
    ceremonies = []
    for yr in ceremony_years:
        cer_num = yr - 1928
        ceremonies.append({
            "id": f"oscar.{yr}",
            "festival_id": "oscar",
            "ceremony_number": cer_num,
            "year": yr,
            "date": None,
            "venue": None,
        })

    # Category records (from categories.json)
    cat_records = []
    for cat in categories:
        cat_records.append({
            "id": cat["id"],
            "festival_id": "oscar",
            "display_name": cat["display_name"],
            "historical_names": cat.get("historical_names", []),
            "first_year": cat["first_year"],
            "last_year": cat.get("last_year"),
            "tile_type": cat.get("tile_type"),
            "recipient_type": cat.get("recipient_type"),
            "merged_from": cat.get("merged_from"),
            "merged_into": cat.get("merged_into"),
        })

    # Award records
    awards = []
    for r in all_rows:
        award = {
            "id": r["id"],
            "ceremony_id": r["ceremony_id"],
            "category_id": r["category_id"],
            "year": r["year"],
            "result": r["result"],
            "recipients": r["recipients"],
            "film_tmdb_id": int(r["film_tmdb_id"]) if r.get("film_tmdb_id") else None,
            "film_title": r["film_title"],
            "subject_title": r.get("subject_title"),
            "film_release_year": int(r["film_release_year"]) if r.get("film_release_year") else None,
            "film_poster_path": r.get("film_poster_path"),
            "source_url": r["source_url"],
            "source_citation": r["source_citation"],
            "scraped_at": r["scraped_at"],
            "scrape_version": r["scrape_version"],
            "verified_status": r["verified_status"],
            "flags": r["flags"],
            "notes": r.get("notes"),
        }
        awards.append(award)

    # Find unique category IDs actually present in data
    cat_ids_in_data = set(r["category_id"] for r in all_rows)
    cat_count = len([c for c in cat_records if c["id"] in cat_ids_in_data])

    output = {
        "meta": {
            "version": "v1.2-preview-oscar-only",
            "generated_at": now,
            "row_count": len(awards),
            "festival_count": 1,
            "category_count": cat_count,
            "ceremony_count": len(ceremonies),
            "year_range": {"min": min(years), "max": max(years)},
            "preview_notes": (
                "Phase 1.5 preview build. Oscar only. TMDB IDs not yet resolved. "
                "Use this for UI development and schema validation; not for production."
            ),
        },
        "festivals": [festival],
        "ceremonies": ceremonies,
        "categories": cat_records,
        "awards": awards,
    }

    return output


# ---------------------------------------------------------------------------
# Build legacy-shaped JS
# ---------------------------------------------------------------------------

def build_legacy_js(all_rows, categories):
    """Build the legacy AWARDS_BROWSE_DATABASE_PREVIEW shape."""
    # Build category lookup
    cat_lookup = {c["id"]: c for c in categories}

    # Determine person-centric categories
    person_types = {"director", "actor", "actress", "cinematographer", "editor",
                    "composer", "casting_director"}

    # Group rows by (festival_key, display_name, year)
    # Use historical name for the display name
    data = {}  # festival -> category_display -> year -> {winner, nominees}

    for r in all_rows:
        cat = cat_lookup.get(r["category_id"])
        if not cat:
            continue

        festival_key = "Oscar"
        display_name = get_historical_name(cat, r["year"])
        year = r["year"]
        is_person = cat.get("recipient_type", "") in person_types

        # Build the M()-equivalent entry
        film_title = r["film_title"] or ""
        tmdb_id = 0  # Not resolved yet
        poster_path = None

        # For person categories, the "person" field is the recipient name
        person = None
        if is_person and r["recipients"]:
            person = r["recipients"][0].get("name", "")

        entry = {"title": film_title, "tmdb_id": tmdb_id, "poster_path": poster_path}
        if person:
            entry["person"] = person

        # Place into structure
        if festival_key not in data:
            data[festival_key] = {}
        if display_name not in data[festival_key]:
            data[festival_key][display_name] = {}
        if year not in data[festival_key][display_name]:
            data[festival_key][display_name][year] = {"winner": None, "nominees": []}

        year_data = data[festival_key][display_name][year]
        if r["result"] == "won":
            if year_data["winner"] is None:
                year_data["winner"] = entry
            else:
                # Co-winner: keep first as winner, add others to nominees with isWinner marker
                entry["co_winner"] = True
                year_data["nominees"].append(entry)
        else:
            year_data["nominees"].append(entry)

    return data


def write_legacy_js(data, path):
    """Write the legacy JS file."""
    # Sort categories and years for deterministic output
    sorted_data = {}
    for festival in sorted(data.keys()):
        sorted_data[festival] = {}
        for cat in sorted(data[festival].keys()):
            sorted_data[festival][cat] = {}
            for year in sorted(data[festival][cat].keys(), reverse=True):
                sorted_data[festival][cat][year] = data[festival][cat][year]

    json_str = json.dumps(sorted_data, indent=2, ensure_ascii=False)

    with open(path, "w", encoding="utf-8") as f:
        f.write("// ORBIT Awards Preview Data (v1.2 schema, Oscar only)\n")
        f.write("// Auto-generated — do not edit directly.\n\n")
        f.write("var AWARDS_BROWSE_DATABASE_PREVIEW = ")
        f.write(json_str)
        f.write(";\n\n")
        f.write("// Generated from data/awards-data-v1.2-preview.json\n")
        f.write("// by scripts/compile-preview.py\n")
        f.write("// Do not edit directly. Re-run compile to update.\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("ORBIT Awards Preview Compiler")
    print("=" * 60)

    # Load inputs
    print("\n[1] Loading inputs...")
    categories = load_categories()
    print(f"  Categories loaded: {len(categories)}")

    all_rows, csv_files = load_all_ceremony_csvs()
    print(f"  CSV files read: {len(csv_files)}")
    print(f"  Award rows loaded: {len(all_rows)}")

    if not all_rows:
        print("ERROR: No rows loaded.")
        return

    # Build v1.2 JSON
    print("\n[2] Building v1.2 JSON...")
    v12 = build_v12_json(all_rows, categories, csv_files)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(v12, f, indent=2, ensure_ascii=False)
    json_size = os.path.getsize(OUTPUT_JSON)
    print(f"  Written: {OUTPUT_JSON} ({json_size:,} bytes)")

    # Build legacy JS
    print("\n[3] Building legacy-shaped JS...")
    legacy_data = build_legacy_js(all_rows, categories)
    write_legacy_js(legacy_data, OUTPUT_LEGACY_JS)
    js_size = os.path.getsize(OUTPUT_LEGACY_JS)
    print(f"  Written: {OUTPUT_LEGACY_JS} ({js_size:,} bytes)")

    # Print meta
    print("\n[4] Meta summary:")
    meta = v12["meta"]
    for k, v in meta.items():
        print(f"  {k}: {v}")

    # Spot-check
    print("\n[5] Spot-checks:")
    # Find a Best Original Song winner to check subject_title
    song_winners = [r for r in v12["awards"]
                    if r["category_id"] == "oscar.best_original_song" and r["result"] == "won"]
    if song_winners:
        s = song_winners[-1]  # Most recent
        print(f"  Song winner ({s['year']}): film={s['film_title']}, subject={s.get('subject_title')}, "
              f"recipients={[r['name'] for r in s['recipients']]}")

    # Check legacy shape
    oscar_cats = list(legacy_data.get("Oscar", {}).keys())
    print(f"  Legacy categories under Oscar: {len(oscar_cats)}")
    if "Best Picture" in legacy_data.get("Oscar", {}):
        bp_years = sorted(legacy_data["Oscar"]["Best Picture"].keys(), reverse=True)
        latest = bp_years[0] if bp_years else None
        if latest:
            w = legacy_data["Oscar"]["Best Picture"][latest].get("winner")
            print(f"  Best Picture {latest} winner: {w['title'] if w else 'none'}")

    print(f"\n{'=' * 60}")
    print("[compile-preview] CSV files read:", len(csv_files))
    print("[compile-preview] Award rows compiled:", len(all_rows))
    print(f"[compile-preview] Categories: {meta['category_count']}")
    print(f"[compile-preview] Output:")
    print(f"  data/awards-data-v1.2-preview.json ({json_size:,} bytes)")
    print(f"  data/awards-data-v1.2-preview-legacy.js ({js_size:,} bytes)")
    print("[compile-preview] Ready for browser test:")
    print("  open pages/awards-browse.html?preview=true")


if __name__ == "__main__":
    main()
