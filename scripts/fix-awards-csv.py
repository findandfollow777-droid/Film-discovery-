# scripts/fix-awards-csv.py
# Phase 1 data quality fix for awards-sample.csv
# Run from project root: python3 scripts/fix-awards-csv.py

import csv
import io
from collections import defaultdict

INPUT  = 'data/awards-sample.csv'
OUTPUT = 'data/awards-sample.csv'          # overwrite in place
BACKUP = 'data/awards-sample_backup_phase1.csv'

# ── 1. Read raw file ──────────────────────────────────────────────────────────
with open(INPUT, encoding='utf-8') as f:
    raw = f.read()

lines = raw.splitlines()
header = lines[0]
data_lines = lines[1:]

print(f'Raw rows (excl header): {len(data_lines)}')

# ── 2. Back up original ───────────────────────────────────────────────────────
with open(BACKUP, 'w', encoding='utf-8') as f:
    f.write(raw)
print(f'Backup saved: {BACKUP}')

# ── 3. Strip garbage header rows ──────────────────────────────────────────────
# Remove any row that is literally the header repeated, or the literal string
# "festival,category,year" appearing as data
garbage = {
    'tmdb_id,title,year,festival,category,won',
    'festival,category,year',
    '',
}
cleaned = [l for l in data_lines if l.strip().strip('"') not in garbage]
removed_garbage = len(data_lines) - len(cleaned)
print(f'After stripping garbage rows: {len(cleaned)} (removed {removed_garbage})')

# ── 4. Deduplicate exact rows ─────────────────────────────────────────────────
seen = set()
deduped = []
for line in cleaned:
    key = line.strip()
    if key not in seen:
        seen.add(key)
        deduped.append(line)
removed_dupes = len(cleaned) - len(deduped)
print(f'After dedup: {len(deduped)} (removed {removed_dupes} duplicates)')

# ── 5. Investigate Cannes 2024 Palme d'Or ────────────────────────────────────
cannes_2024 = [l for l in deduped if 'Cannes' in l and '2024' in l and "Palme" in l]
print(f"\nCannes 2024 Palme d'Or after dedup: {len(cannes_2024)} entries")
for l in cannes_2024:
    print(f'  {l}')

# ── 6. Fix Oscar 2025 — mark winners ─────────────────────────────────────────
# 97th Academy Awards (March 2, 2025)
# Best Picture: Anora
# Best Director: Anora (Sean Baker)
# Best Actor: The Brutalist (Adrien Brody)
# Best Actress: The Substance (Demi Moore) — may not be in data
oscar_2025_winners = {
    ('Oscar', '2025', 'Best Picture', 'Anora'),
    ('Oscar', '2025', 'Best Director', 'Anora'),
    ('Oscar', '2025', 'Best Actor', 'The Brutalist'),
    ('Oscar', '2025', 'Best Actress', 'The Substance'),
}

fixed = []
oscar_2025_wins_applied = 0
for line in deduped:
    parts = line.split(',')
    if len(parts) >= 6:
        tmdb_id, title, year, festival, category = parts[0], parts[1], parts[2], parts[3], parts[4]
        won = parts[5].strip()
        key = (festival, year, category, title)
        if key in oscar_2025_winners and won.lower() == 'false':
            parts[5] = 'true'
            line = ','.join(parts)
            oscar_2025_wins_applied += 1
    fixed.append(line)

print(f'\nOscar 2025 winners marked: {oscar_2025_wins_applied}')

# Show Oscar 2025 state after fix
print('\nOscar 2025 entries after fix:')
for l in fixed:
    if ',2025,Oscar,' in l:
        print(f'  {l}')

# ── 7. Write output ───────────────────────────────────────────────────────────
with open(OUTPUT, 'w', encoding='utf-8', newline='') as f:
    f.write(header + '\n')
    for line in fixed:
        f.write(line + '\n')

print(f'\nDone. Final row count: {len(fixed)}')
print(f'Output written to: {OUTPUT}')

# ── 8. Final audit summary ────────────────────────────────────────────────────
print('\n=== FINAL AUDIT ===')
counts = defaultdict(lambda: {'total': 0, 'winners': 0})
for line in fixed:
    parts = line.split(',')
    if len(parts) >= 6:
        festival, year, category = parts[3], parts[2], parts[4]
        won = parts[5].strip().lower()
        key = f'{festival}|{category}|{year}'
        counts[key]['total'] += 1
        if won == 'true':
            counts[key]['winners'] += 1

# Categories with 0 or >1 winners
remaining_issues = [(k, v) for k, v in counts.items() if v['winners'] != 1]
print(f'Categories with != 1 winner: {len(remaining_issues)}')
for k, v in sorted(remaining_issues)[:30]:
    print(f'  {k}: {v["winners"]} winners / {v["total"]} total')
if len(remaining_issues) > 30:
    print(f'  ... and {len(remaining_issues) - 30} more')
