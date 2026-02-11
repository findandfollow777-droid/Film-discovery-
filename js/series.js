// ============================================
// ORBIT TV SERIES PAGE
// ============================================

// TMDB_API_KEY and TMDB_IMG provided by config.js and utils.js

// State
let showData = null;
let seasonsData = [];
let currentSeasonIndex = 0;
let currentSeasonEpisodes = [];
let castByEpisode = new Map();
let highlightActorId = null;
let highlightActorData = null;

// DOM elements
let seriesBackdrop, seriesTitle, seriesYears, seriesRating;
let seriesSeasonCount, seriesStatus, seriesGenres, seriesNetwork, seriesOverview;
let castAvatars, seasonIndicator, episodesGrid;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const params = new URLSearchParams(window.location.search);
  const showId = params.get('id');
  highlightActorId = params.get('actor');

  if (!showId) {
    showError('No TV show specified');
    return;
  }

  cacheElements();
  setupEventListeners();

  try {
    await loadShowData(showId);

    if (highlightActorId) {
      await loadHighlightActor(highlightActorId);
    }

    renderHero();
    renderCastConstellation();
    renderSeasonCarousel();
    await loadSeasonEpisodes(0);

    // Show back to timeline button if came from timeline
    if (document.referrer.includes('timeline')) {
      document.getElementById('backToTimeline').hidden = false;
    }

  } catch (err) {
    console.error('Failed to load show:', err);
    showError('Failed to load TV show data');
  }
}

function cacheElements() {
  seriesBackdrop = document.getElementById('seriesBackdrop');
  seriesTitle = document.getElementById('seriesTitle');
  seriesYears = document.getElementById('seriesYears');
  seriesRating = document.getElementById('seriesRating');
  seriesSeasonCount = document.getElementById('seriesSeasonCount');
  seriesStatus = document.getElementById('seriesStatus');
  seriesGenres = document.getElementById('seriesGenres');
  seriesNetwork = document.getElementById('seriesNetwork');
  seriesOverview = document.getElementById('seriesOverview');
  castAvatars = document.getElementById('castAvatars');
  seasonIndicator = document.getElementById('seasonIndicator');
  episodesGrid = document.getElementById('episodesGrid');
}

// ============================================
// DATA FETCHING
// ============================================

async function loadShowData(showId) {
  const showRes = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}`
  );
  showData = await showRes.json();

  // Fetch credits (cast)
  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}/credits?api_key=${TMDB_API_KEY}`
  );
  const creditsData = await creditsRes.json();
  showData.credits = creditsData;

  // Fetch aggregate credits (for episode counts)
  const aggCreditsRes = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?api_key=${TMDB_API_KEY}`
  );
  const aggCreditsData = await aggCreditsRes.json();
  showData.aggregateCredits = aggCreditsData;

  // Filter out Season 0 (Specials)
  seasonsData = (showData.seasons || []).filter(s => s.season_number > 0);

  document.title = `${showData.name} - ORBIT`;
}

async function loadSeasonEpisodes(seasonIndex) {
  const season = seasonsData[seasonIndex];
  if (!season) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${showData.id}/season/${season.season_number}?api_key=${TMDB_API_KEY}`
  );
  const seasonData = await res.json();
  currentSeasonEpisodes = seasonData.episodes || [];

  renderSeasonDetail(seasonData);
  renderEpisodes();
  illuminateCastForSeason(season.season_number);
}

async function loadHighlightActor(actorId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}`
    );
    highlightActorData = await res.json();

    const actorFilter = document.getElementById('actorFilter');
    actorFilter.hidden = false;
    document.getElementById('filterActorName').textContent = highlightActorData.name.split(' ')[0];
    if (highlightActorData.profile_path) {
      document.getElementById('filterActorImg').src =
        `${TMDB_IMG}w45${highlightActorData.profile_path}`;
    }

    await loadActorEpisodes(actorId);

  } catch (err) {
    console.error('Failed to load highlight actor:', err);
  }
}

async function loadActorEpisodes(actorId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await res.json();

    const showCredits = (credits.cast || []).filter(c => c.id === showData.id);

    highlightActorData.appearedInShow = showCredits.length > 0;
    highlightActorData.episodeCount = showCredits[0]?.episode_count || 0;

  } catch (err) {
    console.error('Failed to load actor episodes:', err);
  }
}

// ============================================
// TIME COMMITMENT CALCULATION
// ============================================

function calculateTotalRuntime() {
  const avgRuntime = showData.episode_run_time?.[0] || 45;
  const totalEpisodes = showData.number_of_episodes || 0;
  return (avgRuntime * totalEpisodes) / 60;
}

function getCommitmentTier(hours) {
  if (hours < 2) return { class: 'commitment-quick', icon: '⚡', label: 'Quick Watch' };
  if (hours < 6) return { class: 'commitment-session', icon: '☕', label: 'Session' };
  if (hours < 15) return { class: 'commitment-weekend', icon: '🛋️', label: 'Weekend Binge' };
  if (hours < 40) return { class: 'commitment-journey', icon: '🚀', label: 'Journey' };
  return { class: 'commitment-odyssey', icon: '🌌', label: 'Odyssey' };
}

function formatRuntime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  return `${Math.round(hours)}h`;
}

function showError(message) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#94a3b8;">
      <div style="text-align:center;">
        <h1 style="color:#ffaa00;margin-bottom:1rem;">Error</h1>
        <p>${message}</p>
        <a href="../landing.html" style="color:#ffaa00;margin-top:1rem;display:inline-block;">← Back to ORBIT</a>
      </div>
    </div>
  `;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderHero() {
  if (showData.backdrop_path) {
    seriesBackdrop.style.backgroundImage =
      `url(${TMDB_IMG}w1280${showData.backdrop_path})`;
  }

  document.getElementById('heroPoster').src = showData.poster_path
    ? `${TMDB_IMG}w342${showData.poster_path}`
    : '';

  seriesTitle.textContent = showData.name;

  const startYear = showData.first_air_date?.split('-')[0] || '?';
  const endYear = showData.status === 'Ended'
    ? showData.last_air_date?.split('-')[0] || '?'
    : 'Present';
  seriesYears.textContent = startYear === endYear ? startYear : `${startYear}-${endYear}`;

  seriesRating.textContent = showData.vote_average?.toFixed(1) || 'N/A';

  seriesSeasonCount.textContent = `${seasonsData.length} Season${seasonsData.length !== 1 ? 's' : ''}`;

  const statusMap = {
    'Returning Series': { class: 'returning', text: 'Returning' },
    'Ended': { class: 'ended', text: 'Ended' },
    'Canceled': { class: 'canceled', text: 'Canceled' },
    'In Production': { class: 'returning', text: 'In Production' }
  };
  const status = statusMap[showData.status] || { class: '', text: showData.status };
  seriesStatus.className = `meta-status ${status.class}`;
  seriesStatus.textContent = status.text;

  seriesGenres.innerHTML = (showData.genres || []).map(g =>
    `<span class="genre-tag">${g.name}</span>`
  ).join('');

  const networks = showData.networks || [];
  if (networks.length > 0) {
    seriesNetwork.innerHTML = networks.map(n => {
      const logo = n.logo_path
        ? `<img src="${TMDB_IMG}w45${n.logo_path}" alt="${n.name}">`
        : '';
      return `${logo}<span>${n.name}</span>`;
    }).join(' &bull; ');
  }

  seriesOverview.textContent = showData.overview || 'No description available.';

  const totalHours = calculateTotalRuntime();
  const tier = getCommitmentTier(totalHours);
  document.getElementById('seriesCommitment').innerHTML = `
    <span class="${tier.class}">
      <span class="commitment-icon">${tier.icon}</span>
      <span>${tier.label}</span>
      <span class="commitment-time">${formatRuntime(totalHours)} total</span>
    </span>
  `;
}

function renderCastConstellation() {
  const cast = showData.aggregateCredits?.cast || showData.credits?.cast || [];

  const sortedCast = [...cast].sort((a, b) =>
    (b.total_episode_count || b.episode_count || 0) - (a.total_episode_count || a.episode_count || 0)
  );

  const mainCast = sortedCast.filter(c => (c.total_episode_count || 0) >= 10);

  renderCastAvatars(mainCast, 'main');

  const recurringCast = sortedCast.filter(c => {
    const count = c.total_episode_count || 0;
    return count >= 3 && count < 10;
  });

  castAvatars.dataset.mainCast = JSON.stringify(mainCast.map(c => c.id));
  castAvatars.dataset.recurringCast = JSON.stringify(recurringCast.map(c => c.id));
  castAvatars.dataset.fullCast = JSON.stringify(sortedCast.slice(0, 50).map(c => c.id));
}

function renderCastAvatars(castList, type = 'main') {
  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Crect fill='%23374151' width='70' height='70' rx='35'/%3E%3Ccircle cx='35' cy='28' r='12' fill='%236B7280'/%3E%3Cellipse cx='35' cy='60' rx='20' ry='18' fill='%236B7280'/%3E%3C/svg%3E";

  castAvatars.innerHTML = castList.slice(0, 20).map(person => {
    const imgSrc = person.profile_path
      ? `${TMDB_IMG}w185${person.profile_path}`
      : DEFAULT_AVATAR;

    const roles = person.roles || [{ character: person.character }];
    const character = roles[0]?.character || 'Unknown';
    const isMain = (person.total_episode_count || 0) >= 10;

    return `
      <div class="cast-avatar"
           data-person-id="${person.id}"
           data-cast-type="${isMain ? 'main' : 'recurring'}"
           data-seasons="${JSON.stringify(getPersonSeasons(person))}">
        <div class="cast-avatar-ring"></div>
        <img class="cast-avatar-img" src="${imgSrc}" alt="${person.name}" loading="lazy">
        <span class="cast-avatar-name">${person.name.split(' ')[0]}</span>
        <span class="cast-avatar-character">${truncate(character, 20)}</span>
      </div>
    `;
  }).join('');

  const fullCast = showData.aggregateCredits?.cast || [];
  if (fullCast.length > 20) {
    castAvatars.innerHTML += `
      <div class="cast-show-all" id="castShowAll">
        View All<br>${fullCast.length} Cast
      </div>
    `;
  }

  castAvatars.querySelectorAll('.cast-avatar').forEach(avatar => {
    avatar.addEventListener('click', () => {
      const personId = avatar.dataset.personId;
      navigateToTimeline(personId);
    });
  });

  document.getElementById('castShowAll')?.addEventListener('click', openCastModal);
}

function getPersonSeasons(person) {
  const roles = person.roles || [];
  const seasons = new Set();

  roles.forEach(role => {
    // TMDB aggregate credits don't directly give season numbers per role
    // This is a simplification
  });

  return Array.from(seasons);
}

function renderSeasonCarousel() {
  const ringsTrack = document.getElementById('ringsTrack');

  ringsTrack.innerHTML = seasonsData.map((season, index) => `
    <div class="season-orb ${index === 0 ? 'active' : ''}"
         data-season-index="${index}"
         data-season-number="${season.season_number}">
      <div class="orb-ring-outer"></div>
      <div class="orb-ring-inner"></div>
      <div class="orb-content">
        <span class="orb-season-num">S${season.season_number}</span>
        <span class="orb-episode-count">${season.episode_count} ep</span>
      </div>
    </div>
  `).join('');

  seasonIndicator.innerHTML = seasonsData.map((_, index) => `
    <div class="indicator-dot ${index === 0 ? 'active' : ''}" data-season-index="${index}"></div>
  `).join('');

  ringsTrack.querySelectorAll('.season-orb').forEach(orb => {
    orb.addEventListener('click', () => {
      selectSeason(parseInt(orb.dataset.seasonIndex));
    });

    orb.addEventListener('mouseenter', () => {
      const seasonNum = parseInt(orb.dataset.seasonNumber);
      illuminateCastForSeason(seasonNum);
    });

    orb.addEventListener('mouseleave', () => {
      illuminateCastForSeason(seasonsData[currentSeasonIndex]?.season_number);
    });
  });

  seasonIndicator.querySelectorAll('.indicator-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      selectSeason(parseInt(dot.dataset.seasonIndex));
    });
  });
}

function renderSeasonDetail(seasonData) {
  const posterSrc = seasonData.poster_path
    ? `${TMDB_IMG}w342${seasonData.poster_path}`
    : (showData.poster_path ? `${TMDB_IMG}w342${showData.poster_path}` : '');
  document.getElementById('seasonPoster').src = posterSrc;

  document.getElementById('seasonBadge').textContent = seasonData.name || `Season ${seasonData.season_number}`;

  const episodes = seasonData.episodes || [];
  document.getElementById('seasonEpisodeCount').textContent = episodes.length;

  const avgRuntime = showData.episode_run_time?.[0] || 45;
  const totalMinutes = episodes.length * avgRuntime;
  document.getElementById('seasonRuntime').textContent = formatRuntime(totalMinutes / 60);

  const avgRating = episodes.length > 0
    ? episodes.reduce((sum, ep) => sum + (ep.vote_average || 0), 0) / episodes.length
    : 0;
  document.getElementById('seasonAvgRating').textContent = avgRating.toFixed(1);

  document.getElementById('seasonOverview').textContent =
    seasonData.overview || showData.overview || 'No description available.';

  const firstAir = seasonData.air_date ? formatDate(seasonData.air_date) : 'TBA';
  const lastEp = episodes[episodes.length - 1];
  const lastAir = lastEp?.air_date ? formatDate(lastEp.air_date) : '';
  document.getElementById('seasonAirDates').textContent =
    lastAir ? `${firstAir} - ${lastAir}` : firstAir;
}

// ============================================
// EPISODE RENDERING
// ============================================

function renderEpisodes() {
  const DEFAULT_STILL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='157' viewBox='0 0 280 157'%3E%3Crect fill='%231a0f0a' width='280' height='157'/%3E%3Ctext x='140' y='85' font-family='Arial' font-size='14' fill='%23374151' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  episodesGrid.innerHTML = currentSeasonEpisodes.map((episode, index) => {
    const stillSrc = episode.still_path
      ? `${TMDB_IMG}w300${episode.still_path}`
      : DEFAULT_STILL;

    const airDate = episode.air_date ? formatDate(episode.air_date) : 'TBA';
    const runtime = episode.runtime || showData.episode_run_time?.[0] || 45;
    const rating = episode.vote_average?.toFixed(1) || 'N/A';

    const actorAppeared = highlightActorData?.appearedInShow;

    return `
      <article class="episode-card ${actorAppeared ? 'actor-appeared' : ''}"
               data-episode-index="${index}"
               data-episode-id="${episode.id}">
        ${actorAppeared ? `
          <div class="actor-badge">
            ${highlightActorData.profile_path ? `<img src="${TMDB_IMG}w45${highlightActorData.profile_path}" alt="">` : ''}
            ${highlightActorData.name.split(' ')[0]}
          </div>
        ` : ''}

        <div class="episode-still">
          <img src="${stillSrc}" alt="${episode.name}" loading="lazy">
          <span class="episode-number">E${episode.episode_number}</span>
        </div>

        <div class="episode-info">
          <h3 class="episode-title">${episode.name}</h3>
          <div class="episode-meta">
            <span class="episode-date">${airDate}</span>
            <span class="meta-separator">&bull;</span>
            <span class="episode-runtime">${runtime}m</span>
            <span class="meta-separator">&bull;</span>
            <span class="episode-rating">★ ${rating}</span>
          </div>
        </div>

        <div class="episode-expanded">
          <p class="episode-overview">${episode.overview || 'No description available.'}</p>
          ${episode.guest_stars?.length ? `
            <div class="episode-guests">
              <span class="guests-label">Guest Stars:</span>
              <div class="guests-list">
                ${episode.guest_stars.slice(0, 5).map(g =>
                  `<span class="guest-tag">${g.name}</span>`
                ).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <button class="episode-more-btn" data-episode-index="${index}">
          <span>More Info</span>
          <span class="expand-indicator">▼</span>
        </button>
      </article>
    `;
  }).join('');

  episodesGrid.querySelectorAll('.episode-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.episode-more-btn')) return;
      card.classList.toggle('expanded');
    });
  });

  episodesGrid.querySelectorAll('.episode-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.episodeIndex);
      openEpisodeModal(index);
    });
  });
}

// ============================================
// SEASON COLOR THEMES
// ============================================

const SEASON_PALETTES = [
  { accent: '#ffaa00', secondary: '#ff6b6b', bg: '#1a0f0a' },  // S1 - Amber (default)
  { accent: '#00d9ff', secondary: '#a78bfa', bg: '#0a0f1a' },  // S2 - Cyan
  { accent: '#10b981', secondary: '#fbbf24', bg: '#0a1a0f' },  // S3 - Emerald
  { accent: '#f472b6', secondary: '#38bdf8', bg: '#1a0a14' },  // S4 - Pink
  { accent: '#a78bfa', secondary: '#fb923c', bg: '#120a1a' },  // S5 - Violet
  { accent: '#fb923c', secondary: '#34d399', bg: '#1a100a' },  // S6 - Orange
  { accent: '#38bdf8', secondary: '#f472b6', bg: '#0a121a' },  // S7 - Sky
  { accent: '#fbbf24', secondary: '#818cf8', bg: '#1a160a' },  // S8 - Gold
  { accent: '#34d399', secondary: '#f87171', bg: '#0a1a14' },  // S9 - Teal
  { accent: '#818cf8', secondary: '#fbbf24', bg: '#0f0a1a' },  // S10 - Indigo
];

function applySeasonTheme(seasonIndex) {
  const palette = SEASON_PALETTES[seasonIndex % SEASON_PALETTES.length];
  const root = document.documentElement;
  const rgb = hexToRgb(palette.accent);
  root.style.setProperty('--tv-accent', palette.accent);
  root.style.setProperty('--tv-accent-rgb', rgb);
  root.style.setProperty('--tv-secondary', palette.secondary);
  root.style.setProperty('--tv-glow', `rgba(${rgb}, 0.3)`);
  root.style.setProperty('--nebula-dark', palette.bg);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ============================================
// SEASON SELECTION
// ============================================

async function selectSeason(index) {
  if (index < 0 || index >= seasonsData.length) return;

  currentSeasonIndex = index;

  // Apply season color theme
  applySeasonTheme(index);

  document.querySelectorAll('.season-orb').forEach((orb, i) => {
    orb.classList.toggle('active', i === index);
  });

  document.querySelectorAll('.indicator-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  await loadSeasonEpisodes(index);

  document.getElementById('episodesSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// CAST ILLUMINATION
// ============================================

function illuminateCastForSeason(seasonNumber) {
  const avatars = document.querySelectorAll('.cast-avatar');

  avatars.forEach(avatar => {
    const isMain = avatar.dataset.castType === 'main';

    if (isMain) {
      avatar.classList.add('illuminated');
      avatar.classList.remove('dimmed');
    } else {
      avatar.classList.remove('illuminated');
      avatar.classList.add('dimmed');
    }
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  document.getElementById('seasonPrev')?.addEventListener('click', () => {
    if (currentSeasonIndex > 0) {
      selectSeason(currentSeasonIndex - 1);
    }
  });

  document.getElementById('seasonNext')?.addEventListener('click', () => {
    if (currentSeasonIndex < seasonsData.length - 1) {
      selectSeason(currentSeasonIndex + 1);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (currentSeasonIndex > 0) selectSeason(currentSeasonIndex - 1);
    } else if (e.key === 'ArrowRight') {
      if (currentSeasonIndex < seasonsData.length - 1) selectSeason(currentSeasonIndex + 1);
    } else if (e.key === 'Escape') {
      closeModals();
    }
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.dataset.view;
      episodesGrid.classList.toggle('list-view', view === 'list');
    });
  });

  document.querySelectorAll('.cast-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cast-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      applyCastFilter(filter);
    });
  });

  document.querySelectorAll('.filter-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const show = btn.dataset.show;
      filterEpisodesByActor(show);
    });
  });

  document.querySelectorAll('.cube-rotate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const face = btn.dataset.face;
      rotateCube(face);
    });
  });

  document.getElementById('episodeModalClose')?.addEventListener('click', () => {
    document.getElementById('episodeModal').hidden = true;
  });

  document.getElementById('castModalClose')?.addEventListener('click', () => {
    document.getElementById('castModal').hidden = true;
  });

  document.querySelectorAll('.episode-modal-overlay, .cast-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.hidden = true;
      }
    });
  });

  document.getElementById('showOnTimelineBtn')?.addEventListener('click', () => {
    localStorage.setItem('timelineShowId', showData.id);
    localStorage.setItem('timelineType', 'tv');
    window.location.href = 'timeline.html';
  });

  setupSwipeSupport();
}

function setupSwipeSupport() {
  const carousel = document.querySelector('.planetary-rings');
  if (!carousel) return;

  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSeasonIndex < seasonsData.length - 1) {
        selectSeason(currentSeasonIndex + 1);
      } else if (diff < 0 && currentSeasonIndex > 0) {
        selectSeason(currentSeasonIndex - 1);
      }
    }
  }
}

// ============================================
// MODALS
// ============================================

function openEpisodeModal(episodeIndex) {
  const episode = currentSeasonEpisodes[episodeIndex];
  if (!episode) return;

  const modal = document.getElementById('episodeModal');

  document.getElementById('modalStill').src = episode.still_path
    ? `${TMDB_IMG}w780${episode.still_path}`
    : '';

  document.getElementById('modalEpisodeNum').textContent =
    `Season ${seasonsData[currentSeasonIndex].season_number} \u2022 Episode ${episode.episode_number}`;
  document.getElementById('modalTitle').textContent = episode.name;
  document.getElementById('modalAirDate').textContent = formatDate(episode.air_date);
  document.getElementById('modalRuntime').textContent =
    `${episode.runtime || showData.episode_run_time?.[0] || 45} min`;
  document.getElementById('modalRating').textContent = episode.vote_average?.toFixed(1) || 'N/A';
  document.getElementById('modalOverview').textContent =
    episode.overview || 'No description available.';

  const crew = episode.crew || [];
  const directors = crew.filter(c => c.job === 'Director');
  const writers = crew.filter(c => c.job === 'Writer' || c.department === 'Writing');

  document.getElementById('modalCrew').innerHTML = `
    <h4>Crew</h4>
    ${directors.map(d => `<div class="crew-item">${d.name} <span class="crew-role">Director</span></div>`).join('')}
    ${writers.slice(0, 3).map(w => `<div class="crew-item">${w.name} <span class="crew-role">Writer</span></div>`).join('')}
  `;

  const guests = episode.guest_stars || [];
  document.getElementById('modalGuests').innerHTML = guests.length ? `
    <h4>Guest Stars</h4>
    ${guests.slice(0, 8).map(g => `
      <div class="guest-item">${g.name} <span class="guest-role">as ${g.character || 'Guest'}</span></div>
    `).join('')}
  ` : '';

  modal.hidden = false;
}

function openCastModal() {
  const cast = showData.aggregateCredits?.cast || [];

  document.getElementById('castModalGrid').innerHTML = cast.map(person => {
    const imgSrc = person.profile_path
      ? `${TMDB_IMG}w185${person.profile_path}`
      : '';

    const roles = person.roles || [{ character: person.character }];
    const character = roles[0]?.character || 'Unknown';
    const episodeCount = person.total_episode_count || 0;

    return `
      <div class="cast-modal-item" data-person-id="${person.id}">
        ${imgSrc ? `<img class="cast-modal-img" src="${imgSrc}" alt="${person.name}">` : ''}
        <div class="cast-modal-info">
          <div class="cast-modal-name">${person.name}</div>
          <div class="cast-modal-character">${truncate(character, 25)}</div>
          <div class="cast-modal-episodes">${episodeCount} episode${episodeCount !== 1 ? 's' : ''}</div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.cast-modal-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateToTimeline(item.dataset.personId);
    });
  });

  document.getElementById('castModal').hidden = false;
}

function closeModals() {
  document.getElementById('episodeModal').hidden = true;
  document.getElementById('castModal').hidden = true;
}

// ============================================
// FILTERING
// ============================================

function applyCastFilter(filter) {
  const cast = showData.aggregateCredits?.cast || [];
  let filteredCast;

  switch (filter) {
    case 'main':
      filteredCast = cast.filter(c => (c.total_episode_count || 0) >= 10);
      break;
    case 'recurring':
      filteredCast = cast.filter(c => (c.total_episode_count || 0) >= 3);
      break;
    case 'all':
      filteredCast = cast.slice(0, 50);
      break;
    default:
      filteredCast = cast.filter(c => (c.total_episode_count || 0) >= 10);
  }

  renderCastAvatars(filteredCast, filter);
}

function filterEpisodesByActor(show) {
  const cards = document.querySelectorAll('.episode-card');

  if (show === 'all') {
    cards.forEach(card => {
      card.style.display = '';
      card.style.opacity = '';
    });
  } else {
    cards.forEach(card => {
      const appeared = card.classList.contains('actor-appeared');
      card.style.display = '';
      card.style.opacity = appeared ? '1' : '0.4';
    });
  }
}

// ============================================
// CUBE ROTATION
// ============================================

function rotateCube(face) {
  const cube = document.getElementById('showCube');
  cube.dataset.face = face;

  document.querySelectorAll('.cube-rotate-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.face === face);
  });
}

// ============================================
// NAVIGATION
// ============================================

function navigateToTimeline(personId) {
  localStorage.setItem('timelineMovieId', personId);
  localStorage.setItem('timelineType', 'person');
  window.location.href = 'timeline.html';
}

// ============================================
// UTILITIES
// ============================================

function truncate(str, length) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
