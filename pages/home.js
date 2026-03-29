/* ============================================================
   HOME PAGE LOGIC — ORBIT Cinematic Landing Page
   Responsibilities:
   - Featured anchor film via TMDB (1 API call, daily rotation)
   - Trending films + actors via TMDB (2 API calls on load)
   - Mosaic poster image population (3 API calls)
   - Showcase carousel tab switching
   - Search bar submit handling
   API CALL VOLUME: 6 calls on load (1 anchor film, 1 trending movies,
   1 trending people, 3 mosaic). All cached in sessionStorage.
   Added: 2026-03-28
   ============================================================ */

const TMDB_IMG = OrbitUtils.TMDB_IMG;

/* ----------------------------------------------------------
   SECTION 1 — FEATURED ANCHOR FILMS — Daily rotation
   Curated selection of cinematically significant films.
   Rotates daily using day-of-year index.
   ---------------------------------------------------------- */

const ANCHOR_FILM_IDS = [
  238, 278, 240, 424, 389, 129, 19404, 637, 372058, 680,
  13, 155, 11216, 245891, 497, 769, 598, 27205, 157336, 289,
  311, 539, 77338, 274, 510, 197, 429, 73, 207, 78,
  105, 122, 120, 8587, 585, 862, 348, 218, 11, 601,
  953, 324552, 490132, 530385, 496243
/* ----------------------------------------------------------
   SECTION 2 — loadAnchorFilm()
   Fetches today's featured film from TMDB and populates the
   hero anchor panel. 1 API call, cached in sessionStorage.
   ---------------------------------------------------------- */

async function loadAnchorFilm() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const movieId = ANCHOR_FILM_IDS[dayOfYear % ANCHOR_FILM_IDS.length];

  const posterEl = document.getElementById('anchor-poster');
  const cacheKey = 'orbit_home_anchor_' + movieId;
  let movie = null;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) movie = JSON.parse(cached);
  } catch (e) {}

  if (!movie) {
    try {
      movie = await OrbitUtils.tmdbFetch('/movie/' + movieId, {
        language: 'en-US',
        append_to_response: 'credits'
      });
      sessionStorage.setItem(cacheKey, JSON.stringify(movie));
    } catch (e) {
      console.warn('[ORBIT Home] Failed to load anchor film:', e);
      return;
    }
  }

  if (!movie) return;

  const director = movie.credits?.crew?.find(p => p.job === 'Director');
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const genre = movie.genres?.[0]?.name || '';
  const posterUrl = movie.poster_path ? TMDB_IMG + 'w500' + movie.poster_path : '';

  if (posterEl && posterUrl) {
    posterEl.classList.remove('loading');
    posterEl.style.backgroundImage = `url(${posterUrl})`;
    posterEl.dataset.movieId = movieId;
  }

  const titleEl = document.getElementById('anchor-title');
  if (titleEl) titleEl.textContent = movie.title || '\u2014';

  const directorEl = document.getElementById('anchor-director');
  if (directorEl) {
    const parts = [director ? director.name : '', year].filter(Boolean);
    directorEl.textContent = parts.join('  \u00B7  ');
  }

  const taglineEl = document.getElementById('anchor-tagline');
  if (taglineEl && movie.tagline) {
    taglineEl.textContent = '\u201C' + movie.tagline + '\u201D';
  }

  const metaEl = document.getElementById('anchor-year-genre');
  if (metaEl) metaEl.textContent = [year, genre].filter(Boolean).join('  \u00B7  ');

  // Badges
  const badgesEl = document.getElementById('anchor-badges');
  if (badgesEl) {
    badgesEl.innerHTML = '';
    if (movie.vote_average && movie.vote_count > 1000) {
      const b = document.createElement('span');
      b.className = 'anchor-badge';
      b.textContent = '\u2605  ' + movie.vote_average.toFixed(1);
      b.style.cssText = 'color:var(--accent-gold);border-color:rgba(255,215,0,0.3);background:rgba(255,215,0,0.07)';
      badgesEl.appendChild(b);
    }
    if (genre) {
      const b = document.createElement('span');
      b.className = 'anchor-badge';
      b.textContent = genre.toUpperCase();
      b.style.cssText = 'color:var(--accent-cyan);border-color:rgba(0,217,255,0.25);background:rgba(0,217,255,0.06)';
      badgesEl.appendChild(b);
    }
  }

  // Wire clicks to MovieCube
  const ctaBtn = document.getElementById('anchor-cta');
  const openCube = () => {
    if (typeof openMovieCube === 'function') openMovieCube(movieId);
    else window.location.href = 'results.html?movie=' + movieId;
  };
  if (posterEl) posterEl.addEventListener('click', openCube);
  if (ctaBtn) ctaBtn.addEventListener('click', openCube);
}

/* ----------------------------------------------------------
   SECTION 3 — loadTrendingFilms()
   ---------------------------------------------------------- */

async function loadTrendingFilms() {
  const CACHE_KEY = 'orbit_home_trending_films';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    // Check sessionStorage cache
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingFilms(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    // Cache with timestamp
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingFilms(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending films', err);
  }
}

function applyTrendingFilms(results) {
  const tiles = document.querySelectorAll('.film-tile');

  results.forEach((movie, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const poster = tile.querySelector('.film-tile-poster');
    if (poster && movie.poster_path) {
      poster.style.backgroundImage = `url(${TMDB_IMG}w342${movie.poster_path})`;
    }

    const title = tile.querySelector('.film-tile-title');
    if (title) title.textContent = movie.title;

    const meta = tile.querySelector('.film-tile-meta');
    if (meta) meta.textContent = (movie.release_date || '').split('-')[0];

    tile.dataset.movieId = movie.id;

    if (movie.vote_count > 5000 && movie.vote_average > 7.5) {
      const badge = tile.querySelector('.film-tile-award');
      if (badge) badge.style.display = 'block';
    }
  });
}

/* ----------------------------------------------------------
   SECTION 4 — loadTrendingPeople()
   ---------------------------------------------------------- */

async function loadTrendingPeople() {
  const CACHE_KEY = 'orbit_home_trending_people';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingPeople(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/person/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingPeople(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending people', err);
  }
}

function applyTrendingPeople(results) {
  const tiles = document.querySelectorAll('.actor-tile');

  results.forEach((person, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const portrait = tile.querySelector('.actor-portrait');
    if (portrait && person.profile_path) {
      portrait.style.backgroundImage = `url(${TMDB_IMG}w185${person.profile_path})`;
    }

    const name = tile.querySelector('.actor-name');
    if (name) name.textContent = person.name;

    const dept = tile.querySelector('.actor-dept');
    if (dept) dept.textContent = person.known_for_department || '';

    tile.dataset.personId = person.id;
    tile.dataset.name = person.name;
  });
}

/* ----------------------------------------------------------
   SECTION 5 — populateMosaic(posterPaths)
   ---------------------------------------------------------- */

async function loadMosaicPosters() {
  const CACHE_KEY = 'orbit_home_mosaic_posters';
  const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        populateMosaic(parsed.data);
        return;
      }
    }

    const [page1, page2, topRated] = await Promise.all([
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 1 }),
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 2 }),
      OrbitUtils.tmdbFetch('/movie/top_rated', { language: 'en-US', page: 1 })
    ]);

    const paths = [
      ...(page1.results || []),
      ...(page2.results || []),
      ...(topRated.results || [])
    ].map(m => m.poster_path).filter(Boolean);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: paths, timestamp: Date.now() }));
    populateMosaic(paths);
  } catch (err) {
    console.warn('ORBIT: Failed to load mosaic posters', err);
  }
}

function populateMosaic(posterPaths) {
  if (!posterPaths || posterPaths.length === 0) return;

  const cells = document.querySelectorAll('.mosaic-cell');
  if (cells.length === 0) return;

  // Fisher-Yates shuffle
  const shuffled = [...posterPaths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure no adjacent cells repeat if we need to extend
  const paths = [];
  let idx = 0;
  for (let i = 0; i < cells.length; i++) {
    if (idx >= shuffled.length) idx = 0;
    // Skip if same as previous to avoid adjacent repeats
    if (i > 0 && paths[i - 1] === shuffled[idx] && shuffled.length > 1) {
      idx = (idx + 1) % shuffled.length;
    }
    paths.push(shuffled[idx]);
    idx++;
  }

  // Staggered fade-in
  cells.forEach((cell, i) => {
    cell.style.opacity = '0';
    cell.style.transition = 'opacity 0.8s ease';
    cell.style.backgroundImage = `url(${TMDB_IMG}w92${paths[i]})`;
    cell.style.backgroundSize = 'cover';
    cell.style.backgroundPosition = 'center';
    setTimeout(() => { cell.style.opacity = '1'; }, 50 * i);
  });
}

/* ----------------------------------------------------------
   SECTION 6 — initShowcase()
   ---------------------------------------------------------- */

function initShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      if (panels[index]) panels[index].classList.add('active');
    });
  });
}

/* ----------------------------------------------------------
   SECTION 7 — initSearch()
   ---------------------------------------------------------- */

function initSearch() {
  const input = document.querySelector('.hero-search-input');
  const btn = document.querySelector('.hero-search-btn');

  function submitSearch() {
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;
    window.location.href = '../index.html?quicksearch=' + encodeURIComponent(q);
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch();
      }
    });
  }

  if (btn) {
    btn.addEventListener('click', submitSearch);
  }

  // Seed suggestion clicks
  document.querySelectorAll('.hero-seed').forEach(seed => {
    seed.addEventListener('click', () => {
      if (!input) return;
      const text = seed.textContent || '';
      // Extract first name (e.g., "Scorsese" from "Scorsese + De Niro")
      const firstName = text.split('+')[0].trim().split('\u00D7')[0].trim();
      input.value = firstName;
      submitSearch();
    });
  });
}

/* ----------------------------------------------------------
   SECTION 8 — initScrollHint()
   ---------------------------------------------------------- */

/* ----------------------------------------------------------
   SECTION 9 — INIT
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Init MovieCube with anchor handler
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        localStorage.setItem('anchorMovie', JSON.stringify(movie));
        localStorage.removeItem('anchorFromResults');
        window.location.href = '../games/constellation.html';
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();
  }

  loadAnchorFilm();
  loadTrendingFilms();
  loadTrendingPeople();
  loadMosaicPosters();
  initShowcase();
  initSearch();

  // Film tiles -> MovieCube (with fallback)
  document.querySelectorAll('.film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const movieId = parseInt(tile.dataset.movieId);
      if (movieId && typeof openMovieCube === 'function') {
        openMovieCube(movieId);
      } else if (movieId) {
        window.location.href = 'results.html?movie=' + movieId;
      }
    });
  });

  // Actor tiles -> Timeline
  document.querySelectorAll('.actor-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const name = tile.dataset.name;
      if (name) window.location.href = 'timeline.html?type=person&search=' + encodeURIComponent(name);
    });
  });
});
