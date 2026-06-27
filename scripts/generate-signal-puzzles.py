#!/usr/bin/env python3
"""
SIGNAL — Daily puzzle dataset generator
Pulls 364 movies from TMDB matching:
  vote_average ≥ 7.0  (quality)
  vote_count   ≥ 1500 (recognizability)
  primary_release_date 1990-01-01 → 2024-12-31
  original language = en
  ≥ 5 billed cast (verified per-movie)
Output: games/signal-puzzles.js  (window.SIGNAL_PUZZLES = [...])

Run: TMDB_API_KEY=xxx python3 scripts/generate-signal-puzzles.py
"""

import os
import sys
import time
import json
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

KEY = os.environ.get('TMDB_API_KEY')
if not KEY:
    print('TMDB_API_KEY env var required', file=sys.stderr)
    sys.exit(1)

BASE = 'https://api.themoviedb.org/3'
TARGET = 364
MAX_DISCOVER_PAGES = 30          # 30 × 20 = 600 candidates
THROTTLE_S = 0.27                # ≈3.7 req/s, well under 40/10s ceiling


def tmdb(endpoint, params=None):
    params = dict(params or {})
    params['api_key'] = KEY
    url = f"{BASE}{endpoint}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.load(r)


def discover_page(page):
    return tmdb('/discover/movie', {
        'vote_average.gte': 7.0,
        'vote_count.gte': 1500,
        'primary_release_date.gte': '1990-01-01',
        'primary_release_date.lte': '2024-12-31',
        'with_original_language': 'en',
        'sort_by': 'popularity.desc',
        'page': page,
    })


def verify_cast(movie_id):
    data = tmdb(f'/movie/{movie_id}', {'append_to_response': 'credits'})
    cast = (data.get('credits') or {}).get('cast') or []
    return data if len(cast) >= 5 else None


def main():
    print('[signal-gen] discovering candidates…')
    candidates = []
    for page in range(1, MAX_DISCOVER_PAGES + 1):
        try:
            j = discover_page(page)
            candidates.extend(j.get('results') or [])
            sys.stdout.write(f"  page {page}/{MAX_DISCOVER_PAGES} ({len(candidates)} so far)\r")
            sys.stdout.flush()
            if page >= j.get('total_pages', 0):
                break
            time.sleep(THROTTLE_S)
        except Exception as e:
            print(f"\n[signal-gen] discover page {page} failed: {e}", file=sys.stderr)
    print(f"\n[signal-gen] {len(candidates)} discover candidates")

    seen = set()
    unique = []
    for m in candidates:
        if m['id'] in seen:
            continue
        seen.add(m['id'])
        unique.append(m)

    print('[signal-gen] verifying cast counts…')
    kept = []
    for i, cand in enumerate(unique):
        if len(kept) >= TARGET:
            break
        try:
            movie = verify_cast(cand['id'])
            if movie:
                kept.append({
                    'id': movie['id'],
                    'title': movie['title'],
                    'year': (movie.get('release_date') or '')[:4],
                    'rating': f"{movie['vote_average']:.1f}",
                    'votes': movie['vote_count'],
                })
                sys.stdout.write(f"  kept {len(kept)}/{TARGET} (checked {i + 1})\r")
                sys.stdout.flush()
            time.sleep(THROTTLE_S)
        except Exception as e:
            print(f"\n[signal-gen] verify {cand['id']} ({cand.get('title')}) failed: {e}",
                  file=sys.stderr)

    print(f"\n[signal-gen] kept {len(kept)} movies after verification")

    if len(kept) < TARGET:
        print(f"[signal-gen] WARNING: only {len(kept)}/{TARGET} — relax filters or raise MAX_DISCOVER_PAGES",
              file=sys.stderr)

    # Knuth-multiplicative shuffle key spreads the popularity-ranked list
    # across the year so day-to-day rotation feels varied, not "famous → obscure".
    KNUTH = 2654435761
    final = sorted(kept[:TARGET], key=lambda m: (m['id'] * KNUTH) & 0xFFFFFFFF)

    today = date.today().isoformat()
    body_lines = [
        f"  {m['id']}, // {m['title']} ({m['year']}) — {m['rating']}★, {m['votes']} votes"
        for m in final
    ]

    out = (
        '/* ============================================================\n'
        f'   SIGNAL — Daily puzzle dataset\n'
        f'   Auto-generated {today} by scripts/generate-signal-puzzles.py\n'
        f'   {len(final)} movies. Filters: vote_avg≥7.0, votes≥1500,\n'
        '   1990-2024, English, ≥5 billed cast. Order is a deterministic\n'
        '   Knuth-multiplicative shuffle of the popularity-ranked list so\n'
        '   the daily rotation feels varied rather than "famous → obscure".\n'
        '   ============================================================ */\n'
        '\n'
        "'use strict';\n"
        '\n'
        'window.SIGNAL_PUZZLES = [\n'
        + '\n'.join(body_lines) + '\n'
        '];\n'
        '\n'
        "if (typeof module !== 'undefined' && module.exports) {\n"
        '  module.exports = window.SIGNAL_PUZZLES;\n'
        '}\n'
    )

    out_path = Path(__file__).resolve().parent.parent / 'games' / 'signal-puzzles.js'
    out_path.write_text(out, encoding='utf-8')
    print(f"[signal-gen] wrote {out_path} ({len(final)} movies)")


if __name__ == '__main__':
    main()
