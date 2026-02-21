/* ============================================
   ORBIT RESULTS PAGE - JavaScript
   Grid display, search, sorting, pagination
============================================ */

const MOVIES_PER_PAGE = 100; // 10x10 grid

let allMovies = [];
let sortedMovies = [];
let currentPage = 1;
let totalPages = 1;
let currentSort = "chronology";
let isReversed = false;

// Settings data for location/era badges
let settingsData = null;

async function loadSettingsData() {
  if (settingsData) return settingsData;
  try {
    const response = await fetch('../data/orbit-movie-settings.json');
    settingsData = await response.json();
    return settingsData;
  } catch (e) {
    console.warn('[Results] Settings data not available, badges disabled');
    return null;
  }
}

function addSettingsBadges() {
  if (!settingsData?.movies) return;

  document.querySelectorAll('.movie-card').forEach(card => {
    const movieId = card.dataset.movieId;
    const movieSettings = settingsData.movies[movieId];
    if (!movieSettings) return;
    if (card.querySelector('.settings-badge')) return; // already has badge

    const parts = [];

    if (movieSettings.location?.coordinates?.length > 0) {
      parts.push(movieSettings.location.coordinates[0].label);
    }

    if (movieSettings.time_period?.era_labels?.length > 0) {
      parts.push(movieSettings.time_period.era_labels[0]);
    } else if (movieSettings.time_period?.decades?.length > 0) {
      parts.push(movieSettings.time_period.decades[0]);
    }

    if (parts.length === 0) return;

    const badge = document.createElement('div');
    badge.className = 'settings-badge';
    badge.textContent = parts.join(' \u00B7 ');

    const movieInfo = card.querySelector('.movie-info');
    if (movieInfo) {
      movieInfo.appendChild(badge);
    }
  });
}

// Media type awareness (movie, tv, or both)
let currentMediaType = "movie";

function getMediaTypeLabel(plural) {
  if (currentMediaType === "tv") return plural ? "TV shows" : "TV show";
  if (currentMediaType === "both") return plural ? "movies & TV shows" : "result";
  return plural ? "movies" : "movie";
}

function getApiPrefix(item) {
  // For individual items, check their media_type; fallback to currentMediaType
  const mt = item?.media_type || currentMediaType;
  return mt === "tv" ? "tv" : "movie";
}

function applyMediaTypeLabels() {
  // Update sidebar labels based on media type
  const label = getMediaTypeLabel(true);
  const countLabel = document.querySelector(".count-label");
  if (countLabel) countLabel.textContent = `${label} found`;

  const findTitle = document.querySelector('.sidebar-section-title');
  if (findTitle && findTitle.textContent === "Find Movie") {
    findTitle.textContent = currentMediaType === "tv" ? "Find Show" : currentMediaType === "both" ? "Find Title" : "Find Movie";
  }

  // Update search placeholder
  const searchInput = document.getElementById("resultsSearchInput");
  if (searchInput) {
    searchInput.placeholder = currentMediaType === "tv" ? "Search shows..." : currentMediaType === "both" ? "Search titles..." : "Search results...";
  }

  // Update "New Search" link to go back to the right page
  const newSearchLink = document.querySelector('a.nav-item[href="../index.html"]');
  if (newSearchLink) {
    if (currentMediaType === "tv") newSearchLink.href = "../tv.html";
    else if (currentMediaType === "both") newSearchLink.href = "../both.html";
  }

}

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

// Vibe slider elements
let vibeMood, vibePace, vibeFamiliarity, vibeDepth, vibeReset;

// Initialize
document.addEventListener("DOMContentLoaded", init);

async function init() {
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

    // Shared movie cube component
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
      },
      onAnchorClick: (movie) => {
        localStorage.setItem("anchorMovie", JSON.stringify(movie));
        localStorage.setItem("constellationMovies", JSON.stringify(allMovies));
        window.location.href = "../games/constellation.html";
      }
    });
    if (typeof initPeopleCube === 'function') initPeopleCube();

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

    // Check for Orbit Map location results
    const mapResultsData = localStorage.getItem('orbit_map_results');
    if (mapResultsData) {
      try {
        const { label, movieIds } = JSON.parse(mapResultsData);
        localStorage.removeItem('orbit_map_results');

        const resultsTitle = document.getElementById("resultsTitle");
        const resultsSubtitleEl = document.getElementById("resultsSubtitle");
        const resultsCountEl = document.getElementById("resultsCount");

        if (resultsTitle) resultsTitle.textContent = label;
        if (resultsCountEl) resultsCountEl.textContent = movieIds.length.toString();
        if (resultsSubtitleEl) resultsSubtitleEl.textContent = `Films set in ${label}`;

        // Fetch movie details from TMDB in batches
        const BATCH_SIZE = 8;
        const fetchedMovies = [];

        for (let i = 0; i < movieIds.length; i += BATCH_SIZE) {
          const batch = movieIds.slice(i, i + BATCH_SIZE);
          const results = await Promise.allSettled(
            batch.map(id =>
              fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
                .then(r => r.json())
            )
          );
          results.forEach(r => {
            if (r.status === 'fulfilled' && r.value && r.value.id) {
              fetchedMovies.push(r.value);
            }
          });
        }

        allMovies = fetchedMovies;
        processMovies();
        setupEventListeners();
        loadSettingsData().then(data => { if (data) addSettingsBadges(); });
        return;
      } catch (e) {
        console.error('[Results] Failed to load map results:', e);
        localStorage.removeItem('orbit_map_results');
      }
    }

    // Detect media type
    const storedMediaType = localStorage.getItem("mediaType");
    if (storedMediaType === "tv" || storedMediaType === "both") {
      currentMediaType = storedMediaType;
    }
    applyMediaTypeLabels();

    // Load movies from localStorage (normal mode)
    const moviesData = localStorage.getItem("movies");
    const filtersData = localStorage.getItem("orbitFilters");
    
    if (!moviesData) {
      showEmptyState("No results found. Return to Orbit to search.");
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

    // Load settings data in background for badges
    loadSettingsData().then(data => { if (data) addSettingsBadges(); });

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
  if (resultsSubtitle) resultsSubtitle.textContent = `Found ${allMovies.length} ${getMediaTypeLabel(true)} matching your criteria`;

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
    case "awards":
      sortedMovies.sort((a, b) => {
        const awardsA = typeof getMovieAwards === 'function' ? getMovieAwards(a.id) : null;
        const awardsB = typeof getMovieAwards === 'function' ? getMovieAwards(b.id) : null;
        const winsA = awardsA ? awardsA.filter(aw => aw.won).length : 0;
        const winsB = awardsB ? awardsB.filter(aw => aw.won).length : 0;
        const nomsA = awardsA ? awardsA.filter(aw => !aw.won).length : 0;
        const nomsB = awardsB ? awardsB.filter(aw => !aw.won).length : 0;
        // Primary: total awards (wins weighted x2), secondary: wins count
        const scoreA = winsA * 2 + nomsA;
        const scoreB = winsB * 2 + nomsB;
        return scoreB - scoreA || winsB - winsA;
      });
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

    // Award counts for awards sort mode
    let awardCountsHTML = '';
    if (currentSort === 'awards' && typeof getMovieAwards === 'function') {
      const awards = getMovieAwards(movie.id);
      if (awards) {
        const wins = awards.filter(a => a.won).length;
        const noms = awards.filter(a => !a.won).length;
        if (wins || noms) {
          awardCountsHTML = `<div class="movie-award-counts">${wins ? `<span class="award-count-wins">${wins}</span>` : ''}${noms ? `<span class="award-count-noms">${noms}</span>` : ''}</div>`;
        }
      }
    }

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
            ${rating ? `<span class="movie-rating"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z"/></svg> ${rating}</span>` : ''}
          </div>
          ${awardCountsHTML}
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
        openMovieCube(card.dataset.movieId);
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

  // Re-apply settings badges after page render
  if (settingsData) addSettingsBadges();
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
      ${rating ? `<span class="tooltip-rating"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:2px"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z"/></svg> ${rating}</span>` : ''}
      ${runtime ? `<span class="tooltip-runtime">${runtime}</span>` : ''}
    </div>
    ${genres ? `<div class="tooltip-genres">${genres}</div>` : ''}
    ${revenue ? `<div class="tooltip-revenue"><span class="og og-revenue"></span> ${revenue}</div>` : ''}
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
}

function showEmptyState(message) {
  if (moviesGrid) {
    moviesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg></div>
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
    <span class="capped-icon"><span class="og og-target"></span></span>
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
        openMovieCube(movieId);
        card.classList.remove("highlighted");
      }, 800);
    }
  }, 100);
}

// goToPersonTimeline is used by bio panel and moviecube onPersonClick


function goToPersonTimeline(personId, personName) {
  // Store return path for "Back to Results"
  localStorage.setItem("returnToResults", "true");
  localStorage.setItem("timelineMovieId", personId);
  localStorage.setItem("timelineType", "person");
  localStorage.removeItem("vennPeople");
  window.location.href = 'timeline.html';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  nextPageBtn?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  // Keyboard — ESC handled by moviecube.js internally; arrow keys for pagination
  document.addEventListener("keydown", (e) => {
    const cubeOverlay = document.getElementById("movieCubeOverlay");
    const cubeOpen = cubeOverlay && !cubeOverlay.hidden;
    if (e.key === "ArrowLeft" && !cubeOpen) {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    if (e.key === "ArrowRight" && !cubeOpen) {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
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
  
  // Drawer toggle (controls panel)
  const drawerToggle = document.getElementById('drawerToggle');
  const controlsDrawer = document.getElementById('controlsDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    controlsDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('visible');
  }
  function closeDrawer() {
    controlsDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('visible');
  }

  drawerToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

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
window.goToPersonTimeline = goToPersonTimeline;
window.openMoviePopup = openMovieCube;

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