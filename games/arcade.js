// ============================================
// GAMES ARCADE HUB - Logic
// Orbit Games Suite
// ============================================

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initRetroSprites();
  loadGameStatuses();
  loadAggregateStats();
  initGameTooltips();
});

/* ============================================================
   GAME CARD HOVER TOOLTIP — Added 2026-05-02
   Shows synopsis + available play modes on .game-card hover.
   Keyed by data-game attribute on each card.
   ============================================================ */

const GAME_INFO = {
  constellation: {
    synopsis: "Five actor photos, one shared movie. Narrow it down in six guesses or fewer using the cast as your only clue.",
    modes: ["daily"]
  },
  collision: {
    synopsis: "Two actors share the screen — name as many of their joint films as you can before the three-minute clock runs out.",
    modes: ["daily"]
  },
  triple: {
    synopsis: "Three actors, seven Venn zones. Place films into the right overlap to prove you know who shared what.",
    modes: ["daily"]
  },
  journeys: {
    synopsis: "Build the shortest chain between two actors using shared films. Beat par to win the round.",
    modes: ["daily", "passandplay", "challenger"]
  },
  connections: {
    synopsis: "Four movies are linked by a single hidden thread — genre, director, era, theme. Find the connection in four guesses.",
    modes: ["daily"]
  },
  screenshot: {
    synopsis: "A single still flashes on screen. Identify the film before the timer expires across rapid-fire rounds.",
    modes: ["daily"]
  },
  sequelshot: {
    synopsis: "Pick which entry in a franchise the scene comes from. Thirty seconds, streak scoring, no second chances.",
    modes: ["daily"]
  },
  "tenth-star": {
    synopsis: "A Top 10 list with one film missing. Spot the gap across nine rounds of curated cinema lists.",
    modes: ["weekly"]
  },
  mastermind: {
    synopsis: "Sixty seconds on your specialist subject — pick a director, franchise, or decade and answer as many as you can.",
    modes: ["challenger"]
  },
  alternate: {
    synopsis: "Weekly 'what if' casting scenarios. Vote on alternate timelines and debate them with the community.",
    modes: ["weekly"]
  }
};

const MODE_LABELS = {
  daily: "Daily",
  passandplay: "Pass & Play",
  challenger: "Challenger",
  weekly: "Weekly"
};

function initGameTooltips() {
  // Skip on touch-only devices — hover doesn't make sense and tap navigates.
  if (window.matchMedia("(hover: none)").matches) return;

  const tooltip = document.createElement("div");
  tooltip.className = "game-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tooltip);

  let activeCard = null;

  const showFor = (card) => {
    const key = card.dataset.game;
    const info = GAME_INFO[key];
    if (!info) return;

    activeCard = card;
    const modePills = info.modes
      .map(m => `<span class="game-tooltip-pill mode-${m}">${MODE_LABELS[m] || m}</span>`)
      .join("");
    tooltip.innerHTML = `
      <p class="game-tooltip-synopsis">${info.synopsis}</p>
      <div class="game-tooltip-modes">${modePills}</div>
    `;
    positionTooltip(card);
    tooltip.classList.add("visible");
    tooltip.setAttribute("aria-hidden", "false");
  };

  const hide = () => {
    activeCard = null;
    tooltip.classList.remove("visible");
    tooltip.setAttribute("aria-hidden", "true");
  };

  const positionTooltip = (card) => {
    const rect = card.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const margin = 12;
    let top = rect.bottom + margin;
    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);

    // Flip above card if it would overflow the viewport bottom.
    if (top + tipRect.height > window.innerHeight - margin) {
      top = rect.top - tipRect.height - margin;
    }
    // Clamp horizontally.
    left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));

    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left}px`;
  };

  document.querySelectorAll(".game-card[data-game]").forEach(card => {
    if (!GAME_INFO[card.dataset.game]) return;
    card.addEventListener("mouseenter", () => showFor(card));
    card.addEventListener("mouseleave", hide);
    card.addEventListener("focus", () => showFor(card));
    card.addEventListener("blur", hide);
  });

  window.addEventListener("scroll", () => {
    if (activeCard) positionTooltip(activeCard);
  }, { passive: true });
}

// ============================================
// RETRO SPRITE BACKGROUND
// ============================================

const SPRITE_TEMPLATES = {
  galaga: `<svg viewBox="0 0 11 13" fill="currentColor"><rect x="5" y="0" width="1" height="1"/><rect x="4" y="1" width="3" height="1"/><rect x="3" y="2" width="5" height="1"/><rect x="0" y="3" width="3" height="2"/><rect x="3" y="3" width="5" height="3"/><rect x="8" y="3" width="3" height="2"/><rect x="1" y="5" width="2" height="3"/><rect x="8" y="5" width="2" height="3"/><rect x="3" y="6" width="2" height="4"/><rect x="6" y="6" width="2" height="4"/><rect x="5" y="9" width="1" height="3"/><rect x="2" y="10" width="2" height="2"/><rect x="7" y="10" width="2" height="2"/></svg>`,
  invader: `<svg viewBox="0 0 11 8" fill="currentColor"><rect x="2" y="0" width="1" height="1"/><rect x="8" y="0" width="1" height="1"/><rect x="3" y="1" width="1" height="1"/><rect x="7" y="1" width="1" height="1"/><rect x="2" y="2" width="7" height="1"/><rect x="1" y="3" width="2" height="1"/><rect x="4" y="3" width="3" height="1"/><rect x="8" y="3" width="2" height="1"/><rect x="0" y="4" width="11" height="1"/><rect x="0" y="5" width="1" height="1"/><rect x="2" y="5" width="7" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="0" y="6" width="1" height="1"/><rect x="2" y="6" width="1" height="1"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="6" y="7" width="2" height="1"/></svg>`,
  arwing: `<svg viewBox="0 0 15 13" fill="currentColor"><rect x="7" y="0" width="1" height="3"/><rect x="6" y="3" width="3" height="2"/><rect x="5" y="5" width="5" height="2"/><rect x="0" y="7" width="4" height="2"/><rect x="4" y="7" width="7" height="3"/><rect x="11" y="7" width="4" height="2"/><rect x="1" y="9" width="3" height="2"/><rect x="11" y="9" width="3" height="2"/><rect x="6" y="10" width="3" height="2"/><rect x="0" y="11" width="2" height="2"/><rect x="13" y="11" width="2" height="2"/></svg>`,
  asteroids: `<svg viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 1 L11 13 L6 9 L1 13 Z"/></svg>`,
  rtype: `<svg viewBox="0 0 14 7" fill="currentColor"><rect x="0" y="2" width="3" height="3"/><rect x="3" y="1" width="4" height="5"/><rect x="7" y="0" width="3" height="7"/><rect x="10" y="2" width="4" height="3"/></svg>`,
  vicviper: `<svg viewBox="0 0 16 9" fill="currentColor"><rect x="0" y="4" width="5" height="1"/><rect x="5" y="3" width="3" height="3"/><rect x="8" y="2" width="4" height="5"/><rect x="12" y="0" width="2" height="3"/><rect x="12" y="6" width="2" height="3"/><rect x="10" y="4" width="6" height="1"/></svg>`,
  defender: `<svg viewBox="0 0 14 5" fill="currentColor"><rect x="0" y="2" width="3" height="1"/><rect x="3" y="1" width="5" height="3"/><rect x="8" y="0" width="4" height="5"/><rect x="12" y="1" width="2" height="3"/></svg>`,
  crosshair: `<svg viewBox="0 0 11 11" fill="currentColor"><rect x="5" y="0" width="1" height="4"/><rect x="5" y="7" width="1" height="4"/><rect x="0" y="5" width="4" height="1"/><rect x="7" y="5" width="4" height="1"/></svg>`,
  centipede: `<svg viewBox="0 0 7 9" fill="currentColor"><rect x="3" y="0" width="1" height="3"/><rect x="2" y="3" width="3" height="2"/><rect x="1" y="5" width="5" height="2"/><rect x="0" y="7" width="7" height="2"/></svg>`,
  ghost: `<svg viewBox="0 0 14 15" fill="currentColor"><rect x="4" y="0" width="6" height="1"/><rect x="2" y="1" width="10" height="1"/><rect x="1" y="2" width="12" height="9"/><rect x="0" y="4" width="14" height="6"/><rect x="0" y="11" width="2" height="2"/><rect x="4" y="11" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/><rect x="12" y="11" width="2" height="2"/><rect x="0" y="13" width="2" height="2"/><rect x="12" y="13" width="2" height="2"/></svg>`
};

const SPRITE_TINTS = ['tint-cyan', 'tint-gold', 'tint-purple', 'tint-orange', 'tint-green', 'tint-pink', 'tint-white'];
const SPRITE_SIZES = ['size-sm', 'size-md', 'size-lg'];
const SPRITE_DEPTHS = ['depth-far', 'depth-far', 'depth-mid', 'depth-mid', 'depth-near'];

function initRetroSprites() {
  const container = document.getElementById('retroSprites');
  if (!container) return;

  const types = Object.keys(SPRITE_TEMPLATES);
  const count = 25;

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const size = SPRITE_SIZES[Math.floor(Math.random() * SPRITE_SIZES.length)];
    const depth = SPRITE_DEPTHS[Math.floor(Math.random() * SPRITE_DEPTHS.length)];
    const tint = SPRITE_TINTS[Math.floor(Math.random() * SPRITE_TINTS.length)];
    const isVertical = Math.random() > 0.7;

    const el = document.createElement('div');
    el.className = `retro-sprite ${type} ${size} ${depth} ${tint}${isVertical ? ' drift-vertical' : ''}`;
    el.innerHTML = SPRITE_TEMPLATES[type];

    if (isVertical) {
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = '-60px';
    } else {
      el.style.top = `${Math.random() * 100}%`;
      el.style.left = '-100px';
    }

    el.style.animationDelay = `${Math.random() * -80}s`;
    container.appendChild(el);
  }
}

// ============================================
// FLOATING PARTICLES
// ============================================

function initParticles() {
  const container = document.getElementById("particles");
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${15 + Math.random() * 15}s`;
    
    // Randomize colors
    const colors = ['#00d9ff', '#ffd700', '#a855f7', '#ff6b35', '#10b981'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
  }
}

// ============================================
// GAME STATUS LOADING
// ============================================

function loadGameStatuses() {
  const today = getTodayKey();
  
  // Check Constellation
  const constellationState = localStorage.getItem(`orbit_game_${today}`);
  if (constellationState) {
    const state = JSON.parse(constellationState);
    const statusEl = document.getElementById("constellationStatus");
    if (state.gameOver) {
      statusEl.textContent = state.won ? "✓ WON" : "PLAYED";
      statusEl.className = "game-status " + (state.won ? "completed" : "");
    } else {
      statusEl.textContent = "IN PROGRESS";
      statusEl.className = "game-status in-progress";
    }
  }
  
  // Check Collision Course
  const collisionState = localStorage.getItem(`collision_game_${today}`);
  if (collisionState) {
    const state = JSON.parse(collisionState);
    const statusEl = document.getElementById("collisionStatus");
    statusEl.textContent = "PLAYED";
    statusEl.className = "game-status completed";
  }
  
  // Check Triple Collision
  const tripleState = localStorage.getItem(`triple_collision_${today}`);
  if (tripleState) {
    const state = JSON.parse(tripleState);
    const statusEl = document.getElementById("tripleStatus");
    statusEl.textContent = "PLAYED";
    statusEl.className = "game-status completed";
  }
  
  // Check Journeys
  const journeysState = localStorage.getItem(`journeys_game_${today}`);
  if (journeysState) {
    const state = JSON.parse(journeysState);
    const statusEl = document.getElementById("journeysStatus");
    if (state.completed) {
      statusEl.textContent = "✓ SOLVED";
      statusEl.className = "game-status completed";
    } else {
      statusEl.textContent = "IN PROGRESS";
      statusEl.className = "game-status in-progress";
    }
  }
  
  // Check Connections
  const connectionsState = localStorage.getItem(`connections_game_${today}`);
  if (connectionsState) {
    const state = JSON.parse(connectionsState);
    const statusEl = document.getElementById("connectionsStatus");
    if (state.solved) {
      statusEl.textContent = "✓ SOLVED";
      statusEl.className = "game-status completed";
    } else if (state.gameOver) {
      statusEl.textContent = "PLAYED";
      statusEl.className = "game-status";
    } else {
      statusEl.textContent = "IN PROGRESS";
      statusEl.className = "game-status in-progress";
    }
  }
  
  // Check Screenshot Speed
  const screenshotState = localStorage.getItem(`screenshot_game_${today}`);
  if (screenshotState) {
    const statusEl = document.getElementById("screenshotStatus");
    statusEl.textContent = "PLAYED";
    statusEl.className = "game-status completed";
  }

  // Check Sequel Shot
  const sequelshotState = localStorage.getItem(`sequelshot_${today}`);
  if (sequelshotState) {
    const statusEl = document.getElementById("sequelshotStatus");
    if (statusEl) {
      const state = JSON.parse(sequelshotState);
      if (state.score === 1000) {
        statusEl.textContent = "\u2713 PERFECT";
      } else {
        statusEl.textContent = "PLAYED";
      }
      statusEl.className = "game-status completed";
    }
  }

  // Check Mastermind
  const mastermindState = localStorage.getItem(`mastermind_game_${today}`);
  if (mastermindState) {
    const state = JSON.parse(mastermindState);
    const statusEl = document.getElementById("mastermindStatus");
    if (statusEl) {
      statusEl.textContent = "PLAYED";
      statusEl.className = "game-status completed";
    }
  }

  // Check Tenth Star
  const tenthStarStats = getStoredStats("orbit_tenth_star_stats");
  if (tenthStarStats && tenthStarStats.played > 0) {
    const statusEl = document.getElementById("tenthStarStatus");
    if (statusEl) {
      statusEl.textContent = "PLAYED";
      statusEl.className = "game-status completed";
    }
  }

  // Check Alternate Universe
  const alternateState = localStorage.getItem(`alternate_game_${today}`);
  if (alternateState) {
    const state = JSON.parse(alternateState);
    const statusEl = document.getElementById("alternateStatus");
    if (statusEl) {
      if (state.completed || state.voted) {
        statusEl.textContent = "PLAYED";
        statusEl.className = "game-status completed";
      } else {
        statusEl.textContent = "IN PROGRESS";
        statusEl.className = "game-status in-progress";
      }
    }
  }
}

// ============================================
// AGGREGATE STATS
// ============================================

function loadAggregateStats() {
  let totalGames = 0;
  let totalScore = 0;
  let totalWins = 0;
  let bestStreak = 0;
  let currentStreak = 0;
  
  // Constellation stats
  const constellationStats = getStoredStats("orbit_game_stats");
  if (constellationStats) {
    totalGames += constellationStats.played || 0;
    totalWins += constellationStats.wins || 0;
    bestStreak = Math.max(bestStreak, constellationStats.maxStreak || 0);
    currentStreak = Math.max(currentStreak, constellationStats.currentStreak || 0);
  }
  
  // Collision stats
  const collisionStats = getStoredStats("collision_stats");
  if (collisionStats) {
    totalGames += collisionStats.played || 0;
    totalScore += collisionStats.totalScore || 0;
    bestStreak = Math.max(bestStreak, collisionStats.bestStreak || 0);
  }
  
  // Triple Collision stats
  const tripleStats = getStoredStats("triple_collision_stats");
  if (tripleStats) {
    totalGames += tripleStats.played || 0;
    totalScore += tripleStats.totalScore || 0;
  }
  
  // Journeys stats
  const journeysStats = getStoredStats("journeys_stats");
  if (journeysStats) {
    totalGames += journeysStats.played || 0;
    totalWins += journeysStats.solved || 0;
  }
  
  // Connections stats
  const connectionsStats = getStoredStats("connections_stats");
  if (connectionsStats) {
    totalGames += connectionsStats.played || 0;
    totalWins += connectionsStats.wins || 0;
  }
  
  // Screenshot stats
  const screenshotStats = getStoredStats("screenshot_stats");
  if (screenshotStats) {
    totalGames += screenshotStats.played || 0;
    totalScore += screenshotStats.totalScore || 0;
  }
  
  // Mastermind stats
  const mastermindStats = getStoredStats("mastermind_stats");
  if (mastermindStats) {
    totalGames += mastermindStats.played || 0;
    totalScore += mastermindStats.totalScore || 0;
  }

  // Tenth Star stats
  const tenthStarStatsAgg = getStoredStats("orbit_tenth_star_stats");
  if (tenthStarStatsAgg) {
    totalGames += tenthStarStatsAgg.played || 0;
    totalWins += tenthStarStatsAgg.won || 0;
    bestStreak = Math.max(bestStreak, tenthStarStatsAgg.maxStreak || 0);
  }

  // Alternate Universe stats
  const alternateStats = getStoredStats("alternate_stats");
  if (alternateStats) {
    totalGames += alternateStats.played || 0;
  }

  // Update UI
  document.getElementById("gamesPlayed").textContent = totalGames;
  document.getElementById("totalScore").textContent = formatNumber(totalScore);
  document.getElementById("winRate").textContent = totalGames > 0 
    ? Math.round((totalWins / totalGames) * 100) + "%" 
    : "0%";
  document.getElementById("bestStreak").textContent = bestStreak;
  document.getElementById("totalStreak").textContent = currentStreak;
}

function getStoredStats(key) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

// ============================================
// UTILITIES
// ============================================

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}