// ============================================
// SHARED PEOPLE CUBE COMPONENT
// Purple-themed 3D card popup for actors/directors
// Mirrors MovieCube architecture
// ============================================

(function() {
  'use strict';

  // ── Constants ──

  const PCUBE_CACHE_KEY = 'orbit_pcube_cache';
  const PCUBE_CACHE_TTL = 3600000; // 1 hour
  const PCUBE_CACHE_MAX = 30;

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23111827' width='150' height='150' rx='75'/%3E%3Ccircle cx='75' cy='55' r='30' fill='%2364748b'/%3E%3Cellipse cx='75' cy='130' rx='45' ry='40' fill='%2364748b'/%3E%3C/svg%3E";

  const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  };

  // Award category filtering (from people-profile.js)
  const PERSON_AWARD_CATEGORIES = new Set([
    'Best Actor', 'Best Actress', 'Best Director',
    'Silver Bear (Director)', 'Silver Lion (Director)'
  ]);
  const ACTING_CATEGORIES = new Set(['Best Actor', 'Best Actress']);
  const DIRECTING_CATEGORIES = new Set([
    'Best Director', 'Silver Bear (Director)', 'Silver Lion (Director)'
  ]);

  // ── State ──

  let pcubeOverlay, pcubeCube, pcubeLoading;
  let currentFace = 1;
  let pcubePersonData = null;
  let onMovieClick = null;

  // Path prefix for navigation
  const isGamesPage = location.pathname.includes('/games/');
  const rootPrefix = isGamesPage ? '../' : '';
  const gamesPrefix = isGamesPage ? '' : 'games/';

  // ── SessionStorage Cache ──

  function getCached(personId) {
    try {
      var raw = sessionStorage.getItem(PCUBE_CACHE_KEY);
      if (!raw) return null;
      var cache = JSON.parse(raw);
      var entry = cache[personId];
      if (!entry) return null;
      if (Date.now() - entry.cached_at > PCUBE_CACHE_TTL) {
        delete cache[personId];
        sessionStorage.setItem(PCUBE_CACHE_KEY, JSON.stringify(cache));
        return null;
      }
      return entry.data;
    } catch (e) { return null; }
  }

  function setCache(personId, data) {
    try {
      var raw = sessionStorage.getItem(PCUBE_CACHE_KEY);
      var cache = raw ? JSON.parse(raw) : {};
      cache[personId] = { cached_at: Date.now(), data: data };
      var keys = Object.keys(cache);
      if (keys.length > PCUBE_CACHE_MAX) {
        var sorted = keys.sort(function(a, b) { return cache[a].cached_at - cache[b].cached_at; });
        delete cache[sorted[0]];
      }
      sessionStorage.setItem(PCUBE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* quota */ }
  }

  // ── Data Functions (inlined from people-profile.js IIFE) ──

  function buildFilmography(credits) {
    var seen = new Set();
    var films = [];
    var filmMap = {};

    (credits.cast || []).forEach(function(m) {
      if (!m.id || seen.has(m.id)) return;
      seen.add(m.id);
      var film = {
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

    (credits.crew || []).forEach(function(m) {
      if (!m.id) return;
      if (seen.has(m.id)) {
        var existing = filmMap[m.id];
        if (existing) {
          if (!existing.role) existing.role = m.job;
          if (m.job) existing.crewJobs.push(m.job);
        }
        return;
      }
      seen.add(m.id);
      var film = {
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
    var relevantCredits;
    switch (knownForDept) {
      case 'Acting':
        relevantCredits = credits.cast || [];
        break;
      case 'Directing':
        relevantCredits = (credits.crew || []).filter(function(c) { return c.job === 'Director'; });
        break;
      case 'Writing':
        relevantCredits = (credits.crew || []).filter(function(c) { return c.department === 'Writing'; });
        break;
      case 'Production':
        relevantCredits = (credits.crew || []).filter(function(c) { return c.department === 'Production'; });
        break;
      default:
        relevantCredits = (credits.cast || []).length > 0 ? credits.cast : (credits.crew || []);
        break;
    }

    var counts = {};
    var total = 0;

    relevantCredits.forEach(function(m) {
      (m.genre_ids || []).forEach(function(gid) {
        var name = GENRE_MAP[gid];
        if (!name) return;
        counts[name] = (counts[name] || 0) + 1;
        total++;
      });
    });

    if (total === 0) return [];

    var sorted = Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; });
    var topGenres = sorted.slice(0, 8);

    return topGenres.map(function(entry) {
      return {
        name: entry[0],
        count: entry[1],
        pct: Math.round(entry[1] / total * 100)
      };
    });
  }

  function computeCareerSpan(filmography) {
    var earliest = 9999;
    var latest = 0;

    filmography.forEach(function(f) {
      if (!f.release_date) return;
      var year = parseInt(f.release_date.substring(0, 4));
      if (year && year < earliest) earliest = year;
      if (year && year > latest) latest = year;
    });

    if (earliest > latest) return { years: 0, from: null, to: null };
    return { years: latest - earliest, from: earliest, to: latest };
  }

  function getSignatureRoles(filmography) {
    var castFilms = filmography.filter(function(f) { return f.type === 'cast' && f.role; });
    return castFilms.map(function(f) {
      var quality = (f.vote_average || 0) * 2;
      var recognition = Math.log10((f.vote_count || 1)) * 3;
      var billing = (f.order != null && f.order <= 2) ? 5 : 0;
      var relevance = (f.popularity || 0) * 0.1;
      return Object.assign({}, f, { score: quality + recognition + billing + relevance });
    }).sort(function(a, b) { return b.score - a.score; }).slice(0, 5);
  }

  // For directors/crew — key films scored by quality
  function getKeyFilms(filmography) {
    var crewFilms = filmography.filter(function(f) { return f.type === 'crew' && f.release_date; });
    return crewFilms.map(function(f) {
      var quality = (f.vote_average || 0) * 2;
      var recognition = Math.log10((f.vote_count || 1)) * 3;
      var relevance = (f.popularity || 0) * 0.1;
      return Object.assign({}, f, { score: quality + recognition + relevance });
    }).sort(function(a, b) { return b.score - a.score; }).slice(0, 5);
  }

  // ── Award Functions ──

  function namesMatch(awardPerson, profileName) {
    if (!awardPerson || !profileName) return false;
    return awardPerson.trim().toLowerCase() === profileName.trim().toLowerCase();
  }

  function shouldIncludeAward(award, personName, knownForDept, personGender, roles) {
    var category = award.category;
    if (!PERSON_AWARD_CATEGORIES.has(category)) return true;
    if (award.person) return namesMatch(award.person, personName);
    if (ACTING_CATEGORIES.has(category)) {
      if (!roles.isCast || knownForDept !== 'Acting') return false;
      if (category === 'Best Actor') return personGender === 2;
      if (category === 'Best Actress') return personGender === 1;
      return false;
    }
    if (DIRECTING_CATEGORIES.has(category)) {
      return roles.crewJobs.some(function(job) { return job === 'Director'; });
    }
    return false;
  }

  function findAwards(filmography, personName, knownForDept, personGender) {
    if (!window.AWARDS_DATABASE) return [];
    var awards = [];
    filmography.forEach(function(film) {
      var entry = window.AWARDS_DATABASE[film.id];
      if (!entry) return;
      var roles = {
        isCast: film.type === 'cast',
        crewJobs: film.crewJobs || []
      };
      entry.awards.forEach(function(award) {
        if (shouldIncludeAward(award, personName, knownForDept, personGender, roles)) {
          awards.push(Object.assign({}, award, {
            filmTitle: entry.title,
            filmId: film.id
          }));
        }
      });
    });
    awards.sort(function(a, b) { return b.year - a.year; });
    return awards;
  }

  // ── Helpers ──

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return null;
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function calcAge(birthday, deathday) {
    if (!birthday) return null;
    var birth = new Date(birthday + 'T00:00:00');
    var end = deathday ? new Date(deathday + 'T00:00:00') : new Date();
    var age = end.getFullYear() - birth.getFullYear();
    var m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
    return age;
  }

  function imgUrl(path, size) {
    if (!path) return null;
    var base = typeof TMDB_IMG !== 'undefined' ? TMDB_IMG : 'https://image.tmdb.org/t/p/';
    return base + size + path;
  }

  // ── HTML Injection ──

  function injectPeopleCubeHTML() {
    var html = `
      <div class="pcube-overlay" id="peopleCubeOverlay" hidden>
        <div class="pcube-popup">
          <button class="pcube-close" id="pcubeCloseBtn">\u2715</button>
          <div class="pcube-nav">
            <button class="pcube-nav-btn active" data-face="1">Identity</button>
            <button class="pcube-nav-btn" data-face="2">Signature</button>
            <button class="pcube-nav-btn" data-face="3">Career</button>
            <button class="pcube-nav-btn" data-face="4">Explore</button>
          </div>
          <div class="pcube-scene">
            <div class="pcube-cube" id="peopleCube" data-face="1">
              <div class="pcube-face pcube-face-front" id="pcubeFace1">
                <div class="pcube-scroll" id="pcubeIdentity"></div>
              </div>
              <div class="pcube-face pcube-face-right" id="pcubeFace2">
                <div class="pcube-scroll" id="pcubeSignature"></div>
              </div>
              <div class="pcube-face pcube-face-back" id="pcubeFace3">
                <div class="pcube-scroll" id="pcubeCareer"></div>
              </div>
              <div class="pcube-face pcube-face-left" id="pcubeFace4">
                <div class="pcube-scroll" id="pcubeActions"></div>
              </div>
            </div>
            <div class="pcube-loading" id="pcubeLoading">
              <div class="pcube-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ── Events ──

  function setupEvents() {
    // Close button
    document.getElementById('pcubeCloseBtn').addEventListener('click', closePeopleCube);

    // Backdrop click
    document.getElementById('peopleCubeOverlay').addEventListener('click', function(e) {
      if (e.target === this) closePeopleCube();
    });

    // Keyboard: Escape to close, arrows to navigate
    document.addEventListener('keydown', function(e) {
      if (!pcubeOverlay || pcubeOverlay.hidden) return;
      if (e.key === 'Escape') {
        closePeopleCube();
      } else if (e.key === 'ArrowRight') {
        rotateTo(currentFace >= 4 ? 1 : currentFace + 1);
      } else if (e.key === 'ArrowLeft') {
        rotateTo(currentFace <= 1 ? 4 : currentFace - 1);
      }
    });

    // Nav button delegation
    document.addEventListener('click', function(e) {
      var navBtn = e.target.closest('#peopleCubeOverlay .pcube-nav-btn');
      if (navBtn) rotateTo(parseInt(navBtn.dataset.face));
    });

    // Movie poster clicks on Face 2
    document.addEventListener('click', function(e) {
      var card = e.target.closest('#peopleCubeOverlay .pcube-sig-card[data-movie-id]');
      if (card) {
        var movieId = parseInt(card.dataset.movieId);
        if (movieId) {
          closePeopleCube();
          if (onMovieClick) {
            onMovieClick(movieId);
          } else if (typeof openMovieCube === 'function') {
            openMovieCube(movieId);
          }
        }
      }
    });

    // Action button clicks on Face 4
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('#peopleCubeOverlay .pcube-action-btn');
      if (btn) handleAction(btn.dataset.action);
    });

    // Bookmark toggle on Face 4
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('#peopleCubeOverlay .pcube-bookmark-btn');
      if (btn) handleBookmark(btn);
    });

    // Swipe on mobile
    var startX = 0;
    var scene = document.querySelector('.pcube-scene');
    if (scene) {
      scene.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      scene.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            rotateTo(currentFace >= 4 ? 1 : currentFace + 1);
          } else {
            rotateTo(currentFace <= 1 ? 4 : currentFace - 1);
          }
        }
      }, { passive: true });
    }
  }

  // ── Navigation ──

  function rotateTo(faceNum) {
    currentFace = faceNum;
    if (pcubeCube) pcubeCube.dataset.face = faceNum.toString();
    document.querySelectorAll('#peopleCubeOverlay .pcube-nav-btn').forEach(function(btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.face) === faceNum);
    });
  }

  // ── Open / Close ──

  async function openPeopleCube(personId) {
    if (!pcubeOverlay) {
      console.warn('People Cube not initialized. Call initPeopleCube() first.');
      return;
    }

    personId = parseInt(personId);
    if (!personId || isNaN(personId)) return;

    // Mutual exclusion: close MovieCube if open
    if (typeof closeMovieCube === 'function') closeMovieCube();

    currentFace = 1;
    rotateTo(1);

    // Show overlay + loading
    pcubeOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (pcubeLoading) pcubeLoading.hidden = false;

    try {
      var data = getCached(personId);

      if (!data) {
        var apiKey = typeof TMDB_API_KEY !== 'undefined' ? TMDB_API_KEY : '';
        var responses = await Promise.all([
          fetch('https://api.themoviedb.org/3/person/' + personId + '?api_key=' + apiKey),
          fetch('https://api.themoviedb.org/3/person/' + personId + '/movie_credits?api_key=' + apiKey)
        ]);

        if (!responses[0].ok) throw new Error('Person fetch failed: ' + responses[0].status);

        var person = await responses[0].json();
        var credits = await responses[1].json();

        var filmography = buildFilmography(credits);
        var genreBreakdown = computeGenreBreakdown(credits, person.known_for_department);
        var careerSpan = computeCareerSpan(filmography);
        var signatureRoles = getSignatureRoles(filmography);
        var keyFilms = getKeyFilms(filmography);
        var awards = findAwards(filmography, person.name, person.known_for_department, person.gender);
        var prominentDecade = typeof calcProminentDecade === 'function' ? calcProminentDecade(filmography) : null;

        data = {
          person: person,
          filmography: filmography,
          genreBreakdown: genreBreakdown,
          careerSpan: careerSpan,
          signatureRoles: signatureRoles,
          keyFilms: keyFilms,
          awards: awards,
          prominentDecade: prominentDecade
        };

        setCache(personId, data);
      }

      pcubePersonData = data;

      // Log encounter
      if (window.OrbitEncounters) {
        window.OrbitEncounters.logEncounter({
          id: data.person.id,
          name: data.person.name,
          profile_path: data.person.profile_path,
          known_for_department: data.person.known_for_department
        }, 'peoplecube');
      }

      // Populate faces
      populateIdentityFace();
      populateSignatureFace();
      populateCareerFace();
      populateActionsFace();

      // Hide loading
      if (pcubeLoading) pcubeLoading.hidden = true;

    } catch (err) {
      console.error('Error opening People Cube:', err);
      closePeopleCube();
    }
  }

  function closePeopleCube() {
    if (pcubeOverlay) {
      pcubeOverlay.hidden = true;
      document.body.style.overflow = '';
    }
    pcubePersonData = null;
  }

  // ── Face 1: Identity ──

  function populateIdentityFace() {
    var el = document.getElementById('pcubeIdentity');
    if (!el) return;
    var p = pcubePersonData.person;
    var span = pcubePersonData.careerSpan;
    var filmCount = pcubePersonData.filmography.length;

    // Photo
    var photoHTML;
    if (p.profile_path) {
      photoHTML = '<img class="pcube-photo" src="' + imgUrl(p.profile_path, 'w300') + '" alt="' + esc(p.name) + '" onerror="this.style.display=\'none\'">';
    } else {
      photoHTML = '<div class="pcube-photo-placeholder"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>';
    }

    // Department
    var dept = p.known_for_department || 'Unknown';
    var deptLabel = dept === 'Acting' ? 'Actor' : dept === 'Directing' ? 'Director' : dept === 'Writing' ? 'Writer' : dept === 'Production' ? 'Producer' : dept;

    // Age
    var age = calcAge(p.birthday, p.deathday);

    // Career span text
    var careerText = '';
    if (span.from) {
      var toYear = span.to && span.to < new Date().getFullYear() - 1 ? span.to : 'present';
      careerText = span.from + ' \u2014 ' + toYear;
      if (span.years > 0) careerText += ' (' + span.years + ' years)';
    }

    // Meta rows
    var metaHTML = '';

    if (p.birthday) {
      var bornText = formatDate(p.birthday);
      if (age !== null && !p.deathday) bornText += ' (age ' + age + ')';
      metaHTML += '<div class="pcube-meta-row"><span class="pcube-meta-label">Born</span><span class="pcube-meta-value">' + bornText + '</span></div>';
    }

    if (p.deathday) {
      var diedText = formatDate(p.deathday);
      if (age !== null) diedText += ' (age ' + age + ')';
      metaHTML += '<div class="pcube-meta-row pcube-memorial"><span class="pcube-meta-label">Died</span><span class="pcube-meta-value">' + diedText + '</span></div>';
    }

    if (p.place_of_birth) {
      metaHTML += '<div class="pcube-meta-row"><span class="pcube-meta-label">From</span><span class="pcube-meta-value">' + esc(p.place_of_birth) + '</span></div>';
    }

    if (careerText) {
      metaHTML += '<div class="pcube-meta-row"><span class="pcube-meta-label">Career</span><span class="pcube-meta-value">' + careerText + '</span></div>';
    }

    metaHTML += '<div class="pcube-meta-row"><span class="pcube-meta-label">Credits</span><span class="pcube-meta-value">' + filmCount + ' films</span></div>';

    // Awards summary
    var awardsHTML = '';
    var awards = pcubePersonData.awards;
    if (awards.length > 0) {
      var wins = awards.filter(function(a) { return a.won; });
      var noms = awards.filter(function(a) { return !a.won; });
      var parts = [];
      if (wins.length > 0) {
        var festivalWins = {};
        wins.forEach(function(a) { festivalWins[a.festival] = (festivalWins[a.festival] || 0) + 1; });
        var topFestival = Object.entries(festivalWins).sort(function(a, b) { return b[1] - a[1]; });
        parts.push('\u00d7' + wins.length + ' win' + (wins.length !== 1 ? 's' : ''));
        if (topFestival.length > 0) parts[0] += ' (' + topFestival[0][0] + ')';
      }
      if (noms.length > 0) {
        parts.push('\u00d7' + noms.length + ' nom' + (noms.length !== 1 ? 's' : ''));
      }
      awardsHTML = '<div class="pcube-awards-line">\uD83C\uDFC6 ' + parts.join(' \u00b7 ') + '</div>';
    }

    el.innerHTML = photoHTML +
      '<h2 class="pcube-name">' + esc(p.name) + '</h2>' +
      '<span class="pcube-dept-badge">' + esc(deptLabel) + '</span>' +
      '<div class="pcube-meta">' + metaHTML + '</div>' +
      awardsHTML;
  }

  // ── Face 2: Signature Work ──

  function populateSignatureFace() {
    var el = document.getElementById('pcubeSignature');
    if (!el) return;
    var p = pcubePersonData.person;
    var dept = p.known_for_department || 'Acting';
    var isActor = dept === 'Acting';

    var roles = isActor ? pcubePersonData.signatureRoles : pcubePersonData.keyFilms;
    // Fallback: if actor has no cast roles, show key films
    if (roles.length === 0) roles = pcubePersonData.keyFilms;

    var heading = isActor ? 'Signature Roles' : 'Key Films';

    if (roles.length === 0) {
      el.innerHTML = '<div class="pcube-face-header">' + heading + '</div>' +
        '<p style="color:var(--ghost-gray);text-align:center;font-size:13px;margin-top:40px;">No credits found</p>';
      return;
    }

    var cardsHTML = roles.map(function(r) {
      var year = r.release_date ? r.release_date.substring(0, 4) : '';
      var posterHTML = r.poster_path
        ? '<img class="pcube-sig-poster" src="' + imgUrl(r.poster_path, 'w92') + '" alt="' + esc(r.title) + '" loading="lazy">'
        : '<div class="pcube-sig-no-poster">?</div>';
      var charHTML = r.role ? '<div class="pcube-sig-char">' + esc(r.role) + '</div>' : '';
      var ratingHTML = r.vote_average ? '<div class="pcube-sig-rating">\u2605 ' + r.vote_average.toFixed(1) + '</div>' : '';

      return '<div class="pcube-sig-card" data-movie-id="' + r.id + '">' +
        posterHTML +
        '<div class="pcube-sig-title">' + esc(r.title) + ' <span class="pcube-sig-year">' + year + '</span></div>' +
        charHTML +
        ratingHTML +
        '</div>';
    }).join('');

    el.innerHTML = '<div class="pcube-face-header">' + heading + '</div>' +
      '<div class="pcube-sig-grid">' + cardsHTML + '</div>';
  }

  // ── Face 3: Career Profile ──

  function populateCareerFace() {
    var el = document.getElementById('pcubeCareer');
    if (!el) return;
    var genres = pcubePersonData.genreBreakdown;
    var decade = pcubePersonData.prominentDecade;
    var filmCount = pcubePersonData.filmography.length;
    var awards = pcubePersonData.awards;

    var html = '';

    // Genre DNA
    if (genres.length > 0) {
      var topGenres = genres.slice(0, 4);
      var maxPct = topGenres[0].pct;

      html += '<div class="pcube-section-title">Genre DNA</div>';
      html += '<div class="pcube-genre-list">';
      topGenres.forEach(function(g) {
        var barWidth = Math.round(g.pct / maxPct * 100);
        html += '<div class="pcube-genre-row">' +
          '<span class="pcube-genre-name">' + esc(g.name) + '</span>' +
          '<div class="pcube-genre-bar"><div class="pcube-genre-fill" style="width:' + barWidth + '%"></div></div>' +
          '<span class="pcube-genre-pct">' + g.pct + '%</span>' +
          '</div>';
      });
      html += '</div>';
    }

    // Stats
    html += '<div class="pcube-section-title">Stats</div>';
    html += '<div class="pcube-stat-block">';

    if (decade) {
      html += '<div class="pcube-stat-row"><span class="pcube-stat-label">Most Prominent Decade</span><span class="pcube-stat-value">' + decade + 's</span></div>';
    }

    html += '<div class="pcube-stat-row"><span class="pcube-stat-label">Total Credits</span><span class="pcube-stat-value">' + filmCount + '</span></div>';

    // Awards summary
    if (awards.length > 0) {
      var wins = awards.filter(function(a) { return a.won; }).length;
      var noms = awards.filter(function(a) { return !a.won; }).length;
      var awardsText = '';
      if (wins > 0) awardsText += wins + ' win' + (wins !== 1 ? 's' : '');
      if (wins > 0 && noms > 0) awardsText += ', ';
      if (noms > 0) awardsText += noms + ' nom' + (noms !== 1 ? 's' : '');
      html += '<div class="pcube-stat-row"><span class="pcube-stat-label">Awards</span><span class="pcube-stat-value">' + awardsText + '</span></div>';
    }

    html += '</div>';

    // Encounter status
    html += '<div class="pcube-section-title">Encounter Status</div>';
    if (window.OrbitEncounters && window.OrbitEncounters.isEncountered(pcubePersonData.person.id)) {
      var count = window.OrbitEncounters.getEncounterCount(pcubePersonData.person.id);
      html += '<div class="pcube-encounter">' +
        '<div class="pcube-encounter-dot discovered"></div>' +
        '<div class="pcube-encounter-text"><strong>Discovered</strong><br>Encountered ' + count + ' time' + (count !== 1 ? 's' : '') + '</div>' +
        '</div>';
    } else {
      html += '<div class="pcube-encounter">' +
        '<div class="pcube-encounter-dot undiscovered"></div>' +
        '<div class="pcube-encounter-text">Not yet discovered<br><span style="color:var(--ghost-gray);font-size:11px;">This is your first encounter!</span></div>' +
        '</div>';
    }

    el.innerHTML = html;
  }

  // ── Face 4: Actions ──

  function populateActionsFace() {
    var el = document.getElementById('pcubeActions');
    if (!el) return;
    var p = pcubePersonData.person;

    // Check bookmark state
    var isBookmarked = false;
    if (window.OrbitEncounters) {
      try {
        var encountered = window.OrbitEncounters.getEncountered();
        var entry = encountered[String(p.id)];
        if (entry) isBookmarked = !!entry.bookmarked;
      } catch (e) { /* ignore */ }
    }

    el.innerHTML =
      '<div class="pcube-face-header">Explore</div>' +
      '<div class="pcube-actions-list">' +
        '<button class="pcube-action-btn" data-action="profile">' +
          '<div><div>Open Full Profile</div><div class="pcube-action-subtitle">Deep dive into their career</div></div>' +
          '<span class="pcube-action-arrow">\u2192</span>' +
        '</button>' +
        '<button class="pcube-action-btn" data-action="timeline">' +
          '<div><div>Sacred Timeline</div><div class="pcube-action-subtitle">Visual career chronology</div></div>' +
          '<span class="pcube-action-arrow">\u2192</span>' +
        '</button>' +
        '<button class="pcube-action-btn" data-action="observatory">' +
          '<div><div>The Observatory</div><div class="pcube-action-subtitle">People discovery hub</div></div>' +
          '<span class="pcube-action-arrow">\u2192</span>' +
        '</button>' +
      '</div>' +
      '<button class="pcube-bookmark-btn' + (isBookmarked ? ' bookmarked' : '') + '">' +
        '<span class="pcube-bookmark-star">' + (isBookmarked ? '\u2605' : '\u2606') + '</span>' +
        '<span class="pcube-bookmark-label">' + (isBookmarked ? 'Bookmarked' : 'Bookmark') + '</span>' +
      '</button>';
  }

  // ── Action Handlers ──

  function handleAction(action) {
    var p = pcubePersonData ? pcubePersonData.person : null;
    if (!p) return;
    closePeopleCube();

    switch (action) {
      case 'profile':
        window.location.href = rootPrefix + 'people-profile.html?id=' + p.id;
        break;
      case 'timeline':
        localStorage.removeItem('vennPeople');
        localStorage.setItem('timelineMovieId', String(p.id));
        localStorage.setItem('timelineType', 'person');
        localStorage.setItem('timelineMediaMode', 'both');
        var encodedName = encodeURIComponent(p.name || '');
        window.location.href = gamesPrefix + 'timeline.html?type=person&search=' + encodedName;
        break;
      case 'observatory':
        window.location.href = rootPrefix + 'people-library.html';
        break;
    }
  }

  function handleBookmark(btn) {
    if (!pcubePersonData || !window.OrbitEncounters) return;
    var personId = pcubePersonData.person.id;
    var newState = window.OrbitEncounters.toggleBookmark(personId);

    btn.classList.toggle('bookmarked', newState);
    var star = btn.querySelector('.pcube-bookmark-star');
    var label = btn.querySelector('.pcube-bookmark-label');
    if (star) star.textContent = newState ? '\u2605' : '\u2606';
    if (label) label.textContent = newState ? 'Bookmarked' : 'Bookmark';
  }

  // ── Init ──

  function initPeopleCube(options) {
    options = options || {};
    onMovieClick = options.onMovieClick || null;

    if (!document.getElementById('peopleCubeOverlay')) {
      injectPeopleCubeHTML();
    }

    pcubeOverlay = document.getElementById('peopleCubeOverlay');
    pcubeCube = document.getElementById('peopleCube');
    pcubeLoading = document.getElementById('pcubeLoading');

    setupEvents();
  }

  // ── Exports ──

  window.initPeopleCube = initPeopleCube;
  window.openPeopleCube = openPeopleCube;
  window.closePeopleCube = closePeopleCube;

})();
