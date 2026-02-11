// ============================================
// WHAT TO WATCH - Orbit Randomizer
// ============================================

const HISTORY_KEY = "orbit_randomizer_history";

// Genre ID → Name
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

// Genre vibe mappings (from results.js)
const GENRE_VIBES = {
  mood: {
    35: 10, 16: 15, 10751: 15, 10402: 25, 10749: 30,
    12: 40, 14: 45, 878: 50, 28: 55, 9648: 65,
    53: 70, 80: 75, 10752: 80, 27: 90
  },
  pace: {
    99: 10, 18: 25, 10749: 30, 36: 35, 10402: 40,
    35: 45, 9648: 50, 14: 55, 878: 60, 12: 65,
    80: 70, 53: 80, 28: 85, 27: 75, 10752: 80
  },
  depth: {
    28: 15, 12: 20, 14: 25, 16: 30, 10751: 30,
    35: 35, 27: 40, 10749: 45, 878: 55, 9648: 60,
    53: 55, 80: 65, 18: 70, 10752: 75, 36: 80, 99: 90
  }
};

// ============================================
// STATE
// ============================================

let currentMode = "mood";
let vibeSettings = { mood: 50, pace: 50, depth: 50, familiar: 50 };
let selectedGenres = [];
let selectedDecades = [];
let recentSpins = [];
let currentMovie = null;
let streamingFilterActive = false;

// ============================================
// DOM REFERENCES
// ============================================

const configSection = document.getElementById("configSection");
const spinningSection = document.getElementById("spinningSection");
const resultSection = document.getElementById("resultSection");
const vibePanel = document.getElementById("vibePanel");
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
      vibePanel.classList.toggle("hidden", currentMode !== "mood");
    });
  });

  // Sliders
  document.querySelectorAll(".vibe-slider").forEach(slider => {
    slider.addEventListener("input", () => {
      vibeSettings[slider.dataset.vibe] = parseInt(slider.value);
      slider.classList.add("active");
    });
  });

  // Reset vibes
  document.getElementById("resetVibesBtn").addEventListener("click", resetVibes);

  // Genre chips
  document.getElementById("genreGrid").querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const id = parseInt(chip.dataset.genre);
      if (chip.classList.contains("active")) {
        if (!selectedGenres.includes(id)) selectedGenres.push(id);
      } else {
        selectedGenres = selectedGenres.filter(g => g !== id);
      }
      updateFilterCount("genreCount", selectedGenres.length);
    });
  });

  // Decade chips
  document.getElementById("decadeGrid").querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const val = parseInt(chip.dataset.decade);
      if (chip.classList.contains("active")) {
        if (!selectedDecades.includes(val)) selectedDecades.push(val);
      } else {
        selectedDecades = selectedDecades.filter(d => d !== val);
      }
      updateFilterCount("decadeCount", selectedDecades.length);
    });
  });

  // Filter toggles
  setupFilterToggle("genreToggle", "genreGrid");
  setupFilterToggle("decadeToggle", "decadeGrid");

  // Spin button
  document.getElementById("spinBtn").addEventListener("click", startSpin);

  // Swipe buttons
  document.getElementById("swipeLoveBtn").addEventListener("click", () => handleSwipe("like"));
  document.getElementById("swipePassBtn").addEventListener("click", () => handleSwipe("dislike"));

  // Result actions
  document.getElementById("spinAgainBtn").addEventListener("click", startSpin);
  document.getElementById("adjustBtn").addEventListener("click", showConfig);
  document.getElementById("exploreBtn").addEventListener("click", openMovieCubeOverlay);

  // Modals
  document.getElementById("helpBtn").addEventListener("click", () => showModal("helpModal"));
  document.getElementById("helpClose").addEventListener("click", () => hideModal("helpModal"));
  document.getElementById("historyBtn").addEventListener("click", () => {
    renderHistory();
    showModal("historyModal");
  });
  document.getElementById("historyClose").addEventListener("click", () => hideModal("historyModal"));
  document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Streaming filter init
  initStreamingFilter();
});

// ============================================
// STREAMING FILTER
// ============================================

function initStreamingFilter() {
  const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
  const scope = JSON.parse(localStorage.getItem("orbit_preferences_scope") || "{}");
  const savedToggle = localStorage.getItem("orbit_randomizer_streaming_filter");
  const toggle = document.getElementById("streamingToggle");

  // Default: active if user has providers AND scope says randomizer
  if (savedToggle !== null) {
    streamingFilterActive = savedToggle === "true";
  } else {
    streamingFilterActive = providers.length > 0 && scope.randomizer !== false;
  }

  toggle.classList.toggle("active", streamingFilterActive);

  // Toggle handler
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
    localStorage.setItem("orbit_randomizer_streaming_filter", String(streamingFilterActive));
  });

  // Intro tooltip (first visit only)
  if (providers.length > 0 && !localStorage.getItem("orbit_randomizer_intro_seen")) {
    const intro = document.getElementById("streamingIntro");
    intro.hidden = false;

    const dismiss = () => {
      intro.hidden = true;
      localStorage.setItem("orbit_randomizer_intro_seen", "true");
    };

    document.getElementById("dismissIntro").addEventListener("click", dismiss);
    setTimeout(dismiss, 5000);
  }
}

async function filterByStreaming(movies) {
  if (!streamingFilterActive) return movies;

  const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
  const country = localStorage.getItem("orbit_user_country") || "US";
  if (!providers.length) return movies;

  const providerSet = new Set(providers);
  const results = [];
  const batch = movies.slice(0, 20);

  const checks = await Promise.all(
    batch.map(m =>
      fetch(`https://api.themoviedb.org/3/movie/${m.id}/watch/providers?api_key=${TMDB_API_KEY}`)
        .then(r => r.json()).catch(() => null)
    )
  );

  for (let i = 0; i < batch.length; i++) {
    const wp = checks[i];
    if (!wp?.results?.[country]) continue;
    const flatrate = wp.results[country].flatrate || [];
    if (flatrate.some(p => providerSet.has(p.provider_id))) {
      results.push(batch[i]);
    }
  }

  return results;
}

// ============================================
// UI HELPERS
// ============================================

function resetVibes() {
  vibeSettings = { mood: 50, pace: 50, depth: 50, familiar: 50 };
  document.querySelectorAll(".vibe-slider").forEach(s => {
    s.value = 50;
    s.classList.remove("active");
  });
}

function setupFilterToggle(toggleId, gridId) {
  const toggle = document.getElementById(toggleId);
  const grid = document.getElementById(gridId);
  toggle.addEventListener("click", () => {
    const open = !grid.hidden;
    grid.hidden = open;
    toggle.classList.toggle("open", !open);
  });
}

function updateFilterCount(elementId, count) {
  const el = document.getElementById(elementId);
  el.textContent = count > 0 ? `(${count})` : "";
}

function showModal(id) { document.getElementById(id).hidden = false; }
function hideModal(id) { document.getElementById(id).hidden = true; }

function showConfig() {
  configSection.hidden = false;
  spinningSection.hidden = true;
  resultSection.hidden = true;
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
    random: "Rolling the cosmic dice",
    hidden: "Unearthing hidden treasures",
    classic: "Revisiting the golden age",
    favorites: "Picking from your loved movies"
  };
  spinnerSubtext.textContent = subtexts[currentMode] || "Searching...";

  try {
    const movie = await fetchRandomMovie();
    // Artificial delay for drama
    await new Promise(r => setTimeout(r, 1500));
    if (movie) {
      displayResult(movie);
    } else if (currentMode === "favorites") {
      const msg = selectedGenres.length > 0 || selectedDecades.length > 0
        ? "No favorites match your current filters. Try removing some filters!"
        : "You haven't liked any movies yet. Explore and swipe to build your favorites.";
      showError(msg);
    } else {
      showError("No movies found. Try adjusting your filters.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  }
}

function showError(msg) {
  spinningSection.hidden = true;
  configSection.hidden = false;
  alert(msg);
}

// ============================================
// TMDB FETCHING
// ============================================

async function fetchRandomMovie() {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      let movie;
      switch (currentMode) {
        case "mood": movie = await fetchMoodMatchMovie(); break;
        case "random": movie = await fetchPureRandomMovie(); break;
        case "hidden": movie = await fetchHiddenGemMovie(); break;
        case "classic": movie = await fetchClassicMovie(); break;
        case "favorites": movie = await fetchFavoriteMovie(); break;
      }
      if (movie && !isInRecentHistory(movie.id)) return movie;
    } catch (e) { console.warn("Attempt failed:", e); }
  }
  // Last resort: return whatever we get
  switch (currentMode) {
    case "mood": return await fetchMoodMatchMovie();
    case "random": return await fetchPureRandomMovie();
    case "hidden": return await fetchHiddenGemMovie();
    case "classic": return await fetchClassicMovie();
    case "favorites": return await fetchFavoriteMovie();
  }
}

function isInRecentHistory(id) {
  return recentSpins.some(s => s.id === id);
}

function buildDateFilter() {
  if (selectedDecades.length === 0) return {};
  let minYear = 9999, maxYear = 0;
  for (const d of selectedDecades) {
    if (d === 0) { minYear = Math.min(minYear, 1800); maxYear = Math.max(maxYear, 1939); }
    else { minYear = Math.min(minYear, d); maxYear = Math.max(maxYear, d + 9); }
  }
  return {
    "primary_release_date.gte": `${minYear}-01-01`,
    "primary_release_date.lte": `${maxYear}-12-31`
  };
}

function buildBaseParams() {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    include_adult: "false",
    include_video: "false"
  });
  if (selectedGenres.length > 0) {
    params.set("with_genres", selectedGenres.join(","));
  }
  const dates = buildDateFilter();
  for (const [k, v] of Object.entries(dates)) params.set(k, v);
  return params;
}

async function fetchMoodMatchMovie() {
  const params = buildBaseParams();
  params.set("sort_by", "popularity.desc");

  // Use familiarity slider to control popularity range
  const fam = vibeSettings.familiar;
  if (fam > 70) {
    // Challenge: less popular
    params.set("vote_count.gte", "30");
    params.set("vote_count.lte", "2000");
  } else if (fam < 30) {
    // Familiar: popular
    params.set("vote_count.gte", "500");
  } else {
    params.set("vote_count.gte", "100");
  }

  params.set("vote_average.gte", "5.0");

  // Get vibe-aligned genres if no user selection
  if (selectedGenres.length === 0) {
    const vibeGenres = getVibeBasedGenres();
    if (vibeGenres.length > 0) params.set("with_genres", vibeGenres.join("|"));
  }

  const page = Math.floor(Math.random() * 5) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  let movies = (data.results || []).filter(m => m.poster_path);
  movies = await filterByStreaming(movies);

  if (!movies.length) return null;

  // Score and pick from top 5
  const scored = movies.map(m => ({ ...m, vibeScore: calculateVibeScore(m) }));
  scored.sort((a, b) => b.vibeScore - a.vibeScore);
  const top = scored.slice(0, 5);
  const pick = top[Math.floor(Math.random() * top.length)];

  return await fetchFullDetails(pick.id, pick.vibeScore);
}

async function fetchPureRandomMovie() {
  const params = buildBaseParams();
  params.set("sort_by", "popularity.desc");
  params.set("vote_count.gte", "50");

  const page = Math.floor(Math.random() * 100) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  const maxPage = Math.min(data.total_pages || 1, 500);
  const actualPage = Math.min(page, maxPage);

  let movies = (data.results || []).filter(m => m.poster_path);
  if (!movies.length && actualPage !== page) {
    params.set("page", Math.floor(Math.random() * maxPage) + 1);
    const res2 = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
    const data2 = await res2.json();
    movies = (data2.results || []).filter(m => m.poster_path);
  }

  movies = await filterByStreaming(movies);
  if (!movies.length) return null;
  const pick = movies[Math.floor(Math.random() * movies.length)];
  return await fetchFullDetails(pick.id);
}

async function fetchHiddenGemMovie() {
  const params = buildBaseParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "100");
  params.set("vote_count.lte", "1500");
  params.set("vote_average.gte", "7.0");

  const page = Math.floor(Math.random() * 10) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  let movies = (data.results || []).filter(m => m.poster_path);
  movies = await filterByStreaming(movies);

  if (!movies.length) return null;
  const pick = movies[Math.floor(Math.random() * movies.length)];
  return await fetchFullDetails(pick.id);
}

async function fetchClassicMovie() {
  const params = buildBaseParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "500");
  params.set("vote_average.gte", "7.5");

  // Override date filter for classic mode
  if (selectedDecades.length === 0) {
    params.set("primary_release_date.lte", "1999-12-31");
  }

  const page = Math.floor(Math.random() * 10) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  let movies = (data.results || []).filter(m => m.poster_path);
  movies = await filterByStreaming(movies);

  if (!movies.length) return null;
  const pick = movies[Math.floor(Math.random() * movies.length)];
  return await fetchFullDetails(pick.id);
}

async function fetchFavoriteMovie() {
  if (typeof SwipeMemory === "undefined") return null;

  const likedIds = SwipeMemory.getLikedIds();
  if (!likedIds || likedIds.length === 0) return null;

  let eligibleIds = likedIds;

  if (selectedGenres.length > 0 || selectedDecades.length > 0) {
    const details = await Promise.all(
      likedIds.slice(0, 50).map(id => fetchFullDetails(id).catch(() => null))
    );
    eligibleIds = details.filter(m => m && matchesFilters(m)).map(m => m.id);
  }

  if (eligibleIds.length === 0) return null;

  const randomId = eligibleIds[Math.floor(Math.random() * eligibleIds.length)];
  return await fetchFullDetails(randomId);
}

function matchesFilters(movie) {
  if (selectedGenres.length > 0) {
    const movieGenres = (movie.genres || []).map(g => g.id);
    if (!selectedGenres.some(g => movieGenres.includes(g))) return false;
  }
  if (selectedDecades.length > 0) {
    const year = parseInt((movie.release_date || "").split("-")[0]);
    if (!year) return false;
    const decade = Math.floor(year / 10) * 10;
    if (!selectedDecades.some(d => d === 0 ? year < 1940 : decade === d)) return false;
  }
  return true;
}

async function fetchFullDetails(movieId, vibeScore) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
  const movie = await res.json();
  if (vibeScore !== undefined) movie._vibeScore = vibeScore;
  return movie;
}

// ============================================
// VIBE SCORING
// ============================================

function calculateVibeScore(movie) {
  const genres = (movie.genre_ids || []);
  if (!genres.length) return 50;

  let movieMood = 50, moviePace = 50, movieDepth = 50;
  let moodCount = 0, paceCount = 0, depthCount = 0;

  for (const gid of genres) {
    if (GENRE_VIBES.mood[gid] !== undefined) { movieMood += GENRE_VIBES.mood[gid]; moodCount++; }
    if (GENRE_VIBES.pace[gid] !== undefined) { moviePace += GENRE_VIBES.pace[gid]; paceCount++; }
    if (GENRE_VIBES.depth[gid] !== undefined) { movieDepth += GENRE_VIBES.depth[gid]; depthCount++; }
  }

  if (moodCount) movieMood = (movieMood - 50) / moodCount;
  else movieMood = 50;
  if (paceCount) moviePace = (moviePace - 50) / paceCount;
  else moviePace = 50;
  if (depthCount) movieDepth = (movieDepth - 50) / depthCount;
  else movieDepth = 50;

  const moodDiff = Math.abs(movieMood - vibeSettings.mood);
  const paceDiff = Math.abs(moviePace - vibeSettings.pace);
  const depthDiff = Math.abs(movieDepth - vibeSettings.depth);

  const weightedDiff = (moodDiff * 1.2 + paceDiff * 0.8 + depthDiff * 1.2) / 3.2;
  const score = Math.max(0, Math.min(100, Math.round(100 - weightedDiff)));
  return score;
}

function getVibeBasedGenres() {
  const result = [];
  const threshold = 20; // Only include genres that are near the user's vibe

  for (const dim of ["mood", "pace", "depth"]) {
    const userVal = vibeSettings[dim];
    for (const [gidStr, val] of Object.entries(GENRE_VIBES[dim])) {
      if (Math.abs(val - userVal) < threshold) {
        const gid = parseInt(gidStr);
        if (!result.includes(gid)) result.push(gid);
      }
    }
  }

  return result.slice(0, 5); // Limit to avoid overly narrow results
}

// ============================================
// DISPLAY RESULT
// ============================================

function displayResult(movie) {
  currentMovie = movie;
  spinningSection.hidden = true;
  resultSection.hidden = false;

  // Poster
  const poster = document.getElementById("resultPoster");
  poster.src = movie.poster_path ? `${TMDB_IMG}w500${movie.poster_path}` : "";
  poster.alt = movie.title || "";

  // Backdrop
  if (movie.backdrop_path) {
    document.querySelector(".game-backdrop").style.backgroundImage =
      `url(${TMDB_IMG}w1280${movie.backdrop_path})`;
  }

  // Rating
  const rating = movie.vote_average || 0;
  document.getElementById("ratingValue").textContent = rating.toFixed(1);
  const badge = document.getElementById("resultRating");
  badge.style.display = rating > 0 ? "inline-flex" : "none";

  // Title
  document.getElementById("resultTitle").textContent = movie.title || "Unknown";

  // Meta
  const year = (movie.release_date || "").split("-")[0];
  const runtime = movie.runtime ? `${movie.runtime} min` : "";
  const parts = [year, runtime].filter(Boolean);
  document.getElementById("resultMeta").textContent = parts.join(" \u00B7 ");

  // Genres
  const genresEl = document.getElementById("resultGenres");
  const genres = movie.genres || [];
  genresEl.innerHTML = genres.map(g => `<span class="genre-tag">${g.name}</span>`).join("");

  // Overview
  document.getElementById("resultOverview").textContent = movie.overview || "No overview available.";

  // Match indicator (mood mode only)
  const matchEl = document.getElementById("matchIndicator");
  if (currentMode === "mood" && movie._vibeScore !== undefined) {
    matchEl.hidden = false;
    const pct = movie._vibeScore;
    document.getElementById("matchFill").style.width = pct + "%";
    document.getElementById("matchPct").textContent = pct + "%";
  } else {
    matchEl.hidden = true;
  }

  // Swipe button states
  if (typeof SwipeMemory !== "undefined") {
    const existing = SwipeMemory.getPreference(movie.id);
    document.getElementById("swipeLoveBtn").classList.toggle("active", existing === "liked");
    document.getElementById("swipePassBtn").classList.toggle("active", existing === "disliked");
  } else {
    document.getElementById("swipeLoveBtn").classList.remove("active");
    document.getElementById("swipePassBtn").classList.remove("active");
  }

  // Streaming providers
  const providerEl = document.getElementById("streamingProviders");
  providerEl.innerHTML = '';
  fetchStreamingProviders(movie.id, "movie").then(providers => {
    renderStreamingLogos(providers, providerEl);
  });

  // Add to history
  addToHistory(movie);
}

function handleSwipe(preference) {
  if (!currentMovie || typeof SwipeMemory === "undefined") return;

  SwipeMemory.setPreference(currentMovie.id, preference, currentMovie);

  document.getElementById("swipeLoveBtn").classList.toggle("active", preference === "like");
  document.getElementById("swipePassBtn").classList.toggle("active", preference === "dislike");

  if (preference === "dislike") {
    setTimeout(() => startSpin(), 500);
  }
  if (preference === "like") {
    showSwipeFeedback("Added to your favorites!");
  }
}

function showSwipeFeedback(message) {
  const toast = document.createElement("div");
  toast.className = "swipe-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ============================================
// MOVIE CUBE
// ============================================

let movieCubeInitialized = false;

function openMovieCubeOverlay() {
  if (!currentMovie) return;

  if (typeof initMovieCube !== "function") {
    // Fallback to timeline if moviecube not loaded
    localStorage.setItem("timelineMovieId", currentMovie.id);
    localStorage.setItem("timelineType", "movie");
    window.location.href = "games/timeline.html";
    return;
  }

  if (!movieCubeInitialized) {
    initMovieCube({
      onPersonClick: (personId) => {
        localStorage.setItem("timelineMovieId", personId);
        localStorage.setItem("timelineType", "person");
        window.location.href = "games/timeline.html";
      },
      onAnchorClick: (movie) => {
        openMovieCube(movie.id);
      }
    });
    movieCubeInitialized = true;
  }

  openMovieCube(currentMovie.id);
}

// ============================================
// HISTORY
// ============================================

function addToHistory(movie) {
  const entry = {
    id: movie.id,
    title: movie.title || "Unknown",
    year: (movie.release_date || "").split("-")[0],
    poster: movie.poster_path || "",
    timestamp: Date.now()
  };

  // Remove duplicate
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
  list.innerHTML = recentSpins.map(s => {
    const img = s.poster ? `${TMDB_IMG}w92${s.poster}` : "";
    return `<div class="history-item" data-id="${s.id}">
      ${img ? `<img class="history-poster" src="${img}" alt="">` : '<div class="history-poster"></div>'}
      <div class="history-info">
        <div class="history-title">${s.title}</div>
        <div class="history-sub">${s.year} &middot; ${timeAgo(s.timestamp)}</div>
      </div>
    </div>`;
  }).join("");

  list.querySelectorAll(".history-item").forEach(item => {
    item.addEventListener("click", async () => {
      hideModal("historyModal");
      configSection.hidden = true;
      resultSection.hidden = true;
      spinningSection.hidden = false;
      spinnerSubtext.textContent = "Loading from history...";
      try {
        const movie = await fetchFullDetails(parseInt(item.dataset.id));
        await new Promise(r => setTimeout(r, 800));
        displayResult(movie);
      } catch (e) {
        showError("Failed to load movie details.");
      }
    });
  });
}

function clearHistory() {
  recentSpins = [];
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}
