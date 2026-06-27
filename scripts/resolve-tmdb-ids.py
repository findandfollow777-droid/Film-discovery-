# scripts/resolve-tmdb-ids.py
# Resolves tmdb_id = 0 entries for 2025/2026 films via TMDB search API
# Run from project root: python3 scripts/resolve-tmdb-ids.py

import urllib.request
import urllib.parse
import json
import time
import re

# ── Config ────────────────────────────────────────────────────────────────────
with open('config.js', 'r') as f:
    config_text = f.read()
api_key_match = re.search(r'["\']([a-f0-9]{32})["\']', config_text)
if not api_key_match:
    raise Exception('Could not find TMDB API key in config.js')
API_KEY = api_key_match.group(1)
print(f'API key found: {API_KEY[:8]}...')

INPUT = 'data/awards-sample.csv'
BACKUP = 'data/awards-sample_backup_pre_tmdb.csv'

# ── Read CSV ──────────────────────────────────────────────────────────────────
with open(INPUT, encoding='utf-8') as f:
    lines = f.readlines()

header = lines[0]
data_lines = lines[1:]

# ── Find titles needing resolution ───────────────────────────────────────────
needs_resolution = {}
for line in data_lines:
    parts = line.strip().split(',')
    if len(parts) < 6:
        continue
    tmdb_id, title, year = parts[0].strip(), parts[1].strip(), parts[2].strip()
    if tmdb_id == '0' and year in ('2025', '2026'):
        if title not in needs_resolution:
            needs_resolution[title] = None

print(f'\nTitles needing TMDB ID resolution ({len(needs_resolution)}):')
for t in sorted(needs_resolution):
    print(f'  {t}')

# ── TMDB search function ──────────────────────────────────────────────────────
def search_tmdb(title):
    encoded = urllib.parse.quote(title)
    url = f'https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={encoded}&language=en-US&page=1'
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
        results = data.get('results', [])
        if results:
            top = results[0]
            return top['id'], top['title'], top.get('release_date', '')[:4]
        return None, None, None
    except Exception as e:
        print(f'  ERROR searching "{title}": {e}')
        return None, None, None

# ── Resolve each title ────────────────────────────────────────────────────────
print('\nResolving via TMDB API...')
resolved = {}
for title in sorted(needs_resolution):
    tmdb_id, found_title, found_year = search_tmdb(title)
    if tmdb_id:
        resolved[title] = tmdb_id
        print(f'  OK  "{title}" -> {tmdb_id} ("{found_title}", {found_year})')
    else:
        resolved[title] = 0
        print(f'  --  "{title}" -> not found, keeping 0')
    time.sleep(0.3)  # respect rate limit

# ── Back up then update CSV ───────────────────────────────────────────────────
with open(BACKUP, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f'\nBackup saved: {BACKUP}')

updated_lines = []
changes = 0
for line in data_lines:
    parts = line.strip().split(',')
    if len(parts) >= 6:
        tmdb_id, title, year = parts[0].strip(), parts[1].strip(), parts[2].strip()
        if tmdb_id == '0' and year in ('2025', '2026') and title in resolved and resolved[title] != 0:
            new_id = str(resolved[title])
            # Replace leading 0, with new_id, — only the first occurrence
            line = line.replace(f'0,{title},', f'{new_id},{title},', 1)
            changes += 1
    updated_lines.append(line)

with open(INPUT, 'w', encoding='utf-8') as f:
    f.write(header)
    f.writelines(updated_lines)

# ── Summary ───────────────────────────────────────────────────────────────────
print(f'\nDone.')
print(f'  Rows updated: {changes}')
print(f'  Titles still at 0: {sum(1 for v in resolved.values() if v == 0)}')
print('\nFull resolution list — verify these matches:')
for title, tmdb_id in sorted(resolved.items()):
    status = 'OK' if tmdb_id != 0 else 'UNRESOLVED'
    print(f'  [{status}] {title} -> {tmdb_id}')
