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
