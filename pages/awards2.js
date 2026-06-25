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
    stripStats: ['96th', '7 wins', 'Dolby Theatre'],
    // By the Numbers slide — authored, not computed (computed stats live in computeCeremonyStats).
    standout: {
      personId: 2037,            // Cillian Murphy (confirmed in awards-v1-oscar.json)
      name: 'Cillian Murphy',
      award: 'Best Actor',
      note: 'First nomination, first win'
    },
    highlight: {
      label: 'Biggest snub',
      value: 'American Fiction',
      detail: '5 nominations, 1 win'   // freeform — author per year
    }
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
   Updated Jun 7 2026 — Awards 2.0 statuette belt + hover label.
   Category → ORBIT glyph map (Rule #11: glyphs, never emojis).
   Keys match v1 category display_name.
     beltGlyph     = Oscar statuette — UNIFORM on the conveyor belt
                     (every Oscar is the same physical trophy).
     categoryGlyph = distinguishing glyph, revealed in the hover label.
   Unmapped categories fall back to og-statuette belt / og-trophy category.
   Rendering/scroll-spy logic below renderCategories().
   ============================================================ */
const AWARD_GLYPH_MAP = {
  'Best Picture':                   { label: 'Best Picture',         beltGlyph: 'og-statuette', categoryGlyph: 'og-trophy' },
  'Best Director':                  { label: 'Best Director',        beltGlyph: 'og-statuette', categoryGlyph: 'og-statuette' },
  'Best Actor':                     { label: 'Best Actor',           beltGlyph: 'og-statuette', categoryGlyph: 'og-person' },
  'Best Actress':                   { label: 'Best Actress',         beltGlyph: 'og-statuette', categoryGlyph: 'og-rising-star' },
  'Best Supporting Actor':          { label: 'Supporting Actor',     beltGlyph: 'og-statuette', categoryGlyph: 'og-person-bare' },
  'Best Supporting Actress':        { label: 'Supporting Actress',   beltGlyph: 'og-statuette', categoryGlyph: 'og-star' },
  'Best Animated Feature Film':     { label: 'Animated',             beltGlyph: 'og-statuette', categoryGlyph: 'og-sparkle' },
  'Best Animated Short Film':       { label: 'Animated Short',       beltGlyph: 'og-statuette', categoryGlyph: 'og-sparkle' },
  'Best International Feature Film': { label: 'International',         beltGlyph: 'og-statuette', categoryGlyph: 'og-globe' },
  'Best Documentary Feature Film':  { label: 'Documentary',          beltGlyph: 'og-statuette', categoryGlyph: 'og-newspaper' },
  'Best Documentary Short Film':    { label: 'Documentary Short',    beltGlyph: 'og-statuette', categoryGlyph: 'og-newspaper' },
  'Best Original Screenplay':       { label: 'Original Screenplay',  beltGlyph: 'og-statuette', categoryGlyph: 'og-writing' },
  'Best Adapted Screenplay':        { label: 'Adapted Screenplay',   beltGlyph: 'og-statuette', categoryGlyph: 'og-books' },
  'Best Cinematography':            { label: 'Cinematography',       beltGlyph: 'og-statuette', categoryGlyph: 'og-camera' },
  'Best Film Editing':              { label: 'Editing',              beltGlyph: 'og-statuette', categoryGlyph: 'og-scissors' },
  'Best Production Design':         { label: 'Production Design',     beltGlyph: 'og-statuette', categoryGlyph: 'og-snapshot' },
  'Best Costume Design':            { label: 'Costume Design',       beltGlyph: 'og-statuette', categoryGlyph: 'og-mask' },
  'Best Makeup and Hairstyling':    { label: 'Makeup & Hair',        beltGlyph: 'og-statuette', categoryGlyph: 'og-mask' },
  'Best Original Score':            { label: 'Original Score',       beltGlyph: 'og-statuette', categoryGlyph: 'og-music' },
  'Best Original Song':             { label: 'Original Song',         beltGlyph: 'og-statuette', categoryGlyph: 'og-mic' },
  'Best Sound':                     { label: 'Sound',                beltGlyph: 'og-statuette', categoryGlyph: 'og-speech' },
  'Best Sound Editing':             { label: 'Sound Editing',        beltGlyph: 'og-statuette', categoryGlyph: 'og-speech' },
  'Best Sound Mixing':              { label: 'Sound Mixing',         beltGlyph: 'og-statuette', categoryGlyph: 'og-speech' },
  'Best Visual Effects':            { label: 'Visual Effects',       beltGlyph: 'og-statuette', categoryGlyph: 'og-bolt' },
  'Best Casting':                   { label: 'Casting',              beltGlyph: 'og-statuette', categoryGlyph: 'og-handshake' },
  'Best Live Action Short Film':    { label: 'Live Action Short',    beltGlyph: 'og-statuette', categoryGlyph: 'og-film' }
};

// Person-led categories render flip tiles (front: portrait, back: poster).
// Oscar-only set; matches v1 category display_name. See renderFlipTile.
const PERSON_CATS = new Set([
  'Best Actor',
  'Best Actress',
  'Best Supporting Actor',
  'Best Supporting Actress',
  'Best Director'
]);

// ===== STATE =====
let currentFestival = 'oscar';
let currentYear = null;
let currentView = 'compact'; // 'compact' or 'detail'

// Festival classification — gates the "By the Numbers" hero slide (Added Jun 8 2026).
// Academy-style ceremonies have 20+ categories, so "most wins/noms" is meaningful.
// Jury festivals (cannes/venice/berlin) award single-winner prizes → stats slide
// suppressed for now; their carousel shows the editorial slide only.
const ACADEMY_STYLE = new Set(['oscar', 'bafta', 'gg']);

// Hero carousel runtime state. Single shared timer for the one-shot auto-rotate;
// cleared at the top of every renderHero so rapid year/festival navigation can't
// stack timers (no leaks).
let heroAutoTimer = null;

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

/* ============================================================
   FESTIVAL IDENTITY BANNER — Added Jun 21 2026
   Per-festival identity strip above the year browse: iconic glyph +
   accent-tinted name + "Est. · location · top prize" descriptor.
   Rebuilt on every festival switch (tab AND rail) from loadYearStrips().
   Facts verified against authoritative sources (Wikipedia / official
   festival sites), Jun 2026 — see RESUME report for the few nuances.
   ============================================================ */
const FESTIVAL_IDENTITY = {
  oscar:  { glyph: 'og-statuette', founded: 1929, location: 'Los Angeles, USA',   topPrize: 'Best Picture' },
  bafta:  { glyph: 'og-mask',      founded: 1949, location: 'London, UK',         topPrize: 'Best Film' },
  gg:     { glyph: 'og-globe',     founded: 1944, location: 'Beverly Hills, USA', topPrize: 'Best Motion Picture' },
  cannes: { glyph: 'og-palm',      founded: 1946, location: 'Cannes, France',     topPrize: "Palme d'Or" },
  venice: { glyph: 'og-lion',      founded: 1932, location: 'Venice, Italy',      topPrize: 'Golden Lion' },
  berlin: { glyph: 'og-bear',      founded: 1951, location: 'Berlin, Germany',    topPrize: 'Golden Bear' }
};

// Builds the per-festival identity banner into #festival-banner. The host gets
// data-festival so CSS resolves --fest-tint-rgb for the name (gg aliases the
// Globe colour → amber). Name reuses festivalDisplayName(); the glyph is baked
// gold for all festivals. All text interpolations escaped (Rule #12 / XSS).
function renderFestivalBanner(festival) {
  const host = document.getElementById('festival-banner');
  if (!host) return;
  const id = FESTIVAL_IDENTITY[festival];
  if (!id) { host.innerHTML = ''; host.removeAttribute('data-festival'); return; }
  const descriptor = `Est. ${id.founded} · ${id.location} · ${id.topPrize}`;
  host.dataset.festival = festival;
  host.innerHTML = `
    <div class="fest-banner">
      <span class="og ${id.glyph} fest-banner-glyph"></span>
      <div class="fest-banner-text">
        <div class="fest-banner-name">${escapeHtml(festivalDisplayName(festival))}</div>
        <div class="fest-banner-desc">${escapeHtml(descriptor)}</div>
      </div>
    </div>
  `;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  attachEventListeners();

  // Movie/People Cube init (guarded — scripts loaded in awards2.html). The
  // cubes self-inject their DOM; onPersonClick lets a MovieCube cast member
  // open the PeopleCube. Mirrors anchor-point / awards-browse wiring.
  if (typeof initMovieCube === 'function') {
    initMovieCube({
      onPersonClick: (personId) => {
        if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId, 10));
      }
    });
  }
  if (typeof initPeopleCube === 'function') initPeopleCube();

  attachFlipHandlers(); // delegated, once, on the stable categories container

  await initFromHash();   // opens a hash target if valid (sets currentView='detail')
  if (currentView === 'compact') { ensureFeaturedCarousel(); loadYearStrips(); }
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

/* ============================================================
   UNIVERSAL RENDERING HELPERS — Added Jun 8 2026 (Build A1)
   Every festival/year opens on COMPUTED data; editorial is an
   optional enhancement that overrides per field where authored.
   ============================================================ */

// Years present in a festival's loaded data, descending. Sourced from the v1
// ceremonies list; falls back to scanning the reshaped db.
function getFestivalYears(festival) {
  const raw = V1_RAW_CACHE[festival];
  let years = [];
  if (raw && Array.isArray(raw.ceremonies)) {
    years = raw.ceremonies.map(c => c.year).filter(y => Number.isInteger(y));
  }
  if (years.length === 0) {
    const db = V1_FESTIVAL_CACHE[festival] || {};
    const set = new Set();
    Object.values(db).forEach(byYear => Object.keys(byYear).forEach(y => set.add(parseInt(y, 10))));
    years = [...set];
  }
  return [...new Set(years)].filter(y => !isNaN(y)).sort((a, b) => b - a);
}

// Ceremony number for a festival/year (e.g. 97 for oscar-2025). Null for jury
// festivals (their v1 ceremonies carry ceremony_number: null).
function getCeremonyNumber(festival, year) {
  const raw = V1_RAW_CACHE[festival];
  if (!raw || !Array.isArray(raw.ceremonies)) return null;
  const c = raw.ceremonies.find(c => c.year === year);
  return c && c.ceremony_number ? c.ceremony_number : null;
}

// Computed headline fallback (used when no editorial.headline). A clear multi-win
// leader reads "{film} leads with {n} wins"; a single-prize leader shows the film
// title alone (avoids duplicating the ceremony line for jury festivals); no film
// at all → "{year} {Festival}".
function computedHeadline(stats, festival, year) {
  const top = stats && stats.mostWins;
  // Jury festivals (Cannes/Venice/Berlin): headline is the flagship film (top prize),
  // never "leads with N wins". featuredFilmFor falls back to most-wins internally if no flagship.
  if (!ACADEMY_STYLE.has(festival)) {
    const ff = featuredFilmFor(festival, year, stats);
    if (ff && ff.title) return ff.title;
  }
  if (top && top.count >= 2) return `${top.title} leads with ${top.count} wins`;
  if (top && top.title) return top.title;
  return `${year} ${festivalDisplayName(festival)}`;
}

// Computed strip stats (used when no editorial.stripStats). Only reliably
// derivable facts — ceremony ordinal (if present), category count, win count.
// Venue/host are editorial-only and intentionally omitted.
function computedStripStats(stats, festival, year) {
  const out = [];
  const cer = getCeremonyNumber(festival, year);
  if (cer) out.push(`${cer}${ordinalSuffix(cer)}`);
  if (stats) {
    out.push(`${stats.categories} categor${stats.categories === 1 ? 'y' : 'ies'}`);
    if (stats.mostWins && stats.mostWins.count >= 2) out.push(`${stats.mostWins.count} wins`);
  }
  return out;
}

// ===== YEAR STRIPS =====
async function loadYearStrips() {
  renderFestivalBanner(currentFestival);   // identity banner — refreshed on every switch
  const container = document.getElementById('year-strips-container');
  container.dataset.festival = currentFestival;   // drives per-festival .year-number tint
  container.innerHTML = '<div class="strip-loading">Loading ceremonies…</div>';

  const db = await loadV1FestivalData(currentFestival);

  // Strips now derive from DATA (every ceremony), editorial only enhancing.
  const years = db ? getFestivalYears(currentFestival) : [];

  if (years.length === 0) {
    container.innerHTML = `<div class="strip-empty">No data for ${escapeHtml(festivalDisplayName(currentFestival))} yet.</div>`;
    return;
  }

  container.innerHTML = years.map(year => {
    const editorial = AWARDS_YEAR_EDITORIAL[`${currentFestival}-${year}`];
    const stats = computeCeremonyStats(currentFestival, year);
    const headline = (editorial && editorial.headline) || computedHeadline(stats, currentFestival, year);
    const stripStats = (editorial && editorial.stripStats) || computedStripStats(stats, currentFestival, year);
    const statsHtml = stripStats.map(s =>
      `<span class="strip-stat">${escapeHtml(s)}</span>`
    ).join('');
    // Flagship film (jury) / top-winning film (Academy) drives the strip backdrop
    // (lazy-loaded below). Mirrors the hero so the two never disagree.
    const topTmdbId = ceremonyBackdropId(currentFestival, year, stats) || 0;
    return `
      <div class="year-strip" data-year="${year}">
        <div class="year-number">${year}</div>
        <div class="strip-visual" data-tmdb-id="${topTmdbId}"></div>
        <div class="strip-content">
          <div class="strip-headline">${escapeHtml(headline)}</div>
        </div>
        <div class="strip-stats">${statsHtml}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.year-strip').forEach(strip => {
    strip.addEventListener('click', () => {
      const year = parseInt(strip.dataset.year, 10);
      showYearDetail(year);
    });
  });

  // Lazy-load each strip's top-film backdrop (cached; shared with the hero).
  // Async — strips already rendered, images fill in without blocking or shifting.
  container.querySelectorAll('.strip-visual[data-tmdb-id]').forEach(el => {
    const id = parseInt(el.dataset.tmdbId, 10);
    if (id) loadStripBackdrop(id, el);
  });
}

// Paints a top-film backdrop into a .strip-visual box. Reuses getTmdbBackdropPath
// (sessionStorage-cached, same key as the hero). No backdrop on TMDB → leaves the
// CSS gradient empty-state in place (never the literal "Backdrop" text).
async function loadStripBackdrop(tmdbId, visualEl) {
  if (!tmdbId || !visualEl) return;
  const path = await getTmdbBackdropPath(tmdbId);
  if (!path || !visualEl.isConnected) return; // no image, or strip replaced by a festival switch
  const url = OrbitUtils.tmdbImageUrl(path, OrbitUtils.IMAGE_SIZES.BACKDROP);
  visualEl.style.backgroundImage = `url(${url})`;
  visualEl.classList.add('has-backdrop');
}

/* ============================================================
   FEATURED CEREMONY CAROUSEL — Added Jun 2026 (Home C)
   4-slide marquee at the top of the browse view: 3 curated ceremonies +
   the latest ceremony across all six festivals (resolved from the light
   index, no big up-front loads). Reuses the detail-hero film-led CSS, A1
   headline/ceremony helpers, getTmdbBackdropPath, and the same one-shot
   timer discipline (separate state). Auto-marches 1→last, then stops.
   ============================================================ */
const FEATURED_CEREMONIES = ['oscar-2024', 'cannes-2002', 'venice-2017']; // curated, swappable
const FEATURED_MARCH_MS = 5500;
let featuredTimer = null;
let featuredBuilt = false;

function clearFeaturedTimer() {
  if (featuredTimer) { clearTimeout(featuredTimer); featuredTimer = null; }
}

// Build the carousel exactly once (the slides are festival-agnostic, so a
// festival switch must NOT rebuild/re-march it).
function ensureFeaturedCarousel() {
  if (featuredBuilt) return;
  featuredBuilt = true;
  buildFeaturedCarousel();
}

// Resolve the most recent ceremony across festivals from the lightweight index
// (year_range.max). Tiebreak at equal max-year: first in index order (bafta
// before gg → bafta, whose Feb ceremony is also genuinely later than GG's Jan).
async function resolveLatestCeremony() {
  try {
    const idx = await fetch('../data/awards-v1-index.json').then(r => (r.ok ? r.json() : null));
    if (!idx || !idx.festivals) return null;
    let best = null;
    for (const [slug, info] of Object.entries(idx.festivals)) {
      const y = info.year_range && info.year_range.max;
      if (y != null && (!best || y > best.year)) best = { festival: slug, year: y };
    }
    return best;
  } catch (_) {
    return null; // curated-only fallback
  }
}

async function buildFeaturedCarousel() {
  const mount = document.getElementById('featured-carousel');
  if (!mount) return;

  const slides = FEATURED_CEREMONIES.map(key => {
    const dash = key.indexOf('-');
    return { festival: key.slice(0, dash), year: parseInt(key.slice(dash + 1), 10), kind: 'featured' };
  });
  const latest = await resolveLatestCeremony();
  if (latest) slides.push({ festival: latest.festival, year: latest.year, kind: 'latest' });

  // Slide shells render immediately; backdrop + headline fill in async (no block).
  mount.innerHTML = `
    <div class="featured-carousel-inner" data-slide="0">
      <div class="featured-track">
        ${slides.map((s, i) => `
          <div class="featured-slide${i === 0 ? ' is-active' : ''}" data-festival="${s.festival}" data-year="${s.year}" role="link" tabindex="0" aria-label="Open ${escapeHtml(festivalDisplayName(s.festival))} ${s.year}">
            <div class="hero-film-led">
              <div class="hero-backdrop"></div>
              <div class="hero-content">
                <div class="featured-eyebrow">${s.kind === 'latest' ? `Latest · ${s.year}` : '◆ Featured Ceremony'}</div>
                <div class="hero-ceremony" data-slot="ceremony">${escapeHtml(festivalDisplayName(s.festival))} · ${s.year}</div>
                <div class="hero-headline" data-slot="headline">&nbsp;</div>
              </div>
            </div>
          </div>`).join('')}
      </div>
      <div class="featured-dots">
        ${slides.map((s, i) => `<button class="featured-dot${i === 0 ? ' is-active' : ''}${s.kind === 'latest' ? ' is-latest' : ''}" type="button" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}
      </div>
    </div>`;

  const inner = mount.querySelector('.featured-carousel-inner');
  const slideEls = [...mount.querySelectorAll('.featured-slide')];

  slides.forEach((s, i) => populateFeaturedSlide(s, slideEls[i]));

  // Whole slide is the click target → opens that ceremony's detail page.
  slideEls.forEach(el => {
    const go = () => openCeremony(el.dataset.festival, parseInt(el.dataset.year, 10));
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  // Dots: manual jump cancels the march (mirrors the hero carousel's takeover).
  mount.querySelectorAll('.featured-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      inner.dataset.userControlled = '1';
      clearFeaturedTimer();
      setFeaturedSlide(inner, parseInt(dot.dataset.slide, 10));
    });
  });

  armFeaturedMarch(inner, slides.length);
}

// A festival's flagship/top award — its winner is the ceremony's iconic film
// (for jury festivals "most wins" misses this: the Palme/Lion winner often takes
// just one prize). Exact display_names per the v1 categories.
const FLAGSHIP_CATEGORY = {
  oscar:  'Best Picture',
  bafta:  'Best Film',
  gg:     'Best Motion Picture – Drama',
  cannes: "Palme d'Or",
  venice: 'Golden Lion',
  berlin: 'Golden Bear'
};

// The film to feature for a ceremony: the flagship-award winner if present,
// else the most-awarded film. Returns {title, tmdbId} or null.
function featuredFilmFor(festival, year, stats) {
  const db = V1_FESTIVAL_CACHE[festival];
  const flagName = FLAGSHIP_CATEGORY[festival];
  const slot = flagName && db && db[flagName] && db[flagName][String(year)];
  if (slot) {
    const winner = slot.winners ? slot.winners[0] : slot.winner;
    if (winner && winner.title) return { title: winner.title, tmdbId: winner.tmdb_id || 0 };
  }
  const top = stats && stats.mostWins;
  return top && top.title ? { title: top.title, tmdbId: top.tmdbId || 0 } : null;
}

// Backdrop tmdbId for a ceremony: flagship film for jury festivals, most-wins for
// Academy-style. Falls back to most-wins if no flagship. Mirrors the headline rule
// (computedHeadline) so hero + strips surface the same film and can't disagree.
function ceremonyBackdropId(festival, year, stats) {
  if (!ACADEMY_STYLE.has(festival)) {
    const ff = featuredFilmFor(festival, year, stats);
    if (ff && ff.tmdbId) return ff.tmdbId;
  }
  return (stats && stats.mostWins && stats.mostWins.tmdbId) ? stats.mostWins.tmdbId : null;
}

// Fill a slide's headline + ceremony line + backdrop (lazy per festival). No
// backdrop on TMDB → keep the gradient (typographic-ish) — never broken image.
async function populateFeaturedSlide(s, el) {
  if (!el) return;
  const db = await loadV1FestivalData(s.festival);
  if (!db || !el.isConnected) return; // curated-only graceful path
  const stats = computeCeremonyStats(s.festival, s.year);
  const film = featuredFilmFor(s.festival, s.year, stats); // flagship winner (or top-wins)
  const editorial = AWARDS_YEAR_EDITORIAL[`${s.festival}-${s.year}`];
  const headline = (editorial && editorial.headline) || (film && film.title) || computedHeadline(stats, s.festival, s.year);
  const cerNum = getCeremonyNumber(s.festival, s.year);
  const ceremony = cerNum
    ? `${cerNum}${ordinalSuffix(cerNum)} ${festivalDisplayName(s.festival)} · ${s.year}`
    : `${festivalDisplayName(s.festival)} · ${s.year}`;
  const hlEl = el.querySelector('[data-slot="headline"]');
  const cerEl = el.querySelector('[data-slot="ceremony"]');
  if (hlEl) hlEl.textContent = headline;
  if (cerEl) cerEl.textContent = ceremony;

  const tmdbId = (film && film.tmdbId) || 0;
  if (!tmdbId) { el.classList.add('featured-typographic'); return; }
  const path = await getTmdbBackdropPath(tmdbId);
  if (!el.isConnected) return;
  if (path) {
    const url = OrbitUtils.tmdbImageUrl(path, OrbitUtils.IMAGE_SIZES.BACKDROP);
    const bd = el.querySelector('.hero-backdrop');
    if (bd) bd.innerHTML = `<img src="${url}" alt="">`;
  } else {
    el.classList.add('featured-typographic'); // graceful: gradient, no broken image
  }
}

function setFeaturedSlide(inner, idx) {
  if (!inner) return;
  inner.dataset.slide = String(idx);
  inner.querySelectorAll('.featured-slide').forEach((s, i) => s.classList.toggle('is-active', i === idx));
  inner.querySelectorAll('.featured-dot').forEach((d, i) => d.classList.toggle('is-active', i === idx));
}

// One-shot march: advance 0→1→…→last on a timer, then STOP at the latest slide.
// Halts if the user took over, the carousel left the DOM, or browse isn't visible.
function armFeaturedMarch(inner, count) {
  clearFeaturedTimer();
  const compactVisible = () => {
    const cv = document.getElementById('compact-view');
    return cv && cv.style.display !== 'none';
  };
  const step = () => {
    featuredTimer = null;
    if (!inner || !inner.isConnected) return;
    if (inner.dataset.userControlled === '1') return;
    if (!compactVisible()) return;
    const cur = parseInt(inner.dataset.slide || '0', 10);
    const next = cur + 1;
    if (next > count - 1) return; // already at the latest → stop
    setFeaturedSlide(inner, next);
    if (next < count - 1) featuredTimer = setTimeout(step, FEATURED_MARCH_MS); // keep marching until last
  };
  featuredTimer = setTimeout(step, FEATURED_MARCH_MS);
}

// Open a ceremony detail from a featured slide (festival may differ from the
// browsed one). Cancels the march so no stale timer fires after navigation.
function openCeremony(festival, year) {
  clearFeaturedTimer();
  if (festival && festival !== currentFestival) {
    currentFestival = festival;
    syncFestivalActiveState(festival);
  }
  showYearDetail(year);
}

// ===== VIEW SWITCHING =====
function showCompactView() {
  clearHeroAutoTimer(); // no stray rotate firing into a hidden/replaced carousel
  currentView = 'compact';
  document.getElementById('compact-view').style.display = 'block';
  document.getElementById('year-detail-view').style.display = 'none';
  if (window.location.hash) {
    // Clear hash without triggering hashchange-driven re-entry.
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  ensureFeaturedCarousel(); // build once (e.g. when arriving here from a deep-link detail)
  window.scrollTo(0, 0);
}

async function showYearDetail(year) {
  clearFeaturedTimer(); // any route into a ceremony cancels the featured march
  currentView = 'detail';
  currentYear = year;

  document.getElementById('compact-view').style.display = 'none';
  document.getElementById('year-detail-view').style.display = 'block';

  const newHash = `#${currentFestival}-${year}`;
  if (window.location.hash !== newHash) {
    // pushState (not replace) so browser back-button returns to compact view.
    history.pushState({ festival: currentFestival, year }, '', newHash);
  }

  document.getElementById('year-detail-title').textContent =
    `${year} ${festivalDisplayName(currentFestival)}`;

  // Per-festival + per-year background tint hooks (Build B). #hero-container is
  // the single stable ancestor of both the hero and the stats slide, so one set
  // of attributes drives the wash for both. Overwritten each navigation (no
  // stale carry-over). Per-year angle is deterministic: same year → same angle.
  const heroEl = document.getElementById('hero-container');
  heroEl.setAttribute('data-festival', currentFestival);
  heroEl.setAttribute('data-year', String(year));
  heroEl.style.setProperty('--fest-angle', `${120 + (year % 12) * 5}deg`);

  renderHero(year);
  await renderCategories(year);   // await so trophy scroll-spy can observe real headings
  await renderTrophyStrip(year);
  initTrophyCarousel();
  window.scrollTo(0, 0);
}

// Opens a festival/year from the URL hash if it exists in the DATA (editorial
// optional). Async because it must load the festival's data to validate the year.
async function initFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const dash = hash.indexOf('-');
  if (dash < 1) return;
  const festival = hash.slice(0, dash);
  const year = parseInt(hash.slice(dash + 1), 10);
  if (!festival || !year) return;

  const db = await loadV1FestivalData(festival);
  if (!db || !getFestivalYears(festival).includes(year)) return; // invalid → stay in compact

  currentFestival = festival;
  syncFestivalActiveState(festival); // tabs + rail tiles
  showYearDetail(year);
}

/* ============================================================
   HERO CAROUSEL — "By the Numbers" — Added Jun 8 2026
   The hero is a 2-slide crossfade carousel:
     Slide 1 = editorial template (film-led / duel / typographic / portrait)
     Slide 2 = computed ceremony stats + standout + per-year highlight
   Auto-rotates ONCE (editorial → stats) after 8s, then manual-only via dots.
   Slide 2 is gated to ACADEMY_STYLE festivals; jury festivals show slide 1 only.
   Both slides stack in one CSS grid cell so the track height = the taller slide
   (no jump on rotate, responsive at every breakpoint). See heroAutoTimer.
   ============================================================ */
async function renderHero(year) {
  clearHeroAutoTimer();
  const container = document.getElementById('hero-container');
  const editorial = AWARDS_YEAR_EDITORIAL[`${currentFestival}-${year}`];

  // Capture the nav target so a stale async render (slow fetch) can't overwrite
  // a newer one or stomp the newer render's auto-rotate timer. Re-checked after
  // every await below.
  const fest = currentFestival, yr = year;
  const superseded = () => currentFestival !== fest || currentYear !== yr;

  // Always load data — both the stats slide and the computed hero need it.
  await loadV1FestivalData(fest);
  if (superseded()) return;
  const stats = computeCeremonyStats(fest, yr);

  // Hero model: editorial wins per-field; else compute. Computed = film-led on the
  // top-winning film's backdrop, or typographic if that film has no backdrop (so a
  // missing image never renders broken). Computed never fabricates deck prose.
  let hero = editorial;
  if (!hero) {
    const top = stats && stats.mostWins;
    let backdropTmdbId = ceremonyBackdropId(fest, yr, stats);
    let heroType = 'film-led';
    if (backdropTmdbId) {
      const path = await getTmdbBackdropPath(backdropTmdbId);
      if (superseded()) return;
      if (!path) { heroType = 'typographic'; backdropTmdbId = null; }
    } else {
      heroType = 'typographic';
    }
    hero = {
      heroType,
      ceremonyNumber: getCeremonyNumber(fest, yr),   // null for jury → ceremony line uses {year}
      headline: computedHeadline(stats, fest, yr),
      deckLine: '',
      backdropTmdbId,
      bestPicture: top ? top.title : '—',            // typographic meta-grid only
      host: '—'
    };
  }

  if (!hero) { container.innerHTML = ''; return; } // no editorial AND no data

  // Jury suppression unchanged: ACADEMY_STYLE only, and only when stats computed.
  const showStats = ACADEMY_STYLE.has(fest) && !!stats;
  const editorialHtml = buildEditorialHtml(hero, year);
  const statsHtml = showStats ? buildStatsHtml(stats, editorial || {}, year) : '';

  container.innerHTML = `
    <div class="hero-carousel" data-slide="0">
      <div class="hero-track">
        <div class="hero-slide hero-slide-editorial is-active">${editorialHtml}</div>
        ${showStats ? `<div class="hero-slide hero-slide-stats">${statsHtml}</div>` : ''}
      </div>
      ${showStats ? `
        <div class="hero-dots" role="tablist" aria-label="Hero slides">
          <button class="hero-dot is-active" type="button" data-slide="0" aria-label="Editorial"></button>
          <button class="hero-dot" type="button" data-slide="1" aria-label="By the numbers"></button>
        </div>` : ''}
    </div>
  `;

  // Backdrop (film-led only) — lazy TMDB fetch, sessionStorage-cached. Works for
  // editorial (authored id) AND computed (top-winning film id; path already cached
  // from the pre-check above, so this is instant for computed heroes).
  if (hero.heroType === 'film-led' && hero.backdropTmdbId) {
    const path = await getTmdbBackdropPath(hero.backdropTmdbId);
    if (superseded()) return; // navigation finished during the fetch
    if (path) {
      const url = OrbitUtils.tmdbImageUrl(path, OrbitUtils.IMAGE_SIZES.BACKDROP);
      const el = container.querySelector('.hero-backdrop');
      if (el) el.innerHTML = `<img src="${url}" alt="">`;
    }
  }

  if (showStats) {
    const carousel = container.querySelector('.hero-carousel');
    // Standout portrait via the shared loader (paints background-image; cached).
    const photo = container.querySelector('.stats-portrait-bg[data-person-id]');
    if (photo) loadPersonPortrait(parseInt(photo.dataset.personId, 10), photo);
    wireHeroDots(carousel);
    armHeroAutoRotate(carousel);
  }
}

// Editorial slide markup — the four existing hero templates, unchanged content.
function buildEditorialHtml(editorial, year) {
  if (editorial.heroType === 'film-led') {
    return `
      <div class="hero-film-led">
        <div class="hero-backdrop" data-backdrop-tmdb-id="${editorial.backdropTmdbId || ''}"></div>
        <div class="hero-content">
          <div class="hero-year">${year}</div>
          <div class="hero-ceremony">${editorial.ceremonyNumber
            ? `${editorial.ceremonyNumber}${ordinalSuffix(editorial.ceremonyNumber)} ${escapeHtml(festivalDisplayName(currentFestival))}`
            : `${year} ${escapeHtml(festivalDisplayName(currentFestival))}`}${editorial.venue ? ' · ' + escapeHtml(editorial.venue) : ''}</div>
          <div class="hero-headline">${escapeHtml(editorial.headline)}</div>
          <div class="hero-deck">${escapeHtml(editorial.deckLine || '')}</div>
        </div>
      </div>`;
  }
  if (editorial.heroType === 'duel') {
    return `
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
      </div>`;
  }
  if (editorial.heroType === 'typographic') {
    return `
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
      </div>`;
  }
  if (editorial.heroType === 'portrait') {
    return `
      <div class="hero-portrait">
        <div class="portrait-image"></div>
        <div class="portrait-content">
          <div class="hero-tag">${escapeHtml(editorial.tag || 'Spotlight')}</div>
          <div class="hero-year">${year}</div>
          <div class="hero-headline">${escapeHtml(editorial.headline || '')}</div>
          <div class="hero-deck">${escapeHtml(editorial.deckLine || '')}</div>
        </div>
      </div>`;
  }
  return '';
}

// ===== BY THE NUMBERS — computed stats =====
// Counts wins/noms per film from the already-loaded reshaped DB (db[cat][year]).
// NO new fetch (Rule #27). Tie-break: count DESC, then title ASC (deterministic).
function computeCeremonyStats(festival, year) {
  const db = V1_FESTIVAL_CACHE[festival];
  if (!db) return null;
  const yearStr = String(year);

  const winCounts = {};   // title → win count
  const nomCounts = {};   // title → total nomination count (wins + losses)
  const tmdbOf = {};      // title → tmdb_id (first seen)
  let categories = 0;

  Object.keys(db).forEach(catName => {
    const slot = db[catName] && db[catName][yearStr];
    if (!slot) return;
    categories++;
    const winners = slot.winners ? slot.winners : (slot.winner ? [slot.winner] : []);
    const nominees = slot.nominees || [];
    [...winners, ...nominees].forEach(e => {
      if (!e) return;
      const t = e.title || 'Unknown';
      nomCounts[t] = (nomCounts[t] || 0) + 1;
      if (!(t in tmdbOf)) tmdbOf[t] = e.tmdb_id || 0;
    });
    winners.forEach(e => {
      if (!e) return;
      const t = e.title || 'Unknown';
      winCounts[t] = (winCounts[t] || 0) + 1;
    });
  });

  if (categories === 0) return null;

  const byCountThenTitle = (counts) => Object.keys(counts)
    .map(t => ({ title: t, count: counts[t] }))
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))[0] || null;

  const mwTop = byCountThenTitle(winCounts);
  const mnTop = byCountThenTitle(nomCounts);

  return {
    mostWins: mwTop ? { title: mwTop.title, tmdbId: tmdbOf[mwTop.title], count: mwTop.count } : null,
    mostNoms: mnTop ? { title: mnTop.title, tmdbId: tmdbOf[mnTop.title], count: mnTop.count, winCount: winCounts[mnTop.title] || 0 } : null,
    categories
  };
}

// N statuette glyphs; first `goldCount` gold, the rest silver (= nomination losses).
// Reuses the trophy belt's og-statuette; gold/silver recolor lives in awards2.css.
// A flex line-break is inserted at the gold→silver boundary so the silver losses
// wrap onto their own line BENEATH the gold wins (only when both colours exist).
function renderGlyphRow(total, goldCount, glyph) {
  glyph = glyph || 'og-statuette';
  let html = '';
  for (let i = 0; i < total; i++) {
    if (i === goldCount && goldCount > 0 && goldCount < total) {
      html += '<span class="glyph-break"></span>';
    }
    const cls = i < goldCount ? 'stat-glyph' : 'stat-glyph silver';
    html += `<span class="og ${glyph} ${cls}"></span>`;
  }
  return html;
}

/* ============================================================
   FIRST/LAST-AWARDED HIGHLIGHT — Added Jun 8 2026 (Build A2)
   Computed fallback for the stats-slide highlight slot when no editorial
   highlight is authored: did any category make its FIRST or LAST appearance
   this year? Only ever runs on the stats slide → ACADEMY_STYLE festivals only
   (jury festivals never render it; the Cannes-2020 gap is therefore moot).
   Windowed by the 2000 dataset floor: a "first" needs year > earliest, a
   "last" needs year < latest — we can't see beyond our window.
   ============================================================ */

// {categoryName: [sorted years it appears]} per festival, from the already-
// reshaped db (no fetch). Cached alongside the festival data caches.
const CAT_YEARS_CACHE = {};
function getCategoryYears(festival) {
  if (CAT_YEARS_CACHE[festival]) return CAT_YEARS_CACHE[festival];
  const db = V1_FESTIVAL_CACHE[festival];
  if (!db) return {};
  const map = {};
  Object.keys(db).forEach(cat => {
    map[cat] = Object.keys(db[cat]).map(Number).filter(y => !isNaN(y)).sort((a, b) => a - b);
  });
  CAT_YEARS_CACHE[festival] = map;
  return map;
}

// Returns {label, value, detail} (same shape as editorial.highlight) or null.
// Tie rule: a FIRST event beats a LAST event (a debut outranks a discontinuation),
// then alphabetical by category name — deterministic.
function computeFirstLastHighlight(festival, year) {
  const db = V1_FESTIVAL_CACHE[festival];
  if (!db) return null;
  const years = getFestivalYears(festival);
  if (years.length === 0) return null;
  const earliest = years[years.length - 1];
  const latest = years[0];
  const catYears = getCategoryYears(festival);
  const yearStr = String(year);

  const events = [];
  Object.keys(db).forEach(cat => {
    if (!db[cat][yearStr]) return;            // category not contested this year
    const ys = catYears[cat];
    if (!ys || ys.length === 0) return;
    const first = ys[0], last = ys[ys.length - 1];
    if (first === year && year > earliest) events.push({ type: 'first', cat });
    else if (last === year && year < latest) events.push({ type: 'last', cat });
  });
  if (events.length === 0) return null;

  events.sort((a, b) =>
    (a.type !== b.type) ? (a.type === 'first' ? -1 : 1) : a.cat.localeCompare(b.cat));
  const ev = events[0];
  return ev.type === 'first'
    ? { label: 'New this year', value: ev.cat, detail: 'first awarded' }
    : { label: 'Final year',   value: ev.cat, detail: 'last awarded' };
}

// Stats slide markup — "Calm Stack" layout (rebuilt Jun 8 2026).
// Left = stacked stat rows (even vertical rhythm); right = rectangular portrait
// tile (NO circle). Computed values, glyph logic, and gating are unchanged —
// only the markup they populate. Graceful degradation: standout collapses the
// grid to a single column; highlight omits cleanly from the bottom row.
function buildStatsHtml(stats, editorial, year) {
  const mw = stats.mostWins;
  const mn = stats.mostNoms;
  const standout = editorial.standout;
  // Highlight slot: editorial wins; else computed first/last; else omitted.
  const highlight = editorial.highlight
    || computeFirstLastHighlight(currentFestival, year)
    || null;

  const winsRow = mw ? `
    <div class="stat-row">
      <span class="stat-num gold">${mw.count}</span>
      <div class="stat-body">
        <span class="stat-label">Most wins · ${escapeHtml(mw.title)}</span>
        <div class="glyph-row">${renderGlyphRow(mw.count, mw.count, (FESTIVAL_IDENTITY[currentFestival] && FESTIVAL_IDENTITY[currentFestival].glyph) || 'og-statuette')}</div>
      </div>
    </div>` : '';

  const nomsRow = mn ? `
    <div class="stat-row">
      <span class="stat-num cyan">${mn.count}</span>
      <div class="stat-body">
        <span class="stat-label">Most nominations · ${escapeHtml(mn.title)}</span>
        <div class="glyph-row">${renderGlyphRow(mn.count, mn.winCount, (FESTIVAL_IDENTITY[currentFestival] && FESTIVAL_IDENTITY[currentFestival].glyph) || 'og-statuette')}</div>
      </div>
    </div>` : '';

  const highlightBlock = highlight ? `
    <div class="stat-highlight">
      <span class="highlight-label">${escapeHtml(highlight.label || 'Highlight')}</span>
      <div class="highlight-value">${escapeHtml(highlight.value || '')}<span class="highlight-detail"> · ${escapeHtml(highlight.detail || '')}</span></div>
    </div>` : '';

  const portrait = standout ? `
    <div class="stats-portrait">
      <div class="stats-portrait-bg" data-person-id="${standout.personId}"></div>
      <div class="stats-portrait-gradient"></div>
      <div class="stats-portrait-text">
        <div class="standout-label">Standout</div>
        <div class="standout-name">${escapeHtml(standout.name || '')}</div>
        <div class="standout-award">${escapeHtml(standout.award || '')}</div>
      </div>
    </div>` : '';

  return `
    <div class="stats-slide${portrait ? '' : ' no-standout'}">
      <div class="stats-main">
        <div class="stats-title">${year} · By the Numbers</div>
        <div class="stats-body">
          <div class="stats-mid">
            ${winsRow}
            ${nomsRow}
          </div>
          <div class="stat-bottom">
            <div class="stat-mini">
              <span class="stat-num-sm purple">${stats.categories}</span>
              <span class="stat-label">categories</span>
            </div>
            ${highlightBlock}
          </div>
        </div>
      </div>
      ${portrait}
    </div>`;
}

// ===== HERO CAROUSEL CONTROLS =====
function clearHeroAutoTimer() {
  if (heroAutoTimer) { clearTimeout(heroAutoTimer); heroAutoTimer = null; }
}

function setHeroSlide(carousel, idx) {
  if (!carousel) return;
  carousel.dataset.slide = String(idx);
  carousel.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('is-active', i === idx));
  carousel.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('is-active', i === idx));
}

// One-shot auto-rotate: editorial → stats after 8s, then never again.
function armHeroAutoRotate(carousel) {
  clearHeroAutoTimer();
  heroAutoTimer = setTimeout(() => {
    heroAutoTimer = null;
    if (!carousel || !carousel.isConnected) return;      // navigated away
    if (carousel.dataset.userControlled === '1') return; // user already took over
    setHeroSlide(carousel, 1);
  }, 8000);
}

// Dots switch slides manually; the first manual interaction also cancels the
// pending one-shot auto-rotate so it can't fight the user.
function wireHeroDots(carousel) {
  carousel.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      carousel.dataset.userControlled = '1';
      clearHeroAutoTimer();
      setHeroSlide(carousel, parseInt(dot.dataset.slide, 10));
    });
  });
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

  // Person categories → flip tiles when the entry has both a person and a
  // poster; otherwise fall back to the simple movie tile (keeps no-poster /
  // no-person nominees graceful). Non-person categories are unchanged.
  const tileFor = (entry, isWinner, catName) => {
    if (PERSON_CATS.has(catName) && entry && entry.person_id && entry.poster_path) {
      return renderFlipTile(entry, catName, isWinner);
    }
    return renderSimpleTile(entry, isWinner);
  };

  container.innerHTML = yearCategories.map(({ name, slot }) => {
    const winners = slot.winners ? slot.winners : (slot.winner ? [slot.winner] : []);
    const nominees = slot.nominees || [];
    const tiles = [
      ...winners.map(w => tileFor(w, true, name)),
      ...nominees.map(n => tileFor(n, false, name))
    ].join('');
    return `
      <section class="category-section">
        <h2 class="category-header" data-category-id="${escapeHtml(name)}">${escapeHtml(name)}</h2>
        <div class="category-grid">${tiles}</div>
      </section>
    `;
  }).join('');

  // Lazy-load portraits for any flip-tile fronts just rendered.
  container.querySelectorAll('.person-bg[data-person-id]').forEach(bg => {
    loadPersonPortrait(parseInt(bg.dataset.personId, 10), bg);
  });
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

  // Belt mark is the current festival's identity glyph, uniform across every
  // chip (the per-category icon stays on the hover label). Computed once.
  const festGlyph = (FESTIVAL_IDENTITY[currentFestival] && FESTIVAL_IDENTITY[currentFestival].glyph) || 'og-statuette';

  const itemHtml = (name) => {
    const g = AWARD_GLYPH_MAP[name]
      || { label: name, beltGlyph: 'og-statuette', categoryGlyph: 'og-trophy' };
    return `
      <div class="trophy-item" data-category="${escapeHtml(name)}" role="link" tabindex="0" title="${escapeHtml(g.label)}">
        <span class="trophy-hover-label">
          <span class="og ${g.categoryGlyph}"></span>
          <span class="trophy-hover-text">${escapeHtml(g.label)}</span>
        </span>
        <span class="trophy-icon"><span class="og ${festGlyph}"></span></span>
        <span class="trophy-label">${escapeHtml(g.label)}</span>
      </div>`;
  };

  const baseHtml = categories.map(itemHtml).join('');
  carousel.innerHTML = baseHtml;
  strip.hidden = false;

  // Seamless bidirectional loop: only when items overflow. Render the set
  // three times and park the viewport in the middle copy, so the user has a
  // full set of buffer on BOTH sides. The scroll listener recenters before
  // either edge is reached (see initTrophyCarousel). Measure after layout.
  requestAnimationFrame(() => {
    if (carousel.scrollWidth > carousel.clientWidth + 4) {
      carousel.insertAdjacentHTML('beforeend', baseHtml + baseHtml); // 3 copies total
      const items = carousel.querySelectorAll('.trophy-item');
      const n = items.length / 3;
      // Period of one set incl. the inter-copy flex gap (exact, avoids seam drift).
      trophyLoopWidth = items[n].offsetLeft - items[0].offsetLeft;
      carousel.scrollLeft = trophyLoopWidth; // start in the middle copy
    } else {
      trophyLoopWidth = 0;
    }
    attachTrophyItemHandlers(carousel);
    updateLabelVisibility(); // sync clip state for the freshly rendered belt
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

// Smart label clipping — Added Jun 7 2026.
// Hides a belt label while its item is partially past either visible edge of
// the carousel, so no half-cut text shows under the floating arrows. Toggles a
// `.clipped` class (NOT inline opacity) so the cascade — not an inline style —
// arbitrates with the :hover fade. Opacity-only, so no reflow. The 0.5px
// tolerance absorbs sub-pixel rounding so edge items don't flicker.
function updateLabelVisibility() {
  const carousel = document.getElementById('trophy-carousel');
  if (!carousel) return;
  const cr = carousel.getBoundingClientRect();
  carousel.querySelectorAll('.trophy-item').forEach(item => {
    const r = item.getBoundingClientRect();
    const fullyVisible = r.left >= cr.left - 0.5 && r.right <= cr.right + 0.5;
    item.classList.toggle('clipped', !fullyVisible);
  });
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

  // Bidirectional seamless wrap: keep the scroll position within the middle
  // band [0.5W, 1.5W]. Crossing either side jumps by exactly one set width W
  // to the identical position in an adjacent copy. Direct scrollLeft writes are
  // instant (unaffected by scroll-behavior), so the jump is invisible.
  carousel.addEventListener('scroll', () => {
    const W = trophyLoopWidth;
    if (!W) return;
    const p = carousel.scrollLeft;
    if (p < W * 0.5) carousel.scrollLeft = p + W;
    else if (p > W * 1.5) carousel.scrollLeft = p - W;
  });

  // Smart label clipping, rAF-batched so a scroll burst recomputes once/frame.
  let labelRaf = null;
  const scheduleLabelUpdate = () => {
    if (labelRaf) return;
    labelRaf = requestAnimationFrame(() => { labelRaf = null; updateLabelVisibility(); });
  };
  carousel.addEventListener('scroll', scheduleLabelUpdate);
  scheduleLabelUpdate(); // initial frame

  /* --- Pointer drag-to-scroll (desktop) — Added Jun 7 2026 ---
     Touch is intentionally left to native overflow-x scrolling (smooth +
     momentum); only mouse needs help here. Uses an INCREMENTAL per-frame delta
     (scrollLeft -= dx) rather than an absolute anchor, so the seamless-loop
     scroll listener above (which jumps scrollLeft by ±W) is never fought —
     each frame just nudges from wherever scrollLeft currently sits. dragDist
     accumulates total travel so the capture-phase click handler can swallow
     the trophy-item click-to-scroll that would otherwise fire when a drag
     ends over an item. The `dragging` class drives cursor/user-select. */
  let isDragging = false;
  let dragMoved = false;
  let lastX = 0;
  let dragDist = 0;

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('dragging');
  };

  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragMoved = false;
    dragDist = 0;
    lastX = e.pageX;
    carousel.classList.add('dragging');
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // suppress text selection while dragging
    const dx = e.pageX - lastX;
    lastX = e.pageX;
    dragDist += Math.abs(dx);
    if (dragDist > 4) dragMoved = true;
    carousel.scrollLeft -= dx * 1.5; // 1.5x for a snappier feel
  });

  carousel.addEventListener('mouseleave', endDrag);
  carousel.addEventListener('mouseup', endDrag);

  // Swallow the click that trails a real drag so it doesn't jump to a category.
  carousel.addEventListener('click', (e) => {
    if (!dragMoved) return;
    e.preventDefault();
    e.stopPropagation();
    dragMoved = false;
  }, true);
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
  const label = isWinner ? 'WINNER' : 'NOMINEE';
  const statusClass = isWinner ? 'is-winner' : 'is-nominee';
  // Title/person are OVERLAID on the 2:3 poster (mirrors the flip-tile front
  // face), so every movie tile is a pure 2:3 card identical in height to the
  // person flip cards — no variable below-poster info block that previously
  // stretched some tiles taller than others (Rule #14 alignment, Jun 8 2026).
  // Wrapper carries the status class + the shared award bar; click target stays
  // the inner .tile (the overlay is pointer-events:none, so clicks fall through).
  return `
    <div class="tile-card ${statusClass}">
      <div class="award-toptab">${label}</div>
      <div class="tile ${isWinner ? 'winner' : 'nominee'} ${currentFestival}" data-tmdb-id="${entry.tmdb_id || 0}">
        <div class="tile-poster">
          ${posterInner}
          <div class="tile-overlay">
            <div class="tile-title">${escapeHtml(entry.title || 'Unknown')}</div>
            ${personLine}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   PERSON↔MOVIE FLIP TILES — Added Jun 7 2026
   Front = person portrait, back = movie poster. Click the tile body
   to flip (.flipped class); the per-face "View" button opens the
   People/Movie Cube. Portraits lazy-load via OrbitUtils.tmdbFetch and
   cache in sessionStorage (orbit_person_portrait_{id}, 'none' sentinel).
   ============================================================ */

// Category → role token (drives role-tag colour + glow). Supporting roles
// share the base actor/actress colour. Anything else falls back to director.
function getPersonTileRole(category) {
  if (/Actress/.test(category)) return 'actress';
  if (/Actor/.test(category)) return 'actor';
  return 'director';
}

function renderFlipTile(entry, category, isWinner) {
  const role = getPersonTileRole(category);
  const label = isWinner ? 'WINNER' : 'NOMINEE';
  const statusClass = isWinner ? 'is-winner' : 'is-nominee';
  const posterSrc = entry.poster_path
    ? OrbitUtils.tmdbImageUrl(entry.poster_path, OrbitUtils.IMAGE_SIZES.POSTER_LG)
    : '';
  return `
    <div class="flip-tile glow-${role} ${statusClass}" data-tmdb-id="${entry.tmdb_id}" data-person-id="${entry.person_id}">
      <!-- TOP BAR: winner/nominee, shared with simple tiles (sibling of .flip-inner). -->
      <div class="award-toptab">${label}</div>
      <div class="flip-inner">
        <!-- FRONT: person (surface = portrait + name/film + role tag) -->
        <div class="flip-face flip-front">
          <div class="person-bg" data-person-id="${entry.person_id}"></div>
          <div class="person-gradient"></div>
          <div class="role-tag ${role}">${role}</div>
          <div class="person-content">
            <div class="person-name">${escapeHtml(entry.person_name || '')}</div>
            <div class="person-film">${escapeHtml(entry.title || '')}</div>
          </div>
        </div>
        <!-- BACK: movie (surface = poster only) -->
        <div class="flip-face flip-back">
          <img src="${posterSrc}" loading="lazy" alt="${escapeHtml(entry.title || '')}" onerror="this.style.display='none'">
        </div>
      </div>
      <!-- FLAP: hangs below the card. CSS shows the face-appropriate button
           (person-up → right, movie-up → left); fade sequenced via .flap-hidden. -->
      <div class="flip-flap">
        <button class="flap-btn flap-person" type="button" data-action="view-person" data-person-id="${entry.person_id}">View person</button>
        <button class="flap-btn flap-film" type="button" data-action="view-film" data-tmdb-id="${entry.tmdb_id}">View film</button>
      </div>
    </div>
  `;
}

// Portrait lazy loader (OrbitUtils.tmdbFetch; sessionStorage-cached per Rule #28).
async function loadPersonPortrait(personId, bgEl) {
  if (!personId || !bgEl) return;
  const cacheKey = `orbit_person_portrait_${personId}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached === 'none') return;
  if (cached) { bgEl.style.backgroundImage = `url(${cached})`; return; }

  try {
    const data = await OrbitUtils.tmdbFetch(`/person/${personId}`);
    if (data && data.profile_path) {
      const url = OrbitUtils.tmdbImageUrl(data.profile_path, OrbitUtils.IMAGE_SIZES.PROFILE_MD);
      bgEl.style.backgroundImage = `url(${url})`;
      try { sessionStorage.setItem(cacheKey, url); } catch (_) {}
    } else {
      try { sessionStorage.setItem(cacheKey, 'none'); } catch (_) {}
    }
  } catch (err) {
    console.warn('[awards2] portrait fetch failed:', personId, err);
  }
}

// Flip + Cube-button delegation. Attached once to the stable #categories-container
// (its innerHTML is replaced per year, but the element itself persists), so no
// listener stacking across year navigation.
let flipHandlersAttached = false;
function attachFlipHandlers() {
  if (flipHandlersAttached) return;
  const container = document.getElementById('categories-container');
  if (!container) return;
  flipHandlersAttached = true;

  container.addEventListener('click', (e) => {
    // 1+2. Flap buttons (most specific — check first). Flap is a child of
    // .flip-tile, so we must intercept before the flip branch below.
    const viewBtn = e.target.closest('.flap-btn');
    if (viewBtn) {
      e.stopPropagation(); // never flip when a View button is pressed
      const action = viewBtn.dataset.action;
      if (action === 'view-person' && typeof openPeopleCube === 'function') {
        openPeopleCube(parseInt(viewBtn.dataset.personId, 10));
      } else if (action === 'view-film' && typeof openMovieCube === 'function') {
        openMovieCube(parseInt(viewBtn.dataset.tmdbId, 10));
      }
      return;
    }

    // 3. Flip tile body → sequenced flip: fade current flap out, flip the card
    // (0.55s, matches .flip-inner transition), then fade the opposite flap in.
    const flipTile = e.target.closest('.flip-tile');
    if (flipTile) {
      flipTile.classList.add('flap-hidden');   // fade current flap out
      flipTile.classList.toggle('flipped');    // begin the 0.55s flip
      setTimeout(() => flipTile.classList.remove('flap-hidden'), 550); // fade new flap in on land
      return;
    }

    // 4. Simple movie tile → open MovieCube (guard 0 = person-only fallback).
    const simpleTile = e.target.closest('.tile');
    if (simpleTile) {
      const id = parseInt(simpleTile.dataset.tmdbId, 10);
      if (id && typeof openMovieCube === 'function') openMovieCube(id);
    }
  });
}

// Keep BOTH the festival tabs and the Home-B quick-entry rail in sync — one
// active marker source for both (used by switchFestival + initFromHash).
function syncFestivalActiveState(festival) {
  document.querySelectorAll('.festival-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.festival === festival));
  document.querySelectorAll('.fest-tile').forEach(t =>
    t.classList.toggle('active', t.dataset.festival === festival));
}

// Single festival-switch path, shared by the tabs AND the rail tiles (no
// duplicated switching logic). No-op when already on that festival.
function switchFestival(festival) {
  if (!festival || festival === currentFestival) return;
  currentFestival = festival;
  syncFestivalActiveState(festival);
  showCompactView();   // always return to the browse view when switching
  loadYearStrips();
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

  // Festival tabs AND the quick-entry rail tiles → the same switchFestival path.
  document.querySelectorAll('.festival-tab, .fest-tile').forEach(el => {
    el.addEventListener('click', () => switchFestival(el.dataset.festival));
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
