// nebula-service.js
// Browser-compatible module for nebula data operations
// Handles caching, user reviews, and word frequency calculations

// ============================================================================
// STOP WORDS & PHRASE PATTERNS
// ============================================================================

const STOP_WORDS = new Set([
  // Common articles, prepositions, conjunctions
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
  'what', 'when', 'where', 'who', 'which', 'why', 'how',

  // Common pronouns
  'i', 'you', 'we', 'us', 'them', 'their', 'his', 'her', 'my', 'your',
  'our', 'me', 'him',

  // Common verbs
  'can', 'could', 'would', 'should', 'may', 'might', 'must',
  'been', 'being', 'am', 'were', 'do', 'does', 'did', 'doing',

  // Other common words
  'not', 'no', 'yes', 'so', 'than', 'too', 'very', 'just', 'there',
  'then', 'now', 'only', 'also', 'more', 'some', 'any', 'all', 'each',
  'every', 'both', 'few', 'most', 'other', 'such', 'into', 'through',
  'about', 'between', 'after', 'before', 'under', 'over', 'out', 'up',
  'down', 'off', 'again', 'once', 'here', 'while', 'during', 'if',

  // Movie-specific common words that don't add value
  'movie', 'film', 'watch', 'watched', 'watching', 'see', 'seen', 'saw'
]);

const PHRASE_PATTERNS = [
  // Hyphenated phrases
  /\b\w+-\w+(?:-\w+)*\b/gi,  // fast-paced, must-watch, edge-of-your-seat

  // Common two-word phrases (space-separated)
  /\b(visual effects|special effects|must watch|well done|highly recommend)\b/gi,
  /\b(plot twist|character development|mind bending|thought provoking)\b/gi,
  /\b(action packed|edge of|sci fi|mind blowing|stand out)\b/gi,
  /\b(box office|cult classic|instant classic|slow burn|fan favorite)\b/gi
];

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

const CACHE_PREFIX = 'orbit_nebula_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCachedData(movieId) {
  try {
    const cacheKey = `${CACHE_PREFIX}${movieId}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

function setCachedData(movieId, data) {
  try {
    const cacheKey = `${CACHE_PREFIX}${movieId}`;
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

// ============================================================================
// MAIN DATA RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get nebula data for a movie, using cache if available
 * @param {number|string} movieId - The TMDB movie ID
 * @returns {Promise<Object|null>} Nebula data object or null if not found
 */
export async function getNebulaData(movieId) {
  // Check cache first
  const cached = getCachedData(movieId);
  if (cached) {
    return cached;
  }

  // Fetch from nebula-data directory (use import.meta.url to resolve relative to this module, not the page)
  const nebulaBase = new URL('.', import.meta.url).href;
  try {
    const response = await fetch(new URL(`nebula-data/${movieId}.json`, nebulaBase));

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No nebula data for this movie
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data.movieId || !data.reviews || !data.wordFrequency) {
      console.warn('Invalid nebula data structure:', data);
      return null;
    }

    // Cache the result
    setCachedData(movieId, data);

    return data;
  } catch (error) {
    console.error(`Error fetching nebula data for movie ${movieId}:`, error);
    return null;
  }
}

/**
 * Get user-submitted reviews for a movie from localStorage
 * @param {number|string} movieId - The TMDB movie ID
 * @returns {Array} Array of review objects { text, timestamp }
 */
export function getUserReviews(movieId) {
  try {
    const key = `orbit_user_reviews_${movieId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return [];

    const reviews = JSON.parse(stored);
    return Array.isArray(reviews) ? reviews : [];
  } catch (error) {
    console.error('Error reading user reviews:', error);
    return [];
  }
}

/**
 * Save a user review for a movie
 * @param {number|string} movieId - The TMDB movie ID
 * @param {string} reviewText - The review text (must be exactly 5 words)
 * @returns {Object} { success: boolean, error?: string, totalUserReviews?: number }
 */
export function saveUserReview(movieId, reviewText) {
  try {
    // Validate exactly 5 words
    const words = reviewText.trim().split(/\s+/);

    if (words.length !== 5) {
      return {
        success: false,
        error: 'Review must be exactly 5 words'
      };
    }

    // Check for empty words
    if (words.some(word => word.length === 0)) {
      return {
        success: false,
        error: 'Review must be exactly 5 words'
      };
    }

    // Load existing reviews
    const existingReviews = getUserReviews(movieId);

    // Create new review object
    const newReview = {
      text: reviewText.trim(),
      timestamp: new Date().toISOString()
    };

    // Append and save
    existingReviews.push(newReview);
    const key = `orbit_user_reviews_${movieId}`;
    localStorage.setItem(key, JSON.stringify(existingReviews));

    return {
      success: true,
      totalUserReviews: existingReviews.length
    };
  } catch (error) {
    console.error('Error saving user review:', error);
    return {
      success: false,
      error: 'Failed to save review'
    };
  }
}

/**
 * Get merged nebula data combining AI reviews and user reviews
 * @param {number|string} movieId - The TMDB movie ID
 * @returns {Promise<Object|null>} Merged nebula data with combined reviews and frequencies
 */
export async function getMergedNebulaData(movieId) {
  // Get AI-generated data
  const aiData = await getNebulaData(movieId);

  // Get user reviews
  const userReviews = getUserReviews(movieId);

  // If no AI data AND no user reviews, truly nothing to show
  if (!aiData && userReviews.length === 0) return null;

  // Merge reviews with source flags
  const mergedReviews = [];

  // Add AI reviews
  if (aiData && aiData.reviews) {
    aiData.reviews.forEach(reviewText => {
      mergedReviews.push({
        text: reviewText,
        source: 'ai'
      });
    });
  }

  // Add user reviews
  userReviews.forEach(review => {
    mergedReviews.push({
      text: review.text,
      source: 'user',
      timestamp: review.timestamp
    });
  });

  // Extract review texts for frequency calculation
  const allReviewTexts = mergedReviews.map(r => r.text);

  // Recalculate word frequencies from all reviews
  const wordFrequency = calculateWordFrequencies(allReviewTexts);

  // Calculate threshold progress
  const communityThreshold = 50;
  const hasReachedThreshold = userReviews.length >= communityThreshold;

  return {
    movieId: aiData ? aiData.movieId : movieId,
    title: aiData ? aiData.title : '',
    reviews: mergedReviews,
    wordFrequency,
    aiReviewCount: aiData && aiData.reviews ? aiData.reviews.length : 0,
    userReviewCount: userReviews.length,
    communityThreshold,
    hasReachedThreshold
  };
}

// ============================================================================
// WORD FREQUENCY CALCULATION
// ============================================================================

/**
 * Extract phrases from text using phrase patterns
 * @param {string} text - Text to search for phrases
 * @returns {Array} Array of found phrases
 */
function extractPhrases(text) {
  const phrases = [];

  PHRASE_PATTERNS.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      phrases.push(match[0].toLowerCase());
    }
  });

  return phrases;
}

/**
 * Calculate word frequencies from an array of reviews
 * @param {Array<string>} reviews - Array of review text strings
 * @returns {Object} Object mapping words to their frequency counts
 */
export function calculateWordFrequencies(reviews) {
  const frequency = {};

  reviews.forEach(reviewText => {
    const text = reviewText.toLowerCase();

    // First, extract and count phrases
    const phrases = extractPhrases(text);
    phrases.forEach(phrase => {
      frequency[phrase] = (frequency[phrase] || 0) + 1;
    });

    // Create a version of text with phrases removed (to avoid double-counting)
    let textWithoutPhrases = text;
    phrases.forEach(phrase => {
      textWithoutPhrases = textWithoutPhrases.replace(phrase, ' ');
    });

    // Extract individual words
    const words = textWithoutPhrases
      .split(/\s+/)
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .map(word => word.replace(/[^\w-]/g, '')) // Keep letters, numbers, hyphens
      .filter(word => word.length > 2) // Minimum 3 characters
      .filter(word => !STOP_WORDS.has(word)); // Filter stop words

    // Count individual words
    words.forEach(word => {
      if (word) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
  });

  return frequency;
}

/**
 * Get top N words sorted by frequency
 * @param {Object} wordFrequency - Object mapping words to counts
 * @param {number} limit - Maximum number of words to return (default: 30)
 * @returns {Array<[string, number]>} Array of [word, count] pairs sorted by count descending
 */
export function getTopWords(wordFrequency, limit = 30) {
  // Convert object to array of [word, count] pairs
  const entries = Object.entries(wordFrequency);

  // Sort by count descending, then alphabetically for ties
  entries.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Sort by count descending
    }
    return a[0].localeCompare(b[0]); // Alphabetical for ties
  });

  // Return top N
  return entries.slice(0, limit);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear user reviews for a movie (for testing/reset)
 * @param {number|string} movieId - The TMDB movie ID
 */
export function clearUserReviews(movieId) {
  try {
    const key = `orbit_user_reviews_${movieId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing user reviews:', error);
  }
}

/**
 * Clear cache for a specific movie (for testing)
 * @param {number|string} movieId - The TMDB movie ID
 */
export function clearCache(movieId) {
  try {
    const cacheKey = `${CACHE_PREFIX}${movieId}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all nebula caches (for testing)
 */
export function clearAllCaches() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
}
