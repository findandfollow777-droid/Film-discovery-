// ============================================
// TV RANDOMIZER - Amber Theme (3-Pick)
// ============================================

const HISTORY_KEY = "orbit_tv_randomizer_history";

// TV Genre mappings
const TV_GENRE_MAP = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western"
};

// TV Genre Vibe Mappings
const TV_GENRE_VIBES = {
  mood: {
    35: 15, 16: 20, 10751: 20, 10762: 15, 10767: 30,
    10764: 40, 18: 55, 10765: 60, 9648: 70, 80: 75, 10768: 80
  },
  pace: {
    99: 15, 10767: 25, 18: 40, 10764: 50, 35: 50,
    10751: 45, 9648: 60, 10765: 65, 80: 70, 10759: 80, 10768: 70
  },
  depth: {
    10762: 10, 10764: 20, 35: 35, 10751: 35, 10759: 40,
    10765: 55, 9648: 60, 80: 65, 18: 70, 10768: 75, 99: 85
  }
};

// ============================================
// STATE
// ============================================

let currentMode = "mood";
let vibeSettings = { mood: 50, pace: 50, depth: 50, familiar: 50 };
let selectedGenres = [];
let selectedDecades = [];
let timeCommitment = "any";
let preferShortEpisodes = false;
let showStatus = "all";
let streamingFilterActive = false;
let recentSpins = [];
let lastPool = [];
let lastDiscoverParams = null;
let recentlyShown = [];

// ============================================
// DOM REFERENCES
// ============================================

const configSection = document.getElementById("configSection");
const spinningSection = document.getElementById("spinningSection");
const resultSection = document.getElementById("resultSection");
const spinnerSubtext = document.getElementById("spinnerSubtext");

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  recentSpins = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

  // Mode cards
  document.querySelectorAll(".mode-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      currentMode = card.dataset.mode;
      document.getElementById("vibePanel").classList.toggle("hidden", currentMode !== "mood");
    });
  });

  // Vibe sliders
  document.querySelectorAll(".vibe-slider").forEach(slider => {
    slider.addEventListener("input", () => {
      vibeSettings[slider.dataset.vibe] = parseInt(slider.value);
    });
  });

  document.getElementById("resetVibesBtn").addEventListener("click", resetVibes);

  // Time commitment chips
  document.querySelectorAll(".commitment-chips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".commitment-chips .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      timeCommitment = chip.dataset.commitment;
    });
  });

  // Short episodes toggle
  document.getElementById("shortEpisodes").addEventListener("change", (e) => {
    preferShortEpisodes = e.target.checked;
  });

  // Genre chips
  setupFilterChips("genreGrid", "genre", selectedGenres, "genreCount");
  setupFilterChips("decadeGrid", "decade", selectedDecades, "decadeCount");

  // Status chips
  document.querySelectorAll("#statusGrid .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#statusGrid .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      showStatus = chip.dataset.status;
    });
  });

  // Filter toggles
  setupFilterToggle("genreToggle", "genreGrid");
  setupFilterToggle("decadeToggle", "decadeGrid");
  setupFilterToggle("statusToggle", "statusGrid");

  // Spin button
  document.getElementById("spinBtn").addEventListener("click", startSpin);

  // Result actions
  document.getElementById("respinBtn").addEventListener("click", respin);
  document.getElementById("adjustBtn").addEventListener("click", showConfig);

  // Card button delegation
  document.getElementById("resultPicks").addEventListener("click", handleCardClick);

  // Streaming filter
  initTVStreamingFilter();

  // Modals
  setupModals();
});

function setupFilterChips(gridId, dataAttr, selectedArray, countId) {
  document.getElementById(gridId).querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const val = parseInt(chip.dataset[dataAttr]);
      if (chip.classList.contains("active")) {
        if (!selectedArray.includes(val)) selectedArray.push(val);
      } else {
        const idx = selectedArray.indexOf(val);
        if (idx > -1) selectedArray.splice(idx, 1);
      }
      document.getElementById(countId).textContent = selectedArray.length > 0 ? `(${selectedArray.length})` : "";
    });
  });
}

function setupFilterToggle(toggleId, gridId) {
  const toggle = document.getElementById(toggleId);
  const grid = document.getElementById(gridId);
  toggle.addEventListener("click", () => {
    grid.hidden = !grid.hidden;
    toggle.classList.toggle("open", !grid.hidden);
  });
}

function setupModals() {
  document.getElementById("helpBtn").addEventListener("click", () => showModal("helpModal"));
  document.getElementById("helpClose").addEventListener("click", () => hideModal("helpModal"));
  document.getElementById("historyBtn").addEventListener("click", () => {
    renderHistory();
    showModal("historyModal");
  });
  document.getElementById("historyClose").addEventListener("click", () => hideModal("historyModal"));
  document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

function resetVibes() {
  vibeSettings = { mood: 50, pace: 50, depth: 50, familiar: 50 };
  document.querySelectorAll(".vibe-slider").forEach(s => s.value = 50);
}

function initTVStreamingFilter() {
  const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
  const scope = JSON.parse(localStorage.getItem("orbit_preferences_scope") || "{}");
  const savedToggle = localStorage.getItem("orbit_tv_randomizer_streaming_filter");
  const toggle = document.getElementById("streamingToggle");

  if (savedToggle !== null) {
    streamingFilterActive = savedToggle === "true";
  } else {
    streamingFilterActive = providers.length > 0 && scope.randomizer !== false;
  }

  toggle.classList.toggle("active", streamingFilterActive);
  toggle.classList.add("streaming-toggle");

  toggle.addEventListener("click", () => {
    const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
    if (!providers.length) {
      if (confirm("No streaming services configured. Set them up in your Profile?")) {
        window.location.href = "profile.html";
      }
      return;
    }
    streamingFilterActive = !streamingFilterActive;
    toggle.classList.toggle("active", streamingFilterActive);
    localStorage.setItem("orbit_tv_randomizer_streaming_filter", String(streamingFilterActive));
  });
}

async function filterTVByStreaming(shows) {
  if (!streamingFilterActive) return shows;
  const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
  if (!providers.length) return shows;
  return await filterByStreamingTV(shows);
}

function showModal(id) { document.getElementById(id).hidden = false; }
function hideModal(id) { document.getElementById(id).hidden = true; }

function showConfig() {
  configSection.hidden = false;
  spinningSection.hidden = true;
  resultSection.hidden = true;
}

// ============================================
// SPIN LOGIC
// ============================================

async function startSpin() {
  configSection.hidden = true;
  resultSection.hidden = true;
  spinningSection.hidden = false;

  const subtexts = {
    mood: "Finding your vibe match",
    quick: "Searching for quick binges",
    hidden: "Unearthing hidden treasures",
    comfort: "Finding beloved classics"
  };
  spinnerSubtext.textContent = subtexts[currentMode] || "Searching...";

  try {
    const pool = await fetchTVPool();
    await new Promise(r => setTimeout(r, 1500));

    if (pool && pool.length) {
      lastPool = pool;
      const picks = pickThree(pool);
      displayResults(picks);
    } else {
      showError("No shows found. Try adjusting your filters.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  }
}

async function respin() {
  if (!lastPool.length) { startSpin(); return; }

  // Show loading overlay in each card
  const container = document.getElementById("resultPicks");
  container.querySelectorAll(".pick-card").forEach(card => {
    card.insertAdjacentHTML("beforeend",
      `<div class="randomizer-loading-state">
        <div class="mini-spinner" style="width:180px;height:180px">
          <div class="mini-ring mini-ring-1"></div>
          <div class="mini-ring mini-ring-2"></div>
          <div class="mini-core" style="width:24px;height:24px"></div>
        </div>
      </div>`
    );
  });

  // Pick new shows and wait for minimum animation duration
  const [picks] = await Promise.all([
    Promise.resolve(pickThree(lastPool)),
    new Promise(r => setTimeout(r, 1500))
  ]);

  displayResults(picks);
}

function showError(msg) {
  spinningSection.hidden = true;
  configSection.hidden = false;
  alert(msg);
}

// ============================================
// HELPERS
// ============================================

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickThree(pool) {
  const cooldown = new Set(recentlyShown);
  const seen = new Set();
  const picks = [];
  const shuffled = shuffleArray(pool);
  // Prefer shows not in cooldown
  for (const s of shuffled) {
    if (!seen.has(s.id) && !cooldown.has(s.id)) {
      seen.add(s.id);
      picks.push(s);
      if (picks.length === 3) break;
    }
  }
  // Fall back to cooldown items if pool is too small
  if (picks.length < 3) {
    for (const s of shuffled) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        picks.push(s);
        if (picks.length === 3) break;
      }
    }
  }
  return picks;
}

function trackShown(ids) {
  recentlyShown = recentlyShown.concat(ids);
  if (recentlyShown.length > 20) {
    recentlyShown = recentlyShown.slice(-20);
  }
}

// ============================================
// TMDB FETCHING
// ============================================

async function fetchTVPool() {
  switch (currentMode) {
    case "mood": return await fetchMoodPool();
    case "quick": return await fetchQuickPool();
    case "hidden": return await fetchHiddenGemPool();
    case "comfort": return await fetchComfortPool();
    default: return await fetchMoodPool();
  }
}

function buildTVParams() {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    include_adult: "false",
    "vote_count.gte": "50"
  });

  if (selectedGenres.length > 0) {
    params.set("with_genres", selectedGenres.join(","));
  }

  if (selectedDecades.length > 0) {
    const { minYear, maxYear } = getYearRange();
    params.set("first_air_date.gte", `${minYear}-01-01`);
    params.set("first_air_date.lte", `${maxYear}-12-31`);
  }

  if (showStatus === "ended") {
    params.set("with_status", "0");
  } else if (showStatus === "returning") {
    params.set("with_status", "1");
  }

  return params;
}

function getYearRange() {
  let minYear = 1950, maxYear = new Date().getFullYear();
  if (selectedDecades.length > 0) {
    const decades = selectedDecades.filter(d => d > 0).sort((a, b) => a - b);
    if (selectedDecades.includes(0)) minYear = 1950;
    else if (decades.length) minYear = Math.min(...decades);
    if (decades.length) maxYear = Math.max(...decades) + 9;
  }
  return { minYear, maxYear };
}

async function fetchMoodPool() {
  const params = buildTVParams();
  params.set("sort_by", "popularity.desc");

  if (selectedGenres.length === 0) {
    const vibeGenres = getTVVibeBasedGenres();
    if (vibeGenres.length) params.set("with_genres", vibeGenres.join("|"));
  }

  lastDiscoverParams = new URLSearchParams(params.toString());

  const startPage = Math.floor(Math.random() * 5) + 1;
  let allShows = [];
  for (let p = startPage; p < startPage + 2 && allShows.length < 3; p++) {
    params.set("page", p);
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
    const data = await res.json();
    let shows = (data.results || []).filter(s => s.poster_path);
    shows = await filterTVByStreaming(shows);
    shows = await filterByTimeCommitment(shows);
    allShows = allShows.concat(shows);
  }

  // Attach vibe scores and sort best-first
  return allShows.map(s => ({ ...s, _vibeScore: calculateTVVibeScore(s) }))
    .sort((a, b) => b._vibeScore - a._vibeScore);
}

async function fetchQuickPool() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "100");
  params.set("vote_average.gte", "7.0");
  lastDiscoverParams = new URLSearchParams(params.toString());

  const startPage = Math.floor(Math.random() * 10) + 1;
  let allShows = [];
  for (let p = startPage; p < startPage + 2 && allShows.length < 3; p++) {
    params.set("page", p);
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
    const data = await res.json();
    let shows = (data.results || []).filter(s => s.poster_path);
    shows = await filterTVByStreaming(shows);
    shows = await filterByTimeCommitment(shows, "limited");
    allShows = allShows.concat(shows);
  }

  return allShows;
}

async function fetchHiddenGemPool() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "50");
  params.set("vote_count.lte", "500");
  params.set("vote_average.gte", "7.5");
  lastDiscoverParams = new URLSearchParams(params.toString());

  const startPage = Math.floor(Math.random() * 10) + 1;
  let allShows = [];
  for (let p = startPage; p < startPage + 2 && allShows.length < 3; p++) {
    params.set("page", p);
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
    const data = await res.json();
    let shows = (data.results || []).filter(s => s.poster_path);
    shows = await filterTVByStreaming(shows);
    shows = await filterByTimeCommitment(shows);
    allShows = allShows.concat(shows);
  }

  return allShows;
}

async function fetchComfortPool() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "500");
  params.set("vote_average.gte", "7.5");
  params.set("with_status", "0"); // Ended
  lastDiscoverParams = new URLSearchParams(params.toString());

  const startPage = Math.floor(Math.random() * 10) + 1;
  let allShows = [];
  for (let p = startPage; p < startPage + 2 && allShows.length < 3; p++) {
    params.set("page", p);
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
    const data = await res.json();
    let shows = (data.results || []).filter(s => s.poster_path);

    // Filter for long-running — need details
    const detailed = await Promise.all(shows.slice(0, 15).map(s => fetchTVDetails(s.id).catch(() => null)));
    const longRunning = detailed.filter(s => s && s.number_of_seasons >= 4 && s.poster_path);
    allShows = allShows.concat(longRunning);
  }

  return allShows;
}

async function filterByTimeCommitment(shows, overrideCommitment = null) {
  const commitment = overrideCommitment || timeCommitment;
  if (commitment === "any" && !preferShortEpisodes) return shows;

  const detailed = await Promise.all(shows.slice(0, 20).map(s => fetchTVDetails(s.id).catch(() => null)));

  return detailed.filter(show => {
    if (!show) return false;

    const eps = show.number_of_episodes || 0;
    const seasons = show.number_of_seasons || 0;
    const runtime = show.episode_run_time?.[0] || 45;

    let passes = true;
    switch (commitment) {
      case "mini": passes = eps <= 8; break;
      case "limited": passes = eps <= 20; break;
      case "standard": passes = seasons >= 2 && seasons <= 4; break;
      case "epic": passes = seasons >= 5; break;
    }

    if (preferShortEpisodes && runtime > 30) passes = false;

    return passes;
  });
}

async function fetchTVDetails(showId) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`);
  return await res.json();
}

function getTVVibeBasedGenres() {
  const result = [];
  for (const dim of ["mood", "pace", "depth"]) {
    const userVal = vibeSettings[dim];
    for (const [gidStr, val] of Object.entries(TV_GENRE_VIBES[dim] || {})) {
      if (Math.abs(val - userVal) < 25 && !result.includes(parseInt(gidStr))) {
        result.push(parseInt(gidStr));
      }
    }
  }
  return result.slice(0, 5);
}

function calculateTVVibeScore(show) {
  const genres = show.genre_ids || [];
  if (!genres.length) return 50;

  let moodSum = 0, paceSum = 0, depthSum = 0;
  let moodCount = 0, paceCount = 0, depthCount = 0;

  for (const gid of genres) {
    if (TV_GENRE_VIBES.mood[gid] !== undefined) { moodSum += TV_GENRE_VIBES.mood[gid]; moodCount++; }
    if (TV_GENRE_VIBES.pace[gid] !== undefined) { paceSum += TV_GENRE_VIBES.pace[gid]; paceCount++; }
    if (TV_GENRE_VIBES.depth[gid] !== undefined) { depthSum += TV_GENRE_VIBES.depth[gid]; depthCount++; }
  }

  const showMood = moodCount ? moodSum / moodCount : 50;
  const showPace = paceCount ? paceSum / paceCount : 50;
  const showDepth = depthCount ? depthSum / depthCount : 50;

  const moodDiff = Math.abs(showMood - vibeSettings.mood);
  const paceDiff = Math.abs(showPace - vibeSettings.pace);
  const depthDiff = Math.abs(showDepth - vibeSettings.depth);

  return Math.max(0, Math.min(100, Math.round(100 - (moodDiff + paceDiff + depthDiff) / 3)));
}

// ============================================
// CARD RENDERING & INTERACTIONS
// ============================================

function renderCardHtml(show) {
  const year = (show.first_air_date || "").split("-")[0];
  const rating = show.vote_average || 0;

  const matchHtml = (currentMode === "mood" && show._vibeScore !== undefined)
    ? `<div class="pick-match">${show._vibeScore}% match</div>`
    : "";

  return `<div class="pick-card" data-id="${show.id}">
    <div class="pick-poster-wrap">
      <img class="pick-poster" src="${show.poster_path ? TMDB_IMG + 'w342' + show.poster_path : ''}" alt="${show.name || ''}">
      ${matchHtml}
    </div>
    <div class="pick-info">
      <h3 class="pick-title">${show.name || "Unknown"}</h3>
      <div class="pick-pills">
        ${year ? `<span class="pick-pill">${year}</span>` : ""}
        <span class="pick-pill pick-pill-seasons" data-show-id="${show.id}" hidden></span>
        <span class="pick-pill pick-pill-runtime" data-show-id="${show.id}" hidden></span>
        ${rating > 0 ? `<span class="pick-pill pick-pill-rating">&#x2605; ${rating.toFixed(1)}</span>` : ""}
      </div>
      <p class="pick-overview">${show.overview || ""}</p>
      <div class="pick-streaming" data-show-id="${show.id}"></div>
      <div class="pick-actions">
        <button class="pick-btn pick-btn-love" data-id="${show.id}">
          <span class="og og-thumbsup"></span> Love It
        </button>
        <button class="pick-btn pick-btn-skip" data-id="${show.id}">
          <span class="og og-sad"></span> Not Tonight
        </button>
      </div>
    </div>
  </div>`;
}

function displayResults(shows) {
  spinningSection.hidden = true;
  resultSection.hidden = false;

  const backdrop = shows.find(s => s.backdrop_path);
  if (backdrop) {
    document.querySelector(".game-backdrop").style.backgroundImage =
      `url(${TMDB_IMG}w1280${backdrop.backdrop_path})`;
  }

  const container = document.getElementById("resultPicks");
  container.innerHTML = shows.map(s => renderCardHtml(s)).join("");

  // Fetch extras for each card (runtime + seasons + streaming)
  shows.forEach(s => fetchCardExtras(s.id));

  trackShown(shows.map(s => s.id));
  shows.forEach(s => addToHistory(s));
}

async function fetchCardExtras(showId) {
  const country = localStorage.getItem("orbit_user_country") || "AU";

  const [details, providers] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`)
      .then(r => r.json()).catch(() => null),
    fetch(`https://api.themoviedb.org/3/tv/${showId}/watch/providers?api_key=${TMDB_API_KEY}`)
      .then(r => r.json()).catch(() => null)
  ]);

  // Seasons pill
  if (details) {
    const seasons = details.number_of_seasons || 0;
    const episodes = details.number_of_episodes || 0;
    const seasonsEl = document.querySelector(`.pick-pill-seasons[data-show-id="${showId}"]`);
    if (seasonsEl && seasons > 0) {
      seasonsEl.textContent = `${seasons} Season${seasons !== 1 ? "s" : ""} \u00B7 ${episodes} Eps`;
      seasonsEl.hidden = false;
    }
  }

  // Runtime pill (episode runtime)
  if (details && details.episode_run_time && details.episode_run_time.length) {
    const el = document.querySelector(`.pick-pill-runtime[data-show-id="${showId}"]`);
    if (el) { el.textContent = details.episode_run_time[0] + " min/ep"; el.hidden = false; }
  }

  // Streaming logos
  if (providers && providers.results) {
    const data = providers.results[country] || providers.results["US"];
    if (data && data.flatrate && data.flatrate.length) {
      const el = document.querySelector(`.pick-streaming[data-show-id="${showId}"]`);
      if (el) {
        el.innerHTML = data.flatrate.slice(0, 5).map(p =>
          `<img src="${TMDB_IMG}w45${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name}">`
        ).join("");
      }
    }
  }
}

function handleCardClick(e) {
  const loveBtn = e.target.closest(".pick-btn-love");
  if (loveBtn) {
    e.stopPropagation();
    const showId = parseInt(loveBtn.dataset.id);
    window.location.href = `../games/series.html?id=${showId}`;
    return;
  }

  const skipBtn = e.target.closest(".pick-btn-skip");
  if (skipBtn) {
    e.stopPropagation();
    respinCard(skipBtn.closest(".pick-card"));
    return;
  }
}

async function respinCard(cardEl) {
  const allCards = document.querySelectorAll(".pick-card");
  const excludeIds = new Set(recentlyShown);
  allCards.forEach(c => excludeIds.add(parseInt(c.dataset.id)));

  // Find replacement from pool, avoiding recently shown
  let replacement = lastPool.find(s => !excludeIds.has(s.id));

  // Pool exhausted — fetch another page
  if (!replacement) {
    const more = await fetchMoreForPool();
    replacement = more.find(s => !excludeIds.has(s.id));
  }
  // Last resort — ignore cooldown
  if (!replacement) {
    const visibleIds = new Set();
    allCards.forEach(c => visibleIds.add(parseInt(c.dataset.id)));
    replacement = lastPool.find(s => !visibleIds.has(s.id));
  }

  if (!replacement) return;

  // Show spinner overlay inside this card
  cardEl.insertAdjacentHTML("beforeend",
    `<div class="pick-card-spinner">
      <div class="mini-spinner">
        <div class="mini-ring mini-ring-1"></div>
        <div class="mini-ring mini-ring-2"></div>
        <div class="mini-core"></div>
      </div>
    </div>`
  );

  await new Promise(r => setTimeout(r, 1200));

  // Replace the card
  cardEl.outerHTML = renderCardHtml(replacement);

  // Fetch extras for the new card
  fetchCardExtras(replacement.id);

  trackShown([replacement.id]);
  addToHistory(replacement);

  if (replacement.backdrop_path) {
    document.querySelector(".game-backdrop").style.backgroundImage =
      `url(${TMDB_IMG}w1280${replacement.backdrop_path})`;
  }
}

async function fetchMoreForPool() {
  if (!lastDiscoverParams) return [];
  const params = new URLSearchParams(lastDiscoverParams.toString());
  params.set("page", Math.floor(Math.random() * 20) + 1);

  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
  const data = await res.json();
  let shows = (data.results || []).filter(s => s.poster_path);
  shows = await filterTVByStreaming(shows);

  if (currentMode === "mood") {
    shows = shows.map(s => ({ ...s, _vibeScore: calculateTVVibeScore(s) }));
  }

  lastPool = lastPool.concat(shows);
  return shows;
}

// ============================================
// HISTORY
// ============================================

function addToHistory(show) {
  const entry = {
    id: show.id,
    name: show.name || show.title || "Unknown",
    poster: show.poster_path || "",
    timestamp: Date.now()
  };

  recentSpins = recentSpins.filter(s => s.id !== entry.id);
  recentSpins.unshift(entry);
  recentSpins = recentSpins.slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(recentSpins));
}

function renderHistory() {
  const list = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearHistoryBtn");

  if (!recentSpins.length) {
    list.innerHTML = '<p class="history-empty">No spins yet. Give it a whirl!</p>';
    clearBtn.hidden = true;
    return;
  }

  clearBtn.hidden = false;
  list.innerHTML = recentSpins.map(s => `
    <div class="history-item" data-id="${s.id}">
      <img class="history-poster" src="${s.poster ? TMDB_IMG + 'w92' + s.poster : ''}" alt="">
      <div class="history-info">
        <div class="history-title">${s.name}</div>
        <div class="history-sub">${timeAgo(s.timestamp)}</div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".history-item").forEach(item => {
    item.addEventListener("click", () => {
      hideModal("historyModal");
      const showId = parseInt(item.dataset.id);
      window.location.href = `../games/series.html?id=${showId}`;
    });
  });
}

function clearHistory() {
  recentSpins = [];
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
