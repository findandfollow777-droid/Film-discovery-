/* ============================================
   ORBIT CONSTELLATION PAGE
   Anchor Film Orbital Visualization
============================================ */

// Genre similarity weights and mood mappings
const GENRE_VIBES = {
  mood: {
    35: 10, 16: 15, 10751: 15, 10402: 25, 10749: 30,
    12: 40, 14: 45, 878: 50, 28: 55, 9648: 65,
    53: 70, 80: 75, 10752: 80, 27: 90
  },
  pace: {
    99: 10, 18: 25, 10749: 30, 36: 35, 10402: 40,
    35: 45, 9648: 50, 14: 55, 878: 60, 12: 65,
    80: 70, 53: 80, 28: 85, 27: 75, 10752: 80
  },
  depth: {
    28: 15, 12: 20, 14: 25, 16: 30, 10751: 30,
    35: 35, 27: 40, 10749: 45, 878: 55, 9648: 60,
    53: 55, 80: 65, 18: 70, 10752: 75, 36: 80, 99: 90
  }
};

let anchorMovie = null;
let allMovies = [];
let rankedMovies = [];
let selectedMovie = null;

// DOM Elements
let anchorPoster, anchorLabel, orbitingMovies;
let infoPanel, infoClose, infoPoster, infoTitle, infoYear, infoRating, infoSimilarity, infoOverview;
let makeAnchorBtn;

// Initialize
document.addEventListener("DOMContentLoaded", init);

function init() {
  // Get DOM elements
  anchorPoster = document.getElementById("anchorPoster");
  anchorLabel = document.getElementById("anchorLabel");
  orbitingMovies = document.getElementById("orbitingMovies");
  
  infoPanel = document.getElementById("infoPanel");
  infoClose = document.getElementById("infoClose");
  infoPoster = document.getElementById("infoPoster");
  infoTitle = document.getElementById("infoTitle");
  infoYear = document.getElementById("infoYear");
  infoRating = document.getElementById("infoRating");
  infoSimilarity = document.getElementById("infoSimilarity");
  infoOverview = document.getElementById("infoOverview");
  makeAnchorBtn = document.getElementById("makeAnchorBtn");
  
  // Load data from localStorage
  const anchorData = localStorage.getItem("anchorMovie");
  const moviesData = localStorage.getItem("constellationMovies");
  
  if (!anchorData || !moviesData) {
    showError("No anchor movie selected. Return to Results and choose a movie.");
    return;
  }
  
  try {
    anchorMovie = JSON.parse(anchorData);
    allMovies = JSON.parse(moviesData);
  } catch (e) {
    showError("Error loading movie data.");
    return;
  }
  
  // Remove anchor from the orbiting list
  allMovies = allMovies.filter(m => m.id !== anchorMovie.id);
  
  // Setup
  displayAnchor();
  calculateSimilarities();
  renderOrbits();
  setupEventListeners();
  
  // Check if we need expand button (#7)
  checkExpandUniverse();
  
  console.log("Constellation initialized with", allMovies.length, "orbiting movies");
}

function showError(message) {
  if (anchorLabel) {
    anchorLabel.textContent = message;
    anchorLabel.style.color = "#ff4757";
  }
}

// ============================================
// ANCHOR DISPLAY
// ============================================

function displayAnchor() {
  if (!anchorMovie) return;
  
  if (anchorPoster) {
    anchorPoster.src = `https://image.tmdb.org/t/p/w300${anchorMovie.poster_path}`;
    anchorPoster.alt = anchorMovie.title;
  }
  
  if (anchorLabel) {
    anchorLabel.textContent = anchorMovie.title;
  }
  
  // Make anchor clickable - navigates to Results page with this movie
  const anchorElement = document.getElementById("anchorStar");
  if (anchorElement) {
    anchorElement.style.cursor = "pointer";
    anchorElement.title = `Click to view "${anchorMovie.title}"`;
    anchorElement.onclick = () => {
      localStorage.setItem("singleMovie", JSON.stringify(anchorMovie));
      localStorage.setItem("resultsMode", "single");
      window.location.href = 'results.html';
    };
  }
}

// ============================================
// SIMILARITY CALCULATIONS
// ============================================

function calculateSimilarities() {
  if (!anchorMovie || allMovies.length === 0) return;
  
  const anchorGenres = anchorMovie.genre_ids || anchorMovie.genres?.map(g => g.id) || [];
  const anchorYear = anchorMovie.release_date ? parseInt(anchorMovie.release_date.split("-")[0]) : 2000;
  const anchorRating = anchorMovie.vote_average || 5;
  const anchorMood = getGenreAverage(anchorGenres, GENRE_VIBES.mood, 50);
  const anchorPace = getGenreAverage(anchorGenres, GENRE_VIBES.pace, 50);
  const anchorDepth = getGenreAverage(anchorGenres, GENRE_VIBES.depth, 50);
  
  rankedMovies = allMovies.map(movie => {
    const movieGenres = movie.genre_ids || [];
    const movieYear = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2000;
    const movieRating = movie.vote_average || 5;
    const movieMood = getGenreAverage(movieGenres, GENRE_VIBES.mood, 50);
    const moviePace = getGenreAverage(movieGenres, GENRE_VIBES.pace, 50);
    const movieDepth = getGenreAverage(movieGenres, GENRE_VIBES.depth, 50);
    
    // Calculate similarity components
    
    // 1. Genre overlap (0-100)
    const genreOverlap = calculateGenreOverlap(anchorGenres, movieGenres);
    
    // 2. Era similarity (0-100) - closer years = higher score
    const yearDiff = Math.abs(anchorYear - movieYear);
    const eraSimilarity = Math.max(0, 100 - (yearDiff * 3)); // Lose 3 points per year difference
    
    // 3. Rating similarity (0-100)
    const ratingDiff = Math.abs(anchorRating - movieRating);
    const ratingSimilarity = Math.max(0, 100 - (ratingDiff * 15));
    
    // 4. Vibe similarity (0-100)
    const moodDiff = Math.abs(anchorMood - movieMood);
    const paceDiff = Math.abs(anchorPace - moviePace);
    const depthDiff = Math.abs(anchorDepth - movieDepth);
    const vibeSimilarity = 100 - ((moodDiff + paceDiff + depthDiff) / 3);
    
    // Weighted total (genre matters most, then vibe, then era, then rating)
    const totalSimilarity = (
      genreOverlap * 0.35 +
      vibeSimilarity * 0.30 +
      eraSimilarity * 0.20 +
      ratingSimilarity * 0.15
    );
    
    return {
      movie,
      similarity: totalSimilarity,
      genreOverlap,
      eraSimilarity,
      ratingSimilarity,
      vibeSimilarity
    };
  });
  
  // Sort by similarity (highest first)
  rankedMovies.sort((a, b) => b.similarity - a.similarity);
}

function calculateGenreOverlap(genres1, genres2) {
  if (!genres1.length || !genres2.length) return 30; // Default if no genre info
  
  const set1 = new Set(genres1);
  const set2 = new Set(genres2);
  const intersection = [...set1].filter(g => set2.has(g));
  const union = new Set([...genres1, ...genres2]);
  
  // Jaccard similarity * 100
  return (intersection.length / union.size) * 100;
}

function getGenreAverage(genres, vibeMap, defaultVal) {
  if (!genres || genres.length === 0) return defaultVal;
  
  const scores = genres.map(g => vibeMap[g]).filter(s => s !== undefined);
  if (scores.length === 0) return defaultVal;
  
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

// ============================================
// RENDER ORBITS
// ============================================

function renderOrbits() {
  if (!orbitingMovies) return;
  
  orbitingMovies.innerHTML = "";
  
  // Get container dimensions
  const container = document.getElementById("orbitalContainer");
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;
  
  // Define orbital distances (from center)
  const orbits = [
    { radius: 180, maxMovies: 6, class: "orbit-1" },   // Closest - most similar
    { radius: 280, maxMovies: 10, class: "orbit-2" },
    { radius: 380, maxMovies: 14, class: "orbit-3" },
    { radius: 480, maxMovies: 20, class: "orbit-4" }   // Furthest - least similar
  ];
  
  let movieIndex = 0;
  
  orbits.forEach((orbit, orbitIndex) => {
    const moviesInOrbit = rankedMovies.slice(movieIndex, movieIndex + orbit.maxMovies);
    movieIndex += orbit.maxMovies;
    
    moviesInOrbit.forEach((item, i) => {
      const angle = (2 * Math.PI * i / moviesInOrbit.length) - Math.PI / 2; // Start from top
      
      // Add slight randomness to make it feel organic
      const radiusVariation = orbit.radius + (Math.random() - 0.5) * 30;
      const angleVariation = angle + (Math.random() - 0.5) * 0.15;
      
      const x = centerX + Math.cos(angleVariation) * radiusVariation;
      const y = centerY + Math.sin(angleVariation) * radiusVariation;
      
      const movieEl = createOrbitMovie(item, orbit.class, x, y);
      orbitingMovies.appendChild(movieEl);
    });
  });
}

function createOrbitMovie(item, orbitClass, x, y) {
  const { movie, similarity } = item;
  
  const div = document.createElement("div");
  div.className = `orbit-movie ${orbitClass}`;
  div.dataset.movieId = movie.id;
  div.dataset.similarity = similarity.toFixed(1);
  
  // Center the element on its position
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.transform = "translate(-50%, -50%)";
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : "https://placehold.co/80x120?text=?";
  
  div.innerHTML = `
    <img class="orbit-movie-poster" src="${posterUrl}" alt="${movie.title}">
    <div class="orbit-similarity"></div>
  `;
  
  // Click to show info
  div.addEventListener("click", () => showMovieInfo(item));
  
  // Double-click to make new anchor
  div.addEventListener("dblclick", () => makeNewAnchor(movie));
  
  // Enable swipe memory
  if (typeof SwipeMemory !== 'undefined') {
    SwipeMemory.enableSwipe(div, movie);
  }
  
  return div;
}

// ============================================
// INFO PANEL
// ============================================

function showMovieInfo(item) {
  const { movie, similarity, genreOverlap, eraSimilarity, vibeSimilarity } = item;
  selectedMovie = movie;
  
  if (infoPoster) {
    infoPoster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
  }
  
  if (infoTitle) infoTitle.textContent = movie.title;
  if (infoYear) infoYear.textContent = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  if (infoRating) infoRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  if (infoSimilarity) infoSimilarity.textContent = `${similarity.toFixed(0)}% Match`;
  if (infoOverview) infoOverview.textContent = movie.overview || "No overview available.";
  
  // Update similarity indicator color based on match
  if (infoSimilarity) {
    if (similarity >= 70) {
      infoSimilarity.style.borderColor = "#00ff88";
      infoSimilarity.style.color = "#00ff88";
      infoSimilarity.style.background = "rgba(0, 255, 136, 0.2)";
    } else if (similarity >= 50) {
      infoSimilarity.style.borderColor = "#00d9ff";
      infoSimilarity.style.color = "#00d9ff";
      infoSimilarity.style.background = "rgba(0, 217, 255, 0.2)";
    } else if (similarity >= 30) {
      infoSimilarity.style.borderColor = "#ff6b35";
      infoSimilarity.style.color = "#ff6b35";
      infoSimilarity.style.background = "rgba(255, 107, 53, 0.2)";
    } else {
      infoSimilarity.style.borderColor = "#8892a6";
      infoSimilarity.style.color = "#8892a6";
      infoSimilarity.style.background = "rgba(136, 146, 166, 0.2)";
    }
  }
  
  // Show panel
  if (infoPanel) infoPanel.classList.add("active");
}

function closeInfoPanel() {
  if (infoPanel) infoPanel.classList.remove("active");
  selectedMovie = null;
}

// ============================================
// MAKE NEW ANCHOR
// ============================================

function makeNewAnchor(movie) {
  // Fetch full movie details if needed
  fetchMovieDetails(movie.id).then(fullMovie => {
    anchorMovie = fullMovie || movie;
    
    // Update localStorage
    localStorage.setItem("anchorMovie", JSON.stringify(anchorMovie));
    
    // Re-add old anchor to pool
    allMovies.push(anchorMovie);
    
    // Remove new anchor from pool
    allMovies = allMovies.filter(m => m.id !== movie.id);
    
    // Recalculate and re-render
    displayAnchor();
    calculateSimilarities();
    renderOrbits();
    closeInfoPanel();
    
    // Visual feedback
    flashAnchor();
  });
}

async function fetchMovieDetails(movieId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch movie details:", e);
    return null;
  }
}

function flashAnchor() {
  const anchor = document.getElementById("anchorStar");
  if (anchor) {
    anchor.style.animation = "none";
    anchor.offsetHeight; // Trigger reflow
    anchor.style.animation = "anchor-flash 0.6s ease";
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Close info panel
  infoClose?.addEventListener("click", closeInfoPanel);
  
  // Click outside to close
  document.addEventListener("click", (e) => {
    if (infoPanel?.classList.contains("active")) {
      // Don't close if clicking the make anchor button
      if (e.target.closest("#makeAnchorBtn")) return;
      if (!infoPanel.contains(e.target) && !e.target.closest(".orbit-movie")) {
        closeInfoPanel();
      }
    }
  });
  
  // Make anchor button
  makeAnchorBtn?.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from bubbling and closing panel
    console.log("Make anchor clicked, selectedMovie:", selectedMovie);
    if (selectedMovie) {
      makeNewAnchor(selectedMovie);
    }
  });
  
  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeInfoPanel();
    }
  });
  
  // Resize handler
  window.addEventListener("resize", debounce(() => {
    renderOrbits();
  }, 250));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add CSS animation for anchor flash
const style = document.createElement("style");
style.textContent = `
  @keyframes anchor-flash {
    0% { filter: brightness(1); }
    50% { filter: brightness(2) drop-shadow(0 0 30px gold); }
    100% { filter: brightness(1); }
  }
`;
document.head.appendChild(style);

// ============================================
// EXPAND UNIVERSE (#7)
// ============================================

function checkExpandUniverse() {
  const expandUniverse = document.getElementById("expandUniverse");
  const expandBtn = document.getElementById("expandBtn");
  
  if (!expandUniverse) return;
  
  // Show button if fewer than 10 movies
  if (allMovies.length < 10) {
    expandUniverse.hidden = false;
    
    if (expandBtn) {
      expandBtn.addEventListener("click", handleExpandUniverse);
    }
  } else {
    expandUniverse.hidden = true;
  }
}

async function handleExpandUniverse() {
  const expandBtn = document.getElementById("expandBtn");
  const expandUniverse = document.getElementById("expandUniverse");
  
  if (!anchorMovie) return;
  
  // Show loading state
  if (expandBtn) {
    expandBtn.classList.add("loading");
    expandBtn.querySelector(".expand-text").textContent = "Expanding...";
  }
  
  try {
    // Get similar movies based on anchor
    const similarRes = await fetch(
      `https://api.themoviedb.org/3/movie/${anchorMovie.id}/similar?api_key=${TMDB_API_KEY}&page=1`
    );
    const similarData = await similarRes.json();
    
    // Also get recommendations
    const recRes = await fetch(
      `https://api.themoviedb.org/3/movie/${anchorMovie.id}/recommendations?api_key=${TMDB_API_KEY}&page=1`
    );
    const recData = await recRes.json();
    
    // Combine and dedupe
    const existingIds = new Set([anchorMovie.id, ...allMovies.map(m => m.id)]);
    const newMovies = [...(similarData.results || []), ...(recData.results || [])]
      .filter(m => m.poster_path && !existingIds.has(m.id));
    
    // Dedupe new movies
    const uniqueNew = [];
    const seenIds = new Set();
    for (const m of newMovies) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        uniqueNew.push(m);
      }
    }
    
    // Add up to 20 new movies
    const toAdd = uniqueNew.slice(0, 20);
    
    if (toAdd.length > 0) {
      allMovies = [...allMovies, ...toAdd];
      
      // Update localStorage for persistence
      localStorage.setItem("constellationMovies", JSON.stringify([anchorMovie, ...allMovies]));
      
      // Re-render
      calculateSimilarities();
      renderOrbits();
      
      console.log(`Expanded universe with ${toAdd.length} new movies`);
    }
    
    // Hide button after expansion
    if (expandUniverse) {
      expandUniverse.hidden = true;
    }
    
  } catch (e) {
    console.error("Failed to expand universe:", e);
    if (expandBtn) {
      expandBtn.classList.remove("loading");
      expandBtn.querySelector(".expand-text").textContent = "Expand Failed";
    }
  }
}

// Global click handler for anchor button (backup for inline onclick)
function handleMakeAnchorClick() {
  console.log("Anchor button clicked via onclick, selectedMovie:", selectedMovie);
  if (selectedMovie) {
    makeNewAnchor(selectedMovie);
  } else {
    console.error("No movie selected!");
  }
}

// Expose to window
window.handleMakeAnchorClick = handleMakeAnchorClick;