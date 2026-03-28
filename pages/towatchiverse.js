/* ============================================================
   TOWATCHIVERSE — Added 2026-03-28
   Personal film lists hub. Four tabs: Watchlist, Liked,
   Watched, Shortlist. Reads from respective service files.
   ============================================================ */

const TAB_KEY = 'twv_active_tab';

const TAB_CONFIG = {
  watchlist: {
    getData: () => typeof getWatchlist === 'function' ? getWatchlist() : [],
    emptyMsg: 'Nothing queued up yet. Find something to watch.',
    mapItem: m => ({ id: m.id, title: m.title, poster_path: m.poster_path, year: (m.release_date || '').split('-')[0] })
  },
  liked: {
    getData: () => typeof getLovedMovies === 'function' ? getLovedMovies() : [],
    emptyMsg: 'Films you\'ve loved will appear here.',
    mapItem: m => ({ id: m.id, title: m.title, poster_path: m.poster, year: m.year ? String(m.year) : '' })
  },
  watched: {
    getData: () => typeof getWatched === 'function' ? getWatched() : [],
    emptyMsg: 'Films you\'ve seen will appear here.',
    mapItem: m => ({ id: m.id, title: m.title, poster_path: m.poster_path, year: (m.release_date || '').split('-')[0] })
  },
  shortlist: {
    getData: () => typeof getShortlist === 'function' ? getShortlist() : [],
    emptyMsg: 'Add up to 5 films to compare them side by side.',
    mapItem: m => ({ id: m.id, title: m.title, poster_path: m.poster, year: m.year ? String(m.year) : '' })
  }
};

let activeTab = 'watchlist';
let movieCubeReady = false;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Restore last active tab
  const saved = sessionStorage.getItem(TAB_KEY);
  if (saved && TAB_CONFIG[saved]) activeTab = saved;

  updateStats();
  updateTabCounts();
  setActiveTab(activeTab);

  // Tab click handlers
  document.querySelectorAll('.twv-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveTab(tab.dataset.tab);
    });
  });
});

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

  // Update tab styles
  document.querySelectorAll('.twv-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  // Update search placeholder
  const search = document.getElementById('twvSearch');
  if (search) {
    const labels = { watchlist: 'watchlist', liked: 'liked movies', watched: 'watched movies', shortlist: 'shortlist' };
    search.placeholder = `Search within ${labels[tab] || 'list'}...`;
  }

  renderGrid();
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
  const items = raw.map(config.mapItem);

  // Handle compare button for shortlist
  let existingCompare = document.querySelector('.twv-compare-wrap');
  if (existingCompare) existingCompare.remove();

  if (activeTab === 'shortlist') {
    const wrap = document.createElement('div');
    wrap.className = 'twv-compare-wrap';
    if (items.length >= 2) {
      wrap.innerHTML = `<a href="compare.html" class="twv-compare-btn"><span class="og og-sparkle"></span> Compare These Films &#x2192;</a>`;
    } else {
      wrap.innerHTML = `<p class="twv-compare-note">Add at least 2 films to compare</p>`;
    }
    grid.parentNode.insertBefore(wrap, grid);
  }

  if (items.length === 0) {
    grid.innerHTML = '';
    grid.hidden = true;
    empty.querySelector('p').textContent = config.emptyMsg;
    empty.hidden = false;
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

  // Card click → Movie Cube
  grid.querySelectorAll('.twv-card').forEach(card => {
    card.addEventListener('click', () => {
      const movieId = parseInt(card.dataset.movieId);
      ensureMovieCube();
      if (typeof openMovieCube === 'function') openMovieCube(movieId);
    });
  });
}

function ensureMovieCube() {
  if (movieCubeReady) return;
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        if (typeof openMovieCube === 'function') openMovieCube(movie.id);
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
