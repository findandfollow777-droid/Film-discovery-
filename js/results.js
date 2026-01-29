/* ============================================
   ORBIT RESULTS PAGE - JavaScript
   Grid display, search, sorting, pagination, popup, trivia
============================================ */

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";
const TRIVIA_API_URL = "https://opentdb.com/api.php?amount=3&category=11&type=multiple";
const MOVIES_PER_PAGE = 100; // 10x10 grid

let allMovies = [];
let sortedMovies = [];
let currentPage = 1;
let totalPages = 1;
let currentSort = "chronology";
let isReversed = false;
let currentMovieData = null;
let currentFlipSide = 1;

// Streaming filter state (read from localStorage, set on index page)

// Vibe slider state
let vibeSettings = {
  mood: 50,      // 0=Light, 100=Dark
  pace: 50,      // 0=Slow burn, 100=Intense
  familiarity: 50,  // 0=Familiar, 100=Challenge me
  depth: 50      // 0=Escapism, 100=Make me think
};

// Genre classifications for vibe calculations
const GENRE_VIBES = {
  // Mood: Light vs Dark (higher = darker)
  mood: {
    35: 10,   // Comedy - very light
    16: 15,   // Animation - light
    10751: 15, // Family - light
    10402: 25, // Music - light
    10749: 30, // Romance - light-ish
    12: 40,   // Adventure - neutral
    14: 45,   // Fantasy - neutral
    878: 50,  // Sci-Fi - neutral
    28: 55,   // Action - slightly dark
    9648: 65, // Mystery - dark
    53: 70,   // Thriller - dark
    80: 75,   // Crime - dark
    10752: 80, // War - dark
    27: 90    // Horror - very dark
  },
  // Pace: Slow burn vs Intense (higher = more intense)
  pace: {
    99: 10,   // Documentary - very slow
    18: 25,   // Drama - slow
    10749: 30, // Romance - slow
    36: 35,   // History - slow
    10402: 40, // Music - moderate
    35: 45,   // Comedy - moderate
    9648: 50, // Mystery - moderate
    14: 55,   // Fantasy - moderate
    878: 60,  // Sci-Fi - moderate-fast
    12: 65,   // Adventure - fast
    80: 70,   // Crime - fast
    53: 80,   // Thriller - intense
    28: 85,   // Action - very intense
    27: 75,   // Horror - intense
    10752: 80 // War - intense
  },
  // Depth: Escapism vs Think (higher = more thoughtful)
  depth: {
    28: 15,   // Action - escapism
    12: 20,   // Adventure - escapism
    14: 25,   // Fantasy - escapism
    16: 30,   // Animation - escapism
    10751: 30, // Family - escapism
    35: 35,   // Comedy - light escapism
    27: 40,   // Horror - light escapism
    10749: 45, // Romance - neutral
    878: 55,  // Sci-Fi - can be thoughtful
    9648: 60, // Mystery - thoughtful
    53: 55,   // Thriller - somewhat thoughtful
    80: 65,   // Crime - thoughtful
    18: 70,   // Drama - thoughtful
    10752: 75, // War - very thoughtful
    36: 80,   // History - very thoughtful
    99: 90    // Documentary - most thoughtful
  }
};

// DOM Elements - will be set in init()
let moviesGrid, resultsCount, resultsSubtitle, pageInfo, activeFilters;
let prevPageBtn, nextPageBtn, pageNumbers, reverseBtn;
let resultsSearchInput, resultsSearchDropdown;
let moviePopupOverlay, popupClose, movieCube, popupPosterLarge;
let popupTitle, popupYear, popupRating, popupRuntime, popupSynopsis, popupGenres;
let directorInfo, castGrid, allCastBtn, allCastOverlay, allCastClose, allCastTimeline;
let trailerEmbed, playTrailerBtn;
let statRuntime, statBudget, statRevenue, statPopularity, statVotes, statLanguage, productionCompanies;
let similarGrid, anchorBtn;
let trailerOverlay, trailerClose, trailerFullscreen, trailerContainer;
let whereToWatch;

// Vibe slider elements
let vibeMood, vibePace, vibeFamiliarity, vibeDepth, vibeReset;

let currentCubeFace = 1;

// Initialize
document.addEventListener("DOMContentLoaded", init);

function init() {
  try {
    // Get all DOM elements
    moviesGrid = document.getElementById("moviesGrid");
    resultsCount = document.getElementById("resultsCount");
    resultsSubtitle = document.getElementById("resultsSubtitle");
    pageInfo = document.getElementById("pageInfo");
    activeFilters = document.getElementById("activeFilters");
    prevPageBtn = document.getElementById("prevPage");
    nextPageBtn = document.getElementById("nextPage");
    pageNumbers = document.getElementById("pageNumbers");
    reverseBtn = document.getElementById("reverseBtn");
    
    resultsSearchInput = document.getElementById("resultsSearchInput");
    resultsSearchDropdown = document.getElementById("resultsSearchDropdown");
    
    // 3D Cube elements
    moviePopupOverlay = document.getElementById("moviePopupOverlay");
    popupClose = document.getElementById("popupClose");
    movieCube = document.getElementById("movieCube");
    popupPosterLarge = document.getElementById("popupPosterLarge");
    popupTitle = document.getElementById("popupTitle");
    popupYear = document.getElementById("popupYear");
    popupRating = document.getElementById("popupRating");
    popupRuntime = document.getElementById("popupRuntime");
    popupSynopsis = document.getElementById("popupSynopsis");
    popupGenres = document.getElementById("popupGenres");
    whereToWatch = document.getElementById("whereToWatch");

    // Cast face elements
    directorInfo = document.getElementById("directorInfo");
    castGrid = document.getElementById("castGrid");
    allCastBtn = document.getElementById("allCastBtn");
    allCastOverlay = document.getElementById("allCastOverlay");
    allCastClose = document.getElementById("allCastClose");
    allCastTimeline = document.getElementById("allCastTimeline");
    
    // Trailer face elements
    trailerEmbed = document.getElementById("trailerEmbed");
    playTrailerBtn = document.getElementById("playTrailerBtn");
    
    // Stats face elements
    statRuntime = document.getElementById("statRuntime");
    statBudget = document.getElementById("statBudget");
    statRevenue = document.getElementById("statRevenue");
    statPopularity = document.getElementById("statPopularity");
    statVotes = document.getElementById("statVotes");
    statLanguage = document.getElementById("statLanguage");
    productionCompanies = document.getElementById("productionCompanies");
    
    // Similar face elements
    similarGrid = document.getElementById("similarGrid");
    anchorBtn = document.getElementById("anchorBtn");
    
    trailerOverlay = document.getElementById("trailerOverlay");
    trailerClose = document.getElementById("trailerClose");
    trailerFullscreen = document.getElementById("trailerFullscreen");
    trailerContainer = document.getElementById("trailerContainer");
    
    // Vibe slider elements
    vibeMood = document.getElementById("vibeMood");
    vibePace = document.getElementById("vibePace");
    vibeFamiliarity = document.getElementById("vibeFamiliarity");
    vibeDepth = document.getElementById("vibeDepth");
    vibeReset = document.getElementById("vibeReset");
    
    // Verify critical elements exist
    if (!moviesGrid) {
      console.error("Critical element moviesGrid not found");
      return;
    }
    
    // Check for single movie mode (from quick search)
    const resultsMode = localStorage.getItem("resultsMode");
    const singleMovieData = localStorage.getItem("singleMovie");
    
    console.log("Checking single movie mode:", resultsMode, singleMovieData ? "has data" : "no data");
    
    if (resultsMode === "single" && singleMovieData) {
      try {
        const movie = JSON.parse(singleMovieData);
        console.log("Single movie mode active:", movie.title);
        allMovies = [movie];
        
        // Clear the single movie data AFTER processing
        localStorage.removeItem("resultsMode");
        localStorage.removeItem("singleMovie");
        
        // Update UI for single movie - use movie name as title
        const resultsTitle = document.getElementById("resultsTitle");
        const resultsSubtitleEl = document.getElementById("resultsSubtitle");
        const resultsCountEl = document.getElementById("resultsCount");
        
        console.log("Title element:", resultsTitle);
        
        if (resultsTitle) {
          resultsTitle.textContent = movie.title;
          console.log("Set title to:", movie.title);
        }
        if (resultsCountEl) resultsCountEl.textContent = "1";
        if (resultsSubtitleEl) {
          const year = movie.release_date ? movie.release_date.split("-")[0] : "";
          resultsSubtitleEl.textContent = year ? `${year} • Standalone Film` : "Standalone Film";
        }
        
        // Show the movie prominently
        processMovies();
        setupEventListeners();
        
        console.log("Single movie mode complete:", movie.title);
        return;
      } catch (e) {
        console.error("Failed to parse single movie:", e);
        localStorage.removeItem("resultsMode");
        localStorage.removeItem("singleMovie");
      }
    }
    
    // Load movies from localStorage (normal mode)
    const moviesData = localStorage.getItem("movies");
    const filtersData = localStorage.getItem("orbitFilters");
    
    if (!moviesData) {
      showEmptyState("No movies found. Return to Orbit to search.");
      setupEventListeners();
      return;
    }
    
    try {
      allMovies = JSON.parse(moviesData);
    } catch (e) {
      console.error("Failed to parse movies data:", e);
      showEmptyState("Error loading movies. Please try a new search.");
      return;
    }
    
    // Verify movies is an array
    if (!Array.isArray(allMovies)) {
      console.error("Movies data is not an array");
      showEmptyState("Error loading movies. Please try a new search.");
      return;
    }
    
    // Display active filters
    if (filtersData) {
      try {
        displayActiveFilters(JSON.parse(filtersData));
      } catch (e) {
        console.error("Failed to parse filters:", e);
      }
    }
    
    // Check if results were capped
    const wasCapped = localStorage.getItem("resultsCapped");
    const totalAvailable = localStorage.getItem("totalAvailable");
    if (wasCapped === "true" && totalAvailable) {
      showCappedBanner(totalAvailable);
    }
    
    // Process and display
    processMovies();
    setupEventListeners();
    
    console.log("Results page initialized with", allMovies.length, "movies");
    
  } catch (error) {
    console.error("Init error:", error);
    if (moviesGrid) {
      showEmptyState("An error occurred. Please try again.");
    }
  }
}

function displayActiveFilters(filters) {
  if (!activeFilters) return;
  
  if (!filters || filters.length === 0) {
    activeFilters.innerHTML = '<p class="no-filters">No filters applied</p>';
    return;
  }
  
  activeFilters.innerHTML = filters.map(f => `
    <div class="filter-tag">${f.label || 'Unknown'}</div>
  `).join("");
}

function processMovies() {
  // Filter out movies without posters
  allMovies = allMovies.filter(m => m && m.poster_path);

  // Update count
  if (resultsCount) resultsCount.textContent = allMovies.length;
  if (resultsSubtitle) resultsSubtitle.textContent = `Found ${allMovies.length} movies matching your criteria`;

  // Sort and paginate
  sortMovies();
  calculatePagination();
  renderPage();
}

// ============================================
// SORTING
// ============================================

function sortMovies() {
  sortedMovies = [...allMovies];
  
  switch (currentSort) {
    case "chronology":
      sortedMovies.sort((a, b) => {
        const dateA = new Date(a.release_date || "9999");
        const dateB = new Date(b.release_date || "9999");
        return dateA - dateB; // Oldest first (default)
      });
      break;
    case "rating":
      sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)); // Highest first (default)
      break;
    case "boxoffice":
      // Use revenue if available, fallback to popularity
      sortedMovies.sort((a, b) => {
        const revA = a.revenue || (a.popularity * 1000000) || 0;
        const revB = b.revenue || (b.popularity * 1000000) || 0;
        return revB - revA; // Highest first (default)
      });
      break;
    case "foryou":
      // Sort by learned preferences (swipe memory affinity)
      if (typeof SwipeMemory !== 'undefined') {
        sortedMovies.sort((a, b) => {
          const boostA = SwipeMemory.getAffinityBoost(a);
          const boostB = SwipeMemory.getAffinityBoost(b);
          // Liked movies first, then by boost score
          const likedA = SwipeMemory.isLiked(a.id) ? 100 : 0;
          const likedB = SwipeMemory.isLiked(b.id) ? 100 : 0;
          const dislikedA = SwipeMemory.isDisliked(a.id) ? -100 : 0;
          const dislikedB = SwipeMemory.isDisliked(b.id) ? -100 : 0;
          
          const scoreA = likedA + dislikedA + boostA;
          const scoreB = likedB + dislikedB + boostB;
          
          return scoreB - scoreA; // Highest affinity first
        });
      }
      break;
    case "random":
      shuffleArray(sortedMovies);
      break;
  }
  
  // Apply reverse if active (not for random or foryou)
  if (isReversed && currentSort !== "random" && currentSort !== "foryou") {
    sortedMovies.reverse();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ============================================
// GRAVITATIONAL VIBE CALCULATIONS
// ============================================

function isVibeActive() {
  // Check if any slider is moved from center (default 50)
  return vibeSettings.mood !== 50 || 
         vibeSettings.pace !== 50 || 
         vibeSettings.familiarity !== 50 || 
         vibeSettings.depth !== 50;
}

function calculateMovieVibeScore(movie) {
  // Calculate how well a movie matches the current vibe settings
  // Returns 0-100, higher = closer match
  
  const genres = movie.genre_ids || [];
  
  // Calculate movie's intrinsic vibe scores
  const movieMood = getGenreAverage(genres, GENRE_VIBES.mood, 50);
  const moviePace = getGenreAverage(genres, GENRE_VIBES.pace, 50);
  const movieDepth = getGenreAverage(genres, GENRE_VIBES.depth, 50);
  
  // Familiarity is based on popularity (log scale since popularity varies wildly)
  const popularity = movie.popularity || 10;
  const movieFamiliarity = Math.min(100, Math.max(0, 100 - (Math.log10(popularity) * 25)));
  // High popularity = low familiarity score (meaning "familiar")
  // Low popularity = high familiarity score (meaning "challenge me")
  
  // Calculate distance from user's vibe settings (lower = better match)
  const moodDiff = Math.abs(vibeSettings.mood - movieMood);
  const paceDiff = Math.abs(vibeSettings.pace - moviePace);
  const familiarityDiff = Math.abs(vibeSettings.familiarity - movieFamiliarity);
  const depthDiff = Math.abs(vibeSettings.depth - movieDepth);
  
  // Weight the differences (mood and depth matter more)
  const weightedDiff = (moodDiff * 1.2) + (paceDiff * 0.8) + (familiarityDiff * 1.0) + (depthDiff * 1.2);
  const maxDiff = 100 * (1.2 + 0.8 + 1.0 + 1.2); // Max possible weighted difference
  
  // Convert to a 0-100 score where higher = better match
  const matchScore = 100 - (weightedDiff / maxDiff * 100);
  
  return matchScore;
}

function getGenreAverage(genres, vibeMap, defaultVal) {
  if (!genres || genres.length === 0) return defaultVal;
  
  const scores = genres.map(g => vibeMap[g]).filter(s => s !== undefined);
  if (scores.length === 0) return defaultVal;
  
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

function applyVibeGravity() {
  if (!isVibeActive()) {
    // If all sliders are centered, use normal sorting
    sortMovies();
    return;
  }
  
  // Calculate vibe scores for all movies
  const moviesWithScores = allMovies.map(movie => ({
    movie,
    vibeScore: calculateMovieVibeScore(movie)
  }));
  
  // Sort by vibe score (highest first = best match)
  moviesWithScores.sort((a, b) => b.vibeScore - a.vibeScore);
  
  // Update sortedMovies
  sortedMovies = moviesWithScores.map(m => m.movie);
  
  // Apply any secondary sorting within similar vibe scores
  // (movies within 5 points of each other can be sub-sorted)
  // For now, vibe score is the primary sort
}

function updateVibeSliders() {
  if (vibeMood) vibeSettings.mood = parseInt(vibeMood.value);
  if (vibePace) vibeSettings.pace = parseInt(vibePace.value);
  if (vibeFamiliarity) vibeSettings.familiarity = parseInt(vibeFamiliarity.value);
  if (vibeDepth) vibeSettings.depth = parseInt(vibeDepth.value);
  
  // Update slider group active states
  document.querySelectorAll('.vibe-slider-group').forEach(group => {
    const slider = group.querySelector('.vibe-slider');
    if (slider && parseInt(slider.value) !== 50) {
      group.classList.add('active');
    } else {
      group.classList.remove('active');
    }
  });
  
  // Apply gravity and re-render
  currentPage = 1;
  applyVibeGravity();
  calculatePagination();
  renderPage();
}

function resetVibeSliders() {
  vibeSettings = { mood: 50, pace: 50, familiarity: 50, depth: 50 };
  
  if (vibeMood) vibeMood.value = 50;
  if (vibePace) vibePace.value = 50;
  if (vibeFamiliarity) vibeFamiliarity.value = 50;
  if (vibeDepth) vibeDepth.value = 50;
  
  document.querySelectorAll('.vibe-slider-group').forEach(group => {
    group.classList.remove('active');
  });
  
  currentPage = 1;
  sortMovies();
  calculatePagination();
  renderPage();
}

// ============================================
// DYNAMIC SIZING
// ============================================

function applyDynamicSizing(movieCount) {
  if (!moviesGrid) return;
  
  moviesGrid.classList.remove("size-small", "size-medium", "size-large", "size-xlarge", "size-single", "single-row");
  
  if (movieCount === 1) {
    moviesGrid.classList.add("size-single");
  } else if (movieCount < 10) {
    moviesGrid.classList.add("size-xlarge", "single-row");
  } else if (movieCount < 25) {
    moviesGrid.classList.add("size-large");
  } else if (movieCount < 50) {
    moviesGrid.classList.add("size-medium");
  }
  // 50-100: default size (no class needed)
}

// ============================================
// PAGINATION
// ============================================

function calculatePagination() {
  totalPages = Math.ceil(sortedMovies.length / MOVIES_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
}

// ============================================
// RENDER PAGE
// ============================================

function renderPage() {
  if (!moviesGrid) return;
  
  const start = (currentPage - 1) * MOVIES_PER_PAGE;
  const end = start + MOVIES_PER_PAGE;
  const pageMovies = sortedMovies.slice(start, end);
  
  // Apply dynamic sizing based on total movies in results (not per page)
  applyDynamicSizing(sortedMovies.length);
  
  moviesGrid.innerHTML = pageMovies.map((movie, index) => {
    const posterUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    const year = movie.release_date ? movie.release_date.split("-")[0] : "";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "";
    
    // Calculate box office in $M (tens of millions)
    const revenue = movie.revenue || 0;
    const revenueM = Math.round(revenue / 1000000);
    const revenueDisplay = revenueM > 0 ? `$${revenueM}M` : "";
    
    // Runtime
    const runtime = movie.runtime ? `${movie.runtime}m` : "";
    
    // Genres (from stored data if available)
    const genres = movie.genres ? movie.genres.slice(0, 2).map(g => g.name).join(", ") : "";
    
    // Check swipe preference
    const preference = typeof SwipeMemory !== 'undefined' ? SwipeMemory.getPreference(movie.id) : null;
    const prefAttr = preference ? `data-preference="${preference}"` : '';
    
    // Truncate title for display
    const displayTitle = movie.title.length > 25 ? movie.title.substring(0, 22) + "..." : movie.title;

    return `
      <div class="movie-card"
           data-movie-id="${movie.id}"
           data-title="${movie.title.replace(/"/g, '&quot;')}"
           data-year="${year}"
           data-rating="${rating}"
           data-revenue="${revenueDisplay}"
           data-runtime="${runtime}"
           data-genres="${genres}"
           ${prefAttr}
           style="animation-delay: ${index * 0.015}s;">
        <button class="movie-delete" onclick="event.stopPropagation(); deleteMovie(${movie.id})">✕</button>
        <div class="movie-poster-wrap">
          <img class="movie-poster" src="${posterUrl}" alt="${movie.title}"
               onerror="this.src='https://placehold.co/150x225?text=No+Poster'">
        </div>
        <div class="movie-info">
          <div class="movie-title">${displayTitle}</div>
          <div class="movie-meta">
            <span class="movie-year">${year}</span>
            ${rating ? `<span class="movie-rating">⭐ ${rating}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  // Add click handlers and enable swipe
  document.querySelectorAll(".movie-card").forEach(card => {
    const movieId = parseInt(card.dataset.movieId);
    const movie = pageMovies.find(m => m.id === movieId);
    
    // Click to open popup
    card.addEventListener("click", (e) => {
      // Don't open popup if we just finished swiping
      if (!card.classList.contains('swiping-left') && !card.classList.contains('swiping-right')) {
        openMoviePopup(card.dataset.movieId);
      }
    });
    
    // Enable swipe memory
    if (typeof SwipeMemory !== 'undefined' && movie) {
      SwipeMemory.enableSwipe(card, movie);
    }
    
    // Add hover tooltip
    setupHoverTooltip(card);
  });
  
  // Update pagination UI
  updatePaginationUI();
}

// ============================================
// HOVER TOOLTIP
// ============================================

let hoverTooltip = null;
let hoverTimeout = null;

function setupHoverTooltip(card) {
  card.addEventListener('mouseenter', (e) => {
    // Clear any existing timeout
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    // Delay before showing tooltip (0.8s)
    hoverTimeout = setTimeout(() => {
      showHoverTooltip(card, e);
    }, 800);
  });
  
  card.addEventListener('mouseleave', () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hideHoverTooltip();
  });
  
  card.addEventListener('mousemove', (e) => {
    if (hoverTooltip && hoverTooltip.classList.contains('visible')) {
      positionTooltip(e);
    }
  });
}

function showHoverTooltip(card, e) {
  // Create tooltip if it doesn't exist
  if (!hoverTooltip) {
    hoverTooltip = document.createElement('div');
    hoverTooltip.className = 'movie-hover-tooltip';
    document.body.appendChild(hoverTooltip);
  }
  
  // Get data from card
  const title = card.dataset.title || '';
  const year = card.dataset.year || '';
  const rating = card.dataset.rating || '';
  const runtime = card.dataset.runtime || '';
  const genres = card.dataset.genres || '';
  const revenue = card.dataset.revenue || '';
  
  // Build tooltip content
  hoverTooltip.innerHTML = `
    <div class="tooltip-title">${title}</div>
    <div class="tooltip-meta">
      ${year ? `<span class="tooltip-year">${year}</span>` : ''}
      ${rating ? `<span class="tooltip-rating">⭐ ${rating}</span>` : ''}
      ${runtime ? `<span class="tooltip-runtime">${runtime}</span>` : ''}
    </div>
    ${genres ? `<div class="tooltip-genres">${genres}</div>` : ''}
    ${revenue ? `<div class="tooltip-revenue">💰 ${revenue}</div>` : ''}
  `;
  
  // Position and show
  positionTooltip(e);
  hoverTooltip.classList.add('visible');
}

function positionTooltip(e) {
  if (!hoverTooltip) return;
  
  const padding = 15;
  let x = e.clientX + padding;
  let y = e.clientY - padding;
  
  // Keep tooltip on screen
  const rect = hoverTooltip.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) {
    x = e.clientX - rect.width - padding;
  }
  if (y < 0) {
    y = e.clientY + padding;
  }
  
  hoverTooltip.style.left = `${x}px`;
  hoverTooltip.style.top = `${y}px`;
}

function hideHoverTooltip() {
  if (hoverTooltip) {
    hoverTooltip.classList.remove('visible');
  }
}

function updatePaginationUI() {
  if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  
  // Render page numbers
  let pages = [];
  const maxVisible = 5;
  
  if (totalPages <= maxVisible) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }
  }
  
  if (pageNumbers) {
    pageNumbers.innerHTML = pages.map(p => {
      if (p === "...") {
        return '<span class="page-ellipsis">...</span>';
      }
      return `<button class="page-number ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }).join("");
    
    // Add click handlers for page numbers
    pageNumbers.querySelectorAll(".page-number[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        if (!isNaN(page)) {
          currentPage = page;
          renderPage();
          if (moviesGrid) moviesGrid.scrollTop = 0;
        }
      });
    });
  }
}

function showEmptyState(message) {
  if (moviesGrid) {
    moviesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎬</div>
        <div class="empty-state-text">${message}</div>
      </div>
    `;
  }
  if (resultsCount) resultsCount.textContent = "0";
}

function showCappedBanner(totalAvailable) {
  const banner = document.createElement('div');
  banner.className = 'capped-banner';
  banner.innerHTML = `
    <span class="capped-icon">⚠️</span>
    <span class="capped-text">Showing 500 of ~${parseInt(totalAvailable).toLocaleString()} results. <a href="../index.html">Add more filters</a> for refined results.</span>
    <button class="capped-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  // Insert after header
  const header = document.querySelector('.results-header');
  if (header) {
    header.after(banner);
  }
}

function deleteMovie(movieId) {
  allMovies = allMovies.filter(m => m.id !== movieId);
  localStorage.setItem("movies", JSON.stringify(allMovies));
  processMovies();
}

// ============================================
// SEARCH WITHIN RESULTS
// ============================================

function setupSearch() {
  if (!resultsSearchInput || !resultsSearchDropdown) {
    console.log("Search elements not found, skipping search setup");
    return;
  }
  
  let searchTimeout;
  
  resultsSearchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = resultsSearchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
      resultsSearchDropdown.classList.remove("active");
      resultsSearchDropdown.innerHTML = "";
      return;
    }
    
    searchTimeout = setTimeout(() => {
      // Search through ALL movies, not just current page
      const matches = allMovies.filter(movie => 
        movie.title && movie.title.toLowerCase().includes(query)
      ).slice(0, 8); // Limit to 8 results
      
      if (matches.length === 0) {
        resultsSearchDropdown.innerHTML = '<div class="search-no-results">No matches found</div>';
        resultsSearchDropdown.classList.add("active");
        return;
      }
      
      resultsSearchDropdown.innerHTML = matches.map(movie => {
        const posterUrl = movie.poster_path 
          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
          : 'https://placehold.co/46x69?text=?';
        const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
        
        return `
          <div class="search-result-item" data-movie-id="${movie.id}">
            <img class="search-result-poster" src="${posterUrl}" alt="">
            <div class="search-result-info">
              <div class="search-result-title">${movie.title}</div>
              <div class="search-result-year">${year}</div>
            </div>
          </div>
        `;
      }).join("");
      
      resultsSearchDropdown.classList.add("active");
      
      // Add click handlers for search results
      resultsSearchDropdown.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", () => {
          const movieId = item.dataset.movieId;
          selectSearchResult(movieId);
        });
      });
    }, 200);
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".results-search-container")) {
      resultsSearchDropdown.classList.remove("active");
    }
  });
}

function selectSearchResult(movieId) {
  // Clear search
  resultsSearchInput.value = "";
  resultsSearchDropdown.classList.remove("active");
  
  // Find which page the movie is on
  const movieIndex = sortedMovies.findIndex(m => m.id == movieId);
  if (movieIndex === -1) return;
  
  const targetPage = Math.floor(movieIndex / MOVIES_PER_PAGE) + 1;
  
  // Navigate to that page if needed
  if (currentPage !== targetPage) {
    currentPage = targetPage;
    renderPage();
  }
  
  // Highlight the card briefly, then open popup
  setTimeout(() => {
    const card = document.querySelector(`.movie-card[data-movie-id="${movieId}"]`);
    if (card) {
      card.classList.add("highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Open popup after highlight effect
      setTimeout(() => {
        openMoviePopup(movieId);
        card.classList.remove("highlighted");
      }, 800);
    }
  }, 100);
}

// ============================================
// MOVIE POPUP
// ============================================

async function openMoviePopup(movieId) {
  if (!movieCube || !moviePopupOverlay) return;
  
  currentCubeFace = 1;
  if (movieCube) movieCube.dataset.face = "1";
  updateCubeNavButtons(1);
  
  try {
    // Fetch full movie details with credits and similar
    const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
    ]);
    
    currentMovieData = await movieRes.json();
    const credits = await creditsRes.json();
    const similar = await similarRes.json();
    const videos = await videosRes.json();
    
    // Store additional data
    currentMovieData.credits = credits;
    currentMovieData.similar = similar.results || [];
    currentMovieData.videos = videos.results || [];
    
    // FACE 1: Poster
    if (popupPosterLarge) {
      popupPosterLarge.src = `https://image.tmdb.org/t/p/w780${currentMovieData.poster_path}`;
    }
    
    // FACE 2: Synopsis & Info
    if (popupTitle) popupTitle.textContent = currentMovieData.title;
    if (popupYear) popupYear.textContent = currentMovieData.release_date ? currentMovieData.release_date.split("-")[0] : "Unknown";
    if (popupRating) popupRating.textContent = currentMovieData.vote_average ? currentMovieData.vote_average.toFixed(1) : "N/A";
    if (popupRuntime) popupRuntime.textContent = currentMovieData.runtime ? `${currentMovieData.runtime} min` : "";
    if (popupSynopsis) popupSynopsis.textContent = currentMovieData.overview || "No synopsis available.";
    
    // Genres
    if (popupGenres && currentMovieData.genres) {
      popupGenres.innerHTML = currentMovieData.genres.map(g => 
        `<span class="genre-tag">${g.name}</span>`
      ).join('');
    }
    
    // Where to Watch
    populateWhereToWatch(currentMovieData.id);

    // FACE 3: Cast & Crew
    loadCastInfo(credits);
    
    // FACE 4: Stats
    loadStats(currentMovieData);
    
    // Similar Films panel
    loadSimilarFilms(similar.results || []);

    // FACE 5: Trivia
    populateTriviaFace();

    moviePopupOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  } catch (err) {
    console.error("Error opening popup:", err);
  }
}

function loadCastInfo(credits) {
  // Default avatar SVG as data URI
  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect fill='%23374151' width='50' height='50'/%3E%3Ccircle cx='25' cy='18' r='10' fill='%236B7280'/%3E%3Cellipse cx='25' cy='45' rx='18' ry='15' fill='%236B7280'/%3E%3C/svg%3E";
  
  // Director
  if (directorInfo) {
    const director = credits.crew?.find(c => c.job === "Director");
    if (director) {
      const dirPhoto = director.profile_path 
        ? `https://image.tmdb.org/t/p/w92${director.profile_path}`
        : DEFAULT_AVATAR;
      directorInfo.innerHTML = `
        <img class="director-photo" src="${dirPhoto}" alt="${director.name}" onerror="this.src='${DEFAULT_AVATAR}'">
        <span class="director-name">${director.name}</span>
      `;
      directorInfo.style.cursor = 'pointer';
      directorInfo.onclick = () => goToPersonTimeline(director.id, director.name);
    } else {
      directorInfo.innerHTML = '<span class="director-name">Unknown Director</span>';
    }
  }
  
  // Top 10 cast
  if (castGrid) {
    const DEFAULT_AVATAR_ESC = DEFAULT_AVATAR.replace(/'/g, "\\'");
    const cast = (credits.cast || []).slice(0, 10);
    castGrid.innerHTML = cast.map(person => {
      const photo = person.profile_path 
        ? `https://image.tmdb.org/t/p/w92${person.profile_path}`
        : DEFAULT_AVATAR;
      return `
        <div class="cast-member" onclick="goToPersonTimeline(${person.id}, '${escapeQuotes(person.name)}')">
          <img class="cast-photo" src="${photo}" alt="${person.name}" onerror="this.src='${DEFAULT_AVATAR_ESC}'">
          <div class="cast-name">${person.name.split(' ')[0]}</div>
        </div>
      `;
    }).join('');
  }
}

function getWatchCountry() {
  const saved = localStorage.getItem("watchCountry");
  if (saved) return saved;
  const lang = navigator.language || navigator.userLanguage || "en-US";
  const parts = lang.split("-");
  return parts.length > 1 ? parts[1].toUpperCase() : "US";
}

async function populateWhereToWatch(movieId) {
  if (!whereToWatch) return;
  whereToWatch.innerHTML = '<div class="watch-loading">Loading streaming info...</div>';

  try {
    const region = getWatchCountry();
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const regionData = data.results?.[region];

    if (!regionData) {
      whereToWatch.innerHTML = `
        <div class="watch-section">
          <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
          <p class="watch-none">Not currently streaming</p>
        </div>`;
      return;
    }

    const providers = [];
    const seen = new Set();
    ['flatrate', 'rent', 'buy'].forEach(type => {
      (regionData[type] || []).forEach(p => {
        if (!seen.has(p.provider_id)) {
          seen.add(p.provider_id);
          providers.push({ id: p.provider_id, name: p.provider_name, logo: p.logo_path, type });
        }
      });
    });

    if (providers.length === 0) {
      whereToWatch.innerHTML = `
        <div class="watch-section">
          <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
          <p class="watch-none">Not currently streaming</p>
        </div>`;
      return;
    }

    const logoBase = "https://image.tmdb.org/t/p/w45";
    let subscribedIds = new Set();
    try {
      JSON.parse(localStorage.getItem("watchProviders") || "[]").forEach(p => subscribedIds.add(p.id));
    } catch {}

    whereToWatch.innerHTML = `
      <div class="watch-section">
        <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
        <div class="watch-providers">
          ${providers.slice(0, 8).map(p => {
            const subscribed = subscribedIds.size > 0 && subscribedIds.has(p.id) ? " watch-subscribed" : "";
            return `
            <div class="watch-provider${subscribed}" title="${p.name}">
              <img class="watch-logo" src="${logoBase}${p.logo}" alt="${p.name}" onerror="this.style.display='none'">
              <span class="watch-name">${p.name}</span>
            </div>`;
          }).join("")}
        </div>
      </div>`;
  } catch (e) {
    console.error("Watch providers error:", e);
    whereToWatch.innerHTML = '';
  }
}

function loadStats(movie) {
  if (statRuntime) statRuntime.textContent = movie.runtime ? `${movie.runtime} min` : '--';
  if (statBudget) statBudget.textContent = movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : '--';
  if (statRevenue) statRevenue.textContent = movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : '--';
  if (statPopularity) statPopularity.textContent = movie.popularity ? movie.popularity.toFixed(0) : '--';
  if (statVotes) statVotes.textContent = movie.vote_count ? movie.vote_count.toLocaleString() : '--';
  if (statLanguage) statLanguage.textContent = movie.original_language?.toUpperCase() || '--';
  
  // Production companies
  if (productionCompanies && movie.production_companies) {
    productionCompanies.innerHTML = movie.production_companies
      .filter(c => c.logo_path)
      .slice(0, 4)
      .map(c => `<img class="company-logo" src="https://image.tmdb.org/t/p/w92${c.logo_path}" alt="${c.name}" title="${c.name}">`)
      .join('');
  }
}

function loadSimilarFilms(films) {
  const similarPanelGrid = document.getElementById('similarPanelGrid');
  if (!similarPanelGrid) return;
  
  // Default poster placeholder
  const DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150' viewBox='0 0 100 150'%3E%3Crect fill='%23374151' width='100' height='150'/%3E%3Ctext x='50' y='75' font-family='Arial' font-size='12' fill='%236B7280' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";
  
  similarPanelGrid.innerHTML = films.slice(0, 9).map(movie => {
    const poster = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
      : DEFAULT_POSTER;
    return `
      <div class="similar-panel-item" data-movie-id="${movie.id}">
        <img class="similar-panel-poster" src="${poster}" alt="${movie.title}">
        <div class="similar-panel-title">${movie.title}</div>
      </div>
    `;
  }).join('');
}

function toggleSimilarPanel() {
  const panel = document.getElementById('similarPanel');
  const arrow = document.getElementById('similarArrow');
  
  if (panel) {
    panel.hidden = !panel.hidden;
    if (arrow) {
      arrow.classList.toggle('expanded', !panel.hidden);
    }
  }
}

function openSimilarMoviePopup(movieId) {
  // Close current popup briefly, then open the similar movie's popup
  closeMoviePopup();
  setTimeout(() => {
    openMoviePopup(movieId);
  }, 150);
}

function goToPersonTimeline(personId, personName) {
  // Store return path for "Back to Results"
  localStorage.setItem("returnToResults", "true");
  localStorage.setItem("timelineMovieId", personId);
  localStorage.setItem("timelineType", "person");
  localStorage.removeItem("vennPeople");
  window.location.href = 'timeline.html';
}

function closeMoviePopup() {
  if (moviePopupOverlay) moviePopupOverlay.hidden = true;
  document.body.style.overflow = "";
  currentMovieData = null;
  
  // Reset similar panel
  const panel = document.getElementById('similarPanel');
  const arrow = document.getElementById('similarArrow');
  if (panel) panel.hidden = true;
  if (arrow) arrow.classList.remove('expanded');
}

function rotateCube(faceNum) {
  if (!movieCube) return;

  currentCubeFace = faceNum;
  // For faces 1-4, rotate the 3D cube. For face 5, keep cube at face 1 and show flat overlay.
  movieCube.dataset.face = faceNum <= 4 ? faceNum.toString() : "1";

  // Toggle trivia overlay
  const triviaOverlay = document.getElementById("cubeTriviaOverlay");
  if (triviaOverlay) {
    triviaOverlay.classList.toggle("active", faceNum === 5);
  }

  updateCubeNavButtons(faceNum);
}

function updateCubeNavButtons(activeFace) {
  document.querySelectorAll('.cube-nav-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.face) === activeFace);
  });
}

function loadTrailer() {
  if (!currentMovieData?.videos || !trailerContainer) {
    alert("No trailer data available");
    return;
  }
  
  const trailer = currentMovieData.videos.find(v => 
    v.type === "Trailer" && v.site === "YouTube"
  ) || currentMovieData.videos.find(v => v.site === "YouTube");
  
  if (trailer) {
    trailerContainer.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
    if (trailerOverlay) trailerOverlay.hidden = false;
  } else {
    alert("No trailer available for this movie.");
  }
}

function showAllCast() {
  if (!allCastOverlay || !allCastTimeline || !currentMovieData?.credits?.cast) return;
  
  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect fill='%23374151' width='60' height='60'/%3E%3Ccircle cx='30' cy='22' r='12' fill='%236B7280'/%3E%3Cellipse cx='30' cy='54' rx='22' ry='18' fill='%236B7280'/%3E%3C/svg%3E";
  const cast = currentMovieData.credits.cast;
  
  allCastTimeline.innerHTML = cast.map(person => {
    const photo = person.profile_path 
      ? `https://image.tmdb.org/t/p/w92${person.profile_path}`
      : DEFAULT_AVATAR;
    return `
      <div class="all-cast-member" onclick="goToPersonTimeline(${person.id}, '${escapeQuotes(person.name)}')">
        <img class="all-cast-photo" src="${photo}" alt="${person.name}" onerror="this.src='${DEFAULT_AVATAR}'">
        <div class="all-cast-name">${person.name}</div>
        <div class="all-cast-character">${person.character || ''}</div>
      </div>
    `;
  }).join('');
  
  allCastOverlay.hidden = false;
}

function closeAllCast() {
  if (allCastOverlay) allCastOverlay.hidden = true;
}

// ============================================
// TRIVIA
// ============================================

async function loadTrivia() {
  if (!triviaQuestions) return;
  
  triviaQuestions.innerHTML = '<div class="trivia-loading">Loading trivia...</div>';
  
  try {
    const res = await fetch(TRIVIA_API_URL);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      renderTrivia(data.results);
    } else {
      triviaQuestions.innerHTML = '<div class="trivia-loading">No trivia available.</div>';
    }
  } catch (err) {
    console.error("Trivia load error:", err);
    triviaQuestions.innerHTML = '<div class="trivia-loading">Failed to load trivia.</div>';
  }
}

function renderTrivia(questions) {
  if (!triviaQuestions) return;
  
  triviaQuestions.innerHTML = questions.map((q, index) => {
    const question = decodeHTML(q.question);
    const correct = decodeHTML(q.correct_answer);
    const incorrect = q.incorrect_answers.map(a => decodeHTML(a));
    const options = shuffleArrayCopy([correct, ...incorrect]);
    
    return `
      <div class="trivia-item" data-correct="${correct}">
        <div class="trivia-question">${index + 1}. ${question}</div>
        <div class="trivia-options">
          ${options.map(opt => `
            <div class="trivia-option" data-answer="${opt}" onclick="checkAnswer(this, '${escapeQuotes(correct)}')">${opt}</div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function shuffleArrayCopy(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function checkAnswer(element, correct) {
  const selected = element.dataset.answer;
  const parent = element.closest(".trivia-item");
  const options = parent.querySelectorAll(".trivia-option");
  
  options.forEach(opt => {
    opt.style.pointerEvents = "none";
    if (opt.dataset.answer === correct) {
      opt.classList.add("correct");
    }
  });
  
  if (selected !== correct) {
    element.classList.add("wrong");
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ============================================
// TRIVIA
// ============================================

let triviaQuestions = [];
let triviaIndex = 0;
let triviaScore = 0;
let triviaAnswered = false;

function getTriviaCache(movieId) {
  try {
    const data = JSON.parse(localStorage.getItem(`cube_trivia_${movieId}`));
    if (data && data.questions && data.questions.length === 3) return data;
  } catch (e) {}
  return null;
}

function setTriviaCache(movieId, questions) {
  try {
    localStorage.setItem(`cube_trivia_${movieId}`, JSON.stringify({ questions, ts: Date.now() }));
  } catch (e) {}
}

function generateTriviaQuestions(movie) {
  const m = movie;
  const pool = [];

  if (m.budget && m.budget > 0) {
    const correct = `$${(m.budget / 1000000).toFixed(0)}M`;
    const base = m.budget / 1000000;
    const wrongs = [`$${Math.max(1, Math.round(base * 0.4))}M`, `$${Math.round(base * 1.8)}M`, `$${Math.round(base * 3.2)}M`].filter(w => w !== correct);
    pool.push({ q: `What was the budget of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3) });
  }

  if (m.revenue && m.revenue > 0) {
    const rev = m.revenue / 1000000;
    const correct = rev >= 1000 ? `$${(rev / 1000).toFixed(1)}B` : `$${rev.toFixed(0)}M`;
    const variants = [rev * 0.3, rev * 0.6, rev * 2.5].map(v => v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${Math.round(v)}M`).filter(w => w !== correct);
    pool.push({ q: `How much did "${m.title}" earn at the box office?`, correct, wrongs: variants.slice(0, 3) });
  }

  if (m.runtime) {
    const correct = `${m.runtime} minutes`;
    const wrongs = [`${m.runtime + 23} minutes`, `${Math.max(60, m.runtime - 31)} minutes`, `${m.runtime + 47} minutes`].filter(w => w !== correct);
    pool.push({ q: `What is the runtime of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3) });
  }

  if (m.tagline && m.tagline.length > 5) {
    const correct = m.tagline;
    const fakeTaglines = ["Every story has a beginning.", "The truth will set you free.", "Nothing is what it seems.", "One moment changes everything.", "Beyond the impossible."].filter(t => t !== correct);
    for (let i = fakeTaglines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fakeTaglines[i], fakeTaglines[j]] = [fakeTaglines[j], fakeTaglines[i]]; }
    pool.push({ q: `What is the tagline of "${m.title}"?`, correct, wrongs: fakeTaglines.slice(0, 3) });
  }

  if (m.original_language) {
    const langMap = { en: "English", fr: "French", es: "Spanish", de: "German", ja: "Japanese", ko: "Korean", it: "Italian", pt: "Portuguese", zh: "Chinese", hi: "Hindi", ru: "Russian", ar: "Arabic", sv: "Swedish", da: "Danish", nl: "Dutch", pl: "Polish", th: "Thai" };
    const correct = langMap[m.original_language] || m.original_language.toUpperCase();
    const others = Object.values(langMap).filter(l => l !== correct);
    for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
    pool.push({ q: `What is the original language of "${m.title}"?`, correct, wrongs: others.slice(0, 3) });
  }

  if (m.release_date) {
    const year = parseInt(m.release_date.split("-")[0]);
    const correct = `${year}`;
    const wrongs = [`${year - 2}`, `${year + 1}`, `${year - 4}`].filter(w => w !== correct);
    pool.push({ q: `What year was "${m.title}" released?`, correct, wrongs: wrongs.slice(0, 3) });
  }

  if (m.production_countries && m.production_countries.length > 0) {
    const correct = m.production_countries[0].name;
    const fakeCountries = ["United States of America", "United Kingdom", "France", "Germany", "Japan", "South Korea", "Canada", "Australia", "India", "Italy"].filter(c => c !== correct);
    for (let i = fakeCountries.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fakeCountries[i], fakeCountries[j]] = [fakeCountries[j], fakeCountries[i]]; }
    pool.push({ q: `Which country produced "${m.title}"?`, correct, wrongs: fakeCountries.slice(0, 3) });
  }

  if (m.credits && m.credits.crew) {
    const director = m.credits.crew.find(c => c.job === "Director");
    if (director) {
      const correct = director.name;
      const fallbackNames = ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Denis Villeneuve", "Ridley Scott", "James Cameron", "Quentin Tarantino"].filter(n => n !== correct);
      for (let i = fallbackNames.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fallbackNames[i], fallbackNames[j]] = [fallbackNames[j], fallbackNames[i]]; }
      pool.push({ q: `Who directed "${m.title}"?`, correct, wrongs: fallbackNames.slice(0, 3) });
    }

    const composer = m.credits.crew.find(c => c.job === "Original Music Composer" || c.job === "Music");
    if (composer) {
      const correct = composer.name;
      const fallbackComposers = ["Hans Zimmer", "John Williams", "Danny Elfman", "Howard Shore", "Alexandre Desplat", "Ludwig Göransson", "Michael Giacchino"].filter(n => n !== correct);
      for (let i = fallbackComposers.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [fallbackComposers[i], fallbackComposers[j]] = [fallbackComposers[j], fallbackComposers[i]]; }
      pool.push({ q: `Who composed the music for "${m.title}"?`, correct, wrongs: fallbackComposers.slice(0, 3) });
    }
  }

  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }

  const questions = [];
  for (const item of pool.slice(0, 3)) {
    const options = [item.correct, ...item.wrongs.slice(0, 3)];
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
    questions.push({ question: item.q, options, correctAnswer: item.correct });
  }
  return questions;
}

function populateTriviaFace() {
  if (!currentMovieData) return;

  const cached = getTriviaCache(currentMovieData.id);
  if (cached) {
    triviaQuestions = cached.questions;
  } else {
    triviaQuestions = generateTriviaQuestions(currentMovieData);
    if (triviaQuestions.length > 0) setTriviaCache(currentMovieData.id, triviaQuestions);
  }

  triviaIndex = 0;
  triviaScore = 0;
  triviaAnswered = false;

  if (triviaQuestions.length === 0) {
    const section = document.getElementById("cubeTriviaSection");
    if (section) section.innerHTML = '<h3 class="section-title">🧠 Movie Trivia</h3><p style="color: var(--muted-silver); text-align: center; margin-top: 40px;">Not enough data to generate trivia for this movie.</p>';
    return;
  }
  renderTriviaQuestion();
}

function renderTriviaQuestion() {
  const progressEl = document.getElementById("cubeTriviaProgress");
  const questionEl = document.getElementById("cubeTriviaQuestion");
  const optionsEl = document.getElementById("cubeTriviaOptions");
  const scoreEl = document.getElementById("cubeTriviaScore");
  if (!progressEl || !questionEl || !optionsEl || !scoreEl) return;

  progressEl.innerHTML = triviaQuestions.map((_, i) => {
    let cls = "cube-trivia-dot";
    if (i === triviaIndex) cls += " active";
    return `<span class="${cls}" data-idx="${i}"></span>`;
  }).join("");

  const q = triviaQuestions[triviaIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = q.options.map((opt, i) => `<button class="cube-trivia-option" data-idx="${i}">${opt}</button>`).join("");
  scoreEl.textContent = `Score: ${triviaScore} / ${triviaQuestions.length}`;
  triviaAnswered = false;
}

function handleTriviaAnswer(btn) {
  if (triviaAnswered) return;
  triviaAnswered = true;

  const q = triviaQuestions[triviaIndex];
  const selected = btn.textContent;
  const isCorrect = selected === q.correctAnswer;

  document.getElementById("cubeTriviaOptions").querySelectorAll(".cube-trivia-option").forEach(b => {
    b.classList.add("cube-trivia-answered");
    if (b.textContent === q.correctAnswer) b.classList.add("cube-trivia-correct");
  });

  if (isCorrect) {
    triviaScore++;
    btn.classList.add("cube-trivia-correct");
  } else {
    btn.classList.add("cube-trivia-wrong");
  }

  const dots = document.querySelectorAll("#cubeTriviaProgress .cube-trivia-dot");
  if (dots[triviaIndex]) {
    dots[triviaIndex].classList.remove("active");
    dots[triviaIndex].classList.add(isCorrect ? "correct" : "wrong");
  }

  const scoreEl = document.getElementById("cubeTriviaScore");
  if (scoreEl) scoreEl.textContent = `Score: ${triviaScore} / ${triviaQuestions.length}`;

  setTimeout(() => {
    triviaIndex++;
    if (triviaIndex < triviaQuestions.length) {
      renderTriviaQuestion();
    } else {
      showTriviaResult();
    }
  }, 1200);
}

function showTriviaResult() {
  const section = document.getElementById("cubeTriviaSection");
  if (!section) return;

  const emoji = triviaScore === 3 ? "🏆" : triviaScore === 2 ? "⭐" : triviaScore === 1 ? "👍" : "😅";
  section.innerHTML = `
    <div class="cube-trivia-final">
      <h3 class="section-title">🧠 Trivia Complete!</h3>
      <div class="cube-trivia-final-score">${emoji} ${triviaScore} / ${triviaQuestions.length}</div>
      <div class="cube-trivia-final-label">${triviaScore === 3 ? "Perfect score!" : triviaScore === 2 ? "Well done!" : triviaScore === 1 ? "Not bad!" : "Better luck next time!"}</div>
      <button class="cube-trivia-retry" id="cubeTriviaRetry">🔄 Play Again</button>
    </div>
  `;

}

// ============================================
// TRAILER
// ============================================

async function openTrailer() {
  if (!currentMovieData) return;
  
  try {
    const videosRes = await fetch(`https://api.themoviedb.org/3/movie/${currentMovieData.id}/videos?api_key=${TMDB_API_KEY}`);
    const videosData = await videosRes.json();
    
    const trailer = videosData.results?.find(v => 
      v.type === "Trailer" && v.site === "YouTube"
    ) || videosData.results?.find(v => v.site === "YouTube");
    
    if (trailer) {
      showTrailer(trailer.key);
      return;
    }
  } catch (err) {
    console.error("Failed to fetch TMDB videos:", err);
  }
  
  const searchQuery = encodeURIComponent(`${currentMovieData.title} ${currentMovieData.release_date?.split("-")[0] || ""} official trailer`);
  window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank");
}

function showTrailer(youtubeId) {
  if (!trailerContainer || !trailerOverlay) return;
  
  trailerContainer.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
      allowfullscreen>
    </iframe>
  `;
  trailerOverlay.hidden = false;
}

function closeTrailer() {
  if (trailerOverlay) trailerOverlay.hidden = true;
  if (trailerContainer) trailerContainer.innerHTML = "";
}

function toggleFullscreen() {
  if (!trailerContainer) return;
  const iframe = trailerContainer.querySelector("iframe");
  if (iframe) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    }
  }
}

// ============================================
// STREAMING FILTER
// ============================================

function setupStreamingFilter() {
  // Show read-only banner if watch providers are set
  try {
    const savedProviders = JSON.parse(localStorage.getItem("watchProviders") || "[]");
    const savedCountry = localStorage.getItem("watchCountry");
    if (savedProviders.length > 0 && savedCountry) {
      const names = savedProviders.map(p => p.name).join(", ");
      const banner = document.createElement("div");
      banner.className = "streaming-banner";
      banner.innerHTML = `<span class="streaming-banner-text">Filtered by: ${names} (${savedCountry})</span>`;
      const header = document.querySelector(".results-header");
      if (header) header.after(banner);
    }
  } catch {}

  // Hide the sidebar streaming section since settings are on the index page
  const streamingSection = document.getElementById("streamingCountry")?.closest(".sidebar-section");
  if (streamingSection) streamingSection.style.display = "none";
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Search setup
  setupSearch();

  // Streaming filter
  setupStreamingFilter();

  // Vibe sliders
  vibeMood?.addEventListener("input", updateVibeSliders);
  vibePace?.addEventListener("input", updateVibeSliders);
  vibeFamiliarity?.addEventListener("input", updateVibeSliders);
  vibeDepth?.addEventListener("input", updateVibeSliders);
  vibeReset?.addEventListener("click", resetVibeSliders);
  
  // Sort options
  document.querySelectorAll(".sort-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      
      // Reset reverse when changing sort (except random which ignores reverse)
      if (currentSort !== "random" && reverseBtn) {
        isReversed = false;
        reverseBtn.classList.remove("active");
      }
      
      // Reset vibes when changing sort type
      resetVibeSliders();
    });
  });
  
  // Reverse button
  reverseBtn?.addEventListener("click", () => {
    if (currentSort === "random") {
      // For random, just re-shuffle
      shuffleArray(sortedMovies);
      renderPage();
      return;
    }
    
    isReversed = !isReversed;
    reverseBtn.classList.toggle("active", isReversed);
    sortMovies();
    currentPage = 1;
    renderPage();
  });
  
  // Pagination
  prevPageBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      if (moviesGrid) moviesGrid.scrollTop = 0;
    }
  });
  
  nextPageBtn?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      if (moviesGrid) moviesGrid.scrollTop = 0;
    }
  });
  
  // Popup
  popupClose?.addEventListener("click", closeMoviePopup);
  moviePopupOverlay?.addEventListener("click", (e) => {
    if (e.target === moviePopupOverlay) closeMoviePopup();
  });
  
  // 3D Cube navigation
  document.querySelectorAll('.cube-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      rotateCube(parseInt(btn.dataset.face));
    });
  });
  
  // Action buttons and similar panel - event delegation
  document.getElementById('moviePopup')?.addEventListener("click", (e) => {
    // Trailer button
    const trailerBtn = e.target.closest('#playTrailerBtn');
    if (trailerBtn) {
      e.stopPropagation();
      loadTrailer();
      return;
    }
    
    // Anchor button
    const anchorButton = e.target.closest('#anchorBtn, .anchor-btn-primary');
    if (anchorButton) {
      e.stopPropagation();
      if (currentMovieData) {
        localStorage.setItem("anchorMovie", JSON.stringify(currentMovieData));
        localStorage.setItem("constellationMovies", JSON.stringify(allMovies));
        window.location.href = "constellation.html";
      } else {
        alert("No movie data available");
      }
      return;
    }
    
    // Similar toggle button
    const similarToggle = e.target.closest('#similarToggleBtn');
    if (similarToggle) {
      e.stopPropagation();
      toggleSimilarPanel();
      return;
    }
    
    // Similar panel item click
    const similarItem = e.target.closest('.similar-panel-item');
    if (similarItem) {
      e.stopPropagation();
      const movieId = parseInt(similarItem.dataset.movieId);
      if (movieId) {
        openSimilarMoviePopup(movieId);
      }
      return;
    }
  });
  
  // All cast button
  allCastBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showAllCast();
  });
  
  // Close all cast modal
  allCastClose?.addEventListener("click", closeAllCast);
  allCastOverlay?.addEventListener("click", (e) => {
    if (e.target === allCastOverlay) closeAllCast();
  });
  
  trailerClose?.addEventListener("click", closeTrailer);
  trailerFullscreen?.addEventListener("click", toggleFullscreen);
  trailerOverlay?.addEventListener("click", (e) => {
    if (e.target === trailerOverlay) closeTrailer();
  });

  // Trivia click delegation for reliable 3D click handling
  document.addEventListener("click", (e) => {
    const opt = e.target.closest("#moviePopupOverlay .cube-trivia-option");
    if (opt) {
      handleTriviaAnswer(opt);
    }
    const retry = e.target.closest("#moviePopupOverlay .cube-trivia-retry");
    if (retry) {
      if (currentMovieData) localStorage.removeItem(`cube_trivia_${currentMovieData.id}`);
      const section = document.getElementById("cubeTriviaSection");
      if (section) {
        section.innerHTML = `
          <h3 class="section-title">🧠 Movie Trivia</h3>
          <div class="cube-trivia-progress" id="cubeTriviaProgress"></div>
          <div class="cube-trivia-question" id="cubeTriviaQuestion"></div>
          <div class="cube-trivia-options" id="cubeTriviaOptions"></div>
          <div class="cube-trivia-score" id="cubeTriviaScore"></div>
        `;
        populateTriviaFace();
      }
    }
  });
  
  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (trailerOverlay && !trailerOverlay.hidden) {
        closeTrailer();
      } else if (moviePopupOverlay && !moviePopupOverlay.hidden) {
        closeMoviePopup();
      }
    }
    if (e.key === "ArrowLeft" && (!moviePopupOverlay || moviePopupOverlay.hidden)) {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
        if (moviesGrid) moviesGrid.scrollTop = 0;
      }
    }
    if (e.key === "ArrowRight" && (!moviePopupOverlay || moviePopupOverlay.hidden)) {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
        if (moviesGrid) moviesGrid.scrollTop = 0;
      }
    }
  });
  
  // Landing Zone button
  document.getElementById("landingZoneBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("landingZoneMovies", JSON.stringify(sortedMovies));
    window.location.href = "landingzone.html";
  });
  
  // Swipe hint dismiss
  const swipeHint = document.getElementById("swipeHint");
  const swipeHintDismiss = document.getElementById("swipeHintDismiss");
  const swipeLikeBtn = document.getElementById("swipeLikeBtn");
  const swipeDislikeBtn = document.getElementById("swipeDislikeBtn");
  
  // Check if user has already dismissed the hint
  if (localStorage.getItem("swipeHintDismissed")) {
    if (swipeHint) swipeHint.classList.add("hidden");
  }
  
  swipeHintDismiss?.addEventListener("click", () => {
    if (swipeHint) swipeHint.classList.add("hidden");
    localStorage.setItem("swipeHintDismissed", "true");
  });
  
  // Like button - trigger swipe right on first visible card
  swipeLikeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    triggerSwipeOnFirstCard("right");
  });
  
  // Dislike button - trigger swipe left on first visible card
  swipeDislikeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    triggerSwipeOnFirstCard("left");
  });
  
  // Auto-hide hint after first swipe
  document.addEventListener("swipe-recorded", () => {
    if (swipeHint && !swipeHint.classList.contains("hidden")) {
      setTimeout(() => {
        swipeHint.classList.add("hidden");
        localStorage.setItem("swipeHintDismissed", "true");
      }, 2000);
    }
  });
}

// Track which card index we're on for swipe buttons
let currentSwipeIndex = 0;

// Trigger swipe on next unswiped card
function triggerSwipeOnFirstCard(direction) {
  const allCards = document.querySelectorAll(".movie-card");
  const unswipedCards = document.querySelectorAll(".movie-card:not([data-preference])");
  
  if (unswipedCards.length === 0) {
    // All cards swiped - show message
    console.log("All movies have been rated!");
    return;
  }
  
  const targetCard = unswipedCards[0];
  const movieId = parseInt(targetCard.dataset.movieId);
  const movie = sortedMovies.find(m => m.id === movieId);
  
  if (!movie) return;
  
  // Record the preference
  if (typeof SwipeMemory !== 'undefined') {
    if (direction === "right") {
      SwipeMemory.recordSwipe(movie, "liked");
      targetCard.dataset.preference = "liked";
      targetCard.classList.add("swiped-liked");
    } else {
      SwipeMemory.recordSwipe(movie, "disliked");
      targetCard.dataset.preference = "disliked";
      targetCard.classList.add("swiped-disliked");
    }
  }
  
  // Strong visual feedback
  const isLike = direction === "right";
  targetCard.style.transition = "transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease";
  targetCard.style.transform = isLike ? "translateX(30px) rotate(3deg) scale(1.05)" : "translateX(-30px) rotate(-3deg) scale(0.95)";
  targetCard.style.boxShadow = isLike ? "0 0 30px rgba(0, 255, 136, 0.6)" : "0 0 30px rgba(255, 71, 87, 0.6)";
  targetCard.style.opacity = "0.7";
  
  setTimeout(() => {
    targetCard.style.transition = "transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease";
    targetCard.style.transform = "";
    targetCard.style.boxShadow = "";
    targetCard.style.opacity = isLike ? "1" : "0.5";
  }, 400);
}

// Expose functions to window for inline onclick handlers
window.openSimilarMoviePopup = openSimilarMoviePopup;
window.goToPersonTimeline = goToPersonTimeline;
window.openMoviePopup = openMoviePopup;

// ============================================
// PERSON BIO PANEL (#4, #5, #6)
// ============================================

let bioPanel, bioPanelTab, bioPanelContent, bioClose;
let currentPersonData = null;

function initBioPanel() {
  console.log("=== initBioPanel START ===");
  bioPanel = document.getElementById("bioPanel");
  bioPanelTab = document.getElementById("bioPanelTab");
  bioPanelContent = document.getElementById("bioPanelContent");
  bioClose = document.getElementById("bioClose");
  
  console.log("bioPanel element found:", !!bioPanel);
  
  if (!bioPanel) {
    console.log("No bioPanel element found - exiting");
    return;
  }
  
  // Check if there's a person in the filters
  const filtersData = localStorage.getItem("orbitFilters");
  console.log("orbitFilters raw:", filtersData);
  
  if (!filtersData) {
    console.log("No orbitFilters in localStorage");
    // Also check for timeline person
    const timelineType = localStorage.getItem("timelineType");
    const timelineId = localStorage.getItem("timelineMovieId");
    console.log("Checking timeline - type:", timelineType, "id:", timelineId);
    
    if (timelineType === "person" && timelineId) {
      console.log("Found timeline person, loading bio for ID:", timelineId);
      loadPersonBio(timelineId);
      bioPanel.hidden = false;
    } else {
      bioPanel.hidden = true;
    }
    return;
  }
  
  try {
    const filters = JSON.parse(filtersData);
    console.log("Parsed filters:", JSON.stringify(filters, null, 2));
    
    const personFilter = filters.find(f => {
      console.log("Checking filter:", f.section, f.value);
      return f.section === "people" && f.value?.id;
    });
    
    console.log("Found person filter:", personFilter);
    
    if (personFilter) {
      console.log("Loading bio for person ID:", personFilter.value.id);
      loadPersonBio(personFilter.value.id);
      bioPanel.hidden = false;
    } else {
      console.log("No person filter found, hiding bio panel");
      bioPanel.hidden = true;
    }
  } catch (e) {
    console.error("Failed to check for person filter:", e);
    bioPanel.hidden = true;
  }
  
  // Event listeners
  if (bioPanelTab) {
    bioPanelTab.addEventListener("click", toggleBioPanel);
  }
  if (bioClose) {
    bioClose.addEventListener("click", closeBioPanel);
  }
  
  // Click outside to close
  document.addEventListener("click", (e) => {
    if (bioPanel && bioPanel.classList.contains("expanded") && 
        !bioPanel.contains(e.target)) {
      closeBioPanel();
    }
  });
}

async function loadPersonBio(personId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`);
    const person = await res.json();
    currentPersonData = person;
    
    displayPersonBio(person);
  } catch (e) {
    console.error("Failed to load person bio:", e);
  }
}

function displayPersonBio(person) {
  const bioPhoto = document.getElementById("bioPhoto");
  const bioName = document.getElementById("bioName");
  const bioRole = document.getElementById("bioRole");
  const bioDates = document.getElementById("bioDates");
  const bioMemorial = document.getElementById("bioMemorial");
  const bioBirthplace = document.getElementById("bioBirthplace");
  const bioText = document.getElementById("bioText");
  const bioFilmCount = document.getElementById("bioFilmCount");
  const bioPopularity = document.getElementById("bioPopularity");
  
  // Photo
  if (bioPhoto) {
    bioPhoto.src = person.profile_path 
      ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
      : 'https://placehold.co/100x150?text=No+Photo';
  }
  
  // Name
  if (bioName) bioName.textContent = person.name;
  
  // Role (from known_for_department) - #6 Role-aware
  if (bioRole) {
    const role = person.known_for_department || "Actor";
    bioRole.textContent = role;
  }
  
  // Dates
  if (bioDates) {
    let datesText = "";
    if (person.birthday) {
      const birthYear = person.birthday.split("-")[0];
      datesText = `Born ${birthYear}`;
      
      if (person.deathday) {
        const deathYear = person.deathday.split("-")[0];
        datesText = `${birthYear} – ${deathYear}`;
      }
    }
    bioDates.textContent = datesText;
  }
  
  // Memorial banner for deceased (#5 Remembering)
  if (bioMemorial) {
    if (person.deathday) {
      bioMemorial.hidden = false;
      const memorialText = bioMemorial.querySelector(".memorial-text");
      if (memorialText) {
        memorialText.textContent = `Remembering ${person.name.split(' ')[0]}`;
      }
    } else {
      bioMemorial.hidden = true;
    }
  }
  
  // Birthplace
  if (bioBirthplace) {
    bioBirthplace.textContent = person.place_of_birth || "";
    bioBirthplace.style.display = person.place_of_birth ? "block" : "none";
  }
  
  // Biography (truncated)
  if (bioText) {
    const bio = person.biography || "No biography available.";
    bioText.textContent = bio.length > 500 ? bio.substring(0, 500) + "..." : bio;
  }
  
  // Stats
  if (bioFilmCount) {
    bioFilmCount.textContent = allMovies.length;
  }
  if (bioPopularity) {
    bioPopularity.textContent = Math.round(person.popularity || 0);
  }
}

function toggleBioPanel() {
  if (bioPanel) {
    bioPanel.classList.toggle("expanded");
  }
}

function closeBioPanel() {
  if (bioPanel) {
    bioPanel.classList.remove("expanded");
  }
}

// Initialize bio panel after main init
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initBioPanel, 100);
});