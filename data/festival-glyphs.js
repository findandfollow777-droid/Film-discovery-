/**
 * ORBIT — Two-Ring Orbit Festival Glyph System
 * Inline SVG markup for the 6 festival glyphs. Each is a typography-led mark:
 * outer circle (festival accent) + tilted inner ellipse (festival accent) +
 * festival name in Orbitron gold + single gold marker dot.
 *
 * Usage:
 *   <div class="tile-trophy" data-festival="oscar"></div>
 *   ... then call window.renderFestivalGlyphs() on page load.
 *
 * Or directly:
 *   window.renderFestivalGlyph(containerElement, 'oscar');
 */
(function () {
  window.FESTIVAL_GLYPHS = {

    oscar: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Oscar">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-oscar)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="34" stroke="var(--fest-oscar)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(-15 100 100)"/>
      <text x="100" y="108" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="var(--accent-gold)">OSCAR</text>
      <circle cx="20" cy="124" r="3" fill="var(--accent-gold)"/>
    </svg>`,

    cannes: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cannes">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-cannes)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="32" stroke="var(--fest-cannes)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(20 100 100)"/>
      <text x="100" y="108" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="22" font-weight="900" letter-spacing="3" fill="var(--accent-gold)">CANNES</text>
      <circle cx="178" cy="76" r="3" fill="var(--accent-gold)"/>
    </svg>`,

    venice: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Venice">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-venice)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="36" stroke="var(--fest-venice)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(-30 100 100)"/>
      <text x="100" y="108" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="22" font-weight="900" letter-spacing="3" fill="var(--accent-gold)">VENICE</text>
      <circle cx="38" cy="46" r="3" fill="var(--accent-gold)"/>
    </svg>`,

    berlin: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Berlin">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-berlin)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="30" stroke="var(--fest-berlin)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(35 100 100)"/>
      <text x="100" y="108" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="24" font-weight="900" letter-spacing="3" fill="var(--accent-gold)">BERLIN</text>
      <circle cx="170" cy="142" r="3" fill="var(--accent-gold)"/>
    </svg>`,

    bafta: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BAFTA">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-bafta)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="34" stroke="var(--fest-bafta)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(8 100 100)"/>
      <text x="100" y="108" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="var(--accent-gold)">BAFTA</text>
      <circle cx="180" cy="118" r="3" fill="var(--accent-gold)"/>
    </svg>`,

    globe: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Golden Globe">
      <circle cx="100" cy="100" r="86" stroke="var(--fest-globe)" stroke-width="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="100" rx="78" ry="32" stroke="var(--fest-globe)" stroke-width="1.6" fill="none" opacity="0.75" transform="rotate(-8 100 100)"/>
      <text x="100" y="100" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="16" font-weight="900" letter-spacing="2" fill="var(--accent-gold)">GOLDEN</text>
      <text x="100" y="120" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="16" font-weight="900" letter-spacing="2" fill="var(--accent-gold)">GLOBE</text>
      <circle cx="22" cy="84" r="3" fill="var(--accent-gold)"/>
    </svg>`
  };

  window.renderFestivalGlyph = function (container, festivalId) {
    if (!container) return false;
    const markup = window.FESTIVAL_GLYPHS[festivalId];
    if (!markup) {
      console.warn('[festival-glyphs] Unknown festival id:', festivalId);
      return false;
    }
    container.innerHTML = markup;
    return true;
  };

  window.renderFestivalGlyphs = function () {
    document.querySelectorAll('[data-festival]').forEach(function (el) {
      window.renderFestivalGlyph(el, el.dataset.festival);
    });
  };
})();
