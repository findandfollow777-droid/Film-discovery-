#!/usr/bin/env python3
"""
ORBIT — Jury Festival Poster Backfill (Cannes / Venice / Berlin)
================================================================
One-time, resolve-once-store backfill. The jury festivals carry a
`film_tmdb_id` for every film but `film_poster_path: null` — compile-v1.py
(load_group_b, line ~168) unconditionally nulls posters for Group B because the
jury scrapers emit no poster column. The Academy festivals' posters came from
the TMDB resolver and are stored as bare paths ("/abc.jpg").

This script fills `film_poster_path` on the three jury JSONs:
  1. Build {tmdb_id: poster_path} from the existing resolver cache
     (data/tmdb-film-cache.json) — ~614/620 unique jury ids are already there.
  2. For every award row with a film_tmdb_id and a null poster, set the cached
     path. Existing non-null posters are NEVER overwritten (idempotent).
  3. The handful of cache-misses are fetched live via TMDB /movie/{id}, using
     the project's config.js API-key convention and the resolver's throttle.
  4. The one Berlin row with no tmdb_id is left null (known unresolvable gap).

Run from the project root:
    python3 scripts/backfill-jury-posters.py

NOTE (follow-up, not part of this task): compile-v1.py:168 will re-null jury
posters on any future FULL recompile. This backfill writes downstream of
compile, so it must be re-run after a recompile until line 168 is fixed
separately. That permanent fix is a distinct later task.
"""

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_FILE  = PROJECT_ROOT / "config.js"
DATA_DIR     = PROJECT_ROOT / "data"
CACHE_FILE   = DATA_DIR / "tmdb-film-cache.json"
JURY_FESTIVALS = ["cannes", "venice", "berlin"]

BASE_URL = "https://api.themoviedb.org/3"

# Throttle constants — mirror scripts/resolve-film-tmdb-ids.py (TMDB ~40 req/10s).
REQUESTS_PER_BURST = 38
BURST_PAUSE        = 10.5
INTER_REQUEST_GAP  = 0.12


# ── API key (same convention as resolve-film-tmdb-ids.py:load_api_key) ──────────
def load_api_key() -> str:
    if not CONFIG_FILE.exists():
        sys.exit(f"FATAL: {CONFIG_FILE} not found")
    text = CONFIG_FILE.read_text(encoding="utf-8")
    m = re.search(r"TMDB_API_KEY\s*=\s*['\"]([^'\"]+)['\"]", text)
    if m:
        return m.group(1)
    m = re.search(r"['\"]([a-f0-9]{32})['\"]", text)
    if m:
        return m.group(1)
    sys.exit("FATAL: no TMDB API key found in config.js")


# ── Cache → {tmdb_id: poster_path} ──────────────────────────────────────────────
def build_id_poster_map() -> dict:
    cache = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    id_to_poster = {}
    for entry in cache.values():
        if not isinstance(entry, dict):
            continue
        tid = entry.get("tmdb_id")
        poster = entry.get("poster_path")
        if tid and poster:                       # both present + non-null
            id_to_poster.setdefault(tid, poster)  # first-wins (posters per id are identical)
    return id_to_poster


# ── Live TMDB /movie/{id} for the cache-misses ─────────────────────────────────
_request_count = 0

def fetch_poster_live(tmdb_id: int, api_key: str):
    """Return poster_path ('/abc.jpg') or None. Throttled like the resolver."""
    global _request_count
    params = urllib.parse.urlencode({"api_key": api_key})
    url = f"{BASE_URL}/movie/{tmdb_id}?{params}"
    try:
        time.sleep(INTER_REQUEST_GAP)
        _request_count += 1
        if _request_count % REQUESTS_PER_BURST == 0:
            print(f"    ⏸  burst limit — sleeping {BURST_PAUSE}s")
            time.sleep(BURST_PAUSE)
        with urllib.request.urlopen(url, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data.get("poster_path") or None
    except Exception as e:
        print(f"    ✗ live lookup failed for id={tmdb_id}: {e}")
        return None


def backfill_festival(slug: str, id_to_poster: dict, api_key: str) -> dict:
    path = DATA_DIR / f"awards-v1-{slug}.json"
    original = path.read_text(encoding="utf-8")
    data = json.loads(original)
    awards = data.get("awards", [])

    total = len(awards)
    from_cache = from_live = already = no_id = still_null = 0
    misses = []   # (award_row, tmdb_id) needing a live call

    for a in awards:
        tid = a.get("film_tmdb_id")
        if not tid:
            no_id += 1
            continue
        if a.get("film_poster_path"):     # never overwrite an existing poster
            already += 1
            continue
        poster = id_to_poster.get(tid)
        if poster:
            a["film_poster_path"] = poster
            from_cache += 1
        else:
            misses.append((a, tid))

    # Live lookups for cache-misses (dedupe by id so repeated films cost one call).
    if misses:
        unique_miss_ids = sorted({tid for _, tid in misses})
        print(f"  {slug}: {len(misses)} rows ({len(unique_miss_ids)} unique ids) not in cache → live TMDB /movie/{{id}}")
        live_map = {}
        for tid in unique_miss_ids:
            live_map[tid] = fetch_poster_live(tid, api_key)
        for a, tid in misses:
            poster = live_map.get(tid)
            if poster:
                a["film_poster_path"] = poster
                from_live += 1
            else:
                still_null += 1

    # Write back only if something changed — byte-identical formatting (clean diff).
    changed = from_cache + from_live
    if changed:
        out = json.dumps(data, indent=2, ensure_ascii=False)   # no trailing newline (matches originals)
        path.write_text(out, encoding="utf-8")

    return {
        "total": total, "from_cache": from_cache, "from_live": from_live,
        "already": already, "no_id": no_id, "still_null": still_null,
        "written": bool(changed),
    }


def main():
    print("ORBIT — Jury Festival Poster Backfill")
    print("=" * 44)
    if not CACHE_FILE.exists():
        sys.exit(f"FATAL: {CACHE_FILE} not found")

    id_to_poster = build_id_poster_map()
    print(f"Cache map: {len(id_to_poster):,} unique tmdb_id → poster_path entries\n")

    # API key only loaded if/when a live call is actually needed (lazy).
    api_key = None
    results = {}
    for slug in JURY_FESTIVALS:
        # Peek whether this festival will need live calls, to load the key once.
        if api_key is None:
            data = json.loads((DATA_DIR / f"awards-v1-{slug}.json").read_text(encoding="utf-8"))
            needs_live = any(
                a.get("film_tmdb_id") and not a.get("film_poster_path")
                and a["film_tmdb_id"] not in id_to_poster
                for a in data.get("awards", [])
            )
            if needs_live:
                api_key = load_api_key()
                print(f"API key loaded (last 4: ...{api_key[-4:]})\n")
        results[slug] = backfill_festival(slug, id_to_poster, api_key)

    print("\n=== Summary ===")
    for slug in JURY_FESTIVALS:
        r = results[slug]
        print(f"{slug:7} total={r['total']:4}  cache={r['from_cache']:4}  "
              f"live={r['from_live']:3}  already={r['already']:4}  "
              f"no_id={r['no_id']:2}  null={r['still_null']:3}  written={r['written']}")
    print("\nDone. (Idempotent: re-running skips already-filled rows.)")
    print("NOTE: compile-v1.py:168 re-nulls jury posters on a full recompile — "
          "re-run this backfill afterwards, or fix line 168 separately (later task).")


if __name__ == "__main__":
    main()
