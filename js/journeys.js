// ============================================
// JOURNEYS - Game Logic
// Orbit Games Suite - Six Degrees Connection
// TRUE HONEYCOMB PATH IMPLEMENTATION
// ============================================

// Daily puzzles - curated actor pairs with par values
const DAILY_JOURNEYS = [
  // Week 1 - Classic connections
  { start: { id: 31, name: "Tom Hanks" }, end: { id: 4724, name: "Kevin Bacon" }, par: 2 },
  { start: { id: 6193, name: "Leonardo DiCaprio" }, end: { id: 192, name: "Morgan Freeman" }, par: 3 },
  { start: { id: 1245, name: "Scarlett Johansson" }, end: { id: 3223, name: "Robert De Niro" }, par: 3 },
  { start: { id: 287, name: "Brad Pitt" }, end: { id: 514, name: "Jack Nicholson" }, par: 2 },
  { start: { id: 500, name: "Tom Cruise" }, end: { id: 17419, name: "Bill Murray" }, par: 3 },
  { start: { id: 1892, name: "Matt Damon" }, end: { id: 85, name: "Johnny Depp" }, par: 3 },
  { start: { id: 380, name: "Robert Downey Jr." }, end: { id: 2888, name: "Will Smith" }, par: 3 },

  // Week 2 - Modern stars
  { start: { id: 1136406, name: "Tom Holland" }, end: { id: 16828, name: "Chris Evans" }, par: 2 },
  { start: { id: 17881, name: "Ryan Gosling" }, end: { id: 3894, name: "Christian Bale" }, par: 3 },
  { start: { id: 1357546, name: "Timothée Chalamet" }, end: { id: 6193, name: "Leonardo DiCaprio" }, par: 3 },
  { start: { id: 224513, name: "Emma Stone" }, end: { id: 1245, name: "Scarlett Johansson" }, par: 3 },
  { start: { id: 73457, name: "Chris Pratt" }, end: { id: 31, name: "Tom Hanks" }, par: 3 },
  { start: { id: 505710, name: "Zendaya" }, end: { id: 17288, name: "Amy Adams" }, par: 4 },
  { start: { id: 74568, name: "Chris Hemsworth" }, end: { id: 287, name: "Brad Pitt" }, par: 3 },

  // Week 3 - Challenging paths
  { start: { id: 17052, name: "Adrien Brody" }, end: { id: 2, name: "Mark Hamill" }, par: 4 },
  { start: { id: 5344, name: "Meg Ryan" }, end: { id: 8691, name: "Zoe Saldana" }, par: 4 }, // Fixed ID
  { start: { id: 738, name: "Sean Connery" }, end: { id: 380, name: "Robert Downey Jr." }, par: 3 },
  { start: { id: 3084, name: "Marlon Brando" }, end: { id: 500, name: "Tom Cruise" }, par: 3 },
  { start: { id: 1937, name: "Joe Pesci" }, end: { id: 73457, name: "Chris Pratt" }, par: 4 },
  { start: { id: 6952, name: "Shelley Duvall" }, end: { id: 1357546, name: "Timothée Chalamet" }, par: 5 },
  { start: { id: 2176, name: "Tommy Lee Jones" }, end: { id: 224513, name: "Emma Stone" }, par: 4 }
];

// Game state
let gameState = {
  startActor: null,
  endActor: null,
  par: 3,
  chain: [], // Array of {type: 'actor'|'movie', id, name, photo?, poster?, isStart?, isGoal?}
  currentActor: null,
  searchType: 'movie',
  steps: 0,
  completed: false,
  puzzleNumber: 1
};

// Cache for filmographies
let filmographyCache = {};

// DOM elements
let parValue, stepsValue;
let honeycombContainer;
let searchInput, searchResults;
let inputHint, currentActorName;
let undoBtn, resetBtn;
let celebrationOverlay, postgameResults;
let headerStatus;

// Honeycomb geometry (flat-top hexagons)
const HEX_SIZE = 55; // radius (center to vertex)
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;

// For SIDE-TOUCHING flat-top hexagons:
const HORIZ_SPACING = HEX_SIZE * 1.5;        // Gameplay spacing
const COMPLETE_SPACING = HEX_SIZE * 1.75;     // Completion spacing (touch, no overlap)
const VERT_OFFSET = HEX_HEIGHT * 0.5;        // Zigzag amount for honeycomb

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadDailyPuzzle();
});

function cacheElements() {
  parValue = document.getElementById("parValue");
  stepsValue = document.getElementById("stepsValue");

  honeycombContainer = document.getElementById("honeycombContainer");

  searchInput = document.getElementById("searchInput");
  searchResults = document.getElementById("searchResults");

  inputHint = document.getElementById("inputHint");
  currentActorName = document.getElementById("currentActorName");

  undoBtn = document.getElementById("undoBtn");
  resetBtn = document.getElementById("resetBtn");

  celebrationOverlay = document.getElementById("celebrationOverlay");
  postgameResults = document.getElementById("postgameResults");
  headerStatus = document.getElementById("headerStatus");
}

function setupEventListeners() {
  // Search input
  searchInput.addEventListener("input", debounce(handleSearch, 300));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") searchResults.hidden = true;
  });

  // Click outside to close search
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      searchResults.hidden = true;
    }
  });

  // Toggle buttons
  document.getElementById("movieToggle").addEventListener("click", () => setSearchType("movie"));
  document.getElementById("actorToggle").addEventListener("click", () => setSearchType("actor"));

  // Action buttons
  undoBtn.addEventListener("click", undoStep);
  resetBtn.addEventListener("click", resetGame);

  // Modals
  document.getElementById("helpBtn").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = false;
  });
  document.getElementById("helpClose").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = true;
  });
  document.getElementById("statsBtn").addEventListener("click", () => {
    loadStats();
    document.getElementById("statsModal").hidden = false;
  });
  document.getElementById("statsClose").addEventListener("click", () => {
    document.getElementById("statsModal").hidden = true;
  });

  // Share
  document.getElementById("shareBtn").addEventListener("click", shareResult);

  // Celebration overlay
  document.getElementById("celebrationClose").addEventListener("click", closeCelebration);
  celebrationOverlay.addEventListener("click", (e) => {
    if (e.target === celebrationOverlay) closeCelebration();
  });
  document.getElementById("reviewBtn").addEventListener("click", closeCelebration);

  // Postgame close button
  const postgameClose = document.getElementById("postgameClose");
  if (postgameClose) {
    postgameClose.addEventListener("click", () => {
      postgameResults.hidden = true;
    });
  }

  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Resize handler
  window.addEventListener('resize', debounce(() => {
    renderHoneycombPath();
  }, 200));
}

// ============================================
// PUZZLE LOADING
// ============================================

function getDailyPuzzleIndex() {
  const launchDate = new Date("2025-01-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNumber = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24));
  return dayNumber % DAILY_JOURNEYS.length;
}

async function loadDailyPuzzle() {
  const puzzleIndex = getDailyPuzzleIndex();
  const puzzle = DAILY_JOURNEYS[puzzleIndex];

  gameState.puzzleNumber = puzzleIndex + 1;
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;

  gameState.startActor = { ...puzzle.start };
  gameState.endActor = { ...puzzle.end };
  gameState.par = puzzle.par;
  parValue.textContent = puzzle.par;

  // Check for saved state
  const savedState = loadTodayState();
  if (savedState && savedState.chain && savedState.chain.length > 0) {
    gameState.chain = savedState.chain;
    gameState.currentActor = savedState.currentActor;
    gameState.steps = savedState.steps || 0;
    gameState.completed = savedState.completed || false;
    gameState.searchType = savedState.searchType || 'movie';
  } else {
    gameState.currentActor = { ...puzzle.start };
    gameState.chain = [{ type: 'actor', id: puzzle.start.id, name: puzzle.start.name, isStart: true }];
    gameState.steps = 0;
    gameState.completed = false;
  }

  // Track that the player started today's puzzle
  trackPlayed();

  // Always load photos fresh from TMDB
  await loadActorPhotos();

  if (gameState.completed) {
    const inputSection = document.getElementById('inputSection');
    if (inputSection) inputSection.hidden = true;
    updateUI();
    renderHoneycombPath();
    showResult();
    return;
  }

  // Sync toggle UI with restored search type
  setSearchType(gameState.searchType);

  // Pre-load filmography for current actor
  if (gameState.currentActor && gameState.currentActor.id) {
    await loadFilmography(gameState.currentActor.id);
  }

  renderHoneycombPath();
  updateUI();
}

async function loadActorPhotos() {
  const placeholder = (color) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='185' height='185' viewBox='0 0 185 185'%3E%3Crect fill='%23111827' width='185' height='185'/%3E%3Ctext x='92' y='100' text-anchor='middle' fill='${encodeURIComponent(color)}' font-size='48'%3E%3F%3C/text%3E%3C/svg%3E`;

  // Load start actor photo
  if (gameState.startActor && gameState.startActor.id) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${gameState.startActor.id}?api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      gameState.startActor.photo = data.profile_path
        ? `${TMDB_IMG}w185${data.profile_path}`
        : placeholder('#00d9ff');
      // Update chain's first item
      if (gameState.chain[0] && gameState.chain[0].isStart) {
        gameState.chain[0].photo = gameState.startActor.photo;
      }
    } catch (err) {
      console.error("Error loading start actor photo:", err);
      gameState.startActor.photo = placeholder('#00d9ff');
    }
  }

  // Load end actor photo
  if (gameState.endActor && gameState.endActor.id) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${gameState.endActor.id}?api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      gameState.endActor.photo = data.profile_path
        ? `${TMDB_IMG}w185${data.profile_path}`
        : placeholder('#ffd700');
      // Update chain's goal item if present
      const goalItem = gameState.chain.find(item => item.isGoal);
      if (goalItem) goalItem.photo = gameState.endActor.photo;
    } catch (err) {
      console.error("Error loading end actor photo:", err);
      gameState.endActor.photo = placeholder('#ffd700');
    }
  }

  // Load photos for chain actors
  for (const item of gameState.chain) {
    if (item.type === 'actor' && !item.photo) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/${item.id}?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        item.photo = data.profile_path
          ? `${TMDB_IMG}w185${data.profile_path}`
          : placeholder('#a855f7');
      } catch (err) {
        item.photo = placeholder('#a855f7');
      }
    }
    // Load posters for movies
    if (item.type === 'movie' && !item.poster) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${item.id}?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        item.poster = data.poster_path ? `${TMDB_IMG}w185${data.poster_path}` : null;
      } catch (err) {
        item.poster = null;
      }
    }
  }
}

async function loadFilmography(actorId) {
  if (filmographyCache[actorId]) return filmographyCache[actorId];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();

    const movies = (data.cast || [])
      .filter(m => m.vote_count > 10)
      .map(m => ({ id: m.id, title: m.title }));

    filmographyCache[actorId] = movies;
    return movies;
  } catch (err) {
    console.error("Error loading filmography:", err);
    return [];
  }
}

// ============================================
// SEARCH
// ============================================

function setSearchType(type) {
  gameState.searchType = type;

  document.getElementById("movieToggle").classList.toggle("active", type === "movie");
  document.getElementById("actorToggle").classList.toggle("active", type === "actor");

  searchInput.placeholder = type === "movie" ? "Search for a movie..." : "Search for an actor...";
  searchInput.value = "";
  searchResults.hidden = true;

  updateInputHint();
}

function updateInputHint() {
  const lastItem = gameState.chain[gameState.chain.length - 1];

  if (lastItem.type === 'actor') {
    currentActorName.textContent = lastItem.name;
    inputHint.innerHTML = `Find a movie featuring <span id="currentActorName">${lastItem.name}</span>`;
  } else {
    inputHint.innerHTML = `Find an actor from <span id="currentActorName">${lastItem.name}</span>`;
  }
}

async function handleSearch() {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    searchResults.hidden = true;
    return;
  }

  const endpoint = gameState.searchType === 'movie' ? 'search/movie' : 'search/person';

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    const results = (data.results || []).slice(0, 6);

    if (results.length === 0) {
      searchResults.hidden = true;
      return;
    }

    searchResults.innerHTML = results.map(item => {
      if (gameState.searchType === 'movie') {
        const poster = item.poster_path ? `${TMDB_IMG}w92${item.poster_path}` : "";
        const year = item.release_date?.split("-")[0] || "";
        const safeTitle = (item.title || "").replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const posterPath = item.poster_path || "";
        return `
          <div class="search-result-item" data-id="${item.id}" data-title="${safeTitle}" data-type="movie" data-poster="${posterPath}">
            <img class="search-result-img poster" src="${poster}" alt="">
            <div>
              <div class="search-result-title">${item.title}</div>
              <div class="search-result-sub">${year}</div>
            </div>
          </div>
        `;
      } else {
        const photo = item.profile_path ? `${TMDB_IMG}w185${item.profile_path}` : "";
        const safeName = (item.name || "").replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `
          <div class="search-result-item" data-id="${item.id}" data-name="${safeName}" data-type="actor" data-photo="${photo}">
            <img class="search-result-img" src="${photo}" alt="">
            <div>
              <div class="search-result-title">${item.name}</div>
              <div class="search-result-sub">${item.known_for_department || 'Actor'}</div>
            </div>
          </div>
        `;
      }
    }).join("");

    searchResults.hidden = false;

    searchResults.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => handleSelection(item));
    });

  } catch (err) {
    console.error("Search error:", err);
  }
}

async function handleSelection(item) {
  const type = item.dataset.type;
  const id = parseInt(item.dataset.id);

  searchInput.value = "";
  searchResults.hidden = true;

  if (type === 'movie') {
    const posterPath = item.dataset.poster;
    await handleMovieSelection(id, item.dataset.title, posterPath);
  } else {
    await handleActorSelection(id, item.dataset.name, item.dataset.photo);
  }
}

async function handleMovieSelection(movieId, movieTitle, posterPath) {
  const currentActorId = gameState.currentActor.id;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await res.json();

    const actorInMovie = (credits.cast || []).some(c => c.id === currentActorId);

    if (!actorInMovie) {
      showNotification(`${gameState.currentActor.name} is not in ${movieTitle}`, 'error');
      return;
    }

    const posterUrl = posterPath ? `${TMDB_IMG}w185${posterPath}` : null;
    gameState.chain.push({ type: 'movie', id: movieId, name: movieTitle, poster: posterUrl });
    gameState.steps++;

    setSearchType('actor');
    renderHoneycombPath();
    updateUI();
    saveTodayState();

  } catch (err) {
    console.error("Error validating movie:", err);
  }
}

async function handleActorSelection(actorId, actorName, actorPhoto) {
  const lastMovie = gameState.chain[gameState.chain.length - 1];

  if (lastMovie.type !== 'movie') {
    showNotification("Please select a movie first", 'error');
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${lastMovie.id}/credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await res.json();

    const actorInMovie = (credits.cast || []).some(c => c.id === actorId);

    if (!actorInMovie) {
      showNotification(`${actorName} is not in ${lastMovie.name}`, 'error');
      return;
    }

    // Check if this is the GOAL actor!
    if (actorId === gameState.endActor.id) {
      gameState.chain.push({ 
        type: 'actor', 
        id: actorId, 
        name: actorName, 
        photo: actorPhoto || gameState.endActor.photo,
        isGoal: true 
      });
      gameState.completed = true;
      updateUI();
      saveTodayState();
      saveStats();
      renderHoneycombPath();
      setTimeout(() => showResult(), 800);
      return;
    }

    // Check for loops
    if (gameState.chain.some(item => item.type === 'actor' && item.id === actorId)) {
      showNotification("You've already used this actor", 'error');
      return;
    }

    gameState.chain.push({ type: 'actor', id: actorId, name: actorName, photo: actorPhoto });
    gameState.currentActor = { id: actorId, name: actorName };

    await loadFilmography(actorId);

    setSearchType('movie');
    renderHoneycombPath();
    updateUI();
    saveTodayState();

  } catch (err) {
    console.error("Error validating actor:", err);
  }
}

// ============================================
// HONEYCOMB PATH RENDERING (SVG-based)
// ============================================

function renderHoneycombPath() {
  if (!honeycombContainer) return;

  const rect = honeycombContainer.getBoundingClientRect();
  const W = rect.width || 800;
  const H = rect.height || 280;

  const isComplete = gameState.completed;
  const centerY = H / 2;

  // Middle chain items (everything except START chain[0] and GOAL if complete)
  const middleItems = [];
  for (let i = 1; i < gameState.chain.length; i++) {
    const item = gameState.chain[i];
    if (item.isGoal) continue;
    middleItems.push(item);
  }

  let startPos, goalPos, middlePositions;

  if (isComplete) {
    // CENTERED chain with COMPLETE_SPACING (touch, no overlap)
    const totalHexagons = middleItems.length + 2; // START + middles + GOAL
    const totalChainWidth = (totalHexagons - 1) * COMPLETE_SPACING;
    const chainStartX = (W - totalChainWidth) / 2;

    startPos = { x: chainStartX, y: centerY };
    goalPos = { x: chainStartX + (totalHexagons - 1) * COMPLETE_SPACING, y: centerY };

    // Middle positions between START and GOAL
    middlePositions = [];
    for (let i = 0; i < middleItems.length; i++) {
      const x = chainStartX + (i + 1) * COMPLETE_SPACING;
      const zigzag = ((i + 1) % 2 === 0 ? -VERT_OFFSET * 0.35 : VERT_OFFSET * 0.35);
      middlePositions.push({ x, y: centerY + zigzag });
    }
  } else {
    // Gameplay: START fixed left, GOAL fixed right
    startPos = { x: HEX_SIZE + 30, y: centerY };
    goalPos = { x: W - HEX_SIZE - 30, y: centerY };
    middlePositions = computeMiddlePositions(middleItems.length, startPos, goalPos, centerY);
  }

  // Assemble full node list: START + middles + GOAL
  const allNodes = [];
  allNodes.push({ pos: startPos, item: gameState.chain[0], isPlaceholder: false });
  middleItems.forEach((item, i) => {
    allNodes.push({ pos: middlePositions[i], item, isPlaceholder: false });
  });
  const goalItem = isComplete
    ? gameState.chain.find(item => item.isGoal)
    : null;
  allNodes.push({ pos: goalPos, item: goalItem, isPlaceholder: !isComplete });

  // Build SVG
  let svg = `<svg class="honeycomb-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // Defs for gradients, filters, clip paths
  svg += `
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00d9ff"/>
        <stop offset="50%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="${isComplete ? '#ffd700' : '#14b8a6'}"/>
      </linearGradient>
      <linearGradient id="lineGradientGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffd700"/>
        <stop offset="100%" stop-color="#ffaa00"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  `;

  // Draw connection lines center-to-center (hex edges provide visual connection)
  for (let i = 1; i < allNodes.length; i++) {
    const prev = allNodes[i - 1].pos;
    const curr = allNodes[i].pos;

    const node = allNodes[i];
    const isToPlaceholder = node.isPlaceholder;
    const isToGoal = node.item && node.item.isGoal;

    if (isToPlaceholder) {
      // Dashed faded line to GOAL placeholder
      svg += `<line x1="${prev.x}" y1="${prev.y}" x2="${curr.x}" y2="${curr.y}"
                    stroke="#ffd700" stroke-width="2" stroke-linecap="round"
                    stroke-dasharray="8,6" opacity="0.3"/>`;
    } else {
      const strokeColor = isToGoal ? 'url(#lineGradientGold)' : 'url(#lineGradient)';
      svg += `<line x1="${prev.x}" y1="${prev.y}" x2="${curr.x}" y2="${curr.y}"
                    stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"
                    filter="url(#glow)" opacity="0.6"/>`;
    }
  }

  // Draw hexagon nodes
  allNodes.forEach((node, i) => {
    svg += renderHexagonNode(node.pos, node.item, i, node.isPlaceholder, isComplete);
  });

  svg += `</svg>`;
  honeycombContainer.innerHTML = svg;

  // Add click handlers ONLY when game is complete
  if (isComplete) {
    attachClickHandlers();
  }

  // Update header status
  if (headerStatus) {
    headerStatus.textContent = isComplete ? 'COMPLETE ✓' : '';
    headerStatus.classList.toggle('visible', isComplete);
  }
}

function computeMiddlePositions(count, startPos, goalPos, centerY) {
  // Only used during gameplay (completion is handled inline)
  if (count === 0) return [];

  const positions = [];
  const maxWidth = (goalPos.x - startPos.x - 100) * 0.60;
  const chainStartX = startPos.x + HORIZ_SPACING;

  for (let i = 0; i < count; i++) {
    const x = Math.min(chainStartX + i * HORIZ_SPACING, chainStartX + maxWidth);
    const zigzag = (i % 2 === 0 ? -VERT_OFFSET * 0.4 : VERT_OFFSET * 0.4);
    positions.push({ x, y: centerY + zigzag });
  }

  return positions;
}

function hexPathD(cx, cy, size) {
  // Flat-top hexagon: first vertex at angle 0 (right), flat edges on top/bottom
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // Flat-top orientation
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return `M${points.join('L')}Z`;
}

function renderHexagonNode(pos, item, index, isPlaceholder, isComplete) {
  let svg = '';

  const isStart = item?.isStart;
  const isGoal = item?.isGoal;
  const isMovie = item?.type === 'movie';
  const isActor = item?.type === 'actor';

  // Determine colors
  let fillColor, strokeColor, glowFilter;
  if (isPlaceholder) {
    fillColor = 'rgba(30, 41, 59, 0.3)';
    strokeColor = '#ffd700';
    glowFilter = '';
  } else if (isStart) {
    fillColor = 'rgba(0, 217, 255, 0.15)';
    strokeColor = '#00d9ff';
    glowFilter = 'filter="url(#glowStrong)"';
  } else if (isGoal) {
    fillColor = 'rgba(255, 215, 0, 0.2)';
    strokeColor = '#ffd700';
    glowFilter = 'filter="url(#glowStrong)"';
  } else if (isMovie) {
    fillColor = 'rgba(0, 217, 255, 0.1)';
    strokeColor = '#00d9ff';
    glowFilter = 'filter="url(#glow)"';
  } else if (isActor) {
    fillColor = 'rgba(168, 85, 247, 0.15)';
    strokeColor = '#a855f7';
    glowFilter = 'filter="url(#glow)"';
  } else {
    fillColor = 'rgba(30, 41, 59, 0.5)';
    strokeColor = '#64748b';
    glowFilter = '';
  }

  const strokeWidth = (isStart || isGoal) ? 3 : 2;
  const clickableClass = !isPlaceholder && isComplete ? 'hex-clickable' : '';
  const dataAttrs = !isPlaceholder && item
    ? `data-type="${item.type}" data-id="${item.id}" data-name="${(item.name || '').replace(/"/g, '&quot;')}"`
    : '';

  svg += `<g class="hex-node ${clickableClass}" transform="translate(${pos.x}, ${pos.y})" ${dataAttrs}>`;

  // Hexagon background
  svg += `<path d="${hexPathD(0, 0, HEX_SIZE)}" fill="${fillColor}" stroke="${strokeColor}" 
               stroke-width="${strokeWidth}" ${glowFilter}/>`;

  // Content
  if (isPlaceholder) {
    // Goal placeholder with dashed outline
    svg += `<path d="${hexPathD(0, 0, HEX_SIZE - 4)}" fill="none" stroke="#ffd700" 
                 stroke-width="2" stroke-dasharray="6,4" opacity="0.5"/>`;
    svg += `<text x="0" y="5" text-anchor="middle" fill="#ffd700" font-size="20" opacity="0.6">?</text>`;
    svg += `<text x="0" y="${HEX_SIZE + 18}" text-anchor="middle" fill="#ffd700" 
                 font-size="10" font-family="Orbitron, sans-serif" opacity="0.7">${gameState.endActor?.name || 'GOAL'}</text>`;
  } else if (isMovie) {
    // Movie title
    const words = (item.name || '').toUpperCase().split(' ');
    const lines = wrapText(words, 10);
    const lineHeight = 10;
    const startY = -(lines.length - 1) * lineHeight / 2;

    lines.slice(0, 4).forEach((line, i) => {
      svg += `<text x="0" y="${startY + i * lineHeight + 3}" text-anchor="middle" 
                   fill="#00d9ff" font-size="8" font-family="Orbitron, sans-serif" font-weight="bold">${escapeHtml(line)}</text>`;
    });
  } else if (isActor) {
    // Actor photo clipped to hexagon shape (fills entire hex)
    const photoUrl = item.photo || '';
    if (photoUrl) {
      const clipId = `hex-clip-${index}`;
      svg += `<defs><clipPath id="${clipId}"><path d="${hexPathD(0, 0, HEX_SIZE - 2)}"/></clipPath></defs>`;
      svg += `<image href="${photoUrl}" x="${-HEX_SIZE + 2}" y="${-HEX_SIZE + 2}"
                   width="${(HEX_SIZE - 2) * 2}" height="${(HEX_SIZE - 2) * 2}"
                   clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`;
    } else {
      svg += `<text x="0" y="5" text-anchor="middle" fill="${strokeColor}" font-size="24">👤</text>`;
    }

    // Name below
    svg += `<text x="0" y="${HEX_SIZE + 16}" text-anchor="middle" fill="#f1f5f9" 
                 font-size="10" font-family="Barlow, sans-serif">${escapeHtml(item.name)}</text>`;

    // Badge
    if (isStart) {
      svg += `<text x="0" y="${HEX_SIZE + 30}" text-anchor="middle" fill="#00d9ff" 
                   font-size="9" font-family="Orbitron, sans-serif" font-weight="bold">START</text>`;
    } else if (isGoal) {
      svg += `<text x="0" y="${HEX_SIZE + 30}" text-anchor="middle" fill="#ffd700" 
                   font-size="9" font-family="Orbitron, sans-serif" font-weight="bold">GOAL ✓</text>`;
    }
  }

  svg += `</g>`;
  return svg;
}

function wrapText(words, maxLen) {
  const lines = [];
  let current = '';
  words.forEach(word => {
    if ((current + ' ' + word).trim().length > maxLen) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  });
  if (current) lines.push(current);
  return lines;
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function attachClickHandlers() {
  // ONLY attach when game is complete - prevents cheating!
  if (!gameState.completed) return;

  const nodes = honeycombContainer.querySelectorAll('.hex-clickable');
  nodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const type = node.getAttribute('data-type');
      const id = node.getAttribute('data-id');
      const name = node.getAttribute('data-name');

      if (type === 'actor') {
        window.location.href = `timeline.html?search=${encodeURIComponent(name)}&type=person`;
      } else if (type === 'movie') {
        localStorage.setItem("singleMovie", JSON.stringify({ id: parseInt(id), title: name }));
        localStorage.setItem("resultsMode", "single");
        window.location.href = 'results.html';
      }
    });
  });
}

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
  const movieCount = gameState.chain.filter(item => item.type === 'movie').length;
  stepsValue.textContent = movieCount;
  gameState.steps = movieCount;

  undoBtn.disabled = gameState.chain.length <= 1;

  updateInputHint();
}

function showNotification(message, type = 'info') {
  const hint = document.getElementById("inputHint");
  const originalText = hint.innerHTML;
  hint.innerHTML = `<span style="color: ${type === 'error' ? '#ff4757' : '#14b8a6'}">${message}</span>`;
  setTimeout(() => {
    hint.innerHTML = originalText;
    updateInputHint();
  }, 2000);
}

// ============================================
// GAME ACTIONS
// ============================================

function undoStep() {
  if (gameState.chain.length <= 1) return;

  const removed = gameState.chain.pop();

  // Decrement steps if we removed a movie (movies increment steps on add)
  if (removed.type === 'movie' && gameState.steps > 0) {
    gameState.steps--;
  }

  const lastItem = gameState.chain[gameState.chain.length - 1];
  if (lastItem.type === 'actor') {
    gameState.currentActor = { id: lastItem.id, name: lastItem.name };
    setSearchType('movie');
  } else {
    setSearchType('actor');
  }

  renderHoneycombPath();
  updateUI();
  saveTodayState();
}

function resetGame() {
  celebrationOverlay.hidden = true;
  postgameResults.hidden = true;
  gameState.completed = false;

  gameState.chain = [{
    type: 'actor',
    id: gameState.startActor.id,
    name: gameState.startActor.name,
    photo: gameState.startActor.photo,
    isStart: true
  }];
  gameState.currentActor = { ...gameState.startActor };
  gameState.steps = 0;
  gameState.searchType = 'movie';

  const inputSection = document.getElementById('inputSection');
  if (inputSection) inputSection.hidden = false;

  setSearchType('movie');
  renderHoneycombPath();
  updateUI();
  saveTodayState();
}

// ============================================
// RESULT & CELEBRATION
// ============================================

function showResult() {
  const steps = gameState.steps;
  const par = gameState.par;

  document.getElementById("yourSteps").textContent = steps;
  document.getElementById("parSteps").textContent = par;

  const verdictEl = document.getElementById("scoreVerdict");

  if (steps < par) {
    verdictEl.textContent = `${par - steps} Under Par!`;
    verdictEl.className = "score-verdict under-par";
  } else if (steps === par) {
    verdictEl.textContent = "On Par!";
    verdictEl.className = "score-verdict on-par";
  } else {
    verdictEl.textContent = `${steps - par} Over Par`;
    verdictEl.className = "score-verdict over-par";
  }

  celebrationOverlay.hidden = false;
  startNextPuzzleCountdown();
}

function closeCelebration() {
  celebrationOverlay.hidden = true;
  renderPostGameResults();
}

function renderPostGameResults() {
  const moviesGrid = document.getElementById('moviesGrid');
  const actorsGrid = document.getElementById('actorsGrid');
  if (!moviesGrid || !actorsGrid) return;

  const movies = gameState.chain.filter(item => item.type === 'movie');
  const actors = gameState.chain.filter(item => item.type === 'actor');

  // Render movies
  moviesGrid.innerHTML = movies.map(movie => {
    const safeTitle = (movie.name || '').replace(/"/g, '&quot;');
    const posterSrc = movie.poster || '';
    return `
      <div class="postgame-card postgame-movie" data-id="${movie.id}" data-title="${safeTitle}">
        <img class="postgame-poster" src="${posterSrc}" alt="${movie.name}" data-movie-id="${movie.id}">
        <div class="postgame-title">${movie.name}</div>
      </div>
    `;
  }).join('');

  // Render actors
  actorsGrid.innerHTML = actors.map(actor => {
    const isStart = actor.isStart;
    const isGoal = actor.isGoal;
    const badgeClass = isStart ? 'badge-start' : isGoal ? 'badge-goal' : '';
    const badgeText = isStart ? 'START' : isGoal ? 'GOAL' : '';
    const photo = actor.photo || '';
    return `
      <div class="postgame-card postgame-actor" data-id="${actor.id}" data-name="${(actor.name || '').replace(/"/g, '&quot;')}">
        <img class="postgame-photo" src="${photo}" alt="${actor.name}">
        <div class="postgame-title">${actor.name}</div>
        ${badgeText ? `<div class="postgame-badge ${badgeClass}">${badgeText}</div>` : ''}
      </div>
    `;
  }).join('');

  postgameResults.hidden = false;

  // Fetch missing posters
  movies.forEach(async (movie) => {
    if (movie.poster) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      const posterUrl = data.poster_path ? `${TMDB_IMG}w185${data.poster_path}` : '';
      const img = moviesGrid.querySelector(`img[data-movie-id="${movie.id}"]`);
      if (img && posterUrl) img.src = posterUrl;
    } catch (err) {}
  });

  // Click handlers - ONLY post-game
  moviesGrid.querySelectorAll('.postgame-movie').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const title = card.dataset.title;
      localStorage.setItem("singleMovie", JSON.stringify({ id, title }));
      localStorage.setItem("resultsMode", "single");
      window.location.href = 'results.html';
    });
  });

  actorsGrid.querySelectorAll('.postgame-actor').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      window.location.href = `timeline.html?search=${encodeURIComponent(name)}&type=person`;
    });
  });
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("journeys_stats");
  return stored ? JSON.parse(stored) : { played: 0, solved: 0, totalSteps: 0, underPar: 0 };
}

function saveStats() {
  const stats = getStats();
  stats.solved++;
  stats.totalSteps += gameState.steps;
  if (gameState.steps < gameState.par) stats.underPar++;
  localStorage.setItem("journeys_stats", JSON.stringify(stats));
}

function trackPlayed() {
  const key = getTodayKey() + '_tracked';
  if (localStorage.getItem(key)) return;
  const stats = getStats();
  stats.played++;
  localStorage.setItem("journeys_stats", JSON.stringify(stats));
  localStorage.setItem(key, '1');
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statSolved").textContent = stats.solved;
  document.getElementById("statAvgSteps").textContent = stats.solved > 0 ? (stats.totalSteps / stats.solved).toFixed(1) : 0;
  document.getElementById("statUnderPar").textContent = stats.underPar;
}

// ============================================
// STATE PERSISTENCE
// ============================================

function getTodayKey() {
  const today = new Date();
  return `journeys_game_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
}

function saveTodayState() {
  const stateToSave = {
    ...gameState,
    startActor: { id: gameState.startActor.id, name: gameState.startActor.name },
    endActor: { id: gameState.endActor.id, name: gameState.endActor.name },
    chain: gameState.chain.map(item => {
      const { photo, poster, ...rest } = item;
      return rest;
    })
  };
  localStorage.setItem(getTodayKey(), JSON.stringify(stateToSave));
}

function loadTodayState() {
  const stored = localStorage.getItem(getTodayKey());
  return stored ? JSON.parse(stored) : null;
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  const steps = gameState.steps;
  const par = gameState.par;

  let verdict = "";
  if (steps < par) verdict = `🦅 ${par - steps} under par!`;
  else if (steps === par) verdict = "🎯 On par!";
  else verdict = `${steps - par} over par`;

  const chainEmoji = gameState.chain.map(item => item.type === 'actor' ? '🎭' : '🎬').join('→');

  const text = `🛤️ Journeys #${gameState.puzzleNumber}

${gameState.startActor.name} → ${gameState.endActor.name}

${chainEmoji}
${steps} steps (Par ${par})
${verdict}

Play at orbit-game.com/journeys`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.innerHTML = "<span>✓</span> Copied!";
    setTimeout(() => {
      btn.innerHTML = "<span>📋</span> Share";
    }, 2000);
  });
}

// ============================================
// COUNTDOWN
// ============================================

function startNextPuzzleCountdown() {
  const nextTimer = document.getElementById("nextTimer");

  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    nextTimer.textContent = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  update();
  setInterval(update, 1000);
}

// ============================================
// UTILITIES
// ============================================

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============================================
// CANVAS HONEYCOMB BACKGROUND
// ============================================

(function initHoneycombBG() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, hexes = [], frame = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    hexes = buildHexes();
  }

  function hexPath(cx, cy, r, rotation) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + rotation;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function buildHexes() {
    const count = Math.round(80 + W / 18);
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const edge = Math.abs(x - W / 2) / (W / 2);
      const r = 10 + edge * 30 + Math.random() * 25;
      const baseAlpha = 0.03 + edge * 0.14 + Math.random() * 0.05;
      const rotation = Math.random() * Math.PI;
      const blurLevel = Math.random() < 0.25 ? 1 + Math.random() * 3 : 0;
      const leftness = 1 - x / W;
      let cr, cg, cb;
      if (Math.random() < 0.08) { cr = 168; cg = 85; cb = 247; }
      else {
        cr = Math.round(0 * leftness + 255 * (1 - leftness));
        cg = Math.round(217 * leftness + 215 * (1 - leftness));
        cb = Math.round(255 * leftness + 0 * (1 - leftness));
      }
      const speed = 0.3 + Math.random() * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const driftAmp = 3 + Math.random() * 10;
      arr.push({ x, y, r, rotation, baseAlpha, blurLevel, cr, cg, cb, speed, phase, driftAmp });
    }
    return arr;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5) * W;
      const sy = (Math.sin(i * 269.5 + 183.3) * 0.5 + 0.5) * H;
      const sr = 0.4 + (i % 5) * 0.2;
      const sa = 0.2 + Math.sin(frame * 0.01 + i) * 0.15;
      ctx.fillStyle = `rgba(200,220,255,${sa})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    const t = frame * 0.008;
    for (const h of hexes) {
      const pulse = Math.sin(t * h.speed + h.phase);
      const dy = pulse * h.driftAmp;
      const alpha = h.baseAlpha * (0.7 + pulse * 0.3);
      const scale = 1 + pulse * 0.04;

      ctx.save();
      ctx.translate(h.x, h.y + dy);
      ctx.scale(scale, scale);
      if (h.blurLevel > 0) ctx.filter = `blur(${h.blurLevel}px)`;

      hexPath(0, 0, h.r, h.rotation);
      ctx.fillStyle = `rgba(${h.cr},${h.cg},${h.cb},${alpha * 0.12})`;
      ctx.fill();

      hexPath(0, 0, h.r, h.rotation);
      ctx.strokeStyle = `rgba(${h.cr},${h.cg},${h.cb},${alpha})`;
      ctx.lineWidth = h.r > 25 ? 1 : 0.6;
      ctx.stroke();

      ctx.filter = 'none';
      ctx.restore();
    }

    // Gradients
    const grdL = ctx.createRadialGradient(0, H * 0.4, 0, 0, H * 0.4, W * 0.5);
    grdL.addColorStop(0, 'rgba(0,217,255,0.06)');
    grdL.addColorStop(1, 'transparent');
    ctx.fillStyle = grdL;
    ctx.fillRect(0, 0, W, H);

    const grdR = ctx.createRadialGradient(W, H * 0.6, 0, W, H * 0.6, W * 0.5);
    grdR.addColorStop(0, 'rgba(255,215,0,0.05)');
    grdR.addColorStop(1, 'transparent');
    ctx.fillStyle = grdR;
    ctx.fillRect(0, 0, W, H);

    frame++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();