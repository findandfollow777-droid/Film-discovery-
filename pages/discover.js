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

// TMDB keyword IDs — verified 2026-05-10 via TMDB /keyword/{id} API.
// Replaces prior IDs that semantically collided (e.g. 9715=superhero was
// mapped to Gritty/Fast-paced/Intense/Atmospheric; 10683=coming-of-age was
// mapped to Uplifting/Quirky/Whimsical/Feel-good/Heartwarming; 818=based-on-
// novel was mapped to Suspenseful/Twisted/Mind-bending). See keyword-ids.js
// note re: the May 9, 2026 road-trip fix for related background.
const KEYWORD_MAP = {
  "Noir": 9807,             // "film noir" (1053 movies); plain "noir" splits into british/french/nordic/tech-noir variants
  "Gritty": 286125,
  "Dark": 10123,            // "dark comedy" — no plain "dark" tone keyword; narrows to comedy
  "Uplifting": 334465,
  "Quirky": 324713,         // reuses "whimsical" — exact "quirky" keyword has 0 movies on TMDB
  "Whimsical": 324713,
  "Bleak": 230747,
  "Slow-burn": 277551,
  "Fast-paced": 372235,     // exact match but very low coverage (1 movie); no better TMDB option
  "Intense": 321464,
  "Suspenseful": 314730,
  "Emotional": 365954,
  "Feel-good": 329716,
  "Atmospheric": 155800,
  "Cerebral": 12565,        // "psychological thriller" — no plain "cerebral" tone keyword; narrows to thriller
  "Twisted": 243026,
  "Violent": 342828,
  "Gore": 10292,
  "Family-friendly": 317983,
  "Heartwarming": 319357,
  "Mind-bending": 362567    // exact match but low coverage (5 movies); no better TMDB option
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
  genreLogic: "or",
  regionLogic: "or"
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

/* ============================================================
   FILTER GRID — All filters rendered as primary cards.
   "More Filters" modal removed May 1, 2026; full FILTER_REGISTRY
   now lives directly in the front-page grid. Watch Providers gets
   its dedicated streaming variant inline.
   ============================================================ */
(function buildFilterLayout() {
  var registry = OrbitUtils && OrbitUtils.FILTER_REGISTRY;
  var filterGrid = document.getElementById('filterGrid');
  if (!filterGrid || !registry) return;

  registry.forEach(function (def) {
    var btn = document.createElement('button');
    var classes = 'section-card';
    if (def.id === 'watch') classes += ' section-card--streaming';
    btn.className = classes;
    btn.dataset.section = def.id;
    var helper = def.id === 'watch'
      ? '<span class="section-card-helper">Filter to films on your active services</span>'
      : '';
    btn.innerHTML =
      '<div class="orbit-icon ' + def.iconClass + '">' +
        '<div class="ring-outer"></div><div class="ring-inner"></div><div class="icon-core"></div>' +
      '</div>' +
      '<div class="section-text">' +
        '<h2>' + def.title + '</h2>' +
        '<p>' + def.subtitle + '</p>' +
        helper +
      '</div>';
    filterGrid.appendChild(btn);
  });
})();

/* ============================================================
   STREAMING BAR — Interactive Pills + Edit Popup
   Added May 4, 2026 (replaces initStreamingBar from May 1).

   Storage keys (Rule 8):
   - orbit_user_providers : profile default IDs array — read-only here
   - orbit_user_country   : profile country code     — read-only here
   - orbit_bar_providers  : bar active subset IDs    — read/write here

   Watch tab keys (watchCountry, watchProviders) are NOT touched.
   ============================================================ */
(function initStreamingBarInteractive() {

  // --- Profile defaults (read-only) ---
  var profileProviderIds;
  try { profileProviderIds = JSON.parse(localStorage.getItem('orbit_user_providers') || '[]'); }
  catch (e) { profileProviderIds = []; }
  var profileCountry =
    localStorage.getItem('orbit_user_country') ||
    localStorage.getItem('watchCountry') || 'US';

  // --- Bar state (persists, starts as copy of profile) ---
  var barProviderIds;
  var rawBar = localStorage.getItem('orbit_bar_providers');
  try { barProviderIds = rawBar ? JSON.parse(rawBar) : null; }
  catch (e) { barProviderIds = null; }
  if (!barProviderIds) {
    barProviderIds = profileProviderIds.slice();
    try { localStorage.setItem('orbit_bar_providers', JSON.stringify(barProviderIds)); } catch (e) {}
  }

  // Extended provider name map. Unknown IDs fall back to "Service N".
  var PNAMES = {
    2: 'Apple TV', 8: 'Netflix', 9: 'Amazon Prime', 10: 'Amazon Video',
    11: 'MUBI', 15: 'Hulu', 21: 'MUBI', 100: 'MUBI',
    119: 'Amazon Prime', 122: 'Peacock', 192: 'YouTube',
    283: 'Crunchyroll', 337: 'Disney+', 350: 'Apple TV+',
    384: 'Max', 386: 'Peacock', 531: 'Paramount+'
  };

  function getProviderName(id) { return PNAMES[id] || ('Service ' + id); }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; }
    return true;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // --- Bar render ---
  function renderBar() {
    var bar       = document.getElementById('discoverStreamBar');
    var container = document.getElementById('discoverStreamServices');
    var countEl   = document.getElementById('discoverStreamCount');
    var modBadge  = document.getElementById('discoverBarModified');
    if (!container) return;

    if (bar) {
      var anyConfigured = profileProviderIds.length > 0 || barProviderIds.length > 0;
      bar.classList.toggle('discover-stream-bar--empty', !anyConfigured);
    }

    // Show every ID the user has ever configured (profile ∪ bar) so
    // off-state pills remain togglable back on.
    var seen = {};
    var allIds = [];
    profileProviderIds.concat(barProviderIds).forEach(function (id) {
      if (!seen[id]) { seen[id] = true; allIds.push(id); }
    });

    if (allIds.length === 0) {
      container.innerHTML = '<span class="discover-stream-none">No streaming services configured — click Edit services to add some.</span>';
    } else {
      container.innerHTML = allIds.map(function (id) {
        var name = getProviderName(id);
        var isOn = barProviderIds.indexOf(id) > -1;
        var cls  = 'discover-stream-pill' + (isOn ? '' : ' discover-stream-pill--off');
        var titleAttr = isOn ? 'Click to exclude' : 'Click to include';
        return '<span class="' + cls + '" data-provider-id="' + id +
               '" title="' + titleAttr + '">' + escapeHtml(name) + '</span>';
      }).join('');

      Array.prototype.forEach.call(
        container.querySelectorAll('.discover-stream-pill'),
        function (pill) {
          pill.addEventListener('click', function () {
            toggleBarPill(parseInt(pill.dataset.providerId, 10));
          });
        }
      );
    }

    if (countEl) {
      countEl.innerHTML = '<strong>' + barProviderIds.length + '</strong> active';
    }

    var differs = !arraysEqual(
      barProviderIds.slice().sort(),
      profileProviderIds.slice().sort()
    );
    if (modBadge) modBadge.style.display = differs ? 'inline-block' : 'none';

    window._discoverUserProviders = barProviderIds;
  }

  function toggleBarPill(providerId) {
    var idx = barProviderIds.indexOf(providerId);
    if (idx > -1) barProviderIds.splice(idx, 1);
    else barProviderIds.push(providerId);
    try { localStorage.setItem('orbit_bar_providers', JSON.stringify(barProviderIds)); } catch (e) {}
    renderBar();
  }

  // --- Popup ---
  function openPopup() {
    var wrap = document.getElementById('discoverPopupWrap');
    var btn  = document.getElementById('discoverEditBtn');
    if (!wrap) return;
    wrap.classList.add('discover-popup-wrap--open');
    wrap.setAttribute('aria-hidden', 'false');
    if (btn) btn.classList.add('discover-edit-btn--open');

    var countryEl = document.getElementById('discoverPopupCountry');
    if (countryEl) {
      countryEl.value = profileCountry;
      loadPopupProviders(profileCountry);
    }
  }

  function closePopup() {
    var wrap = document.getElementById('discoverPopupWrap');
    var btn  = document.getElementById('discoverEditBtn');
    if (!wrap) return;
    wrap.classList.remove('discover-popup-wrap--open');
    wrap.setAttribute('aria-hidden', 'true');
    if (btn) btn.classList.remove('discover-edit-btn--open');
  }

  function loadPopupProviders(countryCode) {
    var grid = document.getElementById('discoverPopupProviderGrid');
    if (!grid) return;
    grid.innerHTML = '<span style="font-size:11px;color:var(--ghost-gray);font-style:italic;">Loading…</span>';

    var apiKey = (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : '';
    var url = 'https://api.themoviedb.org/3/watch/providers/movie?api_key=' +
              encodeURIComponent(apiKey) +
              '&watch_region=' + encodeURIComponent(countryCode) +
              '&language=en-US';

    fetch(url)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        var providers = (data && data.results) ? data.results.slice(0, 40) : [];
        renderPopupGrid(providers);
      })
      .catch(function () {
        // Fallback: profile providers only
        var fallback = profileProviderIds.map(function (id) {
          return { provider_id: id, provider_name: getProviderName(id) };
        });
        renderPopupGrid(fallback);
      });
  }

  function renderPopupGrid(providers) {
    var grid = document.getElementById('discoverPopupProviderGrid');
    if (!grid) return;

    if (!providers.length) {
      grid.innerHTML = '<span style="font-size:11px;color:var(--ghost-gray);font-style:italic;">No providers found for this region.</span>';
      return;
    }

    grid.innerHTML = providers.map(function (p) {
      var id = p.provider_id;
      var name = p.provider_name || getProviderName(id);
      var isOn = profileProviderIds.indexOf(id) > -1;
      var cls = 'discover-popup-provider-pill' + (isOn ? ' discover-popup-provider-pill--on' : '');
      return '<button class="' + cls + '" data-provider-id="' + id +
             '" type="button">' + escapeHtml(name) + '</button>';
    }).join('');

    Array.prototype.forEach.call(
      grid.querySelectorAll('.discover-popup-provider-pill'),
      function (btn) {
        btn.addEventListener('click', function () {
          btn.classList.toggle('discover-popup-provider-pill--on');
        });
      }
    );
  }

  function saveDefaults() {
    var selected = Array.prototype.map.call(
      document.querySelectorAll('.discover-popup-provider-pill--on'),
      function (btn) { return parseInt(btn.dataset.providerId, 10); }
    );
    var countryEl = document.getElementById('discoverPopupCountry');
    var country = (countryEl && countryEl.value) ? countryEl.value : profileCountry;

    try {
      localStorage.setItem('orbit_user_providers', JSON.stringify(selected));
      localStorage.setItem('orbit_user_country', country);
    } catch (e) {}

    /* Best-effort sync with profile.js if it was loaded on this page.
       On the discover page profile.js isn't included, so this is a no-op. */
    if (typeof saveProviderSelections === 'function') {
      try { saveProviderSelections(); } catch (e) {}
    }

    // Reset the in-memory profile reference + bar to match new defaults
    profileProviderIds.length = 0;
    selected.forEach(function (id) { profileProviderIds.push(id); });
    profileCountry = country;
    barProviderIds = selected.slice();
    try { localStorage.setItem('orbit_bar_providers', JSON.stringify(barProviderIds)); } catch (e) {}

    renderBar();
    closePopup();
  }

  function resetBarToProfile() {
    barProviderIds = profileProviderIds.slice();
    try { localStorage.setItem('orbit_bar_providers', JSON.stringify(barProviderIds)); } catch (e) {}
    renderBar();
  }

  // --- Event wiring ---
  var editBtn   = document.getElementById('discoverEditBtn');
  var closeBtn  = document.getElementById('discoverPopupClose');
  var cancelBtn = document.getElementById('discoverPopupCancel');
  var saveBtn   = document.getElementById('discoverPopupSave');
  var modBadge  = document.getElementById('discoverBarModified');
  var countryEl = document.getElementById('discoverPopupCountry');

  if (editBtn)   editBtn.addEventListener('click', openPopup);
  if (closeBtn)  closeBtn.addEventListener('click', closePopup);
  if (cancelBtn) cancelBtn.addEventListener('click', closePopup);
  if (saveBtn)   saveBtn.addEventListener('click', saveDefaults);
  if (modBadge)  modBadge.addEventListener('click', resetBarToProfile);
  if (countryEl) countryEl.addEventListener('change', function () {
    loadPopupProviders(countryEl.value);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  renderBar();
})();

/* ============================================================
   GLOBAL CONTROLS STRIP — Sort-by (SHELL, Phase 1b-i — 2026-06-01)
   Holds the chosen sort in state.sortBy ONLY. NOT wired into the query,
   film-count, or Launch — sort_by stays hard-coded popularity.desc in
   buildTMDBQueryFromFilters until Phase 1b-ii (which will read state.sortBy).
   Changing the control updates state.sortBy and logs it; results unchanged.
   ============================================================ */
(function initGlobalSortControl() {
  var fieldSel = document.getElementById('discoverSortField');
  var dirSel   = document.getElementById('discoverSortDir');
  if (!fieldSel || !dirSel) return;
  function applySort() {
    // state.sortBy is the single source of truth Phase 1b-ii will read.
    state.sortBy = fieldSel.value + '.' + dirSel.value;
    console.log('[Discover] sort-by →', state.sortBy);
  }
  fieldSel.addEventListener('change', applySort);
  dirSel.addEventListener('change', applySort);
  applySort();   // initialise state.sortBy from the defaults (popularity.desc)
})();

/* ============================================================
   QUICK STARTS — Added May 1, 2026
   Pool of 8 preset searches. 4 shown per visit, rotated daily
   based on day-since-epoch index. Shuffle button reshuffles
   on demand.

   localStorage key reserved for future use:
     orbit_discover_preset_day  (integer, day-since-epoch).
     Not written or read this pass — placeholder for stickiness
     when applyPreset() learns to wire into filter state.
   ============================================================ */
/* Preset shapes use existing collectLabelsForSection value schemas:
   - genres:     { type: "genre", name }
   - decade:     { type: "decade", decade: "1990", subType: "release" }
   - region:     { type: "region", code, name }
   - rating:     { type: "rating", min, max }
   - festival:   { type: "award-festival", festival }    (capitalized: "Oscar", "Cannes")
   - category:   { type: "award-category", category }    (full label: "Palme d'Or", "Best Picture")
   - yearRange:  { type: "award-year-range", from, to }
   Phase-1 presets relying on filmmaker_profile / watch_providers:'user' /
   career_stage / language:'non-english' have been removed since those
   filters do not exist yet. */
/* ============================================================
   PRESET_POOL — Rebuilt May 4, 2026
   Index 0 is the spotlight (rotated in via shouldShowSpotlight()).
   Indices 1-60 are evergreen presets, fisher-yates shuffled per visit.
   Update spotlight `weekId` each Monday; flip `streamingNow` when the
   spotlight title hits a streaming service.
   ============================================================ */
var PRESET_POOL = [
  // SPOTLIGHT (index 0)
  {
    name: 'Music biopics, 2020s',
    tag: 'IN CINEMAS',
    color: 'spotlight',
    spotlight: true,
    weekId: '2026-W19',
    streamingNow: false,
    filters: {
      genres: ['Drama', 'Music'],
      decade: '2020',
      keyword: { id: 9672, name: 'Based on true story' },
      minRating: 7.0,
      minVotes: 500
    }
  },

  // AWARDS (8)
  /* 2026-05-17: added `level: 'winner'` to the four "winner" presets
     so the preset path pushes an award-level filter into state.
     Without it, getAwardsMatchingIds returned winners + nominees +
     in-competition entries (419 for Palme d'Or, 172 for Best Picture,
     etc.). Requires the matching presetToStateFilters branch below. */
  { name: "Palme d'Or, 21st century", tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'Cannes', category: "Palme d'Or", yearFrom: 2000, level: 'winner' } } },
  { name: 'Best Picture winners, 21st century', tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'Oscar', category: 'Best Picture', yearFrom: 2000, level: 'winner' } } },
  { name: 'Golden Lion winners, post-2000', tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'Venice', category: 'Golden Lion', yearFrom: 2000, level: 'winner' } } },
  { name: 'Golden Bear winners, post-2000', tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'Berlin', category: 'Golden Bear', yearFrom: 2000, level: 'winner' } } },
  /* 2026-05-17: refined to last 10 years + winners only (was 1990+, all results). */
  { name: 'Oscar Best International Film, 2015+', tag: 'AWARDS · REGION', color: 'gold',
    filters: { awards: { festival: 'Oscar', category: 'Best International Feature Film', yearFrom: 2015, level: 'winner' } } },
  { name: 'BAFTA Best Film, 21st century', tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'BAFTA', category: 'Best Film', yearFrom: 2000, level: 'winner' } } },
  { name: "Cannes Jury Prize, 1990s–2000s", tag: 'AWARDS · ERA', color: 'gold',
    filters: { awards: { festival: 'Cannes', category: 'Jury Prize', yearFrom: 1990, yearTo: 2009, level: 'winner' } } },
  /* 2026-05-17: fixed v1 category name ("Best Documentary Feature" → "Best
     Documentary Feature Film") and added level:'winner'. v1 has 26 Oscar
     Best Documentary Feature Film winners 1990-2025. */
  { name: 'Oscar-winning documentaries', tag: 'AWARDS · GENRE', color: 'gold',
    filters: { genres: ['Documentary'], awards: { festival: 'Oscar', category: 'Best Documentary Feature Film', yearFrom: 1990, level: 'winner' } } },

  // REGION (12)
  { name: '90s Hong Kong cinema', tag: 'REGION · DECADE', color: 'cyan',
    filters: { region: { code: 'HK', name: 'Hong Kong' }, decade: '1990', minRating: 7.0, minVotes: 50 } },
  { name: 'Korean thrillers, 7.5+, 2010s+', tag: 'REGION · GENRE', color: 'purple',
    filters: { region: { code: 'KR', name: 'South Korea' }, genres: ['Thriller'], minRating: 7.5, releaseYearFrom: 2010 } },
  { name: 'Japanese anime, 7.5+', tag: 'REGION · GENRE', color: 'green',
    filters: { genres: ['Animation'], region: { code: 'JP', name: 'Japan' }, minRating: 7.5, minVotes: 1000, releaseYearFrom: 1990 } },
  { name: 'French New Wave, 1950s–60s', tag: 'REGION · DECADE', color: 'indigo',
    filters: { region: { code: 'FR', name: 'France' }, releaseYearFrom: 1950, releaseYearTo: 1969, minVotes: 300 } },
  { name: 'Italian neo-realism classics', tag: 'REGION · GENRE', color: 'teal',
    filters: { region: { code: 'IT', name: 'Italy' }, genres: ['Drama'], decade: '1950', minVotes: 50 } },
  { name: 'New German Cinema, 1970s', tag: 'REGION · DECADE', color: 'orange',
    filters: { region: { code: 'DE', name: 'Germany' }, decade: '1970', minVotes: 50 } },
  { name: 'Iranian cinema, post-2000', tag: 'REGION · ERA', color: 'rose',
    filters: { region: { code: 'IR', name: 'Iran' }, releaseYearFrom: 2000, minRating: 7.0, minVotes: 20 } },
  { name: 'Classic Hollywood noir, 1940s, 7.5+', tag: 'REGION · DECADE', color: 'cyan',
    filters: { region: { code: 'US', name: 'United States' }, genres: ['Crime', 'Drama'], decade: '1940', minRating: 7.5, minVotes: 25 } },
  { name: 'Romanian New Wave', tag: 'REGION · ERA', color: 'purple',
    filters: { region: { code: 'RO', name: 'Romania' }, decade: '2000', minVotes: 20 } },
  { name: 'Nordic crime dramas', tag: 'REGION · GENRE', color: 'green',
    filters: { region: { code: 'SE|NO|DK|FI|IS', name: 'Nordic' }, genres: ['Crime', 'Thriller'], minRating: 6.5, minVotes: 100 } },
  { name: 'Latin American cinema, 2000s+', tag: 'REGION · DECADE', color: 'indigo',
    filters: { region: { code: 'MX|BR|AR|CL|CO|PE', name: 'Latin America' }, releaseYearFrom: 2000, minVotes: 500 } },
  /* 2026-05-17: tuned to rating 7-8 + minVotes 100 (verified ≈85 films). */
  { name: 'Hindi drama classics, 2000s', tag: 'REGION · DECADE', color: 'teal',
    filters: { region: { code: 'IN', name: 'India' }, genres: ['Drama'], language: 'hi', minRating: 7, maxRating: 8, decade: '2000' } },

  // GENRE + ERA (15)
  { name: '70s horror classics', tag: 'GENRE · DECADE', color: 'orange',
    filters: { genres: ['Horror'], decade: '1970', minRating: 7.5 } },
  { name: 'Sci-fi thrillers, 8.0+, 2010s+', tag: 'GENRE · RATING', color: 'rose',
    filters: { genres: ['Science Fiction', 'Thriller'], minRating: 8.0, releaseYearFrom: 2010 } },
  { name: '1980s sci-fi, 7.0+', tag: 'GENRE · DECADE', color: 'cyan',
    filters: { genres: ['Science Fiction'], decade: '1980', minRating: 7.0 } },
  { name: '1960s spy thrillers', tag: 'GENRE · DECADE', color: 'purple',
    filters: { genres: ['Action', 'Thriller'], decade: '1960' } },
  { name: 'Film noir, 1940s–50s', tag: 'GENRE · DECADE', color: 'green',
    filters: { genres: ['Crime', 'Drama'], releaseYearFrom: 1940, releaseYearTo: 1959, minVotes: 1000 } },
  { name: 'Spaghetti westerns, 1960s–70s', tag: 'GENRE · DECADE', color: 'indigo',
    filters: { genres: ['Western'], region: { code: 'IT', name: 'Italy' }, releaseYearFrom: 1960, releaseYearTo: 1979, minRating: 7.5 } },
  { name: 'New Hollywood, early 1970s', tag: 'GENRE · DECADE', color: 'teal',
    filters: { genres: ['Drama'], region: { code: 'US', name: 'United States' }, decade: '1970', minVotes: 500 } },
  { name: 'Indie drama, 2000s', tag: 'GENRE · ERA', color: 'orange',
    filters: { genres: ['Drama'], decade: '2000', minRating: 7.5 } },
  { name: '1990s slasher horror', tag: 'GENRE · DECADE', color: 'rose',
    filters: { genres: ['Horror'], decade: '1990' } },
  { name: 'Contemporary animation, 2010s+', tag: 'GENRE · ERA', color: 'cyan',
    filters: { genres: ['Animation'], releaseYearFrom: 2010, minVotes: 5000 } },
  { name: 'Classic musicals, 1950s', tag: 'GENRE · DECADE', color: 'purple',
    filters: { genres: ['Music', 'Romance'], decade: '1950' } },
  { name: '2020s prestige drama', tag: 'GENRE · ERA', color: 'green',
    filters: { genres: ['Drama'], decade: '2020', minRating: 7.5 } },
  { name: 'Silent era masterpieces', tag: 'GENRE · ERA', color: 'indigo',
    filters: { genres: ['Drama'], decade: '1920', minRating: 7 } },
  { name: '1980s action blockbusters', tag: 'GENRE · DECADE', color: 'teal',
    filters: { genres: ['Action'], decade: '1980', minRating: 7.5 } },
  { name: 'Psychological horror, 2010s+', tag: 'GENRE · ERA', color: 'orange',
    filters: { genres: ['Horror', 'Thriller'], releaseYearFrom: 2010, minRating: 7, minVotes: 5000 } },

  // RATING + MOOD (8)
  /* 2026-05-17: loosened from 8.5/50k (returned 0) to 8.0/10k (~79). */
  { name: 'Crime epics, 8.0+', tag: 'GENRE · RATING', color: 'rose',
    filters: { genres: ['Crime', 'Drama'], minRating: 8.0, minVotes: 10000 } },
  { name: 'Crime documentaries, 7.0+', tag: 'GENRE · RATING', color: 'cyan',
    filters: { genres: ['Documentary'], keyword: { id: 307587, name: 'true crime' }, minRating: 7.0 } },
  { name: 'War films, 8.0+', tag: 'GENRE · RATING', color: 'purple',
    filters: { genres: ['War', 'Drama'], minRating: 8 } },
  { name: 'Hidden gems, 7.5+ pre-1970', tag: 'RATING · ERA', color: 'green',
    filters: { minRating: 7.5, releaseYearFrom: 1900, releaseYearTo: 1969, minVotes: 2000 } },
  /* 2026-05-17: rating 8+ + votes 10k was too tight (only 8 results
     after votes-bug fix). Loosened to 7.9+ + votes 1k. */
  { name: 'Animation for adults, 8.0+', tag: 'GENRE · RATING', color: 'indigo',
    filters: { genres: ['Animation'], minRating: 7.9, minVotes: 1000 } },
  /* "Horror under 90 minutes" removed 2026-05-22: runtimeMax silently
     dropped by the preset translator (no upper-bound runtime semantics),
     so the preset returned all Horror films. Re-add only after the
     translator gains with_runtime.lte support. */
  /* "Epic cinema, 8.0+" — runtimeMax dropped (no upper-bound semantics
     in current preset translator). Will gain a min-runtime filter when
     buildTMDBQueryFromFilters is extended.
     2026-05-17: votes 20k → 10k, tag updated to 'RATING' (no genre filter). */
  { name: 'Epic cinema, 8.0+', tag: 'RATING', color: 'teal',
    filters: { minRating: 8.0, minVotes: 10000 } },
  { name: 'Romance, 8.0+, 2000s+', tag: 'GENRE · RATING', color: 'orange',
    filters: { genres: ['Romance', 'Drama'], minRating: 8.0, releaseYearFrom: 2000 } },

  // SOURCE + MOOD (7)
  { name: 'Drama novels, 7.0–8.5', tag: 'SOURCE · RATING', color: 'rose',
    filters: { genres: ['Drama'], keyword: { id: 818, name: 'Based on novel' }, minRating: 7.0, maxRating: 8.5, minVotes: 5000 } },
  { name: 'True crime, 7.5+, 2000s+', tag: 'GENRE · SOURCE', color: 'cyan',
    filters: { genres: ['Crime', 'Thriller'], keyword: { id: 9672, name: 'Based on true story' }, minRating: 7.5, releaseYearFrom: 2000 } },
  { name: 'Coming-of-age, 1980s', tag: 'GENRE · DECADE', color: 'purple',
    filters: { genres: ['Drama'], keyword: { id: 10683, name: 'Coming of age' }, releaseYearFrom: 1980, releaseYearTo: 1989, minRating: 7.0 } },
  { name: 'Heist films, 2000s', tag: 'GENRE · ERA', color: 'green',
    filters: { genres: ['Crime', 'Thriller'], decade: '2000', keyword: { id: 10051, name: 'Heist' } } },
  { name: 'Supernatural horror, 1970s–80s', tag: 'GENRE · DECADE', color: 'indigo',
    filters: { genres: ['Horror'], releaseYearFrom: 1970, releaseYearTo: 1989, minVotes: 1000 } },
  { name: 'Road movies, 6.5+, 1970s-90s', tag: 'GENRE · THEME', color: 'teal',
    filters: { genres: ['Drama', 'Adventure'], keyword: { id: 7312, name: 'Road trip' }, minRating: 6.5, releaseYearFrom: 1970, releaseYearTo: 1999 } },
  { name: 'Courtroom dramas', tag: 'GENRE · THEME', color: 'orange',
    filters: { genres: ['Drama', 'Thriller'], keyword: { id: 33519, name: 'Courtroom drama' }, minRating: 7.0, minVotes: 1000 } },

  // FRANCHISES (was 9, now 13 — 2026-05-16: dropped standalone Alien
  // and Predator entries, merged into "Alien vs. Predator Universe"
  // via multiCollections; added 6 new collection-based franchises)
  /* 2026-05-16: slug-based extended collection. The ids live in
     EXTENDED_COLLECTIONS['wizarding-world']; presetToStateFilters
     detects the string id and rewrites to a movieList universe
     filter at apply time. */
  { name: 'The Wizarding World', tag: 'FRANCHISE', color: 'rose',
    description: 'Harry Potter and Fantastic Beasts films',
    filters: { collection: { id: 'wizarding-world', name: 'The Wizarding World' } } },
  /* 2026-05-16: corrected 735 → 115762. TMDB ID 735 is the
     "Blade Collection" (Wesley Snipes vampire films), NOT Alien
     vs. Predator. 115762 is the actual AVP Collection. */
  { name: 'Alien vs. Predator Universe', tag: 'FRANCHISE', color: 'cyan',
    description: 'All Alien, Predator, and crossover films',
    filters: { multiCollections: [
      { id: 8091,   name: 'Alien Collection' },
      { id: 399,    name: 'Predator Collection' },
      { id: 115762, name: 'AVP Collection' }
    ] } },
  /* 2026-05-16: switched from broad Action+Thriller+UK (returned ~4,835
     films) to TMDB James Bond Collection (id 645, ~27 films). Matches
     the HP / MI / Star Wars / LOTR / MCU preset pattern. */
  { name: 'James Bond saga', tag: 'FRANCHISE', color: 'purple',
    filters: { collection: { id: 645, name: 'James Bond Collection' } } },
  /* 2026-05-16: TMDB ID 131295 is "Captain America Collection" (4 films),
     NOT the MCU. The MCU is split across ~25 TMDB collections plus
     standalones. The clean path is TMDB keyword 180547 ("marvel
     cinematic universe (mcu)") which tags every MCU film — handled
     via universesKeyword → universes section → with_keywords. */
  { name: 'Marvel Cinematic Universe', tag: 'FRANCHISE', color: 'green',
    filters: { universesKeyword: { id: 180547, name: 'Marvel Cinematic Universe' } } },
  /* 2026-05-16: slug-based ref → EXTENDED_COLLECTIONS['star-wars']
     (Skywalker saga + Rogue One + Solo + Mando & Grogu = 12 films). */
  { name: 'Star Wars', tag: 'FRANCHISE', color: 'indigo',
    filters: { collection: { id: 'star-wars', name: 'Star Wars' } } },
  /* 2026-05-16: added Hobbit Collection (121938) alongside LOTR
     (119). Dropped genre filters — the multi-collection alone
     defines the franchise. */
  { name: 'Middle-earth films', tag: 'FRANCHISE', color: 'teal',
    filters: { multiCollections: [
      { id: 119,    name: 'The Lord of the Rings Collection' },
      { id: 121938, name: 'The Hobbit Collection' }
    ] } },
  /* 2026-05-16: dropped Action+Thriller genres — collection alone
     defines the franchise; AND-semantics genre filters were
     reducing the count below the collection's natural size. */
  { name: 'Mission: Impossible series', tag: 'FRANCHISE', color: 'orange',
    filters: { collection: { id: 87359, name: 'Mission: Impossible Collection' } } },
  { name: 'Indiana Jones saga', tag: 'FRANCHISE', color: 'rose',
    description: 'Archaeology adventures across decades',
    filters: { collection: { id: 84, name: 'Indiana Jones Collection' } } },
  { name: 'Jurassic Park/World', tag: 'FRANCHISE', color: 'cyan',
    description: 'Dinosaurs from \'93 to now',
    filters: { collection: { id: 328, name: 'Jurassic Park Collection' } } },
  /* 2026-05-16: slug-based ref → EXTENDED_COLLECTIONS['fast-furious']
     (main 11 + Hobbs & Shaw = 12 films). */
  { name: 'Fast & Furious', tag: 'FRANCHISE', color: 'purple',
    description: 'Street racing to global heists',
    filters: { collection: { id: 'fast-furious', name: 'Fast & Furious' } } },
  { name: 'Bourne series', tag: 'FRANCHISE', color: 'green',
    description: 'Espionage thriller saga',
    filters: { collection: { id: 31562, name: 'The Bourne Collection' } } },
  /* 2026-05-16: added Creed Collection (553717) alongside Rocky
     (1575) so all 9 films appear. */
  { name: 'Rocky & Creed', tag: 'FRANCHISE', color: 'indigo',
    description: 'Boxing legacy spanning 50 years',
    filters: { multiCollections: [
      { id: 1575,   name: 'Rocky Collection' },
      { id: 553717, name: 'Creed Collection' }
    ] } },
  /* 2026-05-16: slug-based ref → EXTENDED_COLLECTIONS['planet-apes']
     (original 5 + Burton + modern 4 = 10 films). */
  { name: 'Planet of the Apes', tag: 'FRANCHISE', color: 'teal',
    description: 'Evolution across timelines',
    filters: { collection: { id: 'planet-apes', name: 'Planet of the Apes' } } },
  /* 2026-05-26: Horror franchises mega-preset — 27 TMDB collections, 149
     films total (144 released + 5 unreleased). Major slasher, supernatural,
     and Asian horror series with 3+ films each. Freddy vs. Jason is
     already inside Friday the 13th Collection (9735); Wes Craven's New
     Nightmare is inside Elm Street Collection (8581). Texas Chainsaw is
     split across TMDB into the original series + 2003 reboot duology, and
     Ju-on across original + reboot + 2009 anthology — all branches included
     for full coverage. Conjuring Universe bundled here (Conjuring +
     Annabelle + Nun + La Llorona) rather than a separate preset. */
  { name: 'Horror franchises', tag: 'FRANCHISE · GENRE', color: 'rose',
    description: 'Major horror series with 3+ films',
    filters: { multiCollections: [
      { id: 91361,   name: 'Halloween Collection' },
      { id: 9735,    name: 'Friday the 13th Collection' },
      { id: 8581,    name: 'A Nightmare on Elm Street Collection' },
      { id: 2602,    name: 'Scream Collection' },
      { id: 656,     name: 'Saw Collection' },
      { id: 8917,    name: 'Hellraiser Collection' },
      { id: 10455,   name: "Child's Play Collection" },
      { id: 8864,    name: 'Final Destination Collection' },
      { id: 228446,  name: 'Insidious Collection' },
      { id: 41437,   name: 'Paranormal Activity Collection' },
      { id: 256322,  name: 'The Purge Collection' },
      { id: 111751,  name: 'Texas Chainsaw Massacre Collection' },
      { id: 425175,  name: 'Texas Chainsaw (Reboot) Collection' },
      { id: 12263,   name: 'The Exorcist Collection' },
      { id: 1960,    name: 'Evil Dead Collection' },
      { id: 98580,   name: 'Candyman Collection' },
      { id: 313086,  name: 'The Conjuring Collection' },
      { id: 402074,  name: 'Annabelle Collection' },
      { id: 968052,  name: 'The Nun Collection' },
      { id: 1533646, name: 'La Llorona Collection' },
      { id: 432,     name: 'Cube Collection' },
      { id: 14563,   name: 'The Ring Collection' },
      { id: 93369,   name: 'Ringu Collection' },
      { id: 1974,    name: 'The Grudge Collection' },
      { id: 1972,    name: 'Ju-on Collection' },
      { id: 1246435, name: 'Ju-on (Reboot) Collection' },
      { id: 1246426, name: 'Ju-on (2009) Collection' }
    ] } },

  // TIME TRAVEL (1)
  { name: 'Time travel adventures', tag: 'GENRE · CONCEPT', color: 'orange',
    filters: { genres: ['Science Fiction', 'Adventure'], keyword: { id: 4379, name: 'Time travel' }, minRating: 7.0, minVotes: 3000 } }
];

function getTodayIndex() { return Math.floor(Date.now() / 86400000); }

/* ============================================================
   SPOTLIGHT ROTATION — Added May 4, 2026

   - Spotlight is always PRESET_POOL[0]
   - Appears at position 0 of the 5 shown when earned
   - Random every 2nd or 3rd visit, never consecutive
   - Caps at 3 views per ISO week, then rests until next week
   - Visit counter increments only on page-load (not on Shuffle)

   Storage keys:
   - orbit_visit_count            number — page-load count
   - orbit_spotlight_last_shown   "true" / "false"
   - orbit_spotlight_week         current ISO week, e.g. "2026-W19"
   - orbit_spotlight_views        views this week
   - orbit_last_preset_indices    JSON array of last evergreen picks
   ============================================================ */

function getISOWeek() {
  var now = new Date();
  var jan4 = new Date(now.getFullYear(), 0, 4);
  var weekNo = Math.ceil(((now - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return now.getFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

function shouldShowSpotlight() {
  var spotlight = PRESET_POOL[0];
  if (!spotlight || !spotlight.spotlight) return false;

  var currentWeek = getISOWeek();
  var spotlightWeek = localStorage.getItem('orbit_spotlight_week') || '';
  var lastShown = localStorage.getItem('orbit_spotlight_last_shown') === 'true';
  var views = parseInt(localStorage.getItem('orbit_spotlight_views') || '0', 10);

  /* Never show twice in a row */
  if (lastShown) return false;

  /* Reset weekly view count if we've crossed into a new ISO week */
  if (spotlightWeek !== currentWeek) {
    localStorage.setItem('orbit_spotlight_views', '0');
    localStorage.setItem('orbit_spotlight_week', currentWeek);
    views = 0;
  }

  /* Cap at 3 views per week */
  if (views >= 3) return false;

  /* Random gating: every 2nd or 3rd visit */
  var gap = Math.random() < 0.5 ? 2 : 3;
  var visitCount = parseInt(localStorage.getItem('orbit_visit_count') || '0', 10);
  return visitCount % gap === 0;
}

function recordSpotlightView() {
  var currentWeek = getISOWeek();
  var storedWeek = localStorage.getItem('orbit_spotlight_week') || '';
  var views = storedWeek === currentWeek
    ? parseInt(localStorage.getItem('orbit_spotlight_views') || '0', 10)
    : 0;
  localStorage.setItem('orbit_spotlight_week', currentWeek);
  localStorage.setItem('orbit_spotlight_views', String(views + 1));
  localStorage.setItem('orbit_spotlight_last_shown', 'true');
}

/* Fisher–Yates shuffle of indices 1..N (excludes spotlight at 0). */
function shuffleEvergreenIndices() {
  var indices = [];
  for (var i = 1; i < PRESET_POOL.length; i++) indices.push(i);
  for (var j = indices.length - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var tmp = indices[j]; indices[j] = indices[k]; indices[k] = tmp;
  }
  return indices;
}

/* Pick `count` evergreen presets, avoiding the previous batch where possible.

   Phase 2 (2026-06-01): favourite-weighted sampling layered on top of the
   anti-repetition logic.
     1. Same as before — split indices into `fresh` (not in the previous
        batch) and `stale` (recently shown). `fresh` is drawn from first
        so we don't repeat tiles round-to-round.
     2. WITHIN each pool, sample WITHOUT REPLACEMENT using random weights
        where each index's weight = 1.5 if PRESET_POOL[idx].name is in
        orbit_favourite_presets, else 1.0. So favourited entries surface
        ~50% more often without ever appearing twice in one batch.
     3. Saved searches do NOT enter the strip — pickEvergreens still
        returns PRESET_POOL entries only.
   Helpers come from the Phase 2 IIFE at the end of this file via
   window.__orbitLoadFavourites; the function-level guard means the
   shuffle works even if that IIFE hasn't run yet (everyone gets 1.0). */
function pickEvergreens(count) {
  var lastRaw = localStorage.getItem('orbit_last_preset_indices') || '[]';
  var lastSet = {};
  try {
    JSON.parse(lastRaw).forEach(function (idx) { lastSet[idx] = true; });
  } catch (e) { /* corrupted — start fresh */ }

  var favs = (typeof window.__orbitLoadFavourites === 'function')
    ? window.__orbitLoadFavourites() : [];
  var favSet = {};
  for (var fi = 0; fi < favs.length; fi++) favSet[favs[fi]] = true;
  function weightFor(idx) {
    var p = PRESET_POOL[idx];
    return (p && favSet[p.name]) ? 1.5 : 1.0;
  }

  /* Indices 1..N-1 (skip spotlight at 0, same as shuffleEvergreenIndices). */
  var allIdx = [];
  for (var i = 1; i < PRESET_POOL.length; i++) allIdx.push(i);
  var fresh = allIdx.filter(function (idx) { return !lastSet[idx]; });
  var stale = allIdx.filter(function (idx) { return  lastSet[idx]; });

  function pickWeightedNoReplace(pool, n) {
    var picks = [];
    var available = pool.slice();
    var weights = available.map(weightFor);
    while (picks.length < n && available.length > 0) {
      var total = 0;
      for (var k = 0; k < weights.length; k++) total += weights[k];
      if (total <= 0) break;
      var r = Math.random() * total;
      var acc = 0;
      for (var j = 0; j < available.length; j++) {
        acc += weights[j];
        if (r <= acc) {
          picks.push(available[j]);
          available.splice(j, 1);
          weights.splice(j, 1);
          break;
        }
      }
    }
    return picks;
  }

  /* Prefer fresh picks; fall back to stale ones if fewer than `count` fresh. */
  var picks = pickWeightedNoReplace(fresh, count);
  if (picks.length < count) {
    picks = picks.concat(pickWeightedNoReplace(stale, count - picks.length));
  }
  localStorage.setItem('orbit_last_preset_indices', JSON.stringify(picks));
  return picks.map(function (idx) { return PRESET_POOL[idx]; });
}

function getActivePresets(count) {
  count = (typeof count === 'number' && count > 0) ? count : 5;
  if (shouldShowSpotlight()) {
    recordSpotlightView();
    return [PRESET_POOL[0]].concat(pickEvergreens(count - 1));
  }
  localStorage.setItem('orbit_spotlight_last_shown', 'false');
  return pickEvergreens(count);
}

/* Returns the number of preset tiles to render based on which other
   sections are collapsed. Collapsing a section frees vertical space;
   Quick Searches fills that space with additional tile rows.
     • Both expanded → 5 tiles (1 row × 5)
     • Headline collapsed only → 10 tiles (2 rows × 5)
     • Filter tabs collapsed only → 25 tiles (5 rows × 5)
     • Both collapsed → 35 tiles (7 rows × 5)
   Reads from the live DOM so callers don't need to thread state. */
function getActivePresetCount() {
  var headline = document.querySelector('.section-container[data-section="headline"]');
  var filterTabs = document.querySelector('.section-container[data-section="filterTabs"]');
  var headlineCollapsed = !!(headline && headline.classList.contains('collapsed'));
  var tabsCollapsed = !!(filterTabs && filterTabs.classList.contains('collapsed'));
  if (headlineCollapsed && tabsCollapsed) return 35;
  if (tabsCollapsed) return 25;
  if (headlineCollapsed) return 10;
  return 5;
}

/* ============================================================
   PRESET → GLYPH MAPPING — Added 2026-05-24 (Phase 2)
   Maps a preset to its T2 Quick Search glyph class. First word of
   the tag wins for compound tags ('GENRE · DECADE' → og-qs-genre).
   Returns null for the spotlight tile so it keeps its loud
   "NOW STREAMING / IN CINEMAS" badge identity untouched.
   T2 glyph definitions live in components/orbit-glyphs-v2.css.
   ============================================================ */
function getPresetGlyphClass(preset) {
  // Spotlight gets no glyph - already has "NOW STREAMING" badge
  if (preset.tag === 'IN CINEMAS') return null;

  // First word wins for compound tags
  const firstWord = preset.tag.split(' · ')[0];

  const glyphMap = {
    'FRANCHISE': 'og-qs-franchise',
    'AWARDS': 'og-qs-awards',
    'GENRE': 'og-qs-genre',
    'REGION': 'og-qs-region',
    'RATING': 'og-qs-ratings',  // Discovery tab glyph, but semantically fits
    'SOURCE': 'og-qs-source',   // Discovery tab glyph, but semantically fits
    // These should never be first word based on the data, but handle anyway:
    'DECADE': 'og-qs-decade',
    'ERA': 'og-qs-era',
    'THEME': 'og-qs-theme',
    'CONCEPT': 'og-qs-theme'    // CONCEPT maps to theme glyph
  };

  return glyphMap[firstWord] || 'og-qs-genre'; // fallback
}

function renderPresets(presets) {
  var container = document.getElementById('discoverPresets');
  if (!container) return;
  container.innerHTML = presets.map(function (p, i) {
    var isSpotlight = p.color === 'spotlight';
    var classes = 'discover-preset discover-preset--' + p.color;
    if (isSpotlight) classes += ' discover-preset--spotlight';
    var tagClass = 'discover-preset-tag' + (isSpotlight ? ' discover-preset-tag--live' : '');
    var tagText  = isSpotlight
      ? (p.streamingNow ? '● NOW STREAMING' : '● IN CINEMAS')
      : p.tag;
    var glyphClass = getPresetGlyphClass(p);
    var glyphSpan  = glyphClass ? '<span class="og-qs ' + glyphClass + ' discover-preset-glyph" aria-hidden="true"></span>' : '';
    /* 2026-05-24 Phase 3 — Hybrid B decorations: corner color "sun"
       glow + tinted badge wrapping the glyph. CSS does the positioning. */
    var decorations = glyphClass
      ? '<span class="discover-preset-glow" aria-hidden="true"></span>' +
        '<span class="discover-preset-badge" aria-hidden="true">' + glyphSpan + '</span>'
      : '';
    var tagSpan  = '<span class="' + tagClass + '">' + tagText + '</span>';
    var nameSpan = '<span class="discover-preset-name">' + p.name + '</span>';
    /* Spotlight keeps tag-first (loud amber badge on top). Non-spotlight
       emits glow + badge + name + label (tag), DOM order matches visual. */
    var inner = isSpotlight ? (tagSpan + nameSpan) : (decorations + nameSpan + tagSpan);
    return '<button class="' + classes + '" type="button" data-preset="' + i + '">' + inner + '</button>';
  }).join('');
  container.querySelectorAll('.discover-preset').forEach(function (btn, i) {
    btn.addEventListener('click', function () { applyPreset(presets[i]); });
  });
  applyCompactClasses(container);
}

/* ============================================================
   COMPACT-TILE SIZER — Added 2026-05-24 (Phase 3.1)
   After tiles are in the DOM, measure each non-spotlight preset
   name and add `discover-preset--compact` when it renders in
   ≤ 2 lines. CSS bumps name + label font-size by 5% for those
   tiles. Measure at base size first — the 5% step is small so
   borderline cases don't flip in practice (brief accepts this).
   Skips spotlight and tiles with no name element. Safe to call
   multiple times — classList.add is idempotent.
   ============================================================ */
function applyCompactClasses(rootEl) {
  if (!rootEl) return;
  var tiles = rootEl.querySelectorAll('.discover-preset:not(.discover-preset--spotlight)');
  tiles.forEach(function (tile) {
    var name = tile.querySelector('.discover-preset-name');
    if (!name) return;
    var s = getComputedStyle(name);
    var fontSize = parseFloat(s.fontSize);
    var lhRaw = s.lineHeight;
    var lh;
    if (lhRaw === 'normal') {
      lh = fontSize * 1.3;
    } else if (lhRaw.indexOf('px') !== -1) {
      lh = parseFloat(lhRaw);
    } else {
      var n = parseFloat(lhRaw);
      lh = !isNaN(n) ? fontSize * n : fontSize * 1.3;
    }
    if (!lh || lh <= 0) return;
    var lineCount = Math.round(name.scrollHeight / lh);
    if (lineCount <= 2) tile.classList.add('discover-preset--compact');
  });
}

/* ============================================================
   PRESET TRANSLATOR — Wired May 2, 2026
   Translates a Quick Start preset into state.filters entries
   matching the shapes produced by collectLabelsForSection, then
   replaces state.filters and refreshes UI.
   ============================================================ */
function presetToStateFilters(preset) {
  var f = preset.filters || {};
  var entries = [];
  function push(section, label, value) {
    entries.push({ id: section + '-' + label, section: section, label: label, value: value });
  }

  if (Array.isArray(f.genres)) {
    f.genres.forEach(function (g) {
      push('genres', g, { type: 'genre', name: g });
    });
  }

  if (f.decade) {
    var decadeStr = String(f.decade).replace(/s$/, '');
    push('timeEra', decadeStr + 's', { type: 'decade', decade: decadeStr, subType: 'release' });
  }

  /* 2026-05-23: releaseYearFrom/To → dateRange entry. Without this branch
     these keys were silently dropped at the preset→state step, leaving
     presets like "Japanese anime, 1990s-2000s" unbounded by year and
     hitting TMDB's 9,999+ cap. buildTMDBQueryFromFilters already supports
     `type: 'dateRange'` (line ~2524). */
  if (f.releaseYearFrom || f.releaseYearTo) {
    var fromYear = f.releaseYearFrom || 1900;
    var toYear = f.releaseYearTo || new Date().getFullYear();
    push('timeEra', fromYear + '–' + toYear, {
      type: 'dateRange',
      start: fromYear + '-01-01',
      end: toYear + '-12-31'
    });
  }

  if (typeof f.minRating === 'number') {
    var ratingMin = f.minRating;
    var ratingMax = typeof f.maxRating === 'number' ? f.maxRating : 10;
    push('ratingsContent',
      'Rating: ' + ratingMin.toFixed(1) + '-' + ratingMax.toFixed(1),
      { type: 'rating', min: ratingMin, max: ratingMax });
  }

  if (f.region && f.region.code) {
    push('regionLanguage',
      'Region: ' + f.region.name,
      { type: 'region', code: f.region.code, name: f.region.name });
  }

  if (f.awards) {
    var a = f.awards;
    if (a.festival) {
      push('awards', a.festival, { type: 'award-festival', festival: a.festival });
    }
    if (a.category) {
      push('awards', a.category, { type: 'award-category', category: a.category });
    }
    /* 2026-05-17: push level filter when the preset says "winner" or
       "nominee" — without this, getAwardsMatchingIds matched both
       winners and nominees (also: in-competition Cannes entries with
       won:false), inflating "Palme d'Or winners" to 419 etc. */
    if (a.level === 'winner' || a.level === 'nominee') {
      push('awards', a.level === 'winner' ? 'Winner' : 'Nominee',
        { type: 'award-level', level: a.level });
    }
    if (a.yearFrom || a.yearTo) {
      var from = a.yearFrom || 1950;
      var to = a.yearTo || 2025;
      push('awards',
        from === to ? 'Year: ' + from : 'Years: ' + from + '–' + to,
        { type: 'award-year-range', from: from, to: to });
    }
  }

  /* ============================================================
     EXTENDED PRESET KEYS — Added May 4, 2026
     Known limitation: source/studio/theme/language preset chips
     appear in the orbit sidebar with the right label and colour but
     do NOT yet contribute to the TMDB query unless the corresponding
     buildTMDBQueryFromFilters branch can resolve them (e.g. theme
     names that exist in KEYWORD_MAP, or studios with numeric ids).
     Extending buildTMDBQueryFromFilters is a follow-up task.
     ============================================================ */

  if (f.source) {
    push('basedOn', f.source, { type: 'source', name: f.source });
  }

  if (f.studio) {
    push('production', f.studio, { type: 'studio', name: f.studio });
  }

  if (f.theme) {
    push('themes', f.theme, { type: 'theme', name: f.theme });
  }

  if (typeof f.runtimeMax === 'number') {
    var runtimeLabel = f.runtimeMax <= 90 ? 'Under 90 min'
      : f.runtimeMax <= 120 ? 'Under 2 hours'
      : 'Custom runtime';
    push('timeEra', runtimeLabel,
      { type: 'runtime', max: f.runtimeMax });
    /* Re-key the entry so two presets with different runtimeMax don't
       collide on the same id. */
    entries[entries.length - 1].id = 'timeEra-runtime-' + f.runtimeMax;
  }

  if (f.language) {
    /* 2026-05-17: fixed field name from `language` → `code`. The query
       builder's regionLanguage case reads `filter.value.code`, so the
       preset path was emitting with_original_language=undefined and
       zeroing out result sets (e.g. "Indian parallel cinema"). */
    push('regionLanguage', 'Language: ' + f.language,
      { type: 'language', code: f.language });
    entries[entries.length - 1].id = 'regionLanguage-language-' + f.language;
  }

  if (typeof f.minVotes === 'number') {
    /* 2026-05-17: type was 'minVotes' but buildTMDBQueryFromFilters'
       ratingsContent case (line ~2336) reads `type === 'votes'`, so
       presets with minVotes were silently dropping their vote-count
       gate. Aligning with the manual Ratings-tab chip path which
       already uses { type: 'votes', min: N }. */
    push('ratingsContent',
      'Min votes: ' + f.minVotes.toLocaleString(),
      { type: 'votes', min: f.minVotes });
    entries[entries.length - 1].id = 'ratingsContent-votes-' + f.minVotes;
  }

  /* Phase 3 — preset → real TMDB keyword/collection filters.
     Filter ids match the Phase 2 dedupe pattern (themes-tmdbkw-<id>)
     and the Phase 1 collection chip pattern (universes-collection-<id>),
     so re-clicking a preset and then searching the same item in-tab
     won't add a duplicate. */
  if (f.keyword && f.keyword.id != null) {
    push('themes', f.keyword.name,
      { type: 'tmdb-keyword', id: f.keyword.id, name: f.keyword.name });
    entries[entries.length - 1].id = 'themes-tmdbkw-' + f.keyword.id;
  }

  if (f.collection && f.collection.id != null) {
    /* String id → registry lookup in ORBIT_KEYWORD_IDS (data/keyword-ids.js).
       The registry's `type` field drives behavior:
         • 'extended-collection' → filter with type:'extended-collection'
           (counter + launch resolve ids via the registry at execution time).
         • 'collection' (or default) → legacy numeric TMDB collection path. */
    if (typeof f.collection.id === 'string'
        && typeof ORBIT_KEYWORD_IDS !== 'undefined'
        && ORBIT_KEYWORD_IDS[f.collection.id]) {
      var regEntry = ORBIT_KEYWORD_IDS[f.collection.id];
      var extName = f.collection.name || regEntry.label;
      if (regEntry.type === 'extended-collection' && Array.isArray(regEntry.ids)) {
        push('universes', extName, {
          type: 'extended-collection',
          id: f.collection.id,    // slug — counter/launch look up ids in registry
          name: extName
        });
        entries[entries.length - 1].id = 'universes-extcoll-' + f.collection.id;
      } else if (typeof regEntry.id === 'number') {
        /* Registry entry resolves to a numeric TMDB collection id. */
        push('universes', extName, {
          type: 'collection',
          id: regEntry.id,
          name: extName,
          collections: [regEntry.id]
        });
        entries[entries.length - 1].id = 'universes-collection-' + regEntry.id;
      }
    } else if (typeof f.collection.id === 'number') {
      /* Numeric id passed directly in the preset (legacy / non-registry). */
      push('universes', f.collection.name, {
        type: 'collection',
        id: f.collection.id,
        name: f.collection.name,
        collections: [f.collection.id]   // back-compat with Universe Mode launch
      });
      entries[entries.length - 1].id = 'universes-collection-' + f.collection.id;
    }
  }

  /* universesKeyword (2026-05-16) — TMDB keyword that should flow
     into the live counter via with_keywords. Pushed to the universes
     section because buildTMDBQueryFromFilters' `case "universes"`
     already handles type="keyword" → adds to with_keywords. The
     `f.keyword` path above pushes to themes which is post-filter
     only; this is the path for franchise keywords like MCU
     (keyword 180547) where the live counter has to work via TMDB. */
  if (f.universesKeyword && f.universesKeyword.id != null) {
    push('universes', f.universesKeyword.name, {
      type: 'keyword',
      id: f.universesKeyword.id,
      name: f.universesKeyword.name
    });
    entries[entries.length - 1].id = 'universes-keyword-' + f.universesKeyword.id;
  }

  /* movieList (2026-05-16) — explicit list of TMDB movie IDs, used
     for franchises that TMDB doesn't model as a single collection
     (Wizarding World = HP + Fantastic Beasts; Star Wars = saga +
     Rogue One + Solo + Mando&Grogu; Fast & Furious + Hobbs & Shaw;
     Planet of the Apes original + Tim Burton + modern). Counter and
     launch handlers detect `type: 'movieList'` and use the ids
     directly (no /collection/{id} fetch needed for size). */
  if (f.movieList && Array.isArray(f.movieList.ids) && f.movieList.ids.length > 0) {
    var movieListIds = f.movieList.ids.slice();
    var movieListLabel = f.movieList.label || 'Movie list';
    push('universes', movieListLabel, {
      type: 'movieList',
      ids: movieListIds,
      name: movieListLabel
    });
    /* Stable id derived from a sorted prefix so chip dedupe across
       preset clicks works even though the ids array can be long. */
    entries[entries.length - 1].id = 'universes-movielist-' +
      movieListIds.slice().sort(function (a, b) { return a - b; }).slice(0, 5).join('-');
  }

  /* Multi-collection presets (2026-05-16) — used by expanded universes
     like "Alien vs. Predator Universe" that combine multiple TMDB
     collections into one chip/filter. Universe Mode launch (line ~1540)
     and the collection counter branch in fetchFilmCount both iterate
     value.collections, so they pick up all the IDs transparently. */
  if (Array.isArray(f.multiCollections) && f.multiCollections.length > 0) {
    var multiIds = f.multiCollections
      .filter(function (c) { return c && c.id != null; })
      .map(function (c) { return c.id; });
    if (multiIds.length > 0) {
      var combinedName = f.multiCollections
        .map(function (c) { return c.name; })
        .filter(Boolean)
        .join(' + ');
      push('universes', combinedName, {
        type: 'collection',
        id: multiIds[0],            // primary id (used by chip dedupe / labels)
        name: combinedName,
        collections: multiIds       // full set drives Universe Mode + counter
      });
      entries[entries.length - 1].id = 'universes-multicollection-' + multiIds.join('-');
    }
  }

  return entries;
}

function applyPreset(preset) {
  var entries = presetToStateFilters(preset);
  if (!entries.length) {
    console.warn('[Discover] Preset produced no filters:', preset.name);
    return;
  }

  state.filters = entries;
  state.genreLogic = preset.genreLogic || 'or';

  updateUIFromState();
  /* updateUIFromState calls the local renderFilterChips. The wrapped
     window.renderFilterChips also runs updateTabDots, so call it once
     more to refresh the tab dot indicators. */
  if (typeof window.renderFilterChips === 'function') window.renderFilterChips();

  /* Phase 2 (2026-06-01): track the post-apply state signature so the
     Save button stays hidden until the user diverges from this preset.
     window.__orbitStateSignature is defined in the Phase 2 IIFE at the
     end of this file; the guard tolerates load-order edge cases. */
  try {
    if (typeof window.__orbitStateSignature === 'function') {
      window.__orbitLastAppliedSig = window.__orbitStateSignature(state.filters, state.genreLogic);
    }
  } catch (e) { /* swallow — Save button just stays in its current state */ }
}

(function initPresets() {
  /* Increment visit count ONLY on page load — not on Shuffle clicks.
     The spotlight rotation reads this counter to gate appearance. */
  var visitCount = parseInt(localStorage.getItem('orbit_visit_count') || '0', 10);
  localStorage.setItem('orbit_visit_count', String(visitCount + 1));

  renderPresets(getActivePresets(getActivePresetCount()));

  var shuffleBtn = document.getElementById('discoverPresetShuffle');
  if (!shuffleBtn) return;
  shuffleBtn.addEventListener('click', function () {
    /* Shuffle never shows the spotlight; never bumps visit count. */
    renderPresets(pickEvergreens(getActivePresetCount()));
  });
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
  watch: { title: "Stream", builder: buildWatchContent },
  universes: { title: "Universes", builder: buildUniversesContent },
  awards: { title: "Awards", builder: buildAwardsContent }
};

let currentSectionKey = null;

// [FilterTabs — retired May 1, 2026]
// The .filter-grid card system has been replaced by .orbit-filter-tabs.
// Old listener kept null-safe in case the grid is ever reintroduced.
var _legacyFilterGrid = document.getElementById('filterGrid');
if (_legacyFilterGrid) {
  _legacyFilterGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.section-card[data-section]');
    if (card) openFocusCard(card.dataset.section);
  });
}

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

/* Rule 17: Black Hole exit. */
function triggerFocusOrbitClose() {
  if (!focusOverlay || focusOverlay.classList.contains('orbit-popup-closing')) return;
  if (focusCloseButton) focusCloseButton.classList.add('closing');
  focusOverlay.classList.add('orbit-popup-closing');
  const reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    if (focusCloseButton) focusCloseButton.classList.remove('closing');
    focusOverlay.classList.remove('orbit-popup-closing');
    closeFocusCard();
  }, reduced ? 200 : 600);
}

focusCloseButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  triggerFocusOrbitClose();
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

  /* Orbit ring is wrapped into renderFilterChips, but renderFilterChips
     is only called when hasFilters. On the empty branch the ring would
     never re-paint, so the empty-state caption stays hidden. Call
     directly to keep the ring + caption in sync with state. */
  if (typeof updateOrbitRing === 'function') {
    try { updateOrbitRing(); } catch (e) {}
  }
  if (typeof fetchFilmCount === 'function') {
    try { fetchFilmCount(); } catch (e) {}
  }
}

/* ============================================================
   CHIP LABEL FORMATTER — Added May 4, 2026
   Cleans up filter labels for the orbit sidebar. Removes redundant
   section prefixes where the value is self-explanatory; keeps a small
   dimmed prefix only where the value is ambiguous without context.
   Returns { prefix, text } — prefix is null for self-explanatory chips.
   ============================================================ */
function formatChipLabel(filter) {
  var label = (filter && filter.label) || '';
  var section = (filter && filter.section) || '';

  if (section === 'genres') {
    return { prefix: null, text: label.trim() };
  }

  if (section === 'awards') {
    if (label === 'Winner') return { prefix: null, text: 'Award winner' };
    if (label === 'Nominee') return { prefix: null, text: 'Award nominee' };
    return { prefix: null, text: label };
  }

  if (section === 'timeEra') {
    var cleaned = label.replace(/^Released\s+/i, '');
    cleaned = cleaned.replace(/Short Films?\s*\(<60min\)/i, 'Under 60 min');
    cleaned = cleaned.replace(/Standard\s*\(90-120min\)/i, '90–120 min');
    cleaned = cleaned.replace(/Long\s*\(2h\+\)/i, 'Over 2 hours');
    cleaned = cleaned.replace(/Epic\s*\(3h\+\)/i, 'Over 3 hours');
    cleaned = cleaned.replace(/New Releases?\s*\([^)]+\)/i, 'New releases');
    return { prefix: null, text: cleaned };
  }

  if (section === 'themes') {
    var themeVal = label.replace(/^Theme:\s*/i, '');
    return { prefix: 'theme', text: themeVal };
  }

  if (section === 'settingWhere' || section === 'settingWhen') {
    var settingVal = label.replace(/^Set in:\s*/i, '');
    return { prefix: null, text: settingVal };
  }

  if (section === 'ratingsContent') {
    if (/^Rating:/i.test(label)) {
      return { prefix: 'rating', text: label.replace(/^Rating:\s*/i, '').replace('-', '–') };
    }
    if (/^Min votes?:/i.test(label)) {
      return { prefix: 'min votes', text: label.replace(/^Min votes?:\s*/i, '') };
    }
    return { prefix: null, text: label };
  }

  if (section === 'regionLanguage') {
    if (/^Language:/i.test(label)) {
      return { prefix: 'language', text: label.replace(/^Language:\s*/i, '') };
    }
    return { prefix: null, text: label.replace(/^Production Region:\s*/i, '') };
  }

  if (section === 'basedOn' || section === 'universes') {
    var lower = label.toLowerCase();
    if (lower === 'sequel') return { prefix: null, text: 'A sequel' };
    if (lower === 'prequel') return { prefix: null, text: 'A prequel' };
    if (lower === 'spin-off') return { prefix: null, text: 'A spin-off' };
    return { prefix: null, text: label };
  }

  return { prefix: null, text: label };
}

function escapeChipText(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function renderFilterChips() {
  orbitFilters.innerHTML = "";
  const container = document.createElement("div");
  container.className = "filter-chips";

  state.filters.forEach((filter, index) => {
    const chip = document.createElement("div");
    chip.className = "filter-chip orbit-chip-v2";
    chip.dataset.section = filter.section;
    if (filter.section === "universes" && filter.value && filter.value.type) {
      chip.dataset.universeType = filter.value.type;
    }
    chip.style.setProperty('--chip-index', index);

    const formatted = formatChipLabel(filter);
    const safeText = escapeChipText(formatted.text);
    const prefixHTML = formatted.prefix
      ? '<span class="orbit-chip-prefix">' + escapeChipText(formatted.prefix) + '</span>'
      : '';
    const labelHTML = '<span class="orbit-chip-value">' + safeText + '</span>';

    chip.innerHTML =
      '<div class="orbit-chip-content">' + prefixHTML + labelHTML + '</div>';

    const remove = document.createElement("button");
    remove.className = "filter-chip-remove orbit-chip-remove";
    remove.textContent = "×";
    remove.setAttribute('aria-label', 'Remove ' + formatted.text);
    remove.dataset.filterId = filter.id;
    remove.onclick = () => {
      /* Black Hole exit (CLAUDE.md Rule 17 — extended to chips):
         the × spirals red and the chip fades/scales out. After the
         animation completes, mutate state and re-render. */
      if (chip.classList.contains('closing')) return;
      chip.classList.add('closing');
      var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var delay = reduced ? 200 : 600;
      setTimeout(function () {
        state.filters = state.filters.filter(f => f.id !== filter.id);
        updateUIFromState();
      }, delay);
    };
    chip.appendChild(remove);
    container.appendChild(chip);
  });
  orbitFilters.appendChild(container);
}

orbitPanelToggle.onclick = () => orbitPanel.classList.toggle("collapsed");
if (clearAllButton) {
  clearAllButton.onclick = () => {
    state.filters = [];
    state.genreLogic = 'or';
    state.regionLogic = 'or';
    try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
    updateUIFromState();
    /* Phase 3 (2026-06-01): mirror the same downstream-update path that
       applyPreset / chip-add use. updateUIFromState already calls the
       LOCAL renderFilterChips, but it does NOT trigger the WRAPPED
       window.renderFilterChips (which runs updateTabDots, updateOrbitRing,
       fetchFilmCount, and Phase 2's updateSaveButtonVisibility). Without
       this call the vertical-bar film count + ring stay stale until the
       next tab interaction does the work. */
    if (typeof window.renderFilterChips === 'function') window.renderFilterChips();
    /* Clear the last-applied signature so the cleared state reads as
       pristine — Save button stays hidden after clear. */
    try { window.__orbitLastAppliedSig = null; } catch (e) {}
  };
}

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
    if (saved.regionLogic === 'and' || saved.regionLogic === 'or') {
      state.regionLogic = saved.regionLogic;
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
    state.regionLogic = 'or';
    try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
    updateUIFromState();
    /* Phase 3 (2026-06-01): Reset was missing the wrapped chip-render
       call, so the vertical-bar count + orbit ring stayed stale until
       the next tab interaction. The WRAPPED window.renderFilterChips
       cascades to updateTabDots / updateOrbitRing / fetchFilmCount /
       Phase 2's updateSaveButtonVisibility — exactly what the tab-
       interaction path does. Adding the call here makes Reset
       complete in one go. */
    if (typeof window.renderFilterChips === 'function') window.renderFilterChips();
    /* Clear the last-applied signature so the cleared state reads as
       pristine — Save button stays hidden after Reset. */
    try { window.__orbitLastAppliedSig = null; } catch (e) {}
  });
}

/* ============================================================
   DISCOVERY EMPTY / ERROR STATE HELPER — Phase 1 (2026-05-27)
   Three-kind advisory inside #orbitPanel. Container markup lives
   in discover.html (#discoverEmptyState); styles in discover.css
   (.discover-empty-state + .is-zero / .is-network / .is-data).

   showDiscoverEmptyState(kind, context):
     kind    — 'zero' | 'network' | 'data'
     context — optional object:
       { headline, body, trace, primaryLabel, primaryAction,
         secondaryLabel, secondaryAction }
     Omitted fields fall back to per-kind defaults below.
     primaryAction / secondaryAction are functions; they run
     before the state is hidden.

   hideDiscoverEmptyState():
     Hides the container and clears its dynamic content.

   Close control (.orbit-close) is handled by orbit-close.js
   (Rule 17 Black Hole). We listen for 'orbit:close' on the
   container so we clear dynamic content alongside the auto-hide.

   Phase 2 (2026-05-28): wired into the launch handler, replacing
   all 10 window.alert() empty/error surfaces. The temporary
   __testEmptyState() console hook has been removed.
   ============================================================ */
var DISCOVER_EMPTY_DEFAULTS = {
  zero: {
    glyph: 'og-satellite',
    headline: 'No films found in this orbit',
    body: 'Your filter combination narrowed the universe to zero. Try removing or loosening a filter.',
    primaryLabel: 'Reset filters',
    secondaryLabel: null
  },
  network: {
    glyph: 'og-warning',
    headline: 'Connection lost',
    body: 'We couldn’t reach the film database. Check your connection and try again.',
    primaryLabel: 'Retry',
    secondaryLabel: null
  },
  data: {
    // og-warning is a v2 mask-based glyph; tints via `color` on the
    // glyph element. og-stats (v1) had cyan baked into its SVG and
    // couldn't be tinted purple — swapped here, not in static markup
    // (the markup glyph is overwritten by JS on every show()).
    glyph: 'og-warning',
    headline: 'Unexpected data',
    body: 'A filter returned a result we couldn’t parse. Try a different combination.',
    primaryLabel: 'Reset filters',
    secondaryLabel: null
  }
};

function showDiscoverEmptyState(kind, context) {
  var el = document.getElementById('discoverEmptyState');
  if (!el) return;
  context = context || {};
  var defaults = DISCOVER_EMPTY_DEFAULTS[kind] || DISCOVER_EMPTY_DEFAULTS.zero;

  // Kind modifier — strip the three is-* classes first.
  el.classList.remove('is-zero', 'is-network', 'is-data');
  el.classList.add('is-' + kind);

  // Glyph — keep the base .og class, swap the variant class.
  var glyphSpan = el.querySelector('[data-role="glyph"]');
  if (glyphSpan) glyphSpan.className = 'og ' + defaults.glyph;

  // Text content
  var headlineEl = el.querySelector('[data-role="headline"]');
  var bodyEl     = el.querySelector('[data-role="body"]');
  if (headlineEl) headlineEl.textContent = context.headline || defaults.headline;
  if (bodyEl)     bodyEl.textContent     = context.body     || defaults.body;

  // Trace (zero kind primarily; optional for others)
  var traceEl = el.querySelector('[data-role="trace"]');
  if (traceEl) {
    if (context.trace) {
      traceEl.textContent = context.trace;
      traceEl.hidden = false;
    } else {
      traceEl.textContent = '';
      traceEl.hidden = true;
    }
  }

  // Primary button
  var primaryEl = el.querySelector('[data-role="primary"]');
  if (primaryEl) {
    primaryEl.textContent = context.primaryLabel || defaults.primaryLabel;
    primaryEl.onclick = function () {
      if (typeof context.primaryAction === 'function') {
        try { context.primaryAction(); } catch (e) {}
      }
      hideDiscoverEmptyState();
    };
  }

  // Secondary button (optional)
  var secondaryEl = el.querySelector('[data-role="secondary"]');
  var secondaryLabel = context.secondaryLabel || defaults.secondaryLabel;
  if (secondaryEl) {
    if (secondaryLabel) {
      secondaryEl.textContent = secondaryLabel;
      secondaryEl.hidden = false;
      secondaryEl.onclick = function () {
        if (typeof context.secondaryAction === 'function') {
          try { context.secondaryAction(); } catch (e) {}
        }
        hideDiscoverEmptyState();
      };
    } else {
      secondaryEl.textContent = '';
      secondaryEl.hidden = true;
      secondaryEl.onclick = null;
    }
  }

  el.hidden = false;
}

function hideDiscoverEmptyState() {
  var el = document.getElementById('discoverEmptyState');
  if (!el) return;
  el.hidden = true;

  var headlineEl  = el.querySelector('[data-role="headline"]');
  var bodyEl      = el.querySelector('[data-role="body"]');
  var traceEl     = el.querySelector('[data-role="trace"]');
  var primaryEl   = el.querySelector('[data-role="primary"]');
  var secondaryEl = el.querySelector('[data-role="secondary"]');

  if (headlineEl)  headlineEl.textContent = '';
  if (bodyEl)      bodyEl.textContent     = '';
  if (traceEl)     { traceEl.textContent = ''; traceEl.hidden = true; }
  if (primaryEl)   { primaryEl.textContent = ''; primaryEl.onclick = null; }
  if (secondaryEl) { secondaryEl.textContent = ''; secondaryEl.hidden = true; secondaryEl.onclick = null; }
}

// orbit-close.js fires 'orbit:close' on the popup wrapper after the
// Black Hole animation; it also auto-sets popup.hidden = true. We
// piggy-back to clear dynamic content so a re-open starts clean.
(function () {
  var el = document.getElementById('discoverEmptyState');
  if (!el) return;
  el.addEventListener('orbit:close', function () {
    hideDiscoverEmptyState();
  });
})();

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

/* Rule 17: Black Hole exit for more-filters modal. */
function triggerMoreFiltersOrbitClose() {
  if (!moreFiltersOverlay || moreFiltersOverlay.classList.contains('orbit-popup-closing')) return;
  if (moreFiltersClose) moreFiltersClose.classList.add('closing');
  moreFiltersOverlay.classList.add('orbit-popup-closing');
  const reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    if (moreFiltersClose) moreFiltersClose.classList.remove('closing');
    moreFiltersOverlay.classList.remove('orbit-popup-closing');
    closeMoreFilters();
  }, reduced ? 200 : 600);
}

if (moreFiltersClose) {
  moreFiltersClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerMoreFiltersOrbitClose();
  });
}

// Backdrop click closes modal
if (moreFiltersOverlay) {
  moreFiltersOverlay.addEventListener('click', (e) => {
    if (e.target === moreFiltersOverlay) triggerMoreFiltersOrbitClose();
  });
}

// Tile clicks → close modal, open focus card for that section
// (More Filters modal removed May 1, 2026 — null-guard kept for safety.)
var moreFiltersGridEl = document.getElementById('moreFiltersGrid');
if (moreFiltersGridEl) {
  moreFiltersGridEl.addEventListener('click', (e) => {
    const tile = e.target.closest('.more-filter-tile');
    if (!tile) return;
    openedFromMore = true;
    closeMoreFilters();
    openFocusCard(tile.dataset.section);
  });
}

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
      genreLogic: state.genreLogic,
      regionLogic: state.regionLogic
    }));
  } catch (e) {}

  try {
    // Check for universe filters
    const universeFilters = state.filters.filter(f => f.section === "universes");
    const collectionIds = [];
    const movieListIdsSet = new Set();
    universeFilters.forEach(f => {
      if (!f.value) return;
      if (f.value.collections) {
        collectionIds.push(...f.value.collections);
      }
      /* movieList: ids embedded directly. */
      if (f.value.type === "movieList" && Array.isArray(f.value.ids)) {
        f.value.ids.forEach(id => movieListIdsSet.add(id));
      }
      /* extended-collection: ids resolved from ORBIT_KEYWORD_IDS registry. */
      if (f.value.type === "extended-collection"
          && typeof ORBIT_KEYWORD_IDS !== 'undefined'
          && ORBIT_KEYWORD_IDS[f.value.id]
          && Array.isArray(ORBIT_KEYWORD_IDS[f.value.id].ids)) {
        ORBIT_KEYWORD_IDS[f.value.id].ids.forEach(id => movieListIdsSet.add(id));
      }
    });

    if (collectionIds.length > 0 || movieListIdsSet.size > 0) {
      // UNIVERSE MODE: fetch from collections and/or explicit movie ID lists
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

      /* movieList (2026-05-16): batch-fetch movies from explicit ID
         lists for franchises that aren't a single TMDB collection.
         Normalize genres → genre_ids so the client-side filter loop
         below works the same as /collection/{id} responses. */
      if (movieListIdsSet.size > 0) {
        const movieListIdsArr = Array.from(movieListIdsSet);
        const BATCH_SIZE_ML = 8;
        for (let i = 0; i < movieListIdsArr.length; i += BATCH_SIZE_ML) {
          const batch = movieListIdsArr.slice(i, i + BATCH_SIZE_ML);
          const results = await Promise.all(batch.map(id =>
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null)
          ));
          results.forEach(m => {
            if (!m || !m.id || seenIds.has(m.id)) return;
            if (Array.isArray(m.genres) && !m.genre_ids) {
              m.genre_ids = m.genres.map(g => g.id);
            }
            seenIds.add(m.id);
            allMovies.push(m);
          });
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
        showDiscoverEmptyState('zero', {
          body: 'No films in the selected universe(s) match your other filters. Try removing a non-universe filter.',
          trace: `${allMovies.length} → 0`,
          primaryLabel: 'Remove non-universe filters',
          primaryAction: function () {
            state.filters = state.filters.filter(function (f) { return f.section === 'universes'; });
            updateUIFromState();
          }
        });
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
        showDiscoverEmptyState('zero', {
          body: 'That award selection doesn’t match any films. Try removing the last award filter.',
          trace: null,
          primaryLabel: 'Remove last award filter',
          primaryAction: function () {
            var awardsFilters = state.filters.filter(function (f) { return f.section === 'awards'; });
            if (awardsFilters.length) {
              var last = awardsFilters[awardsFilters.length - 1];
              state.filters = state.filters.filter(function (f) { return f !== last; });
              updateUIFromState();
            }
          }
        });
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
        const awPreSettings = allMovies.length;
        allMovies = applySettingsFilters(allMovies, state.filters, settingsData);
        console.log(`[Orbit] Awards + settings post-filter: → ${allMovies.length} movies`);
        if (allMovies.length === 0) {
          hyperspace.hidden = true;
          showDiscoverEmptyState('zero', {
            body: 'No award-winning films match your Setting & Theme filters. Try removing them.',
            trace: `${awPreSettings} → 0`,
            primaryLabel: 'Remove Setting & Theme filters',
            primaryAction: function () {
              state.filters = state.filters.filter(function (f) { return !SETTINGS_SECTIONS.includes(f.section); });
              updateUIFromState();
            }
          });
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

    } else if (shouldUseAwardsAsSource(state.filters)) {
      /* ============================================================
         MIXED AWARDS MODE — Added 2026-05-19
         Awards + other filters (genre, decade, rating, etc.). Awards
         drive the source set: fetch the matching films from TMDB by
         id, then apply non-awards filters client-side. Fixes the
         popularity-intersection bug where the prior NORMAL DISCOVER
         path would fetch the top 500 popular docs and intersect with
         ~26 Oscar Best Doc winners, missing most of them.
         Routes here when getAwardsMatchingIds returns ≤500 ids.
         ============================================================ */
      const hyperspace = document.getElementById('hyperspaceOverlay');
      hyperspace.hidden = false;

      const matchingIds = getAwardsMatchingIds(state.filters);
      console.log(`[Orbit] Mixed awards mode: ${matchingIds.length} award ids → batch fetch`);

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

      /* /movie/{id} returns genres:[{id,name},...]; the client-side
         filter expects genre_ids. Same normalization as AWARDS-ONLY. */
      allMovies = allMovies.map(m => ({
        ...m,
        genre_ids: m.genre_ids || (m.genres ? m.genres.map(g => g.id) : [])
      }));

      /* Apply non-awards filters (genre, decade, year, rating)
         client-side. applyClientSideCollectionFilters already skips
         awards + universes sections, so it's safe to pass the full
         state.filters. */
      allMovies = applyClientSideCollectionFilters(allMovies, state.filters);
      console.log(`[Orbit] Mixed awards mode after client-side filters: ${allMovies.length} movies`);
      const mxAfterClient = allMovies.length;

      // Settings-based post-filter (location, era, themes, based-on) — mirrors AWARDS-ONLY
      const settingsData = await getSettingsData();
      if (state.filters.some(f => SETTINGS_SECTIONS.includes(f.section)) && settingsData) {
        allMovies = applySettingsFilters(allMovies, state.filters, settingsData);
        console.log(`[Orbit] Mixed awards + settings post-filter: → ${allMovies.length} movies`);
      }

      if (allMovies.length === 0) {
        hyperspace.hidden = true;
        showDiscoverEmptyState('zero', {
          body: 'No award-winning films match your other filters. Try removing your Setting & Theme filters.',
          trace: `${matchingIds.length} → ${mxAfterClient} → 0`,
          primaryLabel: 'Remove Setting & Theme filters',
          primaryAction: function () {
            state.filters = state.filters.filter(function (f) { return !SETTINGS_SECTIONS.includes(f.section); });
            updateUIFromState();
          }
        });
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
        showDiscoverEmptyState('data', {
          body: 'Settings data couldn’t be loaded. Retry, or add a genre or person filter alongside your selections.',
          trace: null,
          primaryLabel: 'Retry',
          primaryAction: function () { launchCard.click(); },
          secondaryLabel: 'Add a different filter'
        });
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
        showDiscoverEmptyState('zero', {
          body: 'No films match your Setting & Theme filters. Try clearing them for broader results.',
          trace: `${candidateMovies.length} → 0`,
          primaryLabel: 'Clear all filters',
          primaryAction: function () {
            state.filters = [];
            state.genreLogic = 'or';
            state.regionLogic = 'or';
            try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
            updateUIFromState();
          }
        });
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
        showDiscoverEmptyState('network', {
          primaryLabel: 'Retry',
          primaryAction: function () { launchCard.click(); }
        });
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
        showDiscoverEmptyState('network', {
          primaryLabel: 'Retry',
          primaryAction: function () { launchCard.click(); }
        });
        return;
      }
      const previewData = await previewResponse.json();

      const MAX_PAGES = 25;
      const totalAvailable = previewData.total_pages || 0;
      const totalMovies = previewData.total_results || 0;

      console.log(`Preview: ${totalMovies} movies across ${totalAvailable} pages`);

      /* Zero-results guidance on launch (2026-06-06): a normal-branch launch
         that previews 0 results stays on the discover page and surfaces the
         drop-one guidance ALREADY EXPANDED, instead of navigating to a bare
         results.html empty state. Runs AFTER totalMovies is known but BEFORE
         the >MAX_PAGES confirm and BEFORE the hyperspace overlay is shown, so
         there's no hyperspace flash and no navigation. The settings-post-
         filter zero sub-case (after applySettingsFilters, below) keeps its own
         showDiscoverEmptyState handling — drop-one can't help no-op settings
         filters, and that count isn't 0 here (settings are query no-ops). */
      if (totalMovies === 0) {
        var hs = document.getElementById('hyperspaceOverlay');
        if (hs) hs.hidden = true;
        showZeroGuidanceAffordance(state.filters, queryParams, true);
        var ozg = document.getElementById('orbitZeroGuidance');
        if (ozg && typeof ozg.scrollIntoView === 'function') {
          ozg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;   // do NOT store empty movies / navigate to results.html
      }

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

      /* Dedupe across pages by id. TMDB orders /discover/movie by
         popularity.desc and recomputes popularity in near-real-time, so
         a movie on the boundary between two pages can shift and land on
         both — produces duplicate tiles on the results page. */
      let allMovies = [];
      const seenIds = new Set();
      let currentPage = 1;

      function addUniqueResults(results) {
        results.forEach(m => {
          if (m && m.id != null && !seenIds.has(m.id)) {
            seenIds.add(m.id);
            allMovies.push(m);
          }
        });
      }

      if (previewData.results && previewData.results.length > 0) {
        addUniqueResults(previewData.results);
        const pagesToFetch = Math.min(totalAvailable, MAX_PAGES);

        for (currentPage = 2; currentPage <= pagesToFetch; currentPage++) {
          const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}&page=${currentPage}`;
          const response = await fetch(url);
          if (!response.ok) break;
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            addUniqueResults(data.results);
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
      /* 2026-05-23: exclude tmdb-keyword filters from the settings-mode
         gate. tmdb-keyword chips live in the 'themes' section so they can
         share the chip styling, but they're resolved by TMDB's
         with_keywords param (not the local seed JSON). Treating them as
         settings filters caused the counter (no seed exclusion) to
         diverge from the launch (seed exclusion shrinks results). */
      const hasSettingsFilters = state.filters.some(f =>
        SETTINGS_SECTIONS.includes(f.section) && f.value?.type !== 'tmdb-keyword'
      );
      let finalMovies = allMovies;
      if (hasSettingsFilters && settingsData) {
        finalMovies = applySettingsFilters(allMovies, state.filters, settingsData);
        console.log(`[Orbit] Post-filter: ${allMovies.length} → ${finalMovies.length} movies`);

        if (finalMovies.length === 0) {
          hyperspace.hidden = true;
          showDiscoverEmptyState('zero', {
            body: 'No films match your Setting & Theme filters. Try removing them for broader results.',
            trace: `${allMovies.length} → 0`,
            primaryLabel: 'Remove Setting & Theme filters',
            primaryAction: function () {
              state.filters = state.filters.filter(function (f) { return !SETTINGS_SECTIONS.includes(f.section); });
              updateUIFromState();
            }
          });
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
    showDiscoverEmptyState('network', {
      primaryLabel: 'Retry',
      primaryAction: function () { launchCard.click(); }
    });
  }
});

/* shouldUseAwardsAsSource (2026-05-19) — Fires when awards filters are
   mixed with other TMDB filters (genre, decade, rating, etc.) AND the
   award-matching set is small enough to fetch directly from TMDB by id.
   Routes the launch handler through MIXED AWARDS MODE so the awards
   drive the source list, then non-awards filters apply client-side.
   Without this, NORMAL DISCOVER MODE fetches the top 500 popular films
   for the genre and intersects with the award set — for sparse award
   sets (e.g. 26 Oscar Best Doc winners), most winners aren't in the
   top 500 by current popularity and get dropped. */
function shouldUseAwardsAsSource(filters) {
  const hasAwards = filters.some(f => f.section === "awards" && f.value);
  if (!hasAwards) return false;
  const dataReady = (window.AWARDS_V1_DATA && Array.isArray(window.AWARDS_V1_DATA.awards))
    || typeof AWARDS_DATABASE !== "undefined";
  if (!dataReady) return false;
  /* Skip if pure-awards (already handled by AWARDS-ONLY branch). */
  if (hasAwardsOnlyFilters(filters)) return false;
  const ids = getAwardsMatchingIds(filters);
  return ids.length > 0 && ids.length <= 500;
}

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

/* Mirrors hasAwardsOnlyFilters for collections. Used as a hint; the
   counter branch fires whenever ANY collection filter is present
   regardless of other filters now, and applies non-universe filters
   client-side via applyClientSideCollectionFilters below. Kept for
   any future code that needs the "pure collection" check. */
function hasCollectionOnlyFilters(filters) {
  var collectionFilters = filters.filter(function (f) {
    return f.section === "universes" && f.value && f.value.type === "collection";
  });
  if (collectionFilters.length === 0) return false;
  var otherFilters = filters.filter(function (f) {
    if (f.section === "universes") return false;
    if (f.section === "awards") return false;
    return true;
  });
  return otherFilters.length === 0;
}

/* Apply non-universe, non-awards filters to a list of movies fetched
   from one or more TMDB /collection/{id} endpoints. Mirrors the
   launch handler's client-side filter logic (lines ~1623-1650) so
   the live counter and launch return the same count for mixed
   collection + genre/decade/year/rating filter combinations. */
function applyClientSideCollectionFilters(movies, filters) {
  var filtered = movies;
  filters.forEach(function (f) {
    if (!f.value) return;
    if (f.section === "universes" || f.section === "awards") return;
    if (f.value.type === "genre") {
      var genreId = (typeof GENRE_MAP !== "undefined") ? GENRE_MAP[f.value.name] : null;
      if (genreId != null) {
        filtered = filtered.filter(function (m) {
          return m && m.genre_ids && m.genre_ids.indexOf(genreId) !== -1;
        });
      }
    } else if (f.value.type === "decade" && f.value.subType === "release") {
      filtered = filtered.filter(function (m) {
        var year = m && m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 0;
        return year >= f.value.decade && year <= (parseInt(f.value.decade, 10) + 9);
      });
    } else if (f.value.type === "year") {
      filtered = filtered.filter(function (m) {
        var year = m && m.release_date ? parseInt(m.release_date.split("-")[0], 10) : 0;
        return year === f.value.year;
      });
    } else if (f.value.type === "rating") {
      filtered = filtered.filter(function (m) {
        var avg = (m && m.vote_average) || 0;
        return avg >= (f.value.min || 0) && avg <= (f.value.max || 10);
      });
    }
    /* Other filter types (runtime, themes, settings, etc.) need full
       movie data not present in /collection/{id} responses — they're
       ignored here, same as the launch path. */
  });
  return filtered;
}

/* Category matching: supports parent categories like "Silver Lion"
   matching subcategories like "Silver Lion (Director)", "Silver Lion (Grand Jury)" */
function categoryMatchesAward(selectedCategories, awardCategory) {
  return selectedCategories.some(c =>
    awardCategory === c || awardCategory.startsWith(c + " (")
  );
}

/* ============================================================
   AWARDS v1 HELPERS — Added 2026-05-17 (Phase 2)
   v1 data covers 2000-2026 with 98.4% TMDB resolution and includes
   `historical_names` on each category (resolves renames like
   "Best Foreign Language Film" → "Best International Feature Film").
   Loaded async from data/awards-data-v1.json into window.AWARDS_V1_DATA.
   ============================================================ */

/* Matches a preset's category string against a v1 category def by
   checking display_name AND every historical_name. Each candidate
   name is matched with the same semantics as the legacy
   categoryMatchesAward (exact OR `startsWith(c + " (")` for parent
   categories like "Silver Lion"). */
function categoryMatchesV1(requestedCategories, categoryDef) {
  if (!categoryDef) return false;
  var candidates = [];
  if (categoryDef.display_name) candidates.push(categoryDef.display_name);
  if (Array.isArray(categoryDef.historical_names)) {
    categoryDef.historical_names.forEach(function (h) {
      if (h && h.name) candidates.push(h.name);
    });
  }
  return requestedCategories.some(function (req) {
    return candidates.some(function (name) {
      return name === req || name.startsWith(req + " (");
    });
  });
}

/* Returns the v1 award rows that match the given award filters
   (already-extracted, section==='awards'). Returns [] if v1 data
   isn't loaded yet — caller falls back to legacy. */
function getV1MatchingAwardRows(awardFilters) {
  var v1 = window.AWARDS_V1_DATA;
  if (!v1 || !Array.isArray(v1.awards)) return [];

  var festivals = [];
  var categories = [];
  var levels = [];
  var yearRanges = [];

  awardFilters.forEach(function (f) {
    if (!f.value) return;
    if (f.value.type === "award-festival")    festivals.push(f.value.festival);
    else if (f.value.type === "award-category")    categories.push(f.value.category);
    else if (f.value.type === "award-level")       levels.push(f.value.level);
    else if (f.value.type === "award-year-range")  yearRanges.push({ from: f.value.from, to: f.value.to });
  });

  /* Build O(1) lookups; v1 has 6 festivals and ~96 categories. */
  var festivalsBySlug = {};
  (v1.festivals || []).forEach(function (f) { festivalsBySlug[f.id] = f; });
  var categoriesById = {};
  (v1.categories || []).forEach(function (c) { categoriesById[c.id] = c; });

  return v1.awards.filter(function (award) {
    /* Festival check: preset uses short_name ('Oscar', 'Cannes', etc.).
       v1's display_name is the long form ('Festival de Cannes'), so
       match against festival.short_name. */
    if (festivals.length > 0) {
      var festSlug = (award.ceremony_id || "").split(".")[0];
      var festDef = festivalsBySlug[festSlug];
      if (!festDef || festivals.indexOf(festDef.short_name) === -1) return false;
    }

    /* Category check: includes historical_names (e.g. "Best Foreign
       Language Film" → "Best International Feature Film"). */
    if (categories.length > 0) {
      var catDef = categoriesById[award.category_id];
      if (!catDef) return false;
      if (!categoryMatchesV1(categories, catDef)) return false;
    }

    /* Level check: v1 uses result: 'won' | 'nominated'. */
    if (levels.length === 1) {
      var won = award.result === "won";
      if (levels[0] === "winner" && !won) return false;
      if (levels[0] === "nominee" && won) return false;
    }

    /* Year range. */
    if (yearRanges.length > 0) {
      var matches = yearRanges.some(function (r) {
        return award.year >= r.from && award.year <= r.to;
      });
      if (!matches) return false;
    }

    return true;
  });
}

/* ============================================================
   getAwardsMatchingIds — hybrid (v1 + legacy)
   Signature preserved (filters = full state.filters array) so all
   existing callers keep working.
   v1 path covers 2000+. Legacy is consulted for pre-2000 years OR
   as a full fallback if v1 hasn't loaded yet.
   ============================================================ */
function getAwardsMatchingIds(filters) {
  const awardFilters = filters.filter(f => f.section === "awards" && f.value);
  if (awardFilters.length === 0) return [];

  const yearRanges = awardFilters
    .filter(f => f.value.type === "award-year-range")
    .map(f => ({ from: f.value.from, to: f.value.to }));

  const v1Loaded = !!(window.AWARDS_V1_DATA && Array.isArray(window.AWARDS_V1_DATA.awards));
  const v1ShouldFire = v1Loaded && (yearRanges.length === 0 || yearRanges.some(r => r.to >= 2000));
  /* Legacy fires when v1 hasn't loaded (full fallback), or when the
     query genuinely needs pre-2000 years that v1 doesn't cover. */
  const legacyShouldFire = !v1Loaded || yearRanges.length === 0 || yearRanges.some(r => r.from < 2000);

  const matchingIds = new Set();

  if (v1ShouldFire) {
    getV1MatchingAwardRows(awardFilters).forEach(function (row) {
      if (row.film_tmdb_id != null) matchingIds.add(row.film_tmdb_id);
    });
  }

  if (legacyShouldFire && typeof AWARDS_DATABASE !== "undefined") {
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
      if (match) matchingIds.add(parseInt(id));
    }
  }

  return Array.from(matchingIds);
}

/* filterByAwards — now delegates to getAwardsMatchingIds. Signature
   preserved (filters = full state.filters array). Returns movies
   whose id is in the matching set. Behaviorally equivalent to the
   prior per-movie iteration but uses the v1+legacy hybrid set. */
function filterByAwards(movies, filters) {
  const awardFilters = filters.filter(f => f.section === "awards" && f.value);
  if (awardFilters.length === 0) return movies;
  /* If neither data source is available, leave movies unfiltered
     (safer than dropping everything). */
  if (!(window.AWARDS_V1_DATA && Array.isArray(window.AWARDS_V1_DATA.awards))
      && typeof AWARDS_DATABASE === "undefined") {
    return movies;
  }
  const matchingIds = new Set(getAwardsMatchingIds(filters));
  return movies.filter(function (movie) { return matchingIds.has(movie.id); });
}

function buildTMDBQueryFromFilters(filters) {
  // Defensive: tolerate undefined/null/non-array callers so the
  // query engine returns a base query instead of throwing.
  if (!Array.isArray(filters)) filters = [];

  const params = new URLSearchParams();

  params.append("sort_by", state.sortBy || "popularity.desc");   /* Phase 1b-ii: global sort-by control (1b-i) drives this; defaults to popularity.desc */
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
            const end = parseInt(start, 10) + 9;
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
        // Collection chips → handled by Universe Mode launch flow
        // (reads f.value.collections). Keyword chips → with_keywords here.
        if (filter.value.type === "keyword" && filter.value.id) {
          const existing = params.get("with_keywords");
          params.set(
            "with_keywords",
            existing ? `${existing}|${filter.value.id}` : String(filter.value.id)
          );
        }
        break;

      case "awards":
        // No-op placeholder
        break;
        
      case "regionLanguage":
        if (filter.value.type === "region") {
          // Accumulate multiple regions; separator depends on regionLogic.
          // "|" = OR (either country), "," = AND (co-production / both countries).
          const regionSep = state.regionLogic === "or" ? "|" : ",";
          const existingRegions = params.get("with_origin_country");
          params.set(
            "with_origin_country",
            existingRegions ? `${existingRegions}${regionSep}${filter.value.code}` : filter.value.code
          );
        } else if (filter.value.type === "language") {
          // Language stays last-write-wins — single original_language per query.
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

  // Phase 2 — TMDB keyword search results (themes / genres tabs).
  // Carry real TMDB IDs in filter.value.id and OR-merge with anything
  // the in-loop universe-keyword case already wrote. Runs before the
  // genre-keyword merge so that block sees existing values and degrades
  // to a pipe (OR) merge — avoids mixed comma/pipe separators that
  // TMDB parses ambiguously.
  const tmdbKwFilters = filters.filter(function (f) {
    return f && f.value && f.value.type === "tmdb-keyword" && f.value.id != null;
  });
  if (tmdbKwFilters.length > 0) {
    const newIds = tmdbKwFilters.map(function (f) { return f.value.id; }).join("|");
    const existing = params.get("with_keywords");
    params.set("with_keywords", existing ? existing + "|" + newIds : newIds);
  }

  // Merge accumulated genre keywords (AND, comma).
  // If universe-keyword chips already wrote pipe-separated keywords,
  // degrade to OR (pipe) to avoid losing filters from either source.
  if (genreKeywordIds.length > 0) {
    const existing = params.get("with_keywords");
    if (existing) {
      params.set("with_keywords", existing + "|" + genreKeywordIds.join("|"));
    } else {
      params.set("with_keywords", genreKeywordIds.join(","));
    }
  }

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

  /* 2026-05-23: mirror the launch-handler gate — tmdb-keyword chips
     ride in the 'themes' section but are resolved by TMDB, not seed. */
  const settingsFilters = filters.filter(f =>
    SETTINGS_SECTIONS.includes(f.section) && f.value?.type !== 'tmdb-keyword'
  );
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

function makeChip(label, section, value, opts) {
  /* Phase 2b: optional 4th arg opts.component opts a chip INTO the
     .disco-chip component (toggles "on"). Absent/false = legacy behaviour
     (className "chip", toggles "active") — byte-identical for all existing
     callers. Migrated per-tab; Era is the first consumer. */
  const useComponent = !!(opts && opts.component);
  const activeClass = useComponent ? "on" : "active";
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = useComponent ? "disco-chip" : "chip";
  chip.textContent = label;
  chip.dataset.value = JSON.stringify(value);
  chip.addEventListener("click", () => {
    chip.classList.toggle(activeClass);
  });
  return chip;
}

// =============================================
// 1. PEOPLE SECTION
// =============================================

/* ============================================================
   FILMMAKER PROFILE — Added May 1, 2026
   Wraps the existing People panel UI in a two-tab structure:
   "Search by name" (existing behaviour, unchanged) and
   "Describe the filmmaker" (new profile builder shell).

   Phase 1 stores the selected profile in currentFilmmakerProfile
   and logs to console on Add to orbit. Result-side filtering is
   deferred to a later phase.
   ============================================================ */
let currentFilmmakerProfile = {
  role: null,
  nationality: null,
  gender: null,
  career_stage: null,
  awards: []
};

function buildFilmmakerProfileContent(root) {
  const hint = document.createElement('p');
  hint.className = 'filmmaker-profile-hint';
  hint.textContent = 'Build a filmmaker profile. ORBIT finds films matching your criteria.';
  root.appendChild(hint);

  const ROLE_OPTS = [
    { v: 'director', l: 'Director' }, { v: 'writer', l: 'Writer' },
    { v: 'lead_actor', l: 'Lead actor' }, { v: 'composer', l: 'Composer' },
    { v: 'cinematographer', l: 'Cinematographer' },
    { v: 'producer', l: 'Producer' },
    { v: 'editor', l: 'Editor' }
  ];
  const NATIONALITY_OPTS = [
    { v: 'US', l: 'American' }, { v: 'FR', l: 'French' }, { v: 'GB', l: 'British' },
    { v: 'KR', l: 'Korean' }, { v: 'JP', l: 'Japanese' }, { v: 'IT', l: 'Italian' },
    { v: 'MX', l: 'Mexican' }, { v: 'CN', l: 'Chinese' }, { v: 'IR', l: 'Iranian' },
    { v: 'IN', l: 'Indian' }, { v: 'ES', l: 'Spanish' }, { v: 'BR', l: 'Brazilian' },
    { v: 'AU', l: 'Australian' }
  ];
  const GENDER_OPTS = [
    { v: 'any', l: 'Any' }, { v: 'female', l: 'Female' }, { v: 'male', l: 'Male' }
  ];
  const CAREER_OPTS = [
    { v: 'debut', l: 'Debut film' }, { v: 'established', l: 'Established' }, { v: 'veteran', l: 'Veteran' }
  ];
  const AWARDS_OPTS = [
    { v: 'oscar-winner',  l: 'Oscar winner' },
    { v: 'oscar-nominee', l: 'Oscar nominee' },
    { v: 'palme-winner',  l: "Palme d'Or winner" },
    { v: 'bafta-winner',  l: 'BAFTA winner' },
    { v: 'venice-winner', l: 'Venice winner' },
    { v: 'berlin-winner', l: 'Berlin winner' }
  ];

  function makeLabel(text, extraClass) {
    const el = document.createElement('div');
    el.className = 'focus-section-label' + (extraClass ? ' ' + extraClass : '');
    el.textContent = text;
    return el;
  }

  function makeSingleSelectGroup(fieldKey, opts) {
    const group = document.createElement('div');
    group.className = 'chip-group';
    group.dataset.profileField = fieldKey;
    opts.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filmmaker-opt chip';
      btn.dataset.value = opt.v;
      btn.textContent = opt.l;
      btn.addEventListener('click', function () {
        group.querySelectorAll('.filmmaker-opt').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        currentFilmmakerProfile[fieldKey] = opt.v;
      });
      group.appendChild(btn);
    });
    return group;
  }

  // TODO: awards pedigree cross-referencing requires
  // PERSON_AWARD_LOOKUP to be loaded on this page — currently tracked in
  // state only. Full filtering implemented when awards data pipeline extends
  // to discover.html.
  function makeAwardsGroup() {
    const group = document.createElement('div');
    group.className = 'chip-group';
    group.dataset.profileField = 'awards';
    AWARDS_OPTS.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filmmaker-opt chip';
      btn.dataset.value = opt.v;
      btn.textContent = opt.l;
      btn.addEventListener('click', function () {
        const idx = currentFilmmakerProfile.awards.indexOf(opt.v);
        if (idx === -1) {
          currentFilmmakerProfile.awards.push(opt.v);
          btn.classList.add('filmmaker-opt--award-active');
        } else {
          currentFilmmakerProfile.awards.splice(idx, 1);
          btn.classList.remove('filmmaker-opt--award-active');
        }
      });
      group.appendChild(btn);
    });
    return group;
  }

  const grid = document.createElement('div');
  grid.className = 'oft-filmmaker-grid';

  const colLeft = document.createElement('div');
  colLeft.className = 'oft-filmmaker-col';
  colLeft.appendChild(makeLabel('ROLE'));
  colLeft.appendChild(makeSingleSelectGroup('role', ROLE_OPTS));
  colLeft.appendChild(makeLabel('GENDER'));
  colLeft.appendChild(makeSingleSelectGroup('gender', GENDER_OPTS));
  colLeft.appendChild(makeLabel('CAREER STAGE'));
  colLeft.appendChild(makeSingleSelectGroup('career_stage', CAREER_OPTS));
  grid.appendChild(colLeft);

  const colRight = document.createElement('div');
  colRight.className = 'oft-filmmaker-col';
  colRight.appendChild(makeLabel('NATIONALITY'));
  colRight.appendChild(makeSingleSelectGroup('nationality', NATIONALITY_OPTS));
  colRight.appendChild(makeLabel('AWARDS PEDIGREE', 'filmmaker-awards-label'));
  colRight.appendChild(makeAwardsGroup());
  colRight.appendChild(makeLabel('COMING SOON', 'filmmaker-soon-label'));
  const soonItems = document.createElement('div');
  soonItems.className = 'filmmaker-soon-items';
  ['Era of peak activity', 'Genre specialty', 'Still active / classic era'].forEach(function (text) {
    const item = document.createElement('span');
    item.className = 'filmmaker-soon-item';
    item.textContent = text;
    soonItems.appendChild(item);
  });
  colRight.appendChild(soonItems);
  grid.appendChild(colRight);

  root.appendChild(grid);

  const note = document.createElement('p');
  note.className = 'filmmaker-profile-note';
  note.textContent = '✦ Filmmaker profile filtering is in development. Your profile will be saved to your orbit — results will refine as this feature matures.';
  root.appendChild(note);
}

function buildPeopleContent(root) {
  /* Tab bar */
  const tabBar = document.createElement('div');
  tabBar.className = 'people-panel-tabs';
  const searchTabBtn = document.createElement('button');
  searchTabBtn.type = 'button';
  searchTabBtn.className = 'people-tab people-tab--active';
  searchTabBtn.dataset.tab = 'search';
  searchTabBtn.textContent = 'Search by name';
  const profileTabBtn = document.createElement('button');
  profileTabBtn.type = 'button';
  profileTabBtn.className = 'people-tab';
  profileTabBtn.dataset.tab = 'profile';
  profileTabBtn.textContent = 'Describe the filmmaker';
  tabBar.appendChild(searchTabBtn);
  tabBar.appendChild(profileTabBtn);
  root.appendChild(tabBar);

  /* Tab content containers */
  const searchTab = document.createElement('div');
  searchTab.className = 'people-tab-content';
  searchTab.dataset.tabContent = 'search';
  const profileTab = document.createElement('div');
  profileTab.className = 'people-tab-content people-tab-content--hidden';
  profileTab.dataset.tabContent = 'profile';
  root.appendChild(searchTab);
  root.appendChild(profileTab);

  /* Reset profile state for each panel open */
  currentFilmmakerProfile = { role: null, nationality: null, gender: null, career_stage: null, awards: [] };

  buildPeopleSearchContent(searchTab);
  buildFilmmakerProfileContent(profileTab);

  function activate(which) {
    [searchTabBtn, profileTabBtn].forEach(function (b) { b.classList.remove('people-tab--active'); });
    [searchTab, profileTab].forEach(function (c) { c.classList.add('people-tab-content--hidden'); });
    if (which === 'profile') {
      profileTabBtn.classList.add('people-tab--active');
      profileTab.classList.remove('people-tab-content--hidden');
    } else {
      searchTabBtn.classList.add('people-tab--active');
      searchTab.classList.remove('people-tab-content--hidden');
    }
  }
  searchTabBtn.addEventListener('click', function () { activate('search'); });
  profileTabBtn.addEventListener('click', function () { activate('profile'); });
}

function buildPeopleSearchContent(root) {
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

  /* ============================================================
     RECENTLY SEARCHED (or fallback POPULAR IN ORBIT) — Added May 4, 2026
     Reads orbit_people_encountered (encounter-service.js shape:
     { version: 1, people: { id: { name, profile_path,
       encounter_count, last_encountered, sources } } }).
     Sorted by last_encountered desc, top 8. Falls back to a popular
     list when the user has no encounter history yet.
     Clicking a chip pre-fills the search input — does not commit a
     filter directly.
     ============================================================ */
  const recentSection = document.createElement("div");
  recentSection.className = "oft-people-recent-section";
  let recentPeople = [];
  let recentLabel = 'POPULAR IN ORBIT';
  try {
    const raw = localStorage.getItem('orbit_people_encountered');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && parsed.people) {
        const entries = Object.entries(parsed.people)
          .map(([id, p]) => ({ id: id, name: p.name, last: p.last_encountered || '' }))
          .filter(p => p.name)
          .sort((a, b) => (b.last || '').localeCompare(a.last || ''))
          .slice(0, 8);
        if (entries.length > 0) {
          recentPeople = entries;
          recentLabel = 'RECENTLY SEARCHED';
        }
      }
    }
  } catch (e) { /* corrupted — fall through to popular */ }

  if (recentPeople.length === 0) {
    recentPeople = [
      { id: '6193', name: 'Leonardo DiCaprio' },
      { id: '1892', name: 'Martin Scorsese' },
      { id: '138',  name: 'Quentin Tarantino' },
      { id: '1654', name: 'Cate Blanchett' },
      { id: '2037', name: 'Meryl Streep' },
      { id: '3896', name: 'Christopher Nolan' },
      { id: '380',  name: 'Robert De Niro' },
      { id: '1267', name: 'Audrey Hepburn' }
    ];
  }

  const recentLabelEl = document.createElement("div");
  recentLabelEl.className = "focus-section-label";
  recentLabelEl.textContent = recentLabel;
  recentSection.appendChild(recentLabelEl);

  const recentGroup = document.createElement("div");
  recentGroup.className = "chip-group oft-people-recent";
  recentPeople.forEach(p => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip oft-recent-person-chip";
    chip.dataset.personId = p.id;
    chip.dataset.personName = p.name;
    chip.textContent = p.name;
    recentGroup.appendChild(chip);
  });
  recentSection.appendChild(recentGroup);
  root.appendChild(recentSection);

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

  /* Wire recent chip clicks: pre-fill the search input and trigger
     the input event so the existing TMDB search flow runs. */
  recentGroup.querySelectorAll('.oft-recent-person-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.personName;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
  });
  
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

/* ============================================================
   buildKeywordSearchWidget(widgetId, section, placeholder)
   Phase 2 (May 9, 2026) — keyword-only search widget for the
   Themes and Genre tab right columns. Selecting a result commits
   { type:'tmdb-keyword', id, name } directly to state.filters
   under the given section (themes or genres). Reuses the
   .orbit-kw-* CSS shipped in Phase 1.
   ============================================================ */
function buildKeywordSearchWidget(widgetId, section, placeholder) {
  const wrap = document.createElement("div");
  wrap.className = "orbit-kw-tab-wrap";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "orbit-kw-input orbit-kw-input--compact";
  input.id = widgetId + "-input";
  input.placeholder = placeholder;
  input.autocomplete = "off";

  const dropdown = document.createElement("div");
  dropdown.className = "orbit-kw-dropdown orbit-kw-dropdown--inline";
  dropdown.id = widgetId + "-dropdown";
  dropdown.style.display = "none";

  wrap.appendChild(input);
  wrap.appendChild(dropdown);

  let _timer = null;

  input.addEventListener("input", function () {
    const q = this.value.trim();
    clearTimeout(_timer);
    if (q.length < 2) { dropdown.style.display = "none"; return; }
    _timer = setTimeout(function () {
      searchKeywordsOnly(q, dropdown, section, input);
    }, 350);
  });

  input.addEventListener("blur", function () {
    setTimeout(function () { dropdown.style.display = "none"; }, 200);
  });

  return wrap;
}

async function searchKeywordsOnly(query, dropdownEl, section, inputEl) {
  const key = TMDB_API_KEY;
  dropdownEl.innerHTML = '<div class="orbit-kw-empty">Searching…</div>';
  dropdownEl.style.display = "block";

  let data = { results: [] };
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/keyword?api_key=${key}` +
      `&query=${encodeURIComponent(query)}&page=1`
    );
    data = await res.json();
  } catch (e) {
    dropdownEl.innerHTML = '<div class="orbit-kw-empty">Search unavailable</div>';
    return;
  }

  const keywords = (data.results || []).slice(0, 8);
  dropdownEl.innerHTML = "";

  if (keywords.length === 0) {
    dropdownEl.innerHTML = '<div class="orbit-kw-empty">No results</div>';
    return;
  }

  keywords.forEach(function (kw) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "orbit-kw-item";
    item.innerHTML =
      '<span class="orbit-kw-item-name"></span>' +
      '<span class="orbit-kw-item-badge orbit-kw-badge--keyword">Keyword</span>';
    item.querySelector(".orbit-kw-item-name").textContent = kw.name;

    item.addEventListener("mousedown", function () {
      const filterId = section + "-tmdbkw-" + kw.id;
      // Dedupe — skip if already present
      if (!state.filters.some(function (f) { return f.id === filterId; })) {
        state.filters.push({
          id: filterId,
          section: section,
          label: kw.name,
          value: { type: "tmdb-keyword", id: kw.id, name: kw.name }
        });
        renderFilterChips();
      }
      dropdownEl.style.display = "none";
      if (inputEl) inputEl.value = "";
    });

    dropdownEl.appendChild(item);
  });
}

function buildGenresContent(root) {
  /* Genre 2-column layout (May 4, 2026): Match toggle + Genres
     chips on the left, Keywords & Mood subgroups on the right. */
  const grid = document.createElement("div");
  grid.className = "oft-genres-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-genres-col";
  const colRight = document.createElement("div"); colRight.className = "oft-genres-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

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
  colLeft.appendChild(toggleContainer);

  colLeft.appendChild(makeSectionLabel("Genres"));
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
  colLeft.appendChild(genreGroup);

  const genresKwSearch = buildKeywordSearchWidget(
    "genres-kw", "genres", "Search moods & concepts..."
  );
  colRight.insertBefore(genresKwSearch, colRight.firstChild);

  colRight.appendChild(makeSectionLabel("Keywords & Mood"));

  /* Trimmed May 4, 2026 to one row per group at 45% column width.
     Dropped: Tone — Quirky, Whimsical, Bleak; Mood — Twisted;
     Content — Gore, Heartwarming. */
  const keywordCategories = [
    { label: "Tone",    keywords: ["Noir", "Gritty", "Dark", "Uplifting"] },
    { label: "Pace",    keywords: ["Slow-burn", "Fast-paced", "Intense", "Suspenseful"] },
    { label: "Mood",    keywords: ["Emotional", "Feel-good", "Atmospheric", "Cerebral"] },
    { label: "Content", keywords: ["Violent", "Family-friendly", "Mind-bending"] }
  ];

  keywordCategories.forEach(cat => {
    const catLabel = document.createElement("div");
    catLabel.textContent = cat.label;
    catLabel.style.cssText = "font-size: 11px; color: var(--muted-silver); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 1px;";
    colRight.appendChild(catLabel);

    const keywordGroup = document.createElement("div");
    keywordGroup.className = "chip-group";
    cat.keywords.forEach(kw => {
      const chip = makeChip(kw, "genres", { type: "keyword", name: kw });
      chip.id = `keyword-${kw.replace(/\s+/g, '-')}`;
      keywordGroup.appendChild(chip);
    });
    colRight.appendChild(keywordGroup);
  });
}

// =============================================
// 3. THEMES SECTION
// =============================================

function buildThemesContent(root) {
  /* Themes 2-column layout (May 4, 2026): first 3 THEME_GROUPS in
     the left column, remaining groups in the right. Intro paragraph
     dropped — duplicates the panel header. */
  const grid = document.createElement("div");
  grid.className = "oft-themes-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-themes-col";
  const colRight = document.createElement("div"); colRight.className = "oft-themes-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

  const themesKwSearch = buildKeywordSearchWidget(
    "themes-kw", "themes", "Search themes & concepts..."
  );
  colRight.insertBefore(themesKwSearch, colRight.firstChild);

  const groupEntries = Object.entries(THEME_GROUPS);
  const half = Math.ceil(groupEntries.length / 2);

  groupEntries.forEach(([groupName, categories], i) => {
    const target = i < half ? colLeft : colRight;
    target.appendChild(makeSectionLabel(groupName));
    const chipGroup = document.createElement("div");
    chipGroup.className = "chip-group";
    categories.forEach(cat => {
      const chip = makeChip(cat, "themes", { type: "theme", name: cat });
      chipGroup.appendChild(chip);
    });
    target.appendChild(chipGroup);
  });
}

// =============================================
// 4. SETTING: WHERE SECTION
// =============================================

function buildSettingWhereContent(root) {
  const desc = document.createElement("p");
  desc.style.cssText = "font-size: 15.6px; color: var(--muted-silver); margin-bottom: 0;";
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
  selectedContainer.style.cssText = "display:flex; flex-wrap:wrap; gap:8px; margin-bottom:0; min-height:0;";
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
    "New York", "Los Angeles", "London", "Paris"
  ];

  /* 5th chip — primary city of the user's streaming country (read from
     localStorage key `orbit_user_country`, ISO 3166-1, registered in
     data/storage-keys.md). Falls back to Sydney when the country is
     unset, unmapped, or its city is already shown above. */
  const COUNTRY_PRIMARY_CITY = {
    AU: "Sydney",         US: "Washington D.C.", GB: "London",
    CA: "Toronto",        DE: "Berlin",          FR: "Paris",
    ES: "Madrid",         IT: "Rome",            BR: "Rio de Janeiro",
    MX: "Mexico City",    JP: "Tokyo",           KR: "Seoul",
    IN: "Mumbai",         NL: "Amsterdam",       SE: "Stockholm",
    NO: "Oslo",           DK: "Copenhagen",      FI: "Helsinki",
    NZ: "Wellington",     IE: "Dublin",          ZA: "Cape Town",
    AR: "Buenos Aires",   CL: "Santiago",        CO: "Bogotá",
    PL: "Warsaw",         PT: "Lisbon",          AT: "Vienna",
    CH: "Zurich",         BE: "Brussels",        SG: "Singapore"
  };
  const userCountry = localStorage.getItem("orbit_user_country");
  let fifthCity = (userCountry && COUNTRY_PRIMARY_CITY[userCountry]) || "Sydney";
  if (popularLocations.indexOf(fifthCity) !== -1) fifthCity = "Sydney";
  if (popularLocations.indexOf(fifthCity) === -1) popularLocations.push(fifthCity);
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
  // Phase 3 — keyword search widget at top of the right column.
  // root is the right column itself (single-arg builder); firstChild
  // is null at this point so insertBefore acts as appendChild.
  const settingKwSearch = buildKeywordSearchWidget(
    "setting-kw", "settingWhen", "Search settings, locations, eras..."
  );
  root.insertBefore(settingKwSearch, root.firstChild);

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

  /* Trimmed May 4, 2026: dropped Edwardian, French Revolution,
     American Civil War, American Revolution — niche/rarely-searched. */
  const eraOrder = [
    "World War II", "World War I", "Cold War", "Vietnam Era",
    "Civil Rights", "Roaring Twenties", "Great Depression", "Prohibition",
    "Space Race", "Victorian", "Colonial Era",
    "Industrial Revolution",
    "The Troubles", "Fall of the Berlin Wall",
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
  note.style.cssText = "font-size: 14.3px; color: var(--ghost-gray); margin-top: 12px; font-style: italic;";
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
  /* Era 2-column layout (May 4, 2026): Year + Decades on left,
     Runtime sliders + chips on right. */
  const grid = document.createElement("div");
  grid.className = "oft-era-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-era-col";
  const colRight = document.createElement("div"); colRight.className = "oft-era-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

  colLeft.appendChild(makeSectionLabel("Specific Year"));
  const yearRow = document.createElement("div");
  yearRow.className = "input-row";
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.id = "yearInput";
  yearInput.placeholder = "e.g., 2020";
  yearInput.min = "1900";
  yearInput.max = "2030";
  yearRow.appendChild(yearInput);
  colLeft.appendChild(yearRow);

  colLeft.appendChild(makeSectionLabel("Decades (when movie was released)"));
  const releaseDecades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const relDecadeGroup = document.createElement("div");
  relDecadeGroup.className = "chip-group";
  releaseDecades.forEach(d => {
    const chip = makeChip(`${d}s`, "timeEra", { type: "decade", decade: d, subType: "release" }, { component: true });
    chip.id = `date-decade-${d}`;
    relDecadeGroup.appendChild(chip);
  });
  colLeft.appendChild(relDecadeGroup);

  const quickGroup = document.createElement("div");
  quickGroup.className = "chip-group";
  quickGroup.style.marginTop = "12px";
  const newRelease = makeChip("New Releases (6 months)", "timeEra", {
    type: "dateRange",
    subType: "release",
    start: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }, { component: true });
  const classic = makeChip("Classic (Pre-1980)", "timeEra", {
    type: "dateRange",
    subType: "release",
    start: "1900-01-01",
    end: "1979-12-31"
  }, { component: true });
  quickGroup.appendChild(newRelease);
  quickGroup.appendChild(classic);
  colLeft.appendChild(quickGroup);

  /* Right column: runtime — alias `root` so the existing right-side
     code reads from the runtime column. */
  const runtimeRoot = colRight;
  runtimeRoot.appendChild(makeSectionLabel("Runtime (minutes)"));
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
  runtimeRoot.appendChild(runtimeRow);

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
    }, { component: true });
    chip.addEventListener("click", () => {
      document.getElementById("runtimeMin").value = preset.min;
      document.getElementById("runtimeMax").value = preset.max;
      document.getElementById("runtimeMinValue").textContent = preset.min;
      document.getElementById("runtimeMaxValue").textContent = preset.max;
    });
    runtimeQuick.appendChild(chip);
  });
  runtimeRoot.appendChild(runtimeQuick);
}

// =============================================
// 4. RATINGS & CONTENT SECTION (merged ratings + suitability)
// =============================================

function buildRatingsContentSection(root) {
  /* Ratings 2-column layout (May 4, 2026): Quality Score sliders +
     chips + Min Votes on the left, Content Rating + cert chips on
     the right. The duplicate "Ratings & Votes" header is dropped —
     the column section labels carry that information already. */
  const grid = document.createElement("div");
  grid.className = "oft-ratings-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-ratings-col";
  const colRight = document.createElement("div"); colRight.className = "oft-ratings-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

  /* All "root.appendChild" below this point in this function targets
     the left column until the divider; right-column code is the
     SUITABILITY section which we re-route to colRight. */

  colLeft.appendChild(makeSectionLabel("Quality Score Range (0-10)"));
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
  colLeft.appendChild(ratingRow);

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
  colLeft.appendChild(ratingQuick);

  colLeft.appendChild(makeSectionLabel("Minimum Votes (reliability)"));
  const voteGroup = document.createElement("div");
  voteGroup.className = "chip-group";
  /* 2026-05-17: TMDB's all-time vote-count leader sits around 40k
     (Interstellar 39.7k, Inception 39.2k). 50k/100k/250k chips
     always returned 0, so capped at 30k+ which matches TMDB's
     realistic data ceiling (~10 films at 30k+). */
  [
    { label: "100+", votes: 100 },
    { label: "1,000+", votes: 1000 },
    { label: "5,000+", votes: 5000 },
    { label: "10,000+", votes: 10000 },
    { label: "20,000+", votes: 20000 },
    { label: "25,000+", votes: 25000 },
    { label: "30,000+", votes: 30000 }
  ].forEach(v => {
    const chip = makeChip(v.label, "ratingsContent", { type: "votes", min: v.votes });
    chip.id = `votes-${v.votes}`;
    voteGroup.appendChild(chip);
  });
  colLeft.appendChild(voteGroup);

  /* --- SUITABILITY (right column) --- */
  const suitHeader = document.createElement("div");
  suitHeader.style.cssText = "font-size: 15px; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;";
  suitHeader.textContent = "Content Rating";
  colRight.appendChild(suitHeader);

  colRight.appendChild(makeSectionLabel("Age Rating / Certification"));
  const ratings = ["G", "PG", "PG-13", "R", "NC-17", "Unrated"];
  const ratingGroup = document.createElement("div");
  ratingGroup.className = "chip-group";
  ratings.forEach(r => {
    const chip = makeChip(r, "ratingsContent", { type: "certification", rating: r });
    chip.id = `cert-${r.replace('-', '')}`;
    ratingGroup.appendChild(chip);
  });
  colRight.appendChild(ratingGroup);

  const note = document.createElement("p");
  note.style.fontSize = "12px";
  note.style.color = "var(--muted-silver)";
  note.style.marginTop = "12px";
  note.style.fontStyle = "italic";
  note.textContent = "Note: Ratings are US certifications. Other regions may have different classifications.";
  colRight.appendChild(note);
}

// =============================================
// 6. REGION & LANGUAGE SECTION
// =============================================

function buildRegionLanguageContent(root) {
  root.appendChild(makeSectionLabel("Production Region"));

  /* ============================================================
     REGION MATCH TOGGLE — Added 2026-05-11
     Any (OR) = movies produced by ANY selected country (pipe-separated)
     All (AND) = movies produced by ALL selected countries (co-productions)
     Mirrors the Genres tab toggle pattern (state.genreLogic).
     ============================================================ */
  const regionToggleContainer = document.createElement("div");
  regionToggleContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding: 12px;
    background: rgba(15, 23, 41, 0.5);
    border-radius: 8px;
  `;

  const regionToggleLabel = document.createElement("span");
  regionToggleLabel.textContent = "Match:";
  regionToggleLabel.style.cssText = "font-size: 13px; font-weight: 600; color: var(--accent-cyan);";
  regionToggleContainer.appendChild(regionToggleLabel);

  const regionOrBtn = document.createElement("button");
  regionOrBtn.type = "button";
  regionOrBtn.textContent = "Any (OR)";
  regionOrBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.regionLogic === "or" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.regionLogic === "or" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;

  const regionAndBtn = document.createElement("button");
  regionAndBtn.type = "button";
  regionAndBtn.textContent = "All (AND)";
  regionAndBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.regionLogic === "and" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.regionLogic === "and" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;

  function refreshCountIfRegionsSelected() {
    const hasRegions = state.filters.some(f => f.section === "regionLanguage" && f.value && f.value.type === "region");
    if (hasRegions && typeof fetchFilmCount === "function") {
      try { fetchFilmCount(); } catch (e) {}
    }
  }

  regionOrBtn.addEventListener("click", () => {
    state.regionLogic = "or";
    regionOrBtn.style.background = "var(--accent-cyan)";
    regionOrBtn.style.color = "#000";
    regionAndBtn.style.background = "transparent";
    regionAndBtn.style.color = "var(--film-white)";
    refreshCountIfRegionsSelected();
  });

  regionAndBtn.addEventListener("click", () => {
    state.regionLogic = "and";
    regionAndBtn.style.background = "var(--accent-cyan)";
    regionAndBtn.style.color = "#000";
    regionOrBtn.style.background = "transparent";
    regionOrBtn.style.color = "var(--film-white)";
    refreshCountIfRegionsSelected();
  });

  regionToggleContainer.appendChild(regionOrBtn);
  regionToggleContainer.appendChild(regionAndBtn);
  root.appendChild(regionToggleContainer);

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

  /* Multi-region append helper — 2026-05-11 (hydration support 2026-05-11).
     Dedupes by data-region-code. Smart language link fires only on the
     first region added; pass { skipSmartLink: true } during hydration to
     avoid re-toggling English Only when restoring chips from state.
     Remove mutates state.filters immediately and re-renders the sidebar
     (idempotent: filter() is a no-op for chips not yet committed). */
  function addRegionChip(item, opts) {
    if (!item || !item.code) return;
    if (regionContainer.querySelector('[data-region-code="' + item.code + '"]')) return;

    const skipSmartLink = opts && opts.skipSmartLink;
    const isFirstRegion = regionContainer.children.length === 0;

    const chip = document.createElement("div");
    chip.dataset.regionCode = item.code;
    chip.style.cssText = `
      background: rgba(111, 210, 255, 0.15);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 999px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    `;

    const labelSpan = document.createElement("span");
    labelSpan.textContent = item.name;
    chip.appendChild(labelSpan);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.style.cssText = "background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;";
    removeBtn.addEventListener("click", () => {
      chip.remove();
      state.filters = state.filters.filter(function (f) {
        return !(f.section === "regionLanguage" && f.value && f.value.type === "region" && f.value.code === item.code);
      });
      if (typeof updateUIFromState === "function") {
        try { updateUIFromState(); } catch (e) {}
      }
    });
    chip.appendChild(removeBtn);

    regionContainer.appendChild(chip);

    if (isFirstRegion && !skipSmartLink) {
      handleRegionLanguageLink(item.code);
    }
  }

  /* Hydrate region chips from state.filters on every panel open — 2026-05-11.
     Without this, switching tabs and returning loses the visible chips even
     though state.filters still holds the selections. */
  state.filters
    .filter(function (f) {
      return f.section === "regionLanguage" && f.value && f.value.type === "region";
    })
    .forEach(function (f) {
      addRegionChip({ code: f.value.code, name: f.value.name }, { skipSmartLink: true });
    });

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
        regionInput.value = "";
        hideRegionSuggestions();
        addRegionChip(item);
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

  /* ============================================================
     POPULAR REGIONS — Added May 4, 2026
     Quick-pick chips below the English Only toggle. Clicking a chip
     pre-fills the Production Region search input with the country
     name and triggers the input event so the existing region-search
     flow renders the suggestion dropdown.
     ============================================================ */
  const popularLabel = document.createElement("div");
  popularLabel.className = "focus-section-label";
  popularLabel.style.marginTop = "12px";
  popularLabel.textContent = "POPULAR REGIONS";
  root.appendChild(popularLabel);

  const popularGroup = document.createElement("div");
  popularGroup.className = "chip-group";
  const popularRegions = [
    { code: 'US', name: 'United States', label: 'Hollywood' },
    { code: 'GB', name: 'United Kingdom', label: 'British' },
    { code: 'FR', name: 'France',         label: 'French' },
    { code: 'KR', name: 'South Korea',    label: 'Korean' },
    { code: 'JP', name: 'Japan',          label: 'Japanese' },
    { code: 'IT', name: 'Italy',          label: 'Italian' },
    { code: 'HK', name: 'Hong Kong',      label: 'Hong Kong' },
    { code: 'DE', name: 'Germany',        label: 'German' }
  ];
  popularRegions.forEach(r => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip oft-popular-region-chip";
    chip.dataset.regionCode = r.code;
    chip.dataset.regionName = r.name;
    chip.textContent = r.label;
    chip.addEventListener('click', () => {
      // 2026-05-11: clicking a Popular Region adds it directly to the
      // selection (was previously a search-input prefill).
      addRegionChip({ code: r.code, name: r.label });
    });
    popularGroup.appendChild(chip);
  });
  root.appendChild(popularGroup);

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
  /* Production 2-column layout (May 4, 2026): Studios + search on
     the left, Box Office sliders + presets on the right. */
  const grid = document.createElement("div");
  grid.className = "oft-production-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-production-col";
  const colRight = document.createElement("div"); colRight.className = "oft-production-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

  colLeft.appendChild(makeSectionLabel("Studios & Production Companies"));

  const desc = document.createElement("p");
  desc.style.fontSize = "13px";
  desc.style.color = "var(--muted-silver)";
  desc.style.marginBottom = "16px";
  desc.textContent = "Select from top studios or search for others.";
  colLeft.appendChild(desc);

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
    const chip = makeChip(studio.name, "production", { type: "company", id: studio.id, name: studio.name });
    chip.id = `studio-${studio.name.replace(/\s+/g, '-')}`;
    studioGroup.appendChild(chip);
  });
  colLeft.appendChild(studioGroup);

  const studioRow = document.createElement("div");
  studioRow.className = "input-row";
  studioRow.style.cssText = "margin-top: 16px; position: relative;";
  const studioInput = document.createElement("input");
  studioInput.type = "text";
  studioInput.id = "studioInput";
  studioInput.placeholder = "Search for other studios...";
  studioInput.autocomplete = "off";
  studioRow.appendChild(studioInput);
  colLeft.appendChild(studioRow);

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
              const chip = makeChip(company.name, "production", { type: "company", id: company.id, name: company.name });
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
  
  colRight.appendChild(makeSectionLabel("Box Office (Worldwide Gross)"));

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
  colRight.appendChild(boxOfficeRow);

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
  colRight.appendChild(boxOfficeQuick);
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

/* ============================================================
   UNIVERSES — unified keyword & collection search (Phase 1)
   Rebuilt May 9, 2026
   Right column of the Source/Universe tab. Replaces the old
   Search Collections + Popular Universes layout with a unified
   search input (parallel TMDB keyword + collection queries) plus
   curated Popular Series and Popular Themes rows.

   Filter shapes committed to state.filters:
     collection chip → { type:'collection', id, name, collections:[id] }
                       (`.collections` array kept so existing Universe
                        Mode launch path at line ~1480 picks them up
                        without modification — Phase 1 back-compat.)
     keyword chip    → { type:'keyword',    id, name }
                       (handled by buildTMDBQueryFromFilters universes
                        case → params.set('with_keywords', …))
   ============================================================ */
function buildUniversesContent(root) {
  // ---------- Search ----------
  root.appendChild(makeSectionLabel("Keyword & series search"));

  const searchWrap = document.createElement("div");
  searchWrap.className = "orbit-kw-search-wrap";
  const kwInput = document.createElement("input");
  kwInput.type = "text";
  kwInput.id = "kwSeriesInput";
  kwInput.className = "orbit-kw-input";
  kwInput.placeholder = "Search franchises, themes, concepts...";
  kwInput.autocomplete = "off";
  searchWrap.appendChild(kwInput);
  root.appendChild(searchWrap);

  const dropdown = document.createElement("div");
  dropdown.className = "orbit-kw-dropdown";
  dropdown.id = "kwSeriesDropdown";
  dropdown.style.display = "none";
  dropdown.innerHTML =
    '<div class="orbit-kw-group" id="kwSeriesGroup" style="display:none;">' +
      '<div class="orbit-kw-group-label">FILM SERIES</div>' +
      '<div class="orbit-kw-results" id="kwSeriesResults"></div>' +
    '</div>' +
    '<div class="orbit-kw-group" id="kwThemeGroup" style="display:none;">' +
      '<div class="orbit-kw-group-label">THEMES &amp; CONCEPTS</div>' +
      '<div class="orbit-kw-results" id="kwThemeResults"></div>' +
    '</div>' +
    '<div class="orbit-kw-empty" id="kwEmpty" style="display:none;">No results found</div>';
  root.appendChild(dropdown);

  let _kwTimer = null;

  kwInput.addEventListener("input", function () {
    const q = this.value.trim();
    clearTimeout(_kwTimer);
    if (q.length < 2) { dropdown.style.display = "none"; return; }
    _kwTimer = setTimeout(function () { searchKeywordsAndCollections(q); }, 350);
  });

  kwInput.addEventListener("blur", function () {
    setTimeout(function () { dropdown.style.display = "none"; }, 200);
  });

  async function searchKeywordsAndCollections(query) {
    const key = TMDB_API_KEY;
    const base = "https://api.themoviedb.org/3";
    dropdown.style.display = "block";

    let kwData = { results: [] }, colData = { results: [] };
    try {
      const [kwRes, colRes] = await Promise.all([
        fetch(`${base}/search/keyword?api_key=${key}&query=${encodeURIComponent(query)}`),
        fetch(`${base}/search/collection?api_key=${key}&query=${encodeURIComponent(query)}`)
      ]);
      [kwData, colData] = await Promise.all([kwRes.json(), colRes.json()]);
    } catch (e) {
      console.error("[Orbit] Keyword/collection search failed:", e);
    }

    const keywords    = (kwData.results  || []).slice(0, 5);
    const collections = (colData.results || []).slice(0, 5);

    const seriesGroup = document.getElementById("kwSeriesGroup");
    const themeGroup  = document.getElementById("kwThemeGroup");
    const emptyEl     = document.getElementById("kwEmpty");
    const seriesRes   = document.getElementById("kwSeriesResults");
    const themeRes    = document.getElementById("kwThemeResults");

    seriesRes.innerHTML = "";
    themeRes.innerHTML  = "";

    if (collections.length > 0) {
      seriesGroup.style.display = "block";
      collections.forEach(function (col) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "orbit-kw-item";
        item.dataset.kind = "collection";
        item.dataset.id   = col.id;
        item.dataset.name = col.name;
        item.innerHTML =
          '<span class="orbit-kw-item-name"></span>' +
          '<span class="orbit-kw-item-badge orbit-kw-badge--collection">Series</span>';
        item.querySelector(".orbit-kw-item-name").textContent = col.name;
        item.addEventListener("mousedown", function () {
          commitKwFilter("collection", col.id, col.name);
          kwInput.value = "";
          dropdown.style.display = "none";
        });
        seriesRes.appendChild(item);
      });
    } else {
      seriesGroup.style.display = "none";
    }

    if (keywords.length > 0) {
      themeGroup.style.display = "block";
      keywords.forEach(function (kw) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "orbit-kw-item";
        item.dataset.kind = "keyword";
        item.dataset.id   = kw.id;
        item.dataset.name = kw.name;
        item.innerHTML =
          '<span class="orbit-kw-item-name"></span>' +
          '<span class="orbit-kw-item-badge orbit-kw-badge--keyword">Concept</span>';
        item.querySelector(".orbit-kw-item-name").textContent = kw.name;
        item.addEventListener("mousedown", function () {
          commitKwFilter("keyword", kw.id, kw.name);
          kwInput.value = "";
          dropdown.style.display = "none";
        });
        themeRes.appendChild(item);
      });
    } else {
      themeGroup.style.display = "none";
    }

    emptyEl.style.display =
      (collections.length === 0 && keywords.length === 0) ? "block" : "none";
  }

  /* commitKwFilter — toggle: add filter on first click, remove on
     duplicate click. Keeps state.filters and chip visual in sync. */
  function commitKwFilter(kind, id, name) {
    const filterId = "universes-" + kind + "-" + id;
    const existingIdx = state.filters.findIndex(function (f) { return f.id === filterId; });

    if (existingIdx !== -1) {
      state.filters.splice(existingIdx, 1);
    } else if (kind === "collection") {
      // .collections kept for back-compat with Universe Mode launch flow
      state.filters.push({
        id: filterId,
        section: "universes",
        label: name,
        value: { type: "collection", id: id, name: name, collections: [id] }
      });
    } else {
      state.filters.push({
        id: filterId,
        section: "universes",
        label: name,
        value: { type: "keyword", id: id, name: name }
      });
    }

    syncCuratedActive();
    renderFilterChips();
  }

  // ---------- Popular Series (collection chips) ----------
  root.appendChild(makeSectionLabel("Popular Series"));
  const seriesChipGroup = document.createElement("div");
  seriesChipGroup.className = "chip-group";

  const POPULAR_SERIES = [
    "mcu", "star-wars", "harry-potter", "james-bond",
    "alien", "predator", "lotr", "mission-impossible"
  ];
  const SERIES_DISPLAY = {
    "mcu": "MCU",
    "star-wars": "Star Wars",
    "harry-potter": "Harry Potter",
    "james-bond": "James Bond",
    "alien": "Alien",
    "predator": "Predator",
    "lotr": "Lord of the Rings",
    "mission-impossible": "Mission: Impossible"
  };
  POPULAR_SERIES.forEach(function (key) {
    const entry = ORBIT_KEYWORD_IDS[key];
    if (!entry) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.curatedKey = "collection-" + entry.id;
    btn.textContent = SERIES_DISPLAY[key] || entry.label;
    btn.addEventListener("click", function () {
      commitKwFilter("collection", entry.id, entry.label);
    });
    seriesChipGroup.appendChild(btn);
  });
  root.appendChild(seriesChipGroup);

  // ---------- Popular Themes (keyword chips) ----------
  const themesLabel = makeSectionLabel("Popular Themes");
  themesLabel.classList.add("focus-section-label--purple");
  root.appendChild(themesLabel);

  const themesChipGroup = document.createElement("div");
  themesChipGroup.className = "chip-group";

  const POPULAR_THEMES = [
    "time-travel", "heist", "dystopia", "serial-killer",
    "revenge", "coming-of-age", "vampire", "space"
  ];
  POPULAR_THEMES.forEach(function (key) {
    const entry = ORBIT_KEYWORD_IDS[key];
    if (!entry) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip orbit-theme-chip";
    btn.dataset.curatedKey = "keyword-" + entry.id;
    btn.textContent = entry.label;
    btn.addEventListener("click", function () {
      commitKwFilter("keyword", entry.id, entry.label);
    });
    themesChipGroup.appendChild(btn);
  });
  root.appendChild(themesChipGroup);

  /* Reflect state.filters → chip .active class. Called after every
     commit, plus once on initial build to restore active chips when
     reopening the panel with existing universes filters in state. */
  function syncCuratedActive() {
    const activeKeys = new Set();
    state.filters.forEach(function (f) {
      if (f.section !== "universes" || !f.value) return;
      if (f.value.type === "collection" && f.value.id != null) {
        activeKeys.add("collection-" + f.value.id);
      } else if (f.value.type === "keyword" && f.value.id != null) {
        activeKeys.add("keyword-" + f.value.id);
      }
    });
    [seriesChipGroup, themesChipGroup].forEach(function (group) {
      group.querySelectorAll(".chip").forEach(function (btn) {
        const k = btn.dataset.curatedKey;
        if (activeKeys.has(k)) btn.classList.add("active");
        else btn.classList.remove("active");
      });
    });
  }
  syncCuratedActive();
}

// =============================================
// 9. AWARDS SECTION (placeholder)
// =============================================

function buildAwardsContent(root) {
  /* Awards 2-column layout (May 5, 2026): Recognition + Specific Year
     + Year Range sliders on the left; Festival above Category on the
     right, separated by a focus-section-label divider. */

  /* Data-quality disclaimer — added 2026-05-16. Awards data is being
     rebuilt; coverage is limited to legacy datasets. Uses inline SVG
     (no og-warning glyph in the current set) with gold accent var. */
  const awardsDisclaimer = document.createElement("div");
  awardsDisclaimer.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
    padding: 10px 12px;
    background: rgba(var(--accent-gold-rgb), 0.08);
    border: 1px solid rgba(var(--accent-gold-rgb), 0.3);
    border-radius: 8px;
    font-family: "Barlow", sans-serif;
    font-size: 12px;
    line-height: 1.45;
    color: var(--muted-silver);
  `;
  awardsDisclaimer.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent-gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;" aria-hidden="true">
      <path d="M8 2L14 13H2L8 2Z"/>
      <line x1="8" y1="6.5" x2="8" y2="9.5"/>
      <circle cx="8" cy="11.5" r="0.5" fill="var(--accent-gold)"/>
    </svg>
    <div>
      <strong style="color: var(--film-white);">Awards data is being rebuilt.</strong>
      Coverage is limited to Oscar, BAFTA, Golden Globe, Cannes, Venice, and Berlin from legacy datasets &mdash; some nominees and older ceremonies may be missing.
    </div>
  `;
  root.appendChild(awardsDisclaimer);

  const grid = document.createElement("div");
  grid.className = "oft-awards-grid";
  const colLeft  = document.createElement("div"); colLeft.className  = "oft-awards-col";
  const colRight = document.createElement("div"); colRight.className = "oft-awards-col";
  grid.appendChild(colLeft);
  grid.appendChild(colRight);
  root.appendChild(grid);

  // --- Recognition level (left) ---
  colLeft.appendChild(makeSectionLabel("Recognition"));
  const levelGroup = document.createElement("div");
  levelGroup.className = "chip-group";
  levelGroup.appendChild(makeChip("Winner", "awards", { type: "award-level", level: "winner" }));
  levelGroup.appendChild(makeChip("Nominee", "awards", { type: "award-level", level: "nominee" }));
  colLeft.appendChild(levelGroup);

  // --- Festival (right, top) ---
  colRight.appendChild(makeSectionLabel("Festival"));
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
  colRight.appendChild(festivalGroup);

  // --- Category (right, below Festival) ---
  colRight.appendChild(makeSectionLabel("Category"));
  const catGroup = document.createElement("div");
  catGroup.className = "chip-group";
  /* Trimmed May 4, 2026: dropped Silver Bear (Grand Jury) and
     Silver Bear (Director) — Silver Lion variants kept. */
  const categories = [
    "Best Picture", "Best Film", "Best Director", "Best Actor", "Best Actress",
    "Best Drama", "Best Comedy/Musical",
    "Palme d'Or", "Grand Prix", "Jury Prize",
    "Golden Lion", "Silver Lion (Grand Jury)", "Silver Lion (Director)",
    "Golden Bear"
  ];
  categories.forEach(function(cat) {
    catGroup.appendChild(makeChip(cat, "awards", { type: "award-category", category: cat }));
  });
  colRight.appendChild(catGroup);

  // --- Specific Year (left) ---
  colLeft.appendChild(makeSectionLabel("Specific Year"));
  const awardSpecificRow = document.createElement("div");
  awardSpecificRow.className = "input-row";
  const awardYearInput = document.createElement("input");
  awardYearInput.type = "number";
  awardYearInput.id = "awardYearInput";
  awardYearInput.placeholder = "e.g. 2024";
  awardYearInput.min = "1950";
  awardYearInput.max = "2030";
  awardSpecificRow.appendChild(awardYearInput);
  colLeft.appendChild(awardSpecificRow);

  // --- Award Year Range (left) ---
  colLeft.appendChild(makeSectionLabel("Year Range"));

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
  colLeft.appendChild(awardYearRow);

  /* Quick Decade section removed May 4, 2026 — duplicated Year
     Range slider functionality. Slider handlers below no longer
     need to clear a decade-chip selection. */

  fromSlider.addEventListener("input", function() {
    var from = parseInt(fromSlider.value);
    var to = parseInt(toSlider.value);
    if (from > to) { toSlider.value = from; toValue.textContent = from; }
    fromValue.textContent = from;
    awardYearInput.value = "";
  });
  toSlider.addEventListener("input", function() {
    var from = parseInt(fromSlider.value);
    var to = parseInt(toSlider.value);
    if (to < from) { fromSlider.value = to; fromValue.textContent = to; }
    toValue.textContent = to;
    awardYearInput.value = "";
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
      const peopleResults = Array.from(selectedPeopleChips).map(chip => {
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
      if (typeof currentFilmmakerProfile === 'object' && currentFilmmakerProfile) {
        const fp = currentFilmmakerProfile;
        const fpAwards = Array.isArray(fp.awards) ? fp.awards : [];
        const fpParts = ['role', 'nationality', 'gender', 'career_stage']
          .filter(k => fp[k] && fp[k] !== 'any')
          .map(k => k + ':' + fp[k]);
        if (fpAwards.length > 0) fpParts.push('awards:' + fpAwards.join('+'));
        if (fpParts.length > 0) {
          peopleResults.push({
            label: 'Filmmaker: ' + fpParts.join(', '),
            value: {
              type: 'filmmakerProfile',
              profile: Object.assign({}, fp, { awards: fpAwards.slice() })
            }
          });
        }
      }
      return peopleResults;

    case "genres":
      const genreChips = document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active');
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
      const releaseChips = Array.from(document.querySelectorAll('#focusContent .disco-chip.on, .oft-panel--active .disco-chip.on'))
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
      const voteChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      const certChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      if (regionContainer) {
        // 2026-05-11: iterate all region chips for multi-region support.
        const regionChips = regionContainer.querySelectorAll('[data-region-code]');
        regionChips.forEach(regionChip => {
          const code = regionChip.dataset.regionCode;
          const regionText = regionChip.querySelector('span')?.textContent;
          if (code && regionText) {
            results.push({
              label: `Region: ${regionText}`,
              value: { type: "region", code: code, name: regionText }
            });
          }
        });
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
      const studioChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      const curatedChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      const themeChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      const locChipsActive = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
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
      const whenChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'));
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
      const basedOnChips = Array.from(document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active'))
        .filter(chip => {
          try { return JSON.parse(chip.dataset.value).type === "based_on"; } catch { return false; }
        });
      return basedOnChips.map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent, value };
      });

    case "awards":
      const awardResults = [];
      const awardChips = document.querySelectorAll('#focusContent .chip.active, .oft-panel--active .chip.active');
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

/* ============================================================
   MOSAIC ANCHOR — Added May 1, 2026
   Pins .discover-mosaic-region's top edge to the exact bottom of
   the streaming bar so the mosaic begins precisely at the second
   horizontal divider. Re-measures on resize.
   ============================================================ */
(function initMosaicAnchor() {
  var streamBar = document.getElementById('discoverStreamBar');
  if (!streamBar) return;
  function sync() {
    var rect = streamBar.getBoundingClientRect();
    /* getBoundingClientRect.bottom is viewport-relative; add scrollY
       so the value works for an absolute-positioned element pinned
       to the body's coordinate system. */
    var topPx = Math.round(rect.bottom + window.scrollY);
    document.documentElement.style.setProperty('--mosaic-top', topPx + 'px');
  }
  sync();
  window.addEventListener('resize', sync);
})();

/* ============================================================
   MOVIE MOSAIC — Added May 1, 2026
   Mirrors landing page populateMosaic logic from pages/home.js.
   Fetches trending + top-rated posters via TMDB, caches in
   sessionStorage for 2h, and fades them into the cell grid.

   Per Rule 9: 3 parallel fetches once per session.

   Cache key version bumped after API key rotation so any stale
   empty cache from a previous session is ignored.
   ============================================================ */
(function loadDiscoverMosaicPosters() {
  if (!window.OrbitUtils || typeof OrbitUtils.tmdbFetch !== 'function') return;
  var grid = document.getElementById('discover-hero-mosaic');
  if (!grid) return;

  var CACHE_KEY = 'orbit_discover_mosaic_posters_v2';
  var CACHE_TTL = 2 * 60 * 60 * 1000;

  function paint(paths) {
    if (!paths || !paths.length) return;
    var cells = grid.querySelectorAll('.mosaic-cell');
    if (!cells.length) return;

    var shuffled = paths.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
    }

    var assigned = [];
    var idx = 0;
    for (var k = 0; k < cells.length; k++) {
      if (idx >= shuffled.length) idx = 0;
      if (k > 0 && assigned[k - 1] === shuffled[idx] && shuffled.length > 1) {
        idx = (idx + 1) % shuffled.length;
      }
      assigned.push(shuffled[idx]);
      idx++;
    }

    cells.forEach(function (cell, i) {
      cell.style.opacity = '0';
      cell.style.transition = 'opacity 0.8s ease';
      /* w185 fits the larger 12×2 tile size cleanly; w92 was too low-res. */
      cell.style.backgroundImage = 'url(' + OrbitUtils.TMDB_IMG + 'w185' + assigned[i] + ')';
      cell.style.backgroundSize = 'cover';
      cell.style.backgroundPosition = 'center';
      setTimeout(function () { cell.style.opacity = '1'; }, 40 * i);
    });
  }

  /* Use cache only if it has actual data — never trust an empty cache. */
  try {
    var cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      var parsed = JSON.parse(cached);
      if (parsed && parsed.data && parsed.data.length &&
          Date.now() - parsed.timestamp < CACHE_TTL) {
        paint(parsed.data);
        return;
      }
    }
  } catch (e) { /* fall through to fetch */ }

  /* Use allSettled so one failing endpoint doesn't blank the mosaic. */
  Promise.allSettled([
    OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 1 }),
    OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 2 }),
    OrbitUtils.tmdbFetch('/movie/top_rated', { language: 'en-US', page: 1 })
  ]).then(function (results) {
    var paths = [];
    results.forEach(function (r) {
      if (r.status === 'fulfilled' && r.value && r.value.results) {
        r.value.results.forEach(function (m) {
          if (m && m.poster_path) paths.push(m.poster_path);
        });
      } else if (r.status === 'rejected') {
        console.warn('ORBIT discover mosaic: endpoint failed', r.reason);
      }
    });
    if (!paths.length) {
      console.warn('ORBIT discover mosaic: 0 posters returned');
      return;
    }
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: paths, timestamp: Date.now() }));
    } catch (e) { /* quota */ }
    paint(paths);
  });
})();

/* ============================================================
   ORBIT RING — Added May 3, 2026
   Reads state.filters and plots coloured dots on the SVG rings in
   the sidebar. Called from inside the renderFilterChips wrapper.
   ============================================================ */
const ORBIT_RING_COLOURS = {
  people:         '#00d9ff',  // cyan
  genres:         '#a855f7',  // purple
  timeEra:        '#f97316',  // orange
  ratingsContent: '#f59e0b',  // amber
  awards:         '#ffd700',  // gold
  themes:         '#94a3b8',  // silver
  settingWhere:   '#ef4444',  // red
  settingWhen:    '#ef4444',  // red
  basedOn:        '#f43f5e',  // rose
  universes:      '#f43f5e',  // rose
  regionLanguage: '#14b8a6',  // teal
  production:     '#6366f1',  // indigo
  watch:          '#10b981'   // green
};

function updateOrbitRing() {
  const dotsGroup = document.getElementById('orbitRingDots');
  const emptyText = document.getElementById('orbitRingEmptyText');
  if (!dotsGroup) return;

  const filters = Array.isArray(state.filters) ? state.filters : [];
  const n = filters.length;

  if (emptyText) emptyText.style.opacity = n === 0 ? '1' : '0';

  if (n === 0) { dotsGroup.innerHTML = ''; return; }

  const cx = 110, cy = 65;
  const ringRadii = [19, 36, 55];

  /* Inner ring 0–5, middle 6–13, outer 14+ */
  const grouped = [[], [], []];
  filters.forEach(function (f, i) {
    const ri = i < 6 ? 0 : i < 14 ? 1 : 2;
    grouped[ri].push(f);
  });

  let svgStr = '';
  grouped.forEach(function (group, ri) {
    const r = ringRadii[ri];
    const total = group.length;
    group.forEach(function (filter, pos) {
      const angle = (pos / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
      const x = (cx + r * Math.cos(angle)).toFixed(2);
      const y = (cy + r * Math.sin(angle)).toFixed(2);
      const colour = ORBIT_RING_COLOURS[filter.section] || '#00d9ff';
      svgStr += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + colour + '" opacity="0.9"/>';
      svgStr += '<circle cx="' + x + '" cy="' + y + '" r="2" fill="white" opacity="0.6"/>';
    });
  });

  dotsGroup.innerHTML = svgStr;
}

/* ============================================================
   LIVE FILM COUNT — Added May 4, 2026
   Fetches total_results from TMDB /discover/movie after filters
   change. Called from inside the renderFilterChips wrapper.
   Debounced 600ms to avoid hammering the API on rapid changes.
   Format: 1234 → "1,234", >9999 → "9,999+".
   ============================================================ */
let _filmCountTimer = null;

/* Zero-results guidance (2026-06-06) — state for the opt-in drop-one
   affordance. _zeroGuidanceCache memoises counterfactual recounts for the
   current failing query signature so re-clicking doesn't re-fetch; it is
   invalidated by hideZeroGuidance() (called on every filter change). */
let _zeroGuidanceCache = null;   /* { sig, results:[{id,label,count}] } */

/* Update the "X of Y on your services" warning under the film count.
   Only fires when a watch-section filter is active and the streaming-
   filtered count is less than 60% of the unfiltered total. */
function updateStreamingWarning(streamingCount, totalCount) {
  var warningEl = document.getElementById('orbitStreamingWarning');
  if (!warningEl) return;

  var hasStreamingFilter = Array.isArray(state.filters) &&
    state.filters.some(function (f) { return f.section === 'watch'; });

  if (!hasStreamingFilter || totalCount === 0) {
    warningEl.style.display = 'none';
    return;
  }

  var ratio = streamingCount / totalCount;
  if (ratio >= 0.6) {
    warningEl.style.display = 'none';
    return;
  }

  var missed = Math.max(0, totalCount - streamingCount);
  warningEl.innerHTML =
    '<span class="orbit-warning-text">' +
      streamingCount.toLocaleString() + ' of ' + totalCount.toLocaleString() +
      ' films on your services</span>' +
    '<button class="orbit-warning-link" type="button" ' +
      'onclick="document.getElementById(\'discoverEditBtn\').click()">' +
      missed.toLocaleString() + ' more on other streamers →</button>';
  warningEl.style.display = 'block';
}

function fetchFilmCount() {
  const countEl     = document.getElementById('orbitFilmCount');
  const countNumber = document.getElementById('orbitFilmCountNumber');
  if (!countEl || !countNumber) return;

  const filters = Array.isArray(state.filters) ? state.filters : [];
  if (filters.length === 0) {
    countEl.style.display = 'none';
    var warnEmpty = document.getElementById('orbitStreamingWarning');
    if (warnEmpty) warnEmpty.style.display = 'none';
    hideZeroGuidance();
    return;
  }

  countEl.style.display = 'block';
  countNumber.textContent = '…';

  clearTimeout(_filmCountTimer);
  _filmCountTimer = setTimeout(function () {
    /* Clear any prior zero-guidance affordance + cached counterfactuals
       on every recount, so a filter change away from zero (or into a
       non-normal branch) doesn't leave a stale affordance behind. */
    hideZeroGuidance();
    /* Awards filters are client-side against AWARDS_DATABASE — TMDB has no
       awards param. Three modes:
         1. Awards-only filters → synchronous count via getAwardsMatchingIds.
         2. Awards + TMDB filters → fetch TMDB page 1, post-filter with
            filterByAwards, extrapolate. Counter displays "~N" to signal
            an approximation (true count requires fetching all pages).
         3. No awards → existing TMDB path unchanged. */
    /* Movie-list counter (2026-05-16) — handles two filter types
       with the same ids semantics:
         • type: 'movieList'           → ids embedded directly in the filter
         • type: 'extended-collection' → ids looked up from ORBIT_KEYWORD_IDS
       Both resolve to an array of TMDB movie IDs. Fast path counts
       length; slow path batch-fetches /movie/{id} when other filters
       are present. */
    var explicitIdFilters = filters.filter(function (f) {
      if (!(f.section === 'universes' && f.value)) return false;
      return f.value.type === 'movieList' || f.value.type === 'extended-collection';
    });
    if (explicitIdFilters.length > 0) {
      var movieListIds = {};
      explicitIdFilters.forEach(function (f) {
        var ids = null;
        if (f.value.type === 'movieList' && Array.isArray(f.value.ids)) {
          ids = f.value.ids;
        } else if (f.value.type === 'extended-collection'
                   && typeof ORBIT_KEYWORD_IDS !== 'undefined'
                   && ORBIT_KEYWORD_IDS[f.value.id]
                   && Array.isArray(ORBIT_KEYWORD_IDS[f.value.id].ids)) {
          ids = ORBIT_KEYWORD_IDS[f.value.id].ids;
        }
        if (ids) ids.forEach(function (id) { movieListIds[id] = true; });
      });
      var dedupedMovieIds = Object.keys(movieListIds).map(function (k) { return parseInt(k, 10); });

      var hasOtherFilters = filters.some(function (f) {
        return f.section !== 'universes' && f.section !== 'awards';
      });

      if (!hasOtherFilters) {
        /* Fast path — pure movieList. Count is the deduped list size. */
        var nFast = dedupedMovieIds.length;
        countNumber.textContent = nFast > 9999 ? '9,999+' : nFast.toLocaleString();
        countEl.style.display = 'block';
        updateStreamingWarning(nFast, nFast);
        return;
      }

      /* Slow path — fetch full movie objects (cached) and apply filters. */
      if (!window._movieListCountCache) window._movieListCountCache = {};
      var mlApiKey = (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : '';
      var mlPromises = dedupedMovieIds.map(function (movieId) {
        if (window._movieListCountCache[movieId]) {
          return Promise.resolve(window._movieListCountCache[movieId]);
        }
        return fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + mlApiKey)
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            if (!data || !data.id) return null;
            /* Normalize: /movie/{id} returns genres: [{id,name},...]
               but applyClientSideCollectionFilters checks genre_ids. */
            if (Array.isArray(data.genres) && !data.genre_ids) {
              data.genre_ids = data.genres.map(function (g) { return g.id; });
            }
            window._movieListCountCache[movieId] = data;
            return data;
          })
          .catch(function () { return null; });
      });

      Promise.all(mlPromises).then(function (results) {
        var validMovies = results.filter(Boolean);
        var filteredMovies = applyClientSideCollectionFilters(validMovies, filters);
        var nMl = filteredMovies.length;
        countNumber.textContent = nMl > 9999 ? '9,999+' : nMl.toLocaleString();
        countEl.style.display = 'block';
        updateStreamingWarning(nMl, nMl);
      }).catch(function () {
        countEl.style.display = 'none';
      });

      return;
    }

    /* Collection counter — fires whenever any collection filter is
       present, regardless of mixed sibling filters. Collections are
       fetched from /collection/{id} (not a TMDB discover param), then
       other filters (genre, decade, year, rating) are applied
       client-side to the deduped movie list. Mirrors what the launch
       handler does at lines ~1593-1650 so the counter matches what
       Launch will actually return. Cache stores full movie objects
       (id + genre_ids + release_date + vote_average) so subsequent
       counter ticks can re-apply different filters without refetching. */
    var universeCollectionFilters = filters.filter(function (f) {
      return f.section === 'universes' && f.value && f.value.type === 'collection';
    });
    if (universeCollectionFilters.length > 0) {
      if (!window._collectionCountCache) window._collectionCountCache = {};

      var collectionIdsForCount = [];
      universeCollectionFilters.forEach(function (f) {
        if (f.value && Array.isArray(f.value.collections)) {
          collectionIdsForCount.push.apply(collectionIdsForCount, f.value.collections);
        }
      });

      var colApiKey = (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : '';
      var colPromises = collectionIdsForCount.map(function (colId) {
        if (window._collectionCountCache[colId]) {
          return Promise.resolve(window._collectionCountCache[colId]);
        }
        return fetch('https://api.themoviedb.org/3/collection/' + colId + '?api_key=' + colApiKey)
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            var movies = (data && Array.isArray(data.parts)) ? data.parts : [];
            window._collectionCountCache[colId] = movies;
            return movies;
          })
          .catch(function () { return []; });
      });

      Promise.all(colPromises).then(function (results) {
        var moviesById = {};
        results.forEach(function (movies) {
          movies.forEach(function (m) { if (m && m.id != null) moviesById[m.id] = m; });
        });
        var dedupedMovies = Object.keys(moviesById).map(function (k) { return moviesById[k]; });

        var filteredMovies = applyClientSideCollectionFilters(dedupedMovies, filters);
        var nUnique = filteredMovies.length;
        countNumber.textContent = nUnique > 9999 ? '9,999+' : nUnique.toLocaleString();
        countEl.style.display = 'block';
        /* Suppress streaming-coverage warning in collection mode — the
           count is constrained by the collection, not by streaming. */
        updateStreamingWarning(nUnique, nUnique);
      }).catch(function () {
        countEl.style.display = 'none';
      });

      return;
    }

    var hasAwards = filters.some(function (f) { return f.section === 'awards' && f.value; });
    var awardsDbReady = typeof AWARDS_DATABASE !== 'undefined';

    if (hasAwards && awardsDbReady && hasAwardsOnlyFilters(filters)) {
      try {
        var awardsOnlyCount = getAwardsMatchingIds(filters).length;
        countNumber.textContent = awardsOnlyCount > 9999 ? '9,999+' : awardsOnlyCount.toLocaleString();
        countEl.style.display = 'block';
        updateStreamingWarning(awardsOnlyCount, awardsOnlyCount);
      } catch (e) {
        countEl.style.display = 'none';
      }
      return;
    }

    var queryString;
    try {
      queryString = buildTMDBQueryFromFilters(filters);
    } catch (e) {
      countEl.style.display = 'none';
      return;
    }
    if (queryString == null) {
      countEl.style.display = 'none';
      return;
    }

    /* buildTMDBQueryFromFilters returns a query STRING (params.toString()),
       not a URLSearchParams. Re-parse so we can append api_key + page. */
    var apiKey = (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : '';
    var baseUrl = 'https://api.themoviedb.org/3/discover/movie';

    var urlParams = new URLSearchParams(queryString);
    urlParams.set('api_key', apiKey);
    urlParams.set('page', '1');

    /* Detect whether a watch filter is active. If so, we run a second
       parallel fetch with the streaming params stripped to compare
       coverage. Per Rule 9 — this doubles API spend, but only when a
       watch filter is active. Debounced 600ms. */
    var hasWatch = filters.some(function (f) { return f.section === 'watch'; });

    var fetchPrimary = fetch(baseUrl + '?' + urlParams.toString())
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });

    var fetchTotal;
    if (hasWatch) {
      var noStreamParams = new URLSearchParams(queryString);
      noStreamParams.set('api_key', apiKey);
      noStreamParams.set('page', '1');
      noStreamParams.delete('with_watch_providers');
      noStreamParams.delete('watch_region');
      noStreamParams.delete('watch_monetization_types');
      fetchTotal = fetch(baseUrl + '?' + noStreamParams.toString())
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
    } else {
      fetchTotal = Promise.resolve(null);
    }

    Promise.all([fetchPrimary, fetchTotal])
      .then(function (results) {
        var primary = results[0];
        var total   = results[1];
        if (primary && typeof primary.total_results === 'number') {
          var n = primary.total_results;

          if (hasAwards && awardsDbReady) {
            /* Mixed awards + TMDB filters. The earlier page-1
               extrapolation `(page1_awards_match / 20) × tmdb_total`
               blew up for sparse intersections (e.g. ~26 Oscar Best Doc
               winners × ~700k TMDB documentaries → 200k+ phantom result).
               Use the awards-set size as the ceiling instead — it's the
               authoritative upper bound. At launch, multi-page TMDB
               fetch + filterByAwards typically lands within a few films
               of this number. */
            var awardsCount = getAwardsMatchingIds(filters).length;
            countNumber.textContent = '~' + (awardsCount > 9999 ? '9,999+' : awardsCount.toLocaleString());
            countEl.style.display = 'block';
            /* Pass equal values so the streaming-coverage warning stays
               hidden — in awards mode the count is constrained by
               awards, not streaming. */
            updateStreamingWarning(awardsCount, awardsCount);
            return;
          }

          countNumber.textContent = n > 9999 ? '9,999+' : n.toLocaleString();
          countEl.style.display = 'block';

          var totalN = (total && typeof total.total_results === 'number')
            ? total.total_results : n;
          updateStreamingWarning(n, totalN);

          /* Zero-results guidance (2026-06-06): NORMAL TMDB branch only, and
             only past the mixed-awards early-return above — so awards /
             collection / movieList branches never reach this. Opt-in: render
             a quiet affordance; no counterfactual fetches fire until click. */
          if (n === 0) { showZeroGuidanceAffordance(filters, queryString); }
          else { hideZeroGuidance(); }
        } else {
          countEl.style.display = 'none';
          updateStreamingWarning(0, 0);
        }
      })
      .catch(function () {
        countEl.style.display = 'none';
        updateStreamingWarning(0, 0);
      });
  }, 600);
}

/* ============================================================
   ZERO-RESULTS GUIDANCE — Added 2026-06-06
   Opt-in, click-triggered "drop-one" counterfactual helper for the
   NORMAL TMDB discover branch only (wired from fetchFilmCount's
   normal .then when total_results === 0). Removing each active
   query-affecting filter in turn and re-counting via TMDB
   total_results, it suggests the single removal that best recovers
   results.

   Deliberately NOT triggered in the explicit-id / collection /
   awards-only / mixed-awards branches: there a recount is either
   meaningless (collection genuinely empty) or misleading (awards &
   settings sections never enter the TMDB query — see the no-op cases
   in buildTMDBQueryFromFilters — so a recount would wrongly report
   "removing it doesn't help"). Those same sections are excluded from
   the drop-one candidate list below.
   ============================================================ */

/* Sections whose filters are TMDB-query no-ops (handled client-side or
   not at all), so "removing" them can't change total_results. */
var ZERO_GUIDANCE_NOOP_SECTIONS = ['themes', 'settingWhere', 'settingWhen', 'basedOn', 'awards'];
var ZERO_GUIDANCE_HEALTHY_MIN = 20;   /* short-circuit + "viable" threshold */
var ZERO_GUIDANCE_BAND_LOW = 20;
var ZERO_GUIDANCE_BAND_HIGH = 75;
/* Module refs for the current failing search, set when the affordance
   is shown and consumed by the click handler. */
var _zeroGuidanceFilters = null;
var _zeroGuidanceQuery = null;

function _getZeroGuidanceEl() {
  return document.getElementById('orbitZeroGuidance');
}

/* Restrictiveness rank — lower is tried first. Keyword / collection /
   votes / rating lead (most likely to be the bottleneck); broad params
   (decade, region, language) trail. */
function _zeroGuidanceRank(f) {
  var s = f ? f.section : '';
  var v = (f && f.value) ? f.value : {};
  if (s === 'universes' && (v.type === 'keyword' || v.type === 'collection')) return 0;
  if (s === 'genres' && (v.type === 'keyword' || v.type === 'tmdb-keyword')) return 1;
  if (s === 'ratingsContent' && v.type === 'votes') return 2;
  if (s === 'ratingsContent' && v.type === 'rating') return 3;
  if (s === 'ratingsContent' && v.type === 'certification') return 4;
  if (s === 'production') return 5;
  if (s === 'people') return 6;
  if (s === 'watch') return 7;
  if (s === 'genres') return 8;            /* plain genre */
  if (s === 'timeEra' && v.type !== 'decade') return 9;   /* year / dateRange / runtime */
  if (s === 'regionLanguage' && v.type === 'language') return 10;
  if (s === 'timeEra' && v.type === 'decade') return 11;
  if (s === 'regionLanguage' && v.type === 'region') return 12;
  return 6;
}

function hideZeroGuidance() {
  _zeroGuidanceCache = null;
  _zeroGuidanceFilters = null;
  _zeroGuidanceQuery = null;
  var el = _getZeroGuidanceEl();
  if (el) {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

/* Collapsed state — a quiet one-line prompt + "see what to change"
   trigger. No counterfactual fetches fire here. A zero result makes the
   streaming-coverage message moot, so hide it while guidance shows. */
function showZeroGuidanceAffordance(filters, queryString, autoExpand) {
  var el = _getZeroGuidanceEl();
  if (!el) return;
  _zeroGuidanceFilters = Array.isArray(filters) ? filters : [];
  _zeroGuidanceQuery = queryString;

  var warn = document.getElementById('orbitStreamingWarning');
  if (warn) warn.style.display = 'none';

  /* Launch path (autoExpand) — the user has committed to launching, so the
     opt-in/click rationale that governs the counter path doesn't apply.
     Skip the collapsed prompt and compute + render suggestions immediately.
     runZeroCounterfactuals sets the container visible itself, so the
     visibility + streaming-warning coordination above still applies. */
  if (autoExpand) {
    runZeroCounterfactuals(_zeroGuidanceFilters, _zeroGuidanceQuery);
    return;
  }

  el.innerHTML =
    '<span class="ozg-prompt">No matches</span>' +
    '<button type="button" class="ozg-trigger">see what to change</button>';
  el.style.display = 'block';

  var trigger = el.querySelector('.ozg-trigger');
  if (trigger) {
    trigger.addEventListener('click', function () {
      runZeroCounterfactuals(_zeroGuidanceFilters, _zeroGuidanceQuery);
    });
  }
}

/* Render the resolved suggestion(s) into the affordance. */
function _renderZeroGuidanceResults(results) {
  var el = _getZeroGuidanceEl();
  if (!el) return;

  var viable = results.filter(function (r) { return r.count > 0; });
  if (viable.length === 0) {
    /* Graceful floor — structural zero. No fabricated number. */
    el.innerHTML =
      '<span class="ozg-prompt">These filters don’t overlap</span>' +
      '<span class="ozg-floor">try removing the most specific one</span>';
    el.style.display = 'block';
    return;
  }

  /* Prefer a removal that lands in the 20–75 sweet spot (highest within
     band), else the single removal whose recount is highest. */
  var inBand = viable.filter(function (r) {
    return r.count >= ZERO_GUIDANCE_BAND_LOW && r.count <= ZERO_GUIDANCE_BAND_HIGH;
  }).sort(function (a, b) { return b.count - a.count; });
  var rest = viable.filter(function (r) {
    return !(r.count >= ZERO_GUIDANCE_BAND_LOW && r.count <= ZERO_GUIDANCE_BAND_HIGH);
  }).sort(function (a, b) { return b.count - a.count; });
  var ordered = inBand.concat(rest).slice(0, 2);

  var btns = ordered.map(function (r) {
    var labelSafe = String(r.label == null ? '' : r.label)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    var idSafe = String(r.id == null ? '' : r.id).replace(/"/g, '&quot;');
    var nDisplay = r.count > 9999 ? '9,999+' : r.count.toLocaleString();
    return '<button type="button" class="ozg-suggestion" data-remove-id="' + idSafe + '">' +
           'Remove <span class="ozg-sug-label">' + labelSafe + '</span>' +
           ' <span class="ozg-sug-arrow">→</span> ' +
           '<span class="ozg-sug-count">' + nDisplay + ' results</span>' +
           '</button>';
  }).join('');

  el.innerHTML = '<span class="ozg-prompt">Try this</span><div class="ozg-suggestions">' + btns + '</div>';
  el.style.display = 'block';

  el.querySelectorAll('.ozg-suggestion').forEach(function (b) {
    b.addEventListener('click', function () {
      var rid = b.getAttribute('data-remove-id');
      if (!rid) return;
      state.filters = state.filters.filter(function (f) { return f.id !== rid; });
      updateUIFromState();   /* re-renders chips + re-runs fetchFilmCount */
    });
  });
}

/* Click handler — run the drop-one recounts. Reuses the normal-branch
   fetch shape (raw fetch against /discover/movie). Streaming params are
   stripped from every counterfactual so a dropped watch filter isn't
   silently re-injected from saved providers by buildTMDBQueryFromFilters. */
function runZeroCounterfactuals(filters, queryString) {
  var el = _getZeroGuidanceEl();
  if (!el) return;
  filters = Array.isArray(filters) ? filters : [];

  /* Cache hit for the current failing signature → re-render, no refetch. */
  if (_zeroGuidanceCache && _zeroGuidanceCache.sig === queryString) {
    _renderZeroGuidanceResults(_zeroGuidanceCache.results);
    return;
  }

  /* Candidates: only filters that actually affect the TMDB query. */
  var candidates = [];
  filters.forEach(function (f, idx) {
    if (!f || ZERO_GUIDANCE_NOOP_SECTIONS.indexOf(f.section) !== -1) return;
    candidates.push({ filter: f, idx: idx });
  });

  if (candidates.length === 0) {
    el.innerHTML =
      '<span class="ozg-prompt">These filters don’t overlap</span>' +
      '<span class="ozg-floor">try removing the most specific one</span>';
    el.style.display = 'block';
    return;
  }

  /* Restrictiveness order so the burst can short-circuit early. */
  candidates.sort(function (a, b) {
    return _zeroGuidanceRank(a.filter) - _zeroGuidanceRank(b.filter);
  });

  el.innerHTML = '<span class="ozg-prompt ozg-loading">Checking what to change…</span>';
  el.style.display = 'block';

  var apiKey = (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : '';
  var baseUrl = 'https://api.themoviedb.org/3/discover/movie';

  function recount(cand) {
    var filtersMinusOne = filters.filter(function (_, idx) { return idx !== cand.idx; });
    var q = buildTMDBQueryFromFilters(filtersMinusOne);
    var p = new URLSearchParams(q);
    /* Strip streaming so dropping a watch filter genuinely drops it. */
    p.delete('with_watch_providers');
    p.delete('watch_region');
    p.delete('watch_monetization_types');
    p.set('api_key', apiKey);
    p.set('page', '1');
    return fetch(baseUrl + '?' + p.toString())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var c = (data && typeof data.total_results === 'number') ? data.total_results : 0;
        return {
          id: cand.filter.id,
          label: cand.filter.label,
          count: c
        };
      })
      .catch(function () {
        return { id: cand.filter.id, label: cand.filter.label, count: 0 };
      });
  }

  /* Sequential burst, capped at candidate count (no multiplier), with
     early exit once a removal lands in the healthy band (>= 20). */
  var results = [];
  var i = 0;
  function step() {
    if (i >= candidates.length) return Promise.resolve();
    return recount(candidates[i]).then(function (res) {
      results.push(res);
      i++;
      if (res.count >= ZERO_GUIDANCE_HEALTHY_MIN) return;   /* short-circuit */
      return step();
    });
  }

  step().then(function () {
    _zeroGuidanceCache = { sig: queryString, results: results };
    _renderZeroGuidanceResults(results);
  }).catch(function () {
    var elx = _getZeroGuidanceEl();
    if (elx) {
      elx.innerHTML =
        '<span class="ozg-prompt">These filters don’t overlap</span>' +
        '<span class="ozg-floor">try removing the most specific one</span>';
      elx.style.display = 'block';
    }
  });
}

/* ============================================================
   FILTER TABS — Added May 1, 2026
   Replaces the .filter-grid card + popup system. All 11 tabs share
   the same content the old .focus-overlay used: each builder is
   reused untouched and rendered into the active panel's body.

   Rebuild-on-activate: only ONE panel body holds DOM at a time.
   On tab switch, the previously-active panel body is wiped before
   the new builder runs. This preserves collectLabelsForSection's
   getElementById assumptions (yearInput, ratingMin, runtimeMin,
   selectedRegionContainer, watchProviderChips, etc. are unique).

   Per-panel "Add to orbit" button mirrors the old addToSearchButton
   flow: collectLabelsForSection(sectionKey) -> mutate state.filters
   -> updateUIFromState(). For compound tabs (Setting, Source) each
   column has its own Add button scoped to its own section key.
   ============================================================ */
(function initFilterTabs() {
  var tabBar = document.getElementById('oftTabBar');
  var panelArea = document.getElementById('oftPanelArea');
  if (!tabBar || !panelArea) return;

  var BUILDERS = {
    people: function (root) { buildPeopleContent(root); },
    genres: function (root) { buildGenresContent(root); },
    timeEra: function (root) { buildTimeEraContent(root); },
    ratingsContent: function (root) { buildRatingsContentSection(root); },
    awards: function (root) { buildAwardsContent(root); },
    themes: function (root) { buildThemesContent(root); },
    regionLanguage: function (root) { buildRegionLanguageContent(root); },
    production: function (root) { buildProductionContent(root); },
    watch: function (root) { buildWatchContent(root); }
  };

  function makeAddButton(sectionKey, label) {
    var actions = document.createElement('div');
    actions.className = 'oft-panel-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'orbit-btn orbit-btn--primary oft-add-btn';
    btn.dataset.commitSection = sectionKey;
    btn.textContent = label || 'Add to orbit';
    actions.appendChild(btn);
    return actions;
  }

  function buildPanelBody(panel) {
    var body = panel.querySelector('.oft-panel-body');
    if (!body) return;
    body.innerHTML = '';

    var section = panel.dataset.section;

    if (section === 'setting-combined') {
      var wrap = document.createElement('div');
      wrap.className = 'oft-setting-combined';

      var colWhere = document.createElement('div');
      colWhere.className = 'oft-setting-col';
      try { buildSettingWhereContent(colWhere); }
      catch (e) { console.warn('[FilterTabs] settingWhere error', e); }

      var colWhen = document.createElement('div');
      colWhen.className = 'oft-setting-col';
      try { buildSettingWhenContent(colWhen); }
      catch (e) { console.warn('[FilterTabs] settingWhen error', e); }

      wrap.appendChild(colWhere);
      wrap.appendChild(colWhen);
      body.appendChild(wrap);
      return;
    }

    if (section === 'source-combined') {
      var wrap2 = document.createElement('div');
      wrap2.className = 'oft-source-combined';

      var colBased = document.createElement('div');
      colBased.className = 'oft-source-col';
      try { buildBasedOnContent(colBased); }
      catch (e) { console.warn('[FilterTabs] basedOn error', e); }

      var colUni = document.createElement('div');
      colUni.className = 'oft-source-col';
      try { buildUniversesContent(colUni); }
      catch (e) { console.warn('[FilterTabs] universes error', e); }

      wrap2.appendChild(colBased);
      wrap2.appendChild(colUni);
      body.appendChild(wrap2);
      return;
    }

    var fn = BUILDERS[section];
    if (typeof fn !== 'function') return;
    try { fn(body); }
    catch (e) { console.warn('[FilterTabs] build error', section, e); }
  }

  function clearPanelBody(panel) {
    if (!panel) return;
    var body = panel.querySelector('.oft-panel-body');
    if (body) body.innerHTML = '';
  }

  /* Move the singleton Add-to-orbit button into the active panel's
     header. It's a single DOM node that follows the active panel rather
     than being duplicated per panel. */
  function relocateAddToOrbit(panel) {
    var btn = document.getElementById('tabBarAddToOrbit');
    if (!btn || !panel) return;
    var header = panel.querySelector('.oft-panel-header');
    if (!header) return;
    if (btn.parentElement !== header) header.appendChild(btn);
  }

  function activateTab(tabName) {
    var tabs = tabBar.querySelectorAll('.oft-tab');
    var panels = panelArea.querySelectorAll('.oft-panel');

    panels.forEach(function (p) {
      if (p.classList.contains('oft-panel--active')) clearPanelBody(p);
      p.classList.remove('oft-panel--active');
    });
    tabs.forEach(function (t) { t.classList.remove('oft-tab--active'); });

    var newTab = tabBar.querySelector('.oft-tab[data-tab="' + tabName + '"]');
    var newPanel = document.getElementById('oft-panel-' + tabName);
    if (!newTab || !newPanel) return;

    newTab.classList.add('oft-tab--active');
    newPanel.classList.add('oft-panel--active');
    buildPanelBody(newPanel);
    relocateAddToOrbit(newPanel);
    updateTabDots();
  }

  tabBar.addEventListener('click', function (e) {
    var tab = e.target.closest('.oft-tab[data-tab]');
    if (!tab) return;
    activateTab(tab.dataset.tab);
  });

  /* Per-panel Add button: mirrors addToSearchButton click handler.
     Uses collectLabelsForSection unchanged — it reads from the
     fixed-ID controls that exist only in the active panel. */
  panelArea.addEventListener('click', function (e) {
    var btn = e.target.closest('.oft-add-btn[data-commit-section]');
    if (!btn) return;
    var sectionKey = btn.dataset.commitSection;
    if (!sectionKey) return;
    /* universes commits directly via commitKwFilter (Phase 1 keyword
       search). Skip the DOM-scrape rebuild so direct-committed
       filters aren't wiped. */
    if (sectionKey !== 'universes') {
      var labels = collectLabelsForSection(sectionKey);
      /* Preserve direct-committed tmdb-keyword filters (Phase 2 keyword
         search widget) so the legacy DOM scrape doesn't wipe them. */
      state.filters = state.filters.filter(function (f) {
        return f.section !== sectionKey ||
          (f.value && f.value.type === 'tmdb-keyword');
      });
      labels.forEach(function (item) {
        state.filters.push({
          id: sectionKey + '-' + item.label,
          section: sectionKey,
          label: item.label,
          value: item.value
        });
      });
    }
    updateUIFromState();
    updateTabDots();
    btn.classList.add('oft-add-btn--just-added');
    setTimeout(function () { btn.classList.remove('oft-add-btn--just-added'); }, 600);
  });

  /* Reset button (footer): same teardown as the sidebar reset. */
  var resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state.filters = [];
      state.genreLogic = 'or';
      state.regionLogic = 'or';
      try { sessionStorage.removeItem('orbit_search_criteria'); } catch (e) {}
      updateUIFromState();
      // Rebuild active panel so any in-panel selection state is wiped
      var active = panelArea.querySelector('.oft-panel--active');
      if (active) buildPanelBody(active);
      updateTabDots();
    });
  }

  /* data-tab → list of internal section keys. Compound tabs (setting,
     source) commit two sections per Add. */
  var TAB_TO_SECTIONS = {
    people:     ['people'],
    genres:     ['genres'],
    era:        ['timeEra'],
    ratings:    ['ratingsContent'],
    awards:     ['awards'],
    themes:     ['themes'],
    setting:    ['settingWhere', 'settingWhen'],
    source:     ['basedOn', 'universes'],
    region:     ['regionLanguage'],
    production: ['production'],
    watch:      ['watch']
  };

  /* Active-filter dot indicator on each tab. */
  function updateTabDots() {
    /* Phase 1a-ii: per-tab filter-COUNT badge (was presence-only dot).
       Same source as before — state.filters + TAB_TO_SECTIONS — just
       summed per section instead of a boolean .some(). No new state, no
       new triggers; runs at every existing updateTabDots call site. */
    var counts = {};
    state.filters.forEach(function (f) { counts[f.section] = (counts[f.section] || 0) + 1; });
    tabBar.querySelectorAll('.oft-tab').forEach(function (tab) {
      var keys = TAB_TO_SECTIONS[tab.dataset.tab] || [];
      var n = keys.reduce(function (sum, k) { return sum + (counts[k] || 0); }, 0);
      tab.classList.toggle('oft-tab--has-filter', n > 0);
      /* Lazily create the count badge once, then reuse it. */
      var badge = tab.querySelector('.oft-tab-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'oft-tab-badge';
        badge.setAttribute('aria-hidden', 'true');
        tab.appendChild(badge);
      }
      badge.textContent = n > 0 ? String(n) : '';
    });
  }

  /* Tab-bar Add to orbit: commits ALL section keys mapped to the
     active tab. Mirrors the per-section commit logic that used to live
     in the panel-footer .oft-add-btn handler. */
  var tabCommitBtn = document.getElementById('tabBarAddToOrbit');
  if (tabCommitBtn) {
    tabCommitBtn.addEventListener('click', function () {
      var activeTab = tabBar.querySelector('.oft-tab.oft-tab--active');
      if (!activeTab) return;
      var sectionKeys = TAB_TO_SECTIONS[activeTab.dataset.tab] || [];
      if (!sectionKeys.length) return;

      sectionKeys.forEach(function (sectionKey) {
        /* universes commits directly via commitKwFilter (Phase 1
           keyword search). Skip the DOM-scrape rebuild so
           direct-committed filters aren't wiped when the source-tab
           Add-to-orbit fires. */
        if (sectionKey === 'universes') return;
        var labels = collectLabelsForSection(sectionKey);
        /* Preserve direct-committed tmdb-keyword filters (Phase 2
           keyword search widget) so the legacy DOM scrape doesn't
           wipe them. */
        state.filters = state.filters.filter(function (f) {
          return f.section !== sectionKey ||
            (f.value && f.value.type === 'tmdb-keyword');
        });
        labels.forEach(function (item) {
          state.filters.push({
            id: sectionKey + '-' + item.label,
            section: sectionKey,
            label: item.label,
            value: item.value
          });
        });
      });

      updateUIFromState();
      updateTabDots();
      tabCommitBtn.classList.add('oft-add-btn--just-added');
      setTimeout(function () { tabCommitBtn.classList.remove('oft-add-btn--just-added'); }, 600);
    });
  }

  /* Wrap renderFilterChips so dot indicators stay in sync after any
     state.filters mutation (chip removal in the sidebar, restore from
     sessionStorage, etc.). */
  if (typeof window.renderFilterChips === 'function') {
    var _origRender = window.renderFilterChips;
    window.renderFilterChips = function () {
      var r = _origRender.apply(this, arguments);
      try { updateTabDots(); } catch (e) {}
      try { updateOrbitRing(); } catch (e) {}
      try { fetchFilmCount(); } catch (e) {}
      return r;
    };
  }

  /* Initial paint: People panel is marked active in HTML. */
  var initial = panelArea.querySelector('.oft-panel--active');
  if (initial) {
    buildPanelBody(initial);
    relocateAddToOrbit(initial);
  }
  updateTabDots();
  try { updateOrbitRing(); } catch (e) {}
  try { fetchFilmCount(); } catch (e) {}

/* ============================================================
   DISCOVERY ONBOARDING POPUP — Added 2026-05-05
                                Cadence revised 2026-05-16.
   Inactivity-triggered onboarding (20s no interaction).
   Cadence:
     • First 2 lifetime impressions: shows freely on inactivity.
     • After 2: shows at most once per rolling 7 days (gated by the
       last-shown timestamp). Count keeps incrementing — it tracks
       total impressions, not the cap.
     • Checkbox "don't show again" → permanent suppression.
   Close path: OrbitClose.close() (Rule 17 — Black Hole exit).
   Manual trigger: Shift+D force-opens (does not burn a count, does
   not update the last-shown timestamp, ignores the dismissed flag).
   Mirrors welcome-popup.js's Shift+P pattern.
   localStorage keys (registered in data/storage-keys.md):
     orbit_discovery_popup_count       number   total lifetime shows
     orbit_discovery_popup_dismissed   boolean  permanent
     orbit_discovery_popup_last_shown  number   ms since epoch
   ============================================================ */
(function () {
  var POPUP_COUNT_KEY = 'orbit_discovery_popup_count';
  var POPUP_DISMISSED_KEY = 'orbit_discovery_popup_dismissed';
  var POPUP_LAST_SHOWN_KEY = 'orbit_discovery_popup_last_shown';
  var INACTIVITY_DELAY = 20000;
  var ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  var LIFETIME_FREE_SHOWS = 2;

  var store = (window.OrbitUtils && window.OrbitUtils.store) || null;

  function readNumber(key) {
    if (store) return Number(store.get(key, 0)) || 0;
    var raw = localStorage.getItem(key);
    return raw ? (parseInt(raw, 10) || 0) : 0;
  }
  function readBool(key) {
    if (store) return store.get(key, false) === true;
    return localStorage.getItem(key) === 'true';
  }
  function writeValue(key, value) {
    if (store) { store.set(key, value); return; }
    localStorage.setItem(key, typeof value === 'string' ? value : String(value));
  }

  function shouldShowPopup() {
    if (readBool(POPUP_DISMISSED_KEY)) return false;
    var count = readNumber(POPUP_COUNT_KEY);
    if (count < LIFETIME_FREE_SHOWS) return true;
    var lastShown = readNumber(POPUP_LAST_SHOWN_KEY);
    if (!lastShown) return true;
    return (Date.now() - lastShown) >= ONE_WEEK_MS;
  }
  function incrementPopupCount() {
    writeValue(POPUP_COUNT_KEY, readNumber(POPUP_COUNT_KEY) + 1);
  }

  var overlay  = document.getElementById('discoveryOnboardingOverlay');
  var ctaBtn   = document.getElementById('discoveryOnboardingCta');
  var checkbox = document.getElementById('discoveryOnboardingDontShow');
  if (!overlay || !ctaBtn || !checkbox) return;

  var inactivityTimer = null;
  var hasShown = false;
  var isOpen = false;

  function showPopup() {
    if (hasShown || !shouldShowPopup()) return;
    hasShown = true;
    isOpen = true;
    overlay.hidden = false;
    incrementPopupCount();
    writeValue(POPUP_LAST_SHOWN_KEY, Date.now());
    detachInactivityListeners();
  }

  // Single dismissal path — all four triggers route through here, which
  // routes through OrbitClose.close() for the canonical Black Hole exit.
  function hidePopup() {
    if (!isOpen) return;
    isOpen = false;
    if (checkbox.checked) writeValue(POPUP_DISMISSED_KEY, true);
    if (window.OrbitClose && typeof window.OrbitClose.close === 'function') {
      window.OrbitClose.close(overlay);
    } else {
      // Fallback if orbit-close.js failed to load — should not happen in prod.
      overlay.hidden = true;
    }
  }

  function resetTimer() {
    if (hasShown || !shouldShowPopup()) return;
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showPopup, INACTIVITY_DELAY);
  }

  function attachInactivityListeners() {
    document.addEventListener('mousemove', resetTimer, { passive: true });
    document.addEventListener('click',     resetTimer, { passive: true });
    document.addEventListener('keypress',  resetTimer, { passive: true });
    document.addEventListener('scroll',    resetTimer, { passive: true });
  }
  function detachInactivityListeners() {
    document.removeEventListener('mousemove', resetTimer);
    document.removeEventListener('click',     resetTimer);
    document.removeEventListener('keypress',  resetTimer);
    document.removeEventListener('scroll',    resetTimer);
    if (inactivityTimer) { clearTimeout(inactivityTimer); inactivityTimer = null; }
  }

  // CTA → dismiss
  ctaBtn.addEventListener('click', function () { hidePopup(); });

  // Quick Search chips → close popup and apply the preset (so the
  // onboarding becomes actionable, not just illustrative).
  overlay.querySelectorAll('[data-onboarding-preset]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var name = btn.getAttribute('data-onboarding-preset');
      var preset = (typeof PRESET_POOL !== 'undefined')
        ? PRESET_POOL.find(function (p) { return p.name === name; })
        : null;
      hidePopup();
      if (preset && typeof applyPreset === 'function') {
        applyPreset(preset);
      }
    });
  });

  // Overlay click (outside popup body) → dismiss
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hidePopup();
  });

  // Checkbox checked → permanent dismissal AND close immediately
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) hidePopup();
  });

  // ESC → dismiss
  document.addEventListener('keydown', function (e) {
    if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) hidePopup();
  });

  // X button (.orbit-close inside the overlay) is handled by the global
  // orbit-close.js click delegate. We listen for the dispatched event so
  // checkbox state still maps to the dismissed flag.
  overlay.addEventListener('orbit:close', function () {
    if (!isOpen) return;
    isOpen = false;
    if (checkbox.checked) writeValue(POPUP_DISMISSED_KEY, true);
  });

  if (shouldShowPopup()) {
    attachInactivityListeners();
    resetTimer();
  }

  // Shift+D force-opens the popup. Bypasses the lifetime cap and the
  // dismissed flag. Does NOT increment the count. No-op while typing.
  function forceOpen() {
    if (isOpen) return;
    isOpen = true;
    overlay.hidden = false;
    detachInactivityListeners();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'D' && e.key !== 'd') return;
    if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    forceOpen();
  });
})();
/* === END DISCOVERY ONBOARDING POPUP === */

/* ============================================================
   COLLAPSIBLE DISCOVERY SECTIONS — Added 2026-05-16
   Toggles `.collapsed` on each .section-container when its
   .section-collapse-toggle is clicked. Per-section state
   persists in sessionStorage (per-tab, survives refresh,
   clears when tab closes). Keyed by .section-container's
   data-section attribute.
   localStorage keys (registered in data/storage-keys.md):
     orbit_discovery_collapsed_state  JSON object  {section: bool}
   ============================================================ */
(function () {
  var STORAGE_KEY = 'orbit_discovery_collapsed_state';
  var ICON_COLLAPSED = '+';   // +
  var ICON_EXPANDED  = '−';   // −

  var savedState = {};
  try {
    var raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) savedState = JSON.parse(raw) || {};
  } catch (e) { savedState = {}; }

  function persist() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedState)); }
    catch (e) {}
  }

  function applyCollapseState(section, collapsed) {
    if (!section) return;
    section.classList.toggle('collapsed', collapsed);
    var btn = section.querySelector('.section-collapse-toggle');
    if (!btn) return;
    var iconEl = btn.querySelector('.collapse-icon');
    if (iconEl) iconEl.textContent = collapsed ? ICON_COLLAPSED : ICON_EXPANDED;
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('aria-label', collapsed ? 'Expand section' : 'Collapse section');
  }

  /* The headline is informational; collapsing it on its own loses no
     functionality. Quick Searches and Filter Tabs are the two
     interactive sections — at least one of them must stay expanded so
     the user always has a way to actually filter films. */
  var CRITICAL_SECTIONS = ['quickSearches', 'filterTabs'];

  function isCriticalSection(section) {
    return !!section && section.dataset
      && CRITICAL_SECTIONS.indexOf(section.dataset.section) !== -1;
  }

  function countCriticalExpanded() {
    var n = 0;
    CRITICAL_SECTIONS.forEach(function (key) {
      var el = document.querySelector('.section-container[data-section="' + key + '"]');
      if (el && !el.classList.contains('collapsed')) n++;
    });
    return n;
  }

  document.querySelectorAll('.section-collapse-toggle').forEach(function (btn) {
    var section = btn.closest('.section-container');
    if (!section) return;
    var name = section.dataset.section;
    if (!name) return;

    if (savedState[name] === true) applyCollapseState(section, true);

    /* Clicking anywhere on a COLLAPSED bar (not just the small toggle
     button in the card's left padding) expands the section. Makes the
     + much easier to find — the whole stripe is the hit target. Does
     nothing when the section is already expanded (so clicking inside
     normal content doesn't accidentally collapse it). */
    section.addEventListener('click', function (e) {
      if (!section.classList.contains('collapsed')) return;
      // Avoid double-firing when the click was already on the toggle.
      if (e.target === btn || (btn.contains && btn.contains(e.target))) return;
      btn.click();
    });

    btn.addEventListener('click', function () {
      var nowCollapsed = !section.classList.contains('collapsed');

      /* Invariant: at least one of {quickSearches, filterTabs} must
         stay expanded. The headline can always be collapsed. Silently
         no-op if this click would collapse the last critical section. */
      if (nowCollapsed && isCriticalSection(section) && countCriticalExpanded() === 1) {
        return;
      }

      applyCollapseState(section, nowCollapsed);
      savedState[name] = nowCollapsed;
      persist();

      /* When headline OR filter tabs toggles, re-render Quick Searches
         so the tile count tracks getActivePresetCount() (5/10/15/20
         depending on which sections are collapsed). The freshly-
         shuffled tiles also act as a visual confirmation that the
         collapse took effect. */
      if ((name === 'headline' || name === 'filterTabs')
          && typeof renderPresets === 'function'
          && typeof pickEvergreens === 'function'
          && typeof getActivePresetCount === 'function') {
        renderPresets(pickEvergreens(getActivePresetCount()));
      }
    });
  });

  /* Defensive: if sessionStorage was corrupted or manually edited so
     that neither Quick Searches nor Filter Tabs is expanded, force
     Quick Searches open so the user has interactive UI available. */
  if (countCriticalExpanded() === 0) {
    var fallback = document.querySelector('.section-container[data-section="quickSearches"]')
                || document.querySelector('.section-container[data-section="filterTabs"]');
    if (fallback) {
      applyCollapseState(fallback, false);
      savedState[fallback.dataset.section] = false;
      persist();
    }
  }

  /* initPresets() runs BEFORE this IIFE applies the saved collapse
     state, so the initial preset render used a default count of 5.
     Now that the .collapsed classes are in place, re-render with the
     correct tile count for the actual collapse state (e.g. headline
     collapsed at load → 10 tiles, not 5). Skips if helpers aren't
     defined yet (defensive). */
  if (typeof renderPresets === 'function'
      && typeof pickEvergreens === 'function'
      && typeof getActivePresetCount === 'function') {
    var resolvedCount = getActivePresetCount();
    if (resolvedCount !== 5) {
      renderPresets(pickEvergreens(resolvedCount));
    }
  }
})();
/* === END COLLAPSIBLE DISCOVERY SECTIONS === */

/* Old HEADLINE CAROUSEL rotation IIFE removed Phase B (2026-05-27).
   Replaced by components/discover-carousel.js, which auto-boots on
   DOMContentLoaded and binds every [data-orbit-carousel]. */

/* Phase 1 (2026-05-31): the slide-3 cyan CTA's intercept handler was
   removed in this phase. It targeted .oc-cta-card[href="#quickSearchesSection"]
   to expand the Loaded Searches section + smooth-scroll into view when
   that CTA was the entry point. The CTA's href is now ../index.html
   (it points at the free-form Search rather than the in-page presets),
   so the selector no longer matches and the handler was dead code.
   The plain <a href="../index.html"> now navigates natively. Gold CTA
   (Randomizer) is unaffected — it was always a plain anchor. */

/* ============================================================
   QUICK SEARCHES "SHOW ALL" MODAL — Added 2026-05-16
   Opens a modal listing every preset in PRESET_POOL. Mirrors
   the existing main-page tile template (renderPresets) so the
   tiles look identical. Uses orbit-close.js for Black Hole
   exit (Rule 17): the X button has class "orbit-close" and the
   global click delegate handles it; backdrop and ESC routes
   call OrbitClose.close() programmatically. Body scroll lock
   released on the dispatched orbit:close event.
   ============================================================ */
(function () {
  var modal = document.getElementById('discoverPresetsModal');
  var openBtn = document.getElementById('discoverPresetShowAll');
  var backdrop = modal && modal.querySelector('.discover-presets-modal-backdrop');
  var grid = document.getElementById('discoverPresetsModalGrid');
  if (!modal || !openBtn || !grid) return;

  /* Phase 1 (2026-05-31): Filter-rail elements. May be absent if HTML
     ever ships without the rail block; the rest of the modal still
     works in that case (railInitialized stays false, populate() runs
     unfiltered). */
  var rail = document.getElementById('discoverPresetsModalRail');
  var railToggle = document.getElementById('discoverPresetsModalRailToggle');
  var railSearch = document.getElementById('discoverPresetsModalRailSearch');
  var railClear = document.getElementById('discoverPresetsModalRailClear');
  var railChecks = document.getElementById('discoverPresetsModalRailChecks');
  /* Phase 4 (2026-06-02): tab affordance (visible only when collapsed)
     and persistence key. Default first-view is EXPANDED; the user's
     choice is stored in orbit_presets_rail_collapsed (registered in
     data/storage-keys.md). */
  var railTab = document.getElementById('discoverPresetsModalRailTab');
  var RAIL_STATE_KEY = 'orbit_presets_rail_collapsed';
  var railInitialized = false;

  function buildTile(p, i, isFav) {
    var isSpotlight = p.color === 'spotlight';
    var classes = 'discover-preset discover-preset--' + p.color;
    if (isSpotlight) classes += ' discover-preset--spotlight';
    var tagClass = 'discover-preset-tag' + (isSpotlight ? ' discover-preset-tag--live' : '');
    var tagText = isSpotlight
      ? (p.streamingNow ? '● NOW STREAMING' : '● IN CINEMAS')
      : p.tag;
    var glyphClass = getPresetGlyphClass(p);
    var glyphSpan  = glyphClass ? '<span class="og-qs ' + glyphClass + ' discover-preset-glyph" aria-hidden="true"></span>' : '';
    /* 2026-05-24 Phase 3 — Hybrid B decorations (mirrors renderPresets). */
    var decorations = glyphClass
      ? '<span class="discover-preset-glow" aria-hidden="true"></span>' +
        '<span class="discover-preset-badge" aria-hidden="true">' + glyphSpan + '</span>'
      : '';
    var tagSpan  = '<span class="' + tagClass + '">' + tagText + '</span>';
    var nameSpan = '<span class="discover-preset-name">' + p.name + '</span>';
    var inner = isSpotlight ? (tagSpan + nameSpan) : (decorations + nameSpan + tagSpan);
    /* Phase 2 (2026-06-01): favourite ★ on every tile. Stable ID for
       built-ins is preset.name (matches the orbit_favourite_presets ID
       scheme). Rendered as <span role="button"> to avoid nested-button
       HTML; click delegation on .grid stopPropagations the outer tile. */
    var favId = String(p.name || '').replace(/"/g, '&quot;');
    var favClass = 'discover-preset-fav-btn' + (isFav ? ' is-fav' : '');
    var favSpan = '<span class="' + favClass + '" role="button" tabindex="0" data-fav-id="' + favId + '" aria-label="Toggle favourite">★</span>';
    return '<button class="' + classes + '" type="button" data-preset-index="' + i + '">' + inner + favSpan + '</button>';
  }

  /* Phase 2 (2026-06-01): tile for a user-saved search. Distinct purple
     variant + "MY SEARCH" badge + remove × in the bottom-right corner.
     Stable ID = saved.id (UUID), used for both data-saved-id (apply)
     and data-fav-id (favourite). */
  function buildSavedTile(s, isFav) {
    var nameSafe = String(s.name == null ? 'Untitled' : s.name)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var idSafe = String(s.id || '').replace(/"/g, '&quot;');
    var dateStr = '';
    try {
      var d = new Date(s.savedAt);
      if (!isNaN(d.getTime())) dateStr = d.toLocaleDateString();
    } catch (e) { /* no date — that's fine */ }
    var favClass = 'discover-preset-fav-btn' + (isFav ? ' is-fav' : '');
    return '<button class="discover-preset discover-preset--purple discover-preset--saved" type="button" data-saved-id="' + idSafe + '">' +
           '<span class="discover-preset-glow" aria-hidden="true"></span>' +
           '<span class="discover-preset-saved-badge">MY SEARCH</span>' +
           '<span class="discover-preset-name">' + nameSafe + '</span>' +
           '<span class="discover-preset-tag">SAVED' + (dateStr ? ' &middot; ' + dateStr : '') + '</span>' +
           '<span class="' + favClass + '" role="button" tabindex="0" data-fav-id="' + idSafe + '" aria-label="Toggle favourite">★</span>' +
           '<span class="discover-preset-remove-btn" role="button" tabindex="0" data-saved-remove="' + idSafe + '" aria-label="Remove">&times;</span>' +
           '</button>';
  }

  /* Phase 2 (2026-06-01): populate accepts an ordered candidate array of
     `{kind:'saved'|'preset', data, fav}` items. Saved tiles render FIRST
     (so user-saved searches surface at the top of the grid). Click
     delegation on the grid covers tile-apply / favourite-toggle / saved-
     remove via .grid-level event delegation, so this only sets innerHTML. */
  function populate(candidates) {
    if (typeof PRESET_POOL === 'undefined' || !Array.isArray(PRESET_POOL)) return;
    var list = Array.isArray(candidates) ? candidates : getFilteredCandidates();
    if (list.length === 0) {
      grid.innerHTML = '<div class="discover-presets-modal-empty">No searches match.</div>';
      return;
    }
    grid.innerHTML = list.map(function (item) {
      if (item.kind === 'saved') {
        return buildSavedTile(item.data, !!item.fav);
      }
      var origIdx = PRESET_POOL.indexOf(item.data);
      return buildTile(item.data, origIdx, !!item.fav);
    }).join('');
  }

  /* Phase 2 (2026-06-01): single delegated handler on the grid covers
     all interactions (apply preset / apply saved / toggle favourite /
     remove saved). Bound once per modal lifetime (innerHTML resets wipe
     child listeners but not the parent's). */
  function onGridClick(e) {
    var favEl = e.target.closest && e.target.closest('.discover-preset-fav-btn');
    if (favEl) {
      e.preventDefault();
      e.stopPropagation();
      var favId = favEl.getAttribute('data-fav-id');
      if (!favId) return;
      var nowFav = (typeof window.__orbitToggleFavourite === 'function') && window.__orbitToggleFavourite(favId);
      favEl.classList.toggle('is-fav', !!nowFav);
      return;
    }
    var removeEl = e.target.closest && e.target.closest('.discover-preset-remove-btn');
    if (removeEl) {
      e.preventDefault();
      e.stopPropagation();
      var savedId = removeEl.getAttribute('data-saved-remove');
      if (!savedId || typeof window.__orbitLoadSavedSearches !== 'function') return;
      /* Phase 8 (2026-06-02): two-click confirm. First click → enter
         `.is-confirming` state (red filled "DEL?" via CSS) and start a
         3-second revert timer. Second click within that window → run the
         actual delete. The 3-second timer is stored on the element so a
         tile re-render (applyFilters wipes innerHTML) effectively cancels
         the pending revert too (the element is gone). */
      if (!removeEl.classList.contains('is-confirming')) {
        removeEl.classList.add('is-confirming');
        var prevText = removeEl.textContent;
        removeEl.textContent = 'DEL?';
        var t = setTimeout(function () {
          if (removeEl.isConnected) {
            removeEl.classList.remove('is-confirming');
            removeEl.textContent = prevText;
          }
        }, 3000);
        removeEl._phase8Timer = t;
        return;
      }
      /* Confirmed — cancel revert + delete. */
      if (removeEl._phase8Timer) {
        clearTimeout(removeEl._phase8Timer);
        removeEl._phase8Timer = null;
      }
      var arr = window.__orbitLoadSavedSearches();
      var idx = -1;
      for (var k = 0; k < arr.length; k++) { if (arr[k] && arr[k].id === savedId) { idx = k; break; } }
      if (idx === -1) return;
      arr.splice(idx, 1);
      window.__orbitPersistSavedSearches(arr);
      /* Also remove from favourites if present. */
      var favs = window.__orbitLoadFavourites();
      var fidx = favs.indexOf(savedId);
      if (fidx !== -1) { favs.splice(fidx, 1); window.__orbitPersistFavourites(favs); }
      applyFilters();
      return;
    }
    var savedTile = e.target.closest && e.target.closest('[data-saved-id]');
    if (savedTile) {
      var sid = savedTile.getAttribute('data-saved-id');
      var saved = (typeof window.__orbitLoadSavedSearches === 'function') ? window.__orbitLoadSavedSearches() : [];
      var match = null;
      for (var m = 0; m < saved.length; m++) { if (saved[m] && saved[m].id === sid) { match = saved[m]; break; } }
      if (match && typeof window.__orbitApplySavedSearch === 'function') {
        window.__orbitApplySavedSearch(match);
      }
      closeModal();
      return;
    }
    var presetTile = e.target.closest && e.target.closest('[data-preset-index]');
    if (presetTile) {
      var pi = parseInt(presetTile.getAttribute('data-preset-index'), 10);
      if (isNaN(pi)) return;
      var preset = PRESET_POOL[pi];
      if (preset && typeof applyPreset === 'function') applyPreset(preset);
      closeModal();
      return;
    }
  }

  /* Phase 1 (2026-05-31): split every PRESET_POOL[i].tag on " · ", trim
     each part, accumulate distinct tokens + per-token count. Returns
     [{ token: 'AWARDS', count: 8 }, ...] alphabetised by raw token. */
  function enumerateTokens() {
    if (typeof PRESET_POOL === 'undefined' || !Array.isArray(PRESET_POOL)) return [];
    var counts = {};
    PRESET_POOL.forEach(function (p) {
      var rawTag = p && typeof p.tag === 'string' ? p.tag : '';
      rawTag.split(' · ').forEach(function (part) {
        var token = part.trim();
        if (!token) return;
        counts[token] = (counts[token] || 0) + 1;
      });
    });
    return Object.keys(counts).sort().map(function (t) {
      return { token: t, count: counts[t] };
    });
  }

  /* Phase 1 (2026-05-31): convert raw token e.g. "IN CINEMAS" → "In Cinemas"
     for display. Match continues to use the raw token (case-sensitive)
     against preset.tag splits. */
  function titleCase(s) {
    return s.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /* Phase 1 (2026-05-31): render checkboxes once at first init.
     Phase 2 (2026-06-01): prepend two SPECIAL boxes (My Searches /
     Favourites) above the dynamic token list. Specials are distinguished
     by `data-special` (not a `value`). Token boxes keep the `value="…"`
     contract from Phase 1. */
  function renderRailCheckboxes() {
    if (!railChecks) return;
    var entries = enumerateTokens();
    var specials =
      '<div class="discover-presets-modal-rail-specials">' +
        '<label class="discover-presets-modal-rail-check">' +
          '<input type="checkbox" data-special="saved">' +
          '<span class="discover-presets-modal-rail-check-name">My Searches</span>' +
        '</label>' +
        '<label class="discover-presets-modal-rail-check">' +
          '<input type="checkbox" data-special="favourite">' +
          '<span class="discover-presets-modal-rail-check-name">Favourites</span>' +
        '</label>' +
      '</div>';
    var tokens = entries.map(function (entry) {
      var safe = String(entry.token).replace(/"/g, '&quot;');
      return '<label class="discover-presets-modal-rail-check">' +
             '<input type="checkbox" value="' + safe + '">' +
             '<span class="discover-presets-modal-rail-check-name">' + titleCase(entry.token) + '</span>' +
             '<span class="discover-presets-modal-rail-check-count">' + entry.count + '</span>' +
             '</label>';
    }).join('');
    railChecks.innerHTML = specials + tokens;
    railChecks.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', applyFilters);
    });
  }

  /* ============================================================
     SAVED-SEARCH TOKEN-MEMBERSHIP MAP — Added 2026-06-02
     ------------------------------------------------------------
     Saved searches don't have a `tag` string, so they're classified
     against the rail's category tick-boxes by translating their
     state.filters' `section` keys to the same token vocabulary the
     built-in presets use. A saved search matches a ticked token if
     any of its sections maps to that token.

     This is the touch-point if the filter-state schema changes in
     future: update SECTION_TO_TOKENS to keep saved-search
     membership accurate. (Phase 9 ranking/cue was reverted on
     2026-06-02 — only membership remains.)
     ============================================================ */
  var SECTION_TO_TOKENS = {
    genres:         ['GENRE'],
    timeEra:        ['ERA', 'DECADE'],
    regionLanguage: ['REGION'],
    ratingsContent: ['RATING'],
    awards:         ['AWARDS'],
    basedOn:        ['SOURCE'],
    production:     ['FRANCHISE'],
    themes:         ['THEME'],
    universes:      ['FRANCHISE']
  };

  /* Derive the union of tokens a saved search covers — used by
     getFilteredCandidates to decide whether a saved tile is kept
     when one or more category tick-boxes are active. */
  function getSavedMeta(s) {
    var sections = {};
    var filters = (s && s.state && Array.isArray(s.state.filters)) ? s.state.filters : [];
    filters.forEach(function (f) { if (f && f.section) sections[f.section] = true; });
    var tokens = {};
    Object.keys(sections).forEach(function (k) {
      var arr = SECTION_TO_TOKENS[k] || [];
      arr.forEach(function (t) { tokens[t] = true; });
    });
    return { tokens: tokens };
  }

  /* Phase 2 (2026-06-01): merged saved + preset filter pipeline.
     Returns ordered candidate list `[saved..., preset...]` with each
     item shaped as `{kind:'saved'|'preset', data, fav}`. Combine logic:
       - text input   → case-insensitive substring on name (+ tag for presets).
       - token boxes  → OR membership. Saved searches participate via
         SECTION_TO_TOKENS / getSavedMeta (added 2026-06-02 — replaces
         the original "any ticked token excludes saved" rule).
       - "My Searches" → restrict to saved entries only.
       - "Favourites"  → restrict to items whose ID is in favourites.
     Order is the default "saved first, then PRESET_POOL order" — no
     ranking is applied. */
  function getFilteredCandidates() {
    var search = railSearch ? (railSearch.value || '').trim().toLowerCase() : '';
    var activeTokens = [];
    var savedOnly = false;
    var favouriteOnly = false;
    if (railChecks) {
      railChecks.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
        var sp = cb.getAttribute('data-special');
        if (sp === 'saved') savedOnly = true;
        else if (sp === 'favourite') favouriteOnly = true;
        else activeTokens.push(cb.value);
      });
    }
    var saved = (typeof window.__orbitLoadSavedSearches === 'function') ? window.__orbitLoadSavedSearches() : [];
    var favs = (typeof window.__orbitLoadFavourites === 'function') ? window.__orbitLoadFavourites() : [];
    var favSet = {};
    for (var fi = 0; fi < favs.length; fi++) favSet[favs[fi]] = true;

    var filteredSaved = saved.filter(function (s) {
      if (!s) return false;
      if (favouriteOnly && !favSet[s.id]) return false;
      if (search && String(s.name || '').toLowerCase().indexOf(search) === -1) return false;
      /* Saved-search token membership (2026-06-02): include the entry
         only if at least one of its SECTION_TO_TOKENS-derived tokens
         matches an active token. Excluded otherwise. */
      if (activeTokens.length > 0) {
        var meta = getSavedMeta(s);
        var hit = false;
        for (var ti = 0; ti < activeTokens.length; ti++) {
          if (meta.tokens[activeTokens[ti]]) { hit = true; break; }
        }
        if (!hit) return false;
      }
      return true;
    }).map(function (s) {
      return { kind: 'saved', data: s, fav: !!favSet[s.id] };
    });

    var filteredPresets = savedOnly ? [] : PRESET_POOL.filter(function (p) {
      if (!p) return false;
      if (favouriteOnly && !favSet[p.name]) return false;
      var nameLower = String(p.name || '').toLowerCase();
      var tagLower  = String(p.tag  || '').toLowerCase();
      if (search && nameLower.indexOf(search) === -1 && tagLower.indexOf(search) === -1) return false;
      if (activeTokens.length > 0) {
        var rawTags = String(p.tag || '').split(' · ').map(function (s) { return s.trim(); });
        if (!activeTokens.some(function (t) { return rawTags.indexOf(t) !== -1; })) return false;
      }
      return true;
    }).map(function (p) {
      return { kind: 'preset', data: p, fav: !!favSet[p.name] };
    });

    return filteredSaved.concat(filteredPresets);
  }

  function applyFilters() {
    populate(getFilteredCandidates());
    /* Re-measure compact classes after every re-render so newly-shown
       tiles get the same name-fits-in-2-lines treatment. */
    applyCompactClasses(grid);
  }

  function initRail() {
    if (railInitialized) return;
    /* Phase 2 (2026-06-01): grid-level delegated click handler — bound
       ONCE per modal lifetime regardless of whether the rail HTML exists
       (delegation covers tile apply / fav toggle / remove for both built-
       in and saved tiles). Re-renders set innerHTML, which wipes child
       listeners; the parent-level listener persists. */
    if (grid && !grid._phase2Bound) {
      grid.addEventListener('click', onGridClick);
      grid._phase2Bound = true;
    }
    if (!rail) { railInitialized = true; return; }  /* HTML lacks rail — fall back gracefully. */

    renderRailCheckboxes();

    if (railSearch) railSearch.addEventListener('input', applyFilters);

    if (railClear) {
      railClear.addEventListener('click', function () {
        if (railSearch) railSearch.value = '';
        if (railChecks) {
          railChecks.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
            cb.checked = false;
          });
        }
        applyFilters();
      });
    }

    /* Phase 4 (2026-06-02): centralised rail-state setter. Sets the
       .is-collapsed class + aria-expanded on BOTH the rail-head toggle
       AND the collapse-to-tab control. `persist=true` writes the choice
       to localStorage; `persist=false` is used for the first-open
       restore (so reading from storage doesn't immediately re-write
       the same value). */
    function setRailCollapsed(collapsed, persist) {
      collapsed = !!collapsed;
      rail.classList.toggle('is-collapsed', collapsed);
      if (railToggle) {
        /* Toggle reflects whether the rail (its target) is expanded. */
        railToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        railToggle.innerHTML = '&times;';  /* always × when visible; tab is the "show" affordance */
      }
      if (railTab) {
        /* Tab's aria-expanded === "false" means rail is collapsed → tab
           visible (CSS rule keyed on the attribute). */
        railTab.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      }
      if (persist) {
        try { localStorage.setItem(RAIL_STATE_KEY, JSON.stringify(collapsed)); }
        catch (e) { /* storage unavailable — preference doesn't persist */ }
      }
    }

    if (railToggle) {
      railToggle.addEventListener('click', function (e) {
        /* Phase 5 (2026-06-02): play the site's Black Hole spin on the X
           (reuses orbit-x-blackhole / orbit-x-fade keyframes from
           orbit-close.css via the .spinning class scoped to this
           selector). The toggle does NOT carry .orbit-close, so the
           global orbit-close.js delegate never resolves a popup target
           and the Show-all modal stays open — only the X visual fires.
           The existing 250ms width wipe runs in parallel via
           setRailCollapsed below; the two play together. */
        var willCollapse = !rail.classList.contains('is-collapsed');
        if (willCollapse) {
          railToggle.classList.add('spinning');
          /* Remove the class once the animation ends so the X resets to
             its default state before the next open. */
          var onSpinEnd = function () {
            railToggle.classList.remove('spinning');
            railToggle.removeEventListener('animationend', onSpinEnd);
          };
          railToggle.addEventListener('animationend', onSpinEnd);
        }
        setRailCollapsed(willCollapse, true);
      });
    }
    if (railTab) {
      railTab.addEventListener('click', function () {
        /* If the user re-opens mid-spin, force-clear the .spinning class
           so the X isn't stuck at scale(0) when the rail wipes back in. */
        if (railToggle) railToggle.classList.remove('spinning');
        setRailCollapsed(false, true);  /* tab click always expands */
      });
    }

    /* Phase 4 (2026-06-02): restore persisted state on first init. If
       no preference is stored (first-ever view of the modal), default
       to EXPANDED so the user sees the filter affordances exist. The
       legacy ≤650-default-collapse is dropped — persistence covers it. */
    var storedCollapsed = null;
    try {
      var raw = localStorage.getItem(RAIL_STATE_KEY);
      if (raw !== null) {
        var parsed = JSON.parse(raw);
        if (typeof parsed === 'boolean') storedCollapsed = parsed;
      }
    } catch (e) { /* corrupted / unavailable — fall through to default */ }
    setRailCollapsed(storedCollapsed === true, false);

    railInitialized = true;
  }

  function openModal() {
    /* Phase 1 (2026-05-31): initialise the rail (token checkboxes + event
       wiring) on first open, then render the grid through the filter
       pipeline so any persisted filter state from a previous open is
       honoured. */
    initRail();
    applyFilters();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    /* Phase 3.1: measure name lines AFTER the modal is visible — a
       hidden element has no layout so scrollHeight reads 0. Idempotent
       across opens. */
    applyCompactClasses(grid);
  }

  function closeModal() {
    if (window.OrbitClose && typeof window.OrbitClose.close === 'function') {
      window.OrbitClose.close(modal);
    } else {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  openBtn.addEventListener('click', openModal);

  // Backdrop click → close
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // ESC → close (only when modal is open)
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && !modal.hidden) closeModal();
  });

  // X button is handled by orbit-close.js global delegate; this listener
  // releases the body scroll lock when the close animation completes.
  modal.addEventListener('orbit:close', function () {
    document.body.style.overflow = '';
  });
})();
/* === END QUICK SEARCHES MODAL === */
})();

/* ============================================================
   PHASE 2 (2026-06-01) — Saved searches + Favourites + Save button.
   Defines storage helpers, state-signature comparator, applySavedSearch,
   the sidebar Save button + visibility logic, and wraps
   window.renderFilterChips so the Save button re-evaluates after every
   chip render. Exposes helpers on window.__orbit* so:
     - pickEvergreens (above) can read favourites for weighted sampling,
     - the Show-all modal IIFE (above) can list saved + toggle fav + remove,
     - applyPreset (above) can stamp window.__orbitLastAppliedSig after
       a pristine apply (so the Save button stays hidden until divergence).
   localStorage keys: orbit_saved_searches, orbit_favourite_presets
   (registered in data/storage-keys.md).
   ============================================================ */
(function () {
  var SAVED_KEY = 'orbit_saved_searches';
  var FAV_KEY = 'orbit_favourite_presets';

  function loadJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return [];
      var v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function persistJSON(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {}
  }
  function loadSavedSearches() { return loadJSON(SAVED_KEY); }
  function persistSavedSearches(arr) { persistJSON(SAVED_KEY, arr); }
  function loadFavourites() { return loadJSON(FAV_KEY); }
  function persistFavourites(arr) { persistJSON(FAV_KEY, arr); }
  function isFavourite(id) { return loadFavourites().indexOf(id) !== -1; }
  function toggleFavourite(id) {
    if (!id) return false;
    var favs = loadFavourites();
    var idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    persistFavourites(favs);
    return idx === -1;  /* true = now favourite, false = now removed */
  }

  /* Stable JSON serialisation of the filter state for divergence
     comparison. Filter entries are sorted by id so ordering doesn't
     spuriously flag user-modification. */
  function stateSignature(filters, genreLogic) {
    var sorted = (filters || []).slice().sort(function (a, b) {
      var ai = String(a && a.id || '');
      var bi = String(b && b.id || '');
      return ai < bi ? -1 : ai > bi ? 1 : 0;
    });
    try { return JSON.stringify({ f: sorted, g: genreLogic || 'or' }); }
    catch (e) { return null; }
  }

  /* Apply a saved search by deep-cloning its state into the page's
     state object and triggering the existing UI-refresh path (mirrors
     applyPreset). Also stamps __orbitLastAppliedSig so the Save button
     stays hidden until the user edits. */
  function applySavedSearch(saved) {
    if (!saved || !saved.state || typeof state === 'undefined') return;
    try {
      state.filters = JSON.parse(JSON.stringify(saved.state.filters || []));
    } catch (e) { state.filters = []; }
    state.genreLogic = saved.state.genreLogic || 'or';
    if ('regionLogic' in saved.state) state.regionLogic = saved.state.regionLogic || 'or';
    if (typeof updateUIFromState === 'function') updateUIFromState();
    if (typeof window.renderFilterChips === 'function') window.renderFilterChips();
    window.__orbitLastAppliedSig = stateSignature(state.filters, state.genreLogic);
  }

  /* Expose helpers globally for pickEvergreens + modal IIFE. */
  window.__orbitLoadSavedSearches = loadSavedSearches;
  window.__orbitPersistSavedSearches = persistSavedSearches;
  window.__orbitLoadFavourites = loadFavourites;
  window.__orbitPersistFavourites = persistFavourites;
  window.__orbitIsFavourite = isFavourite;
  window.__orbitToggleFavourite = toggleFavourite;
  window.__orbitStateSignature = stateSignature;
  window.__orbitApplySavedSearch = applySavedSearch;
  window.__orbitLastAppliedSig = null;

  /* Save button visibility: shown iff state.filters is non-empty AND
     the current state diverges from the last-applied preset / saved
     signature (or no apply happened). */
  function isUserModifiedState() {
    if (typeof state === 'undefined' || !state.filters || state.filters.length === 0) return false;
    if (!window.__orbitLastAppliedSig) return true;
    return stateSignature(state.filters, state.genreLogic) !== window.__orbitLastAppliedSig;
  }
  function updateSaveButtonVisibility() {
    var btn = document.getElementById('saveSearchButton');
    if (!btn) return;
    btn.hidden = !isUserModifiedState();
  }
  window.__orbitUpdateSaveBtn = updateSaveButtonVisibility;

  /* Save button click: prompt for a name, dedup by appending " (2)" etc.,
     deep clone state, persist. */
  function uniqueName(name, existing) {
    var base = String(name || '').trim() || 'Untitled';
    var names = {};
    existing.forEach(function (s) { if (s && s.name) names[s.name] = true; });
    if (!names[base]) return base;
    var n = 2;
    while (names[base + ' (' + n + ')']) n++;
    return base + ' (' + n + ')';
  }
  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    /* Fallback for older browsers. */
    return 'saved-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }
  /* Phase 3 (2026-06-01): commit a new saved search. Used by the styled
     modal below (replaces the previous window.prompt). Returns true if
     persisted, false if blocked (empty/whitespace name). */
  function commitSaveWithName(name) {
    var trimmed = String(name || '').trim();
    if (!trimmed) return false;
    if (typeof state === 'undefined') return false;
    var existing = loadSavedSearches();
    var finalName = uniqueName(trimmed, existing);
    var entry = {
      id: makeId(),
      name: finalName,
      state: {
        filters: JSON.parse(JSON.stringify(state.filters || [])),
        genreLogic: state.genreLogic || 'or',
        regionLogic: state.regionLogic || 'or'
      },
      savedAt: Date.now()
    };
    existing.push(entry);
    persistSavedSearches(existing);
    /* Stamp the signature so the just-saved state reads as pristine
       until the user edits — Save button hides immediately. */
    window.__orbitLastAppliedSig = stateSignature(state.filters, state.genreLogic);
    updateSaveButtonVisibility();
    return true;
  }

  /* Phase 3 (2026-06-01): styled save-search modal — replaces
     window.prompt with the page's existing cyan popup language.
     Dismissal via X (orbit-close.js Black Hole), Esc, backdrop click,
     or Cancel button. Save button + Enter on input commit through
     commitSaveWithName; empty/whitespace shows an inline hint. */
  var saveModal = document.getElementById('saveSearchModal');
  var saveModalBackdrop = saveModal && saveModal.querySelector('.save-search-modal-backdrop');
  var saveModalInput = document.getElementById('saveSearchModalInput');
  var saveModalHint = document.getElementById('saveSearchModalHint');
  var saveModalSaveBtn = document.getElementById('saveSearchModalSave');
  var saveModalCancelBtn = document.getElementById('saveSearchModalCancel');

  function openSaveModal() {
    if (!saveModal) return;
    if (saveModalInput) saveModalInput.value = '';
    if (saveModalHint) saveModalHint.hidden = true;
    saveModal.hidden = false;
    document.body.style.overflow = 'hidden';
    /* Defer focus so the popup paint finishes first; some browsers
       won't focus a node that just transitioned from display:none. */
    setTimeout(function () { if (saveModalInput) saveModalInput.focus(); }, 0);
  }
  function closeSaveModal() {
    if (!saveModal) return;
    if (window.OrbitClose && typeof window.OrbitClose.close === 'function') {
      window.OrbitClose.close(saveModal);
    } else {
      saveModal.hidden = true;
      document.body.style.overflow = '';
    }
  }
  function attemptSave() {
    var name = saveModalInput ? saveModalInput.value : '';
    if (!String(name).trim()) {
      if (saveModalHint) saveModalHint.hidden = false;
      if (saveModalInput) saveModalInput.focus();
      return;
    }
    var ok = commitSaveWithName(name);
    if (ok) closeSaveModal();
  }

  var saveBtn = document.getElementById('saveSearchButton');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (!isUserModifiedState()) return;
      if (saveModal) {
        openSaveModal();
      } else {
        /* HTML lacks the modal — fall back to the original prompt path
           so the feature still works (defensive — shouldn't happen on
           the live page since the modal is in discover.html Phase 3). */
        var raw = window.prompt('Name this search:', '');
        if (raw === null) return;
        if (commitSaveWithName(raw)) { /* saved */ }
      }
    });
  }

  if (saveModal) {
    /* Hint disappears as soon as the user starts typing. */
    if (saveModalInput) {
      saveModalInput.addEventListener('input', function () {
        if (saveModalHint && !saveModalHint.hidden) saveModalHint.hidden = true;
      });
      /* Enter submits. Shift-Enter does nothing special (single-line input). */
      saveModalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          attemptSave();
        }
      });
    }
    if (saveModalSaveBtn) saveModalSaveBtn.addEventListener('click', attemptSave);
    if (saveModalCancelBtn) saveModalCancelBtn.addEventListener('click', closeSaveModal);
    if (saveModalBackdrop) saveModalBackdrop.addEventListener('click', closeSaveModal);
    /* Esc — only when modal is open. */
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && !saveModal.hidden) closeSaveModal();
    });
    /* Body-scroll lock released on Black Hole close. */
    saveModal.addEventListener('orbit:close', function () {
      document.body.style.overflow = '';
    });
  }

  /* Wrap window.renderFilterChips ONE MORE TIME so every chip re-render
     re-evaluates Save-button visibility. Wraps any previous wrap
     (updateTabDots / updateOrbitRing / fetchFilmCount). */
  if (typeof window.renderFilterChips === 'function') {
    var _prevWrap = window.renderFilterChips;
    window.renderFilterChips = function () {
      var r = _prevWrap.apply(this, arguments);
      try { updateSaveButtonVisibility(); } catch (e) {}
      return r;
    };
  }

  /* Initial paint: in case the page restored a state on load, evaluate
     once after the DOM is ready. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSaveButtonVisibility);
  } else {
    updateSaveButtonVisibility();
  }
})();
/* === END PHASE 2: Saved searches + Favourites + Save button === */