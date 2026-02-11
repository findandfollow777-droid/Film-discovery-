#!/usr/bin/env node
// ============================================
// ORBIT Discovery Dimensions — Seed Generator
// Usage:
//   node generate-settings-seed.js phase0
//   node generate-settings-seed.js phase1
//   node generate-settings-seed.js phase2
// ============================================

const fs = require("fs");
const path = require("path");
const { getErasForDecade, getDecadesForEra } = require("./era-decade-map");

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";
const SEED_FILE = path.join(__dirname, "orbit-settings-seed.json");
const SETTINGS_FILE = path.join(__dirname, "orbit-movie-settings.json");
const AWARDS_CSV = path.join(__dirname, "awards-7col-template.csv");
const NEBULA_FILE = path.join(__dirname, "nebula-seed-movies.json");
const PUZZLES_FILE = path.join(__dirname, "js", "puzzles.js");

const DELAY_MS = 250;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf8"));
  } catch {
    return null;
  }
}

function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
}

async function tmdbFetch(urlPath, retries = 2) {
  const url = `https://api.themoviedb.org/3${urlPath}${urlPath.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.log("  Rate limited — waiting 10s...");
        await sleep(10000);
        continue;
      }
      if (res.status === 404) return null;
      if (!res.ok) {
        console.log(`  HTTP ${res.status} for ${urlPath}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      if (attempt < retries) {
        console.log(`  Network error, retrying... (${err.message})`);
        await sleep(2000);
      } else {
        console.log(`  Failed after ${retries + 1} attempts: ${err.message}`);
        return null;
      }
    }
  }
  return null;
}

// ============================================
// PHASE 0: Build target list + fetch TMDB data
// ============================================

async function phase0() {
  console.log("[Phase 0] Building target movie list...\n");

  // Load existing seed for resume
  let seed = loadJSON(SEED_FILE);
  if (!seed) {
    seed = {
      meta: {
        generated: new Date().toISOString(),
        movie_count: 0,
        sources: {
          nebula: 0, awards: 0, awards_resolved: 0,
          puzzles: 0, tmdb_popular: 0,
          total_before_dedup: 0, total_after_dedup: 0,
          unresolved_awards: []
        }
      },
      movies: {}
    };
  }

  const allIds = new Set(Object.keys(seed.movies).map(Number));
  const sourceCounts = { nebula: 0, awards_known: 0, awards_resolved: 0, puzzles: 0, tmdb_popular: 0 };
  const unresolved = [];

  // --- Source 1: Nebula seed ---
  console.log("[Phase 0] Reading nebula-seed-movies.json...");
  const nebula = loadJSON(NEBULA_FILE);
  if (nebula && nebula.movies) {
    nebula.movies.forEach(m => allIds.add(m.id));
    sourceCounts.nebula = nebula.movies.length;
    console.log(`  Nebula seed: ${sourceCounts.nebula} IDs`);
  }

  // --- Source 2: Awards CSV (7-col) ---
  console.log("[Phase 0] Reading awards-7col-template.csv...");
  const csvText = fs.readFileSync(AWARDS_CSV, "utf8");
  const csvLines = csvText.replace(/\r/g, "").split("\n");
  csvLines.shift(); // remove header

  const knownAwardIds = new Set();
  const needLookup = new Map(); // title|year -> { title, year }

  csvLines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    // 7 columns: tmdb_id, nominee, year, festival, category, won, movie_title
    // Split carefully — movie_title is last and could theoretically have commas
    // but in this CSV it doesn't. Split on first 6 commas.
    const parts = trimmed.split(",");
    const tmdbId = parseInt(parts[0]) || 0;
    const year = parseInt(parts[2]) || 0;
    const movieTitle = (parts.slice(6).join(",") || "").trim();

    if (tmdbId > 0) {
      allIds.add(tmdbId);
      knownAwardIds.add(tmdbId);
    } else if (movieTitle && year > 0) {
      const key = `${movieTitle}|${year}`;
      if (!needLookup.has(key)) {
        needLookup.set(key, { title: movieTitle, year });
      }
    }
  });

  sourceCounts.awards_known = knownAwardIds.size;
  console.log(`  Awards (known IDs): ${sourceCounts.awards_known}`);
  console.log(`  Awards (need lookup): ${needLookup.size} unique title+year combos`);

  // Resolve unknown award IDs via TMDB search
  let lookupCount = 0;
  const lookupTotal = needLookup.size;
  for (const [key, { title, year }] of needLookup) {
    lookupCount++;
    if (lookupCount % 200 === 0) {
      console.log(`  [Lookup] ${lookupCount}/${lookupTotal}...`);
    }

    // Search with year first
    let data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(title)}&year=${year}`);
    let found = data && data.results && data.results.length > 0 ? data.results[0].id : null;

    // Retry without year
    if (!found) {
      await sleep(DELAY_MS);
      data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(title)}`);
      found = data && data.results && data.results.length > 0 ? data.results[0].id : null;
    }

    if (found) {
      allIds.add(found);
      sourceCounts.awards_resolved++;
    } else {
      unresolved.push(`${title} (${year})`);
    }

    await sleep(DELAY_MS);
  }
  console.log(`  Awards resolved: ${sourceCounts.awards_resolved}`);
  console.log(`  Awards unresolved: ${unresolved.length}`);

  // --- Source 3: Puzzles ---
  console.log("[Phase 0] Reading js/puzzles.js...");
  const puzzleText = fs.readFileSync(PUZZLES_FILE, "utf8");
  const puzzleMatches = puzzleText.match(/\b\d{2,}\b/g) || [];
  const puzzleIds = new Set(puzzleMatches.map(Number));
  puzzleIds.forEach(id => allIds.add(id));
  sourceCounts.puzzles = puzzleIds.size;
  console.log(`  Puzzles: ${sourceCounts.puzzles} IDs`);

  // --- Source 4: TMDB Top 2000 by popularity ---
  console.log("[Phase 0] Fetching TMDB Top 2000 by popularity...");
  let popularCount = 0;
  for (let page = 1; page <= 100; page++) {
    const data = await tmdbFetch(`/discover/movie?sort_by=popularity.desc&page=${page}&vote_count.gte=50`);
    if (data && data.results) {
      data.results.forEach(m => {
        allIds.add(m.id);
        popularCount++;
      });
    }
    if (page % 20 === 0) console.log(`  Page ${page}/100 (${popularCount} movies so far)`);
    await sleep(DELAY_MS);
  }
  sourceCounts.tmdb_popular = popularCount;
  console.log(`  TMDB popular: ${popularCount} IDs`);

  // --- Dedup summary ---
  const totalBefore = sourceCounts.nebula + sourceCounts.awards_known + sourceCounts.awards_resolved + sourceCounts.puzzles + sourceCounts.tmdb_popular;
  console.log(`\n[Phase 0] Sources:`);
  console.log(`  Nebula seed:     ${sourceCounts.nebula} IDs`);
  console.log(`  Awards CSV:      ${sourceCounts.awards_known} known + ${sourceCounts.awards_resolved} resolved from title search`);
  console.log(`  Puzzles:         ${sourceCounts.puzzles} IDs`);
  console.log(`  TMDB Top 2000:   ${sourceCounts.tmdb_popular} IDs`);
  console.log(`  ${"─".repeat(30)}`);
  console.log(`  Before dedup:    ${totalBefore}`);
  console.log(`  After dedup:     ${allIds.size}`);
  console.log(`  Unresolved:      ${unresolved.length} (awards titles not found in TMDB)`);

  // --- Fetch full TMDB data for each unique movie ---
  console.log(`\n[Phase 0] Fetching TMDB details for ${allIds.size} movies...`);

  // Track which source(s) each ID came from
  const nebulaSet = new Set(nebula ? nebula.movies.map(m => m.id) : []);
  const awardsSet = new Set([...knownAwardIds]);
  // Add resolved awards to awardsSet
  // (we don't track individual resolved IDs separately, but awards_resolved count is logged)

  const idsArray = [...allIds].filter(id => id > 0);
  let fetched = 0;
  let skipped = 0;

  for (let i = 0; i < idsArray.length; i++) {
    const id = idsArray[i];

    // Resume: skip if already in seed
    if (seed.movies[id]) {
      skipped++;
      continue;
    }

    const data = await tmdbFetch(`/movie/${id}?append_to_response=keywords`);
    if (data && data.id) {
      const sources = [];
      if (nebulaSet.has(id)) sources.push("nebula");
      if (awardsSet.has(id)) sources.push("awards");
      if (puzzleIds.has(id)) sources.push("puzzles");
      // We can't easily tell if it came from popular, so mark all that aren't from other sources
      if (sources.length === 0) sources.push("tmdb_popular");

      seed.movies[id] = {
        id: data.id,
        title: data.title || "",
        release_year: data.release_date ? parseInt(data.release_date.split("-")[0]) : 0,
        overview: data.overview || "",
        genres: (data.genres || []).map(g => g.id),
        genre_names: (data.genres || []).map(g => g.name),
        keywords: data.keywords && data.keywords.keywords
          ? data.keywords.keywords.map(k => ({ id: k.id, name: k.name }))
          : [],
        popularity: data.popularity || 0,
        vote_average: data.vote_average || 0,
        vote_count: data.vote_count || 0,
        source: sources
      };
      fetched++;
    }

    // Save incrementally every 50 movies
    if (fetched > 0 && fetched % 50 === 0) {
      seed.meta.movie_count = Object.keys(seed.movies).length;
      seed.meta.generated = new Date().toISOString();
      saveJSON(SEED_FILE, seed);
    }

    if ((fetched + skipped) % 100 === 0) {
      console.log(`  [Phase 0] Progress: ${fetched + skipped}/${idsArray.length} (${fetched} fetched, ${skipped} skipped/resumed)`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  seed.meta.movie_count = Object.keys(seed.movies).length;
  seed.meta.generated = new Date().toISOString();
  seed.meta.sources = {
    nebula: sourceCounts.nebula,
    awards: sourceCounts.awards_known,
    awards_resolved: sourceCounts.awards_resolved,
    puzzles: sourceCounts.puzzles,
    tmdb_popular: sourceCounts.tmdb_popular,
    total_before_dedup: totalBefore,
    total_after_dedup: allIds.size,
    unresolved_awards: unresolved
  };
  saveJSON(SEED_FILE, seed);

  console.log(`\n[Phase 0] Complete! Seed file: ${seed.meta.movie_count} movies`);
  console.log(`  Fetched: ${fetched}  Skipped (resumed): ${skipped}`);

  // Initialise empty settings file if it doesn't exist
  if (!fs.existsSync(SETTINGS_FILE)) {
    saveJSON(SETTINGS_FILE, {
      meta: {
        version: "1.0",
        generated: new Date().toISOString(),
        movie_count: 0,
        sources: ["wikidata", "tmdb_keywords", "ai_extracted"]
      },
      movies: {}
    });
    console.log("  Created empty orbit-movie-settings.json");
  }
}

// ============================================
// PHASE 1: Wikidata SPARQL import
// ============================================

async function phase1() {
  console.log("[Phase 1] Wikidata SPARQL import...\n");

  const seed = loadJSON(SEED_FILE);
  if (!seed || !seed.movies) {
    console.error("Error: orbit-settings-seed.json not found. Run phase0 first.");
    process.exit(1);
  }

  let settings = loadJSON(SETTINGS_FILE);
  if (!settings) {
    settings = {
      meta: { version: "1.0", generated: new Date().toISOString(), movie_count: 0, sources: ["wikidata", "tmdb_keywords", "ai_extracted"] },
      movies: {}
    };
  }

  const seedIds = new Set(Object.keys(seed.movies).map(Number));
  const seedCount = seedIds.size;

  // --- Query 1: Narrative Locations (P840) ---
  console.log("[Phase 1] Querying Wikidata for narrative locations (P840)...");
  const locationQuery = `
SELECT ?film ?filmLabel ?tmdbId ?locationLabel ?lat ?long WHERE {
  ?film wdt:P31 wd:Q11424 ;
        wdt:P840 ?location ;
        wdt:P4947 ?tmdbId .
  OPTIONAL {
    ?location p:P625 ?coordStatement .
    ?coordStatement psv:P625 ?coordNode .
    ?coordNode wikibase:geoLatitude ?lat ;
               wikibase:geoLongitude ?long .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 50000`;

  const locationResults = await wikidataQuery(locationQuery);
  console.log(`  Location results from Wikidata: ${locationResults.length} rows`);

  // Group by TMDB ID
  const locationMap = new Map(); // tmdbId -> { primaries: Set, coords: [] }
  locationResults.forEach(row => {
    const tmdbId = parseInt(row.tmdbId?.value);
    if (!tmdbId || !seedIds.has(tmdbId)) return;

    if (!locationMap.has(tmdbId)) {
      locationMap.set(tmdbId, { primaries: new Set(), coords: [] });
    }
    const entry = locationMap.get(tmdbId);
    const locLabel = row.locationLabel?.value;
    if (locLabel) entry.primaries.add(locLabel);

    const lat = parseFloat(row.lat?.value);
    const lng = parseFloat(row.long?.value);
    if (!isNaN(lat) && !isNaN(lng)) {
      // Avoid duplicate coordinates
      const exists = entry.coords.some(c => c.lat === lat && c.lng === lng);
      if (!exists) {
        entry.coords.push({ lat, lng, label: locLabel || "" });
      }
    }
  });

  // Write location data
  let locationMatchCount = 0;
  for (const [tmdbId, locData] of locationMap) {
    if (!settings.movies[tmdbId]) settings.movies[tmdbId] = {};
    settings.movies[tmdbId].location = {
      primary: [...locData.primaries],
      country: [],
      coordinates: locData.coords,
      source: "wikidata"
    };
    locationMatchCount++;
  }
  console.log(`  Location matches: ${locationMatchCount} / ${seedCount} movies`);

  // --- Query 2: Time Periods (P2408) ---
  console.log("[Phase 1] Querying Wikidata for time periods (P2408)...");
  const periodQuery = `
SELECT ?film ?filmLabel ?tmdbId ?periodLabel WHERE {
  ?film wdt:P31 wd:Q11424 ;
        wdt:P2408 ?period ;
        wdt:P4947 ?tmdbId .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 50000`;

  const periodResults = await wikidataQuery(periodQuery);
  console.log(`  Time period results from Wikidata: ${periodResults.length} rows`);

  // Group by TMDB ID and convert
  const periodMap = new Map(); // tmdbId -> [periodLabel, ...]
  periodResults.forEach(row => {
    const tmdbId = parseInt(row.tmdbId?.value);
    if (!tmdbId || !seedIds.has(tmdbId)) return;

    const periodLabel = row.periodLabel?.value;
    if (periodLabel) {
      if (!periodMap.has(tmdbId)) periodMap.set(tmdbId, []);
      periodMap.get(tmdbId).push(periodLabel);
    }
  });

  let periodMatchCount = 0;
  for (const [tmdbId, periods] of periodMap) {
    if (!settings.movies[tmdbId]) settings.movies[tmdbId] = {};
    const converted = convertWikidataPeriods(periods, seed.movies[tmdbId]?.release_year);
    if (converted) {
      settings.movies[tmdbId].time_period = converted;
      periodMatchCount++;
    }
  }
  console.log(`  Time period matches: ${periodMatchCount} / ${seedCount} movies`);

  // Combined coverage
  const moviesWithData = new Set();
  for (const id of Object.keys(settings.movies)) {
    const m = settings.movies[id];
    if (m.location || m.time_period) moviesWithData.add(parseInt(id));
  }

  console.log(`\n[Phase 1] Wikidata import complete:`);
  console.log(`  Location matches:    ${locationMatchCount} / ${seedCount} movies`);
  console.log(`  Time period matches: ${periodMatchCount} / ${seedCount} movies`);
  console.log(`  Combined coverage:   ${moviesWithData.size} movies have at least one Wikidata field`);
  console.log(`  Gaps remaining:      ${seedCount - moviesWithData.size} movies need AI extraction for location/time`);

  settings.meta.generated = new Date().toISOString();
  settings.meta.movie_count = Object.keys(settings.movies).length;
  saveJSON(SETTINGS_FILE, settings);
  console.log("  Saved orbit-movie-settings.json");
}

async function wikidataQuery(sparql) {
  const url = "https://query.wikidata.org/sparql";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "ORBIT-Discovery-Dimensions/1.0 (https://github.com/danielforkner/Venn-Movies)"
      },
      body: "query=" + encodeURIComponent(sparql)
    });
    if (!res.ok) {
      console.error(`  Wikidata error: HTTP ${res.status}`);
      const text = await res.text();
      console.error(`  ${text.slice(0, 300)}`);
      return [];
    }
    const data = await res.json();
    return data.results?.bindings || [];
  } catch (err) {
    console.error(`  Wikidata fetch failed: ${err.message}`);
    return [];
  }
}

/**
 * Convert Wikidata period labels into the structured time_period schema.
 * Handles multiple periods by merging decades and era labels.
 */
function convertWikidataPeriods(periodLabels, releaseYear) {
  const allDecades = new Set();
  const allEras = new Set();
  let primaryDecade = null;

  for (const label of periodLabels) {
    const result = parsePeriodLabel(label);
    if (result) {
      result.decades.forEach(d => allDecades.add(d));
      result.eras.forEach(e => allEras.add(e));
      if (!primaryDecade && result.primaryDecade) {
        primaryDecade = result.primaryDecade;
      }
    }
  }

  // If we got decades but no primary, pick the most "central" one
  if (!primaryDecade && allDecades.size > 0) {
    const sorted = [...allDecades].sort((a, b) => a - b);
    primaryDecade = sorted[Math.floor(sorted.length / 2)];
  }

  if (allDecades.size === 0 && allEras.size === 0) return null;

  return {
    primary_decade: primaryDecade,
    decades: [...allDecades].sort((a, b) => a - b),
    era_labels: [...allEras],
    source: "wikidata"
  };
}

/**
 * Parse a single Wikidata period label into decades and eras.
 */
function parsePeriodLabel(label) {
  if (!label) return null;
  const lower = label.toLowerCase().trim();

  // Try to match a specific decade: "1940s", "1970s", etc.
  const decadeMatch = lower.match(/^(\d{3})0s$/);
  if (decadeMatch) {
    const decade = parseInt(decadeMatch[1] + "0");
    return {
      decades: [decade],
      eras: getErasForDecade(decade),
      primaryDecade: decade
    };
  }

  // Try to match a century: "20th century", "19th century", etc.
  const centuryMatch = lower.match(/^(\d{1,2})(?:st|nd|rd|th)\s+century$/);
  if (centuryMatch) {
    const centuryNum = parseInt(centuryMatch[1]);
    const startDecade = (centuryNum - 1) * 100;
    const decades = [];
    for (let d = startDecade; d < startDecade + 100; d += 10) {
      decades.push(d);
    }
    return {
      decades,
      eras: getErasForDecade(startDecade + 50), // mid-century for era lookup
      primaryDecade: startDecade + 50
    };
  }

  // Try to match a specific year: "1942", "2001", etc.
  const yearMatch = lower.match(/^(\d{4})$/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    const decade = Math.floor(year / 10) * 10;
    return {
      decades: [decade],
      eras: getErasForDecade(decade),
      primaryDecade: decade
    };
  }

  // Try to match known era labels from ERA_DECADE_MAP
  for (const [era, decades] of Object.entries(require("./era-decade-map").ERA_DECADE_MAP)) {
    if (lower === era.toLowerCase() || lower.includes(era.toLowerCase())) {
      const primaryDecade = decades.length > 0 ? decades[Math.floor(decades.length / 2)] : null;
      return {
        decades: [...decades],
        eras: [era],
        primaryDecade
      };
    }
  }

  // Common Wikidata labels that don't map cleanly
  const wikidataEraMap = {
    "antiquity": { decades: [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400], eras: ["Ancient", "Classical"] },
    "middle ages": { decades: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400], eras: ["Medieval"] },
    "early modern period": { decades: [1500, 1600, 1700], eras: ["Renaissance", "Colonial"] },
    "modern period": { decades: [1800, 1850, 1900, 1950, 2000], eras: ["Modern Day"] },
    "contemporary": { decades: [2000, 2010, 2020], eras: ["Contemporary"] },
    "stone age": { decades: [-100000, -10000, -5000], eras: ["Prehistoric"] },
    "bronze age": { decades: [-3000, -2000, -1000], eras: ["Ancient"] },
    "iron age": { decades: [-1000, -500], eras: ["Ancient"] },
    "great depression": { decades: [1930], eras: ["Great Depression", "Interwar"] },
    "prohibition": { decades: [1920, 1930], eras: ["Roaring Twenties", "Interwar"] },
    "cold war": { decades: [1940, 1950, 1960, 1970, 1980], eras: ["Cold War"] },
    "world war i": { decades: [1910], eras: ["World War I"] },
    "world war ii": { decades: [1930, 1940], eras: ["World War II"] },
    "second world war": { decades: [1930, 1940], eras: ["World War II"] },
    "first world war": { decades: [1910], eras: ["World War I"] },
    "vietnam war": { decades: [1960, 1970], eras: ["Vietnam Era"] },
    "american civil war": { decades: [1860], eras: ["American Civil War"] },
    "french revolution": { decades: [1780, 1790], eras: ["French Revolution"] },
    "napoleonic wars": { decades: [1800, 1810], eras: ["Napoleonic"] },
    "renaissance": { decades: [1300, 1400, 1500], eras: ["Renaissance"] },
    "industrial revolution": { decades: [1760, 1770, 1780, 1790, 1800, 1810, 1820, 1830, 1840], eras: ["Victorian"] },
    "roman empire": { decades: [-100, 0, 100, 200, 300, 400], eras: ["Roman Empire"] },
    "future": { decades: [2030, 2040, 2050, 2100], eras: ["Near Future", "Far Future"] }
  };

  for (const [key, val] of Object.entries(wikidataEraMap)) {
    if (lower === key || lower.includes(key)) {
      const pd = val.decades.length > 0 ? val.decades[Math.floor(val.decades.length / 2)] : null;
      return { decades: val.decades, eras: val.eras, primaryDecade: pd };
    }
  }

  // Unrecognized — return null (will be handled by AI later)
  return null;
}


// ============================================
// PHASE 2: TMDB keyword extraction
// ============================================

const BASED_ON_KEYWORDS = {
  "based-on-true-story": 9672,
  "biography": 5765,
  "based-on-real-events": 179430,
  "based-on-novel": 818,
  "based-on-book": 291078,
  "based-on-short-story": 155710,
  "based-on-play": 10349,
  "based-on-comic": 9717,
  "based-on-video-game": 12564,
  "based-on-tv-series": 291226,
  "remake": 9691,
  "reboot": 173461,
  "sequel": 10683,
  "prequel": 161257,
  "spin-off": 195506
};

const LOCATION_KEYWORD_MAP = {
  "new york": { primary: "New York", country: "United States", lat: 40.71, lng: -74.01 },
  "los angeles": { primary: "Los Angeles", country: "United States", lat: 34.05, lng: -118.24 },
  "london": { primary: "London", country: "United Kingdom", lat: 51.51, lng: -0.13 },
  "paris": { primary: "Paris", country: "France", lat: 48.86, lng: 2.35 },
  "tokyo": { primary: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69 },
  "rome": { primary: "Rome", country: "Italy", lat: 41.90, lng: 12.50 },
  "berlin": { primary: "Berlin", country: "Germany", lat: 52.52, lng: 13.41 },
  "chicago": { primary: "Chicago", country: "United States", lat: 41.88, lng: -87.63 },
  "san francisco": { primary: "San Francisco", country: "United States", lat: 37.77, lng: -122.42 },
  "hong kong": { primary: "Hong Kong", country: "China", lat: 22.32, lng: 114.17 },
  "moscow": { primary: "Moscow", country: "Russia", lat: 55.76, lng: 37.62 },
  "sydney": { primary: "Sydney", country: "Australia", lat: -33.87, lng: 151.21 },
  "mumbai": { primary: "Mumbai", country: "India", lat: 19.08, lng: 72.88 },
  "seoul": { primary: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98 },
  "mexico city": { primary: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13 },
  "rio de janeiro": { primary: "Rio de Janeiro", country: "Brazil", lat: -22.91, lng: -43.17 },
  "istanbul": { primary: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98 },
  "cairo": { primary: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24 },
  "bangkok": { primary: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.50 },
  "amsterdam": { primary: "Amsterdam", country: "Netherlands", lat: 52.37, lng: 4.90 },
  "dublin": { primary: "Dublin", country: "Ireland", lat: 53.35, lng: -6.26 },
  "madrid": { primary: "Madrid", country: "Spain", lat: 40.42, lng: -3.70 },
  "venice": { primary: "Venice", country: "Italy", lat: 45.44, lng: 12.32 },
  "las vegas": { primary: "Las Vegas", country: "United States", lat: 36.17, lng: -115.14 },
  "washington d.c.": { primary: "Washington D.C.", country: "United States", lat: 38.91, lng: -77.04 },
  "miami": { primary: "Miami", country: "United States", lat: 25.76, lng: -80.19 },
  "boston": { primary: "Boston", country: "United States", lat: 42.36, lng: -71.06 },
  "detroit": { primary: "Detroit", country: "United States", lat: 42.33, lng: -83.05 },
  "philadelphia": { primary: "Philadelphia", country: "United States", lat: 39.95, lng: -75.17 },
  "new orleans": { primary: "New Orleans", country: "United States", lat: 29.95, lng: -90.07 }
};

async function phase2() {
  console.log("[Phase 2] TMDB keyword extraction...\n");

  const seed = loadJSON(SEED_FILE);
  if (!seed || !seed.movies) {
    console.error("Error: orbit-settings-seed.json not found. Run phase0 first.");
    process.exit(1);
  }

  let settings = loadJSON(SETTINGS_FILE);
  if (!settings) {
    settings = {
      meta: { version: "1.0", generated: new Date().toISOString(), movie_count: 0, sources: ["wikidata", "tmdb_keywords", "ai_extracted"] },
      movies: {}
    };
  }

  const seedCount = Object.keys(seed.movies).length;
  const basedOnById = {};
  for (const [name, id] of Object.entries(BASED_ON_KEYWORDS)) {
    basedOnById[id] = name;
  }

  // Counters
  const typeCounts = {};
  let locationSupplemented = 0;

  for (const [tmdbId, movie] of Object.entries(seed.movies)) {
    if (!settings.movies[tmdbId]) settings.movies[tmdbId] = {};
    const entry = settings.movies[tmdbId];
    const keywords = movie.keywords || [];

    // --- Step 2A: Based-on classification ---
    if (!entry.based_on) {
      const keywordIds = new Set(keywords.map(k => k.id));
      const keywordNames = keywords.map(k => k.name.toLowerCase());
      let type = "original";

      // Priority 1: sequel/prequel/spin-off/remake/reboot
      if (keywordIds.has(10683)) type = "sequel";
      else if (keywordIds.has(161257)) type = "prequel";
      else if (keywordIds.has(195506)) type = "spin-off";
      else if (keywordIds.has(9691)) type = "remake";
      else if (keywordIds.has(173461)) type = "reboot";
      // Priority 2: based-on-novel/book
      else if (keywordIds.has(818) || keywordIds.has(291078)) type = "novel";
      // Priority 3: true story/biography/real events
      else if (keywordIds.has(9672) || keywordIds.has(5765) || keywordIds.has(179430)) type = "true_story";
      // Priority 4: short story
      else if (keywordIds.has(155710)) type = "short_story";
      // Priority 5: play
      else if (keywordIds.has(10349)) type = "play";
      // Priority 6: comic
      else if (keywordIds.has(9717)) type = "comic";
      // Priority 7: video game
      else if (keywordIds.has(12564)) type = "video_game";
      // Priority 8: TV series
      else if (keywordIds.has(291226)) type = "tv_series";
      else {
        // Fallback: check keyword names
        for (const name of keywordNames) {
          if ((name.includes("based on") && (name.includes("novel") || name.includes("book")))) {
            type = "novel"; break;
          }
          if ((name.includes("based on") && (name.includes("true") || name.includes("real")))) {
            type = "true_story"; break;
          }
          if (name.includes("biography") || name.includes("biopic")) {
            type = "true_story"; break;
          }
        }
      }

      entry.based_on = {
        type,
        detail: null,
        source: "tmdb_keywords"
      };
    }
    typeCounts[entry.based_on.type] = (typeCounts[entry.based_on.type] || 0) + 1;

    // --- Step 2B: Location keyword supplement ---
    if (!entry.location) {
      const matchedLocations = [];
      for (const keyword of keywords) {
        const kwLower = keyword.name.toLowerCase();
        for (const [locKey, locData] of Object.entries(LOCATION_KEYWORD_MAP)) {
          if (kwLower.includes(locKey) || locKey.includes(kwLower)) {
            // Avoid duplicates
            if (!matchedLocations.some(l => l.primary === locData.primary)) {
              matchedLocations.push(locData);
            }
          }
        }
      }

      if (matchedLocations.length > 0) {
        entry.location = {
          primary: matchedLocations.map(l => l.primary),
          country: [...new Set(matchedLocations.map(l => l.country))],
          coordinates: matchedLocations.map(l => ({ lat: l.lat, lng: l.lng, label: l.primary })),
          source: "tmdb_keywords"
        };
        locationSupplemented++;
      }
    }
  }

  // Count Wikidata location entries
  let wikidataLocCount = 0;
  for (const entry of Object.values(settings.movies)) {
    if (entry.location && entry.location.source === "wikidata") wikidataLocCount++;
  }

  console.log(`[Phase 2] TMDB keyword extraction complete:`);
  console.log(`  Based-on classified: ${Object.values(typeCounts).reduce((a, b) => a + b, 0)} / ${seedCount}`);
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    - ${type}: ${count}`);
  }
  console.log(`  Location supplemented: ${locationSupplemented} movies (keywords filled Wikidata gaps)`);
  console.log(`  Total location coverage: ${wikidataLocCount + locationSupplemented} / ${seedCount}`);

  settings.meta.generated = new Date().toISOString();
  settings.meta.movie_count = Object.keys(settings.movies).length;
  saveJSON(SETTINGS_FILE, settings);
  console.log("  Saved orbit-movie-settings.json");
}


// ============================================
// CLI ENTRY POINT
// ============================================

const command = process.argv[2];

if (!command || !["phase0", "phase1", "phase2"].includes(command)) {
  console.log("Usage: node generate-settings-seed.js <phase0|phase1|phase2>");
  console.log("");
  console.log("  phase0  Build target list from local sources + fetch TMDB data");
  console.log("  phase1  Import locations & time periods from Wikidata SPARQL");
  console.log("  phase2  Extract based-on type & locations from TMDB keywords");
  process.exit(0);
}

(async () => {
  const start = Date.now();
  try {
    if (command === "phase0") await phase0();
    else if (command === "phase1") await phase1();
    else if (command === "phase2") await phase2();
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
})();
