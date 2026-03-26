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
let lastPool = [];
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

  // Result actions
  document.getElementById("respinBtn").addEventListener("click", respin);
  document.getElementById("adjustBtn").addEventListener("click", showConfig);

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
    const pool = await fetchMoviePool();
    // Artificial delay for drama
    await new Promise(r => setTimeout(r, 1500));
    if (pool && pool.length) {
      lastPool = pool;
      const picks = pickThree(pool);
      displayResults(picks);
    } else if (currentMode === "favorites") {
      const msg = selectedGenres.length > 0 || selectedDecades.length > 0
        ? "No favorites match your current filters. Try removing some filters!"
        : "You haven't loved any movies yet. Explore and mark favorites to build your collection.";
      showError(msg);
    } else {
      showError("No movies found. Try adjusting your filters.");
    }
  } catch (err) {
    console.error(err);
    showError("Something went wrong. Please try again.");
  }
}

function respin() {
  if (!lastPool.length) { startSpin(); return; }
  const picks = pickThree(lastPool);
  displayResults(picks);
}

function showError(msg) {
  spinningSection.hidden = true;
  configSection.hidden = false;
  alert(msg);
}

// ============================================
// TMDB FETCHING
// ============================================

async function fetchMoviePool() {
  switch (currentMode) {
    case "mood": return await fetchMoodPool();
    case "random": return await fetchPureRandomPool();
    case "hidden": return await fetchHiddenGemPool();
    case "classic": return await fetchClassicPool();
    case "favorites": return await fetchFavoritePool();
    default: return [];
  }
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickThree(pool) {
  const seen = new Set();
  const picks = [];
  const shuffled = shuffleArray(pool);
  for (const m of shuffled) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      picks.push(m);
      if (picks.length === 3) break;
    }
  }
  return picks;
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

async function fetchMoodPool() {
  const params = buildBaseParams();
  params.set("sort_by", "popularity.desc");

  const fam = vibeSettings.familiar;
  if (fam > 70) {
    params.set("vote_count.gte", "30");
    params.set("vote_count.lte", "2000");
  } else if (fam < 30) {
    params.set("vote_count.gte", "500");
  } else {
    params.set("vote_count.gte", "100");
  }

  params.set("vote_average.gte", "5.0");

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

  // Attach vibe scores and sort best-first
  return movies.map(m => ({ ...m, _vibeScore: calculateVibeScore(m) }))
    .sort((a, b) => b._vibeScore - a._vibeScore);
}

async function fetchPureRandomPool() {
  const params = buildBaseParams();
  params.set("sort_by", "popularity.desc");
  params.set("vote_count.gte", "50");

  const page = Math.floor(Math.random() * 100) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  const maxPage = Math.min(data.total_pages || 1, 500);

  let movies = (data.results || []).filter(m => m.poster_path);
  if (!movies.length && Math.min(page, maxPage) !== page) {
    params.set("page", Math.floor(Math.random() * maxPage) + 1);
    const res2 = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
    const data2 = await res2.json();
    movies = (data2.results || []).filter(m => m.poster_path);
  }

  movies = await filterByStreaming(movies);
  return movies;
}

async function fetchHiddenGemPool() {
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
  return movies;
}

async function fetchClassicPool() {
  const params = buildBaseParams();
  params.set("sort_by", "vote_average.desc");
  params.set("vote_count.gte", "500");
  params.set("vote_average.gte", "7.5");

  if (selectedDecades.length === 0) {
    params.set("primary_release_date.lte", "1999-12-31");
  }

  const page = Math.floor(Math.random() * 10) + 1;
  params.set("page", page);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`);
  const data = await res.json();
  let movies = (data.results || []).filter(m => m.poster_path);
  movies = await filterByStreaming(movies);
  return movies;
}

async function fetchFavoritePool() {
  if (typeof getLovedMovies !== "function") return [];

  const lovedMovies = getLovedMovies();
  if (!lovedMovies || lovedMovies.length === 0) return [];

  if (selectedGenres.length > 0 || selectedDecades.length > 0) {
    const details = await Promise.all(
      lovedMovies.slice(0, 50).map(m =>
        fetchFullDetails(m.id).catch(() => null)
      )
    );
    return details.filter(m => m && m.poster_path && matchesFilters(m));
  }

  // Build lightweight pool from loved movie data
  return lovedMovies.filter(m => m.poster).map(m => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster,
    release_date: m.year ? String(m.year) : "",
    vote_average: 0,
    genre_ids: m.genres || [],
    overview: ""
  }));
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

function displayResults(movies) {
  spinningSection.hidden = true;
  resultSection.hidden = false;

  // Use first movie's backdrop if available
  const backdrop = movies.find(m => m.backdrop_path);
  if (backdrop) {
    document.querySelector(".game-backdrop").style.backgroundImage =
      `url(${TMDB_IMG}w1280${backdrop.backdrop_path})`;
  }

  const container = document.getElementById("resultPicks");
  container.innerHTML = movies.map(movie => {
    const year = (movie.release_date || "").split("-")[0];
    const rating = movie.vote_average || 0;

    // Resolve genre names from genre_ids (discover) or genres (full details)
    const genreNames = (movie.genre_ids || [])
      .map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3)
      .join(", ")
      || (movie.genres || []).map(g => g.name).slice(0, 3).join(", ");

    const meta = [year, genreNames].filter(Boolean).join(" \u00B7 ");

    const matchHtml = (currentMode === "mood" && movie._vibeScore !== undefined)
      ? `<div class="pick-match">${movie._vibeScore}% match</div>`
      : "";

    return `<div class="pick-card" data-id="${movie.id}">
      <div class="pick-poster-wrap">
        <img class="pick-poster" src="${movie.poster_path ? TMDB_IMG + 'w342' + movie.poster_path : ''}" alt="${movie.title || ''}">
        ${rating > 0 ? `<div class="pick-rating"><span class="rating-star">&#x2605;</span> ${rating.toFixed(1)}</div>` : ""}
        ${matchHtml}
      </div>
      <div class="pick-info">
        <h3 class="pick-title">${movie.title || "Unknown"}</h3>
        <div class="pick-meta">${meta}</div>
        ${movie.overview ? `<p class="pick-overview">${movie.overview}</p>` : ""}
      </div>
    </div>`;
  }).join("");

  // Card click → Movie Cube
  container.querySelectorAll(".pick-card").forEach(card => {
    card.addEventListener("click", () => {
      const movieId = parseInt(card.dataset.id);
      openMovieCubeForId(movieId);
    });
  });

  // Add all picks to history
  movies.forEach(m => addToHistory(m));
}

// ============================================
// MOVIE CUBE
// ============================================

let movieCubeInitialized = false;

function openMovieCubeForId(movieId) {
  if (typeof initMovieCube !== "function") {
    localStorage.setItem("timelineMovieId", movieId);
    localStorage.setItem("timelineType", "movie");
    window.location.href = "timeline.html";
    return;
  }

  if (!movieCubeInitialized) {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        openMovieCube(movie.id);
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();
    movieCubeInitialized = true;
  }

  openMovieCube(movieId);
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
    item.addEventListener("click", () => {
      hideModal("historyModal");
      openMovieCubeForId(parseInt(item.dataset.id));
    });
  });
}

function clearHistory() {
  recentSpins = [];
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}
