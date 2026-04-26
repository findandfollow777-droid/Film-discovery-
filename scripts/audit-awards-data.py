#!/usr/bin/env python3
"""
Audit script for ORBIT awards CSV data.
Read-only: never writes to any CSV or data/ file.
Stdlib only: csv, os, json, datetime, collections, sys.
Run: python3 scripts/audit-awards-data.py
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

# Map requested names -> actual paths (kebab-case in data/)
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

SEVEN_COL_HEADER = ["tmdb_id", "nominee", "year", "festival", "category", "won", "movie_title"]
SIX_COL_HEADER = ["tmdb_id", "title", "year", "festival", "category", "won"]

INDUSTRY_FESTIVALS = {"oscar", "bafta", "golden globe"}
FILM_FESTIVALS = {"cannes", "venice", "berlin"}

PERSON_KEYWORDS = {"actor", "actress", "director", "screenplay", "song", "score"}

# ---------------------------------------------------------------------------
# Festival normalisation
# ---------------------------------------------------------------------------

def normalise_festival(name):
    low = name.strip().lower()
    if low in ("academy awards", "oscars", "oscar"):
        return "Oscar"
    if low == "berlinale" or low == "berlin":
        return "Berlin"
    # Title-case the original for consistency
    return name.strip()

# ---------------------------------------------------------------------------
# File loading
# ---------------------------------------------------------------------------

def try_read(path):
    """Read file content trying UTF-8, cp1252, latin-1."""
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            with open(path, encoding=enc, newline="") as f:
                return f.read(), enc
        except (UnicodeDecodeError, UnicodeError):
            continue
    return None, None


def has_header(first_row):
    """Detect header by checking if any cell contains 'tmdb_id'."""
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
    """Load a single CSV, return list of dicts with keys:
    tmdb_id, nominee, year, festival, category, won, movie_title, _source
    """
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

    # Detect header
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
            # 6-col: tmdb_id, title, year, festival, category, won
            tmdb_id = row[0].strip()
            title = row[1].strip()
            year = parse_year(row[2])
            festival = normalise_festival(row[3])
            category = row[4].strip()
            won = parse_won(row[5])
            nominee = ""
            movie_title = title
        else:
            # 7-col: tmdb_id, nominee, year, festival, category, won, movie_title
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
# Audit sections
# ---------------------------------------------------------------------------

def section_a(all_records, per_file):
    """Per-file breakdown."""
    lines = ["## A. Per-File Breakdown\n"]
    lines.append(f"| File | Rows | Pre-2000 | Post-2000 | Distinct Festivals |")
    lines.append(f"|------|------|----------|-----------|-------------------|")
    summary = {}
    for label, recs in per_file.items():
        pre = sum(1 for r in recs if r["year"] < 2000)
        post = sum(1 for r in recs if r["year"] >= 2000)
        fests = len(set(r["festival"] for r in recs))
        lines.append(f"| {label} | {len(recs)} | {pre} | {post} | {fests} |")
        summary[label] = {"rows": len(recs), "pre_2000": pre, "post_2000": post, "distinct_festivals": fests}
    total = len(all_records)
    lines.append(f"\n**Total rows across all files: {total}**\n")
    return "\n".join(lines), summary


def _dup_key(r):
    return (
        r["festival"],
        r["category"],
        str(r["year"]),
        r["nominee"].lower(),
        r["movie_title"].lower(),
        str(r["won"]),
    )


def section_b(all_records, per_file):
    """True duplicates."""
    lines = ["## B. True Duplicates\n"]

    # Build (key -> list of source labels)
    key_sources = defaultdict(list)
    for r in all_records:
        key_sources[_dup_key(r)].append(r["_source"])

    dup_keys = {k: srcs for k, srcs in key_sources.items() if len(srcs) > 1}
    total_dup_rows = sum(len(srcs) - 1 for srcs in dup_keys.values())

    intra = 0
    cross = 0
    pair_counts = Counter()
    for k, srcs in dup_keys.items():
        src_set = set(srcs)
        src_counter = Counter(srcs)
        # intra-file dups: within same file
        for s, c in src_counter.items():
            if c > 1:
                intra += c - 1
        # cross-file dups
        if len(src_set) > 1:
            sorted_srcs = sorted(src_set)
            for i in range(len(sorted_srcs)):
                for j in range(i + 1, len(sorted_srcs)):
                    pair_counts[(sorted_srcs[i], sorted_srcs[j])] += 1
            cross += len(srcs) - max(src_counter.values())

    lines.append(f"**Total duplicate rows:** {total_dup_rows}\n")
    lines.append(f"- Intra-file duplicates: {intra}")
    lines.append(f"- Cross-file duplicates: {cross}\n")

    # Top 10 file-pair overlaps
    lines.append("### Top 10 File-Pair Overlaps\n")
    lines.append("| File A | File B | Shared Keys |")
    lines.append("|--------|--------|-------------|")
    for (a, b), cnt in pair_counts.most_common(10):
        lines.append(f"| {a} | {b} | {cnt} |")

    # 10 highest-count sample keys
    lines.append("\n### 10 Highest-Count Duplicate Keys\n")
    lines.append("| Festival | Category | Year | Nominee | Movie | Won | Count |")
    lines.append("|----------|----------|------|---------|-------|-----|-------|")
    for k, srcs in sorted(dup_keys.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        fest, cat, yr, nom, mov, won = k
        lines.append(f"| {fest} | {cat} | {yr} | {nom} | {mov} | {won} | {len(srcs)} |")

    lines.append("")
    json_data = {
        "total_duplicate_rows": total_dup_rows,
        "intra_file": intra,
        "cross_file": cross,
        "top_pairs": [{"pair": list(p), "count": c} for p, c in pair_counts.most_common(10)],
    }
    return "\n".join(lines), json_data


def section_c(all_records):
    """Cross-year appearances."""
    lines = ["## C. Cross-Year Appearances\n"]

    # Group by (festival, category, nominee_lower, movie_title_lower)
    tuple_years = defaultdict(set)
    for r in all_records:
        key = (r["festival"], r["category"], r["nominee"].lower(), r["movie_title"].lower())
        tuple_years[key].add(r["year"])

    multi = {k: sorted(yrs) for k, yrs in tuple_years.items() if len(yrs) > 1}
    lines.append(f"**Tuples appearing in multiple years:** {len(multi)}\n")

    # Bucket by year gap
    gap_1 = []
    gap_2 = []
    gap_3plus = []

    for key, years in multi.items():
        for i in range(len(years) - 1):
            gap = years[i + 1] - years[i]
            entry = {"key": key, "years": years, "gap": gap, "year_pair": (years[i], years[i + 1])}
            if gap == 1:
                gap_1.append(entry)
            elif gap == 2:
                gap_2.append(entry)
            else:
                gap_3plus.append(entry)

    lines.append(f"- 1-year gaps: {len(gap_1)}")
    lines.append(f"- 2-year gaps: {len(gap_2)}")
    lines.append(f"- 3+ year gaps: {len(gap_3plus)}\n")

    # Convention collision suspects (industry festivals, 1-year gap)
    industry_collisions = [e for e in gap_1 if e["key"][0].lower() in INDUSTRY_FESTIVALS]
    film_fest_flags = [e for e in gap_1 if e["key"][0].lower() in FILM_FESTIVALS]

    def _sample_table(entries, label, n=12):
        lines.append(f"### {label} ({len(entries)} total, showing up to {n})\n")
        if not entries:
            lines.append("_None found._\n")
            return
        lines.append("| Festival | Category | Nominee | Movie | Years | Gap |")
        lines.append("|----------|----------|---------|-------|-------|-----|")
        for e in entries[:n]:
            fest, cat, nom, mov = e["key"]
            yrs = ", ".join(str(y) for y in e["years"])
            lines.append(f"| {fest} | {cat} | {nom} | {mov} | {yrs} | {e['gap']} |")
        lines.append("")

    _sample_table(industry_collisions, "Convention Collision Suspects (Industry, 1yr gap)")
    _sample_table(film_fest_flags, "Film Festival 1-Year Gap Red Flags")
    _sample_table(gap_2, "2-Year Gaps")
    _sample_table(gap_3plus, "3+ Year Gaps")

    json_data = {
        "multi_year_tuples": len(multi),
        "gap_distribution": {"1yr": len(gap_1), "2yr": len(gap_2), "3yr_plus": len(gap_3plus)},
        "industry_collision_suspects": len(industry_collisions),
        "film_festival_1yr_flags": len(film_fest_flags),
    }
    return "\n".join(lines), json_data


def _dedup(records):
    """Remove exact duplicates, keeping first occurrence."""
    seen = set()
    out = []
    for r in records:
        k = _dup_key(r)
        if k not in seen:
            seen.add(k)
            out.append(r)
    return out


def _is_person_category(cat):
    low = cat.lower()
    return any(kw in low for kw in PERSON_KEYWORDS)


def section_d(all_records):
    """Post-2000 data quality (after dedup)."""
    lines = ["## D. Post-2000 Data Quality\n"]
    deduped = _dedup(all_records)
    post = [r for r in deduped if r["year"] >= 2000]

    # Group by (festival, category)
    groups = defaultdict(list)
    for r in post:
        groups[(r["festival"], r["category"])].append(r)

    lines.append(f"**Post-2000 rows (deduplicated): {len(post)}**\n")
    lines.append("| Festival | Category | Rows | Winners | Nominees | Missing TMDB | Missing Person | Year Range |")
    lines.append("|----------|----------|------|---------|----------|-------------|----------------|------------|")

    table_data = []
    for (fest, cat), recs in sorted(groups.items()):
        rows = len(recs)
        winners = sum(1 for r in recs if r["won"])
        nominees = sum(1 for r in recs if not r["won"])
        missing_tmdb = sum(1 for r in recs if r["tmdb_id"] in ("", "0"))
        is_person = _is_person_category(cat)
        missing_person = sum(1 for r in recs if r["nominee"] == "") if is_person else 0
        years = [r["year"] for r in recs]
        yr_range = f"{min(years)}-{max(years)}"
        lines.append(f"| {fest} | {cat} | {rows} | {winners} | {nominees} | {missing_tmdb} | {missing_person} | {yr_range} |")
        table_data.append({
            "festival": fest, "category": cat, "rows": rows,
            "winners": winners, "nominees": nominees,
            "missing_tmdb": missing_tmdb, "missing_person": missing_person,
            "year_range": yr_range,
        })

    lines.append("")
    return "\n".join(lines), table_data


def section_e(all_records):
    """Year coverage gaps post-2000."""
    lines = ["## E. Year Coverage Gaps Post-2000\n"]
    deduped = _dedup(all_records)
    post = [r for r in deduped if r["year"] >= 2000]

    groups = defaultdict(set)
    for r in post:
        groups[(r["festival"], r["category"])].add(r["year"])

    gaps_found = []
    for (fest, cat), years in sorted(groups.items()):
        max_yr = max(years)
        expected = set(range(2000, max_yr + 1))
        missing = sorted(expected - years)
        # Exclude Cannes 2020
        if fest.lower() == "cannes" and 2020 in missing:
            missing.remove(2020)
        if missing:
            gaps_found.append({"festival": fest, "category": cat, "missing_years": missing, "max_year": max_yr})

    if gaps_found:
        lines.append(f"**Categories with year gaps: {len(gaps_found)}**\n")
        lines.append("| Festival | Category | Max Year | Missing Years |")
        lines.append("|----------|----------|----------|---------------|")
        for g in gaps_found:
            missing_str = ", ".join(str(y) for y in g["missing_years"])
            lines.append(f"| {g['festival']} | {g['category']} | {g['max_year']} | {missing_str} |")
    else:
        lines.append("_No year coverage gaps found._")

    lines.append("")
    return "\n".join(lines), gaps_found


def section_f(all_records):
    """Festival name variants."""
    lines = ["## F. Festival Name Variants\n"]
    counter = Counter(r["festival"] for r in all_records)
    lines.append("| Festival String | Row Count |")
    lines.append("|-----------------|-----------|")
    for name, cnt in counter.most_common():
        lines.append(f"| {name} | {cnt} |")
    lines.append("")
    return "\n".join(lines), dict(counter)


def section_g(all_records):
    """Canonical file map."""
    lines = ["## G. Canonical File Map\n"]

    # Group by (festival, category) -> {source: post-2000 count}
    fc_sources = defaultdict(lambda: defaultdict(int))
    for r in all_records:
        if r["year"] >= 2000:
            fc_sources[(r["festival"], r["category"])][r["_source"]] += 1

    # Only categories in multiple files
    multi = {k: v for k, v in fc_sources.items() if len(v) > 1}

    if multi:
        lines.append(f"**Categories appearing in multiple files: {len(multi)}**\n")
        for (fest, cat), sources in sorted(multi.items()):
            lines.append(f"### {fest} - {cat}\n")
            lines.append("| File | Post-2000 Rows | Role |")
            lines.append("|------|---------------|------|")
            sorted_srcs = sorted(sources.items(), key=lambda x: x[1], reverse=True)
            for i, (src, cnt) in enumerate(sorted_srcs):
                role = "**Top contributor**" if i == 0 else "Secondary"
                lines.append(f"| {src} | {cnt} | {role} |")
            lines.append("")
    else:
        lines.append("_No categories found in multiple files._\n")

    json_data = {}
    for (fest, cat), sources in multi.items():
        json_data[f"{fest}|{cat}"] = dict(sources)

    return "\n".join(lines), json_data


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("ORBIT Awards Data Audit")
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
        print("ERROR: No records loaded. Nothing to audit.")
        sys.exit(1)

    # Run all sections
    md_parts = []
    json_summary = {}

    today = date.today().isoformat()
    md_parts.append(f"# ORBIT Awards Data Audit Report\n\n**Date:** {today}\n")

    text, data = section_a(all_records, per_file)
    md_parts.append(text)
    json_summary["per_file"] = data

    text, data = section_b(all_records, per_file)
    md_parts.append(text)
    json_summary["duplicates"] = data

    text, data = section_c(all_records)
    md_parts.append(text)
    json_summary["cross_year"] = data

    text, data = section_d(all_records)
    md_parts.append(text)
    json_summary["post_2000_quality"] = data

    text, data = section_e(all_records)
    md_parts.append(text)
    json_summary["year_gaps"] = data

    text, data = section_f(all_records)
    md_parts.append(text)
    json_summary["festival_variants"] = data

    text, data = section_g(all_records)
    md_parts.append(text)
    json_summary["canonical_file_map"] = data

    json_summary["totals"] = {
        "total_rows": len(all_records),
        "files_loaded": len(per_file),
        "files_missing": len(CSV_MAP) - len(per_file),
        "date": today,
    }

    full_md = "\n".join(md_parts)

    # Print to stdout
    print(full_md)

    # Write output files
    reports_dir = os.path.join(REPO_ROOT, "audit-reports")
    os.makedirs(reports_dir, exist_ok=True)

    md_path = os.path.join(reports_dir, f"awards-audit-{today}.md")
    json_path = os.path.join(reports_dir, f"awards-audit-{today}.json")

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(full_md)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_summary, f, indent=2, default=str)

    print(f"\n{'=' * 60}")
    print(f"Reports written to:")
    print(f"  {md_path}")
    print(f"  {json_path}")


if __name__ == "__main__":
    main()
