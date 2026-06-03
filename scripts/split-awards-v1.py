#!/usr/bin/env python3
"""Split data/awards-data-v1.json into per-festival files + a slim index.

Reads the unified v1 awards file and emits:
  - data/awards-v1-{festival_id}.json   (one per festival)
  - data/awards-v1-index.json           (lightweight catalogue)

The full source file is read-only.
"""

import json
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
SRC = DATA_DIR / "awards-data-v1.json"

EXPECTED_FESTIVALS = ["oscar", "bafta", "gg", "cannes", "venice", "berlin"]


def year_range(years):
    years = [y for y in years if isinstance(y, int)]
    if not years:
        return None
    return {"min": min(years), "max": max(years)}


def main():
    with SRC.open("r", encoding="utf-8") as f:
        full = json.load(f)

    src_meta = full["meta"]
    festivals = full["festivals"]
    ceremonies = full["ceremonies"]
    categories = full["categories"]
    awards = full["awards"]
    known_issues = src_meta.get("known_issues", []) or []

    festival_ids = [f["id"] for f in festivals]
    missing = [fid for fid in EXPECTED_FESTIVALS if fid not in festival_ids]
    extra = [fid for fid in festival_ids if fid not in EXPECTED_FESTIVALS]
    if missing or extra:
        print(f"WARNING: festival id mismatch — missing={missing} extra={extra}")

    # Pre-bucket child rows by festival_id for O(N) split.
    fest_record = {f["id"]: f for f in festivals}
    cer_by_fest = {fid: [] for fid in festival_ids}
    cat_by_fest = {fid: [] for fid in festival_ids}
    awards_by_fest = {fid: [] for fid in festival_ids}
    issues_by_fest = {fid: [] for fid in festival_ids}

    for c in ceremonies:
        cer_by_fest.setdefault(c["festival_id"], []).append(c)
    for c in categories:
        cat_by_fest.setdefault(c["festival_id"], []).append(c)

    # Awards link via ceremony_id ("{festival}.{year}") and category_id
    # ("{festival}.{slug}"). Both share the festival prefix; use ceremony_id
    # since every award has one.
    for a in awards:
        fid = a["ceremony_id"].split(".", 1)[0]
        awards_by_fest.setdefault(fid, []).append(a)

    for issue in known_issues:
        fid = issue.get("festival_id")
        if fid in issues_by_fest:
            issues_by_fest[fid].append(issue)

    index = {
        "version": src_meta.get("version"),
        "schema_version": src_meta.get("schema_version"),
        "generated_at": src_meta.get("generated_at"),
        "festivals": {},
    }

    print(f"Source: {SRC.relative_to(REPO_ROOT)}  ({SRC.stat().st_size:,} bytes)")
    print(f"Splitting into {len(festival_ids)} festival files…\n")

    written = []
    for fid in festival_ids:
        fest = fest_record[fid]
        fest_ceremonies = cer_by_fest[fid]
        fest_categories = cat_by_fest[fid]
        fest_awards = awards_by_fest[fid]
        fest_issues = issues_by_fest[fid]

        yr = year_range([c.get("year") for c in fest_ceremonies])

        meta = {
            **src_meta,
            "row_count": len(fest_awards),
            "festival_count": 1,
            "category_count": len(fest_categories),
            "ceremony_count": len(fest_ceremonies),
            "year_range": yr,
            "known_issues": fest_issues,
        }

        out = {
            "meta": meta,
            "festivals": [fest],
            "ceremonies": fest_ceremonies,
            "categories": fest_categories,
            "awards": fest_awards,
        }

        out_path = DATA_DIR / f"awards-v1-{fid}.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)

        size = out_path.stat().st_size
        written.append((fid, out_path, size, len(fest_awards), len(fest_ceremonies), len(fest_categories), yr))

        index["festivals"][fid] = {
            "row_count": len(fest_awards),
            "ceremony_count": len(fest_ceremonies),
            "category_count": len(fest_categories),
            "year_range": yr,
            "file": out_path.name,
        }

    index_path = DATA_DIR / "awards-v1-index.json"
    with index_path.open("w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"{'festival':<10} {'awards':>7} {'cers':>5} {'cats':>5} {'years':>11}  {'size':>10}  file")
    print("-" * 80)
    for fid, path, size, awards_n, cers_n, cats_n, yr in written:
        yr_str = f"{yr['min']}–{yr['max']}" if yr else "—"
        print(f"{fid:<10} {awards_n:>7} {cers_n:>5} {cats_n:>5} {yr_str:>11}  {size:>10,}  {path.name}")

    print()
    print(f"index      {'':>7} {'':>5} {'':>5} {'':>11}  {index_path.stat().st_size:>10,}  {index_path.name}")
    print()
    print(f"Wrote {len(written)} festival files + 1 index file → {DATA_DIR.relative_to(REPO_ROOT)}/")


if __name__ == "__main__":
    main()
