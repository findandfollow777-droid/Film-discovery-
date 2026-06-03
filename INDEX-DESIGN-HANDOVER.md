# Index Page — Design Handover

**Audience:** Claude Design (next instance redesigning `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/index.html`).
**Date:** 2026-05-23
**Source pages read:** `index.html`, `styles.css` (landing rules), `pages/home.html`, all 10 destination pages, `components/orbit-glyphs.css`, `ORBIT-GLYPH-AUDIT-REPORT.md` Sections 1–6, `CLAUDE.md`.

---

## 1. Executive context

`index.html` is ORBIT's primary feature-menu landing — an 11-tile grid that fans out to every major feature of the platform (Quick Search, Explore/Discover, Randomizers, Rankings, Profile, Towatchiverse, Observatory, Arcade, Awards Archive, Orbit Map, Next Frontier). It is the navigational hub users land on after the marketing-style `pages/home.html` (see §2 for the home/index relationship).

It is being redesigned now because a glyph-system audit (`ORBIT-GLYPH-AUDIT-REPORT.md`, 1147 lines, Sections 1–6) surfaced this page as a clear case of system drift: ORBIT has a deliberate `.og-*` glyph library of 86 icons in `components/orbit-glyphs.css`, yet Index uses exactly ONE `.og-*` class (`og-planet` at line 124) and 10 bespoke inline SVGs. Section 6 of the audit frames this as part of the same drift that produced 35 inline SVGs across profile pages. The redesign is an opportunity to harmonize the landing page with the rest of the system — or to formally exempt it.

**Constraints from `CLAUDE.md`:**
- **Rule 11** — Glyphs over emojis; use `<span class="og og-{name}"></span>` from `orbit-glyphs.css`; flag missing glyphs for creation rather than falling back.
- **Rule 12** — No hardcoded colors / box-shadows / radii; everything via `variables.css` tokens (use the rgb-variable + opacity form for rgba).
- **Rule 16** — Feature color-coding: cyan = movies/primary, gold = wins/premium, purple = awards/prestige, amber = TV, orange = Collision, green = success, red = errors.
- **Rule 17** — Any close X uses the shared `class="orbit-close"` + `data-orbit-popup` pattern (not relevant unless you add modals).
- Rule 7 — Don't refactor unrelated code while you're here. Rule 15 — Verify at 650px and 900px breakpoints.

**In scope:** the visual redesign of the 11 tiles, their glyphs, the landing-grid layout, and the surrounding header/back-button chrome.
**Out of scope:** functionality of any destination page; routing; the Quick Search modal contents (redesigned in prior sessions — Option A hierarchy, 4-col grid, colored names, cosmic glow borders); backend/data.

---

## 2. Current Index page anatomy

### 2.1 home.html vs index.html

`pages/home.html` (1245 lines) and `index.html` (261 lines, project root) are **two different pages**. `home.html` is a marketing/hero page (`<title>ORBIT — Film Discovery</title>`, hero mosaic with "SEARCH / EXPLORE / OBSESS" trio, search bar, taste/anchor sections). `index.html` is the feature menu (`<title>ORBIT - Your Film & TV Discovery Hub</title>`, tagline "Your Film & TV Discovery Hub", 11 destination tiles). The relationship:

- `index.html:29` — ORBIT logo links to `pages/home.html`.
- `index.html:38` — "← BACK TO HOME" button also links to `pages/home.html`.
- Most destination pages link "Back to ORBIT" to `../index.html` (e.g. `pages/people-library.html:23`, `games/arcade.html:33`, `pages/rankings.html:24`, `pages/awards-browse.html:31`).
- `home.html` nav and `next-frontier.html` nav both contain a `MENU` link pointing back to `index.html`.

So conceptually: home = front door / marketing, index = menu / app shell. Two BACK buttons on Index both go to home.html — note this in case the redesign collapses or relabels them.

### 2.2 Layout

`.landing-grid` (`styles.css:186–195`): CSS Grid, **3 columns** at desktop, gap 1.5rem, max-width 1000px, padding 2rem, centered.
Responsive (`styles.css:510–528`):
- `max-width: 900px` → 2 columns
- `max-width: 600px` → 1 column (also shrinks logo text and tightens header padding)

With 11 tiles and 3 columns, the bottom row holds 2 tiles → the layout is asymmetric on desktop. Worth a design call: pad to 12, drop to a 4-col layout, or accept the orphan.

### 2.3 The `.orbit-icon-container` pattern

Defined `styles.css:235–288`. Used on every tile (`index.html:46–52, 60–67, …`). Structure per tile:

```html
<div class="orbit-icon-container">
  <div class="orbit-ring"></div>          <!-- outer ring, cyan -->
  <div class="orbit-ring orbit-ring-2"></div>  <!-- inner ring, gold, counter-rotating -->
  <svg class="orbit-glyph" …>…</svg>      <!-- or <span class="og og-planet"> on tile 6 -->
</div>
```

- Container: 70×70px, flex-centered, `margin: 0 auto 1rem`.
- Outer ring: 100% size, 2px cyan border, cyan glow, `animation: orbit-spin 20s linear infinite`.
- Inner ring: 75% size, 2px gold border, gold glow, `orbit-spin 15s linear infinite reverse`.
- Glyph: `position:relative; z-index:2; color: var(--accent-gold); filter: drop-shadow(0 0 6px rgba(255,215,0,0.4))`.

Hover state intensifies the cyan ring color/shadow and bumps the glyph's drop-shadow. The two-ring component is **the same visual language** used on `games/arcade.html` game cards (audit §6.1b — `.orbit-icon` / `.orbit-ring-outer` / `.orbit-ring-inner` / `.orbit-glyph`), on the `.orbit-logo-mark` in headers across the app, and inside `pages/randomizer-hub.html` (renamed there to `.hub-icon` / `.icon-ring-outer` / `.icon-ring-inner` / `.icon-glyph`). It is ORBIT's de-facto icon component — the redesign should preserve or evolve it deliberately, not abandon it.

### 2.4 `.landing-tile` base

`styles.css:197–229`. Glass-card aesthetic:
- `background: rgba(15, 23, 41, 0.5)` (note: hardcoded — Rule 12 violation, currently in source)
- `backdrop-filter: blur(20px) saturate(180%)`
- `border: 1px solid rgba(0, 217, 255, 0.15)` (cyan @ 15% — also hardcoded)
- `border-radius: 16px`, `padding: 2rem`, `text-align: center`
- Hover: cyan border 50%, cyan box-shadow, `transform: translateY(-4px)`.

The `.landing-tile.expanded` variant exists (`styles.css:218–224`) but no inline use was found in `index.html`. It may be a holdover from a prior expandable-tile experiment.

### 2.5 Copy hierarchy

Each tile contains:
- `.orbit-icon-container` (ring + glyph)
- `<h2>` — Orbitron, cyan (`var(--accent-cyan)`), 1rem, 0.05em letter-spacing, uppercase by content not transform (CSS at `styles.css:290–296`)
- `<p>` — Barlow, muted-silver, 0.9rem (`styles.css:298–303`)

### 2.6 Quick Search tile special case

Tile 1 is **not** an `<a>` — it's a `<div role="button" tabindex="0" id="qsTile">` (`index.html:45`). Clicking it opens the modal `#qsBackdrop` (defined inline at `index.html:217–251`, behavior in `quick-search-modal.js`). It also displays a `<kbd>⌘K</kbd>` shortcut hint via `.qs-tile-hint` (styled in `quick-search-modal.css:706+`, not in `styles.css`). The other 10 tiles are anchor elements (`a.landing-tile`).

### 2.7 Backdrop / atmosphere

`index.html:17–25` declares four layered cinematic backgrounds (`.landing-backdrop`, `.backdrop-overlay`, `.film-grain`, `.vignette`) plus three `.lens-flare` elements that drift (`styles.css:26–77`). The redesign should preserve this layered approach for consistency with home/awards/arcade pages, which all use a variant of the same stack.

---

## 3. Per-tile breakdown

For each tile, the current glyph is described from the verified inventory; destination summaries are written from reading each destination's source.

### 3.1 — QUICK SEARCH

- **Current glyph:** Inline SVG, viewBox `0 0 24 24`, stroke `currentColor`. Magnifying glass: `circle r=8` at (11,11) + diagonal handle path `M21 21l-4.35-4.35`. (`index.html:49–51`)
- **Destination & functionality:** Opens an in-page modal (`#qsBackdrop`, declared at `index.html:217–251`). The modal is a unified search for movies, actors, and directors/crew, with type pills, a persistent cast stage, joint-timeline / Venn diagram buttons, and an "Browse Awards →" footer link. It supports keyboard nav (↑↓ navigate, ⏎ select, esc close) and the ⌘K shortcut. Behavior in `quick-search-modal.js`; styling in `quick-search-modal.css`. The modal redesign is **already done** (prior sessions — Option A hierarchy, 4-col preset grid, colored names, cosmic glow borders).
- **Design considerations:**
  - This tile is the only one with a `<kbd>⌘K</kbd>` shortcut hint (`.qs-tile-hint`, `index.html:55`). Consider whether the visual should signal "this is the fastest path in".
  - Magnifying-glass SVG isn't currently in `.og-*` — closest existing glyph would be a new one. The audit (§3, line 487+) lists 23 unused glyphs in CSS; none is a search icon. Candidate for `.og-search` addition.
  - Accessibility: `role="button" tabindex="0"` (`index.html:45`) — keyboard handler must remain wired through `quick-search-modal.js`.

### 3.2 — EXPLORE

- **Current glyph:** Inline SVG, filled `circle r=5` at center + rotated `ellipse rx=11 ry=4` (Saturn / planet with orbit ring), `transform: rotate(-20 12 12)`. (`index.html:63–66`)
- **Destination & functionality:** `pages/discover.html` — internally titled **"Build Your Orbit"** (519 lines + a much larger JS file — referenced as ~7000 lines of `discover.js` from past sessions). The page combines curated **Quick Searches** (preset filter combos, modal grid) with a manual **filter builder** for advanced film discovery: genres, mood, era, runtime, language, etc. It returns movie results in a grid for further drill-in via MovieCube.
- **Design considerations:**
  - The tile label is "EXPLORE" but the destination is titled "Build Your Orbit". Mild copy mismatch — the tile description "Advanced film & TV discovery" splits the difference. Worth flagging to Daniel.
  - The Saturn glyph here visually overlaps with `.og-planet` (tile 6) — both are planet-with-ring. The audit §3 catalogues `og-planet` as stable/singular semantic. Consider differentiating: telescope / compass / sextant / orbit-map could all reach for "exploration".
  - Color: this is the closest tile to "primary CTA". Cyan (`--accent-cyan`) is the natural pick under Rule 16.

### 3.3 — WHAT TO WATCH

- **Current glyph:** Inline SVG, rounded `rect 18×18 rx=3` + 5 dots in dice-5 pattern at (8,8) (16,8) (12,12) (8,16) (16,16). Dice face (5). (`index.html:77–82`)
- **Destination & functionality:** `pages/randomizer-hub.html` — a small hub (89 lines) with a hero "Movie Randomizer" tile and a secondary TV Shows tile. The Movie Randomizer (`randomizer.html`) finds films by mood, hidden gems, favourites, or pure chaos; the TV variant (`tv-randomizer.html`) has time-commitment filters. Both feed into result pages with MovieCube/PeopleCube drill-in.
- **Design considerations:**
  - `.og-dice` already exists (`orbit-glyphs.css:442`). Direct candidate to replace the inline SVG — same depiction, but in the system.
  - Tile copy mentions "re-watch randomizers" but the hub page exposes Movies + TV only; "rewatch" isn't a discrete entry. Either trim copy or verify with Daniel.
  - Cyan = movies, amber = TV; this tile bridges both. Cyan is probably right since the hero card is movies.

### 3.4 — YOUR RANKINGS

- **Current glyph:** Inline SVG, filled. Trophy: cup body + side handles + base/plate. (`index.html:93–99`)
- **Destination & functionality:** `pages/rankings.html` (29 lines) — **currently a placeholder page** with the message "Rankings & reviews coming soon..." and a back-link to ORBIT. The inline-styled page renders a 5-point-star icon, an Orbitron h1, and a single back button. Not yet built out; the tile copy "Top 5s, reviews & word clouds" describes the planned feature.
- **Design considerations:**
  - Audit §3 lists `.og-trophy` as **overloaded** (5 meanings — generic award marker, prestige layer, win verdict, rivalries header, empty awards state). Adding a 6th use (rankings = personal top-5s) further compounds it. Consider an alternative: `.og-stats`, a podium glyph (doesn't exist — would need creation), or list/ranking iconography.
  - Since the destination is a stub, this is the lowest-stakes tile to experiment on.
  - Tile-icon mismatch: the destination page itself displays a **star** at line 21, not a trophy. The Index trophy and destination star don't match.

### 3.5 — PROFILE

- **Current glyph:** Inline SVG, filled. Person bust: `circle r=4` at (12,8) head + shoulders path. (`index.html:110–113`)
- **Destination & functionality:** `pages/profile.html` (412 lines) — the user's personal profile: "Your Lists" (loved/skipped/watch-later/watchlist counts), profile stats, history, preferences. Includes the standard ORBIT close-button system and links into MovieCube via the lists. The page header itself uses the orbit-ring logo pattern, with a similar person SVG used elsewhere (e.g. `games/arcade.html:46` in the header profile link).
- **Design considerations:**
  - `.og-person` and `.og-person-bare` both exist in `orbit-glyphs.css:371–386`. The inline SVG on Index is a direct candidate to swap to `.og-person`.
  - Audit §6.3 explicitly cites profile pages as a hotspot of 35 inline SVGs — replacing this tile's bust with `.og-person` is a cheap, on-system win.
  - Color: gold (`--accent-gold`) reads as "your premium personal space"; cyan reads more utilitarian. Either works; gold is the existing landing-tile glyph color anyway (`styles.css:273`).

### 3.6 — MY TOWATCHIVERSE

- **Current glyph:** `<span class="orbit-glyph og og-planet" style="font-size:28px;color:var(--accent-gold)">` — **the ONLY `.og-*` on the Index page.** (`index.html:124`)
- **Destination & functionality:** `pages/towatchiverse.html` (123 lines) — the user's personal film universe with four tabs (Watchlist, Liked, Watched, Shortlist), each tracked by counts. Includes a search/sort toolbar, a movie grid, and an empty-state with the same `og-planet` glyph. The page imports the `.og-*` system properly (`pages/towatchiverse.html:11`) and uses `og-couch`, `og-thumbsup`, `og-eye`, `og-sparkle`, `og-planet`, `og-shuffle` in its UI.
- **Design considerations:**
  - Audit (`ORBIT-GLYPH-AUDIT-REPORT.md:388`) notes: the inline `color: var(--accent-gold)` on this `og-planet` does **NOT** retint the actual SVG — the stroke colors are baked into the data-URI inside `orbit-glyphs.css`. So the gold styling is a no-op visually. If color theming becomes part of the redesign, this needs to be solved either at the SVG source (multiple per-color glyph variants) or via CSS `filter:` declarations applied to `.og`. The home.html color-tint helper system is documented as non-functional for the same reason.
  - This tile is the only one currently in-system; preserve the model and extend it to the other 10 if going that direction.

### 3.7 — THE OBSERVATORY

- **Current glyph:** Inline SVG composite (most elaborate on the page): angled telescope tube + lens hood + eyepiece circle + 3 tripod legs + small star top-left at (4,3). (`index.html:135–148`)
- **Destination & functionality:** `pages/people-library.html` (268 lines) — the people-discovery surface. Internal title "THE OBSERVATORY", subtitle "View the stars". Has a search bar, a department filter (Actors / Directors / Writers / Producers), an active-era filter, and "My Orbit" mode that renders a personal discovery map (canvas + genre pie + gap analysis + stats). Drill-in to people via the PeopleCube component.
- **Design considerations:**
  - The telescope composite is a one-off — none of the existing `.og-*` icons match. Closest candidate `.og-satellite` exists (`orbit-glyphs.css:239`, currently **unused** per audit §3 line 501) but its semantic is communications/space-station, not optical-telescope. Adding `.og-telescope` is a clean way forward.
  - Audit notes telescope appears nowhere else in ORBIT — this is a unique glyph and could be a strong tile identity. Worth keeping the inline approach OR formalizing as a new `.og-*`.
  - The "view the stars" tagline pulls toward gold (stars/wins). Audit §6.2 notes that game pages overload the 5-point star for many meanings; here the metaphor is people-as-stars (talent), which is its own semantic.

### 3.8 — ARCADE

- **Current glyph:** Inline SVG, filled. Rounded `rect 20×12 rx=4` controller body + `circle r=2` d-pad with deep-void stroke (acts like a hole through the body) + 4 small filled circles at (17,10) (17,14) (15,12) (19,12) as buttons. (`index.html:159–164`)
- **Destination & functionality:** `games/arcade.html` (419 lines) — the daily-games hub. 11 game cards across Daily Challenges (9), Weekly (1), Challenge Mode (2), plus a Discovery Tools section that links to The Observatory. Heavy use of the `.orbit-icon` two-ring component with bespoke per-card centre SVGs (star, overlapping circles, dice grid, camera, etc.) and a retro pixel-sprite atmospheric layer (10 named sprites — Galaga, Invader, Arwing, R-Type, Vic Viper, etc. — see audit §6.1d).
- **Design considerations:**
  - Note: the controller SVG uses a hardcoded `var(--deep-void, #0a0e1a)` stroke on the d-pad circle (`index.html:161`). This is the only tile whose glyph reaches outside `currentColor`, breaking the consistent retint pattern.
  - No existing `.og-gamepad` / `.og-controller`. Candidate for creation.
  - Audit §6.1b documents that Arcade's `.orbit-icon` component is structurally identical to Index's `.orbit-icon-container`. The redesign should consider whether to unify the class name across both pages (Rule 7 cautions against scope creep — would need its own task).
  - Cinematic color: orange (`--collision-orange`) is reserved for Collision Course only; cyan or gold is safest for the Arcade tile generally.

### 3.9 — AWARDS ARCHIVE

- **Current glyph:** Inline SVG, filled. Five-point star path `M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z`. (`index.html:175–177`)
- **Destination & functionality:** `pages/awards-browse.html` (149 lines + JS) — the festival winner / nominee browser. Hub nav with Browse / Guide / Stats / Stories sections; festival tabs (Oscar, BAFTA, Cannes, etc.) populated by JS; category sidebar; decade bar and year pills; results grid. Drill-in via MovieCube and PeopleCube. Imports `components/orbit-glyphs.css` (`pages/awards-browse.html:10`) and uses festival glyphs from `data/festival-glyphs.js`.
- **Design considerations:**
  - **Audit §3 (line 428) cites this exact star path as the most-overloaded glyph in ORBIT.** It is hand-copied across home, arcade (4 times in `arcade.html` alone), constellation, next-frontier, etc., with at least 4 distinct semantic meanings: Academy Award marker, TMDB rating, bookmark indicator, generic accomplishment. Audit recommendation (line 435): reserve `og-star` for **rating + bookmark only**; route festival/academy semantics through `data/festival-glyphs.js` (Two-Ring Oscar mark) and accomplishment to `og-trophy`/`og-sparkle`.
  - For this tile specifically: a **festival-trio composite** (two-ring Oscar + BAFTA mask + Cannes palm) might be a stronger identity than another generic star. The festival glyphs are defined as 6 entries in `data/festival-glyphs.js`.
  - Color: **gold** (`--accent-gold`) is the obvious Rule 16 pick (wins/achievements/premium), or **purple** (`--prestige-purple`) for awards/prestige.

### 3.10 — ORBIT MAP

- **Current glyph:** Inline SVG, stroke. `circle r=10` + horizontal line + curved meridians forming a globe (longitude/latitude lines). (`index.html:188–191`)
- **Destination & functionality:** `pages/orbit-map.html` (75 lines + JS) — a Leaflet-based world map of films by shooting location. Includes a decade slider (filter by era), location search, clickable marker clusters, and a location panel that lists movies for the selected place with drill-in via MovieCube. The page's own header reuses a clock-style time SVG, not a globe.
- **Design considerations:**
  - `.og-globe` exists (`orbit-glyphs.css:305`) — direct candidate to replace this inline SVG with `<span class="og og-globe"></span>`. The audit (memory file `reference_orbit_landmark_truth_files.md`) notes the GG (Golden Globe) slug is `gg`, NOT `globe` — so there's no slug collision.
  - Color: cyan reads as "data / exploration"; gold reads as "premium location-based discovery". The current tile follows the default gold treatment.
  - Note this is the only destination using a third-party CSS dependency (Leaflet) — outside the redesign scope but worth knowing for any background-layer changes.

### 3.11 — THE NEXT FRONTIER

- **Current glyph:** Inline SVG, stroke. Path `M12 2L4 7v10l8 5 8-5V7l-8-5z` + `M12 22V12` + `M20 7l-8 5-8-5` (isometric cube / octahedron outline) + centered filled dot at (12,7). (`index.html:202–207`)
- **Destination & functionality:** `next-frontier.html` (project root, 218 lines) — upcoming-releases discovery surface. Tabbed UI: "THE BIG SCREEN" (theatrical) and "YOUR STREAMERS"; region picker (AU / US / UK / NZ / CA); per-card "Want to See" / "SAVED" affordances (the audit flags `.og-check` as a missing glyph used here — `next-frontier.js:367, 432`). Uses `.og-arrow-left`, `.og-film`, `.og-satellite`, `.og-star`. The page-internal title is "NEXT FRONTIER" with the tagline "The edge of what's next".
- **Design considerations:**
  - The cube glyph is unique to this tile. Candidate names if formalising: `.og-cube`, `.og-frontier`, `.og-rocket` (already exists, line 249).
  - `.og-rocket` (`orbit-glyphs.css:249`) and `.og-ufo` (line 254) both fit the "frontier" semantic. `.og-rocket` is the cleaner reach.
  - Color: this is the only tile where the destination is at the project root (not in `pages/`); also the only destination using its own dedicated `next-frontier.css` rather than the shared landing styles. Functionally it's a sibling of Index. Consider whether the visual treatment marks it as **forthcoming / experimental** versus the other 10.

---

## 4. System-level design observations

### 4.1 The icon-system mixing problem

10 inline SVGs + 1 `.og-*` is the most acute case of icon-system drift in the codebase (audit §3 lists 23 unused `.og-*` glyphs and `next-frontier.js` invocations of undefined `og-check`). Two coherent directions:

- **(A) Bring Index fully into the `.og-*` system.** Map each tile to an existing or new glyph. Existing direct matches: tile 3 → `.og-dice`, tile 5 → `.og-person`, tile 6 → `.og-planet` (already), tile 10 → `.og-globe`, tile 11 → `.og-rocket`. New glyphs likely needed: `.og-search`, `.og-telescope`, `.og-gamepad`, and either `.og-trophy-stack` or a festival-composite for Awards. The two ambiguous tiles are 2 (Explore — needs a glyph distinct from `.og-planet`) and 4 (Rankings — `.og-trophy` is already overloaded). This direction is consistent with Rule 11.
- **(B) Formally exempt landing-hero glyphs.** Document Index as a "hero glyph" exception where bespoke 28px-in-24×24-viewBox inline SVGs are permitted because the tile is the brand surface. Other pages still use `.og-*`. This is a smaller change but locks in the drift.

Recommend (A) with the audit's note about color baking: any new `.og-*` glyphs added for Index should use `currentColor` in their data-URI rather than baking `#00d9ff` / `#ffd700`, so per-tile color tinting via CSS `color:` works.

### 4.2 Color treatment opportunity

Index tiles are currently **monochrome** — every glyph renders gold via `.orbit-glyph { color: var(--accent-gold) }` (`styles.css:273`), every tile border is the same cyan, every hover is the same cyan glow. No per-feature color coding exists today.

Rule 16 gives a ready-made palette:
- Cyan (`--accent-cyan`): Quick Search, Explore, What To Watch (movies-primary)
- Gold (`--accent-gold`): Rankings, Profile, Towatchiverse (personal/premium)
- Purple (`--prestige-purple`): Awards Archive
- Amber (`--tv-accent`): TV side of randomizer (could route via a TV-flagged tile)
- Per-feature: Arcade could echo orange/green/cyan from individual games; Observatory could pick up `--accent-gold` (stars = talent); Orbit Map could pick up cyan or purple; Next Frontier could pick up `--prestige-purple` or a new "frontier" accent (requires Rule 16 discussion).

This would also help the asymmetric 3-column layout — color clusters distract from the orphan row.

### 4.3 Sizing

Current glyphs are all 28px rendered at `viewBox="0 0 24 24"` in a 70×70 ring container (audit §4 cites this as one of ORBIT's standard sizing tiers). Maintain this exactly unless the redesign deliberately tiers tiles (e.g. Quick Search as a feature row at 2× size).

### 4.4 Accessibility

- Tile 1 (Quick Search) is `<div role="button" tabindex="0">` — others are `<a>`. Keyboard tab order is fine, but screen readers will announce tile 1 as a button and tiles 2–11 as links. Consistent semantics would be nicer, but the modal-vs-navigation distinction is the underlying truth.
- No `aria-label` is set on any tile; the `<h2>` text inside each tile is what AT reads. Acceptable but worth confirming.
- Glyphs have no `aria-hidden="true"` and no `<title>`/`<desc>`. Inline SVGs are decorative-by-default; recommend adding `aria-hidden="true"` if the redesign touches them.
- `<kbd>⌘K</kbd>` hint on the Quick Search tile has no a11y mention — fine since the tile itself is keyboard-focusable.

### 4.5 Mobile / breakpoint behavior

Verified in `styles.css:510–528`:
- ≤900px → 2-column grid (11 tiles → 5 rows + 1 orphan)
- ≤600px → 1-column grid; logo text shrinks to 1.6rem; landing-header padding-top → 2rem

No explicit changes to tile padding or icon-container sizing at narrow widths. Glyph rings stay 70px which feels chunky on a 360px viewport. Worth verifying at 320px and 375px per Rule 15.

---

## 5. What's NOT in this handover

Out of scope. Don't go hunting:
- Functionality of any destination page (rankings is a placeholder; that's a separate roadmap item).
- Routing / navigation logic anywhere.
- **The Quick Search modal redesign** — already done in prior sessions (Option A hierarchy, 4-col preset grid, colored names, cosmic glow borders). The modal markup is at `index.html:217–251` and its styles in `quick-search-modal.css`. Treat the modal as locked.
- Backend / data layer (TMDB calls, localStorage keys, awards data).
- The `.og-*` icons used inside destination pages (those are their own audit follow-up).
- The `pages/home.html` redesign (separate page — see §2.1).
- Welcome popup (`welcome-popup.js` / `.css`) shown via `<script src="welcome-popup.js">` at `index.html:258`.
- `orbit-close.js` close-button system (Rule 17; only relevant if you add modals).

---

## 6. Reference appendix

**Source documents:**
- `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/CLAUDE.md` — ORBIT development rules (Rules 11, 12, 15, 16, 17 most relevant).
- `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/ORBIT-GLYPH-AUDIT-REPORT.md` — 1147-line glyph audit. Most relevant sections:
  - §1A — `.og-*` inventory (86 glyphs)
  - §1B — festival-glyph inventory (6 entries)
  - §2 `index.html (root)` (line 384) — confirms Index uses only `og-planet`
  - §3 — overload/orphan analysis (especially `og-star`, `og-trophy`, `og-film` overloads)
  - §4 — sizing tiers and color treatment patterns
  - §6.1b — `.orbit-icon` two-ring component (structurally the same as Index's `.orbit-icon-container`)
  - §6.3 — bespoke icon hotspots in profile pages (35 inline SVGs)

**Source code:**
- Index markup: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/index.html` — full 261 lines; tile markup at **lines 42–213**; Quick Search modal at lines 217–251.
- Landing styles: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/styles.css` — relevant rules at lines 26–303 (backgrounds, header, grid, tile, icon-container) and 510–528 (responsive). Total 528 lines, all currently scoped to the landing page.
- `.og-*` system: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/components/orbit-glyphs.css` — 502 lines, 86 glyph classes.
- Festival glyphs: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/data/festival-glyphs.js` — Two-Ring Oscar, BAFTA mask, Cannes palm, Berlin bear, Venice lion, Golden Globe (slug `gg`).
- Design tokens: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/variables.css` — all color/font/shadow CSS custom properties.
- Quick Search modal styles: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/quick-search-modal.css` — `.qs-tile-hint` at line 706+.
- Shared close-button: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/orbit-close.css` + `orbit-close.js`.

**Companion landing-style pages worth scanning for visual parity:**
- `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/pages/home.html` — the marketing page Index's logo/back-button link to.
- `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/games/arcade.html` — the closest cousin to Index in visual language (game-card grid with `.orbit-icon` two-ring component).
- `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/pages/randomizer-hub.html` — hero+secondary tile layout using `.hub-icon` (renamed `.orbit-icon-container`).
