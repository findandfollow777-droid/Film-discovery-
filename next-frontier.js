/* ============================================
   NEXT FRONTIER — Controller
============================================ */
(function () {
  'use strict';

  var U = window.OrbitUtils || {};
  var TMDB_BASE = U.TMDB_BASE || 'https://api.themoviedb.org/3';
  var API_KEY = typeof TMDB_API_KEY !== 'undefined' ? TMDB_API_KEY : '';

  /* ── Service definitions per region ── */
  var SERVICES = {
    AU: [
      { id: 8,   name: 'Netflix',     cls: 'netflix' },
      { id: 119, name: 'Prime',       cls: 'prime' },
      { id: 350, name: 'Apple TV+',   cls: 'apple' },
      { id: 337, name: 'Disney+',     cls: 'disney' },
      { id: 184, name: 'Binge',       cls: 'binge' },
      { id: 531, name: 'Paramount+',  cls: 'paramount' }
    ],
    US: [
      { id: 8,   name: 'Netflix',     cls: 'netflix' },
      { id: 9,   name: 'Prime',       cls: 'prime' },
      { id: 350, name: 'Apple TV+',   cls: 'apple' },
      { id: 337, name: 'Disney+',     cls: 'disney' },
      { id: 531, name: 'Paramount+',  cls: 'paramount' },
      { id: 1899,name: 'Max',         cls: 'binge' }
    ],
    GB: [
      { id: 8,   name: 'Netflix',     cls: 'netflix' },
      { id: 9,   name: 'Prime',       cls: 'prime' },
      { id: 350, name: 'Apple TV+',   cls: 'apple' },
      { id: 337, name: 'Disney+',     cls: 'disney' },
      { id: 531, name: 'Paramount+',  cls: 'paramount' }
    ],
    NZ: [
      { id: 8,   name: 'Netflix',     cls: 'netflix' },
      { id: 119, name: 'Prime',       cls: 'prime' },
      { id: 350, name: 'Apple TV+',   cls: 'apple' },
      { id: 337, name: 'Disney+',     cls: 'disney' }
    ],
    CA: [
      { id: 8,   name: 'Netflix',     cls: 'netflix' },
      { id: 9,   name: 'Prime',       cls: 'prime' },
      { id: 350, name: 'Apple TV+',   cls: 'apple' },
      { id: 337, name: 'Disney+',     cls: 'disney' },
      { id: 531, name: 'Paramount+',  cls: 'paramount' }
    ]
  };

  /* ── State ── */
  var state = {
    region: localStorage.getItem('orbit_nf_region') || 'AU',
    tab: localStorage.getItem('orbit_nf_tab') || 'bigscreen',
    view: 'schedule',
    streamType: 'movie',
    upcoming: [],           // flat film list for Big Screen
    wantToSee: JSON.parse(localStorage.getItem('orbit_want_to_see') || '[]'),
    enabledServices: JSON.parse(localStorage.getItem('orbit_nf_services') || 'null'),
    monthOffset: 0,
    streamSort: 'newest',
    filterGenre: '',
    filterSearch: '',
    filterWhere: 'all',
    filterAwards: false,
    streamFilterGenre: '',
    streamFilterSearch: '',
    streamTimeFilter: 'month',
    streamData: {}          // keyed by serviceId_region_type
  };

  /* ── DOM refs ── */
  var $ = function (id) { return document.getElementById(id); };

  /* ── TMDB fetch helper ── */
  function tmdbGet(endpoint, params) {
    var qs = 'api_key=' + API_KEY;
    if (params) Object.keys(params).forEach(function (k) {
      if (params[k] != null) qs += '&' + k + '=' + encodeURIComponent(params[k]);
    });
    return fetch(TMDB_BASE + endpoint + '?' + qs).then(function (r) { return r.json(); });
  }

  function imgUrl(path, size) {
    return U.tmdbImageUrl ? U.tmdbImageUrl(path, size) : (path ? 'https://image.tmdb.org/t/p/' + (size || 'w500') + path : null);
  }

  /* ── Date helpers ── */
  var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  function toDate(s) { return new Date(s + 'T00:00:00'); }
  function fmtDate(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function fmtDateFull(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function isoDate(d) { return d.toISOString().slice(0, 10); }

  function daysUntil(dateStr) {
    var today = new Date(); today.setHours(0,0,0,0);
    var target = toDate(dateStr);
    return Math.ceil((target - today) / 86400000);
  }

  function nearestThursday(dateStr) {
    var d = toDate(dateStr);
    var day = d.getDay();
    // Find nearest Thursday (4). For AU, releases land on Thursday.
    var diff = 4 - day;
    if (diff < -3) diff += 7;
    if (diff > 3) diff -= 7;
    d.setDate(d.getDate() + diff);
    return isoDate(d);
  }

  function getThursdaysInMonth(year, month) {
    var results = [];
    var d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      if (d.getDay() === 4) results.push(isoDate(d));
      d.setDate(d.getDate() + 1);
    }
    return results;
  }

  /* ── sessionStorage cache ── */
  function cacheGet(key) {
    try { var v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
  }
  function cacheSet(key, val) {
    try { sessionStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  /* ── Init ── */
  function init() {
    initMovieCubeIfAvailable();
    bindRegion();
    bindTabs();
    bindViewToggle();
    bindStreamToggle();
    bindSidebarFilters();
    restoreState();
    loadTab();
  }

  function initMovieCubeIfAvailable() {
    if (typeof initMovieCube === 'function') {
      initMovieCube({
        onPersonClick: function () {},
        onAnchorClick: function (id) { if (typeof openMovieCube === 'function') openMovieCube(id); }
      });
    }
  }

  /* ── Region ── */
  function bindRegion() {
    document.querySelectorAll('.nf-region-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.nf-region-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.region = btn.dataset.region;
        localStorage.setItem('orbit_nf_region', state.region);
        state.upcoming = [];
        state.streamData = {};
        loadTab();
      });
    });
  }

  function restoreState() {
    // Restore region
    document.querySelectorAll('.nf-region-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.region === state.region);
    });
    // Restore tab
    document.querySelectorAll('.nf-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === state.tab);
    });
    // Restore services
    var svcs = SERVICES[state.region] || SERVICES.AU;
    if (!state.enabledServices) state.enabledServices = svcs.map(function (s) { return s.id; });
  }

  /* ── Tabs ── */
  function bindTabs() {
    document.querySelectorAll('.nf-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.nf-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        state.tab = tab.dataset.tab;
        localStorage.setItem('orbit_nf_tab', state.tab);
        loadTab();
      });
    });
  }

  function loadTab() {
    var isBig = state.tab === 'bigscreen';
    $('panelBigscreen').hidden = !isBig;
    $('panelStreamers').hidden = isBig;
    $('sidebarBigscreen').hidden = !isBig;
    $('sidebarStreamers').hidden = isBig;

    if (isBig) {
      loadBigScreen();
    } else {
      loadStreamers();
    }
  }

  /* ============================================
     TAB 1 — THE BIG SCREEN
  ============================================ */

  function loadBigScreen() {
    var cacheKey = 'orbit_nf_upcoming_' + state.region;
    var cached = cacheGet(cacheKey);
    if (cached && cached.length) {
      state.upcoming = cached;
      renderSchedule();
      return;
    }
    $('loadingSchedule').hidden = false;
    $('scheduleList').innerHTML = '';

    var pages = [];
    var today = isoDate(new Date());
    var sixMonths = new Date(); sixMonths.setMonth(sixMonths.getMonth() + 6);
    var maxDate = isoDate(sixMonths);

    function fetchPage(p) {
      return tmdbGet('/movie/upcoming', {
        region: state.region, page: p,
        'primary_release_date.gte': today,
        'primary_release_date.lte': maxDate
      });
    }

    fetchPage(1).then(function (data) {
      pages = pages.concat(data.results || []);
      var totalPages = Math.min(data.total_pages || 1, 3);
      var promises = [];
      for (var i = 2; i <= totalPages; i++) promises.push(fetchPage(i));
      return Promise.all(promises);
    }).then(function (results) {
      results.forEach(function (d) { pages = pages.concat(d.results || []); });
      // Deduplicate by id
      var seen = {};
      state.upcoming = pages.filter(function (m) {
        if (seen[m.id]) return false;
        seen[m.id] = true;
        return true;
      });
      cacheSet(cacheKey, state.upcoming);
      $('loadingSchedule').hidden = true;
      renderSchedule();
    }).catch(function () {
      $('loadingSchedule').textContent = 'Failed to load upcoming releases.';
    });
  }

  /* ── View toggle ── */
  function bindViewToggle() {
    document.querySelectorAll('.nf-view-toggle .tgl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.nf-view-toggle .tgl-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.view = btn.dataset.view;
        $('viewSchedule').hidden = state.view !== 'schedule';
        $('viewCountdown').hidden = state.view !== 'countdown';
        if (state.view === 'countdown') renderCountdown();
      });
    });
  }

  /* ── Schedule rendering ── */
  function renderSchedule() {
    var films = applyBigScreenFilters(state.upcoming);
    // Group by nearest Thursday
    var groups = {};
    var groupOrder = [];
    films.forEach(function (m) {
      var rd = m.release_date;
      if (!rd) return;
      var thu = nearestThursday(rd);
      if (!groups[thu]) { groups[thu] = []; groupOrder.push(thu); }
      groups[thu].push(m);
    });
    groupOrder.sort();

    var container = $('scheduleList');
    container.innerHTML = '';

    // Alert banner for this-week releases
    renderAlertBanner(groups, groupOrder);

    groupOrder.forEach(function (thu) {
      var days = daysUntil(thu);
      if (days < -7) return; // skip past weeks
      var div = document.createElement('div');
      div.className = 'nf-week-group';
      div.id = 'week-' + thu;

      var headerHTML = '<div class="nf-week-header"><span class="nf-week-date">THURSDAY ' +
        fmtDate(toDate(thu)).toUpperCase() + '</span>';
      if (days >= 0 && days <= 7) {
        var label = days === 0 ? 'TODAY' : days === 1 ? 'TOMORROW' : 'THIS THURSDAY';
        headerHTML += '<span class="nf-week-badge">' + label + ' \u00B7 ' + days + ' DAYS</span>';
      }
      headerHTML += '</div>';
      div.innerHTML = headerHTML;

      groups[thu].forEach(function (m) {
        div.appendChild(buildFilmCard(m));
      });

      container.appendChild(div);
    });

    renderThursdayStrip(groups, groupOrder);

    if (groupOrder.length === 0) {
      container.innerHTML = '<div class="nf-empty-state">No upcoming theatrical releases found for this region.</div>';
    }
  }

  function renderAlertBanner(groups, groupOrder) {
    var banner = $('alertBanner');
    banner.hidden = true;
    banner.innerHTML = '';
    for (var i = 0; i < groupOrder.length; i++) {
      var thu = groupOrder[i];
      var days = daysUntil(thu);
      if (days >= 0 && days <= 7 && groups[thu].length > 0) {
        var film = groups[thu][0];
        banner.hidden = false;
        banner.innerHTML = '<span class="og og-star"></span>' +
          '<span class="alert-title">' + escHtml(film.title) + ' is out this Thursday</span>' +
          '<span class="alert-meta">' + days + ' days</span>';
        break;
      }
    }
  }

  function buildFilmCard(m) {
    var card = document.createElement('div');
    card.className = 'nf-film-card';
    card.addEventListener('click', function (e) {
      if (e.target.closest('.nf-want-btn')) return;
      if (typeof openMovieCube === 'function') openMovieCube(m.id);
    });

    var posterSrc = imgUrl(m.poster_path, 'w92');
    var posterHTML = posterSrc
      ? '<img class="nf-film-poster" src="' + posterSrc + '" alt="" loading="lazy">'
      : '<div class="nf-film-poster-placeholder"><span class="og og-film"></span></div>';

    var genreNames = (m.genre_ids || []).map(function (id) { return GENRE_MAP[id] || ''; }).filter(Boolean).slice(0, 2).join(', ');

    var isSaved = state.wantToSee.some(function (w) { return w.id === m.id; });

    card.innerHTML = posterHTML +
      '<div class="nf-film-info">' +
        '<div class="nf-film-title">' + escHtml(m.title || m.name || '') + '</div>' +
        '<div class="nf-film-meta">' + genreNames + '</div>' +
      '</div>' +
      '<div class="nf-film-actions">' +
        '<button class="nf-want-btn' + (isSaved ? ' saved' : '') + '" data-id="' + m.id + '">' +
          (isSaved ? '<span class="og og-check"></span> SAVED' : 'WANT TO SEE') +
        '</button>' +
      '</div>';

    card.querySelector('.nf-want-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      toggleWantToSee(m, this);
    });

    // Lazy-load watch provider info
    lazyLoadProvider(card, m.id);

    return card;
  }

  function lazyLoadProvider(card, movieId) {
    var provCacheKey = 'orbit_nf_prov_' + movieId;
    var cached = cacheGet(provCacheKey);
    if (cached !== null) {
      insertProviderBadge(card, cached);
      return;
    }
    // Use IntersectionObserver for lazy fetch
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.disconnect();
          tmdbGet('/movie/' + movieId + '/watch/providers').then(function (data) {
            var regionData = (data.results || {})[state.region] || {};
            var flat = regionData.flatrate || [];
            cacheSet(provCacheKey, flat);
            insertProviderBadge(card, flat);
          }).catch(function () {});
        }
      });
    }, { threshold: 0.1 });
    observer.observe(card);
  }

  function insertProviderBadge(card, providers) {
    var info = card.querySelector('.nf-film-info');
    if (!info || info.querySelector('.nf-film-badge.where')) return;
    var text = providers.length > 0
      ? 'Cinema \u2192 ' + providers[0].provider_name
      : 'Cinema only';
    var badge = document.createElement('span');
    badge.className = 'nf-film-badge where';
    badge.innerHTML = '<span class="og og-film"></span> ' + escHtml(text);
    info.appendChild(badge);
  }

  function toggleWantToSee(movie, btn) {
    var idx = state.wantToSee.findIndex(function (w) { return w.id === movie.id; });
    if (idx >= 0) {
      state.wantToSee.splice(idx, 1);
      btn.classList.remove('saved');
      btn.innerHTML = 'WANT TO SEE';
    } else {
      state.wantToSee.push({
        id: movie.id,
        title: movie.title || movie.name || '',
        releaseDate: movie.release_date || '',
        posterPath: movie.poster_path || ''
      });
      btn.classList.add('saved');
      btn.innerHTML = '<span class="og og-check"></span> SAVED';
    }
    localStorage.setItem('orbit_want_to_see', JSON.stringify(state.wantToSee));
  }

  /* ── Countdown rendering ── */
  function renderCountdown() {
    var container = $('countdownList');
    var empty = $('countdownEmpty');
    container.innerHTML = '';

    if (state.wantToSee.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    var sorted = state.wantToSee.slice().sort(function (a, b) {
      return daysUntil(a.releaseDate) - daysUntil(b.releaseDate);
    });

    sorted.forEach(function (item) {
      var days = daysUntil(item.releaseDate);
      var card = document.createElement('div');
      card.className = 'nf-countdown-card';
      card.addEventListener('click', function () {
        if (typeof openMovieCube === 'function') openMovieCube(item.id);
      });

      var posterSrc = imgUrl(item.posterPath, 'w92');
      var posterHTML = posterSrc
        ? '<img class="nf-film-poster" src="' + posterSrc + '" alt="" loading="lazy">'
        : '<div class="nf-film-poster-placeholder"><span class="og og-film"></span></div>';

      var urgentCls = days <= 7 ? ' urgent' : '';
      var dayLabel = days === 0 ? 'TODAY' : days === 1 ? 'DAY' : 'DAYS';
      var displayDays = days < 0 ? 'OUT' : days;

      card.innerHTML = posterHTML +
        '<div class="nf-countdown-info">' +
          '<div class="nf-film-title">' + escHtml(item.title) + '</div>' +
        '</div>' +
        '<div class="nf-countdown-right">' +
          '<div class="nf-countdown-number' + urgentCls + '">' + displayDays + '</div>' +
          '<div class="nf-countdown-unit">' + dayLabel + '</div>' +
          '<div class="nf-countdown-date">' + fmtDateFull(toDate(item.releaseDate)) + '</div>' +
        '</div>';

      container.appendChild(card);
    });
  }

  /* ── Thursday sidebar strip ── */
  function renderThursdayStrip(groups, groupOrder) {
    var now = new Date();
    var targetMonth = new Date(now.getFullYear(), now.getMonth() + state.monthOffset, 1);
    $('monthLabel').textContent = MONTHS[targetMonth.getMonth()] + ' ' + targetMonth.getFullYear();

    var thursdays = getThursdaysInMonth(targetMonth.getFullYear(), targetMonth.getMonth());
    var strip = $('thursdayStrip');
    strip.innerHTML = '';

    var today = isoDate(new Date());
    var thisWeekThu = nearestThursday(today);

    thursdays.forEach(function (thu) {
      var count = (groups && groups[thu]) ? groups[thu].length : 0;
      var row = document.createElement('div');
      row.className = 'nf-thu-row';
      if (thu === thisWeekThu) row.classList.add('this-week');

      var dotCls = count >= 2 ? 'gold' : count === 1 ? 'cyan' : 'empty';
      var countText = count > 0 ? count + ' film' + (count > 1 ? 's' : '') : '\u2014';

      row.innerHTML = '<span class="nf-thu-date">' + fmtDate(toDate(thu)) + '</span>' +
        '<span class="nf-thu-dot ' + dotCls + '"></span>' +
        '<span class="nf-thu-count">' + countText + '</span>';

      row.addEventListener('click', function () {
        strip.querySelectorAll('.nf-thu-row').forEach(function (r) { r.classList.remove('active'); });
        row.classList.add('active');
        var target = document.getElementById('week-' + thu);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      strip.appendChild(row);
    });
  }

  /* ── Month nav ── */
  if ($('monthPrev')) $('monthPrev').addEventListener('click', function () {
    state.monthOffset--;
    renderThursdayStrip(groupUpcoming(), null);
  });
  if ($('monthNext')) $('monthNext').addEventListener('click', function () {
    state.monthOffset++;
    renderThursdayStrip(groupUpcoming(), null);
  });

  function groupUpcoming() {
    var groups = {};
    state.upcoming.forEach(function (m) {
      if (!m.release_date) return;
      var thu = nearestThursday(m.release_date);
      if (!groups[thu]) groups[thu] = [];
      groups[thu].push(m);
    });
    return groups;
  }

  /* ── Big Screen filters ── */
  function bindSidebarFilters() {
    // Genre filter
    if ($('filterGenre')) $('filterGenre').addEventListener('change', function () {
      state.filterGenre = this.value;
      renderSchedule();
    });
    // Search filter
    if ($('filterSearch')) $('filterSearch').addEventListener('input', debounce(function () {
      state.filterSearch = this.value.toLowerCase().trim();
      renderSchedule();
    }, 300));
    // Where chips
    document.querySelectorAll('#whereChips .nf-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#whereChips .nf-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.filterWhere = chip.dataset.where;
        renderSchedule();
      });
    });
    // Awards chip
    if ($('filterAwards')) $('filterAwards').addEventListener('click', function () {
      state.filterAwards = !state.filterAwards;
      this.classList.toggle('active', state.filterAwards);
      renderSchedule();
    });
    // Stream filters
    if ($('streamFilterGenre')) $('streamFilterGenre').addEventListener('change', function () {
      state.streamFilterGenre = this.value;
      renderStreamRows();
    });
    if ($('streamFilterSearch')) $('streamFilterSearch').addEventListener('input', debounce(function () {
      state.streamFilterSearch = this.value.toLowerCase().trim();
      renderStreamRows();
    }, 300));
    // Time chips
    document.querySelectorAll('#timeChips .nf-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#timeChips .nf-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.streamTimeFilter = chip.dataset.time;
        renderStreamRows();
      });
    });
    // Sort
    if ($('streamSort')) $('streamSort').addEventListener('change', function () {
      state.streamSort = this.value;
      renderStreamRows();
    });
  }

  function applyBigScreenFilters(films) {
    return films.filter(function (m) {
      if (state.filterGenre && !(m.genre_ids || []).includes(parseInt(state.filterGenre))) return false;
      if (state.filterSearch) {
        var title = (m.title || m.name || '').toLowerCase();
        if (title.indexOf(state.filterSearch) === -1) return false;
      }
      return true;
    });
  }

  /* ============================================
     TAB 2 — YOUR STREAMERS
  ============================================ */

  function loadStreamers() {
    var svcs = SERVICES[state.region] || SERVICES.AU;
    if (!state.enabledServices) state.enabledServices = svcs.map(function (s) { return s.id; });
    buildServiceChips(svcs);
    loadStreamData(svcs);
  }

  function buildServiceChips(svcs) {
    var container = $('serviceChips');
    container.innerHTML = '';
    svcs.forEach(function (svc) {
      var chip = document.createElement('button');
      chip.className = 'nf-service-chip ' + svc.cls;
      chip.textContent = svc.name.toUpperCase();
      if (state.enabledServices.includes(svc.id)) chip.classList.add('active');
      chip.addEventListener('click', function () {
        chip.classList.toggle('active');
        var idx = state.enabledServices.indexOf(svc.id);
        if (idx >= 0) state.enabledServices.splice(idx, 1);
        else state.enabledServices.push(svc.id);
        localStorage.setItem('orbit_nf_services', JSON.stringify(state.enabledServices));
        renderStreamRows();
      });
      container.appendChild(chip);
    });
  }

  function loadStreamData(svcs) {
    $('loadingStreamers').hidden = false;
    $('streamerRows').innerHTML = '';

    var type = state.streamType;
    var today = new Date();
    var threeMonthsAgo = new Date(today); threeMonthsAgo.setMonth(today.getMonth() - 3);
    var dateGte = isoDate(threeMonthsAgo);
    var dateLte = isoDate(today);

    var promises = svcs.map(function (svc) {
      var cacheKey = 'orbit_nf_stream_' + svc.id + '_' + state.region + '_' + type;
      var cached = cacheGet(cacheKey);
      if (cached) {
        state.streamData[svc.id] = cached;
        return Promise.resolve();
      }

      var endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie';
      var dateField = type === 'tv' ? 'first_air_date' : 'primary_release_date';
      var params = {
        with_watch_providers: svc.id,
        watch_region: state.region,
        sort_by: dateField + '.desc'
      };
      params[dateField + '.gte'] = dateGte;
      params[dateField + '.lte'] = dateLte;

      return tmdbGet(endpoint, params).then(function (data) {
        state.streamData[svc.id] = data.results || [];
        cacheSet(cacheKey, data.results || []);
      }).catch(function () {
        state.streamData[svc.id] = [];
      });
    });

    Promise.all(promises).then(function () {
      $('loadingStreamers').hidden = true;
      renderStreamRows();
    });
  }

  function renderStreamRows() {
    var svcs = SERVICES[state.region] || SERVICES.AU;
    var container = $('streamerRows');
    container.innerHTML = '';

    svcs.forEach(function (svc) {
      if (!state.enabledServices.includes(svc.id)) return;
      var items = applyStreamFilters(state.streamData[svc.id] || []);

      // Sort
      if (state.streamSort === 'az') {
        items.sort(function (a, b) {
          return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        });
      }

      var now = new Date();
      var newCount = items.filter(function (m) {
        var rd = m.release_date || m.first_air_date || '';
        if (!rd) return false;
        return (now - toDate(rd)) / 86400000 <= 30;
      }).length;

      var row = document.createElement('div');
      row.className = 'nf-streamer-row';

      row.innerHTML = '<div class="nf-streamer-header">' +
        '<span class="nf-service-badge ' + svc.cls + '">' + svc.name.toUpperCase() + '</span>' +
        '<span class="nf-service-count">' + newCount + ' new this month</span>' +
      '</div>';

      var scroll = document.createElement('div');
      scroll.className = 'nf-streamer-scroll';

      items.forEach(function (m) {
        scroll.appendChild(buildStreamTile(m));
      });

      if (items.length === 0) {
        scroll.innerHTML = '<div class="nf-empty-state" style="min-width:200px">No titles found</div>';
      }

      row.appendChild(scroll);
      container.appendChild(row);
    });
  }

  function buildStreamTile(m) {
    var tile = document.createElement('div');
    tile.className = 'nf-stream-tile';
    tile.addEventListener('click', function () {
      if (typeof openMovieCube === 'function') openMovieCube(m.id);
    });

    var posterSrc = imgUrl(m.poster_path, 'w185');
    var posterHTML = posterSrc
      ? '<img class="nf-tile-poster" src="' + posterSrc + '" alt="" loading="lazy">'
      : '<div class="nf-tile-poster-placeholder"><span class="og og-film"></span></div>';

    var rd = m.release_date || m.first_air_date || '';
    var isNew = rd && (new Date() - toDate(rd)) / 86400000 <= 14;
    var year = rd ? rd.slice(0, 4) : '';
    var genre = (m.genre_ids || []).map(function (id) { return GENRE_MAP[id] || ''; }).filter(Boolean)[0] || '';

    tile.innerHTML = posterHTML +
      (isNew ? '<span class="nf-tile-new">NEW</span>' : '') +
      '<div class="nf-tile-title">' + escHtml(m.title || m.name || '') + '</div>' +
      '<div class="nf-tile-meta">' + escHtml(genre + (genre && year ? ' \u00B7 ' : '') + year) + '</div>';

    return tile;
  }

  function applyStreamFilters(items) {
    var now = new Date();
    return items.filter(function (m) {
      // Time filter
      var rd = m.release_date || m.first_air_date || '';
      if (state.streamTimeFilter === 'week') {
        if (!rd || (now - toDate(rd)) / 86400000 > 7) return false;
      } else if (state.streamTimeFilter === 'month') {
        if (!rd || (now - toDate(rd)) / 86400000 > 30) return false;
      }
      // Genre
      if (state.streamFilterGenre && !(m.genre_ids || []).includes(parseInt(state.streamFilterGenre))) return false;
      // Search
      if (state.streamFilterSearch) {
        var title = (m.title || m.name || '').toLowerCase();
        if (title.indexOf(state.streamFilterSearch) === -1) return false;
      }
      return true;
    });
  }

  /* ── Stream type toggle ── */
  function bindStreamToggle() {
    document.querySelectorAll('.nf-stream-toggle .tgl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.nf-stream-toggle .tgl-btn').forEach(function (b) {
          b.classList.remove('active', 'tv-active');
        });
        state.streamType = btn.dataset.stype;
        if (state.streamType === 'tv') {
          btn.classList.add('tv-active');
        } else {
          btn.classList.add('active');
        }
        state.streamData = {};
        loadStreamers();
      });
    });
  }

  /* ── Genre map ── */
  var GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
  };

  /* ── Utility ── */
  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
