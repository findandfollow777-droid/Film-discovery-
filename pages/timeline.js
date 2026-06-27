/* ============================================
   ORBIT - SACRED TIMELINE
   Full viewport, dramatic staircase, pulsing lines
============================================ */

// State
let people = [];
let allMovies = [];
let allTvShows = [];
let filteredMovies = [];
let currentSort = "chronology";
let isReversed = false;
let currentMovieData = null;
let currentFlipSide = 1;
let searchTimeout = null;
let lastChronoSorted = []; // Store for redrawing sacred line
let currentMediaMode = 'movies'; // 'movies', 'tv', 'both'
let showGuestAppearances = false; // Exclude guest appearances by default
let hasRenderedOnce = false; // Suppress entrance animation on first mount
let lastActionWasReverse = false; // Reverse-button paired-flip flag (one-shot)
let lastActionWasRanked = false; // Ranked-sort two-phase flip flag (one-shot)
let lastActionWasDelete = false; // Gap-close slide flag (one-shot)
let cardPositionSnapshot = null; // {movieId: leftPx} snapshot before clear

// Randomized gradient for this session
let currentGradientId = "lineGrad" + (Math.floor(Math.random() * 4) + 1);

// DOM Elements
let timelineTitle, timelineSubtitle, movieCount;
let timelineTrack, multiTracks, timelineViewport;
let sacredSvg, sacredLines;
let decadeFilter, yearFilter, ratingFilter, reverseBtn;
let genreFilterTrigger, genreFilterPanel;
const selectedGenres = new Set();
let billingFilter, roleFilter, excludeSelfCheckbox, featureFilmsOnly;
let upcomingSection, upcomingTrack;
let addPersonBtn, vennBtn, bioBtn, orbitLabels;
let addPersonModal, personSearch, searchResults, orbitChips, modalConfirm, modalCancel, modalClose;
let popupOverlay, popupClose, flipCard;
let timelineMinimap, minimapCanvas, minimapViewport;
let popupPoster, popupTitle, popupYear, popupRating, popupRuntime, popupSynopsis, popupPeople, popupBoxOffice;
let trailerBtn, anchorBtn, triviaQuestions;
let trailerOverlay, trailerClose, trailerContainer;
let emptyState;

// Initialize
document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", OrbitUtils.debounce(renderCurrentView, 200));

// ── Timeline scroll persistence ──
// Saves scrollLeft to sessionStorage as the user scrolls so that returning to
// this timeline (after a Movie Cube nav or page reload within the same tab)
// restores the scroll position rather than snapping back to the start.
function getTimelineScrollKey() {
  const type = localStorage.getItem("timelineType") || "anon";
  const id = localStorage.getItem("timelineMovieId") || "0";
  return `orbit_timeline_scroll:${type}:${id}`;
}
let _timelineScrollRestorePending = true;
function restoreTimelineScrollOnce(maxScroll) {
  if (!_timelineScrollRestorePending || !timelineViewport) return;
  _timelineScrollRestorePending = false;
  try {
    const raw = sessionStorage.getItem(getTimelineScrollKey());
    const saved = parseFloat(raw);
    if (!isNaN(saved) && saved > 0) {
      requestAnimationFrame(() => {
        timelineViewport.scrollLeft = Math.min(saved, maxScroll);
      });
    }
  } catch (e) { /* sessionStorage unavailable */ }
}

function init() {
  // Embed mode: hide chrome when loaded in an iframe
  const urlParams0 = new URLSearchParams(window.location.search);
  if (urlParams0.get('embed') === '1') {
    document.body.classList.add('timeline-embed-mode');
  }

  initBackground();

  cacheElements();

  // Initialize the shared movie cube component
  initMovieCube({
    onPersonClick: (personId) => {
      if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
    },
    onAnchorClick: (movie) => {
      localStorage.setItem("anchorMovie", JSON.stringify(movie));
      localStorage.removeItem("anchorFromResults");
      window.location.href = "anchor-point.html";
    }
  });
  if (typeof initPeopleCube === 'function') initPeopleCube();

  // Show "Back to Results" link if coming from results page
  const backToResults = document.getElementById("backToResults");
  if (localStorage.getItem("returnToResults") === "true" && backToResults) {
    backToResults.hidden = false;
    localStorage.removeItem("returnToResults"); // Clear after showing
  }

  // Show "Back to Profile" link if coming from Stellar Catalog profile
  const returnToProfileId = localStorage.getItem('returnToProfile');
  if (returnToProfileId) {
    localStorage.removeItem('returnToProfile');
    if (backToResults) {
      backToResults.hidden = false;
      backToResults.href = '../people-profile.html?id=' + returnToProfileId;
      backToResults.textContent = '\u2190 Back to Profile';
    }
  }

  // Check for URL parameters (from game or direct link)
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const searchType = urlParams.get('type');
  
  const openCubeId = urlParams.get('openCube');

  if (searchQuery && searchType) {
    // Load from URL parameter search
    loadFromUrlSearch(searchQuery, searchType);
  } else {
    loadInitialData().then(() => {
      if (openCubeId) {
        openMovieCube(parseInt(openCubeId));
      }
    });
  }
  
  setupEventListeners();
}

// Load timeline from URL search parameter (from game navigation)
async function loadFromUrlSearch(query, type) {
  try {
    if (type === 'person') {
      // Search for person and load their timeline
      const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const person = data.results[0]; // Take first result
        localStorage.setItem("timelineMovieId", person.id);
        localStorage.setItem("timelineType", "person");
        await loadPersonTimeline(person.id);

        // Load additional people from profile page shared timeline
        const pendingPeople = localStorage.getItem('timelinePendingPeople');
        if (pendingPeople) {
          localStorage.removeItem('timelinePendingPeople');
          try {
            const pendingIds = JSON.parse(pendingPeople);
            for (const pid of pendingIds) {
              await addPerson(parseInt(pid));
            }
          } catch (e) {
            console.error('Failed to load pending people:', e);
          }
        }
      } else {
        showEmpty(`No results found for "${query}"`);
      }
    } else if (type === 'movie') {
      // Search for movie and load its timeline
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const movie = data.results[0]; // Take first result
        localStorage.setItem("timelineMovieId", movie.id);
        localStorage.setItem("timelineType", "movie");
        await loadMovieTimeline(movie.id);
      } else {
        showEmpty(`No results found for "${query}"`);
      }
    } else if (type === 'tv') {
      const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const show = data.results[0];
        localStorage.setItem("timelineMovieId", show.id);
        localStorage.setItem("timelineType", "tv");
        await loadTVShowTimeline(show.id);
      } else {
        showEmpty(`No results found for "${query}"`);
      }
    }
  } catch (err) {
    console.error("URL search error:", err);
    showEmpty("Failed to load from search.");
  }
}

function cacheElements() {
  timelineTitle = document.getElementById("timelineTitle");
  timelineSubtitle = document.getElementById("timelineSubtitle");
  movieCount = document.getElementById("movieCount");
  timelineTrack = document.getElementById("timelineTrack");
  multiTracks = document.getElementById("multiTracks");
  timelineViewport = document.getElementById("timelineViewport");
  sacredSvg = document.getElementById("sacredSvg");
  sacredLines = document.getElementById("sacredLines");
  decadeFilter = document.getElementById("decadeFilter");
  yearFilter = document.getElementById("yearFilter");
  ratingFilter = document.getElementById("ratingFilter");
  genreFilterTrigger = document.getElementById("genreFilterTrigger");
  genreFilterPanel = document.getElementById("genreFilterPanel");
  initGenreFilterUI();
  reverseBtn = document.getElementById("reverseBtn");
  billingFilter = document.getElementById("billingFilter");
  roleFilter = document.getElementById("roleFilter");
  excludeSelfCheckbox = document.getElementById("excludeSelf");
  if (excludeSelfCheckbox) excludeSelfCheckbox.checked = true; // Default to checked
  featureFilmsOnly = document.getElementById("featureFilmsOnly");
  upcomingSection = document.getElementById("upcomingSection");
  upcomingTrack = document.getElementById("upcomingTrack");
  addPersonBtn = document.getElementById("addPersonBtn");
  vennBtn = document.getElementById("vennBtn");
  bioBtn = document.getElementById("bioBtn");
  orbitLabels = document.getElementById("orbitLabels");
  addPersonModal = document.getElementById("addPersonModal");
  personSearch = document.getElementById("personSearch");
  searchResults = document.getElementById("searchResults");
  orbitChips = document.getElementById("orbitChips");
  modalConfirm = document.getElementById("modalConfirm");
  modalCancel = document.getElementById("modalCancel");
  modalClose = document.getElementById("modalClose");
  popupOverlay = document.getElementById("popupOverlay");
  popupClose = document.getElementById("popupClose");
  flipCard = document.getElementById("flipCard");
  timelineMinimap = document.getElementById("timelineMinimap");
  minimapCanvas = document.getElementById("minimapCanvas");
  minimapViewport = document.getElementById("minimapViewport");
  popupPoster = document.getElementById("popupPoster");
  popupTitle = document.getElementById("popupTitle");
  popupYear = document.getElementById("popupYear");
  popupRating = document.getElementById("popupRating");
  popupRuntime = document.getElementById("popupRuntime");
  popupSynopsis = document.getElementById("popupSynopsis");
  popupPeople = document.getElementById("popupPeople");
  popupBoxOffice = document.getElementById("popupBoxOffice");
  trailerBtn = document.getElementById("trailerBtn");
  anchorBtn = document.getElementById("anchorBtn");
  triviaQuestions = document.getElementById("triviaQuestions");
  trailerOverlay = document.getElementById("trailerOverlay");
  trailerClose = document.getElementById("trailerClose");
  trailerContainer = document.getElementById("trailerContainer");
  emptyState = document.getElementById("emptyState");
}

// ============================================
// DATA LOADING
// ============================================

async function loadInitialData() {
  // Check if coming back from Venn with multiple people
  const vennPeople = localStorage.getItem("vennPeople");
  const timelineId = localStorage.getItem("timelineMovieId");
  const timelineType = localStorage.getItem("timelineType") || "movie";
  
  // If we have vennPeople stored, restore that state instead of reloading single person
  if (vennPeople) {
    try {
      const storedPeople = JSON.parse(vennPeople);
      if (storedPeople && storedPeople.length > 0) {
        people = storedPeople;
        allMovies = people.flatMap(p => p.movies || []);
        allTvShows = people.flatMap(p => p.tvShows || []);
        
        if (people.length === 1) {
          timelineTitle.textContent = people[0].name;
          const mc = (people[0].movies || []).length;
          const tc = (people[0].tvShows || []).length;
          const parts = [];
          if (mc) parts.push(`${mc} Films`);
          if (tc) parts.push(`${tc} Shows`);
          timelineSubtitle.textContent = `${people[0].role || 'Filmography'} • ${parts.join(' • ') || '0 titles'}`;
          if (vennBtn) vennBtn.hidden = true;
          if (bioBtn) bioBtn.hidden = false;
        } else {
          timelineTitle.textContent = "Gravitational Crossings";
          timelineSubtitle.textContent = people.map(p => p.name).join(" × ");
          if (vennBtn) vennBtn.hidden = false;
          if (bioBtn) bioBtn.hidden = true;
        }

        updateMediaModeToggleVisibility();
        processAndRender();
        return;
      }
    } catch (e) {
      console.error("Failed to restore vennPeople:", e);
    }
  }
  
  if (!timelineId) {
    showEmpty("No timeline data found.");
    return;
  }
  
  try {
    if (timelineType === "person") {
      await loadPersonTimeline(timelineId);
    } else if (timelineType === "movie") {
      await loadMovieTimeline(timelineId);
    } else if (timelineType === "tv") {
      await loadTVShowTimeline(timelineId);
    }
  } catch (err) {
    console.error("Load error:", err);
    showEmpty("Failed to load timeline.");
  }
}

async function loadPersonTimeline(personId) {
  // Clear vennPeople since we're loading a fresh person
  localStorage.removeItem("vennPeople");
  
  const personRes = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`);
  const person = await personRes.json();

  // Log encounter
  if (window.OrbitEncounters && person) {
    window.OrbitEncounters.logEncounter({
      id: person.id,
      name: person.name,
      profile_path: person.profile_path,
      known_for_department: person.known_for_department
    }, 'timeline');
  }

  // Fetch movie and TV credits in parallel
  const [creditsRes, tvCreditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`)
  ]);
  const credits = await creditsRes.json();
  const tvCredits = await tvCreditsRes.json();

  // Process credits with job tracking
  const { movies, primaryRole, availableRoles } = processCreditsWithJobs(credits);
  const basicTvShows = processTvCredits(tvCredits);
  const tvShows = await enrichTvShows(basicTvShows);

  people = [{
    id: person.id,
    name: person.name,
    role: primaryRole,
    availableRoles: availableRoles,
    profile: person.profile_path,
    movies: movies,
    tvShows: tvShows
  }];

  allMovies = movies;
  allTvShows = tvShows;

  timelineTitle.textContent = person.name;
  const mainCastShows = tvShows.filter(s => s.isMainCast);
  const totalCount = movies.length + mainCastShows.length;
  const countParts = [];
  if (movies.length) countParts.push(`${movies.length} Films`);
  if (mainCastShows.length) countParts.push(`${mainCastShows.length} Shows`);
  timelineSubtitle.textContent = `${primaryRole} • ${countParts.join(' • ') || '0 titles'}`;

  // Show bio button for single person view
  if (bioBtn) bioBtn.hidden = false;

  // Update role filter visibility based on available roles
  updateRoleFilterOptions();

  // Update media mode toggle and count label
  updateMediaModeToggleVisibility();

  processAndRender();
}

// Helper to categorize crew jobs into role groups
function categorizeJob(job) {
  if (!job) return null;
  const j = job.toLowerCase();
  if (j === 'director') return 'directing';
  if (j.includes('producer')) return 'producing';
  if (j === 'writer' || j === 'screenplay' || j === 'story' || j.includes('written by')) return 'writing';
  if (j === 'cinematographer' || j === 'director of photography') return 'cinematography';
  if (j === 'composer' || j === 'original music composer') return 'music';
  if (j === 'editor') return 'editing';
  return 'other_crew';
}

// Process TV credits into a deduplicated list of shows (simplified - one tile per show)
function processTvCredits(tvCredits) {
  const showsMap = new Map();

  (tvCredits.cast || []).forEach(credit => {
    const showId = credit.id;
    if (!showsMap.has(showId)) {
      showsMap.set(showId, {
        id: showId,
        name: credit.name,
        poster_path: credit.poster_path,
        first_air_date: credit.first_air_date,
        vote_average: credit.vote_average,
        character: credit.character,
        episode_count: credit.episode_count || 0,
        media_type: 'tv',
        roles: ['acting']
      });
    } else {
      // Same show, different role - add episode counts and combine characters
      const existing = showsMap.get(showId);
      existing.episode_count += credit.episode_count || 0;
      if (credit.character && existing.character && !existing.character.includes(credit.character)) {
        existing.character += `, ${credit.character}`;
      } else if (credit.character && !existing.character) {
        existing.character = credit.character;
      }
    }
  });

  (tvCredits.crew || []).forEach(credit => {
    const showId = credit.id;
    const role = categorizeJob(credit.job);
    if (!showsMap.has(showId)) {
      showsMap.set(showId, {
        id: showId,
        name: credit.name,
        poster_path: credit.poster_path,
        first_air_date: credit.first_air_date,
        vote_average: credit.vote_average,
        episode_count: credit.episode_count,
        media_type: 'tv',
        roles: role ? [role] : []
      });
    } else {
      const existing = showsMap.get(showId);
      if (role && !existing.roles.includes(role)) existing.roles.push(role);
      existing.episode_count = Math.max(existing.episode_count || 0, credit.episode_count || 0);
    }
  });

  // Normalize fields so TV shows work in the movie pipeline
  return Array.from(showsMap.values()).map(show => ({
    ...show,
    title: show.name,
    release_date: show.first_air_date,
    // TV shows use roles array instead of jobCategories
    jobCategories: show.roles
  }));
}

// Enrich TV shows with total episode count and year range for display
async function enrichTvShows(tvShows) {
  const shows = tvShows.filter(s => s.first_air_date);

  // Fetch all show details in parallel (batched to avoid rate limits)
  const BATCH_SIZE = 8;
  const enriched = [];

  for (let i = 0; i < shows.length; i += BATCH_SIZE) {
    const batch = shows.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(async (show) => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${TMDB_API_KEY}`);
        const details = await res.json();

        const totalEpisodes = details.number_of_episodes || 1;
        const actorEpisodes = show.episode_count || 0;
        const isMainCast = actorEpisodes >= (totalEpisodes * 0.25);

        const startYear = show.first_air_date ? parseInt(show.first_air_date.substring(0, 4)) : null;
        const endYear = details.last_air_date ? parseInt(details.last_air_date.substring(0, 4)) : startYear;
        const yearRange = startYear
          ? (endYear && endYear !== startYear ? `${startYear}-${endYear}` : `${startYear}`)
          : 'TBA';

        return {
          ...show,
          totalEpisodes,
          isMainCast,
          yearRange,
          lastAirDate: details.last_air_date,
          status: details.status
        };
      } catch (err) {
        const startYear = show.first_air_date ? parseInt(show.first_air_date.substring(0, 4)) : null;
        return {
          ...show,
          totalEpisodes: 1,
          isMainCast: true,
          yearRange: startYear ? `${startYear}` : 'TBA'
        };
      }
    }));
    enriched.push(...results);
  }

  return enriched;
}

// Process credits to track jobs per movie
function processCreditsWithJobs(credits) {
  const movieMap = new Map(); // movieId -> movie data with jobs
  const roleCount = { acting: 0, directing: 0, producing: 0, writing: 0, other_crew: 0 };
  
  // Process cast entries
  (credits.cast || []).forEach(m => {
    if (!m.poster_path) return;
    
    if (!movieMap.has(m.id)) {
      movieMap.set(m.id, {
        ...m,
        billing_order: m.order ?? 999,
        character: m.character || '',
        jobs: [],
        jobCategories: new Set()
      });
    }
    
    const entry = movieMap.get(m.id);
    entry.jobs.push({ type: 'cast', role: m.character || 'Actor', order: m.order ?? 999 });
    entry.jobCategories.add('acting');
    
    // Use best billing order
    if ((m.order ?? 999) < entry.billing_order) {
      entry.billing_order = m.order ?? 999;
      entry.character = m.character || entry.character;
    }
    
    roleCount.acting++;
  });
  
  // Process crew entries
  (credits.crew || []).forEach(m => {
    if (!m.poster_path) return;
    
    if (!movieMap.has(m.id)) {
      movieMap.set(m.id, {
        ...m,
        billing_order: 999,
        character: m.job || '',
        jobs: [],
        jobCategories: new Set()
      });
    }
    
    const entry = movieMap.get(m.id);
    const category = categorizeJob(m.job);
    
    entry.jobs.push({ type: 'crew', role: m.job, department: m.department });
    if (category) {
      entry.jobCategories.add(category);
      roleCount[category] = (roleCount[category] || 0) + 1;
    }
    
    // If no character yet, use job title
    if (!entry.character || entry.character === '') {
      entry.character = m.job;
    }
  });
  
  // Convert map to array and jobCategories Set to Array
  const movies = Array.from(movieMap.values()).map(m => ({
    ...m,
    jobCategories: Array.from(m.jobCategories)
  }));
  
  // Determine primary role and available roles
  const sortedRoles = Object.entries(roleCount)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const availableRoles = sortedRoles.map(([role]) => role);
  
  // Determine primary role label
  let primaryRole = 'Filmmaker';
  if (sortedRoles.length > 0) {
    const top = sortedRoles[0][0];
    switch (top) {
      case 'acting': primaryRole = 'Actor'; break;
      case 'directing': primaryRole = 'Director'; break;
      case 'producing': primaryRole = 'Producer'; break;
      case 'writing': primaryRole = 'Writer'; break;
      case 'cinematography': primaryRole = 'Cinematographer'; break;
      case 'music': primaryRole = 'Composer'; break;
      case 'editing': primaryRole = 'Editor'; break;
      default: primaryRole = 'Filmmaker';
    }
  }
  
  return { movies, primaryRole, availableRoles };
}

// Update the role filter dropdown based on people's available roles
function updateRoleFilterOptions() {
  if (!roleFilter || !billingFilter) return;
  
  // Collect all available roles across all people
  const combinedRoles = new Set();
  let hasActors = false;
  let hasCrew = false;
  
  people.forEach(person => {
    (person.availableRoles || []).forEach(role => {
      combinedRoles.add(role);
      if (role === 'acting') hasActors = true;
      else hasCrew = true;
    });
  });
  
  // Build role filter options
  const roleLabels = {
    'acting': '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4v2"/></svg> Acting',
    'directing': '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg> Directing',
    'producing': '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg> Producing',
    'writing': '<span class="og og-writing"></span> Writing',
    'cinematography': '<span class="og og-camera"></span> Cinematography',
    'music': '<span class="og og-music"></span> Music',
    'editing': '<span class="og og-scissors"></span> Editing',
    'other_crew': '<span class="og og-film"></span> Other Crew'
  };
  
  let options = '<option value="all">All Roles</option>';
  
  // Add role options in logical order
  ['acting', 'directing', 'producing', 'writing', 'cinematography', 'music', 'editing', 'other_crew'].forEach(role => {
    if (combinedRoles.has(role)) {
      options += `<option value="${role}">${roleLabels[role]}</option>`;
    }
  });
  
  roleFilter.innerHTML = options;
  
  // Show/hide billing filter (only relevant for actors)
  // Show/hide role filter (only relevant if multiple role types exist)
  if (hasActors && !hasCrew) {
    // Pure actor(s) - show billing, hide role filter
    billingFilter.style.display = '';
    roleFilter.style.display = 'none';
  } else if (hasCrew && !hasActors) {
    // Pure crew - hide billing, show role filter
    billingFilter.style.display = 'none';
    roleFilter.style.display = '';
  } else {
    // Mixed or multi-role - show both
    billingFilter.style.display = '';
    roleFilter.style.display = '';
  }
  
  // Show "Exclude Self" only in multi-person mode
  const excludeSelfLabel = excludeSelfCheckbox?.closest('label');
  if (excludeSelfLabel) {
    excludeSelfLabel.style.display = people.length > 1 ? '' : 'none';
  }

  // For multi-person, show indicator of who each filter applies to
  updateFilterLabels();
}

// Update filter labels to show which person they apply to (multi-person mode)
function updateFilterLabels() {
  const roleFilterLabel = document.getElementById('roleFilterLabel');
  const billingFilterLabel = document.getElementById('billingFilterLabel');
  
  if (people.length > 1) {
    // Find which people are actors vs crew
    const actors = people.filter(p => (p.availableRoles || []).includes('acting'));
    const crew = people.filter(p => (p.availableRoles || []).some(r => r !== 'acting'));
    
    if (billingFilterLabel && actors.length > 0 && actors.length < people.length) {
      billingFilterLabel.textContent = `Billing (${actors.map(p => p.name.split(' ')[0]).join(', ')})`;
    }
    
    if (roleFilterLabel && crew.length > 0 && crew.length < people.length) {
      roleFilterLabel.textContent = `Role (${crew.map(p => p.name.split(' ')[0]).join(', ')})`;
    }
  } else {
    if (billingFilterLabel) billingFilterLabel.textContent = '';
    if (roleFilterLabel) roleFilterLabel.textContent = '';
  }
}

async function loadMovieTimeline(movieId) {
  const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
  const movie = await movieRes.json();
  
  timelineTitle.textContent = movie.title;
  
  let movies = [];
  
  if (movie.belongs_to_collection) {
    const collRes = await fetch(`https://api.themoviedb.org/3/collection/${movie.belongs_to_collection.id}?api_key=${TMDB_API_KEY}`);
    const collection = await collRes.json();
    movies = collection.parts || [];
    timelineSubtitle.textContent = collection.name;
  } else {
    // Standalone movie - show only this movie, no recommendations
    movies = [movie];
    timelineSubtitle.textContent = "Standalone Film";
  }
  
  // For collections, filter out entries without posters (unreleased etc.)
  // For standalone movies, always keep even without poster
  allMovies = movie.belongs_to_collection ? movies.filter(m => m.poster_path) : movies;
  people = [];

  processAndRender();
  applyMovieModeUI(movie.belongs_to_collection ? movie.belongs_to_collection.name : null);
}

// ============================================
// MOVIE MODE UI
// ============================================

const TMDB_GENRE_MAP = {
  28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
  99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
  27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',
  10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'
};

/* ============================================================
   GENRE MULTI-SELECT FILTER
   Custom checkbox-dropdown that mirrors .filter-select visually.
   Selection state lives in the module-level `selectedGenres` Set.
   OR semantics: a movie passes if it has any selected genre.
   ============================================================ */
function initGenreFilterUI() {
  if (!genreFilterTrigger || !genreFilterPanel) return;

  genreFilterTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    genreFilterPanel.hidden = !genreFilterPanel.hidden;
  });

  document.addEventListener('click', (e) => {
    if (!genreFilterPanel.hidden && !e.target.closest('#genreFilter')) {
      genreFilterPanel.hidden = true;
    }
  });
}

function populateGenreFilter(availableGenres) {
  if (!genreFilterPanel || !genreFilterTrigger) return;

  // Drop selections that are no longer in the visible credit set.
  for (const g of [...selectedGenres]) {
    if (!availableGenres.has(g)) selectedGenres.delete(g);
  }

  const sortedGenres = [...availableGenres]
    .filter(g => TMDB_GENRE_MAP[g])
    .sort((a, b) => TMDB_GENRE_MAP[a].localeCompare(TMDB_GENRE_MAP[b]));

  const rows = sortedGenres.map(g => {
    const checked = selectedGenres.has(g) ? 'checked' : '';
    return `<label class="multi-select-option">
      <input type="checkbox" value="${g}" ${checked}>
      <span>${TMDB_GENRE_MAP[g]}</span>
    </label>`;
  }).join('');

  genreFilterPanel.innerHTML = rows +
    '<button type="button" class="multi-select-clear">Clear All</button>';

  genreFilterPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = parseInt(cb.value);
      if (cb.checked) selectedGenres.add(id);
      else selectedGenres.delete(id);
      updateGenreTriggerLabel();
      applyFiltersAndSort();
    });
  });

  genreFilterPanel.querySelector('.multi-select-clear')?.addEventListener('click', () => {
    selectedGenres.clear();
    genreFilterPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateGenreTriggerLabel();
    applyFiltersAndSort();
  });

  updateGenreTriggerLabel();
}

function updateGenreTriggerLabel() {
  if (!genreFilterTrigger) return;
  const count = selectedGenres.size;
  if (count === 0) {
    genreFilterTrigger.textContent = 'All Genres';
    genreFilterTrigger.classList.remove('has-selection');
  } else if (count <= 2) {
    genreFilterTrigger.textContent = [...selectedGenres]
      .map(g => TMDB_GENRE_MAP[g]).filter(Boolean).join(', ');
    genreFilterTrigger.classList.add('has-selection');
  } else {
    genreFilterTrigger.textContent = `${count} genres`;
    genreFilterTrigger.classList.add('has-selection');
  }
}

function applyMovieModeUI(collectionName) {
  if (people.length > 0) return; // only in movie mode

  // Hide person-specific controls
  if (roleFilter) roleFilter.style.display = 'none';
  if (billingFilter) billingFilter.style.display = 'none';
  if (addPersonBtn) addPersonBtn.style.display = 'none';
  if (vennBtn) vennBtn.style.display = 'none';
  if (bioBtn) bioBtn.style.display = 'none';

  const excludeLabel = excludeSelfCheckbox?.closest('label');
  if (excludeLabel) excludeLabel.style.display = 'none';

  const guestFilter = document.getElementById('guestAppearancesFilter');
  if (guestFilter) guestFilter.style.display = 'none';

  const featuresLabel = featureFilmsOnly?.closest('label');
  if (featuresLabel) featuresLabel.style.display = 'none';

  const mediaModeToggle = document.getElementById('mediaModeToggle');
  if (mediaModeToggle) mediaModeToggle.style.display = 'none';

  // Show collection badge
  if (collectionName) {
    const controlsLeft = document.querySelector('.controls-left');
    if (controlsLeft && !controlsLeft.querySelector('.collection-badge')) {
      const badge = document.createElement('span');
      badge.className = 'collection-badge';
      badge.textContent = collectionName;
      controlsLeft.appendChild(badge);
    }
  }
}

async function loadTVShowTimeline(tvId) {
  const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`);
  const tvShow = await tvRes.json();

  timelineTitle.textContent = tvShow.name;

  const seasons = (tvShow.seasons || []).filter(s => s.season_number > 0); // exclude specials
  const totalEpisodes = seasons.reduce((sum, s) => sum + (s.episode_count || 0), 0);

  timelineSubtitle.textContent = `${seasons.length} Seasons · ${totalEpisodes} Episodes`;

  // Map seasons to card-compatible objects (same shape as movie objects)
  allMovies = seasons
    .filter(s => s.poster_path)
    .map(s => ({
      id: s.id,
      title: `Season ${s.season_number}`,
      poster_path: s.poster_path,
      release_date: s.air_date,
      vote_average: s.vote_average || tvShow.vote_average,
      popularity: tvShow.popularity,
      overview: s.overview,
      episode_count: s.episode_count
    }));

  people = [];
  processAndRender();
}



// ============================================
// MULTI-PERSON SUPPORT
// ============================================

let addPersonBusy = false;      // guard against concurrent adds
const addPersonInFlight = new Set(); // track in-flight person IDs

async function addPerson(personId) {
  if (people.length >= 4) {
    alert("Maximum 4 orbital paths allowed.");
    return;
  }

  if (people.find(p => p.id === personId) || addPersonInFlight.has(personId)) {
    return; // already added or currently loading
  }

  if (addPersonBusy) return; // one add at a time
  addPersonBusy = true;
  addPersonInFlight.add(personId);

  // Show loading indicator in the modal
  if (searchResults) {
    searchResults.innerHTML = '<div class="search-loading">Loading filmography\u2026</div>';
  }

  try {
    const personRes = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`);
    const person = await personRes.json();

    // Log encounter
    if (window.OrbitEncounters && person) {
      window.OrbitEncounters.logEncounter({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
        known_for_department: person.known_for_department
      }, 'timeline');
    }

    const [creditsRes, tvCreditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`)
    ]);
    const credits = await creditsRes.json();
    const tvCredits = await tvCreditsRes.json();

    // Process credits with job tracking
    const { movies, primaryRole, availableRoles } = processCreditsWithJobs(credits);
    const basicTvShows = processTvCredits(tvCredits);
    const tvShows = await enrichTvShows(basicTvShows);

    // Final duplicate check (in case user navigated away and back)
    if (people.find(p => p.id === personId)) return;

    people.push({
      id: person.id,
      name: person.name,
      role: primaryRole,
      availableRoles: availableRoles,
      profile: person.profile_path,
      movies: movies,
      tvShows: tvShows
    });

    // Update global movie and TV arrays for multi-person mode
    allMovies = people.flatMap(p => p.movies || []);
    allTvShows = people.flatMap(p => p.tvShows || []);

    // Update vennPeople when adding to ensure navigation preserves all actors
    localStorage.setItem("vennPeople", JSON.stringify(people));

    // Update role filter options for combined people
    updateRoleFilterOptions();

    updateMultiMode();
  } catch (err) {
    console.error("Add person error:", err);
  } finally {
    addPersonBusy = false;
    addPersonInFlight.delete(personId);
  }
}

function removePerson(personId) {
  people = people.filter(p => p.id !== personId);
  if (people.length === 0) {
    showEmpty("Add people to view their orbital paths.");
    return;
  }

  updateRoleFilterOptions();
  updateMultiMode();
}

function updateMultiMode() {
  if (people.length > 1) {
    timelineTitle.textContent = "Gravitational Crossings";
    timelineSubtitle.textContent = `${people.length} Orbital Paths`;
    if (vennBtn) vennBtn.hidden = false;
    if (bioBtn) bioBtn.hidden = true; // Hide bio in multi-person mode
  } else if (people.length === 1) {
    timelineTitle.textContent = people[0].name;
    const mc = (people[0].movies || []).length;
    const tc = (people[0].tvShows || []).length;
    const parts = [];
    if (mc) parts.push(`${mc} Films`);
    if (tc) parts.push(`${tc} Shows`);
    timelineSubtitle.textContent = `${people[0].role} • ${parts.join(' • ') || '0 titles'}`;
    if (vennBtn) vennBtn.hidden = true;
    if (bioBtn) bioBtn.hidden = false;
    allMovies = people[0].movies;
    allTvShows = people[0].tvShows || [];
  }

  // Update media mode toggle and count label
  updateMediaModeToggleVisibility();

  processAndRender();
}

// ============================================
// PROCESS & RENDER
// ============================================

function processAndRender() {
  // Build filters from source items (movies + TV shows)
  let allYears = new Set();
  let allDecades = new Set();
  let allGenres = new Set();

  // Apply media mode filter so dropdowns only show relevant decades/years
  let sourceMovies;
  if (people.length > 0) {
    sourceMovies = people.flatMap(p => {
      if (currentMediaMode === 'movies') return p.movies || [];
      if (currentMediaMode === 'tv') return p.tvShows || [];
      return [...(p.movies || []), ...(p.tvShows || [])];
    });
  } else {
    sourceMovies = [...allMovies, ...allTvShows];
  }

  // Apply the same content filters used by the timeline so dropdowns
  // only show decades/years where the actor has visible credits.
  // (Excludes: unreleased, self-roles, guest appearances, non-features,
  //  billing filter, role filter — but NOT date/decade/year/rating filters.)
  const today = new Date();
  const excludeSelf = excludeSelfCheckbox?.checked || false;
  const featuresOnly = featureFilmsOnly?.checked || false;
  const billingVal = billingFilter?.value || "all";
  const roleVal = roleFilter?.value || "all";
  const NON_FEATURE_GENRES = [99, 10770];

  sourceMovies.forEach(m => {
    const y = getYear(m);
    if (!y) return;
    // Exclude unreleased
    const date = m.release_date || m.first_air_date;
    if (date && new Date(date) > today) return;
    // Exclude features-only filter
    if (featuresOnly && (m.genre_ids || []).some(g => NON_FEATURE_GENRES.includes(g))) return;
    // Exclude self-roles
    if (excludeSelf) {
      const char = (m.character || '').toLowerCase();
      if (char.includes('himself') || char.includes('herself') ||
          char.includes('themselves') || char === 'self' ||
          char.includes('(self)') || char.includes('(himself)') || char.includes('(herself)')) return;
    }
    // Exclude guest appearances
    if (!showGuestAppearances && m.media_type === 'tv' && m.isMainCast === false) return;
    // Billing filter
    if (billingVal !== "all" && m.jobCategories?.includes('acting')) {
      const order = m.billing_order ?? m.order ?? 999;
      if (billingVal === "lead" && order !== 0) return;
      if (billingVal === "colead" && (order < 0 || order > 2)) return;
      if (billingVal === "supporting" && (order < 0 || order > 5)) return;
    }
    // Role filter
    if (roleVal !== "all" && !(m.jobCategories?.includes(roleVal))) return;

    allYears.add(y);
    allDecades.add(Math.floor(y / 10) * 10);
    (m.genre_ids || []).forEach(g => allGenres.add(g));
  });

  // Populate decade filter
  const decades = [...allDecades].sort((a, b) => b - a);
  if (decadeFilter) {
    decadeFilter.innerHTML = '<option value="all">All Decades</option>' +
      decades.map(d => `<option value="${d}">${d}s</option>`).join('');
  }

  // Populate year filter
  const years = [...allYears].sort((a, b) => b - a);
  if (yearFilter) {
    yearFilter.innerHTML = '<option value="all">All Years</option>' +
      years.map(y => `<option value="${y}">${y}</option>`).join('');
  }

  // Populate genre filter (only genres present in visible credits)
  populateGenreFilter(allGenres);
  
  applyFiltersAndSort();
  updateMediaModeToggleVisibility();
}

function applyFiltersAndSort() {
  const decadeVal = decadeFilter?.value || "all";
  const yearVal = yearFilter?.value || "all";
  const ratingVal = ratingFilter?.value || "all";
  const billingVal = billingFilter?.value || "all";
  const roleVal = roleFilter?.value || "all";
  const excludeSelf = excludeSelfCheckbox?.checked || false;
  const featuresOnly = featureFilmsOnly?.checked || false;
  
  const today = new Date();
  
  // Genre IDs to exclude for "Features Only"
  // 99 = Documentary, 10770 = TV Movie
  const NON_FEATURE_GENRES = [99, 10770];
  
  // Helper to check if movie/show is unreleased
  const isUnreleased = (m) => {
    const date = m.release_date || m.first_air_date;
    if (!date) return true;
    return new Date(date) > today;
  };
  
  // Helper to check if non-feature (documentary or TV movie)
  const isNonFeature = (m) => {
    const genres = m.genre_ids || [];
    return genres.some(g => NON_FEATURE_GENRES.includes(g));
  };
  
  // Helper to check if playing self
  const isSelf = (m) => {
    const char = (m.character || '').toLowerCase();
    return char.includes('himself') || char.includes('herself') ||
           char.includes('themselves') || char === 'self' ||
           char.includes('(self)') || char.includes('(himself)') || char.includes('(herself)');
  };

  // Helper to check if TV show is a guest appearance (not main cast)
  const isGuestAppearance = (m) => {
    // Only applies to TV shows
    if (m.media_type !== 'tv') return false;
    // If isMainCast is explicitly false, it's a guest appearance
    return m.isMainCast === false;
  };
  
  // Helper to check billing order (for acting roles)
  const passesBillingFilter = (m) => {
    if (billingVal === "all") return true;
    // Billing only applies if movie has acting role
    if (!m.jobCategories?.includes('acting')) return true;
    const order = m.billing_order ?? m.order ?? 999;
    switch (billingVal) {
      case "lead": return order === 0;
      case "colead": return order >= 0 && order <= 2;
      case "supporting": return order >= 0 && order <= 5;
      default: return true;
    }
  };
  
  // Helper to check role/job filter (for crew roles)
  const passesRoleFilter = (m) => {
    if (roleVal === "all") return true;
    // Check if movie has the selected job category
    return m.jobCategories?.includes(roleVal) || false;
  };
  

  const filterFn = (m) => {
    // Exclude unreleased from main timeline
    if (isUnreleased(m)) return false;

    // Features only filter (exclude documentaries and TV movies)
    if (featuresOnly && isNonFeature(m)) return false;

    // Genre filter (multi-select, OR semantics)
    if (selectedGenres.size > 0) {
      const genres = m.genre_ids || [];
      if (!genres.some(g => selectedGenres.has(g))) return false;
    }

    // Self exclusion filter
    if (excludeSelf && isSelf(m)) return false;

    // Guest appearances filter (for TV shows)
    if (!showGuestAppearances && isGuestAppearance(m)) return false;

    // Billing filter (for actors)
    if (!passesBillingFilter(m)) return false;
    
    // Role filter (for all job categories)
    if (!passesRoleFilter(m)) return false;
    
    // Date filters
    const year = getYear(m);
    if (decadeVal !== "all" && year) {
      const movieDecade = Math.floor(year / 10) * 10;
      if (movieDecade !== parseInt(decadeVal)) return false;
    }
    if (yearVal !== "all" && year !== parseInt(yearVal)) return false;
    if (ratingVal !== "all" && (m.vote_average || 0) < parseFloat(ratingVal)) return false;
    return true;
  };
  
  if (people.length <= 1) {
    // Single person mode (movies + TV shows) with media mode filtering
    let sourceItems;
    if (people.length === 1) {
      const personMovies = people[0].movies || [];
      const personTvShows = people[0].tvShows || [];

      // Apply media mode filter (simplified - one tile per TV show)
      if (currentMediaMode === 'movies') {
        sourceItems = personMovies;
      } else if (currentMediaMode === 'tv') {
        sourceItems = personTvShows;
      } else {
        sourceItems = [...personMovies, ...personTvShows];
      }
    } else {
      sourceItems = [...allMovies, ...allTvShows];
    }

    // Separate unreleased items (also apply features filter)
    const unreleasedMovies = sourceItems.filter(m =>
      isUnreleased(m) &&
      passesBillingFilter(m) &&
      (!excludeSelf || !isSelf(m)) &&
      (!featuresOnly || !isNonFeature(m))
    );
    renderUpcoming(unreleasedMovies);

    filteredMovies = sourceItems.filter(filterFn);
    sortMovies(filteredMovies);
    renderSingleTimeline();
  } else {
    // Multi-person mode - collect unreleased from all people
    let allUnreleased = [];

    people.forEach(person => {
      // Apply media mode filter in multi-person mode too
      let personItems;
      if (currentMediaMode === 'movies') {
        personItems = person.movies || [];
      } else if (currentMediaMode === 'tv') {
        personItems = person.tvShows || [];
      } else {
        personItems = [...(person.movies || []), ...(person.tvShows || [])];
      }

      const unreleased = personItems.filter(m =>
        isUnreleased(m) &&
        passesBillingFilter(m) &&
        (!excludeSelf || !isSelf(m)) &&
        (!featuresOnly || !isNonFeature(m))
      );
      allUnreleased.push(...unreleased);

      person.filteredMovies = personItems.filter(filterFn);
      sortMovies(person.filteredMovies);
    });

    // Dedupe unreleased by media_type + id
    const seenKeys = new Set();
    allUnreleased = allUnreleased.filter(m => {
      const key = `${m.media_type || 'movie'}-${m.id}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
    renderUpcoming(allUnreleased);

    renderMultiTimeline();
  }
}

function renderUpcoming(movies) {
  if (!upcomingSection || !upcomingTrack) return;

  if (movies.length === 0) {
    upcomingSection.hidden = true;
    upcomingSection.classList.remove('expanded');
    return;
  }

  upcomingSection.hidden = false;

  // Sort by release date
  movies.sort((a, b) => new Date(a.release_date || "9999") - new Date(b.release_date || "9999"));

  const limited = movies.slice(0, 10);

  // Update count badge on the toggle pill
  const countEl = document.getElementById('upcomingCount');
  if (countEl) countEl.textContent = limited.length;

  upcomingTrack.innerHTML = limited.map(movie => {
    const posterUrl = movie.poster_path
      ? `${TMDB_IMG}w185${movie.poster_path}`
      : 'https://placehold.co/140x210?text=?';
    const releaseDate = movie.release_date || 'TBA';

    return `
      <div class="upcoming-card" data-movie-id="${movie.id}">
        <img src="${posterUrl}" alt="${movie.title}">
        <div class="upcoming-info">
          <div class="title">${movie.title}</div>
          <div class="date"><span class="og og-calendar"></span> ${releaseDate}</div>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  upcomingTrack.querySelectorAll('.upcoming-card').forEach(card => {
    card.addEventListener('click', () => {
      openMovieCube(card.dataset.movieId);
    });
  });

  // Wire the Coming Soon toggle once
  const toggle = document.getElementById('upcomingToggle');
  if (toggle && !toggle.dataset.wired) {
    toggle.dataset.wired = '1';
    toggle.addEventListener('click', () => {
      const expanded = upcomingSection.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }
}
function sortMovies(arr) {
  const sortFn = getSortFunction();
  arr.sort(sortFn);
  if (isReversed) arr.reverse();
}

function getSortFunction() {
  switch (currentSort) {
    case "chronology":
      return (a, b) => new Date(a.release_date || "9999") - new Date(b.release_date || "9999");
    case "rating":
      return (a, b) => (b.vote_average || 0) - (a.vote_average || 0);
    case "boxoffice":
      return (a, b) => (b.popularity || 0) - (a.popularity || 0);
    default:
      return () => 0;
  }
}

function renderCurrentView() {
  if (people.length <= 1) {
    renderSingleTimeline();
  } else {
    renderMultiTimeline();
  }
}

// ============================================
// SINGLE TIMELINE (Full viewport, dramatic staircase)
// ============================================

function renderSingleTimeline() {
  if (!timelineTrack || !timelineViewport) return;
  
  timelineTrack.hidden = false;
  if (multiTracks) multiTracks.hidden = true;
  hideMinimap();
  if (orbitLabels) orbitLabels.hidden = true;
  timelineViewport.classList.remove("multi-mode");
  
  // Move SVG into timelineTrack so it scrolls with content
  if (sacredSvg && sacredSvg.parentElement !== timelineTrack) {
    timelineTrack.appendChild(sacredSvg);
  }
  
  movieCount.textContent = filteredMovies.length;
  
  if (filteredMovies.length === 0) {
    showEmpty("No films match filters.");
    // Clear timelineTrack but preserve SVG
    Array.from(timelineTrack.children).forEach(child => {
      if (child !== sacredSvg) child.remove();
    });
    // Reset SVG dimensions to prevent stale width inflating scrollWidth
    if (sacredSvg) {
      sacredSvg.setAttribute("width", 0);
      sacredSvg.setAttribute("height", 0);
      sacredSvg.style.width = "0px";
      sacredSvg.style.height = "0px";
    }
    clearSacredLine();
    return;
  }

  // Always snapshot surviving card positions — any card present in both the
  // old and the new render is treated as a "survivor" and slides between
  // positions instead of disappearing/reappearing. New cards (filter
  // relaxation, fresh person load) still get the entrance flip.
  cardPositionSnapshot = {};
  Array.from(timelineTrack.children).forEach(child => {
    if (child.dataset && child.dataset.movieId) {
      cardPositionSnapshot[child.dataset.movieId] = {
        left: parseFloat(child.style.left) || 0,
        top:  parseFloat(child.style.top)  || 0
      };
    }
  });

  hideEmpty();
  // Clear timelineTrack but preserve SVG
  Array.from(timelineTrack.children).forEach(child => {
    if (child !== sacredSvg) child.remove();
  });
  // Reset SVG dimensions to prevent stale width inflating scrollWidth
  if (sacredSvg) {
    sacredSvg.setAttribute("width", 0);
    sacredSvg.setAttribute("height", 0);
    sacredSvg.style.width = "0px";
    sacredSvg.style.height = "0px";
  }
  
  // Get viewport dimensions
  const vpWidth = timelineViewport.offsetWidth;
  const vpHeight = timelineViewport.offsetHeight;
  
  // Dynamic card dimensions based on movie count
  const numCards = filteredMovies.length;
  let cardWidth, cardHeight, cardGap;
  
  if (numCards <= 3) {
    // Very small collection - large hero cards
    cardWidth = 375;
    cardHeight = 563;
    cardGap = 60;
  } else if (numCards <= 10) {
    // Small collection - bigger cards
    cardWidth = 325;
    cardHeight = 488;
    cardGap = 45;
  } else if (numCards <= 25) {
    // Medium collection
    cardWidth = 275;
    cardHeight = 413;
    cardGap = 35;
  } else {
    // Large collection
    cardWidth = 225;
    cardHeight = 338;
    cardGap = 30;
  }
  
  const padding = 60;
  
  // Calculate total width needed
  let totalWidth = padding * 2 + numCards * (cardWidth + cardGap);
  
  // For small collections, center in viewport
  if (numCards <= 10 && totalWidth < vpWidth) {
    totalWidth = vpWidth;
  }
  
  // Value range for Y positioning (staircase mode)
  const { minVal, maxVal, getValue } = getValueRange(filteredMovies);
  const isStaircase = currentSort !== "chronology";
  
  // Y bounds - use full height for staircase
  const topY = 40;
  const bottomY = vpHeight - cardHeight - 60;
  const yRange = bottomY - topY;
  const flatY = (vpHeight - cardHeight) / 2;
  
  // Set track dimensions
  timelineTrack.style.width = `${totalWidth}px`;
  timelineTrack.style.height = `${vpHeight}px`;
  
  // Sort by chronology for X positioning - apply reverse if needed
  let chronoSorted = [...filteredMovies].sort((a, b) => 
    new Date(a.release_date || "9999") - new Date(b.release_date || "9999")
  );
  
  // Reverse the X order if reverse is active
  if (isReversed) {
    chronoSorted = chronoSorted.reverse();
  }
  
  // Store for redrawing sacred line
  lastChronoSorted = chronoSorted;
  
  // Create cards
  // Calculate centering offset for small collections
  const actualContentWidth = numCards * (cardWidth + cardGap) - cardGap;
  const centerOffset = numCards <= 10 && totalWidth >= vpWidth 
    ? (totalWidth - actualContentWidth) / 2 
    : padding;
  
  chronoSorted.forEach((movie, index) => {
    // Position based on index in the (possibly reversed) chronological array
    const x = centerOffset + index * (cardWidth + cardGap);
    
    // Calculate Y position
    let y;
    if (isStaircase && maxVal > minVal) {
      const value = getValue(movie);
      const normalized = (value - minVal) / (maxVal - minVal);
      // Higher value = higher position (lower Y)
      y = bottomY - normalized * yRange;
    } else {
      y = flatY;
    }
    
    const card = createMovieCard(movie, cardWidth, cardHeight);
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;

    timelineTrack.appendChild(card);
  });


  // Card flip stagger — paired symmetric timing on Reverse, otherwise left→right.
  if (hasRenderedOnce) {
    const allCards = Array.from(timelineTrack.querySelectorAll('.timeline-card'));
    const n = allCards.length;

    // A "survivor" is any card whose movieId existed in the previous render.
    // Survivors slide between old/new positions instead of flipping in/out.
    // Brand-new cards (filter relaxation, fresh person load) still flip in.
    const isSurvivor = (card) =>
      cardPositionSnapshot &&
      card.dataset.movieId &&
      cardPositionSnapshot[card.dataset.movieId] !== undefined;

    if (lastActionWasReverse && n > 1) {
      // Paired flip: card i and card (n-1-i) flip at the same time.
      // Delay grows toward the middle, capped at 220ms.
      allCards.forEach((card, i) => {
        if (isSurvivor(card)) return;
        const pairDepth = Math.min(i, n - 1 - i);
        const delay = Math.min(pairDepth * 38, 220);
        card.classList.add('timeline-card-flipping');
        card.style.animationDelay = `${delay}ms`;
      });
    } else if (n > 0) {
      // Standard left-to-right position-based stagger
      const lefts = allCards.map(c => parseFloat(c.style.left) || 0);
      const minLeft = Math.min(...lefts);
      const maxLeft = Math.max(...lefts);
      const range = maxLeft - minLeft || 1;
      allCards.forEach(card => {
        if (isSurvivor(card)) return;
        const leftPos = parseFloat(card.style.left) || 0;
        const fraction = (leftPos - minLeft) / range;
        const delay = Math.round(fraction * 180);
        card.classList.add('timeline-card-flipping');
        card.style.animationDelay = `${delay}ms`;
      });
    }

    lastActionWasRanked = false;
    // lastActionWasReverse is reset below, AFTER the slide/spin block reads it.
  }

  // Reposition surviving cards. Reverse uses a spinning-emblem overlay that
  // masks the content swap (tiles never visually move); every other action
  // uses a smooth slide between old and new positions.
  if (cardPositionSnapshot) {
    const allCards = Array.from(timelineTrack.querySelectorAll('.timeline-card'));
    allCards.forEach(card => {
      const id = card.dataset.movieId;
      const old = id ? cardPositionSnapshot[id] : null;
      if (old) {
        const newLeft = parseFloat(card.style.left);
        const newTop  = parseFloat(card.style.top);
        const moved = Math.abs(old.left - newLeft) > 1 || Math.abs(old.top - newTop) > 1;
        if (!moved) return;

        if (lastActionWasReverse) {
          // Pre-spin dip: all cards translateY together (down then back)
          // BEFORE the content swap is revealed. The opaque spin overlay is
          // attached at the same time so the new content under it stays
          // hidden through both the dip and the spinner phases.
          card.classList.add('tile-pre-spin-dip');
          card.addEventListener('animationend', (e) => {
            if (e.animationName === 'tilePreSpinDip') {
              card.classList.remove('tile-pre-spin-dip');
            }
          }, { once: true });

          const overlay = document.createElement('div');
          overlay.className = 'tile-spin-overlay';
          overlay.innerHTML =
            '<div class="tile-spin-icon">' +
              '<div class="spinner-ring spinner-ring-1"></div>' +
              '<div class="spinner-ring spinner-ring-2"></div>' +
              '<div class="spinner-ring spinner-ring-3"></div>' +
              '<div class="spinner-core"></div>' +
            '</div>';
          card.appendChild(overlay);
          overlay.addEventListener('animationend', (e) => {
            // Only remove on the overlay's own fade-out animation, not the
            // child rings' rotate (which fire earlier and repeatedly).
            if (e.target === overlay) overlay.remove();
          });
        } else {
          // Default slide path — card travels from old position to new.
          card.style.left = `${old.left}px`;
          card.style.top  = `${old.top}px`;
          requestAnimationFrame(() => {
            card.classList.add('timeline-card-sliding');
            card.style.left = `${newLeft}px`;
            card.style.top  = `${newTop}px`;
            card.addEventListener('transitionend', () => {
              card.classList.remove('timeline-card-sliding');
            }, { once: true });
          });
        }
      }
    });
  }
  lastActionWasReverse = false;
  lastActionWasDelete = false;
  cardPositionSnapshot = null;


  // Clamp scroll position so viewport doesn't show excess space
  const maxScroll = Math.max(0, totalWidth - vpWidth);
  if (timelineViewport.scrollLeft > maxScroll) {
    timelineViewport.scrollLeft = maxScroll;
  }

  // Restore scroll position once on first render (e.g. after returning from a Movie Cube)
  restoreTimelineScrollOnce(maxScroll);

  // Draw sacred line after cards render
  setTimeout(() => drawSacredLine(chronoSorted), 100);

  // Update timeline width to fit content
  updateTimelineWidth();

  hasRenderedOnce = true;
}

// Update timeline container width to fit actual content
function updateTimelineWidth() {
  const container = timelineTrack;
  if (!container) return;

  const tiles = container.querySelectorAll('.timeline-card');

  if (tiles.length === 0) {
    container.style.width = '100%';
    return;
  }

  // Find the rightmost edge of all tiles
  let maxRight = 0;
  tiles.forEach(tile => {
    const left = parseFloat(tile.style.left) || 0;
    const width = tile.offsetWidth || 140;
    const tileRight = left + width;

    if (tileRight > maxRight) {
      maxRight = tileRight;
    }
  });

  // Add padding
  const padding = 100;
  const newWidth = maxRight + padding;

  // Set width - minimum of viewport width
  const viewportWidth = timelineViewport?.offsetWidth || window.innerWidth;
  container.style.width = `${Math.max(newWidth, viewportWidth)}px`;
}

function getValueRange(movies) {
  let getValue;
  switch (currentSort) {
    case "rating":
      getValue = (m) => m.vote_average || 0;
      break;
    case "boxoffice":
      getValue = (m) => m.popularity || 0;
      break;
    default:
      getValue = () => 0;
  }
  
  const values = movies.map(getValue);
  return {
    minVal: Math.min(...values),
    maxVal: Math.max(...values),
    getValue
  };
}

// ============================================
// MULTI-PERSON TIMELINE (Converging lines, full-size cards)
// ============================================

function renderMultiTimeline() {
  if (!multiTracks || !orbitLabels || !timelineViewport) return;
  
  timelineTrack.hidden = true;
  multiTracks.hidden = false;
  orbitLabels.hidden = false;
  timelineViewport.classList.add("multi-mode");
  
  // Move SVG into multiTracks so it scrolls with content
  if (sacredSvg && sacredSvg.parentElement !== multiTracks) {
    multiTracks.appendChild(sacredSvg);
  }
  
  // Count unique movies
  const uniqueIds = new Set();
  people.forEach(p => (p.filteredMovies || []).forEach(m => uniqueIds.add(m.id)));
  movieCount.textContent = uniqueIds.size;
  
  if (uniqueIds.size === 0) {
    showEmpty("No films match filters.");
    Array.from(multiTracks.children).forEach(child => {
      if (child !== sacredSvg) child.remove();
    });
    // Reset SVG dimensions to prevent stale width inflating scrollWidth
    if (sacredSvg) {
      sacredSvg.setAttribute("width", 0);
      sacredSvg.setAttribute("height", 0);
      sacredSvg.style.width = "0px";
      sacredSvg.style.height = "0px";
    }
    orbitLabels.innerHTML = "";
    clearSacredLine();
    return;
  }

  hideEmpty();

  // Clear multiTracks but preserve SVG
  Array.from(multiTracks.children).forEach(child => {
    if (child !== sacredSvg) child.remove();
  });
  // Reset SVG dimensions to prevent stale width inflating scrollWidth
  if (sacredSvg) {
    sacredSvg.setAttribute("width", 0);
    sacredSvg.setAttribute("height", 0);
    sacredSvg.style.width = "0px";
    sacredSvg.style.height = "0px";
  }
  
  // Render orbit labels (left sidebar)
  orbitLabels.innerHTML = people.map((person, i) => `
    <div class="orbit-label orbit-${i + 1}" data-person-idx="${i}">
      <button class="remove-orbit" onclick="removePerson(${person.id})">✕</button>
      <div class="orbit-label-name">${person.name}</div>
      <div class="orbit-label-role">${person.role}</div>
      <div class="orbit-label-count">${(person.filteredMovies || []).length} titles</div>
    </div>
  `).join('');
  
  // Build unified timeline with convergences (key by type+id to avoid collisions)
  const moviePeopleMap = new Map();
  people.forEach((person, pIndex) => {
    (person.filteredMovies || []).forEach(movie => {
      const key = `${movie.media_type || 'movie'}-${movie.id}`;
      if (!moviePeopleMap.has(key)) {
        moviePeopleMap.set(key, { movie, personIndices: [] });
      }
      moviePeopleMap.get(key).personIndices.push(pIndex);
    });
  });
  
  // Sort by chronology
  let allEntries = [...moviePeopleMap.values()].sort((a, b) =>
    new Date(a.movie.release_date || "9999") - new Date(b.movie.release_date || "9999")
  );
  
  if (isReversed) {
    allEntries = allEntries.reverse();
  }
  
  // Layout dimensions
  const cardWidth = 110;
  const cardHeight = 165;
  const cardGap = 30;
  const padding = 50;
  
  const vpHeight = timelineViewport.offsetHeight;
  const numPeople = people.length;
  const numSlots = allEntries.length;
  
  // Track heights - divide viewport
  const trackHeight = Math.floor((vpHeight - 40) / numPeople);
  const totalWidth = padding * 2 + numSlots * (cardWidth + cardGap);
  
  multiTracks.style.width = `${totalWidth}px`;
  multiTracks.style.height = `${vpHeight}px`;
  multiTracks.style.position = "relative";
  
  // Draw lane dividers (subtle)
  for (let i = 1; i < numPeople; i++) {
    const divider = document.createElement("div");
    divider.className = "lane-divider";
    divider.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      top: ${i * trackHeight + 20}px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, transparent);
      pointer-events: none;
    `;
    multiTracks.appendChild(divider);
  }
  
  // Track paths for sacred lines - will have convergence points
  const trackPaths = people.map(() => []);
  
  // Render cards
  allEntries.forEach((entry, slotIndex) => {
    const { movie, personIndices } = entry;
    const x = padding + slotIndex * (cardWidth + cardGap);
    const isConvergence = personIndices.length > 1;
    
    if (isConvergence) {
      // CONVERGENCE: All involved people's lines meet at this card
      // Place card at the midpoint of involved tracks
      const minTrack = Math.min(...personIndices);
      const maxTrack = Math.max(...personIndices);
      const midTrack = (minTrack + maxTrack) / 2;
      const convergenceY = midTrack * trackHeight + (trackHeight - cardHeight) / 2 + 20;
      
      // Create FULL-SIZE convergence card (same size as normal)
      const card = createConvergenceCardFull(movie, personIndices, cardWidth, cardHeight);
      card.style.left = `${x}px`;
      card.style.top = `${convergenceY}px`;

      multiTracks.appendChild(card);
      
      // ALL involved tracks converge to this same point
      const convergencePointY = convergenceY + cardHeight / 2;
      personIndices.forEach(pIndex => {
        trackPaths[pIndex].push({ 
          x: x + cardWidth / 2, 
          y: convergencePointY,
          slot: slotIndex,
          isConvergence: true
        });
      });
    } else {
      // Solo card - in their lane
      const pIndex = personIndices[0];
      const trackTop = pIndex * trackHeight + 20;
      const y = trackTop + (trackHeight - cardHeight) / 2;
      
      const card = createMovieCard(movie, cardWidth, cardHeight, pIndex);
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;

      multiTracks.appendChild(card);
      
      trackPaths[pIndex].push({ 
        x: x + cardWidth / 2, 
        y: y + cardHeight / 2,
        slot: slotIndex,
        isConvergence: false
      });
    }
  });
  
  // Card flip stagger — paired symmetric timing on Reverse, otherwise left→right.
  if (hasRenderedOnce) {
    const allCards = Array.from(multiTracks.querySelectorAll('.timeline-card, .convergence-card'));
    const n = allCards.length;

    if (lastActionWasReverse && n > 1) {
      // Paired flip: card i and card (n-1-i) flip at the same time.
      allCards.forEach((card, i) => {
        const pairDepth = Math.min(i, n - 1 - i);
        const delay = Math.min(pairDepth * 38, 220);
        card.classList.add('timeline-card-flipping');
        card.style.animationDelay = `${delay}ms`;
      });
    } else if (n > 0) {
      const lefts = allCards.map(c => parseFloat(c.style.left) || 0);
      const minLeft = Math.min(...lefts);
      const maxLeft = Math.max(...lefts);
      const range = maxLeft - minLeft || 1;
      allCards.forEach(card => {
        const leftPos = parseFloat(card.style.left) || 0;
        const fraction = (leftPos - minLeft) / range;
        const delay = Math.round(fraction * 180);
        card.classList.add('timeline-card-flipping');
        card.style.animationDelay = `${delay}ms`;
      });
    }

    // Sweep line — only on non-reverse (reverse has its own symmetric timing)
    if (!lastActionWasReverse) {
      const sweep = document.createElement('div');
      sweep.className = 'timeline-sweep-line';
      multiTracks.appendChild(sweep);
      sweep.addEventListener('animationend', () => sweep.remove());
    }

    lastActionWasReverse = false;
    lastActionWasRanked = false;
  }

  // Clamp scroll position so viewport doesn't show excess space
  const vpWidth = timelineViewport.offsetWidth;
  const maxScroll = Math.max(0, totalWidth - vpWidth);
  if (timelineViewport.scrollLeft > maxScroll) {
    timelineViewport.scrollLeft = maxScroll;
  }

  // Restore scroll position once on first render (e.g. after returning from a Movie Cube)
  restoreTimelineScrollOnce(maxScroll);

  // Draw sacred lines with convergence
  setTimeout(() => drawMultiSacredLines(trackPaths, totalWidth, vpHeight), 100);

  // Show mini-map for multi-actor timelines
  setTimeout(() => showMinimap(), 150);

  hasRenderedOnce = true;
}

function getValueRangeMulti(entries) {
  let getValue;
  switch (currentSort) {
    case "rating":
      getValue = (m) => m.vote_average || 0;
      break;
    case "boxoffice":
      getValue = (m) => m.popularity || 0;
      break;
    default:
      getValue = () => 0;
  }
  
  const values = entries.map(e => getValue(e.movie));
  return {
    minVal: Math.min(...values),
    maxVal: Math.max(...values),
    getValue: (m) => getValue(m)
  };
}

// ============================================
// CARD CREATION
// ============================================

function createMovieCard(movie, width, height, orbitIndex = 0) {
  const card = document.createElement("div");
  const isTv = movie.media_type === 'tv';

  let cardClass = `timeline-card orbit-${orbitIndex + 1}`;
  if (isTv) {
    cardClass += ' tv-card tv-show';
  }

  card.className = cardClass;
  card.dataset.movieId = movie.id;
  if (isTv) {
    card.dataset.mediaType = 'tv';
  }
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;

  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const title = movie.title || movie.name;

  // For TV shows, use yearRange if available, otherwise just the year
  const yearDisplay = isTv && movie.yearRange ? movie.yearRange : (getYear(movie) || '');

  // TV badge
  const tvBadge = isTv ? '<div class="tv-badge">TV</div>' : '';

  // TV hover info - shows episode count and main cast/guest status
  let tvHoverInfo = '';
  if (isTv && movie.episode_count) {
    const episodeText = `${movie.episode_count} episode${movie.episode_count !== 1 ? 's' : ''}`;
    const castStatus = movie.isMainCast ? 'Main Cast' : 'Guest';
    const castClass = movie.isMainCast ? 'main-cast' : 'guest';
    tvHoverInfo = `
      <div class="tv-hover-info">
        <span class="hover-episodes">${episodeText}</span>
        <span class="hover-status ${castClass}">${castStatus}</span>
      </div>
    `;
  }

  // Show value based on current sort
  let valueDisplay = '';
  if (currentSort === "boxoffice") {
    valueDisplay = `<div class="card-value">💰 ${formatPopularity(movie.popularity)}</div>`;
  }

  // Use w342 for better image quality
  const posterSize = 'w342';
  const posterSrc = movie.poster_path
    ? `${TMDB_IMG}${posterSize}${movie.poster_path}`
    : `https://placehold.co/${Math.round(width)}x${Math.round(height)}?text=?`;

  card.innerHTML = `
    <div class="card-glow"></div>
    <div class="card-inner">
      <button class="card-delete orbit-close" onclick="event.stopPropagation(); event.preventDefault(); triggerOrbitClose(this.closest('.timeline-card, .convergence-card'), this, () => deleteItem(${movie.id}, '${movie.media_type || 'movie'}'));">✕</button>
      ${tvBadge}
      <img class="card-poster" src="${posterSrc}" alt="${title}" loading="lazy"
           onerror="this.src='https://placehold.co/${Math.round(width)}x${Math.round(height)}?text=?'">
    </div>
    <div class="card-node"></div>
    ${tvHoverInfo}
    <div class="card-meta">
      <div class="card-meta-row">
        <div class="card-rating"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z"/></svg> ${rating}</div>
        <div class="card-year">${yearDisplay}</div>
      </div>
      ${valueDisplay}
      <div class="card-title">${title}</div>
    </div>
  `;

  if (isTv) {
    // For TV shows, clicking navigates to TV show page
    card.addEventListener("click", () => {
      window.location.href = `../games/series.html?id=${movie.id}`;
    });
  } else {
    card.addEventListener("click", () => openMovieCube(movie.id));
  }
  return card;
}

function createConvergenceCardFull(movie, personIndices, width, height) {
  const card = document.createElement("div");
  const isTv = movie.media_type === 'tv';
  card.className = `convergence-card full-size people-${personIndices.length}${isTv ? ' tv-card' : ''}`;
  card.dataset.movieId = movie.id;
  if (isTv) card.dataset.mediaType = 'tv';
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;

  const year = getYear(movie);
  const rating = movie.vote_average?.toFixed(1) || "N/A";
  const title = movie.title || movie.name;
  const tvBadge = isTv ? `<div class="card-tv-badge">TV</div>` : '';

  // Build color dots for involved people
  const orbitColors = ['#4a9eff', '#d65db1', '#4ed8aa', '#c9a227'];
  const dots = personIndices.map(i =>
    `<span class="convergence-dot" style="background: ${orbitColors[i % 4]}"></span>`
  ).join('');

  card.innerHTML = `
    <div class="convergence-glow"></div>
    <div class="card-inner">
      <button class="card-delete orbit-close" onclick="event.stopPropagation(); event.preventDefault(); triggerOrbitClose(this.closest('.timeline-card, .convergence-card'), this, () => deleteItem(${movie.id}, '${movie.media_type || 'movie'}'));">✕</button>
      ${tvBadge}
      <img class="card-poster" src="${movie.poster_path ? TMDB_IMG + 'w300' + movie.poster_path : 'https://placehold.co/' + width + 'x' + height + '?text=?'}" alt="${title}" loading="lazy"
           onerror="this.src='https://placehold.co/${width}x${height}?text=?'">
    </div>
    <div class="card-meta">
      <div class="card-meta-row">
        <div class="card-rating"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z"/></svg> ${rating}</div>
        <div class="card-year">${year || ''}</div>
      </div>
      <div class="card-title">${title}</div>
    </div>
    <div class="convergence-badge">${dots}</div>
  `;

  if (isTv) {
    card.addEventListener("click", () => {
      window.location.href = `../games/series.html?id=${movie.id}`;
    });
  } else {
    card.addEventListener("click", () => openMovieCube(movie.id));
  }
  return card;
}

// Legacy convergence card (keep for compatibility)
function createConvergenceCard(movie, personIndices, width, height) {
  return createConvergenceCardFull(movie, personIndices, width, height);
}

// ============================================
// SACRED LINE DRAWING
// ============================================

function drawSacredLine(chronoMovies) {
  if (!sacredLines || !timelineTrack) return;

  // Use passed array or fallback to stored
  const movies = chronoMovies || lastChronoSorted;
  if (!movies || movies.length < 2) return;

  const cards = timelineTrack.querySelectorAll(".timeline-card");
  if (cards.length < 2) return;

  // Size SVG to match track's explicitly-set CSS width (not scrollWidth which can be inflated by stale children)
  const trackWidth = parseInt(timelineTrack.style.width) || timelineTrack.offsetWidth;
  const trackHeight = timelineTrack.offsetHeight;

  if (trackWidth < 100 || trackHeight < 100) return;

  // Collect points FIRST before clearing - connect through card centers/nodes
  const points = [];
  let firstGeom = null;
  let lastGeom = null;
  movies.forEach(movie => {
    const card = timelineTrack.querySelector(`[data-movie-id="${movie.id}"]`);
    if (card) {
      const left = parseFloat(card.style.left) || 0;
      const top = parseFloat(card.style.top) || 0;
      const width = card.offsetWidth || 100;
      const height = card.offsetHeight || 150;

      if (left > 0 || top > 0) {
        // Line threads through each card at 1/3 from bottom (poster above, info strip below).
        const y = top + height * 2 / 3;
        points.push({ x: left + width / 2, y });
        if (!firstGeom) firstGeom = { left, width, y };
        lastGeom = { left, width, y };
      }
    }
  });

  // Only proceed if we have enough points
  if (points.length < 2) return;

  // Extend endpoints past the first and last tile so the line starts before / ends after them,
  // rather than terminating under those bookend cards.
  const tailExtension = 60;
  if (firstGeom) {
    points.unshift({ x: firstGeom.left - tailExtension, y: firstGeom.y });
  }
  if (lastGeom) {
    points.push({ x: lastGeom.left + lastGeom.width + tailExtension, y: lastGeom.y });
  }

  // NOW safe to clear and redraw
  sacredSvg.setAttribute("width", trackWidth);
  sacredSvg.setAttribute("height", trackHeight);
  sacredSvg.style.width = `${trackWidth}px`;
  sacredSvg.style.height = `${trackHeight}px`;

  // Build organic flowing path with gentle waves
  const pathD = buildOrganicPath(points);

  // Clear first
  sacredLines.innerHTML = "";

  // Outer diffuse glow - very soft
  const outerGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  outerGlow.setAttribute("d", pathD);
  outerGlow.setAttribute("class", "sacred-line-glow");
  outerGlow.setAttribute("stroke", "url(#cosmicGradient)");
  outerGlow.setAttribute("stroke-width", "48");
  outerGlow.style.filter = "blur(18px)";
  outerGlow.style.opacity = "0.5";

  // Middle glow layer
  const midGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  midGlow.setAttribute("d", pathD);
  midGlow.setAttribute("class", "sacred-line-glow");
  midGlow.setAttribute("stroke", "url(#cosmicGradient)");
  midGlow.setAttribute("stroke-width", "24");
  midGlow.style.filter = "blur(8px)";
  midGlow.style.opacity = "0.55";

  // Main cosmic line
  const mainPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  mainPath.setAttribute("d", pathD);
  mainPath.setAttribute("class", "sacred-line-main");
  mainPath.setAttribute("stroke", "url(#cosmicGradient)");

  // Inner bright core
  const corePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  corePath.setAttribute("d", pathD);
  corePath.setAttribute("class", "sacred-line-core");

  // Add layers in order (back to front)
  sacredLines.appendChild(outerGlow);
  sacredLines.appendChild(midGlow);
  sacredLines.appendChild(mainPath);
  sacredLines.appendChild(corePath);

  // Add subtle particles along the line for cosmic effect
  addCosmicParticles(points);
}

// Build organic flowing path with natural curves
function buildOrganicPath(points) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;

    // More organic tension for flowing curves
    const tension = 0.4;

    // Add subtle vertical wave for organic feel
    const waveAmplitude = Math.min(15, Math.abs(dx) * 0.02);
    const waveOffset = (i % 2 === 0 ? 1 : -1) * waveAmplitude;

    const cp1x = prev.x + dx * tension;
    const cp1y = prev.y + waveOffset;
    const cp2x = curr.x - dx * tension;
    const cp2y = curr.y - waveOffset;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return d;
}

// Add cosmic particles along the path
function addCosmicParticles(points) {
  if (!sacredLines || points.length < 2) return;

  // Add particles at intervals along the line
  const numParticles = Math.min(points.length * 2, 15);

  for (let i = 0; i < numParticles; i++) {
    const t = i / (numParticles - 1);
    const idx = Math.floor(t * (points.length - 1));
    const nextIdx = Math.min(idx + 1, points.length - 1);
    const localT = (t * (points.length - 1)) - idx;

    // Interpolate position
    const x = points[idx].x + (points[nextIdx].x - points[idx].x) * localT;
    const y = points[idx].y + (points[nextIdx].y - points[idx].y) * localT;

    // Add slight random offset for organic feel
    const offsetX = (Math.random() - 0.5) * 6;
    const offsetY = (Math.random() - 0.5) * 6;

    const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    particle.setAttribute("cx", x + offsetX);
    particle.setAttribute("cy", y + offsetY);
    particle.setAttribute("r", 1.5 + Math.random() * 1.5);
    particle.setAttribute("class", "sacred-particle");
    particle.style.animationDelay = `${Math.random() * 3}s`;
    particle.style.opacity = 0.3 + Math.random() * 0.4;

    sacredLines.appendChild(particle);
  }
}

function drawMultiSacredLines(trackPaths, totalWidth, totalHeight) {
  if (!sacredLines || !sacredSvg) return;
  sacredLines.innerHTML = "";

  // Size SVG to match the scrollable content
  if (totalWidth && totalHeight) {
    sacredSvg.setAttribute("width", totalWidth);
    sacredSvg.setAttribute("height", totalHeight);
    sacredSvg.style.width = `${totalWidth}px`;
    sacredSvg.style.height = `${totalHeight}px`;
  }

  const gradients = ['lineGrad1', 'lineGrad2', 'lineGrad3', 'lineGrad4'];

  trackPaths.forEach((points, pIndex) => {
    if (points.length < 2) return;

    // Sort by slot (chronological, or reversed)
    points.sort((a, b) => a.slot - b.slot);

    // Use organic path for flowing curves
    const pathD = buildOrganicPath(points);
    const gradId = gradients[pIndex % 4];

    // Outer diffuse glow
    const outerGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outerGlow.setAttribute("d", pathD);
    outerGlow.setAttribute("fill", "none");
    outerGlow.setAttribute("stroke", `url(#${gradId})`);
    outerGlow.setAttribute("stroke-width", "16");
    outerGlow.setAttribute("stroke-linecap", "round");
    outerGlow.setAttribute("opacity", "0.15");
    outerGlow.style.filter = "blur(6px)";

    // Inner glow
    const innerGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    innerGlow.setAttribute("d", pathD);
    innerGlow.setAttribute("fill", "none");
    innerGlow.setAttribute("stroke", `url(#${gradId})`);
    innerGlow.setAttribute("stroke-width", "8");
    innerGlow.setAttribute("stroke-linecap", "round");
    innerGlow.setAttribute("opacity", "0.25");
    innerGlow.style.filter = "blur(3px)";

    // Main cosmic line
    const main = document.createElementNS("http://www.w3.org/2000/svg", "path");
    main.setAttribute("d", pathD);
    main.setAttribute("fill", "none");
    main.setAttribute("stroke", `url(#${gradId})`);
    main.setAttribute("stroke-width", "2.5");
    main.setAttribute("stroke-linecap", "round");
    main.setAttribute("opacity", "0.7");
    main.setAttribute("class", "sacred-line-main");

    // Bright core
    const core = document.createElementNS("http://www.w3.org/2000/svg", "path");
    core.setAttribute("d", pathD);
    core.setAttribute("fill", "none");
    core.setAttribute("stroke", "rgba(255,255,255,0.5)");
    core.setAttribute("stroke-width", "1");
    core.setAttribute("stroke-linecap", "round");
    core.setAttribute("opacity", "0.6");

    sacredLines.appendChild(outerGlow);
    sacredLines.appendChild(innerGlow);
    sacredLines.appendChild(main);
    sacredLines.appendChild(core);
  });
}

function buildSmoothPath(points) {
  if (points.length < 2) return "";
  
  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const tension = 0.35;
    const dx = curr.x - prev.x;
    
    const cp1x = prev.x + dx * tension;
    const cp1y = prev.y;
    const cp2x = curr.x - dx * tension;
    const cp2y = curr.y;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }
  
  return d;
}

function estimatePathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    len += Math.sqrt(dx*dx + dy*dy);
  }
  return len * 1.3;
}

function clearSacredLine() {
  if (sacredLines) sacredLines.innerHTML = "";
  // Zero out SVG dimensions so it doesn't inflate scrollWidth
  if (sacredSvg) {
    sacredSvg.setAttribute("width", 0);
    sacredSvg.setAttribute("height", 0);
    sacredSvg.style.width = "0px";
    sacredSvg.style.height = "0px";
  }
}

// ============================================
// MINI-MAP
// ============================================

let minimapDragging = false;

function showMinimap() {
  if (timelineMinimap) timelineMinimap.hidden = false;
  updateMinimap();
}

function hideMinimap() {
  if (timelineMinimap) timelineMinimap.hidden = true;
}

function setupMinimapInteraction() {
  if (!timelineMinimap) return;

  function scrollFromMinimap(e) {
    const rect = timelineMinimap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const content = multiTracks && !multiTracks.hidden ? multiTracks : timelineTrack;
    const maxScroll = content.scrollWidth - timelineViewport.offsetWidth;
    timelineViewport.scrollLeft = ratio * maxScroll - timelineViewport.offsetWidth / 2 * (rect.width > 0 ? 1 / (content.scrollWidth / rect.width) : 0);
    // Simpler: center viewport on click position
    timelineViewport.scrollLeft = ratio * content.scrollWidth - timelineViewport.offsetWidth / 2;
  }

  timelineMinimap.addEventListener("mousedown", (e) => {
    minimapDragging = true;
    scrollFromMinimap(e);
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!minimapDragging) return;
    scrollFromMinimap(e);
  });

  document.addEventListener("mouseup", () => {
    minimapDragging = false;
  });
}

function updateMinimap() {
  if (!minimapCanvas || !minimapViewport || !timelineViewport) return;
  if (people.length < 2) return;

  const dpr = window.devicePixelRatio || 1;
  const cssW = timelineMinimap.offsetWidth;
  const cssH = timelineMinimap.offsetHeight;

  minimapCanvas.width = cssW * dpr;
  minimapCanvas.height = cssH * dpr;

  const ctx = minimapCanvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Clear
  ctx.clearRect(0, 0, cssW, cssH);

  const content = multiTracks && !multiTracks.hidden ? multiTracks : timelineTrack;
  const contentWidth = content.scrollWidth || content.offsetWidth;
  const contentHeight = content.offsetHeight;
  if (contentWidth <= 0 || contentHeight <= 0) return;

  const scaleX = cssW / contentWidth;
  const scaleY = cssH / contentHeight;
  const orbitColors = ['#4a9eff', '#d65db1', '#4ed8aa', '#c9a227'];

  // Draw lane separators
  const laneH = cssH / people.length;
  people.forEach((_, i) => {
    if (i > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, i * laneH);
      ctx.lineTo(cssW, i * laneH);
      ctx.stroke();
    }
  });

  // Draw movie cards as small rectangles
  const cards = content.querySelectorAll("[data-movie-id]");
  cards.forEach(card => {
    const left = parseFloat(card.style.left) || card.offsetLeft;
    const top = parseFloat(card.style.top) || card.offsetTop;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    const mx = left * scaleX;
    const my = top * scaleY;
    const mw = Math.max(cw * scaleX, 2);
    const mh = Math.max(ch * scaleY, 3);

    // Determine orbit color from card class
    const orbitMatch = card.className.match(/orbit-(\d)/);
    const orbitIdx = orbitMatch ? parseInt(orbitMatch[1]) - 1 : 0;
    const isConvergence = card.classList.contains("convergence-card");

    ctx.fillStyle = isConvergence ? "#a855f7" : orbitColors[orbitIdx % 4];
    ctx.globalAlpha = 0.8;
    ctx.fillRect(mx, my, mw, mh);
    ctx.globalAlpha = 1;
  });

  // Viewport indicator
  const vpWidth = timelineViewport.offsetWidth;
  const scrollLeft = timelineViewport.scrollLeft;
  const vx = scrollLeft * scaleX;
  const vw = vpWidth * scaleX;

  minimapViewport.style.left = `${vx}px`;
  minimapViewport.style.top = "0px";
  minimapViewport.style.width = `${Math.min(vw, cssW)}px`;
  minimapViewport.style.height = `${cssH}px`;
}

// ============================================
// POPUP
// ============================================

async function openPopup(movieId) {
  currentFlipSide = 1;
  if (flipCard) flipCard.className = "flip-card";
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    currentMovieData = await res.json();
    
    popupPoster.src = `${TMDB_IMG}w500${currentMovieData.poster_path}`;
    popupTitle.textContent = currentMovieData.title;
    popupYear.textContent = getYear(currentMovieData) || "";
    popupRating.textContent = currentMovieData.vote_average?.toFixed(1) || "N/A";
    popupRuntime.textContent = currentMovieData.runtime ? `${currentMovieData.runtime} min` : "";
    popupSynopsis.textContent = currentMovieData.overview || "No synopsis available.";
    
    // Box office
    if (popupBoxOffice) {
      if (currentMovieData.revenue) {
        popupBoxOffice.textContent = `💰 $${(currentMovieData.revenue / 1000000).toFixed(1)}M Box Office`;
      } else {
        popupBoxOffice.textContent = "";
      }
    }
    
    // People tags
    if (people.length > 1 && popupPeople) {
      const inMovie = people
        .map((p, i) => ({ name: p.name, index: i, inIt: p.movies.some(m => m.id === movieId) }))
        .filter(p => p.inIt);
      popupPeople.innerHTML = inMovie.map(p => 
        `<span class="person-tag orbit-${p.index + 1}">${p.name}</span>`
      ).join('');
    } else if (popupPeople) {
      popupPeople.innerHTML = '';
    }
    
    loadTrivia();
    popupOverlay.hidden = false;
    
  } catch (err) {
    console.error("Popup error:", err);
  }
}

function closePopup() {
  if (popupOverlay) popupOverlay.hidden = true;
  currentMovieData = null;

  // Ensure sacred line is still visible after popup closes
  setTimeout(() => {
    if (sacredLines && sacredLines.children.length === 0 && lastChronoSorted.length > 1) {
      drawSacredLine();
    }
  }, 100);
}

/* ============================================================
   ORBIT CLOSE — Shared trigger for Rule 17 Black Hole exit.
   Adds .closing to the X and .orbit-popup-closing to the wrapper,
   then runs the supplied teardown after the animation.
   ============================================================ */
function triggerOrbitClose(overlay, btn, teardownFn) {
  if (!overlay) { if (teardownFn) teardownFn(); return; }
  if (overlay.classList.contains('orbit-popup-closing')) return;
  if (btn) btn.classList.add('closing');
  overlay.classList.add('orbit-popup-closing');
  const reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    if (btn) btn.classList.remove('closing');
    overlay.classList.remove('orbit-popup-closing');
    if (teardownFn) teardownFn();
  }, reduced ? 200 : 600);
}

function flipToNext() {
  if (!flipCard) return;
  currentFlipSide++;
  if (currentFlipSide > 3) currentFlipSide = 1;
  flipCard.className = "flip-card";
  if (currentFlipSide === 2) flipCard.classList.add("side-2");
  if (currentFlipSide === 3) flipCard.classList.add("side-3");
}

// ============================================
// TRIVIA
// ============================================

async function loadTrivia() {
  if (!triviaQuestions) return;
  triviaQuestions.innerHTML = '<div style="text-align:center;color:#8892a6;padding:30px;">Loading...</div>';
  
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=3&category=11&type=multiple");
    const data = await res.json();
    
    if (data.results?.length) {
      triviaQuestions.innerHTML = data.results.map((q, i) => {
        const answers = shuffle([q.correct_answer, ...q.incorrect_answers]);
        return `
          <div class="trivia-item" data-correct="${escapeHtml(q.correct_answer)}">
            <div class="trivia-question">${i + 1}. ${decodeHtml(q.question)}</div>
            <div class="trivia-options">
              ${answers.map(a => `<div class="trivia-option" data-answer="${escapeHtml(a)}">${decodeHtml(a)}</div>`).join('')}
            </div>
          </div>
        `;
      }).join('');
      
      triviaQuestions.querySelectorAll(".trivia-option").forEach(opt => {
        opt.addEventListener("click", handleTrivia);
      });
    } else {
      triviaQuestions.innerHTML = '<div style="text-align:center;color:#8892a6;">No trivia available.</div>';
    }
  } catch {
    triviaQuestions.innerHTML = '<div style="text-align:center;color:#8892a6;">Failed to load trivia.</div>';
  }
}

function handleTrivia(e) {
  const opt = e.target;
  const item = opt.closest(".trivia-item");
  if (!item || item.classList.contains("answered")) return;
  
  item.classList.add("answered");
  const correct = item.dataset.correct;
  
  if (opt.dataset.answer === correct) {
    opt.classList.add("correct");
  } else {
    opt.classList.add("wrong");
    item.querySelectorAll(".trivia-option").forEach(o => {
      if (o.dataset.answer === correct) o.classList.add("correct");
    });
  }
}

// ============================================
// TRAILER
// ============================================

async function playTrailer() {
  if (!currentMovieData || !trailerOverlay || !trailerContainer) return;
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${currentMovieData.id}/videos?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const vid = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || data.results?.[0];
    
    if (vid?.site === "YouTube") {
      trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${vid.key}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      trailerOverlay.hidden = false;
    } else {
      alert("No trailer available.");
    }
  } catch {
    alert("Failed to load trailer.");
  }
}

function closeTrailer() {
  if (trailerOverlay) trailerOverlay.hidden = true;
  if (trailerContainer) trailerContainer.innerHTML = "";
}

// ============================================
// MODAL
// ============================================

function openAddPersonModal() {
  if (!addPersonModal) return;
  addPersonModal.hidden = false;
  if (personSearch) personSearch.value = "";
  if (searchResults) searchResults.innerHTML = "";
  renderOrbitChips();
  loadCollabSuggestions();
}

function closeAddPersonModal() {
  if (addPersonModal) addPersonModal.hidden = true;
}

async function searchPeople(query) {
  if (!query.trim() || !searchResults) {
    if (searchResults) searchResults.innerHTML = "";
    return;
  }
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    searchResults.innerHTML = (data.results || []).slice(0, 6).map(p => `
      <div class="search-result" data-id="${p.id}">
        <img class="search-result-img" src="${p.profile_path ? TMDB_IMG + 'w45' + p.profile_path : 'https://placehold.co/35?text=?'}" alt="">
        <div>
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-known">${p.known_for_department || ''}</div>
        </div>
      </div>
    `).join('');
    
    searchResults.querySelectorAll(".search-result").forEach(el => {
      el.addEventListener("click", async () => {
        if (addPersonBusy) return; // ignore clicks while loading
        const id = parseInt(el.dataset.id);
        // Immediate visual feedback — highlight selected, clear others
        el.classList.add("selected");
        personSearch.value = "";
        await addPerson(id);
        renderOrbitChips();
        if (searchResults) searchResults.innerHTML = "";
      });
    });
  } catch (err) {
    console.error("Search error:", err);
  }
}

function renderOrbitChips() {
  if (!orbitChips) return;
  orbitChips.innerHTML = people.map((p, i) => `
    <div class="orbit-chip orbit-${i + 1}">
      ${p.name}
      <button class="remove-chip" data-id="${p.id}">✕</button>
    </div>
  `).join('');
  
  orbitChips.querySelectorAll(".remove-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      removePerson(parseInt(btn.dataset.id));
      renderOrbitChips();
    });
  });
}

/* ============================================================
   COLLABORATOR SUGGESTIONS — Added April 2026
   When the Add Person modal opens, fetch frequent collaborators
   for people currently on the timeline and show as quick-picks.
   ============================================================ */

async function loadCollabSuggestions() {
  var container = document.getElementById('collabSuggestions');
  if (!container) return;
  if (!people.length) { container.innerHTML = ''; return; }

  /* Show loading */
  container.innerHTML =
    '<div class="collab-label">SUGGESTED COLLABORATORS</div>' +
    '<div class="collab-loading">' +
      '<div class="collab-spinner"></div> Finding collaborators\u2026' +
    '</div>';

  try {
    /* Gather collaborator counts across all people on timeline */
    var coworkers = {};
    var onTimelineIds = {};
    people.forEach(function (p) { onTimelineIds[p.id] = true; });

    for (var pi = 0; pi < people.length; pi++) {
      var person = people[pi];
      var cacheKey = 'orbit_collab_' + person.id;
      var credits;

      /* Per Rule 28: cache in sessionStorage */
      var cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        credits = JSON.parse(cached);
      } else {
        var res = await fetch(
          'https://api.themoviedb.org/3/person/' + person.id +
          '/combined_credits?api_key=' + TMDB_API_KEY
        );
        credits = await res.json();
        try { sessionStorage.setItem(cacheKey, JSON.stringify(credits)); } catch (e) { /* quota */ }
      }

      /* Get top 8 movies by popularity */
      var topMovies = (credits.cast || [])
        .filter(function (c) { return c.media_type === 'movie' || !c.media_type; })
        .sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); })
        .slice(0, 8);

      /* Fetch cast for each movie (parallel, cached) */
      var castPromises = topMovies.map(function (movie) {
        var movieCacheKey = 'orbit_movie_credits_' + movie.id;
        var movieCached = sessionStorage.getItem(movieCacheKey);
        if (movieCached) return Promise.resolve(JSON.parse(movieCached));
        return fetch(
          'https://api.themoviedb.org/3/movie/' + movie.id +
          '/credits?api_key=' + TMDB_API_KEY
        ).then(function (r) { return r.json(); })
         .then(function (data) {
           try { sessionStorage.setItem(movieCacheKey, JSON.stringify(data)); } catch (e) { /* quota */ }
           return data;
         })
         .catch(function () { return null; });
      });

      var allCasts = await Promise.all(castPromises);

      allCasts.forEach(function (movieData, movieIdx) {
        if (!movieData) return;
        var cast = (movieData.cast || []).concat(movieData.crew || []);
        cast.forEach(function (p) {
          if (onTimelineIds[p.id]) return; /* skip people already on timeline */
          if (!coworkers[p.id]) {
            coworkers[p.id] = {
              id: p.id,
              name: p.name,
              department: p.known_for_department || p.department || '',
              profile_path: p.profile_path || '',
              count: 0,
              films: [],
              withPeople: {}
            };
          }
          var filmTitle = topMovies[movieIdx] && topMovies[movieIdx].title;
          if (filmTitle && coworkers[p.id].films.indexOf(filmTitle) === -1) {
            coworkers[p.id].count++;
            coworkers[p.id].films.push(filmTitle);
            coworkers[p.id].withPeople[person.name] = true;
          }
        });
      });
    }

    /* Sort by count, take top 6 */
    var topCollabs = Object.values(coworkers)
      .filter(function (c) { return c.count >= 2; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 6);

    if (!topCollabs.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML =
      '<div class="collab-label">SUGGESTED COLLABORATORS</div>' +
      '<div class="collab-list">' +
        topCollabs.map(function (collab) {
          var imgSrc = collab.profile_path
            ? TMDB_IMG + 'w45' + collab.profile_path
            : 'https://placehold.co/35?text=?';
          var filmsText = collab.films.slice(0, 2).join(', ');
          var withNames = Object.keys(collab.withPeople).join(', ');
          return '<div class="collab-row" data-collab-id="' + collab.id + '">' +
            '<img class="collab-photo" src="' + imgSrc + '" onerror="this.style.display=\'none\'" alt="">' +
            '<div class="collab-info">' +
              '<div class="collab-name">' + escHtml(collab.name) + '</div>' +
              '<div class="collab-meta">' +
                '<span class="collab-count">' + collab.count + ' films</span> with ' +
                escHtml(withNames) +
                ' \u00B7 ' + escHtml(filmsText) +
              '</div>' +
            '</div>' +
            '<div class="collab-dept">' + escHtml(collab.department) + '</div>' +
          '</div>';
        }).join('') +
      '</div>';

    /* Wire clicks — add collaborator to timeline */
    container.querySelectorAll('.collab-row').forEach(function (row) {
      row.addEventListener('click', async function () {
        if (addPersonBusy) return;
        var id = parseInt(this.dataset.collabId, 10);
        if (people.find(function (p) { return p.id === id; })) return;
        this.style.opacity = '0.4';
        this.style.pointerEvents = 'none';
        await addPerson(id);
        renderOrbitChips();
        loadCollabSuggestions(); /* refresh — removes the one just added */
      });
    });

  } catch (err) {
    console.error('[collab-suggestions]', err);
    container.innerHTML = '';
  }
}

/* Escape HTML helper for collab suggestions */
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================
// NAVIGATION
// ============================================

function openVennView() {
  if (people.length < 2) return;
  // Venn only works with movies, so filter out TV shows
  const moviesOnlyPeople = people.map(person => ({
    ...person,
    tvShows: [] // Exclude TV shows from Venn
  }));
  localStorage.setItem("vennPeople", JSON.stringify(moviesOnlyPeople));
  window.location.href = "venn.html";
}

function makeAnchorStar() {
  if (!currentMovieData) return;
  const allMov = people.length > 0 ? people.flatMap(p => p.movies) : allMovies;
  localStorage.setItem("anchorMovie", JSON.stringify(currentMovieData));
  localStorage.setItem("constellationMovies", JSON.stringify(allMov));
  localStorage.removeItem("anchorFromResults");
  window.location.href = "anchor-point.html";
}

// ============================================
// UTILITIES
// ============================================

function getYear(m) {
  return m.release_date ? parseInt(m.release_date.split("-")[0]) : null;
}

function formatPopularity(pop) {
  if (!pop) return "N/A";
  if (pop >= 100) return Math.round(pop);
  return pop.toFixed(1);
}

function deleteItem(itemId, mediaType) {
  lastActionWasDelete = true;
  if (people.length > 0) {
    people.forEach(p => {
      if (mediaType === 'tv') {
        p.tvShows = (p.tvShows || []).filter(m => m.id !== itemId);
      } else {
        p.movies = p.movies.filter(m => m.id !== itemId);
      }
    });
    allTvShows = people.flatMap(p => p.tvShows || []);
    updateMultiMode();
  } else {
    if (mediaType === 'tv') {
      allTvShows = allTvShows.filter(m => m.id !== itemId);
    } else {
      allMovies = allMovies.filter(m => m.id !== itemId);
    }
    processAndRender();
  }
}

// Keep backward compat for any old references
function deleteMovie(movieId) { deleteItem(movieId, 'movie'); }

window.deleteItem = deleteItem;
window.deleteMovie = deleteMovie;
window.removePerson = removePerson;

function showEmpty(msg) {
  if (emptyState) {
    emptyState.hidden = false;
    const p = emptyState.querySelector("p");
    if (p) p.textContent = msg;
  }
}

function hideEmpty() {
  if (emptyState) emptyState.hidden = true;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Two-phase flip helper — exit-flip existing cards, then rebuild the DOM
  // and trigger the paired-symmetric entry stagger via lastActionWasReverse.
  // Used by Reverse and Chronology so they share the same exit-then-enter feel.
  function playFlipRebuild() {
    lastActionWasReverse = true;

    const existing = [
      ...(timelineTrack ? timelineTrack.querySelectorAll('.timeline-card') : []),
      ...(multiTracks ? multiTracks.querySelectorAll('.timeline-card, .convergence-card') : [])
    ];

    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (existing.length === 0 || reduced) {
      applyFiltersAndSort();
      return;
    }

    existing.forEach(c => c.classList.add('timeline-card-flipping-out'));
    // 220ms matches the exit keyframe duration.
    setTimeout(() => applyFiltersAndSort(), 220);
  }

  function playRankedRebuild() {
    const singleCards = Array.from(timelineTrack.children).filter(
      c => c.classList.contains('timeline-card')
    );
    const multiCards = document.querySelectorAll('.multi-track .timeline-card, .multi-track .convergence-card');
    const existing = singleCards.length > 0 ? singleCards : Array.from(multiCards);

    if (existing.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyFiltersAndSort();
      return;
    }

    // Stagger exit left-to-right across ~180ms total
    existing.forEach((card, i) => {
      const delay = existing.length > 1 ? (i / (existing.length - 1)) * 180 : 0;
      card.style.animationDelay = `${delay}ms`;
      card.classList.add('timeline-card-flipping-out');
    });

    lastActionWasRanked = true;
    setTimeout(() => applyFiltersAndSort(), 220); // 220ms matches exit keyframe duration
  }

  // Sort — surviving cards slide to their new positions; no flip-out phase.
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      applyFiltersAndSort();
    });
  });

  // Reverse — tiles keep their positions; spinning ⧗ emblem covers each face,
  // and when it fades the underlying content has been swapped to the mirrored
  // film. The tile shape never moves; nothing disappears.
  reverseBtn?.addEventListener("click", () => {
    isReversed = !isReversed;
    reverseBtn.classList.toggle("active", isReversed);
    lastActionWasReverse = true;
    applyFiltersAndSort();
  });
  
  // Filters
  decadeFilter?.addEventListener("change", applyFiltersAndSort);
  yearFilter?.addEventListener("change", applyFiltersAndSort);
  ratingFilter?.addEventListener("change", applyFiltersAndSort);
  billingFilter?.addEventListener("change", applyFiltersAndSort);
  roleFilter?.addEventListener("change", applyFiltersAndSort);
  excludeSelfCheckbox?.addEventListener("change", applyFiltersAndSort);
  featureFilmsOnly?.addEventListener("change", applyFiltersAndSort);

  // Guest appearances checkbox
  const guestAppearancesCheckbox = document.getElementById('showGuestAppearances');
  guestAppearancesCheckbox?.addEventListener('change', (e) => {
    showGuestAppearances = e.target.checked;
    applyFiltersAndSort();
  });

  // Modal
  addPersonBtn?.addEventListener("click", openAddPersonModal);
  modalClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerOrbitClose(addPersonModal, modalClose, closeAddPersonModal);
  });
  modalCancel?.addEventListener("click", closeAddPersonModal);
  modalConfirm?.addEventListener("click", closeAddPersonModal);
  
  personSearch?.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchPeople(e.target.value), 300);
  });
  
  // Venn
  vennBtn?.addEventListener("click", openVennView);
  
  // Bio toggle
  bioBtn?.addEventListener("click", toggleBioPanel);

  // Media Mode Toggle (Movies/TV/Both)
  const mediaModeToggle = document.getElementById('mediaModeToggle');
  if (mediaModeToggle) {
    mediaModeToggle.querySelectorAll('.media-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mediaModeToggle.querySelectorAll('.media-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMediaMode = btn.dataset.mode;
        localStorage.setItem('timelineMediaMode', currentMediaMode);

        // Update count label and guest filter visibility
        updateMediaModeToggleVisibility();

        applyFiltersAndSort();
      });
    });
  }

  // Mini-map scroll sync + interaction
  timelineViewport?.addEventListener("scroll", updateMinimap);

  // Persist scroll position so Movie Cube round-trips don't lose place.
  let _scrollSaveTimer = null;
  timelineViewport?.addEventListener("scroll", () => {
    if (_scrollSaveTimer) clearTimeout(_scrollSaveTimer);
    _scrollSaveTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(getTimelineScrollKey(), String(timelineViewport.scrollLeft));
      } catch (e) { /* quota or disabled */ }
    }, 150);
  }, { passive: true });

  // ── Mouse wheel & trackpad → horizontal scroll ──
  if (timelineViewport) {
    timelineViewport.addEventListener("wheel", (e) => {
      // Trackpad horizontal swipe: let native overflow-x handle it
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Mouse wheel vertical: convert to horizontal scroll
      if (e.deltaY === 0) return;
      e.preventDefault();
      timelineViewport.scrollLeft += e.deltaY;
    }, { passive: false });

    // ── Touch swipe with momentum ──
    let touchStartX = 0, touchStartScroll = 0, touchVelocity = 0, lastTouchX = 0, lastTouchTime = 0;

    timelineViewport.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartScroll = timelineViewport.scrollLeft;
      touchVelocity = 0;
      lastTouchX = touchStartX;
      lastTouchTime = Date.now();
    }, { passive: true });

    timelineViewport.addEventListener("touchmove", (e) => {
      const touchX = e.touches[0].clientX;
      const now = Date.now();
      const dt = now - lastTouchTime;
      if (dt > 0) touchVelocity = (lastTouchX - touchX) / dt;
      lastTouchX = touchX;
      lastTouchTime = now;
      timelineViewport.scrollLeft = touchStartScroll + (touchStartX - touchX);
    }, { passive: true });

    timelineViewport.addEventListener("touchend", () => {
      // Apply momentum
      const momentum = touchVelocity * 300;
      timelineViewport.scrollBy({ left: momentum, behavior: "smooth" });
    }, { passive: true });
  }

  setupMinimapInteraction();

  // Sacred line persistence - check periodically
  setInterval(() => {
    if (!timelineTrack?.hidden && sacredLines && lastChronoSorted.length > 1) {
      if (sacredLines.children.length === 0) {
        drawSacredLine();
      }
    }
  }, 1000);
  
  // Also redraw on any interaction that might affect it
  document.addEventListener("click", (e) => {
    // Don't interfere with interactive elements
    if (e.target.closest(".timeline-card, button, select, input, a")) return;
    
    // Delayed check to ensure line persists
    setTimeout(() => {
      if (!timelineTrack?.hidden && sacredLines && sacredLines.children.length === 0 && lastChronoSorted.length > 1) {
        drawSacredLine();
      }
    }, 100);
  });
  
  // Popup
  popupClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerOrbitClose(popupOverlay, popupClose, closePopup);
  });
  popupOverlay?.addEventListener("click", (e) => {
    if (e.target === popupOverlay) triggerOrbitClose(popupOverlay, popupClose, closePopup);
  });
  flipCard?.addEventListener("click", (e) => {
    if (!e.target.closest(".popup-btn, .trivia-option")) flipToNext();
  });

  // Trailer
  trailerBtn?.addEventListener("click", (e) => { e.stopPropagation(); playTrailer(); });
  trailerClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerOrbitClose(trailerOverlay, trailerClose, closeTrailer);
  });
  trailerOverlay?.addEventListener("click", (e) => {
    if (e.target === trailerOverlay) triggerOrbitClose(trailerOverlay, trailerClose, closeTrailer);
  });

  // Anchor
  anchorBtn?.addEventListener("click", (e) => { e.stopPropagation(); makeAnchorStar(); });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (trailerOverlay && !trailerOverlay.hidden) {
        triggerOrbitClose(trailerOverlay, trailerClose, closeTrailer);
      } else if (popupOverlay && !popupOverlay.hidden) {
        triggerOrbitClose(popupOverlay, popupClose, closePopup);
      } else if (addPersonModal && !addPersonModal.hidden) {
        triggerOrbitClose(addPersonModal, modalClose, closeAddPersonModal);
      }
    }
  });
}

// ============================================
// PERSON BIO PANEL
// ============================================

let bioPanel, bioPanelContent, bioClose;
let currentBioPersonIndex = 0;

function initBioPanel() {
  console.log("Timeline initBioPanel called");
  bioPanel = document.getElementById("bioPanel");
  bioPanelContent = document.getElementById("bioPanelContent");
  bioClose = document.getElementById("bioClose");
  
  if (!bioPanel) {
    console.log("No bioPanel element in timeline");
    return;
  }
  
  // Always setup orbit label click handlers for multi-person
  setupOrbitLabelBioClicks();
  
  // Setup person selector for multi-person mode (inside panel)
  const personSelector = document.getElementById("bioPersonSelector");
  const personTabs = document.getElementById("bioPersonTabs");
  
  if (people.length > 1 && personSelector && personTabs) {
    personSelector.hidden = false;
    
    // Render person tabs with photos
    personTabs.innerHTML = people.map((person, idx) => {
      const photoUrl = person.profile 
        ? `https://image.tmdb.org/t/p/w45${person.profile}`
        : "https://placehold.co/24x24?text=?";
      const firstName = person.name.split(" ")[0];
      return `
        <div class="bio-person-tab ${idx === 0 ? 'active' : ''}" data-person-idx="${idx}">
          <img class="bio-person-tab-photo" src="${photoUrl}" alt="">
          <span class="bio-person-tab-name">${firstName}</span>
        </div>
      `;
    }).join("");
    
    // Person tab click handlers
    personTabs.querySelectorAll(".bio-person-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const idx = parseInt(tab.dataset.personIdx);
        currentBioPersonIndex = idx;
        
        personTabs.querySelectorAll(".bio-person-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        loadPersonBio(people[idx].id, idx);
      });
    });
  } else if (personSelector) {
    personSelector.hidden = true;
  }
  
  // Setup visualization tabs
  setupVizTabs();
  
  // Load initial bio
  const timelineType = localStorage.getItem("timelineType");
  const timelineId = localStorage.getItem("timelineMovieId");
  
  if (people.length === 1) {
    // Single person - auto-load and show bio
    if (timelineType === "person" && timelineId) {
      loadPersonBio(timelineId, 0);
    } else {
      loadPersonBio(people[0].id, 0);
    }
    bioPanel.classList.add("expanded");
    bioPanel.classList.add("visible");
  }
  // Multi-person: wait for orbit label click
  
  // Close button
  if (bioClose) {
    bioClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerOrbitClose(bioPanel, bioClose, closeBioPanel);
    });
  }
}

function setupOrbitLabelBioClicks() {
  // Use event delegation on the orbitLabels container
  const orbitLabelsContainer = document.getElementById("orbitLabels");
  if (!orbitLabelsContainer) return;
  
  orbitLabelsContainer.addEventListener("click", (e) => {
    // Don't trigger if clicking remove button
    if (e.target.classList.contains("remove-orbit")) return;
    
    // Find the orbit-label element
    const label = e.target.closest(".orbit-label");
    if (!label) return;
    
    const idx = parseInt(label.dataset.personIdx);
    if (isNaN(idx) || !people[idx]) return;
    
    currentBioPersonIndex = idx;
    
    // Update person tabs inside panel
    const personTabs = document.getElementById("bioPersonTabs");
    if (personTabs) {
      personTabs.querySelectorAll(".bio-person-tab").forEach((t, i) => {
        t.classList.toggle("active", i === idx);
      });
    }
    
    // Load and show bio
    loadPersonBio(people[idx].id, idx);
    bioPanel.classList.add("expanded");
    bioPanel.classList.add("visible");
  });
}

function setupVizTabs() {
  const vizTabs = document.querySelectorAll(".bio-viz-tab");
  const vizPanels = {
    genres: document.getElementById("vizGenres"),
    collabs: document.getElementById("vizCollabs"),
    activity: document.getElementById("vizActivity")
  };
  
  vizTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const viz = tab.dataset.viz;
      
      // Update active tab
      vizTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      // Show selected panel
      Object.entries(vizPanels).forEach(([key, panel]) => {
        if (panel) panel.hidden = key !== viz;
      });

      // Hide the awards section while the Collabs tab is active
      // so the collab cards visually cover the bottom of the panel.
      const awardsSection = document.getElementById('bioAwardsSection');
      if (awardsSection) {
        if (viz === 'collabs') {
          awardsSection.dataset.hiddenByTab = '1';
          awardsSection.hidden = true;
        } else if (awardsSection.dataset.hiddenByTab === '1') {
          delete awardsSection.dataset.hiddenByTab;
          awardsSection.hidden = false;
        }
      }

      // Render data if needed
      const personIdx = currentBioPersonIndex;
      const movies = people[personIdx]?.filteredMovies || people[personIdx]?.movies || [];

      if (viz === "collabs" && vizPanels.collabs) {
        renderCollaborators(people[personIdx]?.id, movies);
      } else if (viz === "activity" && vizPanels.activity) {
        renderActivity(movies);
      }
    });
  });
}

async function loadPersonBio(personId, personIdx = 0) {
  console.log("loadPersonBio called with ID:", personId, "idx:", personIdx);
  try {
    const expectedName = people[personIdx] ? people[personIdx].name : null;
    let person;
    if (expectedName) {
      const resolved = await resolvePersonId(personId, expectedName);
      person = resolved.person;
    } else {
      const res = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`);
      person = await res.json();
    }
    console.log("Person data loaded:", person.name);
    
    const bioPhoto = document.getElementById("bioPhoto");
    const bioName = document.getElementById("bioName");
    const bioRole = document.getElementById("bioRole");
    const bioDates = document.getElementById("bioDates");
    const bioMemorial = document.getElementById("bioMemorial");
    const bioText = document.getElementById("bioText");
    const bioFilmCount = document.getElementById("bioFilmCount");
    const bioAvgRating = document.getElementById("bioAvgRating");
    const bioCareerSpan = document.getElementById("bioCareerSpan");
    const bioDebut = document.getElementById("bioDebut");
    
    if (bioPhoto) {
      bioPhoto.src = person.profile_path 
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : 'https://placehold.co/80x120?text=?';
    }
    
    if (bioName) bioName.textContent = person.name || "Unknown";
    if (bioRole) bioRole.textContent = person.known_for_department || "Artist";
    
    // Format dates — birth year + birthplace consolidated on one row
    if (bioDates) {
      const birth = person.birthday ? new Date(person.birthday).getFullYear() : null;
      const death = person.deathday ? new Date(person.deathday).getFullYear() : null;
      const place = person.place_of_birth || "";

      let datePart = "";
      if (birth && death) datePart = `${birth} – ${death}`;
      else if (birth) datePart = `Born ${birth}`;

      bioDates.textContent = [datePart, place].filter(Boolean).join(" · ");
    }

    // Memorial banner for deceased
    if (bioMemorial) {
      bioMemorial.hidden = !person.deathday;
    }
    
    // Bio text + AI bio + awards are wired below after renderGenrePie.
    // The static #bioReadMore button + #bioFullSection in the HTML replace
    // the old dynamic .bio-read-more injection — see block after renderGenrePie.
    const biography = person.biography || "";
    const personName = person.name || "Unknown";


    // Get movies for THIS person (use personIdx to get correct person's movies)
    const movies = people[personIdx]?.filteredMovies || people[personIdx]?.movies || 
                   (people.length > 0 ? (people[0].filteredMovies || people[0].movies || []) : []);
    
    // Film count
    if (bioFilmCount) {
      bioFilmCount.textContent = movies.length;
    }
    
    // Average rating
    if (bioAvgRating) {
      if (movies.length > 0) {
        const avgRating = movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / movies.length;
        bioAvgRating.textContent = avgRating.toFixed(1);
      } else {
        bioAvgRating.textContent = "–";
      }
    }
    
    // Career span & Debut
    if (movies.length > 0) {
      const years = movies
        .map(m => {
          const date = m.release_date || "";
          return date ? parseInt(date.substring(0, 4)) : null;
        })
        .filter(y => y && y > 1900)
        .sort((a, b) => a - b);
      
      if (years.length > 0) {
        const firstYear = years[0];
        const currentYear = new Date().getFullYear();
        const endYear = person.deathday ? parseInt(person.deathday.substring(0, 4)) : currentYear;
        const span = endYear - firstYear;
        
        if (bioCareerSpan) {
          bioCareerSpan.textContent = `${span}y`;
        }
        
        // Find debut movie
        if (bioDebut) {
          const debutMovie = movies.find(m => {
            const y = m.release_date ? parseInt(m.release_date.substring(0, 4)) : null;
            return y === firstYear;
          });
          if (debutMovie) {
            bioDebut.textContent = `Debut: ${debutMovie.title} (${firstYear})`;
            bioDebut.hidden = false;
          } else {
            bioDebut.hidden = true;
          }
        }
      } else {
        if (bioCareerSpan) bioCareerSpan.textContent = "–";
        if (bioDebut) bioDebut.hidden = true;
      }
    } else {
      if (bioCareerSpan) bioCareerSpan.textContent = "–";
      if (bioDebut) bioDebut.hidden = true;
    }
    
    // Render genre pie chart
    renderGenrePie(movies);

    waitForAwardsData(() => {
      renderBioAwards(personId);
    });

    // AI bio — async, fires after panel is visible
    const aiSection = document.getElementById('bioAiSection');
    const aiTextEl = document.getElementById('bioAiText');
    const aiLoadingEl = document.getElementById('bioAiLoading');
    const readMoreBtn = document.getElementById('bioReadMore');
    const fullSection = document.getElementById('bioFullSection');
    const bioTextEl = document.getElementById('bioText');

    // Populate full TMDB bio in collapsed section
    if (biography && bioTextEl) {
      bioTextEl.textContent = biography;
      if (readMoreBtn) readMoreBtn.hidden = false;
    }

    // Wire read-more toggle — remove any previously attached listener first
    if (readMoreBtn) {
      const newBtn = readMoreBtn.cloneNode(true);
      readMoreBtn.parentNode.replaceChild(newBtn, readMoreBtn);
      newBtn.addEventListener('click', () => {
        const isHidden = fullSection.hidden;
        fullSection.hidden = !isHidden;
        newBtn.textContent = isHidden ? 'HIDE BIOGRAPHY' : 'FULL BIOGRAPHY';
      });
    }

    // Fire AI bio async
    if (aiSection && aiTextEl) {
      generateAiBio(personId, personName, biography).then(aiBio => {
        if (aiBio && aiTextEl) {
          if (aiLoadingEl) aiLoadingEl.remove();
          const cleaned = aiBio
            .replace(/^#+\s*/gm, '')
            .replace(new RegExp(`^${personName}[\\s\\W]*`, 'i'), '')
            .trim();
          aiTextEl.textContent = cleaned;
        } else if (aiSection) {
          aiSection.hidden = true;
        }
      });
    }

    // Store current person for viz tabs
    currentBioPersonIndex = personIdx;

    // Wire OPEN IN CUBE pill — fresh listener each render
    const cubeLink = document.getElementById('bioCubeLink');
    if (cubeLink) {
      const newCubeLink = cubeLink.cloneNode(true);
      cubeLink.parentNode.replaceChild(newCubeLink, cubeLink);
      newCubeLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof openPeopleCube === 'function') openPeopleCube(personId);
      });
    }

  } catch (e) {
    console.error("Failed to load person bio:", e);
  }
}

// ============================================
// AI BIO + AWARDS HELPERS (Bio panel)
// ============================================

// Polls until awards-data.js has finished parsing (PERSON_AWARD_LOOKUP defined).
// 50ms cadence, 5s cap — covers slow machines without leaking intervals.
function waitForAwardsData(cb, maxWait = 5000) {
  if (typeof PERSON_AWARD_LOOKUP !== 'undefined') {
    cb();
    return;
  }
  const start = Date.now();
  const t = setInterval(() => {
    if (typeof PERSON_AWARD_LOOKUP !== 'undefined') {
      clearInterval(t);
      cb();
    } else if (Date.now() - start > maxWait) {
      clearInterval(t);
    }
  }, 50);
}

async function generateAiBio(personId, personName, tmdbBio) {
  const cacheKey = `orbit_ai_bio_${personId}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;
  if (!tmdbBio || tmdbBio.length < 50) return null;
  try {
    // Two delivery paths, chosen automatically by environment:
    //  • Local (VS Code Live Server, static — no functions): config.js defines
    //    ANTHROPIC_API_KEY (git-ignored), so call the API directly from the browser.
    //  • Production (Netlify from GitHub): config.js is absent, so ANTHROPIC_API_KEY
    //    is undefined and we route through netlify/functions/ai-bio.js, which reads
    //    the key from a Netlify env var. The key never ships to the browser in prod.
    let response;
    if (typeof ANTHROPIC_API_KEY !== 'undefined' && ANTHROPIC_API_KEY) {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 120,
          messages: [{
            role: 'user',
            content: `Write a 2-sentence bio for ${personName} for use in a film discovery app. Focus on what makes them cinematically significant — their range, impact, or defining quality as a filmmaker or performer. Avoid birth dates, nationalities, and biographical trivia. Be punchy and specific. Source material: ${tmdbBio.slice(0, 800)}`
          }]
        })
      });
    } else {
      response = await fetch('/.netlify/functions/ai-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personName, tmdbBio })
      });
    }
    const data = await response.json();
    const text = data.content?.[0]?.text || null;
    if (text) sessionStorage.setItem(cacheKey, text);
    return text;
  } catch (e) {
    return null;
  }
}

function buildAwardsBadges(personId) {
  if (typeof PERSON_AWARD_LOOKUP === 'undefined') return '';
  personId = parseInt(personId, 10);
  const rawEntries = Object.entries(PERSON_AWARD_LOOKUP)
    .filter(([, v]) => v.person_id === personId);
  if (!rawEntries.length) return '';

  const festNormalise = {
    'GoldenGlobes':     'GoldenGlobe',
    'Golden Globes':    'GoldenGlobe',
    'Golden Globe':     'GoldenGlobe',
    'Oscars':           'Oscar',
    'Academy Awards':   'Oscar',
    'AcademyAwards':    'Oscar'
  };

  // Normalise + dedupe by (festival, category, year, film) so variant festival
  // spellings or repeat keys don't double-count toward badge totals.
  const seen = new Set();
  const entries = [];
  rawEntries.forEach(([key]) => {
    const [festRaw, category, year, film] = key.split('|');
    const festival = festNormalise[festRaw] || festRaw;
    const dedupKey = `${festival}|${category}|${year}|${film}`;
    if (seen.has(dedupKey)) return;
    seen.add(dedupKey);
    entries.push({ festival, category, year, film });
  });

  const festivalWins = {};
  const festivalNoms = {};

  entries.forEach(({ festival, category, year, film }) => {
    let won = false;
    // Primary: parallel winners index — covers actor categories at Globe /
    // Cannes / Venice / Berlin which AWARDS_BROWSE_DATABASE doesn't store.
    if (typeof PERSON_WINNERS_LOOKUP !== 'undefined' &&
        PERSON_WINNERS_LOOKUP[`${festival}|${category}|${year}|${film}`]) {
      won = true;
    }
    // Fallback: film-level awards that AWARDS_BROWSE_DATABASE does store
    // (Globe Best Comedy/Musical, Berlin Golden Bear, etc.).
    if (!won) {
      try {
        for (const tryYear of [parseInt(year), parseInt(year) + 1]) {
          const db = AWARDS_BROWSE_DATABASE?.[festival]?.[category]?.[tryYear];
          if (!db) continue;
          const winTitle = (db.winner?.title || '').toLowerCase().trim();
          const coWin = Array.isArray(db.winners) &&
            db.winners.some(w => (w.title || '').toLowerCase().trim() === film);
          if (winTitle === film || coWin) {
            won = true;
            break;
          }
        }
      } catch (e) {}
    }
    if (won) {
      festivalWins[festival] = (festivalWins[festival] || 0) + 1;
    } else {
      if (!festivalWins[festival]) festivalNoms[festival] = true;
    }
  });

  const short = {
    'Oscar': 'OSCAR', 'BAFTA': 'BAFTA',
    'Cannes': 'CANNES', 'Venice': 'VENICE',
    'Berlin': 'BERLIN', 'GoldenGlobe': 'GLOBE'
  };

  let html = '';
  Object.entries(festivalWins).forEach(([fest, wins]) => {
    const label = short[fest] || fest.toUpperCase();
    const prefix = wins > 1 ? `${wins}× ` : '';
    html += `<span class="awards-badge win">${prefix}${label}</span>`;
  });
  Object.entries(festivalNoms).forEach(([fest]) => {
    const label = short[fest] || fest.toUpperCase();
    html += `<span class="awards-badge nom">${label} NOM</span>`;
  });
  return html;
}

function renderBioAwards(personId) {
  const section = document.getElementById('bioAwardsSection');
  const glyphs = document.getElementById('bioAwardsGlyphs');
  if (!section || !glyphs) return;
  if (typeof PERSON_AWARD_LOOKUP === 'undefined') return;
  personId = parseInt(personId, 10);

  const festNormalise = {
    'GoldenGlobes':     'GoldenGlobe',
    'Golden Globes':    'GoldenGlobe',
    'Golden Globe':     'GoldenGlobe',
    'Oscars':           'Oscar',
    'Academy Awards':   'Oscar',
    'AcademyAwards':    'Oscar'
  };

  // Festival config — inline SVG icons extracted verbatim from
  // docs/Award Glyphs _standalone_.html (gold-tier badges). Each SVG uses
  // currentColor for the inner glyph; halo rings reference --halo-* CSS vars
  // and BAFTA mask cut-outs reference --bg-card, all defined on .bio-award-glyph-btn.
  const festConfig = {
    'Oscar': {
      label: 'Academy Awards',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <!-- outer halo (cyan) -->
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-oscar)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-oscar)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">
            <!-- inner core ring -->

            <!-- knight head + body silhouette -->
            <g stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <!-- head -->
              <ellipse cx="66" cy="42" rx="6" ry="8"></ellipse>
              <!-- shoulders / chest -->
              <path d="M58 52 Q56 60 56 72 L56 84 Q56 88 60 90 L72 90 Q76 88 76 84 L76 72 Q76 60 74 52"></path>
              <!-- arms across body holding sword (crossed arms) -->
              <line x1="56" y1="62" x2="76" y2="62" stroke-width="2.4"></line>
              <!-- sword vertical down center -->
              <line x1="66" y1="58" x2="66" y2="92" stroke-width="2"></line>
              <!-- pedestal: stacked discs -->
              <ellipse cx="66" cy="92" rx="14" ry="2.5" stroke-width="1.5"></ellipse>
              <line x1="62" y1="92" x2="62" y2="100" stroke-width="2"></line>
              <line x1="70" y1="92" x2="70" y2="100" stroke-width="2"></line>
              <ellipse cx="66" cy="100" rx="14" ry="2.5"></ellipse>
              <rect x="50" y="100" width="32" height="6" rx="1"></rect>
            </g>
            <!-- eyes (small dots) -->
            <circle cx="63.5" cy="42" r="0.9" fill="currentColor"></circle>
            <circle cx="68.5" cy="42" r="0.9" fill="currentColor"></circle>

            </g></svg>`
    },
    'BAFTA': {
      label: 'BAFTA',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-bafta)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-bafta)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">

            <!-- Tragedy/comedy mask silhouette -->
            <g fill="currentColor">
              <!-- Mask outline -->
              <path d="M66 36
                       Q82 38 84 56
                       Q84 74 78 84
                       Q72 92 66 92
                       Q60 92 54 84
                       Q48 74 48 56
                       Q50 38 66 36 Z"></path>
            </g>
            <!-- eyes & mouth (cut out via dark fill) -->
            <g fill="var(--bg-card)">
              <ellipse cx="58" cy="58" rx="2.2" ry="3.2"></ellipse>
              <ellipse cx="74" cy="58" rx="2.2" ry="3.2"></ellipse>
              <!-- nose triangle -->
              <path d="M66 64 L63.5 76 L68.5 76 Z"></path>
              <!-- Mouth -->
              <ellipse cx="66" cy="83" rx="5" ry="2"></ellipse>
            </g>
            <!-- Pedestal base bars -->
            <rect x="48" y="98" width="36" height="4" rx="1" fill="currentColor"></rect>
            <rect x="44" y="104" width="44" height="5" rx="1" fill="currentColor"></rect>

            </g></svg>`
    },
    'Cannes': {
      label: 'Cannes',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-cannes)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-cannes)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">

            <!-- Palm frond inside rectangular casing -->
            <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <!-- Casing rectangle -->
              <rect x="50" y="32" width="32" height="68" rx="1.5" stroke-width="2"></rect>
              <!-- Stem -->
              <path d="M66 92 Q66 78 66 64 Q66 50 66 38" stroke-width="2"></path>
              <!-- Frond pairs (curving downward) -->
              <path d="M66 78 Q60 74 52 80 Q56 76 66 78 Z" stroke-width="1.6"></path>
              <path d="M66 78 Q72 74 80 80 Q76 76 66 78 Z" stroke-width="1.6"></path>
              <path d="M66 66 Q60 60 52 64 Q58 60 66 66 Z" stroke-width="1.6"></path>
              <path d="M66 66 Q72 60 80 64 Q74 60 66 66 Z" stroke-width="1.6"></path>
              <path d="M66 54 Q60 48 54 50 Q60 46 66 54 Z" stroke-width="1.6"></path>
              <path d="M66 54 Q72 48 78 50 Q72 46 66 54 Z" stroke-width="1.6"></path>
              <path d="M66 44 Q62 38 58 38 Q62 36 66 44 Z" stroke-width="1.5"></path>
              <path d="M66 44 Q70 38 74 38 Q70 36 66 44 Z" stroke-width="1.5"></path>
              <!-- Cushion at base -->
              <path d="M58 92 L74 92 L76 100 L56 100 Z"></path>
            </g>

            </g></svg>`
    },
    'Venice': {
      label: 'Venice',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-venice)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-venice)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">

            <!-- Winged lion in side profile (passant), facing right -->
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Mane (sun-disc) -->
              <circle cx="84" cy="60" r="9"></circle>
              <!-- Mane points -->
              <g stroke-width="1.4">
                <line x1="84" y1="49" x2="84" y2="46"></line>
                <line x1="92" y1="52" x2="94" y2="50"></line>
                <line x1="93" y1="60" x2="96" y2="60"></line>
                <line x1="92" y1="68" x2="94" y2="70"></line>
                <line x1="76" y1="68" x2="74" y2="70"></line>
                <line x1="75" y1="60" x2="72" y2="60"></line>
                <line x1="76" y1="52" x2="74" y2="50"></line>
              </g>
              <!-- Snout -->
              <path d="M92 60 L98 62 L97 66 L92 65"></path>
              <!-- Body in passant -->
              <path d="M76 66 Q60 70 52 78 Q46 86 48 92 L80 92 Q86 86 84 78 Q82 72 78 68"></path>
              <!-- Wing (arc up and back from shoulder) -->
              <path d="M74 66 Q68 54 56 48 Q50 56 54 64 Q62 70 72 68"></path>
              <!-- Tail with curl -->
              <path d="M50 82 Q40 80 40 72 Q44 68 48 72"></path>
              <!-- Open book under paw -->
              <rect x="54" y="94" width="26" height="6" rx="0.8"></rect>
              <line x1="67" y1="94" x2="67" y2="100" stroke-width="1.2"></line>
              <!-- Pedestal -->
              <rect x="48" y="102" width="36" height="5" rx="1"></rect>
            </g>
            <!-- Eye -->
            <circle cx="86" cy="58" r="1" fill="currentColor"></circle>

            </g></svg>`
    },
    'Berlin': {
      label: 'Berlin',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-berlin)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-berlin)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">

            <!-- Rampant bear silhouette, side profile right-facing, paws raised -->
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Head -->
              <path d="M82 38 Q88 38 90 44 Q90 50 86 54 L80 56 Q76 56 74 52 Q74 46 76 42 Q78 38 82 38 Z"></path>
              <!-- Ear -->
              <path d="M76 38 Q74 33 78 33 Q80 35 80 38"></path>
              <!-- Snout -->
              <path d="M88 48 L93 50 L92 54 L86 53"></path>
              <!-- Body, side profile rampant -->
              <path d="M76 56 Q66 64 64 78 L64 96 Q66 102 72 102 L82 102 Q88 100 88 92 L88 70 Q88 60 82 56"></path>
              <!-- Front paw raised forward & up (claws) -->
              <path d="M76 64 Q66 60 58 64 Q64 68 72 70"></path>
              <!-- Front paw lower -->
              <path d="M76 76 Q66 72 60 76 Q66 80 74 80"></path>
              <!-- Hind paws -->
              <ellipse cx="72" cy="106" rx="6" ry="2"></ellipse>
              <ellipse cx="84" cy="106" rx="6" ry="2"></ellipse>
              <!-- Pedestal -->
              <rect x="48" y="110" width="36" height="4" rx="1"></rect>
            </g>
            <!-- Eye -->
            <circle cx="84" cy="46" r="0.9" fill="currentColor"></circle>
            <!-- Claws (small ticks) -->
            <g stroke="currentColor" stroke-width="1" stroke-linecap="round">
              <line x1="58" y1="63" x2="55" y2="62"></line>
              <line x1="58" y1="65" x2="55" y2="65"></line>
              <line x1="58" y1="67" x2="55" y2="68"></line>
            </g>

            </g></svg>`
    },
    'GoldenGlobe': {
      label: 'Golden Globe',
      svgIcon: `<svg viewBox="0 0 132 132" width="28" height="28">
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-globe)" stroke-width="1.4" opacity="0.95"></circle>
            <circle cx="66" cy="66" r="62" fill="none" stroke="var(--halo-globe)" stroke-width="3" opacity="0.25"></circle>
            <g transform="translate(-9.9 -17.95) scale(1.15)">

            <!-- Globe on cylindrical pedestal -->
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Globe sphere -->
              <circle cx="66" cy="60" r="20"></circle>
              <!-- Equator -->
              <ellipse cx="66" cy="60" rx="20" ry="6.5" stroke-width="1.5"></ellipse>
              <!-- Meridian -->
              <ellipse cx="66" cy="60" rx="6.5" ry="20" stroke-width="1.5"></ellipse>
              <!-- Latitude lines -->
              <line x1="48" y1="52" x2="84" y2="52" stroke-width="1" opacity="0.7"></line>
              <line x1="48" y1="68" x2="84" y2="68" stroke-width="1" opacity="0.7"></line>
              <!-- Connecting stem -->
              <line x1="66" y1="80" x2="66" y2="92" stroke-width="2.4"></line>
              <!-- Pedestal -->
              <rect x="54" y="92" width="24" height="5" rx="1"></rect>
              <rect x="48" y="97" width="36" height="6" rx="1"></rect>
            </g>

            </g></svg>`
    }
  };

  // Collect and dedup entries
  const seen = new Set();
  const entries = [];
  Object.entries(PERSON_AWARD_LOOKUP)
    .filter(([, v]) => v.person_id === personId)
    .forEach(([key]) => {
      const [festRaw, category, year, film] = key.split('|');
      const festival = festNormalise[festRaw] || festRaw;
      const dedupKey = `${festival}|${category}|${year}|${film}`;
      if (seen.has(dedupKey)) return;
      seen.add(dedupKey);

      let won = false;
      if (typeof PERSON_WINNERS_LOOKUP !== 'undefined' &&
          PERSON_WINNERS_LOOKUP[`${festival}|${category}|${year}|${film}`]) {
        won = true;
      }
      if (!won) {
        try {
          for (const tryYear of [parseInt(year), parseInt(year) + 1]) {
            const db = AWARDS_BROWSE_DATABASE?.[festival]?.[category]?.[tryYear];
            if (!db) continue;
            const winTitle = (db.winner?.title || '').toLowerCase().trim();
            const coWin = Array.isArray(db.winners) &&
              db.winners.some(w => (w.title || '').toLowerCase().trim() === film);
            if (winTitle === film || coWin) { won = true; break; }
          }
        } catch(e) {}
      }

      entries.push({ festival, category, year: parseInt(year), film, won });
    });

  // Hide the section entirely if this person has no award data.
  if (!entries.length) {
    section.hidden = true;
    glyphs.innerHTML = '';
    return;
  }

  // Group by festival
  const byFest = {};
  entries.forEach(e => {
    if (!byFest[e.festival]) byFest[e.festival] = { wins: [], noms: [] };
    if (e.won) byFest[e.festival].wins.push(e);
    else byFest[e.festival].noms.push(e);
  });

  // Always render all 6 festivals in a fixed 3x2 grid order.
  const festOrder = ['Oscar', 'BAFTA', 'Cannes', 'GoldenGlobe', 'Berlin', 'Venice'];
  const filmDisplay = f => f.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  glyphs.className = 'bio-awards-glyphs awards-glyphs-grid';
  glyphs.innerHTML = festOrder.map(fest => {
    const data = byFest[fest] || { wins: [], noms: [] };
    const wins = data.wins;
    const noms = data.noms;
    const hasWin = wins.length > 0;
    const hasNom = !hasWin && noms.length > 0;
    const total = wins.length + noms.length;
    const stateClass = hasWin ? 'has-wins has-win' : (hasNom ? 'has-noms nom-only' : 'no-data');
    const cfg = festConfig[fest] || { label: fest, svgIcon: '' };

    const allEntries = [...wins, ...noms].sort((a,b) => b.year - a.year);
    const tooltipRows = allEntries.length
      ? allEntries.map(e => `
        <div class="bio-glyph-tooltip-row">
          <span class="bio-glyph-tooltip-dot ${e.won ? 'win' : 'nom'}"></span>
          <span style="flex:1;min-width:0;word-break:break-word">${e.category} · ${filmDisplay(e.film)}</span>
          <span class="bio-glyph-tooltip-year">${e.year}</span>
        </div>`).join('')
      : `<div class="bio-glyph-tooltip-row" style="color: var(--ghost-gray); font-style: italic;">No awards data</div>`;

    const countBadge = total > 0
      ? `<span class="glyph-count-badge bio-glyph-count">${total}</span>`
      : '';

    return `
      <div class="bio-award-glyph-wrap award-glyph-tile ${stateClass}">
        <div class="bio-award-glyph-btn ${stateClass}" aria-label="${cfg.label} awards">
          ${cfg.svgIcon}
        </div>
        ${countBadge}
        <div class="bio-glyph-tooltip">
          <div class="bio-glyph-tooltip-title">${cfg.label}</div>
          ${tooltipRows}
          <div class="bio-glyph-tooltip-arrow"></div>
        </div>
      </div>`;
  }).join('');

  section.hidden = false;
}

// ============================================
// COLLABORATORS RENDERER
// ============================================

async function renderCollaborators(personId, movies) {
  const collabsList = document.getElementById("collabsList");
  if (!collabsList) return;
  
  collabsList.innerHTML = '<div style="text-align: center; color: #8892a6;">Loading collaborators...</div>';
  
  try {
    // Count collaborators from movie credits
    const collabCounts = new Map();
    
    // Fetch detailed credits for up to 20 movies
    const moviesToCheck = movies.slice(0, 20);
    
    for (const movie of moviesToCheck) {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`);
        const credits = await res.json();
        
        // Count cast (actors)
        (credits.cast || []).slice(0, 10).forEach(person => {
          if (person.id === personId) return; // Skip self
          const key = person.id;
          if (!collabCounts.has(key)) {
            collabCounts.set(key, {
              id: person.id,
              name: person.name,
              profile: person.profile_path,
              role: "Actor",
              count: 0
            });
          }
          collabCounts.get(key).count++;
        });
        
        // Count directors
        (credits.crew || []).filter(c => c.job === "Director").forEach(person => {
          if (person.id === personId) return;
          const key = person.id;
          if (!collabCounts.has(key)) {
            collabCounts.set(key, {
              id: person.id,
              name: person.name,
              profile: person.profile_path,
              role: "Director",
              count: 0
            });
          }
          collabCounts.get(key).count++;
          collabCounts.get(key).role = "Director"; // Prioritize director role
        });
      } catch (e) {
        // Skip failed fetches
      }
    }
    
    // Sort by count and take top 5
    const topCollabs = [...collabCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    if (topCollabs.length === 0) {
      collabsList.innerHTML = '<div style="text-align: center; color: #8892a6;">No collaborator data</div>';
      return;
    }
    
    collabsList.innerHTML = topCollabs.map(collab => {
      const photoUrl = collab.profile 
        ? `https://image.tmdb.org/t/p/w92${collab.profile}`
        : "https://placehold.co/40x40?text=?";
      return `
        <a class="collab-item" href="people-profile.html?id=${collab.id}">
          <img class="collab-photo" src="${photoUrl}" alt="${collab.name}">
          <div class="collab-info">
            <div class="collab-name">${collab.name}</div>
            <div class="collab-role">${collab.role}</div>
          </div>
          <div>
            <div class="collab-count">${collab.count}</div>
            <div class="collab-count-label">films</div>
          </div>
        </a>
      `;
    }).join("");
    
  } catch (e) {
    console.error("Failed to load collaborators:", e);
    collabsList.innerHTML = '<div style="text-align: center; color: #8892a6;">Error loading data</div>';
  }
}

// ============================================
// ACTIVITY CHART RENDERER
// ============================================

function renderActivity(movies) {
  const activityChart = document.getElementById("activityChart");
  if (!activityChart) return;
  
  // Group by decade
  const decadeCounts = {};
  let totalFilms = 0;
  let firstYear = Infinity;
  let lastYear = 0;
  
  movies.forEach(movie => {
    const year = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
    if (year && year > 1900) {
      const decade = Math.floor(year / 10) * 10;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      totalFilms++;
      firstYear = Math.min(firstYear, year);
      lastYear = Math.max(lastYear, year);
    }
  });
  
  if (Object.keys(decadeCounts).length === 0) {
    activityChart.innerHTML = '<div style="text-align: center; color: #8892a6;">No activity data</div>';
    return;
  }
  
  // Find max for scaling
  const maxCount = Math.max(...Object.values(decadeCounts));
  
  // Sort decades
  const sortedDecades = Object.keys(decadeCounts).sort((a, b) => a - b);
  
  // Calculate averages
  const yearsActive = lastYear - firstYear + 1;
  const filmsPerYear = totalFilms / yearsActive;

  // Random colour scheme for the bars on each render
  const ACTIVITY_BAR_SCHEMES = [
    'linear-gradient(90deg, #00d9ff, #d65db1)', // cyan → magenta
    'linear-gradient(90deg, #ffd700, #ff7f50)', // gold → orange
    'linear-gradient(90deg, #1dd1a1, #00d9ff)', // teal → cyan
    'linear-gradient(90deg, #a855f7, #ff6b9d)'  // purple → pink
  ];
  const barGradient = ACTIVITY_BAR_SCHEMES[Math.floor(Math.random() * ACTIVITY_BAR_SCHEMES.length)];

  activityChart.innerHTML = `
    <div class="activity-decades">
      ${sortedDecades.map(decade => {
        const count = decadeCounts[decade];
        const widthPercent = (count / maxCount) * 100;
        return `
          <div class="decade-row">
            <span class="decade-label">${decade}s</span>
            <div class="decade-bar-container">
              <div class="decade-bar" style="width: ${widthPercent}%; background: ${barGradient};">
                <span class="decade-count">${count}</span>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
    <div class="activity-summary">
      <div class="activity-stat">
        <span class="activity-stat-value">${yearsActive}</span>
        <span class="activity-stat-label">Years Active</span>
      </div>
      <div class="activity-stat">
        <span class="activity-stat-value">${filmsPerYear.toFixed(1)}</span>
        <span class="activity-stat-label">Films/Year</span>
      </div>
      <div class="activity-stat">
        <span class="activity-stat-value">${sortedDecades.length}</span>
        <span class="activity-stat-label">Decades</span>
      </div>
    </div>
  `;
}

// Genre colors - vibrant palette
/* Pie ring palette — well-separated hues so no two rings share a perceptually
   similar colour within a single pie. Indexed by render order (rank). With max
   6 rings and 8 palette entries, repeats are impossible. */
const PIE_RING_PALETTE = [
  '#00d9ff', // cyan
  '#ffd700', // gold
  '#ff4757', // red
  '#7bed9f', // green
  '#d65db1', // magenta
  '#ff7f50', // orange
  '#a55eea', // purple
  '#1dd1a1'  // teal
];

function getGenreColor(genreName, index) {
  return PIE_RING_PALETTE[index % PIE_RING_PALETTE.length];
}

function renderGenrePie(movies) {
  // Count genres with FRACTIONAL weighting
  // If a movie has 2 genres, each gets 0.5
  // If a movie has 3 genres, each gets 0.333
  const genreCounts = {};
  let totalWeight = 0;

  movies.forEach(movie => {
    const genres = movie.genre_ids || [];
    if (genres.length === 0) return;

    const weight = 1 / genres.length; // Fractional weight per genre

    genres.forEach(genreId => {
      const genreName = getGenreName(genreId);
      if (genreName) {
        genreCounts[genreName] = (genreCounts[genreName] || 0) + weight;
        totalWeight += weight;
      }
    });
  });

  // Sort by count and take top 7, group rest as "Other"
  const sortedRaw = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]);

  let displayGenres = sortedRaw.slice(0, 7);
  const otherGenres = sortedRaw.slice(7);

  // Add "Other" category if there are more genres
  if (otherGenres.length > 0) {
    const otherCount = otherGenres.reduce((sum, [_, count]) => sum + count, 0);
    displayGenres.push(["Other", otherCount]);
  }

  // Canonical sorted descending list with name + percent
  const sortedGenres = displayGenres
    .map(([name, count]) => ({
      name,
      count,
      percent: totalWeight > 0 ? (count / totalWeight) * 100 : 0
    }))
    .sort((a, b) => b.percent - a.percent);

  const canvas = document.getElementById('genrePie');
  const legendEl = document.getElementById('genreLegend');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W = 300, H = 300;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  if (sortedGenres.length === 0) {
    ctx.fillStyle = 'rgba(136, 146, 166, 0.8)';
    ctx.font = '15px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No genre data', W / 2, H / 2);
    canvas.setAttribute('aria-label', 'Genre breakdown orbital rings chart — no data');
    if (legendEl) legendEl.innerHTML = '';
    return;
  }

  const cx = W / 2, cy = H / 2;
  const maxR = 125, ringGap = 18, lineWidth = 8;

  // Cap to 6 rings — beyond that the ring radius collapses and Canvas arc() throws IndexSizeError.
  const drawGenres = sortedGenres.slice(0, 6);

  drawGenres.forEach((g, i) => {
    const r = maxR - i * ringGap;
    if (r < 4) return;
    const color = getGenreColor(g.name, i);
    const sweep = (g.percent / 100) * Math.PI * 2;
    const start = -Math.PI / 2;
    const end = start + sweep;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color + '22';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const ex = cx + r * Math.cos(end);
    const ey = cy + r * Math.sin(end);
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Centre dot
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 217, 255, 0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 217, 255, 0.5)';
  ctx.fill();

  // Render legend below the pie (DOM-based for sizing/wrapping control)
  if (legendEl) {
    legendEl.innerHTML = drawGenres.map((g, i) => {
      const color = getGenreColor(g.name, i);
      return `<span class="genre-legend-item">
        <span class="genre-legend-color" style="background:${color}"></span>
        <span class="genre-legend-label">${g.name}</span>
        <span class="genre-legend-count">${Math.round(g.percent)}%</span>
      </span>`;
    }).join('');
  }

  const top = sortedGenres[0];
  canvas.setAttribute(
    'aria-label',
    `Genre breakdown orbital rings chart — top genre ${top.name} at ${Math.round(top.percent)}%`
  );
}

// Genre ID to name mapping
function getGenreName(genreId) {
  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };
  return genres[genreId] || null;
}

function toggleBioPanel() {
  if (bioPanel) {
    const isExpanded = bioPanel.classList.contains("expanded");
    if (isExpanded) {
      bioPanel.classList.remove("expanded");
      bioPanel.classList.remove("visible");
    } else {
      // Reload current person's bio if in single-person mode
      if (people.length === 1) {
        loadPersonBio(people[0].id, 0);
      }
      bioPanel.classList.add("expanded");
      bioPanel.classList.add("visible");
    }
  }
}

function closeBioPanel() {
  if (bioPanel) {
    // Suppress the .bio-panel { transition: all 0.3s } width-collapse so the
    // close reads as a clean fade only — not a slide-to-the-left.
    const prev = bioPanel.style.transition;
    bioPanel.style.transition = 'none';
    bioPanel.classList.remove("expanded");
    requestAnimationFrame(() => {
      bioPanel.style.transition = prev;
    });
  }
}

// Initialize bio panel after main init (wait for people array)
setTimeout(initBioPanel, 1500);

// ============================================
// UNIFIED MEDIA MODE TOGGLE VISIBILITY
// ============================================

function updateMediaModeToggleVisibility() {
  const mediaModeToggle = document.getElementById('mediaModeToggle');
  const countLabel = document.getElementById('countLabel');
  const guestAppearancesFilter = document.getElementById('guestAppearancesFilter');

  // Show media mode toggle for person timelines
  const isPersonTimeline = people.length > 0;

  if (mediaModeToggle) mediaModeToggle.hidden = !isPersonTimeline;

  // Show guest appearances filter only when viewing TV or Both modes
  const showGuestFilter = isPersonTimeline && (currentMediaMode === 'tv' || currentMediaMode === 'both');
  if (guestAppearancesFilter) guestAppearancesFilter.hidden = !showGuestFilter;

  // Update count label based on mode
  if (countLabel) {
    if (currentMediaMode === 'both') {
      countLabel.textContent = 'Titles';
    } else if (currentMediaMode === 'movies') {
      countLabel.textContent = 'Films';
    } else {
      countLabel.textContent = 'Shows';
    }
  }

  // Initialize active state from localStorage
  if (mediaModeToggle && isPersonTimeline) {
    const savedMode = localStorage.getItem('timelineMediaMode') || 'movies';
    currentMediaMode = savedMode;
    mediaModeToggle.querySelectorAll('.media-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === savedMode);
    });
  }
}

/* ============================================================
   CONTEXT MENU — Right-click / Long-press — Added 2026-03-28
   Quick Watchlist + Shortlist actions on movie poster tiles.
   Desktop: right-click. Mobile: 500ms long-press.
   Uses watchlist-service.js and shortlist-service.js.
   ============================================================ */

(function initContextMenu() {
  const TILE_SELECTOR = '.timeline-card';
  const LONG_PRESS_MS = 500;
  const MOVE_THRESHOLD = 8;

  // Build menu element once
  const menu = document.createElement('div');
  menu.className = 'orbit-context-menu';
  menu.id = 'orbitContextMenu';
  menu.innerHTML = `
    <button class="context-menu-item context-watchlist" data-action="watchlist">
      <span class="og og-couch"></span>
      <span class="context-menu-label">Watch Later</span>
    </button>
    <button class="context-menu-item context-shortlist" data-action="shortlist">
      <span class="og og-sparkle"></span>
      <span class="context-menu-label">Add to Shortlist</span>
    </button>
    <button class="context-menu-item context-open-cube" data-action="cube">
      <span class="og og-film"></span>
      <span class="context-menu-label">Open Movie Cube</span>
    </button>`;
  document.body.appendChild(menu);

  let activeMovieId = null;
  let activeMovieTitle = null;
  let longPressTimer = null;
  let touchStartX = 0;
  let touchStartY = 0;

  function getMovieDataFromTile(tile) {
    const id = parseInt(tile.dataset.movieId);
    const titleEl = tile.querySelector('.card-title, .timeline-title, h3, h4');
    const title = titleEl ? titleEl.textContent.trim() : '';
    const posterEl = tile.querySelector('img');
    const poster = posterEl ? posterEl.src.replace(/.*\/w\d+/, '') : '';
    return { id, title, poster };
  }

  function openMenu(x, y, movieId, movieTitle) {
    closeMenu();
    activeMovieId = movieId;
    activeMovieTitle = movieTitle;

    // Update states
    const watchBtn = menu.querySelector('.context-watchlist');
    const shortBtn = menu.querySelector('.context-shortlist');

    const inWatchlist = typeof isInWatchlist === 'function' && isInWatchlist(movieId);
    const inShortlist = typeof isInShortlist === 'function' && isInShortlist(movieId);
    const shortlistFull = typeof getShortlistCount === 'function' && getShortlistCount() >= 20;

    watchBtn.className = 'context-menu-item context-watchlist' + (inWatchlist ? ' is-added' : '');
    watchBtn.querySelector('.context-menu-label').textContent = inWatchlist ? 'Watchlisted' : 'Watch Later';

    if (shortlistFull && !inShortlist) {
      shortBtn.className = 'context-menu-item context-shortlist is-disabled';
      shortBtn.querySelector('.context-menu-label').textContent = 'Shortlist Full';
    } else {
      shortBtn.className = 'context-menu-item context-shortlist' + (inShortlist ? ' is-added' : '');
      shortBtn.querySelector('.context-menu-label').textContent = inShortlist ? 'Shortlisted' : 'Add to Shortlist';
    }

    menu.classList.add('is-open');

    // Position with viewport edge detection
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    menu.style.left = (x + mw > vw ? Math.max(0, x - mw) : x) + 'px';
    menu.style.top = (y + mh > vh ? Math.max(0, y - mh) : y) + 'px';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    activeMovieId = null;
    activeMovieTitle = null;
  }

  function showConfirmation(text) {
    menu.innerHTML = `<div class="context-menu-confirmation">${text}</div>`;
    setTimeout(() => {
      closeMenu();
      // Restore original buttons
      menu.innerHTML = `
        <button class="context-menu-item context-watchlist" data-action="watchlist">
          <span class="og og-couch"></span>
          <span class="context-menu-label">Watch Later</span>
        </button>
        <button class="context-menu-item context-shortlist" data-action="shortlist">
          <span class="og og-sparkle"></span>
          <span class="context-menu-label">Add to Shortlist</span>
        </button>
        <button class="context-menu-item context-open-cube" data-action="cube">
          <span class="og og-film"></span>
          <span class="context-menu-label">Open Movie Cube</span>
        </button>`;
    }, 1500);
  }

  // Menu item clicks
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.context-menu-item');
    if (!item || !activeMovieId) return;
    if (item.classList.contains('is-disabled')) return;

    const action = item.dataset.action;

    if (action === 'watchlist') {
      if (typeof isInWatchlist === 'function' && isInWatchlist(activeMovieId)) {
        removeFromWatchlist(activeMovieId);
        showConfirmation('Removed from Watchlist');
      } else if (typeof addToWatchlist === 'function') {
        addToWatchlist({ id: activeMovieId, title: activeMovieTitle });
        showConfirmation('Added to Watchlist');
      }
    } else if (action === 'shortlist') {
      if (typeof isInShortlist === 'function' && isInShortlist(activeMovieId)) {
        removeFromShortlist(activeMovieId);
        showConfirmation('Removed from Shortlist');
      } else if (typeof addToShortlist === 'function') {
        addToShortlist({ id: activeMovieId, title: activeMovieTitle });
        showConfirmation('Added to Shortlist');
      }
    } else if (action === 'cube') {
      closeMenu();
      if (typeof openMovieCube === 'function') openMovieCube(activeMovieId);
    }
  });

  // Desktop: right-click
  document.addEventListener('contextmenu', (e) => {
    const tile = e.target.closest(TILE_SELECTOR);
    if (!tile) return;
    if (tile.dataset.mediaType === 'tv') return; // TV shows use series.html
    e.preventDefault();
    const data = getMovieDataFromTile(tile);
    if (data.id) openMenu(e.clientX, e.clientY, data.id, data.title);
  });

  // Mobile: long-press
  document.addEventListener('touchstart', (e) => {
    const tile = e.target.closest(TILE_SELECTOR);
    if (!tile || tile.dataset.mediaType === 'tv') return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      tile.classList.add('tile-long-press-pulse');
      setTimeout(() => tile.classList.remove('tile-long-press-pulse'), 200);

      const rect = tile.getBoundingClientRect();
      const data = getMovieDataFromTile(tile);
      if (data.id) openMenu(rect.left + rect.width / 2, rect.top + rect.height / 2, data.id, data.title);
    }, LONG_PRESS_MS);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!longPressTimer) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });

  // Dismiss
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ============================================================
   COSMIC BACKGROUND CANVAS — twinkling stars + nebula blobs.
   Always on; no theme branching. Renders 320 twinkling stars and
   three soft nebula blobs into #orbit-bg-canvas.
   ============================================================ */
function initBackground() {
  const canvas = document.getElementById('orbit-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let stars = [];
  let width = 0, height = 0;
  let rafId = null;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    seedStars();
  }

  function seedStars() {
    stars = [];
    for (let i = 0; i < 320; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.2 + Math.random() * 1.2,
        baseOpacity: 0.1 + Math.random() * 0.8,
        twinkleSpeed: 0.001 + Math.random() * 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawNebula() {
    const blobs = [
      { cx: 0.15, cy: 0.30, r: 0.18, color: [80, 30, 160], a: 0.09 },
      { cx: 0.65, cy: 0.20, r: 0.15, color: [0, 80, 140], a: 0.08 },
      { cx: 0.40, cy: 0.60, r: 0.12, color: [120, 40, 80], a: 0.07 }
    ];
    for (const b of blobs) {
      const x = b.cx * width;
      const y = b.cy * height;
      const r = b.r * width;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.a})`);
      grad.addColorStop(1, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const o = s.baseOpacity * (0.4 + 0.6 * Math.sin(t * s.twinkleSpeed + s.phase));
      ctx.fillStyle = `rgba(190, 215, 255, ${Math.max(0, Math.min(1, o))})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    drawNebula();
    rafId = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resize();
    rafId = requestAnimationFrame(frame);
  });

  rafId = requestAnimationFrame(frame);
}

