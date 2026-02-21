// ============================================
// SHARED TRIVIA STATS SERVICE
// Used by MovieCube trivia + Actor Cube trivia
// NOT used by Mastermind (has its own stats)
// ============================================

(function() {
  'use strict';

  var TRIVIA_STATS_KEY = 'orbit_trivia_stats';

  function getTriviaStats() {
    try {
      var raw = localStorage.getItem(TRIVIA_STATS_KEY);
      if (raw) {
        var stats = JSON.parse(raw);
        // Backward compat: ensure newer fields exist
        if (!stats.actorsCompleted) stats.actorsCompleted = [];
        if (stats.actorsQuizzed == null) stats.actorsQuizzed = 0;
        if (!stats.bySource) stats.bySource = { movieCube: { answered: 0, correct: 0 }, actorCube: { answered: 0, correct: 0 } };
        if (!stats.bySource.movieCube) stats.bySource.movieCube = { answered: 0, correct: 0 };
        if (!stats.bySource.actorCube) stats.bySource.actorCube = { answered: 0, correct: 0 };
        return stats;
      }
    } catch (e) {}
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      currentStreak: 0,
      bestStreak: 0,
      perfectRounds: 0,
      moviesQuizzed: 0,
      moviesCompleted: [],
      actorsQuizzed: 0,
      actorsCompleted: [],
      byCategory: {},
      bySource: {
        movieCube: { answered: 0, correct: 0 },
        actorCube: { answered: 0, correct: 0 }
      },
      lastPlayedAt: null
    };
  }

  function saveTriviaStats(stats) {
    try {
      localStorage.setItem(TRIVIA_STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  function recordTriviaAnswer(category, isCorrect, source) {
    // source = 'movieCube' or 'actorCube'
    var stats = getTriviaStats();
    stats.totalAnswered++;
    if (isCorrect) {
      stats.totalCorrect++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else {
      stats.currentStreak = 0;
    }
    // Category tracking
    if (!stats.byCategory[category]) {
      stats.byCategory[category] = { answered: 0, correct: 0 };
    }
    stats.byCategory[category].answered++;
    if (isCorrect) stats.byCategory[category].correct++;
    // Source tracking
    if (source && stats.bySource[source]) {
      stats.bySource[source].answered++;
      if (isCorrect) stats.bySource[source].correct++;
    }
    stats.lastPlayedAt = new Date().toISOString();
    saveTriviaStats(stats);
    return stats;
  }

  function recordTriviaRoundComplete(entityType, entityId, score, total) {
    // entityType = 'movie' or 'actor'
    var stats = getTriviaStats();
    if (score === total) stats.perfectRounds++;

    if (entityType === 'movie') {
      if (!stats.moviesCompleted) stats.moviesCompleted = [];
      if (stats.moviesCompleted.indexOf(entityId) === -1) {
        stats.moviesCompleted.push(entityId);
        stats.moviesQuizzed = stats.moviesCompleted.length;
      }
    } else if (entityType === 'actor') {
      if (!stats.actorsCompleted) stats.actorsCompleted = [];
      if (stats.actorsCompleted.indexOf(entityId) === -1) {
        stats.actorsCompleted.push(entityId);
        stats.actorsQuizzed = stats.actorsCompleted.length;
      }
    }

    saveTriviaStats(stats);
    return stats;
  }

  function getTriviaAccuracy() {
    var stats = getTriviaStats();
    if (stats.totalAnswered === 0) return 0;
    return Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
  }

  // Expose globally
  window.getTriviaStats = getTriviaStats;
  window.saveTriviaStats = saveTriviaStats;
  window.recordTriviaAnswer = recordTriviaAnswer;
  window.recordTriviaRoundComplete = recordTriviaRoundComplete;
  window.getTriviaAccuracy = getTriviaAccuracy;

})();
