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

/* ============================================================
   HOME CONSTELLATION PREVIEW — Added 2026-03-29
   Shows a mini constellation of a popular film rotating every
   4 hours. Clicking navigates to constellation.html.
   API calls: 2 on load (popular + recommendations)
   Cache: sessionStorage, 4-hour TTL
   ============================================================ */

const CONSTELLATION_ROTATION_HOURS = 4;

function getRotationIndex(len) {
  return Math.floor(Date.now() / (CONSTELLATION_ROTATION_HOURS * 3600000)) % len;
}

function populateInfoStrip(film) {
  const titleEl = document.getElementById('home-const-info-title');
  const metaEl = document.getElementById('home-const-info-meta');
  const badgesEl = document.getElementById('home-const-info-badges');
  if (titleEl) titleEl.textContent = film.title || '\u2014';
  if (metaEl) {
    const year = (film.release_date || '').split('-')[0];
    const rating = film.vote_average ? film.vote_average.toFixed(1) : '';
    metaEl.textContent = [year, rating ? '\u2605 ' + rating : ''].filter(Boolean).join(' \u00B7 ');
  }
  if (badgesEl) {
    badgesEl.innerHTML = '';
    const genres = film.genre_ids || [];
    const genreMap = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'};
    if (genres.length > 0 && genreMap[genres[0]]) {
      const pill = document.createElement('span');
      pill.textContent = genreMap[genres[0]].toUpperCase();
      pill.style.cssText = 'display:inline-block;padding:2px 8px;font-family:var(--font-display);font-size:9px;letter-spacing:0.08em;border-radius:10px;background:rgba(0,217,255,0.12);border:1px solid rgba(0,217,255,0.3);color:var(--accent-cyan);';
      badgesEl.appendChild(pill);
    }
    if (film.vote_average >= 7.5) {
      const gold = document.createElement('span');
      gold.textContent = 'HIGHLY RATED';
      gold.style.cssText = 'display:inline-block;padding:2px 8px;font-family:var(--font-display);font-size:9px;letter-spacing:0.08em;border-radius:10px;background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.3);color:var(--accent-gold);';
      badgesEl.appendChild(gold);
    }
  }
}

async function loadHomeConstellation() {
  const canvas = document.getElementById('home-const-canvas');
  if (!canvas) return;

  const cacheKey = 'orbit_home_constellation_v1';
  const ttl = CONSTELLATION_ROTATION_HOURS * 3600000;
  let popular = null;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const p = JSON.parse(cached);
      if (Date.now() - p.timestamp < ttl) popular = p.films;
    }
  } catch (e) {}

  if (!popular) {
    try {
      const res = await OrbitUtils.tmdbFetch('/movie/popular', { language: 'en-US', page: 1 });
      popular = (res.results || []).filter(m => m.poster_path).slice(0, 20);
      sessionStorage.setItem(cacheKey, JSON.stringify({ films: popular, timestamp: Date.now() }));
    } catch (e) {
      console.warn('[ORBIT Home] Constellation popular fetch failed:', e);
      return;
    }
  }

  const idx = getRotationIndex(popular.length);
  const anchorFilm = popular[idx];

  populateInfoStrip(anchorFilm);

  // Fetch recommendations
  let orbitals = [];
  const recsCacheKey = 'orbit_home_const_recs_' + anchorFilm.id;
  try {
    const rc = sessionStorage.getItem(recsCacheKey);
    if (rc) {
      const p = JSON.parse(rc);
      if (Date.now() - p.timestamp < ttl) orbitals = p.films;
    }
  } catch (e) {}

  if (orbitals.length === 0) {
    try {
      const res = await OrbitUtils.tmdbFetch('/movie/' + anchorFilm.id + '/recommendations', { language: 'en-US', page: 1 });
      orbitals = (res.results || []).filter(m => m.poster_path && m.id !== anchorFilm.id).slice(0, 20);
      sessionStorage.setItem(recsCacheKey, JSON.stringify({ films: orbitals, timestamp: Date.now() }));
    } catch (e) {
      orbitals = [];
    }
  }

  const setAnchorAndNavigate = (film) => {
    localStorage.setItem('anchorMovie', JSON.stringify({
      id: film.id, title: film.title, poster_path: film.poster_path,
      release_date: film.release_date, vote_average: film.vote_average, overview: film.overview
    }));
    localStorage.removeItem('anchorFromResults');
    window.location.href = '../games/constellation.html';
  };

  const enterBtn = document.getElementById('home-const-enter');
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => { e.preventDefault(); setAnchorAndNavigate(anchorFilm); });
  }

  waitForSize(canvas, () => renderHomeConstellation(anchorFilm, orbitals, canvas));
}

function renderHomeConstellation(anchor, orbitals, canvas) {
  const loading = document.getElementById('home-const-loading');
  if (loading) loading.classList.add('hidden');

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  const cx = W / 2;
  const cy = H / 2;

  const anchorW = 148, anchorH = 212;
  const tileW = 96, tileH = 138;

  // Corona glow
  const glow = document.createElement('div');
  glow.style.cssText = `position:absolute;width:340px;height:340px;left:${cx-170}px;top:${cy-170}px;border-radius:50%;background:radial-gradient(circle,rgba(255,215,0,0.12) 0%,rgba(255,215,0,0.05) 35%,transparent 70%);pointer-events:none;z-index:5;animation:anchorCorona 3s ease-in-out infinite alternate;`;
  canvas.appendChild(glow);

  // Anchor tile
  const anchorEl = document.createElement('div');
  anchorEl.className = 'home-const-anchor';
  anchorEl.style.left = (cx - anchorW / 2) + 'px';
  anchorEl.style.top = (cy - anchorH / 2) + 'px';
  if (anchor.poster_path) {
    anchorEl.style.backgroundImage = 'url(' + TMDB_IMG + 'w185' + anchor.poster_path + ')';
  }
  const anchorLabel = document.createElement('div');
  anchorLabel.className = 'home-const-anchor-label';
  anchorLabel.textContent = anchor.title;
  anchorEl.appendChild(anchorLabel);
  anchorEl.addEventListener('click', () => {
    if (typeof openMovieCube === 'function') openMovieCube(anchor.id);
  });
  canvas.appendChild(anchorEl);

  // Position orbital tiles
  const count = Math.min(orbitals.length, 20);
  const positions = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const variance = 0.45 + Math.random() * 0.55;
    const rx = W * 0.44 * variance;
    const ry = H * 0.38 * variance;
    let x = cx + Math.cos(angle) * rx - tileW / 2;
    let y = cy + Math.sin(angle) * ry - tileH / 2;
    x = Math.max(8, Math.min(W - tileW - 8, x));
    y = Math.max(8, Math.min(H - tileH - 8, y));
    positions.push({ x, y, film: orbitals[i] });
  }

  // Separation pass
  const pad = 8;
  for (let iter = 0; iter < 150; iter++) {
    let any = false;
    for (let a = 0; a < positions.length; a++) {
      // Tile vs tile
      for (let b = a + 1; b < positions.length; b++) {
        const pa = positions[a], pb = positions[b];
        const oX = (tileW + pad) - Math.abs((pa.x + tileW / 2) - (pb.x + tileW / 2));
        const oY = (tileH + pad) - Math.abs((pa.y + tileH / 2) - (pb.y + tileH / 2));
        if (oX > 0 && oY > 0) {
          any = true;
          const sx = Math.sign((pa.x + tileW / 2) - (pb.x + tileW / 2)) || 1;
          const sy = Math.sign((pa.y + tileH / 2) - (pb.y + tileH / 2)) || 1;
          const px = Math.min(6, oX / 2) * sx;
          const py = Math.min(6, oY / 2) * sy;
          pa.x += px; pa.y += py;
          pb.x -= px; pb.y -= py;
        }
      }
      // Tile vs anchor
      const p = positions[a];
      const aoX = (tileW / 2 + anchorW / 2 + pad * 2) - Math.abs((p.x + tileW / 2) - cx);
      const aoY = (tileH / 2 + anchorH / 2 + pad * 2) - Math.abs((p.y + tileH / 2) - cy);
      if (aoX > 0 && aoY > 0) {
        any = true;
        p.x += 5 * (Math.sign((p.x + tileW / 2) - cx) || 1);
        p.y += 5 * (Math.sign((p.y + tileH / 2) - cy) || 1);
      }
      positions[a].x = Math.max(8, Math.min(W - tileW - 8, positions[a].x));
      positions[a].y = Math.max(8, Math.min(H - tileH - 8, positions[a].y));
    }
    if (!any) break;
  }

  // Render tiles
  positions.forEach((pos, i) => {
    const dist = Math.hypot((pos.x + tileW/2) - cx, (pos.y + tileH/2) - cy);
    const maxDist = Math.hypot(W/2, H/2);
    const band = dist / maxDist;

    const tile = document.createElement('div');
    tile.className = 'home-const-tile';
    tile.style.left = pos.x + 'px';
    tile.style.top = pos.y + 'px';
    tile.style.zIndex = '2';
    tile.style.opacity = '0';
    const finalOp = (band >= 0.65) ? 0.82 : 1.0;
    if (band >= 0.65) {
      tile.style.filter = 'brightness(0.85)';
    }
    tile.style.animation = 'homeConstellationFadeIn 0.4s ease forwards';
    tile.style.animationDelay = (i * 35) + 'ms';
    tile.addEventListener('animationend', () => { tile.style.opacity = finalOp; }, { once: true });
    if (pos.film.poster_path) {
      tile.style.backgroundImage = 'url(' + TMDB_IMG + 'w185' + pos.film.poster_path + ')';
    }
    const label = document.createElement('div');
    label.className = 'home-const-tile-label';
    label.textContent = pos.film.title;
    tile.appendChild(label);
    tile.addEventListener('click', () => {
      if (typeof openMovieCube === 'function') openMovieCube(pos.film.id);
    });
    canvas.appendChild(tile);
  });

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

  const cells = document.querySelectorAll('#hero-mosaic .mosaic-cell');
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
   SECTION 8 — Star Field + Helpers
   ---------------------------------------------------------- */

function generateStarField(container) {
  const existing = container.querySelector('.hero-star-field');
  if (existing) existing.remove();

  const cvs = document.createElement('canvas');
  cvs.className = 'hero-star-field';
  cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  container.insertBefore(cvs, container.firstChild);

  function draw() {
    cvs.width = container.offsetWidth || 600;
    cvs.height = container.offsetHeight || 480;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    for (let i = 0; i < 90; i++) {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      const r = Math.random() * 0.9 + 0.2;
      const o = Math.random() * 0.35 + 0.06;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${o})`;
      ctx.fill();
    }

    for (let i = 0; i < 14; i++) {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      const r = Math.random() * 0.7 + 0.9;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);
}

function waitForSize(el, cb, attempts) {
  attempts = attempts || 0;
  if (el.offsetWidth > 0 && el.offsetHeight > 0) { cb(); return; }
  if (attempts > 20) return;
  requestAnimationFrame(() => waitForSize(el, cb, attempts + 1));
}

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

  // Star field behind constellation
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) generateStarField(heroRight);

  loadHomeConstellation();
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
