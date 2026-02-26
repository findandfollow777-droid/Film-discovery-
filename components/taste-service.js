/* =============================================
   TASTE SERVICE
   Unified preference engine — Love It / Not Tonight
   Manages user taste signals across all ORBIT surfaces
   localStorage key: orbit_taste
============================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'orbit_taste';
  var SKIP_DECAY_DAYS = 30;
  var LOG_PREFIX = '[Orbit Taste]';

  // ============================================================================
  // INTERNAL HELPERS
  // ============================================================================

  function log() {
    var args = [LOG_PREFIX].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, args);
  }

  function readStore() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { loved: [], skipped: [] };

      var data = JSON.parse(stored);
      if (!Array.isArray(data.loved)) data.loved = [];
      if (!Array.isArray(data.skipped)) data.skipped = [];
      return data;
    } catch (error) {
      console.error(LOG_PREFIX, 'Error reading taste data:', error);
      return { loved: [], skipped: [] };
    }
  }

  function writeStore(data) {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error(LOG_PREFIX, 'Error saving taste data:', error);
    }
  }

  function validateMovie(movieData) {
    if (!movieData || typeof movieData !== 'object') return false;
    if (!movieData.id || !movieData.title) return false;
    return true;
  }

  function normalizeMovie(movieData) {
    return {
      id: parseInt(movieData.id),
      title: String(movieData.title),
      year: movieData.year ? parseInt(movieData.year) : null,
      poster: movieData.poster || null,
      genres: Array.isArray(movieData.genres) ? movieData.genres.map(Number) : []
    };
  }

  // ============================================================================
  // MAINTENANCE
  // ============================================================================

  /**
   * Remove skipped items older than SKIP_DECAY_DAYS.
   * Called internally on read operations.
   */
  function cleanExpiredSkips() {
    try {
      var data = readStore();
      var now = Date.now();
      var threshold = SKIP_DECAY_DAYS * 24 * 60 * 60 * 1000;
      var originalLength = data.skipped.length;

      data.skipped = data.skipped.filter(function (item) {
        var skippedTime = new Date(item.skippedAt).getTime();
        return (now - skippedTime) < threshold;
      });

      if (data.skipped.length < originalLength) {
        var removed = originalLength - data.skipped.length;
        log('Cleaned ' + removed + ' expired skip(s)');
        writeStore(data);
      }

      return { success: true, removed: originalLength - data.skipped.length };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error cleaning expired skips:', error);
      return { success: false, error: 'Failed to clean expired skips' };
    }
  }

  /**
   * Full reset — clear all taste data
   */
  function clearAllTasteData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      log('All taste data cleared');
      return { success: true };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error clearing taste data:', error);
      return { success: false, error: 'Failed to clear taste data' };
    }
  }

  // ============================================================================
  // READ FUNCTIONS
  // ============================================================================

  /**
   * Get full taste data object { loved, skipped }
   * Runs skip decay cleanup automatically
   */
  function getTasteData() {
    try {
      cleanExpiredSkips();
      return readStore();
    } catch (error) {
      console.error(LOG_PREFIX, 'Error getting taste data:', error);
      return { loved: [], skipped: [] };
    }
  }

  /**
   * Get loved movies array (after decay cleanup)
   * @returns {Array}
   */
  function getLovedMovies() {
    try {
      return getTasteData().loved;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get skipped movies array (after decay cleanup)
   * @returns {Array}
   */
  function getSkippedMovies() {
    try {
      return getTasteData().skipped;
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if a movie is loved
   * @param {number|string} movieId
   * @returns {boolean}
   */
  function isLoved(movieId) {
    try {
      var id = parseInt(movieId);
      return readStore().loved.some(function (m) { return m.id === id; });
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a movie is skipped
   * @param {number|string} movieId
   * @returns {boolean}
   */
  function isSkipped(movieId) {
    try {
      var id = parseInt(movieId);
      var data = readStore();
      // Check after decay
      var now = Date.now();
      var threshold = SKIP_DECAY_DAYS * 24 * 60 * 60 * 1000;
      return data.skipped.some(function (m) {
        return m.id === id && (now - new Date(m.skippedAt).getTime()) < threshold;
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the taste status of a movie
   * @param {number|string} movieId
   * @returns {string|null} "loved" | "skipped" | null
   */
  function getTasteStatus(movieId) {
    try {
      if (isLoved(movieId)) return 'loved';
      if (isSkipped(movieId)) return 'skipped';
      return null;
    } catch (error) {
      return null;
    }
  }

  // ============================================================================
  // WRITE FUNCTIONS
  // ============================================================================

  /**
   * Love a movie. If currently skipped, moves it to loved.
   * @param {Object} movieData - { id, title, year?, poster?, genres? }
   * @returns {Object} { success, status?, error? }
   */
  function loveMovie(movieData) {
    try {
      if (!validateMovie(movieData)) {
        return { success: false, error: 'Invalid movie data — id and title required' };
      }

      var movie = normalizeMovie(movieData);
      var data = readStore();
      var id = movie.id;

      // Already loved?
      if (data.loved.some(function (m) { return m.id === id; })) {
        log('"' + movie.title + '" is already loved');
        return { success: true, status: 'already_loved' };
      }

      // If skipped, remove from skipped
      var wasSkipped = data.skipped.some(function (m) { return m.id === id; });
      if (wasSkipped) {
        data.skipped = data.skipped.filter(function (m) { return m.id !== id; });
        log('Moved "' + movie.title + '" from skipped to loved');
      }

      // Add to loved
      data.loved.push({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        genres: movie.genres,
        addedAt: new Date().toISOString()
      });

      writeStore(data);
      log('Loved "' + movie.title + '"' + (wasSkipped ? ' (was skipped)' : ''));
      return { success: true, status: wasSkipped ? 'moved_from_skipped' : 'loved' };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error loving movie:', error);
      return { success: false, error: 'Failed to love movie' };
    }
  }

  /**
   * Skip a movie ("Not tonight"). Blocks if currently loved — must unlove first.
   * @param {Object} movieData - { id, title, year?, poster?, genres? }
   * @returns {Object} { success, status?, error? }
   */
  function skipMovie(movieData) {
    try {
      if (!validateMovie(movieData)) {
        return { success: false, error: 'Invalid movie data — id and title required' };
      }

      var movie = normalizeMovie(movieData);
      var data = readStore();
      var id = movie.id;

      // Block if loved
      if (data.loved.some(function (m) { return m.id === id; })) {
        log('Cannot skip "' + movie.title + '" — it is loved. Unlove first.');
        return { success: false, status: 'blocked_by_love', error: 'Movie is loved — unlove it first' };
      }

      // Already skipped?
      if (data.skipped.some(function (m) { return m.id === id; })) {
        log('"' + movie.title + '" is already skipped');
        return { success: true, status: 'already_skipped' };
      }

      // Add to skipped
      data.skipped.push({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        genres: movie.genres,
        skippedAt: new Date().toISOString()
      });

      writeStore(data);
      log('Skipped "' + movie.title + '"');
      return { success: true, status: 'skipped' };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error skipping movie:', error);
      return { success: false, error: 'Failed to skip movie' };
    }
  }

  /**
   * Remove a movie from loved
   * @param {number|string} movieId
   * @returns {Object} { success }
   */
  function unloveMovie(movieId) {
    try {
      var id = parseInt(movieId);
      var data = readStore();
      var original = data.loved.length;
      data.loved = data.loved.filter(function (m) { return m.id !== id; });

      if (data.loved.length < original) {
        writeStore(data);
        log('Unloved movie ' + id);
        return { success: true };
      }
      return { success: true, status: 'not_found' };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error unloving movie:', error);
      return { success: false, error: 'Failed to unlove movie' };
    }
  }

  /**
   * Remove a movie from skipped
   * @param {number|string} movieId
   * @returns {Object} { success }
   */
  function unskipMovie(movieId) {
    try {
      var id = parseInt(movieId);
      var data = readStore();
      var original = data.skipped.length;
      data.skipped = data.skipped.filter(function (m) { return m.id !== id; });

      if (data.skipped.length < original) {
        writeStore(data);
        log('Unskipped movie ' + id);
        return { success: true };
      }
      return { success: true, status: 'not_found' };
    } catch (error) {
      console.error(LOG_PREFIX, 'Error unskipping movie:', error);
      return { success: false, error: 'Failed to unskip movie' };
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  /**
   * Get genre weight map from loved movies: { genreId: count }
   * @returns {Object}
   */
  function getLovedGenreWeights() {
    try {
      var loved = readStore().loved;
      var weights = {};

      loved.forEach(function (movie) {
        if (Array.isArray(movie.genres)) {
          movie.genres.forEach(function (genreId) {
            weights[genreId] = (weights[genreId] || 0) + 1;
          });
        }
      });

      return weights;
    } catch (error) {
      return {};
    }
  }

  /**
   * Get full taste profile for display on Profile page
   * @returns {Object} { topGenres, lovedCount, skippedCount, lovedDecades }
   */
  function getTasteProfile() {
    try {
      var data = getTasteData();
      var weights = getLovedGenreWeights();

      // Top genres sorted by count descending
      var topGenres = Object.keys(weights)
        .map(function (id) { return { id: parseInt(id), count: weights[id] }; })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 5);

      // Decade distribution from loved movies
      var decades = {};
      data.loved.forEach(function (movie) {
        if (movie.year) {
          var decade = Math.floor(movie.year / 10) * 10;
          decades[decade] = (decades[decade] || 0) + 1;
        }
      });

      return {
        topGenres: topGenres,
        lovedCount: data.loved.length,
        skippedCount: data.skipped.length,
        lovedDecades: decades
      };
    } catch (error) {
      return { topGenres: [], lovedCount: 0, skippedCount: 0, lovedDecades: {} };
    }
  }

  // ============================================================================
  // EXPOSE ON WINDOW
  // ============================================================================

  // Read
  window.getTasteData = getTasteData;
  window.getLovedMovies = getLovedMovies;
  window.getSkippedMovies = getSkippedMovies;
  window.isLoved = isLoved;
  window.isSkipped = isSkipped;
  window.getTasteStatus = getTasteStatus;

  // Write
  window.loveMovie = loveMovie;
  window.skipMovie = skipMovie;
  window.unloveMovie = unloveMovie;
  window.unskipMovie = unskipMovie;

  // Analytics
  window.getTasteProfile = getTasteProfile;
  window.getLovedGenreWeights = getLovedGenreWeights;

  // Maintenance
  window.cleanExpiredSkips = cleanExpiredSkips;
  window.clearAllTasteData = clearAllTasteData;

  log('Service initialized');

})();
