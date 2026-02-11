/* ============================================
   ORBIT - Awards Browse Database
   Verified TMDB IDs + poster paths
============================================ */

// ── SVG glyphs for festival tabs / badges / tooltip rows (v4 outline, badge-size) ──
const AWARD_SVGS = {
  Oscar: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><ellipse cx="50" cy="20" rx="5" ry="6"/><path d="M38 32 Q50 28 62 32 L62 38 Q60 44 48 42 M38 32 L38 38 Q40 44 52 42"/><line x1="50" y1="26" x2="50" y2="50"/><path d="M38 38 L40 56 Q50 62 60 56 L62 38"/><ellipse cx="50" cy="74" rx="12" ry="4"/><path d="M36 78 L36 88 Q50 92 64 88 L64 78"/></g></svg>',
  Cannes: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><path d="M50 85 Q48 70 50 55 Q52 40 50 12"/><path d="M50 50 Q42 48 30 52 M50 40 Q40 36 24 36 M50 30 Q44 24 34 20"/><path d="M50 50 Q58 48 70 52 M50 40 Q60 36 76 36 M50 30 Q56 24 66 20"/><rect x="40" y="85" width="20" height="8" rx="1"/></g></svg>',
  Venice: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><path d="M72 38 Q78 34 76 28 Q66 20 54 16 Q54 20 52 20"/><path d="M72 38 Q76 42 78 46 L82 48"/><path d="M52 20 Q38 28 30 44 L28 58 Q50 66 72 52"/><path d="M42 44 Q38 36 42 28 Q52 32 56 30"/><rect x="16" y="82" width="68" height="6" rx="1"/></g></svg>',
  Berlin: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><circle cx="40" cy="16" r="4"/><circle cx="60" cy="16" r="4"/><ellipse cx="50" cy="24" rx="12" ry="10"/><path d="M38 32 Q32 40 32 52 L32 70 Q50 78 68 70 L68 52 Q68 40 62 32"/><path d="M32 42 Q22 40 18 52"/><path d="M68 42 Q78 40 82 52"/><ellipse cx="44" cy="86" rx="6" ry="3"/><ellipse cx="56" cy="86" rx="6" ry="3"/></g></svg>',
  BAFTA: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><path d="M50 10 Q68 10 72 26 L72 38 Q72 54 50 62 Q28 54 28 38 L28 26 Q32 10 50 10 Z"/><path d="M36 28 Q32 32 34 40 Q42 44 44 34 Q40 28 36 28 Z"/><path d="M64 28 Q68 32 66 40 Q58 44 56 34 Q60 28 64 28 Z"/><line x1="50" y1="62" x2="50" y2="74"/><path d="M34 78 L34 92 L66 92 L66 78 Z"/></g></svg>',
  GoldenGlobe: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="4" fill="none"/><g stroke="currentColor" stroke-width="3" fill="none"><circle cx="50" cy="34" r="20"/><ellipse cx="50" cy="34" rx="20" ry="7"/><ellipse cx="50" cy="34" rx="7" ry="20"/><path d="M46 56 L46 66 L54 66 L54 56"/><path d="M36 66 L36 72 L64 72 L64 66"/><ellipse cx="50" cy="84" rx="16" ry="4"/></g></svg>'
};

// ── Detailed SVG glyphs for info panel (v4 outline, full 100×100 detail) ──
const AWARD_SVGS_DETAIL = {
  Oscar: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="50" cy="20" rx="5" ry="6"/><path d="M47 26 L47 29 M53 26 L53 29"/><path d="M38 32 Q42 30 50 32 Q58 30 62 32"/><path d="M38 32 L38 38 Q40 44 52 42"/><path d="M62 32 L62 38 Q60 44 48 42"/><ellipse cx="50" cy="42" rx="4" ry="2"/><line x1="50" y1="26" x2="50" y2="50"/><line x1="46" y1="40" x2="54" y2="40"/><circle cx="50" cy="25" r="2"/><path d="M38 38 L40 56 Q44 60 50 60 Q56 60 60 56 L62 38"/><path d="M44 60 L44 70 M56 60 L56 70"/><path d="M44 70 Q50 72 56 70"/><ellipse cx="50" cy="74" rx="12" ry="4"/><circle cx="50" cy="74" r="3"/><circle cx="42" cy="74" r="1.5"/><circle cx="58" cy="74" r="1.5"/><path d="M36 78 L36 88 Q36 90 50 90 Q64 90 64 88 L64 78"/><ellipse cx="50" cy="78" rx="14" ry="3"/></g></svg>',
  Cannes: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M50 85 Q48 70 50 55 Q52 40 50 25 Q49 18 50 12"/><path d="M50 55 Q44 54 35 58"/><path d="M50 50 Q42 48 30 52"/><path d="M50 45 Q40 42 26 44"/><path d="M50 40 Q40 36 24 36"/><path d="M50 35 Q42 30 28 28"/><path d="M50 30 Q44 24 34 20"/><path d="M50 25 Q46 20 40 14"/><path d="M50 20 Q48 16 46 10"/><path d="M50 55 Q56 54 65 58"/><path d="M50 50 Q58 48 70 52"/><path d="M50 45 Q60 42 74 44"/><path d="M50 40 Q60 36 76 36"/><path d="M50 35 Q58 30 72 28"/><path d="M50 30 Q56 24 66 20"/><path d="M50 25 Q54 20 60 14"/><path d="M50 20 Q52 16 54 10"/><rect x="40" y="85" width="20" height="8" rx="1"/></g></svg>',
  Venice: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M72 38 Q78 34 76 28 Q72 30 70 28 Q72 24 68 22 Q66 26 64 24 Q66 20 62 18 Q60 22 58 20 Q58 16 54 16 Q54 20 52 20"/><path d="M72 38 Q76 42 78 46 L82 48 Q84 46 86 48"/><path d="M78 46 Q76 50 72 52"/><circle cx="76" cy="42" r="2"/><path d="M70 34 Q72 30 68 32"/><path d="M52 20 Q44 22 38 28 Q32 34 30 44 L28 58"/><path d="M72 52 Q66 56 58 58 Q50 60 42 58 L28 58"/><path d="M58 58 L60 68 Q62 72 58 74"/><path d="M48 58 L46 72 Q44 76 48 78"/><path d="M32 58 L30 72 Q28 76 32 78"/><path d="M28 56 Q24 62 22 72 Q20 76 24 78"/><path d="M28 54 Q20 50 18 44 Q20 42 22 44"/><path d="M42 44 Q38 36 42 28 Q48 32 56 30"/><path d="M42 28 Q46 22 52 24"/><path d="M44 32 Q48 28 54 28"/><rect x="16" y="82" width="68" height="6" rx="1"/></g></svg>',
  Berlin: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="16" r="4"/><circle cx="60" cy="16" r="4"/><ellipse cx="50" cy="24" rx="12" ry="10"/><ellipse cx="50" cy="28" rx="5" ry="4"/><ellipse cx="50" cy="26" rx="2" ry="1.5"/><circle cx="44" cy="22" r="1.5"/><circle cx="56" cy="22" r="1.5"/><path d="M47 30 Q50 32 53 30"/><path d="M38 32 Q32 40 32 52 L32 70"/><path d="M62 32 Q68 40 68 52 L68 70"/><path d="M32 70 Q50 78 68 70"/><path d="M32 42 Q26 40 22 44 L18 52"/><path d="M68 42 Q74 40 78 44 L82 52"/><ellipse cx="18" cy="54" rx="4" ry="3"/><ellipse cx="82" cy="54" rx="4" ry="3"/><path d="M16 52 L15 50 M18 51 L18 49 M20 52 L21 50"/><path d="M80 52 L79 50 M82 51 L82 49 M84 52 L85 50"/><path d="M38 70 L38 82 Q38 86 44 86"/><path d="M62 70 L62 82 Q62 86 56 86"/><ellipse cx="44" cy="86" rx="6" ry="3"/><ellipse cx="56" cy="86" rx="6" ry="3"/><path d="M40 84 L39 82 M44 84 L44 82 M48 84 L49 82"/><path d="M52 84 L51 82 M56 84 L56 82 M60 84 L61 82"/></g></svg>',
  BAFTA: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M50 10 Q68 10 72 26 L72 38 Q72 54 50 62 Q28 54 28 38 L28 26 Q32 10 50 10 Z"/><path d="M36 28 Q32 32 34 40 Q38 44 44 40 Q46 34 42 28 Q38 26 36 28 Z"/><path d="M64 28 Q68 32 66 40 Q62 44 56 40 Q54 34 58 28 Q62 26 64 28 Z"/><path d="M50 32 L50 46"/><path d="M46 46 L50 52 L54 46"/><path d="M32 24 Q38 20 46 24"/><path d="M68 24 Q62 20 54 24"/><path d="M30 40 Q34 44 38 42"/><path d="M70 40 Q66 44 62 42"/><line x1="50" y1="62" x2="50" y2="74"/><path d="M34 78 L34 92 L66 92 L66 78 Z"/><path d="M34 78 L42 72 L74 72 L66 78"/><path d="M66 78 L74 72 L74 86 L66 92"/></g></svg>',
  GoldenGlobe: '<svg width="80" height="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="var(--glyph-ring, #00d9ff)" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="34" r="20"/><ellipse cx="50" cy="34" rx="20" ry="7"/><ellipse cx="50" cy="24" rx="16" ry="4"/><ellipse cx="50" cy="44" rx="16" ry="4"/><ellipse cx="50" cy="34" rx="7" ry="20"/><ellipse cx="50" cy="34" rx="14" ry="20"/><path d="M36 52 Q50 58 64 52"/><path d="M46 56 L46 66 L54 66 L54 56"/><path d="M36 66 L36 72 L64 72 L64 66 Z"/><ellipse cx="50" cy="76" rx="16" ry="4"/><path d="M34 76 L34 84 Q34 88 50 88 Q66 88 66 84 L66 76"/><ellipse cx="50" cy="88" rx="16" ry="4"/></g></svg>'
};

// ── Festival metadata ─────────────────────────
const FESTIVAL_INFO = {
  Oscar: {
    name: "Academy Awards (Oscars)",
    founded: 1929,
    location: "Los Angeles, USA",
    season: "February / March",
    topAward: "Best Picture",
    description: "The Academy Awards, popularly known as the Oscars, are presented annually by the Academy of Motion Picture Arts and Sciences. They are widely regarded as the most prestigious and significant awards in the film industry worldwide.",
    notableWinners: ["Parasite (2020) — First non-English Best Picture", "The Lord of the Rings: The Return of the King (2004) — 11 wins", "Titanic (1998) — 11 wins", "Ben-Hur (1960) — 11 wins"]
  },
  Cannes: {
    name: "Cannes Film Festival",
    founded: 1946,
    location: "Cannes, France",
    season: "May",
    topAward: "Palme d'Or",
    description: "The Festival de Cannes is the world's most prestigious film festival, previewing new films of all genres from around the world. The Palme d'Or ('Golden Palm') is awarded to the best film in the main competition.",
    notableWinners: ["Parasite (2019) — Later won Oscar Best Picture", "The Tree of Life (2011)", "Pulp Fiction (1994)", "Apocalypse Now (1979)"]
  },
  Venice: {
    name: "Venice International Film Festival",
    founded: 1932,
    location: "Venice, Italy",
    season: "August / September",
    topAward: "Golden Lion",
    description: "The oldest film festival in the world, held annually on the island of Lido in Venice. The Golden Lion has become a major predictor of Oscar success, with recent winners like Nomadland and Joker going on to major Academy Award wins.",
    notableWinners: ["Nomadland (2020) — Also won Oscar Best Picture", "Joker (2019) — Joaquin Phoenix won Oscar", "Roma (2018) — Alfonso Cuarón's masterwork", "Brokeback Mountain (2005)"]
  },
  Berlin: {
    name: "Berlin International Film Festival (Berlinale)",
    founded: 1951,
    location: "Berlin, Germany",
    season: "February",
    topAward: "Golden Bear",
    description: "One of the 'Big Three' European film festivals alongside Cannes and Venice. The Berlinale is known for championing politically engaged and socially conscious cinema. The Golden Bear is awarded to the best film in competition.",
    notableWinners: ["Taxi (2015) — Jafar Panahi, filmed secretly", "Spirited Away (2002) — First animated Golden Bear", "The Thin Red Line (1998)", "12 Angry Men (1957)"]
  },
  BAFTA: {
    name: "BAFTA Film Awards",
    founded: 1949,
    location: "London, UK",
    season: "February",
    topAward: "Best Film",
    description: "The British Academy Film Awards are presented by the British Academy of Film and Television Arts (BAFTA). Often seen as a bellwether for the Oscars, BAFTA voters overlap with Academy members and the ceremony takes place shortly before the Academy Awards.",
    notableWinners: ["Oppenheimer (2024) — 7 BAFTA wins", "Nomadland (2021)", "Roma (2019)", "Three Billboards (2018)"]
  },
  GoldenGlobe: {
    name: "Golden Globe Awards",
    founded: 1944,
    location: "Beverly Hills, USA",
    season: "January",
    topAward: "Best Motion Picture – Drama",
    description: "Presented by the Hollywood Foreign Press Association, the Golden Globes recognize excellence in film and television. Uniquely, the Globes split Best Picture into two categories: Drama, and Musical or Comedy.",
    notableWinners: ["Oppenheimer (2024 Drama)", "La La Land (2017 Musical/Comedy)", "Boyhood (2015 Drama)", "The Grand Budapest Hotel (2015 Musical/Comedy)"]
  }
};

// ── Category metadata ─────────────────────────
const CATEGORY_INFO = {
  Oscar: {
    "Best Picture": { description: "Awarded to the producers of the best film of the year. The most coveted prize in cinema.", firstAwarded: 1929, equivalent: "BAFTA Best Film, Cannes Palme d'Or" },
    "Best Director": { description: "Recognizes the director who has exhibited outstanding directing achievement in a motion picture.", firstAwarded: 1929, equivalent: "Cannes Best Director prize" },
    "Best Actor": { description: "Awarded to the male actor who delivers the most outstanding leading performance in a film.", firstAwarded: 1929, equivalent: "Cannes Best Actor, BAFTA Leading Actor" },
    "Best Actress": { description: "Awarded to the female actor who delivers the most outstanding leading performance in a film.", firstAwarded: 1929, equivalent: "Cannes Best Actress, BAFTA Leading Actress" },
    "Best Supporting Actor": { description: "Recognizes the best performance by a male actor in a supporting role.", firstAwarded: 1937 },
    "Best Supporting Actress": { description: "Recognizes the best performance by a female actor in a supporting role.", firstAwarded: 1937 }
  },
  Cannes: {
    "Palme d'Or": { description: "The highest prize awarded at Cannes. Films compete for the Palme d'Or ('Golden Palm'), selected by an international jury.", firstAwarded: 1955, equivalent: "Oscar Best Picture, Venice Golden Lion" },
    "Grand Prix": { description: "The second most prestigious award at Cannes, recognizing outstanding artistic achievement. Often highlights bold, innovative filmmaking.", firstAwarded: 1946, equivalent: "Venice Grand Jury Prize" }
  },
  Venice: {
    "Golden Lion": { description: "The highest prize at the Venice Film Festival. Named after the winged lion of Saint Mark, symbol of Venice.", firstAwarded: 1949, equivalent: "Cannes Palme d'Or, Oscar Best Picture" }
  },
  Berlin: {
    "Golden Bear": { description: "The highest award at the Berlin International Film Festival. Named after the bear, the heraldic animal of Berlin.", firstAwarded: 1951, equivalent: "Cannes Palme d'Or, Venice Golden Lion" }
  },
  BAFTA: {
    "Best Film": { description: "The top prize at the BAFTA Film Awards, recognizing the best film of the year as voted by BAFTA members.", firstAwarded: 1949, equivalent: "Oscar Best Picture" }
  },
  GoldenGlobe: {
    "Best Motion Picture - Drama": { description: "Recognizes the best dramatic film of the year, as voted by the Hollywood Foreign Press Association.", firstAwarded: 1944, equivalent: "Oscar Best Picture" },
    "Best Motion Picture - Musical or Comedy": { description: "Recognizes the best musical or comedy film of the year. This unique split allows lighter films to receive top honors.", firstAwarded: 1952 }
  }
};

// ── Helper: compact movie entry ───────────────
function M(title, tmdb_id, poster_path, person) {
  const entry = { title, tmdb_id, poster_path };
  if (person) entry.person = person;
  return entry;
}

// ── Main awards database ──────────────────────

const AWARDS_BROWSE_DATABASE = {

  // ============================
  //  OSCAR
  // ============================
  Oscar: {

    "Best Actor": {
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        nominees: [
          M("Maestro", 523607, "/kxj7rMco6RNYsVcNwuGAIlfWu64.jpg"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg"),
          M("The Coffee Table", 1056380, "/r8S7cc676EfgfUDVQKPrqRlbRFz.jpg")
        ]
      },
      2023: { winner: M("The Whale", 785084, "/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg"), nominees: [] },
      2022: { winner: M("King Richard", 614917, "/2dfujXrxePtYJPiPHj1HkAFQvpu.jpg"), nominees: [] },
      2021: { winner: M("The Father", 600354, "/pr3bEQ517uMb5loLvjFQi8uLAsp.jpg"), nominees: [] },
      2020: { winner: M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"), nominees: [] },
      2019: { winner: M("Bohemian Rhapsody", 424694, "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg"), nominees: [] },
      2018: { winner: M("Darkest Hour", 399404, "/xa6G3aKlysQeVg9wOb0dRcIGlWu.jpg"), nominees: [] },
      2017: { winner: M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg"), nominees: [] },
      2016: { winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg"), nominees: [] },
      2015: { winner: M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg"), nominees: [] },
      2014: { winner: M("Dallas Buyers Club", 152532, "/7Fdh7gUq3plvQqxRbNYhWvDABXA.jpg"), nominees: [] },
      2013: { winner: M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg"), nominees: [] },
      2012: { winner: M("Hidden Children", 74603, "/qpVdG0PaeTo0cLoA72MCaSZr1xR.jpg"), nominees: [] },
      2011: { winner: M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg"), nominees: [] },
      2010: { winner: M("She's All That", 10314, "/a0pepZNFCjggc7Na9gEwbTI1f46.jpg"), nominees: [] },
      2009: { winner: M("How to Train Your Dragon", 10191, "/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg"), nominees: [] },
      2008: { winner: M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg"), nominees: [] },
      2007: { winner: M("The Host", 1255, "/dEDLY3KeghKFzks5nTDWdigVikr.jpg"), nominees: [] },
      2006: { winner: M("Star Wars: Episode I - The Phantom Menace", 1893, "/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg"), nominees: [] },
      2005: { winner: M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"), nominees: [] },
      2004: { winner: M("Mystic River", 322, "/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg"), nominees: [] },
      2003: { winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg"), nominees: [] },
      2002: { winner: M("Training Day", 2034, "/bUeiwBQdupBLQthMCHKV7zv56uv.jpg"), nominees: [] },
      2001: { winner: M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"), nominees: [] },
      2000: { winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"), nominees: [] },
      1999: { winner: M("Life Is Beautiful", 637, "/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg"), nominees: [] },
      1998: { winner: M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"), nominees: [] },
      1997: { winner: M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg"), nominees: [] },
      1996: { winner: M("Leaving Las Vegas", 451, "/wTrFpGe3U65kXTldIUxuM2hmOAK.jpg"), nominees: [] },
      1995: { winner: M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"), nominees: [] },
      1994: { winner: M("Philadelphia", 9800, "/tFe5Yoo5zT495okA49bq1vPPkiV.jpg"), nominees: [] },
      1993: { winner: M("Scent of a Woman", 9475, "/4adI7IaveWb7EidYXfLb3MK3CgO.jpg"), nominees: [] },
      1992: { winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"), nominees: [] },
      1991: { winner: M("Reversal of Fortune", 38718, "/jEmFeHPsoyHk6RRZslKzC5NVFad.jpg"), nominees: [] },
      1990: { winner: M("My Left Foot: The Story of Christy Brown", 10161, "/GRAAl0bMQFoFIjV3aunc5jsM5u.jpg"), nominees: [] },
      1989: { winner: M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg"), nominees: [] },
      1988: { winner: M("Wall Street", 10673, "/2tQYq9ntzn2dEwDIGLBSipYPenv.jpg"), nominees: [] },
      1987: { winner: M("The Color of Money", 11873, "/dVdnHmdQu3JtLAAksjTmTEF76gD.jpg"), nominees: [] },
      1986: { winner: M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg"), nominees: [] },
      1985: { winner: M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg"), nominees: [] },
      1984: { winner: M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg"), nominees: [] },
      1983: { winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg"), nominees: [] },
      1982: { winner: M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg"), nominees: [] },
      1981: { winner: M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg"), nominees: [] },
      1980: { winner: M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg"), nominees: [] },
      1979: { winner: M("Coming Home", 1118435, ""), nominees: [] },
      1978: { winner: M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg"), nominees: [] },
      1977: { winner: M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"), nominees: [] },
      1976: { winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"), nominees: [] },
      1975: { winner: M("Harry and Tonto", 42448, "/2JIy2g5UoHBnmNnFpSU7oq5xdTG.jpg"), nominees: [] },
      1974: { winner: M("Save the Tiger", 38714, "/htLwmbIc8L2ufP5g4Wv5OWCOYMl.jpg"), nominees: [] },
      1973: { winner: M("The Godfather", 238, "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"), nominees: [] },
      1972: { winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg"), nominees: [] },
      1971: { winner: M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg"), nominees: [] },
      1970: { winner: M("True Grit", 17529, "/lmexRC57l39elaIcnxhaHpcaIW2.jpg"), nominees: [] },
      1969: { winner: M("Charly", 29146, "/uxGt80D4hxEEwGwdOJ5tdVvjXEC.jpg"), nominees: [] },
      1968: { winner: M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg"), nominees: [] },
      1967: { winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg"), nominees: [] },
      1966: { winner: M("Cat Ballou", 11694, "/3WJmB1F5z4mLwt84i1FuIrSYEe.jpg"), nominees: [] },
      1965: { winner: M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg"), nominees: [] },
      1964: { winner: M("Lilies of the Field", 38805, "/gYoVx2m8NP2hTWnEpwNeROIWrQ4.jpg"), nominees: [] },
      1963: { winner: M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg"), nominees: [] },
      1962: { winner: M("Judgment at Nuremberg", 821, "/b6vYatvui1EXeFYfpDX4rcbueuP.jpg"), nominees: [] },
      1961: { winner: M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg"), nominees: [] },
      1960: { winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg"), nominees: [] },
      1959: { winner: M("Separate Tables", 43136, "/y8exawP0Je3MXVIS3olpJ2fu07.jpg"), nominees: [] },
      1958: { winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg"), nominees: [] },
      1957: { winner: M("The King and Four Queens", 43310, "/w6lTWootXbnAH0HwPcEkShId9jH.jpg"), nominees: [] },
      1956: { winner: M("Marty", 15919, "/8tnGO5VoAQII4DbE3hozWKhV4BY.jpg"), nominees: [] },
      1955: { winner: M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg"), nominees: [] },
      1954: { winner: M("Stalag 17", 632, "/lfve9FDKjT7JPbWI9NCs5340F79.jpg"), nominees: [] },
      1953: { winner: M("High Noon", 288, "/qETSMQ4IXBSAS409Z9OL0ppXWTW.jpg"), nominees: [] },
      1952: { winner: M("The African Queen", 488, "/2Ypg0KhQfFYWILelvHGtSHHR0dk.jpg"), nominees: [] },
      1951: { winner: M("Cyrano de Bergerac", 11673, "/80XJ5UkGuYTKDuALeG03BLk1OT1.jpg"), nominees: [] },
      1950: { winner: M("All the King's Men", 25430, "/7o8nnvFnkekDAlIYznNUWzxQFM6.jpg"), nominees: [] }
    },

    "Best Actress": {
      2024: {
        winner: null,
        nominees: [
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg"),
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg"),
          M("NYAD", 895549, "/ydSqUhKFvg5cZ5OwImmf3K1R6SS.jpg"),
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg")
        ]
      },
      2023: {
        winner: M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg"),
        nominees: [M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg"), M("The Blonde", 1117680, "/vclbphf1PcI8dKulaIg0HmHQcL3.jpg")]
      },
      2022: {
        winner: M("The Eyes of Tammy Faye", 601470, "/h09nsvxZH72zx2U8gS8vrg47aRk.jpg"),
        nominees: [M("Being the Ricardos", 517088, "/oztBLWdRk5gApYmNdADXvXkLT5m.jpg"), M("Spencer", 716612, "/7GcqdBKaMM9BWXWN07BirBMkcBF.jpg")]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"),
        nominees: [
          M("Ma Rainey's Black Bottom", 615667, "/pvtyxijaBrCSbByXLcUIDDSvc40.jpg"),
          M("Pieces of a Woman", 641662, "/OgUfLlhfBFx5BPK6LzBWFvBW1w.jpg"),
          M("The United States vs. Billie Holiday", 566076, "/vEzkxuE2sJcmHYjXQHM8xvR9ICH.jpg")
        ]
      },
      2020: {
        winner: M("Judy", 491283, "/iqJhHjD6k6T07waELjMKDpQJUP.jpg"),
        nominees: [M("Harriet", 506528, "/bNmuY9vOx1AEh3G8G1IUppFKAgj.jpg"), M("Bombshell", 525661, "/gbPfvwBqbiHpQkYZQvVwB6MVauV.jpg")]
      },
      2019: {
        winner: null,
        nominees: [
          M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg"),
          M("Can You Ever Forgive Me?", 401847, "/y9pDvBdvU8Z5QjQ6Y4oF0Cq7p5j.jpg")
        ]
      },
      2018: {
        winner: M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg"),
        nominees: [M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg")]
      },
      2017: {
        winner: null,
        nominees: [
          M("Elle", 337674, "/z446adpGUVXXPxrLpKBGnYBcofk.jpg"),
          M("Loving", 339419, "/teNPeDIRGWxtvMaJsNa7lw5IgiL.jpg"),
          M("Jackie", 376866, "/nF9N33PfhizMEzbfxHoxXBo2vx9.jpg")
        ]
      },
      2016: {
        winner: M("Room", 264644, "/2hHDMeYyZjbGWn0BeNH1cTMxuM7.jpg"),
        nominees: [
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg"),
          M("Joy", 274479, "/nZAs0HbW82TI1i4Xid83M941Pki.jpg"),
          M("45 Years", 311291, "/8elIJYYXWq2HpcZ6TgVMC9EwTnn.jpg"),
          M("Brooklyn", 291678, "/eqVRQcGhl1CRRjjct78tRR2SPrk.jpg")
        ]
      },
      2015: {
        winner: null,
        nominees: [
          M("Two Days, One Night", 221902, "/2qpZZ5a5Axpk8OeCtrvNTQfJiB2.jpg"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg"),
          M("Wild", 228970, "/ohhWI4Xwf4m4HjbQiIkyAhLekUy.jpg")
        ]
      },
      2014: {
        winner: null,
        nominees: [
          M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg"),
          M("Philomena", 205220, "/eBUv2GmGdXmCk1AaSOmyiu70hN8.jpg"),
          M("August: Osage County", 152737, "/fvjxr77dfxdIOY3lvj0bHP4B5xT.jpg")
        ]
      },
      2013: {
        winner: null,
        nominees: [M("Amour", 86837, "/19hyCudualHxCD0GrEngqsi0wBF.jpg"), M("Beasts of the Southern Wild", 84175, "/nQJmWekGYlXhezGUb21xFfEfwhH.jpg")]
      },
      2012: {
        winner: null,
        nominees: [M("The Girl with the Dragon Tattoo", 65754, "/8bokS83zGdhaXgN9tjidUKmAftW.jpg"), M("My Week with Marilyn", 75900, "/5naqXRY1Zug5cyJJbO9H4DOg28q.jpg")]
      },
      2011: {
        winner: null,
        nominees: [M("The Kids Are All Right", 39781, "/xQ5XqZc82dDCcGjxY7voRKjhaKQ.jpg")]
      },
      2010: {
        winner: null,
        nominees: [M("Precious", 25793, "/d4ltLIDbvZskSwbzXqi0Hfv5ma4.jpg"), M("Julie & Julia", 24803, "/1QZNWOOwfRi86ZApGvr2TtJZPBK.jpg")]
      },
      2009: {
        winner: null,
        nominees: [M("Changeling", 3580, "/y9Qi39dL3PceGCH8afyC7QrhbhI.jpg"), M("Doubt", 14359, "/9lypT2ghNuUPYVJf66oe4fKvUqI.jpg")]
      },
      2008: {
        winner: M("La Vie en Rose", 1407, "/3b9DAONAsFRhJKu25R33PE3VwDh.jpg"),
        nominees: [
          M("Elizabeth: The Golden Age", 4517, "/oBQ64TyPEINgVpwKWriv3QsIDJb.jpg"),
          M("Away from Her", 1919, "/oyPE6i9sylR1UhTPFmniOHcQpKb.jpg"),
          M("Juno", 7326, "/jNIn2tVhpvFD6P9IojldI3mNYcn.jpg")
        ]
      },
      2007: {
        winner: null,
        nominees: [
          M("Volver", 219, "/m1ZUDGTFtVGE3zjTvF8OiQ9um5e.jpg"),
          M("Notes on a Scandal", 1259, "/ieX6ZO2Kf2qjoIBXbQW5awivbhY.jpg"),
          M("The Devil Wears Prada", 350, "/8912AsVuS7Sj915apArUFbv6F9L.jpg")
        ]
      },
      2006: {
        winner: M("Walk the Line", 69, "/p8lPTjvjOjTfvC1E9pmMwcF9vkn.jpg"),
        nominees: [M("Transamerica", 546, "/7LGWKXxYGTr2wJE0AdthPzzlczt.jpg"), M("Pride & Prejudice", 4348, "/o8UhmEbWPHmTUxP0lMuCoqNkbB3.jpg")]
      },
      2005: {
        winner: null,
        nominees: [M("Maria Full of Grace", 436, "/30CImATfvHWLXy6a3KmHXnYXB6c.jpg"), M("Eternal Sunshine of the Spotless Mind", 38, "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg")]
      },
      2004: {
        winner: M("Monster", 504, "/b45yfHtLk4TSSDxOLgMLBpShner.jpg"),
        nominees: [M("21 Grams", 470, "/wZ0l6or5juuVWqDkLEgaghs4f9l.jpg")]
      },
      2003: {
        winner: null,
        nominees: [
          M("Frida", 1360, "/a4hgR6aKoohB6MHni171jbi9BkU.jpg"),
          M("Unfaithful", 2251, "/bjiHEhuiwhIygzjczbTPAA07cGc.jpg"),
          M("Far from Heaven", 10712, "/9gQuvFDRPLx39smUvyafm36tp0d.jpg"),
          M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg")
        ]
      },
      2002: {
        winner: null,
        nominees: [
          M("Iris", 11889, "/pqtVPrv3xPLTUayC0bPruRjYWDF.jpg"),
          M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg"),
          M("In the Bedroom", 1999, "/IQj11YbraLDyPYaz79jtDoAscc.jpg")
        ]
      },
      2001: {
        winner: null,
        nominees: [
          M("Chocolat", 41951, "/qoFmpeLPaj3YC1DABs5QxC31aQ7.jpg"),
          M("Requiem for a Dream", 641, "/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg"),
          M("You Can Count on Me", 14295, "/7mGFmij1FZD5eUnNwvUjmpqrDl6.jpg")
        ]
      },
      2000: {
        winner: null,
        nominees: [
          M("Tumbleweeds", 55123, "/2SdW45O7bPDTe0zLzNHhEcacNAk.jpg"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg"),
          M("Music of the Heart", 26149, "/yKbzT8q9b65hc1eIZxuRsLxopi7.jpg")
        ]
      },
      1999: {
        winner: M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
        nominees: [M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg"), M("Hilary and Jackie", 46992, "/aE2NJH2sllQTmbpN6laKuM7NXYy.jpg")]
      },
      1998: {
        winner: M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"),
        nominees: [
          M("The Wings of the Dove", 45609, "/eb1ZnIEC8LMmMgwD2fIAmQOkcd.jpg"),
          M("Afterglow", 26941, "/c13Luo9O09ah6nMPrsr3zqlLyF9.jpg"),
          M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg")
        ]
      },
      1997: {
        winner: M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
        nominees: [M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"), M("Breaking the Waves", 145, "/dQWMcdHXUOSHtr7ypOCa5T79JMS.jpg")]
      },
      1996: {
        winner: null,
        nominees: [
          M("Casino", 524, "/gziIkUSnYuj9ChCi8qOu2ZunpSC.jpg"),
          M("The Bridges of Madison County", 688, "/aCBrhOQjhG397GLkEZ49zReQEKX.jpg"),
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg")
        ]
      },
      1995: {
        winner: null,
        nominees: [M("Nell", 1945, "/aIDp3x2YfijtdherR28pIH6yenn.jpg"), M("Tom & Viv", 46797, "/iw4ofGbX2AbJ4p17CixwnMjuoJ0.jpg")]
      },
      1994: {
        winner: null,
        nominees: [
          M("What's Love Got to Do with It", 15765, "/btC4819GhihmkCELqO3qgepNGos.jpg"),
          M("Six Degrees of Separation", 23210, "/oH0bl69uZZA6dAclgFRkm1Vwcry.jpg"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg"),
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg")
        ]
      },
      1993: {
        winner: null,
        nominees: [M("Indochine", 2731, "/sAemRfr6mOSwtQ76e4yUQVImo8B.jpg")]
      },
      1992: {
        winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"),
        nominees: [M("Thelma & Louise", 1541, "/gQSUVGR80RVHxJywtwXm2qa1ebi.jpg"), M("For the Boys", 25221, "/7cMupruGQjcm43mC30fTazT7pOe.jpg")]
      },
      1991: {
        winner: M("Misery", 1700, "/klPO5oh1LOxiPpdDXZo1ADgpKcw.jpg"),
        nominees: [M("Postcards from the Edge", 22414, "/uF7bO5UcenRgag0jpbVvKsGyfBK.jpg"), M("Mr. & Mrs. Bridge", 111815, "/e7YO2jyW4jmLGZybpTWIKtN7F1.jpg")]
      },
      1990: {
        winner: null,
        nominees: [M("The Fabulous Baker Boys", 10875, "/1nS8AxnoYE2Y1ANMpVKZnm8iLxP.jpg")]
      },
      1989: {
        winner: null,
        nominees: [M("The Fabulous Baker Boys", 10875, "/1nS8AxnoYE2Y1ANMpVKZnm8iLxP.jpg")]
      },
      1988: {
        winner: null,
        nominees: [M("Evil Angels", 35119, "/auyoK8OZh1sZldjJfy9RGzS6crV.jpg"), M("Gorillas in the Mist", 10130, "/utptKpx6cXxmbEGu4N4HIoSZ6IS.jpg")]
      },
      1987: {
        winner: M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg"),
        nominees: [M("Anna", 107285, "/6CJaiXo2DlX8mEVSwO7PsKpksqQ.jpg"), M("Ironweed", 40962, "/rqVu5FREmvI83jyPpY4jxLTVRxd.jpg")]
      },
      1986: {
        winner: M("Children of a Lesser God", 1890, "/tWMuw7YWWDpD9Iv652vfKELPZPR.jpg"),
        nominees: [
          M("Aliens", 679, "/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg"),
          M("Crimes of the Heart", 48259, "/yet0Ww2A7f5qT7MisDuIBSXdV3r.jpg"),
          M("Peggy Sue Got Married", 10013, "/tfuQcvQmURiMqB2VPwytU3cPpEm.jpg")
        ]
      },
      1985: {
        winner: M("The Trip to Bountiful", 47908, "/qJ6A6fvp8PLFxxLVPLveFUmTOCG.jpg"),
        nominees: [M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg"), M("Agnes of God", 24735, "/m2QrxkojSmQb9k4DN6qhovDHLwD.jpg")]
      },
      1984: {
        winner: M("Places in the Heart", 13681, "/bmWg3uVn700inqOiadxeFTmiqmV.jpg"),
        nominees: [M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg"), M("Country", 42087, "/2lcDRkDJVtFt06Z1oueZtobcJJz.jpg")]
      },
      1983: {
        winner: M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg"),
        nominees: [
          M("Silkwood", 12502, "/7Piz5R5dB6d7v1OWNaIn9GB4qZg.jpg"),
          M("Testament", 21259, "/sIc7cgiGi1p4YK4zFEiObCUztXj.jpg"),
          M("Yentl", 10269, "/AcCX4tKqwP5BTfRTQEqZW3qabl3.jpg")
        ]
      },
      1982: {
        winner: null,
        nominees: [
          M("Victor/Victoria", 12614, "/mCjXcPRM3Rc7gOCGeVrBdPvF2bk.jpg"),
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
          M("An Officer and a Gentleman", 2623, "/69adZbLeRk5TNQ3e0008dMnde9p.jpg"),
          M("Frances", 3526, "/eyUq8VBgoHncr0cXFTKgg3VPyfi.jpg")
        ]
      },
      1981: {
        winner: null,
        nominees: [
          M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg"),
          M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg"),
          M("Only When I Laugh", 42146, "/wmoUyAX4YaMafcsArz5XiOh5N4E.jpg")
        ]
      },
      1980: {
        winner: null,
        nominees: [M("Resurrection", 98864, "/8Oq0lF2a0Cqzp5NA8spLPola0lN.jpg")]
      },
      1978: {
        winner: null,
        nominees: [M("Same Time, Next Year", 37672, "/58un6toArCEcOfctQ5a2fuQrm4o.jpg"), M("Interiors", 15867, "/sTPy6Kfa1FRED1eaZdVex8b2MdB.jpg")]
      },
      1977: {
        winner: null,
        nominees: [M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg")]
      },
      1976: {
        winner: M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"),
        nominees: [
          M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg"),
          M("Carrie", 7340, "/8tT1rqlsTguyfUBMrbHR9cv1rxM.jpg"),
          M("Face to Face", 29454, "/ulh7ILYfvSZExCXENEhySvuZLLl.jpg")
        ]
      },
      1975: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"),
        nominees: [
          M("The Story of Adèle H.", 1829, "/ymzUeHZP5SguHeyx28aN3PLBReA.jpg"),
          M("Tommy", 11326, "/pAImVnqBJwoFAKrcpAe17JjLGUs.jpg"),
          M("Hedda", 42256, "/wRfvRWX5jnYLaKOXxj74G9eJ8IG.jpg")
        ]
      },
      1974: {
        winner: M("Alice Doesn't Live Here Anymore", 16153, "/A99yzz1W3NCG6zR2HXSwn2kWlse.jpg"),
        nominees: [
          M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg"),
          M("Claudine", 55909, "/9mLM4Vx0L5kjaHPFXSe3ZgBEBCx.jpg"),
          M("A Woman Under the Influence", 29845, "/6EJ4JoTxnH1QmGTE9pPzgtW1cLW.jpg")
        ]
      },
      1973: {
        winner: M("A Touch of Class", 42458, "/iEjIwaaXlg8fK7uyNdQU2ityj8v.jpg"),
        nominees: [M("The Way We Were", 10236, "/o5x563ze56iI4iNsCBxTnDkt28i.jpg"), M("Summer Wishes, Winter Dreams", 92311, "/iphqHtyVjeuuzYjRUM0DBezYPY1.jpg")]
      },
      1972: {
        winner: M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"),
        nominees: [
          M("Lady Sings the Blues", 23148, "/jr528gGK1RrOW6YAZHUj5lF9RrO.jpg"),
          M("Travels with My Aunt", 5183, "/2bycdsCdZ7oqZsLbViWRp2fnHEg.jpg"),
          M("Sounder", 42489, "/cWFcxsy4tbf0ZXYs9s7IUE0irzh.jpg")
        ]
      },
      1971: {
        winner: M("Klute", 466, "/tVyINAsNGSgD1OIstqwCcs7wyGH.jpg"),
        nominees: [M("Mary, Queen of Scots", 46067, "/bNz2smYRTVGs7NHh34aHh7knVIY.jpg"), M("McCabe & Mrs. Miller", 29005, "/eQ9hDaTNpZ4wb7FWdqoJcOCJBve.jpg")]
      },
      1970: {
        winner: M("Women in Love", 66027, "/uHfThxdQC99LLoe2jKZ1u3vIge2.jpg"),
        nominees: [M("The Great White Hope", 17978, "/guVIeqNrjeAszhIDe68TDnlY6ik.jpg"), M("Diary of a Mad Housewife", 31677, "/loZFqYvqqzAhehLcbZq6djNo0JA.jpg")]
      },
      1969: {
        winner: M("The Prime of Miss Jean Brodie", 5179, "/lEZdKL17yneFK4dbbWPKcbkRbqM.jpg"),
        nominees: [M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg"), M("They Shoot Horses, Don't They?", 28145, "/7wVLBgriOQpT5RrufAFCdCSUp7M.jpg")]
      },
      1968: {
        winner: M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg"),
        nominees: [M("The Heart Is a Lonely Hunter", 22176, "/vOznrQ5x8IAnsY0P3T7Jz9EEGP7.jpg"), M("Isadora", 42626, "/5NAjQxJgf4BJWz8m2Qj0fryG3bV.jpg")]
      },
      1967: {
        winner: M("Guess Who's Coming to Dinner", 1879, "/fkHeYWahNbhxhuLefaAg553lYo5.jpg"),
        nominees: [M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg"), M("Two for the Road", 5767, "/f9GAaL5gXzSP8LhXJcAx8Remfy3.jpg")]
      },
      1966: {
        winner: M("Who's Afraid of Virginia Woolf?", 396, "/wF7ihB5V5gSm6zxjv3ZhHOpgREI.jpg"),
        nominees: [
          M("A Man and a Woman", 42726, "/boDZQiubhyhksN8fcgM4sXZ2btW.jpg"),
          M("Morgan: A Suitable Case for Treatment", 42724, "/xu4awPUFmrFUaX2qk12Lv4QhJSF.jpg"),
          M("The Shop on Main Street", 25905, "/pOjsOzPzYrCFsMsatKxAwYzIeCg.jpg")
        ]
      },
      1965: {
        winner: M("Darling", 24134, "/cBd5YO9xG7VmRuC8Q27uR3PV9mn.jpg"),
        nominees: [
          M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg"),
          M("Ship of Fools", 30080, "/2LOe4Hu6Gxw6k76hLWhS8JVVILa.jpg"),
          M("A Patch of Blue", 33364, "/9eFULnzgoLpO7lvg6FMutGRuNFg.jpg")
        ]
      },
      1964: {
        winner: null,
        nominees: [M("Seduced and Abandoned", 42790, "/5kmSfkHFaP4kQcoRnSHuxHmvfxg.jpg"), M("Seance on a Wet Afternoon", 3092, "/dHu7nuNwXTXoPdpNOEPKhHfCBk5.jpg")]
      },
      1963: {
        winner: M("Hud", 24748, "/A168bF52vmAIGkC2Qafj7M2EmaE.jpg"),
        nominees: [M("Irma la Douce", 2690, "/5TgL8ql6WwXWmX4EvBL4geJ7gx5.jpg"), M("Love with the Proper Stranger", 39495, "/1Dzre2aAiLZhAW03FlJ1n6YwQSN.jpg")]
      },
      1962: {
        winner: null,
        nominees: [
          M("Long Day's Journey Into Night", 43004, "/gCEfENplIS1Ph5yMdz4aJnn1yAB.jpg"),
          M("Days of Wine and Roses", 32488, "/cRVl1BR3x3P2NqUv61eveJNJ0ip.jpg"),
          M("Sweet Bird of Youth", 33632, "/uA9tl4o8P1hNB3lDBhHKHcNGdtr.jpg"),
          M("What Ever Happened to Baby Jane?", 10242, "/msGYzyWwtjAaA3DScdgmvJ5MReG.jpg")
        ]
      },
      1961: {
        winner: null,
        nominees: [
          M("Breakfast at Tiffany's", 164, "/79xm4gXw4l7A5D0XukUOJRocFYQ.jpg"),
          M("Splendor in the Grass", 28569, "/n6Kw8Ui93SMhrk1MupCFwUg04vq.jpg"),
          M("Summer and Smoke", 94917, "/eFpVZFokirARldwjvvoEwGQhUXW.jpg")
        ]
      },
      1960: {
        winner: M("BUtterfield 8", 23724, "/zwMaEBrNWFv9I9NiJVNTQ8znAM4.jpg"),
        nominees: [M("Sunrise at Campobello", 72354, "/y9cJA6rz0cEcPmehvc1Rr1GvvCO.jpg"), M("Never on Sunday", 43039, "/t9zLlS5O5GB57BKjJCtzB21VKZB.jpg")]
      },
      1959: {
        winner: M("Room at the Top", 43103, "/uuyruoqh7oBtjwN1mJyOF04CPjO.jpg"),
        nominees: [M("The Diary of Anne Frank", 2576, "/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg")]
      },
      1958: {
        winner: M("I Want to Live!", 28577, "/cQoSMLJFPV3d8Mi8iPwwtNto370.jpg"),
        nominees: [M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg")]
      },
      1957: {
        winner: M("The Three Faces of Eve", 28285, "/jqfTPqaGYlz1ZR7YHjz5RTgPa8U.jpg"),
        nominees: [M("Heaven Knows, Mr. Allison", 37103, "/90jAEsc3teDWpDr5wiAmcxAjuVp.jpg"), M("Wild Is the Wind", 93528, "/7vnKOkyrvJ77uLlGk5hzXyqyAfQ.jpg")]
      },
      1956: {
        winner: M("Anastasia", 38171, "/26wHOXNt4XNn2lYT8i8pWx1JOP0.jpg"),
        nominees: [M("The King and I", 16520, "/wUfaP0lLaMpZzp5CrHyII5Vd7cp.jpg")]
      },
      1955: {
        winner: null,
        nominees: [M("Love Is a Many-Splendored Thing", 53879, "/a9aqlitzVeo5fq6UX5Ekl5kopco.jpg"), M("Summertime", 50363, "/3mlLfrbP9oYkSXvUPJhk24VdYM8.jpg")]
      },
      1954: {
        winner: null,
        nominees: [M("Sabrina", 6620, "/e1Po9NDrH7IJZhv89467gJH5FS0.jpg"), M("A Star Is Born", 3111, "/zpg2SzpYhZk1D1seDfIIlwaqAxT.jpg")]
      },
      1953: {
        winner: null,
        nominees: [
          M("The Moon Is Blue", 71839, "/wKwmMM7gBFloF13EapN6XXpQlFE.jpg"),
          M("Lili", 43350, "/1EhDKTAN2oL1L96pGOeaupm5XUt.jpg"),
          M("Mogambo", 25009, "/sKc2pZhmTz3xfItLAci44vCTrYx.jpg"),
          M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg")
        ]
      },
      1952: {
        winner: M("Come Back, Little Sheba", 84214, "/3hg3c6TVFVGuoqmHi0Yw25qvpRu.jpg"),
        nominees: [M("The Member of the Wedding", 93775, "/i1QymzFHXx9ZKbqqNayuzmUHRIo.jpg")]
      },
      1951: {
        winner: M("A Streetcar Named Desire", 702, "/aicdlO5vt7z2ARm279eGzJeYCLQ.jpg"),
        nominees: [M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg")]
      },
      1950: {
        winner: null,
        nominees: [M("Caged", 29381, "/vvGyjfwGOQkB91XbzLJHmItiBIl.jpg")]
      }
    },

    "Best Director": {
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        nominees: [
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg"),
          M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg"),
          M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg")
        ]
      },
      2023: { winner: M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg"), nominees: [] },
      2022: { winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg"), nominees: [] },
      2021: { winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"), nominees: [] },
      2020: { winner: M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"), nominees: [] },
      2019: { winner: M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg"), nominees: [] },
      2018: { winner: M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg"), nominees: [] },
      2017: { winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"), nominees: [] },
      2016: { winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg"), nominees: [] },
      2015: {
        winner: M("Birdman or (The Unexpected Virtue of Ignorance)", 194662, "/rHUg2AuIuLSIYMYFgavVwqt1jtc.jpg"),
        nominees: [M("Birdman or (The Unexpected Virtue of Ignorance)", 194662, "/rHUg2AuIuLSIYMYFgavVwqt1jtc.jpg")]
      },
      2014: { winner: M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg"), nominees: [] },
      2013: { winner: M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg"), nominees: [] },
      2012: { winner: M("Hidden Children", 74603, "/qpVdG0PaeTo0cLoA72MCaSZr1xR.jpg"), nominees: [] },
      2011: { winner: M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg"), nominees: [] },
      2010: { winner: M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg"), nominees: [] },
      2009: { winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg"), nominees: [] },
      2008: { winner: M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg"), nominees: [] },
      2007: { winner: M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg"), nominees: [] },
      2006: { winner: M("Bandidas", 1969, "/31wgXG6OxDaXbp5IzyNoUJdVS5e.jpg"), nominees: [] },
      2005: { winner: M("Million Dollar Baby", 70, "/jcfEqKdWF1zeyvECPqp3mkWLct2.jpg"), nominees: [] },
      2004: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
        nominees: [M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg")]
      },
      2003: { winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg"), nominees: [] },
      2002: { winner: M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg"), nominees: [] },
      2001: { winner: M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg"), nominees: [] },
      2000: { winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"), nominees: [] },
      1999: { winner: M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"), nominees: [] },
      1998: { winner: M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"), nominees: [] },
      1997: { winner: M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"), nominees: [] },
      1996: { winner: M("Braveheart", 197, "/or1gBugydmjToAEq7OZY0owwFk.jpg"), nominees: [] },
      1995: { winner: M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"), nominees: [] },
      1994: { winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"), nominees: [] },
      1993: { winner: M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg"), nominees: [] },
      1992: { winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"), nominees: [] },
      1991: { winner: M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"), nominees: [] },
      1990: { winner: M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg"), nominees: [] },
      1989: { winner: M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg"), nominees: [] },
      1988: { winner: M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg"), nominees: [] },
      1987: { winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg"), nominees: [] },
      1986: { winner: M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg"), nominees: [] },
      1985: { winner: M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg"), nominees: [] },
      1984: { winner: M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg"), nominees: [] },
      1983: { winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg"), nominees: [] },
      1982: { winner: M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg"), nominees: [] },
      1981: { winner: M("Ordinary People", 16619, "/tJVETEDAKgD3fEh88SHOvMvOQue.jpg"), nominees: [] },
      1980: { winner: M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg"), nominees: [] },
      1979: { winner: M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg"), nominees: [] },
      1978: { winner: M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg"), nominees: [] },
      1977: { winner: M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg"), nominees: [] },
      1976: { winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"), nominees: [] },
      1975: { winner: M("The Godfather Part II", 240, "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg"), nominees: [] },
      1974: { winner: M("The Sting", 9277, "/ckmYng37zey8INYf6d10cVgIG93.jpg"), nominees: [] },
      1973: { winner: M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"), nominees: [] },
      1972: { winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg"), nominees: [] },
      1971: { winner: M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg"), nominees: [] },
      1970: { winner: M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg"), nominees: [] },
      1969: { winner: M("Oliver Cromwell: Ritratto di un dittatore", 530200, ""), nominees: [] },
      1968: { winner: M("The Graduate", 37247, "/z1Z1tZMR66RxcNeHbwoEhYeqOlP.jpg"), nominees: [] },
      1967: { winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg"), nominees: [] },
      1966: { winner: M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg"), nominees: [] },
      1965: { winner: M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg"), nominees: [] },
      1964: { winner: M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg"), nominees: [] },
      1963: { winner: M("Lawrence of Arabia", 947, "/AiAm0EtDvyGqNpVoieRw4u65vD1.jpg"), nominees: [] },
      1962: { winner: M("West Side Story", 1725, "/nzCMu6D5q60i2bVrIQ0DxlRSgCZ.jpg"), nominees: [] },
      1961: { winner: M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg"), nominees: [] },
      1960: { winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg"), nominees: [] },
      1959: { winner: M("Gigi", 17281, "/3GSuecnDr4N5ZaqTrwElSzt6eC2.jpg"), nominees: [] },
      1958: { winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg"), nominees: [] },
      1957: { winner: M("Giant", 1712, "/wXGmfJkU83daBsqp9R8LeWguIZd.jpg"), nominees: [] },
      1956: { winner: M("Marty", 15919, "/8tnGO5VoAQII4DbE3hozWKhV4BY.jpg"), nominees: [] },
      1955: { winner: M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg"), nominees: [] },
      1954: { winner: M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg"), nominees: [] },
      1953: { winner: M("The Quiet Man", 3109, "/u3B1hVKHE56yBRoxF3Nk9uxHdYN.jpg"), nominees: [] },
      1952: { winner: M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg"), nominees: [] },
      1951: { winner: M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg"), nominees: [] },
      1950: { winner: M("A Letter to Three Wives", 45578, "/bSfwTLt2K8IeEeppsiDq7svikbV.jpg"), nominees: [] }
    },

    "Best Picture": {
      2025: {
        winner: null,
        nominees: [
          M("Anora", 1064213, "/cgXk2tNYhJZLXdBDO5DidAVzQ82.jpg"),
          M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg"),
          M("A Complete Unknown", 661539, "/llWl3GtNoXosbvYboelmoT459NM.jpg"),
          M("Conclave", 974576, "/vYEyxF1UT779RiEalpMjUT6kfdf.jpg"),
          M("Dune: Part Two", 693134, "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"),
          M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg"),
          M("I'm Still Here", 1000837, "/gZnsMbhCvhzAQlKaVpeFRHYjGyb.jpg"),
          M("Nickel Boys", 1028196, "/lu2vmmtStmTNMmSZl2LgrrQpLZo.jpg"),
          M("The Substance", 933260, "/lqoMzCcZYEFK729d6qzt349fB4o.jpg"),
          M("Wicked", 402431, "/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg")
        ]
      },
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        nominees: [
          M("Barbie", 346698, "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"),
          M("The Coffee Table", 1056380, "/r8S7cc676EfgfUDVQKPrqRlbRFz.jpg"),
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg"),
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg"),
          M("Maestro", 523607, "/kxj7rMco6RNYsVcNwuGAIlfWu64.jpg"),
          M("Boudica", 975902, "/g57hTF2TYytHMveoKDpUN8iFk1p.jpg"),
          M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg"),
          M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg")
        ]
      },
      2023: {
        winner: M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg"),
        nominees: [
          M("All Quiet on the Western Front", 49046, "/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg"),
          M("Avatar: The Way of Water", 76600, "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"),
          M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg"),
          M("Elvis", 614934, "/rva3UhKaMeiB0Vej5A2pm1leX7K.jpg"),
          M("The Fabelmans", 804095, "/h7llKkqkkJtJrTOaDLuVeUYDQ7I.jpg"),
          M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg"),
          M("Top Gun: Maverick", 361743, "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg"),
          M("Triangle of Sadness", 497828, "/k9eLozCgCed5FGTSdHu0bBElAV8.jpg"),
          M("Women Talking", 777245, "/wcTc9GveMMjAdHSlzdE0FaRCtqi.jpg")
        ]
      },
      2022: { winner: M("Death on the Nile", 505026, "/kVr5zIAFSPRQ57Y1zE7KzmhzdMQ.jpg"), nominees: [] },
      2021: { winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"), nominees: [] },
      2020: { winner: M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"), nominees: [] },
      2019: {
        winner: M("Green Book", 490132, "/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg"),
        nominees: [
          M("Ford v Ferrari", 359724, "/dR1Ju50iudrOh3YgfwkAU1g2HZe.jpg"),
          M("The Irishman", 398978, "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg"),
          M("Jojo Rabbit", 515001, "/7GsM4mtM0worCtIVeiQt28HieeN.jpg"),
          M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"),
          M("Little Women", 331482, "/yn5ihODtZ7ofn8pDYfxCmxh8AXI.jpg"),
          M("Marriage Story", 492188, "/2JRyCKaRKyJAVpsIHeLvPw5nHmw.jpg"),
          M("1917", 530915, "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg"),
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg")
        ]
      },
      2018: {
        winner: M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg"),
        nominees: [
          M("Black Panther", 284054, "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"),
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg"),
          M("Bohemian Rhapsody", 424694, "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg"),
          M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg"),
          M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg"),
          M("Vice", 429197, "/1gCab6rNv1r6V64cwsU4oEr649Y.jpg")
        ]
      },
      2017: {
        winner: M("Moonlight", 376867, "/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg"),
        nominees: [
          M("Call Me by Your Name", 398818, "/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg"),
          M("Darkest Hour", 399404, "/xa6G3aKlysQeVg9wOb0dRcIGlWu.jpg"),
          M("Dunkirk", 374720, "/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg"),
          M("Get Out", 419430, "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg"),
          M("Lady Bird", 391713, "/gl66K7zRdtNYGrxyS2YDUP5ASZd.jpg"),
          M("Phantom Thread", 400617, "/hgoWjp9Sh0MI97eAMZCnIoVfgvq.jpg"),
          M("The Post", 446354, "/h4XG3g6uMMPIBPjAoQhC2QIMdkl.jpg"),
          M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg")
        ]
      },
      2016: {
        winner: M("Spotlight", 314365, "/8DPGG400FgaFWaqcv11n8mRd2NG.jpg"),
        nominees: [
          M("Arrival", 329865, "/6WzElgkLjIWuWn3Nwu66s5J26tx.jpg"),
          M("Fences", 393457, "/8NvnB8aeWQvBEz2ruN4g313j991.jpg"),
          M("Hacksaw Ridge", 324786, "/wuz8TjCIWR2EVVMuEfBnQ1vuGS3.jpg"),
          M("Hell or High Water", 338766, "/ljRRxqy2aXIkIBXLmOVifcOR021.jpg"),
          M("Hidden Figures", 381284, "/9lfz2W2uGjyow3am00rsPJ8iOyq.jpg"),
          M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"),
          M("Lion", 334543, "/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg"),
          M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg")
        ]
      },
      2015: {
        winner: M("Birdman or (The Unexpected Virtue of Ignorance)", 194662, "/rHUg2AuIuLSIYMYFgavVwqt1jtc.jpg"),
        nominees: [
          M("Birdman or (The Unexpected Virtue of Ignorance)", 194662, "/rHUg2AuIuLSIYMYFgavVwqt1jtc.jpg"),
          M("The Big Short", 318846, "/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg"),
          M("Bridge of Spies", 296098, "/fmOOjHAQzxr0c1sfcY4qkiSRBH6.jpg"),
          M("Brooklyn", 291678, "/eqVRQcGhl1CRRjjct78tRR2SPrk.jpg"),
          M("Mad Max: Fury Road", 76341, "/hA2ple9q4qnwxp3hKVNhroipsir.jpg"),
          M("The Martian", 286217, "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg"),
          M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg"),
          M("Room", 264644, "/2hHDMeYyZjbGWn0BeNH1cTMxuM7.jpg")
        ]
      },
      2014: {
        winner: M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg"),
        nominees: [
          M("American Sniper", 190859, "/vJgtfUmZE5i4L12sOryAPuBa04K.jpg"),
          M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg"),
          M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"),
          M("The Imitation Game", 205596, "/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg"),
          M("Selma", 273895, "/wq4lhMc4BuOyQqe1ZGzhxLyy3Uk.jpg"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg"),
          M("Whiplash", 244786, "/7fn624j5lj3xTme2SgiLCeuedmO.jpg")
        ]
      },
      2013: {
        winner: M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg"),
        nominees: [
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg"),
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg"),
          M("Dallas Buyers Club", 152532, "/7Fdh7gUq3plvQqxRbNYhWvDABXA.jpg"),
          M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg"),
          M("Her", 152601, "/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg"),
          M("Nebraska", 129670, "/o1t2Mw18EEBnl8v4Nby3PFjxnM1.jpg"),
          M("Philomena", 205220, "/eBUv2GmGdXmCk1AaSOmyiu70hN8.jpg"),
          M("The Wolf of Wall Street", 106646, "/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg")
        ]
      },
      2012: {
        winner: M("Hidden Children", 74603, "/qpVdG0PaeTo0cLoA72MCaSZr1xR.jpg"),
        nominees: [
          M("Amour", 86837, "/19hyCudualHxCD0GrEngqsi0wBF.jpg"),
          M("Beasts of the Southern Wild", 84175, "/nQJmWekGYlXhezGUb21xFfEfwhH.jpg"),
          M("Django Unchained", 68718, "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg"),
          M("Les Misérables", 82695, "/6CuzBs2Lb8At7qQr64mLXg2RYRb.jpg"),
          M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg"),
          M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg"),
          M("Silver Linings Playbook", 82693, "/fhHB1uvfFKKFbj6bTKE8xdtsjKi.jpg"),
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg")
        ]
      },
      2011: {
        winner: M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg"),
        nominees: [
          M("The Descendants", 65057, "/8cDq5UlOPYeKm39okALCEOsZPxk.jpg"),
          M("Extremely Loud & Incredibly Close", 64685, "/6pszViNvKr1r31pP7gJNYDHEx5P.jpg"),
          M("The Help", 50014, "/3kmfoWWEc9Vtyuaf9v5VipRgdjx.jpg"),
          M("Hugo", 44826, "/1dxRq3o3l3bVWNRvvSb7rRf68qp.jpg"),
          M("Midnight in Paris", 59436, "/4wBG5kbfagTQclETblPRRGihk0I.jpg"),
          M("Moneyball", 60308, "/4yIQq1e6iOcaZ5rLDG3lZBP3j7a.jpg"),
          M("The Tree of Life", 8967, "/l8cwuB5WJSoj4uMAsnzuHBOMaSJ.jpg"),
          M("War Horse", 57212, "/3aRHhvvngFPJFy5uAjo7GVr3PhL.jpg")
        ]
      },
      2010: {
        winner: M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg"),
        nominees: [
          M("127 Hours", 44115, "/h0RMdn0rfl9l5hWXz3tUh6QVkhi.jpg"),
          M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg"),
          M("The Fighter", 45317, "/xfsFerGhO1h6rLk8vwLgMyQ8WVJ.jpg"),
          M("Inception", 27205, "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"),
          M("The Kids Are All Right", 39781, "/xQ5XqZc82dDCcGjxY7voRKjhaKQ.jpg"),
          M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg"),
          M("Toy Story 3", 10193, "/AbbXspMOwdvwWZgVN0nabZq03Ec.jpg"),
          M("True Grit", 44264, "/tCrB8pcjadZjsDk7rleGJaIv78k.jpg"),
          M("Winter's Bone", 39013, "/a0qhPkNlxLfsf5B2jFyI1Pp04XV.jpg")
        ]
      },
      2009: {
        winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg"),
        nominees: [
          M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg"),
          M("The Blind Side", 22881, "/bMgq7VBriuBFknXEe9E9pVBYGZq.jpg"),
          M("District 9", 17654, "/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg"),
          M("An Education", 24684, "/gLIvvUdlocGjm8XVLxhWHAKWrRq.jpg"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"),
          M("Precious", 25793, "/d4ltLIDbvZskSwbzXqi0Hfv5ma4.jpg"),
          M("A Serious Man", 12573, "/5gGxDS8WmrebPlMHexVS8EVehiP.jpg"),
          M("Up", 14160, "/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg")
        ]
      },
      2008: {
        winner: M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg"),
        nominees: [
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg"),
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg"),
          M("Milk", 10139, "/ot4ImF4b7QbS6XsTdMH3pWxNmX2.jpg"),
          M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg")
        ]
      },
      2007: {
        winner: M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg"),
        nominees: [
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg"),
          M("Juno", 7326, "/jNIn2tVhpvFD6P9IojldI3mNYcn.jpg"),
          M("Michael Clayton", 4566, "/hhkW4yVIGo8Bee3UITKvqOvhNMG.jpg"),
          M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg")
        ]
      },
      2006: {
        winner: M("Crash", 1640, "/86BdPC6RDX88NC880pLidKn2LCj.jpg"),
        nominees: [
          M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg"),
          M("Letters from Iwo Jima", 1251, "/kZokxQtzMPURvijWYFuvh1fAvnv.jpg"),
          M("Little Miss Sunshine", 773, "/niNdhTpPHSgw22tK0PLjQMV640v.jpg"),
          M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg")
        ]
      },
      2005: {
        winner: M("Million Dollar Baby", 70, "/jcfEqKdWF1zeyvECPqp3mkWLct2.jpg"),
        nominees: [
          M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg"),
          M("Capote", 398, "/tzsxkZMnJvozpHQEl1KzO8KwWu.jpg"),
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg"),
          M("Munich", 612, "/iUekaw96QLInZpsNwRTlRKrZgwm.jpg")
        ]
      },
      2004: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
        nominees: [
          M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
          M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg"),
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg"),
          M("Ray", 1677, "/tSPC7sO2XYNL9QcMmK88tuUALL5.jpg"),
          M("Sideways", 9675, "/zOsaxYLgvZVU7cJBpPn8CuE0MrP.jpg")
        ]
      },
      2003: {
        winner: M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg"),
        nominees: [
          M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg"),
          M("Master and Commander: The Far Side of the World", 8619, "/s1cVTQEZYn4nSjZLnFbzLP0j8y2.jpg"),
          M("Mystic River", 322, "/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg"),
          M("Seabiscuit", 4464, "/5m7NfZvxYsSm2YBCJ2VPQf8ziKr.jpg")
        ]
      },
      2002: {
        winner: M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg"),
        nominees: [
          M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg"),
          M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg"),
          M("The Lord of the Rings: The Two Towers", 121, "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg"),
          M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg")
        ]
      },
      2001: {
        winner: M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"),
        nominees: [
          M("Gosford Park", 5279, "/7r8DeZuaaHCiOEbkqZC6MFmwJ69.jpg"),
          M("In the Bedroom", 1999, "/IQj11YbraLDyPYaz79jtDoAscc.jpg"),
          M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"),
          M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg")
        ]
      },
      2000: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"),
        nominees: [
          M("The Cider House Rules", 1715, "/qAECAgqjSFRVZzEEGbFAZqZNiDh.jpg"),
          M("The Green Mile", 497, "/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg"),
          M("Crouching Tiger, Hidden Dragon", 146, "/iNDVBFNz4XyYzM9Lwip6atSTFqf.jpg"),
          M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg"),
          M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg"),
          M("Chocolat", 392, "/7sUfspdrvxLMgGkrOq46lPh0Scj.jpg")
        ]
      },
      1999: {
        winner: M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
        nominees: [
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg"),
          M("Life Is Beautiful", 637, "/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg"),
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"),
          M("The Thin Red Line", 8741, "/seMydAaoxQP6F0xbE1jOcTmn5Jr.jpg"),
          M("The Cider House Rules", 1715, "/qAECAgqjSFRVZzEEGbFAZqZNiDh.jpg"),
          M("The Green Mile", 497, "/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg")
        ]
      },
      1998: {
        winner: M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"),
        nominees: [
          M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"),
          M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg"),
          M("Good Will Hunting", 489, "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg"),
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg"),
          M("Life Is Beautiful", 637, "/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg"),
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"),
          M("The Thin Red Line", 8741, "/seMydAaoxQP6F0xbE1jOcTmn5Jr.jpg")
        ]
      },
      1997: {
        winner: M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
        nominees: [
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
          M("Jerry Maguire", 9390, "/lABvGN7fDk5ifnwZoxij6G96t2w.jpg"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"),
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg"),
          M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"),
          M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg"),
          M("Good Will Hunting", 489, "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg")
        ]
      },
      1996: {
        winner: M("Braveheart", 197, "/or1gBugydmjToAEq7OZY0owwFk.jpg"),
        nominees: [
          M("Apollo 13", 568, "/tVeKscCm2fY1xDXZk8PgnZ87h9S.jpg"),
          M("Babe", 9598, "/zKuQMtnbVTz9DsOnOJmlW71v4qH.jpg"),
          M("The Postman", 11010, "/cUaCpjVDefYShKyLmkcDsiPaBHn.jpg"),
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
          M("Jerry Maguire", 9390, "/lABvGN7fDk5ifnwZoxij6G96t2w.jpg"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"),
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg")
        ]
      },
      1995: {
        winner: M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"),
        nominees: [
          M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"),
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg"),
          M("The Shawshank Redemption", 278, "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"),
          M("Apollo 13", 568, "/tVeKscCm2fY1xDXZk8PgnZ87h9S.jpg"),
          M("Babe", 9598, "/zKuQMtnbVTz9DsOnOJmlW71v4qH.jpg"),
          M("The Postman", 11010, "/cUaCpjVDefYShKyLmkcDsiPaBHn.jpg"),
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg")
        ]
      },
      1994: {
        winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"),
        nominees: [
          M("The Fugitive", 5503, "/b3rEtLKyOnF89mcK75GXDXdmOEf.jpg"),
          M("In the Name of the Father", 7984, "/3NcIkKxaO2SmRVsG1v50XhtmL0f.jpg"),
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg"),
          M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"),
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg"),
          M("The Shawshank Redemption", 278, "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg")
        ]
      },
      1993: {
        winner: M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg"),
        nominees: [
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg"),
          M("A Few Good Men", 881, "/rLOk4z9zL1tTukIYV56P94aZXKk.jpg"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
          M("Scent of a Woman", 9475, "/4adI7IaveWb7EidYXfLb3MK3CgO.jpg"),
          M("The Fugitive", 5503, "/b3rEtLKyOnF89mcK75GXDXdmOEf.jpg"),
          M("In the Name of the Father", 7984, "/3NcIkKxaO2SmRVsG1v50XhtmL0f.jpg"),
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg")
        ]
      },
      1992: {
        winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"),
        nominees: [
          M("Beauty and the Beast", 10020, "/hUJ0UvQ5tgE2Z9WpfuduVSdiCiU.jpg"),
          M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg"),
          M("JFK", 820, "/r0VWVTYlqdRCK5ZoOdNnHdqM2gt.jpg"),
          M("The Prince of Tides", 10333, "/1AyeW3YlwfhRwLDeUCW686obceb.jpg"),
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg"),
          M("A Few Good Men", 881, "/rLOk4z9zL1tTukIYV56P94aZXKk.jpg"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
          M("Scent of a Woman", 9475, "/4adI7IaveWb7EidYXfLb3MK3CgO.jpg")
        ]
      },
      1991: {
        winner: M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"),
        nominees: [
          M("Awakenings", 11005, "/9gztZXuHLG6AJ0fgqGd7Q43cWRI.jpg"),
          M("Ghost", 251, "/w9RaPHov8oM5cnzeE27isnFMsvS.jpg"),
          M("The Godfather Part III", 242, "/lm3pQ2QoQ16pextRsmnUbG2onES.jpg"),
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg"),
          M("Beauty and the Beast", 10020, "/hUJ0UvQ5tgE2Z9WpfuduVSdiCiU.jpg"),
          M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg"),
          M("JFK", 820, "/r0VWVTYlqdRCK5ZoOdNnHdqM2gt.jpg"),
          M("The Prince of Tides", 10333, "/1AyeW3YlwfhRwLDeUCW686obceb.jpg")
        ]
      },
      1990: {
        winner: M("Driving Miss Daisy", 403, "/iaCzvcY42HihFxQBTZCTKMpsI0P.jpg"),
        nominees: [
          M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg"),
          M("Field of Dreams", 2323, "/oeM7nAw6FVFICwUaXKCRkDsKjqO.jpg"),
          M("My Left Foot: The Story of Christy Brown", 10161, "/GRAAl0bMQFoFIjV3aunc5jsM5u.jpg"),
          M("Awakenings", 11005, "/9gztZXuHLG6AJ0fgqGd7Q43cWRI.jpg"),
          M("Ghost", 251, "/w9RaPHov8oM5cnzeE27isnFMsvS.jpg"),
          M("The Godfather Part III", 242, "/lm3pQ2QoQ16pextRsmnUbG2onES.jpg"),
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg")
        ]
      },
      1989: {
        winner: M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg"),
        nominees: [
          M("The Accidental Tourist", 31052, "/dyk2BqPajLRBpVQ6jsSJJdgfuXe.jpg"),
          M("Dangerous Liaisons", 859, "/eNvJXuTQ7lusuUrIvS7wplORXBX.jpg"),
          M("Mississippi Burning", 1632, "/wvEx2WbxZXYljQ9vSoq37NgeXcJ.jpg"),
          M("Working Girl", 3525, "/q2jfFzZvAzjTaArQR0tjilIZ5aJ.jpg"),
          M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg"),
          M("Field of Dreams", 2323, "/oeM7nAw6FVFICwUaXKCRkDsKjqO.jpg"),
          M("My Left Foot: The Story of Christy Brown", 10161, "/GRAAl0bMQFoFIjV3aunc5jsM5u.jpg")
        ]
      },
      1988: {
        winner: M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg"),
        nominees: [
          M("Broadcast News", 12626, "/kQNR1Lc0qAF5xuBySpDn481KVjb.jpg"),
          M("Fatal Attraction", 10998, "/vjB9XwJKnYqFKKjhWcE6WpAf5Ki.jpg"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg"),
          M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg"),
          M("The Accidental Tourist", 31052, "/dyk2BqPajLRBpVQ6jsSJJdgfuXe.jpg"),
          M("Dangerous Liaisons", 859, "/eNvJXuTQ7lusuUrIvS7wplORXBX.jpg"),
          M("Mississippi Burning", 1632, "/wvEx2WbxZXYljQ9vSoq37NgeXcJ.jpg"),
          M("Working Girl", 3525, "/q2jfFzZvAzjTaArQR0tjilIZ5aJ.jpg")
        ]
      },
      1987: {
        winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg"),
        nominees: [
          M("Children of a Lesser God", 1890, "/tWMuw7YWWDpD9Iv652vfKELPZPR.jpg"),
          M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg"),
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg"),
          M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg"),
          M("Broadcast News", 12626, "/kQNR1Lc0qAF5xuBySpDn481KVjb.jpg"),
          M("Fatal Attraction", 10998, "/vjB9XwJKnYqFKKjhWcE6WpAf5Ki.jpg"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg"),
          M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg")
        ]
      },
      1986: {
        winner: M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg"),
        nominees: [
          M("The Color Purple", 873, "/6bvxkcTAXyqxGRwo38mxw92D6Xr.jpg"),
          M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg"),
          M("Prizzi's Honor", 2075, "/5azGfZXuUFYjYfz6etYOdlyLXwL.jpg"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg"),
          M("Children of a Lesser God", 1890, "/tWMuw7YWWDpD9Iv652vfKELPZPR.jpg"),
          M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg"),
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg"),
          M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg")
        ]
      },
      1985: {
        winner: M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg"),
        nominees: [
          M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg"),
          M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg"),
          M("Places in the Heart", 13681, "/bmWg3uVn700inqOiadxeFTmiqmV.jpg"),
          M("A Soldier's Story", 26522, "/vSLrddsvH8bJzryOS5BD9qtTtFa.jpg"),
          M("The Color Purple", 873, "/6bvxkcTAXyqxGRwo38mxw92D6Xr.jpg"),
          M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg"),
          M("Prizzi's Honor", 2075, "/5azGfZXuUFYjYfz6etYOdlyLXwL.jpg"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg")
        ]
      },
      1984: {
        winner: M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg"),
        nominees: [
          M("The Big Chill", 12560, "/rU8kjMEL5Mn0EWm3gOShPHBEZ4l.jpg"),
          M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg"),
          M("The Right Stuff", 9549, "/kFR1p46HXJVVMpmOil8bNWnAQ50.jpg"),
          M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg"),
          M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg"),
          M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg"),
          M("Places in the Heart", 13681, "/bmWg3uVn700inqOiadxeFTmiqmV.jpg"),
          M("A Soldier's Story", 26522, "/vSLrddsvH8bJzryOS5BD9qtTtFa.jpg")
        ]
      },
      1983: {
        winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg"),
        nominees: [
          M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg"),
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg"),
          M("The Verdict", 24226, "/m3DdNJZfBcsTiFe0SwsLChWavrG.jpg"),
          M("The Big Chill", 12560, "/rU8kjMEL5Mn0EWm3gOShPHBEZ4l.jpg"),
          M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg"),
          M("The Right Stuff", 9549, "/kFR1p46HXJVVMpmOil8bNWnAQ50.jpg"),
          M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg")
        ]
      },
      1982: {
        winner: M("Chariots of Fire", 9443, "/qnRaum8k0HqGRml2i7OawFqUtEb.jpg"),
        nominees: [
          M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg"),
          M("Raiders of the Lost Ark", 85, "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg"),
          M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg"),
          M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg"),
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg"),
          M("The Verdict", 24226, "/m3DdNJZfBcsTiFe0SwsLChWavrG.jpg")
        ]
      },
      1981: {
        winner: M("Ordinary People", 16619, "/tJVETEDAKgD3fEh88SHOvMvOQue.jpg"),
        nominees: [
          M("Coal Miner's Daughter", 16769, "/bzHFDAdUad4QcHPi2UOqvaQKNWA.jpg"),
          M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg"),
          M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg"),
          M("Tess", 11121, "/xejUFnoAVxzvU95o2jlzG2USmY.jpg"),
          M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg"),
          M("Raiders of the Lost Ark", 85, "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg"),
          M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg")
        ]
      },
      1980: {
        winner: M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg"),
        nominees: [
          M("All That Jazz", 16858, "/culCEdj4srLljefgn4XKd6k3C5t.jpg"),
          M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"),
          M("Breaking Away", 20283, "/k7b5GsVJK1hfdwoYqcczN9pBba6.jpg"),
          M("Norma Rae", 40842, "/6au7WBVYoKhV1jORyFSIRszb46S.jpg"),
          M("Coal Miner's Daughter", 16769, "/bzHFDAdUad4QcHPi2UOqvaQKNWA.jpg"),
          M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg"),
          M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg"),
          M("Tess", 11121, "/xejUFnoAVxzvU95o2jlzG2USmY.jpg")
        ]
      },
      1979: {
        winner: M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg"),
        nominees: [
          M("Coming Home", 1118435, ""),
          M("Heaven Can Wait", 12185, "/h1yOiO9cow6gwmGxSAWvPdY4lhJ.jpg"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg"),
          M("All That Jazz", 16858, "/culCEdj4srLljefgn4XKd6k3C5t.jpg"),
          M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"),
          M("Breaking Away", 20283, "/k7b5GsVJK1hfdwoYqcczN9pBba6.jpg"),
          M("Norma Rae", 40842, "/6au7WBVYoKhV1jORyFSIRszb46S.jpg")
        ]
      },
      1978: {
        winner: M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg"),
        nominees: [
          M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg"),
          M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg"),
          M("Star Wars", 11, "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg"),
          M("The Turning Point", 61280, "/6CD90BQEDexEIMqIwMSnbJStF5x.jpg"),
          M("Coming Home", 31657, "/jBsYWNBYNEi5EhT1hC8iexcTsWT.jpg"),
          M("Heaven Can Wait", 12185, "/h1yOiO9cow6gwmGxSAWvPdY4lhJ.jpg"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg")
        ]
      },
      1977: {
        winner: M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg"),
        nominees: [
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg"),
          M("Bound for Glory", 42232, "/wMSR2CSPruCPkZDEQ5xjv5xqc05.jpg"),
          M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"),
          M("Taxi Driver", 103, "/ekstpH614fwDX8DUln1a2Opz0N8.jpg"),
          M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg"),
          M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg"),
          M("Star Wars", 11, "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg"),
          M("The Turning Point", 61280, "/6CD90BQEDexEIMqIwMSnbJStF5x.jpg")
        ]
      },
      1976: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"),
        nominees: [
          M("Barry Lyndon", 3175, "/znfLskGQnXYB2xcOGM9eInRHPAV.jpg"),
          M("Dog Day Afternoon", 968, "/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg"),
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg"),
          M("Nashville", 3121, "/twl4ovyjb8muFKvZmcCDzPR0hy1.jpg"),
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg"),
          M("Bound for Glory", 42232, "/wMSR2CSPruCPkZDEQ5xjv5xqc05.jpg"),
          M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"),
          M("Taxi Driver", 103, "/ekstpH614fwDX8DUln1a2Opz0N8.jpg")
        ]
      },
      1975: {
        winner: M("The Godfather Part II", 240, "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg"),
        nominees: [
          M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg"),
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg"),
          M("The Towering Inferno", 5919, "/mFM1GbrRrT3DWUFFo8koSITFnYe.jpg"),
          M("Barry Lyndon", 3175, "/znfLskGQnXYB2xcOGM9eInRHPAV.jpg"),
          M("Dog Day Afternoon", 968, "/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg"),
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg"),
          M("Nashville", 3121, "/twl4ovyjb8muFKvZmcCDzPR0hy1.jpg")
        ]
      },
      1974: {
        winner: M("The Sting", 9277, "/ckmYng37zey8INYf6d10cVgIG93.jpg"),
        nominees: [
          M("American Graffiti", 838, "/1tjLivPad2PX8FAzWko7FPIb8d2.jpg"),
          M("Cries and Whispers", 10238, "/a1bMgB09YDvvRN9SitCclUYragr.jpg"),
          M("The Exorcist", 9552, "/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg"),
          M("A Touch of Class", 42458, "/iEjIwaaXlg8fK7uyNdQU2ityj8v.jpg"),
          M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg"),
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg"),
          M("The Towering Inferno", 5919, "/mFM1GbrRrT3DWUFFo8koSITFnYe.jpg")
        ]
      },
      1973: {
        winner: M("The Godfather", 238, "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"),
        nominees: [
          M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"),
          M("Deliverance", 10669, "/2TrAzNJlHyNYYSkQf6asg3rs2Xr.jpg"),
          M("The Emigrants", 40732, "/lsYcKVArVbz7afITdTiOEAznDCa.jpg"),
          M("Sounder", 42489, "/cWFcxsy4tbf0ZXYs9s7IUE0irzh.jpg"),
          M("American Graffiti", 838, "/1tjLivPad2PX8FAzWko7FPIb8d2.jpg"),
          M("Cries and Whispers", 10238, "/a1bMgB09YDvvRN9SitCclUYragr.jpg"),
          M("The Exorcist", 9552, "/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg"),
          M("A Touch of Class", 42458, "/iEjIwaaXlg8fK7uyNdQU2ityj8v.jpg")
        ]
      },
      1972: {
        winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg"),
        nominees: [
          M("A Clockwork Orange", 185, "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg"),
          M("Fiddler on the Roof", 14811, "/v65PHx7Q6Jx0anyNeUOX07SJic9.jpg"),
          M("The Last Picture Show", 25188, "/7NYePZc0lZrRomtmQsjOJMePTEb.jpg"),
          M("Nicholas and Alexandra", 38646, "/66JQ2dtAQNjyVIppBqBDk7MAGKv.jpg"),
          M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"),
          M("Deliverance", 10669, "/2TrAzNJlHyNYYSkQf6asg3rs2Xr.jpg"),
          M("The Emigrants", 40732, "/lsYcKVArVbz7afITdTiOEAznDCa.jpg"),
          M("Sounder", 42489, "/cWFcxsy4tbf0ZXYs9s7IUE0irzh.jpg")
        ]
      },
      1971: {
        winner: M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg"),
        nominees: [
          M("حسناء المطار", 1135970, "/zUWVvKavXBr4RteiZm6hP39pNhI.jpg"),
          M("Five Easy Pieces", 26617, "/xGLkuMWigSPLBvWiENSMlVq56iE.jpg"),
          M("Love Story", 9062, "/5A7SGcT1GlhWfHsCRQQtGe0TpJB.jpg"),
          M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg"),
          M("A Clockwork Orange", 185, "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg"),
          M("Fiddler on the Roof", 14811, "/v65PHx7Q6Jx0anyNeUOX07SJic9.jpg"),
          M("The Last Picture Show", 25188, "/7NYePZc0lZrRomtmQsjOJMePTEb.jpg"),
          M("Nicholas and Alexandra", 38646, "/66JQ2dtAQNjyVIppBqBDk7MAGKv.jpg")
        ]
      },
      1970: {
        winner: M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg"),
        nominees: [
          M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg"),
          M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg"),
          M("Hello, Dolly!", 14030, "/aPZOt9BR3gnk1RyX924ySq81S4P.jpg"),
          M("Z", 2721, "/dFAJyFNgvOv24f2RQyI9KDxjGr3.jpg"),
          M("Airport", 10671, "/6iOKluJfyiU1SLZbGYrY7Z0i6k0.jpg"),
          M("Five Easy Pieces", 26617, "/xGLkuMWigSPLBvWiENSMlVq56iE.jpg"),
          M("Love Story", 9062, "/5A7SGcT1GlhWfHsCRQQtGe0TpJB.jpg"),
          M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg")
        ]
      },
      1969: {
        winner: M("Oliver Cromwell: Ritratto di un dittatore", 530200, ""),
        nominees: [
          M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg"),
          M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg"),
          M("Hello, Dolly!", 14030, "/aPZOt9BR3gnk1RyX924ySq81S4P.jpg"),
          M("Z", 2721, "/dFAJyFNgvOv24f2RQyI9KDxjGr3.jpg")
        ]
      },
      1968: {
        winner: M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg"),
        nominees: [
          M("Funny Girl", 16085, "/fg7tnjd4dBeIDvEO80CGq958CCt.jpg"),
          M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg"),
          M("Rachel, Rachel", 42635, "/67flKS1FKxIiYUjXPqRc39hb9LX.jpg"),
          M("Romeo and Juliet", 6003, "/vaBQKLbSWkXGTOlsz9ARdJP4lvg.jpg")
        ]
      },
      1967: {
        winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg"),
        nominees: [
          M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg"),
          M("Doctor Dolittle", 16081, "/rViuZo27U8wcZHGuRliv9LfmhjV.jpg"),
          M("The Graduate", 37247, "/z1Z1tZMR66RxcNeHbwoEhYeqOlP.jpg"),
          M("Guess Who's Coming to Dinner", 1879, "/fkHeYWahNbhxhuLefaAg553lYo5.jpg")
        ]
      },
      1966: {
        winner: M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg"),
        nominees: [
          M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg"),
          M("The Russians Are Coming! The Russians Are Coming!", 31918, "/sgo7cQg6Zo0xuCgb8ckou0RX4Bj.jpg"),
          M("The Sand Pebbles", 5923, "/muZyCXWoayEtwVkxc0ql48X1h6L.jpg"),
          M("Who's Afraid of Virginia Woolf?", 396, "/wF7ihB5V5gSm6zxjv3ZhHOpgREI.jpg")
        ]
      },
      1965: {
        winner: M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg"),
        nominees: [
          M("Darling", 24134, "/cBd5YO9xG7VmRuC8Q27uR3PV9mn.jpg"),
          M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg"),
          M("Ship of Fools", 30080, "/2LOe4Hu6Gxw6k76hLWhS8JVVILa.jpg"),
          M("A Thousand Clowns", 42731, "/tXPsmtVy3T5Whz20LwiscprCdCT.jpg")
        ]
      },
      1964: {
        winner: M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg"),
        nominees: [
          M("Becket", 15421, "/swWmxVbq0pXv4wwsc2O803PiXR7.jpg"),
          M("Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", 935, "/6x7MzQ6BOMlRzam1StcmPO9v61g.jpg"),
          M("Mary Poppins", 433, "/pHyWpWn2pRIfhS3Arcn4SKtKKW4.jpg"),
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg")
        ]
      },
      1963: {
        winner: M("Lawrence of Arabia", 947, "/AiAm0EtDvyGqNpVoieRw4u65vD1.jpg"),
        nominees: [
          M("America America", 47249, "/76RffKrNPrfA4TWYkx5wIIOzOlV.jpg"),
          M("Cleopatra", 8095, "/bj7rUGUewofA9cpHt1h36gvDFfy.jpg"),
          M("How the West Was Won", 11897, "/rmwc89VMQR4rUSDfakd0Z6GyF6q.jpg"),
          M("Lilies of the Field", 38805, "/gYoVx2m8NP2hTWnEpwNeROIWrQ4.jpg")
        ]
      },
      1962: {
        winner: M("West Side Story", 1725, "/nzCMu6D5q60i2bVrIQ0DxlRSgCZ.jpg"),
        nominees: [
          M("The Longest Day", 9289, "/5zmvEofdIlgXrQl9A7e5IOzlnFU.jpg"),
          M("The Music Man", 13671, "/4yo6qaqVF1IThXMapo4yW9BRWjV.jpg"),
          M("Mutiny on the Bounty", 11085, "/caxk06SANEacvycZFiApv1LA6Kl.jpg"),
          M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg")
        ]
      },
      1961: {
        winner: M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg"),
        nominees: [
          M("Fanny", 84050, "/8hEQpSE3D9rsMw37N30T9EZwLoa.jpg"),
          M("The Guns of Navarone", 10911, "/j6VSFnm20GlkUi8yb7hM5Qfc1fA.jpg"),
          M("The Hustler", 990, "/snItsSViawjaadW9mlWUmGwR41R.jpg"),
          M("Judgment at Nuremberg", 821, "/b6vYatvui1EXeFYfpDX4rcbueuP.jpg")
        ]
      },
      1960: {
        winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg"),
        nominees: [
          M("The Alamo", 11209, "/54KNQfJnYZwhI3sPYyjXtptWGfg.jpg"),
          M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg"),
          M("Sons and Lovers", 53939, "/7BDlr8XivWmNcDsb5ygnhs8CWiR.jpg"),
          M("The Sundowners", 43047, "/yGXxKdR3sttc0Gu927wMETZH3al.jpg")
        ]
      },
      1959: {
        winner: M("Gigi", 17281, "/3GSuecnDr4N5ZaqTrwElSzt6eC2.jpg"),
        nominees: [
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg"),
          M("The Diary of Anne Frank", 2576, "/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg"),
          M("The Nun's Story", 27029, "/4vNWFhPyjTehPpZsvTnTywwXSiF.jpg"),
          M("Room at the Top", 43103, "/uuyruoqh7oBtjwN1mJyOF04CPjO.jpg")
        ]
      },
      1958: {
        winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg"),
        nominees: [
          M("Auntie Mame", 16347, "/uH810rwkYEbUaV6IlwTaAExbXUm.jpg"),
          M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg"),
          M("The Defiant Ones", 11414, "/tGGNyImEXgedDjrCORbC9cTJp0X.jpg"),
          M("Separate Tables", 43136, "/y8exawP0Je3MXVIS3olpJ2fu07.jpg")
        ]
      },
      1957: {
        winner: M("Around the World in 80 Days", 2897, "/kk6Rrwh0toMz9tjuUHdS4O3v2Rk.jpg"),
        nominees: [
          M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg"),
          M("Peyton Place", 43236, "/pSANpoBLMbejWTtiKz630eSaDpi.jpg"),
          M("Sayonara", 40885, "/xSXJDamf9vSb1qOiBhOMjB2soDE.jpg"),
          M("Witness for the Prosecution", 37257, "/bCj4EfuehAlgBwVd3diyWyhuuau.jpg")
        ]
      },
      1956: {
        winner: M("Marty", 15919, "/8tnGO5VoAQII4DbE3hozWKhV4BY.jpg"),
        nominees: [
          M("Friendly Persuasion", 43258, "/mhsdObvFHoOfgaKAVJUOeK3LiOP.jpg"),
          M("Giant", 1712, "/wXGmfJkU83daBsqp9R8LeWguIZd.jpg"),
          M("The King and I", 16520, "/wUfaP0lLaMpZzp5CrHyII5Vd7cp.jpg"),
          M("The Ten Commandments", 6844, "/3Ei59AR64x6dMZfWobPCkZjbqTL.jpg")
        ]
      },
      1955: {
        winner: M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg"),
        nominees: [
          M("Love Is a Many-Splendored Thing", 53879, "/a9aqlitzVeo5fq6UX5Ekl5kopco.jpg"),
          M("Mister Roberts", 37853, "/5B8Gc1N2S3CDWHBzm0VxaMPTyzJ.jpg"),
          M("Picnic", 39940, "/aKCSA9JUp9JkztAjzODPTrtZmzC.jpg"),
          M("The Rose Tattoo", 65550, "/3W3dgP2l24JJWq6sVEl6TddLwbe.jpg")
        ]
      },
      1954: {
        winner: M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg"),
        nominees: [
          M("The Caine Mutiny", 10178, "/vuO4Z3wOWVlhq35MS9asZeT9rVp.jpg"),
          M("The Country Girl", 2438, "/7LdXybdZcTdZo7lkkrFQKf7byZf.jpg"),
          M("Seven Brides for Seven Brothers", 16563, "/8Z4W2oRQKkmt7lhqNPROcNru9yJ.jpg"),
          M("Three Coins in the Fountain", 41503, "/3y6aNrQd8K2bQjI2gRpmmDJGr99.jpg")
        ]
      },
      1953: {
        winner: M("The Greatest Show on Earth", 27191, "/cKI0yGPRh1IlvRKKJRoMZruior8.jpg"),
        nominees: [
          M("Julius Caesar", 18019, "/2nzpmJ9MIdd5TKXJd53KgKdZ6eT.jpg"),
          M("The Robe", 29912, "/qFYZNGzftIM8dqGMJBToGraAFJp.jpg"),
          M("Roman Holiday", 804, "/8lI9dmz1RH20FAqltkGelY1v4BE.jpg"),
          M("Shane", 3110, "/svr5ADpjXTCOQv8hmuJnB7I14Qv.jpg")
        ]
      },
      1952: {
        winner: M("An American in Paris", 2769, "/lyDXkvG53ldz6Cf7dbjJl7TaoP5.jpg"),
        nominees: [
          M("High Noon", 288, "/qETSMQ4IXBSAS409Z9OL0ppXWTW.jpg"),
          M("Ivanhoe", 26175, "/bH2cat7MemIGLevYqCUrXkBCDiC.jpg"),
          M("Moulin Rouge", 10910, "/eNly1s5DXQUTyjvfmopJPwwPiMH.jpg"),
          M("The Quiet Man", 3109, "/u3B1hVKHE56yBRoxF3Nk9uxHdYN.jpg")
        ]
      },
      1951: {
        winner: M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg"),
        nominees: [
          M("Decision Before Dawn", 4461, "/wOrzwxmEvPIiD9VDSuN1utgMAxX.jpg"),
          M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg"),
          M("Quo Vadis", 11620, "/dqF1dattMNiwGjPSphu2VSi558Q.jpg"),
          M("A Streetcar Named Desire", 702, "/aicdlO5vt7z2ARm279eGzJeYCLQ.jpg")
        ]
      },
      1950: {
        winner: M("All the King's Men", 25430, "/7o8nnvFnkekDAlIYznNUWzxQFM6.jpg"),
        nominees: [
          M("Born Yesterday", 24481, "/hPiQUhnkgp2O9bQz9KhSyOjLvGl.jpg"),
          M("Father of the Bride", 20758, "/sygyqqXq41SBZiYjY8nuQRAcuUv.jpg"),
          M("King Solomon's Mines", 43388, "/s5T4Da7d3f255YRyaWfhMWfoBKK.jpg"),
          M("Sunset Boulevard", 599, "/zt8aQ6ksqK6p1AopC5zVTDS9pKT.jpg")
        ]
      }
    }
  },

  // ============================
  //  CANNES
  // ============================
  Cannes: {

    "Best Director": {
      2024: { winner: M("Grand Tour", 1098709, "/dc21nMtakPqF5BvWozaaOWpmDR3.jpg", "Miguel Gomes"), nominees: [] },
      2023: { winner: M("The Taste of Things", 964960, "/gZsXtzwI3CgCvKF5TkgHVhhbEg1.jpg", "Tran Anh Hung"), nominees: [] },
      2022: { winner: M("Decision to Leave", 705996, "/N0rskx91Eh6aWjvBybeY6epNic.jpg", "Park Chan-wook"), nominees: [] },
      2021: { winner: M("Annette", 424277, "/4FTnypxpGltJdIARrfFsP31pGTp.jpg", "Leos Carax"), nominees: [] },
      2019: { winner: M("Young Ahmed", 522373, "/z4D3GE3JzyrFe7pnSUqDwdq1KhY.jpg", "Jean-Pierre & Luc Dardenne"), nominees: [] },
      2018: { winner: M("Cold War", 517104, "/fNtvmW8vkxmsmQbYUdRrPZHxeRM.jpg", "Pawel Pawlikowski"), nominees: [] },
      2017: { winner: M("The Beguiled", 399019, "/x4R9jyiZhJzevASus5n6WyHQTdR.jpg", "Sofia Coppola"), nominees: [] },
      2016: {
        winner: M("Assassination Classroom: Graduation", 359628, "/77fTE8nJY5ZMm7b4Nk8ntBC6ccf.jpg", "Cristian Mungiu"),
        nominees: [M("Personal Shopper", 340676, "/cdm6qZgmbaIwjKBZnUSGWS4eyM2.jpg", "Olivier Assayas")]
      },
      2015: { winner: M("The Assassin", 253450, "/10RcGMfzg2lIW1aLcR4ILfNbHK2.jpg", "Hou Hsiao-hsien"), nominees: [] },
      2014: { winner: M("Foxcatcher", 87492, "/w6Sl079QtUcQ9dVQ2RP6aN9NBXx.jpg", "Bennett Miller"), nominees: [] },
      2013: { winner: M("Heli", 186935, "/cblCQ0h5oFYlufWoYeFJZAYm0bZ.jpg", "Amat Escalante"), nominees: [] },
      2012: { winner: M("Post Tenebras Lux", 103689, "/xIKrYjBvMlqZ2yYuZZt3R2iLHJq.jpg", "Carlos Reygadas"), nominees: [] },
      2011: { winner: M("Drive", 64690, "/602vevIURmpDfzbnv5Ubi6wIkQm.jpg", "Nicolas Winding Refn"), nominees: [] },
      2010: { winner: M("Elvis on Tour", 42482, "/hXxKJuQnkwFtWvOX161ppbaiaC2.jpg", "Mathieu Amalric"), nominees: [] },
      2009: { winner: M("The Execution of P", 64450, "/cTj91tCZupzRDJhevh7PmTl2J4g.jpg", "Brillante Mendoza"), nominees: [] },
      2008: { winner: M("Three Monkeys", 8905, "/tyIKP8SSTkw9xEXAG9lj5jEnIfW.jpg", "Nuri Bilge Ceylan"), nominees: [] },
      2007: { winner: M("The Diving Bell and the Butterfly", 2013, "/6NkJ4gnLrvLj0PZDW6sNM85JMbj.jpg", "Julian Schnabel"), nominees: [] },
      2006: { winner: M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg", "Alejandro Gonzalez Inarritu"), nominees: [] },
      2005: { winner: M("Caché", 445, "/vTzjRi0Uhy0tt3Rjw8SARZZJHlX.jpg", "Michael Haneke"), nominees: [] },
      2004: { winner: M("Exiles", 18497, "/enhjywSKKDgdZZKhRp0iEWfJFZ5.jpg", "Tony Gatlif"), nominees: [] },
      2003: { winner: M("Elephant", 1807, "/1a4VU9z2hxEvugHMK7VsobB9xTX.jpg", "Gus Van Sant"), nominees: [] },
      2002: {
        winner: M("Painted Fire", 18302, "/iZfIDpywVqgftbTPJw8uui2PZFA.jpg", "Im Kwon-taek"),
        nominees: [M("Punch-Drunk Love", 8051, "/htYp4yqFu4rzBEIa6j9jP8miDm3.jpg", "Paul Thomas Anderson")]
      },
      2001: {
        winner: M("Mulholland Drive", 1018, "/x7A59t6ySylr1L7aubOQEA480vM.jpg", "David Lynch"),
        nominees: [M("The Man Who Wasn't There", 10778, "/lrCgt8NNMyFsfmXyXiSSCRXNH4u.jpg", "Joel Coen")]
      },
      2000: { winner: M("Yi Yi", 25538, "/mR8dSQZI8X6Z1NClJhFrtJp636z.jpg", "Edward Yang"), nominees: [] },
      1999: { winner: M("All About My Mother", 99, "/hjQhzhkGYXPNM96k0mOgob6HMmn.jpg", "Pedro Almodovar"), nominees: [] },
      1998: { winner: M("The General", 16885, "/3UUR2Evm2JtC2odd2UMYgs9Yi1x.jpg", "John Boorman"), nominees: [] },
      1997: { winner: M("Happy Together", 18329, "/kO4KjUkQOfWSBw06Bdl7m6AlEP7.jpg", "Wong Kar-wai"), nominees: [] },
      1996: { winner: M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", "Joel Coen"), nominees: [] },
      1995: { winner: M("La Haine", 406, "/8rgPyWjYZhsphSSxbXguMnhN7H0.jpg", "Mathieu Kassovitz"), nominees: [] },
      1994: { winner: M("Dear Diary", 25403, "/rAjbgSUvZDoy5jPbC5jD6pWvlyZ.jpg", "Nanni Moretti"), nominees: [] },
      1993: { winner: M("Naked", 21450, "/xMYP4uaNeyPmX4FQ2xxWk2eIN6K.jpg", "Mike Leigh"), nominees: [] },
      1992: { winner: M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg", "Robert Altman"), nominees: [] },
      1991: { winner: M("Barton Fink", 290, "/oDkp5iClJ9WKJGtKHz8BydodHC3.jpg", "Joel Coen"), nominees: [] },
      1990: { winner: M("Taxi Blues", 41842, "/sOWdSyompSqcyynAPP7LQSjkHwM.jpg", "Pavel Lungin"), nominees: [] },
      1989: { winner: M("Time of the Gypsies", 20123, "/av6K9MX0jNNFAH6NZVrVV2DMAOA.jpg", "Emir Kusturica"), nominees: [] },
      1988: { winner: M("The South", 46770, "/xyOeNv5YturVNqxBFQ5DQAKjp3E.jpg", "Fernando Solanas"), nominees: [] },
      1987: { winner: M("Wings of Desire", 144, "/iZQs2vUeCzvS1KfZJ6uYNCGJBBV.jpg", "Wim Wenders"), nominees: [] },
      1986: { winner: M("After Hours", 10843, "/eamOBurHBu0MIxohTIVcfxmZ6Z7.jpg", "Martin Scorsese"), nominees: [] },
      1985: { winner: M("Rendez-vous", 34093, "/rICHxS03w4peWxcdGgT8pyb9eOp.jpg", "Andre Techine"), nominees: [] },
      1984: { winner: M("A Sunday in the Country", 42102, "/qymxYwTuND3tiKZh5d1uKjykZ3U.jpg", "Bertrand Tavernier"), nominees: [] },
      1983: {
        winner: M("L'Argent", 42112, "/tqt9D4TH702ZXEUKWa3e6UdFAvY.jpg", "Robert Bresson"),
        nominees: [M("Nostalgia", 1394, "/fCYSidPXp3LpDa9wlLNv0gZvjyF.jpg", "Andrei Tarkovsky")]
      },
      1982: { winner: M("Fitzcarraldo", 9343, "/oBCnYEKcg1rMhr5JjDnrRpilvDd.jpg", "Werner Herzog"), nominees: [] },
      1979: { winner: M("Days of Heaven", 16642, "/rwxTYjOZmX2rGhz7avLe1qsjNqe.jpg", "Terrence Malick"), nominees: [] },
      1978: { winner: M("Empire of Passion", 49096, "/glnY93uAWkTe4SBAng0j7wZlrxa.jpg", "Nagisa Oshima"), nominees: [] },
      1976: { winner: M("Ugly, Dirty and Bad", 19413, "/cn2OXjLPL6m5aj2W26hkkc1GyXm.jpg", "Ettore Scola"), nominees: [] },
      1975: {
        winner: M("Orders", 69765, "/qddTj2jgakcuXX4nAU5hjoFAVZv.jpg", "Michel Brault"),
        nominees: [M("Special Section", 79921, "/rRko0kzrm3Z3o7saQA9kFo4fVo7.jpg", "Costa-Gavras")]
      },
      1972: { winner: M("Red Psalm", 86732, "/eapZ1WPlH9iHodlUEJe7DE5nJzZ.jpg", "Miklos Jancso"), nominees: [] },
      1970: { winner: M("Leo the Last", 77333, "/n00wxf5fDcYVgpJySih5A3Q9FiK.jpg", "John Boorman"), nominees: [] },
      1969: {
        winner: M("Antonio das Mortes", 74349, "/fOoqqn5A2XoPLblvAPpujRonzZm.jpg", "Glauber Rocha"),
        nominees: [M("All My Good Countrymen", 46659, "/hn0F5V3ZIjYbi7xTAkdGfRug6l6.jpg", "Vojtech Jasny")]
      },
      1967: { winner: M("Ten Thousand Days", 198796, "/7TAy4s2JV0V5Y5FsDEgsUXDE2F9.jpg", "Ferenc Kosa"), nominees: [] },
      1966: { winner: M("Lenin in Poland", 198802, "/ws7yRtphg4aypvfg4jki8Sno1j1.jpg", "Sergei Yutkevich"), nominees: [] },
      1965: { winner: M("Forest of the Hanged", 118487, "/pRFflpigFD9vSoPCcESjwGg4cjz.jpg", "Liviu Ciulei"), nominees: [] },
      1961: { winner: M("Chronicle of Flaming Years", 198902, "/eh7VOlvQych4DKIaXfRzuN5KtUd.jpg", "Yuliya Solntseva"), nominees: [] },
      1959: { winner: M("The 400 Blows", 147, "/12PuU23kkDLvTd0nb8hMlE3oShB.jpg", "Francois Truffaut"), nominees: [] },
      1958: { winner: M("Brink of Life", 60899, "/powLbhuyWu53PHe6NrHoDCGewUp.jpg", "Ingmar Bergman"), nominees: [] },
      1957: { winner: M("A Man Escaped", 15244, "/gkoZ8fFib24zhB2DKpjQ09SK9FU.jpg", "Robert Bresson"), nominees: [] },
      1956: { winner: M("Othello", 47697, "/61A7EJqfMsrQO0YWsUWq8gbgbu0.jpg", "Sergei Yutkevich"), nominees: [] },
      1955: {
        winner: M("Rififi", 934, "/heVdAFNZUxXVmO6jiJcEHCvI5lK.jpg", "Jules Dassin"),
        nominees: [M("Heroes of Shipka", 199253, "/vlpCtTNQqkGuDGlNOxaDO8PTFYx.jpg", "Sergei Vasilyev")]
      },
      1954: { winner: M("The Great Game", 292039, "/sVlW7vT0olxHZMMrjNicmB2rPZD.jpg", "Rene Clement"), nominees: [] },
      1952: { winner: M("Fan-Fan the Tulip", 62547, "/kdhnzJfcwvi0i6a8wqasRN3sq6l.jpg", "Christian-Jaque"), nominees: [] },
      1951: { winner: M("The Young and the Damned", 800, "/cDCvmYoyqFg4CuSMtGMvCpfOIEw.jpg", "Luis Bunuel"), nominees: [] }
    },

    "Grand Prix": {
      2024: { winner: M("All We Imagine as Light", 927547, "/ruImrzB4POsrgwCMozmOBV67zs5.jpg"), nominees: [] },
      2023: { winner: M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg"), nominees: [] },
      2022: {
        winner: M("Close", 901563, "/dlMNnWs7Mz8Nk5AC447Ew1tD5pn.jpg"),
        nominees: [M("Stars at Noon", 603204, "/viR50oQCs8ObciADFGWHUyChexZ.jpg")]
      },
      2021: {
        winner: M("Dragon Ball GT: A Hero's Legacy", 18095, "/reNPMjkPg9f6wgf6kHSSkKjBarL.jpg"),
        nominees: [M("Compartment No. 6", 588182, "/3KUsYQmQXVCMrnGnQIoqkj5MJUP.jpg")]
      },
      2019: { winner: M("Atlantics", 496967, "/zRnZM6HqglFK31MYyrTSQVlj1dQ.jpg"), nominees: [] },
      2018: { winner: M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg"), nominees: [] },
      2017: { winner: M("BPM (Beats per Minute)", 451945, "/azLtGx5ZhdTSP2b4oNLWtiE51OW.jpg"), nominees: [] },
      2016: { winner: M("It's Only the End of the World", 338189, "/riWa3WZrO3n8lLWuaEVMgaqAZGn.jpg"), nominees: [] },
      2015: { winner: M("Son of Saul", 336050, "/9ZcX6NjCJam5uwkooXffhHI29Lj.jpg"), nominees: [] },
      2014: { winner: M("The Wonders", 265226, "/u5Z23Rt9OKhQc61wPPwrDs4psdi.jpg"), nominees: [] },
      2013: { winner: M("Inside Llewyn Davis", 86829, "/nNxK3pC3DMpPpWKMvo2p3liREVT.jpg"), nominees: [] },
      2012: { winner: M("Reality", 103758, "/bl2Hy8yyHXmTSDLz3NMxIe9wgIo.jpg"), nominees: [] },
      2011: {
        winner: M("Once Upon a Time in Anatolia", 74879, "/bN84guFndgvtWIvFC7sTD8AAJDE.jpg"),
        nominees: [M("The Kid with a Bike", 63831, "/5uRiWyYSAYYScTRe9HP7BHpOQvr.jpg")]
      },
      2010: { winner: M("Of Gods and Men", 46332, "/fgrC0w62MCc7Fn77l5RVY0WKv0t.jpg"), nominees: [] },
      2009: { winner: M("A Prophet", 21575, "/x9Jb8kewBHPzjTtgCQvoQoDsy4d.jpg"), nominees: [] },
      2008: { winner: M("Gomorrah", 8882, "/3XcCTqSovFZE5GRebJmh1kHwziw.jpg"), nominees: [] },
      2007: { winner: M("The Mourning Forest", 2010, "/fzi6QI5HU1917J9AvWa7uL5AF0.jpg"), nominees: [] },
      2006: { winner: M("Flanders", 36143, "/qY8n5t12OBfiQI1X2rI4YrYxVoA.jpg"), nominees: [] },
      2005: { winner: M("Broken Flowers", 308, "/gd8JNjwgiM6ZgGm6NFAkovQWoYn.jpg"), nominees: [] },
      2004: { winner: M("Oldboy", 670, "/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg"), nominees: [] },
      2003: { winner: M("Voices of a Distant Star", 37910, "/mvRqW2z4iBws3CDkCNmojksyr4V.jpg"), nominees: [] },
      2002: { winner: M("The Man Without a Past", 7294, "/9tBepCujkyNg1qM52MsaJfDkIRw.jpg"), nominees: [] },
      2001: { winner: M("The Piano Teacher", 1791, "/gNHKYQnP1RnqEhkivHJzBPb4MOP.jpg"), nominees: [] },
      2000: { winner: M("Devils on the Doorstep", 25838, "/zpbyUenBJGhyA6RKa5RcQWGKOYb.jpg"), nominees: [] },
      1999: { winner: M("Humanité", 65296, "/fEEVsOpI21ZDY64tKMh4T3FZzCp.jpg"), nominees: [] },
      1998: { winner: M("Life Is Beautiful", 637, "/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg"), nominees: [] },
      1997: { winner: M("The Sweet Hereafter", 10217, "/gJy7LMq4b5qO5fsSUSoBgm24BHf.jpg"), nominees: [] },
      1996: { winner: M("Breaking the Waves", 145, "/dQWMcdHXUOSHtr7ypOCa5T79JMS.jpg"), nominees: [] },
      1995: { winner: M("Ulysses' Gaze", 22549, "/AmRdjyd5nVBd06FzJT8xoTS43ct.jpg"), nominees: [] },
      1994: {
        winner: M("To Live", 31439, "/bv0qREWTw8TPAtgt22ELp1UlKVl.jpg"),
        nominees: [M("Burnt by the Sun", 50797, "/jcpvnPSuRrynrgY7menuyZe7X4r.jpg")]
      },
      1993: { winner: M("Faraway, So Close!", 10434, "/5VaPw0NgM4DloukmQTggzgvD4rb.jpg"), nominees: [] },
      1992: { winner: M("The Stolen Children", 47714, "/fkFYNR4iCz5n1j5Drf0jejKmNVb.jpg"), nominees: [] },
      1991: { winner: M("La Belle Noiseuse", 12627, "/n6f7I9RUdoDa9AgM9X2oAc3pk4l.jpg"), nominees: [] },
      1990: {
        winner: M("The Sting of Death", 128775, "/dSLPZAgtze5DUTJJe4VX8Trl9lZ.jpg"),
        nominees: [M("The Law", 65482, "/zj2UAI0eWxhtqX7K4HatWZmM3tH.jpg")]
      },
      1989: {
        winner: M("Cinema Paradiso", 11216, "/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg"),
        nominees: [M("Too Beautiful for You", 48524, "/eGgg6qufHcMHrKvG3eoPhCEVDnI.jpg")]
      },
      1988: { winner: M("A World Apart", 41949, "/rLo4PwbuT3C7k2VxAGbMQU1aINp.jpg"), nominees: [] },
      1987: { winner: M("Repentance", 96920, "/9kZqQ2tlwfts6ch2s4ibKhjQgzW.jpg"), nominees: [] },
      1986: { winner: M("The Sacrifice", 355652, "/dMfMmT4uZoZSYyi0vzgGnuIXZp8.jpg"), nominees: [] },
      1985: { winner: M("Birdy", 11296, "/weIn0Huxx4SQU8PB5ZggzA4PLIE.jpg"), nominees: [] },
      1984: { winner: M("Diary for My Children", 84946, "/7Hvy8UNr1AH7OZFuUgx33GddDTX.jpg"), nominees: [] },
      1983: { winner: M("Monty Python's The Meaning of Life", 4543, "/9yavZ9WgEZIpWi2EbVW8At9RPdo.jpg"), nominees: [] },
      1982: { winner: M("The Night of the Shooting Stars", 42130, "/u9QgkfHj90rr33KhjLlk5tr7bVg.jpg"), nominees: [] },
      1981: { winner: M("Light Years Away", 101330, "/5ObVcqX3XLWxrYYCH4vnu5OU2YY.jpg"), nominees: [] },
      1980: { winner: M("My American Uncle", 39543, "/e9gbeslzPIav8ELEPRrKB1EzonF.jpg"), nominees: [] },
      1979: { winner: M("Siberiade", 68553, "/z3WYuEQkI5hAFGmCsip1hcModo0.jpg"), nominees: [] },
      1978: {
        winner: M("Bye Bye Monkey", 42200, "/gw1PrkRwMe9XZUksQpdB81ExP1j.jpg"),
        nominees: [M("The Shout", 48131, "/89SfSiIgUjyxPDaRe5SedgVRggV.jpg")]
      },
      1976: {
        winner: M("Cria!", 51857, "/hueMt6pkaV8nwVGwKP2uuiqF5DJ.jpg"),
        nominees: [M("The Marquise of O", 48205, "/z7oWathRvbObBUeCWae8AKrI5ZZ.jpg")]
      },
      1975: { winner: M("The Enigma of Kaspar Hauser", 11710, "/z1rBBE8NWociDQClr8y6Onv1X62.jpg"), nominees: [] },
      1974: { winner: M("Arabian Nights", 47406, "/zDrAREfrNvq5O10lHDDh529i143.jpg"), nominees: [] },
      1973: { winner: M("The Mother and the Whore", 48693, "/jHRORDfipbTd3d7NPsKt4jotOwW.jpg"), nominees: [] },
      1972: { winner: M("Solaris", 593, "/pgqj7QoBPWFLLKtLEpPmFYFRMgB.jpg"), nominees: [] },
      1971: {
        winner: M("Johnny Got His Gun", 16328, "/ryIY3FPmTtXu9g6W4I69qCdkxKj.jpg"),
        nominees: [M("Taking Off", 59881, "/2UXNQy39AqER8Y5LjuZcA1pliwq.jpg")]
      },
      1970: { winner: M("Investigation of a Citizen Above Suspicion", 26451, "/vPTZwlq1IC4o1DCsEZEl2uGljzm.jpg"), nominees: [] },
      1969: { winner: M("Adalen 31", 87208, "/36nb5JRvhdaEcpE71LKexPtYIa1.jpg"), nominees: [] },
      1967: {
        winner: M("Accident", 74544, "/gttNRLWBDJXwOdoNCKQFgxSGUh8.jpg"),
        nominees: [M("I Even Met Happy Gypsies", 59088, "/zSegXDenrymOkEnCn5kb40HMtnH.jpg")]
      }
    },

    "Jury Prize": {
      2024: { winner: M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg"), nominees: [] },
      2023: { winner: M("Fallen Leaves", 986280, "/9ayYOpeqHhxfHHUoyt3kXzznECO.jpg"), nominees: [] },
      2022: {
        winner: M("EO", 785398, "/1MK86Vr2nf1GSYOtRd8pFvA5RM8.jpg"),
        nominees: [M("The Eight Mountains", 803700, "/ohD87uTlwOgNuUEYaW82ew9Eds7.jpg")]
      },
      2021: {
        winner: M("Ahed's Knee", 662029, "/wev6qxufVYojSZDaDifChqDmYgh.jpg"),
        nominees: [M("Memoria", 511819, "/uZ4GABzjCIiQNlYSgjXoaf6rpK5.jpg")]
      },
      2019: {
        winner: M("Bacurau", 446159, "/tBa4zMGzZUco26XT3WfZZCwQ76i.jpg"),
        nominees: [M("Les Misérables", 586863, "/2ZQV9rPFXF0iFfKbsAvVIweQ1yM.jpg")]
      },
      2018: { winner: M("Capernaum", 517814, "/mFnfTVADj8yOxwzprYOmTPselk8.jpg"), nominees: [] },
      2017: { winner: M("Loveless", 429174, "/oBUsLGZoGuLKMuHj19mjG9iCDoq.jpg"), nominees: [] },
      2016: { winner: M("American Honey", 340485, "/41SVO0AElBAl7zks9dFhJ0OjHni.jpg"), nominees: [] },
      2015: { winner: M("The Lobster", 254320, "/7Y9ILV1unpW9mLpGcqyGQU72LUy.jpg"), nominees: [] },
      2014: {
        winner: M("Mommy", 265177, "/uPDP0cHGOpkr47rdCdHWo4CyiPj.jpg"),
        nominees: [M("Goodbye to Language", 114982, "/dQ0qBocOIz5VgoEPQDptOXRwWEv.jpg")]
      },
      2013: { winner: M("Like Father, Like Son", 177945, "/r0nejXOf6e4leWhnLuEQOmC5hrX.jpg"), nominees: [] },
      2012: { winner: M("The Angels' Share", 103747, "/bt9kJ8gwTMaDcmL0INlJYIZ887t.jpg"), nominees: [] },
      2011: { winner: M("Polisse", 71157, "/cKs3XSFVbFeZcH3g9geAvr6ApOl.jpg"), nominees: [] },
      2010: { winner: M("A Screaming Man", 57602, "/q90ysGM6CQmHnUTGGU4x5TBv4hn.jpg"), nominees: [] },
      2009: {
        winner: M("Fish Tank", 24469, "/rI3MKBDsWzQHi9PWDAMKkgmYcff.jpg"),
        nominees: [M("Thirst", 22536, "/sFgvkGpXLTydvHqBCXw54OB8R0h.jpg")]
      },
      2008: { winner: M("Il Divo", 8832, "/g1bgM34ZGldqcGkucmaGZe4pMBu.jpg"), nominees: [] },
      2007: {
        winner: M("Persepolis", 2011, "/aU8i2QAdTyRR1nYb36Gq51xXP8p.jpg"),
        nominees: [M("Silent Light", 2012, "/kniOoQky3GX9ljyzobwRUGFgQUT.jpg")]
      },
      2006: { winner: M("Red Road", 11705, "/cxS2bylNtyGevLcFHowIHvGkQGv.jpg"), nominees: [] },
      2005: { winner: M("Shanghai Dreams", 101908, "/tPm6d6y6zsBdMZpmru5XNlE57s7.jpg"), nominees: [] },
      2004: { winner: M("Tropical Malady", 11534, "/9WJ8ZSZp2NC7jSvweFLskldpzzg.jpg"), nominees: [] },
      2003: { winner: M("At Five in the Afternoon", 43969, "/3yu3Z0tDG03r4nM5vrZ5B3WQ7pg.jpg"), nominees: [] },
      2002: { winner: M("Divine Intervention", 27744, "/pczspk2mTCVmG5eyErnB4BZD2HY.jpg"), nominees: [] },
      2000: {
        winner: M("Songs from the Second Floor", 34070, "/xMZieoxiQ1hb5zraZlhzcvU7MGN.jpg"),
        nominees: [M("Blackboards", 28988, "/ApLKw8jjGTp7M4FbivX3mHXJ6da.jpg")]
      },
      1999: { winner: M("The Love Letter", 31342, "/7w8QCvKDFn1cJ3sW3RGWcwlitgX.jpg"), nominees: [] },
      1998: {
        winner: M("Class Trip", 46817, "/jEoZ0T50qntBYGZC9cQPZtclnKk.jpg"),
        nominees: [M("The Celebration", 309, "/2LRzNq41yrY8EjCnD1S8sCCPvKk.jpg")]
      },
      1997: { winner: M("Western", 39968, "/u7P3htHY9FDaEFgtRdp5B830L4O.jpg"), nominees: [] },
      1996: { winner: M("Crash", 884, "/gpai5oUFyFGLHOCsYTvVMqlbY7A.jpg"), nominees: [] },
      1995: {
        winner: M("Don't Forget You're Going to Die", 72368, "/rylQhe0Z2KUKZQYhQLGrug0SV4i.jpg"),
        nominees: [M("Carrington", 47018, "/8NmeBTkC4UQa8XT2GGsBN2R8Bqo.jpg")]
      },
      1994: { winner: M("Queen Margot", 10452, "/8uGkhBLiJMIkwohGPo3iB9AuwDg.jpg"), nominees: [] },
      1993: {
        winner: M("Raining Stones", 62463, "/tkkfaTOTgeQ8iq0yQn4y8MvGkG8.jpg"),
        nominees: [M("The Puppetmaster", 96712, "/nb3jOZsFUDSjUXQgw951FMNE9O7.jpg")]
      },
      1992: {
        winner: M("Dream of Light", 94706, "/wH3VuGHcf0jTzeRGLZlPfqTIHS1.jpg"),
        nominees: [M("An Independent Life", 196929, "/tdW2kiP8010nGmIPiuMzYdyOLHe.jpg")]
      },
      1991: {
        winner: M("Europa", 9065, "/pyFtuYQReoSmhNs55kRJedA5wEJ.jpg"),
        nominees: [M("Out of Life", 66753, "/yJ3bKnUXQp95Xaql5XIgqNdLEwU.jpg")]
      },
      1990: { winner: M("Hidden Agenda", 47869, "/ceaYwvuTMfgRu7XCrLHmeK1LDzN.jpg"), nominees: [] },
      1989: { winner: M("Jesus of Montreal", 4486, "/evtfMmuJyCQch2JIdWO2SdGWgJA.jpg"), nominees: [] },
      1988: { winner: M("A Short Film About Killing", 10754, "/k7sk4yNdoXY7iwp1M9QTZuBDiJS.jpg"), nominees: [] },
      1987: {
        winner: M("Shinran: Path to Purity", 198454, "/bWxK8mEtNfPfP1BcZTnEzpOEO9F.jpg"),
        nominees: [M("Yeelen", 71329, "/xjckmcnKK6Ex6wHrVydu4F21h3t.jpg")]
      },
      1986: { winner: M("Thérèse", 42029, "/qQYUTlhMJfN4mC6cDaN7dCPb0MV.jpg"), nominees: [] },
      1985: { winner: M("Colonel Redl", 29471, "/oSOwBgEfMzJa3KqkqNUjBuV2DnT.jpg"), nominees: [] },
      1983: { winner: M("The Case Is Closed", 133751, "/dTZJNsc8irYbfpaRU4MTnJ0EHlI.jpg"), nominees: [] },
      1980: { winner: M("The Constant Factor", 198500, "/mXvxXOt7UgH9h4ptWysM0lS8zNO.jpg"), nominees: [] },
      1972: { winner: M("Slaughterhouse-Five", 24559, "/gM2q9pGW9x2zdEMPRsXLBgTDDFH.jpg"), nominees: [] },
      1971: {
        winner: M("Joe Hill", 74746, "/tguCZY7GtDSLgL6cJWFYexARqB3.jpg"),
        nominees: [M("Love Story", 9062, "/5A7SGcT1GlhWfHsCRQQtGe0TpJB.jpg")]
      },
      1970: { winner: M("The Falcons", 198659, "/mDNrQsW5G3877PaO2ipr96AuNlc.jpg"), nominees: [] },
      1969: { winner: M("Z", 2721, "/dFAJyFNgvOv24f2RQyI9KDxjGr3.jpg"), nominees: [] },
      1966: { winner: M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg"), nominees: [] },
      1965: { winner: M("Kwaidan", 30959, "/vmYhFcA2YC15hoL44hQziba75Ij.jpg"), nominees: [] },
      1964: { winner: M("Woman in the Dunes", 16672, "/f0JpsMQ9oEjKBD66Ky3qK3z7LGT.jpg"), nominees: [] },
      1963: { winner: M("Harakiri", 14537, "/3nPwMd3KviJWaHzG9fZCqlwWMas.jpg"), nominees: [] },
      1962: {
        winner: M("L'Eclisse", 21135, "/oXoe0Fp92Yw3mMJ9Vq0hPlaMELg.jpg"),
        nominees: [M("The Trial of Joan of Arc", 48764, "/gHb9UUow3j25sMCb3wDIZatfIg1.jpg")]
      },
      1961: { winner: M("Mother Joan of the Angels", 113458, "/3DRAaO2Yp9wd2lvgRSjWbyeN0Vs.jpg"), nominees: [] },
      1960: {
        winner: M("L'Avventura", 5165, "/7kUXAS8K7Ihw1T1mhARjnLuMVk3.jpg"),
        nominees: [M("Kono sora no aru kagiri", 920061, "/oIsAdU0UN919BdUZgAstiBZb951.jpg")]
      },
      1959: { winner: M("Stars", 199177, "/xCWu2icolAmBWES6TuW0Ib4nLkH.jpg"), nominees: [] },
      1958: { winner: M("Mon Oncle", 427, "/wH6RyPiXFy8INLbViVkchLVOmBc.jpg"), nominees: [] },
      1957: {
        winner: M("Kana Kanmani", 152357, "/94huaMTsf6dltbjCQ5CQRPq5VEf.jpg"),
        nominees: [M("The Seventh Seal", 490, "/wcZ21zrOsy0b52AfAF50XpTiv75.jpg")]
      },
      1956: { winner: M("The Mystery of Picasso", 71822, "/kY1Qo3rtkTiElT4iQMiHL9oEDNG.jpg"), nominees: [] },
      1955: { winner: M("Lost Continent", 199249, "/bA2i2juruTLEP47rl3ZSElw2bX8.jpg"), nominees: [] },
      1954: { winner: M("Monsieur Ripois", 163333, "/qFEdeNTWEkfLozwc9Nd6xEMwf27.jpg"), nominees: [] },
      1952: { winner: M("We Are All Murderers", 199503, "/cA0zWVlOJaHBKpxfiIgCRYR10cm.jpg"), nominees: [] },
      1951: { winner: M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg"), nominees: [] }
    },

    "Palme d'Or": {
      2024: {
        winner: M("Anora", 1064213, "/cgXk2tNYhJZLXdBDO5DidAVzQ82.jpg"),
        nominees: [
          M("All We Imagine as Light", 927547, "/ruImrzB4POsrgwCMozmOBV67zs5.jpg"),
          M("The Apprentice", 1182047, "/549Hdul2BgPnZMhqFxp6npp2opr.jpg"),
          M("Bird", 1128752, "/wKshd6n8EKrwbE2fLOUqC4TSG6O.jpg"),
          M("Caught by the Tides", 1136837, "/vRUsEXHm9iJgXuf8k4BiTLCnUb0.jpg"),
          M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg"),
          M("The Girl with the Needle", 1232827, "/2xkyx8v9G3ePxe1IcFugFQkXHzQ.jpg"),
          M("Grand Tour", 1098709, "/dc21nMtakPqF5BvWozaaOWpmDR3.jpg"),
          M("Kinds of Kindness", 1029955, "/50lPmjIpDs8gKfgK7fPIeKzpllh.jpg"),
          M("Beating Hearts", 959604, "/yu9dRyKcUHTfKcqsomUtpord4t3.jpg"),
          M("Limonov: The Ballad", 495278, "/oECqqtEb21qsVJangfa5F7Mdods.jpg"),
          M("Marcello Mio", 1145608, "/gr3oOAUYR4ttdYPfd1Nr9bUMCf5.jpg"),
          M("Megalopolis", 592831, "/8Sok3HNA3r1GHnK2lCytHyBz1A.jpg"),
          M("Motel Destino", 1161879, "/ohkx2Xf2pBz9glzJHGO5zee2wFm.jpg"),
          M("Oh, Canada", 1113583, "/hKDR5AYXRTPb751oc7xK2Ay3PH0.jpg"),
          M("Parthenope", 1109255, "/k3BL39ca5pliALDTzUdC9ZIB9gk.jpg"),
          M("The Seed of the Sacred Fig", 1278263, "/ifOazNzv2cNJ5CQjMV7cPXG2Lmy.jpg"),
          M("The Shrouds", 970947, "/6J4lPto3rjlHZwhIhCy9cOWNnqb.jpg"),
          M("The Substance", 933260, "/lqoMzCcZYEFK729d6qzt349fB4o.jpg"),
          M("Three Kilometres to the End of the World", 1278338, "/gg8gyJ7LvQQVjojmStwBWitQOQg.jpg"),
          M("Wild Diamond", 1108336, "/eEF2q2e3vntpKsHa4hQfaF0CVR8.jpg"),
          M("The Most Precious of Cargoes", 842859, "/jh5zlkFEkgL0UIkL9CoZGLl0e7t.jpg")
        ]
      },
      2023: {
        winner: M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
        nominees: [
          M("About Dry Grasses", 665733, "/mUFpdQSFAch1fMUb9MqHoESpmLS.jpg"),
          M("Asteroid City", 747188, "/rAkz95CREc3A1qTnwlSQ0jh8Zw8.jpg"),
          M("Banel & Adama", 995806, "/s7qnEdfpdLYWWw8CFs0dqQftt9Y.jpg"),
          M("Asphalt City", 628922, "/qXcd7wY7MmRs36fQt83iSMJelvV.jpg"),
          M("A Brighter Tomorrow", 925263, "/rN5ExiIpjHGAcm5mN4RsVzi0y1e.jpg"),
          M("Club Zero", 938250, "/9BPVGkU51kUWk54YJl2BXDEdl9y.jpg"),
          M("Fallen Leaves", 986280, "/9ayYOpeqHhxfHHUoyt3kXzznECO.jpg"),
          M("Firebrand", 848439, "/kXAc1LaxL64udWr9SOAHQwOBEG0.jpg"),
          M("Four Daughters", 1069193, "/iSpJ6fg1OOSO30IUkZskZDufVzN.jpg"),
          M("Homecoming", 1391738, "/gl6vQJeLoGvad9V3dqSB35A07wH.jpg"),
          M("Kidnapped", 801112, "/p0tanDacNHQhXPdu583UG3KS7fM.jpg"),
          M("Last Summer", 812037, "/a94IHwd6t2oXKy5KWTvaEnAs6Ux.jpg"),
          M("La Chimera", 837335, "/lDaUha09CumsoSAt9MIRbS9WBNH.jpg"),
          M("May December", 839369, "/zhV7B610l7hjlri4ywikJ18ONuq.jpg"),
          M("Monster", 1203484, "/OsWKxswXx2TOx87ZRxdOciu0uB.jpg"),
          M("The Old Oak", 970348, "/xN293BKB0MDqpILmLCtGGYxQXKW.jpg"),
          M("Perfect Days", 976893, "/tvUHVSTJV9ITON3oyHaWp7oaAc8.jpg"),
          M("The Taste of Things", 964960, "/gZsXtzwI3CgCvKF5TkgHVhhbEg1.jpg"),
          M("Youth (Spring)", 493514, "/oZZq2blRHyWsh1Eqk4Ir1KRc70q.jpg"),
          M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg")
        ]
      },
      2022: {
        winner: M("Triangle of Sadness", 497828, "/k9eLozCgCed5FGTSdHu0bBElAV8.jpg"),
        nominees: [
          M("The Almond and the Seahorse", 787791, "/AcGFeGeBcYmDgK8MOLj12yZqt8B.jpg"),
          M("Armageddon Time", 615952, "/wMK717aDWhboXOiVbZ9sLBqLmKh.jpg"),
          M("Cairo Conspiracy", 788977, "/zDRAA4UJWgQnSFxhJuefnwO74v5.jpg"),
          M("Broker", 736732, "/x86xaUnxU31JYiwlO35corDEV1i.jpg"),
          M("Brother and Sister", 836202, "/8UJfMqQSNjO33F19EhBIxngeOQU.jpg"),
          M("Close", 901563, "/dlMNnWs7Mz8Nk5AC447Ew1tD5pn.jpg"),
          M("Crimes of the Future", 819876, "/RAFYMC0NgK9In9aGY6k6wsIL8w.jpg"),
          M("Decision to Leave", 705996, "/N0rskx91Eh6aWjvBybeY6epNic.jpg"),
          M("The Eight Mountains", 803700, "/ohD87uTlwOgNuUEYaW82ew9Eds7.jpg"),
          M("EO", 785398, "/1MK86Vr2nf1GSYOtRd8pFvA5RM8.jpg"),
          M("Forever Young", 848958, "/439OxXHS0TdOeFjigO5YUr1LWXF.jpg"),
          M("Holy Spider", 889699, "/6ObJ4x7m1F5QRY06WzOxNJQHwGb.jpg"),
          M("Leila's Brothers", 962558, "/onQUSikPNXVvoT3wCLzHgiOPrHT.jpg"),
          M("Mother and Son", 926889, "/3507IOfx0qBXHn0Yxoz1EHmQU8a.jpg"),
          M("Nostalgia", 541724, "/t0xCqVcXlq1rPpsF6M4kzpzKypR.jpg"),
          M("Pacifiction", 691214, "/kElJcT1oteDCyRzw0XNqrTZcCvA.jpg"),
          M("R.M.N.", 919570, "/7zGDc1sWKlfYb6bKs2s2JaU4jLl.jpg"),
          M("Showing Up", 790416, "/iJw55oTb2MlG4NWjq3sbIFUVU76.jpg"),
          M("Stars at Noon", 603204, "/viR50oQCs8ObciADFGWHUyChexZ.jpg"),
          M("Tchaikovsky's Wife", 901358, "/3SHL9l0gCACJExESoYUP4Rlr7tL.jpg"),
          M("Tori and Lokita", 914203, "/aJCedM9kp6k491Gb4cCj7R5n1il.jpg")
        ]
      },
      2021: {
        winner: M("Titane", 630240, "/AeQC4gFwkIvjAwnSd2RPAlgs1VE.jpg"),
        nominees: [
          M("Ahed's Knee", 662029, "/wev6qxufVYojSZDaDifChqDmYgh.jpg"),
          M("Annette", 424277, "/4FTnypxpGltJdIARrfFsP31pGTp.jpg"),
          M("Benedetta", 454527, "/yofVXmLYQbr8pdOeyDRrf9N8rF4.jpg"),
          M("Bergman Island", 477044, "/q8bQfC7SbaTDVKywhCiNL3ZVSyy.jpg"),
          M("Casablanca Beats", 575764, "/rcut4ooPIYbVEKjOolGsH19jhKl.jpg"),
          M("Compartment No. 6", 588182, "/3KUsYQmQXVCMrnGnQIoqkj5MJUP.jpg"),
          M("The Divide", 392269, "/kkp8dRftSHIiNceNMrEzTfmr7IT.jpg"),
          M("Drive My Car", 758866, "/3cOsf5HBjPK2QCz9ebQlGHNnE7y.jpg"),
          M("Everything Went Fine", 735726, "/hyNNufs7Ds8TuT2kv4Z1mEfPx0r.jpg"),
          M("Flag Day", 662712, "/gwEJmzgoPdAlX4OODCP2QkMMhca.jpg"),
          M("France", 602334, "/7posmlxkGAXll9yZrp7Fr2zeHVg.jpg"),
          M("The French Dispatch of the Liberty, Kansas Evening Sun", 542178, "/6JXR3KJH5roiBCjWFt09xfgxHZc.jpg"),
          M("Dragon Ball GT: A Hero's Legacy", 18095, "/reNPMjkPg9f6wgf6kHSSkKjBarL.jpg"),
          M("Lingui: The Sacred Bonds", 820693, "/5Cg39mHfs9u8UiqZJZy5uYANWgG.jpg"),
          M("Memoria", 511819, "/uZ4GABzjCIiQNlYSgjXoaf6rpK5.jpg"),
          M("Nitram", 797457, "/j9dGkbHpSM254QhoLNxetvszcHa.jpg"),
          M("Paris, 13th District", 746131, "/kSXPsrausCYVsDnQaJfhzqR9fV7.jpg"),
          M("Petrov's Flu", 609490, "/21tEnMDu4eZ2kYPcdcwibxEqiYr.jpg"),
          M("Red Rocket", 763329, "/345gLhiNpItU1ICx8OxJQwjgPmH.jpg"),
          M("The Restless", 788942, "/e2hoo5SZNL2Y8dOL6fnCy1f6Osb.jpg"),
          M("The Story of My Wife", 574078, "/4PilF6fzZpbHVuT0EIYwqElSyc0.jpg"),
          M("Three Floors", 608980, "/59kVQe8wrHp845gBR9TDHzNwfeQ.jpg"),
          M("The Worst Person in the World", 660120, "/1NxGNQchGBTHXJ6RShLY1IlZqWn.jpg")
        ]
      },
      2019: {
        winner: M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"),
        nominees: [
          M("Atlantics", 496967, "/zRnZM6HqglFK31MYyrTSQVlj1dQ.jpg"),
          M("Bacurau", 446159, "/tBa4zMGzZUco26XT3WfZZCwQ76i.jpg"),
          M("The Dead Don't Die", 535581, "/ndvOjo7Nfk8ULnFLMXthPzhI62L.jpg"),
          M("Frankie", 505941, "/7w08bcG8IIM5vk3lwAnvwTDUncv.jpg"),
          M("A Hidden Life", 403300, "/rdG4jfH0rxkB2FgkYmjj9V4Q31M.jpg"),
          M("It Must Be Heaven", 539531, "/ljor2pWczSOQFBGAMevqZ7s8D4W.jpg"),
          M("Little Joe", 504585, "/q4VMyavCoXxN9U8AONE2YryQDVz.jpg"),
          M("Matthias & Maxime", 519141, "/j3DI3UjYBRqIbO1keUU1Bzn5qG6.jpg"),
          M("Les Misérables", 586863, "/2ZQV9rPFXF0iFfKbsAvVIweQ1yM.jpg"),
          M("Mektoub, My Love: Intermezzo", 504588, "/j3F4HpGnAlm34bsukL1TAlrBon6.jpg"),
          M("Oh Mercy", 574097, "/gAto9h3A42MuB1uaMtClI8E2yVK.jpg"),
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg"),
          M("Pain and Glory", 519010, "/cMlueArJXXwZbeLpb4NhC3pxmBk.jpg"),
          M("Portrait of a Lady on Fire", 531428, "/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg"),
          M("Sibyl", 559401, "/9W4pznUF8Np6qHExgclaRHVHzom.jpg"),
          M("Sorry We Missed You", 522369, "/jNvlqNDnXH8aqBeiBxNNP0wWWO3.jpg"),
          M("The Traitor", 575452, "/bjb1zKlyw85hYwDXzz2UM6XqjUU.jpg"),
          M("The Whistlers", 504582, "/osVaEZasM0LH6l5OPflFIT4G1H8.jpg"),
          M("The Wild Goose Lake", 575428, "/w49o4vmNFpCt4VFJp7ip6tjHh3x.jpg"),
          M("Young Ahmed", 522373, "/z4D3GE3JzyrFe7pnSUqDwdq1KhY.jpg")
        ]
      },
      2018: {
        winner: M("Shoplifters", 505192, "/4nfRUOv3LX5zLn98WS1WqVBk9E9.jpg"),
        nominees: [
          M("3 Faces", 517731, "/clpmeXLRg65zGGP1zoyYOLIakQG.jpg"),
          M("Asako I & II", 487850, "/nqwfB2GMMjrjAJnQj1hxD97sQXF.jpg"),
          M("Ash Is Purest White", 441393, "/l6UkF23uWkO25x7UEMnT0H4R5GR.jpg"),
          M("At War for Love", 403450, "/bmy7S1xTY9yLJTg48pxucx790xZ.jpg"),
          M("Ayka", 519185, "/7jdtAkYV5WO2zr27VZey52lxVh3.jpg"),
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg"),
          M("Burning", 813106, "/hxGv1O2W5SOJTmiBc45CL842mrx.jpg"),
          M("Capernaum", 517814, "/mFnfTVADj8yOxwzprYOmTPselk8.jpg"),
          M("Cold War", 517104, "/fNtvmW8vkxmsmQbYUdRrPZHxeRM.jpg"),
          M("Dogman", 483184, "/eaZq1G8sJHv9f9a5IzioQlS3REX.jpg"),
          M("Everybody Knows", 401545, "/1TuuM451os3NaltCwGfPCVL2BST.jpg"),
          M("Girls of the Sun", 479520, "/fgVoQyioqX2Q78lnBO7CYqQ8eOZ.jpg"),
          M("Happy as Lazzaro", 481432, "/j4x1O6G0cbchHQwNsEZ0DntOJMJ.jpg"),
          M("The Image Book", 414030, "/5y1mTTYPVvaPeKIVqy3DymE6osv.jpg"),
          M("Knife+Heart", 475930, "/Aodlp3TH6FBti9igUCt8f5KS7Nb.jpg"),
          M("Leto", 502897, "/4rOkRmIhoPoyKUa5kDrIPizcglk.jpg"),
          M("Sorry Angel", 485189, "/rBPRcBXwmJLsVlVutuWKnYOiWuL.jpg"),
          M("Summer", 624086, "/6gHoTQY05YWhlRMBINuDclYPazC.jpg"),
          M("Under the Silver Lake", 396461, "/771Ey73LqsE9ORJhQCI25rgMXS2.jpg"),
          M("The Wild Pear Tree", 418472, "/s7kGE1MChkHD5VX8sv7SOGabGMZ.jpg"),
          M("Yomeddine", 517286, "/i9v06DMMNDSG4EDcE3Y7RLGo1pD.jpg")
        ]
      },
      2017: {
        winner: M("The Square", 401246, "/pefcv5VNspSK4Dt8doei5bJmmln.jpg"),
        nominees: [
          M("BPM (Beats per Minute)", 451945, "/azLtGx5ZhdTSP2b4oNLWtiE51OW.jpg"),
          M("The Beguiled", 399019, "/x4R9jyiZhJzevASus5n6WyHQTdR.jpg"),
          M("The Day After", 777539, "/eU4FYe9p7Lwz8gjPsXP4egVqBwW.jpg"),
          M("A Gentle Creature", 442947, "/rGQ5owiGxmY7J2drGNdDKxUFlmy.jpg"),
          M("Good Time", 429200, "/yE1c9hj5Hf8a9KplAdRdhADqUro.jpg"),
          M("Happy End", 399031, "/tAHzP9O0MOswvWFv5jtWGTyMYXl.jpg"),
          M("In the Fade", 423646, "/AdH8xoP2wAFZDMWiSoCGoLa0DUr.jpg"),
          M("Jupiter's Moon", 444395, "/lhxOYoKfLjaicDckUf8pX04ilOf.jpg"),
          M("The Killing of a Sacred Deer", 399057, "/e4DGlsc9g0h5AyoyvvAuIRnofN7.jpg"),
          M("Loveless", 429174, "/oBUsLGZoGuLKMuHj19mjG9iCDoq.jpg"),
          M("The Meyerowitz Stories (New and Selected)", 396398, "/c9teDTgwxgnb7wnZjZo4oNcF80R.jpg"),
          M("Okja", 387426, "/lHBYG2NcBMW7UpFL4rSCpsgvz4m.jpg"),
          M("Radiance", 444428, "/l7fR2WW7mnXl0nrZSHeCBxbljeH.jpg"),
          M("Godard Mon Amour", 416186, "/JfAE5Pj1Qqv7Ij5DaUG0QoZC97.jpg"),
          M("Rodin", 445768, "/3bQGnpTM2uluIMC1wfZWW5ldunp.jpg"),
          M("Wonderstruck", 383709, "/7hPnW1yWlIJcKCEQ5Kbr5dMtrDp.jpg"),
          M("You Were Never Really Here", 398181, "/nx4lUyQNEzJowcF55VAP0TQEaX0.jpg")
        ]
      },
      2016: {
        winner: M("I, Daniel Blake", 374473, "/nu3WVABXz2W85N6JXTZOT1aWS3b.jpg"),
        nominees: [
          M("American Honey", 340485, "/41SVO0AElBAl7zks9dFhJ0OjHni.jpg"),
          M("Aquarius", 377273, "/9hwkjmtl3HCXe7JW2BVSyjLXHCo.jpg"),
          M("Elle", 337674, "/z446adpGUVXXPxrLpKBGnYBcofk.jpg"),
          M("From the Land of the Moon", 376166, "/l6CQmiMBi1z6BIEC2XpUaOpfsc4.jpg"),
          M("Assassination Classroom: Graduation", 359628, "/77fTE8nJY5ZMm7b4Nk8ntBC6ccf.jpg"),
          M("The Handmaiden", 290098, "/dLlH4aNHdnmf62umnInL8xPlPzw.jpg"),
          M("It's Only the End of the World", 338189, "/riWa3WZrO3n8lLWuaEVMgaqAZGn.jpg"),
          M("Julieta", 332872, "/z4aErD1RQQ3alpu3PoUu408HEVc.jpg"),
          M("The Last Face", 287904, "/egOM3BJgA44fR6YdiQJD51iQ4On.jpg"),
          M("Loving", 339419, "/teNPeDIRGWxtvMaJsNa7lw5IgiL.jpg"),
          M("Ma' Rosa", 392790, "/bKfnlEoZHewglGvNmWvnJ9X1Bt7.jpg"),
          M("The Neon Demon", 301365, "/3rBo2AfWSlvsPmYFdJsNUMfkNIo.jpg"),
          M("Paterson", 370755, "/AuJ1ZlfqwuAr9H5Qr1U9KILylse.jpg"),
          M("Personal Shopper", 340676, "/cdm6qZgmbaIwjKBZnUSGWS4eyM2.jpg"),
          M("The Salesman", 375315, "/x4PIuYU5ZMMXiTrheNR8vCTYPBf.jpg"),
          M("Sieranevada", 374452, "/q48ZKaoCQg5nVJvfXBRzMTl38Fa.jpg"),
          M("Slack Bay", 371865, "/7P1fgJAuKxzFCgEU3B3YS9c4Oz.jpg"),
          M("Staying Vertical", 380622, "/3Q0iRB26y60JVW6HpbOru1BnH4h.jpg"),
          M("Toni Erdmann", 374475, "/v3gf7T8hb8aYv05X2jHmxJQWPZr.jpg"),
          M("The Unknown Girl", 340481, "/owxEl8EMMTwiy73L5n5zM9jaTws.jpg")
        ]
      },
      2015: {
        winner: M("Dheepan", 314402, "/qNMjRNrIzvljInNLf3aLYZI3Ih4.jpg"),
        nominees: [
          M("The Assassin", 253450, "/10RcGMfzg2lIW1aLcR4ILfNbHK2.jpg"),
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg"),
          M("Chronic", 337104, "/wZKskeOrrftsVBVgVu4egXxxmdF.jpg"),
          M("The Lobster", 254320, "/7Y9ILV1unpW9mLpGcqyGQU72LUy.jpg"),
          M("Louder Than Bombs", 157827, "/4tEtGPnolE93wlsj9g1fg9zR3dk.jpg"),
          M("Macbeth", 340564, "/6XsaiY8jP2SENyQSzZkOSfeArbk.jpg"),
          M("Marguerite & Julien", 330294, "/yUUJ8gTY4wJGTKHgQqQe9fM4fLP.jpg"),
          M("The Measure of a Man", 329712, "/fMsOEBcAeBL74xWMUj6hgDv4l1y.jpg"),
          M("Mia madre", 315872, "/fkTsusFtFE5qvYkzFIben1aKsTn.jpg"),
          M("My King", 329805, "/kOhRkC7J3jpAgHGC0Uh3SoCqU4c.jpg"),
          M("Mountains May Depart", 314388, "/zMg4uP2Ev8lIZr1kOvHrPOM8teA.jpg"),
          M("My Daddy My King", 383429, "/6R8Rxu3LsHdRNaz6jR1O3vWKu5i.jpg"),
          M("Our Little Sister", 315846, "/x9A0AtEg5EEYbDGfP8NqH3C9w8M.jpg"),
          M("The Sea of Trees", 291351, "/gmVGIEfzxupZUTer1Z5n80CHFnD.jpg"),
          M("Sicario", 273481, "/lz8vNyXeidqqOdJW9ZjnDAMb5Vr.jpg"),
          M("Son of Saul", 336050, "/9ZcX6NjCJam5uwkooXffhHI29Lj.jpg"),
          M("Tale of Tales", 314405, "/ryZsoaYmcEJsye6P5uo5thEjpqB.jpg"),
          M("Valley of Love", 337107, "/a8Q1XxOdAsch0yEwuhTTasUnaqd.jpg"),
          M("Youth", 310593, "/ceRN51oeadmccAvqvDxpnnNRcLU.jpg")
        ]
      },
      2014: {
        winner: M("Winter Sleep", 265169, "/95j83qOqH3Ivz4RYkaSjGT0VSNr.jpg"),
        nominees: [
          M("Bird People", 266040, "/moJ3ozCPhj7pSiCzH6x9JuWa4G6.jpg"),
          M("The Captive", 244761, "/wLoFxTZFEfAzFLk2qSoPbcz58Jb.jpg"),
          M("Clouds of Sils Maria", 246860, "/dtCZ31RlokpkAaKMr9jFCJjBngi.jpg"),
          M("Foxcatcher", 87492, "/w6Sl079QtUcQ9dVQ2RP6aN9NBXx.jpg"),
          M("Goodbye to Language", 114982, "/dQ0qBocOIz5VgoEPQDptOXRwWEv.jpg"),
          M("The Homesman", 264656, "/eGpuOhkm1wG2AxEJShazH5NVGAO.jpg"),
          M("Jimmy's Hall", 262958, "/lo5MjmuMTTcgGVsup5RvjtDj4T7.jpg"),
          M("Leviathan", 14372, "/extm7kFsxr0qMoi1G5F3w5Lwlt4.jpg"),
          M("Maps to the Stars", 157851, "/aoMNfiaMmT7o7wY8oXWCLErZtah.jpg"),
          M("Mommy", 265177, "/uPDP0cHGOpkr47rdCdHWo4CyiPj.jpg"),
          M("Mr. Turner", 245700, "/rnVhl1PFSOoW5c6UhZJZt5TV98p.jpg"),
          M("Saint Laurent", 221667, "/3CjpieZ2qIcX43ZehKq2lv5wwOh.jpg"),
          M("The Search", 245692, "/oKBssmqkeguXW3TxncwU980fuZB.jpg"),
          M("Still the Water", 265193, "/wGylYtfMvKM7DwEI3CsdLTFJPTg.jpg"),
          M("Timbuktu", 265228, "/tCpHpn8msgonS9HVDMkrcSZh4an.jpg"),
          M("Two Days, One Night", 221902, "/2qpZZ5a5Axpk8OeCtrvNTQfJiB2.jpg"),
          M("Wild Tales", 265195, "/bU7IUeTdYFOgeUPtwpWKQNhORMC.jpg"),
          M("The Wonders", 265226, "/u5Z23Rt9OKhQc61wPPwrDs4psdi.jpg")
        ]
      },
      2013: {
        winner: M("Blue Is the Warmest Color", 152584, "/kgUk1wti2cvrptIgUz0VTAtSF6w.jpg"),
        nominees: [
          M("Behind the Candelabra", 119675, "/iodt6hrewVXxR415PIjBeuZg3Qs.jpg"),
          M("Borgman", 186929, "/kasPhXDk4BI4FUS3ku5Y4GrgBJY.jpg"),
          M("The Great Beauty", 179144, "/1cmOc3ZPkuCTOTqHEsRr3Pk81Um.jpg"),
          M("Heli", 186935, "/cblCQ0h5oFYlufWoYeFJZAYm0bZ.jpg"),
          M("The Immigrant", 152599, "/ArWRRQYeXL3nG4jYpMOPoBvgmy9.jpg"),
          M("Inside Llewyn Davis", 86829, "/nNxK3pC3DMpPpWKMvo2p3liREVT.jpg"),
          M("Jimmy P.", 160768, "/fjOBKLWWV8vqk68NLksUSa20LEo.jpg"),
          M("Like Father, Like Son", 177945, "/r0nejXOf6e4leWhnLuEQOmC5hrX.jpg"),
          M("Age of Uprising: The Legend of Michael Kohlhaas", 186971, "/hlLec0D9nq9TSv5OjbgqPqEDGKK.jpg"),
          M("Nebraska", 129670, "/o1t2Mw18EEBnl8v4Nby3PFjxnM1.jpg"),
          M("Only God Forgives", 77987, "/kWjjFSng1JttmDRwDROoGcIArEh.jpg"),
          M("The Past", 152780, "/8nff89qjYN3Hck5G33xeRPsM8TZ.jpg"),
          M("Shield of Straw", 180900, "/et0mSWojiLxrXjTikUYDFjCY9H1.jpg"),
          M("A Touch of Sin", 187022, "/6I6XVBrUYBWPDPMdk647VvTSNqx.jpg"),
          M("Venus in Fur", 197082, "/b9pCYixO3ZO7tB303efB3O4nkqC.jpg"),
          M("Young & Beautiful", 184314, "/4RSjzqKIqL5g2OxVIEZQ6ksP1MW.jpg")
        ]
      },
      2012: {
        winner: M("Amour", 86837, "/19hyCudualHxCD0GrEngqsi0wBF.jpg"),
        nominees: [
          M("After the Battle", 103739, "/fwY485uwlzouyJeUzcsKXzLRT2Z.jpg"),
          M("The Angels' Share", 103747, "/bt9kJ8gwTMaDcmL0INlJYIZ887t.jpg"),
          M("Beyond the Hills", 103740, "/zV2v5jFXlN2We3GS2IkGQ6e2Bmm.jpg"),
          M("Cosmopolis", 49014, "/94m7J9YeO0W7IEbfsOtFbweGgcu.jpg"),
          M("Holy Motors", 103328, "/4ZuTrrDQhCS9f6KzIX6HfsjjyMd.jpg"),
          M("The Hunt", 152578, "/kZiOV6dd4nN479voV83fSYMhmwC.jpg"),
          M("In Another Country", 103753, "/k3yhKHTkMzmgHyN5uArZNqxNoq.jpg"),
          M("In the Fog", 103742, "/2twLjXUVEdG8F56ROAb1oOUDZPK.jpg"),
          M("Killing Them Softly", 64689, "/heaz45kpFa4Oa7iLis0OBas68ls.jpg"),
          M("Lawless", 82633, "/Ahtzwts22ayviD3LEVslfL4nRWB.jpg"),
          M("Like Someone in Love", 102001, "/g28JeY54PspCF9w0kdgwRhK1Qtu.jpg"),
          M("Moonrise Kingdom", 83666, "/y4SXcbNl6CEF2t36icuzuBioj7K.jpg"),
          M("Mud", 103731, "/o2jT5jQdKh1HAF0fMKuGwBOwOYB.jpg"),
          M("On the Road", 83770, "/k7LQteD02p3VHixbS6NXHkFdFwT.jpg"),
          M("The Paperboy", 82390, "/AiALtw5Nl4adb6oO4VndBPo3RkQ.jpg"),
          M("Paradise: Love", 103686, "/nah6G8dNvjL6L8k3wumcR3DH3KC.jpg"),
          M("Post Tenebras Lux", 103689, "/xIKrYjBvMlqZ2yYuZZt3R2iLHJq.jpg"),
          M("Reality", 103758, "/bl2Hy8yyHXmTSDLz3NMxIe9wgIo.jpg"),
          M("Rust and Bone", 97365, "/6bcerd7CeQ5y5Dilym1O2C8c8Gl.jpg"),
          M("The Taste of Money", 103750, "/uMz28D5XxrdUddxfJpR3NJDAbVi.jpg"),
          M("You Ain't Seen Nothin' Yet", 103717, "/qXWGsizU1BQEbwn2mIlvHesBUtA.jpg")
        ]
      },
      2011: {
        winner: M("The Tree of Life", 8967, "/l8cwuB5WJSoj4uMAsnzuHBOMaSJ.jpg"),
        nominees: [
          M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg"),
          M("Drive", 64690, "/602vevIURmpDfzbnv5Ubi6wIkQm.jpg"),
          M("Footnote", 72551, "/qy0W1KssDhGbtisBGKZHlcuuYqn.jpg"),
          M("Hanezu", 96811, "/yHp8vWOkzfZLCd9faDP5WUn8cd6.jpg"),
          M("Hara-Kiri: Death of a Samurai", 85836, "/rqIqSoxbsVTfcr6CgTtSpzJBkYt.jpg"),
          M("Le Havre", 73532, "/zCoGiKr8hn9fPYnxECjUhpaP8TI.jpg"),
          M("House of Pleasures", 84427, "/adkiqkEOKW8nMlfF8hVcaPWTAwB.jpg"),
          M("The Kid with a Bike", 63831, "/5uRiWyYSAYYScTRe9HP7BHpOQvr.jpg"),
          M("Melancholia", 62215, "/fMneszMiQuTKY8JUXrGGB5vwqJf.jpg"),
          M("Michael", 226008, "/eJurvojUZoQZFAaNGRIb67x2RRW.jpg"),
          M("Once Upon a Time in Anatolia", 74879, "/bN84guFndgvtWIvFC7sTD8AAJDE.jpg"),
          M("Pater", 78162, "/sdGF6liFfLgSlJUywhk0zEw9O2.jpg"),
          M("Polisse", 71157, "/cKs3XSFVbFeZcH3g9geAvr6ApOl.jpg"),
          M("The Skin I Live In", 63311, "/xa7uCwGYykrf8MMI8iF5dZvNlrG.jpg"),
          M("Sleeping Beauty", 64586, "/l1Lx8iRsml1JnPBY0qgn6IN5FQg.jpg"),
          M("The Source", 1200575, ""),
          M("This Must Be the Place", 53487, "/7WSD4SAMGVP6BHSOzDGL9Acunxd.jpg"),
          M("We Need to Talk About Kevin", 71859, "/auAmiRmbBQ5QIYGpWgcGBoBQY3b.jpg")
        ]
      },
      2010: {
        winner: M("Uncle Boonmee Who Can Recall His Past Lives", 38368, "/iZinYNVaBLg3pj4e8IXwvfXAtrI.jpg"),
        nominees: [
          M("Another Year", 44009, "/zrkQcAatfBox5x9KZjaYGnKoqu6.jpg"),
          M("Biutiful", 45958, "/4BLshBMp8INRDhvfuKwxMlHDIIt.jpg"),
          M("Certified Copy", 48303, "/soBvtCR33Gv1j6gXwXOIc3JTlNc.jpg"),
          M("Chongqing Blues", 63458, "/1aXoesJC08BFpLO5WMNC2lLbaXV.jpg"),
          M("Fair Game", 38363, "/tX2cafjaDnEOi50xnUIloAc2fp2.jpg"),
          M("The Housemaid", 45202, "/acrlZuaS7ypiEUb3oZRA28Ox7TV.jpg"),
          M("Joy", 58396, "/jmv81zxQ9MEcx3eG9PhpT6UnKyl.jpg"),
          M("My Joy", 60981, "/ek1lclrmb1qH3xcL7kC8ue8mncu.jpg"),
          M("Of Gods and Men", 46332, "/fgrC0w62MCc7Fn77l5RVY0WKv0t.jpg"),
          M("Elvis on Tour", 42482, "/hXxKJuQnkwFtWvOX161ppbaiaC2.jpg"),
          M("Outrage", 45284, "/s6VVl5WKuGIDlSAm8hgvTsrzODK.jpg"),
          M("Outside the Law", 47904, "/6Ol0JPw7wcvY34VDBLNjXsemg5O.jpg"),
          M("Poetry", 47909, "/dcefUQ0AIgRvkh9DS76tvetzxc2.jpg"),
          M("The Princess of Montpensier", 57695, "/ozR4LwG9vjV9oFKtEYUO8VsYamf.jpg"),
          M("Route Irish", 59065, "/u82X81dSc7d0hcDf34RBv568eFm.jpg"),
          M("A Screaming Man", 57602, "/q90ysGM6CQmHnUTGGU4x5TBv4hn.jpg"),
          M("Tender Son: The Frankenstein Project", 73311, "/34wLBAaSp1dZd9AIOo9DQqUCUpk.jpg")
        ]
      },
      2009: {
        winner: M("The White Ribbon", 37903, "/54dlnGDexrwAFlDb8HWKfmmX4LB.jpg"),
        nominees: [
          M("Antichrist", 17609, "/ge7zbYvpfsDP3luKi0iSpzOgncM.jpg"),
          M("Bright Star", 29963, "/csN6y4nq2kaBiegHaGw0DGp4plf.jpg"),
          M("Broken Embraces", 8088, "/uPTOKnc9bzPp1emH3TyuKOGIylQ.jpg"),
          M("Enter the Void", 34647, "/krKnsfvSJM1PL40tLicRhVQ6kuG.jpg"),
          M("North Face", 16436, "/onTd66RoxdrLKUhtcS1IOwdvjCv.jpg"),
          M("Fish Tank", 24469, "/rI3MKBDsWzQHi9PWDAMKkgmYcff.jpg"),
          M("In the Beginning", 35164, "/mmSS9WKmtjBzax2amx60p3HAu3L.jpg"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"),
          M("The Execution of P", 64450, "/cTj91tCZupzRDJhevh7PmTl2J4g.jpg"),
          M("Looking for Eric", 18898, "/fTHUY0E1FYMFKiQ8UDKx793LtW0.jpg"),
          M("Map of the Sounds of Tokyo", 46458, "/fXUvJlnQdB8hBiBRumpFj8hj0Wl.jpg"),
          M("A Prophet", 21575, "/x9Jb8kewBHPzjTtgCQvoQoDsy4d.jpg"),
          M("Spring Fever", 117646, "/9OLJx4JHimNTsRIw7Y0ObzJouP9.jpg"),
          M("Taking Woodstock", 26320, "/wIdyAJCvIj3QUoNmmDdnhXpCMpp.jpg"),
          M("Thirst", 22536, "/sFgvkGpXLTydvHqBCXw54OB8R0h.jpg"),
          M("The Time That Remains", 44898, "/e5TZB7yvSr7LDoVrlVeeSotpRD0.jpg"),
          M("Vengeance", 18899, "/iEi7kOABrTvhwBi3np9wTwNKWNn.jpg"),
          M("Vincere", 30239, "/zt9yAFfkOia3NltkhjMT5WaPlcV.jpg"),
          M("Wild Grass", 37842, "/wLy9Tp03uaQLV5IRHtjAYGiURdW.jpg")
        ]
      },
      2008: {
        winner: M("The Last in the Class", 60455, "/oCzit4MDxgJ48AfDFX52Bi9LWHv.jpg"),
        nominees: [
          M("24 City", 29972, "/zAtPh6od2wiaarDxwnpXeD3IgKF.jpg"),
          M("Adoration", 8895, "/pHYpXNJPsYQ3aOK2MTLzsvszlYh.jpg"),
          M("Blindness", 8338, "/deBsx5IxyqCC217j3VY24TkkE0Z.jpg"),
          M("Changeling", 3580, "/y9Qi39dL3PceGCH8afyC7QrhbhI.jpg"),
          M("Chestnut: Hero of Central Park", 34672, "/quDRdSE0gZ1Q1lpOkZVq4ek2kaQ.jpg"),
          M("A Christmas Tale", 8892, "/s4GuaDBfmLt4fTo3xyWw3iD5iwK.jpg"),
          M("Delta", 8896, "/qXfD0rh8kec7FTsPuf9L6iYGlJN.jpg"),
          M("Gomorrah", 8882, "/3XcCTqSovFZE5GRebJmh1kHwziw.jpg"),
          M("Il Divo", 8832, "/g1bgM34ZGldqcGkucmaGZe4pMBu.jpg"),
          M("Lion's Den", 8900, "/mpYcisTwGJDnmlmjRrvySGcmbkX.jpg"),
          M("Linha de Passe", 8902, "/xKx5msZOhp71R7w9LPudDfrFQsz.jpg"),
          M("Lorna's Silence", 8899, "/rwQPg2DgFygbZjdupJcedPEm0JN.jpg"),
          M("My Magic", 8903, "/9mu3YmNDsp4BX1qvm7wuB5SSw0n.jpg"),
          M("Palermo Shooting", 8886, "/hDTuyypuDHngXat0tt49wYoBBXg.jpg"),
          M("Service", 8904, "/qJXdfE1VTYQFLvljHIzAWulQyXD.jpg"),
          M("Synecdoche, New York", 4960, "/5UwdhrjXhUgsiDhe1dpS9z4yj7q.jpg"),
          M("Three Monkeys", 8905, "/tyIKP8SSTkw9xEXAG9lj5jEnIfW.jpg"),
          M("Two Lovers", 10362, "/skwYEUcxhUub9QCSwPDMvBySphS.jpg"),
          M("Waltz with Bashir", 8885, "/zQaCv7lKwHsh0YSHkt1QNjIOZ1c.jpg"),
          M("The Headless Woman", 8898, "/qzDfJLfKQZY9D6zpaadFiugtphK.jpg")
        ]
      },
      2007: {
        winner: M("4 Months, 3 Weeks and 2 Days", 2009, "/acEtvzFPeOQwbzRWncjRLenhnKV.jpg"),
        nominees: [
          M("Alexandra", 17479, "/6U6akMnCZyss1EVOR5P2SPHnDRz.jpg"),
          M("The Banishment", 25142, "/hD5Dg3VztZbvk2aqQsHh1e5jUP4.jpg"),
          M("Oscar Niemeyer: Life is a Breath of Air", 148183, "/7prXF30ollJkVaTzdHKhU5rezC4.jpg"),
          M("Death Proof", 1991, "/vtu6H4NWnQVqEp3aanUq3hNeeot.jpg"),
          M("The Diving Bell and the Butterfly", 2013, "/6NkJ4gnLrvLj0PZDW6sNM85JMbj.jpg"),
          M("The Edge of Heaven", 2014, "/kqhVVpXFtOotSlK0npVaBHXUqxV.jpg"),
          M("Import/Export", 4998, "/rYZMhf8W3peoMN7DDgZENM9SR1l.jpg"),
          M("The Last Mistress", 2002, "/mlwZeO5eddSHTeoRbH5htWT3ZQU.jpg"),
          M("Love Songs", 14448, "/2dThA0hUYQEvx3AXmzeh8Rsgc2k.jpg"),
          M("The Man from London", 31262, "/poBhgpN4fJfzaRuG4wMLah3rHLw.jpg"),
          M("The Mourning Forest", 2010, "/fzi6QI5HU1917J9AvWa7uL5AF0.jpg"),
          M("My Blueberry Nights", 1989, "/w9w3m2IB9QRZXxi6R51ZamKv3HS.jpg"),
          M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg"),
          M("Paranoid Park", 1990, "/qdxQ8vZJoZuLqU9MXYW2vnRwhan.jpg"),
          M("Persepolis", 2011, "/aU8i2QAdTyRR1nYb36Gq51xXP8p.jpg"),
          M("Promise Me This", 8269, "/bUKi2hgulPO8CbtAF4jgVhbTLqg.jpg"),
          M("Secret Sunshine", 2015, "/vee1jyUrqUEmi5ZStWI1JJzLQJH.jpg"),
          M("Silent Light", 2012, "/kniOoQky3GX9ljyzobwRUGFgQUT.jpg"),
          M("Tehilim", 126682, "/edwVwQKWwykljbujXB8n4E2A1Lh.jpg"),
          M("We Own the Night", 2001, "/fcb2c9BcRc21iiWih23FQfT39uB.jpg"),
          M("Zodiac", 1949, "/6YmeO4pB7XTh8P8F960O1uA14JO.jpg")
        ]
      },
      2006: {
        winner: M("The Wind That Shakes the Barley", 1116, "/yCb4LweL6U7KTgSda3Wb7vHiA9J.jpg"),
        nominees: [
          M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg"),
          M("The Caiman", 31289, "/mPil7yQR4norsr2urNofv9Ym1Ql.jpg"),
          M("Charlie Says", 68944, "/1XApWjUDrToGdC7O4vTPvq96ma2.jpg"),
          M("Chronicle of an Escape", 25532, "/rjizxUO1zTNre3vOLyF6Zc9pAxf.jpg"),
          M("Climates", 18421, "/ikTWwbyIwaFlqAGpD8jwqgghQz0.jpg"),
          M("Colossal Youth", 82404, "/7gXzGezgUDaYsauYGPhM3Dmbt2g.jpg"),
          M("Days of Glory", 2016, "/d78c7G8wDVGUTWH95tpuEGiK6IZ.jpg"),
          M("Pan's Labyrinth", 1417, "/z7xXihu5wHuSMWymq5VAulPVuvg.jpg"),
          M("Fast Food Nation", 8324, "/vcRgWIj4p6FtezgZTl4YoxYbSJ7.jpg"),
          M("Flanders", 36143, "/qY8n5t12OBfiQI1X2rI4YrYxVoA.jpg"),
          M("Thomas & Friends: Thomas, Percy & the Dragon", 53511, "/kQ7kT5IrKRgl635rMTK1jumDm7H.jpg"),
          M("Lights in the Dusk", 1379, "/vBn28XPBI4vOKye1NSTGghdvGoJ.jpg"),
          M("Marie Antoinette", 1887, "/cybXGmv8Rjd5Os8Xml6YxMBQ0Zt.jpg"),
          M("Red Road", 11705, "/cxS2bylNtyGevLcFHowIHvGkQGv.jpg"),
          M("The Right of the Weakest", 71732, "/w8rQ9K9FeeG2LvScbgZQlcpWbkn.jpg"),
          M("Southland Tales", 4723, "/7dbIDQ80z4bxiDlAvxRwc5TI44C.jpg"),
          M("Summer Palace", 17422, "/kr0UdRRdjZigVfdYoik9kPy97hk.jpg"),
          M("Volver", 219, "/m1ZUDGTFtVGE3zjTvF8OiQ9um5e.jpg")
        ]
      },
      2005: {
        winner: M("The Child", 11490, "/dk7ZpsVKLt2nwjQZZIde0WP4oQV.jpg"),
        nominees: [
          M("Studio Bagel's 10th Anniversary", 1075621, "/lnZ664YVBl1uiFp63JSYZNwpNIo.jpg"),
          M("Battle in Heaven", 17247, "/jChvXVA8qpIIhMKT3BLA9Cftwzt.jpg"),
          M("Broken Flowers", 308, "/gd8JNjwgiM6ZgGm6NFAkovQWoYn.jpg"),
          M("Caché", 445, "/vTzjRi0Uhy0tt3Rjw8SARZZJHlX.jpg"),
          M("Don't Come Knocking", 3527, "/sF9LWvw71gaGR46QtJIFGtLXhWc.jpg"),
          M("Election", 18747, "/js9w4pQNJq9si5AlwdvojBfC9Ml.jpg"),
          M("Free Zone", 7483, "/ud4A2xRAa6j92dTuOy2B2Glv5xY.jpg"),
          M("A History of Violence", 59, "/A26rcvipOqptVs7i5uRmKicXRxE.jpg"),
          M("Kilometer Zero", 126300, "/uNT8VQeQS3dE4e3hQMzCtzYqPZJ.jpg"),
          M("Last Days", 1665, "/btbp47CHXgLhw30kyDoVfNFLB3g.jpg"),
          M("Lemming", 1622, "/zzGmXQnc9xsFoVM1Zqqm7r4hfBp.jpg"),
          M("Manderlay", 1951, "/6HYoHEcLNgETHlJDyQrC4Y7e01.jpg"),
          M("Once You're Born You Can No Longer Hide", 57425, "/8Xqp5Htgpyr9MVpuBHEN5eyyt0k.jpg"),
          M("A Woman in the Painting", 950140, "/sK5odXzIApQwtVeMhDrp9WAb5hu.jpg"),
          M("Shanghai Dreams", 101908, "/tPm6d6y6zsBdMZpmru5XNlE57s7.jpg"),
          M("Sin City", 187, "/i66G50wATMmPrvpP95f0XP6ZdVS.jpg"),
          M("Tale of Cinema", 85550, "/8YrfSqpiTtJvmYqstkFHyzX5SEe.jpg"),
          M("The Three Burials of Melquiades Estrada", 8053, "/uHOEb6mo45qMSJaZqbkVa7oW1Y7.jpg"),
          M("Where the Truth Lies", 9729, "/4gWQoxAmSeBaugpccnWdlg5Ov6f.jpg")
        ]
      },
      2004: {
        winner: M("Fahrenheit 9/11", 1777, "/1WQgOCJj22zF7Bsr0pIBgGBr71q.jpg"),
        nominees: [
          M("2046", 844, "/jIN65qw0Giplo4CshzMrxz204Wn.jpg"),
          M("Clean", 191769, "/2yDrdpjqomEknzqATUyZCZfSE6e.jpg"),
          M("The Consequences of Love", 24653, "/2ubdrvMHcRTFzkUdmSIuvupLqRS.jpg"),
          M("The Edukators", 276, "/jpiXFtvBYemLbAktLPNx5xDGvJn.jpg"),
          M("Exiles", 18497, "/enhjywSKKDgdZZKhRp0iEWfJFZ5.jpg"),
          M("Ghost in the Shell 2: Innocence", 12140, "/1ZJRbLDVr90KLtKdmTT4WZhT26E.jpg"),
          M("The Holy Girl", 44413, "/srA4HPJe0YpDTZ4L4Nj5psD7v48.jpg"),
          M("The Ladykillers", 5516, "/l4g9R39NCp6VaYFrw6q8JwKNW9x.jpg"),
          M("The Life and Death of Peter Sellers", 10609, "/eZHnSd73L5v5FDZdBpGhQPLUZGW.jpg"),
          M("Look at Me", 11399, "/kRtLMLdf6PkOjWCvhTpa811aMZy.jpg"),
          M("Mondovino", 48121, "/ciXRSY7ScGESKXx40llMb4IMUsE.jpg"),
          M("Nobody Knows", 2517, "/kDUUdWrbBBVqzSmm27pHFJcTvCU.jpg"),
          M("Oldboy", 670, "/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg"),
          M("Shrek 2", 809, "/2yYP0PQjG8zVqturh1BAqu2Tixl.jpg"),
          M("Tropical Malady", 11534, "/9WJ8ZSZp2NC7jSvweFLskldpzzg.jpg"),
          M("Woman Is the Future of Man", 16447, "/3bovtjGw5XB3aDKaWkfYnCupBbI.jpg")
        ]
      },
      2003: {
        winner: M("Elephant", 1807, "/1a4VU9z2hxEvugHMK7VsobB9xTX.jpg"),
        nominees: [
          M("At Five in the Afternoon", 43969, "/3yu3Z0tDG03r4nM5vrZ5B3WQ7pg.jpg"),
          M("The Barbarian Invasions", 11042, "/ekmFbyMgm3SPklSlDUW1wZ33yMP.jpg"),
          M("Bright Future", 26886, "/bAvhFfZMAze7TyzCVyDM9SUGGUM.jpg"),
          M("The Brown Bunny", 12703, "/bGzU4TgdqmMjIfPIgf2MjDW6H7c.jpg"),
          M("Carandiru", 8440, "/kKAgIMwQWQ6u4s0c56XKSDX3vAs.jpg"),
          M("Dogville", 553, "/lraVawavIXh5geMlVjpzCw9TGwR.jpg"),
          M("Father and Son", 44513, "/pGGUrgF5nPyMpJbiN87SlT2zqxB.jpg"),
          M("Incantato", 57424, "/6Fe77jXvkoDERdFNkBdrkV08Vvy.jpg"),
          M("The Chops", 68970, "/qhDoFi0z9eem3s5dt1YL4jmKiDE.jpg"),
          M("Mystic River", 322, "/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg")
        ]
      },
      2002: { winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg"), nominees: [] },
      2001: { winner: M("The Son's Room", 11447, "/e9s1Hvw9TcVZspbkq2V8Bmvhky1.jpg"), nominees: [] },
      2000: { winner: M("Dancer in the Dark", 16, "/pWzOfTJRZHPNO1VNrMnNFqRcJwg.jpg"), nominees: [] },
      1999: {
        winner: M("Rosetta", 11489, "/buwLjQPPA9FaATvKzeAppLXiGMB.jpg"),
        nominees: [
          M("All About My Mother", 99, "/hjQhzhkGYXPNM96k0mOgob6HMmn.jpg"),
          M("Ghost Dog: The Way of the Samurai", 4816, "/gkH4zOxIfbb4BEbk9Q4cVOEpDaY.jpg"),
          M("Kikujiro", 4291, "/zTelT1xAO4Owxk1jHJM4puoei5N.jpg"),
          M("The Straight Story", 404, "/tT9cMiVDdtlcdZxOoFy3VRmEoKk.jpg")
        ]
      },
      1998: {
        winner: M("Eternity and a Day", 24858, "/wH8sfLJCqNjsIw8zkXpvxdSzj60.jpg"),
        nominees: [
          M("Fear and Loathing in Las Vegas", 1878, "/tisNLcMkxryU2zxhi0PiyDFqhm0.jpg"),
          M("Velvet Goldmine", 1808, "/bsuSac0PldPFcOtR1Vioe7VBF4l.jpg"),
          M("The Celebration", 309, "/2LRzNq41yrY8EjCnD1S8sCCPvKk.jpg"),
          M("The General", 16885, "/3UUR2Evm2JtC2odd2UMYgs9Yi1x.jpg")
        ]
      },
      1997: {
        winner: M("Taste of Cherry", 30020, "/u6GYH4HyR0BVwpqFuTOc2g4KB1L.jpg"),
        nominees: [
          M("The Eel", 20506, "/3TEzcwdF3DPeO8uSPmCfBBUhgNp.jpg"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg"),
          M("Funny Games", 10234, "/vUJxLlRGM6KfXQDeAHqyMyhrI59.jpg"),
          M("The Ice Storm", 68924, "/3a6uLta7K8Dzojps4RoJAPHD0km.jpg")
        ]
      },
      1996: {
        winner: M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"),
        nominees: [
          M("Breaking the Waves", 145, "/dQWMcdHXUOSHtr7ypOCa5T79JMS.jpg"),
          M("Crash", 884, "/gpai5oUFyFGLHOCsYTvVMqlbY7A.jpg"),
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
          M("Stealing Beauty", 14553, "/5ugxnyVmBK952bwOcE4M0szNimx.jpg")
        ]
      },
      1995: {
        winner: M("Lady Poison: Beasts of the Underground", 182065, "/8QlBdEp1ouWWyXwU8tswLjRVumd.jpg"),
        nominees: [
          M("La Haine", 406, "/8rgPyWjYZhsphSSxbXguMnhN7H0.jpg"),
          M("Dead Man", 922, "/jX3wGBVoYoAY3IixBpwYk1fjT4z.jpg"),
          M("Ed Wood", 522, "/n8SrO3WbyuY2b6KazogqbQF348C.jpg"),
          M("Kids", 9344, "/8qV8hUVCUnFIQKewzlhaFWhdszK.jpg")
        ]
      },
      1994: {
        winner: M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"),
        nominees: [
          M("Three Colors: Red", 110, "/JHmsBiX1tjCKqAul1lzC20WcAW.jpg"),
          M("The Hudsucker Proxy", 11934, "/bp5Kg9iT9oSXsECgDkNJVqvIrxX.jpg"),
          M("Through the Olive Trees", 47104, "/xcwCF0YTyAOMrVLgXHjvPP0gGbh.jpg"),
          M("Queen Margot", 10452, "/8uGkhBLiJMIkwohGPo3iB9AuwDg.jpg")
        ]
      },
      1993: {
        winner: M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg"),
        nominees: [
          M("Farewell My Concubine", 10997, "/iJ99VEPZ8aZTGm18DN6RfZCxYwk.jpg"),
          M("Falling Down", 37094, "/7ujqyF96Zg3rfrsh9M0cEF0Yzqj.jpg"),
          M("Much Ado About Nothing", 11971, "/tvltGP6vYOkHdURag0jPSjhPUAV.jpg"),
          M("Naked", 21450, "/xMYP4uaNeyPmX4FQ2xxWk2eIN6K.jpg")
        ]
      },
      1992: {
        winner: M("The Best Intentions", 41764, "/kkwKpqYac8zUNNMkRTfAQfbMQWl.jpg"),
        nominees: [
          M("Basic Instinct", 402, "/76Ts0yoHk8kVQj9MMnoMixhRWoh.jpg"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
          M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg"),
          M("Twin Peaks: Fire Walk with Me", 1923, "/mxsGXqetGnirf99qapYd5MMY1VL.jpg")
        ]
      },
      1991: {
        winner: M("Barton Fink", 290, "/oDkp5iClJ9WKJGtKHz8BydodHC3.jpg"),
        nominees: [
          M("The Double Life of Véronique", 1600, "/oqRyO9xrNBRaxqF9pCHHgLuaATx.jpg"),
          M("Europa", 9065, "/pyFtuYQReoSmhNs55kRJedA5wEJ.jpg"),
          M("Homicide", 22828, "/1CywcTyQ2Dbh7LA0Lcf13iaC1ig.jpg"),
          M("Jungle Fever", 1713, "/pw7cOdwCylBuiv6rvosBSkcgKEe.jpg")
        ]
      },
      1990: {
        winner: M("Wild at Heart", 483, "/uLUFI5sJIfWrBUWB2Y1dEuyvvVy.jpg"),
        nominees: [
          M("Cyrano de Bergerac", 11673, "/80XJ5UkGuYTKDuALeG03BLk1OT1.jpg"),
          M("Hidden Agenda", 47869, "/ceaYwvuTMfgRu7XCrLHmeK1LDzN.jpg"),
          M("Ju Dou", 41821, "/ejvX1lukPZZ10jatUWmKaXbhjGI.jpg"),
          M("White Hunter, Black Heart", 28761, "/tbLYzI4rB7qQy0gete68v2gHVZV.jpg")
        ]
      },
      1989: {
        winner: M("sex, lies, and videotape", 1412, "/pj1uKm07svgXZDHbYE8AzRfNHcu.jpg"),
        nominees: [
          M("Do the Right Thing", 925, "/63rmSDPahrH7C1gEFYzRuIBAN9W.jpg"),
          M("Cinema Paradiso", 11216, "/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg"),
          M("Mystery Train", 11305, "/f11xq7dBGhz9UDc3dabldAGeXVH.jpg"),
          M("Sweetie", 65015, "/25lpQtxNWXzOimnXmbwF0Y0GYej.jpg"),
          M("Time of the Gypsies", 20123, "/av6K9MX0jNNFAH6NZVrVV2DMAOA.jpg")
        ]
      },
      1988: {
        winner: M("Pelle the Conqueror", 11174, "/oSsu4khg459yTR1sw4qjEC4LO5J.jpg"),
        nominees: [
          M("Bird", 24679, "/rTCp6M98RQAxRl0x0guU9GlH7HS.jpg"),
          M("A World Apart", 41949, "/rLo4PwbuT3C7k2VxAGbMQU1aINp.jpg"),
          M("Drowning by Numbers", 27362, "/bOqbSwGyfLo0PeaTKIwHi7EqCSe.jpg"),
          M("A Short Film About Killing", 10754, "/k7sk4yNdoXY7iwp1M9QTZuBDiJS.jpg")
        ]
      },
      1987: {
        winner: M("Under the Sun of Satan", 31300, "/aBnO3FLBY00Do29B4i7F54I492D.jpg"),
        nominees: [
          M("Wings of Desire", 144, "/iZQs2vUeCzvS1KfZJ6uYNCGJBBV.jpg"),
          M("The Glass Menagerie", 52780, "/zF02disLmOSyb3BSS4c50MC7xNo.jpg"),
          M("Barfly", 10937, "/uAsAVy7yoMZ2r5ZBQQXw4PKX3JY.jpg"),
          M("Shinran: Path to Purity", 198454, "/bWxK8mEtNfPfP1BcZTnEzpOEO9F.jpg")
        ]
      },
      1986: {
        winner: M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg"),
        nominees: [
          M("The Sacrifice", 355652, "/dMfMmT4uZoZSYyi0vzgGnuIXZp8.jpg"),
          M("Down by Law", 1554, "/4IyxoUQ7BB5kcSd7gASe2dTyWu7.jpg"),
          M("After Hours", 10843, "/eamOBurHBu0MIxohTIVcfxmZ6Z7.jpg"),
          M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg"),
          M("Runaway Train", 11893, "/A9pf9KjhqCGthu6PKAKE5E1qRNn.jpg")
        ]
      },
      1985: {
        winner: M("When Father Was Away on Business", 21042, "/jhTu6UwP32jPwiBccGAkZq0yqvV.jpg"),
        nominees: [
          M("Birdy", 11296, "/weIn0Huxx4SQU8PB5ZggzA4PLIE.jpg"),
          M("Pale Rider", 8879, "/kpAN5WnDEVWYzMDPkXHTbrDQuak.jpg"),
          M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg"),
          M("Mask", 11177, "/dBYzEETDHNyt12VCD5owVW6bpEC.jpg"),
          M("The Purple Rose of Cairo", 10849, "/ccsint43E44B7NGceEhVimD93Yt.jpg")
        ]
      },
      1984: {
        winner: M("Paris, Texas", 655, "/sP27Qm4THyRZyHjHYMfIDtJP6YE.jpg"),
        nominees: [
          M("Under the Volcano", 41089, "/414VrLFf8gffMUNTGm0zlg2UuHh.jpg"),
          M("Voyage to Cythera", 47792, "/nAcvV1WnZ7xk5gvvSOt2eyhGdjz.jpg"),
          M("Where the Green Ants Dream", 27221, "/60oMOwmWwpN8dnOkRIjoUA7i5K.jpg"),
          M("The Bounty", 2669, "/hXFXIc6F4NXI5emWCKcUwqEPjIZ.jpg")
        ]
      },
      1983: {
        winner: M("The Ballad of Narayama", 42113, "/h3iNimtw6HsFTtAvEDF3XYZ4Y5T.jpg"),
        nominees: [
          M("The King of Comedy", 262, "/3sGuQv0UxfjDODCC9IQG5S1jXK8.jpg"),
          M("L'Argent", 42112, "/tqt9D4TH702ZXEUKWa3e6UdFAvY.jpg"),
          M("Merry Christmas, Mr. Lawrence", 11948, "/sKeZzN7sXPLRe5rRlOuoXsh1qPA.jpg"),
          M("Monty Python's The Meaning of Life", 4543, "/9yavZ9WgEZIpWi2EbVW8At9RPdo.jpg"),
          M("Nostalgia", 1394, "/fCYSidPXp3LpDa9wlLNv0gZvjyF.jpg"),
          M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg")
        ]
      },
      1982: {
        winner: M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
        nominees: [
          M("The Road", 52556, "/oblv2iaKFvrleCqBMLNHzcOCufR.jpg"),
          M("Fitzcarraldo", 9343, "/oBCnYEKcg1rMhr5JjDnrRpilvDd.jpg"),
          M("Hammett", 28307, "/ssaXsTAhAYklEmhhjsMZfeyPCuD.jpg"),
          M("Shoot the Moon", 52772, "/71GK3DRyFWN0Ke0s8WwgEEEOUJQ.jpg")
        ]
      },
      1981: {
        winner: M("Man of Iron", 225, "/22wNUqKyz2m6wzAt31f26H8Y433.jpg"),
        nominees: [
          M("Chariots of Fire", 9443, "/qnRaum8k0HqGRml2i7OawFqUtEb.jpg"),
          M("Excalibur", 11527, "/cTWF6zkr5mUOnheowKODIijWYcN.jpg"),
          M("Heaven's Gate", 10935, "/kW4Vk31nhtKPKGuYMaVATq3wcHC.jpg"),
          M("Possession", 21484, "/lUFZsUuJ0YyhBXH8D2BFUd6wODm.jpg"),
          M("Thief", 11524, "/bpjRGwfYJ71bU0hNhLIz7g3t6Oy.jpg")
        ]
      },
      1980: {
        winner: M("All That Jazz", 16858, "/culCEdj4srLljefgn4XKd6k3C5t.jpg"),
        nominees: [
          M("Kagemusha", 11953, "/fJgqj9s8HNZz9zwX6femVJn8HEB.jpg"),
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg"),
          M("The Big Red One", 16121, "/h0VcqQ3z1RroKk7WtiW0E6DDho2.jpg"),
          M("Breaker Morant", 13783, "/Nr46BDNjBtz3s0wRvm84eK3PXl.jpg"),
          M("The Long Riders", 14729, "/1Dk9dieSkZeiEVarZFsPJdF9Qel.jpg")
        ]
      },
      1979: {
        winner: M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"),
        nominees: [
          M("The Tin Drum", 659, "/tm408GMyQqfqFJ7MKCkwc5uQ3wi.jpg"),
          M("The China Syndrome", 988, "/uHwwQIlt4XwpTFhX9ZT1A8xSW7F.jpg"),
          M("Days of Heaven", 16642, "/rwxTYjOZmX2rGhz7avLe1qsjNqe.jpg"),
          M("Hair", 10654, "/qrZIlVCL9UyEBsgOGbisNzuWjX.jpg"),
          M("Norma Rae", 40842, "/6au7WBVYoKhV1jORyFSIRszb46S.jpg"),
          M("Wise Blood", 42179, "/gSZQC6u86iaugBSs1KBrXST7KSL.jpg"),
          M("Woyzeck", 10319, "/lxJThwhfqvyIRD6VszknCNCSokK.jpg")
        ]
      },
      1978: {
        winner: M("The Tree of Wooden Clogs", 31542, "/ld4l2XWuECX6c6lWd2BWv1olg2N.jpg"),
        nominees: [
          M("Coming Home", 31657, "/jBsYWNBYNEi5EhT1hC8iexcTsWT.jpg"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg"),
          M("Pretty Baby", 26973, "/4B2BAYGBnk4sMeGyL037vKDpRKV.jpg"),
          M("The Shout", 48131, "/89SfSiIgUjyxPDaRe5SedgVRggV.jpg")
        ]
      },
      1977: {
        winner: M("Padre Padrone", 42225, "/6kGarhZIsbpFNcEHftRzNeuz6Sb.jpg"),
        nominees: [
          M("The American Friend", 11222, "/jHVe5EHDFj9ac2F2aU86sWTGKnn.jpg"),
          M("The Duellists", 19067, "/nqjMYlUXnmmO8Jqucow4nj9alE5.jpg"),
          M("3 Women", 41662, "/uL5Yg8MEgHGXymTaJBYXn9g0xsH.jpg"),
          M("Bound for Glory", 42232, "/wMSR2CSPruCPkZDEQ5xjv5xqc05.jpg"),
          M("Car Wash", 15462, "/bty0IdXh4l2BmoQNVeAH5PYKrMK.jpg")
        ]
      },
      1976: {
        winner: M("Taxi Driver", 103, "/ekstpH614fwDX8DUln1a2Opz0N8.jpg"),
        nominees: [
          M("The Tenants", 287854, "/ibs40AluKVoCqnVYvommPNQn3E6.jpg"),
          M("Bugsy Malone", 8446, "/j9BPl3jkNCFgsYe5poKrirUqrf8.jpg"),
          M("Kings of the Road", 10834, "/wKSQ0pTOXYzDWaEXvJEXlhgj2PY.jpg"),
          M("Next Stop, Greenwich Village", 31913, "/qYMvsrCG6qjIoJYPIdgeceDlhDR.jpg")
        ]
      },
      1975: {
        winner: M("Chronicle of the Years of Fire", 52555, "/wtx3qqdwwp3sNANYfAFXl5tKZE6.jpg"),
        nominees: [
          M("Alice Doesn't Live Here Anymore", 16153, "/A99yzz1W3NCG6zR2HXSwn2kWlse.jpg"),
          M("The Enigma of Kaspar Hauser", 11710, "/z1rBBE8NWociDQClr8y6Onv1X62.jpg"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg"),
          M("The Passenger", 9652, "/A8jYH43plz70dNmHy82zAHGTqxN.jpg")
        ]
      },
      1974: {
        winner: M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg"),
        nominees: [
          M("The Sugarland Express", 5121, "/csahjHhtJ9NzFKcxVcw7S4Pyfj.jpg"),
          M("Arabian Nights", 47406, "/zDrAREfrNvq5O10lHDDh529i143.jpg"),
          M("The Last Detail", 14886, "/zQoNkO99qfaBjh5aoA0pKau1prp.jpg"),
          M("Thieves Like Us", 31656, "/tENE8l8PHPX8S2bEMIb4WhpDKAt.jpg")
        ]
      },
      1973: {
        winner: M("Scarecrow", 31587, "/jK0e8jLl0pp59yX6AYMyyJPnMVJ.jpg"),
        nominees: [
          M("The Hireling", 80382, "/xlhaEmOMWFFmCx4O8oPUMlPqEpo.jpg"),
          M("Fantastic Planet", 16306, "/prq0j1S0K07UjwLZLF6oMGflRUI.jpg"),
          M("Godspell", 43158, "/qhjcjiLcPhB0kniRlQfIoGiILbn.jpg"),
          M("The Mother and the Whore", 48693, "/jHRORDfipbTd3d7NPsKt4jotOwW.jpg")
        ]
      },
      1972: {
        winner: M("The Working Class Goes to Heaven", 56231, "/gulAszCUPjuBtDd6NudgLTBu3i5.jpg"),
        nominees: [
          M("The Mattei Affair", 62382, "/p4EHDfdbgjNXmQb7WB9fYmom0s1.jpg"),
          M("Solaris", 593, "/pgqj7QoBPWFLLKtLEpPmFYFRMgB.jpg"),
          M("Jeremiah Johnson", 11943, "/fANj1S3UmBB51wnKxYRKtw8LMBn.jpg"),
          M("Slaughterhouse-Five", 24559, "/gM2q9pGW9x2zdEMPRsXLBgTDDFH.jpg")
        ]
      },
      1971: {
        winner: M("The Go-Between", 36194, "/61dXOIpDaiWCp7aIjBYkd6ujdXZ.jpg"),
        nominees: [
          M("Death in Venice", 6619, "/s81SuFBSqY8T5Lrn5R8ucX8LKxi.jpg"),
          M("Johnny Got His Gun", 16328, "/ryIY3FPmTtXu9g6W4I69qCdkxKj.jpg"),
          M("Taking Off", 59881, "/2UXNQy39AqER8Y5LjuZcA1pliwq.jpg"),
          M("Walkabout", 36040, "/24vooYt5StgtgcQObVr1GHuM5gy.jpg")
        ]
      },
      1970: {
        winner: M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg"),
        nominees: [
          M("The Strawberry Statement", 51956, "/kKhzIkHWrg51jkTRxq6eAhBSIIl.jpg"),
          M("Tell Me That You Love Me, Junie Moon", 78355, "/m8gntXfzQGZtjnAc7cixC2khiw7.jpg"),
          M("Woodstock", 9459, "/cnfhelfQucSb4Y54yFgtnSNhsAT.jpg"),
          M("Investigation of a Citizen Above Suspicion", 26451, "/vPTZwlq1IC4o1DCsEZEl2uGljzm.jpg")
        ]
      },
      1969: {
        winner: M("if....", 14794, "/oqlpAGq4aXhc6ODtxBcGM1SEoIp.jpg"),
        nominees: [
          M("Z", 2721, "/dFAJyFNgvOv24f2RQyI9KDxjGr3.jpg"),
          M("Adalen 31", 87208, "/36nb5JRvhdaEcpE71LKexPtYIa1.jpg"),
          M("My Night at Maud's", 48831, "/9usKgth3ROn4LwPQ7tTvxKnpBGL.jpg"),
          M("The Prime of Miss Jean Brodie", 5179, "/lEZdKL17yneFK4dbbWPKcbkRbqM.jpg"),
          M("Easy Rider", 624, "/mmGEB6ly9OG8SYVfvAoa6QqHNvN.jpg"),
          M("Isadora", 42626, "/5NAjQxJgf4BJWz8m2Qj0fryG3bV.jpg"),
          M("Antonio das Mortes", 74349, "/fOoqqn5A2XoPLblvAPpujRonzZm.jpg")
        ]
      },
      1968: {
        winner: null,
        nominees: [
          M("Peppermint Frappé", 105584, "/vBoDIvqSU88rWLcpzNmnstc8FBV.jpg"),
          M("The Violent Four", 74657, "/sLI4FL3zsFdaGWzzyyIWm4k6P8g.jpg"),
          M("Charlie Bubbles", 75947, "/rLxVaQIeCemYEoXhCzIBAdgbPVU.jpg"),
          M("Toby Dammit", 1487369, "/nF9noCCXdR4CCLKCfVaskVCMwqe.jpg"),
          M("The Firemen's Ball", 38442, "/yylEjPttmTDar0o92StlrO5ghmw.jpg")
        ]
      },
      1967: {
        winner: M("Blow-Up", 1052, "/jVDVpydUw8Z50naUDAG4NbRCrSa.jpg"),
        nominees: [
          M("Accident", 74544, "/gttNRLWBDJXwOdoNCKQFgxSGUh8.jpg"),
          M("Elvira Madigan", 42692, "/odjkOW8BYVTj1q73Ad5KIHFfAge.jpg"),
          M("Mouchette", 1561, "/cITZsSQ7VG122xQ0xAN3NHZF0OH.jpg"),
          M("Ulysses", 119183, "/x74xBYJEjJIW9xlapEjt8CdrqNt.jpg"),
          M("You're a Big Boy Now", 42728, "/4kjCCRZeZW7YiFZ6YPcI46tPTc0.jpg"),
          M("Three Days and a Child", 115639, "/1ZykyWHirSDIAK8DxSGNUovJI9q.jpg")
        ]
      },
      1966: {
        winner: M("A Man and a Woman", 42726, "/boDZQiubhyhksN8fcgM4sXZ2btW.jpg"),
        nominees: [
          M("The Birds, the Bees and the Italians", 17974, "/9q3b1tVa4LO2Xx3JUcjThdV3b12.jpg"),
          M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg"),
          M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg"),
          M("Modesty Blaise", 36645, "/rpQRLEcQeWe2T8TbSJ0zJ0Avqij.jpg"),
          M("Seconds", 20620, "/5G3q3OvulFTnFdiouaZdD8wjtIc.jpg")
        ]
      },
      1965: {
        winner: M("The Knack... and How to Get It", 42744, "/xO2dJcCISY6lujaU4Qew3RzSErJ.jpg"),
        nominees: [
          M("Pierrot le Fou", 2786, "/i124H6iQB4CawrgFW9aZaZs7OBO.jpg"),
          M("The Collector", 42740, "/iMiih5FGHwpUCAaJAIkYKl5Hffi.jpg"),
          M("The Hill", 24395, "/cmBpImAjHJnuHXMVByzqnxtDcae.jpg"),
          M("The Ipcress File", 15247, "/iCNRK7NVhBvNpiyMRmCpTBFNoLO.jpg"),
          M("Kwaidan", 30959, "/vmYhFcA2YC15hoL44hQziba75Ij.jpg")
        ]
      },
      1964: {
        winner: M("The Umbrellas of Cherbourg", 5967, "/tAgTf64XKK5ir7w5C7dnB53jWWG.jpg"),
        nominees: [
          M("Woman in the Dunes", 16672, "/f0JpsMQ9oEjKBD66Ky3qK3z7LGT.jpg"),
          M("Dead Woman from Beverly Hills", 198828, "/t1kBSDcGs45zKwnjFOUN0IZUmzd.jpg"),
          M("The Pumpkin Eater", 69557, "/5llEDfwte6SnAd2grP065N95yeo.jpg"),
          M("The Soft Skin", 1719, "/nYo083NgJCAQQByHzYrayxQ5xBV.jpg"),
          M("The World of Henry Orient", 19662, "/tMIRjDgsEj15RXEhMrgSqROUP7u.jpg")
        ]
      },
      1963: {
        winner: M("The Leopard", 1040, "/riSUxwoK3xjkOgy6YJSvPhi7cO6.jpg"),
        nominees: [
          M("This Sporting Life", 18774, "/lOxaN1ziYdOJgAQouWO1pGEBU7H.jpg"),
          M("The Birds", 571, "/eClg8QPg8mwB6INIC4pyR5pAbDr.jpg"),
          M("Harakiri", 14537, "/3nPwMd3KviJWaHzG9fZCqlwWMas.jpg"),
          M("Lord of the Flies", 9960, "/3jhp9oxZpwcWCZ1vfn3PyMWovzq.jpg"),
          M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg"),
          M("What Ever Happened to Baby Jane?", 10242, "/msGYzyWwtjAaA3DScdgmvJ5MReG.jpg")
        ]
      },
      1962: {
        winner: M("The Given Word", 59990, "/wjNydK6CnoJFEp69OzAcSsAaIME.jpg"),
        nominees: [
          M("L'Eclisse", 21135, "/oXoe0Fp92Yw3mMJ9Vq0hPlaMELg.jpg"),
          M("Cléo from 5 to 7", 499, "/oelBStY4xpguaplRv15P3Za7Xsr.jpg"),
          M("Divorce Italian Style", 20271, "/vZbdSpUFyFiDBBTY0AiSrN9f303.jpg"),
          M("The Exterminating Angel", 29264, "/qqZXHvBFxUpo8Pfbyvgh4SYMiWm.jpg"),
          M("Long Day's Journey Into Night", 43004, "/gCEfENplIS1Ph5yMdz4aJnn1yAB.jpg"),
          M("A Taste of Honey", 25062, "/5psrZNVZ9E6Eck7OtpO47A8zTbQ.jpg")
        ]
      },
      1961: {
        winner: M("Viridiana", 4497, "/mYPuSx5JwL8AdTwS1iQW4Un1cYP.jpg"),
        nominees: [M("The Long Absence", 131836, "/tPs6Lnp0vfiQDzZELxd4uI09AYa.jpg")]
      },
      1960: {
        winner: M("La Dolce Vita", 439, "/2KU52apQyvyZuPsqEGMcWb4BKu2.jpg"),
        nominees: [
          M("L'Avventura", 5165, "/7kUXAS8K7Ihw1T1mhARjnLuMVk3.jpg"),
          M("Ballad of a Soldier", 46592, "/9teeqzdIgPkWsykRapYkqhdefmm.jpg"),
          M("A Hole in the Head", 33725, "/BOgeA821uM0G2nrKj8rFSPYyGO.jpg"),
          M("The Virgin Spring", 11656, "/z70YM3Y4pNYZATMhFMKonngaeMC.jpg"),
          M("Never on Sunday", 43039, "/t9zLlS5O5GB57BKjJCtzB21VKZB.jpg"),
          M("Sons and Lovers", 53939, "/7BDlr8XivWmNcDsb5ygnhs8CWiR.jpg")
        ]
      },
      1959: {
        winner: M("Black Orpheus", 40423, "/fJWzdNRnfjcJuaZiKqaSURFV6Lg.jpg"),
        nominees: [
          M("The 400 Blows", 147, "/12PuU23kkDLvTd0nb8hMlE3oShB.jpg"),
          M("Compulsion", 35921, "/fdYoG4uxbTbQ8Wv4BLxWiP7rrkm.jpg"),
          M("The Diary of Anne Frank", 2576, "/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg"),
          M("Hiroshima Mon Amour", 5544, "/zieczjWnvalaxwX5EQASEx0on5f.jpg"),
          M("Middle of the Night", 120522, "/jSlwgfum8DFIbayHKRMq0CH6TzS.jpg"),
          M("Nazarín", 35124, "/7W2hnPt4glMnaxJU33wAjKyf7lc.jpg")
        ]
      },
      1958: {
        winner: M("The Cranes Are Flying", 38360, "/foXYOdXEJ0rvtTDo4LLnsUnvPLB.jpg"),
        nominees: [
          M("Mon Oncle", 427, "/wH6RyPiXFy8INLbViVkchLVOmBc.jpg"),
          M("The Brothers Karamazov", 43138, "/ebehR57SnzCmA9ce8hZXVQgl0lU.jpg"),
          M("Desire Under the Elms", 77960, "/lvRCRiVQtDv5OtlnhB1L8sw08jj.jpg"),
          M("The Long, Hot Summer", 40085, "/nWQddN7kfkVqSimb4SQc35gNUnP.jpg"),
          M("Orders to Kill", 27261, "/od0Kya0kkLygcvrU90hRw29IH3V.jpg")
        ]
      },
      1957: {
        winner: M("Friendly Persuasion", 43258, "/mhsdObvFHoOfgaKAVJUOeK3LiOP.jpg"),
        nominees: [
          M("The Seventh Seal", 490, "/wcZ21zrOsy0b52AfAF50XpTiv75.jpg"),
          M("Funny Face", 13320, "/tzTjalpIz6NyFrWPPlOBFoBjb7z.jpg"),
          M("Nights of Cabiria", 19426, "/xF4oCG3PLNbcrtPZbqB3BtkIbKg.jpg"),
          M("A Man Escaped", 15244, "/gkoZ8fFib24zhB2DKpjQ09SK9FU.jpg")
        ]
      },
      1956: {
        winner: M("The Silent World", 60234, "/ys1AiQJbQPNimud1kZQ91FgOJLR.jpg"),
        nominees: [
          M("The Man Who Knew Too Much", 574, "/gy8YBRjCQRIT9x9G9F5fpnFD4xw.jpg"),
          M("I'll Cry Tomorrow", 28575, "/8UfnjpxvNa5nbckfE9EWdc38VRg.jpg"),
          M("The Harder They Fall", 28528, "/93pUA2kAOeVlyvO1EeW8YmYIapt.jpg"),
          M("Pather Panchali", 5801, "/frZj5djlU9hFEjMcL21RJZVuG5O.jpg"),
          M("The Man with the Golden Arm", 541, "/3TUOhZhM5GCYIbxwFO3chpZ0DHx.jpg"),
          M("Smiles of a Summer Night", 11700, "/wKeV8lKz8k9DDBCw6MJ9MkhvhqF.jpg")
        ]
      },
      1955: {
        winner: M("Marty", 15919, "/8tnGO5VoAQII4DbE3hozWKhV4BY.jpg"),
        nominees: [
          M("East of Eden", 220, "/xv1MZVIop0SQqwLUymgE5eb2LFl.jpg"),
          M("Bad Day at Black Rock", 14554, "/8EnhHjU0DyCckmZRtn46s3WXeEf.jpg"),
          M("Carmen Jones", 51044, "/5Vo4NeE7dlXBUaikbGnUOmUNHJ3.jpg"),
          M("The Country Girl", 2438, "/7LdXybdZcTdZo7lkkrFQKf7byZf.jpg"),
          M("Rififi", 934, "/heVdAFNZUxXVmO6jiJcEHCvI5lK.jpg")
        ]
      },
      1954: {
        winner: M("Gate of Hell", 43349, "/um7KDGoLgS1aRDZENkxlTSLIQNw.jpg"),
        nominees: [
          M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg"),
          M("The Kidnappers", 47675, "/sVXE6qp0rI73yWxFqZTrxsTeoDR.jpg"),
          M("Knights of the Round Table", 19957, "/bkXgVIpzVtDIbIscq5Z4M6sJ8Ex.jpg"),
          M("The Living Desert", 11383, "/yFMhGIMqXdZZYG9pfnyC26bRD6z.jpg"),
          M("The Earrings of Madame de...", 27030, "/wkVR2twinstMxdvJzMP8ER33JrE.jpg")
        ]
      },
      1953: {
        winner: M("The Wages of Fear", 204, "/dZyZSosIlWcpQkV0f7pXcrV2TQV.jpg"),
        nominees: [
          M("Come Back, Little Sheba", 84214, "/3hg3c6TVFVGuoqmHi0Yw25qvpRu.jpg"),
          M("Call Me Madam", 46011, "/zNemnYu57J8oesfYmjeSD6CVdQQ.jpg"),
          M("I Confess", 30159, "/5IYyJetEctAypFYIffqx55PXTPT.jpg"),
          M("Peter Pan", 10693, "/fJJOs1iyrhKfZceANxoPxPwNGF1.jpg"),
          M("Indiscretion of an American Wife", 74585, "/wvv892G09s9o0N1Mg5QkKZKBRNR.jpg")
        ]
      },
      1952: {
        winner: M("Two Cents Worth of Hope", 117478, "/qTDv04Y6XbCn0uB3dxynItTaXAl.jpg"),
        nominees: [
          M("Othello", 47697, "/61A7EJqfMsrQO0YWsUWq8gbgbu0.jpg"),
          M("Cry, the Beloved Country", 173893, "/8inNsImz4yRfjGUkBzO6urIBM5A.jpg"),
          M("Detective Story", 20853, "/hMbAiGIrfhhp0XNB4mdgfgtSDdK.jpg"),
          M("Encore", 197647, "/ilDf6iBTsRpiBjFY8d7viCwcOx7.jpg"),
          M("Umberto D.", 833, "/5I7SYsNQmZRZpQ2MAarIQYU9vaX.jpg"),
          M("Viva Zapata!", 1810, "/vfarxn9ddiaZpRDml8FGhB46Qrc.jpg")
        ]
      },
      1951: {
        winner: M("Miracle in Milan", 43379, "/zMEYCBO2OBHR09aW9IwjOR3R3A5.jpg"),
        nominees: [
          M("Miss Julie", 18650, "/t0FCrjopWvU6rm54WpioTLCUVZc.jpg"),
          M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg"),
          M("The Browning Version", 39946, "/fRlXkYgQc6QfwYMAlv2neKhRswl.jpg"),
          M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg"),
          M("The Tales of Hoffmann", 44334, "/3rqMnYSLjFa9OYwoLhXLVacwhQ7.jpg")
        ]
      },
      1950: {
        winner: null,
        nominees: [M("Intruder in the Dust", 80572, "/upQaoMXJhglvPhsYXEDatTLiBXy.jpg")]
      }
    }
  },

  // ============================
  //  VENICE
  // ============================
  Venice: {

    "Best Director": {
      1979: {
        winner: M("Legend of the Mountain", 191531, "/94ZZwpRyTlstNNSw67jFxCJQhYr.jpg"),
        nominees: [M("Luna", 30636, "/4mO1Asyzl3gmuvFWYtfzI73LhXQ.jpg")]
      },
      1978: {
        winner: null,
        nominees: [M("A Wedding", 45695, "/u7cs5RMLbnA6a0u87ychiyHdxbV.jpg"), M("Girlfriends", 111469, "/qoExB0pawOo5kPK2UGiwnthcGEw.jpg")]
      },
      1970: {
        winner: null,
        nominees: [M("The Strangler", 185843, "/hfZvvus6fB3ZujnmYdZlOxy1TzM.jpg"), M("Wanda", 80560, "/izuJ7cUhcihFnTpfsdSnkMCHsRQ.jpg")]
      }
    },

    "Golden Lion": {
      2024: {
        winner: M("The Room Next Door", 1088514, "/qMibLyArrlBJ87AoqQBeVaFeRXp.jpg"),
        nominees: [
          M("April, Come She Will", 1120846, "/nisteDwnrMAJAF9PYokt245PVkX.jpg"),
          M("Babygirl", 1097549, "/ilwO6elz3mLV9CToT7C8pjVeKX0.jpg"),
          M("NXT Battleground 2024", 1259939, "/wIY5hAgeS78wUqqfQGUVL70WShS.jpg"),
          M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg"),
          M("Diva Futura", 1141163, "/9KSpbtZc9sPGaQ0x3pb9fvdDypz.jpg"),
          M("Harvest", 936946, "/semdbWe02N2vfUYsJ2gAPmlQTpS.jpg"),
          M("I'm Still Here", 1000837, "/gZnsMbhCvhzAQlKaVpeFRHYjGyb.jpg"),
          M("Joker: Folie à Deux", 889737, "/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg"),
          M("Kill the Jockey", 1104937, "/2CGm69ebTBnbqFZIT8cWSuRIb8S.jpg"),
          M("Love", 1316954, "/6tlee9BAuFgm8O1MdzEC6FEorvO.jpg"),
          M("Being Maria", 971968, "/AtBV9COCzgKvmmyDFXTEAh79wYD.jpg"),
          M("The Order", 1082195, "/1bJ2652AUnuK1WhlR0GLbJKVqMF.jpg"),
          M("Queer", 1059128, "/xe4b2TMciLKA1C0JlhWxb4ENLln.jpg"),
          M("The Quiet Son", 1118848, "/CLpEUf9FutbFkLX3PGaKKEqXjf.jpg"),
          M("Sicilian Letters", 1148663, "/1NTEqGvc0EaNraKYSDtevQprP9y.jpg"),
          M("Stranger Eyes", 948184, "/p9y0JRUl4W05enkZwq9dRBKWOK3.jpg"),
          M("Three Friends", 1137245, "/s2mk1ElcP9xBhd4QHtUvXYMH8qs.jpg"),
          M("Vermiglio", 1151244, "/aeCwM7c1Y1IAu3Oqqj5A2tSziWR.jpg"),
          M("Youth (Homecoming)", 1319196, "/fHuD6fiNRhycDspAuguha28L9EV.jpg")
        ]
      },
      2023: { winner: M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg"), nominees: [] },
      2022: { winner: M("All the Beauty and the Bloodshed", 1004663, "/cvO51xxtIUHc5w5ZgFsigiFaUaO.jpg"), nominees: [] },
      2021: { winner: M("Happening", 793998, "/f2lTAmLYpWpd8JxtJrMXFFGV9gZ.jpg"), nominees: [] },
      2020: { winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"), nominees: [] },
      2019: { winner: M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"), nominees: [] },
      2018: { winner: M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg"), nominees: [] },
      2017: { winner: M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg"), nominees: [] },
      2016: { winner: M("The Woman Who Left", 408542, "/vKBkoUW62DLZjo7ctJRflRTXe67.jpg"), nominees: [] },
      2015: { winner: M("From Afar", 352162, "/iAJDa3lBKCB5YBE9QiXEFSnXNZl.jpg"), nominees: [] },
      2014: { winner: M("A Pigeon Sat on a Branch Reflecting on Existence", 110390, "/h2uRIr0fNpZbTGH5youi7MDRL2T.jpg"), nominees: [] },
      2013: { winner: M("Sacro GRA", 216790, "/7vsmiudJxiYYQWlnv6OmMT3tH9E.jpg"), nominees: [] },
      2012: { winner: M("Pieta", 123377, "/cI9SXHxBsEF0cgUTZKDDaPC0ozT.jpg"), nominees: [] },
      2011: { winner: M("Faust", 77560, "/8jH8wVLNZ24QVxm5IEByWpsmHXJ.jpg"), nominees: [] },
      2010: { winner: M("Somewhere", 39210, "/zOf1sdfF4eH3CVRCpmRO5ugVGdo.jpg"), nominees: [] },
      2009: {
        winner: M("Shamlan in Lebanon", 994803, "/79XTqOcQSLMnA4vEIp531GnRpT5.jpg"),
        nominees: [
          M("Soul Kitchen", 31175, "/9Y2OQ7MFouzmVCMqqvZPLrzHF0F.jpg"),
          M("The Road", 20766, "/qLaXnLzqleBWQtjvZ6JGVSaKoC3.jpg"),
          M("Mr. Nobody", 31011, "/qNkIONc4Rgmzo23ph7qWp9QfVnW.jpg"),
          M("Bad Lieutenant: Port of Call - New Orleans", 11699, "/73jnKMm8bCcV1w2ltkaeJfLZJzX.jpg"),
          M("Capitalism: A Love Story", 22074, "/zJBkIPakBXdu3cEgGqKCPHUNXVE.jpg"),
          M("A Single Man", 34653, "/AvqTb66bS1i1NjlPC76zvxo0taT.jpg"),
          M("Life During Wartime", 39800, "/umGRjRYVwchw6wrYv0sJfet8HiV.jpg")
        ]
      },
      2008: {
        winner: M("The Wrestler", 12163, "/6OTR8dSoNGjWohJNo3UhIGd3Tj.jpg"),
        nominees: [
          M("Rachel Getting Married", 14976, "/bumaq3lqe4YSsq6LlYoge7e9ABk.jpg"),
          M("The Burning Plain", 12165, "/lZlChM3LmOLUCQCfnbaf2dQKe9J.jpg"),
          M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg"),
          M("Ponyo", 12429, "/yp8vEZflGynlEylxEesbYasc06i.jpg"),
          M("Achilles and the Tortoise", 12166, "/5PEfwcJf2JlbbXqfqOWSGHwdsVL.jpg"),
          M("Paper Soldier", 12428, "/v7IcfRrCMyWta2DjbS155FDA5Yh.jpg")
        ]
      },
      2007: {
        winner: M("Lust, Caution", 4588, "/6c1tqfJEBuIyhQC19SLlLQAUAvJ.jpg"),
        nominees: [
          M("The Assassination of Jesse James by the Coward Robert Ford", 4512, "/xMKn6EQS7eR5ubhPJbw5pQSBZMw.jpg"),
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg"),
          M("The Darjeeling Limited", 4538, "/oSW5OVXTulaIXcoNwJAp5YEKpbP.jpg"),
          M("I'm Not There", 3902, "/bucgvB7gQqcl1m71efHkenfIMTj.jpg"),
          M("Michael Clayton", 4566, "/hhkW4yVIGo8Bee3UITKvqOvhNMG.jpg"),
          M("Nightwatching", 4556, "/vcwa1RqvoYLQIKOA4EjjPNhrkJx.jpg"),
          M("Redacted", 11600, "/ofXlW8FtBGVGSgRiaOIfnzR5koU.jpg"),
          M("Sleuth", 4520, "/y70r13kOHp7pcYToG25uwMYm562.jpg")
        ]
      },
      2006: {
        winner: M("Still Life", 2346, "/pJYBqUk9zZ3lotYo4711HqWh8QE.jpg"),
        nominees: [
          M("Black Book", 9075, "/s8UyT6tUKJl07gYhPheLAzogG8V.jpg"),
          M("Bobby", 10741, "/ea6aSTUFQopOW7kWFZB9AvMYnbs.jpg"),
          M("Children of Men", 9693, "/lQcXgb0fFzffnLV5WY0Q0X2WW7E.jpg"),
          M("The Fountain", 1381, "/4XTf8GuCVLWolubANaKkpk62YPq.jpg"),
          M("Hollywoodland", 1249, "/8FgNVvJEEwRgFURiAcW7VuXwvf1.jpg"),
          M("Paprika", 4977, "/bLUUr474Go1DfeN1HLjE3rnZXBq.jpg"),
          M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg"),
          M("The Black Dahlia", 9676, "/su7yuXqGUHICfoijtcSaxWLE34Y.jpg")
        ]
      },
      2005: {
        winner: M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg"),
        nominees: [
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg"),
          M("The Brothers Grimm", 4442, "/v6J7QGCSrtvwvqAt6783BbO3h61.jpg"),
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg"),
          M("Proof", 9777, "/h5z4JWhaPYMMXhYzwuK7SUgjmMm.jpg"),
          M("Romance & Cigarettes", 13994, "/phSntD46jD5IfYAa2lSoU6xJDJ6.jpg"),
          M("Lady Vengeance", 4550, "/3Oy3iLMqD79us2iAUD6fKqWebYU.jpg")
        ]
      },
      2004: {
        winner: M("Vera Drake", 11109, "/556fElboCLlEmP8UULaYosU45Bc.jpg"),
        nominees: [
          M("Howl's Moving Castle", 4935, "/13kOl2v0nD2OLbVSHnHk8GUFEhO.jpg"),
          M("Five Times Two", 4974, "/sZRa3rg7kKt8qkJ6C480VPmUR6A.jpg"),
          M("Birth", 10740, "/5hORaMii19vXDilWpy4Iojr1OB8.jpg"),
          M("Land of Plenty", 1595, "/oK8z5rPlEjhGBiHk2OqE3bIhyol.jpg"),
          M("Palindromes", 13073, "/yqcNYtm3F7GhCgAnTcQslKzMFOf.jpg"),
          M("The Sea Inside", 1913, "/mQW1JJKCUg02cmWBzr9JFu9vM1V.jpg"),
          M("Vanity Fair", 11632, "/6GCjrrd1XIl8VSwjKo8c94LTwtd.jpg")
        ]
      },
      2003: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
        nominees: [
          M("21 Grams", 470, "/wZ0l6or5juuVWqDkLEgaghs4f9l.jpg"),
          M("Code 46", 2577, "/ijayvLrCAwOVizi9OY8LZWq5SRW.jpg"),
          M("The Dreamers", 1278, "/gBb7GGaFYPu7nEUYvC8G4LaJJN1.jpg"),
          M("Imagining Argentina", 34036, "/dq0PSUvzC0ibUVM5ABoZ5ZrJj0v.jpg"),
          M("Zatoichi", 246, "/iCIycswWbX1EDS6PYYBcR9ohrC.jpg")
        ]
      },
      2002: {
        winner: M("The Magdalene Sisters", 8094, "/akOnyPsfzcDvCwP3lzY35i2NIha.jpg"),
        nominees: [
          M("Far from Heaven", 10712, "/9gQuvFDRPLx39smUvyafm36tp0d.jpg"),
          M("Dirty Pretty Things", 3472, "/nWpXOqB1STDq8ji3rQawcg1fGS9.jpg"),
          M("Guys and Dolls", 1100071, "/ve1mt3FZbLRYLon75Z9IcKhg2tc.jpg"),
          M("Frida", 1360, "/a4hgR6aKoohB6MHni171jbi9BkU.jpg"),
          M("Man on the Train", 22016, "/3npd5xuegtcYc6HPt5NgdB27sRA.jpg"),
          M("Road to Perdition", 4147, "/loSpBeirRfTPJ3cMIqpQArstGhh.jpg")
        ]
      },
      2001: {
        winner: M("Monsoon Wedding", 480, "/vCwkv7tYFem0tQ9Duoq2MX7T7Zd.jpg"),
        nominees: [
          M("Y Tu Mamá También", 1391, "/aj3rqjab8jfc2fWmcS3H3c5qbur.jpg"),
          M("Bully", 9517, "/vMJ2WHBbK4Jr3eDuF1e7O6lbC8m.jpg"),
          M("The Others", 1933, "/p8g1vlTvpM6nr2hMMiZ1fUlKF0D.jpg"),
          M("Waking Life", 9081, "/2MRM4PL6H7yraAkwyUEe2EqoQH3.jpg")
        ]
      },
      2000: {
        winner: M("The Circle", 13898, "/pTiRBOZ2iI4i26A0qNaEkqmZBpO.jpg"),
        nominees: [M("Before Night Falls", 5001, "/kb2dqj73cfmt6qHAh1ySIlVm6v0.jpg"), M("The Man Who Cried", 29572, "/vCwee9sPHD2lxgo1ISlHve384oc.jpg")]
      },
      1999: {
        winner: M("Not One Less", 36210, "/eERKaWCIRh3a8rPjUu1z34OYZD8.jpg"),
        nominees: [
          M("The Wind Will Carry Us", 43423, "/tzrqZungDYA3Djp61NWUm7DtxNI.jpg"),
          M("Holy Smoke", 13787, "/utBNYz1cX43SQKZFH1JmMZU34Dy.jpg"),
          M("Jesus' Son", 25636, "/A2lVDbF1oTuCMlh69vLnqugWEAM.jpg"),
          M("Topsy-Turvy", 46435, "/oFYbpqqj5C6MXshBI1umd9qrrdY.jpg")
        ]
      },
      1998: {
        winner: M("The Way We Laughed", 58098, "/axL1q2ctgUaRG2ek2lZijRqb9Vw.jpg"),
        nominees: [
          M("Black Cat, White Cat", 1075, "/xxQ9jgYf3xhbUTW98VtCjA1wMLv.jpg"),
          M("Bulworth", 9452, "/gR9jZ7W2d28aSa2Yimz797VNXRh.jpg"),
          M("Hilary and Jackie", 46992, "/aE2NJH2sllQTmbpN6laKuM7NXYy.jpg"),
          M("Run Lola Run", 104, "/v0giIi4bTILVhNhJajet3WWY3FA.jpg"),
          M("New Rose Hotel", 21430, "/pMk6iJSmbt5uovZ1LEhhBZdR5cz.jpg"),
          M("Rounders", 10220, "/mqbMwYGwIChnaCO55h7v8DG8Wwy.jpg")
        ]
      },
      1997: {
        winner: M("Fireworks", 5910, "/bWIo1nDJnSyGJvVt8bRw8PHBqo4.jpg"),
        nominees: [
          M("Chinese Box", 30265, "/uhBgCcj0rnqUevY4pRtIEbixhPf.jpg"),
          M("One Night Stand", 12616, "/h6aDoPEyK4rgp4MiuRvQjepoyZx.jpg"),
          M("The Thief and the Cobbler", 26672, "/3OKtFuTxahr7hokPB9aO38qgOfc.jpg")
        ]
      },
      1996: {
        winner: M("Michael Collins", 1770, "/brIBbU6t9glEGAKRTJ4PMj9OiDC.jpg"),
        nominees: [
          M("Basquiat", 549, "/gFfVhN8BbgHhMb3ZNQRAH5xc7kq.jpg"),
          M("The Funeral", 21612, "/sHbJbr6BvVwRJhliiX1PKPERejO.jpg"),
          M("The Ogre", 48213, "/ybLzxBiB9qiiqyANLj8RGs2Dkp3.jpg"),
          M("The Portrait of a Lady", 36758, "/yoUuMtWTQXzfARYE0nF7Nn7gRuS.jpg"),
          M("Sleepers", 819, "/yUpiEk2EojS9ZEXb3nIQonQCYYF.jpg")
        ]
      },
      1995: {
        winner: M("Cyclo", 36266, "/mdOsnSVTLwHMEH1juOLMiwXcO5o.jpg"),
        nominees: [
          M("La Cérémonie", 1802, "/vq2x8JfEoVrdQZqo0fppjw7ZI3d.jpg"),
          M("Clockers", 20649, "/c79uqLJleho2a7OQayfrW5Ypphf.jpg"),
          M("The Crossing Guard", 27526, "/kogaCIIylHmWQo2gJrrdq8Br8b8.jpg"),
          M("In the Bleak Midwinter", 40154, "/lam5mVjru6yhgG8N1MHCqAUrxzL.jpg"),
          M("Nothing Personal", 125587, "/yEv3mKU7TMQJDUnPoIDsO0QTts2.jpg")
        ]
      },
      1994: {
        winner: M("Before the Rain", 19155, "/sAVSVFonnNkup5xnlxDkuRrmI2N.jpg"),
        nominees: [
          M("Vive L'Amour", 11985, "/uiVAPBx9D2Gb9ZGejvxMhRboaYz.jpg"),
          M("Heavenly Creatures", 1024, "/uvb86wVCIqD3Rlbr0GTNgWDF7Zo.jpg"),
          M("Little Odessa", 47504, "/80zDn3oanRMWDSDX1cPKZVIi8OO.jpg"),
          M("Natural Born Killers", 241, "/fEKZwT91gxvkAoyPgpNXo8W5fu0.jpg")
        ]
      },
      1993: {
        winner: M("Short Cuts", 695, "/nAEBc3g9bHAcF9whKFMfIxHxVwn.jpg"),
        nominees: [
          M("Three Colors: Blue", 108, "/33wsWxzsNstI8N7dvuwzFmj1qBd.jpg"),
          M("Even Cowgirls Get the Blues", 34444, "/20x8nm0nPXkYv04COAHFA2AHyAl.jpg"),
          M("A Dangerous Game", 618700, "/1evWxpGUxrmesxkMnZnF0QzdBcN.jpg"),
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg")
        ]
      },
      1992: {
        winner: M("The Story of Qiu Ju", 38143, "/5yYnTVXuLBjFQ91k2FnSWcwNn3x.jpg"),
        nominees: [
          M("Glengarry Glen Ross", 9504, "/zcaEDx8KlVfh4vKfMNLhiSi5Oz4.jpg"),
          M("In the Soup", 52936, "/kj7j6q8g3kptgqnpjpZlr5det2I.jpg"),
          M("Olivier, Olivier", 124096, "/zCQu2vWMuVKzKTRhDdPCwYTJhZY.jpg"),
          M("Raising Cain", 13937, "/5vRn138vnZeUNFe32qTuPGKkVLR.jpg")
        ]
      },
      1991: {
        winner: M("Close to Eden", 36346, "/jeUzgLOzvIMK07Xg1sTpmyqNhxv.jpg"),
        nominees: [
          M("Edward II", 43654, "/sB3ktIeyCoudoRMJgzo9goA9k1v.jpg"),
          M("The Fisher King", 177, "/hwIYw22HmAUMobV4zsX69MgfVUz.jpg"),
          M("My Own Private Idaho", 468, "/p9TF90Pb5yg2MNb2UztzyXktMm4.jpg"),
          M("Prospero's Books", 5048, "/lF9uNTBDtpQOGHrKGWc6rqDDwbM.jpg"),
          M("Raise the Red Lantern", 10404, "/j6MGZpg55cTqlHHwahBtzI2qQg1.jpg")
        ]
      },
      1990: {
        winner: M("Rosencrantz & Guildenstern Are Dead", 18971, "/6RI9sYpRxIdqlmsF6kBOiF7Bxug.jpg"),
        nominees: [
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg"),
          M("An Angel at My Table", 2891, "/sDICHxQRDkS4TvIDcUgO9URJxu1.jpg"),
          M("Europa Europa", 8996, "/l72wg9ExcaGIqZoJQca0p7s5dSW.jpg"),
          M("Mr. & Mrs. Bridge", 111815, "/e7YO2jyW4jmLGZybpTWIKtN7F1.jpg")
        ]
      },
      1989: {
        winner: M("A City of Sadness", 49982, "/n1aIYLgnrlsUrh77G2OdQT9NV1.jpg"),
        nominees: [M("New York Stories", 9686, "/mViGEH5dfsAnUgJmce1RJkFycAi.jpg")]
      },
      1988: {
        winner: M("The Legend of the Holy Drinker", 54990, "/qaLuGuFcGGi9y27d0Kx3BA7MqU0.jpg"),
        nominees: [
          M("Women on the Verge of a Nervous Breakdown", 4203, "/8C5FJlUo96pj1xAs2BKnB58PYzi.jpg"),
          M("Camp de Thiaroye", 103203, "/oKfFcrlQCTKaB6KU5VuJVt0yBc5.jpg"),
          M("The Last Temptation of Christ", 11051, "/7L4qwrC1mipZXJfU5oRgQWChLv1.jpg")
        ]
      },
      1987: {
        winner: M("Au Revoir les Enfants", 1786, "/lXP90Vx7OcviBfbbokcaG6zVnPG.jpg"),
        nominees: [
          M("House of Games", 26719, "/4i27Ut4cIoLbcNpW7aeuUQErEPE.jpg"),
          M("Maurice", 26371, "/8HhCyxxzoUqEBmVGK25Jq69LhVo.jpg"),
          M("The Dead", 39507, "/hFLUqiwvvtcUqA5NZNejaaNpTv0.jpg")
        ]
      },
      1986: {
        winner: M("The Green Ray", 54898, "/1E3pliSC7lXWw6zJhMvG6ba0UNX.jpg"),
        nominees: [M("'Round Midnight", 14670, "/8aNGnEsvLBldNvaBkfYkGGgZDhe.jpg"), M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg")]
      },
      1985: {
        winner: M("Vagabond", 44018, "/2KFfwiPct1hwqi9dkKqoom0BenC.jpg"),
        nominees: [M("Prizzi's Honor", 2075, "/5azGfZXuUFYjYfz6etYOdlyLXwL.jpg")]
      },
      1984: { winner: M("A Year of the Quiet Sun", 42096, "/jMxB1CzBRzy48JjFbrdgVArTolc.jpg"), nominees: [] },
      1983: { winner: M("First Name: Carmen", 32689, "/leVBq35yfyS0O35VLiYRgQUx4IA.jpg"), nominees: [] },
      1982: {
        winner: M("The State of Things", 30363, "/gHFOZph5GuFcDKe3Xgmrcc2sYwP.jpg"),
        nominees: [
          M("Blade Runner", 78, "/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg"),
          M("Querelle", 42135, "/cNATtWnC7DJYOnbKTlHbQ58bVd9.jpg"),
          M("Tempest", 48249, "/wGhnc6SAOMH3p8wzFihLtHIKsyt.jpg")
        ]
      },
      1981: {
        winner: M("Marianne and Juliane", 42142, "/lOPTepFzMlwJzupQDPe481hI0sN.jpg"),
        nominees: [M("The True Story of Ah Q", 198484, "/3CoTYHKPGUNUr0KSHcvHMkody36.jpg"), M("Prince of the City", 32047, "/tdERW77zecB5pkKWWeqbSkns0t4.jpg")]
      },
      1980: {
        winner: M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg"),
        nominees: [
          M("Gloria", 10889, "/mrYZInXp0JEoZYXs0Z108l2jN0C.jpg"),
          M("The Age of the Earth", 76816, "/2gwt93w3M5Cmh1l8HOPfoHuxBjx.jpg"),
          M("Alexander the Great", 111988, "/cX8GPfrHhUrwA7DLVqtF4bpiufY.jpg"),
          M("The Human Factor", 31950, "/7IWD14KhQTjMgGiHH7GZheS6SNU.jpg")
        ]
      },
      1969: {
        winner: null,
        nominees: [M("Satyricon", 11163, "/83urUMl04GtwuuGIFpezqzi7n6m.jpg")]
      },
      1968: {
        winner: M("Artists Under the Big Top: Perplexed", 154582, "/yAJQKddefFmKyEPGwSixY3yyljR.jpg"),
        nominees: [M("Theorem", 5335, "/k7rEBaYUTgdxVqYl9aZm5ZcoB41.jpg"), M("Faces", 753, "/qTkhxFQ0o6DEtTtPXkv4IA5M90J.jpg")]
      },
      1967: {
        winner: M("Belle de Jour", 649, "/iUAFECovwPA0cVV9bo4uNGLJSGL.jpg"),
        nominees: [M("La Chinoise", 1629, "/hfGzYErvwi8hB38kCsSNy6OjdPv.jpg"), M("Oedipus Rex", 42691, "/7R3yPlLdiNhpGzasB8SDCT6Kwy.jpg")]
      },
      1966: {
        winner: M("The Battle of Algiers", 17295, "/2p3AFtOHFvP6OeVMqlnL1zLKOqL.jpg"),
        nominees: [M("Fahrenheit 451", 1714, "/k2CTpexoS9MO9lKVFfnzwVdJuM.jpg"), M("Au Hasard Balthazar", 20108, "/lkLO1HDzzaXpTXtAgnGpVqIQkvF.jpg")]
      },
      1965: {
        winner: M("Sandra", 92432, "/4ni3YypuKYh3nS2yftX40JUYGQf.jpg"),
        nominees: [M("Simon of the Desert", 36265, "/ysTa1FtL9DvQ90F6VGVoiOdp5NM.jpg"), M("Pierrot le Fou", 2786, "/i124H6iQB4CawrgFW9aZaZs7OBO.jpg")]
      },
      1964: {
        winner: M("Red Desert", 26638, "/rGcTVdyhaGzMxPPRVApXre6F7SD.jpg"),
        nominees: [M("The Gospel According to St. Matthew", 24192, "/oifi2CQkKbb6Y2x6J5K6CjaKab9.jpg"), M("Hamlet", 1485286, "/tstjIYXllvcO5aC9WPnHRMpOTI7.jpg")]
      },
      1963: {
        winner: M("Hands Over the City", 58383, "/zR9uj0dtm5osrrpM7zwO5ndAtbh.jpg"),
        nominees: [
          M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg"),
          M("Billy Liar", 26535, "/8YUzVyN3HdedaK7oGVf2nVrsf4R.jpg"),
          M("The Servant", 42987, "/pRa4og93BeOoMCt6oWuPCwu5Coo.jpg")
        ]
      },
      1962: {
        winner: M("Family Diary", 80557, "/hXSBKcxowauPtMlpvjqNM15NbCt.jpg"),
        nominees: [
          M("Ivan's Childhood", 31442, "/vmRWSLP1DE9WTta0hfzIafJ0dID.jpg"),
          M("Lolita", 802, "/8Puqbeh0D95DpXFWep1rmH78btu.jpg"),
          M("Therese", 80476, "/y2t9L6Enl7yVmHepDeRfMMoy7tU.jpg")
        ]
      },
      1961: {
        winner: M("Last Year at Marienbad", 4024, "/syIJCqiSkGRJTlyaBtyI5jqPtE7.jpg"),
        nominees: [M("Accattone", 12491, "/113ts2Bmm5CZ3YJMwfCU9XGFCAf.jpg"), M("Yojimbo", 11878, "/tN7kYPjRhDolpui9sc9Eq9n5b2O.jpg")]
      },
      1960: {
        winner: null,
        nominees: [M("Rocco and His Brothers", 8422, "/pngL8AraChIDOiWnKF2o3S9kJzJ.jpg"), M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg")]
      },
      1959: {
        winner: M("General Della Rovere", 43100, "/dTynqWaUm92ecwxCuMkTdHCoOfx.jpg"),
        nominees: [
          M("The Great War", 55823, "/aDvKsUb5y7GMNMz2HHNtuGww5t8.jpg"),
          M("The Magician", 29453, "/46DEYkr96MxzUmdwgmj2U7gWokZ.jpg"),
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg")
        ]
      },
      1958: {
        winner: M("The Rickshaw Man", 43121, "/8TGbTPMq2Dao441QUQ55lKESpZM.jpg"),
        nominees: [M("The Lovers", 2574, "/5WxZp3XpCnK1EQ6D8XASbpCkrzO.jpg"), M("The Black Orchid", 84655, "/328zzE3UFXE08u8BzxPMvCr173t.jpg")]
      },
      1957: {
        winner: M("Aparajito", 897, "/qvR2Qs42WHwCEcuwhQnterU3gVY.jpg"),
        nominees: [M("Throne of Blood", 3777, "/zaZFMNxJST0TtPd68yF7fNt1he8.jpg"), M("Le Notti Bianche", 43231, "/vD3cTATsUwQtYxFL9qDZiUgPYxQ.jpg")]
      },
      1956: {
        winner: null,
        nominees: [M("Attack", 32087, "/7r2MrvqqpvUfaIjxlQx0wx5o3Qe.jpg"), M("The Captain from Kopenick", 10626, "/volBGUE8Ch7Xq22VvzYWuYA4ZJB.jpg")]
      },
      1955: {
        winner: M("Ordet", 48035, "/q8DuzIhRsDGeCJaB9K80Fqtq6Y4.jpg"),
        nominees: [
          M("The Big Knife", 48155, "/1cnE5SXHNSKUwjSBPXR6Uf7pzCV.jpg"),
          M("Le Amiche", 46979, "/ksEwRHvYqOyV7JokAhfgtUUTxsA.jpg"),
          M("To Catch a Thief", 381, "/6M6NwjV3XvtayljoiZ8wRHOKCQG.jpg")
        ]
      },
      1954: {
        winner: M("Romeo and Juliet", 92784, "/8dazSg9J6CxC8mUMKs5AMj12eqF.jpg"),
        nominees: [
          M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg"),
          M("Rear Window", 567, "/ILVF0eJxHMddjxeQhswFtpMtqx.jpg"),
          M("La Strada", 405, "/rwjbT0zlsUDMztaCcWjlWuxaEL1.jpg"),
          M("Seven Samurai", 346, "/lOMGc8bnSwQhS4XyE1S99uH8NXf.jpg"),
          M("Sansho the Bailiff", 20532, "/cOBsWxFtEoqXIPx4JZP5E7g1WEo.jpg")
        ]
      },
      1953: {
        winner: null,
        nominees: [
          M("Pickup on South Street", 25955, "/et4fY4BxLyAPwxvUFUbzCUrGsjR.jpg"),
          M("Roman Holiday", 804, "/8lI9dmz1RH20FAqltkGelY1v4BE.jpg"),
          M("Ugetsu", 14696, "/r8RiuKTIYIJBjczBVsfeP5C00CJ.jpg"),
          M("I Vitelloni", 12548, "/boqcM6bhQICnNue4pkgmauj9JN3.jpg")
        ]
      },
      1952: {
        winner: M("Forbidden Games", 5000, "/nby91GNVXQAv1NmKvqlpEEdhcMQ.jpg"),
        nominees: [M("The Quiet Man", 3109, "/u3B1hVKHE56yBRoxF3Nk9uxHdYN.jpg"), M("Europe '51", 41464, "/hw9MEW5kslyRwpJp8AgpIlBxtmr.jpg")]
      },
      1951: {
        winner: M("Rashomon", 548, "/vL7Xw04nFMHwnvXRFCmYYAzMUvY.jpg"),
        nominees: [
          M("Death of a Salesman", 104394, "/xnyRkG1LMQX0NUpROq61GiKW7eJ.jpg"),
          M("A Streetcar Named Desire", 702, "/aicdlO5vt7z2ARm279eGzJeYCLQ.jpg"),
          M("The River", 45218, "/rC1k4xkffb5sdQlktiP2TyiBxT2.jpg"),
          M("Ace in the Hole", 25364, "/gPVPzHEsJBX02HtBtIQgYnfeqNQ.jpg")
        ]
      },
      1950: {
        winner: M("Justice Is Done", 67731, "/nC0OX6oJeZN5vOzv4VoDvU9xiBe.jpg"),
        nominees: [M("Cinderella", 11224, "/4nssBcQUBadCTBjrAkX46mVEKts.jpg"), M("Panic in the Streets", 32078, "/79jfETdOonIFL8UEjBxptPS27yo.jpg")]
      }
    },

    "Silver Lion (Director)": {
      2024: { winner: M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg", "Brady Corbet"), nominees: [] },
      2023: { winner: M("Io Capitano", 937746, "/kGlZFwUQI5gAUdySNFfqGIkAF9n.jpg", "Matteo Garrone"), nominees: [] },
      2022: { winner: M("Bones and All", 791177, "/dBQuk2LkHjrDsSjueirPQg96GCc.jpg", "Luca Guadagnino"), nominees: [] },
      2021: { winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg", "Jane Campion"), nominees: [] },
      2020: { winner: M("Wife of a Spy", 688301, "/seFjT7jDZA1j1YsbMyeNTuCRe5d.jpg", "Kiyoshi Kurosawa"), nominees: [] },
      2019: { winner: M("About Endlessness", 348672, "/fRIBlFJiMNm7DkphQgcHgDS2Pvx.jpg", "Roy Andersson"), nominees: [] },
      2018: { winner: M("The Sisters Brothers", 440161, "/wTgomqYRTXT3BXQScnIo8uHDyWC.jpg", "Jacques Audiard"), nominees: [] },
      2017: { winner: M("Custody", 390401, "/9HBvD29HeQf0DeQx2ec4TgmRtS7.jpg", "Xavier Legrand"), nominees: [] },
      2016: {
        winner: M("The Untamed", 387801, "/bpTNGIJkdYL8IJvvCmKmjtDpXn1.jpg", "Amat Escalante"),
        nominees: [M("Paradise", 408539, "/kI3BSS2pzKimLa8uHk6ap8Ole3o.jpg", "Andrei Konchalovsky")]
      },
      2015: { winner: M("The Wagner-Clan", 257677, "/v6tNGIn101RkgtxYL9VpEeuuns7.jpg", "Pablo Trapero"), nominees: [] },
      2014: { winner: M("The Postman's White Nights", 283703, "/4oGXORt06TvdkTCPE7JJ5xykG0j.jpg", "Andrei Konchalovsky"), nominees: [] },
      2013: { winner: M("Miss Violence", 211052, "/pEGEVgqLwhDV8ZGG5DK7NHDIU3T.jpg", "Alexandros Avranas"), nominees: [] },
      2012: { winner: M("The Master", 68722, "/rUSjbyvYWN9H4az8xt0tDtU7I6v.jpg", "Paul Thomas Anderson"), nominees: [] },
      2011: { winner: M("People Mountain People Sea", 102869, "/xl0isEwRZA3XhCshtnPqUpVdvjO.jpg", "Cai Shangjun"), nominees: [] },
      2010: { winner: M("The Last Circus", 56812, "/rbpp2G4cpGG8jqCqhEBwvjQ0Y6C.jpg", "Alex de la Iglesia"), nominees: [] },
      2009: { winner: M("Men Without Women", 790042, "/uL5fAA8yZw68myvKbtmxSlydYZn.jpg", "Shirin Neshat"), nominees: [] },
      2008: { winner: M("Paper Soldier", 12428, "/v7IcfRrCMyWta2DjbS155FDA5Yh.jpg", "Aleksei German Jr"), nominees: [] },
      2007: { winner: M("Redacted", 11600, "/ofXlW8FtBGVGSgRiaOIfnzR5koU.jpg", "Brian De Palma"), nominees: [] },
      2006: { winner: M("Private Fears in Public Places", 24170, "/41FKZtBbFbZjbXKzSynUPlpo6kO.jpg", "Alain Resnais"), nominees: [] },
      2005: { winner: M("Regular Lovers", 45126, "/A7L0bpB34LyybFmGNa4fSW3Ps5n.jpg", "Philippe Garrel"), nominees: [] },
      2004: { winner: M("3-Iron", 1280, "/8ens4pTquSxN7J9EgL0NOehWwdZ.jpg", "Kim Ki-duk"), nominees: [] },
      2003: { winner: M("Zatoichi", 246, "/iCIycswWbX1EDS6PYYBcR9ohrC.jpg", "Takeshi Kitano"), nominees: [] },
      2002: { winner: M("Oasis", 26955, "/aaajiBpeBVbVwovpSQKaMfKRGKw.jpg", "Lee Chang-dong"), nominees: [] },
      2001: { winner: M("Secret Ballot", 43772, "/nirVNVYtwxG3wkH7klpEYDq0Gvb.jpg", "Babak Payami"), nominees: [] },
      2000: { winner: M("The Wrestlers", 125727, "/4CFm6GdfZlhixpotSU1qYqVA3dJ.jpg", "Buddhadeb Dasgupta"), nominees: [] },
      1999: { winner: M("Seventeen Years", 41455, "/ey5n906QiWeG4WLjnjCmwHr3ghO.jpg", "Zhang Yuan"), nominees: [] },
      1998: { winner: M("Black Cat, White Cat", 1075, "/xxQ9jgYf3xhbUTW98VtCjA1wMLv.jpg", "Emir Kusturica"), nominees: [] }
    },

    "Silver Lion (Grand Jury)": {
      2024: { winner: M("Vermiglio", 1151244, "/aeCwM7c1Y1IAu3Oqqj5A2tSziWR.jpg"), nominees: [] },
      2023: { winner: M("Evil Does Not Exist", 1156125, "/nC7MgPceKAEPWYq6aswrNzG8WAM.jpg"), nominees: [] },
      2022: { winner: M("Saint Omer", 925943, "/ekr25uuxlH7kg3KLhLLZcDZ15xd.jpg"), nominees: [] },
      2021: { winner: M("The Hand of God", 722778, "/kreVxr5moB7K52IGGV1BGAn6nq1.jpg"), nominees: [] },
      2020: { winner: M("New Order", 575446, "/v6NodCMzqilx0Xw541P65WFnDfE.jpg"), nominees: [] },
      2019: { winner: M("An Officer and a Spy", 399121, "/kqlzmKVBpGz7OMWfOXlK4y1m9Uz.jpg"), nominees: [] },
      2018: { winner: M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg"), nominees: [] },
      2017: { winner: M("Foxtrot", 444431, "/ec59rAksDZwMaOZl1DHOXNJxIfz.jpg"), nominees: [] },
      2016: { winner: M("Nocturnal Animals", 340666, "/mdLDgQBD0va09npSQX5Zgo2evXM.jpg"), nominees: [] },
      2015: { winner: M("Anomalisa", 291270, "/4DJ1zNr4Y6q7zQ27goEYla46VdO.jpg"), nominees: [] },
      2014: { winner: M("The Look of Silence", 267480, "/7TakQLT8gyzIMG8hX8RLTd5qROQ.jpg"), nominees: [] },
      2013: { winner: M("Stray Dogs", 209840, "/zRwQzUDQlGwCeHkRUTuCkIyaaJj.jpg"), nominees: [] },
      2012: { winner: M("Paradise: Faith", 129734, "/5BczhbPMZDOBr8NxXCQHx3j0MQp.jpg"), nominees: [] },
      2011: { winner: M("Terraferma", 73872, "/z1J6pfxzkxhyQSHdtHWS4WgIPj.jpg"), nominees: [] },
      2010: { winner: M("Essential Killing", 48243, "/gwLUPEqjHz55khkXeQB3hOYx1ao.jpg"), nominees: [] },
      2009: { winner: M("Soul Kitchen", 31175, "/9Y2OQ7MFouzmVCMqqvZPLrzHF0F.jpg"), nominees: [] },
      2008: { winner: M("Teza", 12427, "/qttcUNmmi7S9FFim3dt3YPqAhd7.jpg"), nominees: [] },
      2007: { winner: M("I'm Not There", 3902, "/bucgvB7gQqcl1m71efHkenfIMTj.jpg"), nominees: [] },
      2006: { winner: M("Dry Season", 24171, "/1IVVcLMQn9Ur3hjerOF5EfWoNMC.jpg"), nominees: [] },
      2005: { winner: M("Mary", 64942, "/h8BwKOM75G8AOd1Z4zL0AWfI0zS.jpg"), nominees: [] },
      2004: { winner: M("The Sea Inside", 1913, "/mQW1JJKCUg02cmWBzr9JFu9vM1V.jpg"), nominees: [] },
      2003: { winner: M("The Kite", 44086, "/sqKKR7peDlwySZgWVW1viYbP5ry.jpg"), nominees: [] },
      2002: { winner: M("House of Fools", 72996, "/p3q9U27s7czWbynaxkCvcYWBfPQ.jpg"), nominees: [] },
      2001: { winner: M("Dog Days", 786942, ""), nominees: [] },
      2000: { winner: M("Before Night Falls", 5001, "/kb2dqj73cfmt6qHAh1ySIlVm6v0.jpg"), nominees: [] },
      1999: { winner: M("The Wind Will Carry Us", 43423, "/tzrqZungDYA3Djp61NWUm7DtxNI.jpg"), nominees: [] },
      1998: { winner: M("Next Stop Paradise", 123707, "/rGafgpADv9enlhEenp3r48Ya7Jp.jpg"), nominees: [] },
      1997: { winner: M("Ovosodo", 48254, "/lV5uNrculiODLGqzWsP7uV3EUPm.jpg"), nominees: [] },
      1996: { winner: M("Brigands, Chapter VII", 48012, "/vrqfu97qE93rl7VFDAfBTtFCIUw.jpg"), nominees: [] },
      1995: { winner: M("God's Comedy", 49974, "/5Y4VOCIpLvHFf62UyOuWNtrkc7K.jpg"), nominees: [] },
      1994: { winner: M("Heavenly Creatures", 1024, "/uvb86wVCIqD3Rlbr0GTNgWDF7Zo.jpg"), nominees: [] }
    }
  },

  // ============================
  //  BERLIN
  // ============================
  Berlin: {

    "Golden Bear": {
      2024: {
        winner: M("Dahomey", 1101256, "/9d8KvJ3OjUq9rwuM743QPQO48aL.jpg"),
        nominees: [
          M("Another End", 1087593, "/fuWWd7pQYGv21av3HonQg6oCkZL.jpg"),
          M("Architecton", 1234597, "/ko5fY3Y05u3rRFQUXNGyRybnxqT.jpg"),
          M("Black Tea", 662402, "/8wfbaGi9wS9wKvpN3eMSRgfgbkM.jpg"),
          M("La Cocina", 966238, "/5Hnlt0KY7OtYRLIDPaR4oDS3Ajo.jpg"),
          M("The Devil's Bath", 931944, "/txVfrmwFOKB5qczM0ENYSqKMnSv.jpg"),
          M("A Different Man", 989662, "/lZZKTEvo92u1J5pm7QoEA5yN3du.jpg"),
          M("Godzilla x Kong: The New Empire", 823464, "/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"),
          M("From Hilde, with Love", 1070319, "/hJ8y5VsbjbzDCoXJ6LDwn8JcFkP.jpg"),
          M("Ama Gloria", 803688, "/vfi3h3ZemjWCyaCv3wUJXGE8aF2.jpg"),
          M("Foreign Language", 803690, "/cPFCJ1VsSYKyTFpvWl6Nrt0ddNL.jpg"),
          M("My Favourite Cake", 1234591, "/gs6XHzRPZWBMUbFkZUwMDgNz0li.jpg"),
          M("Pepe", 1172241, "/kp48PDp0fdsBPYLXJ6VUiYBzJfV.jpg"),
          M("Shambhala", 1234593, "/vKjZCLhmgGGv4ydpO5w503yZRR3.jpg"),
          M("Small Things Like These", 1102493, "/rdcO38cbWFg002nXg5QYtk7Tz4L.jpg"),
          M("Sons", 1381892, "/2DhWN5LROs7j0Zl2WdrUoDtJnIE.jpg"),
          M("Suspended Time", 1119625, "/xln0VwS4h0uHl8XMW2fCmvv3YDG.jpg"),
          M("A Traveler's Needs", 1146410, "/eDimH4UKv1qsXdnFePXuDZb3cA4.jpg"),
          M("Who Do I Belong To", 794090, "/hqHRWmT8hKiC2ua9F5r4qnWaMEI.jpg")
        ]
      },
      2023: { winner: M("On the Adamant", 1070449, "/g4j8NiY6JZ6zHdWktCbPHaCG1HJ.jpg"), nominees: [] },
      2022: { winner: M("Alcarràs", 804251, "/sbFVJZAvd7a7n2aHEUtOyrQtAKo.jpg"), nominees: [] },
      2021: { winner: M("Bad Luck Banging or Loony Porn", 790496, "/zUTkjET8VUwvbvSHtn0Lou7xwyZ.jpg"), nominees: [] },
      2020: { winner: M("There Is No Evil", 667935, "/AmMUP11ZWRqR08DmyigNmbG8Sit.jpg"), nominees: [] },
      2019: { winner: M("Synonyms", 501590, "/4Jh2h0XsUBFxxeRgDUdfrDjVgFz.jpg"), nominees: [] },
      2018: { winner: M("Touch Me Not", 499155, "/tcz5rD4ChAqNiYDwmoa8yVyRsOY.jpg"), nominees: [] },
      2017: { winner: M("On Body and Soul", 436343, "/uguWEoZelSSckxgiQctlkZ6gpfU.jpg"), nominees: [] },
      2016: { winner: M("Fire at Sea", 377151, "/fKZCS6IBTyGX7Sl67eMLSGHFsQn.jpg"), nominees: [] },
      2015: { winner: M("Taxi", 345628, "/w5P3gXIV1ES7QJfkPxU9UWbdObG.jpg"), nominees: [] },
      2014: { winner: M("Black Coal, Thin Ice", 255756, "/3vVcDI8r2KOcsBFwu6Kyx6ntmqp.jpg"), nominees: [] },
      2013: { winner: M("Child's Pose", 160118, "/eS7eDNgdk9UHbY8ZY3A5w4aI824.jpg"), nominees: [] },
      2012: { winner: M("Caesar Must Die", 96821, "/jrtCezCf08Kuk1I9D14vy3ZmfA4.jpg"), nominees: [] },
      2011: { winner: M("From Iran, a Separation", 307381, "/l285J2OqfgQHLAKNYZy20S2qUvy.jpg"), nominees: [] },
      2010: { winner: M("Honey", 44160, "/1zeG8HGIJI4ae9SI7SGHhHc7pzG.jpg"), nominees: [] },
      2009: {
        winner: M("The Milk of Sorrow", 28644, "/bdg1wZ76HSVEtEKh7FUXYGqW9nW.jpg"),
        nominees: [
          M("About Elly", 37181, "/ctLrMQrg3kss2JO7OIr7RVdN5an.jpg"),
          M("Chéri", 22215, "/b35rv11ebJdqCe5chVmSUZ0RIlX.jpg"),
          M("In the Electric Mist", 13975, "/gsyUJovik2t5vzPyXL5tq5VWLym.jpg"),
          M("The Messenger", 28089, "/p4fJyH7mMbasiFYwiw2nE7D6pMY.jpg"),
          M("Rage", 26738, "/atqccoctqnvjj9yepJMxytbRvqf.jpg")
        ]
      },
      2008: {
        winner: M("Elite Squad", 7347, "/lwIXz785N2fXi8hsBr1IXciFlkM.jpg"),
        nominees: [
          M("Happy-Go-Lucky", 10503, "/9FdD4YClMPZponkvHuQOgEOaWcF.jpg"),
          M("I've Loved You So Long", 8276, "/14i0SnmWzgejS4ZRcBbzkvXD6dp.jpg"),
          M("Julia", 7351, "/9TuusjQoZqbsFr5DmnuBV7amoBB.jpg"),
          M("Katyn", 13614, "/g9yyF5zC2pel0gG6vxlVpkDgZgC.jpg"),
          M("Lady Jane", 78236, "/wrAz6dwk1XaRqhexwy5sXm2kudF.jpg"),
          M("The Other Boleyn Girl", 12184, "/q2lgC8mmAltWTkbqPM8n5EYF4XL.jpg"),
          M("Standard Operating Procedure", 8847, "/v2QCXsisMLYsozC2qJtYGa3Rvsi.jpg"),
          M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg")
        ]
      },
      2007: {
        winner: M("Tuya's Marriage", 2694, "/iT2bH6GmNidi5K3z65G7TnvuVWY.jpg"),
        nominees: [
          M("2 Days in Paris", 1845, "/4yf8vcgJtADTTPP0Ltq2KhqLfdE.jpg"),
          M("Angel", 393815, "/vq7Eod4UyV0OHVutrqlLalq1z3q.jpg"),
          M("Beaufort", 15048, "/qHE7j4HPg0QUD0OFG8x6fKEa6a2.jpg"),
          M("The Good German", 182, "/3LjHC2CWDkzoiPehf3GViujws0.jpg"),
          M("The Good Shepherd", 10356, "/AkNl18FRZcbuifRo6rYvVuYtVrf.jpg"),
          M("Goodbye Bafana", 1874, "/omL85DnSNaZLLnF0KzqSZihuWAr.jpg"),
          M("Hallam Foe", 2239, "/2RzhxbVNu4BaPx0ETCiuNUpjJf.jpg"),
          M("I'm a Cyborg, But That's OK", 5488, "/x48ecVD1HbfQh3KZeK6LwRgVrOl.jpg"),
          M("La Vie en Rose", 1407, "/3b9DAONAsFRhJKu25R33PE3VwDh.jpg"),
          M("Letters from Iwo Jima", 1251, "/kZokxQtzMPURvijWYFuvh1fAvnv.jpg")
        ]
      },
      2006: {
        winner: M("Grbavica: The Land of My Dreams", 317, "/hzLRMGaQ9v3QDMSimCE12aBtJzG.jpg"),
        nominees: [
          M("Candy", 4441, "/9DvrEg2p3Hrdr1uGe0t7kRraWjl.jpg"),
          M("Capote", 398, "/tzsxkZMnJvozpHQEl1KzO8KwWu.jpg"),
          M("Find Me Guilty", 9950, "/8M0dkX7jOor7exKor1txoUl9Ynu.jpg"),
          M("Invisible Waves", 38025, "/hkLRQNDOpaFRj8xyW6aTBhFxyLX.jpg"),
          M("The New World", 11400, "/dPyWMlQd54r3pK17GKG3iqjvNZ7.jpg"),
          M("The Science of Sleep", 300, "/8bummqwU6MV65ZJvNtKx8Y3NIEk.jpg"),
          M("Slumming", 76853, "/dP0dqoihTAyUGlyLAn5igttR0b6.jpg"),
          M("Snow Cake", 313, "/dzKNKUqaDu9JCUmjhuoDd8KQBBs.jpg"),
          M("Syriana", 231, "/mO3hWUTOxmLJxihvDU0YFkb0Mb5.jpg"),
          M("V for Vendetta", 752, "/piZOwjyk1g51oPHonc7zaQY3WOv.jpg")
        ]
      },
      2005: {
        winner: M("U-Carmen eKhayelitsha", 79706, "/iqF0rpEqVefmQYV0qXLUvYns0Yw.jpg"),
        nominees: [
          M("Asylum", 24461, "/dj0F0u5TJBZxsKf0xEtxgfGekxu.jpg"),
          M("Clean Hands", 1452110, ""),
          M("The Hidden Blade", 34019, "/j6eOTaZJqWG9lEFWfK9jJqd03Qo.jpg"),
          M("Hotel Rwanda", 205, "/p3pHw85UMZPegfMZBA6dZ06yarm.jpg"),
          M("In Good Company", 1901, "/5H3fbU4NlHPbLf3MUFZwPdmD3nS.jpg"),
          M("Kinsey", 11184, "/cODCjWNRcZkwe4ONQs1GzRqYtRb.jpg"),
          M("The Life Aquatic with Steve Zissou", 421, "/qZoFLNBC78jzboWeDH6Ha0qavF2.jpg"),
          M("Man to Man", 10087, "/3eV6ZfUZOa3MyQX0bDEeUjSmy3O.jpg"),
          M("Paradise Now", 67, "/qWZkYa8VdcDZk8uzRB2PfhpM9IL.jpg")
        ]
      },
      2004: {
        winner: M("Head-On", 363, "/9L5BBJiXZss58EBcbw0l4holdzZ.jpg"),
        nominees: [
          M("Before Sunset", 80, "/gycdE1ARByGQcK4fYR2mgpU6OO.jpg"),
          M("The Beautiful Country", 41714, "/cyPJuYz3c8kL7FcjfJDoB2o5yVt.jpg"),
          M("In My Country", 16635, "/zjyO6TrpJSeDCjxdFZk8RYEg6F6.jpg"),
          M("The Final Cut", 11099, "/hZ1G1uuZ1etwEhogwMDkXQRGWAO.jpg"),
          M("First Morning", 386205, ""),
          M("The Missing", 12146, "/86s5nw5F1G8lJtEowO0LBB4hoBW.jpg"),
          M("Monster", 504, "/b45yfHtLk4TSSDxOLgMLBpShner.jpg"),
          M("The Weeping Meadow", 37952, "/4lXTXN5i9rqO55uSQ6dqdAln5i9.jpg")
        ]
      },
      2003: {
        winner: M("In This World", 36791, "/denzE2tZc3TZ95vQNK3rKo0iDHn.jpg"),
        nominees: [
          M("25th Hour", 1429, "/uW7tTRElr2tRhmAVESzvHy4ByXg.jpg"),
          M("Adaptation.", 2757, "/ffEmHQAiD0m5dEQ6rlsuA9vlllW.jpg"),
          M("Confessions of a Dangerous Mind", 4912, "/nccluUFM3pRNI9nUyDEcDa6KviO.jpg"),
          M("Good Bye, Lenin!", 338, "/uHk1oGEbnvQGLnyiiYxTslZLoog.jpg"),
          M("Herod's Law", 14430, "/653dXbr6dXffXG0oN8OfZGShFRP.jpg"),
          M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg"),
          M("The Life of David Gale", 11615, "/7tcAvE82JyxIi79cwQV5br90KVz.jpg"),
          M("Solaris", 2103, "/drdrB1hEZmzFlK1xtW5HMxK3LUJ.jpg")
        ]
      },
      2002: {
        winner: M("Spirited Away", 129, "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"),
        nominees: [
          M("Bloody Sunday", 4107, "/oqdQMDJucR7R0ol0LFvzmqcDyEb.jpg"),
          M("8 Women", 1958, "/bJu4Gm7NQb2woPiIovrPD5jNWzf.jpg"),
          M("Amen.", 9045, "/duNRweZ6PBpFSVNLJYexZ2XEqr0.jpg"),
          M("Gosford Park", 5279, "/7r8DeZuaaHCiOEbkqZC6MFmwJ69.jpg"),
          M("Heaven", 10575, "/xPdtOuGtcQt655uRrmIdBkSRmVx.jpg"),
          M("Iris", 11889, "/pqtVPrv3xPLTUayC0bPruRjYWDF.jpg"),
          M("Monster's Ball", 1365, "/rQeufx98gKH4CCeVw57KT1Fd0gr.jpg"),
          M("The Royal Tenenbaums", 9428, "/nG7hZJn7wQTSDCQT39Gy3s3tbrp.jpg"),
          M("The Shipping News", 6440, "/3IdEZw4YN4NfvjLRyZVWpI0z2IH.jpg")
        ]
      },
      2001: {
        winner: M("Intimacy", 11845, "/aiPhBVo2eNhuPw5Pezx4BHagvUx.jpg"),
        nominees: [
          M("Bamboozled", 24664, "/oAg1mUUxdWJNLa6t1gctbQhXHVN.jpg"),
          M("Chocolat", 41951, "/qoFmpeLPaj3YC1DABs5QxC31aQ7.jpg"),
          M("Finding Forrester", 711, "/chd9bCGNYtzDoJqGw5wUHlhrkOb.jpg"),
          M("The Pledge", 5955, "/9QOzFL3FPMAUNNPrNiKC3mEDxco.jpg"),
          M("The Tailor of Panama", 2575, "/na80ysnoCvoxwGTMWCWYvnmaDlz.jpg"),
          M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg"),
          M("Wit", 26976, "/1ONOsIo5gby9hABPdknL7OAYBLm.jpg")
        ]
      },
      2000: {
        winner: M("Magnolia", 334, "/tpfC325Jk6S38VTe5dDWjWtoyxr.jpg"),
        nominees: [
          M("Any Given Sunday", 9563, "/bysZeUvSPZPJnku4qkHF34CdgMG.jpg"),
          M("The Beach", 1907, "/4y7LxD8TSi6AtsM2xSYqUm1gu7u.jpg"),
          M("The Hurricane", 10400, "/zhnxjsNnnpsBMF5V1H7Pzkec45Y.jpg"),
          M("Love's Labour's Lost", 51333, "/7rJr9b0Mc8wEAqzuDUkz0zg1BX7.jpg"),
          M("Man on the Moon", 1850, "/d8rahmdfryjdmvLpSsDOUhGVQXl.jpg"),
          M("The Million Dollar Hotel", 318, "/iGRyPsZF0lfIL3IadmBdoAsYzyn.jpg"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg")
        ]
      },
      1999: {
        winner: M("The Thin Red Line", 8741, "/seMydAaoxQP6F0xbE1jOcTmn5Jr.jpg"),
        nominees: [
          M("8MM", 8224, "/mhr9xRpjOBqlBjgDwtiOx6FsLvV.jpg"),
          M("Breakfast of Champions", 12479, "/5uNVeZNt7qxDWLJAZ0PER03WtKE.jpg"),
          M("Cookie's Fortune", 9465, "/tskbsm57aWqU4wsf8sX4ClM77Kf.jpg"),
          M("eXistenZ", 1946, "/kETKF0JhdTPn1knci8CAdYL0d79.jpg"),
          M("The Faculty", 9276, "/5XetJwmAiDC0EtH23NIXaqFn3Wl.jpg"),
          M("The Hi-Lo Country", 1363, "/1bC63XzaUEWJArFUQFKwUy77lZS.jpg"),
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg")
        ]
      },
      1998: {
        winner: M("Central Station", 666, "/zJvp7XjQ2LhPbDVYhFXyucs40vR.jpg"),
        nominees: [
          M("The Big Lebowski", 115, "/9mprbw31MGdd66LR0AQKoDMoFRv.jpg"),
          M("The Boxer", 16992, "/wsbNQWMQV4HwwqXtvQUoBfiBzK8.jpg"),
          M("The Butcher Boy", 22797, "/9KrClE5Ax6wzCAwgaGRhQI2Eolk.jpg"),
          M("Good Will Hunting", 489, "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg"),
          M("Great Expectations", 9410, "/djLsfl3lm7BZKWsKfVZ2wM1ZMrP.jpg"),
          M("I Want You", 35113, "/iMnAh6K4jLnwDrtxjaCshX9k425.jpg"),
          M("Jackie Brown", 184, "/rOUx7qg4KmEh1juEDwqzbDSL1Nr.jpg"),
          M("Wag the Dog", 586, "/pKl49ecMnCMX5XK5LUdxulxHLNi.jpg")
        ]
      },
      1997: {
        winner: M("The People vs. Larry Flynt", 1630, "/sAgHn7ys6TiVXBDTZ0UBEjinIUk.jpg"),
        nominees: [
          M("The Crucible", 20539, "/zv69Rev43me5gQ68x7fk1mQzhHn.jpg"),
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
          M("Get on the Bus!", 1307445, "/pmpifkpYlgE64SBgK5G6Vz6MvMv.jpg"),
          M("In Love and War", 26949, "/sX6MAU5LnYgh4w4Pg0AV18NypQD.jpg"),
          M("Mars Attacks!", 75, "/hll4O5vSAfnZDb6JbnP06GPtz7b.jpg"),
          M("Romeo + Juliet", 454, "/eLf4jclPijOqfEp6bDAmezRFxk5.jpg"),
          M("Rosewood", 25624, "/5EeTYDXdrpD9mZSSwsrFbqgok9U.jpg"),
          M("Comanche Territory", 186755, "/tQK9bx1EICIik2Up49ZCyUX4BM3.jpg")
        ]
      },
      1996: {
        winner: M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
        nominees: [
          M("Twelve Monkeys", 63, "/gt3iyguaCIw8DpQZI1LIN5TohM2.jpg"),
          M("Dead Man Walking", 687, "/eShxyjhWoFl3BwsuEmVsr4nLaMZ.jpg"),
          M("From Dusk Till Dawn", 755, "/sV3kIAmvJ9tPz4Lq5fuf9LLMxte.jpg"),
          M("Get Shorty", 8012, "/r82SdPhg4fnIcLt0ogIjQxqjdcO.jpg"),
          M("Home for the Holidays", 9089, "/3zqlKdOttWyExzopVxglz50Vjxq.jpg"),
          M("Mary Reilly", 9095, "/cW5wTiv5fdtBOd22utmAIZBCMS3.jpg"),
          M("Restoration", 35196, "/z1YM3WFZnF2NwHT5IRGYUcvZBSl.jpg"),
          M("Richard III", 31174, "/aN2BcIH6rvGbYiRQCS8lxOdeeVQ.jpg")
        ]
      },
      1995: {
        winner: M("Fresh Bait", 38414, "/86hFBxrciPyuhCcZis5gBndKWJB.jpg"),
        nominees: [
          M("Before Sunrise", 76, "/kf1Jb1c2JAOqjuzA3H4oDM263uB.jpg"),
          M("Blue in the Face", 5894, "/u0iwm9SDjlfFZDrSdSbcebX7VUG.jpg"),
          M("Nobody's Fool", 11593, "/xyAXFy6mOfgZcVWbceCeuTYadeq.jpg"),
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg"),
          M("Smoke", 10149, "/1WMUaTQaj2dQrhsPI3Px0OR9eTF.jpg")
        ]
      },
      1994: {
        winner: M("In the Name of the Father", 7984, "/3NcIkKxaO2SmRVsG1v50XhtmL0f.jpg"),
        nominees: [
          M("Fearless", 10443, "/sFhzvwgv04VUmedB7pOO4cMP9xq.jpg"),
          M("Philadelphia", 9800, "/tFe5Yoo5zT495okA49bq1vPPkiV.jpg"),
          M("No Smoking", 894441, "/uax5sfXpnnSK3rG78OZn7npTWKQ.jpg"),
          M("Three Colors: White", 109, "/fdIet3NSa27gobMbaUml66oCQNT.jpg")
        ]
      },
      1993: {
        winner: M("The Wedding Banquet", 9261, "/arWCA8lg0rbdlwHUMvI46LNDhnL.jpg"),
        nominees: [
          M("Women from the Lake of Scented Souls", 162841, "/ia8HCqjRhto8lvtRY7pVFsJVjOO.jpg"),
          M("Arizona Dream", 11044, "/jNhRjc1Q9l6tFo5aHdl8UZJPdKy.jpg"),
          M("The Cement Garden", 14832, "/dnEoE3tHBStCXZx2i9qsUYkwucu.jpg"),
          M("Hoffa", 10410, "/aMGhaSkhkFwz33hKEsBrJ3ptx3g.jpg"),
          M("Love Field", 66599, "/u0qV3fFXWM6yGMlaqz3EWNSodB4.jpg"),
          M("Malcolm X", 1883, "/o2s9ow0uRRm1BcF3teznk5twd90.jpg"),
          M("Toys", 11597, "/l0YBVvOvOxoOkggTZ70tNGvGQo4.jpg")
        ]
      },
      1992: {
        winner: M("Grand Canyon", 13697, "/gpqLukoUXAXkyMZ0jPSuAbWf5Nx.jpg"),
        nominees: [
          M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg"),
          M("Cape Fear", 1598, "/ws4mrtndzgSH5QGCamOFAgilr2R.jpg"),
          M("Dead Again", 11498, "/irEnDVtxox6gnRJuwtEZuxvl2vZ.jpg"),
          M("Gas Food Lodging", 47866, "/4klEYvGDHmv89NQRfAaDc8qHncs.jpg"),
          M("Light Sleeper", 36351, "/fFSdOYKp80rcK81KuNW3rz7FcLX.jpg"),
          M("Naked Lunch", 2742, "/u01kh5jKUWjhom76mguRqUgdvja.jpg"),
          M("The Prince of Tides", 10333, "/1AyeW3YlwfhRwLDeUCW686obceb.jpg"),
          M("Star Trek VI: The Undiscovered Country", 174, "/tvTOJD7Gz668GLy2nNdLRQvpPsv.jpg")
        ]
      },
      1991: {
        winner: M("The House of Smiles", 148757, "/cBhYGT6qFEDZAtB8hEjPb1hzJAC.jpg"),
        nominees: [
          M("The Ballad of the Sad Cafe", 135473, "/u5DFcZR8BChuSmiXvvMWoAOV8NK.jpg"),
          M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"),
          M("Mister Johnson", 123772, "/pkvaIlFJOw4CKm7820Rhw7t9xUJ.jpg"),
          M("The Russia House", 10170, "/fFvwQGcpEdXkuPJaS15Xtl6h6P4.jpg"),
          M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg")
        ]
      },
      1990: {
        winner: M("Music Box", 2263, "/iHumUQOIJWWx6x77fOcB2PVBu53.jpg"),
        nominees: [
          M("Larks on a String", 12078, "/iyM7dduKJFIH8Ybydp7HYCbd5lI.jpg"),
          M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg"),
          M("Coming Out", 36672, "/j7BWpF1oBX4yFFSj1Q2C3dpTMjg.jpg"),
          M("Driving Miss Daisy", 403, "/iaCzvcY42HihFxQBTZCTKMpsI0P.jpg"),
          M("The Handmaid's Tale", 20815, "/cnkKQyRzoCMZliMaknTOXHqXKaz.jpg"),
          M("Steel Magnolias", 10860, "/7ExUSN9s9gX9bhVM17zDLEizano.jpg"),
          M("The War of the Roses", 249, "/k2l2df0XlY58wfr7a3RPJ59qmxl.jpg")
        ]
      },
      1989: { winner: M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg"), nominees: [] },
      1988: { winner: M("Red Sorghum", 42006, "/2CP2eazEBKJ3njm4HM63pMfs5tW.jpg"), nominees: [] },
      1987: { winner: M("The Theme", 131349, "/aUsB23s73SnA7RkesmtYaB3wXk9.jpg"), nominees: [] },
      1986: { winner: M("The Baader-Meinhof Gang on Trial", 52327, "/neFrkGrwWYGUvIG5bGmd9UIx3Jr.jpg"), nominees: [] },
      1985: {
        winner: M("The Woman and the Stranger", 163149, "/nFA3TcwhZzGKUfm5Aam8tRHz6Vw.jpg"),
        nominees: [M("Wetherby", 147747, "/koVPZF3r1jFS1gKMTK27dco6crv.jpg")]
      },
      1984: { winner: M("Love Streams", 52109, "/c5uyQfWvzCVsCHL13J5JBZ61SQJ.jpg"), nominees: [] },
      1983: {
        winner: M("Ascendancy", 163143, "/4y5TZvjHqin3NjSky3pbL7UKeec.jpg"),
        nominees: [M("The Beehive", 547998, "/zCC1UYwg3kfKbFr3uBFxXyDbT2Z.jpg")]
      },
      1982: { winner: M("Veronika Voss", 2262, "/A09gh5oWVfincs6BbRz91HL4Rgc.jpg"), nominees: [] },
      1981: { winner: M("Faster, Faster", 47211, "/93aeKG6qQ2feWX2lAZcjUATYpwc.jpg"), nominees: [] },
      1980: {
        winner: M("Heartland Reggae", 169610, "/eNFBi2lBCY2NuT2nTRy1QsqnCPa.jpg"),
        nominees: [M("Palermo or Wolfsburg", 130544, "/mpkzTs5iGbE8HPGEUDFEt7SkAOK.jpg")]
      },
      1979: { winner: M("David", 163133, "/jr6KkKAqTcvwPtip3fCsfw7XcVa.jpg"), nominees: [] },
      1978: { winner: M("Trout", 162438, "/7hzEG7NJnKYAurCl9jQMZEpIXiO.jpg"), nominees: [] },
      1977: { winner: M("The Ascent", 50183, "/hJOju5XZfmq4Lg5dPa8IPVY3mDt.jpg"), nominees: [] },
      1976: { winner: M("Buffalo Bill and the Indians, or Sitting Bull's History Lesson", 42233, "/zyQZAJogUOECWM46v4N6wGDHd20.jpg"), nominees: [] },
      1975: { winner: M("Adoption", 61703, "/rblFqH0CKL66LG0JA5qbmfaBsmP.jpg"), nominees: [] },
      1974: { winner: M("The Apprenticeship of Duddy Kravitz", 42451, "/wizmy0hFKs7lsn2ljHMctj86KEN.jpg"), nominees: [] },
      1973: { winner: M("Distant Thunder", 113012, "/7AT7RPArBH6k5Ac01VSk2uWQkZW.jpg"), nominees: [] },
      1972: { winner: M("The Canterbury Tales", 5691, "/6mAUGtIc0PjvL1EhDwX6WMkUQpp.jpg"), nominees: [] },
      1971: { winner: M("The Garden of the Finzi-Continis", 4789, "/qHDATOZMoiJjfy2bb1xEFFPzkuG.jpg"), nominees: [] },
      1969: { winner: M("Early Works", 162421, "/hCogNNXuSjwscpoaGlxaRxGnoJn.jpg"), nominees: [] },
      1968: { winner: M("Who Saw Him Die?", 122671, "/8szDzyMcras0UldB1mzyDWRmrzS.jpg"), nominees: [] },
      1967: { winner: M("The Departure", 137726, "/m1GStQbRRRoepV5R4aGJbxYe7D3.jpg"), nominees: [] },
      1966: { winner: M("Cul-de-sac", 4772, "/jxNATC8t1rmrVMCMVMEAp41bgVm.jpg"), nominees: [] },
      1965: { winner: M("Alphaville", 8072, "/fFJP3D5fJDFxN7ChqSye1DZ0fTL.jpg"), nominees: [] },
      1964: { winner: M("Dry Summer", 58897, "/uUuxr9C5TAQTfladuNR6F6soACf.jpg"), nominees: [] },
      1963: {
        winner: M("To Bed or Not to Bed", 162382, "/2fzZoD49WyHtdx1Awxz8CvRtDje.jpg"),
        nominees: [M("Bushido: The Cruel Code of the Samurai", 90299, "/kJXwWpEcyZe1DBCljBIIeGB5HJl.jpg")]
      },
      1962: { winner: M("A Kind of Loving", 33765, "/zOmiMh7lkHbzWHwazcHFGYVnVHY.jpg"), nominees: [] },
      1961: { winner: M("La Notte", 41050, "/xkd7wPJSIC76scBRHCFZ85uOH5d.jpg"), nominees: [] },
      1960: { winner: M("El Lazarillo de Tormes", 162368, "/4RONKUIOwM8AMDydVUDFe3ustCc.jpg"), nominees: [] },
      1959: { winner: M("The Cousins", 2363, "/c0p1ps8j2l8pVRw3GModHPdCIBV.jpg"), nominees: [] },
      1958: { winner: M("Wild Strawberries", 614, "/iyTD2QnySNMPUPE3IedZQipSWfz.jpg"), nominees: [] },
      1957: { winner: M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg"), nominees: [] },
      1956: { winner: M("Invitation to the Dance", 47310, "/8DrVPRBKNhfUFpPM3yiu8PWuvbR.jpg"), nominees: [] },
      1955: { winner: M("The Rats", 148836, "/a05xGtYAFgnqxbLN6PcIrNnL2Xp.jpg"), nominees: [] },
      1954: { winner: M("Hobson's Choice", 16410, "/kbP7EgoiOw2bIypai50JWRsqP7p.jpg"), nominees: [] },
      1953: { winner: M("The Wages of Fear", 204, "/dZyZSosIlWcpQkV0f7pXcrV2TQV.jpg"), nominees: [] },
      1952: { winner: M("One Summer of Happiness", 56719, "/pejm19LBXIzYGvthUJTQcqyMgEy.jpg"), nominees: [] },
      1951: { winner: M("Four in a Jeep", 162339, "/iAcPAvaciAsb3Bw4wiTDG7dJyX9.jpg"), nominees: [] }
    },

    "Silver Bear (Director)": {
      2024: { winner: M("Pepe", 1172241, "/kp48PDp0fdsBPYLXJ6VUiYBzJfV.jpg", "Nelson Carlos De Los Santos Arias"), nominees: [] },
      2023: { winner: M("The Plough", 920767, "/erpCOi8yiq0kiLGTSUfHvS0I4ae.jpg", "Philippe Garrel"), nominees: [] },
      2022: { winner: M("Both Sides of the Blade", 768757, "/w0jUcrS42AyPNgb1RwjDm0BLaZz.jpg", "Claire Denis"), nominees: [] },
      2021: { winner: M("Natural Light", 669661, "/yws7TVzBWNK6zvrfRuD2TFFCFwU.jpg", "Denes Nagy"), nominees: [] },
      2020: { winner: M("The Woman Who Ran", 662401, "/uAxE3xIGDAlqQXGtOgLKaBADVHh.jpg", "Hong Sang-soo"), nominees: [] },
      2019: { winner: M("I Was at Home, But...", 500895, "/fArb1AK8YRWR0HiNisC0Vky8dzK.jpg", "Angela Schanelec"), nominees: [] },
      2018: { winner: M("Isle of Dogs", 399174, "/c0nUX6Q1ZB0P2t1Jo6EeFSVnOGQ.jpg", "Wes Anderson"), nominees: [] },
      2017: { winner: M("The Other Side of Hope", 429199, "/spqAX6L4YtPaCj2dnc10Tku9AU7.jpg", "Aki Kaurismaki"), nominees: [] },
      2016: { winner: M("Things to Come", 374465, "/6MAAJJ51y2RUa1gvvVje4s0FB7W.jpg", "Mia Hansen-Love"), nominees: [] },
      2015: { winner: M("Aferim!", 319993, "/fQyRszfnlXPFqQSWlqvdDDo42Ze.jpg", "Radu Jude"), nominees: [] },
      2014: { winner: M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg", "Richard Linklater"), nominees: [] },
      2013: { winner: M("Prince Avalanche", 113148, "/kCfs93bW6FdLIZoYN5pYILysyx4.jpg", "David Gordon Green"), nominees: [] },
      2012: { winner: M("Barbara", 88284, "/i7yjITqgz5zSW1jJWzxfwQsyDeo.jpg", "Christian Petzold"), nominees: [] },
      2011: { winner: M("Sleeping Sickness", 70768, "/7mgpizL8cnCTWJu23xq8irJ2WfI.jpg", "Ulrich Kohler"), nominees: [] },
      2010: { winner: M("The Ghost Writer", 11439, "/rK7m2Ba0ieXa37NaAmrx4dfRvvM.jpg", "Roman Polanski"), nominees: [] },
      2009: { winner: M("About Elly", 37181, "/ctLrMQrg3kss2JO7OIr7RVdN5an.jpg", "Asghar Farhadi"), nominees: [] },
      2008: { winner: M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg", "Paul Thomas Anderson"), nominees: [] },
      2007: { winner: M("Beaufort", 15048, "/qHE7j4HPg0QUD0OFG8x6fKEa6a2.jpg", "Joseph Cedar"), nominees: [] },
      2006: { winner: M("The Road to Guantanamo", 7872, "/deM5htQLvRjcRkeIFtaOdd5TDrC.jpg", "Michael Winterbottom"), nominees: [] },
      2005: { winner: M("Sophie Scholl: The Final Days", 2117, "/aAbxubEzowWJNBWYG82wXcKuzZP.jpg", "Marc Rothemund"), nominees: [] },
      2004: { winner: M("Samaritan Girl", 1279, "/w0cn9vwzkheuCT2a2MStdnadOyh.jpg", "Kim Ki-duk"), nominees: [] },
      2003: { winner: M("His Brother", 78208, "/pTBeS1PLFSRavsg3wMsYDLxxBHU.jpg", "Patrice Chereau"), nominees: [] },
      2002: { winner: M("Monday Morning", 49696, "/fli9wdNEWksXZlSfyxaOa1mF23.jpg", "Otar Iosseliani"), nominees: [] },
      2001: { winner: M("Betelnut Beauty", 44704, "/48JB4lNQmnLB1E52TbOS5QEp7CS.jpg", "Lin Cheng-sheng"), nominees: [] },
      2000: { winner: M("Man on the Moon", 1850, "/d8rahmdfryjdmvLpSsDOUhGVQXl.jpg", "Milos Forman"), nominees: [] },
      1999: { winner: M("The Hi-Lo Country", 1363, "/1bC63XzaUEWJArFUQFKwUy77lZS.jpg", "Stephen Frears"), nominees: [] },
      1998: { winner: M("The Butcher Boy", 22797, "/9KrClE5Ax6wzCAwgaGRhQI2Eolk.jpg", "Neil Jordan"), nominees: [] },
      1997: { winner: M("Port Djema", 263164, "/j1OralV7NdQ8vqQBCqJf4AnY22n.jpg", "Eric Heumann"), nominees: [] },
      1996: { winner: M("Richard III", 31174, "/aN2BcIH6rvGbYiRQCS8lxOdeeVQ.jpg", "Richard Loncraine"), nominees: [] },
      1995: { winner: M("Before Sunrise", 76, "/kf1Jb1c2JAOqjuzA3H4oDM263uB.jpg", "Richard Linklater"), nominees: [] },
      1994: { winner: M("Three Colors: White", 109, "/fdIet3NSa27gobMbaUml66oCQNT.jpg", "Krzysztof Kieslowski"), nominees: [] },
      1993: { winner: M("The Cement Garden", 14832, "/dnEoE3tHBStCXZx2i9qsUYkwucu.jpg", "Andrew Birkin"), nominees: [] },
      1992: { winner: M("Il Capitano: A Swedish Requiem", 71721, "/nnZIaHG6OxkR6kBo6JezfseaMDP.jpg", "Jan Troell"), nominees: [] },
      1991: { winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", "Jonathan Demme"), nominees: [] },
      1990: { winner: M("The Nasty Girl", 4339, "/vMgWMJe7crXnj3MZ39tKSSjFSPD.jpg", "Michael Verhoeven"), nominees: [] },
      1989: { winner: M("I Love, You Love", 245184, "/50isBItKAZatAX5qy770xZhhwWH.jpg", "Dusan Hanak"), nominees: [] },
      1988: { winner: M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg", "Norman Jewison"), nominees: [] },
      1987: { winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg", "Oliver Stone"), nominees: [] },
      1986: { winner: M("Voyage of the Young Composer", 148786, "/sJqNgoMSWGrOdCdlDk7C30HPEBv.jpg", "Georgi Shengelaya"), nominees: [] },
      1985: { winner: M("Places in the Heart", 13681, "/bmWg3uVn700inqOiadxeFTmiqmV.jpg", "Robert Benton"), nominees: [] },
      1984: { winner: M("Le Bal", 60612, "/cAWB2CFtLg2cKYlQqbaHPEA2vBF.jpg", "Ettore Scola"), nominees: [] },
      1983: { winner: M("Pauline at the Beach", 10293, "/kjC8I6fvchcxPBdh4bw4w8Px8ue.jpg", "Eric Rohmer"), nominees: [] },
      1982: { winner: M("The Marquis of Grillo", 32480, "/ew6UD5tZhADSctIhkbN9RSoyBVv.jpg", "Mario Monicelli"), nominees: [] },
      1981: { winner: M("The Boat Is Full", 42140, "/ohOOHH4O3Uu5qj7QVuOQAmWYkCk.jpg", "Markus Imhoof"), nominees: [] },
      1980: { winner: M("Confidence", 49139, "/fqueQgCoTttLRYMWWp6Kdqh7uk9.jpg", "Istvan Szabo"), nominees: [] },
      1979: { winner: M("Winterborn", 160415, "/dJFOqqGo2oQz5FfaQ1yXhUCyByP.jpg", "Astrid Henning-Jensen"), nominees: [] },
      1978: { winner: M("With Obvious Advantage", 1535604, "/onvrepzs4SjM5N3meRvOGUWzRd7.jpg", "Georgi Djulgerov"), nominees: [] },
      1977: { winner: M("Black Litter", 263816, "/hlYqaMfDBrXPaPhfeiyBUm8P0L8.jpg", "Manuel Gutierrez Aragon"), nominees: [] },
      1976: { winner: M("Dear Michael", 1207433, "/flAyuvm8WH5aG3Ee0Q1MSPxMH8w.jpg", "Mario Monicelli"), nominees: [] },
      1975: { winner: M("One Hundred Days After Childhood", 48623, "/1z3ZnRLsvkAjEjxPL70SPiCx3Qe.jpg", "Sergei Solovyov"), nominees: [] },
      1972: { winner: M("The Old Maid", 105576, "/diFhLbkZOfp4P9Cw19OgJFH24Yg.jpg", "Jean-Pierre Blanc"), nominees: [] },
      1968: { winner: M("Peppermint Frappé", 105584, "/vBoDIvqSU88rWLcpzNmnstc8FBV.jpg", "Carlos Saura"), nominees: [] },
      1967: { winner: M("The Rats Woke Up", 225725, "/2QFrFM7wN09sYvaatiHBRwuX7w6.jpg", "Zivojin Pavlovic"), nominees: [] },
      1966: { winner: M("The Hunt", 114333, "/2lODWq6rLdcb8hLuQpt9qHSAatW.jpg", "Carlos Saura"), nominees: [] },
      1965: { winner: M("Charulata", 35790, "/4kznHLoJGN3OBZunQvZwy26it8z.jpg", "Satyajit Ray"), nominees: [] },
      1964: { winner: M("One Night In Kathmandu", 760935, "/o0eHdSYWcVeNWGVAhUMIXalqmhS.jpg", "Satyajit Ray"), nominees: [] },
      1963: { winner: M("Young Aphrodites", 80988, "/3ariRzMfwePqmTAeJxvCFI8sBIo.jpg", "Nikos Koundouros"), nominees: [] },
      1962: { winner: M("Salvatore Giuliano", 27523, "/uaFTCD0y2MEccTFyHOHj6IrwyZ.jpg", "Francesco Rosi"), nominees: [] },
      1961: { winner: M("The Miracle of Father Malachia", 269031, "/wAhmfE01KVggcsReC4oBhyKEuSN.jpg", "Bernhard Wicki"), nominees: [] },
      1960: { winner: M("Breathless", 269, "/9Wx0Wdn2EOqeCZU4SP6tlS3LOml.jpg", "Jean-Luc Godard"), nominees: [] },
      1959: { winner: M("Akira Kurosawa: It Is Wonderful to Create: 'The Hidden Fortress'", 523627, "/6XpVCtDYh01dVzrVuEm2LnNzCAD.jpg", "Akira Kurosawa"), nominees: [] },
      1958: { winner: M("Jun'ai monogatari kusa no mi", 1142121, "/pXEyER3xPyOsfz9gxpN2wps6osG.jpg", "Tadashi Imai"), nominees: [] },
      1957: { winner: M("Fathers and Sons", 217648, "/jNEuDVz1UbFL0xUpFHoeu8xdmyl.jpg", "Mario Monicelli"), nominees: [] },
      1956: { winner: M("Autumn Leaves", 43256, "/9WdCLe9vMgWic184e19JOFXm4Od.jpg", "Robert Aldrich"), nominees: [] },
      1955: { winner: M("Mort en fraude", 520025, "/uIQZZbd6y1OrdzPVt36IBcDSdh6.jpg", "Marcel Camus"), nominees: [] },
      1954: { winner: M("Hobson's Choice", 16410, "/kbP7EgoiOw2bIypai50JWRsqP7p.jpg", "David Lean"), nominees: [] }
    },

    "Silver Bear (Grand Jury)": {
      2024: { winner: M("A Traveler's Needs", 1146410, "/eDimH4UKv1qsXdnFePXuDZb3cA4.jpg"), nominees: [] },
      2023: { winner: M("Afire", 900379, "/k8NYzD01zAUsdqocjhLXbO9BSS8.jpg"), nominees: [] },
      2022: { winner: M("The Novelist's Film", 928713, "/5o4LNNBvc0kquSMaahjT2RTGFBR.jpg"), nominees: [] },
      2021: { winner: M("Wheel of Fortune and Fantasy", 795811, "/z3xqVWOsetW6pSEgx1uiqXfzRet.jpg"), nominees: [] },
      2020: { winner: M("Never Rarely Sometimes Always", 595671, "/7yiSyQhhjTFphhfCUcn05tCQxyG.jpg"), nominees: [] },
      2019: { winner: M("By the Grace of God", 509364, "/qbwcnAdBkfGBIbQ1xdQZtiUg2lf.jpg"), nominees: [] },
      2018: { winner: M("The Dream Maniplator Mugen", 958424, "/490lT0s1k9LPN4pHyYah3WiowKd.jpg"), nominees: [] },
      2017: { winner: M("Félicité", 436340, "/qxODnuQgjj8N5ZKHLYCrSpz8tJx.jpg"), nominees: [] },
      2016: { winner: M("Death in Sarajevo", 377156, "/uppKv3dGvMFUJeMAJBzqGVrCjzU.jpg"), nominees: [] },
      2015: { winner: M("The Club", 319995, "/cSLJxkNyKLnfNtyR16bzlHKBQW7.jpg"), nominees: [] },
      2014: { winner: M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"), nominees: [] },
      2013: { winner: M("An Episode in the Life of an Iron Picker", 159942, "/lWdO5xwygCwhAxNPDNkiQP0CeZb.jpg"), nominees: [] },
      2012: { winner: M("Just the Wind", 110383, "/nEw8Q4D55DbsJYwLUG1C53bWIX0.jpg"), nominees: [] },
      2011: { winner: M("The Turin Horse", 81401, "/2kSElneXSKmMsGL55k0CbPGqLbu.jpg"), nominees: [] },
      2010: { winner: M("If I Want to Whistle, I Whistle", 39840, "/hZeYyXe5qyMb0Qmz7EUXsfdlcbL.jpg"), nominees: [] },
      2009: { winner: M("Everyone Else", 33809, "/zwncG9rCrVCoA20mGAx0TV31Kp6.jpg"), nominees: [] },
      2008: { winner: M("Standard Operating Procedure", 8847, "/v2QCXsisMLYsozC2qJtYGa3Rvsi.jpg"), nominees: [] },
      2007: { winner: M("The Other End of the Line", 17334, "/uiLgARBzUiE7PPRiJILXSh4zOIW.jpg"), nominees: [] },
      2006: { winner: M("A Soap", 15845, "/voJjFkkn240R0ppNljTqxeuxRgO.jpg"), nominees: [] },
      2005: { winner: M("Peacock", 11728, "/uwdCPLbXAYG5DWuvVOjTB3JFACv.jpg"), nominees: [] },
      2004: { winner: M("Lost Embrace", 49681, "/kmXuxzMazRbivZFLSg9kaOxNGCc.jpg"), nominees: [] },
      2003: { winner: M("Adaptation.", 2757, "/ffEmHQAiD0m5dEQ6rlsuA9vlllW.jpg"), nominees: [] },
      2002: { winner: M("Grill Point", 316, "/bMdeYeO8ylTqJDVnEPECdhroEg8.jpg"), nominees: [] },
      2001: { winner: M("Beijing Bicycle", 12659, "/mkOBUHcJFfVWLJmWNvE0qZuzAW0.jpg"), nominees: [] },
      2000: { winner: M("The Road Home", 12276, "/AbUmBTtVZDpchPA4Yfq4OpIs46X.jpg"), nominees: [] },
      1999: { winner: M("Mifune", 139, "/qEg7dmFcPqjF5kBYD0Bkz2CVyYB.jpg"), nominees: [] },
      1998: { winner: M("Wag the Dog", 586, "/pKl49ecMnCMX5XK5LUdxulxHLNi.jpg"), nominees: [] },
      1997: { winner: M("The River", 54291, "/8Z4jHXRPf86hIsnvHXnTp2dt5pj.jpg"), nominees: [] },
      1996: { winner: M("All Things Fair", 27098, "/y1oFNynXrIzlPUe4CXKMR2dpNep.jpg"), nominees: [] },
      1995: { winner: M("Smoke", 10149, "/1WMUaTQaj2dQrhsPI3Px0OR9eTF.jpg"), nominees: [] },
      1994: { winner: M("Strawberry and Chocolate", 12527, "/8riS2hGneWg78MHuhP7NqvLERRy.jpg"), nominees: [] },
      1993: { winner: M("Arizona Dream", 11044, "/jNhRjc1Q9l6tFo5aHdl8UZJPdKy.jpg"), nominees: [] },
      1992: { winner: M("Sweet Emma, Dear Böbe", 41194, "/anGU5jd6JiNfNlWoXHiP7uRGnR1.jpg"), nominees: [] },
      1991: { winner: M("The Conviction", 175956, "/9yHaJngTlPQHB8eZEqGogTcuQZI.jpg"), nominees: [] },
      1990: { winner: M("The Asthenic Syndrome", 97039, "/kE0HAjG6Awe0nOta9uvnzVKVgsH.jpg"), nominees: [] },
      1989: { winner: M("Evening Bell", 258477, "/9svm7uB84F6ldkgNda3xExUwefr.jpg"), nominees: [] },
      1988: { winner: M("The Commissar", 71336, "/dpCKri2vdKDLkGEFLTOZNrD4bwv.jpg"), nominees: [] },
      1987: { winner: M("The Sea and Poison", 103393, "/AvDpxWlgrrs1ipm2jWAWo6dz1Hu.jpg"), nominees: [] },
      1986: { winner: M("The Mass Is Ended", 60732, "/eCdfHMyFRc5uDG2cdIOlc5rBGUd.jpg"), nominees: [] },
      1985: { winner: M("Flowers of Reverie", 263403, "/gqEjGiCcV3XCbIjMItbzJdukKrj.jpg"), nominees: [] },
      1984: { winner: M("No Trifling with Love", 1179544, "/x1xVFFfV2utnQ39PcfF4jPs3sdG.jpg"), nominees: [] },
      1983: { winner: M("A Season in Hakkari", 263547, "/wD5RlQFWI0HkGLv7d2XKWxX2sZw.jpg"), nominees: [] },
      1982: { winner: M("The Draughtsman's Contract", 10831, "/ljeTWR2kowGXijMc8LMuy72ULM3.jpg"), nominees: [] },
      1981: { winner: M("In Search of Famine", 214386, "/mmYSY3ZjjjK45nzC6lW2bV0lEVU.jpg"), nominees: [] },
      1979: { winner: M("Alexandria… Why?", 40939, "/k68nAl2BJpX9405UCqs4Xhw2S7n.jpg"), nominees: [] },
      1978: { winner: M("The Fall of Ako Castle", 70959, "/doBE70EgjYVMq2ylTZjQOzRzrJU.jpg"), nominees: [] },
      1977: { winner: M("The Devil, Probably", 32097, "/8y00J2rVtxHntKMukkkzsYKQORe.jpg"), nominees: [] },
      1976: { winner: M("Canoa: A Shameful Memory", 116982, "/ag35bvtquwiDPsY4itNH895NguW.jpg"), nominees: [] },
      1975: {
        winner: M("The Common Man", 5602, "/4Yo9YU2bHI0ujOWxgi1koeSMuqb.jpg"),
        nominees: [M("Overlord", 55343, "/2bpWZ9RwFRUwtu86v1v60p6QuYR.jpg")]
      },
      1974: { winner: M("The Watchmaker of St. Paul", 8425, "/fLDETyjhqsEDmryQ17i46wV3ECr.jpg"), nominees: [] },
      1973: { winner: M("The Seven Madmen", 202454, "/wiiDBNQTWpDbTEyvYR2ve41FEPU.jpg"), nominees: [] },
      1972: { winner: M("The Hospital", 32082, "/mOxi0lUCv8F9HqS8u0cEIthwhc7.jpg"), nominees: [] },
      1971: { winner: M("The Decameron", 33583, "/iL5mmuIL6fqFSWJeHE417WWrocz.jpg"), nominees: [] },
      1969: { winner: M("Greetings", 73604, "/iU02yppRGPlrlH7it2Y8YnQiAT.jpg"), nominees: [] },
      1968: { winner: M("Innocence Unprotected", 62842, "/9CBLbgOzkexoM5swzSvv9eExo8h.jpg"), nominees: [] },
      1967: { winner: M("Alle Jahre wieder", 262617, "/IIgrbK7duALJgaRp3vZdcLxfZC.jpg"), nominees: [] },
      1966: { winner: M("No Shooting Time for Foxes", 267662, "/2DVdDfPkOrJ92bCtq7OPFMz8Pm0.jpg"), nominees: [] },
      1965: { winner: M("Happiness", 53023, "/r6UYog9MruOe4X71AS57EhuJrFq.jpg"), nominees: [] },
      1963: { winner: M("The Caretaker", 120959, "/hCHKMYQjZxxLQTIB2Qe0yWeMWtI.jpg"), nominees: [] },
      1962: { winner: M("Jonny & Jessy", 700739, "/5K6V9vE4ywNAM63XDP6Eh7GvAvH.jpg"), nominees: [] },
      1961: { winner: M("A Woman Is a Woman", 31522, "/xrZu21hriGJQY3qY8nifh2smVHu.jpg"), nominees: [] },
      1960: { winner: M("The Love Game", 269125, "/PHTz0AkebFKc1k3hNoxGszfqZZ.jpg"), nominees: [] }
    }
  },

  // ============================
  //  BAFTA
  // ============================
  BAFTA: {

    "Best Actor": {
      2026: {
        winner: null,
        nominees: [
          M("I Swear", 1317149, "/lC4NgQPqyKxNJ3PEgl2HVUxTY1t.jpg", "Robert Aramayo"),
          M("Marty Supreme", 1317288, "/lYWEXbQgRTR4ZQleSXAgRbxAjvq.jpg", "Timothée Chalamet"),
          M("One Battle After Another", 1054867, "/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg", "Leonardo DiCaprio"),
          M("Blue Moon", 1299655, "/nij3i5ziQdqfiK29gb4rX1bkmVy.jpg", "Ethan Hawke"),
          M("Sinners", 1233413, "/qTvFWCGeGXgBRaINLY1zqgTPSpn.jpg", "Michael B. Jordan"),
          M("Bugonia", 701387, "/rSdOua3wKMEaFWDcKAYWRjXQWOt.jpg", "Jesse Plemons")
        ]
      },
      2025: {
        winner: M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg", "Adrien Brody"),
        nominees: [
          M("A Complete Unknown", 661539, "/llWl3GtNoXosbvYboelmoT459NM.jpg", "Timothée Chalamet"),
          M("Sing Sing", 1155828, "/s0TPyI8QlMiktEiq3JVhea0zFhM.jpg", "Colman Domingo"),
          M("Conclave", 974576, "/vYEyxF1UT779RiEalpMjUT6kfdf.jpg", "Ralph Fiennes"),
          M("Heretic", 1138194, "/fr96XzlzsONrQrGfdLMiwtQjott.jpg", "Hugh Grant"),
          M("The Apprentice", 1182047, "/549Hdul2BgPnZMhqFxp6npp2opr.jpg", "Sebastian Stan")
        ]
      },
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "Cillian Murphy"),
        nominees: [
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg", "Bradley Cooper"),
          M("Rustin", 291727, "/sY8X8w4cnCcMSv4iFq79MKbon2M.jpg", "Colman Domingo"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg", "Paul Giamatti"),
          M("Saltburn", 930564, "/zGTfMwG112BC66mpaveVxoWPOaB.jpg", "Barry Keoghan"),
          M("Past Lives", 666277, "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg", "Teo Yoo")
        ]
      },
      2023: {
        winner: M("Elvis", 614934, "/rva3UhKaMeiB0Vej5A2pm1leX7K.jpg", "Austin Butler"),
        nominees: [
          M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg", "Colin Farrell"),
          M("The Whale", 785084, "/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg", "Brendan Fraser"),
          M("Good Luck to You, Leo Grande", 758330, "/dxxOmTq4LgQxiyU4rW53qdj9FoN.jpg", "Daryl McCormack"),
          M("Aftersun", 965150, "/evKz85EKouVbIr51zy5fOtpNRPg.jpg", "Paul Mescal"),
          M("Living", 760099, "/zUJcp0rpUqp2GSk7t9jvAiZsXtM.jpg", "Bill Nighy")
        ]
      },
      2022: {
        winner: M("King Richard", 614917, "/2dfujXrxePtYJPiPHj1HkAFQvpu.jpg", "Will Smith"),
        nominees: [
          M("Ali & Ava", 661365, "/phBaAgc4EGxs0ScOb16ZfOShyfQ.jpg", "Adeel Akhtar"),
          M("Swan Song", 794602, "/tf63pGGx3qdCj11xqJ8Ae3scTb.jpg", "Mahershala Ali"),
          M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg", "Benedict Cumberbatch"),
          M("Don't Look Up", 646380, "/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg", "Leonardo DiCaprio"),
          M("Boiling Point", 807196, "/kdkk7OBnIL1peW2zwcAAp6O54Jo.jpg", "Stephen Graham")
        ]
      },
      2021: {
        winner: M("The Father", 600354, "/pr3bEQ517uMb5loLvjFQi8uLAsp.jpg", "Anthony Hopkins"),
        nominees: [
          M("Sound of Metal", 502033, "/3178oOJKKPDeQ2legWQvMPpllv.jpg", "Riz Ahmed"),
          M("Ma Rainey's Black Bottom", 615667, "/pvtyxijaBrCSbByXLcUIDDSvc40.jpg", "Chadwick Boseman"),
          M("The White Tiger", 628534, "/5JnmseS3DZ6ad2VMbrnbGCs8Rst.jpg", "Adarsh Gourav"),
          M("Another Round", 580175, "/aDcIt4NHURLKnAEu7gow51Yd00Q.jpg", "Mads Mikkelsen"),
          M("The Mauritanian", 644583, "/lIADEa6oH74uUapjsPbNRzxus8M.jpg", "Tahar Rahim")
        ]
      },
      2020: {
        winner: M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", "Joaquin Phoenix"),
        nominees: [
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg", "Leonardo DiCaprio"),
          M("Marriage Story", 492188, "/2JRyCKaRKyJAVpsIHeLvPw5nHmw.jpg", "Adam Driver"),
          M("Rocketman", 504608, "/f4FF18ia7yTvHf2izNrHqBmgH8U.jpg", "Taron Egerton"),
          M("The Two Popes", 551332, "/4d4mTSfDIFIbUbMLUfaKodvxYXA.jpg", "Jonathan Pryce")
        ]
      },
      2019: {
        winner: M("Bohemian Rhapsody", 424694, "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg", "Rami Malek"),
        nominees: [
          M("Vice", 429197, "/1gCab6rNv1r6V64cwsU4oEr649Y.jpg", "Christian Bale"),
          M("Stan & Ollie", 394741, "/8qDBDXA8Od8gc4IQMnoXUKyj8Pf.jpg", "Steve Coogan"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg", "Bradley Cooper"),
          M("Green Book", 490132, "/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg", "Viggo Mortensen")
        ]
      },
      2018: {
        winner: M("Darkest Hour", 399404, "/xa6G3aKlysQeVg9wOb0dRcIGlWu.jpg", "Gary Oldman"),
        nominees: [
          M("Film Stars Don't Die in Liverpool", 398174, "/87oy4bxwkhmb4Jb3MRvosvd9NOX.jpg", "Jamie Bell"),
          M("Call Me by Your Name", 398818, "/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg", "Timothée Chalamet"),
          M("Phantom Thread", 400617, "/hgoWjp9Sh0MI97eAMZCnIoVfgvq.jpg", "Daniel Day-Lewis"),
          M("Get Out", 419430, "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg", "Daniel Kaluuya")
        ]
      },
      2017: {
        winner: M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg", "Casey Affleck"),
        nominees: [
          M("Hacksaw Ridge", 324786, "/wuz8TjCIWR2EVVMuEfBnQ1vuGS3.jpg", "Andrew Garfield"),
          M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", "Ryan Gosling"),
          M("Nocturnal Animals", 340666, "/mdLDgQBD0va09npSQX5Zgo2evXM.jpg", "Jake Gyllenhaal"),
          M("Captain Fantastic", 334533, "/2sFME73GaD8UsUxPUKe60cPdLif.jpg", "Viggo Mortensen")
        ]
      },
      2016: {
        winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg", "Leonardo DiCaprio"),
        nominees: [
          M("Trumbo", 294016, "/2RERIRnZkROSeHZAIf8PSxhzOqs.jpg", "Bryan Cranston"),
          M("The Martian", 286217, "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg", "Matt Damon"),
          M("Steve Jobs", 321697, "/ljiRO29Y9khEERRqMluptUYunJ9.jpg", "Michael Fassbender"),
          M("The Danish Girl", 306819, "/mXZZIacI5FC8thzSC0lgQBQ2uAX.jpg", "Eddie Redmayne")
        ]
      },
      2015: {
        winner: M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg", "Eddie Redmayne"),
        nominees: [
          M("The Imitation Game", 205596, "/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg", "Benedict Cumberbatch"),
          M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", "Ralph Fiennes"),
          M("Nightcrawler", 242582, "/j9HrX8f7GbZQm1BrBiR40uFQZSb.jpg", "Jake Gyllenhaal"),
          M("Birdman", 435092, "/9n0u3Ee7OUjgeyF5kIwahxkf4xm.jpg", "Michael Keaton")
        ]
      },
      2014: {
        winner: M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg", "Chiwetel Ejiofor"),
        nominees: [
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg", "Christian Bale"),
          M("Nebraska", 129670, "/o1t2Mw18EEBnl8v4Nby3PFjxnM1.jpg", "Bruce Dern"),
          M("The Wolf of Wall Street", 106646, "/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg", "Leonardo DiCaprio"),
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg", "Tom Hanks")
        ]
      },
      2013: {
        winner: M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg", "Daniel Day-Lewis"),
        nominees: [
          M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg", "Ben Affleck"),
          M("Silver Linings Playbook", 82693, "/fhHB1uvfFKKFbj6bTKE8xdtsjKi.jpg", "Bradley Cooper"),
          M("Les Misérables", 82695, "/6CuzBs2Lb8At7qQr64mLXg2RYRb.jpg", "Hugh Jackman"),
          M("The Master", 68722, "/rUSjbyvYWN9H4az8xt0tDtU7I6v.jpg", "Joaquin Phoenix")
        ]
      },
      2012: {
        winner: M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg", "Jean Dujardin"),
        nominees: [
          M("The Descendants", 65057, "/8cDq5UlOPYeKm39okALCEOsZPxk.jpg", "George Clooney"),
          M("Shame", 76025, "/cAWLz9kFv4xc6IsEXTj2DrcqD55.jpg", "Michael Fassbender"),
          M("Tinker Tailor Soldier Spy", 49517, "/e0dZ7TapGY9HtJ9xk1TUHPEOccl.jpg", "Gary Oldman"),
          M("Moneyball", 60308, "/4yIQq1e6iOcaZ5rLDG3lZBP3j7a.jpg", "Brad Pitt")
        ]
      },
      2011: {
        winner: M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg", "Colin Firth"),
        nominees: [
          M("Biutiful", 45958, "/4BLshBMp8INRDhvfuKwxMlHDIIt.jpg", "Javier Bardem"),
          M("True Grit", 44264, "/tCrB8pcjadZjsDk7rleGJaIv78k.jpg", "Jeff Bridges"),
          M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", "Jesse Eisenberg"),
          M("127 Hours", 44115, "/h0RMdn0rfl9l5hWXz3tUh6QVkhi.jpg", "James Franco")
        ]
      },
      2010: {
        winner: M("A Single Man", 34653, "/AvqTb66bS1i1NjlPC76zvxo0taT.jpg", "Colin Firth"),
        nominees: [
          M("Crazy Heart", 25196, "/zwao2YMsqf27IzNEtDNWSe0W9jH.jpg", "Jeff Bridges"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg", "George Clooney"),
          M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg", "Jeremy Renner"),
          M("Sex & Drugs & Rock & Roll", 37234, "/A8iKHHVRyJPL7Gq58eiTkSI53vJ.jpg", "Andy Serkis")
        ]
      },
      2009: {
        winner: M("The Wrestler", 12163, "/6OTR8dSoNGjWohJNo3UhIGd3Tj.jpg", "Mickey Rourke"),
        nominees: [
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg", "Frank Langella"),
          M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg", "Dev Patel"),
          M("Milk", 10139, "/ot4ImF4b7QbS6XsTdMH3pWxNmX2.jpg", "Sean Penn"),
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg", "Brad Pitt")
        ]
      },
      2008: {
        winner: M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg", "Daniel Day-Lewis"),
        nominees: [
          M("Michael Clayton", 4566, "/hhkW4yVIGo8Bee3UITKvqOvhNMG.jpg", "George Clooney"),
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg", "James McAvoy"),
          M("Eastern Promises", 2252, "/dpiJWb4NrWgcOg2rusuLhDM0hTm.jpg", "Viggo Mortensen"),
          M("The Lives of Others", 582, "/cVUDMnskSc01rdbyH0tLATTJUdP.jpg", "Ulrich Mühe")
        ]
      },
      2007: {
        winner: M("The Last King of Scotland", 1523, "/n1CgN2mS7RSxHhv2R1DdisYDvT6.jpg", "Forest Whitaker"),
        nominees: [
          M("Casino Royale", 36557, "/lMrxYKKhd4lqRzwUHAy5gcx9PSO.jpg", "Daniel Craig"),
          M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg", "Leonardo DiCaprio"),
          M("The History Boys", 8618, "/klybhTU75GUcQbzdVXUhsZgq1EV.jpg", "Richard Griffiths"),
          M("Venus", 13771, "/pY1B5ipgUkxtBN3fkJWuKAeFL2G.jpg", "Peter O'Toole")
        ]
      },
      2006: {
        winner: M("Capote", 398, "/tzsxkZMnJvozpHQEl1KzO8KwWu.jpg", "Philip Seymour Hoffman"),
        nominees: [
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg", "Ralph Fiennes"),
          M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg", "Heath Ledger"),
          M("Walk the Line", 69, "/p8lPTjvjOjTfvC1E9pmMwcF9vkn.jpg", "Joaquin Phoenix"),
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg", "David Strathairn")
        ]
      },
      2005: {
        winner: M("Ray", 1677, "/tSPC7sO2XYNL9QcMmK88tuUALL5.jpg", "Jamie Foxx"),
        nominees: [
          M("Eternal Sunshine of the Spotless Mind", 38, "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", "Jim Carrey"),
          M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg", "Leonardo DiCaprio"),
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg", "Johnny Depp"),
          M("The Motorcycle Diaries", 1653, "/qz2aBYT8CAiJYvX4fRZpJ5G0Oz1.jpg", "Gael García Bernal")
        ]
      },
      2004: {
        winner: M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg", "Bill Murray"),
        nominees: [
          M("21 Grams", 470, "/wZ0l6or5juuVWqDkLEgaghs4f9l.jpg", "Benicio del Toro"),
          M("Pirates of the Caribbean: The Curse of the Black Pearl", 22, "/poHwCZeWzJCShH7tOjg8RIoyjcw.jpg", "Johnny Depp"),
          M("Cold Mountain", 2289, "/j0AJeeR5CQPDFh0otyWyCWREHO8.jpg", "Jude Law")
        ]
      },
      2003: {
        winner: M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg", "Daniel Day-Lewis"),
        nominees: [
          M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", "Adrien Brody"),
          M("Adaptation.", 2757, "/ffEmHQAiD0m5dEQ6rlsuA9vlllW.jpg", "Nicolas Cage"),
          M("The Quiet American", 8198, "/nLooNNrvzpf49G7HsB9siQT4036.jpg", "Michael Caine"),
          M("About Schmidt", 2755, "/tstvsrJHY57hc951lb190alXRQm.jpg", "Jack Nicholson")
        ]
      },
      2002: {
        winner: M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg", "Russell Crowe"),
        nominees: [
          M("Iris", 11889, "/pqtVPrv3xPLTUayC0bPruRjYWDF.jpg", "Jim Broadbent"),
          M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", "Ian McKellen"),
          M("The Shipping News", 6440, "/3IdEZw4YN4NfvjLRyZVWpI0z2IH.jpg", "Kevin Spacey"),
          M("In the Bedroom", 1999, "/IQj11YbraLDyPYaz79jtDoAscc.jpg", "Tom Wilkinson")
        ]
      },
      2001: {
        winner: M("Billy Elliot", 71, "/nOr5diUZxphmAD3li9aiILyI28F.jpg", "Jamie Bell"),
        nominees: [
          M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", "Russell Crowe"),
          M("Wonder Boys", 11004, "/vGOdSLaZmu42qqwDUMgrfctJ65M.jpg", "Michael Douglas"),
          M("Cast Away", 8358, "/7lLJgKnAicAcR5UEuo8xhSMj18w.jpg", "Tom Hanks"),
          M("Quills", 10876, "/AvGdw3BpvJV2wHmK2qY0N7XHqET.jpg", "Geoffrey Rush")
        ]
      },
      2000: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Kevin Spacey"),
        nominees: [
          M("Topsy-Turvy", 46435, "/oFYbpqqj5C6MXshBI1umd9qrrdY.jpg", "Jim Broadbent"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg", "Russell Crowe"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Ralph Fiennes"),
          M("East/West", 28463, "/c1Uf4HC5WEcssVoOm48Bfzn7Wmk.jpg", "Om Puri")
        ]
      },
      1999: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Kevin Spacey"),
        nominees: [
          M("Topsy-Turvy", 46435, "/oFYbpqqj5C6MXshBI1umd9qrrdY.jpg", "Jim Broadbent"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg", "Russell Crowe"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Ralph Fiennes"),
          M("East Is East", 10557, "/tDchJ4mB23vGgwdQCmq9FCQ4W23.jpg", "Om Puri")
        ]
      },
      1998: {
        winner: M("Life Is Beautiful", 637, "/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg", "Roberto Benigni"),
        nominees: [
          M("Little Voice", 8545, "/7VxdMxSa3BEAvGl5nLvsgpBwrZH.jpg", "Michael Caine"),
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg", "Joseph Fiennes"),
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg", "Tom Hanks")
        ]
      },
      1997: {
        winner: M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg", "Robert Carlyle"),
        nominees: [
          M("Mrs Brown", 17589, "/zFLaeGWglaWfdLiUNcvmUeg0KRJ.jpg", "Billy Connolly"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg", "Kevin Spacey"),
          M("Nil by Mouth", 21252, "/u0Zl9uF0LV37X6oKECLT6rU7TsI.jpg", "Ray Winstone")
        ]
      },
      1996: {
        winner: M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg", "Geoffrey Rush"),
        nominees: [
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg", "Ralph Fiennes"),
          M("Richard III", 31174, "/aN2BcIH6rvGbYiRQCS8lxOdeeVQ.jpg", "Ian McKellen"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg", "Timothy Spall")
        ]
      },
      1995: {
        winner: M("The Madness of King George", 11318, "/1dTSY023ZyBbgVSKDRuA6JLGSnZ.jpg", "Nigel Hawthorne"),
        nominees: [
          M("Leaving Las Vegas", 451, "/wTrFpGe3U65kXTldIUxuM2hmOAK.jpg", "Nicolas Cage"),
          M("Carrington", 47018, "/8NmeBTkC4UQa8XT2GGsBN2R8Bqo.jpg", "Jonathan Pryce"),
          M("The Postman", 11010, "/cUaCpjVDefYShKyLmkcDsiPaBHn.jpg", "Massimo Troisi")
        ]
      },
      1994: {
        winner: M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg", "Hugh Grant"),
        nominees: [
          M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", "Tom Hanks"),
          M("The Adventures of Priscilla, Queen of the Desert", 2759, "/kJ7syYXEJgSBmBfSnF3Can9cK1J.jpg", "Terence Stamp"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", "John Travolta")
        ]
      },
      1993: {
        winner: M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg", "Anthony Hopkins"),
        nominees: [
          M("In the Name of the Father", 7984, "/3NcIkKxaO2SmRVsG1v50XhtmL0f.jpg", "Daniel Day-Lewis"),
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg", "Anthony Hopkins"),
          M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", "Liam Neeson")
        ]
      },
      1992: {
        winner: M("Chaplin", 10435, "/53auOJUsPP2YE97HTYgBQ0WO2gO.jpg", "Robert Downey Jr."),
        nominees: [
          M("The Last of the Mohicans", 9361, "/qzJMPWRtZveBkxXOv3ucWhoJuyj.jpg", "Daniel Day-Lewis"),
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg", "Stephen Rea"),
          M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg", "Tim Robbins")
        ]
      },
      1991: {
        winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", "Anthony Hopkins"),
        nominees: [
          M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg", "Kevin Costner"),
          M("Cyrano de Bergerac", 11673, "/80XJ5UkGuYTKDuALeG03BLk1OT1.jpg", "Gérard Depardieu"),
          M("Truly Madly Deeply", 18317, "/jjLEXLTXfJPYtl31knRS8bjclf0.jpg", "Alan Rickman")
        ]
      },
      1990: {
        winner: M("Cinema Paradiso", 11216, "/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg", "Philippe Noiret"),
        nominees: [
          M("The Hunt for Red October", 1669, "/yVl7zidse4KiWtGMqHFtZCx4X3N.jpg", "Sean Connery"),
          M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg", "Tom Cruise"),
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg", "Robert De Niro")
        ]
      },
      1989: {
        winner: M("My Left Foot: The Story of Christy Brown", 10161, "/GRAAl0bMQFoFIjV3aunc5jsM5u.jpg", "Daniel Day-Lewis"),
        nominees: [
          M("Henry V", 10705, "/w9R2HsYNnfF3m9uEo2UAmPNJr8a.jpg", "Kenneth Branagh"),
          M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg", "Dustin Hoffman"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg", "Robin Williams")
        ]
      },
      1988: {
        winner: M("A Fish Called Wanda", 623, "/hkSGFNVfEEUXFCxRZDITFHVhUlu.jpg", "John Cleese"),
        nominees: [M("Fatal Attraction", 10998, "/vjB9XwJKnYqFKKjhWcE6WpAf5Ki.jpg", "Michael Douglas"), M("Good Morning, Vietnam", 801, "/sreISlFUn5TyR41QNjlfAdX5SEW.jpg", "Robin Williams")]
      },
      1987: {
        winner: M("The Name of the Rose", 192, "/d6dlbTBb3N7nXDz7tQslDJs2jgv.jpg", "Sean Connery"),
        nominees: [M("Jean de Florette", 4480, "/atjyDRdOnOi2S28X3mNtJ7CQmFj.jpg", "Gérard Depardieu"), M("Prick Up Your Ears", 27857, "/yLrWxmqPqAQFjyefJtYjoaDxGpi.jpg", "Gary Oldman")]
      },
      1986: {
        winner: M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg", "Bob Hoskins"),
        nominees: [M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg", "Woody Allen"), M("Crocodile Dundee", 9671, "/pduPduL1ub5kok3lPYT15ryC9L6.jpg", "Paul Hogan")]
      },
      1985: {
        winner: M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg", "William Hurt"),
        nominees: [
          M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg", "F. Murray Abraham"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg", "Harrison Ford"),
          M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg", "Victor Banerjee")
        ]
      },
      1984: {
        winner: M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg", "Haing S. Ngor"),
        nominees: [M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg", "Tom Courtenay")]
      },
      1983: {
        winner: M("Educating Rita", 38291, "/xwxgiRzw2zxzWNIYp98faJ0rUy5.jpg", "Michael Caine"),
        nominees: [
          M("The Honorary Consul", 69007, "/zSkNhwE6yiAN9CknSXzxAjOUKW9.jpg", "Michael Caine"),
          M("The King of Comedy", 262, "/3sGuQv0UxfjDODCC9IQG5S1jXK8.jpg", "Robert De Niro"),
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg", "Dustin Hoffman")
        ]
      },
      1982: {
        winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg", "Ben Kingsley"),
        nominees: [
          M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg", "Warren Beatty"),
          M("Shoot the Moon", 52772, "/71GK3DRyFWN0Ke0s8WwgEEEOUJQ.jpg", "Albert Finney"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg", "Henry Fonda")
        ]
      },
      1981: {
        winner: M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg", "Burt Lancaster"),
        nominees: [
          M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg", "Robert De Niro"),
          M("The Long Good Friday", 14807, "/pXS667me5Jfoj1b0xuxgjEMKunF.jpg", "Bob Hoskins"),
          M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg", "Jeremy Irons")
        ]
      },
      1980: {
        winner: M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg", "John Hurt"),
        nominees: [
          M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg", "Dustin Hoffman"),
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg", "Peter Sellers"),
          M("All That Jazz", 16858, "/culCEdj4srLljefgn4XKd6k3C5t.jpg", "Roy Scheider")
        ]
      },
      1979: {
        winner: M("The China Syndrome", 988, "/uHwwQIlt4XwpTFhX9ZT1A8xSW7F.jpg", "Jack Lemmon"),
        nominees: [
          M("Manhattan", 696, "/k4eT3EvfxW1L9Wmt04UqJqCvCR6.jpg", "Woody Allen"),
          M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg", "Robert De Niro"),
          M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg", "Martin Sheen")
        ]
      },
      1978: {
        winner: M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg", "Richard Dreyfuss"),
        nominees: [
          M("Magic", 34193, "/edxr6rPbpLh1V6dTiMIiyHNKRi9.jpg", "Anthony Hopkins"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg", "Brad Davis"),
          M("Death on the Nile", 4192, "/7qEymSp6wCT19AJxb7T3u6aKpi1.jpg", "Peter Ustinov")
        ]
      },
      1977: {
        winner: M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg", "Peter Finch"),
        nominees: [M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg", "Sylvester Stallone"), M("Slap Shot", 11590, "/k5dvEA7ajd90mf3KrF6m6LnYXOv.jpg", "Paul Newman")]
      },
      1976: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg", "Jack Nicholson"),
        nominees: [
          M("Taxi Driver", 103, "/ekstpH614fwDX8DUln1a2Opz0N8.jpg", "Robert De Niro"),
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg", "Dustin Hoffman"),
          M("The Bad News Bears", 23479, "/kJNXMni0ObOXLth6v9xpUhWbtrp.jpg", "Walter Matthau")
        ]
      },
      1975: {
        winner: M("The Godfather Part II", 240, "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", "Al Pacino"),
        nominees: [
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg", "Richard Dreyfuss"),
          M("French Connection II", 10711, "/55slIJqWAJSd8JdNnmq2oYlqBkX.jpg", "Gene Hackman"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg", "Dustin Hoffman")
        ]
      },
      1974: {
        winner: M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg", "Jack Nicholson"),
        nominees: [
          M("Murder on the Orient Express", 4176, "/oJjKcuoH7SuiqZaEpHt2Nd5ZxNY.jpg", "Albert Finney"),
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg", "Gene Hackman"),
          M("Serpico", 9040, "/76rLcn53Fjdh4Dji9EIeJ98aYj1.jpg", "Al Pacino")
        ]
      },
      1973: {
        winner: M("Pete 'n' Tillie", 107774, "/ySF4iAKMynUobtjFUWeJuEoduuV.jpg", "Walter Matthau"),
        nominees: [
          M("Last Tango in Paris", 1643, "/dNgdUdNOWfHsZI3lDu6Epig7H2P.jpg", "Marlon Brando"),
          M("Sleuth", 993, "/jAREYLUnYGwPjbQr0vs1s38QLkH.jpg", "Laurence Olivier"),
          M("Steelyard Blues", 74057, "/crLQEgW0EzN3iHFEIAKjKNH4j9p.jpg", "Donald Sutherland")
        ]
      },
      1972: {
        winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg", "Gene Hackman"),
        nominees: [
          M("The Nightcomers", 42526, "/lvZiQ2kNsalNGbD2H8yOx1MvRx8.jpg", "Marlon Brando"),
          M("The Hospital", 32082, "/mOxi0lUCv8F9HqS8u0cEIthwhc7.jpg", "George C. Scott"),
          M("Young Winston", 66775, "/lBrw76I5NSsHwS8IcPPCe49JjqC.jpg", "Robert Shaw")
        ]
      },
      1971: {
        winner: M("Sunday Bloody Sunday", 45938, "/7q1h3M1vDlsHDKRhoPOzKjmFCVq.jpg", "Peter Finch"),
        nominees: [
          M("Death in Venice", 6619, "/s81SuFBSqY8T5Lrn5R8ucX8LKxi.jpg", "Dirk Bogarde"),
          M("Gumshoe", 34991, "/nePQSG95aMm5WN2t3nEd5PzPPu1.jpg", "Albert Finney"),
          M("Little Big Man", 11040, "/pLvUVqadEI9cPrRlTru6ee71EWU.jpg", "Dustin Hoffman")
        ]
      },
      1970: {
        winner: M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg", "Robert Redford"),
        nominees: [M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg", "Elliott Gould"), M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg", "George C. Scott")]
      },
      1969: {
        winner: M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg", "Dustin Hoffman"),
        nominees: [
          M("Women in Love", 66027, "/uHfThxdQC99LLoe2jKZ1u3vIge2.jpg", "Alan Bates"),
          M("The Secret Life of an American Wife", 345550, "/kFNKuNrkkrHDwr4eIW58PnFJZJh.jpg", "Walter Matthau"),
          M("Inadmissible Evidence", 245786, "/BM40pAKxcpSU1IbCuUj7JpxP5l.jpg", "Nicol Williamson")
        ]
      },
      1968: {
        winner: M("Guess Who's Coming to Dinner", 1879, "/fkHeYWahNbhxhuLefaAg553lYo5.jpg", "Spencer Tracy"),
        nominees: [
          M("The Charge of the Light Brigade", 42193, "/6mh7BKo0AFjweVGnUyNTbtCK1HN.jpg", "Trevor Howard"),
          M("Oliver!", 17917, "/1XJgoaOWKrqxkKeBKWLKSigqG8c.jpg", "Ron Moody"),
          M("The Bofors Gun", 155451, "/dR6imBrrhgcHhR4pJX4ZhixWKYl.jpg", "Nicol Williamson")
        ]
      },
      1967: {
        winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg", "Paul Scofield"),
        nominees: [
          M("Accident", 74544, "/gttNRLWBDJXwOdoNCKQFgxSGUh8.jpg", "Dirk Bogarde"),
          M("The Taming of the Shrew", 25560, "/2LpU3kyg1PowiQoEHf7oUXOUmVa.jpg", "Richard Burton"),
          M("The Deadly Affair", 14755, "/Av6mrgiizvdSC1Tl9cEvazjS9S.jpg", "James Mason"),
          M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg", "Rod Steiger"),
          M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg", "Warren Beatty"),
          M("Chimes at Midnight", 986, "/5Fjxyz3u2Zdco4WeuC3wQ6O5tYQ.jpg", "Orson Welles")
        ]
      },
      1966: {
        winner: M("The Spy Who Came In from the Cold", 13580, "/lN3PWv6cW22mqXDcgGZgK1Aa2gh.jpg", "Richard Burton"),
        nominees: [
          M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg", "Michael Caine"),
          M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg", "Ralph Richardson"),
          M("Morgan: A Suitable Case for Treatment", 42724, "/xu4awPUFmrFUaX2qk12Lv4QhJSF.jpg", "David Warner"),
          M("The Pawnbroker", 20540, "/o4CT5WPqmOLF2QfodAuGT7jQNn1.jpg", "Rod Steiger"),
          M("Pierrot le Fou", 2786, "/i124H6iQB4CawrgFW9aZaZs7OBO.jpg", "Jean-Paul Belmondo"),
          M("A Patch of Blue", 33364, "/9eFULnzgoLpO7lvg6FMutGRuNFg.jpg", "Sidney Poitier")
        ]
      },
      1965: {
        winner: M("Darling", 24134, "/cBd5YO9xG7VmRuC8Q27uR3PV9mn.jpg", "Dirk Bogarde"),
        nominees: [
          M("The Hill", 24395, "/cmBpImAjHJnuHXMVByzqnxtDcae.jpg", "Harry Andrews"),
          M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg", "Rex Harrison"),
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg", "Anthony Quinn"),
          M("Cat Ballou", 11694, "/3WJmB1F5z4mLwt84i1FuIrSYEe.jpg", "Lee Marvin"),
          M("Good Neighbor Sam", 3011, "/vOyKPfJKzoVlFMWAZJSORYqynRG.jpg", "Jack Lemmon"),
          M("Ship of Fools", 30080, "/2LOe4Hu6Gxw6k76hLWhS8JVVILa.jpg", "Oskar Werner")
        ]
      },
      1964: {
        winner: M("Guns at Batasi", 64158, "/cUZvtHoqIteUAEeBrNfiR56Tw5O.jpg", "Richard Attenborough"),
        nominees: [
          M("King and Country", 96394, "/mBkHGc2whVQBGt4bxMU37DZVgTl.jpg", "Tom Courtenay"),
          M("Becket", 15421, "/swWmxVbq0pXv4wwsc2O803PiXR7.jpg", "Peter O'Toole"),
          M("Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", 935, "/6x7MzQ6BOMlRzam1StcmPO9v61g.jpg", "Peter Sellers"),
          M("Yesterday, Today and Tomorrow", 42801, "/vydCOfhrnKqMSbYcI0cUkkKuCND.jpg", "Marcello Mastroianni"),
          M("Charade", 4808, "/qqaPjC5FQidtKY65jbAKZPiOTaS.jpg", "Cary Grant"),
          M("Lilies of the Field", 38805, "/gYoVx2m8NP2hTWnEpwNeROIWrQ4.jpg", "Sidney Poitier")
        ]
      },
      1963: {
        winner: M("The Servant", 42987, "/pRa4og93BeOoMCt6oWuPCwu5Coo.jpg", "Dirk Bogarde"),
        nominees: [
          M("Billy Liar", 26535, "/8YUzVyN3HdedaK7oGVf2nVrsf4R.jpg", "Tom Courtenay"),
          M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg", "Albert Finney"),
          M("This Sporting Life", 18774, "/lOxaN1ziYdOJgAQouWO1pGEBU7H.jpg", "Richard Harris"),
          M("Divorce Italian Style", 20271, "/vZbdSpUFyFiDBBTY0AiSrN9f303.jpg", "Marcello Mastroianni"),
          M("Accattone", 12491, "/113ts2Bmm5CZ3YJMwfCU9XGFCAf.jpg", "Franco Citti"),
          M("The Day of the Triffids", 21143, "/x6LYwbOzBl606vMXZtd6apxhcaY.jpg", "Howard Keel"),
          M("Days of Wine and Roses", 32488, "/cRVl1BR3x3P2NqUv61eveJNJ0ip.jpg", "Jack Lemmon"),
          M("Hud", 24748, "/A168bF52vmAIGkC2Qafj7M2EmaE.jpg", "Paul Newman"),
          M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg", "Gregory Peck")
        ]
      },
      1962: {
        winner: M("The Loneliness of the Long Distance Runner", 16103, "/ePhZKUNyFGc8lzx0E0LiCcKs4y4.jpg", "Tom Courtenay"),
        nominees: [
          M("The Dock Brief", 41430, "/sajFMvHddZ0Y3l2yT2Wlkthvsej.jpg", "Richard Attenborough"),
          M("Lawrence of Arabia", 947, "/AiAm0EtDvyGqNpVoieRw4u65vD1.jpg", "Peter O'Toole"),
          M("Term of Trial", 84164, "/5b4vXeIzUqEPbUz92los8qUNmsE.jpg", "Laurence Olivier"),
          M("Birdman of Alcatraz", 898, "/6EODLN11HTX4l2cmakAhWIoJLF.jpg", "Burt Lancaster"),
          M("Léon Morin, Priest", 63892, "/i89R891gei0UVS8xY6ymOUPExtW.jpg", "Jean-Paul Belmondo"),
          M("Lonely are the Brave", 43002, "/g6wKfhwGPsKgPI77ZiLhL6argMQ.jpg", "Kirk Douglas"),
          M("Light in the Piazza", 45247, "/vNlaQd8MJRqIhk8a93PHJW619Db.jpg", "George Hamilton"),
          M("Advise & Consent", 17185, "/hdLQlarvUmZVtrbME6y4t6Km9ZC.jpg", "Charles Laughton"),
          M("Billy Budd", 5334, "/mdhGhduqT85qIbSgxD9VP6JvJlH.jpg", "Robert Ryan"),
          M("The Long Absence", 131836, "/tPs6Lnp0vfiQDzZELxd4uI09AYa.jpg", "Georges Wilson")
        ]
      },
      1961: {
        winner: M("No Love for Johnnie", 169618, "/ra8j4YVvHxlS5BJ5tASEeLz6ooG.jpg", "Peter Finch"),
        nominees: [
          M("Victim", 43028, "/6N1V0qW86D5jxcPyLlIJpjgNX6p.jpg", "Dirk Bogarde"),
          M("The Hustler", 990, "/snItsSViawjaadW9mlWUmGwR41R.jpg", "Paul Newman"),
          M("Judgment at Nuremberg", 821, "/b6vYatvui1EXeFYfpDX4rcbueuP.jpg", "Montgomery Clift"),
          M("Ballad of a Soldier", 46592, "/9teeqzdIgPkWsykRapYkqhdefmm.jpg", "Vladimir Ivashov"),
          M("Le Trou", 29259, "/xyZhiOz5NHVBUKlpioxjwajy7pm.jpg", "Philippe Leroy"),
          M("A Raisin in the Sun", 29478, "/fxGAJFfryAgdi4ONkVyrBWKDBbI.jpg", "Sidney Poitier"),
          M("The Best of Enemies", 67377, "/xsTBx6VLQDUQLr62v5qhr5reBXX.jpg", "Alberto Sordi")
        ]
      },
      1960: {
        winner: M("The Trials of Oscar Wilde", 172535, "/v5Kr4MvmqbBwS7a1CXFAsISmQCr.jpg", "Peter Finch"),
        nominees: [
          M("The Angry Silence", 83995, "/hXQtp9KOgqisXO73WkjiRJnh9mE.jpg", "Richard Attenborough"),
          M("Saturday Night and Sunday Morning", 37230, "/fHHKxB71EzVzny3ZakxZRGe5Evw.jpg", "Albert Finney"),
          M("Tunes of Glory", 43048, "/1Yf5ZggEMxybXGBRVdqzdHLpZ9h.jpg", "Alec Guinness"),
          M("The Entertainer", 18929, "/s549IYn0XDUlFHJpOLIrWE1uYXv.jpg", "Laurence Olivier"),
          M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg", "Jack Lemmon"),
          M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg", "Burt Lancaster"),
          M("Inherit the Wind", 1908, "/7oaHcF0gCOt2lKaT2zajhajP0Zo.jpg", "Fredric March"),
          M("Let's Make Love", 24014, "/yzBniSVhbXrGTRmyAH0k276NFzJ.jpg", "Yves Montand")
        ]
      },
      1959: {
        winner: M("I'm All Right Jack", 34783, "/4HD25hdMIcFAd0MbGCFM8t7G0sO.jpg", "Peter Sellers"),
        nominees: [
          M("Yesterday's Enemy", 94135, "/piYJtlIlOFyDjui7j6NAuywNGbe.jpg", "Stanley Baker"),
          M("Look Back in Anger", 50011, "/TCukFyvrXbIVp9KSt5Yr2HFy77.jpg", "Richard Burton"),
          M("The Nun's Story", 27029, "/4vNWFhPyjTehPpZsvTnTywwXSiF.jpg", "Peter Finch"),
          M("Expresso Bongo", 127688, "/94yVW8m4YSNwvFM2BnHjC65h6HM.jpg", "Laurence Harvey"),
          M("The Devil's Disciple", 78078, "/axagX83w2B8nhap1IC19Ih1AvmN.jpg", "Laurence Olivier"),
          M("Some Like It Hot", 239, "/hVIKyTK13AvOGv7ICmJjK44DTzp.jpg", "Jack Lemmon"),
          M("Ashes and Diamonds", 5055, "/nE8aqRvVnRQEqskiarnFhdJdk8g.jpg", "Zbigniew Cybulski"),
          M("Maigret Sets a Trap", 37454, "/71pYPAf00xoaQ5cmH7lSbWbSOwl.jpg", "Jean Desailly"),
          M("It Only Happens to the Living", 349874, "/fizBOH5LLpYywtVQ3G5tWq3A2bl.jpg", "Takashi Shimura"),
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg", "James Stewart")
        ]
      },
      1958: {
        winner: M("The Key", 102081, "/30lPhoDVPyZNQ3cjjTlsYuO4x0Z.jpg", "Trevor Howard"),
        nominees: [
          M("Sea of Sand", 30104, "/hfj1n36louQxSAN1ICsKlEzL2fv.jpg", "Michael Craig"),
          M("Room at the Top", 43103, "/uuyruoqh7oBtjwN1mJyOF04CPjO.jpg", "Laurence Harvey"),
          M("Harry Black and the Tiger", 145865, "/q6IJl18vM1aBP0vQuggDLrYe1l6.jpg", "I.S. Johar"),
          M("Ice Cold in Alex", 16284, "/lkqTxSL9JwyyXDu5yeOoj5mzsVc.jpg", "Anthony Quayle"),
          M("The Quiet American", 85514, "/67Ks7m063DsocmWmo2DyTSuFXZr.jpg", "Michael Redgrave"),
          M("The Defiant Ones", 11414, "/tGGNyImEXgedDjrCORbC9cTJp0X.jpg", "Sidney Poitier"),
          M("The Young Lions", 40739, "/7o0UhkzH01DhAP3JsMLoNPQnoqc.jpg", "Marlon Brando"),
          M("The Sheepman", 76568, "/n4TtmJvXPPOSDJmQmqZMjj9F8i2.jpg", "Glenn Ford"),
          M("The Enemy Below", 15876, "/9IUUCfrEEkq92sCLznzSAjDPusk.jpg", "Curd Jürgens"),
          M("Witness for the Prosecution", 37257, "/bCj4EfuehAlgBwVd3diyWyhuuau.jpg", "Charles Laughton"),
          M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg", "Paul Newman"),
          M("Wild Strawberries", 614, "/iyTD2QnySNMPUPE3IedZQipSWfz.jpg", "Victor Sjöström"),
          M("The Last Hurrah", 56156, "/yM0BC9XLB67494CNcKQVB43lBuG.jpg", "Spencer Tracy")
        ]
      },
      1957: {
        winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg", "Alec Guinness"),
        nominees: [
          M("Windom's Way", 268554, "/n7bm20vAZJaskQdSFHwMK24xZWY.jpg", "Peter Finch"),
          M("Manuela", 269298, "/mJbkn9kk1y3whuheOPDQzeZ4oIB.jpg", "Trevor Howard"),
          M("The Prince and the Showgirl", 24012, "/eNnzkk6OPRnx2jApJ4MnbvJFEvm.jpg", "Laurence Olivier"),
          M("Time Without Pity", 60938, "/3P6XLCD3tGtWTtktfdlGL3fnJ4t.jpg", "Michael Redgrave"),
          M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", "Henry Fonda"),
          M("Time Limit", 46580, "/cLnvLlclBTlq58JeHE22MniLtqD.jpg", "Richard Basehart"),
          M("The Gates of Paris", 67555, "/v8Uuoqv2CGCZf2BG9Li1VqQX9WI.jpg", "Pierre Brasseur"),
          M("Sweet Smell of Success", 976, "/akzvV8JasNrgEl5iAP9K6zPHGJe.jpg", "Tony Curtis"),
          M("La Traversée de Paris", 19178, "/euq3YhkXJgsDlUxid5cTInsxnqh.jpg", "Jean Gabin"),
          M("Heaven Knows, Mr. Allison", 37103, "/90jAEsc3teDWpDr5wiAmcxAjuVp.jpg", "Robert Mitchum"),
          M("Edge of the City", 35129, "/eixbelLNo7TJJf7jMgCKZB22bxq.jpg", "Sidney Poitier"),
          M("The Great Man", 121354, "/bjFqjDVqZfS69wz3tbtVQJvE2Sa.jpg", "Ed Wynn")
        ]
      },
      1956: {
        winner: M("A Town Like Alice", 88558, "/aTBNZnQVSn26DuQHdRUTW8a6Aux.jpg", "Peter Finch"),
        nominees: [
          M("The Long Arm", 50799, "/wMWQCfhYNucYrF8JlTYvzXq6L3w.jpg", "Jack Hawkins"),
          M("Reach for the Sky", 22350, "/2OKZUqjoIC71vkJ8SUR7DzvXAvw.jpg", "Kenneth More"),
          M("Gervaise", 52726, "/njux1vvBuiwR4UJ6FCpYoar9buO.jpg", "François Périer"),
          M("Smiles of a Summer Night", 11700, "/wKeV8lKz8k9DDBCw6MJ9MkhvhqF.jpg", "Gunnar Björnstrand"),
          M("Rebel Without a Cause", 221, "/yHStsC8rRRfIjqRN38BQsLh6S7k.jpg", "James Dean"),
          M("Picnic", 39940, "/aKCSA9JUp9JkztAjzODPTrtZmzC.jpg", "William Holden"),
          M("Baby Doll", 40478, "/1Wj0H6HA7xCy8kWYWOTytqwOqWk.jpg", "Karl Malden"),
          M("The Man with the Golden Arm", 541, "/3TUOhZhM5GCYIbxwFO3chpZ0DHx.jpg", "Frank Sinatra"),
          M("The Mountain", 57993, "/y3sn47VmLGbFeHGBlImPknPzj9S.jpg", "Spencer Tracy")
        ]
      },
      1955: {
        winner: M("Richard III", 43323, "/3zp2Kg5bvlFkKmWiQLmuWQAIEgG.jpg", "Laurence Olivier"),
        nominees: [
          M("The Bespoke Overcoat", 203901, "/ccxFzqcPPifOQHRdWgsKLsAxqzs.jpg", "Alfie Bass"),
          M("The Prisoner", 52857, "/gPlWKXHnBI6egwiISo3KqOUzIEP.jpg", "Alec Guinness"),
          M("The Deep Blue Sea", 193321, "/98TFnJ8GZlbBnbCZ6v8IIcdCPsP.jpg", "Kenneth More"),
          M("The Night My Number Came Up", 55380, "/xrIpXLmAHULKFSV3NB4SiNQ6DAW.jpg", "Michael Redgrave"),
          M("Marty", 15919, "/8tnGO5VoAQII4DbE3hozWKhV4BY.jpg", "Ernest Borgnine"),
          M("East of Eden", 220, "/xv1MZVIop0SQqwLUymgE5eb2LFl.jpg", "James Dean"),
          M("Mister Roberts", 37853, "/5B8Gc1N2S3CDWHBzm0VxaMPTyzJ.jpg", "Jack Lemmon"),
          M("Seven Samurai", 346, "/lOMGc8bnSwQhS4XyE1S99uH8NXf.jpg", "Toshiro Mifune"),
          M("Not as a Stranger", 76117, "/gN054EboHPbRIjVDXUrbcaQDleU.jpg", "Frank Sinatra")
        ]
      },
      1954: {
        winner: M("Doctor in the House", 68242, "/iGRDD9B0FgaWLgsjSZIHcA3ZF3N.jpg", "Kenneth More"),
        nominees: [
          M("The Purple Plain", 73907, "/n9ewv2km0KQfAWPWO3UnJoC2J4B.jpg", "Maurice Denham"),
          M("Lease of Life", 238737, "/glGqlLFiJl4srSLRtomhycrl8ge.jpg", "Robert Donat"),
          M("Hobson's Choice", 16410, "/kbP7EgoiOw2bIypai50JWRsqP7p.jpg", "John Mills"),
          M("Carrington V.C.", 43198, "/awXt1JTzcwmgtxRfkxZz2C36V4s.jpg", "David Niven"),
          M("Svengali", 4454, "/91JD8aadeKlTT6ZumetqiXwWTBY.jpg", "Donald Wolfit"),
          M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg", "Marlon Brando"),
          M("Riot in Cell Block 11", 28023, "/7Odm3v1TZuH2JogmJhvQYvCD2Gl.jpg", "Neville Brand"),
          M("The Caine Mutiny", 10178, "/vuO4Z3wOWVlhq35MS9asZeT9rVp.jpg", "José Ferrer"),
          M("Executive Suite", 43336, "/dQ5LdPOkRwlTTl3ocObuNGKB1of.jpg", "Fredric March"),
          M("The Glenn Miller Story", 17729, "/eEuwIMj7jKYaUt0ZG6aVpYxlkrC.jpg", "James Stewart")
        ]
      },
      1953: {
        winner: M("Julius Caesar", 18019, "/2nzpmJ9MIdd5TKXJd53KgKdZ6eT.jpg", "John Gielgud"),
        nominees: [
          M("The Cruel Sea", 16914, "/kmMGoeLx7rntdbqKZFp6bmT8ZCW.jpg", "Jack Hawkins"),
          M("The Heart of the Matter", 119904, "/o2N07tLPERtRa1i0ncvfEsKl14w.jpg", "Trevor Howard"),
          M("The Kidnappers", 47675, "/sVXE6qp0rI73yWxFqZTrxsTeoDR.jpg", "Duncan Macrae"),
          M("Genevieve", 43346, "/fO5PtTc7GGgxDfD6ndM009gGWhE.jpg", "Kenneth More"),
          M("Roman Holiday", 804, "/8lI9dmz1RH20FAqltkGelY1v4BE.jpg", "Eddie Albert"),
          M("Shane", 3110, "/svr5ADpjXTCOQv8hmuJnB7I14Qv.jpg", "Van Heflin"),
          M("Diary of a Country Priest", 43376, "/mft7ZJqHxUyFaLL3ZYXX1MN2Gro.jpg", "Claude Laydu"),
          M("We Are All Murderers", 199503, "/cA0zWVlOJaHBKpxfiIgCRYR10cm.jpg", "Marcel Mouloudji"),
          M("The Actress", 98364, "/ms7Ni0s6vH9ZCEUyuNIEaQOMxtI.jpg", "Spencer Tracy")
        ]
      },
      1952: {
        winner: M("The Sound Barrier", 51619, "/cExgxdISr0gEvVr74mmpEL4yLh4.jpg", "Ralph Richardson"),
        nominees: [
          M("Mandy", 47026, "/8bwWXoxCjCUDJN6hKPCtUWUzPux.jpg", "Jack Hawkins"),
          M("The Pickwick Papers", 139204, "/hyp0FiB8JUH26OZpCSH0dUBQjDq.jpg", "James Hayter"),
          M("Carrie", 43358, "/hif1GraUbvlocgqtrwYMaybsGcJ.jpg", "Laurence Olivier"),
          M("Viva Zapata!", 1810, "/vfarxn9ddiaZpRDml8FGhB46Qrc.jpg", "Marlon Brando"),
          M("The African Queen", 488, "/2Ypg0KhQfFYWILelvHGtSHHR0dk.jpg", "Humphrey Bogart"),
          M("God Needs Men", 154380, "/qniu2VVWSOL7qsieW77BmVhDnoY.jpg", "Pierre Fresnay"),
          M("Miracle in Milan", 43379, "/zMEYCBO2OBHR09aW9IwjOR3R3A5.jpg", "Francesco Golisano"),
          M("Death of a Salesman", 104394, "/xnyRkG1LMQX0NUpROq61GiKW7eJ.jpg", "Fredric March")
        ]
      }
    },

    "Best Actress": {
      2026: {
        winner: null,
        nominees: [
          M("Hamnet", 858024, "/vbeyOZm2bvBXcbgPD3v6o94epPX.jpg", "Jessie Buckley"),
          M("If I Had Legs I'd Kick You", 1160360, "/va0TQ9WprMXRqQAzY56vyqY0Yd5.jpg", "Rose Byrne"),
          M("Song Sung Blue", 1371185, "/kQzDdxI0F5z16qo2vzDoqdVMl4O.jpg", "Kate Hudson"),
          M("One Battle After Another", 1054867, "/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg", "Chase Infiniti"),
          M("Sentimental Value", 1124566, "/pz9NCWxxOk3o0W3v1Zkhawrwb4i.jpg", "Renate Reinsve"),
          M("Bugonia", 701387, "/rSdOua3wKMEaFWDcKAYWRjXQWOt.jpg", "Emma Stone")
        ]
      },
      2025: {
        winner: M("Anora", 1064213, "/cgXk2tNYhJZLXdBDO5DidAVzQ82.jpg", "Mikey Madison"),
        nominees: [
          M("Wicked", 402431, "/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg", "Cynthia Erivo"),
          M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg", "Karla Sofia Gascon"),
          M("Hard Truths", 1013154, "/eEj1TGrGc4IQ8bscFC17Ggdg6ft.jpg", "Marianne Jean-Baptiste"),
          M("The Substance", 933260, "/lqoMzCcZYEFK729d6qzt349fB4o.jpg", "Demi Moore"),
          M("The Outrun", 785542, "/zfRR2CkbvYrLuOPQFm8vBaENyMy.jpg", "Saoirse Ronan")
        ]
      },
      2024: {
        winner: M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg", "Emma Stone"),
        nominees: [
          M("The Color Purple", 558915, "/h5bqIxM8GO4TewJ0u6Rzkg58ssJ.jpg", "Fantasia Barrino"),
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg", "Sandra Huller"),
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg", "Carey Mulligan"),
          M("Rye Lane", 1049638, "/int5eEKNc8g0V5i3XYaPeaC6paD.jpg", "Vivian Oparah"),
          M("Barbie", 346698, "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", "Margot Robbie")
        ]
      },
      2023: {
        winner: M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg", "Cate Blanchett"),
        nominees: [
          M("The Woman King", 724495, "/438QXt1E3WJWb3PqNniK0tAE5c1.jpg", "Viola Davis"),
          M("Till", 854239, "/cmDs0CYlgioyP2AQQTTmavt3uoO.jpg", "Danielle Deadwyler"),
          M("The Blonde", 1117680, "/vclbphf1PcI8dKulaIg0HmHQcL3.jpg", "Ana de Armas"),
          M("Good Luck to You, Leo Grande", 758330, "/dxxOmTq4LgQxiyU4rW53qdj9FoN.jpg", "Emma Thompson"),
          M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg", "Michelle Yeoh")
        ]
      },
      2022: {
        winner: M("After Love", 714011, "/mXaNg69iWEs0Qsj4AJxcvCXuWKw.jpg", "Joanna Scanlan"),
        nominees: [
          M("House of Gucci", 644495, "/oJCQjD2byiVF1EG408F9dBn9ndU.jpg", "Lady Gaga"),
          M("Licorice Pizza", 718032, "/ivXtvzfliGvoJ1DhSHIGyYBToWe.jpg", "Alana Haim"),
          M("CODA", 776503, "/BzVjmm8l23rPsijLiNLUzuQtyd.jpg", "Emilia Jones"),
          M("The Worst Person in the World", 660120, "/1NxGNQchGBTHXJ6RShLY1IlZqWn.jpg", "Renate Reinsve"),
          M("Long Time Passing", 1279728, "/ncYZAh2F3afpTbmOnGY6PVkxpJn.jpg", "Tessa Thompson")
        ]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg", "Frances McDormand"),
        nominees: [
          M("Rocks", 575773, "/8Mg4ew6drIax6ZmeY22dxM8ujBk.jpg", "Bukky Bakray"),
          M("The Forty-Year-Old Version", 620897, "/ilMExVn5xyfIWAnqngqAB0OFsE5.jpg", "Radha Blank"),
          M("Pieces of a Woman", 641662, "/OgUfLlhfBFx5BPK6LzBWFvBW1w.jpg", "Vanessa Kirby"),
          M("His House", 575774, "/mM1ELeOF4qmdIFbZh9VSBn685g.jpg", "Wunmi Mosaku"),
          M("Clemency", 565307, "/uQgi5hq29saWiG4DbmQfz2EEnKI.jpg", "Alfre Woodard")
        ]
      },
      2020: {
        winner: M("Judy", 491283, "/iqJhHjD6k6T07waELjMKDpQJUP.jpg", "Renee Zellweger"),
        nominees: [
          M("Wild Rose", 482981, "/79THplH9WM7y3gRPYM4dcC0IRPw.jpg", "Jessie Buckley"),
          M("Marriage Story", 492188, "/2JRyCKaRKyJAVpsIHeLvPw5nHmw.jpg", "Scarlett Johansson"),
          M("Little Women", 331482, "/yn5ihODtZ7ofn8pDYfxCmxh8AXI.jpg", "Saoirse Ronan"),
          M("Bombshell", 525661, "/gbPfvwBqbiHpQkYZQvVwB6MVauV.jpg", "Charlize Theron")
        ]
      },
      2019: {
        winner: M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg", "Olivia Colman"),
        nominees: [
          M("The Wife", 340613, "/d4Qyuy0Ul549f6SOdUqGvIdYKD2.jpg", "Glenn Close"),
          M("Widows", 401469, "/d31SGJSaX29ba5ZUbZcesGoDE7I.jpg", "Viola Davis"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg", "Lady Gaga"),
          M("Can You Ever Forgive Me?", 401847, "/y9pDvBdvU8Z5QjQ6Y4oF0Cq7p5j.jpg", "Melissa McCarthy")
        ]
      },
      2018: {
        winner: M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg", "Frances McDormand"),
        nominees: [
          M("Film Stars Don't Die in Liverpool", 398174, "/87oy4bxwkhmb4Jb3MRvosvd9NOX.jpg", "Annette Bening"),
          M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg", "Sally Hawkins"),
          M("I, Tonya", 389015, "/6gNXwSHxaksR1PjVZRqNapmkgj3.jpg", "Margot Robbie"),
          M("Lady Bird", 391713, "/gl66K7zRdtNYGrxyS2YDUP5ASZd.jpg", "Saoirse Ronan")
        ]
      },
      2017: {
        winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", "Emma Stone"),
        nominees: [
          M("Arrival", 329865, "/6WzElgkLjIWuWn3Nwu66s5J26tx.jpg", "Amy Adams"),
          M("The Girl on the Train", 346685, "/AhTO2QWG0tug7yDoh0XoaMhPt3J.jpg", "Emily Blunt"),
          M("Jackie", 376866, "/nF9N33PfhizMEzbfxHoxXBo2vx9.jpg", "Natalie Portman"),
          M("Florence Foster Jenkins", 315664, "/c4cV732zTZ5pwtLh1OXQZ4LIgcu.jpg", "Meryl Streep")
        ]
      },
      2016: {
        winner: M("Room", 264644, "/2hHDMeYyZjbGWn0BeNH1cTMxuM7.jpg", "Brie Larson"),
        nominees: [
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg", "Cate Blanchett"),
          M("Brooklyn", 291678, "/eqVRQcGhl1CRRjjct78tRR2SPrk.jpg", "Saoirse Ronan"),
          M("The Lady in the Van", 328589, "/sqz4CGInI1bysFH674HYWtQSmYn.jpg", "Maggie Smith"),
          M("The Danish Girl", 306819, "/mXZZIacI5FC8thzSC0lgQBQ2uAX.jpg", "Alicia Vikander")
        ]
      },
      2015: {
        winner: M("Still Alice", 284293, "/yY6ypZPQl67J4RwOA6YBALNS3Wj.jpg", "Julianne Moore"),
        nominees: [
          M("Big Eyes", 87093, "/203HAjJcLMl7xThcTqZx4zmEGcV.jpg", "Amy Adams"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg", "Felicity Jones"),
          M("Gone Girl", 210577, "/ts996lKsxvjkO2yiYG0ht4qAicO.jpg", "Rosamund Pike"),
          M("Wild", 228970, "/ohhWI4Xwf4m4HjbQiIkyAhLekUy.jpg", "Reese Witherspoon")
        ]
      },
      2014: {
        winner: M("Blue Jasmine", 160588, "/nsj0RLRI10351uYMoAKPur6Derd.jpg", "Cate Blanchett"),
        nominees: [
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg", "Amy Adams"),
          M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg", "Sandra Bullock"),
          M("Philomena", 205220, "/eBUv2GmGdXmCk1AaSOmyiu70hN8.jpg", "Judi Dench"),
          M("Saving Mr. Banks", 140823, "/4RkcUe5PKnYvrCwMjk8giUAoID7.jpg", "Emma Thompson")
        ]
      },
      2013: {
        winner: M("Amour", 86837, "/19hyCudualHxCD0GrEngqsi0wBF.jpg", "Emmanuelle Riva"),
        nominees: [
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg", "Jessica Chastain"),
          M("Rust and Bone", 97365, "/6bcerd7CeQ5y5Dilym1O2C8c8Gl.jpg", "Marion Cotillard"),
          M("Silver Linings Playbook", 82693, "/fhHB1uvfFKKFbj6bTKE8xdtsjKi.jpg", "Jennifer Lawrence"),
          M("Hitchcock", 112336, "/zlG4QzB00VM6QHUmRkKaboCOgat.jpg", "Helen Mirren")
        ]
      },
      2012: {
        winner: M("The Iron Lady", 71688, "/fx7wpKXOht7WOkeOslvErbrf69Q.jpg", "Meryl Streep"),
        nominees: [
          M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg", "Berenice Bejo"),
          M("The Help", 50014, "/3kmfoWWEc9Vtyuaf9v5VipRgdjx.jpg", "Viola Davis"),
          M("We Need to Talk About Kevin", 71859, "/auAmiRmbBQ5QIYGpWgcGBoBQY3b.jpg", "Tilda Swinton"),
          M("My Week with Marilyn", 75900, "/5naqXRY1Zug5cyJJbO9H4DOg28q.jpg", "Michelle Williams")
        ]
      },
      2011: {
        winner: M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg", "Natalie Portman"),
        nominees: [
          M("The Kids Are All Right", 39781, "/xQ5XqZc82dDCcGjxY7voRKjhaKQ.jpg", "Annette Bening"),
          M("The Girl with the Dragon Tattoo", 65754, "/8bokS83zGdhaXgN9tjidUKmAftW.jpg", "Noomi Rapace"),
          M("True Grit", 44264, "/tCrB8pcjadZjsDk7rleGJaIv78k.jpg", "Hailee Steinfeld")
        ]
      },
      2010: {
        winner: M("An Education", 24684, "/gLIvvUdlocGjm8XVLxhWHAKWrRq.jpg", "Carey Mulligan"),
        nominees: [
          M("The Lovely Bones", 7980, "/sn0iDphRxQ7I6aLd9igIgACITak.jpg", "Saoirse Ronan"),
          M("Precious", 25793, "/d4ltLIDbvZskSwbzXqi0Hfv5ma4.jpg", "Gabourey Sidibe"),
          M("Julie & Julia", 24803, "/1QZNWOOwfRi86ZApGvr2TtJZPBK.jpg", "Meryl Streep"),
          M("Coco Before Chanel", 11156, "/nNpP1P2EufA6TN7fQOBeHUIVmeH.jpg", "Audrey Tautou")
        ]
      },
      2009: {
        winner: M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg", "Kate Winslet"),
        nominees: [
          M("Changeling", 3580, "/y9Qi39dL3PceGCH8afyC7QrhbhI.jpg", "Angelina Jolie"),
          M("I've Loved You So Long", 8276, "/14i0SnmWzgejS4ZRcBbzkvXD6dp.jpg", "Kristin Scott Thomas"),
          M("Doubt", 14359, "/9lypT2ghNuUPYVJf66oe4fKvUqI.jpg", "Meryl Streep"),
          M("Revolutionary Road", 4148, "/cvkD3yiVXLg3as8EAG3LaTycONQ.jpg", "Kate Winslet")
        ]
      },
      2008: {
        winner: M("La Vie en Rose", 1407, "/3b9DAONAsFRhJKu25R33PE3VwDh.jpg", "Marion Cotillard"),
        nominees: [
          M("Elizabeth: The Golden Age", 4517, "/oBQ64TyPEINgVpwKWriv3QsIDJb.jpg", "Cate Blanchett"),
          M("Away from Her", 1919, "/oyPE6i9sylR1UhTPFmniOHcQpKb.jpg", "Julie Christie"),
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg", "Keira Knightley"),
          M("Juno", 7326, "/jNIn2tVhpvFD6P9IojldI3mNYcn.jpg", "Ellen Page")
        ]
      },
      2007: {
        winner: M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg", "Helen Mirren"),
        nominees: [
          M("Volver", 219, "/m1ZUDGTFtVGE3zjTvF8OiQ9um5e.jpg", "Penelope Cruz"),
          M("Notes on a Scandal", 1259, "/ieX6ZO2Kf2qjoIBXbQW5awivbhY.jpg", "Judi Dench"),
          M("The Devil Wears Prada", 350, "/8912AsVuS7Sj915apArUFbv6F9L.jpg", "Meryl Streep"),
          M("Little Children", 1440, "/l2wTSP0Ifo9vY03nJEfkFBbT2S9.jpg", "Kate Winslet")
        ]
      },
      2006: {
        winner: M("Walk the Line", 69, "/p8lPTjvjOjTfvC1E9pmMwcF9vkn.jpg", "Reese Witherspoon"),
        nominees: [
          M("Mrs. Henderson Presents", 10773, "/rFmx0ajncGacM8Ono9vpXiHt7Vy.jpg", "Judi Dench"),
          M("North Country", 9701, "/upxUN4zmX79o49mBW9htKZDeNq7.jpg", "Charlize Theron"),
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg", "Rachel Weisz"),
          M("Memoirs of a Geisha", 1904, "/pBwYsQaSTgnPphIy02DJjCF2cqs.jpg", "Zhang Ziyi")
        ]
      },
      2005: {
        winner: M("Vera Drake", 11109, "/556fElboCLlEmP8UULaYosU45Bc.jpg", "Imelda Staunton"),
        nominees: [
          M("Monster", 262702, "/8VJouCYve9GcZ67xAk6nM9Lh8DO.jpg", "Charlize Theron"),
          M("Eternal Sunshine of the Spotless Mind", 38, "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", "Kate Winslet"),
          M("House of Flying Daggers", 9550, "/93feGsGiCtG5ymrRcErUgBsdo6v.jpg", "Zhang Ziyi"),
          M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg", "Scarlett Johansson")
        ]
      },
      2004: {
        winner: M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg", "Scarlett Johansson"),
        nominees: [
          M("Girl with a Pearl Earring", 3635, "/41DkOi1MvTgTQXt5BevVSzo94kk.jpg", "Scarlett Johansson"),
          M("The Mother", 59210, "/orz4yFTLaovOvEn458e4kVd3spQ.jpg", "Anne Reid"),
          M("Kill Bill: Vol. 1", 24, "/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg", "Uma Thurman"),
          M("21 Grams", 470, "/wZ0l6or5juuVWqDkLEgaghs4f9l.jpg", "Naomi Watts")
        ]
      },
      2003: {
        winner: M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg", "Nicole Kidman"),
        nominees: [
          M("Monster's Ball", 1365, "/rQeufx98gKH4CCeVw57KT1Fd0gr.jpg", "Halle Berry"),
          M("Frida", 1360, "/a4hgR6aKoohB6MHni171jbi9BkU.jpg", "Salma Hayek"),
          M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg", "Renee Zellweger")
        ]
      },
      2002: {
        winner: M("Iris", 11889, "/pqtVPrv3xPLTUayC0bPruRjYWDF.jpg", "Judi Dench"),
        nominees: [
          M("The Others", 1933, "/p8g1vlTvpM6nr2hMMiZ1fUlKF0D.jpg", "Nicole Kidman"),
          M("In the Bedroom", 1999, "/IQj11YbraLDyPYaz79jtDoAscc.jpg", "Sissy Spacek"),
          M("Amélie", 194, "/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg", "Audrey Tautou"),
          M("Bridget Jones's Diary", 634, "/dkauRl9TosBFikftrC3OVcKWDoz.jpg", "Renee Zellweger")
        ]
      },
      2001: {
        winner: M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg", "Julia Roberts"),
        nominees: [
          M("Chocolat", 41951, "/qoFmpeLPaj3YC1DABs5QxC31aQ7.jpg", "Juliette Binoche"),
          M("Almost Famous", 786, "/3rrkyLYbgLj84AYvjhdcJot4JPx.jpg", "Kate Hudson"),
          M("Boys Don't Cry", 226, "/eB505ycEhFVfMwGglIzXNUyKAIs.jpg", "Hilary Swank"),
          M("Crouching Tiger, Hidden Dragon", 146, "/iNDVBFNz4XyYzM9Lwip6atSTFqf.jpg", "Michelle Yeoh")
        ]
      },
      2000: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Annette Bening"),
        nominees: [
          M("East/West", 28463, "/c1Uf4HC5WEcssVoOm48Bfzn7Wmk.jpg", "Linda Bassett"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Julianne Moore"),
          M("Angela's Ashes", 10397, "/3Zzcys11nAPP14sKW9l97fIHhkK.jpg", "Emily Watson")
        ]
      },
      1999: {
        winner: M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg", "Cate Blanchett"),
        nominees: [
          M("Little Voice", 8545, "/7VxdMxSa3BEAvGl5nLvsgpBwrZH.jpg", "Jane Horrocks"),
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg", "Gwyneth Paltrow"),
          M("Hilary and Jackie", 46992, "/aE2NJH2sllQTmbpN6laKuM7NXYy.jpg", "Emily Watson")
        ]
      },
      1998: {
        winner: M("Mrs Brown", 17589, "/zFLaeGWglaWfdLiUNcvmUeg0KRJ.jpg", "Judi Dench"),
        nominees: [
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg", "Kim Basinger"),
          M("The Wings of the Dove", 45609, "/eb1ZnIEC8LMmMgwD2fIAmQOkcd.jpg", "Helena Bonham Carter"),
          M("Nil by Mouth", 21252, "/u0Zl9uF0LV37X6oKECLT6rU7TsI.jpg", "Kathy Burke")
        ]
      },
      1997: {
        winner: M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg", "Brenda Blethyn"),
        nominees: [
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", "Frances McDormand"),
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg", "Kristin Scott Thomas"),
          M("Breaking the Waves", 145, "/dQWMcdHXUOSHtr7ypOCa5T79JMS.jpg", "Emily Watson")
        ]
      },
      1996: {
        winner: M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg", "Emma Thompson"),
        nominees: [
          M("To Die For", 577, "/whz4bwvqE1OmQHIyqHdZD8jU9CO.jpg", "Nicole Kidman"),
          M("The Madness of King George", 11318, "/1dTSY023ZyBbgVSKDRuA6JLGSnZ.jpg", "Helen Mirren"),
          M("Leaving Las Vegas", 451, "/wTrFpGe3U65kXTldIUxuM2hmOAK.jpg", "Elisabeth Shue")
        ]
      },
      1995: {
        winner: M("The Client", 10731, "/oLdkJ4ZjxPtFSUChdjDQvHM9l75.jpg", "Susan Sarandon"),
        nominees: [
          M("The Last Seduction", 25284, "/kK8IiJDkz2Tv6DwaK60vJVHKH85.jpg", "Linda Fiorentino"),
          M("Three Colors: Red", 110, "/JHmsBiX1tjCKqAul1lzC20WcAW.jpg", "Irene Jacob"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", "Uma Thurman")
        ]
      },
      1994: {
        winner: M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg", "Holly Hunter"),
        nominees: [
          M("Tom & Viv", 46797, "/iw4ofGbX2AbJ4p17CixwnMjuoJ0.jpg", "Miranda Richardson"),
          M("Orlando", 9300, "/otSCGdKzEeVgbfNl0YslOpRZHgk.jpg", "Tilda Swinton"),
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg", "Debra Winger")
        ]
      },
      1993: {
        winner: M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg", "Emma Thompson"),
        nominees: [
          M("Husbands and Wives", 28384, "/mb6Hmns0PP2Me9TYpLE9M3GHt7v.jpg", "Judy Davis"),
          M("Strictly Ballroom", 10409, "/f6vs4DQGuNpLuA5Z7k69uuKpbVG.jpg", "Tara Morice"),
          M("Fried Green Tomatoes", 1633, "/g71l1vbJwyAAYk8zKCkIQQ58qcb.jpg", "Jessica Tandy")
        ]
      },
      1992: {
        winner: M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", "Jodie Foster"),
        nominees: [M("Thelma & Louise", 1541, "/gQSUVGR80RVHxJywtwXm2qa1ebi.jpg", "Geena Davis"), M("Truly Madly Deeply", 18317, "/jjLEXLTXfJPYtl31knRS8bjclf0.jpg", "Juliet Stevenson")]
      },
      1991: {
        winner: M("Driving Miss Daisy", 289450, "/lE1UzoV7gZhmqhw1qTiyyichPgh.jpg", "Jessica Tandy"),
        nominees: [
          M("Postcards from the Edge", 22414, "/uF7bO5UcenRgag0jpbVvKsGyfBK.jpg", "Shirley MacLaine"),
          M("The Fabulous Baker Boys", 10875, "/1nS8AxnoYE2Y1ANMpVKZnm8iLxP.jpg", "Michelle Pfeiffer"),
          M("Pretty Woman", 360731, "/dvcarc7TMrRp1C3jXPpn7PKce99.jpg", "Julia Roberts")
        ]
      },
      1990: {
        winner: M("Shirley Valentine", 18683, "/rrRrHNhur1DTp1KOp0YfFWvymQD.jpg", "Pauline Collins"),
        nominees: [
          M("Dangerous Liaisons", 859, "/eNvJXuTQ7lusuUrIvS7wplORXBX.jpg", "Glenn Close"),
          M("The Accused", 10868, "/5DlWHYb5Q65GaHYHDo6PqGOuoF1.jpg", "Jodie Foster"),
          M("Working Girl", 3525, "/q2jfFzZvAzjTaArQR0tjilIZ5aJ.jpg", "Melanie Griffith")
        ]
      },
      1989: {
        winner: M("The Lonely Passion of Judith Hearne", 35841, "/g8Nv1flxRFzjhSywUVApHKWeAMV.jpg", "Maggie Smith"),
        nominees: [
          M("Babette's Feast", 11832, "/3ibptSbnAHd0SUBnOKapNZQBpCl.jpg", "Stephane Audran"),
          M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg", "Cher"),
          M("A Fish Called Wanda", 623, "/hkSGFNVfEEUXFCxRZDITFHVhUlu.jpg", "Jamie Lee Curtis")
        ]
      },
      1988: {
        winner: M("84 Charing Cross Road", 15677, "/sbImaHsRP9TpCNIi4xMizaphZhk.jpg", "Anne Bancroft"),
        nominees: [
          M("Wish You Were Here", 46976, "/cULL2vpyXLK6F3CAsO3h5nCzNQV.jpg", "Emily Lloyd"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg", "Sarah Miles"),
          M("Personal Services", 44201, "/q7opjmMn5uVfvQjKObc7VbHnKyU.jpg", "Julie Walters")
        ]
      },
      1987: {
        winner: M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg", "Maggie Smith"),
        nominees: [
          M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg", "Mia Farrow"),
          M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg", "Meryl Streep"),
          M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg", "Cathy Tyson")
        ]
      },
      1986: {
        winner: M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg", "Peggy Ashcroft"),
        nominees: [
          M("The Purple Rose of Cairo", 10849, "/ccsint43E44B7NGceEhVimD93Yt.jpg", "Mia Farrow"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg", "Kelly McGillis"),
          M("Letter to Brezhnev", 60363, "/1N5A2OdF4GUGu094wBdbqmruoc4.jpg", "Alexandra Pigg")
        ]
      },
      1985: {
        winner: M("A Private Function", 57565, "/8OC2OqimnYqB8d9S38MdQS2DkeQ.jpg", "Maggie Smith"),
        nominees: [
          M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg", "Shirley MacLaine"),
          M("Caligula", 9453, "/vNXAY6r9Pb6WkMCGmNeW2PlznLQ.jpg", "Helen Mirren"),
          M("Silkwood", 12502, "/7Piz5R5dB6d7v1OWNaIn9GB4qZg.jpg", "Meryl Streep")
        ]
      },
      1984: {
        winner: M("Educating Rita", 38291, "/xwxgiRzw2zxzWNIYp98faJ0rUy5.jpg", "Julie Walters"),
        nominees: [
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg", "Jessica Lange"),
          M("Another Time, Another Place", 73069, "/anoPMnxdrL4B7EMZZA5tQCmod65.jpg", "Phyllis Logan"),
          M("Sophie's Choice", 15764, "/rZDPbPTFwuKgr5b9jixGFNYkGYt.jpg", "Meryl Streep")
        ]
      },
      1983: {
        winner: M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg", "Katharine Hepburn"),
        nominees: [
          M("Red Spell Spells Red", 104633, "/xs64vfJLAYut0gy99224Gdlelv6.jpg", "Diane Keaton"),
          M("36 Chowringhee Lane", 90835, "/3NjIy9V58jUR1lgQO2HuUKoCVbC.jpg", "Jennifer Kendal"),
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg", "Sissy Spacek")
        ]
      },
      1982: {
        winner: M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg", "Meryl Streep"),
        nominees: [
          M("Ordinary People", 16619, "/tJVETEDAKgD3fEh88SHOvMvOQue.jpg", "Mary Tyler Moore"),
          M("Quartet", 419886, "", "Maggie Smith"),
          M("Coal Miner's Daughter", 16769, "/bzHFDAdUad4QcHPi2UOqvaQKNWA.jpg", "Sissy Spacek")
        ]
      },
      1981: {
        winner: M("My Brilliant Career", 16659, "/s89ZolmE0tD5stOJhy6Jh4V3txZ.jpg", "Judy Davis"),
        nominees: [
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg", "Shirley MacLaine"),
          M("The Knight of the Rose", 783829, "/lWvzJa4HQ9jJ7o8cnzPKET4uq2l.jpg", "Bette Midler"),
          M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg", "Meryl Streep")
        ]
      },
      1980: {
        winner: M("The China Syndrome", 988, "/uHwwQIlt4XwpTFhX9ZT1A8xSW7F.jpg", "Jane Fonda"),
        nominees: [
          M("Manhattan", 696, "/k4eT3EvfxW1L9Wmt04UqJqCvCR6.jpg", "Diane Keaton"),
          M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg", "Meryl Streep"),
          M("Alien", 348, "/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg", "Sigourney Weaver")
        ]
      },
      1979: {
        winner: M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg", "Jane Fonda"),
        nominees: [
          M("The Turning Point", 61095, "/oAQOQEev0CS4HNeKQ8S8FcjtTpK.jpg", "Anne Bancroft"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg", "Jill Clayburgh"),
          M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg", "Marsha Mason")
        ]
      },
      1978: {
        winner: M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg", "Diane Keaton"),
        nominees: [
          M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg", "Faye Dunaway"),
          M("3 Women", 41662, "/uL5Yg8MEgHGXymTaJBYXn9g0xsH.jpg", "Shelley Duvall"),
          M("The Late Show", 42228, "/qii8jbAjid9MzBx7tUJf7URf8LO.jpg", "Lily Tomlin")
        ]
      },
      1977: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg", "Louise Fletcher"),
        nominees: [
          M("The Shootist", 12584, "/gb1oj3xUJUeH9oyZNH6WKCo9lM.jpg", "Lauren Bacall"),
          M("The Ritz", 63848, "/h5z2AvjDFVMJmGN2EE4vS7tSw1C.jpg", "Rita Moreno"),
          M("The Face Behind the Mask", 98422, "/kzi87Anaco4JvPqVmPtZnqTqycT.jpg", "Liv Ullmann")
        ]
      },
      1976: {
        winner: M("Alice Doesn't Live Here Anymore", 16153, "/A99yzz1W3NCG6zR2HXSwn2kWlse.jpg", "Ellen Burstyn"),
        nominees: [
          M("The Prisoner of Second Avenue", 19221, "/5UjoKjMQt7oE5PcKanfLLFwvAUL.jpg", "Anne Bancroft"),
          M("Lenny", 1270108, "/3DpGqD1fBRUIyYl4YCyLfD1AfNQ.jpg", "Valerie Perrine"),
          M("Scenes from a Marriage", 133919, "/ArKEdvJesIktFX8OAhcdKAOLl6I.jpg", "Liv Ullmann")
        ]
      },
      1975: {
        winner: M("Summer Wishes, Winter Dreams", 92311, "/iphqHtyVjeuuzYjRUM0DBezYPY1.jpg", "Joanne Woodward"),
        nominees: [
          M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg", "Faye Dunaway"),
          M("The Way We Were", 10236, "/o5x563ze56iI4iNsCBxTnDkt28i.jpg", "Barbra Streisand"),
          M("The Autobiography of Miss Jane Pittman", 57868, "/x0Zg9uJGA2CgYGReA4fE1NU6Inj.jpg", "Cicely Tyson")
        ]
      },
      1974: {
        winner: M("The Discreet Charm of the Bourgeoisie", 4593, "/zN4ILX2x64PvT2jIOAHXxCOi5WA.jpg", "Stephane Audran"),
        nominees: [
          M("Don't Look Now", 931, "/ivWsU3QtcstImCTOjItsH0SAbNn.jpg", "Julie Christie"),
          M("A Touch of Class", 42458, "/iEjIwaaXlg8fK7uyNdQU2ityj8v.jpg", "Glenda Jackson"),
          M("Lady Sings the Blues", 23148, "/jr528gGK1RrOW6YAZHUj5lF9RrO.jpg", "Diana Ross")
        ]
      },
      1973: {
        winner: M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg", "Liza Minnelli"),
        nominees: [
          M("The Legend of Blood Castle", 87125, "/xmIaXANSEjd3y8j7TDNco51El15.jpg", "Stephane Audran"),
          M("Young Winston", 66775, "/lBrw76I5NSsHwS8IcPPCe49JjqC.jpg", "Anne Bancroft"),
          M("Savage Messiah", 58257, "/8SvzigYJY7iy4DGlrnOHfU2FZkY.jpg", "Dorothy Tutin")
        ]
      },
      1972: {
        winner: M("Sunday Bloody Sunday", 45938, "/7q1h3M1vDlsHDKRhoPOzKjmFCVq.jpg", "Glenda Jackson"),
        nominees: [
          M("The Gendarme Takes Off", 11913, "/8vyd7FSnU1LOb1CpLI20KnZZjJX.jpg", "Lynn Carlin"),
          M("The Go-Between", 36194, "/61dXOIpDaiWCp7aIjBYkd6ujdXZ.jpg", "Julie Christie"),
          M("Klute", 466, "/tVyINAsNGSgD1OIstqwCcs7wyGH.jpg", "Jane Fonda")
        ]
      },
      1971: {
        winner: M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg", "Katharine Ross"),
        nominees: [
          M("They Shoot Horses, Don't They?", 28145, "/7wVLBgriOQpT5RrufAFCdCSUp7M.jpg", "Jane Fonda"),
          M("Cactus Flower", 28289, "/oabi6jdkxP3KHMNywKn6nQeDzQZ.jpg", "Goldie Hawn"),
          M("Ryan's Daughter", 38953, "/g5NAbtEK5bEAkBdXq6YM7a7tkZO.jpg", "Sarah Miles")
        ]
      },
      1970: {
        winner: M("The Prime of Miss Jean Brodie", 5179, "/lEZdKL17yneFK4dbbWPKcbkRbqM.jpg", "Maggie Smith"),
        nominees: [
          M("Secret Ceremony", 71395, "/ezkV9lbSwbA76qomzhBNpGEHrkI.jpg", "Mia Farrow"),
          M("Women in Love", 66027, "/uHfThxdQC99LLoe2jKZ1u3vIge2.jpg", "Glenda Jackson"),
          M("A Funny Girl", 377068, "/d1zdZm1qmxDTtTeC9z9CCZJMGou.jpg", "Barbra Streisand")
        ]
      },
      1969: {
        winner: M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg", "Katharine Hepburn"),
        nominees: [
          M("The Graduate", 37247, "/z1Z1tZMR66RxcNeHbwoEhYeqOlP.jpg", "Anne Bancroft"),
          M("Belle de Jour", 649, "/iUAFECovwPA0cVV9bo4uNGLJSGL.jpg", "Catherine Deneuve"),
          M("Rachel, Rachel", 42635, "/67flKS1FKxIiYUjXPqRc39hb9LX.jpg", "Joanne Woodward")
        ]
      },
      1968: {
        winner: M("The Whisperers", 70635, "/8T9P7cm3F9stR2J3OtrkK4LNq0e.jpg", "Edith Evans"),
        nominees: [
          M("The Drummer and the Bloke", 1113976, "/7DxqRlbeTgigrR4jw3YQr8d2mXv.jpg", "Peggy Ashcroft"),
          M("The Taming of the Shrew", 25560, "/2LpU3kyg1PowiQoEHf7oUXOUmVa.jpg", "Elizabeth Taylor"),
          M("A Man and a Woman", 42726, "/boDZQiubhyhksN8fcgM4sXZ2btW.jpg", "Anouk Aimee"),
          M("Sardinia Kidnapped", 261004, "/5xcMLn03Acp5qGVQBA34AdtBLpz.jpg", "Bibi Andersson"),
          M("Barefoot in the Park", 17887, "/rYRorEvNI7fBHiFui1qEinuSYbC.jpg", "Jane Fonda"),
          M("The Deadly Affair", 14755, "/Av6mrgiizvdSC1Tl9cEvazjS9S.jpg", "Simone Signoret")
        ]
      },
      1967: {
        winner: M("Who's Afraid of Virginia Woolf?", 396, "/wF7ihB5V5gSm6zxjv3ZhHOpgREI.jpg", "Elizabeth Taylor"),
        nominees: [
          M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg", "Julie Christie"),
          M("Georgy Girl", 42719, "/2v6ezHOqJM2HpSHiGWqLj0Mqs78.jpg", "Lynn Redgrave"),
          M("Morgan: A Suitable Case for Treatment", 42724, "/xu4awPUFmrFUaX2qk12Lv4QhJSF.jpg", "Vanessa Redgrave"),
          M("Viva Maria!", 11799, "/hAArxvmVALRNf7fmWdzT7dVFz8k.jpg", "Jeanne Moreau"),
          M("Netsilik Eskimos, IV: Group Hunting on the Spring Ice", 245181, "", "Joan Hackett"),
          M("The Sleeping Car Murders", 4311, "/msJGRCLe3WV3geKQ0suhVAlms97.jpg", "Simone Signoret")
        ]
      },
      1966: {
        winner: M("Darling", 24134, "/cBd5YO9xG7VmRuC8Q27uR3PV9mn.jpg", "Julie Christie"),
        nominees: [
          M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg", "Julie Andrews"),
          M("Young Cassidy", 130474, "/tHEiiXdVeZbks3AIFHXKvbT86Yy.jpg", "Maggie Smith"),
          M("The Knack... and How to Get It", 42744, "/xO2dJcCISY6lujaU4Qew3RzSErJ.jpg", "Rita Tushingham"),
          M("In Harm's Way", 442472, "/9ZschL35rcyiWkW9sbdt31QV83D.jpg", "Patricia Neal"),
          M("Cat Ballou", 11694, "/3WJmB1F5z4mLwt84i1FuIrSYEe.jpg", "Jane Fonda"),
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg", "Lila Kedrova"),
          M("Ship of Fools", 30080, "/2LOe4Hu6Gxw6k76hLWhS8JVVILa.jpg", "Simone Signoret")
        ]
      },
      1965: {
        winner: M("Charade", 4808, "/qqaPjC5FQidtKY65jbAKZPiOTaS.jpg", "Audrey Hepburn"),
        nominees: [
          M("The Chalk Garden", 66022, "/IXGqj9MoPFbaoBcUkUZf97XHlx.jpg", "Edith Evans"),
          M("Girl with Green Eyes", 64811, "/ntuLUDK48OQMQgBpakOfQtpM70e.jpg", "Rita Tushingham"),
          M("The Pumpkin Eater", 69557, "/5llEDfwte6SnAd2grP065N95yeo.jpg", "Anne Bancroft"),
          M("The Night of the Iguana", 14703, "/3HY8MSeoj4s0uSWGW135Jlh7eSI.jpg", "Ava Gardner"),
          M("Irma la Douce", 2690, "/5TgL8ql6WwXWmX4EvBL4geJ7gx5.jpg", "Shirley MacLaine"),
          M("Seance on a Wet Afternoon", 3092, "/dHu7nuNwXTXoPdpNOEPKhHfCBk5.jpg", "Kim Stanley")
        ]
      },
      1964: {
        winner: M("This Sporting Life", 18774, "/lOxaN1ziYdOJgAQouWO1pGEBU7H.jpg", "Rachel Roberts"),
        nominees: [
          M("Billy Liar", 26535, "/8YUzVyN3HdedaK7oGVf2nVrsf4R.jpg", "Julie Christie"),
          M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg", "Edith Evans"),
          M("The Servant", 42987, "/pRa4og93BeOoMCt6oWuPCwu5Coo.jpg", "Sarah Miles"),
          M("The Last Voyage of Henry Hudson", 1101931, "/mho3sqAjdIGXaPxKXSTz9lZqeaw.jpg", "Patricia Neal"),
          M("What Ever Happened to Baby Jane?", 10242, "/msGYzyWwtjAaA3DScdgmvJ5MReG.jpg", "Joan Crawford"),
          M("Days of Wine and Roses", 365499, "/3HMOR6HZv9yaT4p7wD4q404pEJL.jpg", "Lee Remick"),
          M("Divorce Italian Style", 20271, "/vZbdSpUFyFiDBBTY0AiSrN9f303.jpg", "Daniela Rocca")
        ]
      },
      1963: {
        winner: M("The L-Shaped Room", 76000, "/ie8EArW3CjO2gLMYtJEMLU4CAQN.jpg", "Leslie Caron"),
        nominees: [
          M("The Wild and the Willing", 257181, "/1J6uoWf2fq22HFyyh29gOt9vH6s.jpg", "Virginia Maskell"),
          M("Life for Ruth", 173937, "/7NXbrYsfbCF91LYG8QjuRCT18Ye.jpg", "Janet Munro"),
          M("The Miracle Worker", 1162, "/3dI6UVM5W1sz3MU9gNK5nVDcAyQ.jpg", "Anne Bancroft"),
          M("Salman Rushdie: Through a Glass Darkly", 1279938, "/aOa96kjtIuaIaOk1UEIYB25BfLj.jpg", "Harriet Andersson"),
          M("Lola", 40641, "/uVLkdkTVV10fLrTPyOCBE6alwLD.jpg", "Anouk Aimee"),
          M("Phaedra", 48110, "/xHlKqqqrHbkdZ0iaRCbDVbcehLH.jpg", "Melina Mercouri"),
          M("Jules and Jim", 1628, "/kuFjZlcZhQFDtIjuI3GQJjsQG03.jpg", "Jeanne Moreau"),
          M("Sweet Bird of Youth", 33632, "/uA9tl4o8P1hNB3lDBhHKHcNGdtr.jpg", "Geraldine Page"),
          M("Splendor in the Grass", 28569, "/n6Kw8Ui93SMhrk1MupCFwUg04vq.jpg", "Natalie Wood")
        ]
      },
      1962: {
        winner: M("A Taste of Honey", 25062, "/5psrZNVZ9E6Eck7OtpO47A8zTbQ.jpg", "Dora Bryan"),
        nominees: [
          M("The Sundowners", 43047, "/yGXxKdR3sttc0Gu927wMETZH3al.jpg", "Deborah Kerr"),
          M("Whistle Down the Wind", 34282, "/2Q8wpOJCmhE9B03HoifIcvrPzXz.jpg", "Hayley Mills"),
          M("What Price Love", 1339396, "/omiVPsjyTY1IDPWAdc9lVPAsZ3D.jpg", "Sophia Loren"),
          M("Rocco and His Brothers", 8422, "/pngL8AraChIDOiWnKF2o3S9kJzJ.jpg", "Annie Girardot"),
          M("The Hustler", 990, "/snItsSViawjaadW9mlWUmGwR41R.jpg", "Piper Laurie"),
          M("A Raisin in the Sun", 29478, "/fxGAJFfryAgdi4ONkVyrBWKDBbI.jpg", "Claudia McNeil"),
          M("Breathless", 1058, "/ipnsEbOsnQYO0HMrHTyqsO5osUV.jpg", "Jean Seberg")
        ]
      },
      1961: {
        winner: M("Saturday Night and Sunday Morning", 37230, "/fHHKxB71EzVzny3ZakxZRGe5Evw.jpg", "Rachel Roberts"),
        nominees: [
          M("Sons and Lovers", 53939, "/7BDlr8XivWmNcDsb5ygnhs8CWiR.jpg", "Wendy Hiller"),
          M("Pollyanna", 31102, "/9lWkRXg35SjUZXLr10ez8DERvRv.jpg", "Hayley Mills"),
          M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg", "Shirley MacLaine"),
          M("The Angry Silence", 83995, "/hXQtp9KOgqisXO73WkjiRJnh9mE.jpg", "Pier Angeli"),
          M("Never on Sunday", 43039, "/t9zLlS5O5GB57BKjJCtzB21VKZB.jpg", "Melina Mercouri"),
          M("Hiroshima Mon Amour", 5544, "/zieczjWnvalaxwX5EQASEx0on5f.jpg", "Emmanuelle Riva"),
          M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg", "Jean Simmons")
        ]
      }
    },

    "Best Director": {
      2026: {
        winner: null,
        nominees: [
          M("Sinners", 1233413, "/qTvFWCGeGXgBRaINLY1zqgTPSpn.jpg", "Ryan Coogler"),
          M("Bugonia", 701387, "/rSdOua3wKMEaFWDcKAYWRjXQWOt.jpg", "Yorgos Lanthimos"),
          M("Marty Supreme", 1317288, "/lYWEXbQgRTR4ZQleSXAgRbxAjvq.jpg", "Josh Safdie"),
          M("One Battle After Another", 1054867, "/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg", "Paul Thomas Anderson"),
          M("Sentimental Value", 1124566, "/pz9NCWxxOk3o0W3v1Zkhawrwb4i.jpg", "Joachim Trier"),
          M("Hamnet", 858024, "/vbeyOZm2bvBXcbgPD3v6o94epPX.jpg", "Chloe Zhao")
        ]
      },
      2025: {
        winner: M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg", "Brady Corbet"),
        nominees: [
          M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg", "Jacques Audiard"),
          M("Anora", 1064213, "/cgXk2tNYhJZLXdBDO5DidAVzQ82.jpg", "Sean Baker"),
          M("Conclave", 974576, "/vYEyxF1UT779RiEalpMjUT6kfdf.jpg", "Edward Berger"),
          M("The Substance", 933260, "/lqoMzCcZYEFK729d6qzt349fB4o.jpg", "Coralie Fargeat"),
          M("All We Imagine as Light", 927547, "/ruImrzB4POsrgwCMozmOBV67zs5.jpg", "Payal Kapadia")
        ]
      },
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "Christopher Nolan"),
        nominees: [
          M("All of Us Strangers", 994108, "/aviJMFZSnnCAsCVyJGaPNx4Ef3i.jpg", "Andrew Haigh"),
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg", "Justine Triet"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg", "Alexander Payne"),
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg", "Bradley Cooper"),
          M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg", "Jonathan Glazer")
        ]
      },
      2023: {
        winner: M("All Quiet on the Western Front", 49046, "/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg", "Edward Berger"),
        nominees: [
          M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg", "Martin McDonagh"),
          M("Decision to Leave", 705996, "/N0rskx91Eh6aWjvBybeY6epNic.jpg", "Park Chan-wook"),
          M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg", "Daniel Kwan & Daniel Scheinert"),
          M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg", "Todd Field"),
          M("The Woman King", 724495, "/438QXt1E3WJWb3PqNniK0tAE5c1.jpg", "Gina Prince-Bythewood")
        ]
      },
      2022: {
        winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg", "Jane Campion"),
        nominees: [
          M("After Love", 714011, "/mXaNg69iWEs0Qsj4AJxcvCXuWKw.jpg", "Aleem Khan"),
          M("Drive My Car", 758866, "/3cOsf5HBjPK2QCz9ebQlGHNnE7y.jpg", "Ryusuke Hamaguchi"),
          M("Happening", 793998, "/f2lTAmLYpWpd8JxtJrMXFFGV9gZ.jpg", "Audrey Diwan"),
          M("Licorice Pizza", 718032, "/ivXtvzfliGvoJ1DhSHIGyYBToWe.jpg", "Paul Thomas Anderson"),
          M("Titane", 630240, "/AeQC4gFwkIvjAwnSd2RPAlgs1VE.jpg", "Julia Ducournau")
        ]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg", "Chloe Zhao"),
        nominees: [
          M("Another Round", 580175, "/aDcIt4NHURLKnAEu7gow51Yd00Q.jpg", "Thomas Vinterberg"),
          M("Babyteeth", 522098, "/aINpljdt3VVMrCLtJW4BektwYOp.jpg", "Shannon Murphy"),
          M("Minari", 615643, "/6mPNdmjdbVKPITv3LLCmQoKs9Zw.jpg", "Lee Isaac Chung"),
          M("Quo Vadis, Aida?", 728118, "/eQy2Tgvmx0FkK8vMMqMW4aX5UXQ.jpg", "Jasmila Zbanic"),
          M("Rocks", 575773, "/8Mg4ew6drIax6ZmeY22dxM8ujBk.jpg", "Sarah Gavron")
        ]
      },
      2020: {
        winner: M("1917", 530915, "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg", "Sam Mendes"),
        nominees: [
          M("The Irishman", 398978, "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg", "Martin Scorsese"),
          M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", "Todd Phillips"),
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg", "Quentin Tarantino"),
          M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", "Bong Joon-ho")
        ]
      },
      2019: {
        winner: M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg", "Alfonso Cuaron"),
        nominees: [
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg", "Bradley Cooper"),
          M("Cold War", 440298, "/6rbS8oPIgUMhQgIX8oGVTtlNgLR.jpg", "Pawel Pawlikowski"),
          M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg", "Yorgos Lanthimos"),
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg", "Spike Lee")
        ]
      },
      2018: {
        winner: M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg", "Guillermo del Toro"),
        nominees: [
          M("Blade Runner 2049", 335984, "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", "Denis Villeneuve"),
          M("Call Me by Your Name", 398818, "/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg", "Luca Guadagnino"),
          M("Dunkirk", 374720, "/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg", "Christopher Nolan"),
          M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg", "Martin McDonagh")
        ]
      },
      2017: {
        winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", "Damien Chazelle"),
        nominees: [
          M("Nocturnal Animals", 340666, "/mdLDgQBD0va09npSQX5Zgo2evXM.jpg", "Tom Ford"),
          M("I, Daniel Blake", 374473, "/nu3WVABXz2W85N6JXTZOT1aWS3b.jpg", "Ken Loach"),
          M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg", "Kenneth Lonergan"),
          M("Arrival", 329865, "/6WzElgkLjIWuWn3Nwu66s5J26tx.jpg", "Denis Villeneuve")
        ]
      },
      2016: {
        winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg", "Alejandro G. Inarritu"),
        nominees: [
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg", "Todd Haynes"),
          M("The Big Short", 318846, "/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg", "Adam McKay"),
          M("The Martian", 286217, "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg", "Ridley Scott"),
          M("Bridge of Spies", 296098, "/fmOOjHAQzxr0c1sfcY4qkiSRBH6.jpg", "Steven Spielberg")
        ]
      },
      2015: {
        winner: M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg", "Richard Linklater"),
        nominees: [
          M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", "Wes Anderson"),
          M("Whiplash", 244786, "/7fn624j5lj3xTme2SgiLCeuedmO.jpg", "Damien Chazelle"),
          M("Birdman", 435092, "/9n0u3Ee7OUjgeyF5kIwahxkf4xm.jpg", "Alejandro G. Inarritu"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg", "James Marsh")
        ]
      },
      2014: {
        winner: M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg", "Alfonso Cuaron"),
        nominees: [
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg", "Paul Greengrass"),
          M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg", "Steve McQueen"),
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg", "David O. Russell"),
          M("The Wolf of Wall Street", 106646, "/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg", "Martin Scorsese")
        ]
      },
      2013: {
        winner: M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg", "Ben Affleck"),
        nominees: [
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg", "Kathryn Bigelow"),
          M("Amour", 86837, "/19hyCudualHxCD0GrEngqsi0wBF.jpg", "Michael Haneke"),
          M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg", "Ang Lee"),
          M("Django Unchained", 68718, "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", "Quentin Tarantino")
        ]
      },
      2012: {
        winner: M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg", "Michel Hazanavicius"),
        nominees: [
          M("Tinker Tailor Soldier Spy", 49517, "/e0dZ7TapGY9HtJ9xk1TUHPEOccl.jpg", "Tomas Alfredson"),
          M("We Need to Talk About Kevin", 71859, "/auAmiRmbBQ5QIYGpWgcGBoBQY3b.jpg", "Lynne Ramsay"),
          M("Drive", 64690, "/602vevIURmpDfzbnv5Ubi6wIkQm.jpg", "Nicolas Winding Refn"),
          M("Hugo", 44826, "/1dxRq3o3l3bVWNRvvSb7rRf68qp.jpg", "Martin Scorsese")
        ]
      },
      2011: {
        winner: M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", "David Fincher"),
        nominees: [
          M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg", "Darren Aronofsky"),
          M("127 Hours", 44115, "/h0RMdn0rfl9l5hWXz3tUh6QVkhi.jpg", "Danny Boyle"),
          M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg", "Tom Hooper"),
          M("Inception", 27205, "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", "Christopher Nolan")
        ]
      },
      2010: {
        winner: M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg", "Kathryn Bigelow"),
        nominees: [
          M("District 9", 17654, "/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg", "Neill Blomkamp"),
          M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", "James Cameron"),
          M("An Education", 24684, "/gLIvvUdlocGjm8XVLxhWHAKWrRq.jpg", "Lone Scherfig"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg", "Quentin Tarantino")
        ]
      },
      2009: {
        winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg", "Danny Boyle"),
        nominees: [
          M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg", "Stephen Daldry"),
          M("Changeling", 3580, "/y9Qi39dL3PceGCH8afyC7QrhbhI.jpg", "Clint Eastwood"),
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg", "David Fincher"),
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg", "Ron Howard")
        ]
      },
      2008: {
        winner: M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg", "Joel Coen & Ethan Coen"),
        nominees: [
          M("The Bourne Ultimatum", 2503, "/15rMz5MRXFp7CP4VxhjYw4y0FUn.jpg", "Paul Greengrass"),
          M("The Lives of Others", 582, "/cVUDMnskSc01rdbyH0tLATTJUdP.jpg", "Florian Henckel von Donnersmarck"),
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg", "Joe Wright")
        ]
      },
      2007: {
        winner: M("United 93", 9829, "/r3mdSgsnpoi4UiUufdybhjha68t.jpg", "Paul Greengrass"),
        nominees: [
          M("Little Miss Sunshine", 773, "/niNdhTpPHSgw22tK0PLjQMV640v.jpg", "Jonathan Dayton & Valerie Faris"),
          M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg", "Stephen Frears"),
          M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg", "Alejandro G. Inarritu"),
          M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg", "Martin Scorsese")
        ]
      },
      2006: {
        winner: M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg", "Ang Lee"),
        nominees: [
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg", "George Clooney"),
          M("Crash", 1640, "/86BdPC6RDX88NC880pLidKn2LCj.jpg", "Paul Haggis"),
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg", "Fernando Meirelles"),
          M("Capote", 398, "/tzsxkZMnJvozpHQEl1KzO8KwWu.jpg", "Bennett Miller")
        ]
      },
      2005: {
        winner: M("Vera Drake", 11109, "/556fElboCLlEmP8UULaYosU45Bc.jpg", "Mike Leigh"),
        nominees: [
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg", "Marc Forster"),
          M("Eternal Sunshine of the Spotless Mind", 38, "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", "Michel Gondry"),
          M("Collateral", 1538, "/nV5316WUsVij8sVXLCF1g7TFitg.jpg", "Michael Mann"),
          M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg", "Martin Scorsese")
        ]
      },
      2004: {
        winner: M("Master and Commander: The Far Side of the World", 8619, "/s1cVTQEZYn4nSjZLnFbzLP0j8y2.jpg", "Peter Weir"),
        nominees: [
          M("Big Fish", 587, "/tjK063yCgaBAluVU72rZ6PKPH2l.jpg", "Tim Burton"),
          M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg", "Sofia Coppola"),
          M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", "Peter Jackson"),
          M("Cold Mountain", 2289, "/j0AJeeR5CQPDFh0otyWyCWREHO8.jpg", "Anthony Minghella")
        ]
      },
      2003: {
        winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", "Roman Polanski"),
        nominees: [
          M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg", "Stephen Daldry"),
          M("The Lord of the Rings: The Two Towers", 121, "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", "Peter Jackson"),
          M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg", "Rob Marshall"),
          M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg", "Martin Scorsese")
        ]
      },
      2002: {
        winner: M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", "Peter Jackson"),
        nominees: [
          M("Gosford Park", 5279, "/7r8DeZuaaHCiOEbkqZC6MFmwJ69.jpg", "Robert Altman"),
          M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg", "Ron Howard"),
          M("Amélie", 194, "/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg", "Jean-Pierre Jeunet"),
          M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg", "Baz Luhrmann")
        ]
      },
      2001: {
        winner: M("Crouching Tiger, Hidden Dragon", 146, "/iNDVBFNz4XyYzM9Lwip6atSTFqf.jpg", "Ang Lee"),
        nominees: [
          M("Billy Elliot", 71, "/nOr5diUZxphmAD3li9aiILyI28F.jpg", "Stephen Daldry"),
          M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", "Ridley Scott"),
          M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg", "Steven Soderbergh"),
          M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg", "Steven Soderbergh")
        ]
      },
      2000: {
        winner: M("All About My Mother", 99, "/hjQhzhkGYXPNM96k0mOgob6HMmn.jpg", "Pedro Almodovar"),
        nominees: [
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Neil Jordan"),
          M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Sam Mendes"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg", "Anthony Minghella"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg", "M. Night Shyamalan")
        ]
      },
      1999: {
        winner: M("All About My Mother", 99, "/hjQhzhkGYXPNM96k0mOgob6HMmn.jpg", "Pedro Almodovar"),
        nominees: [
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Neil Jordan"),
          M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Sam Mendes"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg", "Anthony Minghella"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg", "M. Night Shyamalan")
        ]
      },
      1998: {
        winner: M("The Truman Show", 37165, "/vuza0WqY239yBXOadKlGwJsZJFE.jpg", "Peter Weir"),
        nominees: [
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg", "Shekhar Kapur"),
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg", "John Madden"),
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg", "Steven Spielberg")
        ]
      },
      1997: {
        winner: M("Romeo + Juliet", 454, "/eLf4jclPijOqfEp6bDAmezRFxk5.jpg", "Baz Luhrmann"),
        nominees: [
          M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", "James Cameron"),
          M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg", "Peter Cattaneo"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg", "Curtis Hanson")
        ]
      },
      1996: {
        winner: M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", "Joel Coen"),
        nominees: [
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg", "Scott Hicks"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg", "Mike Leigh"),
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg", "Anthony Minghella")
        ]
      },
      1995: {
        winner: M("The Postman", 11010, "/cUaCpjVDefYShKyLmkcDsiPaBHn.jpg", "Michael Radford"),
        nominees: [
          M("Braveheart", 197, "/or1gBugydmjToAEq7OZY0owwFk.jpg", "Mel Gibson"),
          M("The Madness of King George", 11318, "/1dTSY023ZyBbgVSKDRuA6JLGSnZ.jpg", "Nicholas Hytner"),
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg", "Ang Lee")
        ]
      },
      1994: {
        winner: M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg", "Mike Newell"),
        nominees: [
          M("Three Colors: Red", 110, "/JHmsBiX1tjCKqAul1lzC20WcAW.jpg", "Krzysztof Kieslowski"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", "Quentin Tarantino"),
          M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", "Robert Zemeckis")
        ]
      },
      1993: {
        winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", "Steven Spielberg"),
        nominees: [
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg", "Richard Attenborough"),
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg", "Jane Campion"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg", "James Ivory")
        ]
      },
      1992: {
        winner: M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg", "Robert Altman"),
        nominees: [
          M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg", "Clint Eastwood"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg", "James Ivory"),
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg", "Neil Jordan")
        ]
      },
      1991: {
        winner: M("The Commitments", 11663, "/iccBDq9aS1gwi6b8aJjBgPU4t2D.jpg", "Alan Parker"),
        nominees: [
          M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg", "Kevin Costner"),
          M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", "Jonathan Demme"),
          M("Thelma & Louise", 1541, "/gQSUVGR80RVHxJywtwXm2qa1ebi.jpg", "Ridley Scott")
        ]
      },
      1990: {
        winner: M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg", "Martin Scorsese"),
        nominees: [
          M("Crimes and Misdemeanors", 11562, "/6vC6MLYUICH57MmEVi1UaNaj2Qs.jpg", "Woody Allen"),
          M("Driving Miss Daisy", 403, "/iaCzvcY42HihFxQBTZCTKMpsI0P.jpg", "Bruce Beresford"),
          M("Cinema Paradiso", 11216, "/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg", "Giuseppe Tornatore")
        ]
      },
      1989: {
        winner: M("Henry V", 10705, "/w9R2HsYNnfF3m9uEo2UAmPNJr8a.jpg", "Kenneth Branagh"),
        nominees: [
          M("Dangerous Liaisons", 859, "/eNvJXuTQ7lusuUrIvS7wplORXBX.jpg", "Stephen Frears"),
          M("Mississippi Burning", 1632, "/wvEx2WbxZXYljQ9vSoq37NgeXcJ.jpg", "Alan Parker"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg", "Peter Weir")
        ]
      },
      1988: {
        winner: M("Au Revoir les Enfants", 1786, "/lXP90Vx7OcviBfbbokcaG6zVnPG.jpg", "Louis Malle"),
        nominees: [
          M("Babette's Feast", 11832, "/3ibptSbnAHd0SUBnOKapNZQBpCl.jpg", "Gabriel Axel"),
          M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg", "Bernardo Bertolucci"),
          M("A Fish Called Wanda", 623, "/hkSGFNVfEEUXFCxRZDITFHVhUlu.jpg", "Charles Crichton")
        ]
      },
      1987: {
        winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg", "Oliver Stone"),
        nominees: [
          M("Cry Freedom", 12506, "/zEONV1NAzzoQGFFgSIEs7vJzDrN.jpg", "Richard Attenborough"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg", "John Boorman"),
          M("Jean de Florette", 4480, "/atjyDRdOnOi2S28X3mNtJ7CQmFj.jpg", "Claude Berri")
        ]
      },
      1986: {
        winner: M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg", "Woody Allen"),
        nominees: [
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg", "Roland Joffe"),
          M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg", "Neil Jordan"),
          M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg", "James Ivory")
        ]
      },
      1984: {
        winner: M("Paris, Texas", 655, "/sP27Qm4THyRZyHjHYMfIDtJP6YE.jpg", "Wim Wenders"),
        nominees: [
          M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg", "Roland Joffe"),
          M("Once Upon a Time in America", 311, "/i0enkzsL5dPeneWnjl1fCWm6L7k.jpg", "Sergio Leone"),
          M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg", "Peter Yates")
        ]
      },
      1983: {
        winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", "Roman Polanski"),
        nominees: [
          M("Local Hero", 11235, "/jqxD0H9a1rg5bXftsm6gsNOjt4n.jpg", "Bill Forsyth"),
          M("Heat and Dust", 67794, "/97SCmQDukEQlyCnM7R3PvxhAgMW.jpg", "James Ivory"),
          M("The King of Comedy", 262, "/3sGuQv0UxfjDODCC9IQG5S1jXK8.jpg", "Martin Scorsese")
        ]
      },
      1982: {
        winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg", "Richard Attenborough"),
        nominees: [
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg", "Costa-Gavras"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg", "Mark Rydell"),
          M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg", "Steven Spielberg")
        ]
      },
      1981: {
        winner: M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg", "Louis Malle"),
        nominees: [
          M("Gregory's Girl", 21764, "/vVOdKnervWwvxIeJzLCqQzQPs7o.jpg", "Bill Forsyth"),
          M("Chariots of Fire", 9443, "/qnRaum8k0HqGRml2i7OawFqUtEb.jpg", "Hugh Hudson"),
          M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg", "Karel Reisz")
        ]
      },
      1980: {
        winner: M("Kagemusha", 11953, "/fJgqj9s8HNZz9zwX6femVJn8HEB.jpg", "Akira Kurosawa"),
        nominees: [
          M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg", "Robert Benton"),
          M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg", "David Lynch"),
          M("Fame", 3537, "/ewuGn4kxsqbYfgSO8Y5kzYlBcKE.jpg", "Alan Parker")
        ]
      }
    },

    "Best Film": {
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        nominees: [
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg"),
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg"),
          M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg")
        ]
      },
      2023: {
        winner: M("All Quiet on the Western Front", 49046, "/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg"),
        nominees: [
          M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg"),
          M("Elvis", 614934, "/rva3UhKaMeiB0Vej5A2pm1leX7K.jpg"),
          M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg"),
          M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg")
        ]
      },
      2022: {
        winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg"),
        nominees: [
          M("Belfast", 777270, "/4xs6nHNBjYpRymw8ZQmnVIbJ8Xa.jpg"),
          M("Don't Look Up", 646380, "/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg"),
          M("Dune", 438631, "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"),
          M("Licorice Pizza", 718032, "/ivXtvzfliGvoJ1DhSHIGyYBToWe.jpg")
        ]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"),
        nominees: [
          M("The Father", 600354, "/pr3bEQ517uMb5loLvjFQi8uLAsp.jpg"),
          M("The Mauritanian", 644583, "/lIADEa6oH74uUapjsPbNRzxus8M.jpg"),
          M("Promising Young Woman", 582014, "/73QoFJFmUrJfDG2EynFjNc5gJxk.jpg"),
          M("The Whole World is Watching: Inside Aaron Sorkin's Trial of the Chicago 7", 832211, "")
        ]
      },
      2020: {
        winner: M("1917", 530915, "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg"),
        nominees: [
          M("The Irishman", 398978, "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg"),
          M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"),
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg"),
          M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg")
        ]
      },
      2019: {
        winner: M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg"),
        nominees: [
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg"),
          M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg"),
          M("Green Book", 490132, "/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg")
        ]
      },
      2018: {
        winner: M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg"),
        nominees: [
          M("Call Me by Your Name", 398818, "/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg"),
          M("Darkest Hour", 399404, "/xa6G3aKlysQeVg9wOb0dRcIGlWu.jpg"),
          M("Dunkirk", 374720, "/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg"),
          M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg")
        ]
      },
      2017: {
        winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"),
        nominees: [
          M("Arrival", 329865, "/6WzElgkLjIWuWn3Nwu66s5J26tx.jpg"),
          M("I, Daniel Blake", 374473, "/nu3WVABXz2W85N6JXTZOT1aWS3b.jpg"),
          M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg"),
          M("Moonlight", 376867, "/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg")
        ]
      },
      2016: {
        winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg"),
        nominees: [
          M("The Big Short", 318846, "/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg"),
          M("Bridge of Spies", 296098, "/fmOOjHAQzxr0c1sfcY4qkiSRBH6.jpg"),
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg"),
          M("Spotlight", 314365, "/8DPGG400FgaFWaqcv11n8mRd2NG.jpg")
        ]
      },
      2015: {
        winner: M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg"),
        nominees: [
          M("Birdman", 435092, "/9n0u3Ee7OUjgeyF5kIwahxkf4xm.jpg"),
          M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"),
          M("The Imitation Game", 205596, "/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg")
        ]
      },
      2014: {
        winner: M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg"),
        nominees: [
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg"),
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg"),
          M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg"),
          M("Philomena", 205220, "/eBUv2GmGdXmCk1AaSOmyiu70hN8.jpg")
        ]
      },
      2013: {
        winner: M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg"),
        nominees: [
          M("Les Misérables", 82695, "/6CuzBs2Lb8At7qQr64mLXg2RYRb.jpg"),
          M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg"),
          M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg"),
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg")
        ]
      },
      2012: {
        winner: M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg"),
        nominees: [
          M("The Descendants", 65057, "/8cDq5UlOPYeKm39okALCEOsZPxk.jpg"),
          M("Drive", 64690, "/602vevIURmpDfzbnv5Ubi6wIkQm.jpg"),
          M("The Help", 50014, "/3kmfoWWEc9Vtyuaf9v5VipRgdjx.jpg"),
          M("Tinker Tailor Soldier Spy", 49517, "/e0dZ7TapGY9HtJ9xk1TUHPEOccl.jpg")
        ]
      },
      2011: {
        winner: M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg"),
        nominees: [
          M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg"),
          M("Inception", 27205, "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"),
          M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg"),
          M("True Grit", 44264, "/tCrB8pcjadZjsDk7rleGJaIv78k.jpg")
        ]
      },
      2010: {
        winner: M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg"),
        nominees: [
          M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg"),
          M("An Education", 24684, "/gLIvvUdlocGjm8XVLxhWHAKWrRq.jpg"),
          M("Precious", 25793, "/d4ltLIDbvZskSwbzXqi0Hfv5ma4.jpg"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg")
        ]
      },
      2009: {
        winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg"),
        nominees: [
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg"),
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg"),
          M("Milk", 10139, "/ot4ImF4b7QbS6XsTdMH3pWxNmX2.jpg"),
          M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg")
        ]
      },
      2008: {
        winner: M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg"),
        nominees: [
          M("American Gangster", 4982, "/m7kJge9DG86Bj7hsBW6xFCMyDkY.jpg"),
          M("The Lives of Others", 582, "/cVUDMnskSc01rdbyH0tLATTJUdP.jpg"),
          M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg"),
          M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg")
        ]
      },
      2007: {
        winner: M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg"),
        nominees: [
          M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg"),
          M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg"),
          M("The Last King of Scotland", 1523, "/n1CgN2mS7RSxHhv2R1DdisYDvT6.jpg"),
          M("Little Miss Sunshine", 773, "/niNdhTpPHSgw22tK0PLjQMV640v.jpg")
        ]
      },
      2006: {
        winner: M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg"),
        nominees: [
          M("Capote", 398, "/tzsxkZMnJvozpHQEl1KzO8KwWu.jpg"),
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg"),
          M("Crash", 1640, "/86BdPC6RDX88NC880pLidKn2LCj.jpg"),
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg")
        ]
      },
      2005: {
        winner: M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg"),
        nominees: [
          M("Eternal Sunshine of the Spotless Mind", 38, "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg"),
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg"),
          M("The Motorcycle Diaries", 1653, "/qz2aBYT8CAiJYvX4fRZpJ5G0Oz1.jpg"),
          M("Vera Drake", 11109, "/556fElboCLlEmP8UULaYosU45Bc.jpg")
        ]
      },
      2004: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
        nominees: [
          M("Big Fish", 587, "/tjK063yCgaBAluVU72rZ6PKPH2l.jpg"),
          M("Cold Mountain", 2289, "/j0AJeeR5CQPDFh0otyWyCWREHO8.jpg"),
          M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg"),
          M("Master and Commander: The Far Side of the World", 8619, "/s1cVTQEZYn4nSjZLnFbzLP0j8y2.jpg")
        ]
      },
      2003: {
        winner: M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg"),
        nominees: [
          M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg"),
          M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg"),
          M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg"),
          M("The Lord of the Rings: The Two Towers", 121, "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg")
        ]
      },
      2002: {
        winner: M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"),
        nominees: [
          M("Amélie", 194, "/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg"),
          M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg"),
          M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg"),
          M("Shrek", 808, "/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg")
        ]
      },
      2001: {
        winner: M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"),
        nominees: [
          M("Almost Famous", 786, "/3rrkyLYbgLj84AYvjhdcJot4JPx.jpg"),
          M("Billy Elliot", 71, "/nOr5diUZxphmAD3li9aiILyI28F.jpg"),
          M("Crouching Tiger, Hidden Dragon", 146, "/iNDVBFNz4XyYzM9Lwip6atSTFqf.jpg"),
          M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg")
        ]
      },
      2000: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"),
        nominees: [
          M("Being John Malkovich", 492, "/xVSvIwRNzwXSs0CLefiiG6A96m4.jpg"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg")
        ]
      },
      1999: {
        winner: M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
        nominees: [
          M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"),
          M("East Is East", 10557, "/tDchJ4mB23vGgwdQCmq9FCQ4W23.jpg"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg"),
          M("The Sixth Sense", 745, "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg")
        ]
      },
      1998: {
        winner: M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg"),
        nominees: [
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg"),
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"),
          M("The Truman Show", 37165, "/vuza0WqY239yBXOadKlGwJsZJFE.jpg")
        ]
      },
      1997: {
        winner: M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
        nominees: [
          M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg"),
          M("Mrs Brown", 17589, "/zFLaeGWglaWfdLiUNcvmUeg0KRJ.jpg"),
          M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg")
        ]
      },
      1996: {
        winner: M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
        nominees: [
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"),
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg")
        ]
      },
      1995: {
        winner: M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg"),
        nominees: [
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
          M("The Usual Suspects", 629, "/99X2SgyFunJFXGAYnDv3sb9pnUD.jpg"),
          M("Babe", 9598, "/zKuQMtnbVTz9DsOnOJmlW71v4qH.jpg"),
          M("The Madness of King George", 11318, "/1dTSY023ZyBbgVSKDRuA6JLGSnZ.jpg")
        ]
      },
      1994: {
        winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"),
        nominees: [
          M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg"),
          M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"),
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg")
        ]
      },
      1993: {
        winner: M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
        nominees: [
          M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"),
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg"),
          M("Shadowlands", 10445, "/5jTWY1M2O4Zhid4rLOpftzazRGn.jpg")
        ]
      },
      1992: {
        winner: M("The Commitments", 11663, "/iccBDq9aS1gwi6b8aJjBgPU4t2D.jpg"),
        nominees: [
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg"),
          M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg"),
          M("Strictly Ballroom", 10409, "/f6vs4DQGuNpLuA5Z7k69uuKpbVG.jpg"),
          M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg")
        ]
      },
      1991: {
        winner: M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg"),
        nominees: [
          M("The Commitments", 11663, "/iccBDq9aS1gwi6b8aJjBgPU4t2D.jpg"),
          M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"),
          M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"),
          M("Thelma & Louise", 1541, "/gQSUVGR80RVHxJywtwXm2qa1ebi.jpg")
        ]
      },
      1990: {
        winner: M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg"),
        nominees: [
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg"),
          M("Crimes and Misdemeanors", 11562, "/6vC6MLYUICH57MmEVi1UaNaj2Qs.jpg"),
          M("Driving Miss Daisy", 403, "/iaCzvcY42HihFxQBTZCTKMpsI0P.jpg"),
          M("Pretty Woman", 114, "/hVHUfT801LQATGd26VPzhorIYza.jpg")
        ]
      },
      1989: {
        winner: M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg"),
        nominees: [
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg"),
          M("My Left Foot: The Story of Christy Brown", 10161, "/GRAAl0bMQFoFIjV3aunc5jsM5u.jpg"),
          M("Shirley Valentine", 18683, "/rrRrHNhur1DTp1KOp0YfFWvymQD.jpg"),
          M("When Harry Met Sally...", 639, "/rFOiFUhTMtDetqCGClC9PIgnC1P.jpg")
        ]
      },
      1988: {
        winner: M("Jean de Florette", 4480, "/atjyDRdOnOi2S28X3mNtJ7CQmFj.jpg"),
        nominees: [
          M("Au Revoir les Enfants", 1786, "/lXP90Vx7OcviBfbbokcaG6zVnPG.jpg"),
          M("Babette's Feast", 11832, "/3ibptSbnAHd0SUBnOKapNZQBpCl.jpg"),
          M("A Fish Called Wanda", 623, "/hkSGFNVfEEUXFCxRZDITFHVhUlu.jpg")
        ]
      },
      1987: {
        winner: M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg"),
        nominees: [
          M("Cry Freedom", 12506, "/zEONV1NAzzoQGFFgSIEs7vJzDrN.jpg"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg"),
          M("Radio Days", 30890, "/ljZ3yyYznAiq1vF6nHITdJn6qXB.jpg")
        ]
      },
      1986: {
        winner: M("The Purple Rose of Cairo", 10849, "/ccsint43E44B7NGceEhVimD93Yt.jpg"),
        nominees: [
          M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg"),
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg"),
          M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg")
        ]
      },
      1985: {
        winner: M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg"),
        nominees: [
          M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg"),
          M("Back to the Future", 105, "/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg"),
          M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg")
        ]
      },
      1984: {
        winner: M("Educating Rita", 38291, "/xwxgiRzw2zxzWNIYp98faJ0rUy5.jpg"),
        nominees: [
          M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg"),
          M("Paris, Texas", 655, "/sP27Qm4THyRZyHjHYMfIDtJP6YE.jpg"),
          M("A Private Function", 57565, "/8OC2OqimnYqB8d9S38MdQS2DkeQ.jpg")
        ]
      },
      1983: {
        winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg"),
        nominees: [
          M("Heat and Dust", 67794, "/97SCmQDukEQlyCnM7R3PvxhAgMW.jpg"),
          M("Local Hero", 11235, "/jqxD0H9a1rg5bXftsm6gsNOjt4n.jpg"),
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg")
        ]
      },
      1982: {
        winner: M("Chariots of Fire", 9443, "/qnRaum8k0HqGRml2i7OawFqUtEb.jpg"),
        nominees: [
          M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg"),
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg")
        ]
      },
      1981: {
        winner: M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg"),
        nominees: [
          M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg"),
          M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg"),
          M("Gregory's Girl", 21764, "/vVOdKnervWwvxIeJzLCqQzQPs7o.jpg"),
          M("Raiders of the Lost Ark", 85, "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg")
        ]
      },
      1980: {
        winner: M("Manhattan", 696, "/k4eT3EvfxW1L9Wmt04UqJqCvCR6.jpg"),
        nominees: [
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg"),
          M("Kagemusha", 11953, "/fJgqj9s8HNZz9zwX6femVJn8HEB.jpg"),
          M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg")
        ]
      },
      1979: {
        winner: M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg"),
        nominees: [
          M("Alien", 348, "/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg"),
          M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"),
          M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg")
        ]
      },
      1978: {
        winner: M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg"),
        nominees: [
          M("Close Encounters of the Third Kind", 840, "/gCWPB8cF82tqzrS9tvzcO6q6nyz.jpg"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg"),
          M("Star Wars", 11, "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg")
        ]
      },
      1977: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"),
        nominees: [
          M("A Bridge Too Far", 5902, "/lszOk3Xmh7qpLaM9J4K9E6ADLk1.jpg"),
          M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"),
          M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg")
        ]
      },
      1976: {
        winner: M("Alice Doesn't Live Here Anymore", 16153, "/A99yzz1W3NCG6zR2HXSwn2kWlse.jpg"),
        nominees: [
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg"),
          M("Bugsy Malone", 8446, "/j9BPl3jkNCFgsYe5poKrirUqrf8.jpg"),
          M("Taxi Driver", 103, "/ekstpH614fwDX8DUln1a2Opz0N8.jpg")
        ]
      },
      1975: {
        winner: M("Lacombe, Lucien", 55368, "/gHlorDyJrigxzcuZaQ5p4mseAPC.jpg"),
        nominees: [
          M("Barry Lyndon", 3175, "/znfLskGQnXYB2xcOGM9eInRHPAV.jpg"),
          M("Dog Day Afternoon", 968, "/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg"),
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg")
        ]
      },
      1974: {
        winner: M("Days and Nights in the Forest", 35867, "/dJvcIMaFXK77AQ934AZ4PpA19nT.jpg"),
        nominees: [
          M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg"),
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg"),
          M("Murder on the Orient Express", 4176, "/oJjKcuoH7SuiqZaEpHt2Nd5ZxNY.jpg")
        ]
      },
      1973: {
        winner: M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"),
        nominees: [
          M("The Day of the Jackal", 4909, "/vThgcb3JOj99yETg8WChuci4LV2.jpg"),
          M("The Discreet Charm of the Bourgeoisie", 4593, "/zN4ILX2x64PvT2jIOAHXxCOi5WA.jpg"),
          M("Don't Look Now", 931, "/ivWsU3QtcstImCTOjItsH0SAbNn.jpg")
        ]
      },
      1972: {
        winner: M("Sunday Bloody Sunday", 45938, "/7q1h3M1vDlsHDKRhoPOzKjmFCVq.jpg"),
        nominees: [
          M("A Clockwork Orange", 185, "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg"),
          M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg"),
          M("The Last Picture Show", 25188, "/7NYePZc0lZrRomtmQsjOJMePTEb.jpg")
        ]
      },
      1971: {
        winner: M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg"),
        nominees: [
          M("Death in Venice", 6619, "/s81SuFBSqY8T5Lrn5R8ucX8LKxi.jpg"),
          M("The Go-Between", 36194, "/61dXOIpDaiWCp7aIjBYkd6ujdXZ.jpg"),
          M("Taking Off", 59881, "/2UXNQy39AqER8Y5LjuZcA1pliwq.jpg")
        ]
      },
      1970: {
        winner: M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg"),
        nominees: [
          M("Kes", 13384, "/r1FMq75irhsQBVGjXhPU4xA9SDo.jpg"),
          M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg"),
          M("Ryan's Daughter", 38953, "/g5NAbtEK5bEAkBdXq6YM7a7tkZO.jpg")
        ]
      },
      1969: {
        winner: null,
        nominees: [
          M("Oh! What a Lovely War", 21335, "/zLAYzMNOos506tcKYXxIDvupY5S.jpg"),
          M("Women in Love", 66027, "/uHfThxdQC99LLoe2jKZ1u3vIge2.jpg"),
          M("Z", 2721, "/dFAJyFNgvOv24f2RQyI9KDxjGr3.jpg")
        ]
      },
      1968: {
        winner: null,
        nominees: [
          M("2001: A Space Odyssey", 62, "/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg"),
          M("Oliver!", 17917, "/1XJgoaOWKrqxkKeBKWLKSigqG8c.jpg"),
          M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg")
        ]
      },
      1967: {
        winner: null,
        nominees: [
          M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg"),
          M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg"),
          M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg")
        ]
      },
      1966: {
        winner: null,
        nominees: [
          M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg"),
          M("Morgan: A Suitable Case for Treatment", 42724, "/xu4awPUFmrFUaX2qk12Lv4QhJSF.jpg"),
          M("The Spy Who Came In from the Cold", 13580, "/lN3PWv6cW22mqXDcgGZgK1Aa2gh.jpg")
        ]
      },
      1965: {
        winner: null,
        nominees: [
          M("Enter Hamlet", 278700, ""),
          M("The Hill", 24395, "/cmBpImAjHJnuHXMVByzqnxtDcae.jpg"),
          M("The Knack... and How to Get It", 42744, "/xO2dJcCISY6lujaU4Qew3RzSErJ.jpg"),
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg")
        ]
      },
      1964: {
        winner: null,
        nominees: [
          M("Becket", 15421, "/swWmxVbq0pXv4wwsc2O803PiXR7.jpg"),
          M("The Pumpkin Eater", 69557, "/5llEDfwte6SnAd2grP065N95yeo.jpg"),
          M("The Train", 3482, "/bzgPLB7efMohled42PIn6CcOTnO.jpg")
        ]
      },
      1963: {
        winner: null,
        nominees: [
          M("Billy Liar", 26535, "/8YUzVyN3HdedaK7oGVf2nVrsf4R.jpg"),
          M("8½", 422, "/nqOsvzEamX7AyNwSx48OOV2iidE.jpg"),
          M("Hud", 24748, "/A168bF52vmAIGkC2Qafj7M2EmaE.jpg"),
          M("The Servant", 42987, "/pRa4og93BeOoMCt6oWuPCwu5Coo.jpg")
        ]
      },
      1962: {
        winner: null,
        nominees: [
          M("Jules and Jim", 1628, "/kuFjZlcZhQFDtIjuI3GQJjsQG03.jpg"),
          M("The L-Shaped Room", 76000, "/ie8EArW3CjO2gLMYtJEMLU4CAQN.jpg"),
          M("Only Two Can Play", 54723, "/txgjZ46WTAXyRmQAL1Ab5IagGje.jpg"),
          M("West Side Story", 1725, "/nzCMu6D5q60i2bVrIQ0DxlRSgCZ.jpg")
        ]
      },
      1961: {
        winner: null,
        nominees: [
          M("The Innocents", 16372, "/idqvLBmlEHUITMnQ0EJ6Yb5TpVw.jpg"),
          M("The Long and the Short and the Tall", 68198, "/g6DagP8sQ8778d0VtbB08cb8gaT.jpg"),
          M("Rocco and His Brothers", 8422, "/pngL8AraChIDOiWnKF2o3S9kJzJ.jpg"),
          M("A Taste of Honey", 25062, "/5psrZNVZ9E6Eck7OtpO47A8zTbQ.jpg")
        ]
      },
      1960: {
        winner: null,
        nominees: [
          M("The Angry Silence", 83995, "/hXQtp9KOgqisXO73WkjiRJnh9mE.jpg"),
          M("L'Avventura", 5165, "/7kUXAS8K7Ihw1T1mhARjnLuMVk3.jpg"),
          M("La Dolce Vita", 439, "/2KU52apQyvyZuPsqEGMcWb4BKu2.jpg"),
          M("Saturday Night and Sunday Morning", 37230, "/fHHKxB71EzVzny3ZakxZRGe5Evw.jpg")
        ]
      },
      1959: {
        winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg"),
        nominees: [
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg"),
          M("The Face of the High Arctic", 768099, ""),
          M("The Nun's Story", 27029, "/4vNWFhPyjTehPpZsvTnTywwXSiF.jpg"),
          M("Sapphire", 64291, "/hwfJUilhZ6iSuosizjpLYNaFfgV.jpg"),
          M("Some Like It Hot", 239, "/hVIKyTK13AvOGv7ICmJjK44DTzp.jpg")
        ]
      },
      1958: {
        winner: M("Room at the Top", 43103, "/uuyruoqh7oBtjwN1mJyOF04CPjO.jpg"),
        nominees: [
          M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg"),
          M("The Defiant Ones", 11414, "/tGGNyImEXgedDjrCORbC9cTJp0X.jpg"),
          M("Ice Cold in Alex", 16284, "/lkqTxSL9JwyyXDu5yeOoj5mzsVc.jpg"),
          M("Indiscreet", 22874, "/sv4ao2ceHx2Ii1I2SsAmCqr7k6K.jpg")
        ]
      },
      1957: {
        winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg"),
        nominees: [
          M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg"),
          M("3:10 to Yuma", 14168, "/emYeJVZrpl2WfndJlhbls1e7lzQ.jpg"),
          M("The Bachelor Party", 185263, "/to8xodOCvR57xDOS8rojBTwqGa5.jpg"),
          M("Paths of Glory", 975, "/p7OHwomA8UOhe3EhckF2IetBTh9.jpg")
        ]
      },
      1956: {
        winner: M("Gervaise", 52726, "/njux1vvBuiwR4UJ6FCpYoar9buO.jpg"),
        nominees: [
          M("Baby Doll", 40478, "/1Wj0H6HA7xCy8kWYWOTytqwOqWk.jpg"),
          M("The Battle of the River Plate", 17591, "/pCkNI9LVDkH5z6PzwQUbutQcm3U.jpg"),
          M("The Killing", 247, "/A6VzUPcADZGYdGHlVdWvpMNDF5d.jpg"),
          M("The Man Who Never Was", 43791, "/ajb6naQi07fPhyJQ9DxkrGNU4Sw.jpg")
        ]
      },
      1955: {
        winner: M("Richard III", 43323, "/3zp2Kg5bvlFkKmWiQLmuWQAIEgG.jpg"),
        nominees: [
          M("Bad Day at Black Rock", 14554, "/8EnhHjU0DyCckmZRtn46s3WXeEf.jpg"),
          M("Carmen Jones", 51044, "/5Vo4NeE7dlXBUaikbGnUOmUNHJ3.jpg"),
          M("The Dam Busters", 13210, "/cU2HgieUMHvCzN0PC66vk75mB61.jpg"),
          M("East of Eden", 220, "/xv1MZVIop0SQqwLUymgE5eb2LFl.jpg"),
          M("The Ladykillers", 5506, "/9LJ6ZV59Q92LAJAbmb7xm9dUBGU.jpg"),
          M("Seven Samurai", 346, "/lOMGc8bnSwQhS4XyE1S99uH8NXf.jpg")
        ]
      },
      1954: {
        winner: M("The Wages of Fear", 204, "/dZyZSosIlWcpQkV0f7pXcrV2TQV.jpg"),
        nominees: [
          M("The Caine Mutiny", 10178, "/vuO4Z3wOWVlhq35MS9asZeT9rVp.jpg"),
          M("Hobson's Choice", 16410, "/kbP7EgoiOw2bIypai50JWRsqP7p.jpg"),
          M("How to Marry a Millionaire", 10297, "/dFwefYyEOOZaWVn15xGY6CbYYJ2.jpg"),
          M("Rear Window", 567, "/ILVF0eJxHMddjxeQhswFtpMtqx.jpg"),
          M("Seven Brides for Seven Brothers", 16563, "/8Z4W2oRQKkmt7lhqNPROcNru9yJ.jpg")
        ]
      },
      1953: {
        winner: M("Forbidden Games", 5000, "/nby91GNVXQAv1NmKvqlpEEdhcMQ.jpg"),
        nominees: [
          M("The Bad and the Beautiful", 32499, "/ajAXzTiPkL7JxeCRw5lQBqrKNGx.jpg"),
          M("Come Back, Little Sheba", 84214, "/3hg3c6TVFVGuoqmHi0Yw25qvpRu.jpg"),
          M("The Cruel Sea", 16914, "/kmMGoeLx7rntdbqKZFp6bmT8ZCW.jpg"),
          M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg"),
          M("Genevieve", 43346, "/fO5PtTc7GGgxDfD6ndM009gGWhE.jpg"),
          M("Julius Caesar", 18019, "/2nzpmJ9MIdd5TKXJd53KgKdZ6eT.jpg"),
          M("Roman Holiday", 804, "/8lI9dmz1RH20FAqltkGelY1v4BE.jpg"),
          M("Shane", 3110, "/svr5ADpjXTCOQv8hmuJnB7I14Qv.jpg")
        ]
      },
      1952: {
        winner: M("The Sound Barrier", 51619, "/cExgxdISr0gEvVr74mmpEL4yLh4.jpg"),
        nominees: [
          M("The African Queen", 488, "/2Ypg0KhQfFYWILelvHGtSHHR0dk.jpg"),
          M("Angels One Five", 41312, "/r1bBcmopZPDieHtBhuQcUkZ0TpJ.jpg"),
          M("The Boy Kumasenu", 269325, "/42flAoBpyh6fdsIRDvoQYdFkpYs.jpg"),
          M("Carrie", 43358, "/hif1GraUbvlocgqtrwYMaybsGcJ.jpg"),
          M("Casque d'Or", 68822, "/c7VHPq0FxlvDiwMCvb8VOxeg8ub.jpg"),
          M("Cry, the Beloved Country", 173893, "/8inNsImz4yRfjGUkBzO6urIBM5A.jpg"),
          M("Death of a Salesman", 104394, "/xnyRkG1LMQX0NUpROq61GiKW7eJ.jpg"),
          M("Limelight", 28971, "/tDD11x3ZWCXXXwdpbGEU9uU4kh1.jpg"),
          M("Mandy", 47026, "/8bwWXoxCjCUDJN6hKPCtUWUzPux.jpg"),
          M("Miracle in Milan", 43379, "/zMEYCBO2OBHR09aW9IwjOR3R3A5.jpg"),
          M("The Young and the Damned", 800, "/cDCvmYoyqFg4CuSMtGMvCpfOIEw.jpg"),
          M("Pat and Mike", 33575, "/6hSJWY1ygsOVAtPEz9Nb5q5FeyA.jpg"),
          M("The Quiet Man", 3109, "/u3B1hVKHE56yBRoxF3Nk9uxHdYN.jpg"),
          M("Rashomon", 548, "/vL7Xw04nFMHwnvXRFCmYYAzMUvY.jpg"),
          M("The River", 45218, "/rC1k4xkffb5sdQlktiP2TyiBxT2.jpg"),
          M("Singin' in the Rain", 872, "/w03EiJVHP8Un77boQeE7hg9DVdU.jpg"),
          M("A Streetcar Named Desire", 702, "/aicdlO5vt7z2ARm279eGzJeYCLQ.jpg"),
          M("Viva Zapata!", 1810, "/vfarxn9ddiaZpRDml8FGhB46Qrc.jpg")
        ]
      },
      1951: {
        winner: M("La Ronde", 50030, "/jMcF0XAD66n1abW1ZZhtrD0AsKN.jpg"),
        nominees: [
          M("An American in Paris", 2769, "/lyDXkvG53ldz6Cf7dbjJl7TaoP5.jpg"),
          M("The Browning Version", 39946, "/fRlXkYgQc6QfwYMAlv2neKhRswl.jpg"),
          M("Detective Story", 20853, "/hMbAiGIrfhhp0XNB4mdgfgtSDdK.jpg"),
          M("Fourteen Hours", 54139, "/kS1Rhn5YfNDS2gT0UNRCPPYVV8J.jpg"),
          M("The Lavender Hill Mob", 32961, "/u4mZyim3CwXHu0zVhXjfK8fqoN7.jpg"),
          M("The Magic Box", 80596, "/kRtukdvDz3tkyhSC8GzGOkQhAb0.jpg"),
          M("The Man in the White Suit", 32568, "/laTLoNZB7Ar3ZDoQmspBDVa5mbC.jpg"),
          M("A Walk in the Sun", 43488, "/uHZX36Ls2rtfMZqX1mmhmbV92R8.jpg")
        ]
      },
      1950: {
        winner: M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg"),
        nominees: [
          M("The Asphalt Jungle", 16958, "/8xsUnT0P2fJWQv9jGDhs3i9Zx2l.jpg"),
          M("Beauty and the Beast", 321612, "/hKegSKIDep2ewJWPUQD7u0KqFIp.jpg"),
          M("The Men", 1882, "/88hG50Z7EMxKdsKOBc5o2yOpPB5.jpg"),
          M("On the Town", 31516, "/lEU8QQmIayAtPZrCDf2czQgTjQ1.jpg"),
          M("Orpheus", 4558, "/wcUmMtipWBBx7lpsfpPsUM4Snh1.jpg"),
          M("Sunset Boulevard", 599, "/zt8aQ6ksqK6p1AopC5zVTDS9pKT.jpg")
        ]
      }
    }
  },

  // ============================
  //  GOLDENGLOBE
  // ============================
  GoldenGlobe: {

    "Best Comedy/Musical": {
      2024: {
        winner: M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg"),
        nominees: [
          M("Adiós Buenos Aires", 1084920, "/jsR7vtjS7LCNSJxfkwEDTP1huWd.jpg"),
          M("American Fiction", 1056360, "/57MFWGHarg9jid7yfDTka4RmcMU.jpg"),
          M("Barbie", 346698, "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"),
          M("The Holdovers", 840430, "/VHSzNBTwxV8vh7wylo7O9CLdac.jpg"),
          M("May December", 839369, "/zhV7B610l7hjlri4ywikJ18ONuq.jpg")
        ]
      },
      2023: {
        winner: M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg"),
        nominees: [
          M("Babylon", 615777, "/wjOHjWCUE0YzDiEzKv8AfqHj3ir.jpg"),
          M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg"),
          M("Glass Onion: A Knives Out Mystery", 661374, "/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg"),
          M("Triangle of Sadness", 497828, "/k9eLozCgCed5FGTSdHu0bBElAV8.jpg")
        ]
      },
      2022: {
        winner: M("West Side Story", 511809, "/yfz3IUoYYSY32tkb97HlUBGFsnh.jpg"),
        nominees: [
          M("Cyrano", 730047, "/e4koV8iC2cCM57bqUnEnIL2a2zH.jpg"),
          M("Don't Look Up", 646380, "/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg"),
          M("Licorice Pizza", 718032, "/ivXtvzfliGvoJ1DhSHIGyYBToWe.jpg"),
          M("Honoring a Broadway Legacy: Behind the Scenes of tick, tick...Boom!", 929038, "/1SVZiOwRb0vjAYufemgdRfAyy74.jpg")
        ]
      },
      2021: {
        winner: M("Borat Subsequent Moviefilm", 740985, "/3L1Ml5RWjFVfVq3rQENvgFymT0U.jpg"),
        nominees: [
          M("Hamilton", 556574, "/h1B7tW0t399VDjAcWJh8m87469b.jpg"),
          M("Music", 586101, "/xzDXq7ofNkvIovB6Vb8KZpjqkK0.jpg"),
          M("Palm Springs", 587792, "/gnAfqiV7yO3Jq9IntTmwkcaICqc.jpg"),
          M("I Promised You the Moon: The Documentary", 1002899, "/v8JuCdrCBQMpol5tqJNaoiajz1H.jpg")
        ]
      },
      2020: {
        winner: M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg"),
        nominees: [
          M("Dolemite Is My Name", 528888, "/uoAqJg7ZSmftnBGOkupU1ySZQU0.jpg"),
          M("Jojo Rabbit", 515001, "/7GsM4mtM0worCtIVeiQt28HieeN.jpg"),
          M("Knives Out", 546554, "/pThyQovXQrw2m0s9x82twj48Jq4.jpg"),
          M("Rocketman", 504608, "/f4FF18ia7yTvHf2izNrHqBmgH8U.jpg")
        ]
      },
      2019: {
        winner: M("Green Book", 490132, "/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg"),
        nominees: [
          M("Crazy Rich Asians", 455207, "/1XxL4LJ5WHdrcYcihEZUCgNCpAW.jpg"),
          M("The Favourite", 375262, "/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg"),
          M("Mary Poppins Returns", 400650, "/uTVGku4LibMGyKgQvjBtv3OYfAX.jpg"),
          M("Vice", 429197, "/1gCab6rNv1r6V64cwsU4oEr649Y.jpg")
        ]
      },
      2018: {
        winner: M("Lady Bird", 391713, "/gl66K7zRdtNYGrxyS2YDUP5ASZd.jpg"),
        nominees: [
          M("The Disaster Artist", 371638, "/2HuLGiyH0TPYxnCvYHAxc8K738o.jpg"),
          M("Get Out", 419430, "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg"),
          M("The Greatest Showman", 316029, "/b9CeobiihCx1uG1tpw8hXmpi7nm.jpg"),
          M("I, Tonya", 389015, "/6gNXwSHxaksR1PjVZRqNapmkgj3.jpg")
        ]
      },
      2017: {
        winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"),
        nominees: [
          M("20th Century Women", 342737, "/mso2rEr9i0MilRIOao5HaWFipS9.jpg"),
          M("Deadpool: No Good Deed", 558144, "/wlKU9yB0Q8nfPMakBcSBT0JGS7.jpg"),
          M("Florence Foster Jenkins", 315664, "/c4cV732zTZ5pwtLh1OXQZ4LIgcu.jpg"),
          M("Sing Street", 369557, "/sUWpVlrvzU2SJbnVZqIeKulPKwk.jpg")
        ]
      },
      2016: {
        winner: M("The Martian", 286217, "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg"),
        nominees: [
          M("The Big Short", 318846, "/scVEaJEwP8zUix8vgmMoJJ9Nq0w.jpg"),
          M("Joy", 274479, "/nZAs0HbW82TI1i4Xid83M941Pki.jpg"),
          M("Spy", 238713, "/vPBmfMHxQvRRNGYD5S5ko2KnX56.jpg"),
          M("Trainwreck", 271718, "/wrY629UTCUAKLJ4CxQXz6DCE7pr.jpg")
        ]
      },
      2015: {
        winner: M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"),
        nominees: [
          M("Birdman", 435092, "/9n0u3Ee7OUjgeyF5kIwahxkf4xm.jpg"),
          M("Into the Woods", 224141, "/6bZC6KGfCwTMmwXmrLJQhxuRjlT.jpg"),
          M("Pride", 234200, "/Kc3vbqO0X4VRnjACGNoWLNQvHo.jpg"),
          M("St. Vincent", 239563, "/1bb7MTHCIPhpKZFysDpxNaNrdMk.jpg")
        ]
      },
      2014: {
        winner: M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg"),
        nominees: [
          M("Her", 152601, "/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg"),
          M("Inside Llewyn Davis", 86829, "/nNxK3pC3DMpPpWKMvo2p3liREVT.jpg"),
          M("Nebraska", 129670, "/o1t2Mw18EEBnl8v4Nby3PFjxnM1.jpg"),
          M("The Wolf of Wall Street", 106646, "/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg")
        ]
      },
      2013: {
        winner: M("Les Misérables", 82695, "/6CuzBs2Lb8At7qQr64mLXg2RYRb.jpg"),
        nominees: [
          M("The Best Exotic Marigold Hotel", 74534, "/gNWiOKTWDvPTpr7QfPWk18gLftz.jpg"),
          M("Moonrise Kingdom", 83666, "/y4SXcbNl6CEF2t36icuzuBioj7K.jpg"),
          M("Salmon Fishing in the Yemen", 81025, "/tSmZAKh1H80AGERgMOvXAWTwbVQ.jpg"),
          M("Silver Linings Playbook", 82693, "/fhHB1uvfFKKFbj6bTKE8xdtsjKi.jpg")
        ]
      },
      2012: {
        winner: M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg"),
        nominees: [
          M("50/50", 40807, "/8f9tM9JVB4ETBhxlQcXIjLckArl.jpg"),
          M("Bridesmaids", 55721, "/gJtA7hYsBMQ7EM3sPBMUdBfU7a0.jpg"),
          M("Midnight in Paris", 59436, "/4wBG5kbfagTQclETblPRRGihk0I.jpg"),
          M("My Week with Marilyn", 75900, "/5naqXRY1Zug5cyJJbO9H4DOg28q.jpg")
        ]
      },
      2011: {
        winner: M("The Kids Are All Right", 39781, "/xQ5XqZc82dDCcGjxY7voRKjhaKQ.jpg"),
        nominees: [
          M("Alice in Wonderland", 12092, "/20cvfwfaFqNbe9Fc3VEHJuPRxmn.jpg"),
          M("Burlesque", 42297, "/3U9zBIibERQZqYKM3N1a4MYgBsN.jpg"),
          M("RED", 39514, "/8eeK3OB5PeSRQD7BpZcGZKkehG.jpg"),
          M("The Tourist", 37710, "/oXe1nw4HcS32YVpvxwsWEVdvEXA.jpg")
        ]
      },
      2010: {
        winner: M("The Hangover", 18785, "/A0uS9rHR56FeBtpjVki16M5xxSW.jpg"),
        nominees: [
          M("(500) Days of Summer", 19913, "/qXAuQ9hF30sQRsXf40OfRVl0MJZ.jpg"),
          M("It's Complicated", 22897, "/bmjPrJgrGENFRrERP7lCJ9FGIVB.jpg"),
          M("Julie & Julia", 24803, "/1QZNWOOwfRi86ZApGvr2TtJZPBK.jpg"),
          M("Nine", 10197, "/bSxdTXktgPQPNwlkQ0DZtuAJXlb.jpg")
        ]
      },
      2009: { winner: M("Vicky Cristina Barcelona", 5038, "/ekAIg0GSbbHTH7y1GPgWj0brLTW.jpg"), nominees: [] },
      2008: { winner: M("Sweeney Todd: The Demon Barber of Fleet Street", 1280646, "/a6kO24Nkt56tU4RnDLP4H4tivGe.jpg"), nominees: [] },
      2007: { winner: M("Dreamgirls", 1125, "/sG5JyOj8Spe13QkNJMH8b5kzQUh.jpg"), nominees: [] },
      2006: { winner: M("Walk the Line", 69, "/p8lPTjvjOjTfvC1E9pmMwcF9vkn.jpg"), nominees: [] },
      2005: { winner: M("Sideways", 9675, "/zOsaxYLgvZVU7cJBpPn8CuE0MrP.jpg"), nominees: [] },
      2004: { winner: M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg"), nominees: [] },
      2003: { winner: M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg"), nominees: [] },
      2002: { winner: M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg"), nominees: [] },
      2001: { winner: M("Almost Famous", 786, "/3rrkyLYbgLj84AYvjhdcJot4JPx.jpg"), nominees: [] },
      2000: { winner: M("Toy Story 2", 863, "/yFWQkz2ynjwsazT6xQiIXEUsyuh.jpg"), nominees: [] },
      1999: {
        winner: M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
        nominees: [
          M("Toy Story 2", 863, "/yFWQkz2ynjwsazT6xQiIXEUsyuh.jpg"),
          M("Analyze This", 9535, "/eqa4TEgkx63WRhqyD8eTwmL7bUi.jpg"),
          M("Being John Malkovich", 492, "/xVSvIwRNzwXSs0CLefiiG6A96m4.jpg"),
          M("Man on the Moon", 1850, "/d8rahmdfryjdmvLpSsDOUhGVQXl.jpg"),
          M("Notting Hill", 509, "/hHRIf2XHeQMbyRb3HUx19SF5Ujw.jpg")
        ]
      },
      1998: {
        winner: M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"),
        nominees: [
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg"),
          M("Bulworth", 9452, "/gR9jZ7W2d28aSa2Yimz797VNXRh.jpg"),
          M("The Mask of Zorro", 9342, "/bdMufwGDDzqu4kTSQwrKc5WR4bu.jpg"),
          M("Patch Adams", 10312, "/xN1aKur5ddWQSXTqvzDPJD2TCxe.jpg"),
          M("Still Crazy", 1618, "/o1k991eZm7iF8JUNiVdUZU44x5c.jpg"),
          M("There's Something About Mary", 544, "/slJD1Dvnsf15LoeqhERsyzisAdn.jpg")
        ]
      },
      1997: {
        winner: M("Evita", 8818, "/hkcSlu3PMw0WyC9vHlvML6nK3Id.jpg"),
        nominees: [
          M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg"),
          M("The Full Monty", 9427, "/xkMiZv2FPrhIAtxvEcN1jAbkHRY.jpg"),
          M("Men in Black", 607, "/uLOmOF5IzWoyrgIF5MfUnh5pa1X.jpg"),
          M("My Best Friend's Wedding", 8874, "/b5g4bp8gS5ovMyR5439AII6zQ3n.jpg"),
          M("Wag the Dog", 586, "/pKl49ecMnCMX5XK5LUdxulxHLNi.jpg")
        ]
      },
      1996: {
        winner: M("Babe", 9598, "/zKuQMtnbVTz9DsOnOJmlW71v4qH.jpg"),
        nominees: [
          M("Evita", 8818, "/hkcSlu3PMw0WyC9vHlvML6nK3Id.jpg"),
          M("The Birdcage", 11000, "/hU2XeckncHS61TWZKDtw1BrKmOO.jpg"),
          M("Everyone Says I Love You", 9716, "/cFOZ4bNbWtnIIboc43M86yhwPBX.jpg"),
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg"),
          M("Jerry Maguire", 9390, "/lABvGN7fDk5ifnwZoxij6G96t2w.jpg")
        ]
      },
      1995: {
        winner: M("The Lion King", 8587, "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg"),
        nominees: [
          M("Babe", 9598, "/zKuQMtnbVTz9DsOnOJmlW71v4qH.jpg"),
          M("The American President", 9087, "/yObOAYFIHXHkFPQ3jhgkN2ezaD.jpg"),
          M("Get Shorty", 8012, "/r82SdPhg4fnIcLt0ogIjQxqjdcO.jpg"),
          M("Sabrina", 11860, "/i8PbLJDPU7vCwwscWD625oHbJy.jpg"),
          M("Toy Story", 862, "/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg")
        ]
      },
      1994: {
        winner: M("Mrs. Doubtfire", 788, "/shHrSmXS5140o6sQzgzXxn3KqSm.jpg"),
        nominees: [
          M("The Lion King", 8587, "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg"),
          M("The Adventures of Priscilla, Queen of the Desert", 2759, "/kJ7syYXEJgSBmBfSnF3Can9cK1J.jpg"),
          M("Ed Wood", 522, "/n8SrO3WbyuY2b6KazogqbQF348C.jpg"),
          M("Four Weddings and a Funeral", 712, "/qa72G2VS0bpxms6yo0tI9vsHm2e.jpg"),
          M("Prêt-à-Porter", 3586, "/bb8pq3ap09S4KHsOvflXqoNJdWZ.jpg")
        ]
      },
      1993: {
        winner: M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg"),
        nominees: [
          M("Mrs. Doubtfire", 788, "/shHrSmXS5140o6sQzgzXxn3KqSm.jpg"),
          M("Dave", 11566, "/wIUuf1NFchdCJe833JBTiSMzqfv.jpg"),
          M("Much Ado About Nothing", 11971, "/tvltGP6vYOkHdURag0jPSjhPUAV.jpg"),
          M("Sleepless in Seattle", 858, "/jAXfku1u1uaLGh4cUmK0ESf1pPu.jpg"),
          M("Strictly Ballroom", 10409, "/f6vs4DQGuNpLuA5Z7k69uuKpbVG.jpg")
        ]
      },
      1992: {
        winner: M("Beauty and the Beast", 10020, "/hUJ0UvQ5tgE2Z9WpfuduVSdiCiU.jpg"),
        nominees: [
          M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg"),
          M("Aladdin", 812, "/eLFfl7vS8dkeG1hKp5mwbm37V83.jpg"),
          M("Enchanted April", 26561, "/b4Jrg23Q3y7p8GS7aMnPdFiEcnP.jpg"),
          M("Honeymoon in Vegas", 12518, "/qZPay0VF5Bq2PiUvC09WwM5blmj.jpg"),
          M("Sister Act", 2005, "/xZvVSZ0RTxIjblLV87vs7ADM12m.jpg")
        ]
      },
      1991: {
        winner: M("Green Card", 12157, "/9UweLsv3pCORu25Uq72m2IBkKaK.jpg"),
        nominees: [
          M("Beauty and the Beast", 10020, "/hUJ0UvQ5tgE2Z9WpfuduVSdiCiU.jpg"),
          M("City Slickers", 1406, "/9DVZpm9pQNB3M17cRo752zqUYhL.jpg"),
          M("The Commitments", 11663, "/iccBDq9aS1gwi6b8aJjBgPU4t2D.jpg"),
          M("The Fisher King", 177, "/hwIYw22HmAUMobV4zsX69MgfVUz.jpg"),
          M("Fried Green Tomatoes", 1633, "/g71l1vbJwyAAYk8zKCkIQQ58qcb.jpg")
        ]
      },
      1990: {
        winner: M("Driving Miss Daisy", 403, "/iaCzvcY42HihFxQBTZCTKMpsI0P.jpg"),
        nominees: [
          M("Green Card", 12157, "/9UweLsv3pCORu25Uq72m2IBkKaK.jpg"),
          M("Dick Tracy", 8592, "/sjeP4bpgsUvAGE8oFcICy2GaHxw.jpg"),
          M("Ghost", 251, "/w9RaPHov8oM5cnzeE27isnFMsvS.jpg"),
          M("Home Alone", 771, "/i5We88HdO9Nsrv8xLyo4toNsLUM.jpg"),
          M("Pretty Woman", 114, "/hVHUfT801LQATGd26VPzhorIYza.jpg")
        ]
      },
      1989: {
        winner: M("Working Girl", 3525, "/q2jfFzZvAzjTaArQR0tjilIZ5aJ.jpg"),
        nominees: [
          M("Shirley Valentine", 18683, "/rrRrHNhur1DTp1KOp0YfFWvymQD.jpg"),
          M("The War of the Roses", 249, "/k2l2df0XlY58wfr7a3RPJ59qmxl.jpg"),
          M("When Harry Met Sally...", 639, "/rFOiFUhTMtDetqCGClC9PIgnC1P.jpg")
        ]
      },
      1988: {
        winner: M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg"),
        nominees: [
          M("Big", 2280, "/eWhCDJiwxvx3YXkAFRiHjimnF0j.jpg"),
          M("A Fish Called Wanda", 623, "/hkSGFNVfEEUXFCxRZDITFHVhUlu.jpg"),
          M("Midnight Run", 9013, "/yx0touyDQ9enWDsFgS4MbBwCSNd.jpg"),
          M("Who Framed Roger Rabbit", 856, "/lYfRc57Kx9VgLZ48iulu0HKnM15.jpg")
        ]
      },
      1987: {
        winner: M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg"),
        nominees: [
          M("Baby Boom", 11215, "/4Jy5U4HITJWUDYJc1NGgJLIjbWz.jpg"),
          M("Broadcast News", 12626, "/kQNR1Lc0qAF5xuBySpDn481KVjb.jpg"),
          M("Dirty Dancing", 88, "/9Jw6jys7q9gjzVX5zm1z0gC8gY9.jpg"),
          M("Moonstruck", 2039, "/2mnVWpvsHEHHnfvLn1NXYVvBGl5.jpg")
        ]
      },
      1986: {
        winner: M("Prizzi's Honor", 2075, "/5azGfZXuUFYjYfz6etYOdlyLXwL.jpg"),
        nominees: [
          M("Crimes of the Heart", 48259, "/yet0Ww2A7f5qT7MisDuIBSXdV3r.jpg"),
          M("Crocodile Dundee", 9671, "/pduPduL1ub5kok3lPYT15ryC9L6.jpg"),
          M("Down and Out in Beverly Hills", 9941, "/5bfbUsKcJD4HHFmlTcpHBI2wR2k.jpg"),
          M("Little Shop of Horrors", 10776, "/iKkbN17OmFosaW6asCNZTTsyvpu.jpg"),
          M("Peggy Sue Got Married", 10013, "/tfuQcvQmURiMqB2VPwytU3cPpEm.jpg")
        ]
      },
      1985: {
        winner: M("The Jewel of the Nile", 10303, "/6VjsIhnIcrz2XdQVHdsMj5DdSa1.jpg"),
        nominees: [
          M("Back to the Future", 105, "/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg"),
          M("A Chorus Line", 1816, "/bQzbO6y6gxePrEcU57Su8HJ9UdH.jpg"),
          M("Cocoon", 10328, "/wqNNm36j3nkucAucHEGAW5pNZcd.jpg"),
          M("The Purple Rose of Cairo", 10849, "/ccsint43E44B7NGceEhVimD93Yt.jpg")
        ]
      },
      1984: {
        winner: M("Yentl", 10269, "/AcCX4tKqwP5BTfRTQEqZW3qabl3.jpg"),
        nominees: [
          M("Beverly Hills Cop", 90, "/eBJEvKkhQ0tUt1dBAcTEYW6kCle.jpg"),
          M("Ghostbusters", 620, "/7E8nLijS9AwwUEPu2oFYOVKhdFA.jpg"),
          M("Micki & Maude", 42094, "/nMezOmpy8pIqYxX3fMPfmUXo1Al.jpg"),
          M("Splash", 2619, "/7FutTsMWBwVhjk1Ujf1wtndUVZh.jpg")
        ]
      },
      1983: {
        winner: M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg"),
        nominees: [
          M("The Big Chill", 12560, "/rU8kjMEL5Mn0EWm3gOShPHBEZ4l.jpg"),
          M("Flashdance", 535, "/ziiy6ORt8BlxWFXskBChBMInvDA.jpg"),
          M("Trading Places", 1621, "/8mBuLCOcpWnmYtZc4aqtvDXslv6.jpg"),
          M("Zelig", 11030, "/bfs67JaV4B5xVBvtXd3O4R7nk9G.jpg")
        ]
      },
      1982: {
        winner: M("Arthur", 13665, "/m8yOFRDVZPxtsr4D2hVdzls6q6t.jpg"),
        nominees: [
          M("The Best Little Whorehouse in Texas", 16363, "/yw3PNR3NVeKKfLWv8SgFQnXoHZh.jpg"),
          M("Diner", 13776, "/2vKIdZ6JkFIzcQeaHg3xtdvOyRO.jpg"),
          M("My Favorite Year", 31044, "/xksAhZJx1WmHM03OaePNe9IiEBt.jpg"),
          M("Victor/Victoria", 12614, "/mCjXcPRM3Rc7gOCGeVrBdPvF2bk.jpg")
        ]
      },
      1981: {
        winner: M("Coal Miner's Daughter", 16769, "/bzHFDAdUad4QcHPi2UOqvaQKNWA.jpg"),
        nominees: [
          M("The Four Seasons", 25113, "/7xKPkL7kHdgq3YI08tXISCQwRJH.jpg"),
          M("Pennies from Heaven", 17450, "/7dlangnB2vOcviHEwWy1IRGHLtk.jpg"),
          M("S.O.B.", 27225, "/6irq1xZdQ8rC4AuxPDlA9NkPyYs.jpg"),
          M("Zoot Suit", 76397, "/itSXh6MxBZWvQ7xhSxusk2RwjfM.jpg")
        ]
      },
      1980: {
        winner: M("Breaking Away", 20283, "/k7b5GsVJK1hfdwoYqcczN9pBba6.jpg"),
        nominees: [
          M("Airplane!", 813, "/7Q3efxd3AF1vQjlSxnlerSA7RzN.jpg"),
          M("Fame", 3537, "/ewuGn4kxsqbYfgSO8Y5kzYlBcKE.jpg"),
          M("The Idolmaker", 42159, "/sQoGkwIMsfIhfC0ukouBvWOTIpK.jpg"),
          M("Melvin and Howard", 38772, "/1oN3ZQPyJcSqoj0An39FSD8VFmC.jpg")
        ]
      },
      1979: {
        winner: M("Heaven Can Wait", 12185, "/h1yOiO9cow6gwmGxSAWvPdY4lhJ.jpg"),
        nominees: [
          M("10", 9051, "/uUCr4WTogPnb7LOILL8opxSyxGw.jpg"),
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg"),
          M("Hair", 10654, "/qrZIlVCL9UyEBsgOGbisNzuWjX.jpg"),
          M("The Rose", 16323, "/3hYyA2g5r0TDRbkSAOEeKelylh2.jpg")
        ]
      },
      1978: {
        winner: M("The Goodbye Girl", 14741, "/xdaPFRARLPJuSdQIfxKVJSCOsmD.jpg"),
        nominees: [
          M("California Suite", 26686, "/fvS3cG46xStDuUYoP7wAx1ieXsO.jpg"),
          M("Foul Play", 15659, "/mk3enoeLNRXRnYGxKcvPXYY1xci.jpg"),
          M("Grease", 621, "/2rM7fQKpb7cs1Iq7IBqub9LFDzJ.jpg"),
          M("Movie Movie", 85420, "/ibbixbVqqAcs2fot7dUcyOALFsD.jpg")
        ]
      },
      1977: {
        winner: M("A Star Is Born", 19610, "/3Hr63lBDhvYGpSd8HxDpWvowZpY.jpg"),
        nominees: [
          M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg"),
          M("High Anxiety", 12535, "/qVuSJaGnomSPon8x3mIYywFGgD8.jpg"),
          M("New York, New York", 12637, "/1nD40aUcPAxYdE1WxERrTjZuFGe.jpg"),
          M("Saturday Night Fever", 11009, "/ylA7E5Md21aqgzxbwa2dFxX8LKV.jpg")
        ]
      },
      1976: {
        winner: M("The Sunshine Boys", 16561, "/hgMB8Ixl4zvzn2ttfnEHUdJLmre.jpg"),
        nominees: [
          M("Bugsy Malone", 8446, "/j9BPl3jkNCFgsYe5poKrirUqrf8.jpg"),
          M("The Pink Panther Strikes Again", 12268, "/GGCch9LNAKwp4ZADAcNz1hd1dn.jpg"),
          M("The Ritz", 63848, "/h5z2AvjDFVMJmGN2EE4vS7tSw1C.jpg"),
          M("Silent Movie", 10970, "/AeaoOSqEU3elkpDAlKbIWcdKLJ8.jpg")
        ]
      },
      1975: {
        winner: M("The Longest Yard", 4985, "/fejSpoFU4sq2g6n1JA2NY3KjRxW.jpg"),
        nominees: [
          M("Funny Lady", 39282, "/3F6BcS3hW9YolzHuAMluXSiDES7.jpg"),
          M("The Return of the Pink Panther", 11843, "/rfuqs7qnYc2SkB2FSxeWH7qDAMP.jpg"),
          M("Shampoo", 31121, "/6jmFvXPV6OhtX3AkAVnH7rwdeUJ.jpg"),
          M("Tommy", 11326, "/pAImVnqBJwoFAKrcpAe17JjLGUs.jpg")
        ]
      },
      1974: {
        winner: M("American Graffiti", 838, "/1tjLivPad2PX8FAzWko7FPIb8d2.jpg"),
        nominees: [
          M("The Front Page", 987, "/r4RtbJk8wVyZ1yk6yBZjzGD4ANU.jpg"),
          M("Harry and Tonto", 42448, "/2JIy2g5UoHBnmNnFpSU7oq5xdTG.jpg"),
          M("The Little Prince", 37627, "/xAUiufPCoU8P4F1w4MqpjcxIVCO.jpg"),
          M("The Three Musketeers", 2926, "/6qjW1e31k2XhcWpzGz6lgHcRt5W.jpg")
        ]
      },
      1973: {
        winner: M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg"),
        nominees: [
          M("Jesus Christ Superstar", 12545, "/2NQgIjHxYyMJZWeUFH5cuKhN4nh.jpg"),
          M("Paper Moon", 11293, "/3GHG0kTcBWHKdXjj3RdK8GjBCd6.jpg"),
          M("Tom Sawyer", 42473, "/In4e2cLbkemK8t2bBfisgT0iqU.jpg"),
          M("A Touch of Class", 42458, "/iEjIwaaXlg8fK7uyNdQU2ityj8v.jpg")
        ]
      },
      1972: {
        winner: M("Fiddler on the Roof", 14811, "/v65PHx7Q6Jx0anyNeUOX07SJic9.jpg"),
        nominees: [
          M("Avanti!", 12530, "/dxhQzsBIjWMRu7rqprX4I2WzyEo.jpg"),
          M("Butterflies Are Free", 55106, "/qCBy94qp7D6tGspX3M0ZbkGPQ1g.jpg"),
          M("1776", 14902, "/o50REDExdajGxTWczsmC3qcawGr.jpg"),
          M("Travels with My Aunt", 5183, "/2bycdsCdZ7oqZsLbViWRp2fnHEg.jpg")
        ]
      },
      1971: {
        winner: M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg"),
        nominees: [
          M("The Boy Friend", 31515, "/4vhT6YOJ99YeFygYfx8WyzyVJxA.jpg"),
          M("Kotch", 76002, "/yPyMVlAD8F159i9uIyPgxwnmmLm.jpg"),
          M("A New Leaf", 36850, "/2yKcVFrizqpBBzZBEBvvBR3JKJF.jpg"),
          M("Plaza Suite", 42514, "/yZ5eDobhO60wK4snbX6vtlz0Agh.jpg")
        ]
      },
      1970: {
        winner: M("The Secret of Santa Vittoria", 30298, "/uX4xHo8GptvEbkch6i7OpWiM1L0.jpg"),
        nominees: [
          M("Diary of a Mad Housewife", 31677, "/loZFqYvqqzAhehLcbZq6djNo0JA.jpg"),
          M("Lovers and Other Strangers", 42593, "/uIcFAUNHg9aGvT4kznkYd0bGAd4.jpg"),
          M("The Owl and the Pussycat", 42597, "/yGzDvJ99qHM1rpQef8wlm2Cxchl.jpg"),
          M("Scrooge", 13765, "/eadjJGFdbZdhXSjtokmay7NjVHi.jpg")
        ]
      },
      1969: {
        winner: M("The Secret of Santa Vittoria", 30298, "/uX4xHo8GptvEbkch6i7OpWiM1L0.jpg"),
        nominees: [
          M("Cactus Flower", 28289, "/oabi6jdkxP3KHMNywKn6nQeDzQZ.jpg"),
          M("Goodbye, Columbus", 42604, "/yEfA6HiXipVZdHvxiagV6MxuDNS.jpg"),
          M("Hello, Dolly!", 14030, "/aPZOt9BR3gnk1RyX924ySq81S4P.jpg"),
          M("Paint Your Wagon", 20391, "/fwnYGuba3ZSM2bXwBZZs4DqqKTl.jpg")
        ]
      },
      1968: {
        winner: M("Oliver!", 17917, "/1XJgoaOWKrqxkKeBKWLKSigqG8c.jpg"),
        nominees: [
          M("Finian's Rainbow", 42622, "/7vPJBLw9GL0FlJXXTgZqWnwMzK9.jpg"),
          M("Funny Girl", 16085, "/fg7tnjd4dBeIDvEO80CGq958CCt.jpg"),
          M("The Odd Couple", 11356, "/d3dKPpzEi7WfgmoMnMwWyQnd2ja.jpg"),
          M("Yours, Mine and Ours", 27983, "/sL6uuFSapJNAGYcA4SrUHO5X4gs.jpg")
        ]
      },
      1967: {
        winner: M("The Graduate", 37247, "/z1Z1tZMR66RxcNeHbwoEhYeqOlP.jpg"),
        nominees: [
          M("Camelot", 18978, "/1ohPMbfmQVg0Zzy9wkySm1w8Kr7.jpg"),
          M("Doctor Dolittle", 16081, "/rViuZo27U8wcZHGuRliv9LfmhjV.jpg"),
          M("The Taming of the Shrew", 25560, "/2LpU3kyg1PowiQoEHf7oUXOUmVa.jpg"),
          M("Thoroughly Modern Millie", 32489, "/ce8rBGFR0naGsp6mKy9CNKn9iSa.jpg")
        ]
      },
      1966: {
        winner: M("The Russians Are Coming! The Russians Are Coming!", 31918, "/sgo7cQg6Zo0xuCgb8ckou0RX4Bj.jpg"),
        nominees: [
          M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg"),
          M("Georgy Girl", 42719, "/2v6ezHOqJM2HpSHiGWqLj0Mqs78.jpg"),
          M("Gambit", 28270, "/1MchaxoMtROoioSAwjLd5FEp6D.jpg"),
          M("A Funny Thing Happened on the Way to the Forum", 17768, "/h3S9DZMUZNsAqd8ZNBed7ttPWXk.jpg")
        ]
      },
      1965: {
        winner: M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg"),
        nominees: [
          M("Cat Ballou", 11694, "/3WJmB1F5z4mLwt84i1FuIrSYEe.jpg"),
          M("The Great Race", 11575, "/9rL8GWuFdO3fLXcNV9rZRHskoOn.jpg"),
          M("Those Magnificent Men in Their Flying Machines or How I Flew from London to Paris in 25 Hours 11 Minutes", 10338, "/wcGELNaQ8TbiMUpAnkKLl5g09OO.jpg"),
          M("A Thousand Clowns", 42731, "/tXPsmtVy3T5Whz20LwiscprCdCT.jpg")
        ]
      },
      1964: {
        winner: M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg"),
        nominees: [
          M("Father Goose", 30295, "/Tp4vSQef0qsI78M90SsZZLJzPE.jpg"),
          M("Mary Poppins", 433, "/pHyWpWn2pRIfhS3Arcn4SKtKKW4.jpg"),
          M("The Unsinkable Molly Brown", 42797, "/itmZdJShq5cbzeOqGsDKZiwGNci.jpg"),
          M("The World of Henry Orient", 19662, "/tMIRjDgsEj15RXEhMrgSqROUP7u.jpg")
        ]
      },
      1963: {
        winner: M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg"),
        nominees: [
          M("Bye Bye Birdie", 25167, "/u3m2kU5aFj6V6cNYOd9a22Iia7O.jpg"),
          M("Irma la Douce", 2690, "/5TgL8ql6WwXWmX4EvBL4geJ7gx5.jpg"),
          M("It's a Mad, Mad, Mad, Mad World", 11576, "/j4mWzOisSHFkaqIkq34l2mm8a5K.jpg"),
          M("A Ticklish Affair", 107231, "/tRjPKWfJCkCXf8oLNhmKA8D2U8q.jpg"),
          M("Under the Yum-Yum Tree", 43750, "/20oQRYfHaSfGGCOKBEh1M1CpgCc.jpg")
        ]
      },
      1962: {
        winner: M("The Music Man", 13671, "/4yo6qaqVF1IThXMapo4yW9BRWjV.jpg"),
        nominees: [
          M("Billy Rose's Jumbo", 42991, "/kmvuW4U5zjawlCNDqbJW5fMSOtl.jpg"),
          M("Boys' Night Out", 35057, "/4mcM4SB7OtGeGAXNAMEhNFve2pG.jpg"),
          M("Gypsy", 39391, "/qmeyhwe7pHJ30n6uLq8swyW1Juz.jpg"),
          M("That Touch of Mink", 12708, "/eEG29x9cljGKL2GPmRK9IByyL9e.jpg"),
          M("The Wonderful World of the Brothers Grimm", 28367, "/zElwCWdMG7A6xThgesRxNrgD2MP.jpg")
        ]
      },
      1961: {
        winner: M("A Majority of One", 158800, "/xHrC85LCp80Bug08VqSjwUC5jLB.jpg"),
        nominees: [
          M("Breakfast at Tiffany's", 164, "/79xm4gXw4l7A5D0XukUOJRocFYQ.jpg"),
          M("One, Two, Three", 430, "/yWQE227ub1frfnjP5HZy0wLF0wu.jpg"),
          M("The Parent Trap", 19186, "/jaZFWy6ZAvQoMW2mo9xP5gx4URo.jpg"),
          M("Pocketful of Miracles", 248, "/xjXwcGJjT5tE22wazQUYH32HwU8.jpg")
        ]
      },
      1960: {
        winner: M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg"),
        nominees: [
          M("The Facts of Life", 39219, "/jgduHeBEmpCdzHKo9wteKj8WO8l.jpg"),
          M("The Grass Is Greener", 25767, "/3peOV81MRImLDX8bnGUHOJSB0lN.jpg"),
          M("It Started in Naples", 38151, "/cqgViygbWqqGJs1AOPKRcKEj4rg.jpg"),
          M("Our Man in Havana", 25495, "/6R6zIKywC8rNo6fT1YBDeEAUmEb.jpg")
        ]
      },
      1959: {
        winner: M("Some Like It Hot", 239, "/hVIKyTK13AvOGv7ICmJjK44DTzp.jpg"),
        nominees: [
          M("But Not for Me", 121234, "/onoMReVeUaBnZF1DUCVmidTlxRn.jpg"),
          M("Operation Petticoat", 9660, "/pIsm8JvpFZidVxKexv5UgoCjwpZ.jpg"),
          M("Pillow Talk", 4952, "/ugvyj5nl9QmTYuaGUTefVYBDePE.jpg"),
          M("Who Was That Lady?", 105406, "/aRf7LnZD6zOTHbM4gpVXDmWibpU.jpg")
        ]
      },
      1958: {
        winner: M("Auntie Mame", 16347, "/uH810rwkYEbUaV6IlwTaAExbXUm.jpg"),
        nominees: [
          M("Bell, Book and Candle", 2006, "/z3MLtVFPT2wIkKCBSE2yBgDmeXI.jpg"),
          M("Indiscreet", 22874, "/sv4ao2ceHx2Ii1I2SsAmCqr7k6K.jpg"),
          M("Me and the Colonel", 114060, "/i9Dz3TbEhc9v4w08IapLtIFjdeu.jpg"),
          M("The Perfect Furlough", 225943, "/yrbtmgxifaVcM8C63UhaiubpzJ6.jpg")
        ]
      },
      1957: {
        winner: M("Les Girls", 43232, "/78ot7b75r5yWKt0rW9XjXqH7GY1.jpg"),
        nominees: [
          M("Don't Go Near the Water", 109441, "/r4uArpPWFpp0KkAPCoiFgMBTHw3.jpg"),
          M("Love in the Afternoon", 18299, "/jCHVviBhRQ7OkJFQfziO2N2ZJmh.jpg"),
          M("Pal Joey", 33734, "/5vWaDXDBxEv9ahwF8aSigbC0ADy.jpg"),
          M("Silk Stockings", 43239, "/kuV34rCOrcDt6Ii3149AlJs9bpM.jpg")
        ]
      },
      1956: {
        winner: M("The King and I", 16520, "/wUfaP0lLaMpZzp5CrHyII5Vd7cp.jpg"),
        nominees: [
          M("Bus Stop", 24010, "/oXZiz5zIyynjQMJMBbXijS4434z.jpg"),
          M("The Opposite Sex", 43311, "/piXpVWU67Y9XXJKSHAlP95vd3EG.jpg"),
          M("The Solid Gold Cadillac", 78331, "/ennpt6fPoCQSzULMr6oK1CXtIx2.jpg"),
          M("The Teahouse of the August Moon", 43313, "/v2G1Vh14X9NslrHR9zGlGoV1i4M.jpg")
        ]
      },
      1955: { winner: M("Guys and Dolls", 4825, "/mrSM6laJJLBVdMdWfeNRa1innnk.jpg"), nominees: [] },
      1954: { winner: M("Carmen Jones", 51044, "/5Vo4NeE7dlXBUaikbGnUOmUNHJ3.jpg"), nominees: [] },
      1952: { winner: M("With a Song in My Heart", 65787, "/KePfsUc63Z9J0xEKxwydlzNOkP.jpg"), nominees: [] },
      1951: { winner: M("An American in Paris", 2769, "/lyDXkvG53ldz6Cf7dbjJl7TaoP5.jpg"), nominees: [] }
    },

    "Best Director": {
      2026: {
        winner: M("One Battle After Another", 1054867, "/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg", "Paul Thomas Anderson"),
        nominees: [
          M("Sinners", 1233413, "/qTvFWCGeGXgBRaINLY1zqgTPSpn.jpg", "Ryan Coogler"),
          M("Frankenstein Created Robyn", 1604013, "/mTVU8b1UydB1nlEEirsvFNSuyrt.jpg", "Guillermo del Toro"),
          M("It Was Just an Accident", 1456349, "/eNYGj2DG3n8OrVPTfYunpPW9uas.jpg", "Jafar Panahi"),
          M("Sentimental Value", 1124566, "/pz9NCWxxOk3o0W3v1Zkhawrwb4i.jpg", "Joachim Trier"),
          M("Hamnet", 858024, "/vbeyOZm2bvBXcbgPD3v6o94epPX.jpg", "Chloé Zhao")
        ]
      },
      2025: {
        winner: M("The Brutalist", 549509, "/vP7Yd6couiAaw9jgMd5cjMRj3hQ.jpg", "Brady Corbet"),
        nominees: [
          M("Emilia Pérez", 974950, "/dRlzWIUljlcaWMvVdHlVkK4HrKj.jpg", "Jacques Audiard"),
          M("Anora", 1064213, "/cgXk2tNYhJZLXdBDO5DidAVzQ82.jpg", "Sean Baker"),
          M("Conclave", 974576, "/vYEyxF1UT779RiEalpMjUT6kfdf.jpg", "Edward Berger"),
          M("The Substance", 933260, "/lqoMzCcZYEFK729d6qzt349fB4o.jpg", "Coralie Fargeat"),
          M("All We Imagine as Light", 927547, "/ruImrzB4POsrgwCMozmOBV67zs5.jpg", "Payal Kapadia")
        ]
      },
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "Christopher Nolan"),
        nominees: [
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg", "Bradley Cooper"),
          M("Barbie", 346698, "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", "Greta Gerwig"),
          M("Poor Things", 792307, "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg", "Yorgos Lanthimos"),
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg", "Martin Scorsese"),
          M("Past Lives", 666277, "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg", "Celine Song")
        ]
      },
      2023: {
        winner: M("The Fabelmans", 804095, "/h7llKkqkkJtJrTOaDLuVeUYDQ7I.jpg", "Steven Spielberg"),
        nominees: [
          M("Avatar: The Way of Water", 76600, "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", "James Cameron"),
          M("Everything Everywhere All at Once", 545611, "/u68AjlvlutfEIcpmbYpKcdi09ut.jpg", "Daniel Kwan & Daniel Scheinert"),
          M("Elvis", 614934, "/rva3UhKaMeiB0Vej5A2pm1leX7K.jpg", "Baz Luhrmann"),
          M("The Banshees of Inisherin", 674324, "/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg", "Martin McDonagh")
        ]
      },
      2022: {
        winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg", "Jane Campion"),
        nominees: [
          M("Belfast", 777270, "/4xs6nHNBjYpRymw8ZQmnVIbJ8Xa.jpg", "Kenneth Branagh"),
          M("The Lost Daughter", 554230, "/t1oLNRFixpFOVsyz1HCqCUW3wiW.jpg", "Maggie Gyllenhaal"),
          M("West Side Story", 511809, "/yfz3IUoYYSY32tkb97HlUBGFsnh.jpg", "Steven Spielberg"),
          M("Dune", 438631, "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", "Denis Villeneuve")
        ]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg", "Chloé Zhao"),
        nominees: [
          M("Promising Young Woman", 582014, "/73QoFJFmUrJfDG2EynFjNc5gJxk.jpg", "Emerald Fennell"),
          M("Manka and Marika", 900683, "", "David Fincher"),
          M("One Night in Miami...", 661914, "/1DLUb9PTDqXMSgsD7RmiJs7ZJIx.jpg", "Regina King"),
          M("The Whole World is Watching: Inside Aaron Sorkin's Trial of the Chicago 7", 832211, "", "Aaron Sorkin")
        ]
      },
      2020: {
        winner: M("1917", 530915, "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg", "Sam Mendes"),
        nominees: [
          M("Parasite", 496243, "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", "Bong Joon-ho"),
          M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", "Todd Phillips"),
          M("The Irishman", 398978, "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg", "Martin Scorsese"),
          M("Once Upon a Time... in Hollywood", 466272, "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg", "Quentin Tarantino")
        ]
      },
      2019: {
        winner: M("Roma", 426426, "/dtIIyQyALk57ko5bjac7hi01YQ.jpg", "Alfonso Cuarón"),
        nominees: [
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg", "Bradley Cooper"),
          M("Green Book", 490132, "/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg", "Peter Farrelly"),
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg", "Spike Lee"),
          M("Vice", 429197, "/1gCab6rNv1r6V64cwsU4oEr649Y.jpg", "Adam McKay")
        ]
      },
      2018: {
        winner: M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg", "Guillermo del Toro"),
        nominees: [
          M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg", "Martin McDonagh"),
          M("Dunkirk", 374720, "/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg", "Christopher Nolan"),
          M("All the Money in the World", 446791, "/q6nE9Hf0ezszjI4DbCxwzQ73MMy.jpg", "Ridley Scott"),
          M("The Post", 446354, "/h4XG3g6uMMPIBPjAoQhC2QIMdkl.jpg", "Steven Spielberg")
        ]
      },
      2017: {
        winner: M("La La Land", 313369, "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", "Damien Chazelle"),
        nominees: [
          M("Nocturnal Animals", 340666, "/mdLDgQBD0va09npSQX5Zgo2evXM.jpg", "Tom Ford"),
          M("Hacksaw Ridge", 324786, "/wuz8TjCIWR2EVVMuEfBnQ1vuGS3.jpg", "Mel Gibson"),
          M("Moonlight", 376867, "/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg", "Barry Jenkins"),
          M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg", "Kenneth Lonergan")
        ]
      },
      2016: {
        winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg", "Alejandro G. Iñárritu"),
        nominees: [
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg", "Todd Haynes"),
          M("Spotlight", 314365, "/8DPGG400FgaFWaqcv11n8mRd2NG.jpg", "Tom McCarthy"),
          M("Mad Max: Fury Road", 76341, "/hA2ple9q4qnwxp3hKVNhroipsir.jpg", "George Miller"),
          M("The Martian", 286217, "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg", "Ridley Scott")
        ]
      },
      2015: {
        winner: M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg", "Richard Linklater"),
        nominees: [
          M("The Grand Budapest Hotel", 120467, "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", "Wes Anderson"),
          M("Selma", 273895, "/wq4lhMc4BuOyQqe1ZGzhxLyy3Uk.jpg", "Ava DuVernay"),
          M("Gone Girl", 210577, "/ts996lKsxvjkO2yiYG0ht4qAicO.jpg", "David Fincher"),
          M("Birdman", 435092, "/9n0u3Ee7OUjgeyF5kIwahxkf4xm.jpg", "Alejandro G. Iñárritu")
        ]
      },
      2014: {
        winner: M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg", "Alfonso Cuarón"),
        nominees: [
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg", "Paul Greengrass"),
          M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg", "Steve McQueen"),
          M("Nebraska", 129670, "/o1t2Mw18EEBnl8v4Nby3PFjxnM1.jpg", "Alexander Payne"),
          M("American Hustle", 168672, "/z6O1KDhfWDTm5ZBr6Ovr0eg8LqO.jpg", "David O. Russell")
        ]
      },
      2013: {
        winner: M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg", "Ben Affleck"),
        nominees: [
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg", "Kathryn Bigelow"),
          M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg", "Ang Lee"),
          M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg", "Steven Spielberg"),
          M("Django Unchained", 68718, "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", "Quentin Tarantino")
        ]
      },
      2012: {
        winner: M("Hugo", 44826, "/1dxRq3o3l3bVWNRvvSb7rRf68qp.jpg", "Martin Scorsese"),
        nominees: [
          M("Midnight in Paris", 59436, "/4wBG5kbfagTQclETblPRRGihk0I.jpg", "Woody Allen"),
          M("The Ides of March", 10316, "/w8t4UnJnC24S9ygoaFgmMzRbErd.jpg", "George Clooney"),
          M("The Artist", 74643, "/z68py0ZqPgeacGPG54AGVRbNBS7.jpg", "Michel Hazanavicius"),
          M("The Descendants", 65057, "/8cDq5UlOPYeKm39okALCEOsZPxk.jpg", "Alexander Payne")
        ]
      },
      2011: {
        winner: M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", "David Fincher"),
        nominees: [
          M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg", "Darren Aronofsky"),
          M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg", "Tom Hooper"),
          M("Inception", 27205, "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", "Christopher Nolan"),
          M("The Fighter", 45317, "/xfsFerGhO1h6rLk8vwLgMyQ8WVJ.jpg", "David O. Russell")
        ]
      },
      2010: {
        winner: M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", "James Cameron"),
        nominees: [
          M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg", "Kathryn Bigelow"),
          M("Invictus", 22954, "/runuhBAAX7PmdjGhqRKCyl4bh7z.jpg", "Clint Eastwood"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg", "Jason Reitman"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg", "Quentin Tarantino")
        ]
      },
      2009: {
        winner: M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", "James Cameron"),
        nominees: [
          M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg", "Kathryn Bigelow"),
          M("Invictus", 22954, "/runuhBAAX7PmdjGhqRKCyl4bh7z.jpg", "Clint Eastwood"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg", "Jason Reitman"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg", "Quentin Tarantino")
        ]
      },
      2008: {
        winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg", "Danny Boyle"),
        nominees: [
          M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg", "Stephen Daldry"),
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg", "David Fincher"),
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg", "Ron Howard"),
          M("Revolutionary Road", 4148, "/cvkD3yiVXLg3as8EAG3LaTycONQ.jpg", "Sam Mendes")
        ]
      },
      2007: {
        winner: M("The Diving Bell and the Butterfly", 2013, "/6NkJ4gnLrvLj0PZDW6sNM85JMbj.jpg", "Julian Schnabel"),
        nominees: [
          M("Sweeney Todd: The Demon Barber of Fleet Street", 13885, "/gAW4J1bkRjZKmFsJsIiOBASeoAp.jpg", "Tim Burton"),
          M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg", "Joel Coen & Ethan Coen"),
          M("American Gangster", 4982, "/m7kJge9DG86Bj7hsBW6xFCMyDkY.jpg", "Ridley Scott"),
          M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg", "Joe Wright")
        ]
      },
      2006: {
        winner: M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg", "Martin Scorsese"),
        nominees: [
          M("Flags of Our Fathers", 3683, "/2nkPrhf4YIyMFelfe4zdOnGRYz5.jpg", "Clint Eastwood"),
          M("Letters from Iwo Jima", 1251, "/kZokxQtzMPURvijWYFuvh1fAvnv.jpg", "Clint Eastwood"),
          M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg", "Stephen Frears"),
          M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg", "Alejandro G. Iñárritu")
        ]
      },
      2005: {
        winner: M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg", "Ang Lee"),
        nominees: [
          M("Match Point", 116, "/vHjEVTD8ucuwKSFOZJeyAnTZYli.jpg", "Woody Allen"),
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg", "George Clooney"),
          M("King Kong", 254, "/6a2HY6UmD7XiDD3NokgaBAXEsD2.jpg", "Peter Jackson"),
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg", "Fernando Meirelles"),
          M("Munich", 612, "/iUekaw96QLInZpsNwRTlRKrZgwm.jpg", "Steven Spielberg")
        ]
      },
      2004: {
        winner: M("Million Dollar Baby", 70, "/jcfEqKdWF1zeyvECPqp3mkWLct2.jpg", "Clint Eastwood"),
        nominees: [
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg", "Marc Forster"),
          M("Ray", 1677, "/tSPC7sO2XYNL9QcMmK88tuUALL5.jpg", "Taylor Hackford"),
          M("Sideways", 9675, "/zOsaxYLgvZVU7cJBpPn8CuE0MrP.jpg", "Alexander Payne"),
          M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg", "Martin Scorsese")
        ]
      },
      2003: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", "Peter Jackson"),
        nominees: [
          M("Lost in Translation", 153, "/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg", "Sofia Coppola"),
          M("Mystic River", 322, "/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg", "Clint Eastwood"),
          M("Cold Mountain", 2289, "/j0AJeeR5CQPDFh0otyWyCWREHO8.jpg", "Anthony Minghella"),
          M("Master and Commander: The Far Side of the World", 8619, "/s1cVTQEZYn4nSjZLnFbzLP0j8y2.jpg", "Peter Weir")
        ]
      },
      2002: {
        winner: M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg", "Martin Scorsese"),
        nominees: [
          M("Talk to Her", 64, "/fWDbQlOWOqjR5jZm98KjGyYmUOw.jpg", "Pedro Almodóvar"),
          M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg", "Stephen Daldry"),
          M("The Lord of the Rings: The Two Towers", 121, "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", "Peter Jackson"),
          M("Chicago", 1574, "/3ED8cWCXY9zkx77Sd0N5qMbsdDP.jpg", "Rob Marshall"),
          M("About Schmidt", 2755, "/tstvsrJHY57hc951lb190alXRQm.jpg", "Alexander Payne")
        ]
      },
      2001: {
        winner: M("Gosford Park", 5279, "/7r8DeZuaaHCiOEbkqZC6MFmwJ69.jpg", "Robert Altman"),
        nominees: [
          M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg", "Ron Howard"),
          M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", "Peter Jackson"),
          M("Moulin Rouge!", 824, "/2kjM5CUZRIU5yOANUowrbJcRL9L.jpg", "Baz Luhrmann"),
          M("Mulholland Drive", 1018, "/x7A59t6ySylr1L7aubOQEA480vM.jpg", "David Lynch"),
          M("A.I. Artificial Intelligence", 644, "/8MZSGX5JORoO72EfuAEcejH5yHn.jpg", "Steven Spielberg")
        ]
      },
      2000: {
        winner: M("Crouching Tiger, Hidden Dragon", 146, "/iNDVBFNz4XyYzM9Lwip6atSTFqf.jpg", "Ang Lee"),
        nominees: [
          M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", "Ridley Scott"),
          M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg", "Steven Soderbergh"),
          M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg", "Steven Soderbergh"),
          M("Sunshine", 17771, "/qcHDFrjClW35u0dSuLjsQEi8gDk.jpg", "Istvan Szabo")
        ]
      },
      1999: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg", "Sam Mendes"),
        nominees: [
          M("The Hurricane", 10400, "/zhnxjsNnnpsBMF5V1H7Pzkec45Y.jpg", "Norman Jewison"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg", "Neil Jordan"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg", "Michael Mann"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg", "Anthony Minghella")
        ]
      },
      1998: {
        winner: M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg", "Steven Spielberg"),
        nominees: [
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg", "Shekhar Kapur"),
          M("Shakespeare in Love", 1934, "/zdW7jdzPi4J9KZR3TyY2jn3Xh5e.jpg", "John Madden"),
          M("The Horse Whisperer", 547, "/ptkDeHY2mRJVyNRyxb9TgyAjTYs.jpg", "Robert Redford"),
          M("The Truman Show", 37165, "/vuza0WqY239yBXOadKlGwJsZJFE.jpg", "Peter Weir")
        ]
      },
      1997: {
        winner: M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", "James Cameron"),
        nominees: [
          M("As Good as It Gets", 2898, "/xXxuJPNUDZ0vjsAXca0O5p3leVB.jpg", "James L. Brooks"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg", "Curtis Hanson"),
          M("The Boxer", 16992, "/wsbNQWMQV4HwwqXtvQUoBfiBzK8.jpg", "Jim Sheridan"),
          M("Amistad", 11831, "/6QqNyIHKow0jngiQgTNBOBrLILM.jpg", "Steven Spielberg")
        ]
      },
      1996: {
        winner: M("The People vs. Larry Flynt", 1630, "/sAgHn7ys6TiVXBDTZ0UBEjinIUk.jpg", "Milos Forman"),
        nominees: [
          M("Fargo", 275, "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", "Joel Coen"),
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg", "Scott Hicks"),
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg", "Anthony Minghella"),
          M("Evita", 8818, "/hkcSlu3PMw0WyC9vHlvML6nK3Id.jpg", "Alan Parker")
        ]
      },
      1995: {
        winner: M("Braveheart", 197, "/or1gBugydmjToAEq7OZY0owwFk.jpg", "Mel Gibson"),
        nominees: [
          M("Leaving Las Vegas", 451, "/wTrFpGe3U65kXTldIUxuM2hmOAK.jpg", "Mike Figgis"),
          M("Apollo 13", 568, "/tVeKscCm2fY1xDXZk8PgnZ87h9S.jpg", "Ron Howard"),
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg", "Ang Lee"),
          M("The American President", 9087, "/yObOAYFIHXHkFPQ3jhgkN2ezaD.jpg", "Rob Reiner"),
          M("Casino", 524, "/gziIkUSnYuj9ChCi8qOu2ZunpSC.jpg", "Martin Scorsese")
        ]
      },
      1994: {
        winner: M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", "Robert Zemeckis"),
        nominees: [
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg", "Robert Redford"),
          M("Natural Born Killers", 241, "/fEKZwT91gxvkAoyPgpNXo8W5fu0.jpg", "Oliver Stone"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", "Quentin Tarantino"),
          M("Legends of the Fall", 4476, "/t1KPGlW0UGd0m515LPQmk2F4nu1.jpg", "Edward Zwick")
        ]
      },
      1993: {
        winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", "Steven Spielberg"),
        nominees: [
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg", "Jane Campion"),
          M("The Fugitive", 5503, "/b3rEtLKyOnF89mcK75GXDXdmOEf.jpg", "Andrew Davis"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg", "James Ivory"),
          M("The Age of Innocence", 10436, "/5Tuyt26v7qNR8Cl3m7ZRx36rduf.jpg", "Martin Scorsese")
        ]
      },
      1992: {
        winner: M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg", "Clint Eastwood"),
        nominees: [
          M("The Player", 10403, "/tZ3kDut2dhFVGkWNEn9xoCHCNAx.jpg", "Robert Altman"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg", "James Ivory"),
          M("A River Runs Through It", 293, "/aVP45oS2cBL4WtZ1kB7r8uarruB.jpg", "Robert Redford"),
          M("A Few Good Men", 881, "/rLOk4z9zL1tTukIYV56P94aZXKk.jpg", "Rob Reiner")
        ]
      },
      1991: {
        winner: M("JFK", 820, "/r0VWVTYlqdRCK5ZoOdNnHdqM2gt.jpg", "Oliver Stone"),
        nominees: [
          M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", "Jonathan Demme"),
          M("The Fisher King", 177, "/hwIYw22HmAUMobV4zsX69MgfVUz.jpg", "Terry Gilliam"),
          M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg", "Barry Levinson"),
          M("The Prince of Tides", 10333, "/1AyeW3YlwfhRwLDeUCW686obceb.jpg", "Barbra Streisand")
        ]
      },
      1990: {
        winner: M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg", "Kevin Costner"),
        nominees: [
          M("The Sheltering Sky", 24016, "/mcaypmWykltQMLjjSuD2vxylZHV.jpg", "Bernardo Bertolucci"),
          M("The Godfather Part III", 242, "/lm3pQ2QoQ16pextRsmnUbG2onES.jpg", "Francis Ford Coppola"),
          M("Reversal of Fortune", 38718, "/jEmFeHPsoyHk6RRZslKzC5NVFad.jpg", "Barbet Schroeder"),
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg", "Martin Scorsese")
        ]
      },
      1989: {
        winner: M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg", "Oliver Stone"),
        nominees: [
          M("Do the Right Thing", 925, "/63rmSDPahrH7C1gEFYzRuIBAN9W.jpg", "Spike Lee"),
          M("When Harry Met Sally...", 639, "/rFOiFUhTMtDetqCGClC9PIgnC1P.jpg", "Rob Reiner"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg", "Peter Weir"),
          M("Glory", 9665, "/pGDzBjZvzmSCIEduQBfESLMiwtp.jpg", "Edward Zwick")
        ]
      },
      1988: {
        winner: M("Bird", 24679, "/rTCp6M98RQAxRl0x0guU9GlH7HS.jpg", "Clint Eastwood"),
        nominees: [
          M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg", "Barry Levinson"),
          M("Running on Empty", 18197, "/kzhyruFxY4Z5Ert8M9tuM2MV8dd.jpg", "Sidney Lumet"),
          M("Working Girl", 3525, "/q2jfFzZvAzjTaArQR0tjilIZ5aJ.jpg", "Mike Nichols"),
          M("Mississippi Burning", 1632, "/wvEx2WbxZXYljQ9vSoq37NgeXcJ.jpg", "Alan Parker"),
          M("Evil Angels", 35119, "/auyoK8OZh1sZldjJfy9RGzS6crV.jpg", "Fred Schepisi")
        ]
      },
      1987: {
        winner: M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg", "Bernardo Bertolucci"),
        nominees: [
          M("Cry Freedom", 12506, "/zEONV1NAzzoQGFFgSIEs7vJzDrN.jpg", "Richard Attenborough"),
          M("Hope and Glory", 32054, "/4xE9oW222uiaJwMWqAdGQw4puOX.jpg", "John Boorman"),
          M("Broadcast News", 12626, "/kQNR1Lc0qAF5xuBySpDn481KVjb.jpg", "James L. Brooks"),
          M("Fatal Attraction", 10998, "/vjB9XwJKnYqFKKjhWcE6WpAf5Ki.jpg", "Adrian Lyne")
        ]
      },
      1986: {
        winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg", "Oliver Stone"),
        nominees: [
          M("Hannah and Her Sisters", 5143, "/gARgIRb2QFRFVrsziwWE389u1pK.jpg", "Woody Allen"),
          M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg", "James Ivory"),
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg", "Roland Joffe"),
          M("Stand by Me", 235, "/vz0w9BSehcqjDcJOjRaCk7fgJe7.jpg", "Rob Reiner")
        ]
      },
      1985: {
        winner: M("Prizzi's Honor", 2075, "/5azGfZXuUFYjYfz6etYOdlyLXwL.jpg", "John Huston"),
        nominees: [
          M("A Chorus Line", 1816, "/bQzbO6y6gxePrEcU57Su8HJ9UdH.jpg", "Richard Attenborough"),
          M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg", "Sydney Pollack"),
          M("The Color Purple", 873, "/6bvxkcTAXyqxGRwo38mxw92D6Xr.jpg", "Steven Spielberg"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg", "Peter Weir")
        ]
      },
      1984: {
        winner: M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg", "Milos Forman"),
        nominees: [
          M("The Cotton Club", 2148, "/qigf5fWSH1tw7z424UVKg71UIOS.jpg", "Francis Ford Coppola"),
          M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg", "Roland Joffe"),
          M("A Passage to India", 15927, "/rvBWlGRKte2U6qElHV13h6JvmSe.jpg", "David Lean"),
          M("Once Upon a Time in America", 311, "/i0enkzsL5dPeneWnjl1fCWm6L7k.jpg", "Sergio Leone")
        ]
      },
      1983: {
        winner: M("Yentl", 10269, "/AcCX4tKqwP5BTfRTQEqZW3qabl3.jpg", "Barbra Streisand"),
        nominees: [
          M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg", "Bruce Beresford"),
          M("Fanny and Alexander", 5961, "/q8jlA3Wc1Z987hNKRFA44g5OugC.jpg", "Ingmar Bergman"),
          M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg", "James L. Brooks"),
          M("Silkwood", 12502, "/7Piz5R5dB6d7v1OWNaIn9GB4qZg.jpg", "Mike Nichols"),
          M("The Dresser", 42122, "/kPIeNAwdN2Ds77Bf7bfZAmDrzoh.jpg", "Peter Yates")
        ]
      },
      1982: {
        winner: M("Gandhi", 783, "/rOXftt7SluxskrFrvU7qFJa5zeN.jpg", "Richard Attenborough"),
        nominees: [
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg", "Costa-Gavras"),
          M("The Verdict", 24226, "/m3DdNJZfBcsTiFe0SwsLChWavrG.jpg", "Sidney Lumet"),
          M("Tootsie", 9576, "/ngyCzZwb9y5sMUCig5JQT4Y33Q.jpg", "Sydney Pollack"),
          M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg", "Steven Spielberg")
        ]
      },
      1981: {
        winner: M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg", "Warren Beatty"),
        nominees: [
          M("Ragtime", 25566, "/vRjyakxRrMfj6sgyUJte9mVI1D9.jpg", "Milos Forman"),
          M("Prince of the City", 32047, "/tdERW77zecB5pkKWWeqbSkns0t4.jpg", "Sidney Lumet"),
          M("Atlantic City", 23954, "/t7COhy9HkznR0gcdhTNwtHmBN31.jpg", "Louis Malle"),
          M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg", "Mark Rydell"),
          M("Raiders of the Lost Ark", 85, "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg", "Steven Spielberg")
        ]
      },
      1980: {
        winner: M("Ordinary People", 16619, "/tJVETEDAKgD3fEh88SHOvMvOQue.jpg", "Robert Redford"),
        nominees: [
          M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg", "David Lynch"),
          M("Tess", 11121, "/xejUFnoAVxzvU95o2jlzG2USmY.jpg", "Roman Polanski"),
          M("The Stunt Man", 42160, "/n7trpLAThW1h67QAlWMQ6IHS47u.jpg", "Richard Rush"),
          M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg", "Martin Scorsese")
        ]
      },
      1979: {
        winner: M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg", "Francis Ford Coppola"),
        nominees: [
          M("Being There", 10322, "/3RO3jbCKEey2T9bYFkYt9xpwen9.jpg", "Hal Ashby"),
          M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg", "Robert Benton"),
          M("The China Syndrome", 988, "/uHwwQIlt4XwpTFhX9ZT1A8xSW7F.jpg", "James Bridges"),
          M("Breaking Away", 20283, "/k7b5GsVJK1hfdwoYqcczN9pBba6.jpg", "Peter Yates")
        ]
      },
      1978: {
        winner: M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg", "Michael Cimino"),
        nominees: [
          M("Interiors", 15867, "/sTPy6Kfa1FRED1eaZdVex8b2MdB.jpg", "Woody Allen"),
          M("Coming Home", 31657, "/jBsYWNBYNEi5EhT1hC8iexcTsWT.jpg", "Hal Ashby"),
          M("Days of Heaven", 16642, "/rwxTYjOZmX2rGhz7avLe1qsjNqe.jpg", "Terrence Malick"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg", "Paul Mazursky"),
          M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg", "Alan Parker")
        ]
      },
      1977: {
        winner: M("The Turning Point", 61280, "/6CD90BQEDexEIMqIwMSnbJStF5x.jpg", "Herbert Ross"),
        nominees: [
          M("Annie Hall", 703, "/dEtjPywhDbAXYjoFfhBC4U9unU7.jpg", "Woody Allen"),
          M("Star Wars", 11, "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", "George Lucas"),
          M("Close Encounters of the Third Kind", 840, "/gCWPB8cF82tqzrS9tvzcO6q6nyz.jpg", "Steven Spielberg"),
          M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg", "Fred Zinnemann")
        ]
      },
      1976: {
        winner: M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg", "Sidney Lumet"),
        nominees: [
          M("Bound for Glory", 42232, "/wMSR2CSPruCPkZDEQ5xjv5xqc05.jpg", "Hal Ashby"),
          M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg", "John G. Avildsen"),
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg", "Alan J. Pakula"),
          M("Marathon Man", 10518, "/uPNgubSiri2yvBQRPtP77ViYjN.jpg", "John Schlesinger")
        ]
      },
      1975: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg", "Milos Forman"),
        nominees: [
          M("Nashville", 3121, "/twl4ovyjb8muFKvZmcCDzPR0hy1.jpg", "Robert Altman"),
          M("Barry Lyndon", 3175, "/znfLskGQnXYB2xcOGM9eInRHPAV.jpg", "Stanley Kubrick"),
          M("Dog Day Afternoon", 968, "/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg", "Sidney Lumet"),
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg", "Steven Spielberg")
        ]
      },
      1974: {
        winner: M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg", "Roman Polanski"),
        nominees: [
          M("A Woman Under the Influence", 29845, "/6EJ4JoTxnH1QmGTE9pPzgtW1cLW.jpg", "John Cassavetes"),
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg", "Francis Ford Coppola"),
          M("The Godfather Part II", 240, "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", "Francis Ford Coppola"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg", "Bob Fosse")
        ]
      },
      1973: {
        winner: M("The Exorcist", 9552, "/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg", "William Friedkin"),
        nominees: [
          M("Last Tango in Paris", 1643, "/dNgdUdNOWfHsZI3lDu6Epig7H2P.jpg", "Bernardo Bertolucci"),
          M("Paper Moon", 11293, "/3GHG0kTcBWHKdXjj3RdK8GjBCd6.jpg", "Peter Bogdanovich"),
          M("American Graffiti", 838, "/1tjLivPad2PX8FAzWko7FPIb8d2.jpg", "George Lucas"),
          M("The Day of the Jackal", 4909, "/vThgcb3JOj99yETg8WChuci4LV2.jpg", "Fred Zinnemann")
        ]
      },
      1972: {
        winner: M("The Godfather", 238, "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", "Francis Ford Coppola"),
        nominees: [
          M("Deliverance", 10669, "/2TrAzNJlHyNYYSkQf6asg3rs2Xr.jpg", "John Boorman"),
          M("Cabaret", 10784, "/fMhOeJ2TvuY46iYGmsowhgRXfnr.jpg", "Bob Fosse"),
          M("Frenzy", 573, "/4SFvqrlSigAt9tnhXFSMyKeJWQk.jpg", "Alfred Hitchcock"),
          M("Avanti!", 12530, "/dxhQzsBIjWMRu7rqprX4I2WzyEo.jpg", "Billy Wilder")
        ]
      },
      1971: {
        winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg", "William Friedkin"),
        nominees: [
          M("The Last Picture Show", 25188, "/7NYePZc0lZrRomtmQsjOJMePTEb.jpg", "Peter Bogdanovich"),
          M("Fiddler on the Roof", 14811, "/v65PHx7Q6Jx0anyNeUOX07SJic9.jpg", "Norman Jewison"),
          M("A Clockwork Orange", 185, "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg", "Stanley Kubrick"),
          M("Summer of '42", 41357, "/4n7m05C2ee3UM5Co2k2BOWqH5o2.jpg", "Robert Mulligan")
        ]
      },
      1970: {
        winner: M("Love Story", 9062, "/5A7SGcT1GlhWfHsCRQQtGe0TpJB.jpg", "Arthur Hiller"),
        nominees: [
          M("M*A*S*H", 651, "/on8Q9LhtHYNhmITjUMpgOUkIG8o.jpg", "Robert Altman"),
          M("Five Easy Pieces", 26617, "/xGLkuMWigSPLBvWiENSMlVq56iE.jpg", "Bob Rafelson"),
          M("Women in Love", 66027, "/uHfThxdQC99LLoe2jKZ1u3vIge2.jpg", "Ken Russell"),
          M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg", "Franklin J. Schaffner")
        ]
      },
      1969: {
        winner: M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg", "Charles Jarrott"),
        nominees: [
          M("Hello, Dolly!", 14030, "/aPZOt9BR3gnk1RyX924ySq81S4P.jpg", "Gene Kelly"),
          M("The Secret of Santa Vittoria", 30298, "/uX4xHo8GptvEbkch6i7OpWiM1L0.jpg", "Stanley Kramer"),
          M("They Shoot Horses, Don't They?", 28145, "/7wVLBgriOQpT5RrufAFCdCSUp7M.jpg", "Sydney Pollack"),
          M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg", "John Schlesinger")
        ]
      },
      1968: {
        winner: M("Rachel, Rachel", 42635, "/67flKS1FKxIiYUjXPqRc39hb9LX.jpg", "Paul Newman"),
        nominees: [
          M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg", "Anthony Harvey"),
          M("Oliver!", 17917, "/1XJgoaOWKrqxkKeBKWLKSigqG8c.jpg", "Carol Reed"),
          M("Funny Girl", 16085, "/fg7tnjd4dBeIDvEO80CGq958CCt.jpg", "William Wyler"),
          M("Romeo and Juliet", 6003, "/vaBQKLbSWkXGTOlsz9ARdJP4lvg.jpg", "Franco Zeffirelli")
        ]
      },
      1967: {
        winner: M("The Graduate", 37247, "/z1Z1tZMR66RxcNeHbwoEhYeqOlP.jpg", "Mike Nichols"),
        nominees: [
          M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg", "Norman Jewison"),
          M("Guess Who's Coming to Dinner", 1879, "/fkHeYWahNbhxhuLefaAg553lYo5.jpg", "Stanley Kramer"),
          M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg", "Arthur Penn"),
          M("The Fox", 74896, "/jzme3QqBk2gbVBOwpffupF3y4Ip.jpg", "Mark Rydell")
        ]
      },
      1966: {
        winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg", "Fred Zinnemann"),
        nominees: [
          M("Alfie", 15598, "/tPUqgfGMkZazRZ1UO41j2Fiib5C.jpg", "Lewis Gilbert"),
          M("A Man and a Woman", 42726, "/boDZQiubhyhksN8fcgM4sXZ2btW.jpg", "Claude Lelouch"),
          M("Who's Afraid of Virginia Woolf?", 396, "/wF7ihB5V5gSm6zxjv3ZhHOpgREI.jpg", "Mike Nichols"),
          M("The Sand Pebbles", 5923, "/muZyCXWoayEtwVkxc0ql48X1h6L.jpg", "Robert Wise")
        ]
      },
      1965: {
        winner: M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg", "David Lean"),
        nominees: [
          M("A Patch of Blue", 33364, "/9eFULnzgoLpO7lvg6FMutGRuNFg.jpg", "Guy Green"),
          M("Darling", 24134, "/cBd5YO9xG7VmRuC8Q27uR3PV9mn.jpg", "John Schlesinger"),
          M("The Sound of Music", 15121, "/c6CrUZypAsBCaRWX0M3RVRDbhNS.jpg", "Robert Wise"),
          M("The Collector", 42740, "/iMiih5FGHwpUCAaJAIkYKl5Hffi.jpg", "William Wyler")
        ]
      },
      1964: {
        winner: M("My Fair Lady", 11113, "/bTXVc29lGSNclf94VIZ49W4gGKl.jpg", "George Cukor"),
        nominees: [
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg", "Michael Cacoyannis"),
          M("Seven Days in May", 23518, "/fgMwyNl7uZeUrnIAqlX7htSQ2O2.jpg", "John Frankenheimer"),
          M("Becket", 15421, "/swWmxVbq0pXv4wwsc2O803PiXR7.jpg", "Peter Glenville"),
          M("The Night of the Iguana", 14703, "/3HY8MSeoj4s0uSWGW135Jlh7eSI.jpg", "John Huston")
        ]
      },
      1963: {
        winner: M("America America", 47249, "/76RffKrNPrfA4TWYkx5wIIOzOlV.jpg", "Elia Kazan"),
        nominees: [
          M("The Caretakers", 85640, "/4sSpMxxCLtAyJiOC4zJtKIsySIw.jpg", "Hall Bartlett"),
          M("The Ugly American", 53650, "/hEBolqvaIRMRBtryWnFBn9ljE7I.jpg", "George Englund"),
          M("Cleopatra", 8095, "/bj7rUGUewofA9cpHt1h36gvDFfy.jpg", "Joseph L. Mankiewicz"),
          M("The Cardinal", 3010, "/y23FoRE97IH9bHFo2OBP5IkKnLq.jpg", "Otto Preminger"),
          M("Tom Jones", 5769, "/yKuZKLMhe74PJzaxYLh2s8h4P2P.jpg", "Tony Richardson"),
          M("Hud", 24748, "/A168bF52vmAIGkC2Qafj7M2EmaE.jpg", "Martin Ritt"),
          M("The Haunting", 11772, "/fmpTnUKTcrpuxLSY23gQMUf9qu7.jpg", "Robert Wise")
        ]
      },
      1962: {
        winner: M("Lawrence of Arabia", 947, "/AiAm0EtDvyGqNpVoieRw4u65vD1.jpg", "David Lean"),
        nominees: [
          M("The Chapman Report", 118955, "/xHlkaDldivwkL9H8qOmb2zyXqNo.jpg", "George Cukor"),
          M("The Music Man", 13671, "/4yo6qaqVF1IThXMapo4yW9BRWjV.jpg", "Morton DaCosta"),
          M("Days of Wine and Roses", 32488, "/cRVl1BR3x3P2NqUv61eveJNJ0ip.jpg", "Blake Edwards"),
          M("The Manchurian Candidate", 982, "/2xQ856kd9hw6bB3OnusGyTvvkwB.jpg", "John Frankenheimer"),
          M("Freud: The Secret Passion", 35806, "/2cguhv8jwEaiwF8pB5xo3RzfXlO.jpg", "John Huston"),
          M("Lolita", 802, "/8Puqbeh0D95DpXFWep1rmH78btu.jpg", "Stanley Kubrick"),
          M("Gypsy", 39391, "/qmeyhwe7pHJ30n6uLq8swyW1Juz.jpg", "Mervyn LeRoy"),
          M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg", "Robert Mulligan"),
          M("Hemingway’s Adventures of a Young Man", 111683, "/8IqWKVSHCmBWICtyrluWPN0TfrN.jpg", "Martin Ritt"),
          M("Iron Brothers", 1259294, "", "Ismael Rodriguez")
        ]
      },
      1961: {
        winner: M("Judgment at Nuremberg", 821, "/b6vYatvui1EXeFYfpDX4rcbueuP.jpg", "Stanley Kramer"),
        nominees: [
          M("El Cid", 16638, "/a6DY3LDlXFUDuXm47zXTOfiisxP.jpg", "Anthony Mann"),
          M("The Guns of Navarone", 10911, "/j6VSFnm20GlkUi8yb7hM5Qfc1fA.jpg", "J. Lee Thompson"),
          M("West Side Story", 1725, "/nzCMu6D5q60i2bVrIQ0DxlRSgCZ.jpg", "Jerome Robbins & Robert Wise"),
          M("The Children's Hour", 20139, "/goyEWixvULM2IRN4KsKibyrJE4J.jpg", "William Wyler")
        ]
      },
      1960: {
        winner: M("Sons and Lovers", 53939, "/7BDlr8XivWmNcDsb5ygnhs8CWiR.jpg", "Jack Cardiff"),
        nominees: [
          M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg", "Richard Brooks"),
          M("Spartacus", 967, "/r0Fgg1GyZgzokaiw2HFQv3oPaL2.jpg", "Stanley Kubrick"),
          M("The Apartment", 284, "/hhSRt1KKfRT0yEhEtRW3qp31JFU.jpg", "Billy Wilder"),
          M("The Sundowners", 43047, "/yGXxKdR3sttc0Gu927wMETZH3al.jpg", "Fred Zinnemann")
        ]
      },
      1959: {
        winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg", "William Wyler"),
        nominees: [
          M("On the Beach", 35412, "/lTDuj5zalrI0fpQel7UfPHTexTK.jpg", "Stanley Kramer"),
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg", "Otto Preminger"),
          M("The Diary of Anne Frank", 2576, "/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg", "George Stevens"),
          M("The Nun's Story", 27029, "/4vNWFhPyjTehPpZsvTnTywwXSiF.jpg", "Fred Zinnemann")
        ]
      },
      1958: {
        winner: M("Gigi", 17281, "/3GSuecnDr4N5ZaqTrwElSzt6eC2.jpg", "Vincente Minnelli"),
        nominees: [
          M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg", "Richard Brooks"),
          M("The Defiant Ones", 11414, "/tGGNyImEXgedDjrCORbC9cTJp0X.jpg", "Stanley Kramer"),
          M("Separate Tables", 43136, "/y8exawP0Je3MXVIS3olpJ2fu07.jpg", "Delbert Mann"),
          M("I Want to Live!", 28577, "/cQoSMLJFPV3d8Mi8iPwwtNto370.jpg", "Robert Wise")
        ]
      },
      1957: {
        winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg", "David Lean"),
        nominees: [
          M("Sayonara", 40885, "/xSXJDamf9vSb1qOiBhOMjB2soDE.jpg", "Joshua Logan"),
          M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", "Sidney Lumet"),
          M("Witness for the Prosecution", 37257, "/bCj4EfuehAlgBwVd3diyWyhuuau.jpg", "Billy Wilder"),
          M("A Hatful of Rain", 37086, "/2TE1JJSBaVf4zr9PpsWs1vpPEt6.jpg", "Fred Zinnemann")
        ]
      },
      1956: {
        winner: M("Baby Doll", 40478, "/1Wj0H6HA7xCy8kWYWOTytqwOqWk.jpg", "Elia Kazan"),
        nominees: [
          M("Around the World in 80 Days", 2897, "/kk6Rrwh0toMz9tjuUHdS4O3v2Rk.jpg", "Michael Anderson"),
          M("Lust for Life", 29592, "/rlK3LG3W41eF3N1tk0SEM7Dln2x.jpg", "Vincente Minnelli"),
          M("Giant", 1712, "/wXGmfJkU83daBsqp9R8LeWguIZd.jpg", "George Stevens"),
          M("War and Peace", 11706, "/f3a1MyH12PSl3LFDahnooGy6mv8.jpg", "King Vidor")
        ]
      },
      1955: { winner: M("Picnic", 39940, "/aKCSA9JUp9JkztAjzODPTrtZmzC.jpg", "Joshua Logan"), nominees: [] },
      1954: { winner: M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg", "Elia Kazan"), nominees: [] },
      1953: { winner: M("From Here to Eternity", 11426, "/xO1LHnh9aQlQFFq1DxyQrOTia1S.jpg", "Fred Zinnemann"), nominees: [] },
      1952: { winner: M("The Greatest Show on Earth", 27191, "/cKI0yGPRh1IlvRKKJRoMZruior8.jpg", "Cecil B. DeMille"), nominees: [] },
      1951: {
        winner: M("Death of a Salesman", 104394, "/xnyRkG1LMQX0NUpROq61GiKW7eJ.jpg", "Laszlo Benedek"),
        nominees: [M("An American in Paris", 2769, "/lyDXkvG53ldz6Cf7dbjJl7TaoP5.jpg", "Vincente Minnelli"), M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg", "George Stevens")]
      },
      1950: {
        winner: M("Sunset Boulevard", 599, "/zt8aQ6ksqK6p1AopC5zVTDS9pKT.jpg", "Billy Wilder"),
        nominees: [
          M("All About Eve", 705, "/blBzZaatPWVuWpXEnPscMA4Xp6m.jpg", "Joseph L. Mankiewicz"),
          M("The Asphalt Jungle", 16958, "/8xsUnT0P2fJWQv9jGDhs3i9Zx2l.jpg", "John Huston"),
          M("Born Yesterday", 24481, "/hPiQUhnkgp2O9bQz9KhSyOjLvGl.jpg", "George Cukor")
        ]
      }
    },

    "Best Drama": {
      2024: {
        winner: M("Oppenheimer", 872585, "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        nominees: [
          M("Anatomy of a Fall", 915935, "/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
          M("Killers of the Flower Moon", 466420, "/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg"),
          M("Imbroda, el legado del maestro", 1254368, "/iL8Je1yRa7arfbpDtO0CE0WyyCN.jpg"),
          M("Past Lives", 666277, "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg"),
          M("The Zone of Interest", 467244, "/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg")
        ]
      },
      2023: {
        winner: M("The Fabelmans", 804095, "/h7llKkqkkJtJrTOaDLuVeUYDQ7I.jpg"),
        nominees: [
          M("Avatar: The Way of Water", 76600, "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"),
          M("Elvis", 614934, "/rva3UhKaMeiB0Vej5A2pm1leX7K.jpg"),
          M("TÁR", 817758, "/dRVAlaU0vbG6hMf2K45NSiIyoUe.jpg"),
          M("Top Gun: Maverick", 361743, "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg")
        ]
      },
      2022: {
        winner: M("The Power of the Dog", 600583, "/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg"),
        nominees: [
          M("Belfast", 777270, "/4xs6nHNBjYpRymw8ZQmnVIbJ8Xa.jpg"),
          M("CODA", 776503, "/BzVjmm8l23rPsijLiNLUzuQtyd.jpg"),
          M("Dune", 438631, "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"),
          M("King Richard", 614917, "/2dfujXrxePtYJPiPHj1HkAFQvpu.jpg")
        ]
      },
      2021: {
        winner: M("Nomadland", 581734, "/dKT8rGDR55cM1vGn7QZLA9Tg9YC.jpg"),
        nominees: [
          M("The Father", 600354, "/pr3bEQ517uMb5loLvjFQi8uLAsp.jpg"),
          M("Manka and Marika", 900683, ""),
          M("Promising Young Woman", 582014, "/73QoFJFmUrJfDG2EynFjNc5gJxk.jpg"),
          M("The Whole World is Watching: Inside Aaron Sorkin's Trial of the Chicago 7", 832211, "")
        ]
      },
      2020: {
        winner: M("1917", 530915, "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg"),
        nominees: [
          M("The Irishman", 398978, "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg"),
          M("Joker", 475557, "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"),
          M("Marriage Story", 492188, "/2JRyCKaRKyJAVpsIHeLvPw5nHmw.jpg"),
          M("The Two Popes", 551332, "/4d4mTSfDIFIbUbMLUfaKodvxYXA.jpg")
        ]
      },
      2019: {
        winner: M("Bohemian Rhapsody", 424694, "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg"),
        nominees: [
          M("BlacKkKlansman", 487558, "/8jxqAvSDoneSKRczaK8v9X5gqBp.jpg"),
          M("Black Panther", 284054, "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"),
          M("If Beale Street Could Talk", 465914, "/76NfwnaZI43gOQove0LU9O23Qjz.jpg"),
          M("A Star Is Born", 332562, "/wrFpXMNBRj2PBiN4Z5kix51XaIZ.jpg")
        ]
      },
      2018: {
        winner: M("Three Billboards Outside Ebbing, Missouri", 359940, "/bRYLt8fV82tdVoDppSFTZIcJiLN.jpg"),
        nominees: [
          M("Call Me by Your Name", 398818, "/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg"),
          M("Dunkirk", 374720, "/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg"),
          M("The Post", 446354, "/h4XG3g6uMMPIBPjAoQhC2QIMdkl.jpg"),
          M("The Shape of Water", 399055, "/9zfwPffUXpBrEP26yp0q1ckXDcj.jpg")
        ]
      },
      2017: {
        winner: M("Moonlight", 376867, "/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg"),
        nominees: [
          M("Hacksaw Ridge", 324786, "/wuz8TjCIWR2EVVMuEfBnQ1vuGS3.jpg"),
          M("Hell or High Water", 338766, "/ljRRxqy2aXIkIBXLmOVifcOR021.jpg"),
          M("Lion", 334543, "/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg"),
          M("Manchester by the Sea", 334541, "/o9VXYOuaJxCEKOxbA86xqtwmqYn.jpg")
        ]
      },
      2016: {
        winner: M("The Revenant", 281957, "/ji3ecJphATlVgWNY0B0RVXZizdf.jpg"),
        nominees: [
          M("Carol", 258480, "/cJeled7EyPdur6TnCA5GYg0UVna.jpg"),
          M("Mad Max: Fury Road", 76341, "/hA2ple9q4qnwxp3hKVNhroipsir.jpg"),
          M("Room", 264644, "/2hHDMeYyZjbGWn0BeNH1cTMxuM7.jpg"),
          M("Spotlight", 314365, "/8DPGG400FgaFWaqcv11n8mRd2NG.jpg")
        ]
      },
      2015: {
        winner: M("Boyhood", 85350, "/2BvtvDUyxiMJ4dmKfiQf4qdOHQN.jpg"),
        nominees: [
          M("Foxcatcher", 87492, "/w6Sl079QtUcQ9dVQ2RP6aN9NBXx.jpg"),
          M("The Imitation Game", 205596, "/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg"),
          M("Selma", 273895, "/wq4lhMc4BuOyQqe1ZGzhxLyy3Uk.jpg"),
          M("The Theory of Everything", 266856, "/kJuL37NTE51zVP3eG5aGMyKAIlh.jpg")
        ]
      },
      2014: {
        winner: M("12 Years a Slave", 76203, "/xdANQijuNrJaw1HA61rDccME4Tm.jpg"),
        nominees: [
          M("Captain Phillips", 109424, "/8Td0kkocW6sD3uRpzwfMfkqMWhx.jpg"),
          M("Gravity", 49047, "/kZ2nZw8D681aphje8NJi8EfbL1U.jpg"),
          M("Philomena", 205220, "/eBUv2GmGdXmCk1AaSOmyiu70hN8.jpg"),
          M("Rush", 96721, "/95BDrWmcfJDEa2WCfjmLgi67jhi.jpg")
        ]
      },
      2013: {
        winner: M("Argo", 68734, "/m5gPWFZFIp4UJFABgWyLkbXv8GX.jpg"),
        nominees: [
          M("Django Unchained", 68718, "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg"),
          M("Life of Pi", 87827, "/iLgRu4hhSr6V1uManX6ukDriiSc.jpg"),
          M("Lincoln", 72976, "/5KeUqW6DpVtf8G9VMuI2l0XIPCo.jpg"),
          M("Zero Dark Thirty", 97630, "/wNSdSSxowM3WIqmPJNg3RagYbwP.jpg")
        ]
      },
      2012: {
        winner: M("The Descendants", 65057, "/8cDq5UlOPYeKm39okALCEOsZPxk.jpg"),
        nominees: [
          M("The Help", 50014, "/3kmfoWWEc9Vtyuaf9v5VipRgdjx.jpg"),
          M("Hugo", 44826, "/1dxRq3o3l3bVWNRvvSb7rRf68qp.jpg"),
          M("The Ides of March", 10316, "/w8t4UnJnC24S9ygoaFgmMzRbErd.jpg"),
          M("Moneyball", 60308, "/4yIQq1e6iOcaZ5rLDG3lZBP3j7a.jpg"),
          M("War Horse", 57212, "/3aRHhvvngFPJFy5uAjo7GVr3PhL.jpg")
        ]
      },
      2011: {
        winner: M("The Social Network", 37799, "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg"),
        nominees: [
          M("Black Swan", 44214, "/viWheBd44bouiLCHgNMvahLThqx.jpg"),
          M("The Fighter", 45317, "/xfsFerGhO1h6rLk8vwLgMyQ8WVJ.jpg"),
          M("Inception", 27205, "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg"),
          M("The King's Speech", 45269, "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg")
        ]
      },
      2010: {
        winner: M("Avatar", 19995, "/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg"),
        nominees: [
          M("The Hurt Locker", 12162, "/io2dfBJhasvGbgkCX9cCGVOiA99.jpg"),
          M("Inglourious Basterds", 16869, "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"),
          M("Precious", 25793, "/d4ltLIDbvZskSwbzXqi0Hfv5ma4.jpg"),
          M("Up in the Air", 22947, "/useGH8nfwlaHK44IWEZdUYJOE2N.jpg")
        ]
      },
      2009: {
        winner: M("Slumdog Millionaire", 12405, "/5leCCi7ZF0CawAfM5Qo2ECKPprc.jpg"),
        nominees: [
          M("The Curious Case of Benjamin Button", 4922, "/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg"),
          M("Frost/Nixon", 11499, "/z4cQ2mJxwPZUwVh97yX9oNsLLZQ.jpg"),
          M("The Reader", 8055, "/r0WURbmnhgKeBpHcpDULBgRedQM.jpg"),
          M("Revolutionary Road", 4148, "/cvkD3yiVXLg3as8EAG3LaTycONQ.jpg")
        ]
      },
      2008: {
        winner: M("Atonement", 4347, "/hMRIyBjPzxaSXWM06se3OcNjIQa.jpg"),
        nominees: [
          M("American Gangster", 4982, "/m7kJge9DG86Bj7hsBW6xFCMyDkY.jpg"),
          M("Eastern Promises", 2252, "/dpiJWb4NrWgcOg2rusuLhDM0hTm.jpg"),
          M("The Great Debaters", 14047, "/szx0sWq0pgvgfRX7g72cWBYoOjf.jpg"),
          M("Michael Clayton", 4566, "/hhkW4yVIGo8Bee3UITKvqOvhNMG.jpg"),
          M("No Country for Old Men", 6977, "/6d5XOczc226jECq0LIX0siKtgHR.jpg"),
          M("There Will Be Blood", 7345, "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg")
        ]
      },
      2007: {
        winner: M("Babel", 1164, "/bZByZbvU7u14WjoUJERqCRW9saN.jpg"),
        nominees: [
          M("Bobby", 10741, "/ea6aSTUFQopOW7kWFZB9AvMYnbs.jpg"),
          M("The Departed", 1422, "/nT97ifVT2J1yMQmeq20Qblg61T.jpg"),
          M("Little Children", 1440, "/l2wTSP0Ifo9vY03nJEfkFBbT2S9.jpg"),
          M("The Queen", 1165, "/v08RH5Cx9EFAQMBWQuE5jHAgHYs.jpg")
        ]
      },
      2006: {
        winner: M("Brokeback Mountain", 142, "/aByfQOQBNa4CMFwIgq3QrqY2ZHh.jpg"),
        nominees: [
          M("The Constant Gardener", 1985, "/nkXq7V7mmJVbvwZGr3nxkHo7HkS.jpg"),
          M("Good Night, and Good Luck.", 3291, "/w4QSEno2xxHqMtSr3mPUhJpO3F2.jpg"),
          M("A History of Violence", 59, "/A26rcvipOqptVs7i5uRmKicXRxE.jpg"),
          M("Match Point", 116, "/vHjEVTD8ucuwKSFOZJeyAnTZYli.jpg")
        ]
      },
      2005: {
        winner: M("The Aviator", 2567, "/lx4kWcZc3o9PaNxlQpEJZM17XUI.jpg"),
        nominees: [
          M("Closer", 2288, "/fGGaokx4k00S0J603VG53Qlr9jz.jpg"),
          M("Finding Neverland", 866, "/5JyDPH4qdr0I6pF7Bjh1Qrf1Jhh.jpg"),
          M("Hotel Rwanda", 205, "/p3pHw85UMZPegfMZBA6dZ06yarm.jpg"),
          M("Kinsey", 11184, "/cODCjWNRcZkwe4ONQs1GzRqYtRb.jpg"),
          M("Million Dollar Baby", 70, "/jcfEqKdWF1zeyvECPqp3mkWLct2.jpg")
        ]
      },
      2004: {
        winner: M("The Lord of the Rings: The Return of the King", 122, "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"),
        nominees: [
          M("Cold Mountain", 2289, "/j0AJeeR5CQPDFh0otyWyCWREHO8.jpg"),
          M("Master and Commander: The Far Side of the World", 8619, "/s1cVTQEZYn4nSjZLnFbzLP0j8y2.jpg"),
          M("Mystic River", 322, "/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg"),
          M("Seabiscuit", 4464, "/5m7NfZvxYsSm2YBCJ2VPQf8ziKr.jpg")
        ]
      },
      2003: {
        winner: M("The Hours", 590, "/4myDtowDJQPQnkEDB1IWGtJR1Fo.jpg"),
        nominees: [
          M("About Schmidt", 2755, "/tstvsrJHY57hc951lb190alXRQm.jpg"),
          M("Gangs of New York", 3131, "/lemqKtcCuAano5aqrzxYiKC8kkn.jpg"),
          M("The Lord of the Rings: The Two Towers", 121, "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg"),
          M("The Pianist", 423, "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg")
        ]
      },
      2002: {
        winner: M("A Beautiful Mind", 453, "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg"),
        nominees: [
          M("In the Bedroom", 1999, "/IQj11YbraLDyPYaz79jtDoAscc.jpg"),
          M("The Lord of the Rings: The Fellowship of the Ring", 120, "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"),
          M("The Man Who Wasn't There", 10778, "/lrCgt8NNMyFsfmXyXiSSCRXNH4u.jpg"),
          M("Mulholland Drive", 1018, "/x7A59t6ySylr1L7aubOQEA480vM.jpg")
        ]
      },
      2001: {
        winner: M("Gladiator", 98, "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"),
        nominees: [
          M("Billy Elliot", 71, "/nOr5diUZxphmAD3li9aiILyI28F.jpg"),
          M("Erin Brockovich", 462, "/jEMvWBWVjndZT0vJnLrRWi9ajea.jpg"),
          M("Sunshine for the Poor", 190386, "/aKt2urWc9Fi9snHz2prDmK823og.jpg"),
          M("Traffic", 1900, "/jbccmnqE4oAPI67bApgt2JiRPz8.jpg")
        ]
      },
      2000: {
        winner: M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"),
        nominees: [
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg"),
          M("The Hurricane", 10400, "/zhnxjsNnnpsBMF5V1H7Pzkec45Y.jpg"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg")
        ]
      },
      1999: {
        winner: M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"),
        nominees: [
          M("American Beauty", 14, "/wby9315QzVKdW9BonAefg8jGTTb.jpg"),
          M("The Talented Mr. Ripley", 1213, "/6ojHgqtIR41O2qLKa7LFUVj0cZa.jpg"),
          M("The Insider", 9008, "/jJCyIBPfvk41uETq6K6u4upyGO8.jpg"),
          M("The Hurricane", 10400, "/zhnxjsNnnpsBMF5V1H7Pzkec45Y.jpg"),
          M("The End of the Affair", 20024, "/xTp5cyp6qG0YTdI4AEz4ytjODOQ.jpg")
        ]
      },
      1998: {
        winner: M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"),
        nominees: [
          M("Saving Private Ryan", 857, "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"),
          M("Elizabeth", 4518, "/qEk48VLOdibXFVIEzE9ETZUBcCs.jpg"),
          M("Gods and Monsters", 3033, "/awvJH3NtXoStsjAtXKr99hfuVaG.jpg"),
          M("The Horse Whisperer", 547, "/ptkDeHY2mRJVyNRyxb9TgyAjTYs.jpg"),
          M("The Truman Show", 37165, "/vuza0WqY239yBXOadKlGwJsZJFE.jpg")
        ]
      },
      1997: {
        winner: M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
        nominees: [
          M("Titanic", 597, "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"),
          M("Amistad", 11831, "/6QqNyIHKow0jngiQgTNBOBrLILM.jpg"),
          M("The Boxer", 16992, "/wsbNQWMQV4HwwqXtvQUoBfiBzK8.jpg"),
          M("Good Will Hunting", 489, "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg"),
          M("L.A. Confidential", 2118, "/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg")
        ]
      },
      1996: {
        winner: M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
        nominees: [
          M("The English Patient", 409, "/8eHHqMg8qEYtVw8LQLygsHXSR2q.jpg"),
          M("Breaking the Waves", 145, "/dQWMcdHXUOSHtr7ypOCa5T79JMS.jpg"),
          M("The People vs. Larry Flynt", 1630, "/sAgHn7ys6TiVXBDTZ0UBEjinIUk.jpg"),
          M("Secrets & Lies", 11159, "/zQBuRQ3hrLhkEsXcxteUxuxLrvs.jpg"),
          M("Shine", 7863, "/cbmThowj2XAW7lKlMAXmnhZvjGI.jpg")
        ]
      },
      1995: {
        winner: M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"),
        nominees: [
          M("Sense and Sensibility", 4584, "/cBK2yL3HqhFvIVd7lLtazWlRZPR.jpg"),
          M("Apollo 13", 568, "/tVeKscCm2fY1xDXZk8PgnZ87h9S.jpg"),
          M("Braveheart", 197, "/or1gBugydmjToAEq7OZY0owwFk.jpg"),
          M("The Bridges of Madison County", 688, "/aCBrhOQjhG397GLkEZ49zReQEKX.jpg"),
          M("Leaving Las Vegas", 451, "/wTrFpGe3U65kXTldIUxuM2hmOAK.jpg")
        ]
      },
      1994: {
        winner: M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"),
        nominees: [
          M("Forrest Gump", 13, "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"),
          M("Legends of the Fall", 4476, "/t1KPGlW0UGd0m515LPQmk2F4nu1.jpg"),
          M("Nell", 1945, "/aIDp3x2YfijtdherR28pIH6yenn.jpg"),
          M("Pulp Fiction", 680, "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"),
          M("Quiz Show", 11450, "/yoGJo1h3Hl2exXPVcG9UXWDENtX.jpg")
        ]
      },
      1993: {
        winner: M("Scent of a Woman", 9475, "/4adI7IaveWb7EidYXfLb3MK3CgO.jpg"),
        nominees: [
          M("Schindler's List", 424, "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"),
          M("The Age of Innocence", 10436, "/5Tuyt26v7qNR8Cl3m7ZRx36rduf.jpg"),
          M("In the Name of the Father", 7984, "/3NcIkKxaO2SmRVsG1v50XhtmL0f.jpg"),
          M("The Piano", 713, "/dUxjG6baSzGIgP7R8BQI5rpMuET.jpg"),
          M("The Remains of the Day", 1245, "/uDGDtqSvuch324WnM7Ukdp1bCAQ.jpg")
        ]
      },
      1992: {
        winner: M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg"),
        nominees: [
          M("Scent of a Woman", 9475, "/4adI7IaveWb7EidYXfLb3MK3CgO.jpg"),
          M("The Crying Game", 11386, "/ea6HPVTlGa0MmtTrPud0UnP9wh.jpg"),
          M("A Few Good Men", 881, "/rLOk4z9zL1tTukIYV56P94aZXKk.jpg"),
          M("Howards End", 8293, "/1009nhfj28VhhQnVadtjkOacduX.jpg"),
          M("Unforgiven", 33, "/54roTwbX9fltg85zjsmrooXAs12.jpg")
        ]
      },
      1991: {
        winner: M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"),
        nominees: [
          M("Bugsy", 10337, "/hSGncpMByW8zx2aOSXdZB0e70yA.jpg"),
          M("JFK", 820, "/r0VWVTYlqdRCK5ZoOdNnHdqM2gt.jpg"),
          M("The Prince of Tides", 10333, "/1AyeW3YlwfhRwLDeUCW686obceb.jpg"),
          M("The Silence of the Lambs", 274, "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"),
          M("Thelma & Louise", 1541, "/gQSUVGR80RVHxJywtwXm2qa1ebi.jpg")
        ]
      },
      1990: {
        winner: M("Born on the Fourth of July", 2604, "/c5gSie6ZA90iBs62yNM5MV4y9R7.jpg"),
        nominees: [
          M("Dances with Wolves", 581, "/hw0ZEHAaTqTxSXGVwUFX7uvanSA.jpg"),
          M("Avalon", 2302, "/lsyPs8pU6hIJCS5sw0H9Q8Tl1nJ.jpg"),
          M("The Godfather Part III", 242, "/lm3pQ2QoQ16pextRsmnUbG2onES.jpg"),
          M("GoodFellas", 769, "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg"),
          M("Reversal of Fortune", 38718, "/jEmFeHPsoyHk6RRZslKzC5NVFad.jpg")
        ]
      },
      1989: {
        winner: M("Rain Man", 380, "/iTNHwO896WKkaoPtpMMS74d8VNi.jpg"),
        nominees: [
          M("Crimes and Misdemeanors", 11562, "/6vC6MLYUICH57MmEVi1UaNaj2Qs.jpg"),
          M("Dead Poets Society", 207, "/l5NbiHKUmahlAT3Q1ig8Tyl9xrc.jpg"),
          M("Do the Right Thing", 925, "/63rmSDPahrH7C1gEFYzRuIBAN9W.jpg"),
          M("Glory", 9665, "/pGDzBjZvzmSCIEduQBfESLMiwtp.jpg")
        ]
      },
      1988: {
        winner: M("The Last Emperor", 746, "/7TILJhdeJAaEyDiwvJZMo9SQBoe.jpg"),
        nominees: [
          M("The Accidental Tourist", 31052, "/dyk2BqPajLRBpVQ6jsSJJdgfuXe.jpg"),
          M("Evil Angels", 35119, "/auyoK8OZh1sZldjJfy9RGzS6crV.jpg"),
          M("Gorillas in the Mist", 10130, "/utptKpx6cXxmbEGu4N4HIoSZ6IS.jpg"),
          M("Mississippi Burning", 1632, "/wvEx2WbxZXYljQ9vSoq37NgeXcJ.jpg"),
          M("Running on Empty", 18197, "/kzhyruFxY4Z5Ert8M9tuM2MV8dd.jpg"),
          M("The Unbearable Lightness of Being", 10644, "/g1kPEwATsCI8DnGx6ViAhUVKQSI.jpg")
        ]
      },
      1987: {
        winner: M("Platoon", 792, "/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg"),
        nominees: [
          M("Cry Freedom", 12506, "/zEONV1NAzzoQGFFgSIEs7vJzDrN.jpg"),
          M("Empire of the Sun", 10110, "/gEaCzjwHoPgyQFcwHql7o5YLHAU.jpg"),
          M("Fatal Attraction", 10998, "/vjB9XwJKnYqFKKjhWcE6WpAf5Ki.jpg"),
          M("La Bamba", 16620, "/6Znulqtc7cdqlUC69HGf26Ef5fi.jpg"),
          M("Nuts", 40634, "/3OW1JuLly9Z6wGZPiHgKpnlRo6s.jpg")
        ]
      },
      1986: {
        winner: M("Out of Africa", 606, "/6oMKqh08TfxmvnoFR4mm1wZB67P.jpg"),
        nominees: [
          M("Children of a Lesser God", 1890, "/tWMuw7YWWDpD9Iv652vfKELPZPR.jpg"),
          M("The Mission", 11416, "/6K9cG6LOOtySZF4D4xBu1MApC1N.jpg"),
          M("Mona Lisa", 10002, "/geBGfbhkgKHld8rM9XuLfzPGZ6I.jpg"),
          M("A Room with a View", 11257, "/5xRAqywVo6tNUNQbAESGVP930la.jpg"),
          M("Stand by Me", 235, "/vz0w9BSehcqjDcJOjRaCk7fgJe7.jpg")
        ]
      },
      1985: {
        winner: M("Amadeus", 279, "/gQRfiyfGvr1az0quaYyMram3Aqt.jpg"),
        nominees: [
          M("The Color Purple", 873, "/6bvxkcTAXyqxGRwo38mxw92D6Xr.jpg"),
          M("Kiss of the Spider Woman", 11703, "/lbrn4gOjYKrLrINn3uUJRlV2NZO.jpg"),
          M("Runaway Train", 11893, "/A9pf9KjhqCGthu6PKAKE5E1qRNn.jpg"),
          M("Witness", 9281, "/kOymD1rChAMykmDVEzJpIh4OYS7.jpg")
        ]
      },
      1984: {
        winner: M("Terms of Endearment", 11050, "/l77DRjJuykqKMtD9GTK4YT7qKHW.jpg"),
        nominees: [
          M("The Cotton Club", 2148, "/qigf5fWSH1tw7z424UVKg71UIOS.jpg"),
          M("The Killing Fields", 625, "/cX6Bv7natnZwQjsV9bLL8mmWjkS.jpg"),
          M("Places in the Heart", 13681, "/bmWg3uVn700inqOiadxeFTmiqmV.jpg"),
          M("A Soldier's Story", 26522, "/vSLrddsvH8bJzryOS5BD9qtTtFa.jpg")
        ]
      },
      1983: {
        winner: M("E.T. the Extra-Terrestrial", 601, "/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg"),
        nominees: [
          M("Reuben, Reuben", 31944, "/bFSkGEkFuJQ8wl09xLVEDY6FEqU.jpg"),
          M("The Right Stuff", 9549, "/kFR1p46HXJVVMpmOil8bNWnAQ50.jpg"),
          M("Silkwood", 12502, "/7Piz5R5dB6d7v1OWNaIn9GB4qZg.jpg"),
          M("Tender Mercies", 42121, "/fBP6uK0K4EnV8dtt4SJQrMdX0wb.jpg")
        ]
      },
      1982: {
        winner: M("On Golden Pond", 11816, "/ic4f03J6pnf9cpQmVDABFhUpbCU.jpg"),
        nominees: [
          M("Missing", 15600, "/fAAhC4RkpXu7SJgIESWQwVxcelo.jpg"),
          M("An Officer and a Gentleman", 2623, "/69adZbLeRk5TNQ3e0008dMnde9p.jpg"),
          M("Sophie's Choice", 15764, "/rZDPbPTFwuKgr5b9jixGFNYkGYt.jpg"),
          M("The Verdict", 24226, "/m3DdNJZfBcsTiFe0SwsLChWavrG.jpg")
        ]
      },
      1981: {
        winner: M("Ordinary People", 16619, "/tJVETEDAKgD3fEh88SHOvMvOQue.jpg"),
        nominees: [
          M("The French Lieutenant's Woman", 12537, "/zqpeqPjziAH3VXMqwQ0Ds3Ffx9b.jpg"),
          M("Prince of the City", 32047, "/tdERW77zecB5pkKWWeqbSkns0t4.jpg"),
          M("Ragtime", 25566, "/vRjyakxRrMfj6sgyUJte9mVI1D9.jpg"),
          M("Reds", 18254, "/AeiKdVVM93fwfQG1m3N0cgVZgHl.jpg")
        ]
      },
      1980: {
        winner: M("Kramer vs. Kramer", 12102, "/3CUP5V5SWfHSK4qvkZF7lMNyugY.jpg"),
        nominees: [
          M("The Elephant Man", 1955, "/u0wpPYjuSt8DIe1Y3Vapnh8jcKE.jpg"),
          M("The Ninth Configuration", 18910, "/jlQMBckfnLhiCusar62sJ7WCKBv.jpg"),
          M("Raging Bull", 1578, "/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg"),
          M("The Stunt Man", 42160, "/n7trpLAThW1h67QAlWMQ6IHS47u.jpg")
        ]
      },
      1979: {
        winner: M("Midnight Express", 11327, "/mIzGfVCSWmmYjLIIbA2BX3rlV56.jpg"),
        nominees: [
          M("Apocalypse Now", 28, "/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"),
          M("The China Syndrome", 988, "/uHwwQIlt4XwpTFhX9ZT1A8xSW7F.jpg"),
          M("Manhattan", 696, "/k4eT3EvfxW1L9Wmt04UqJqCvCR6.jpg"),
          M("Norma Rae", 40842, "/6au7WBVYoKhV1jORyFSIRszb46S.jpg")
        ]
      },
      1978: {
        winner: M("The Turning Point", 61280, "/6CD90BQEDexEIMqIwMSnbJStF5x.jpg"),
        nominees: [
          M("Coming Home", 31657, "/jBsYWNBYNEi5EhT1hC8iexcTsWT.jpg"),
          M("Days of Heaven", 16642, "/rwxTYjOZmX2rGhz7avLe1qsjNqe.jpg"),
          M("The Deer Hunter", 11778, "/bbGtogDZOg09bm42KIpCXUXICkh.jpg"),
          M("An Unmarried Woman", 38731, "/pJ6BLvNcLhNxvVCGgTynO5BJtQq.jpg")
        ]
      },
      1977: {
        winner: M("Rocky", 1366, "/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg"),
        nominees: [
          M("Close Encounters of the Third Kind", 840, "/gCWPB8cF82tqzrS9tvzcO6q6nyz.jpg"),
          M("I Never Promised You a Rose Garden", 66092, "/AcumdxTlCtFBQXDjsIsiy1VyjpX.jpg"),
          M("Julia", 42222, "/qHtPzs9eVCilp88c1arq73gH6xk.jpg"),
          M("Star Wars", 11, "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg")
        ]
      },
      1976: {
        winner: M("One Flew Over the Cuckoo's Nest", 510, "/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"),
        nominees: [
          M("All the President's Men", 891, "/cPtSHR7D2WGsDBfnC5DxV927hKn.jpg"),
          M("Bound for Glory", 42232, "/wMSR2CSPruCPkZDEQ5xjv5xqc05.jpg"),
          M("Network", 10774, "/qZomlHsaALUtkFeMDwdYmwS2Pbo.jpg"),
          M("Voyage of the Damned", 75641, "/zXIAI4nLLHyFzLJz3fTmtd4yErF.jpg")
        ]
      },
      1975: {
        winner: M("Chinatown", 829, "/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg"),
        nominees: [
          M("Barry Lyndon", 3175, "/znfLskGQnXYB2xcOGM9eInRHPAV.jpg"),
          M("Dog Day Afternoon", 968, "/mavrhr0ig2aCRR8d48yaxtD5aMQ.jpg"),
          M("Jaws", 578, "/tjbLSFwi0I3phZwh8zoHWNfbsEp.jpg"),
          M("Nashville", 3121, "/twl4ovyjb8muFKvZmcCDzPR0hy1.jpg")
        ]
      },
      1974: {
        winner: M("The Exorcist", 9552, "/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg"),
        nominees: [
          M("The Conversation", 592, "/dHqVBwcv1SGymOpUueRoKzcmdes.jpg"),
          M("Earthquake", 11123, "/6hJorsInxNpj1dIekh6dK6Kh9S6.jpg"),
          M("Lenny", 27094, "/Avhk4pGdz3YQrzqLU65icjnE6vn.jpg"),
          M("A Woman Under the Influence", 29845, "/6EJ4JoTxnH1QmGTE9pPzgtW1cLW.jpg")
        ]
      },
      1973: {
        winner: M("The Godfather", 238, "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"),
        nominees: [
          M("The Day of the Jackal", 4909, "/vThgcb3JOj99yETg8WChuci4LV2.jpg"),
          M("Last Tango in Paris", 1643, "/dNgdUdNOWfHsZI3lDu6Epig7H2P.jpg"),
          M("Save the Tiger", 38714, "/htLwmbIc8L2ufP5g4Wv5OWCOYMl.jpg"),
          M("Serpico", 9040, "/76rLcn53Fjdh4Dji9EIeJ98aYj1.jpg")
        ]
      },
      1972: {
        winner: M("The French Connection", 1051, "/pH4saPwMjhnVGwmSH6RkMaHrt3s.jpg"),
        nominees: [
          M("Deliverance", 10669, "/2TrAzNJlHyNYYSkQf6asg3rs2Xr.jpg"),
          M("Frenzy", 573, "/4SFvqrlSigAt9tnhXFSMyKeJWQk.jpg"),
          M("The Poseidon Adventure", 551, "/6RGiA5BfhelU9zoD0b1GAG4GWWf.jpg"),
          M("Sleuth", 993, "/jAREYLUnYGwPjbQr0vs1s38QLkH.jpg")
        ]
      },
      1971: {
        winner: M("Love Story", 9062, "/5A7SGcT1GlhWfHsCRQQtGe0TpJB.jpg"),
        nominees: [
          M("A Clockwork Orange", 185, "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg"),
          M("The Last Picture Show", 25188, "/7NYePZc0lZrRomtmQsjOJMePTEb.jpg"),
          M("Mary, Queen of Scots", 46067, "/bNz2smYRTVGs7NHh34aHh7knVIY.jpg"),
          M("Summer of '42", 41357, "/4n7m05C2ee3UM5Co2k2BOWqH5o2.jpg")
        ]
      },
      1970: {
        winner: M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg"),
        nominees: [
          M("Airport", 10671, "/6iOKluJfyiU1SLZbGYrY7Z0i6k0.jpg"),
          M("Five Easy Pieces", 26617, "/xGLkuMWigSPLBvWiENSMlVq56iE.jpg"),
          M("I Never Sang for My Father", 92283, "/o494qtKJgd5IU21sMjdc5tTd7fQ.jpg"),
          M("Patton", 11202, "/rLM7jIEPTjj4CF7F1IrzzNjLUCu.jpg")
        ]
      },
      1969: {
        winner: M("Anne of the Thousand Days", 22522, "/u2p5SspAs1GqeuHXNXywryU3k37.jpg"),
        nominees: [
          M("Butch Cassidy and the Sundance Kid", 642, "/gFmmykF1Ym3OGzENo50nZQaD1dx.jpg"),
          M("Midnight Cowboy", 3116, "/ckklq45UxUkwgHve9xItXqXr06r.jpg"),
          M("The Prime of Miss Jean Brodie", 5179, "/lEZdKL17yneFK4dbbWPKcbkRbqM.jpg"),
          M("They Shoot Horses, Don't They?", 28145, "/7wVLBgriOQpT5RrufAFCdCSUp7M.jpg")
        ]
      },
      1968: {
        winner: M("The Lion in Winter", 18988, "/yMgJnZADJObzfjA70ygXJkjnrFX.jpg"),
        nominees: [
          M("Charly", 29146, "/uxGt80D4hxEEwGwdOJ5tdVvjXEC.jpg"),
          M("The Fixer", 87267, "/pLcke8F7THAxtEHtN8Tg6IaZ9if.jpg"),
          M("The Heart Is a Lonely Hunter", 22176, "/vOznrQ5x8IAnsY0P3T7Jz9EEGP7.jpg"),
          M("The Shoes of the Fisherman", 17665, "/m9HqMSaDz7Peo0ufCaBUP8gG5gf.jpg")
        ]
      },
      1967: {
        winner: M("In the Heat of the Night", 10633, "/qFpfALhprXmOAbA5upTNupZw8rq.jpg"),
        nominees: [
          M("Bonnie and Clyde", 475, "/sCSQFK9kMsprT4jgWqgw82dT6WI.jpg"),
          M("Far from the Madding Crowd", 3469, "/2cCHnpaf5JTRlgO07uulEdUpFkb.jpg"),
          M("Guess Who's Coming to Dinner", 1879, "/fkHeYWahNbhxhuLefaAg553lYo5.jpg"),
          M("In Cold Blood", 18900, "/f4zGKntOVVJUk9X0wCcw1DJPdQe.jpg")
        ]
      },
      1966: {
        winner: M("A Man for All Seasons", 874, "/kcwcqMitcnRO1SySlX1HKVn7yUV.jpg"),
        nominees: [
          M("Born Free", 15347, "/xI5BkObQm7UtYEFTw7ZmiDGF7gT.jpg"),
          M("The Professionals", 22383, "/sH4Clw7QrtH23xl9o4sOpHNkRIz.jpg"),
          M("The Sand Pebbles", 5923, "/muZyCXWoayEtwVkxc0ql48X1h6L.jpg"),
          M("Who's Afraid of Virginia Woolf?", 396, "/wF7ihB5V5gSm6zxjv3ZhHOpgREI.jpg")
        ]
      },
      1965: {
        winner: M("Doctor Zhivago", 907, "/r0Iv2BiCFYDnzc6uU1q3AJ56igT.jpg"),
        nominees: [
          M("The Collector", 42740, "/iMiih5FGHwpUCAaJAIkYKl5Hffi.jpg"),
          M("The Flight of the Phoenix", 10243, "/zrzLl7NWdjwGhVE7bqpOAxMVtF.jpg"),
          M("A Patch of Blue", 33364, "/9eFULnzgoLpO7lvg6FMutGRuNFg.jpg"),
          M("Ship of Fools", 30080, "/2LOe4Hu6Gxw6k76hLWhS8JVVILa.jpg")
        ]
      },
      1964: {
        winner: M("Becket", 15421, "/swWmxVbq0pXv4wwsc2O803PiXR7.jpg"),
        nominees: [
          M("The Chalk Garden", 66022, "/IXGqj9MoPFbaoBcUkUZf97XHlx.jpg"),
          M("Dear Heart", 101226, "/8rRzxfPsztNhgac81KJk3tphCME.jpg"),
          M("The Night of the Iguana", 14703, "/3HY8MSeoj4s0uSWGW135Jlh7eSI.jpg"),
          M("Zorba the Greek", 10604, "/jAYOY38TRDprIgu7vgES0FFJJSl.jpg")
        ]
      },
      1963: {
        winner: M("The Cardinal", 3010, "/y23FoRE97IH9bHFo2OBP5IkKnLq.jpg"),
        nominees: [
          M("America America", 47249, "/76RffKrNPrfA4TWYkx5wIIOzOlV.jpg"),
          M("Captain Newman, M.D.", 33728, "/ovXBWbk3YjOZB5cmiTvdNaDYGKu.jpg"),
          M("The Caretakers", 85640, "/4sSpMxxCLtAyJiOC4zJtKIsySIw.jpg"),
          M("Cleopatra", 8095, "/bj7rUGUewofA9cpHt1h36gvDFfy.jpg"),
          M("Lilies of the Field", 38805, "/gYoVx2m8NP2hTWnEpwNeROIWrQ4.jpg"),
          M("Hud", 24748, "/A168bF52vmAIGkC2Qafj7M2EmaE.jpg")
        ]
      },
      1962: {
        winner: M("Lawrence of Arabia", 947, "/AiAm0EtDvyGqNpVoieRw4u65vD1.jpg"),
        nominees: [
          M("The Chapman Report", 118955, "/xHlkaDldivwkL9H8qOmb2zyXqNo.jpg"),
          M("Days of Wine and Roses", 32488, "/cRVl1BR3x3P2NqUv61eveJNJ0ip.jpg"),
          M("Freud: The Secret Passion", 35806, "/2cguhv8jwEaiwF8pB5xo3RzfXlO.jpg"),
          M("Hemingway’s Adventures of a Young Man", 111683, "/8IqWKVSHCmBWICtyrluWPN0TfrN.jpg"),
          M("David and Lisa", 109667, "/jujTT52xmggRVwdWvSD2DPqUI1O.jpg"),
          M("The Longest Day", 9289, "/5zmvEofdIlgXrQl9A7e5IOzlnFU.jpg"),
          M("The Miracle Worker", 1162, "/3dI6UVM5W1sz3MU9gNK5nVDcAyQ.jpg"),
          M("Mutiny on the Bounty", 11085, "/caxk06SANEacvycZFiApv1LA6Kl.jpg"),
          M("To Kill a Mockingbird", 595, "/gZycFUMLx2110dzK3nBNai7gfpM.jpg")
        ]
      },
      1961: {
        winner: M("The Guns of Navarone", 10911, "/j6VSFnm20GlkUi8yb7hM5Qfc1fA.jpg"),
        nominees: [
          M("El Cid", 16638, "/a6DY3LDlXFUDuXm47zXTOfiisxP.jpg"),
          M("Fanny", 84050, "/8hEQpSE3D9rsMw37N30T9EZwLoa.jpg"),
          M("Judgment at Nuremberg", 821, "/b6vYatvui1EXeFYfpDX4rcbueuP.jpg"),
          M("Splendor in the Grass", 28569, "/n6Kw8Ui93SMhrk1MupCFwUg04vq.jpg")
        ]
      },
      1960: {
        winner: M("Spartacus", 967, "/r0Fgg1GyZgzokaiw2HFQv3oPaL2.jpg"),
        nominees: [
          M("Elmer Gantry", 22013, "/5vd031r08rrfSMqtB9UarwqCUOz.jpg"),
          M("Inherit the Wind", 1908, "/7oaHcF0gCOt2lKaT2zajhajP0Zo.jpg"),
          M("Sons and Lovers", 53939, "/7BDlr8XivWmNcDsb5ygnhs8CWiR.jpg"),
          M("Sunrise at Campobello", 72354, "/y9cJA6rz0cEcPmehvc1Rr1GvvCO.jpg")
        ]
      },
      1959: {
        winner: M("Ben-Hur", 665, "/m4WQ1dBIrEIHZNCoAjdpxwSKWyH.jpg"),
        nominees: [
          M("Anatomy of a Murder", 93, "/b2G1QSAwtBv9luhEwErIgSRaU92.jpg"),
          M("The Diary of Anne Frank", 2576, "/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg"),
          M("The Nun's Story", 27029, "/4vNWFhPyjTehPpZsvTnTywwXSiF.jpg"),
          M("On the Beach", 35412, "/lTDuj5zalrI0fpQel7UfPHTexTK.jpg")
        ]
      },
      1958: {
        winner: M("The Defiant Ones", 11414, "/tGGNyImEXgedDjrCORbC9cTJp0X.jpg"),
        nominees: [
          M("Cat on a Hot Tin Roof", 261, "/5djZZECgqDGuSI1INmrdAcGRBb0.jpg"),
          M("Home Before Dark", 121250, "/ArL6JE6E2YltKRWKmBpuqb6Rt3b.jpg"),
          M("I Want to Live!", 28577, "/cQoSMLJFPV3d8Mi8iPwwtNto370.jpg"),
          M("Separate Tables", 43136, "/y8exawP0Je3MXVIS3olpJ2fu07.jpg")
        ]
      },
      1957: {
        winner: M("The Bridge on the River Kwai", 826, "/7paXMt2e3Tr5dLmEZOGgFEn2Vo7.jpg"),
        nominees: [
          M("12 Angry Men", 389, "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg"),
          M("Peyton Place", 43236, "/pSANpoBLMbejWTtiKz630eSaDpi.jpg"),
          M("Sayonara", 40885, "/xSXJDamf9vSb1qOiBhOMjB2soDE.jpg"),
          M("Wild Is the Wind", 93528, "/7vnKOkyrvJ77uLlGk5hzXyqyAfQ.jpg")
        ]
      },
      1956: {
        winner: M("Around the World in 80 Days", 2897, "/kk6Rrwh0toMz9tjuUHdS4O3v2Rk.jpg"),
        nominees: [
          M("Giant", 1712, "/wXGmfJkU83daBsqp9R8LeWguIZd.jpg"),
          M("Lust for Life", 29592, "/rlK3LG3W41eF3N1tk0SEM7Dln2x.jpg"),
          M("The Rainmaker", 43542, "/3E2dmfh3e2LOKq0psiNXAGwtZGl.jpg"),
          M("War and Peace", 11706, "/f3a1MyH12PSl3LFDahnooGy6mv8.jpg")
        ]
      },
      1955: { winner: M("East of Eden", 220, "/xv1MZVIop0SQqwLUymgE5eb2LFl.jpg"), nominees: [] },
      1954: { winner: M("On the Waterfront", 654, "/v1RtJ1qR4v9nrnfoBVBl6hjTW9.jpg"), nominees: [] },
      1953: { winner: M("The Robe", 29912, "/qFYZNGzftIM8dqGMJBToGraAFJp.jpg"), nominees: [] },
      1952: { winner: M("The Greatest Show on Earth", 27191, "/cKI0yGPRh1IlvRKKJRoMZruior8.jpg"), nominees: [] },
      1951: { winner: M("A Place in the Sun", 25673, "/3tKYbChwIRYCwFrMUDBkbZyDIoN.jpg"), nominees: [] },
      1950: { winner: M("Sunset Boulevard", 599, "/zt8aQ6ksqK6p1AopC5zVTDS9pKT.jpg"), nominees: [] }
    }
  }
};
