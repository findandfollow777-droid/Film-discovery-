#!/usr/bin/env node
// ============================================
// ORBIT Discovery Dimensions — Phase 3
// AI Batch Extraction (Time Period, Location, Themes)
// Usage:
//   node generate-movie-settings.js           # Run full extraction
//   node generate-movie-settings.js --dry-run  # Show counts only
// ============================================

const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic();
const SETTINGS_FILE = path.join(__dirname, "orbit-movie-settings.json");
const SEED_FILE = path.join(__dirname, "orbit-settings-seed.json");
const ERROR_LOG = path.join(__dirname, "settings-extraction-errors.log");
const DELAY_MS = 1500;
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 800;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logError(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(ERROR_LOG, line);
  console.error("  ERROR:", msg);
}

// ============================================
// TIER SORTING
// ============================================

function getMoviesNeedingExtraction(seedData, settingsData) {
  const tierA = []; // needs location + time_period + themes
  const tierB = []; // needs time_period + themes only

  for (const [id, seed] of Object.entries(seedData.movies)) {
    const existing = settingsData.movies[id];

    // Skip if already has themes (already processed by this script)
    if (existing?.themes && existing.themes.length > 0) continue;

    const hasLocation = existing?.location?.primary?.length > 0;

    const movieInfo = {
      id,
      title: seed.title,
      release_year: seed.release_year,
      overview: seed.overview || "",
      genres: seed.genre_names || [],
      existing_location: hasLocation ? existing.location : null,
      existing_time_period: existing?.time_period || null
    };

    if (hasLocation) {
      tierB.push(movieInfo);
    } else {
      tierA.push(movieInfo);
    }
  }

  return { tierA, tierB };
}

// ============================================
// PROMPT TEMPLATES
// ============================================

function buildTierAPrompt(movie) {
  return `Extract location, time period, and themes for this movie.

"${movie.title}" (${movie.release_year})
Overview: ${movie.overview}
Genres: ${movie.genres.join(", ")}

Respond ONLY with a JSON object. No markdown, no backticks, no explanation.

{
  "location": {
    "primary": ["City or region"],
    "country": ["Country"],
    "specificity": "city|region|country|fictional|various|unknown"
  },
  "time_period": {
    "decades": ["1940s"],
    "primary_decade": "1940s",
    "setting_type": "historical|contemporary|near_future|far_future|timeless|multi_era",
    "era_labels": [],
    "year_approximate": 1943
  },
  "themes": ["theme1", "theme2", "theme3"]
}

LOCATION: Where the story takes place. Real places or "fictional" for fantasy worlds. Max 3 locations.

TIME PERIOD — follow this decision tree:
- Does the story take place in a SPECIFIC time different from ${movie.release_year}?
  YES → "historical"/"near_future"/"far_future". Set decades to ALL decades spanned. Set year_approximate.
  NO → "contemporary". Set decades to ["RELEASE_DECADE"]. Set year_approximate to ${movie.release_year}.
- Allowed era_labels (use ONLY these, or empty array):
  Ancient, Medieval, Renaissance, Colonial Era, Industrial Revolution, Victorian, Edwardian,
  World War I, Roaring Twenties, Great Depression, World War II, Holocaust, Post-War,
  Korean War, Cold War, Civil Rights, Space Race, Vietnam Era, Watergate, Prohibition,
  The Troubles, Fall of the Berlin Wall, Apartheid, Cultural Revolution,
  French Revolution, American Revolution, American Civil War
- Edge cases: abstract/surreal → "timeless". Multiple distinct eras intercut → "multi_era".

THEMES: 2-5 core thematic concerns. Not genre labels — deeper ideas.
Examples: "redemption", "grief", "obsession", "class-divide", "identity", "father-son"`;
}

function buildTierBPrompt(movie) {
  return `Extract time period and themes for this movie.

"${movie.title}" (${movie.release_year})
Overview: ${movie.overview}
Genres: ${movie.genres.join(", ")}

Respond ONLY with a JSON object. No markdown, no backticks, no explanation.

{
  "time_period": {
    "decades": ["1940s"],
    "primary_decade": "1940s",
    "setting_type": "historical|contemporary|near_future|far_future|timeless|multi_era",
    "era_labels": [],
    "year_approximate": 1943
  },
  "themes": ["theme1", "theme2", "theme3"]
}

TIME PERIOD — follow this decision tree:
- Does the story take place in a SPECIFIC time different from ${movie.release_year}?
  YES → "historical"/"near_future"/"far_future". Set decades to ALL decades spanned. Set year_approximate.
  NO → "contemporary". Set decades to ["RELEASE_DECADE"]. Set year_approximate to ${movie.release_year}.
- Allowed era_labels (use ONLY these, or empty array):
  Ancient, Medieval, Renaissance, Colonial Era, Industrial Revolution, Victorian, Edwardian,
  World War I, Roaring Twenties, Great Depression, World War II, Holocaust, Post-War,
  Korean War, Cold War, Civil Rights, Space Race, Vietnam Era, Watergate, Prohibition,
  The Troubles, Fall of the Berlin Wall, Apartheid, Cultural Revolution,
  French Revolution, American Revolution, American Civil War
- Edge cases: abstract/surreal → "timeless". Multiple distinct eras intercut → "multi_era".

THEMES: 2-5 core thematic concerns. Not genre labels — deeper ideas.
Examples: "redemption", "grief", "obsession", "class-divide", "identity", "father-son"`;
}

// ============================================
// POST-PROCESSING
// ============================================

function resolveTimePeriod(timePeriod, releaseYear) {
  const tp = { ...timePeriod };
  const releaseDecade = `${Math.floor(releaseYear / 10) * 10}s`;

  // Contemporary: replace placeholder with actual decade
  if (tp.setting_type === "contemporary" ||
      (tp.decades && tp.decades.includes("RELEASE_DECADE"))) {
    tp.decades = [releaseDecade];
    tp.primary_decade = releaseDecade;
    tp.year_approximate = tp.year_approximate || releaseYear;
    if (!tp.setting_type || tp.setting_type === "contemporary") {
      tp.setting_type = "contemporary";
    }
  }

  // Validate: decades should never be empty
  if (!tp.decades || tp.decades.length === 0) {
    tp.decades = [releaseDecade];
    tp.primary_decade = releaseDecade;
    tp.setting_type = tp.setting_type || "contemporary";
  }

  // Validate: primary_decade must be in decades array
  if (!tp.decades.includes(tp.primary_decade)) {
    tp.primary_decade = tp.decades[0];
  }

  // Validate: era_labels must be array
  if (!Array.isArray(tp.era_labels)) {
    tp.era_labels = tp.era_labels ? [tp.era_labels] : [];
  }

  return tp;
}

function parseResponse(responseText) {
  const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

function mergeResults(existing, aiResult, tier, releaseYear) {
  const merged = { ...existing };

  // Themes — always write
  merged.themes = aiResult.themes || [];
  merged.themes_source = "ai_extracted";

  // Time period — write if missing or AI provides richer data
  if (aiResult.time_period) {
    const resolved = resolveTimePeriod(aiResult.time_period, releaseYear);
    if (!merged.time_period || merged.time_period.source !== "wikidata") {
      merged.time_period = { ...resolved, source: "ai_extracted" };
    } else if (merged.time_period.source === "wikidata") {
      // Wikidata exists — keep it but add any missing era_labels from AI
      if (resolved.era_labels?.length > 0 && (!merged.time_period.era_labels || merged.time_period.era_labels.length === 0)) {
        merged.time_period.era_labels = resolved.era_labels;
      }
    }
  }

  // Location — only for Tier A (Tier B already has location)
  if (tier === "A" && aiResult.location) {
    merged.location = {
      primary: aiResult.location.primary || [],
      country: aiResult.location.country || [],
      coordinates: [],
      source: "ai_extracted"
    };
  }

  // NEVER touch based_on — leave existing value untouched

  return merged;
}

function validateResult(result, tier) {
  if (!result.themes || !Array.isArray(result.themes) || result.themes.length === 0) {
    return "Missing or empty themes array";
  }
  if (!result.time_period || !result.time_period.decades || !result.time_period.setting_type) {
    return "Missing or incomplete time_period";
  }
  if (tier === "A" && (!result.location || !result.location.primary)) {
    return "Tier A missing location.primary";
  }
  return null;
}

// ============================================
// PROCESSING LOOP
// ============================================

async function processMovies(movies, tier, settingsData) {
  let processed = 0;
  let errors = 0;
  const promptFn = tier === "A" ? buildTierAPrompt : buildTierBPrompt;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const prompt = promptFn(movie);

    let success = false;
    for (let attempt = 0; attempt < 2 && !success; attempt++) {
      if (attempt === 1) await sleep(5000);

      try {
        const response = await client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content: prompt }],
        });

        const text = response.content[0].text;
        const result = parseResponse(text);

        const validationError = validateResult(result, tier);
        if (validationError) {
          throw new Error(`Validation: ${validationError}`);
        }

        const existing = settingsData.movies[movie.id] || {};
        settingsData.movies[movie.id] = mergeResults(existing, result, tier, movie.release_year);
        processed++;
        success = true;
      } catch (err) {
        if (attempt === 0) {
          logError(`Movie "${movie.title}" (${movie.id}) Tier ${tier} attempt 1: ${err.message}`);
        } else {
          logError(`Movie "${movie.title}" (${movie.id}) Tier ${tier} retry failed: ${err.message}`);
          errors++;
        }
      }
    }

    // Progress log every 50 movies
    if ((i + 1) % 50 === 0 || i === movies.length - 1) {
      console.log(`  [Tier ${tier}] ${i + 1}/${movies.length} (${processed} ok, ${errors} errors)`);
    }

    // Save every 50 movies
    if ((i + 1) % 50 === 0) {
      settingsData.meta.movie_count = Object.keys(settingsData.movies).length;
      settingsData.meta.generated = new Date().toISOString();
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsData, null, 2));
    }

    await sleep(DELAY_MS);
  }

  return { processed, errors };
}

// ============================================
// MAIN
// ============================================

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const start = Date.now();

  const seedData = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
  const settingsData = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));

  const { tierA, tierB } = getMoviesNeedingExtraction(seedData, settingsData);
  const alreadyDone = Object.values(settingsData.movies).filter(m => m.themes?.length > 0).length;

  console.log(`[Phase 3] AI Extraction Plan:`);
  console.log(`  Tier A (location + time + themes): ${tierA.length} movies`);
  console.log(`  Tier B (time + themes only):       ${tierB.length} movies`);
  console.log(`  Total API calls:                   ${tierA.length + tierB.length}`);
  console.log(`  Already complete (skipped):         ${alreadyDone}`);
  console.log(`  Estimated runtime: ~${Math.ceil((tierA.length + tierB.length) * 1.5 / 60)} minutes`);

  if (isDryRun) {
    console.log("\n[Dry run] No API calls made.");
    return;
  }

  // Process Tier A first (fewer movies, needs more data)
  console.log(`\n[Phase 3] Starting Tier A (${tierA.length} movies)...`);
  const tierAResult = await processMovies(tierA, "A", settingsData);

  // Then Tier B
  console.log(`\n[Phase 3] Starting Tier B (${tierB.length} movies)...`);
  const tierBResult = await processMovies(tierB, "B", settingsData);

  // Final save
  settingsData.meta.movie_count = Object.keys(settingsData.movies).length;
  settingsData.meta.generated = new Date().toISOString();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settingsData, null, 2));

  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);

  console.log(`\n[Phase 3] Complete! (${elapsed} min)`);
  console.log(`  Tier A: ${tierAResult.processed} processed, ${tierAResult.errors} errors`);
  console.log(`  Tier B: ${tierBResult.processed} processed, ${tierBResult.errors} errors`);
  console.log(`  Total with themes:      ${Object.values(settingsData.movies).filter(m => m.themes?.length > 0).length}`);
  console.log(`  Total with time_period: ${Object.values(settingsData.movies).filter(m => m.time_period).length}`);
  console.log(`  Total with location:    ${Object.values(settingsData.movies).filter(m => m.location?.primary?.length > 0).length}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
