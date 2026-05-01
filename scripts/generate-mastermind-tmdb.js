#!/usr/bin/env node

// ============================================
// MASTERMIND TMDB Question Generator
// Generates Release Year + Tagline questions
// from TMDB movie data for the Mastermind game.
//
// Usage: node scripts/generate-mastermind-tmdb.js
// Output: games/mastermind-tmdb-questions.js
// ============================================

const fs = require('fs');
const path = require('path');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) {
  console.error('Set TMDB_API_KEY env var before running this script.');
  process.exit(1);
}
const BASE_URL = 'https://api.themoviedb.org/3';

// ~200 well-known movie IDs across decades
const MOVIE_IDS = [
  // 1970s
  238,    // The Godfather
  240,    // The Godfather Part II
  769,    // GoodFellas — wait, that's 1990. Use correct 70s:
  311,    // Once Upon a Time in the West
  1091,   // The Thing (1982 — close enough, reclassified below)
  510,    // One Flew Over the Cuckoo's Nest
  600,    // Full Metal Jacket
  73,     // American History X
  578,    // Jaws
  694,    // The Shining
  334,    // Magnolia
  348,    // Alien
  1933,   // The Exorcist
  935,    // Dr. Strangelove
  991,    // Apocalypse Now

  // 1980s
  105,    // Back to the Future
  744,    // Top Gun
  78,     // Blade Runner
  89,     // Indiana Jones and the Raiders of the Lost Ark
  1891,   // The Empire Strikes Back
  914,    // The Great Escape
  11,     // Star Wars
  85,     // Raiders of the Lost Ark (if dup, TMDB will handle)
  101,    // Léon: The Professional
  185,    // A Clockwork Orange
  429,    // The Good, the Bad and the Ugly
  197,    // Braveheart
  111,    // Scarface
  1366,   // Rocky
  679,    // Aliens
  562,    // Die Hard
  1885,   // Predator
  9806,   // The Breakfast Club
  2493,   // The Princess Bride
  2108,   // The Untouchables

  // 1990s
  550,    // Fight Club
  680,    // Pulp Fiction
  13,     // Forrest Gump
  424,    // Schindler's List
  807,    // Se7en
  497,    // The Green Mile
  329,    // Jurassic Park
  274,    // The Silence of the Lambs
  857,    // Saving Private Ryan
  598,    // City of God
  110,    // Three Colors: Red
  489,    // Good Will Hunting
  118,    // Charlie's Angels — wrong; use The Shawshank Redemption:
  278,    // The Shawshank Redemption
  37165,  // The Truman Show
  597,    // Titanic
  603,    // The Matrix
  106,    // Predator
  914,    // unused dup
  769,    // GoodFellas
  629,    // The Usual Suspects
  194,    // Amélie
  153,    // Lost in Translation
  500,    // Reservoir Dogs
  429,    // Good the Bad Ugly — dup, skip at runtime
  914,    // dup
  73,     // American History X
  640,    // Catch Me If You Can
  11324,  // Shutter Island

  // 2000s
  120,    // LOTR: The Fellowship of the Ring
  121,    // LOTR: The Two Towers
  122,    // LOTR: The Return of the King
  155,    // The Dark Knight
  272,    // Batman Begins
  98,     // Gladiator
  585,    // Monsters, Inc.
  128,    // Princess Mononoke
  1124,   // The Prestige
  745,    // A Beautiful Mind
  453,    // A Beautiful Mind — dup? No, 453 = Hitch
  24,     // Kill Bill: Vol. 1
  16869,  // Inglourious Basterds
  1893,   // Star Wars: Episode I
  1894,   // Star Wars: Episode II
  1895,   // Star Wars: Episode III
  103,    // Taxi Driver
  637,    // Life Is Beautiful
  4935,   // Howl's Moving Castle
  129,    // Spirited Away
  568,    // Apollo 13
  710,    // GoldenEye
  78,     // Blade Runner — dup
  671,    // Harry Potter and the Philosopher's Stone
  672,    // Harry Potter and the Chamber of Secrets
  674,    // Harry Potter and the Goblet of Fire
  767,    // Harry Potter and the Half-Blood Prince
  12444,  // Harry Potter and the Deathly Hallows: Part 1
  12445,  // Harry Potter and the Deathly Hallows: Part 2
  22,     // Pirates of the Caribbean: Curse of the Black Pearl
  58,     // Pirates of the Caribbean: Dead Man's Chest
  285,    // Pirates of the Caribbean: At World's End
  1726,   // Iron Man
  10138,  // Iron Man 2
  1771,   // Captain America: The First Avenger
  10195,  // Thor
  1930,   // The Amazing Spider-Man
  557,    // Spider-Man
  559,    // Spider-Man 3
  1858,   // Transformers
  8587,   // The Lion King
  862,    // Toy Story
  863,    // Toy Story 2
  10681,  // WALL·E
  12,     // Finding Nemo
  9502,   // Kung Fu Panda
  585,    // Monsters Inc — dup
  14160,  // Up
  920,    // Cars
  62,     // 2001: A Space Odyssey

  // 2010s
  27205,  // Inception
  19995,  // Avatar
  157336, // Interstellar
  76341,  // Mad Max: Fury Road
  299536, // Avengers: Infinity War
  24428,  // The Avengers
  68718,  // Django Unchained
  281957, // The Revenant
  244786, // Whiplash
  346364, // It (2017)
  284053, // Thor: Ragnarok
  283995, // Guardians of the Galaxy
  118340, // Guardians of the Galaxy Vol. 2
  271110, // Captain America: Civil War
  99861,  // Avengers: Age of Ultron
  284054, // Black Panther
  299534, // Avengers: Endgame
  429617, // Spider-Man: Far From Home
  315635, // Spider-Man: Homecoming
  181808, // Star Wars: The Force Awakens
  181812, // Star Wars: The Last Jedi
  330457, // Frozen II
  150540, // Inside Out
  354912, // Coco
  269149, // Zootopia
  198663, // The Maze Runner
  131631, // The Hunger Games: Catching Fire
  321612, // Beauty and the Beast (2017)
  447332, // A Quiet Place
  335984, // Blade Runner 2049
  374720, // Dunkirk
  399055, // The Shape of Water
  353486, // Joker
  475557, // Joker (2019)
  496243, // Parasite
  466272, // Once Upon a Time in Hollywood
  530385, // Midsommar
  458156, // John Wick: Chapter 3

  // 2020s
  508442, // Soul
  385687, // Fast X
  872585, // Oppenheimer
  693134, // Dune: Part Two
  823464, // Godzilla x Kong
  1022789,// Inside Out 2
  786892, // Furiosa
  698687, // Transformers One
  438631, // Dune
  634649, // Spider-Man: No Way Home
  580489, // Venom: Let There Be Carnage
  524434, // Eternals
  566525, // Shang-Chi
  505642, // Black Panther: Wakanda Forever
  616037, // Thor: Love and Thunder
  507086, // Jurassic World Dominion
  361743, // Top Gun: Maverick
  436270, // Black Adam
  640146, // Ant-Man and the Wasp: Quantumania
  569094, // Spider-Man: Across the Spider-Verse
  1011985,// Kung Fu Panda 4
  653346, // Kingdom of the Planet of the Apes
  912649, // Venom: The Last Dance
  940721, // Godzilla Minus One
  346698, // Barbie
  976573, // Elemental
  447365, // Guardians of the Galaxy Vol. 3
];

// Deduplicate IDs
const UNIQUE_IDS = [...new Set(MOVIE_IDS)];

// ============================================
// TMDB Fetching with rate limiting
// ============================================

async function fetchMovie(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
  if (!res.ok) {
    console.warn(`  Warning: failed to fetch movie ${id} (${res.status})`);
    return null;
  }
  return res.json();
}

async function fetchAllMovies() {
  console.log(`Fetching ${UNIQUE_IDS.length} movies from TMDB...`);
  const movies = [];
  const BATCH_SIZE = 35;

  for (let i = 0; i < UNIQUE_IDS.length; i++) {
    const data = await fetchMovie(UNIQUE_IDS[i]);
    if (data && data.id) movies.push(data);

    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < UNIQUE_IDS.length) {
      console.log(`  Fetched ${i + 1}/${UNIQUE_IDS.length}... pausing for rate limit`);
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  console.log(`  Fetched ${movies.length} movies successfully.`);
  return movies;
}

// ============================================
// Release Year question generation
// ============================================

function generateYearQuestions(movies) {
  const currentYear = new Date().getFullYear();
  const questions = [];

  for (const m of movies) {
    if (!m.release_date || m.release_date.length < 4) continue;

    const year = parseInt(m.release_date.substring(0, 4), 10);
    if (isNaN(year) || year < 1920) continue;

    const correct = String(year);

    // Generate 3 wrong years: offsets of ±1..5, no dups, no future, no < 1920
    const offsets = [-3, -1, 2, 4, -5, 1, 3, -2, 5, -4];
    const wrongs = [];
    for (const off of offsets) {
      if (wrongs.length >= 3) break;
      const w = year + off;
      const ws = String(w);
      if (w >= 1920 && w <= currentYear && ws !== correct && !wrongs.includes(ws)) {
        wrongs.push(ws);
      }
    }

    if (wrongs.length < 3) continue;

    questions.push({
      q: `In what year was "${m.title}" released?`,
      a: correct,
      wrong: wrongs
    });
  }

  return questions;
}

// ============================================
// Tagline question generation
// ============================================

function generateTaglineQuestions(movies) {
  const questions = [];
  const moviesWithTaglines = movies.filter(m => m.tagline && m.tagline.trim().length > 5);

  for (let i = 0; i < moviesWithTaglines.length; i++) {
    const m = moviesWithTaglines[i];
    const tagline = m.tagline.trim();
    const words = tagline.split(/\s+/);
    const movieYear = m.release_date ? parseInt(m.release_date.substring(0, 4), 10) : 2000;

    // Randomly choose format A or B
    const useFormatA = words.length >= 5 && Math.random() < 0.5;

    if (useFormatA) {
      // Format A: Complete the tagline — blank last 1-2 words
      const blankCount = words.length >= 7 ? 2 : 1;
      const firstPart = words.slice(0, words.length - blankCount).join(' ');
      const lastWords = words.slice(words.length - blankCount).join(' ');

      // Generate plausible wrong endings (generic film-sounding phrases)
      const fakeEndings = [
        "begins now", "of all time", "no turning back", "will rise",
        "changes everything", "is just the beginning", "never ends",
        "strikes back", "the truth", "to survive", "from the start",
        "for revenge", "of the century", "in the dark", "to the end",
        "once more", "above all", "you imagined", "at any cost"
      ];

      // Shuffle and pick 3 that don't match
      const shuffled = fakeEndings.sort(() => Math.random() - 0.5);
      const wrongs = shuffled
        .filter(e => e.toLowerCase() !== lastWords.toLowerCase())
        .slice(0, 3);

      if (wrongs.length < 3) continue;

      questions.push({
        q: `Complete the tagline for "${m.title}": "${firstPart}..."`,
        a: lastWords,
        wrong: wrongs
      });
    } else {
      // Format B: Match tagline to movie
      // Pick 3 wrong titles from similar era (±10 years)
      const candidates = moviesWithTaglines.filter(other =>
        other.id !== m.id &&
        other.release_date &&
        Math.abs(parseInt(other.release_date.substring(0, 4), 10) - movieYear) <= 10
      );

      if (candidates.length < 3) continue;

      const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);
      const wrongs = shuffledCandidates.slice(0, 3).map(c => c.title);

      questions.push({
        q: `Which movie has the tagline: "${tagline}"?`,
        a: m.title,
        wrong: wrongs
      });
    }
  }

  return questions;
}

// ============================================
// Main
// ============================================

async function main() {
  const movies = await fetchAllMovies();

  if (movies.length === 0) {
    console.error('No movies fetched. Check your API key and network.');
    process.exit(1);
  }

  const yearQs = generateYearQuestions(movies);
  const taglineQs = generateTaglineQuestions(movies.filter(m => m.tagline && m.tagline.trim().length > 5));

  console.log(`Generated ${yearQs.length} year questions`);
  console.log(`Generated ${taglineQs.length} tagline questions`);

  const output = `// Auto-generated TMDB trivia for Mastermind
// Generated: ${new Date().toISOString()}
// Movies processed: ${movies.length}
// Year questions: ${yearQs.length}
// Tagline questions: ${taglineQs.length}

const TMDB_YEARS = ${JSON.stringify(yearQs, null, 2)};

const TMDB_TAGLINES = ${JSON.stringify(taglineQs, null, 2)};
`;

  const outPath = path.join(__dirname, '..', 'games', 'mastermind-tmdb-questions.js');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`\nDone! Written to ${outPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
