#!/usr/bin/env python3
"""
Generate PERSON_AWARD_LOOKUP entries from enriched CSVs
and merge into data/awards-data.js + data/person-awards-consolidated.csv
"""
import csv
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENRICHED_DIR = os.path.join(ROOT, 'enriched')
AWARDS_DATA_PATH = os.path.join(ROOT, 'data', 'awards-data.js')
CONSOLIDATED_PATH = os.path.join(ROOT, 'data', 'person-awards-consolidated.csv')

# Festival name mapping: CSV value → JS key prefix
FESTIVAL_MAP = {
    'BAFTA': 'BAFTA',
    'Golden Globe': 'GoldenGlobe',
    'Golden Globes': 'GoldenGlobe',
    'Cannes': 'Cannes',
    'Venice': 'Venice',
    'Berlin': 'Berlin',
    'Oscar': 'Oscar',
    'Academy Awards': 'Oscar',
}

# ── Read all enriched CSVs ──
csv_files = sorted(f for f in os.listdir(ENRICHED_DIR) if f.endswith('.csv'))

total_processed = 0
skipped_no_id = 0
unmapped_festivals = set()

new_entries = {}       # key → { person_name, person_id }
new_consolidated = []  # list of dicts for CSV append

for filename in csv_files:
    filepath = os.path.join(ENRICHED_DIR, filename)
    with open(filepath, encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        fields = reader.fieldnames or []
        if 'tmdb_id' not in fields or 'nominee' not in fields or 'movie_title' not in fields:
            print(f'SKIP (bad header): {filename}')
            continue

        for row in reader:
            total_processed += 1
            tmdb_id = (row.get('tmdb_id') or '').strip()
            nominee = (row.get('nominee') or '').strip()
            year = (row.get('year') or '').strip()
            festival = (row.get('festival') or '').strip()
            category = (row.get('category') or '').strip()
            won = (row.get('won') or '').strip()
            movie_title = (row.get('movie_title') or '').strip()

            # Normalize float IDs like "33657.0" → "33657"
            try:
                tmdb_id = str(int(float(tmdb_id))) if tmdb_id else ''
            except ValueError:
                tmdb_id = ''

            # Skip invalid
            if not tmdb_id or tmdb_id == '0' or not nominee or not movie_title:
                skipped_no_id += 1
                continue

            # Map festival
            mapped = FESTIVAL_MAP.get(festival)
            if not mapped:
                unmapped_festivals.add(festival)
                continue

            key = f'{mapped}|{category}|{year}|{movie_title.lower()}'
            if key not in new_entries:
                new_entries[key] = {
                    'person_name': nominee,
                    'person_id': int(float(tmdb_id)),
                }

            # Also collect for consolidated CSV
            new_consolidated.append({
                'tmdb_id': tmdb_id,
                'nominee': nominee,
                'year': year,
                'festival': festival,
                'category': category,
                'won': won,
                'movie_title': movie_title,
            })

print(f'\nEnriched CSVs processed: {len(csv_files)} files, {total_processed} data rows')

# ── Load existing PERSON_AWARD_LOOKUP keys ──
with open(AWARDS_DATA_PATH, encoding='utf-8') as f:
    awards_data = f.read()

lookup_start = awards_data.find('const PERSON_AWARD_LOOKUP = {')
if lookup_start < 0:
    print('ERROR: Could not find PERSON_AWARD_LOOKUP in awards-data.js')
    exit(1)

lookup_block = awards_data[lookup_start:]
existing_keys = set()
for m in re.finditer(r'^\s+"([^"]+)":\s+\{', lookup_block, re.MULTILINE):
    existing_keys.add(m.group(1))

print(f'Existing PERSON_AWARD_LOOKUP keys: {len(existing_keys)}')

# ── Filter to new-only entries ──
entries_to_add = []
skipped_existing = 0

for key, val in new_entries.items():
    if key in existing_keys:
        skipped_existing += 1
    else:
        entries_to_add.append((key, val))

# Sort alphabetically by key
entries_to_add.sort(key=lambda x: x[0])

print(f'New entries to add: {len(entries_to_add)}')
print(f'Skipped (already existed): {skipped_existing}')
print(f'Skipped (tmdb_id=0 or empty): {skipped_no_id}')

if unmapped_festivals:
    print(f'Unmapped festival names: {", ".join(sorted(unmapped_festivals))}')
else:
    print('Unmapped festival names: none')

# ── Insert into awards-data.js ──
if entries_to_add:
    # Find closing `};` of PERSON_AWARD_LOOKUP before the enrich function
    enrich_marker = '// ── Enrich awards database with person data ──'
    enrich_idx = awards_data.find(enrich_marker)

    if enrich_idx < 0:
        print('ERROR: Could not find enrich function marker')
        exit(1)

    closing_idx = awards_data.rfind('};', lookup_start, enrich_idx)
    if closing_idx < 0:
        print('ERROR: Could not find closing }; of PERSON_AWARD_LOOKUP')
        exit(1)

    # Build new lines
    new_lines = []
    for key, val in entries_to_add:
        escaped_name = val['person_name'].replace('\\', '\\\\').replace('"', '\\"')
        new_lines.append(f'  "{key}": {{ person_name: "{escaped_name}", person_id: {val["person_id"]} }},')

    insert_text = '\n'.join(new_lines) + '\n'

    updated = awards_data[:closing_idx] + insert_text + awards_data[closing_idx:]
    with open(AWARDS_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(updated)
    print(f'\nWrote {len(entries_to_add)} new entries into PERSON_AWARD_LOOKUP in awards-data.js')
else:
    print('\nNo new entries to add to awards-data.js')

# ── Append to person-awards-consolidated.csv ──
with open(CONSOLIDATED_PATH, encoding='utf-8', errors='replace') as f:
    consolidated_content = f.read()

consolidated_lines = [l for l in consolidated_content.split('\n') if l.strip()]

# Build set of existing rows: tmdb_id|festival|category|year|movie_title
existing_consolidated = set()
for line in consolidated_lines[1:]:  # skip header
    parts = line.split(',')
    if len(parts) >= 7:
        dedup_key = f'{parts[0]}|{parts[3]}|{parts[4]}|{parts[2]}|{parts[6]}'
        existing_consolidated.add(dedup_key)

appended_rows = 0
rows_to_append = []

for row in new_consolidated:
    dedup_key = f'{row["tmdb_id"]}|{row["festival"]}|{row["category"]}|{row["year"]}|{row["movie_title"]}'
    if dedup_key not in existing_consolidated:
        existing_consolidated.add(dedup_key)  # prevent dupes within batch
        won_val = 'true' if row['won'].strip().upper() == 'TRUE' else 'false'
        rows_to_append.append(
            f'{row["tmdb_id"]},{row["nominee"]},{row["year"]},{row["festival"]},{row["category"]},{won_val},{row["movie_title"]}'
        )
        appended_rows += 1

if rows_to_append:
    needs_newline = not consolidated_content.endswith('\n')
    append_text = ('\n' if needs_newline else '') + '\n'.join(rows_to_append) + '\n'
    with open(CONSOLIDATED_PATH, 'a', encoding='utf-8') as f:
        f.write(append_text)

print(f'Rows appended to person-awards-consolidated.csv: {appended_rows}')
print('\nDone.')
