/* =============================================
   ORBIT - MOVIES & TV COMBINED DISCOVERY
   Complete Application Logic
============================================= */

// =============================================
// GENRE & KEYWORD MAPPINGS (shared subset)
// =============================================

const GENRE_MAP = {
  "Action": 28,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Horror": 27,
  "Mystery": 9648,
  "Romance": 10749,
  "Science Fiction": 878,
  "Thriller": 53,
  "War": 10752,
  "Western": 37
};

const GENRE_SVGS = {
  "Action": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L8 8M13 3L10 3M13 3L13 6"/><path d="M3 13L8 8M3 13L6 13M3 13L3 10"/></svg>`,
  "Animation": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="8" r="4"/><circle cx="11" cy="7" r="3" opacity="0.6"/></svg>`,
  "Comedy": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M5.5 6.5V6"/><path d="M10.5 6.5V6"/><path d="M5.5 10Q8 12.5 10.5 10"/></svg>`,
  "Crime": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="2"/><line x1="8" y1="8" x2="8" y2="14"/><line x1="5" y1="10" x2="11" y2="10"/></svg>`,
  "Documentary": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="8" y1="12" x2="8" y2="14"/></svg>`,
  "Drama": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3Q5 2 6 4Q7 2 8 3"/><path d="M4 5V5.5"/><path d="M7 5V5.5"/><path d="M4.5 7Q5.5 6 6.5 7"/><path d="M9 9Q11 8 12 10Q13 8 14 9"/><path d="M10 11V11.5"/><path d="M13 11V11.5"/><path d="M10.5 13Q11.5 14 12.5 13"/></svg>`,
  "Family": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5" cy="5" r="2"/><circle cx="11" cy="5" r="2"/><circle cx="8" cy="10" r="1.5"/><path d="M5 7V9Q5 11 8 11.5"/><path d="M11 7V9Q11 11 8 11.5"/></svg>`,
  "Horror": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="5"/><path d="M6 6V7"/><path d="M10 6V7"/><path d="M6 9.5Q8 11 10 9.5"/><path d="M5 2Q6 4 8 4Q10 4 11 2"/></svg>`,
  "Mystery": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>`,
  "Romance": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14Q1 8 4 4Q6 2 8 5Q10 2 12 4Q15 8 8 14Z"/></svg>`,
  "Science Fiction": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><ellipse cx="8" cy="8" rx="7" ry="3" transform="rotate(-30 8 8)"/></svg>`,
  "Thriller": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2V5"/><path d="M8 11V14"/><path d="M2 8H5"/><path d="M11 8H14"/><circle cx="8" cy="8" r="2"/></svg>`,
  "War": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14L4 6L8 3L12 6L12 14"/><path d="M2 14H14"/><path d="M8 6V9"/><path d="M6.5 7.5H9.5"/></svg>`,
  "Western": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8" cy="12" rx="6" ry="2"/><path d="M4 12Q3 8 8 4Q13 8 12 12"/><line x1="3" y1="10" x2="13" y2="10"/></svg>`
};

const KEYWORD_MAP = {
  "Noir": 210024,
  "Gritty": 9715,
  "Dark": 207928,
  "Uplifting": 10683,
  "Quirky": 10683,
  "Whimsical": 10683,
  "Bleak": 207928,
  "Slow-burn": 14537,
  "Fast-paced": 9715,
  "Intense": 9715,
  "Suspenseful": 818,
  "Emotional": 3205,
  "Feel-good": 10683,
  "Atmospheric": 9715,
  "Cerebral": 4344,
  "Twisted": 818,
  "Violent": 9663,
  "Gore": 12670,
  "Family-friendly": 6054,
  "Heartwarming": 10683,
  "Mind-bending": 818
};

const state = {
  filters: [],
  genreLogic: "or"
};

// Mode toggle is now handled via anchor links in HTML

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

// =============================================
// SECTION DEFINITIONS
// =============================================

const sectionDefinitions = {
  people: { title: "People", builder: buildPeopleContent },
  genres: { title: "Genres", builder: buildGenresContent },
  ratingsContent: { title: "Ratings & Content", builder: buildRatingsContentSection },
  regionLanguage: { title: "Region & Language", builder: buildRegionLanguageContent },
  watch: { title: "Watch Providers", builder: buildWatchContent },
  yearDecade: { title: "Year & Decade", builder: buildYearDecadeContent }
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
    remove.textContent = "\u2715";
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
clearAllButton.onclick = () => {
  state.filters = [];
  updateUIFromState();
};

// =============================================
// LAUNCH - DUAL API CALLS (MOVIE + TV)
// =============================================

launchCard.addEventListener("click", async () => {
  if (launchCard.disabled) return;
  try {
    const queryParams = buildTMDBQueryFromFilters(state.filters);
    const hyperspace = document.getElementById('hyperspaceOverlay');

    // Preview both
    const [moviePreview, tvPreview] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}&page=1`).then(r => { if (!r.ok) throw new Error(`TMDB ${r.status}`); return r.json(); }),
      fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&${queryParams}&page=1`).then(r => { if (!r.ok) throw new Error(`TMDB ${r.status}`); return r.json(); })
    ]);

    const totalResults = (moviePreview.total_results || 0) + (tvPreview.total_results || 0);
    if (totalResults === 0) { alert("No results found."); return; }

    const MAX_PAGES = 15;
    hyperspace.hidden = false;

    // Fetch movies
    const allMovies = [];
    if (moviePreview.results) {
      moviePreview.results.forEach(m => { m.media_type = "movie"; });
      allMovies.push(...moviePreview.results);
      const moviePages = Math.min(moviePreview.total_pages || 0, MAX_PAGES);
      for (let p = 2; p <= moviePages; p++) {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}&page=${p}`);
        if (!res.ok) break;
        const data = await res.json();
        if (!data.results?.length) break;
        data.results.forEach(m => { m.media_type = "movie"; });
        allMovies.push(...data.results);
      }
    }

    // Fetch TV
    const allTV = [];
    if (tvPreview.results) {
      tvPreview.results.forEach(s => { s.media_type = "tv"; s.title = s.name || s.title; s.release_date = s.first_air_date || s.release_date; });
      allTV.push(...tvPreview.results);
      const tvPages = Math.min(tvPreview.total_pages || 0, MAX_PAGES);
      for (let p = 2; p <= tvPages; p++) {
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&${queryParams}&page=${p}`);
        if (!res.ok) break;
        const data = await res.json();
        if (!data.results?.length) break;
        data.results.forEach(s => { s.media_type = "tv"; s.title = s.name || s.title; s.release_date = s.first_air_date || s.release_date; });
        allTV.push(...data.results);
      }
    }

    const combined = [...allMovies, ...allTV].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    if (combined.length === 0) { hyperspace.hidden = true; alert("No results found."); return; }

    localStorage.setItem("movies", JSON.stringify(combined));
    localStorage.setItem("genres", JSON.stringify(getTopGenres(combined)));
    localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
    localStorage.setItem("mediaType", "both");

    setTimeout(() => { window.location.href = "results.html"; }, 500);
  } catch (err) {
    document.getElementById('hyperspaceOverlay').hidden = true;
    console.error("Launch error:", err);
    alert("Failed to launch orbit.");
  }
});

// =============================================
// TMDB QUERY BUILDER
// =============================================

function buildTMDBQueryFromFilters(filters) {
  const params = new URLSearchParams();

  params.append("sort_by", "popularity.desc");
  params.append("include_adult", "false");
  params.append("include_video", "false");

  const genreKeywordIds = [];

  filters.forEach(filter => {
    if (!filter.value) return;

    switch(filter.section) {
      case "people":
        if (filter.value.type === "person" && filter.value.id) {
          const paramName = filter.value.role === "cast" ? "with_cast" :
                           filter.value.role === "crew" ? "with_crew" :
                           "with_people";
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

      case "yearDecade":
        if (filter.value.type === "year") {
          params.delete("primary_release_date.gte");
          params.delete("primary_release_date.lte");
          params.delete("first_air_date.gte");
          params.delete("first_air_date.lte");
          params.set("primary_release_year", filter.value.year);
          params.set("first_air_date_year", filter.value.year);
        } else if (filter.value.type === "decade") {
          params.delete("primary_release_year");
          params.delete("first_air_date_year");
          const d = filter.value.decade;
          params.set("primary_release_date.gte", `${d}-01-01`);
          params.set("primary_release_date.lte", `${d + 9}-12-31`);
          params.set("first_air_date.gte", `${d}-01-01`);
          params.set("first_air_date.lte", `${d + 9}-12-31`);
        } else if (filter.value.type === "dateRange") {
          params.delete("primary_release_year");
          params.delete("first_air_date_year");
          params.set("primary_release_date.gte", filter.value.start);
          params.set("primary_release_date.lte", filter.value.end);
          params.set("first_air_date.gte", filter.value.start);
          params.set("first_air_date.lte", filter.value.end);
        }
        break;
    }
  });

  // Merge accumulated keywords
  if (genreKeywordIds.length > 0) params.set("with_keywords", genreKeywordIds.join(","));

  // Inject saved watch providers from Region settings (if not already set by a filter)
  if (!params.has("with_watch_providers")) {
    try {
      const savedProviders = JSON.parse(localStorage.getItem("watchProviders") || "[]");
      const savedCountry = localStorage.getItem("watchCountry");
      if (savedProviders.length > 0 && savedCountry) {
        const providerIds = savedProviders.map(p => p.id).join("|");
        params.set("with_watch_providers", providerIds);
        params.set("watch_region", savedCountry);
        console.log("[Orbit Both] Applying saved watch providers:", providerIds, "region:", savedCountry);
      }
    } catch (e) {
      console.error("[Orbit Both] Failed to read saved watch providers:", e);
    }
  }

  return params.toString();
}

// =============================================
// HELPER FUNCTIONS
// =============================================

function getTopGenres(items) {
  const genreCounts = {};
  items.forEach(item => {
    item.genre_ids?.forEach(id => {
      genreCounts[id] = (genreCounts[id] || 0) + 1;
    });
  });

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => parseInt(id));
}

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
  chip.addEventListener("click", () => {
    chip.classList.toggle("active");
  });
  return chip;
}

// =============================================
// 1. PEOPLE SECTION
// =============================================

function buildPeopleContent(root) {
  root.appendChild(makeSectionLabel("People search"));
  const desc = document.createElement("p");
  desc.style.fontSize = "13px";
  desc.style.color = "var(--muted-silver)";
  desc.style.marginBottom = "12px";
  desc.textContent = "Search for actors, directors, creators, or other people. Select from the dropdown.";
  root.appendChild(desc);

  const roleFilter = document.createElement("div");
  roleFilter.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  `;

  const roles = [
    { value: "any", label: "Any Role" },
    { value: "cast", label: "Actor" },
    { value: "crew", label: "Behind Camera" }
  ];

  let selectedRole = "any";

  roles.forEach(role => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-filter-btn";
    btn.dataset.role = role.value;
    btn.textContent = role.label;
    btn.style.cssText = `
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid rgba(0, 217, 255, 0.2);
      background: ${role.value === "any" ? "var(--accent-cyan)" : "rgba(20, 30, 60, 0.5)"};
      color: ${role.value === "any" ? "#000" : "var(--film-white)"};
    `;

    btn.addEventListener("click", () => {
      selectedRole = role.value;
      roleFilter.querySelectorAll(".role-filter-btn").forEach(b => {
        if (b.dataset.role === selectedRole) {
          b.style.background = "var(--accent-cyan)";
          b.style.color = "#000";
        } else {
          b.style.background = "rgba(20, 30, 60, 0.5)";
          b.style.color = "var(--film-white)";
        }
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
  input.placeholder = "Type a name (actor, director, creator\u2026)";
  input.autocomplete = "off";
  row.appendChild(input);
  container.appendChild(row);

  root.appendChild(container);

  let dropdown = document.getElementById("peopleDropdownGlobal");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "peopleDropdownGlobal";
    dropdown.className = "people-dropdown-global";
    dropdown.style.cssText = `
      display: none;
      position: fixed;
      max-height: 400px;
      width: 500px;
      overflow-y: auto;
      background: rgba(10, 14, 26, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
      z-index: 10000;
    `;
    document.body.appendChild(dropdown);
  }

  let peopleDebounceTimer;
  let selectedPeople = [];

  input.addEventListener('input', () => {
    clearTimeout(peopleDebounceTimer);
    const query = input.value.trim();

    if (query.length > 1) {
      peopleDebounceTimer = setTimeout(() => {
        const rect = input.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 4}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${Math.max(rect.width, 500)}px`;

        fetchPeopleSuggestions(query, dropdown, selectedRole);
      }, 300);
    } else {
      dropdown.style.display = 'none';
    }
  });

  const selectedContainer = document.createElement("div");
  selectedContainer.id = "selectedPeopleContainer";
  selectedContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  `;
  root.appendChild(selectedContainer);

  async function fetchPeopleSuggestions(query, dropdown, role) {
    const url = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      renderPeopleDropdown(data.results.slice(0, 8), dropdown, input, selectedPeople, selectedContainer, role);
    } catch (err) {
      console.error("People search error:", err);
    }
  }

  function renderPeopleDropdown(people, dropdown, input, selectedPeople, selectedContainer, role) {
    if (people.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    dropdown.style.display = 'block';
    dropdown.innerHTML = people.map(person => `
      <div class="people-dropdown-item" data-id="${person.id}" data-name="${person.name}" data-role="${role}" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(120, 190, 255, 0.1);
        transition: background 0.15s ease;
      " onmouseover="this.style.background='rgba(111, 210, 255, 0.1)'" onmouseout="this.style.background='transparent'">
        <img
          src="${person.profile_path ? 'https://image.tmdb.org/t/p/w45' + person.profile_path : 'https://placehold.co/45x68?text=?'}"
          style="width: 35px; height: 52px; object-fit: cover; border-radius: 4px; flex-shrink: 0;"
          onerror="this.src='https://placehold.co/35x52?text=?'"
        />
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

        if (selectedPeople.some(p => p.id === personId && p.role === personRole)) {
          return;
        }

        selectedPeople.push({ id: personId, name: personName, role: personRole });

        let roleLabel = "";
        if (personRole === "cast") roleLabel = " (Actor)";
        else if (personRole === "crew") roleLabel = " (Behind Camera)";

        const chip = document.createElement("div");
        chip.className = "selected-person-chip";
        chip.dataset.personId = personId;
        chip.dataset.personName = personName;
        chip.dataset.personRole = personRole;
        chip.style.cssText = `
          background: rgba(111, 210, 255, 0.15);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 999px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--film-white);
        `;
        chip.innerHTML = `
          <span>${personName}${roleLabel}</span>
          <button style="
            background: transparent;
            border: none;
            color: var(--muted-silver);
            cursor: pointer;
            font-size: 14px;
            padding: 0 4px;
            transition: color 0.15s;
          " onmouseover="this.style.color='var(--danger-red)'" onmouseout="this.style.color='var(--muted-silver)'">\u2715</button>
        `;

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
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, { once: true });
  }

  const closeButton = document.getElementById('focusCloseButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  }
}

// =============================================
// 2. GENRES SECTION (shared subset)
// =============================================

function buildGenresContent(root) {
  const toggleContainer = document.createElement("div");
  toggleContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px;
    background: rgba(15, 23, 41, 0.5);
    border-radius: 8px;
  `;

  const toggleLabel = document.createElement("span");
  toggleLabel.textContent = "Match:";
  toggleLabel.style.cssText = "font-size: 13px; font-weight: 600; color: var(--accent-cyan);";
  toggleContainer.appendChild(toggleLabel);

  const orBtn = document.createElement("button");
  orBtn.type = "button";
  orBtn.textContent = "Any (OR)";
  orBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.genreLogic === "or" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.genreLogic === "or" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;

  const andBtn = document.createElement("button");
  andBtn.type = "button";
  andBtn.textContent = "All (AND)";
  andBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.genreLogic === "and" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.genreLogic === "and" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;

  orBtn.addEventListener("click", () => {
    state.genreLogic = "or";
    orBtn.style.background = "var(--accent-cyan)";
    orBtn.style.color = "#000";
    andBtn.style.background = "transparent";
    andBtn.style.color = "var(--film-white)";
  });

  andBtn.addEventListener("click", () => {
    state.genreLogic = "and";
    andBtn.style.background = "var(--accent-cyan)";
    andBtn.style.color = "#000";
    orBtn.style.background = "transparent";
    orBtn.style.color = "var(--film-white)";
  });

  toggleContainer.appendChild(orBtn);
  toggleContainer.appendChild(andBtn);
  root.appendChild(toggleContainer);

  root.appendChild(makeSectionLabel("Genres"));
  const genres = [
    "Action", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Horror",
    "Mystery", "Romance", "Science Fiction",
    "Thriller", "War", "Western"
  ];

  const genreGroup = document.createElement("div");
  genreGroup.className = "chip-group";
  genres.forEach(g => {
    const svg = GENRE_SVGS[g] || "";
    const chip = makeChip(g, "genres", { type: "genre", name: g });
    if (svg) chip.innerHTML = `<span class="genre-glyph">${svg}</span> ${g}`;
    chip.id = `genre-${g.replace(/\s+/g, '-')}`;
    genreGroup.appendChild(chip);
  });
  root.appendChild(genreGroup);

  root.appendChild(makeSectionLabel("Keywords & Mood"));

  const keywordCategories = [
    { label: "Tone", keywords: ["Noir", "Gritty", "Dark", "Uplifting", "Quirky", "Whimsical", "Bleak"] },
    { label: "Pace", keywords: ["Slow-burn", "Fast-paced", "Intense", "Suspenseful"] },
    { label: "Mood", keywords: ["Emotional", "Feel-good", "Atmospheric", "Cerebral", "Twisted"] },
    { label: "Content", keywords: ["Violent", "Gore", "Family-friendly", "Heartwarming", "Mind-bending"] }
  ];

  keywordCategories.forEach(cat => {
    const catLabel = document.createElement("div");
    catLabel.textContent = cat.label;
    catLabel.style.cssText = "font-size: 11px; color: var(--muted-silver); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 1px;";
    root.appendChild(catLabel);

    const keywordGroup = document.createElement("div");
    keywordGroup.className = "chip-group";
    cat.keywords.forEach(kw => {
      const chip = makeChip(kw, "genres", { type: "keyword", name: kw });
      chip.id = `keyword-${kw.replace(/\s+/g, '-')}`;
      keywordGroup.appendChild(chip);
    });
    root.appendChild(keywordGroup);
  });
}

// =============================================
// 3. RATINGS & CONTENT SECTION
// =============================================

function buildRatingsContentSection(root) {
  const ratingsHeader = document.createElement("div");
  ratingsHeader.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  ratingsHeader.textContent = "Ratings & Votes";
  root.appendChild(ratingsHeader);

  root.appendChild(makeSectionLabel("Quality Score Range (0-10)"));
  const ratingRow = document.createElement("div");
  ratingRow.className = "input-row";
  ratingRow.style.flexDirection = "column";
  ratingRow.style.gap = "12px";

  const minRow = document.createElement("div");
  minRow.style.display = "flex";
  minRow.style.gap = "12px";
  minRow.style.width = "100%";
  minRow.style.alignItems = "center";
  const minLabel = document.createElement("span");
  minLabel.textContent = "Min:";
  minLabel.style.minWidth = "40px";
  const minSlider = document.createElement("input");
  minSlider.type = "range";
  minSlider.id = "ratingMin";
  minSlider.min = "0";
  minSlider.max = "10";
  minSlider.step = "0.1";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "0.0";
  minValue.id = "ratingMinValue";
  minSlider.addEventListener("input", () => {
    minValue.textContent = parseFloat(minSlider.value).toFixed(1);
    const maxSl = document.getElementById("ratingMax");
    if (parseFloat(minSlider.value) > parseFloat(maxSl.value)) {
      maxSl.value = minSlider.value;
      document.getElementById("ratingMaxValue").textContent = parseFloat(minSlider.value).toFixed(1);
    }
  });
  minRow.appendChild(minLabel);
  minRow.appendChild(minSlider);
  minRow.appendChild(minValue);

  const maxRow = document.createElement("div");
  maxRow.style.display = "flex";
  maxRow.style.gap = "12px";
  maxRow.style.width = "100%";
  maxRow.style.alignItems = "center";
  const maxLabel = document.createElement("span");
  maxLabel.textContent = "Max:";
  maxLabel.style.minWidth = "40px";
  const maxSlider = document.createElement("input");
  maxSlider.type = "range";
  maxSlider.id = "ratingMax";
  maxSlider.min = "0";
  maxSlider.max = "10";
  maxSlider.step = "0.1";
  maxSlider.value = "10";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "10.0";
  maxValue.id = "ratingMaxValue";
  maxSlider.addEventListener("input", () => {
    maxValue.textContent = parseFloat(maxSlider.value).toFixed(1);
    const minSl = document.getElementById("ratingMin");
    if (parseFloat(maxSlider.value) < parseFloat(minSl.value)) {
      minSl.value = maxSlider.value;
      document.getElementById("ratingMinValue").textContent = parseFloat(maxSlider.value).toFixed(1);
    }
  });
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);

  ratingRow.appendChild(minRow);
  ratingRow.appendChild(maxRow);
  root.appendChild(ratingRow);

  const ratingQuick = document.createElement("div");
  ratingQuick.className = "chip-group";
  ratingQuick.style.marginTop = "12px";
  [
    { label: "Certified Fresh (8.0+)", min: 8.0, max: 10.0 },
    { label: "Hidden Gems (6.5-7.5)", min: 6.5, max: 7.5 },
    { label: "Cult Classics (<6.0)", min: 0, max: 6.0 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "ratingsContent", {
      type: "rating",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("ratingMin").value = preset.min;
      document.getElementById("ratingMax").value = preset.max;
      document.getElementById("ratingMinValue").textContent = preset.min.toFixed(1);
      document.getElementById("ratingMaxValue").textContent = preset.max.toFixed(1);
    });
    ratingQuick.appendChild(chip);
  });
  root.appendChild(ratingQuick);

  root.appendChild(makeSectionLabel("Minimum Votes (reliability)"));
  const voteGroup = document.createElement("div");
  voteGroup.className = "chip-group";
  [
    { label: "100+", votes: 100 },
    { label: "1,000+", votes: 1000 },
    { label: "5,000+", votes: 5000 },
    { label: "10,000+", votes: 10000 }
  ].forEach(v => {
    const chip = makeChip(v.label, "ratingsContent", { type: "votes", min: v.votes });
    chip.id = `votes-${v.votes}`;
    voteGroup.appendChild(chip);
  });
  root.appendChild(voteGroup);

  // --- DIVIDER ---
  const divider = document.createElement("hr");
  divider.style.cssText = "border: none; border-top: 1px solid rgba(0, 217, 255, 0.15); margin: 24px 0;";
  root.appendChild(divider);

  // --- CONTENT RATING ---
  const suitHeader = document.createElement("div");
  suitHeader.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  suitHeader.textContent = "Content Rating";
  root.appendChild(suitHeader);

  root.appendChild(makeSectionLabel("Age Rating / Certification"));
  const ratings = ["G", "PG", "PG-13", "R", "NC-17", "Unrated"];
  const ratingGroup = document.createElement("div");
  ratingGroup.className = "chip-group";
  ratings.forEach(r => {
    const chip = makeChip(r, "ratingsContent", { type: "certification", rating: r });
    chip.id = `cert-${r.replace('-', '')}`;
    ratingGroup.appendChild(chip);
  });
  root.appendChild(ratingGroup);

  const note = document.createElement("p");
  note.style.fontSize = "12px";
  note.style.color = "var(--muted-silver)";
  note.style.marginTop = "12px";
  note.style.fontStyle = "italic";
  note.textContent = "Note: Ratings are US certifications. Other regions may have different classifications.";
  root.appendChild(note);
}

// =============================================
// 4. REGION & LANGUAGE SECTION
// =============================================

function buildRegionLanguageContent(root) {
  root.appendChild(makeSectionLabel("Production Region"));

  const regionRow = document.createElement("div");
  regionRow.className = "input-row";
  const regionInput = document.createElement("input");
  regionInput.type = "text";
  regionInput.id = "regionInput";
  regionInput.placeholder = "Search for country...";
  regionInput.autocomplete = "off";
  regionRow.appendChild(regionInput);
  root.appendChild(regionRow);

  const regionContainer = document.createElement("div");
  regionContainer.id = "selectedRegionContainer";
  regionContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  root.appendChild(regionContainer);

  const regions = [
    { code: "US", name: "\u{1F1FA}\u{1F1F8} United States" },
    { code: "GB", name: "\u{1F1EC}\u{1F1E7} United Kingdom" },
    { code: "FR", name: "\u{1F1EB}\u{1F1F7} France" },
    { code: "DE", name: "\u{1F1E9}\u{1F1EA} Germany" },
    { code: "JP", name: "\u{1F1EF}\u{1F1F5} Japan" },
    { code: "KR", name: "\u{1F1F0}\u{1F1F7} South Korea" },
    { code: "CN", name: "\u{1F1E8}\u{1F1F3} China" },
    { code: "IN", name: "\u{1F1EE}\u{1F1F3} India" },
    { code: "IT", name: "\u{1F1EE}\u{1F1F9} Italy" },
    { code: "ES", name: "\u{1F1EA}\u{1F1F8} Spain" },
    { code: "CA", name: "\u{1F1E8}\u{1F1E6} Canada" },
    { code: "AU", name: "\u{1F1E6}\u{1F1FA} Australia" }
  ];

  let selectedRegion = null;

  regionInput.addEventListener("input", () => {
    const query = regionInput.value.toLowerCase();
    const filtered = regions.filter(r => r.name.toLowerCase().includes(query) || r.code.toLowerCase().includes(query));

    if (filtered.length > 0 && query.length > 0) {
      renderRegionSuggestions(filtered.slice(0, 5));
    } else {
      hideRegionSuggestions();
    }
  });

  function renderRegionSuggestions(items) {
    hideRegionSuggestions();
    const dropdown = document.createElement("div");
    dropdown.id = "regionDropdown";
    dropdown.style.cssText = `
      position: absolute;
      background: rgba(10, 14, 26, 0.98);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
    `;

    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        selectedRegion = item;
        regionInput.value = "";
        hideRegionSuggestions();

        regionContainer.innerHTML = `
          <div data-region-code="${item.code}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${item.name}</span>
            <button id="removeRegion" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">\u2715</button>
          </div>
        `;

        document.getElementById("removeRegion").onclick = () => {
          selectedRegion = null;
          regionContainer.innerHTML = "";
        };

        handleRegionLanguageLink(item.code);
      };
      dropdown.appendChild(opt);
    });

    regionRow.appendChild(dropdown);
  }

  const countryLanguageMap = {
    "US": "en", "GB": "en", "CA": "en", "AU": "en", "NZ": "en", "IE": "en",
    "FR": "fr", "BE": "fr",
    "DE": "de", "AT": "de",
    "ES": "es", "MX": "es", "AR": "es",
    "IT": "it",
    "JP": "ja",
    "KR": "ko",
    "CN": "zh", "TW": "zh", "HK": "zh",
    "IN": "hi",
    "RU": "ru",
    "BR": "pt", "PT": "pt",
    "SE": "sv",
    "DK": "da",
    "NO": "no",
    "FI": "fi",
    "NL": "nl",
    "PL": "pl",
    "TR": "tr",
    "TH": "th",
    "ID": "id",
    "VN": "vi"
  };

  const languageNames = {
    "en": "English", "fr": "French", "de": "German", "es": "Spanish",
    "it": "Italian", "ja": "Japanese", "ko": "Korean", "zh": "Chinese",
    "hi": "Hindi", "ru": "Russian", "pt": "Portuguese", "ar": "Arabic",
    "sv": "Swedish", "da": "Danish", "no": "Norwegian", "fi": "Finnish",
    "nl": "Dutch", "pl": "Polish", "tr": "Turkish", "th": "Thai",
    "id": "Indonesian", "vi": "Vietnamese"
  };

  function handleRegionLanguageLink(countryCode) {
    const langCode = countryLanguageMap[countryCode];
    if (!langCode) return;

    const englishToggle = document.getElementById("englishOnlyToggle");
    const langSearchSection = document.getElementById("langSearchSection");
    const langContainer = document.getElementById("selectedLanguageContainer");
    const toggleKnob = document.getElementById("toggleKnob");
    const toggleBg = englishToggle?.parentElement?.querySelector('span');

    if (langCode === "en") {
      if (englishToggle && !englishToggle.checked) {
        englishToggle.checked = true;
        sessionStorage.setItem('englishOnlyToggle', 'true');
        if (toggleBg) toggleBg.style.background = 'var(--accent-cyan)';
        if (toggleKnob) {
          toggleKnob.style.transform = 'translateX(24px)';
          toggleKnob.style.background = 'white';
        }
        if (langSearchSection) langSearchSection.style.display = 'none';
        if (langContainer) langContainer.innerHTML = '';
      }
    } else {
      if (englishToggle) {
        englishToggle.checked = false;
        sessionStorage.setItem('englishOnlyToggle', 'false');
        if (toggleBg) toggleBg.style.background = 'rgba(255,255,255,0.1)';
        if (toggleKnob) {
          toggleKnob.style.transform = 'translateX(0)';
          toggleKnob.style.background = 'var(--muted-silver)';
        }
        if (langSearchSection) langSearchSection.style.display = 'block';
      }

      const langName = languageNames[langCode] || langCode;
      if (langContainer) {
        langContainer.innerHTML = `
          <div data-lang-code="${langCode}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${langName}</span>
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">\u2715</button>
          </div>
        `;

        document.getElementById("removeLanguage").onclick = () => {
          langContainer.innerHTML = "";
        };
      }
    }
  }

  function hideRegionSuggestions() {
    const existing = document.getElementById("regionDropdown");
    if (existing) existing.remove();
  }

  root.appendChild(makeSectionLabel("Original Language"));

  // English Only Toggle
  const englishToggleRow = document.createElement("div");
  englishToggleRow.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: 10px;
    margin-bottom: 12px;
  `;

  const toggleLabel = document.createElement("div");
  toggleLabel.innerHTML = `
    <span style="font-weight: 600; color: var(--film-white);">English Only</span>
    <span style="font-size: 11px; color: var(--muted-silver); display: block; margin-top: 2px;">Hollywood, UK, Australian & Canadian productions</span>
  `;

  const toggleSwitch = document.createElement("label");
  toggleSwitch.style.cssText = `
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    cursor: pointer;
  `;
  toggleSwitch.innerHTML = `
    <input type="checkbox" id="englishOnlyToggle" style="opacity: 0; width: 0; height: 0;">
    <span style="
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.1);
      border-radius: 26px;
      transition: 0.3s;
    "></span>
    <span style="
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: var(--muted-silver);
      border-radius: 50%;
      transition: 0.3s;
    " id="toggleKnob"></span>
  `;

  englishToggleRow.appendChild(toggleLabel);
  englishToggleRow.appendChild(toggleSwitch);
  root.appendChild(englishToggleRow);

  // Language search row
  const langSearchSection = document.createElement("div");
  langSearchSection.id = "langSearchSection";

  const langRow = document.createElement("div");
  langRow.className = "input-row";
  const langInput = document.createElement("input");
  langInput.type = "text";
  langInput.id = "languageInput";
  langInput.placeholder = "Search for language (Korean, French, Hindi...)";
  langInput.autocomplete = "off";
  langRow.appendChild(langInput);
  langSearchSection.appendChild(langRow);

  const langContainer = document.createElement("div");
  langContainer.id = "selectedLanguageContainer";
  langContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  langSearchSection.appendChild(langContainer);

  root.appendChild(langSearchSection);

  // Toggle functionality
  const englishToggle = toggleSwitch.querySelector('#englishOnlyToggle');
  const toggleKnob = toggleSwitch.querySelector('#toggleKnob');
  const toggleBg = toggleSwitch.querySelector('span');

  const savedState = sessionStorage.getItem('englishOnlyToggle');
  const isEnglishOnly = savedState === null ? true : savedState === 'true';

  function updateToggleUI(isOn) {
    if (isOn) {
      toggleBg.style.background = 'var(--accent-cyan)';
      toggleKnob.style.transform = 'translateX(24px)';
      toggleKnob.style.background = 'white';
      langSearchSection.style.display = 'none';
    } else {
      toggleBg.style.background = 'rgba(255,255,255,0.1)';
      toggleKnob.style.transform = 'translateX(0)';
      toggleKnob.style.background = 'var(--muted-silver)';
      langSearchSection.style.display = 'block';
    }
  }

  englishToggle.checked = isEnglishOnly;
  updateToggleUI(isEnglishOnly);

  englishToggle.addEventListener('change', () => {
    const isOn = englishToggle.checked;
    sessionStorage.setItem('englishOnlyToggle', isOn.toString());
    updateToggleUI(isOn);

    if (isOn) {
      langContainer.innerHTML = '';
    }
  });

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
    { code: "sv", name: "Swedish" },
    { code: "da", name: "Danish" },
    { code: "no", name: "Norwegian" },
    { code: "fi", name: "Finnish" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" },
    { code: "th", name: "Thai" },
    { code: "id", name: "Indonesian" },
    { code: "vi", name: "Vietnamese" }
  ];

  let selectedLanguage = null;

  langInput.addEventListener("input", () => {
    const query = langInput.value.toLowerCase();
    const filtered = languages.filter(l => l.name.toLowerCase().includes(query) || l.code.toLowerCase().includes(query));

    if (filtered.length > 0 && query.length > 0) {
      renderLanguageSuggestions(filtered.slice(0, 5));
    } else {
      hideLanguageSuggestions();
    }
  });

  function renderLanguageSuggestions(items) {
    hideLanguageSuggestions();
    const dropdown = document.createElement("div");
    dropdown.id = "languageDropdown";
    dropdown.style.cssText = `
      position: absolute;
      background: rgba(10, 14, 26, 0.98);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
    `;

    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        selectedLanguage = item;
        langInput.value = "";
        hideLanguageSuggestions();

        langContainer.innerHTML = `
          <div data-lang-code="${item.code}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${item.name}</span>
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">\u2715</button>
          </div>
        `;

        document.getElementById("removeLanguage").onclick = () => {
          selectedLanguage = null;
          langContainer.innerHTML = "";
        };
      };
      dropdown.appendChild(opt);
    });

    langRow.appendChild(dropdown);
  }

  function hideLanguageSuggestions() {
    const existing = document.getElementById("languageDropdown");
    if (existing) existing.remove();
  }
}

// =============================================
// 5. WATCH PROVIDERS SECTION
// =============================================

function buildWatchContent(root) {
  const savedCountry = localStorage.getItem("watchCountry") || "";
  let allProviderData = [];

  root.appendChild(makeSectionLabel("Your Country"));

  const countrySelect = document.createElement("select");
  countrySelect.id = "watchCountrySelect";
  countrySelect.style.cssText = "width: 100%; padding: 10px 12px; background: rgba(15,23,41,0.6); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; color: var(--film-white); font-size: 13px; margin-bottom: 16px; cursor: pointer; appearance: none;";
  const countries = [
    ["", "Select country..."],
    ["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"], ["AU", "Australia"],
    ["NZ", "New Zealand"], ["IE", "Ireland"], ["DE", "Germany"], ["FR", "France"],
    ["ES", "Spain"], ["IT", "Italy"], ["PT", "Portugal"], ["NL", "Netherlands"],
    ["BE", "Belgium"], ["AT", "Austria"], ["CH", "Switzerland"], ["SE", "Sweden"],
    ["NO", "Norway"], ["DK", "Denmark"], ["FI", "Finland"], ["PL", "Poland"],
    ["BR", "Brazil"], ["MX", "Mexico"], ["AR", "Argentina"], ["CL", "Chile"],
    ["CO", "Colombia"], ["JP", "Japan"], ["KR", "South Korea"], ["IN", "India"],
    ["SG", "Singapore"], ["ZA", "South Africa"]
  ];
  countrySelect.innerHTML = countries.map(([code, name]) =>
    `<option value="${code}"${code === savedCountry ? " selected" : ""}>${name}</option>`
  ).join("");
  root.appendChild(countrySelect);

  root.appendChild(makeSectionLabel("Your Streaming Services"));

  const hint = document.createElement("p");
  hint.style.cssText = "font-size: 11px; color: var(--muted-silver); margin-bottom: 10px; font-style: italic;";
  hint.textContent = "Select services you subscribe to. Orbit Search will filter results to these.";
  root.appendChild(hint);

  const providerContainer = document.createElement("div");
  providerContainer.id = "watchProviderChips";
  providerContainer.className = "chip-group";
  providerContainer.style.flexWrap = "wrap";
  root.appendChild(providerContainer);

  const status = document.createElement("div");
  status.id = "watchStatus";
  status.style.cssText = "margin-top: 12px; padding: 8px 12px; border-radius: 8px; font-size: 11px; display: none;";
  root.appendChild(status);

  function updateStatus() {
    const country = countrySelect.value;
    const activeChips = providerContainer.querySelectorAll(".chip.active");
    if (country && activeChips.length > 0) {
      const names = Array.from(activeChips).map(c => {
        try { return JSON.parse(c.dataset.value).name; } catch { return ""; }
      }).filter(Boolean);
      status.style.display = "block";
      status.style.background = "rgba(0,217,255,0.08)";
      status.style.border = "1px solid rgba(0,217,255,0.25)";
      status.style.color = "var(--accent-cyan)";
      status.textContent = `Orbit will filter by: ${names.join(", ")} (${country})`;
    } else {
      status.style.display = "none";
    }
  }

  function saveToLocalStorage() {
    const country = countrySelect.value;
    if (country) {
      localStorage.setItem("watchCountry", country);
    } else {
      localStorage.removeItem("watchCountry");
    }

    const activeChips = providerContainer.querySelectorAll(".chip.active");
    const providers = Array.from(activeChips).map(c => {
      try { return JSON.parse(c.dataset.value); } catch { return null; }
    }).filter(Boolean).map(v => ({ id: v.id, name: v.name, logo: v.logo || "" }));
    localStorage.setItem("watchProviders", JSON.stringify(providers));

    updateStatus();
  }

  function loadProviders(country) {
    if (!country) {
      providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
      return;
    }
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Loading providers...</span>';

    // Fetch both movie and TV providers, merge them
    Promise.all([
      fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${TMDB_API_KEY}&watch_region=${country}`).then(r => { if (!r.ok) throw new Error(`TMDB ${r.status}`); return r.json(); }),
      fetch(`https://api.themoviedb.org/3/watch/providers/tv?api_key=${TMDB_API_KEY}&watch_region=${country}`).then(r => { if (!r.ok) throw new Error(`TMDB ${r.status}`); return r.json(); })
    ]).then(([movieData, tvData]) => {
      const seen = new Set();
      const merged = [];
      [...(movieData.results || []), ...(tvData.results || [])].forEach(p => {
        if (!seen.has(p.provider_id)) {
          seen.add(p.provider_id);
          merged.push(p);
        }
      });
      allProviderData = merged.slice(0, 30);
      providerContainer.innerHTML = "";

      let savedIds = [];
      try { savedIds = JSON.parse(localStorage.getItem("watchProviders") || "[]").map(p => p.id); } catch {}

      allProviderData.forEach(p => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        if (savedIds.includes(p.provider_id)) chip.classList.add("active");
        chip.dataset.value = JSON.stringify({ type: "provider", id: p.provider_id, name: p.provider_name, logo: p.logo_path, region: country });
        chip.style.cssText = "display: flex; align-items: center; gap: 6px; padding: 6px 10px;";
        const logo = p.logo_path ? `<img src="https://image.tmdb.org/t/p/w45${p.logo_path}" style="width:20px;height:20px;border-radius:3px;">` : "";
        chip.innerHTML = `${logo}<span>${p.provider_name}</span>`;
        chip.addEventListener("click", () => {
          chip.classList.toggle("active");
          saveToLocalStorage();
        });
        providerContainer.appendChild(chip);
      });

      updateStatus();
    }).catch(() => {
      providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Failed to load providers</span>';
    });
  }

  countrySelect.addEventListener("change", () => {
    saveToLocalStorage();
    loadProviders(countrySelect.value);
  });

  if (savedCountry) {
    loadProviders(savedCountry);
  } else {
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
  }
}

// =============================================
// 6. YEAR & DECADE SECTION
// =============================================

function buildYearDecadeContent(root) {
  root.appendChild(makeSectionLabel("Specific Year"));
  const yearRow = document.createElement("div");
  yearRow.className = "input-row";
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.id = "yearInput";
  yearInput.min = "1920";
  yearInput.max = "2030";
  yearInput.placeholder = "e.g., 2023";
  yearRow.appendChild(yearInput);
  root.appendChild(yearRow);

  root.appendChild(makeSectionLabel("Decades"));
  const decadeGroup = document.createElement("div");
  decadeGroup.className = "chip-group";
  [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].forEach(decade => {
    const chip = makeChip(`${decade}s`, "yearDecade", { type: "decade", decade });
    chip.id = `decade-${decade}`;
    decadeGroup.appendChild(chip);
  });
  root.appendChild(decadeGroup);

  root.appendChild(makeSectionLabel("Date Range"));
  const dateRow = document.createElement("div");
  dateRow.className = "input-row";
  dateRow.style.display = "flex";
  dateRow.style.gap = "12px";

  const dateStart = document.createElement("input");
  dateStart.type = "date";
  dateStart.id = "dateStart";
  dateStart.style.flex = "1";
  dateRow.appendChild(dateStart);

  const dateSep = document.createElement("span");
  dateSep.textContent = "to";
  dateSep.style.cssText = "align-self: center; color: var(--muted-silver); font-size: 13px;";
  dateRow.appendChild(dateSep);

  const dateEnd = document.createElement("input");
  dateEnd.type = "date";
  dateEnd.id = "dateEnd";
  dateEnd.style.flex = "1";
  dateRow.appendChild(dateEnd);

  root.appendChild(dateRow);
}

// =============================================
// COLLECT LABELS FOR EACH SECTION
// =============================================

function collectLabelsForSection(sectionKey) {
  const results = [];

  switch (sectionKey) {
    case "people":
      const selectedPeopleChips = document.querySelectorAll('.selected-person-chip');
      return Array.from(selectedPeopleChips).map(chip => {
        const role = chip.dataset.personRole;
        let roleLabel = "";
        if (role === "cast") roleLabel = " (Actor)";
        else if (role === "crew") roleLabel = " (Behind Camera)";
        return {
          label: chip.dataset.personName + roleLabel,
          value: {
            type: "person",
            id: chip.dataset.personId,
            name: chip.dataset.personName,
            role: role
          }
        };
      });

    case "genres":
      const genreChips = document.querySelectorAll('#focusContent .chip.active');
      return Array.from(genreChips).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent, value };
      });

    case "ratingsContent":
      // Rating sliders
      const ratingMin = document.getElementById("ratingMin");
      const ratingMax = document.getElementById("ratingMax");
      if (ratingMin && ratingMax) {
        const min = parseFloat(ratingMin.value);
        const max = parseFloat(ratingMax.value);
        if (min > 0 || max < 10) {
          results.push({
            label: `Rating: ${min.toFixed(1)}-${max.toFixed(1)}`,
            value: { type: "rating", min, max }
          });
        }
      }

      // Vote chips
      const voteChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "votes";
        });
      voteChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: `Min votes: ${value.min.toLocaleString()}`,
          value
        });
      });

      // Certification chips
      const certChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "certification";
        });
      certChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: `Rated ${value.rating}`,
          value
        });
      });

      return results;

    case "regionLanguage":
      const regionContainer = document.getElementById("selectedRegionContainer");
      if (regionContainer && regionContainer.children.length > 0) {
        const regionChip = regionContainer.querySelector('[data-region-code]');
        const regionText = regionContainer.querySelector('span')?.textContent;
        if (regionChip && regionText) {
          const code = regionChip.dataset.regionCode;
          results.push({
            label: `Region: ${regionText}`,
            value: { type: "region", code: code, name: regionText }
          });
        }
      }

      const englishToggle = document.getElementById("englishOnlyToggle");
      const langContainer = document.getElementById("selectedLanguageContainer");

      if (englishToggle && englishToggle.checked) {
        results.push({
          label: `Language: English`,
          value: { type: "language", code: "en", name: "English" }
        });
      } else if (langContainer && langContainer.children.length > 0) {
        const langChip = langContainer.querySelector('[data-lang-code]');
        const langText = langContainer.querySelector('span')?.textContent;
        if (langChip && langText) {
          const langCode = langChip.dataset.langCode;
          results.push({
            label: `Language: ${langText}`,
            value: { type: "language", code: langCode, name: langText }
          });
        }
      }

      return results;

    case "watch":
      const watchChips = document.querySelectorAll('#watchProviderChips .chip.active');
      return Array.from(watchChips).map(chip => {
        try {
          const val = JSON.parse(chip.dataset.value);
          return { label: val.name, value: val };
        } catch { return null; }
      }).filter(Boolean);

    case "yearDecade":
      const yearInput = document.getElementById("yearInput");
      if (yearInput && yearInput.value.trim()) {
        const year = parseInt(yearInput.value.trim());
        if (year >= 1920 && year <= 2030) {
          results.push({
            label: `Year: ${year}`,
            value: { type: "year", year }
          });
        }
      }

      const decadeChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          try {
            const val = JSON.parse(chip.dataset.value);
            return val.type === "decade";
          } catch { return false; }
        });
      decadeChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: `${value.decade}s`,
          value
        });
      });

      const dateStart = document.getElementById("dateStart");
      const dateEnd = document.getElementById("dateEnd");
      if (dateStart && dateEnd && dateStart.value && dateEnd.value) {
        results.push({
          label: `${dateStart.value} to ${dateEnd.value}`,
          value: { type: "dateRange", start: dateStart.value, end: dateEnd.value }
        });
      }

      return results;

    default:
      return [];
  }
}
