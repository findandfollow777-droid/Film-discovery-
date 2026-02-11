// ============================================
// CONNECTIONS - Game Logic
// Orbit Games Suite - Find the Common Thread
// ============================================

// Daily puzzles - 4 groups of 4 movies each
// Difficulty: yellow (easiest) → green → blue → purple (hardest)
const DAILY_PUZZLES = [
  // Puzzle 1
  {
    groups: [
      { 
        theme: "Directed by Christopher Nolan",
        difficulty: "yellow",
        movies: ["Inception", "Interstellar", "Tenet", "Dunkirk"]
      },
      {
        theme: "Tom Hanks Films",
        difficulty: "green",
        movies: ["Forrest Gump", "Cast Away", "Big", "The Terminal"]
      },
      {
        theme: "Best Picture Winners (2010s)",
        difficulty: "blue",
        movies: ["Argo", "Birdman", "Spotlight", "Moonlight"]
      },
      {
        theme: "One-Word Titles That Are Names",
        difficulty: "purple",
        movies: ["Rocky", "Amélie", "Juno", "Scarface"]
      }
    ]
  },
  // Puzzle 2
  {
    groups: [
      {
        theme: "Pixar Films",
        difficulty: "yellow",
        movies: ["Toy Story", "Finding Nemo", "Up", "Coco"]
      },
      {
        theme: "Leonardo DiCaprio Films",
        difficulty: "green",
        movies: ["Titanic", "The Revenant", "Shutter Island", "Django Unchained"]
      },
      {
        theme: "Films Set in Space",
        difficulty: "blue",
        movies: ["Gravity", "The Martian", "Apollo 13", "2001: A Space Odyssey"]
      },
      {
        theme: "Movies With Colors in Title",
        difficulty: "purple",
        movies: ["The Green Mile", "Blue Velvet", "Scarlet Street", "The Pink Panther"]
      }
    ]
  },
  // Puzzle 3
  {
    groups: [
      {
        theme: "Marvel Cinematic Universe",
        difficulty: "yellow",
        movies: ["Iron Man", "Black Panther", "Thor", "Ant-Man"]
      },
      {
        theme: "Films by Quentin Tarantino",
        difficulty: "green",
        movies: ["Pulp Fiction", "Kill Bill", "Reservoir Dogs", "Jackie Brown"]
      },
      {
        theme: "Remakes of Foreign Films",
        difficulty: "blue",
        movies: ["The Departed", "The Ring", "Vanilla Sky", "True Lies"]
      },
      {
        theme: "Title Contains a Day of Week",
        difficulty: "purple",
        movies: ["Friday", "Saturday Night Fever", "Any Given Sunday", "Freaky Friday"]
      }
    ]
  },
  // Puzzle 4
  {
    groups: [
      {
        theme: "Studio Ghibli Films",
        difficulty: "yellow",
        movies: ["Spirited Away", "My Neighbor Totoro", "Princess Mononoke", "Howl's Moving Castle"]
      },
      {
        theme: "Brad Pitt Films",
        difficulty: "green",
        movies: ["Fight Club", "Se7en", "Troy", "Moneyball"]
      },
      {
        theme: "Based on Stephen King",
        difficulty: "blue",
        movies: ["The Shining", "Misery", "Stand By Me", "Carrie"]
      },
      {
        theme: "Title is a Question",
        difficulty: "purple",
        movies: ["Who Framed Roger Rabbit", "What Ever Happened to Baby Jane?", "Where the Wild Things Are", "How to Train Your Dragon"]
      }
    ]
  },
  // Puzzle 5
  {
    groups: [
      {
        theme: "James Bond Films",
        difficulty: "yellow",
        movies: ["Skyfall", "Casino Royale", "GoldenEye", "Spectre"]
      },
      {
        theme: "Meryl Streep Films",
        difficulty: "green",
        movies: ["The Devil Wears Prada", "Mamma Mia!", "Sophie's Choice", "Kramer vs. Kramer"]
      },
      {
        theme: "Score by Hans Zimmer",
        difficulty: "blue",
        movies: ["Gladiator", "The Dark Knight", "Pirates of the Caribbean", "The Lion King"]
      },
      {
        theme: "Title Contains Body Part",
        difficulty: "purple",
        movies: ["Edward Scissorhands", "The Iron Fist", "Footloose", "Face/Off"]
      }
    ]
  },
  // Puzzle 6
  {
    groups: [
      {
        theme: "Wes Anderson Films",
        difficulty: "yellow",
        movies: ["The Grand Budapest Hotel", "Moonrise Kingdom", "Fantastic Mr. Fox", "The Royal Tenenbaums"]
      },
      {
        theme: "Morgan Freeman Films",
        difficulty: "green",
        movies: ["The Shawshank Redemption", "Million Dollar Baby", "Bruce Almighty", "Driving Miss Daisy"]
      },
      {
        theme: "Filmed in One Take (or Appears So)",
        difficulty: "blue",
        movies: ["1917", "Birdman", "Victoria", "Russian Ark"]
      },
      {
        theme: "Title is a Year",
        difficulty: "purple",
        movies: ["1984", "2012", "300", "1492: Conquest of Paradise"]
      }
    ]
  },
  // Puzzle 7
  {
    groups: [
      {
        theme: "Disney Animated Classics",
        difficulty: "yellow",
        movies: ["The Lion King", "Aladdin", "Beauty and the Beast", "The Little Mermaid"]
      },
      {
        theme: "Scarlett Johansson Films",
        difficulty: "green",
        movies: ["Lost in Translation", "Her", "Marriage Story", "Jojo Rabbit"]
      },
      {
        theme: "Directed by Denis Villeneuve",
        difficulty: "blue",
        movies: ["Arrival", "Blade Runner 2049", "Dune", "Sicario"]
      },
      {
        theme: "Title Contains Number Higher Than 10",
        difficulty: "purple",
        movies: ["Apollo 13", "Ocean's Eleven", "21 Jump Street", "The Dirty Dozen"]
      }
    ]
  }
];

// Game state
let gameState = {
  puzzle: null,
  allMovies: [],
  selectedMovies: [],
  solvedGroups: [],
  mistakes: 0,
  maxMistakes: 4,
  gameOver: false,
  won: false,
  puzzleNumber: 1,
  guessHistory: [] // For share feature
};

// DOM Elements
let movieGrid, solvedGroups, mistakesDots;
let shuffleBtn, deselectBtn, submitBtn;
let resultSection, notification;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadDailyPuzzle();
});

function cacheElements() {
  movieGrid = document.getElementById("movieGrid");
  solvedGroups = document.getElementById("solvedGroups");
  mistakesDots = document.getElementById("mistakesDots");
  
  shuffleBtn = document.getElementById("shuffleBtn");
  deselectBtn = document.getElementById("deselectBtn");
  submitBtn = document.getElementById("submitBtn");
  
  resultSection = document.getElementById("resultSection");
  notification = document.getElementById("notification");
}

function setupEventListeners() {
  shuffleBtn.addEventListener("click", shuffleGrid);
  deselectBtn.addEventListener("click", deselectAll);
  submitBtn.addEventListener("click", submitGuess);
  
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
  return dayNumber % DAILY_PUZZLES.length;
}

function loadDailyPuzzle() {
  // Check for saved state
  const savedState = loadTodayState();
  if (savedState) {
    gameState = savedState;
    renderFromState();
    if (gameState.gameOver) {
      showResult();
    }
    return;
  }
  
  const puzzleIndex = getDailyPuzzleIndex();
  gameState.puzzle = DAILY_PUZZLES[puzzleIndex];
  gameState.puzzleNumber = puzzleIndex + 1;
  
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  
  // Collect all movies and shuffle
  gameState.allMovies = [];
  gameState.puzzle.groups.forEach(group => {
    group.movies.forEach(movie => {
      gameState.allMovies.push({
        title: movie,
        group: group.theme,
        difficulty: group.difficulty
      });
    });
  });
  
  shuffleArray(gameState.allMovies);
  renderGrid();
}

function renderFromState() {
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;
  renderGrid();
  renderSolvedGroups();
  updateMistakesDisplay();
}

// ============================================
// RENDERING
// ============================================

function renderGrid() {
  // Filter out solved movies
  const solvedTitles = gameState.solvedGroups.flatMap(g => g.movies);
  const remainingMovies = gameState.allMovies.filter(m => !solvedTitles.includes(m.title));
  
  movieGrid.innerHTML = remainingMovies.map(movie => `
    <div class="movie-tile ${gameState.selectedMovies.includes(movie.title) ? 'selected' : ''}" 
         data-title="${movie.title}">
      <span class="tile-title">${movie.title}</span>
    </div>
  `).join("");
  
  // Add click handlers
  movieGrid.querySelectorAll(".movie-tile").forEach(tile => {
    tile.addEventListener("click", () => toggleSelection(tile.dataset.title));
  });
}

function renderSolvedGroups() {
  solvedGroups.innerHTML = gameState.solvedGroups.map(group => `
    <div class="solved-group ${group.difficulty}">
      <div class="solved-group-title">${group.theme}</div>
      <div class="solved-group-movies">${group.movies.join(", ")}</div>
    </div>
  `).join("");
}

function updateMistakesDisplay() {
  const dots = mistakesDots.querySelectorAll(".mistake-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("used", i < gameState.mistakes);
  });
}

// ============================================
// GAME LOGIC
// ============================================

function toggleSelection(title) {
  if (gameState.gameOver) return;
  
  const index = gameState.selectedMovies.indexOf(title);
  
  if (index > -1) {
    // Deselect
    gameState.selectedMovies.splice(index, 1);
  } else if (gameState.selectedMovies.length < 4) {
    // Select
    gameState.selectedMovies.push(title);
  }
  
  renderGrid();
  updateButtons();
}

function updateButtons() {
  deselectBtn.disabled = gameState.selectedMovies.length === 0;
  submitBtn.disabled = gameState.selectedMovies.length !== 4;
}

function deselectAll() {
  gameState.selectedMovies = [];
  renderGrid();
  updateButtons();
}

function shuffleGrid() {
  const solvedTitles = gameState.solvedGroups.flatMap(g => g.movies);
  const remaining = gameState.allMovies.filter(m => !solvedTitles.includes(m.title));
  shuffleArray(remaining);
  
  // Update allMovies with shuffled order
  gameState.allMovies = [
    ...gameState.allMovies.filter(m => solvedTitles.includes(m.title)),
    ...remaining
  ];
  
  renderGrid();
}

function submitGuess() {
  if (gameState.selectedMovies.length !== 4 || gameState.gameOver) return;
  
  // Check if selection matches any group
  const selected = [...gameState.selectedMovies].sort();
  let matchedGroup = null;
  
  for (const group of gameState.puzzle.groups) {
    const groupMovies = [...group.movies].sort();
    if (arraysEqual(selected, groupMovies)) {
      matchedGroup = group;
      break;
    }
  }
  
  // Record guess for share feature
  const difficultyOrder = ['yellow', 'green', 'blue', 'purple'];
  const guessResult = matchedGroup 
    ? difficultyOrder.indexOf(matchedGroup.difficulty)
    : -1;
  gameState.guessHistory.push(guessResult);
  
  if (matchedGroup) {
    // Correct!
    handleCorrectGuess(matchedGroup);
  } else {
    // Wrong
    handleWrongGuess();
  }
  
  saveTodayState();
}

function handleCorrectGuess(group) {
  // Animate tiles
  const tiles = movieGrid.querySelectorAll(".movie-tile");
  tiles.forEach(tile => {
    if (gameState.selectedMovies.includes(tile.dataset.title)) {
      tile.classList.add("correct");
    }
  });
  
  setTimeout(() => {
    // Add to solved
    gameState.solvedGroups.push({
      theme: group.theme,
      difficulty: group.difficulty,
      movies: [...group.movies]
    });
    
    // Clear selection
    gameState.selectedMovies = [];
    
    // Check win
    if (gameState.solvedGroups.length === 4) {
      gameState.won = true;
      gameState.gameOver = true;
      saveStats();
      showResult();
    } else {
      renderGrid();
      renderSolvedGroups();
      updateButtons();
    }
  }, 400);
}

function handleWrongGuess() {
  // Check for "one away"
  let oneAway = false;
  for (const group of gameState.puzzle.groups) {
    const matches = gameState.selectedMovies.filter(m => group.movies.includes(m)).length;
    if (matches === 3) {
      oneAway = true;
      break;
    }
  }
  
  if (oneAway) {
    showNotification("One away!");
  }
  
  // Shake animation
  const tiles = movieGrid.querySelectorAll(".movie-tile.selected");
  tiles.forEach(tile => {
    tile.classList.add("shake");
    setTimeout(() => tile.classList.remove("shake"), 400);
  });
  
  // Increment mistakes
  gameState.mistakes++;
  updateMistakesDisplay();
  
  // Check game over
  if (gameState.mistakes >= gameState.maxMistakes) {
    gameState.gameOver = true;
    gameState.won = false;
    
    // Reveal all groups
    revealAllGroups();
    saveStats();
    
    setTimeout(() => showResult(), 1000);
  }
}

function revealAllGroups() {
  // Add remaining groups to solved
  gameState.puzzle.groups.forEach(group => {
    if (!gameState.solvedGroups.find(g => g.theme === group.theme)) {
      gameState.solvedGroups.push({
        theme: group.theme,
        difficulty: group.difficulty,
        movies: [...group.movies]
      });
    }
  });
  
  renderSolvedGroups();
  movieGrid.innerHTML = "";
}

// ============================================
// RESULT
// ============================================

function showResult() {
  resultSection.hidden = false;
  
  const resultIcon = document.getElementById("resultIcon");
  const resultTitle = document.getElementById("resultTitle");
  
  if (gameState.won) {
    resultIcon.textContent = gameState.mistakes === 0 ? "🏆" : "🎉";
    resultTitle.textContent = gameState.mistakes === 0 ? "Perfect!" : "Puzzle Complete!";
  } else {
    resultIcon.textContent = "😔";
    resultTitle.textContent = "Better Luck Tomorrow!";
  }
  
  document.getElementById("mistakesMade").textContent = gameState.mistakes;
  
  // Show all groups
  const resultGroups = document.getElementById("resultGroups");
  const sortedGroups = [...gameState.solvedGroups].sort((a, b) => {
    const order = ['yellow', 'green', 'blue', 'purple'];
    return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
  });
  
  resultGroups.innerHTML = sortedGroups.map(group => `
    <div class="result-group ${group.difficulty}">
      <div class="result-group-title">${group.theme}</div>
      <div class="result-group-movies">${group.movies.join(", ")}</div>
    </div>
  `).join("");
  
  startNextPuzzleCountdown();

  // Enable post-game clickable links
  enablePostGameLinks();
}

function enablePostGameLinks() {
  // Make movie titles in result groups clickable
  document.querySelectorAll('.result-group-movies').forEach(el => {
    const movies = el.textContent.split(', ').map(t => t.trim());
    el.classList.add('clickable-movies');
    el.innerHTML = movies.map(title =>
      `<span class="result-movie-link" data-title="${title.replace(/"/g, '&quot;')}">${title}</span>`
    ).join(', ');
  });

  document.querySelectorAll('.result-movie-link').forEach(link => {
    link.addEventListener('click', async () => {
      const title = link.dataset.title;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const movie = data.results[0];
          localStorage.setItem("singleMovie", JSON.stringify({ id: movie.id, title: movie.title }));
          localStorage.setItem("resultsMode", "single");
          window.location.href = 'results.html';
        }
      } catch (err) {
        console.error("Error searching movie:", err);
      }
    });
  });

  // Make movie tiles on the game board clickable after game over
  document.querySelectorAll('.movie-tile').forEach(tile => {
    tile.classList.add('clickable-movie');
    const title = tile.textContent.trim();
    tile.addEventListener('click', async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const movie = data.results[0];
          localStorage.setItem("singleMovie", JSON.stringify({ id: movie.id, title: movie.title }));
          localStorage.setItem("resultsMode", "single");
          window.location.href = 'results.html';
        }
      } catch (err) {
        console.error("Error searching movie:", err);
      }
    });
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(text) {
  const notificationText = document.getElementById("notificationText");
  notificationText.textContent = text;
  notification.hidden = false;
  
  setTimeout(() => {
    notification.hidden = true;
  }, 2000);
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("connections_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    wins: 0,
    perfect: 0,
    currentStreak: 0,
    maxStreak: 0
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  
  if (gameState.won) {
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    
    if (gameState.mistakes === 0) {
      stats.perfect++;
    }
  } else {
    stats.currentStreak = 0;
  }
  
  localStorage.setItem("connections_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statWon").textContent = stats.wins;
  document.getElementById("statPerfect").textContent = stats.perfect;
  document.getElementById("statStreak").textContent = stats.currentStreak;
}

// ============================================
// STATE PERSISTENCE
// ============================================

function getTodayKey() {
  const today = new Date();
  return `connections_game_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
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
  const emojis = ['🟨', '🟩', '🟦', '🟪', '⬛'];
  
  // Build emoji grid from guess history
  const emojiGrid = gameState.guessHistory.map(result => {
    return result >= 0 ? emojis[result] : emojis[4];
  }).join("");
  
  // Build row format (groups of what was guessed)
  const lines = [];
  for (let i = 0; i < gameState.guessHistory.length; i += 1) {
    lines.push(gameState.guessHistory.slice(i, i + 1).map(r => r >= 0 ? emojis[r] : emojis[4]).join(""));
  }
  
  const text = `🔗 Connections #${gameState.puzzleNumber}

${lines.join("\n")}

${gameState.won ? "Solved!" : "Failed"} ${gameState.mistakes}/4 mistakes

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
    const actionBtns = document.querySelector('.action-buttons');
    actionBtns.appendChild(btn);
  }
});

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}