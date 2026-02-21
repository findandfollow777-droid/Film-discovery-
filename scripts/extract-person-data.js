/**
 * extract-person-data.js
 *
 * Reads a Claude Code JSONL transcript, extracts all CSV data pasted by the
 * user in 7-column format:
 *   tmdb_id, nominee, year, festival, category, won, movie_title
 *
 * Deduplicates, filters corrupted lines, and writes clean output.
 */

const fs = require('fs');
const path = require('path');

// --- Paths ---
const JSONL_PATH = path.join(
  'C:', 'Users', 'danie', '.claude', 'projects',
  'C--Users-danie-OneDrive-Desktop-Projects-Venn-Movies',
  '6a95d0aa-df32-4531-9bde-218c65641a01.jsonl'
);
const OUTPUT_PATH = path.join(
  'C:', 'Users', 'danie', 'OneDrive', 'Desktop', 'Projects',
  'Venn Movies', 'person-data-raw.csv'
);

// --- Read JSONL ---
const raw = fs.readFileSync(JSONL_PATH, 'utf8');
const jsonLines = raw.split('\n').filter(l => l.trim());

console.log(`Read ${jsonLines.length} JSONL entries.`);

// --- Extract CSV lines from user messages ---
const allCsvLines = [];

for (const line of jsonLines) {
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }

  // Only look at user messages
  if (obj.type !== 'user') continue;
  if (!obj.message || !obj.message.content) continue;

  const content = obj.message.content;
  const textBlocks = Array.isArray(content)
    ? content.filter(c => c.type === 'text').map(c => c.text)
    : typeof content === 'string'
      ? [content]
      : [];

  for (const text of textBlocks) {
    const textLines = text.split('\n');
    for (const csvLine of textLines) {
      const trimmed = csvLine.trim();
      if (!trimmed) continue;
      // Must start with a number (tmdb_id)
      if (!/^\d+,/.test(trimmed)) continue;
      allCsvLines.push(trimmed);
    }
  }
}

console.log(`Found ${allCsvLines.length} raw CSV lines from user messages.`);

// --- Validate & clean each line ---
// Expected 7-column format: tmdb_id,nominee,year,festival,category,won,movie_title
// "won" must be true or false
// "year" must be a 4-digit number

const cleanLines = [];
let rejected = 0;

for (const line of allCsvLines) {
  // Some lines have trailing junk appended (e.g. "falsePlease do these ones")
  // or header text mixed in (e.g. "falsetmdb_id,title,year...")
  // Split on comma; expect at least 7 parts
  // Fields 0=tmdb_id, 1=nominee, 2=year, 3=festival, 4=category, 5=won, 6+=movie_title
  const parts = line.split(',');
  if (parts.length < 7) {
    rejected++;
    continue;
  }

  const tmdbId = parts[0].trim();
  const nominee = parts[1].trim();
  const year = parts[2].trim();
  const festival = parts[3].trim();
  const category = parts[4].trim();
  const wonRaw = parts[5].trim();
  const movieTitle = parts.slice(6).join(',').trim(); // rejoin in case title has commas

  // Validate tmdb_id is a number
  if (!/^\d+$/.test(tmdbId)) {
    rejected++;
    continue;
  }

  // Validate year is 4 digits
  if (!/^\d{4}$/.test(year)) {
    rejected++;
    continue;
  }

  // Validate won is exactly "true" or "false"
  if (wonRaw !== 'true' && wonRaw !== 'false') {
    rejected++;
    continue;
  }

  // Validate nominee is not empty
  if (!nominee) {
    rejected++;
    continue;
  }

  // Validate festival is not empty
  if (!festival) {
    rejected++;
    continue;
  }

  // Validate category is not empty
  if (!category) {
    rejected++;
    continue;
  }

  // Validate movie_title is not empty and doesn't contain header fragments
  if (!movieTitle) {
    rejected++;
    continue;
  }
  if (/tmdb_id|nominee|festival|category/i.test(movieTitle)) {
    rejected++;
    continue;
  }

  // Reconstruct the clean line
  const cleanLine = `${tmdbId},${nominee},${year},${festival},${category},${wonRaw},${movieTitle}`;
  cleanLines.push(cleanLine);
}

console.log(`After validation: ${cleanLines.length} valid 7-column lines, ${rejected} rejected.`);

// --- Deduplicate ---
const uniqueSet = new Set(cleanLines);
const uniqueLines = [...uniqueSet];

console.log(`After deduplication: ${uniqueLines.length} unique lines (removed ${cleanLines.length - uniqueLines.length} duplicates).`);

// --- Sort by year, then festival, then category for nice ordering ---
uniqueLines.sort((a, b) => {
  const pa = a.split(',');
  const pb = b.split(',');
  const yearDiff = parseInt(pa[2]) - parseInt(pb[2]);
  if (yearDiff !== 0) return yearDiff;
  const festDiff = pa[3].localeCompare(pb[3]);
  if (festDiff !== 0) return festDiff;
  const catDiff = pa[4].localeCompare(pb[4]);
  if (catDiff !== 0) return catDiff;
  if (pa[5] !== pb[5]) return pa[5] === 'true' ? -1 : 1;
  return 0;
});

// --- Write output ---
const header = 'tmdb_id,nominee,year,festival,category,won,movie_title';
const output = header + '\n' + uniqueLines.join('\n') + '\n';

fs.writeFileSync(OUTPUT_PATH, output, 'utf8');

console.log(`\nWrote ${uniqueLines.length} unique CSV lines to:\n  ${OUTPUT_PATH}`);
