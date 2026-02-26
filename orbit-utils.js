/* ============================================
   ORBIT — Shared Utility Library
   Attach to window.OrbitUtils (no ES modules)
============================================ */

(function () {
  'use strict';

  var OrbitUtils = {};

  OrbitUtils.ROOT = (function () {
    var p = location.pathname;
    if (p.includes('/pages/') || p.includes('/games/') || p.includes('/tests/')) return '../';
    return '';
  })();

  /* ──────────────────────────────────────────
     TMDB API Helpers
  ────────────────────────────────────────── */

  /** Base URL for TMDB REST API (v3). */
  OrbitUtils.TMDB_BASE = 'https://api.themoviedb.org/3';

  /** Base URL for TMDB image CDN. */
  OrbitUtils.TMDB_IMG = 'https://image.tmdb.org/t/p/';

  /** Common image size presets. */
  OrbitUtils.IMAGE_SIZES = {
    POSTER_SM: 'w92',
    POSTER_MD: 'w185',
    POSTER_LG: 'w500',
    PROFILE_SM: 'w45',
    PROFILE_MD: 'w185',
    BACKDROP: 'w1280',
    LOGO: 'original'
  };

  /**
   * Build a full TMDB image URL.
   * @param {string|null} path  - TMDB file path (e.g. "/abc123.jpg")
   * @param {string}      [size='w500'] - Image size preset
   * @returns {string|null} Full URL, or null if path is falsy
   */
  OrbitUtils.tmdbImageUrl = function (path, size) {
    if (!path) return null;
    return OrbitUtils.TMDB_IMG + (size || 'w500') + path;
  };

  /**
   * Fetch JSON from a TMDB API endpoint.
   * Automatically prepends the base URL and appends the API key.
   * @param {string} endpoint - API path (e.g. "/movie/550")
   * @param {Object} [params={}] - Additional query parameters
   * @returns {Promise<Object>} Parsed JSON response
   */
  OrbitUtils.tmdbFetch = function (endpoint, params) {
    var query = 'api_key=' + (typeof TMDB_API_KEY !== 'undefined' ? TMDB_API_KEY : '');
    if (params) {
      Object.keys(params).forEach(function (k) {
        if (params[k] != null) {
          query += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }
      });
    }
    var url = OrbitUtils.TMDB_BASE + endpoint + '?' + query;
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('TMDB ' + r.status + ': ' + endpoint);
      return r.json();
    });
  };

  /* ──────────────────────────────────────────
     localStorage Helpers
  ────────────────────────────────────────── */

  OrbitUtils.store = {
    /**
     * Read a value from localStorage, JSON-parsed.
     * @param {string} key
     * @param {*}      [defaultValue=null]
     * @returns {*} Parsed value or defaultValue on error/missing
     */
    get: function (key, defaultValue) {
      try {
        var raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : (defaultValue !== undefined ? defaultValue : null);
      } catch (e) {
        return defaultValue !== undefined ? defaultValue : null;
      }
    },

    /**
     * Write a value to localStorage as JSON.
     * @param {string} key
     * @param {*}      value
     */
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // storage full — silently fail
      }
    },

    /**
     * Remove a key from localStorage.
     * @param {string} key
     */
    remove: function (key) {
      localStorage.removeItem(key);
    }
  };

  /* ──────────────────────────────────────────
     Puzzle / Date Helpers
  ────────────────────────────────────────── */

  /** @type {Date} Fixed launch date for daily puzzle rotation. */
  var LAUNCH_DATE = new Date('2026-02-16');

  /**
   * Number of days since the ORBIT launch date (2026-02-16).
   * @returns {number}
   */
  OrbitUtils.getDayNumber = function () {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor((today - LAUNCH_DATE) / (1000 * 60 * 60 * 24));
  };

  /**
   * Daily puzzle index: dayNumber modulo the length of a puzzle array.
   * Drop-in replacement for the per-game getDailyPuzzleIndex().
   * @param {number} arrayLength - Length of the puzzle array
   * @returns {number}
   */
  OrbitUtils.getPuzzleIndex = function (arrayLength) {
    return OrbitUtils.getDayNumber() % arrayLength;
  };

  /* ──────────────────────────────────────────
     Navigation Helpers
  ────────────────────────────────────────── */

  /**
   * Navigate to the actor timeline page.
   * Supports both the localStorage pattern (series.js) and the
   * query-string pattern (game.js).
   * @param {number|string} personId   - TMDB person ID
   * @param {string}        [personName] - Display name (unused currently, reserved)
   * @param {string}        [type='person'] - Entity type
   */
  OrbitUtils.navigateToTimeline = function (personId, personName, type) {
    localStorage.setItem('timelineMovieId', personId);
    localStorage.setItem('timelineType', type || 'person');
    window.location.href = OrbitUtils.ROOT + 'pages/actor-timeline.html';
  };

  /**
   * Navigate to the Venn diagram page with a set of people.
   * @param {Array<{id:number, name:string}>} people - Array of person objects
   */
  OrbitUtils.navigateToVenn = function (people) {
    if (!people || !people.length) return;
    var ids = people.map(function (p) { return p.id; }).join(',');
    var names = people.map(function (p) { return encodeURIComponent(p.name); }).join(',');
    window.location.href = OrbitUtils.ROOT + 'pages/venn.html?ids=' + ids + '&names=' + names;
  };

  /* ──────────────────────────────────────────
     DOM Helpers
  ────────────────────────────────────────── */

  /**
   * Shorthand for document.createElement with optional class + text.
   * @param {string} tag
   * @param {string} [className]
   * @param {string} [textContent]
   * @returns {HTMLElement}
   */
  OrbitUtils.el = function (tag, className, textContent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent) node.textContent = textContent;
    return node;
  };

  /**
   * Extract a 4-digit year from a date string (e.g. "2024-06-15" → "2024").
   * @param {string} dateString
   * @returns {string} Year portion, or '' if invalid
   */
  OrbitUtils.formatYear = function (dateString) {
    if (!dateString || dateString.length < 4) return '';
    return dateString.substring(0, 4);
  };

  /* ──────────────────────────────────────────
     General Utilities
  ────────────────────────────────────────── */

  /**
   * Standard debounce. Preserves `this` context.
   * @param {Function} fn    - Function to debounce
   * @param {number}   delay - Milliseconds to wait
   * @returns {Function} Debounced wrapper
   */
  OrbitUtils.debounce = function (fn, delay) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () { fn.apply(context, args); }, delay);
    };
  };

  /* ──────────────────────────────────────────
     Filter Registry
  ────────────────────────────────────────── */

  OrbitUtils.FILTER_REGISTRY = [
    { id: 'people',         title: 'People',                 subtitle: 'Actors, directors, writers',        iconClass: 'icon-people' },
    { id: 'genres',         title: 'Genres',                 subtitle: 'Action, drama, horror & more',      iconClass: 'icon-genres' },
    { id: 'timeEra',        title: 'Release Date & Runtime', subtitle: 'Year, decade, film length',         iconClass: 'icon-datetime' },
    { id: 'ratingsContent', title: 'Ratings & Content',      subtitle: 'Score, votes, age rating',          iconClass: 'icon-ratings' },
    { id: 'awards',         title: 'Awards',                 subtitle: 'Oscar, Golden Globe & more',        iconClass: 'icon-awards' },
    { id: 'themes',         title: 'Themes',                 subtitle: "What's the movie really about?",    iconClass: 'icon-themes' },
    { id: 'settingWhere',   title: 'Setting: Where',         subtitle: 'Story location — cities, countries', iconClass: 'icon-where' },
    { id: 'settingWhen',    title: 'Setting: When',          subtitle: 'Story time period — decades & eras', iconClass: 'icon-when' },
    { id: 'basedOn',        title: 'Based On',               subtitle: 'Source material & franchise status', iconClass: 'icon-basedon' },
    { id: 'regionLanguage', title: 'Region & Language',      subtitle: 'Origin, language',                  iconClass: 'icon-region' },
    { id: 'production',     title: 'Production & Box Office', subtitle: 'Studios, budget, revenue',         iconClass: 'icon-production' },
    { id: 'watch',          title: 'Watch Providers',        subtitle: 'Streaming & availability',          iconClass: 'icon-watch' },
    { id: 'universes',      title: 'Universes',              subtitle: 'Collections & franchises',          iconClass: 'icon-universes' }
  ];

  OrbitUtils.DEFAULT_LAYOUT = ['people', 'genres', 'timeEra', 'ratingsContent', 'awards'];

  /* ──────────────────────────────────────────
     Expose on window
  ────────────────────────────────────────── */

  window.OrbitUtils = OrbitUtils;

})();
