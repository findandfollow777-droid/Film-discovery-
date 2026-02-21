// ============================================
// RE-RANDOMIZER - Comfort Shows Episode Picker
// ============================================

const COMFORT_KEY = "orbit_comfort_list";

// State
let comfortList = [];
let currentMood = "any";
let currentShow = null;
let currentEpisode = null;
let editingShowId = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  loadComfortList();
  renderUI();
  setupEventListeners();
});

function loadComfortList() {
  const saved = localStorage.getItem(COMFORT_KEY);
  comfortList = saved ? JSON.parse(saved) : [];
}

function saveComfortList() {
  localStorage.setItem(COMFORT_KEY, JSON.stringify(comfortList));
}

function renderUI() {
  const hasShows = comfortList.length > 0;

  document.getElementById("emptyComfort").hidden = hasShows;
  document.getElementById("comfortListSection").hidden = !hasShows;
  document.getElementById("moodSection").hidden = !hasShows;
  document.getElementById("reSpinBtn").hidden = !hasShows;
  document.getElementById("spinningSection").hidden = true;
  document.getElementById("resultSection").hidden = true;

  if (hasShows) {
    renderComfortList();
  }
}

function renderComfortList() {
  const grid = document.getElementById("comfortGrid");

  grid.innerHTML = comfortList.map(show => {
    const seasonText = show.selectedSeasons.length === show.totalSeasons
      ? `All ${show.totalSeasons} seasons`
      : `${show.selectedSeasons.length} of ${show.totalSeasons} seasons`;

    return `
      <div class="comfort-card" data-show-id="${show.id}">
        <img
          class="comfort-poster"
          src="${show.poster ? TMDB_IMG + 'w92' + show.poster : ''}"
          alt="${show.name}"
          onerror="this.style.opacity='0.3'"
        >
        <div class="comfort-info">
          <div class="comfort-title">${show.name}</div>
          <div class="comfort-seasons">${seasonText}</div>
        </div>
        <div class="comfort-actions">
          <button class="comfort-edit" data-show-id="${show.id}" title="Edit seasons">⚙</button>
          <button class="comfort-remove" data-show-id="${show.id}" title="Remove">✕</button>
        </div>
      </div>
    `;
  }).join("");

  // Attach handlers
  grid.querySelectorAll(".comfort-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSeasonModal(parseInt(btn.dataset.showId));
    });
  });

  grid.querySelectorAll(".comfort-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeShow(parseInt(btn.dataset.showId));
    });
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Add show buttons
  document.getElementById("addComfortBtnEmpty")?.addEventListener("click", openAddShowModal);
  document.getElementById("addComfortBtn")?.addEventListener("click", openAddShowModal);

  // Modal closes
  document.getElementById("addShowClose")?.addEventListener("click", () => hideModal("addShowModal"));
  document.getElementById("seasonClose")?.addEventListener("click", () => hideModal("seasonModal"));
  document.getElementById("helpClose")?.addEventListener("click", () => hideModal("helpModal"));

  // Search input
  const searchInput = document.getElementById("showSearchInput");
  let searchTimeout;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchShows(searchInput.value), 300);
  });

  // Season modal actions
  document.getElementById("selectAllSeasons")?.addEventListener("click", selectAllSeasons);
  document.getElementById("deselectAllSeasons")?.addEventListener("click", deselectAllSeasons);
  document.getElementById("saveSeasonsBtn")?.addEventListener("click", saveSeasons);

  // Mood chips
  document.querySelectorAll(".mood-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".mood-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentMood = chip.dataset.mood;
    });
  });

  // Spin button
  document.getElementById("reSpinBtn")?.addEventListener("click", () => pickRandomEpisode());

  // Result actions
  document.getElementById("pickAnotherBtn")?.addEventListener("click", () => pickRandomEpisode());
  document.getElementById("pickFromSameBtn")?.addEventListener("click", () => pickRandomEpisode(currentShow?.id));
  document.getElementById("backToListBtn")?.addEventListener("click", renderUI);

  // Help modal
  document.getElementById("helpBtn")?.addEventListener("click", () => showModal("helpModal"));

  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

// ============================================
// ADD SHOW FLOW
// ============================================

function openAddShowModal() {
  document.getElementById("showSearchInput").value = "";
  document.getElementById("showSearchResults").innerHTML = "";
  showModal("addShowModal");
  document.getElementById("showSearchInput").focus();
}

async function searchShows(query) {
  if (query.length < 2) {
    document.getElementById("showSearchResults").innerHTML = "";
    return;
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  const results = document.getElementById("showSearchResults");
  const shows = data.results?.slice(0, 8) || [];

  if (shows.length === 0) {
    results.innerHTML = '<p class="no-results">No shows found</p>';
    return;
  }

  results.innerHTML = shows.map(show => `
    <div class="search-result-item" data-show-id="${show.id}">
      <img
        class="search-result-poster"
        src="${show.poster_path ? TMDB_IMG + 'w92' + show.poster_path : ''}"
        alt=""
        onerror="this.style.opacity='0.3'"
      >
      <div class="search-result-info">
        <div class="search-result-title">${show.name}</div>
        <div class="search-result-year">${(show.first_air_date || '').split('-')[0]}</div>
      </div>
    </div>
  `).join("");

  // Attach click handlers
  results.querySelectorAll(".search-result-item").forEach(item => {
    item.addEventListener("click", () => addShow(parseInt(item.dataset.showId)));
  });
}

async function addShow(showId) {
  // Check if already added
  if (comfortList.find(s => s.id === showId)) {
    alert("This show is already in your comfort list!");
    return;
  }

  // Fetch full details
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}`
  );
  const show = await res.json();

  // Add with all seasons selected by default
  const allSeasons = Array.from({ length: show.number_of_seasons }, (_, i) => i + 1);

  comfortList.push({
    id: show.id,
    name: show.name,
    poster: show.poster_path,
    totalSeasons: show.number_of_seasons,
    selectedSeasons: allSeasons,
    addedAt: Date.now()
  });

  saveComfortList();
  hideModal("addShowModal");
  renderUI();

  // Immediately open season modal for fine-tuning
  openSeasonModal(showId);
}

function removeShow(showId) {
  if (!confirm("Remove this show from your comfort list?")) return;

  comfortList = comfortList.filter(s => s.id !== showId);
  saveComfortList();
  renderUI();
}

// ============================================
// SEASON SELECTION
// ============================================

function openSeasonModal(showId) {
  editingShowId = showId;
  const show = comfortList.find(s => s.id === showId);
  if (!show) return;

  document.getElementById("seasonShowTitle").textContent = show.name;

  const grid = document.getElementById("seasonGrid");
  grid.innerHTML = "";

  for (let i = 1; i <= show.totalSeasons; i++) {
    const chip = document.createElement("button");
    chip.className = "season-chip" + (show.selectedSeasons.includes(i) ? " active" : "");
    chip.dataset.season = i;
    chip.textContent = `Season ${i}`;
    chip.addEventListener("click", () => toggleSeason(i));
    grid.appendChild(chip);
  }

  showModal("seasonModal");
}

function toggleSeason(seasonNum) {
  const show = comfortList.find(s => s.id === editingShowId);
  if (!show) return;

  const idx = show.selectedSeasons.indexOf(seasonNum);
  if (idx > -1) {
    show.selectedSeasons.splice(idx, 1);
  } else {
    show.selectedSeasons.push(seasonNum);
    show.selectedSeasons.sort((a, b) => a - b);
  }

  // Update chip UI
  const chip = document.querySelector(`.season-chip[data-season="${seasonNum}"]`);
  if (chip) chip.classList.toggle("active");
}

function selectAllSeasons() {
  const show = comfortList.find(s => s.id === editingShowId);
  if (!show) return;

  show.selectedSeasons = Array.from({ length: show.totalSeasons }, (_, i) => i + 1);
  document.querySelectorAll(".season-chip").forEach(c => c.classList.add("active"));
}

function deselectAllSeasons() {
  const show = comfortList.find(s => s.id === editingShowId);
  if (!show) return;

  show.selectedSeasons = [];
  document.querySelectorAll(".season-chip").forEach(c => c.classList.remove("active"));
}

function saveSeasons() {
  const show = comfortList.find(s => s.id === editingShowId);

  if (!show || show.selectedSeasons.length === 0) {
    alert("Please select at least one season!");
    return;
  }

  saveComfortList();
  renderComfortList();
  hideModal("seasonModal");
}

// ============================================
// RANDOM EPISODE PICKER
// ============================================

async function pickRandomEpisode(specificShowId = null) {
  // Show spinner
  document.getElementById("comfortListSection").hidden = true;
  document.getElementById("moodSection").hidden = true;
  document.getElementById("reSpinBtn").hidden = true;
  document.getElementById("resultSection").hidden = true;
  document.getElementById("spinningSection").hidden = false;

  try {
    // Determine which shows to pick from
    const eligibleShows = specificShowId
      ? comfortList.filter(s => s.id === specificShowId)
      : comfortList;

    if (eligibleShows.length === 0) {
      throw new Error("No shows available");
    }

    // Pick a random show (could weight by episode count for fairness)
    const randomShow = eligibleShows[Math.floor(Math.random() * eligibleShows.length)];

    // Pick a random season from selected seasons
    const randomSeason = randomShow.selectedSeasons[
      Math.floor(Math.random() * randomShow.selectedSeasons.length)
    ];

    // Fetch season episodes
    const seasonRes = await fetch(
      `https://api.themoviedb.org/3/tv/${randomShow.id}/season/${randomSeason}?api_key=${TMDB_API_KEY}`
    );
    const seasonData = await seasonRes.json();

    const episodes = seasonData.episodes || [];
    if (episodes.length === 0) {
      throw new Error("No episodes found");
    }

    // Pick random episode
    const randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];

    // Store state
    currentShow = randomShow;
    currentEpisode = {
      ...randomEpisode,
      showName: randomShow.name,
      showId: randomShow.id
    };

    // Artificial delay for drama
    await new Promise(r => setTimeout(r, 1200));

    // Display result
    displayEpisodeResult(currentEpisode);

  } catch (err) {
    console.error("Pick error:", err);
    alert("Something went wrong. Please try again!");
    renderUI();
  }
}

function displayEpisodeResult(episode) {
  document.getElementById("spinningSection").hidden = true;
  document.getElementById("resultSection").hidden = false;

  // Episode still
  const still = document.getElementById("episodeStill");
  const placeholder = document.getElementById("noStillPlaceholder");

  if (episode.still_path) {
    still.src = `${TMDB_IMG}w500${episode.still_path}`;
    still.hidden = false;
    placeholder.hidden = true;
  } else {
    still.hidden = true;
    placeholder.hidden = false;
  }

  // Show badge
  document.getElementById("showBadge").textContent = episode.showName;

  // Title
  document.getElementById("episodeTitle").textContent =
    episode.name || `Episode ${episode.episode_number}`;

  // Meta
  const runtime = episode.runtime || "?";
  document.getElementById("episodeMeta").textContent =
    `Season ${episode.season_number}, Episode ${episode.episode_number} · ${runtime} min`;

  // Rating
  const ratingEl = document.getElementById("episodeRating");
  if (episode.vote_average && episode.vote_average > 0) {
    ratingEl.querySelector(".rating-value").textContent = episode.vote_average.toFixed(1);
    ratingEl.style.display = "inline-flex";
  } else {
    ratingEl.style.display = "none";
  }

  // Overview
  document.getElementById("episodeOverview").textContent =
    episode.overview || "No description available.";

  // Streaming providers
  const providerEl = document.getElementById("streamingProviders");
  providerEl.innerHTML = '';
  fetchStreamingProviders(episode.showId, "tv").then(providers => {
    renderStreamingLogos(providers, providerEl);
  });
}

// ============================================
// HELPERS
// ============================================

function showModal(id) {
  document.getElementById(id).hidden = false;
}

function hideModal(id) {
  document.getElementById(id).hidden = true;
}
