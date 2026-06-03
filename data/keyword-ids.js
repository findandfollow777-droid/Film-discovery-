/* ============================================================
   ORBIT KEYWORD & COLLECTION IDS
   Pre-looked-up TMDB IDs — verified May 2026

   KEYWORD IDs    → with /discover/movie?with_keywords=ID
   COLLECTION IDs → fetch /collection/ID for movie list
                    (existing Universe Mode launch path handles this)
   ============================================================ */

const ORBIT_KEYWORD_IDS = {
  // CONCEPTS & THEMES
  'time-travel':         { id: 4379,   label: 'Time travel',         type: 'keyword' },
  'heist':               { id: 10051,  label: 'Heist',               type: 'keyword' },
  'dystopia':            { id: 4565,   label: 'Dystopia',            type: 'keyword' },
  'serial-killer':       { id: 10714,  label: 'Serial killer',       type: 'keyword' },
  'revenge':             { id: 9748,   label: 'Revenge',             type: 'keyword' },
  'coming-of-age':       { id: 10683,  label: 'Coming of age',       type: 'keyword' },
  'vampire':             { id: 3133,   label: 'Vampire',             type: 'keyword' },
  'superhero':           { id: 9715,   label: 'Superhero',           type: 'keyword' },
  'space':               { id: 9882,   label: 'Space',               type: 'keyword' },
  'ghost':               { id: 162846, label: 'Ghost',               type: 'keyword' },
  'found-footage':       { id: 11322,  label: 'Found footage',       type: 'keyword' },
  'post-apocalyptic':    { id: 4458,   label: 'Post-apocalyptic',    type: 'keyword' },
  'based-on-true-story': { id: 9672,   label: 'Based on true story', type: 'keyword' },
  /* Phase 3 (May 9, 2026): road-trip remapped 818 → 7312. TMDB id 818 is
     actually "based on novel or book" — the original mapping was wrong
     and the Popular Themes "Road trip" chip had been hitting novels. */
  'road-trip':           { id: 7312,   label: 'Road trip',           type: 'keyword' },
  'espionage':           { id: 10485,  label: 'Espionage',           type: 'keyword' },

  // Phase 3 additions
  'based-on-novel':      { id: 818,    label: 'Based on novel',      type: 'keyword' },
  'courtroom':           { id: 33519,  label: 'Courtroom drama',     type: 'keyword' },

  // FILM SERIES (collections — use collection endpoint)
  'harry-potter':        { id: 1241,   label: 'Harry Potter Collection',         type: 'collection' },
  /* 2026-05-16: 'star-wars' upgraded to extended-collection (Skywalker
     saga + Rogue One + Solo + Mando & Grogu). Keeps the legacy `id: 10`
     so the Universes-tab "Star Wars" chip click still works against the
     /collection/{id} flow. PRESET_POOL entries that reference the slug
     pick up the extended `ids` list instead via presetToStateFilters. */
  'star-wars':           { id: 10, ids: [11, 1891, 1892, 1893, 1894, 1895, 140607, 181808, 181812, 330459, 348350, 1228710],
                           label: 'Star Wars', type: 'extended-collection' },
  'james-bond':          { id: 645,    label: 'James Bond Collection',           type: 'collection' },
  'alien':               { id: 8091,   label: 'Alien Collection',                type: 'collection' },
  'predator':            { id: 399,    label: 'Predator Collection',             type: 'collection' },
  'avp':                 { id: 735,    label: 'Alien vs. Predator Collection',   type: 'collection' },
  'mission-impossible':  { id: 87359,  label: 'Mission: Impossible Collection',  type: 'collection' },
  'lotr':                { id: 119,    label: 'The Lord of the Rings Collection', type: 'collection' },
  'mcu':                 { id: 131295, label: 'Marvel Cinematic Universe',       type: 'collection' },

  // EXTENDED COLLECTIONS (2026-05-16) — hand-curated TMDB movie ID lists
  // for franchises that aren't represented as a single TMDB collection.
  // Resolved at filter-application time in presetToStateFilters (string
  // slug detected on `collection.id` → registry lookup → filter with
  // type: 'extended-collection').
  'wizarding-world':     { ids: [671, 672, 673, 674, 675, 767, 12444, 12445,  // HP 1-8
                                 259316, 338952, 338953],                       // Fantastic Beasts 1-3
                           label: 'The Wizarding World', type: 'extended-collection' },
  'fast-furious':        { ids: [9799, 584, 9615, 13804, 51497, 82992, 168259, 337339, 385128, 385687, 755679,  // Main series
                                 384018],                                                                          // Hobbs & Shaw
                           label: 'Fast & Furious', type: 'extended-collection' },
  'planet-apes':         { ids: [871, 1685, 1687, 1688, 1705,        // Original 5 (1968-1973)
                                 869,                                  // Tim Burton (2001)
                                 61791, 119450, 281338, 653346],      // Modern 4 (2011-2024)
                           label: 'Planet of the Apes', type: 'extended-collection' }
};
