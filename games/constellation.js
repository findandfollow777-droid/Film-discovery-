/* ============================================
   ORBIT CONSTELLATION PAGE — HUD Redesign
   Anchor Film Orbital Visualization
   Click: Preview Panel · Double-click: Re-anchor
   Right-click / Long-press: Watchlist
   Added: 2026-03-29
============================================ */

// Genre similarity weights and mood mappings
const GENRE_VIBES = {
  mood: {
    35: 10, 16: 15, 10751: 15, 10402: 25, 10749: 30,
    12: 40, 14: 45, 878: 50, 28: 55, 9648: 65,
    53: 70, 80: 75, 10752: 80, 27: 90
  },
  pace: {
    99: 10, 18: 25, 10749: 30, 36: 35, 10402: 40,
    35: 45, 9648: 50, 14: 55, 878: 60, 12: 65,
    80: 70, 53: 80, 28: 85, 27: 75, 10752: 80
  },
  depth: {
    28: 15, 12: 20, 14: 25, 16: 30, 10751: 30,
    35: 35, 27: 40, 10749: 45, 878: 55, 9648: 60,
    53: 55, 80: 65, 18: 70, 10752: 75, 36: 80, 99: 90
  }
};

// TMDB_IMG already declared by utils.js — use it directly

let anchorMovie = null;
let allMovies = [];
let rankedMovies = [];
let selectedMovie = null;
let movieCubeReady = false;
let expandPage = 1;
let previewFilm = null;

// DOM Elements
let anchorPoster, anchorLabel, orbitingMovies;
let infoPanel, infoClose, infoPoster, infoTitle, infoYear, infoRating, infoSimilarity, infoOverview;
let makeAnchorBtn;

// ============================================
// INITIALIZE
// ============================================

document.addEventListener("DOMContentLoaded", init);

function init() {
  anchorPoster = document.getElementById("anchorPoster");
  anchorLabel = document.getElementById("anchorLabel");
  orbitingMovies = document.getElementById("orbitingMovies");
  infoPanel = document.getElementById("infoPanel");
  infoClose = document.getElementById("infoClose");
  infoPoster = document.getElementById("infoPoster");
  infoTitle = document.getElementById("infoTitle");
  infoYear = document.getElementById("infoYear");
  infoRating = document.getElementById("infoRating");
  infoSimilarity = document.getElementById("infoSimilarity");
  infoOverview = document.getElementById("infoOverview");
  makeAnchorBtn = document.getElementById("makeAnchorBtn");

  // Load data from localStorage
  const anchorData = localStorage.getItem("anchorMovie");
  const moviesData = localStorage.getItem("constellationMovies");

  if (!anchorData) {
    showError("No anchor movie selected. Return to Results and choose a movie.");
    return;
  }

  try {
    anchorMovie = JSON.parse(anchorData);
  } catch (e) {
    showError("Error loading anchor movie data.");
    return;
  }

  // Load constellation movies if available
  try {
    if (moviesData) allMovies = JSON.parse(moviesData);
  } catch (e) {
    allMovies = [];
  }

  allMovies = (allMovies || []).filter(m => m && m.id !== anchorMovie.id);

  displayAnchor();
  populateAnchorPanel(anchorMovie);
  setupEventListeners();

  try { initMovieCubeOnPage(); } catch (e) { console.warn('[CONSTELLATION] MovieCube init failed:', e); }
  try { initWatchlistMenu(); } catch (e) { console.warn('[CONSTELLATION] Watchlist menu init failed:', e); }

  if (allMovies.length > 0) {
    calculateSimilarities();
    renderOrbits();
    updateFilmCount(allMovies.length);
    checkExpandUniverse();
  } else {
    updateFilmCount(0);
    loadRecommendations(anchorMovie.id);
  }
}

function showError(message) {
  if (anchorLabel) {
    anchorLabel.textContent = message;
    anchorLabel.style.color = "#ff4757";
  }
}

// ============================================
// MOVIECUBE INTEGRATION
// ============================================

function initMovieCubeOnPage() {
  if (typeof initMovieCube !== 'function') return;
  initMovieCube({
    onPersonClick: (personId) => {
      if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
    },
    onAnchorClick: (movie) => {
      localStorage.setItem('anchorMovie', JSON.stringify(movie));
      localStorage.removeItem('anchorFromResults');
      reAnchor(movie.id);
    }
  });
  if (typeof initPeopleCube === 'function') initPeopleCube();
  movieCubeReady = true;
}

function openCubeForMovie(movieId) {
  if (movieCubeReady && typeof openMovieCube === 'function') {
    openMovieCube(movieId);
  }
}

// ============================================
// HUD — ANCHOR PANEL
// ============================================

function populateAnchorPanel(movie) {
  if (!movie) return;

  const posterEl = document.getElementById('hud-anchor-poster');
  if (posterEl && movie.poster_path) {
    const imgBase = (typeof TMDB_IMG !== 'undefined' && TMDB_IMG) ? TMDB_IMG : 'https://image.tmdb.org/t/p/';
    posterEl.style.backgroundImage = `url(${imgBase}w185${movie.poster_path})`;
  }

  const titleEl = document.getElementById('hud-anchor-title');
  if (titleEl) titleEl.textContent = movie.title || '\u2014';

  const metaEl = document.getElementById('hud-anchor-meta');
  if (metaEl) {
    const year = (movie.release_date || '').substring(0, 4);
    const rating = movie.vote_average ? '\u2605 ' + Number(movie.vote_average).toFixed(1) : '';
    metaEl.textContent = [year, rating].filter(Boolean).join(' \u00B7 ');
  }

  const badgesEl = document.getElementById('hud-anchor-badges');
  if (badgesEl) {
    badgesEl.innerHTML = '';
    const genres = movie.genre_ids || (movie.genres || []).map(g => g.id) || [];
    const GENRE_NAMES = {28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",53:"Thriller",10752:"War",37:"Western"};
    if (genres[0] && GENRE_NAMES[genres[0]]) {
      const b = document.createElement('span');
      b.className = 'hud-anchor-badge';
      b.textContent = GENRE_NAMES[genres[0]];
      b.style.cssText = 'color:var(--accent-cyan);border-color:rgba(0,217,255,0.25)';
      badgesEl.appendChild(b);
    }
    if (movie.vote_average >= 7.5) {
      const b = document.createElement('span');
      b.className = 'hud-anchor-badge';
      b.textContent = '\u2605 ' + Number(movie.vote_average).toFixed(1);
      b.style.cssText = 'color:var(--accent-gold);border-color:rgba(255,215,0,0.25)';
      badgesEl.appendChild(b);
    }
  }

  // Wire cube button
  const cubeBtn = document.getElementById('hud-anchor-cube-btn');
  if (cubeBtn) {
    cubeBtn.onclick = () => openCubeForMovie(movie.id);
  }
}

function updateFilmCount(count) {
  const el = document.getElementById('hud-film-count');
  if (el) el.textContent = count + ' FILMS IN ORBIT';
}

// ============================================
// ANCHOR DISPLAY (preserved)
// ============================================

function displayAnchor() {
  if (!anchorMovie) return;
  if (anchorPoster && anchorMovie.poster_path) {
    const imgBase = (typeof TMDB_IMG !== 'undefined' && TMDB_IMG) ? TMDB_IMG : 'https://image.tmdb.org/t/p/';
    anchorPoster.src = imgBase + 'w300' + anchorMovie.poster_path;
    anchorPoster.alt = anchorMovie.title || '';
  }
  if (anchorLabel) {
    anchorLabel.textContent = anchorMovie.title || '';
  }

  // Anchor star click → open MovieCube
  const anchorElement = document.getElementById("anchorStar");
  if (anchorElement) {
    anchorElement.style.cursor = "pointer";
    anchorElement.title = `Click to explore "${anchorMovie.title}"`;
    anchorElement.onclick = () => openCubeForMovie(anchorMovie.id);
  }
}

// ============================================
// SIMILARITY CALCULATIONS (preserved exactly)
// ============================================

function calculateSimilarities() {
  if (!anchorMovie || allMovies.length === 0) return;

  const anchorGenres = anchorMovie.genre_ids || anchorMovie.genres?.map(g => g.id) || [];
  const anchorYear = anchorMovie.release_date ? parseInt(anchorMovie.release_date.split("-")[0]) : 2000;
  const anchorRating = anchorMovie.vote_average || 5;
  const anchorMood = getGenreAverage(anchorGenres, GENRE_VIBES.mood, 50);
  const anchorPace = getGenreAverage(anchorGenres, GENRE_VIBES.pace, 50);
  const anchorDepth = getGenreAverage(anchorGenres, GENRE_VIBES.depth, 50);

  rankedMovies = allMovies.map(movie => {
    const movieGenres = movie.genre_ids || [];
    const movieYear = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2000;
    const movieRating = movie.vote_average || 5;
    const movieMood = getGenreAverage(movieGenres, GENRE_VIBES.mood, 50);
    const moviePace = getGenreAverage(movieGenres, GENRE_VIBES.pace, 50);
    const movieDepth = getGenreAverage(movieGenres, GENRE_VIBES.depth, 50);

    const genreOverlap = calculateGenreOverlap(anchorGenres, movieGenres);
    const yearDiff = Math.abs(anchorYear - movieYear);
    const eraSimilarity = Math.max(0, 100 - (yearDiff * 3));
    const ratingDiff = Math.abs(anchorRating - movieRating);
    const ratingSimilarity = Math.max(0, 100 - (ratingDiff * 15));
    const moodDiff = Math.abs(anchorMood - movieMood);
    const paceDiff = Math.abs(anchorPace - moviePace);
    const depthDiff = Math.abs(anchorDepth - movieDepth);
    const vibeSimilarity = 100 - ((moodDiff + paceDiff + depthDiff) / 3);

    const totalSimilarity = (
      genreOverlap * 0.35 +
      vibeSimilarity * 0.30 +
      eraSimilarity * 0.20 +
      ratingSimilarity * 0.15
    );

    return { movie, similarity: totalSimilarity, genreOverlap, eraSimilarity, ratingSimilarity, vibeSimilarity };
  });

  rankedMovies.sort((a, b) => b.similarity - a.similarity);
}

function calculateGenreOverlap(genres1, genres2) {
  if (!genres1.length || !genres2.length) return 30;
  const set1 = new Set(genres1);
  const set2 = new Set(genres2);
  const intersection = [...set1].filter(g => set2.has(g));
  const union = new Set([...genres1, ...genres2]);
  return (intersection.length / union.size) * 100;
}

function getGenreAverage(genres, vibeMap, defaultVal) {
  if (!genres || genres.length === 0) return defaultVal;
  const scores = genres.map(g => vibeMap[g]).filter(s => s !== undefined);
  if (scores.length === 0) return defaultVal;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

// ============================================
// RENDER ORBITS (preserved layout, added fade-entering)
// ============================================

// Tile sizes per orbit class (from constellation.css)
const TILE_SIZES = {
  'orbit-1': { w: 135, h: 203 },
  'orbit-2': { w: 120, h: 180 },
  'orbit-3': { w: 105, h: 158 },
  'orbit-4': { w: 90, h: 135 }
};
const ANCHOR_SIZE = { w: 240, h: 360 };
const TILE_PAD = 10; // breathing room on each side

function renderOrbits() {
  if (!orbitingMovies) return;
  orbitingMovies.innerHTML = "";

  const container = document.getElementById("orbitalContainer");
  const vw = container.offsetWidth;
  const vh = container.offsetHeight;
  const centerX = vw / 2;
  const centerY = vh / 2;

  const orbits = [
    { spreadX: 0.18, spreadY: 0.14, maxMovies: 6, class: "orbit-1" },
    { spreadX: 0.28, spreadY: 0.22, maxMovies: 10, class: "orbit-2" },
    { spreadX: 0.36, spreadY: 0.28, maxMovies: 14, class: "orbit-3" },
    { spreadX: 0.42, spreadY: 0.34, maxMovies: 20, class: "orbit-4" }
  ];

  // Step 1: Calculate initial positions
  const positions = [];
  let globalIdx = 0;

  // Add anchor as immovable obstacle (centred)
  // Extra clearance around anchor so no tiles sit under it
  const anchorClearance = 40;
  const anchorW = ANCHOR_SIZE.w + TILE_PAD * 2 + anchorClearance * 2;
  const anchorH = ANCHOR_SIZE.h + TILE_PAD * 2 + anchorClearance * 2;
  positions.push({
    id: -1, x: centerX - anchorW / 2, y: centerY - anchorH / 2,
    w: anchorW, h: anchorH, fixed: true, orbitClass: 'anchor', item: null
  });

  orbits.forEach((orbit) => {
    const moviesInOrbit = rankedMovies.slice(globalIdx, globalIdx + orbit.maxMovies);
    const size = TILE_SIZES[orbit.class] || { w: 120, h: 180 };
    const pw = size.w + TILE_PAD * 2;
    const ph = size.h + TILE_PAD * 2;

    moviesInOrbit.forEach((item, i) => {
      const angle = (2 * Math.PI * i / moviesInOrbit.length) - Math.PI / 2;
      const randFactor = 0.4 + Math.random() * 0.6;
      const radiusX = vw * orbit.spreadX * randFactor;
      const radiusY = vh * orbit.spreadY * randFactor;
      const angleVar = angle + (Math.random() - 0.5) * 0.2;

      // x,y = top-left corner (for collision), centred on the computed point
      const cx = centerX + Math.cos(angleVar) * radiusX;
      const cy = centerY + Math.sin(angleVar) * radiusY;

      positions.push({
        id: item.movie.id, x: cx - pw / 2, y: cy - ph / 2,
        w: pw, h: ph, fixed: false, orbitClass: orbit.class, item: item
      });
      globalIdx++;
    });
  });

  // Step 2: Separation loop (skip index 0 = anchor)
  for (let iter = 0; iter < 200; iter++) {
    let anyCollision = false;
    for (let i = 1; i < positions.length; i++) {
      for (let j = 0; j < positions.length; j++) {
        if (i === j) continue;
        const a = positions[i];
        const b = positions[j];
        const overlapX = (Math.min(a.w, b.w)) - Math.abs((a.x + a.w / 2) - (b.x + b.w / 2));
        const overlapY = (Math.min(a.h, b.h)) - Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));

        // Use half-widths sum for proper overlap detection
        const halfWSum = (a.w + b.w) / 2;
        const halfHSum = (a.h + b.h) / 2;
        const dxC = (a.x + a.w / 2) - (b.x + b.w / 2);
        const dyC = (a.y + a.h / 2) - (b.y + b.h / 2);
        const oX = halfWSum - Math.abs(dxC);
        const oY = halfHSum - Math.abs(dyC);

        if (oX > 0 && oY > 0) {
          anyCollision = true;
          // Push along the axis of least overlap
          const pushX = oX < oY ? (dxC > 0 ? oX : -oX) : 0;
          const pushY = oX >= oY ? (dyC > 0 ? oY : -oY) : 0;
          const clamp = 8;
          const px = Math.max(-clamp, Math.min(clamp, pushX));
          const py = Math.max(-clamp, Math.min(clamp, pushY));

          if (b.fixed) {
            // Push only a (orbital tile away from anchor)
            a.x += px;
            a.y += py;
          } else if (a.fixed) {
            // Push only b
            b.x -= px;
            b.y -= py;
          } else {
            a.x += px / 2;
            a.y += py / 2;
            b.x -= px / 2;
            b.y -= py / 2;
          }
        }
      }

      // Clamp to viewport
      const a = positions[i];
      a.x = Math.max(10, Math.min(vw - a.w - 10, a.x));
      a.y = Math.max(10, Math.min(vh - a.h - 10, a.y));
    }
    if (!anyCollision) break;
  }

  // Step 3: Render tiles at final separated positions
  let renderIdx = 0;
  for (let i = 1; i < positions.length; i++) {
    const p = positions[i];
    if (!p.item) continue;
    // Convert back to centre point for the tile (tiles use translate(-50%,-50%))
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    const movieEl = createOrbitMovie(p.item, p.orbitClass, cx, cy);
    movieEl.classList.add('fade-entering');
    const delay = Math.min(renderIdx * 40, 800);
    movieEl.style.animationDelay = delay + 'ms';
    // After fade-in animation, switch to fade-done so .selected transform works
    movieEl.addEventListener('animationend', () => {
      movieEl.classList.remove('fade-entering');
      movieEl.classList.add('fade-done');
    }, { once: true });
    // Fallback in case animationend doesn't fire
    setTimeout(() => {
      if (movieEl.classList.contains('fade-entering')) {
        movieEl.classList.remove('fade-entering');
        movieEl.classList.add('fade-done');
      }
    }, delay + 500);
    orbitingMovies.appendChild(movieEl);
    renderIdx++;
  }
}

function createOrbitMovie(item, orbitClass, x, y) {
  const { movie, similarity } = item;
  const div = document.createElement("div");
  div.className = `orbit-movie ${orbitClass}`;
  div.dataset.movieId = movie.id;
  div.dataset.similarity = similarity.toFixed(1);
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.transform = "translate(-50%, -50%)";

  const imgBase = (typeof TMDB_IMG !== 'undefined' && TMDB_IMG) ? TMDB_IMG : 'https://image.tmdb.org/t/p/';
  const posterUrl = movie.poster_path
    ? imgBase + 'w342' + movie.poster_path
    : "https://placehold.co/120x172?text=?";

  div.innerHTML = `
    <img class="orbit-movie-poster" src="${posterUrl}" alt="${movie.title}">
    <div class="orbit-similarity"></div>
  `;

  // First click → grow tile. Second click on selected tile → preview panel.
  div.addEventListener("click", (e) => {
    e.stopPropagation();
    if (div.classList.contains('selected')) {
      // Already selected — open preview
      openPreviewPanel(movie);
    } else {
      // Deselect any other selected tile
      document.querySelectorAll('.orbit-movie.selected').forEach(t => t.classList.remove('selected'));
      div.classList.add('selected');
    }
  });

  // Double click → re-anchor
  div.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    makeNewAnchor(movie);
  });

  return div;
}

// ============================================
// PREVIEW PANEL
// ============================================

function openPreviewPanel(film) {
  previewFilm = film;
  const panel = document.getElementById('preview-panel');
  const backdrop = document.getElementById('preview-backdrop');
  if (!panel) return;

  const imgBase = (typeof TMDB_IMG !== 'undefined' && TMDB_IMG) ? TMDB_IMG : 'https://image.tmdb.org/t/p/';

  // Populate poster
  const posterEl = document.getElementById('preview-poster');
  if (posterEl) {
    posterEl.style.backgroundImage = film.poster_path
      ? `url(${imgBase}w500${film.poster_path})`
      : 'none';
  }

  // Populate title
  const titleEl = document.getElementById('preview-title');
  if (titleEl) titleEl.textContent = film.title || '\u2014';

  // Populate meta (year · rating)
  const metaEl = document.getElementById('preview-meta');
  if (metaEl) {
    const year = (film.release_date || '').substring(0, 4);
    const rating = film.vote_average ? '\u2605 ' + Number(film.vote_average).toFixed(1) : '';
    metaEl.textContent = [year, rating].filter(Boolean).join(' \u00B7 ');
  }

  // Populate overview (300 chars max)
  const overviewEl = document.getElementById('preview-overview');
  if (overviewEl) {
    const text = film.overview || 'No overview available.';
    overviewEl.textContent = text.length > 300 ? text.substring(0, 297) + '...' : text;
  }

  // Wire anchor button
  const anchorBtn = document.getElementById('preview-anchor-btn');
  if (anchorBtn) {
    anchorBtn.onclick = () => {
      closePreviewPanel();
      makeNewAnchor(film);
    };
  }

  // Wire cube button
  const cubeBtn = document.getElementById('preview-cube-btn');
  if (cubeBtn) {
    cubeBtn.onclick = () => {
      closePreviewPanel();
      openCubeForMovie(film.id);
    };
  }

  // Open panel
  panel.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
}

function closePreviewPanel() {
  previewFilm = null;
  const panel = document.getElementById('preview-panel');
  const backdrop = document.getElementById('preview-backdrop');
  if (panel) panel.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
}

// ============================================
// INFO PANEL (preserved)
// ============================================

function showMovieInfo(item) {
  const { movie, similarity } = item;
  selectedMovie = movie;

  if (infoPoster) infoPoster.src = `${TMDB_IMG}w300${movie.poster_path}`;
  if (infoTitle) infoTitle.textContent = movie.title;
  if (infoYear) infoYear.textContent = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  if (infoRating) infoRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  if (infoSimilarity) infoSimilarity.textContent = `${similarity.toFixed(0)}% Match`;

  if (infoSimilarity) {
    if (similarity >= 70) {
      infoSimilarity.style.borderColor = "#00ff88";
      infoSimilarity.style.color = "#00ff88";
      infoSimilarity.style.background = "rgba(0, 255, 136, 0.2)";
    } else if (similarity >= 50) {
      infoSimilarity.style.borderColor = "#00d9ff";
      infoSimilarity.style.color = "#00d9ff";
      infoSimilarity.style.background = "rgba(0, 217, 255, 0.2)";
    } else if (similarity >= 30) {
      infoSimilarity.style.borderColor = "#ff6b35";
      infoSimilarity.style.color = "#ff6b35";
      infoSimilarity.style.background = "rgba(255, 107, 53, 0.2)";
    } else {
      infoSimilarity.style.borderColor = "#8892a6";
      infoSimilarity.style.color = "#8892a6";
      infoSimilarity.style.background = "rgba(136, 146, 166, 0.2)";
    }
  }

  if (infoOverview) infoOverview.textContent = movie.overview || "No overview available.";
  if (infoPanel) infoPanel.classList.add("active");
}

function closeInfoPanel() {
  if (infoPanel) infoPanel.classList.remove("active");
  selectedMovie = null;
}

// ============================================
// LOADING STATE
// ============================================

function showCosmosLoader(label) {
  const loader = document.getElementById('cosmos-loader');
  const labelEl = document.getElementById('cosmos-loader-label');
  if (labelEl && label) labelEl.textContent = label;

  // Generate star dots
  const stars = document.getElementById('cosmos-stars');
  if (stars) {
    stars.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      const angle = (i / 12) * Math.PI * 2;
      const distance = 70 + Math.random() * 30;
      dot.style.cssText = `
        position:absolute;width:${3+Math.random()*3}px;height:${3+Math.random()*3}px;
        border-radius:50%;background:rgba(0,217,255,${0.3+Math.random()*0.5});
        left:${60+Math.cos(angle)*distance}px;top:${60+Math.sin(angle)*distance}px;
        animation:cosmos-pulse ${1+Math.random()}s ease-in-out infinite alternate;
        animation-delay:${i*0.1}s;
      `;
      stars.appendChild(dot);
    }
  }

  if (loader) loader.classList.add('active');

  // Also keep HUD expand button loading state
  const hudBtn = document.getElementById('hud-expand-btn');
  if (hudBtn) hudBtn.classList.add('loading');
}

function hideCosmosLoader() {
  const loader = document.getElementById('cosmos-loader');
  if (loader) loader.classList.remove('active');

  // Also remove HUD expand button loading state
  const hudBtn = document.getElementById('hud-expand-btn');
  if (hudBtn) hudBtn.classList.remove('loading');
}

// ============================================
// MAKE NEW ANCHOR (preserved logic)
// ============================================

function makeNewAnchor(movie) {
  reAnchor(movie.id);
}

async function reAnchor(movieId) {
  const movie = allMovies.find(m => m.id === movieId) || selectedMovie;
  if (!movie) return;

  showCosmosLoader('ENTERING NEW ORBIT');

  const minTimer = new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const [fullMovie] = await Promise.all([fetchMovieDetails(movieId), minTimer]);

    const oldAnchor = anchorMovie;
    anchorMovie = fullMovie || movie;

    localStorage.setItem("anchorMovie", JSON.stringify(anchorMovie));
    allMovies.push(oldAnchor);
    allMovies = allMovies.filter(m => m.id !== movieId);

    displayAnchor();
    populateAnchorPanel(anchorMovie);
    calculateSimilarities();
    renderOrbits();
    closeInfoPanel();
    updateFilmCount(allMovies.length);
    flashAnchor();
    expandPage = 1;
  } catch (e) {
    console.error("Failed to re-anchor:", e);
  }

  hideCosmosLoader();
}

async function fetchMovieDetails(movieId) {
  try {
    if (typeof OrbitUtils !== 'undefined' && OrbitUtils.tmdbFetch) {
      return await OrbitUtils.tmdbFetch('/movie/' + movieId, { language: 'en-US' });
    }
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch movie details:", e);
    return null;
  }
}

function flashAnchor() {
  const anchor = document.getElementById("anchorStar");
  if (anchor) {
    anchor.style.animation = "none";
    anchor.offsetHeight;
    anchor.style.animation = "anchor-flash 0.6s ease";
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  infoClose?.addEventListener("click", closeInfoPanel);

  document.addEventListener("click", (e) => {
    // Deselect tiles when clicking empty space
    if (!e.target.closest('.orbit-movie') && !e.target.closest('.preview-panel') && !e.target.closest('.hud-anchor-panel')) {
      document.querySelectorAll('.orbit-movie.selected').forEach(t => t.classList.remove('selected'));
    }
    if (infoPanel?.classList.contains("active")) {
      if (e.target.closest("#makeAnchorBtn")) return;
      if (!infoPanel.contains(e.target) && !e.target.closest(".orbit-movie")) {
        closeInfoPanel();
      }
    }
  });

  makeAnchorBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedMovie) makeNewAnchor(selectedMovie);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePreviewPanel();
      closeInfoPanel();
    }
  });

  window.addEventListener("resize", OrbitUtils.debounce(() => { renderOrbits(); }, 250));

  // HUD expand button
  document.getElementById('hud-expand-btn')?.addEventListener('click', handleExpandUniverse);

  // Preview panel close button and backdrop
  document.getElementById('preview-close')?.addEventListener('click', closePreviewPanel);
  document.getElementById('preview-backdrop')?.addEventListener('click', closePreviewPanel);
}

// Anchor flash animation
const style = document.createElement("style");
style.textContent = `@keyframes anchor-flash { 0% { filter: brightness(1); } 50% { filter: brightness(2) drop-shadow(0 0 30px gold); } 100% { filter: brightness(1); } }`;
document.head.appendChild(style);

// ============================================
// LOAD RECOMMENDATIONS (Context B — no stored movies)
// ============================================

async function loadRecommendations(movieId) {
  showCosmosLoader('RECONFIGURING ORBIT');

  const minTimer = new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const tmdbFetch = (typeof OrbitUtils !== 'undefined' && OrbitUtils.tmdbFetch)
      ? (ep, p) => OrbitUtils.tmdbFetch(ep, p)
      : async (ep, p) => {
          const q = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US', ...p });
          const r = await fetch('https://api.themoviedb.org/3' + ep + '?' + q);
          return r.json();
        };

    const [recs, similar] = await Promise.all([
      tmdbFetch('/movie/' + movieId + '/recommendations', { page: 1 }),
      tmdbFetch('/movie/' + movieId + '/similar', { page: 1 }),
      minTimer
    ]);

    const combined = [...(recs.results || []), ...(similar.results || [])];
    const seen = new Set([movieId]);
    const unique = [];
    for (const m of combined) {
      if (m && m.poster_path && !seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
      }
    }

    allMovies = unique.slice(0, 30);
    localStorage.setItem("constellationMovies", JSON.stringify([anchorMovie, ...allMovies]));

    calculateSimilarities();
    renderOrbits();
    updateFilmCount(allMovies.length);
    checkExpandUniverse();
  } catch (e) {
    console.error("[CONSTELLATION] Failed to load recommendations:", e);
    showError("Could not load similar films.");
  }

  hideCosmosLoader();
}

// ============================================
// EXPAND UNIVERSE (always refreshes)
// ============================================

function checkExpandUniverse() {
  // Original expand button is always hidden now — HUD button handles this
  const expandUniverse = document.getElementById("expandUniverse");
  if (expandUniverse) expandUniverse.hidden = true;
}

async function handleExpandUniverse() {
  if (!anchorMovie) return;

  expandPage++;
  if (expandPage > 5) expandPage = 1;

  showCosmosLoader('EXPANDING THE UNIVERSE');

  const minTimer = new Promise(resolve => setTimeout(resolve, 1500));
  const anchorId = anchorMovie.id;

  try {
    const tmdbFetch = (typeof OrbitUtils !== 'undefined' && OrbitUtils.tmdbFetch)
      ? (ep, p) => OrbitUtils.tmdbFetch(ep, p)
      : async (ep, p) => {
          const q = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US', ...p });
          const r = await fetch('https://api.themoviedb.org/3' + ep + '?' + q);
          return r.json();
        };

    const [recData, similarData] = await Promise.all([
      tmdbFetch('/movie/' + anchorId + '/recommendations', { page: expandPage }),
      tmdbFetch('/movie/' + anchorId + '/similar', { page: expandPage }),
      minTimer
    ]);

    // Combine and deduplicate
    const combined = [...(recData.results || []), ...(similarData.results || [])];
    const seen = new Set([anchorId]);
    const unique = [];
    for (const m of combined) {
      if (m && m.poster_path && !seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
      }
    }

    // Fisher-Yates shuffle
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }

    // Replace all orbital films (up to 40)
    allMovies = unique.slice(0, 40);
    localStorage.setItem("constellationMovies", JSON.stringify([anchorMovie, ...allMovies]));

    calculateSimilarities();
    renderOrbits();
    updateFilmCount(allMovies.length);
  } catch (e) {
    console.error("Failed to expand universe:", e);
  }

  hideCosmosLoader();

  // Always keep label as EXPAND MY UNIVERSE
  const hudBtn = document.getElementById('hud-expand-btn');
  if (hudBtn) {
    hudBtn.innerHTML = '<span class="og og-galaxy"></span> EXPAND MY UNIVERSE';
  }
}

// ============================================
// WATCHLIST CONTEXT MENU
// ============================================

function initWatchlistMenu() {
  const menu = document.getElementById('wlContextMenu');
  const menuBtn = document.getElementById('wlContextBtn');
  if (!menu || !menuBtn) return;

  let activeMovieId = null;
  let longPressTimer = null;
  let touchStartX = 0, touchStartY = 0;

  function openMenu(x, y, movieId) {
    closeMenu();
    activeMovieId = movieId;
    const inWl = typeof isInWatchlist === 'function' && isInWatchlist(movieId);
    menuBtn.className = 'wl-context-item ' + (inWl ? 'remove' : 'add');
    menuBtn.textContent = inWl ? '\u2713 ON WATCHLIST \u2014 REMOVE' : '+ ADD TO WATCHLIST';

    menu.classList.add('is-open');
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    menu.style.left = (x + mw > vw ? Math.max(0, x - mw) : x) + 'px';
    menu.style.top = (y + mh > vh ? Math.max(0, y - mh) : y) + 'px';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    activeMovieId = null;
  }

  function showToast(msg) {
    const t = document.getElementById('wlToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  menuBtn.addEventListener('click', () => {
    if (!activeMovieId) return;
    if (typeof isInWatchlist === 'function' && isInWatchlist(activeMovieId)) {
      if (typeof removeFromWatchlist === 'function') removeFromWatchlist(activeMovieId);
      showToast('Removed from Watchlist');
    } else {
      const m = allMovies.find(f => f.id === activeMovieId) || anchorMovie;
      if (m && typeof addToWatchlist === 'function') {
        addToWatchlist({ id: m.id, title: m.title, poster_path: m.poster_path, release_date: m.release_date, vote_average: m.vote_average });
      }
      showToast('Added to Watchlist');
    }
    closeMenu();
  });

  // Desktop right-click
  document.addEventListener('contextmenu', (e) => {
    const tile = e.target.closest('.orbit-movie');
    if (!tile) return;
    e.preventDefault();
    openMenu(e.clientX, e.clientY, parseInt(tile.dataset.movieId));
  });

  // Mobile long-press
  document.addEventListener('touchstart', (e) => {
    const tile = e.target.closest('.orbit-movie');
    if (!tile) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      const rect = tile.getBoundingClientRect();
      openMenu(rect.left + rect.width / 2, rect.top + rect.height / 2, parseInt(tile.dataset.movieId));
    }, 500);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!longPressTimer) return;
    const t = e.touches[0];
    if (Math.sqrt((t.clientX - touchStartX) ** 2 + (t.clientY - touchStartY) ** 2) > 8) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
  });

  // Dismiss
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('scroll', closeMenu, { passive: true });
}

// Global handler (backup for inline onclick)
function handleMakeAnchorClick() {
  if (selectedMovie) makeNewAnchor(selectedMovie);
}
window.handleMakeAnchorClick = handleMakeAnchorClick;
