// ============================================
// ORBIT GAME - DAILY PUZZLES
// Pre-curated list of quality puzzle movies
// Each movie has 5+ recognizable actors
// ============================================

const DAILY_PUZZLES = [
  // Format: TMDB Movie ID
  // These are all popular films with strong ensemble casts
  
  // Week 1
  238,    // The Godfather
  240,    // The Godfather Part II  
  424,    // Schindler's List
  680,    // Pulp Fiction
  155,    // The Dark Knight
  13,     // Forrest Gump
  550,    // Fight Club
  
  // Week 2
  278,    // The Shawshank Redemption
  122,    // LOTR: Return of the King
  120,    // LOTR: Fellowship
  121,    // LOTR: Two Towers
  603,    // The Matrix
  604,    // The Matrix Reloaded
  605,    // The Matrix Revolutions
  
  // Week 3
  157336, // Interstellar
  27205,  // Inception
  49026,  // The Dark Knight Rises
  272,    // Batman Begins
  274,    // The Silence of the Lambs
  807,    // Se7en
  745,    // The Sixth Sense
  
  // Week 4
  597,    // Titanic
  329,    // Jurassic Park
  330,    // The Lost World: Jurassic Park
  578,    // Jaws
  857,    // Saving Private Ryan
  197,    // Braveheart
  510,    // One Flew Over the Cuckoo's Nest
  
  // Week 5
  98,     // Gladiator
  1422,   // The Departed
  769,    // GoodFellas
  311,    // Once Upon a Time in America
  111,    // Scarface
  238,    // The Godfather (can repeat after ~52 weeks)
  429,    // The Good, the Bad and the Ugly
  
  // Week 6
  11,     // Star Wars: A New Hope
  1891,   // The Empire Strikes Back
  1892,   // Return of the Jedi
  1893,   // Star Wars: Episode I
  1894,   // Star Wars: Episode II
  1895,   // Star Wars: Episode III
  140607, // Star Wars: The Force Awakens
  
  // Week 7
  181808, // Star Wars: The Last Jedi
  181812, // Star Wars: Rise of Skywalker
  348,    // Alien
  679,    // Aliens
  8078,   // Alien 3
  126889, // Alien: Covenant
  135397, // Prometheus
  
  // Week 8
  68718,  // Django Unchained
  16869,  // Inglourious Basterds
  500,    // Reservoir Dogs
  393,    // Kill Bill: Vol. 1
  394,    // Kill Bill: Vol. 2
  24,     // Kill Bill Vol. 1
  104,    // Kill Bill Vol. 2
  
  // Week 9
  562,    // Die Hard
  1573,   // Die Hard 2
  1572,   // Die Hard with a Vengeance
  1571,   // Live Free or Die Hard
  47964,  // A Good Day to Die Hard
  280,    // Terminator 2
  218,    // The Terminator
  
  // Week 10
  87101,  // Terminator Genisys
  290859, // Terminator: Dark Fate
  585,    // Monsters, Inc.
  62211,  // Monsters University
  862,    // Toy Story
  863,    // Toy Story 2
  10193,  // Toy Story 3
  
  // Week 11
  301528, // Toy Story 4
  9806,   // The Incredibles
  260513, // Incredibles 2
  12,     // Finding Nemo
  127380, // Finding Dory
  920,    // Cars
  49013,  // Cars 2
  
  // Week 12
  260514, // Cars 3
  150540, // Inside Out
  508442, // Inside Out 2
  354912, // Coco
  508947, // Turning Red
  508943, // Luca
  301528, // Toy Story 4
  
  // Week 13
  22,     // Pirates of the Caribbean: Curse of the Black Pearl
  58,     // Pirates of the Caribbean: Dead Man's Chest
  285,    // Pirates of the Caribbean: At World's End
  1865,   // Pirates of the Caribbean: On Stranger Tides
  166426, // Pirates of the Caribbean: Dead Men Tell No Tales
  1726,   // Iron Man
  10138,  // Iron Man 2
  
  // Week 14
  68721,  // Iron Man 3
  1771,   // Captain America: The First Avenger
  100402, // Captain America: The Winter Soldier
  271110, // Captain America: Civil War
  24428,  // The Avengers
  99861,  // Avengers: Age of Ultron
  299536, // Avengers: Infinity War
  
  // Week 15
  299534, // Avengers: Endgame
  284053, // Thor: Ragnarok
  10195,  // Thor
  76338,  // Thor: The Dark World
  616037, // Thor: Love and Thunder
  284052, // Doctor Strange
  453395, // Doctor Strange in the Multiverse of Madness
  
  // Week 16
  315635, // Spider-Man: Homecoming
  429617, // Spider-Man: Far From Home
  569094, // Spider-Man: No Way Home
  102382, // The Amazing Spider-Man
  102899, // The Amazing Spider-Man 2
  557,    // Spider-Man (2002)
  558,    // Spider-Man 2
  
  // Week 17
  559,    // Spider-Man 3
  324857, // Spider-Man: Into the Spider-Verse
  569094, // Spider-Man: No Way Home
  118340, // Guardians of the Galaxy
  283995, // Guardians of the Galaxy Vol. 2
  447365, // Guardians of the Galaxy Vol. 3
  505642, // Black Panther: Wakanda Forever
  
  // Week 18
  284054, // Black Panther
  497698, // Black Widow
  566525, // Shang-Chi
  524434, // Eternals
  640146, // Ant-Man and the Wasp: Quantumania
  102899, // The Amazing Spider-Man 2
  298618, // The Flash
  
  // Week 19
  141052, // Justice League
  209112, // Batman v Superman
  49521,  // Man of Steel
  436969, // The Suicide Squad
  297761, // Suicide Squad
  297802, // Aquaman
  572802, // Aquaman 2
  
  // Week 20
  475557, // Joker
  414906, // The Batman
  364,    // Batman Returns
  268,    // Batman (1989)
  415,    // Batman Forever
  164,    // Batman & Robin
  272,    // Batman Begins
  
  // Week 21
  76341,  // Mad Max: Fury Road
  9945,   // Mad Max
  8810,   // Mad Max 2
  9355,   // Mad Max Beyond Thunderdome
  786892, // Furiosa
  597,    // Titanic
  13,     // Forrest Gump
  
  // Week 22
  489,    // Good Will Hunting
  453,    // A Beautiful Mind
  207,    // Dead Poets Society
  640,    // Catch Me If You Can
  194,    // Amélie
  637,    // Life Is Beautiful
  901,    // Cinema Paradiso
  
  // Week 23
  496243, // Parasite
  516891, // A Man Called Otto
  372058, // Your Name
  568124, // Encanto
  508943, // Luca
  508947, // Turning Red
  585083, // Hotel Transylvania: Transformania
  
  // Week 24
  568620, // Snake Eyes
  361743, // Top Gun: Maverick
  744,    // Top Gun
  98,     // Gladiator
  857,    // Saving Private Ryan
  652,    // Troy
  56292,  // Mission: Impossible
  
  // Week 25
  137113, // Edge of Tomorrow
  353081, // Mission: Impossible - Fallout
  177677, // Mission: Impossible - Rogue Nation
  75612,  // Oblivion
  56292,  // Mission: Impossible
  955,    // Mission: Impossible II
  954,    // Mission: Impossible III
  
  // Week 26
  56292,  // Mission: Impossible (1996)
  955,    // Mission: Impossible II
  954,    // Mission: Impossible III
  56891,  // Ghost Protocol
  177677, // Rogue Nation
  353081, // Fallout
  575264, // Mission: Impossible – Dead Reckoning
  
  // Week 27
  335984, // Blade Runner 2049
  78,     // Blade Runner
  264644, // Room
  150689, // Cinderella (2015)
  10681,  // WALL·E
  62211,  // Monsters University
  10198,  // Ratatouille
  
  // Week 28
  14,     // American Beauty
  73,     // American History X
  641,    // Requiem for a Dream
  77,     // Memento
  807,    // Se7en
  1124,   // The Prestige
  37799,  // The Social Network
  
  // Week 29
  508442, // Soul (2020)
  508,    // Up
  862,    // Toy Story
  920,    // Cars
  9806,   // The Incredibles
  585,    // Monsters, Inc.
  12,     // Finding Nemo
  
  // Week 30
  76600,  // Avatar: The Way of Water
  19995,  // Avatar
  27205,  // Inception
  157336, // Interstellar
  438631, // Dune
  693134, // Dune: Part Two
  872585, // Oppenheimer
  
  // Week 31
  346698, // Barbie
  637920, // Everything Everywhere All at Once
  569094, // Spider-Man: No Way Home
  536554, // M3GAN
  502356, // The Super Mario Bros. Movie
  447277, // The Little Mermaid (2023)
  447365, // Guardians Vol 3
  
  // Week 32
  120467, // The Grand Budapest Hotel
  194662, // Birdman
  314365, // Spotlight
  376867, // Moonlight
  399055, // The Shape of Water
  490132, // Green Book
  515001, // Nomadland
  
  // Week 33
  581734, // CODA
  637920, // Everything Everywhere
  872585, // Oppenheimer
  346698, // Barbie
  68718,  // Django Unchained
  68734,  // Argo
  45269,  // The King's Speech
  
  // Week 34
  44833,  // The Artist
  70,     // Million Dollar Baby
  1422,   // The Departed
  1574,   // Crash
  1640,   // Babel
  14,     // American Beauty
  98,     // Gladiator
  
  // Week 35
  453,    // A Beautiful Mind
  597,    // Titanic
  424,    // Schindler's List
  510,    // One Flew Over the Cuckoo's Nest
  197,    // Braveheart
  13,     // Forrest Gump
  274,    // Silence of the Lambs
  
  // Week 36
  671,    // Harry Potter: Sorcerer's Stone
  672,    // Chamber of Secrets
  673,    // Prisoner of Azkaban
  674,    // Goblet of Fire
  675,    // Order of Phoenix
  767,    // Half-Blood Prince
  12444,  // Deathly Hallows 1
  
  // Week 37
  12445,  // Deathly Hallows 2
  899082, // Hogwarts Legacy
  671,    // HP: Sorcerer's Stone (repeat OK - diff cast questions)
  764,    // HP: Prisoner of Azkaban
  674,    // HP: Goblet of Fire
  675,    // HP: Order of Phoenix
  767,    // HP: Half-Blood Prince
  
  // Week 38
  101,    // Léon: The Professional
  103,    // Taxi Driver
  539,    // Psycho
  78,     // Blade Runner
  348,    // Alien
  679,    // Aliens
  185,    // A Clockwork Orange
  
  // Week 39
  378,    // Casablanca
  389,    // 12 Angry Men
  311,    // Once Upon a Time in America
  429,    // The Good, the Bad and the Ugly
  947,    // Rashomon
  346,    // Seven Samurai
  10494,  // Perfect Blue
  
  // Week 40
  244786, // Whiplash
  205596, // The Imitation Game
  194662, // Birdman
  210577, // Gone Girl
  76341,  // Mad Max: Fury Road
  264644, // Room
  281957, // The Revenant
  
  // Week 41
  293660, // Deadpool
  383498, // Deadpool 2
  533535, // Deadpool & Wolverine
  2080,   // X-Men
  36657,  // X2
  36668,  // X-Men: The Last Stand
  127585, // X-Men: Days of Future Past
  
  // Week 42
  246655, // X-Men: Apocalypse
  340102, // X-Men: Dark Phoenix
  1724,   // The Incredible Hulk
  263115, // Logan
  49538,  // X-Men: First Class
  106646, // The Wolverine
  1855,   // X-Men Origins: Wolverine
  
  // Week 43
  8355,   // Ice Age
  46195,  // Ice Age: Dawn of the Dinosaurs
  57800,  // Ice Age: Continental Drift
  137113, // Edge of Tomorrow
  384682, // Despicable Me 3
  211672, // Minions
  324852, // Despicable Me 2
  
  // Week 44
  20352,  // Despicable Me
  438148, // Minions: Rise of Gru
  8587,   // The Lion King
  420818, // The Lion King (2019)
  102651, // Maleficent
  420817, // Aladdin (2019)
  9948,   // Beauty and the Beast
  
  // Week 45
  321612, // Beauty and the Beast (2017)
  150540, // Inside Out
  354912, // Coco
  508442, // Soul
  568124, // Encanto
  438631, // Dune
  693134, // Dune: Part Two
  
  // Week 46
  111,    // Scarface
  769,    // GoodFellas
  1422,   // The Departed
  629,    // The Usual Suspects
  1359,   // American Gangster
  4935,   // The Town
  240,    // The Godfather Part II
  
  // Week 47
  497,    // The Green Mile
  840,    // Close Encounters
  578,    // Jaws
  73,     // American History X
  641,    // Requiem for a Dream
  77,     // Memento
  37799,  // The Social Network
  
  // Week 48
  77338,  // The Intouchables
  76203,  // 12 Years a Slave
  152601, // Her
  286217, // The Martian
  550988, // Free Guy
  338953, // Ready Player One
  181533, // John Wick
  
  // Week 49
  245891, // John Wick
  324552, // John Wick: Chapter 2
  458156, // John Wick: Chapter 3
  603692, // John Wick: Chapter 4
  604,    // Matrix Reloaded
  605,    // Matrix Revolutions
  624860, // Matrix Resurrections
  
  // Week 50
  562,    // Die Hard
  280,    // Terminator 2
  218,    // The Terminator
  329,    // Jurassic Park
  330,    // The Lost World
  578,    // Jaws
  597,    // Titanic
  
  // Week 51 (Christmas themed)
  771,    // Home Alone
  772,    // Home Alone 2
  869,    // The Nightmare Before Christmas
  10719,  // Elf
  13183,  // Die Hard (Christmas movie!)
  121,    // LOTR: Two Towers
  122,    // LOTR: Return of the King
  
  // Week 52
  238,    // The Godfather (full circle)
  680,    // Pulp Fiction
  550,    // Fight Club
  155,    // The Dark Knight
  872585, // Oppenheimer
  346698, // Barbie
  637920, // Everything Everywhere
];

// Get today's puzzle movie ID
function getDailyPuzzleMovieId() {
  const launchDate = new Date("2025-01-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - launchDate;
  const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Cycle through the puzzle list
  const puzzleIndex = dayNumber % DAILY_PUZZLES.length;
  
  return DAILY_PUZZLES[puzzleIndex];
}

// Get puzzle number (for display)
function getDailyPuzzleNumber() {
  const launchDate = new Date("2025-01-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - launchDate;
  const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return dayNumber + 1;
}

// Export
window.DAILY_PUZZLES = DAILY_PUZZLES;
window.getDailyPuzzleMovieId = getDailyPuzzleMovieId;