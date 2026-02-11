// Generate awards-data.js entries from CSV + TMDB results
const fs = require('fs');
const entries = JSON.parse(fs.readFileSync('awards-csv-parsed.json', 'utf8'));
const tmdbResults = JSON.parse(fs.readFileSync('tmdb-lookup-results.json', 'utf8'));

// Build structure: festival -> category -> year -> { winner, nominees[] }
const db = {};

entries.forEach(e => {
  const key = e.title + '|' + e.year;
  const tmdb = tmdbResults[key];
  if (!tmdb) {
    console.error('Missing TMDB data for:', key);
    return;
  }

  if (!db[e.festival]) db[e.festival] = {};
  if (!db[e.festival][e.category]) db[e.festival][e.category] = {};
  if (!db[e.festival][e.category][e.year]) db[e.festival][e.category][e.year] = { winner: null, nominees: [] };

  const movieEntry = `M("${e.title.replace(/"/g, '\\"')}", ${tmdb.tmdb_id}, "${tmdb.poster_path || ''}")`;

  const yearData = db[e.festival][e.category][e.year];
  if (e.won) {
    yearData.winner = movieEntry;
  } else {
    yearData.nominees.push(movieEntry);
  }
});

// Generate JS code
let output = '';

// Sort festivals
const festOrder = ['BAFTA', 'GoldenGlobe', 'Cannes'];
const festMap = { 'BAFTA': 'BAFTA', 'Golden Globe': 'GoldenGlobe', 'Cannes': 'Cannes' };

for (const [csvFest, jsFest] of Object.entries(festMap)) {
  const fest = db[csvFest];
  if (!fest) continue;
  output += `\n    // ── ${csvFest} (new years) ──\n`;

  for (const [category, years] of Object.entries(fest)) {
    const catKey = category === 'Best Comedy/Musical' ? '"Best Comedy/Musical"' : `"${category}"`;
    output += `    // ${jsFest} > ${category}\n`;

    // Sort years descending
    const sortedYears = Object.keys(years).map(Number).sort((a, b) => b - a);

    for (const year of sortedYears) {
      const data = years[year];
      output += `    // ${jsFest}["${category}"][${year}]\n`;
      output += `    // winner: ${data.winner}\n`;
      if (data.nominees.length) {
        output += `    // nominees: ${data.nominees.join(', ')}\n`;
      }
    }
    output += '\n';
  }
}

// Also generate a direct code block that can be copy-pasted
output += '\n\n// === COPY-PASTE CODE BLOCKS ===\n\n';

for (const [csvFest, jsFest] of Object.entries(festMap)) {
  const fest = db[csvFest];
  if (!fest) continue;

  for (const [category, years] of Object.entries(fest)) {
    const catStr = `"${category}"`;
    const sortedYears = Object.keys(years).map(Number).sort((a, b) => b - a);

    output += `    // ${jsFest} > ${category}\n`;
    for (const year of sortedYears) {
      const data = years[year];
      output += `      ${year}: { winner: ${data.winner}`;
      if (data.nominees.length) {
        output += `, nominees: [${data.nominees.join(', ')}]`;
      }
      output += ` },\n`;
    }
    output += '\n';
  }
}

fs.writeFileSync('awards-new-entries.txt', output);
console.log('Wrote awards-new-entries.txt');

// Also verify: check for any movies with null poster_path
let nullPosters = 0;
for (const [key, val] of Object.entries(tmdbResults)) {
  if (!val.poster_path) {
    console.log('NULL poster:', key, '-> tmdb_id:', val.tmdb_id);
    nullPosters++;
  }
}
console.log(`\nNull poster paths: ${nullPosters} / ${Object.keys(tmdbResults).length}`);

// Check for year mismatches
let mismatches = 0;
for (const [key, val] of Object.entries(tmdbResults)) {
  const [title, year] = key.split('|');
  if (val.tmdb_year && Math.abs(parseInt(val.tmdb_year) - parseInt(year)) > 2) {
    console.log(`YEAR MISMATCH: "${title}" CSV:${year} TMDB:${val.tmdb_year} (id:${val.tmdb_id})`);
    mismatches++;
  }
}
console.log(`Year mismatches (>2yr): ${mismatches}`);
