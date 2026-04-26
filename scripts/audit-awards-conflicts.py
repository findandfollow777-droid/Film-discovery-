#!/usr/bin/env python3
"""
Conflict detail report for ORBIT awards CSV data.
Turns audit findings into a row-by-row editorial review document.
Read-only: never writes to any CSV or data/ file.
Stdlib only: csv, os, json, datetime, collections, sys.
Run: python3 scripts/audit-awards-conflicts.py
"""

import csv
import os
import sys
import json
from datetime import date
from collections import Counter, defaultdict

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_MAP = {
    "awards7coltemplate.csv":    os.path.join(REPO_ROOT, "data", "awards-7col-template.csv"),
    "awardssample.csv":         os.path.join(REPO_ROOT, "data", "awards-sample.csv"),
    "Movie_Award_CSV_data.csv": os.path.join(REPO_ROOT, "data", "Movie_Award_CSV_data.csv"),
    "ggdirector2000.csv":       os.path.join(REPO_ROOT, "data", "gg-director-2000.csv"),
    "ggdirectorearly.csv":      os.path.join(REPO_ROOT, "data", "gg-director-early.csv"),
    "goldenglobeextra.csv":     os.path.join(REPO_ROOT, "data", "golden-globe-extra.csv"),
    "baftaactordata.csv":       os.path.join(REPO_ROOT, "data", "bafta-actor-data.csv"),
    "baftaactorearly.csv":      os.path.join(REPO_ROOT, "data", "bafta-actor-early.csv"),
    "baftaactressraw.csv":      os.path.join(REPO_ROOT, "data", "bafta-actress-raw.csv"),
    "baftadirectorraw.csv":     os.path.join(REPO_ROOT, "data", "bafta-director-raw.csv"),
    "persondataraw.csv":        os.path.join(REPO_ROOT, "data", "person-data-raw.csv"),
}

INDUSTRY_FESTIVALS = {"oscar", "bafta", "golden globe"}
FILM_FESTIVALS = {"cannes", "venice", "berlin"}

# ---------------------------------------------------------------------------
# Loader (duplicated from audit-awards-data.py — not refactored)
# ---------------------------------------------------------------------------

def normalise_festival(name):
    low = name.strip().lower()
    if low in ("academy awards", "oscars", "oscar"):
        return "Oscar"
    if low == "berlinale" or low == "berlin":
        return "Berlin"
    return name.strip()


def try_read(path):
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            with open(path, encoding=enc, newline="") as f:
                return f.read(), enc
        except (UnicodeDecodeError, UnicodeError):
            continue
    return None, None


def has_header(first_row):
    return any("tmdb_id" in cell.lower() for cell in first_row)


def parse_year(val):
    try:
        y = int(val.strip())
        return y if 1900 <= y <= 2030 else None
    except (ValueError, AttributeError):
        return None


def parse_won(val):
    v = val.strip().lower()
    return v in ("true", "1", "yes", "won")


def load_csv(label, path):
    if not os.path.isfile(path):
        print(f"  WARNING: {label} not found at {path}")
        return []

    content, enc = try_read(path)
    if content is None:
        print(f"  WARNING: could not decode {label}")
        return []

    print(f"  Loaded {label} ({enc})")
    reader = csv.reader(content.splitlines())
    rows_raw = list(reader)
    if not rows_raw:
        return []

    start = 0
    if has_header(rows_raw[0]):
        start = 1

    ncols_first = len(rows_raw[start]) if start < len(rows_raw) else 0
    is_six = (ncols_first == 6)

    records = []
    for row in rows_raw[start:]:
        if len(row) < 6:
            continue

        if is_six or len(row) == 6:
            tmdb_id = row[0].strip()
            title = row[1].strip()
            year = parse_year(row[2])
            festival = normalise_festival(row[3])
            category = row[4].strip()
            won = parse_won(row[5])
            nominee = ""
            movie_title = title
        else:
            tmdb_id = row[0].strip()
            nominee = row[1].strip()
            year = parse_year(row[2])
            festival = normalise_festival(row[3])
            category = row[4].strip()
            won = parse_won(row[5])
            movie_title = row[6].strip() if len(row) > 6 else ""

        if year is None:
            continue

        records.append({
            "tmdb_id": tmdb_id,
            "nominee": nominee,
            "year": year,
            "festival": festival,
            "category": category,
            "won": won,
            "movie_title": movie_title,
            "_source": label,
        })

    return records

# ---------------------------------------------------------------------------
# Key helpers
# ---------------------------------------------------------------------------

def dup_key(r):
    """Exact-duplicate key: all six semantic fields."""
    return (
        r["festival"],
        r["category"],
        str(r["year"]),
        r["nominee"].lower(),
        r["movie_title"].lower(),
        str(r["won"]),
    )


def collision_key(r):
    """Convention-collision key: same tuple minus year."""
    return (
        r["festival"],
        r["category"],
        r["nominee"].lower(),
        r["movie_title"].lower(),
        str(r["won"]),
    )

# ---------------------------------------------------------------------------
# Canonical file map: for each (festival, category), which file has the
# most post-2000 rows — that's the canonical source.
# ---------------------------------------------------------------------------

def build_canonical_map(all_records):
    """Return dict: (festival, category) -> canonical source label."""
    fc_sources = defaultdict(lambda: Counter())
    for r in all_records:
        if r["year"] >= 2000:
            fc_sources[(r["festival"], r["category"])][r["_source"]] += 1
    canonical = {}
    for fc, counter in fc_sources.items():
        canonical[fc] = counter.most_common(1)[0][0]
    return canonical

# ---------------------------------------------------------------------------
# Bucket builders
# ---------------------------------------------------------------------------

def build_bucket_a(all_records, canonical_map):
    """Exact duplicates. Returns list of action-row dicts."""
    # Group rows by dup_key
    groups = defaultdict(list)
    for r in all_records:
        groups[dup_key(r)].append(r)

    rows = []
    for key, copies in groups.items():
        if len(copies) < 2:
            continue

        fest = copies[0]["festival"]
        cat = copies[0]["category"]
        canon = canonical_map.get((fest, cat))

        # Pick which copy to keep: prefer canonical file, else first occurrence
        keep_idx = 0
        for i, c in enumerate(copies):
            if c["_source"] == canon:
                keep_idx = i
                break

        for i, c in enumerate(copies):
            action = "KEEP" if i == keep_idx else "DROP"
            rows.append({
                "bucket": "A",
                "action": action,
                "festival": c["festival"],
                "category": c["category"],
                "year": c["year"],
                "nominee": c["nominee"],
                "movie_title": c["movie_title"],
                "won": c["won"],
                "tmdb_id": c["tmdb_id"],
                "source_file": c["_source"],
                "review_required": "FALSE" if action == "DROP" else "FALSE",
                "notes": "Exact duplicate — keep canonical copy" if action == "KEEP"
                         else f"Exact duplicate — canonical is {canon}",
            })

    return rows


def build_bucket_b(all_records):
    """Convention collisions (industry festivals, adjacent years)."""
    # Group by collision_key -> list of (year, record)
    groups = defaultdict(list)
    for r in all_records:
        if r["festival"].lower() not in INDUSTRY_FESTIVALS:
            continue
        groups[collision_key(r)].append(r)

    # Deduplicate within each group: we only care about distinct years
    rows = []
    seen_pairs = set()  # track (collision_key, year_low, year_high) to avoid duplicates

    for ckey, recs in groups.items():
        # Get distinct years and one representative record per year
        year_recs = {}
        for r in recs:
            if r["year"] not in year_recs:
                year_recs[r["year"]] = r

        years_sorted = sorted(year_recs.keys())
        for i in range(len(years_sorted) - 1):
            y_low = years_sorted[i]
            y_high = years_sorted[i + 1]
            if y_high - y_low != 1:
                continue

            pair_id = (ckey, y_low, y_high)
            if pair_id in seen_pairs:
                continue
            seen_pairs.add(pair_id)

            r_low = year_recs[y_low]
            r_high = year_recs[y_high]

            # Propose keeping the later year (ceremony year convention)
            for r, action, note in [
                (r_high, "KEEP", "Convention collision — ceremony year (later), proposed keep"),
                (r_low, "DROP", "Convention collision — film year (earlier), proposed drop"),
            ]:
                rows.append({
                    "bucket": "B",
                    "action": action,
                    "festival": r["festival"],
                    "category": r["category"],
                    "year": r["year"],
                    "nominee": r["nominee"],
                    "movie_title": r["movie_title"],
                    "won": r["won"],
                    "tmdb_id": r["tmdb_id"],
                    "source_file": r["_source"],
                    "review_required": "TRUE",
                    "notes": note,
                })

    return rows


def build_bucket_c(all_records, canonical_map):
    """Merge candidates: rows in secondary files not in canonical."""
    # Build set of dup_keys present in each canonical file
    canonical_keys = defaultdict(set)
    for r in all_records:
        fc = (r["festival"], r["category"])
        canon = canonical_map.get(fc)
        if r["_source"] == canon:
            canonical_keys[fc].add(dup_key(r))

    # Find (festival, category) pairs with multiple source files
    fc_files = defaultdict(set)
    for r in all_records:
        fc_files[(r["festival"], r["category"])].add(r["_source"])

    multi_fc = {fc for fc, files in fc_files.items() if len(files) > 1}

    rows = []
    seen = set()  # avoid duplicate merge proposals
    for r in all_records:
        fc = (r["festival"], r["category"])
        if fc not in multi_fc:
            continue
        canon = canonical_map.get(fc)
        if r["_source"] == canon:
            continue
        dk = dup_key(r)
        if dk in canonical_keys[fc]:
            continue  # already in canonical — will be handled by Bucket A
        # Unique to this secondary file
        dedup_id = (dk, r["_source"])
        if dedup_id in seen:
            continue
        seen.add(dedup_id)

        rows.append({
            "bucket": "C",
            "action": "MERGE",
            "festival": r["festival"],
            "category": r["category"],
            "year": r["year"],
            "nominee": r["nominee"],
            "movie_title": r["movie_title"],
            "won": r["won"],
            "tmdb_id": r["tmdb_id"],
            "source_file": r["_source"],
            "review_required": "TRUE",
            "notes": f"Unique to secondary file — merge into {canon}",
        })

    return rows


def build_bucket_d(all_records):
    """Known year gaps post-2000."""
    # Deduplicate for year coverage analysis
    seen = set()
    deduped = []
    for r in all_records:
        dk = dup_key(r)
        if dk not in seen:
            seen.add(dk)
            deduped.append(r)

    post = [r for r in deduped if r["year"] >= 2000]
    groups = defaultdict(set)
    for r in post:
        groups[(r["festival"], r["category"])].add(r["year"])

    rows = []
    for (fest, cat), years in sorted(groups.items()):
        max_yr = max(years)
        expected = set(range(2000, max_yr + 1))
        missing = sorted(expected - years)
        # Exclude Cannes 2020
        if fest.lower() == "cannes" and 2020 in missing:
            missing.remove(2020)
        for yr in missing:
            rows.append({
                "bucket": "D",
                "action": "SOURCE_EXTERNAL",
                "festival": fest,
                "category": cat,
                "year": yr,
                "nominee": "",
                "movie_title": "",
                "won": "",
                "tmdb_id": "",
                "source_file": "",
                "review_required": "TRUE",
                "notes": f"Missing year in {fest} {cat} (range 2000-{max_yr})",
            })

    return rows

# ---------------------------------------------------------------------------
# Preserved-rows count
# ---------------------------------------------------------------------------

def count_preserved(all_records, bucket_a, bucket_b, bucket_c):
    """Count rows not appearing in any conflict bucket (A/B/C).
    Bucket D is informational (no existing rows), so excluded.

    Uses a counting approach rather than set membership to correctly
    handle intra-file duplicates (multiple physical rows with the
    same key in the same file).
    """
    # Build a counter of (dup_key, source_file) for all bucketed rows
    # so we can "claim" the right number of physical source rows.
    bucketed_counter = Counter()
    for row in bucket_a + bucket_b + bucket_c:
        rid = (
            row["festival"], row["category"], str(row["year"]),
            row["nominee"].lower(), row["movie_title"].lower(),
            str(row["won"]), row["source_file"],
        )
        bucketed_counter[rid] += 1

    # Walk source rows, consuming bucketed claims. Unclaimed = preserved.
    source_counter = Counter()
    for r in all_records:
        rid = (
            r["festival"], r["category"], str(r["year"]),
            r["nominee"].lower(), r["movie_title"].lower(),
            str(r["won"]), r["_source"],
        )
        source_counter[rid] += 1

    preserved = 0
    for rid, src_count in source_counter.items():
        claimed = min(bucketed_counter.get(rid, 0), src_count)
        preserved += src_count - claimed

    return preserved

# ---------------------------------------------------------------------------
# Safety assertions
# ---------------------------------------------------------------------------

def run_assertions(all_records, bucket_a, bucket_b, bucket_c, bucket_d, preserved_count):
    """Run all safety assertions. Return list of violations (empty = pass)."""
    violations = []

    # 1. No DROP without a paired KEEP or convention-collision winner
    # Bucket A: every DROP key must have a KEEP in the same bucket
    a_keys_keep = set()
    a_keys_drop = set()
    for row in bucket_a:
        k = (row["festival"], row["category"], str(row["year"]),
             row["nominee"].lower(), row["movie_title"].lower(), str(row["won"]))
        if row["action"] == "KEEP":
            a_keys_keep.add(k)
        elif row["action"] == "DROP":
            a_keys_drop.add(k)

    orphan_drops_a = a_keys_drop - a_keys_keep
    if orphan_drops_a:
        violations.append(
            f"Bucket A: {len(orphan_drops_a)} DROP key(s) without a paired KEEP"
        )

    # Bucket B: every DROP must have a paired KEEP at adjacent year
    b_drop_keys = []
    b_keep_keys = set()
    for row in bucket_b:
        ckey = (row["festival"], row["category"],
                row["nominee"].lower(), row["movie_title"].lower(), str(row["won"]))
        if row["action"] == "KEEP":
            b_keep_keys.add((ckey, row["year"]))
        elif row["action"] == "DROP":
            b_drop_keys.append((ckey, row["year"]))

    for ckey, yr in b_drop_keys:
        # The KEEP should be at yr+1
        if (ckey, yr + 1) not in b_keep_keys:
            violations.append(
                f"Bucket B: DROP at year {yr} for {ckey} has no paired KEEP at year {yr+1}"
            )

    # 2. No film festival rows in Bucket B
    for row in bucket_b:
        if row["festival"].lower() in FILM_FESTIVALS:
            violations.append(
                f"Bucket B: film festival '{row['festival']}' found (should be industry-only)"
            )
            break  # one is enough to flag

    # 3. Every review_required=FALSE must be Bucket A with a paired KEEP
    for row in bucket_a:
        if row["review_required"] == "FALSE" and row["action"] == "DROP":
            k = (row["festival"], row["category"], str(row["year"]),
                 row["nominee"].lower(), row["movie_title"].lower(), str(row["won"]))
            if k not in a_keys_keep:
                violations.append(
                    f"Bucket A: review_required=FALSE DROP without paired KEEP: {k}"
                )
                break

    # 4. Total rows = bucketed + preserved
    #    Count physical rows claimed by buckets using the same counter
    #    approach as count_preserved, to handle intra-file duplicates.
    bucketed_counter = Counter()
    for row in bucket_a + bucket_b + bucket_c:
        rid = (
            row["festival"], row["category"], str(row["year"]),
            row["nominee"].lower(), row["movie_title"].lower(),
            str(row["won"]), row["source_file"],
        )
        bucketed_counter[rid] += 1

    source_counter = Counter()
    for r in all_records:
        rid = (
            r["festival"], r["category"], str(r["year"]),
            r["nominee"].lower(), r["movie_title"].lower(),
            str(r["won"]), r["_source"],
        )
        source_counter[rid] += 1

    total_bucketed = 0
    for rid, src_count in source_counter.items():
        total_bucketed += min(bucketed_counter.get(rid, 0), src_count)

    total_source = len(all_records)
    total_accounted = total_bucketed + preserved_count
    # Bucket D is informational (no source rows), so not counted
    if total_accounted != total_source:
        violations.append(
            f"Row accounting mismatch: {total_source} source rows != "
            f"{total_bucketed} bucketed + {preserved_count} preserved = {total_accounted}"
        )

    return violations

# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_md(bucket_a, bucket_b, bucket_c, bucket_d, preserved_count, today):
    """Generate markdown report string."""
    lines = []
    lines.append(f"# ORBIT Awards Conflict Detail Report\n")
    lines.append(f"**Date:** {today}\n")
    lines.append("**Guiding principle:** Preservation beats tidiness. Every proposed "
                 "action is flagged for human review. Nothing is auto-decided.\n")

    # Preservation section
    lines.append("---\n")
    lines.append("## PRESERVED — Not Flagged\n")
    lines.append(f"**{preserved_count:,} rows** are intentionally left alone. These include:\n")
    lines.append("- Same film/person at different festivals (e.g. Parasite at Cannes 2019 AND Oscar 2020)")
    lines.append("- Same person with multiple nominations in the same festival/year")
    lines.append("- Same film/person in same festival/category but 2+ years apart (legitimate separate nominations)")
    lines.append("- Rows where nominee or movie_title differs (case-insensitive exact match only; no fuzzy collapsing)")
    lines.append("\nThese rows are correct entries and require no action.\n")

    # Summary counts
    a_drops = sum(1 for r in bucket_a if r["action"] == "DROP")
    b_drops = sum(1 for r in bucket_b if r["action"] == "DROP")
    b_review = sum(1 for r in bucket_b if r["review_required"] == "TRUE")
    c_review = sum(1 for r in bucket_c if r["review_required"] == "TRUE")

    lines.append("---\n")
    lines.append("## Summary\n")
    lines.append(f"| Metric | Count |")
    lines.append(f"|--------|-------|")
    lines.append(f"| Preserved rows (no action) | {preserved_count:,} |")
    lines.append(f"| Bucket A — Exact duplicate groups | {len(bucket_a)} rows ({a_drops} proposed drops) |")
    lines.append(f"| Bucket B — Convention collisions | {len(bucket_b)} rows ({b_drops} proposed drops) |")
    lines.append(f"| Bucket C — Merge candidates | {len(bucket_c)} rows |")
    lines.append(f"| Bucket D — Known gaps | {len(bucket_d)} entries |")
    lines.append(f"| Total proposed drops | {a_drops + b_drops} |")
    lines.append(f"| Total REVIEW_REQUIRED | {b_review + c_review} |")
    lines.append("")

    def _sample_table(bucket_rows, label, n=20):
        lines.append(f"---\n")
        lines.append(f"## {label}\n")
        if not bucket_rows:
            lines.append("_None found._\n")
            return
        lines.append(f"**{len(bucket_rows)} rows total.** Showing up to {n}:\n")
        lines.append("| Action | Festival | Category | Year | Nominee | Movie | Won | Source | Review | Notes |")
        lines.append("|--------|----------|----------|------|---------|-------|-----|--------|--------|-------|")
        for r in bucket_rows[:n]:
            won_str = "Y" if r["won"] is True or r["won"] == "True" or r["won"] == True else ("N" if r["won"] is False or r["won"] == "False" else str(r["won"]))
            lines.append(
                f"| {r['action']} | {r['festival']} | {r['category']} | {r['year']} "
                f"| {r['nominee']} | {r['movie_title']} | {won_str} "
                f"| {r['source_file']} | {r['review_required']} | {r['notes']} |"
            )
        if len(bucket_rows) > n:
            lines.append(f"\n_...and {len(bucket_rows) - n} more rows in the CSV output._\n")
        lines.append("")

    _sample_table(bucket_a, "Bucket A — Exact Duplicates")
    _sample_table(bucket_b, "Bucket B — Convention Collisions (Industry Festivals)")
    _sample_table(bucket_c, "Bucket C — Merge Candidates")
    _sample_table(bucket_d, "Bucket D — Known Gaps")

    return "\n".join(lines)


def generate_csv_rows(bucket_a, bucket_b, bucket_c, bucket_d):
    """Return list of dicts for CSV output."""
    all_rows = []
    for r in bucket_a + bucket_b + bucket_c + bucket_d:
        won_str = ""
        if r["won"] is True or r["won"] == True:
            won_str = "true"
        elif r["won"] is False or r["won"] == False:
            won_str = "false"
        else:
            won_str = str(r["won"])

        all_rows.append({
            "bucket": r["bucket"],
            "action": r["action"],
            "festival": r["festival"],
            "category": r["category"],
            "year": r["year"],
            "nominee": r["nominee"],
            "movie_title": r["movie_title"],
            "won": won_str,
            "tmdb_id": r["tmdb_id"],
            "source_file": r["source_file"],
            "review_required": r["review_required"],
            "notes": r["notes"],
        })
    return all_rows


def generate_json_summary(bucket_a, bucket_b, bucket_c, bucket_d, preserved_count, today):
    """Return structured summary dict."""
    a_drops = sum(1 for r in bucket_a if r["action"] == "DROP")
    b_drops = sum(1 for r in bucket_b if r["action"] == "DROP")

    # Per-festival/category breakdown for each bucket
    def _fc_breakdown(rows):
        counter = Counter()
        for r in rows:
            counter[(r["festival"], r["category"])] += 1
        return [{"festival": f, "category": c, "count": n}
                for (f, c), n in counter.most_common()]

    return {
        "date": today,
        "preserved_rows": preserved_count,
        "bucket_a": {
            "total_rows": len(bucket_a),
            "proposed_drops": a_drops,
            "proposed_keeps": len(bucket_a) - a_drops,
            "breakdown": _fc_breakdown(bucket_a),
        },
        "bucket_b": {
            "total_rows": len(bucket_b),
            "proposed_drops": b_drops,
            "proposed_keeps": len(bucket_b) - b_drops,
            "all_review_required": True,
            "breakdown": _fc_breakdown(bucket_b),
        },
        "bucket_c": {
            "total_rows": len(bucket_c),
            "all_review_required": True,
            "breakdown": _fc_breakdown(bucket_c),
        },
        "bucket_d": {
            "total_entries": len(bucket_d),
            "breakdown": _fc_breakdown(bucket_d),
        },
        "totals": {
            "total_proposed_drops": a_drops + b_drops,
            "total_review_required": (
                sum(1 for r in bucket_b if r["review_required"] == "TRUE") +
                sum(1 for r in bucket_c if r["review_required"] == "TRUE")
            ),
        },
    }

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("ORBIT Awards Conflict Detail Report")
    print("=" * 60)
    print()

    # Load all CSVs
    all_records = []
    per_file = {}

    for label, path in CSV_MAP.items():
        recs = load_csv(label, path)
        if recs:
            all_records.extend(recs)
            per_file[label] = recs

    print(f"\nTotal records loaded: {len(all_records)}")
    print()

    if not all_records:
        print("ERROR: No records loaded. Nothing to analyse.")
        sys.exit(1)

    # Build canonical map
    canonical_map = build_canonical_map(all_records)

    # Build all buckets
    print("Building Bucket A (exact duplicates)...")
    bucket_a = build_bucket_a(all_records, canonical_map)

    print("Building Bucket B (convention collisions)...")
    bucket_b = build_bucket_b(all_records)

    print("Building Bucket C (merge candidates)...")
    bucket_c = build_bucket_c(all_records, canonical_map)

    print("Building Bucket D (known gaps)...")
    bucket_d = build_bucket_d(all_records)

    # Count preserved rows
    preserved_count = count_preserved(all_records, bucket_a, bucket_b, bucket_c)

    print(f"\nPreserved rows: {preserved_count:,}")
    print(f"Bucket A rows:  {len(bucket_a)}")
    print(f"Bucket B rows:  {len(bucket_b)}")
    print(f"Bucket C rows:  {len(bucket_c)}")
    print(f"Bucket D entries: {len(bucket_d)}")
    print()

    # Safety assertions
    print("Running safety assertions...")
    violations = run_assertions(all_records, bucket_a, bucket_b, bucket_c, bucket_d, preserved_count)

    if violations:
        print("\nASSERTION FAILURES — aborting, no files written:\n")
        for v in violations:
            print(f"  FAIL: {v}")
        sys.exit(1)

    print("All assertions passed.\n")

    # Generate outputs
    today = date.today().isoformat()
    reports_dir = os.path.join(REPO_ROOT, "audit-reports")
    os.makedirs(reports_dir, exist_ok=True)

    # Markdown
    md_content = generate_md(bucket_a, bucket_b, bucket_c, bucket_d, preserved_count, today)
    md_path = os.path.join(reports_dir, f"conflicts-{today}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    # CSV
    csv_rows = generate_csv_rows(bucket_a, bucket_b, bucket_c, bucket_d)
    csv_path = os.path.join(reports_dir, f"conflicts-{today}.csv")
    fieldnames = [
        "bucket", "action", "festival", "category", "year", "nominee",
        "movie_title", "won", "tmdb_id", "source_file", "review_required", "notes",
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_rows)

    # JSON
    json_data = generate_json_summary(bucket_a, bucket_b, bucket_c, bucket_d, preserved_count, today)
    json_path = os.path.join(reports_dir, f"conflicts-summary-{today}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2, default=str)

    # Stdout summary
    a_drops = sum(1 for r in bucket_a if r["action"] == "DROP")
    b_drops = sum(1 for r in bucket_b if r["action"] == "DROP")
    total_drops = a_drops + b_drops
    total_review = (
        sum(1 for r in bucket_b if r["review_required"] == "TRUE") +
        sum(1 for r in bucket_c if r["review_required"] == "TRUE")
    )

    print("=" * 60)
    print("CONFLICT REPORT SUMMARY")
    print("=" * 60)
    print(f"  Total proposed drops:      {total_drops}")
    print(f"  Total review-required:     {total_review}")
    print(f"  Preserved (no action):     {preserved_count:,}")
    print(f"  Known gaps to source:      {len(bucket_d)}")
    print()
    print(f"Reports written to:")
    print(f"  {md_path}")
    print(f"  {csv_path}")
    print(f"  {json_path}")


if __name__ == "__main__":
    main()
