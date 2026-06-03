/**
 * ORBIT — Award Badge System (Phase 1.13)
 *
 * Source design: docs/Award Glyphs _standalone_.html (Claude Design output)
 * Gold variant = Winner. Silver variant = Nominee.
 * Halo + inner ring = festival accent (--halo-{festival}).
 * Glyph + accent dots = currentColor (gold/silver, set by CSS via [data-status]).
 *
 * IMPORTANT: This is a SEPARATE system from data/festival-glyphs.js.
 *   - data/festival-glyphs.js → Two-Ring Orbit hub glyphs (Awards Guide page only)
 *   - components/award-badges.js → Win/nominee badges (everywhere else)
 *
 * Usage:
 *   <link rel="stylesheet" href="components/award-badges.css">
 *   <script src="components/award-badges.js"></script>
 *
 *   <div class="orbit-award-badge"
 *        data-award-badge="oscar"
 *        data-status="winner"
 *        data-size="32"
 *        title="Oscar Winner — Best Picture (2020)"></div>
 *
 *   window.renderAwardBadges();              // bulk render
 *   window.renderAwardBadge('oscar', 'winner');  // direct SVG string
 */
(function () {

  // Per-festival glyph paths, ported verbatim from docs/Award Glyphs _standalone_.html.
  // The wrapper SVG (halo + inner ring + transform group) is added by buildBadge().
  // Stroke widths come from STROKE_WIDTH; only inline overrides remain.
  // Fills use currentColor (tier-coloured) or var(--deep-void) for cutouts.
  const GLYPH_MARKUP = {
    oscar: `
      <ellipse cx="66" cy="42" rx="6" ry="8"/>
      <path d="M58 52 Q56 60 56 72 L56 84 Q56 88 60 90 L72 90 Q76 88 76 84 L76 72 Q76 60 74 52"/>
      <line x1="56" y1="62" x2="76" y2="62" stroke-width="2.4"/>
      <line x1="66" y1="58" x2="66" y2="92" stroke-width="2"/>
      <ellipse cx="66" cy="92" rx="14" ry="2.5" stroke-width="1.5"/>
      <line x1="62" y1="92" x2="62" y2="100" stroke-width="2"/>
      <line x1="70" y1="92" x2="70" y2="100" stroke-width="2"/>
      <ellipse cx="66" cy="100" rx="14" ry="2.5"/>
      <rect x="50" y="100" width="32" height="6" rx="1"/>
      <circle cx="63.5" cy="42" r="0.9" fill="currentColor" stroke="none"/>
      <circle cx="68.5" cy="42" r="0.9" fill="currentColor" stroke="none"/>
    `,

    // BAFTA uses an SVG <mask> so the eye/nose/mouth cutouts punch real
    // transparent holes through the mask shape — they show whatever sits
    // behind the badge instead of a fake dark fill. The placeholder
    // __BAFTA_MASK_ID__ is replaced per instance in buildBadge() so multiple
    // BAFTA badges on the same page don't collide on a shared id.
    bafta: `
      <defs>
        <mask id="__BAFTA_MASK_ID__" maskUnits="userSpaceOnUse" x="0" y="0" width="132" height="132">
          <rect x="0" y="0" width="132" height="132" fill="white"/>
          <ellipse fill="black" cx="58" cy="58" rx="2.2" ry="3.2"/>
          <ellipse fill="black" cx="74" cy="58" rx="2.2" ry="3.2"/>
          <path fill="black" d="M66 64 L63.5 76 L68.5 76 Z"/>
          <ellipse fill="black" cx="66" cy="83" rx="5" ry="2"/>
        </mask>
      </defs>
      <path fill="currentColor" stroke="none" mask="url(#__BAFTA_MASK_ID__)" d="M66 36 Q82 38 84 56 Q84 74 78 84 Q72 92 66 92 Q60 92 54 84 Q48 74 48 56 Q50 38 66 36 Z"/>
      <rect fill="currentColor" stroke="none" x="48" y="98" width="36" height="4" rx="1"/>
      <rect fill="currentColor" stroke="none" x="44" y="104" width="44" height="5" rx="1"/>
    `,

    venice: `
      <circle cx="84" cy="60" r="9"/>
      <line x1="84" y1="49" x2="84" y2="46" stroke-width="1.4"/>
      <line x1="92" y1="52" x2="94" y2="50" stroke-width="1.4"/>
      <line x1="93" y1="60" x2="96" y2="60" stroke-width="1.4"/>
      <line x1="92" y1="68" x2="94" y2="70" stroke-width="1.4"/>
      <line x1="76" y1="68" x2="74" y2="70" stroke-width="1.4"/>
      <line x1="75" y1="60" x2="72" y2="60" stroke-width="1.4"/>
      <line x1="76" y1="52" x2="74" y2="50" stroke-width="1.4"/>
      <path d="M92 60 L98 62 L97 66 L92 65"/>
      <path d="M76 66 Q60 70 52 78 Q46 86 48 92 L80 92 Q86 86 84 78 Q82 72 78 68"/>
      <path d="M74 66 Q68 54 56 48 Q50 56 54 64 Q62 70 72 68"/>
      <path d="M50 82 Q40 80 40 72 Q44 68 48 72"/>
      <rect x="54" y="94" width="26" height="6" rx="0.8"/>
      <line x1="67" y1="94" x2="67" y2="100" stroke-width="1.2"/>
      <rect x="48" y="102" width="36" height="5" rx="1"/>
      <circle cx="86" cy="58" r="1" fill="currentColor" stroke="none"/>
    `,

    globe: `
      <circle cx="66" cy="60" r="20"/>
      <ellipse cx="66" cy="60" rx="20" ry="6.5" stroke-width="1.5"/>
      <ellipse cx="66" cy="60" rx="6.5" ry="20" stroke-width="1.5"/>
      <line x1="48" y1="52" x2="84" y2="52" stroke-width="1" opacity="0.7"/>
      <line x1="48" y1="68" x2="84" y2="68" stroke-width="1" opacity="0.7"/>
      <line x1="66" y1="80" x2="66" y2="92" stroke-width="2.4"/>
      <rect x="54" y="92" width="24" height="5" rx="1"/>
      <rect x="48" y="97" width="36" height="6" rx="1"/>
    `,

    cannes: `
      <rect x="50" y="32" width="32" height="68" rx="1.5" stroke-width="2"/>
      <path d="M66 92 Q66 78 66 64 Q66 50 66 38" stroke-width="2"/>
      <path d="M66 78 Q60 74 52 80 Q56 76 66 78 Z"/>
      <path d="M66 78 Q72 74 80 80 Q76 76 66 78 Z"/>
      <path d="M66 66 Q60 60 52 64 Q58 60 66 66 Z"/>
      <path d="M66 66 Q72 60 80 64 Q74 60 66 66 Z"/>
      <path d="M66 54 Q60 48 54 50 Q60 46 66 54 Z"/>
      <path d="M66 54 Q72 48 78 50 Q72 46 66 54 Z"/>
      <path d="M66 44 Q62 38 58 38 Q62 36 66 44 Z" stroke-width="1.5"/>
      <path d="M66 44 Q70 38 74 38 Q70 36 66 44 Z" stroke-width="1.5"/>
      <path d="M58 92 L74 92 L76 100 L56 100 Z"/>
    `,

    berlin: `
      <path d="M82 38 Q88 38 90 44 Q90 50 86 54 L80 56 Q76 56 74 52 Q74 46 76 42 Q78 38 82 38 Z"/>
      <path d="M76 38 Q74 33 78 33 Q80 35 80 38"/>
      <path d="M88 48 L93 50 L92 54 L86 53"/>
      <path d="M76 56 Q66 64 64 78 L64 96 Q66 102 72 102 L82 102 Q88 100 88 92 L88 70 Q88 60 82 56"/>
      <path d="M76 64 Q66 60 58 64 Q64 68 72 70"/>
      <path d="M76 76 Q66 72 60 76 Q66 80 74 80"/>
      <ellipse cx="72" cy="106" rx="6" ry="2"/>
      <ellipse cx="84" cy="106" rx="6" ry="2"/>
      <rect x="48" y="110" width="36" height="4" rx="1"/>
      <circle cx="84" cy="46" r="0.9" fill="currentColor" stroke="none"/>
      <line x1="58" y1="63" x2="55" y2="62" stroke-width="1"/>
      <line x1="58" y1="65" x2="55" y2="65" stroke-width="1"/>
      <line x1="58" y1="67" x2="55" y2="68" stroke-width="1"/>
    `
  };

  // Festival → halo CSS variable name
  const HALO_VAR = {
    oscar:  '--halo-oscar',
    cannes: '--halo-cannes',
    venice: '--halo-venice',
    berlin: '--halo-berlin',
    bafta:  '--halo-bafta',
    globe:  '--halo-globe'
  };

  // Per-festival glyph stroke widths from the design — deliberate compensation
  // for visual density. Uniform 2px would silently degrade Cannes and Oscar.
  const STROKE_WIDTH = {
    oscar:  2.2,
    cannes: 1.6,
    venice: 2.0,
    berlin: 2.0,
    bafta:  2.0,
    globe:  2.0
  };

  // Tier-driven opacities — silver nominee softens halo + glyph relative to gold winner.
  function opacities(isWinner) {
    return {
      halo:  isWinner ? '1'    : '0.65',
      glow:  isWinner ? '0.25' : '0.15',
      inner: isWinner ? '0.5'  : '0.3',
      glyph: isWinner ? '1'    : '0.85'
    };
  }

  /**
   * Build SVG markup for a single badge.
   * @param {string} festivalId — oscar|cannes|venice|berlin|bafta|globe
   * @param {string} status — 'winner' | 'nominee'
   * @returns {string} SVG markup
   */
  function buildBadge(festivalId, status) {
    const glyph = GLYPH_MARKUP[festivalId];
    const haloVar = HALO_VAR[festivalId];
    if (!glyph || !haloVar) {
      console.warn('[award-badges] Unknown festival id:', festivalId);
      return '';
    }
    const isWinner = status === 'winner';
    const op = opacities(isWinner);
    const sw = STROKE_WIDTH[festivalId];

    // BAFTA's GLYPH_MARKUP carries an SVG <mask>; substitute a unique id per
    // instance so multiple BAFTA badges on the same page don't collide.
    let glyphContent = glyph;
    if (festivalId === 'bafta') {
      const maskId = 'bafta-cutouts-' + Math.random().toString(36).slice(2, 9);
      glyphContent = glyph.replace(/__BAFTA_MASK_ID__/g, maskId);
    }

    return `<svg viewBox="0 0 132 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${festivalId} ${status}">`
      + `<circle cx="66" cy="66" r="62" fill="none" stroke="var(${haloVar})" stroke-width="1.6" opacity="${op.halo}"/>`
      + `<circle cx="66" cy="66" r="62" fill="none" stroke="var(${haloVar})" stroke-width="3" opacity="${op.glow}"/>`
      + `<circle cx="66" cy="66" r="58" fill="none" stroke="var(${haloVar})" stroke-width="1" opacity="${op.inner}"/>`
      + `<g transform="translate(-3.3,-10.65) scale(1.05)" stroke="currentColor" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${op.glyph}">`
      + glyphContent
      + `</g>`
      + `</svg>`;
  }

  /**
   * Render a single badge as SVG markup string.
   * @param {string} festivalId
   * @param {string} status
   * @returns {string}
   */
  window.renderAwardBadge = function (festivalId, status) {
    return buildBadge(festivalId, status || 'winner');
  };

  /**
   * Bulk render — find all [data-award-badge] elements within root (or document)
   * and inject their SVG. Idempotent: safe to re-run after DOM changes.
   * @param {Element} [root] — defaults to document
   */
  window.renderAwardBadges = function (root) {
    (root || document).querySelectorAll('[data-award-badge]').forEach(function (el) {
      const festival = el.dataset.awardBadge;
      const status = el.dataset.status || 'winner';
      el.innerHTML = buildBadge(festival, status);
    });
  };

  /**
   * Detect canonical badge id from a festival name string.
   * @param {string} festivalName — e.g. "Cannes", "Golden Globe", "Academy Awards"
   * @returns {string|null} canonical id, or null if unrecognised
   */
  window.detectFestivalId = function (festivalName) {
    if (!festivalName) return null;
    const s = String(festivalName).toLowerCase().replace(/[^a-z]/g, '');
    if (!s) return null;
    if (s.includes('oscar') || s.includes('academy')) return 'oscar';
    if (s.includes('cannes') || s.includes('palme')) return 'cannes';
    if (s.includes('venice') || s.includes('mostra') || s.includes('goldenlion')) return 'venice';
    if (s.includes('berlin') || s.includes('berlinale') || s.includes('goldenbear')) return 'berlin';
    if (s.includes('bafta') || s.includes('britishacademy')) return 'bafta';
    if (s.includes('goldenglobe') || s === 'globe' || s.includes('globes')) return 'globe';
    return null;
  };

  // Auto-render on DOM ready so static markup just works.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.renderAwardBadges(); });
  } else {
    window.renderAwardBadges();
  }
})();
