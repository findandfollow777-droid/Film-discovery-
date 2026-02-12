// ============================================
// PROFILE PAGE - Orbit
// ============================================

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

const GAME_REGISTRY = [
  {
    key: "orbit_game_stats", name: "Constellation", color: "#ffd700",
    href: "games/game.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: s.wins || 0, points: 0, extra: s.maxStreak ? `Best streak: ${s.maxStreak}` : null })
  },
  {
    key: "collision_stats", name: "Collision Course", color: "#ff6b35",
    href: "games/collision.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: 0, points: s.totalScore || 0, extra: s.bestScore ? `Best score: ${s.bestScore}` : null })
  },
  {
    key: "triple_collision_stats", name: "Triple Collision", color: "#a855f7",
    href: "games/triple-collision.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4.5"/><circle cx="7" cy="15" r="4.5"/><circle cx="17" cy="15" r="4.5"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: 0, points: s.totalScore || 0, extra: s.bestScore ? `Best score: ${s.bestScore}` : null })
  },
  {
    key: "journeys_stats", name: "Journeys", color: "#14b8a6",
    href: "games/journeys.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="20" cy="12" r="2.5"/><rect x="6" y="11" width="4" height="2" rx="1"/><rect x="14" y="11" width="4" height="2" rx="1"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: s.solved || 0, points: 0, extra: s.underPar ? `Under par: ${s.underPar}` : null })
  },
  {
    key: "connections_stats", name: "Connections", color: "#ec4899",
    href: "games/connections.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: s.wins || 0, points: 0, extra: null })
  },
  {
    key: "screenshot_stats", name: "Screenshot Speed", color: "#f59e0b",
    href: "games/screenshot.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: 0, points: s.totalScore || 0, extra: s.bestScore ? `Best score: ${s.bestScore}` : null })
  },
  {
    key: "mastermind_stats", name: "Mastermind", color: "#6366f1",
    href: "games/mastermind.html",
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 12L12 22L2 12z"/></svg>',
    extract: (s) => ({ played: s.played || 0, wins: 0, points: s.totalScore || 0, extra: s.bestScore ? `Best score: ${s.bestScore}` : null })
  },
  {
    key: "orbit_trivia_stats", name: "Movie Trivia", color: "#00d9ff",
    href: null,
    glyph: '<svg class="orbit-glyph" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3"/><text x="12" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="currentColor">?</text></svg>',
    extract: (s) => ({ played: s.moviesQuizzed || 0, wins: s.perfectRounds || 0, points: s.totalCorrect || 0, extra: s.bestStreak ? `Best streak: ${s.bestStreak}` : (s.totalAnswered > 0 ? `${Math.round((s.totalCorrect / s.totalAnswered) * 100)}% accuracy` : null) })
  }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  setupProfileSummary();
  setupPrefsCollapse();
  loadScope();
  loadCountries();
  setupProviderCollapse();
  loadOverview();
  renderTriviaCard();
  loadGameBreakdown();
  loadTasteProfile();
  setupShortlistSection();
  setupDangerZone();
  setupListModal();
});

// ============================================
// PROFILE SUMMARY - YOUR LISTS
// ============================================

function getListData() {
  const swipeData = getStored("orbitSwipeMemory") || { liked: {}, disliked: {} };
  const comfortList = getStored("orbit_comfort_list") || [];

  const loved = Object.values(swipeData.liked || {}).map(entry => ({
    id: entry.movie?.id,
    title: entry.movie?.title || "Unknown",
    poster_path: entry.movie?.poster_path || "",
    release_date: "",
    media_type: "movie",
    genre_ids: entry.movie?.genre_ids || [],
    added_at: entry.lastSwiped
  }));

  const tonight = Object.values(swipeData.disliked || {}).map(entry => ({
    id: entry.movie?.id,
    title: entry.movie?.title || "Unknown",
    poster_path: entry.movie?.poster_path || "",
    release_date: "",
    media_type: "movie",
    genre_ids: entry.movie?.genre_ids || [],
    added_at: entry.lastSwiped
  }));

  const comfort = comfortList.map(show => ({
    id: show.id,
    title: show.name || "Unknown",
    poster_path: show.poster || "",
    release_date: "",
    media_type: "tv",
    number_of_episodes: show.selectedSeasons ? show.selectedSeasons.length * 10 : 0,
    totalSeasons: show.totalSeasons || 0,
    selectedSeasons: show.selectedSeasons || [],
    added_at: show.addedAt
  }));

  return { loved, tonight, comfort };
}

function setupProfileSummary() {
  const header = document.getElementById("summaryCollapseHeader");
  const body = document.getElementById("summaryCollapseBody");

  header.addEventListener("click", () => {
    const isOpen = body.classList.toggle("expanded");
    header.classList.toggle("open", isOpen);
  });

  refreshSummaryCounts();

  // Auto-expand if has content
  const { loved, tonight, comfort } = getListData();
  const total = loved.length + tonight.length + comfort.length;
  if (total >= 10) {
    body.classList.add("expanded");
    header.classList.add("open");
  }
}

function refreshSummaryCounts() {
  const { loved, tonight, comfort } = getListData();
  const total = loved.length + tonight.length + comfort.length;

  // Compute TV episode total for threshold check
  const tvEpisodeTotal = comfort.reduce((sum, s) => sum + (s.number_of_episodes || 0), 0);
  const meetsThreshold = total >= 10 || tvEpisodeTotal >= 10;

  const teaser = document.getElementById("summaryTeaser");
  const lists = document.getElementById("summaryLists");
  const countEl = document.getElementById("summaryTotalCount");

  if (meetsThreshold) {
    teaser.hidden = true;
    lists.hidden = false;
    countEl.textContent = `(${total})`;
  } else if (total > 0) {
    // Show lists even below threshold if there's some data
    teaser.hidden = true;
    lists.hidden = false;
    countEl.textContent = `(${total})`;
  } else {
    teaser.hidden = false;
    lists.hidden = true;
    countEl.textContent = "";
  }

  document.getElementById("lovedCount").textContent = loved.length;
  document.getElementById("tonightCount").textContent = tonight.length;
  document.getElementById("comfortCount").textContent = comfort.length;
}

// ============================================
// LIST MODAL
// ============================================

let currentModalList = null;

function setupListModal() {
  const modal = document.getElementById("listModal");
  const closeBtn = document.getElementById("listModalClose");
  const doneBtn = document.getElementById("listModalDone");
  const clearBtn = document.getElementById("listModalClearAll");

  // Open modal from list cards
  document.getElementById("lovedCard").addEventListener("click", () => openListModal("loved"));
  document.getElementById("tonightCard").addEventListener("click", () => openListModal("tonight"));
  document.getElementById("comfortCard").addEventListener("click", () => openListModal("comfort"));

  // Close
  closeBtn.addEventListener("click", closeListModal);
  doneBtn.addEventListener("click", closeListModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeListModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeListModal();
  });

  // Clear all
  clearBtn.addEventListener("click", () => {
    if (!confirm(`Are you sure you want to clear all items from this list?`)) return;
    clearCurrentList();
  });
}

function openListModal(listType) {
  currentModalList = listType;
  const modal = document.getElementById("listModal");
  const icon = document.getElementById("listModalIcon");
  const title = document.getElementById("listModalTitle");

  // Configure header
  icon.className = "list-modal-icon";
  switch (listType) {
    case "loved":
      icon.classList.add("loved-modal");
      icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      title.textContent = "Loved";
      break;
    case "tonight":
      icon.classList.add("tonight-modal");
      icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>';
      title.textContent = "Not Tonight";
      break;
    case "comfort":
      icon.classList.add("comfort-modal");
      icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0 0-4z"/></svg>';
      title.textContent = "Comfort List";
      break;
  }

  renderModalContent(listType);
  modal.hidden = false;
}

function closeListModal() {
  document.getElementById("listModal").hidden = true;
  currentModalList = null;
  refreshSummaryCounts();
  // Refresh taste profile too
  if (typeof loadTasteProfile === "function") loadTasteProfile();
}

function renderModalContent(listType) {
  const { loved, tonight, comfort } = getListData();
  let items;
  switch (listType) {
    case "loved": items = loved; break;
    case "tonight": items = tonight; break;
    case "comfort": items = comfort; break;
  }

  // Sort by most recent
  items.sort((a, b) => (b.added_at || 0) - (a.added_at || 0));

  const countEl = document.getElementById("listModalCount");
  countEl.textContent = `(${items.length} title${items.length !== 1 ? "s" : ""})`;

  const body = document.getElementById("listModalBody");

  if (items.length === 0) {
    body.innerHTML = '<div class="list-modal-empty">No titles in this list yet. Use Randomizer to discover and sort movies.</div>';
    return;
  }

  body.innerHTML = '<div class="list-modal-grid">' + items.map(item => {
    const poster = item.poster_path ? `${TMDB_IMG}w154${item.poster_path}` : "";
    const year = item.release_date ? item.release_date.split("-")[0] : "";
    const isTV = item.media_type === "tv";
    const typeBadge = isTV
      ? '<span class="list-modal-type-badge tv-badge">TV</span>'
      : '<span class="list-modal-type-badge">Movie</span>';
    const tvInfo = isTV && item.selectedSeasons
      ? `<div class="list-modal-item-meta">${item.selectedSeasons.length} of ${item.totalSeasons} seasons</div>`
      : "";

    // Move targets
    let moveBtn = "";
    if (listType === "loved") {
      moveBtn = `<button class="list-modal-action-btn move-btn" data-id="${item.id}" data-move="tonight" title="Move to Not Tonight">&#8594; Not Tonight</button>`;
    } else if (listType === "tonight") {
      moveBtn = `<button class="list-modal-action-btn move-btn" data-id="${item.id}" data-move="loved" title="Move to Loved">&#8594; Loved</button>`;
    }

    return `<div class="list-modal-item" data-item-id="${item.id}">
      <img class="list-modal-poster" src="${poster}" alt="${(item.title || "").replace(/"/g, "&quot;")}" data-id="${item.id}" data-type="${item.media_type}" onerror="this.style.opacity='0.2'">
      <div class="list-modal-item-info">
        <div class="list-modal-item-title">${item.title}</div>
        <div class="list-modal-item-meta">${year} ${typeBadge}</div>
        ${tvInfo}
        <div class="list-modal-item-actions">
          <button class="list-modal-action-btn remove-btn" data-id="${item.id}" title="Remove">Remove</button>
          ${moveBtn}
        </div>
      </div>
    </div>`;
  }).join("") + '</div>';

  // Attach handlers
  body.querySelectorAll(".list-modal-poster").forEach(poster => {
    poster.addEventListener("click", () => {
      const id = poster.dataset.id;
      const type = poster.dataset.type;
      localStorage.setItem("timelineMovieId", id);
      localStorage.setItem("timelineType", type === "tv" ? "tv" : "movie");
      window.location.href = "games/timeline.html";
    });
  });

  body.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromList(listType, parseInt(btn.dataset.id));
      renderModalContent(listType);
    });
  });

  body.querySelectorAll(".move-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const target = btn.dataset.move;
      moveItem(listType, target, id);
      renderModalContent(listType);
    });
  });
}

function removeFromList(listType, itemId) {
  if (listType === "loved" || listType === "tonight") {
    const swipeData = getStored("orbitSwipeMemory") || { liked: {}, disliked: {}, genreAffinities: {} };
    const collection = listType === "loved" ? "liked" : "disliked";
    delete swipeData[collection][itemId];
    localStorage.setItem("orbitSwipeMemory", JSON.stringify(swipeData));
  } else if (listType === "comfort") {
    const comfortList = getStored("orbit_comfort_list") || [];
    const filtered = comfortList.filter(s => s.id !== itemId);
    localStorage.setItem("orbit_comfort_list", JSON.stringify(filtered));
  }
}

function moveItem(fromList, toList, itemId) {
  const swipeData = getStored("orbitSwipeMemory") || { liked: {}, disliked: {}, genreAffinities: {} };
  const fromCollection = fromList === "loved" ? "liked" : "disliked";
  const toCollection = toList === "loved" ? "liked" : "disliked";

  const entry = swipeData[fromCollection][itemId];
  if (entry) {
    swipeData[toCollection][itemId] = entry;
    delete swipeData[fromCollection][itemId];
    localStorage.setItem("orbitSwipeMemory", JSON.stringify(swipeData));
  }
}

function clearCurrentList() {
  if (!currentModalList) return;

  if (currentModalList === "loved" || currentModalList === "tonight") {
    const swipeData = getStored("orbitSwipeMemory") || { liked: {}, disliked: {}, genreAffinities: {} };
    const collection = currentModalList === "loved" ? "liked" : "disliked";
    swipeData[collection] = {};
    localStorage.setItem("orbitSwipeMemory", JSON.stringify(swipeData));
  } else if (currentModalList === "comfort") {
    localStorage.setItem("orbit_comfort_list", JSON.stringify([]));
  }

  renderModalContent(currentModalList);
}

// ============================================
// PREFERENCES - SECTION COLLAPSE
// ============================================

function setupPrefsCollapse() {
  const header = document.getElementById("prefsCollapseHeader");
  const body = document.getElementById("prefsCollapseBody");

  header.addEventListener("click", () => {
    const isOpen = body.classList.toggle("expanded");
    header.classList.toggle("open", isOpen);
  });
}

// ============================================
// PREFERENCES - SCOPE
// ============================================

function loadScope() {
  const defaults = { randomizer: true, orbit: false, quick: false };
  const saved = getStored("orbit_preferences_scope") || defaults;

  document.getElementById("scopeRandomizer").checked = saved.randomizer !== false;
  document.getElementById("scopeOrbit").checked = !!saved.orbit;
  document.getElementById("scopeQuick").checked = !!saved.quick;

  document.querySelectorAll(".scope-checkbox").forEach(cb => {
    cb.addEventListener("change", saveScope);
  });
}

function saveScope() {
  const scope = {
    randomizer: document.getElementById("scopeRandomizer").checked,
    orbit: document.getElementById("scopeOrbit").checked,
    quick: document.getElementById("scopeQuick").checked
  };
  localStorage.setItem("orbit_preferences_scope", JSON.stringify(scope));
}

// ============================================
// PREFERENCES - PROVIDER COLLAPSE
// ============================================

function setupProviderCollapse() {
  const header = document.getElementById("providerCollapseHeader");
  const body = document.getElementById("providerCollapseBody");
  const expanded = localStorage.getItem("orbit_providers_expanded") === "true";

  if (expanded) {
    body.classList.add("expanded");
    header.classList.add("open");
  }

  header.addEventListener("click", () => {
    const isOpen = body.classList.toggle("expanded");
    header.classList.toggle("open", isOpen);
    localStorage.setItem("orbit_providers_expanded", isOpen ? "true" : "false");
  });
}

function updateProviderCount() {
  const count = document.querySelectorAll(".provider-card.selected").length;
  const el = document.getElementById("providerSelectedCount");
  el.textContent = count > 0 ? `${count} selected` : "";
}

// ============================================
// PREFERENCES - COUNTRY
// ============================================

async function loadCountries() {
  const select = document.getElementById("countrySelect");
  const saved = localStorage.getItem("orbit_user_country") || "";

  try {
    const res = await fetch(`https://api.themoviedb.org/3/configuration/countries?api_key=${TMDB_API_KEY}`);
    const countries = await res.json();

    countries.sort((a, b) => (a.english_name || "").localeCompare(b.english_name || ""));

    select.innerHTML = '<option value="">Select your country</option>' +
      countries.map(c =>
        `<option value="${c.iso_3166_1}"${c.iso_3166_1 === saved ? " selected" : ""}>${c.english_name}</option>`
      ).join("");

    if (saved) loadProviders(saved);
  } catch (e) {
    select.innerHTML = '<option value="">Failed to load countries</option>';
    console.error(e);
  }

  select.addEventListener("change", () => {
    const code = select.value;
    if (code) {
      localStorage.setItem("orbit_user_country", code);
      loadProviders(code);
    } else {
      localStorage.removeItem("orbit_user_country");
      clearProviders();
    }
  });
}

// ============================================
// PREFERENCES - STREAMING PROVIDERS
// ============================================

function clearProviders() {
  localStorage.removeItem("orbit_user_providers");
  const grid = document.getElementById("providerGrid");
  const hint = document.getElementById("providerHint");
  grid.innerHTML = "";
  hint.textContent = "Select a country first";
  hint.hidden = false;
  updateProviderCount();
}

async function loadProviders(countryCode) {
  const grid = document.getElementById("providerGrid");
  const hint = document.getElementById("providerHint");
  const savedProviders = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");

  hint.textContent = "Loading providers...";
  hint.hidden = false;
  grid.innerHTML = "";

  try {
    const res = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?watch_region=${countryCode}&api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const providers = data.results || [];

    if (!providers.length) {
      hint.textContent = "No providers found for this region";
      updateProviderCount();
      return;
    }

    hint.hidden = true;

    const validIds = new Set(providers.map(p => p.provider_id));
    const filtered = savedProviders.filter(id => validIds.has(id));
    localStorage.setItem("orbit_user_providers", JSON.stringify(filtered));

    grid.innerHTML = providers.map(p => {
      const selected = filtered.includes(p.provider_id) ? " selected" : "";
      const logo = p.logo_path ? `${TMDB_IMG}original${p.logo_path}` : "";
      const name = (p.provider_name || "").replace(/"/g, "&quot;");
      return `<div class="provider-card${selected}" data-id="${p.provider_id}" title="${name}">
        <img class="provider-logo" src="${logo}" alt="${name}" onerror="this.style.opacity='0.2'">
        <div class="provider-name">${p.provider_name || ""}</div>
      </div>`;
    }).join("");

    grid.querySelectorAll(".provider-card").forEach(card => {
      card.addEventListener("click", () => {
        card.classList.toggle("selected");
        saveProviderSelections();
        updateProviderCount();
      });
    });

    updateProviderCount();
  } catch (e) {
    hint.textContent = "Failed to load providers";
    console.error(e);
  }
}

function saveProviderSelections() {
  const ids = [];
  document.querySelectorAll(".provider-card.selected").forEach(card => {
    ids.push(parseInt(card.dataset.id));
  });
  localStorage.setItem("orbit_user_providers", JSON.stringify(ids));
}

// ============================================
// OVERVIEW STATS
// ============================================

function loadOverview() {
  let totalGames = 0, totalWins = 0, totalPoints = 0, bestStreak = 0;

  for (const game of GAME_REGISTRY) {
    const raw = localStorage.getItem(game.key);
    if (!raw) continue;
    try {
      const stats = game.extract(JSON.parse(raw));
      totalGames += stats.played;
      totalWins += stats.wins;
      totalPoints += stats.points;
    } catch (e) { /* skip */ }
  }

  const cStats = getStored("orbit_game_stats");
  if (cStats) bestStreak = Math.max(bestStreak, cStats.maxStreak || 0);
  const colStats = getStored("collision_stats");
  if (colStats) bestStreak = Math.max(bestStreak, colStats.bestStreak || 0);
  const trivStats = getStored("orbit_trivia_stats");
  if (trivStats) {
    bestStreak = Math.max(bestStreak, trivStats.bestStreak || 0);
    totalGames += trivStats.moviesQuizzed || 0;
    totalPoints += trivStats.totalCorrect || 0;
  }

  const dayStreak = cStats ? (cStats.currentStreak || 0) : 0;

  document.getElementById("totalGames").textContent = totalGames;
  document.getElementById("totalWins").textContent = totalWins;
  document.getElementById("winRate").textContent = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) + "%" : "0%";
  document.getElementById("totalPoints").textContent = formatNum(totalPoints);
  document.getElementById("bestStreak").textContent = bestStreak;
  document.getElementById("dayStreak").textContent = dayStreak;
}

// ============================================
// TRIVIA FEATURED CARD
// ============================================

function renderTriviaCard() {
  const container = document.getElementById("triviaFeaturedCard");
  if (!container) return;

  const stats = getStored("orbit_trivia_stats");
  if (!stats || stats.totalAnswered === 0) {
    container.querySelector(".trivia-stats-grid").innerHTML =
      '<div class="trivia-empty">Play Movie Trivia from any movie popup to track your stats here.</div>';
    return;
  }

  const accuracy = Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
  document.getElementById("triviaAccuracy").textContent = accuracy + "%";
  document.getElementById("triviaCurrentStreak").textContent = stats.currentStreak || 0;
  document.getElementById("triviaBestStreak").textContent = stats.bestStreak || 0;
  document.getElementById("triviaMoviesQuizzed").textContent = stats.moviesQuizzed || 0;
  document.getElementById("triviaPerfectRounds").textContent = stats.perfectRounds || 0;
}

// ============================================
// GAME BREAKDOWN
// ============================================

function loadGameBreakdown() {
  const container = document.getElementById("gameBreakdown");

  for (const game of GAME_REGISTRY) {
    const raw = localStorage.getItem(game.key);
    const stats = raw ? game.extract(JSON.parse(raw)) : { played: 0, wins: 0, points: 0, extra: null };

    const row = document.createElement(game.href ? "a" : "div");
    row.className = "breakdown-row";
    if (game.href) row.href = game.href;
    row.innerHTML = `
      <div class="orbit-icon" style="--card-accent:${game.color}">
        <div class="orbit-ring-outer"></div>
        <div class="orbit-ring-inner"></div>
        ${game.glyph}
      </div>
      <div class="breakdown-info">
        <div class="breakdown-name">${game.name}</div>
        <div class="breakdown-detail">
          ${stats.played} played${stats.wins ? ` · ${stats.wins} won` : ""}${stats.points ? ` · ${formatNum(stats.points)} pts` : ""}${stats.extra ? ` · ${stats.extra}` : ""}
        </div>
      </div>
      <div class="breakdown-arrow">→</div>
    `;
    container.appendChild(row);
  }
}

// ============================================
// TASTE PROFILE
// ============================================

function loadTasteProfile() {
  if (typeof SwipeMemory === "undefined") return;

  const stats = SwipeMemory.getStats();
  if (stats.likedCount === 0 && stats.dislikedCount === 0) return;

  document.getElementById("tasteSection").hidden = false;
  document.getElementById("likedCount").textContent = stats.likedCount;
  document.getElementById("dislikedCount").textContent = stats.dislikedCount;

  const barsEl = document.getElementById("genreBars");
  const topGenres = stats.topGenres || [];
  if (topGenres.length > 0) {
    const maxScore = Math.max(...topGenres.map(g => Math.abs(g.score)), 1);
    barsEl.innerHTML = topGenres.map(g => {
      const name = GENRE_MAP[g.id] || `Genre ${g.id}`;
      const pct = Math.round((g.score / maxScore) * 100);
      return `<div class="genre-row">
        <span class="genre-name">${name}</span>
        <div class="genre-bar-track"><div class="genre-bar-fill" style="width:${pct}%"></div></div>
        <span class="genre-score">${g.score > 0 ? "+" : ""}${g.score}</span>
      </div>`;
    }).join("");
  } else {
    barsEl.innerHTML = '<div class="genre-empty">Swipe more movies to build your profile</div>';
  }

  const liked = SwipeMemory.getLikedMovies();
  if (liked.length > 0) {
    document.getElementById("likedMovies").hidden = false;
    const grid = document.getElementById("likedGrid");
    const recent = liked.slice(-12).reverse();
    grid.innerHTML = recent.map(m => {
      const poster = m.poster_path ? `${TMDB_IMG}w92${m.poster_path}` : "";
      const title = (m.title || "").replace(/"/g, "&quot;");
      return `<div class="liked-card" title="${title}">
        <img src="${poster}" alt="${title}" class="liked-poster">
        <div class="liked-title">${m.title || "?"}</div>
      </div>`;
    }).join("");
  }
}

// ============================================
// DANGER ZONE
// ============================================

function setupDangerZone() {
  document.getElementById("clearDataBtn").addEventListener("click", () => {
    if (!confirm("Are you sure? This will delete ALL game stats, preferences, and swipe memory permanently.")) return;

    for (const game of GAME_REGISTRY) {
      localStorage.removeItem(game.key);
    }

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (/^(orbit_game|collision_game|triple_collision|journeys_game|connections_game|screenshot_game)_\d+/.test(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    localStorage.removeItem("orbitSwipeMemory");
    localStorage.removeItem("orbit_shortlist");
    localStorage.removeItem("orbit_user_country");
    localStorage.removeItem("orbit_user_providers");
    localStorage.removeItem("orbit_preferences_scope");
    localStorage.removeItem("orbit_providers_expanded");
    localStorage.removeItem("orbit_trivia_stats");

    location.reload();
  });
}

// ============================================
// YOUR SHORTLIST
// ============================================

function setupShortlistSection() {
  const header = document.getElementById("shortlistCollapseHeader");
  const body = document.getElementById("shortlistCollapseBody");

  header.addEventListener("click", () => {
    const isOpen = body.classList.toggle("expanded");
    header.classList.toggle("open", isOpen);
  });

  renderShortlistGrid();
}

function renderShortlistGrid() {
  if (typeof window.getShortlist !== "function") return;

  const movies = window.getShortlist();
  const countEl = document.getElementById("shortlistHeaderCount");
  const emptyEl = document.getElementById("shortlistEmpty");
  const gridEl = document.getElementById("shortlistGrid");
  const ctaEl = document.getElementById("shortlistCompareCta");
  const body = document.getElementById("shortlistCollapseBody");
  const header = document.getElementById("shortlistCollapseHeader");

  if (movies.length === 0) {
    countEl.textContent = "";
    emptyEl.hidden = false;
    gridEl.hidden = true;
    ctaEl.hidden = true;
    return;
  }

  countEl.textContent = `(${movies.length})`;
  emptyEl.hidden = true;
  gridEl.hidden = false;
  ctaEl.hidden = movies.length < 2;

  body.classList.add("expanded");
  header.classList.add("open");

  const sorted = movies.slice().sort((a, b) =>
    new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
  );

  gridEl.innerHTML = sorted.map(movie => {
    const poster = movie.poster ? `${TMDB_IMG}w154${movie.poster}` : "";
    const title = (movie.title || "").replace(/"/g, "&quot;");
    const year = movie.year || "";
    return `<div class="shortlist-card" data-id="${movie.id}">
      <div class="shortlist-card-poster-wrap">
        ${poster ? `<img class="shortlist-card-poster" src="${poster}" alt="${title}" loading="lazy" onerror="this.style.opacity='0.2'">` : `<div class="shortlist-card-poster shortlist-card-no-poster"></div>`}
        <button class="shortlist-card-remove" data-id="${movie.id}" title="Remove from shortlist">&times;</button>
      </div>
      <div class="shortlist-card-title">${movie.title || "?"}</div>
      ${year ? `<div class="shortlist-card-year">${year}</div>` : ""}
    </div>`;
  }).join("");

  gridEl.querySelectorAll(".shortlist-card-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.removeFromShortlist(parseInt(btn.dataset.id));
      if (typeof window.updateShortlistBadge === "function") window.updateShortlistBadge();
      renderShortlistGrid();
    });
  });
}

// ============================================
// UTILITIES
// ============================================

function getStored(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}
