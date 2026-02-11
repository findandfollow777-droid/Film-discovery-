// ============================================
// TRIPLE COLLISION - Game Logic
// Orbit Games Suite - 3-Entity Venn Game
// ============================================

// Game configuration
const GAME_DURATION = 240; // 4 minutes in seconds
const POINTS_SOLO = 1;
const POINTS_DOUBLE = 3;
const POINTS_TRIPLE = 10;

// Daily puzzles - curated actor × actor × director triples
const DAILY_TRIPLES = [
  // Week 1 - Classic combinations
  { 
    a: { id: 287, name: "Brad Pitt", type: "Actor" }, 
    b: { id: 1461, name: "George Clooney", type: "Actor" },
    c: { id: 1884, name: "Steven Soderbergh", type: "Director" }
  },
  { 
    a: { id: 6193, name: "Leonardo DiCaprio", type: "Actor" }, 
    b: { id: 3223, name: "Robert De Niro", type: "Actor" },
    c: { id: 1032, name: "Martin Scorsese", type: "Director" }
  },
  { 
    a: { id: 85, name: "Johnny Depp", type: "Actor" }, 
    b: { id: 34847, name: "Helena Bonham Carter", type: "Actor" },
    c: { id: 510, name: "Tim Burton", type: "Director" }
  },
  { 
    a: { id: 17419, name: "Bill Murray", type: "Actor" }, 
    b: { id: 17052, name: "Adrien Brody", type: "Actor" },
    c: { id: 5655, name: "Wes Anderson", type: "Director" }
  },
  { 
    a: { id: 31, name: "Tom Hanks", type: "Actor" }, 
    b: { id: 6193, name: "Leonardo DiCaprio", type: "Actor" },
    c: { id: 24, name: "Steven Spielberg", type: "Director" }
  },
  { 
    a: { id: 1892, name: "Matt Damon", type: "Actor" }, 
    b: { id: 880, name: "Ben Affleck", type: "Actor" },
    c: { id: 525, name: "Christopher Nolan", type: "Director" }
  },
  { 
    a: { id: 500, name: "Tom Cruise", type: "Actor" }, 
    b: { id: 2524, name: "Nicole Kidman", type: "Actor" },
    c: { id: 240, name: "Stanley Kubrick", type: "Director" }
  },
  
  // Week 2 - Modern pairings
  { 
    a: { id: 16828, name: "Chris Evans", type: "Actor" }, 
    b: { id: 1245, name: "Scarlett Johansson", type: "Actor" },
    c: { id: 19272, name: "Joe Russo", type: "Director" }
  },
  { 
    a: { id: 73457, name: "Chris Pratt", type: "Actor" }, 
    b: { id: 8691, name: "Zoe Saldana", type: "Actor" },
    c: { id: 88675, name: "James Gunn", type: "Director" }
  },
  { 
    a: { id: 1136406, name: "Tom Holland", type: "Actor" }, 
    b: { id: 505710, name: "Zendaya", type: "Actor" },
    c: { id: 77965, name: "Jon Watts", type: "Director" }
  },
  { 
    a: { id: 17881, name: "Ryan Gosling", type: "Actor" }, 
    b: { id: 224513, name: "Emma Stone", type: "Actor" },
    c: { id: 136495, name: "Damien Chazelle", type: "Director" }
  },
  { 
    a: { id: 3894, name: "Christian Bale", type: "Actor" }, 
    b: { id: 17288, name: "Amy Adams", type: "Actor" },
    c: { id: 30614, name: "Adam McKay", type: "Director" }
  },
  { 
    a: { id: 1357546, name: "Timothée Chalamet", type: "Actor" }, 
    b: { id: 1267329, name: "Florence Pugh", type: "Actor" },
    c: { id: 138, name: "Greta Gerwig", type: "Director" }
  },
  { 
    a: { id: 380, name: "Robert Downey Jr.", type: "Actor" }, 
    b: { id: 74568, name: "Chris Hemsworth", type: "Actor" },
    c: { id: 19271, name: "Anthony Russo", type: "Director" }
  },
  
  // Week 3 - Classic Hollywood
  { 
    a: { id: 3084, name: "Marlon Brando", type: "Actor" }, 
    b: { id: 1158, name: "Al Pacino", type: "Actor" },
    c: { id: 1776, name: "Francis Ford Coppola", type: "Director" }
  },
  { 
    a: { id: 514, name: "Jack Nicholson", type: "Actor" },
    b: { id: 6952, name: "Shelley Duvall", type: "Actor" },
    c: { id: 240, name: "Stanley Kubrick", type: "Director" }
  },
  { 
    a: { id: 3223, name: "Robert De Niro", type: "Actor" }, 
    b: { id: 1937, name: "Joe Pesci", type: "Actor" },
    c: { id: 1032, name: "Martin Scorsese", type: "Director" }
  },
  { 
    a: { id: 192, name: "Morgan Freeman", type: "Actor" },
    b: { id: 287, name: "Brad Pitt", type: "Actor" },
    c: { id: 7467, name: "David Fincher", type: "Director" }
  },
  { 
    a: { id: 1979, name: "Kevin Spacey", type: "Actor" }, 
    b: { id: 516, name: "Gwyneth Paltrow", type: "Actor" },
    c: { id: 7467, name: "David Fincher", type: "Director" }
  },
  { 
    a: { id: 738, name: "Sean Connery", type: "Actor" },
    b: { id: 3, name: "Harrison Ford", type: "Actor" },
    c: { id: 24, name: "Steven Spielberg", type: "Director" }
  },
  { 
    a: { id: 2, name: "Mark Hamill", type: "Actor" },
    b: { id: 3, name: "Harrison Ford", type: "Actor" },
    c: { id: 1, name: "George Lucas", type: "Director" }
  }
];

// Game state
let gameState = {
  entityA: null,
  entityB: null,
  entityC: null,
  moviesA: new Set(),
  moviesB: new Set(),
  moviesC: new Set(),
  // Found movies by zone
  foundSoloA: [],
  foundSoloB: [],
  foundSoloC: [],
  foundAB: [],
  foundAC: [],
  foundBC: [],
  foundABC: [],
  guessedMovieIds: new Set(),
  score: 0,
  timeRemaining: GAME_DURATION,
  isPlaying: false,
  gameOver: false,
  puzzleNumber: 1,
  currentFilter: "all"
};

// Timer
let timerInterval = null;

// DOM Elements
let entityAPhoto, entityAName, entityAType;
let entityBPhoto, entityBName, entityBType;
let entityCPhoto, entityCName, entityCType;
let zoneACount, zoneBCount, zoneCCount;
let zoneABCount, zoneACCount, zoneBCCount, zoneABCCount;
let timerValue, scoreValue, startBtn;
let guessSection, guessInput, searchResults;
let foundList, totalFound, soloCount, doubleCount, tripleCount;
let resultSection, finalScore;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadDailyPuzzle();
});

function cacheElements() {
  entityAPhoto = document.getElementById("entityAPhoto");
  entityAName = document.getElementById("entityAName");
  entityAType = document.getElementById("entityAType");
  entityBPhoto = document.getElementById("entityBPhoto");
  entityBName = document.getElementById("entityBName");
  entityBType = document.getElementById("entityBType");
  entityCPhoto = document.getElementById("entityCPhoto");
  entityCName = document.getElementById("entityCName");
  entityCType = document.getElementById("entityCType");
  
  zoneACount = document.getElementById("zoneACount");
  zoneBCount = document.getElementById("zoneBCount");
  zoneCCount = document.getElementById("zoneCCount");
  zoneABCount = document.getElementById("zoneABCount");
  zoneACCount = document.getElementById("zoneACCount");
  zoneBCCount = document.getElementById("zoneBCCount");
  zoneABCCount = document.getElementById("zoneABCCount");
  
  timerValue = document.getElementById("timerValue");
  scoreValue = document.getElementById("scoreValue");
  startBtn = document.getElementById("startBtn");
  
  guessSection = document.getElementById("guessSection");
  guessInput = document.getElementById("guessInput");
  searchResults = document.getElementById("searchResults");
  
  foundList = document.getElementById("foundList");
  totalFound = document.getElementById("totalFound");
  soloCount = document.getElementById("soloCount");
  doubleCount = document.getElementById("doubleCount");
  tripleCount = document.getElementById("tripleCount");
  
  resultSection = document.getElementById("resultSection");
  finalScore = document.getElementById("finalScore");
}

function setupEventListeners() {
  // Start button
  startBtn.addEventListener("click", startGame);
  
  // Guess input
  guessInput.addEventListener("input", debounce(handleSearch, 300));
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") searchResults.hidden = true;
  });
  
  // Click outside to close search
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".guess-section")) {
      searchResults.hidden = true;
    }
  });
  
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
  
  // Share button
  document.getElementById("shareBtn").addEventListener("click", shareResult);
  
  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
  
  // Found tabs
  document.querySelectorAll(".found-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".found-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      gameState.currentFilter = tab.dataset.tab;
      renderFoundList();
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
  return dayNumber % DAILY_TRIPLES.length;
}

async function loadDailyPuzzle() {
  const puzzleIndex = getDailyPuzzleIndex();
  const puzzle = DAILY_TRIPLES[puzzleIndex];
  
  gameState.puzzleNumber = puzzleIndex + 1;
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  
  gameState.entityA = puzzle.a;
  gameState.entityB = puzzle.b;
  gameState.entityC = puzzle.c;
  
  // Fetch photos and filmographies
  await Promise.all([
    loadEntityData(puzzle.a, "A"),
    loadEntityData(puzzle.b, "B"),
    loadEntityData(puzzle.c, "C")
  ]);
  
  console.log(`Loaded puzzle: ${puzzle.a.name} × ${puzzle.b.name} × ${puzzle.c.name}`);
  console.log(`Entity A movies: ${gameState.moviesA.size}`);
  console.log(`Entity B movies: ${gameState.moviesB.size}`);
  console.log(`Entity C movies: ${gameState.moviesC.size}`);
}

async function loadEntityData(entity, side) {
  const photoEl = side === "A" ? entityAPhoto : side === "B" ? entityBPhoto : entityCPhoto;
  const nameEl = side === "A" ? entityAName : side === "B" ? entityBName : entityCName;
  const typeEl = side === "A" ? entityAType : side === "B" ? entityBType : entityCType;
  const movieSet = side === "A" ? gameState.moviesA : side === "B" ? gameState.moviesB : gameState.moviesC;
  
  nameEl.textContent = entity.name;
  typeEl.textContent = entity.type;
  
  try {
    // Fetch person details for photo
    const personRes = await fetch(
      `https://api.themoviedb.org/3/person/${entity.id}?api_key=${TMDB_API_KEY}`
    );
    const person = await personRes.json();
    
    if (person.profile_path) {
      photoEl.src = `${TMDB_IMG}w185${person.profile_path}`;
    }
    
    // Fetch filmography
    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/person/${entity.id}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await creditsRes.json();
    
    // Determine which credits to use based on type
    let relevantCredits = [];
    if (entity.type === "Director") {
      relevantCredits = (credits.crew || []).filter(c => c.job === "Director");
    } else {
      relevantCredits = credits.cast || [];
    }
    
    // Filter to feature films only
    relevantCredits
      .filter(m => !m.genre_ids?.includes(99)) // No documentaries
      .forEach(m => movieSet.add(m.id));
      
  } catch (err) {
    console.error(`Error loading entity ${entity.name}:`, err);
  }
}

// ============================================
// GAME FLOW
// ============================================

function startGame() {
  gameState.isPlaying = true;
  gameState.timeRemaining = GAME_DURATION;
  
  startBtn.hidden = true;
  guessSection.hidden = false;
  guessInput.focus();
  
  timerInterval = setInterval(tick, 1000);
}

function tick() {
  gameState.timeRemaining--;
  updateTimerDisplay();
  
  if (gameState.timeRemaining <= 0) {
    endGame();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(gameState.timeRemaining / 60);
  const seconds = gameState.timeRemaining % 60;
  timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  
  // Warning states
  timerValue.classList.remove("warning", "danger");
  if (gameState.timeRemaining <= 30) {
    timerValue.classList.add("danger");
  } else if (gameState.timeRemaining <= 60) {
    timerValue.classList.add("warning");
  }
}

function endGame() {
  gameState.isPlaying = false;
  gameState.gameOver = true;
  clearInterval(timerInterval);
  
  guessSection.hidden = true;
  resultSection.hidden = false;
  
  // Calculate breakdown
  const soloTotal = gameState.foundSoloA.length + gameState.foundSoloB.length + gameState.foundSoloC.length;
  const doubleTotal = gameState.foundAB.length + gameState.foundAC.length + gameState.foundBC.length;
  const tripleTotal = gameState.foundABC.length;
  
  // Update result display
  finalScore.textContent = gameState.score;
  document.getElementById("breakdownSolo").textContent = `${soloTotal} × 1 = ${soloTotal}`;
  document.getElementById("breakdownDouble").textContent = `${doubleTotal} × 3 = ${doubleTotal * 3}`;
  document.getElementById("breakdownTriple").textContent = `${tripleTotal} × 10 = ${tripleTotal * 10}`;
  
  // Save stats
  saveStats();
  saveTodayState();
  
  // Start countdown
  startNextPuzzleCountdown();

  // Enable post-game clickable links
  enablePostGameLinks();
}

function enablePostGameLinks() {
  document.querySelector('.game-main').classList.add('game-over');

  // Make all three entity avatars clickable → timeline
  ['entityA', 'entityB', 'entityC'].forEach(key => {
    const entity = gameState[key];
    const elId = key === 'entityA' ? 'entityA' : key === 'entityB' ? 'entityB' : 'entityC';
    const el = document.getElementById(elId);
    if (el && entity) {
      const hint = document.createElement('div');
      hint.className = 'explore-hint';
      hint.textContent = '→ TIMELINE';
      el.appendChild(hint);
      el.addEventListener('click', () => {
        window.location.href = `timeline.html?id=${entity.id}&name=${encodeURIComponent(entity.name)}`;
      });
    }
  });

  // Make found movie items clickable → results page
  const allFound = [
    ...gameState.foundSoloA,
    ...gameState.foundSoloB,
    ...gameState.foundSoloC,
    ...gameState.foundAB,
    ...gameState.foundAC,
    ...gameState.foundBC,
    ...gameState.foundABC
  ];

  document.querySelectorAll('.found-item').forEach(item => {
    const title = item.textContent.trim();
    const movie = allFound.find(m => m.title === title);
    if (movie) {
      item.classList.add('clickable-movie');
      item.addEventListener('click', () => {
        localStorage.setItem("singleMovie", JSON.stringify({ id: movie.id, title: movie.title }));
        localStorage.setItem("resultsMode", "single");
        window.location.href = 'results.html';
      });
    }
  });
}

// ============================================
// SEARCH & GUESSING
// ============================================

async function handleSearch() {
  const query = guessInput.value.trim();
  
  if (query.length < 2) {
    searchResults.hidden = true;
    return;
  }
  
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    
    const results = (data.results || [])
      .filter(m => !gameState.guessedMovieIds.has(m.id))
      .slice(0, 6);
    
    if (results.length === 0) {
      searchResults.hidden = true;
      return;
    }
    
    searchResults.innerHTML = results.map(movie => {
      const poster = movie.poster_path 
        ? `${TMDB_IMG}w92${movie.poster_path}` 
        : "";
      const year = movie.release_date?.split("-")[0] || "";
      
      return `
        <div class="search-result-item" data-id="${movie.id}" data-title="${movie.title}">
          <img class="search-result-poster" src="${poster}" alt="">
          <div>
            <div class="search-result-title">${movie.title}</div>
            <div class="search-result-year">${year}</div>
          </div>
        </div>
      `;
    }).join("");
    
    searchResults.hidden = false;
    
    // Add click handlers
    searchResults.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        makeGuess(parseInt(item.dataset.id), item.dataset.title);
      });
    });
    
  } catch (err) {
    console.error("Search error:", err);
  }
}

function makeGuess(movieId, movieTitle) {
  if (!gameState.isPlaying || gameState.guessedMovieIds.has(movieId)) return;
  
  gameState.guessedMovieIds.add(movieId);
  guessInput.value = "";
  searchResults.hidden = true;
  
  const inA = gameState.moviesA.has(movieId);
  const inB = gameState.moviesB.has(movieId);
  const inC = gameState.moviesC.has(movieId);
  
  // Determine zone and score
  let zone = null;
  let points = 0;
  let zoneType = "invalid";
  
  if (inA && inB && inC) {
    // TRIPLE COLLISION!
    zone = "ABC";
    points = POINTS_TRIPLE;
    zoneType = "triple";
    gameState.foundABC.push({ id: movieId, title: movieTitle });
    triggerAnimation("triple");
  } else if (inA && inB) {
    zone = "AB";
    points = POINTS_DOUBLE;
    zoneType = "double";
    gameState.foundAB.push({ id: movieId, title: movieTitle });
    triggerAnimation("double");
  } else if (inA && inC) {
    zone = "AC";
    points = POINTS_DOUBLE;
    zoneType = "double";
    gameState.foundAC.push({ id: movieId, title: movieTitle });
    triggerAnimation("double");
  } else if (inB && inC) {
    zone = "BC";
    points = POINTS_DOUBLE;
    zoneType = "double";
    gameState.foundBC.push({ id: movieId, title: movieTitle });
    triggerAnimation("double");
  } else if (inA) {
    zone = "A";
    points = POINTS_SOLO;
    zoneType = "solo";
    gameState.foundSoloA.push({ id: movieId, title: movieTitle });
  } else if (inB) {
    zone = "B";
    points = POINTS_SOLO;
    zoneType = "solo";
    gameState.foundSoloB.push({ id: movieId, title: movieTitle });
  } else if (inC) {
    zone = "C";
    points = POINTS_SOLO;
    zoneType = "solo";
    gameState.foundSoloC.push({ id: movieId, title: movieTitle });
  } else {
    // Not in any filmography
    return;
  }
  
  gameState.score += points;
  updateUI();
  addFoundItem(movieTitle, zoneType, zone);
  guessInput.focus();
}

function updateUI() {
  // Update zone counts
  zoneACount.textContent = gameState.foundSoloA.length;
  zoneBCount.textContent = gameState.foundSoloB.length;
  zoneCCount.textContent = gameState.foundSoloC.length;
  zoneABCount.textContent = gameState.foundAB.length;
  zoneACCount.textContent = gameState.foundAC.length;
  zoneBCCount.textContent = gameState.foundBC.length;
  zoneABCCount.textContent = gameState.foundABC.length;
  
  // Update score
  scoreValue.textContent = gameState.score;
  
  // Update tab counts
  const soloTotal = gameState.foundSoloA.length + gameState.foundSoloB.length + gameState.foundSoloC.length;
  const doubleTotal = gameState.foundAB.length + gameState.foundAC.length + gameState.foundBC.length;
  const tripleTotal = gameState.foundABC.length;
  const total = soloTotal + doubleTotal + tripleTotal;
  
  totalFound.textContent = total;
  soloCount.textContent = soloTotal;
  doubleCount.textContent = doubleTotal;
  tripleCount.textContent = tripleTotal;
}

function addFoundItem(title, type, zone) {
  // Add to visual list based on current filter
  renderFoundList();
}

function renderFoundList() {
  let items = [];
  const filter = gameState.currentFilter;
  
  if (filter === "all" || filter === "solo") {
    items = items.concat(
      gameState.foundSoloA.map(m => ({ ...m, type: "solo", zone: "A" })),
      gameState.foundSoloB.map(m => ({ ...m, type: "solo", zone: "B" })),
      gameState.foundSoloC.map(m => ({ ...m, type: "solo", zone: "C" }))
    );
  }
  if (filter === "all" || filter === "double") {
    items = items.concat(
      gameState.foundAB.map(m => ({ ...m, type: "double", zone: "AB" })),
      gameState.foundAC.map(m => ({ ...m, type: "double", zone: "AC" })),
      gameState.foundBC.map(m => ({ ...m, type: "double", zone: "BC" }))
    );
  }
  if (filter === "all" || filter === "triple") {
    items = items.concat(
      gameState.foundABC.map(m => ({ ...m, type: "triple", zone: "ABC" }))
    );
  }
  
  if (filter !== "all") {
    items = items.filter(i => i.type === filter);
  }
  
  foundList.innerHTML = items.map(item => 
    `<div class="found-item ${item.type}">${item.title}</div>`
  ).join("");
}

function triggerAnimation(type) {
  const burst = type === "triple" 
    ? document.getElementById("tripleBurst") 
    : document.getElementById("doubleBurst");
  
  burst.hidden = false;
  setTimeout(() => {
    burst.hidden = true;
  }, 700);
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("triple_collision_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    totalScore: 0,
    bestScore: 0,
    totalTriples: 0
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  stats.totalScore += gameState.score;
  stats.bestScore = Math.max(stats.bestScore, gameState.score);
  stats.totalTriples += gameState.foundABC.length;
  localStorage.setItem("triple_collision_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statAvgScore").textContent = stats.played > 0 
    ? Math.round(stats.totalScore / stats.played) 
    : 0;
  document.getElementById("statBestScore").textContent = stats.bestScore;
  document.getElementById("statTriples").textContent = stats.totalTriples;
}

function saveTodayState() {
  const today = new Date();
  const key = `triple_collision_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  localStorage.setItem(key, JSON.stringify({
    score: gameState.score,
    foundABC: gameState.foundABC.length,
    completed: true
  }));
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  const soloTotal = gameState.foundSoloA.length + gameState.foundSoloB.length + gameState.foundSoloC.length;
  const doubleTotal = gameState.foundAB.length + gameState.foundAC.length + gameState.foundBC.length;
  const tripleTotal = gameState.foundABC.length;
  
  const text = `🔺 Triple Collision #${gameState.puzzleNumber}

${gameState.entityA.name} × ${gameState.entityB.name} × ${gameState.entityC.name}

Score: ${gameState.score} pts
⚪ Solo: ${soloTotal}
🟠 Double: ${doubleTotal}
🔺 Triple: ${tripleTotal}

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

// ============================================
// RESULT CLOSE / VIEW RESULTS
// ============================================

document.getElementById('resultCloseBtn').addEventListener('click', () => {
  document.getElementById('resultSection').hidden = true;
  if (!document.getElementById('viewResultsBtn')) {
    const btn = document.createElement('button');
    btn.id = 'viewResultsBtn';
    btn.className = 'view-results-btn';
    btn.textContent = 'View Results';
    btn.addEventListener('click', () => {
      document.getElementById('resultSection').hidden = false;
      btn.remove();
    });
    const gameStatus = document.querySelector('.game-status');
    gameStatus.appendChild(btn);
  }
});

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}