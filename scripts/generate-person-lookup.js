#!/usr/bin/env node
/**
 * Generate PERSON_AWARD_LOOKUP entries from enriched CSVs
 * and merge into data/awards-data.js + data/person-awards-consolidated.csv
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENRICHED_DIR = path.join(ROOT, 'enriched');
const AWARDS_DATA_PATH = path.join(ROOT, 'data', 'awards-data.js');
const CONSOLIDATED_PATH = path.join(ROOT, 'data', 'person-awards-consolidated.csv');

// Festival name mapping: CSV value → JS key prefix
const FESTIVAL_MAP = {
  'BAFTA': 'BAFTA',
  'Golden Globe': 'GoldenGlobe',
  'Cannes': 'Cannes',
  'Venice': 'Venice',
  'Berlin': 'Berlin',
  'Oscar': 'Oscar'
};

// ── Parse a CSV line, respecting quoted fields ──
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

// ── Read all enriched CSVs ──
const csvFiles = fs.readdirSync(ENRICHED_DIR).filter(f => f.endsWith('.csv'));

let totalProcessed = 0;
let skippedNoId = 0;
let unmappedFestivals = new Set();

// Collect all entries: { key, person_name, person_id, raw row fields }
const newEntries = new Map(); // key → { person_name, person_id }
const newConsolidatedRows = []; // raw CSV rows to potentially append

for (const file of csvFiles) {
  const content = fs.readFileSync(path.join(ENRICHED_DIR, file), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) continue;

  // Verify header
  const header = parseCSVLine(lines[0]);
  const idxId = header.indexOf('tmdb_id');
  const idxNominee = header.indexOf('nominee');
  const idxYear = header.indexOf('year');
  const idxFestival = header.indexOf('festival');
  const idxCategory = header.indexOf('category');
  const idxWon = header.indexOf('won');
  const idxMovie = header.indexOf('movie_title');

  if (idxId < 0 || idxNominee < 0 || idxYear < 0 || idxFestival < 0 || idxCategory < 0 || idxMovie < 0) {
    console.log(`SKIP (bad header): ${file}`);
    continue;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < header.length) continue;

    const tmdbId = fields[idxId];
    const nominee = fields[idxNominee];
    const year = fields[idxYear];
    const festival = fields[idxFestival];
    const category = fields[idxCategory];
    const won = fields[idxWon];
    const movieTitle = fields[idxMovie];

    totalProcessed++;

    // Skip invalid
    if (!tmdbId || tmdbId === '0' || !nominee || !movieTitle) {
      skippedNoId++;
      continue;
    }

    // Map festival
    const mapped = FESTIVAL_MAP[festival];
    if (!mapped) {
      unmappedFestivals.add(festival);
      continue;
    }

    const key = `${mapped}|${category}|${year}|${movieTitle.toLowerCase()}`;
    if (!newEntries.has(key)) {
      newEntries.set(key, { person_name: nominee, person_id: Number(tmdbId) });
    }

    // Also collect for consolidated CSV
    newConsolidatedRows.push({ tmdbId, nominee, year, festival, category, won, movieTitle });
  }
}

console.log(`\nEnriched CSVs processed: ${csvFiles.length} files, ${totalProcessed} data rows`);

// ── Load existing PERSON_AWARD_LOOKUP keys ──
const awardsDataContent = fs.readFileSync(AWARDS_DATA_PATH, 'utf8');

// Find the PERSON_AWARD_LOOKUP block and extract existing keys
const lookupStart = awardsDataContent.indexOf('const PERSON_AWARD_LOOKUP = {');
if (lookupStart < 0) {
  console.error('ERROR: Could not find PERSON_AWARD_LOOKUP in awards-data.js');
  process.exit(1);
}

const existingKeys = new Set();
const keyRegex = /^\s+"([^"]+)":\s+\{/gm;
// Only scan from PERSON_AWARD_LOOKUP start to its closing
const lookupBlock = awardsDataContent.slice(lookupStart);
let match;
while ((match = keyRegex.exec(lookupBlock)) !== null) {
  existingKeys.add(match[1]);
}

console.log(`Existing PERSON_AWARD_LOOKUP keys: ${existingKeys.size}`);

// ── Filter to new-only entries ──
const entriesToAdd = [];
let skippedExisting = 0;

for (const [key, val] of newEntries) {
  if (existingKeys.has(key)) {
    skippedExisting++;
  } else {
    entriesToAdd.push({ key, ...val });
  }
}

// Sort alphabetically by key
entriesToAdd.sort((a, b) => a.key.localeCompare(b.key));

console.log(`New entries to add: ${entriesToAdd.length}`);
console.log(`Skipped (already existed): ${skippedExisting}`);
console.log(`Skipped (tmdb_id=0 or empty): ${skippedNoId}`);

if (unmappedFestivals.size > 0) {
  console.log(`Unmapped festival names: ${Array.from(unmappedFestivals).join(', ')}`);
} else {
  console.log('Unmapped festival names: none');
}

// ── Insert into awards-data.js ──
if (entriesToAdd.length > 0) {
  // Find the closing `};` of PERSON_AWARD_LOOKUP
  // It's the `};` that comes after the lookup block, before the enrichPersonData IIFE
  const enrichFnMarker = '// ── Enrich awards database with person data ──';
  const enrichIdx = awardsDataContent.indexOf(enrichFnMarker);

  // The `};` closing PERSON_AWARD_LOOKUP is just before the enrich function
  // Search backwards from enrichFnMarker for `};`
  let closingIdx = -1;
  if (enrichIdx > 0) {
    closingIdx = awardsDataContent.lastIndexOf('};', enrichIdx);
  }

  if (closingIdx < 0) {
    console.error('ERROR: Could not find closing }; of PERSON_AWARD_LOOKUP');
    process.exit(1);
  }

  // Build the new lines
  const newLines = entriesToAdd.map(e => {
    const escapedName = e.person_name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `  "${e.key}": { person_name: "${escapedName}", person_id: ${e.person_id} },`;
  });

  const insertText = newLines.join('\n') + '\n';

  // Insert before the `};`
  const updated = awardsDataContent.slice(0, closingIdx) + insertText + awardsDataContent.slice(closingIdx);
  fs.writeFileSync(AWARDS_DATA_PATH, updated, 'utf8');
  console.log(`\nWrote ${entriesToAdd.length} new entries into PERSON_AWARD_LOOKUP in awards-data.js`);
} else {
  console.log('\nNo new entries to add to awards-data.js');
}

// ── Append to person-awards-consolidated.csv ──
const consolidatedContent = fs.readFileSync(CONSOLIDATED_PATH, 'utf8');
const consolidatedLines = consolidatedContent.split('\n').filter(l => l.trim());

// Build set of existing rows: tmdb_id|festival|category|year|movie_title
const existingConsolidated = new Set();
for (let i = 1; i < consolidatedLines.length; i++) {
  const fields = parseCSVLine(consolidatedLines[i]);
  if (fields.length >= 7) {
    const dedupKey = `${fields[0]}|${fields[3]}|${fields[4]}|${fields[2]}|${fields[6]}`;
    existingConsolidated.add(dedupKey);
  }
}

let appendedRows = 0;
const rowsToAppend = [];

for (const row of newConsolidatedRows) {
  const dedupKey = `${row.tmdbId}|${row.festival}|${row.category}|${row.year}|${row.movieTitle}`;
  if (!existingConsolidated.has(dedupKey)) {
    existingConsolidated.add(dedupKey); // prevent dupes within batch
    const wonVal = (row.won || '').toString().toLowerCase() === 'true' ? 'true' : 'false';
    rowsToAppend.push(`${row.tmdbId},${row.nominee},${row.year},${row.festival},${row.category},${wonVal},${row.movieTitle}`);
    appendedRows++;
  }
}

if (rowsToAppend.length > 0) {
  // Ensure file ends with newline before appending
  const needsNewline = !consolidatedContent.endsWith('\n');
  const appendText = (needsNewline ? '\n' : '') + rowsToAppend.join('\n') + '\n';
  fs.appendFileSync(CONSOLIDATED_PATH, appendText, 'utf8');
}

console.log(`Rows appended to person-awards-consolidated.csv: ${appendedRows}`);
console.log('\nDone.');
