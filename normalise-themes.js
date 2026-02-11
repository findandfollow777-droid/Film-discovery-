#!/usr/bin/env node
// ============================================
// ORBIT Discovery Dimensions — Phase 4
// Theme Taxonomy & Normalisation
// Usage:
//   node normalise-themes.js              # Run normalisation + print report
//   node normalise-themes.js --report     # Print frequency report only (no changes)
// ============================================

const fs = require("fs");
const path = require("path");
const { THEME_TAXONOMY, THEME_GROUPS, normaliseThemes } = require("./theme-taxonomy");

const SETTINGS_FILE = path.join(__dirname, "orbit-movie-settings.json");
const reportOnly = process.argv.includes("--report");

function main() {
  const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  const movies = data.movies;

  // Counters
  const normalisedFreq = {};   // category → count
  const rawFreq = {};          // raw string → count
  const allUnmapped = {};      // unmapped raw string → count
  let moviesProcessed = 0;
  let moviesSkipped = 0;       // no raw themes at all

  for (const [id, movie] of Object.entries(movies)) {
    // Use themes_raw if a previous normalisation stored the originals there
    const rawThemes = movie.themes_raw || movie.themes || [];

    if (rawThemes.length === 0) {
      moviesSkipped++;
      continue;
    }

    // Count raw theme frequency
    for (const raw of rawThemes) {
      rawFreq[raw] = (rawFreq[raw] || 0) + 1;
    }

    // Normalise
    const { normalised, unmapped } = normaliseThemes(rawThemes);

    // Count normalised frequency
    for (const cat of normalised) {
      normalisedFreq[cat] = (normalisedFreq[cat] || 0) + 1;
    }

    // Count unmapped
    for (const raw of unmapped) {
      allUnmapped[raw] = (allUnmapped[raw] || 0) + 1;
    }

    // Write back to movie object (unless report-only)
    if (!reportOnly) {
      movie.themes_raw = rawThemes;
      movie.themes = normalised;
    }

    moviesProcessed++;
  }

  // === REPORT ===
  console.log(`\n[Phase 4] Theme Normalisation Report`);
  console.log(`  Movies processed: ${moviesProcessed}`);
  console.log(`  Movies skipped (no themes): ${moviesSkipped}`);
  console.log(`  Taxonomy categories: ${Object.keys(THEME_TAXONOMY).length}`);

  // Normalised category frequency
  console.log(`\n=== NORMALISED CATEGORY FREQUENCY ===`);
  const sortedCats = Object.entries(normalisedFreq).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCats) {
    const pct = ((count / moviesProcessed) * 100).toFixed(1);
    console.log(`  ${cat}: ${count} (${pct}%)`);
  }

  // Unmapped themes (top 50)
  const sortedUnmapped = Object.entries(allUnmapped).sort((a, b) => b[1] - a[1]);
  const unmappedTotal = sortedUnmapped.reduce((sum, [, c]) => sum + c, 0);
  const rawTotal = Object.values(rawFreq).reduce((sum, c) => sum + c, 0);
  const mappedPct = (((rawTotal - unmappedTotal) / rawTotal) * 100).toFixed(1);

  console.log(`\n=== MAPPING COVERAGE ===`);
  console.log(`  Raw theme instances: ${rawTotal}`);
  console.log(`  Mapped: ${rawTotal - unmappedTotal} (${mappedPct}%)`);
  console.log(`  Unmapped: ${unmappedTotal} (${(100 - parseFloat(mappedPct)).toFixed(1)}%)`);
  console.log(`  Unique unmapped strings: ${sortedUnmapped.length}`);

  console.log(`\n=== TOP 50 UNMAPPED THEMES ===`);
  for (const [raw, count] of sortedUnmapped.slice(0, 50)) {
    console.log(`  "${raw}": ${count}`);
  }

  // By group
  console.log(`\n=== COVERAGE BY GROUP ===`);
  for (const [group, categories] of Object.entries(THEME_GROUPS)) {
    const groupTotal = categories.reduce((sum, cat) => sum + (normalisedFreq[cat] || 0), 0);
    console.log(`  ${group}: ${groupTotal} movies`);
    for (const cat of categories) {
      console.log(`    ${cat}: ${normalisedFreq[cat] || 0}`);
    }
  }

  // Save if not report-only
  if (!reportOnly) {
    data.meta.generated = new Date().toISOString();
    data.meta.themes_normalised = true;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
    console.log(`\n[Phase 4] Saved normalised themes to ${SETTINGS_FILE}`);
  } else {
    console.log(`\n[Phase 4] Report only — no changes written.`);
  }
}

main();
