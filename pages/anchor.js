/* ============================================================
   ANCHOR VIEW — anchor.js
   Constellation discovery view centred on a chosen film.
   Context A: anchor from Orbit search — surrounding films
              come from the saved constellationMovies pool.
   Context B: anchor from anywhere else — surrounding films
              come from TMDB recommendations.
   Reads: localStorage 'anchorMovie', 'anchorFromResults',
          'constellationMovies'
   API calls: 0 in Context A on load (uses stored results)
              2 in Context B on load (recommendations + similar)
              2-3 on Expand My Universe
   Added: 2026-03-29
   ============================================================ */

const TMDB_IMG = OrbitUtils.TMDB_IMG;
let currentPool = [];
let expandCount = 0;
let anchorCredits = null; // cached anchor credits

// ============================================
// CREDITS FETCH + CACHE
// ============================================

async function fetchCredits(movieId) {
  const cacheKey = 'orbit_credits_' + movieId;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 60 * 60 * 1000) return parsed.data;
    }
  } catch (e) {}

  try {
    const data = await OrbitUtils.tmdbFetch('/movie/' + movieId + '/credits', { language: 'en-US' });
    const topCast = (data.cast || []).slice(0, 8).map(p => p.id);
    const directorEntry = (data.crew || []).find(c => c.job === 'Director');
    const credits = {
      castIds: topCast,
      directorId: directorEntry ? directorEntry.id : null,
      directorName: directorEntry ? directorEntry.name : null
    };
    sessionStorage.setItem(cacheKey, JSON.stringify({ data: credits, timestamp: Date.now() }));
    return credits;
  } catch (e) {
    return { castIds: [], directorId: null, directorName: null };
  }
}

async function fetchDetails(movieId) {
  const cacheKey = 'orbit_details_' + movieId;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 60 * 60 * 1000) return parsed.data;
    }
  } catch (e) {}

  try {
    const data = await OrbitUtils.tmdbFetch('/movie/' + movieId, { language: 'en-US' });
    const details = {
      budget: data.budget || 0,
      revenue: data.revenue || 0,
      vote_average: data.vote_average || 0,
      vote_count: data.vote_count || 0
    };
    sessionStorage.setItem(cacheKey, JSON.stringify({ data: details, timestamp: Date.now() }));
    return details;
  } catch (e) {
    return { budget: 0, revenue: 0, vote_average: 0, vote_count: 0 };
  }
}

async function enrichFilmsWithCredits(films) {
  const batchSize = 5;
  for (let i = 0; i < films.length; i += batchSize) {
    const batch = films.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(f =>
      Promise.all([fetchCredits(f.id), fetchDetails(f.id)])
    ));
    for (let j = 0; j < batch.length; j++) {
      batch[j]._credits = results[j][0];
      batch[j]._details = results[j][1];
    }
  }
  return films;
}

// ============================================
// SIMILARITY SCORING
// ============================================

// ---- Expansion Tier Decay Tables ----
// Each tier shifts weight away from Genre toward Director/Era/Awards.

const TIER_WEIGHTS_DECORATED = [
  // Tier 0 — Orbit
  { genre: 0.52, castDna: 0.15, era: 0.08, director: 0.08, awards: 0.09, budgetBo: 0.08 },
  // Tier 1 — Outer Orbit
  { genre: 0.43, castDna: 0.15, era: 0.10, director: 0.10, awards: 0.14, budgetBo: 0.08 },
  // Tier 2 — Deep Space
  { genre: 0.33, castDna: 0.14, era: 0.13, director: 0.13, awards: 0.19, budgetBo: 0.08 },
  // Tier 3 — The Void
  { genre: 0.20, castDna: 0.12, era: 0.16, director: 0.17, awards: 0.27, budgetBo: 0.08 }
];

const TIER_WEIGHTS_UNDECORATED = [
  // Tier 0 — Orbit
  { genre: 0.58, castDna: 0.16, era: 0.09, director: 0.09, awards: 0.00, budgetBo: 0.08 },
  // Tier 1 — Outer Orbit
  { genre: 0.50, castDna: 0.16, era: 0.11, director: 0.11, awards: 0.00, budgetBo: 0.12 },
  // Tier 2 — Deep Space
  { genre: 0.39, castDna: 0.15, era: 0.14, director: 0.14, awards: 0.00, budgetBo: 0.18 },
  // Tier 3 — The Void
  { genre: 0.25, castDna: 0.13, era: 0.18, director: 0.19, awards: 0.00, budgetBo: 0.25 }
];

// Ring definitions: max films, label, min score threshold
const RING_DEFS = [
  { maxFilms: 6,  orbitClass: 'orbit-1', label: 'ORBIT',       minScore: 45 },
  { maxFilms: 10, orbitClass: 'orbit-2', label: 'OUTER ORBIT', minScore: 35 },
  { maxFilms: 14, orbitClass: 'orbit-3', label: 'DEEP SPACE',  minScore: 25 },
  { maxFilms: 20, orbitClass: 'orbit-4', label: 'THE VOID',    minScore: 20 }
];

// ---- Awards Tier Classification ----
// Returns 'decorated', 'recognised', or 'undecorated'
function classifyAwardsTier(film) {
  const avg = film.vote_average || (film._details ? film._details.vote_average : 0);
  const count = film.vote_count || (film._details ? film._details.vote_count : 0);
  if (avg >= 7.5 && count >= 2000) return 'decorated';
  if (avg >= 6.8 && count >= 1000) return 'recognised';
  return 'undecorated';
}

// Awards pair scoring matrix
const AWARDS_MATRIX = {
  'decorated:decorated':     100,
  'decorated:recognised':     60,
  'recognised:decorated':     60,
  'recognised:recognised':    80,
  'decorated:undecorated':    20,
  'undecorated:decorated':    20,
  'recognised:undecorated':   30,
  'undecorated:recognised':   30,
  'undecorated:undecorated':   0
};

function scoreAwards(anchorTier, candidateTier) {
  return AWARDS_MATRIX[anchorTier + ':' + candidateTier] || 0;
}

// ---- Budget/BO Production Tier ----
const BUDGET_TIERS = [
  { max: 5e6,   tier: 1 }, // Micro
  { max: 30e6,  tier: 2 }, // Independent
  { max: 80e6,  tier: 3 }, // Mid-Range
  { max: 150e6, tier: 4 }, // Studio
  { max: Infinity, tier: 5 }  // Tentpole
];

function classifyBudgetTier(film) {
  const d = film._details || {};
  let budget = d.budget || 0;
  const revenue = d.revenue || 0;

  // If budget missing, use revenue / 3 as proxy
  if (!budget && revenue) budget = revenue / 3;

  // Both missing — return null (neutral scoring)
  if (!budget) return null;

  for (const b of BUDGET_TIERS) {
    if (budget < b.max) return b.tier;
  }
  return 5;
}

function scoreBudgetBO(anchor, candidate) {
  const aTier = classifyBudgetTier(anchor);
  const cTier = classifyBudgetTier(candidate);

  // If either is unknown, neutral score
  if (aTier === null || cTier === null) return 50;

  const tierDiff = Math.abs(aTier - cTier);
  let tierScore;
  if (tierDiff === 0) tierScore = 100;
  else if (tierDiff === 1) tierScore = 60;
  else if (tierDiff === 2) tierScore = 25;
  else tierScore = 0;

  // Performance ratio bonus (only if tier match > 0)
  let bonus = 0;
  if (tierScore > 0) {
    const aBonus = perfBonus(anchor);
    const cBonus = perfBonus(candidate);
    // Both overperformed = full bonus, one = half
    bonus = (aBonus + cBonus) / 2;
  }

  return Math.min(100, tierScore + bonus);
}

function perfBonus(film) {
  const d = film._details || {};
  const budget = d.budget || 0;
  const revenue = d.revenue || 0;
  if (!budget || !revenue) return 0;
  const ratio = revenue / budget;
  if (ratio >= 3) return 20;
  if (ratio >= 1) return 10;
  return 0;
}

// ---- Main Scoring Function ----
// tier: 0–3 (Orbit → The Void)
// scoringCredits: credits object to use for the anchor side (allows anchor-switch)

function calculateSimilarity(anchor, candidate, tier, scoringCredits) {
  tier = tier || 0;
  const usedCredits = scoringCredits || anchorCredits;

  // Determine anchor awards tier and select weight table
  const anchorAwardsTier = classifyAwardsTier(anchor);
  const anchorIsRated = anchorAwardsTier === 'decorated' || anchorAwardsTier === 'recognised';
  const table = anchorIsRated ? TIER_WEIGHTS_DECORATED : TIER_WEIGHTS_UNDECORATED;
  const W = table[tier] || table[0];

  // --- Genre (Jaccard) ---
  const aGenres = anchor.genre_ids || (anchor.genres || []).map(g => g.id) || [];
  const cGenres = candidate.genre_ids || (candidate.genres || []).map(g => g.id) || [];
  let genreScore = 0;
  if (aGenres.length && cGenres.length) {
    const setA = new Set(aGenres);
    const setC = new Set(cGenres);
    const intersection = [...setA].filter(id => setC.has(id)).length;
    const union = new Set([...aGenres, ...cGenres]).size;
    genreScore = (intersection / union) * 100;
  }

  // --- Cast DNA (shared person IDs in top-8 cast) ---
  let castScore = 0;
  const aCast = usedCredits ? usedCredits.castIds : [];
  const cCast = candidate._credits ? candidate._credits.castIds : [];
  if (aCast.length && cCast.length) {
    const castSet = new Set(aCast);
    const shared = cCast.filter(id => castSet.has(id)).length;
    castScore = (shared / 8) * 100;
  }

  // --- Era (release year proximity) ---
  const aYear = anchor.release_date ? parseInt(anchor.release_date.substring(0, 4)) : 0;
  const cYear = candidate.release_date ? parseInt(candidate.release_date.substring(0, 4)) : 0;
  let eraScore = 0;
  if (aYear && cYear) {
    const diff = Math.abs(aYear - cYear);
    if (diff <= 10) eraScore = 100;
    else if (diff <= 20) eraScore = 50;
    else eraScore = 0;
  }

  // --- Director (exact match) ---
  let directorScore = 0;
  const aDirId = usedCredits ? usedCredits.directorId : null;
  const cDirId = candidate._credits ? candidate._credits.directorId : null;
  if (aDirId && cDirId && aDirId === cDirId) {
    directorScore = 100;
  }

  // --- Awards tier pairing ---
  const candidateAwardsTier = classifyAwardsTier(candidate);
  const awardsScore = scoreAwards(anchorAwardsTier, candidateAwardsTier);

  // --- Budget/BO production tier ---
  const budgetBoScore = scoreBudgetBO(anchor, candidate);

  const total =
    genreScore    * W.genre +
    castScore     * W.castDna +
    eraScore      * W.era +
    directorScore * W.director +
    awardsScore   * W.awards +
    budgetBoScore * W.budgetBo;

  return Math.round(total * 10) / 10;
}

// ---- Tier-aware scoring: assign films to 4 rings ----

function scoreByTiers(anchor, films) {
  // First pass: score all candidates at Tier 0 and sort
  const allScored = films.map(f => ({
    film: f,
    score: calculateSimilarity(anchor, f, 0)
  }));
  allScored.sort((a, b) => b.score - a.score);

  const assigned = new Set();
  const rings = []; // array of { ring, films[] }

  // Tier 0 — Orbit
  const tier0Films = [];
  for (const entry of allScored) {
    if (tier0Films.length >= RING_DEFS[0].maxFilms) break;
    if (entry.score >= RING_DEFS[0].minScore) {
      entry.film._similarityScore = entry.score;
      entry.film._orbitTier = 0;
      tier0Films.push(entry.film);
      assigned.add(entry.film.id);
    }
  }
  rings.push({ ring: RING_DEFS[0], films: tier0Films });

  // Remaining candidates (not assigned to Tier 0)
  const remaining = films.filter(f => !assigned.has(f.id));

  // Tiers 1–2 — Outer Orbit, Deep Space
  for (let t = 1; t <= 2; t++) {
    const def = RING_DEFS[t];
    const scored = remaining.filter(f => !assigned.has(f.id)).map(f => ({
      film: f,
      score: calculateSimilarity(anchor, f, t)
    }));
    scored.sort((a, b) => b.score - a.score);

    const tierFilms = [];
    for (const entry of scored) {
      if (tierFilms.length >= def.maxFilms) break;
      if (entry.score >= def.minScore) {
        entry.film._similarityScore = entry.score;
        entry.film._orbitTier = t;
        tierFilms.push(entry.film);
        assigned.add(entry.film.id);
      }
    }
    rings.push({ ring: def, films: tierFilms });
  }

  // Tier 3 — The Void (anchor-switch mechanic)
  const def3 = RING_DEFS[3];
  let voidAnchor = anchor;
  let voidCredits = anchorCredits;
  let voidViaTitle = null;

  // Use highest-scoring Tier 0 film as anchor for The Void
  if (tier0Films.length > 0) {
    const topTier0 = tier0Films[0];
    voidAnchor = topTier0;
    voidCredits = topTier0._credits || anchorCredits;
    voidViaTitle = topTier0.title || topTier0.name || null;
  }

  const voidCandidates = remaining.filter(f => !assigned.has(f.id)).map(f => ({
    film: f,
    score: calculateSimilarity(voidAnchor, f, 3, voidCredits)
  }));
  voidCandidates.sort((a, b) => b.score - a.score);

  const tier3Films = [];
  for (const entry of voidCandidates) {
    if (tier3Films.length >= def3.maxFilms) break;
    if (entry.score >= def3.minScore) {
      entry.film._similarityScore = entry.score;
      entry.film._orbitTier = 3;
      if (voidViaTitle) entry.film._discoveredVia = voidViaTitle;
      tier3Films.push(entry.film);
      assigned.add(entry.film.id);
    }
  }
  rings.push({ ring: def3, films: tier3Films });

  return rings;
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const anchorRaw = localStorage.getItem('anchorMovie');
  if (!anchorRaw) {
    window.location.href = 'home.html';
    return;
  }

  let anchor;
  try { anchor = JSON.parse(anchorRaw); } catch (e) {
    window.location.href = 'home.html';
    return;
  }

  if (!anchor || !anchor.id) {
    window.location.href = 'home.html';
    return;
  }

  // Populate hero
  populateHero(anchor);

  // Init MovieCube
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (newMovie) => {
        localStorage.setItem('anchorMovie', JSON.stringify({
          id: newMovie.id,
          title: newMovie.title,
          poster_path: newMovie.poster_path,
          release_date: newMovie.release_date,
          vote_average: newMovie.vote_average,
          overview: newMovie.overview
        }));
        localStorage.removeItem('anchorFromResults');
        window.location.reload();
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();
  }

  // Wire hero clicks to MovieCube
  const openCube = () => {
    if (typeof openMovieCube === 'function') openMovieCube(anchor.id);
  };
  document.getElementById('anchor-poster')?.addEventListener('click', openCube);
  document.getElementById('anchor-open-cube')?.addEventListener('click', openCube);

  // Fetch anchor credits + details before loading films
  Promise.all([fetchCredits(anchor.id), fetchDetails(anchor.id)]).then(([credits, details]) => {
    anchorCredits = credits;
    anchor._details = details;
    // Backfill vote_count if missing from localStorage object
    if (!anchor.vote_count && details.vote_count) anchor.vote_count = details.vote_count;
    if (!anchor.vote_average && details.vote_average) anchor.vote_average = details.vote_average;

    // Detect context
    const fromResults = localStorage.getItem('anchorFromResults') === 'true';

    if (fromResults) {
      loadFromResultsPool(anchor);
    } else {
      loadFromRecommendations(anchor, false);
    }
  });

  // Wire expand button
  document.getElementById('expand-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('expand-btn');
    btn.classList.add('loading');
    localStorage.removeItem('anchorFromResults');
    expandCount++;
    await loadFromRecommendations(anchor, true);
    btn.classList.remove('loading');
    btn.innerHTML = '<span class="og og-galaxy"></span> EXPLORE DEEPER';
  });
});

// ============================================
// POPULATE HERO
// ============================================

function populateHero(movie) {
  const posterEl = document.getElementById('anchor-poster');
  if (posterEl && movie.poster_path) {
    posterEl.style.backgroundImage = `url(${TMDB_IMG}w500${movie.poster_path})`;
  }

  const titleEl = document.getElementById('anchor-title');
  if (titleEl) titleEl.textContent = movie.title || '\u2014';

  const metaEl = document.getElementById('anchor-meta');
  if (metaEl) {
    const year = (movie.release_date || '').substring(0, 4);
    const rating = movie.vote_average ? '\u2605 ' + Number(movie.vote_average).toFixed(1) : '';
    metaEl.textContent = [year, rating].filter(Boolean).join('  \u00B7  ');
  }

  const overviewEl = document.getElementById('anchor-overview');
  if (overviewEl && movie.overview) {
    overviewEl.textContent = movie.overview.length > 200
      ? movie.overview.substring(0, 200) + '\u2026'
      : movie.overview;
  }
}

// ============================================
// CONTEXT A: LOAD FROM RESULTS POOL
// ============================================

async function loadFromResultsPool(anchor) {
  let pool = [];
  try {
    const raw = localStorage.getItem('constellationMovies');
    if (raw) pool = JSON.parse(raw);
  } catch (e) {}

  // Filter out anchor film
  pool = (pool || []).filter(m => m && m.id !== anchor.id);

  if (pool.length === 0) {
    // Fallback to Context B if pool is empty
    loadFromRecommendations(anchor, false);
    return;
  }

  pool = pool.slice(0, 50);

  // Enrich with credits and score by tiers
  await enrichFilmsWithCredits(pool);
  const rings = scoreByTiers(anchor, pool);
  currentPool = rings.flatMap(r => r.films);

  const labelEl = document.getElementById('constellation-label');
  if (labelEl) labelEl.textContent = 'FILMS FROM YOUR ORBIT SEARCH';

  renderConstellationGrid(rings);
}

// ============================================
// CONTEXT B: LOAD FROM TMDB RECOMMENDATIONS
// ============================================

async function loadFromRecommendations(anchor, isExpand) {
  const movieId = anchor.id;
  const loadingEl = document.getElementById('constellation-loading');
  if (isExpand && loadingEl) loadingEl.classList.remove('hidden');

  const cacheKey = 'orbit_anchor_recs_' + movieId + '_' + expandCount;

  // Check cache (raw TMDB results only — scoring happens after)
  let films = null;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        films = parsed.data;
      }
    }
  } catch (e) {}

  if (!films) {
    try {
      const page = isExpand ? 2 : 1;
      const [recs, similar] = await Promise.all([
        OrbitUtils.tmdbFetch('/movie/' + movieId + '/recommendations', { language: 'en-US', page: page }),
        OrbitUtils.tmdbFetch('/movie/' + movieId + '/similar', { language: 'en-US', page: page })
      ]);

      // Combine and deduplicate
      const combined = [...(recs.results || []), ...(similar.results || [])];
      const seen = new Set();
      films = [];
      for (const m of combined) {
        if (m && m.id !== movieId && m.poster_path && !seen.has(m.id)) {
          seen.add(m.id);
          films.push(m);
        }
      }

      films = films.slice(0, isExpand ? 50 : 50);

      sessionStorage.setItem(cacheKey, JSON.stringify({ data: films, timestamp: Date.now() }));
    } catch (e) {
      console.warn('[ORBIT Anchor] Failed to load recommendations:', e);
      films = [];
    }
  }

  // Enrich with credits and score by tiers
  await enrichFilmsWithCredits(films);
  const rings = scoreByTiers(anchor, films);

  if (loadingEl) loadingEl.classList.add('hidden');

  currentPool = rings.flatMap(r => r.films);

  const labelEl = document.getElementById('constellation-label');
  if (labelEl) {
    labelEl.textContent = isExpand ? 'EXPANDED UNIVERSE' : 'FILMS IN ORBIT';
  }

  if (currentPool.length === 0) {
    document.getElementById('constellation-grid').innerHTML = '';
    const emptyEl = document.getElementById('constellation-empty');
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  renderConstellationGrid(rings);
}

// ============================================
// RENDER GRID
// ============================================

function renderConstellationGrid(rings) {
  const grid = document.getElementById('constellation-grid');
  const countEl = document.getElementById('constellation-count');
  const emptyEl = document.getElementById('constellation-empty');

  if (emptyEl) emptyEl.classList.add('hidden');

  const totalFilms = rings.reduce((sum, r) => sum + r.films.length, 0);
  if (countEl) countEl.textContent = totalFilms + ' FILMS';

  let html = '';
  for (const { ring, films } of rings) {
    html += `<div class="constellation-ring ${ring.orbitClass}">`;
    html += `<div class="constellation-ring-label">${ring.label}</div>`;

    if (films.length === 0) {
      html += `<div class="constellation-ring-empty">No further connections found</div>`;
    } else {
      html += `<div class="constellation-ring-grid">`;
      for (const m of films) {
        const posterUrl = m.poster_path ? TMDB_IMG + 'w342' + m.poster_path : '';
        const year = (m.release_date || '').substring(0, 4);
        const title = m.title || m.name || 'Unknown';
        const viaAttr = m._discoveredVia
          ? ` data-discovered-via="${m._discoveredVia.replace(/"/g, '&quot;')}" title="Discovered via ${m._discoveredVia.replace(/"/g, '&quot;')}"`
          : '';

        html += `<div class="constellation-film-tile ${ring.orbitClass}" data-movie-id="${m.id}"${viaAttr}>
          <div class="constellation-film-poster" style="background-image:url(${posterUrl})"></div>
          <div class="constellation-film-info">
            <div class="constellation-film-title">${title}</div>
            ${year ? `<div class="constellation-film-year">${year}</div>` : ''}
            ${m._discoveredVia ? `<div class="constellation-film-via">via ${m._discoveredVia}</div>` : ''}
          </div>
        </div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }

  grid.innerHTML = html;

  // Wire clicks to MovieCube
  grid.querySelectorAll('.constellation-film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const id = parseInt(tile.dataset.movieId);
      if (id && typeof openMovieCube === 'function') openMovieCube(id);
    });
  });
}
