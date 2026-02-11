/**
 * Orbit Nebula Utilities
 * Works in both Node.js and browser environments.
 */

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    // Node.js / CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.NebulaUtils = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // ── Stop words (same as process-nebula-words.js) ──

  const STOP_WORDS = new Set([
    "the", "a", "an", "is", "it", "its", "and", "of", "to", "in", "for", "with",
    "this", "that", "on", "at", "by", "from", "as", "or", "but", "not", "no",
    "so", "if", "be", "was", "were", "been", "are", "am", "has", "had", "have",
    "do", "does", "did", "will", "would", "could", "should", "can", "may",
    "might", "shall", "being", "than", "then", "just", "about", "into", "up",
    "out", "down", "over", "after", "before", "between", "through", "each",
    "every", "all", "both", "more", "most", "other", "some", "such", "only",
    "same", "very", "too", "also", "own", "my", "your", "our", "his", "her",
    "their", "its", "me", "you", "us", "him", "them", "we", "they", "i",
    "who", "what", "which", "where", "when", "how", "why",
    "movie", "film", "watch", "watched", "watching", "scene", "scenes",
    "story", "plot", "character", "characters", "acting", "director",
    "ending", "movies", "films",
    "really", "absolutely", "definitely", "completely", "totally", "quite",
    "pretty", "simply", "truly", "just", "ever", "even", "still", "already",
    "much", "many", "enough",
    "makes", "feels", "thinks", "got", "get", "made", "make", "feel",
    "think", "go", "goes", "went", "come", "comes", "came", "take",
    "takes", "took", "give", "gives", "gave", "see", "sees", "saw",
    "know", "knows", "knew", "want", "wants", "wanted", "need", "needs",
    "keep", "keeps", "kept", "let", "puts", "put",
  ]);

  const KNOWN_PHRASES = [
    "fast paced", "slow burn", "edge of seat", "must watch", "must see",
    "top notch", "well crafted", "heart wrenching", "gut wrenching",
    "nail biting", "jaw dropping", "mind blowing", "thought provoking",
    "spine tingling", "tear jerker", "feel good", "non stop", "next level",
    "edge of your seat", "once in a lifetime", "all time",
  ];

  // ── Helpers ──

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }

  function detectPhrases(reviews) {
    const phraseCounts = {};

    for (const review of reviews) {
      const lower = review.toLowerCase();
      for (const phrase of KNOWN_PHRASES) {
        if (lower.includes(phrase)) {
          const key = phrase.replace(/\s+/g, "-");
          phraseCounts[key] = (phraseCounts[key] || 0) + 1;
        }
      }
    }

    // Bigram detection
    const bigramCounts = {};
    for (const review of reviews) {
      const words = tokenize(review);
      for (let i = 0; i < words.length - 1; i++) {
        if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
          const bigram = `${words[i]}-${words[i + 1]}`;
          bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
        }
      }
    }

    for (const [bigram, count] of Object.entries(bigramCounts)) {
      if (count >= 2 && !phraseCounts[bigram]) {
        phraseCounts[bigram] = count;
      }
    }

    return phraseCounts;
  }

  // ── Public API ──

  /**
   * Fetch nebula data for a movie.
   * In browser: fetches from nebula-data/{movieId}.json
   * In Node: reads from filesystem
   */
  async function getNebulaData(movieId) {
    if (typeof window !== "undefined") {
      // Browser
      try {
        const res = await fetch(`nebula-data/${movieId}.json`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    } else {
      // Node.js
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "nebula-data", `${movieId}.json`);
      if (!fs.existsSync(filePath)) return null;
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  }

  /**
   * Calculate word frequencies from an array of review strings.
   */
  function calculateWordFrequencies(reviews) {
    const wordCounts = {};
    const phrases = detectPhrases(reviews);

    for (const review of reviews) {
      const words = tokenize(review);
      const counted = new Set();

      for (const word of words) {
        if (!STOP_WORDS.has(word) && !counted.has(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
          counted.add(word);
        }
      }
    }

    for (const [phrase, count] of Object.entries(phrases)) {
      wordCounts[phrase] = (wordCounts[phrase] || 0) + count;
    }

    return wordCounts;
  }

  /**
   * Get a brightness tier (1-5) based on word frequency.
   * 5 = top 20% (brightest), 1 = bottom 20% (dimmest).
   */
  function getWordBrightness(count, maxCount) {
    if (maxCount === 0) return 1;
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 5;
    if (ratio >= 0.6) return 4;
    if (ratio >= 0.4) return 3;
    if (ratio >= 0.2) return 2;
    return 1;
  }

  /**
   * Add a user review for a movie (stored in localStorage).
   */
  function addUserReview(movieId, review) {
    if (typeof localStorage === "undefined") {
      return { success: false, error: "localStorage not available" };
    }

    // Validate exactly 5 words
    const words = review.trim().split(/\s+/);
    if (words.length !== 5) {
      return {
        success: false,
        error: `Review must be exactly 5 words (got ${words.length})`,
      };
    }

    const key = `orbit_user_reviews_${movieId}`;
    let existing = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) existing = JSON.parse(stored);
    } catch {
      existing = [];
    }

    existing.push({
      review: review.trim(),
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(existing));

    return { success: true, totalUserReviews: existing.length };
  }

  /**
   * Get merged nebula data: AI reviews + user reviews with recalculated frequencies.
   */
  async function getMergedNebulaData(movieId) {
    const aiData = await getNebulaData(movieId);

    // Get user reviews
    let userReviews = [];
    if (typeof localStorage !== "undefined") {
      const key = `orbit_user_reviews_${movieId}`;
      try {
        const stored = localStorage.getItem(key);
        if (stored) userReviews = JSON.parse(stored);
      } catch {
        userReviews = [];
      }
    }

    const aiReviewStrings = aiData ? aiData.reviews : [];
    const userReviewStrings = userReviews.map((r) => r.review);
    const allReviews = [...aiReviewStrings, ...userReviewStrings];

    // Tag each review with its source
    const taggedReviews = [
      ...aiReviewStrings.map((r) => ({ text: r, source: "ai" })),
      ...userReviews.map((r) => ({
        text: r.review,
        source: "user",
        timestamp: r.timestamp,
      })),
    ];

    const wordFrequency = calculateWordFrequencies(allReviews);

    return {
      movieId,
      title: aiData ? aiData.title : null,
      reviews: taggedReviews,
      wordFrequency,
      topWords: Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word),
      aiReviewCount: aiReviewStrings.length,
      userReviewCount: userReviewStrings.length,
      totalReviewCount: allReviews.length,
    };
  }

  /**
   * Check if user review count has reached the community threshold.
   */
  function hasReachedCommunityThreshold(movieId, threshold) {
    if (threshold === undefined) threshold = 50;
    if (typeof localStorage === "undefined") return false;

    const key = `orbit_user_reviews_${movieId}`;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return false;
      const reviews = JSON.parse(stored);
      return reviews.length >= threshold;
    } catch {
      return false;
    }
  }

  return {
    getNebulaData,
    calculateWordFrequencies,
    getWordBrightness,
    addUserReview,
    getMergedNebulaData,
    hasReachedCommunityThreshold,
  };
});
