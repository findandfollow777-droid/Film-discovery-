/* ============================================
   ORBIT - UNIFIED ACTOR TIMELINE
   Movies (Cyan) + TV Seasons (Amber) on one track
============================================ */

// State
let actorData = null;
let movieCredits = [];
let tvSeasonEntries = [];   // individual season entries
let tvShowsRaw = [];        // raw show-level data
let unifiedEntries = [];    // merged + sorted
let timeScale = null;
let currentMode = 'both';
const episodeCache = new Map();

// Constants
const PX_PER_YEAR = 150;
const PAD_LEFT = 120;
const PAD_RIGHT = 80;

// DOM refs
let viewport, unifiedContent, yearAxis, sacredSvg, scrollArea;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  viewport = document.getElementById('timelineViewport');
  unifiedContent = document.getElementById('unifiedContent');
  yearAxis = document.getElementById('yearAxis');
  sacredSvg = document.getElementById('sacredSvg');
  scrollArea = document.getElementById('timelineScrollArea');

  // MovieCube integration
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: null,
      onAnchorClick: (movie) => {
        localStorage.setItem('anchorMovie', JSON.stringify(movie));
        window.location.href = 'games/constellation.html';
      }
    });
  }

  // Toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyMode(btn.dataset.mode);
    });
  });

  // Career DNA popup
  document.getElementById('careerDnaBtn').addEventListener('click', openCareerDNA);
  document.getElementById('careerDna').addEventListener('click', openCareerDNA);
  document.getElementById('careerDnaClose').addEventListener('click', closeCareerDNA);
  document.getElementById('careerDnaOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCareerDNA();
  });

  // Close episode tiles on scroll or click elsewhere
  viewport?.addEventListener('scroll', () => hideEpisodeTiles());
  document.addEventListener('click', (e) => {
    const tiles = document.getElementById('episodeTiles');
    if (!tiles.hidden && !tiles.contains(e.target) && !e.target.closest('.at-card.tv-season')) {
      hideEpisodeTiles();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCareerDNA();
      hideEpisodeTiles();
    }
  });

  const personId = localStorage.getItem('timelineMovieId');
  const type = localStorage.getItem('timelineType');

  if (!personId || type !== 'person') {
    showEmpty('No actor data found.');
    return;
  }

  try {
    await loadActorData(personId);
    hideLoading();

    if (movieCredits.length === 0 && tvSeasonEntries.length === 0) {
      showEmpty('No filmography data available.');
      return;
    }

    buildUnifiedEntries();
    buildTimeScale();
    renderCareerDNA();
    viewport.hidden = false;

    if (scrollArea && timeScale) {
      scrollArea.style.width = `${timeScale.totalW}px`;
    }

    renderUnifiedTrack();
    renderYearAxis();
    renderSacredLine();
    applyMode('both');

    // Horizontal scroll on mouse wheel
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
    }, { passive: false });

  } catch (err) {
    console.error('Failed to load actor data:', err);
    hideLoading();
    showEmpty('Failed to load actor data.');
  }
}

// ── Data Loading ──

async function loadActorData(personId) {
  const [personRes, movieRes, tvRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`)
  ]);

  actorData = await personRes.json();
  const movieData = await movieRes.json();
  const tvData = await tvRes.json();

  // Log encounter
  if (window.OrbitEncounters && actorData) {
    window.OrbitEncounters.logEncounter({
      id: actorData.id,
      name: actorData.name,
      profile_path: actorData.profile_path,
      known_for_department: actorData.known_for_department
    }, 'actor_timeline');
  }

  movieCredits = processMovieCredits(movieData);
  const basicTv = processTvCredits(tvData);
  tvShowsRaw = basicTv;
  tvSeasonEntries = await expandTvShowsToSeasons(basicTv.slice(0, 25), personId);

  updateHeader();
}

function processMovieCredits(data) {
  const seen = new Set();
  const NON_FEATURE_GENRES = [99, 10770];
  const CEREMONY_TITLES = /\bacademy awards\b|\boscars?\b|\bemmy\b|\bgolden globe|\bsag awards|\bscreen actors guild|\bgrammy|\btony awards/i;
  const SELF_PATTERNS = /\b(himself|herself|themselves|themself|self)\b|\(self\)|\(herself\)|\(himself\)/i;
  const HOST_PATTERNS = /\b(host|presenter|introducer|announcer|narrator)\b/i;

  const filtered = (data.cast || []).filter(m => {
    if (!m.release_date || !m.poster_path) return false;
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    if (new Date(m.release_date) > new Date()) return false;
    const genres = m.genre_ids || [];
    if (genres.some(g => NON_FEATURE_GENRES.includes(g))) return false;
    if (CEREMONY_TITLES.test(m.title || '')) return false;
    const char = m.character || '';
    if (SELF_PATTERNS.test(char)) return false;
    if (HOST_PATTERNS.test(char)) return false;
    return true;
  });

  return filtered
    .map(m => ({
      id: m.id,
      title: m.title,
      release_date: m.release_date,
      poster_path: m.poster_path,
      vote_average: m.vote_average || 0,
      character: m.character || '',
      order: m.order ?? 999,
      type: 'movie'
    }))
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
}

function processTvCredits(data) {
  const map = new Map();

  // Same filters as movies
  const SELF_PATTERNS = /\b(himself|herself|themselves|themself|self)\b|\(self\)|\(herself\)|\(himself\)/i;
  const HOST_PATTERNS = /\b(host|presenter|introducer|announcer|narrator)\b/i;
  const AWARD_SHOWS = /\bacademy awards\b|\boscars?\b|\bemmy\b|\bgolden globe|\bsag awards|\bscreen actors guild|\bgrammy|\btony awards|\bpeople.?s choice|\bcritics.?choice|\bamt awards|\bkids.?choice|\bmtv.*(award|movie)|bet awards|\billboard|\bamerican music award/i;
  const VARIETY_GENRES = [10767, 10763]; // Talk show, News

  (data.cast || []).forEach(c => {
    if (!c.first_air_date) return;

    // Filter out award shows by name
    if (AWARD_SHOWS.test(c.name || '')) return;

    // Filter out self/host appearances
    const char = c.character || '';
    if (SELF_PATTERNS.test(char)) return;
    if (HOST_PATTERNS.test(char)) return;

    // Filter variety/talk shows
    const genres = c.genre_ids || [];
    if (genres.some(g => VARIETY_GENRES.includes(g))) return;

    if (!map.has(c.id)) {
      map.set(c.id, {
        id: c.id,
        name: c.name,
        first_air_date: c.first_air_date,
        poster_path: c.poster_path,
        vote_average: c.vote_average || 0,
        character: c.character || '',
        episode_count: c.episode_count || 0
      });
    } else {
      const ex = map.get(c.id);
      ex.episode_count += c.episode_count || 0;
      if (c.character && !ex.character.includes(c.character)) {
        ex.character += ex.character ? `, ${c.character}` : c.character;
      }
    }
  });
  return Array.from(map.values())
    .sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date));
}

async function expandTvShowsToSeasons(shows, personId) {
  const entries = [];

  const results = await Promise.all(shows.map(async show => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${TMDB_API_KEY}`);
      return { show, detail: await res.json() };
    } catch {
      return { show, detail: null };
    }
  }));

  for (const { show, detail } of results) {
    if (!detail || !detail.seasons) continue;

    const totalEpisodes = detail.number_of_episodes || 1;
    const actorEpisodes = show.episode_count || 0;
    const seasons = detail.seasons.filter(s => s.season_number > 0); // skip specials

    // Heuristic: If actor appeared in less than 10% of total episodes,
    // treat as guest appearance - show single entry, not all seasons
    const isMainCast = actorEpisodes >= Math.max(totalEpisodes * 0.1, 3);

    if (!isMainCast || seasons.length === 0) {
      // Guest appearance - single entry at first air date
      if (show.first_air_date && new Date(show.first_air_date) <= new Date()) {
        entries.push({
          type: 'tv_season',
          seriesId: show.id,
          seriesName: show.name,
          seasonNumber: 0, // Indicates guest/single appearance
          airDate: show.first_air_date,
          episodeCount: actorEpisodes,
          posterPath: show.poster_path,
          character: show.character,
          vote_average: show.vote_average || 0,
          totalSeasons: seasons.length,
          isGuest: true
        });
      }
      continue;
    }

    // Main cast - estimate which seasons they appeared in
    // Use episode count to estimate number of seasons, distributed from first appearance
    const avgEpisodesPerSeason = totalEpisodes / seasons.length;
    const estimatedSeasons = Math.min(
      Math.ceil(actorEpisodes / Math.max(avgEpisodesPerSeason, 1)),
      seasons.length
    );

    // Take seasons starting from the show's first air date
    // (assumption: actors usually join at start, not mid-series)
    const relevantSeasons = seasons
      .filter(s => s.air_date && new Date(s.air_date) <= new Date())
      .slice(0, estimatedSeasons);

    for (const season of relevantSeasons) {
      entries.push({
        type: 'tv_season',
        seriesId: show.id,
        seriesName: show.name,
        seasonNumber: season.season_number,
        airDate: season.air_date,
        episodeCount: season.episode_count || 0,
        posterPath: season.poster_path || show.poster_path,
        character: show.character,
        vote_average: show.vote_average || 0,
        totalSeasons: seasons.length
      });
    }
  }

  return entries;
}

// ── Unified Entries ──

function buildUnifiedEntries() {
  const movies = movieCredits.map(m => ({ ...m, sortDate: m.release_date }));
  const tv = tvSeasonEntries.map(s => ({ ...s, sortDate: s.airDate }));
  unifiedEntries = [...movies, ...tv].sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));
}

// ── Header ──

function updateHeader() {
  document.getElementById('actorName').textContent = actorData.name;
  document.title = `ORBIT - ${actorData.name}`;

  const parts = [];
  if (movieCredits.length) parts.push(`${movieCredits.length} Films`);
  if (tvSeasonEntries.length) {
    const showCount = new Set(tvSeasonEntries.map(s => s.seriesId)).size;
    const mainRoleSeasons = tvSeasonEntries.filter(s => !s.isGuest).length;
    const guestAppearances = tvSeasonEntries.filter(s => s.isGuest).length;

    let tvText = `${showCount} Shows`;
    if (mainRoleSeasons > 0) tvText += ` · ${mainRoleSeasons} Seasons`;
    if (guestAppearances > 0) tvText += ` · ${guestAppearances} Guest`;
    parts.push(tvText);
  }
  document.getElementById('actorStats').textContent = parts.join(' · ') || 'No credits';

  if (actorData.profile_path) {
    const photo = document.getElementById('actorPhoto');
    photo.src = `${TMDB_IMG}w185${actorData.profile_path}`;
    photo.classList.add('visible');
  }

  // Add profile link
  const personId = localStorage.getItem('timelineMovieId');
  if (personId) {
    const profileLink = document.getElementById('actorProfileLink');
    profileLink.innerHTML = `<a href="people-profile.html?id=${personId}" class="orbit-profile-link">View Full Profile &#8250;</a>`;
  }
}

// ── Time Scale ──

function buildTimeScale() {
  const dates = [];
  unifiedEntries.forEach(e => dates.push(new Date(e.sortDate)));

  if (dates.length === 0) { timeScale = null; return; }

  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const span = max - min || 1;
  const years = span / (365.25 * 24 * 3600 * 1000);
  const contentW = Math.max(years * PX_PER_YEAR, 600);
  const totalW = PAD_LEFT + contentW + PAD_RIGHT;

  timeScale = {
    min, max, span, totalW, contentW,
    toX(dateStr) {
      const d = new Date(dateStr);
      const ratio = (d - min) / span;
      return PAD_LEFT + ratio * contentW;
    }
  };
}

// ── Career DNA Bar ──

function renderCareerDNA() {
  const mc = movieCredits.length;
  // Count TV shows (unique series), not individual season entries
  const tvShowCount = new Set(tvSeasonEntries.map(s => s.seriesId)).size;
  const total = mc + tvShowCount || 1;
  const mPct = Math.round(mc / total * 100);

  document.getElementById('dnaBar').style.setProperty('--split', `${mPct}%`);
  document.getElementById('dnaMovieLabel').innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg> ${mc} Films (${mPct}%)`;
  document.getElementById('dnaTvLabel').innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> ${tvShowCount} Shows (${100 - mPct}%)`;
}

// ── Unified Track ──

function getFilteredEntries() {
  if (currentMode === 'movies') return unifiedEntries.filter(e => e.type === 'movie');
  if (currentMode === 'tv') return unifiedEntries.filter(e => e.type === 'tv_season');
  return unifiedEntries;
}

function renderUnifiedTrack() {
  if (!timeScale) return;

  // Clear old cards
  unifiedContent.querySelectorAll('.at-card').forEach(el => el.remove());

  const entries = getFilteredEntries();

  entries.forEach(entry => {
    const x = timeScale.toX(entry.sortDate);
    const card = document.createElement('div');

    if (entry.type === 'movie') {
      card.className = 'at-card movie';
      card.style.left = `${x - 120}px`;
      card.style.top = '15px';

      const poster = entry.poster_path ? `${TMDB_IMG}w154${entry.poster_path}` : '';
      const rating = entry.vote_average > 0 ? `<span class="card-rating">★ ${entry.vote_average.toFixed(1)}</span>` : '';

      card.innerHTML = `
        ${poster ? `<img src="${poster}" alt="${esc(entry.title)}" loading="lazy">` : ''}
        <div class="card-overlay">
          <div class="card-title">${esc(entry.title)}</div>
          <div class="card-year">${entry.release_date.split('-')[0]}${rating}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (typeof openMovieCube === 'function') openMovieCube(entry.id);
      });
      card.addEventListener('mouseenter', (e) => showTooltip(e, entry));
      card.addEventListener('mouseleave', hideTooltip);

    } else {
      // TV Season
      card.className = 'at-card tv-season';
      if (entry.isGuest) card.classList.add('guest-appearance');
      card.style.left = `${x - 100}px`;
      card.style.top = '30px';

      const poster = entry.posterPath ? `${TMDB_IMG}w154${entry.posterPath}` : '';
      const seasonLabel = entry.isGuest ? `${entry.episodeCount} ep${entry.episodeCount !== 1 ? 's' : ''}` : `S${entry.seasonNumber}`;
      const badgeLabel = entry.isGuest ? 'GUEST' : `S${entry.seasonNumber}`;

      card.innerHTML = `
        ${poster ? `<img src="${poster}" alt="${esc(entry.seriesName)}" loading="lazy">` : ''}
        <div class="card-overlay">
          <div class="card-title">${esc(entry.seriesName)}</div>
          <div class="card-season">${seasonLabel}</div>
        </div>
        <div class="season-badge">${badgeLabel}</div>
      `;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!entry.isGuest) {
          toggleEpisodeTiles(entry, card);
        }
      });
      card.addEventListener('mouseenter', (e) => showTooltip(e, entry));
      card.addEventListener('mouseleave', hideTooltip);
    }

    unifiedContent.appendChild(card);
  });
}

// ── Sacred Line ──

function renderSacredLine() {
  if (!timeScale) return;

  const entries = getFilteredEntries();
  if (entries.length < 2) { sacredSvg.innerHTML = ''; return; }

  const cardH = 360; // movie card height (doubled)
  const midY = 15 + cardH / 2;

  const points = entries.map(e => ({
    x: timeScale.toX(e.sortDate),
    y: e.type === 'movie' ? midY : midY + 5,
    type: e.type
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1], c = points[i];
    const cpx = (p.x + c.x) / 2;
    d += ` C ${cpx} ${p.y}, ${cpx} ${c.y}, ${c.x} ${c.y}`;
  }

  sacredSvg.setAttribute('width', timeScale.totalW);
  sacredSvg.setAttribute('height', cardH + 80);

  // Create gradient
  const gradId = 'sacredGrad';
  const totalLen = points[points.length - 1].x - points[0].x || 1;

  let stops = '';
  points.forEach(p => {
    const pct = ((p.x - points[0].x) / totalLen * 100).toFixed(1);
    const color = p.type === 'movie' ? 'rgba(0,217,255,0.8)' : 'rgba(255,215,0,0.8)';
    stops += `<stop offset="${pct}%" stop-color="${color}"/>`;
  });

  sacredSvg.innerHTML = `
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
        ${stops}
      </linearGradient>
    </defs>
  `;

  const glow = svgPath(d, `url(#${gradId})`, 10, 0.15);
  const mid = svgPath(d, `url(#${gradId})`, 5, 0.3);
  const main = svgPath(d, `url(#${gradId})`, 2, 0.7);

  sacredSvg.appendChild(glow);
  sacredSvg.appendChild(mid);
  sacredSvg.appendChild(main);
}

function svgPath(d, stroke, width, opacity) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  p.setAttribute('stroke', stroke);
  p.setAttribute('stroke-width', width);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke-linecap', 'round');
  p.setAttribute('opacity', opacity);
  return p;
}

// ── Year Axis ──

function renderYearAxis() {
  if (!timeScale) return;
  yearAxis.innerHTML = '';

  const startY = timeScale.min.getFullYear();
  const endY = timeScale.max.getFullYear();
  const range = endY - startY;
  const step = range > 30 ? 10 : range > 15 ? 5 : range > 8 ? 2 : 1;
  const first = Math.ceil(startY / step) * step;

  for (let y = first; y <= endY; y += step) {
    const x = timeScale.toX(new Date(y, 0, 1).toISOString());

    const marker = document.createElement('div');
    marker.className = 'year-marker';
    marker.textContent = y;
    marker.style.left = `${x}px`;

    const tickTop = document.createElement('div');
    tickTop.className = 'year-tick year-tick-top';
    marker.appendChild(tickTop);

    yearAxis.appendChild(marker);
  }
}

// ── Mode Toggle ──

function applyMode(mode) {
  currentMode = mode;
  renderUnifiedTrack();
  renderSacredLine();
}

// ── Tooltips ──

function showTooltip(e, entry) {
  const tip = document.getElementById('entryTooltip');

  if (entry.type === 'movie') {
    const year = entry.release_date.split('-')[0];
    const rating = entry.vote_average > 0 ? ` · ★ ${entry.vote_average.toFixed(1)}` : '';
    const char = entry.character ? `<div class="tooltip-sub">${esc(entry.character)}</div>` : '';
    tip.innerHTML = `<div class="tooltip-title">${esc(entry.title)}</div><div class="tooltip-sub">${year}${rating}</div>${char}`;
    tip.className = 'entry-tooltip movie-tip';
  } else {
    const year = entry.airDate.split('-')[0];
    const eps = entry.episodeCount > 0 ? ` · ${entry.episodeCount} eps` : '';
    const char = entry.character ? `<div class="tooltip-sub">${esc(entry.character)}</div>` : '';
    const seasonInfo = entry.isGuest ? `Guest appearance (${year})` : `Season ${entry.seasonNumber} (${year})`;
    tip.innerHTML = `<div class="tooltip-title">${esc(entry.seriesName)}</div><div class="tooltip-sub">${seasonInfo}${eps}</div>${char}`;
    tip.className = 'entry-tooltip tv-tip';
  }

  positionTooltip(tip, e);
  tip.hidden = false;
}

function hideTooltip() { document.getElementById('entryTooltip').hidden = true; }

function positionTooltip(tip, e) {
  tip.style.left = `${Math.min(e.clientX + 12, window.innerWidth - 280)}px`;
  tip.style.top = `${Math.min(e.clientY - 10, window.innerHeight - 100)}px`;
}

// ── Episode Tiles ──

let activeTilesEntry = null;

async function toggleEpisodeTiles(entry, cardEl) {
  const tiles = document.getElementById('episodeTiles');

  // If same entry clicked, toggle off
  if (activeTilesEntry && activeTilesEntry.seriesId === entry.seriesId && activeTilesEntry.seasonNumber === entry.seasonNumber) {
    hideEpisodeTiles();
    return;
  }

  activeTilesEntry = entry;
  const header = document.getElementById('episodeTilesHeader');
  const scroll = document.getElementById('episodeTilesScroll');

  header.textContent = `${entry.seriesName} · Season ${entry.seasonNumber}`;
  scroll.innerHTML = '<div class="episode-loading">Loading episodes...</div>';

  // Position below the card
  const rect = cardEl.getBoundingClientRect();
  tiles.style.top = `${rect.bottom + 8}px`;
  tiles.style.left = `${Math.max(8, rect.left - 100)}px`;
  tiles.hidden = false;

  // Fetch episodes
  const cacheKey = `${entry.seriesId}-${entry.seasonNumber}`;
  let episodes;

  if (episodeCache.has(cacheKey)) {
    episodes = episodeCache.get(cacheKey);
  } else {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${entry.seriesId}/season/${entry.seasonNumber}?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      episodes = data.episodes || [];
      episodeCache.set(cacheKey, episodes);
    } catch {
      episodes = [];
    }
  }

  if (activeTilesEntry !== entry) return; // stale

  if (episodes.length === 0) {
    scroll.innerHTML = '<div class="episode-loading">No episode data available</div>';
    return;
  }

  scroll.innerHTML = episodes.map(ep => {
    const airDate = ep.air_date ? new Date(ep.air_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    const title = ep.name || `Episode ${ep.episode_number}`;
    return `
      <div class="episode-tile">
        <div class="ep-number">Ep ${ep.episode_number}</div>
        <div class="ep-title" title="${esc(title)}">${esc(title)}</div>
        <div class="ep-date">${airDate}</div>
      </div>
    `;
  }).join('');
}

function hideEpisodeTiles() {
  document.getElementById('episodeTiles').hidden = true;
  activeTilesEntry = null;
}

// ── Career DNA Popup ──

function openCareerDNA() {
  const overlay = document.getElementById('careerDnaOverlay');
  const mc = movieCredits.length;
  const tvShowCount = new Set(tvSeasonEntries.map(s => s.seriesId)).size;
  const mainRoleSeasons = tvSeasonEntries.filter(s => !s.isGuest).length;
  const total = mc + tvShowCount || 1;
  const mPct = Math.round(mc / total * 100);
  const tPct = 100 - mPct;

  document.getElementById('dnaPopupFilm').style.width = `${mPct}%`;
  document.getElementById('dnaPopupTv').style.width = `${tPct}%`;

  document.getElementById('dnaPopupLegend').innerHTML = `
    <span class="legend-item film-legend"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg> ${mPct}% Film (${mc} credits)</span>
    <span class="legend-item tv-legend"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> ${tPct}% TV (${tvShowCount} shows, ${mainRoleSeasons} seasons)</span>
  `;

  // Compute stats
  const stats = [];

  // Most prominent decade (weighted scoring)
  const decadeScores = {};
  unifiedEntries.forEach(e => {
    const year = new Date(e.sortDate).getFullYear();
    const decade = Math.floor(year / 10) * 10;

    let score = 1;

    if (e.type === 'movie') {
      const order = e.order ?? 999;
      if (order <= 2) score = 3.0;
      else if (order <= 5) score = 2.0;
      else if (order <= 9) score = 1.5;
      else score = 1.0;

      const rating = e.vote_average || 0;
      if (rating >= 7.0) score += 1.0;
      else if (rating >= 6.0) score += 0.5;

      if (order === 0) score += 1.0;
    } else {
      score = e.isGuest ? 0.5 : 1.0;
    }

    decadeScores[decade] = (decadeScores[decade] || 0) + score;
  });
  const topDecade = Object.entries(decadeScores).sort((a, b) => b[1] - a[1])[0];
  if (topDecade) stats.push(`<div class="stat-row"><span class="stat-label">Most Prominent Decade</span><span class="stat-value">${topDecade[0]}s</span></div>`);

  // Longest TV run
  const showSeasonCounts = {};
  tvSeasonEntries.forEach(s => {
    showSeasonCounts[s.seriesName] = (showSeasonCounts[s.seriesName] || 0) + 1;
  });
  const longestRun = Object.entries(showSeasonCounts).sort((a, b) => b[1] - a[1])[0];
  if (longestRun) stats.push(`<div class="stat-row"><span class="stat-label">Longest TV Run</span><span class="stat-value">${longestRun[0]} (${longestRun[1]} seasons)</span></div>`);

  // Career span
  if (unifiedEntries.length > 0) {
    const firstYear = new Date(unifiedEntries[0].sortDate).getFullYear();
    const lastYear = new Date(unifiedEntries[unifiedEntries.length - 1].sortDate).getFullYear();
    stats.push(`<div class="stat-row"><span class="stat-label">Career Span</span><span class="stat-value">${firstYear} – ${lastYear} (${lastYear - firstYear} years)</span></div>`);
  }

  // Total unique shows with season breakdown
  const showCount = new Set(tvSeasonEntries.map(s => s.seriesId)).size;
  const guestCount = tvSeasonEntries.filter(s => s.isGuest).length;
  if (showCount > 0) {
    let showStat = `${showCount} series`;
    if (guestCount > 0) showStat += ` (${guestCount} guest)`;
    stats.push(`<div class="stat-row"><span class="stat-label">TV Shows</span><span class="stat-value">${showStat}</span></div>`);
  }

  document.getElementById('dnaPopupStats').innerHTML = stats.join('');
  overlay.hidden = false;
}

function closeCareerDNA() {
  document.getElementById('careerDnaOverlay').hidden = true;
}

// ── Helpers ──

function esc(str) { return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function showEmpty(msg) {
  hideLoading();
  document.getElementById('emptyMessage').textContent = msg;
  document.getElementById('emptyState').hidden = false;
}

function hideLoading() {
  document.getElementById('loadingState').classList.add('hidden');
}
