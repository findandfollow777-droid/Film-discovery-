# ORBIT Glyph System — Audit Report

**Date:** 2026-05-23
**Project root:** `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/`
**Auditor:** Investigation only — no source files modified.

---

## Files examined

| File | Lines | Purpose |
|---|---|---|
| `components/orbit-glyphs.css` | 502 | Canonical `.og-*` definitions (background-image SVG data-URIs). **84 distinct glyphs** + 1 base class + 2 size variants + 1 state modifier. |
| `data/festival-glyphs.js` | 77 | "Two-Ring Orbit" festival glyph SVG strings (6 festivals), inlined via `window.renderFestivalGlyph()` based on `data-festival="{id}"`. Phase 1.11 canonical festival markers. |
| `games/replace_icons.sed` | 9 | Legacy sed migration for a non-glyph "stats button bar" (replaces three `<div class="bar">` placeholders with an inline `<svg class="icon-symbol">`). **Not a glyph definition file.** No archived history of an earlier `.og-*` migration. |

No other `*glyph*` / `*icon*` files exist under the project (excluding `node_modules`).

> Note: `CLAUDE.md` Rule 11 says "58 custom SVG outline icons." The real count today is 84 (excluding `.og` base, `.og-lg`/`.og-sm` size variants, and `.og-nominee` filter modifier). Per the brief I am simply reporting the actual number — not editing CLAUDE.md.

---

## 1. Glyph Inventory

### 1A. `components/orbit-glyphs.css` — 84 glyphs

All glyphs are 100×100 viewBox unless noted. Standard pattern: stroke-only outline (no fill), `stroke-linecap='round'`, sized via `width/height: 1.1em` (base `.og`).

Variants:
- `.og` base — `1.1em` square, `vertical-align: -0.15em`.
- `.og-lg` — `1.4em` square.
- `.og-sm` — `0.9em` square.
- `.og-nominee` — modifier filter (`brightness(0.5) saturate(0.3); opacity: 0.7;`) — mutes gold glyphs to silver.

Hex shorthand used below: cyan `#00d9ff`, gold `#ffd700`, silver-slate `#94a3b8`, purple `#a855f7`, orange `#ff6b35`, green `#10b981`, red `#ef4444`, navy `#1e293b`, dark-cyan `#06b6d4`.

#### UI / Action (lines 32–71)

| Class | Visual | Color(s) | Stroke | Notes |
|---|---|---|---|---|
| `.og-link` | Two interlocking chain links with a short diagonal joining stroke | cyan | 6 | Three-path composite |
| `.og-shuffle` | Two crossing X-paths with arrowheads at right ends | cyan | 6 | Linejoin=round |
| `.og-reset` | Three-quarter circle arc with hooked re-entry tail | cyan | 6 | Reload pattern |
| `.og-clipboard` | Clipboard rect with rounded clip + 3 horizontal text lines | cyan | 4–5 | |
| `.og-sparkle` | Big 4-point star with two smaller star companions | cyan | 3–4 | 3 stars total |
| `.og-heart` | Outline heart, classic Bezier | cyan | 6 | "Love It" outline state |
| `.og-heart-filled` | Filled cyan heart | cyan (fill+stroke) | 4 | Only filled glyph among hearts |
| `.og-moon` | Crescent moon (skip / "not tonight") | silver-slate | 5 | One of the few non-cyan/non-gold UI glyphs |

#### Mood / Emotion (lines 78–101)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-laugh` | Smiley with closed-eye arches, open mouth with teeth line | gold | r=40 face |
| `.og-touched` | Face with two-circle eyes, smiling mouth, single cyan tear (the only non-gold accent) | gold (+ cyan tear) | Composite |
| `.og-relieved` | Face with two arched closed-eye marks + slight smile | gold | |
| `.og-sad` | Face with downturned mouth | silver-slate | Only silver mood face |
| `.og-party` | Party popper triangle with confetti dots and accent rays | gold + cyan dots | Multi-color |

#### Colored Game Indicators — abstract color tokens (lines 110–136)

Filled square/circle pills used in share grids (Connections-style). Each is a 100×100 `<rect rx=10>` or `<circle>` filled with a brand color and an outer 4px stroke at ~50% alpha.

| Class | Fill |
|---|---|
| `.og-sq-yellow` | gold `#ffd700` |
| `.og-sq-green` | green `#10b981` |
| `.og-sq-blue` | cyan `#00d9ff` |
| `.og-sq-purple` | purple `#a855f7` |
| `.og-sq-orange` | orange `#ff6b35` |
| `.og-sq-red` | red `#ef4444` |
| `.og-sq-black` | navy `#1e293b` (slate `#64748b` stroke) |
| `.og-circle-green` | green |
| `.og-circle-black` | navy |

#### Special / Thematic (lines 143–176)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-candle` | Memorial candle: teardrop flame, narrow wick, broad base with ellipse rim | gold flame + silver body | Mixed colors |
| `.og-swirl` | Inward-curling 1.5-loop spiral path | purple | "Alternate universe" |
| `.og-speech` | Speech bubble with tail and two horizontal lines | cyan | |
| `.og-explosion` | 8-pointed star/burst polygon | orange | |
| `.og-fire` | Tall outer flame outline with inner flame | orange (outer) + gold (inner) | Two-color |
| `.og-flag` | Vertical pole + checkered flag (rect with 2 vertical + 2 horizontal subdivisions) | silver pole + cyan flag | Two-color |
| `.og-triangle` | Equilateral upward triangle | orange | "Triple collision" |

#### Data / Visualization (lines 183–211)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-pie` | Circle with 3 radial slice lines | cyan | |
| `.og-handshake` | Two converging arm/hand paths meeting at center | cyan | Composite, 4 paths |
| `.og-trending` | Up-right zigzag with arrowhead-corner | green | The only green stat glyph |
| `.og-pin` | Map pin teardrop with inner circle | red | Only red pin |
| `.og-calendar` | Calendar rect with header bar, two top tabs, four bottom date dots | cyan | |
| `.og-stats` | Three vertical bar chart bars (ascending heights) | cyan | |

#### Content Type / Category (lines 218–266)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-brain` | Two-lobe brain outline with vertical center line and curve marks | cyan | |
| `.og-notepad` | Notepad rect with 4 internal text lines | cyan | |
| `.og-revenue` | Money bag: drawstring top tied with knot, "$" character composed of curves | green | |
| `.og-target` | Bullseye with 3 concentric rings + center dot | red | |
| `.og-satellite` | Dish + signal arc rays | cyan | |
| `.og-couch` | Sofa with armrests, cushion seam, two legs | gold | "Comfort viewing" |
| `.og-rocket` | Rocket body with porthole, side fins, orange flame at base | cyan body + orange flame | Two-color |
| `.og-ufo` | UFO with dashed beam lines, dome, porthole | cyan | Uses `stroke-dasharray` |
| `.og-galaxy` | Two crossed tilted ellipses + central star + 4 corner stars | cyan + purple + gold | Three colors |
| `.og-planet` | Saturn-style circle + tilted gold ring | cyan body + gold ring | Two-color |

#### Festival / Award — Legacy decorative (lines 269–333)

A header comment block explicitly states these are **superseded** for canonical festival markers by `data/festival-glyphs.js`. They remain in-use as decorative/hero imagery on awards info pages and as `data-glyph` markers in the discover Quick Search festival chips.

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-palm` | Palm tree with arched fronds and pot | gold | Cannes |
| `.og-lion` | Frontal lion bust with curved wing flourishes on either side | gold | Venice — large multi-path composite |
| `.og-bear` | Frontal bear bust with rounded ears, arms outstretched, paws | gold | Berlin — large multi-path composite |
| `.og-globe` | Sphere with meridian + equator + 2 lat lines | gold | Golden Globe |
| `.og-oscar` | Stylized statuette: round head, shoulders/torso column, base | gold | Original |
| `.og-bafta` | Shield-shape mask with eyes, slight brow tufts, smile arc | gold | |
| `.og-statuette` | Tall knight column with 100×140 viewBox (taller than rest), detailed armor segments, plinth base | gold | The only non-100×100 glyph |
| `.og-mask` | Theater mask ellipse with eyes, vertical nose stroke, smile, pedestal base | gold | |
| `.og-nominee` (modifier) | (filter only) `brightness 0.5 saturate 0.3 opacity 0.7` | — | Mutes gold to silver for nominees |

#### Content Category — Crew & Person (lines 340–404)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-books` | Two open book leaves (mirrored "V") meeting at spine | cyan | "Miniseries" per comment |
| `.og-tent` | Circus tent triangular roof + door arch + central pole | orange | "Reality TV" |
| `.og-mic` | Microphone capsule + grille curve + stand pole + base bar | cyan | Talk show |
| `.og-newspaper` | Newspaper with masthead bar and 3 body lines, folded edge | cyan | News |
| `.og-music` | Single eighth note: oval head + stem + flag | cyan | |
| `.og-film` | Filmstrip frame: outer rect with top/bottom sprocket holes (8 holes) and central horizontal lines | cyan | High-traffic glyph |
| `.og-person` | Full-circle ring with inner secondary ring + head circle + shoulders arc | cyan + faint inner ring | "Fallback for missing actor portrait" |
| `.og-person-bare` | Head + shoulders only (no outer ring) | cyan | For use inside hex frames |
| `.og-person-bare-gold` | Same as `og-person-bare` but in gold | gold | Goal-side variant in Journeys |
| `.og-camera` | DSLR-style camera body + lens-hump + central lens circle | cyan | Cinematography |
| `.og-studio` | Classical pediment building: triangular roof, 4 vertical columns, base bar | cyan | |
| `.og-writing` | Quill/pen tilted with paper triangle nib detail | cyan | |
| `.og-scissors` | Two circles + crossed blades to a point | cyan | Editing |

#### Game-Specific (lines 411–476)

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-eagle` | Heart-like crest shape with two eye dots + chevron beak + V-tail feet | gold | "Under par" in Journeys |
| `.og-tracks` | Railroad: 2 long vertical rails + 4 horizontal sleepers | cyan | |
| `.og-snapshot` | Camera with small gold flash burst at upper right | cyan body + gold flash | |
| `.og-eye` | Eye almond outline + iris ring + pupil dot (filled) | cyan | |
| `.og-thumbsup` | Thumb pointing up + closed palm rect | green | Only green action glyph |
| `.og-grad` | Mortarboard cap + base + tassel cord with bob | cyan | |
| `.og-dice` | Square die with 5 dots (showing the 5-face) | cyan | |
| `.og-tv` | TV rectangle + stand bar + leg | cyan | |
| `.og-timer` | Stopwatch face + crown + two hands at 12 and 3 | cyan | |
| `.og-trophy` | Trophy cup body + 2 side handles + stem + base | gold | High-traffic |
| `.og-star` | Classic 5-point star outline | gold | High-traffic — overloaded (see §3) |
| `.og-rising-star` | Three nested 5-point stars: outer dark-cyan, middle cyan, inner gold | dark-cyan + cyan + gold | Three colors |
| `.og-timeline-journey` | 52×52 viewBox; double ring (cyan outer, gold inner) + rising curved cyan path + gold arrowhead + faded cyan start dot | cyan + gold | The **only glyph with `--glyph-size` CSS custom prop** (default 24px); used on Timeline header emblem |

#### Signal Game (lines 480–502, "Added 2026-05-02")

| Class | Visual | Color | Notes |
|---|---|---|---|
| `.og-lightbulb` | Bulb dome + filament arc + screw cap horizontal lines + radiating rays | purple | Hint unlocked — purple matches hint system |
| `.og-lock` | Padlock body + shackle arc + keyhole dot + drop tail | silver-slate | "Gated state" |
| `.og-arrow-left` | Horizontal line + chevron arrowhead | cyan | Back navigation |
| `.og-bolt` | Classic lightning bolt zigzag polygon | cyan | "Quick Searches / instant action" |

---

### 1B. `data/festival-glyphs.js` — 6 festival glyphs

These are the **canonical festival markers** (per the comment block in `orbit-glyphs.css` at line 273). Pattern: outer thin circle in festival accent + tilted inner ellipse in festival accent + festival name in Orbitron 900 gold + a single 3px gold marker dot positioned on the outer circle's path. ViewBox `0 0 200 200`. Used via `<div data-festival="{id}">` + `window.renderFestivalGlyphs()`.

| Key | Aria-label | Outer-ring color token | Ellipse rotation | Marker-dot position | Text |
|---|---|---|---|---|---|
| `oscar` | "Oscar" | `var(--fest-oscar)` | -15° | (20, 124) | OSCAR (size 26) |
| `cannes` | "Cannes" | `var(--fest-cannes)` | +20° | (178, 76) | CANNES (size 22) |
| `venice` | "Venice" | `var(--fest-venice)` | -30° | (38, 46) | VENICE (size 22) |
| `berlin` | "Berlin" | `var(--fest-berlin)` | +35° | (170, 142) | BERLIN (size 24) |
| `bafta` | "BAFTA" | `var(--fest-bafta)` | +8° | (180, 118) | BAFTA (size 26) |
| `globe` | "Golden Globe" | `var(--fest-globe)` | -8° | (22, 84) | GOLDEN / GLOBE (2 lines, size 16) |

`renderFestivalGlyph(container, festivalId)` writes the SVG into `container.innerHTML`. `renderFestivalGlyphs()` walks all `[data-festival]` elements. Confirmed callers: `pages/awards-guide.html:184` calls the latter on load; `pages/awards-guide.html` lines 52–112 contain the 6 `.tile-trophy` containers.

**Important slug note:** `data/festival-glyphs.js` uses the key `globe` for Golden Globe. `pages/awards2.html:38` uses `data-festival="gg"`, which **will not match** the FESTIVAL_GLYPHS dictionary — this is a known landmark-truth slug discrepancy (`gg` vs `globe`). Not in scope to fix here, but flagged for the design lead.

---

## 2. Page-by-Page Glyph Usage

Files with no `.og-*` references are omitted. Grouped by file. Glyph contexts inferred from surrounding markup/CSS.

### `pages/home.html`

| Line | Glyph(s) | Context | Visual treatment |
|---|---|---|---|
| 162 | `og-target` | "MAKE ANCHOR FILM" disabled button text | Default inline 1.1em |
| 607 | `og-dice` | `.arc-ghost` — ghost decorative dice in randomizer card | Decorative ghost |
| 985 | `og-star gold` | Prestige Circuit cell — labelled ACADEMY (Oscar count) | `.glyph-cell .og { font-size:28px; display:block; margin-bottom:10px; }` + `.gold` color helper class |
| 990 | `og-globe gold` | Cell labelled GOLDEN GLOBE | same 28px treatment |
| 995 | `og-film cyan` | Cell labelled BAFTA | same 28px |
| 1000 | `og-palm green` | Cell labelled CANNES | same 28px |
| 1005 | `og-lion purple` | Cell labelled VENICE | same 28px |
| 1010 | `og-bear amber` | Cell labelled BERLIN | same 28px |
| 549 | `og-star` (in `data-glyph`) | `.pyo-block` AWARDS hero portal block, color `#f1f5f9` | Set via JS render of `data-glyph` attribute |

**Semantic notes for home.html:**
- The prestige circuit row uses six different glyphs as festival markers, but instead of using the canonical `data/festival-glyphs.js` Two-Ring marks, it mixes legacy `og-*` glyphs **AND** retints them with one-word color helper classes (`.gold/.cyan/.green/.purple/.amber`) defined inline elsewhere in home.css. This is the only place in the codebase doing single-word color tinting of `.og-*` glyphs. **Note:** the `.green` and `.amber` and `.cyan` and `.purple` color classes don't appear to apply to `.og-*` strokes (the SVG strokes are baked into the data-URI), so the home prestige cells will render in each glyph's hard-coded SVG color, NOT in the labelled tint. This is likely a stale/non-functioning override.
- `og-star gold` here means "Academy / Oscars" — semantically distinct from `og-star` as a TMDB rating star elsewhere.

### `pages/compare.html` / `compare.js`

| Line | Glyph | Context |
|---|---|---|
| 43 | `og-sparkle` | `.compare-btn-icon` — sparkle in the Compare CTA |
| 66 | `og-planet` | Tab — Orbital Rings |
| 68 | `og-calendar` | Tab — Timeline |
| 69 | `og-stats` | Tab — Radar |
| 70 | `og-galaxy` | Tab — Word Nebula |
| 78, 92, 99, 106 | same 4 + `og-lg` | `.placeholder-icon` for empty/loading panels |
| compare.js:1465 | `og-calendar og-lg` | Inline empty panel render |
| compare.js:2176 | `og-trophy og-lg` | `.awards-empty-icon` empty state |

### `pages/profile.html`

| Line | Glyph | Context |
|---|---|---|
| 103 | `og-planet` | Inline 22px (style attr) — profile section identity glyph |

### `pages/anchor-point.html` / `anchor-point.js`

| Line | Glyph | Context |
|---|---|---|
| 581 | `og-galaxy` | "EXPAND MY UNIVERSE" CTA |
| 612 | `og-sparkle` | `.expand-icon` |
| 635 | `og-sparkle` | "Make This the Anchor" button |
| anchor-point.js:1224 | `og-galaxy` | Programmatic render of the same expand CTA |

### `pages/anchor.html` / `anchor.js`

| Line | Glyph | Context |
|---|---|---|
| 45 | `og-film` | "OPEN FILM CUBE" button |
| 60 | `og-galaxy` | "EXPAND MY UNIVERSE" |
| anchor.js:458 | `og-galaxy` | "EXPLORE DEEPER" — same galaxy reused for a different label |
| anchor.css:186 | (size override) | `.anchor-open-cube .og { width: 14px; height: 14px; }` — explicit 14px |

### `pages/awards2.html` / `awards2.js`

| Line | Glyph | Context |
|---|---|---|
| awards2.js:470 | `og-film` | `.tile-no-poster` fallback for missing poster |

### `pages/awards-browse.js`

| Line | Glyph | Context |
|---|---|---|
| 692, 745 | `og-film` | `.no-poster` fallback inside award tile poster |
| 1544 | `og-sparkle landmark-btn-glyph` | Landmark filter button (sparkle = landmark marker), CSS `font-size:13px` |
| 1553 | `og-sparkle landmark-strip-icon` | Landmark strip header, CSS `font-size:16px; color:var(--fest-cannes)` |

### `pages/awards-browse.css`

`.award-tile-poster .no-poster .og` — size override for fallback film glyph.

### `pages/awards-guide.html`

| Line | Context |
|---|---|
| 52–112 | Six `.tile-trophy[data-festival="…"]` tiles populated by `window.renderFestivalGlyphs()`. **This is the canonical Two-Ring festival marker rendering site.** |
| 184 | Inline call to `window.renderFestivalGlyphs()` |
| `.tile-trophy .og` (awards-guide.css:377) | `width: 200px; height: 200px;` |
| `.festival-tile:hover .tile-trophy` (~387) | Two `drop-shadow` filters: `0 0 16px rgba(255,215,0,0.6)` + `0 8px 36px rgba(255,215,0,0.35)`, plus `transform: scale(1.05)` |

### `pages/awards-guide-festival.css`

`.hero-decorative-glyph .og` and `.top-prize-watermark .og`: both `width:100%; height:100%; display:block` — fills its container at hero/watermark scale. Per the orbit-glyphs.css comment block, these decorative slots are where the legacy `.og-palm/.og-lion/.og-bear/.og-globe/.og-oscar/.og-bafta` drawn glyphs are still intentionally in use.

### `pages/discover.html` / `discover.js`

| Line | Glyph | Context |
|---|---|---|
| html:410 | `og-film cinema-planet-glyph` | Hero glyph in discovery-onboarding popup; CSS sets `width:80px; height:80px` (56px on mobile) |
| html:419 | `og-sparkle` (in `.orbit-indicator`) | Indicator pip; CSS `.discovery-onboarding-popup .orbit-indicator .og { width:12px; height:12px; }` |
| html:428 | `og-target strip-icon` | Filter strip icon |
| html:437 | `og-books strip-icon` | Filter strip icon |
| html:446 | `og-bolt strip-icon` | Filter strip icon |
| discover.js:5436–5441 | `og-oscar`, `og-palm`, `og-bafta`, `og-lion`, `og-bear`, `og-globe` | Festival chip glyphs in Awards filter (Quick Search modal) |
| discover.js:5386 | (none — inline `<svg>`) | Awards rebuild disclaimer uses a hand-written warning triangle SVG; comment notes `(no og-warning glyph in the current set)` |

### `pages/my-challenges.html`

| Line | Glyph | Context |
|---|---|---|
| 23 | `og-trophy` | `.mc-section-title` header — "Rivalries" |

### `pages/randomizer.html` / `randomizer.js`

| Line | Glyph | Context |
|---|---|---|
| html:493 | `og-shuffle og-lg` | "Respin All" CTA |
| html:496 | `og-reset og-lg` | "Adjust" CTA |
| randomizer.js:709 | `og-thumbsup` | Taste action: "Love It" |
| randomizer.js:712 | `og-couch` | Taste action: "Watch Later / Watchlisted" |
| randomizer.js:715 | `og-sad` | Taste action: "Not Tonight" |
| randomizer.js:801, 812 | `og-couch` | Watchlist toggle states |

### `pages/tv-randomizer.html` / `tv-randomizer.js`

Same shuffle/reset/thumbsup/sad pattern as randomizer.

### `pages/results.js`

| Line | Glyph | Context |
|---|---|---|
| 857 | `og-revenue` | `.tooltip-revenue` |
| 951 | `og-target` | `.capped-icon` |
| 1463, 1535 | `og-couch` | Taste affordance |
| 1467, 1539 | `og-sparkle` | Taste affordance |
| 1471, 1543 | `og-film` | Taste affordance |

### `pages/results-classic.html`

| Line | Glyph | Context |
|---|---|---|
| 202 | `og-candle` (in `.memorial-icon`) | In-memoriam decoration |

### `pages/venn.html` / `venn.js`

| Line | Glyph | Context |
|---|---|---|
| html:151 | `og-candle` | `.memorial-icon` |
| venn.js:409–413 | `og-writing`, `og-camera`, `og-music`, `og-scissors`, `og-film` | Crew category labels (Writing / Cinematography / Music / Editing / Other Crew) |
| venn.js:1649 | `og-revenue` | Box office text |

### `pages/timeline.html` / `timeline.js`

| Line | Glyph | Context |
|---|---|---|
| html:35 | `og-timeline-journey header-emblem-glyph` | Page header emblem. CSS `.header-emblem-glyph { --glyph-size: 40px; filter: drop-shadow(0 0 6px rgba(255,215,0,0.35)); }` |
| html:252 | `og-candle` | `.memorial-icon` |
| html:364 | `og-film` | "Movie Trivia" header |
| timeline.js:621–625 | `og-writing/og-camera/og-music/og-scissors/og-film` | Crew categories (duplicate of venn.js map) |
| timeline.js:1284 | `og-calendar` | Release date row |
| timeline.js:4463, 4539 | `og-couch` | Taste affordance |
| timeline.js:4467, 4543 | `og-sparkle` | Taste affordance |
| timeline.js:4471, 4547 | `og-film` | Taste affordance |
| timeline.css:2757 | `.bio-award-glyph-btn .og { width:20px; height:20px; }` | Bio award button size override |

### `pages/towatchiverse.html` / `towatchiverse.js`

| Line | Glyph | Context |
|---|---|---|
| 45 | `og-couch` | Mood filter |
| 50 | `og-thumbsup` | Mood filter |
| 55 | `og-eye` | Mood filter |
| 60 | `og-sparkle` | Mood filter |
| 86 | `og-planet og-lg` | Empty-state hero |
| 89 | `og-shuffle` | "Find Something" CTA |
| towatchiverse.js:287 | `og-sparkle` | Compare CTA |
| towatchiverse.css:501 | `.towatchiverse-empty .og { font-size: 48px; opacity: 0.3; }` | Empty-state treatment |

### `pages/people-library.js`

| Line | Glyph | Context |
|---|---|---|
| 97 | `og-oscar` | Filter category icon (Academy) |
| 105 | `og-globe` | Filter category icon (Golden Globe) |
| 113 | `og-bafta` | Filter category icon (BAFTA) |
| 121 | `og-rising-star` | Filter category icon (Rising Star — the only place this glyph is used) |
| 952 | `og-sm og-oscar` | Per-card "× N" Oscar count badge |

### `pages/people-profile.css`

`.pp-awards-table .og { vertical-align: -0.1em; margin-right: 4px; }` — small text-inline tweak.

### `index.html` (root)

| Line | Glyph | Context |
|---|---|---|
| 124 | `og-planet` | Splash hero glyph at 28px gold (inline style `font-size:28px;color:var(--accent-gold)`) — note color won't actually retint stroke baked into data URI |

### `next-frontier.js`

| Line | Glyph | Context |
|---|---|---|
| 335 | `og-star` | Banner |
| 354, 414, 464, 735 | `og-film` | Poster placeholders / badges |
| 367, 432 | **`og-check`** | "SAVED" state — **UNDEFINED in CSS** (orphan invocation; see §3) |

### `games/` — concise summary

| Game | Glyphs used | Notable semantics |
|---|---|---|
| `signal.html/.js` | `og-arrow-left` (back), `og-film` (movie label), `og-lock` (gated hint), `og-lightbulb` (unlocked hint) | First game to wire `og-arrow-left` for back nav. CSS sizes: `signal-back .og` 14px, `movie-label .og` 18px, `hint-btn .og` 16px. |
| `journeys.html/.js` | `og-reset`, `og-clipboard`, `og-person-bare`, `og-person-bare-gold`, `og-dice`, `og-eagle`, `og-target`, `og-trophy` | Person-bare-gold marks the goal actor; eagle/target for under-par/on-par; trophy for win verdicts. CSS: `.score-verdict .og` 1.25em; person-bare 56% of frame. |
| `collision.html` | `og-explosion`, `og-timer`, `og-fire`, `og-flag`, `og-clipboard` | Explosion as collision badge; fire as "active collisions" header; flag for finish/result. |
| `triple-collision.html/.js` | `og-triangle`, `og-timer`, `og-clipboard` | Triangle is the unique triple-collision mark, used 6 times. |
| `connections.html/.js` | `og-link` (badge), `og-shuffle`, `og-clipboard`, `og-party` (success), `og-sad` (fail), `og-sq-yellow/green/blue/purple` | Difficulty rows reuse the abstract color tokens; same colors as NYT Connections game. |
| `constellation.html` | `og-rocket`, `og-ufo`, `og-star og-lg` (result), `og-trophy`, `og-clipboard` | Trophy here = "prestige discoveries", not "winner". |
| `sequel-shot.html` | `og-film` (badge + result) | Film glyph reused both as badge and result. |
| `screenshot.html/.js` | `og-snapshot`, `og-film og-lg`, `og-eye`, `og-eye og-lg`, `og-thumbsup`, `og-clipboard` | Eye verdicts ("Sharp Vision"), thumbsup verdict ("Good Recognition"). |
| `alternate.html/.js` | `og-swirl` (badge), `og-stats` (results), `og-speech` (discussion), `og-fire` (likes counter) | Swirl is unique to Alternate. |
| `mastermind.js` | `og-clipboard` | Share button |

### Components

| File | Glyphs / Patterns |
|---|---|
| `components/moviecube.js` | `og-notepad`, `og-stats`, `og-brain`, `og-heart`, `og-heart-filled`, `og-moon`, `og-film` (Director), **`og-people`** (Top Cast — UNDEFINED), `og-shuffle` (Compare), `og-couch` |
| `components/people-cube.js` | `og-trophy` (award badge), `og-star` (rating + bookmark), `og-calendar`, `og-galaxy`, `og-link`. CSS: `.pcube-awards-badge .og { color:var(--accent-gold); filter: drop-shadow(0 0 4px rgba(var(--accent-gold-rgb),0.4)) }` — gold drop-shadow only applies because the glyph's stroke already happens to be gold. |
| `components/awards.js` | AWARD_EMOJIS map at line 18139: `Oscar→trophy, Cannes→palm, BAFTA→film, Venice→lion, Berlin→bear, Golden Globe→globe`. Note BAFTA's marker is `og-film` here — a **third** semantic for `og-film` (rendered as a generic awards/film placeholder rather than a mask glyph). |
| `components/taste-interactions.js:188` | `og-moon` for "Not Tonight" skip — matches the moon's intended semantic. |

---

## 3. Conflict / Overload Analysis

### Semantically overloaded glyphs

#### `.og-star` — at least 4 distinct meanings
1. **Academy Award marker** — `pages/home.html:985` and `pages/home.html:549` (PYO portal AWARDS block uses `data-glyph="og-star"`); paired with the label "ACADEMY".
2. **TMDB rating star** — `components/people-cube.js:765` (`.pcube-sig-rating` shows `og-star {vote_average}`).
3. **Bookmark/saved indicator** — `components/people-cube.js:943` (`pcube-bookmark-star og og-star`, styled via opacity/filter per a comment at line 1490).
4. **Constellation game result** — `games/constellation.html:177` (result icon).
5. **Generic accomplishment banner** — `next-frontier.js:335`.

Recommendation: any new Quick Search use of `og-star` must specify which of these contexts it belongs to. Suggest reserving `og-star` for rating + bookmark only; route festival/academy semantics through `data/festival-glyphs.js` Two-Ring Oscar mark; route accomplishment to `og-trophy` or `og-sparkle`.

#### `.og-trophy` — overloaded
1. **Generic award marker** — `components/awards.js:18139` AWARD_EMOJIS["Oscar"], default for unknown festivals (line 18161 fallback).
2. **"Prestige" layer marker** — `games/constellation.html:237, 311, 321` (Prestige Discoveries / Prestige Layer).
3. **Win verdict** — `games/journeys.js:2201, 2204` ("X Wins!").
4. **Rivalries section header** — `pages/my-challenges.html:23`.
5. **Empty awards state** — `pages/compare.js:2176`.

#### `.og-film` — overloaded
1. **"Open Film Cube" CTA** — `pages/anchor.html:45`.
2. **No-poster fallback** — `pages/awards-browse.js:692, 745`, `pages/awards2.js:470`, `next-frontier.js`, `games/sequel-shot.html`.
3. **Crew "Other" bucket** — `pages/venn.js:413`, `pages/timeline.js:625`.
4. **Movie Trivia section header** — `pages/timeline.html:364`.
5. **BAFTA festival marker** — `pages/home.html:995`, `components/awards.js:18141`. (This is unexpected; BAFTA's *own* mask glyph (`og-bafta`/`og-mask`) exists but is unused for the festival marker here.)
6. **Director label inside MovieCube** — `components/moviecube.js:259`.
7. **Taste affordance** — `pages/results.js:1471, 1543`; `pages/timeline.js:4471, 4547`.
8. **Signal game movie label** — `games/signal.html:93`.

#### `.og-galaxy` — overloaded
1. "EXPAND MY UNIVERSE" CTA (`anchor-point.html`, `anchor.html`).
2. "EXPLORE DEEPER" CTA (`anchor.js:458`).
3. Word Nebula tab in Compare (`pages/compare.html:70`).
4. People-cube "career" action (`components/people-cube.js:933`).

#### `.og-sparkle` — overloaded
1. Generic "Compare" CTA (`pages/compare.html:43`, `towatchiverse.js`).
2. Anchor / "Make This the Anchor" affordance.
3. Discovery onboarding indicator pip (12px).
4. Awards landmark filter button + strip (`awards-browse.js`).
5. Mood filter on Towatchiverse.
6. Taste affordance (`results.js`, `timeline.js`).

#### `.og-target` — overloaded
1. "MAKE ANCHOR FILM" CTA (`home.html:162`).
2. Capped result icon (`results.js:951`).
3. Filter strip in Discovery (`discover.html:428`).
4. "On Par" / "Tie!" verdicts in Journeys (`journeys.js:876, 2207, 2259`).

#### `.og-couch`, `.og-thumbsup`, `.og-sad`, `.og-moon` — taste verbs
These are consistently used as the four taste affordances ("Watch Later" / "Love It" / "Not Tonight" / skip) across `randomizer`, `tv-randomizer`, `results`, `timeline`, `towatchiverse`, `moviecube`, `taste-interactions`. **Stable / not overloaded.** Safe baseline.

### Used-but-undefined (orphan invocations)

| Glyph class | Where called | Severity |
|---|---|---|
| `og-people` | `components/moviecube.js:261` — "Top Cast" section title | Bug — falls through to base `.og` only (no background-image). Likely intended to be `og-person`. |
| `og-check` | `next-frontier.js:367, 432` — "SAVED" state on Want-to-See button | Bug — same effect (empty box). No checkmark glyph exists in the set. |

### Defined-but-unused glyphs (orphans in CSS)

23 of 84 are never referenced by any HTML or JS markup:

```
og-circle-black
og-circle-green
og-grad
og-handshake
og-laugh
og-mask
og-mic
og-newspaper
og-nominee   (modifier filter — may be used dynamically; see note)
og-pie
og-pin
og-relieved
og-satellite
og-sq-black
og-sq-orange
og-sq-red
og-statuette
og-studio
og-tent
og-touched
og-tracks
og-trending
og-tv
```

Notes on orphan list:
- `og-nominee` is a *modifier* filter; it could be applied dynamically but no markup or JS string in the audited tree adds it. Either dead code or applied via a path I could not detect.
- `og-mask` and `og-statuette` are alternate designs for `og-bafta` and `og-oscar` respectively — multiple aliases for the same concept (see next subsection).
- `og-mic` (talk show), `og-newspaper` (news), `og-tv`, `og-tent` (reality TV), and `og-tracks` (journeys) appear to be category-marker glyphs created for a content-type taxonomy that was never wired in.

### Multiple aliases for the same concept

| Concept | Aliases in CSS | Used? |
|---|---|---|
| Oscar / Academy statuette | `og-oscar` (used) + `og-statuette` (orphan) | Only `og-oscar` is referenced; `og-statuette` (taller 100×140 viewBox "knight column") appears to be an alternate design draft. |
| BAFTA mask | `og-bafta` (used) + `og-mask` (orphan) | Only `og-bafta` is referenced. |
| Camera | `og-camera` + `og-snapshot` (camera with flash) | Both used; `snapshot` is camera + flash burst for the Screenshot game specifically — semantically distinct, not a duplicate. |
| Person silhouette | `og-person` (ringed), `og-person-bare` (cyan, no ring), `og-person-bare-gold` (gold variant) | All three used in distinct contexts. Not a conflict — deliberate family. |
| Color squares | `og-sq-*` 7 colors | Only `yellow/green/blue/purple` used (Connections difficulty); `orange/red/black` orphaned. |
| Color circles | `og-circle-green`, `og-circle-black` | Both orphaned. |

### Sizing inconsistency examples

| File | Selector | Size | Notes |
|---|---|---|---|
| `pages/awards-guide.css` | `.tile-trophy .og` | 200px × 200px | Hero festival tiles |
| `pages/awards-guide-festival.css` | `.hero-decorative-glyph .og` | 100% × 100% | Container-driven |
| `pages/home.css` | `.glyph-cell .og` | font-size: 28px | Prestige strip (treated as inline text) |
| `pages/timeline.css` | `.bio-award-glyph-btn .og` | 20px × 20px | Bio award inline |
| `pages/timeline.css` | `.header-emblem-glyph` (only `og-timeline-journey`) | `--glyph-size: 40px` | The only glyph CSS-var-driven |
| `pages/anchor.css` | `.anchor-open-cube .og` | 14px × 14px | Button inline |
| `components/moviecube.css` | `.watchlist-btn .og` | font-size: 14px | |
| `components/moviecube.css` | `.cube-taste-btn .og` | 14px × 14px | |
| `components/people-cube.css` | `.pcube-action-icon .og` | font-size: 20px | |
| `components/people-cube.css` | `.pcube-secondary-btn .og` | font-size: 16px | |
| `games/signal.css` | `.signal-back .og` / `.movie-label .og` / `.hint-btn .og` | 14 / 18 / 16 px | Three different sizes in one game |
| `pages/towatchiverse.css` | `.towatchiverse-empty .og` | font-size: 48px (opacity 0.3) | Empty-state hero |
| `pages/discover.css` | `.discovery-onboarding-popup .cinema-planet-glyph` | 80px desktop / 56px mobile | |
| `pages/discover.css` | `.discovery-onboarding-popup .orbit-indicator .og` | 12px × 12px | |
| `pages/awards-browse.css` | `.landmark-btn-glyph` | font-size: 13px | |
| `pages/awards-browse.css` | `.landmark-strip-icon` | font-size: 16px; color: `var(--fest-cannes)` | The only place a glyph wrapper has explicit token color (works only because the glyph uses `currentColor`-friendly styling — actually it doesn't; see next bullet) |

### Color override behavior — possible footgun

Almost every glyph in `orbit-glyphs.css` has its stroke color **baked into the SVG data-URI** (e.g. `stroke='%2300d9ff'`). This means:
- Wrapping a glyph in a span with `color: var(--accent-gold)` will **not** retint the SVG.
- The `gold/cyan/green/purple/amber` helper classes used in `pages/home.html` lines 985–1010 do not actually change the rendered glyph color — they affect the surrounding text only. Visually, the prestige circuit row will show whatever color is baked into each glyph (`og-star` gold, `og-globe` gold, `og-film` cyan, `og-palm` gold, `og-lion` gold, `og-bear` gold), not the labelled tint.
- `.pcube-awards-badge .og { color: var(--accent-gold) }` works by coincidence — `og-trophy` is already gold.
- The Awards landmark strip icon (`color: var(--fest-cannes)`) on `og-sparkle` likewise will not retint that glyph from cyan to cannes-green.
- The `.og-nominee` modifier *does* work because it uses `filter: brightness(...) saturate(...)` which manipulates the rendered pixels, not the stroke attribute.

**Implication for Quick Search design:** any new glyph that needs to live in multiple festival tints will need either (a) `currentColor` strokes in the SVG and `color:` on the wrapper, or (b) per-tint duplicate classes like the festival-glyphs.js approach (which uses `var(--fest-*)` CSS vars inside inline SVG, not background-image). The latter is the proven pattern.

---

## 4. Design Pattern Summary

### Sizing tiers (observed)

| Tier | Px | Where |
|---|---|---|
| Inline-text small | 12–14px | Anchor cube button, signal back-arrow, MovieCube watchlist/taste buttons, onboarding indicator pip |
| Inline-text default | 16–18px | `.og` base at 1.1em ≈ 17.6px in 16-base body; landmark-strip-icon 16px; hint button 16px |
| Inline-text large / button | 20–28px | Bio award button 20px; PeopleCube actions 20px; home prestige cells 28px; profile section 22px |
| Hero / emblem | 40–48px | Timeline header emblem 40px (`--glyph-size:40px`); Towatchiverse empty state 48px |
| Onboarding feature | 56–80px | Discovery onboarding cinema-planet-glyph (56 mobile / 80 desktop) |
| Festival tile (canonical) | 200px | `.tile-trophy` in awards-guide |
| Festival hero / watermark | 100% of container | awards-guide-festival hero & watermark slots |

There is no shared CSS custom-property scale — sizes are set per-page in raw px or em. `--glyph-size` exists on `og-timeline-journey` only and is the closest thing to a token system.

### Color treatments — observed semantic mapping

| Color | CSS source | Glyphs / usage |
|---|---|---|
| **Cyan** `#00d9ff` | `--accent-cyan` | Default — movies, UI actions, tabs, neutral category markers. ~55 of 84 glyphs. |
| **Gold** `#ffd700` | `--accent-gold` | Awards, prestige, achievements: `og-trophy`, `og-star`, `og-oscar`, `og-bafta`, `og-globe`, `og-palm`, `og-lion`, `og-bear`, `og-statuette`, `og-mask`, `og-eagle`, `og-couch`. Mood/emotion smiley faces (`og-laugh`, `og-touched`, `og-relieved`, `og-party`). |
| **Silver-slate** `#94a3b8` | (literal — no token) | Muted/inactive: `og-moon`, `og-sad`, `og-lock`, candle body/wick. The `.og-nominee` filter approximates this. |
| **Purple** `#a855f7` | `--prestige-purple` | Alt-universe / hints: `og-swirl`, `og-lightbulb`. Galaxy uses purple as one of three colors. |
| **Orange** `#ff6b35` | `--collision-orange` | Collision game family: `og-explosion`, `og-fire`, `og-triangle`, `og-tent`. Rocket flame accent. |
| **Green** `#10b981` | `--success-green` | Positive states: `og-thumbsup`, `og-trending`, `og-revenue`. Two color-square/circle tokens. |
| **Red** `#ef4444` | `--danger-red` | Negative/location: `og-pin`, `og-target`. One color-square token. |
| **Dark cyan** `#06b6d4` | (literal) | Outer ring of `og-rising-star` only. |

The literal hex values are baked into SVGs — they do not pull from `variables.css` tokens. If `variables.css` changes a token, glyphs will drift out of sync. **Festival glyphs in `data/festival-glyphs.js` *do* use `var(--fest-*)` and `var(--accent-gold)` properly** because they're inline SVG, not data-URI.

### Effect patterns

| Effect | Where | Values |
|---|---|---|
| `filter: drop-shadow(0 0 6px rgba(255,215,0,0.35))` | Timeline header emblem | Subtle gold halo |
| `filter: drop-shadow(0 0 4px rgba(var(--accent-gold-rgb),0.4))` | PeopleCube awards badge | Small gold halo |
| `filter: drop-shadow(0 0 16px rgba(255,215,0,0.6)) drop-shadow(0 8px 36px rgba(255,215,0,0.35))` | Awards-guide festival tile **on hover** + `transform: scale(1.05)` | Big gold bloom |
| `filter: brightness(0.5) saturate(0.3); opacity:0.7` | `.og-nominee` modifier | Mutes gold → silver |
| `opacity: 0.3` | Towatchiverse empty state | Ghosting effect |

The gold drop-shadow + scale-1.05 hover pattern on awards tiles is the closest the codebase has to a documented "premium" glyph treatment.

### Positioning idioms

- **Inline with text** (most common): `<span class="og og-foo"></span> Label text` — the `.og` base sets `vertical-align: -0.15em` so it aligns with cap height.
- **Wrapped icon span**: `<span class="badge-icon"><span class="og og-foo"></span></span>` — used in game badges and similar where extra positioning padding is needed.
- **Hero/decorative**: `.og` filling 100% of a sized container (awards-guide-festival hero).
- **Empty-state ghost**: large + low-opacity (Towatchiverse 48px @ 0.3 opacity; home page `arc-ghost` decorative dice).
- **`aria-hidden="true"`** is applied consistently when the glyph is decorative-only (signal, landmark, people-cube, awards-browse). Where text follows or the glyph itself is the only content of an interactive element, aria-hidden is sometimes omitted (e.g., home.html prestige cells) — minor accessibility inconsistency.

---

## 5. Recommendations Pending Quick Search Design

**Pending Claude Design input — these are observations, not prescriptions.**

### Glyphs to NOT reuse for Quick Search without disambiguation (already overloaded)

- `og-star` — already 4–5 meanings (rating, bookmark, Academy marker, generic accomplishment, constellation result).
- `og-trophy` — generic award marker, prestige layer, win verdict, rivalry section.
- `og-film` — at minimum 8 meanings, most notably **inconsistently** the BAFTA marker (`components/awards.js:18141`) alongside being a generic poster fallback.
- `og-galaxy` — expand / explore / nebula / career.
- `og-sparkle` — compare / anchor affordance / landmark / mood filter / taste affordance.
- `og-target` — anchor CTA / capped result / discover filter / par verdict.

### Glyphs whose semantics ARE stable and safe to extend

- `og-couch` — consistently "comfort viewing / watch later". (`results.js`, `timeline.js`, `randomizer.js`, `tv-randomizer.js`, `moviecube.js`, `towatchiverse.html`.)
- `og-moon` — consistently "skip / not tonight". (`taste-interactions.js`, `moviecube.js`.)
- `og-thumbsup` — consistently "love it / good". (`randomizer.js`, `tv-randomizer.js`, `screenshot.js`, `towatchiverse.html`.)
- `og-sad` — consistently "not tonight / fail". (`randomizer.js`, `tv-randomizer.js`, `connections.js`.)
- `og-heart` / `og-heart-filled` — consistently the unloved / loved pair (`moviecube.js`).
- `og-arrow-left` — back navigation (only used in signal game so far; small footprint, safe to extend across games and pages).
- `og-bolt` — instant action / Quick Search (added 2026-05-02; per the comment, this glyph was explicitly created for Quick Search and is referenced once in `discover.html:446`). **This is the glyph closest to Quick Search's intended brand.**
- `og-clipboard` — share/copy. Universally used in `Share Result` buttons across all games.
- `og-shuffle` — randomize / respin. Consistent.
- `og-reset` — adjust / reset. Consistent.
- `og-calendar` — date / time. Consistent.
- `og-camera`, `og-writing`, `og-music`, `og-scissors` — crew categories. Consistent.
- `og-candle` — in-memoriam. Consistent.
- `og-explosion`, `og-fire`, `og-triangle`, `og-flag`, `og-timer` — collision/triple-collision game family. Consistent within games but unused elsewhere; would be jarring out of that context.

### Visual categories that appear MISSING

These concepts have UI presence in ORBIT but no dedicated glyph exists:

| Missing concept | Evidence in codebase |
|---|---|
| **Check / saved confirmation** | `next-frontier.js` calls `og-check` in two places — does not exist (orphan invocation). Manifested as empty box. |
| **People / group / cast** | `components/moviecube.js:261` calls `og-people` for "Top Cast" — does not exist. `og-person/og-person-bare/og-person-bare-gold` are singular only. |
| **Warning / caution** | `pages/discover.js:5386` comment explicitly notes `(no og-warning glyph in the current set)` and falls back to an inline raw `<svg>` triangle. |
| **Clock / time of day / runtime** | Despite heavy use of decade and runtime features, there is only `og-timer` (stopwatch) and `og-calendar` (date). No clock-face glyph. |
| **Decade / era marker** | Timeline / era-decade-map exist but no era-themed glyph; pages reuse `og-calendar`. |
| **Magnifying glass / search** | A "Quick Search" feature is being designed but no search-magnifier glyph exists. `og-bolt` is the closest brand-aligned glyph but doesn't read as "search". |
| **Filter / funnel** | Quick Search filters use the catch-all `og-target`. No dedicated filter glyph. |
| **Genre tags (action, drama, comedy, horror, romance, thriller, sci-fi, fantasy)** | No genre-specific glyphs. `og-fire` and `og-couch` get repurposed as proxies. |
| **Country / language / region** | The legacy `og-globe` is taken for "Golden Globe". No neutral world-map glyph. |
| **Streaming platform (generic)** | `og-satellite` exists (and is orphaned) but isn't used; `og-tv` exists (orphan) and might fit. |
| **Director's chair / megaphone** | Director is currently rendered as `og-film` (`components/moviecube.js:259`). |
| **Producer / studio executive** | `og-studio` exists for studio buildings (orphan) but no person-role glyphs. |
| **Bookmark / saved-to-list** | Implemented by reusing `og-star` with CSS opacity changes (`components/people-cube.js:1490` comment). |
| **Trending / hot / new** | `og-trending` exists (orphan, green up-chart) and `og-fire` is used for likes. No purpose-built "new release" glyph. |
| **Lists / collections / folders** | No glyph. |
| **Information / help / question** | No glyph. `og-notepad` is the closest. |
| **Settings / gear** | No gear glyph anywhere. |

### Pre-existing-but-unused glyphs that might be wired up to fill some gaps without new design work

- `og-tv` → could be the streaming/TV marker.
- `og-satellite` → streaming/broadcast affordance.
- `og-tracks` → "journeys" game branding (but the game currently uses person glyphs).
- `og-statuette` → tall alternate Oscar — could be used for Academy in places where the current squatter `og-oscar` looks too small.
- `og-mask` → alternate BAFTA — useful if BAFTA's festival marker needs to be visually distinct from the legacy `og-bafta` (which is shaped more like a shield).
- `og-mic` → talk-show / podcast / behind-the-scenes affordance.
- `og-newspaper` → news / criticism / press.
- `og-tent` → reality TV (if TV ever expands per Rule 24 exception).
- `og-grad` → debut / first feature / school-of-X affordance.
- `og-handshake` → collaborations / repeat-pairs (heavily relevant to People Profile and Venn pairings, currently with no glyph).
- `og-pie` → distribution / proportion / "what % of your watchlist".
- `og-pin` → festival location / set location (red).
- `og-relieved`, `og-touched`, `og-laugh` → richer mood spectrum — currently only `og-thumbsup/og-couch/og-sparkle/og-eye/og-sad/og-moon` are wired as taste affordances. These three could expand the mood vocabulary.

### Cleanup candidates (defects, not design)

These are concrete bugs surfaced by the audit. Decisions belong to Daniel — not in scope here to fix:

1. **`og-people` invoked** in `components/moviecube.js:261` but not defined — silent empty box on the Top Cast section title.
2. **`og-check` invoked** twice in `next-frontier.js` (lines 367 and 432) — silent empty box on the SAVED state of Want-to-See.
3. **`og-warning` is referenced in a comment** at `pages/discover.js:5386` — Daniel knows it's missing; the awards disclaimer falls back to an inline SVG instead.
4. **Hex colors baked into data-URIs** mean the `gold/cyan/green/purple/amber` color tints applied at `pages/home.html:985–1010` have no visual effect on the glyph stroke — the prestige circuit's color story is broken at the glyph level.
5. **`data/festival-glyphs.js` key is `globe`**, but `pages/awards2.html:38` uses `data-festival="gg"` — Two-Ring marker will not render on the awards2 page (already noted in Daniel's `reference_orbit_landmark_truth_files.md` memory).
6. **Orphan modifier `og-nominee`** — no JS path adds this class. If the nominee/winner distinction is supposed to be visually represented, the wiring is missing.

---

## Appendix — Quick numeric summary

- **Total `.og-*` definitions** in `orbit-glyphs.css`: 84 (excluding `.og`, `.og-lg`, `.og-sm`, `.og-nominee` modifier — 88 if counted).
- **Festival glyphs** in `data/festival-glyphs.js`: 6.
- **Glyphs used in pages/games/components**: 61 distinct (of 84 defined).
- **Orphan defined-but-unused**: 23.
- **Orphan invoked-but-undefined**: 2 real (`og-check`, `og-people`).
- **HTML markup glyph occurrences**: ~92.
- **JS markup glyph occurrences**: ~107.
- **Files with `.og-*` overrides** (excluding `orbit-glyphs.css`): 24.
- **CLAUDE.md says 58 glyphs.** Actual: 84. (Rule 11 documentation is stale; report only — no edit.)

---

## 6. Non-`.og-*` Icon Systems (Supplemental Audit)

The first five sections of this report focused on the `.og-*` glyph system
and the festival-glyph system. The games directory and several pages also
contain a parallel ecosystem of bespoke icons — inline SVGs, JS sprite
libraries, and data-URI CSS backgrounds — that do not use the `.og-` prefix
and therefore were invisible to the first sweep. This supplement catalogues
those systems.

Scope of this sweep: every file in `games/`, every file in `pages/`, and
every file in `components/` except `components/orbit-glyphs.css`. Only
icon-like SVGs are listed; the `feTurbulence` data-URI noise textures used
as backdrop grain across all game CSS files were checked and are
decorative-only (one per game CSS file plus `signal.css:425`, `series.css:102`,
`tenth-star.css:47`).

### 6.1 Arcade icon ecosystem (`games/arcade.{html,css,js}`)

#### 6.1a Inline header/affordance SVGs in `games/arcade.html`

| Line | Purpose | viewBox | Visual |
| --- | --- | --- | --- |
| 46 | Profile link in header (`<a class="profile-link">`) | 0 0 24 24 | Person bust — `<circle cx=12 cy=8 r=4>` + shoulders path |
| 49 | "Day Streak" stat-pill icon | 0 0 24 24 | Five-point star (`M12 2l2.4 7.2…`) |
| 70 | "Daily Challenges" section-title icon | 0 0 24 24 | Five-point star (same path) |
| 239 | "Weekly Challenges" section-title icon | 0 0 24 24 | Five-point star (same path) |
| 288 | "Challenge Mode" section-title icon | 0 0 24 24 | Diamond/rhombus (`M12 2L22 12L12 22L2 12z`) |
| 345 | "Discovery Tools" section-title icon | 0 0 24 24 | Person bust (`circle cx=12 cy=8 r=3.5` + shoulders) |
| 359 | "The Observatory" game-card icon (Discovery Tools) | 0 0 24 24 | Larger person bust with two faded side-circles |
| 382 | "Your Stats" section-title icon | 0 0 24 24 | Bar-chart (three rects of increasing height) |

The star path is repeated identically four times in this file alone (and
many more times in the per-game JS files — see 6.5).

#### 6.1b `.orbit-icon` two-ring component

Defined: `games/arcade.css:443–502` plus `.tenth-star-glyph` block 504–554.
Structure (three nested elements per game card):

```html
<div class="orbit-icon">
  <div class="orbit-ring-outer"></div>
  <div class="orbit-ring-inner"></div>
  <svg class="orbit-glyph" viewBox="0 0 24 24" …>…</svg>
</div>
```

- Outer ring: 100% size, 2px solid `var(--card-accent, var(--accent-cyan))`,
  cyan glow, `animation: orbit-spin 12s linear infinite`.
- Inner ring: 65% size, 2px solid `var(--accent-gold)`, gold glow,
  `animation: orbit-spin 8s linear infinite reverse` (counter-rotating).
- Centre glyph: 28×28, `var(--card-accent, var(--accent-gold))`,
  `filter: drop-shadow(0 0 8px currentColor)`. Scales 1.15× on hover.

Used on 9 daily-challenge cards plus 1 weekly + 2 challenge-mode cards
(11 instances). The centre-glyph SVG is unique per card:

| Card | arcade.html line | Centre glyph (viewBox 0 0 24 24) |
| --- | --- | --- |
| Constellation | 85 | Five-point star (filled) |
| Collision Course | 104 | Two overlapping circles (stroked, fill=none) |
| Triple Collision | 123 | Three overlapping circles (stroked, fill=none) |
| Journeys | 142 | Three circles + connecting rect bridges (nodes in a chain) |
| Connections | 161 | 2×2 grid of rounded rects |
| Screenshot Speed | 180 | Camera body rect + central dot lens |
| Sequel Shot | 199 | Three offset squares + crosshair lines |
| Signal | 218 | Concentric arcs radiating from filled dot (Wi-Fi/signal symbol) |
| Tenth Star | 252–267 | See 6.1c — bespoke `tenth-star-glyph` |
| Mastermind | 303 | Diamond/rhombus (filled) |
| Alternate Universe | 323 | Two interlocking arcs forming a circle + centre dot |

#### 6.1c `.tenth-star-glyph` decoration (arcade.html 252–267, arcade.css 504–554)

A central star (`tenth-star-center`, 16×16) plus a rotating ring of
9 mini-stars (`mini-star`, 7×7) positioned at `--star-i: 0..8` × 40° around
a 13px-radius orbit. The orbit container (`.tenth-star-orbit`) rotates
with `tenth-orbit-spin 18s linear infinite`. Represents the Tenth Star
game's "9 known + 1 missing top-10" concept. Used only on this one card.

#### 6.1d Retro pixel-sprite library (`games/arcade.js:149–160`)

Object `SPRITE_TEMPLATES` defines 10 named retro arcade sprites as inline
SVG strings made entirely of `<rect>` elements (pixel-art grids). Used as a
background atmospheric layer via `initRetroSprites()` (arcade.js 166–195):
25 randomly-typed sprites are spawned into `#retroSprites`, each tinted
with one of `tint-{cyan|gold|purple|orange|green|pink|white}`, sized
`size-{sm|md|lg}`, depth-layered (`depth-far|mid|near` controlling opacity
and drift duration), and animated horizontally or vertically.

| Sprite key | viewBox | Description |
| --- | --- | --- |
| `galaga` | 0 0 11 13 | Galaga-style boss bee/insectoid spaceship (head→wings→legs silhouette, ~13 rects) |
| `invader` | 0 0 11 8 | Space Invaders crab/squid invader (classic 11×8 pixel arrangement) |
| `arwing` | 0 0 15 13 | Star Fox Arwing wedge (pointed nose, wide wings, twin tail-fins) |
| `asteroids` | 0 0 12 14 | Asteroids ship silhouette (single stroked triangle-with-notch path) — only stroked sprite, all others are filled rects |
| `rtype` | 0 0 14 7 | R-Type R-9 fighter (low horizontal profile, 4 rects forming a fish-shape) |
| `vicviper` | 0 0 16 9 | Gradius Vic Viper (forward-swept wings, twin engine pods) |
| `defender` | 0 0 14 5 | Defender ship (narrow horizontal sliver) |
| `crosshair` | 0 0 11 11 | Plus-shaped targeting reticle (4 rects, no centre dot) |
| `centipede` | 0 0 7 9 | Centipede mushroom or segment (stacked triangular form) |
| `ghost` | 0 0 14 15 | Pac-Man ghost (rounded top + 4 scalloped feet, eyes are negative space) |

CSS at arcade.css 106–164 styles the layer container, sprite sizing,
tints, depth-opacities, and horizontal/vertical drift animations.

### 6.2 Other games with bespoke icons

#### 6.2a Shared game-page header icons (`.icon-symbol`)

Eleven game-page HTML files include the same two inline SVGs in their
`<header>`:

- **Bar-chart** (`viewBox 0 0 24 24`, three rects 4/14, 10/8, 16/4): "Stats"
  affordance. Identical SVG copy-pasted into the header of every game.
  Lines: `collision.html:45`, `connections.html:44`, `constellation.html:54`,
  `journeys.html:35`, `mastermind.html:44`, `screenshot.html:45`,
  `sequel-shot.html:50`, `tenth-star.html:46`, `triple-collision.html:47`.
- **Lightbulb-with-question-mark** (`viewBox 0 0 24 24`, light-bulb body +
  filament curl + base dot): "Help" / "How to play" affordance. Identical
  copy across all 11 files. Lines: `alternate.html:45`, `collision.html:50`,
  `connections.html:49`, `constellation.html:59`, `journeys.html:40`,
  `mastermind.html:49`, `screenshot.html:50`, `sequel-shot.html:55`,
  `tenth-star.html:51`, `triple-collision.html:52`.

Duplicates `og-stats` (defined) and a question/help glyph (verify name in
section 1). Strong unification candidate — 22 SVG copies could collapse to
two `<span class="og">`s.

#### 6.2b `games/journeys.html` — additional bespoke SVGs

- Lines 95–96: `<button class="toggle-btn">` "Movie" / "Actor" toggle each
  embed a 14×14 inline SVG (clapperboard for Movie, person bust for Actor).
- Lines 203, 214: `<svg class="setup-pick-frame" viewBox="0 0 100 100">`
  with `<polygon points="25,1 75,1 99,50 75,99 25,99 1,50">` — a
  hexagonal badge frame around start/goal actor photos in the
  journey-setup overlay.
- Lines 265, 276: `<svg class="holding-photo-frame">` with the same
  hexagonal polygon — frames around "holding for opponent" actor photos
  in the pass-and-play screen.
- `games/journeys.js:1620`: `<svg class="honeycomb-svg">` is a dynamic
  programmatic honeycomb-grid builder (`renderHoneycomb`). Geometry, not
  an icon — noted for completeness.

#### 6.2c `games/constellation.html`

- Line 70: `<span class="badge-icon">✦</span>` — uses the Unicode
  black-four-pointed-star character. Borderline emoji-vs-typography use
  (✦ is U+2726, not in the Emoji block), but it functions as a one-off
  icon bypassing both `.og-*` and the Festival-glyph system.
- Line 123: `<svg class="constellation-lines" viewBox="0 0 600 100">`
  with two `<path class="const-line">` strokes — a decorative connector
  line under the row of 5 actor-photo "stars" in the puzzle UI.
  CSS-styled in `constellation.css:425`.

#### 6.2d `games/triple-collision.html`

Line 100: `<svg viewBox="0 0 300 260" class="venn-svg">` containing three
labelled `<circle class="venn-circle circle-{a,b,c}">` elements — the
live Venn-diagram scoreboard. Counts as a data visualisation, not an
icon, but noted because it's a unique inline SVG not covered elsewhere.

#### 6.2e `games/series.html`

Lines 158, 164: View-toggle `<button class="view-btn">` Grid (4-rect 2×2)
and List (3-rect stack) icons, 18×18, inline SVG. Standard "grid/list
view" pictogram pair. Possible `og-*` duplication — strong unification
candidate.

#### 6.2f Endgame verdict / result-icon SVGs in game JS

Several `*.js` game files inject inline SVG into result-screen DOM nodes
(`resultIcon`, `iconEl`, `verdictEl`). All re-implement the same star
path or clapperboard path:

| File | Lines | Icon |
| --- | --- | --- |
| `games/connections.js` | 521 | Star (perfect-game state) |
| `games/constellation.js` | 536, 541 | Star (both win and loss icons) |
| `games/mastermind.js` | 564–565, 570–571, 573–574 | Star (top tier), clapperboard (mid), TV-with-stand (low) |
| `games/screenshot.js` | 491–492, 500–501 | Star (high score), clapperboard (low score) |
| `games/tenth-star.js` | 501 | Star (used for both won and lost states — likely a bug; both branches render the same star) |

All star paths are byte-identical to the arcade.html five-point star
path (and to `og-star`). The TV-with-stand at `mastermind.js:573–574`
has no obvious `og-*` equivalent.

### 6.3 Pages and components with bespoke icons

#### 6.3a `pages/home.html`

- Lines 137, 144, 151: `.hci-step-icon` — three large
  (`viewBox 0 0 120 120`) decorative scene illustrations for the
  "How Cinema Intelligence works" how-it-works strip. Each is a
  multi-element composition with hard-coded hex fills (`#a855f7`,
  `#00d9ff`, `#ffd700`, `#ff6b35`) and represents (a) lens-on-target
  search, (b) Venn grid with arrow, (c) ranking bracket with podium
  chips. Stylistically distinct from pictograms — these are
  illustrations, not glyphs. They have no parallel in `.og-*`.
- Lines 634, 642, 650: `<svg class="arc-pill-glyph">` — three small
  pill-glyphs in the Arcade promo strip: star (filled cyan), two-circles
  (stroked orange), diamond (filled purple). Re-implement the same paths
  used in arcade.html for the corresponding game cards. Hard-coded
  `fill="#00d9ff"` / `stroke="#ff6b35"` / `fill="#a855f7"` bypass theme
  tinting.
- Line 94: header back-button chevron SVG (one-off).
- Line 1049: `<svg class="venn-illustration" viewBox="0 0 320 200">` —
  large decorative two-circle Venn graphic in a marketing section.
  One-off.

#### 6.3b `pages/discover.html`

Lines 176–186: 11 filter-tab inline SVGs, each ~11×11, for `oft-tab`
buttons. Visual concepts (in order):
people-bust (`tab=people`), grid-of-cells (genres), calendar-with-tabs
(era), star-outline (ratings), star-cluster (awards),
lightbulb-with-curl (themes), pin-with-circle (setting),
book-with-bookmark (source), globe-with-grid (region), film-camera
(production), play-triangle (stream/watch).

Several duplicate concepts already in `.og-*` (star, lightbulb if defined,
globe). Strong unification candidate.

Line 340: `<svg class="orbit-ring-svg" viewBox="0 0 220 130">` —
decorative orbital-ring illustration in the page hero. One-off; ambient
illustration rather than an icon.

#### 6.3c `pages/profile.html`

The single largest concentration of bespoke inline SVGs on the pages
side. Lines 55, 62, 77, 90, 121, 127, 137, 149, 154, 204, 220, 256, 266,
305, 319, 332, 360: every collapsible section uses
`<svg class="section-icon">` (18×18, stroke=currentColor) for the section
header and `<svg class="section-collapse-chevron">` (16×16) for the
expand/collapse caret. Each section's `section-icon` is a unique inline
SVG. About 11 distinct section icons — every one is an obvious `og-*`
unification candidate.

#### 6.3d `pages/people-profile.html`

Lines 33, 58, 63, 69, 89, 116, 125, 134, 149, 158, 169, 180, 189, 200,
209, 219, 229, 282: 18 inline SVGs. Visual concepts include
person-bust, bookmark, share, location-pin, eye, calendar, image,
chart-bars, star, bolt/lightning, building, brain, target, users,
checkmark. Many (eye, star, bolt, calendar, image, users, brain) already
have `.og-*` equivalents — duplication, not gap.

Stroke colours hard-coded as `stroke="var(--accent-cyan)"` /
`var(--accent-gold)` inline on each SVG (instead of relying on `.og-*`
CSS colour rules).

#### 6.3e Other pages

`actor-timeline.html`, `anchor-point.html`, `both.html`,
`coming-soon.html`, `orbit-map.html`, `randomizer.html`,
`randomizer-hub.html`, `compare.html`, `results.html`,
`results-classic.html`, `timeline.html`, `tv.html`, `tv-randomizer.html`,
`venn.html`, `people-library.html`, `rankings.html` — each contains
between 1 and 10 inline SVGs. Typical content: back-arrow chevrons,
section-title decorative icons, card-meta affordances (eye, star,
calendar, etc.). Spot-checked; the same patterns repeat — copy-pasted
SVG snippets that duplicate existing `og-*` glyphs.

Page JS files (`actor-timeline.js`, `awards-browse.js`,
`people-library.js`, `discover.js`, `people-profile.js`, `results.js`,
`orbit-map.js`, `profile.js`, `tv.js`, `timeline.js`, `venn.js`,
`both.js`, `compare.js`) inject between 1 and 23 inline SVGs each via
template literals — heaviest in `pages/discover.js` (23) which is the
source of the `og-warning` fallback at line 5386 already noted in the
existing report.

#### 6.3f `components/moviecube.js`

Lines 210–216 (`renderCubeOverlay` header builder):

- Face-1 "Poster" nav button: 14×14 clapperboard SVG.
- Face-3 "Cast" nav button: 14×14 person-bust SVG with two faded
  side-circles (matches the "Discovery Tools / Observatory" icon).
- Face-7 "Awards" nav button: 14×14 five-point star SVG.

(Faces 2, 4, 5 already use `.og-*` — `og-notepad`, `og-stats`,
`og-brain`. Face 6 uses the bare `✦` character.)

Lines 819–833 (`createLocationSVG`, `createTimeSVG`, `createThemeSVG`,
`createBasedOnSVG` — factory functions): four 12×12 stroked SVGs for
Discovery Dimensions metadata pills:

- Location: map pin (`M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z` + inner circle).
- Time: clock face (`circle r=10` + hands polyline).
- Theme: filled star (lucide-style polygon).
- Based on: book/booklet (`M4 19.5A2.5 2.5 0 0 1 6.5 17H20` …).

Lines 1705, 1709, 1713 (`renderCubeTriviaIntro` stat-pills):

- Accuracy: bullseye (3 concentric circles).
- Streak: lightning bolt (`M13 2L3 14h9l-1 8 10-12h-9l1-8z`).
- Movies-quizzed: simple checkmark (`M20 6L9 17l-5-5`).

All seven of these duplicate concepts that exist (or should exist) in
`.og-*`: `og-pin`, `og-clock`, `og-star`, `og-book`, `og-target`,
`og-bolt`, `og-check`.

#### 6.3g `components/people-cube.js`

Line 618: in the `pcube-photo-placeholder` fallback when a person has no
`profile_path`, an inline SVG of a person-bust silhouette is injected
(`M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2…`).
Duplicates `og-person`.

#### 6.3h `components/taste-overlay.css`

Three real data-URI icons (not noise textures):

- Line 98 — `.taste-btn-love.taste-active::after` checkmark badge
  appended inside the "Love" button when active. SVG stroke colour
  `stroke='%2300d9ff'` is hard-coded into the URI, so the cyan can't be
  re-tinted via CSS. Same defect as the festival data-URIs (Cleanup #4
  in the existing report).
- Lines 131 and 154 — `.movie-card.taste-loved .movie-poster-wrap::after`
  and `.at-card.movie.taste-loved::after` heart badge: the cyan heart in
  the top-right of loved-movie posters and timeline cards. Same fill
  hex-bake issue: `fill='%2300d9ff'` is in the URI, so any future
  themeable variant would require a full duplicate definition.

#### 6.3i `components/award-badges.js`

Line 184: `buildBadge()` programmatically constructs the festival-badge
SVG composite (`<circle>` halo + `<g>` glyph). This is the renderer for
the festival-glyph system already catalogued in section 2 — listed here
only for cross-reference. Not a new finding.

### 6.4 Emoji-in-innerHTML violations (Rule 11)

Listed in order of severity. Clipboard / share-text strings
(`navigator.clipboard.writeText`, `text = …\n…\n…`) are exempt and not
counted; only emojis that are rendered to the DOM via `textContent` or
`innerHTML` are listed.

| File | Line | Code | Context |
| --- | --- | --- | --- |
| `games/mastermind.js` | 567 | `verdictEl.textContent = "Film Scholar! 🎓"` | Result-screen verdict for mid-tier score. The 100+ and 40+ tiers use inline SVG; this one falls back to a graduation-cap emoji. Inconsistent with siblings. |
| `games/mastermind.js` | 568 | `iconEl.textContent = "🎓"` | The big result-icon for the same Film Scholar tier. |
| `games/screenshot.js` | 498 | `iconEl.textContent = "👍"` | Mid-tier "Good Recognition" verdict icon. The matching verdict text at line 497 uses `<span class="og og-thumbsup"></span>` correctly, so this icon-block emoji is a leftover. |
| `games/series.js` | 173–177 | `return { icon: '⚡' \| '☕' \| '🛋️' \| '🚀' \| '🌌', … }` | `getCommitmentTier()` returns a tier object; the emoji is then interpolated into `innerHTML` at line 253 (`<span class="commitment-icon">${tier.icon}</span>`). Five distinct emoji violations triggered through one builder. |
| `games/constellation.html` | 70 | `<span class="badge-icon">✦</span>` | Static markup, four-pointed star symbol. Borderline — ✦ (U+2726) is not in the Emoji block, but it functions as a pictogram bypassing `.og-*`. The same character is also used at `components/moviecube.js:215` for the Nebula nav button label. |

Sparkle-style ✦ also appears as styling in several share/voting contexts
and inside share-text strings — those are not DOM-rendered icons and are
excluded.

Note: every other emoji in the games directory (15+ occurrences) is in a
`shareText` / `navigator.clipboard` / template literal explicitly
assembled for social-media share output. Those are exempt by Rule 11.

### 6.5 Cross-system observations

**Re-implementations of existing `.og-*` glyphs (unification candidates)**

| Concept | Existing `og-*` | Bespoke duplicates found |
| --- | --- | --- |
| Five-point star | `og-star` | At least 18 inline SVG copies of the path `M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8…`: `arcade.html` lines 49, 70, 85, 239, 254, 257-265; `connections.js:521`; `constellation.js:536, 541`; `mastermind.js:564, 565`; `screenshot.js:491, 492`; `tenth-star.js:501`; `moviecube.js:216, 829`; `home.html:634`. |
| Clapperboard | `og-clapper` (verify name) | `journeys.html:95`; `mastermind.js:570, 571`; `screenshot.js:500, 501`; `moviecube.js:210`. |
| Person bust | `og-person` / `og-person-bare` | `arcade.html:46, 345, 359`; `journeys.html:96`; `moviecube.js:212`; `people-cube.js:618`; `people-profile.html:158, 219`. |
| Bar-chart "stats" | `og-stats` | 9 copies across `*.html` game-page headers (see 6.2a). |
| Lightbulb "help" | `og-question` (verify name) | 10 copies across `*.html` game-page headers (see 6.2a). |
| Two overlapping circles ("collision") | none yet | `arcade.html:104`; `home.html:642`. Could become `og-collision`. |
| Grid 2×2 | possibly `og-grid` | `arcade.html:161`; `series.html:158`. |
| Bullseye / target | `og-target` (if exists) | `moviecube.js:1705`; `people-profile.html:189`. |
| Map pin | `og-pin` (listed as missing in section 5 of existing report) | `moviecube.js:820`; multiple page-side calendars. |
| Clock | `og-clock` (verify) | `moviecube.js:824`. |
| Camera / film | possibly `og-camera` | `arcade.html:180`; `home.html` venn-illustration. |
| Lightning bolt / streak | possibly `og-bolt` | `moviecube.js:1709`. |
| Checkmark | `og-check` (noted missing — Cleanup #2) | `moviecube.js:1713`; `taste-overlay.css:98`. |
| Hexagonal badge frame | none | `journeys.html:203, 214, 265, 276`. Could become `og-hex-frame`. |

**Likely candidates to absorb into `.og-*`** (concepts genuinely absent
from the existing set):

- `og-tv-stand` for `mastermind.js:573–574` ("Keep Watching" verdict).
- `og-hex-frame` decorative polygon for journeys' actor-frame motif.
- `og-signal-arc` / `og-signal-waves` for the Signal game centre glyph.
- `og-camera-still` (camera-with-dot-lens) for Screenshot Speed.
- `og-rhombus` / `og-diamond` for the Mastermind game centre glyph.
- `og-three-circles` Triple-Collision affordance.

**Intentional aesthetic systems (do NOT unify)**

- The 10-sprite retro pixel library in `arcade.js` is a deliberate visual
  theme — atmospheric background drift, restricted to one layer on one
  page, never mixed with the line-icon vocabulary. The pixelated
  `<rect>`-grid aesthetic is the whole point and would be destroyed if
  folded into the smooth-stroked `.og-*` style.
- The `.hci-step-icon` illustrations in `home.html` (lines 137, 144, 151)
  are scene-illustrations at 120×120, not pictograms — different
  category.
- The `triple-collision.html` `.venn-svg` and `journeys.js:1620`
  `honeycomb-svg` are data visualisations, not icons.

**Style coherence**

- Arcade's retro pixel layer reads as a deliberate, well-contained
  decision — visually intentional, not drift.
- The `.orbit-icon` two-ring component is the visual signature of the
  arcade landing page and feels intentional. Its centre-glyph SVGs,
  however, are 11 ad-hoc one-offs that should plausibly become
  `og-game-{constellation|collision|triple|journeys|connections|
  screenshot|sequelshot|signal|mastermind|alternate}` glyphs.
- The biggest drift is on `pages/profile.html` and
  `pages/people-profile.html`: these are interior pages that should be
  using `.og-*` everywhere but instead contain 17 + 18 = 35 inline SVGs,
  many duplicating existing glyphs. This is the highest-leverage
  cleanup target on the pages side.

**Volume summary**

- Distinct bespoke (non-`.og-*`) icons identified across the codebase: **~95**, comprising:
  - 10 retro pixel sprites (arcade.js).
  - 8 inline header/affordance SVGs in arcade.html.
  - 11 `.orbit-icon` centre glyphs (one per game card).
  - 1 composite `.tenth-star-glyph` decoration.
  - 22 shared `.icon-symbol` header SVGs (11 games × 2 = bar-chart + lightbulb).
  - 11 endgame result-icon SVGs across 5 game JS files.
  - 6 unique journeys-game inline SVGs (toggles, hex frames, honeycomb).
  - 2 series.html view-toggle SVGs.
  - 1 constellation.html `.constellation-lines` decorator + 1 ✦ badge.
  - 1 triple-collision Venn scoreboard.
  - 3 home.html `.hci-step-icon` scene illustrations + 3 `.arc-pill-glyph` minis + 1 venn-illustration.
  - 11 discover.html filter-tab pictograms.
  - ~11 distinct profile.html section-icons.
  - ~14 unique people-profile.html section/affordance icons.
  - 7 component-cube bespoke icons (moviecube nav + dimensions + trivia stats).
  - 1 people-cube placeholder person SVG.
  - 3 taste-overlay data-URI icons (check + 2 hearts).
- Emoji-in-innerHTML rule violations: **8 distinct occurrences** (mastermind ×2, screenshot ×1, series ×5 via tier builder).
- Files containing non-`.og-*` icons: **40+**.
