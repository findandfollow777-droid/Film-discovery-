# Oscar Categories Lifecycle Audit

**Date:** 2026-04-25  
**File audited:** `scripts/scrape-oscar-categories.json` (26 entries)

## Rule

All `first_year`, `last_year`, and `historical_names[].from`/`to` fields use **ceremony year** — the year the ceremony was held, not the year the eligible films were released. The 96th Academy Awards was held in **2024** (ceremony year) for **2023** films (film year).

## Research Sources

- Wikipedia ceremony articles (92nd–97th confirmed via MediaWiki API)
- Wikipedia category-specific articles for rename/merge history
- DLu/oscar_data for cross-reference

---

## Full Category Assessment

| # | Category ID | Field | Current Value | Ceremony-Year Truth | Assessment |
|---|-------------|-------|---------------|---------------------|------------|
| 1 | oscar.best_picture | first_year | 1929 | 1st ceremony (1929) | OK |
| 2 | oscar.best_director | first_year | 1929 | 1st ceremony (1929) | OK |
| 3 | oscar.best_actor | first_year | 1929 | 1st ceremony (1929) | OK |
| 4 | oscar.best_actress | first_year | 1929 | 1st ceremony (1929) | OK |
| 5 | oscar.best_supporting_actor | first_year | 1937 | 9th ceremony (1937) | OK |
| 6 | oscar.best_supporting_actress | first_year | 1937 | 9th ceremony (1937) | OK |
| 7 | oscar.best_animated_feature | first_year | 2002 | 74th ceremony (2002) | OK |
| 8 | oscar.best_international_feature | first_year | 1957 | 29th ceremony (1957) | OK |
| 8a | | historical: "Best Foreign Language Film" to | 2019 | 91st ceremony (2019) | OK |
| 8b | | historical: "Best International Feature Film" from | 2020 | 92nd ceremony (2020) | OK |
| 9 | oscar.best_documentary_feature | first_year | 1943 | 16th ceremony (1943) | OK |
| 10 | oscar.best_documentary_short | first_year | 1943 | 16th ceremony (1943) | OK |
| 11 | oscar.best_animated_short | first_year | 1932 | 5th ceremony (1932) | OK |
| 12 | oscar.best_live_action_short | first_year | 1932 | 5th ceremony (1932) | OK |
| 13 | oscar.best_original_screenplay | first_year | 1940 | 13th ceremony (1940) | OK |
| 14 | oscar.best_adapted_screenplay | first_year | 1940 | 13th ceremony (1940) | OK |
| 15 | oscar.best_cinematography | first_year | 1929 | 1st ceremony (1929) | OK |
| 16 | oscar.best_film_editing | first_year | 1935 | 7th ceremony (1935) | OK |
| 17 | oscar.best_production_design | first_year | 1929 | 1st ceremony (1929) | OK |
| 17a | | historical: "Best Art Direction" to | 2012 | 84th ceremony (2012) | OK |
| 17b | | historical: "Best Production Design" from | 2013 | 85th ceremony (2013) | OK |
| 18 | oscar.best_costume_design | first_year | 1949 | 21st ceremony (1949) | OK |
| 19 | oscar.best_makeup_and_hairstyling | first_year | 1982 | 54th ceremony (1982) | OK |
| 19a | | historical: "Best Makeup" to | **2013** | 84th ceremony (**2012**) | **DRIFT** |
| 19b | | historical: "Best Makeup and Hairstyling" from | **2014** | 85th ceremony (**2013**) | **DRIFT** |
| 20 | oscar.best_original_score | first_year | 1935 | 7th ceremony (1935) | OK |
| 20a | | historical: "Best Original Music Score" to | 1999 | 71st ceremony (1999) | OK |
| 20b | | historical: "Best Original Score" from | 2000 | 72nd ceremony (2000) | OK |
| 20c | | historical: "Best Original Music Score" name | — | See note below | **UNCLEAR** |
| 21 | oscar.best_original_song | first_year | 1935 | 7th ceremony (1935) | OK |
| 22 | oscar.best_sound | first_year | **2020** | 93rd ceremony (**2021**) | **DRIFT** |
| 22a | | historical: "Best Sound" from | **2020** | 93rd ceremony (**2021**) | **DRIFT** |
| 23 | oscar.best_sound_editing | last_year | **2019** | 92nd ceremony (**2020**) | **DRIFT** |
| 23a | | historical: "Best Sound Editing" to | **2019** | 92nd ceremony (**2020**) | **DRIFT** |
| 24 | oscar.best_sound_mixing | last_year | **2019** | 92nd ceremony (**2020**) | **DRIFT** |
| 24a | | historical: "Best Sound Mixing" to | **2019** | 92nd ceremony (**2020**) | **DRIFT** |
| 24b | | historical: "Best Sound" to | **2002** | Rename boundary | **UNCLEAR** |
| 24c | | historical: "Best Sound Mixing" from | **2003** | Rename boundary | **UNCLEAR** |
| 25 | oscar.best_visual_effects | first_year | 1964 | 36th ceremony (1964) | OK |
| 26 | oscar.best_casting | first_year | 2026 | 98th ceremony (2026) | OK |

---

## DRIFT Findings

### DRIFT 1: Sound category merger boundary (off by one year)

The sound editing/mixing merger happened between the 92nd ceremony (2020) and the 93rd ceremony (2021). The 92nd ceremony was the **last** to have separate Sound Editing and Sound Mixing. The 93rd was the **first** with merged Best Sound.

Current values use 2019/2020 (film years), but should use 2020/2021 (ceremony years).

| Category | Field | Current | Should Be |
|----------|-------|---------|-----------|
| oscar.best_sound_editing | last_year | 2019 | 2020 |
| oscar.best_sound_editing | historical "Best Sound Editing" to | 2019 | 2020 |
| oscar.best_sound_mixing | last_year | 2019 | 2020 |
| oscar.best_sound_mixing | historical "Best Sound Mixing" to | 2019 | 2020 |
| oscar.best_sound | first_year | 2020 | 2021 |
| oscar.best_sound | historical "Best Sound" from | 2020 | 2021 |
| oscar.best_sound | merged_from semantics | — | Predecessors closed 2020, successor starts 2021 |

**Impact:** Ceremony 92 (2020) currently activates `oscar.best_sound` instead of `oscar.best_sound_editing` + `oscar.best_sound_mixing`. This produces incorrect category assignments for that ceremony. Ceremony 93 (2021) is unaffected (correctly gets `best_sound`).

### DRIFT 2: Makeup and Hairstyling rename boundary (off by one year)

The rename from "Best Makeup" to "Best Makeup and Hairstyling" took effect at the 85th ceremony (2013). The 84th ceremony (2012) was the last to use "Best Makeup".

Current values use 2013/2014 (off by one), but should use 2012/2013 (ceremony years).

| Category | Field | Current | Should Be |
|----------|-------|---------|-----------|
| oscar.best_makeup_and_hairstyling | historical "Best Makeup" to | 2013 | 2012 |
| oscar.best_makeup_and_hairstyling | historical "Best Makeup and Hairstyling" from | 2014 | 2013 |

**Impact:** Low for scraper functionality — this only affects which display name is used for Wikipedia section matching in ceremonies 2013-2014. Since the `wikipedia_section_aliases` array includes both names, the parser will still find the section. However, it's incorrect metadata.

---

## UNCLEAR Findings

### UNCLEAR 1: oscar.best_original_score historical name

The categories.json lists `"Best Original Music Score"` as the name from 1972-1999. Per Wikipedia, the actual naming history during this period is more complex:

- 44th-47th ceremonies (1972-1975): "Best Original Dramatic Score" (split with Comedy/Musical)
- 48th-67th ceremonies (1976-1995): "Best Original Score"
- 68th-71st ceremonies (1996-1999): "Best Music (Original Dramatic Score)" (split again)

The name "Best Original Music Score" does not appear to have been used during this period. However, the **year boundaries** (from=1972, to=1999) are consistent with ceremony years, and the name is close enough for section-matching purposes.

**Recommendation:** Verify against an authoritative Academy source. The year boundaries are correct; only the exact historical name string may need correction.

### UNCLEAR 2: oscar.best_sound_mixing internal rename boundary

The categories.json lists `"Best Sound"` from 1930-2002 and `"Best Sound Mixing"` from 2003-2019 for the now-closed sound mixing category. The exact ceremony year of this internal rename (74th or 75th ceremony) has not been independently verified in this audit.

**Recommendation:** Check the 75th (2003) and 76th (2004) ceremony articles to confirm which year the rename from "Best Sound" to "Best Sound Mixing" occurred.

---

## Summary

| Status | Count | Categories |
|--------|-------|------------|
| OK | 21 | best_picture, best_director, best_actor, best_actress, best_supporting_actor, best_supporting_actress, best_animated_feature, best_international_feature, best_documentary_feature, best_documentary_short, best_animated_short, best_live_action_short, best_original_screenplay, best_adapted_screenplay, best_cinematography, best_film_editing, best_production_design, best_costume_design, best_original_song, best_visual_effects, best_casting |
| DRIFT | 3 | best_sound, best_sound_editing, best_sound_mixing |
| DRIFT (minor) | 1 | best_makeup_and_hairstyling |
| UNCLEAR | 1 | best_original_score (name accuracy, not year) |

**Total categories audited: 26**
- **OK: 21** (all lifecycle fields match ceremony-year semantics)
- **Drift detected: 4** (3 sound categories + 1 makeup rename — all off-by-one film-year vs ceremony-year)
- **Unclear: 1** (historical name string accuracy, year boundaries OK)

The sound merger drift is the highest-impact finding — it causes ceremony 92 (2020) to produce `oscar.best_sound` rows when it should produce `oscar.best_sound_editing` and `oscar.best_sound_mixing` rows. This should be corrected before scraping pre-2021 ceremonies at scale.
