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

  // Trivia state
  var triviaQuestions = [];
  var triviaIndex = 0;
  var triviaScore = 0;
  var triviaAnswered = false;
  var triviaSessionResults = [];

  // Path prefix for navigation
  const _pagesPrefix = OrbitUtils.ROOT + 'pages/';

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
    var base = OrbitUtils.TMDB_IMG;
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
            <button class="pcube-nav-btn" data-face="5">Trivia</button>
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
              <div class="pcube-face pcube-face-top" id="pcubeFace5">
                <div class="pcube-scroll" id="pcubeTrivia"></div>
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
        rotateTo(currentFace >= 5 ? 1 : currentFace + 1);
      } else if (e.key === 'ArrowLeft') {
        rotateTo(currentFace <= 1 ? 5 : currentFace - 1);
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

    // Trivia option clicks on Face 5
    document.addEventListener('click', function(e) {
      var opt = e.target.closest('#peopleCubeOverlay .pcube-trivia-option');
      if (opt) handleActorTriviaAnswer(opt);
      var retry = e.target.closest('#peopleCubeOverlay .pcube-trivia-retry');
      if (retry) {
        if (pcubePersonData) {
          try { localStorage.removeItem('cube_actor_trivia_' + pcubePersonData.person.id); } catch (e) {}
        }
        populateActorTriviaFace();
      }
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
            rotateTo(currentFace >= 5 ? 1 : currentFace + 1);
          } else {
            rotateTo(currentFace <= 1 ? 5 : currentFace - 1);
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
          credits: credits,
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
      populateActorTriviaFace();

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

  // Trivia stats come from shared trivia-stats.js (window.getTriviaStats, etc.)

  // ── Trivia Cache ──

  function getActorTriviaCache(personId) {
    try {
      var data = JSON.parse(localStorage.getItem('cube_actor_trivia_' + personId));
      if (data && data.questions && data.questions.length === 3) return data;
    } catch (e) {}
    return null;
  }

  function setActorTriviaCache(personId, questions) {
    try {
      localStorage.setItem('cube_actor_trivia_' + personId, JSON.stringify({ questions: questions, ts: Date.now() }));
    } catch (e) {}
  }

  // ── Trivia Question Generation ──

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
  }

  function generateActorTriviaQuestions(data) {
    var pool = [];
    var person = data.person;
    var filmography = data.filmography;
    var credits = data.credits;
    var genreBreakdown = data.genreBreakdown;
    var careerSpan = data.careerSpan;

    // Only use cast credits with release dates for many templates
    var castFilms = (credits && credits.cast ? credits.cast : []).filter(function(m) {
      return m.title && m.release_date && m.release_date.length >= 4;
    });

    // 1. Film Ordering — Which film came first/last?
    if (castFilms.length >= 4) {
      var sorted = castFilms.slice().sort(function(a, b) {
        return a.release_date.localeCompare(b.release_date);
      });
      // "Which was the earliest?"
      var earliest = sorted[0];
      var laterFilms = shuffleArray(sorted.slice(Math.max(1, Math.floor(sorted.length * 0.3))).slice());
      var wrongs = laterFilms.slice(0, 3).map(function(f) { return f.title; });
      if (wrongs.length >= 3 && wrongs.indexOf(earliest.title) === -1) {
        pool.push({ q: 'Which was ' + esc(person.name) + "'s earliest film?", correct: earliest.title, wrongs: wrongs, category: 'filmography' });
      }
      // "Which was the most recent?"
      var latest = sorted[sorted.length - 1];
      var olderFilms = shuffleArray(sorted.slice(0, Math.floor(sorted.length * 0.7)).slice());
      var wrongs2 = olderFilms.slice(0, 3).map(function(f) { return f.title; });
      if (wrongs2.length >= 3 && wrongs2.indexOf(latest.title) === -1) {
        pool.push({ q: 'Which is ' + esc(person.name) + "'s most recent film?", correct: latest.title, wrongs: wrongs2, category: 'filmography' });
      }
    }

    // 2. Collaboration Count — How many films has this person appeared in? (buckets)
    if (filmography.length >= 5) {
      var count = filmography.length;
      var bucket;
      if (count < 10) bucket = '1\u201310';
      else if (count < 20) bucket = '11\u201320';
      else if (count < 30) bucket = '21\u201330';
      else if (count < 40) bucket = '31\u201340';
      else if (count < 50) bucket = '41\u201350';
      else if (count < 75) bucket = '51\u201375';
      else bucket = '75+';

      var allBuckets = ['1\u201310', '11\u201320', '21\u201330', '31\u201340', '41\u201350', '51\u201375', '75+'];
      var wrongBuckets = allBuckets.filter(function(b) { return b !== bucket; });
      shuffleArray(wrongBuckets);
      if (wrongBuckets.length >= 3) {
        pool.push({ q: 'Approximately how many film credits does ' + esc(person.name) + ' have?', correct: bucket, wrongs: wrongBuckets.slice(0, 3), category: 'career' });
      }
    }

    // 3. Most Common Genre
    if (genreBreakdown.length >= 3) {
      var topGenre = genreBreakdown[0].name;
      var otherGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']
        .filter(function(g) { return g !== topGenre; });
      shuffleArray(otherGenres);
      if (otherGenres.length >= 3) {
        pool.push({ q: 'What is ' + esc(person.name) + "'s most common genre?", correct: topGenre, wrongs: otherGenres.slice(0, 3), category: 'career' });
      }
    }

    // 4. Career Debut — What year did their career begin?
    if (careerSpan.from && castFilms.length >= 3) {
      var debutYear = String(careerSpan.from);
      var offsets = [-5, 3, -8, 6, -3, 10];
      var wrongYears = [];
      for (var oi = 0; oi < offsets.length && wrongYears.length < 3; oi++) {
        var wy = String(careerSpan.from + offsets[oi]);
        if (parseInt(wy) >= 1920 && wy !== debutYear && wrongYears.indexOf(wy) === -1) {
          wrongYears.push(wy);
        }
      }
      if (wrongYears.length >= 3) {
        pool.push({ q: 'In what year did ' + esc(person.name) + "'s film career begin?", correct: debutYear, wrongs: wrongYears, category: 'career' });
      }
    }

    // 5. Most Active Decade
    if (castFilms.length >= 5) {
      var decadeCounts = {};
      castFilms.forEach(function(f) {
        var yr = parseInt(f.release_date.substring(0, 4));
        if (yr) {
          var dec = Math.floor(yr / 10) * 10;
          decadeCounts[dec] = (decadeCounts[dec] || 0) + 1;
        }
      });
      var decades = Object.entries(decadeCounts).sort(function(a, b) { return b[1] - a[1]; });
      if (decades.length >= 2) {
        var topDecade = decades[0][0] + 's';
        var allDecades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
          .filter(function(d) { return d !== topDecade; });
        shuffleArray(allDecades);
        if (allDecades.length >= 3) {
          pool.push({ q: 'In which decade was ' + esc(person.name) + ' most active?', correct: topDecade, wrongs: allDecades.slice(0, 3), category: 'career' });
        }
      }
    }

    // 6. Birthplace
    if (person.place_of_birth && person.place_of_birth.length > 3) {
      var birthplace = person.place_of_birth;
      var fakePlaces = [
        'Los Angeles, California, USA', 'London, England, UK', 'New York City, New York, USA',
        'Sydney, New South Wales, Australia', 'Toronto, Ontario, Canada', 'Paris, France',
        'Dublin, Ireland', 'Mumbai, Maharashtra, India', 'Berlin, Germany',
        'Stockholm, Sweden', 'Tokyo, Japan', 'Seoul, South Korea',
        'Rome, Italy', 'Mexico City, Mexico', 'Buenos Aires, Argentina'
      ].filter(function(p) { return p !== birthplace; });
      shuffleArray(fakePlaces);
      if (fakePlaces.length >= 3) {
        pool.push({ q: 'Where was ' + esc(person.name) + ' born?', correct: birthplace, wrongs: fakePlaces.slice(0, 3), category: 'personal' });
      }
    }

    // 7. NOT In Film — Which film did they NOT appear in?
    if (castFilms.length >= 5) {
      var personFilmIds = {};
      castFilms.forEach(function(f) { personFilmIds[f.id] = true; });
      var realFilmTitles = castFilms.map(function(f) { return f.title; });
      // Fallback "wrong" titles (famous films the person likely wasn't in)
      var decoyFilms = [
        'The Godfather', 'Pulp Fiction', 'The Shawshank Redemption', 'Forrest Gump',
        'Titanic', 'The Matrix', 'Jurassic Park', 'Star Wars', 'Jaws',
        'Schindler\'s List', 'Fight Club', 'Goodfellas', 'Gladiator',
        'The Dark Knight', 'Inception', 'Interstellar', 'Parasite',
        'Spirited Away', 'Toy Story', 'Finding Nemo', 'The Lion King',
        'Avatar', 'Oppenheimer', 'Barbie', 'Everything Everywhere All at Once'
      ].filter(function(t) { return realFilmTitles.indexOf(t) === -1; });

      if (decoyFilms.length > 0) {
        shuffleArray(decoyFilms);
        var correctNotIn = decoyFilms[0];
        var wrongsActualFilms = shuffleArray(realFilmTitles.slice()).slice(0, 3);
        if (wrongsActualFilms.length >= 3) {
          pool.push({ q: 'Which film did ' + esc(person.name) + ' NOT appear in?', correct: correctNotIn, wrongs: wrongsActualFilms, category: 'filmography' });
        }
      }
    }

    // 8. Total Films in a Decade
    if (castFilms.length >= 8) {
      var decCounts2 = {};
      castFilms.forEach(function(f) {
        var yr = parseInt(f.release_date.substring(0, 4));
        if (yr) {
          var dec = Math.floor(yr / 10) * 10;
          decCounts2[dec] = (decCounts2[dec] || 0) + 1;
        }
      });
      var decEntries = Object.entries(decCounts2).filter(function(e) { return e[1] >= 3; });
      if (decEntries.length > 0) {
        shuffleArray(decEntries);
        var pickedDec = decEntries[0];
        var decLabel = pickedDec[0] + 's';
        var correctNum = String(pickedDec[1]);
        var wrongNums = [];
        var numOffsets = [-3, 2, 5, -2, 4, -5];
        for (var ni = 0; ni < numOffsets.length && wrongNums.length < 3; ni++) {
          var wn = String(Math.max(1, parseInt(pickedDec[1]) + numOffsets[ni]));
          if (wn !== correctNum && wrongNums.indexOf(wn) === -1) wrongNums.push(wn);
        }
        if (wrongNums.length >= 3) {
          pool.push({ q: 'How many films did ' + esc(person.name) + ' appear in during the ' + decLabel + '?', correct: correctNum, wrongs: wrongNums, category: 'career' });
        }
      }
    }

    // Shuffle pool and pick 3
    shuffleArray(pool);
    var selected = pool.slice(0, 3);
    var questions = [];

    for (var si = 0; si < selected.length; si++) {
      var item = selected[si];
      var options = [item.correct].concat(item.wrongs.slice(0, 3));
      shuffleArray(options);
      questions.push({
        question: item.q,
        options: options,
        correctAnswer: item.correct,
        category: item.category || 'general'
      });
    }

    return questions;
  }

  // ── Face 5: Trivia ──

  function populateActorTriviaFace() {
    var el = document.getElementById('pcubeTrivia');
    if (!el || !pcubePersonData) return;

    var personId = pcubePersonData.person.id;
    var cached = getActorTriviaCache(personId);

    if (cached) {
      triviaQuestions = cached.questions;
    } else {
      triviaQuestions = generateActorTriviaQuestions(pcubePersonData);
      if (triviaQuestions.length > 0) {
        setActorTriviaCache(personId, triviaQuestions);
      }
    }

    triviaIndex = 0;
    triviaScore = 0;
    triviaAnswered = false;
    triviaSessionResults = [];

    if (triviaQuestions.length === 0) {
      el.innerHTML = '<div class="pcube-face-header">Trivia</div>' +
        '<p style="color:var(--ghost-gray);text-align:center;font-size:13px;margin-top:40px;">Not enough data to generate trivia for this person.</p>';
      return;
    }

    var stats = getTriviaStats();
    var accuracy = getTriviaAccuracy();
    var alreadyCompleted = (stats.actorsCompleted || []).indexOf(personId) !== -1;

    el.innerHTML = '<div class="pcube-face-header">Trivia</div>' +
      '<div class="pcube-trivia-stats-bar" id="pcubeTriviaStatsBar">' +
        '<div class="pcube-trivia-stat-pill"><span class="pcube-trivia-pill-icon">\u2022</span><span>' + accuracy + '%</span></div>' +
        '<div class="pcube-trivia-stat-pill"><span class="pcube-trivia-pill-icon">\u26A1</span><span>' + stats.currentStreak + '</span></div>' +
        '<div class="pcube-trivia-stat-pill"><span class="pcube-trivia-pill-icon">\u2713</span><span>' + (stats.actorsQuizzed || 0) + '</span></div>' +
      '</div>' +
      (alreadyCompleted ? '<div class="pcube-trivia-completed-badge">Completed \u2014 play again?</div>' : '') +
      '<div class="pcube-trivia-progress" id="pcubeTriviaProgress"></div>' +
      '<div class="pcube-trivia-question" id="pcubeTriviaQuestion"></div>' +
      '<div class="pcube-trivia-options" id="pcubeTriviaOptions"></div>' +
      '<div class="pcube-trivia-score" id="pcubeTriviaScore"></div>';

    renderActorTriviaQuestion();
  }

  function renderActorTriviaQuestion() {
    var progressEl = document.getElementById('pcubeTriviaProgress');
    var questionEl = document.getElementById('pcubeTriviaQuestion');
    var optionsEl = document.getElementById('pcubeTriviaOptions');
    var scoreEl = document.getElementById('pcubeTriviaScore');
    if (!progressEl || !questionEl || !optionsEl || !scoreEl) return;

    // Progress dots
    var dotsHTML = '';
    for (var i = 0; i < triviaQuestions.length; i++) {
      var cls = 'pcube-trivia-dot';
      if (i === triviaIndex) cls += ' active';
      dotsHTML += '<span class="' + cls + '" data-idx="' + i + '"></span>';
    }
    progressEl.innerHTML = dotsHTML;

    var q = triviaQuestions[triviaIndex];
    questionEl.textContent = q.question;

    var optsHTML = '';
    for (var oi = 0; oi < q.options.length; oi++) {
      optsHTML += '<button class="pcube-trivia-option" data-idx="' + oi + '">' + esc(q.options[oi]) + '</button>';
    }
    optionsEl.innerHTML = optsHTML;

    scoreEl.textContent = 'Score: ' + triviaScore + ' / ' + triviaQuestions.length;
    triviaAnswered = false;
  }

  function handleActorTriviaAnswer(btn) {
    if (triviaAnswered) return;
    triviaAnswered = true;

    var q = triviaQuestions[triviaIndex];
    var selected = btn.textContent;
    var isCorrect = selected === q.correctAnswer;

    // Mark all buttons
    var optionsEl = document.getElementById('pcubeTriviaOptions');
    var buttons = optionsEl.querySelectorAll('.pcube-trivia-option');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.add('pcube-trivia-answered');
      if (buttons[i].textContent === q.correctAnswer) {
        buttons[i].classList.add('pcube-trivia-correct');
      }
    }

    if (isCorrect) {
      triviaScore++;
      btn.classList.add('pcube-trivia-correct');
    } else {
      btn.classList.add('pcube-trivia-wrong');
    }

    // Record stats
    var category = q.category || 'general';
    triviaSessionResults.push({ category: category, isCorrect: isCorrect });
    var updatedStats = recordTriviaAnswer(category, isCorrect, 'actorCube');

    // Update stats bar
    var statsBar = document.getElementById('pcubeTriviaStatsBar');
    if (statsBar) {
      var pills = statsBar.querySelectorAll('.pcube-trivia-stat-pill span:last-child');
      if (pills[0]) pills[0].textContent = getTriviaAccuracy() + '%';
      if (pills[1]) pills[1].textContent = updatedStats.currentStreak;
    }

    // Update progress dot
    var dots = document.querySelectorAll('#pcubeTriviaProgress .pcube-trivia-dot');
    if (dots[triviaIndex]) {
      dots[triviaIndex].classList.remove('active');
      dots[triviaIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    }

    // Update score
    var scoreEl = document.getElementById('pcubeTriviaScore');
    if (scoreEl) scoreEl.textContent = 'Score: ' + triviaScore + ' / ' + triviaQuestions.length;

    // Advance after delay
    setTimeout(function() {
      triviaIndex++;
      if (triviaIndex < triviaQuestions.length) {
        renderActorTriviaQuestion();
      } else {
        showActorTriviaResult();
      }
    }, 1200);
  }

  function showActorTriviaResult() {
    var el = document.getElementById('pcubeTrivia');
    if (!el || !pcubePersonData) return;

    var total = triviaQuestions.length;
    var personId = pcubePersonData.person.id;
    var stats = recordTriviaRoundComplete('actor', personId, triviaScore, total);
    var accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
    var perfect = triviaScore === total;
    var label = perfect ? 'Perfect score!' : triviaScore >= total * 0.66 ? 'Well done!' : triviaScore >= total * 0.33 ? 'Not bad!' : 'Better luck next time!';

    var catMap = { filmography: 'Filmography', career: 'Career', personal: 'Personal', general: 'General' };
    var catAgg = {};
    for (var i = 0; i < triviaSessionResults.length; i++) {
      var r = triviaSessionResults[i];
      if (!catAgg[r.category]) catAgg[r.category] = { correct: 0, total: 0 };
      catAgg[r.category].total++;
      if (r.isCorrect) catAgg[r.category].correct++;
    }

    var catRows = '';
    var catEntries = Object.entries(catAgg);
    for (var ci = 0; ci < catEntries.length; ci++) {
      var cat = catEntries[ci][0];
      var catData = catEntries[ci][1];
      var pct = Math.round((catData.correct / catData.total) * 100);
      var color = pct === 100 ? '#a855f7' : pct >= 50 ? 'var(--muted-silver)' : 'var(--danger-red, #ef4444)';
      catRows += '<div class="pcube-trivia-cat-row">' +
        '<span class="pcube-trivia-cat-name">' + (catMap[cat] || cat) + '</span>' +
        '<span class="pcube-trivia-cat-score" style="color:' + color + '">' + catData.correct + '/' + catData.total + '</span>' +
        '</div>';
    }

    el.innerHTML =
      '<div class="pcube-trivia-final">' +
        '<div class="pcube-face-header">Trivia Complete!</div>' +
        '<div class="pcube-trivia-final-score">' + triviaScore + ' / ' + total + '</div>' +
        '<div class="pcube-trivia-final-label">' + label + '</div>' +
        (perfect ? '<div class="pcube-trivia-perfect-badge">\u2605 PERFECT</div>' : '') +
        '<div class="pcube-trivia-session-cats">' + catRows + '</div>' +
        '<div class="pcube-trivia-lifetime">' +
          '<div class="pcube-trivia-lifetime-row"><span>Lifetime Accuracy</span><span class="pcube-trivia-lifetime-val">' + accuracy + '%</span></div>' +
          '<div class="pcube-trivia-lifetime-row"><span>Answer Streak</span><span class="pcube-trivia-lifetime-val">' + stats.currentStreak + '</span></div>' +
          '<div class="pcube-trivia-lifetime-row"><span>Best Streak</span><span class="pcube-trivia-lifetime-val">' + stats.bestStreak + '</span></div>' +
          '<div class="pcube-trivia-lifetime-row"><span>People Quizzed</span><span class="pcube-trivia-lifetime-val">' + (stats.actorsQuizzed || 0) + '</span></div>' +
          '<div class="pcube-trivia-lifetime-row"><span>Perfect Rounds</span><span class="pcube-trivia-lifetime-val">' + stats.perfectRounds + '</span></div>' +
        '</div>' +
        '<button class="pcube-trivia-retry">Play Again</button>' +
      '</div>';
  }

  // ── Action Handlers ──

  function handleAction(action) {
    var p = pcubePersonData ? pcubePersonData.person : null;
    if (!p) return;
    closePeopleCube();

    switch (action) {
      case 'profile':
        window.location.href = _pagesPrefix + 'people-profile.html?id=' + p.id;
        break;
      case 'timeline':
        localStorage.removeItem('vennPeople');
        localStorage.setItem('timelineMovieId', String(p.id));
        localStorage.setItem('timelineType', 'person');
        localStorage.setItem('timelineMediaMode', 'both');
        var encodedName = encodeURIComponent(p.name || '');
        window.location.href = _pagesPrefix + 'timeline.html?type=person&search=' + encodedName;
        break;
      case 'observatory':
        window.location.href = _pagesPrefix + 'people-library.html';
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
