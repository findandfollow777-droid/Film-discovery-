/* ============================================
   ORBIT - The Observatory
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

  // ── Recently Deceased (Past 12 Months) ──
  // Updated periodically - people who passed within the last year
  // Format: { id: TMDB_ID, date: 'YYYY-MM-DD' }
  const RECENTLY_DECEASED = [
    // 2025
    { id: 112117, date: '2025-02-14' }, // Carlos Diegues
    { id: 193, date: '2025-02-18' },    // Gene Hackman
    { id: 49961, date: '2025-02-26' },  // Michelle Trachtenberg
    { id: 79381, date: '2025-03-25' },  // Donald Crombie
    { id: 5576, date: '2025-04-01' },   // Val Kilmer
    { id: 87558, date: '2025-04-04' },  // Manoj Kumar
    { id: 18070, date: '2025-04-08' },  // Nicky Katt
    { id: 66606, date: '2025-05-20' },  // George Wendt
    { id: 55428, date: '2025-05-30' },  // Loretta Swit
    { id: 1166, date: '2025-06-01' },   // Harris Yulin
    { id: 104421, date: '2025-06-24' }, // Bobby Sherman
    { id: 9217, date: '2025-06-26' },   // Lalo Schifrin
    { id: 20402, date: '2025-07-02' },  // Julian McMahon
    { id: 147, date: '2025-07-03' },    // Michael Madsen
    { id: 1244929, date: '2025-07-17' }, // Alan Bergman
    { id: 40259, date: '2025-07-20' },  // Malcolm-Jamal Warner
    { id: 3610257, date: '2025-08-11' }, // Danielle Spencer
    { id: 28641, date: '2025-08-17' },  // Terence Stamp
    { id: 223844, date: '2025-08-28' }, // Mike de Leon
    { id: 6804, date: '2025-09-01' },   // Graham Greene
    { id: 4959, date: '2025-09-23' },   // Claudia Cardinale
    { id: 190391, date: '2025-10-03' }, // Patricia Routledge
    { id: 3092, date: '2025-10-11' },   // Diane Keaton
    { id: 46780, date: '2025-10-15' },  // Samantha Eggar
    { id: 5240, date: '2025-10-16' },   // Klaus Doldinger
    { id: 13997, date: '2025-10-23' },  // June Lockhart
    { id: 2723, date: '2025-10-30' },   // Adam Greenberg
    { id: 6587, date: '2025-11-03' },   // Diane Ladd
    { id: 12134, date: '2025-11-15' },  // Sally Kirkland
    { id: 85655, date: '2025-11-24' },  // Dharmendra
    { id: 4135, date: '2025-12-01' },   // Robert Redford
    { id: 3783, date: '2025-12-10' },   // Brigitte Bardot
    { id: 3026, date: '2025-12-14' },   // Rob Reiner
    { id: 33848, date: '2025-12-16' },  // Gil Gerard
    { id: 28906, date: '2025-12-20' },  // Richard Chamberlain
    { id: 14836, date: '2025-12-31' },  // Jon Korkes
    // 2026 (Jan-Feb)
    { id: 17121, date: '2026-01-01' },  // Ahn Sung-ki
    { id: 85637, date: '2026-01-01' },  // Béla Tarr
    { id: 15411, date: '2026-01-01' },  // T.K. Carter
    { id: 1215063, date: '2026-01-05' }, // Tom Cherones
    { id: 151502, date: '2026-01-16' }, // Bruce Bilson
    { id: 15812, date: '2026-01-17' },  // Roger Allers
    { id: 11514, date: '2026-01-30' },  // Catherine O'Hara
    { id: 19210, date: '2026-02-11' },  // James Van Der Beek
    { id: 4971, date: '2026-02-12' }    // Bud Cort
  ];

  // Helper: Check if person died in past 12 months
  function isRecentlyDeceased(personId) {
    const entry = RECENTLY_DECEASED.find(function(d) { return d.id === personId; });
    if (!entry) return false;

    const deathDate = new Date(entry.date);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return deathDate >= oneYearAgo && deathDate <= now;
  }

  // ── Featured Collections ──
  // Note: Person IDs are best-known TMDB IDs; some may need manual verification
  const FEATURED_COLLECTIONS = [
    {
      id: 'oscar-legends',
      title: 'Oscar Legends',
      description: 'The most decorated names in cinema',
      icon: '<span class="og og-oscar"></span>',
      color: '#ffd700',
      personIds: [1245, 2, 3084, 5064, 1204, 10297, 6193, 1038, 500, 5292, 12835, 2888, 1892, 18997, 934, 776, 192, 2524, 4756, 1231]
    },
    {
      id: 'international-auteurs',
      title: 'World Cinema Directors',
      description: 'Visionary directors from around the globe',
      icon: '<span class="og og-globe"></span>',
      color: '#a855f7',
      personIds: [21684, 1614, 578, 4762, 2636, 1032, 5602, 3556, 2854, 7624, 10831, 12889, 1884, 7180, 60413, 68811, 17419, 1377, 5655, 2395]
    },
    {
      id: 'character-actors',
      title: 'Character Actor Legends',
      description: 'The unsung heroes who make every film better',
      icon: '<span class="og og-bafta"></span>',
      color: '#10b981',
      personIds: [4135, 3977, 7399, 5293, 17305, 2231, 4566, 1233, 585, 17419, 17882, 8986, 4783, 934, 11701, 6968, 5176, 17276, 15152, 2176]
    },
    {
      id: 'rising-stars',
      title: 'Rising Stars',
      description: 'The next generation of cinema talent',
      icon: '<span class="og og-rising-star"></span>',
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

  // ── Discovery Map constants ──
  var MAP_GENRES = ['Drama', 'Romance', 'History', 'Action', 'Adventure', 'Thriller', 'Crime', 'Comedy', 'Animation', 'Fantasy', 'Sci-Fi', 'Horror'];
  var MAP_DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  var GENRE_NAME_COLORS = {
    'Drama': '#3b82f6', 'Action': '#ef4444', 'Comedy': '#fbbf24',
    'Horror': '#8b5cf6', 'Sci-Fi': '#06b6d4', 'Thriller': '#f97316',
    'Romance': '#ec4899', 'Animation': '#10b981', 'Crime': '#a855f7',
    'Adventure': '#22c55e', 'Fantasy': '#6366f1', 'Documentary': '#78716c',
    'Music': '#e879f9', 'War': '#737373', 'History': '#b45309',
    'Western': '#a16207', 'Family': '#f472b6', 'Mystery': '#7c3aed',
    'Other': '#64748b'
  };

  var SOURCE_COLORS = {
    'stellar-catalog': '#00d9ff',
    'constellation': '#ffd700',
    'collision': '#f97316',
    'moviecube': '#06b6d4',
    'timeline': '#a855f7',
    'screenshot': '#fbbf24',
    'sequel-shot': '#8b5cf6'
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
    circleMode:        null,  // null or director name string
    orbitMode:         false,
    orbitPeople:       [],    // all orbit people (unfiltered)
    bookmarkedOnly:    false,
    findAllMode:       false,
    findAllLoading:    false,
    findAllPages:      0,
    curatedSnapshot:   null
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
      modeBannerClear: $('plModeBannerClear'),
      // D1: My Orbit
      toggleWrap:      $('plToggleWrap'),
      title:           document.querySelector('.pl-title'),
      subtitle:        document.querySelector('.pl-subtitle'),
      orbitPanel:      $('plOrbitPanel'),
      mapCanvas:       $('plMapCanvas'),
      mapTooltip:      $('plMapTooltip'),
      mapOverlay:      $('plMapOverlay'),
      genrePie:        $('plGenrePie'),
      gapAnalysis:     $('plGapAnalysis'),
      orbitStats:      $('plOrbitStats'),
      bookmarkGroup:   $('plBookmarkGroup'),
      bookmarkChip:    $('plBookmarkChip'),
      orbitEncourage:  $('plOrbitEncourage'),
      filters:         $('plFilters'),
      // Find All
      findAllGroup:    $('plFindAllGroup'),
      findAllBtn:      $('plFindAllBtn'),
      // First-visit welcome overlay
      welcomeOverlay:  $('plWelcomeOverlay'),
      welcomeBtn:      $('plWelcomeBtn')
    };
  }

  // ── Awards lookup (built once) ──
  let awardsMovieIds = null; // Set of movie IDs in AWARDS_DATABASE
  let awardsByMovie  = null; // Reference to AWARDS_DATABASE

  function initAwardsLookup() {
    awardsByMovie = window.AWARDS_DATABASE || window.PRESTIGE_DATABASE || {};
    awardsMovieIds = new Set(Object.keys(awardsByMovie).map(Number));
  }

  // ── First-visit welcome overlay ──
  function checkFirstVisit() {
    const hasVisited = localStorage.getItem('orbit_stellar_catalog_intro_seen');
    if (!hasVisited && dom.welcomeOverlay) {
      dom.welcomeOverlay.classList.remove('hidden');
    }
  }

  function dismissWelcome() {
    localStorage.setItem('orbit_stellar_catalog_intro_seen', 'true');
    if (dom.welcomeOverlay) {
      dom.welcomeOverlay.classList.add('hidden');
    }
  }

  // ── Init ──
  function init() {
    cacheDom();
    initAwardsLookup();
    checkFirstVisit();
    bindSearchInput();
    bindDeptChips();
    bindEraChips();
    bindAwardsChips();
    bindSortHandler();
    bindLoadMore();
    bindRetry();
    bindGridClicks();
    bindWelcome();
    renderCollectionCards();
    populateDirectorSelect();
    bindExclusives();
    bindModeBanner();
    bindToggle();
    bindBookmarkChip();
    bindMapInteraction();
    bindFindAll();
    // Expand exclusives on desktop by default
    if (window.innerWidth > 650) {
      dom.exclusives.classList.add('expanded');
    }

    // URL parameter handling
    var params = new URLSearchParams(window.location.search);

    if (params.get('mode') === 'orbit') {
      enterOrbitMode();
      return;
    }

    if (params.get('circle')) {
      loadCircleFromPerson(params.get('circle'));
      return;
    }

    if (params.get('department')) {
      var dept = params.get('department');
      var chip = dom.deptChips.querySelector('[data-dept="' + dept + '"]');
      if (chip) {
        dom.deptChips.querySelectorAll('.pl-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.activeFilters.department = dept;
      }
    }

    if (params.get('genre')) {
      var genreName = params.get('genre');
      // Store genre filter for gap analysis (applied during results rendering)
      state.activeFilters.genre = genreName;
    }

    loadInitialPages();
  }

  // ── Fetch: Initial Browse (multiple pages for better filter coverage) ──
  var INITIAL_BROWSE_PAGES = 3;

  async function loadInitialPages() {
    if (state.isLoading) return;
    state.isLoading = true;
    showState('loading');
    state.rawPages = [];
    state.currentResults = [];

    for (var page = 1; page <= INITIAL_BROWSE_PAGES; page++) {
      try {
        var cacheKey = 'orbit_library_browse_page_' + page;
        var data = getCachedPage(cacheKey);
        if (!data) {
          var url = TMDB_BASE + '/person/popular?api_key=' + TMDB_API_KEY + '&page=' + page;
          var resp = await fetch(url);
          if (!resp.ok) throw new Error('TMDB ' + resp.status);
          data = await resp.json();
          setCachedPage(cacheKey, data);
        }
        state.totalPages = Math.min(data.total_pages || 1, 500);
        state.currentPage = page;
        state.rawPages.push(...(data.results || []));
      } catch (err) {
        console.error('Failed to load page ' + page + ':', err);
        if (page === 1) { showState('error'); state.isLoading = false; return; }
      }
    }

    rebuildFilteredResults();
    showState('results');
    state.isLoading = false;
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
    if (state.findAllMode) deactivateFindAll();
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

  // ── Find All: Deep Browse ──

  var FINDALL_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> ';

  async function activateFindAll() {
    if (state.findAllMode || state.findAllLoading) return;

    state.curatedSnapshot = state.rawPages.slice();
    state.findAllMode = true;
    state.findAllLoading = true;
    dom.findAllBtn.classList.add('active', 'loading');
    dom.findAllBtn.innerHTML = FINDALL_SVG + 'Loading\u2026';

    updateResultSummary();

    var startPage = state.currentPage + 1;
    var endPage = 25;
    var BATCH_SIZE = 5;
    var BATCH_DELAY = 1200;

    for (var p = startPage; p <= endPage; p += BATCH_SIZE) {
      if (!state.findAllMode) break;

      var batch = [];
      for (var b = p; b < p + BATCH_SIZE && b <= endPage; b++) {
        batch.push(b);
      }

      var promises = batch.map(function (page) {
        var cacheKey = 'orbit_library_browse_page_' + page;
        var cached = getCachedPage(cacheKey);
        if (cached) return Promise.resolve(cached);

        var url = TMDB_BASE + '/person/popular?api_key=' + TMDB_API_KEY + '&page=' + page;
        return fetch(url).then(function (resp) {
          if (resp.status === 429) throw new Error('rate_limited');
          if (!resp.ok) return null;
          return resp.json();
        }).then(function (data) {
          if (data) setCachedPage(cacheKey, data);
          return data;
        }).catch(function (err) {
          if (err.message === 'rate_limited') throw err;
          return null;
        });
      });

      try {
        var results = await Promise.all(promises);
        results.forEach(function (data) {
          if (data && data.results) {
            state.rawPages.push.apply(state.rawPages, data.results);
          }
        });
        state.currentPage = batch[batch.length - 1];
        state.findAllPages = state.currentPage;
      } catch (err) {
        if (err.message === 'rate_limited') {
          await new Promise(function (r) { setTimeout(r, 3000); });
          p -= BATCH_SIZE;
          continue;
        }
      }

      rebuildFilteredResults();

      if (state.findAllMode && p + BATCH_SIZE <= endPage) {
        await new Promise(function (r) { setTimeout(r, BATCH_DELAY); });
      }
    }

    state.findAllLoading = false;
    if (state.findAllMode) {
      dom.findAllBtn.classList.remove('loading');
      dom.findAllBtn.innerHTML = FINDALL_SVG + 'Find All \u2713';
      rebuildFilteredResults();

      // Start awards roster build after pagination completes
      buildAwardsRoster().then(function (roster) {
        if (state.findAllMode && roster) {
          mergeAwardsRoster(roster);
        }
      });
    }
  }

  function deactivateFindAll() {
    state.findAllMode = false;
    state.findAllLoading = false;
    if (state.curatedSnapshot) {
      state.rawPages = state.curatedSnapshot;
      state.curatedSnapshot = null;
    }
    state.currentPage = INITIAL_BROWSE_PAGES;
    state.findAllPages = 0;
    dom.findAllBtn.classList.remove('active', 'loading');
    dom.findAllBtn.innerHTML = FINDALL_SVG + 'Find All';
    rebuildFilteredResults();
  }

  // ── Awards Roster Builder ──

  function getAwardsMoviesByImportance() {
    if (!awardsByMovie) return [];
    var movies = [];
    for (var movieId in awardsByMovie) {
      if (!awardsByMovie.hasOwnProperty(movieId)) continue;
      var entry = awardsByMovie[movieId];
      var festivals = {};
      (entry.awards || []).forEach(function (a) { festivals[a.festival] = true; });
      movies.push({
        id: Number(movieId),
        title: entry.title,
        awardCount: entry.awards ? entry.awards.length : 0,
        festivals: Object.keys(festivals)
      });
    }
    return movies.sort(function (a, b) { return b.awardCount - a.awardCount; });
  }

  async function buildAwardsRoster() {
    var movies = getAwardsMoviesByImportance().slice(0, 100);
    if (movies.length === 0) return null;

    var roster = {};
    var BATCH = 5;
    var DELAY = 1500;

    for (var i = 0; i < movies.length; i += BATCH) {
      if (!state.findAllMode) break;

      var batch = movies.slice(i, i + BATCH);
      var promises = batch.map(function (movie) {
        var cacheKey = 'orbit_movie_credits_' + movie.id;
        var cached = getCachedPage(cacheKey);
        if (cached) return Promise.resolve({ movie: movie, credits: cached });

        var url = TMDB_BASE + '/movie/' + movie.id + '/credits?api_key=' + TMDB_API_KEY;
        return fetch(url).then(function (r) {
          if (!r.ok) return null;
          return r.json();
        }).then(function (credits) {
          if (credits) setCachedPage(cacheKey, credits);
          return { movie: movie, credits: credits };
        }).catch(function () { return null; });
      });

      var results = await Promise.all(promises);
      results.forEach(function (result) {
        if (!result || !result.credits) return;
        var credits = result.credits;
        var movie = result.movie;

        var topCast = (credits.cast || []).slice(0, 3);
        var directors = (credits.crew || []).filter(function (c) { return c.job === 'Director'; });
        var people = topCast.concat(directors);

        people.forEach(function (person) {
          if (!person.id) return;
          if (roster[person.id]) {
            roster[person.id]._awardMovies.push(movie.id);
            movie.festivals.forEach(function (f) {
              if (roster[person.id]._awardFestivals.indexOf(f) === -1) {
                roster[person.id]._awardFestivals.push(f);
              }
            });
            return;
          }
          roster[person.id] = {
            id: person.id,
            name: person.name,
            profile_path: person.profile_path,
            known_for_department: person.known_for_department ||
              (directors.some(function (d) { return d.id === person.id; }) ? 'Directing' : 'Acting'),
            popularity: person.popularity || 0,
            known_for: [],
            _awardRoster: true,
            _awardMovies: [movie.id],
            _awardFestivals: movie.festivals.slice()
          };
        });
      });

      if (i + BATCH < movies.length) {
        await new Promise(function (r) { setTimeout(r, DELAY); });
      }
    }

    return roster;
  }

  function mergeAwardsRoster(roster) {
    var existingIds = {};
    state.rawPages.forEach(function (p) { existingIds[p.id] = true; });
    var newPeople = [];

    for (var id in roster) {
      if (!roster.hasOwnProperty(id)) continue;
      var numId = Number(id);
      if (existingIds[numId]) {
        state.rawPages.forEach(function (p) {
          if (p.id === numId) {
            p._awardRoster = true;
            p._awardFestivals = roster[id]._awardFestivals;
          }
        });
      } else {
        newPeople.push(roster[id]);
      }
    }

    if (newPeople.length > 0) {
      state.rawPages.push.apply(state.rawPages, newPeople);
      rebuildFilteredResults();
    }
  }

  // ── Filter + Sort pipeline ──
  function rebuildFilteredResults() {
    let people = [...state.rawPages];
    people = applyFilters(people);
    people = applySorting(people);
    state.currentResults = people;
    renderGrid();
    // Auto-load more if filters reduced results too much
    setTimeout(checkAutoLoadMore, 100);
  }

  function checkAutoLoadMore() {
    // Only auto-load in default browse mode
    if (state.isSearchMode || state.orbitMode || state.collectionMode || state.circleMode || state.findAllMode) return;
    if (state.isLoading) return;
    if (state.currentPage >= state.totalPages || state.currentPage >= 8) return;
    // If any filter is active and results are too few, load more
    var hasActiveFilter = state.activeFilters.era || state.activeFilters.awards.length > 0 ||
                          (state.activeFilters.department && state.activeFilters.department !== 'Acting');
    if (hasActiveFilter && state.currentResults.length < 6 && state.rawPages.length > 0) {
      fetchPopularPeople(state.currentPage + 1);
    }
  }

  function applyFilters(people) {
    people = filterByDepartment(people, state.activeFilters.department);
    people = filterByAwards(people, state.activeFilters.awards);
    if (state.orbitMode && state.bookmarkedOnly) {
      people = people.filter(function (p) { return p.bookmarked; });
    }
    if (state.activeFilters.era) {
      people = filterByEra(people, state.activeFilters.era);
    }
    if (state.activeFilters.genre) {
      people = filterByGenre(people, state.activeFilters.genre);
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
    if (!festivals || festivals.length === 0) return people;
    return people.filter(function (person) {
      // Award roster people: check directly tagged festivals
      if (person._awardRoster && person._awardFestivals) {
        if (person._awardFestivals.some(function (f) { return festivals.indexOf(f) !== -1; })) {
          return true;
        }
      }
      var knownFor = person.known_for || [];
      return knownFor.some(function (item) {
        if (!awardsMovieIds.has(item.id)) return false;
        var entry = awardsByMovie[item.id];
        if (!entry || !entry.awards) return false;
        return entry.awards.some(function (award) {
          return festivals.indexOf(award.festival) !== -1;
        });
      });
    });
  }

  function filterByEra(people, decade) {
    var decadeNum = parseInt(decade, 10);
    if (isNaN(decadeNum)) return people;
    var profileCache = state.orbitMode ? getProfileCache() : null;
    return people.filter(function (p) {
      // In orbit mode, check profile cache filmography for decade presence
      if (profileCache) {
        var entry = profileCache[p.id];
        if (entry && entry.data && entry.data.filmography) {
          return entry.data.filmography.some(function (film) {
            if (!film.release_date) return false;
            var year = parseInt(film.release_date.substring(0, 4));
            return year >= decadeNum && year < decadeNum + 10;
          });
        }
      }
      var knownFor = p.known_for || [];
      return knownFor.some(function (item) {
        var rd = item.release_date || item.first_air_date || '';
        if (!rd) return false;
        var year = parseInt(rd.substring(0, 4), 10);
        return year >= decadeNum && year < decadeNum + 10;
      });
    });
  }

  function filterByGenre(people, genreName) {
    if (!genreName) return people;
    // Genre ID mapping (inverse of GENRE_MAP for lookup)
    var GENRE_IDS = {
      'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
      'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Family': 10751,
      'Fantasy': 14, 'History': 36, 'Horror': 27, 'Music': 10402,
      'Mystery': 9648, 'Romance': 10749, 'Sci-Fi': 878, 'Thriller': 53,
      'War': 10752, 'Western': 37
    };
    var genreId = GENRE_IDS[genreName];
    if (!genreId) return people;

    return people.filter(function (p) {
      var knownFor = p.known_for || [];
      return knownFor.some(function (item) {
        return (item.genre_ids || []).includes(genreId);
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
    if (key === 'encounters') {
      return people.slice().sort(function (a, b) {
        return (b.encounter_count || 0) - (a.encounter_count || 0);
      });
    }
    if (key === 'recent') {
      return people.slice().sort(function (a, b) {
        return (b.first_encountered || '').localeCompare(a.first_encountered || '');
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
      // Hide load more in collection/circle/orbit mode or during Find All loading
      if (state.collectionMode || state.circleMode || state.orbitMode || state.findAllLoading) {
        dom.loadMoreWrap.classList.add('hidden');
      } else if (state.findAllMode && !state.findAllLoading && state.currentPage >= 25 && state.currentPage < state.totalPages) {
        dom.loadMoreWrap.classList.remove('hidden');
        dom.loadMoreBtn.textContent = 'Load Even More';
        dom.loadMoreBtn.disabled = false;
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

    // Check if recently deceased
    var isMemorial = isRecentlyDeceased(id);
    if (isMemorial) {
      name = 'Remembering ' + name;
    }

    // Known-for titles (prefer movies, max 2)
    var knownFor = (person.known_for || []);
    var movies = knownFor.filter(function (k) { return k.media_type === 'movie'; });
    var shows  = knownFor.filter(function (k) { return k.media_type === 'tv'; });
    var titles = movies.concat(shows).slice(0, 2).map(function (k) {
      return esc(k.title || k.name || '');
    });
    var knownForText = titles.length
      ? 'Known for: ' + titles.join(', ')
      : (deptInfo ? deptInfo.label : '');

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
    var photoClass = 'pl-card-photo' + (isMemorial ? ' pl-card-photo--memorial' : '');
    if (photoUrl) {
      photoHtml = '<img class="' + photoClass + '" src="' + photoUrl + '" alt="' + name + '" loading="lazy">';
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
      awardsHtml = '<div class="pl-card-awards"><span class="og og-sm og-oscar"></span> \u00D7' + awardCount + '</div>';
    } else if (person._awardRoster) {
      awardsHtml = '<div class="pl-card-awards pl-card-awards--roster">\u2605</div>';
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
    if (isMemorial) {
      cardClasses += ' pl-card--memorial';
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
    if (state.orbitMode) {
      dom.resultSummary.textContent = state.currentResults.length + ' people in your orbit';
      dom.resultSummary.classList.remove('hidden');
      return;
    }
    var parts = [];
    if (state.collectionMode || state.circleMode) {
      dom.resultSummary.classList.add('hidden');
      return;
    } else if (state.findAllMode) {
      if (state.findAllLoading) {
        parts.push('Loading the full catalog\u2026 ' + state.rawPages.length + ' people fetched');
      } else {
        parts.push('Showing ' + state.currentResults.length + ' of ' + state.rawPages.length + ' people');
      }
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
      var totalBeforeAwards = filterByDepartment([...state.rawPages], state.activeFilters.department).length;
      parts.push('Showing ' + state.currentResults.length + ' of ' + totalBeforeAwards + ' with ' + state.activeFilters.awards.join('/') + ' awards');
    }
    if (state.activeFilters.era) {
      parts.push(state.activeFilters.era + 's era');
    }

    // Build summary with optional "Back to curated" link
    if (state.findAllMode) {
      dom.resultSummary.innerHTML = esc(parts.join(' \u00B7 ')) +
        ' <button class="pl-back-curated" id="plBackCurated">\u2190 Back to curated</button>';
      var backBtn = dom.resultSummary.querySelector('#plBackCurated');
      if (backBtn) {
        backBtn.addEventListener('click', function () { deactivateFindAll(); });
      }
    } else {
      dom.resultSummary.textContent = parts.join(' \u00B7 ');
    }
    dom.resultSummary.classList.remove('hidden');
  }

  // ── Context-Sensitive Empty States ──
  function updateEmptyState() {
    var titleEl = dom.empty.querySelector('.pl-empty-title');
    var textEl  = dom.empty.querySelector('.pl-empty-text');
    if (!titleEl || !textEl) return;

    if (state.orbitMode) {
      titleEl.textContent = 'No people match this filter';
      textEl.textContent = 'Try adjusting your filters or removing the Bookmarked filter.';
    } else if (state.isSearchMode) {
      titleEl.textContent = "No results for '" + state.searchQuery + "'";
      textEl.textContent = 'Check the spelling or try a different name.';
    } else if (state.activeFilters.era) {
      titleEl.textContent = 'No people found for the ' + state.activeFilters.era + 's';
      textEl.textContent = 'Try loading more people or selecting a different era.';
    } else if (state.activeFilters.awards.length > 0) {
      titleEl.textContent = 'No confirmed matches in current results';
      textEl.textContent = 'Try loading more people or searching by name.';
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

      if (state.orbitMode) {
        timer = setTimeout(function () { filterOrbitByName(val); }, 200);
        return;
      }

      if (val.length >= 2) {
        timer = setTimeout(function () { searchPeople(val, 1); }, SEARCH_DEBOUNCE);
      } else if (val.length === 0) {
        exitSearchMode();
      }
    });

    dom.searchClear.addEventListener('click', function () {
      dom.searchInput.value = '';
      dom.searchClear.classList.add('hidden');
      if (state.orbitMode) {
        filterOrbitByName('');
      } else {
        exitSearchMode();
      }
      dom.searchInput.focus();
    });
  }

  function filterOrbitByName(query) {
    if (!query) {
      state.rawPages = state.orbitPeople.slice();
    } else {
      var q = query.toLowerCase();
      state.rawPages = state.orbitPeople.filter(function (p) {
        return (p.name || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    rebuildFilteredResults();
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
    loadInitialPages();
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
      if (state.orbitMode || state.isSearchMode || state.findAllMode) {
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
      if (!chip) return;

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
    // Era chips are always interactive; when disabled flag is passed, just clear selection
    if (!enabled) {
      dom.eraChips.querySelectorAll('.pl-chip.active').forEach(function (chip) {
        chip.classList.remove('active');
      });
    }
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
      if (state.findAllMode) {
        // "Load Even More": extend Find All from page 26 to 50
        loadEvenMore();
        return;
      }
      var nextPage = state.currentPage + 1;
      if (state.isSearchMode) {
        searchPeople(state.searchQuery, nextPage);
      } else {
        fetchPopularPeople(nextPage);
      }
    });
  }

  async function loadEvenMore() {
    if (state.findAllLoading) return;
    state.findAllLoading = true;
    dom.loadMoreBtn.textContent = 'Loading\u2026';
    dom.loadMoreBtn.disabled = true;

    var startPage = state.currentPage + 1;
    var endPage = Math.min(startPage + 24, 50);
    var BATCH_SIZE = 5;
    var BATCH_DELAY = 1200;

    for (var p = startPage; p <= endPage; p += BATCH_SIZE) {
      if (!state.findAllMode) break;

      var batch = [];
      for (var b = p; b < p + BATCH_SIZE && b <= endPage; b++) {
        batch.push(b);
      }

      var promises = batch.map(function (page) {
        var cacheKey = 'orbit_library_browse_page_' + page;
        var cached = getCachedPage(cacheKey);
        if (cached) return Promise.resolve(cached);

        var url = TMDB_BASE + '/person/popular?api_key=' + TMDB_API_KEY + '&page=' + page;
        return fetch(url).then(function (resp) {
          if (resp.status === 429) throw new Error('rate_limited');
          if (!resp.ok) return null;
          return resp.json();
        }).then(function (data) {
          if (data) setCachedPage(cacheKey, data);
          return data;
        }).catch(function (err) {
          if (err.message === 'rate_limited') throw err;
          return null;
        });
      });

      try {
        var results = await Promise.all(promises);
        results.forEach(function (data) {
          if (data && data.results) {
            state.rawPages.push.apply(state.rawPages, data.results);
          }
        });
        state.currentPage = batch[batch.length - 1];
      } catch (err) {
        if (err.message === 'rate_limited') {
          await new Promise(function (r) { setTimeout(r, 3000); });
          p -= BATCH_SIZE;
          continue;
        }
      }

      rebuildFilteredResults();

      if (state.findAllMode && p + BATCH_SIZE <= endPage) {
        await new Promise(function (r) { setTimeout(r, BATCH_DELAY); });
      }
    }

    state.findAllLoading = false;
    rebuildFilteredResults();
  }

  function bindFindAll() {
    if (!dom.findAllBtn) return;
    dom.findAllBtn.addEventListener('click', function () {
      if (state.findAllMode) {
        deactivateFindAll();
      } else {
        activateFindAll();
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

      sessionStorage.setItem('orbit_profile_referrer', window.location.href);
      window.location.href = 'people-profile.html?id=' + personId;
    });
  }

  function bindWelcome() {
    if (dom.welcomeBtn) {
      dom.welcomeBtn.addEventListener('click', dismissWelcome);
    }
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

    // Reset department filter to show all people in collection
    state.activeFilters.department = 'All';
    dom.deptChips.querySelectorAll('.pl-chip').forEach(function (c) {
      c.classList.toggle('active', c.dataset.dept === 'All');
    });

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

    // Reset department filter to show director + all collaborators
    state.activeFilters.department = 'All';
    dom.deptChips.querySelectorAll('.pl-chip').forEach(function (c) {
      c.classList.toggle('active', c.dataset.dept === 'All');
    });

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
        // Build known_for from combined_credits based on department
        var dept = person.known_for_department || '';
        var credits = person.combined_credits || {};
        var items = [];

        if (dept === 'Directing' && credits.crew) {
          items = credits.crew.filter(function (c) { return c.job === 'Director'; });
        } else if (dept === 'Writing' && credits.crew) {
          items = credits.crew.filter(function (c) {
            return c.job === 'Writer' || c.job === 'Screenplay' || c.job === 'Story' || c.department === 'Writing';
          });
        } else if (dept === 'Production' && credits.crew) {
          items = credits.crew.filter(function (c) {
            return c.job === 'Producer' || c.job === 'Executive Producer' || c.department === 'Production';
          });
        } else if (credits.cast) {
          items = credits.cast;
        }

        // Fallback to any available credits
        if (items.length === 0) {
          items = credits.cast || credits.crew || [];
        }

        // Prefer movies over TV — talk shows have inflated TMDB popularity
        var movieItems = items.filter(function (c) { return c.media_type === 'movie'; });
        if (movieItems.length >= 3) {
          items = movieItems;
        } else if (movieItems.length > 0) {
          // Mix: movies first, then fill with remaining items
          var tvItems = items.filter(function (c) { return c.media_type !== 'movie'; });
          items = movieItems.concat(tvItems);
        }

        normalized.known_for = items
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
      loadInitialPages();
    }
  }

  // ── Circle From Person (URL param) ──

  async function loadCircleFromPerson(personId) {
    exitSpecialMode(true);
    state.circleMode = 'person_' + personId;
    state.rawPages = [];
    state.currentResults = [];

    showState('loading');

    try {
      // Fetch person details
      var personUrl = TMDB_BASE + '/person/' + personId + '?api_key=' + TMDB_API_KEY;
      var personResp = await fetch(personUrl);
      if (!personResp.ok) throw new Error('Person fetch failed');
      var personData = await personResp.json();
      var personName = personData.name || 'Unknown';

      // Show banner
      dom.modeBannerText.textContent = personName + "'s Circle";
      dom.modeBanner.classList.remove('hidden');
      dom.searchBanner.classList.add('hidden');

      // Fetch movie credits
      var creditsUrl = TMDB_BASE + '/person/' + personId + '/movie_credits?api_key=' + TMDB_API_KEY;
      var creditsResp = await fetch(creditsUrl);
      if (!creditsResp.ok) throw new Error('Credits fetch failed');
      var creditsData = await creditsResp.json();

      // Get top 3 popular movies
      var allCredits = (creditsData.cast || []).concat(creditsData.crew || []);
      allCredits.sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); });
      var topMovies = allCredits.slice(0, 3);

      // Fetch credits for each top movie to find collaborators
      var collaboratorCounts = {};
      for (var i = 0; i < topMovies.length; i++) {
        var movie = topMovies[i];
        try {
          var movieCreditsUrl = TMDB_BASE + '/movie/' + movie.id + '/credits?api_key=' + TMDB_API_KEY;
          var mcResp = await fetch(movieCreditsUrl);
          if (!mcResp.ok) continue;
          var mcData = await mcResp.json();
          var castAndCrew = (mcData.cast || []).slice(0, 10).concat(
            (mcData.crew || []).filter(function (c) {
              return c.job === 'Director' || c.job === 'Writer' || c.job === 'Producer' || c.job === 'Screenplay';
            })
          );
          castAndCrew.forEach(function (person) {
            if (String(person.id) === String(personId)) return;
            if (!collaboratorCounts[person.id]) {
              collaboratorCounts[person.id] = { id: person.id, count: 0 };
            }
            collaboratorCounts[person.id].count++;
          });
        } catch (e) { /* skip */ }

        // Small delay to avoid rate limiting
        if (i < topMovies.length - 1) {
          await new Promise(function (r) { setTimeout(r, 200); });
        }
      }

      // Sort by collaboration count, take top 20
      var collabIds = Object.values(collaboratorCounts)
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 20)
        .map(function (c) { return c.id; });

      // Include the person themselves at the top
      collabIds.unshift(parseInt(personId, 10));

      await batchFetchPeople(collabIds);
    } catch (err) {
      console.error('Failed to load circle for person:', err);
      showState('error');
      state.isLoading = false;
    }
  }

  // ── My Orbit Toggle ──

  function bindToggle() {
    dom.toggleWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.pl-toggle-btn');
      if (!btn) return;
      var mode = btn.dataset.mode;
      if (mode === 'orbit' && !state.orbitMode) {
        enterOrbitMode();
      } else if (mode === 'all' && state.orbitMode) {
        exitOrbitMode();
      }
    });
  }

  function enterOrbitMode() {
    state.orbitMode = true;

    // Update toggle
    dom.toggleWrap.dataset.active = 'orbit';
    dom.toggleWrap.querySelectorAll('.pl-toggle-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.mode === 'orbit');
    });

    // Update header
    dom.title.textContent = 'MY ORBIT';
    var stats = window.OrbitEncounters ? window.OrbitEncounters.getEncounterStats() : { total_people: 0, total_encounters: 0 };
    dom.subtitle.textContent = stats.total_people + ' people discovered across ' + stats.total_encounters + ' encounters';

    // Show orbit sections, hide browse-only sections
    dom.orbitPanel.classList.remove('hidden');
    dom.exclusives.classList.add('hidden');
    dom.modeBanner.classList.add('hidden');
    dom.bookmarkGroup.classList.remove('hidden');
    if (dom.findAllGroup) dom.findAllGroup.classList.add('hidden');

    // Add orbit sort options
    addOrbitSortOptions();
    state.activeFilters.sort = 'encounters';
    dom.sortSelect.value = 'encounters';

    // Reset bookmarked filter
    state.bookmarkedOnly = false;
    dom.bookmarkChip.classList.remove('active');

    // Enable era chips in orbit mode
    enableEraChips(true);

    // Clear any search state
    dom.searchInput.value = '';
    dom.searchClear.classList.add('hidden');
    dom.searchBanner.classList.add('hidden');

    // Exit any special mode
    state.collectionMode = null;
    state.circleMode = null;
    state.isSearchMode = false;
    state.searchQuery = '';

    // Load orbit people
    loadOrbitPeople();
  }

  function exitOrbitMode() {
    state.orbitMode = false;
    state.orbitPeople = [];
    state.bookmarkedOnly = false;

    // Update toggle
    dom.toggleWrap.dataset.active = 'all';
    dom.toggleWrap.querySelectorAll('.pl-toggle-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.mode === 'all');
    });

    // Restore header
    dom.title.textContent = 'THE OBSERVATORY';
    dom.subtitle.textContent = 'View the stars';

    // Hide orbit sections, show browse sections
    dom.orbitPanel.classList.add('hidden');
    dom.orbitEncourage.classList.add('hidden');
    dom.exclusives.classList.remove('hidden');
    dom.bookmarkGroup.classList.add('hidden');
    if (dom.findAllGroup) dom.findAllGroup.classList.remove('hidden');

    // Remove orbit sort options
    removeOrbitSortOptions();
    state.activeFilters.sort = 'popularity';
    dom.sortSelect.value = 'popularity';

    // Disable era chips (back to browse default)
    enableEraChips(false);
    state.activeFilters.era = null;
    var eraActive = dom.eraChips.querySelector('.pl-chip.active');
    if (eraActive) eraActive.classList.remove('active');

    // Expand exclusives on desktop
    if (window.innerWidth > 650) {
      dom.exclusives.classList.add('expanded');
    }

    // Clear search
    dom.searchInput.value = '';
    dom.searchClear.classList.add('hidden');
    dom.searchBanner.classList.add('hidden');

    // Re-fetch popular people
    state.rawPages = [];
    state.currentPage = 1;
    loadInitialPages();
  }

  function addOrbitSortOptions() {
    var opt1 = document.createElement('option');
    opt1.value = 'encounters';
    opt1.textContent = 'Most Encountered';
    opt1.className = 'pl-orbit-sort-opt';

    var opt2 = document.createElement('option');
    opt2.value = 'recent';
    opt2.textContent = 'Recently Discovered';
    opt2.className = 'pl-orbit-sort-opt';

    dom.sortSelect.insertBefore(opt2, dom.sortSelect.firstChild);
    dom.sortSelect.insertBefore(opt1, dom.sortSelect.firstChild);
  }

  function removeOrbitSortOptions() {
    dom.sortSelect.querySelectorAll('.pl-orbit-sort-opt').forEach(function (o) { o.remove(); });
  }

  function bindBookmarkChip() {
    dom.bookmarkChip.addEventListener('click', function () {
      state.bookmarkedOnly = !state.bookmarkedOnly;
      dom.bookmarkChip.classList.toggle('active', state.bookmarkedOnly);
      rebuildFilteredResults();
    });
  }

  // ── Orbit People Loading ──

  function loadOrbitPeople() {
    if (!window.OrbitEncounters) {
      state.rawPages = [];
      state.currentResults = [];
      state.orbitPeople = [];
      renderGrid();
      return;
    }

    var encountered = window.OrbitEncounters.getEncountered();
    var people = [];

    Object.keys(encountered).forEach(function (id) {
      var p = encountered[id];
      people.push({
        id: parseInt(id, 10),
        name: p.name,
        profile_path: p.profile_path,
        known_for_department: p.known_for,
        known_for: [],
        popularity: p.encounter_count || 0,
        encounter_count: p.encounter_count || 0,
        sources: p.sources || [],
        bookmarked: !!p.bookmarked,
        first_encountered: p.first_encountered || '',
        last_encountered: p.last_encountered || ''
      });
    });

    state.rawPages = people;
    state.orbitPeople = people;

    // Encouraging message for sparse orbit
    if (people.length < 5) {
      dom.orbitEncourage.classList.remove('hidden');
    } else {
      dom.orbitEncourage.classList.add('hidden');
    }

    rebuildFilteredResults();
    showState('results');

    // Render map, gap analysis, and stats after panel is visible
    setTimeout(function () {
      renderDiscoveryMap(people);
      renderOrbitGenrePie(people);
      enrichGenreData(people); // background fetch, re-renders pie when done
      renderGapAnalysis(people);
      renderOrbitStats(people);
    }, 50);
  }

  // ── Discovery Map (Canvas) ──

  function renderDiscoveryMap(people) {
    var canvas = dom.mapCanvas;
    var container = canvas.parentElement;
    var width = container.clientWidth;
    if (width === 0) return;
    var height = window.innerWidth <= 650 ? 200 : 300;

    // Retina support
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Layout
    var padLeft = 45;
    var padRight = 15;
    var padTop = 15;
    var padBottom = 30;
    var plotW = width - padLeft - padRight;
    var plotH = height - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(0,217,255,0.05)';
    ctx.lineWidth = 1;

    var genreCount = MAP_GENRES.length;
    for (var i = 0; i <= genreCount; i++) {
      var gx = padLeft + (plotW * i / genreCount);
      ctx.beginPath();
      ctx.moveTo(gx, padTop);
      ctx.lineTo(gx, padTop + plotH);
      ctx.stroke();
    }

    var decadeCount = MAP_DECADES.length;
    for (var j = 0; j <= decadeCount; j++) {
      var gy = padTop + (plotH * j / decadeCount);
      ctx.beginPath();
      ctx.moveTo(padLeft, gy);
      ctx.lineTo(padLeft + plotW, gy);
      ctx.stroke();
    }

    // Genre labels (bottom)
    ctx.fillStyle = 'rgba(100,116,139,0.65)';
    ctx.font = (width < 500 ? '8' : '10') + 'px Barlow, sans-serif';
    ctx.textAlign = 'center';
    MAP_GENRES.forEach(function (genre, idx) {
      var lx = padLeft + (plotW * (idx + 0.5) / genreCount);
      var label = width < 500 ? genre.substring(0, 3) : genre;
      ctx.fillText(label, lx, height - 5);
    });

    // Decade labels (left)
    ctx.textAlign = 'right';
    ctx.font = '9px Barlow, sans-serif';
    MAP_DECADES.forEach(function (decade, idx) {
      var ly = padTop + (plotH * (idx + 0.5) / decadeCount);
      ctx.fillText(decade, padLeft - 6, ly + 3);
    });

    // Empty state (< 5 people)
    if (people.length < 5) {
      dom.mapOverlay.classList.remove('hidden');
      var placeholders = [
        { x: 0.2, y: 0.3 }, { x: 0.5, y: 0.6 },
        { x: 0.7, y: 0.4 }, { x: 0.4, y: 0.8 }
      ];
      placeholders.forEach(function (pt) {
        ctx.beginPath();
        ctx.arc(padLeft + pt.x * plotW, padTop + pt.y * plotH, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100,116,139,0.2)';
        ctx.fill();
      });
      canvas._dots = [];
      return;
    } else {
      dom.mapOverlay.classList.add('hidden');
    }

    // Get profile cache for positioning
    var profileCache = getProfileCache();

    // Calculate dot positions
    var dots = [];
    people.forEach(function (person) {
      var pos = getPersonMapPosition(person, profileCache, plotW, plotH, padLeft, padTop, genreCount, decadeCount);
      var size = Math.min(6 + 2 * (person.encounter_count || 1), 16);
      dots.push({
        x: pos.x,
        y: pos.y,
        size: size,
        name: person.name,
        id: person.id
      });
    });

    // Store dots for hover/click interaction
    canvas._dots = dots;

    // Draw dots with glow
    dots.forEach(function (dot) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,217,255,0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,217,255,0.7)';
      ctx.fill();
      ctx.restore();
    });
  }

  function getPeakDecade(filmography) {
    var decade = calcProminentDecade(filmography);
    return decade ? decade + 's' : null;
  }

  function getPersonMapPosition(person, profileCache, plotW, plotH, padLeft, padTop, genreCount, decadeCount) {
    var entry = profileCache[person.id];
    var genreIdx = -1;
    var decadeIdx = -1;

    if (entry && entry.data) {
      var data = entry.data;

      // Use genreBreakdown for top genre (already sorted descending)
      if (data.genreBreakdown && data.genreBreakdown.length > 0) {
        genreIdx = MAP_GENRES.indexOf(data.genreBreakdown[0].name);
      }

      // Use filmography to compute peak decade
      if (data.filmography && data.filmography.length > 0) {
        var peak = getPeakDecade(data.filmography);
        if (peak) decadeIdx = MAP_DECADES.indexOf(peak);
      }
    }

    // Fallback: seeded random based on person id
    if (genreIdx === -1) {
      var seed = person.id % 100 / 100;
      var dept = person.known_for_department || 'Acting';
      if (dept === 'Directing') {
        genreIdx = Math.floor(seed * 5) + 2;
      } else if (dept === 'Writing') {
        genreIdx = Math.floor(seed * 4);
      } else {
        genreIdx = Math.floor(seed * genreCount);
      }
    }

    if (decadeIdx === -1) {
      var seed2 = (person.id * 7) % 100 / 100;
      decadeIdx = Math.floor(seed2 * 0.4 * decadeCount + decadeCount * 0.4);
      decadeIdx = Math.min(decadeIdx, decadeCount - 1);
    }

    // Jitter to prevent overlap
    var jitterX = ((person.id * 13) % 20 - 10) / 20 * (plotW / genreCount * 0.7);
    var jitterY = ((person.id * 17) % 20 - 10) / 20 * (plotH / decadeCount * 0.7);

    var x = padLeft + (plotW * (genreIdx + 0.5) / genreCount) + jitterX;
    var y = padTop + (plotH * (decadeIdx + 0.5) / decadeCount) + jitterY;

    // Clamp within bounds
    x = Math.max(padLeft + 5, Math.min(padLeft + plotW - 5, x));
    y = Math.max(padTop + 5, Math.min(padTop + plotH - 5, y));

    return { x: x, y: y };
  }

  function bindMapInteraction() {
    var canvas = dom.mapCanvas;

    canvas.addEventListener('mousemove', function (e) {
      var dots = canvas._dots;
      if (!dots || dots.length === 0) return;

      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;

      var found = null;
      for (var i = dots.length - 1; i >= 0; i--) {
        var d = dots[i];
        var dx = mx - d.x;
        var dy = my - d.y;
        if (Math.sqrt(dx * dx + dy * dy) < Math.max(d.size, 10)) {
          found = d;
          break;
        }
      }

      if (found) {
        canvas.style.cursor = 'pointer';
        dom.mapTooltip.textContent = found.name;
        dom.mapTooltip.style.left = Math.min(found.x, canvas.clientWidth - 100) + 'px';
        dom.mapTooltip.style.top = (found.y - 24) + 'px';
        dom.mapTooltip.classList.remove('hidden');
      } else {
        canvas.style.cursor = '';
        dom.mapTooltip.classList.add('hidden');
      }
    });

    canvas.addEventListener('mouseleave', function () {
      dom.mapTooltip.classList.add('hidden');
      canvas.style.cursor = '';
    });

    canvas.addEventListener('click', function (e) {
      var dots = canvas._dots;
      if (!dots || dots.length === 0) return;

      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;

      for (var i = dots.length - 1; i >= 0; i--) {
        var d = dots[i];
        var dx = mx - d.x;
        var dy = my - d.y;
        if (Math.sqrt(dx * dx + dy * dy) < Math.max(d.size, 10)) {
          window.location.href = 'people-profile.html?id=' + d.id;
          return;
        }
      }
    });
  }

  // ── Orbit Genre Pie Chart ──

  function getGenreCache() {
    try {
      return JSON.parse(sessionStorage.getItem('orbit_genre_cache') || '{}');
    } catch (e) { return {}; }
  }

  function saveGenreCache(cache) {
    try {
      sessionStorage.setItem('orbit_genre_cache', JSON.stringify(cache));
    } catch (e) { /* ignore */ }
  }

  function renderOrbitGenrePie(people) {
    var panel = dom.genrePie;
    if (!panel) return;

    var profileCache = getProfileCache();
    var genreOnlyCache = getGenreCache();
    var genreCounts = {};
    var totalWithGenre = 0;
    var totalPeople = people.length;

    people.forEach(function (person) {
      // Check full profile cache first
      var entry = profileCache[person.id];
      if (entry && entry.data && entry.data.genreBreakdown && entry.data.genreBreakdown.length > 0) {
        var topGenre = entry.data.genreBreakdown[0].name;
        if (topGenre && topGenre !== 'Other') {
          genreCounts[topGenre] = (genreCounts[topGenre] || 0) + 1;
          totalWithGenre++;
        }
        return;
      }
      // Fall back to lightweight genre-only cache
      var genreEntry = genreOnlyCache[person.id];
      if (genreEntry && genreEntry.topGenre) {
        var tg = genreEntry.topGenre;
        if (tg !== 'Other') {
          genreCounts[tg] = (genreCounts[tg] || 0) + 1;
          totalWithGenre++;
        }
      }
    });

    // Minimum threshold: 5 people with genre data
    if (totalWithGenre < 5) {
      panel.innerHTML = '';
      return;
    }

    // Sort descending, take top 6, group rest as Other
    var sorted = Object.entries(genreCounts).sort(function (a, b) { return b[1] - a[1]; });
    var top = sorted.slice(0, 6);
    var otherCount = sorted.slice(6).reduce(function (sum, entry) { return sum + entry[1]; }, 0);
    if (otherCount > 0) top.push(['Other', otherCount]);

    // Build conic-gradient stops
    var cumPct = 0;
    var gradientStops = [];
    var legendItems = [];

    top.forEach(function (item) {
      var genre = item[0];
      var count = item[1];
      var pct = Math.round((count / totalWithGenre) * 100);
      var color = GENRE_NAME_COLORS[genre] || '#64748b';
      var startPct = cumPct;
      cumPct += pct;
      gradientStops.push(color + ' ' + startPct + '% ' + cumPct + '%');
      legendItems.push({ genre: genre, pct: pct, count: count, color: color });
    });

    // Adjust for rounding — ensure we reach 100%
    if (cumPct < 100 && gradientStops.length > 0) {
      var last = legendItems[legendItems.length - 1];
      gradientStops[gradientStops.length - 1] = last.color + ' ' + (cumPct - last.pct) + '% 100%';
    }

    var gradientCSS = 'conic-gradient(' + gradientStops.join(', ') + ')';

    var html = '<div class="pl-genre-pie-header">YOUR ORBIT GENRE DNA</div>';
    html += '<div class="pl-genre-pie-content">';

    // Donut
    var hasDiscrepancy = totalWithGenre < totalPeople;
    var centerCount = hasDiscrepancy ? (totalWithGenre + ' of ' + totalPeople) : ('' + totalWithGenre);
    var centerLabel = hasDiscrepancy ? 'people profiled' : 'people';

    html += '<div class="pl-genre-donut-wrap">';
    html += '<div class="pl-genre-donut" style="background: ' + gradientCSS + ';">';
    html += '<div class="pl-genre-donut-hole">';
    html += '<span class="pl-genre-donut-count">' + centerCount + '</span>';
    html += '<span class="pl-genre-donut-label">' + centerLabel + '</span>';
    html += '</div></div></div>';

    // Legend
    html += '<div class="pl-genre-legend">';
    legendItems.forEach(function (item) {
      html += '<div class="pl-genre-legend-row">';
      html += '<span class="pl-genre-legend-swatch" style="background:' + item.color + ';"></span>';
      html += '<span class="pl-genre-legend-name">' + esc(item.genre) + '</span>';
      html += '<span class="pl-genre-legend-pct">' + item.pct + '%</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '</div>'; // close pl-genre-pie-content

    // Explanation note when there's a discrepancy
    if (hasDiscrepancy) {
      html += '<p class="pl-genre-pie-note">Genre data available for profiled people. Visit more profiles to expand.</p>';
    }

    panel.innerHTML = html;
  }

  // ── Genre Enrichment (background fetch) ──

  var GENRE_ID_NAMES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
    10752: 'War', 37: 'Western'
  };

  function enrichGenreData(people) {
    if (!window.OrbitEncounters || !TMDB_API_KEY) return;

    var profileCache = getProfileCache();
    var genreOnlyCache = getGenreCache();

    // Find people who have no genre data in either cache
    var needsData = people.filter(function (person) {
      if (genreOnlyCache[person.id]) return false;
      var entry = profileCache[person.id];
      if (entry && entry.data && entry.data.genreBreakdown && entry.data.genreBreakdown.length > 0) return false;
      return true;
    });

    if (needsData.length === 0) return;

    var toFetch = needsData.slice(0, 20);
    var BATCH_SIZE = 5;
    var idx = 0;

    function fetchBatch() {
      var batch = toFetch.slice(idx, idx + BATCH_SIZE);
      if (batch.length === 0) return;

      Promise.all(batch.map(function (person) {
        return fetch(
          'https://api.themoviedb.org/3/person/' + person.id + '/movie_credits?api_key=' + TMDB_API_KEY
        )
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var genreCounts = {};
          (data.cast || []).forEach(function (movie) {
            (movie.genre_ids || []).forEach(function (gid) {
              var name = GENRE_ID_NAMES[gid];
              if (name) {
                genreCounts[name] = (genreCounts[name] || 0) + 1;
              }
            });
          });

          // Find dominant genre
          var entries = Object.entries(genreCounts).sort(function (a, b) { return b[1] - a[1]; });
          if (entries.length > 0) {
            genreOnlyCache[person.id] = {
              topGenre: entries[0][0],
              genres: genreCounts
            };
          }
        })
        .catch(function (err) {
          console.warn('Genre fetch failed for ' + person.id + ':', err);
        });
      })).then(function () {
        // Save after each batch
        saveGenreCache(genreOnlyCache);

        idx += BATCH_SIZE;
        if (idx < toFetch.length) {
          setTimeout(fetchBatch, 300);
        } else {
          // All done — re-render the pie with enriched data
          renderOrbitGenrePie(people);
        }
      });
    }

    fetchBatch();
  }

  // ── Gap Analysis Engine ──

  function analyzeGaps(encounteredPeople) {
    var profileCache = getProfileCache();
    var genreCounts = {};
    var eraCounts = {};
    var deptCounts = {};

    encounteredPeople.forEach(function (person) {
      var dept = person.known_for_department || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;

      var entry = profileCache[person.id];
      if (entry && entry.data) {
        var data = entry.data;
        if (data.genreBreakdown && data.genreBreakdown.length > 0) {
          data.genreBreakdown.forEach(function (g) {
            if (g.name !== 'Other') {
              genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
            }
          });
        }
        if (data.filmography) {
          var seenDecades = {};
          data.filmography.forEach(function (film) {
            if (!film.release_date) return;
            var year = parseInt(film.release_date.substring(0, 4));
            if (!year || year < 1920) return;
            var decade = Math.floor(year / 10) * 10 + 's';
            seenDecades[decade] = true;
          });
          for (var decade in seenDecades) {
            if (seenDecades.hasOwnProperty(decade)) {
              eraCounts[decade] = (eraCounts[decade] || 0) + 1;
            }
          }
        }
      }
    });

    var suggestions = [];

    // Genre gaps
    var allGenres = ['Drama', 'Comedy', 'Action', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];
    var weakGenres = allGenres.filter(function (g) { return (genreCounts[g] || 0) < 3; });
    if (weakGenres.length > 0) {
      suggestions.push({
        text: 'Your orbit is light on ' + weakGenres.slice(0, 2).join(' and ') + ' \u2014 explore these genres to broaden your constellation.',
        filters: { genre: weakGenres[0] }
      });
    }

    // Department gaps
    if (!deptCounts['Directing'] || deptCounts['Directing'] < 3) {
      suggestions.push({
        text: "You've met many actors but few directors. The minds behind the camera are worth discovering.",
        filters: { department: 'Directing' }
      });
    }

    // Era gaps
    var decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
    var weakDecades = decades.filter(function (d) { return (eraCounts[d] || 0) < 2; });
    if (weakDecades.length > 0 && weakDecades.length < 6) {
      var oldDecades = weakDecades.filter(function (d) { return parseInt(d, 10) < 1990; });
      if (oldDecades.length > 0) {
        suggestions.push({
          text: "Classic cinema awaits \u2014 you haven't explored much from the " + oldDecades[0] + ". Legends are waiting.",
          filters: { era: oldDecades[0] }
        });
      }
    }

    return suggestions.slice(0, 3);
  }

  function renderGapAnalysis(people) {
    var panel = dom.gapAnalysis;

    if (people.length < 10) {
      var hasCachedProfiles = false;
      var profileCache = getProfileCache();
      people.forEach(function (p) {
        if (profileCache[p.id]) hasCachedProfiles = true;
      });
      if (!hasCachedProfiles) {
        panel.innerHTML = '<div class="pl-gap-header">ORBIT INSIGHTS</div>' +
          '<div class="pl-gap-card"><p class="pl-gap-text">Keep exploring to unlock personalized recommendations.</p></div>';
        return;
      }
    }

    var suggestions = analyzeGaps(people);

    if (suggestions.length === 0) {
      panel.innerHTML = '<div class="pl-gap-header">ORBIT INSIGHTS</div>' +
        '<div class="pl-gap-card"><p class="pl-gap-text">Your orbit is impressively well-rounded! Keep discovering.</p></div>';
      return;
    }

    var html = '<div class="pl-gap-header">ORBIT INSIGHTS</div>';
    suggestions.forEach(function (s) {
      html += '<div class="pl-gap-card">' +
        '<p class="pl-gap-text">' + esc(s.text) + '</p>' +
        '<button class="pl-gap-explore" data-dept="' + esc(s.filters.department || '') + '" data-era="' + esc(s.filters.era || '') + '">Explore \u203A</button>' +
      '</div>';
    });
    panel.innerHTML = html;

    // Bind explore buttons — switch to All People with suggested filter
    panel.querySelectorAll('.pl-gap-explore').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dept = btn.dataset.dept;
        exitOrbitMode();
        if (dept) {
          var chip = dom.deptChips.querySelector('[data-dept="' + dept + '"]');
          if (chip) chip.click();
        }
      });
    });
  }

  // ── Collection Stats Summary ──

  function renderOrbitStats(people) {
    if (people.length === 0) {
      dom.orbitStats.innerHTML = '';
      return;
    }

    var stats = window.OrbitEncounters ? window.OrbitEncounters.getEncounterStats() : null;
    if (!stats) return;

    // Source breakdown bars
    var totalEnc = stats.total_encounters || 1;
    var sourceBars = '';
    var breakdown = stats.sources_breakdown || {};
    for (var src in breakdown) {
      if (breakdown.hasOwnProperty(src)) {
        var count = breakdown[src];
        var pct = Math.max((count / totalEnc) * 100, 3);
        var color = SOURCE_COLORS[src] || '#64748b';
        sourceBars += '<span class="pl-stat-bar-seg" style="width:' + pct + '%;background:' + color + '" title="' + esc(src) + ': ' + count + '"></span>';
      }
    }

    // Most explored
    var mostExplored = '';
    if (stats.top_encountered && stats.top_encountered.length > 0) {
      var top = stats.top_encountered[0];
      mostExplored = '<span class="pl-stat-item">Most explored: <strong>' + esc(top.name) + '</strong> (' + top.count + ' encounters)</span>';
    }

    // Latest discovery
    var latest = '';
    var sortedByRecent = people.slice().sort(function (a, b) {
      return (b.first_encountered || '').localeCompare(a.first_encountered || '');
    });
    if (sortedByRecent.length > 0) {
      var latestPerson = sortedByRecent[0];
      var dateStr = '';
      if (latestPerson.first_encountered) {
        dateStr = ' (' + new Date(latestPerson.first_encountered).toLocaleDateString() + ')';
      }
      latest = '<span class="pl-stat-item">Latest discovery: <strong>' + esc(latestPerson.name) + '</strong>' + dateStr + '</span>';
    }

    dom.orbitStats.innerHTML =
      '<div class="pl-stat-row">' +
        '<span class="pl-stat-item">Discovered via:</span>' +
        '<div class="pl-stat-bar">' + sourceBars + '</div>' +
      '</div>' +
      '<div class="pl-stat-row">' +
        mostExplored +
        latest +
      '</div>';
  }

  // ── Profile Cache Helper ──

  function getProfileCache() {
    try {
      return JSON.parse(localStorage.getItem('orbit_people_profiles_v2') || '{}');
    } catch (e) { return {}; }
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
