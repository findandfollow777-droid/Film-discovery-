/* ============================================
   ORBIT SWIPE MEMORY SYSTEM
   Passive learning through swipe interactions
   Include this on any page with swipeable cards
============================================ */

const SwipeMemory = (function() {
  
  // Configuration
  const SWIPE_THRESHOLD = 80;      // Minimum px to register as swipe
  const ROTATION_FACTOR = 0.15;    // How much card tilts during drag
  const STORAGE_KEY = "orbitSwipeMemory";
  const MAX_STORED = 500;          // Max movies to remember
  
  // State
  let memory = {
    liked: {},      // { movieId: { count: N, lastSwiped: timestamp, movie: {...} } }
    disliked: {},   // same structure
    genreAffinities: {}  // { genreId: score } - learned from swipes
  };
  
  let activeCard = null;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  function init() {
    loadMemory();
    console.log("SwipeMemory initialized:", 
      Object.keys(memory.liked).length, "liked,",
      Object.keys(memory.disliked).length, "disliked");
  }
  
  function loadMemory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        memory = JSON.parse(stored);
        // Ensure structure exists
        if (!memory.liked) memory.liked = {};
        if (!memory.disliked) memory.disliked = {};
        if (!memory.genreAffinities) memory.genreAffinities = {};
      }
    } catch (e) {
      console.error("Failed to load swipe memory:", e);
    }
  }
  
  function saveMemory() {
    try {
      // Trim if too large
      trimMemory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch (e) {
      console.error("Failed to save swipe memory:", e);
    }
  }
  
  function trimMemory() {
    // Keep only most recent entries if over limit
    const trimCollection = (collection) => {
      const entries = Object.entries(collection);
      if (entries.length > MAX_STORED) {
        entries.sort((a, b) => b[1].lastSwiped - a[1].lastSwiped);
        const trimmed = entries.slice(0, MAX_STORED);
        return Object.fromEntries(trimmed);
      }
      return collection;
    };
    
    memory.liked = trimCollection(memory.liked);
    memory.disliked = trimCollection(memory.disliked);
  }
  
  // ============================================
  // MAKE CARDS SWIPEABLE
  // ============================================
  
  function enableSwipe(cardElement, movieData) {
    if (!cardElement || !movieData) return;
    
    // Store movie data on element
    cardElement.dataset.swipeMovie = JSON.stringify({
      id: movieData.id,
      title: movieData.title,
      genre_ids: movieData.genre_ids || [],
      poster_path: movieData.poster_path
    });
    
    // Add swipe indicator elements
    if (!cardElement.querySelector('.swipe-indicator')) {
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'swipe-indicator swipe-left-indicator';
      leftIndicator.innerHTML = '<span>✗</span>';
      
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'swipe-indicator swipe-right-indicator';
      rightIndicator.innerHTML = '<span>♥</span>';
      
      cardElement.appendChild(leftIndicator);
      cardElement.appendChild(rightIndicator);
    }
    
    // Touch events
    cardElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardElement.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events (for desktop)
    cardElement.addEventListener('mousedown', handleMouseDown);
  }
  
  function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    
    activeCard = e.currentTarget;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentX = 0;
    isDragging = false;
    
    activeCard.style.transition = 'none';
  }
  
  function handleTouchMove(e) {
    if (!activeCard) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    // Only swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isDragging = true;
      e.preventDefault();
      currentX = deltaX;
      updateCardPosition(activeCard, deltaX);
    }
  }
  
  function handleTouchEnd() {
    if (!activeCard) return;
    
    if (isDragging) {
      processSwipe(activeCard, currentX);
    }
    
    resetCard(activeCard);
    activeCard = null;
    isDragging = false;
  }
  
  function handleMouseDown(e) {
    // Ignore if clicking delete button or other interactive elements
    if (e.target.closest('.movie-delete, .swipe-indicator, button')) return;
    
    activeCard = e.currentTarget;
    startX = e.clientX;
    currentX = 0;
    isDragging = false;
    
    activeCard.style.transition = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  
  function handleMouseMove(e) {
    if (!activeCard) return;
    
    const deltaX = e.clientX - startX;
    
    if (Math.abs(deltaX) > 10) {
      isDragging = true;
      currentX = deltaX;
      updateCardPosition(activeCard, deltaX);
    }
  }
  
  function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (!activeCard) return;
    
    if (isDragging) {
      processSwipe(activeCard, currentX);
    }
    
    resetCard(activeCard);
    activeCard = null;
    isDragging = false;
  }
  
  function updateCardPosition(card, deltaX) {
    const rotation = deltaX * ROTATION_FACTOR;
    const cappedRotation = Math.max(-30, Math.min(30, rotation));
    
    card.style.transform = `translateX(${deltaX}px) rotate(${cappedRotation}deg)`;
    
    // Update indicator opacity based on swipe distance
    const progress = Math.min(1, Math.abs(deltaX) / SWIPE_THRESHOLD);
    
    const leftIndicator = card.querySelector('.swipe-left-indicator');
    const rightIndicator = card.querySelector('.swipe-right-indicator');
    
    if (deltaX < 0 && leftIndicator) {
      leftIndicator.style.opacity = progress;
      if (rightIndicator) rightIndicator.style.opacity = 0;
    } else if (deltaX > 0 && rightIndicator) {
      rightIndicator.style.opacity = progress;
      if (leftIndicator) leftIndicator.style.opacity = 0;
    }
    
    // Add visual feedback class
    card.classList.toggle('swiping-left', deltaX < -SWIPE_THRESHOLD / 2);
    card.classList.toggle('swiping-right', deltaX > SWIPE_THRESHOLD / 2);
  }
  
  function resetCard(card) {
    if (!card) return;
    
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    card.style.transform = '';
    card.classList.remove('swiping-left', 'swiping-right');
    
    const leftIndicator = card.querySelector('.swipe-left-indicator');
    const rightIndicator = card.querySelector('.swipe-right-indicator');
    if (leftIndicator) leftIndicator.style.opacity = 0;
    if (rightIndicator) rightIndicator.style.opacity = 0;
  }
  
  // ============================================
  // PROCESS SWIPE
  // ============================================
  
  function processSwipe(card, deltaX) {
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    
    let movieData;
    try {
      movieData = JSON.parse(card.dataset.swipeMovie);
    } catch (e) {
      console.error("Invalid movie data on card");
      return;
    }
    
    const movieId = movieData.id;
    const isLike = deltaX > 0;
    
    if (isLike) {
      recordLike(movieId, movieData);
      showSwipeFeedback(card, 'liked');
    } else {
      recordDislike(movieId, movieData);
      showSwipeFeedback(card, 'disliked');
    }
    
    // Update genre affinities
    updateGenreAffinities(movieData.genre_ids || [], isLike);
    
    saveMemory();
  }
  
  function recordLike(movieId, movieData) {
    // Remove from disliked if present
    delete memory.disliked[movieId];
    
    // Add/update in liked
    if (memory.liked[movieId]) {
      memory.liked[movieId].count++;
      memory.liked[movieId].lastSwiped = Date.now();
    } else {
      memory.liked[movieId] = {
        count: 1,
        lastSwiped: Date.now(),
        movie: movieData
      };
    }
    
    console.log("♥ Liked:", movieData.title);
  }
  
  function recordDislike(movieId, movieData) {
    // Remove from liked if present
    delete memory.liked[movieId];
    
    // Add/update in disliked
    if (memory.disliked[movieId]) {
      memory.disliked[movieId].count++;
      memory.disliked[movieId].lastSwiped = Date.now();
    } else {
      memory.disliked[movieId] = {
        count: 1,
        lastSwiped: Date.now(),
        movie: movieData
      };
    }
    
    console.log("✗ Disliked:", movieData.title);
  }
  
  function updateGenreAffinities(genreIds, isPositive) {
    const delta = isPositive ? 1 : -1;
    
    genreIds.forEach(genreId => {
      if (!memory.genreAffinities[genreId]) {
        memory.genreAffinities[genreId] = 0;
      }
      memory.genreAffinities[genreId] += delta;
    });
  }
  
  function showSwipeFeedback(card, type) {
    // Brief visual flash
    card.classList.add(`swipe-feedback-${type}`);
    
    setTimeout(() => {
      card.classList.remove(`swipe-feedback-${type}`);
    }, 400);
  }
  
  // ============================================
  // QUERY FUNCTIONS (for other modules to use)
  // ============================================
  
  function isLiked(movieId) {
    return !!memory.liked[movieId];
  }
  
  function isDisliked(movieId) {
    return !!memory.disliked[movieId];
  }
  
  function getPreference(movieId) {
    if (memory.liked[movieId]) return 'liked';
    if (memory.disliked[movieId]) return 'disliked';
    return null;
  }
  
  function getLikedMovies() {
    return Object.values(memory.liked).map(entry => entry.movie);
  }
  
  function getDislikedMovies() {
    return Object.values(memory.disliked).map(entry => entry.movie);
  }
  
  function getGenreAffinities() {
    return { ...memory.genreAffinities };
  }
  
  // Calculate a "boost" score for a movie based on learned preferences
  function getAffinityBoost(movie) {
    const genres = movie.genre_ids || [];
    if (genres.length === 0) return 0;
    
    let totalAffinity = 0;
    genres.forEach(genreId => {
      totalAffinity += memory.genreAffinities[genreId] || 0;
    });
    
    // Normalize to roughly -10 to +10 range
    return totalAffinity / genres.length;
  }
  
  // Get suggested vibe slider defaults based on liked movies
  function getSuggestedVibes() {
    const likedMovies = getLikedMovies();
    if (likedMovies.length < 3) return null; // Need enough data
    
    // This would analyze liked movies' genres and return suggested slider positions
    // For now, return null (feature for future enhancement)
    return null;
  }
  
  function getStats() {
    return {
      likedCount: Object.keys(memory.liked).length,
      dislikedCount: Object.keys(memory.disliked).length,
      topGenres: getTopGenres(5),
      bottomGenres: getBottomGenres(3)
    };
  }
  
  function getTopGenres(n = 5) {
    return Object.entries(memory.genreAffinities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([id, score]) => ({ id: parseInt(id), score }));
  }
  
  function getBottomGenres(n = 3) {
    return Object.entries(memory.genreAffinities)
      .sort((a, b) => a[1] - b[1])
      .slice(0, n)
      .map(([id, score]) => ({ id: parseInt(id), score }));
  }
  
  function clearMemory() {
    memory = { liked: {}, disliked: {}, genreAffinities: {} };
    saveMemory();
    console.log("Swipe memory cleared");
  }
  
  // ============================================
  function getLikedIds() {
    return Object.keys(memory.liked).map(Number);
  }

  function setPreference(movieId, preference, movieData) {
    const data = movieData || { id: movieId };
    if (preference === "like") {
      recordLike(movieId, data);
    } else {
      recordDislike(movieId, data);
    }
    updateGenreAffinities(data.genre_ids || (data.genres || []).map(g => g.id) || [], preference === "like");
    saveMemory();
  }

  // PUBLIC API
  // ============================================

  return {
    init,
    enableSwipe,
    isLiked,
    isDisliked,
    getPreference,
    getLikedIds,
    setPreference,
    getLikedMovies,
    getDislikedMovies,
    getGenreAffinities,
    getAffinityBoost,
    getSuggestedVibes,
    getStats,
    clearMemory
  };
  
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SwipeMemory.init);
} else {
  SwipeMemory.init();
}