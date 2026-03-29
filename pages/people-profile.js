// ============================================
// ORBIT - People Profile Page
// Rich profile view for actors, directors, etc.
// ============================================

(function() {
  'use strict';

  const CACHE_KEY = 'orbit_people_profiles_v3';
  const CACHE_MAX = 100;
  const CACHE_DAYS = 30;
  const INITIAL_FILMS = 20;
  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23111827' width='150' height='150' rx='75'/%3E%3Ccircle cx='75' cy='55' r='30' fill='%2364748b'/%3E%3Cellipse cx='75' cy='130' rx='45' ry='40' fill='%2364748b'/%3E%3C/svg%3E";

  // TMDB genre ID → name mapping
  const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  // Genre → CSS class suffix
  const GENRE_CLASS = {
    'Action': 'action', 'Adventure': 'adventure', 'Animation': 'animation',
    'Comedy': 'comedy', 'Crime': 'crime', 'Documentary': 'documentary',
    'Drama': 'drama', 'Family': 'family', 'Fantasy': 'fantasy',
    'History': 'history', 'Horror': 'horror', 'Music': 'music',
    'Mystery': 'mystery', 'Romance': 'romance', 'Sci-Fi': 'sci-fi',
    'Thriller': 'thriller', 'War': 'war', 'Western': 'western'
  };

  let personId = null;
  let profileData = null;
  let allFilms = [];
  let currentSort = 'year';
  let showingAll = false;

  // Tooltip state
  let collabTooltipTimer = null;
  let activeCollabTooltip = null;
  let collabFilmMapRef = {};
  let tooltipsBound = false;
  const isTouchDevice = matchMedia('(hover: none)').matches;

  // Selection mode state
  let selectedCollaborators = new Map(); // id → { id, name, profile_path }

  // Gallery state
  let galleryPhotos = [];
  let lightboxIndex = 0;

  // Pill nav state
  let scrollSpyObserver = null;

  // Section reorder
  const SECTION_ORDER_KEY = 'orbit_profile_section_order';
  const DEFAULT_SECTION_ORDER = [
    'ppSignatureRoles', 'ppCareerArc', 'ppDna', 'ppBoxOffice',
    'ppConnections', 'ppAwards', 'ppNebula', 'ppDidYouKnow',
    'ppPhotoGallery', 'ppSimilarActors', 'ppFilmography'
  ];

  // ── DOM Cache ──

  const $ = id => document.getElementById(id);

  // ── Init ──

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    personId = getPersonId();
    if (!personId) {
      showError("This person doesn't exist in our database.", true);
      return;
    }

    initMovieCubeComponent();
    if (typeof initPeopleCube === 'function') initPeopleCube();
    setupBackNav();
    setupEventListeners();
    loadProfile();
  }

  function getPersonId() {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id');
    if (urlId && !isNaN(urlId)) return parseInt(urlId);
    const stored = localStorage.getItem('orbit_profile_person_id');
    if (stored && !isNaN(stored)) return parseInt(stored);
    return null;
  }

  function navigateToSacredTimeline(id, name) {
    // Clear stale vennPeople so Sacred Timeline doesn't restore old session
    localStorage.removeItem('vennPeople');
    localStorage.setItem('timelineMovieId', String(id));
    localStorage.setItem('timelineType', 'person');
    localStorage.setItem('timelineMediaMode', 'both');
    localStorage.setItem('returnToProfile', String(id));
    // Pass URL params so Sacred Timeline uses loadFromUrlSearch (bypasses stale localStorage)
    var encodedName = encodeURIComponent(name || '');
    window.location.href = 'timeline.html?type=person&search=' + encodedName;
  }

  function setupBackNav() {
    const backLink = $('ppBackLink');
    if (!backLink) return;
    const referrer = sessionStorage.getItem('orbit_profile_referrer') || '';
    if (referrer.includes('people-library.html')) {
      backLink.textContent = '\u2190 Back to The Observatory';
      backLink.href = 'people-library.html';
    } else if (referrer.includes('timeline.html')) {
      backLink.textContent = '\u2190 Back to Timeline';
      backLink.href = '#';
      backLink.addEventListener('click', (e) => { e.preventDefault(); history.back(); });
    } else if (referrer) {
      backLink.textContent = '\u2190 Back';
      backLink.href = '#';
      backLink.addEventListener('click', (e) => { e.preventDefault(); history.back(); });
    } else {
      backLink.textContent = '\u2190 The Observatory';
      backLink.href = 'people-library.html';
    }
  }

  function initMovieCubeComponent() {
    if (typeof initMovieCube === 'function') {
      initMovieCube({
        onPersonClick: (id) => {
          if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(id));
        },
        onAnchorClick: (movie) => {
          localStorage.setItem('anchorMovie', JSON.stringify(movie));
          localStorage.removeItem('anchorFromResults');
          window.location.href = '../games/constellation.html';
        }
      });
    }
  }

  function setupEventListeners() {
    $('ppRetryBtn')?.addEventListener('click', () => {
      $('ppError').classList.add('hidden');
      $('ppContent').classList.remove('hidden');
      loadProfile();
    });

    $('ppBookmarkBtn')?.addEventListener('click', toggleBookmark);

    // Sort buttons
    document.querySelectorAll('.pp-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pp-sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderFilmography();
      });
    });

    $('ppShowAll')?.addEventListener('click', () => {
      showingAll = true;
      renderFilmography();
      $('ppShowAll').classList.add('hidden');
    });

    // Share button
    $('ppShareBtn')?.addEventListener('click', shareProfile);

    // People Cube button
    $('ppCubeBtn')?.addEventListener('click', () => {
      if (typeof openPeopleCube === 'function' && personId) {
        openPeopleCube(personId);
      }
    });

    // Navigation buttons
    $('exploreOrbitBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `people-library.html?circle=${personId}`;
    });

    $('viewTimelineBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSacredTimeline(personId, profileData?.person?.name);
    });

    // Selection bar actions
    $('ppSelectionLaunch')?.addEventListener('click', () => launchSharedTimeline());
    $('ppSelectionVenn')?.addEventListener('click', () => launchStellarTerritories());
    $('ppSelectionCancel')?.addEventListener('click', () => clearAllSelections());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close lightbox first
        const lightbox = $('ppLightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
          closeLightbox();
          return;
        }

        // Let moviecube handle its own escape first
        const cubeOverlay = document.getElementById('movieCubeOverlay');
        if (cubeOverlay && !cubeOverlay.hidden) return;

        // Clear selections if any
        if (selectedCollaborators.size > 0) {
          clearAllSelections();
          return;
        }

        window.location.href = 'people-library.html';
      }

      // Arrow keys for lightbox
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const lightbox = $('ppLightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
          if (e.key === 'ArrowLeft' && lightboxIndex > 0) { lightboxIndex--; updateLightboxImage(); }
          if (e.key === 'ArrowRight' && lightboxIndex < galleryPhotos.length - 1) { lightboxIndex++; updateLightboxImage(); }
        }
      }
    });

    // Lightbox controls
    $('ppLightboxClose')?.addEventListener('click', closeLightbox);
    $('ppLightbox')?.querySelector('.pp-lightbox-backdrop')?.addEventListener('click', closeLightbox);
    $('ppLightboxPrev')?.addEventListener('click', () => { if (lightboxIndex > 0) { lightboxIndex--; updateLightboxImage(); } });
    $('ppLightboxNext')?.addEventListener('click', () => { if (lightboxIndex < galleryPhotos.length - 1) { lightboxIndex++; updateLightboxImage(); } });

    // Lightbox swipe (mobile)
    const lbWrap = $('ppLightbox');
    if (lbWrap) {
      let touchStartX = 0;
      lbWrap.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
      lbWrap.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
          if (dx < 0 && lightboxIndex < galleryPhotos.length - 1) { lightboxIndex++; updateLightboxImage(); }
          if (dx > 0 && lightboxIndex > 0) { lightboxIndex--; updateLightboxImage(); }
        }
      }, { passive: true });
    }
  }

  // ── Data Loading ──

  async function loadProfile() {
    const cached = getCachedProfile(personId);
    if (cached) {
      profileData = cached;
      renderAll();
      return;
    }

    try {
      const [personRes, creditsRes, imagesRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/person/${personId}/images?api_key=${TMDB_API_KEY}`)
          .then(r => r.ok ? r.json() : { profiles: [] })
          .catch(() => ({ profiles: [] }))
      ]);

      if (!personRes.ok) {
        if (personRes.status === 404) {
          showError("This person doesn't exist in our database.", true);
        } else {
          showError("Unable to load profile. Please try again.");
        }
        return;
      }

      const person = await personRes.json();
      const credits = await creditsRes.json();

      // Derive data
      const filmography = buildFilmography(credits);
      const genreBreakdown = computeGenreBreakdown(credits, person.known_for_department);
      const careerSpan = computeCareerSpan(filmography);
      const awards = findAwards(filmography, person.name, person.known_for_department, person.gender);

      // Sort and cap images
      const images = (imagesRes.profiles || [])
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 50);

      // Fetch collaborators + cast pool (top 3 popular movies)
      const { collaborators, castPool } = await findCollaborators(filmography, personId);

      profileData = {
        person,
        filmography,
        genreBreakdown,
        careerSpan,
        awards,
        collaborators,
        castPool,
        images,
        totalCredits: filmography.length
      };

      cacheProfile(personId, profileData);
      renderAll();

    } catch (err) {
      console.error('Profile load error:', err);
      showError("Unable to load profile. Please try again.");
    }
  }

  function buildFilmography(credits) {
    const seen = new Set();
    const films = [];
    const filmMap = {};

    (credits.cast || []).forEach(m => {
      if (!m.id || seen.has(m.id)) return;
      seen.add(m.id);
      const film = {
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        vote_count: m.vote_count || 0,
        popularity: m.popularity || 0,
        genre_ids: m.genre_ids || [],
        order: m.order != null ? m.order : 999,
        role: m.character || null,
        type: 'cast',
        crewJobs: []
      };
      films.push(film);
      filmMap[m.id] = film;
    });

    (credits.crew || []).forEach(m => {
      if (!m.id) return;
      if (seen.has(m.id)) {
        const existing = filmMap[m.id];
        if (existing) {
          if (!existing.role) existing.role = m.job;
          if (m.job) existing.crewJobs.push(m.job);
        }
        return;
      }
      seen.add(m.id);
      const film = {
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        vote_count: m.vote_count || 0,
        popularity: m.popularity || 0,
        genre_ids: m.genre_ids || [],
        role: m.job || null,
        type: 'crew',
        crewJobs: m.job ? [m.job] : []
      };
      films.push(film);
      filmMap[m.id] = film;
    });

    return films;
  }

  function computeGenreBreakdown(credits, knownForDept) {
    // Filter credits by primary department so directors count directing
    // credits, actors count acting credits, etc.
    let relevantCredits;
    switch (knownForDept) {
      case 'Acting':
        relevantCredits = credits.cast || [];
        break;
      case 'Directing':
        relevantCredits = (credits.crew || []).filter(c => c.job === 'Director');
        break;
      case 'Writing':
        relevantCredits = (credits.crew || []).filter(c => c.department === 'Writing');
        break;
      case 'Production':
        relevantCredits = (credits.crew || []).filter(c => c.department === 'Production');
        break;
      default:
        relevantCredits = (credits.cast || []).length > 0 ? credits.cast : (credits.crew || []);
        break;
    }

    const counts = {};
    let total = 0;

    relevantCredits.forEach(m => {
      (m.genre_ids || []).forEach(gid => {
        const name = GENRE_MAP[gid];
        if (!name) return;
        counts[name] = (counts[name] || 0) + 1;
        total++;
      });
    });

    if (total === 0) return [];

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topGenres = sorted.slice(0, 8);
    const otherCount = sorted.slice(8).reduce((sum, [, c]) => sum + c, 0);

    const result = topGenres.map(([name, count]) => ({
      name,
      count,
      pct: Math.round(count / total * 100),
      cssClass: GENRE_CLASS[name] || 'other'
    }));

    if (otherCount > 0) {
      result.push({
        name: 'Other',
        count: otherCount,
        pct: Math.round(otherCount / total * 100),
        cssClass: 'other'
      });
    }

    return result;
  }

  function computeCareerSpan(filmography) {
    let earliest = 9999;
    let latest = 0;

    filmography.forEach(f => {
      if (!f.release_date) return;
      const year = parseInt(f.release_date.substring(0, 4));
      if (year && year < earliest) earliest = year;
      if (year && year > latest) latest = year;
    });

    if (earliest > latest) return { years: 0, from: null, to: null };
    return { years: latest - earliest, from: earliest, to: latest };
  }

  // ── Award Filtering ──

  const PERSON_AWARD_CATEGORIES = new Set([
    'Best Actor', 'Best Actress', 'Best Director',
    'Silver Bear (Director)', 'Silver Lion (Director)'
  ]);

  const ACTING_CATEGORIES = new Set(['Best Actor', 'Best Actress']);

  const DIRECTING_CATEGORIES = new Set([
    'Best Director', 'Silver Bear (Director)', 'Silver Lion (Director)'
  ]);

  function namesMatch(awardPerson, profileName) {
    if (!awardPerson || !profileName) return false;
    return awardPerson.trim().toLowerCase() === profileName.trim().toLowerCase();
  }

  function shouldIncludeAward(award, personName, knownForDept, personGender, roles) {
    const category = award.category;

    // Film-level categories → always include for anyone in the film
    if (!PERSON_AWARD_CATEGORIES.has(category)) return true;

    // Person-specific category with person field → name match only
    if (award.person) return namesMatch(award.person, personName);

    // Person-specific category without person field (Oscar entries) → role-based inference
    if (ACTING_CATEGORIES.has(category)) {
      if (!roles.isCast || knownForDept !== 'Acting') return false;
      if (category === 'Best Actor') return personGender === 2;
      if (category === 'Best Actress') return personGender === 1;
      return false;
    }

    if (DIRECTING_CATEGORIES.has(category)) {
      return roles.crewJobs.some(job => job === 'Director');
    }

    return false;
  }

  function findAwards(filmography, personName, knownForDept, personGender) {
    if (!window.AWARDS_DATABASE) return [];

    const awards = [];
    filmography.forEach(film => {
      const entry = window.AWARDS_DATABASE[film.id];
      if (!entry) return;

      const roles = {
        isCast: film.type === 'cast',
        crewJobs: film.crewJobs || []
      };

      entry.awards.forEach(award => {
        if (shouldIncludeAward(award, personName, knownForDept, personGender, roles)) {
          awards.push({
            ...award,
            filmTitle: entry.title,
            filmId: film.id
          });
        }
      });
    });

    awards.sort((a, b) => b.year - a.year);
    return awards;
  }

  async function findCollaborators(filmography, excludeId) {
    // Pick top 3 most popular films
    const topFilms = [...filmography]
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      .slice(0, 3);

    if (topFilms.length === 0) return { collaborators: [], castPool: [] };

    const personCounts = {};
    const castPoolMap = {};

    try {
      const results = await Promise.all(
        topFilms.map(f =>
          fetch(`https://api.themoviedb.org/3/movie/${f.id}/credits?api_key=${TMDB_API_KEY}`)
            .then(r => r.json())
            .catch(() => ({ cast: [], crew: [] }))
        )
      );

      results.forEach((credits, filmIdx) => {
        const film = topFilms[filmIdx];
        const filmYear = film.release_date ? film.release_date.substring(0, 4) : '';
        const filmGenres = film.genre_ids || [];
        const seen = new Set();
        [...(credits.cast || []).slice(0, 15), ...(credits.crew || []).filter(c => c.job === 'Director')].forEach(p => {
          if (!p.id || p.id === excludeId || seen.has(p.id)) return;
          seen.add(p.id);
          if (!personCounts[p.id]) {
            personCounts[p.id] = {
              id: p.id,
              name: p.name,
              profile_path: p.profile_path,
              department: p.known_for_department || (p.job === 'Director' ? 'Directing' : 'Acting'),
              sharedFilms: []
            };
          }
          personCounts[p.id].sharedFilms.push({
            id: film.id,
            title: film.title,
            year: filmYear,
            poster_path: film.poster_path || null
          });
        });

        // Build cast pool for similar actors (broader: top 20 cast)
        (credits.cast || []).slice(0, 20).forEach(p => {
          if (!p.id || p.id === excludeId) return;
          if (!castPoolMap[p.id]) {
            castPoolMap[p.id] = {
              id: p.id,
              name: p.name,
              profile_path: p.profile_path,
              department: p.known_for_department || 'Acting',
              popularity: p.popularity || 0,
              _genreSet: new Set(),
              _yearSet: new Set()
            };
          }
          filmGenres.forEach(g => castPoolMap[p.id]._genreSet.add(g));
          if (filmYear) castPoolMap[p.id]._yearSet.add(filmYear);
        });
      });
    } catch (err) {
      console.error('Collaborator fetch error:', err);
      return { collaborators: [], castPool: [] };
    }

    const collaborators = Object.values(personCounts)
      .map(p => ({ ...p, count: p.sharedFilms.length }))
      .filter(p => p.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Convert Sets to Arrays for JSON serialization
    const castPool = Object.values(castPoolMap).map(p => ({
      id: p.id,
      name: p.name,
      profile_path: p.profile_path,
      department: p.department,
      popularity: p.popularity,
      filmGenres: Array.from(p._genreSet),
      filmYears: Array.from(p._yearSet)
    }));

    return { collaborators, castPool };
  }

  // ── Caching ──

  function getCachedProfile(id) {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cache = JSON.parse(raw);
      const entry = cache[String(id)];
      if (!entry) return null;

      const age = (Date.now() - new Date(entry.cached_at).getTime()) / (1000 * 60 * 60 * 24);
      if (age > CACHE_DAYS) return null;

      return entry.data;
    } catch { return null; }
  }

  function cacheProfile(id, data) {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const cache = raw ? JSON.parse(raw) : {};

      cache[String(id)] = {
        cached_at: new Date().toISOString(),
        data
      };

      // Prune if too large
      const keys = Object.keys(cache);
      if (keys.length > CACHE_MAX) {
        const sorted = keys.sort((a, b) =>
          new Date(cache[a].cached_at) - new Date(cache[b].cached_at)
        );
        sorted.slice(0, 50).forEach(k => delete cache[k]);
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch { /* quota exceeded */ }
  }

  // ── Rendering ──

  function renderAll() {
    const p = profileData.person;

    document.title = `${p.name} - Orbit`;

    // Log encounter
    if (window.OrbitEncounters) {
      window.OrbitEncounters.logEncounter({
        id: p.id,
        name: p.name,
        profile_path: p.profile_path,
        known_for_department: p.known_for_department
      }, 'profile');
    }

    renderHero();
    renderFootprint();
    renderSignatureRoles();
    renderCareerArc();
    renderCareerDNA();
    renderBoxOffice();
    renderConnections();
    renderAwards();
    renderNebula();
    renderDidYouKnow();
    renderPhotoGallery();
    renderSimilarActors();
    renderFilmography();
    initScrollReveal();
    buildPillBar();
    initSectionReorder();
  }

  function renderHero() {
    const p = profileData.person;

    // Photo
    const photo = $('ppPhoto');
    photo.src = p.profile_path ? `${TMDB_IMG}w185${p.profile_path}` : DEFAULT_AVATAR;
    photo.alt = p.name;
    photo.onerror = function() { this.src = DEFAULT_AVATAR; };
    if (p.deathday) {
      photo.classList.add('pp-hero-photo--memorial');
    }
    fadeOutSkeleton($('ppSkeletonPhoto'), photo);

    // Name
    const nameEl = $('ppName');
    nameEl.textContent = p.name;
    fadeOutSkeleton($('ppSkeletonName'), nameEl);

    // Bookmark + Share + Cube
    const bmBtn = $('ppBookmarkBtn');
    bmBtn.classList.remove('hidden');
    $('ppShareBtn')?.classList.remove('hidden');
    $('ppCubeBtn')?.classList.remove('hidden');
    if (window.OrbitEncounters) {
      const encountered = window.OrbitEncounters.getEncountered();
      const entry = encountered[String(personId)];
      if (entry && entry.bookmarked) {
        bmBtn.classList.add('active');
      }
    }

    // Department + lifespan
    const meta = $('ppMeta');
    const dept = $('ppDepartment');
    const deptName = p.known_for_department || 'Unknown';
    dept.textContent = deptName;
    dept.className = 'pp-dept-pill';
    if (deptName.toLowerCase() === 'directing') dept.classList.add('directing');
    else if (deptName.toLowerCase() === 'writing') dept.classList.add('writing');
    else if (deptName.toLowerCase() === 'production') dept.classList.add('producing');

    const lifespan = $('ppLifespan');
    const parts = [];
    if (p.birthday) {
      parts.push(`Born ${formatDate(p.birthday)}`);
      if (p.place_of_birth) parts[parts.length - 1] += ` in ${p.place_of_birth}`;
    }
    if (p.deathday) parts.push(`Died ${formatDate(p.deathday)}`);
    lifespan.textContent = parts.join(' · ');
    fadeOutSkeleton($('ppSkeletonMeta'), meta);

    // Career summary
    const summary = $('ppCareerSummary');
    const span = profileData.careerSpan;
    const creditCount = profileData.totalCredits;
    const summaryParts = [];
    if (span.years > 0) summaryParts.push(`${span.years}-year career (${span.from}–${span.to})`);
    summaryParts.push(`${creditCount} credits`);
    summary.textContent = summaryParts.join(' · ');
    fadeOutSkeleton($('ppSkeletonSummary'), summary);

    // Awards summary
    const awardsSummary = $('ppAwardsSummary');
    const wins = profileData.awards.filter(a => a.won);
    if (wins.length > 0) {
      const festivalCounts = {};
      wins.forEach(a => {
        festivalCounts[a.festival] = (festivalCounts[a.festival] || 0) + 1;
      });
      awardsSummary.innerHTML = Object.entries(festivalCounts)
        .map(([fest, count]) => `<span class="pp-award-badge">&#9733; ${fest} &times;${count}</span>`)
        .join('');
      awardsSummary.classList.remove('hidden');
    }
  }

  const SOURCE_META = {
    constellation: { color: '#ffd700', label: 'Constellation' },
    collision: { color: '#ff6b35', label: 'Collision Course' },
    triple_collision: { color: '#a855f7', label: 'Triple Collision' },
    timeline: { color: '#10b981', label: 'Timeline' },
    actor_timeline: { color: '#14b8a6', label: 'Actor Timeline' },
    moviecube: { color: '#00d9ff', label: 'Moviecube' },
    venn: { color: '#3b82f6', label: 'Venn Diagram' },
    search: { color: '#64748b', label: 'Search' },
    profile: { color: '#94a3b8', label: 'Profile' },
    'stellar-catalog': { color: '#00d9ff', label: 'The Observatory' },
    'sequel-shot': { color: '#8b5cf6', label: 'Sequel Shot' },
    screenshot: { color: '#fbbf24', label: 'Screenshot' }
  };

  function renderFootprint() {
    if (!window.OrbitEncounters || !window.OrbitEncounters.isEncountered(personId)) return;

    const section = $('ppFootprint');
    const encountered = window.OrbitEncounters.getEncountered();
    const entry = encountered[String(personId)];
    if (!entry) return;

    // Encounter count with sparkle
    const sparkle = entry.encounter_count > 10 ? ' <span class="pp-sparkle">&#10024;</span>' : '';
    $('ppEncounterText').innerHTML = `Encountered <strong>${entry.encounter_count}</strong> time${entry.encounter_count !== 1 ? 's' : ''}${sparkle}`;

    // Source badges with game colors
    const badgesEl = $('ppSourceBadges');
    badgesEl.innerHTML = entry.sources
      .map(s => {
        const meta = SOURCE_META[s] || { color: '#64748b', label: s };
        return `<span class="pp-source-badge-v2" style="border-left-color:${meta.color}">${esc(meta.label)}</span>`;
      })
      .join('');

    // First discovered line
    const firstLine = $('ppFirstDiscovered');
    if (firstLine && entry.first_encountered) {
      const firstSource = entry.sources[0] || '';
      const sourceLabel = (SOURCE_META[firstSource] || {}).label || firstSource;
      const dateStr = new Date(entry.first_encountered).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      firstLine.textContent = `First discovered on ${dateStr} via ${sourceLabel}`;
      firstLine.classList.remove('hidden');
    }

    // Filmography prompt
    const progressLabel = $('ppProgressLabel');
    progressLabel.textContent = 'Explore their filmography below to discover more';
    $('ppProgressFill').style.width = '0%';

    section.classList.remove('hidden');
  }

  function renderCareerDNA() {
    const bars = $('ppDnaBars');
    const genres = profileData.genreBreakdown;

    if (genres.length === 0) {
      bars.innerHTML = '<p class="pp-collabs-empty">No genre data available.</p>';
      return;
    }

    const maxPct = genres[0].pct;
    bars.innerHTML = genres.map(g => {
      const relativeWidth = maxPct > 0 ? Math.round((g.pct / maxPct) * 100) : 100;
      return `
      <div class="pp-dna-row">
        <span class="pp-dna-label">${g.name}</span>
        <div class="pp-dna-bar-track">
          <div class="pp-dna-bar-fill pp-genre-${g.cssClass}" data-width="${relativeWidth}"></div>
        </div>
        <span class="pp-dna-pct">${g.pct}%</span>
      </div>
    `;
    }).join('');

    // Animate bars in
    requestAnimationFrame(() => {
      bars.querySelectorAll('.pp-dna-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    });
  }

  function renderConnections() {
    const container = $('ppCollabs');
    const collabs = profileData.collaborators;

    if (!collabs || collabs.length === 0) {
      // Try recent co-stars fallback
      renderRecentCoStarsFallback(container);
      return;
    }

    // Store shared films data for tooltip access (module-level ref)
    collabFilmMapRef = {};
    collabs.forEach(c => { collabFilmMapRef[c.id] = c.sharedFilms || []; });

    container.innerHTML = collabs.map(c => {
      const photo = c.profile_path
        ? `${TMDB_IMG}w92${c.profile_path}`
        : DEFAULT_AVATAR;
      const isSelected = selectedCollaborators.has(c.id);

      return `
        <div class="pp-collab-card${isSelected ? ' selected' : ''}" data-person-id="${c.id}" data-name="${esc(c.name)}">
          <div class="pp-collab-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <img class="pp-collab-photo" src="${photo}" alt="${esc(c.name)}" loading="lazy"
               onerror="this.src='${DEFAULT_AVATAR}'">
          <span class="pp-collab-name">${esc(c.name)}</span>
          <span class="pp-collab-count">${c.count} shared films</span>
          <span class="pp-collab-dept">${esc(c.department || '')}</span>
        </div>
      `;
    }).join('');

    bindCollabTooltips();
  }

  async function renderRecentCoStarsFallback(container) {
    // Show loading state
    container.innerHTML = '<p class="pp-collabs-empty pp-collabs-loading">Searching for recent co-stars&hellip;</p>';

    const coStars = await getRecentCoStars(profileData.filmography, personId);
    if (coStars.length === 0) {
      container.innerHTML = '<p class="pp-collabs-empty">Explore their filmography below to discover connections.</p>';
      return;
    }

    // Update section title
    const titleEl = document.querySelector('#ppConnections .pp-section-title');
    if (titleEl) {
      titleEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="7" r="3"/><path d="M21 21v-1a3 3 0 0 0-2-2.83"/></svg>
        Recent Co-Stars
        <span class="pp-section-subtitle">From their latest films</span>
      `;
    }

    container.innerHTML = coStars.map(c => {
      const photo = c.profile_path
        ? `${TMDB_IMG}w92${c.profile_path}`
        : DEFAULT_AVATAR;
      return `
        <a href="people-profile.html?id=${c.id}" class="pp-collab-card pp-costar-card" data-person-id="${c.id}" data-name="${esc(c.name)}">
          <img class="pp-collab-photo" src="${photo}" alt="${esc(c.name)}" loading="lazy"
               onerror="this.src='${DEFAULT_AVATAR}'">
          <span class="pp-collab-name">${esc(c.name)}</span>
          <span class="pp-collab-count">${esc(c.recent_film.title)} (${c.recent_film.year})</span>
          <span class="pp-collab-dept">${esc(c.department || '')}</span>
        </a>
      `;
    }).join('');

    // Hide the nav actions (no shared timeline for co-stars)
    const navActions = $('ppNavActions');
    if (navActions) navActions.classList.add('hidden');
  }

  function getOrCreateTooltip() {
    let tip = document.getElementById('ppCollabTooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'ppCollabTooltip';
      tip.className = 'pp-collab-tooltip';
      document.body.appendChild(tip);
    }
    return tip;
  }

  function showFloatingTooltip(card, films) {
    const tip = getOrCreateTooltip();
    const collabName = card.dataset.name || card.querySelector('.pp-collab-name')?.textContent || '';
    const profileName = profileData?.person?.name || '';
    const collabId = card.dataset.personId;

    let html = '';
    // Header
    html += `<div class="pp-collab-tooltip-header">${esc(profileName)} &times; ${esc(collabName)}</div>`;

    if (films && films.length > 0) {
      const shown = films.slice(0, 8);
      const remaining = films.length - shown.length;
      html += '<div class="pp-collab-tooltip-movies">';
      shown.forEach(f => {
        const poster = f.poster_path
          ? `${TMDB_IMG}w92${f.poster_path}`
          : '';
        const posterHtml = poster
          ? `<img src="${poster}" alt="" loading="lazy" onerror="this.style.display='none'">`
          : '<div class="pp-tooltip-no-poster"></div>';
        html += `<div class="pp-collab-tooltip-movie" data-movie-id="${f.id}">
          ${posterHtml}
          <span>${esc(f.title)}${f.year ? ` (${f.year})` : ''}</span>
        </div>`;
      });
      html += '</div>';
      if (remaining > 0) {
        html += `<div class="pp-collab-tooltip-more">+${remaining} more</div>`;
      }
    } else {
      const count = card.querySelector('.pp-collab-count')?.textContent || '';
      html += `<div class="pp-collab-tooltip-fallback">${esc(count)}</div>`;
    }

    // Actions
    html += `<div class="pp-collab-tooltip-actions">
      <a href="people-profile.html?id=${collabId}" class="pp-tooltip-profile-link">View Profile</a>
      <button class="pp-tooltip-timeline-btn" data-collab-id="${collabId}">Shared Timeline &rarr;</button>
    </div>`;

    tip.innerHTML = html;

    // Bind tooltip movie clicks → Moviecube
    tip.querySelectorAll('.pp-collab-tooltip-movie[data-movie-id]').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const movieId = parseInt(row.dataset.movieId);
        if (movieId && typeof openMovieCube === 'function') {
          openMovieCube(movieId);
          hideFloatingTooltip();
        }
      });
    });

    // Bind timeline action
    const tlBtn = tip.querySelector('.pp-tooltip-timeline-btn');
    if (tlBtn) {
      tlBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateToSacredTimeline(personId, profileName);
      });
    }

    // Position above the card, flip below if near top
    const rect = card.getBoundingClientRect();
    tip.style.left = (rect.left + rect.width / 2) + 'px';
    tip.style.transform = 'translateX(-50%) translateY(-100%)';
    tip.style.top = (rect.top - 10) + 'px';

    // Show, then check if it overflows above viewport
    tip.classList.add('visible');
    const tipRect = tip.getBoundingClientRect();
    if (tipRect.top < 8) {
      tip.style.top = (rect.bottom + 10) + 'px';
      tip.style.transform = 'translateX(-50%)';
    }

    activeCollabTooltip = tip;
  }

  function hideFloatingTooltip() {
    const tip = document.getElementById('ppCollabTooltip');
    if (tip) {
      tip.classList.remove('visible');
    }
    activeCollabTooltip = null;
  }

  function bindCollabTooltips() {
    if (tooltipsBound) return;
    tooltipsBound = true;

    const container = $('ppCollabs');
    if (!container) return;

    // Click-to-select (both desktop and mobile)
    container.addEventListener('click', (e) => {
      // Don't toggle selection if clicking inside the tooltip
      if (e.target.closest('#ppCollabTooltip')) return;
      const card = e.target.closest('.pp-collab-card[data-person-id]');
      if (!card) return;

      if (isTouchDevice) {
        // Mobile: first tap shows tooltip, second tap toggles selection
        const tip = document.getElementById('ppCollabTooltip');
        if (tip && tip.classList.contains('visible') && tip._cardId === card.dataset.personId) {
          // Second tap — toggle selection
          const id = parseInt(card.dataset.personId);
          const collab = (profileData.collaborators || []).find(c => c.id === id);
          if (collab) toggleSelection(id, collab, card);
          return;
        }
        // First tap — show tooltip
        e.preventDefault();
        e.stopPropagation();
        hideFloatingTooltip();
        const pid = parseInt(card.dataset.personId);
        const films = collabFilmMapRef[pid] || [];
        showFloatingTooltip(card, films);
        const tipEl = document.getElementById('ppCollabTooltip');
        if (tipEl) tipEl._cardId = card.dataset.personId;
      } else {
        // Desktop: click toggles selection
        const id = parseInt(card.dataset.personId);
        const collab = (profileData.collaborators || []).find(c => c.id === id);
        if (collab) toggleSelection(id, collab, card);
      }
    });

    // Dismiss tooltip on outside tap/click
    document.addEventListener('click', (e) => {
      if (activeCollabTooltip && !e.target.closest('.pp-collab-card') && !e.target.closest('#ppCollabTooltip')) {
        hideFloatingTooltip();
      }
    });

    if (!isTouchDevice) {
      // Desktop: hover with delay for tooltip
      container.addEventListener('mouseenter', (e) => {
        const card = e.target.closest('.pp-collab-card[data-person-id]');
        if (!card) return;
        clearTimeout(collabTooltipTimer);
        collabTooltipTimer = setTimeout(() => {
          const pid = parseInt(card.dataset.personId);
          const films = collabFilmMapRef[pid] || [];
          showFloatingTooltip(card, films);
        }, 300);
      }, true);

      container.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.pp-collab-card[data-person-id]');
        if (!card) return;
        clearTimeout(collabTooltipTimer);
        collabTooltipTimer = setTimeout(() => {
          // Don't hide if mouse moved into the tooltip
          const tip = document.getElementById('ppCollabTooltip');
          if (tip && tip.matches(':hover')) return;
          hideFloatingTooltip();
        }, 200);
      }, true);

      // Keep tooltip alive when hovering over it
      document.addEventListener('mouseleave', (e) => {
        if (e.target.id === 'ppCollabTooltip') {
          collabTooltipTimer = setTimeout(() => hideFloatingTooltip(), 150);
        }
      }, true);
      document.addEventListener('mouseenter', (e) => {
        if (e.target.id === 'ppCollabTooltip') {
          clearTimeout(collabTooltipTimer);
        }
      }, true);
    }
  }

  // ── Selection ──

  function clearAllSelections() {
    selectedCollaborators.clear();
    document.querySelectorAll('.pp-collab-card.selected').forEach(c => c.classList.remove('selected'));
    updateSelectionBar();
  }

  function toggleSelection(id, collab, cardEl) {
    if (selectedCollaborators.has(id)) {
      selectedCollaborators.delete(id);
      cardEl.classList.remove('selected');
    } else {
      if (selectedCollaborators.size >= 3) {
        showToast('Maximum 4 people for timeline');
        return;
      }
      selectedCollaborators.set(id, {
        id: collab.id,
        name: collab.name,
        profile_path: collab.profile_path,
        department: collab.department
      });
      cardEl.classList.add('selected');
    }

    updateSelectionBar();
  }

  function updateSelectionBar() {
    const bar = $('ppSelectionBar');
    const hasSelection = selectedCollaborators.size > 0;

    if (!hasSelection) {
      bar.classList.remove('visible');
      setTimeout(() => bar.classList.add('hidden'), 300);
      return;
    }

    // Populate profile person chip (locked)
    const selfChip = $('ppSelectionSelf');
    const p = profileData.person;
    const selfPhoto = selfChip.querySelector('.pp-selection-chip-photo');
    selfPhoto.src = p.profile_path ? `${TMDB_IMG}w92${p.profile_path}` : DEFAULT_AVATAR;
    selfPhoto.alt = p.name;
    selfChip.querySelector('.pp-selection-chip-name').textContent = p.name;

    // Build collaborator chips
    const chipsContainer = $('ppSelectionChips');
    chipsContainer.innerHTML = '';
    selectedCollaborators.forEach((collab, id) => {
      const photo = collab.profile_path ? `${TMDB_IMG}w92${collab.profile_path}` : DEFAULT_AVATAR;
      const chip = document.createElement('div');
      chip.className = 'pp-selection-chip';
      chip.innerHTML = `
        <img class="pp-selection-chip-photo" src="${photo}" alt="${esc(collab.name)}"
             onerror="this.src='${DEFAULT_AVATAR}'">
        <span class="pp-selection-chip-name">${esc(collab.name)}</span>
        <button class="pp-chip-remove" title="Remove">&times;</button>
      `;
      chip.querySelector('.pp-chip-remove').addEventListener('click', () => {
        selectedCollaborators.delete(id);
        const card = document.querySelector(`.pp-collab-card[data-person-id="${id}"]`);
        if (card) card.classList.remove('selected');
        updateSelectionBar();
      });
      chipsContainer.appendChild(chip);
    });

    // Update count and button states
    const total = selectedCollaborators.size + 1;
    $('ppSelectionCount').textContent = `${total}/4`;
    $('ppSelectionLaunch').disabled = false;
    const vennBtn = $('ppSelectionVenn');
    if (vennBtn) vennBtn.disabled = false;

    bar.classList.remove('hidden');
    requestAnimationFrame(() => bar.classList.add('visible'));
  }

  function launchSharedTimeline() {
    const selectedIds = Array.from(selectedCollaborators.keys());
    if (selectedIds.length === 0) return;

    // Store collaborator IDs for timeline to pick up after initial load
    localStorage.setItem('timelinePendingPeople', JSON.stringify(selectedIds));

    // Navigate using existing mechanism for the profile person
    navigateToSacredTimeline(personId, profileData?.person?.name);
  }

  async function launchStellarTerritories() {
    const selectedIds = Array.from(selectedCollaborators.keys());
    if (selectedIds.length === 0) return;

    // Show loading state
    const vennBtn = $('ppSelectionVenn');
    const launchBtn = $('ppSelectionLaunch');
    vennBtn.disabled = true;
    launchBtn.disabled = true;
    vennBtn.textContent = 'Preparing...';

    try {
      // Build current profile person entry
      const person = profileData.person;
      const currentEntry = {
        id: person.id,
        name: person.name,
        role: person.known_for_department === 'Directing' ? 'Director' : 'Actor',
        profile: person.profile_path,
        movies: (profileData.filmography || []).slice(0, 35).map(f => ({
          id: f.id, title: f.title, poster_path: f.poster_path,
          release_date: f.release_date, vote_average: f.vote_average,
          vote_count: f.vote_count || 0, popularity: f.popularity || 0,
          overview: '', genre_ids: f.genre_ids || [],
          character: f.role || ''
        }))
      };

      // Fetch movie credits for selected collaborators
      const collabEntries = await Promise.all(
        selectedIds.map(async (collabId) => {
          const collab = selectedCollaborators.get(collabId);
          if (!collab) return null;
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/person/${collabId}/movie_credits?api_key=${TMDB_API_KEY}`
            );
            const credits = await res.json();
            const movieMap = new Map();
            (credits.cast || []).forEach(m => {
              if (!movieMap.has(m.id)) {
                movieMap.set(m.id, {
                  id: m.id, title: m.title, poster_path: m.poster_path,
                  release_date: m.release_date, vote_average: m.vote_average,
                  vote_count: m.vote_count, popularity: m.popularity,
                  overview: m.overview || '', genre_ids: m.genre_ids || [],
                  character: m.character || ''
                });
              }
            });
            // Limit to top 35 by popularity
            const movies = Array.from(movieMap.values())
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .slice(0, 35);
            const role = collab.department === 'Directing' ? 'Director' :
                         collab.department === 'Writing' ? 'Writer' : 'Actor';
            return {
              id: collab.id, name: collab.name,
              role,
              profile: collab.profile_path,
              movies
            };
          } catch (err) {
            console.error(`Failed to fetch credits for ${collab.name}:`, err);
            return { id: collab.id, name: collab.name, role: 'Actor', profile: collab.profile_path, movies: [] };
          }
        })
      );

      const vennPeople = [currentEntry, ...collabEntries.filter(Boolean)];
      localStorage.setItem('vennPeople', JSON.stringify(vennPeople));
      window.location.href = 'venn.html';

    } catch (err) {
      console.error('Stellar Territories launch error:', err);
      showToast('Failed to prepare data. Please try again.');
      vennBtn.textContent = 'Stellar Territories';
      updateSelectionCount();
    }
  }

  const FESTIVAL_GLYPH = {
    'Oscar': 'og-oscar',
    'BAFTA': 'og-bafta',
    'Cannes': 'og-palm',
    'Venice': 'og-lion',
    'Berlin': 'og-bear',
    'Golden Globe': 'og-globe'
  };

  function renderAwards() {
    const section = $('ppAwards');
    const list = $('ppAwardsList');
    const awards = profileData.awards;

    if (!awards || awards.length === 0) return;

    // Trophy row — one glyph per award
    let trophyHtml = '<div class="pp-trophy-row">';
    awards.forEach((a, i) => {
      const glyphClass = FESTIVAL_GLYPH[a.festival] || 'og-trophy';
      const nomClass = a.won ? '' : ' og-nominee';
      const tooltip = `${a.festival} · ${a.category} · ${a.year} — ${a.filmTitle} (${a.won ? 'Won' : 'Nominated'})`;
      trophyHtml += `<span class="pp-trophy-glyph" data-award-idx="${i}" title="">` +
        `<span class="og og-lg ${glyphClass}${nomClass}"></span>` +
        `<span class="pp-trophy-tooltip">${esc(tooltip)}</span>` +
        `</span>`;
    });
    trophyHtml += '</div>';

    // "View All Awards" button
    trophyHtml += '<button class="pp-view-all-awards" id="ppViewAllAwards">View All Awards &#8250;</button>';

    list.innerHTML = trophyHtml;
    section.classList.remove('hidden');

    // Bind modal opener
    $('ppViewAllAwards')?.addEventListener('click', () => openAwardsModal(awards));
  }

  function openAwardsModal(awards) {
    const modal = $('ppAwardsModal');
    const body = $('ppAwardsModalBody');
    if (!modal || !body) return;

    // Build table sorted by year descending
    const sorted = [...awards].sort((a, b) => b.year - a.year);
    let html = '<table class="pp-awards-table"><thead><tr>' +
      '<th>Festival</th><th>Category</th><th>Film</th><th>Year</th><th>Result</th>' +
      '</tr></thead><tbody>';

    sorted.forEach(a => {
      const glyphClass = FESTIVAL_GLYPH[a.festival] || 'og-trophy';
      const resultClass = a.won ? 'pp-award-won' : 'pp-award-nom';
      html += `<tr class="${resultClass}">` +
        `<td><span class="og og-sm ${glyphClass}${a.won ? '' : ' og-nominee'}"></span> ${esc(a.festival)}</td>` +
        `<td>${esc(a.category)}</td>` +
        `<td>${esc(a.filmTitle)}</td>` +
        `<td>${a.year}</td>` +
        `<td>${a.won ? 'Won' : 'Nominated'}</td>` +
        `</tr>`;
    });

    html += '</tbody></table>';
    body.innerHTML = html;
    modal.classList.remove('hidden');

    // Close handlers
    const escHandler = (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
        e.stopPropagation();
      }
    };
    const closeModal = () => {
      modal.classList.add('hidden');
      document.removeEventListener('keydown', escHandler, true);
    };
    $('ppAwardsModalClose').onclick = closeModal;
    modal.querySelector('.pp-awards-modal-backdrop').onclick = closeModal;
    document.addEventListener('keydown', escHandler, true);
  }

  function renderFilmography() {
    const grid = $('ppFilmoGrid');
    const actions = $('ppFilmoActions');
    const sortEl = $('ppFilmoSort');
    const films = profileData.filmography;

    if (!films || films.length === 0) {
      grid.innerHTML = '<p class="pp-collabs-empty">No filmography data available.</p>';
      return;
    }

    // Sort
    allFilms = [...films];
    sortFilms(allFilms, currentSort);

    // Show controls
    sortEl.classList.remove('hidden');
    actions.classList.remove('hidden');

    // Limit
    const display = showingAll ? allFilms : allFilms.slice(0, INITIAL_FILMS);

    grid.innerHTML = display.map(f => {
      const year = f.release_date ? f.release_date.substring(0, 4) : '';
      const posterSrc = f.poster_path ? `${TMDB_IMG}w154${f.poster_path}` : '';
      return `
        <div class="pp-poster-card" data-movie-id="${f.id}">
          ${posterSrc
            ? `<img class="pp-poster-img" src="${posterSrc}" alt="${esc(f.title)}" loading="lazy"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
               <div class="pp-poster-fallback" style="display:none">&#127916;</div>`
            : `<div class="pp-poster-fallback">&#127916;</div>`
          }
          <div class="pp-poster-info">
            <div class="pp-poster-title" title="${esc(f.title)}">${esc(f.title)}</div>
            <div class="pp-poster-year">${year}</div>
            ${f.role ? `<div class="pp-poster-role" title="${esc(f.role)}">${esc(f.role)}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Show All button
    const showAllBtn = $('ppShowAll');
    if (allFilms.length > INITIAL_FILMS && !showingAll) {
      showAllBtn.textContent = `Show All ${allFilms.length} Films`;
      showAllBtn.classList.remove('hidden');
    } else {
      showAllBtn.classList.add('hidden');
    }

    // Timeline link
    const link = $('ppTimelineLink');
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSacredTimeline(personId, profileData?.person?.name);
    });

    // Poster click → open Moviecube
    grid.querySelectorAll('.pp-poster-card').forEach(card => {
      card.addEventListener('click', () => {
        const movieId = parseInt(card.dataset.movieId);
        if (movieId && typeof openMovieCube === 'function') {
          openMovieCube(movieId);
        }
      });
    });
  }

  function sortFilms(films, sort) {
    switch (sort) {
      case 'year':
        films.sort((a, b) => {
          const ya = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
          const yb = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
          return yb - ya;
        });
        break;
      case 'popularity':
        films.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'rating':
        films.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
    }
  }

  // ── Helpers ──

  function fadeOutSkeleton(skeletonEl, contentEl) {
    if (skeletonEl) skeletonEl.classList.add('hidden');
    if (!contentEl) return;
    contentEl.style.opacity = '0';
    contentEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      contentEl.style.transition = 'opacity 0.2s ease';
      contentEl.style.opacity = '1';
    });
  }

  function showError(msg, notFound) {
    $('ppContent')?.classList.add('hidden');
    // Hide any visible skeleton loaders
    document.querySelectorAll('.pp-skeleton').forEach(s => s.classList.add('hidden'));

    $('ppErrorMsg').textContent = msg;
    $('ppError').classList.remove('hidden');

    if (notFound) {
      $('ppRetryBtn')?.classList.add('hidden');
      $('ppErrorBack')?.classList.remove('hidden');
    }
  }

  function toggleBookmark() {
    if (!window.OrbitEncounters) return;
    const newState = window.OrbitEncounters.toggleBookmark(personId);
    const btn = $('ppBookmarkBtn');
    if (newState) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Nebula Consensus ──

  async function renderNebula() {
    const section = $('ppNebula');
    if (!section) return;

    const films = profileData.filmography;
    if (!films || films.length === 0) return;

    // Fetch nebula seed data to find which films have reviews
    let nebulaIds;
    try {
      const res = await fetch('../data/nebula-seed-movies.json');
      if (!res.ok) return;
      const seed = await res.json();
      nebulaIds = new Set((seed.movies || []).map(m => m.id));
    } catch { return; }

    // Cross-reference
    const nebulaFilms = films.filter(f => nebulaIds.has(f.id) && f.vote_average > 0);
    if (nebulaFilms.length === 0) return;

    // Calculate stats
    const totalRated = nebulaFilms.length;
    const avgRating = nebulaFilms.reduce((sum, f) => sum + f.vote_average, 0) / totalRated;
    const sorted = [...nebulaFilms].sort((a, b) => b.vote_average - a.vote_average);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    // Summary
    $('ppNebulaSummary').textContent = `Across ${totalRated} of their ${films.length} films with Nebula reviews:`;

    // Star rating (out of 5, mapped from 0-10 scale)
    const starRating = avgRating / 2;
    $('ppNebulaStars').innerHTML = buildStarsSVG(starRating) +
      `<span class="pp-nebula-avg">${avgRating.toFixed(1)}/10</span>`;

    // Highlight cards
    let cardsHtml = '';
    if (highest) {
      const hPoster = highest.poster_path ? `${TMDB_IMG}w92${highest.poster_path}` : '';
      cardsHtml += `
        <div class="pp-nebula-card praised">
          ${hPoster ? `<img class="pp-nebula-card-poster" src="${hPoster}" alt="" loading="lazy">` : ''}
          <div class="pp-nebula-card-info">
            <div class="pp-nebula-card-label">Most Praised</div>
            <div class="pp-nebula-card-title" title="${esc(highest.title)}">${esc(highest.title)}</div>
            <div class="pp-nebula-card-rating">${highest.vote_average.toFixed(1)}/10</div>
          </div>
        </div>`;
    }
    if (lowest && lowest.id !== highest.id) {
      const lPoster = lowest.poster_path ? `${TMDB_IMG}w92${lowest.poster_path}` : '';
      cardsHtml += `
        <div class="pp-nebula-card divisive">
          ${lPoster ? `<img class="pp-nebula-card-poster" src="${lPoster}" alt="" loading="lazy">` : ''}
          <div class="pp-nebula-card-info">
            <div class="pp-nebula-card-label">Most Divisive</div>
            <div class="pp-nebula-card-title" title="${esc(lowest.title)}">${esc(lowest.title)}</div>
            <div class="pp-nebula-card-rating">${lowest.vote_average.toFixed(1)}/10</div>
          </div>
        </div>`;
    }
    $('ppNebulaCards').innerHTML = cardsHtml;
    section.classList.remove('hidden');
  }

  function buildStarsSVG(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const fill = rating >= i ? 1 : (rating >= i - 0.5 ? 0.5 : 0);
      if (fill === 1) {
        html += `<svg width="20" height="20" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#ffd700" stroke="#ffd700" stroke-width="1"/></svg>`;
      } else if (fill === 0.5) {
        html += `<svg width="20" height="20" viewBox="0 0 24 24">
          <defs><linearGradient id="half${i}"><stop offset="50%" stop-color="#ffd700"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half${i})" stroke="#ffd700" stroke-width="1"/>
        </svg>`;
      } else {
        html += `<svg width="20" height="20" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#64748b" stroke-width="1"/></svg>`;
      }
    }
    return html;
  }

  // ── Did You Know? ──

  const OBVIOUS_FACT_RE = /\b(?:is|was)\s+(?:an?\s+)?(?:American|British|Australian|Canadian|French|German|Italian|Spanish|Irish|Scottish|Swedish|Danish|Norwegian|Indian|Japanese|Korean|Chinese|Mexican|Brazilian|South African|New Zealand|Austrian|Belgian|Dutch|Swiss|Polish|Russian|Czech|Hungarian|Finnish|Israeli|Iranian|Turkish|Greek|Egyptian|Nigerian|Ghanaian|Kenyan|Argentine|Colombian|Chilean|Venezuelan|Peruvian|Cuban|Puerto Rican|Filipino|Thai|Vietnamese|Malaysian|Indonesian|Singaporean|Taiwanese|Hong Kong|English|Welsh)?\s*(?:actor|actress|director|producer|screenwriter|writer|filmmaker|cinematographer|editor|composer|singer|musician|model|comedian|entertainer|television|film)\b/i;

  function isObviousFact(text) {
    return OBVIOUS_FACT_RE.test(text);
  }

  function truncateFact(text) {
    if (text.length <= 150) return text;
    const cut = text.slice(0, 150);
    const lastPeriod = cut.lastIndexOf('.');
    if (lastPeriod > 60) return cut.slice(0, lastPeriod + 1);
    return cut.replace(/\s+\S*$/, '') + '…';
  }

  function renderDidYouKnow() {
    const section = $('ppDidYouKnow');
    if (!section) return;

    const bio = profileData.person.biography;
    if (!bio || bio.length < 50) return;

    const facts = [];
    const seen = new Set();

    function addFact(text) {
      if (!text || facts.length >= 3) return;
      const clean = text.trim();
      if (clean.length < 20) return;
      if (isObviousFact(clean)) return;
      const key = clean.toLowerCase().slice(0, 40);
      if (seen.has(key)) return;
      seen.add(key);
      facts.push(truncateFact(clean));
    }

    // Birth name
    const birthMatch = bio.match(/(?:born|née?|birth name)\s+([A-Z][a-zA-Z\u00C0-\u024F]+(?:\s+[A-Z][a-zA-Z\u00C0-\u024F]+){1,5})/i);
    if (birthMatch && birthMatch[1].trim() !== profileData.person.name) {
      addFact(`Born as ${birthMatch[1].trim()}.`);
    }

    // Split biography into sentences
    const sentences = bio.split(/(?<=[.!?])\s+/).filter(s => s.length >= 20);

    // Career origin facts
    for (const s of sentences) {
      if (facts.length >= 3) break;
      if (/\b(?:first role|debut|began (?:his|her|their)|started (?:his|her|their)|breakthrough)\b/i.test(s)) {
        addFact(s);
      }
    }

    // Award/accolade facts
    for (const s of sentences) {
      if (facts.length >= 3) break;
      if (/\b(?:Academy Award|Oscar|Emmy|Grammy|Tony|Golden Globe|BAFTA|Palme|César|Cannes|Venice|Berlin|Pulitzer)\b/i.test(s)) {
        addFact(s);
      }
    }

    // Family/personal facts
    for (const s of sentences) {
      if (facts.length >= 3) break;
      if (/\b(?:married|children|son of|daughter of|brother of|sister of|father|mother)\b/i.test(s)) {
        addFact(s);
      }
    }

    // Distinctive non-obvious sentences from the bio
    for (const s of sentences) {
      if (facts.length >= 3) break;
      if (s.length >= 20 && s.length <= 200) {
        addFact(s);
      }
    }

    if (facts.length === 0) return;

    $('ppDykList').innerHTML = facts.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('');
    section.classList.remove('hidden');
  }

  // ── Share Profile ──

  function shareProfile() {
    const url = `${window.location.origin}${window.location.pathname}?id=${personId}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Profile link copied!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Profile link copied!');
    });
  }

  function showToast(msg) {
    const toast = $('ppToast');
    if (!toast) return;
    $('ppToastMsg').textContent = msg;
    toast.classList.remove('hidden');
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
  }

  // ── Signature Roles ──

  function getSignatureRoles(filmography) {
    const castFilms = filmography.filter(f => f.type === 'cast' && f.role);
    return castFilms.map(f => {
      const quality = (f.vote_average || 0) * 2;
      const recognition = Math.log10((f.vote_count || 1)) * 3;
      const billing = (f.order != null && f.order <= 2) ? 5 : 0;
      const relevance = (f.popularity || 0) * 0.1;
      return { ...f, score: quality + recognition + billing + relevance };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
  }

  function renderSignatureRoles() {
    const section = $('ppSignatureRoles');
    const container = $('ppSignatureContent');
    if (!section || !container) return;

    const castFilms = profileData.filmography.filter(f => f.type === 'cast');
    if (castFilms.length < 3) return;

    const roles = getSignatureRoles(profileData.filmography);
    if (roles.length === 0) return;

    container.innerHTML = roles.map(f => {
      const poster = f.poster_path
        ? `<img class="pp-sig-poster" src="${TMDB_IMG}w154${f.poster_path}" alt="${esc(f.title)}" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="pp-sig-poster pp-sig-no-poster"></div>`;
      const stars = f.vote_average ? (f.vote_average / 2).toFixed(1) : '';
      const year = f.release_date ? f.release_date.substring(0, 4) : '';
      return `<div class="pp-sig-card" data-movie-id="${f.id}">
        ${poster}
        <div class="pp-sig-info">
          <span class="pp-sig-title">${esc(f.title)}${year ? ` <span class="pp-sig-year">(${year})</span>` : ''}</span>
          <span class="pp-sig-role">${esc(f.role)}</span>
          ${stars ? `<span class="pp-sig-rating"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${stars}</span>` : ''}
        </div>
      </div>`;
    }).join('');

    // Click → Moviecube
    container.querySelectorAll('.pp-sig-card[data-movie-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.movieId);
        if (id && typeof openMovieCube === 'function') openMovieCube(id);
      });
    });

    section.classList.remove('hidden');
  }

  // ── Career Arc Sparkline ──

  function buildCareerArc(filmography) {
    const yearCounts = {};
    filmography.forEach(f => {
      if (!f.release_date) return;
      const year = parseInt(f.release_date.substring(0, 4));
      if (isNaN(year) || year < 1900) return;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const years = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
    if (years.length < 2) return null;

    const minYear = years[0];
    const maxYear = years[years.length - 1];
    if (maxYear - minYear < 5) return null;

    const data = [];
    for (let y = minYear; y <= maxYear; y++) {
      data.push({ year: y, count: yearCounts[y] || 0 });
    }
    return data;
  }

  function renderCareerArc() {
    const section = $('ppCareerArc');
    const container = $('ppCareerArcChart');
    if (!section || !container) return;

    const data = buildCareerArc(profileData.filmography);
    if (!data) return;

    const width = 600;
    const height = 60;
    const padX = 0;
    const padTop = 4;
    const padBot = 16;
    const chartH = height - padTop - padBot;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;

    // Build SVG path for area chart
    const points = data.map((d, i) => {
      const x = padX + i * stepX;
      const y = padTop + chartH - (d.count / maxCount) * chartH;
      return { x, y, year: d.year, count: d.count };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = linePath + ` L${points[points.length - 1].x.toFixed(1)},${padTop + chartH} L${points[0].x.toFixed(1)},${padTop + chartH} Z`;

    // Decade labels
    const minYear = data[0].year;
    const maxYear = data[data.length - 1].year;
    let labels = '';
    for (let y = Math.ceil(minYear / 10) * 10; y <= maxYear; y += 10) {
      const idx = y - minYear;
      if (idx >= 0 && idx < data.length) {
        const x = padX + idx * stepX;
        labels += `<text x="${x.toFixed(1)}" y="${height}" fill="var(--ghost-gray, #64748b)" font-size="9" text-anchor="middle" font-family="Barlow, sans-serif">${y}s</text>`;
      }
    }

    // Invisible hover rects for tooltips
    let hoverRects = '';
    const rectW = Math.max(stepX, 4);
    points.forEach((p, i) => {
      hoverRects += `<rect x="${(p.x - rectW / 2).toFixed(1)}" y="0" width="${rectW.toFixed(1)}" height="${height}" fill="transparent" data-idx="${i}"/>`;
    });

    container.innerHTML = `
      <svg class="pp-arc-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-cyan, #22d3ee)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--accent-cyan, #22d3ee)" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#arcGrad)"/>
        <path d="${linePath}" fill="none" stroke="var(--accent-cyan, #22d3ee)" stroke-width="1.5" stroke-linejoin="round"/>
        ${labels}
        ${hoverRects}
      </svg>
      <div class="pp-arc-tooltip hidden" id="ppArcTooltip"></div>
    `;

    // Hover/tap tooltip
    const svg = container.querySelector('.pp-arc-svg');
    const tooltip = $('ppArcTooltip');
    if (svg && tooltip) {
      svg.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        const xRatio = (e.clientX - rect.left) / rect.width;
        const idx = Math.round(xRatio * (data.length - 1));
        if (idx >= 0 && idx < data.length) {
          const d = data[idx];
          tooltip.textContent = `${d.year}: ${d.count} film${d.count !== 1 ? 's' : ''}`;
          tooltip.style.left = `${xRatio * 100}%`;
          tooltip.classList.remove('hidden');
        }
      });
      svg.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });
    }

    section.classList.remove('hidden');
  }

  // ── Box Office Profile ──

  function renderBoxOffice() {
    const section = $('ppBoxOffice');
    const container = $('ppBoxOfficeContent');
    if (!section || !container) return;

    const filmsWithRevenue = profileData.filmography.filter(f => f.revenue && f.revenue > 0);
    if (filmsWithRevenue.length === 0) return;

    const totalGross = filmsWithRevenue.reduce((sum, f) => sum + f.revenue, 0);
    const avgGross = totalGross / filmsWithRevenue.length;
    const biggest = filmsWithRevenue.reduce((a, b) => (a.revenue > b.revenue) ? a : b);

    const fmt = (n) => {
      if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
      if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
      return `$${(n / 1e3).toFixed(0)}K`;
    };

    container.innerHTML = `
      <div class="pp-box-stats">
        <div class="pp-box-stat">
          <span class="pp-box-stat-value">${fmt(totalGross)}</span>
          <span class="pp-box-stat-label">Total Gross</span>
        </div>
        <div class="pp-box-stat">
          <span class="pp-box-stat-value">${fmt(biggest.revenue)}</span>
          <span class="pp-box-stat-label">Biggest Hit</span>
          <span class="pp-box-stat-sub">${esc(biggest.title)}</span>
        </div>
        <div class="pp-box-stat">
          <span class="pp-box-stat-value">${fmt(avgGross)}</span>
          <span class="pp-box-stat-label">Average</span>
        </div>
      </div>
      <p class="pp-box-disclaimer">Figures approximate, sourced from TMDB</p>
    `;

    section.classList.remove('hidden');
  }

  // ── Recent Co-Stars Fallback ──

  async function getRecentCoStars(filmography, excludeId) {
    const recent = [...filmography]
      .filter(f => f.type === 'cast' && f.release_date)
      .sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
      .slice(0, 3);

    if (recent.length === 0) return [];

    const personMap = {};
    try {
      const results = await Promise.all(
        recent.map(f =>
          fetch(`https://api.themoviedb.org/3/movie/${f.id}/credits?api_key=${TMDB_API_KEY}`)
            .then(r => r.json())
            .catch(() => ({ cast: [] }))
        )
      );

      results.forEach((credits, idx) => {
        const film = recent[idx];
        const filmYear = film.release_date ? film.release_date.substring(0, 4) : '';
        (credits.cast || []).slice(0, 10).forEach(p => {
          if (!p.id || p.id === excludeId) return;
          if (!personMap[p.id]) {
            personMap[p.id] = {
              id: p.id,
              name: p.name,
              profile_path: p.profile_path,
              department: p.known_for_department || 'Acting',
              recent_film: { title: film.title, year: filmYear, id: film.id }
            };
          }
        });
      });
    } catch (err) {
      console.error('Recent co-stars fetch error:', err);
      return [];
    }

    return Object.values(personMap).slice(0, 6);
  }

  // ── Photo Gallery ──

  function renderPhotoGallery() {
    const section = $('ppPhotoGallery');
    const row = $('ppPhotoRow');
    if (!section || !row) return;

    const photos = profileData.images || [];
    if (photos.length === 0) return;

    galleryPhotos = photos;

    const countEl = $('ppGalleryCount');
    if (countEl) countEl.textContent = `(${photos.length})`;

    const thumbCount = Math.min(photos.length, 12);
    row.innerHTML = photos.slice(0, thumbCount).map((img, i) =>
      `<div class="pp-photo-thumb" data-idx="${i}">
        <img src="${TMDB_IMG}w185${img.file_path}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'">
      </div>`
    ).join('') + (photos.length > thumbCount
      ? `<div class="pp-photo-more" data-idx="${thumbCount}">+${photos.length - thumbCount}</div>`
      : '');

    row.addEventListener('click', (e) => {
      const thumb = e.target.closest('.pp-photo-thumb');
      const more = e.target.closest('.pp-photo-more');
      if (thumb) openLightbox(parseInt(thumb.dataset.idx));
      else if (more) openLightbox(parseInt(more.dataset.idx));
    });

    section.classList.remove('hidden');
  }

  function openLightbox(idx) {
    lightboxIndex = idx;
    updateLightboxImage();
    $('ppLightbox').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    $('ppLightbox').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const photo = galleryPhotos[lightboxIndex];
    if (!photo) return;
    const size = window.innerWidth > 768 ? 'w780' : 'w500';
    $('ppLightboxImg').src = `${TMDB_IMG}${size}${photo.file_path}`;
    $('ppLightboxCounter').textContent = `${lightboxIndex + 1} / ${galleryPhotos.length}`;
    $('ppLightboxPrev').style.visibility = lightboxIndex > 0 ? 'visible' : 'hidden';
    $('ppLightboxNext').style.visibility = lightboxIndex < galleryPhotos.length - 1 ? 'visible' : 'hidden';

    // Preload adjacent
    [-1, 1].forEach(offset => {
      const i = lightboxIndex + offset;
      if (i >= 0 && i < galleryPhotos.length) {
        const pre = new Image();
        pre.src = `${TMDB_IMG}${size}${galleryPhotos[i].file_path}`;
      }
    });
  }

  // ── Similar Actors ──

  function findSimilarActors() {
    const pool = profileData.castPool || [];
    if (pool.length === 0) return [];

    // Get profile person's top genre IDs
    const reverseGenreMap = {};
    Object.entries(GENRE_MAP).forEach(([id, name]) => { reverseGenreMap[name] = parseInt(id); });
    const topGenreIds = new Set(
      (profileData.genreBreakdown || []).slice(0, 3)
        .map(g => reverseGenreMap[g.name])
        .filter(Boolean)
    );

    // Get active decades
    const profileDecades = new Set();
    const span = profileData.careerSpan;
    if (span && span.from && span.to) {
      for (let d = Math.floor(span.from / 10) * 10; d <= span.to; d += 10) {
        profileDecades.add(d);
      }
    }

    const profilePop = profileData.person?.popularity || 0;
    const encountered = window.OrbitEncounters ? window.OrbitEncounters.getEncountered() : {};
    const collabIds = new Set((profileData.collaborators || []).map(c => c.id));

    return pool
      .filter(p => !collabIds.has(p.id))
      .map(p => {
        let score = 0;
        const pGenres = new Set(p.filmGenres || []);

        // +3 per shared genre
        topGenreIds.forEach(g => { if (pGenres.has(g)) score += 3; });

        // +2 per overlapping decade
        (p.filmYears || []).forEach(y => {
          const decade = Math.floor(parseInt(y) / 10) * 10;
          if (profileDecades.has(decade)) score += 2;
        });

        // +1 for similar popularity
        if (profilePop > 0 && p.popularity > 0) {
          const ratio = p.popularity / profilePop;
          if (ratio > 0.3 && ratio < 3) score += 1;
        }

        // +5 if not encountered
        const isEnc = !!encountered[String(p.id)];
        if (!isEnc) score += 5;

        return { ...p, score, isEncountered: isEnc };
      })
      .filter(p => p.score >= 4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  function renderSimilarActors() {
    const section = $('ppSimilarActors');
    const container = $('ppSimilarContent');
    if (!section || !container) return;

    const similar = findSimilarActors();
    if (similar.length < 3) return;

    // Update title with person name
    const titleEl = $('ppSimilarTitle');
    if (titleEl && profileData.person?.name) {
      const firstName = profileData.person.name.split(' ')[0];
      titleEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>
        If You Like ${esc(firstName)}, Try&hellip;
      `;
    }

    container.innerHTML = similar.map(p => {
      const photo = p.profile_path ? `${TMDB_IMG}w92${p.profile_path}` : DEFAULT_AVATAR;
      const topGenreId = (p.filmGenres || [])[0];
      const genreLabel = topGenreId ? (GENRE_MAP[topGenreId] || '') : '';
      const badge = p.isEncountered
        ? ''
        : '<span class="pp-sim-new-badge">NEW</span>';

      return `<a href="people-profile.html?id=${p.id}" class="pp-sim-card">
        ${badge}
        <img class="pp-sim-photo" src="${photo}" alt="${esc(p.name)}" loading="lazy"
             onerror="this.src='${DEFAULT_AVATAR}'">
        <span class="pp-sim-name">${esc(p.name)}</span>
        ${genreLabel ? `<span class="pp-sim-genre">${esc(genreLabel)}</span>` : ''}
      </a>`;
    }).join('');

    section.classList.remove('hidden');
  }

  // ── Sticky Pill Navigation ──

  function buildPillBar() {
    const scroll = $('ppPillScroll');
    const nav = $('ppPillNav');
    if (!scroll || !nav) return;

    const container = $('ppSectionsContainer');
    const sections = container
      ? container.querySelectorAll('.pp-section[data-section]')
      : document.querySelectorAll('.pp-section[data-section]');

    scroll.innerHTML = '';
    let visibleCount = 0;

    // People Cube pill (always first)
    if (typeof openPeopleCube === 'function' && personId) {
      const cubePill = document.createElement('button');
      cubePill.className = 'pp-pill pp-pill-cube';
      cubePill.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:3px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>Cube';
      cubePill.addEventListener('click', () => openPeopleCube(personId));
      scroll.appendChild(cubePill);
    }

    sections.forEach(sec => {
      if (sec.classList.contains('hidden') || sec.offsetHeight === 0) return;
      visibleCount++;
      const pill = document.createElement('button');
      pill.className = 'pp-pill';
      pill.textContent = sec.dataset.section;
      pill.dataset.target = sec.id;
      pill.addEventListener('click', () => {
        const navH = document.querySelector('.pp-back-nav')?.offsetHeight || 52;
        const pillH = nav.offsetHeight || 36;
        const top = sec.getBoundingClientRect().top + window.scrollY - navH - pillH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      });
      scroll.appendChild(pill);
    });

    if (visibleCount > 0) {
      nav.classList.remove('hidden');
      initScrollSpy();
    } else {
      nav.classList.add('hidden');
    }
  }

  function initScrollSpy() {
    if (scrollSpyObserver) scrollSpyObserver.disconnect();

    const navH = document.querySelector('.pp-back-nav')?.offsetHeight || 52;
    const pillH = $('ppPillNav')?.offsetHeight || 36;
    const rootMargin = `-${navH + pillH + 10}px 0px -60% 0px`;

    scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.pp-pill.active').forEach(p => p.classList.remove('active'));
          const pill = document.querySelector(`.pp-pill[data-target="${entry.target.id}"]`);
          if (pill) {
            pill.classList.add('active');
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    }, { rootMargin, threshold: 0.1 });

    const container = $('ppSectionsContainer');
    const sections = container
      ? container.querySelectorAll('.pp-section[data-section]:not(.hidden)')
      : document.querySelectorAll('.pp-section[data-section]:not(.hidden)');
    sections.forEach(sec => scrollSpyObserver.observe(sec));
  }

  // ── Draggable Section Reordering ──

  function initSectionReorder() {
    const container = $('ppSectionsContainer');
    if (!container) return;

    applySavedOrder(container);

    // Add drag handles to section titles
    container.querySelectorAll('.pp-section').forEach(sec => {
      const title = sec.querySelector('.pp-section-title');
      if (!title || title.querySelector('.pp-drag-handle')) return;
      const handle = document.createElement('span');
      handle.className = 'pp-drag-handle';
      handle.innerHTML = '&#8942;&#8942;';
      handle.title = 'Drag to reorder';
      title.prepend(handle);
    });

    if (isTouchDevice) {
      initMobileReorder(container);
    } else {
      initDesktopDrag(container);
    }

    // Reset layout link (only if custom order exists)
    if (localStorage.getItem(SECTION_ORDER_KEY)) {
      addResetLink(container);
    }
  }

  function applySavedOrder(container) {
    try {
      const saved = localStorage.getItem(SECTION_ORDER_KEY);
      if (!saved) return;
      const order = JSON.parse(saved);
      if (!Array.isArray(order)) return;

      order.forEach(id => {
        const sec = document.getElementById(id);
        if (sec && sec.parentElement === container) {
          container.appendChild(sec);
        }
      });
    } catch { /* ignore */ }
  }

  function saveSectionOrder(container) {
    const order = Array.from(container.querySelectorAll('.pp-section'))
      .map(sec => sec.id)
      .filter(Boolean);
    localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(order));
  }

  function initDesktopDrag(container) {
    let draggedEl = null;

    container.querySelectorAll('.pp-section').forEach(sec => {
      const handle = sec.querySelector('.pp-drag-handle');
      if (!handle) return;

      handle.addEventListener('mousedown', () => {
        sec.setAttribute('draggable', 'true');
      });

      sec.addEventListener('dragstart', (e) => {
        draggedEl = sec;
        sec.classList.add('pp-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', sec.id);
        setTimeout(() => { sec.style.opacity = '0.4'; }, 0);
      });

      sec.addEventListener('dragend', () => {
        sec.classList.remove('pp-dragging');
        sec.style.opacity = '';
        sec.removeAttribute('draggable');
        draggedEl = null;
        saveSectionOrder(container);
        buildPillBar();
      });

      sec.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!draggedEl || draggedEl === sec) return;
        const rect = sec.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          container.insertBefore(draggedEl, sec);
        } else {
          container.insertBefore(draggedEl, sec.nextSibling);
        }
      });
    });

    document.addEventListener('mouseup', () => {
      container.querySelectorAll('.pp-section[draggable]').forEach(sec => {
        sec.removeAttribute('draggable');
      });
    });
  }

  function initMobileReorder(container) {
    const btn = document.createElement('button');
    btn.className = 'pp-reorder-mobile-btn';
    btn.textContent = 'Reorder Sections';
    btn.addEventListener('click', () => openReorderModal(container));
    container.parentElement.insertBefore(btn, container);
  }

  function openReorderModal(container) {
    const modal = document.createElement('div');
    modal.className = 'pp-reorder-modal';
    modal.innerHTML = `
      <div class="pp-reorder-modal-backdrop"></div>
      <div class="pp-reorder-modal-panel">
        <div class="pp-reorder-modal-header">
          <h3>Reorder Sections</h3>
          <button class="pp-reorder-modal-close">&times;</button>
        </div>
        <ul class="pp-reorder-list" id="ppReorderList"></ul>
        <div class="pp-reorder-modal-footer">
          <button class="pp-reorder-reset">Reset to Default</button>
          <button class="pp-reorder-done">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const list = modal.querySelector('#ppReorderList');

    function populateList() {
      list.innerHTML = '';
      const sections = Array.from(container.querySelectorAll('.pp-section'));
      sections.forEach((sec, i) => {
        const label = sec.dataset.section || sec.id;
        const isHidden = sec.classList.contains('hidden');
        const li = document.createElement('li');
        li.className = 'pp-reorder-item' + (isHidden ? ' dimmed' : '');
        li.innerHTML = `
          <span class="pp-reorder-item-label">${esc(label)}</span>
          <div class="pp-reorder-arrows">
            <button class="pp-reorder-up" ${i === 0 ? 'disabled' : ''}>&#9650;</button>
            <button class="pp-reorder-down" ${i === sections.length - 1 ? 'disabled' : ''}>&#9660;</button>
          </div>
        `;
        li.querySelector('.pp-reorder-up').addEventListener('click', () => {
          if (i > 0) { container.insertBefore(sec, sections[i - 1]); populateList(); }
        });
        li.querySelector('.pp-reorder-down').addEventListener('click', () => {
          if (i < sections.length - 1) { container.insertBefore(sections[i + 1], sec); populateList(); }
        });
        list.appendChild(li);
      });
    }

    populateList();

    const closeModal = () => {
      saveSectionOrder(container);
      buildPillBar();
      modal.remove();
    };

    modal.querySelector('.pp-reorder-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.pp-reorder-modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.pp-reorder-done').addEventListener('click', closeModal);
    modal.querySelector('.pp-reorder-reset').addEventListener('click', () => {
      localStorage.removeItem(SECTION_ORDER_KEY);
      DEFAULT_SECTION_ORDER.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) container.appendChild(sec);
      });
      populateList();
    });
  }

  function addResetLink(container) {
    if (container.parentElement.querySelector('.pp-reset-layout')) return;
    const link = document.createElement('button');
    link.className = 'pp-reset-layout';
    link.textContent = 'Reset Layout';
    link.addEventListener('click', () => {
      localStorage.removeItem(SECTION_ORDER_KEY);
      DEFAULT_SECTION_ORDER.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) container.appendChild(sec);
      });
      saveSectionOrder(container);
      buildPillBar();
      link.remove();
    });
    container.after(link);
  }

  // ── Scroll Reveal ──

  function initScrollReveal() {
    const sections = document.querySelectorAll('#ppFootprint, #ppSignatureRoles, #ppCareerArc, #ppDna, #ppBoxOffice, #ppConnections, #ppAwards, #ppNebula, #ppDidYouKnow, #ppPhotoGallery, #ppSimilarActors, #ppFilmography');
    sections.forEach((el, i) => {
      el.classList.add('pp-reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(el => observer.observe(el));
  }

})();
