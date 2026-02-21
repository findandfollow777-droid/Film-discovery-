#!/usr/bin/env node
// ============================================
// ORBIT Discovery Dimensions — Phase 4
// Theme Taxonomy & Normalisation
// Usage:
//   node normalise-themes.js              # Run normalisation + print frequency report
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
    const rawThemes = movie.themes || [];

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

    // Track unmapped
    for (const raw of unmapped) {
      allUnmapped[raw] = (allUnmapped[raw] || 0) + 1;
    }

    // Write back — store normalised in NEW field, keep themes as-is
    if (!reportOnly) {
      movie.themes_normalised = normalised;
      // movie.themes stays as the raw values (never overwrite)
    }

    moviesProcessed++;
  }

  // Save
  if (!reportOnly) {
    data.meta.generated = new Date().toISOString();
    data.meta.themes_normalised = true;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
    console.log(`\n[Phase 4] Normalisation complete.`);
    console.log(`  Movies processed: ${moviesProcessed}`);
    console.log(`  Movies skipped (no themes): ${moviesSkipped}`);
  }

  // ─── FREQUENCY REPORT ───

  console.log(`\n═══ NORMALISED THEME FREQUENCY ═══\n`);

  // Sort by frequency descending
  const sortedNormalised = Object.entries(normalisedFreq)
    .sort((a, b) => b[1] - a[1]);

  for (const [cat, count] of sortedNormalised) {
    const pct = ((count / moviesProcessed) * 100).toFixed(1);
    console.log(`  ${cat.padEnd(22)} ${String(count).padStart(5)}  (${pct}%)`);
  }

  // ─── UNMAPPED THEMES ───

  const sortedUnmapped = Object.entries(allUnmapped)
    .sort((a, b) => b[1] - a[1]);

  if (sortedUnmapped.length > 0) {
    console.log(`\n═══ UNMAPPED RAW THEMES (top 40) ═══`);
    console.log(`These raw themes didn't match any taxonomy category.\n`);

    for (const [raw, count] of sortedUnmapped.slice(0, 40)) {
      console.log(`  ${raw.padEnd(30)} ${String(count).padStart(5)}`);
    }

    console.log(`\n  Total unique unmapped: ${sortedUnmapped.length}`);
    console.log(`  Total unmapped occurrences: ${sortedUnmapped.reduce((sum, [_, c]) => sum + c, 0)}`);
  } else {
    console.log(`\n  All raw themes mapped successfully.`);
  }

  // ─── TOP RAW THEMES ───

  console.log(`\n═══ TOP 30 RAW THEMES ═══\n`);
  const sortedRaw = Object.entries(rawFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  for (const [raw, count] of sortedRaw) {
    const mapped = normaliseThemes([raw]).normalised[0] || "UNMAPPED";
    console.log(`  ${raw.padEnd(28)} ${String(count).padStart(5)}  -> ${mapped}`);
  }
}

main();
