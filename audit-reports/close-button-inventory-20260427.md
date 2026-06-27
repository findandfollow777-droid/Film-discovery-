# Close Button Inventory — 2026-04-27

Read-only audit ahead of Rule 17 (Shared Close Button Pattern) rollout.

- **Total close buttons found:** 71
- **Files involved:** 32 source files (HTML/JS) + ~30 CSS files containing close-button styles
- **Hover animation pattern across the codebase:** `transform: scale(1.1)` (most popups), `transform: rotate(90deg)` (venn `.info-close` only), color/opacity-only hovers on a few. No close-out / black-hole-style exit animations exist anywhere.

---

## Master table

| File | Line | Current class(es) | Parent popup selector | Close handler location | Animation present |
|---|---|---|---|---|---|
| `index.html` | 223 | `qs-close-btn` | Quick Search modal (`.qs-modal` overlay built in `quick-search-modal.js`) | `quick-search-modal.js:122` (`closeBtn.addEventListener('click', closeModal)`) | `quick-search-modal.css:100` hover only — color change |
| `components/moviecube.js` | 153 | `popup-close` | `#cubePopupOverlay` (cube wrapper) | `components/moviecube.js:387` → `closeMovieCube()` at L589 | `components/moviecube.css:62` hover `transform: scale(1.1)` |
| `components/moviecube.js` | 356 | `modal-close` | `#cubeSimilarOverlay` (similar-movies sub-modal) | `components/moviecube.js:448` → `closeSimilarPanel()` | `components/moviecube.css:1136` hover `transform: scale(1.1)` |
| `components/moviecube.js` | 365 | `modal-close` | `#cubeAllCastOverlay` (full cast sub-modal) | `components/moviecube.js:460` → `closeAllCast()` | `components/moviecube.css:1136` hover `transform: scale(1.1)` |
| `components/moviecube.js` | 378 | `trailer-close` | `#cubeTrailerOverlay` (trailer sub-modal) | `components/moviecube.js:466` → `closeTrailer()` | `components/moviecube.css:1327` hover `transform: scale(1.1)` |
| `components/people-cube.js` | 310 | `pcube-close` | `#peopleCubeOverlay` | `components/people-cube.js:350` → `closePeopleCube()` at L534 | `components/people-cube.css:51` hover `transform: scale(1.1)` |
| `welcome-popup.js` | 150 (built in JS) | `wp-header-close` | `.wp-overlay` (built in JS) | `welcome-popup.js:243` → `dismiss(false)` at L231 | `welcome-popup.css` `overlay.visible` opacity transition (~420ms) |
| `welcome-popup.js` | 210 (built in JS) | `wp-footer-close` | `.wp-overlay` (built in JS) | `welcome-popup.js:248` → `dismiss(false)` at L231 | same as above |
| `orbit-welcome.js` | 201 (built in JS) | `orbit-welcome-close` | `.orbit-welcome-overlay` (built in JS) | `orbit-welcome.js:282` (anonymous listener) | `orbit-welcome.css:82` hover only — color change |
| `pages/awards-browse.html` | 95 | `info-panel-close` | `#awardsInfoPanel` | `pages/awards-browse.js` (search for `infoPanelClose` id) | `pages/awards-browse.css:1078` hover only — color change |
| `pages/awards-browse.html` | 104 | `modal-close` | `#guideModal` (awards guide modal) | `pages/awards-browse.js` `guideModalClose` handler | `pages/awards-browse.css:1227` hover only — color change |
| `pages/people-profile.html` | 259 | `pp-lightbox-close` | `#ppLightbox` (photo lightbox) | `pages/people-profile.js` `ppLightboxClose` handler | `pages/people-profile.css:1633` hover opacity only |
| `pages/people-profile.html` | 272 | `pp-awards-modal-close` | `#ppAwardsModal` | `pages/people-profile.js:1353` (`onclick = closeModal`) | `pages/people-profile.css:940` hover only — color change |
| `pages/people-profile.js` | 2302 | `pp-reorder-modal-close` | `.pp-reorder-modal` (built in JS) | `pages/people-profile.js:2348` (`closeModal`) | none |
| `pages/timeline.html` | 197 | `bio-close` | `#bioOverlay` | `pages/timeline.js` (bio close listener — search `bioClose`) | `pages/timeline.css:1788` hover only — color change |
| `pages/timeline.html` | 275 | `modal-close` | (search `modalClose` id) — generic modal | `pages/timeline.js` `modalClose` handler | timeline.css generic modal-close hover |
| `pages/timeline.html` | 296 | `popup-close` | `#popupOverlay` (movie/person popup) | `pages/timeline.js:2629` → `closePopup()` at L2217 | timeline.css `.popup-close:hover` |
| `pages/timeline.html` | 337 | `trailer-close` | `#trailerOverlay` | `pages/timeline.js` trailerClose handler | timeline.css `.trailer-close:hover` |
| `pages/venn.html` | 116 | `bio-close-right` | `#bioPanel` | `pages/venn.js` `bioCloseRight` handler | `pages/venn.css:1078` hover only |
| `pages/venn.html` | 177 | `info-close` | `#infoPanel` | `pages/venn.js` `infoClose` handler | `pages/venn.css:904` hover **`transform: rotate(90deg)`** ⚠️ |
| `pages/venn.html` | 194 | `popup-close` | `#popupOverlay` | `pages/venn.js:1575` → `closePopup()` at L1636 | `pages/venn.css:1411` `.popup-close:hover` |
| `pages/venn.html` | 227 | `trailer-close` | `#trailerOverlay` | `pages/venn.js` trailerClose handler | none specific |
| `pages/results.html` | 82 | `drawer-close` | `#filterDrawer` | `pages/results.js` `drawerClose` handler | `pages/results.css:509` hover only |
| `pages/results.html` | 177 | `bio-close` | `#bioOverlay` | `pages/results.js` bioClose handler | `pages/results.css:1396` hover only |
| `pages/results.js` | 918 (inline) | `capped-close` | parent of inline button (limit-cap toast) | **inline `onclick="this.parentElement.remove()"`** ⚠️ | none |
| `pages/results-classic.html` | 191 | `bio-close` | `#bioOverlay` | `pages/results-classic.js` bioClose handler | `pages/results-classic.css:2545` hover only |
| `pages/randomizer.html` | 505 | `modal-close` | `#helpModal` | `pages/randomizer.js:132` → `hideModal('helpModal')` | `pages/randomizer.css:735` hover only |
| `pages/randomizer.html` | 543 | `modal-close` | `#historyModal` | `pages/randomizer.js:137` → `hideModal('historyModal')` | `pages/randomizer.css:735` hover only |
| `pages/tv-randomizer.html` | 484 | `modal-close` | `#helpModal` | `pages/tv-randomizer.js:171` → `hideModal('helpModal')` | `pages/tv-randomizer.css:756` hover only |
| `pages/tv-randomizer.html` | 522 | `modal-close` | `#historyModal` | `pages/tv-randomizer.js:176` → `hideModal('historyModal')` | `pages/tv-randomizer.css:756` hover only |
| `pages/profile.html` | 391 | `list-modal-close` | `#listModal` | `pages/profile.js` listModalClose handler | `pages/profile.css:937` hover only |
| `pages/orbit-map.html` | 53 | `panel-close` | `#detailPanel` | `pages/orbit-map.js` panelClose handler | `pages/orbit-map.css:268` hover only |
| `pages/home.html` | 575 | `pyo-popup-close` | `#pyoPopup` (Pick-Your-Own popup) | `pages/home.js` pyo-popup-close handler | `pages/home.css:1719` hover color only |
| `pages/home.html` | 600 | `arc-close` | `#arcPopup` | `pages/home.js` arc-close handler | `pages/home.css:1872` hover color only |
| `pages/actor-timeline.html` | 106 | `career-dna-close` | `#careerDnaPanel` | `pages/actor-timeline.js` careerDnaClose handler | `pages/actor-timeline.css:455` hover only |
| `pages/tv.html` | 273 | `focus-close` | `#focusPanel` | `pages/tv.js` focusCloseButton handler | `pages/tv.css` focus-close hover |
| `pages/discover.html` | 144 | `focus-close` | `#focusPanel` | `pages/discover.js` focusCloseButton handler | `pages/discover.css:1516` hover only |
| `pages/discover.html` | 165 | `more-filters-close` | `#moreFiltersOverlay` | `pages/discover.js` moreFiltersClose handler | `pages/discover.css:948` hover only |
| `pages/both.html` | 209 | `focus-close` | `#focusPanel` | `pages/both.js` focusCloseButton handler | discover.css focus-close hover (shared) |
| `games/connections.html` | 94 | `result-close-btn` | `#resultModal` | `games/connections.js` resultCloseBtn handler | `games/connections.css:830` hover only |
| `games/connections.html` | 128 | `modal-close` | `#helpModal` | `games/connections.js` helpClose handler | `games/connections.css:641` hover only |
| `games/connections.html` | 170 | `modal-close` | `#statsModal` | `games/connections.js` statsClose handler | `games/connections.css:641` hover only |
| `games/journeys.html` | 60 | `postgame-close` | `#postgameModal` | `games/journeys.js` postgameClose handler | `games/journeys.css:392` hover only |
| `games/journeys.html` | 95 | `overlay-close` | `#celebrationOverlay` | `games/journeys.js` celebrationClose handler | `games/journeys.css:567` hover only |
| `games/journeys.html` | 136 | `modal-close` | `#helpModal` | `games/journeys.js` helpClose handler | `games/journeys.css:835` hover only |
| `games/journeys.html` | 181 | `modal-close` | `#statsModal` | `games/journeys.js` statsClose handler | `games/journeys.css:835` hover only |
| `games/alternate.html` | 149 | `modal-close` | `#helpModal` | `games/alternate.js` helpClose handler | `games/alternate.css:773` hover only |
| `games/game.html` | 172 | `result-close-btn` | `#resultModal` | `games/game.js` resultCloseBtn handler | `games/game.css:1769` hover only |
| `games/game.html` | 208 | `modal-close` | `#statsModal` | `games/game.js` statsClose handler | `games/game.css:1217` hover only |
| `games/game.html` | 245 | `modal-close` | `#helpModal` | `games/game.js` helpClose handler | `games/game.css:1217` hover only |
| `games/collision.html` | 153 | `result-close-btn` | `#resultModal` | `games/collision.js` resultCloseBtn handler | `games/collision.css:1051` hover only |
| `games/collision.html` | 195 | `modal-close` | `#helpModal` | `games/collision.js` helpClose handler | collision.css modal-close hover |
| `games/collision.html` | 241 | `modal-close` | `#statsModal` | `games/collision.js` statsClose handler | collision.css modal-close hover |
| `games/tenth-star.html` | 155 | `modal-close` | `#helpModal` | `games/tenth-star.js` helpClose handler | `games/tenth-star.css:614` hover only |
| `games/tenth-star.html` | 178 | `modal-close` | `#statsModal` | `games/tenth-star.js` statsClose handler | `games/tenth-star.css:614` hover only |
| `games/tenth-star.html` | 218 | `archive-close-btn` | `#archiveModal` | `games/tenth-star.js` archiveCloseBtn handler | `games/tenth-star.css:880` hover only |
| `games/screenshot.html` | 127 | `result-close-btn` | `#resultModal` | `games/screenshot.js` resultCloseBtn handler | `games/screenshot.css:911` hover only |
| `games/screenshot.html` | 161 | `modal-close` | `#helpModal` | `games/screenshot.js` helpClose handler | `games/screenshot.css:734` hover only |
| `games/screenshot.html` | 215 | `modal-close` | `#statsModal` | `games/screenshot.js` statsClose handler | `games/screenshot.css:734` hover only |
| `games/series.html` | 177 | `modal-close` | `#episodeModal` | `games/series.js:769` `closeModals()` | `games/series.css:1299` hover only |
| `games/series.html` | 203 | `modal-close` | `#castModal` | `games/series.js:769` `closeModals()` | `games/series.css:1299` hover only |
| `games/constellation.html` | 415 | `info-close` | `#infoModal` | `games/constellation.js` infoClose handler | `games/constellation.css:386` hover only |
| `games/constellation.html` | 440 | `preview-close` | `#previewModal` | `games/constellation.js` preview-close handler | none specific |
| `games/sequel-shot.html` | 132 | `result-close-btn` | `#resultModal` | `games/sequel-shot.js` resultCloseBtn handler | `games/sequel-shot.css:747` hover only |
| `games/sequel-shot.html` | 171 | `modal-close` | `#helpModal` | `games/sequel-shot.js` helpClose handler | `games/sequel-shot.css:1001` hover only |
| `games/sequel-shot.html` | 225 | `modal-close` | `#statsModal` | `games/sequel-shot.js` statsClose handler | `games/sequel-shot.css:1001` hover only |
| `games/triple-collision.html` | 175 | `result-close-btn` | `#resultModal` | `games/triple-collision.js` resultCloseBtn handler | `games/triple-collision.css:1151` hover only |
| `games/triple-collision.html` | 217 | `modal-close` | `#helpModal` | `games/triple-collision.js` helpClose handler | `games/triple-collision.css:844` hover only |
| `games/triple-collision.html` | 267 | `modal-close` | `#statsModal` | `games/triple-collision.js` statsClose handler | `games/triple-collision.css:844` hover only |
| `games/mastermind.html` | 159 | `result-close-btn` | `#resultModal` | `games/mastermind.js` resultCloseBtn handler | `games/mastermind.css:898` hover only |
| `games/mastermind.html` | 205 | `modal-close` | `#helpModal` | `games/mastermind.js` helpClose handler | `games/mastermind.css:686` hover only |
| `games/mastermind.html` | 255 | `modal-close` | `#statsModal` | `games/mastermind.js` statsClose handler | `games/mastermind.css:686` hover only |

---

## Grouped by popup type

### Movie Cube (4 close buttons — primary Phase 3 target)

- **Main popup close** — `components/moviecube.js:153` (`.popup-close#cubeCloseBtn`) → handler `closeMovieCube()` at `moviecube.js:589`. Teardown work: sets `cubeOverlay.hidden = true`, restores `document.body.style.overflow`, hides similar/all-cast/trailer sub-overlays.
- **Similar movies sub-modal close** — `moviecube.js:356` (`.modal-close#cubeSimilarClose`) → `closeSimilarPanel()` at L448.
- **Full cast sub-modal close** — `moviecube.js:365` (`.modal-close#cubeAllCastClose`) → `closeAllCast()` at L460.
- **Trailer sub-modal close** — `moviecube.js:378` (`.trailer-close#cubeTrailerClose`) → `closeTrailer()` at L466.
- **ESC + click-outside:** `moviecube.js:389` (overlay click), `moviecube.js:393` (ESC keydown — cascading close: trailer > similar > all-cast > main).
- **Custom teardown to wire to `orbit:close`:** body scroll-lock release, sub-overlay reset (`cubeSimilarOverlay.hidden = true` etc.), face state reset.

### People Cube (1 close button)

- `components/people-cube.js:310` (`.pcube-close#pcubeCloseBtn`) → `closePeopleCube()` at L534.
- **ESC + click-outside:** `people-cube.js:353` (overlay click), `people-cube.js:358` (ESC keydown).
- **Mutual exclusion:** opening this popup closes Movie Cube (`people-cube.js:458`) and vice versa (`moviecube.js:533`).
- **Custom teardown:** `pcubeOverlay.hidden = true`, body scroll-lock release, `pcubePersonData = null`.

### Welcome Popup — TWO COMPETING SYSTEMS ⚠️

Both files exist at repo root and both create separate overlays. This is a cleanup target before/during migration.

- **`welcome-popup.js`** (older, marquee-style):
  - `wp-header-close` button created at L150, handler at L243
  - `wp-footer-close` button created at L210, handler at L248
  - Both call `dismiss(false)` at L231 — fades out via `overlay.classList.remove('visible')`, removes after 420ms
  - Also dismissed by checkbox change (L253), backdrop click (L258), ESC

- **`orbit-welcome.js`** (newer):
  - `orbit-welcome-close` button created at L201, handler at L282
  - Different overlay element (`.orbit-welcome-overlay` in `orbit-welcome.css`)

**Recommendation:** before migrating, decide which one is canonical and delete the other.

### Awards Modals (3 close buttons)

- `pages/awards-browse.html:95` (`.info-panel-close#infoPanelClose`) — info side-panel
- `pages/awards-browse.html:104` (`.modal-close#guideModalClose`) — awards guide modal
- `pages/people-profile.html:272` (`.pp-awards-modal-close#ppAwardsModalClose`) — handler `pages/people-profile.js:1353`. Includes `closeModal` arrow at L1349 with focus restoration logic.

### Shortlist Comparison — NOT LOCATED

Rule 17 names this popup, but `pages/compare.html` is a full-page route, not a popup with a close X. No dedicated close button exists. **Confirm with user during Phase 2.**

### Randomizer Detail — NOT LOCATED AS A POPUP

Rule 17 names this popup, but `pages/randomizer.html` and `pages/tv-randomizer.html` only contain `helpModal` and `historyModal` with `modal-close` X buttons. No "detail" popup exists. **Confirm with user during Phase 2.**

### Awards Portrait Flip — NOT BUTTON-DRIVEN

Rule 17 names this, but the flip is a click-to-toggle tile interaction in `pages/awards-browse.js` (around L753). No close button on the flipped state — clicking the tile again flips back. **Confirm with user.**

### Other / Misc (per-page popups)

| Popup | File | Close button | Handler |
|---|---|---|---|
| Quick Search | `index.html:223` | `.qs-close-btn#qsCloseBtn` (only `aria-label="Close"` in repo) | `quick-search-modal.js:122` → `closeModal()` at L81 |
| Timeline bio / movie popup / trailer / generic modal | `pages/timeline.html` 197/275/296/337 | `bio-close`, `modal-close`, `popup-close`, `trailer-close` | `pages/timeline.js:2629` etc. → `closePopup()` at L2217 |
| Venn bio panel / info / popup / trailer | `pages/venn.html` 116/177/194/227 | `bio-close-right`, `info-close`, `popup-close`, `trailer-close` | `pages/venn.js:1575` → `closePopup()` at L1636 |
| Results filter drawer / bio / inline cap toast | `pages/results.html` 82/177, `pages/results.js:918` | `drawer-close`, `bio-close`, **inline `capped-close`** | inline `this.parentElement.remove()` for the cap toast |
| Results-classic bio | `pages/results-classic.html:191` | `bio-close` | results-classic.js |
| Profile list modal | `pages/profile.html:391` | `list-modal-close` | profile.js |
| Orbit Map detail panel | `pages/orbit-map.html:53` | `panel-close` | orbit-map.js |
| Home: PYO popup, Arc popup | `pages/home.html` 575/600 | `pyo-popup-close`, `arc-close` | home.js |
| Actor Timeline career DNA | `pages/actor-timeline.html:106` | `career-dna-close` | actor-timeline.js |
| TV / Discover / Both — focus panel | `pages/tv.html:273`, `pages/discover.html:144`, `pages/both.html:209` | `focus-close` | per-page focusCloseButton handler |
| Discover more-filters | `pages/discover.html:165` | `more-filters-close` | discover.js |
| Randomizer help / history | `pages/randomizer.html` 505/543 | `modal-close` | `pages/randomizer.js:132,137` → `hideModal()` |
| TV Randomizer help / history | `pages/tv-randomizer.html` 484/522 | `modal-close` | `pages/tv-randomizer.js:171,176` → `hideModal()` |
| People-profile lightbox / awards modal / reorder modal | `pages/people-profile.html` 259/272 + dynamic `pages/people-profile.js:2302` | `pp-lightbox-close`, `pp-awards-modal-close`, `pp-reorder-modal-close` | people-profile.js (multiple handlers) |
| Games (~30 modals across 12 game pages) | `games/*.html` | `modal-close`, `result-close-btn`, `postgame-close`, `overlay-close`, `info-close`, `preview-close`, `archive-close-btn`, `episodeModalClose`, `castModalClose` | per-game JS handlers, mostly `display=none` / `hidden=true` toggles |

---

## Patterns observed

1. **No popup-exit animation exists anywhere.** Every popup currently uses instant hide (`element.hidden = true` or `display: none`) or fade via `classList` toggle. Black Hole exit will be a uniform new behaviour.
2. **Class name fragmentation.** ~20 distinct close-button class names across the codebase (`popup-close`, `modal-close`, `bio-close`, `trailer-close`, `focus-close`, `pcube-close`, `info-close`, `info-panel-close`, `panel-close`, `drawer-close`, `list-modal-close`, `arc-close`, `pyo-popup-close`, `bio-close-right`, `more-filters-close`, `archive-close-btn`, `result-close-btn`, `postgame-close`, `overlay-close`, `preview-close`, `pp-lightbox-close`, `pp-awards-modal-close`, `pp-reorder-modal-close`, `qs-close-btn`, `career-dna-close`, `wp-header-close`, `wp-footer-close`, `orbit-welcome-close`, `capped-close`).
3. **Hover anomaly:** `pages/venn.css:906` rotates `.info-close` 90° on hover — the only site-wide rotation already in place. Aligns conceptually with Black Hole rotation; everywhere else uses `scale(1.1)`.
4. **Inline handler:** `pages/results.js:918` builds a button with `onclick="this.parentElement.remove()"` — the only inline close handler in the codebase. Easy migration target.
5. **Mutual exclusion logic between Movie Cube and People Cube** must be preserved when migrating either to `orbit:close` event listeners.
6. **ESC handlers are bound globally** in moviecube.js and people-cube.js — they will need to call `OrbitClose.close(target)` instead of the bespoke close fns to keep the animation consistent.
7. **Click-outside (overlay) handlers** in moviecube.js, people-cube.js, venn.js, timeline.js, quick-search-modal.js — same migration consideration.
8. **Two welcome systems coexist** (`welcome-popup.js` + `orbit-welcome.js`). Phase 3+ should not migrate both blindly — pick one or remove the other first.
9. **Games subdirectory contains ~30 modal closes**, all following one of three patterns: `modal-close`, `result-close-btn`, `postgame-close`. Could be migrated as a batch.

---

## Suggested Phase 4 migration order (proposal — not authoritative)

1. **Phase 3 (already planned):** Movie Cube — 4 buttons, 1 file. (`components/moviecube.js`)
2. **Batch 1:** People Cube + Quick Search — 2 files. Both are top-level shared popups, similar to Movie Cube.
3. **Batch 2:** Welcome Popup cleanup — pick one of two systems, delete the other, migrate the survivor (1-2 files).
4. **Batch 3:** Awards modals (`awards-browse.html` + `people-profile.html` modals) — 3 buttons.
5. **Batch 4:** Timeline page popups (4 buttons in one file).
6. **Batch 5:** Venn page popups (4 buttons in one file, including the `.info-close` rotate-90 hover that aligns with Black Hole rotation).
7. **Batch 6:** Results / Results-classic / Profile / Orbit-Map / Home / Actor-Timeline (1-2 close buttons each — group by complexity).
8. **Batch 7:** Discover / TV / Both focus-panel popups (shared `focus-close` class — can migrate together).
9. **Batch 8:** Randomizer + TV-Randomizer help/history modals (4 buttons, 2 files).
10. **Batch 9-12:** Games (~30 close buttons across 12 files) — migrate by game, max 3 games per batch per Rule 2.

Total: ~12 batches after Phase 3.

---

## Open questions for the user before Phase 2

1. The **Shortlist Comparison**, **Randomizer Detail**, and **Awards Portrait Flip** popups named in CLAUDE.md Rule 17 do not appear to exist as discrete popup-with-X-button widgets in the current codebase. Should the rule be revised, or are these planned (not-yet-built) popups?
2. **Welcome popup**: which of the two coexisting systems (`welcome-popup.js` vs `orbit-welcome.js`) is canonical?
3. **Inline-handler edge case** at `pages/results.js:918` (the cap toast `capped-close`) — migrate to `orbit:close` pattern, or leave as-is since it's a transient toast not a popup?
4. **Per-card delete X buttons** (e.g. `pages/timeline.js:1492` `.remove-orbit`, `:1701/1752` `.card-delete`, `pages/tv.js:216,604,913`, `pages/discover.js:539+`) are NOT close buttons in the popup sense — they remove inline list items. Excluded from this inventory. Confirm that's right.
