# Quick Search Audit — 2026-05-16

- **Source:** `pages/discover.js:677` (`PRESET_POOL`)
- **Scope:** all 61 evergreen + spotlight presets as of 2026-05-16
- **Method:** read-only static inspection (no TMDB queries, no result counts)
- **Last `PRESET_POOL` modification reflected:** 2026-05-16 — James Bond preset switched from broad Action+Thriller+UK filter to TMDB collection ID 645 (per comment at `pages/discover.js:815-816`).

---

## Configuration Location

**File:** `/Users/daniel/Desktop/Projects/Venn Movies/Film-discovery-/pages/discover.js`, line 677–832 (array `PRESET_POOL`)

**Filter Application Chain:**
- **Rendering (home page):** `renderPresets()` at line 960 renders 5 tiles (default) from `getActivePresets()` at line 931
- **Spotlight rotation logic:** `shouldShowSpotlight()` at line 860; `pickEvergreens()` at line 911 randomly samples from the pool (Fisher–Yates shuffle), avoiding recent picks
- **Modal (all presets):** `#discoverPresetsModalGrid` at line 6410 renders the full PRESET_POOL
- **Tile click handler:** Line 6430–6439 matches preset by array index; calls `applyPreset(preset)` at line 1106
- **Preset→Filter translation:** `presetToStateFilters(preset)` at line 987 converts the preset object into an array of filter state entries, which populate the sidebar (sections: `genres`, `awards`, `region`, `themes`, `timeEra`, `ratingsContent`, `universes`, etc.)

**Object structure (verbatim example — the Spotlight preset at index 0):**
```javascript
{
  name: 'Michael — the music biopic universe',
  tag: 'IN CINEMAS',
  color: 'spotlight',
  spotlight: true,
  weekId: '2026-W19',
  streamingNow: false,
  filters: {
    genres: ['Drama', 'Music'],
    decade: '2020',
    keyword: { id: 9672, name: 'Based on true story' }
  }
}
```

**Standard keys across all presets:**
- `name` (string, required): display label on tile
- `tag` (string): category/badge text (e.g. `'AWARDS · ERA'`, `'FRANCHISE · GENRE'`, `'IN CINEMAS'`)
- `color` (string): CSS modifier class (`'spotlight'`, `'gold'`, `'green'`, `'purple'`, `'cyan'`)
- `filters` (object): contains any/all of:
  - `genres` (array): genre strings, e.g. `['Drama', 'Horror']`
  - `decade` (string): decade as century digit, e.g. `'2000'`, `'1970'`
  - `minRating` (number), `maxRating` (number): rating thresholds
  - `minVotes` (number): minimum vote count for popularity floor
  - `runtimeMax` (number): upper runtime bound in minutes
  - `region` (object): `{ code: 'XX', name: 'Country' }`
  - `language` (string): ISO language code (e.g. `'hi'` for Hindi)
  - `awards` (object): `{ festival: 'Name', category: 'Name', yearFrom: N, yearTo: N }`
  - `keyword` (object): `{ id: TMDB_keyword_id, name: 'Keyword text' }`
  - `collection` (object): `{ id: TMDB_collection_id, name: 'Collection name' }`
- Spotlight-only keys: `spotlight` (boolean), `weekId` (string), `streamingNow` (boolean)

---

## Total Quick Searches Found: 61

(Note: a naive `grep -c "name:"` returns 92 because it also matches nested `name:` fields inside keyword, region, and collection objects. The actual preset array contains **61 entries**: 1 spotlight + 60 evergreen tiles.)

---

## By Category

### SPOTLIGHT (index 0 — special rotation behavior)
Entry is shown randomly every 2nd or 3rd visit, max 3 times per ISO week, never consecutive. When not shown, the user sees 5 random evergreen tiles instead. On page load, this preset gets special treatment: it's never added to `orbit_last_preset_indices`, so it doesn't break the "avoid recent picks" logic.

1. **Michael — the music biopic universe**
   Tag: `'IN CINEMAS'`
   Color: `'spotlight'`
   Filters: `{ genres: ['Drama', 'Music'], decade: '2020', keyword: { id: 9672, name: 'Based on true story' } }`
   Note: Uses genre + decade + keyword (TMDB keyword ID 9672). When applied via `applyPreset()`, this becomes three sidebar chips: Drama, Music, 2020s, and "Based on true story".

---

### AWARDS-BASED (8 entries, indices 1–8)
All use the `awards` filter object with festival/category/year constraints. Awards filters are translated at line 1019–1033 in `presetToStateFilters()`.

1. **Palme d'Or, 21st century**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Cannes', category: "Palme d'Or", yearFrom: 2000 } }`

2. **Best Picture winners, 21st century**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Oscar', category: 'Best Picture', yearFrom: 2000 } }`

3. **Golden Lion winners, post-2000**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Venice', category: 'Golden Lion', yearFrom: 2000 } }`

4. **Golden Bear winners, post-2000**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Berlin', category: 'Golden Bear', yearFrom: 2000 } }`

5. **Oscar Best International Film**
   Tag: `'AWARDS · REGION'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Oscar', category: 'Best International Feature Film', yearFrom: 1990 } }`

6. **BAFTA Best Film, 21st century**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'BAFTA', category: 'Best Film', yearFrom: 2000 } }`

7. **Cannes Jury Prize, 1990s–2000s**
   Tag: `'AWARDS · ERA'`
   Color: `'gold'`
   Filters: `{ awards: { festival: 'Cannes', category: 'Jury Prize', yearFrom: 1990, yearTo: 2009 } }`

8. **Oscar-winning documentaries**
   Tag: `'AWARDS · GENRE'`
   Color: `'gold'`
   Filters: `{ genres: ['Documentary'], awards: { festival: 'Oscar', category: 'Best Documentary Feature', yearFrom: 1990 } }`
   Note: Hybrid — combines genre + awards filters.

---

### REGION-BASED (12 entries, indices 9–20)
All use the `region` filter (country code + name). Regions are translated at line 1013–1017.

1. **90s Hong Kong cinema**
   Tag: `'REGION · DECADE'`
   Color: `'green'`
   Filters: `{ region: { code: 'HK', name: 'Hong Kong' }, decade: '1990' }`

2. **Korean dramas**
   Tag: `'REGION · GENRE'`
   Color: `'green'`
   Filters: `{ region: { code: 'KR', name: 'South Korea' }, genres: ['Drama'] }`

3. **Japanese anime features**
   Tag: `'REGION · GENRE'`
   Color: `'green'`
   Filters: `{ region: { code: 'JP', name: 'Japan' }, genres: ['Animation'] }`

4. **French New Wave, 1950s–60s**
   Tag: `'REGION · DECADE'`
   Color: `'green'`
   Filters: `{ region: { code: 'FR', name: 'France' }, decade: '1960' }`

5. **Italian neo-realism classics**
   Tag: `'REGION · GENRE'`
   Color: `'green'`
   Filters: `{ region: { code: 'IT', name: 'Italy' }, genres: ['Drama'], decade: '1950' }`

6. **New German Cinema, 1970s**
   Tag: `'REGION · DECADE'`
   Color: `'green'`
   Filters: `{ region: { code: 'DE', name: 'Germany' }, decade: '1970' }`

7. **Iranian cinema, post-2000**
   Tag: `'REGION · ERA'`
   Color: `'green'`
   Filters: `{ region: { code: 'IR', name: 'Iran' }, decade: '2000' }`

8. **Classic Hollywood, golden 1940s**
   Tag: `'REGION · DECADE'`
   Color: `'green'`
   Filters: `{ region: { code: 'US', name: 'United States' }, decade: '1940' }`

9. **Romanian New Wave**
   Tag: `'REGION · ERA'`
   Color: `'green'`
   Filters: `{ region: { code: 'RO', name: 'Romania' }, decade: '2000' }`

10. **Scandinavian crime dramas**
    Tag: `'REGION · GENRE'`
    Color: `'green'`
    Filters: `{ region: { code: 'SE', name: 'Scandinavia' }, genres: ['Crime', 'Thriller'] }`

11. **Latin American cinema, 2000s+**
    Tag: `'REGION · DECADE'`
    Color: `'green'`
    Filters: `{ region: { code: 'MX', name: 'Latin America' }, decade: '2000' }`

12. **Indian parallel cinema**
    Tag: `'REGION · GENRE'`
    Color: `'green'`
    Filters: `{ region: { code: 'IN', name: 'India' }, genres: ['Drama'], language: 'hi' }`
    Note: Includes `language` filter for Hindi.

---

### CURATED ERA (Genre + Decade combos, 15 entries, indices 21–35)
All combine `genres` + `decade` (and sometimes `minRating` or `region`). These represent canonical era/movement presets.

1. **70s horror classics**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Horror'], decade: '1970' }`

2. **Sci-fi thrillers, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'purple'`
   Filters: `{ genres: ['Science Fiction', 'Thriller'], minRating: 8 }`

3. **1980s science fiction**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Science Fiction'], decade: '1980' }`

4. **1960s spy thrillers**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Action', 'Thriller'], decade: '1960' }`

5. **Film noir, 1940s–50s**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Crime', 'Drama'], decade: '1940' }`

6. **Spaghetti westerns, 1960s–70s**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Western'], region: { code: 'IT', name: 'Italy' }, decade: '1960' }`
   Note: Region-specific (Italy) within an era preset.

7. **New Hollywood, early 1970s**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Drama'], region: { code: 'US', name: 'United States' }, decade: '1970' }`
   Note: Region-specific (US) within an era preset.

8. **Indie drama, 2000s**
   Tag: `'GENRE · ERA'`
   Color: `'purple'`
   Filters: `{ genres: ['Drama'], decade: '2000', minRating: 7 }`

9. **1990s slasher horror**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Horror'], decade: '1990' }`

10. **Contemporary animation, 2010s+**
    Tag: `'GENRE · ERA'`
    Color: `'purple'`
    Filters: `{ genres: ['Animation'], decade: '2010' }`

11. **Classic musicals, 1950s**
    Tag: `'GENRE · DECADE'`
    Color: `'purple'`
    Filters: `{ genres: ['Music', 'Romance'], decade: '1950' }`

12. **2020s prestige drama**
    Tag: `'GENRE · ERA'`
    Color: `'purple'`
    Filters: `{ genres: ['Drama'], decade: '2020', minRating: 7 }`

13. **Silent era masterpieces**
    Tag: `'GENRE · ERA'`
    Color: `'purple'`
    Filters: `{ genres: ['Drama'], decade: '1920', minRating: 7 }`

14. **1980s action blockbusters**
    Tag: `'GENRE · DECADE'`
    Color: `'purple'`
    Filters: `{ genres: ['Action'], decade: '1980' }`

15. **Psychological horror, 2010s+**
    Tag: `'GENRE · ERA'`
    Color: `'purple'`
    Filters: `{ genres: ['Horror', 'Thriller'], decade: '2010', minRating: 7 }`

---

### RATING + MOOD (Prestige / High-Quality, 8 entries, indices 36–43)
All use `minRating` (sometimes with `minVotes` for popularity floor, or runtime constraints). These filter for critically acclaimed or highly-rated content.

1. **Crime epics, 8.5+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ genres: ['Crime', 'Drama'], minRating: 8.5, minVotes: 50000 }`
   Note: Highest rating threshold (8.5) in the pool; includes vote floor (50K minimum votes).

2. **Documentary, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ genres: ['Documentary'], minRating: 8 }`

3. **War films, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ genres: ['War', 'Drama'], minRating: 8 }`

4. **Hidden gems, 7.5+ pre-1970**
   Tag: `'RATING · ERA'`
   Color: `'cyan'`
   Filters: `{ minRating: 7.5, decade: '1960', minVotes: 5000 }`
   Note: Uses `decade: '1960'` to mean "pre-1970", which technically only covers 1960–1969. Films from the 1950s, 1940s, and earlier are excluded despite the name suggesting "pre-1970".

5. **Animation for adults, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ genres: ['Animation'], minRating: 8, minVotes: 10000 }`

6. **Horror under 90 minutes**
   Tag: `'GENRE · RUNTIME'`
   Color: `'cyan'`
   Filters: `{ genres: ['Horror'], runtimeMax: 90 }`
   Note: Only preset using `runtimeMax`. Comment at line 782–784 notes that upper-bound semantics are not yet implemented in `buildTMDBQueryFromFilters`, so the runtime filter may not apply in the TMDB query yet.

7. **Epic cinema, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ minRating: 8, minVotes: 20000 }`
   Note: Broad filter (no genre restriction); relies on rating + vote floor to identify prestige films. Comment at line 782–784 notes a dropped `runtimeMax` constraint.

8. **Romance, 8.0+**
   Tag: `'GENRE · RATING'`
   Color: `'cyan'`
   Filters: `{ genres: ['Romance', 'Drama'], minRating: 8 }`

---

### SOURCE + MOOD (Keyword/Theme-based, 7 entries, indices 44–50)
All use TMDB `keyword` IDs for thematic filtering. Keywords are translated at line 1087–1090; they populate the `themes` section of the sidebar. These are the most content-specific presets and rely on TMDB's keyword taxonomy.

1. **Based on novels, 8.0+**
   Tag: `'SOURCE · RATING'`
   Color: `'purple'`
   Filters: `{ keyword: { id: 818, name: 'Based on novel' }, minRating: 8 }`
   Note: TMDB keyword ID 818 ("Based on novel") combined with quality floor. Produces high-quality literary adaptations.

2. **True crime stories**
   Tag: `'GENRE · SOURCE'`
   Color: `'purple'`
   Filters: `{ genres: ['Crime', 'Thriller'], keyword: { id: 9672, name: 'Based on true story' } }`
   Note: Keyword ID 9672. Note this exact keyword also appears in the Spotlight preset (index 0).

3. **Coming-of-age, 1980s**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Drama'], decade: '1980', keyword: { id: 10683, name: 'Coming of age' } }`
   Note: Keyword ID 10683; era-specific.

4. **Heist films, 2000s+**
   Tag: `'GENRE · ERA'`
   Color: `'purple'`
   Filters: `{ genres: ['Crime', 'Thriller'], decade: '2000', keyword: { id: 10051, name: 'Heist' } }`
   Note: Keyword ID 10051; era-specific (2000 onwards).

5. **Supernatural horror, 1970s–80s**
   Tag: `'GENRE · DECADE'`
   Color: `'purple'`
   Filters: `{ genres: ['Horror'], decade: '1970' }`
   Note: Despite the name mentioning "1970s–80s", the filter only specifies `decade: '1970'` (1970–1979). Does NOT include a keyword filter for "supernatural" — filter is overspecified by name but underspecified in the actual filter object. **Flag: name↔filter mismatch.**

6. **Road movies, any era**
   Tag: `'GENRE · THEME'`
   Color: `'purple'`
   Filters: `{ genres: ['Drama', 'Adventure'], keyword: { id: 7312, name: 'Road trip' } }`
   Note: Keyword ID 7312 ("Road trip"); no decade restriction.

7. **Courtroom dramas**
   Tag: `'GENRE · THEME'`
   Color: `'purple'`
   Filters: `{ genres: ['Drama', 'Thriller'], keyword: { id: 33519, name: 'Courtroom drama' } }`
   Note: Keyword ID 33519; no decade restriction.

---

### FRANCHISES (Specific movie series via TMDB Collections, 9 entries, indices 51–59)
All use TMDB `collection` IDs. Collections are translated at line 1093–1100 and populate the `universes` section. These are the most restrictive filters (targeting specific film franchises). Comment at line 815–816 notes a May 16, 2026 change to the James Bond preset: switched from broad Action+Thriller+UK filters (~4,835 results) to TMDB James Bond Collection ID 645 (~27 films).

1. **Harry Potter & Wizarding World**
   Tag: `'FRANCHISE · GENRE'`
   Color: `'cyan'`
   Filters: `{ genres: ['Fantasy', 'Adventure'], collection: { id: 1241, name: 'Harry Potter Collection' } }`

2. **The Alien universe**
   Tag: `'FRANCHISE · GENRE'`
   Color: `'cyan'`
   Filters: `{ genres: ['Science Fiction', 'Horror'], collection: { id: 8091, name: 'Alien Collection' } }`

3. **Predator films**
   Tag: `'FRANCHISE · GENRE'`
   Color: `'cyan'`
   Filters: `{ genres: ['Action', 'Science Fiction', 'Horror'], collection: { id: 399, name: 'Predator Collection' } }`

4. **Alien vs. Predator**
   Tag: `'FRANCHISE · ERA'`
   Color: `'cyan'`
   Filters: `{ genres: ['Science Fiction', 'Horror'], decade: '2000', collection: { id: 735, name: 'Alien vs. Predator Collection' } }`
   Note: Decade-restricted (2000 onwards) within the collection filter.

5. **James Bond saga**
   Tag: `'FRANCHISE'`
   Color: `'cyan'`
   Filters: `{ collection: { id: 645, name: 'James Bond Collection' } }`
   Note: **Recently fixed (May 16, 2026).** Was previously `{ genres: ['Action', 'Thriller'], region: { code: 'GB', name: 'United Kingdom' } }` which returned ~4,835 films. Now uses TMDB collection ID 645, returning ~27 films (all actual Bond movies). This is the only franchise preset that uses ONLY the collection filter with no genre/region padding.

6. **Marvel Cinematic Universe**
   Tag: `'FRANCHISE · ERA'`
   Color: `'cyan'`
   Filters: `{ genres: ['Action', 'Science Fiction'], decade: '2010', collection: { id: 131295, name: 'Marvel Cinematic Universe' } }`
   Note: Decade-restricted (2010 onwards).

7. **Star Wars saga**
   Tag: `'FRANCHISE · GENRE'`
   Color: `'cyan'`
   Filters: `{ genres: ['Science Fiction', 'Fantasy'], collection: { id: 10, name: 'Star Wars Collection' } }`

8. **Middle-earth films**
   Tag: `'FRANCHISE · GENRE'`
   Color: `'cyan'`
   Filters: `{ genres: ['Fantasy', 'Adventure'], collection: { id: 119, name: 'The Lord of the Rings Collection' } }`

9. **Mission: Impossible series**
   Tag: `'FRANCHISE · ERA'`
   Color: `'cyan'`
   Filters: `{ genres: ['Action', 'Thriller'], collection: { id: 87359, name: 'Mission: Impossible Collection' } }`

---

### OTHER / UNCATEGORIZED (1 entry, index 60)

1. **Time travel adventures**
   Tag: `'GENRE · CONCEPT'`
   Color: `'cyan'`
   Filters: `{ genres: ['Science Fiction', 'Adventure'], keyword: { id: 4379, name: 'Time travel' } }`
   Note: Uses a keyword filter (ID 4379) to target a thematic concept. Could logically fit in "Source + Mood" but is placed separately in the pool, suggesting it's either a newer addition or represents a distinct thematic tier.

---

## Summary

**Total: 61 presets**
- Spotlight (special rotation): 1
- Awards-based: 8
- Region-based: 12
- Curated Era (Genre + Decade): 15
- Rating + Mood (Prestige): 8
- Source + Mood (Keywords): 7
- Franchises (Collections): 9
- Other (Thematic Concepts): 1

---

## Suspicious / Overly Broad Presets

1. **"Supernatural horror, 1970s–80s" (index 49)**
   **Issue:** Name says "1970s–80s" but filter only specifies `decade: '1970'` and no keyword for "supernatural". Missing the second decade (1980) and missing a keyword filter that would actually disambiguate "supernatural" from generic horror. **Result:** Returns all 1970s horror films, not just supernatural ones. The 1980s are completely missing.

2. **"Hidden gems, 7.5+ pre-1970" (index 39)**
   **Note:** Uses `decade: '1960'` to mean "pre-1970", which technically only covers 1960–1969. Films from the 1950s, 1940s, and earlier are excluded despite the name suggesting "pre-1970". Not suspicious per se (the filter is well-defined), but the name is slightly misleading.

3. **"Epic cinema, 8.0+" (index 42)**
   **Note:** Has a comment at line 782–784 noting that `runtimeMax` was dropped and will be added when `buildTMDBQueryFromFilters` is extended. Currently filters only on `minRating: 8` and `minVotes: 20000` with no genre or decade constraints. This is extremely broad (all highly-rated films with 20K+ votes). Works as a prestige-first preset, but "epic" is not actually enforced by the filter.

---

## Filter-Application Semantics

- Presets are translated via `presetToStateFilters()` (line 987) into an array of sidebar filter chips.
- Each filter key (genre, award, region, keyword, collection, etc.) becomes a separate chip in its respective section.
- When a preset is clicked, all chips are added to `state.filters` and `updateUIFromState()` re-renders the sidebar.
- The actual TMDB API query is built separately in `buildTMDBQueryFromFilters()` (location not shown, but referenced in comments at lines 1036–1043).
- Keywords and collections are passed through to TMDB natively; regions, genres, awards, and ratings are translated into TMDB query parameters.

---

## Data Currency Note

Last update to this pool: **2026-05-16** (James Bond preset revision). The pool is stable and well-curated as of the audit date.
