// ============================================
// TENTH STAR - Game Engine
// Orbit Games Suite
// ============================================

(() => {
  // ============================================
  // CONSTANTS
  // ============================================
  const STATES = {
    GUESS: "GUESS",
    PICK_TILE: "PICK_TILE",
    TILE_QUESTION: "TILE_QUESTION",
    TILE_RETRY: "TILE_RETRY",
    FINAL_GUESS: "FINAL_GUESS",
    WON: "WON",
    LOST: "LOST",
    POSTGAME: "POSTGAME"
  };

  const STAR_TIERS = [
    { maxRound: 1, stars: 5, label: "LEGENDARY" },
    { maxRound: 3, stars: 4, label: "BRILLIANT" },
    { maxRound: 5, stars: 3, label: "GREAT" },
    { maxRound: 7, stars: 2, label: "GOOD" },
    { maxRound: 10, stars: 1, label: "SOLVED" }
  ];

  // ============================================
  // STATE
  // ============================================
  let puzzle = null;
  let gameState = STATES.GUESS;
  let round = 1;
  let tileStates = []; // { status: 'facedown'|'revealed'|'failed'|'locked', failCount: 0 }
  let lastFailedTile = -1;
  let retryUsedThisRound = false;
  let tilesFlipped = 0;
  let tileQuestionsCorrect = 0;
  let tileQuestionsAttempted = 0;
  let currentQuestionTile = -1;
  let currentQuestionIndex = 0;
  let isArchive = false;
  let searchTimeout = null;

  // ============================================
  // DOM REFS
  // ============================================
  const $ = id => document.getElementById(id);
  const tileGrid = $("tileGrid");
  const clueText = $("clueText");
  const diffDots = $("diffDots");
  const roundNumber = $("roundNumber");
  const statusMessage = $("statusMessage");
  const guessArea = $("guessArea");
  const guessInput = $("guessInput");
  const guessSubmit = $("guessSubmit");
  const guessFeedback = $("guessFeedback");
  const autocompleteDropdown = $("autocompleteDropdown");
  const pickTilePrompt = $("pickTilePrompt");
  const retryPrompt = $("retryPrompt");
  const retryTileNum = $("retryTileNum");
  const retryBtn = $("retryBtn");
  const skipRetryBtn = $("skipRetryBtn");
  const prevCluesList = $("prevCluesList");
  const clueSection = $("clueSection");
  const categoryReveal = $("categoryReveal");
  const categoryLabel = $("categoryLabel");
  const categoryHidden = $("categoryHidden");

  // Modals
  const tileQuestionModal = $("tileQuestionModal");
  const questionFormatTag = $("questionFormatTag");
  const questionText = $("questionText");
  const questionOptions = $("questionOptions");
  const questionResult = $("questionResult");
  const resultText = $("resultText");
  const continueBtn = $("continueBtn");

  // Result overlay
  const resultOverlay = $("resultOverlay");
  const resultEmoji = $("resultEmoji");
  const resultTitle = $("resultTitle");
  const resultMovie = $("resultMovie");
  const resultStars = $("resultStars");
  const rsRound = $("rsRound");
  const rsTiles = $("rsTiles");
  const rsAccuracy = $("rsAccuracy");
  const shareBtn = $("shareBtn");
  const viewBoardBtn = $("viewBoardBtn");
  const shareToast = $("shareToast");

  // Help / Stats
  const helpBtn = $("helpBtn");
  const helpModal = $("helpModal");
  const helpClose = $("helpClose");
  const statsBtn = $("statsBtn");
  const statsModal = $("statsModal");
  const statsClose = $("statsClose");

  // Hero poster
  const heroPoster = $("heroPoster");
  const heroPosterImg = $("heroPosterImg");
  const heroTitleOverlay = $("heroTitleOverlay");
  const postgameHint = $("postgameHint");

  // Archive
  const archiveOverlay = $("archiveOverlay");
  const archiveList = $("archiveList");
  const archiveCloseBtn = $("archiveCloseBtn");

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    puzzle = getCurrentPuzzle();
    if (!puzzle) {
      statusMessage.textContent = "No puzzles available.";
      return;
    }

    // Check for saved state
    const saved = loadGameState(puzzle.id);
    if (saved && saved.completed && !isArchive) {
      // Already completed - show result then offer board / archive
      restoreCompleted(saved);
      return;
    } else if (saved && !saved.completed) {
      restoreInProgress(saved);
    } else {
      startFresh();
    }

    bindEvents();
    updateStatsModal();
  }

  function startFresh() {
    round = 1;
    gameState = STATES.GUESS;
    tilesFlipped = 0;
    tileQuestionsCorrect = 0;
    tileQuestionsAttempted = 0;
    lastFailedTile = -1;
    retryUsedThisRound = false;
    tileStates = puzzle.tiles.map(() => ({ status: "facedown", failCount: 0 }));
    renderTiles();
    showClue(round);
    updateUI();
  }

  // ============================================
  // PUZZLE SELECTION
  // ============================================
  function getCurrentPuzzle() {
    const now = new Date();
    const sorted = [...TENTH_STAR_PUZZLES].sort((a, b) => new Date(b.weekOf) - new Date(a.weekOf));
    for (const p of sorted) {
      if (new Date(p.weekOf) <= now) return p;
    }
    return sorted[sorted.length - 1];
  }

  // ============================================
  // TILE RENDERING
  // ============================================
  function renderTiles() {
    tileGrid.innerHTML = "";
    puzzle.tiles.forEach((tile, i) => {
      const el = document.createElement("div");
      el.className = "tile";
      el.dataset.index = i;
      el.innerHTML = `
        <div class="tile-inner">
          <div class="tile-front">
            <div class="tile-ring-outer"></div>
            <div class="tile-ring-inner"></div>
            <span class="tile-number">${i + 1}</span>
          </div>
          <div class="tile-back">
            <img src="${TMDB_IMG}w342${tile.posterPath}" alt="${tile.title}" loading="lazy">
            <div class="tile-title-overlay">${tile.title}</div>
          </div>
        </div>
      `;
      el.addEventListener("click", () => onTileClick(i));
      tileGrid.appendChild(el);
    });
    syncTileClasses();
  }

  function syncTileClasses() {
    const tiles = tileGrid.querySelectorAll(".tile");
    tiles.forEach((el, i) => {
      const state = tileStates[i];
      el.className = "tile";
      if (state.status === "revealed") {
        el.classList.add("flipped");
        if (gameState === STATES.POSTGAME) el.classList.add("clickable");
      } else if (state.status === "failed") {
        el.classList.add("failed");
        if (gameState === STATES.PICK_TILE) el.classList.add("selectable");
      } else if (state.status === "locked") {
        el.classList.add("locked");
      } else {
        // facedown
        if (gameState === STATES.PICK_TILE) el.classList.add("selectable");
      }
    });
  }

  // ============================================
  // CLUE DISPLAY
  // ============================================
  function showClue(r) {
    const clueIndex = r - 1;
    const clue = puzzle.tenthStar.clues[clueIndex];
    clueText.textContent = clue;
    roundNumber.textContent = r;

    // Difficulty dots (10 dots, more filled = harder = lower round number)
    diffDots.innerHTML = "";
    const filled = 11 - r; // round 1 = 10 filled, round 10 = 1 filled
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement("span");
      dot.className = "diff-dot" + (i < filled ? " filled" : "");
      diffDots.appendChild(dot);
    }
  }

  function addPrevClue(r, text) {
    const li = document.createElement("li");
    li.className = "prev-clue-item";
    li.innerHTML = `<span class="prev-clue-round">R${r}</span>${text}`;
    prevCluesList.prepend(li);
  }

  // ============================================
  // UI STATE MANAGEMENT
  // ============================================
  function updateUI() {
    // Hide all conditional panels
    guessArea.hidden = true;
    pickTilePrompt.hidden = true;
    retryPrompt.hidden = true;
    guessFeedback.hidden = true;

    switch (gameState) {
      case STATES.GUESS:
        guessArea.hidden = false;
        guessInput.value = "";
        guessInput.disabled = false;
        guessSubmit.disabled = false;
        statusMessage.textContent = "Name the missing movie from this Top 10 list";
        guessInput.focus();
        break;

      case STATES.PICK_TILE:
        pickTilePrompt.hidden = false;
        statusMessage.textContent = "Pick a face-down tile to reveal a clue";
        syncTileClasses();
        break;

      case STATES.FINAL_GUESS:
        guessArea.hidden = false;
        guessInput.value = "";
        guessInput.disabled = false;
        guessSubmit.disabled = false;
        statusMessage.textContent = "Final guess! This is your last chance.";
        guessInput.focus();
        break;

      case STATES.WON:
      case STATES.LOST:
        showResult();
        break;

      case STATES.POSTGAME:
        break;
    }
  }

  function checkForRetry() {
    if (lastFailedTile >= 0 && !retryUsedThisRound && tileStates[lastFailedTile].status === "failed") {
      retryPrompt.hidden = false;
      retryTileNum.textContent = lastFailedTile + 1;
      guessArea.hidden = true;
      return true;
    }
    return false;
  }

  // ============================================
  // GUESS HANDLING
  // ============================================
  function onGuess() {
    const val = guessInput.value.trim();
    if (!val) return;

    autocompleteDropdown.hidden = true;

    if (val.toLowerCase() === puzzle.tenthStar.title.toLowerCase()) {
      // CORRECT!
      gameState = STATES.WON;
      saveGameState(true);
      updateStats(true, round);
      updateUI();
    } else {
      // Wrong
      guessFeedback.hidden = false;
      guessFeedback.className = "guess-feedback wrong";
      guessFeedback.textContent = `"${val}" is not correct.`;
      guessInput.disabled = true;
      guessSubmit.disabled = true;

      if (gameState === STATES.FINAL_GUESS) {
        // Lost on final guess
        gameState = STATES.LOST;
        saveGameState(false);
        updateStats(false, round);
        setTimeout(() => updateUI(), 1500);
      } else {
        // Transition to PICK_TILE
        setTimeout(() => {
          gameState = STATES.PICK_TILE;
          updateUI();
        }, 1500);
      }
    }
  }

  // ============================================
  // TILE CLICK
  // ============================================
  function onTileClick(i) {
    if (gameState === STATES.POSTGAME) {
      // Open movie cube
      if (tileStates[i].status === "revealed") {
        openMovieCube(puzzle.tiles[i].tmdbId);
      }
      return;
    }

    if (gameState !== STATES.PICK_TILE) return;

    const state = tileStates[i];
    if (state.status === "revealed" || state.status === "locked") return;

    // Pick this tile - show question
    currentQuestionTile = i;
    currentQuestionIndex = 0; // first question
    gameState = STATES.TILE_QUESTION;
    showTileQuestion(i, 0);
  }

  // ============================================
  // TILE QUESTION MODAL
  // ============================================
  function showTileQuestion(tileIndex, qIndex) {
    const tile = puzzle.tiles[tileIndex];
    const q = tile.questions[qIndex];

    questionFormatTag.textContent = q.format === "A" ? "NAME THIS FILM" : "TRUE OR FALSE";
    questionText.textContent = q.text;
    questionResult.hidden = true;

    // Render options
    questionOptions.innerHTML = "";
    q.options.forEach((opt, oi) => {
      const btn = document.createElement("button");
      btn.className = "q-option";
      btn.textContent = opt;
      btn.addEventListener("click", () => onAnswerQuestion(tileIndex, qIndex, oi));
      questionOptions.appendChild(btn);
    });

    tileQuestionModal.hidden = false;
  }

  function onAnswerQuestion(tileIndex, qIndex, selectedIndex) {
    const tile = puzzle.tiles[tileIndex];
    const q = tile.questions[qIndex];
    const correct = selectedIndex === q.correct;

    tileQuestionsAttempted++;

    // Disable all options
    const options = questionOptions.querySelectorAll(".q-option");
    options.forEach((btn, i) => {
      btn.classList.add("disabled");
      if (i === q.correct) btn.classList.add("correct");
      if (i === selectedIndex && !correct) btn.classList.add("wrong");
    });

    // Show result
    questionResult.hidden = false;
    if (correct) {
      tileQuestionsCorrect++;
      resultText.textContent = "Correct!";
      resultText.className = "result-text correct-text";
    } else {
      resultText.textContent = "Wrong answer.";
      resultText.className = "result-text wrong-text";
    }

    // Set up continue handler
    continueBtn.onclick = () => {
      tileQuestionModal.hidden = true;
      handleQuestionResult(tileIndex, correct);
    };
  }

  function handleQuestionResult(tileIndex, correct) {
    if (correct) {
      // Tile flips to reveal
      tileStates[tileIndex].status = "revealed";
      tilesFlipped++;
      if (tileIndex === lastFailedTile) lastFailedTile = -1;
      flipTile(tileIndex);
      advanceRound();
    } else {
      // Tile failed
      tileStates[tileIndex].failCount++;
      if (tileStates[tileIndex].failCount >= 2) {
        tileStates[tileIndex].status = "locked";
        if (lastFailedTile === tileIndex) lastFailedTile = -1;
      } else {
        tileStates[tileIndex].status = "failed";
        lastFailedTile = tileIndex;
      }
      syncTileClasses();
      advanceRound();
    }
  }

  function flipTile(i) {
    const tiles = tileGrid.querySelectorAll(".tile");
    tiles[i].classList.add("flipped");
    syncTileClasses();
  }

  // ============================================
  // ROUND ADVANCEMENT
  // ============================================
  function advanceRound() {
    // Save current clue to history
    addPrevClue(round, puzzle.tenthStar.clues[round - 1]);

    round++;
    retryUsedThisRound = false;

    if (round > 9) {
      // Final guess with clue 10
      round = 10;
      showClue(10);
      gameState = STATES.FINAL_GUESS;
      updateUI();
      return;
    }

    showClue(round);
    gameState = STATES.GUESS;

    // Check for retry opportunity before guess
    if (!checkForRetry()) {
      updateUI();
    }

    saveProgress();
  }

  // ============================================
  // RETRY MECHANIC
  // ============================================
  function onRetry() {
    if (lastFailedTile < 0) return;
    retryUsedThisRound = true;
    retryPrompt.hidden = true;

    currentQuestionTile = lastFailedTile;
    currentQuestionIndex = 1; // second (easier) question
    gameState = STATES.TILE_RETRY;
    showTileQuestion(lastFailedTile, 1);
  }

  function onSkipRetry() {
    retryPrompt.hidden = true;
    gameState = STATES.GUESS;
    updateUI();
  }

  // ============================================
  // RESULT SCREEN
  // ============================================
  function showResult() {
    const won = gameState === STATES.WON;
    const tier = getTier(won ? round : -1);

    resultEmoji.textContent = won ? "⭐" : "💫";
    resultTitle.textContent = won ? tier.label : "NOT THIS TIME";
    resultMovie.textContent = puzzle.tenthStar.title;

    if (won) {
      resultStars.textContent = "★".repeat(tier.stars) + "☆".repeat(5 - tier.stars);
    } else {
      resultStars.textContent = "☆☆☆☆☆";
    }

    rsRound.textContent = won ? round : "—";
    rsTiles.textContent = tilesFlipped;
    rsAccuracy.textContent = tileQuestionsAttempted > 0
      ? Math.round((tileQuestionsCorrect / tileQuestionsAttempted) * 100) + "%"
      : "—";

    resultOverlay.hidden = false;
  }

  function getTier(solvedRound) {
    if (solvedRound < 0) return { stars: 0, label: "UNSOLVED" };
    for (const t of STAR_TIERS) {
      if (solvedRound <= t.maxRound) return t;
    }
    return STAR_TIERS[STAR_TIERS.length - 1];
  }

  // ============================================
  // SHARE
  // ============================================
  function onShare() {
    const won = gameState === STATES.WON || gameState === STATES.POSTGAME;
    const tier = getTier(won ? round : -1);
    const starStr = won ? "★".repeat(tier.stars) + "☆".repeat(5 - tier.stars) : "☆☆☆☆☆";

    let grid = "";
    tileStates.forEach(ts => {
      if (ts.status === "revealed") grid += "🟨";
      else if (ts.status === "locked") grid += "🟥";
      else if (ts.status === "failed") grid += "🟧";
      else grid += "⬛";
    });
    // Format as 3x3
    const row1 = grid.substring(0, 3);
    const row2 = grid.substring(3, 6);
    const row3 = grid.substring(6, 9);

    const archiveTag = isArchive ? " (ARCHIVE)" : "";
    const text = [
      `⭐ Tenth Star${archiveTag}`,
      `${puzzle.category.label} — ${puzzle.category.hidden}`,
      ``,
      `${starStr}`,
      won ? `Solved in round ${round}` : "Not solved",
      ``,
      row1,
      row2,
      row3,
      ``,
      `Tiles: ${tilesFlipped}/9 | Accuracy: ${tileQuestionsAttempted > 0 ? Math.round((tileQuestionsCorrect / tileQuestionsAttempted) * 100) + "%" : "—"}`
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      shareToast.hidden = false;
      setTimeout(() => { shareToast.hidden = true; }, 2500);
    });
  }

  // ============================================
  // VIEW BOARD (Post-game)
  // ============================================
  function onViewBoard() {
    resultOverlay.hidden = true;
    gameState = STATES.POSTGAME;

    // Collapse to single column
    document.querySelector(".game-main").classList.add("postgame-mode");

    // Reveal category
    categoryLabel.textContent = puzzle.category.label;
    categoryHidden.textContent = "— " + puzzle.category.hidden;
    categoryReveal.hidden = false;

    // Cascade flip all tiles
    const tiles = tileGrid.querySelectorAll(".tile");
    tiles.forEach((el, i) => {
      tileStates[i].status = "revealed";
      el.style.setProperty("--cascade-delay", `${i * 150}ms`);
      el.classList.add("cascade-flip");
      setTimeout(() => {
        el.classList.add("flipped", "clickable");
      }, 50);
    });

    // Show hero poster after cascade
    const cascadeTime = tiles.length * 150 + 600;
    setTimeout(() => {
      heroPoster.hidden = false;
      heroPosterImg.src = `${TMDB_IMG}w500${puzzle.tenthStar.posterPath}`;
      heroTitleOverlay.textContent = puzzle.tenthStar.title;
      setTimeout(() => {
        heroPoster.classList.add("flipped", "clickable");
        heroPoster.addEventListener("click", () => {
          openMovieCube(puzzle.tenthStar.tmdbId);
        });
      }, 100);
      postgameHint.hidden = false;
    }, cascadeTime);

    syncTileClasses();
  }

  // ============================================
  // TMDB AUTOCOMPLETE
  // ============================================
  function onSearchInput() {
    const query = guessInput.value.trim();
    if (query.length < 2) {
      autocompleteDropdown.hidden = true;
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`)
        .then(r => r.json())
        .then(data => {
          const results = (data.results || []).slice(0, 6);
          if (results.length === 0) {
            autocompleteDropdown.hidden = true;
            return;
          }
          autocompleteDropdown.innerHTML = "";
          results.forEach(m => {
            const item = document.createElement("div");
            item.className = "ac-item";
            const posterHtml = m.poster_path
              ? `<img src="${TMDB_IMG}w92${m.poster_path}" alt="">`
              : `<div class="ac-item-no-poster">?</div>`;
            item.innerHTML = `${posterHtml}<span class="ac-item-title">${m.title}</span>`;
            item.addEventListener("click", () => {
              guessInput.value = m.title;
              autocompleteDropdown.hidden = true;
              onGuess();
            });
            autocompleteDropdown.appendChild(item);
          });
          autocompleteDropdown.hidden = false;
        })
        .catch(() => {
          autocompleteDropdown.hidden = true;
        });
    }, 300);
  }

  // ============================================
  // LOCALSTORAGE
  // ============================================
  function saveProgress() {
    const state = {
      puzzleId: puzzle.id,
      completed: false,
      round,
      tileStates: tileStates.map(ts => ({ status: ts.status, failCount: ts.failCount })),
      lastFailedTile,
      tilesFlipped,
      tileQuestionsCorrect,
      tileQuestionsAttempted,
      prevClues: Array.from(prevCluesList.children).map(li => li.innerHTML)
    };
    localStorage.setItem(`orbit_tenth_star_${puzzle.id}`, JSON.stringify(state));
  }

  function saveGameState(won) {
    const state = {
      puzzleId: puzzle.id,
      completed: true,
      won,
      round,
      tileStates: tileStates.map(ts => ({ status: ts.status, failCount: ts.failCount })),
      tilesFlipped,
      tileQuestionsCorrect,
      tileQuestionsAttempted,
      isArchive
    };
    localStorage.setItem(`orbit_tenth_star_${puzzle.id}`, JSON.stringify(state));
  }

  function loadGameState(puzzleId) {
    const stored = localStorage.getItem(`orbit_tenth_star_${puzzleId}`);
    return stored ? JSON.parse(stored) : null;
  }

  function restoreInProgress(saved) {
    round = saved.round;
    tileStates = saved.tileStates;
    lastFailedTile = saved.lastFailedTile;
    tilesFlipped = saved.tilesFlipped;
    tileQuestionsCorrect = saved.tileQuestionsCorrect;
    tileQuestionsAttempted = saved.tileQuestionsAttempted;
    gameState = STATES.GUESS;
    renderTiles();
    showClue(round);

    // Restore prev clues
    if (saved.prevClues) {
      saved.prevClues.forEach(html => {
        const li = document.createElement("li");
        li.className = "prev-clue-item";
        li.innerHTML = html;
        prevCluesList.appendChild(li);
      });
    }

    updateUI();
  }

  function restoreCompleted(saved) {
    round = saved.round;
    tileStates = saved.tileStates;
    tilesFlipped = saved.tilesFlipped;
    tileQuestionsCorrect = saved.tileQuestionsCorrect;
    tileQuestionsAttempted = saved.tileQuestionsAttempted;
    gameState = saved.won ? STATES.WON : STATES.LOST;
    renderTiles();
    showClue(round);
    updateUI();
  }

  // ============================================
  // STATS
  // ============================================
  function updateStats(won, solvedRound) {
    const stats = getStats();
    stats.played++;
    if (won) {
      stats.won++;
      stats.currentStreak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
      stats.currentStreak = 0;
    }
    if (isArchive) {
      stats.archivedPlayed = (stats.archivedPlayed || 0) + 1;
      if (won) stats.archivedWon = (stats.archivedWon || 0) + 1;
    }
    localStorage.setItem("orbit_tenth_star_stats", JSON.stringify(stats));
    updateStatsModal();
  }

  function getStats() {
    const stored = localStorage.getItem("orbit_tenth_star_stats");
    return stored ? JSON.parse(stored) : {
      played: 0, won: 0, currentStreak: 0, maxStreak: 0,
      archivedPlayed: 0, archivedWon: 0
    };
  }

  function updateStatsModal() {
    const stats = getStats();
    $("statPlayed").textContent = stats.played;
    $("statWon").textContent = stats.won;
    $("statWinPct").textContent = stats.played > 0
      ? Math.round((stats.won / stats.played) * 100) + "%" : "0%";
    $("statStreak").textContent = stats.currentStreak;
  }

  // ============================================
  // ARCHIVE
  // ============================================
  function showArchive() {
    archiveList.innerHTML = "";
    TENTH_STAR_PUZZLES.forEach(p => {
      const saved = loadGameState(p.id);
      const isCurrent = p.id === puzzle.id;
      const item = document.createElement("div");
      item.className = "archive-item";
      item.innerHTML = `
        <div class="archive-item-info">
          <div class="archive-item-label">${p.category.label} — ${p.category.hidden}</div>
          <div class="archive-item-date">Week of ${p.weekOf}</div>
        </div>
        <span class="archive-item-status ${saved && saved.completed ? 'completed' : 'new'}">
          ${saved && saved.completed ? (saved.won ? 'WON' : 'PLAYED') : (isCurrent ? 'CURRENT' : 'PLAY')}
        </span>
      `;
      if (!isCurrent || (saved && saved.completed)) {
        item.addEventListener("click", () => {
          isArchive = !isCurrent;
          puzzle = p;
          archiveOverlay.hidden = true;
          const archiveSaved = loadGameState(p.id);
          if (archiveSaved && archiveSaved.completed && !isArchive) {
            restoreCompleted(archiveSaved);
          } else {
            // Reset for archive play
            prevCluesList.innerHTML = "";
            document.querySelector(".game-main").classList.remove("postgame-mode");
            categoryReveal.hidden = true;
            heroPoster.hidden = true;
            heroPoster.classList.remove("flipped", "clickable");
            postgameHint.hidden = true;
            resultOverlay.hidden = true;
            startFresh();
          }
        });
      }
      archiveList.appendChild(item);
    });
    archiveOverlay.hidden = false;
  }

  // ============================================
  // EVENT BINDINGS
  // ============================================
  function bindEvents() {
    guessSubmit.addEventListener("click", onGuess);
    guessInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        autocompleteDropdown.hidden = true;
        onGuess();
      }
    });
    guessInput.addEventListener("input", onSearchInput);

    // Close autocomplete on outside click
    document.addEventListener("click", e => {
      if (!guessInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
        autocompleteDropdown.hidden = true;
      }
    });

    retryBtn.addEventListener("click", onRetry);
    skipRetryBtn.addEventListener("click", onSkipRetry);
    shareBtn.addEventListener("click", onShare);
    viewBoardBtn.addEventListener("click", onViewBoard);

    // Help modal
    helpBtn.addEventListener("click", () => { helpModal.hidden = false; });
    helpClose.addEventListener("click", () => { helpModal.hidden = true; });
    helpModal.addEventListener("click", e => { if (e.target === helpModal) helpModal.hidden = true; });

    // Stats modal
    statsBtn.addEventListener("click", () => { statsModal.hidden = false; });
    statsClose.addEventListener("click", () => { statsModal.hidden = true; });
    statsModal.addEventListener("click", e => { if (e.target === statsModal) statsModal.hidden = true; });

    // Archive close
    archiveCloseBtn.addEventListener("click", () => { archiveOverlay.hidden = true; });
  }

})();
