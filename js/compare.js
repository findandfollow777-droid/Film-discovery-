/* =============================================
   ORBIT – Shortlist Comparison Page
   Renders shortlisted movies, handles selection
   (max 5), tab switching, and placeholder panels.
============================================= */

(function () {
  'use strict';

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const MAX_SELECTION = 5;
  const SELECTION_COLORS = ['#00d9ff', '#ffd700', '#a855f7', '#10b981', '#ef4444'];
  const TMDB_IMG_W185 = TMDB_IMG + 'w185';
  const POSTER_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278" fill="%230f1729">' +
    '<rect width="185" height="278"/>' +
    '<text x="92" y="139" text-anchor="middle" fill="%23334155" font-size="14" font-family="sans-serif">No Poster</text>' +
    '</svg>'
  );

  // ============================================================================
  // STATE
  // ============================================================================

  let selected = [];       // Array of movie IDs in selection order
  let toastTimer = null;
  let enrichedMovies = null;   // Cached array of TMDB-enriched movie objects
  let fetchedForIds = null;    // Comma-joined sorted IDs to detect selection change
  let orbitalTooltipEl = null; // Reference to tooltip div
  var currentSort = 'vote_average';
  var gravKeywords = null;
  var keywordsCache = {};

  // ============================================================================
  // DOM REFS
  // ============================================================================

  const shortlistSection = document.getElementById('shortlistSection');
  const shortlistGrid    = document.getElementById('shortlistGrid');
  const selectionCounter = document.getElementById('selectionCounter');
  const compareBtn       = document.getElementById('compareBtn');
  const compareHint      = document.getElementById('compareHint');
  const emptyState       = document.getElementById('emptyState');
  const comparisonSection = document.getElementById('comparisonSection');
  const selectedLegend   = document.getElementById('selectedLegend');
  const compareTabs      = document.getElementById('compareTabs');
  const maxToast         = document.getElementById('maxToast');
  const clearAllBtn      = document.getElementById('clearAllBtn');

  // ============================================================================
  // INIT
  // ============================================================================

  function init() {
    renderShortlist();
    setupEventListeners();
  }

  // ============================================================================
  // RENDER SHORTLIST GRID
  // ============================================================================

  function renderShortlist() {
    const movies = window.getShortlist();

    if (movies.length === 0) {
      shortlistSection.hidden = true;
      emptyState.hidden = false;
      comparisonSection.hidden = true;
      clearAllBtn.style.display = 'none';
      return;
    }

    shortlistSection.hidden = false;
    emptyState.hidden = true;
    clearAllBtn.style.display = '';

    shortlistGrid.innerHTML = '';
    movies.forEach(movie => {
      shortlistGrid.appendChild(createCard(movie));
    });

    // Re-apply selection state to cards that are still selected
    syncSelectionToCards();
    updateCounter();
    updateCompareBtn();
  }

  function createCard(movie) {
    const card = document.createElement('div');
    card.className = 'sl-card';
    card.dataset.movieId = movie.id;

    const posterSrc = movie.poster
      ? TMDB_IMG_W185 + movie.poster
      : POSTER_PLACEHOLDER;

    card.innerHTML =
      '<button class="sl-card-remove" title="Remove from shortlist">&times;</button>' +
      '<div class="sl-card-badge"></div>' +
      '<img class="sl-card-poster" src="' + posterSrc + '" alt="" loading="lazy">' +
      '<div class="sl-card-info">' +
        '<div class="sl-card-title">' + escapeHTML(movie.title) + '</div>' +
        (movie.year ? '<div class="sl-card-year">' + movie.year + '</div>' : '') +
      '</div>';

    return card;
  }

  // ============================================================================
  // SELECTION LOGIC
  // ============================================================================

  function toggleSelection(movieId) {
    const idx = selected.indexOf(movieId);

    if (idx !== -1) {
      // Deselect
      selected.splice(idx, 1);
    } else {
      // Select
      if (selected.length >= MAX_SELECTION) {
        showMaxToast();
        return;
      }
      selected.push(movieId);
    }

    syncSelectionToCards();
    updateCounter();
    updateCompareBtn();
  }

  function syncSelectionToCards() {
    const cards = shortlistGrid.querySelectorAll('.sl-card');
    cards.forEach(card => {
      const id = parseInt(card.dataset.movieId);
      const selIdx = selected.indexOf(id);

      if (selIdx !== -1) {
        card.classList.add('selected');
        card.dataset.sel = String(selIdx + 1);
        const badge = card.querySelector('.sl-card-badge');
        if (badge) badge.textContent = String(selIdx + 1);
      } else {
        card.classList.remove('selected');
        delete card.dataset.sel;
        const badge = card.querySelector('.sl-card-badge');
        if (badge) badge.textContent = '';
      }
    });
  }

  function updateCounter() {
    const count = selected.length;
    selectionCounter.textContent = count + ' / ' + MAX_SELECTION + ' selected for comparison';
    selectionCounter.classList.toggle('has-selection', count > 0);
  }

  function updateCompareBtn() {
    const count = selected.length;
    compareBtn.disabled = count < 2;

    if (count < 2) {
      compareHint.textContent = count === 0
        ? 'Select 2\u20135 movies to compare'
        : 'Select at least 1 more movie';
    } else {
      compareHint.textContent = count + ' movies ready to compare';
    }
  }

  // ============================================================================
  // MAX TOAST
  // ============================================================================

  function showMaxToast() {
    if (toastTimer) clearTimeout(toastTimer);
    maxToast.hidden = false;
    // Force reflow so the transition triggers
    void maxToast.offsetWidth;
    maxToast.classList.add('show');

    toastTimer = setTimeout(() => {
      maxToast.classList.remove('show');
      setTimeout(() => { maxToast.hidden = true; }, 300);
    }, 2000);
  }

  // ============================================================================
  // REMOVE MOVIE FROM SHORTLIST
  // ============================================================================

  function removeMovie(movieId) {
    window.removeFromShortlist(movieId);

    // Also deselect if selected
    const idx = selected.indexOf(movieId);
    if (idx !== -1) selected.splice(idx, 1);

    // Update badge if it exists
    if (typeof window.updateShortlistBadge === 'function') {
      window.updateShortlistBadge();
    }

    renderShortlist();

    // If comparison was showing, update or hide it
    if (!comparisonSection.hidden) {
      if (selected.length >= 2) {
        showComparison();
      } else {
        comparisonSection.hidden = true;
      }
    }
  }

  // ============================================================================
  // CLEAR ALL
  // ============================================================================

  function clearAll() {
    if (!confirm('Clear your entire shortlist? This cannot be undone.')) return;
    window.clearShortlist();
    selected = [];

    if (typeof window.updateShortlistBadge === 'function') {
      window.updateShortlistBadge();
    }

    comparisonSection.hidden = true;
    renderShortlist();
  }

  // ============================================================================
  // COMPARISON
  // ============================================================================

  async function showComparison() {
    comparisonSection.hidden = false;
    renderLegend();
    var currentIds = selected.join(',');
    if (fetchedForIds !== currentIds) {
      await fetchEnrichedData();
      fetchedForIds = currentIds;
    }
    renderActivePanel();
    comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderLegend() {
    const movies = window.getShortlist();
    selectedLegend.innerHTML = '';

    selected.forEach((movieId, i) => {
      const movie = movies.find(m => m.id === movieId);
      if (!movie) return;

      const item = document.createElement('div');
      item.className = 'legend-item';

      const swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.background = SELECTION_COLORS[i];

      const title = document.createElement('span');
      title.className = 'legend-title';
      title.textContent = movie.title;

      item.appendChild(swatch);
      item.appendChild(title);

      if (movie.year) {
        const year = document.createElement('span');
        year.className = 'legend-year';
        year.textContent = '(' + movie.year + ')';
        item.appendChild(year);
      }

      selectedLegend.appendChild(item);
    });
  }

  // ============================================================================
  // TAB SWITCHING
  // ============================================================================

  function switchTab(panelName) {
    // Update tab buttons
    compareTabs.querySelectorAll('.compare-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.panel === panelName);
    });

    // Update panels
    document.querySelectorAll('.compare-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + panelName);
    });

    // Render active panel content if data is available
    if (enrichedMovies) renderActivePanel();
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  function setupEventListeners() {
    // Shortlist grid: card click (select/deselect) and remove button
    shortlistGrid.addEventListener('click', function (e) {
      // Remove button
      const removeBtn = e.target.closest('.sl-card-remove');
      if (removeBtn) {
        e.stopPropagation();
        const card = removeBtn.closest('.sl-card');
        if (card) removeMovie(parseInt(card.dataset.movieId));
        return;
      }

      // Card click = toggle selection
      const card = e.target.closest('.sl-card');
      if (card) {
        toggleSelection(parseInt(card.dataset.movieId));
      }
    });

    // Compare button
    compareBtn.addEventListener('click', function () {
      if (selected.length >= 2) {
        showComparison();
      }
    });

    // Clear all
    clearAllBtn.addEventListener('click', clearAll);

    // Tab switching
    compareTabs.addEventListener('click', function (e) {
      const tab = e.target.closest('.compare-tab');
      if (tab && tab.dataset.panel) {
        switchTab(tab.dataset.panel);
      }
    });
  }

  // ============================================================================
  // UTIL
  // ============================================================================

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ============================================================================
  // TMDB DATA FETCHING
  // ============================================================================

  async function fetchEnrichedData() {
    const panel = document.getElementById('panel-orbital');
    panel.innerHTML = '<div class="panel-loading"><div class="loading-spinner"></div><span>Fetching movie data…</span></div>';

    const movies = window.getShortlist();

    try {
      const results = await Promise.all(selected.map(async (movieId, i) => {
        const movie = movies.find(m => m.id === movieId);
        const [detailRes, creditsRes] = await Promise.all([
          fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + TMDB_API_KEY),
          fetch('https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=' + TMDB_API_KEY)
        ]);
        const detail = await detailRes.json();
        const credits = await creditsRes.json();

        return {
          id: movieId,
          title: detail.title || (movie && movie.title) || 'Unknown',
          year: detail.release_date ? detail.release_date.slice(0, 4) : (movie && movie.year) || '',
          poster: detail.poster_path || (movie && movie.poster) || null,
          color: SELECTION_COLORS[i],
          index: i,
          genres: (detail.genres || []).map(function (g) { return { id: g.id, name: g.name }; }),
          runtime: detail.runtime || 0,
          vote_average: detail.vote_average || 0,
          overview: detail.overview || '',
          release_date: detail.release_date || '',
          budget: detail.budget || 0,
          revenue: detail.revenue || 0,
          popularity: detail.popularity || 0,
          vote_count: detail.vote_count || 0,
          cast: (credits.cast || []).slice(0, 20).map(function (c) {
            return { id: c.id, name: c.name, character: c.character || '', profile_path: c.profile_path };
          }),
          crew: (credits.crew || []).filter(function (c) {
            return ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer',
                    'Editor', 'Director of Photography', 'Original Music Composer'].indexOf(c.job) !== -1;
          }).map(function (c) {
            return { id: c.id, name: c.name, job: c.job, profile_path: c.profile_path };
          })
        };
      }));

      enrichedMovies = results;
    } catch (err) {
      console.error('Failed to fetch enriched data:', err);
      panel.innerHTML = '<div class="panel-placeholder"><span class="placeholder-icon">⚠</span>' +
        '<h3>Fetch Error</h3><p>Could not load movie data. Please try again.</p></div>';
      enrichedMovies = null;
    }
  }

  // ============================================================================
  // SVG HELPERS
  // ============================================================================

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    }
    return el;
  }

  function svgCircle(cx, cy, r, attrs) {
    var a = { cx: cx, cy: cy, r: r };
    if (attrs) Object.keys(attrs).forEach(function (k) { a[k] = attrs[k]; });
    return svgEl('circle', a);
  }

  function svgLine(x1, y1, x2, y2, attrs) {
    var a = { x1: x1, y1: y1, x2: x2, y2: y2 };
    if (attrs) Object.keys(attrs).forEach(function (k) { a[k] = attrs[k]; });
    return svgEl('line', a);
  }

  function svgText(x, y, text, attrs) {
    var el = svgEl('text', Object.assign({ x: x, y: y }, attrs || {}));
    el.textContent = text;
    return el;
  }

  function svgGroup(attrs) {
    return svgEl('g', attrs);
  }

  function drawAnnulus(cx, cy, innerR, outerR, fill, opacity) {
    // SVG path: outer circle CW, inner circle CCW, evenodd fill
    var p = 'M ' + (cx - outerR) + ' ' + cy +
      ' A ' + outerR + ' ' + outerR + ' 0 1 1 ' + (cx + outerR) + ' ' + cy +
      ' A ' + outerR + ' ' + outerR + ' 0 1 1 ' + (cx - outerR) + ' ' + cy +
      ' M ' + (cx - innerR) + ' ' + cy +
      ' A ' + innerR + ' ' + innerR + ' 0 1 0 ' + (cx + innerR) + ' ' + cy +
      ' A ' + innerR + ' ' + innerR + ' 0 1 0 ' + (cx - innerR) + ' ' + cy + ' Z';
    return svgEl('path', {
      d: p,
      fill: fill,
      opacity: opacity || 0.08,
      'fill-rule': 'evenodd'
    });
  }

  // ============================================================================
  // OVERLAP DETECTION
  // ============================================================================

  function computeOverlaps(movies) {
    // --- Genre overlaps ---
    var genreMap = {};  // genreId -> { id, name, movieIds: Set }
    movies.forEach(function (m) {
      m.genres.forEach(function (g) {
        if (!genreMap[g.id]) genreMap[g.id] = { id: g.id, name: g.name, movieIds: new Set() };
        genreMap[g.id].movieIds.add(m.id);
      });
    });

    var sharedGenres = [];
    var uniqueGenres = [];
    Object.keys(genreMap).forEach(function (gid) {
      var g = genreMap[gid];
      var entry = { id: g.id, name: g.name, movieIds: Array.from(g.movieIds) };
      if (g.movieIds.size >= 2) {
        sharedGenres.push(entry);
      } else {
        uniqueGenres.push(entry);
      }
    });

    // --- Cast overlaps ---
    var castMap = {};  // personId -> { id, name, profile_path, roles: [{ movieId, character, color }] }
    movies.forEach(function (m) {
      m.cast.forEach(function (c) {
        if (!castMap[c.id]) castMap[c.id] = { id: c.id, name: c.name, profile_path: c.profile_path, roles: [] };
        castMap[c.id].roles.push({ movieId: m.id, movieTitle: m.title, character: c.character, color: m.color });
      });
    });

    var sharedCast = [];
    Object.keys(castMap).forEach(function (pid) {
      var person = castMap[pid];
      if (person.roles.length >= 2) sharedCast.push(person);
    });

    // --- Crew overlaps ---
    var crewMap = {};
    movies.forEach(function (m) {
      m.crew.forEach(function (c) {
        if (!crewMap[c.id]) crewMap[c.id] = { id: c.id, name: c.name, profile_path: c.profile_path, jobs: new Set(), roles: [] };
        crewMap[c.id].jobs.add(c.job);
        crewMap[c.id].roles.push({ movieId: m.id, movieTitle: m.title, job: c.job, color: m.color });
      });
    });

    var sharedCrew = [];
    Object.keys(crewMap).forEach(function (pid) {
      var person = crewMap[pid];
      // Check if appears in 2+ distinct movies
      var movieSet = new Set(person.roles.map(function (r) { return r.movieId; }));
      if (movieSet.size >= 2) {
        person.jobs = Array.from(person.jobs);
        sharedCrew.push(person);
      }
    });

    return {
      genres: { shared: sharedGenres, unique: uniqueGenres },
      cast: sharedCast,
      crew: sharedCrew
    };
  }

  // ============================================================================
  // ORBITAL SORT HELPERS
  // ============================================================================

  var SORT_METRICS = [
    { key: 'vote_average', label: 'Rating', format: function(v) { return v ? v.toFixed(1) : '\u2014'; } },
    { key: 'popularity', label: 'Popularity', format: function(v) { return v ? v.toFixed(0) : '\u2014'; } },
    { key: 'runtime', label: 'Runtime', format: function(v) { return v ? v + ' min' : '\u2014'; } },
    { key: 'year', label: 'Year', format: function(v) { return v || '\u2014'; } },
    { key: 'revenue', label: 'Revenue', format: function(v) { return formatRevenue(v); } }
  ];

  function formatRevenue(v) {
    if (!v) return '\u2014';
    if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6) return '$' + Math.round(v / 1e6) + 'M';
    if (v > 0) return '$' + Math.round(v / 1e3) + 'K';
    return '\u2014';
  }

  function getMetricValue(movie, metric) {
    if (metric === 'year') return parseInt(movie.year) || 0;
    return movie[metric] || 0;
  }

  function getMetricDisplay(movie, metric) {
    var cfg = SORT_METRICS.find(function(m) { return m.key === metric; });
    var val = getMetricValue(movie, metric);
    return cfg ? cfg.format(val) : String(val);
  }

  function getMetricLabel(metric) {
    var cfg = SORT_METRICS.find(function(m) { return m.key === metric; });
    return cfg ? cfg.label : metric;
  }

  function getSortedMovies(metric) {
    if (!enrichedMovies) return [];
    return enrichedMovies.slice().sort(function(a, b) {
      return getMetricValue(b, metric) - getMetricValue(a, metric);
    });
  }

  function getOrbitRadius(index, count) {
    var INNER = 80, OUTER = 250;
    if (count <= 1) return (INNER + OUTER) / 2;
    return INNER + (index / (count - 1)) * (OUTER - INNER);
  }

  // ============================================================================
  // ORBITAL RINGS RENDERER
  // ============================================================================

  function renderOrbitalRings() {
    if (!enrichedMovies || enrichedMovies.length === 0) return;

    var panel = document.getElementById('panel-orbital');
    panel.innerHTML = '';

    // --- Gravitational Pull input ---
    var gravWrap = document.createElement('div');
    gravWrap.className = 'grav-pull-wrap';

    var gravInput = document.createElement('input');
    gravInput.type = 'text';
    gravInput.className = 'grav-pull-input';
    gravInput.placeholder = 'What draws you in? (dark, revenge, hope...)';
    if (gravKeywords) gravInput.value = gravKeywords;

    var gravBtn = document.createElement('button');
    gravBtn.className = 'grav-pull-btn';
    gravBtn.textContent = 'PULL';

    var gravClear = document.createElement('button');
    gravClear.className = 'grav-clear-btn';
    gravClear.textContent = '\u2715';
    if (!gravKeywords) gravClear.hidden = true;

    gravWrap.appendChild(gravInput);
    gravWrap.appendChild(gravBtn);
    gravWrap.appendChild(gravClear);
    panel.appendChild(gravWrap);

    // --- Sort controls ---
    var sortWrap = document.createElement('div');
    sortWrap.className = 'orbital-sort-controls';
    SORT_METRICS.forEach(function(m) {
      var btn = document.createElement('button');
      btn.className = 'sort-metric-btn' + (m.key === currentSort && !gravKeywords ? ' active' : '');
      btn.dataset.metric = m.key;
      btn.textContent = m.label;
      sortWrap.appendChild(btn);
    });
    panel.appendChild(sortWrap);

    // --- SVG ---
    var SIZE = 700;
    var ctr = SIZE / 2;

    var svgWrap = document.createElement('div');
    svgWrap.className = 'orbital-svg-wrap';
    panel.appendChild(svgWrap);

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + SIZE + ' ' + SIZE,
      'class': 'orbital-rings-svg'
    });
    svgWrap.appendChild(svg);

    var defs = svgEl('defs');
    svg.appendChild(defs);

    // Glow filter
    var filter = svgEl('filter', { id: 'orbGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    var feGauss = svgEl('feGaussianBlur', { stdDeviation: '4', result: 'glow' });
    var feMerge = svgEl('feMerge');
    feMerge.appendChild(svgEl('feMergeNode', { 'in': 'glow' }));
    feMerge.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
    filter.appendChild(feGauss);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    // Get sorted movies
    var sorted;
    if (gravKeywords) {
      sorted = enrichedMovies.slice().sort(function(a, b) {
        return (b._gravScore || 0) - (a._gravScore || 0);
      });
    } else {
      sorted = getSortedMovies(currentSort);
    }
    var count = sorted.length;

    // --- Orbital paths (dashed circles) ---
    for (var oi = 0; oi < count; oi++) {
      var orbR = getOrbitRadius(oi, count);
      svg.appendChild(svgCircle(ctr, ctr, orbR, {
        fill: 'none',
        stroke: 'rgba(255, 255, 255, 0.06)',
        'stroke-width': '1',
        'stroke-dasharray': '6 10'
      }));
    }

    // --- Center hub ---
    var hubG = svgGroup();
    svg.appendChild(hubG);

    hubG.appendChild(svgCircle(ctr, ctr, 40, {
      fill: 'rgba(15, 23, 41, 0.92)',
      stroke: 'rgba(0, 217, 255, 0.25)',
      'stroke-width': '1.5',
      filter: 'url(#orbGlow)'
    }));

    var centerLabel = gravKeywords || getMetricLabel(currentSort);
    if (centerLabel.length > 12) centerLabel = centerLabel.slice(0, 11) + '\u2026';
    hubG.appendChild(svgText(ctr, ctr - 3, centerLabel, {
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      'font-family': "'Orbitron', monospace",
      'font-size': '9',
      'font-weight': '700',
      fill: '#00d9ff'
    }));

    hubG.appendChild(svgText(ctr, ctr + 14, gravKeywords ? '\u25C6 PULL' : '\u25CF SORT', {
      'text-anchor': 'middle',
      'font-family': "'Orbitron', monospace",
      'font-size': '6',
      'font-weight': '600',
      'letter-spacing': '1.5',
      fill: '#94a3b8',
      opacity: '0.6'
    }));

    // --- Four axes (up, down, left, right) with tick marks ---
    var axisG = svgGroup({ 'class': 'orb-axis-group', opacity: '0.65' });
    svg.appendChild(axisG);

    var axisInner = 45;   // gap from center (past hub r=40)
    var axisOuter = 260;  // past outer orbit (250)

    // Four axis directions: down, up, left, right
    var axes = [
      { dx: 0, dy: 1,  labelAnchor: 'start',  labelDx: 8,  labelDy: 3 },   // down
      { dx: 0, dy: -1, labelAnchor: 'start',  labelDx: 8,  labelDy: 3 },   // up
      { dx: -1, dy: 0, labelAnchor: 'end',    labelDx: -8, labelDy: -5 },  // left
      { dx: 1, dy: 0,  labelAnchor: 'start',  labelDx: 8,  labelDy: -5 }   // right
    ];

    axes.forEach(function(ax) {
      // Axis line
      axisG.appendChild(svgLine(
        ctr + ax.dx * axisInner, ctr + ax.dy * axisInner,
        ctr + ax.dx * axisOuter, ctr + ax.dy * axisOuter,
        {
          stroke: 'rgba(255, 255, 255, 0.35)',
          'stroke-width': '1',
          'stroke-dasharray': '4 4'
        }
      ));

      // Tick marks at each orbital radius
      sorted.forEach(function(m, i) {
        var orbR = getOrbitRadius(i, count);
        var tx = ctr + ax.dx * orbR;
        var ty = ctr + ax.dy * orbR;
        var tickHalf = 5;

        // Tick perpendicular to axis direction
        var px = ax.dy;  // perpendicular
        var py = -ax.dx;
        axisG.appendChild(svgLine(
          tx - px * tickHalf, ty - py * tickHalf,
          tx + px * tickHalf, ty + py * tickHalf,
          { stroke: 'rgba(255, 255, 255, 0.5)', 'stroke-width': '1' }
        ));
      });
    });

    // Metric value labels on the UP axis (to avoid clutter)
    sorted.forEach(function(m, i) {
      var orbR = getOrbitRadius(i, count);
      var metricStr = gravKeywords
        ? String(m._gravScore || 0)
        : getMetricDisplay(m, currentSort);

      axisG.appendChild(svgText(ctr + 10, ctr - orbR + 3, metricStr, {
        'text-anchor': 'start',
        'font-family': "'Barlow', sans-serif",
        'font-size': '8',
        'font-weight': '600',
        fill: m.color,
        opacity: '0.9'
      }));
    });

    // Direction label at top of up axis
    axisG.appendChild(svgText(ctr, ctr - axisOuter - 18, '\u25BC INNER = BEST', {
      'text-anchor': 'middle',
      'font-family': "'Orbitron', monospace",
      'font-size': '7',
      'font-weight': '600',
      fill: '#94a3b8',
      opacity: '0.7',
      'letter-spacing': '1'
    }));

    // Metric name label at top
    axisG.appendChild(svgText(ctr, ctr - axisOuter - 6, (gravKeywords || getMetricLabel(currentSort)).toUpperCase(), {
      'text-anchor': 'middle',
      'font-family': "'Orbitron', monospace",
      'font-size': '7',
      'font-weight': '700',
      fill: '#00d9ff',
      opacity: '0.6',
      'letter-spacing': '2'
    }));

    // --- Soft trail glow filter (wider blur for the ribbon) ---
    var trailFilter = svgEl('filter', { id: 'orbTrailGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    var trailBlur = svgEl('feGaussianBlur', { stdDeviation: '6', result: 'tglow' });
    var trailMerge = svgEl('feMerge');
    trailMerge.appendChild(svgEl('feMergeNode', { 'in': 'tglow' }));
    trailMerge.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
    trailFilter.appendChild(trailBlur);
    trailFilter.appendChild(trailMerge);
    defs.appendChild(trailFilter);

    // --- Movie nodes ---
    var nodeR = 27;
    var trailSpan = 5;   // trail covers 5 seconds of orbit

    sorted.forEach(function(m, i) {
      var radius = getOrbitRadius(i, count);
      var startFrac = i / count;
      var orbitDur = 25 + (radius / 260) * 20;
      var delayS = -(startFrac * orbitDur);

      // --- Sacred timeline trail arc ---
      var trailAngleDeg = (trailSpan / orbitDur) * 360;
      var trailAngleRad = trailAngleDeg * Math.PI / 180;

      // Arc geometry (in rotating coordinate frame, center at origin)
      // Head at (radius, 0), tail counterclockwise behind by trailAngleDeg
      var tailX = radius * Math.cos(trailAngleRad);
      var tailY = -radius * Math.sin(trailAngleRad);
      var headX = radius;
      var headY = 0;
      var largeArc = trailAngleDeg > 180 ? 1 : 0;
      var arcD = 'M ' + tailX + ' ' + tailY +
                 ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + headX + ' ' + headY;

      // Gradient fading from transparent (tail) to movie color (head)
      var gradId = 'orb-trail-' + m.id;
      var grad = svgEl('linearGradient', {
        id: gradId,
        gradientUnits: 'userSpaceOnUse',
        x1: String(tailX), y1: String(tailY),
        x2: String(headX), y2: String(headY)
      });
      grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': m.color, 'stop-opacity': '0' }));
      grad.appendChild(svgEl('stop', { offset: '60%', 'stop-color': m.color, 'stop-opacity': '0.25' }));
      grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': m.color, 'stop-opacity': '0.55' }));
      defs.appendChild(grad);

      // Trail container — same rotation as the movie node
      var trailOuterG = svgEl('g', { transform: 'translate(' + ctr + ',' + ctr + ')' });
      svg.appendChild(trailOuterG);

      var trailRotG = svgEl('g');
      trailOuterG.appendChild(trailRotG);

      trailRotG.appendChild(svgEl('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0',
        to: '360',
        dur: orbitDur + 's',
        begin: delayS + 's',
        repeatCount: 'indefinite'
      }));

      // Outer glow ribbon (wider, softer)
      trailRotG.appendChild(svgEl('path', {
        d: arcD,
        fill: 'none',
        stroke: 'url(#' + gradId + ')',
        'stroke-width': '6',
        'stroke-linecap': 'round',
        filter: 'url(#orbTrailGlow)',
        opacity: '0.6'
      }));

      // Bright core ribbon (thinner, crisper)
      trailRotG.appendChild(svgEl('path', {
        d: arcD,
        fill: 'none',
        stroke: 'url(#' + gradId + ')',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        opacity: '0.85'
      }));

      // Container translated to center
      var outerG = svgEl('g', { transform: 'translate(' + ctr + ',' + ctr + ')' });
      svg.appendChild(outerG);

      // Rotating group
      var rotG = svgEl('g');
      outerG.appendChild(rotG);

      var orbitAnim = svgEl('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0',
        to: '360',
        dur: orbitDur + 's',
        begin: delayS + 's',
        repeatCount: 'indefinite'
      });
      rotG.appendChild(orbitAnim);

      // Translate to orbital radius
      var transG = svgEl('g', { transform: 'translate(' + radius + ', 0)' });
      rotG.appendChild(transG);

      // Counter-rotate to keep upright
      var counterG = svgEl('g');
      transG.appendChild(counterG);

      var counterAnim = svgEl('animateTransform', {
        attributeName: 'transform',
        type: 'rotate',
        from: '0',
        to: '-360',
        dur: orbitDur + 's',
        begin: delayS + 's',
        repeatCount: 'indefinite'
      });
      counterG.appendChild(counterAnim);

      // Node group
      var nodeG = svgGroup({ 'class': 'orb-movie-node' });
      counterG.appendChild(nodeG);

      // Glow ring
      nodeG.appendChild(svgCircle(0, 0, nodeR + 5, {
        fill: 'none',
        stroke: m.color,
        'stroke-width': '1.5',
        opacity: '0.25',
        filter: 'url(#orbGlow)'
      }));

      // Border
      nodeG.appendChild(svgCircle(0, 0, nodeR, {
        fill: '#0a0e17',
        stroke: m.color,
        'stroke-width': '2.5'
      }));

      // Poster
      if (m.poster) {
        var clipId = 'orb-clip-' + m.id;
        var clip = svgEl('clipPath', { id: clipId });
        clip.appendChild(svgCircle(0, 0, nodeR - 2));
        defs.appendChild(clip);

        nodeG.appendChild(svgEl('image', {
          href: TMDB_IMG + 'w154' + m.poster,
          x: -(nodeR - 2),
          y: -(nodeR - 2),
          width: (nodeR - 2) * 2,
          height: (nodeR - 2) * 2,
          'clip-path': 'url(#' + clipId + ')',
          preserveAspectRatio: 'xMidYMid slice'
        }));
      }

      // Title label
      var titleStr = m.title.length > 14 ? m.title.slice(0, 13) + '\u2026' : m.title;
      nodeG.appendChild(svgText(0, nodeR + 14, titleStr, {
        'text-anchor': 'middle',
        'font-family': "'Barlow', sans-serif",
        'font-size': '8',
        'font-weight': '600',
        fill: m.color
      }));

      // Metric value
      var metricStr = gravKeywords ? ('Score: ' + (m._gravScore || 0)) : getMetricDisplay(m, currentSort);
      nodeG.appendChild(svgText(0, nodeR + 23, metricStr, {
        'text-anchor': 'middle',
        'font-family': "'Barlow', sans-serif",
        'font-size': '7',
        'font-weight': '400',
        fill: '#94a3b8'
      }));

      // Hitbox for tooltip + click
      var hitbox = svgCircle(0, 0, nodeR + 5, {
        fill: 'transparent',
        cursor: 'pointer',
        'class': 'orb-hitbox'
      });
      nodeG.appendChild(hitbox);

      var tipText = m.title + ' (' + m.year + ')';
      if (gravKeywords) {
        tipText += ' \u2014 Relevance: ' + (m._gravScore || 0);
      } else {
        tipText += ' \u2014 ' + getMetricLabel(currentSort) + ': ' + getMetricDisplay(m, currentSort);
      }
      attachTooltip(hitbox, tipText);

      hitbox.addEventListener('click', (function(movieId) {
        return function() {
          if (typeof window.openMovieCube === 'function') window.openMovieCube(movieId);
        };
      })(m.id));
    });

    // --- Event listeners ---
    sortWrap.addEventListener('click', function(e) {
      var btn = e.target.closest('.sort-metric-btn');
      if (!btn) return;
      gravKeywords = null;
      currentSort = btn.dataset.metric;
      enrichedMovies.forEach(function(m) { delete m._gravScore; });
      renderOrbitalRings();
    });

    gravBtn.addEventListener('click', function() {
      var val = gravInput.value.trim();
      if (val) handleGravitationalPull(val);
    });

    gravInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var val = gravInput.value.trim();
        if (val) handleGravitationalPull(val);
      }
    });

    gravClear.addEventListener('click', function() {
      gravKeywords = null;
      enrichedMovies.forEach(function(m) { delete m._gravScore; });
      renderOrbitalRings();
    });
  }

  // ============================================================================
  // GRAVITATIONAL PULL
  // ============================================================================

  async function handleGravitationalPull(keywordStr) {
    var keywords = keywordStr.split(',').map(function(k) { return k.trim().toLowerCase(); }).filter(Boolean);
    if (keywords.length === 0) return;

    gravKeywords = keywords.join(', ');

    // Brief loading indicator
    var panel = document.getElementById('panel-orbital');
    var wrap = panel.querySelector('.orbital-svg-wrap');
    if (wrap) wrap.style.opacity = '0.4';

    // Fetch TMDB keywords for each movie (if not cached)
    await Promise.all(enrichedMovies.map(async function(m) {
      if (keywordsCache[m.id]) return;
      try {
        var res = await fetch('https://api.themoviedb.org/3/movie/' + m.id + '/keywords?api_key=' + TMDB_API_KEY);
        var data = await res.json();
        keywordsCache[m.id] = (data.keywords || []).map(function(k) { return k.name.toLowerCase(); });
      } catch (e) {
        keywordsCache[m.id] = [];
      }
    }));

    // Calculate relevance scores
    enrichedMovies.forEach(function(m) {
      var score = 0;
      var overview = (m.overview || '').toLowerCase();
      var tmdbKw = keywordsCache[m.id] || [];

      keywords.forEach(function(kw) {
        var escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp(escaped, 'gi');
        var matches = (overview.match(regex) || []).length;
        score += matches;

        tmdbKw.forEach(function(tk) {
          if (tk.indexOf(kw) !== -1) score += 2;
        });
      });

      m._gravScore = score;
    });

    renderOrbitalRings();
  }

  // ============================================================================
  // CONSTELLATION MAP RENDERER
  // ============================================================================

  function renderConstellation() {
    if (!enrichedMovies || enrichedMovies.length === 0) return;

    var panel = document.getElementById('panel-constellation');
    panel.innerHTML = '';

    var count = enrichedMovies.length;

    // --- Detect pairwise connections ---
    var connections = [];
    var personAppearances = {};

    for (var i = 0; i < count; i++) {
      for (var j = i + 1; j < count; j++) {
        var mA = enrichedMovies[i];
        var mB = enrichedMovies[j];

        // Shared actors
        var castMapB = {};
        mB.cast.forEach(function(c) { castMapB[c.id] = c; });
        var sharedActors = [];
        mA.cast.forEach(function(c) {
          if (castMapB[c.id]) {
            sharedActors.push({
              id: c.id, name: c.name,
              roleA: c.character, roleB: castMapB[c.id].character
            });
            if (!personAppearances[c.id])
              personAppearances[c.id] = { name: c.name, movieIds: new Set(), type: 'actor' };
            personAppearances[c.id].movieIds.add(mA.id);
            personAppearances[c.id].movieIds.add(mB.id);
          }
        });

        // Shared crew (separate directors from rest)
        var crewMapB = {};
        mB.crew.forEach(function(c) {
          if (!crewMapB[c.id]) crewMapB[c.id] = [];
          crewMapB[c.id].push(c);
        });
        var sharedDirectors = [];
        var sharedCrew = [];
        mA.crew.forEach(function(c) {
          if (crewMapB[c.id]) {
            var entry = { id: c.id, name: c.name, jobA: c.job, jobB: crewMapB[c.id][0].job };
            if (c.job === 'Director') {
              sharedDirectors.push(entry);
            } else {
              sharedCrew.push(entry);
            }
            var pType = c.job === 'Director' ? 'director' : 'crew';
            if (!personAppearances[c.id])
              personAppearances[c.id] = { name: c.name, movieIds: new Set(), type: pType };
            personAppearances[c.id].movieIds.add(mA.id);
            personAppearances[c.id].movieIds.add(mB.id);
          }
        });

        if (sharedActors.length || sharedDirectors.length || sharedCrew.length) {
          connections.push({
            movieA: mA, movieB: mB,
            indexA: i, indexB: j,
            actors: sharedActors,
            directors: sharedDirectors,
            crew: sharedCrew,
            total: sharedActors.length + sharedDirectors.length + sharedCrew.length
          });
        }
      }
    }

    // Aggregate stats
    var actorSet = new Set();
    var directorSet = new Set();
    connections.forEach(function(c) {
      c.actors.forEach(function(a) { actorSet.add(a.id); });
      c.directors.forEach(function(d) { directorSet.add(d.id); });
    });

    // --- Stats bar ---
    var statsBar = document.createElement('div');
    statsBar.className = 'constellation-stats';
    statsBar.innerHTML =
      '<div class="const-stat"><span class="const-stat-value">' + actorSet.size +
        '</span><span class="const-stat-label">Shared Actors</span></div>' +
      '<div class="const-stat"><span class="const-stat-value">' + directorSet.size +
        '</span><span class="const-stat-label">Shared Directors</span></div>' +
      '<div class="const-stat const-stat-total"><span class="const-stat-value">' + connections.length +
        '</span><span class="const-stat-label">Connections</span></div>';
    panel.appendChild(statsBar);

    // --- SVG ---
    var SIZE = 700;
    var ctr = SIZE / 2;
    var orbitR = 250;
    var nodeR = 35;

    var svgWrap = document.createElement('div');
    svgWrap.className = 'constellation-svg-wrap';
    panel.appendChild(svgWrap);

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + SIZE + ' ' + SIZE,
      'class': 'constellation-svg'
    });
    svgWrap.appendChild(svg);

    var defs = svgEl('defs');
    svg.appendChild(defs);

    // Glow filter
    var glow = svgEl('filter', { id: 'constGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    glow.appendChild(svgEl('feGaussianBlur', { stdDeviation: '4', result: 'g' }));
    var fm = svgEl('feMerge');
    fm.appendChild(svgEl('feMergeNode', { 'in': 'g' }));
    fm.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
    glow.appendChild(fm);
    defs.appendChild(glow);

    // Strong glow for hover highlights
    var glowStrong = svgEl('filter', { id: 'constGlowStrong', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    glowStrong.appendChild(svgEl('feGaussianBlur', { stdDeviation: '7', result: 'g' }));
    var fm2 = svgEl('feMerge');
    fm2.appendChild(svgEl('feMergeNode', { 'in': 'g' }));
    fm2.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
    glowStrong.appendChild(fm2);
    defs.appendChild(glowStrong);

    // --- Star field ---
    var starLayer = svgGroup({ 'class': 'const-starfield' });
    svg.appendChild(starLayer);
    for (var si = 0; si < 150; si++) {
      starLayer.appendChild(svgCircle(
        Math.random() * SIZE, Math.random() * SIZE,
        0.3 + Math.random() * 1.2,
        { fill: '#fff', opacity: 0.15 + Math.random() * 0.45 }
      ));
    }

    // Movie positions (circular layout)
    var positions = [];
    enrichedMovies.forEach(function(m, idx) {
      var angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
      positions.push({
        x: ctr + orbitR * Math.cos(angle),
        y: ctr + orbitR * Math.sin(angle),
        movie: m, index: idx
      });
    });

    // Connection counts per movie (for glow intensity)
    var connCounts = {};
    enrichedMovies.forEach(function(m) { connCounts[m.id] = 0; });
    connections.forEach(function(c) {
      connCounts[c.movieA.id] += c.total;
      connCounts[c.movieB.id] += c.total;
    });

    // --- Connection lines layer ---
    var lineLayer = svgGroup({ 'class': 'const-line-layer' });
    svg.appendChild(lineLayer);

    connections.forEach(function(conn, ci) {
      var pA = positions[conn.indexA];
      var pB = positions[conn.indexB];

      // Director connections (gold, thick, solid)
      if (conn.directors.length > 0) {
        var w = Math.min(2.5 + conn.directors.length, 5);
        var dl = svgLine(pA.x, pA.y, pB.x, pB.y, {
          stroke: '#ffd700', 'stroke-width': w, opacity: '0.55',
          'stroke-linecap': 'round',
          'class': 'const-connection const-conn-director',
          'data-conn': ci, 'data-ma': conn.movieA.id, 'data-mb': conn.movieB.id
        });
        lineLayer.appendChild(dl);
        attachTooltip(dl, conn.directors.map(function(d) { return d.name + ' (Director)'; }).join(', '));
      }

      // Actor connections (cyan, solid)
      if (conn.actors.length > 0) {
        var aw = Math.min(1 + conn.actors.length * 0.6, 4);
        var ao = Math.min(0.25 + conn.actors.length * 0.1, 0.65);
        var al = svgLine(pA.x, pA.y, pB.x, pB.y, {
          stroke: '#00d9ff', 'stroke-width': aw, opacity: ao,
          'stroke-linecap': 'round',
          'class': 'const-connection const-conn-actor',
          'data-conn': ci, 'data-ma': conn.movieA.id, 'data-mb': conn.movieB.id
        });
        lineLayer.appendChild(al);
        attachTooltip(al, 'Shared actors: ' + conn.actors.map(function(a) { return a.name; }).join(', '));
      }

      // Other crew connections (purple, dashed)
      if (conn.crew.length > 0) {
        var cw = Math.min(1 + conn.crew.length * 0.4, 3);
        var cl = svgLine(pA.x, pA.y, pB.x, pB.y, {
          stroke: '#a855f7', 'stroke-width': cw, opacity: '0.35',
          'stroke-dasharray': '6 4', 'stroke-linecap': 'round',
          'class': 'const-connection const-conn-crew',
          'data-conn': ci, 'data-ma': conn.movieA.id, 'data-mb': conn.movieB.id
        });
        lineLayer.appendChild(cl);
        attachTooltip(cl, 'Shared crew: ' + conn.crew.map(function(c) { return c.name + ' (' + c.jobA + ')'; }).join(', '));
      }
    });

    // --- Prominent person labels (in 3+ movies) ---
    var labelLayer = svgGroup({ 'class': 'const-label-layer' });
    svg.appendChild(labelLayer);

    var prominent = [];
    Object.keys(personAppearances).forEach(function(pid) {
      var p = personAppearances[pid];
      if (p.movieIds.size >= 3) prominent.push(p);
    });

    prominent.forEach(function(p, pi) {
      var angle = (pi / Math.max(prominent.length, 1)) * 2 * Math.PI - Math.PI / 2;
      var lr = 55 + (pi % 4) * 22;
      var lx = ctr + lr * Math.cos(angle);
      var ly = ctr + lr * Math.sin(angle);
      labelLayer.appendChild(svgText(lx, ly, p.name, {
        'text-anchor': 'middle',
        'font-family': "'Barlow', sans-serif",
        'font-size': '9',
        'font-weight': '600',
        fill: '#fff',
        opacity: '0.65',
        filter: 'url(#constGlow)',
        'class': 'const-person-label'
      }));
    });

    // --- Movie nodes layer ---
    var nodeLayer = svgGroup({ 'class': 'const-node-layer' });
    svg.appendChild(nodeLayer);

    positions.forEach(function(pos) {
      var m = pos.movie;
      var cc = connCounts[m.id];
      var glowAlpha = Math.min(0.15 + cc * 0.08, 0.7);

      var nodeG = svgGroup({ 'class': 'const-movie-node', 'data-movie-id': m.id });
      nodeLayer.appendChild(nodeG);

      // Glow ring (brighter with more connections)
      nodeG.appendChild(svgCircle(pos.x, pos.y, nodeR + 8, {
        fill: 'none', stroke: m.color,
        'stroke-width': '2', opacity: glowAlpha,
        filter: 'url(#constGlow)'
      }));

      // Border
      nodeG.appendChild(svgCircle(pos.x, pos.y, nodeR, {
        fill: '#0a0e17', stroke: m.color, 'stroke-width': '3'
      }));

      // Poster
      if (m.poster) {
        var clipId = 'const-clip-' + m.id;
        var clip = svgEl('clipPath', { id: clipId });
        clip.appendChild(svgCircle(pos.x, pos.y, nodeR - 2));
        defs.appendChild(clip);
        nodeG.appendChild(svgEl('image', {
          href: TMDB_IMG + 'w185' + m.poster,
          x: pos.x - nodeR + 2, y: pos.y - nodeR + 2,
          width: (nodeR - 2) * 2, height: (nodeR - 2) * 2,
          'clip-path': 'url(#' + clipId + ')',
          preserveAspectRatio: 'xMidYMid slice'
        }));
      }

      // Title
      var title = m.title.length > 16 ? m.title.slice(0, 15) + '\u2026' : m.title;
      nodeG.appendChild(svgText(pos.x, pos.y + nodeR + 16, title, {
        'text-anchor': 'middle',
        'font-family': "'Barlow', sans-serif",
        'font-size': '9', 'font-weight': '600',
        fill: m.color
      }));

      // Shared count
      if (cc > 0) {
        nodeG.appendChild(svgText(pos.x, pos.y + nodeR + 27, cc + ' shared', {
          'text-anchor': 'middle',
          'font-family': "'Barlow', sans-serif",
          'font-size': '7', 'font-weight': '400',
          fill: '#94a3b8'
        }));
      }

      // Hitbox
      var hitbox = svgCircle(pos.x, pos.y, nodeR + 6, {
        fill: 'transparent', cursor: 'pointer', 'class': 'const-hitbox'
      });
      nodeG.appendChild(hitbox);
      attachTooltip(hitbox, m.title + ' (' + m.year + ') \u2014 ' + cc + ' shared people');

      hitbox.addEventListener('click', (function(mid) {
        return function() {
          if (typeof window.openMovieCube === 'function') window.openMovieCube(mid);
        };
      })(m.id));

      // Hover: highlight this movie's connections
      hitbox.addEventListener('mouseenter', (function(mid) {
        return function() { constHighlight(mid, true); };
      })(m.id));
      hitbox.addEventListener('mouseleave', (function(mid) {
        return function() { constHighlight(mid, false); };
      })(m.id));
    });

    // --- Legend ---
    var legend = document.createElement('div');
    legend.className = 'constellation-legend';
    legend.innerHTML =
      '<div class="const-legend-item"><span class="const-legend-line" style="background:#00d9ff"></span>Shared Actor</div>' +
      '<div class="const-legend-item"><span class="const-legend-line" style="background:#ffd700;height:4px"></span>Shared Director</div>' +
      '<div class="const-legend-item"><span class="const-legend-line" style="background:transparent;border-top:3px dashed #a855f7;height:0"></span>Shared Crew</div>';
    panel.appendChild(legend);
  }

  // Highlight a movie's connections (hover effect)
  function constHighlight(movieId, on) {
    var panel = document.getElementById('panel-constellation');
    var svg = panel.querySelector('.constellation-svg');
    if (!svg) return;

    var lines = svg.querySelectorAll('.const-connection');
    var nodes = svg.querySelectorAll('.const-movie-node');

    if (on) {
      var connected = new Set([movieId]);
      lines.forEach(function(line) {
        var ma = parseInt(line.getAttribute('data-ma'));
        var mb = parseInt(line.getAttribute('data-mb'));
        if (ma === movieId || mb === movieId) {
          connected.add(ma);
          connected.add(mb);
          line.style.opacity = '0.9';
          line.style.filter = 'url(#constGlowStrong)';
        } else {
          line.style.opacity = '0.04';
          line.style.filter = '';
        }
      });
      nodes.forEach(function(node) {
        var nid = parseInt(node.getAttribute('data-movie-id'));
        node.style.opacity = connected.has(nid) ? '1' : '0.25';
      });
    } else {
      lines.forEach(function(line) { line.style.opacity = ''; line.style.filter = ''; });
      nodes.forEach(function(node) { node.style.opacity = ''; });
    }
  }

  // ============================================================================
  // TIMELINE RIBBON RENDERER
  // ============================================================================

  function renderTimeline() {
    if (!enrichedMovies || enrichedMovies.length === 0) return;

    var panel = document.getElementById('panel-timeline');
    panel.innerHTML = '';

    var GENRE_COLORS = {
      'Action': '#ef4444', 'Drama': '#a855f7', 'Science Fiction': '#00d9ff',
      'Comedy': '#fbbf24', 'Thriller': '#10b981', 'Horror': '#f97316',
      'Romance': '#ec4899', 'Animation': '#3b82f6'
    };
    function genreColor(name) { return GENRE_COLORS[name] || '#6b7280'; }

    var sorted = enrichedMovies.slice().sort(function(a, b) {
      return (a.release_date || a.year || '').localeCompare(b.release_date || b.year || '');
    });

    var count = sorted.length;
    var years = sorted.map(function(m) { return parseInt(m.year) || 0; }).filter(function(y) { return y > 1800; });
    if (years.length === 0) {
      panel.innerHTML = '<div class="panel-placeholder"><span class="placeholder-icon">📅</span>' +
        '<h3>No Release Dates</h3><p>Selected movies have no release year data.</p></div>';
      return;
    }
    var minYear = Math.min.apply(null, years);
    var maxYear = Math.max.apply(null, years);
    var span = maxYear - minYear;

    var decadeCounts = {};
    years.forEach(function(y) {
      var dec = Math.floor(y / 10) * 10;
      decadeCounts[dec] = (decadeCounts[dec] || 0) + 1;
    });
    var peakDecade = Object.keys(decadeCounts).reduce(function(best, d) {
      return (decadeCounts[d] > (decadeCounts[best] || 0)) ? d : best;
    });

    var totalRuntime = sorted.reduce(function(sum, m) { return sum + (m.runtime || 0); }, 0);
    var rtH = Math.floor(totalRuntime / 60);
    var rtM = totalRuntime % 60;

    var statsBar = document.createElement('div');
    statsBar.className = 'timeline-stats';
    statsBar.innerHTML =
      '<div class="tl-stat"><span class="tl-stat-value cyan">' +
        (span === 0 ? 'Same Year' : span + ' Years') +
      '</span><span class="tl-stat-label">Time Span (' + minYear + ' \u2013 ' + maxYear + ')</span></div>' +
      '<div class="tl-stat"><span class="tl-stat-value">' + peakDecade + 's' +
      '</span><span class="tl-stat-label">Peak Decade</span></div>' +
      '<div class="tl-stat"><span class="tl-stat-value gold">' + rtH + 'h ' + rtM + 'm' +
      '</span><span class="tl-stat-label">Total Runtime</span></div>';
    panel.appendChild(statsBar);

    var tlMin = minYear - 5;
    var tlMax = maxYear + 5;
    var tlSpan = tlMax - tlMin;
    var markerInterval = tlSpan > 40 ? 10 : 5;
    var pxPerYear = 80;
    var tlWidth = Math.max(tlSpan * pxPerYear, 700);

    function yearToPos(y) { return ((y - tlMin) / tlSpan) * tlWidth; }

    var scrollContainer = document.createElement('div');
    scrollContainer.className = 'timeline-scroll';
    panel.appendChild(scrollContainer);

    var ribbon = document.createElement('div');
    ribbon.className = 'timeline-ribbon';
    ribbon.style.width = tlWidth + 'px';
    scrollContainer.appendChild(ribbon);

    var centralLine = document.createElement('div');
    centralLine.className = 'tl-central-line';
    ribbon.appendChild(centralLine);

    var markerStart = Math.ceil(tlMin / markerInterval) * markerInterval;
    for (var ym = markerStart; ym <= tlMax; ym += markerInterval) {
      var marker = document.createElement('div');
      marker.className = 'tl-year-marker';
      marker.style.left = yearToPos(ym) + 'px';

      var tick = document.createElement('div');
      tick.className = 'tl-year-tick';
      marker.appendChild(tick);

      var label = document.createElement('span');
      label.className = 'tl-year-label';
      label.textContent = ym;
      marker.appendChild(label);

      ribbon.appendChild(marker);
    }

    sorted.forEach(function(m, idx) {
      var year = parseInt(m.year) || 0;
      if (year < 1800) return;
      var xPos = yearToPos(year);
      var isAbove = idx % 2 === 0;

      var dot = document.createElement('div');
      dot.className = 'tl-dot';
      dot.style.left = xPos + 'px';
      dot.style.background = m.color;
      dot.style.boxShadow = '0 0 8px ' + m.color;
      ribbon.appendChild(dot);

      var cardWrap = document.createElement('div');
      cardWrap.className = 'tl-ribbon-card-wrap ' + (isAbove ? 'above' : 'below');
      cardWrap.style.left = xPos + 'px';

      var connector = document.createElement('div');
      connector.className = 'tl-connector';
      connector.style.background = m.color;

      var card = document.createElement('div');
      card.className = 'tl-ribbon-card';
      card.style.borderColor = m.color;

      var posterSrc = m.poster ? TMDB_IMG + 'w185' + m.poster : POSTER_PLACEHOLDER;
      card.innerHTML =
        '<img class="tl-ribbon-poster" src="' + posterSrc + '" alt="" loading="lazy">' +
        '<div class="tl-ribbon-title">' + escapeHTML(m.title) + '</div>' +
        '<div class="tl-ribbon-year">' + m.year + '</div>' +
        (m.genres.length > 0
          ? '<span class="tl-genre-tag" style="background:' + genreColor(m.genres[0].name) + '">' + escapeHTML(m.genres[0].name) + '</span>'
          : '');

      card.addEventListener('click', (function(mid) {
        return function() { if (typeof window.openMovieCube === 'function') window.openMovieCube(mid); };
      })(m.id));

      if (isAbove) {
        cardWrap.appendChild(card);
        cardWrap.appendChild(connector);
      } else {
        cardWrap.appendChild(connector);
        cardWrap.appendChild(card);
      }

      ribbon.appendChild(cardWrap);
    });

    requestAnimationFrame(function() {
      var centerPos = yearToPos((minYear + maxYear) / 2);
      scrollContainer.scrollLeft = Math.max(0, centerPos - scrollContainer.clientWidth / 2);
    });
  }

  // ============================================================================
  // RADAR CHART RENDERER
  // ============================================================================

  function renderRadar() {
    if (!enrichedMovies || enrichedMovies.length === 0) return;

    var panel = document.getElementById('panel-radar');
    panel.innerHTML = '';

    var ALL_VARS = [
      { key: 'vote_average', label: 'Rating', get: function(m) { return m.vote_average || 0; } },
      { key: 'vote_count', label: 'Vote Count', get: function(m) { return m.vote_count || 0; } },
      { key: 'popularity', label: 'Popularity', get: function(m) { return m.popularity || 0; } },
      { key: 'runtime', label: 'Runtime', get: function(m) { return m.runtime || 0; } },
      { key: 'budget', label: 'Budget', get: function(m) { return m.budget || 0; } },
      { key: 'revenue', label: 'Revenue', get: function(m) { return m.revenue || 0; } },
      { key: 'cast_size', label: 'Cast Size', get: function(m) { return m.cast ? m.cast.length : 0; } },
      { key: 'recency', label: 'Recency', get: function(m) { return parseInt(m.year) || 0; } }
    ];

    var selectedVars = ['vote_average', 'runtime', 'popularity', 'cast_size', 'recency'];

    var selectorWrap = document.createElement('div');
    selectorWrap.className = 'radar-selector';
    ALL_VARS.forEach(function(v) {
      var lbl = document.createElement('label');
      lbl.className = 'radar-var-label' + (selectedVars.indexOf(v.key) !== -1 ? ' checked' : '');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'radar-var-cb';
      cb.value = v.key;
      cb.checked = selectedVars.indexOf(v.key) !== -1;
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(' ' + v.label));
      selectorWrap.appendChild(lbl);
    });
    panel.appendChild(selectorWrap);

    var svgWrap = document.createElement('div');
    svgWrap.className = 'radar-svg-wrap';
    panel.appendChild(svgWrap);

    var note = document.createElement('div');
    note.className = 'radar-note';
    note.hidden = true;
    panel.appendChild(note);

    var legend = document.createElement('div');
    legend.className = 'radar-legend';
    enrichedMovies.forEach(function(m) {
      legend.innerHTML +=
        '<div class="radar-legend-item">' +
        '<span class="radar-legend-swatch" style="background:' + m.color + '"></span>' +
        '<span class="radar-legend-title">' + escapeHTML(m.title) + ' (' + m.year + ')</span></div>';
    });
    panel.appendChild(legend);

    function drawRadar() {
      svgWrap.innerHTML = '';
      var checks = selectorWrap.querySelectorAll('.radar-var-cb:checked');
      var activeKeys = [];
      checks.forEach(function(cb) { activeKeys.push(cb.value); });

      var vars = ALL_VARS.filter(function(v) { return activeKeys.indexOf(v.key) !== -1; });
      var numAxes = vars.length;
      if (numAxes < 4) {
        svgWrap.innerHTML = '<div class="panel-placeholder"><p>Select at least 4 variables</p></div>';
        return;
      }

      var SIZE = 600, ctr = SIZE / 2, maxR = 210;
      var svg = svgEl('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, 'class': 'radar-svg' });
      svgWrap.appendChild(svg);

      var defs = svgEl('defs');
      svg.appendChild(defs);
      var glow = svgEl('filter', { id: 'radarGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
      glow.appendChild(svgEl('feGaussianBlur', { stdDeviation: '2', result: 'g' }));
      var fm = svgEl('feMerge');
      fm.appendChild(svgEl('feMergeNode', { 'in': 'g' }));
      fm.appendChild(svgEl('feMergeNode', { 'in': 'SourceGraphic' }));
      glow.appendChild(fm);
      defs.appendChild(glow);

      var ranges = vars.map(function(v) {
        var vals = enrichedMovies.map(function(m) { return v.get(m); });
        var lo = Math.min.apply(null, vals);
        var hi = Math.max.apply(null, vals);
        return { min: lo, max: hi, range: hi - lo || 1 };
      });

      var hasMissing = false;
      enrichedMovies.forEach(function(m) {
        vars.forEach(function(v) {
          if ((v.key === 'budget' || v.key === 'revenue') && v.get(m) === 0) hasMissing = true;
        });
      });
      note.hidden = !hasMissing;
      if (hasMissing) note.textContent = '* Some budget/revenue data may be unavailable (shown as 0)';

      var angleStep = (2 * Math.PI) / numAxes;
      function axAngle(i) { return i * angleStep - Math.PI / 2; }
      function axPt(i, frac) {
        var a = axAngle(i);
        return { x: ctr + maxR * frac * Math.cos(a), y: ctr + maxR * frac * Math.sin(a) };
      }

      var gridG = svgGroup();
      svg.appendChild(gridG);
      [0.25, 0.5, 0.75, 1.0].forEach(function(frac) {
        var pts = [];
        for (var i = 0; i < numAxes; i++) { var p = axPt(i, frac); pts.push(p.x + ',' + p.y); }
        gridG.appendChild(svgEl('polygon', {
          points: pts.join(' '), fill: 'none',
          stroke: 'rgba(255,255,255,' + (frac === 1 ? '0.12' : '0.06') + ')', 'stroke-width': '1'
        }));
      });

      for (var ai = 0; ai < numAxes; ai++) {
        var outer = axPt(ai, 1);
        svg.appendChild(svgLine(ctr, ctr, outer.x, outer.y, {
          stroke: 'rgba(255,255,255,0.1)', 'stroke-width': '1'
        }));
        var lp = axPt(ai, 1.18);
        svg.appendChild(svgText(lp.x, lp.y, vars[ai].label, {
          'text-anchor': 'middle', 'dominant-baseline': 'central',
          'font-family': "'Barlow', sans-serif", 'font-size': '10',
          'font-weight': '600', fill: '#94a3b8'
        }));
      }

      var polyG = svgGroup({ 'class': 'radar-poly-layer' });
      svg.appendChild(polyG);

      enrichedMovies.forEach(function(m) {
        var pts = [];
        var dotData = [];
        for (var vi = 0; vi < numAxes; vi++) {
          var raw = vars[vi].get(m);
          var norm = (raw - ranges[vi].min) / ranges[vi].range;
          norm = Math.max(0.05, Math.min(1, norm));
          var p = axPt(vi, norm);
          pts.push(p.x + ',' + p.y);
          dotData.push({ x: p.x, y: p.y, raw: raw, varIdx: vi });
        }

        var poly = svgEl('polygon', {
          points: pts.join(' '), fill: m.color, 'fill-opacity': '0.15',
          stroke: m.color, 'stroke-width': '2', 'stroke-opacity': '0.8',
          'class': 'radar-polygon', 'data-movie-id': m.id
        });
        polyG.appendChild(poly);

        dotData.forEach(function(dd) {
          var dot = svgCircle(dd.x, dd.y, 3.5, {
            fill: m.color, 'class': 'radar-dot', 'data-movie-id': m.id
          });
          polyG.appendChild(dot);
          var tipVal;
          if (vars[dd.varIdx].key === 'budget' || vars[dd.varIdx].key === 'revenue') {
            tipVal = formatRevenue(dd.raw);
          } else if (vars[dd.varIdx].key === 'vote_average') {
            tipVal = dd.raw.toFixed(1);
          } else {
            tipVal = String(Math.round(dd.raw));
          }
          attachTooltip(dot, m.title + ' \u2014 ' + vars[dd.varIdx].label + ': ' + tipVal);
        });

        poly.addEventListener('mouseenter', (function(mid) {
          return function() { radarHighlight(mid, true); };
        })(m.id));
        poly.addEventListener('mouseleave', (function(mid) {
          return function() { radarHighlight(mid, false); };
        })(m.id));
      });
    }

    function radarHighlight(movieId, on) {
      var polys = svgWrap.querySelectorAll('.radar-polygon');
      var dots = svgWrap.querySelectorAll('.radar-dot');
      if (on) {
        polys.forEach(function(p) {
          var id = parseInt(p.getAttribute('data-movie-id'));
          if (id === movieId) {
            p.style.fillOpacity = '0.3'; p.style.strokeOpacity = '1'; p.style.strokeWidth = '3';
          } else {
            p.style.fillOpacity = '0.03'; p.style.strokeOpacity = '0.1';
          }
        });
        dots.forEach(function(d) {
          d.style.opacity = parseInt(d.getAttribute('data-movie-id')) === movieId ? '1' : '0.15';
        });
      } else {
        polys.forEach(function(p) { p.style.fillOpacity = ''; p.style.strokeOpacity = ''; p.style.strokeWidth = ''; });
        dots.forEach(function(d) { d.style.opacity = ''; });
      }
    }

    selectorWrap.addEventListener('change', function(e) {
      var cb = e.target;
      if (!cb.classList.contains('radar-var-cb')) return;
      var checks = selectorWrap.querySelectorAll('.radar-var-cb:checked');
      if (checks.length < 4 && !cb.checked) { cb.checked = true; return; }
      if (checks.length > 6 && cb.checked) { cb.checked = false; return; }
      cb.closest('.radar-var-label').classList.toggle('checked', cb.checked);
      drawRadar();
    });

    drawRadar();
  }

  // ============================================================================
  // WORD NEBULA RENDERER
  // ============================================================================

  function renderNebula() {
    if (!enrichedMovies || enrichedMovies.length === 0) return;

    var panel = document.getElementById('panel-nebula');
    panel.innerHTML = '<div class="panel-loading"><div class="loading-spinner"></div><span>Loading nebula data\u2026</span></div>';

    Promise.all(enrichedMovies.map(function(m) {
      return fetch('nebula-data/' + m.id + '.json')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    })).then(function(results) {
      panel.innerHTML = '';

      var nebulaMovies = [];
      var nebulaData = [];
      for (var i = 0; i < results.length; i++) {
        if (results[i] && results[i].wordFrequency) {
          nebulaMovies.push(enrichedMovies[i]);
          nebulaData.push(results[i].wordFrequency);
        }
      }

      if (nebulaMovies.length < 2) {
        panel.innerHTML =
          '<div class="panel-placeholder"><span class="placeholder-icon">\uD83C\uDF0C</span>' +
          '<h3>Insufficient Nebula Data</h3>' +
          '<p>Need at least 2 movies with Nebula reviews. ' +
          (nebulaMovies.length === 0 ? 'No selected movies have Nebula data.'
            : 'Only ' + escapeHTML(nebulaMovies[0].title) + ' has data.') + '</p></div>';
        return;
      }

      renderNebulaCloud(nebulaMovies, nebulaData);
    });
  }

  function renderNebulaCloud(nebulaMovies, nebulaData) {
    var panel = document.getElementById('panel-nebula');
    panel.innerHTML = '';

    var count = nebulaMovies.length;
    var activeMovies = nebulaMovies.map(function() { return true; });

    function computeWords() {
      var wordMap = {};
      var activeCount = 0;
      for (var mi = 0; mi < count; mi++) {
        if (!activeMovies[mi]) continue;
        activeCount++;
        var wf = nebulaData[mi];
        Object.keys(wf).forEach(function(w) {
          if (w.length < 3) return;
          if (!wordMap[w]) wordMap[w] = { word: w, movieCount: 0, movieIndices: [], totalFreq: 0 };
          wordMap[w].movieCount++;
          wordMap[w].movieIndices.push(mi);
          wordMap[w].totalFreq += wf[w];
        });
      }

      var zones = {};
      Object.keys(wordMap).forEach(function(w) {
        var entry = wordMap[w];
        if (!zones[entry.movieCount]) zones[entry.movieCount] = [];
        zones[entry.movieCount].push(entry);
      });

      Object.keys(zones).forEach(function(z) {
        zones[z].sort(function(a, b) { return b.totalFreq - a.totalFreq; });
        zones[z] = zones[z].slice(0, z == activeCount ? 30 : 25);
      });

      return { wordMap: wordMap, zones: zones, activeCount: activeCount };
    }

    function render() {
      var existing = panel.querySelector('.nebula-cloud-wrap');
      if (existing) existing.remove();
      var existingStats = panel.querySelector('.nebula-stats');
      if (existingStats) existingStats.remove();

      var result = computeWords();
      var zones = result.zones;
      var wordMap = result.wordMap;
      var activeCount = result.activeCount;

      if (activeCount < 2) {
        var warn = document.createElement('div');
        warn.className = 'nebula-stats';
        warn.innerHTML = '<div class="neb-stat"><span class="neb-stat-label">Enable at least 2 movies to see the nebula</span></div>';
        panel.appendChild(warn);
        return;
      }

      var sharedAllCount = zones[activeCount] ? zones[activeCount].length : 0;
      var uniqueCount = zones[1] ? zones[1].length : 0;
      var mostShared = zones[activeCount] && zones[activeCount][0] ? zones[activeCount][0].word : '\u2014';

      var statsBar = document.createElement('div');
      statsBar.className = 'nebula-stats';
      statsBar.innerHTML =
        '<div class="neb-stat"><span class="neb-stat-value gold">' + sharedAllCount +
        '</span><span class="neb-stat-label">Words in All ' + activeCount + '</span></div>' +
        '<div class="neb-stat"><span class="neb-stat-value">' + uniqueCount +
        '</span><span class="neb-stat-label">Unique Words</span></div>' +
        '<div class="neb-stat"><span class="neb-stat-value cyan">' + escapeHTML(mostShared) +
        '</span><span class="neb-stat-label">Most Shared</span></div>';
      panel.appendChild(statsBar);

      var cloudWrap = document.createElement('div');
      cloudWrap.className = 'nebula-cloud-wrap';
      panel.appendChild(cloudWrap);

      for (var pi = 0; pi < 30; pi++) {
        var particle = document.createElement('div');
        particle.className = 'neb-particle';
        particle.style.left = (10 + Math.random() * 80) + '%';
        particle.style.top = (10 + Math.random() * 80) + '%';
        var pSize = (20 + Math.random() * 60) + 'px';
        particle.style.width = pSize;
        particle.style.height = pSize;
        particle.style.animationDelay = (-Math.random() * 8) + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        cloudWrap.appendChild(particle);
      }

      var ZONE_STYLES = {};
      ZONE_STYLES[activeCount] = { color: '#ffd700', size: '1.4rem', weight: '700', glow: true };
      if (activeCount > 2) ZONE_STYLES[activeCount - 1] = { color: '#ffaa00', size: '1.15rem', weight: '600', glow: true };
      for (var z = 2; z < activeCount - 1; z++) {
        ZONE_STYLES[z] = { color: '#00d9ff', size: '0.95rem', weight: '500', glow: false };
      }
      if (!ZONE_STYLES[2]) ZONE_STYLES[2] = { color: '#66e0ff', size: '0.85rem', weight: '500', glow: false };
      ZONE_STYLES[1] = { color: '#94a3b8', size: '0.72rem', weight: '400', glow: false };

      var cloudR = 260;
      var zoneKeys = Object.keys(zones).map(Number).sort(function(a, b) { return b - a; });

      zoneKeys.forEach(function(zoneNum) {
        var words = zones[zoneNum];
        var style = ZONE_STYLES[zoneNum] || ZONE_STYLES[1];
        var ringFrac = 1 - ((zoneNum - 1) / Math.max(activeCount - 1, 1));
        var ringR = 30 + ringFrac * (cloudR - 30);

        words.forEach(function(entry, wi) {
          var angle = (wi / words.length) * 2 * Math.PI - Math.PI / 2;
          var r = ringR + (Math.random() - 0.5) * 40;
          var x = 50 + (r * Math.cos(angle)) / cloudR * 42;
          var y = 50 + (r * Math.sin(angle)) / cloudR * 42;

          var wordEl = document.createElement('span');
          wordEl.className = 'neb-word' + (style.glow ? ' neb-glow' : '');
          wordEl.textContent = entry.word;
          wordEl.style.left = x + '%';
          wordEl.style.top = y + '%';
          wordEl.style.color = style.color;
          wordEl.style.fontSize = style.size;
          wordEl.style.fontWeight = style.weight;
          wordEl.style.animationDelay = (-Math.random() * 6) + 's';

          var movieNames = entry.movieIndices.map(function(mi) { return nebulaMovies[mi].title; });
          wordEl.title = entry.word + ' (' + entry.movieCount + '/' + activeCount + '): ' + movieNames.join(', ');

          cloudWrap.appendChild(wordEl);
        });
      });
    }

    var chipBar = document.createElement('div');
    chipBar.className = 'nebula-chips';
    panel.appendChild(chipBar);

    nebulaMovies.forEach(function(m, mi) {
      var chip = document.createElement('button');
      chip.className = 'neb-chip active';
      chip.style.borderColor = m.color;
      chip.style.color = m.color;
      chip.textContent = m.title;
      chip.addEventListener('click', function() {
        activeMovies[mi] = !activeMovies[mi];
        chip.classList.toggle('active', activeMovies[mi]);
        render();
      });
      chipBar.appendChild(chip);
    });

    render();
  }

  // ============================================================================
  // TOOLTIP
  // ============================================================================

  function ensureTooltip() {
    if (orbitalTooltipEl) return orbitalTooltipEl;
    orbitalTooltipEl = document.createElement('div');
    orbitalTooltipEl.className = 'orbital-tooltip';
    orbitalTooltipEl.hidden = true;
    document.body.appendChild(orbitalTooltipEl);
    return orbitalTooltipEl;
  }

  function attachTooltip(el, text) {
    el.addEventListener('mouseenter', function (e) {
      var tip = ensureTooltip();
      tip.textContent = text;
      tip.hidden = false;
      positionTooltip(e);
    });
    el.addEventListener('mousemove', positionTooltip);
    el.addEventListener('mouseleave', function () {
      var tip = ensureTooltip();
      tip.hidden = true;
    });
  }

  function positionTooltip(e) {
    if (!orbitalTooltipEl) return;
    var x = e.clientX + 12;
    var y = e.clientY - 10;
    // Keep within viewport
    var tipWidth = orbitalTooltipEl.offsetWidth || 200;
    if (x + tipWidth > window.innerWidth - 10) x = e.clientX - tipWidth - 12;
    if (y < 10) y = e.clientY + 16;
    orbitalTooltipEl.style.left = x + 'px';
    orbitalTooltipEl.style.top = y + 'px';
  }

  // ============================================================================
  // AWARDS COMPARISON
  // ============================================================================

  var awardsIndex = null; // tmdb_id → [{festival, category, year, isWinner, person}]

  function buildAwardsIndex() {
    if (awardsIndex) return awardsIndex;
    var idx = {};
    if (typeof AWARDS_BROWSE_DATABASE === 'undefined') return idx;
    var festKeys = ['Oscar', 'Cannes', 'Venice', 'Berlin', 'BAFTA', 'GoldenGlobe'];

    festKeys.forEach(function(fKey) {
      var fest = AWARDS_BROWSE_DATABASE[fKey];
      if (!fest) return;
      Object.keys(fest).forEach(function(cat) {
        var catData = fest[cat];
        if (!catData) return;
        Object.keys(catData).forEach(function(yr) {
          var yearData = catData[yr];
          if (!yearData) return;
          var year = parseInt(yr, 10);

          if (yearData.winner) {
            var id = yearData.winner.tmdb_id;
            if (!idx[id]) idx[id] = [];
            idx[id].push({ festival: fKey, category: cat, year: year, isWinner: true, person: yearData.winner.person || null });
          }
          if (yearData.nominees) {
            yearData.nominees.forEach(function(nom) {
              var nid = nom.tmdb_id;
              if (!idx[nid]) idx[nid] = [];
              idx[nid].push({ festival: fKey, category: cat, year: year, isWinner: false, person: nom.person || null });
            });
          }
        });
      });
    });

    // Sort: wins first, then year descending
    Object.keys(idx).forEach(function(id) {
      idx[id].sort(function(a, b) {
        if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
        return b.year - a.year;
      });
    });

    awardsIndex = idx;
    return idx;
  }

  var FEST_DISPLAY_NAMES = {
    Oscar: 'Oscar', Cannes: 'Cannes', Venice: 'Venice',
    Berlin: 'Berlin', BAFTA: 'BAFTA', GoldenGlobe: 'Golden Globe'
  };

  function renderAwards() {
    var panel = document.getElementById('panel-awards');
    if (!panel || !enrichedMovies) return;

    var idx = buildAwardsIndex();
    var svgs = (typeof AWARD_SVGS !== 'undefined') ? AWARD_SVGS : {};
    var anyHasAwards = false;

    var html = '<div class="awards-compare-grid">';

    // Column headers
    html += '<div class="awards-compare-header">';
    html += '<div class="awards-header-label">MOVIE</div>';
    html += '<div class="awards-header-col">WINS</div>';
    html += '<div class="awards-header-col">NOMINATIONS</div>';
    html += '</div>';

    enrichedMovies.forEach(function(m) {
      var awards = idx[m.id] || [];
      var wins = awards.filter(function(a) { return a.isWinner; });
      var noms = awards.filter(function(a) { return !a.isWinner; });
      if (awards.length > 0) anyHasAwards = true;

      var countText = '';
      if (wins.length || noms.length) {
        var parts = [];
        if (wins.length) parts.push(wins.length + ' win' + (wins.length > 1 ? 's' : ''));
        if (noms.length) parts.push(noms.length + ' nom' + (noms.length > 1 ? 's' : ''));
        countText = parts.join(', ');
      }

      html += '<div class="awards-compare-row" style="--row-color: ' + m.color + '">';

      // Movie label
      html += '<div class="awards-compare-label">';
      html += '<span class="awards-movie-name">' + escapeHTML(m.title) + '</span>';
      if (countText) {
        html += '<span class="awards-movie-count">' + countText + '</span>';
      }
      html += '</div>';

      // Wins column
      html += '<div class="awards-compare-col awards-col-wins">';
      if (wins.length === 0) {
        html += '<span class="awards-col-empty">\u2014</span>';
      } else {
        wins.forEach(function(a) {
          var svg = svgs[a.festival] || '';
          var tip = (FEST_DISPLAY_NAMES[a.festival] || a.festival) + ' \u2014 ' + a.category + ' (' + a.year + ')';
          if (a.person) tip += ' \u2022 ' + a.person;
          html += '<span class="awards-glyph win" data-tip="' + escapeHTML(tip) + '">' + svg + '</span>';
        });
      }
      html += '</div>';

      // Nominations column
      html += '<div class="awards-compare-col awards-col-noms">';
      if (noms.length === 0) {
        html += '<span class="awards-col-empty">\u2014</span>';
      } else {
        noms.forEach(function(a) {
          var svg = svgs[a.festival] || '';
          var tip = (FEST_DISPLAY_NAMES[a.festival] || a.festival) + ' \u2014 ' + a.category + ' (' + a.year + ')';
          if (a.person) tip += ' \u2022 ' + a.person;
          html += '<span class="awards-glyph nom" data-tip="' + escapeHTML(tip) + '">' + svg + '</span>';
        });
      }
      html += '</div>';

      html += '</div>'; // end row
    });

    html += '</div>'; // end grid

    if (!anyHasAwards) {
      html = '<div class="awards-empty-state">';
      html += '<div class="awards-empty-icon">🏆</div>';
      html += '<h3>No Award Records</h3>';
      html += '<p>None of the selected movies have awards or nominations in the archive.</p>';
      html += '</div>';
    }

    panel.innerHTML = html;

    // Bind glyph hover tooltips
    panel.querySelectorAll('.awards-glyph[data-tip]').forEach(function(el) {
      attachTooltip(el, el.dataset.tip);
    });
  }

  // ============================================================================
  // PANEL DISPATCHER
  // ============================================================================

  function renderActivePanel() {
    if (!enrichedMovies) return;
    var activeTab = compareTabs.querySelector('.compare-tab.active');
    if (!activeTab) return;
    var panelName = activeTab.dataset.panel;

    if (panelName === 'orbital') {
      renderOrbitalRings();
    } else if (panelName === 'constellation') {
      renderConstellation();
    } else if (panelName === 'timeline') {
      renderTimeline();
    } else if (panelName === 'radar') {
      renderRadar();
    } else if (panelName === 'nebula') {
      renderNebula();
    } else if (panelName === 'awards') {
      renderAwards();
    }
  }

  // ============================================================================
  // BOOT
  // ============================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
