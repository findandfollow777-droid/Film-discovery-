/* ============================================
   ORBIT — Welcome Popup  (redesign v2)
   Auto-shows after IDLE_MS of inactivity, max MAX times.
   Shift+P force-opens (does not burn a count).
   Storage key: orbit_welcome_seen
   ============================================ */

(function () {
  'use strict';

  var KEY = 'orbit_welcome_seen';
  var MAX = 2;
  var IDLE_MS = 5000;

  /* ============================================================
     ORBIT CLOSE BOOTSTRAP — Added Apr 27, 2026 (Rule 17)
     Auto-loads orbit-close.css for the Black Hole exit animation.
     ============================================================ */
  function ensureOrbitCloseLoaded() {
    var root = (window.OrbitUtils && OrbitUtils.ROOT) ? OrbitUtils.ROOT : '';
    if (!document.querySelector('link[data-orbit-close]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = root + 'orbit-close.css';
      link.setAttribute('data-orbit-close', '');
      document.head.appendChild(link);
    }
  }
  ensureOrbitCloseLoaded();

  function getCount() {
    var raw = localStorage.getItem(KEY);
    var c = raw ? parseInt(raw, 10) : 0;
    if (isNaN(c)) c = 0;
    return c;
  }

  // ── Star field canvas ──────────────────
  function drawStars(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var i, x, y, r, a;
    // ~160 white dots
    for (i = 0; i < 160; i++) {
      x = Math.random() * w;
      y = Math.random() * h;
      r = Math.random() * 0.9 + 0.2;
      a = Math.random() * 0.5 + 0.08;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
      ctx.fill();
    }
    // ~12 cyan dots
    for (i = 0; i < 12; i++) {
      x = Math.random() * w;
      y = Math.random() * h;
      r = Math.random() * 1.0 + 0.4;
      a = Math.random() * 0.35 + 0.25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,217,255,' + a + ')';
      ctx.fill();
    }
  }

  // ── Helpers ────────────────────────────
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  // ── Planet data ────────────────────────
  var PLANETS = [
    {
      cls: 'wp-planet--daily-games',
      name: 'DAILY GAMES',
      desc: ['New puzzles', 'every day'],
      moon: true
    },
    {
      cls: 'wp-planet--what-to-watch',
      name: 'WHAT TO WATCH',
      desc: ["Tonight's perfect watch"]
    },
    {
      cls: 'wp-planet--awards',
      name: 'AWARDS',
      desc: ['Six festivals.', 'Decades of winners.'],
      saturn: true
    },
    {
      cls: 'wp-planet--trivia',
      name: 'TRIVIA',
      desc: ['Prove your film IQ']
    },
    {
      cls: 'wp-planet--list-it',
      name: 'LIST IT',
      desc: ['Films you mean to watch']
    }
  ];

  // ── Build planet element ───────────────
  function buildPlanet(p) {
    var planet = el('div', 'wp-planet ' + p.cls);

    var circle = el('div', 'wp-planet-circle');

    // Saturn ring back layer (inside circle so absolute positioning works)
    if (p.saturn) {
      var ringBack = el('div', 'wp-saturn-ring wp-saturn-ring--back');
      circle.appendChild(ringBack);
    }

    var nameEl = el('div', 'wp-planet-name');
    nameEl.textContent = p.name;

    var divider = el('div', 'wp-planet-divider');

    var descEl = el('div', 'wp-planet-desc');
    p.desc.forEach(function (line, i) {
      if (i > 0) descEl.appendChild(document.createElement('br'));
      descEl.appendChild(document.createTextNode(line));
    });

    circle.appendChild(nameEl);
    circle.appendChild(divider);
    circle.appendChild(descEl);

    // Moon orbit for Daily Games
    if (p.moon) {
      var moonOrbit = el('div', 'wp-moon-orbit');
      var moonDot = el('div', 'wp-moon-dot');
      moonOrbit.appendChild(moonDot);
      circle.appendChild(moonOrbit);
    }

    // Saturn ring front layer (inside circle, after text so z-index 3 works)
    if (p.saturn) {
      var ringFront = el('div', 'wp-saturn-ring wp-saturn-ring--front');
      circle.appendChild(ringFront);
    }

    planet.appendChild(circle);

    return planet;
  }

  // ── Show the popup (forced=true bypasses the count gate) ─────────
  function showPopup(forced) {
    if (document.querySelector('.wp-overlay')) return;

    var count = getCount();
    if (!forced && count >= MAX) return;

    // ── Assemble DOM ─────────────────────
    var overlay = el('div', 'wp-overlay');
    overlay.setAttribute('data-orbit-popup', '');
    var content = el('div', 'wp-content');

    // Header
    var header = el('div', 'wp-header');
    var headerTitle = el('div', 'wp-header-title');
    headerTitle.innerHTML =
      '<span class="wp-muted">What </span>' +
      '<span class="wp-cyan">ORBIT</span>' +
      '<span class="wp-muted"> can do</span>';
    var headerClose = el('button', 'orbit-close');
    headerClose.setAttribute('aria-label', 'Close');
    headerClose.textContent = '✕';
    header.appendChild(headerTitle);
    header.appendChild(headerClose);
    content.appendChild(header);

    // Divider
    content.appendChild(el('div', 'wp-divider'));

    // Planet zone
    var zone = el('div', 'wp-planet-zone');

    // Star canvas
    var starCanvas = el('canvas', 'wp-stars');
    zone.appendChild(starCanvas);

    // Planets
    PLANETS.forEach(function (p) {
      zone.appendChild(buildPlanet(p));
    });

    // And Much More
    var muchMore = el('div', 'wp-much-more');
    var mmAnd = el('span', 'wp-much-more-and');
    mmAnd.textContent = 'AND';
    var mmMuch = el('span', 'wp-much-more-much');
    mmMuch.textContent = 'MUCH';
    var mmMore = el('span', 'wp-much-more-more');
    mmMore.textContent = 'MORE';
    muchMore.appendChild(mmAnd);
    muchMore.appendChild(mmMuch);
    muchMore.appendChild(mmMore);
    zone.appendChild(muchMore);

    content.appendChild(zone);

    // Footer divider
    content.appendChild(el('div', 'wp-divider'));

    // Footer
    var footer = el('div', 'wp-footer');

    var footerLeft = el('div', 'wp-footer-left');

    var counter = el('div', 'wp-counter');
    if (forced) {
      counter.textContent = 'SHORTCUT VIEW';
    } else {
      counter.textContent = count === 0
        ? 'SHOWING 1 OF 2 TIMES'
        : 'SHOWING 2 OF 2 TIMES';
    }

    var dontShow = el('label', 'wp-dont-show');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    var dontShowText = el('span');
    dontShowText.textContent = "DON'T SHOW AGAIN";
    dontShow.appendChild(checkbox);
    dontShow.appendChild(dontShowText);

    footerLeft.appendChild(counter);
    footerLeft.appendChild(dontShow);

    var footerClose = el('button', 'wp-footer-close');
    footerClose.textContent = 'CLOSE ✕';

    footer.appendChild(footerLeft);
    footer.appendChild(footerClose);
    content.appendChild(footer);

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // ── Draw stars & show ──────────────────
    requestAnimationFrame(function () {
      drawStars(starCanvas);
      setTimeout(function () {
        overlay.classList.add('visible');
      }, 80);
    });

    // Forced views (Shift+P) don't burn a count
    if (!forced) {
      localStorage.setItem(KEY, String(count + 1));
    }

    // ── Dismiss ────────────────────────────
    // Rule 17: trigger Black Hole exit on the X (and footer CLOSE / ESC /
    // backdrop / DON'T SHOW), then run teardown after the animation.
    var dismissing = false;
    function dismiss(permanent) {
      if (dismissing) return;
      if (!overlay.classList.contains('visible')) return;
      dismissing = true;
      headerClose.classList.add('closing');
      overlay.classList.add('orbit-popup-closing');
      var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (permanent) {
        localStorage.setItem(KEY, String(MAX));
      }
      document.removeEventListener('keydown', onEsc);
      setTimeout(function () {
        overlay.classList.remove('visible');
        overlay.classList.remove('orbit-popup-closing');
        headerClose.classList.remove('closing');
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, reduced ? 200 : 600);
    }

    headerClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dismiss(false);
    });
    footerClose.addEventListener('click', function () { dismiss(false); });
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) dismiss(true);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss(false);
    });

    function onEsc(e) {
      if (e.key === 'Escape') dismiss(false);
    }
    document.addEventListener('keydown', onEsc);
  }

  // ── Inactivity scheduler ───────────────
  // Wait until the user has been idle for IDLE_MS, then auto-show.
  // Pauses while the tab is hidden so backgrounded tabs don't burn a count.
  function scheduleIdle() {
    if (getCount() >= MAX) return;

    var idleTimer = null;
    var events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];

    function reset() {
      if (idleTimer) clearTimeout(idleTimer);
      if (document.visibilityState === 'hidden') return;
      idleTimer = setTimeout(fire, IDLE_MS);
    }

    function fire() {
      cleanup();
      showPopup(false);
    }

    function onVis() {
      if (document.visibilityState === 'hidden') {
        if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      } else {
        reset();
      }
    }

    function cleanup() {
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      events.forEach(function (ev) {
        window.removeEventListener(ev, reset);
      });
      document.removeEventListener('visibilitychange', onVis);
    }

    events.forEach(function (ev) {
      window.addEventListener(ev, reset, { passive: true });
    });
    document.addEventListener('visibilitychange', onVis);

    reset();
  }

  // ── Manual trigger: Shift+P force-opens (bypasses count gate) ─────
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'P' && e.key !== 'p') return;
    if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    showPopup(true);
  });

  scheduleIdle();
})();

// ── Shortcut: Ctrl+Shift+W resets count and reloads ──
document.addEventListener('keydown', function (e) {
  if (e.key === 'W' && e.shiftKey && e.ctrlKey) {
    localStorage.removeItem('orbit_welcome_seen');
    location.reload();
  }
});
