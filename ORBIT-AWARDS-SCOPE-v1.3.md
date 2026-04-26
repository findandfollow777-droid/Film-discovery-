# ORBIT Awards Scope v1.3.0

**Version:** 1.3.0  
**Date:** 2026-04-26  
**Status:** Active

---

## 1. Overview

This document defines the scope of awards coverage for the ORBIT Awards system. It specifies which festivals, categories, and year ranges are included.

## 2. Festival Coverage

| Festival | ID Prefix | Year Range | Status | Categories |
|----------|-----------|------------|--------|------------|
| Oscar (Academy Awards) | oscar. | 2000-present | Active — Phase 1 scraper complete | 26 |
| BAFTA | bafta. | 2000-present | Active — Phase 1 scraper complete | 26 |
| Golden Globe | golden_globe. | 2000-present | Planned | TBD |
| Cannes | cannes. | 2000-present | Planned | TBD |
| Venice | venice. | 2000-present | Planned | TBD |
| Berlin | berlin. | 2000-present | Planned | TBD |

## 3. Year Convention

All year references use **ceremony year** — the year the ceremony was held, not the year the eligible films were released.

## 4. Oscar Categories (26)

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

## 5. BAFTA Categories (26)

### 5.1 Core Categories

Categories active across the full 2000-present scope:

- bafta.best_film
- bafta.best_director (renamed from Best Direction, 2013)
- bafta.best_leading_actor
- bafta.best_leading_actress
- bafta.best_supporting_actor
- bafta.best_supporting_actress
- bafta.best_original_screenplay
- bafta.best_adapted_screenplay
- bafta.best_cinematography
- bafta.best_costume_design
- bafta.best_editing
- bafta.best_makeup_and_hair (renamed from Best Makeup and Hair to Best Make Up & Hair, 2014)
- bafta.best_original_score (renamed from Best Original Music, 2015)
- bafta.best_production_design
- bafta.best_sound
- bafta.best_special_visual_effects
- bafta.best_film_not_in_english
- bafta.outstanding_british_film
- bafta.outstanding_debut — Outstanding Debut by a British Writer, Director or Producer
- bafta.best_british_short_animation (renamed from Best Short Animation, 2013)
- bafta.best_british_short_film (renamed from Best Short Film, 2013)

### 5.2 Feature Sections with Lifecycle Changes

- bafta.best_animated_film — first_year 2006. Best Animated Film.
- bafta.best_documentary — first_year 2011. Best Documentary.
- bafta.best_casting — first_year 2020. Best Casting.
- bafta.best_childrens_film — first_year 2025 (78th BAFTAs). Best Children's & Family Film. Replaces the discontinued British Academy Children's Awards (separate ceremony, ended 2022). Eligibility: U, PG, or 12A rating from the BBFC.
- bafta.ee_rising_star — first_year 2006. EE Rising Star Award (public vote, not jury-decided). Renamed from Orange Rising Star Award in 2013.

### 5.3 Categories NOT in Scope

- BAFTA Fellowship
- Outstanding British Contribution to Cinema
- Special Visual Effects Achievement Award (historic, discontinued)

These are honorary/non-competitive and excluded from the awards browse experience.

## 6. Category Metadata

Full category definitions with historical names, lifecycle fields, and recipient types are maintained in:
- `scripts/scrape-oscar-categories.json` (Oscar categories)
- `scripts/scrape-bafta-categories.json` (BAFTA categories)

These files are the canonical machine-readable sources for category metadata.

## 7. Known Tricky Cases

### 7.1 Oscar Sound Categories

Pre-2021: two separate categories (Sound Editing, Sound Mixing). Post-2021: one merged category (Sound). The categories.json file encodes this via first_year/last_year. Scraper must not produce Sound rows for pre-2021 ceremonies or Sound Editing/Mixing rows for post-2021 ceremonies.

### 7.2 Renamed Categories

Several categories were renamed during the 2000-present scope. The stable category ID uses the current name; historical names drive Wikipedia section-header matching. The wikipedia_section_aliases array in categories.json provides fallback matching.

### 7.3 Oscar Best Casting

New for ceremony 98 (2026). Earlier ceremonies must not produce casting rows.

### 7.4 Co-winners

Ties produce two separate rows per schema §6.7. Each row gets a notes field mentioning the tie. Flag with "co_winner".

### 7.5 Best Original Song

Wikipedia format: `"Song Name" from ''Film Name'' – credits`. The parser extracts the song name into `subject_title` and the film name into `film_title`.

### 7.6 BAFTA Source Strategy

awards.bafta.org is inaccessible (301 → 403). Wikipedia is the sole source for BAFTA data. All rows carry "single_source_wikipedia_only" flag.

### 7.7 BAFTA Children's & Family Film

First awarded at the 78th BAFTAs (February 2025). The scraper's categories.json must have first_year=2025 to prevent rows being generated for pre-2025 ceremonies.

---

## 8. Scope Summary

| Metric | Count |
|--------|-------|
| Festivals in scope | 6 (2 active, 4 planned) |
| Oscar categories | 26 |
| BAFTA categories | 26 |
| Total categories (active festivals) | 52 |

---

## 9. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-19 | Initial scope |
| 1.1.0 | 2026-04-25 | Lifecycle field corrections (sound merger, makeup rename) |
| 1.2.0 | 2026-04-25 | Added subject_title documentation for Best Original Song. Scope definitions unchanged. |
| 1.3.0 | 2026-04-26 | Added BAFTA Best Children's & Family Film as a 26th BAFTA category (feature_sections group). Introduced at the 78th BAFTAs in February 2025; was missed in v1.2 scope. Added full BAFTA category section (§5). No other scope changes. |
