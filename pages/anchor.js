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

  // Detect context
  const fromResults = localStorage.getItem('anchorFromResults') === 'true';

  if (fromResults) {
    loadFromResultsPool(anchor.id);
  } else {
    loadFromRecommendations(anchor.id, false);
  }

  // Wire expand button
  document.getElementById('expand-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('expand-btn');
    btn.classList.add('loading');
    localStorage.removeItem('anchorFromResults');
    expandCount++;
    await loadFromRecommendations(anchor.id, true);
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

function loadFromResultsPool(anchorId) {
  let pool = [];
  try {
    const raw = localStorage.getItem('constellationMovies');
    if (raw) pool = JSON.parse(raw);
  } catch (e) {}

  // Filter out anchor film
  pool = (pool || []).filter(m => m && m.id !== anchorId);

  if (pool.length === 0) {
    // Fallback to Context B if pool is empty
    loadFromRecommendations(anchorId, false);
    return;
  }

  currentPool = pool.slice(0, 30);

  const labelEl = document.getElementById('constellation-label');
  if (labelEl) labelEl.textContent = 'FILMS FROM YOUR ORBIT SEARCH';

  renderConstellationGrid(currentPool);
}

// ============================================
// CONTEXT B: LOAD FROM TMDB RECOMMENDATIONS
// ============================================

async function loadFromRecommendations(movieId, isExpand) {
  const loadingEl = document.getElementById('constellation-loading');
  if (isExpand && loadingEl) loadingEl.classList.remove('hidden');

  const cacheKey = 'orbit_anchor_recs_' + movieId + '_' + expandCount;

  // Check cache
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

      // Shuffle (Fisher-Yates)
      for (let i = films.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [films[i], films[j]] = [films[j], films[i]];
      }

      films = films.slice(0, isExpand ? 40 : 30);

      sessionStorage.setItem(cacheKey, JSON.stringify({ data: films, timestamp: Date.now() }));
    } catch (e) {
      console.warn('[ORBIT Anchor] Failed to load recommendations:', e);
      films = [];
    }
  }

  if (loadingEl) loadingEl.classList.add('hidden');

  currentPool = films;

  const labelEl = document.getElementById('constellation-label');
  if (labelEl) {
    labelEl.textContent = isExpand ? 'EXPANDED UNIVERSE' : 'FILMS IN ORBIT';
  }

  if (films.length === 0) {
    document.getElementById('constellation-grid').innerHTML = '';
    const emptyEl = document.getElementById('constellation-empty');
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  renderConstellationGrid(films);
}

// ============================================
// RENDER GRID
// ============================================

function renderConstellationGrid(films) {
  const grid = document.getElementById('constellation-grid');
  const countEl = document.getElementById('constellation-count');
  const emptyEl = document.getElementById('constellation-empty');

  if (emptyEl) emptyEl.classList.add('hidden');
  if (countEl) countEl.textContent = films.length + ' FILMS';

  grid.innerHTML = films.map(m => {
    const posterUrl = m.poster_path ? TMDB_IMG + 'w342' + m.poster_path : '';
    const year = (m.release_date || '').substring(0, 4);
    const title = m.title || m.name || 'Unknown';

    return `<div class="constellation-film-tile" data-movie-id="${m.id}">
      <div class="constellation-film-poster" style="background-image:url(${posterUrl})"></div>
      <div class="constellation-film-info">
        <div class="constellation-film-title">${title}</div>
        ${year ? `<div class="constellation-film-year">${year}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // Wire clicks to MovieCube
  grid.querySelectorAll('.constellation-film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const id = parseInt(tile.dataset.movieId);
      if (id && typeof openMovieCube === 'function') openMovieCube(id);
    });
  });
}
