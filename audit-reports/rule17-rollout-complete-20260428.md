# Rule 17 Rollout — Complete

**Date:** 2026-04-28
**Status:** ✅ All popups migrated. Zero un-migrated close buttons remain.

This file supersedes `close-button-inventory-20260427.md` and updates Rule 17 status in `claude-md-compliance-20260427.md`.

## Summary

The shared close-button utility (`orbit-close.css` + `orbit-close.js`) has been rolled out across the entire codebase. Every popup-corner X now plays the Black Hole spiral on click and the popup performs a coordinated fade/scale exit, with a 200 ms reduced-motion fallback.

- **Total close buttons migrated:** 71 across 32 source files (matching the original Phase 1 inventory).
- **Visual unification:** every X is now a 32×32 borderless ✕, ghost-gray default, white on hover, spirals red on close.
- **Architecture:**
  - Standalone pages with their own JS handlers carry an inline `triggerOrbitClose(overlay, btn, teardown)` helper.
  - Games rely on the shared `orbit-close.js` document-click delegate (loaded via `<script defer>`); the delegate fires the spiral, dispatches `orbit:close`, then sets `popup.hidden = true`.
- **Repo cleanup:** `orbit-welcome.js` + `orbit-welcome.css` deleted (orphan, second welcome system).
- **Behavioural exception:** mutual-exclusion calls (e.g. People Cube closing Movie Cube) and CTA buttons inside modals (e.g. "Add to orbit", "Done") still snap-close instantly, by design.

## Wave-by-wave log

| Wave | Scope | Files | Outcome |
|---|---|---|---|
| 1 | Cleanup | 6 | Deleted `orbit-welcome.{js,css}`; gutted legacy `.popup-close` red-circle styling in venn / timeline / results / results-classic. |
| 2 | Movie Cube | 1 | First migration — established the pattern. |
| 3a | People Cube + Quick Search | 3 | Top-level shared popups. |
| 3b | Welcome Popup | 1 | `welcome-popup.js` migrated; `orbit-welcome.*` removed. |
| 4a | Timeline | 3 | Bio panel, popup, trailer, modal. |
| 4b | Venn | 3 | Bio-right panel, info panel, popup, trailer. |
| 4c | Results + Results-classic | 5 | Drawer, bio panel, inline cap toast. |
| 5 | Profile / Orbit-Map / Home / Actor-Timeline | 11 | List modal, location panel, PYO/Arc popups, Career DNA. |
| 6 | Discover / TV / Both | 7 | Focus card (shared), more-filters modal. |
| 7 | Awards modals | 6 | Info panel, guide modal, lightbox, awards modal, reorder modal. |
| 8 | Randomizer + TV-Randomizer | 6 | Help + history modals (mirror pattern). |
| 9–11 | Games | 25 | 12 game pages, ~33 close buttons, all delegated through `orbit-close.js`. |
| 12 | Movie Cube sub-modals | 2 | Similar / All Cast / Trailer modals (deferred from Wave 2). |

**Total files touched: ≈79**

## Pages that load `orbit-close.css`

Direct `<link>` (per page):
`index.html`, `pages/timeline.html`, `pages/venn.html`, `pages/results.html`, `pages/results-classic.html`, `pages/profile.html`, `pages/orbit-map.html`, `pages/home.html`, `pages/actor-timeline.html`, `pages/discover.html`, `pages/tv.html`, `pages/both.html`, `pages/awards-browse.html`, `pages/people-profile.html`, `pages/randomizer.html`, `pages/tv-randomizer.html`, plus all 12 `games/*.html`.

Auto-loaded by `welcome-popup.js` (covers any page that uses the welcome system).
Auto-loaded by `components/moviecube.js` and `components/people-cube.js` (covers any page using the cube components).

## Pages that load `orbit-close.js`

Only the 12 game pages currently load the shared script. All other pages have their own bespoke `triggerOrbitClose` helper and don't need it. The script is harmless if loaded (idempotent IIFE).

## Behavioural notes for future maintainers

1. **Don't add `class="orbit-close"` without `data-orbit-popup`** on the wrapper. The animation needs both.
2. **For new popups, prefer the shared script + delegate pattern** over copy-pasted `triggerOrbitClose` helpers. Add `<script defer src="../orbit-close.js" data-orbit-close></script>`.
3. **For popups that use class-toggles** (`.expanded`, `.open`) instead of the `hidden` attribute, listen for `orbit:close` on the wrapper, call `e.preventDefault()`, and run your bespoke teardown.
4. **For popups with cleanup beyond hide** (e.g. clearing iframes, releasing scroll lock, resetting state), wire the cleanup to `orbit:close` (after the spiral) rather than to the click handler (before).
5. **Legacy positioning classes are kept** alongside `orbit-close` (e.g. `class="popup-close orbit-close"`) because the legacy class still provides absolute positioning specific to each popup's layout. The visual styling within those legacy classes has been gutted to positioning-only.
6. **Reduced motion:** the utility detects `prefers-reduced-motion: reduce` and collapses to a 200 ms fade with a red flash. Don't override this manually.

## Three Rule 17 popups still un-implemented (future work)

CLAUDE.md Rule 17 names these popups, but they don't exist as discrete popup-with-X widgets in the current codebase:

- **Shortlist Comparison** — `pages/compare.html` is a full-page route, not a popup.
- **Randomizer Detail** — only help/history modals exist; no per-result detail popup.
- **Awards Portrait Flip** — flip is a click-to-toggle tile interaction in `pages/awards-browse.js`, not a button-driven close.

When/if these get built, they should adopt the orbit-close pattern from day one.
