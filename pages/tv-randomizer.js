// ============================================
// TV RANDOMIZER - Amber Theme
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
let currentShow = null;

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
  document.getElementById("spinAgainBtn").addEventListener("click", startSpin);
  document.getElementById("adjustBtn").addEventListener("click", showConfig);
  document.getElementById("exploreBtn").addEventListener("click", exploreShow);

  // Swipe buttons
  document.getElementById("swipeLoveBtn").addEventListener("click", () => handleSwipe("like"));
  document.getElementById("swipePassBtn").addEventListener("click", () => handleSwipe("dislike"));

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
  document.getElementById("configSection").hidden = false;
  document.getElementById("spinningSection").hidden = true;
  document.getElementById("resultSection").hidden = true;
}

// ============================================
// SPIN LOGIC
// ============================================

async function startSpin() {
  document.getElementById("configSection").hidden = true;
  document.getElementById("resultSection").hidden = true;
  document.getElementById("spinningSection").hidden = false;

  const subtexts = {
    mood: "Finding your vibe match",
    quick: "Searching for quick binges",
    hidden: "Unearthing hidden treasures",
    comfort: "Finding beloved classics"
  };
  document.getElementById("spinnerSubtext").textContent = subtexts[currentMode] || "Searching...";

  try {
    const show = await fetchTVShow();
    await new Promise(r => setTimeout(r, 1500));

    if (show) {
      displayResult(show);
    } else {
      alert("No shows found. Try adjusting your filters.");
      showConfig();
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
    showConfig();
  }
}

async function fetchTVShow() {
  switch (currentMode) {
    case "mood": return await fetchMoodMatchTV();
    case "quick": return await fetchQuickBingeTV();
    case "hidden": return await fetchHiddenGemTV();
    case "comfort": return await fetchComfortClassicTV();
    default: return await fetchMoodMatchTV();
  }
}

function buildTVParams() {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    include_adult: false,
    "vote_count.gte": 50
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

async function fetchMoodMatchTV() {
  const params = buildTVParams();
  params.set("sort_by", "popularity.desc");
  params.set("page", Math.floor(Math.random() * 10) + 1);

  if (selectedGenres.length === 0) {
    const vibeGenres = getTVVibeBasedGenres();
    if (vibeGenres.length) params.set("with_genres", vibeGenres.join("|"));
  }

  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
  const data = await res.json();

  let shows = (data.results || []).filter(s => s.poster_path);
  shows = await filterTVByStreaming(shows);
  shows = await filterByTimeCommitment(shows);

  if (!shows.length) return null;

  const scored = shows.map(s => ({ show: s, score: calculateTVVibeScore(s) }))
                      .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5);
  const pick = top[Math.floor(Math.random() * top.length)];

  const details = await fetchTVDetails(pick.show.id);
  details._vibeScore = pick.score;
  return details;
}

async function fetchQuickBingeTV() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", 100);
  params.set("vote_average.gte", 7.0);
  params.set("page", Math.floor(Math.random() * 10) + 1);

  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
  const data = await res.json();

  let shows = (data.results || []).filter(s => s.poster_path);
  shows = await filterTVByStreaming(shows);
  shows = await filterByTimeCommitment(shows, "limited");

  if (!shows.length) return null;
  return await fetchTVDetails(shows[Math.floor(Math.random() * shows.length)].id);
}

async function fetchHiddenGemTV() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", 50);
  params.set("vote_count.lte", 500);
  params.set("vote_average.gte", 7.5);
  params.set("page", Math.floor(Math.random() * 10) + 1);

  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
  const data = await res.json();

  let shows = (data.results || []).filter(s => s.poster_path);
  shows = await filterTVByStreaming(shows);
  shows = await filterByTimeCommitment(shows);

  if (!shows.length) return null;
  return await fetchTVDetails(shows[Math.floor(Math.random() * shows.length)].id);
}

async function fetchComfortClassicTV() {
  const params = buildTVParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", 500);
  params.set("vote_average.gte", 7.5);
  params.set("with_status", "0"); // Ended
  params.set("page", Math.floor(Math.random() * 10) + 1);

  const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`);
  const data = await res.json();

  let shows = (data.results || []).filter(s => s.poster_path);

  // Filter for long-running
  const detailed = await Promise.all(shows.slice(0, 15).map(s => fetchTVDetails(s.id).catch(() => null)));
  const longRunning = detailed.filter(s => s && s.number_of_seasons >= 4);

  if (!longRunning.length) return null;
  return longRunning[Math.floor(Math.random() * longRunning.length)];
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

  const movieMood = moodCount ? moodSum / moodCount : 50;
  const moviePace = paceCount ? paceSum / paceCount : 50;
  const movieDepth = depthCount ? depthSum / depthCount : 50;

  const moodDiff = Math.abs(movieMood - vibeSettings.mood);
  const paceDiff = Math.abs(moviePace - vibeSettings.pace);
  const depthDiff = Math.abs(movieDepth - vibeSettings.depth);

  return Math.max(0, Math.min(100, Math.round(100 - (moodDiff + paceDiff + depthDiff) / 3)));
}

// ============================================
// DISPLAY RESULT
// ============================================

function displayResult(show) {
  currentShow = show;
  document.getElementById("spinningSection").hidden = true;
  document.getElementById("resultSection").hidden = false;

  // Poster
  document.getElementById("resultPoster").src = show.poster_path ? `${TMDB_IMG}w500${show.poster_path}` : "";

  // Rating
  const rating = show.vote_average || 0;
  document.getElementById("ratingValue").textContent = rating.toFixed(1);

  // Title
  document.getElementById("resultTitle").textContent = show.name || "Unknown";

  // TV-specific meta
  const seasons = show.number_of_seasons || 0;
  const episodes = show.number_of_episodes || 0;
  const runtime = show.episode_run_time?.[0] || "?";

  document.getElementById("resultSeasons").textContent = `${seasons} Season${seasons !== 1 ? "s" : ""}`;
  document.getElementById("resultEpisodes").textContent = `${episodes} Episodes`;
  document.getElementById("resultRuntime").textContent = `${runtime} min`;

  // Status badge
  const statusEl = document.getElementById("resultStatus");
  const status = show.status || "Unknown";
  statusEl.textContent = status;
  statusEl.className = "meta-item status-badge " + status.toLowerCase().replace(/\s+/g, "-");

  // Genres
  const genres = show.genres || [];
  document.getElementById("resultGenres").innerHTML = genres.map(g => `<span class="genre-tag">${g.name}</span>`).join("");

  // Overview
  document.getElementById("resultOverview").textContent = show.overview || "No overview available.";

  // Match indicator
  const matchEl = document.getElementById("matchIndicator");
  if (currentMode === "mood" && show._vibeScore !== undefined) {
    matchEl.hidden = false;
    document.getElementById("matchFill").style.width = show._vibeScore + "%";
    document.getElementById("matchPct").textContent = show._vibeScore + "%";
  } else {
    matchEl.hidden = true;
  }

  // Streaming providers
  const providerEl = document.getElementById("streamingProviders");
  providerEl.innerHTML = '';
  fetchStreamingProviders(show.id, "tv").then(providers => {
    renderStreamingLogos(providers, providerEl);
  });

  // Taste button states
  const status = typeof getTasteStatus === "function" ? getTasteStatus(show.id) : "none";
  document.getElementById("swipeLoveBtn").classList.toggle("active", status === "loved");
  document.getElementById("swipePassBtn").classList.toggle("active", status === "skipped");

  // Add to history
  addToHistory(show);
}

function handleSwipe(preference) {
  if (!currentShow) return;

  const showData = {
    id: currentShow.id,
    title: currentShow.name || currentShow.title,
    year: currentShow.first_air_date ? parseInt(currentShow.first_air_date) : null,
    poster: currentShow.poster_path,
    genres: (currentShow.genre_ids || (currentShow.genres || []).map(g => g.id)) || []
  };

  if (preference === "like") {
    if (typeof loveMovie === "function") loveMovie(showData);
  } else {
    if (typeof skipMovie === "function") skipMovie(showData);
  }

  document.getElementById("swipeLoveBtn").classList.toggle("active", preference === "like");
  document.getElementById("swipePassBtn").classList.toggle("active", preference === "dislike");

  if (preference === "dislike") {
    setTimeout(startSpin, 500);
  }
}

function exploreShow() {
  if (!currentShow) return;
  localStorage.setItem("timelineMovieId", currentShow.id);
  localStorage.setItem("timelineType", "tv");
  window.location.href = "timeline.html";
}

// ============================================
// HISTORY
// ============================================

function addToHistory(show) {
  recentSpins = [
    { id: show.id, name: show.name, poster: show.poster_path, timestamp: Date.now() },
    ...recentSpins.filter(s => s.id !== show.id)
  ].slice(0, 20);
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
    item.addEventListener("click", async () => {
      hideModal("historyModal");
      document.getElementById("configSection").hidden = true;
      document.getElementById("spinningSection").hidden = false;
      document.getElementById("spinnerSubtext").textContent = "Loading...";
      const show = await fetchTVDetails(parseInt(item.dataset.id));
      await new Promise(r => setTimeout(r, 800));
      displayResult(show);
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
