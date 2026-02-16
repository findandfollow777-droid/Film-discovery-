// ============================================
// ORBIT - People Profile Page
// Rich profile view for actors, directors, etc.
// ============================================

(function() {
  'use strict';

  const CACHE_KEY = 'orbit_people_profiles_v2';
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
    window.location.href = 'games/timeline.html?type=person&search=' + encodedName;
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
        onPersonClick: (id, name) => {
          if (typeof closeMovieCube === 'function') closeMovieCube();
          window.location.href = `people-profile.html?id=${id}`;
        },
        onAnchorClick: (movie) => {
          localStorage.setItem('anchorMovie', JSON.stringify(movie));
          window.location.href = 'games/constellation.html';
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

    // Navigation buttons
    $('exploreOrbitBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `people-library.html?circle=${personId}`;
    });

    $('viewTimelineBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSacredTimeline(personId, profileData?.person?.name);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Let moviecube handle its own escape first
        const cubeOverlay = document.getElementById('movieCubeOverlay');
        if (cubeOverlay && !cubeOverlay.hidden) return;
        window.location.href = 'people-library.html';
      }
    });
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
      const [personRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`),
        fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`)
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

      // Fetch collaborators (top 3 popular movies)
      const collaborators = await findCollaborators(filmography, personId);

      profileData = {
        person,
        filmography,
        genreBreakdown,
        careerSpan,
        awards,
        collaborators,
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
    const top5 = sorted.slice(0, 5);
    const otherCount = sorted.slice(5).reduce((sum, [, c]) => sum + c, 0);

    const result = top5.map(([name, count]) => ({
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

    if (topFilms.length === 0) return [];

    const personCounts = {};

    try {
      const results = await Promise.all(
        topFilms.map(f =>
          fetch(`https://api.themoviedb.org/3/movie/${f.id}/credits?api_key=${TMDB_API_KEY}`)
            .then(r => r.json())
            .catch(() => ({ cast: [], crew: [] }))
        )
      );

      results.forEach(credits => {
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
              count: 0
            };
          }
          personCounts[p.id].count++;
        });
      });
    } catch (err) {
      console.error('Collaborator fetch error:', err);
      return [];
    }

    // Return people who appear in 2+ of the top 3 movies
    return Object.values(personCounts)
      .filter(p => p.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
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
    renderCareerDNA();
    renderConnections();
    renderAwards();
    renderNebula();
    renderDidYouKnow();
    renderFilmography();
    initScrollReveal();
  }

  function renderHero() {
    const p = profileData.person;

    // Photo
    const photo = $('ppPhoto');
    photo.src = p.profile_path ? `${TMDB_IMG}w185${p.profile_path}` : DEFAULT_AVATAR;
    photo.alt = p.name;
    photo.onerror = function() { this.src = DEFAULT_AVATAR; };
    fadeOutSkeleton($('ppSkeletonPhoto'), photo);

    // Name
    const nameEl = $('ppName');
    nameEl.textContent = p.name;
    fadeOutSkeleton($('ppSkeletonName'), nameEl);

    // Bookmark + Share
    const bmBtn = $('ppBookmarkBtn');
    bmBtn.classList.remove('hidden');
    $('ppShareBtn')?.classList.remove('hidden');
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

    bars.innerHTML = genres.map(g => `
      <div class="pp-dna-row">
        <span class="pp-dna-label">${g.name}</span>
        <div class="pp-dna-bar-track">
          <div class="pp-dna-bar-fill pp-genre-${g.cssClass}" data-width="${g.pct}"></div>
        </div>
        <span class="pp-dna-pct">${g.pct}%</span>
      </div>
    `).join('');

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
      container.innerHTML = '<p class="pp-collabs-empty">This person charts their own orbit — no frequent collaborators found.</p>';
      return;
    }

    container.innerHTML = collabs.map(c => {
      const photo = c.profile_path
        ? `${TMDB_IMG}w92${c.profile_path}`
        : DEFAULT_AVATAR;
      return `
        <a href="people-profile.html?id=${c.id}" class="pp-collab-card">
          <img class="pp-collab-photo" src="${photo}" alt="${esc(c.name)}" loading="lazy"
               onerror="this.src='${DEFAULT_AVATAR}'">
          <span class="pp-collab-name">${esc(c.name)}</span>
          <span class="pp-collab-count">${c.count} shared films</span>
          <span class="pp-collab-dept">${esc(c.department || '')}</span>
        </a>
      `;
    }).join('');
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
      const res = await fetch('nebula-seed-movies.json');
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

  // ── Scroll Reveal ──

  function initScrollReveal() {
    const sections = document.querySelectorAll('#ppFootprint, #ppDna, #ppConnections, #ppAwards, #ppNebula, #ppDidYouKnow, #ppFilmography');
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
