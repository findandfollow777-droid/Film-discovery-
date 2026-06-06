/* ============================================================
   AWARDS 2.0 — THE PRESTIGE
   Year-first awards explorer. Two views: compact year strips →
   year detail (hero + category sections). Lazy-fetches v1
   festival data on demand. Hash-driven (#oscar-2020).
   ============================================================ */

// ===== EDITORIAL DATA =====
// Inline for Phase 1; extract to data/awards-year-editorial.js later.
// Keyed `<festivalSlug>-<year>`. festivalSlug matches v1 file naming
// (oscar, bafta, gg, cannes, venice, berlin).
const AWARDS_YEAR_EDITORIAL = {
  'oscar-2024': {
    heroType: 'film-led',
    ceremonyNumber: 96,
    venue: 'Dolby Theatre, Los Angeles',
    headline: 'Oppenheimer dominates with seven wins',
    deckLine: "Christopher Nolan's epic about the father of the atomic bomb sweeps including Best Picture, Best Director, and Best Actor.",
    backdropTmdbId: 872585,
    stripStats: ['96th', '7 wins', 'Dolby Theatre']
  },
  'oscar-2023': {
    heroType: 'film-led',
    ceremonyNumber: 95,
    venue: 'Dolby Theatre, Los Angeles',
    headline: 'Everything Everywhere All at Once sweeps',
    deckLine: 'The multiverse action comedy takes home seven Oscars including Best Picture, Best Director, and three acting wins.',
    backdropTmdbId: 545611,
    stripStats: ['95th', '7 wins', 'Dolby Theatre']
  },
  'oscar-2020': {
    heroType: 'film-led',
    ceremonyNumber: 92,
    venue: 'Dolby Theatre, Los Angeles',
    headline: 'Parasite makes Oscar history',
    deckLine: "Bong Joon-ho's Korean thriller becomes the first non-English-language film to win Best Picture in ninety-two years of the Academy.",
    backdropTmdbId: 496243,
    stripStats: ['92nd', '4 wins', 'Dolby Theatre']
  },
  'oscar-2019': {
    heroType: 'typographic',
    ceremonyNumber: 91,
    venue: 'Dolby Theatre',
    headline: 'Green Book takes Best Picture in divided ceremony',
    bestPicture: 'Green Book',
    host: 'None',
    stripStats: ['91st', '3 wins', 'No host']
  },
  'oscar-2018': {
    heroType: 'film-led',
    ceremonyNumber: 90,
    venue: 'Dolby Theatre, Los Angeles',
    headline: 'The Shape of Water wins Best Picture',
    deckLine: "Guillermo del Toro's fantasy romance takes home four Oscars including Best Picture and Best Director.",
    backdropTmdbId: 399055,
    stripStats: ['90th', '4 wins', 'Dolby Theatre']
  },
  'oscar-2017': {
    heroType: 'duel',
    ceremonyNumber: 89,
    venue: 'Dolby Theatre',
    headline: 'The envelope mix-up heard around the world',
    winnerFilm: 'Moonlight',
    winnerSubtext: 'Best Picture winner',
    loserFilm: 'La La Land',
    loserSubtext: 'Announced in error',
    winnerTmdbId: 376867,
    loserTmdbId: 313369,
    stripStats: ['89th', 'Upset', 'Dolby Theatre']
  }
};

/* ============================================================
   TROPHY STRIP NAVIGATION — Added Jun 6 2026
   Category → ORBIT glyph map (Rule #11: glyphs, never emojis).
   Keys match v1 category display_name; unmapped categories fall
   back to og-trophy. Rendering/scroll-spy logic below renderCategories().
   ============================================================ */
const AWARD_GLYPH_MAP = {
  'Best Picture':                   { glyph: 'og-trophy',      label: 'Best Picture' },
  'Best Director':                  { glyph: 'og-statuette',   label: 'Best Director' },
  'Best Actor':                     { glyph: 'og-person',      label: 'Best Actor' },
  'Best Actress':                   { glyph: 'og-person-bare', label: 'Best Actress' },
  'Best Supporting Actor':          { glyph: 'og-person',      label: 'Supporting Actor' },
  'Best Supporting Actress':        { glyph: 'og-person-bare', label: 'Supporting Actress' },
  'Best Animated Feature Film':     { glyph: 'og-sparkle',     label: 'Animated' },
  'Best Animated Short Film':       { glyph: 'og-sparkle',     label: 'Animated Short' },
  'Best International Feature Film': { glyph: 'og-globe',       label: 'International' },
  'Best Documentary Feature Film':  { glyph: 'og-newspaper',   label: 'Documentary' },
  'Best Documentary Short Film':    { glyph: 'og-newspaper',   label: 'Documentary Short' },
  'Best Original Screenplay':       { glyph: 'og-writing',     label: 'Original Screenplay' },
  'Best Adapted Screenplay':        { glyph: 'og-books',       label: 'Adapted Screenplay' },
  'Best Cinematography':            { glyph: 'og-camera',      label: 'Cinematography' },
  'Best Film Editing':              { glyph: 'og-scissors',    label: 'Editing' },
  'Best Production Design':         { glyph: 'og-mask',        label: 'Production Design' },
  'Best Costume Design':            { glyph: 'og-star',        label: 'Costume Design' },
  'Best Makeup and Hairstyling':    { glyph: 'og-mask',        label: 'Makeup & Hair' },
  'Best Original Score':            { glyph: 'og-music',       label: 'Original Score' },
  'Best Original Song':             { glyph: 'og-mic',         label: 'Original Song' },
  'Best Sound':                     { glyph: 'og-speech',      label: 'Sound' },
  'Best Sound Editing':             { glyph: 'og-speech',      label: 'Sound Editing' },
  'Best Sound Mixing':              { glyph: 'og-speech',      label: 'Sound Mixing' },
  'Best Visual Effects':            { glyph: 'og-bolt',        label: 'Visual Effects' },
  'Best Casting':                   { glyph: 'og-handshake',   label: 'Casting' },
  'Best Live Action Short Film':    { glyph: 'og-film',        label: 'Live Action Short' }
};

// ===== STATE =====
let currentFestival = 'oscar';
let currentYear = null;
let currentView = 'compact'; // 'compact' or 'detail'

// Trophy strip runtime state (module-scoped to avoid leaks across year navigations)
let trophySpyObserver = null;      // disconnected & rebuilt each render
let trophyCarouselInited = false;  // arrow/scroll listeners attach exactly once
let trophyLoopWidth = 0;           // width of one item set; 0 = no seamless loop

// ===== DATA CACHE (lazy v1 fetch, ported from awards-browse.js) =====
const V1_FESTIVAL_CACHE = {};   // slug → reshaped festival object
const V1_RAW_CACHE = {};        // slug → raw v1 payload (for category render)
const V1_PENDING = {};          // slug → in-flight Promise (dedupes)
const V1_FAILED = {};           // slug → true (no re-fetch loop)

// ===== UTIL =====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function festivalDisplayName(slug) {
  const map = {
    oscar: 'Academy Awards',
    bafta: 'BAFTA Awards',
    gg: 'Golden Globe Awards',
    cannes: 'Cannes Film Festival',
    venice: 'Venice Film Festival',
    berlin: 'Berlin International Film Festival'
  };
  return map[slug] || slug;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  attachEventListeners();
  initFromHash();
  if (currentView === 'compact') loadYearStrips();
});

// ===== LAZY-FETCH V1 DATA (mirrors awards-browse.js: fetchFestivalV1) =====
function loadV1FestivalData(festivalSlug) {
  if (V1_FESTIVAL_CACHE[festivalSlug]) return Promise.resolve(V1_FESTIVAL_CACHE[festivalSlug]);
  if (V1_FAILED[festivalSlug]) return Promise.resolve(null);
  if (V1_PENDING[festivalSlug]) return V1_PENDING[festivalSlug];

  const p = fetch(`../data/awards-v1-${festivalSlug}.json`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      V1_RAW_CACHE[festivalSlug] = data;
      const reshaped = buildLegacyFestivalDB(data);
      V1_FESTIVAL_CACHE[festivalSlug] = reshaped;
      delete V1_PENDING[festivalSlug];
      return reshaped;
    })
    .catch(err => {
      console.warn(`[awards2] failed to load v1 ${festivalSlug}:`, err);
      V1_FAILED[festivalSlug] = true;
      delete V1_PENDING[festivalSlug];
      return null;
    });

  V1_PENDING[festivalSlug] = p;
  return p;
}

// Reshape v1 → legacy DB. Ported from awards-browse.js:buildLegacyFestivalDB.
function buildLegacyFestivalDB(v1Data) {
  const db = {};
  if (!v1Data || !Array.isArray(v1Data.awards) || !Array.isArray(v1Data.categories)) return db;

  const catById = {};
  v1Data.categories.forEach(c => { catById[c.id] = c; });

  function buildEntry(award) {
    const recipients = Array.isArray(award.recipients) ? award.recipients : [];
    const recipientNames = recipients.map(r => r && r.name).filter(Boolean).join(', ');
    const firstPid = recipients.find(r => r && r.tmdb_person_id);
    const personId = firstPid ? firstPid.tmdb_person_id : 0;
    return {
      title: award.film_title || recipientNames || '',
      tmdb_id: award.film_tmdb_id || 0,
      poster_path: award.film_poster_path || null,
      person_name: recipientNames || null,
      person_id: personId
    };
  }

  const winBuckets = {};
  const nomBuckets = {};
  for (const award of v1Data.awards) {
    let target;
    if (award.result === 'won') target = winBuckets;
    else if (award.result === 'nominated') target = nomBuckets;
    else continue;
    const cat = catById[award.category_id];
    if (!cat) continue;
    const catName = cat.display_name;
    const year = String(award.year);
    if (!target[catName]) target[catName] = {};
    if (!target[catName][year]) target[catName][year] = [];
    target[catName][year].push(buildEntry(award));
  }

  const allCats = new Set([...Object.keys(winBuckets), ...Object.keys(nomBuckets)]);
  allCats.forEach(catName => {
    db[catName] = {};
    const winYears = winBuckets[catName] || {};
    const nomYears = nomBuckets[catName] || {};
    const allYears = new Set([...Object.keys(winYears), ...Object.keys(nomYears)]);
    allYears.forEach(year => {
      const wins = winYears[year] || [];
      const nominees = nomYears[year] || [];
      if (wins.length === 1) db[catName][year] = { winner: wins[0], nominees };
      else if (wins.length >= 2) db[catName][year] = { winners: wins, nominees };
      else db[catName][year] = { winner: null, nominees };
    });
  });

  return db;
}

// ===== TMDB BACKDROP (sessionStorage cached per Rule #28) =====
async function getTmdbBackdropPath(movieId) {
  const cacheKey = `orbit_tmdb_movie_${movieId}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.backdrop_path || null;
    }
  } catch (_) { /* fall through */ }

  try {
    const data = await OrbitUtils.tmdbFetch(`/movie/${movieId}`);
    try { sessionStorage.setItem(cacheKey, JSON.stringify({ backdrop_path: data.backdrop_path })); } catch (_) {}
    return data.backdrop_path || null;
  } catch (err) {
    console.warn('[awards2] TMDB backdrop fetch failed:', movieId, err);
    return null;
  }
}

// ===== YEAR STRIPS =====
async function loadYearStrips() {
  const container = document.getElementById('year-strips-container');
  container.innerHTML = '<div class="strip-loading">Loading ceremonies…</div>';

  await loadV1FestivalData(currentFestival);

  // Only show years that have editorial data.
  const editorialYears = Object.keys(AWARDS_YEAR_EDITORIAL)
    .filter(k => k.startsWith(`${currentFestival}-`))
    .map(k => parseInt(k.split('-')[1], 10))
    .filter(y => !isNaN(y))
    .sort((a, b) => b - a);

  if (editorialYears.length === 0) {
    container.innerHTML = `<div class="strip-empty">No editorial entries yet for ${escapeHtml(festivalDisplayName(currentFestival))}. Coming soon.</div>`;
    return;
  }

  container.innerHTML = editorialYears.map(year => {
    const editorial = AWARDS_YEAR_EDITORIAL[`${currentFestival}-${year}`];
    const stats = (editorial.stripStats || []).map(s =>
      `<span class="strip-stat">${escapeHtml(s)}</span>`
    ).join('');
    return `
      <div class="year-strip" data-year="${year}">
        <div class="year-number">${year}</div>
        <div class="strip-visual">
          <div class="strip-visual-placeholder">Backdrop</div>
        </div>
        <div class="strip-content">
          <div class="strip-headline">${escapeHtml(editorial.headline)}</div>
        </div>
        <div class="strip-stats">${stats}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.year-strip').forEach(strip => {
    strip.addEventListener('click', () => {
      const year = parseInt(strip.dataset.year, 10);
      showYearDetail(year);
    });
  });
}

// ===== VIEW SWITCHING =====
function showCompactView() {
  currentView = 'compact';
  document.getElementById('compact-view').style.display = 'block';
  document.getElementById('year-detail-view').style.display = 'none';
  if (window.location.hash) {
    // Clear hash without triggering hashchange-driven re-entry.
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);
}

async function showYearDetail(year) {
  currentView = 'detail';
  currentYear = year;

  document.getElementById('compact-view').style.display = 'none';
  document.getElementById('year-detail-view').style.display = 'block';

  const newHash = `#${currentFestival}-${year}`;
  if (window.location.hash !== newHash) {
    // pushState (not replace) so browser back-button returns to compact view.
    history.pushState({ festival: currentFestival, year }, '', newHash);
  }

  const editorial = AWARDS_YEAR_EDITORIAL[`${currentFestival}-${year}`];
  document.getElementById('year-detail-title').textContent =
    editorial ? `${year} ${festivalDisplayName(currentFestival)}` : `${year}`;

  renderHero(year);
  await renderCategories(year);   // await so trophy scroll-spy can observe real headings
  await renderTrophyStrip(year);
  initTrophyCarousel();
  window.scrollTo(0, 0);
}

function initFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const dash = hash.indexOf('-');
  if (dash < 1) return;
  const festival = hash.slice(0, dash);
  const year = parseInt(hash.slice(dash + 1), 10);
  if (!festival || !year) return;
  if (!AWARDS_YEAR_EDITORIAL[`${festival}-${year}`]) return;

  currentFestival = festival;
  // Sync festival tab visual state.
  document.querySelectorAll('.festival-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.festival === festival);
  });
  showYearDetail(year);
}

// ===== HERO =====
async function renderHero(year) {
  const editorial = AWARDS_YEAR_EDITORIAL[`${currentFestival}-${year}`];
  const container = document.getElementById('hero-container');

  if (!editorial) {
    container.innerHTML = '';
    return;
  }

  if (editorial.heroType === 'film-led') {
    container.innerHTML = `
      <div class="hero-film-led">
        <div class="hero-backdrop" data-backdrop-tmdb-id="${editorial.backdropTmdbId || ''}"></div>
        <div class="hero-content">
          <div class="hero-year">${year}</div>
          <div class="hero-ceremony">${editorial.ceremonyNumber}${ordinalSuffix(editorial.ceremonyNumber)} ${escapeHtml(festivalDisplayName(currentFestival))}${editorial.venue ? ' · ' + escapeHtml(editorial.venue) : ''}</div>
          <div class="hero-headline">${escapeHtml(editorial.headline)}</div>
          <div class="hero-deck">${escapeHtml(editorial.deckLine || '')}</div>
        </div>
      </div>
    `;
    if (editorial.backdropTmdbId) {
      const path = await getTmdbBackdropPath(editorial.backdropTmdbId);
      if (path) {
        const url = OrbitUtils.tmdbImageUrl(path, OrbitUtils.IMAGE_SIZES.BACKDROP);
        const el = container.querySelector('.hero-backdrop');
        if (el) el.innerHTML = `<img src="${url}" alt="">`;
      }
    }
    return;
  }

  if (editorial.heroType === 'duel') {
    container.innerHTML = `
      <div class="hero-duel">
        <div class="duel-side winner">
          <div class="hero-content">
            <div class="hero-headline">${escapeHtml(editorial.winnerFilm)}</div>
            <div class="hero-deck">${escapeHtml(editorial.winnerSubtext)}</div>
          </div>
        </div>
        <div class="duel-side loser">
          <div class="hero-content">
            <div class="hero-headline">${escapeHtml(editorial.loserFilm)}</div>
            <div class="hero-deck">${escapeHtml(editorial.loserSubtext)}</div>
          </div>
        </div>
        <div class="duel-year-badge">${year}</div>
      </div>
    `;
    return;
  }

  if (editorial.heroType === 'typographic') {
    container.innerHTML = `
      <div class="hero-typographic">
        <div>
          <div class="hero-year">${year}</div>
          <div class="meta-grid">
            <div class="meta-col">
              <div class="meta-label">Best Picture</div>
              <div class="meta-value">${escapeHtml(editorial.bestPicture || '—')}</div>
            </div>
            <div class="meta-col">
              <div class="meta-label">Host</div>
              <div class="meta-value">${escapeHtml(editorial.host || '—')}</div>
            </div>
            <div class="meta-col">
              <div class="meta-label">Venue</div>
              <div class="meta-value">${escapeHtml(editorial.venue || '—')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (editorial.heroType === 'portrait') {
    container.innerHTML = `
      <div class="hero-portrait">
        <div class="portrait-image"></div>
        <div class="portrait-content">
          <div class="hero-tag">${escapeHtml(editorial.tag || 'Spotlight')}</div>
          <div class="hero-year">${year}</div>
          <div class="hero-headline">${escapeHtml(editorial.headline || '')}</div>
          <div class="hero-deck">${escapeHtml(editorial.deckLine || '')}</div>
        </div>
      </div>
    `;
    return;
  }
}

function ordinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ===== CATEGORIES (Phase 1: simple placeholder tiles per spec) =====
async function renderCategories(year) {
  const container = document.getElementById('categories-container');
  container.innerHTML = '<div class="categories-loading">Loading categories…</div>';

  const db = await loadV1FestivalData(currentFestival);
  if (!db) {
    container.innerHTML = '<div class="categories-error">Failed to load categories.</div>';
    return;
  }

  // Transpose db[catName][year] → yearCategories[catName]; preserve v1 category order.
  const yearStr = String(year);
  const yearCategories = [];
  const raw = V1_RAW_CACHE[currentFestival];
  const order = raw && Array.isArray(raw.categories) ? raw.categories.map(c => c.display_name) : Object.keys(db);
  order.forEach(catName => {
    const slot = db[catName] && db[catName][yearStr];
    if (!slot) return;
    yearCategories.push({ name: catName, slot });
  });

  if (yearCategories.length === 0) {
    container.innerHTML = `<div class="categories-empty">No category data for ${year}.</div>`;
    return;
  }

  container.innerHTML = yearCategories.map(({ name, slot }) => {
    const winners = slot.winners ? slot.winners : (slot.winner ? [slot.winner] : []);
    const nominees = slot.nominees || [];
    const tiles = [
      ...winners.map(w => renderSimpleTile(w, true)),
      ...nominees.map(n => renderSimpleTile(n, false))
    ].join('');
    return `
      <section class="category-section">
        <h2 class="category-header" data-category-id="${escapeHtml(name)}">${escapeHtml(name)}</h2>
        <div class="category-grid">${tiles}</div>
      </section>
    `;
  }).join('');
}

// ===== TROPHY STRIP =====
// Builds the category-glyph carousel from the same ordered transpose
// renderCategories() uses. Hover/active styling is CSS-driven (awards2.css);
// JS handles data, click-to-scroll, seamless loop, and scroll-spy.
async function renderTrophyStrip(year) {
  const strip = document.getElementById('trophy-strip');
  const carousel = document.getElementById('trophy-carousel');
  if (!strip || !carousel) return;

  // Tear down prior scroll-spy before re-rendering (prevents observer leak).
  if (trophySpyObserver) { trophySpyObserver.disconnect(); trophySpyObserver = null; }
  carousel.innerHTML = '';
  trophyLoopWidth = 0;
  strip.hidden = true;

  // loadV1FestivalData already returns the reshaped legacy DB (db[catName][year]).
  const db = await loadV1FestivalData(currentFestival);
  if (!db) return;

  const yearStr = String(year);
  const raw = V1_RAW_CACHE[currentFestival];
  const order = raw && Array.isArray(raw.categories)
    ? raw.categories.map(c => c.display_name)
    : Object.keys(db);
  const categories = order.filter(name => db[name] && db[name][yearStr]);
  if (categories.length === 0) return;

  const itemHtml = (name) => {
    const g = AWARD_GLYPH_MAP[name] || { glyph: 'og-trophy', label: name };
    return `
      <div class="trophy-item" data-category="${escapeHtml(name)}" role="link" tabindex="0" title="${escapeHtml(g.label)}">
        <span class="og ${g.glyph}"></span>
        <span class="trophy-label">${escapeHtml(g.label)}</span>
      </div>`;
  };

  const baseHtml = categories.map(itemHtml).join('');
  carousel.innerHTML = baseHtml;
  strip.hidden = false;

  // Seamless loop: only when items overflow. Duplicate the set once so a
  // rightward scroll past the first set wraps invisibly (handled in the
  // scroll listener via trophyLoopWidth). Measure after layout.
  requestAnimationFrame(() => {
    if (carousel.scrollWidth > carousel.clientWidth + 4) {
      trophyLoopWidth = carousel.scrollWidth; // width of one full set
      carousel.insertAdjacentHTML('beforeend', baseHtml);
    }
    attachTrophyItemHandlers(carousel);
  });

  buildTrophySpy();
}

// Click / keyboard → smooth-scroll to the matching category section.
// Idempotent per item (data-bound guard) so re-renders and clones don't stack.
function attachTrophyItemHandlers(carousel) {
  carousel.querySelectorAll('.trophy-item').forEach(item => {
    if (item.dataset.bound === '1') return;
    item.dataset.bound = '1';
    const go = () => {
      const name = item.dataset.category;
      const target = document.querySelector(`[data-category-id="${name}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    item.addEventListener('click', go);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
}

// Scroll-spy: highlight the trophy whose category heading is near the top.
// Single shared observer, rebuilt (and previously disconnected) each render.
function buildTrophySpy() {
  trophySpyObserver = new IntersectionObserver((entries) => {
    const hit = entries.find(e => e.isIntersecting);
    if (!hit) return;
    const name = hit.target.dataset.categoryId;
    document.querySelectorAll('.trophy-item').forEach(item => {
      item.classList.toggle('active', item.dataset.category === name);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  document.querySelectorAll('[data-category-id]').forEach(h => trophySpyObserver.observe(h));
}

// Arrow buttons + seamless-loop scroll listener. Attaches exactly once
// (the carousel/buttons are static in the HTML); per-year state lives in
// trophyLoopWidth, which this listener reads.
function initTrophyCarousel() {
  const carousel = document.getElementById('trophy-carousel');
  const leftBtn = document.getElementById('trophy-scroll-left');
  const rightBtn = document.getElementById('trophy-scroll-right');
  if (!carousel || !leftBtn || !rightBtn) return;
  if (trophyCarouselInited) return;
  trophyCarouselInited = true;

  const SCROLL_STEP = 200;
  leftBtn.addEventListener('click', () => carousel.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' }));
  rightBtn.addEventListener('click', () => carousel.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' }));

  // Direct scrollLeft assignment is instant (unaffected by scroll-behavior),
  // so wrapping at the set boundary is invisible when a duplicate set exists.
  carousel.addEventListener('scroll', () => {
    if (trophyLoopWidth && carousel.scrollLeft >= trophyLoopWidth) {
      carousel.scrollLeft -= trophyLoopWidth;
    }
  });
}

// Phase 1 placeholder per spec — simple poster + WINNER/NOMINEE label.
// Phase 2: port full tile rendering (festival glow, person portraits, badges) from awards-browse.js.
function renderSimpleTile(entry, isWinner) {
  if (!entry) return '';
  const posterUrl = entry.poster_path
    ? OrbitUtils.tmdbImageUrl(entry.poster_path, OrbitUtils.IMAGE_SIZES.POSTER_MD)
    : null;
  const posterInner = posterUrl
    ? `<img src="${posterUrl}" alt="${escapeHtml(entry.title)}" loading="lazy">`
    : `<div class="tile-no-poster"><span class="og og-film"></span></div>`;
  const personLine = entry.person_name && entry.person_name !== entry.title
    ? `<div class="tile-person">${escapeHtml(entry.person_name)}</div>`
    : '';
  return `
    <div class="tile ${isWinner ? 'winner' : 'nominee'} ${currentFestival}">
      <div class="tile-poster">${posterInner}</div>
      <div class="tile-label">${isWinner ? 'WINNER' : 'NOMINEE'}</div>
      <div class="tile-info">
        <div class="tile-title">${escapeHtml(entry.title || 'Unknown')}</div>
        ${personLine}
      </div>
    </div>
  `;
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
  document.querySelector('.back-to-range')?.addEventListener('click', showCompactView);

  // Hub nav (visual toggle only — sections wired in Phase 2)
  document.querySelectorAll('.hub-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.hub-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Festival tabs — data-driven switching.
  document.querySelectorAll('.festival-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const festival = tab.dataset.festival;
      if (festival === currentFestival) return;

      currentFestival = festival;
      document.querySelectorAll('.festival-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Always return to compact view when switching festivals.
      showCompactView();
      loadYearStrips();
    });
  });

  // Browser back/forward.
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (!hash && currentView === 'detail') {
      showCompactView();
    } else if (hash) {
      initFromHash();
    }
  });
}
