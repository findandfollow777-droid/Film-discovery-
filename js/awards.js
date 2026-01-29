// ============================================
// ORBIT GAME - PRESTIGE LAYER
// Award-winning films database
// ============================================

const PRESTIGE_DATABASE = {
  // Format: TMDB_MOVIE_ID: { awards: [{ name, year, category }] }
  
  // OSCAR - Best Picture Winners
  238: { // The Godfather
    awards: [{ name: "Oscar", year: 1973, category: "Best Picture" }]
  },
  240: { // The Godfather Part II
    awards: [{ name: "Oscar", year: 1975, category: "Best Picture" }]
  },
  278: { // The Shawshank Redemption (nominee)
    awards: [{ name: "Oscar", year: 1995, category: "Best Picture Nominee" }]
  },
  424: { // Schindler's List
    awards: [{ name: "Oscar", year: 1994, category: "Best Picture" }]
  },
  550: { // Fight Club (cult classic)
    awards: []
  },
  680: { // Pulp Fiction
    awards: [
      { name: "Cannes", year: 1994, category: "Palme d'Or" },
      { name: "Oscar", year: 1995, category: "Best Original Screenplay" }
    ]
  },
  155: { // The Dark Knight
    awards: [{ name: "Oscar", year: 2009, category: "Best Supporting Actor" }]
  },
  13: { // Forrest Gump
    awards: [{ name: "Oscar", year: 1995, category: "Best Picture" }]
  },
  11: { // Star Wars (1977)
    awards: [{ name: "Oscar", year: 1978, category: "Best Visual Effects" }]
  },
  120: { // The Lord of the Rings: Fellowship
    awards: [{ name: "Oscar", year: 2002, category: "Best Cinematography" }]
  },
  122: { // The Lord of the Rings: Return of the King
    awards: [{ name: "Oscar", year: 2004, category: "Best Picture" }]
  },
  389: { // 12 Angry Men
    awards: [{ name: "Berlin", year: 1957, category: "Golden Bear" }]
  },
  497: { // The Green Mile
    awards: [{ name: "Oscar", year: 2000, category: "Best Picture Nominee" }]
  },
  769: { // GoodFellas
    awards: [{ name: "Oscar", year: 1991, category: "Best Supporting Actor" }]
  },
  807: { // Se7en
    awards: []
  },
  244786: { // Whiplash
    awards: [{ name: "Oscar", year: 2015, category: "Best Supporting Actor" }]
  },
  157336: { // Interstellar
    awards: [{ name: "Oscar", year: 2015, category: "Best Visual Effects" }]
  },
  27205: { // Inception
    awards: [{ name: "Oscar", year: 2011, category: "Best Cinematography" }]
  },
  274: { // The Silence of the Lambs
    awards: [{ name: "Oscar", year: 1992, category: "Best Picture" }]
  },
  346: { // Seven Samurai
    awards: [{ name: "Venice", year: 1954, category: "Silver Lion" }]
  },
  311: { // Once Upon a Time in America
    awards: []
  },
  378: { // Casablanca
    awards: [{ name: "Oscar", year: 1944, category: "Best Picture" }]
  },
  539: { // Psycho
    awards: [{ name: "Oscar", year: 1961, category: "Best Director Nominee" }]
  },
  629: { // The Usual Suspects
    awards: [{ name: "Oscar", year: 1996, category: "Best Original Screenplay" }]
  },
  637: { // Life Is Beautiful
    awards: [
      { name: "Oscar", year: 1999, category: "Best Foreign Language Film" },
      { name: "Cannes", year: 1998, category: "Grand Prix" }
    ]
  },
  372058: { // Your Name
    awards: []
  },
  598: { // City of God
    awards: [{ name: "BAFTA", year: 2003, category: "Best Editing" }]
  },
  578: { // Jaws
    awards: [{ name: "Oscar", year: 1976, category: "Best Film Editing" }]
  },
  73: { // American History X
    awards: [{ name: "Oscar", year: 1999, category: "Best Actor Nominee" }]
  },
  429: { // The Good, the Bad and the Ugly
    awards: []
  },
  510: { // One Flew Over the Cuckoo's Nest
    awards: [{ name: "Oscar", year: 1976, category: "Best Picture" }]
  },
  597: { // Titanic
    awards: [{ name: "Oscar", year: 1998, category: "Best Picture" }]
  },
  19: { // Metropolis
    awards: []
  },
  185: { // A Clockwork Orange
    awards: [{ name: "Oscar", year: 1972, category: "Best Picture Nominee" }]
  },
  289: { // Casablanca duplicate - skip
    awards: []
  },
  640: { // Catch Me If You Can
    awards: []
  },
  745: { // The Sixth Sense
    awards: [{ name: "Oscar", year: 2000, category: "Best Picture Nominee" }]
  },
  1891: { // The Empire Strikes Back
    awards: [{ name: "Oscar", year: 1981, category: "Best Sound" }]
  },
  101: { // Leon: The Professional
    awards: []
  },
  120467: { // The Grand Budapest Hotel
    awards: [{ name: "Oscar", year: 2015, category: "Best Production Design" }]
  },
  14: { // American Beauty
    awards: [{ name: "Oscar", year: 2000, category: "Best Picture" }]
  },
  1422: { // The Departed
    awards: [{ name: "Oscar", year: 2007, category: "Best Picture" }]
  },
  857: { // Saving Private Ryan
    awards: [{ name: "Oscar", year: 1999, category: "Best Director" }]
  },
  496243: { // Parasite
    awards: [
      { name: "Oscar", year: 2020, category: "Best Picture" },
      { name: "Cannes", year: 2019, category: "Palme d'Or" }
    ]
  },
  76341: { // Mad Max: Fury Road
    awards: [{ name: "Oscar", year: 2016, category: "Best Film Editing" }]
  },
  77338: { // The Intouchables
    awards: []
  },
  22: { // Pirates of the Caribbean: Curse of the Black Pearl
    awards: [{ name: "Oscar", year: 2004, category: "Best Actor Nominee" }]
  },
  637920: { // Everything Everywhere All at Once
    awards: [{ name: "Oscar", year: 2023, category: "Best Picture" }]
  },
  68718: { // Django Unchained
    awards: [{ name: "Oscar", year: 2013, category: "Best Original Screenplay" }]
  },
  45269: { // The King's Speech
    awards: [{ name: "Oscar", year: 2011, category: "Best Picture" }]
  },
  70: { // Million Dollar Baby
    awards: [{ name: "Oscar", year: 2005, category: "Best Picture" }]
  },
  453: { // A Beautiful Mind
    awards: [{ name: "Oscar", year: 2002, category: "Best Picture" }]
  },
  98: { // Gladiator
    awards: [{ name: "Oscar", year: 2001, category: "Best Picture" }]
  },
  1124: { // The Prestige
    awards: []
  },
  194662: { // Birdman
    awards: [{ name: "Oscar", year: 2015, category: "Best Picture" }]
  },
  314: { // Catwoman - no awards
    awards: []
  },
  205596: { // The Imitation Game
    awards: [{ name: "Oscar", year: 2015, category: "Best Adapted Screenplay" }]
  },
  314365: { // Spotlight
    awards: [{ name: "Oscar", year: 2016, category: "Best Picture" }]
  },
  376867: { // Moonlight
    awards: [{ name: "Oscar", year: 2017, category: "Best Picture" }]
  },
  399055: { // The Shape of Water
    awards: [{ name: "Oscar", year: 2018, category: "Best Picture" }]
  },
  490132: { // Green Book
    awards: [{ name: "Oscar", year: 2019, category: "Best Picture" }]
  },
  515001: { // Nomadland
    awards: [
      { name: "Oscar", year: 2021, category: "Best Picture" },
      { name: "Venice", year: 2020, category: "Golden Lion" }
    ]
  },
  581734: { // CODA
    awards: [{ name: "Oscar", year: 2022, category: "Best Picture" }]
  },
  872585: { // Oppenheimer
    awards: [{ name: "Oscar", year: 2024, category: "Best Picture" }]
  },
  
  // CANNES - Palme d'Or
  118: { // Charlie's Angels - no awards
    awards: []
  },
  335984: { // Blade Runner 2049
    awards: [{ name: "Oscar", year: 2018, category: "Best Cinematography" }]
  },
  68734: { // Argo
    awards: [{ name: "Oscar", year: 2013, category: "Best Picture" }]
  },
  1895: { // Star Wars: Episode III
    awards: []
  },
  103: { // Taxi Driver
    awards: [{ name: "Cannes", year: 1976, category: "Palme d'Or" }]
  },
  12477: { // Grave of the Fireflies
    awards: []
  },
  641: { // Requiem for a Dream
    awards: []
  },
  8587: { // The Lion King
    awards: [{ name: "Oscar", year: 1995, category: "Best Original Score" }]
  },
  672: { // Harry Potter and the Chamber of Secrets
    awards: []
  },
  671: { // Harry Potter and the Sorcerer's Stone
    awards: []
  },
  603: { // The Matrix
    awards: [{ name: "Oscar", year: 2000, category: "Best Visual Effects" }]
  },
  568: { // Apollo 13
    awards: [{ name: "Oscar", year: 1996, category: "Best Film Editing" }]
  },
  1726: { // Iron Man
    awards: []
  },
  24428: { // The Avengers
    awards: []
  },
  299536: { // Avengers: Infinity War
    awards: []
  },
  299534: { // Avengers: Endgame
    awards: []
  },
  99861: { // Avengers: Age of Ultron
    awards: []
  },
  284053: { // Thor: Ragnarok
    awards: []
  },
  315635: { // Spider-Man: Homecoming
    awards: []
  },
  569094: { // Spider-Man: No Way Home
    awards: []
  },
  634649: { // Spider-Man: Across the Spider-Verse
    awards: []
  },
  324857: { // Spider-Man: Into the Spider-Verse
    awards: [{ name: "Oscar", year: 2019, category: "Best Animated Feature" }]
  },
  
  // VENICE - Golden Lion
  947: { // Rashomon
    awards: [{ name: "Venice", year: 1951, category: "Golden Lion" }]
  },
  640: { // Catch Me If You Can - no Venice
    awards: []
  },
  
  // BAFTA
  475557: { // Joker
    awards: [
      { name: "Oscar", year: 2020, category: "Best Actor" },
      { name: "Venice", year: 2019, category: "Golden Lion" },
      { name: "BAFTA", year: 2020, category: "Best Actor" }
    ]
  },
  361743: { // Top Gun: Maverick
    awards: [{ name: "Oscar", year: 2023, category: "Best Sound" }]
  },
  238: { // The Godfather - already listed
    awards: []
  },
  
  // Additional notable films
  207: { // Dead Poets Society
    awards: [{ name: "Oscar", year: 1990, category: "Best Original Screenplay" }]
  },
  489: { // Good Will Hunting
    awards: [{ name: "Oscar", year: 1998, category: "Best Original Screenplay" }]
  },
  197: { // Braveheart
    awards: [{ name: "Oscar", year: 1996, category: "Best Picture" }]
  },
  280: { // Terminator 2: Judgment Day
    awards: [{ name: "Oscar", year: 1992, category: "Best Visual Effects" }]
  },
  562: { // Die Hard
    awards: []
  },
  111: { // Scarface
    awards: []
  },
  500: { // Reservoir Dogs
    awards: []
  },
  16869: { // Inglourious Basterds
    awards: [{ name: "Oscar", year: 2010, category: "Best Supporting Actor" }]
  },
  550988: { // Free Guy
    awards: []
  },
  438631: { // Dune
    awards: [{ name: "Oscar", year: 2022, category: "Best Cinematography" }]
  },
  693134: { // Dune: Part Two
    awards: []
  },
  346698: { // Barbie
    awards: [{ name: "Oscar", year: 2024, category: "Best Original Song" }]
  },
  786892: { // Furiosa
    awards: []
  },
  823464: { // Godzilla x Kong
    awards: []
  }
};

// Award emoji mappings
const AWARD_EMOJIS = {
  "Oscar": "🏆",
  "Cannes": "🌴",
  "BAFTA": "🎭",
  "Venice": "🦁",
  "Berlin": "🐻"
};

// Get awards for a movie
function getMovieAwards(movieId) {
  const entry = PRESTIGE_DATABASE[movieId];
  if (!entry || !entry.awards || entry.awards.length === 0) {
    return null;
  }
  return entry.awards;
}

// Check if movie has any prestige awards
function hasPrestigeAward(movieId) {
  const awards = getMovieAwards(movieId);
  return awards && awards.length > 0;
}

// Format award for display
function formatAward(award) {
  const emoji = AWARD_EMOJIS[award.name] || "🏆";
  return `${emoji} ${award.name} ${award.year}`;
}

// Get all awards as HTML badges
function getAwardBadgesHTML(movieId) {
  const awards = getMovieAwards(movieId);
  if (!awards) return "";
  
  return awards.map(award => {
    const emoji = AWARD_EMOJIS[award.name] || "🏆";
    return `<span class="award-badge">${emoji} ${award.name} ${award.year}</span>`;
  }).join("");
}

// Export for use in game.js
window.PRESTIGE_DATABASE = PRESTIGE_DATABASE;
window.AWARD_EMOJIS = AWARD_EMOJIS;
window.getMovieAwards = getMovieAwards;
window.hasPrestigeAward = hasPrestigeAward;
window.formatAward = formatAward;
window.getAwardBadgesHTML = getAwardBadgesHTML;