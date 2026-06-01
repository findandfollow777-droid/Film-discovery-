# ORBIT UI PATTERNS
## The Definitive Visual Style Guide

**Version:** 1.1.2 · base from May 3, 2026, Discovery redesign added May 31, 2026, reconciled to the Phase 0b-1 + 0b-2 builds May 31, 2026
**Purpose:** Lock down the exact visual specifications for ORBIT's UI. Every measurement, every color, every animation timing defined here.

> **v1.1 note:** v1.1 adds the Discovery Redesign Components (Part B1) and the per-tab redesign spec (Part B2). Part A is the original v1.0 base, restored to the repo (it had existed only as external reference).
>
> **v1.1.1 note (2026-05-31):** B1 §§1–5 and §2 reconciled to the as-built core controls in `components/discover-components.css` (Phase 0b-1). The code is the source of truth; these example selectors and values now match it exactly — slider/histogram/dial class names, the chip default border + `:hover`, the bare `[data-axis]` axis selector, the dial `.dial-knob` handle, and the `#cyanGold` SVG `<defs>` requirement.
>
> **v1.1.2 note (2026-05-31):** B1 §§7, §10, §11 reconciled to the as-built shell components in `components/discover-components.css` (Phase 0b-2 + the namespacing fix-up). Tiles are namespaced `.disco-tile*` (collision with existing `.tile`/`.tile-meta`), the service-toggle on-state is `.service-tile.is-on`, and the search dropdown uses `.tts-*` with `[data-type]` tags. The role-glow is tokenised (no literal hex), and the dropdown is documented as a CSS shell (open/dismiss/scroll JS deferred to the consuming tab).

---

## 🎯 DESIGN PHILOSOPHY

**Cinema-first density:** Maximize information without clutter. Think movie poster wall, not enterprise dashboard.
**Theatrical boldness:** Headers command attention. Body text is readable, never timid.
**Cosmic signature:** Cyan/gold/purple aren't decorative — they're the brand extended across every pixel.
**Smooth motion:** Everything flows. No jarring snaps, no instant state changes.
**Star the hero:** Focal points dominate. Everything else supports.

---

## 📐 LAYOUT GRID

### Container Widths
```css
--max-content-width: 1400px;
--panel-max-width: 900px;
--popup-max-width: 600px;
--card-max-width: 320px;
```

### Spacing Scale (LOCKED — use nothing else)
```css
--space-xs: 8px;   /* Between tight elements */
--space-sm: 12px;  /* Default element spacing */
--space-md: 16px;  /* Panel padding, section gaps */
--space-lg: 24px;  /* Major section breaks */
--space-xl: 32px;  /* Page-level spacing only */
```

### Golden Rules
- **Panel padding:** 16px maximum (never 24px, never 32px)
- **Between elements:** 12px default (8px if very tight, 16px if breathing room needed)
- **Empty zones:** Never exceed 48px without content
- **Cards:** Tight to content — let borders define edges, not white space

---

## 📝 TYPOGRAPHY

### Font Stack
```css
--font-display: 'Orbitron', sans-serif;  /* Headers, numbers, UI labels */
--font-body: 'Barlow', sans-serif;       /* Paragraphs, descriptions */
```

### Type Scale (LOCKED)
```css
/* Display */
--text-hero: 48px;      /* Landing page headlines */
--text-h1: 32px;        /* Page titles */
--text-h2: 24px;        /* Section headers */
--text-h3: 20px;        /* Subsection headers */

/* Body */
--text-body-lg: 18px;   /* Emphasis paragraphs */
--text-body: 16px;      /* Default body text (MINIMUM for readability) */
--text-caption: 14px;   /* Small metadata */
--text-label: 12px;     /* Tiny labels (uppercase with tracking) */
```

### Weight Distribution
```css
/* Orbitron (Headers) */
--weight-display: 700;  /* Hero text */
--weight-h1: 600;       /* Page/section titles */
--weight-h2: 600;       /* Subsections */
--weight-h3: 500;       /* Tertiary headers */

/* Barlow (Body) */
--weight-body: 400;     /* Default paragraphs */
--weight-emphasis: 500; /* Highlighted text */
--weight-label: 500;    /* Small caps labels */
```

### Typography Rules
- **Never use system fonts** — Orbitron and Barlow only
- **Body text minimum:** 16px (14px is too small, kills readability)
- **Headers minimum:** 24px (smaller feels weak)
- **Line height:** 1.6 for body, 1.2 for headers
- **Letter spacing:** 0.05em for uppercase labels, normal elsewhere

### Anti-Patterns
❌ Body text at 14px or below
❌ Headers under 20px
❌ Default to Arial/Helvetica
❌ Tight line-height (body needs 1.6)

---

## 🎨 COLOR APPLICATION

### Brand Palette (from variables.css)
```css
/* Backgrounds */
--space-black: #000000;
--deep-void: #0a0e17;
--nebula-dark: #111827;
--cosmic-blue: #1e293b;

/* Accents */
--accent-cyan: #00d9ff;
--accent-gold: #ffd700;
--prestige-purple: #a855f7;
--collision-orange: #ff6b35;

/* Text */
--film-white: #f1f5f9;
--muted-silver: #94a3b8;
--ghost-gray: #64748b;

/* Feedback */
--success-green: #10b981;
--warning-orange: #f59e0b;
--danger-red: #ef4444;
```

### Color Hierarchy Rules

**Text:**
- Primary content: `--film-white` (#f1f5f9)
- Secondary content: `--muted-silver` (#94a3b8)
- Tertiary/disabled: `--ghost-gray` (#64748b)
- **Accent headers:** `--accent-cyan` for feature headers, `--prestige-purple` for awards content
- **Large text blocks:** Use accent colors generously — not just white/gray

**Borders:**
- Default: `rgba(0, 217, 255, 0.25)` (cyan at 25%)
- Hover: `rgba(0, 217, 255, 0.6)` (cyan at 60%)
- Awards context: `rgba(168, 85, 247, 0.25)` (purple at 25%)
- Active/selected: Full opacity accent color

**Backgrounds:**
- Panels: `rgba(10, 14, 26, 0.98)` (deep-void with slight transparency)
- Cards: `rgba(17, 24, 39, 0.95)` (nebula-dark)
- Overlays: `rgba(0, 0, 0, 0.85)` (space-black transparent)

**Glows (Box Shadow):**
```css
/* Subtle state */
box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);

/* Hover state */
box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);

/* Active/selected */
box-shadow: 0 0 40px rgba(0, 217, 255, 0.6);
```

### Brand Extension Rule
**Every page must feel like ORBIT.** Cyan/gold/purple aren't decorative — they define the identity. If a page feels monochrome/corporate, it's wrong.

### Anti-Patterns
❌ Flat gray borders without glow
❌ Body text all white/gray (no accent color anywhere)
❌ Buttons without hover glow
❌ Pages that look like enterprise SaaS dashboards

---

## 🧩 COMPONENT SPECIFICATIONS

### Cards (Movie/Person Tiles)

**Dimensions:**
```css
width: 185px;              /* Poster standard */
border-radius: 14px;
padding: 0;                /* Image fills edge-to-edge */
```

**Structure:**
```html
<div class="card">
  <img class="card-image" />     <!-- Full bleed -->
  <div class="card-content">      <!-- 12px padding -->
    <h3 class="card-title">       <!-- 16px Barlow 500 -->
    <p class="card-meta">         <!-- 14px Barlow 400, muted-silver -->
  </div>
</div>
```

**Styling:**
```css
.card {
  background: var(--nebula-dark);
  border: 2px solid rgba(0, 217, 255, 0.25);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease-out;
}

.card:hover {
  border-color: rgba(0, 217, 255, 0.6);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
  transform: translateY(-4px);
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--film-white);
  margin-bottom: 4px;
}

.card-meta {
  font-size: 14px;
  color: var(--muted-silver);
}
```

---

### Panels (Info Containers)

**Dimensions:**
```css
max-width: 900px;          /* Readable line length */
padding: 16px;             /* LOCKED — never more */
border-radius: 14px;
```

**Styling:**
```css
.panel {
  background: rgba(10, 14, 26, 0.98);
  border: 2px solid rgba(0, 217, 255, 0.25);
  border-radius: 14px;
  padding: 16px;            /* Maximum allowed */
  backdrop-filter: blur(10px);
}

.panel-header {
  font-size: 24px;          /* Orbitron 600 */
  color: var(--accent-cyan);
  margin-bottom: 16px;
}

.panel-body {
  font-size: 16px;          /* Barlow 400 */
  line-height: 1.6;
  color: var(--film-white);
}
```

**Spacing Inside Panels:**
- Header to content: 16px
- Between paragraphs: 12px
- Between sections: 24px
- To panel edge: 16px (locked)

---

### Buttons

**Sizes:**
```css
/* Primary action */
height: 48px;
padding: 0 24px;
font-size: 16px;
font-weight: 500;

/* Secondary action */
height: 40px;
padding: 0 20px;
font-size: 14px;

/* Small/tertiary */
height: 32px;
padding: 0 16px;
font-size: 13px;
```

**Styling:**
```css
.btn-primary {
  background: var(--accent-cyan);
  color: var(--space-black);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.btn-primary:hover {
  background: var(--accent-gold);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: scale(1.02);
}

.btn-secondary {
  background: transparent;
  color: var(--accent-cyan);
  border: 2px solid var(--accent-cyan);
  border-radius: 8px;
  transition: all 0.3s ease-out;
}

.btn-secondary:hover {
  background: rgba(0, 217, 255, 0.1);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}
```

---

### Popups / Modals

**Dimensions:**
```css
max-width: 600px;
max-height: 80vh;
padding: 24px;             /* Exception: popups get more breathing room */
border-radius: 14px;
```

**Overlay:**
```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  transition: opacity 0.3s ease-out;
}
```

**Content:**
```css
.modal-content {
  background: var(--deep-void);
  border: 2px solid rgba(0, 217, 255, 0.4);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Close Button:**
```css
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--prestige-purple);
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

.modal-close:hover {
  background: var(--danger-red);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
  transform: rotate(90deg);
}
```

---

### Person/Actor Portraits

**CRITICAL:** Portraits are the star. Make them unavoidable.

**Dimensions:**
```css
/* In grid/browse views */
width: 160px;
height: 240px;
border-radius: 12px;

/* In popups/detail views */
width: 240px;
height: 360px;
border-radius: 14px;
```

**Styling:**
```css
.portrait {
  border: 3px solid rgba(0, 217, 255, 0.4);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-out;
}

.portrait:hover {
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  transform: scale(1.05);
}

.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**Layout Rule:** Portrait should be centered and given visual priority. Metadata goes underneath, never competing for attention.

---

### Input Fields

**Dimensions:**
```css
height: 48px;
padding: 0 16px;
border-radius: 8px;
font-size: 16px;
```

**Styling:**
```css
.input {
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(0, 217, 255, 0.3);
  color: var(--film-white);
  font-family: var(--font-body);
  font-size: 16px;
  transition: all 0.3s ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}

.input::placeholder {
  color: var(--ghost-gray);
}
```

---

## 🎬 ANIMATION LIBRARY

### Standard Transitions
```css
/* Default for most interactions */
transition: all 0.3s ease-out;

/* Fast/snappy (small UI elements) */
transition: all 0.2s ease-out;

/* Slow/dramatic (page transitions) */
transition: all 0.5s ease-out;
```

### Hover States
**NEVER instant state changes.** Always transition.

```css
/* Standard hover */
.element:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
  transition: all 0.3s ease-out;
}

/* Glow intensify */
.element:hover {
  border-color: rgba(0, 217, 255, 0.8);
  box-shadow: 0 0 40px rgba(0, 217, 255, 0.6);
}

/* Scale (subtle) */
.element:hover {
  transform: scale(1.02);
}
```

### Page Entrance
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.page-content {
  animation: fadeIn 0.5s ease-out;
}
```

### Loading States
```css
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Modal/Popup Entrance
```css
/* Slide up from bottom */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: slideUp 0.3s ease-out;
}
```

### Anti-Patterns
❌ Instant opacity changes (0 → 1 with no transition)
❌ Hard snaps between states
❌ Overly bouncy animations (elastic easing)
❌ Animation durations under 0.2s (feels janky)

---

## 🌌 BACKGROUND EFFECTS

### Film Grain (Global)
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,...'); /* SVG noise pattern */
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

### Vignette (Global)
```css
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
  z-index: 9998;
}
```

### Subtle Particles (Optional)
```css
/* Floating cosmic dust */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(0, 217, 255, 0.3);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}
```

### Radial Gradients (Section Accents)
```css
.section-cosmic {
  background: radial-gradient(
    ellipse at top,
    rgba(0, 217, 255, 0.1) 0%,
    transparent 50%
  );
}
```

### Anti-Patterns
❌ Over-the-top effects (shooting stars, lens flares everywhere)
❌ Distracting motion (particles moving too fast)
❌ Bright gradients (should be subtle hints, not dominant)

---

## 🚫 ANTI-PATTERN CHECKLIST

Before shipping any UI, verify none of these are present:

**Spacing:**
- [ ] Panel padding over 16px
- [ ] Empty zones over 48px
- [ ] Elements spaced with random pixel values (not on the 8/12/16/24/32 scale)

**Typography:**
- [ ] Body text under 16px
- [ ] Headers under 20px
- [ ] System fonts used anywhere
- [ ] Line-height under 1.4 for body text

**Color:**
- [ ] Flat borders without glow
- [ ] All text white/gray (no accent colors)
- [ ] Generic gray backgrounds (not using ORBIT palette)
- [ ] Page feels monochrome/corporate

**Animation:**
- [ ] Instant state changes (no transitions)
- [ ] Durations under 0.2s
- [ ] Bouncy/elastic easing (keep it smooth)

**Visual Hierarchy:**
- [ ] Focal point (portrait/poster) isn't dominant
- [ ] Everything equal weight (no clear priority)
- [ ] Metadata competing with hero content

**General:**
- [ ] Emojis instead of glyphs
- [ ] Hardcoded hex values (should use CSS custom properties)
- [ ] Inconsistent border-radius (should be 8px/12px/14px only)

---

## 📊 BEFORE/AFTER REFERENCE

### Person Popup — BEFORE (What Code Gave)
**Problems:**
- Portrait: 200px × 300px (too small, lost in space)
- Padding: 32px (excessive, wastes screen real estate)
- Font: 14px body text (too small)
- Layout: Portrait centered with massive padding around it
- Empty space: 80px below awards (dead zone)

### Person Popup — AFTER (Target)
**Fixes:**
- Portrait: 240px × 360px (star of the show)
- Padding: 16px (tight, purposeful)
- Font: 16px body, 24px headers
- Layout: Portrait top-center, metadata tucked below
- No dead zones: Content flows to edges

---

## 🎯 ORBIT CHECKLIST

Use this for every component:

**Does it feel like ORBIT?**
- [ ] Cyan/gold/purple brand colors present
- [ ] Cosmic background effects active
- [ ] Orbitron headers, Barlow body
- [ ] Glowing borders on interactives
- [ ] Smooth transitions (nothing snaps)

**Is it information-dense?**
- [ ] No excessive padding
- [ ] No dead zones over 48px
- [ ] Content flows to edges

**Is the hierarchy clear?**
- [ ] Hero element dominates
- [ ] Supporting elements recede
- [ ] Eye travels where intended

**Is it accessible?**
- [ ] Text minimum 16px
- [ ] Touch targets 44px+
- [ ] Sufficient contrast (AA minimum)

---

## 🔧 IMPLEMENTATION NOTES

### For Claude Code Prompts

When writing prompts for Code, include:

1. **Reference this document:** "Follow spacing, typography, and component specs in `ORBIT-UI-PATTERNS.md` at the project root"
2. **Call out specific sections:** "Use the Panel specifications from the UI patterns guide"
3. **Link approved mockups:** "Match the layout in the approved mockup exactly"
4. **State anti-patterns to avoid:** "No padding over 16px, no body text under 16px"

### For Mockup Creation

When building preview mockups:

1. Use exact specs from this guide
2. Copy/paste CSS from Component Specifications
3. Verify against Anti-Pattern Checklist
4. Get Daniel's approval before writing Code prompt

---

## 🎨 DANIEL'S TASTE CALIBRATION

Based on visual mockup comparisons (May 3, 2026), these are Daniel's confirmed preferences:

### Information Density
**Preference:** Packed (cinema poster wall), not spacious (enterprise dashboard)
- Bright accent colors reduce perceived clutter
- Dead space is the enemy
- But: not overloaded — there's a sweet spot between "too much info" and "wasted space"

### Typography Treatment
**Preference:** Conservative sizing + Theatrical brightness
- Don't go massive (32px) on every header
- DO use bold accent colors (cyan/gold/purple)
- DO use uppercase + letter-spacing for labels
- Example: `AWARDS` at 18px uppercase + cyan + tracked reads stronger than plain "Awards" at 24px
- Middle ground between theatrical scale and corporate restraint

### Color Application
**Preference:** Brand-forward boldness, ORBIT palette only
- Never white text on colored backgrounds — use cyan/gold/purple
- Subdued overall scheme (not everything maxed out)
- But: accent colors used confidently where they belong
- "Bolder" wins, but within the established palette

### Visual Hierarchy
**Preference:** Big poster/portrait where viable, info on hover
- Let the image sell the story
- Text below when necessary
- Hover-reveal preferred for metadata
- "We can't do text below poster every time" — use hover overlays

### Animation & Interaction
**Preference:** Smooth (cinematic flow), full commitment
- "If something is going to light up, may as well play into it"
- 0.3s ease-out minimum
- Glow on hover (no timid half-states)
- "Less glitchy, easier to see where you are"

### Background Treatment
**Preference:** Cosmic (space theme) — "100%"
- Purple/cyan glow accents essential
- Brightness matters (not dark/dated 1960s sci-fi)
- Radial gradients, subtle particles
- "Not starry background every time" — but atmospheric touches are brand DNA
- Must feel modern

---

**END OF STYLE GUIDE**

*This is a living document. Update when patterns emerge or exceptions are needed.*

---
---

# 🛰️ PART B — DISCOVERY REDESIGN SYSTEM

> **Added v1.1 (May 31, 2026).** Part B specifies the Discovery page's two-tier filter
> redesign: a compact panel of the most pertinent controls plus an EXPANDED tier (revealed
> when an upper page section is collapsed) that surfaces secondary/power-user controls.
> **B1** is the stable component + transition reference (write to spec). **B2** is the
> volatile per-tab build-plan (expect revision during builds).

---

## 🧩 B1 — DISCOVERY REDESIGN COMPONENTS

Same format as the base Component Specifications (dimensions → structure → styling →
anti-patterns). Each component carries a **confidence label**:
- **Reconciled to Design** — values reconciled against Design's `orbit-theme.css`.
- **Built on locked chip** — inherits the locked filter-chip spec unchanged.
- **Originated — provisional** — originated by us, no Design pedigree; provisional.
- *(plus as-built / new-content notes where they apply)*

> **Per-panel axis variables.** Several components below tint to a per-tab axis colour via
> two CSS custom properties set on the tab panel: `--axis` (an `r, g, b` triple) and
> `--axis-hex` (the solid colour). See **B1 §2** for the mechanism and mapping.

---

### 1. Filter chip / axis-chip — **Reconciled to Design**

**Dimensions:**
```css
border-radius: 999px;      /* pill — never rounded-rect */
padding: 7px 12px;
font: 12.5px var(--font-body);   /* Barlow */
gap: 6px;                  /* glyph/dot ↔ label ↔ count */
```

**Structure:**
```html
<button class="chip on" >          <!-- states: (default) / :hover / .on / .on.gold / .is-dormant -->
  <span class="dot"></span>         <!-- optional, 6px, currentColor -->
  Drama                             <!-- bare label text (no .chip-label wrapper) -->
  <span class="chip-count">128</span>   <!-- Orbitron, opacity 0.55 -->
</button>
```

**Styling** *(as built — `components/discover-components.css`):*
```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;                       /* pill — never rounded-rect */
  font: 12.5px var(--font-body);              /* Barlow */
  color: var(--axis-hex);                     /* text reads in the axis colour */
  background: transparent;
  border: 1px solid rgba(var(--axis), 0.25);  /* default — Part A border convention, axis-tinted */
  cursor: pointer;
  transition: background-color 0.3s ease-out,
              border-color 0.3s ease-out,
              box-shadow 0.3s ease-out,
              opacity 0.3s ease-out;
}
.chip:hover {
  border-color: rgba(var(--axis), 0.5);
  background: rgba(var(--axis), 0.08);
}
.chip.on {
  /* selected — text STAYS axis-coloured, NOT dark */
  background: linear-gradient(180deg, rgba(var(--axis), 0.18), rgba(var(--axis), 0.06));
  box-shadow: inset 0 0 12px rgba(var(--axis), 0.15);
  border-color: rgba(var(--axis), 0.45);
  color: var(--axis-hex);
}
.chip.on.gold {                               /* BAFTA + Golden Globe — gold, not axis */
  background: linear-gradient(180deg, rgba(var(--accent-gold-rgb), 0.18), rgba(var(--accent-gold-rgb), 0.06));
  box-shadow: inset 0 0 12px rgba(var(--accent-gold-rgb), 0.15);
  border-color: rgba(var(--accent-gold-rgb), 0.45);
  color: var(--accent-gold);
}
.chip.is-dormant { opacity: 0.4; cursor: default; }   /* designed-but-disabled / awaiting data */
.chip .chip-count { font-family: var(--font-display); opacity: 0.55; }
.chip .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
```

> **Default border + hover (added v1.1.1):** B1 §1 originally left the default border and
> `:hover` unspecified; the Phase 0b-1 build filled them from Part A's border convention,
> axis-tinted — default `1px solid rgba(var(--axis), 0.25)` on a transparent background,
> hover `rgba(var(--axis), 0.5)` border + faint `rgba(var(--axis), 0.08)` fill. `.on` also
> sets a `rgba(var(--axis), 0.45)` border for edge definition (gold equivalent for `.on.gold`).

**States:** default · `:hover` · selected `.on` · selected-gold `.on.gold` (BAFTA + Golden
Globe) · dormant `.is-dormant` (opacity 0.4).

**Anti-patterns:**
❌ Rounded-rectangle instead of a pill
❌ Solid fill + dark text on selected (text must stay axis-coloured)
❌ Forgetting the `.gold` variant for BAFTA / Golden Globe
❌ Hardcoded axis hex instead of `var(--axis-hex)` / `rgba(var(--axis), …)`
❌ Counts set in Barlow (counts are Orbitron)

---

### 2. Axis-colour mapping — **New content** (an addition; the base doc predates this — not a correction)

**Mechanism:** `--axis` (an `r, g, b` triple for `rgba()`) and `--axis-hex` (solid colour)
are set on **any container carrying `data-axis="…"`** (a tab panel, a sub-section, even a
preview cell — controls inherit from the nearest such ancestor). Chips, active rail tabs,
badges, and glyphs read from these.

**Structure** *(as built — bare `[data-axis]` attribute selector, not `.tab-panel`-scoped):*
```css
[data-axis="genre"]      { --axis: var(--prestige-purple-rgb); --axis-hex: var(--prestige-purple); }
[data-axis="people"]     { --axis: var(--accent-cyan-rgb);     --axis-hex: var(--accent-cyan); }
[data-axis="awards"]     { --axis: var(--accent-gold-rgb);     --axis-hex: var(--accent-gold); }
[data-axis="region"],
[data-axis="setting"]    { --axis: var(--emerald-rgb);          --axis-hex: var(--emerald); }    /* shared */
[data-axis="stream"]     { --axis: var(--collision-orange-rgb); --axis-hex: var(--collision-orange); }
[data-axis="era"],
[data-axis="source"]     { --axis: var(--indigo-rgb);           --axis-hex: var(--indigo); }     /* shared */
[data-axis="ratings"],
[data-axis="production"] { --axis: var(--rose-rgb);             --axis-hex: var(--rose); }       /* shared */
[data-axis="themes"]     { --axis: var(--teal-rgb);             --axis-hex: var(--teal); }
```
> **Convention (v1.1.1):** controls must live inside a `[data-axis]` container or `--axis`
> is undefined. The bare selector is a deliberate superset of the original `.tab-panel`
> scoping so any container can establish an axis.

**Mapping (full table):**

| Tab(s) | Axis colour |
|---|---|
| Genre | purple |
| People | cyan |
| Awards | gold |
| Region + Setting (shared) | emerald |
| Stream | orange |
| Era + Source (shared) | indigo |
| Ratings + Production (shared) | rose |
| Themes | teal |

**Principle:** chips, active rail tabs, badges, and glyphs **tint to the axis**; **sliders
do NOT** — slider fill is always cyan→gold, a deliberate constant thread (see §3, §4).
Colour signals the *family*; glyph + label signal the *specific* tab.

**Dependency:** requires `-rgb` sibling tokens for every axis colour in `variables.css`
(see the fenced foundation list at the end of B2).

**Anti-patterns:**
❌ Tinting sliders to the axis
❌ Relying on colour alone to distinguish two tabs that share an axis (always pair with glyph + label)
❌ Hardcoding the axis colour per element instead of inheriting `--axis` from the panel

---

### 3. Dual-slider — **Reconciled to Design**

**Dimensions:**
```css
--track-height: 4px;
--knob-size: 14px;
--control-height: 28px;
```

**Styling** *(as built — container class is `.slider`; `.fill` / `.knob` positions are
data-driven, set inline by the consuming tab):*
```css
.slider { position: relative; width: 100%; height: 28px; }   /* control-height */
.slider .track {
  position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%);
  height: 4px; border-radius: 999px;
  background: rgba(var(--accent-cyan-rgb), 0.12);
}
.slider .fill  {
  position: absolute; top: 50%; transform: translateY(-50%);
  height: 4px; border-radius: 999px;
  /* ALWAYS cyan→gold — never axis-tinted. Pure CSS gradient (no SVG def needed). */
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-gold));
}
.slider .knob {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--space-black);
  border: 2px solid var(--accent-cyan);
  cursor: pointer;
  transition: box-shadow 0.2s ease-out;
}
.slider .knob:hover { box-shadow: 0 0 12px rgba(var(--accent-cyan-rgb), 0.5); }
```

> **cyan→gold source (v1.1.1):** the **slider** fill is a plain CSS `linear-gradient` — it
> needs **no** SVG `<defs>`. (The **dial** arc in §4 is the one that uses the SVG
> `#cyanGold` gradient and does require a `<defs>` block.)

**Anti-patterns:**
❌ Axis-tinting the fill (fill is the constant cyan→gold thread)
❌ Thicker track or larger knob than 4px / 14px
❌ No hover glow on the knob

---

### 4. Score dial — **Originated — provisional** (Ratings never went to Design)

**Dimensions:**
```css
--dial-size: 120px;   /* 120–130px ring */
--dial-stroke: 6px;
```

**Structure** *(as built — SVG ring with a `.dial-knob` handle at the arc end; the
`#cyanGold` `<defs>` must be present in the host markup):*
```html
<div class="score-dial" role="slider" aria-valuemin="0" aria-valuemax="10" aria-valuenow="7.5">
  <svg viewBox="0 0 120 120" aria-hidden="true">
    <circle class="dial-track" cx="60" cy="60" r="54"></circle>
    <circle class="dial-fill"  cx="60" cy="60" r="54"
            stroke-dasharray="339.29" stroke-dashoffset="84.82"></circle>  <!-- offset = 2πr × (1 − value/max) -->
    <circle class="dial-knob"  cx="60" cy="6" r="7"></circle>               <!-- handle at the arc end -->
  </svg>
  <span class="dial-readout">7.5</span>   <!-- NUMBER ONLY, centred in the ring -->
</div>
<span class="score-caption">Minimum score</span>   <!-- caption BENEATH the whole control -->
```

**Styling** *(as built — `components/discover-components.css`):*
```css
.score-dial { position: relative; width: 120px; height: 120px; }   /* 120–130px */
.score-dial svg { width: 100%; height: 100%; transform: rotate(-90deg); }  /* arc starts at 12 o'clock */
.score-dial .dial-track { fill: none; stroke: rgba(var(--accent-cyan-rgb), 0.12); stroke-width: 6; }
.score-dial .dial-fill  {
  fill: none;
  stroke: url(#cyanGold);                  /* cyan→gold — range-family constant, NOT axis */
  stroke-width: 6; stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease-out;
}
.score-dial .dial-knob  {                  /* draggable handle at the arc end */
  fill: var(--space-black);
  stroke: var(--accent-cyan); stroke-width: 2;
}
.score-dial .dial-readout {                /* NUMBER ONLY, centred in the ring */
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);        /* Orbitron */
  font-size: 32px; color: var(--accent-gold);
}
.score-caption {                           /* label lives BENEATH the control */
  display: block; text-align: center;
  font: 12px var(--font-body); color: var(--muted-silver); margin-top: 8px;
}
```

- **Min-only** (lives in the Ratings expanded tier).
- `role="slider"` + aria value attributes; **arrow keys nudge by 0.1**.
- The **`.dial-knob`** is a handle at the end of the arc that signals draggability — the
  readout stays **number-only inside** the ring and the label stays a **caption beneath**.

> **`#cyanGold` gradient `<defs>` requirement (v1.1.1):** the dial arc strokes with an SVG
> gradient referenced as `stroke: url(#cyanGold)`. Every page/tab that renders a dial **must
> include this `<defs>` block once** in its markup (the gradient stops are coloured via
> tokens in the component CSS — `#cyanGold .stop-cyan { stop-color: var(--accent-cyan); }`
> and `#cyanGold .stop-gold { stop-color: var(--accent-gold); }` — so the def carries no hex):
> ```html
> <svg aria-hidden="true" style="position:absolute; width:0; height:0;">
>   <defs>
>     <linearGradient id="cyanGold" x1="0" y1="0" x2="1" y2="1">
>       <stop class="stop-cyan" offset="0%"></stop>
>       <stop class="stop-gold" offset="100%"></stop>
>     </linearGradient>
>   </defs>
> </svg>
> ```

**Anti-patterns:**
❌ Axis-tinting the arc (it is the cyan→gold range-family constant)
❌ Making it a range dial (it is min-only — one `.dial-knob`)
❌ Putting the label inside the ring (number only inside; label is the caption beneath)
❌ Bouncy / elastic arc animation
❌ Rendering a dial without the `#cyanGold` `<defs>` in the host page (arc will have no stroke)

---

### 5. Histogram — **Originated — provisional**

**Dimensions:**
```css
--histogram-height: 48px;   /* bar field behind a slider */
```

**Styling** *(as built — bar class is `.histo-bar`; dim is the base state, `.is-active`
is the in-range variant; bar height is data-driven, set inline by the consuming tab):*
```css
.histogram { height: 48px; display: flex; align-items: flex-end; gap: 2px; }   /* sits BEHIND a slider */
.histogram .histo-bar {
  flex: 1;
  border-radius: 3px 3px 0 0;            /* rounded tops */
  min-height: 2px;                       /* empties keep 2px */
  background: rgba(var(--axis), 0.18);   /* dim (out of range) — base state */
  transition: background-color 0.3s ease-out;   /* colour only — never animate height */
}
.histogram .histo-bar.is-active { background: rgba(var(--axis), 0.55); }   /* in slider range — bright */
```

- **Decorative / `aria-hidden`** — the slider carries all interaction.
- Bucket count is **tab-supplied**.

**Anti-patterns:**
❌ Clickable bars (the slider is the control, not the bars)
❌ Equal-colour bars (`.is-active` vs. the dim base must differ)
❌ Flat zero-height empty buckets (keep 2px min-height)
❌ Bouncy bar-height animation on load

---

### 6. Weighted tag-cloud tiers — **Built on locked chip**

The base `.chip` (B1 §1) rendered at **4 FIXED size tiers** — tier assigned by bucketing
film-count into 4 bands, **not** continuous scaling.

**Dimensions:**
```css
.chip.tier-1 { font-size: 11px;   opacity: 0.75; }
.chip.tier-2 { font-size: 12.5px; }                 /* = base chip */
.chip.tier-3 { font-size: 15px;   font-weight: 600; }
.chip.tier-4 { font-size: 18px;   font-weight: 600; }
```

All other chip behaviour (pill shape, axis colour, states, counts) inherited unchanged.

**Anti-patterns:**
❌ Continuous count→px mapping (must bucket into 4 bands)
❌ Redefining shape / colour per tier (only size + weight + tier-1 opacity change)
❌ More than 4 tiers
❌ tier-4 breaking panel density

---

### 7. Type-tagged search dropdown — **Originated — provisional**

**Dimensions:**
```css
--search-input-height: 38px;
--dropdown-max-height: 280px;   /* approx — scroll-capped */
--result-row-height: 36px;
```

**Structure** *(as built — `.tts-*` names; the overlay is shown via the static
`.tts-search.is-open` modifier in the CSS shell):*
```html
<div class="tts-search is-open">           <!-- position:relative anchor; .is-open reveals the overlay -->
  <div class="tts-input-row">              <!-- 38px, axis-tinted border -->
    <span class="tts-glyph"><!-- og-* glyph (Rule 11) --></span>
    <input class="tts-input" type="text" placeholder="Search settings, locations, eras…" />
  </div>
  <div class="tts-overlay">                <!-- ABSOLUTE overlay — never resizes the container -->
    <button class="tts-result">
      <span class="tts-name">Tokyo</span>
      <span class="tts-tag" data-type="location">Location</span>   <!-- type tag, colour-coded by domain -->
    </button>
  </div>
</div>
```

**Styling** *(as built — `components/discover-components.css`):*
```css
.tts-search { position: relative; }                    /* anchor for the absolute overlay */
.tts-input-row {
  display: flex; align-items: center; gap: 8px;
  height: 38px; padding: 0 12px;
  border-radius: var(--radius-sm);
  background: rgba(var(--muted-silver-rgb), 0.08);
  border: 1px solid rgba(var(--axis), 0.4);            /* axis-tinted */
}
.tts-input-row .tts-glyph { color: var(--axis-hex); display: inline-flex; flex-shrink: 0; }
.tts-input-row .tts-input { flex: 1; min-width: 0; background: transparent; border: none; outline: none;
  color: var(--film-white); font: 400 14px var(--font-body); }
.tts-overlay {
  display: none;                                        /* revealed by .tts-search.is-open */
  position: absolute;                                  /* floats — NEVER resizes the container */
  top: calc(100% + 4px); left: 0; right: 0;
  max-height: 280px;
  overflow-y: auto;                                    /* scroll-capped */
  z-index: 10000;                                      /* above the panel */
  background: var(--glass-bg-heavy);
  border: 1px solid rgba(var(--axis), 0.3);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(var(--space-black-rgb), 0.7);
}
.tts-search.is-open .tts-overlay { display: block; }   /* static shell toggle; real JS later */
.tts-result { height: 36px; display: flex; align-items: center; justify-content: space-between;
  gap: 8px; padding: 0 12px; cursor: pointer; transition: background-color 0.2s ease-out; }
.tts-result:hover { background: rgba(var(--axis), 0.1); }   /* axis-tint hover */
.tts-tag { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 2px 8px; border-radius: var(--radius-pill); }
.tts-tag[data-type="location"] { color: var(--emerald);         background: rgba(var(--emerald-rgb), 0.15);         border: 1px solid rgba(var(--emerald-rgb), 0.4); }
.tts-tag[data-type="era"]      { color: var(--accent-gold);     background: rgba(var(--accent-gold-rgb), 0.15);     border: 1px solid rgba(var(--accent-gold-rgb), 0.4); }
.tts-tag[data-type="world"]    { color: var(--prestige-purple); background: rgba(var(--prestige-purple-rgb), 0.15); border: 1px solid rgba(var(--prestige-purple-rgb), 0.4); }
```

- Type tags colour-coded by domain via `[data-type]`: **location = emerald, era = gold, world = purple**.
- Dismiss on **click-away / Esc / select**.

> **CSS shell — JS deferred (v1.1.2):** Phase 0b-2 built the **visual shell only**. The
> overlay's open / dismiss (click-away / Esc / select) / scroll / result-population
> JavaScript is **deferred to the consuming tab (Setting)**; in the shell, `.tts-search.is-open`
> is a static modifier so the overlay can be seen. The input glyph (`.tts-glyph`) must be an
> **`og-*` glyph** (CLAUDE.md Rule 11) in real tabs — the preview harness's inline `<svg>` is
> a throwaway placeholder only.

**Anti-patterns:**
❌ Inline (layout-pushing) results that resize the container
❌ Unbounded dropdown height
❌ Untagged results in a multi-domain list
❌ No dismiss path (in the consuming tab)
❌ Using a raw inline SVG / Unicode for the input glyph instead of an `og-*` glyph

---

### 8. Vertical tab rail — **Originated** (anchored to Design's `.tab-frame` / `.tab-icon` vocabulary)

**Dimensions:**
```css
--rail-width-expanded: 220px;
--rail-width-collapsed: 64px;    /* ≤900px — icon-only */
--tab-height: 44px;              /* touch-target */
```

**Structure:**
```html
<nav class="tab-rail">
  <button class="tab-frame">                       <!-- active reads in the tab's axis colour -->
    <span class="og og-qs-genre tab-icon"></span>  <!-- og-qs-* glyph — SAME set Quick Searches uses -->
    <span class="tab-label">Genre</span>
    <span class="tab-badge">3</span>                <!-- Orbitron 10px; hidden at 0 -->
  </button>
</nav>
```

**Styling:**
```css
.tab-rail { width: 220px; }
.tab-frame { height: 44px; }
.tab-badge { font-family: var(--font-display); font-size: 10px; }   /* hidden when count == 0 */
.tab-frame.active, .tab-frame.active .tab-icon, .tab-frame.active .tab-badge { color: var(--axis-hex); }

@media (max-width: 900px) {
  .tab-rail { width: 64px; }              /* icon-only */
  .tab-label { display: none; }           /* labels hidden when collapsed */
  .tab-badge { /* floats on the glyph */ }
}
```

- Each tab: `og-qs-*` **glyph** (the SAME set Quick Searches uses — **never Unicode symbols**)
  + label + **live filter-count badge** (hidden when count is 0).
- Active tab + its glyph + badge read in the tab's axis colour.
- The per-tab badge is the always-on "where selections live" signal.

**Anti-patterns:**
❌ Showing labels in the collapsed (icon-only) state
❌ Badge visible at count 0
❌ Tab height under 44px
❌ A second vertical rail nested inside a panel
❌ Hardcoded per-tab colour instead of axis inheritance

---

### 9. Fixed filter-panel — **Originated**

The container all Discovery tab controls live in.

**Dimensions / rule:**
- **Fixed size — NEVER resizes between tabs.**
- Add-to-orbit anchors **top-right**.

> **⚠️ EXPLICIT EXCEPTION to the base Panel spec.** The base "Panels (Info Containers)"
> spec locks `max-width: 900px` and `padding: 16px` ("never more"). The Discovery
> **fixed filter-panel is wider and fixed-height by design** and is therefore an
> authorised exception — exactly as the base "Popups / Modals" spec is an authorised
> exception to the 16px padding rule (popups get 24px). The base 900px / 16px Panel rule
> still governs every *non-Discovery* info panel; this exception is scoped to the
> Discovery filter-panel only. (The base rule is preserved verbatim above — this does not
> override it, it carves out a documented exception.)

**Anti-patterns:**
❌ Resizing the panel between tabs (its whole purpose is stability)
❌ A nested vertical rail inside the panel (the rail is §8, external)

---

### 10. Poster & portrait tiles — **Originated**

**ONE shared shape:** a vertical **rounded-rectangle** (NOT a circle) holding a real image
(TMDB poster / TMDB profile photo).

> **Namespaced `.disco-tile*` (v1.1.2):** the generic `.tile` / `.tile-meta` names collide
> with existing classes elsewhere (e.g. `pages/awards-guide.css:432` defines `.tile-meta`),
> so Discovery tiles use the **`.disco-tile*`** namespace. `.is-poster` / `.is-portrait` /
> `.role-actor` / `.role-director` are scoped under it (`.disco-tile.role-actor`, etc.).

**Structure** *(as built — `.disco-tile` base; width is set by the consuming grid):*
```html
<div class="disco-tile is-portrait role-actor">
  <div class="disco-tile-img"><!-- <img> at consume-time --></div>
  <div class="disco-tile-meta">
    <div class="disco-tile-name">Cate Blanchett</div>
    <div class="disco-tile-sub">Actor</div>
  </div>
</div>
```

**Styling** *(as built — `components/discover-components.css`):*
```css
.disco-tile {
  display: flex; flex-direction: column;
  border-radius: var(--radius-md);            /* 12px — vertical rounded-rect */
  overflow: hidden;
  background: var(--nebula-dark);
  border: 1px solid rgba(var(--accent-cyan-rgb), 0.2);
  cursor: pointer;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
}
.disco-tile:hover {                            /* lift + glow, per the Card pattern */
  transform: translateY(-4px);
  border-color: rgba(var(--accent-cyan-rgb), 0.6);
  box-shadow: 0 0 30px rgba(var(--accent-cyan-rgb), 0.3);
}
.disco-tile .disco-tile-img {
  aspect-ratio: 2 / 3;                         /* standard poster / profile ratio */
  background: rgba(var(--muted-silver-rgb), 0.1);   /* neutral placeholder fill */
  overflow: hidden;
}
.disco-tile .disco-tile-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.disco-tile .disco-tile-meta { padding: 8px 10px; }
.disco-tile .disco-tile-name  { font: 500 14px var(--font-body); color: var(--film-white); margin-bottom: 2px; }
.disco-tile .disco-tile-sub   { font: 400 12px var(--font-body); color: var(--muted-silver); }

/* .is-poster (films) and .is-portrait (people) share the shape — semantic hooks. */
.disco-tile.is-portrait,
.disco-tile.is-poster { /* shared base shape */ }

/* Role-coded glow border on portraits — TOKENS, not literal hex. */
.disco-tile.role-actor    { border: 2px solid var(--accent-cyan);     box-shadow: 0 0 14px rgba(var(--accent-cyan-rgb), 0.4); }      /* cyan = actor */
.disco-tile.role-actor:hover    { box-shadow: 0 0 24px rgba(var(--accent-cyan-rgb), 0.55); }
.disco-tile.role-director { border: 2px solid var(--prestige-purple); box-shadow: 0 0 14px rgba(var(--prestige-purple-rgb), 0.4); }  /* purple = director */
.disco-tile.role-director:hover { box-shadow: 0 0 24px rgba(var(--prestige-purple-rgb), 0.55); }
```

- ONE shared vertical rounded-rect shape; `.disco-tile-img` is `aspect-ratio: 2/3` with
  `object-fit: cover`; meta = name (14px/500 film-white) + sub (12px muted-silver).
- Hover lift/glow follows the base **Card pattern** (Part A).
- Portrait tiles carry a **role-coded glow border** (cyan = actor, purple = director —
  existing ORBIT convention), expressed via **tokens** (`rgba(var(--accent-cyan-rgb),0.4)` /
  `rgba(var(--prestige-purple-rgb),0.4)`), never literal hex.
- **Tile width is left to the consuming grid** (the tile sizes to its container).

**Anti-patterns:**
❌ Circular profile crops (portraits are rounded-rects, per this system)
❌ Gradient placeholders in the final UI (use the real TMDB image)
❌ Bare `.tile` / `.tile-meta` names (collide with existing CSS — use `.disco-tile*`)
❌ Literal hex for the role glow (use `rgba(var(--prestige-purple-rgb), …)` etc.)

---

### 11. Service-toggle tile — **Originated**

Stream tab. A flex row: logo slot + name + optional Orbitron title-count. On-state in the
Stream axis (orange), mirroring the chip's selected treatment but tile-shaped.

**Structure** *(as built — on-state class is `.service-tile.is-on`):*
```html
<div class="service-tile is-on">
  <div class="service-logo"><!-- <img> at consume-time --></div>
  <div class="service-name">MUBI</div>
  <div class="service-count">88</div>          <!-- optional, Orbitron -->
</div>
```

**Styling** *(as built — `components/discover-components.css`):*
```css
.service-tile {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);             /* 8px */
  background: transparent;
  border: 1px solid rgba(var(--muted-silver-rgb), 0.2);   /* neutral default */
  cursor: pointer;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;
}
.service-tile:hover {                           /* warms toward orange */
  border-color: rgba(var(--collision-orange-rgb), 0.4);
  background: rgba(var(--collision-orange-rgb), 0.06);
}
.service-tile .service-logo { width: 28px; height: 28px; border-radius: 6px; overflow: hidden;
  flex-shrink: 0; background: rgba(var(--muted-silver-rgb), 0.12); }
.service-tile .service-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.service-tile .service-name  { font: 500 13px var(--font-body); color: var(--film-white); }
.service-tile .service-count { margin-left: auto; font-family: var(--font-display); font-size: 11px;
  opacity: 0.6; color: var(--muted-silver); }     /* optional title-count, Orbitron */
.service-tile.is-on {                           /* on-state — Stream axis (orange), mirrors .chip.on */
  background: linear-gradient(180deg, rgba(var(--collision-orange-rgb), 0.18), rgba(var(--collision-orange-rgb), 0.06));
  border-color: rgba(var(--collision-orange-rgb), 0.5);
  box-shadow: inset 0 0 12px rgba(var(--collision-orange-rgb), 0.15);
}
```

**Anti-patterns:**
❌ On-state rendered in any colour other than the Stream axis (orange)
❌ Using `.service-tile.on` (the as-built state class is `.service-tile.is-on`)

---

### 12. Match-count pill — **Already ships** (`#orbitFilmCount`)

Live "N films match" readout. Documented for consistency.

**Styling:**
```css
#orbitFilmCount { /* pill */
  background: rgba(var(--accent-cyan-rgb), 0.08);
  border: 1px solid rgba(var(--accent-cyan-rgb), 0.25);
}
#orbitFilmCount .count { font-family: var(--font-display); color: var(--accent-cyan); }   /* Orbitron, cyan */
```

---

### 13. Empty-state — **Already shipped** (document as-built)

Three kinds, inside `#orbitPanel`:

| Kind | Accent | Glyph |
|---|---|---|
| `is-zero` | cyan | `og-satellite` |
| `is-network` | orange | `og-warning` |
| `is-data` | purple | `og-warning` |

- **Narrowing trace** line (monospace, e.g. `142 → 0`) — **zero-kind only**.
- **Active fix buttons.**
- Dismiss via the **orbit-close Black Hole** pattern (CLAUDE.md Rule 17).

**Anti-patterns:**
❌ Trace line on network/data kinds (zero-kind only)
❌ A bespoke close handler instead of `orbit-close`

---

## 🔁 B1 — EXPANSION TRANSITION MECHANICS

Two reusable patterns for revealing the expanded tier when an upper page section collapses.

### Mode A — Additive reveal *(CSS-driven)*
The container **grows** and a **new section fades-and-rises in below**. Use for tabs whose
expanded tier is a **NEW block** (no existing control changes position).

### Mode B — Reflow reveal *(JS-driven — FLIP)*
Existing controls **FLIP to new positions** as a section deepens; the container grows
underneath. JS-driven via **FLIP** (First / Last / Invert / Play — measure positions,
invert, animate to natural layout). Use for tabs whose expanded tier **DEEPENS an existing
control**.

**Both modes:**
- Eased, ~0.3–0.4s.
- **Space-opens-then-fills** — never reflow and fade simultaneously.
- Honour `prefers-reduced-motion` (shortened cross-fade fallback).

> **BUILD-AND-VERIFY:** exact durations, easing curves, and stagger are tuned **live against
> the page**, not fixed here. The ~0.3–0.4s figure is a starting envelope, not a locked
> value.

---
---

# 📋 B2 — DISCOVERY PER-TAB REDESIGN SPEC

> ⚠️ **This section is build-plan, not stable style reference — expect revision during
> builds.** B1 (components + transitions) is the stable contract; the per-tab assignments
> below will move as tabs are built and verified.

Per tab: **axis colour · compact-tier controls · expanded-tier controls · transition mode
(A / B / None) · fenced items (new engineering/data) · struck items.**

---

### RATINGS — axis **rose** · Mode **A**
- **Compact:** score dual-slider + histogram · score quick-chips · certification chips · vote buckets.
- **Expanded:** min-only **score dial** · free-entry minimum-votes.
- **Fenced:** —
- **Struck:** —

### SETTING — axis **emerald** · Mode **B** · *compound (where + when)*
- **Compact:** location type-tagged search · popular locations (+ dynamic city) · regions · special-location chips · ~20 named eras + decades · special-time chips · when-keyword search.
- **Expanded:** full **46-era palette** (~26 dormant eras surfaced) · **Contemporary / Historical** setting-type chips.
- **Fenced:** story-set approximate-year filter.
- **Struck:** location coordinates (geographic/proximity).

### GENRE — axis **purple** · Mode **None**
- **Compact:** full V1 — genre search · all-families grid · Any/All match toggle · selected + sub-genres + hybrids.
- **Expanded:** none.
- **Note:** the **mood groups MIGRATE OUT to Themes** (Tone/Pace/Mood/Content no longer live here).
- **Fenced:** —
- **Struck:** —

### THEMES — axis **teal** · Mode **B**
- **Compact:** theme keyword search · weighted tag cloud.
- **Expanded:** full structured mood palette together — the **4 migrated groups** (Tone / Pace / Mood / Content) + the **6 revived chips** (Quirky / Whimsical / Bleak / Twisted / Gore / Heartwarming).
- **Fenced:** sub-theme granular chips.
- **Struck:** —

### PEOPLE — axis **cyan** · Mode **None**
- **Compact:** *Search-by-name* (role toggle · TMDB search · selected chips · recently-searched) **AND** *Describe-the-filmmaker* (V1: free-text spine + parsed attribute chips).
- **Expanded:** thin.
- **Fenced (NEW ENGINEERING):** the describe-mode **FILTERING engine is a stub** — build the interface only; the engine is a separate project.
- **Struck:** —

### ERA — axis **indigo** · Mode **None**
- **Compact:** scrubber + decade strip + jump-to-year · runtime slider + quick chips · recency chips.
- **Expanded:** thin — arbitrary year-range is **likely already covered**; confirm before building so it isn't duplicated.
- **Fenced:** —
- **Struck:** —

### AWARDS — axis **gold** · Mode **A**
> ⚠️ **CLIENT-SIDE filtered (not TMDB) — BUILD LATE, after the data audit.**
- **Compact:** festival drill-down · recognition · festival chips · festival-correct category chips · year-range slider + specific-year input.
- **Expanded:** count / superlative suite — min wins (1+ / 3+ / 5+ / 10+) · min nominations · won-at-multiple-festivals · major-category-wins-only. *(All count copy scoped "across tracked festivals.")*
- **Fenced:** ranked "most awarded" superlatives + Silver Bear categories (pending `awards-data-v1.json` audit).
- **Struck:** —

### SOURCE — axis **indigo** · Mode **A** · *compound (basedOn + universes)*
- **Compact:** source-type chips · franchise status (sequel / prequel) · unified keyword + collection search · Popular Series gallery.
- **Expanded:** "Popular Themes" concept chips (plot-concepts — **kept here, not in Themes**) + **dormant adaptation-type slot** (remake / spin-off — designed but **DISABLED**, awaiting Wikidata enrichment).
- **Fenced:** universe-shapes (preset-only today — extended-collection / movieList / multiCollections).
- **Struck:** `based_on` remake / spin-off / mythology data (zero coverage until enrichment).
- **Build note:** route around the dead `collectLabelsForSection('universes')` path; the live commit is `commitKwFilter`.

### REGION — axis **emerald** · Mode **B**
- **Compact:** region/country search + chips · popular regions · Any/All match toggle · English-Only toggle (**DEFAULT DERIVED FROM PROFILE COUNTRY — not hardcoded ON**) · language track · region→language smart-link.
- **Expanded:** multi-language OR.
- **Fenced:** region / release-type availability.
- **Struck:** —

### PRODUCTION — axis **rose** · Mode **A**
- **Compact:** top-studio chips · studio search · box-office slider + quick chips.
- **Expanded:** expanded curated studio roster + **budget slider (SHIPS REGARDLESS;** presentation pending TMDB budget-coverage check).
- **Fenced:** exclusion-by-studio.
- **Struck:** —

### STREAM — axis **orange** · Mode **A**
- **Compact:** provider toggle-tiles · country selector (profile-defaulted, per-search override).
- **Expanded:** monetization split — "On my subscriptions" (flatrate) vs "Rent/Buy" (transactional); free/ads omitted.
- **Fenced (NEW QUERY):** monetization param is unwired.
- **ARCHITECTURAL FIX:** unify the two provider systems into one profile-backed state (top bar = display/shortcut, tab = override); kill the dead `orbit_bar_providers`-never-read path.

---

## 🌐 B2 — CROSS-TAB / GLOBAL NOTES

- **GLOBAL CONTROLS STRIP:** **sort-by** is the first tenant (currently hard-coded
  `popularity.desc`). Profile-default overrides are conceptually adjacent.
- **DISCOVERABILITY:** the "more options" hint shows **ONLY** on tabs with real expanded
  content (Mode A / B) — **never** on Mode-None tabs. The rail's per-tab filter-count
  badges (B1 §8) are the always-on "where selections live" signal.
- **PROFILE-DEFAULTS PRINCIPLE:** profile sets persistent country / language / providers;
  any tab may **override for a single search**.

---

## 🧱 B2 — FENCED FOUNDATION ITEMS

Foundation work the per-tab plans depend on (captured here so it isn't lost):

1. **`awards-data-v1.json` field-by-field audit** — gates the Awards count/superlative suite.
2. **TMDB budget-coverage check** — gates the Production budget-slider presentation (slider ships regardless).
3. **Profile-defaults surface** — serves Region + Stream (country / language / providers).
4. **`-rgb` token additions to `variables.css`** — required for every axis colour (B1 §2).
5. **Wikidata adaptation-type enrichment project** — remake = clean, spin-off = partial, mythology = none; gates the Source dormant adaptation-type slot.
