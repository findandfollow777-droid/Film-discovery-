/* ============================================================
   Orbit · Discovery Carousel (Variant B) — vanilla init
   Binds to any element with [data-orbit-carousel] on the page.
   ============================================================ */

(function () {
  'use strict';

  const AUTOPLAY_MS = 7000;     // ms between auto-advances (set to 0 to disable)
  const PAUSE_ON_HOVER = true;

  function initCarousel(root) {
    const slides   = Array.from(root.querySelectorAll('.oc-slide'));
    const dots     = Array.from(root.querySelectorAll('[data-oc-dot]'));
    const arrows   = Array.from(root.querySelectorAll('[data-oc-dir]'));
    const counter  = root.querySelector('[data-oc-counter]');
    // Phase M (2026-05-30): background-art slides live OUTSIDE the
    // carousel root (in .discover-banner) so they can extend beyond
    // the carousel's overflow:hidden. Indexed 1:1 with .oc-slide via
    // data-bg / data-i — render() toggles .is-active on the bg-slide
    // matching the active content slide. Optional ancestor: if the
    // carousel ever boots outside a banner, bgSlides stays empty and
    // the swap is a no-op (no error).
    const banner   = root.closest('.discover-banner');
    const bgSlides = banner ? Array.from(banner.querySelectorAll('.oc-bg-slide')) : [];

    if (!slides.length) return;

    // Expose autoplay duration to the dot-fill CSS animation
    if (AUTOPLAY_MS > 0) {
      root.style.setProperty('--oc-autoplay-css', (AUTOPLAY_MS / 1000) + 's');
    }

    let idx = slides.findIndex(s => s.classList.contains('is-active'));
    if (idx < 0) idx = 0;
    let timer = null;

    function render() {
      slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
      bgSlides.forEach((b, k) => b.classList.toggle('is-active', k === idx));
      if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
    }

    function go(target, fromUser) {
      idx = ((target % slides.length) + slides.length) % slides.length;
      render();
      if (fromUser) restartTimer();
    }

    function startTimer() {
      if (AUTOPLAY_MS <= 0) return;
      timer = setInterval(() => go(idx + 1, false), AUTOPLAY_MS);
    }
    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restartTimer() {
      stopTimer();
      startTimer();
      // Restart the dot-fill CSS animation
      const active = root.querySelector('.oc-dot.is-active');
      if (active && active.lastElementChild === null) {
        // Force animation restart by toggling visibility
        active.style.animation = 'none';
        // eslint-disable-next-line no-unused-expressions
        active.offsetHeight;
        active.style.animation = '';
      }
    }

    arrows.forEach(a => {
      a.addEventListener('click', () => go(idx + Number(a.getAttribute('data-oc-dir')), true));
    });
    dots.forEach((d) => {
      d.addEventListener('click', () => go(Number(d.getAttribute('data-oc-dot')), true));
    });

    // Keyboard navigation when the carousel (or anything inside) has focus
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { go(idx - 1, true); }
      else if (e.key === 'ArrowRight') { go(idx + 1, true); }
    });

    if (PAUSE_ON_HOVER) {
      root.addEventListener('mouseenter', stopTimer);
      root.addEventListener('mouseleave', startTimer);
      root.addEventListener('focusin',  stopTimer);
      root.addEventListener('focusout', startTimer);
    }

    // Touch swipe support
    let touchStartX = null;
    root.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (touchStartX == null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        go(idx + (dx < 0 ? 1 : -1), true);
      }
      touchStartX = null;
    });

    render();
    startTimer();
  }

  function bootAll() {
    document.querySelectorAll('[data-orbit-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }
})();
