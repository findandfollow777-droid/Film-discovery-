#!/usr/bin/env python3
"""
ORBIT — Phase 2 Person TMDB ID Resolver
========================================
Reads recipients_json across data/scraped/{festival}/*.csv, normalises and
splits ensemble strings into individual people, looks each up via
TMDB /search/person, and writes resolved ids + profile_path +
known_for_department back into the CSV's recipients_json field.

Run from the project root:
    python3 scripts/resolve-person-tmdb-ids.py            # full run
    python3 scripts/resolve-person-tmdb-ids.py --dry-run  # count only

Outputs:
    data/tmdb-person-cache.json          — name -> {id, profile_path, known_for_department} | null
    data/tmdb-person-unresolved.txt      — names TMDB returned no results for
    data/tmdb-person-collisions.txt      — same tmdb_id shared across distinct names

This script does NOT modify orbit_tmdb_lookup.py or orbit_tmdb_cache.json;
the legacy cache is read at startup as a seed source only.
"""

import argparse
import csv
import glob
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
CONFIG_JS = ROOT / "config.js"
LEGACY_CACHE = ROOT / "orbit_tmdb_cache.json"
NEW_CACHE = ROOT / "data" / "tmdb-person-cache.json"
UNRESOLVED_LOG = ROOT / "data" / "tmdb-person-unresolved.txt"
COLLISIONS_LOG = ROOT / "data" / "tmdb-person-collisions.txt"
FESTIVALS = ["oscar", "bafta", "gg", "cannes", "venice", "berlin"]

# Rate limiting — mirrors orbit_tmdb_lookup.py
REQUESTS_PER_BURST = 38
BURST_PAUSE = 10.5
INTER_REQUEST_GAP = 0.12
CHECKPOINT_EVERY = 50

# ── Helpers ────────────────────────────────────────────────────────────────

def load_api_key():
    if not CONFIG_JS.exists():
        sys.exit(f"config.js not found at {CONFIG_JS}")
    content = CONFIG_JS.read_text(encoding="utf-8")
    m = re.search(r"TMDB_API_KEY\s*=\s*['\"]([^'\"]+)['\"]", content)
    if not m:
        sys.exit("TMDB_API_KEY not found in config.js")
    return m.group(1)


def normalise_name(raw):
    if not raw:
        return ""
    name = html.unescape(raw)
    name = name.replace("\xa0", " ")
    name = re.sub(r"\s*\([^)]+\)", "", name)         # strip "(dir.)" etc
    name = " ".join(name.split()).strip()
    return name


_ENSEMBLE_AND = re.compile(r"\s*,\s*and\s+|\s+and\s+|\s*&\s*", re.IGNORECASE)

def split_ensemble(raw):
    """Split an ensemble name string into individual normalised names.
    Conservative comma-split: only splits on ',' when every comma-part has
    at least two words (filters lastname-first and suffix-style commas)."""
    if not raw:
        return []
    parts = re.split(r"\s*;\s*", raw)
    out = []
    for part in parts:
        subparts = _ENSEMBLE_AND.split(part)
        for sub in subparts:
            sub = sub.strip()
            if not sub:
                continue
            comma_parts = [p.strip() for p in re.split(r",\s+", sub) if p.strip()]
            # Only honor comma-splits where every fragment looks like a
            # multi-word capitalised name (avoids "Smith, John" / "Jr.")
            if len(comma_parts) > 1 and all(
                len(p.split()) >= 2 and p[0].isupper() for p in comma_parts
            ):
                out.extend(comma_parts)
            else:
                out.append(sub)
    return [n for n in (normalise_name(p) for p in out) if n]


# ── Cache I/O ──────────────────────────────────────────────────────────────

def load_cache():
    cache = {}
    if NEW_CACHE.exists():
        with open(NEW_CACHE, encoding="utf-8") as f:
            cache = json.load(f)
    # Seed from legacy id-only cache (don't overwrite richer new-cache entries)
    if LEGACY_CACHE.exists():
        with open(LEGACY_CACHE, encoding="utf-8") as f:
            legacy = json.load(f)
        seeded = 0
        for k, v in legacy.items():
            key = normalise_name(k) or k
            if key in cache:
                continue
            if isinstance(v, int) and v > 0:
                cache[key] = {"id": v, "profile_path": None, "known_for_department": None}
                seeded += 1
        if seeded:
            print(f"[cache] seeded {seeded} entries from legacy id-only cache")
    return cache


def save_cache(cache):
    NEW_CACHE.parent.mkdir(parents=True, exist_ok=True)
    tmp = NEW_CACHE.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2, sort_keys=True)
    os.replace(tmp, NEW_CACHE)


# ── TMDB ───────────────────────────────────────────────────────────────────

def search_person(name, api_key):
    url = (
        "https://api.themoviedb.org/3/search/person"
        f"?api_key={api_key}&query={quote(name)}"
    )
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} searching {name!r}")
        return None
    except Exception as e:
        print(f"  ERROR searching {name!r}: {e}")
        return None
    results = data.get("results") or []
    if not results:
        return None
    top = results[0]
    return {
        "id": top.get("id"),
        "profile_path": top.get("profile_path"),
        "known_for_department": top.get("known_for_department"),
    }


# ── CSV scan ───────────────────────────────────────────────────────────────

def csv_paths():
    paths = []
    for fest in FESTIVALS:
        paths.extend(sorted(glob.glob(str(ROOT / "data" / "scraped" / fest / "*.csv"))))
    return paths


def collect_unique_names():
    """Return (raw_unique, split_unique) — both sets of normalised names."""
    raw_unique = set()
    split_unique = set()
    for path in csv_paths():
        with open(path, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                raw = row.get("recipients_json", "[]") or "[]"
                try:
                    recipients = json.loads(raw)
                except Exception:
                    continue
                for r in recipients:
                    name = (r.get("name") or "").strip()
                    if not name:
                        continue
                    raw_unique.add(normalise_name(name))
                    split_unique.update(split_ensemble(name))
    return raw_unique, split_unique


# ── Lookup loop ────────────────────────────────────────────────────────────

def fmt_eta(remaining, per_burst, burst_pause, gap):
    """Estimate seconds remaining given inter-request gap and burst pauses."""
    bursts = remaining // per_burst
    return remaining * gap + bursts * burst_pause


def run_lookups(names_to_lookup, cache, api_key):
    total = len(names_to_lookup)
    resolved = 0
    unresolved = 0
    in_burst = 0
    t0 = time.time()
    for i, name in enumerate(names_to_lookup, 1):
        result = search_person(name, api_key)
        cache[name] = result
        if result:
            resolved += 1
        else:
            unresolved += 1

        in_burst += 1
        if in_burst >= REQUESTS_PER_BURST:
            time.sleep(BURST_PAUSE)
            in_burst = 0
        else:
            time.sleep(INTER_REQUEST_GAP)

        if i % CHECKPOINT_EVERY == 0 or i == total:
            save_cache(cache)
            eta = fmt_eta(total - i, REQUESTS_PER_BURST, BURST_PAUSE, INTER_REQUEST_GAP)
            mins = int(eta // 60)
            print(
                f"[{i}/{total}] resolved={resolved} unresolved={unresolved} "
                f"elapsed={int(time.time()-t0)}s ETA~{mins}min"
            )
    return resolved, unresolved


# ── CSV write-back ─────────────────────────────────────────────────────────

def rewrite_csvs(cache):
    """For each scraped CSV, expand ensembles in recipients_json and fill
    tmdb_person_id + profile_path from cache. Atomically replace the file."""
    files_touched = 0
    slots_updated = 0
    for path in csv_paths():
        path_p = Path(path)
        with open(path_p, encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            rows = list(reader)
        if not fieldnames or "recipients_json" not in fieldnames:
            continue

        changed = False
        for row in rows:
            raw = row.get("recipients_json", "[]") or "[]"
            try:
                recipients = json.loads(raw)
            except Exception:
                continue
            if not isinstance(recipients, list):
                continue

            new_list = []
            for r in recipients:
                base = r if isinstance(r, dict) else {}
                names = split_ensemble(base.get("name", ""))
                if not names:
                    new_list.append(base)
                    continue
                for nm in names:
                    entry = dict(base)
                    entry["name"] = nm
                    cached = cache.get(nm)
                    if cached and cached.get("id"):
                        if entry.get("tmdb_person_id") != cached["id"]:
                            slots_updated += 1
                        entry["tmdb_person_id"] = cached["id"]
                        if cached.get("profile_path"):
                            entry["profile_path"] = cached["profile_path"]
                    elif nm in cache and cached is None:
                        # Cache says no TMDB id for this name — actively
                        # clear any stale id/portrait so re-runs are idempotent
                        # across cache patches (e.g. band/film misattributions).
                        if entry.get("tmdb_person_id") is not None:
                            entry["tmdb_person_id"] = None
                            entry["profile_path"] = None
                            slots_updated += 1
                    new_list.append(entry)

            new_json = json.dumps(new_list, ensure_ascii=False)
            if new_json != raw:
                row["recipients_json"] = new_json
                changed = True

        if not changed:
            continue
        files_touched += 1
        tmp = path_p.with_suffix(path_p.suffix + ".tmp")
        with open(tmp, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        os.replace(tmp, path_p)
    return files_touched, slots_updated


# ── Post-run audits ────────────────────────────────────────────────────────

def write_unresolved_log(cache):
    unresolved = sorted(n for n, v in cache.items() if v is None)
    UNRESOLVED_LOG.parent.mkdir(parents=True, exist_ok=True)
    UNRESOLVED_LOG.write_text("\n".join(unresolved) + ("\n" if unresolved else ""), encoding="utf-8")
    return len(unresolved)


def write_collisions_log(cache):
    id_to_names = defaultdict(list)
    for name, v in cache.items():
        if v and v.get("id"):
            id_to_names[v["id"]].append(name)
    collisions = {tid: names for tid, names in id_to_names.items() if len(names) > 1}
    lines = []
    for tid, names in sorted(collisions.items()):
        lines.append(f"TMDB {tid}: " + " | ".join(sorted(names)))
    COLLISIONS_LOG.parent.mkdir(parents=True, exist_ok=True)
    COLLISIONS_LOG.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    return len(collisions)


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="count names only; no API calls or CSV writes")
    args = ap.parse_args()

    cache = load_cache()
    print(f"[cache] starting size: {len(cache)}")

    raw_unique, split_unique = collect_unique_names()
    print(f"[scan] unique raw names: {len(raw_unique)}")
    print(f"[scan] unique names after split_ensemble: {len(split_unique)}")

    needs_lookup = sorted(n for n in split_unique if n not in cache)
    print(f"[plan] already cached (hit or null): {len(split_unique) - len(needs_lookup)}")
    print(f"[plan] needs fresh lookup: {len(needs_lookup)}")

    if args.dry_run:
        bursts = len(needs_lookup) // REQUESTS_PER_BURST
        eta = len(needs_lookup) * INTER_REQUEST_GAP + bursts * BURST_PAUSE
        print(f"[plan] estimated wall-clock: ~{int(eta/60)} min ({int(eta)}s)")
        print("\nDRY-RUN — no API calls made, no CSVs written.")
        return

    api_key = load_api_key()
    if needs_lookup:
        print(f"[run] starting {len(needs_lookup)} TMDB lookups…")
        resolved, unresolved = run_lookups(needs_lookup, cache, api_key)
        print(f"[run] lookups complete: resolved={resolved} unresolved={unresolved}")
    else:
        print("[run] nothing to look up — cache covers every name.")

    save_cache(cache)
    print(f"[cache] saved to {NEW_CACHE} ({len(cache)} entries)")

    print("[csv] rewriting recipients_json with resolved ids + profile_path…")
    files_touched, slots_updated = rewrite_csvs(cache)
    print(f"[csv] touched {files_touched} files, updated {slots_updated} recipient slots")

    unresolved_n = write_unresolved_log(cache)
    collisions_n = write_collisions_log(cache)
    print(f"[log] unresolved: {unresolved_n} → {UNRESOLVED_LOG}")
    print(f"[log] collisions: {collisions_n} → {COLLISIONS_LOG}")

    resolved_n = sum(1 for v in cache.values() if v and v.get("id"))
    total_n = len(cache)
    pct = (resolved_n / total_n * 100) if total_n else 0
    print()
    print("=== Person TMDB Resolution Complete ===")
    print(f"Cache total: {total_n}  resolved: {resolved_n} ({pct:.1f}%)  unresolved: {unresolved_n}")
    print(f"CSV files touched: {files_touched}, recipient slots updated: {slots_updated}")


if __name__ == "__main__":
    main()
