#!/usr/bin/env node
/**
 * Generate PERSON_WINNERS_LOOKUP from data/person-awards-consolidated.csv.
 *
 * Why this exists:
 *   timeline.js needs to know which PERSON_AWARD_LOOKUP entries are wins so
 *   the bio-awards glyph can pick gold (.has-win) vs silver (.nom-only).
 *   The previous logic cross-referenced AWARDS_BROWSE_DATABASE, but that
 *   database only stores film-level awards for some festivals (e.g. Globe
 *   Best Comedy/Musical, Berlin Golden Bear). Actor categories at Globe,
 *   Cannes, Venice, and Berlin aren't there — so real wins were rendering
 *   silver. This index closes that gap by lifting the won=true rows from
 *   the consolidated CSV (which already has the boolean) into a parallel
 *   const keyed identically to PERSON_AWARD_LOOKUP.
 *
 * Schema:
 *   const PERSON_WINNERS_LOOKUP = {
 *     "GoldenGlobe|Best Actor (Drama)|1995|forrest gump": 1,
 *     ...
 *   };
 *
 * Idempotent — replaces any existing block on re-run.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONSOLIDATED_PATH = path.join(ROOT, 'data', 'person-awards-consolidated.csv');
const AWARDS_DATA_PATH = path.join(ROOT, 'data', 'awards-data.js');

// Festival mapping — superset of scripts/generate-person-lookup.js because the
// consolidated CSV includes legacy/variant spellings ("Academy Awards", "Golden
// Globes" plural) that the older enriched-CSV pipeline didn't see. Mirrors the
// festNormalise table in pages/timeline.js so PERSON_AWARD_LOOKUP keys
// normalised at runtime resolve to the same canonical festival used here.
const FESTIVAL_MAP = {
  'BAFTA':           'BAFTA',
  'Oscar':           'Oscar',
  'Academy Awards':  'Oscar',
  'AcademyAwards':   'Oscar',
  'Oscars':          'Oscar',
  'Golden Globe':    'GoldenGlobe',
  'Golden Globes':   'GoldenGlobe',
  'GoldenGlobes':    'GoldenGlobe',
  'Cannes':          'Cannes',
  'Venice':          'Venice',
  'Berlin':          'Berlin'
};

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// ── Read consolidated CSV ──
const content = fs.readFileSync(CONSOLIDATED_PATH, 'utf8');
const lines = content.split('\n').filter(l => l.trim());
if (lines.length < 2) {
  console.error('ERROR: consolidated CSV is empty or header-only');
  process.exit(1);
}

const header = parseCSVLine(lines[0]);
const idxNominee = header.indexOf('nominee');
const idxYear = header.indexOf('year');
const idxFestival = header.indexOf('festival');
const idxCategory = header.indexOf('category');
const idxWon = header.indexOf('won');
const idxMovie = header.indexOf('movie_title');

if ([idxNominee, idxYear, idxFestival, idxCategory, idxWon, idxMovie].some(i => i < 0)) {
  console.error(`ERROR: consolidated CSV header missing required columns. Got: ${header.join(',')}`);
  process.exit(1);
}

const winKeys = new Set();
let totalRows = 0;
let winRows = 0;
let skippedUnmapped = 0;
const unmappedFestivals = new Set();

for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  if (fields.length < header.length) continue;
  totalRows++;

  if ((fields[idxWon] || '').toLowerCase() !== 'true') continue;
  winRows++;

  const festival = fields[idxFestival];
  const mapped = FESTIVAL_MAP[festival];
  if (!mapped) {
    skippedUnmapped++;
    unmappedFestivals.add(festival);
    continue;
  }

  const category = fields[idxCategory];
  const year = fields[idxYear];
  const film = (fields[idxMovie] || '').toLowerCase();
  if (!category || !year || !film) continue;

  winKeys.add(`${mapped}|${category}|${year}|${film}`);
}

const sortedKeys = Array.from(winKeys).sort();

console.log(`Consolidated CSV rows: ${totalRows}`);
console.log(`Win rows (won=true): ${winRows}`);
console.log(`Unique win keys: ${sortedKeys.length}`);
console.log(`Skipped (unmapped festival): ${skippedUnmapped}`);
if (unmappedFestivals.size > 0) {
  console.log(`Unmapped festivals: ${Array.from(unmappedFestivals).join(', ')}`);
}

// ── Build the const block ──
const blockLines = ['const PERSON_WINNERS_LOOKUP = {'];
for (const key of sortedKeys) {
  // Escape any double-quotes in keys (rare, but defensive)
  const escaped = key.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  blockLines.push(`  "${escaped}": 1,`);
}
blockLines.push('};');
const newBlock = blockLines.join('\n');

// ── Splice into awards-data.js ──
const awardsContent = fs.readFileSync(AWARDS_DATA_PATH, 'utf8');

const beginMarker = 'const PERSON_WINNERS_LOOKUP = {';
const existingStart = awardsContent.indexOf(beginMarker);

let updated;
if (existingStart >= 0) {
  // Replace existing block — find the closing `};` after this point.
  const endRel = awardsContent.indexOf('\n};', existingStart);
  if (endRel < 0) {
    console.error('ERROR: found PERSON_WINNERS_LOOKUP start but no closing };');
    process.exit(1);
  }
  const endAbs = endRel + 3; // include the `\n};`
  updated = awardsContent.slice(0, existingStart) + newBlock + awardsContent.slice(endAbs);
  console.log('Replaced existing PERSON_WINNERS_LOOKUP block.');
} else {
  // Insert after PERSON_AWARD_LOOKUP closing `};`, before the enrichPersonData IIFE.
  const enrichMarker = '// ── Enrich awards database with person data ──';
  const enrichIdx = awardsContent.indexOf(enrichMarker);
  if (enrichIdx < 0) {
    console.error('ERROR: could not find "Enrich awards database" marker for insertion');
    process.exit(1);
  }
  const closingIdx = awardsContent.lastIndexOf('};', enrichIdx);
  if (closingIdx < 0) {
    console.error('ERROR: could not find closing }; of PERSON_AWARD_LOOKUP');
    process.exit(1);
  }
  const insertAfter = closingIdx + 2; // past `};`
  updated = awardsContent.slice(0, insertAfter)
    + '\n\n' + newBlock
    + awardsContent.slice(insertAfter);
  console.log('Inserted new PERSON_WINNERS_LOOKUP block after PERSON_AWARD_LOOKUP.');
}

fs.writeFileSync(AWARDS_DATA_PATH, updated, 'utf8');
console.log(`Wrote ${sortedKeys.length} entries into PERSON_WINNERS_LOOKUP in ${AWARDS_DATA_PATH}`);
