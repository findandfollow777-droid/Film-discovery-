# CLAUDE.md Compliance Audit — 2026-04-27

Repository: `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/`
Audit scope: 28 rules in `CLAUDE.md` (10 process rules marked N/A; 18 substantive rules audited).

---

### Rule 1 — Approach First, Code Second
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule — about how Claude works, not codebase state.

### Rule 2 — Small Change Sets
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

### Rule 3 — Post-Implementation Risk Assessment
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

### Rule 4 — Bug Fix Protocol
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

### Rule 5 — Living Rulebook
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

---

### Rule 6 — File Path Verification
**Status:** ⚠️ Partial
**Findings:** Most pages correctly use relative paths to shared resources. However:
- `orbit-glyphs.css` is located at `components/orbit-glyphs.css`, NOT at project root as Rule 6 implies. All `<link>` references use `../components/orbit-glyphs.css` and resolve correctly, but this contradicts the rule's stated location.
- Multiple references to non-existent HTML pages (broken navigation, would 404):
  - `landing.html` — referenced from `games/series.js:191` but file does not exist anywhere.
  - `awards-stats.html` and `awards-stories.html` — referenced as nav links from `pages/awards-browse.html:54-55`, `pages/awards-guide-festival.js:63-64`, `pages/awards-guide.html:35` and similar; neither file exists.
- `node validate-paths.js` could not be executed in this environment (Node not available), so dynamic verification was skipped.
**Violations:**
- `games/series.js:191` — `href="../landing.html"` (target missing)
- `pages/awards-browse.html:54` — `href="awards-stats.html"` (target missing)
- `pages/awards-browse.html:55` — `href="awards-stories.html"` (target missing)
- `pages/awards-guide.html:35-36` — refs to `awards-stats.html` / `awards-stories.html`
- `pages/awards-guide-festival.js:63-64` — refs to the same missing files
- Rule wording vs. reality: `components/orbit-glyphs.css` (not at repo root). All consumers reference `../components/orbit-glyphs.css` correctly, so it works — but either the rule or the file location should be reconciled.
**Effort to fix:** S
**Risk if unfixed:** Medium — broken links visible from main awards UI.
**Suggested fix approach:** Either remove the four `awards-stats.html` / `awards-stories.html` nav buttons or stub the pages as coming-soon. Remove the `landing.html` reference in `games/series.js`. Update Rule 6 in CLAUDE.md to note `orbit-glyphs.css` lives in `components/`.

---

### Rule 7 — Don't Touch What You Weren't Asked To
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

---

### Rule 8 — localStorage Key Audit
**Status:** ⚠️ Partial
**Findings:** Searched all `*.js` for `localStorage.(getItem|setItem|removeItem)`; extracted ~70 unique keys and cross-checked against `data/storage-keys.md`. Most keys are documented. The registry already flags many issues but a few keys are written/read in code yet not in the registry table.
**Violations:**
- `anchorFromResults` — written/read in `games/constellation.js:125`, `games/game.js:47`, `pages/anchor.js:418,441,454`, `pages/awards-browse.js:96`, `pages/home.js:115,642,782,1229`, `pages/people-profile.js:137`, `components/moviecube.js:429`, `pages/actor-timeline.js:41` — heavily used but absent from registry.
- `orbit_welcome_count` — written in `welcome-popup.js:228`, `orbit-welcome.js:277,340`, removed in `orbit-welcome.js:356`. Not in registry.
- `orbit_welcome_seen` — removed in `welcome-popup.js:277`. Not in registry.
- `WELCOME_KEY` (literal value depends on impl) in `orbit-welcome.js:25,260,277,340` — same family.
- Both `welcome-popup.js` and `orbit-welcome.js` exist in parallel using overlapping keys — registry doesn't reflect both files.
- Registry already flags as "dead": `timelineShowId` (still written in `games/series.js:653`), `anchorMovieId` (still written in `pages/venn.js:1675`), `timeCommitmentFilter` (still written in `pages/tv.js:313,318`), `orbit_trivia_stats` (read in `components/trivia-stats.js:14,47` — actually IS written there, contradicting the registry note).
**Effort to fix:** S
**Risk if unfixed:** Low — debugging friction only.
**Suggested fix approach:** Add `anchorFromResults` and `orbit_welcome_count` / `orbit_welcome_seen` to `data/storage-keys.md`; reconcile the duplicate welcome-popup vs. orbit-welcome implementations; remove the "Read but never written" claim about `orbit_trivia_stats` since `components/trivia-stats.js` does write it.

---

### Rule 9 — API Call Awareness
**Status:** ⏭️ N/A (process rule)
**Findings:** Flagging-behavior rule.

### Rule 10 — Git Commit Between Steps
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

---

### Rule 11 — Glyphs Over Emojis
**Status:** ❌ Violations found
**Findings:** Searched emoji unicode ranges (`\x{1F300}-\x{1F9FF}`, `\x{2600}-\x{27BF}`) across HTML/JS, then filtered share/clipboard contexts. ~45 emoji-block uses outside share strings, plus dozens of `✕` / `✓` / `★` / `✦` Unicode symbols used as button glyphs. The latter are arguably borderline (geometric symbols, not RGB emojis), but Rule 11 treats raw emoji-style icons (📺 🏛️ 🎯 🏆 etc.) as violations.
**Violations (emoji block — true Rule 11 breaches, 20 of ~30 representative):**
- `pages/tv.js:702,1113-1118` — `📺`, `📚`, `🎪`, `📽️`, `🎤`, `📰` in chip labels
- `pages/tv.js:1226` — `🏆` in inline div
- `pages/discover.js:2764,2811` — `🏛️ ${studio.name}` chip
- `pages/timeline.js:1689,2191` — `💰` in popularity / box-office
- `components/moviecube.js:338` — `🎯` icon span
- `components/moviecube.js:1097,1118,1133` — `📡 Where to Watch`
- `games/journeys.js:781` — `👤` in SVG text
- `games/screenshot.js:498` — `iconEl.textContent = "👍"`
- `games/mastermind.js:567,568` — `🎓` in verdict (UI, not share)
- `games/series.js:175,176,177` — `🛋️`, `🚀`, `🌌` time-commitment icons
- `pages/profile.html:132` — `☆ Shortlist button` (Unicode, borderline)
- `components/moviecube.js:341,1167,1182,2576,2583` — `☆` / `★` shortlist toggle (borderline; geometric, not emoji)
- `components/moviecube.js:331,162,268,306` — `✦` Anchor Film / Nebula glyph (could become `og-` glyph)
- `pages/venn.html:214`, `pages/timeline.html:317`, `pages/compare.html:66,84` — `✦` branding glyph in static HTML
**Effort to fix:** M
**Risk if unfixed:** Low–Medium (cross-platform rendering / brand consistency).
**Suggested fix approach:** Replace emoji-block icons with `<span class="og og-…"></span>` glyphs. Decide whether geometric Unicode (`★ ☆ ✦ ✕ ✓`) is exempt; if not, the close-`✕` alone has 50+ instances site-wide and should be folded into Rule 17's planned `orbit-close` component.

---

### Rule 12 — Use CSS Custom Properties
**Status:** ❌ Violations found
**Findings:** Counted hardcoded `#hex`, literal-rgb `rgba(`, hardcoded `font-family`, `box-shadow`, and pixel `border-radius` across all CSS (excluding `variables.css`).
- 428 hex-color occurrences across 30+ CSS files
- 2,500+ `rgba(literal, literal, literal, …)` occurrences (top: `pages/venn.css` 241, `pages/timeline.css` 209, `pages/results.css` 179, `pages/results-classic.css` 170, `components/moviecube.css` 164)
- 969 `font-family:` declarations not using `var(--font-…)`
- Hundreds of literal `box-shadow:` / `border-radius: …px`
**Violations (representative, 20 of many hundreds):**
- `next-frontier.css:156,291,294,296,435,438,440` — provider-brand colors `#ffaa00`, `#e50914`, `#4c8bf5` direct hex
- `components/moviecube.css:115,328,611,723,918,1443,1488,1489,1846,1914,1932,1995` — `#c4b5fd`, `#c0c0c0`, `#00ff88`, `#ff4757`, etc. inline
- `components/swipe-memory.css:156,198,206,223,264,272,276` — `#8892a6`, `#00ff88`, `#ff4757`
- `components/people-cube.css:689,742,743` — `#22c55e`
- `pages/home.css` — 60 hex literals (highest non-variables file)
- `welcome-popup.css` — 32 hex literals
- `pages/timeline.css` — 30 hex literals + 209 literal rgba
- `pages/people-profile.css` — 29 hex literals + 123 literal rgba
- `orbit-welcome.css:53,62,69,121,141,150` — `font-family: Orbitron, monospace` instead of `var(--font-display)`
**Effort to fix:** L
**Risk if unfixed:** Medium — theme drift, regressive when palette changes.
**Suggested fix approach:** Phase the cleanup file-by-file when those files are otherwise touched (per Rule 7). Promote orphan colors (e.g. `#00ff88`, `#ff4757`, `#c4b5fd`, `#22c55e`) into `variables.css` first. Streaming-provider brand colors (Netflix red, Disney blue) are legitimate exceptions but should still live in token form (e.g. `--brand-netflix`).

---

### Rule 13 — Use Shared Utilities
**Status:** ❌ Violations found
**Findings:** 100 inline `fetch(...api.themoviedb.org/...)` calls across 25+ JS files. 26 raw `JSON.parse(localStorage.getItem(...))` patterns outside `orbit-utils.js`. The `OrbitUtils.tmdb()` / `OrbitUtils.storage` helpers exist in `orbit-utils.js` (lines 50-110) but are bypassed in most pages.
**Violations (raw TMDB fetches, 20 of ~100):**
- `components/moviecube.js:543-546,1090,1275`
- `pages/timeline.js:288,303-304,432,652,660,749,806,820-821`
- `pages/people-profile.js:261-263,530,1915`
- `pages/randomizer.js:212,461,482,489,500,522,546,597,724,726,867`
- `pages/tv-randomizer.js:413,437,460,499,603,605,712`
- `pages/actor-timeline.js:154-156,268,673`
- `games/game.js:162-163,314-315,656-657`
- `games/constellation.js:677,755,816`
- `games/journeys.js:995`
- `games/tenth-star.js:625`
- `pages/both.js:227-228,244,260,1452-1453`
- `pages/tv.js:564,1012`
- `pages/compare.js:372-373,1048`
- `pages/results.js:321,1272`
- `pages/home.html:398,469,932-934` (inline script)
- `quick-search-modal.js:222,314`
- `utils.js:247`
**Violations (raw localStorage JSON.parse, 12 of 26):**
- `pages/both.js:390,1467` — `watchProviders`
- `pages/tv.js:445,1018` — `watchProviders`
- `pages/discover.js:1236,3028` — `watchProviders`
- `pages/results.js:1057` — `watchProviders`
- `pages/profile.js:491` — `orbit_user_providers`
- `pages/randomizer.js:65,156,157,172,202` — five raw parses
- `pages/tv-randomizer.js:74,192,193,207,222` — five raw parses
- `pages/people-library.js:2469` — `orbit_people_profiles_v3`
- `pages/venn.js:206` — `vennPeople`
- `next-frontier.js:58-59`
- `components/moviecube.js:1128,1391`
- `components/people-cube.js:784`
**Effort to fix:** L
**Risk if unfixed:** Medium — duplicates caching/error logic, makes Rule 28 (cache TMDB results) impossible to enforce centrally.
**Suggested fix approach:** Migrate hot paths first (randomizer + timeline + actor-timeline are top fetch contributors). Add a `OrbitUtils.cachedTmdb()` wrapper that wraps sessionStorage caching, then incrementally replace raw fetches.

---

### Rule 14 — Consistent Naming Conventions
**Status:** ✅ Compliant (mostly)
**Findings:**
- CSS classes: spot-checked — all kebab-case (no `.someCamelClass{}` patterns found).
- JS functions: no snake_case function declarations found.
- File names: all kebab-case lowercase.
- localStorage keys: ~22 keys do **not** follow `orbit_` prefix convention. These are mostly legacy/short-lived state (`movies`, `genres`, `mediaType`, `singleMovie`, `vennPeople`, `anchorMovie`, `watchCountry`, `watchProviders`, `englishOnlyToggle`, `*_stats`, `*_game_${today}`). The CLAUDE rule allows fixing only when already editing.
**Violations:** Naming-rule technical breaches but listed as acceptable legacy:
- `data/storage-keys.md` itself documents `watchCountry` / `watchProviders` as **legacy**.
- Game-stat keys (`collision_stats`, `journeys_stats`, `connections_stats`, etc.) lack `orbit_` prefix.
- `vennPeople`, `anchorMovie`, `timelineMovieId` all camelCase rather than `orbit_*` snake_case.
**Effort to fix:** M (would require migration shims).
**Risk if unfixed:** Low.
**Suggested fix approach:** Per Rule 14 footnote, only fix when already editing the file. Don't migrate eagerly.

---

### Rule 15 — Mobile-First Verification
**Status:** ❌ Violations found
**Findings:** 4 CSS files have **zero** `@media` rules: `pages/venn.css` (1585 lines), `orbit-welcome.css` (165 lines), `variables.css` (expected), `components/orbit-glyphs.css` (expected). 18 CSS files have only **1** `@media` rule. Only 34 of 90 total `@media` queries use the prescribed `650px` or `900px` breakpoints; many use ad-hoc `768px`, `480px`, `1024px`, `600px`.
**Violations:**
- `pages/venn.css` — 1585 lines, NO responsive rules at all (high-impact: Venn diagram is core feature).
- `orbit-welcome.css` — 165 lines, NO responsive rules.
- Only 1 media query each: `components/people-cube.css`, `components/swipe-memory.css`, `games/alternate.css`, `games/collision.css`, `games/connections.css`, `games/game.css`, `games/mastermind.css`, `games/screenshot.css`, `games/sequel-shot.css`, `games/series.css`, `games/triple-collision.css`, `pages/actor-timeline.css`, `pages/coming-soon.css`, `pages/orbit-map.css`, `pages/randomizer-hub.css`, `pages/timeline.css`, `quick-search-modal.css`, `welcome-popup.css`.
- Non-standard breakpoints used: `games/journeys.css:964,979` use `768px` and `480px`; many other files mix.
**Effort to fix:** L
**Risk if unfixed:** High — Venn page in particular is mission-critical and likely broken on mobile.
**Suggested fix approach:** Audit `pages/venn.css` first with a real device pass. Standardize on `650px` / `900px` breakpoints in a follow-up sweep.

---

### Rule 16 — Color Coding by Feature Area
**Status:** ⚠️ Partial
**Findings:** Tokens prescribed by the rule:
- `--accent-cyan` ✅ in `variables.css:14`
- `--tv-accent` ❌ NOT in `variables.css` — defined locally in `games/series.css:9`
- `--accent-gold` ✅
- `--prestige-purple` ✅
- `--collision-orange` ❌ NOT in `variables.css` — defined locally in `games/arcade.css:8`
- `--success-green` ✅
- `--danger-red` ✅
The rule says new features should reuse the palette; many CSS files still introduce one-off colors:
**Violations:**
- `games/series.css:9-10` — defines `--tv-accent` locally instead of in central `variables.css`.
- `games/arcade.css:8,17,20` — defines `--collision-orange`, `--collision-red`, `--screenshot-amber` locally.
- New ad-hoc accents in feature CSS files: `#00ff88` (sup green) appearing in `components/moviecube.css:1443,1488-89`, `components/swipe-memory.css:198,272`; `#ff4757` (off-red) in `components/moviecube.css:1914`, `components/swipe-memory.css:206,276`; `#c4b5fd` (lavender) in moviecube; `#22c55e` (alt green) in people-cube.
- Streaming-provider brand colors (`#e50914`, `#4c8bf5`) in `next-frontier.css` are legitimate exceptions but un-tokenized.
**Effort to fix:** S
**Risk if unfixed:** Low–Medium — palette drift.
**Suggested fix approach:** Hoist `--tv-accent` and `--collision-orange` (plus their `-rgb` variants) into `variables.css`. Replace ad-hoc `#00ff88`/`#ff4757` with `var(--success-green)` / `var(--danger-red)`.

---

### Rule 17 — Shared Close Button Pattern
**Status:** ❌ Violations found (pattern not yet implemented)
**Findings:**
- `orbit-close.js` does NOT exist anywhere in the repo.
- `orbit-close.css` does NOT exist.
- `class="orbit-close"` is referenced ZERO times in code.
- `data-orbit-popup` attribute appears ONLY inside `CLAUDE.md` (rule text itself), never in markup.
- 55+ bespoke close-button class instances site-wide (`modal-close`, `popup-close`, `bio-close`, `focus-close`, `trailer-close`, `info-close`, `overlay-close`, `postgame-close`, `cube-close`, `helpClose`, `statsClose`, etc.) each with their own JS handler.
**Violations (representative, 15 of 55):**
- `games/connections.html:128,170` — `modal-close`
- `games/journeys.html:60,95,136,181` — `postgame-close`, `overlay-close`, `modal-close`
- `games/alternate.html:149` — `modal-close`
- `games/game.html:208,245`, `games/collision.html:195,241`, `games/triple-collision.html:217,267`, `games/screenshot.html:161,215`, `games/mastermind.html`, `games/sequel-shot.html` — all use `modal-close`
- `pages/venn.html:116,177,194,227` — `bio-close-right`, `info-close`, `popup-close`, `trailer-close`
- `pages/timeline.html:197,275,296,337` — `bio-close`, `modal-close`, `popup-close`, `trailer-close`
- `pages/discover.html:144`, `pages/both.html:209`, `pages/tv.html:273` — `focus-close`
- `pages/home.html:575,600` — `pyo-popup-close`, `arc-close`
- `components/moviecube.js:153,356,365,378` — `popup-close`, `modal-close`, `trailer-close`
**Effort to fix:** M (one-time creation of `orbit-close.js` / `orbit-close.css`, then mark up wrappers)
**Risk if unfixed:** Medium — animation inconsistency across popups; rule is essentially aspirational at the moment.
**Suggested fix approach:** Build `orbit-close.js` with Black Hole exit animation + `orbit:close` event; define `.orbit-close` class in CSS. Then incrementally migrate: shared modals first (cube, people-cube, awards), games last. Consider co-loading via a single `<script>` tag in every HTML page.

---

### Rule 18 — Comment Headers on New Sections
**Status:** ⚠️ Partial
**Findings:** Sample-checked the largest JS files for the prescribed `/* ============ HEADER — Added Mon DD, YYYY ===== */` pattern.
- `components/moviecube.js` (2732 lines): only 1 dated header (line 2653, "WATCHLIST BUTTON — Added 2026-03-28"). Many large feature blocks lack headers.
- `pages/timeline.js` (3601 lines): 2 dated headers (lines 1, 3410).
- `pages/discover.js` (3763 lines): 1 header (line 1).
- `orbit-utils.js` (246 lines): 1 header (line 1, file-level only).
- `components/awards.js` (18,196 lines): file-level header only; auto-generated, exempt.
- `components/people-cube.js` (1246 lines): zero dated headers.
- `pages/people-profile.js` (2400 lines): zero dated headers.
**Violations:** Hard to enumerate violations because the rule applies to "newly added" 50+ line blocks. No way to retroactively know which blocks postdate the rule. Treat this as a partial — pattern is established but inconsistently applied in the largest files.
**Effort to fix:** S (only applies going forward)
**Risk if unfixed:** Low (debugging friction in long files).
**Suggested fix approach:** No retro-fix needed. Enforce going forward.

---

### Rule 19 — No Orphan Features
**Status:** ❌ Violations found
**Findings:** Cross-referenced every HTML page against `index.html`, navigation menus, and outbound JS `window.location.href` calls.
- `index.html` main nav links to: `home`, `discover`, `arcade`, `awards-browse`, `next-frontier`, `orbit-map`, `people-library`, `profile`, `randomizer-hub`, `rankings`, `towatchiverse`.
- `pages/coming-soon.html` — exists, never referenced from anywhere except its own CSS link.
- `pages/results-classic.html` — exists, has CSS/JS wired (`pages/results-classic.css`, no JS), never referenced from any nav/JS. True orphan.
- `pages/awards-stats.html`, `pages/awards-stories.html` — referenced from awards nav buttons but **don't exist** (broken links — overlaps with Rule 6).
- `landing.html` — referenced by `games/series.js:191` but file does not exist.
- `pages/both.html`, `pages/tv.html` — reachable via discover ↔ both ↔ tv toggles (legitimate).
- `tests/tests.html`, `tests/test-taste.html` — test pages, expected to be unlinked.
**Violations:**
- `pages/coming-soon.html` — orphan.
- `pages/results-classic.html` — orphan (has full CSS, suggests it was meant to be a fallback/A-B variant).
- Broken outbound nav (overlaps Rule 6): `pages/awards-browse.html:54,55`, `pages/awards-guide.html:35,36`, `pages/awards-guide-festival.js:63-64`, `games/series.js:191`.
**Effort to fix:** S
**Risk if unfixed:** Medium — broken awards nav buttons hit users; orphan pages waste storage / confuse maintenance.
**Suggested fix approach:** Either delete `coming-soon.html` and `results-classic.html` or wire them in. Stub or remove the missing `awards-stats` / `awards-stories` nav links.

---

### Rule 20 — Navigation Consistency
**Status:** ⚠️ Partial
**Findings:** Surveyed every HTML page for back-button presence and hardcoded targets.
- 30 pages have a `back-link` element. 6 use `history.back()` (anchor.html, randomizer.html, randomizer-hub.html, towatchiverse.html, tv-randomizer.html, next-frontier.html, plus constellation.html "HUD-back" button).
- The remainder hardcode targets, often to `../index.html` or to `arcade.html`.
- 4 pages have NO back element: `pages/discover.html`, `pages/home.html`, `pages/coming-soon.html`, `pages/profile.html` (in addition to test pages and `index.html` itself).
**Violations (hardcoded `index.html` instead of `history.back()`, 18 of ~24):**
- `games/arcade.html:33` — `href="../index.html"` (could use history.back)
- `games/series.html:24` — `href="../index.html"`
- `pages/actor-timeline.html:26` — `href="../index.html"`
- `pages/awards-browse.html:28` — `href="../index.html"`
- `pages/compare.html:24` — `href="../index.html"`
- `pages/coming-soon.html` — no back nav
- `pages/discover.html` — no back nav
- `pages/home.html` — no back nav
- `pages/orbit-map.html:22` — `href="discover.html"` (smart but hardcoded)
- `pages/people-library.html:23` — `href="../index.html"`
- `pages/people-profile.html:25` — `href="people-library.html"` (smart but hardcoded)
- `pages/profile.html` — no back nav
- `pages/rankings.html:24` — `href="../index.html"`
- `pages/results.html:24` — `href="../index.html"`
- `pages/results-classic.html` — back not history-based
- `pages/venn.html:24` — `href="timeline.html"` (smart but hardcoded)
- `games/collision.html:27`, `games/connections.html:27`, `games/journeys.html:20`, `games/alternate.html:27`, `games/game.html:34`, `games/mastermind.html:27`, `games/screenshot.html:27`, `games/sequel-shot.html:32`, `games/tenth-star.html:28`, `games/triple-collision.html:27` — all `href="arcade.html"` (acceptable — game→arcade is canonical; debatable whether this counts as a violation).
**Effort to fix:** S
**Risk if unfixed:** Medium — every game/page back button takes you to a fixed destination instead of where you came from. Common UX complaint.
**Suggested fix approach:** Use `OrbitUtils.smartBack()` if it exists (registry mentions `orbit_nav_history` already in `utils.js`); otherwise create a small helper. Add back-nav to `discover.html`, `home.html`, `profile.html`. Replace hardcoded `href="../index.html"` with `onclick="history.back()"` fallback.

---

### Rule 21 — Test After Every Navigation Change
**Status:** ⏭️ N/A (process rule)
**Findings:** Process rule.

### Rule 22 — Data File Changes Need a Note
**Status:** ⏭️ N/A (process rule)
**Findings:** Commit-message process rule.

---

### Rule 23 — Respect the Cosmic Theme
**Status:** ✅ Compliant (light pass)
**Findings:** Spot-checked feature names: "Constellation", "Nebula Impressions", "Orbit", "Comet Trail", "Stellar Catalog", "Black Hole" (rule 17 reference), "Cosmic Blue" tokens. Theme is well established in UI strings without forcing it into clarity-critical messages.
**Violations:** None worth flagging.
**Effort to fix:** —
**Risk if unfixed:** —
**Suggested fix approach:** —

---

### Rule 24 — Cinema First, TV Minimal
**Status:** ⚠️ Partial
**Findings:** Searched for TV references in Quick Search, Venn, and games.
- `quick-search-modal.js` — clean. No TV calls. Uses `media_type:'movie'` only.
- `pages/venn.js` — clean. Movie-only.
- `games/series.js` (`games/series.html`) — entire game dedicated to TV series (uses `/tv/{id}`, `/aggregate_credits`, season fetches at lines 84-113). This is a TV-specific game living in the games folder, which directly contradicts Rule 24 ("all games are movies-only").
- `pages/tv.html`, `pages/tv.js` — fine, this is the dedicated TV page (Rule 24 allows simplified TV form).
- `pages/tv-randomizer.html` — also TV-dedicated page, allowed.
- `pages/timeline.js` — uses TV for actor timelines (allowed by Rule 24).
- `pages/actor-timeline.js` — uses TV credits (allowed).
**Violations:**
- `games/series.html` and `games/series.js:84,90,97,113` — TV-only game inside `games/` directory.
- `games/series.html:24` references "← Home" but the entire game's data model is TV-shows.
**Effort to fix:** N/A (deliberate scope decision)
**Risk if unfixed:** Low — was likely a conscious carve-out but should be confirmed.
**Suggested fix approach:** Either accept `games/series.*` as a sanctioned exception and update Rule 24 wording, or move it under `pages/` to align with TV-page conventions.

---

### Rule 25 — Content Origin Awareness
**Status:** ✅ Compliant
**Findings:**
- `data/nebula-data/*.json` — all 501 files contain `"generatedAt": <ISO timestamp>` field.
- `data/orbit-movie-settings.json` — `"meta": { "generated": ..., "sources": [...] }` block.
- `data/orbit-settings-seed.json` — same `meta.sources` shape.
- `games/mastermind-ai-questions.js` — file-header comment with model name + timestamp.
- `data/awards-data.js` — header `"Auto-generated by convert-awards-csv.js"` (origin tracked, model=script).
- `data/awards-data-v1.2-preview.json` — checked, has version meta.
**Violations:** None substantive.
**Effort to fix:** —
**Risk if unfixed:** —
**Suggested fix approach:** —

---

### Rule 26 — API Key Discipline
**Status:** ❌ Violations found
**Findings:** Searched literal key string `dd1b9aebd0769bc49a68b7853b6f4266` across the repo.
**Violations:**
- `config.js:2` — canonical (allowed).
- `scripts/fp.mjs:2` — `const K="dd1b9aebd0769bc49a68b7853b6f4266"` (key duplicated outside config.js).
- `scripts/generate-settings-seed.js:14` — duplicate of key.
- `scripts/generate-mastermind-tmdb.js:15` — duplicate of key.
- `orbit_tmdb_lookup.py:26` — duplicate of key in Python script at repo root.
- `docs/TEST_REPORT.md:465` — key string in plain text inside docs (`"dd1b9aebd0769bc49a68b7853b6f4266"`).
- `docs/TEST_REPORT.md:634` — second occurrence in same doc.
**Effort to fix:** S
**Risk if unfixed:** **High** — key in `docs/TEST_REPORT.md` is in version-tracked documentation; if repo is ever public this leaks the key. Scripts duplicating the key make rotation impossible from one place.
**Suggested fix approach:** Redact both `docs/TEST_REPORT.md` lines (replace with `"…REDACTED…"`). Refactor `scripts/fp.mjs`, `scripts/generate-settings-seed.js`, `scripts/generate-mastermind-tmdb.js`, and `orbit_tmdb_lookup.py` to read the key from `config.js` (or an env var). Rotate the TMDB key once leaks are scrubbed.

---

### Rule 27 — Lazy Load Heavy Data
**Status:** ❌ Violations found
**Findings:** Files >100KB and how they're loaded:
- `data/awards-data.js` (1.7 MB) — **eagerly** loaded via `<script src>` in `index.html:248`, `pages/awards-browse.html:131`, `pages/compare.html:129`. Major Rule 27 breach.
- `data/awards-data-v1.2-preview-legacy.js` (443 KB) — **eagerly** loaded via `document.write('<script src="../data/awards-data-v1.2-preview-legacy.js">')` in `pages/awards-browse.html:135`.
- `components/awards.js` (648 KB) — appears to be loaded via `<script>` tags as well.
- `games/mastermind-ai-questions.js` (120 KB) — **eagerly** loaded in `games/mastermind.html:288`.
- `data/orbit-settings-seed.json` (6.7 MB) — lazy-loaded via `fetch('../data/orbit-settings-seed.json')` ✅
- `data/orbit-movie-settings.json` (4.2 MB) — lazy-loaded via `fetch()` in `components/moviecube.js:53`, `pages/discover.js:95`, `pages/orbit-map.js:70`, `pages/results.js:21` ✅
- `data/awards-data-v1.2-preview.json` (3.1 MB) — `fetch()` only.
- `data/person-id-lookup.json` (242 KB) — `fetch()` only.
**Violations:**
- `index.html:248` — `<script src="data/awards-data.js"></script>` (1.7 MB on home).
- `pages/awards-browse.html:131` — same.
- `pages/awards-browse.html:135` — adds another 443 KB legacy file via `document.write`.
- `pages/compare.html:129` — same.
- `games/mastermind.html:288` — `<script src="mastermind-ai-questions.js">` (120 KB on game load).
**Effort to fix:** M
**Risk if unfixed:** **High** — `index.html` ships 1.7 MB of awards data on every site visit even if user never opens awards. Performance regression, mobile data, and slow Time-to-Interactive.
**Suggested fix approach:** Convert `data/awards-data.js` to JSON and lazy-fetch via `pages/awards-browse.js` only. Same for `mastermind-ai-questions.js`. Keep the data in `globalThis.AWARDS_DATABASE` shape after fetch so no other call sites need to change.

---

### Rule 28 — Cache Expensive API Results
**Status:** ❌ Violations found
**Findings:** sessionStorage caching is implemented in only a handful of files:
- `pages/anchor.js:28-69,537-567` — caches person credits + movie details ✅
- `pages/home.js:797-927` — caches popular/upcoming/nowPlaying ✅
- `pages/awards-browse.js:625-643` — caches profile images ✅
- `components/people-cube.js:57-81` — caches people-cube payload ✅
- `next-frontier.js:124-129` — generic sessionStorage helper ✅
- `components/nebula-service.js:56-83` — uses localStorage with TTL for Nebula reviews ✅
Other heavy callers do **not** cache and re-fetch:
**Violations:**
- `pages/randomizer.js:212,461,482,489,500,522,546,597,724,726,867` — every spin re-hits TMDB; movie-detail call repeats for previously-seen movies.
- `pages/tv-randomizer.js:413,437,460,499,603,605,712` — same.
- `pages/timeline.js:288,303-304,432,652,660,749,806,820-821` — credits + tv calls per timeline view, no cache.
- `pages/actor-timeline.js:154-156,268,673` — same actor re-fetched on every entry.
- `pages/people-profile.js:261-263,530,1915` — re-hits TMDB even if `orbit_people_profiles_v3` cache exists for some fields.
- `pages/compare.js:372-373,1048` — keywords + details fetched every comparison.
- `pages/results.js:321,1272` — uncached per-id detail fetches.
- `pages/both.js:227-260,1452-1453` — discover + watch-providers fresh each time.
- `pages/tv.js:564,1012` — fresh.
- `quick-search-modal.js:222,314` — search-as-you-type uncached (debatable since input changes).
- `games/game.js:162-163,314-315,656-657` — game-day fixed movie re-fetches each load.
- `games/constellation.js:677,755,816` — same.
- `games/journeys.js:995`, `games/tenth-star.js:625` — same.
- `components/moviecube.js:543-546,1090,1275` — opening the same MovieCube twice in a session re-fetches all four endpoints (precisely the example used in Rule 28).
**Effort to fix:** M (single shared wrapper handles all sites once `OrbitUtils.cachedTmdb()` exists)
**Risk if unfixed:** **High** — Rule 28's exact example case (re-opening same MovieCube) is unmitigated. Real TMDB rate-limit risk on power users.
**Suggested fix approach:** Add `OrbitUtils.cachedTmdb(endpoint, ttlMs)` wrapping `sessionStorage`. Migrate `components/moviecube.js` and `pages/randomizer.js` first (highest call volume), then sweep remaining sites.

---

## Top 5 highest-impact fixes
Ranked by Risk × number of violations × low effort.

1. **Scrub TMDB API key from `docs/TEST_REPORT.md` (Rule 26).** Two-line edit, eliminates a high-severity leak. Then dedupe key in 4 scripts.
2. **Lazy-load `data/awards-data.js` (Rule 27).** Removing 1.7 MB from `index.html` cold-load is the single biggest perf win in the repo. ~5 files touched.
3. **Add caching wrapper in `orbit-utils.js` and migrate MovieCube + Randomizer (Rules 13 + 28).** Solves Rule 28's named example and unblocks centralised caching for ~100 raw fetches.
4. **Fix broken awards-stats / awards-stories / landing.html nav (Rules 6 + 19).** Either delete the buttons or stub the pages — visible breakage right on the awards UI.
5. **Move `--tv-accent`, `--collision-orange`, `#00ff88`, `#ff4757`, `#22c55e` into `variables.css` and replace ad-hoc usages (Rules 12 + 16).** Small, stops palette drift, sets up the larger Rule 12 cleanup.

---

## Quick wins (S effort, any risk)
- Redact API key from `docs/TEST_REPORT.md:465` and `:634` (Rule 26).
- Add `anchorFromResults`, `orbit_welcome_count`, `orbit_welcome_seen` to `data/storage-keys.md`; remove the stale "Read but never written" claim about `orbit_trivia_stats` (Rule 8).
- Hoist `--tv-accent` and `--collision-orange` (+ `_rgb` variants) into `variables.css` (Rule 16).
- Delete `pages/coming-soon.html` and `pages/results-classic.html` if unused (Rule 19).
- Remove or stub the four broken awards nav buttons (`awards-stats.html`, `awards-stories.html`) in `pages/awards-browse.html`, `pages/awards-guide.html`, `pages/awards-guide-festival.js` (Rules 6 + 19).
- Remove `landing.html` reference in `games/series.js:191` (Rule 6).
- Replace `<script src="data/awards-data.js">` on `index.html:248` with a stub that only loads when the awards modal is opened (Rule 27).
- Add a back-link block to `pages/discover.html`, `pages/home.html`, and `pages/profile.html` (Rule 20).
- Update CLAUDE.md Rule 6 to note `orbit-glyphs.css` lives at `components/`, not root (or relocate the file).

## Don't bother
- Migrating non-`orbit_` localStorage keys (`watchCountry`, `watchProviders`, `vennPeople`, `*_stats`) in bulk — Rule 14 explicitly says fix only when already editing.
- Replacing every Unicode geometric glyph (`★ ☆ ✦ ✕ ✓`) in HTML/JS — these aren't true emojis and replacing them would cascade through dozens of files for no functional gain. Rule 11's intent is the colour-emoji block (`📺 🎯 🏆 etc.`), which is the smaller, focussed list under Rule 11.
- Adding dated comment headers retroactively to old code blocks — Rule 18 only applies to new blocks.
- Standardising all media queries on 650/900 px — most existing 768/480 breakpoints work fine; only `pages/venn.css` (no responsive rules) is truly worth fixing.
- Fixing camelCase localStorage keys (`anchorMovie`, `vennPeople`, `singleMovie`) — high churn, no functional benefit.
