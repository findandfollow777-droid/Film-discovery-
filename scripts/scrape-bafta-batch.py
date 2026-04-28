#!/usr/bin/env python3
"""
ORBIT BAFTA Batch Scrape-and-Verify Wrapper

Calls scripts/scrape-bafta.py for each ceremony, then runs structural,
expectations, and landmark verification. Halts on anomaly by default.

Run:
  python3 scripts/scrape-bafta-batch.py --ceremonies 79,78
  python3 scripts/scrape-bafta-batch.py --range 79-53
  python3 scripts/scrape-bafta-batch.py --ceremonies 79,78 --dry-run
  python3 scripts/scrape-bafta-batch.py --help
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
SCRAPER = os.path.join(REPO_ROOT, "scripts", "scrape-bafta.py")
CATEGORIES_FILE = os.path.join(REPO_ROOT, "scripts", "scrape-bafta-categories.json")
EXPECTATIONS_FILE = os.path.join(REPO_ROOT, "data", "reference", "bafta-expectations.json")
TRUTH_FILE = os.path.join(REPO_ROOT, "data", "reference", "bafta-landmark-truth.json")
SCRAPED_DIR = os.path.join(REPO_ROOT, "data", "scraped", "bafta")
REPORTS_DIR = os.path.join(SCRAPED_DIR, "batch-reports")

CEREMONY_YEAR_OFFSET = 1947
REQUIRED_FIELDS = ["id", "ceremony_id", "category_id", "year", "result",
                   "recipients_json", "source_url", "scraped_at",
                   "scrape_version", "verified_status"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ceremony_to_year(n):
    return n + CEREMONY_YEAR_OFFSET


def normalize_for_compare(text):
    """Lowercase, strip accents, strip punctuation for fuzzy comparison."""
    text = text.lower().strip()
    nfkd = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in nfkd if not unicodedata.combining(c))
    return text


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_csv_rows(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def resolve_expectation(category_entry, ceremony_year):
    """Return (typical, tolerance) for this year, applying era_overrides if any match.

    First matching override in the array wins (defensive against overlapping ranges,
    which shouldn't occur in practice). Falls back to top-level fields when no
    override matches.
    """
    overrides = category_entry.get("era_overrides", [])
    for override in overrides:
        from_year = override.get("from_year", float("-inf"))
        to_year = override.get("to_year", float("inf"))
        if from_year <= ceremony_year <= to_year:
            return (override["typical_nominations"], override["tolerance"])
    return (category_entry["typical_nominations"], category_entry["tolerance"])


# ---------------------------------------------------------------------------
# Verification phases
# ---------------------------------------------------------------------------

def phase_a_scrape(ceremony_num, dry_run=False):
    """Run the scraper. Returns (exit_code, stdout, stderr)."""
    if dry_run:
        csv_path = os.path.join(SCRAPED_DIR, f"bafta-ceremony-{ceremony_num}.csv")
        if os.path.isfile(csv_path):
            return 0, "(dry-run: using existing CSV)", ""
        else:
            return 1, "", f"(dry-run: CSV not found at {csv_path})"

    cmd = [sys.executable, SCRAPER, "--ceremony", str(ceremony_num)]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    return result.returncode, result.stdout, result.stderr


def phase_b_load(ceremony_num):
    """Load CSV. Returns (rows, error_msg)."""
    csv_path = os.path.join(SCRAPED_DIR, f"bafta-ceremony-{ceremony_num}.csv")
    if not os.path.isfile(csv_path):
        return None, f"CSV not found: {csv_path}"
    try:
        rows = load_csv_rows(csv_path)
        return rows, None
    except Exception as e:
        return None, f"CSV read error: {e}"


def phase_c_structural(rows, ceremony_num, expectations):
    """Structural verification. Returns list of (check_name, passed, detail)."""
    checks = []
    year = ceremony_to_year(ceremony_num)

    # Check 1: expected categories present
    actual_cats = set(r["category_id"] for r in rows)
    expected_cats = set()
    for cat_id, exp in expectations.items():
        fy = exp.get("first_year", 0)
        ly = exp.get("last_year")
        if year >= fy and (ly is None or year <= ly):
            expected_cats.add(cat_id)

    missing = expected_cats - actual_cats
    extra = actual_cats - expected_cats
    checks.append(("categories_present",
                    len(missing) == 0,
                    f"missing={sorted(missing)}" if missing else "all expected categories present"))
    if extra:
        checks.append(("unexpected_categories", True, f"extra={sorted(extra)} (info only)"))

    # Check 2: 0 flagged
    flagged = sum(1 for r in rows if r.get("verified_status") == "flagged")
    checks.append(("zero_flagged", flagged == 0, f"flagged={flagged}"))

    # Check 3: 0 pending
    pending = sum(1 for r in rows if r.get("verified_status") == "pending")
    checks.append(("zero_pending", pending == 0, f"pending={pending}"))

    # Check 4: recipients_json valid
    json_errors = 0
    for r in rows:
        try:
            j = json.loads(r.get("recipients_json", "[]"))
            if not isinstance(j, list):
                json_errors += 1
        except (json.JSONDecodeError, TypeError):
            json_errors += 1
    checks.append(("recipients_json_valid", json_errors == 0, f"errors={json_errors}"))

    # Check 5: required fields populated
    missing_fields = 0
    for r in rows:
        for field in REQUIRED_FIELDS:
            if not r.get(field):
                missing_fields += 1
    checks.append(("required_fields", missing_fields == 0, f"missing_values={missing_fields}"))

    return checks


def phase_d_expectations(rows, expectations, year):
    """Expectations check. Returns list of (cat_id, expected, tolerance, actual, verdict, note)."""
    results = []
    cat_counts = Counter(r["category_id"] for r in rows)

    for cat_id, exp in sorted(expectations.items()):
        fy = exp.get("first_year", 0)
        ly = exp.get("last_year")
        if year < fy or (ly is not None and year > ly):
            continue  # Category not active

        typical, tol = resolve_expectation(exp, year)
        actual = cat_counts.get(cat_id, 0)

        if actual == 0:
            verdict = "MISSING"
        elif actual < typical - tol:
            verdict = "UNDER"
        elif actual > typical + tol:
            verdict = "OVER"
        else:
            verdict = "OK"

        note = exp.get("notes", "")
        results.append((cat_id, typical, tol, actual, verdict, note))

    return results


def phase_e_landmarks(rows, truth_entry):
    """Landmark verification. Returns list of (cat_id, check, passed, detail)."""
    results = []
    landmarks = truth_entry.get("landmarks", {})

    for cat_id, lm in landmarks.items():
        cat_rows = [r for r in rows if r["category_id"] == cat_id]

        # Winner film check
        if "winner_film" in lm:
            winners = [r for r in cat_rows if r["result"] == "won"]
            if not winners:
                results.append((cat_id, "winner_film", False, "no winner row found"))
            else:
                w = winners[0]
                expected = normalize_for_compare(lm["winner_film"])
                actual = normalize_for_compare(w["film_title"])
                match = expected in actual or actual in expected
                results.append((cat_id, "winner_film", match,
                                f"expected='{lm['winner_film']}' actual='{w['film_title']}'"))

        # Winner recipient check
        if "winner_recipient" in lm:
            winners = [r for r in cat_rows if r["result"] == "won"]
            if not winners:
                results.append((cat_id, "winner_recipient", False, "no winner row found"))
            else:
                w = winners[0]
                recips = json.loads(w.get("recipients_json", "[]"))
                recip_names = [normalize_for_compare(p["name"]) for p in recips]
                expected = normalize_for_compare(lm["winner_recipient"])
                match = any(expected in n or n in expected for n in recip_names)
                actual_str = ", ".join(p["name"] for p in recips[:3])
                results.append((cat_id, "winner_recipient", match,
                                f"expected='{lm['winner_recipient']}' actual='{actual_str}'"))

        # Nomination count check
        if "expected_nomination_count" in lm:
            expected_count = lm["expected_nomination_count"]
            actual_count = len(cat_rows)
            match = actual_count == expected_count
            results.append((cat_id, "nomination_count", match,
                            f"expected={expected_count} actual={actual_count}"))

        # Known nominations check
        if "known_nominations" in lm:
            actual_films = set(normalize_for_compare(r["film_title"]) for r in cat_rows)
            missing = []
            for nom in lm["known_nominations"]:
                nom_film = normalize_for_compare(nom.split("/")[0].strip())
                if not any(nom_film in af or af in nom_film for af in actual_films):
                    missing.append(nom)
            if missing:
                results.append((cat_id, "known_nominations", False,
                                f"missing: {missing}"))
            else:
                results.append((cat_id, "known_nominations", True,
                                f"all {len(lm['known_nominations'])} found"))

    return results


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def format_ceremony_report(ceremony_num, exit_code, rows, struct_checks,
                           exp_results, landmark_results, anomalies):
    """Format a per-ceremony report section."""
    lines = []
    year = ceremony_to_year(ceremony_num)
    total = len(rows) if rows else 0

    lines.append(f"## Ceremony {ceremony_num} ({year})")
    lines.append("")
    lines.append(f"- Scraper exit code: {exit_code}")
    lines.append(f"- Total rows: {total}")
    lines.append("")

    # Structural checks
    lines.append("### Structural Checks")
    lines.append("")
    lines.append("| Check | Passed | Detail |")
    lines.append("|-------|--------|--------|")
    for name, passed, detail in struct_checks:
        mark = "PASS" if passed else "**FAIL**"
        lines.append(f"| {name} | {mark} | {detail} |")
    lines.append("")

    # Expectations
    lines.append("### Expectations vs Actual")
    lines.append("")
    lines.append("| Category | Expected | Tol | Actual | Verdict |")
    lines.append("|----------|----------|-----|--------|---------|")
    for cat_id, typical, tol, actual, verdict, note in exp_results:
        v_str = verdict if verdict == "OK" else f"**{verdict}**"
        lines.append(f"| {cat_id} | {typical} | ±{tol} | {actual} | {v_str} |")
    lines.append("")

    # Landmarks
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
        lines.append("_No landmark truth data for this ceremony._")
        lines.append("")

    # Anomalies
    if anomalies:
        lines.append("### Anomalies")
        lines.append("")
        for a in anomalies:
            lines.append(f"- **{a['severity']}**: {a['description']}")
        lines.append("")

    # Verdict
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
        description="ORBIT BAFTA Batch Scrape-and-Verify Wrapper"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--ceremonies", type=str,
                       help="Comma-separated ceremony numbers (e.g. 79,78,77)")
    group.add_argument("--range", type=str,
                       help="Ceremony range high-low (e.g. 79-53)")
    parser.add_argument("--abort-on-anomaly", action="store_true", default=True,
                        dest="abort_on_anomaly")
    parser.add_argument("--no-abort-on-anomaly", action="store_false",
                        dest="abort_on_anomaly")
    parser.add_argument("--dry-run", action="store_true",
                        help="Use existing CSVs, do not re-scrape")
    parser.add_argument("--report-file", type=str, default=None,
                        help="Override report file path")
    args = parser.parse_args()

    # Parse ceremony list
    if args.ceremonies:
        ceremony_nums = [int(x.strip()) for x in args.ceremonies.split(",")]
    else:
        parts = args.range.split("-")
        high, low = int(parts[0]), int(parts[1])
        ceremony_nums = list(range(high, low - 1, -1))

    # Load reference data
    expectations = load_json(EXPECTATIONS_FILE).get("expectations", {})
    truth_data = load_json(TRUTH_FILE) if os.path.isfile(TRUTH_FILE) else {}
    truth_ceremonies = truth_data.get("ceremonies", {})

    # Report setup
    now = datetime.now(timezone.utc)
    timestamp = now.strftime("%Y%m%d-%H%M%S")
    report_path = args.report_file or os.path.join(REPORTS_DIR, f"batch-{timestamp}.md")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    report_lines = [
        f"# BAFTA Batch Scrape Report",
        f"",
        f"**Generated:** {now.isoformat()}  ",
        f"**Ceremonies:** {ceremony_nums[0]}-{ceremony_nums[-1]} ({len(ceremony_nums)} total)  ",
        f"**Mode:** {'dry-run' if args.dry_run else 'live scrape'}  ",
        f"**Abort on anomaly:** {args.abort_on_anomaly}",
        f"",
        f"---",
        f"",
    ]

    # Process each ceremony
    results_summary = []
    any_fail = False

    for ceremony_num in ceremony_nums:
        year = ceremony_to_year(ceremony_num)
        anomalies = []

        print(f"\n{'=' * 60}")
        print(f"[bafta batch {ceremony_num}] Processing ceremony {ceremony_num} ({year})")
        print(f"{'=' * 60}")

        # Phase A: Scrape
        print(f"  Phase A: {'Using existing CSV (dry-run)' if args.dry_run else 'Running scraper'}...")
        exit_code, stdout, stderr = phase_a_scrape(ceremony_num, dry_run=args.dry_run)
        if exit_code == 1:
            anomalies.append({"severity": "FAIL",
                              "description": f"Scraper exit code 1 (parse failure)"})
        elif exit_code == 2:
            anomalies.append({"severity": "REVIEW",
                              "description": f"Scraper exit code 2 (flagged rows present)"})

        # Phase B: Load
        print(f"  Phase B: Loading CSV...")
        rows, load_err = phase_b_load(ceremony_num)
        if rows is None:
            anomalies.append({"severity": "FAIL", "description": f"CSV load failed: {load_err}"})
            print(f"  [bafta batch {ceremony_num}] FAIL — {load_err}")
            report_text, verdict = format_ceremony_report(
                ceremony_num, exit_code, [], [], [], [], anomalies)
            report_lines.append(report_text)
            results_summary.append((ceremony_num, verdict, 0, len(anomalies)))
            if args.abort_on_anomaly:
                print(f"  HALTING BATCH.")
                any_fail = True
                break
            continue

        print(f"  Loaded {len(rows)} rows")

        # Phase C: Structural
        print(f"  Phase C: Structural verification...")
        struct_checks = phase_c_structural(rows, ceremony_num, expectations)
        for name, passed, detail in struct_checks:
            if not passed:
                anomalies.append({"severity": "FAIL",
                                  "description": f"Structural check '{name}' failed: {detail}"})

        # Phase D: Expectations
        print(f"  Phase D: Expectations check...")
        exp_results = phase_d_expectations(rows, expectations, year)
        for cat_id, typical, tol, actual, verdict, note in exp_results:
            if verdict == "MISSING":
                anomalies.append({"severity": "FAIL",
                                  "description": f"{cat_id}: 0 rows (expected ~{typical})"})
            elif verdict == "OVER":
                anomalies.append({"severity": "REVIEW",
                                  "description": f"{cat_id}: {actual} rows exceeds expected {typical}±{tol} (possible silent split)"})
            elif verdict == "UNDER":
                anomalies.append({"severity": "REVIEW",
                                  "description": f"{cat_id}: {actual} rows below expected {typical}±{tol} (possible silent drop)"})

        # Phase E: Landmarks
        truth_entry = truth_ceremonies.get(str(ceremony_num), {})
        landmark_results = []
        if truth_entry:
            print(f"  Phase E: Landmark verification...")
            landmark_results = phase_e_landmarks(rows, truth_entry)
            for cat_id, check, passed, detail in landmark_results:
                if not passed:
                    anomalies.append({"severity": "FAIL",
                                      "description": f"Landmark {cat_id}.{check}: {detail}"})
        else:
            print(f"  Phase E: No landmark truth for ceremony {ceremony_num}, skipping")

        # Phase F: Report
        report_text, verdict = format_ceremony_report(
            ceremony_num, exit_code, rows, struct_checks,
            exp_results, landmark_results, anomalies)
        report_lines.append(report_text)

        # Phase G: Summary and continuation
        anomaly_count = len(anomalies)
        fail_count = sum(1 for a in anomalies if a["severity"] == "FAIL")
        results_summary.append((ceremony_num, verdict, len(rows), anomaly_count))

        if verdict == "PASS":
            print(f"  [bafta batch {ceremony_num}] PASS — {len(rows)} rows, "
                  f"{len(set(r['category_id'] for r in rows))} cats, 0 anomalies")
        elif verdict == "REVIEW":
            print(f"  [bafta batch {ceremony_num}] REVIEW — {len(rows)} rows, "
                  f"{anomaly_count} anomalies (no critical failures)")
        else:
            print(f"  [bafta batch {ceremony_num}] FAIL — {anomaly_count} anomalies "
                  f"({fail_count} critical)")
            any_fail = True

        if any_fail and args.abort_on_anomaly:
            print(f"  HALTING BATCH.")
            break

    # Roll-up summary
    report_lines.append("## Roll-up Summary")
    report_lines.append("")
    report_lines.append("| Ceremony | Verdict | Rows | Anomalies |")
    report_lines.append("|----------|---------|------|-----------|")
    for cer, verdict, row_count, anomaly_count in results_summary:
        v_str = verdict if verdict == "PASS" else f"**{verdict}**"
        report_lines.append(f"| {cer} | {v_str} | {row_count} | {anomaly_count} |")
    report_lines.append("")

    total_rows = sum(rc for _, _, rc, _ in results_summary)
    total_anomalies = sum(ac for _, _, _, ac in results_summary)
    pass_count = sum(1 for _, v, _, _ in results_summary if v == "PASS")
    report_lines.append(f"**Total ceremonies processed:** {len(results_summary)}  ")
    report_lines.append(f"**Total rows:** {total_rows}  ")
    report_lines.append(f"**Total anomalies:** {total_anomalies}  ")
    report_lines.append(f"**PASS:** {pass_count} / {len(results_summary)}")

    # Write report
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))

    print(f"\n{'=' * 60}")
    print(f"BATCH COMPLETE")
    print(f"{'=' * 60}")
    print(f"  Ceremonies processed: {len(results_summary)}")
    print(f"  PASS: {pass_count}, REVIEW: {sum(1 for _, v, _, _ in results_summary if v == 'REVIEW')}, "
          f"FAIL: {sum(1 for _, v, _, _ in results_summary if v == 'FAIL')}")
    print(f"  Total rows: {total_rows}")
    print(f"  Report: {report_path}")

    if any_fail:
        sys.exit(1 if args.abort_on_anomaly else 2)
    sys.exit(0)


if __name__ == "__main__":
    main()
