/* =============================================
   WATCHLIST SERVICE
   Manages user's movie watchlist (unlimited) in localStorage
   localStorage key: orbit_watchlist
   Data format: { movies: [{ id, title, poster_path, release_date, vote_average, addedAt }], updatedAt }
============================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'orbit_watchlist';

  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  /**
   * Get the current watchlist from localStorage
   * @returns {Array} Array of movie objects
   */
  function getWatchlist() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      if (!data.movies || !Array.isArray(data.movies)) return [];

      return data.movies;
    } catch (error) {
      console.error('Error reading watchlist:', error);
      return [];
    }
  }

  /**
   * Add a movie to the watchlist
   * @param {Object} movie - { id, title, poster_path?, release_date?, vote_average? }
   * @returns {Object} { success, count } or { success: false, error }
   */
  function addToWatchlist(movie) {
    try {
      if (!movie || !movie.id || !movie.title) {
        return { success: false, error: 'Invalid movie data' };
      }

      const watchlist = getWatchlist();

      if (watchlist.some(m => m.id === movie.id)) {
        return { success: false, error: 'Already in watchlist' };
      }

      watchlist.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || null,
        release_date: movie.release_date || null,
        vote_average: movie.vote_average || null,
        addedAt: new Date().toISOString()
      });

      saveWatchlist(watchlist);
      return { success: true, count: watchlist.length };
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return { success: false, error: 'Failed to add movie' };
    }
  }

  /**
   * Remove a movie from the watchlist by ID
   * @param {number|string} movieId
   * @returns {Object} { success, count }
   */
  function removeFromWatchlist(movieId) {
    try {
      const watchlist = getWatchlist();
      const filtered = watchlist.filter(m => m.id !== parseInt(movieId));
      saveWatchlist(filtered);
      return { success: true, count: filtered.length };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return { success: false, count: getWatchlistCount() };
    }
  }

  /**
   * Check if a movie is in the watchlist
   * @param {number|string} movieId
   * @returns {boolean}
   */
  function isInWatchlist(movieId) {
    try {
      return getWatchlist().some(m => m.id === parseInt(movieId));
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current watchlist count
   * @returns {number}
   */
  function getWatchlistCount() {
    try {
      return getWatchlist().length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clear all movies from the watchlist
   */
  function clearWatchlist() {
    try {
      saveWatchlist([]);
    } catch (error) {
      console.error('Error clearing watchlist:', error);
    }
  }

  // ============================================================================
  // INTERNAL HELPER
  // ============================================================================

  function saveWatchlist(movies) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        movies: movies,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  }

  // ============================================================================
  // EXPOSE ON WINDOW (matches shortlist-service.js pattern)
  // ============================================================================

  window.getWatchlist = getWatchlist;
  window.addToWatchlist = addToWatchlist;
  window.removeFromWatchlist = removeFromWatchlist;
  window.isInWatchlist = isInWatchlist;
  window.getWatchlistCount = getWatchlistCount;
  window.clearWatchlist = clearWatchlist;

})();
