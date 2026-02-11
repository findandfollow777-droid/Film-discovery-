/* =============================================
   SHORTLIST SERVICE
   Manages user's movie shortlist (max 20) in localStorage
============================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'orbit_shortlist';
  const MAX_SIZE = 20;

  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  /**
   * Get the current shortlist from localStorage
   * @returns {Array} Array of movie objects { id, title, year, poster, addedAt }
   */
  function getShortlist() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      if (!data.movies || !Array.isArray(data.movies)) return [];

      return data.movies;
    } catch (error) {
      console.error('Error reading shortlist:', error);
      return [];
    }
  }

  /**
   * Add a movie to the shortlist
   * @param {Object} movie - { id, title, year, poster }
   * @returns {Object} { success, error?, count? }
   */
  function addToShortlist(movie) {
    try {
      if (!movie || !movie.id || !movie.title) {
        return { success: false, error: 'Invalid movie data' };
      }

      const shortlist = getShortlist();

      if (shortlist.some(m => m.id === movie.id)) {
        return { success: false, error: 'Already in shortlist' };
      }

      if (shortlist.length >= MAX_SIZE) {
        return { success: false, error: `Shortlist full (${MAX_SIZE}/${MAX_SIZE})` };
      }

      shortlist.push({
        id: movie.id,
        title: movie.title,
        year: movie.year || null,
        poster: movie.poster || null,
        addedAt: new Date().toISOString()
      });

      saveShortlist(shortlist);
      return { success: true, count: shortlist.length };
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      return { success: false, error: 'Failed to add movie' };
    }
  }

  /**
   * Remove a movie from the shortlist by ID
   * @param {number|string} movieId
   * @returns {Object} { success, count }
   */
  function removeFromShortlist(movieId) {
    try {
      const shortlist = getShortlist();
      const filtered = shortlist.filter(m => m.id !== parseInt(movieId));
      saveShortlist(filtered);
      return { success: true, count: filtered.length };
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      return { success: false, count: getShortlistCount() };
    }
  }

  /**
   * Check if a movie is in the shortlist
   * @param {number|string} movieId
   * @returns {boolean}
   */
  function isInShortlist(movieId) {
    try {
      return getShortlist().some(m => m.id === parseInt(movieId));
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current shortlist count (0-20)
   * @returns {number}
   */
  function getShortlistCount() {
    try {
      return getShortlist().length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if shortlist has enough movies to compare (>= 2)
   * @returns {boolean}
   */
  function canCompare() {
    return getShortlistCount() >= 2;
  }

  /**
   * Clear all movies from the shortlist
   */
  function clearShortlist() {
    try {
      saveShortlist([]);
    } catch (error) {
      console.error('Error clearing shortlist:', error);
    }
  }

  // ============================================================================
  // INTERNAL HELPER
  // ============================================================================

  function saveShortlist(movies) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        movies: movies,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving shortlist:', error);
    }
  }

  // ============================================================================
  // EXPOSE ON WINDOW (consumed by moviecube.js via getShortlistFunctions)
  // ============================================================================

  window.getShortlist = getShortlist;
  window.addToShortlist = addToShortlist;
  window.removeFromShortlist = removeFromShortlist;
  window.isInShortlist = isInShortlist;
  window.getShortlistCount = getShortlistCount;
  window.canCompare = canCompare;
  window.clearShortlist = clearShortlist;

})();
