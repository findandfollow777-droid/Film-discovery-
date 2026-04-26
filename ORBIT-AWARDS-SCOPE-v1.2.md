> **SUPERSEDED by v1.3.** Retained for historical reference. New work uses v1.3.

# ORBIT Awards Scope v1.2.0

**Version:** 1.2.0  
**Date:** 2026-04-25  
**Status:** Superseded

---

## 1. Overview

This document defines the scope of awards coverage for the ORBIT Awards system. It specifies which festivals, categories, and year ranges are included.

## 2. Festival Coverage

| Festival | ID Prefix | Year Range | Status |
|----------|-----------|------------|--------|
| Oscar (Academy Awards) | oscar. | 2000-present | Active — Phase 1 scraper complete |
| BAFTA | bafta. | 2000-present | Planned |
| Golden Globe | golden_globe. | 2000-present | Planned |
| Cannes | cannes. | 2000-present | Planned |
| Venice | venice. | 2000-present | Planned |
| Berlin | berlin. | 2000-present | Planned |

## 3. Year Convention

All year references use **ceremony year** — the year the ceremony was held, not the year the eligible films were released.

## 4. Oscar Categories

### 4.1 Core Categories

Categories active across the full 2000-present scope:

- oscar.best_picture
- oscar.best_director
- oscar.best_actor
- oscar.best_actress
- oscar.best_supporting_actor
- oscar.best_supporting_actress
- oscar.best_original_screenplay
- oscar.best_adapted_screenplay
- oscar.best_cinematography
- oscar.best_film_editing
- oscar.best_production_design (renamed from Best Art Direction at 85th ceremony, 2013)
- oscar.best_costume_design
- oscar.best_original_score
- oscar.best_original_song — Per schema v1.2, scraped rows for this category populate both film_title (film name) and subject_title (song name).
- oscar.best_visual_effects
- oscar.best_documentary_feature
- oscar.best_documentary_short
- oscar.best_animated_short
- oscar.best_live_action_short
- oscar.best_international_feature (renamed from Best Foreign Language Film at 92nd ceremony, 2020)

### 4.2 Craft Categories with Lifecycle Changes

- oscar.best_makeup_and_hairstyling — renamed from Best Makeup at 85th ceremony (2013). first_year 1982.
- oscar.best_animated_feature — first_year 2002 (74th ceremony).
- oscar.best_sound_editing — closed after 92nd ceremony (2020). Merged into oscar.best_sound.
- oscar.best_sound_mixing — closed after 92nd ceremony (2020). Merged into oscar.best_sound.
- oscar.best_sound — first_year 2021 (93rd ceremony). Merged successor of sound_editing and sound_mixing.
- oscar.best_casting — first_year 2026 (98th ceremony). New category.

### 4.3 Categories NOT in Scope

- Honorary Awards, Jean Hersholt Humanitarian Award, Irving G. Thalberg Memorial Award
- Scientific and Technical Awards
- Gordon E. Sawyer Award
- Special Awards

These are non-competitive and excluded from the awards browse experience.

## 5. Category Metadata

Full category definitions with historical names, lifecycle fields, and recipient types are maintained in `scripts/scrape-oscar-categories.json`. That file is the canonical machine-readable source for category metadata.

## 6. Known Tricky Cases

### 6.1 Sound Categories

Pre-2021: two separate categories (Sound Editing, Sound Mixing). Post-2021: one merged category (Sound). The categories.json file encodes this via first_year/last_year. Scraper must not produce Sound rows for pre-2021 ceremonies or Sound Editing/Mixing rows for post-2021 ceremonies.

### 6.2 Renamed Categories

Several categories were renamed during the 2000-present scope. The stable category ID uses the current name; historical names drive Wikipedia section-header matching. The wikipedia_section_aliases array in categories.json provides fallback matching.

### 6.3 Best Casting

New for ceremony 98 (2026). Earlier ceremonies must not produce casting rows. Wikipedia for ceremony 97 might list casting nominees ahead of the official Academy introduction — if so, flag that explicitly.

### 6.4 Co-winners

Ties produce two separate rows per schema §6.7. Each row gets a notes field mentioning the tie. Flag with "co_winner".

### 6.5 Best Original Song

Wikipedia format: `"Song Name" from ''Film Name'' – credits`. The parser extracts the song name into `subject_title` and the film name into `film_title`. This ensures DLu cross-check matches on film name (which is what DLu uses).

### 6.6 Shorts

Where Wikipedia provides the film title but Phase 2 may not resolve it in TMDB, record what Wikipedia says. A flag will be added in Phase 2 if TMDB resolution fails.

---

## 7. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-19 | Initial scope |
| 1.1.0 | 2026-04-25 | Lifecycle field corrections (sound merger, makeup rename) |
| 1.2.0 | 2026-04-25 | Added subject_title documentation for Best Original Song. Scope definitions unchanged. |
