// ============================================
// GAMES ARCADE HUB - Logic
// Orbit Games Suite
// ============================================

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  loadGameStatuses();
  loadAggregateStats();
});

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