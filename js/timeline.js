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

// Randomized gradient for this session
let currentGradientId = "lineGrad" + (Math.floor(Math.random() * 4) + 1);

// DOM Elements
let timelineTitle, timelineSubtitle, movieCount;
let timelineTrack, multiTracks, timelineViewport;
let sacredSvg, sacredLines;
let decadeFilter, yearFilter, ratingFilter, reverseBtn;
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
window.addEventListener("resize", debounce(renderCurrentView, 200));

function init() {
  cacheElements();
  
  // Initialize the shared movie cube component
  initMovieCube({
    onPersonClick: async (personId, personName) => {
      // Add person to timeline
      closeMovieCube();
      await addPerson(parseInt(personId));
    },
    onAnchorClick: (movie) => {
      localStorage.setItem("anchorMovie", JSON.stringify(movie));
      window.location.href = "constellation.html";
    }
  });
  
  // Show "Back to Results" link if coming from results page
  const backToResults = document.getElementById("backToResults");
  if (localStorage.getItem("returnToResults") === "true" && backToResults) {
    backToResults.hidden = false;
    localStorage.removeItem("returnToResults"); // Clear after showing
  }
  
  // Check for URL parameters (from game or direct link)
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const searchType = urlParams.get('type');
  
  if (searchQuery && searchType) {
    // Load from URL parameter search
    loadFromUrlSearch(searchQuery, searchType);
  } else {
    loadInitialData();
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
  const totalCount = movies.length + tvShows.length;
  const countParts = [];
  if (movies.length) countParts.push(`${movies.length} Films`);
  if (tvShows.length) countParts.push(`${tvShows.length} Shows`);
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
    'acting': '🎭 Acting',
    'directing': '🎬 Directing',
    'producing': '🎥 Producing',
    'writing': '✍️ Writing',
    'cinematography': '📷 Cinematography',
    'music': '🎵 Music',
    'editing': '✂️ Editing',
    'other_crew': '🎞️ Other Crew'
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
  
  allMovies = movies.filter(m => m.poster_path);
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

  // Build genre filter from collection movies
  const genreIds = new Set();
  allMovies.forEach(m => {
    (m.genre_ids || []).forEach(g => genreIds.add(g));
  });

  if (genreIds.size > 0) {
    const controlsRight = document.querySelector('.controls-right');
    if (controlsRight && !document.getElementById('genreFilter')) {
      const sel = document.createElement('select');
      sel.id = 'genreFilter';
      sel.className = 'filter-select';
      sel.title = 'Filter by genre';
      let opts = '<option value="all">All Genres</option>';
      [...genreIds].sort((a, b) => (TMDB_GENRE_MAP[a] || '').localeCompare(TMDB_GENRE_MAP[b] || '')).forEach(gid => {
        const name = TMDB_GENRE_MAP[gid] || `Genre ${gid}`;
        opts += `<option value="${gid}">${name}</option>`;
      });
      sel.innerHTML = opts;
      sel.addEventListener('change', () => applyFiltersAndSort());
      controlsRight.prepend(sel);
    }
  }

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
  
  // Genre filter (movie mode)
  const genreFilter2 = document.getElementById('genreFilter');
  const genreVal = genreFilter2?.value || 'all';

  const filterFn = (m) => {
    // Exclude unreleased from main timeline
    if (isUnreleased(m)) return false;

    // Features only filter (exclude documentaries and TV movies)
    if (featuresOnly && isNonFeature(m)) return false;

    // Genre filter (movie mode)
    if (genreVal !== 'all') {
      const genres = m.genre_ids || [];
      if (!genres.includes(parseInt(genreVal))) return false;
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
    return;
  }
  
  upcomingSection.hidden = false;
  
  // Sort by release date
  movies.sort((a, b) => new Date(a.release_date || "9999") - new Date(b.release_date || "9999"));
  
  upcomingTrack.innerHTML = movies.slice(0, 10).map(movie => {
    const posterUrl = movie.poster_path 
      ? `${TMDB_IMG}w92${movie.poster_path}`
      : 'https://placehold.co/40x60?text=?';
    const releaseDate = movie.release_date || 'TBA';
    
    return `
      <div class="upcoming-card" data-movie-id="${movie.id}">
        <img src="${posterUrl}" alt="${movie.title}">
        <div class="upcoming-info">
          <div class="title">${movie.title}</div>
          <div class="date">📅 ${releaseDate}</div>
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
    cardWidth = 300;
    cardHeight = 450;
    cardGap = 60;
  } else if (numCards <= 10) {
    // Small collection - bigger cards
    cardWidth = 260;
    cardHeight = 390;
    cardGap = 45;
  } else if (numCards <= 25) {
    // Medium collection
    cardWidth = 220;
    cardHeight = 330;
    cardGap = 35;
  } else {
    // Large collection
    cardWidth = 180;
    cardHeight = 270;
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


  // Clamp scroll position so viewport doesn't show excess space
  const maxScroll = Math.max(0, totalWidth - vpWidth);
  if (timelineViewport.scrollLeft > maxScroll) {
    timelineViewport.scrollLeft = maxScroll;
  }

  // Draw sacred line after cards render
  setTimeout(() => drawSacredLine(chronoSorted), 100);

  // Update timeline width to fit content
  updateTimelineWidth();
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
  
  // Clamp scroll position so viewport doesn't show excess space
  const vpWidth = timelineViewport.offsetWidth;
  const maxScroll = Math.max(0, totalWidth - vpWidth);
  if (timelineViewport.scrollLeft > maxScroll) {
    timelineViewport.scrollLeft = maxScroll;
  }

  // Draw sacred lines with convergence
  setTimeout(() => drawMultiSacredLines(trackPaths, totalWidth, vpHeight), 100);

  // Show mini-map for multi-actor timelines
  setTimeout(() => showMinimap(), 150);
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

  card.innerHTML = `
    <div class="card-glow"></div>
    <div class="card-inner">
      <button class="card-delete" onclick="event.stopPropagation(); deleteItem(${movie.id}, '${movie.media_type || 'movie'}')">✕</button>
      ${tvBadge}
      <img class="card-poster" src="${TMDB_IMG}${posterSize}${movie.poster_path}" alt="${title}" loading="lazy"
           onerror="this.src='https://placehold.co/${Math.round(width)}x${Math.round(height)}?text=?'">
    </div>
    <div class="card-node"></div>
    ${tvHoverInfo}
    <div class="card-meta">
      <div class="card-meta-row">
        <div class="card-rating">⭐ ${rating}</div>
        <div class="card-year">${yearDisplay}</div>
      </div>
      ${valueDisplay}
      <div class="card-title">${title}</div>
    </div>
  `;

  if (isTv) {
    // For TV shows, clicking navigates to TV show page
    card.addEventListener("click", () => {
      window.location.href = `series.html?id=${movie.id}`;
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
      <button class="card-delete" onclick="event.stopPropagation(); deleteItem(${movie.id}, '${movie.media_type || 'movie'}')">✕</button>
      ${tvBadge}
      <img class="card-poster" src="${TMDB_IMG}w300${movie.poster_path}" alt="${title}" loading="lazy"
           onerror="this.src='https://placehold.co/${width}x${height}?text=?'">
      <div class="card-overlay">
        <div class="card-rating">⭐ ${rating}</div>
        <div class="card-year">${year || ''}</div>
        <div class="card-title">${title}</div>
      </div>
    </div>
    <div class="convergence-badge">${dots}</div>
  `;

  if (isTv) {
    card.addEventListener("click", () => {
      window.location.href = `series.html?id=${movie.id}`;
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
  movies.forEach(movie => {
    const card = timelineTrack.querySelector(`[data-movie-id="${movie.id}"]`);
    if (card) {
      const left = parseFloat(card.style.left) || 0;
      const top = parseFloat(card.style.top) || 0;
      const width = card.offsetWidth || 100;
      const height = card.offsetHeight || 150;

      if (left > 0 || top > 0) {
        // Connect through the node at bottom of card
        points.push({
          x: left + width / 2,
          y: top + height + 8 // Position at the card node
        });
      }
    }
  });

  // Only proceed if we have enough points
  if (points.length < 2) return;

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
  outerGlow.setAttribute("stroke-width", "20");
  outerGlow.style.filter = "blur(8px)";

  // Middle glow layer
  const midGlow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  midGlow.setAttribute("d", pathD);
  midGlow.setAttribute("class", "sacred-line-glow");
  midGlow.setAttribute("stroke", "url(#cosmicGradient)");
  midGlow.setAttribute("stroke-width", "10");
  midGlow.style.filter = "blur(4px)";
  midGlow.style.opacity = "0.25";

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
  window.location.href = "constellation.html";
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

function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
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
  // Sort
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      applyFiltersAndSort();
    });
  });
  
  // Reverse
  reverseBtn?.addEventListener("click", () => {
    isReversed = !isReversed;
    reverseBtn.classList.toggle("active", isReversed);
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
  modalClose?.addEventListener("click", closeAddPersonModal);
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
  popupClose?.addEventListener("click", closePopup);
  popupOverlay?.addEventListener("click", (e) => { if (e.target === popupOverlay) closePopup(); });
  flipCard?.addEventListener("click", (e) => {
    if (!e.target.closest(".popup-btn, .trivia-option")) flipToNext();
  });
  
  // Trailer
  trailerBtn?.addEventListener("click", (e) => { e.stopPropagation(); playTrailer(); });
  trailerClose?.addEventListener("click", closeTrailer);
  trailerOverlay?.addEventListener("click", (e) => { if (e.target === trailerOverlay) closeTrailer(); });
  
  // Anchor
  anchorBtn?.addEventListener("click", (e) => { e.stopPropagation(); makeAnchorStar(); });
  
  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (trailerOverlay && !trailerOverlay.hidden) closeTrailer();
      else if (popupOverlay && !popupOverlay.hidden) closePopup();
      else if (addPersonModal && !addPersonModal.hidden) closeAddPersonModal();
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
    bioClose.addEventListener("click", closeBioPanel);
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
    const res = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`);
    const person = await res.json();
    console.log("Person data loaded:", person.name);
    
    const bioPhoto = document.getElementById("bioPhoto");
    const bioName = document.getElementById("bioName");
    const bioRole = document.getElementById("bioRole");
    const bioDates = document.getElementById("bioDates");
    const bioMemorial = document.getElementById("bioMemorial");
    const bioBirthplace = document.getElementById("bioBirthplace");
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
    
    // Format dates
    if (bioDates) {
      const birth = person.birthday ? new Date(person.birthday).getFullYear() : null;
      const death = person.deathday ? new Date(person.deathday).getFullYear() : null;
      
      if (birth && death) {
        bioDates.textContent = `${birth} – ${death}`;
      } else if (birth) {
        bioDates.textContent = `Born ${birth}`;
      } else {
        bioDates.textContent = "";
      }
    }
    
    // Memorial banner for deceased
    if (bioMemorial) {
      bioMemorial.hidden = !person.deathday;
    }
    
    if (bioBirthplace) {
      bioBirthplace.textContent = person.place_of_birth || "";
      bioBirthplace.hidden = !person.place_of_birth;
    }
    
    if (bioText) {
      const bio = person.biography || "No biography available.";
      const needsTruncation = bio.length > 400;

      // Set initial truncated text
      bioText.textContent = needsTruncation ? bio.substring(0, 400) + "..." : bio;

      // Remove any existing read-more button (from previous person render)
      const existingBtn = bioText.parentElement?.querySelector('.bio-read-more');
      if (existingBtn) existingBtn.remove();

      // Add read more / read less toggle if needed
      if (needsTruncation) {
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'bio-read-more';
        readMoreBtn.textContent = 'Read more';
        let expanded = false;

        readMoreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          expanded = !expanded;
          bioText.textContent = expanded ? bio : bio.substring(0, 400) + "...";
          readMoreBtn.textContent = expanded ? 'Read less' : 'Read more';
        });

        bioText.after(readMoreBtn);
      }
    }
    
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
    
    // Store current person for viz tabs
    currentBioPersonIndex = personIdx;
    
  } catch (e) {
    console.error("Failed to load person bio:", e);
  }
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
        <div class="collab-item">
          <img class="collab-photo" src="${photoUrl}" alt="${collab.name}">
          <div class="collab-info">
            <div class="collab-name">${collab.name}</div>
            <div class="collab-role">${collab.role}</div>
          </div>
          <div>
            <div class="collab-count">${collab.count}</div>
            <div class="collab-count-label">films</div>
          </div>
        </div>
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
  
  activityChart.innerHTML = `
    <div class="activity-decades">
      ${sortedDecades.map(decade => {
        const count = decadeCounts[decade];
        const widthPercent = (count / maxCount) * 100;
        return `
          <div class="decade-row">
            <span class="decade-label">${decade}s</span>
            <div class="decade-bar-container">
              <div class="decade-bar" style="width: ${widthPercent}%">
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
const GENRE_COLORS = {
  "Action": "#ff4757",
  "Adventure": "#ff7f50",
  "Animation": "#ffd700",
  "Comedy": "#7bed9f",
  "Crime": "#5352ed",
  "Documentary": "#a55eea",
  "Drama": "#00d9ff",
  "Family": "#ff6b81",
  "Fantasy": "#d65db1",
  "History": "#c9a227",
  "Horror": "#2f3542",
  "Music": "#1dd1a1",
  "Mystery": "#576574",
  "Romance": "#ff6b9d",
  "Science Fiction": "#00ff88",
  "TV Movie": "#747d8c",
  "Thriller": "#eb4d4b",
  "War": "#6c5ce7",
  "Western": "#cd6133",
  "Other": "#4a5568"
};

function getGenreColor(genreName, index) {
  return GENRE_COLORS[genreName] || `hsl(${(index * 47) % 360}, 70%, 55%)`;
}

function renderGenrePie(movies) {
  const pieContainer = document.getElementById("genrePie");
  const legendContainer = document.getElementById("genreLegend");
  const tooltip = document.getElementById("genreTooltip");
  
  if (!pieContainer || !legendContainer) return;
  
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
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]);
  
  let displayGenres = sortedGenres.slice(0, 7);
  const otherGenres = sortedGenres.slice(7);
  
  // Add "Other" category if there are more genres
  if (otherGenres.length > 0) {
    const otherCount = otherGenres.reduce((sum, [_, count]) => sum + count, 0);
    displayGenres.push(["Other", otherCount]);
  }
  
  if (displayGenres.length === 0) {
    pieContainer.innerHTML = '<text x="100" y="100" text-anchor="middle" fill="#666">No genre data</text>';
    legendContainer.innerHTML = '';
    return;
  }
  
  // Build pie slices
  const cx = 100, cy = 100, r = 80;
  let currentAngle = -90; // Start at top
  let svgContent = '';
  
  displayGenres.forEach(([genre, count], index) => {
    const percentage = (count / totalWeight) * 100;
    const angle = (count / totalWeight) * 360;
    const color = getGenreColor(genre, index);
    
    // Calculate arc
    const startAngle = currentAngle;
    // For last slice, ensure it ends at exactly 270 (-90 + 360)
    const isLast = index === displayGenres.length - 1;
    const endAngle = isLast ? 270 : currentAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    // Use large arc if angle > 180, accounting for last slice
    const sliceAngle = isLast ? (270 - startAngle) : angle;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    svgContent += `
      <path 
        class="genre-pie-slice" 
        d="${pathD}" 
        fill="${color}"
        data-genre="${genre}"
        data-percent="${percentage.toFixed(1)}"
        data-count="${Math.round(count)}"
      />
    `;
    
    currentAngle = endAngle;
  });
  
  pieContainer.innerHTML = svgContent;
  
  // Build legend
  let legendHtml = '';
  displayGenres.forEach(([genre, count], index) => {
    const percentage = (count / totalWeight) * 100;
    const color = getGenreColor(genre, index);
    legendHtml += `
      <div class="genre-legend-item" data-genre="${genre}">
        <span class="genre-legend-color" style="background: ${color}"></span>
        <span class="genre-legend-label">${genre}</span>
      </div>
    `;
  });
  legendContainer.innerHTML = legendHtml;
  
  // Tooltip handlers
  const slices = pieContainer.querySelectorAll('.genre-pie-slice');
  slices.forEach(slice => {
    slice.addEventListener('mouseenter', (e) => {
      const genre = slice.dataset.genre;
      const percent = slice.dataset.percent;
      const count = parseFloat(slice.dataset.count);
      const displayCount = Math.round(count);

      tooltip.innerHTML = `
        <span class="tooltip-genre">${genre}</span>
        <span class="tooltip-percent">${percent}%</span>
        <span class="tooltip-count">${displayCount} film${displayCount !== 1 ? 's' : ''}</span>
      `;
      tooltip.classList.add('visible');
    });
    
    slice.addEventListener('mousemove', (e) => {
      const rect = pieContainer.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 40) + 'px';
    });
    
    slice.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
  
  // Legend hover highlights
  const legendItems = legendContainer.querySelectorAll('.genre-legend-item');
  legendItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const genre = item.dataset.genre;
      slices.forEach(slice => {
        if (slice.dataset.genre === genre) {
          slice.style.filter = 'brightness(1.3)';
          slice.style.transform = 'scale(1.05)';
        } else {
          slice.style.opacity = '0.5';
        }
      });
    });
    
    item.addEventListener('mouseleave', () => {
      slices.forEach(slice => {
        slice.style.filter = '';
        slice.style.transform = '';
        slice.style.opacity = '';
      });
    });
  });
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
    bioPanel.classList.remove("expanded");
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