/* ============================================================
   WATCHED SERVICE — Added 2026-03-28
   Tracks movies the user has already seen.
   localStorage key: orbit_watched
   Data format: { movies: [{ id, title, poster_path, release_date, vote_average, addedAt }], updatedAt }
   Follows same pattern as watchlist-service.js
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'orbit_watched';

  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  /**
   * Get the current watched list from localStorage
   * @returns {Array} Array of movie objects
   */
  function getWatched() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      if (!data.movies || !Array.isArray(data.movies)) return [];

      return data.movies;
    } catch (error) {
      console.error('Error reading watched list:', error);
      return [];
    }
  }

  /**
   * Add a movie to the watched list
   * @param {Object} movie - { id, title, poster_path?, release_date?, vote_average? }
   * @returns {Object} { success, count } or { success: false, error }
   */
  function addToWatched(movie) {
    try {
      if (!movie || !movie.id || !movie.title) {
        return { success: false, error: 'Invalid movie data' };
      }

      const watched = getWatched();

      if (watched.some(m => m.id === movie.id)) {
        return { success: false, error: 'Already in watched list' };
      }

      watched.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || null,
        release_date: movie.release_date || null,
        vote_average: movie.vote_average || null,
        addedAt: new Date().toISOString()
      });

      saveWatched(watched);
      return { success: true, count: watched.length };
    } catch (error) {
      console.error('Error adding to watched list:', error);
      return { success: false, error: 'Failed to add movie' };
    }
  }

  /**
   * Remove a movie from the watched list by ID
   * @param {number|string} movieId
   * @returns {Object} { success, count }
   */
  function removeFromWatched(movieId) {
    try {
      const watched = getWatched();
      const filtered = watched.filter(m => m.id !== parseInt(movieId));
      saveWatched(filtered);
      return { success: true, count: filtered.length };
    } catch (error) {
      console.error('Error removing from watched list:', error);
      return { success: false, count: getWatchedCount() };
    }
  }

  /**
   * Check if a movie is in the watched list
   * @param {number|string} movieId
   * @returns {boolean}
   */
  function isWatched(movieId) {
    try {
      return getWatched().some(m => m.id === parseInt(movieId));
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current watched list count
   * @returns {number}
   */
  function getWatchedCount() {
    try {
      return getWatched().length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clear all movies from the watched list
   */
  function clearWatched() {
    try {
      saveWatched([]);
    } catch (error) {
      console.error('Error clearing watched list:', error);
    }
  }

  // ============================================================================
  // INTERNAL HELPER
  // ============================================================================

  function saveWatched(movies) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        movies: movies,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving watched list:', error);
    }
  }

  // ============================================================================
  // EXPOSE ON WINDOW (matches watchlist-service.js / shortlist-service.js pattern)
  // ============================================================================

  window.getWatched = getWatched;
  window.addToWatched = addToWatched;
  window.removeFromWatched = removeFromWatched;
  window.isWatched = isWatched;
  window.getWatchedCount = getWatchedCount;
  window.clearWatched = clearWatched;

})();
