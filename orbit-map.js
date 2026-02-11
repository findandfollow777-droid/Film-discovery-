// ================================================
// ORBIT MAP — Main Logic
// ================================================

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

let map;
let markerClusterGroup;
let settingsData = null;
let seedData = null;
let locationIndex = {};  // { "New York": { lat, lng, movies: [{id, title, year, poster, ...}] } }

// Poster cache: movieId -> poster_path (fetched on demand from TMDB)
const posterCache = {};

// ================================================
// INIT
// ================================================

async function initMap() {
  // 1. Create Leaflet map
  map = L.map('map', {
    center: [30, 0],
    zoom: 3,
    minZoom: 2,
    maxZoom: 16,
    zoomControl: true,
    attributionControl: true
  });

  // Dark tiles from CartoDB
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  // Move zoom control to bottom-right
  map.zoomControl.setPosition('bottomright');

  // 2. Load settings data + seed data (for title/vote/popularity)
  try {
    const [settingsRes, seedRes] = await Promise.all([
      fetch('orbit-movie-settings.json'),
      fetch('orbit-settings-seed.json')
    ]);
    settingsData = await settingsRes.json();
    seedData = await seedRes.json();
  } catch (e) {
    document.getElementById('statsText').textContent = 'Failed to load movie data';
    console.error('[OrbitMap] Failed to load data:', e);
    return;
  }

  // 3. Build location index
  buildLocationIndex();

  // 4. Plot markers
  plotMarkers();

  // 5. Set up panel
  setupPanel();

  // 6. Init MovieCube
  if (typeof initMovieCube === 'function') {
    initMovieCube();
  }

  // 7. Update stats
  const locationCount = Object.keys(locationIndex).length;
  const movieCount = new Set(
    Object.values(locationIndex).flatMap(loc => loc.movies.map(m => m.id))
  ).size;
  document.getElementById('statsText').textContent =
    `${movieCount.toLocaleString()} films across ${locationCount.toLocaleString()} locations`;
}

// ================================================
// BUILD LOCATION INDEX
// ================================================

function buildLocationIndex() {
  locationIndex = {};

  for (const [id, movie] of Object.entries(settingsData.movies)) {
    if (!movie.location?.coordinates?.length) continue;

    const seed = seedData?.movies?.[id];
    const movieInfo = {
      id: parseInt(id),
      title: movie.title || seed?.title || 'Unknown',
      year: movie.release_year || seed?.release_year,
      poster: null, // fetched on demand from TMDB
      vote_average: seed?.vote_average || 0,
      popularity: seed?.popularity || 0,
      decades: movie.time_period?.decades || [],
      setting_type: movie.time_period?.setting_type || null
    };

    movie.location.coordinates.forEach(coord => {
      const label = coord.label || "Unknown";
      if (!locationIndex[label]) {
        locationIndex[label] = {
          lat: coord.lat,
          lng: coord.lng,
          movies: []
        };
      }
      if (!locationIndex[label].movies.some(m => m.id === movieInfo.id)) {
        locationIndex[label].movies.push(movieInfo);
      }
    });
  }
}

// ================================================
// POSTER FETCHING (on demand)
// ================================================

async function fetchPosterPath(movieId) {
  if (posterCache[movieId] !== undefined) return posterCache[movieId];
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();
    posterCache[movieId] = data.poster_path || null;
    return posterCache[movieId];
  } catch {
    posterCache[movieId] = null;
    return null;
  }
}

async function loadPostersForPanel(movies) {
  // Fetch posters in batches of 8 to respect rate limits
  const BATCH = 8;
  const needsFetch = movies.filter(m => posterCache[m.id] === undefined);

  for (let i = 0; i < needsFetch.length; i += BATCH) {
    const batch = needsFetch.slice(i, i + BATCH);
    await Promise.all(batch.map(async (movie) => {
      const posterPath = await fetchPosterPath(movie.id);
      // Update DOM if card exists
      const img = document.querySelector(`.panel-movie-card[data-id="${movie.id}"] img`);
      const placeholder = document.querySelector(`.panel-movie-card[data-id="${movie.id}"] .no-poster`);
      if (posterPath && img) {
        img.src = `${TMDB_IMAGE_BASE}w185${posterPath}`;
        img.hidden = false;
        if (placeholder) placeholder.classList.add('hidden');
      }
    }));
  }
}

// ================================================
// PLOT MARKERS
// ================================================

function plotMarkers() {
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 40,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      let size = 'small';
      if (count > 50) size = 'large';
      else if (count > 10) size = 'medium';

      return L.divIcon({
        html: `<div>${count}</div>`,
        className: `marker-cluster marker-cluster-${size}`,
        iconSize: L.point(40, 40)
      });
    }
  });

  for (const [label, locData] of Object.entries(locationIndex)) {
    const count = locData.movies.length;

    let sizeClass = 'single';
    let iconSize = [14, 14];
    if (count >= 20) { sizeClass = 'large'; iconSize = [40, 40]; }
    else if (count >= 5) { sizeClass = 'medium'; iconSize = [30, 30]; }
    else if (count >= 2) { sizeClass = 'small'; iconSize = [22, 22]; }

    const icon = L.divIcon({
      html: count > 1 ? `${count}` : '',
      className: `orbit-marker ${sizeClass}`,
      iconSize: iconSize
    });

    const marker = L.marker([locData.lat, locData.lng], { icon })
      .bindTooltip(label, {
        className: 'orbit-tooltip',
        direction: 'top',
        offset: [0, -10]
      });

    marker.on('click', () => openLocationPanel(label, locData));

    markerClusterGroup.addLayer(marker);
  }

  map.addLayer(markerClusterGroup);
}

// ================================================
// LOCATION PANEL
// ================================================

let currentPanelSort = 'popular';

function setupPanel() {
  document.getElementById('panelClose').addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  map.on('click', () => closePanel());
}

function openLocationPanel(label, locData) {
  const panel = document.getElementById('locationPanel');
  document.getElementById('panelLocationName').textContent = label;
  document.getElementById('panelMovieCount').textContent =
    `${locData.movies.length} film${locData.movies.length !== 1 ? 's' : ''}`;

  currentPanelSort = 'popular';
  renderPanelMovies(locData.movies);

  panel.classList.remove('hidden');

  // Fetch posters in background
  loadPostersForPanel(locData.movies);
}

function closePanel() {
  document.getElementById('locationPanel').classList.add('hidden');
}

function renderPanelMovies(movies) {
  const grid = document.getElementById('panelMovieGrid');
  grid.innerHTML = '';

  // Sort controls
  const sortDiv = document.createElement('div');
  sortDiv.className = 'panel-sort';
  ['popular', 'year', 'rating'].forEach(sortType => {
    const btn = document.createElement('button');
    btn.textContent = sortType === 'popular' ? 'Popular' : sortType === 'year' ? 'Newest' : 'Top Rated';
    btn.className = sortType === currentPanelSort ? 'active' : '';
    btn.addEventListener('click', () => {
      currentPanelSort = sortType;
      renderPanelMovies(movies);
    });
    sortDiv.appendChild(btn);
  });

  const panel = document.getElementById('locationPanel');
  const existingSort = panel.querySelector('.panel-sort');
  if (existingSort) existingSort.remove();
  panel.insertBefore(sortDiv, grid);

  // Sort movies
  const sorted = [...movies];
  if (currentPanelSort === 'year') {
    sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (currentPanelSort === 'rating') {
    sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else {
    // Popular: sort by popularity descending
    sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  sorted.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'panel-movie-card';
    card.dataset.id = movie.id;
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof openMovieCube === 'function') {
        openMovieCube(movie.id);
      }
    });

    const cached = posterCache[movie.id];
    const hasPoster = cached && cached !== null;

    card.innerHTML = `
      <img src="${hasPoster ? TMDB_IMAGE_BASE + 'w185' + cached : ''}"
           alt="${movie.title}"
           loading="lazy"
           ${!hasPoster ? 'hidden' : ''}
           onerror="this.hidden=true; this.nextElementSibling.classList.remove('hidden');">
      <div class="no-poster ${hasPoster ? 'hidden' : ''}">🎬</div>
      <div class="card-info">
        <div class="card-title">${movie.title}</div>
        <div class="card-year">${movie.year || ''}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ================================================
// INIT ON LOAD
// ================================================

document.addEventListener('DOMContentLoaded', initMap);
