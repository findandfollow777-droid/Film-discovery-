/* =============================================
   ORBIT - TV SHOW DISCOVERY
   Complete Application Logic
============================================= */

// =============================================
// TV GENRE MAPPINGS (different IDs from movies!)
// =============================================

const GENRE_MAP = {
  "Action & Adventure": 10759,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Kids": 10762,
  "Mystery": 9648,
  "News": 10763,
  "Reality": 10764,
  "Sci-Fi & Fantasy": 10765,
  "Soap": 10766,
  "Talk": 10767,
  "War & Politics": 10768,
  "Western": 37
};

const GENRE_SVGS = {
  "Action & Adventure": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L8 8M13 3L10 3M13 3L13 6"/><path d="M3 13L8 8M3 13L6 13M3 13L3 10"/></svg>`,
  "Animation": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="8" r="4"/><circle cx="11" cy="7" r="3" opacity="0.6"/></svg>`,
  "Comedy": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M5.5 6.5V6"/><path d="M10.5 6.5V6"/><path d="M5.5 10Q8 12.5 10.5 10"/></svg>`,
  "Crime": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="2"/><line x1="8" y1="8" x2="8" y2="14"/><line x1="5" y1="10" x2="11" y2="10"/></svg>`,
  "Documentary": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="8" y1="12" x2="8" y2="14"/></svg>`,
  "Drama": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3Q5 2 6 4Q7 2 8 3"/><path d="M4 5V5.5"/><path d="M7 5V5.5"/><path d="M4.5 7Q5.5 6 6.5 7"/><path d="M9 9Q11 8 12 10Q13 8 14 9"/><path d="M10 11V11.5"/><path d="M13 11V11.5"/><path d="M10.5 13Q11.5 14 12.5 13"/></svg>`,
  "Family": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5" cy="5" r="2"/><circle cx="11" cy="5" r="2"/><circle cx="8" cy="10" r="1.5"/><path d="M5 7V9Q5 11 8 11.5"/><path d="M11 7V9Q11 11 8 11.5"/></svg>`,
  "Kids": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="4"/><path d="M5 14Q5 10 8 10Q11 10 11 14"/></svg>`,
  "Mystery": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>`,
  "News": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/></svg>`,
  "Reality": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="8" rx="1"/><line x1="6" y1="13" x2="10" y2="13"/><line x1="8" y1="11" x2="8" y2="13"/></svg>`,
  "Sci-Fi & Fantasy": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><ellipse cx="8" cy="8" rx="7" ry="3" transform="rotate(-30 8 8)"/></svg>`,
  "Soap": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14Q1 8 4 4Q6 2 8 5Q10 2 12 4Q15 8 8 14Z"/></svg>`,
  "Talk": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4Q3 2 5 2H11Q13 2 13 4V8Q13 10 11 10H6L3 12Z"/></svg>`,
  "War & Politics": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14L4 6L8 3L12 6L12 14"/><path d="M2 14H14"/><path d="M8 6V9"/><path d="M6.5 7.5H9.5"/></svg>`,
  "Western": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="12" rx="6" ry="2"/><path d="M4 12Q3 8 8 4Q13 8 12 12"/><line x1="3" y1="10" x2="13" y2="10"/></svg>`
};

const KEYWORD_MAP = {
  "Noir": 210024,
  "Gritty": 9715,
  "Dark": 207928,
  "Uplifting": 10683,
  "Quirky": 10683,
  "Suspenseful": 818,
  "Emotional": 3205,
  "Feel-good": 10683,
  "Atmospheric": 9715,
  "Cerebral": 4344,
  "Twisted": 818,
  "Mind-bending": 818
};

// NETWORK ID MAPPINGS
const NETWORK_MAP = {
  "HBO": 49,
  "Netflix": 213,
  "Amazon": 1024,
  "Hulu": 453,
  "Apple TV+": 2552,
  "Disney+": 2739,
  "ABC": 2,
  "NBC": 6,
  "CBS": 16,
  "Fox": 19,
  "FX": 88,
  "AMC": 174,
  "Showtime": 67,
  "BBC One": 4,
  "BBC Two": 332,
  "ITV": 9,
  "Channel 4": 26,
  "Sky Atlantic": 1063,
  "Peacock": 3353,
  "Paramount+": 4330,
  "Max": 3186,
  "Starz": 318
};

const state = {
  filters: [],
  genreLogic: "or"
};

// =============================================
// DOM REFERENCES
// =============================================

const focusOverlay = document.getElementById("focusOverlay");
const focusTitle = document.getElementById("focusTitle");
const focusContent = document.getElementById("focusContent");
const focusCloseButton = document.getElementById("focusCloseButton");
const addToSearchButton = document.getElementById("addToSearchButton");
const orbitPanel = document.getElementById("orbitPanel");
const orbitPanelToggle = document.getElementById("orbitPanelToggle");
const orbitFiltersEmpty = document.getElementById("orbitFiltersEmpty");
const orbitFilters = document.getElementById("orbitFilters");
const orbitPanelActions = document.getElementById("orbitPanelActions");
const launchCard = document.getElementById("launchCard");
const clearAllButton = document.getElementById("clearAllButton");

// Mode toggle is now handled via anchor links in HTML

// =============================================
// SECTION DEFINITIONS
// =============================================

const sectionDefinitions = {
  people: { title: "People", builder: buildPeopleContent },
  genres: { title: "Genres", builder: buildGenresContent },
  networks: { title: "Networks", builder: buildNetworksContent },
  timeAiring: { title: "Time & Airing", builder: buildTimeAiringContent },
  ratingsContent: { title: "Ratings & Content", builder: buildRatingsContentSection },
  regionLanguage: { title: "Region & Language", builder: buildRegionLanguageContent },
  watch: { title: "Watch Providers", builder: buildWatchContent },
  status: { title: "Status", builder: buildStatusContent },
  timeCommitment: { title: "Time Commitment", builder: buildTimeCommitmentContent },
  awards: { title: "Awards", builder: buildAwardsContent }
};

let currentSectionKey = null;

document.querySelectorAll(".section-card:not(.launch-card)").forEach((card) => {
  card.addEventListener("click", () => openFocusCard(card.dataset.section));
});

function openFocusCard(sectionKey) {
  currentSectionKey = sectionKey;
  const def = sectionDefinitions[sectionKey];
  if (!def) return;
  focusContent.innerHTML = "";
  focusTitle.textContent = def.title;
  def.builder(focusContent);
  focusOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeFocusCard() {
  focusOverlay.hidden = true;
  document.body.style.overflow = '';
}

focusCloseButton.addEventListener("click", closeFocusCard);

addToSearchButton.addEventListener("click", () => {
  if (!currentSectionKey) return;
  const labels = collectLabelsForSection(currentSectionKey);
  state.filters = state.filters.filter((f) => f.section !== currentSectionKey);
  labels.forEach((item) => {
    state.filters.push({
      id: `${currentSectionKey}-${item.label}`,
      section: currentSectionKey,
      label: item.label,
      value: item.value
    });
  });
  updateUIFromState();
  closeFocusCard();
});

// =============================================
// UI STATE MANAGEMENT
// =============================================

function updateUIFromState() {
  const hasFilters = state.filters.length > 0;
  launchCard.disabled = !hasFilters;
  if (!hasFilters) {
    orbitFiltersEmpty.hidden = false;
    orbitFilters.hidden = true;
    orbitPanelActions.hidden = true;
  } else {
    orbitFiltersEmpty.hidden = true;
    orbitFilters.hidden = false;
    orbitPanelActions.hidden = false;
    renderFilterChips();
  }
  // Toggle arcade button visibility
  const arcadeBtn = document.getElementById('arcadeButton');
  if (arcadeBtn) arcadeBtn.classList.toggle('hidden', hasFilters);

  const sectionsWithFilters = new Set(state.filters.map((f) => f.section));
  document.querySelectorAll(".section-card:not(.launch-card)").forEach((card) => {
    if (sectionsWithFilters.has(card.dataset.section)) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

function renderFilterChips() {
  orbitFilters.innerHTML = "";
  const container = document.createElement("div");
  container.className = "filter-chips";
  state.filters.forEach((filter) => {
    const chip = document.createElement("div");
    chip.className = "filter-chip";
    chip.innerHTML = `
      <div class="filter-chip-main">
        <div class="filter-chip-section">${sectionDefinitions[filter.section]?.title || filter.section}</div>
        <div class="filter-chip-label">${filter.label}</div>
      </div>
    `;
    const remove = document.createElement("button");
    remove.className = "filter-chip-remove";
    remove.textContent = "✕";
    remove.onclick = () => {
      state.filters = state.filters.filter(f => f.id !== filter.id);
      updateUIFromState();
    };
    chip.appendChild(remove);
    container.appendChild(chip);
  });
  orbitFilters.appendChild(container);
}

orbitPanelToggle.onclick = () => orbitPanel.classList.toggle("collapsed");
clearAllButton.onclick = () => { state.filters = []; updateUIFromState(); };

// =============================================
// LAUNCH ORBIT SEARCH (TV)
// =============================================

launchCard.addEventListener("click", async () => {
  if (launchCard.disabled) return;

  try {
    const queryParams = buildTMDBQueryFromFilters(state.filters);
    const previewUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&${queryParams}&page=1`;
    const previewResponse = await fetch(previewUrl);
    if (!previewResponse.ok) { alert("Search failed — please try again."); return; }
    const previewData = await previewResponse.json();

    const MAX_PAGES = 25;
    const totalAvailable = previewData.total_pages || 0;
    const totalShows = previewData.total_results || 0;

    if (totalAvailable > MAX_PAGES) {
      const proceed = confirm(
        `Your search found ~${totalShows.toLocaleString()} TV shows!\n\n` +
        `We'll show the top 500 results.\n\n` +
        `Tip: Add more filters for more refined results.\n\n` +
        `Continue anyway?`
      );
      if (!proceed) return;
    }

    const hyperspace = document.getElementById('hyperspaceOverlay');
    hyperspace.hidden = false;

    const allShows = [];
    if (previewData.results && previewData.results.length > 0) {
      // Normalize TV fields for compatibility with results page
      previewData.results.forEach(show => {
        show.title = show.name || show.title;
        show.release_date = show.first_air_date || show.release_date;
        show.media_type = "tv";
      });
      allShows.push(...previewData.results);
      const pagesToFetch = Math.min(totalAvailable, MAX_PAGES);

      for (let page = 2; page <= pagesToFetch; page++) {
        const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&${queryParams}&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) break;
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          data.results.forEach(show => {
            show.title = show.name || show.title;
            show.release_date = show.first_air_date || show.release_date;
            show.media_type = "tv";
          });
          allShows.push(...data.results);
        } else break;
      }
    }

    if (allShows.length === 0) {
      hyperspace.hidden = true;
      alert("No TV shows found matching your criteria.");
      return;
    }

    const wasCapped = totalAvailable > MAX_PAGES;
    if (wasCapped) {
      localStorage.setItem("resultsCapped", "true");
      localStorage.setItem("totalAvailable", totalShows.toString());
    } else {
      localStorage.removeItem("resultsCapped");
      localStorage.removeItem("totalAvailable");
    }

    const selectedGenres = getSelectedGenres(state.filters);
    const genresToUse = selectedGenres.length >= 2
      ? selectedGenres.slice(0, 3)
      : getTopGenresFromShows(allShows);

    // Store timeCommitment filter for post-fetch filtering on results page
    // Note: Discover results don't include episode counts/runtimes, so detail fetches
    // would be needed for accurate filtering. For now, store the filter for later use.
    const tcFilter = state.filters.find(f => f.section === "timeCommitment");
    if (tcFilter && tcFilter.value) {
      localStorage.setItem("timeCommitmentFilter", JSON.stringify({
        minHours: tcFilter.value.minHours,
        maxHours: tcFilter.value.maxHours
      }));
    } else {
      localStorage.removeItem("timeCommitmentFilter");
    }

    localStorage.setItem("movies", JSON.stringify(allShows));
    localStorage.setItem("genres", JSON.stringify(genresToUse));
    localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
    localStorage.setItem("mediaType", "tv");

    setTimeout(() => { window.location.href = "games/results.html"; }, 500);
  } catch (err) {
    const hyperspace = document.getElementById('hyperspaceOverlay');
    hyperspace.hidden = true;
    console.error("Launch error:", err);
    alert("Failed to launch orbit. Please try again.");
  }
});

// =============================================
// BUILD TMDB QUERY (TV-specific)
// =============================================

function buildTMDBQueryFromFilters(filters) {
  const params = new URLSearchParams();
  params.append("sort_by", "popularity.desc");
  params.append("include_adult", "false");

  const genreKeywordIds = [];

  filters.forEach(filter => {
    if (!filter.value) return;
    switch(filter.section) {
      case "people":
        if (filter.value.type === "person" && filter.value.id) {
          const paramName = filter.value.role === "cast" ? "with_cast" :
                           filter.value.role === "crew" ? "with_crew" : "with_people";
          const existing = params.get(paramName);
          params.set(paramName, existing ? `${existing},${filter.value.id}` : filter.value.id);
        }
        break;
      case "genres":
        if (filter.value.type === "genre") {
          const genreId = GENRE_MAP[filter.value.name];
          if (genreId) {
            const genreSep = state.genreLogic === "or" ? "|" : ",";
            const existing = params.get("with_genres");
            params.set("with_genres", existing ? `${existing}${genreSep}${genreId}` : String(genreId));
          }
        } else if (filter.value.type === "keyword") {
          const keywordId = KEYWORD_MAP[filter.value.name];
          if (keywordId) genreKeywordIds.push(keywordId);
        }
        break;
      case "networks":
        if (filter.value.type === "network" && filter.value.id) {
          const existing = params.get("with_networks");
          params.set("with_networks", existing ? `${existing}|${filter.value.id}` : filter.value.id);
        }
        break;
      case "timeAiring":
        if (filter.value.type === "year") {
          params.delete("first_air_date.gte");
          params.delete("first_air_date.lte");
          params.set("first_air_date_year", filter.value.year);
        } else if (filter.value.type === "decade") {
          params.delete("first_air_date_year");
          const start = filter.value.decade;
          const end = start + 9;
          params.set("first_air_date.gte", `${start}-01-01`);
          params.set("first_air_date.lte", `${end}-12-31`);
        } else if (filter.value.type === "dateRange") {
          params.delete("first_air_date_year");
          if (filter.value.start) params.set("first_air_date.gte", filter.value.start);
          if (filter.value.end) params.set("first_air_date.lte", filter.value.end);
        } else if (filter.value.type === "currentlyAiring") {
          params.set("air_date.gte", filter.value.start);
          params.set("air_date.lte", filter.value.end);
        }
        break;
      case "ratingsContent":
        if (filter.value.type === "rating") {
          if (filter.value.min !== undefined) params.set("vote_average.gte", filter.value.min);
          if (filter.value.max !== undefined) params.set("vote_average.lte", filter.value.max);
        } else if (filter.value.type === "votes") {
          params.set("vote_count.gte", filter.value.min);
        } else if (filter.value.type === "certification") {
          const existing = params.get("certification");
          params.set("certification", existing ? `${existing}|${filter.value.rating}` : filter.value.rating);
          params.set("certification_country", "US");
        }
        break;
      case "regionLanguage":
        if (filter.value.type === "region") {
          params.set("with_origin_country", filter.value.code);
        } else if (filter.value.type === "language") {
          params.set("with_original_language", filter.value.code);
        }
        break;
      case "watch":
        if (filter.value.type === "provider" && filter.value.id) {
          const existing = params.get("with_watch_providers");
          params.set("with_watch_providers", existing ? `${existing},${filter.value.id}` : filter.value.id);
          if (filter.value.region) params.set("watch_region", filter.value.region);
        }
        break;
      case "timeCommitment":
        // Post-fetch filter — no TMDB query params needed
        break;
      case "status":
        if (filter.value.type === "status") {
          const existing = params.get("with_status");
          params.set("with_status", existing ? `${existing}|${filter.value.code}` : filter.value.code);
        } else if (filter.value.type === "showType") {
          const existing = params.get("with_type");
          params.set("with_type", existing ? `${existing}|${filter.value.code}` : filter.value.code);
        }
        break;
      case "awards":
        break;
    }
  });

  // Merge accumulated keywords
  if (genreKeywordIds.length > 0) params.set("with_keywords", genreKeywordIds.join(","));

  // Inject saved watch providers
  if (!params.has("with_watch_providers")) {
    try {
      const savedProviders = JSON.parse(localStorage.getItem("watchProviders") || "[]");
      const savedCountry = localStorage.getItem("watchCountry");
      if (savedProviders.length > 0 && savedCountry) {
        params.set("with_watch_providers", savedProviders.map(p => p.id).join("|"));
        params.set("watch_region", savedCountry);
      }
    } catch (e) {}
  }

  return params.toString();
}

function getSelectedGenres(filters) {
  return filters
    .filter(f => f.section === "genres" && f.value.type === "genre")
    .map(f => GENRE_MAP[f.value.name])
    .filter(id => id !== undefined);
}

function getTopGenresFromShows(shows) {
  const genreCounts = {};
  shows.forEach(show => {
    show.genre_ids?.forEach(id => { genreCounts[id] = (genreCounts[id] || 0) + 1; });
  });
  return Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => parseInt(id));
}

// =============================================
// HELPERS
// =============================================

function makeSectionLabel(text) {
  const label = document.createElement("div");
  label.className = "focus-section-label";
  label.textContent = text;
  return label;
}

function makeChip(label, section, value) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = label;
  chip.dataset.value = JSON.stringify(value);
  chip.addEventListener("click", () => chip.classList.toggle("active"));
  return chip;
}

// =============================================
// 1. PEOPLE SECTION (same as movies)
// =============================================

function buildPeopleContent(root) {
  root.appendChild(makeSectionLabel("People search"));
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 13px; color: var(--muted-silver); margin-bottom: 12px;";
  desc.textContent = "Search for actors, creators, or showrunners.";
  root.appendChild(desc);

  const roleFilter = document.createElement("div");
  roleFilter.style.cssText = "display: flex; gap: 8px; margin-bottom: 12px;";
  const roles = [
    { value: "any", label: "Any Role" },
    { value: "cast", label: "Actor" },
    { value: "crew", label: "Creator/Crew" }
  ];
  let selectedRole = "any";
  roles.forEach(role => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-filter-btn";
    btn.dataset.role = role.value;
    btn.textContent = role.label;
    btn.style.cssText = `padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; border: 1px solid rgba(0, 217, 255, 0.2); background: ${role.value === "any" ? "var(--accent-cyan)" : "rgba(20, 30, 60, 0.5)"}; color: ${role.value === "any" ? "#000" : "var(--film-white)"};`;
    btn.addEventListener("click", () => {
      selectedRole = role.value;
      roleFilter.querySelectorAll(".role-filter-btn").forEach(b => {
        b.style.background = b.dataset.role === selectedRole ? "var(--accent-cyan)" : "rgba(20, 30, 60, 0.5)";
        b.style.color = b.dataset.role === selectedRole ? "#000" : "var(--film-white)";
      });
    });
    roleFilter.appendChild(btn);
  });
  root.appendChild(roleFilter);

  const container = document.createElement("div");
  container.style.position = "relative";
  const row = document.createElement("div");
  row.className = "input-row";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "peopleInput";
  input.placeholder = "Type a name (actor, creator…)";
  input.autocomplete = "off";
  row.appendChild(input);
  container.appendChild(row);
  root.appendChild(container);

  let dropdown = document.getElementById("peopleDropdownGlobal");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "peopleDropdownGlobal";
    dropdown.style.cssText = "display: none; position: fixed; max-height: 400px; width: 500px; overflow-y: auto; background: rgba(10, 14, 26, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9); z-index: 10000;";
    document.body.appendChild(dropdown);
  }

  let peopleDebounceTimer;
  let selectedPeople = [];

  input.addEventListener('input', () => {
    clearTimeout(peopleDebounceTimer);
    const query = input.value.trim();
    if (query.length > 1) {
      peopleDebounceTimer = setTimeout(async () => {
        const rect = input.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 4}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${Math.max(rect.width, 500)}px`;
        try {
          const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
          if (!res.ok) return;
          const data = await res.json();
          renderPeopleDropdown(data.results.slice(0, 8), dropdown, input, selectedPeople, selectedContainer, selectedRole);
        } catch (err) { console.error("People search error:", err); }
      }, 300);
    } else { dropdown.style.display = 'none'; }
  });

  const selectedContainer = document.createElement("div");
  selectedContainer.id = "selectedPeopleContainer";
  selectedContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  root.appendChild(selectedContainer);

  function renderPeopleDropdown(people, dropdown, input, selectedPeople, selectedContainer, role) {
    if (people.length === 0) { dropdown.style.display = 'none'; return; }
    dropdown.style.display = 'block';
    dropdown.innerHTML = people.map(person => `
      <div class="people-dropdown-item" data-id="${person.id}" data-name="${person.name}" data-role="${role}" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; cursor: pointer; border-bottom: 1px solid rgba(120, 190, 255, 0.1); transition: background 0.15s ease;" onmouseover="this.style.background='rgba(111, 210, 255, 0.1)'" onmouseout="this.style.background='transparent'">
        <img src="${person.profile_path ? 'https://image.tmdb.org/t/p/w45' + person.profile_path : 'https://placehold.co/45x68?text=?'}" style="width: 35px; height: 52px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" onerror="this.src='https://placehold.co/35x52?text=?'" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 500; color: var(--film-white); margin-bottom: 2px;">${person.name}</div>
          <div style="font-size: 12px; color: var(--muted-silver);">${person.known_for_department || 'Unknown'}</div>
        </div>
      </div>
    `).join('');
    dropdown.querySelectorAll('.people-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const personId = item.dataset.id;
        const personName = item.dataset.name;
        const personRole = item.dataset.role;
        if (selectedPeople.some(p => p.id === personId && p.role === personRole)) return;
        selectedPeople.push({ id: personId, name: personName, role: personRole });
        let roleLabel = personRole === "cast" ? " (Actor)" : personRole === "crew" ? " (Creator/Crew)" : "";
        const chip = document.createElement("div");
        chip.className = "selected-person-chip";
        chip.dataset.personId = personId;
        chip.dataset.personName = personName;
        chip.dataset.personRole = personRole;
        chip.style.cssText = "background: rgba(111, 210, 255, 0.15); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 999px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--film-white);";
        chip.innerHTML = `<span>${personName}${roleLabel}</span><button style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;" onmouseover="this.style.color='var(--danger-red)'" onmouseout="this.style.color='var(--muted-silver)'">✕</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          selectedPeople = selectedPeople.filter(p => !(p.id === personId && p.role === personRole));
          chip.remove();
        });
        selectedContainer.appendChild(chip);
        input.value = '';
        dropdown.style.display = 'none';
      });
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.style.display = 'none';
    }, { once: true });
  }

  const closeButton = document.getElementById('focusCloseButton');
  if (closeButton) closeButton.addEventListener('click', () => dropdown.style.display = 'none');
}

// =============================================
// 2. GENRES SECTION (TV genres)
// =============================================

function buildGenresContent(root) {
  const toggleContainer = document.createElement("div");
  toggleContainer.style.cssText = "display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 12px; background: rgba(15, 23, 41, 0.5); border-radius: 8px;";
  const toggleLabel = document.createElement("span");
  toggleLabel.textContent = "Match:";
  toggleLabel.style.cssText = "font-size: 13px; font-weight: 600; color: var(--accent-cyan);";
  toggleContainer.appendChild(toggleLabel);
  const orBtn = document.createElement("button");
  orBtn.type = "button"; orBtn.textContent = "Any (OR)";
  orBtn.style.cssText = `padding: 6px 14px; border-radius: 999px; font-size: 13px; cursor: pointer; border: 1px solid rgba(0, 217, 255, 0.2); background: ${state.genreLogic === "or" ? "var(--accent-cyan)" : "transparent"}; color: ${state.genreLogic === "or" ? "#000" : "var(--film-white)"}; transition: all 0.2s;`;
  const andBtn = document.createElement("button");
  andBtn.type = "button"; andBtn.textContent = "All (AND)";
  andBtn.style.cssText = `padding: 6px 14px; border-radius: 999px; font-size: 13px; cursor: pointer; border: 1px solid rgba(0, 217, 255, 0.2); background: ${state.genreLogic === "and" ? "var(--accent-cyan)" : "transparent"}; color: ${state.genreLogic === "and" ? "#000" : "var(--film-white)"}; transition: all 0.2s;`;
  orBtn.addEventListener("click", () => { state.genreLogic = "or"; orBtn.style.background = "var(--accent-cyan)"; orBtn.style.color = "#000"; andBtn.style.background = "transparent"; andBtn.style.color = "var(--film-white)"; });
  andBtn.addEventListener("click", () => { state.genreLogic = "and"; andBtn.style.background = "var(--accent-cyan)"; andBtn.style.color = "#000"; orBtn.style.background = "transparent"; orBtn.style.color = "var(--film-white)"; });
  toggleContainer.appendChild(orBtn);
  toggleContainer.appendChild(andBtn);
  root.appendChild(toggleContainer);

  root.appendChild(makeSectionLabel("TV Genres"));
  const genres = Object.keys(GENRE_MAP);
  const genreGroup = document.createElement("div");
  genreGroup.className = "chip-group";
  genres.forEach(g => {
    const svg = GENRE_SVGS[g] || "";
    const chip = makeChip(g, "genres", { type: "genre", name: g });
    if (svg) chip.innerHTML = `<span class="genre-glyph">${svg}</span> ${g}`;
    genreGroup.appendChild(chip);
  });
  root.appendChild(genreGroup);

  root.appendChild(makeSectionLabel("Keywords & Mood"));
  const keywordCategories = [
    { label: "Tone", keywords: ["Noir", "Gritty", "Dark", "Uplifting", "Quirky"] },
    { label: "Mood", keywords: ["Suspenseful", "Emotional", "Feel-good", "Atmospheric", "Cerebral", "Twisted", "Mind-bending"] }
  ];
  keywordCategories.forEach(cat => {
    const catLabel = document.createElement("div");
    catLabel.textContent = cat.label;
    catLabel.style.cssText = "font-size: 11px; color: var(--muted-silver); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 1px;";
    root.appendChild(catLabel);
    const keywordGroup = document.createElement("div");
    keywordGroup.className = "chip-group";
    cat.keywords.forEach(kw => {
      keywordGroup.appendChild(makeChip(kw, "genres", { type: "keyword", name: kw }));
    });
    root.appendChild(keywordGroup);
  });
}

// =============================================
// 3. NETWORKS SECTION (TV-specific)
// =============================================

function buildNetworksContent(root) {
  root.appendChild(makeSectionLabel("Major Networks & Streamers"));
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 13px; color: var(--muted-silver); margin-bottom: 16px;";
  desc.textContent = "Select networks and streaming services that produce the shows.";
  root.appendChild(desc);

  const categories = [
    { label: "Streaming", networks: ["Netflix", "Amazon", "Hulu", "Apple TV+", "Disney+", "Peacock", "Paramount+", "Max"] },
    { label: "Premium Cable", networks: ["HBO", "Showtime", "Starz", "FX", "AMC"] },
    { label: "Broadcast", networks: ["ABC", "NBC", "CBS", "Fox"] },
    { label: "International", networks: ["BBC One", "BBC Two", "ITV", "Channel 4", "Sky Atlantic"] }
  ];

  categories.forEach(cat => {
    root.appendChild(makeSectionLabel(cat.label));
    const group = document.createElement("div");
    group.className = "chip-group";
    cat.networks.forEach(name => {
      const id = NETWORK_MAP[name];
      if (id) {
        const chip = makeChip(`📺 ${name}`, "networks", { type: "network", id, name });
        group.appendChild(chip);
      }
    });
    root.appendChild(group);
  });

  const moreNote = document.createElement("p");
  moreNote.style.cssText = "font-size: 12px; color: var(--muted-silver); margin-top: 16px; font-style: italic;";
  moreNote.textContent = "More networks coming soon";
  root.appendChild(moreNote);
}

// =============================================
// 4. TIME & AIRING SECTION (TV-specific)
// =============================================

function buildTimeAiringContent(root) {
  const header = document.createElement("div");
  header.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  header.textContent = "First Air Date";
  root.appendChild(header);

  root.appendChild(makeSectionLabel("Specific Year"));
  const yearRow = document.createElement("div");
  yearRow.className = "input-row";
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.id = "yearInput";
  yearInput.placeholder = "e.g., 2023";
  yearInput.min = "1950";
  yearInput.max = "2030";
  yearRow.appendChild(yearInput);
  root.appendChild(yearRow);

  root.appendChild(makeSectionLabel("Decades"));
  const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const decadeGroup = document.createElement("div");
  decadeGroup.className = "chip-group";
  decades.forEach(d => {
    decadeGroup.appendChild(makeChip(`${d}s`, "timeAiring", { type: "decade", decade: d }));
  });
  root.appendChild(decadeGroup);

  const quickGroup = document.createElement("div");
  quickGroup.className = "chip-group";
  quickGroup.style.marginTop = "12px";
  const today = new Date().toISOString().split('T')[0];
  const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  quickGroup.appendChild(makeChip("New Shows (6 months)", "timeAiring", { type: "dateRange", start: sixMonthsAgo, end: today }));
  quickGroup.appendChild(makeChip("Classic TV (Pre-2000)", "timeAiring", { type: "dateRange", start: "1950-01-01", end: "1999-12-31" }));

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  quickGroup.appendChild(makeChip("Currently Airing", "timeAiring", { type: "currentlyAiring", start: thirtyDaysAgo, end: today }));
  root.appendChild(quickGroup);
}

// =============================================
// 5. RATINGS & CONTENT (same pattern as movies)
// =============================================

function buildRatingsContentSection(root) {
  const ratingsHeader = document.createElement("div");
  ratingsHeader.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  ratingsHeader.textContent = "Ratings & Votes";
  root.appendChild(ratingsHeader);

  root.appendChild(makeSectionLabel("Quality Score Range (0-10)"));
  const ratingRow = document.createElement("div");
  ratingRow.className = "input-row";
  ratingRow.style.cssText = "flex-direction: column; gap: 12px;";

  function makeSliderRow(labelText, id, min, max, step, defaultVal) {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; gap: 12px; width: 100%; align-items: center;";
    const label = document.createElement("span"); label.textContent = labelText; label.style.minWidth = "40px";
    const slider = document.createElement("input"); slider.type = "range"; slider.id = id; slider.min = min; slider.max = max; slider.step = step; slider.value = defaultVal; slider.style.flex = "1";
    const value = document.createElement("span"); value.textContent = parseFloat(defaultVal).toFixed(1); value.id = id + "Value";
    row.appendChild(label); row.appendChild(slider); row.appendChild(value);
    return { row, slider, value };
  }

  const minS = makeSliderRow("Min:", "ratingMin", "0", "10", "0.1", "0");
  const maxS = makeSliderRow("Max:", "ratingMax", "0", "10", "0.1", "10");
  minS.slider.addEventListener("input", () => { minS.value.textContent = parseFloat(minS.slider.value).toFixed(1); if (parseFloat(minS.slider.value) > parseFloat(maxS.slider.value)) { maxS.slider.value = minS.slider.value; maxS.value.textContent = parseFloat(minS.slider.value).toFixed(1); } });
  maxS.slider.addEventListener("input", () => { maxS.value.textContent = parseFloat(maxS.slider.value).toFixed(1); if (parseFloat(maxS.slider.value) < parseFloat(minS.slider.value)) { minS.slider.value = maxS.slider.value; minS.value.textContent = parseFloat(maxS.slider.value).toFixed(1); } });
  ratingRow.appendChild(minS.row); ratingRow.appendChild(maxS.row);
  root.appendChild(ratingRow);

  const ratingQuick = document.createElement("div");
  ratingQuick.className = "chip-group";
  ratingQuick.style.marginTop = "12px";
  [
    { label: "Critically Acclaimed (8.0+)", min: 8.0, max: 10.0 },
    { label: "Hidden Gems (6.5-7.5)", min: 6.5, max: 7.5 },
    { label: "Guilty Pleasures (<6.0)", min: 0, max: 6.0 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "ratingsContent", { type: "rating", min: preset.min, max: preset.max });
    chip.addEventListener("click", () => {
      document.getElementById("ratingMin").value = preset.min;
      document.getElementById("ratingMax").value = preset.max;
      document.getElementById("ratingMinValue").textContent = preset.min.toFixed(1);
      document.getElementById("ratingMaxValue").textContent = preset.max.toFixed(1);
    });
    ratingQuick.appendChild(chip);
  });
  root.appendChild(ratingQuick);

  root.appendChild(makeSectionLabel("Minimum Votes"));
  const voteGroup = document.createElement("div");
  voteGroup.className = "chip-group";
  [{ label: "100+", votes: 100 }, { label: "1,000+", votes: 1000 }, { label: "5,000+", votes: 5000 }].forEach(v => {
    voteGroup.appendChild(makeChip(v.label, "ratingsContent", { type: "votes", min: v.votes }));
  });
  root.appendChild(voteGroup);

  const divider = document.createElement("hr");
  divider.style.cssText = "border: none; border-top: 1px solid rgba(0, 217, 255, 0.15); margin: 24px 0;";
  root.appendChild(divider);

  const suitHeader = document.createElement("div");
  suitHeader.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  suitHeader.textContent = "Content Rating";
  root.appendChild(suitHeader);

  root.appendChild(makeSectionLabel("TV Content Rating"));
  const ratings = ["TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA"];
  const ratingGroup = document.createElement("div");
  ratingGroup.className = "chip-group";
  ratings.forEach(r => {
    ratingGroup.appendChild(makeChip(r, "ratingsContent", { type: "certification", rating: r }));
  });
  root.appendChild(ratingGroup);

  // Quick filters for content rating
  root.appendChild(makeSectionLabel("Quick Filters"));
  const contentQuickGroup = document.createElement("div");
  contentQuickGroup.className = "chip-group";

  const familyBtn = document.createElement("button");
  familyBtn.type = "button";
  familyBtn.className = "chip";
  familyBtn.textContent = "Family Friendly";
  familyBtn.style.cssText = "border: 1px solid rgba(0, 217, 255, 0.4); background: rgba(0, 217, 255, 0.08);";
  familyBtn.addEventListener("click", () => {
    const familyRatings = ["TV-Y", "TV-Y7", "TV-G", "TV-PG"];
    ratingGroup.querySelectorAll(".chip").forEach(chip => {
      const val = JSON.parse(chip.dataset.value);
      if (familyRatings.includes(val.rating)) chip.classList.add("active");
      else chip.classList.remove("active");
    });
  });
  contentQuickGroup.appendChild(familyBtn);

  const adultsBtn = document.createElement("button");
  adultsBtn.type = "button";
  adultsBtn.className = "chip";
  adultsBtn.textContent = "Adults Only";
  adultsBtn.style.cssText = "border: 1px solid rgba(0, 217, 255, 0.4); background: rgba(0, 217, 255, 0.08);";
  adultsBtn.addEventListener("click", () => {
    ratingGroup.querySelectorAll(".chip").forEach(chip => {
      const val = JSON.parse(chip.dataset.value);
      if (val.rating === "TV-MA") chip.classList.add("active");
      else chip.classList.remove("active");
    });
  });
  contentQuickGroup.appendChild(adultsBtn);
  root.appendChild(contentQuickGroup);
}

// =============================================
// 6. REGION & LANGUAGE (same as movies)
// =============================================

function buildRegionLanguageContent(root) {
  root.appendChild(makeSectionLabel("Production Region"));
  const regionRow = document.createElement("div"); regionRow.className = "input-row";
  const regionInput = document.createElement("input"); regionInput.type = "text"; regionInput.id = "regionInput"; regionInput.placeholder = "Search for country..."; regionInput.autocomplete = "off";
  regionRow.appendChild(regionInput); root.appendChild(regionRow);
  const regionContainer = document.createElement("div"); regionContainer.id = "selectedRegionContainer"; regionContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  root.appendChild(regionContainer);

  const regions = [
    { code: "US", name: "🇺🇸 United States" }, { code: "GB", name: "🇬🇧 United Kingdom" },
    { code: "KR", name: "🇰🇷 South Korea" }, { code: "JP", name: "🇯🇵 Japan" },
    { code: "FR", name: "🇫🇷 France" }, { code: "DE", name: "🇩🇪 Germany" },
    { code: "ES", name: "🇪🇸 Spain" }, { code: "IN", name: "🇮🇳 India" },
    { code: "CA", name: "🇨🇦 Canada" }, { code: "AU", name: "🇦🇺 Australia" },
    { code: "IT", name: "🇮🇹 Italy" }, { code: "CN", name: "🇨🇳 China" }
  ];
  let selectedRegion = null;

  regionInput.addEventListener("input", () => {
    const query = regionInput.value.toLowerCase();
    const filtered = regions.filter(r => r.name.toLowerCase().includes(query) || r.code.toLowerCase().includes(query));
    if (filtered.length > 0 && query.length > 0) renderRegionSuggestions(filtered.slice(0, 5));
    else hideRegionSuggestions();
  });

  function renderRegionSuggestions(items) {
    hideRegionSuggestions();
    const dropdown = document.createElement("div"); dropdown.id = "regionDropdown";
    dropdown.style.cssText = "position: absolute; background: rgba(10, 14, 26, 0.98); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 8px; margin-top: 4px; max-height: 200px; overflow-y: auto; z-index: 1000;";
    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        selectedRegion = item; regionInput.value = ""; hideRegionSuggestions();
        regionContainer.innerHTML = `<div data-region-code="${item.code}" style="background: rgba(111, 210, 255, 0.15); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 999px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px;"><span>${item.name}</span><button id="removeRegion" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button></div>`;
        document.getElementById("removeRegion").onclick = () => { selectedRegion = null; regionContainer.innerHTML = ""; };
      };
      dropdown.appendChild(opt);
    });
    regionRow.appendChild(dropdown);
  }
  function hideRegionSuggestions() { const ex = document.getElementById("regionDropdown"); if (ex) ex.remove(); }

  root.appendChild(makeSectionLabel("Original Language"));

  // English Only Toggle
  const englishToggleRow = document.createElement("div");
  englishToggleRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(0, 217, 255, 0.05); border: 1px solid rgba(0, 217, 255, 0.2); border-radius: 10px; margin-bottom: 12px;";
  const toggleLabel = document.createElement("div");
  toggleLabel.innerHTML = `<span style="font-weight: 600; color: var(--film-white);">English Only</span><span style="font-size: 11px; color: var(--muted-silver); display: block; margin-top: 2px;">English-language television</span>`;
  const toggleSwitch = document.createElement("label");
  toggleSwitch.style.cssText = "position: relative; display: inline-block; width: 50px; height: 26px; cursor: pointer;";
  toggleSwitch.innerHTML = `<input type="checkbox" id="englishOnlyToggle" style="opacity: 0; width: 0; height: 0;"><span style="position: absolute; inset: 0; background: rgba(255,255,255,0.1); border-radius: 26px; transition: 0.3s;"></span><span style="position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background: var(--muted-silver); border-radius: 50%; transition: 0.3s;" id="toggleKnob"></span>`;
  englishToggleRow.appendChild(toggleLabel); englishToggleRow.appendChild(toggleSwitch);
  root.appendChild(englishToggleRow);

  const langSearchSection = document.createElement("div"); langSearchSection.id = "langSearchSection";
  const langRow = document.createElement("div"); langRow.className = "input-row";
  const langInput = document.createElement("input"); langInput.type = "text"; langInput.id = "languageInput"; langInput.placeholder = "Search for language..."; langInput.autocomplete = "off";
  langRow.appendChild(langInput); langSearchSection.appendChild(langRow);
  const langContainer = document.createElement("div"); langContainer.id = "selectedLanguageContainer"; langContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  langSearchSection.appendChild(langContainer);
  root.appendChild(langSearchSection);

  const englishToggle = toggleSwitch.querySelector('#englishOnlyToggle');
  const toggleKnob = toggleSwitch.querySelector('#toggleKnob');
  const toggleBg = toggleSwitch.querySelector('span');
  const savedState = sessionStorage.getItem('englishOnlyToggle');
  const isEnglishOnly = savedState === null ? true : savedState === 'true';
  function updateToggleUI(isOn) {
    if (isOn) { toggleBg.style.background = 'var(--accent-cyan)'; toggleKnob.style.transform = 'translateX(24px)'; toggleKnob.style.background = 'white'; langSearchSection.style.display = 'none'; }
    else { toggleBg.style.background = 'rgba(255,255,255,0.1)'; toggleKnob.style.transform = 'translateX(0)'; toggleKnob.style.background = 'var(--muted-silver)'; langSearchSection.style.display = 'block'; }
  }
  englishToggle.checked = isEnglishOnly; updateToggleUI(isEnglishOnly);
  englishToggle.addEventListener('change', () => { const isOn = englishToggle.checked; sessionStorage.setItem('englishOnlyToggle', isOn.toString()); updateToggleUI(isOn); if (isOn) langContainer.innerHTML = ''; });

  const languages = [
    { code: "en", name: "English" }, { code: "es", name: "Spanish" }, { code: "fr", name: "French" },
    { code: "de", name: "German" }, { code: "ja", name: "Japanese" }, { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" }, { code: "hi", name: "Hindi" }, { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" }, { code: "ru", name: "Russian" }, { code: "ar", name: "Arabic" },
    { code: "sv", name: "Swedish" }, { code: "da", name: "Danish" }, { code: "tr", name: "Turkish" }
  ];

  langInput.addEventListener("input", () => {
    const query = langInput.value.toLowerCase();
    const filtered = languages.filter(l => l.name.toLowerCase().includes(query));
    if (filtered.length > 0 && query.length > 0) renderLangSuggestions(filtered.slice(0, 5));
    else hideLangSuggestions();
  });
  function renderLangSuggestions(items) {
    hideLangSuggestions();
    const dropdown = document.createElement("div"); dropdown.id = "languageDropdown";
    dropdown.style.cssText = "position: absolute; background: rgba(10, 14, 26, 0.98); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 8px; margin-top: 4px; max-height: 200px; overflow-y: auto; z-index: 1000;";
    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        langInput.value = ""; hideLangSuggestions();
        langContainer.innerHTML = `<div data-lang-code="${item.code}" style="background: rgba(111, 210, 255, 0.15); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 999px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; font-size: 13px;"><span>${item.name}</span><button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button></div>`;
        document.getElementById("removeLanguage").onclick = () => langContainer.innerHTML = "";
      };
      dropdown.appendChild(opt);
    });
    langRow.appendChild(dropdown);
  }
  function hideLangSuggestions() { const ex = document.getElementById("languageDropdown"); if (ex) ex.remove(); }
}

// =============================================
// 7. WATCH PROVIDERS (TV endpoint)
// =============================================

function buildWatchContent(root) {
  const savedCountry = localStorage.getItem("watchCountry") || "";
  root.appendChild(makeSectionLabel("Your Country"));
  const countrySelect = document.createElement("select");
  countrySelect.id = "watchCountrySelect";
  countrySelect.style.cssText = "width: 100%; padding: 10px 12px; background: rgba(15,23,41,0.6); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; color: var(--film-white); font-size: 13px; margin-bottom: 16px; cursor: pointer;";
  const countries = [["", "Select country..."], ["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"], ["AU", "Australia"], ["DE", "Germany"], ["FR", "France"], ["ES", "Spain"], ["IT", "Italy"], ["JP", "Japan"], ["KR", "South Korea"], ["IN", "India"], ["BR", "Brazil"], ["MX", "Mexico"]];
  countrySelect.innerHTML = countries.map(([code, name]) => `<option value="${code}"${code === savedCountry ? " selected" : ""}>${name}</option>`).join("");
  root.appendChild(countrySelect);

  root.appendChild(makeSectionLabel("Your Streaming Services"));
  const providerContainer = document.createElement("div"); providerContainer.id = "watchProviderChips"; providerContainer.className = "chip-group"; providerContainer.style.flexWrap = "wrap";
  root.appendChild(providerContainer);

  function loadProviders(country) {
    if (!country) { providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country</span>'; return; }
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Loading...</span>';
    fetch(`https://api.themoviedb.org/3/watch/providers/tv?api_key=${TMDB_API_KEY}&watch_region=${country}`)
      .then(res => { if (!res.ok) throw new Error(`TMDB ${res.status}`); return res.json(); })
      .then(data => {
        const providers = (data.results || []).slice(0, 25);
        providerContainer.innerHTML = "";
        let savedIds = [];
        try { savedIds = JSON.parse(localStorage.getItem("watchProviders") || "[]").map(p => p.id); } catch {}
        providers.forEach(p => {
          const chip = document.createElement("button"); chip.type = "button"; chip.className = "chip";
          if (savedIds.includes(p.provider_id)) chip.classList.add("active");
          chip.dataset.value = JSON.stringify({ type: "provider", id: p.provider_id, name: p.provider_name, logo: p.logo_path, region: country });
          chip.style.cssText = "display: flex; align-items: center; gap: 6px; padding: 6px 10px;";
          const logo = p.logo_path ? `<img src="https://image.tmdb.org/t/p/w45${p.logo_path}" style="width:20px;height:20px;border-radius:3px;">` : "";
          chip.innerHTML = `${logo}<span>${p.provider_name}</span>`;
          chip.addEventListener("click", () => { chip.classList.toggle("active"); saveProviders(country); });
          providerContainer.appendChild(chip);
        });
      })
      .catch(() => { providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Failed to load</span>'; });
  }

  function saveProviders(country) {
    localStorage.setItem("watchCountry", country);
    const active = providerContainer.querySelectorAll(".chip.active");
    const providers = Array.from(active).map(c => { try { return JSON.parse(c.dataset.value); } catch { return null; } }).filter(Boolean).map(v => ({ id: v.id, name: v.name, logo: v.logo || "" }));
    localStorage.setItem("watchProviders", JSON.stringify(providers));
  }

  countrySelect.addEventListener("change", () => { saveProviders(countrySelect.value); loadProviders(countrySelect.value); });
  if (savedCountry) loadProviders(savedCountry);
  else providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
}

// =============================================
// 8. STATUS & SEASONS (TV-specific)
// =============================================

function buildStatusContent(root) {
  root.appendChild(makeSectionLabel("Show Status"));
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 13px; color: var(--muted-silver); margin-bottom: 12px;";
  desc.textContent = "Filter by current status of the show.";
  root.appendChild(desc);

  const statusGroup = document.createElement("div");
  statusGroup.className = "chip-group";
  const statuses = [
    { label: "Returning Series", code: "0" },
    { label: "Planned", code: "1" },
    { label: "In Production", code: "2" },
    { label: "Ended", code: "3" },
    { label: "Cancelled", code: "4" },
    { label: "Pilot", code: "5" }
  ];
  statuses.forEach(s => {
    statusGroup.appendChild(makeChip(s.label, "status", { type: "status", code: s.code, name: s.label }));
  });
  root.appendChild(statusGroup);

  // Quick filters
  root.appendChild(makeSectionLabel("Quick Filters"));
  const quickGroup = document.createElement("div");
  quickGroup.className = "chip-group";

  const activeShowsBtn = document.createElement("button");
  activeShowsBtn.type = "button";
  activeShowsBtn.className = "chip";
  activeShowsBtn.textContent = "Active Shows";
  activeShowsBtn.style.cssText = "border: 1px solid rgba(0, 217, 255, 0.4); background: rgba(0, 217, 255, 0.08);";
  activeShowsBtn.addEventListener("click", () => {
    statusGroup.querySelectorAll(".chip").forEach(chip => {
      const val = JSON.parse(chip.dataset.value);
      if (val.code === "0") chip.classList.add("active");
      else chip.classList.remove("active");
    });
  });
  quickGroup.appendChild(activeShowsBtn);

  const completedBtn = document.createElement("button");
  completedBtn.type = "button";
  completedBtn.className = "chip";
  completedBtn.textContent = "Completed Only";
  completedBtn.style.cssText = "border: 1px solid rgba(0, 217, 255, 0.4); background: rgba(0, 217, 255, 0.08);";
  completedBtn.addEventListener("click", () => {
    statusGroup.querySelectorAll(".chip").forEach(chip => {
      const val = JSON.parse(chip.dataset.value);
      if (val.code === "3") chip.classList.add("active");
      else chip.classList.remove("active");
    });
  });
  quickGroup.appendChild(completedBtn);
  root.appendChild(quickGroup);

  const divider = document.createElement("hr");
  divider.style.cssText = "border: none; border-top: 1px solid rgba(0, 217, 255, 0.15); margin: 24px 0;";
  root.appendChild(divider);

  root.appendChild(makeSectionLabel("Show Type"));
  const typeGroup = document.createElement("div");
  typeGroup.className = "chip-group";
  const types = [
    { label: "📺 Scripted", code: "4" },
    { label: "📚 Miniseries", code: "2" },
    { label: "🎪 Reality", code: "3" },
    { label: "📽️ Documentary", code: "0" },
    { label: "🎤 Talk Show", code: "5" },
    { label: "📰 News", code: "1" }
  ];
  types.forEach(t => {
    typeGroup.appendChild(makeChip(t.label, "status", { type: "showType", code: t.code, name: t.label }));
  });
  root.appendChild(typeGroup);
}

// =============================================
// 8b. TIME COMMITMENT (new section)
// =============================================

function buildTimeCommitmentContent(root) {
  root.appendChild(makeSectionLabel("Estimated Total Watch Time"));
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 13px; color: var(--muted-silver); margin-bottom: 16px;";
  desc.textContent = "How much time do you want to invest in a show?";
  root.appendChild(desc);

  const presets = [
    { label: "\u26A1 Quick Watch", minHours: 0, maxHours: 2 },
    { label: "\uD83C\uDFAC Single Sitting", minHours: 2, maxHours: 6 },
    { label: "\uD83D\uDCFA Weekend Binge", minHours: 6, maxHours: 15 },
    { label: "\uD83D\uDE80 Deep Dive", minHours: 15, maxHours: 40 },
    { label: "\uD83C\uDF0C Epic Commitment", minHours: 40, maxHours: 80 },
    { label: "\u267E\uFE0F Life's Work", minHours: 80, maxHours: 9999 }
  ];

  const presetGroup = document.createElement("div");
  presetGroup.className = "chip-group";
  presets.forEach(p => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip time-commitment-preset";
    chip.textContent = p.label;
    chip.dataset.value = JSON.stringify({ type: "timeCommitment", minHours: p.minHours, maxHours: p.maxHours, label: p.label });
    chip.addEventListener("click", () => {
      // Radio behavior: deactivate all others
      presetGroup.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      // Clear custom inputs
      const minI = document.getElementById("tcMinHours");
      const maxI = document.getElementById("tcMaxHours");
      if (minI) minI.value = "";
      if (maxI) maxI.value = "";
    });
    presetGroup.appendChild(chip);
  });
  root.appendChild(presetGroup);

  const divider = document.createElement("hr");
  divider.style.cssText = "border: none; border-top: 1px solid rgba(0, 217, 255, 0.15); margin: 24px 0;";
  root.appendChild(divider);

  root.appendChild(makeSectionLabel("Custom Range"));
  const customRow = document.createElement("div");
  customRow.style.cssText = "display: flex; gap: 12px; align-items: center; margin-bottom: 12px;";

  const minInput = document.createElement("input");
  minInput.type = "number";
  minInput.id = "tcMinHours";
  minInput.placeholder = "Min hours";
  minInput.min = "0";
  minInput.style.cssText = "flex: 1; padding: 8px 12px; background: rgba(15,23,41,0.6); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; color: var(--film-white); font-size: 13px;";

  const dashLabel = document.createElement("span");
  dashLabel.textContent = "to";
  dashLabel.style.cssText = "color: var(--muted-silver); font-size: 13px;";

  const maxInput = document.createElement("input");
  maxInput.type = "number";
  maxInput.id = "tcMaxHours";
  maxInput.placeholder = "Max hours";
  maxInput.min = "0";
  maxInput.style.cssText = "flex: 1; padding: 8px 12px; background: rgba(15,23,41,0.6); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; color: var(--film-white); font-size: 13px;";

  // Clear presets when custom inputs are used
  [minInput, maxInput].forEach(inp => {
    inp.addEventListener("input", () => {
      presetGroup.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    });
  });

  customRow.appendChild(minInput);
  customRow.appendChild(dashLabel);
  customRow.appendChild(maxInput);

  const hoursLabel = document.createElement("span");
  hoursLabel.textContent = "hours";
  hoursLabel.style.cssText = "color: var(--muted-silver); font-size: 13px;";
  customRow.appendChild(hoursLabel);

  root.appendChild(customRow);

  const note = document.createElement("p");
  note.style.cssText = "font-size: 11px; color: var(--muted-silver); font-style: italic; margin-top: 8px;";
  note.textContent = "This is a post-fetch filter. Results will be filtered after loading.";
  root.appendChild(note);
}

// =============================================
// 9. AWARDS (placeholder)
// =============================================

function buildAwardsContent(root) {
  const placeholder = document.createElement("div");
  placeholder.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center;";
  placeholder.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
    <h3 style="color: var(--accent-cyan); margin-bottom: 8px;">Coming Soon</h3>
    <p style="color: var(--muted-silver); font-size: 13px;">
      Filter by Emmy, Golden Globe, and other TV award winners and nominees.<br>
      This feature is under development.
    </p>
  `;
  root.appendChild(placeholder);
}

// =============================================
// COLLECT LABELS FOR EACH SECTION
// =============================================

function collectLabelsForSection(sectionKey) {
  const results = [];
  switch (sectionKey) {
    case "people":
      return Array.from(document.querySelectorAll('.selected-person-chip')).map(chip => ({
        label: chip.dataset.personName + (chip.dataset.personRole === "cast" ? " (Actor)" : chip.dataset.personRole === "crew" ? " (Creator/Crew)" : ""),
        value: { type: "person", id: chip.dataset.personId, name: chip.dataset.personName, role: chip.dataset.personRole }
      }));

    case "genres":
      return Array.from(document.querySelectorAll('#focusContent .chip.active')).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent, value };
      });

    case "networks":
      return Array.from(document.querySelectorAll('#focusContent .chip.active')).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent.trim(), value };
      });

    case "timeAiring":
      const yearInput = document.getElementById("yearInput");
      if (yearInput && yearInput.value) {
        results.push({ label: `Year: ${yearInput.value}`, value: { type: "year", year: parseInt(yearInput.value) } });
      }
      Array.from(document.querySelectorAll('#focusContent .chip.active')).forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        let label = chip.textContent;
        if (value.type === "decade") label = `${value.decade}s`;
        results.push({ label, value });
      });
      return results;

    case "ratingsContent":
      const ratingMin = document.getElementById("ratingMin");
      const ratingMax = document.getElementById("ratingMax");
      if (ratingMin && ratingMax) {
        const min = parseFloat(ratingMin.value), max = parseFloat(ratingMax.value);
        if (min > 0 || max < 10) results.push({ label: `Rating: ${min.toFixed(1)}-${max.toFixed(1)}`, value: { type: "rating", min, max } });
      }
      Array.from(document.querySelectorAll('#focusContent .chip.active')).forEach(chip => {
        const val = JSON.parse(chip.dataset.value);
        if (val.type === "votes") results.push({ label: `Min votes: ${val.min.toLocaleString()}`, value: val });
        else if (val.type === "certification") results.push({ label: `Rated ${val.rating}`, value: val });
      });
      return results;

    case "regionLanguage":
      const regionContainer = document.getElementById("selectedRegionContainer");
      if (regionContainer?.children.length > 0) {
        const regionChip = regionContainer.querySelector('[data-region-code]');
        const regionText = regionContainer.querySelector('span')?.textContent;
        if (regionChip && regionText) results.push({ label: `Region: ${regionText}`, value: { type: "region", code: regionChip.dataset.regionCode, name: regionText } });
      }
      const englishToggle = document.getElementById("englishOnlyToggle");
      const langContainer = document.getElementById("selectedLanguageContainer");
      if (englishToggle?.checked) results.push({ label: "Language: English", value: { type: "language", code: "en", name: "English" } });
      else if (langContainer?.children.length > 0) {
        const langChip = langContainer.querySelector('[data-lang-code]');
        const langText = langContainer.querySelector('span')?.textContent;
        if (langChip && langText) results.push({ label: `Language: ${langText}`, value: { type: "language", code: langChip.dataset.langCode, name: langText } });
      }
      return results;

    case "watch":
      return Array.from(document.querySelectorAll('#watchProviderChips .chip.active')).map(chip => {
        try { const val = JSON.parse(chip.dataset.value); return { label: val.name, value: val }; } catch { return null; }
      }).filter(Boolean);

    case "status":
      return Array.from(document.querySelectorAll('#focusContent .chip.active')).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent.trim(), value };
      });

    case "timeCommitment": {
      const tcResults = [];
      const activePreset = document.querySelector('#focusContent .time-commitment-preset.active');
      if (activePreset) {
        const val = JSON.parse(activePreset.dataset.value);
        tcResults.push({ label: activePreset.textContent.trim(), value: val });
      } else {
        const minH = document.getElementById("tcMinHours");
        const maxH = document.getElementById("tcMaxHours");
        if (minH && maxH && (minH.value || maxH.value)) {
          const minVal = parseFloat(minH.value) || 0;
          const maxVal = parseFloat(maxH.value) || 9999;
          tcResults.push({
            label: `${minVal}-${maxVal} hours`,
            value: { type: "timeCommitment", minHours: minVal, maxHours: maxVal, label: `${minVal}-${maxVal} hours` }
          });
        }
      }
      return tcResults;
    }

    case "awards":
      return [];

    default:
      return [];
  }
}
