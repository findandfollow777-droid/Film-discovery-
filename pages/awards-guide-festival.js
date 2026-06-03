/* ============================================
   ORBIT — Festival Guide Renderer
   Reads ?festival= param, renders from
   FESTIVAL_GUIDE_DATA, applies accent theme.
============================================ */

(function () {
  var params = new URLSearchParams(window.location.search);
  var festivalId = (params.get('festival') || '').toLowerCase();
  var data = window.FESTIVAL_GUIDE_DATA && window.FESTIVAL_GUIDE_DATA[festivalId];

  var root = document.getElementById('festival-guide-root');
  var errorEl = document.getElementById('festival-guide-error');

  if (!data) {
    if (errorEl) errorEl.hidden = false;
    if (root) root.hidden = true;
    return;
  }

  /* ── Apply festival accent theme ── */
  document.documentElement.style.setProperty('--page-accent', 'var(' + data.accentVar + ')');
  document.documentElement.style.setProperty('--page-accent-rgb', 'var(' + data.accentRgbVar + ')');
  document.title = 'ORBIT \u2014 ' + data.fullName;

  /* ── Detect stub festival (missing content sections) ── */
  var isStub = !data.about && !data.topPrize && !data.otherPrizes;

  /* ── Render ── */
  root.innerHTML = [
    renderHeader(data),
    renderHubNav(),
    renderHero(data),
    renderAbout(data.about),
    renderTopPrize(data.topPrize),
    renderOtherPrizes(data.otherPrizes),
    renderMoments(data.moments),
    renderLandmarksPlaceholder(),
    renderTrivia(data.trivia),
    renderBrowseCta(data.browseCta),
    renderComingSoonIfStub(data, isStub)
  ].join('');

  /* ============================================================
     LANDMARKS — Added May 7, 2026
     Fetches data/reference/{slug}-landmark-truth.json and renders
     curated notable moments grouped by ceremony, with a decade
     tab strip. Async — placeholder is hidden until fetch resolves
     and produces ≥1 notable entry. BAFTA/GG truth files have 0
     notable entries today, so the section silently stays hidden.
     ============================================================ */
  initLandmarks(festivalId);

  /* =========================================
     Render functions
     Each returns '' if data is undefined.
  ========================================= */

  function renderHeader(d) {
    return '<header class="page-header">' +
      '<a class="back-link" href="awards-guide.html">&larr; THE GUIDE</a>' +
      '<div class="header-eyebrow">' + esc(d.hero && d.hero.eyebrow || 'A FILM FESTIVAL') + '</div>' +
      '<h1 class="header-title">' + esc(d.pageTitle) + '</h1>' +
      '<p class="header-tagline">' + esc(d.tagline) + '</p>' +
    '</header>';
  }

  function renderHubNav() {
    return '<nav class="awards-hub-nav">' +
      '<span class="hub-nav-label">Awards Hub</span>' +
      '<div class="hub-nav-divider"></div>' +
      '<a href="awards-browse.html" class="hub-nav-btn" data-section="browse">Browse</a>' +
      '<a href="awards-guide.html" class="hub-nav-btn active" data-section="guide">Guide</a>' +
      '<a href="awards-stats.html" class="hub-nav-btn" data-section="stats">Stats</a>' +
      '<a href="awards-stories.html" class="hub-nav-btn" data-section="stories">Stories</a>' +
    '</nav>';
  }

  function renderHero(d) {
    var h = d.hero;
    if (!h) return '';
    var glyphHtml = '';
    if (d.legacyGlyph) {
      glyphHtml = '<div class="hero-decorative-glyph">' +
        '<span class="og ' + esc(d.legacyGlyph) + '" aria-hidden="true"></span>' +
      '</div>';
    }
    return '<section class="festival-hero">' +
      '<div class="festival-hero-card">' +
        '<div class="hero-top">' +
          glyphHtml +
          '<div class="hero-name">' + esc(h.heroName) + '</div>' +
          '<div class="hero-fullname">' + esc(h.heroFullName) + '</div>' +
        '</div>' +
        '<div class="hero-stats">' +
          heroStat('Founded', h.founded) +
          heroStat('Location', h.location) +
          heroStat('Held', h.held) +
          heroStat('Awarding Body', h.awardingBody) +
          heroStat('Format', h.format) +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function heroStat(label, value) {
    if (!value) return '';
    return '<div class="hero-stat">' +
      '<span class="hero-stat-label">' + esc(label) + '</span>' +
      '<span class="hero-stat-value">' + esc(value) + '</span>' +
    '</div>';
  }

  function renderAbout(a) {
    if (!a) return '';
    var html = '<section class="sub-section about-section">' +
      '<div class="sub-eyebrow">' + esc(a.eyebrow) + '</div>' +
      '<h2 class="sub-title">' + esc(a.title) + '</h2>';
    if (a.paragraphs) {
      for (var i = 0; i < a.paragraphs.length; i++) {
        html += '<p class="sub-paragraph">' + a.paragraphs[i] + '</p>';
      }
    }
    if (a.pullQuote) {
      html += '<blockquote class="pull-quote">' +
        '<span class="pull-quote-mark">\u201C</span>' +
        esc(a.pullQuote) +
        '<span class="pull-quote-mark">\u201D</span>' +
      '</blockquote>';
    }
    if (a.paragraphsAfter) {
      for (var j = 0; j < a.paragraphsAfter.length; j++) {
        html += '<p class="sub-paragraph">' + a.paragraphsAfter[j] + '</p>';
      }
    }
    html += '</section>';
    return html;
  }

  function renderTopPrize(tp) {
    if (!tp) return '';
    var watermarkHtml = '';
    if (data.legacyGlyph) {
      watermarkHtml = '<div class="top-prize-watermark">' +
        '<span class="og ' + esc(data.legacyGlyph) + '" aria-hidden="true"></span>' +
      '</div>';
    }
    var html = '<section class="sub-section top-prize-section">' +
      '<div class="sub-eyebrow">' + esc(tp.eyebrow) + '</div>' +
      '<h2 class="sub-title">' + esc(tp.sectionTitle) + '</h2>' +
      '<div class="top-prize-card">' +
        watermarkHtml +
        '<div class="top-prize-visual">';
    if (tp.svg) {
      html += '<div class="top-prize-icon">' + tp.svg + '</div>';
    }
    html += '<div class="top-prize-name">' + esc(tp.name) + '</div>' +
        '<div class="top-prize-translation">' + esc(tp.translation) + '</div>' +
      '</div>' +
      '<div class="top-prize-info">' +
        '<p class="top-prize-desc">' + esc(tp.description) + '</p>';
    if (tp.stats) {
      html += '<div class="top-prize-stats">';
      for (var i = 0; i < tp.stats.length; i++) {
        html += '<div class="top-prize-stat">' +
          '<span class="stat-number">' + esc(tp.stats[i].number) + '</span>' +
          '<span class="stat-label">' + esc(tp.stats[i].label) + '</span>' +
        '</div>';
      }
      html += '</div>';
    }
    html += '</div></div></section>';
    return html;
  }

  function renderOtherPrizes(op) {
    if (!op || !op.prizes) return '';
    var html = '<section class="sub-section other-prizes-section">' +
      '<div class="sub-eyebrow">' + esc(op.eyebrow) + '</div>' +
      '<h2 class="sub-title">' + esc(op.sectionTitle) + '</h2>' +
      '<div class="prizes-grid">';
    for (var i = 0; i < op.prizes.length; i++) {
      var p = op.prizes[i];
      html += '<div class="prize-card">' +
        '<h3 class="prize-name">' + esc(p.name) + '</h3>' +
        '<span class="prize-translation">' + esc(p.translation) + '</span>' +
        '<p class="prize-desc">' + esc(p.desc) + '</p>' +
      '</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderMoments(m) {
    if (!m || !m.items) return '';
    var html = '<section class="sub-section moments-section">' +
      '<div class="sub-eyebrow">' + esc(m.eyebrow) + '</div>' +
      '<h2 class="sub-title">' + esc(m.sectionTitle) + '</h2>' +
      '<div class="moments-grid">';
    for (var i = 0; i < m.items.length; i++) {
      var item = m.items[i];
      html += '<div class="moment-card">' +
        '<span class="moment-year">' + esc(item.year) + '</span>' +
        '<h3 class="moment-headline">' + esc(item.headline) + '</h3>' +
        '<p class="moment-text">' + esc(item.text) + '</p>' +
      '</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderTrivia(t) {
    if (!t || !t.items) return '';
    var html = '<section class="sub-section trivia-section">' +
      '<div class="sub-eyebrow">' + esc(t.eyebrow) + '</div>' +
      '<h2 class="sub-title">' + esc(t.sectionTitle) + '</h2>' +
      '<div class="trivia-strip">' +
        '<div class="trivia-strip-eyebrow">' + esc(t.stripEyebrow || '') + '</div>' +
        '<ol class="trivia-list">';
    for (var i = 0; i < t.items.length; i++) {
      html += '<li class="trivia-item">' + t.items[i] + '</li>';
    }
    html += '</ol></div></section>';
    return html;
  }

  function renderBrowseCta(cta) {
    if (!cta) return '';
    return '<section class="sub-section browse-cta-section">' +
      '<div class="browse-cta">' +
        '<span class="browse-cta-label">' + esc(cta.label) + '</span>' +
        '<a href="' + esc(cta.href) + '" class="browse-cta-link">' +
          '<span>' + esc(cta.text) + '</span>' +
          '<span class="browse-cta-arrow">&rarr;</span>' +
        '</a>' +
      '</div>' +
    '</section>';
  }

  function renderComingSoonIfStub(d, stub) {
    if (!stub) return '';
    return '<section class="sub-section coming-soon-section">' +
      '<div class="coming-soon-card">' +
        '<div class="coming-soon-icon">' +
          '<div class="coming-soon-ring"></div>' +
          '<div class="coming-soon-ring inner"></div>' +
          '<span class="coming-soon-dot"></span>' +
        '</div>' +
        '<h2 class="coming-soon-title">Full guide coming soon</h2>' +
        '<p class="coming-soon-text">The complete ' + esc(d.fullName) + ' guide \u2014 history, prizes, key moments \u2014 is on its way.</p>' +
        '<a href="awards-guide.html" class="coming-soon-link">&larr; Back to the Guide</a>' +
      '</div>' +
    '</section>';
  }

  /* ── Utility: escape HTML ── */
  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ============================================================
     LANDMARKS — implementation
  ============================================================ */

  // URL festival slug → truth-file slug. Globe URL is `globe`, file is `gg`.
  var URL_TO_TRUTH_SLUG = {
    oscar: 'oscar', bafta: 'bafta', globe: 'gg',
    cannes: 'cannes', venice: 'venice', berlin: 'berlin'
  };

  // Categories whose snake-case slug doesn't humanize cleanly. Most cats
  // (best_picture → "Best Picture") work via the default rule below.
  var CATEGORY_LABEL_OVERRIDES = {
    palme_dor: "Palme d'Or",
    camera_dor: "Caméra d'Or",
    short_film_palme_dor: "Short Film Palme d'Or",
    silver_bear_grand_jury: "Silver Bear (Grand Jury)",
    silver_bear_best_director: "Silver Bear (Director)",
    silver_bear_best_actor: "Silver Bear (Best Actor)",
    silver_bear_best_actress: "Silver Bear (Best Actress)",
    silver_bear_best_screenplay: "Silver Bear (Screenplay)",
    silver_bear_best_leading_performance: "Silver Bear (Leading Performance)",
    silver_bear_best_supporting_performance: "Silver Bear (Supporting Performance)",
    silver_bear_outstanding_artistic_contribution: "Silver Bear (Artistic Contribution)",
    silver_lion_best_director: "Silver Lion (Director)",
    silver_lion_grand_jury: "Silver Lion (Grand Jury)",
    volpi_cup_best_actor: "Volpi Cup (Best Actor)",
    volpi_cup_best_actress: "Volpi Cup (Best Actress)"
  };

  // Module state for landmark re-renders (decade tab clicks).
  var landmarkState = {
    entries: [],
    decades: [],
    currentDecade: null,
    fullName: ''
  };

  function renderLandmarksPlaceholder() {
    return '<section class="sub-section landmarks-section" id="landmarks-section" hidden></section>';
  }

  function initLandmarks(urlFestivalId) {
    var truthSlug = URL_TO_TRUTH_SLUG[urlFestivalId];
    if (!truthSlug) return;
    loadFestivalLandmarks(truthSlug).then(function (truth) {
      if (!truth) return;
      var entries = flattenNotableEntries(truth);
      if (!entries.length) return;
      var decades = uniqueDecades(entries);
      landmarkState.entries = entries;
      landmarkState.decades = decades;
      landmarkState.currentDecade = decades[0]; // most-recent first (sorted desc)
      landmarkState.fullName = data.fullName || '';
      renderLandmarksList();
      bindDecadeTabs();
    });
  }

  function loadFestivalLandmarks(slug) {
    return fetch('../data/reference/' + slug + '-landmark-truth.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  // Walk every ceremony, every landmark, keep `notable && note`.
  // Handles both ceremony-key shapes (ordinal-keyed and year-keyed) by
  // iterating Object.entries and reading ceremony_year directly.
  function flattenNotableEntries(truth) {
    var out = [];
    var cers = truth && truth.ceremonies;
    if (!cers) return out;
    Object.keys(cers).forEach(function (key) {
      var cer = cers[key];
      if (!cer) return;
      var year = cer.ceremony_year;
      if (typeof year !== 'number') return;
      var landmarks = cer.landmarks || {};
      // Detect ordinal-keyed shape: numeric key < 200 (Oscar at ~96, BAFTA
      // ~78, GG ~82 in this decade — well below the threshold).
      var asInt = parseInt(key, 10);
      var isOrdinalKey = !isNaN(asInt) && asInt < 200 && String(asInt) === key;
      var ordinalNumber = isOrdinalKey ? asInt : null;
      Object.keys(landmarks).forEach(function (catKey) {
        var lm = landmarks[catKey];
        if (!lm || !lm.notable || !lm.note) return;
        var slug = catKey.indexOf('.') >= 0 ? catKey.split('.').slice(1).join('.') : catKey;
        out.push({
          ceremonyYear: year,
          ordinalNumber: ordinalNumber,
          categoryDisplay: humanizeCategory(slug),
          note: lm.note
        });
      });
    });
    out.sort(function (a, b) { return b.ceremonyYear - a.ceremonyYear; });
    return out;
  }

  function uniqueDecades(entries) {
    var set = {};
    entries.forEach(function (e) {
      set[Math.floor(e.ceremonyYear / 10) * 10] = true;
    });
    return Object.keys(set).map(Number).sort(function (a, b) { return b - a; });
  }

  function renderLandmarksList() {
    var sectionEl = document.getElementById('landmarks-section');
    if (!sectionEl) return;
    if (!landmarkState.entries.length) { sectionEl.hidden = true; return; }

    var decade = landmarkState.currentDecade;
    var inDecade = landmarkState.entries.filter(function (e) {
      return e.ceremonyYear >= decade && e.ceremonyYear < decade + 10;
    });

    // Group by ceremonyYear, preserve sort order (desc) from entries.
    var groups = {};
    var orderedYears = [];
    inDecade.forEach(function (e) {
      if (!groups[e.ceremonyYear]) {
        groups[e.ceremonyYear] = [];
        orderedYears.push(e.ceremonyYear);
      }
      groups[e.ceremonyYear].push(e);
    });

    var html = '<div class="sub-eyebrow">— Landmarks</div>' +
               '<h2 class="sub-title">Year by year</h2>';

    if (landmarkState.decades.length > 1) {
      html += '<div class="landmark-decade-tabs" role="tablist">';
      landmarkState.decades.forEach(function (d) {
        var isActive = d === decade;
        html += '<button type="button" role="tab" ' +
                'class="landmark-decade-tab' + (isActive ? ' active' : '') + '" ' +
                'aria-selected="' + (isActive ? 'true' : 'false') + '" ' +
                'data-decade="' + d + '">' + d + 's</button>';
      });
      html += '</div>';
    }

    html += '<div class="landmark-list">';
    orderedYears.forEach(function (year) {
      var sample = groups[year][0];
      var heading = formatCeremonyHeading(year, sample.ordinalNumber);
      html += '<div class="landmark-ceremony-group">' +
                '<h3 class="landmark-ceremony-heading">' + esc(heading) + '</h3>' +
                '<ul class="landmark-note-list">';
      groups[year].forEach(function (e) {
        html += '<li class="landmark-note-row">' +
                  '<span class="landmark-note-cat">' + esc(e.categoryDisplay) + '</span>' +
                  '<p class="landmark-note-text">' + esc(e.note) + '</p>' +
                '</li>';
      });
      html += '</ul></div>';
    });
    html += '</div>';

    sectionEl.innerHTML = html;
    sectionEl.hidden = false;
  }

  function bindDecadeTabs() {
    var sectionEl = document.getElementById('landmarks-section');
    if (!sectionEl || sectionEl._lmBound) return;
    sectionEl.addEventListener('click', function (e) {
      var tab = e.target.closest && e.target.closest('.landmark-decade-tab');
      if (!tab) return;
      var d = parseInt(tab.dataset.decade, 10);
      if (isNaN(d) || d === landmarkState.currentDecade) return;
      landmarkState.currentDecade = d;
      renderLandmarksList();
    });
    sectionEl._lmBound = true;
  }

  function formatCeremonyHeading(year, ordinalNumber) {
    if (ordinalNumber) {
      return year + ' — ' + ordinal(ordinalNumber) + ' ' + landmarkState.fullName;
    }
    return year + (landmarkState.fullName ? ' — ' + landmarkState.fullName : '');
  }

  function ordinal(n) {
    var rem10 = n % 10, rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return n + 'th';
    if (rem10 === 1) return n + 'st';
    if (rem10 === 2) return n + 'nd';
    if (rem10 === 3) return n + 'rd';
    return n + 'th';
  }

  function humanizeCategory(slug) {
    if (CATEGORY_LABEL_OVERRIDES[slug]) return CATEGORY_LABEL_OVERRIDES[slug];
    return slug.split('_').map(function (w) {
      return w ? w.charAt(0).toUpperCase() + w.slice(1) : '';
    }).join(' ');
  }
})();
