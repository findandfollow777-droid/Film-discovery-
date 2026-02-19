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

// Decade filter state
let allMarkers = []; // { marker, label }
let currentDecade = 'all';
let currentPanelLabel = '';
let currentPanelLocData = null;

const SLIDER_VALUES = [
  { label: 'All', value: 'all' },
  { label: 'Pre-1920', value: 'pre-1920' },
  { label: '1920s', value: '1920s' },
  { label: '1930s', value: '1930s' },
  { label: '1940s', value: '1940s' },
  { label: '1950s', value: '1950s' },
  { label: '1960s', value: '1960s' },
  { label: '1970s', value: '1970s' },
  { label: '1980s', value: '1980s' },
  { label: '1990s', value: '1990s' },
  { label: '2000s', value: '2000s' },
  { label: '2010s', value: '2010s' },
  { label: '2020s', value: '2020s' },
  { label: 'Future', value: 'future' },
];

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
    attributionControl: true,
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 1.0
  });

  // Dark tiles from CartoDB
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
    subdomains: 'abcd',
    noWrap: true
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

  // 5. Set up panel, slider, search
  setupPanel();
  setupDecadeSlider();
  setupMapSearch();

  // 6. Init MovieCube
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      }
    });
  }
  if (typeof initPeopleCube === 'function') initPeopleCube();

  // 7. Update stats
  updateStats();
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
      setting_type: movie.time_period?.setting_type || null,
      era_labels: movie.time_period?.era_labels || []
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
      const card = document.querySelector(`.panel-movie-card[data-id="${movie.id}"]`);
      if (posterPath && card) {
        const placeholder = card.querySelector('.no-poster');
        // Insert img before the placeholder
        if (placeholder && !card.querySelector('img')) {
          const img = document.createElement('img');
          img.src = `${TMDB_IMAGE_BASE}w185${posterPath}`;
          img.alt = movie.title;
          img.loading = 'lazy';
          img.onerror = function() { this.style.display = 'none'; placeholder.style.display = 'flex'; };
          card.insertBefore(img, placeholder);
          placeholder.style.display = 'none';
        }
      }
    }));
  }
}

// ================================================
// PLOT MARKERS
// ================================================

function createMarkerIcon(count) {
  let sizeClass = 'single';
  let iconSize = [14, 14];
  if (count >= 20) { sizeClass = 'large'; iconSize = [40, 40]; }
  else if (count >= 5) { sizeClass = 'medium'; iconSize = [30, 30]; }
  else if (count >= 2) { sizeClass = 'small'; iconSize = [22, 22]; }

  return L.divIcon({
    html: count > 1 ? `<span>${count}</span>` : '',
    className: `orbit-marker ${sizeClass}`,
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2]
  });
}

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
        html: `<div><span>${count}</span></div>`,
        className: `marker-cluster marker-cluster-${size}`,
        iconSize: L.point(40, 40),
        iconAnchor: L.point(20, 20)
      });
    }
  });

  allMarkers = [];

  for (const [label, locData] of Object.entries(locationIndex)) {
    const icon = createMarkerIcon(locData.movies.length);

    const marker = L.marker([locData.lat, locData.lng], { icon })
      .bindTooltip(label, {
        className: 'orbit-tooltip',
        direction: 'top',
        offset: [0, -10]
      });

    marker.on('click', () => {
      const movies = getFilteredMovies(label);
      openLocationPanel(label, { ...locData, movies });
    });

    allMarkers.push({ marker, label });
    markerClusterGroup.addLayer(marker);
  }

  map.addLayer(markerClusterGroup);
}

// ================================================
// DECADE FILTERING
// ================================================

function getFilteredMovies(label) {
  const locData = locationIndex[label];
  if (!locData) return [];
  if (currentDecade === 'all') return locData.movies;

  if (currentDecade === 'future') {
    return locData.movies.filter(m =>
      m.setting_type === 'near_future' || m.setting_type === 'far_future'
    );
  }

  if (currentDecade === 'pre-1920') {
    return locData.movies.filter(m =>
      m.decades.some(d => {
        const num = parseInt(d);
        return !isNaN(num) && num < 1920;
      }) || ['Ancient', 'Medieval', 'Renaissance'].some(era =>
        m.era_labels?.includes(era)
      )
    );
  }

  return locData.movies.filter(m => m.decades.includes(currentDecade));
}

function filterByDecade(decade) {
  currentDecade = decade;
  markerClusterGroup.clearLayers();

  for (const { marker, label } of allMarkers) {
    const filteredMovies = getFilteredMovies(label);

    if (filteredMovies.length > 0) {
      marker.setIcon(createMarkerIcon(filteredMovies.length));
      markerClusterGroup.addLayer(marker);
    }
  }

  updateStats();

  // Update slider label
  const labelText = decade === 'all' ? 'All Eras' : SLIDER_VALUES.find(v => v.value === decade)?.label || decade;
  document.getElementById('sliderLabel').textContent = labelText;

  // Update decade label highlights
  document.querySelectorAll('.decade-labels span').forEach(span => {
    span.classList.toggle('active', span.dataset.value === decade);
  });

  // If panel is open, re-render with filtered movies
  if (currentPanelLabel && !document.getElementById('locationPanel').classList.contains('hidden')) {
    const movies = getFilteredMovies(currentPanelLabel);
    if (movies.length > 0) {
      openLocationPanel(currentPanelLabel, { ...locationIndex[currentPanelLabel], movies });
    } else {
      closePanel();
    }
  }
}

function updateStats() {
  const visibleLocations = new Set();
  const visibleMovies = new Set();

  for (const { label } of allMarkers) {
    const movies = getFilteredMovies(label);
    if (movies.length > 0) {
      visibleLocations.add(label);
      movies.forEach(m => visibleMovies.add(m.id));
    }
  }

  const suffix = currentDecade !== 'all' ? ` (${SLIDER_VALUES.find(v => v.value === currentDecade)?.label || currentDecade})` : '';
  document.getElementById('statsText').textContent =
    `${visibleMovies.size.toLocaleString()} films across ${visibleLocations.size.toLocaleString()} locations${suffix}`;
}

// ================================================
// DECADE SLIDER SETUP
// ================================================

function setupDecadeSlider() {
  const toggle = document.getElementById('sliderToggle');
  const container = document.getElementById('sliderContainer');
  const slider = document.getElementById('decadeSlider');
  const labelsDiv = document.getElementById('decadeLabels');

  // Set slider max to match values
  slider.max = SLIDER_VALUES.length - 1;

  // Build decade labels — show every other to avoid crowding
  const showLabels = [0, 2, 4, 6, 8, 10, 12, 13]; // All, 1920s, 1940s, 1960s, 1980s, 2000s, 2020s, Future
  SLIDER_VALUES.forEach((item, i) => {
    const span = document.createElement('span');
    span.dataset.value = item.value;
    span.textContent = showLabels.includes(i) ? item.label : '';
    span.style.minWidth = '0';
    span.style.flex = '1';
    span.style.textAlign = 'center';
    if (item.value === 'future') span.style.marginLeft = '12px';
    if (i === 0) span.classList.add('active');
    span.addEventListener('click', () => {
      slider.value = i;
      filterByDecade(item.value);
      toggle.classList.toggle('active', item.value !== 'all');
    });
    labelsDiv.appendChild(span);
  });

  // Toggle visibility
  toggle.addEventListener('click', () => {
    container.classList.toggle('hidden');
  });

  // Slider input
  slider.addEventListener('input', () => {
    const idx = parseInt(slider.value);
    const item = SLIDER_VALUES[idx];
    filterByDecade(item.value);
    toggle.classList.toggle('active', item.value !== 'all');
  });
}

// ================================================
// LOCATION PANEL
// ================================================

let currentPanelSort = 'popular';

function setupPanel() {
  document.getElementById('panelClose').addEventListener('click', closePanel);
  document.getElementById('panelViewAll').addEventListener('click', () => {
    if (currentPanelLabel && currentPanelLocData) {
      localStorage.setItem('orbit_map_results', JSON.stringify({
        label: currentPanelLabel,
        movieIds: currentPanelLocData.movies.map(m => m.id)
      }));
      window.location.href = 'games/results.html';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  map.on('click', () => closePanel());
}

function openLocationPanel(label, locData) {
  currentPanelLabel = label;
  currentPanelLocData = locData;

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

    if (hasPoster) {
      card.innerHTML = `
        <img src="${TMDB_IMAGE_BASE}w185${cached}"
             alt="${movie.title}" loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="no-poster" style="display:none"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg></div>
        <div class="card-info">
          <div class="card-title">${movie.title}</div>
          <div class="card-year">${movie.year || ''}</div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="no-poster"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg></div>
        <div class="card-info">
          <div class="card-title">${movie.title}</div>
          <div class="card-year">${movie.year || ''}</div>
        </div>
      `;
    }

    grid.appendChild(card);
  });
}

// ================================================
// MAP SEARCH
// ================================================

function setupMapSearch() {
  const input = document.getElementById('mapSearch');
  const results = document.getElementById('mapSearchResults');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      results.classList.add('hidden');
      return;
    }

    const matches = Object.entries(locationIndex)
      .filter(([label]) => label.toLowerCase().includes(query))
      .sort((a, b) => b[1].movies.length - a[1].movies.length)
      .slice(0, 10);

    if (matches.length === 0) {
      results.classList.add('hidden');
      return;
    }

    results.innerHTML = '';
    matches.forEach(([label, locData]) => {
      const div = document.createElement('div');
      div.className = 'map-search-result';
      div.innerHTML = `
        <span>${label}</span>
        <span class="result-count">${locData.movies.length}</span>
      `;
      div.addEventListener('click', () => {
        map.flyTo([locData.lat, locData.lng], 10, { duration: 1.2 });
        const movies = getFilteredMovies(label);
        openLocationPanel(label, { ...locData, movies });
        input.value = '';
        results.classList.add('hidden');
      });
      results.appendChild(div);
    });
    results.classList.remove('hidden');
  });

  // Close search results when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.map-search-wrapper')) {
      results.classList.add('hidden');
    }
  });
}

// ================================================
// INIT ON LOAD
// ================================================

document.addEventListener('DOMContentLoaded', initMap);
