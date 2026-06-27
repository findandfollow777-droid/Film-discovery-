# scripts/add-2025-2026-festivals.py
# Add 2025/2026 festival winners to awards-sample.csv, then resolve TMDB IDs
# Run from project root: python3 scripts/add-2025-2026-festivals.py

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

INPUT = 'data/awards-sample.csv'
BACKUP = 'data/awards-sample_backup_phase2a.csv'

# ── Read CSV ──────────────────────────────────────────────────────────────────
with open(INPUT, encoding='utf-8') as f:
    raw = f.read()

lines = raw.splitlines()
header = lines[0]
data_lines = lines[1:]

# Back up
with open(BACKUP, 'w', encoding='utf-8') as f:
    f.write(raw)
print(f'Backup saved: {BACKUP}')
print(f'Starting row count: {len(data_lines)}')

# ── Build existing-entry index for dedup ──────────────────────────────────────
existing = set()
for line in data_lines:
    existing.add(line.strip())

# ── New rows to add ───────────────────────────────────────────────────────────
# Convention: film categories use film title; director/actor/actress use person name
# Golden Globe: Best Drama, Best Comedy/Musical = film title
#              Best Director, Best Actor (Drama), Best Actress (Drama) etc = person name
# BAFTA: Best Film = film title; Best Director, Best Actor, Best Actress = person name
# Berlin/Cannes/Venice: film title for all categories listed here

new_rows = [
    # Berlin 2025 (75th Berlinale)
    '0,Dreams (Sex Love),2025,Berlin,Golden Bear,true',
    '0,The Blue Trail,2025,Berlin,Silver Bear (Grand Jury),true',
    '0,Living the Land,2025,Berlin,Silver Bear (Director),true',

    # Cannes 2025 (78th)
    '0,It Was Just an Accident,2025,Cannes,Palme d\'Or,true',
    '0,Sentimental Value,2025,Cannes,Grand Prix,true',
    '0,The Secret Agent,2025,Cannes,Best Director,true',
    '0,Sound of Falling,2025,Cannes,Jury Prize,true',
    '0,Sirat,2025,Cannes,Jury Prize,true',

    # Venice 2025 (82nd)
    '0,Father Mother Sister Brother,2025,Venice,Golden Lion,true',
    '0,The Voice of Hind Rajab,2025,Venice,Silver Lion (Grand Jury),true',
    '0,The Smashing Machine,2025,Venice,Silver Lion (Director),true',

    # Golden Globe 2026 (83rd — January 11, 2026)
    # Best Drama/Comedy = film title; Best Director = person name; Best Actress = person name
    '0,Hamnet,2026,Golden Globe,Best Drama,true',
    '0,One Battle After Another,2026,Golden Globe,Best Comedy/Musical,true',
    '0,Brady Corbet,2026,Golden Globe,Best Director,true',
    '0,Jessie Buckley,2026,Golden Globe,Best Actress (Drama),true',

    # BAFTA 2026 (79th — February 22, 2026)
    # Best Film = film title; Best Director/Actor/Actress = person name
    '0,One Battle After Another,2026,BAFTA,Best Film,true',
    '0,Brady Corbet,2026,BAFTA,Best Director,true',
    '0,Robert Aramayo,2026,BAFTA,Best Actor,true',
    '0,Jessie Buckley,2026,BAFTA,Best Actress,true',
]

added = []
skipped = []
for row in new_rows:
    if row.strip() in existing:
        skipped.append(row)
    else:
        added.append(row)

print(f'\nRows already present (skipped): {len(skipped)}')
for r in skipped:
    print(f'  SKIP: {r}')

print(f'New rows to add: {len(added)}')
for r in added:
    print(f'  ADD:  {r}')

# Append new rows
data_lines.extend(added)

# ── TMDB ID resolution ────────────────────────────────────────────────────────
# Find film titles needing resolution (skip person-name rows)
person_name_categories = {
    'Best Director', 'Best Actor', 'Best Actress',
    'Best Actor (Drama)', 'Best Actress (Drama)',
    'Best Actor (Comedy/Musical)', 'Best Actress (Comedy/Musical)',
}

# Known IDs from previous resolution
known_ids = {
    'Hamnet': 858024,
    'One Battle After Another': 1054867,
}

titles_needing_ids = {}
for row in added:
    parts = row.split(',')
    if len(parts) < 6:
        continue
    tmdb_id, title, year, festival, category = parts[0], parts[1], parts[2], parts[3], parts[4]
    if tmdb_id == '0' and category not in person_name_categories:
        if title not in titles_needing_ids and title not in known_ids:
            titles_needing_ids[title] = None

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

print(f'\nResolving TMDB IDs for {len(titles_needing_ids)} new film titles...')
resolved = dict(known_ids)  # start with known
for title in sorted(titles_needing_ids):
    tmdb_id, found_title, found_year = search_tmdb(title)
    if tmdb_id:
        resolved[title] = tmdb_id
        print(f'  OK  "{title}" -> {tmdb_id} ("{found_title}", {found_year})')
    else:
        resolved[title] = 0
        print(f'  --  "{title}" -> not found, keeping 0')
    time.sleep(0.3)

print(f'\nPre-resolved (known IDs):')
for title in sorted(known_ids):
    print(f'  OK  "{title}" -> {known_ids[title]} (already known)')

# ── Apply IDs to all data lines ───────────────────────────────────────────────
final_lines = []
id_updates = 0
for line in data_lines:
    parts = line.split(',')
    if len(parts) >= 6:
        tmdb_id, title = parts[0].strip(), parts[1].strip()
        if tmdb_id == '0' and title in resolved and resolved[title] != 0:
            category = parts[4].strip()
            if category not in person_name_categories:
                line = line.replace(f'0,{title},', f'{resolved[title]},{title},', 1)
                id_updates += 1
    final_lines.append(line)

# ── Write output ──────────────────────────────────────────────────────────────
with open(INPUT, 'w', encoding='utf-8') as f:
    f.write(header + '\n')
    for line in final_lines:
        f.write(line.strip() + '\n')

# ── Summary ───────────────────────────────────────────────────────────────────
still_zero = sum(1 for row in added if row.split(',')[0] == '0'
                 and row.split(',')[4] not in person_name_categories
                 and row.split(',')[1] not in resolved)
# More accurate: count unresolved film titles
unresolved_films = [t for t, v in resolved.items() if v == 0]

print(f'\n=== SUMMARY ===')
print(f'Rows already present (skipped): {len(skipped)}')
print(f'New rows added: {len(added)}')
print(f'TMDB IDs resolved: {id_updates} rows updated')
print(f'Film titles still at ID 0: {len(unresolved_films)}')
for t in unresolved_films:
    print(f'  - {t}')
print(f'Final total row count: {len(final_lines)}')
