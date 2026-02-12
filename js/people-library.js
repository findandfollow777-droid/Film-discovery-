/* ============================================
   ORBIT - Stellar Catalog Observatory
   Browsable, filterable people discovery
============================================ */
(function () {
  'use strict';

  // ── Constants ──
  const TMDB_BASE = 'https://api.themoviedb.org/3';
  const TMDB_IMG  = 'https://image.tmdb.org/t/p/';
  const RESULTS_PER_PAGE = 20;
  const SEARCH_DEBOUNCE  = 300;

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23111827' width='100' height='100' rx='50'/%3E%3Ccircle cx='50' cy='38' r='20' fill='%2364748b'/%3E%3Cellipse cx='50' cy='88' rx='30' ry='26' fill='%2364748b'/%3E%3C/svg%3E";

  const DEPT_MAP = {
    Acting:     { css: 'acting',     label: 'Actor' },
    Directing:  { css: 'directing',  label: 'Director' },
    Writing:    { css: 'writing',    label: 'Writer' },
    Production: { css: 'production', label: 'Producer' }
  };

  // ── Featured Collections ──
  // Note: Person IDs are best-known TMDB IDs; some may need manual verification
  const FEATURED_COLLECTIONS = [
    {
      id: 'oscar-legends',
      title: 'Oscar Legends',
      description: 'The most decorated names in cinema',
      icon: '\uD83C\uDFC6',
      color: '#ffd700',
      personIds: [1245, 2, 3084, 5064, 1204, 10297, 6193, 1038, 500, 5292, 12835, 2888, 1892, 18997, 934, 776, 192, 2524, 4756, 1231]
    },
    {
      id: 'international-auteurs',
      title: 'International Auteurs',
      description: 'Visionary directors from around the world',
      icon: '\uD83C\uDF0D',
      color: '#a855f7',
      personIds: [21684, 1614, 578, 4762, 2636, 1032, 5602, 3556, 2854, 7624, 10831, 12889, 1884, 7180, 60413, 68811, 17419, 1377, 5655, 2395]
    },
    {
      id: 'character-actors',
      title: 'Character Actor Legends',
      description: 'The unsung heroes who make every film better',
      icon: '\uD83C\uDFAD',
      color: '#10b981',
      personIds: [4135, 3977, 7399, 5293, 17305, 2231, 4566, 1233, 585, 17419, 17882, 8986, 4783, 934, 11701, 6968, 5176, 17276, 15152, 2176]
    },
    {
      id: 'rising-stars',
      title: 'Rising Stars',
      description: 'The next generation of cinema talent',
      icon: '\uD83C\uDF1F',
      color: '#06b6d4',
      personIds: [1373737, 1267329, 974169, 1640658, 2359841, 115440, 1750919, 2786960, 1252036, 1196507, 234352, 1397778, 2292028, 2112247, 570296, 1245, 1402785, 3194176, 3234818, 2576535]
    }
  ];

  // Note: Director/collaborator IDs are approximations; some may need verification
  const DIRECTOR_CIRCLES = {
    'Martin Scorsese':    { directorId: 1032,  collaborators: [3092, 6193, 819, 380, 5293, 2963, 10297] },
    'Christopher Nolan':  { directorId: 525,   collaborators: [2524, 1892, 17305, 6193, 2888, 2231, 10297] },
    'Quentin Tarantino':  { directorId: 138,   collaborators: [2231, 139, 3084, 3894, 2524, 1100, 10297] },
    'Wes Anderson':       { directorId: 5655,  collaborators: [17419, 10297, 5292, 884, 3894, 1892, 2176] },
    'Denis Villeneuve':   { directorId: 2854,  collaborators: [1373737, 1267329, 17288, 1379, 2524, 3894, 5293] },
    'David Fincher':      { directorId: 7467,  collaborators: [287, 819, 3084, 1283, 17288, 10297, 1892] },
    'Steven Spielberg':   { directorId: 488,   collaborators: [500, 1892, 3084, 380, 2963, 6193, 5292] },
    'Ridley Scott':       { directorId: 578,   collaborators: [3894, 1283, 819, 2524, 10297, 5292, 1204] },
    'Coen Brothers':      { directorId: 1223,  collaborators: [2888, 1204, 6193, 5293, 2176, 12835, 3084] },
    'Paul Thomas Anderson': { directorId: 4762, collaborators: [3092, 5064, 2888, 1038, 3894, 934, 2231] }
  };

  const GENRE_COLORS = {
    28: '#ef4444',    // Action
    12: '#f97316',    // Adventure
    16: '#10b981',    // Animation
    35: '#fbbf24',    // Comedy
    80: '#6366f1',    // Crime
    18: '#3b82f6',    // Drama
    14: '#8b5cf6',    // Fantasy
    27: '#a855f7',    // Horror
    10749: '#ec4899', // Romance
    878: '#06b6d4',   // Sci-Fi
    53: '#f97316'     // Thriller
  };

  // ── State ──
  let state = {
    currentPage:    1,
    totalPages:     1,
    rawPages:       [],      // raw results per fetched page (before filter)
    currentResults: [],      // filtered + sorted display list
    activeFilters: {
      department: 'Acting',
      era:        null,
      awards:     [],
      sort:       'popularity'
    },
    isSearchMode:      false,
    searchQuery:       '',
    isLoading:         false,
    collectionMode:    null,  // null or collection id string
    circleMode:        null   // null or director name string
  };

  // ── DOM Refs ──
  let dom = {};

  function $(id) { return document.getElementById(id); }

  function cacheDom() {
    dom = {
      searchInput:   $('plSearchInput'),
      searchClear:   $('plSearchClear'),
      searchBanner:  $('plSearchBanner'),
      deptChips:     $('deptChips'),
      eraChips:      $('eraChips'),
      awardsChips:   $('awardsChips'),
      sortSelect:    $('plSortSelect'),
      grid:          $('plGrid'),
      skeleton:      $('plSkeleton'),
      empty:         $('plEmpty'),
      error:         $('plError'),
      retryBtn:      $('plRetryBtn'),
      loadMoreWrap:    $('plLoadMoreWrap'),
      loadMoreBtn:     $('plLoadMoreBtn'),
      resultSummary:   $('plResultSummary'),
      exclusives:      $('plExclusives'),
      exclusivesToggle: $('plExclusivesToggle'),
      exclusivesBody:  $('plExclusivesBody'),
      collectionsRow:  $('plCollectionsRow'),
      directorSelect:  $('plDirectorSelect'),
      modeBanner:      $('plModeBanner'),
      modeBannerText:  $('plModeBannerText'),
      modeBannerClear: $('plModeBannerClear')
    };
  }

  // ── Awards lookup (built once) ──
  let awardsMovieIds = null; // Set of movie IDs in AWARDS_DATABASE
  let awardsByMovie  = null; // Reference to AWARDS_DATABASE

  function initAwardsLookup() {
    awardsByMovie = window.AWARDS_DATABASE || window.PRESTIGE_DATABASE || {};
    awardsMovieIds = new Set(Object.keys(awardsByMovie).map(Number));
  }

  // ── Init ──
  function init() {
    cacheDom();
    initAwardsLookup();
    bindSearchInput();
    bindDeptChips();
    bindEraChips();
    bindAwardsChips();
    bindSortHandler();
    bindLoadMore();
    bindRetry();
    bindGridClicks();
    renderCollectionCards();
    populateDirectorSelect();
    bindExclusives();
    bindModeBanner();
    // Expand exclusives on desktop by default
    if (window.innerWidth > 650) {
      dom.exclusives.classList.add('expanded');
    }
    fetchPopularPeople(1);
  }

  // ── Fetch: Popular People ──
  async function fetchPopularPeople(page) {
    if (state.isLoading) return;
    state.isLoading = true;

    if (page === 1) {
      showState('loading');
      state.rawPages = [];
      state.currentResults = [];
    } else {
      updateLoadMoreBtn('loading');
    }

    try {
      const cacheKey = 'orbit_library_browse_page_' + page;
      let data = getCachedPage(cacheKey);

      if (!data) {
        const url = TMDB_BASE + '/person/popular?api_key=' + TMDB_API_KEY + '&page=' + page;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('TMDB ' + resp.status);
        data = await resp.json();
        setCachedPage(cacheKey, data);
      }

      state.totalPages = Math.min(data.total_pages || 1, 500);
      state.currentPage = page;
      state.rawPages.push(...(data.results || []));

      rebuildFilteredResults();
      showState('results');
    } catch (err) {
      console.error('Failed to fetch popular people:', err);
      if (page === 1) showState('error');
    } finally {
      state.isLoading = false;
    }
  }

  // ── Fetch: Search People ──
  async function searchPeople(query, page) {
    if (state.isLoading) return;
    state.isLoading = true;

    page = page || 1;
    state.isSearchMode = true;
    state.searchQuery = query;

    if (page === 1) {
      showState('loading');
      state.rawPages = [];
      state.currentResults = [];
    } else {
      updateLoadMoreBtn('loading');
    }

    // Show search banner
    dom.searchBanner.textContent = "Showing results for '" + query + "'";
    dom.searchBanner.classList.remove('hidden');

    // Enable era chips in search mode
    enableEraChips(true);

    try {
      const url = TMDB_BASE + '/search/person?api_key=' + TMDB_API_KEY +
                  '&query=' + encodeURIComponent(query) + '&page=' + page;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('TMDB ' + resp.status);
      const data = await resp.json();

      state.totalPages = Math.min(data.total_pages || 1, 500);
      state.currentPage = page;
      state.rawPages.push(...(data.results || []));

      rebuildFilteredResults();
      showState('results');
    } catch (err) {
      console.error('Failed to search people:', err);
      if (page === 1) showState('error');
    } finally {
      state.isLoading = false;
    }
  }

  // ── Filter + Sort pipeline ──
  function rebuildFilteredResults() {
    let people = [...state.rawPages];
    people = applyFilters(people);
    people = applySorting(people);
    state.currentResults = people;
    renderGrid();
  }

  function applyFilters(people) {
    people = filterByDepartment(people, state.activeFilters.department);
    people = filterByAwards(people, state.activeFilters.awards);
    if (state.isSearchMode && state.activeFilters.era) {
      people = filterByEra(people, state.activeFilters.era);
    }
    return people;
  }

  function filterByDepartment(people, dept) {
    if (!dept || dept === 'All') return people;
    return people.filter(function (p) {
      return p.known_for_department === dept;
    });
  }

  function filterByAwards(people, festivals) {
    // Awards filter highlights confirmed matches rather than excluding.
    // All people pass through; the gold badge in renderPersonCard indicates matches.
    return people;
  }

  function filterByEra(people, decade) {
    var decadeNum = parseInt(decade, 10);
    if (isNaN(decadeNum)) return people;
    return people.filter(function (p) {
      var knownFor = p.known_for || [];
      return knownFor.some(function (item) {
        var rd = item.release_date || item.first_air_date || '';
        if (!rd) return false;
        var year = parseInt(rd.substring(0, 4), 10);
        return year >= decadeNum && year < decadeNum + 10;
      });
    });
  }

  function applySorting(people) {
    var key = state.activeFilters.sort;
    if (key === 'alpha') {
      return people.slice().sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '');
      });
    }
    if (key === 'prolific') {
      return people.slice().sort(function (a, b) {
        return (b.known_for || []).length - (a.known_for || []).length;
      });
    }
    // popularity: keep API order
    return people;
  }

  // ── Render ──
  function renderGrid() {
    var html = '';
    state.currentResults.forEach(function (person) {
      html += renderPersonCard(person);
    });
    dom.grid.innerHTML = html;

    // Update result summary
    updateResultSummary();

    // Show/hide states
    if (state.currentResults.length === 0) {
      dom.grid.classList.add('hidden');
      updateEmptyState();
      dom.empty.classList.remove('hidden');
      dom.loadMoreWrap.classList.add('hidden');
    } else {
      dom.grid.classList.remove('hidden');
      dom.empty.classList.add('hidden');
      // Hide load more in collection/circle mode
      if (state.collectionMode || state.circleMode) {
        dom.loadMoreWrap.classList.add('hidden');
      } else if (state.currentPage < state.totalPages) {
        dom.loadMoreWrap.classList.remove('hidden');
        updateLoadMoreBtn('ready');
      } else {
        dom.loadMoreWrap.classList.remove('hidden');
        updateLoadMoreBtn('done');
      }
    }
  }

  function renderPersonCard(person) {
    var id = person.id;
    var name = esc(person.name || 'Unknown');
    var dept = person.known_for_department || '';
    var deptInfo = DEPT_MAP[dept];
    var photoUrl = person.profile_path
      ? TMDB_IMG + 'w185' + person.profile_path
      : '';

    // Known-for titles (prefer movies, max 2)
    var knownFor = (person.known_for || []);
    var movies = knownFor.filter(function (k) { return k.media_type === 'movie'; });
    var shows  = knownFor.filter(function (k) { return k.media_type === 'tv'; });
    var titles = movies.concat(shows).slice(0, 2).map(function (k) {
      return esc(k.title || k.name || '');
    });
    var knownForText = titles.length ? 'Known for: ' + titles.join(', ') : '';

    // Awards count
    var awardCount = 0;
    knownFor.forEach(function (item) {
      if (awardsMovieIds.has(item.id)) {
        var entry = awardsByMovie[item.id];
        if (entry && entry.awards) awardCount += entry.awards.length;
      }
    });

    // Encounter state
    var isEncountered = false;
    var isBookmarked = false;
    var encounterCount = 0;
    if (window.OrbitEncounters) {
      isEncountered = !!window.OrbitEncounters.isEncountered(id);
      encounterCount = Math.min(window.OrbitEncounters.getEncounterCount(id) || 0, 5);
      if (isEncountered) {
        var encountered = window.OrbitEncounters.getEncountered ? window.OrbitEncounters.getEncountered() : {};
        var personData = encountered[id];
        if (personData) isBookmarked = !!personData.bookmarked;
      }
    }
    var dots = '';
    for (var i = 0; i < 5; i++) {
      dots += '<span class="pl-encounter-dot' + (i < encounterCount ? ' filled' : '') + '"></span>';
    }

    // Genre dots (top 3 genres from known_for items)
    var genreCounts = {};
    knownFor.forEach(function (item) {
      (item.genre_ids || []).forEach(function (gid) {
        genreCounts[gid] = (genreCounts[gid] || 0) + 1;
      });
    });
    var topGenres = Object.keys(genreCounts)
      .sort(function (a, b) { return genreCounts[b] - genreCounts[a]; })
      .slice(0, 3)
      .map(Number);
    var genreDotsHtml = '';
    if (topGenres.length > 0) {
      genreDotsHtml = '<span class="pl-card-genre-dots">';
      topGenres.forEach(function (gid) {
        var color = GENRE_COLORS[gid] || '#64748b';
        genreDotsHtml += '<span class="pl-genre-dot" style="background:' + color + '" title="Genre"></span>';
      });
      genreDotsHtml += '</span>';
    }

    // Photo HTML
    var photoHtml;
    if (photoUrl) {
      photoHtml = '<img class="pl-card-photo" src="' + photoUrl + '" alt="' + name + '" loading="lazy">';
    } else {
      photoHtml = '<div class="pl-card-fallback"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ghost-gray)" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></div>';
    }

    // Department badge + genre dots row
    var deptRowHtml = '';
    if (deptInfo || genreDotsHtml) {
      deptRowHtml = '<div class="pl-card-dept-row">';
      if (deptInfo) {
        deptRowHtml += '<span class="pl-card-dept pl-card-dept--' + deptInfo.css + '">' + deptInfo.label + '</span>';
      }
      deptRowHtml += genreDotsHtml + '</div>';
    }

    // Awards badge (top-right)
    var awardsHtml = '';
    if (awardCount > 0) {
      awardsHtml = '<div class="pl-card-awards">\uD83C\uDFC6 \u00D7' + awardCount + '</div>';
    }

    // Bookmarked star (top-left)
    var bookmarkHtml = '';
    if (isEncountered && isBookmarked) {
      bookmarkHtml = '<div class="pl-card-bookmark"><svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="var(--accent-gold)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>';
    }

    // Card CSS classes
    var cardClasses = 'pl-card';
    if (isEncountered) {
      cardClasses += ' pl-card--encountered';
    } else {
      cardClasses += ' pl-card--unencountered';
    }

    return '<div class="' + cardClasses + '" data-person-id="' + id + '" data-person-name="' + name + '" data-person-photo="' + esc(person.profile_path || '') + '" data-person-dept="' + esc(dept) + '">' +
      bookmarkHtml +
      awardsHtml +
      photoHtml +
      '<div class="pl-card-name">' + name + '</div>' +
      deptRowHtml +
      (knownForText ? '<div class="pl-card-known">' + knownForText + '</div>' : '') +
      '<div class="pl-card-encounters">' + dots + '</div>' +
    '</div>';
  }

  // ── Result Summary ──
  function updateResultSummary() {
    var parts = [];
    if (state.collectionMode || state.circleMode) {
      // Summary handled by mode banner
      dom.resultSummary.classList.add('hidden');
      return;
    } else if (state.isSearchMode) {
      parts.push("Showing results for '" + esc(state.searchQuery) + "'");
    } else {
      var deptLabel = state.activeFilters.department === 'All'
        ? 'people'
        : (DEPT_MAP[state.activeFilters.department] || {}).label
          ? DEPT_MAP[state.activeFilters.department].label.toLowerCase() + 's'
          : 'people';
      parts.push('Showing popular ' + deptLabel);
    }
    if (state.activeFilters.awards.length > 0) {
      parts.push(state.activeFilters.awards.join(', ') + ' filter active');
    }
    if (state.activeFilters.era) {
      parts.push(state.activeFilters.era + 's era');
    }
    dom.resultSummary.textContent = parts.join(' \u00B7 ');
    dom.resultSummary.classList.remove('hidden');
  }

  // ── Context-Sensitive Empty States ──
  function updateEmptyState() {
    var titleEl = dom.empty.querySelector('.pl-empty-title');
    var textEl  = dom.empty.querySelector('.pl-empty-text');
    if (!titleEl || !textEl) return;

    if (state.isSearchMode) {
      titleEl.textContent = "No results for '" + state.searchQuery + "'";
      textEl.textContent = 'Check the spelling or try a different name.';
    } else if (state.activeFilters.awards.length > 0) {
      titleEl.textContent = 'No confirmed award matches in current results';
      textEl.textContent = 'Awards data is verified when you visit individual profiles.';
    } else {
      titleEl.textContent = 'No people found';
      textEl.textContent = 'Try a different filter combination.';
    }
  }

  // ── Load More Button States ──
  function updateLoadMoreBtn(mode) {
    dom.loadMoreBtn.classList.remove('pl-btn-loading', 'pl-btn-done');
    dom.loadMoreBtn.disabled = false;
    if (mode === 'loading') {
      dom.loadMoreBtn.classList.add('pl-btn-loading');
      dom.loadMoreBtn.disabled = true;
      dom.loadMoreBtn.textContent = 'Loading...';
    } else if (mode === 'done') {
      dom.loadMoreBtn.classList.add('pl-btn-done');
      dom.loadMoreBtn.disabled = true;
      dom.loadMoreBtn.textContent = 'All results loaded';
    } else {
      dom.loadMoreBtn.textContent = 'Load More';
    }
  }

  // ── State Management ──
  function showState(stateName) {
    dom.skeleton.classList.toggle('hidden', stateName !== 'loading');
    dom.grid.classList.toggle('hidden', stateName !== 'results');
    dom.empty.classList.add('hidden');
    dom.error.classList.toggle('hidden', stateName !== 'error');
    if (stateName === 'error') {
      dom.error.querySelector('p').textContent =
        'Unable to connect to TMDB. Check your connection and try again.';
    }
    if (stateName !== 'results') {
      dom.loadMoreWrap.classList.add('hidden');
      dom.resultSummary.classList.add('hidden');
    }
  }

  // ── Event Binding ──
  function bindSearchInput() {
    var timer = null;
    dom.searchInput.addEventListener('input', function () {
      var val = dom.searchInput.value.trim();
      clearTimeout(timer);

      // Show/hide clear button
      dom.searchClear.classList.toggle('hidden', val.length === 0);

      if (val.length >= 2) {
        timer = setTimeout(function () { searchPeople(val, 1); }, SEARCH_DEBOUNCE);
      } else if (val.length === 0) {
        exitSearchMode();
      }
    });

    dom.searchClear.addEventListener('click', function () {
      dom.searchInput.value = '';
      dom.searchClear.classList.add('hidden');
      exitSearchMode();
      dom.searchInput.focus();
    });
  }

  function exitSearchMode() {
    state.isSearchMode = false;
    state.searchQuery = '';
    state.currentPage = 1;
    state.rawPages = [];
    dom.searchBanner.classList.add('hidden');
    enableEraChips(false);
    // Clear era filter
    state.activeFilters.era = null;
    var eraActive = dom.eraChips.querySelector('.pl-chip.active');
    if (eraActive) eraActive.classList.remove('active');
    fetchPopularPeople(1);
  }

  function bindDeptChips() {
    dom.deptChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.pl-chip');
      if (!chip) return;
      // Single-select: deactivate siblings, activate clicked
      dom.deptChips.querySelectorAll('.pl-chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      state.activeFilters.department = chip.dataset.dept;

      // Reset and re-fetch/re-filter
      if (state.isSearchMode) {
        rebuildFilteredResults();
      } else {
        state.currentPage = 1;
        state.rawPages = [];
        fetchPopularPeople(1);
      }
    });
  }

  function bindEraChips() {
    dom.eraChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.pl-chip');
      if (!chip || chip.classList.contains('pl-chip-disabled')) return;

      // Toggle: deactivate others, toggle clicked
      var wasActive = chip.classList.contains('active');
      dom.eraChips.querySelectorAll('.pl-chip').forEach(function (c) { c.classList.remove('active'); });
      if (!wasActive) {
        chip.classList.add('active');
        state.activeFilters.era = chip.dataset.era;
      } else {
        state.activeFilters.era = null;
      }
      rebuildFilteredResults();
    });
  }

  function enableEraChips(enabled) {
    dom.eraChips.querySelectorAll('.pl-chip').forEach(function (chip) {
      if (enabled) {
        chip.classList.remove('pl-chip-disabled');
        chip.title = '';
      } else {
        chip.classList.add('pl-chip-disabled');
        chip.classList.remove('active');
        chip.title = 'Era filter works best with search';
      }
    });
  }

  function bindAwardsChips() {
    dom.awardsChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.pl-chip');
      if (!chip) return;

      // Multi-select toggle
      chip.classList.toggle('active');
      var festival = chip.dataset.award;
      var idx = state.activeFilters.awards.indexOf(festival);
      if (idx === -1) {
        state.activeFilters.awards.push(festival);
      } else {
        state.activeFilters.awards.splice(idx, 1);
      }
      rebuildFilteredResults();
    });
  }

  function bindSortHandler() {
    dom.sortSelect.addEventListener('change', function () {
      state.activeFilters.sort = dom.sortSelect.value;
      rebuildFilteredResults();
    });
  }

  function bindLoadMore() {
    dom.loadMoreBtn.addEventListener('click', function () {
      var nextPage = state.currentPage + 1;
      if (state.isSearchMode) {
        searchPeople(state.searchQuery, nextPage);
      } else {
        fetchPopularPeople(nextPage);
      }
    });
  }

  function bindRetry() {
    dom.retryBtn.addEventListener('click', function () {
      if (state.isSearchMode) {
        searchPeople(state.searchQuery, 1);
      } else {
        fetchPopularPeople(1);
      }
    });
  }

  function bindGridClicks() {
    dom.grid.addEventListener('click', function (e) {
      var card = e.target.closest('.pl-card');
      if (!card) return;
      var personId = card.dataset.personId;
      if (!personId) return;

      // Log encounter
      if (window.OrbitEncounters) {
        window.OrbitEncounters.logEncounter({
          id: parseInt(personId, 10),
          name: card.dataset.personName || '',
          profile_path: card.dataset.personPhoto || null,
          known_for_department: card.dataset.personDept || null
        }, 'stellar-catalog');
      }

      window.location.href = 'people-profile.html?id=' + personId;
    });
  }

  // ── ORBIT Exclusives ──
  function renderCollectionCards() {
    var html = '';
    FEATURED_COLLECTIONS.forEach(function (col) {
      html += '<div class="pl-collection-card" data-collection="' + col.id + '" style="border-top: 3px solid ' + col.color + '">' +
        '<span class="pl-collection-icon">' + col.icon + '</span>' +
        '<div class="pl-collection-title">' + esc(col.title) + '</div>' +
        '<div class="pl-collection-desc">' + esc(col.description) + '</div>' +
      '</div>';
    });
    dom.collectionsRow.innerHTML = html;
  }

  function populateDirectorSelect() {
    var names = Object.keys(DIRECTOR_CIRCLES).sort();
    names.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      dom.directorSelect.appendChild(opt);
    });
  }

  function bindExclusives() {
    // Toggle expand/collapse
    dom.exclusivesToggle.addEventListener('click', function () {
      dom.exclusives.classList.toggle('expanded');
    });

    // Collection card clicks
    dom.collectionsRow.addEventListener('click', function (e) {
      var card = e.target.closest('.pl-collection-card');
      if (!card) return;
      var colId = card.dataset.collection;
      var collection = FEATURED_COLLECTIONS.find(function (c) { return c.id === colId; });
      if (collection) loadCollection(collection);
    });

    // Director circle select
    dom.directorSelect.addEventListener('change', function () {
      var name = dom.directorSelect.value;
      if (!name) return;
      var circle = DIRECTOR_CIRCLES[name];
      if (circle) loadDirectorCircle(name, circle);
    });
  }

  function bindModeBanner() {
    dom.modeBannerClear.addEventListener('click', exitSpecialMode);
  }

  async function loadCollection(collection) {
    exitSpecialMode(true); // silent — don't re-fetch popular yet
    state.collectionMode = collection.id;
    state.rawPages = [];
    state.currentResults = [];

    // Show banner
    dom.modeBannerText.textContent = 'Showing: ' + collection.title;
    dom.modeBanner.classList.remove('hidden');
    dom.searchBanner.classList.add('hidden');

    showState('loading');
    await batchFetchPeople(collection.personIds);
  }

  async function loadDirectorCircle(name, circle) {
    exitSpecialMode(true);
    state.circleMode = name;
    state.rawPages = [];
    state.currentResults = [];

    // Show banner
    dom.modeBannerText.textContent = name + "'s Circle";
    dom.modeBanner.classList.remove('hidden');
    dom.searchBanner.classList.add('hidden');

    // Fetch director + collaborators
    var allIds = [circle.directorId].concat(circle.collaborators);
    showState('loading');
    await batchFetchPeople(allIds);
  }

  async function batchFetchPeople(personIds) {
    var BATCH_SIZE = 5;
    var BATCH_DELAY = 200;
    var results = [];

    for (var i = 0; i < personIds.length; i += BATCH_SIZE) {
      var batch = personIds.slice(i, i + BATCH_SIZE);
      var promises = batch.map(function (pid) {
        // Check session cache first
        var cacheKey = 'orbit_person_' + pid;
        var cached = getCachedPage(cacheKey);
        if (cached) return Promise.resolve(cached);

        var url = TMDB_BASE + '/person/' + pid + '?api_key=' + TMDB_API_KEY + '&append_to_response=combined_credits';
        return fetch(url).then(function (resp) {
          if (!resp.ok) return null;
          return resp.json();
        }).then(function (data) {
          if (data) setCachedPage(cacheKey, data);
          return data;
        }).catch(function () { return null; });
      });

      var batchResults = await Promise.all(promises);
      batchResults.forEach(function (person) {
        if (!person) return;
        // Normalize to look like TMDB popular/search result format
        var normalized = {
          id: person.id,
          name: person.name,
          profile_path: person.profile_path,
          known_for_department: person.known_for_department,
          popularity: person.popularity || 0,
          known_for: []
        };
        // Build known_for from combined_credits (top 3 by popularity)
        if (person.combined_credits && person.combined_credits.cast) {
          normalized.known_for = person.combined_credits.cast
            .sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); })
            .slice(0, 3)
            .map(function (c) {
              return {
                id: c.id,
                title: c.title || c.name,
                name: c.name || c.title,
                media_type: c.media_type || 'movie',
                genre_ids: c.genre_ids || [],
                release_date: c.release_date || c.first_air_date || '',
                first_air_date: c.first_air_date || ''
              };
            });
        }
        // Also check crew credits for directors
        if (normalized.known_for.length === 0 && person.combined_credits && person.combined_credits.crew) {
          normalized.known_for = person.combined_credits.crew
            .sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); })
            .slice(0, 3)
            .map(function (c) {
              return {
                id: c.id,
                title: c.title || c.name,
                name: c.name || c.title,
                media_type: c.media_type || 'movie',
                genre_ids: c.genre_ids || [],
                release_date: c.release_date || c.first_air_date || '',
                first_air_date: c.first_air_date || ''
              };
            });
        }
        results.push(normalized);
      });

      // Progressive render: update grid as batches arrive
      state.rawPages = results.slice();
      state.currentResults = applySorting(applyFilters(results.slice()));
      renderGrid();
      showState('results');

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < personIds.length) {
        await new Promise(function (r) { setTimeout(r, BATCH_DELAY); });
      }
    }

    // Final render
    state.rawPages = results;
    state.currentResults = applySorting(applyFilters(results));
    state.totalPages = 1;
    state.currentPage = 1;
    renderGrid();
    showState('results');
    state.isLoading = false;
  }

  function exitSpecialMode(silent) {
    state.collectionMode = null;
    state.circleMode = null;
    dom.modeBanner.classList.add('hidden');
    dom.directorSelect.value = '';
    if (!silent) {
      state.isSearchMode = false;
      state.searchQuery = '';
      state.currentPage = 1;
      state.rawPages = [];
      dom.searchInput.value = '';
      dom.searchClear.classList.add('hidden');
      dom.searchBanner.classList.add('hidden');
      enableEraChips(false);
      state.activeFilters.era = null;
      var eraActive = dom.eraChips.querySelector('.pl-chip.active');
      if (eraActive) eraActive.classList.remove('active');
      fetchPopularPeople(1);
    }
  }

  // ── Session Cache ──
  function getCachedPage(key) {
    try {
      var raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function setCachedPage(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) { /* quota exceeded — ignore */ }
  }

  // ── Utilities ──
  function esc(str) {
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', init);
})();
