// ============================================
// SEQUEL SHOT - Game Logic
// Orbit Games Suite - Franchise Visual Recognition
// ============================================

const TIMER_SECONDS = 30;
const ROUNDS_TOTAL = 10;
const FEEDBACK_DELAY = 600; // ms pause between rounds for feedback

// Demo franchise for prototype
const DEMO_FRANCHISE = {
  name: "The Lord of the Rings",
  emoji: "\uD83D\uDC8D",
  films: [
    { id: 120, title: "The Fellowship of the Ring", short: "Fellowship", year: 2001 },
    { id: 121, title: "The Two Towers", short: "Two Towers", year: 2002 },
    { id: 122, title: "The Return of the King", short: "Return of King", year: 2003 }
  ]
};

// Game state
let state = {
  franchise: DEMO_FRANCHISE,
  allBackdrops: {},
  rounds: [],
  currentRound: 0,
  timerMs: TIMER_SECONDS * 1000,
  timerRunning: false,
  startTimestamp: null,
  gamePhase: "start",
  gameOver: false,
  score: 0,
  timeRemaining: 0,
  answering: false
};

// Cached DOM references
let els = {};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  initGame();
});

function cacheElements() {
  els = {
    startScreen: document.getElementById("startScreen"),
    playScreen: document.getElementById("playScreen"),
    resultScreen: document.getElementById("resultScreen"),
    franchiseName: document.getElementById("franchiseName"),
    filmList: document.getElementById("filmList"),
    startBtn: document.getElementById("startBtn"),
    stillImage: document.getElementById("stillImage"),
    stillFrame: document.getElementById("stillFrame"),
    stillLoading: document.getElementById("stillLoading"),
    roundLabel: document.getElementById("roundLabel"),
    timerValue: document.getElementById("timerValue"),
    scoreValue: document.getElementById("scoreValue"),
    streakValue: document.getElementById("streakValue"),
    streakDots: document.getElementById("streakDots"),
    answerBtns: document.getElementById("answerBtns"),
    resultIcon: document.getElementById("resultIcon"),
    finalScore: document.getElementById("finalScore"),
    timeRemaining: document.getElementById("timeRemaining"),
    resultGrid: document.getElementById("resultGrid"),
    resultBreakdown: document.getElementById("resultBreakdown"),
    shareBtn: document.getElementById("shareBtn"),
    nextTimer: document.getElementById("nextTimer"),
    resultCloseBtn: document.getElementById("resultCloseBtn"),
    helpBtn: document.getElementById("helpBtn"),
    helpModal: document.getElementById("helpModal"),
    helpClose: document.getElementById("helpClose"),
    statsBtn: document.getElementById("statsBtn"),
    statsModal: document.getElementById("statsModal"),
    statsClose: document.getElementById("statsClose"),
    puzzleNumber: document.getElementById("puzzleNumber")
  };
}

function setupEventListeners() {
  els.startBtn.addEventListener("click", startGame);
  els.shareBtn.addEventListener("click", shareResult);

  els.helpBtn.addEventListener("click", () => { els.helpModal.hidden = false; });
  els.helpClose.addEventListener("click", () => { els.helpModal.hidden = true; });
  els.statsBtn.addEventListener("click", () => { loadStats(); els.statsModal.hidden = false; });
  els.statsClose.addEventListener("click", () => { els.statsModal.hidden = true; });

  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Result close button
  els.resultCloseBtn.addEventListener("click", () => {
    els.resultScreen.hidden = true;
    // Add view results button
    if (!document.getElementById("viewResultsBtn")) {
      const btn = document.createElement("button");
      btn.id = "viewResultsBtn";
      btn.className = "view-results-btn";
      btn.textContent = "View Results";
      btn.addEventListener("click", () => {
        els.resultScreen.hidden = false;
        btn.remove();
      });
      els.answerBtns.after(btn);
    }
  });

  // Keyboard shortcuts (1, 2, 3)
  document.addEventListener("keydown", (e) => {
    if (state.gamePhase !== "play" || state.answering) return;
    const key = parseInt(e.key);
    if (key >= 1 && key <= 3) {
      handleAnswer(key - 1);
    }
  });
}

function initGame() {
  const puzzleNum = getDailyPuzzleNumber();
  els.puzzleNumber.textContent = puzzleNum;

  // Check if already played today
  const todayState = getTodayState();
  if (todayState && todayState.gameOver) {
    state.rounds = todayState.rounds;
    state.score = todayState.score;
    state.timeRemaining = todayState.timeRemaining;
    state.gameOver = true;
    state.gamePhase = "results";
    if (todayState.franchise) {
      state.franchise = todayState.franchise;
    }
    showScreen("results");
    showResults();
    return;
  }

  showScreen("start");
  displayFranchiseInfo();
}

// ============================================
// DAILY PUZZLE
// ============================================

function getDailyPuzzleNumber() {
  const launch = new Date("2026-02-16");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - launch) / (1000 * 60 * 60 * 24)) + 1;
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================
// START SCREEN
// ============================================

function displayFranchiseInfo() {
  els.franchiseName.textContent = state.franchise.emoji + " " + state.franchise.name;

  els.filmList.innerHTML = state.franchise.films.map((film, i) =>
    '<div class="film-card">' +
      '<div class="film-number">' + (i + 1) + '</div>' +
      '<div class="film-info">' +
        '<div class="film-title">' + film.short + '</div>' +
        '<div class="film-year">' + film.year + '</div>' +
      '</div>' +
    '</div>'
  ).join("");
}

// ============================================
// GAME START
// ============================================

async function startGame() {
  els.startBtn.disabled = true;
  els.startBtn.querySelector(".btn-text").textContent = "LOADING...";
  els.startBtn.querySelector(".btn-sub").textContent = "Fetching stills";

  try {
    await loadAllBackdrops();
    prepareRounds();
    await preloadRoundImages();

    showScreen("play");
    initPlayUI();
    showRound();
    startTimer();
  } catch (err) {
    console.error("Failed to start game:", err);
    els.startBtn.disabled = false;
    els.startBtn.querySelector(".btn-text").textContent = "START";
    els.startBtn.querySelector(".btn-sub").textContent = "30 seconds on the clock";
  }
}

async function loadAllBackdrops() {
  const backdrops = {};

  const fetches = state.franchise.films.map(async (film) => {
    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/movie/" + film.id + "/images?api_key=" + TMDB_API_KEY
      );
      const data = await res.json();
      // Sort by file_path for deterministic ordering
      backdrops[film.id] = (data.backdrops || [])
        .sort((a, b) => a.file_path.localeCompare(b.file_path));
    } catch (err) {
      console.error("Failed to load backdrops for " + film.title + ":", err);
      backdrops[film.id] = [];
    }
  });

  await Promise.all(fetches);
  state.allBackdrops = backdrops;
}

function prepareRounds() {
  const seed = getDailyPuzzleNumber();
  const rng = seededRandom(seed);

  // Distribute 10 rounds across 3 films: 4-3-3
  const distribution = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2];

  // Shuffle with seeded random
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    var temp = distribution[i];
    distribution[i] = distribution[j];
    distribution[j] = temp;
  }

  // Track how many images used per film
  const usedPerFilm = [0, 0, 0];

  state.rounds = distribution.map(function (filmIndex) {
    const film = state.franchise.films[filmIndex];
    const backdrops = state.allBackdrops[film.id] || [];
    var imageIdx;

    if (backdrops.length > 0) {
      // Use seeded random to pick from available backdrops with offset
      imageIdx = Math.floor(rng() * backdrops.length);
      // Avoid duplicates within same film when possible
      var attempts = 0;
      while (attempts < backdrops.length) {
        var candidateIdx = (imageIdx + usedPerFilm[filmIndex] + attempts) % backdrops.length;
        imageIdx = candidateIdx;
        attempts++;
        // Simple duplicate avoidance: just offset by usage count
        break;
      }
      imageIdx = (imageIdx + usedPerFilm[filmIndex]) % backdrops.length;
    } else {
      imageIdx = 0;
    }

    usedPerFilm[filmIndex]++;

    return {
      filmIndex: filmIndex,
      backdropPath: backdrops.length > 0 ? backdrops[imageIdx].file_path : null,
      answer: null,
      correct: null
    };
  });
}

async function preloadRoundImages() {
  var promises = state.rounds.map(function (round) {
    if (!round.backdropPath) return Promise.resolve();
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = TMDB_IMG + "w1280" + round.backdropPath;
    });
  });
  await Promise.all(promises);
}

// ============================================
// PLAY UI
// ============================================

function initPlayUI() {
  // Create streak dots
  els.streakDots.innerHTML = "";
  for (var i = 0; i < ROUNDS_TOTAL; i++) {
    var dot = document.createElement("div");
    dot.className = "streak-dot";
    els.streakDots.appendChild(dot);
  }

  // Create answer buttons
  els.answerBtns.innerHTML = state.franchise.films.map(function (film, i) {
    return '<button class="answer-btn" data-film="' + i + '">' +
      '<span class="answer-key">' + (i + 1) + '</span>' +
      '<span class="answer-title">' + film.short + '</span>' +
      '<span class="answer-year">(' + film.year + ')</span>' +
    '</button>';
  }).join("");

  // Attach click handlers
  els.answerBtns.querySelectorAll(".answer-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (state.gamePhase !== "play" || state.answering) return;
      handleAnswer(parseInt(btn.dataset.film));
    });
  });

  updateScoreDisplay();
}

function showScreen(screen) {
  els.startScreen.hidden = screen !== "start";
  els.playScreen.hidden = screen !== "play";
  els.resultScreen.hidden = screen !== "results";
}

// ============================================
// ROUND DISPLAY
// ============================================

function showRound() {
  if (state.currentRound >= ROUNDS_TOTAL) {
    endGame();
    return;
  }

  state.answering = false;
  var round = state.rounds[state.currentRound];

  // Update round label
  els.roundLabel.textContent = (state.currentRound + 1) + " / " + ROUNDS_TOTAL;

  // Show image
  if (round.backdropPath) {
    els.stillImage.classList.add("loading");
    els.stillLoading.classList.remove("hidden");
    els.stillImage.src = TMDB_IMG + "w1280" + round.backdropPath;
    els.stillImage.onload = function () {
      els.stillImage.classList.remove("loading");
      els.stillLoading.classList.add("hidden");
    };
  } else {
    els.stillImage.src = "";
    els.stillLoading.classList.remove("hidden");
    els.stillLoading.textContent = "No image available";
  }

  // Reset frame style
  els.stillFrame.classList.remove("flash-correct", "flash-wrong");

  // Update dots
  updateStreakDots();

  // Enable buttons
  els.answerBtns.querySelectorAll(".answer-btn").forEach(function (btn) {
    btn.classList.remove("correct", "wrong", "disabled");
    btn.disabled = false;
  });
}

// ============================================
// ANSWER HANDLING
// ============================================

function handleAnswer(filmIndex) {
  if (state.answering || state.gamePhase !== "play") return;
  state.answering = true;

  var round = state.rounds[state.currentRound];
  round.answer = filmIndex;
  round.correct = filmIndex === round.filmIndex;

  // Visual feedback on buttons
  var btns = els.answerBtns.querySelectorAll(".answer-btn");
  btns.forEach(function (btn) {
    btn.disabled = true;
    var idx = parseInt(btn.dataset.film);
    if (idx === round.filmIndex) {
      btn.classList.add("correct");
    } else if (idx === filmIndex && !round.correct) {
      btn.classList.add("wrong");
    } else {
      btn.classList.add("disabled");
    }
  });

  // Flash frame border
  els.stillFrame.classList.add(round.correct ? "flash-correct" : "flash-wrong");

  // Update dots and score
  updateStreakDots();
  updateScoreDisplay();

  // Auto-advance
  setTimeout(function () {
    state.currentRound++;
    if (state.currentRound >= ROUNDS_TOTAL) {
      endGame();
    } else {
      showRound();
    }
  }, FEEDBACK_DELAY);
}

// ============================================
// TIMER
// ============================================

function startTimer() {
  state.startTimestamp = performance.now();
  state.timerRunning = true;
  state.gamePhase = "play";
  requestAnimationFrame(updateTimer);
}

function updateTimer(timestamp) {
  if (!state.timerRunning) return;

  var elapsed = timestamp - state.startTimestamp;
  state.timerMs = Math.max(0, TIMER_SECONDS * 1000 - elapsed);

  // Format as SS.mmm
  var seconds = Math.floor(state.timerMs / 1000);
  var ms = Math.floor(state.timerMs % 1000);
  els.timerValue.textContent = pad2(seconds) + "." + pad3(ms);

  // Timer urgency
  if (state.timerMs <= 5000) {
    els.timerValue.classList.remove("warning");
    els.timerValue.classList.add("urgent");
  } else if (state.timerMs <= 10000) {
    els.timerValue.classList.add("warning");
    els.timerValue.classList.remove("urgent");
  } else {
    els.timerValue.classList.remove("warning", "urgent");
  }

  if (state.timerMs <= 0) {
    state.timerRunning = false;
    // Mark remaining rounds as timed out
    for (var i = state.currentRound; i < ROUNDS_TOTAL; i++) {
      if (state.rounds[i].answer === null) {
        state.rounds[i].answer = -1;
        state.rounds[i].correct = false;
      }
    }
    endGame();
    return;
  }

  requestAnimationFrame(updateTimer);
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function pad3(n) {
  if (n < 10) return "00" + n;
  if (n < 100) return "0" + n;
  return "" + n;
}

// ============================================
// SCORING
// ============================================

function calculateScore(rounds) {
  var total = 0;
  var currentStreak = 0;

  for (var i = 0; i < rounds.length; i++) {
    if (rounds[i].correct) {
      currentStreak++;
    } else {
      total += currentStreak * currentStreak * 10;
      currentStreak = 0;
    }
  }
  // Final active streak
  total += currentStreak * currentStreak * 10;

  return total;
}

function getCurrentScore() {
  var total = 0;
  var currentStreak = 0;

  for (var i = 0; i <= state.currentRound && i < ROUNDS_TOTAL; i++) {
    var round = state.rounds[i];
    if (round.answer === null) break;

    if (round.correct) {
      currentStreak++;
    } else {
      total += currentStreak * currentStreak * 10;
      currentStreak = 0;
    }
  }
  total += currentStreak * currentStreak * 10;

  return total;
}

function getCurrentStreak() {
  var streak = 0;
  for (var i = state.currentRound; i >= 0; i--) {
    var round = state.rounds[i];
    if (round.answer === null) continue;
    if (round.correct) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function updateScoreDisplay() {
  var score = getCurrentScore();
  var streak = getCurrentStreak();

  els.scoreValue.textContent = score;
  els.streakValue.textContent = streak > 1 ? "\u00D7" + streak : "";
}

// ============================================
// STREAK DOTS
// ============================================

function updateStreakDots() {
  var dots = els.streakDots.querySelectorAll(".streak-dot");

  dots.forEach(function (dot, i) {
    dot.classList.remove("correct", "wrong", "current", "timeout");

    if (i < state.rounds.length && state.rounds[i].answer !== null) {
      if (state.rounds[i].correct) {
        dot.classList.add("correct");
      } else if (state.rounds[i].answer === -1) {
        dot.classList.add("timeout");
      } else {
        dot.classList.add("wrong");
      }
    } else if (i === state.currentRound && state.gamePhase === "play") {
      dot.classList.add("current");
    }
  });
}

// ============================================
// GAME END
// ============================================

function endGame() {
  state.timerRunning = false;
  state.gamePhase = "results";
  state.gameOver = true;
  state.score = calculateScore(state.rounds);
  state.timeRemaining = state.timerMs;

  saveTodayState();
  saveStats();

  showScreen("results");
  showResults();
}

function showResults() {
  // Score
  els.finalScore.textContent = state.score;

  // Result icon based on score
  if (state.score === 1000) {
    els.resultIcon.textContent = "\uD83C\uDFC6";
  } else if (state.score >= 500) {
    els.resultIcon.textContent = "\uD83C\uDF1F";
  } else if (state.score >= 200) {
    els.resultIcon.textContent = "\uD83C\uDFAC";
  } else {
    els.resultIcon.textContent = "\uD83C\uDFAF";
  }

  // Time remaining
  if (state.timeRemaining > 0) {
    var secs = (state.timeRemaining / 1000).toFixed(3);
    els.timeRemaining.textContent = secs + "s remaining";
  } else {
    els.timeRemaining.textContent = "Time expired";
  }

  // Result grid (colored dots)
  els.resultGrid.innerHTML = state.rounds.map(function (r) {
    if (r.correct) return '<span class="result-dot correct">\u25CF</span>';
    if (r.answer === -1) return '<span class="result-dot timeout">\u25CF</span>';
    return '<span class="result-dot wrong">\u25CF</span>';
  }).join("");

  // Breakdown by streaks
  var breakdownHtml = '<div class="breakdown-header">Streak Breakdown</div>';
  var roundIdx = 0;
  var streakStart = 0;
  var i = 0;

  while (i < state.rounds.length) {
    if (state.rounds[i].correct) {
      // Count streak
      var streakLen = 0;
      var start = i;
      while (i < state.rounds.length && state.rounds[i].correct) {
        streakLen++;
        i++;
      }
      breakdownHtml += '<div class="breakdown-row streak">' +
        '<span class="breakdown-round">Q' + (start + 1) +
        (streakLen > 1 ? '\u2013' + (start + streakLen) : '') + '</span>' +
        '<span class="breakdown-label">Streak of ' + streakLen + '</span>' +
        '<span class="breakdown-pts">+' + (streakLen * streakLen * 10) + '</span>' +
      '</div>';
    } else {
      var label = state.rounds[i].answer === -1 ? "Timed out" : "Wrong";
      breakdownHtml += '<div class="breakdown-row wrong">' +
        '<span class="breakdown-round">Q' + (i + 1) + '</span>' +
        '<span class="breakdown-label">' + label + '</span>' +
        '<span class="breakdown-pts">0</span>' +
      '</div>';
      i++;
    }
  }

  els.resultBreakdown.innerHTML = breakdownHtml;

  // Countdown
  startNextPuzzleCountdown();
}

// ============================================
// PERSISTENCE
// ============================================

function getTodayKey() {
  var today = new Date();
  return "sequelshot_" + today.getFullYear() + "_" + (today.getMonth() + 1) + "_" + today.getDate();
}

function getTodayState() {
  var saved = localStorage.getItem(getTodayKey());
  return saved ? JSON.parse(saved) : null;
}

function saveTodayState() {
  localStorage.setItem(getTodayKey(), JSON.stringify({
    gameOver: true,
    score: state.score,
    timeRemaining: state.timeRemaining,
    rounds: state.rounds,
    franchise: state.franchise
  }));
}

function getStats() {
  var stored = localStorage.getItem("sequelshot_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    totalScore: 0,
    bestScore: 0,
    perfectGames: 0,
    bestTime: 0
  };
}

function saveStats() {
  var stats = getStats();
  stats.played++;
  stats.totalScore += state.score;
  stats.bestScore = Math.max(stats.bestScore, state.score);
  if (state.score === 1000) {
    stats.perfectGames++;
    if (state.timeRemaining > stats.bestTime) {
      stats.bestTime = state.timeRemaining;
    }
  }
  localStorage.setItem("sequelshot_stats", JSON.stringify(stats));
}

function loadStats() {
  var stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statAvgScore").textContent = stats.played > 0
    ? Math.round(stats.totalScore / stats.played)
    : 0;
  document.getElementById("statBestScore").textContent = stats.bestScore;
  document.getElementById("statPerfect").textContent = stats.perfectGames;
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  var grid = state.rounds.map(function (r) {
    if (r.correct) return "\uD83D\uDFE2";
    return "\uD83D\uDD34";
  }).join("");

  var puzzleNum = getDailyPuzzleNumber();

  var text = "\uD83C\uDFAC Sequel Shot #" + puzzleNum + "\n" +
    state.franchise.emoji + " " + state.franchise.name + "\n\n" +
    grid + "\n\n" +
    "Score: " + state.score + "/1,000";

  if (state.timeRemaining > 0) {
    text += "\nTime: " + (state.timeRemaining / 1000).toFixed(3) + "s left";
  }

  text += "\n\nPlay at orbit-game.com/arcade";

  navigator.clipboard.writeText(text).then(function () {
    els.shareBtn.innerHTML = "<span>\u2713</span> Copied!";
    setTimeout(function () {
      els.shareBtn.innerHTML = "<span>\uD83D\uDCCB</span> Share Result";
    }, 2000);
  });
}

// ============================================
// COUNTDOWN
// ============================================

function startNextPuzzleCountdown() {
  function update() {
    var now = new Date();
    var tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    var diff = tomorrow - now;
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    els.nextTimer.textContent = hours + ":" +
      (minutes < 10 ? "0" : "") + minutes + ":" +
      (seconds < 10 ? "0" : "") + seconds;
  }

  update();
  setInterval(update, 1000);
}
