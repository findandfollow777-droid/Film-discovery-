// ============================================
// JOURNEYS - Game Logic
// Orbit Games Suite - Six Degrees Connection
// ============================================

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";
const TMDB_IMG = "https://image.tmdb.org/t/p/";

// Daily puzzles - curated actor pairs with par values
const DAILY_JOURNEYS = [
  // Week 1 - Classic connections
  { start: { id: 31, name: "Tom Hanks" }, end: { id: 4724, name: "Kevin Bacon" }, par: 2 },
  { start: { id: 6193, name: "Leonardo DiCaprio" }, end: { id: 192, name: "Morgan Freeman" }, par: 3 },
  { start: { id: 1245, name: "Scarlett Johansson" }, end: { id: 3223, name: "Robert De Niro" }, par: 3 },
  { start: { id: 287, name: "Brad Pitt" }, end: { id: 2963, name: "Jack Nicholson" }, par: 2 },
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
  { start: { id: 1920, name: "Meg Ryan" }, end: { id: 8691, name: "Zoe Saldana" }, par: 4 },
  { start: { id: 738, name: "Sean Connery" }, end: { id: 380, name: "Robert Downey Jr." }, par: 3 },
  { start: { id: 3084, name: "Marlon Brando" }, end: { id: 500, name: "Tom Cruise" }, par: 3 },
  { start: { id: 1937, name: "Joe Pesci" }, end: { id: 73457, name: "Chris Pratt" }, par: 4 },
  { start: { id: 6952, name: "Shelley Duvall" }, end: { id: 1357546, name: "Timothée Chalamet" }, par: 5 },
  { start: { id: 2157, name: "Tommy Lee Jones" }, end: { id: 224513, name: "Emma Stone" }, par: 4 }
];

// Game state
let gameState = {
  startActor: null,
  endActor: null,
  par: 3,
  chain: [], // Array of {type: 'actor'|'movie', id, name, photo?}
  currentActor: null, // The actor we're currently connecting from
  searchType: 'movie', // 'movie' or 'actor'
  steps: 0,
  completed: false,
  puzzleNumber: 1
};

// Cache for filmographies (to validate connections)
let filmographyCache = {};

// DOM Elements
let startPhoto, startName, endPhoto, endName;
let parValue, stepsValue;
let chainDisplay, chainStartPhoto, chainStartName;
let searchInput, searchResults;
let inputHint, currentActorName;
let undoBtn, resetBtn;
let resultSection;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadDailyPuzzle();
});

function cacheElements() {
  startPhoto = document.getElementById("startPhoto");
  startName = document.getElementById("startName");
  endPhoto = document.getElementById("endPhoto");
  endName = document.getElementById("endName");
  
  parValue = document.getElementById("parValue");
  stepsValue = document.getElementById("stepsValue");
  
  chainDisplay = document.getElementById("chainDisplay");
  chainStartPhoto = document.getElementById("chainStartPhoto");
  chainStartName = document.getElementById("chainStartName");
  
  searchInput = document.getElementById("searchInput");
  searchResults = document.getElementById("searchResults");
  
  inputHint = document.getElementById("inputHint");
  currentActorName = document.getElementById("currentActorName");
  
  undoBtn = document.getElementById("undoBtn");
  resetBtn = document.getElementById("resetBtn");
  
  resultSection = document.getElementById("resultSection");
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
  
  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
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
  
  // Always set puzzle number
  gameState.puzzleNumber = puzzleIndex + 1;
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  
  // Always set the correct puzzle endpoints
  gameState.startActor = puzzle.start;
  gameState.endActor = puzzle.end;
  gameState.par = puzzle.par;
  parValue.textContent = puzzle.par;
  
  // Check for saved state
  const savedState = loadTodayState();
  if (savedState && savedState.chain && savedState.chain.length > 0) {
    // Restore chain progress but use fresh puzzle data
    gameState.chain = savedState.chain;
    gameState.currentActor = savedState.currentActor;
    gameState.steps = savedState.steps || 0;
    gameState.completed = savedState.completed || false;
    gameState.searchType = savedState.searchType || 'movie';
    
    if (gameState.completed) {
      await loadEndpointPhotos();
      showResult();
      return;
    }
  } else {
    // Fresh game
    gameState.currentActor = puzzle.start;
    gameState.chain = [{ type: 'actor', id: puzzle.start.id, name: puzzle.start.name }];
    gameState.steps = 0;
    gameState.completed = false;
  }
  
  await loadEndpointPhotos();
  
  // Pre-load filmography for current actor
  if (gameState.currentActor && gameState.currentActor.id) {
    await loadFilmography(gameState.currentActor.id);
  }
  
  renderChain();
  updateUI();
}

async function loadEndpointPhotos() {
  // Always set names first (even if API fails)
  if (gameState.startActor) {
    startName.textContent = gameState.startActor.name;
    chainStartName.textContent = gameState.startActor.name;
  }
  if (gameState.endActor) {
    endName.textContent = gameState.endActor.name;
  }
  
  // Load start actor photo
  if (gameState.startActor && gameState.startActor.id) {
    try {
      const startRes = await fetch(
        `https://api.themoviedb.org/3/person/${gameState.startActor.id}?api_key=${TMDB_API_KEY}`
      );
      const startData = await startRes.json();
      if (startData.profile_path) {
        const photoUrl = `${TMDB_IMG}w185${startData.profile_path}`;
        startPhoto.src = photoUrl;
        chainStartPhoto.src = photoUrl;
        if (gameState.chain[0]) {
          gameState.chain[0].photo = photoUrl;
        }
      } else {
        // No profile photo - use placeholder
        startPhoto.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='185' height='278' viewBox='0 0 185 278'%3E%3Crect fill='%231a1a2e' width='185' height='278'/%3E%3Ctext x='92' y='139' text-anchor='middle' fill='%2300d9ff' font-size='48'%3E%3F%3C/text%3E%3C/svg%3E";
        chainStartPhoto.src = startPhoto.src;
      }
    } catch (err) {
      console.error("Error loading start actor:", err);
    }
  }
  
  // Load end actor photo
  if (gameState.endActor && gameState.endActor.id) {
    try {
      const endRes = await fetch(
        `https://api.themoviedb.org/3/person/${gameState.endActor.id}?api_key=${TMDB_API_KEY}`
      );
      const endData = await endRes.json();
      if (endData.profile_path) {
        endPhoto.src = `${TMDB_IMG}w185${endData.profile_path}`;
      } else {
        // No profile photo - use placeholder
        endPhoto.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='185' height='278' viewBox='0 0 185 278'%3E%3Crect fill='%231a1a2e' width='185' height='278'/%3E%3Ctext x='92' y='139' text-anchor='middle' fill='%23ffd700' font-size='48'%3E%3F%3C/text%3E%3C/svg%3E";
      }
    } catch (err) {
      console.error("Error loading end actor:", err);
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
    
    // Store movies with decent vote count
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
    setSearchType('movie');
  } else {
    inputHint.innerHTML = `Find an actor from <span id="currentActorName">${lastItem.name}</span>`;
    setSearchType('actor');
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
        return `
          <div class="search-result-item" data-id="${item.id}" data-title="${safeTitle}" data-type="movie">
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
    
    // Add click handlers
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
  
  console.log("Selection made:", { type, id, dataset: item.dataset });
  
  searchInput.value = "";
  searchResults.hidden = true;
  
  if (type === 'movie') {
    await handleMovieSelection(id, item.dataset.title);
  } else {
    await handleActorSelection(id, item.dataset.name, item.dataset.photo);
  }
}

async function handleMovieSelection(movieId, movieTitle) {
  console.log("Handling movie selection:", movieId, movieTitle);
  
  // Verify the current actor is in this movie
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
    
    // Valid selection - add to chain
    console.log("Adding movie to chain:", movieTitle);
    gameState.chain.push({ type: 'movie', id: movieId, name: movieTitle });
    gameState.steps++;
    
    console.log("Chain after adding movie:", gameState.chain);
    
    // Now we need an actor from this movie
    setSearchType('actor');
    renderChain();
    updateUI();
    saveTodayState();
    
  } catch (err) {
    console.error("Error validating movie:", err);
  }
}

async function handleActorSelection(actorId, actorName, actorPhoto) {
  console.log("Handling actor selection:", actorId, actorName);
  
  // Verify the actor is in the last movie
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
    
    // Check if this is the end actor
    if (actorId === gameState.endActor.id) {
      // Victory!
      gameState.chain.push({ type: 'actor', id: actorId, name: actorName, photo: actorPhoto });
      gameState.completed = true;
      saveTodayState();
      saveStats();
      renderChain();
      showResult();
      return;
    }
    
    // Check if actor already in chain (no loops)
    if (gameState.chain.some(item => item.type === 'actor' && item.id === actorId)) {
      showNotification("You've already used this actor", 'error');
      return;
    }
    
    // Valid selection - add to chain
    gameState.chain.push({ type: 'actor', id: actorId, name: actorName, photo: actorPhoto });
    gameState.currentActor = { id: actorId, name: actorName };
    
    // Pre-load this actor's filmography
    await loadFilmography(actorId);
    
    setSearchType('movie');
    renderChain();
    updateUI();
    saveTodayState();
    
  } catch (err) {
    console.error("Error validating actor:", err);
  }
}

// ============================================
// UI UPDATES
// ============================================

function renderChain() {
  console.log("Rendering chain:", gameState.chain);
  
  let html = `
    <div class="chain-node start-node">
      <img class="chain-photo" src="${gameState.chain[0].photo || ''}" alt="">
      <span class="chain-name">${gameState.chain[0].name}</span>
    </div>
  `;
  
  for (let i = 1; i < gameState.chain.length; i++) {
    const item = gameState.chain[i];
    
    html += `<span class="chain-arrow">&#8594;</span>`;
    
    if (item.type === 'movie') {
      html += `
        <div class="chain-connector">
          <span class="connector-icon">&#x1F3AC;</span>
          <span class="connector-title">${item.name}</span>
        </div>
      `;
    } else {
      const isEnd = item.id === gameState.endActor.id;
      html += `
        <div class="chain-node ${isEnd ? 'end-node' : ''}">
          <img class="chain-photo" src="${item.photo || ''}" alt="">
          <span class="chain-name">${item.name}</span>
        </div>
      `;
    }
  }
  
  chainDisplay.innerHTML = html;
}

function updateUI() {
  // Count steps (movies in chain)
  const movieCount = gameState.chain.filter(item => item.type === 'movie').length;
  stepsValue.textContent = movieCount;
  gameState.steps = movieCount;
  
  // Update undo button
  undoBtn.disabled = gameState.chain.length <= 1;
  
  // Update input hint
  updateInputHint();
}

function showNotification(message, type = 'info') {
  // Simple notification - could be enhanced with a toast system
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
  
  // Remove last item
  gameState.chain.pop();
  
  // Update current actor if needed
  const lastItem = gameState.chain[gameState.chain.length - 1];
  if (lastItem.type === 'actor') {
    gameState.currentActor = { id: lastItem.id, name: lastItem.name };
  }
  
  renderChain();
  updateUI();
  saveTodayState();
}

function resetGame() {
  if (gameState.completed) return;
  
  // Reset to just start actor
  gameState.chain = [gameState.chain[0]];
  gameState.currentActor = gameState.startActor;
  gameState.steps = 0;
  
  renderChain();
  updateUI();
  saveTodayState();
}

// ============================================
// RESULT
// ============================================

function showResult() {
  resultSection.hidden = false;
  
  const steps = gameState.steps;
  const par = gameState.par;
  
  document.getElementById("yourSteps").textContent = steps;
  document.getElementById("parSteps").textContent = par;
  
  const verdictEl = document.getElementById("scoreVerdict");
  const iconEl = document.getElementById("resultIcon");
  
  if (steps < par) {
    verdictEl.textContent = `${par - steps} Under Par! 🦅`;
    verdictEl.className = "score-verdict under-par";
    iconEl.textContent = "🏆";
  } else if (steps === par) {
    verdictEl.textContent = "On Par! 🎯";
    verdictEl.className = "score-verdict on-par";
    iconEl.textContent = "🎉";
  } else {
    verdictEl.textContent = `${steps - par} Over Par`;
    verdictEl.className = "score-verdict over-par";
    iconEl.textContent = "✓";
  }
  
  // Render final chain
  const finalChain = document.getElementById("finalChain");
  finalChain.innerHTML = gameState.chain.map((item, i) => {
    const arrow = i > 0 ? '<span class="final-chain-arrow">→</span>' : '';
    return `${arrow}<span class="final-chain-item">${item.name}</span>`;
  }).join("");
  
  startNextPuzzleCountdown();
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("journeys_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    solved: 0,
    totalSteps: 0,
    underPar: 0
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  stats.solved++;
  stats.totalSteps += gameState.steps;
  if (gameState.steps < gameState.par) {
    stats.underPar++;
  }
  localStorage.setItem("journeys_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statSolved").textContent = stats.solved;
  document.getElementById("statAvgSteps").textContent = stats.solved > 0 
    ? (stats.totalSteps / stats.solved).toFixed(1) 
    : 0;
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
  localStorage.setItem(getTodayKey(), JSON.stringify(gameState));
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
  
  const chainEmoji = gameState.chain.map(item => 
    item.type === 'actor' ? '🎭' : '🎬'
  ).join('→');
  
  const text = `🛤️ Journeys #${gameState.puzzleNumber}

${gameState.startActor.name} → ${gameState.endActor.name}

${chainEmoji}
${steps} steps (Par ${par})
${verdict}

Play at orbit-game.com/arcade`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.innerHTML = "<span>✓</span> Copied!";
    setTimeout(() => {
      btn.innerHTML = "<span>📋</span> Share Result";
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