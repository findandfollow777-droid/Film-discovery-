// ============================================
// ORBIT GAME - Main Game Logic
// Daily Cinematic Deduction Game
// ============================================

const MAX_ATTEMPTS = 6;

// Game state
let gameState = {
  puzzleNumber: 1,
  targetMovie: null,
  targetCast: [], // Top 5 actor IDs
  actorOrder: [], // Actor IDs in display order (for position matching)
  guesses: [],
  gameOver: false,
  won: false,
  attempts: 0
};

// DOM Elements
let constellationGrid, guessInput, guessBtn, searchResults;
let guessHistory, resultSection, attemptNum;
let gameBackdrop;

// Debounce timer for search
let searchTimeout = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadDailyPuzzle();
  updateDailyInfo();
  loadStats();
  
  // Initialize Moviecube for movie popups
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        localStorage.setItem("anchorMovie", JSON.stringify(movie));
        localStorage.removeItem("anchorFromResults");
        window.location.href = "constellation.html";
      }
    });
  }
  if (typeof initPeopleCube === 'function') initPeopleCube();
});

function cacheElements() {
  constellationGrid = document.getElementById("constellationGrid");
  guessInput = document.getElementById("guessInput");
  guessBtn = document.getElementById("guessBtn");
  searchResults = document.getElementById("searchResults");
  guessHistory = document.getElementById("guessHistory");
  resultSection = document.getElementById("resultSection");
  attemptNum = document.getElementById("attemptNum");
  gameBackdrop = document.getElementById("gameBackdrop");
}

function setupEventListeners() {
  // Guess input
  guessInput.addEventListener("input", handleSearchInput);
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !searchResults.hidden) {
      const firstResult = searchResults.querySelector(".search-result-item");
      if (firstResult) firstResult.click();
    }
    if (e.key === "Escape") {
      searchResults.hidden = true;
    }
  });
  
  // Guess button
  guessBtn.addEventListener("click", () => {
    const firstResult = searchResults.querySelector(".search-result-item");
    if (firstResult) firstResult.click();
  });
  
  // Click outside to close search
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".guess-section")) {
      searchResults.hidden = true;
    }
  });
  
  // Stats modal
  document.getElementById("statsBtn").addEventListener("click", openStatsModal);
  document.getElementById("statsClose").addEventListener("click", closeStatsModal);
  document.getElementById("statsModal").addEventListener("click", (e) => {
    if (e.target.id === "statsModal") closeStatsModal();
  });
  
  // Help modal
  document.getElementById("helpBtn").addEventListener("click", openHelpModal);
  document.getElementById("helpClose").addEventListener("click", closeHelpModal);
  document.getElementById("helpModal").addEventListener("click", (e) => {
    if (e.target.id === "helpModal") closeHelpModal();
  });
  
  // Share button
  document.getElementById("shareBtn")?.addEventListener("click", shareResult);
  
  // Escape key for modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeStatsModal();
      closeHelpModal();
    }
  });
}

// ============================================
// DAILY PUZZLE GENERATION
// ============================================

function getDailyPuzzleNumber() {
  // Use the function from puzzles.js if available, otherwise calculate
  if (typeof window.getDailyPuzzleNumber === 'function') {
    // puzzles.js is loaded, but we're in game.js scope
    const launchDate = new Date("2026-02-16");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - launchDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }
  return 1;
}

function updateDailyInfo() {
  const puzzleNum = getDailyPuzzleNumber();
  document.getElementById("puzzleNumber").textContent = puzzleNum;
  
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("dailyDate").textContent = today.toLocaleDateString('en-US', options);
  
  gameState.puzzleNumber = puzzleNum;
}

async function loadDailyPuzzle() {
  // Check if we have saved state for today
  const savedState = loadTodayState();
  if (savedState) {
    gameState = savedState;
    restoreGameState();
    return;
  }
  
  // Get today's curated puzzle movie ID
  const movieId = getDailyPuzzleMovieId();
  
  try {
    // Fetch the specific movie and its credits
    const [movieDetails, credits] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`).then(r => r.json())
    ]);
    
    // Get top 5 billed actors with photos
    const topCast = credits.cast
      .filter(c => c.profile_path) // Only actors with photos
      .slice(0, 5);
    
    if (topCast.length < 5) {
      console.warn("Movie has fewer than 5 actors with photos, using what's available");
    }
    
    gameState.targetMovie = movieDetails;
    gameState.targetCast = topCast.map(c => c.id);
    
    // Set backdrop
    if (movieDetails.backdrop_path) {
      gameBackdrop.style.backgroundImage = `url(${TMDB_IMG}w1280${movieDetails.backdrop_path})`;
    }
    
    // Display constellation
    displayConstellation(topCast);
    
    // Save initial state
    saveTodayState();
    
  } catch (err) {
    console.error("Error loading puzzle:", err);
    showError("Failed to load today's puzzle. Please refresh.");
  }
}

function displayConstellation(cast) {
  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ccircle cx='50' cy='36' r='20' fill='%236B7280'/%3E%3Cellipse cx='50' cy='90' rx='36' ry='30' fill='%236B7280'/%3E%3C/svg%3E";
  
  // Store actor order for position matching
  gameState.actorOrder = cast.map(c => c.id);
  
  constellationGrid.innerHTML = cast.map((actor, index) => {
    const photo = actor.profile_path 
      ? `${TMDB_IMG}w185${actor.profile_path}` 
      : DEFAULT_AVATAR;
    
    return `
      <div class="actor-card" data-actor-id="${actor.id}" data-position="${index}">
        <div class="actor-photo-wrap">
          <img class="actor-photo" src="${photo}" alt="${actor.name}" 
               onerror="this.src='${DEFAULT_AVATAR}'">
        </div>
        <div class="actor-name">${actor.name}</div>
        <div class="actor-indicator"></div>
      </div>
    `;
  }).join("");

  // Log encountered actors
  if (window.OrbitEncounters) {
    cast.forEach(actor => {
      window.OrbitEncounters.logEncounter({
        id: actor.id,
        name: actor.name,
        profile_path: actor.profile_path,
        known_for_department: 'Acting'
      }, 'constellation');
    });
  }
}

// ============================================
// SEARCH & GUESS
// ============================================

function handleSearchInput(e) {
  const query = e.target.value.trim();
  
  clearTimeout(searchTimeout);
  
  if (query.length < 2) {
    searchResults.hidden = true;
    return;
  }
  
  searchTimeout = setTimeout(() => searchMovies(query), 300);
}

async function searchMovies(query) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );
    const data = await response.json();
    
    displaySearchResults(data.results.slice(0, 8));
  } catch (err) {
    console.error("Search error:", err);
  }
}

function displaySearchResults(movies) {
  const DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'%3E%3Crect fill='%23374151' width='40' height='60'/%3E%3Ctext x='20' y='35' font-family='Arial' font-size='10' fill='%236B7280' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";
  
  if (movies.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item" style="justify-content: center; color: var(--ghost-gray);">No movies found</div>';
    searchResults.hidden = false;
    return;
  }
  
  searchResults.innerHTML = movies.map(movie => {
    const poster = movie.poster_path 
      ? `${TMDB_IMG}w92${movie.poster_path}` 
      : DEFAULT_POSTER;
    const year = movie.release_date ? movie.release_date.split("-")[0] : "Unknown";
    
    // Check if already guessed
    const alreadyGuessed = gameState.guesses.some(g => g.movieId === movie.id);
    const disabledClass = alreadyGuessed ? 'style="opacity: 0.5; pointer-events: none;"' : '';
    
    return `
      <div class="search-result-item" data-movie-id="${movie.id}" ${disabledClass}>
        <img class="search-result-poster" src="${poster}" alt="${movie.title}">
        <div class="search-result-info">
          <div class="search-result-title">${movie.title}</div>
          <div class="search-result-year">${year}${alreadyGuessed ? ' (Already guessed)' : ''}</div>
        </div>
      </div>
    `;
  }).join("");
  
  // Add click handlers
  searchResults.querySelectorAll(".search-result-item").forEach(item => {
    item.addEventListener("click", () => {
      const movieId = parseInt(item.dataset.movieId);
      if (movieId && !gameState.guesses.some(g => g.movieId === movieId)) {
        makeGuess(movieId);
      }
    });
  });
  
  searchResults.hidden = false;
}

async function makeGuess(movieId) {
  if (gameState.gameOver) return;
  
  // Clear input and hide results
  guessInput.value = "";
  searchResults.hidden = true;
  
  try {
    // Fetch guessed movie's credits
    const [movieDetails, credits] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`).then(r => r.json())
    ]);
    
    // Get cast IDs from guessed movie
    const guessCastIds = credits.cast.map(c => c.id);
    
    // Compare with target cast - track WHICH positions matched
    const matchedActors = gameState.targetCast.filter(id => guessCastIds.includes(id));
    const matchCount = matchedActors.length;
    
    // Create position match array (true/false for each of 5 positions)
    const positionMatches = gameState.actorOrder.map(actorId => guessCastIds.includes(actorId));
    
    // Create guess record
    const guessRecord = {
      movieId: movieId,
      title: movieDetails.title,
      year: movieDetails.release_date?.split("-")[0] || "Unknown",
      poster: movieDetails.poster_path,
      matchCount: matchCount,
      matchedActors: matchedActors,
      positionMatches: positionMatches, // NEW: which specific positions matched
      awards: getMovieAwards(movieId) || []
    };
    
    gameState.guesses.push(guessRecord);
    gameState.attempts++;
    
    // Display result
    displayGuessResult(guessRecord);
    updateAttemptCounter();
    updateAttemptDots();
    
    // Check for prestige discovery
    if (guessRecord.awards.length > 0 && matchCount < 5) {
      showPrestigeNotification(guessRecord.awards[0]);
    }
    
    // Check win/lose conditions
    if (matchCount === 5) {
      // SUPERNOVA - Victory!
      triggerSupernova();
      endGame(true);
    } else if (gameState.attempts >= MAX_ATTEMPTS) {
      // Out of attempts
      endGame(false);
    }
    
    // Highlight matched actors in constellation (cumulative)
    highlightMatchedActors(matchedActors);
    
    // Save state
    saveTodayState();
    
  } catch (err) {
    console.error("Error processing guess:", err);
  }
}

function displayGuessResult(guess) {
  const DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='75' viewBox='0 0 50 75'%3E%3Crect fill='%23374151' width='50' height='75'/%3E%3Ctext x='25' y='40' font-family='Arial' font-size='12' fill='%236B7280' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";
  
  const poster = guess.poster 
    ? `${TMDB_IMG}w92${guess.poster}` 
    : DEFAULT_POSTER;
  
  const orbitLevel = getOrbitLevel(guess.matchCount);
  const awardBadges = getAwardBadgesHTML(guess.movieId);
  
  // Create position-matched dots - each dot corresponds to an actor position
  const dots = guess.positionMatches.map((matched, i) => {
    return `<div class="match-dot ${matched ? 'matched' : ''}" title="Actor ${i + 1}"></div>`;
  }).join("");
  
  const html = `
    <div class="guess-result">
      <img class="guess-poster" src="${poster}" alt="${guess.title}">
      <div class="guess-details">
        <div class="guess-title">${guess.title}</div>
        <div class="guess-year">${guess.year}</div>
        ${awardBadges ? `<div class="guess-badges">${awardBadges}</div>` : ''}
      </div>
      <div class="orbit-indicator">
        <div class="orbit-score ${orbitLevel.class}">${guess.matchCount}/5</div>
        <div class="orbit-label">${orbitLevel.name}</div>
        <div class="match-dots">${dots}</div>
      </div>
    </div>
  `;
  
  guessHistory.insertAdjacentHTML("afterbegin", html);
}

function getOrbitLevel(matchCount) {
  switch (matchCount) {
    case 5: return { name: "Supernova", class: "supernova" };
    case 4: return { name: "High Orbit", class: "high-orbit" };
    case 3: return { name: "Mid Orbit", class: "mid-orbit" };
    case 2: return { name: "Low Orbit", class: "low-orbit" };
    case 1: return { name: "Distant", class: "distant" };
    default: return { name: "The Void", class: "void" };
  }
}

function highlightMatchedActors(matchedActorIds) {
  document.querySelectorAll(".actor-card").forEach(card => {
    const actorId = parseInt(card.dataset.actorId);
    if (matchedActorIds.includes(actorId)) {
      card.classList.add("matched");
      card.classList.add("ever-matched"); // Cumulative - stays highlighted
    }
  });
}

function updateAttemptDots() {
  const dots = document.querySelectorAll(".attempts-display .attempt-dot");
  dots.forEach((dot, i) => {
    dot.classList.remove("active", "used");
    if (i < gameState.attempts) {
      dot.classList.add("used");
    } else if (i === gameState.attempts) {
      dot.classList.add("active");
    }
  });
}

function updateAttemptCounter() {
  if (attemptNum) {
    attemptNum.textContent = Math.min(gameState.attempts + 1, MAX_ATTEMPTS);
  }
}

// ============================================
// GAME END
// ============================================

function endGame(won) {
  gameState.gameOver = true;
  gameState.won = won;
  
  // Disable input
  guessInput.disabled = true;
  guessBtn.disabled = true;
  
  // Show result section
  setTimeout(() => {
    showResultSection(won);
    enableClickableNavigation();
  }, won ? 2500 : 500); // Delay if won to let supernova play
  
  // Update statistics
  updateStats(won, gameState.attempts);
  
  // Save final state
  saveTodayState();
}

// Enable clicking on actors and movies to navigate to Timeline
function enableClickableNavigation() {
  // Make actor cards clickable - navigate to Timeline
  document.querySelectorAll('.actor-card').forEach(card => {
    card.classList.add('clickable');
    const actorName = card.querySelector('.actor-name')?.textContent;
    const actorId = card.dataset.actorId;
    if (actorName) {
      card.addEventListener('click', () => {
        // Store actor ID and navigate to timeline
        if (actorId) {
          localStorage.setItem("timelineMovieId", actorId);
          localStorage.setItem("timelineType", "person");
          localStorage.removeItem("vennPeople");
          window.location.href = '../pages/timeline.html';
        } else {
          navigateToTimeline('person', actorName);
        }
      });
    }
  });
  
  // Make guess history items clickable - open Moviecube
  document.querySelectorAll('.guess-result').forEach((result, index) => {
    result.classList.add('clickable');
    const movieId = gameState.guesses[gameState.guesses.length - 1 - index]?.movieId;
    if (movieId && typeof openMovieCube === 'function') {
      result.addEventListener('click', () => {
        openMovieCube(movieId);
      });
    }
  });
  
  // Make target reveal clickable - open Moviecube
  const targetReveal = document.getElementById('targetReveal');
  if (targetReveal && gameState.targetMovie) {
    targetReveal.addEventListener('click', () => {
      if (typeof openMovieCube === 'function') {
        openMovieCube(gameState.targetMovie.id);
      }
    });
  }
}

// Navigate to Timeline page with search query
function navigateToTimeline(type, query) {
  const searchParam = encodeURIComponent(query);
  const url = `../pages/timeline.html?type=${type}&search=${searchParam}`;
  window.location.href = url;
}

function showResultSection(won) {
  const resultIcon = document.getElementById("resultIcon");
  const resultTitle = document.getElementById("resultTitle");
  const resultSubtitle = document.getElementById("resultSubtitle");
  const targetPoster = document.getElementById("targetPoster");
  const targetTitle = document.getElementById("targetTitle");
  const targetYear = document.getElementById("targetYear");
  const targetBadges = document.getElementById("targetBadges");
  
  if (won) {
    resultIcon.innerHTML = '<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"/></svg>';
    resultTitle.textContent = "Supernova!";
    resultTitle.classList.remove("lost");
    resultSubtitle.textContent = `You found the film in ${gameState.attempts} attempt${gameState.attempts > 1 ? 's' : ''}!`;
  } else {
    resultIcon.innerHTML = '<svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"/></svg>';
    resultTitle.textContent = "Lost in Space";
    resultTitle.classList.add("lost");
    resultSubtitle.textContent = "The mystery film was:";
  }
  
  // Reveal target movie
  const target = gameState.targetMovie;
  if (target) {
    targetPoster.src = target.poster_path 
      ? `${TMDB_IMG}w154${target.poster_path}` 
      : "";
    targetTitle.textContent = target.title;
    targetYear.textContent = target.release_date?.split("-")[0] || "";
    targetBadges.innerHTML = getAwardBadgesHTML(target.id);
  }
  
  // Start countdown timer
  startCountdown();
  
  // Show section
  resultSection.hidden = false;
  
  // Hide guess section
  document.getElementById("guessSection").hidden = true;
}

function startCountdown() {
  const timerEl = document.getElementById("nextTimer");
  
  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  update();
  setInterval(update, 1000);
}

// ============================================
// SUPERNOVA ANIMATION
// ============================================

function triggerSupernova() {
  const overlay = document.getElementById("supernovaOverlay");
  overlay.hidden = false;
  
  setTimeout(() => {
    overlay.hidden = true;
  }, 2500);
}

// ============================================
// PRESTIGE NOTIFICATION
// ============================================

function showPrestigeNotification(award) {
  const notification = document.getElementById("prestigeNotification");
  const awardText = document.getElementById("prestigeAward");
  
  awardText.textContent = formatAward(award);
  notification.hidden = false;
  
  // Track prestige discovery
  incrementPrestigeCount();
  
  setTimeout(() => {
    notification.hidden = true;
  }, 3000);
}

// ============================================
// STATE MANAGEMENT
// ============================================

function getTodayKey() {
  const today = new Date();
  return `orbit_game_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

function saveTodayState() {
  const key = getTodayKey();
  const stateToSave = {
    ...gameState,
    targetMovieId: gameState.targetMovie?.id,
    actorOrder: gameState.actorOrder,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(stateToSave));
}

function loadTodayState() {
  const key = getTodayKey();
  const saved = localStorage.getItem(key);
  
  if (!saved) return null;
  
  try {
    const state = JSON.parse(saved);
    return state;
  } catch (e) {
    return null;
  }
}

async function restoreGameState() {
  // Re-fetch target movie details if needed
  if (gameState.targetMovieId && !gameState.targetMovie) {
    const [movieDetails, credits] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${gameState.targetMovieId}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${gameState.targetMovieId}/credits?api_key=${TMDB_API_KEY}`).then(r => r.json())
    ]);
    gameState.targetMovie = movieDetails;
    
    // Set backdrop
    if (movieDetails.backdrop_path) {
      gameBackdrop.style.backgroundImage = `url(${TMDB_IMG}w1280${movieDetails.backdrop_path})`;
    }
    
    // Display constellation
    const topCast = credits.cast.filter(c => c.profile_path).slice(0, 5);
    displayConstellation(topCast);
  } else if (gameState.targetMovie) {
    // Refetch cast for display
    const credits = await fetch(
      `https://api.themoviedb.org/3/movie/${gameState.targetMovie.id}/credits?api_key=${TMDB_API_KEY}`
    ).then(r => r.json());
    
    const topCast = credits.cast.filter(c => c.profile_path).slice(0, 5);
    displayConstellation(topCast);
    
    if (gameState.targetMovie.backdrop_path) {
      gameBackdrop.style.backgroundImage = `url(${TMDB_IMG}w1280${gameState.targetMovie.backdrop_path})`;
    }
  }
  
  // Restore guess history and cumulative actor highlights
  const allMatchedActors = new Set();
  
  gameState.guesses.forEach(guess => {
    // Recalculate positionMatches if not present (for backwards compatibility)
    if (!guess.positionMatches && gameState.actorOrder) {
      guess.positionMatches = gameState.actorOrder.map(actorId => 
        guess.matchedActors.includes(actorId)
      );
    }
    displayGuessResult(guess);
    guess.matchedActors.forEach(id => allMatchedActors.add(id));
  });
  
  // Apply cumulative highlights
  highlightMatchedActors([...allMatchedActors]);
  
  // Update attempt counter and dots
  if (attemptNum) {
    attemptNum.textContent = Math.min(gameState.attempts + 1, MAX_ATTEMPTS);
  }
  updateAttemptDots();
  
  // Check if game was over
  if (gameState.gameOver) {
    guessInput.disabled = true;
    guessBtn.disabled = true;
    showResultSection(gameState.won);
    
    // Enable clickable navigation for completed games
    setTimeout(() => {
      enableClickableNavigation();
    }, 100);
  }
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stats = localStorage.getItem("orbit_game_stats");
  if (!stats) {
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: [0, 0, 0, 0, 0, 0], // Attempts 1-6
      lastPlayed: null,
      prestigeCount: 0
    };
  }
  return JSON.parse(stats);
}

function saveStats(stats) {
  localStorage.setItem("orbit_game_stats", JSON.stringify(stats));
}

function updateStats(won, attempts) {
  const stats = getStats();
  const today = new Date().toDateString();
  
  // Avoid double-counting same day
  if (stats.lastPlayed === today) return;
  
  stats.played++;
  stats.lastPlayed = today;
  
  if (won) {
    stats.won++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[attempts - 1]++;
  } else {
    stats.currentStreak = 0;
  }
  
  saveStats(stats);
}

function incrementPrestigeCount() {
  const stats = getStats();
  stats.prestigeCount = (stats.prestigeCount || 0) + 1;
  saveStats(stats);
}

function loadStats() {
  const stats = getStats();
  
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statWinPct").textContent = 
    stats.played > 0 ? Math.round((stats.won / stats.played) * 100) + "%" : "0%";
  document.getElementById("statStreak").textContent = stats.currentStreak;
  document.getElementById("statMaxStreak").textContent = stats.maxStreak;
  document.getElementById("prestigeCount").textContent = stats.prestigeCount || 0;
  
  // Build distribution chart
  const maxCount = Math.max(...stats.distribution, 1);
  const chart = document.getElementById("distributionChart");
  
  chart.innerHTML = stats.distribution.map((count, i) => {
    const width = (count / maxCount) * 100;
    const highlight = gameState.gameOver && gameState.won && gameState.attempts === (i + 1);
    
    return `
      <div class="distribution-row">
        <span class="distribution-label">${i + 1}</span>
        <div class="distribution-bar ${highlight ? 'highlight' : ''}" style="width: ${Math.max(width, 8)}%;">
          <span class="distribution-count">${count}</span>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================
// SHARE
// ============================================

function shareResult() {
  const puzzleNum = gameState.puzzleNumber;
  const won = gameState.won;
  const attempts = gameState.attempts;
  
  // Build emoji grid - now shows which SPECIFIC positions matched
  const emojiGrid = gameState.guesses.map(guess => {
    // Use positionMatches for accurate position display
    const emojis = guess.positionMatches.map(matched => matched ? "🟢" : "⚫");
    return emojis.join("");
  }).join("\n");
  
  const resultText = won ? `${attempts}/6` : "X/6";
  
  const shareText = `🎬 Orbit #${puzzleNum} ${resultText}

${emojiGrid}

Play at: orbit-game.com`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareText).then(() => {
    const sharePreview = document.getElementById("sharePreview");
    sharePreview.textContent = shareText;
    sharePreview.classList.add("visible");
    
    // Show copied confirmation
    const shareBtn = document.getElementById("shareBtn");
    const originalText = shareBtn.innerHTML;
    shareBtn.innerHTML = "<span>✓</span> Copied!";
    
    setTimeout(() => {
      shareBtn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy:", err);
    alert("Failed to copy result to clipboard");
  });
}

// ============================================
// MODALS
// ============================================

function openStatsModal() {
  loadStats();
  document.getElementById("statsModal").hidden = false;
}

function closeStatsModal() {
  document.getElementById("statsModal").hidden = true;
}

function openHelpModal() {
  document.getElementById("helpModal").hidden = false;
}

function closeHelpModal() {
  document.getElementById("helpModal").hidden = true;
}

// ============================================
// UTILITIES
// ============================================

// ============================================
// RESULT CLOSE / VIEW RESULTS
// ============================================

document.getElementById('resultCloseBtn').addEventListener('click', () => {
  document.getElementById('resultSection').hidden = true;
  // Show a "View Results" button if not already present
  if (!document.getElementById('viewResultsBtn')) {
    const btn = document.createElement('button');
    btn.id = 'viewResultsBtn';
    btn.className = 'view-results-btn';
    btn.textContent = 'View Results';
    btn.addEventListener('click', () => {
      document.getElementById('resultSection').hidden = false;
      btn.remove();
    });
    // Insert after the history section
    const historySection = document.getElementById('historySection');
    historySection.parentNode.insertBefore(btn, historySection.nextSibling);
  }
});

function showError(message) {
  // Simple error display
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    background: rgba(239, 68, 68, 0.9);
    border-radius: 10px;
    color: white;
    font-size: 16px;
    z-index: 9999;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => errorDiv.remove(), 5000);
}