#!/usr/bin/env python3
"""
ORBIT Awards v1 Canonical Compiler

Reads the scraped CSVs for all 6 festivals and produces:
  1. data/awards-data-v1.json        — canonical v1 JSON (schema v1.3)
  2. data/awards-data-v1-legacy.js   — legacy-shaped JS for awards-browse UI
                                       (AWARDS_BROWSE_DATABASE_V1 + PERSON_AWARD_LOOKUP_V1)

Sibling to compile-preview.py — does NOT modify it or the v1.2 preview outputs.

Run: python3 scripts/compile-v1.py
"""

import csv
import glob
import json
import os
import re
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped")
OUTPUT_JSON = os.path.join(REPO_ROOT, "data", "awards-data-v1.json")
OUTPUT_LEGACY_JS = os.path.join(REPO_ROOT, "data", "awards-data-v1-legacy.js")

# ---------------------------------------------------------------------------
# Static config
# ---------------------------------------------------------------------------

FESTIVALS = [
    {"id": "oscar",  "display_name": "Academy Awards (Oscars)",           "short_name": "Oscar",        "country": "United States",  "first_year": 1929},
    {"id": "bafta",  "display_name": "British Academy Film Awards",       "short_name": "BAFTA",        "country": "United Kingdom", "first_year": 1948},
    {"id": "gg",     "display_name": "Golden Globe Awards",               "short_name": "Golden Globe", "country": "United States",  "first_year": 1944},
    {"id": "cannes", "display_name": "Festival de Cannes",                "short_name": "Cannes",       "country": "France",         "first_year": 1946},
    {"id": "venice", "display_name": "Venice International Film Festival","short_name": "Venice",       "country": "Italy",          "first_year": 1932},
    {"id": "berlin", "display_name": "Berlin International Film Festival","short_name": "Berlin",       "country": "Germany",        "first_year": 1951},
]

GROUP_A = {"oscar", "bafta", "gg"}      # ceremony-numbered, with nominees
GROUP_B = {"cannes", "venice", "berlin"} # year-keyed, winners only

LEGACY_FESTIVAL_KEYS = {
    "oscar":  "Oscar",
    "bafta":  "BAFTA",
    "gg":     "GoldenGlobe",
    "cannes": "Cannes",
    "venice": "Venice",
    "berlin": "Berlin",
}

# Categories rendered as person tiles (tracks compile-preview.py:173-174)
PERSON_TYPES = {"director", "actor", "actress", "cinematographer", "editor",
                "composer", "casting_director"}

# Award-name allowlist for film_title-equals-category data-quality flag.
# Compared after lowercasing and normalising curly apostrophes to ASCII.
AWARD_NAME_ALLOWLIST = {
    "palme d'or", "golden lion", "golden bear", "grand prix",
    "jury prize", "silver lion", "silver bear", "golden globe",
}

# Pre-seeded notes for known data issues (referenced by row id).
KNOWN_ISSUE_NOTES = {
    # Documented in Phase 2 investigation (2026-05-06):
    # film_title is the award name, not the actual winning film.
    # Correct winner: "Dancer in the Dark" (Lars von Trier, 2000).
    "cannes.palme_dor.2000": "Documented winner: Dancer in the Dark (Lars von Trier).",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text):
    """v1.3 schema 3.2: lowercase, non-alphanumeric -> _, collapse, strip."""
    if not text:
        return ""
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s)
    return s.strip("_")


def normalise_apostrophes(text):
    """Map curly U+2019 / U+2018 / U+02BC to ASCII apostrophe."""
    if not text:
        return text
    return text.replace("’", "'").replace("‘", "'").replace("ʼ", "'")


def isofmt_now_utc():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def load_categories(fest_id):
    path = os.path.join(REPO_ROOT, "scripts", f"scrape-{fest_id}-categories.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def get_historical_name(cat, year):
    """Display name active in a given year (compile-preview.py:55-60)."""
    for hn in cat.get("historical_names", []):
        if year >= hn["from"] and (hn["to"] is None or year <= hn["to"]):
            return hn["name"]
    return cat["display_name"]


def parse_csv_row_common(r):
    """Shared post-parse for both groups: decode JSON columns, cast year, normalise blanks."""
    r["recipients"] = json.loads(r.get("recipients_json") or "[]")
    r["year"] = int(r["year"])
    for key in ("film_tmdb_id", "film_release_year", "film_poster_path",
                "subject_title", "notes"):
        if r.get(key) == "":
            r[key] = None


# ---------------------------------------------------------------------------
# Loaders — Group A (Oscar / BAFTA / GG)
# ---------------------------------------------------------------------------

CER_NUM_RE = re.compile(r"-ceremony-(\d+)\.csv$")


def load_group_a(fest_id):
    """Returns (rows, ceremony_meta) where ceremony_meta is dict {year: ceremony_number}."""
    pattern = os.path.join(SCRAPED_DIR, fest_id, f"{fest_id}-ceremony-*.csv")
    files = sorted(glob.glob(pattern))
    rows, cer_num_by_year = [], {}
    for path in files:
        m = CER_NUM_RE.search(path)
        cer_num = int(m.group(1)) if m else None
        with open(path, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                parse_csv_row_common(r)
                r["flags"] = json.loads(r.get("flags_json") or "[]")
                if cer_num is not None:
                    cer_num_by_year.setdefault(r["year"], cer_num)
                rows.append(r)
    return rows, cer_num_by_year, len(files)


# ---------------------------------------------------------------------------
# Loaders — Group B (Cannes / Venice / Berlin)
# ---------------------------------------------------------------------------

YEAR_FILENAME_RE = re.compile(r"-(\d{4})\.csv$")


def load_group_b(fest_id):
    """Synthesises missing Group A fields and returns rows."""
    pattern = os.path.join(SCRAPED_DIR, fest_id, f"{fest_id}-*.csv")
    files = sorted(glob.glob(pattern))
    rows = []
    for path in files:
        with open(path, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                parse_csv_row_common(r)
                # Synthesise the fields Group A has but Group B lacks
                first_name = r["recipients"][0].get("name") if r["recipients"] else (r.get("film_title") or "unknown")
                trailing = slugify(first_name) or "unknown"
                r["id"] = f'{r["category_id"]}.{r["year"]}.{trailing}_unresolved'
                r["ceremony_id"] = f'{fest_id}.{r["year"]}'
                r["subject_title"] = None
                r["film_release_year"] = None
                r["film_poster_path"] = None
                r["source_url"] = None
                r["source_citation"] = None
                r["scrape_version"] = None
                r["flags"] = []
                # Convert co_winner string to bool
                cw = (r.get("co_winner") or "").strip().lower()
                r["co_winner_bool"] = (cw == "true")
                rows.append(r)
    return rows, len(files)


# ---------------------------------------------------------------------------
# Data quality
# ---------------------------------------------------------------------------

def check_film_title_equals_award(r, fest_id, known_issues):
    """If film_title matches a known award name, flag the row + record the issue."""
    ft = (r.get("film_title") or "").strip()
    if not ft:
        return
    norm = normalise_apostrophes(ft).lower()
    if norm not in AWARD_NAME_ALLOWLIST:
        return
    if "film_title_equals_category" not in r["flags"]:
        r["flags"] = list(r["flags"]) + ["film_title_equals_category"]
    issue_key = f'{r["category_id"]}.{r["year"]}'
    known_issues.append({
        "row_id": r["id"],
        "festival_id": fest_id,
        "category_id": r["category_id"],
        "year": r["year"],
        "issue": "film_title_equals_category",
        "film_title": r["film_title"],
        "note": KNOWN_ISSUE_NOTES.get(issue_key, ""),
    })


# ---------------------------------------------------------------------------
# v1 JSON build
# ---------------------------------------------------------------------------

def build_v1_json(all_rows_by_fest, cer_meta_by_fest, file_counts):
    awards = []
    ceremonies = []
    categories_out = []
    known_issues = []
    festival_records = []
    cat_ids_in_data = set()

    for f in FESTIVALS:
        fest_id = f["id"]
        festival_records.append({
            "id": fest_id,
            "display_name": f["display_name"],
            "short_name": f["short_name"],
            "country": f["country"],
            "first_year": f["first_year"],
        })

        # Categories
        cats = load_categories(fest_id)
        for c in cats:
            categories_out.append({
                "id": c["id"],
                "festival_id": fest_id,
                "display_name": c["display_name"],
                "historical_names": c.get("historical_names", []),
                "first_year": c["first_year"],
                "last_year": c.get("last_year"),
                "tile_type": c.get("tile_type"),
                "recipient_type": c.get("recipient_type"),
                "merged_from": c.get("merged_from"),
                "merged_into": c.get("merged_into"),
            })

        # Ceremonies (one per distinct year)
        rows = all_rows_by_fest[fest_id]
        cer_num_by_year = cer_meta_by_fest.get(fest_id, {})
        years_in_fest = sorted(set(r["year"] for r in rows))
        for yr in years_in_fest:
            ceremonies.append({
                "id": f"{fest_id}.{yr}",
                "festival_id": fest_id,
                "ceremony_number": cer_num_by_year.get(yr),  # None for Group B
                "year": yr,
                "date": None,
                "venue": None,
            })

        # Awards
        for r in rows:
            check_film_title_equals_award(r, fest_id, known_issues)
            cat_ids_in_data.add(r["category_id"])
            award = {
                "id": r["id"],
                "ceremony_id": r["ceremony_id"],
                "category_id": r["category_id"],
                "year": r["year"],
                "result": r["result"],
                "recipients": r["recipients"],
                "film_tmdb_id": int(r["film_tmdb_id"]) if r.get("film_tmdb_id") else None,
                "film_title": r.get("film_title") or None,
                "subject_title": r.get("subject_title"),
                "film_release_year": int(r["film_release_year"]) if r.get("film_release_year") else None,
                "film_poster_path": r.get("film_poster_path"),
                "source_url": r.get("source_url"),
                "source_citation": r.get("source_citation"),
                "scraped_at": r.get("scraped_at"),
                "scrape_version": r.get("scrape_version"),
                "verified_status": r.get("verified_status"),
                "flags": r["flags"],
                "notes": r.get("notes"),
            }
            awards.append(award)

    all_years = [a["year"] for a in awards]
    resolved_count = sum(1 for a in awards if a.get("film_tmdb_id"))
    total_count = len(awards)
    resolution_pct = round(resolved_count / total_count * 100, 1) if total_count else 0
    tmdb_resolution_status = "resolved" if resolution_pct >= 99 else f"partial_{resolution_pct}pct"
    meta = {
        "version": "1.0.0",
        "schema_version": "v1.3",
        "generated_at": isofmt_now_utc(),
        "row_count": len(awards),
        "festival_count": len(festival_records),
        "category_count": len([c for c in categories_out if c["id"] in cat_ids_in_data]),
        "ceremony_count": len(ceremonies),
        "year_range": {"min": min(all_years), "max": max(all_years)},
        "tmdb_resolution_status": tmdb_resolution_status,
        "known_issues": known_issues,
        "csv_files_read": file_counts,
    }

    return {
        "meta": meta,
        "festivals": festival_records,
        "ceremonies": ceremonies,
        "categories": categories_out,
        "awards": awards,
    }


# ---------------------------------------------------------------------------
# Legacy JS build
# ---------------------------------------------------------------------------

def build_legacy_database(all_rows_by_fest):
    """Build AWARDS_BROWSE_DATABASE_V1 in the legacy nested-dict shape."""
    data = {}  # legacy_fest_key -> display_name -> year -> {winner, nominees}

    for fest in FESTIVALS:
        fest_id = fest["id"]
        legacy_key = LEGACY_FESTIVAL_KEYS[fest_id]
        cats = {c["id"]: c for c in load_categories(fest_id)}

        # Sort rows for deterministic co-winner ordering:
        # within (category_id, year), put won rows first, then nominated.
        rows = sorted(
            all_rows_by_fest[fest_id],
            key=lambda r: (r["category_id"], r["year"], 0 if r["result"] == "won" else 1)
        )

        for r in rows:
            cat = cats.get(r["category_id"])
            if not cat:
                continue
            display_name = get_historical_name(cat, r["year"])
            year = r["year"]
            is_person = cat.get("recipient_type", "") in PERSON_TYPES

            entry = {
                "title": r.get("film_title") or "",
                "tmdb_id": 0,           # unresolved
                "poster_path": None,    # unresolved
            }
            if is_person and r["recipients"]:
                entry["person"] = r["recipients"][0].get("name", "")

            data.setdefault(legacy_key, {}) \
                .setdefault(display_name, {}) \
                .setdefault(year, {"winner": None, "nominees": []})

            year_data = data[legacy_key][display_name][year]

            if r["result"] == "won":
                if year_data["winner"] is None:
                    year_data["winner"] = entry
                else:
                    co_entry = dict(entry)
                    co_entry["co_winner"] = True
                    year_data["nominees"].append(co_entry)
            else:
                year_data["nominees"].append(entry)

    return data


def build_person_award_lookup(all_rows_by_fest):
    """Build PERSON_AWARD_LOOKUP_V1 keyed by '{LegacyKey}|{DisplayName}|{year}|{movie_title.lower()}'.

    Only person-typed categories are included. person_id is null until TMDB resolution.
    """
    lookup = {}
    for fest in FESTIVALS:
        fest_id = fest["id"]
        legacy_key = LEGACY_FESTIVAL_KEYS[fest_id]
        cats = {c["id"]: c for c in load_categories(fest_id)}
        for r in all_rows_by_fest[fest_id]:
            cat = cats.get(r["category_id"])
            if not cat:
                continue
            if cat.get("recipient_type") not in PERSON_TYPES:
                continue
            if not r["recipients"]:
                continue
            recipient = r["recipients"][0]
            name = recipient.get("name") or ""
            if not name:
                continue
            display_name = get_historical_name(cat, r["year"])
            movie_title = (r.get("film_title") or "").strip().lower()
            if not movie_title:
                continue
            key = f"{legacy_key}|{display_name}|{r['year']}|{movie_title}"
            pid = recipient.get("tmdb_person_id")
            try:
                pid_int = int(pid) if pid not in (None, "", 0, "0") else None
            except (TypeError, ValueError):
                pid_int = None
            lookup[key] = {"person_name": name, "person_id": pid_int}
    return lookup


def write_legacy_js(database, person_lookup, path):
    sorted_db = {}
    for fest in sorted(database.keys()):
        sorted_db[fest] = {}
        for cat in sorted(database[fest].keys()):
            sorted_db[fest][cat] = {}
            for yr in sorted(database[fest][cat].keys(), reverse=True):
                sorted_db[fest][cat][str(yr)] = database[fest][cat][yr]

    sorted_lookup = dict(sorted(person_lookup.items()))

    db_json = json.dumps(sorted_db, indent=2, ensure_ascii=False)
    pl_json = json.dumps(sorted_lookup, indent=2, ensure_ascii=False)

    with open(path, "w", encoding="utf-8") as f:
        f.write("// ORBIT Awards v1 Canonical Data (schema v1.3, all 6 festivals)\n")
        f.write("// Auto-generated by scripts/compile-v1.py — do not edit directly.\n")
        f.write("// TMDB IDs unresolved (tmdb_id: 0, person_id: null).\n\n")
        f.write("var AWARDS_BROWSE_DATABASE_V1 = ")
        f.write(db_json)
        f.write(";\n\n")
        f.write("var PERSON_AWARD_LOOKUP_V1 = ")
        f.write(pl_json)
        f.write(";\n\n")
        f.write("if (typeof window !== 'undefined') {\n")
        f.write("  window.AWARDS_BROWSE_DATABASE_V1 = AWARDS_BROWSE_DATABASE_V1;\n")
        f.write("  window.PERSON_AWARD_LOOKUP_V1 = PERSON_AWARD_LOOKUP_V1;\n")
        f.write("}\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("ORBIT Awards v1 Compiler")
    print("=" * 60)

    all_rows_by_fest = {}
    cer_meta_by_fest = {}
    file_counts = {}
    per_fest_counts = {}

    print("\n[1] Loading inputs ...")
    for f in FESTIVALS:
        fid = f["id"]
        if fid in GROUP_A:
            rows, cer_meta, n_files = load_group_a(fid)
            cer_meta_by_fest[fid] = cer_meta
        else:
            rows, n_files = load_group_b(fid)
        all_rows_by_fest[fid] = rows
        file_counts[fid] = n_files
        per_fest_counts[fid] = len(rows)
        print(f"  {fid}: {n_files} files, {len(rows)} rows")

    print("\n[2] Building v1 JSON ...")
    v1 = build_v1_json(all_rows_by_fest, cer_meta_by_fest, file_counts)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(v1, f, indent=2, ensure_ascii=False)
    json_size = os.path.getsize(OUTPUT_JSON)
    print(f"  Written: {OUTPUT_JSON} ({json_size:,} bytes)")

    print("\n[3] Building legacy JS ...")
    legacy_db = build_legacy_database(all_rows_by_fest)
    person_lookup = build_person_award_lookup(all_rows_by_fest)
    write_legacy_js(legacy_db, person_lookup, OUTPUT_LEGACY_JS)
    js_size = os.path.getsize(OUTPUT_LEGACY_JS)
    print(f"  Written: {OUTPUT_LEGACY_JS} ({js_size:,} bytes)")
    print(f"  AWARDS_BROWSE_DATABASE_V1 festivals: {sorted(legacy_db.keys())}")
    print(f"  PERSON_AWARD_LOOKUP_V1 entries: {len(person_lookup)}")

    print("\n[4] Meta summary:")
    for k in ("version", "schema_version", "generated_at", "row_count",
              "festival_count", "category_count", "ceremony_count",
              "year_range", "tmdb_resolution_status"):
        print(f"  {k}: {v1['meta'][k]}")
    print(f"  known_issues: {len(v1['meta']['known_issues'])} flagged")

    print("\n[5] Per-festival breakdown:")
    for fid, n in per_fest_counts.items():
        print(f"  {fid}: {n} rows")

    print("\n[6] Known issues (first 10):")
    for issue in v1["meta"]["known_issues"][:10]:
        print(f"  - [{issue['row_id']}] {issue['issue']}: film_title={issue['film_title']!r}"
              + (f" — {issue['note']}" if issue["note"] else ""))

    print("\n" + "=" * 60)
    print("[compile-v1] done.")


if __name__ == "__main__":
    main()
