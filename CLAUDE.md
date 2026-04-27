# CLAUDE.md — ORBIT Development Rules

## Core Development Practices

### 1. Approach First, Code Second
Before writing any code, describe the planned approach and wait for Daniel's approval. If requirements are ambiguous, ask clarifying questions before writing any code.

### 2. Small Change Sets
If a task requires changes to more than 3 files, stop and break it into smaller tasks first. Present the breakdown for approval before proceeding.

### 3. Post-Implementation Risk Assessment
After writing code, list what could break and suggest tests to cover it.

### 4. Bug Fix Protocol
When there's a bug, start by writing a test that reproduces it, then fix it until the test passes.

### 5. Living Rulebook
Every time Daniel corrects an error, add a new rule to this CLAUDE.md file so the mistake never happens again.

### 6. File Path Verification
Before referencing any file path in code (CSS links, JS imports, href navigations), verify the actual file structure. No assumptions — check the directory before writing the path. After the directory restructure, shared resources (`variables.css`, `orbit-utils.js`, `orbit-glyphs.css`) live at project root. Pages live in `pages/` or `games/`. Components in `components/`. Data in `data/`. Always use relative paths from the current file's location.

### 7. Don't Touch What You Weren't Asked To
When fixing or adding a feature, don't refactor or "improve" unrelated code in the same files. Scope creep in edits causes mystery regressions.

### 8. localStorage Key Audit
When adding any new localStorage read/write, document the key name, format, and purpose in a comment block. This prevents key collisions and makes debugging state issues faster. Refer to `data/storage-keys.md` for the full key registry before creating new keys.

### 9. API Call Awareness
Before adding new TMDB API calls (especially in loops or on page load), flag the expected call volume. Performance matters — TV integration was scaled back for this exact reason.

### 10. Git Commit Between Steps
For multi-step implementations, commit after each working step before moving to the next. Makes rollback painless if step 3 breaks what step 2 built.

---

## Visual & UI Consistency

### 11. Glyphs Over Emojis
Never use raw emojis in HTML or JavaScript innerHTML strings. Always use the ORBIT Glyph system: `<span class="og og-{name}"></span>`. Reference `orbit-glyphs.css` for available glyphs (58 custom SVG outline icons). The ONLY exception is share/clipboard strings (`navigator.clipboard`, `shareText`, `copyToClipboard`) where plain text emojis are required for social media compatibility. If a needed glyph doesn't exist, flag it for creation — don't fall back to an emoji.

### 12. Use CSS Custom Properties
Never hardcode color values, font families, box-shadows, or border-radius values. Always use the variables defined in `variables.css`. If a new token is needed, add it to `variables.css` first, then reference it. This includes rgba variants — use the variable with opacity where possible (e.g. `rgba(var(--accent-cyan-rgb), 0.3)` not `rgba(0, 217, 255, 0.3)`).

### 13. Use Shared Utilities
For TMDB fetches, localStorage operations, image URL construction, and date/puzzle calculations, use the functions in `orbit-utils.js`. Don't write inline fetch calls or raw `JSON.parse(localStorage.getItem(...))` patterns. If a utility function is missing something you need, extend `orbit-utils.js` rather than writing a one-off in the page script.

### 14. Consistent Naming Conventions
- **CSS classes:** kebab-case (`trivia-stat-pill`, `cube-trivia-stats-bar`)
- **JS functions:** camelCase (`getTriviaStats`, `openMovieCube`)
- **JS constants:** UPPER_SNAKE (`TMDB_API_KEY`, `GAME_DURATION`)
- **localStorage keys:** snake_case with `orbit_` prefix (`orbit_trivia_stats`, `orbit_game_stats`)
- **File names:** lowercase kebab-case (`orbit-utils.js`, `shortlist-badge.css`)
- No exceptions. If existing code doesn't follow this, fix it only when you're already editing that file for another reason (see Rule 7).

### 15. Mobile-First Verification
After implementing any visual change, verify it doesn't break at 650px and 900px breakpoints. If the feature involves a new layout or panel, include responsive rules in the same CSS file — don't leave it for a separate "mobile pass" later.

### 16. Color Coding by Feature Area
Maintain ORBIT's established color language:
- **Cyan** (`--accent-cyan`): Movies, primary interactive elements
- **Amber** (`--tv-accent`): TV content
- **Gold** (`--accent-gold`): Wins, achievements, premium features, comfort list
- **Purple** (`--prestige-purple`): Awards, prestige
- **Orange** (`--collision-orange`): Collision Course game
- **Green** (`--success-green`): Correct answers, matches, positive states
- **Red** (`--danger-red`): Errors, close buttons, negative states

New features should use the appropriate existing color, not introduce new accent colors without discussion.

---

### 17. Shared Close Button Pattern
Every close X button site-wide must use `class="orbit-close"` with the popup wrapper marked `data-orbit-popup`. The shared `orbit-close.js` utility handles the Black Hole exit animation and dispatches an `orbit:close` event for any custom teardown logic.

- Never write a bespoke close-button click handler.
- Never apply custom rotate/fade/scale animations to a close X — Black Hole is the ORBIT default.
- For custom logic on close, listen for `orbit:close` on the popup wrapper.
- For programmatic close (ESC key, click-outside, etc.), call `OrbitClose.close(target)` so the animation stays consistent across all close paths.

Applies to: Movie Cube, People Cube, welcome popup, awards modals, shortlist comparison, randomizer detail, awards portrait flip, and every future popup.

---

## Code Organisation

### 18. Comment Headers on New Sections
When adding a significant new code block to an existing file (50+ lines), add a comment header marking what it is and when it was added:
```js
/* ============================================================
   TRIVIA STATS SERVICE — Added Feb 21, 2026
   Persistent tracking for trivia accuracy, streaks, categories
   ============================================================ */
```
This makes it possible to find and audit additions in large files like `moviecube.js`.

### 19. No Orphan Features
Every new feature must be reachable from the main navigation or an existing page. If you add a new page or panel, verify there's a visible path for users to get to it. If it lives inside MovieCube (like Trivia), document the entry point in the code comment header.

### 20. Navigation Consistency
Every page must have a working back button that returns to the previous page — not hardcoded to `index.html`. Use `history.back()` or smart detection of the referring page. New pages must include standard nav elements before implementation is considered complete.

### 21. Test After Every Navigation Change
If you modify any `window.location.href`, `history.pushState`, or link `href` value, manually verify the full click path: source page → destination → back button. Navigation bugs are the most common user-facing issue in ORBIT.

---

## Data & Content

### 22. Data File Changes Need a Note
If you modify any JSON data file, seed file, or awards database, leave a dated note in the commit message describing what changed and why. Data regressions are the hardest bugs to trace.

### 23. Respect the Cosmic Theme
All user-facing text should maintain ORBIT's space/cinema vocabulary where natural. Use terms like "orbit", "constellation", "nebula", "stellar" in feature names and UI labels. Don't force it into instructional text or error messages where clarity matters more than theme.

### 24. Cinema First, TV Minimal
ORBIT is a cinema-focused platform. TV functionality exists in simplified form on actor timelines only. Do not expand TV integration into new features without explicit discussion. Quick Search, Venn, and all games are movies-only.

### 25. Content Origin Awareness
When adding new data sources (AI-generated reviews, trivia questions, enriched metadata), track the origin. Include a `source` or `generated_by` field where practical. This matters for potential future API monetisation of original content.

---

## Performance & Security

### 26. API Key Discipline
Never include API keys in documentation files, console.log statements, or comments. The TMDB key lives in `config.js` only. When adding new API integrations, follow the same pattern — single source of truth, excluded from version control documentation.

### 27. Lazy Load Heavy Data
Data files over 100KB (Nebula data, movie settings, awards databases) should be loaded on demand, not on page load. Use `fetch()` when the user navigates to the feature that needs the data, not as a global script tag.

### 28. Cache Expensive API Results
When making TMDB API calls that return data unlikely to change (movie details, person credits), cache results in `sessionStorage` with a TTL. Don't re-fetch the same movie details every time a user opens the MovieCube for the same film in one session.

---

## Correction Log
<!-- 
Add new rules below as corrections arise.
Format: Date | What went wrong | Rule added/updated
-->
