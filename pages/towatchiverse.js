/* ============================================================
   TOWATCHIVERSE — Added 2026-03-28
   Personal film lists hub. Four tabs: Watchlist, Liked,
   Watched, Shortlist. Reads from respective service files.
   ============================================================ */

const TAB_KEY = 'twv_active_tab';
const FILTER_KEY_PREFIX = 'twv_filter_';

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western"
};

const TAB_CONFIG = {
  watchlist: {
    getData: () => typeof getWatchlist === 'function' ? getWatchlist() : [],
    emptyMsg: 'Nothing queued up yet. Find something to watch.',
    mapItem: m => ({
      id: m.id, title: m.title, poster_path: m.poster_path,
      year: (m.release_date || '').split('-')[0],
      rating: m.vote_average || 0, addedAt: m.addedAt || '',
      genres: m.genres || []
    })
  },
  liked: {
    getData: () => typeof getLovedMovies === 'function' ? getLovedMovies() : [],
    emptyMsg: 'Films you\'ve loved will appear here.',
    mapItem: m => ({
      id: m.id, title: m.title, poster_path: m.poster,
      year: m.year ? String(m.year) : '',
      rating: 0, addedAt: m.addedAt || '',
      genres: m.genres || []
    })
  },
  watched: {
    getData: () => typeof getWatched === 'function' ? getWatched() : [],
    emptyMsg: 'Films you\'ve seen will appear here.',
    mapItem: m => ({
      id: m.id, title: m.title, poster_path: m.poster_path,
      year: (m.release_date || '').split('-')[0],
      rating: m.vote_average || 0, addedAt: m.addedAt || '',
      genres: m.genres || []
    })
  },
  shortlist: {
    getData: () => typeof getShortlist === 'function' ? getShortlist() : [],
    emptyMsg: 'Add up to 5 films to compare them side by side.',
    mapItem: m => ({
      id: m.id, title: m.title, poster_path: m.poster,
      year: m.year ? String(m.year) : '',
      rating: 0, addedAt: m.addedAt || '',
      genres: m.genres || []
    })
  }
};

const SORT_OPTIONS = [
  { value: 'added-desc', label: 'Date Added (Newest)' },
  { value: 'added-asc', label: 'Date Added (Oldest)' },
  { value: 'title-asc', label: 'Title A\u2013Z' },
  { value: 'title-desc', label: 'Title Z\u2013A' },
  { value: 'year-desc', label: 'Release Year (Newest)' },
  { value: 'year-asc', label: 'Release Year (Oldest)' },
  { value: 'rating-desc', label: 'Rating (Highest)' }
];

let activeTab = 'watchlist';
let movieCubeReady = false;

// Per-tab filter state
let filterState = {};

function getFilterState() {
  return filterState[activeTab] || { sort: 'added-desc', genres: [], search: '' };
}

function setFilterState(partial) {
  filterState[activeTab] = { ...getFilterState(), ...partial };
  sessionStorage.setItem(FILTER_KEY_PREFIX + activeTab, JSON.stringify(filterState[activeTab]));
}

function loadFilterState(tab) {
  try {
    const saved = sessionStorage.getItem(FILTER_KEY_PREFIX + tab);
    if (saved) filterState[tab] = JSON.parse(saved);
  } catch (e) { /* ignore */ }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const saved = sessionStorage.getItem(TAB_KEY);
  if (saved && TAB_CONFIG[saved]) activeTab = saved;

  // Load filter states for all tabs
  for (const key of Object.keys(TAB_CONFIG)) loadFilterState(key);

  buildSortDropdown();
  updateStats();
  updateTabCounts();
  setActiveTab(activeTab);

  // Tab click handlers
  document.querySelectorAll('.twv-tab').forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  // Search input
  const search = document.getElementById('twvSearch');
  if (search) {
    search.addEventListener('input', () => {
      setFilterState({ search: search.value });
      renderGrid();
    });
  }
});

// ============================================
// SORT DROPDOWN
// ============================================

function buildSortDropdown() {
  const btn = document.getElementById('twvSortBtn');
  if (!btn) return;

  // Build dropdown menu
  const menu = document.createElement('div');
  menu.className = 'twv-sort-menu';
  menu.id = 'twvSortMenu';
  menu.hidden = true;
  menu.innerHTML = SORT_OPTIONS.map(o =>
    `<button class="twv-sort-option" data-sort="${o.value}">${o.label}</button>`
  ).join('');
  btn.parentNode.appendChild(menu);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });

  menu.addEventListener('click', (e) => {
    const opt = e.target.closest('.twv-sort-option');
    if (!opt) return;
    setFilterState({ sort: opt.dataset.sort });
    btn.childNodes[0].textContent = 'Sort: ' + opt.textContent + ' ';
    menu.hidden = true;
    renderGrid();
  });

  document.addEventListener('click', () => { menu.hidden = true; });
}

// ============================================
// STATS & COUNTS
// ============================================

function updateStats() {
  setText('statWatchlist', typeof getWatchlistCount === 'function' ? getWatchlistCount() : 0);
  setText('statLoved', typeof getLovedMovies === 'function' ? getLovedMovies().length : 0);
  setText('statWatched', typeof getWatchedCount === 'function' ? getWatchedCount() : 0);
  setText('statShortlist', typeof getShortlistCount === 'function' ? getShortlistCount() : 0);
}

function updateTabCounts() {
  for (const [key, config] of Object.entries(TAB_CONFIG)) {
    const count = config.getData().length;
    const el = document.getElementById('tabCount' + capitalize(key));
    if (el) el.textContent = count;
  }
}

// ============================================
// TAB SWITCHING
// ============================================

function setActiveTab(tab) {
  activeTab = tab;
  sessionStorage.setItem(TAB_KEY, tab);

  document.querySelectorAll('.twv-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  // Restore filter state for this tab
  const fs = getFilterState();

  const search = document.getElementById('twvSearch');
  if (search) {
    const labels = { watchlist: 'watchlist', liked: 'liked movies', watched: 'watched movies', shortlist: 'shortlist' };
    search.placeholder = `Search ${labels[tab] || 'list'}...`;
    search.value = fs.search || '';
  }

  // Restore sort label
  const sortBtn = document.getElementById('twvSortBtn');
  if (sortBtn) {
    const opt = SORT_OPTIONS.find(o => o.value === fs.sort) || SORT_OPTIONS[0];
    sortBtn.childNodes[0].textContent = 'Sort: ' + opt.label + ' ';
  }

  renderGenrePills();
  renderGrid();
}

// ============================================
// GENRE PILLS
// ============================================

function renderGenrePills() {
  let container = document.getElementById('twvGenrePills');
  if (!container) {
    container = document.createElement('div');
    container.className = 'twv-genre-pills';
    container.id = 'twvGenrePills';
    const toolbar = document.querySelector('.twv-toolbar');
    if (toolbar) toolbar.appendChild(container);
  }

  const config = TAB_CONFIG[activeTab];
  if (!config) { container.innerHTML = ''; return; }

  const raw = config.getData();
  const items = raw.map(config.mapItem);

  // Collect genres present in this list
  const genreCounts = {};
  items.forEach(m => {
    (m.genres || []).forEach(gid => {
      if (GENRE_MAP[gid]) genreCounts[gid] = (genreCounts[gid] || 0) + 1;
    });
  });

  const genreIds = Object.keys(genreCounts).map(Number).sort((a, b) => genreCounts[b] - genreCounts[a]);

  if (genreIds.length === 0) {
    container.innerHTML = '';
    return;
  }

  const fs = getFilterState();
  const activeGenres = new Set(fs.genres || []);

  container.innerHTML = genreIds.map(gid =>
    `<button class="twv-genre-pill${activeGenres.has(gid) ? ' active' : ''}" data-genre="${gid}">${GENRE_MAP[gid]}</button>`
  ).join('');

  container.querySelectorAll('.twv-genre-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const gid = parseInt(pill.dataset.genre);
      const current = new Set(getFilterState().genres || []);
      if (current.has(gid)) current.delete(gid); else current.add(gid);
      setFilterState({ genres: Array.from(current) });
      pill.classList.toggle('active');
      renderGrid();
    });
  });
}

// ============================================
// GRID RENDERING
// ============================================

function renderGrid() {
  const grid = document.getElementById('towatchiverseGrid');
  const empty = document.getElementById('towatchiverseEmpty');
  const config = TAB_CONFIG[activeTab];
  if (!config) return;

  const raw = config.getData();
  let items = raw.map(config.mapItem);
  const totalCount = items.length;

  // Handle compare button for shortlist
  let existingCompare = document.querySelector('.twv-compare-wrap');
  if (existingCompare) existingCompare.remove();

  if (activeTab === 'shortlist') {
    const wrap = document.createElement('div');
    wrap.className = 'twv-compare-wrap';
    if (totalCount >= 2) {
      wrap.innerHTML = `<a href="compare.html" class="twv-compare-btn"><span class="og og-sparkle"></span> Compare These Films &#x2192;</a>`;
    } else {
      wrap.innerHTML = `<p class="twv-compare-note">Add at least 2 films to compare</p>`;
    }
    grid.parentNode.insertBefore(wrap, grid);
  }

  if (totalCount === 0) {
    grid.innerHTML = '';
    grid.hidden = true;
    empty.querySelector('p').textContent = config.emptyMsg;
    empty.hidden = false;
    renderFilterSummary(0, 0);
    return;
  }

  // Apply filters
  const fs = getFilterState();

  // Genre filter
  if (fs.genres && fs.genres.length > 0) {
    const genreSet = new Set(fs.genres);
    items = items.filter(m => (m.genres || []).some(g => genreSet.has(g)));
  }

  // Search filter
  if (fs.search) {
    const q = fs.search.toLowerCase();
    items = items.filter(m => (m.title || '').toLowerCase().includes(q));
  }

  // Sort
  const sort = fs.sort || 'added-desc';
  items.sort((a, b) => {
    switch (sort) {
      case 'added-desc': return (b.addedAt || '').localeCompare(a.addedAt || '');
      case 'added-asc': return (a.addedAt || '').localeCompare(b.addedAt || '');
      case 'title-asc': return (a.title || '').localeCompare(b.title || '');
      case 'title-desc': return (b.title || '').localeCompare(a.title || '');
      case 'year-desc': return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
      case 'year-asc': return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
      case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  renderFilterSummary(items.length, totalCount);

  if (items.length === 0) {
    grid.innerHTML = '<div class="twv-no-results">No films match your filters</div>';
    grid.hidden = false;
    empty.hidden = true;
    return;
  }

  empty.hidden = true;
  grid.hidden = false;

  grid.innerHTML = items.map(m => {
    const posterUrl = m.poster_path ? TMDB_IMG + 'w342' + m.poster_path : '';
    return `<div class="twv-card" data-movie-id="${m.id}">
      ${posterUrl ? `<img class="twv-poster" src="${posterUrl}" alt="${m.title || ''}" loading="lazy">` : '<div class="twv-poster twv-poster-empty"></div>'}
      <div class="twv-card-info">
        <p class="twv-card-title">${m.title || 'Unknown'}</p>
        ${m.year ? `<p class="twv-card-year">${m.year}</p>` : ''}
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.twv-card').forEach(card => {
    card.addEventListener('click', () => {
      const movieId = parseInt(card.dataset.movieId);
      ensureMovieCube();
      if (typeof openMovieCube === 'function') openMovieCube(movieId);
    });
  });
}

// ============================================
// FILTER SUMMARY
// ============================================

function renderFilterSummary(shown, total) {
  let el = document.getElementById('twvFilterSummary');
  const fs = getFilterState();
  const isFiltered = fs.search || (fs.genres && fs.genres.length) || fs.sort !== 'added-desc';

  if (!isFiltered || shown === total) {
    if (el) el.hidden = true;
    return;
  }

  if (!el) {
    el = document.createElement('div');
    el.className = 'twv-filter-summary';
    el.id = 'twvFilterSummary';
    const grid = document.getElementById('towatchiverseGrid');
    grid.parentNode.insertBefore(el, grid);
  }

  el.hidden = false;
  el.innerHTML = `Showing ${shown} of ${total} films <button class="twv-clear-filters">Clear filters</button>`;

  el.querySelector('.twv-clear-filters').addEventListener('click', () => {
    filterState[activeTab] = { sort: 'added-desc', genres: [], search: '' };
    sessionStorage.removeItem(FILTER_KEY_PREFIX + activeTab);
    setActiveTab(activeTab); // re-renders everything
  });
}

// ============================================
// MOVIE CUBE
// ============================================

function ensureMovieCube() {
  if (movieCubeReady) return;
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        localStorage.setItem('anchorMovie', JSON.stringify(movie));
        localStorage.removeItem('anchorFromResults');
        window.location.href = '../games/constellation.html';
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();
    movieCubeReady = true;
  }
}

// ============================================
// HELPERS
// ============================================

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
