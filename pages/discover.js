/* =============================================
   ORBIT - CINEMATIC MOVIE DISCOVERY
   Complete Application Logic
============================================= */

// =============================================
// GENRE & KEYWORD MAPPINGS
// =============================================

const GENRE_MAP = {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Romance": 10749,
  "Science Fiction": 878,
  "Thriller": 53,
  "TV Movie": 10770,
  "War": 10752,
  "Western": 37
};

const GENRE_SVGS = {
  "Action": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L8 8M13 3L10 3M13 3L13 6"/><path d="M3 13L8 8M3 13L6 13M3 13L3 10"/></svg>`,
  "Adventure": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L10 6H14L11 9L12 14L8 11L4 14L5 9L2 6H6Z"/></svg>`,
  "Animation": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="8" r="4"/><circle cx="11" cy="7" r="3" opacity="0.6"/></svg>`,
  "Comedy": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M5.5 6.5V6"/><path d="M10.5 6.5V6"/><path d="M5.5 10Q8 12.5 10.5 10"/></svg>`,
  "Crime": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="2"/><line x1="8" y1="8" x2="8" y2="14"/><line x1="5" y1="10" x2="11" y2="10"/></svg>`,
  "Documentary": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="8" y1="12" x2="8" y2="14"/></svg>`,
  "Drama": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3Q5 2 6 4Q7 2 8 3"/><path d="M4 5V5.5"/><path d="M7 5V5.5"/><path d="M4.5 7Q5.5 6 6.5 7"/><path d="M9 9Q11 8 12 10Q13 8 14 9"/><path d="M10 11V11.5"/><path d="M13 11V11.5"/><path d="M10.5 13Q11.5 14 12.5 13"/></svg>`,
  "Family": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="5" cy="5" r="2"/><circle cx="11" cy="5" r="2"/><circle cx="8" cy="10" r="1.5"/><path d="M5 7V9Q5 11 8 11.5"/><path d="M11 7V9Q11 11 8 11.5"/></svg>`,
  "Fantasy": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L9 5L12 4L10 7L14 8L10 9L12 12L9 11L8 14L7 11L4 12L6 9L2 8L6 7L4 4L7 5Z"/></svg>`,
  "History": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14V6L8 3L13 6V14"/><line x1="3" y1="14" x2="13" y2="14"/><rect x="6" y="9" width="4" height="5" rx="0.5"/><line x1="8" y1="6" x2="8" y2="8"/></svg>`,
  "Horror": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="5"/><path d="M6 6V7"/><path d="M10 6V7"/><path d="M6 9.5Q8 11 10 9.5"/><path d="M5 2Q6 4 8 4Q10 4 11 2"/></svg>`,
  "Music": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12V4L13 2V10"/><circle cx="4" cy="12" r="2"/><circle cx="11" cy="10" r="2"/></svg>`,
  "Mystery": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>`,
  "Romance": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14Q1 8 4 4Q6 2 8 5Q10 2 12 4Q15 8 8 14Z"/></svg>`,
  "Science Fiction": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><ellipse cx="8" cy="8" rx="7" ry="3" transform="rotate(-30 8 8)"/></svg>`,
  "Thriller": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2V5"/><path d="M8 11V14"/><path d="M2 8H5"/><path d="M11 8H14"/><circle cx="8" cy="8" r="2"/></svg>`,
  "TV Movie": `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="8" rx="1"/><line x1="6" y1="13" x2="10" y2="13"/><line x1="8" y1="11" x2="8" y2="13"/></svg>`,
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

// =============================================
// SETTINGS DATA (orbit-movie-settings.json)
// =============================================

let _settingsDataCache = null;
let _settingsDataLoading = false;
let _settingsDataCallbacks = [];

async function getSettingsData() {
  if (_settingsDataCache) return _settingsDataCache;

  if (_settingsDataLoading) {
    return new Promise(resolve => _settingsDataCallbacks.push(resolve));
  }

  _settingsDataLoading = true;
  try {
    const response = await fetch('../data/orbit-movie-settings.json');
    _settingsDataCache = await response.json();
    _settingsDataCallbacks.forEach(cb => cb(_settingsDataCache));
    _settingsDataCallbacks = [];
    console.log(`[Orbit] Settings data loaded: ${Object.keys(_settingsDataCache.movies).length} movies`);
    return _settingsDataCache;
  } catch (e) {
    console.warn('[Orbit] Settings data unavailable:', e.message);
    _settingsDataCallbacks.forEach(cb => cb(null));
    _settingsDataCallbacks = [];
    return null;
  } finally {
    _settingsDataLoading = false;
  }
}

// Pre-load when page opens (non-blocking)
getSettingsData();

const state = {
  filters: [],
  genreLogic: "or"
};

const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const searchDropdown = document.getElementById("searchDropdown");

// Move dropdown to body to fix positioning (backdrop-filter on parent breaks position:fixed)
if (searchDropdown) document.body.appendChild(searchDropdown);

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

let searchDebounceTimer;

const SEARCH_PLACEHOLDERS = {
  movie: "Search movies...",
  actor: "Search actors...",
  crew: "Search directors, writers, producers...",
};

const CREW_DEPARTMENTS = ["Directing", "Writing", "Production", "Camera", "Editing", "Sound", "Art", "Costume & Make-Up"];

if (searchType) searchType.addEventListener('change', () => {
  if (searchInput) {
    searchInput.placeholder = SEARCH_PLACEHOLDERS[searchType.value] || "Search...";
    searchInput.value = '';
    hideSearchDropdown();
    searchInput.focus();
  }
});

if (searchInput) searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceTimer);
  const query = searchInput.value.trim();
  const type = searchType.value;

  if (query.length >= 2) {
    searchDebounceTimer = setTimeout(() => fetchSearchResults(query, type), 300);
  } else {
    hideSearchDropdown();
  }
});

if (searchInput) searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideSearchDropdown();
});

async function fetchSearchResults(query, type) {
  let endpoint;
  switch(type) {
    case "movie": endpoint = "/search/movie"; break;
    case "actor": case "crew": endpoint = "/search/person"; break;
    default: return;
  }

  const url = `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const data = await response.json();
    let results = data.results || [];

    if (type === "actor") {
      results = results.filter(p => p.known_for_department === "Acting");
    } else if (type === "crew") {
      results = results.filter(p => CREW_DEPARTMENTS.includes(p.known_for_department));
    }

    renderSearchDropdown(results.slice(0, 8), type);
  } catch (err) {
    console.error("Search error:", err);
  }
}

function renderSearchDropdown(results, type) {
  if (results.length === 0) {
    hideSearchDropdown();
    return;
  }
  
  // Get search input position and size with extra precision
  const rect = searchInput.getBoundingClientRect();
  const containerRect = searchInput.parentElement.getBoundingClientRect();
  
  // Position dropdown directly below search input with no gap
  searchDropdown.style.display = 'block';
  searchDropdown.style.position = 'fixed';
  searchDropdown.style.top = `${rect.bottom}px`; // No gap - seamless connection
  searchDropdown.style.left = `${rect.left}px`;
  searchDropdown.style.width = `${rect.width}px`;
  searchDropdown.style.zIndex = '10000';
  
  // Add class to input for seamless visual connection
  searchInput.classList.add('dropdown-open');
  
  // Remove top border for seamless connection
  searchDropdown.style.borderTop = 'none';
  searchDropdown.style.borderTopLeftRadius = '0';
  searchDropdown.style.borderTopRightRadius = '0';
  
  searchDropdown.innerHTML = results.map(item => {
    let icon, title, subtitle, image, imgClass, rating;

    switch(type) {
      case "movie":
        icon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg>';
        title = item.title;
        subtitle = item.release_date ? item.release_date.split('-')[0] : '';
        image = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : '';
        imgClass = "poster"; rating = item.vote_average;
        break;
      case "actor":
        icon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4v2"/></svg>';
        title = item.name;
        subtitle = (item.known_for || []).map(k => k.title || k.name).slice(0, 2).join(", ") || "Actor";
        image = item.profile_path ? `https://image.tmdb.org/t/p/w92${item.profile_path}` : '';
        imgClass = "profile"; rating = null;
        break;
      case "crew":
        icon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg>';
        title = item.name;
        subtitle = item.known_for_department || "Crew";
        image = item.profile_path ? `https://image.tmdb.org/t/p/w92${item.profile_path}` : '';
        imgClass = "profile"; rating = null;
        break;
    }

    const ratingHtml = rating && rating > 0 ? `<span class="rating-badge">★ ${rating.toFixed(1)}</span>` : '';
    const imgHtml = image
      ? `<img src="${image}" alt="${title}" class="dropdown-img ${imgClass}" onerror="this.style.display='none'">`
      : `<div class="dropdown-img ${imgClass} dropdown-img-placeholder"></div>`;

    return `
      <div class="dropdown-item" data-id="${item.id}" data-type="${type}" data-title="${title.replace(/"/g, '&quot;')}">
        ${imgHtml}
        <div class="dropdown-info">
          <div class="dropdown-title"><span class="type-icon">${icon}</span>${title}${ratingHtml}</div>
          <div class="dropdown-subtitle">${subtitle}</div>
        </div>
      </div>
    `;
  }).join('');
  
  searchDropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => handleSearchItemClick(item));
  });
}

async function handleSearchItemClick(item) {
  const id = item.dataset.id;
  const type = item.dataset.type;
  const title = item.dataset.title || '';

  hideSearchDropdown();

  // Show hyperspace transition
  const hyperspace = document.getElementById('hyperspaceOverlay');
  if (hyperspace) hyperspace.hidden = false;

  // Clear previous search state so results.html doesn't show stale filters
  localStorage.removeItem("vennPeople");
  localStorage.removeItem("orbitFilters");
  localStorage.removeItem("movies");
  localStorage.removeItem("orbitBaseQuery");

  if (type === "movie") {
    try {
      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
      if (!movieRes.ok) throw new Error(`TMDB ${movieRes.status}`);
      const movie = await movieRes.json();

      if (movie.belongs_to_collection) {
        localStorage.setItem("timelineMovieId", id);
        localStorage.setItem("timelineType", "movie");
        setTimeout(() => { window.location.href = 'timeline.html'; }, 600);
      } else {
        localStorage.setItem("singleMovie", JSON.stringify(movie));
        localStorage.setItem("resultsMode", "single");
        setTimeout(() => { window.location.href = 'results.html'; }, 600);
      }
    } catch (err) {
      localStorage.setItem("timelineMovieId", id);
      localStorage.setItem("timelineType", "movie");
      setTimeout(() => { window.location.href = 'timeline.html'; }, 600);
    }
  } else if (type === "actor" || type === "crew") {
    localStorage.setItem("timelineMovieId", id);
    localStorage.setItem("timelineType", "person");
    setTimeout(() => { window.location.href = 'timeline.html'; }, 600);
  }
}

function hideSearchDropdown() {
  if (!searchDropdown) return;
  searchDropdown.style.display = 'none';
  searchDropdown.innerHTML = '';
  if (searchInput) searchInput.classList.remove('dropdown-open');
}

document.addEventListener('click', (e) => {
  if (searchInput && searchDropdown && searchType &&
      !searchInput.contains(e.target) && !searchDropdown.contains(e.target) && !searchType.contains(e.target)) {
    hideSearchDropdown();
  }
});

// Reposition dropdown on scroll/resize to keep it attached
window.addEventListener('scroll', () => {
  if (searchDropdown && searchDropdown.style.display === 'block' && searchInput) {
    const rect = searchInput.getBoundingClientRect();
    searchDropdown.style.top = `${rect.bottom}px`;
    searchDropdown.style.left = `${rect.left}px`;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (searchDropdown && searchDropdown.style.display === 'block' && searchInput) {
    const rect = searchInput.getBoundingClientRect();
    searchDropdown.style.top = `${rect.bottom}px`;
    searchDropdown.style.left = `${rect.left}px`;
    searchDropdown.style.width = `${rect.width}px`;
  }
});

// ── Build filter grid + More modal from layout ──
(function buildFilterLayout() {
  var registry = OrbitUtils.FILTER_REGISTRY;
  var layout = OrbitUtils.store.get('orbit_search_layout') || OrbitUtils.DEFAULT_LAYOUT;
  var filterGrid = document.getElementById('filterGrid');
  var moreBtn = document.getElementById('moreFiltersBtn');
  var moreGrid = document.getElementById('moreFiltersGrid');
  if (!filterGrid || !moreBtn || !registry) return;

  // Primary cards
  layout.forEach(function(id) {
    var def = registry.find(function(r) { return r.id === id; });
    if (!def) return;
    var btn = document.createElement('button');
    btn.className = 'section-card';
    btn.dataset.section = def.id;
    btn.innerHTML =
      '<div class="orbit-icon ' + def.iconClass + '">' +
        '<div class="ring-outer"></div><div class="ring-inner"></div><div class="icon-core"></div>' +
      '</div>' +
      '<div class="section-text"><h2>' + def.title + '</h2><p>' + def.subtitle + '</p></div>';
    filterGrid.insertBefore(btn, moreBtn);
  });

  // More modal tiles (everything not in layout)
  if (moreGrid) {
    var layoutSet = {};
    layout.forEach(function(id) { layoutSet[id] = true; });
    registry.filter(function(r) { return !layoutSet[r.id]; }).forEach(function(def) {
      var tile = document.createElement('button');
      tile.className = 'more-filter-tile';
      tile.dataset.section = def.id;
      tile.innerHTML =
        '<div class="orbit-icon ' + def.iconClass + '">' +
          '<div class="ring-outer"></div><div class="ring-inner"></div><div class="icon-core"></div>' +
        '</div>' +
        '<span class="more-filter-label">' + def.title + '</span>';
      moreGrid.appendChild(tile);
    });
  }

  // Update More button subtitle with remaining filter names
  var layoutSet2 = {};
  layout.forEach(function(id) { layoutSet2[id] = true; });
  var secondaryNames = registry.filter(function(r) { return !layoutSet2[r.id]; })
    .slice(0, 3).map(function(r) { return r.title.split(':')[0].trim(); });
  var moreSubtitle = moreBtn.querySelector('.section-text p');
  if (moreSubtitle && secondaryNames.length) {
    moreSubtitle.textContent = secondaryNames.join(', ') + ' & more';
  }
})();

const sectionDefinitions = {
  people: { title: "People", builder: buildPeopleContent },
  genres: { title: "Genres", builder: buildGenresContent },
  themes: { title: "Themes", builder: buildThemesContent },
  settingWhere: { title: "Setting: Where", builder: buildSettingWhereContent },
  settingWhen: { title: "Setting: When", builder: buildSettingWhenContent },
  basedOn: { title: "Based On", builder: buildBasedOnContent },
  timeEra: { title: "Release Date & Runtime", builder: buildTimeEraContent },
  ratingsContent: { title: "Ratings & Content", builder: buildRatingsContentSection },
  regionLanguage: { title: "Region & Language", builder: buildRegionLanguageContent },
  production: { title: "Production & Box Office", builder: buildProductionContent },
  watch: { title: "Watch Providers", builder: buildWatchContent },
  universes: { title: "Universes", builder: buildUniversesContent },
  awards: { title: "Awards", builder: buildAwardsContent }
};

let currentSectionKey = null;

document.getElementById('filterGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.section-card[data-section]');
  if (card) openFocusCard(card.dataset.section);
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
  // If opened from More modal, reopen it
  if (typeof openedFromMore !== 'undefined' && openedFromMore) {
    openedFromMore = false;
    openMoreFilters();
  }
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
  document.querySelectorAll(".section-card[data-section]").forEach((card) => {
    if (sectionsWithFilters.has(card.dataset.section)) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Update "More Filters" badge with count of active secondary filters
  const currentLayout = OrbitUtils.store.get('orbit_search_layout') || OrbitUtils.DEFAULT_LAYOUT;
  const layoutSet = new Set(currentLayout);
  const secondarySections = OrbitUtils.FILTER_REGISTRY.filter(r => !layoutSet.has(r.id)).map(r => r.id);
  const secondaryCount = secondarySections.filter(s => sectionsWithFilters.has(s)).length;
  const moreBadge = document.getElementById('moreBadge');
  if (moreBadge) {
    moreBadge.textContent = secondaryCount;
    moreBadge.hidden = secondaryCount === 0;
  }

  // Sync active state on More modal tiles
  document.querySelectorAll('.more-filter-tile').forEach(tile => {
    tile.classList.toggle('active', sectionsWithFilters.has(tile.dataset.section));
  });

  // Show reset button when there are active filters or persisted session criteria
  var resetBtn = document.getElementById('resetOrbitButton');
  if (resetBtn) {
    var hasSession = false;
    try { hasSession = !!sessionStorage.getItem('orbit_search_criteria'); } catch (e) {}
    resetBtn.hidden = !hasFilters && !hasSession;
  }
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
clearAllButton.onclick = () => {
  state.filters = [];
  state.genreLogic = 'or';
  try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
  updateUIFromState();
};

// ── Restore search criteria from sessionStorage ──
(function restoreSearchCriteria() {
  try {
    var raw = sessionStorage.getItem('orbit_search_criteria');
    if (!raw) return;
    var saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.filters)) return;
    var valid = saved.filters.filter(function(f) {
      return f && typeof f.id === 'string' && typeof f.section === 'string' && typeof f.label === 'string';
    });
    if (valid.length === 0) return;
    state.filters = valid;
    if (saved.genreLogic === 'and' || saved.genreLogic === 'or') {
      state.genreLogic = saved.genreLogic;
    }
    updateUIFromState();
  } catch (e) { /* corrupted data — start fresh */ }
})();

// ── Reset button: clears all criteria + sessionStorage ──
var resetOrbitButton = document.getElementById('resetOrbitButton');
if (resetOrbitButton) {
  resetOrbitButton.addEventListener('click', function() {
    state.filters = [];
    state.genreLogic = 'or';
    try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
    updateUIFromState();
  });
}

// ── More Filters modal ──
const moreFiltersOverlay = document.getElementById('moreFiltersOverlay');
const moreFiltersBtn = document.getElementById('moreFiltersBtn');
const moreFiltersClose = document.getElementById('moreFiltersClose');
let openedFromMore = false;

function openMoreFilters() {
  if (!moreFiltersOverlay) return;
  // Sync active state on tiles
  const sectionsWithFilters = new Set(state.filters.map(f => f.section));
  moreFiltersOverlay.querySelectorAll('.more-filter-tile').forEach(tile => {
    tile.classList.toggle('active', sectionsWithFilters.has(tile.dataset.section));
  });
  moreFiltersOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeMoreFilters() {
  if (!moreFiltersOverlay) return;
  moreFiltersOverlay.hidden = true;
  if (focusOverlay.hidden) {
    document.body.style.overflow = '';
  }
}

if (moreFiltersBtn) {
  moreFiltersBtn.addEventListener('click', openMoreFilters);
}

if (moreFiltersClose) {
  moreFiltersClose.addEventListener('click', closeMoreFilters);
}

// Backdrop click closes modal
if (moreFiltersOverlay) {
  moreFiltersOverlay.addEventListener('click', (e) => {
    if (e.target === moreFiltersOverlay) closeMoreFilters();
  });
}

// Tile clicks → close modal, open focus card for that section
document.getElementById('moreFiltersGrid').addEventListener('click', (e) => {
  const tile = e.target.closest('.more-filter-tile');
  if (!tile) return;
  openedFromMore = true;
  closeMoreFilters();
  openFocusCard(tile.dataset.section);
});

// Escape key: close More modal or focus card
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (moreFiltersOverlay && !moreFiltersOverlay.hidden) {
      closeMoreFilters();
    } else if (!focusOverlay.hidden) {
      closeFocusCard();
    }
  }
});

launchCard.addEventListener("click", async () => {
  if (launchCard.disabled) return;

  // Persist search criteria for session restore
  try {
    sessionStorage.setItem('orbit_search_criteria', JSON.stringify({
      filters: state.filters,
      genreLogic: state.genreLogic
    }));
  } catch (e) {}

  try {
    // Check for universe filters
    const universeFilters = state.filters.filter(f => f.section === "universes");
    const collectionIds = [];
    universeFilters.forEach(f => {
      if (f.value && f.value.collections) {
        collectionIds.push(...f.value.collections);
      }
    });

    if (collectionIds.length > 0) {
      // UNIVERSE MODE: fetch from collections
      const hyperspace = document.getElementById('hyperspaceOverlay');
      hyperspace.hidden = false;

      const allMovies = [];
      const seenIds = new Set();

      for (const colId of collectionIds) {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/collection/${colId}?api_key=${TMDB_API_KEY}`);
          if (!res.ok) continue;
          const data = await res.json();
          if (data.parts) {
            data.parts.forEach(movie => {
              if (!seenIds.has(movie.id)) {
                seenIds.add(movie.id);
                allMovies.push(movie);
              }
            });
          }
        } catch (err) {
          console.error(`Failed to fetch collection ${colId}:`, err);
        }
      }

      // Apply client-side filters
      const nonUniverseFilters = state.filters.filter(f => f.section !== "universes");
      let filtered = allMovies;

      nonUniverseFilters.forEach(f => {
        if (!f.value) return;
        if (f.value.type === "genre") {
          const genreId = GENRE_MAP[f.value.name];
          if (genreId) filtered = filtered.filter(m => m.genre_ids?.includes(genreId));
        } else if (f.value.type === "rating") {
          filtered = filtered.filter(m => {
            const avg = m.vote_average || 0;
            return avg >= (f.value.min || 0) && avg <= (f.value.max || 10);
          });
        } else if (f.value.type === "year") {
          filtered = filtered.filter(m => {
            const year = m.release_date ? parseInt(m.release_date.split('-')[0]) : 0;
            return year === f.value.year;
          });
        } else if (f.value.type === "decade" && f.value.subType === "release") {
          filtered = filtered.filter(m => {
            const year = m.release_date ? parseInt(m.release_date.split('-')[0]) : 0;
            return year >= f.value.decade && year <= f.value.decade + 9;
          });
        } else if (f.value.type === "runtime" && f.value.min != null) {
          filtered = filtered.filter(m => {
            const rt = m.runtime;
            if (rt == null) return true; // no runtime data available, don't exclude
            return rt >= f.value.min && rt <= (f.value.max || 999);
          });
        }
      });

      // Post-filter by awards
      filtered = filterByAwards(filtered, state.filters);

      // Apply settings-based post-filtering
      const settingsData = await getSettingsData();
      if (state.filters.some(f => SETTINGS_SECTIONS.includes(f.section))) {
        filtered = applySettingsFilters(filtered, state.filters, settingsData);
      }

      if (filtered.length === 0) {
        hyperspace.hidden = true;
        alert("No movies found matching your criteria in the selected universe(s).");
        return;
      }

      const selectedGenres = getSelectedGenres(state.filters);
      const genresToUse = selectedGenres.length >= 2
        ? selectedGenres.slice(0, 3)
        : getTopGenresFromMovies(filtered);

      localStorage.setItem("movies", JSON.stringify(filtered));
      localStorage.setItem("genres", JSON.stringify(genresToUse));
      localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
      localStorage.setItem("mediaType", "movie");
      localStorage.removeItem("resultsCapped");
      localStorage.removeItem("totalAvailable");

      setTimeout(() => {
        window.location.href = "results.html";
      }, 500);
    } else if (hasAwardsOnlyFilters(state.filters)) {
      // AWARDS MODE: query directly from local AWARDS_DATABASE
      const hyperspace = document.getElementById('hyperspaceOverlay');
      hyperspace.hidden = false;

      const matchingIds = getAwardsMatchingIds(state.filters);
      if (matchingIds.length === 0) {
        hyperspace.hidden = true;
        alert("No award-winning movies found matching your criteria.");
        return;
      }

      // Fetch movie details from TMDB in batches
      let allMovies = [];
      const BATCH_SIZE = 8;
      for (let i = 0; i < matchingIds.length; i += BATCH_SIZE) {
        const batch = matchingIds.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(id =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        ));
        results.forEach(m => { if (m && m.id) allMovies.push(m); });
      }

      // Convert full movie objects to discover-like format (add genre_ids)
      allMovies = allMovies.map(m => ({
        ...m,
        genre_ids: m.genre_ids || (m.genres ? m.genres.map(g => g.id) : [])
      }));

      // Apply settings-based post-filtering if any settings filters are active
      const settingsData = await getSettingsData();
      if (state.filters.some(f => SETTINGS_SECTIONS.includes(f.section)) && settingsData) {
        allMovies = applySettingsFilters(allMovies, state.filters, settingsData);
        console.log(`[Orbit] Awards + settings post-filter: → ${allMovies.length} movies`);
        if (allMovies.length === 0) {
          hyperspace.hidden = true;
          alert("No award-winning movies match your settings filters. Try removing some filters.");
          return;
        }
      }

      const selectedGenres = getSelectedGenres(state.filters);
      const genresToUse = selectedGenres.length >= 2
        ? selectedGenres.slice(0, 3)
        : getTopGenresFromMovies(allMovies);

      localStorage.setItem("movies", JSON.stringify(allMovies));
      localStorage.setItem("genres", JSON.stringify(genresToUse));
      localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
      localStorage.setItem("mediaType", "movie");
      localStorage.removeItem("resultsCapped");
      localStorage.removeItem("totalAvailable");

      setTimeout(() => {
        window.location.href = "results.html";
      }, 500);

    } else if (hasOnlySettingsFilters(state.filters)) {
      // SETTINGS-ONLY MODE: filter from local settings data, then batch-fetch from TMDB
      const hyperspace = document.getElementById('hyperspaceOverlay');
      hyperspace.hidden = false;

      const settingsData = await getSettingsData();
      const seedData = await getSeedData();
      if (!settingsData || !seedData) {
        hyperspace.hidden = true;
        alert("Settings data unavailable. Try adding a genre or person filter alongside your selections.");
        return;
      }

      // Build minimal objects for filtering (we only need id + genre_ids for pre-filter)
      const allSettingsIds = Object.keys(settingsData.movies);
      const candidateMovies = allSettingsIds
        .map(id => {
          const seed = seedData.movies[id];
          if (!seed) return null;
          return {
            id: seed.id || parseInt(id),
            title: seed.title,
            genre_ids: seed.genres || [],
            vote_average: seed.vote_average || 0,
            popularity: seed.popularity || 0
          };
        })
        .filter(Boolean);

      let filtered = applySettingsFilters(candidateMovies, state.filters, settingsData);
      console.log(`[Orbit] Settings-only filter: ${candidateMovies.length} → ${filtered.length} movies`);

      // Post-filter by awards if present
      filtered = filterByAwards(filtered, state.filters);

      if (filtered.length === 0) {
        hyperspace.hidden = true;
        alert("No movies found matching your criteria. Try removing some filters for broader results.");
        return;
      }

      // Cap at 500 and sort by popularity to fetch the most relevant
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const MAX_SETTINGS_RESULTS = 500;
      const matchingIds = filtered.slice(0, MAX_SETTINGS_RESULTS).map(m => m.id);

      // Batch-fetch full movie objects from TMDB (same pattern as awards mode)
      let allMovies = [];
      const BATCH_SIZE = 8;
      for (let i = 0; i < matchingIds.length; i += BATCH_SIZE) {
        const batch = matchingIds.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(id =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        ));
        results.forEach(m => { if (m && m.id) allMovies.push(m); });
      }

      // Convert to discover-like format
      allMovies = allMovies.map(m => ({
        ...m,
        genre_ids: m.genre_ids || (m.genres ? m.genres.map(g => g.id) : [])
      }));

      if (allMovies.length === 0) {
        hyperspace.hidden = true;
        alert("No movies found matching your criteria. Try removing some filters for broader results.");
        return;
      }

      const selectedGenres = getSelectedGenres(state.filters);
      const genresToUse = selectedGenres.length >= 2
        ? selectedGenres.slice(0, 3)
        : getTopGenresFromMovies(allMovies);

      localStorage.setItem("movies", JSON.stringify(allMovies));
      localStorage.setItem("genres", JSON.stringify(genresToUse));
      localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
      localStorage.setItem("mediaType", "movie");
      localStorage.removeItem("resultsCapped");
      localStorage.removeItem("totalAvailable");
      localStorage.removeItem("orbitBaseQuery");

      setTimeout(() => {
        window.location.href = "results.html";
      }, 500);

    } else {
      // NORMAL DISCOVER MODE
      const queryParams = buildTMDBQueryFromFilters(state.filters);

      const previewUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}&page=1`;
      const previewResponse = await fetch(previewUrl);
      if (!previewResponse.ok) {
        alert("Search failed — please try again.");
        return;
      }
      const previewData = await previewResponse.json();

      const MAX_PAGES = 25;
      const totalAvailable = previewData.total_pages || 0;
      const totalMovies = previewData.total_results || 0;

      console.log(`Preview: ${totalMovies} movies across ${totalAvailable} pages`);

      const hasSettingsFiltersEarly = state.filters.some(f => SETTINGS_SECTIONS.includes(f.section));
      if (totalAvailable > MAX_PAGES && !hasSettingsFiltersEarly) {
        const proceed = confirm(
          `Your search found ~${totalMovies.toLocaleString()} movies!\n\n` +
          `We'll show the top 500 results.\n\n` +
          `Tip: Add more filters (genre, year, person) for more refined results.\n\n` +
          `Continue anyway?`
        );
        if (!proceed) return;
      }

      const hyperspace = document.getElementById('hyperspaceOverlay');
      hyperspace.hidden = false;

      let allMovies = [];
      let currentPage = 1;

      if (previewData.results && previewData.results.length > 0) {
        allMovies.push(...previewData.results);
        const pagesToFetch = Math.min(totalAvailable, MAX_PAGES);

        for (currentPage = 2; currentPage <= pagesToFetch; currentPage++) {
          const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}&page=${currentPage}`;
          const response = await fetch(url);
          if (!response.ok) break;
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            allMovies.push(...data.results);
          } else {
            break;
          }
        }
      }

      const wasCapped = totalAvailable > MAX_PAGES;
      if (wasCapped) {
        localStorage.setItem("resultsCapped", "true");
        localStorage.setItem("totalAvailable", totalMovies.toString());
      } else {
        localStorage.removeItem("resultsCapped");
        localStorage.removeItem("totalAvailable");
      }

      // Post-filter by awards
      allMovies = filterByAwards(allMovies, state.filters);

      // Apply settings-based post-filtering (location, time period, themes, based-on)
      const settingsData = await getSettingsData();
      const hasSettingsFilters = state.filters.some(f => SETTINGS_SECTIONS.includes(f.section));
      let finalMovies = allMovies;
      if (hasSettingsFilters && settingsData) {
        finalMovies = applySettingsFilters(allMovies, state.filters, settingsData);
        console.log(`[Orbit] Post-filter: ${allMovies.length} → ${finalMovies.length} movies`);

        if (finalMovies.length === 0) {
          hyperspace.hidden = true;
          alert("No movies found matching your criteria. Try removing some settings filters (location, era, themes) for broader results.");
          return;
        }
      }

      const selectedGenres = getSelectedGenres(state.filters);
      const genresToUse = selectedGenres.length >= 2
        ? selectedGenres.slice(0, 3)
        : getTopGenresFromMovies(finalMovies);

      localStorage.setItem("movies", JSON.stringify(finalMovies));
      localStorage.setItem("genres", JSON.stringify(genresToUse));
      localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
      localStorage.setItem("mediaType", "movie");
      const baseParams = new URLSearchParams(queryParams);
      baseParams.delete("with_watch_providers");
      baseParams.delete("watch_region");
      localStorage.setItem("orbitBaseQuery", baseParams.toString());

      setTimeout(() => {
        window.location.href = "results.html";
      }, 500);
    }
  } catch (err) {
    const hyperspace = document.getElementById('hyperspaceOverlay');
    hyperspace.hidden = true;
    console.error("Launch error:", err);
    alert("Failed to launch orbit. Please try again.");
  }
});

function hasAwardsOnlyFilters(filters) {
  const hasAwards = filters.some(f => f.section === "awards" && f.value);
  if (!hasAwards) return false;
  if (typeof AWARDS_DATABASE === "undefined") return false;
  // Check if any non-awards filter would meaningfully constrain a TMDB discover query
  const hasTMDBFilters = filters.some(f => {
    if (!f.value) return false;
    return f.section === "people" || f.section === "genres" || f.section === "timeEra" ||
           f.section === "ratingsContent" || f.section === "regionLanguage" || f.section === "production";
  });
  return !hasTMDBFilters;
}

/* Category matching: supports parent categories like "Silver Lion"
   matching subcategories like "Silver Lion (Director)", "Silver Lion (Grand Jury)" */
function categoryMatchesAward(selectedCategories, awardCategory) {
  return selectedCategories.some(c =>
    awardCategory === c || awardCategory.startsWith(c + " (")
  );
}

function getAwardsMatchingIds(filters) {
  const awardFilters = filters.filter(f => f.section === "awards" && f.value);
  const levels = [];
  const festivals = [];
  const categories = [];
  let yearFrom = null;
  let yearTo = null;

  awardFilters.forEach(f => {
    if (f.value.type === "award-level") levels.push(f.value.level);
    else if (f.value.type === "award-festival") festivals.push(f.value.festival);
    else if (f.value.type === "award-category") categories.push(f.value.category);
    else if (f.value.type === "award-year-range") {
      yearFrom = f.value.from;
      yearTo = f.value.to;
    }
  });

  const matchingIds = [];
  for (const [id, entry] of Object.entries(AWARDS_DATABASE)) {
    if (!entry.awards || entry.awards.length === 0) continue;
    const match = entry.awards.some(award => {
      if (festivals.length > 0 && festivals.indexOf(award.festival) === -1) return false;
      if (categories.length > 0 && !categoryMatchesAward(categories, award.category)) return false;
      if (levels.length === 1) {
        if (levels[0] === "winner" && !award.won) return false;
        if (levels[0] === "nominee" && award.won) return false;
      }
      if (yearFrom !== null && award.year < yearFrom) return false;
      if (yearTo !== null && award.year > yearTo) return false;
      return true;
    });
    if (match) matchingIds.push(parseInt(id));
  }
  return matchingIds;
}

function filterByAwards(movies, filters) {
  const awardFilters = filters.filter(f => f.section === "awards" && f.value);
  if (awardFilters.length === 0) return movies;
  if (typeof AWARDS_DATABASE === "undefined") return movies;

  const levels = [];
  const festivals = [];
  const categories = [];
  let yearFrom = null;
  let yearTo = null;

  awardFilters.forEach(function(f) {
    if (f.value.type === "award-level") levels.push(f.value.level);
    else if (f.value.type === "award-festival") festivals.push(f.value.festival);
    else if (f.value.type === "award-category") categories.push(f.value.category);
    else if (f.value.type === "award-year-range") {
      yearFrom = f.value.from;
      yearTo = f.value.to;
    }
  });

  return movies.filter(function(movie) {
    const entry = AWARDS_DATABASE[movie.id];
    if (!entry || !entry.awards || entry.awards.length === 0) return false;

    return entry.awards.some(function(award) {
      // Festival filter (OR within group)
      if (festivals.length > 0 && festivals.indexOf(award.festival) === -1) return false;
      // Category filter (OR within group, supports parent categories)
      if (categories.length > 0 && !categoryMatchesAward(categories, award.category)) return false;
      // Level filter
      if (levels.length === 1) {
        if (levels[0] === "winner" && !award.won) return false;
        if (levels[0] === "nominee" && award.won) return false;
      }
      // Year range filter
      if (yearFrom !== null && award.year < yearFrom) return false;
      if (yearTo !== null && award.year > yearTo) return false;
      return true;
    });
  });
}

function buildTMDBQueryFromFilters(filters) {
  const params = new URLSearchParams();
  
  params.append("sort_by", "popularity.desc");
  params.append("include_adult", "false");
  params.append("include_video", "false");

  // Accumulate keywords separately to avoid separator conflicts
  const genreKeywordIds = [];   // AND — joined with ","

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
          if (keywordId) {
            genreKeywordIds.push(keywordId);
          }
        }
        break;
        
      case "timeEra":
          // Release date & runtime — clear conflicting date params on each set
          if (filter.value.type === "year") {
            params.delete("primary_release_date.gte");
            params.delete("primary_release_date.lte");
            params.set("primary_release_year", filter.value.year);
          } else if (filter.value.type === "decade") {
            params.delete("primary_release_year");
            const start = filter.value.decade;
            const end = start + 9;
            params.set("primary_release_date.gte", `${start}-01-01`);
            params.set("primary_release_date.lte", `${end}-12-31`);
          } else if (filter.value.type === "dateRange") {
            params.delete("primary_release_year");
            if (filter.value.start) params.set("primary_release_date.gte", filter.value.start);
            if (filter.value.end) params.set("primary_release_date.lte", filter.value.end);
          } else if (filter.value.type === "runtime") {
            if (filter.value.min) params.set("with_runtime.gte", filter.value.min);
            if (filter.value.max) params.set("with_runtime.lte", filter.value.max);
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

      case "themes":
      case "settingWhere":
      case "settingWhen":
      case "basedOn":
        // Handled by client-side post-filtering, not TMDB API params
        break;

      case "universes":
        // Collection IDs stored as _collections - handled in launch flow
        break;

      case "awards":
        // No-op placeholder
        break;
        
      case "regionLanguage":
        if (filter.value.type === "region") {
          params.set("with_origin_country", filter.value.code);
        } else if (filter.value.type === "language") {
          params.set("with_original_language", filter.value.code);
        }
        break;
        
      case "production":
        if (filter.value.type === "company" && filter.value.id) {
          const existing = params.get("with_companies");
          params.set("with_companies", existing ? `${existing},${filter.value.id}` : filter.value.id);
        } else if (filter.value.type === "boxoffice") {
          if (filter.value.min) params.set("revenue.gte", filter.value.min);
          if (filter.value.max) params.set("revenue.lte", filter.value.max);
        }
        break;
        
      case "watch":
        if (filter.value.type === "provider" && filter.value.id) {
          const existing = params.get("with_watch_providers");
          params.set("with_watch_providers", existing ? `${existing}|${filter.value.id}` : filter.value.id);
          if (filter.value.region) params.set("watch_region", filter.value.region);
        }
        break;
        
    }
  });

  // Merge accumulated genre keywords (AND)
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
        console.log("[Orbit] Applying saved watch providers:", providerIds, "region:", savedCountry);
      }
    } catch (e) {
      console.error("[Orbit] Failed to read saved watch providers:", e);
    }
  }

  return params.toString();
}

function getSelectedGenres(filters) {
  return filters
    .filter(f => f.section === "genres" && f.value.type === "genre")
    .map(f => GENRE_MAP[f.value.name])
    .filter(id => id !== undefined);
}

function getTopGenresFromMovies(movies) {
  const genreCounts = {};
  movies.forEach(movie => {
    movie.genre_ids?.forEach(id => {
      genreCounts[id] = (genreCounts[id] || 0) + 1;
    });
  });
  
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => parseInt(id));
}

// =============================================
// SETTINGS POST-FILTER
// =============================================

const SETTINGS_SECTIONS = ["themes", "settingWhere", "settingWhen", "basedOn"];

function hasOnlySettingsFilters(filters) {
  return filters.length > 0 && filters.every(f => SETTINGS_SECTIONS.includes(f.section));
}

let _seedDataCache = null;

async function getSeedData() {
  if (_seedDataCache) return _seedDataCache;
  try {
    const response = await fetch('../data/orbit-settings-seed.json');
    _seedDataCache = await response.json();
    return _seedDataCache;
  } catch (e) {
    console.warn('[Orbit] Seed data unavailable:', e.message);
    return null;
  }
}

function applySettingsFilters(movies, filters, settingsData) {
  if (!settingsData) return movies;

  const settingsFilters = filters.filter(f => SETTINGS_SECTIONS.includes(f.section));
  if (settingsFilters.length === 0) return movies;

  // Separate location filters (OR logic) from other filters (AND logic)
  const locationFilters = settingsFilters.filter(f => f.value?.type === "location");
  const otherFilters = settingsFilters.filter(f => f.value?.type !== "location");

  return movies.filter(movie => {
    const settings = settingsData.movies[String(movie.id)];
    if (!settings) return false; // movie not in dataset — exclude when settings filters active

    // Location filters: movie must match ANY selected location (OR)
    if (locationFilters.length > 0) {
      const primary = settings.location?.primary || [];
      const country = settings.location?.country || [];
      const allLocs = [...primary, ...country].map(s => s.toLowerCase());
      const matchesAny = locationFilters.some(f =>
        allLocs.some(l => l.includes(f.value.name.toLowerCase()))
      );
      if (!matchesAny) return false;
    }

    // All other filters: AND logic (movie must match every filter)
    for (const filter of otherFilters) {
      if (!filter.value) continue;

      switch (filter.value.type) {

        case "time_decade": {
          const movieDecades = settings.time_period?.decades || [];
          const movieEras = settings.time_period?.era_labels || [];
          const directMatch = movieDecades.includes(filter.value.value);
          const eraMatch = movieEras.some(era => {
            const eraDecades = typeof getDecadesForEra === 'function' ? getDecadesForEra(era) : [];
            return eraDecades.includes(filter.value.value);
          });
          if (!directMatch && !eraMatch) return false;
          break;
        }

        case "time_era": {
          const eraLabels = settings.time_period?.era_labels || [];
          const directMatch = eraLabels.includes(filter.value.value);
          const decadeOverlap = (
            settings.time_period?.setting_type === "historical" &&
            (settings.time_period?.decades || []).some(d => {
              const eraDecades = typeof getDecadesForEra === 'function' ? getDecadesForEra(filter.value.value) : [];
              return eraDecades.includes(d);
            })
          );
          if (!directMatch && !decadeOverlap) return false;
          break;
        }

        case "time_special": {
          const val = filter.value.value;
          // "ancient" and "medieval" are era labels, not setting_types
          if (val === "ancient" || val === "medieval") {
            const eraLabels = (settings.time_period?.era_labels || []).map(e => e.toLowerCase());
            if (!eraLabels.includes(val)) return false;
          } else {
            if (settings.time_period?.setting_type !== val) return false;
          }
          break;
        }

        case "based_on": {
          if (settings.based_on?.type !== filter.value.value) return false;
          break;
        }

        case "theme": {
          const normalised = settings.themes_normalised || [];
          if (!normalised.includes(filter.value.name)) return false;
          break;
        }
      }
    }
    return true;
  });
}

// =============================================
// SECTION BUILDERS
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
  desc.textContent = "Search for actors, directors, or other people. Select from the dropdown.";
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
  input.placeholder = "Type a name (actor, director…)";
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
          " onmouseover="this.style.color='var(--danger-red)'" onmouseout="this.style.color='var(--muted-silver)'">✕</button>
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
// 2. GENRES SECTION
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
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "History",
    "Horror", "Music", "Mystery", "Romance", "Science Fiction",
    "Thriller", "TV Movie", "War", "Western"
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
// 3. THEMES SECTION
// =============================================

function buildThemesContent(root) {
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 12px; color: var(--muted-silver); margin-bottom: 16px;";
  desc.textContent = "Select one or more themes. Films are matched by their normalised theme categories.";
  root.appendChild(desc);

  // THEME_GROUPS from theme-taxonomy.js: { "Relationships": ["Family", "Love & Romance", ...], ... }
  for (const [groupName, categories] of Object.entries(THEME_GROUPS)) {
    root.appendChild(makeSectionLabel(groupName));
    const chipGroup = document.createElement("div");
    chipGroup.className = "chip-group";

    categories.forEach(cat => {
      const chip = makeChip(cat, "themes", { type: "theme", name: cat });
      chipGroup.appendChild(chip);
    });

    root.appendChild(chipGroup);
  }
}

// =============================================
// 4. SETTING: WHERE SECTION
// =============================================

function buildSettingWhereContent(root) {
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 12px; color: var(--muted-silver); margin-bottom: 16px;";
  desc.textContent = "Search for a city, country, or region, or pick from popular locations below.";
  root.appendChild(desc);

  // Search input with autocomplete
  const searchRow = document.createElement("div");
  searchRow.className = "input-row";
  searchRow.style.position = "relative";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "locationSearchInput";
  searchInput.placeholder = "Search cities, countries, regions...";
  searchInput.autocomplete = "off";
  searchRow.appendChild(searchInput);

  const dropdownEl = document.createElement("div");
  dropdownEl.id = "locationDropdown";
  dropdownEl.style.cssText = "display:none; position:absolute; top:100%; left:0; right:0; z-index:100; max-height:200px; overflow-y:auto; background:rgba(10,14,26,0.98); border:1px solid rgba(0,217,255,0.25); border-radius:8px; margin-top:4px;";
  searchRow.appendChild(dropdownEl);
  root.appendChild(searchRow);

  // Container for search-selected locations
  const selectedContainer = document.createElement("div");
  selectedContainer.id = "selectedLocationContainer";
  selectedContainer.style.cssText = "display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; min-height:0;";
  root.appendChild(selectedContainer);

  // Build autocomplete from settings data
  getSettingsData().then(data => {
    if (!data) return;

    const allLocations = new Set();
    for (const movie of Object.values(data.movies)) {
      if (movie.location?.primary) movie.location.primary.forEach(l => allLocations.add(l));
      if (movie.location?.country) movie.location.country.forEach(l => allLocations.add(l));
    }
    const locationList = Array.from(allLocations).sort();

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      if (query.length < 2) { dropdownEl.style.display = "none"; return; }

      const matches = locationList.filter(l => l.toLowerCase().includes(query)).slice(0, 15);
      if (matches.length === 0) { dropdownEl.style.display = "none"; return; }

      dropdownEl.innerHTML = "";
      matches.forEach(loc => {
        const item = document.createElement("div");
        item.style.cssText = "padding:8px 12px; cursor:pointer; font-size:14px; color:var(--film-white); border-bottom:1px solid rgba(0,217,255,0.1);";
        item.textContent = loc;
        item.addEventListener("mouseenter", () => item.style.background = "rgba(0,217,255,0.1)");
        item.addEventListener("mouseleave", () => item.style.background = "none");
        item.addEventListener("click", () => {
          addLocationChip(loc, selectedContainer);
          searchInput.value = "";
          dropdownEl.style.display = "none";
        });
        dropdownEl.appendChild(item);
      });
      dropdownEl.style.display = "block";
    });
  });

  function addLocationChip(locationName, container) {
    if (container.querySelector(`[data-location="${locationName}"]`)) return;

    const chip = document.createElement("div");
    chip.dataset.location = locationName;
    chip.style.cssText = "display:inline-flex; align-items:center; gap:6px; padding:4px 10px; background:rgba(0,217,255,0.15); border:1px solid rgba(0,217,255,0.3); border-radius:999px; font-size:13px; color:var(--accent-cyan);";
    chip.innerHTML = `<span>${locationName}</span>`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "\u2715";
    removeBtn.style.cssText = "background:none; border:none; color:var(--danger-red); cursor:pointer; font-size:11px; padding:0 2px;";
    removeBtn.addEventListener("click", () => chip.remove());
    chip.appendChild(removeBtn);
    container.appendChild(chip);
  }

  // Popular location chips
  root.appendChild(makeSectionLabel("Popular Locations"));
  const popularGroup = document.createElement("div");
  popularGroup.className = "chip-group";
  const popularLocations = [
    "New York", "Los Angeles", "London", "Paris", "Tokyo", "Rome",
    "Berlin", "Chicago", "San Francisco", "Hong Kong", "Moscow", "Sydney"
  ];
  popularLocations.forEach(loc => {
    const chip = makeChip(loc, "settingWhere", { type: "location", name: loc });
    popularGroup.appendChild(chip);
  });
  root.appendChild(popularGroup);

  // Region chips
  root.appendChild(makeSectionLabel("Regions"));
  const regionGroup = document.createElement("div");
  regionGroup.className = "chip-group";
  const regions = [
    "Western Europe", "East Asia", "Middle East", "Latin America",
    "Sub-Saharan Africa", "Southeast Asia", "Scandinavia", "Caribbean"
  ];
  regions.forEach(r => {
    const chip = makeChip(r, "settingWhere", { type: "location", name: r });
    regionGroup.appendChild(chip);
  });
  root.appendChild(regionGroup);

  // Special location chips
  root.appendChild(makeSectionLabel("Special"));
  const specialGroup = document.createElement("div");
  specialGroup.className = "chip-group";
  const specials = ["Fictional / Fantasy World", "Space", "At Sea", "Small Town America", "The Road / Traveling"];
  specials.forEach(s => {
    const chip = makeChip(s, "settingWhere", { type: "location", name: s });
    specialGroup.appendChild(chip);
  });
  root.appendChild(specialGroup);
}

// =============================================
// 5. SETTING: WHEN SECTION
// =============================================

function buildSettingWhenContent(root) {
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 12px; color: var(--muted-silver); margin-bottom: 16px;";
  desc.textContent = "Not when it was released \u2014 when the story takes place. Decades cross-reference with named eras.";
  root.appendChild(desc);

  // Decade chips
  root.appendChild(makeSectionLabel("Decades"));
  const decadeGroup = document.createElement("div");
  decadeGroup.className = "chip-group";
  const decades = ["1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  decades.forEach(d => {
    const chip = makeChip(d, "settingWhen", { type: "time_decade", value: d });
    decadeGroup.appendChild(chip);
  });
  root.appendChild(decadeGroup);

  // Named era chips — curated order (most recognisable first)
  root.appendChild(makeSectionLabel("Named Eras"));
  const eraGroup = document.createElement("div");
  eraGroup.className = "chip-group";

  const eraOrder = [
    "World War II", "World War I", "Cold War", "Vietnam Era",
    "Civil Rights", "Roaring Twenties", "Great Depression", "Prohibition",
    "Space Race", "Victorian", "Edwardian", "Colonial Era",
    "Industrial Revolution", "American Civil War", "French Revolution",
    "American Revolution", "The Troubles", "Fall of the Berlin Wall",
    "Apartheid", "Cultural Revolution", "Post-War", "Korean War",
    "Holocaust", "Watergate"
  ];

  eraOrder.forEach(era => {
    if (typeof ERA_DECADE_MAP !== 'undefined' && ERA_DECADE_MAP[era]) {
      const chip = makeChip(era, "settingWhen", { type: "time_era", value: era });
      eraGroup.appendChild(chip);
    }
  });
  root.appendChild(eraGroup);

  // Special time settings
  root.appendChild(makeSectionLabel("Special"));
  const specialGroup = document.createElement("div");
  specialGroup.className = "chip-group";
  const specialTimes = [
    { label: "Near Future", value: "near_future" },
    { label: "Far Future", value: "far_future" },
    { label: "Timeless / Unspecified", value: "timeless" },
    { label: "Multi-Era / Spanning", value: "multi_era" },
    { label: "Ancient (Pre-Medieval)", value: "ancient" },
    { label: "Medieval", value: "medieval" }
  ];
  specialTimes.forEach(s => {
    const chip = makeChip(s.label, "settingWhen", { type: "time_special", value: s.value });
    specialGroup.appendChild(chip);
  });
  root.appendChild(specialGroup);

  // Info note
  const note = document.createElement("p");
  note.style.cssText = "font-size: 11px; color: var(--ghost-gray); margin-top: 12px; font-style: italic;";
  note.textContent = 'Decade chips also match films tagged with eras that overlap that decade. Selecting "1940s" includes WWII films even if they span 1939\u20131945.';
  root.appendChild(note);
}

// =============================================
// 6. BASED ON SECTION
// =============================================

function buildBasedOnContent(root) {
  // Source type chips
  root.appendChild(makeSectionLabel("Source Type"));
  const sourceGroup = document.createElement("div");
  sourceGroup.className = "chip-group";
  const sourceTypes = [
    { label: "Original Screenplay", value: "original" },
    { label: "True Story / Real Events", value: "true_story" },
    { label: "Novel / Book", value: "novel" },
    { label: "Short Story", value: "short_story" },
    { label: "Stage Play", value: "play" },
    { label: "Comic / Graphic Novel", value: "comic" },
    { label: "Video Game", value: "video_game" }
  ];
  sourceTypes.forEach(s => {
    const chip = makeChip(s.label, "basedOn", { type: "based_on", value: s.value });
    sourceGroup.appendChild(chip);
  });
  root.appendChild(sourceGroup);

  // Franchise status chips
  root.appendChild(makeSectionLabel("Franchise Status"));
  const franchiseGroup = document.createElement("div");
  franchiseGroup.className = "chip-group";
  const franchiseTypes = [
    { label: "Sequel", value: "sequel" },
    { label: "Prequel", value: "prequel" }
  ];
  franchiseTypes.forEach(f => {
    const chip = makeChip(f.label, "basedOn", { type: "based_on", value: f.value });
    franchiseGroup.appendChild(chip);
  });
  root.appendChild(franchiseGroup);
}

// =============================================
// 7. RELEASE DATE & RUNTIME SECTION
// =============================================

function buildTimeEraContent(root) {
  root.appendChild(makeSectionLabel("Specific Year"));
  const yearRow = document.createElement("div");
  yearRow.className = "input-row";
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.id = "yearInput";
  yearInput.placeholder = "e.g., 2020";
  yearInput.min = "1900";
  yearInput.max = "2030";
  yearRow.appendChild(yearInput);
  root.appendChild(yearRow);

  root.appendChild(makeSectionLabel("Decades (when movie was released)"));
  const releaseDecades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const relDecadeGroup = document.createElement("div");
  relDecadeGroup.className = "chip-group";
  releaseDecades.forEach(d => {
    const chip = makeChip(`${d}s`, "timeEra", { type: "decade", decade: d, subType: "release" });
    chip.id = `date-decade-${d}`;
    relDecadeGroup.appendChild(chip);
  });
  root.appendChild(relDecadeGroup);

  const quickGroup = document.createElement("div");
  quickGroup.className = "chip-group";
  quickGroup.style.marginTop = "12px";
  const newRelease = makeChip("New Releases (6 months)", "timeEra", {
    type: "dateRange",
    subType: "release",
    start: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const classic = makeChip("Classic (Pre-1980)", "timeEra", {
    type: "dateRange",
    subType: "release",
    start: "1900-01-01",
    end: "1979-12-31"
  });
  quickGroup.appendChild(newRelease);
  quickGroup.appendChild(classic);
  root.appendChild(quickGroup);

  root.appendChild(makeSectionLabel("Runtime (minutes)"));
  const runtimeRow = document.createElement("div");
  runtimeRow.className = "input-row";
  runtimeRow.style.flexDirection = "column";
  runtimeRow.style.gap = "12px";

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
  minSlider.id = "runtimeMin";
  minSlider.min = "0";
  minSlider.max = "300";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "0";
  minValue.id = "runtimeMinValue";
  minSlider.addEventListener("input", () => {
    minValue.textContent = minSlider.value;
    const maxSl = document.getElementById("runtimeMax");
    if (parseInt(minSlider.value) > parseInt(maxSl.value)) {
      maxSl.value = minSlider.value;
      document.getElementById("runtimeMaxValue").textContent = minSlider.value;
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
  maxSlider.id = "runtimeMax";
  maxSlider.min = "0";
  maxSlider.max = "300";
  maxSlider.value = "300";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "300";
  maxValue.id = "runtimeMaxValue";
  maxSlider.addEventListener("input", () => {
    maxValue.textContent = maxSlider.value;
    const minSl = document.getElementById("runtimeMin");
    if (parseInt(maxSlider.value) < parseInt(minSl.value)) {
      minSl.value = maxSlider.value;
      document.getElementById("runtimeMinValue").textContent = maxSlider.value;
    }
  });
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);

  runtimeRow.appendChild(minRow);
  runtimeRow.appendChild(maxRow);
  root.appendChild(runtimeRow);

  const runtimeQuick = document.createElement("div");
  runtimeQuick.className = "chip-group";
  runtimeQuick.style.marginTop = "12px";
  [
    { label: "Short Films (<60min)", min: 0, max: 59 },
    { label: "Standard (90-120min)", min: 90, max: 120 },
    { label: "Long (2h+)", min: 120, max: 300 },
    { label: "Epic (3h+)", min: 180, max: 300 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "timeEra", {
      type: "runtime",
      subType: "release",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("runtimeMin").value = preset.min;
      document.getElementById("runtimeMax").value = preset.max;
      document.getElementById("runtimeMinValue").textContent = preset.min;
      document.getElementById("runtimeMaxValue").textContent = preset.max;
    });
    runtimeQuick.appendChild(chip);
  });
  root.appendChild(runtimeQuick);
}

// =============================================
// 4. RATINGS & CONTENT SECTION (merged ratings + suitability)
// =============================================

function buildRatingsContentSection(root) {
  // --- RATINGS HALF ---
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

  // --- SUITABILITY HALF ---
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
// 6. REGION & LANGUAGE SECTION
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
    { code: "US", name: "🇺🇸 United States" },
    { code: "GB", name: "🇬🇧 United Kingdom" },
    { code: "FR", name: "🇫🇷 France" },
    { code: "DE", name: "🇩🇪 Germany" },
    { code: "JP", name: "🇯🇵 Japan" },
    { code: "KR", name: "🇰🇷 South Korea" },
    { code: "CN", name: "🇨🇳 China" },
    { code: "IN", name: "🇮🇳 India" },
    { code: "IT", name: "🇮🇹 Italy" },
    { code: "ES", name: "🇪🇸 Spain" },
    { code: "CA", name: "🇨🇦 Canada" },
    { code: "AU", name: "🇦🇺 Australia" }
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
            <button id="removeRegion" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
          </div>
        `;
        
        document.getElementById("removeRegion").onclick = () => {
          selectedRegion = null;
          regionContainer.innerHTML = "";
        };
        
        // Smart language linking - auto-adjust based on country
        handleRegionLanguageLink(item.code);
      };
      dropdown.appendChild(opt);
    });
    
    regionRow.appendChild(dropdown);
  }
  
  // Country-to-language mapping
  const countryLanguageMap = {
    "US": "en", "GB": "en", "CA": "en", "AU": "en", "NZ": "en", "IE": "en", // English-speaking
    "FR": "fr", "BE": "fr", // French
    "DE": "de", "AT": "de", // German
    "ES": "es", "MX": "es", "AR": "es", // Spanish
    "IT": "it", // Italian
    "JP": "ja", // Japanese
    "KR": "ko", // Korean
    "CN": "zh", "TW": "zh", "HK": "zh", // Chinese
    "IN": "hi", // Hindi (India has many, but Hindi is primary)
    "RU": "ru", // Russian
    "BR": "pt", "PT": "pt", // Portuguese
    "SE": "sv", // Swedish
    "DK": "da", // Danish
    "NO": "no", // Norwegian
    "FI": "fi", // Finnish
    "NL": "nl", // Dutch
    "PL": "pl", // Polish
    "TR": "tr", // Turkish
    "TH": "th", // Thai
    "ID": "id", // Indonesian
    "VN": "vi"  // Vietnamese
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
      // English-speaking country - ensure English Only is ON
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
      // Non-English country - turn OFF English Only and set the language
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
      
      // Auto-select the language
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
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
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
    <span style="font-size: 11px; color: var(--muted-silver); display: block; margin-top: 2px;">Hollywood, UK, Australian & Canadian cinema</span>
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
  
  // Language search row (hidden when English Only is ON)
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
  
  // Check sessionStorage for saved state (default to ON)
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
    
    // Clear any selected language when turning English Only ON
    if (isOn) {
      selectedLanguage = null;
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
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
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
// 7. PRODUCTION & BOX OFFICE SECTION
// =============================================

function buildProductionContent(root) {
  root.appendChild(makeSectionLabel("Studios & Production Companies"));
  
  const desc = document.createElement("p");
  desc.style.fontSize = "13px";
  desc.style.color = "var(--muted-silver)";
  desc.style.marginBottom = "16px";
  desc.textContent = "Select from top studios or search for others.";
  root.appendChild(desc);
  
  const topStudios = [
    { name: "Disney", id: 2 },
    { name: "Warner Bros", id: 174 },
    { name: "Universal", id: 33 },
    { name: "Paramount", id: 4 },
    { name: "Sony", id: 5 },
    { name: "20th Century", id: 25 },
    { name: "A24", id: 41077 },
    { name: "Marvel Studios", id: 420 },
    { name: "Pixar", id: 3 },
    { name: "Lucasfilm", id: 1 }
  ];
  
  const studioGroup = document.createElement("div");
  studioGroup.className = "chip-group";
  topStudios.forEach(studio => {
    const chip = makeChip(`🏛️ ${studio.name}`, "production", { type: "company", id: studio.id, name: studio.name });
    chip.id = `studio-${studio.name.replace(/\s+/g, '-')}`;
    studioGroup.appendChild(chip);
  });
  root.appendChild(studioGroup);
  
  const studioRow = document.createElement("div");
  studioRow.className = "input-row";
  studioRow.style.cssText = "margin-top: 16px; position: relative;";
  const studioInput = document.createElement("input");
  studioInput.type = "text";
  studioInput.id = "studioInput";
  studioInput.placeholder = "Search for other studios...";
  studioInput.autocomplete = "off";
  studioRow.appendChild(studioInput);
  root.appendChild(studioRow);

  const studioDropdown = document.createElement("div");
  studioDropdown.className = "search-dropdown";
  studioDropdown.style.cssText = "position: absolute; z-index: 1000; display: none; background: var(--deep-space); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; max-height: 200px; overflow-y: auto;";
  studioRow.appendChild(studioDropdown);

  let studioDebounce = null;
  studioInput.addEventListener("input", () => {
    clearTimeout(studioDebounce);
    const query = studioInput.value.trim();
    if (query.length < 2) { studioDropdown.style.display = "none"; return; }
    studioDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/company?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = await res.json();
        const results = (data.results || []).slice(0, 8);
        if (results.length === 0) { studioDropdown.style.display = "none"; return; }
        studioDropdown.innerHTML = "";
        studioDropdown.style.display = "block";
        studioDropdown.style.width = `${studioInput.offsetWidth}px`;
        results.forEach(company => {
          const item = document.createElement("div");
          item.className = "dropdown-item";
          item.style.cssText = "padding: 8px 12px; cursor: pointer; font-size: 13px; color: var(--film-white);";
          item.textContent = company.name;
          item.addEventListener("mouseenter", () => { item.style.background = "rgba(0,217,255,0.1)"; });
          item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });
          item.addEventListener("click", () => {
            const chipId = `studio-${company.name.replace(/\s+/g, '-')}`;
            if (!document.getElementById(chipId)) {
              const chip = makeChip(`🏛️ ${company.name}`, "production", { type: "company", id: company.id, name: company.name });
              chip.id = chipId;
              studioGroup.appendChild(chip);
            }
            studioInput.value = "";
            studioDropdown.style.display = "none";
          });
          studioDropdown.appendChild(item);
        });
      } catch (err) {
        console.error("Studio search error:", err);
      }
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!studioRow.contains(e.target)) studioDropdown.style.display = "none";
  });
  
  root.appendChild(makeSectionLabel("Box Office (Worldwide Gross)"));
  
  const boxOfficeRow = document.createElement("div");
  boxOfficeRow.className = "input-row";
  boxOfficeRow.style.flexDirection = "column";
  boxOfficeRow.style.gap = "12px";
  
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
  minSlider.id = "boxOfficeMin";
  minSlider.min = "0";
  minSlider.max = "2000";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "$0M";
  minValue.id = "boxOfficeMinValue";
  
  minSlider.addEventListener("input", () => {
    minValue.textContent = `$${minSlider.value}M`;
    const maxSl = document.getElementById("boxOfficeMax");
    if (parseInt(minSlider.value) > parseInt(maxSl.value)) {
      maxSl.value = minSlider.value;
      document.getElementById("boxOfficeMaxValue").textContent = `$${minSlider.value}M${minSlider.value === "2000" ? "+" : ""}`;
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
  maxSlider.id = "boxOfficeMax";
  maxSlider.min = "0";
  maxSlider.max = "2000";
  maxSlider.value = "2000";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "$2000M+";
  maxValue.id = "boxOfficeMaxValue";

  maxSlider.addEventListener("input", () => {
    maxValue.textContent = `$${maxSlider.value}M${maxSlider.value === "2000" ? "+" : ""}`;
    const minSl = document.getElementById("boxOfficeMin");
    if (parseInt(maxSlider.value) < parseInt(minSl.value)) {
      minSl.value = maxSlider.value;
      document.getElementById("boxOfficeMinValue").textContent = `$${maxSlider.value}M`;
    }
  });
  
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);
  
  boxOfficeRow.appendChild(minRow);
  boxOfficeRow.appendChild(maxRow);
  root.appendChild(boxOfficeRow);
  
  const boxOfficeQuick = document.createElement("div");
  boxOfficeQuick.className = "chip-group";
  boxOfficeQuick.style.marginTop = "12px";
  [
    { label: "Blockbuster ($500M+)", min: 500000000, max: 10000000000 },
    { label: "Billion Dollar Club", min: 1000000000, max: 10000000000 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "production", {
      type: "boxoffice",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("boxOfficeMin").value = preset.min / 1000000;
      document.getElementById("boxOfficeMax").value = Math.min(preset.max / 1000000, 2000);
      document.getElementById("boxOfficeMinValue").textContent = `$${preset.min / 1000000}M`;
      document.getElementById("boxOfficeMaxValue").textContent = preset.max >= 2000000000 ? "$2000M+" : `$${preset.max / 1000000}M`;
    });
    boxOfficeQuick.appendChild(chip);
  });
  root.appendChild(boxOfficeQuick);
}

// =============================================
// 8. WATCH PROVIDERS SECTION
// =============================================

function buildWatchContent(root) {
  const savedCountry = localStorage.getItem("watchCountry") || "";
  let allProviderData = [];

  // --- Country selector ---
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

  // --- Provider chips ---
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

  // --- Status indicator ---
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

    fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${TMDB_API_KEY}&watch_region=${country}`)
      .then(res => { if (!res.ok) throw new Error(`TMDB ${res.status}`); return res.json(); })
      .then(data => {
        allProviderData = (data.results || []).slice(0, 25);
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
      })
      .catch(() => {
        providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Failed to load providers</span>';
      });
  }

  countrySelect.addEventListener("change", () => {
    saveToLocalStorage();
    loadProviders(countrySelect.value);
  });

  // Auto-load if country already set
  if (savedCountry) {
    loadProviders(savedCountry);
  } else {
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
  }
}

// =============================================
// 8. UNIVERSES SECTION
// =============================================

function buildUniversesContent(root) {
  root.appendChild(makeSectionLabel("Search Collections"));

  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 12px; color: var(--muted-silver); margin-bottom: 12px;";
  desc.textContent = "Search TMDB for any movie collection or franchise.";
  root.appendChild(desc);

  const searchContainer = document.createElement("div");
  searchContainer.style.position = "relative";
  const searchRow = document.createElement("div");
  searchRow.className = "input-row";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "universeSearchInput";
  searchInput.placeholder = "Search collections (e.g., Lord of the Rings)";
  searchInput.autocomplete = "off";
  searchRow.appendChild(searchInput);
  searchContainer.appendChild(searchRow);
  root.appendChild(searchContainer);

  let universeDropdown = document.getElementById("universeDropdownGlobal");
  if (!universeDropdown) {
    universeDropdown = document.createElement("div");
    universeDropdown.id = "universeDropdownGlobal";
    universeDropdown.style.cssText = `
      display: none;
      position: fixed;
      max-height: 300px;
      width: 500px;
      overflow-y: auto;
      background: rgba(10, 14, 26, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
      z-index: 10000;
    `;
    document.body.appendChild(universeDropdown);
  }

  let selectedCollections = [];
  let universeDebounceTimer;

  const selectedContainer = document.createElement("div");
  selectedContainer.id = "selectedUniverseContainer";
  selectedContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  root.appendChild(selectedContainer);

  searchInput.addEventListener('input', () => {
    clearTimeout(universeDebounceTimer);
    const query = searchInput.value.trim();
    if (query.length > 1) {
      universeDebounceTimer = setTimeout(async () => {
        const rect = searchInput.getBoundingClientRect();
        universeDropdown.style.top = `${rect.bottom + 4}px`;
        universeDropdown.style.left = `${rect.left}px`;
        universeDropdown.style.width = `${Math.max(rect.width, 400)}px`;

        try {
          const res = await fetch(`https://api.themoviedb.org/3/search/collection?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
          if (!res.ok) return;
          const data = await res.json();
          renderUniverseDropdown(data.results?.slice(0, 8) || []);
        } catch (err) {
          console.error("Collection search error:", err);
        }
      }, 300);
    } else {
      universeDropdown.style.display = 'none';
    }
  });

  function renderUniverseDropdown(collections) {
    if (collections.length === 0) {
      universeDropdown.style.display = 'none';
      return;
    }
    universeDropdown.style.display = 'block';
    universeDropdown.innerHTML = collections.map(c => `
      <div class="universe-dropdown-item" data-id="${c.id}" data-name="${c.name}" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(120, 190, 255, 0.1);
        transition: background 0.15s ease;
      " onmouseover="this.style.background='rgba(111, 210, 255, 0.1)'" onmouseout="this.style.background='transparent'">
        <img src="${c.poster_path ? 'https://image.tmdb.org/t/p/w45' + c.poster_path : 'https://placehold.co/45x68?text=?'}"
          style="width: 35px; height: 52px; object-fit: cover; border-radius: 4px; flex-shrink: 0;"
          onerror="this.src='https://placehold.co/35x52?text=?'" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 500; color: var(--film-white);">${c.name}</div>
        </div>
      </div>
    `).join('');

    universeDropdown.querySelectorAll('.universe-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id);
        const name = item.dataset.name;
        if (selectedCollections.some(s => s.id === id)) return;
        addCollectionChip({ id, name, type: "collection" });
        searchInput.value = '';
        universeDropdown.style.display = 'none';
      });
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !universeDropdown.contains(e.target)) {
        universeDropdown.style.display = 'none';
      }
    }, { once: true });
  }

  function addCollectionChip(collection) {
    selectedCollections.push(collection);
    const chip = document.createElement("div");
    chip.className = "selected-universe-chip";
    chip.dataset.collectionId = collection.id;
    chip.dataset.collectionName = collection.name;
    chip.dataset.collectionType = collection.type;
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
      <span>${collection.name}</span>
      <button style="
        background: transparent;
        border: none;
        color: var(--muted-silver);
        cursor: pointer;
        font-size: 14px;
        padding: 0 4px;
        transition: color 0.15s;
      " onmouseover="this.style.color='var(--danger-red)'" onmouseout="this.style.color='var(--muted-silver)'">✕</button>
    `;
    chip.querySelector('button').addEventListener('click', () => {
      selectedCollections = selectedCollections.filter(c => c.id !== collection.id);
      chip.remove();
    });
    selectedContainer.appendChild(chip);
  }

  // --- CURATED UNIVERSES ---
  root.appendChild(makeSectionLabel("Popular Universes"));
  const curatedGroup = document.createElement("div");
  curatedGroup.className = "chip-group";

  const curated = [
    { name: "MCU", ids: [131295] },
    { name: "DCEU", ids: [948485] },
    { name: "Star Wars", ids: [10] },
    { name: "Harry Potter", ids: [1241] },
    { name: "James Bond", ids: [645] },
    { name: "Fast & Furious", ids: [9485] },
    { name: "Mission Impossible", ids: [87359] },
    { name: "Jurassic Park", ids: [328] },
    { name: "MonsterVerse", ids: [535313] }
  ];

  curated.forEach(u => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = u.name;
    chip.dataset.value = JSON.stringify({ type: "universe", name: u.name, collections: u.ids });
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
    curatedGroup.appendChild(chip);
  });
  root.appendChild(curatedGroup);

  // Close dropdown on focus card close
  const closeButton = document.getElementById('focusCloseButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      universeDropdown.style.display = 'none';
    });
  }
}

// =============================================
// 9. AWARDS SECTION (placeholder)
// =============================================

function buildAwardsContent(root) {
  // --- Recognition level ---
  root.appendChild(makeSectionLabel("Recognition"));
  const levelGroup = document.createElement("div");
  levelGroup.className = "chip-group";
  levelGroup.appendChild(makeChip("Winner", "awards", { type: "award-level", level: "winner" }));
  levelGroup.appendChild(makeChip("Nominee", "awards", { type: "award-level", level: "nominee" }));
  root.appendChild(levelGroup);

  // --- Festival ---
  root.appendChild(makeSectionLabel("Festival"));
  const festivalGroup = document.createElement("div");
  festivalGroup.className = "chip-group";
  const festivals = [
    { label: "Oscar", glyph: "og-oscar", value: "Oscar" },
    { label: "Cannes", glyph: "og-palm", value: "Cannes" },
    { label: "BAFTA", glyph: "og-bafta", value: "BAFTA" },
    { label: "Venice", glyph: "og-lion", value: "Venice" },
    { label: "Berlin", glyph: "og-bear", value: "Berlin" },
    { label: "Golden Globe", glyph: "og-globe", value: "Golden Globe" }
  ];
  festivals.forEach(function(f) {
    const chip = makeChip(f.label, "awards", { type: "award-festival", festival: f.value });
    chip.innerHTML = '<span class="og ' + f.glyph + '"></span> ' + f.label;
    festivalGroup.appendChild(chip);
  });
  root.appendChild(festivalGroup);

  // --- Category ---
  root.appendChild(makeSectionLabel("Category"));
  const catGroup = document.createElement("div");
  catGroup.className = "chip-group";
  const categories = [
    "Best Picture", "Best Film", "Best Director", "Best Actor", "Best Actress",
    "Best Drama", "Best Comedy/Musical",
    "Palme d'Or", "Grand Prix", "Jury Prize",
    "Golden Lion", "Silver Lion (Grand Jury)", "Silver Lion (Director)",
    "Golden Bear", "Silver Bear (Grand Jury)", "Silver Bear (Director)"
  ];
  categories.forEach(function(cat) {
    catGroup.appendChild(makeChip(cat, "awards", { type: "award-category", category: cat }));
  });
  root.appendChild(catGroup);

  // --- Specific Year ---
  root.appendChild(makeSectionLabel("Specific Year"));
  const awardSpecificRow = document.createElement("div");
  awardSpecificRow.className = "input-row";
  const awardYearInput = document.createElement("input");
  awardYearInput.type = "number";
  awardYearInput.id = "awardYearInput";
  awardYearInput.placeholder = "e.g. 2024";
  awardYearInput.min = "1950";
  awardYearInput.max = "2030";
  awardSpecificRow.appendChild(awardYearInput);
  root.appendChild(awardSpecificRow);

  // --- Award Year Range ---
  root.appendChild(makeSectionLabel("Year Range"));

  const awardYearRow = document.createElement("div");
  awardYearRow.className = "input-row";
  awardYearRow.style.flexDirection = "column";
  awardYearRow.style.gap = "12px";

  const awardFromRow = document.createElement("div");
  awardFromRow.style.cssText = "display:flex;gap:12px;width:100%;align-items:center;";
  const fromLabel = document.createElement("span");
  fromLabel.textContent = "From:";
  fromLabel.style.minWidth = "40px";
  const fromSlider = document.createElement("input");
  fromSlider.type = "range";
  fromSlider.id = "awardYearFrom";
  fromSlider.min = "1950";
  fromSlider.max = "2025";
  fromSlider.value = "1950";
  fromSlider.style.flex = "1";
  const fromValue = document.createElement("span");
  fromValue.textContent = "1950";
  fromValue.id = "awardYearFromValue";
  fromValue.style.minWidth = "36px";
  fromValue.style.textAlign = "right";
  awardFromRow.appendChild(fromLabel);
  awardFromRow.appendChild(fromSlider);
  awardFromRow.appendChild(fromValue);

  const awardToRow = document.createElement("div");
  awardToRow.style.cssText = "display:flex;gap:12px;width:100%;align-items:center;";
  const toLabel = document.createElement("span");
  toLabel.textContent = "To:";
  toLabel.style.minWidth = "40px";
  const toSlider = document.createElement("input");
  toSlider.type = "range";
  toSlider.id = "awardYearTo";
  toSlider.min = "1950";
  toSlider.max = "2025";
  toSlider.value = "2025";
  toSlider.style.flex = "1";
  const toValue = document.createElement("span");
  toValue.textContent = "2025";
  toValue.id = "awardYearToValue";
  toValue.style.minWidth = "36px";
  toValue.style.textAlign = "right";
  awardToRow.appendChild(toLabel);
  awardToRow.appendChild(toSlider);
  awardToRow.appendChild(toValue);

  awardYearRow.appendChild(awardFromRow);
  awardYearRow.appendChild(awardToRow);
  root.appendChild(awardYearRow);

  // Decade quick-select chips
  root.appendChild(makeSectionLabel("Quick Decade"));
  const awardDecadeGroup = document.createElement("div");
  awardDecadeGroup.className = "chip-group";
  awardDecadeGroup.id = "awardDecadeGroup";
  [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].forEach(function(d) {
    const chip = makeChip(d + "s", "awards", { type: "award-decade", decade: d });
    chip.addEventListener("click", function() {
      // Deactivate other decade chips (single-select)
      awardDecadeGroup.querySelectorAll(".chip").forEach(function(c) {
        if (c !== chip) c.classList.remove("active");
      });
      // If active, snap sliders to this decade and clear specific year
      if (chip.classList.contains("active")) {
        fromSlider.value = d;
        toSlider.value = d + 9;
        fromValue.textContent = d;
        toValue.textContent = d + 9;
        awardYearInput.value = "";
      } else {
        // Deselected — reset sliders to full range
        fromSlider.value = 1950;
        toSlider.value = 2025;
        fromValue.textContent = "1950";
        toValue.textContent = "2025";
      }
    });
    awardDecadeGroup.appendChild(chip);
  });
  root.appendChild(awardDecadeGroup);

  // Slider interaction clears decade chips
  function onSliderInput() {
    var from = parseInt(fromSlider.value);
    var to = parseInt(toSlider.value);
    if (from > to) {
      toSlider.value = from;
      to = from;
    }
    fromValue.textContent = from;
    toValue.textContent = to;
    // Clear decade selection when user manually drags
    awardDecadeGroup.querySelectorAll(".chip.active").forEach(function(c) {
      c.classList.remove("active");
    });
  }
  fromSlider.addEventListener("input", function() {
    var from = parseInt(fromSlider.value);
    var to = parseInt(toSlider.value);
    if (from > to) { toSlider.value = from; toValue.textContent = from; }
    fromValue.textContent = from;
    awardYearInput.value = "";
    awardDecadeGroup.querySelectorAll(".chip.active").forEach(function(c) { c.classList.remove("active"); });
  });
  toSlider.addEventListener("input", function() {
    var from = parseInt(fromSlider.value);
    var to = parseInt(toSlider.value);
    if (to < from) { fromSlider.value = to; fromValue.textContent = to; }
    toValue.textContent = to;
    awardYearInput.value = "";
    awardDecadeGroup.querySelectorAll(".chip.active").forEach(function(c) { c.classList.remove("active"); });
  });

  // Specific year input clears sliders and decade chips
  awardYearInput.addEventListener("input", function() {
    var yr = parseInt(awardYearInput.value);
    if (yr >= 1950 && yr <= 2030) {
      fromSlider.value = yr;
      toSlider.value = yr;
      fromValue.textContent = yr;
      toValue.textContent = yr;
    } else {
      fromSlider.value = 1950;
      toSlider.value = 2025;
      fromValue.textContent = "1950";
      toValue.textContent = "2025";
    }
    awardDecadeGroup.querySelectorAll(".chip.active").forEach(function(c) { c.classList.remove("active"); });
  });
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

    case "timeEra":
      // Year input
      const yearInput = document.getElementById("yearInput");
      if (yearInput && yearInput.value) {
        results.push({
          label: `Year: ${yearInput.value}`,
          value: { type: "year", year: parseInt(yearInput.value), subType: "release" }
        });
      }

      // Release decade chips + dateRange + runtime chips
      const releaseChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.subType === "release";
        });
      releaseChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        let label = chip.textContent;
        if (value.type === "decade") label = `Released ${value.decade}s`;
        else if (value.type === "dateRange") label = chip.textContent;
        else if (value.type === "runtime") label = chip.textContent;
        results.push({ label, value });
      });

      // Runtime sliders
      const runtimeMin = document.getElementById("runtimeMin");
      const runtimeMax = document.getElementById("runtimeMax");
      if (runtimeMin && runtimeMax) {
        const min = parseInt(runtimeMin.value);
        const max = parseInt(runtimeMax.value);
        if (min > 0 || max < 300) {
          // Don't add if a runtime chip already selected
          const hasRuntimeChip = results.some(r => r.value.type === "runtime");
          if (!hasRuntimeChip) {
            results.push({
              label: `Runtime: ${min}-${max} min`,
              value: { type: "runtime", subType: "release", min, max }
            });
          }
        }
      }

      return results;

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

    case "production":
      const studioChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "company";
        });
      studioChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({ label: chip.textContent, value });
      });

      const boxOfficeMin = document.getElementById("boxOfficeMin");
      const boxOfficeMax = document.getElementById("boxOfficeMax");
      if (boxOfficeMin && boxOfficeMax) {
        const min = parseInt(boxOfficeMin.value) * 1000000;
        const max = parseInt(boxOfficeMax.value) * 1000000;
        if (min > 0 || max < 2000000000) {
          results.push({
            label: `Box Office: $${min/1000000}M-$${max/1000000}M${max >= 2000000000 ? '+' : ''}`,
            value: { type: "boxoffice", min, max }
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

    case "universes":
      const universeResults = [];
      // Search-selected collections
      const universeChips = document.querySelectorAll('.selected-universe-chip');
      universeChips.forEach(chip => {
        universeResults.push({
          label: chip.dataset.collectionName,
          value: { type: "collection", name: chip.dataset.collectionName, collections: [parseInt(chip.dataset.collectionId)] }
        });
      });
      // Curated universe chips
      const curatedChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          try {
            const val = JSON.parse(chip.dataset.value);
            return val.type === "universe";
          } catch { return false; }
        });
      curatedChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        universeResults.push({ label: value.name, value });
      });
      return universeResults;

    case "themes":
      const themeChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          try { return JSON.parse(chip.dataset.value).type === "theme"; } catch { return false; }
        });
      return themeChips.map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: `Theme: ${value.name}`, value };
      });

    case "settingWhere":
      const locationResults = [];
      // Search-selected locations (chips in the selectedLocationContainer)
      const locationChips = document.querySelectorAll('#selectedLocationContainer [data-location]');
      locationChips.forEach(chip => {
        const loc = chip.dataset.location;
        locationResults.push({
          label: `Set in: ${loc}`,
          value: { type: "location", name: loc }
        });
      });
      // Chip-selected locations (popular/region/special chips)
      const locChipsActive = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          try { return JSON.parse(chip.dataset.value).type === "location"; } catch { return false; }
        });
      locChipsActive.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        // Avoid duplicates if same location was also search-selected
        if (!locationResults.some(r => r.value.name === value.name)) {
          locationResults.push({ label: `Set in: ${value.name}`, value });
        }
      });
      return locationResults;

    case "settingWhen":
      const whenResults = [];
      const whenChips = Array.from(document.querySelectorAll('#focusContent .chip.active'));
      whenChips.forEach(chip => {
        try {
          const value = JSON.parse(chip.dataset.value);
          let label = chip.textContent;
          if (value.type === "time_decade") label = `Set in ${value.value}`;
          else if (value.type === "time_era") label = `Era: ${value.value}`;
          // time_special uses the chip text as-is
          whenResults.push({ label, value });
        } catch {}
      });
      return whenResults;

    case "basedOn":
      const basedOnChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          try { return JSON.parse(chip.dataset.value).type === "based_on"; } catch { return false; }
        });
      return basedOnChips.map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent, value };
      });

    case "awards":
      const awardResults = [];
      const awardChips = document.querySelectorAll('#focusContent .chip.active');
      awardChips.forEach(function(chip) {
        const value = JSON.parse(chip.dataset.value);
        // Skip decade chips — the slider values are what we collect
        if (value.type === "award-decade") return;
        awardResults.push({ label: chip.textContent.trim(), value: value });
      });
      // Year range from sliders (only add if not at defaults)
      const awardFrom = document.getElementById("awardYearFrom");
      const awardTo = document.getElementById("awardYearTo");
      if (awardFrom && awardTo) {
        const from = parseInt(awardFrom.value);
        const to = parseInt(awardTo.value);
        if (from > 1950 || to < 2025) {
          awardResults.push({
            label: from === to ? "Year: " + from : "Years: " + from + "\u2013" + to,
            value: { type: "award-year-range", from: from, to: to }
          });
        }
      }
      return awardResults;

    default:
      return [];
  }
}

// Region modal removed - all streaming settings consolidated into Watch Providers section