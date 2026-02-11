// shortlist-service.js
// Browser-compatible module for managing user's movie shortlist
// Max 5 movies, stored in localStorage

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'orbit_shortlist';
const MAX_SHORTLIST_SIZE = 5;

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get the current shortlist from localStorage
 * @returns {Array} Array of movie objects
 */
export function getShortlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const data = JSON.parse(stored);

    // Validate structure
    if (!data.movies || !Array.isArray(data.movies)) {
      console.warn('Invalid shortlist structure, resetting');
      return [];
    }

    return data.movies;
  } catch (error) {
    console.error('Error reading shortlist:', error);
    return [];
  }
}

/**
 * Add a movie to the shortlist
 * @param {Object} movie - Movie object with { id, title, year, poster }
 * @returns {Object} { success: boolean, error?: string, count?: number }
 */
export function addToShortlist(movie) {
  try {
    // Validate movie object
    if (!movie || !movie.id || !movie.title) {
      return {
        success: false,
        error: 'Invalid movie data'
      };
    }

    // Get current shortlist
    const shortlist = getShortlist();

    // Check if already in list
    const exists = shortlist.some(m => m.id === movie.id);
    if (exists) {
      return {
        success: false,
        error: 'Already in shortlist'
      };
    }

    // Check if list is full
    if (shortlist.length >= MAX_SHORTLIST_SIZE) {
      return {
        success: false,
        error: `Shortlist full (${MAX_SHORTLIST_SIZE}/${MAX_SHORTLIST_SIZE})`
      };
    }

    // Create movie entry with timestamp
    const movieEntry = {
      id: movie.id,
      title: movie.title,
      year: movie.year || null,
      poster: movie.poster || null,
      addedAt: new Date().toISOString()
    };

    // Add to shortlist
    shortlist.push(movieEntry);

    // Save to localStorage
    saveShortlist(shortlist);

    return {
      success: true,
      count: shortlist.length
    };
  } catch (error) {
    console.error('Error adding to shortlist:', error);
    return {
      success: false,
      error: 'Failed to add movie'
    };
  }
}

/**
 * Remove a movie from the shortlist
 * @param {number|string} movieId - The TMDB movie ID
 * @returns {Object} { success: boolean, count: number }
 */
export function removeFromShortlist(movieId) {
  try {
    const shortlist = getShortlist();

    // Filter out the movie
    const filtered = shortlist.filter(m => m.id !== parseInt(movieId));

    // Save updated list
    saveShortlist(filtered);

    return {
      success: true,
      count: filtered.length
    };
  } catch (error) {
    console.error('Error removing from shortlist:', error);
    return {
      success: false,
      count: getShortlistCount()
    };
  }
}

/**
 * Check if a movie is in the shortlist
 * @param {number|string} movieId - The TMDB movie ID
 * @returns {boolean} True if movie is in shortlist
 */
export function isInShortlist(movieId) {
  try {
    const shortlist = getShortlist();
    return shortlist.some(m => m.id === parseInt(movieId));
  } catch (error) {
    console.error('Error checking shortlist:', error);
    return false;
  }
}

/**
 * Clear all movies from the shortlist
 */
export function clearShortlist() {
  try {
    saveShortlist([]);
  } catch (error) {
    console.error('Error clearing shortlist:', error);
  }
}

/**
 * Get the current shortlist count
 * @returns {number} Count of movies in shortlist (0-5)
 */
export function getShortlistCount() {
  try {
    const shortlist = getShortlist();
    return shortlist.length;
  } catch (error) {
    console.error('Error getting shortlist count:', error);
    return 0;
  }
}

/**
 * Check if the shortlist has enough movies to compare
 * @returns {boolean} True if count >= 2
 */
export function canCompare() {
  return getShortlistCount() >= 2;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Save shortlist to localStorage
 * @param {Array} movies - Array of movie objects
 * @private
 */
function saveShortlist(movies) {
  try {
    const data = {
      movies,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving shortlist:', error);

    // Check for quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded');
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get shortlist with full details (for debugging)
 * @returns {Object} Full shortlist data including metadata
 */
export function getShortlistDetails() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { movies: [], updatedAt: null };
  } catch (error) {
    console.error('Error getting shortlist details:', error);
    return { movies: [], updatedAt: null };
  }
}

/**
 * Check if shortlist is full
 * @returns {boolean} True if shortlist has 5 movies
 */
export function isShortlistFull() {
  return getShortlistCount() >= MAX_SHORTLIST_SIZE;
}

/**
 * Get remaining slots in shortlist
 * @returns {number} Number of movies that can still be added (0-5)
 */
export function getRemainingSlots() {
  return Math.max(0, MAX_SHORTLIST_SIZE - getShortlistCount());
}

/**
 * Export shortlist data (for backup/sharing)
 * @returns {string} JSON string of shortlist
 */
export function exportShortlist() {
  try {
    const details = getShortlistDetails();
    return JSON.stringify(details, null, 2);
  } catch (error) {
    console.error('Error exporting shortlist:', error);
    return '{"movies": [], "error": "Export failed"}';
  }
}

/**
 * Import shortlist data (for restore/sharing)
 * @param {string} jsonString - JSON string of shortlist data
 * @returns {Object} { success: boolean, count?: number, error?: string }
 */
export function importShortlist(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (!data.movies || !Array.isArray(data.movies)) {
      return {
        success: false,
        error: 'Invalid shortlist format'
      };
    }

    // Limit to max size
    const movies = data.movies.slice(0, MAX_SHORTLIST_SIZE);

    saveShortlist(movies);

    return {
      success: true,
      count: movies.length
    };
  } catch (error) {
    console.error('Error importing shortlist:', error);
    return {
      success: false,
      error: 'Failed to import shortlist'
    };
  }
}

// ============================================================================
// CONSTANTS EXPORT (for external use)
// ============================================================================

export const MAX_SHORTLIST_MOVIES = MAX_SHORTLIST_SIZE;
export const SHORTLIST_STORAGE_KEY = STORAGE_KEY;
