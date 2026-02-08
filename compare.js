// ============================================
// ORBIT - Compare Movies
// Shortlist Comparison Suite
// ============================================

import * as shortlistService from './shortlist-service.js';

// ============================================
// CONSTANTS
// ============================================

const TMDB_API_KEY = 'dd1b9aebd0769bc49a68b7853b6f4266';
const TMDB_IMG = 'https://image.tmdb.org/t/p/';
const PLACEHOLDER_POSTER = 'https://via.placeholder.com/185x278?text=No+Poster';

const MOVIE_COLORS = [
  '#00d9ff', // Cyan
  '#ffd700', // Gold
  '#a855f7', // Purple
  '#10b981', // Green
  '#ef4444'  // Red
];

const GENRE_COLORS = {
  'Action': '#ef4444',
  'Drama': '#a855f7',
  'Science Fiction': '#00d9ff',
  'Sci-Fi': '#00d9ff',
  'Comedy': '#fbbf24',
  'Thriller': '#10b981',
  'Horror': '#f97316',
  'Romance': '#ec4899',
  'Animation': '#3b82f6',
  'Documentary': '#6b7280',
  'Adventure': '#14b8a6',
  'Fantasy': '#8b5cf6',
  'Mystery': '#06b6d4',
  'Crime': '#dc2626',
  'Family': '#84cc16',
  'War': '#64748b',
  'History': '#78716c',
  'Music': '#f59e0b',
  'Western': '#92400e'
};

const METRIC_LABELS = {
  vote_average: 'Rating',
  year: 'Year',
  runtime: 'Runtime',
  popularity: 'Popularity',
  revenue: 'Revenue',
  gravity: 'Gravity'
};

const RADAR_VARIABLES = {
  vote_average: { label: 'Rating', min: 0, max: 10 },
  runtime: { label: 'Runtime', min: 60, max: 240 },
  popularity: { label: 'Popularity', min: 0, max: 100 },
  vote_count: { label: 'Vote Count', min: 0, max: 20000 },
  budget: { label: 'Budget', min: 0, max: 300000000 },
  revenue: { label: 'Revenue', min: 0, max: 3000000000 },
  cast_size: { label: 'Cast Size', min: 5, max: 50 },
  recency: { label: 'Recency', min: 1950, max: 2026 }
};

const DEFAULT_RADAR_VARS = ['vote_average', 'runtime', 'popularity', 'cast_size', 'recency'];

// ============================================
// STATE
// ============================================

let shortlistedMovies = [];
let moviesWithData = [];
let currentTab = 'orbital';
let currentOrbitalMetric = 'vote_average';
let isGravityActive = false;

// ============================================
// DOM ELEMENTS
// ============================================

const shortlistMoviesEl = document.getElementById('shortlist-movies');
const compareEmptyEl = document.getElementById('compare-empty');
const compareTabs = document.querySelectorAll('.compare-tab');
const comparePanels = document.querySelectorAll('.compare-panel');

// ============================================
// SVG HELPERS
// ============================================

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      el.setAttribute(key, value);
    }
  });
  return el;
}

function createSvgGroup(className, attrs = {}) {
  return createSvgElement('g', { class: className, ...attrs });
}

function createSvgCircle(cx, cy, r, attrs = {}) {
  return createSvgElement('circle', { cx, cy, r, ...attrs });
}

function createSvgLine(x1, y1, x2, y2, attrs = {}) {
  return createSvgElement('line', { x1, y1, x2, y2, ...attrs });
}

function createSvgText(x, y, text, attrs = {}) {
  const el = createSvgElement('text', { x, y, ...attrs });
  el.textContent = text;
  return el;
}

function createSvgRect(x, y, width, height, attrs = {}) {
  return createSvgElement('rect', { x, y, width, height, ...attrs });
}

function createSvgImage(x, y, width, height, href, attrs = {}) {
  return createSvgElement('image', { x, y, width, height, href, ...attrs });
}

function createClipPath(id, shapeElement) {
  const clipPath = createSvgElement('clipPath', { id });
  clipPath.appendChild(shapeElement);
  return clipPath;
}

// ============================================
// UTILITY HELPERS
// ============================================

function getPosterUrl(movie, size = 'w185') {
  return movie.poster ? `${TMDB_IMG}${size}${movie.poster}` : PLACEHOLDER_POSTER;
}

function getGenreColor(genreName) {
  return GENRE_COLORS[genreName] || '#64748b';
}

function getMetricLabel(metric) {
  return METRIC_LABELS[metric] || 'Rating';
}

function getMovieMetricValue(movie, metric) {
  const values = {
    vote_average: movie.vote_average || 0,
    year: movie.year || 0,
    runtime: movie.runtime || 0,
    popularity: movie.popularity || 0,
    revenue: movie.revenue || 0,
    gravity: movie.gravityScore || 0
  };
  return values[metric] ?? values.vote_average;
}

function sortMoviesByMetric(movies, metric) {
  return [...movies].sort((a, b) => getMovieMetricValue(b, metric) - getMovieMetricValue(a, metric));
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength - 2) + '...' : text;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value, min, max) {
  return max === min ? 0.5 : (value - min) / (max - min);
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  console.log('🚀 Initializing Compare page...');

  shortlistedMovies = shortlistService.getShortlist();

  if (shortlistedMovies.length < 2) {
    showEmptyState();
    return;
  }

  hideEmptyState();
  renderMovieThumbnails();
  await fetchMovieData();
  setupTabSwitching();

  console.log('✅ Compare page initialized!');
}

// ============================================
// EMPTY STATE
// ============================================

function showEmptyState() {
  console.log('⚠️ Not enough movies - showing empty state');
  compareEmptyEl.classList.remove('hidden');
  shortlistMoviesEl && (shortlistMoviesEl.style.display = 'none');
  document.querySelector('.compare-tabs')?.classList.add('hidden');
  document.querySelector('.compare-content')?.classList.add('hidden');
}

function hideEmptyState() {
  compareEmptyEl.classList.add('hidden');
  shortlistMoviesEl && (shortlistMoviesEl.style.display = 'flex');
  document.querySelector('.compare-tabs')?.classList.remove('hidden');
  document.querySelector('.compare-content')?.classList.remove('hidden');
}

// ============================================
// MOVIE THUMBNAILS
// ============================================

function renderMovieThumbnails() {
  if (!shortlistMoviesEl) return;

  shortlistMoviesEl.innerHTML = shortlistedMovies.map((movie, index) => `
    <div class="shortlist-movie-thumb"
         data-index="${index}"
         data-title="${movie.title}"
         style="border-color: ${MOVIE_COLORS[index]}">
      <img src="${getPosterUrl(movie)}" alt="${movie.title}">
    </div>
  `).join('');

  console.log('🎬 Rendered movie thumbnails');
}

// ============================================
// FETCH TMDB DATA
// ============================================

async function fetchMovieData() {
  console.log('📡 Fetching TMDB data...');

  const fetchMovie = async (movie, index) => {
    try {
      const [details, credits, keywordsData] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/keywords?api_key=${TMDB_API_KEY}`).then(r => r.json())
      ]);

      return {
        ...movie,
        color: MOVIE_COLORS[index],
        index,
        runtime: details.runtime || null,
        budget: details.budget || null,
        revenue: details.revenue || null,
        vote_average: details.vote_average || 0,
        vote_count: details.vote_count || 0,
        popularity: details.popularity || 0,
        genres: details.genres || [],
        overview: details.overview || '',
        release_date: details.release_date || movie.year,
        cast: credits.cast || [],
        crew: credits.crew || [],
        keywords: keywordsData.keywords || []
      };
    } catch (error) {
      console.error(`❌ Error fetching data for movie ${movie.id}:`, error);
      return { ...movie, color: MOVIE_COLORS[index], index, error: true };
    }
  };

  moviesWithData = await Promise.all(shortlistedMovies.map(fetchMovie));
  window.comparisonMovies = moviesWithData;
  console.log('✅ All movie data fetched');
}

// ============================================
// TAB SWITCHING
// ============================================

function setupTabSwitching() {
  compareTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
}

function switchTab(tabName) {
  console.log(`🔄 Switching to tab: ${tabName}`);
  currentTab = tabName;

  compareTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
  comparePanels.forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tabName}`));

  renderVisualization(tabName);
}

function renderVisualization(tabName) {
  const container = document.getElementById(`${tabName}-container`);
  if (!container) return;

  const renderers = {
    orbital: renderOrbitalRings,
    constellation: renderConstellationMap,
    timeline: renderTimelineRibbon,
    radar: renderRadarChart,
    venn: () => console.log('🌌 Word Nebula (not yet implemented)')
  };

  renderers[tabName]?.(moviesWithData, container);
}

// ============================================
// ORBITAL RINGS VISUALIZATION
// ============================================

function renderOrbitalRings(movies, container) {
  if (!movies?.length) {
    container.innerHTML = '<div class="panel-placeholder"><p>No movies to display</p></div>';
    return;
  }

  console.log('🪐 Rendering Orbital Rings');
  container.innerHTML = '';

  // Controls
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'orbital-controls';
  controlsDiv.innerHTML = `
    <div class="orbital-sort-controls">
      <label>Sort by:</label>
      ${['vote_average', 'year', 'runtime', 'popularity', 'revenue'].map(metric => `
        <button class="sort-btn ${currentOrbitalMetric === metric ? 'active' : ''}" data-metric="${metric}">
          ${getMetricLabel(metric)}
        </button>
      `).join('')}
    </div>
    <div class="gravitational-input">
      <input type="text" id="gravity-keywords" placeholder="Gravitational Pull: dark, hope, revenge..." />
      <button id="gravity-apply">Apply Gravity</button>
      <button id="gravity-clear" class="gravity-clear-btn" style="display: none;">Clear</button>
    </div>
  `;
  container.appendChild(controlsDiv);

  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.className = 'orbital-svg-container';
  container.appendChild(svgDiv);

  renderOrbitalSVG(movies, svgDiv, currentOrbitalMetric);
  setupOrbitalControls(movies, svgDiv);
}

function renderOrbitalSVG(movies, container, metric) {
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const minRadius = 100;
  const maxRadius = Math.min(width, height) * 0.35;

  container.innerHTML = '';

  const svg = createSvgElement('svg', { width, height, class: 'orbital-svg' });
  const sortedMovies = sortMoviesByMetric(movies, metric);

  // Draw orbital paths
  sortedMovies.forEach((_, index) => {
    const radius = minRadius + (index / (sortedMovies.length - 1 || 1)) * (maxRadius - minRadius);
    svg.appendChild(createSvgCircle(centerX, centerY, radius, { class: 'orbital-path' }));
  });

  // Draw center
  const centerGroup = createSvgGroup('orbital-center');
  centerGroup.appendChild(createSvgCircle(centerX, centerY, 40, { class: 'orbital-center-circle' }));
  centerGroup.appendChild(createSvgText(centerX, centerY, getMetricLabel(metric), {
    class: 'orbital-center-text',
    'text-anchor': 'middle',
    'dominant-baseline': 'middle'
  }));
  svg.appendChild(centerGroup);

  // Draw movie nodes
  sortedMovies.forEach((movie, index) => {
    const radius = minRadius + (index / (sortedMovies.length - 1 || 1)) * (maxRadius - minRadius);
    const angle = (index * 360 / sortedMovies.length) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const nodeGroup = createSvgGroup('orbital-node', { 'data-movie-id': movie.id });

    // Clip path for poster
    const clipId = `clip-${movie.id}`;
    svg.appendChild(createClipPath(clipId, createSvgCircle(x, y, 35)));

    // Poster image
    nodeGroup.appendChild(createSvgImage(x - 35, y - 35, 70, 70, getPosterUrl(movie), { 'clip-path': `url(#${clipId})` }));

    // Border and glow
    nodeGroup.appendChild(createSvgCircle(x, y, 35, {
      class: 'orbital-node-border',
      stroke: movie.color,
      fill: 'none',
      'stroke-width': 3
    }));

    const glow = createSvgCircle(x, y, 35, {
      class: 'orbital-node-glow',
      stroke: movie.color,
      fill: 'none',
      'stroke-width': 1,
      opacity: 0
    });
    nodeGroup.appendChild(glow);

    // Tooltip
    const tooltip = createSvgText(x, y - 50, movie.title, {
      class: 'orbital-tooltip',
      'text-anchor': 'middle',
      opacity: 0
    });
    nodeGroup.appendChild(tooltip);

    // Events
    nodeGroup.addEventListener('mouseenter', () => {
      glow.setAttribute('opacity', 0.6);
      tooltip.setAttribute('opacity', 1);
      nodeGroup.style.cursor = 'pointer';
    });

    nodeGroup.addEventListener('mouseleave', () => {
      glow.setAttribute('opacity', 0);
      tooltip.setAttribute('opacity', 0);
    });

    nodeGroup.addEventListener('click', () => {
      window.openMovieCube?.(movie.id) || console.log(`Movie Cube: ${movie.title}`);
    });

    svg.appendChild(nodeGroup);
  });

  container.appendChild(svg);
}

function setupOrbitalControls(movies, svgContainer) {
  const sortButtons = document.querySelectorAll('.sort-btn');
  const applyBtn = document.getElementById('gravity-apply');
  const keywordsInput = document.getElementById('gravity-keywords');
  const clearBtn = document.getElementById('gravity-clear');

  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentOrbitalMetric = btn.dataset.metric;
      isGravityActive = false;
      sortButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      clearBtn.style.display = 'none';
      renderOrbitalSVG(movies, svgContainer, currentOrbitalMetric);
    });
  });

  applyBtn?.addEventListener('click', () => {
    const keywords = keywordsInput.value.trim();
    if (keywords) {
      applyGravitationalPull(movies, keywords, svgContainer);
      clearBtn.style.display = 'inline-block';
    }
  });

  clearBtn?.addEventListener('click', () => {
    keywordsInput.value = '';
    isGravityActive = false;
    clearBtn.style.display = 'none';
    sortButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-metric="${currentOrbitalMetric}"]`)?.classList.add('active');
    renderOrbitalSVG(movies, svgContainer, currentOrbitalMetric);
  });

  keywordsInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') applyBtn.click();
  });
}

function applyGravitationalPull(movies, keywordsString, svgContainer) {
  const keywords = keywordsString.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
  if (!keywords.length) return;

  movies.forEach(movie => {
    let score = 0;

    // Check overview (3 points per match)
    if (movie.overview) {
      keywords.forEach(keyword => {
        const matches = movie.overview.toLowerCase().match(new RegExp(`\\b${keyword}\\b`, 'gi'));
        if (matches) score += matches.length * 3;
      });
    }

    // Check TMDB keywords (5 points)
    movie.keywords?.forEach(kw => {
      const kwName = kw.name.toLowerCase();
      keywords.forEach(keyword => {
        if (kwName.includes(keyword) || keyword.includes(kwName)) score += 5;
      });
    });

    // Check title (2 points)
    if (movie.title) {
      const title = movie.title.toLowerCase();
      keywords.forEach(keyword => {
        if (title.includes(keyword)) score += 2;
      });
    }

    // Check genres (4 points)
    movie.genres?.forEach(genre => {
      const genreName = genre.name.toLowerCase();
      keywords.forEach(keyword => {
        if (genreName.includes(keyword)) score += 4;
      });
    });

    movie.gravityScore = score;
  });

  isGravityActive = true;
  currentOrbitalMetric = 'gravity';
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  renderOrbitalSVG(movies, svgContainer, 'gravity');
}

// ============================================
// CONSTELLATION MAP VISUALIZATION
// ============================================

function renderConstellationMap(movies, container) {
  if (!movies?.length) {
    container.innerHTML = '<div class="panel-placeholder"><p>No movies to display</p></div>';
    return;
  }

  console.log('✦ Rendering Constellation Map');
  container.innerHTML = '';

  const connections = findAllConnections(movies);
  const stats = calculateConstellationStats(connections);

  // Stats bar
  const statsDiv = document.createElement('div');
  statsDiv.className = 'constellation-stats';
  statsDiv.innerHTML = `
    <div class="stat-item"><span class="stat-label">Shared Actors:</span><span class="stat-value">${stats.totalActors}</span></div>
    <div class="stat-item"><span class="stat-label">Shared Directors:</span><span class="stat-value">${stats.totalDirectors}</span></div>
    <div class="stat-item"><span class="stat-label">Total Connections:</span><span class="stat-value">${stats.totalConnections}</span></div>
  `;
  container.appendChild(statsDiv);

  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.className = 'constellation-svg-container';
  container.appendChild(svgDiv);

  renderConstellationSVG(movies, connections, svgDiv);
  renderFrequentCollaborators(movies, container);
}

function findAllConnections(movies) {
  const connections = [];
  for (let i = 0; i < movies.length; i++) {
    for (let j = i + 1; j < movies.length; j++) {
      const shared = findSharedPeople(movies[i], movies[j]);
      if (shared.actors.length || shared.directors.length || shared.crew.length) {
        connections.push({
          movie1: movies[i],
          movie2: movies[j],
          shared,
          totalShared: shared.actors.length + shared.directors.length + shared.crew.length
        });
      }
    }
  }
  return connections;
}

function findSharedPeople(movie1, movie2) {
  const shared = { actors: [], directors: [], crew: [] };

  // Actors
  const cast1Ids = new Set(movie1.cast.map(p => p.id));
  movie2.cast.forEach(p => { if (cast1Ids.has(p.id)) shared.actors.push(p); });

  // Directors
  const dir1 = movie1.crew.find(p => p.job === 'Director');
  const dir2 = movie2.crew.find(p => p.job === 'Director');
  if (dir1 && dir2 && dir1.id === dir2.id) shared.directors.push(dir1);

  // Key crew
  const keyJobs = ['Writer', 'Screenplay', 'Original Music Composer', 'Director of Photography'];
  const crew1Map = new Map(movie1.crew.filter(p => keyJobs.includes(p.job)).map(p => [p.id, p]));
  movie2.crew.forEach(p => { if (keyJobs.includes(p.job) && crew1Map.has(p.id)) shared.crew.push(p); });

  return shared;
}

function calculateConstellationStats(connections) {
  return connections.reduce((acc, conn) => ({
    totalActors: acc.totalActors + conn.shared.actors.length,
    totalDirectors: acc.totalDirectors + conn.shared.directors.length,
    totalConnections: acc.totalConnections + 1
  }), { totalActors: 0, totalDirectors: 0, totalConnections: 0 });
}

function renderConstellationSVG(movies, connections, container) {
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;

  container.innerHTML = '';
  const svg = createSvgElement('svg', { width, height, class: 'constellation-svg' });

  // Star field
  const starGroup = createSvgGroup('star-field');
  for (let i = 0; i < 50; i++) {
    starGroup.appendChild(createSvgCircle(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 1.5 + 0.5,
      { class: 'background-star', opacity: Math.random() * 0.5 + 0.2 }
    ));
  }
  svg.appendChild(starGroup);

  // Positions
  const positions = calculateCircularPositions(movies.length, width, height);

  // Connections
  connections.forEach(conn => {
    const i1 = movies.findIndex(m => m.id === conn.movie1.id);
    const i2 = movies.findIndex(m => m.id === conn.movie2.id);
    if (i1 !== -1 && i2 !== -1) {
      drawConnection(svg, positions[i1], positions[i2], conn);
    }
  });

  // Movie nodes
  movies.forEach((movie, index) => {
    const connCount = connections.filter(c => c.movie1.id === movie.id || c.movie2.id === movie.id).length;
    drawConstellationNode(svg, movie, positions[index], connCount);
  });

  container.appendChild(svg);
}

function calculateCircularPositions(count, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  return Array.from({ length: count }, (_, i) => {
    const angle = (i * 2 * Math.PI / count) - Math.PI / 2;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  });
}

function drawConnection(svg, pos1, pos2, connection) {
  const { shared } = connection;
  let strokeColor = '#00d9ff', strokeWidth = 1, strokeDasharray = null;

  if (shared.directors.length) {
    strokeColor = '#ffd700';
    strokeWidth = 3;
  } else if (shared.crew.length && !shared.actors.length) {
    strokeColor = '#a855f7';
    strokeWidth = 1.5;
    strokeDasharray = '5,5';
  } else {
    strokeWidth = Math.min(shared.actors.length, 5) * 0.5;
  }

  const line = createSvgLine(pos1.x, pos1.y, pos2.x, pos2.y, {
    class: 'constellation-connection',
    stroke: strokeColor,
    'stroke-width': strokeWidth,
    opacity: 0.6
  });
  if (strokeDasharray) line.setAttribute('stroke-dasharray', strokeDasharray);

  const tooltipText = formatConnectionTooltip(shared);

  line.addEventListener('mouseenter', e => {
    line.setAttribute('stroke-width', strokeWidth * 1.5);
    line.setAttribute('opacity', 1);
    showConnectionTooltip(e, tooltipText, svg);
  });

  line.addEventListener('mouseleave', () => {
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('opacity', 0.6);
    hideConnectionTooltip(svg);
  });

  svg.appendChild(line);
}

function formatConnectionTooltip(shared) {
  const parts = [];
  if (shared.directors.length) parts.push(`Director: ${shared.directors.map(d => d.name).join(', ')}`);
  if (shared.actors.length) {
    const names = shared.actors.slice(0, 5).map(a => a.name).join(', ');
    parts.push(`Actors: ${names}${shared.actors.length > 5 ? ` +${shared.actors.length - 5} more` : ''}`);
  }
  if (shared.crew.length) {
    const names = shared.crew.slice(0, 3).map(c => `${c.name} (${c.job})`).join(', ');
    parts.push(`Crew: ${names}${shared.crew.length > 3 ? ` +${shared.crew.length - 3} more` : ''}`);
  }
  return parts.join(' | ');
}

function showConnectionTooltip(event, text, svg) {
  hideConnectionTooltip(svg);
  svg.appendChild(createSvgText(event.offsetX || event.clientX, (event.offsetY || event.clientY) - 10, text, {
    id: 'connection-tooltip',
    class: 'constellation-connection-tooltip'
  }));
}

function hideConnectionTooltip(svg) {
  svg.querySelector('#connection-tooltip')?.remove();
}

function drawConstellationNode(svg, movie, pos, connectionCount) {
  const nodeGroup = createSvgGroup('constellation-node', { 'data-movie-id': movie.id });

  // Clip path
  const clipId = `constellation-clip-${movie.id}`;
  svg.appendChild(createClipPath(clipId, createSvgCircle(pos.x, pos.y, 40)));

  // Poster
  nodeGroup.appendChild(createSvgImage(pos.x - 40, pos.y - 40, 80, 80, getPosterUrl(movie), { 'clip-path': `url(#${clipId})` }));

  // Border
  const border = createSvgCircle(pos.x, pos.y, 40, {
    class: 'constellation-node-border',
    stroke: movie.color,
    fill: 'none',
    'stroke-width': 3
  });
  nodeGroup.appendChild(border);

  // Glow
  const glow = createSvgCircle(pos.x, pos.y, 45, {
    class: 'constellation-node-glow',
    stroke: movie.color,
    fill: 'none',
    'stroke-width': 2,
    opacity: clamp(0.3 + connectionCount * 0.1, 0, 0.8)
  });
  glow.style.filter = 'blur(4px)';
  nodeGroup.appendChild(glow);

  // Badge
  if (connectionCount > 0) {
    nodeGroup.appendChild(createSvgCircle(pos.x + 30, pos.y - 30, 12, { class: 'constellation-badge', fill: movie.color }));
    nodeGroup.appendChild(createSvgText(pos.x + 30, pos.y - 30, connectionCount, {
      class: 'constellation-badge-text',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle'
    }));
  }

  // Tooltip
  const tooltip = createSvgText(pos.x, pos.y - 55, movie.title, {
    class: 'constellation-node-tooltip',
    'text-anchor': 'middle',
    opacity: 0
  });
  nodeGroup.appendChild(tooltip);

  // Events
  nodeGroup.addEventListener('mouseenter', () => {
    tooltip.setAttribute('opacity', 1);
    border.setAttribute('stroke-width', 4);
    nodeGroup.style.cursor = 'pointer';
  });

  nodeGroup.addEventListener('mouseleave', () => {
    tooltip.setAttribute('opacity', 0);
    border.setAttribute('stroke-width', 3);
  });

  nodeGroup.addEventListener('click', () => window.openMovieCube?.(movie.id));

  svg.appendChild(nodeGroup);
}

function renderFrequentCollaborators(movies, container) {
  const personCount = new Map();

  movies.forEach(movie => {
    movie.cast?.forEach(p => {
      const entry = personCount.get(p.id) || { name: p.name, count: 0, type: 'actor' };
      entry.count++;
      personCount.set(p.id, entry);
    });

    const director = movie.crew?.find(p => p.job === 'Director');
    if (director) {
      const entry = personCount.get(director.id) || { name: director.name, count: 0, type: 'director' };
      entry.count++;
      personCount.set(director.id, entry);
    }
  });

  const frequentCollabs = [...personCount.values()].filter(p => p.count >= 3).sort((a, b) => b.count - a.count);

  if (frequentCollabs.length) {
    const div = document.createElement('div');
    div.className = 'frequent-collaborators';
    div.innerHTML = `
      <h4>Frequent Collaborators (3+ movies):</h4>
      <div class="collaborator-list">
        ${frequentCollabs.map(c => `<span class="collaborator-tag ${c.type}">${c.name} (${c.count})</span>`).join('')}
      </div>
    `;
    container.appendChild(div);
  }
}

// ============================================
// TIMELINE RIBBON VISUALIZATION
// ============================================

function renderTimelineRibbon(movies, container) {
  if (!movies?.length) {
    container.innerHTML = '<div class="panel-placeholder"><p>No movies to display</p></div>';
    return;
  }

  console.log('📅 Rendering Timeline Ribbon');
  container.innerHTML = '';

  const stats = calculateTimelineStats(movies);

  // Stats bar
  const statsDiv = document.createElement('div');
  statsDiv.className = 'timeline-stats';
  statsDiv.innerHTML = `
    <div class="stat-item"><span class="stat-label">Time Span:</span><span class="stat-value">${stats.timeSpan} years</span></div>
    <div class="stat-item"><span class="stat-label">Peak Decade:</span><span class="stat-value">${stats.peakDecade}</span></div>
    <div class="stat-item"><span class="stat-label">Total Runtime:</span><span class="stat-value">${stats.totalRuntime}</span></div>
  `;
  container.appendChild(statsDiv);

  // Timeline container
  const timelineDiv = document.createElement('div');
  timelineDiv.className = 'timeline-scroll-container';
  container.appendChild(timelineDiv);

  renderTimelineSVG(movies, timelineDiv, stats);
}

function calculateTimelineStats(movies) {
  const years = movies.map(m => m.year || 0).filter(y => y > 0);

  if (!years.length) {
    return { minYear: 2000, maxYear: 2024, timeSpan: 0, peakDecade: 'N/A', totalRuntime: '0h 0m' };
  }

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const timeSpan = maxYear - minYear;

  // Peak decade
  const decadeCounts = years.reduce((acc, year) => {
    const decade = Math.floor(year / 10) * 10;
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});
  const peakDecade = Object.keys(decadeCounts).reduce((a, b) => decadeCounts[a] > decadeCounts[b] ? a : b);

  // Total runtime
  const totalMinutes = movies.reduce((sum, m) => sum + (m.runtime || 0), 0);
  const totalRuntime = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

  return { minYear, maxYear, timeSpan, peakDecade: `${peakDecade}s`, totalRuntime };
}

function renderTimelineSVG(movies, container, stats) {
  const height = 500;
  const padding = 100;
  const timelineY = height / 2;
  const startYear = stats.minYear - 5;
  const endYear = stats.maxYear + 5;
  const yearSpan = endYear - startYear;
  const width = Math.max(container.clientWidth || 1000, yearSpan * 100);

  container.innerHTML = '';
  const svg = createSvgElement('svg', { width, height, class: 'timeline-svg' });

  // Timeline line
  svg.appendChild(createSvgLine(padding, timelineY, width - padding, timelineY, { class: 'timeline-line' }));

  // Year markers
  const markerInterval = yearSpan > 30 ? 10 : 5;
  for (let year = Math.ceil(startYear / markerInterval) * markerInterval; year <= endYear; year += markerInterval) {
    const x = padding + ((year - startYear) / yearSpan) * (width - 2 * padding);
    svg.appendChild(createSvgLine(x, timelineY - 10, x, timelineY + 10, { class: 'timeline-marker' }));
    svg.appendChild(createSvgText(x, timelineY + 30, year, { class: 'timeline-year-label', 'text-anchor': 'middle' }));
  }

  // Movie cards
  const sortedMovies = [...movies].sort((a, b) => (a.year || 0) - (b.year || 0));
  sortedMovies.forEach((movie, index) => {
    const year = movie.year || stats.minYear;
    const x = padding + ((year - startYear) / yearSpan) * (width - 2 * padding);
    const isAbove = index % 2 === 0;
    const cardY = isAbove ? timelineY - 280 : timelineY + 80;

    drawTimelineCard(svg, movie, x, cardY, isAbove, timelineY);
  });

  container.appendChild(svg);
}

function drawTimelineCard(svg, movie, x, cardY, isAbove, timelineY) {
  const cardGroup = createSvgGroup('timeline-card', { 'data-movie-id': movie.id });

  // Connector
  cardGroup.appendChild(createSvgLine(x, timelineY, x, isAbove ? cardY + 180 : cardY + 20, {
    class: 'timeline-connector',
    stroke: movie.color
  }));

  // Card background
  const cardBg = createSvgRect(x - 60, cardY, 120, 200, {
    class: 'timeline-card-bg',
    rx: 8,
    stroke: movie.color
  });
  cardGroup.appendChild(cardBg);

  // Poster
  const clipId = `timeline-clip-${movie.id}`;
  const clipRect = createSvgRect(x - 55, cardY + 5, 110, 140, { rx: 6 });
  svg.appendChild(createClipPath(clipId, clipRect));
  cardGroup.appendChild(createSvgImage(x - 55, cardY + 5, 110, 165, getPosterUrl(movie), { 'clip-path': `url(#${clipId})` }));

  // Title
  cardGroup.appendChild(createSvgText(x, cardY + 157, truncateText(movie.title, 20), {
    class: 'timeline-card-title',
    'text-anchor': 'middle'
  }));

  // Year
  cardGroup.appendChild(createSvgText(x, cardY + 172, movie.year || 'N/A', {
    class: 'timeline-card-year',
    'text-anchor': 'middle'
  }));

  // Genre tag
  const primaryGenre = movie.genres?.[0]?.name || 'Unknown';
  cardGroup.appendChild(createSvgRect(x - 40, cardY + 180, 80, 16, {
    class: 'timeline-genre-tag',
    rx: 8,
    fill: getGenreColor(primaryGenre)
  }));
  cardGroup.appendChild(createSvgText(x, cardY + 191, primaryGenre, {
    class: 'timeline-genre-text',
    'text-anchor': 'middle'
  }));

  // Events
  cardGroup.addEventListener('mouseenter', () => {
    cardBg.setAttribute('stroke-width', 3);
    cardGroup.style.cursor = 'pointer';
  });
  cardGroup.addEventListener('mouseleave', () => cardBg.setAttribute('stroke-width', 2));
  cardGroup.addEventListener('click', () => window.openMovieCube?.(movie.id));

  svg.appendChild(cardGroup);
}

// ============================================
// RADAR CHART VISUALIZATION
// ============================================

function renderRadarChart(movies, container, selectedVars = DEFAULT_RADAR_VARS) {
  if (!movies?.length) {
    container.innerHTML = '<div class="panel-placeholder"><p>No movies to display</p></div>';
    return;
  }

  console.log('📊 Rendering Radar Chart');
  container.innerHTML = '';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'radar-controls';
  controls.innerHTML = `
    <h4>Select Variables (4-6):</h4>
    <div class="radar-checkboxes">
      ${Object.entries(RADAR_VARIABLES).map(([key, val]) => `
        <label class="radar-checkbox-label">
          <input type="checkbox" value="${key}" ${selectedVars.includes(key) ? 'checked' : ''}>
          <span>${val.label}</span>
        </label>
      `).join('')}
    </div>
  `;
  container.appendChild(controls);

  // SVG container
  const svgContainer = document.createElement('div');
  svgContainer.className = 'radar-svg-container';
  container.appendChild(svgContainer);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'radar-legend';
  legend.innerHTML = movies.map((m, i) => `
    <div class="legend-item">
      <span class="legend-color" style="background: ${MOVIE_COLORS[i]}"></span>
      <span class="legend-title">${m.title}</span>
    </div>
  `).join('');
  container.appendChild(legend);

  // Checkbox handlers
  controls.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...controls.querySelectorAll('input:checked')].map(c => c.value);
      if (checked.length >= 4 && checked.length <= 6) {
        renderRadarSVG(movies, svgContainer, checked);
      } else {
        cb.checked = checked.length < 4 ? true : false;
      }
    });
  });

  renderRadarSVG(movies, svgContainer, selectedVars);
}

function renderRadarSVG(movies, container, variables) {
  const width = 500, height = 450;
  const centerX = width / 2, centerY = height / 2;
  const maxRadius = 180, levels = 4;
  const uniqueId = Date.now().toString(36);
  const angleSlice = (Math.PI * 2) / variables.length;

  const normalizedData = movies.map(movie =>
    variables.reduce((acc, varKey) => {
      const value = getRadarMovieValue(movie, varKey);
      const { min, max } = RADAR_VARIABLES[varKey];
      acc[varKey] = clamp(normalize(value, min, max), 0, 1);
      return acc;
    }, {})
  );

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        ${movies.map((_, i) => `
          <linearGradient id="radarGrad-${uniqueId}-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${MOVIE_COLORS[i]};stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:${MOVIE_COLORS[i]};stop-opacity:0.1" />
          </linearGradient>
        `).join('')}
      </defs>

      <g class="radar-levels">
        ${Array.from({ length: levels }, (_, i) => {
          const r = maxRadius * ((i + 1) / levels);
          return `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="rgba(0,217,255,0.15)" stroke-width="1"/>`;
        }).join('')}
      </g>

      <g class="radar-axes">
        ${variables.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          return `<line x1="${centerX}" y1="${centerY}" x2="${centerX + Math.cos(angle) * maxRadius}" y2="${centerY + Math.sin(angle) * maxRadius}" stroke="rgba(0,217,255,0.2)" stroke-width="1"/>`;
        }).join('')}
      </g>

      <g class="radar-labels">
        ${variables.map((varKey, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          return `<text x="${centerX + Math.cos(angle) * (maxRadius + 25)}" y="${centerY + Math.sin(angle) * (maxRadius + 25)}" text-anchor="middle" dominant-baseline="middle" fill="#94a3b8" font-size="11" font-family="Barlow">${RADAR_VARIABLES[varKey].label}</text>`;
        }).join('')}
      </g>

      <g class="radar-polygons">
        ${movies.map((_, mi) => {
          const points = variables.map((varKey, vi) => {
            const angle = angleSlice * vi - Math.PI / 2;
            const r = normalizedData[mi][varKey] * maxRadius;
            return `${centerX + Math.cos(angle) * r},${centerY + Math.sin(angle) * r}`;
          }).join(' ');
          return `<polygon points="${points}" fill="url(#radarGrad-${uniqueId}-${mi})" stroke="${MOVIE_COLORS[mi]}" stroke-width="2" class="radar-polygon" data-movie-index="${mi}"/>`;
        }).join('')}
      </g>

      <g class="radar-points">
        ${movies.flatMap((_, mi) => variables.map((varKey, vi) => {
          const angle = angleSlice * vi - Math.PI / 2;
          const r = normalizedData[mi][varKey] * maxRadius;
          return `<circle cx="${centerX + Math.cos(angle) * r}" cy="${centerY + Math.sin(angle) * r}" r="4" fill="${MOVIE_COLORS[mi]}" stroke="#000" stroke-width="1"/>`;
        })).join('')}
      </g>
    </svg>
  `;

  container.innerHTML = svg;

  // Hover interactions
  container.querySelectorAll('.radar-polygon').forEach(poly => {
    poly.addEventListener('mouseenter', () => {
      container.querySelectorAll('.radar-polygon').forEach(p => p.style.opacity = p === poly ? '1' : '0.2');
    });
    poly.addEventListener('mouseleave', () => {
      container.querySelectorAll('.radar-polygon').forEach(p => p.style.opacity = '1');
    });
  });
}

function getRadarMovieValue(movie, varKey) {
  const values = {
    vote_average: movie.vote_average || 5,
    runtime: movie.runtime || 120,
    popularity: Math.min(movie.popularity || 10, 100),
    vote_count: movie.vote_count || 100,
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    cast_size: movie.cast?.length || 10,
    recency: movie.year || 2000
  };
  return values[varKey] ?? 0;
}

// ============================================
// EXPORTS
// ============================================

window.compareUtils = {
  MOVIE_COLORS,
  moviesWithData: () => moviesWithData,
  getDirector: crew => crew.find(p => p.job === 'Director')?.name || 'Unknown',
  getTopCast: (cast, limit = 5) => cast.slice(0, limit).map(p => p.name),
  normalize,
  findSharedPeople,
  TMDB_IMG,
  TMDB_API_KEY
};

// ============================================
// INIT
// ============================================

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
