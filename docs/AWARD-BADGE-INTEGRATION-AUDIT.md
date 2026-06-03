# Award Badge Integration Audit

> Generated as part of Phase 1.13a. Inventory of every site location currently
> rendering award imagery, ahead of the Phase 1.13b integration.
>
> Component built in this phase:
> - `components/award-badges.css` — `.orbit-award-badge` styles
> - `components/award-badges.js` — `window.renderAwardBadge(festival, status)` and `window.renderAwardBadges(root)`
> - `variables.css` — `--halo-*` (alias `--fest-*`) + `--silver` / `--silver-bright`

---

## Class-name collision (resolved this phase)

The unprefixed class `.award-badge` is already defined in **four** stylesheets:

| File | Line | Selector | Style |
|---|---|---|---|
| `pages/results.css` | 1028 | `.award-badge` | inline gold-tinted text pill |
| `pages/results-classic.css` | 974 | `.award-badge` | inline gold-tinted text pill |
| `games/game.css` | 881 | `.award-badge` | game-row marker |
| `components/moviecube.css` | 305 | `.cube-award-badges .award-badge` | cube row marker |

To avoid silently overwriting these, the new component uses **`.orbit-award-badge`** (matches the `orbit-utils.js` / `orbit-glyphs.css` precedent). All four legacy rules above are listed in the migration table below for retirement after their consumers move to the new component.

---

## Current state of award imagery on the site

### Locations that need migration to new badges

| File | Line(s) | Context | Old marker | Migration plan |
|---|---|---|---|---|
| `components/awards.js` | 18138-18144 | `AWARD_EMOJIS` map | `<span class="og og-trophy/og-palm/og-film/og-lion/og-bear/og-globe">` | Delete. Use `renderAwardBadge(detectFestivalId(festival), status)`. |
| `components/awards.js` | 18148-18155 | `AWARD_SVGS` (24×24 path snippets) | inline path strings | Delete. Replaced by `renderAwardBadge`. |
| `components/awards.js` | 18170-18187 | `formatAward()` + `getAwardBadgesHTML()` | builds `<span class="award-badge award-badge-won">…` strings | Re-implement on top of new component. Returns `<div class="orbit-award-badge" data-award-badge="..." data-status="winner|nominee">`. |
| `components/moviecube.js` | 807-940 (approx 134 lines) | `getAwardGlyphSVG(festival, size, isWinner)` | inline 100×100 SVG per festival, 6 festivals | Delete entirely. Replace 4 call sites (1029, 1051, 1070, 1099) with `renderAwardBadge(detectFestivalId(festival), isWin ? 'winner' : 'nominee')`. |
| `components/moviecube.css` | 305 | `.cube-award-badges .award-badge { … }` | legacy text-pill | Retire rule once moviecube.js uses new component. |
| `data/awards-data.js` | 7-15 | `AWARD_SVGS` (100×100 outline + glyph-ring) | global `window.AWARD_SVGS` | Delete. Replaced by `renderAwardBadge`. Note: also exported with same name from `components/awards.js`. |
| `data/awards-data.js` | 17-25 | `AWARD_SVGS_DETAIL` (high-detail variant) | inline | Delete. New component has size variants via `data-size` instead. |
| `pages/awards-browse.js` | 120, 655, 948, 1026 | Festival tabs · info panel · year listing · category sidebar | `AWARD_SVGS` / `AWARD_SVGS_DETAIL` lookups | Swap to `renderAwardBadge('oscar','winner')` etc. Use `data-size="32"` for tabs, `data-size="76"` for info-panel hero, `data-size="24"` for inline. |
| `pages/awards-browse.html` | (festival-tabs nav) | Tab icons | populated from JS map | Indirect — follows from awards-browse.js change. |
| `pages/results.css` | 1028 | `.award-badge` text pill | legacy | Retire rule once results.js uses new component (or remove entirely if results page no longer needs award markers). |
| `pages/results-classic.css` | 974 | `.award-badge` text pill | legacy | Retire rule once consumer migrates. |
| `games/game.css` | 881 | `.award-badge` text pill | legacy | Retire rule once consumer migrates. |
| `pages/compare.js` | 2098 | Compare-page award row uses `AWARD_SVGS` | inline lookup | Swap to `renderAwardBadge`. |
| `pages/people-profile.js` | 1279-1282 | Person award glyph map | `'Cannes': 'og-palm'`, `'Venice': 'og-lion'`, `'Berlin': 'og-bear'`, `'Golden Globe': 'og-globe'` | Replace map with `detectFestivalId()` + `renderAwardBadge`. Status comes from each award entry's `won` boolean. |
| `pages/discover.js` | 3281-3285 | Discover filter pills (festival labels) | `glyph: "og-palm"` etc. | **Open Q (see below):** filter pills are about *filter affordance*, not winner/nominee status. May not migrate; flag for review. |

### Locations that stay as decorative imagery (do NOT migrate)

| File | Line(s) | Context | Reason to keep |
|---|---|---|---|
| `pages/home.html` | 970, 980, 985, 990 | Home hub feature tiles (`og-globe gold`, `og-palm green`, `og-lion purple`, `og-bear amber`) | Decorative tile imagery — not award status. Different system (feature affordance). |
| `data/festival-guide-data.js` | 14, 100, 106, 112, 118, 124 | `legacyGlyph: 'og-palm'` etc. | Two-Ring Orbit hub system. Stays as-is, separate. |
| `components/orbit-glyphs.css` | 290-325 | Defines legacy `og-palm/og-lion/og-bear/og-globe/og-statuette/og-mask` icons | Other systems still consume these. Keep until all consumers migrate. |
| `pages/people-library.js` | 105 | Library hero icon `<span class="og og-globe">` | Decorative hero — **flag for review** in Phase 1.13b: may move to new badge or stay legacy. |

---

## Awards data layer

- **Data location:** `data/awards-data.js` (20,914 lines) — contains `AWARD_SVGS`, `AWARD_SVGS_DETAIL`, `FESTIVAL_INFO`, plus the year-keyed `winner: M(...)` / `nominees: [...]` schema for browse listings.
- **Render helpers location:** `components/awards.js` — defines `AWARDS_DATABASE`, `AWARD_EMOJIS`, a *second* `AWARD_SVGS` (24×24, conflicts with the data file's), `getMovieAwards()`, `formatAward()`, `getAwardBadgesHTML()`.
- **Per-entry shape:** `{ festival: "Golden Globe", category: "Best Director", year: 2026, won: false, person: "Guillermo del Toro", person_id: 10828 }`
- **Winner-vs-nominee field present?** ✓ YES — `won: true|false` on every entry. `components/moviecube.js:1069` already coerces `'true'/'True'/true` to `isWin`. Render code branches on `award.won`.
- **Per-category info?** ✓ YES — `category` string per entry. Plus `year`, `person`, `person_id`.
- **Schema gap:** Browse-listing code uses a different shape (`winner: M(...)`, `nominees: [...]` arrays nested by year). Phase 1.13b must read both shapes. The browse path infers status from position (one `winner` slot vs. items in `nominees[]`); per-entry record path uses the explicit `won` boolean.

---

## Suggested integration order for Phase 1.13b

1. **Movie Cube awards face** (`components/moviecube.js`) — highest visibility, isolated blast radius, already has clean `award.won` boolean. ~134 lines of duplicate SVG (`getAwardGlyphSVG`) deleted.
2. **`pages/awards-browse.js`** — biggest visible payoff. Festival tabs + info panel + year listings all use `AWARD_SVGS`. 4 call sites in one file.
3. **`pages/people-profile.js`** — person award cards. 1279-1282 map removed; per-entry `won` drives `data-status`.
4. **`pages/compare.js`** — single call site (line 2098), trivial swap.
5. **`components/awards.js`** — re-implement `getAwardBadgesHTML()` to emit `<div class="orbit-award-badge">` markup. Delete `AWARD_EMOJIS` and the local `AWARD_SVGS`.
6. **Legacy CSS retirement** — once all consumers above are migrated:
   - `pages/results.css:1028` `.award-badge { … }`
   - `pages/results-classic.css:974` `.award-badge { … }`
   - `games/game.css:881` `.award-badge { … }`
   - `components/moviecube.css:305` `.cube-award-badges .award-badge { … }`
7. **Decorative cleanups (low priority):** discover.js filter pills, people-library.js hero — confirm stay-or-go with user.

## Open questions for the user before Phase 1.13b begins

- **Discover filter pills** (`pages/discover.js:3281-3285`): badges-as-filter-affordance feels wrong since these aren't won/nominee markers, just festival labels. Keep `og-*` legacy or convert to new badges anyway?
- **People Library hero glyph** (`pages/people-library.js:105`): `og-globe` is decorative, not status. Migrate or leave?
- **Browse-listing schema unification:** the `winner: M(...)` / `nominees: [...]` shape in `data/awards-data.js` is older than the per-entry `won: bool` shape used by Movie Cube. Worth flattening to the per-entry shape during Phase 1.13b, or read both?
- **BAFTA cutout colour:** new component fills BAFTA mask cutouts (eyes, nose, mouth) with `var(--deep-void)` (#0a0e17). When the badge is rendered on a non-`--deep-void` background (e.g. a card with its own bg), the cutouts won't read as holes. Acceptable, or do we need an SVG `<mask>`-based approach for true transparency?
- **Sizing:** new component supports 18 / 24 / 32 / 36 / 40 / 56 / 76 / 132 px via `data-size`. Other arbitrary sizes need adding to `award-badges.css`. Are these enough, or do we need a fluid sizing approach?

---

## Smoke test (run before Phase 1.13b)

Add temporarily to any page that loads `variables.css`:

```html
<link rel="stylesheet" href="components/award-badges.css">
<script src="components/award-badges.js"></script>

<div style="display:flex; gap:12px; padding:24px; background:var(--deep-void)">
  <div class="orbit-award-badge" data-award-badge="oscar"  data-status="winner"  data-size="76" title="Oscar Winner"></div>
  <div class="orbit-award-badge" data-award-badge="cannes" data-status="winner"  data-size="76"></div>
  <div class="orbit-award-badge" data-award-badge="venice" data-status="winner"  data-size="76"></div>
  <div class="orbit-award-badge" data-award-badge="berlin" data-status="winner"  data-size="76"></div>
  <div class="orbit-award-badge" data-award-badge="bafta"  data-status="winner"  data-size="76"></div>
  <div class="orbit-award-badge" data-award-badge="globe"  data-status="winner"  data-size="76"></div>
  <div class="orbit-award-badge" data-award-badge="oscar"  data-status="nominee" data-size="76"></div>
</div>
```

Expected: 6 gold badges + 1 silver, each with festival-coloured halo (Oscar gold, Cannes amber, Venice crimson, Berlin red, BAFTA cyan, Globe yellow-gold). Console: no errors, no `[award-badges] Unknown festival id` warnings. Remove the test markup after verification.
