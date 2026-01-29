// ============================================
// SCREENSHOT SPEED - Game Logic
// Orbit Games Suite - Visual Movie Recognition
// ============================================

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";
const TMDB_IMG = "https://image.tmdb.org/t/p/";

// Game configuration
const ROUNDS_PER_GAME = 5;
const POINTS_PER_ROUND = [100, 80, 60, 40, 20]; // Points decrease as blur decreases
const BLUR_LEVELS = [30, 20, 12, 6, 0]; // Blur amounts in pixels
const REVEAL_INTERVAL = 4000; // 4 seconds per blur level

// Curated movies with good backdrops
const DAILY_SCREENSHOTS = [
  // Week 1 - Iconic films
  [
    { id: 27205, title: "Inception" },
    { id: 155, title: "The Dark Knight" },
    { id: 680, title: "Pulp Fiction" },
    { id: 13, title: "Forrest Gump" },
    { id: 238, title: "The Godfather" }
  ],
  [
    { id: 578, title: "Jaws" },
    { id: 603, title: "The Matrix" },
    { id: 11, title: "Star Wars" },
    { id: 197, title: "Braveheart" },
    { id: 550, title: "Fight Club" }
  ],
  [
    { id: 120, title: "The Lord of the Rings: The Fellowship of the Ring" },
    { id: 101, title: "Leon: The Professional" },
    { id: 389, title: "12 Angry Men" },
    { id: 278, title: "The Shawshank Redemption" },
    { id: 424, title: "Schindler's List" }
  ],
  [
    { id: 157336, title: "Interstellar" },
    { id: 637, title: "Life Is Beautiful" },
    { id: 475557, title: "Joker" },
    { id: 497, title: "The Green Mile" },
    { id: 769, title: "GoodFellas" }
  ],
  [
    { id: 122, title: "The Lord of the Rings: The Return of the King" },
    { id: 497, title: "The Green Mile" },
    { id: 274, title: "The Silence of the Lambs" },
    { id: 240, title: "The Godfather Part II" },
    { id: 129, title: "Spirited Away" }
  ],
  [
    { id: 807, title: "Se7en" },
    { id: 1891, title: "The Empire Strikes Back" },
    { id: 694, title: "The Shining" },
    { id: 429, title: "The Good, the Bad and the Ugly" },
    { id: 489, title: "Good Will Hunting" }
  ],
  [
    { id: 640, title: "Catch Me If You Can" },
    { id: 98, title: "Gladiator" },
    { id: 500, title: "Reservoir Dogs" },
    { id: 372058, title: "Your Name." },
    { id: 324857, title: "Spider-Man: Into the Spider-Verse" }
  ],
  
  // Week 2 - Modern classics
  [
    { id: 299536, title: "Avengers: Infinity War" },
    { id: 284053, title: "Thor: Ragnarok" },
    { id: 299534, title: "Avengers: Endgame" },
    { id: 315635, title: "Spider-Man: Homecoming" },
    { id: 118340, title: "Guardians of the Galaxy" }
  ],
  [
    { id: 293660, title: "Deadpool" },
    { id: 24428, title: "The Avengers" },
    { id: 1726, title: "Iron Man" },
    { id: 99861, title: "Avengers: Age of Ultron" },
    { id: 271110, title: "Captain America: Civil War" }
  ],
  [
    { id: 346364, title: "It" },
    { id: 420817, title: "Aladdin" },
    { id: 420818, title: "The Lion King" },
    { id: 330457, title: "Frozen II" },
    { id: 508442, title: "Soul" }
  ],
  [
    { id: 438631, title: "Dune" },
    { id: 76600, title: "Avatar: The Way of Water" },
    { id: 505642, title: "Black Panther: Wakanda Forever" },
    { id: 507086, title: "Jurassic World Dominion" },
    { id: 436270, title: "Black Adam" }
  ],
  [
    { id: 361743, title: "Top Gun: Maverick" },
    { id: 634649, title: "Spider-Man: No Way Home" },
    { id: 526896, title: "Meg 2: The Trench" },
    { id: 447365, title: "Guardians of the Galaxy Vol. 3" },
    { id: 667538, title: "Transformers: Rise of the Beasts" }
  ],
  [
    { id: 569094, title: "Spider-Man: Across the Spider-Verse" },
    { id: 385687, title: "Fast X" },
    { id: 502356, title: "The Super Mario Bros. Movie" },
    { id: 298618, title: "The Flash" },
    { id: 346698, title: "Barbie" }
  ],
  [
    { id: 872585, title: "Oppenheimer" },
    { id: 575264, title: "Mission: Impossible - Dead Reckoning Part One" },
    { id: 493529, title: "Dungeons & Dragons: Honor Among Thieves" },
    { id: 76341, title: "Mad Max: Fury Road" },
    { id: 321612, title: "Beauty and the Beast" }
  ]
];

// Game state
let gameState = {
  puzzleNumber: 1,
  currentRound: 0,
  currentBlurLevel: 0,
  movies: [],
  currentMovie: null,
  score: 0,
  roundScores: [],
  guessed: false,
  gameOver: false,
  blurTimer: null,
  backdropUrl: "",
  pendingPoints: 0
};

// DOM Elements
let screenshotImage, blurOverlay;
let roundIndicator, scoreValue;
let guessInput, searchResults, skipBtn;
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
  screenshotImage = document.getElementById("screenshotImg");
  blurOverlay = document.getElementById("blurOverlay");
  roundIndicator = document.getElementById("currentRound");
  scoreValue = document.getElementById("currentScore");
  guessInput = document.getElementById("guessInput");
  searchResults = document.getElementById("searchResults");
  skipBtn = document.getElementById("skipBtn");
  resultSection = document.getElementById("resultSection");
}

function setupEventListeners() {
  // Search input
  guessInput.addEventListener("input", debounce(handleSearch, 300));
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") searchResults.hidden = true;
  });
  
  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".guess-section")) {
      searchResults.hidden = true;
    }
  });
  
  // Skip button
  skipBtn.addEventListener("click", skipRound);
  
  // Next round button
  document.getElementById("nextBtn").addEventListener("click", () => {
    roundComplete(gameState.pendingPoints || 0);
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
  return dayNumber % DAILY_SCREENSHOTS.length;
}

async function loadDailyPuzzle() {
  const puzzleIndex = getDailyPuzzleIndex();
  gameState.movies = DAILY_SCREENSHOTS[puzzleIndex];
  gameState.puzzleNumber = puzzleIndex + 1;
  
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  
  // Initialize progress dots
  const progressDots = document.getElementById("progressDots");
  progressDots.innerHTML = '';
  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    const dot = document.createElement("div");
    dot.className = "round-dot";
    progressDots.appendChild(dot);
  }
  
  // Check if already played today
  const todayState = getTodayState();
  if (todayState && todayState.gameOver) {
    gameState = { ...gameState, ...todayState };
    showResult();
    return;
  }
  
  // Start first round
  startRound();
}

function getTodayState() {
  const today = new Date();
  const key = `screenshot_game_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
}

// ============================================
// GAME FLOW
// ============================================

async function startRound() {
  if (gameState.currentRound >= ROUNDS_PER_GAME) {
    endGame();
    return;
  }
  
  gameState.currentMovie = gameState.movies[gameState.currentRound];
  gameState.currentBlurLevel = 0;
  gameState.guessed = false;
  
  // Update round text
  roundIndicator.textContent = gameState.currentRound + 1;
  
  // Update round indicator dots
  updateRoundIndicator();
  
  // Fetch movie backdrop
  await loadMovieBackdrop(gameState.currentMovie.id);
  
  // Set initial blur
  updateBlur();
  
  // Start blur reduction timer
  startBlurTimer();
  
  // Focus input
  guessInput.value = "";
  guessInput.focus();
}

async function loadMovieBackdrop(movieId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    const movie = await res.json();
    
    if (movie.backdrop_path) {
      gameState.backdropUrl = `${TMDB_IMG}w1280${movie.backdrop_path}`;
      screenshotImage.src = gameState.backdropUrl;
    }
  } catch (err) {
    console.error("Error loading backdrop:", err);
  }
}

function startBlurTimer() {
  clearInterval(gameState.blurTimer);
  
  gameState.blurTimer = setInterval(() => {
    if (gameState.guessed) {
      clearInterval(gameState.blurTimer);
      return;
    }
    
    gameState.currentBlurLevel++;
    
    if (gameState.currentBlurLevel >= BLUR_LEVELS.length) {
      // Time's up for this round - no points
      clearInterval(gameState.blurTimer);
      roundComplete(0);
      return;
    }
    
    updateBlur();
  }, REVEAL_INTERVAL);
}

function updateBlur() {
  const blur = BLUR_LEVELS[gameState.currentBlurLevel];
  screenshotImage.style.filter = `blur(${blur}px)`;
  
  // Update blur indicator style
  const blurIndicator = document.querySelector(".blur-indicator");
  if (blurIndicator) {
    blurIndicator.style.setProperty("--blur-progress", `${(gameState.currentBlurLevel / (BLUR_LEVELS.length - 1)) * 100}%`);
  }
}

function updateRoundIndicator() {
  const dots = document.querySelectorAll(".round-dot");
  dots.forEach((dot, i) => {
    dot.classList.remove("active", "completed", "wrong");
    if (i < gameState.currentRound) {
      dot.classList.add(gameState.roundScores[i] > 0 ? "completed" : "wrong");
    } else if (i === gameState.currentRound) {
      dot.classList.add("active");
    }
  });
}

// ============================================
// SEARCH & GUESSING
// ============================================

async function handleSearch() {
  if (gameState.guessed) return;
  
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
    
    const results = (data.results || []).slice(0, 6);
    
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
  if (gameState.guessed) return;
  
  gameState.guessed = true;
  clearInterval(gameState.blurTimer);
  searchResults.hidden = true;
  
  const correct = movieId === gameState.currentMovie.id;
  const points = correct ? POINTS_PER_ROUND[gameState.currentBlurLevel] : 0;
  
  // Store points for next button
  gameState.pendingPoints = points;
  
  // Visual feedback
  showFeedback(correct, points);
}

function showFeedback(correct, points) {
  // Reveal image
  screenshotImage.style.filter = "blur(0px)";
  
  // Show feedback overlay
  const feedback = document.getElementById("roundResult");
  feedback.hidden = false;
  
  document.getElementById("feedbackIcon").textContent = correct ? "✓" : "✗";
  document.getElementById("feedbackText").textContent = correct ? "Correct!" : "Wrong!";
  document.getElementById("answerTitle").textContent = gameState.currentMovie.title;
  document.getElementById("pointsEarned").textContent = correct ? `+${points}` : "0";
}

function roundComplete(points) {
  // Hide feedback
  document.getElementById("roundResult").hidden = true;
  
  // Record score
  gameState.roundScores.push(points);
  gameState.score += points;
  
  // Update display
  scoreValue.textContent = gameState.score;
  
  // Next round
  gameState.currentRound++;
  
  if (gameState.currentRound >= ROUNDS_PER_GAME) {
    endGame();
  } else {
    startRound();
  }
}

function skipRound() {
  if (gameState.guessed) return;
  
  gameState.guessed = true;
  clearInterval(gameState.blurTimer);
  
  gameState.pendingPoints = 0;
  showFeedback(false, 0);
}

// ============================================
// GAME END
// ============================================

function endGame() {
  gameState.gameOver = true;
  
  // Save state
  saveTodayState();
  saveStats();
  
  // Show result
  showResult();
}

function showResult() {
  resultSection.hidden = false;
  
  const maxScore = ROUNDS_PER_GAME * POINTS_PER_ROUND[0];
  const percentage = Math.round((gameState.score / maxScore) * 100);
  
  document.getElementById("finalScore").textContent = gameState.score;
  document.getElementById("maxScore").textContent = maxScore;
  
  // Verdict
  const verdictEl = document.getElementById("scoreVerdict");
  const iconEl = document.getElementById("resultIcon");
  
  if (percentage >= 80) {
    verdictEl.textContent = "Expert Eye! 🏆";
    iconEl.textContent = "🏆";
  } else if (percentage >= 60) {
    verdictEl.textContent = "Sharp Vision! 👁️";
    iconEl.textContent = "👁️";
  } else if (percentage >= 40) {
    verdictEl.textContent = "Good Recognition! 👍";
    iconEl.textContent = "👍";
  } else {
    verdictEl.textContent = "Keep Watching! 🎬";
    iconEl.textContent = "🎬";
  }
  
  // Round breakdown
  const breakdownEl = document.getElementById("roundBreakdown");
  breakdownEl.innerHTML = gameState.roundScores.map((score, i) => `
    <div class="breakdown-item ${score > 0 ? 'correct' : 'wrong'}">
      <span class="breakdown-round">Round ${i + 1}</span>
      <span class="breakdown-movie">${gameState.movies[i].title}</span>
      <span class="breakdown-score">${score > 0 ? '+' + score : '0'}</span>
    </div>
  `).join("");
  
  startNextPuzzleCountdown();
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("screenshot_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    totalScore: 0,
    bestScore: 0,
    perfectRounds: 0
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  stats.totalScore += gameState.score;
  stats.bestScore = Math.max(stats.bestScore, gameState.score);
  stats.perfectRounds += gameState.roundScores.filter(s => s === 100).length;
  localStorage.setItem("screenshot_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statAvgScore").textContent = stats.played > 0 
    ? Math.round(stats.totalScore / stats.played) 
    : 0;
  document.getElementById("statBestScore").textContent = stats.bestScore;
  document.getElementById("statPerfect").textContent = stats.perfectRounds;
}

function saveTodayState() {
  const today = new Date();
  const key = `screenshot_game_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  localStorage.setItem(key, JSON.stringify({
    gameOver: true,
    score: gameState.score,
    roundScores: gameState.roundScores
  }));
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  const maxScore = ROUNDS_PER_GAME * POINTS_PER_ROUND[0];
  
  // Create emoji grid for rounds
  const emojiGrid = gameState.roundScores.map(score => {
    if (score === 100) return "🟩"; // Perfect
    if (score >= 60) return "🟨"; // Good
    if (score > 0) return "🟧"; // OK
    return "⬛"; // Missed
  }).join("");
  
  const text = `📸 Screenshot Speed #${gameState.puzzleNumber}

${emojiGrid}

Score: ${gameState.score}/${maxScore}

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