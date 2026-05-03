/* ============================================================================
   ORBIT Close Button — Shared close handler (CLAUDE.md Rule 17)

   USAGE:
     <button class="orbit-close" data-close-target="#my-popup">×</button>
     <button class="orbit-close">×</button>   (auto-finds nearest [data-orbit-popup])

   For custom teardown logic, listen for 'orbit:close' on the popup wrapper:
     popup.addEventListener('orbit:close', () => { /+ cleanup +/ });

   Programmatic close:
     OrbitClose.close('#my-popup');
   ============================================================================ */

(function () {
  if (window.__orbitCloseInit) return;
  window.__orbitCloseInit = true;

  const ANIMATION_MS = 600;

  function resolveTargets(target) {
    let btn = null, popup = null;
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target || !(target instanceof Element)) return { btn, popup };

    if (target.classList.contains('orbit-close')) {
      btn = target;
      const sel = btn.getAttribute('data-close-target');
      popup = sel ? document.querySelector(sel) : btn.closest('[data-orbit-popup]');
    } else {
      popup = target.matches('[data-orbit-popup]') ? target : target.closest('[data-orbit-popup]');
      btn = popup ? popup.querySelector('.orbit-close') : null;
    }
    return { btn, popup };
  }

  function isReduced() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function close(target) {
    const { btn, popup } = resolveTargets(target);
    if (btn && btn.classList.contains('closing')) return;
    if (!btn && !popup) return;

    if (btn)   btn.classList.add('closing');
    if (popup) popup.classList.add('orbit-popup-closing');

    const dur = isReduced() ? 200 : ANIMATION_MS;
    setTimeout(() => {
      if (btn) btn.classList.remove('closing');
      if (popup) {
        popup.classList.remove('orbit-popup-closing');
        const ev = new CustomEvent('orbit:close', { bubbles: true, cancelable: true });
        const proceed = popup.dispatchEvent(ev);
        // Fallback hide via [hidden] attribute — works for re-open
        // (consumers can preventDefault to handle teardown themselves).
        if (proceed) popup.hidden = true;
      }
    }, dur);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.orbit-close');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    close(btn);
  });

  window.OrbitClose = { close };
})();
