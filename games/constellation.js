/* ============================================
   ORBIT CONSTELLATION PAGE — HUD Redesign
   Anchor Film Orbital Visualization
   Click: MovieCube · Double-click: Re-anchor
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

const TMDB_IMG = OrbitUtils.TMDB_IMG;

let anchorMovie = null;
let allMovies = [];
let rankedMovies = [];
let selectedMovie = null;
let movieCubeReady = false;

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

  if (!anchorData || !moviesData) {
    showError("No anchor movie selected. Return to Results and choose a movie.");
    return;
  }

  try {
    anchorMovie = JSON.parse(anchorData);
    allMovies = JSON.parse(moviesData);
  } catch (e) {
    showError("Error loading movie data.");
    return;
  }

  allMovies = allMovies.filter(m => m.id !== anchorMovie.id);

  displayAnchor();
  populateAnchorPanel(anchorMovie);
  calculateSimilarities();
  renderOrbits();
  setupEventListeners();
  updateFilmCount(allMovies.length);
  checkExpandUniverse();
  initMovieCubeOnPage();
  initWatchlistMenu();

  console.log("Constellation initialized with", allMovies.length, "orbiting movies");
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
    posterEl.style.backgroundImage = `url(${TMDB_IMG}w185${movie.poster_path})`;
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
  if (anchorPoster) {
    anchorPoster.src = `${TMDB_IMG}w300${anchorMovie.poster_path}`;
    anchorPoster.alt = anchorMovie.title;
  }
  if (anchorLabel) {
    anchorLabel.textContent = anchorMovie.title;
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
// RENDER ORBITS (preserved exactly)
// ============================================

function renderOrbits() {
  if (!orbitingMovies) return;
  orbitingMovies.innerHTML = "";

  const container = document.getElementById("orbitalContainer");
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  const orbits = [
    { radius: 180, maxMovies: 6, class: "orbit-1" },
    { radius: 280, maxMovies: 10, class: "orbit-2" },
    { radius: 380, maxMovies: 14, class: "orbit-3" },
    { radius: 480, maxMovies: 20, class: "orbit-4" }
  ];

  let movieIndex = 0;
  orbits.forEach((orbit) => {
    const moviesInOrbit = rankedMovies.slice(movieIndex, movieIndex + orbit.maxMovies);
    movieIndex += orbit.maxMovies;

    moviesInOrbit.forEach((item, i) => {
      const angle = (2 * Math.PI * i / moviesInOrbit.length) - Math.PI / 2;
      const radiusVariation = orbit.radius + (Math.random() - 0.5) * 30;
      const angleVariation = angle + (Math.random() - 0.5) * 0.15;
      const x = centerX + Math.cos(angleVariation) * radiusVariation;
      const y = centerY + Math.sin(angleVariation) * radiusVariation;
      const movieEl = createOrbitMovie(item, orbit.class, x, y);
      orbitingMovies.appendChild(movieEl);
    });
  });
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

  const posterUrl = movie.poster_path
    ? `${TMDB_IMG}w200${movie.poster_path}`
    : "https://placehold.co/80x120?text=?";

  div.innerHTML = `
    <img class="orbit-movie-poster" src="${posterUrl}" alt="${movie.title}">
    <div class="orbit-similarity"></div>
  `;

  // Single click → open MovieCube
  div.addEventListener("click", (e) => {
    e.stopPropagation();
    openCubeForMovie(movie.id);
  });

  // Double click → re-anchor
  div.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    makeNewAnchor(movie);
  });

  return div;
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
// MAKE NEW ANCHOR (preserved logic)
// ============================================

function makeNewAnchor(movie) {
  reAnchor(movie.id);
}

function reAnchor(movieId) {
  const movie = allMovies.find(m => m.id === movieId) || selectedMovie;
  if (!movie) return;

  fetchMovieDetails(movieId).then(fullMovie => {
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
  });
}

async function fetchMovieDetails(movieId) {
  try {
    return await OrbitUtils.tmdbFetch('/movie/' + movieId, { language: 'en-US' });
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
    if (e.key === "Escape") closeInfoPanel();
  });

  window.addEventListener("resize", OrbitUtils.debounce(() => { renderOrbits(); }, 250));

  // HUD expand button
  document.getElementById('hud-expand-btn')?.addEventListener('click', handleExpandUniverse);
}

// Anchor flash animation
const style = document.createElement("style");
style.textContent = `@keyframes anchor-flash { 0% { filter: brightness(1); } 50% { filter: brightness(2) drop-shadow(0 0 30px gold); } 100% { filter: brightness(1); } }`;
document.head.appendChild(style);

// ============================================
// EXPAND UNIVERSE (preserved logic)
// ============================================

function checkExpandUniverse() {
  // Original expand button is always hidden now — HUD button handles this
  const expandUniverse = document.getElementById("expandUniverse");
  if (expandUniverse) expandUniverse.hidden = true;
}

async function handleExpandUniverse() {
  const hudBtn = document.getElementById('hud-expand-btn');
  if (!anchorMovie) return;

  if (hudBtn) { hudBtn.classList.add('loading'); }

  try {
    const [similarData, recData] = await Promise.all([
      OrbitUtils.tmdbFetch('/movie/' + anchorMovie.id + '/similar', { page: 1 }),
      OrbitUtils.tmdbFetch('/movie/' + anchorMovie.id + '/recommendations', { page: 1 })
    ]);

    const existingIds = new Set([anchorMovie.id, ...allMovies.map(m => m.id)]);
    const newMovies = [...(similarData.results || []), ...(recData.results || [])]
      .filter(m => m.poster_path && !existingIds.has(m.id));

    const uniqueNew = [];
    const seenIds = new Set();
    for (const m of newMovies) {
      if (!seenIds.has(m.id)) { seenIds.add(m.id); uniqueNew.push(m); }
    }

    const toAdd = uniqueNew.slice(0, 20);
    if (toAdd.length > 0) {
      allMovies = [...allMovies, ...toAdd];
      localStorage.setItem("constellationMovies", JSON.stringify([anchorMovie, ...allMovies]));
      calculateSimilarities();
      renderOrbits();
      updateFilmCount(allMovies.length);
    }

    if (hudBtn) {
      hudBtn.innerHTML = '<span class="og og-galaxy"></span> EXPLORE DEEPER';
    }
  } catch (e) {
    console.error("Failed to expand universe:", e);
  }

  if (hudBtn) hudBtn.classList.remove('loading');
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
