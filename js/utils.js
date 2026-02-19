// ============================================
// ORBIT - Shared Constants
// ============================================

const TMDB_IMG = "https://image.tmdb.org/t/p/";

// ============================================
// NAVIGATION TRACKING
// ============================================

function _orbitGetPagePath() {
  const path = window.location.pathname;
  const parts = path.replace(/\\/g, '/').split('/');
  const file = parts.pop() || 'index.html';
  const dir = parts.pop() || '';
  return dir === 'games' ? 'games/' + file : file;
}

function trackNavigation() {
  const currentPath = _orbitGetPagePath();
  const history = JSON.parse(sessionStorage.getItem('orbit_nav_history') || '[]');
  if (history[history.length - 1] !== currentPath) {
    history.push(currentPath);
    if (history.length > 10) history.shift();
    sessionStorage.setItem('orbit_nav_history', JSON.stringify(history));
  }
}

function getBackPage() {
  const history = JSON.parse(sessionStorage.getItem('orbit_nav_history') || '[]');
  const currentPath = _orbitGetPagePath();
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] !== currentPath) return history[i];
  }
  return 'landing.html';
}

function getBackLabel(page) {
  const file = page.includes('/') ? page.split('/').pop() : page;
  const labels = {
    'landing.html': 'ORBIT',
    'arcade.html': 'Arcade',
    'randomizer.html': 'Randomizer',
    'randomizer-hub.html': 'Randomizer Hub',
    're-randomizer.html': 'Re-Randomizer',
    'tv-randomizer.html': 'TV Randomizer',
    'results.html': 'Results',
    'profile.html': 'Profile',
    'rankings.html': 'Rankings',
    'both.html': 'Orbit',
    'tv.html': 'TV',
    'compare.html': 'Compare',
    'actor-timeline.html': 'Timeline',
    'timeline.html': 'Timeline',
    'venn.html': 'Venn',
    'collision.html': 'Collision Course',
    'triple-collision.html': 'Triple Collision',
    'connections.html': 'Connections',
    'game.html': 'Constellation',
    'constellation.html': 'Constellation',
    'journeys.html': 'Journeys',
    'mastermind.html': 'Mastermind',
    'alternate.html': 'Alternate Universe',
    'screenshot.html': 'Screenshot Speed',
    'sequel-shot.html': 'Sequel Shot',
    'tenth-star.html': 'Tenth Star',
    'series.html': 'Series',
    'index.html': 'Home',
    'awards-browse.html': 'Awards Archive'
  };
  return labels[file] || 'Back';
}

function _orbitBackHref(targetPath) {
  const currentPath = _orbitGetPagePath();
  const currentInGames = currentPath.startsWith('games/');
  const targetInGames = targetPath.startsWith('games/');
  if (currentInGames && !targetInGames) return '../' + targetPath;
  if (!currentInGames && targetInGames) return targetPath;
  if (currentInGames && targetInGames) return targetPath.replace('games/', '');
  return targetPath;
}

function initBackNav() {
  const backNav = document.getElementById('backNav');
  if (!backNav) return;
  const backPage = getBackPage();
  backNav.href = _orbitBackHref(backPage);
  // Only update text for simple text links, not icon/logo links with child elements
  if (!backNav.querySelector('div, svg, img')) {
    const backLabel = getBackLabel(backPage);
    backNav.textContent = '\u2190 Back to ' + backLabel;
  }
}

// Auto-run on every page load
trackNavigation();
document.addEventListener('DOMContentLoaded', initBackNav);

// ============================================
// PROMINENT DECADE - Weighted Scoring
// ============================================

/**
 * Calculate the most prominent decade for a person based on their filmography.
 * Uses weighted scoring: lead roles in well-rated films count more than
 * small credits, so the decade of peak PROMINENCE wins, not just raw count.
 *
 * @param {Array} entries - Credit objects with release_date/sortDate/airDate,
 *   and optionally: type, order, vote_average, isGuest
 * @returns {string|null} Decade string like "1990" or null if no valid entries
 */
function calcProminentDecade(entries) {
  if (!entries || entries.length === 0) return null;

  var decadeScores = {};

  entries.forEach(function (e) {
    var dateStr = e.sortDate || e.release_date || e.airDate;
    if (!dateStr) return;

    var year = new Date(dateStr).getFullYear();
    if (isNaN(year) || year < 1900) return;

    var decade = Math.floor(year / 10) * 10;
    var score = 1;

    // TV seasons get flat scoring
    if (e.type === 'tv_season') {
      score = e.isGuest ? 0.5 : 1.0;
    } else {
      // Movies (type 'movie', 'cast', 'crew', or undefined)
      var order = (e.order != null) ? e.order : 999;

      // Billing position weight
      if (order <= 2) score = 3.0;
      else if (order <= 5) score = 2.0;
      else if (order <= 9) score = 1.5;
      else score = 1.0;

      // Rating bonus
      var rating = e.vote_average || 0;
      if (rating >= 7.0) score += 1.0;
      else if (rating >= 6.0) score += 0.5;

      // Top-billing bonus
      if (order === 0) score += 1.0;
    }

    decadeScores[decade] = (decadeScores[decade] || 0) + score;
  });

  var sorted = Object.entries(decadeScores).sort(function (a, b) { return b[1] - a[1]; });
  return sorted.length > 0 ? sorted[0][0] : null;
}

// ============================================
// PERSON ID RESOLUTION - Name-Validated Fetch
// ============================================

async function resolvePersonId(id, expectedName) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}`
    );
    const person = await res.json();

    const normalize = s => s.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (person.name && normalize(person.name) === normalize(expectedName)) {
      return { id, person };
    }

    // Name mismatch — search for the correct person
    console.warn(
      `Person ID ${id} returned "${person.name}" instead of "${expectedName}". Searching…`
    );
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(expectedName)}`
    );
    const searchData = await searchRes.json();

    if (searchData.results && searchData.results.length > 0) {
      const exactMatch = searchData.results.find(
        r => normalize(r.name) === normalize(expectedName)
      );
      const match = exactMatch || searchData.results[0];
      const correctRes = await fetch(
        `https://api.themoviedb.org/3/person/${match.id}?api_key=${TMDB_API_KEY}`
      );
      const correctPerson = await correctRes.json();
      return { id: match.id, person: correctPerson };
    }

    return { id, person };
  } catch (err) {
    console.error(`Error resolving person "${expectedName}":`, err);
    return { id, person: null };
  }
}

// ============================================
// STREAMING PROVIDERS - Shared Helper
// ============================================

async function fetchStreamingProviders(id, type = "movie") {
  const country = localStorage.getItem("orbit_user_country") || "AU";
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();
    const region = data.results?.[country];
    return region?.flatrate || [];
  } catch (e) {
    console.warn("Failed to fetch streaming providers:", e);
    return [];
  }
}

function renderStreamingLogos(providers, containerEl) {
  if (!containerEl) return;
  if (!providers || providers.length === 0) {
    containerEl.innerHTML = '<span class="streaming-none">Not streaming</span>';
    return;
  }
  containerEl.innerHTML =
    '<span class="streaming-label">Streaming on:</span>' +
    '<div class="streaming-logos">' +
    providers.map(p =>
      `<img class="streaming-logo" src="${TMDB_IMG}w45${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name}">`
    ).join("") +
    '</div>';
}

async function filterByStreamingTV(shows) {
  const providers = JSON.parse(localStorage.getItem("orbit_user_providers") || "[]");
  const country = localStorage.getItem("orbit_user_country") || "AU";
  if (!providers.length) return shows;

  const providerSet = new Set(providers);
  const batch = shows.slice(0, 20);

  const checks = await Promise.all(
    batch.map(s =>
      fetch(`https://api.themoviedb.org/3/tv/${s.id}/watch/providers?api_key=${TMDB_API_KEY}`)
        .then(r => r.json()).catch(() => null)
    )
  );

  const results = [];
  for (let i = 0; i < batch.length; i++) {
    const wp = checks[i];
    if (!wp?.results?.[country]) continue;
    const flatrate = wp.results[country].flatrate || [];
    if (flatrate.some(p => providerSet.has(p.provider_id))) {
      results.push(batch[i]);
    }
  }
  return results;
}
