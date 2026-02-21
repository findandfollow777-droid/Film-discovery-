// AI-generated trivia for Mastermind
// Generated: 2026-02-21T09:25:25.688Z
// Model: claude-haiku-4-5-20251001
// Directors: 159 questions
// Oscars: 163 questions
// Quotes: 121 questions
// Actors: 173 questions

const AI_DIRECTORS = [
  {
    "q": "Who directed 'Blade Runner 2049'?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Ridley Scott",
      "Christopher Nolan",
      "David Fincher"
    ]
  },
  {
    "q": "'The Shawshank Redemption' was whose directorial debut?",
    "a": "Frank Darabont",
    "wrong": [
      "Steven Spielberg",
      "Martin Scorsese",
      "Joel Coen"
    ]
  },
  {
    "q": "Which director made both 'Eternal Sunshine of the Spotless Mind' and 'The Science of Sleep'?",
    "a": "Michel Gondry",
    "wrong": [
      "Spike Jonze",
      "Charlie Kaufman",
      "Wes Anderson"
    ]
  },
  {
    "q": "Who directed 'Mulholland Drive'?",
    "a": "David Lynch",
    "wrong": [
      "Paul Thomas Anderson",
      "Quentin Tarantino",
      "David Fincher"
    ]
  },
  {
    "q": "Stanley Kubrick did NOT direct which of these films?",
    "a": "A Clockwork Orange 2: The Sequel",
    "wrong": [
      "Full Metal Jacket",
      "The Shining",
      "2001: A Space Odyssey"
    ]
  },
  {
    "q": "Which director made both 'Goodfellas' and 'The Irishman'?",
    "a": "Martin Scorsese",
    "wrong": [
      "Christopher Nolan",
      "Steven Spielberg",
      "Quentin Tarantino"
    ]
  },
  {
    "q": "Who directed 'Moonlight'?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ryan Coogler",
      "Ava DuVernay",
      "Lee Daniels"
    ]
  },
  {
    "q": "'There Will Be Blood' was whose directorial debut?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Quentin Tarantino",
      "David Fincher",
      "Joel Coen"
    ]
  },
  {
    "q": "Ridley Scott did NOT direct which of these films?",
    "a": "Prometheus: Fire and Stone",
    "wrong": [
      "Blade Runner",
      "Gladiator",
      "The Martian"
    ]
  },
  {
    "q": "Who directed 'Knives Out'?",
    "a": "Rian Johnson",
    "wrong": [
      "Taika Waititi",
      "Guy Ritchie",
      "Edgar Wright"
    ]
  },
  {
    "q": "Which director made both 'Fargo' and 'No Country for Old Men'?",
    "a": "Joel and Ethan Coen",
    "wrong": [
      "Quentin Tarantino and Paul Thomas Anderson",
      "Martin Scorsese and Steven Spielberg",
      "Christopher Nolan and Denis Villeneuve"
    ]
  },
  {
    "q": "'The Grand Budapest Hotel' was directed by whom?",
    "a": "Wes Anderson",
    "wrong": [
      "Greta Gerwig",
      "Paul Thomas Anderson",
      "David Anderson"
    ]
  },
  {
    "q": "Who directed 'Dune' (2021)?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Ridley Scott",
      "Steven Spielberg",
      "James Cameron"
    ]
  },
  {
    "q": "Quentin Tarantino did NOT direct which of these films?",
    "a": "Kill Bill: The Whole Bloody Affair (theatrical release)",
    "wrong": [
      "Inglourious Basterds",
      "The Hateful Eight",
      "Pulp Fiction"
    ]
  },
  {
    "q": "Which director made both 'Brokeback Mountain' and 'Life of Pi'?",
    "a": "Ang Lee",
    "wrong": [
      "Denis Villeneuve",
      "Barry Jenkins",
      "Greta Gerwig"
    ]
  },
  {
    "q": "'Parasite' was directed by whom?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Lee Chang-dong",
      "Na Hong-jin"
    ]
  },
  {
    "q": "Who directed 'Se7en'?",
    "a": "David Fincher",
    "wrong": [
      "Christopher Nolan",
      "Denis Villeneuve",
      "Paul Thomas Anderson"
    ]
  },
  {
    "q": "Steven Spielberg did NOT direct which of these films?",
    "a": "Saving Private Ryan 2: Return to Normandy",
    "wrong": [
      "Schindler's List",
      "Munich",
      "War Horse"
    ]
  },
  {
    "q": "Which director made both 'Lady Bird' and 'Little Women'?",
    "a": "Greta Gerwig",
    "wrong": [
      "Sofia Coppola",
      "Claire Denis",
      "Kelly Reichardt"
    ]
  },
  {
    "q": "'Rashomon' was directed by whom?",
    "a": "Akira Kurosawa",
    "wrong": [
      "Masaki Kobayashi",
      "Kenji Mizoguchi",
      "Yasujirō Ozu"
    ]
  },
  {
    "q": "Which director made both 'Eternal Sunshine of the Spotless Mind' and 'The Master'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Charlie Kaufman",
      "Spike Jonze",
      "Michel Gondry"
    ]
  },
  {
    "q": "'The Grand Budapest Hotel' was directed by which acclaimed filmmaker?",
    "a": "Wes Anderson",
    "wrong": [
      "Taika Waititi",
      "The Coen Brothers",
      "Greta Gerwig"
    ]
  },
  {
    "q": "Who directed 'Moonlight' (2016)?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ava DuVernay",
      "Ryan Coogler",
      "Spike Lee"
    ]
  },
  {
    "q": "Which of these films did Stanley Kubrick NOT direct?",
    "a": "Eyes Wide Open",
    "wrong": [
      "Eyes Wide Shut",
      "Full Metal Jacket",
      "The Shining"
    ]
  },
  {
    "q": "'Dune' (2021) and 'Arrival' were both directed by whom?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Christopher Nolan",
      "Ridley Scott",
      "J.J. Abrams"
    ]
  },
  {
    "q": "Who made both 'Zodiac' and 'The Social Network'?",
    "a": "David Fincher",
    "wrong": [
      "Quentin Tarantino",
      "Martin Scorsese",
      "Christopher Nolan"
    ]
  },
  {
    "q": "'No Country for Old Men' was directed by which duo?",
    "a": "The Coen Brothers",
    "wrong": [
      "The Safdie Brothers",
      "The Wachowskis",
      "Anthony and Joe Russo"
    ]
  },
  {
    "q": "Which director made both 'Sense and Sensibility' and 'Crouching Tiger, Hidden Dragon'?",
    "a": "Ang Lee",
    "wrong": [
      "Baz Luhrmann",
      "Sofia Coppola",
      "David Lean"
    ]
  },
  {
    "q": "'The Lighthouse' (2019) was whose directorial effort?",
    "a": "Robert Eggers",
    "wrong": [
      "A24 Studios Collective",
      "Ari Aster",
      "Jeremy Saulnier"
    ]
  },
  {
    "q": "Who directed 'Knives Out' (2019)?",
    "a": "Rian Johnson",
    "wrong": [
      "David Fincher",
      "Tarantino",
      "Guy Ritchie"
    ]
  },
  {
    "q": "'Parasite' was directed by which South Korean filmmaker?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Lee Chang-dong",
      "Hong Sang-soo"
    ]
  },
  {
    "q": "Which director did NOT make a film starring Tom Cruise?",
    "a": "The Coen Brothers",
    "wrong": [
      "Steven Spielberg",
      "Christopher McQuarrie",
      "Martin Scorsese"
    ]
  },
  {
    "q": "'Lady Bird' (2017) was whose directorial debut?",
    "a": "Greta Gerwig",
    "wrong": [
      "Olivia Wilde",
      "Ava DuVernay",
      "Chloé Zhao"
    ]
  },
  {
    "q": "Who directed both 'Memories of Murder' and 'Snowpiercer'?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Yimou Zhang",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "'Mulholland Drive' was directed by which auteur?",
    "a": "David Lynch",
    "wrong": [
      "Paul Thomas Anderson",
      "Spike Jonze",
      "Jean-Luc Godard"
    ]
  },
  {
    "q": "Which director made both 'Ocean's Eleven' (2001) and 'Magic Mike'?",
    "a": "Steven Soderbergh",
    "wrong": [
      "Guy Ritchie",
      "Michael Bay",
      "Tony Scott"
    ]
  },
  {
    "q": "'Stalker' and 'Mirror' were made by which Russian director?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Eisenstein",
      "Mikhail Kalatozov",
      "Andrei Konchalovsky"
    ]
  },
  {
    "q": "Who directed 'Everything Everywhere All at Once' (2022)?",
    "a": "Daniel Kwan and Daniel Scheinert",
    "wrong": [
      "Greta Gerwig",
      "the Russo Brothers",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "'Ran' and 'Seven Samurai' were both directed by whom?",
    "a": "Akira Kurosawa",
    "wrong": [
      "Masaki Kobayashi",
      "Kenji Mizoguchi",
      "Orson Welles"
    ]
  },
  {
    "q": "Who directed the 2021 film 'Dune'?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Ridley Scott",
      "Christopher Nolan",
      "David Fincher"
    ]
  },
  {
    "q": "Which director made both 'There Will Be Blood' and 'Inherent Vice'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "David Fincher",
      "Martin Scorsese",
      "Quentin Tarantino"
    ]
  },
  {
    "q": "'Parasite' was the directorial work of which acclaimed filmmaker?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Lee Chang-dong",
      "Park Chan-wook",
      "Kim Jee-woon"
    ]
  },
  {
    "q": "Who directed 'The Shape of Water' (2017)?",
    "a": "Guillermo del Toro",
    "wrong": [
      "Alfonso Cuarón",
      "Ari Aster",
      "Damien Chazelle"
    ]
  },
  {
    "q": "Which of these films did NOT have David Fincher as director?",
    "a": "Gone Girl",
    "wrong": [
      "Se7en",
      "The Social Network",
      "Mindhunter (TV pilot)"
    ]
  },
  {
    "q": "Who made both 'Boogie Nights' and 'The Master'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Joel Coen",
      "Ethan Coen",
      "Ari Aster"
    ]
  },
  {
    "q": "'Lady Bird' (2017) was the directorial debut of which actress-turned-filmmaker?",
    "a": "Greta Gerwig",
    "wrong": [
      "Olivia Wilde",
      "Ava DuVernay",
      "Cary Joji Fukunaga"
    ]
  },
  {
    "q": "Who directed 'Blade Runner 2049' (2017)?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Ridley Scott",
      "Steven Spielberg",
      "Christopher Nolan"
    ]
  },
  {
    "q": "Which director did NOT make a film with Tom Cruise?",
    "a": "Martin Scorsese",
    "wrong": [
      "Stanley Kubrick",
      "Steven Spielberg",
      "Christopher Nolan"
    ]
  },
  {
    "q": "Who directed 'Mulholland Drive' (2001)?",
    "a": "David Lynch",
    "wrong": [
      "David Fincher",
      "Paul Thomas Anderson",
      "Joel Coen"
    ]
  },
  {
    "q": "'Moonlight' was directed by which filmmaker?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ava DuVernay",
      "Ryan Coogler",
      "Boots Riley"
    ]
  },
  {
    "q": "Which director made both 'Inception' and 'Interstellar'?",
    "a": "Christopher Nolan",
    "wrong": [
      "Denis Villeneuve",
      "Steven Spielberg",
      "Ridley Scott"
    ]
  },
  {
    "q": "Who directed 'The Grand Budapest Hotel' (2014)?",
    "a": "Wes Anderson",
    "wrong": [
      "Joel Coen",
      "Ethan Coen",
      "Spike Jonze"
    ]
  },
  {
    "q": "Which of these films was NOT directed by the Coen Brothers?",
    "a": "No Country for Old Men",
    "wrong": [
      "Miller's Crossing",
      "Barton Fink",
      "Fargo"
    ]
  },
  {
    "q": "'Arrival' (2016) was directed by which filmmaker?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Ari Aster",
      "Jeremy Saulnier",
      "Karyn Kusama"
    ]
  },
  {
    "q": "Who directed 'Hereditary' (2018)?",
    "a": "Ari Aster",
    "wrong": [
      "Karyn Kusama",
      "Oz Perkins",
      "Lex Wexler"
    ]
  },
  {
    "q": "Which director made both 'Kill Bill' films and 'Django Unchained'?",
    "a": "Quentin Tarantino",
    "wrong": [
      "Paul Thomas Anderson",
      "Joel Coen",
      "Martin Scorsese"
    ]
  },
  {
    "q": "'A Clockwork Orange' was directed by which legendary filmmaker?",
    "a": "Stanley Kubrick",
    "wrong": [
      "Stanley Donen",
      "Roman Polanski",
      "Alan Parker"
    ]
  },
  {
    "q": "Who directed 'Marriage Story' (2019)?",
    "a": "Noah Baumbach",
    "wrong": [
      "Greta Gerwig",
      "Kelly Reichardt",
      "Lynne Ramsay"
    ]
  },
  {
    "q": "'Baraka' (1992) and 'Samsara' (2011) were both directed by whom?",
    "a": "Ron Fricke",
    "wrong": [
      "Godfrey Reggio",
      "Werner Herzog",
      "Lucile Hadžihalilović"
    ]
  },
  {
    "q": "Which director made both 'There Will Be Blood' and 'Phantom Thread'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "David Fincher",
      "the Coen Brothers",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "'Mulholland Drive' was whose directorial effort in English-language cinema?",
    "a": "David Lynch",
    "wrong": [
      "Darren Aronofsky",
      "Charlie Kaufman",
      "Spike Jonze"
    ]
  },
  {
    "q": "Who directed 'Memories of Murder', the South Korean thriller from 2003?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Lee Chang-dong",
      "Kim Ki-duk"
    ]
  },
  {
    "q": "Denis Villeneuve did NOT direct which of these films?",
    "a": "Enemy at the Gates",
    "wrong": [
      "Sicario",
      "Arrival",
      "Prisoners"
    ]
  },
  {
    "q": "Which director made both 'La La Land' and 'Whiplash'?",
    "a": "Damien Chazelle",
    "wrong": [
      "Barry Jenkins",
      "Greta Gerwig",
      "Lynne Ramsay"
    ]
  },
  {
    "q": "Who directed 'The Killing of a Chinese Bookie', a 1976 John Cassavetes noir?",
    "a": "John Cassavetes",
    "wrong": [
      "Martin Scorsese",
      "Sidney Lumet",
      "William Friedkin"
    ]
  },
  {
    "q": "'A Ghost Story' (2017) was whose directorial debut feature?",
    "a": "David Lowery",
    "wrong": [
      "Alex Garland",
      "Karyn Kusama",
      "Ari Aster"
    ]
  },
  {
    "q": "Who directed 'Stalker' (1979), the philosophical science fiction masterpiece?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Eisenstein",
      "Mikhail Kalatozov",
      "Vladimir Khotinenko"
    ]
  },
  {
    "q": "Which director made both 'Boogie Nights' and 'Magnolia'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Martin Scorsese",
      "the Coen Brothers",
      "Quentin Tarantino"
    ]
  },
  {
    "q": "Greta Gerwig did NOT direct which of these films?",
    "a": "Eighth Grade",
    "wrong": [
      "Lady Bird",
      "Little Women",
      "Barbie"
    ]
  },
  {
    "q": "Who directed 'The Master' (2012)?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Spike Lee",
      "Martin Scorsese",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "'Come and See' was directed by which Belarusian filmmaker?",
    "a": "Elem Klimov",
    "wrong": [
      "Aleksandr Sokurov",
      "Larisa Shepitko",
      "Vladimir Bortko"
    ]
  },
  {
    "q": "Which director made both 'In the Mood for Love' and '2046'?",
    "a": "Wong Kar-wai",
    "wrong": [
      "Tsai Ming-liang",
      "Hou Hsiao-hsien",
      "Ang Lee"
    ]
  },
  {
    "q": "Barry Jenkins did NOT direct which of these films?",
    "a": "Moonlight (2016)",
    "wrong": [
      "If Beale Street Could Talk",
      "Medicine for Melancholy",
      "Mati Means Eye"
    ]
  },
  {
    "q": "Who directed 'Yi Yi' (A One and a Two...), the 2000 Taiwanese epic?",
    "a": "Edward Yang",
    "wrong": [
      "Hou Hsiao-hsien",
      "Chiang Kaige",
      "Ann Hui"
    ]
  },
  {
    "q": "Which director made both 'Synecdoche, New York' and 'Eternal Sunshine of the Spotless Mind'?",
    "a": "Charlie Kaufman",
    "wrong": [
      "Spike Jonze",
      "Michel Gondry",
      "David Fincher"
    ]
  },
  {
    "q": "'Under the Skin' (2013) was directed by which British filmmaker?",
    "a": "Jonathan Glazer",
    "wrong": [
      "Ben Wheatley",
      "Andrea Arnold",
      "Lynne Ramsay"
    ]
  },
  {
    "q": "Ari Aster did NOT direct which of these horror films?",
    "a": "The Wailing",
    "wrong": [
      "Hereditary",
      "Midsommar",
      "Beau Is Afraid"
    ]
  },
  {
    "q": "Who directed 'Love Exposure' (2008), the maximalist Japanese melodrama?",
    "a": "Sion Sono",
    "wrong": [
      "Hirokazu Koreeda",
      "Takeshi Kitano",
      "Isao Yukisada"
    ]
  },
  {
    "q": "'Moonlight' was whose directorial debut?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ari Aster",
      "Boots Riley",
      "Ryan Coogler"
    ]
  },
  {
    "q": "Who directed 'The Seventh Seal'?",
    "a": "Ingmar Bergman",
    "wrong": [
      "Akira Kurosawa",
      "Andrei Tarkovsky",
      "Federico Fellini"
    ]
  },
  {
    "q": "Who directed 'The Master'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Martin Scorsese",
      "David Fincher",
      "Joel Coen"
    ]
  },
  {
    "q": "'Lady Bird' was whose directorial debut?",
    "a": "Greta Gerwig",
    "wrong": [
      "Lynne Ramsay",
      "Kelly Reichardt",
      "Ava DuVernay"
    ]
  },
  {
    "q": "Christopher Nolan did NOT direct which of these films?",
    "a": "Annihilation",
    "wrong": [
      "The Prestige",
      "Tenet",
      "Oppenheimer"
    ]
  },
  {
    "q": "Who directed 'Stalker'?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Eisenstein",
      "Mikail Kalatozov",
      "Grigori Kozintsev"
    ]
  },
  {
    "q": "'The Social Network' was whose directorial choice after 'The Curious Case of Benjamin Button'?",
    "a": "David Fincher",
    "wrong": [
      "Steven Spielberg",
      "Christopher Nolan",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "Who directed 'Ran'?",
    "a": "Akira Kurosawa",
    "wrong": [
      "Masaki Kobayashi",
      "Kei Kumai",
      "Hiroshi Inagaki"
    ]
  },
  {
    "q": "Which director made both 'Mulholland Drive' and 'Inland Empire'?",
    "a": "David Lynch",
    "wrong": [
      "David Fincher",
      "Paul Thomas Anderson",
      "Christopher Nolan"
    ]
  },
  {
    "q": "'Whiplash' was whose directorial debut?",
    "a": "Damien Chazelle",
    "wrong": [
      "Ari Aster",
      "Alex Garland",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "Who directed 'Rashomon'?",
    "a": "Akira Kurosawa",
    "wrong": [
      "Masaki Kobayashi",
      "Kaneto Shindo",
      "Kenji Mizoguchi"
    ]
  },
  {
    "q": "Which director made both 'Rushmore' and 'The Grand Budapest Hotel'?",
    "a": "Wes Anderson",
    "wrong": [
      "Sofia Coppola",
      "Nicolas Winding Refn",
      "Michel Gondry"
    ]
  },
  {
    "q": "Who directed 'Parasite'?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Lee Chang-dong",
      "Park Chan-wook",
      "Kim Jee-woon"
    ]
  },
  {
    "q": "'Hereditary' was whose directorial debut?",
    "a": "Ari Aster",
    "wrong": [
      "Karyn Kusama",
      "Alex Aja",
      "Oz Perkins"
    ]
  },
  {
    "q": "Martin Scorsese did NOT direct which of these films?",
    "a": "Casino Royale",
    "wrong": [
      "Cape Fear",
      "The Irishman",
      "Killers of the Flower Moon"
    ]
  },
  {
    "q": "Which director made both 'The Truman Show' and 'Eternal Sunshine of the Spotless Mind'?",
    "a": "Michel Gondry",
    "wrong": [
      "Charlie Kaufman",
      "Spike Jonze",
      "Sofia Coppola"
    ]
  },
  {
    "q": "Which director made both 'Crouching Tiger, Hidden Dragon' and 'Brokeback Mountain'?",
    "a": "Ang Lee",
    "wrong": [
      "John Woo",
      "Park Chan-wook",
      "Wong Kar-wai"
    ]
  },
  {
    "q": "'Under the Skin' was whose directorial debut?",
    "a": "Jonathan Glazer",
    "wrong": [
      "Ben Wheatley",
      "Andrew Haigh",
      "Brady Corbet"
    ]
  },
  {
    "q": "Which director made both 'Jackie' and 'Spencer'?",
    "a": "Pablo Larraín",
    "wrong": [
      "Karyn Kusama",
      "Cary Joji Fukunaga",
      "Mimi Leder"
    ]
  },
  {
    "q": "Who directed 'Citizen Kane'?",
    "a": "Orson Welles",
    "wrong": [
      "John Ford",
      "Howard Hawks",
      "William Wyler"
    ]
  },
  {
    "q": "Who directed 'The Grand Budapest Hotel'?",
    "a": "Wes Anderson",
    "wrong": [
      "Joel Coen",
      "Yorgos Lanthimos",
      "Greta Gerwig"
    ]
  },
  {
    "q": "'Mulholland Drive' was directed by whom?",
    "a": "David Lynch",
    "wrong": [
      "David Fincher",
      "Paul Thomas Anderson",
      "the Coen Brothers"
    ]
  },
  {
    "q": "Which director made both 'L.A. Confidential' and 'The Square'?",
    "a": "Ruben Östlund",
    "wrong": [
      "Curtis Hanson",
      "Brian Helgeland",
      "Steve Soderbergh"
    ]
  },
  {
    "q": "Who directed 'Come and See'?",
    "a": "Elem Klimov",
    "wrong": [
      "Andrei Konchalovsky",
      "Sergei Bondarchuk",
      "Mikhail Kalatozov"
    ]
  },
  {
    "q": "'Stalker' was directed by whom?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Eisenstein",
      "Vsevolod Pudovkin",
      "Dziga Vertov"
    ]
  },
  {
    "q": "Which director made both 'Chungking Express' and 'The Handmaiden'?",
    "a": "Wong Kar-wai",
    "wrong": [
      "Park Chan-wook",
      "Hou Hsiao-hsien",
      "Tsai Ming-liang"
    ]
  },
  {
    "q": "Who directed 'Memories of Murder'?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Song Hae-sung",
      "Hwang In-ho"
    ]
  },
  {
    "q": "'Grave of the Fireflies' was directed by whom?",
    "a": "Isao Takahata",
    "wrong": [
      "Hayao Miyazaki",
      "Mamoru Oshii",
      "Satoshi Kon"
    ]
  },
  {
    "q": "Which director made both 'Badlands' and 'The Tree of Life'?",
    "a": "Terrence Malick",
    "wrong": [
      "Stanley Kubrick",
      "David Fincher",
      "Martin Scorsese"
    ]
  },
  {
    "q": "'American Psycho' was directed by whom?",
    "a": "Mary Harron",
    "wrong": [
      "David Fincher",
      "Brett Easton Ellis",
      "Oliver Stone"
    ]
  },
  {
    "q": "'Mulholland Drive' was whose directorial work?",
    "a": "David Lynch",
    "wrong": [
      "David Fincher",
      "Park Chan-wook",
      "Darren Aronofsky"
    ]
  },
  {
    "q": "Which of these did NOT direct a James Bond film: Daniel Craig, Roger Moore, Pierce Brosnan, or Timothy Dalton?",
    "a": "Daniel Craig (as actor, not director)",
    "wrong": [
      "Roger Moore",
      "Pierce Brosnan",
      "Timothy Dalton"
    ]
  },
  {
    "q": "'Barbie' (2023) was whose directorial debut in live-action?",
    "a": "Greta Gerwig",
    "wrong": [
      "Cary Joji Fukunaga",
      "Ari Aster",
      "Emerald Fennell"
    ]
  },
  {
    "q": "Who directed 'In the Mood for Love'?",
    "a": "Wong Kar-wai",
    "wrong": [
      "John Woo",
      "Tsui Hark",
      "Yimou Zhang"
    ]
  },
  {
    "q": "Which director made both 'Trainspotting' and 'T2 Trainspotting'?",
    "a": "Danny Boyle",
    "wrong": [
      "Ken Loach",
      "Mike Leigh",
      "Stephen Frears"
    ]
  },
  {
    "q": "'The Lighthouse' was co-directed by Robert Eggers and whom?",
    "a": "Max Eggers",
    "wrong": [
      "Ari Aster",
      "Mike Flanagan",
      "Jeremy Saulnier"
    ]
  },
  {
    "q": "Who directed 'Chungking Express'?",
    "a": "Wong Kar-wai",
    "wrong": [
      "Kar-Wai Wong",
      "John Woo",
      "Tsui Hark"
    ]
  },
  {
    "q": "Which of these did Stanley Kubrick NOT direct?",
    "a": "'The Shining' sequel 'Doctor Sleep'",
    "wrong": [
      "'Eyes Wide Shut'",
      "'A Clockwork Orange'",
      "'Barry Lyndon'"
    ]
  },
  {
    "q": "'Arrival' was whose directorial work?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Christopher Nolan",
      "Alex Garland",
      "David Fincher"
    ]
  },
  {
    "q": "Who directed 'The Double Life of Véronique'?",
    "a": "Krzysztof Kieślowski",
    "wrong": [
      "Andrzej Żuławski",
      "Jerzy Skolimowski",
      "Roman Polanski"
    ]
  },
  {
    "q": "Which director made both 'Sicario' and 'Enemy'?",
    "a": "Denis Villeneuve",
    "wrong": [
      "David Fincher",
      "Pablo Larraín",
      "Karyn Kusama"
    ]
  },
  {
    "q": "'The Killing' (1956) was whose directorial work?",
    "a": "Stanley Kubrick",
    "wrong": [
      "Otto Preminger",
      "Jules Dassin",
      "Robert Aldrich"
    ]
  },
  {
    "q": "Who directed 'Manchester by the Sea'?",
    "a": "Kenneth Lonergan",
    "wrong": [
      "Paul Thomas Anderson",
      "Jeff Nichols",
      "Ari Aster"
    ]
  },
  {
    "q": "Which of these did NOT direct a David Bowie music video or film project?",
    "a": "Martin Scorsese",
    "wrong": [
      "Nicolas Roeg",
      "David Lynch",
      "Julien Temple"
    ]
  },
  {
    "q": "'Stalker' was whose directorial masterpiece?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Eisenstein",
      "Mikhail Kalatozov",
      "Elem Klimov"
    ]
  },
  {
    "q": "Who directed 'The Royal Tenenbaums'?",
    "a": "Wes Anderson",
    "wrong": [
      "Sofia Coppola",
      "P.T. Anderson",
      "Greta Gerwig"
    ]
  },
  {
    "q": "Which director made both 'Naked Lunch' and 'Cosmopolis'?",
    "a": "David Cronenberg",
    "wrong": [
      "Paul Verhoeven",
      "Jeremy Saulnier",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "Which director made both 'There Will Be Blood' and 'Licorice Pizza'?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "the Coen Brothers",
      "David Fincher",
      "Wes Anderson"
    ]
  },
  {
    "q": "'Mulholland Drive' was whose directorial return after a 10-year absence?",
    "a": "David Lynch",
    "wrong": [
      "Stanley Kubrick",
      "Terry Gilliam",
      "Darren Aronofsky"
    ]
  },
  {
    "q": "Who directed 'The Handmaiden'?",
    "a": "Park Chan-wook",
    "wrong": [
      "Bong Joon-ho",
      "Lee Chang-dong",
      "Na Hong-jin"
    ]
  },
  {
    "q": "Which of these films did NOT direct by the Coen Brothers?",
    "a": "No Country for Old Men",
    "wrong": [
      "Fargo",
      "The Big Lebowski",
      "Barton Fink"
    ]
  },
  {
    "q": "'Moonlight' was whose directorial debut feature?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ava DuVernay",
      "Ryan Coogler",
      "Boots Riley"
    ]
  },
  {
    "q": "Which director made both 'M*A*S*H' and 'The Long Goodbye'?",
    "a": "Robert Altman",
    "wrong": [
      "Sidney Lumet",
      "Francis Ford Coppola",
      "Martin Scorsese"
    ]
  },
  {
    "q": "Who directed 'A Clockwork Orange'?",
    "a": "Stanley Kubrick",
    "wrong": [
      "David Cronenberg",
      "Pier Paolo Pasolini",
      "Ken Russell"
    ]
  },
  {
    "q": "Who directed 'The Lighthouse'?",
    "a": "Robert Eggers",
    "wrong": [
      "A.A. Lowrey",
      "Jeremy Saulnier",
      "Karyn Kusama"
    ]
  },
  {
    "q": "Which of these films did Steven Spielberg NOT direct?",
    "a": "War Horse",
    "wrong": [
      "Munich",
      "Lincoln",
      "Bridge of Spies"
    ]
  },
  {
    "q": "'Stalker' and 'Mirror' were directed by whom?",
    "a": "Andrei Tarkovsky",
    "wrong": [
      "Sergei Parajanov",
      "Nikita Mikhalkov",
      "Elem Klimov"
    ]
  },
  {
    "q": "Who directed 'The Farewell'?",
    "a": "Lulu Wang",
    "wrong": [
      "Greta Gerwig",
      "Chloe Zhao",
      "Destin Daniel Cretton"
    ]
  },
  {
    "q": "Which director made both 'Drive' and 'Only God Forgives'?",
    "a": "Nicolas Winding Refn",
    "wrong": [
      "David Fincher",
      "Denis Villeneuve",
      "Jeff Nichols"
    ]
  },
  {
    "q": "'Raging Bull' was directed by whom?",
    "a": "Martin Scorsese",
    "wrong": [
      "Francis Ford Coppola",
      "Sidney Lumet",
      "William Friedkin"
    ]
  },
  {
    "q": "Who directed 'Under the Skin'?",
    "a": "Jonathan Glazer",
    "wrong": [
      "Ari Aster",
      "Robert Eggers",
      "Karyn Kusama"
    ]
  },
  {
    "q": "Which of these films was NOT directed by Quentin Tarantino?",
    "a": "Four Rooms",
    "wrong": [
      "Inglourious Basterds",
      "Django Unchained",
      "Hateful Eight"
    ]
  },
  {
    "q": "'The Master' and 'Inherent Vice' were both directed by whom?",
    "a": "Paul Thomas Anderson",
    "wrong": [
      "Brian De Palma",
      "Darren Aronofsky",
      "Alex Garland"
    ]
  },
  {
    "q": "Which of these films was NOT directed by Ridley Scott?",
    "a": "Blade Runner 2049",
    "wrong": [
      "Alien",
      "Gladiator",
      "The Martian"
    ]
  },
  {
    "q": "Denis Villeneuve directed both 'Arrival' and which other film?",
    "a": "Dune",
    "wrong": [
      "Oppenheimer",
      "Interstellar",
      "The Prestige"
    ]
  },
  {
    "q": "'Moonlight' was whose directorial feature debut?",
    "a": "Barry Jenkins",
    "wrong": [
      "Ava DuVernay",
      "Ryan Coogler",
      "Boots Riley"
    ]
  },
  {
    "q": "Who directed 'A Clockwork Orange' (1971)?",
    "a": "Stanley Kubrick",
    "wrong": [
      "Martin Scorsese",
      "Francis Ford Coppola",
      "Sidney Lumet"
    ]
  },
  {
    "q": "Which director made both 'Kill Bill Vol. 1' and 'Inglourious Basterds'?",
    "a": "Quentin Tarantino",
    "wrong": [
      "Robert Rodriguez",
      "Guy Ritchie",
      "the Coen Brothers"
    ]
  },
  {
    "q": "Who directed 'Come and See' (1985)?",
    "a": "Elem Klimov",
    "wrong": [
      "Andrei Tarkovsky",
      "Sergei Eisenstein",
      "Grigori Aleksandrov"
    ]
  },
  {
    "q": "'The French Dispatch' was directed by whom?",
    "a": "Wes Anderson",
    "wrong": [
      "Noah Baumbach",
      "Kelly Reichardt",
      "Paul Thomas Anderson"
    ]
  },
  {
    "q": "Who directed 'The Thin Red Line' (1998)?",
    "a": "Terrence Malick",
    "wrong": [
      "Steven Spielberg",
      "Oliver Stone",
      "Sam Peckinpah"
    ]
  },
  {
    "q": "Who directed 'Sicario' (2015)?",
    "a": "Denis Villeneuve",
    "wrong": [
      "Kathryn Bigelow",
      "Justin Lin",
      "Joe Carnahan"
    ]
  },
  {
    "q": "'Parasite' (2019) was directed by whom?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Park Chan-wook",
      "Lee Chang-dong",
      "Na Hong-jin"
    ]
  },
  {
    "q": "Which director made both 'Se7en' and 'The Social Network'?",
    "a": "David Fincher",
    "wrong": [
      "Lynne Ramsay",
      "Nicolas Winding Refn",
      "Ari Aster"
    ]
  },
  {
    "q": "Who directed 'Ran' (1985)?",
    "a": "Akira Kurosawa",
    "wrong": [
      "Masaki Kobayashi",
      "Keisuke Kinoshita",
      "Yasujirō Ozu"
    ]
  },
  {
    "q": "'The Farewell' (2019) was whose directorial debut?",
    "a": "Lulu Wang",
    "wrong": [
      "Greta Gerwig",
      "Cary Fukunaga",
      "Karyn Kusama"
    ]
  },
  {
    "q": "Which of these films was NOT directed by Steven Spielberg?",
    "a": "Oppenheimer",
    "wrong": [
      "Bridge of Spies",
      "West Side Story (2021)",
      "The Post"
    ]
  },
  {
    "q": "Who directed 'Under the Skin' (2013)?",
    "a": "Jonathan Glazer",
    "wrong": [
      "Nicolas Winding Refn",
      "Ari Aster",
      "Alex Garland"
    ]
  },
  {
    "q": "Which director made both '2001: A Space Odyssey' and 'Barry Lyndon'?",
    "a": "Stanley Kubrick",
    "wrong": [
      "George Cukor",
      "Sidney Lumet",
      "John Huston"
    ]
  },
  {
    "q": "'The Irishman' (2019) was directed by whom?",
    "a": "Martin Scorsese",
    "wrong": [
      "Paul Thomas Anderson",
      "Quentin Tarantino",
      "David Fincher"
    ]
  },
  {
    "q": "Who directed 'Chungking Express' (1994)?",
    "a": "Wong Kar-wai",
    "wrong": [
      "John Woo",
      "Tsui Hark",
      "Ringo Lam"
    ]
  }
];

const AI_OSCARS = [
  {
    "q": "Which film won the Academy Award for Best Picture at the 1975 ceremony (for 1974 films)?",
    "a": "One Flew Over the Cuckoo's Nest",
    "wrong": [
      "Jaws",
      "Barry Lyndon",
      "Dog Day Afternoon"
    ]
  },
  {
    "q": "Meryl Streep won Best Actress for which film at the 1983 ceremony?",
    "a": "Sophie's Choice",
    "wrong": [
      "Kramer vs. Kramer",
      "The Iron Lady",
      "Doubt"
    ]
  },
  {
    "q": "Steven Spielberg won Best Director for which film at the 1994 ceremony?",
    "a": "Schindler's List",
    "wrong": [
      "Saving Private Ryan",
      "Jurassic Park",
      "E.T. the Extra-Terrestrial"
    ]
  },
  {
    "q": "Jack Nicholson won Best Actor for which film at the 1976 ceremony?",
    "a": "One Flew Over the Cuckoo's Nest",
    "wrong": [
      "Chinatown",
      "Terms of Endearment",
      "As Good as It Gets"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2010 ceremony (for 2009 films)?",
    "a": "Slumdog Millionaire",
    "wrong": [
      "The Curious Case of Benjamin Button",
      "Milk",
      "Frost/Nixon"
    ]
  },
  {
    "q": "Katharine Hepburn won Best Actress for which film at the 1982 ceremony?",
    "a": "On Golden Pond",
    "wrong": [
      "The African Queen",
      "Guess Who's Coming to Dinner",
      "Morning Glory"
    ]
  },
  {
    "q": "Francis Ford Coppola won Best Director for which film at the 1975 ceremony?",
    "a": "The Godfather Part II",
    "wrong": [
      "The Godfather",
      "Apocalypse Now",
      "Bram Stoker's Dracula"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 1980 ceremony?",
    "a": "Back to the Future",
    "wrong": [
      "Amadeus",
      "The Killing Fields",
      "A Passage to India"
    ]
  },
  {
    "q": "Denzel Washington won Best Actor for which film at the 2002 ceremony?",
    "a": "Training Day",
    "wrong": [
      "Malcolm X",
      "Philadelphia",
      "Cry Freedom"
    ]
  },
  {
    "q": "Jessica Lange won Best Supporting Actress for which film at the 1983 ceremony?",
    "a": "Tootsie",
    "wrong": [
      "The Big Chill",
      "Terms of Endearment",
      "The Right Stuff"
    ]
  },
  {
    "q": "Martin Scorsese won Best Director for which film at the 2007 ceremony?",
    "a": "The Departed",
    "wrong": [
      "Taxi Driver",
      "Raging Bull",
      "Goodfellas"
    ]
  },
  {
    "q": "Which film won Best Picture at the 1995 ceremony (for 1994 films)?",
    "a": "Forrest Gump",
    "wrong": [
      "Pulp Fiction",
      "The Shawshank Redemption",
      "Four Rooms"
    ]
  },
  {
    "q": "Kate Winslet won Best Actress for which film at the 2009 ceremony?",
    "a": "The Reader",
    "wrong": [
      "Revolutionary Road",
      "Titanic",
      "Eternal Sunshine of the Spotless Mind"
    ]
  },
  {
    "q": "Joel Coen and Ethan Coen won Best Director for which film at the 2008 ceremony?",
    "a": "No Country for Old Men",
    "wrong": [
      "Fargo",
      "The Big Lebowski",
      "Barton Fink"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2020 ceremony (for 2019 films)?",
    "a": "Parasite",
    "wrong": [
      "1917",
      "Once Upon a Time in Hollywood",
      "Joker"
    ]
  },
  {
    "q": "Anthony Hopkins won Best Actor for which film at the 1992 ceremony?",
    "a": "The Silence of the Lambs",
    "wrong": [
      "Shadowlands",
      "The Father",
      "Amistad"
    ]
  },
  {
    "q": "Cate Blanchett won Best Supporting Actress for which film at the 2014 ceremony?",
    "a": "Blue Jasmine",
    "wrong": [
      "Carol",
      "The Aviator",
      "Elizabeth"
    ]
  },
  {
    "q": "Which film won the most Oscars at the 1998 ceremony with 11 awards?",
    "a": "Titanic",
    "wrong": [
      "The English Patient",
      "L.A. Confidential",
      "Good Will Hunting"
    ]
  },
  {
    "q": "Bong Joon-ho won Best Director for which film at the 2020 ceremony?",
    "a": "Parasite",
    "wrong": [
      "Okja",
      "Snowpiercer",
      "The Host"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 1995 ceremony?",
    "a": "Toy Story",
    "wrong": [
      "Braveheart",
      "Apollo 13",
      "Sense and Sensibility"
    ]
  },
  {
    "q": "Which film won Best Picture at the 1994 Academy Awards (for 1993 films)?",
    "a": "Schindler's List",
    "wrong": [
      "The Fugitive",
      "In the Name of the Father",
      "The Remains of the Day"
    ]
  },
  {
    "q": "Meryl Streep won Best Actress for which film?",
    "a": "The Iron Lady",
    "wrong": [
      "Kramer vs. Kramer",
      "Sophie's Choice",
      "Doubt"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2020 Academy Awards (for 2019 films)?",
    "a": "Once Upon a Time in Hollywood",
    "wrong": [
      "1917",
      "Parasite",
      "Joker"
    ]
  },
  {
    "q": "Who won Best Director for 'Braveheart' at the 1996 Academy Awards?",
    "a": "Mel Gibson",
    "wrong": [
      "Steven Spielberg",
      "Ron Howard",
      "Martin Scorsese"
    ]
  },
  {
    "q": "Jack Nicholson won Best Actor for which film?",
    "a": "One Flew Over the Cuckoo's Nest",
    "wrong": [
      "Terms of Endearment",
      "As Good as It Gets",
      "About Schmidt"
    ]
  },
  {
    "q": "How many Oscars did 'Titanic' win at the 1998 Academy Awards?",
    "a": "11",
    "wrong": [
      "10",
      "12",
      "13"
    ]
  },
  {
    "q": "Jessica Lange won Best Supporting Actress for which film?",
    "a": "Tootsie",
    "wrong": [
      "Blue Sky",
      "O Pioneers!",
      "Music Box"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2012 Academy Awards (for 2011 films)?",
    "a": "The Artist",
    "wrong": [
      "The Descendants",
      "Midnight in Paris",
      "War Horse"
    ]
  },
  {
    "q": "Who won Best Director for 'Dances with Wolves'?",
    "a": "Kevin Costner",
    "wrong": [
      "Barry Levinson",
      "Martin Scorsese",
      "Spike Lee"
    ]
  },
  {
    "q": "Gary Oldman won Best Actor for which film?",
    "a": "Darkest Hour",
    "wrong": [
      "Tinker Tailor Soldier Spy",
      "Child 44",
      "The Killing of a Sacred Deer"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2015 Academy Awards (for 2014 films)?",
    "a": "Guardians of the Galaxy",
    "wrong": [
      "The Grand Budapest Hotel",
      "Whiplash",
      "American Sniper"
    ]
  },
  {
    "q": "Cate Blanchett won Best Supporting Actress for which film?",
    "a": "Blue Jasmine",
    "wrong": [
      "Elizabeth",
      "The Aviator",
      "Notes on a Scandal"
    ]
  },
  {
    "q": "How many Oscars did 'The Lord of the Rings: The Return of the King' win?",
    "a": "11",
    "wrong": [
      "10",
      "9",
      "12"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2008 Academy Awards (for 2007 films)?",
    "a": "No Country for Old Men",
    "wrong": [
      "There Will Be Blood",
      "Juno",
      "Michael Clayton"
    ]
  },
  {
    "q": "Who won Best Director for 'Parasite'?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Lee Chang-dong",
      "Hirokazu Koreeda",
      "Yorgos Lanthimos"
    ]
  },
  {
    "q": "Frances McDormand won Best Actress for which film?",
    "a": "Nomadland",
    "wrong": [
      "Fargo",
      "Three Billboards Outside Ebbing, Missouri",
      "Olive Kitteridge"
    ]
  },
  {
    "q": "Sean Penn won Best Actor for which film?",
    "a": "Mystic River",
    "wrong": [
      "Milk",
      "Dead Man Walking",
      "Carlito's Way"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2018 Academy Awards (for 2017 films)?",
    "a": "Wonder Woman",
    "wrong": [
      "The Shape of Water",
      "Call Me By Your Name",
      "Get Out"
    ]
  },
  {
    "q": "How many Oscars did 'Slumdog Millionaire' win at the 2009 Academy Awards?",
    "a": "8",
    "wrong": [
      "7",
      "9",
      "10"
    ]
  },
  {
    "q": "Who won Best Director for 'La La Land'?",
    "a": "Damien Chazelle",
    "wrong": [
      "Denis Villeneuve",
      "Arrival director",
      "Barry Jenkins"
    ]
  },
  {
    "q": "Who won Best Director for 'Brokeback Mountain' (2006 ceremony)?",
    "a": "Ang Lee",
    "wrong": [
      "Mike Leigh",
      "Bennett Miller",
      "Martin Scorsese"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2020 Academy Awards?",
    "a": "Avengers: Endgame",
    "wrong": [
      "1917",
      "Once Upon a Time in Hollywood",
      "Parasite"
    ]
  },
  {
    "q": "Daniel Day-Lewis won Best Actor for which film?",
    "a": "My Left Foot",
    "wrong": [
      "There Will Be Blood",
      "Gangs of New York",
      "Lincoln"
    ]
  },
  {
    "q": "'The Lord of the Rings: The Return of the King' won how many Academy Awards?",
    "a": "11",
    "wrong": [
      "9",
      "13",
      "10"
    ]
  },
  {
    "q": "Who won Best Director for 'The Shape of Water' (2018 ceremony)?",
    "a": "Guillermo del Toro",
    "wrong": [
      "Luca Guadagnino",
      "Christopher Nolan",
      "Paul Thomas Anderson"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2000 Academy Awards (for 1999 films)?",
    "a": "American Beauty",
    "wrong": [
      "Saving Private Ryan",
      "The Sixth Sense",
      "The Green Mile"
    ]
  },
  {
    "q": "Mahershala Ali won Best Supporting Actor for which film?",
    "a": "Moonlight",
    "wrong": [
      "Hidden Figures",
      "Arrival",
      "Fences"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2015 Academy Awards?",
    "a": "The Hobbit: The Battle of the Five Armies",
    "wrong": [
      "Birdman",
      "Boyhood",
      "American Sniper"
    ]
  },
  {
    "q": "Jodie Foster won Best Actress for which film?",
    "a": "The Silence of the Lambs",
    "wrong": [
      "Contact",
      "The Accused",
      "Inside Man"
    ]
  },
  {
    "q": "Who won Best Director for 'Parasite' (2020 ceremony)?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Lee Chang-dong",
      "Hirokazu Koreeda",
      "Kim Ki-young"
    ]
  },
  {
    "q": "'Titanic' won how many Academy Awards?",
    "a": "11",
    "wrong": [
      "10",
      "12",
      "13"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2010 Academy Awards (for 2009 films)?",
    "a": "Slumdog Millionaire",
    "wrong": [
      "Milk",
      "The Curious Case of Benjamin Button",
      "Frost/Nixon"
    ]
  },
  {
    "q": "Christoph Waltz won Best Supporting Actor for which film?",
    "a": "Inglourious Basterds",
    "wrong": [
      "Django Unchained",
      "Water for Elephants",
      "Carnage"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2012 Academy Awards?",
    "a": "The Dark Knight Rises",
    "wrong": [
      "The Artist",
      "Midnight in Paris",
      "War Horse"
    ]
  },
  {
    "q": "Who won Best Director for 'Oppenheimer' (2024 ceremony)?",
    "a": "Christopher Nolan",
    "wrong": [
      "Justine Triet",
      "Yorgos Lanthimos",
      "Masaki Kobayashi"
    ]
  },
  {
    "q": "Rami Malek won Best Actor for which film?",
    "a": "Bohemian Rhapsody",
    "wrong": [
      "The Greatest Showman",
      "Papillon",
      "Mr. Robot"
    ]
  },
  {
    "q": "Which film won Best Picture at the 1994 Academy Awards?",
    "a": "Schindler's List",
    "wrong": [
      "Saving Private Ryan",
      "The Shawshank Redemption",
      "Pulp Fiction"
    ]
  },
  {
    "q": "Who directed 'Braveheart,' which won Best Picture in 1996?",
    "a": "Mel Gibson",
    "wrong": [
      "Kevin Costner",
      "Clint Eastwood",
      "Steven Spielberg"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2020 Academy Awards?",
    "a": "Parasite",
    "wrong": [
      "1917",
      "Once Upon a Time in Hollywood",
      "Joker"
    ]
  },
  {
    "q": "Lupita Nyong'o won Best Supporting Actress for which film?",
    "a": "12 Years a Slave",
    "wrong": [
      "Black Panther",
      "Us",
      "Nope"
    ]
  },
  {
    "q": "Who won Best Director for 'The Godfather Part II'?",
    "a": "Francis Ford Coppola",
    "wrong": [
      "Martin Scorsese",
      "William Friedkin",
      "John Avildsen"
    ]
  },
  {
    "q": "Denzel Washington won Best Actor for which film?",
    "a": "Training Day",
    "wrong": [
      "Malcolm X",
      "Glory",
      "Philadelphia"
    ]
  },
  {
    "q": "Who directed 'Slumdog Millionaire,' which won Best Picture in 2009?",
    "a": "Danny Boyle",
    "wrong": [
      "Guillermo del Toro",
      "Christopher Nolan",
      "Quentin Tarantino"
    ]
  },
  {
    "q": "Jeff Bridges won Best Actor for which film?",
    "a": "Crazy Heart",
    "wrong": [
      "The Big Lebowski",
      "True Grit",
      "Starman"
    ]
  },
  {
    "q": "How many Oscars did 'The Shape of Water' win at the 2018 Academy Awards?",
    "a": "4",
    "wrong": [
      "3",
      "5",
      "6"
    ]
  },
  {
    "q": "Marlee Matlin won Best Supporting Actress for which film?",
    "a": "Children of a Lesser God",
    "wrong": [
      "CODA",
      "The Miracle Worker",
      "West Side Story"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2012 Academy Awards?",
    "a": "The Artist",
    "wrong": [
      "Hugo",
      "Midnight in Paris",
      "Moneyball"
    ]
  },
  {
    "q": "Who directed 'Oppenheimer,' which won Best Picture in 2024?",
    "a": "Christopher Nolan",
    "wrong": [
      "Denis Villeneuve",
      "Justine Triet",
      "Yorgos Lanthimos"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2022 Academy Awards?",
    "a": "Spider-Man: No Way Home",
    "wrong": [
      "Belfast",
      "CODA",
      "The Power of the Dog"
    ]
  },
  {
    "q": "How many Oscars did 'Braveheart' win at the 1996 Academy Awards?",
    "a": "5",
    "wrong": [
      "4",
      "6",
      "7"
    ]
  },
  {
    "q": "Which film won the Academy Award for Best Picture at the 1994 Oscars ceremony?",
    "a": "Schindler's List",
    "wrong": [
      "Pulp Fiction",
      "Forrest Gump",
      "The Shawshank Redemption"
    ]
  },
  {
    "q": "Meryl Streep won Best Actress for which film at the 1979 Oscars?",
    "a": "Kramer vs. Kramer",
    "wrong": [
      "Sophie's Choice",
      "The Iron Lady",
      "Doubt"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2020 Oscars ceremony?",
    "a": "Joker",
    "wrong": [
      "1917",
      "Parasite",
      "Once Upon a Time in Hollywood"
    ]
  },
  {
    "q": "Steven Spielberg won Best Director for which film at the 1999 Oscars?",
    "a": "Saving Private Ryan",
    "wrong": [
      "Schindler's List",
      "War Horse",
      "Lincoln"
    ]
  },
  {
    "q": "Daniel Day-Lewis won Best Actor for which film at the 2013 Oscars?",
    "a": "Lincoln",
    "wrong": [
      "There Will Be Blood",
      "Phantom Thread",
      "My Beautiful Laundrette"
    ]
  },
  {
    "q": "How many Academy Awards did 'The Lord of the Rings: The Return of the King' win?",
    "a": "11",
    "wrong": [
      "9",
      "13",
      "10"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2012 Oscars ceremony?",
    "a": "The Artist",
    "wrong": [
      "Extremely Wicked, Shockingly Evil and Vile",
      "The Descendants",
      "War Horse"
    ]
  },
  {
    "q": "Cate Blanchett won Best Supporting Actress for which film at the 2014 Oscars?",
    "a": "Blue Jasmine",
    "wrong": [
      "Carol",
      "Ocean's 8",
      "Notes on a Scandal"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2015 Oscars ceremony?",
    "a": "Mad Max: Fury Road",
    "wrong": [
      "Spotlight",
      "Brooklyn",
      "The Big Short"
    ]
  },
  {
    "q": "Clint Eastwood won Best Director for which film at the 1995 Oscars?",
    "a": "Unforgiven",
    "wrong": [
      "The Gauntlet",
      "Gran Torino",
      "Bronco Billy"
    ]
  },
  {
    "q": "Lupita Nyong'o won Best Supporting Actress for which film at the 2014 Oscars?",
    "a": "12 Years a Slave",
    "wrong": [
      "Black Panther",
      "Us",
      "Star Wars: The Force Awakens"
    ]
  },
  {
    "q": "How many Academy Awards did 'Titanic' win at the 1998 Oscars?",
    "a": "11",
    "wrong": [
      "10",
      "12",
      "9"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2004 Oscars ceremony?",
    "a": "The Lord of the Rings: The Return of the King",
    "wrong": [
      "Lost in Translation",
      "Mystic River",
      "Seabiscuit"
    ]
  },
  {
    "q": "Gary Oldman won Best Actor for which film at the 2018 Oscars?",
    "a": "Darkest Hour",
    "wrong": [
      "The Post",
      "Call Me By Your Name",
      "Phantom Thread"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2011 Oscars ceremony?",
    "a": "Inception",
    "wrong": [
      "The King's Speech",
      "True Grit",
      "The Social Network"
    ]
  },
  {
    "q": "Denis Villeneuve won Best Director for which film at the 2022 Oscars?",
    "a": "Dune",
    "wrong": [
      "Dune: Part Two",
      "Blade Runner 2049",
      "Enemy"
    ]
  },
  {
    "q": "Frances McDormand won Best Actress for which film at the 2019 Oscars?",
    "a": "Three Billboards Outside Ebbing, Missouri",
    "wrong": [
      "Nomadland",
      "Fargo",
      "Olive Kitteridge"
    ]
  },
  {
    "q": "How many Academy Awards did 'West Side Story' (2021) win?",
    "a": "7",
    "wrong": [
      "5",
      "10",
      "6"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2018 Oscars ceremony?",
    "a": "The Shape of Water",
    "wrong": [
      "Dunkirk",
      "Call Me By Your Name",
      "Phantom Thread"
    ]
  },
  {
    "q": "Mahershala Ali won Best Supporting Actor for which film at the 2017 Oscars?",
    "a": "Moonlight",
    "wrong": [
      "Hidden Figures",
      "Fences",
      "Manchester by the Sea"
    ]
  },
  {
    "q": "Denis Villeneuve won Best Director for which film at the 2022 Academy Awards?",
    "a": "Dune",
    "wrong": [
      "Arrival",
      "Sicario",
      "Enemy"
    ]
  },
  {
    "q": "Joaquin Phoenix won Best Actor for which film?",
    "a": "Joker",
    "wrong": [
      "The Master",
      "Her",
      "Walk the Line"
    ]
  },
  {
    "q": "Bong Joon-ho won Best Director for which film at the 2020 Academy Awards?",
    "a": "Parasite",
    "wrong": [
      "Memories of Murder",
      "The Host",
      "Okja"
    ]
  },
  {
    "q": "Frances McDormand won Best Actress for which film at the 2019 Academy Awards?",
    "a": "Three Billboards Outside Ebbing, Missouri",
    "wrong": [
      "Fargo",
      "Nomadland",
      "Moonlight"
    ]
  },
  {
    "q": "Christopher Nolan won Best Director for which film at the 2024 Academy Awards?",
    "a": "Oppenheimer",
    "wrong": [
      "The Prestige",
      "Interstellar",
      "Inception"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2016 Academy Awards (for 2015 films)?",
    "a": "The Revenant",
    "wrong": [
      "Spotlight",
      "The Big Short",
      "Bridge of Spies"
    ]
  },
  {
    "q": "How many Oscars did 'The Lord of the Rings: The Return of the King' win at the 2004 Academy Awards?",
    "a": "11",
    "wrong": [
      "9",
      "10",
      "12"
    ]
  },
  {
    "q": "Kathryn Bigelow won Best Director for which film at the 2010 Academy Awards?",
    "a": "The Hurt Locker",
    "wrong": [
      "Zero Dark Thirty",
      "Point Break",
      "Strange Days"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2002 Academy Awards (for 2001 films)?",
    "a": "A Beautiful Mind",
    "wrong": [
      "Lord of the Rings: The Fellowship of the Ring",
      "Moulin Rouge!",
      "In the Bedroom"
    ]
  },
  {
    "q": "Rami Malek won Best Actor for which film at the 2019 Academy Awards?",
    "a": "Bohemian Rhapsody",
    "wrong": [
      "Mr. Robot",
      "The Pacific",
      "A Night at the Opera"
    ]
  },
  {
    "q": "How many Oscars did 'La La Land' win at the 2017 Academy Awards?",
    "a": "6",
    "wrong": [
      "7",
      "8",
      "5"
    ]
  },
  {
    "q": "Which film won the Academy Award for Best Picture at the 1994 ceremony (for 1993 films)?",
    "a": "Schindler's List",
    "wrong": [
      "The Fugitive",
      "The Piano",
      "Shadowlands"
    ]
  },
  {
    "q": "Who won the Academy Award for Best Director for 'Braveheart' at the 1996 ceremony?",
    "a": "Mel Gibson",
    "wrong": [
      "Steven Spielberg",
      "Ron Howard",
      "Oliver Stone"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2012 ceremony (for 2011 films)?",
    "a": "The Artist",
    "wrong": [
      "Midnight in Paris",
      "The Descendants",
      "War Horse"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2002 ceremony (for 2001 films)?",
    "a": "Harry Potter and the Philosopher's Stone",
    "wrong": [
      "A Beautiful Mind",
      "Moulin Rouge!",
      "The Lord of the Rings: The Fellowship of the Ring"
    ]
  },
  {
    "q": "Who won Best Director for 'The Shape of Water' at the 2018 ceremony?",
    "a": "Guillermo del Toro",
    "wrong": [
      "Christopher Nolan",
      "Denis Villeneuve",
      "Luca Guadagnino"
    ]
  },
  {
    "q": "Dustin Hoffman won Best Actor for which film at the 1989 ceremony?",
    "a": "Rain Man",
    "wrong": [
      "Tootsie",
      "Kramer vs. Kramer",
      "Midnight Cowboy"
    ]
  },
  {
    "q": "Frances McDormand won Best Actress for which film at the 1997 ceremony?",
    "a": "Fargo",
    "wrong": [
      "Secrets & Lies",
      "Emma",
      "The English Patient"
    ]
  },
  {
    "q": "Who won Best Director for 'Nomadland' at the 2021 ceremony?",
    "a": "Chloé Zhao",
    "wrong": [
      "David Fincher",
      "Lee Isaac Chung",
      "Emerald Fennell"
    ]
  },
  {
    "q": "Mahershala Ali won Best Supporting Actor for which film at the 2017 ceremony?",
    "a": "Moonlight",
    "wrong": [
      "Hidden Figures",
      "Fences",
      "Lion"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2010 ceremony (for 2009 films)?",
    "a": "Transformers: Revenge of the Fallen",
    "wrong": [
      "Avatar",
      "The Hurt Locker",
      "Up"
    ]
  },
  {
    "q": "Tom Hanks won Best Actor for which film at the 1995 ceremony?",
    "a": "Forrest Gump",
    "wrong": [
      "Philadelphia",
      "Cast Away",
      "Saving Private Ryan"
    ]
  },
  {
    "q": "Lupita Nyong'o won Best Supporting Actress for which film at the 2014 ceremony?",
    "a": "12 Years a Slave",
    "wrong": [
      "Gravity",
      "The Great Gatsby",
      "American Hustle"
    ]
  },
  {
    "q": "Who won Best Director for 'Everything Everywhere All at Once' at the 2023 ceremony?",
    "a": "Daniel Kwan and Daniel Scheinert",
    "wrong": [
      "Jane Campion",
      "Ryusuke Hamaguchi",
      "Paul Thomas Anderson"
    ]
  },
  {
    "q": "Jodie Foster won Best Actress for which film at the 1992 ceremony?",
    "a": "The Silence of the Lambs",
    "wrong": [
      "Thelma & Louise",
      "Sleeping with the Enemy",
      "Backdraft"
    ]
  },
  {
    "q": "'Dune: Part Two' was nominated for Best Picture at the 2025 ceremony but did NOT win. Which film won?",
    "a": "Oppenheimer",
    "wrong": [
      "Killers of the Flower Moon",
      "The Brutalist",
      "Wicked"
    ]
  },
  {
    "q": "Who won Best Director for 'Oppenheimer' at the 2024 ceremony?",
    "a": "Christopher Nolan",
    "wrong": [
      "Justine Triet",
      "Justine Triet",
      "Yorgos Lanthimos"
    ]
  },
  {
    "q": "Who directed 'Birdman,' which won Best Picture in 2015?",
    "a": "Alejandro González Iñárritu",
    "wrong": [
      "Damien Chazelle",
      "Tom Hooper",
      "Bennett Miller"
    ]
  },
  {
    "q": "Who won Best Director for 'Parasite' at the 2020 Oscars?",
    "a": "Bong Joon-ho",
    "wrong": [
      "Quentin Tarantino",
      "Martin Scorsese",
      "David Fincher"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2023 Academy Awards?",
    "a": "Bullet Train",
    "wrong": [
      "Everything Everywhere All at Once",
      "The Fabelmans",
      "Top Gun: Maverick"
    ]
  },
  {
    "q": "How many Oscars did 'The Return of the King' win at the 2004 Academy Awards?",
    "a": "11",
    "wrong": [
      "10",
      "9",
      "12"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2002 Academy Awards?",
    "a": "Chicago",
    "wrong": [
      "The Lord of the Rings: The Fellowship of the Ring",
      "Moulin Rouge!",
      "A Beautiful Mind"
    ]
  },
  {
    "q": "Who won Best Supporting Actor for 'Moonlight'?",
    "a": "Mahershala Ali",
    "wrong": [
      "Dev Patel",
      "Michael Shannon",
      "Jeff Bridges"
    ]
  },
  {
    "q": "Emma Stone won Best Actress for which film?",
    "a": "La La Land",
    "wrong": [
      "Poor Things",
      "The Help",
      "Bumblebee"
    ]
  },
  {
    "q": "How many Oscars did 'Dune: Part Two' win at the 2024 Academy Awards?",
    "a": "0",
    "wrong": [
      "1",
      "2",
      "3"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2019 Academy Awards?",
    "a": "Avengers: Infinity War",
    "wrong": [
      "Green Book",
      "A Star Is Born",
      "Vice"
    ]
  },
  {
    "q": "Who directed 'Nomadland,' which won Best Picture in 2021?",
    "a": "Chloé Zhao",
    "wrong": [
      "David Fincher",
      "Lee Isaac Chung",
      "Emerald Fennell"
    ]
  },
  {
    "q": "Which film won the Academy Award for Best Picture at the 1975 ceremony?",
    "a": "One Flew Over the Cuckoo's Nest",
    "wrong": [
      "Jaws",
      "Barry Lyndon",
      "Dog Day Afternoon"
    ]
  },
  {
    "q": "Meryl Streep won Best Actress for which film at the 1983 Academy Awards?",
    "a": "Sophie's Choice",
    "wrong": [
      "The Iron Lady",
      "Kramer vs. Kramer",
      "The Devil Wears Prada"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2020 ceremony (awards for 2019 films)?",
    "a": "Once Upon a Time in Hollywood",
    "wrong": [
      "1917",
      "Parasite",
      "Jojo Rabbit"
    ]
  },
  {
    "q": "Stanley Kubrick won the Academy Award for Best Director for which film?",
    "a": "He never won a Best Director Oscar",
    "wrong": [
      "2001: A Space Odyssey",
      "A Clockwork Orange",
      "Barry Lyndon"
    ]
  },
  {
    "q": "Jack Lemmon won Best Actor at the 1974 ceremony for which film?",
    "a": "Save the Tiger",
    "wrong": [
      "The Poseidon Adventure",
      "American Graffiti",
      "The Sting"
    ]
  },
  {
    "q": "How many Academy Awards did 'Titanic' win at the 1998 ceremony?",
    "a": "11",
    "wrong": [
      "10",
      "13",
      "9"
    ]
  },
  {
    "q": "Steven Spielberg won Best Director for which film at the 1994 Academy Awards?",
    "a": "Schindler's List",
    "wrong": [
      "Saving Private Ryan",
      "War Horse",
      "Lincoln"
    ]
  },
  {
    "q": "Cate Blanchett won Best Supporting Actress at the 2014 ceremony for which film?",
    "a": "Blue Jasmine",
    "wrong": [
      "Carol",
      "Elizabeth",
      "Notes on a Scandal"
    ]
  },
  {
    "q": "Which film won Best Picture at the 2010 ceremony (awards for 2009 films)?",
    "a": "Slumdog Millionaire",
    "wrong": [
      "The Curious Case of Benjamin Button",
      "Milk",
      "Frost/Nixon"
    ]
  },
  {
    "q": "Dustin Hoffman won Best Actor at the 1990 ceremony for which film?",
    "a": "Rain Man",
    "wrong": [
      "The Accused",
      "Working Girl",
      "Driving Miss Daisy"
    ]
  },
  {
    "q": "Alfonso Cuarón won Best Director for which film at the 2014 Academy Awards?",
    "a": "Gravity",
    "wrong": [
      "Children of Men",
      "A Little Princess",
      "Y Tu Mamá También"
    ]
  },
  {
    "q": "Kate Winslet won Best Actress at the 2009 ceremony for which film?",
    "a": "The Reader",
    "wrong": [
      "Titanic",
      "Eternal Sunshine of the Spotless Mind",
      "The Holiday"
    ]
  },
  {
    "q": "How many Academy Awards did 'The Lord of the Rings: The Return of the King' win at the 2004 ceremony?",
    "a": "11",
    "wrong": [
      "10",
      "12",
      "9"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture at the 2015 ceremony (awards for 2014 films)?",
    "a": "The Imitation Game",
    "wrong": [
      "Birdman",
      "Boyhood",
      "The Grand Budapest Hotel"
    ]
  },
  {
    "q": "Joaquin Phoenix won Best Actor at the 2020 ceremony for which film?",
    "a": "Joker",
    "wrong": [
      "Gladiator",
      "The Master",
      "Her"
    ]
  },
  {
    "q": "Jessica Lange won Best Supporting Actress at the 1995 ceremony for which film?",
    "a": "Blue Sky",
    "wrong": [
      "Tootsie",
      "Kramer vs. Kramer",
      "Cape Fear"
    ]
  },
  {
    "q": "Which film won Best Picture at the 1981 ceremony (awards for 1980 films)?",
    "a": "Ordinary People",
    "wrong": [
      "Raging Bull",
      "The Elephant Man",
      "Tess"
    ]
  },
  {
    "q": "Heath Ledger won Best Supporting Actor at the 2009 ceremony for which film?",
    "a": "The Dark Knight",
    "wrong": [
      "Brokeback Mountain",
      "The Imaginarium of Doctor Parnassus",
      "Candy"
    ]
  },
  {
    "q": "Clint Eastwood won Best Director for which film at the 1993 Academy Awards?",
    "a": "Unforgiven",
    "wrong": [
      "Gran Torino",
      "Million Dollar Baby",
      "The Gauntlet"
    ]
  },
  {
    "q": "Which film won Best Picture at the 1978 Academy Awards?",
    "a": "Annie Hall",
    "wrong": [
      "The Turning Point",
      "Star Wars",
      "Close Encounters of the Third Kind"
    ]
  },
  {
    "q": "Meryl Streep won Best Actress for which film in 1983?",
    "a": "Sophie's Choice",
    "wrong": [
      "Kramer vs. Kramer",
      "The Iron Lady",
      "Silkwood"
    ]
  },
  {
    "q": "Who won Best Director for 'Schindler's List' at the 1994 Academy Awards?",
    "a": "Steven Spielberg",
    "wrong": [
      "Martin Scorsese",
      "James Cameron",
      "Clint Eastwood"
    ]
  },
  {
    "q": "Denzel Washington won Best Actor for which film in 2002?",
    "a": "Training Day",
    "wrong": [
      "American Gangster",
      "Malcolm X",
      "The Hurricane"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture in 2010?",
    "a": "Inception",
    "wrong": [
      "Avatar",
      "The Blind Side",
      "District 9"
    ]
  },
  {
    "q": "Who won Best Supporting Actor for 'Brokeback Mountain' at the 2006 Academy Awards?",
    "a": "Heath Ledger",
    "wrong": [
      "Jake Gyllenhaal",
      "Oscar Isaac",
      "Michael Shannon"
    ]
  },
  {
    "q": "Jessica Lange won Best Supporting Actress for which 1995 film?",
    "a": "Blue Sky",
    "wrong": [
      "Postcards from the Edge",
      "O Pioneers!",
      "Tootsie"
    ]
  },
  {
    "q": "Who directed 'Dances with Wolves,' which won Best Picture in 1991?",
    "a": "Kevin Costner",
    "wrong": [
      "Barry Levinson",
      "Oliver Stone",
      "Jonathan Demme"
    ]
  },
  {
    "q": "Jack Lemmon won Best Actor for which film at the 1974 Academy Awards?",
    "a": "Save the Tiger",
    "wrong": [
      "The Poseidon Adventure",
      "Some Like It Hot",
      "The Odd Couple"
    ]
  },
  {
    "q": "How many Oscars did 'Ben-Hur' win at the 1960 Academy Awards?",
    "a": "11",
    "wrong": [
      "10",
      "12",
      "9"
    ]
  },
  {
    "q": "Lupita Nyong'o won Best Supporting Actress for which 2014 film?",
    "a": "12 Years a Slave",
    "wrong": [
      "Gravity",
      "Blue Jasmine",
      "American Hustle"
    ]
  },
  {
    "q": "Who won Best Director for 'Nomadland' at the 2021 Academy Awards?",
    "a": "Chloé Zhao",
    "wrong": [
      "Paul Thomas Anderson",
      "David Fincher",
      "Lee Isaac Chung"
    ]
  },
  {
    "q": "Sean Penn won Best Actor for which film in 2004?",
    "a": "Mystic River",
    "wrong": [
      "Milk",
      "I Am Sam",
      "The Thin Red Line"
    ]
  },
  {
    "q": "Which film was NOT nominated for Best Picture in 1998?",
    "a": "Good Will Hunting",
    "wrong": [
      "Titanic",
      "As Good as It Gets",
      "The Full Monty"
    ]
  },
  {
    "q": "Cate Blanchett won Best Supporting Actress for which 2014 film?",
    "a": "Blue Jasmine",
    "wrong": [
      "American Hustle",
      "The Hobbit: The Desolation of Smaug",
      "The Wolf of Wall Street"
    ]
  },
  {
    "q": "Who won Best Director for 'Crash' at the 2006 Academy Awards?",
    "a": "Paul Haggis",
    "wrong": [
      "Ang Lee",
      "Clint Eastwood",
      "Bennett Miller"
    ]
  },
  {
    "q": "How many Oscars did 'The Lord of the Rings: The Return of the King' win in 2004?",
    "a": "11",
    "wrong": [
      "10",
      "13",
      "12"
    ]
  }
];

const AI_QUOTES = [
  {
    "q": "Which movie features the line: 'Here's looking at you, kid'?",
    "a": "Casablanca",
    "wrong": [
      "The Big Sleep",
      "The Maltese Falcon",
      "Out of the Past"
    ]
  },
  {
    "q": "Who said 'I'm going to make him an offer he can't refuse' in The Godfather?",
    "a": "Vito Corleone",
    "wrong": [
      "Michael Corleone",
      "Tom Hagen",
      "Peter Clemenza"
    ]
  },
  {
    "q": "Which movie features the line: 'You can't handle the truth!'?",
    "a": "A Few Good Men",
    "wrong": [
      "Scream",
      "The Verdict",
      "Anatomy of a Murder"
    ]
  },
  {
    "q": "Complete the quote from Jaws: 'You're going to need a bigger...'",
    "a": "boat",
    "wrong": [
      "gun",
      "net",
      "cage"
    ]
  },
  {
    "q": "Who said 'May the Force be with you' first in the original Star Wars trilogy?",
    "a": "General Dodonna",
    "wrong": [
      "Obi-Wan Kenobi",
      "Yoda",
      "Leia Organa"
    ]
  },
  {
    "q": "Which movie features the line: 'I'll have what she's having'?",
    "a": "When Harry Met Sally",
    "wrong": [
      "Splash",
      "Ghostbusters",
      "Coming Soon"
    ]
  },
  {
    "q": "Who said 'Fasten your seatbelts. It's going to be a bumpy night' in All About Eve?",
    "a": "Margo Channing",
    "wrong": [
      "Eve Harrington",
      "Karen Richards",
      "Addison DeWitt"
    ]
  },
  {
    "q": "Which movie features the line: 'You talking to me?'?",
    "a": "Taxi Driver",
    "wrong": [
      "Raging Bull",
      "Mean Streets",
      "The Irishman"
    ]
  },
  {
    "q": "Complete the quote from The Wizard of Oz: 'There's no place like...'",
    "a": "home",
    "wrong": [
      "Kansas",
      "Oz",
      "anywhere"
    ]
  },
  {
    "q": "Who said 'I'm your density' (meant to be 'destiny') in Back to the Future?",
    "a": "George McFly",
    "wrong": [
      "Marty McFly",
      "Doc Brown",
      "Biff Tannen"
    ]
  },
  {
    "q": "Which movie features the line: 'Houston, we have a problem'?",
    "a": "Apollo 13",
    "wrong": [
      "The Right Stuff",
      "Hidden Figures",
      "Gravity"
    ]
  },
  {
    "q": "Who said 'Why so serious?' in The Dark Knight?",
    "a": "The Joker",
    "wrong": [
      "Batman",
      "Harvey Dent",
      "Commissioner Gordon"
    ]
  },
  {
    "q": "Which movie features the line: 'Show me the money!'?",
    "a": "Jerry Maguire",
    "wrong": [
      "Wall Street",
      "The Wolf of Wall Street",
      "Boiler Room"
    ]
  },
  {
    "q": "Complete the quote from Forrest Gump: 'Life is like a box of...'",
    "a": "chocolates",
    "wrong": [
      "surprises",
      "cards",
      "opportunities"
    ]
  },
  {
    "q": "Who said 'I see dead people' in The Sixth Sense?",
    "a": "Cole Sear",
    "wrong": [
      "Dr. Malcolm Crowe",
      "Vincent Grey",
      "Anna Crowe"
    ]
  },
  {
    "q": "Which movie features the line: 'Nobody puts Baby in a corner'?",
    "a": "Dirty Dancing",
    "wrong": [
      "Flashdance",
      "Footloose",
      "Grease"
    ]
  },
  {
    "q": "Who said 'After all, tomorrow is another day' in Gone with the Wind?",
    "a": "Scarlett O'Hara",
    "wrong": [
      "Rhett Butler",
      "Melanie Hamilton",
      "Ashley Wilkes"
    ]
  },
  {
    "q": "Which movie features the line: 'To infinity and beyond!'?",
    "a": "Toy Story",
    "wrong": [
      "Toy Story 2",
      "Toy Story 3",
      "Toy Story 4"
    ]
  },
  {
    "q": "Complete the quote from The Shining: 'All work and no play makes Jack a...'",
    "a": "dull boy",
    "wrong": [
      "sick boy",
      "dead boy",
      "mad boy"
    ]
  },
  {
    "q": "Who said 'You is kind. You is smart. You is important' in The Help?",
    "a": "Aibileen Clark",
    "wrong": [
      "Minny Jackson",
      "Skeeter Phelps",
      "Hilly Holbrook"
    ]
  },
  {
    "q": "Who said 'I'll have what she's having' in When Harry Met Sally?",
    "a": "An elderly diner customer",
    "wrong": [
      "Sally Albright",
      "Marie",
      "A waitress"
    ]
  },
  {
    "q": "Complete the quote from Jaws: 'You're gonna need a bigger...'",
    "a": "boat",
    "wrong": [
      "gun",
      "ship",
      "crew"
    ]
  },
  {
    "q": "Which film features: 'I'm going to make him an offer he can't refuse'?",
    "a": "The Godfather",
    "wrong": [
      "Scarface",
      "Once Upon a Time in America",
      "Miller's Crossing"
    ]
  },
  {
    "q": "Who said 'You can't handle the truth!' in A Few Good Men?",
    "a": "Jack Nicholson's character",
    "wrong": [
      "Tom Cruise's character",
      "Demi Moore's character",
      "Kevin Bacon's character"
    ]
  },
  {
    "q": "Who said 'Here's Johnny!' in The Shining?",
    "a": "Jack Torrance",
    "wrong": [
      "Wendy Torrance",
      "Danny Torrance",
      "Halloran"
    ]
  },
  {
    "q": "Which film features: 'I'll be back'?",
    "a": "The Terminator",
    "wrong": [
      "Predator",
      "Total Recall",
      "Running Man"
    ]
  },
  {
    "q": "Complete the quote from Breakfast at Tiffany's: 'I'm not really a...'",
    "a": "call girl",
    "wrong": [
      "party girl",
      "bad girl",
      "lonely girl"
    ]
  },
  {
    "q": "Which movie features: 'There's no place like home'?",
    "a": "The Wizard of Oz",
    "wrong": [
      "Meet Me in St. Louis",
      "It's a Wonderful Life",
      "Harvey"
    ]
  },
  {
    "q": "Who said 'You had me at hello' in Jerry Maguire?",
    "a": "Dorothy Boyd",
    "wrong": [
      "Jerry Maguire",
      "Ray Kinsella",
      "Marcee Tidwell"
    ]
  },
  {
    "q": "Complete the quote from The Empire Strikes Back: 'I am your...'",
    "a": "father",
    "wrong": [
      "destiny",
      "enemy",
      "master"
    ]
  },
  {
    "q": "Which film features: 'Go ahead, make my day'?",
    "a": "Sudden Impact",
    "wrong": [
      "Dirty Harry",
      "The Outlaw Josey Wales",
      "Escape from Alcatraz"
    ]
  },
  {
    "q": "Who said 'I'm the king of the world!' in Titanic?",
    "a": "Jack Dawson",
    "wrong": [
      "Cal Hockley",
      "Thomas Andrews",
      "Captain Smith"
    ]
  },
  {
    "q": "Complete the quote from Gladiator: 'Are you not...'",
    "a": "entertained?",
    "wrong": [
      "amused?",
      "satisfied?",
      "moved?"
    ]
  },
  {
    "q": "Which movie features: 'Why so serious?'?",
    "a": "The Dark Knight",
    "wrong": [
      "The Dark Knight Rises",
      "Batman Returns",
      "Batman Forever"
    ]
  },
  {
    "q": "Who said 'I drink your milkshake' in There Will Be Blood?",
    "a": "Daniel Plainview",
    "wrong": [
      "H.W. Plainview",
      "Eli Sunday",
      "Fletcher Hamilton"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'Say what again, I dare you, I double dare you...'",
    "a": "motherfucker",
    "wrong": [
      "bastard",
      "asshole",
      "jerk"
    ]
  },
  {
    "q": "Which movie features the line: 'You talking to me?'",
    "a": "Taxi Driver",
    "wrong": [
      "Raging Bull",
      "Mean Streets",
      "Goodfellas"
    ]
  },
  {
    "q": "Who said 'Here's looking at you, kid' in Casablanca?",
    "a": "Rick Blaine",
    "wrong": [
      "Sam the pianist",
      "Captain Renault",
      "Laszlo"
    ]
  },
  {
    "q": "Complete the quote from The Shawshank Redemption: 'Get busy living or get busy...'",
    "a": "dying",
    "wrong": [
      "suffering",
      "waiting",
      "leaving"
    ]
  },
  {
    "q": "Which film features the line: 'May the Force be with you'?",
    "a": "Star Wars: A New Hope",
    "wrong": [
      "The Empire Strikes Back",
      "Return of the Jedi",
      "The Force Awakens"
    ]
  },
  {
    "q": "Complete the quote from Forrest Gump: 'Life is like a box of chocolates...'",
    "a": "you never know what you're gonna get",
    "wrong": [
      "it's always bittersweet",
      "some are sweeter than others",
      "they melt in the sun"
    ]
  },
  {
    "q": "Which movie features the line: 'I am serious. And don't call me Shirley.'?",
    "a": "Airplane!",
    "wrong": [
      "The Pink Panther",
      "Singin' in the Rain",
      "Some Like It Hot"
    ]
  },
  {
    "q": "Which film features the line: 'Why so serious?'",
    "a": "The Dark Knight",
    "wrong": [
      "Batman Begins",
      "The Dark Knight Rises",
      "Joker"
    ]
  },
  {
    "q": "Who said 'Nobody puts Baby in a corner' in Dirty Dancing?",
    "a": "Johnny Castle",
    "wrong": [
      "Robbie Gould",
      "Dr. Houseman",
      "Neil Kellerman"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'Royale with Cheese' is a reference to...",
    "a": "a McDonald's burger in France",
    "wrong": [
      "a fancy restaurant",
      "a wine pairing",
      "a character's nickname"
    ]
  },
  {
    "q": "Which movie features the line: 'I see dead people'?",
    "a": "The Sixth Sense",
    "wrong": [
      "Poltergeist",
      "The Others",
      "Insidious"
    ]
  },
  {
    "q": "Who said 'Houston, we have a problem' in Apollo 13?",
    "a": "Jack Swigert",
    "wrong": [
      "Jim Lovell",
      "Fred Haise",
      "Mission Control"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'What is the most resilient parasite? A bacterium? A virus? An idea. Resilient...'",
    "a": "highly contagious",
    "wrong": [
      "impossible to kill",
      "dangerous and spreading",
      "eternal and binding"
    ]
  },
  {
    "q": "Which film features the line: 'I'll be back'?",
    "a": "The Terminator",
    "wrong": [
      "Predator",
      "Total Recall",
      "Running Man"
    ]
  },
  {
    "q": "Who said 'There's no place like home' in The Wizard of Oz?",
    "a": "Dorothy Gale",
    "wrong": [
      "Glinda the Good Witch",
      "the Scarecrow",
      "Toto"
    ]
  },
  {
    "q": "Complete the quote from Gladiator: 'Are you not entertained? Are you not...'",
    "a": "entertained?!",
    "wrong": [
      "amazed?",
      "thrilled?",
      "satisfied?"
    ]
  },
  {
    "q": "Which movie features the line: 'Here's Johnny!'?",
    "a": "The Shining",
    "wrong": [
      "One Flew Over the Cuckoo's Nest",
      "Batman",
      "The Overlook"
    ]
  },
  {
    "q": "Who said 'Hasta la vista, baby' in Terminator 2: Judgment Day?",
    "a": "The T-800",
    "wrong": [
      "Sarah Connor",
      "John Connor",
      "The T-1000"
    ]
  },
  {
    "q": "Complete the quote from The Godfather: 'I'm going to make him an offer he can't...'",
    "a": "refuse",
    "wrong": [
      "decline",
      "ignore",
      "reject"
    ]
  },
  {
    "q": "Which movie features the line: 'May the Force be with you'?",
    "a": "Star Wars",
    "wrong": [
      "Star Trek",
      "Blade Runner",
      "The Fifth Element"
    ]
  },
  {
    "q": "Complete the quote from Forrest Gump: 'Life is like a box of chocolates, you never know what you're gonna...'",
    "a": "get",
    "wrong": [
      "find",
      "receive",
      "taste"
    ]
  },
  {
    "q": "Which movie features the line: 'You is kind. You is smart. You is important'?",
    "a": "The Help",
    "wrong": [
      "Hidden Figures",
      "Dreamgirls",
      "Hairspray"
    ]
  },
  {
    "q": "Who said 'I'm Batman' in Batman Begins?",
    "a": "Christian Bale",
    "wrong": [
      "Michael Keaton",
      "Val Kilmer",
      "George Clooney"
    ]
  },
  {
    "q": "Which movie features the line: 'I'm your father'?",
    "a": "The Empire Strikes Back",
    "wrong": [
      "Return of the Jedi",
      "A New Hope",
      "The Force Awakens"
    ]
  },
  {
    "q": "Who said 'Go ahead, make my day' in Sudden Impact?",
    "a": "Clint Eastwood",
    "wrong": [
      "Charles Bronson",
      "Steven Seagal",
      "Jean-Claude Van Damme"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'You mustn't be afraid to dream a little bigger...'",
    "a": "darling",
    "wrong": [
      "dear",
      "love",
      "sweetheart"
    ]
  },
  {
    "q": "Who said 'I'll be back' in The Terminator?",
    "a": "Arnold Schwarzenegger",
    "wrong": [
      "Sylvester Stallone",
      "Jean-Claude Van Damme",
      "Steven Seagal"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'That IS a tasty burger...'",
    "a": "Vincent",
    "wrong": [
      "Jules",
      "Mia",
      "Marsellus"
    ]
  },
  {
    "q": "Which movie features the line: 'You had me at hello'?",
    "a": "Jerry Maguire",
    "wrong": [
      "Sleepless in Seattle",
      "You've Got Mail",
      "Notting Hill"
    ]
  },
  {
    "q": "Who said 'I feel the need... the need for speed!' in Top Gun?",
    "a": "Tom Cruise",
    "wrong": [
      "Anthony Edwards",
      "Val Kilmer",
      "Kelly McGillis"
    ]
  },
  {
    "q": "Which movie features the line: 'I am Groot'?",
    "a": "Guardians of the Galaxy",
    "wrong": [
      "Thor: Ragnarok",
      "Avengers: Infinity War",
      "Captain America: Civil War"
    ]
  },
  {
    "q": "Who said 'Frankly, my dear, I don't give a damn' in Gone with the Wind?",
    "a": "Rhett Butler",
    "wrong": [
      "Scarlett O'Hara",
      "Ashley Wilkes",
      "Prissy"
    ]
  },
  {
    "q": "Which movie features the line: 'You're gonna need a bigger boat'?",
    "a": "Jaws",
    "wrong": [
      "The Deep",
      "Moby Dick",
      "Orca"
    ]
  },
  {
    "q": "Which movie features the line: 'After all, tomorrow is another day'?",
    "a": "Gone with the Wind",
    "wrong": [
      "Casablanca",
      "The Big Sleep",
      "Now, Voyager"
    ]
  },
  {
    "q": "Who said 'I am Iron Man' at the end of Avengers: Endgame?",
    "a": "Tony Stark",
    "wrong": [
      "Steve Rogers",
      "Bruce Banner",
      "Thor"
    ]
  },
  {
    "q": "Complete the quote from The Matrix: 'There is no...'",
    "a": "spoon",
    "wrong": [
      "escape",
      "reality",
      "choice"
    ]
  },
  {
    "q": "Who said 'I love the smell of napalm in the morning' in Apocalypse Now?",
    "a": "Lieutenant Colonel Bill Kilgore",
    "wrong": [
      "Captain Benjamin Willard",
      "Chef",
      "Clean"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'Royale with Cheese' is discussed when discussing a McDonald's burger in which country?",
    "a": "France",
    "wrong": [
      "Germany",
      "Belgium",
      "Switzerland"
    ]
  },
  {
    "q": "Who said 'Here's Johnny!' while breaking through a door in The Shining?",
    "a": "Jack Torrance",
    "wrong": [
      "Lloyd the bartender",
      "Grady",
      "The cook"
    ]
  },
  {
    "q": "Complete the quote from Breakfast at Tiffany's: 'I'm funny how? I mean funny like I'm a...'",
    "a": "clown",
    "wrong": [
      "jester",
      "comedian",
      "buffoon"
    ]
  },
  {
    "q": "Which movie features the line: 'Why so serious?' spoken repeatedly?",
    "a": "The Dark Knight",
    "wrong": [
      "Batman Begins",
      "The Dark Knight Rises",
      "Batman Forever"
    ]
  },
  {
    "q": "Which movie features the line: 'I am your father'?",
    "a": "The Empire Strikes Back",
    "wrong": [
      "Return of the Jedi",
      "A New Hope",
      "Revenge of the Sith"
    ]
  },
  {
    "q": "Which film features the line: 'You can't handle the truth!'?",
    "a": "A Few Good Men",
    "wrong": [
      "The Firm",
      "The Pelican Brief",
      "Legalese"
    ]
  },
  {
    "q": "Who said 'Toto, I've a feeling we're not in Kansas anymore' in The Wizard of Oz?",
    "a": "Dorothy Gale",
    "wrong": [
      "The Scarecrow",
      "The Tin Man",
      "The Cowardly Lion"
    ]
  },
  {
    "q": "Complete the quote from Casablanca: 'Here's looking at you, ...'",
    "a": "kid",
    "wrong": [
      "babe",
      "sweetheart",
      "darling"
    ]
  },
  {
    "q": "Which film features the line: 'After all, tomorrow is another day'?",
    "a": "Gone with the Wind",
    "wrong": [
      "Breakfast at Tiffany's",
      "Roman Holiday",
      "Singin' in the Rain"
    ]
  },
  {
    "q": "Complete the quote from The Silence of the Lambs: 'A census taker once tried to test me. I...'",
    "a": "ate his liver with some fava beans and a nice Chianti",
    "wrong": [
      "ate his heart",
      "killed him",
      "let him go"
    ]
  },
  {
    "q": "Which film features the line: 'Houston, we have a problem'?",
    "a": "Apollo 13",
    "wrong": [
      "Interstellar",
      "Gravity",
      "The Right Stuff"
    ]
  },
  {
    "q": "Complete the quote from The Godfather: 'I'm gonna make him an offer he...'",
    "a": "can't refuse",
    "wrong": [
      "won't forget",
      "must consider",
      "should accept"
    ]
  },
  {
    "q": "Which film features the line: 'I see dead people'?",
    "a": "The Sixth Sense",
    "wrong": [
      "The Others",
      "Insidious",
      "Sinister"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'The dream is crumbling. We have to...'",
    "a": "go deeper",
    "wrong": [
      "wake up",
      "escape",
      "run"
    ]
  },
  {
    "q": "Which film features the line: 'Why so serious?'?",
    "a": "The Dark Knight",
    "wrong": [
      "The Dark Knight Rises",
      "Joker",
      "Batman Forever"
    ]
  },
  {
    "q": "Which film features the line: 'I am your father'?",
    "a": "The Empire Strikes Back",
    "wrong": [
      "Return of the Jedi",
      "A New Hope",
      "The Force Awakens"
    ]
  },
  {
    "q": "Which movie features: 'May the Force be with you'?",
    "a": "Star Wars",
    "wrong": [
      "Star Wars: The Last Jedi",
      "Rogue One",
      "Star Wars: The Rise of Skywalker"
    ]
  },
  {
    "q": "Who delivered the line 'I'll have what she's having' in When Harry Met Sally?",
    "a": "Rob Reiner",
    "wrong": [
      "Billy Crystal",
      "Meg Ryan",
      "Carrie Fisher"
    ]
  },
  {
    "q": "Which film features: 'Rosebud'?",
    "a": "Citizen Kane",
    "wrong": [
      "The Magnificent Ambersons",
      "F for Fake",
      "The Lady from Shanghai"
    ]
  },
  {
    "q": "Who delivered 'Why so serious?' in The Dark Knight?",
    "a": "Heath Ledger",
    "wrong": [
      "Christian Bale",
      "Aaron Eckhart",
      "Maggie Gyllenhaal"
    ]
  },
  {
    "q": "Which film features: 'Here's Johnny!'?",
    "a": "The Shining",
    "wrong": [
      "The Overlook",
      "Poltergeist",
      "The Exorcist"
    ]
  },
  {
    "q": "Complete the quote from Breakfast at Tiffany's: 'I'm funny how? Funny like a...'",
    "a": "clown",
    "wrong": [
      "jester",
      "comedian",
      "fool"
    ]
  },
  {
    "q": "Which movie features: 'After all, tomorrow is another day'?",
    "a": "Gone with the Wind",
    "wrong": [
      "The Big Sleep",
      "Now, Voyager",
      "Dark Victory"
    ]
  },
  {
    "q": "Which film features: 'You shall not pass!'?",
    "a": "The Fellowship of the Ring",
    "wrong": [
      "The Two Towers",
      "The Return of the King",
      "The Hobbit: The Battle of the Five Armies"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'I'm going to steal the...'",
    "a": "Declaration of Independence",
    "wrong": [
      "Mona Lisa",
      "Crown Jewels",
      "Hope Diamond"
    ]
  },
  {
    "q": "Who delivered the line 'I'll be back' in The Terminator?",
    "a": "Arnold Schwarzenegger",
    "wrong": [
      "Michael Biehn",
      "Linda Hamilton",
      "Lance Henriksen"
    ]
  },
  {
    "q": "Which film features the line: 'E.T. phone home'?",
    "a": "E.T. the Extra-Terrestrial",
    "wrong": [
      "Close Encounters of the Third Kind",
      "Innerspace",
      "Flight of the Navigator"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'What do they call a Quarter Pounder with Cheese in...'",
    "a": "Paris",
    "wrong": [
      "London",
      "Amsterdam",
      "Berlin"
    ]
  },
  {
    "q": "Which movie features: 'I love the smell of napalm in the morning'?",
    "a": "Apocalypse Now",
    "wrong": [
      "Platoon",
      "We Were Soldiers",
      "Hamburger Hill"
    ]
  },
  {
    "q": "Complete the quote from The Sixth Sense: 'I see dead...'",
    "a": "people",
    "wrong": [
      "things",
      "souls",
      "spirits"
    ]
  },
  {
    "q": "Which film features the line: 'You're a wizard, Harry'?",
    "a": "Harry Potter and the Philosopher's Stone",
    "wrong": [
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'We need to go...'",
    "a": "deeper",
    "wrong": [
      "further",
      "down",
      "back"
    ]
  },
  {
    "q": "Who said 'I am Groot' in Guardians of the Galaxy?",
    "a": "Vin Diesel",
    "wrong": [
      "Chris Pratt",
      "Zoe Saldana",
      "Dave Bautista"
    ]
  },
  {
    "q": "Which movie features: 'The stuff that dreams are made of'?",
    "a": "The Maltese Falcon",
    "wrong": [
      "Casablanca",
      "The Big Sleep",
      "Murder, My Sweet"
    ]
  },
  {
    "q": "Which movie features the line: 'Frankly, my dear, I don't give a damn'?",
    "a": "Gone with the Wind",
    "wrong": [
      "The Philadelphia Story",
      "Now, Voyager",
      "The Reckless Moment"
    ]
  },
  {
    "q": "Who said 'I'm flying, Jack!' in Titanic?",
    "a": "Kate Winslet",
    "wrong": [
      "Frances Fisher",
      "Gloria Stuart",
      "Kathy Bates"
    ]
  },
  {
    "q": "Complete the quote from Inception: 'You mustn't be afraid to dream a little bigger, darling.' Who says this?",
    "a": "Tom Hardy",
    "wrong": [
      "Leonardo DiCaprio",
      "Marion Cotillard",
      "Ellen Page"
    ]
  },
  {
    "q": "Who said 'Did you ever dance with the devil in the pale moonlight?' in Batman (1989)?",
    "a": "Jack Nicholson",
    "wrong": [
      "Michael Keaton",
      "Kim Basinger",
      "Robert Wuhl"
    ]
  },
  {
    "q": "Which film features the line: 'You've got to ask yourself one question: Do I feel lucky?'",
    "a": "Dirty Harry",
    "wrong": [
      "Magnum Force",
      "The Enforcer",
      "Sudden Impact"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'Royale with Cheese' is a reference to what country's naming convention?",
    "a": "France",
    "wrong": [
      "Germany",
      "Belgium",
      "Switzerland"
    ]
  },
  {
    "q": "Which movie contains the quote: 'They don't make 'em like they used to'?",
    "a": "Gran Torino",
    "wrong": [
      "Million Dollar Baby",
      "The Gauntlet",
      "The Outlaw Josey Wales"
    ]
  },
  {
    "q": "Who delivered the line 'You had me at hello' in Jerry Maguire?",
    "a": "Renée Zellweger",
    "wrong": [
      "Cuba Gooding Jr.",
      "Tom Cruise",
      "Kelly Preston"
    ]
  },
  {
    "q": "Which film features: 'Houston, we have a problem'?",
    "a": "Apollo 13",
    "wrong": [
      "The Right Stuff",
      "Hidden Figures",
      "For All Mankind"
    ]
  },
  {
    "q": "Which movie contains: 'You can't handle the truth!'?",
    "a": "A Few Good Men",
    "wrong": [
      "Scream",
      "The Firm",
      "Disclosure"
    ]
  },
  {
    "q": "Complete the quote from Pulp Fiction: 'Say what again. Say what again, I dare you, I double dare you...'",
    "a": "motherfucker",
    "wrong": [
      "homeboy",
      "brother",
      "fool"
    ]
  },
  {
    "q": "Who delivered 'I'm king of the world!' in Titanic?",
    "a": "Leonardo DiCaprio",
    "wrong": [
      "Billy Zane",
      "Kate Winslet",
      "David Warner"
    ]
  },
  {
    "q": "Who said 'Get to the chopper!' in Predator?",
    "a": "Arnold Schwarzenegger",
    "wrong": [
      "Carl Weathers",
      "Bill Duke",
      "Sonny Landham"
    ]
  },
  {
    "q": "Which movie contains: 'Nobody puts Baby in a corner'?",
    "a": "Dirty Dancing",
    "wrong": [
      "Flashdance",
      "Footloose",
      "Saturday Night Fever"
    ]
  },
  {
    "q": "Who delivered 'I'm Batman' in Batman Begins?",
    "a": "Christian Bale",
    "wrong": [
      "Michael Keaton",
      "Val Kilmer",
      "George Clooney"
    ]
  }
];

const AI_ACTORS = [
  {
    "q": "Who played Ennis Del Mar in Brokeback Mountain (2005)?",
    "a": "Heath Ledger",
    "wrong": [
      "Jake Gyllenhaal",
      "Ryan Gosling",
      "Oscar Isaac"
    ]
  },
  {
    "q": "Which actor starred in both Inception (2010) and The Dark Knight Rises (2012)?",
    "a": "Marion Cotillard",
    "wrong": [
      "Anne Hathaway",
      "Michael Caine",
      "Tom Hardy"
    ]
  },
  {
    "q": "What character did Meryl Streep play in Kramer vs. Kramer (1979)?",
    "a": "Joanna Kramer",
    "wrong": [
      "Margaret Kramer",
      "Diane Kramer",
      "Susan Kramer"
    ]
  },
  {
    "q": "Who played Gordon Gekko in Wall Street (1987)?",
    "a": "Michael Douglas",
    "wrong": [
      "Charlie Sheen",
      "Terence Stamp",
      "Richard Gere"
    ]
  },
  {
    "q": "Which of these films did NOT feature Tom Hanks?",
    "a": "The Sixth Sense",
    "wrong": [
      "Cast Away",
      "Saving Private Ryan",
      "Apollo 13"
    ]
  },
  {
    "q": "What character did Cate Blanchett play in Elizabeth (1998)?",
    "a": "Queen Elizabeth I",
    "wrong": [
      "Mary Queen of Scots",
      "Anne Boleyn",
      "Catherine of Aragon"
    ]
  },
  {
    "q": "Which actor starred in both Pulp Fiction (1994) and Kill Bill Vol. 1 (2003)?",
    "a": "Uma Thurman",
    "wrong": [
      "Daryl Hannah",
      "Lucy Liu",
      "Vivica A. Fox"
    ]
  },
  {
    "q": "Who played Roy Neary in Close Encounters of the Third Kind (1977)?",
    "a": "Richard Dreyfuss",
    "wrong": [
      "Roy Scheider",
      "Maximilian Schell",
      "Bob Balaban"
    ]
  },
  {
    "q": "What character did Al Pacino play in Scarface (1983)?",
    "a": "Tony Montana",
    "wrong": [
      "Frank Lopez",
      "Manny Ribera",
      "Sosa"
    ]
  },
  {
    "q": "Which of these films did NOT feature Denzel Washington?",
    "a": "Philadelphia",
    "wrong": [
      "Training Day",
      "Man on Fire",
      "The Equalizer"
    ]
  },
  {
    "q": "Who played Clarice Starling in The Silence of the Lambs (1991)?",
    "a": "Jodie Foster",
    "wrong": [
      "Michelle Pfeiffer",
      "Glenn Close",
      "Jessica Lange"
    ]
  },
  {
    "q": "Which actor starred in both Gladiator (2000) and American Gangster (2007)?",
    "a": "Denzel Washington",
    "wrong": [
      "Russell Crowe",
      "Joaquin Phoenix",
      "Javier Bardem"
    ]
  },
  {
    "q": "What character did Johnny Depp play in Pirates of the Caribbean: The Curse of the Black Pearl (2003)?",
    "a": "Captain Jack Sparrow",
    "wrong": [
      "Will Turner",
      "Barbossa",
      "Davy Jones"
    ]
  },
  {
    "q": "Who played Sarah Connor in The Terminator (1984)?",
    "a": "Linda Hamilton",
    "wrong": [
      "Sigourney Weaver",
      "Kathleen Quinlan",
      "Rosanna Arquette"
    ]
  },
  {
    "q": "Which of these films did NOT feature Leonardo DiCaprio?",
    "a": "Braveheart",
    "wrong": [
      "The Wolf of Wall Street",
      "Inception",
      "The Great Gatsby"
    ]
  },
  {
    "q": "What character did Jessica Lange play in Tootsie (1982)?",
    "a": "Julie Nichols",
    "wrong": [
      "Dorothy Michaels",
      "Les Nichols",
      "Erin Douglas"
    ]
  },
  {
    "q": "Which actor starred in both Se7en (1995) and The Social Network (2010)?",
    "a": "Andrew Garfield",
    "wrong": [
      "Brad Pitt",
      "Morgan Freeman",
      "David Fincher"
    ]
  },
  {
    "q": "Who played Detective John McClane in Die Hard (1988)?",
    "a": "Bruce Willis",
    "wrong": [
      "Sylvester Stallone",
      "Arnold Schwarzenegger",
      "Jean-Claude Van Damme"
    ]
  },
  {
    "q": "What character did Amy Adams play in Arrival (2016)?",
    "a": "Louise Banks",
    "wrong": [
      "General Shang",
      "Ian Donnelly",
      "Hannah Abbott"
    ]
  },
  {
    "q": "Which of these films did NOT feature Brad Pitt?",
    "a": "A Few Good Men",
    "wrong": [
      "Ocean's Eleven",
      "Troy",
      "Inglourious Basterds"
    ]
  },
  {
    "q": "Who played the lead role of Paul Atreides in Denis Villeneuve's Dune (2021)?",
    "a": "Timothée Chalamet",
    "wrong": [
      "Oscar Isaac",
      "Austin Butler",
      "Ansel Elgort"
    ]
  },
  {
    "q": "Which actress has NOT appeared in a Marvel Cinematic Universe film?",
    "a": "Saoirse Ronan",
    "wrong": [
      "Scarlett Johansson",
      "Elizabeth Olsen",
      "Zendaya"
    ]
  },
  {
    "q": "Tom Hardy starred in both The Dark Knight Rises and which other Christopher Nolan film?",
    "a": "Inception",
    "wrong": [
      "The Prestige",
      "Interstellar",
      "Dunkirk"
    ]
  },
  {
    "q": "What character did Meryl Streep play in Mamma Mia! (2008)?",
    "a": "Donna Sheridan",
    "wrong": [
      "Sophie Sheridan",
      "Ali",
      "Rosie"
    ]
  },
  {
    "q": "Who played Detective Lieutenant Colombo in the original television series that inspired the 1968 film?",
    "a": "Peter Falk",
    "wrong": [
      "Jack Lemmon",
      "Walter Matthau",
      "Lee J. Cobb"
    ]
  },
  {
    "q": "Leonardo DiCaprio has appeared in films directed by both Martin Scorsese and which other major director?",
    "a": "Christopher Nolan",
    "wrong": [
      "Quentin Tarantino",
      "Steven Spielberg",
      "Denis Villeneuve"
    ]
  },
  {
    "q": "What role did Lupita Nyong'o play in Black Panther (2018)?",
    "a": "Nakia",
    "wrong": [
      "Shuri",
      "Ramonda",
      "Ayo"
    ]
  },
  {
    "q": "Which actor has NOT worked with director Wes Anderson?",
    "a": "Joaquin Phoenix",
    "wrong": [
      "Ralph Fiennes",
      "Bill Murray",
      "Tilda Swinton"
    ]
  },
  {
    "q": "Who played the villain Killmonger in Black Panther?",
    "a": "Michael B. Jordan",
    "wrong": [
      "Chadwick Boseman",
      "Danai Gurira",
      "Daniel Kaluuya"
    ]
  },
  {
    "q": "Cate Blanchett starred in both Elizabeth (1998) and which other historical drama?",
    "a": "Carol",
    "wrong": [
      "The Crown (TV series)",
      "Darkest Hour",
      "The Aviator"
    ]
  },
  {
    "q": "What character did Heath Ledger famously portray in The Dark Knight (2008)?",
    "a": "The Joker",
    "wrong": [
      "Two-Face",
      "The Riddler",
      "Scarecrow"
    ]
  },
  {
    "q": "Which actor has NOT appeared in a Tarantino film?",
    "a": "Ryan Gosling",
    "wrong": [
      "Leonardo DiCaprio",
      "Samuel L. Jackson",
      "Christoph Waltz"
    ]
  },
  {
    "q": "Ryan Gosling appeared in both La La Land and which other musical film?",
    "a": "Crazy, Stupid, Love",
    "wrong": [
      "In the Heights",
      "West Side Story",
      "Tick, Tick... Boom!"
    ]
  },
  {
    "q": "Who played Cersei Lannister in the Game of Thrones television series?",
    "a": "Lena Headey",
    "wrong": [
      "Emilia Clarke",
      "Sophie Turner",
      "Maisie Williams"
    ]
  },
  {
    "q": "What character did Javier Bardem play in No Country for Old Men (2007)?",
    "a": "Anton Chigurh",
    "wrong": [
      "Llewellyn Moss",
      "Sheriff Ed Tom Bell",
      "Carson Wells"
    ]
  },
  {
    "q": "Margot Robbie has NOT appeared in which of these films?",
    "a": "Barbie",
    "wrong": [
      "Once Upon a Time in Hollywood",
      "The Wolf of Wall Street",
      "Suicide Squad"
    ]
  },
  {
    "q": "Who played the title character in the 1974 film The Godfather Part II as the young Vito Corleone?",
    "a": "Robert De Niro",
    "wrong": [
      "Al Pacino",
      "James Caan",
      "Marlon Brando"
    ]
  },
  {
    "q": "Tilda Swinton starred in both Doctor Strange and which other Marvel film?",
    "a": "Avengers: Endgame",
    "wrong": [
      "Guardians of the Galaxy Vol. 2",
      "Ant-Man",
      "Thor: Love and Thunder"
    ]
  },
  {
    "q": "What character did Andrew Garfield play in The Social Network (2010)?",
    "a": "Eduardo Saverin",
    "wrong": [
      "Mark Zuckerberg",
      "Sean Parker",
      "Chris Hughes"
    ]
  },
  {
    "q": "Which Oscar-winning actress appeared in both Slumdog Millionaire and Freida (2018)?",
    "a": "Freida Pinto",
    "wrong": [
      "Deepika Padukone",
      "Priyanka Chopra",
      "Aishwarya Rai Bachchan"
    ]
  },
  {
    "q": "Who played Allie Hamilton in The Notebook (2004)?",
    "a": "Rachel McAdams",
    "wrong": [
      "Amanda Seyfried",
      "Blake Lively",
      "Reese Witherspoon"
    ]
  },
  {
    "q": "What character did Tom Hardy play in The Dark Knight Rises (2012)?",
    "a": "Bane",
    "wrong": [
      "Scarecrow",
      "The Joker",
      "Two-Face"
    ]
  },
  {
    "q": "Who played Catwoman in Batman Returns (1992)?",
    "a": "Michelle Pfeiffer",
    "wrong": [
      "Geena Davis",
      "Jennifer Beals",
      "Annabeth Gish"
    ]
  },
  {
    "q": "Which actor has NOT appeared in a Marvel Cinematic Universe film?",
    "a": "Ryan Reynolds",
    "wrong": [
      "Benedict Cumberbatch",
      "Scarlett Johansson",
      "Mark Ruffalo"
    ]
  },
  {
    "q": "What character did Gary Oldman play in The Fifth Element (1997)?",
    "a": "Zorg",
    "wrong": [
      "Korben Dallas",
      "Diva Plavalaguna",
      "Ruby Rhod"
    ]
  },
  {
    "q": "Which actor starred in both Saving Private Ryan (1998) and Catch Me If You Can (2002)?",
    "a": "Tom Hanks",
    "wrong": [
      "Steven Spielberg",
      "Leonardo DiCaprio",
      "Matt Damon"
    ]
  },
  {
    "q": "Who played Emily Thorne in the film adaptation of Emily (2023)?",
    "a": "Emma Stone",
    "wrong": [
      "Margot Robbie",
      "Timothée Chalamet",
      "This film does not exist"
    ]
  },
  {
    "q": "Which actor starred in both Inception (2010) and The Wolf of Wall Street (2013)?",
    "a": "Leonardo DiCaprio",
    "wrong": [
      "Joseph Gordon-Levitt",
      "Ellen Page",
      "Marion Cotillard"
    ]
  },
  {
    "q": "Who played Alan Turing in The Imitation Game (2014)?",
    "a": "Benedict Cumberbatch",
    "wrong": [
      "Eddie Redmayne",
      "Tom Hiddleston",
      "Andrew Garfield"
    ]
  },
  {
    "q": "What character did Heath Ledger play in The Dark Knight (2008)?",
    "a": "The Joker",
    "wrong": [
      "Two-Face",
      "Scarecrow",
      "Penguin"
    ]
  },
  {
    "q": "Which actor has NOT appeared in a Quentin Tarantino film?",
    "a": "Tom Hanks",
    "wrong": [
      "Samuel L. Jackson",
      "Uma Thurman",
      "Christoph Waltz"
    ]
  },
  {
    "q": "Who played Vivian Ward in Pretty Woman (1990)?",
    "a": "Julia Roberts",
    "wrong": [
      "Meg Ryan",
      "Sandra Bullock",
      "Winona Ryder"
    ]
  },
  {
    "q": "What character did Cate Blanchett play in Thor: Ragnarok (2017)?",
    "a": "Hela",
    "wrong": [
      "Loki",
      "Odin",
      "The Grandmaster"
    ]
  },
  {
    "q": "Who played Margaret Thatcher in The Iron Lady (2011)?",
    "a": "Meryl Streep",
    "wrong": [
      "Helen Mirren",
      "Judi Dench",
      "Emma Thompson"
    ]
  },
  {
    "q": "Which actor starred in both Forrest Gump (1994) and Cast Away (2000)?",
    "a": "Tom Hanks",
    "wrong": [
      "Gary Sinise",
      "Michael Clarke Duncan",
      "Sally Field"
    ]
  },
  {
    "q": "What character did Charlize Theron play in Mad Max: Fury Road (2015)?",
    "a": "Imperator Furiosa",
    "wrong": [
      "Angharad Yelp",
      "Capable",
      "The Dag"
    ]
  },
  {
    "q": "Who played Hannibal Lecter in The Silence of the Lambs (1991)?",
    "a": "Anthony Hopkins",
    "wrong": [
      "Scott Glenn",
      "Brian Cox",
      "Gérard Depardieu"
    ]
  },
  {
    "q": "Who played Molly Bloom in 'Molly's Game' (2017)?",
    "a": "Jessica Chastain",
    "wrong": [
      "Margot Robbie",
      "Saoirse Ronan",
      "Florence Pugh"
    ]
  },
  {
    "q": "Who played Preston Tucker in 'Tucker: The Man and His Dream' (1988)?",
    "a": "Jeff Bridges",
    "wrong": [
      "Tom Cruise",
      "Michael Douglas",
      "Harrison Ford"
    ]
  },
  {
    "q": "Which actor starred in both 'Brokeback Mountain' (2005) and 'Nightcrawler' (2014)?",
    "a": "Jake Gyllenhaal",
    "wrong": [
      "Ryan Gosling",
      "Andrew Garfield",
      "Michael Fassbender"
    ]
  },
  {
    "q": "What character did Cate Blanchett play in 'Elizabeth' (1998)?",
    "a": "Queen Elizabeth I",
    "wrong": [
      "Mary Queen of Scots",
      "Anne Boleyn",
      "Lady Jane Grey"
    ]
  },
  {
    "q": "Who played the Terminator in 'Terminator 2: Judgment Day' (1991)?",
    "a": "Arnold Schwarzenegger",
    "wrong": [
      "Sylvester Stallone",
      "Jean-Claude Van Damme",
      "Steven Seagal"
    ]
  },
  {
    "q": "Which actor has NOT appeared in a Christopher Nolan film?",
    "a": "Brad Pitt",
    "wrong": [
      "Christian Bale",
      "Robert Pattinson",
      "John David Washington"
    ]
  },
  {
    "q": "Who played Miranda Priestly in 'The Devil Wears Prada' (2006)?",
    "a": "Meryl Streep",
    "wrong": [
      "Tilda Swinton",
      "Helen Mirren",
      "Cate Blanchett"
    ]
  },
  {
    "q": "Which actor starred in both 'Se7en' (1995) and 'The Curious Case of Benjamin Button' (2008)?",
    "a": "Brad Pitt",
    "wrong": [
      "Morgan Freeman",
      "Johnny Depp",
      "Jude Law"
    ]
  },
  {
    "q": "What character did Heath Ledger play in 'Brokeback Mountain' (2005)?",
    "a": "Ennis Del Mar",
    "wrong": [
      "Jack Twist",
      "Alma Carruthers",
      "Lureen Newsome"
    ]
  },
  {
    "q": "Who played Erin Brockovich in 'Erin Brockovich' (2000)?",
    "a": "Julia Roberts",
    "wrong": [
      "Sandra Bullock",
      "Reese Witherspoon",
      "Cameron Diaz"
    ]
  },
  {
    "q": "Which actor has NOT appeared in a Martin Scorsese film?",
    "a": "Tom Hanks",
    "wrong": [
      "Robert De Niro",
      "Leonardo DiCaprio",
      "Ray Liotta"
    ]
  },
  {
    "q": "Who played Norman Osborn/Green Goblin in 'Spider-Man' (2002)?",
    "a": "Willem Dafoe",
    "wrong": [
      "Michael Keaton",
      "David Tennant",
      "Jason Isaacs"
    ]
  },
  {
    "q": "Which actor starred in both 'Inception' (2010) and 'The Wolf of Wall Street' (2013)?",
    "a": "Leonardo DiCaprio",
    "wrong": [
      "Tom Hardy",
      "Marion Cotillard",
      "Joseph Gordon-Levitt"
    ]
  },
  {
    "q": "What character did Toni Collette play in 'Hereditary' (2018)?",
    "a": "Annie Graham",
    "wrong": [
      "Joan Loring",
      "Paimon",
      "Ellen Leigh"
    ]
  },
  {
    "q": "Who played Jordan Belfort in 'The Wolf of Wall Street' (2013)?",
    "a": "Leonardo DiCaprio",
    "wrong": [
      "Christian Bale",
      "Mark Ruffalo",
      "Oscar Isaac"
    ]
  },
  {
    "q": "Which actor has NOT appeared in an Avengers film?",
    "a": "Daniel Day-Lewis",
    "wrong": [
      "Robert Downey Jr.",
      "Mark Ruffalo",
      "Scarlett Johansson"
    ]
  },
  {
    "q": "Who played Elwood Blues in 'The Blues Brothers' (1980)?",
    "a": "Dan Aykroyd",
    "wrong": [
      "Chevy Chase",
      "Gilda Radner",
      "John Belushi"
    ]
  },
  {
    "q": "Which actor starred in both 'Gladiator' (2000) and 'A Beautiful Mind' (2001)?",
    "a": "Russell Crowe",
    "wrong": [
      "Tom Hanks",
      "Sean Penn",
      "Denzel Washington"
    ]
  },
  {
    "q": "What character did Saoirse Ronan play in 'Lady Bird' (2017)?",
    "a": "Christine McPherson",
    "wrong": [
      "Marion McPherson",
      "Jenna Walton",
      "Kyle Scheible"
    ]
  },
  {
    "q": "Who played Rosemary Woodhouse in Roman Polanski's 'Rosemary's Baby' (1968)?",
    "a": "Mia Farrow",
    "wrong": [
      "Faye Dunaway",
      "Audrey Hepburn",
      "Jane Fonda"
    ]
  },
  {
    "q": "Which actor starred in both 'Blade Runner' (1982) and 'Blade Runner 2049' (2017)?",
    "a": "Harrison Ford",
    "wrong": [
      "Ryan Gosling",
      "Jared Leto",
      "Robin Wright"
    ]
  },
  {
    "q": "What character did Tom Hanks play in 'Forrest Gump' (1994)?",
    "a": "Forrest Gump",
    "wrong": [
      "Lieutenant Dan Taylor",
      "Bubba Blue",
      "President Kennedy"
    ]
  },
  {
    "q": "Who played Catherine Tramell in Paul Verhoeven's 'Basic Instinct' (1992)?",
    "a": "Sharon Stone",
    "wrong": [
      "Kathleen Turner",
      "Jennifer Tilly",
      "Linda Hamilton"
    ]
  },
  {
    "q": "Leonardo DiCaprio has NOT appeared in which of these films?",
    "a": "Brokeback Mountain",
    "wrong": [
      "The Revenant",
      "Inception",
      "The Wolf of Wall Street"
    ]
  },
  {
    "q": "Which actor starred in both 'The Usual Suspects' (1995) and 'American Beauty' (1999)?",
    "a": "Kevin Spacey",
    "wrong": [
      "Matt Damon",
      "Edward Norton",
      "Benicio Del Toro"
    ]
  },
  {
    "q": "What character did Viola Davis play in 'Fences' (2016)?",
    "a": "Rose Maxson",
    "wrong": [
      "Cory's girlfriend",
      "Raynell Maxson",
      "Lyons' wife"
    ]
  },
  {
    "q": "Who played Clarice Starling in 'The Silence of the Lambs' (1991)?",
    "a": "Jodie Foster",
    "wrong": [
      "Michelle Pfeiffer",
      "Meryl Streep",
      "Glenn Close"
    ]
  },
  {
    "q": "Denzel Washington has NOT appeared in which of these films?",
    "a": "Crash",
    "wrong": [
      "Training Day",
      "Malcolm X",
      "Man on Fire"
    ]
  },
  {
    "q": "Which actor starred in both 'Jaws' (1975) and 'The Color Purple' (1985)?",
    "a": "Richard Dreyfuss",
    "wrong": [
      "Roy Scheider",
      "Robert Shaw",
      "Quint"
    ]
  },
  {
    "q": "What character did Lupita Nyong'o play in 'Black Panther' (2018)?",
    "a": "Nakia",
    "wrong": [
      "Ramonda",
      "Okoye",
      "Ayo"
    ]
  },
  {
    "q": "Who played Patrick Bateman in 'American Psycho' (2000)?",
    "a": "Christian Bale",
    "wrong": [
      "Ryan Gosling",
      "Brad Pitt",
      "Tom Cruise"
    ]
  },
  {
    "q": "Meryl Streep has NOT appeared in which of these films?",
    "a": "Crimson Tide",
    "wrong": [
      "Kramer vs. Kramer",
      "Sophie's Choice",
      "The Iron Lady"
    ]
  },
  {
    "q": "Which actor starred in both 'Pulp Fiction' (1994) and 'Jackie Brown' (1997)?",
    "a": "Samuel L. Jackson",
    "wrong": [
      "John Travolta",
      "Bruce Willis",
      "Harvey Keitel"
    ]
  },
  {
    "q": "What character did Timothée Chalamet play in 'Call Me By Your Name' (2017)?",
    "a": "Elio Perlman",
    "wrong": [
      "Oliver",
      "Mr. Perlman",
      "Marzia"
    ]
  },
  {
    "q": "Tom Hardy has NOT appeared in which of these films?",
    "a": "The Dark Knight Rises",
    "wrong": [
      "Inception",
      "Mad Max: Fury Road",
      "Venom"
    ]
  },
  {
    "q": "Which actress starred in both 'Thelma & Louise' (1991) and 'A League of Their Own' (1992)?",
    "a": "Geena Davis",
    "wrong": [
      "Susan Sarandon",
      "Brad Pitt",
      "Madonna"
    ]
  },
  {
    "q": "What character did Oscar Isaac play in 'Ex Machina' (2015)?",
    "a": "Nathan",
    "wrong": [
      "Caleb",
      "Ava",
      "Jason"
    ]
  },
  {
    "q": "Who played Andy Dufresne in 'The Shawshank Redemption' (1994)?",
    "a": "Tim Robbins",
    "wrong": [
      "Morgan Freeman",
      "Bob Gunton",
      "James Whitmore"
    ]
  },
  {
    "q": "Who played Daisy Buchanan in The Great Gatsby (2013)?",
    "a": "Carey Mulligan",
    "wrong": [
      "Keira Knightley",
      "Marion Cotillard",
      "Saoirse Ronan"
    ]
  },
  {
    "q": "Who played the lead role of Andy Dufresne in The Shawshank Redemption (1994)?",
    "a": "Tim Robbins",
    "wrong": [
      "Tom Hanks",
      "Kevin Spacey",
      "Brad Pitt"
    ]
  },
  {
    "q": "Who played Barbie in Barbie (2023)?",
    "a": "Margot Robbie",
    "wrong": [
      "Ariana Grande",
      "Timothée Chalamet",
      "Ryan Gosling"
    ]
  },
  {
    "q": "What character did Oscar Isaac play in Ex Machina (2014)?",
    "a": "Nathan Bateman",
    "wrong": [
      "Caleb Smith",
      "Ava",
      "The Gym Instructor"
    ]
  },
  {
    "q": "Which actor appeared in both Gladiator (2000) and American Gangster (2007)?",
    "a": "Denzel Washington",
    "wrong": [
      "Russell Crowe",
      "Ridley Scott",
      "Jared Leto"
    ]
  },
  {
    "q": "Who played the Joker in Suicide Squad (2016)?",
    "a": "Jared Leto",
    "wrong": [
      "Jack Nicholson",
      "Joaquin Phoenix",
      "Ezra Miller"
    ]
  },
  {
    "q": "Brad Pitt has NOT appeared in which of these films?",
    "a": "The Wolf of Wall Street",
    "wrong": [
      "Se7en",
      "Troy",
      "Babylon"
    ]
  },
  {
    "q": "Who played Christine Collins in Changeling (2008)?",
    "a": "Angelina Jolie",
    "wrong": [
      "Sandra Bullock",
      "Cate Blanchett",
      "Kate Winslet"
    ]
  },
  {
    "q": "What character did Gary Oldman play in The Dark Knight Trilogy?",
    "a": "Commissioner Gordon",
    "wrong": [
      "Scarecrow",
      "Two-Face",
      "The Penguin"
    ]
  },
  {
    "q": "Which actor starred in both Requiem for a Dream (2000) and Black Swan (2010)?",
    "a": "Natalie Portman",
    "wrong": [
      "Ellen Page",
      "Mila Kunis",
      "Jennifer Connelly"
    ]
  },
  {
    "q": "What character did Viola Davis play in Fences (2016)?",
    "a": "Rose Maxson",
    "wrong": [
      "Lyons' Wife",
      "Helen",
      "Mrs. Henderson"
    ]
  },
  {
    "q": "Which actor appeared in both The Matrix (1999) and John Wick (2014)?",
    "a": "Keanu Reeves",
    "wrong": [
      "Hugo Weaving",
      "Laurence Fishburne",
      "Carrie-Anne Moss"
    ]
  },
  {
    "q": "Who played Tony Stark's ex-girlfriend Pepper Potts in the MCU films?",
    "a": "Gwyneth Paltrow",
    "wrong": [
      "Scarlett Johansson",
      "Elizabeth Olsen",
      "Zoe Saldana"
    ]
  },
  {
    "q": "Robert Downey Jr. has NOT appeared in which of these films?",
    "a": "The Avengers: Endgame (as the main role)",
    "wrong": [
      "Iron Man",
      "Captain America: Civil War",
      "Tropic Thunder"
    ]
  },
  {
    "q": "Who played Elle Woods in Legally Blonde (2001)?",
    "a": "Reese Witherspoon",
    "wrong": [
      "Jessica Simpson",
      "Paris Hilton",
      "Britney Spears"
    ]
  },
  {
    "q": "Which actor starred in both Moonlight (2016) and Aquaman (2018)?",
    "a": "Jason Momoa",
    "wrong": [
      "Mahershala Ali",
      "Trevante Rhodes",
      "Ashton Sanders"
    ]
  },
  {
    "q": "Who played Bridget von Hammersmark in Inglourious Basterds (2009)?",
    "a": "Diane Kruger",
    "wrong": [
      "Christoph Waltz",
      "Michael Fassbender",
      "Eli Roth"
    ]
  },
  {
    "q": "Which actor starred in both The Matrix (1999) and Speed (1994)?",
    "a": "Keanu Reeves",
    "wrong": [
      "Tom Cruise",
      "Brad Pitt",
      "Jean-Claude Van Damme"
    ]
  },
  {
    "q": "What character did Meryl Streep play in The Iron Lady (2011)?",
    "a": "Margaret Thatcher",
    "wrong": [
      "Queen Elizabeth II",
      "Indira Gandhi",
      "Jacqueline Kennedy"
    ]
  },
  {
    "q": "Daniel Day-Lewis has NOT appeared in which of these films?",
    "a": "Brokeback Mountain",
    "wrong": [
      "There Will Be Blood",
      "Lincoln",
      "Phantom Thread"
    ]
  },
  {
    "q": "Who played Roy Hobbs in The Natural (1984)?",
    "a": "Robert Redford",
    "wrong": [
      "Harrison Ford",
      "Richard Gere",
      "Jeff Bridges"
    ]
  },
  {
    "q": "Which actor starred in both Parasite (2019) and Okja (2017)?",
    "a": "Tilda Swinton",
    "wrong": [
      "Song Kang-ho",
      "Lee Sun-kyun",
      "Bong Joon-ho"
    ]
  },
  {
    "q": "Kate Winslet has NOT appeared in which of these films?",
    "a": "Inception",
    "wrong": [
      "The Reader",
      "Revolutionary Road",
      "The Holiday"
    ]
  },
  {
    "q": "Which actor starred in both Gladiator (2000) and Man of Steel (2013)?",
    "a": "Russell Crowe",
    "wrong": [
      "Henry Cavill",
      "Christian Bale",
      "Guy Pearce"
    ]
  },
  {
    "q": "Who played Erin Brockovich in Erin Brockovich (2000)?",
    "a": "Julia Roberts",
    "wrong": [
      "Sandra Bullock",
      "Catherine Zeta-Jones",
      "Charlize Theron"
    ]
  },
  {
    "q": "Which actor starred in both Jaws (1975) and Sleepy Hollow (1999)?",
    "a": "Johnny Depp",
    "wrong": [
      "Roy Scheider",
      "Richard Dreyfuss",
      "Robert Shaw"
    ]
  },
  {
    "q": "Who played Annie Wilkes in Misery (1990)?",
    "a": "Kathy Bates",
    "wrong": [
      "Jessica Lange",
      "Bette Davis",
      "Joan Crawford"
    ]
  },
  {
    "q": "Tom Hanks has NOT appeared in which of these films?",
    "a": "Rain Man",
    "wrong": [
      "Forrest Gump",
      "Cast Away",
      "The Green Mile"
    ]
  },
  {
    "q": "Who played Norman Osborn/Green Goblin in Spider-Man (2002)?",
    "a": "Willem Dafoe",
    "wrong": [
      "Alfred Molina",
      "Thomas Haden Church",
      "Dane DeHaan"
    ]
  },
  {
    "q": "Which actor starred in both The Sixth Sense (1999) and The Visit (2015)?",
    "a": "M. Night Shyamalan",
    "wrong": [
      "Bruce Willis",
      "Haley Joel Osment",
      "Olivia DeJonge"
    ]
  },
  {
    "q": "What character did Cate Blanchett play in Blue Jasmine (2013)?",
    "a": "Jasmine French",
    "wrong": [
      "Ginger",
      "Sally",
      "Louise"
    ]
  },
  {
    "q": "Who played the lead character Miles Dyson in Terminator 2: Judgment Day?",
    "a": "Joe Morton",
    "wrong": [
      "Michael Biehn",
      "Lance Henriksen",
      "Earl Boen"
    ]
  },
  {
    "q": "Who played Frank Slade in Scent of a Woman (1992)?",
    "a": "Al Pacino",
    "wrong": [
      "Jack Nicholson",
      "Gene Hackman",
      "Morgan Freeman"
    ]
  },
  {
    "q": "Which actor starred in both The Sixth Sense (1999) and Unbreakable (2000)?",
    "a": "Bruce Willis",
    "wrong": [
      "Haley Joel Osment",
      "James McAvoy",
      "Samuel L. Jackson"
    ]
  },
  {
    "q": "What character did Johnny Depp play in Sleepy Hollow (1999)?",
    "a": "Ichabod Crane",
    "wrong": [
      "The Headless Horseman",
      "Baltus Van Tassel",
      "Katrina Van Tassel"
    ]
  },
  {
    "q": "Who played Rosemary Woodhouse in Rosemary's Baby (1968)?",
    "a": "Mia Farrow",
    "wrong": [
      "Faye Dunaway",
      "Catherine Deneuve",
      "Ann-Margret"
    ]
  },
  {
    "q": "Which actor starred in both Se7en (1995) and Fight Club (1999)?",
    "a": "Brad Pitt",
    "wrong": [
      "Christian Bale",
      "Edward Norton",
      "Mark Wahlberg"
    ]
  },
  {
    "q": "What character did Heath Ledger play in Brokeback Mountain (2005)?",
    "a": "Ennis Del Mar",
    "wrong": [
      "Jack Twist",
      "Lureen Newsome",
      "Jack Senior"
    ]
  },
  {
    "q": "Humphrey Bogart has NOT appeared in which of these films?",
    "a": "Sunset Boulevard",
    "wrong": [
      "Casablanca",
      "The Big Sleep",
      "The Maltese Falcon"
    ]
  },
  {
    "q": "Which actress starred in both Black Swan (2010) and Jackie (2016)?",
    "a": "Natalie Portman",
    "wrong": [
      "Scarlett Johansson",
      "Marion Cotillard",
      "Kirsten Dunst"
    ]
  },
  {
    "q": "What character did Laurence Fishburne play in The Matrix (1999)?",
    "a": "Morpheus",
    "wrong": [
      "Agent Smith",
      "Neo",
      "Cypher"
    ]
  },
  {
    "q": "Who played Veruca Salt in Charlie and the Chocolate Factory (2005)?",
    "a": "Julia Winter",
    "wrong": [
      "Abigail Breslin",
      "Emma Watson",
      "AnnaSophia Robb"
    ]
  },
  {
    "q": "Gene Hackman has NOT appeared in which of these films?",
    "a": "Jaws",
    "wrong": [
      "The French Connection",
      "Unforgiven",
      "Superman"
    ]
  },
  {
    "q": "Which actor starred in both The Truman Show (1998) and Eternal Sunshine of the Spotless Mind (2004)?",
    "a": "Jim Carrey",
    "wrong": [
      "Tom Hanks",
      "Tom Cruise",
      "Will Smith"
    ]
  },
  {
    "q": "What character did Toni Collette play in Hereditary (2018)?",
    "a": "Annie Graham",
    "wrong": [
      "Peter Graham",
      "Charlie Graham",
      "Ellen Taper Structures"
    ]
  },
  {
    "q": "Who played Norma Desmond in Sunset Boulevard (1950)?",
    "a": "Gloria Swanson",
    "wrong": [
      "Bette Davis",
      "Joan Crawford",
      "Greta Garbo"
    ]
  },
  {
    "q": "Who played Ava Gardner's character's rival in 'The Barefoot Contessa' (1954)?",
    "a": "Marius Goring",
    "wrong": [
      "Oskar Werner",
      "James Mason",
      "Humphrey Bogart"
    ]
  },
  {
    "q": "Which actor starred in both 'Jaws' (1975) and 'The Sting' (1973)?",
    "a": "Robert Shaw",
    "wrong": [
      "Joel Grey",
      "Robert Redford",
      "Roy Scheider"
    ]
  },
  {
    "q": "Who played the titular character in 'Barbarella' (1968)?",
    "a": "Jane Fonda",
    "wrong": [
      "Raquel Welch",
      "Julie Christie",
      "Faye Dunaway"
    ]
  },
  {
    "q": "Geoffrey Rush has NOT appeared in which of these films?",
    "a": "The Social Network",
    "wrong": [
      "The Best Exotic Marigold Hotel",
      "The King's Speech",
      "Pirates of the Caribbean: The Curse of the Black Pearl"
    ]
  },
  {
    "q": "What character did Al Pacino play in 'Scarface' (1983)?",
    "a": "Tony Montana",
    "wrong": [
      "Manny Ribera",
      "Sosa",
      "Frank Lopez"
    ]
  },
  {
    "q": "Which actress starred in both 'Breakfast at Tiffany's' (1961) and 'Wait Until Dark' (1967)?",
    "a": "Audrey Hepburn",
    "wrong": [
      "Mia Farrow",
      "Shirley MacLaine",
      "Julie Andrews"
    ]
  },
  {
    "q": "Who played Dr. Ellie Sattler in 'Jurassic Park' (1993)?",
    "a": "Laura Dern",
    "wrong": [
      "Sigourney Weaver",
      "Geena Davis",
      "Michelle Pfeiffer"
    ]
  },
  {
    "q": "What character did Tom Hardy portray in 'The Dark Knight Rises' (2012)?",
    "a": "Bane",
    "wrong": [
      "The Scarecrow",
      "Two-Face",
      "The Riddler"
    ]
  },
  {
    "q": "Who played Catherine Trammell in 'Basic Instinct' (1992)?",
    "a": "Sharon Stone",
    "wrong": [
      "Kim Basinger",
      "Madonna",
      "Jennifer Beals"
    ]
  },
  {
    "q": "What character did Daniel Day-Lewis play in 'There Will Be Blood' (2007)?",
    "a": "Daniel Plainview",
    "wrong": [
      "H.W. Plainview",
      "Eli Sunday",
      "Fletcher Hamilton"
    ]
  },
  {
    "q": "Which actor starred in both 'The French Connection' (1971) and 'Cruising' (1980)?",
    "a": "Al Pacino",
    "wrong": [
      "Gene Hackman",
      "Roy Scheider",
      "Willem Dafoe"
    ]
  },
  {
    "q": "Who played Vivian Ward in 'Pretty Woman' (1990)?",
    "a": "Julia Roberts",
    "wrong": [
      "Michelle Pfeiffer",
      "Meg Ryan",
      "Sandra Bullock"
    ]
  },
  {
    "q": "What character did Kate Winslet play in 'The Reader' (2008)?",
    "a": "Hanna Schmitz",
    "wrong": [
      "Rose DeWitt Bukater",
      "Sarah Pierce",
      "Clementine Kruczynski"
    ]
  },
  {
    "q": "Christopher Walken has NOT appeared in which of these films?",
    "a": "Blade Runner 2049",
    "wrong": [
      "Hairspray",
      "Sleepy Hollow",
      "The Deer Hunter"
    ]
  },
  {
    "q": "Which actress starred in both 'Mulholland Drive' (2001) and 'Nacho Libre' (2006)?",
    "a": "Camilla Belle",
    "wrong": [
      "Laura Elena Harring",
      "Naomi Watts",
      "Ann-Margret"
    ]
  },
  {
    "q": "Who played Nurse Ratched in 'One Flew Over the Cuckoo's Nest' (1975)?",
    "a": "Louise Fletcher",
    "wrong": [
      "Geraldine Page",
      "Ellen Burstyn",
      "Faye Dunaway"
    ]
  },
  {
    "q": "What character did Oscar Isaac play in 'Ex Machina' (2014)?",
    "a": "Nathan Bateman",
    "wrong": [
      "Caleb Smith",
      "Ava",
      "Jason"
    ]
  },
  {
    "q": "Who played the lead role of Aldo Gucci in Ridley Scott's 2021 film 'House of Gucci'?",
    "a": "Adam Driver",
    "wrong": [
      "Oscar Isaac",
      "Timothée Chalamet",
      "Jake Gyllenhaal"
    ]
  },
  {
    "q": "Which actress played Barbie in Greta Gerwig's 2023 'Barbie' film?",
    "a": "Margot Robbie",
    "wrong": [
      "Saoirse Ronan",
      "Florence Pugh",
      "Emma Stone"
    ]
  },
  {
    "q": "Which actor starred in both 'The Matrix' (1999) and 'John Wick' (2014)?",
    "a": "Keanu Reeves",
    "wrong": [
      "Tom Hardy",
      "Michael B. Jordan",
      "Oscar Isaac"
    ]
  },
  {
    "q": "Who played Walter White in the TV series 'Breaking Bad'?",
    "a": "Bryan Cranston",
    "wrong": [
      "Aaron Paul",
      "Dean Norris",
      "Giancarlo Esposito"
    ]
  },
  {
    "q": "Which actress starred in both 'Black Widow' (2021) and 'Marriage Story' (2019)?",
    "a": "Scarlett Johansson",
    "wrong": [
      "Jessica Chastain",
      "Brie Larson",
      "Zendaya"
    ]
  },
  {
    "q": "What role did Christoph Waltz play in 'Inglourious Basterds' (2009)?",
    "a": "Colonel Hans Landa",
    "wrong": [
      "General Mechthild von Falkenhayn",
      "Adolf Hitler",
      "Lt. Archie Hicox"
    ]
  },
  {
    "q": "Which actor starred in both 'Gladiator' (2000) and 'American Beauty' (1999)?",
    "a": "Kevin Spacey",
    "wrong": [
      "Russell Crowe",
      "Tom Cruise",
      "Brad Pitt"
    ]
  },
  {
    "q": "Who played Harley Quinn in 'Birds of Prey' (2020)?",
    "a": "Margot Robbie",
    "wrong": [
      "Charlize Theron",
      "Cate Blanchett",
      "Tilda Swinton"
    ]
  },
  {
    "q": "What character did Jack Nicholson play in 'One Flew Over the Cuckoo's Nest' (1975)?",
    "a": "Randle McMurphy",
    "wrong": [
      "Chief Bromden",
      "Nurse Ratched",
      "Billy Bibbit"
    ]
  },
  {
    "q": "Which actor starred in both 'Pulp Fiction' (1994) and 'Django Unchained' (2012)?",
    "a": "Samuel L. Jackson",
    "wrong": [
      "John Travolta",
      "Uma Thurman",
      "Leonardo DiCaprio"
    ]
  },
  {
    "q": "Who played Jordan Belfort in Martin Scorsese's 'The Wolf of Wall Street' (2013)?",
    "a": "Leonardo DiCaprio",
    "wrong": [
      "Matthew McConaughey",
      "Christian Bale",
      "Tom Hardy"
    ]
  },
  {
    "q": "Which actress starred in both 'La La Land' (2016) and 'Poor Things' (2023)?",
    "a": "Emma Stone",
    "wrong": [
      "Ryan Gosling",
      "Margot Robbie",
      "Saoirse Ronan"
    ]
  },
  {
    "q": "Who played Perry White in Tim Burton's 'Batman Returns' (1992)?",
    "a": "Christopher Walken",
    "wrong": [
      "Michael Keaton",
      "Danny DeVito",
      "Michelle Pfeiffer"
    ]
  },
  {
    "q": "Bradley Cooper has NOT appeared in which of these films?",
    "a": "Avatar: The Way of Water",
    "wrong": [
      "American Sniper",
      "A Star is Born",
      "American Hustle"
    ]
  },
  {
    "q": "Which actor starred in both 'The Shawshank Redemption' (1994) and 'The Green Mile' (1999)?",
    "a": "David Morse",
    "wrong": [
      "Tim Robbins",
      "Tom Hanks",
      "Michael Clarke Duncan"
    ]
  }
];
