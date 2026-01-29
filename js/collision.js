// ============================================
// COLLISION COURSE - Game Logic
// Orbit Games Suite
// ============================================

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";
const TMDB_IMG = "https://image.tmdb.org/t/p/";

// Game configuration
const GAME_DURATION = 180; // 3 minutes in seconds
const POINTS_SOLO = 1;
const POINTS_COLLISION = 5;

// Daily puzzles - curated actor pairs
const DAILY_PAIRS = [
  // Week 1 - Classic Duos
  { a: { id: 287, name: "Brad Pitt", type: "Actor" }, b: { id: 1461, name: "George Clooney", type: "Actor" } },
  { a: { id: 6193, name: "Leonardo DiCaprio", type: "Actor" }, b: { id: 3223, name: "Robert De Niro", type: "Actor" } },
  { a: { id: 31, name: "Tom Hanks", type: "Actor" }, b: { id: 1920, name: "Meg Ryan", type: "Actor" } },
  { a: { id: 1158, name: "Al Pacino", type: "Actor" }, b: { id: 3223, name: "Robert De Niro", type: "Actor" } },
  { a: { id: 2888, name: "Will Smith", type: "Actor" }, b: { id: 2157, name: "Tommy Lee Jones", type: "Actor" } },
  { a: { id: 500, name: "Tom Cruise", type: "Actor" }, b: { id: 192, name: "Morgan Freeman", type: "Actor" } },
  { a: { id: 1892, name: "Matt Damon", type: "Actor" }, b: { id: 1979, name: "Ben Affleck", type: "Actor" } },
  
  // Week 2 - Actor + Director pairs
  { a: { id: 6193, name: "Leonardo DiCaprio", type: "Actor" }, b: { id: 1032, name: "Martin Scorsese", type: "Director" } },
  { a: { id: 17419, name: "Bill Murray", type: "Actor" }, b: { id: 5655, name: "Wes Anderson", type: "Director" } },
  { a: { id: 880, name: "Ben Stiller", type: "Actor" }, b: { id: 17051, name: "Owen Wilson", type: "Actor" } },
  { a: { id: 3223, name: "Robert De Niro", type: "Actor" }, b: { id: 1032, name: "Martin Scorsese", type: "Director" } },
  { a: { id: 85, name: "Johnny Depp", type: "Actor" }, b: { id: 510, name: "Tim Burton", type: "Director" } },
  { a: { id: 1245, name: "Scarlett Johansson", type: "Actor" }, b: { id: 5655, name: "Wes Anderson", type: "Director" } },
  { a: { id: 17052, name: "Adrien Brody", type: "Actor" }, b: { id: 5655, name: "Wes Anderson", type: "Director" } },
  
  // Week 3 - Modern pairs
  { a: { id: 1136406, name: "Tom Holland", type: "Actor" }, b: { id: 505710, name: "Zendaya", type: "Actor" } },
  { a: { id: 73457, name: "Chris Pratt", type: "Actor" }, b: { id: 103, name: "Chris Hemsworth", type: "Actor" } },
  { a: { id: 74568, name: "Chris Evans", type: "Actor" }, b: { id: 1245, name: "Scarlett Johansson", type: "Actor" } },
  { a: { id: 17419, name: "Bill Murray", type: "Actor" }, b: { id: 380, name: "Robert Downey Jr.", type: "Actor" } },
  { a: { id: 2963, name: "Jack Nicholson", type: "Actor" }, b: { id: 192, name: "Morgan Freeman", type: "Actor" } },
  { a: { id: 3, name: "Harrison Ford", type: "Actor" }, b: { id: 2, name: "Mark Hamill", type: "Actor" } },
  { a: { id: 31, name: "Tom Hanks", type: "Actor" }, b: { id: 192, name: "Morgan Freeman", type: "Actor" } }
];

// Game state
let gameState = {
  entityA: null,
  entityB: null,
  entityAMovies: new Set(), // Movie IDs for entity A
  entityBMovies: new Set(), // Movie IDs for entity B
  collisionMovies: new Set(), // Movie IDs where both appear
  foundA: [],
  foundB: [],
  foundCollisions: [],
  guessedMovieIds: new Set(),
  score: 0,
  timeRemaining: GAME_DURATION,
  isPlaying: false,
  gameOver: false,
  puzzleNumber: 1
};

// Timer
let timerInterval = null;

// DOM Elements
let entityAPhoto, entityAName, entityAType;
let entityBPhoto, entityBName, entityBType;
let zoneACount, zoneBCount, zoneCollisionCount;
let timerValue, scoreValue, startBtn;
let guessSection, guessInput, searchResults;
let foundListA, foundListB, foundListCollision;
let columnATitle, columnBTitle;
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
  
  zoneACount = document.getElementById("zoneACount");
  zoneBCount = document.getElementById("zoneBCount");
  zoneCollisionCount = document.getElementById("zoneCollisionCount");
  
  timerValue = document.getElementById("timerValue");
  scoreValue = document.getElementById("scoreValue");
  startBtn = document.getElementById("startBtn");
  
  guessSection = document.getElementById("guessSection");
  guessInput = document.getElementById("guessInput");
  searchResults = document.getElementById("searchResults");
  
  foundListA = document.getElementById("foundListA");
  foundListB = document.getElementById("foundListB");
  foundListCollision = document.getElementById("foundListCollision");
  columnATitle = document.getElementById("columnATitle");
  columnBTitle = document.getElementById("columnBTitle");
  
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
}

// ============================================
// PUZZLE LOADING
// ============================================

function getDailyPuzzleIndex() {
  const launchDate = new Date("2025-01-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNumber = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24));
  return dayNumber % DAILY_PAIRS.length;
}

async function loadDailyPuzzle() {
  const puzzleIndex = getDailyPuzzleIndex();
  const puzzle = DAILY_PAIRS[puzzleIndex];
  
  gameState.puzzleNumber = puzzleIndex + 1;
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  
  gameState.entityA = puzzle.a;
  gameState.entityB = puzzle.b;
  
  // Update column titles
  columnATitle.textContent = `${puzzle.a.name} Films`;
  columnBTitle.textContent = `${puzzle.b.name} Films`;
  
  // Fetch photos and filmographies
  await Promise.all([
    loadEntityData(puzzle.a, "A"),
    loadEntityData(puzzle.b, "B")
  ]);
  
  // Find collisions (movies with both)
  gameState.entityAMovies.forEach(movieId => {
    if (gameState.entityBMovies.has(movieId)) {
      gameState.collisionMovies.add(movieId);
    }
  });
  
  console.log(`Loaded puzzle: ${puzzle.a.name} Ã— ${puzzle.b.name}`);
  console.log(`Entity A movies: ${gameState.entityAMovies.size}`);
  console.log(`Entity B movies: ${gameState.entityBMovies.size}`);
  console.log(`Collisions: ${gameState.collisionMovies.size}`);
}

async function loadEntityData(entity, side) {
  const photoEl = side === "A" ? entityAPhoto : entityBPhoto;
  const nameEl = side === "A" ? entityAName : entityBName;
  const typeEl = side === "A" ? entityAType : entityBType;
  const movieSet = side === "A" ? gameState.entityAMovies : gameState.entityBMovies;
  
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
    
    // Get appropriate movies based on entity type
    let movies = [];
    
    if (entity.type === "Director") {
      // For directors, only include films they directed
      movies = (credits.crew || []).filter(m => m.job === "Director");
    } else {
      // For actors, use cast credits
      movies = credits.cast || [];
    }
    
    // Filter to valid movies (lower threshold to catch more films)
    movies.forEach(movie => {
      if (movie.id && movie.vote_count > 5) {
        movieSet.add(movie.id);
      }
    });
    
    console.log(`${entity.name} (${entity.type}): ${movieSet.size} movies loaded`);
    
  } catch (err) {
    console.error(`Error loading ${entity.name}:`, err);
  }
}

// ============================================
// GAME FLOW
// ============================================

function startGame() {
  if (gameState.isPlaying) return;
  
  gameState.isPlaying = true;
  gameState.timeRemaining = GAME_DURATION;
  
  startBtn.disabled = true;
  startBtn.textContent = "In Progress...";
  
  guessSection.hidden = false;
  guessInput.focus();
  
  // Start timer
  timerInterval = setInterval(updateTimer, 1000);
  updateTimerDisplay();
}

function updateTimer() {
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
  
  // Warning colors
  if (gameState.timeRemaining <= 30) {
    timerValue.classList.add("danger");
    timerValue.classList.remove("warning");
  } else if (gameState.timeRemaining <= 60) {
    timerValue.classList.add("warning");
    timerValue.classList.remove("danger");
  } else {
    timerValue.classList.remove("warning", "danger");
  }
}

function endGame() {
  gameState.isPlaying = false;
  gameState.gameOver = true;
  
  clearInterval(timerInterval);
  
  guessSection.hidden = true;
  resultSection.hidden = false;
  
  // Update result display
  finalScore.textContent = gameState.score;
  document.getElementById("breakdownALabel").textContent = `${gameState.entityA.name} Solo`;
  document.getElementById("breakdownBLabel").textContent = `${gameState.entityB.name} Solo`;
  document.getElementById("breakdownAValue").textContent = `${gameState.foundA.length} Ã— 1 = ${gameState.foundA.length}`;
  document.getElementById("breakdownBValue").textContent = `${gameState.foundB.length} Ã— 1 = ${gameState.foundB.length}`;
  document.getElementById("breakdownCollisionValue").textContent = `${gameState.foundCollisions.length} Ã— 5 = ${gameState.foundCollisions.length * 5}`;
  
  // Update stats
  saveStats();
  
  // Start countdown to next puzzle
  startNextPuzzleCountdown();
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
  
  const inA = gameState.entityAMovies.has(movieId);
  const inB = gameState.entityBMovies.has(movieId);
  
  if (inA && inB) {
    // COLLISION!
    gameState.foundCollisions.push({ id: movieId, title: movieTitle });
    gameState.score += POINTS_COLLISION;
    addFoundItem(foundListCollision, movieTitle, true);
    zoneCollisionCount.textContent = gameState.foundCollisions.length;
    triggerCollisionAnimation();
  } else if (inA) {
    // Solo A
    gameState.foundA.push({ id: movieId, title: movieTitle });
    gameState.score += POINTS_SOLO;
    addFoundItem(foundListA, movieTitle, false);
    zoneACount.textContent = gameState.foundA.length;
  } else if (inB) {
    // Solo B
    gameState.foundB.push({ id: movieId, title: movieTitle });
    gameState.score += POINTS_SOLO;
    addFoundItem(foundListB, movieTitle, false);
    zoneBCount.textContent = gameState.foundB.length;
  } else {
    // Invalid - not in either filmography
    // Could show feedback here
    return;
  }
  
  scoreValue.textContent = gameState.score;
  guessInput.focus();
}

function addFoundItem(container, title, isCollision) {
  const item = document.createElement("div");
  item.className = `found-item${isCollision ? " collision" : ""}`;
  item.textContent = title;
  container.insertBefore(item, container.firstChild);
}

function triggerCollisionAnimation() {
  const burst = document.getElementById("collisionBurst");
  burst.hidden = false;
  
  setTimeout(() => {
    burst.hidden = true;
  }, 800);
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("collision_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    totalScore: 0,
    bestScore: 0,
    totalCollisions: 0
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  stats.totalScore += gameState.score;
  stats.bestScore = Math.max(stats.bestScore, gameState.score);
  stats.totalCollisions += gameState.foundCollisions.length;
  localStorage.setItem("collision_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statAvgScore").textContent = stats.played > 0 
    ? Math.round(stats.totalScore / stats.played) 
    : 0;
  document.getElementById("statBestScore").textContent = stats.bestScore;
  document.getElementById("statCollisions").textContent = stats.totalCollisions;
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  const text = `ðŸŽ¬ Collision Course #${gameState.puzzleNumber}

${gameState.entityA.name} Ã— ${gameState.entityB.name}

Score: ${gameState.score} pts
ðŸŽ¯ Solo: ${gameState.foundA.length + gameState.foundB.length}
ðŸ’¥ Collisions: ${gameState.foundCollisions.length}

Play at orbit-game.com`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.innerHTML = "<span>âœ“</span> Copied!";
    setTimeout(() => {
      btn.innerHTML = "<span>ðŸ“‹</span> Share Result";
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