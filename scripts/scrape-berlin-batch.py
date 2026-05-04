#!/usr/bin/env python3
"""
ORBIT Berlin Batch Scrape-and-Verify Wrapper

Calls scripts/scrape-berlin.py for each year, then runs structural,
expectations, and landmark verification. Halts on anomaly by default.

Run:
  python3 scripts/scrape-berlin-batch.py --years 2024,2023,2022
  python3 scripts/scrape-berlin-batch.py --years 2024 --dry-run
  python3 scripts/scrape-berlin-batch.py --help
"""

import argparse
import csv
import json
import os
import subprocess
import sys
import unicodedata
from collections import Counter
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRAPER = os.path.join(REPO_ROOT, "scripts", "scrape-berlin.py")
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-berlin-categories.json")
EXPECTATIONS_FILE = os.path.join(REPO_ROOT, "data", "reference", "berlin-expectations.json")
TRUTH_FILE = os.path.join(REPO_ROOT, "data", "reference", "berlin-landmark-truth.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "berlin")
REPORTS_DIR = os.path.join(SCRAPED_DIR, "batch-reports")

SKIPPED_YEARS = set()
MIN_YEAR = 2000
MAX_YEAR = 2025
# Berlin lifecycle creates a moving target for "expected category count":
# 7 cats for cer 2000-2005 (no Best First Feature, gendered acting),
# 8 cats for cer 2006-2019 (Bauer + BFF + gendered acting),
# 7 cats for cer 2020 (Bauer retired; gendered acting still active),
# 8 cats for cer 2021+ (gender-neutral leading + supporting + BFF).
# Use lifecycle-aware expected_cats per year (computed in phase_c_structural).
MIN_CATEGORIES_PER_CEREMONY = 6

REQUIRED_FIELDS = ["year", "category_id", "result", "recipients_json",
                   "film_title", "verified_status", "scraped_at"]


def normalize_for_compare(text):
    text = (text or "").lower().strip()
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_csv_rows(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def resolve_expectation(category_entry, year):
    overrides = category_entry.get("era_overrides", [])
    for override in overrides:
        from_year = override.get("from_year", float("-inf"))
        to_year = override.get("to_year", float("inf"))
        if from_year <= year <= to_year:
            return (override["typical_winners"], override["tolerance"])
    return (category_entry["typical_winners"], category_entry["tolerance"])


# ---------------------------------------------------------------------------
# Verification phases
# ---------------------------------------------------------------------------

def phase_a_scrape(year, dry_run=False):
    if dry_run:
        csv_path = os.path.join(SCRAPED_DIR, f"berlin-{year}.csv")
        if os.path.isfile(csv_path):
            return 0, "(dry-run: using existing CSV)", ""
        return 1, "", f"(dry-run: CSV not found at {csv_path})"

    cmd = [sys.executable, SCRAPER, "--year", str(year)]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    return result.returncode, result.stdout, result.stderr


def phase_b_load(year):
    csv_path = os.path.join(SCRAPED_DIR, f"berlin-{year}.csv")
    if not os.path.isfile(csv_path):
        return None, f"CSV not found: {csv_path}"
    try:
        return load_csv_rows(csv_path), None
    except Exception as e:
        return None, f"CSV read error: {e}"


def phase_c_structural(rows, year, expectations):
    """Structural verification mirroring Venice/Cannes wrapper architecture.

    Berlin-specific allowances:
      - Lifecycle-aware expected_cats per year (Alfred Bauer retired 2020;
        gendered acting → gender-neutral leading/supporting in 2021;
        Best First Feature only from 2006).
      - categories_present is informational; row_count_minimum + Phase D
        MISSING verdicts (REVIEW) provide the actual signal.
    """
    checks = []
    cat_ids = [r["category_id"] for r in rows]
    distinct_cats = set(cat_ids)

    expected_cats = set()
    for cat_id, exp in expectations.items():
        fy = exp.get("first_year", 0)
        ly = exp.get("last_year")
        if year >= fy and (ly is None or year <= ly):
            expected_cats.add(cat_id)
    missing = expected_cats - distinct_cats
    extra = distinct_cats - expected_cats
    checks.append(("categories_present_info",
                    True,
                    f"missing={sorted(missing)}" if missing else
                    f"all {len(expected_cats)} expected categories present"))
    if extra:
        checks.append(("unexpected_categories", True,
                        f"extra={sorted(extra)} (info only)"))

    checks.append(("row_count_minimum",
                    len(rows) >= MIN_CATEGORIES_PER_CEREMONY,
                    f"rows={len(rows)} (expected >= {MIN_CATEGORIES_PER_CEREMONY})"))

    cat_counts = Counter(cat_ids)
    zero_winner_cats = sorted(c for c in expected_cats if cat_counts.get(c, 0) == 0)
    checks.append(("zero_winner_categories_info",
                    True,
                    f"zero_winner_cats={zero_winner_cats}" if zero_winner_cats else
                    "every expected category has >= 1 winner row"))

    non_won = sum(1 for r in rows if r.get("result") != "won")
    checks.append(("all_rows_won", non_won == 0, f"non_won_rows={non_won}"))

    empty_film = sum(1 for r in rows if not r.get("film_title"))
    checks.append(("film_title_populated", empty_film == 0,
                   f"empty_film_title_rows={empty_film}"))

    json_errors = 0
    empty_recipients = 0
    for r in rows:
        try:
            j = json.loads(r.get("recipients_json", "[]"))
            if not isinstance(j, list):
                json_errors += 1
            elif len(j) == 0:
                empty_recipients += 1
        except (json.JSONDecodeError, TypeError):
            json_errors += 1
    checks.append(("recipients_json_valid", json_errors == 0,
                   f"errors={json_errors}"))
    checks.append(("recipients_non_empty", empty_recipients == 0,
                   f"empty_recipient_rows={empty_recipients}"))

    missing_fields = 0
    for r in rows:
        for field in REQUIRED_FIELDS:
            if not r.get(field):
                missing_fields += 1
    checks.append(("required_fields", missing_fields == 0,
                   f"missing_values={missing_fields}"))

    bad_verified = sum(1 for r in rows if r.get("verified_status") != "auto_verified")
    checks.append(("verified_status_auto_verified", bad_verified == 0,
                   f"non_auto_verified_rows={bad_verified}"))

    flagged = sum(1 for r in rows if r.get("verified_status") == "flagged")
    checks.append(("zero_flagged", flagged == 0, f"flagged={flagged}"))

    co_winners = sum(1 for r in rows if str(r.get("co_winner", "")).lower() == "true")
    checks.append(("co_winner_count_info", True,
                   f"co_winner_rows={co_winners} (informational)"))

    return checks


def phase_d_expectations(rows, expectations, year):
    results = []
    cat_counts = Counter(r["category_id"] for r in rows)
    for cat_id, exp in sorted(expectations.items()):
        fy = exp.get("first_year", 0)
        ly = exp.get("last_year")
        if year < fy or (ly is not None and year > ly):
            continue
        typical, tol = resolve_expectation(exp, year)
        actual = cat_counts.get(cat_id, 0)
        low = max(0, typical - tol)
        high = typical + tol
        if low <= actual <= high:
            verdict = "OK"
        elif actual == 0:
            verdict = "MISSING"
        elif actual < low:
            verdict = "UNDER"
        else:
            verdict = "OVER"
        results.append((cat_id, typical, tol, actual, verdict, exp.get("notes", "")))
    return results


def phase_e_landmarks(rows, truth_entry):
    results = []
    landmarks = truth_entry.get("landmarks", {})
    for cat_id, lm in landmarks.items():
        cat_rows = [r for r in rows if r["category_id"] == cat_id]
        if "winner_film" in lm:
            won_rows = [r for r in cat_rows if r["result"] == "won"]
            if not won_rows:
                results.append((cat_id, "winner_film", False, "no winner row found"))
            else:
                w = won_rows[0]
                expected = normalize_for_compare(lm["winner_film"])
                actual = normalize_for_compare(w["film_title"])
                match = expected in actual or actual in expected
                results.append((cat_id, "winner_film", match,
                                f"expected='{lm['winner_film']}' actual='{w['film_title']}'"))
        if "winner_recipient" in lm:
            won_rows = [r for r in cat_rows if r["result"] == "won"]
            if not won_rows:
                results.append((cat_id, "winner_recipient", False, "no winner row found"))
            else:
                w = won_rows[0]
                recips = json.loads(w.get("recipients_json", "[]"))
                names = [normalize_for_compare(p["name"]) for p in recips]
                expected = normalize_for_compare(lm["winner_recipient"])
                match = any(expected in n or n in expected for n in names)
                actual_str = ", ".join(p["name"] for p in recips[:3])
                results.append((cat_id, "winner_recipient", match,
                                f"expected='{lm['winner_recipient']}' actual='{actual_str}'"))
        if "expected_winner_count" in lm:
            actual_count = len(cat_rows)
            expected_count = lm["expected_winner_count"]
            results.append((cat_id, "winner_count",
                            actual_count == expected_count,
                            f"expected={expected_count} actual={actual_count}"))
    return results


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def format_year_report(year, exit_code, rows, struct_checks,
                        exp_results, landmark_results, anomalies):
    lines = []
    total = len(rows) if rows else 0
    lines.append(f"## {year} Berlin International Film Festival")
    lines.append("")
    lines.append(f"- Scraper exit code: {exit_code}")
    lines.append(f"- Total rows: {total}")
    lines.append("")

    lines.append("### Structural Checks")
    lines.append("")
    lines.append("| Check | Passed | Detail |")
    lines.append("|-------|--------|--------|")
    for name, passed, detail in struct_checks:
        mark = "PASS" if passed else "**FAIL**"
        lines.append(f"| {name} | {mark} | {detail} |")
    lines.append("")

    lines.append("### Expectations vs Actual")
    lines.append("")
    lines.append("| Category | Expected | Tol | Actual | Verdict |")
    lines.append("|----------|----------|-----|--------|---------|")
    for cat_id, typical, tol, actual, verdict, _note in exp_results:
        v_str = verdict if verdict == "OK" else f"**{verdict}**"
        lines.append(f"| {cat_id} | {typical} | ±{tol} | {actual} | {v_str} |")
    lines.append("")

    if landmark_results:
        lines.append("### Landmark Verification")
        lines.append("")
        lines.append("| Category | Check | Passed | Detail |")
        lines.append("|----------|-------|--------|--------|")
        for cat_id, check, passed, detail in landmark_results:
            mark = "PASS" if passed else "**FAIL**"
            lines.append(f"| {cat_id} | {check} | {mark} | {detail} |")
        lines.append("")
    else:
        lines.append("### Landmark Verification")
        lines.append("")
        lines.append("_No landmark truth data for this year._")
        lines.append("")

    if anomalies:
        lines.append("### Anomalies")
        lines.append("")
        for a in anomalies:
            lines.append(f"- **{a['severity']}**: {a['description']}")
        lines.append("")

    if not anomalies:
        verdict = "PASS"
    elif any(a["severity"] == "FAIL" for a in anomalies):
        verdict = "FAIL"
    else:
        verdict = "REVIEW"
    lines.append(f"**Verdict: {verdict}**")
    lines.append("")
    lines.append("---")
    lines.append("")
    return "\n".join(lines), verdict


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="ORBIT Berlin Batch Scrape-and-Verify Wrapper"
    )
    parser.add_argument("--years", type=str, required=True,
                        help="Comma-separated ceremony years (e.g. 2024,2023,2022)")
    parser.add_argument("--abort-on-anomaly", action="store_true", default=True,
                        dest="abort_on_anomaly")
    parser.add_argument("--no-abort-on-anomaly", action="store_false",
                        dest="abort_on_anomaly")
    parser.add_argument("--dry-run", action="store_true",
                        help="Use existing CSVs, do not re-scrape")
    parser.add_argument("--report-file", type=str, default=None)
    args = parser.parse_args()

    years = [int(x.strip()) for x in args.years.split(",")]

    bad = [y for y in years if y < MIN_YEAR or y > MAX_YEAR or y in SKIPPED_YEARS]
    if bad:
        print(f"ERROR: years out of scope or skipped: {bad}")
        print(f"  Valid range: [{MIN_YEAR}, {MAX_YEAR}]")
        sys.exit(1)

    expectations = load_json(EXPECTATIONS_FILE).get("expectations", {})
    truth_data = load_json(TRUTH_FILE) if os.path.isfile(TRUTH_FILE) else {}
    truth_ceremonies = truth_data.get("ceremonies", {})

    now = datetime.now(timezone.utc)
    timestamp = now.strftime("%Y%m%d-%H%M%S")
    report_path = args.report_file or os.path.join(REPORTS_DIR, f"batch-{timestamp}.md")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    report_lines = [
        f"# Berlin Batch Scrape Report",
        f"",
        f"**Generated:** {now.isoformat()}  ",
        f"**Years:** {years[0]}-{years[-1]} ({len(years)} total)  ",
        f"**Mode:** {'dry-run' if args.dry_run else 'live scrape'}  ",
        f"**Abort on anomaly:** {args.abort_on_anomaly}",
        f"",
        f"---",
        f"",
    ]

    results_summary = []
    any_fail = False

    for year in years:
        anomalies = []
        print(f"\n{'=' * 60}")
        print(f"[berlin batch {year}] Processing {year} Berlin International Film Festival")
        print(f"{'=' * 60}")

        print(f"  Phase A: {'Using existing CSV (dry-run)' if args.dry_run else 'Running scraper'}...")
        exit_code, stdout, stderr = phase_a_scrape(year, dry_run=args.dry_run)
        if exit_code == 1:
            anomalies.append({"severity": "FAIL",
                              "description": f"Scraper exit code 1 (parse failure / missing categories)"})

        print(f"  Phase B: Loading CSV...")
        rows, load_err = phase_b_load(year)
        if rows is None:
            anomalies.append({"severity": "FAIL", "description": f"CSV load failed: {load_err}"})
            print(f"  [berlin batch {year}] FAIL — {load_err}")
            report_text, verdict = format_year_report(
                year, exit_code, [], [], [], [], anomalies)
            report_lines.append(report_text)
            results_summary.append((year, verdict, 0, len(anomalies)))
            if args.abort_on_anomaly:
                print(f"  HALTING BATCH.")
                any_fail = True
                break
            continue
        print(f"  Loaded {len(rows)} rows")

        print(f"  Phase C: Structural verification...")
        struct_checks = phase_c_structural(rows, year, expectations)
        for name, passed, detail in struct_checks:
            if not passed:
                anomalies.append({"severity": "FAIL",
                                  "description": f"Structural check '{name}' failed: {detail}"})

        print(f"  Phase D: Expectations check...")
        exp_results = phase_d_expectations(rows, expectations, year)
        for cat_id, typical, tol, actual, verdict, _ in exp_results:
            if verdict == "MISSING":
                anomalies.append({"severity": "REVIEW",
                                  "description": f"{cat_id}: 0 winner rows (expected ~{typical}) — possible legitimate gap year"})
            elif verdict == "OVER":
                anomalies.append({"severity": "REVIEW",
                                  "description": f"{cat_id}: {actual} winner rows exceeds expected {typical}±{tol}"})
            elif verdict == "UNDER":
                anomalies.append({"severity": "REVIEW",
                                  "description": f"{cat_id}: {actual} winner rows below expected {typical}±{tol}"})

        truth_entry = truth_ceremonies.get(str(year), {})
        landmark_results = []
        if truth_entry:
            print(f"  Phase E: Landmark verification...")
            landmark_results = phase_e_landmarks(rows, truth_entry)
            for cat_id, check, passed, detail in landmark_results:
                if not passed:
                    anomalies.append({"severity": "FAIL",
                                      "description": f"Landmark {cat_id}.{check}: {detail}"})
        else:
            print(f"  Phase E: No landmark truth for {year}, skipping")

        report_text, verdict = format_year_report(
            year, exit_code, rows, struct_checks,
            exp_results, landmark_results, anomalies)
        report_lines.append(report_text)

        anomaly_count = len(anomalies)
        fail_count = sum(1 for a in anomalies if a["severity"] == "FAIL")
        results_summary.append((year, verdict, len(rows), anomaly_count))

        if verdict == "PASS":
            print(f"  [berlin batch {year}] PASS — {len(rows)} rows, "
                  f"{len(set(r['category_id'] for r in rows))} cats")
        elif verdict == "REVIEW":
            print(f"  [berlin batch {year}] REVIEW — {len(rows)} rows, "
                  f"{anomaly_count} anomalies (no critical failures)")
        else:
            print(f"  [berlin batch {year}] FAIL — {anomaly_count} anomalies "
                  f"({fail_count} critical)")
            any_fail = True

        if any_fail and args.abort_on_anomaly:
            print(f"  HALTING BATCH.")
            break

    report_lines.append("## Roll-up Summary")
    report_lines.append("")
    report_lines.append("| Year | Verdict | Rows | Anomalies |")
    report_lines.append("|------|---------|------|-----------|")
    for year, verdict, row_count, anomaly_count in results_summary:
        v_str = verdict if verdict == "PASS" else f"**{verdict}**"
        report_lines.append(f"| {year} | {v_str} | {row_count} | {anomaly_count} |")
    report_lines.append("")

    total_rows = sum(rc for _, _, rc, _ in results_summary)
    total_anomalies = sum(ac for _, _, _, ac in results_summary)
    pass_count = sum(1 for _, v, _, _ in results_summary if v == "PASS")
    report_lines.append(f"**Total years processed:** {len(results_summary)}  ")
    report_lines.append(f"**Total rows:** {total_rows}  ")
    report_lines.append(f"**Total anomalies:** {total_anomalies}  ")
    report_lines.append(f"**PASS:** {pass_count} / {len(results_summary)}")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))

    print(f"\n{'=' * 60}")
    print(f"BATCH COMPLETE")
    print(f"{'=' * 60}")
    print(f"  Years processed: {len(results_summary)}")
    print(f"  PASS: {pass_count}, "
          f"REVIEW: {sum(1 for _, v, _, _ in results_summary if v == 'REVIEW')}, "
          f"FAIL: {sum(1 for _, v, _, _ in results_summary if v == 'FAIL')}")
    print(f"  Total rows: {total_rows}")
    print(f"  Report: {report_path}")

    if any_fail:
        sys.exit(1 if args.abort_on_anomaly else 2)
    sys.exit(0)


if __name__ == "__main__":
    main()
