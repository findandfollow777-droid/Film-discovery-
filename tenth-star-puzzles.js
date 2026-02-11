// ============================================
// TENTH STAR - Puzzle Data
// Orbit Games Suite
// ============================================

const TENTH_STAR_PUZZLES = [
  // ==========================================
  // PUZZLE 1: Top 10 Highest Grossing — 2000
  // Tenth Star: Gladiator
  // ==========================================
  {
    id: "ts-001",
    weekOf: "2026-02-09",
    category: { type: "annual", label: "Top 10 Highest Grossing", hidden: "2000" },
    tenthStar: {
      tmdbId: 98,
      title: "Gladiator",
      posterPath: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
      clues: [
        "This film has an exact runtime of 155 minutes and was rated R.",
        "Principal photography took place across three countries: Morocco, England, and Malta.",
        "The haunting score features vocals by Lisa Gerrard, best known for her work with the band Dead Can Dance.",
        "The screenplay went through multiple rewrites and still wasn't finished when filming began — several scenes were improvised on set.",
        "Tagline: 'The general who became a slave. The slave who became a gladiator. The gladiator who defied an empire.'",
        "The director's previous film was a sci-fi classic set in 2019 Los Angeles featuring replicants.",
        "This is the only historical epic set in ancient times in this Top 10.",
        "It won five Academy Awards including Best Picture and Best Actor.",
        "Its lead, a New Zealand-born actor, also stars in A Beautiful Mind the following year.",
        "Russell Crowe plays Maximus, a Roman general who fights for vengeance in the Colosseum."
      ]
    },
    tiles: [
      // TILE 1: How the Grinch Stole Christmas — Format B
      {
        tmdbId: 8871,
        title: "How the Grinch Stole Christmas",
        posterPath: "/1WZbbPApEivA421gCOluuzMMKCk.jpg",
        questions: [
          { format: "B", text: "The star of this comedy spent three hours daily in prosthetic makeup. He previously played a pet detective and a man living inside a reality TV show.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Based on a beloved children's book by Dr. Seuss, this live-action holiday film features a green furry creature who despises a joyful winter celebration.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 2: Cast Away — Format B
      {
        tmdbId: 8358,
        title: "Cast Away",
        posterPath: "/7lLJgKnAicAcR5UEuo8xhSMj18w.jpg",
        questions: [
          { format: "B", text: "The lead actor gained 50 pounds for early scenes, then production paused for a year so he could lose it. He'd previously won an Oscar for playing a man of below-average intelligence who witnesses key moments in American history.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "In this survival drama, a FedEx employee is stranded alone on a deserted island for four years, with a volleyball as his only companion.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 3: Mission: Impossible II — Format A
      {
        tmdbId: 955,
        title: "Mission: Impossible II",
        posterPath: "/hfnrual76gPeNFduhD4xzHWpfTw.jpg",
        questions: [
          { format: "A", text: "Directed by Hong Kong action legend John Woo, this sequel features rubber mask disguises, a bioweapon called Chimera, and a climactic motorcycle duel on a cliff. Which film is it?", options: ["The Bourne Identity", "Mission: Impossible II", "Face/Off", "xXx"], correct: 1 },
          { format: "A", text: "The star of Top Gun returns as a secret agent in this action sequel set largely in Sydney, Australia, with slow-motion dove shots from its Hong Kong-born director. Which film?", options: ["Knight and Day", "Mission: Impossible II", "Jack Reacher", "Collateral"], correct: 1 }
        ]
      },
      // TILE 4: What Women Want — Format B
      {
        tmdbId: 3981,
        title: "What Women Want",
        posterPath: "/eqkBEMDk1316Yx5wVoabWY07JAi.jpg",
        questions: [
          { format: "B", text: "After an accident with a hair dryer in a bathtub, the protagonist of this romantic comedy discovers he can hear every thought that women around him are thinking. The lead previously starred as a Road Warrior and a lethal weapon-wielding cop.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "In this comedy, a chauvinistic advertising executive played by Mel Gibson gains the supernatural ability to hear women's thoughts, and uses it to outmaneuver his new female boss.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 5: The Perfect Storm — Format B
      {
        tmdbId: 2133,
        title: "The Perfect Storm",
        posterPath: "/vJPoxqgpfFNbGi0HyoNsjFeLCio.jpg",
        questions: [
          { format: "B", text: "Based on a true story, this disaster film follows the crew of a commercial swordfishing boat called the Andrea Gail, who sail into the convergence of three massive weather systems in the North Atlantic.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "The star of this film — an actor famous for playing Danny Ocean and a doctor on ER — captains a fishing vessel into a catastrophic storm off the coast of Gloucester, Massachusetts.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 6: Meet the Parents — Format A
      {
        tmdbId: 1597,
        title: "Meet the Parents",
        posterPath: "/5tXJ9ctuyEOMUFLaeqRisbXowWs.jpg",
        questions: [
          { format: "A", text: "A male nurse played by the star of Zoolander tries to impress his girlfriend's intimidating ex-CIA father, played by the star of Taxi Driver and Raging Bull. Everything goes catastrophically wrong. Which comedy is this?", options: ["Along Came Polly", "Meet the Parents", "There's Something About Mary", "Analyze This"], correct: 1 },
          { format: "A", text: "In this comedy, Ben Stiller's character accidentally sets fire to a gazebo, breaks a beloved cat's tail, and fails a lie detector test — all while trying to win over Robert De Niro as a potential father-in-law. Which film?", options: ["Duplex", "Meet the Parents", "The Heartbreak Kid", "Keeping the Faith"], correct: 1 }
        ]
      },
      // TILE 7: X-Men — Format B
      {
        tmdbId: 36657,
        title: "X-Men",
        posterPath: "/bRDAc4GogyS9ci3ow7UnInOcriN.jpg",
        questions: [
          { format: "B", text: "An unknown Australian stage actor was cast as the lead just weeks before filming began, playing a character with retractable metal claws, a healing factor, and no memory of his past. The film also stars two legendary Shakespearean actors as rival leaders of a mutant species.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "In this superhero film, Hugh Jackman debuts as Wolverine alongside Patrick Stewart and Ian McKellen, in a story about genetically gifted outcasts fighting for acceptance in a world that fears them.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 8: Scary Movie — Format A
      {
        tmdbId: 4247,
        title: "Scary Movie",
        posterPath: "/fVQFPRuw3yWXojYDJvA5EoFjUOY.jpg",
        questions: [
          { format: "A", text: "Written and directed by the Wayans brothers, this raunchy spoof ruthlessly parodies Scream, I Know What You Did Last Summer, and The Sixth Sense, featuring a ghostface killer and oblivious teenagers. Which film?", options: ["Scary Movie", "Not Another Teen Movie", "Shriek If You Know What I Did Last Friday the 13th", "Repossessed"], correct: 0 },
          { format: "A", text: "In this comedy, Anna Faris plays a dim-witted high school student terrorized by a masked killer in what became the highest-grossing parody film ever made. The Wayans brothers directed. Which film?", options: ["Date Movie", "Scary Movie", "Epic Movie", "A Haunted House"], correct: 1 }
        ]
      },
      // TILE 9: Dinosaur — Format B
      {
        tmdbId: 10567,
        title: "Dinosaur",
        posterPath: "/rSje3FS7ycJSglowlngjsvDt7vO.jpg",
        questions: [
          { format: "B", text: "This Disney animated film blends CGI creatures with live-action photographed backgrounds. The protagonist is an Iguanodon orphan raised by a family of lemurs on a remote island, who must lead a herd to safety after a catastrophic meteor shower.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "In this Walt Disney Pictures film, a dinosaur named Aladar — raised by lemurs — joins a massive herd migrating to their ancestral nesting grounds while being hunted by Carnotaurus predators.", options: ["True", "False"], correct: 0 }
        ]
      }
    ]
  },

  // ==========================================
  // PUZZLE 2: Top 10 Highest Grossing — 2008
  // Tenth Star: WALL-E
  // ==========================================
  {
    id: "ts-002",
    weekOf: "2026-02-23",
    category: { type: "annual", label: "Top 10 Highest Grossing", hidden: "2008" },
    tenthStar: {
      tmdbId: 10681,
      title: "WALL-E",
      posterPath: "/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
      clues: [
        "This animated film has a runtime of 98 minutes and was rated G.",
        "Sound designer Ben Burtt — famous for creating R2-D2's voice — designed all the vocal effects for the two lead characters.",
        "A cockroach named Hal is one of only two characters on screen for the film's largely dialogue-free first act.",
        "The film contains a hidden reference: the name of a corporation in the movie is an abbreviation that also spells out the initials of a real retail giant.",
        "Humans in this film are depicted as morbidly obese, floating on hover chairs, with screens constantly in front of their faces — a satirical vision of consumer culture.",
        "The director previously helmed an animated film about a clownfish searching for his lost son.",
        "This is the only animated film in this Top 10 that won Best Animated Feature at the Oscars.",
        "The story is set 700 years in the future on an Earth entirely buried in garbage, abandoned by humanity.",
        "The title character is a small, lonely trash-compacting robot who falls in love with a sleek white probe robot named EVE.",
        "This Pixar film follows a lovable robot left behind on a deserted Earth who discovers his purpose through love."
      ]
    },
    tiles: [
      // TILE 1: The Dark Knight — Format B
      {
        tmdbId: 155,
        title: "The Dark Knight",
        posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        questions: [
          { format: "B", text: "In this film, one of the lead actors tragically died during post-production and was posthumously awarded an Oscar for playing a chaotic, scar-faced criminal mastermind who asks 'Why so serious?' The film was shot largely in Chicago standing in for a fictional city.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Heath Ledger won a posthumous Academy Award for playing the Joker in this superhero sequel, where a billionaire vigilante in a cape must stop a terrorist clown from destroying Gotham City.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 2: Iron Man — Format A
      {
        tmdbId: 1726,
        title: "Iron Man",
        posterPath: "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
        questions: [
          { format: "A", text: "An actor once considered box-office poison — who'd previously served prison time — was cast as a genius billionaire weapons manufacturer who builds a powered suit of armor in a cave to escape captivity. This film launched a massive shared cinematic universe. Which film?", options: ["The Incredible Hulk", "Iron Man", "Batman Begins", "Watchmen"], correct: 1 },
          { format: "A", text: "Robert Downey Jr. stars as Tony Stark, a billionaire who builds a high-tech suit of armor after being captured by terrorists in Afghanistan. This film launched the Marvel Cinematic Universe. Which film?", options: ["Iron Man", "Captain America: The First Avenger", "Thor", "The Avengers"], correct: 0 }
        ]
      },
      // TILE 3: Indiana Jones and the Kingdom of the Crystal Skull — Format B
      {
        tmdbId: 217,
        title: "Indiana Jones and the Kingdom of the Crystal Skull",
        posterPath: "/56As6XEM1flWvprX4LgkPl8ii4K.jpg",
        questions: [
          { format: "B", text: "Set during the Cold War, this adventure sequel sees its aging archaeologist hero — played by the same actor who flew the Millennium Falcon — team up with a greaser played by Shia LaBeouf, while being pursued by Soviet agents led by Cate Blanchett. The plot involves alien skulls.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Harrison Ford returns as a whip-cracking archaeologist in this fourth installment of the franchise, set in the 1950s, involving psychic alien crystal skulls and a climax inside a Mayan temple.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 4: Hancock — Format B
      {
        tmdbId: 8960,
        title: "Hancock",
        posterPath: "/7DyuV2G0hLEqHeueDfOqhZ2DVut.jpg",
        questions: [
          { format: "B", text: "The Fresh Prince plays an alcoholic, reckless superhero who causes millions in property damage and is hated by the public. A PR consultant played by Jason Bateman tries to rehabilitate his image, but a twist reveals the consultant's wife has a secret connection to the hero.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Will Smith plays a homeless, foul-mouthed superhero in Los Angeles who reluctantly agrees to a public image makeover in this action comedy. A major twist reveals Charlize Theron's character is also a super-powered being.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 5: Mamma Mia! — Format B
      {
        tmdbId: 11631,
        title: "Mamma Mia!",
        posterPath: "/zdUA4FZbXPadzVOJiU0Rgn6cHR.jpg",
        questions: [
          { format: "B", text: "Set on a sun-drenched Greek island, this jukebox musical features an ensemble cast — including the star of The Devil Wears Prada, James Bond himself, and a former Dracula — all singing and dancing to songs by a Swedish pop group famous for 'Dancing Queen'.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Meryl Streep, Pierce Brosnan, and Colin Firth star in this musical set in Greece, where a bride invites three of her mother's ex-lovers to her wedding to figure out which one is her father. All the songs are by ABBA.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 6: Madagascar: Escape 2 Africa — Format A
      {
        tmdbId: 10527,
        title: "Madagascar: Escape 2 Africa",
        posterPath: "/agRbLOHgN46TQO4YdKR462iR7To.jpg",
        questions: [
          { format: "A", text: "In this animated DreamWorks sequel, a group of New York zoo animals — including a lion, zebra, hippo, and giraffe — crash-land on the African savanna. The lion reunites with his long-lost parents. Which film?", options: ["The Wild", "Madagascar: Escape 2 Africa", "The Lion King II", "Open Season 2"], correct: 1 },
          { format: "A", text: "Voiced by Ben Stiller, Chris Rock, Jada Pinkett Smith, and David Schwimmer, this sequel follows zoo animals who leave a certain island and crash-land in Africa, where the lion discovers his birth pride. Which film?", options: ["Madagascar: Escape 2 Africa", "Over the Hedge", "Surf's Up", "Ice Age: Dawn of the Dinosaurs"], correct: 0 }
        ]
      },
      // TILE 7: Kung Fu Panda — Format B
      {
        tmdbId: 9502,
        title: "Kung Fu Panda",
        posterPath: "/wWt4JYXTg5Wr3xBW2phBrMKgp3x.jpg",
        questions: [
          { format: "B", text: "The lead voice actor — famous for fronting the rock band Tenacious D and starring in School of Rock — voices a rotund, noodle-soup-loving animal who is unexpectedly chosen as the legendary Dragon Warrior, much to the dismay of the elite fighting team known as the Furious Five.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Jack Black voices a panda named Po who dreams of being a kung fu master. He's trained by a red panda named Shifu and must defeat an escaped snow leopard villain named Tai Lung.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 8: Quantum of Solace — Format B
      {
        tmdbId: 10764,
        title: "Quantum of Solace",
        posterPath: "/e3DXXLJHGqMx9yYpXsql1XNljmM.jpg",
        questions: [
          { format: "B", text: "This is the only Bond film that is a direct sequel to the previous entry, picking up just one hour after the last film ended. The blond British agent seeks revenge for the death of Vesper Lynd while uncovering a shadowy organization controlling the world's water supply.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Daniel Craig stars as James Bond in this direct sequel to Casino Royale, seeking vengeance for Vesper's betrayal. The villain, Dominic Greene, is manipulating a Bolivian coup to control water resources.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 9: Twilight — Format A
      {
        tmdbId: 8966,
        title: "Twilight",
        posterPath: "/3Gkb6jm6962ADUPaCBqzz9CTbn9.jpg",
        questions: [
          { format: "A", text: "Based on Stephenie Meyer's debut novel, a teenage girl moves to a rainy town in Washington state and falls in love with a pale, immortal classmate who sparkles in sunlight. His family are 'vegetarian' vampires who only drink animal blood. Which film?", options: ["Twilight", "Warm Bodies", "Beautiful Creatures", "The Mortal Instruments: City of Bones"], correct: 0 },
          { format: "A", text: "Kristen Stewart and Robert Pattinson star as a human-vampire couple in the rainy town of Forks, Washington. The film spawned four sequels and a massive fan phenomenon. Which film?", options: ["Underworld", "Twilight", "Let Me In", "Vampire Academy"], correct: 1 }
        ]
      }
    ]
  },

  // ==========================================
  // PUZZLE 3: Top 10 Highest Grossing — 2015
  // Tenth Star: Inside Out
  // ==========================================
  {
    id: "ts-003",
    weekOf: "2026-03-02",
    category: { type: "annual", label: "Top 10 Highest Grossing", hidden: "2015" },
    tenthStar: {
      tmdbId: 150540,
      title: "Inside Out",
      posterPath: "/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg",
      clues: [
        "This animated film was in development for over five years, with the story rebooted multiple times before the director was satisfied.",
        "The production team consulted with psychologists and neuroscientists at UC Berkeley to ensure the film's central concept was grounded in real research.",
        "One of the characters was originally written as a male before being changed to female during development, fundamentally altering the story's emotional arc.",
        "The film's concept was inspired by the director watching his own daughter grow from a happy child into a moody preteen and wondering what was happening inside her mind.",
        "A cotton-candy-colored elephant-cat-dolphin hybrid character was created specifically for this film and became one of Pixar's most beloved — and heartbreaking — supporting roles.",
        "The director's previous Pixar credits include co-writing a film about a monster duo who scare children for a living, and directing a film about an elderly man who ties balloons to his house.",
        "Five color-coded characters — one yellow, one blue, one red, one green, one purple — work together at a control console, each representing a different human emotion.",
        "An 11-year-old girl named Riley moves from Minnesota to San Francisco, and the upheaval triggers a crisis inside her mind.",
        "Joy and Sadness — voiced by Amy Poehler and Phyllis Smith — are the two central characters who get lost in long-term memory.",
        "This Pixar film takes place inside the mind of a child, where five personified emotions — Joy, Sadness, Anger, Fear, and Disgust — control her reactions from a headquarters."
      ]
    },
    tiles: [
      // TILE 1: Star Wars: The Force Awakens — Format B
      {
        tmdbId: 140607,
        title: "Star Wars: The Force Awakens",
        posterPath: "/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg",
        questions: [
          { format: "B", text: "Directed by the filmmaker behind the rebooted Star Trek films, this sci-fi blockbuster was the first installment of a beloved space saga in over a decade. It introduces a desert scavenger who discovers she has extraordinary powers, and features the return of a smuggler and his furry co-pilot.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Daisy Ridley stars as Rey, a scavenger on the desert planet Jakku, in this seventh chapter of the Star Wars saga. Harrison Ford returns as Han Solo alongside Chewbacca, and the villain is a masked warrior named Kylo Ren.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 2: Jurassic World — Format B
      {
        tmdbId: 135397,
        title: "Jurassic World",
        posterPath: "/rhr4y79GpxQF9IsfJItRXVaoGs4.jpg",
        questions: [
          { format: "B", text: "The star of Guardians of the Galaxy plays a rugged animal trainer who has a special bond with a pack of raptors at a fully operational theme park. When a genetically engineered hybrid dinosaur called the Indominus Rex escapes, the park descends into chaos.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Chris Pratt stars as a velociraptor trainer at a now-functioning dinosaur theme park — a sequel set 22 years after the original film — where a newly created genetic hybrid breaks free and goes on a rampage.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 3: Furious 7 — Format A
      {
        tmdbId: 168259,
        title: "Furious 7",
        posterPath: "/ktofZ9Htrjiy0P6LEowsDaxd3Ri.jpg",
        questions: [
          { format: "A", text: "One of the lead actors tragically died in a car crash during production, requiring his brothers to serve as stand-ins for remaining scenes. Jason Statham joins as the villain in this installment where the crew must fight a rogue special forces assassin. Which film in the franchise?", options: ["Fast Five", "Fast & Furious 6", "Furious 7", "The Fate of the Furious"], correct: 2 },
          { format: "A", text: "Paul Walker's final film in the franchise, this installment features cars parachuting out of a plane, a chase through Abu Dhabi skyscrapers, and ends with a touching farewell tribute as two cars diverge at a fork in the road. Which film?", options: ["Furious 7", "Fast Five", "Fast & Furious 6", "Fast X"], correct: 0 }
        ]
      },
      // TILE 4: Avengers: Age of Ultron — Format B
      {
        tmdbId: 99861,
        title: "Avengers: Age of Ultron",
        posterPath: "/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
        questions: [
          { format: "B", text: "In this Marvel sequel, the team's attempt to create a global peacekeeping AI goes catastrophically wrong when the program becomes sentient and decides humanity must go extinct. The villain is voiced by an actor famous for playing Red Reddington on TV and a serial killer in a Spielberg film.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "James Spader voices Ultron, a rogue AI villain, in this Avengers sequel that also introduces the characters of Scarlet Witch, Quicksilver, and Vision. The team battles Ultron's plan to drop a city from the sky.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 5: Minions — Format B
      {
        tmdbId: 211672,
        title: "Minions",
        posterPath: "/dr02BdCNAUPVU07aOodwPYv6HCf.jpg",
        questions: [
          { format: "B", text: "This animated prequel follows three small, yellow, pill-shaped creatures — named Kevin, Stuart, and Bob — from the dawn of time to 1960s London, where they seek a new evil master to serve. They end up working for a supervillain named Scarlet Overkill, voiced by Sandra Bullock.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "A prequel to the Despicable Me franchise, this film follows three Minions — Kevin, Stuart, and Bob — on a quest to find a new villainous leader, landing them in 1960s England at a villain convention.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 6: Spectre — Format A
      {
        tmdbId: 206647,
        title: "Spectre",
        posterPath: "/zj8ongFhtWNsVlfjOGo8pSr7PQg.jpg",
        questions: [
          { format: "A", text: "A cryptic message from the past leads the blond 007 to uncover a shadowy global organization led by Christoph Waltz. The film opens with a spectacular single-take sequence through a Day of the Dead parade in Mexico City. Which Bond film?", options: ["Skyfall", "Spectre", "Casino Royale", "No Time to Die"], correct: 1 },
          { format: "A", text: "Daniel Craig's fourth outing as James Bond pits him against Christoph Waltz as the head of a sinister organization called SPECTRE. The film reveals a personal connection between Bond and the villain. Which film?", options: ["Spectre", "Skyfall", "Quantum of Solace", "No Time to Die"], correct: 0 }
        ]
      },
      // TILE 7: The Hunger Games: Mockingjay - Part 2 — Format B
      {
        tmdbId: 131634,
        title: "The Hunger Games: Mockingjay - Part 2",
        posterPath: "/lImKHDfExAulp16grYm8zD5eONE.jpg",
        questions: [
          { format: "B", text: "In this dystopian franchise finale, the heroine — an archer who became the symbol of a revolution — leads a squad through a booby-trapped capital city to assassinate a tyrannical president played by Donald Sutherland. The actress won an Oscar the same year for a different film.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Jennifer Lawrence plays Katniss Everdeen in this final chapter, storming the Capitol with her squad to end President Snow's regime. The mission through trap-filled streets costs several beloved characters their lives.", options: ["True", "False"], correct: 0 }
        ]
      },
      // TILE 8: The Martian — Format A
      {
        tmdbId: 286217,
        title: "The Martian",
        posterPath: "/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg",
        questions: [
          { format: "A", text: "An actor famous for playing Jason Bourne plays an astronaut stranded alone on the Red Planet after his crew believes he's dead. He survives by growing potatoes in Martian soil fertilized with human waste, and communicates with NASA using a 1990s Mars rover. Which film?", options: ["Gravity", "Interstellar", "The Martian", "Ad Astra"], correct: 2 },
          { format: "A", text: "Matt Damon plays astronaut Mark Watney, stranded on Mars after a storm. He 'sciences the s*** out of' his survival — growing potatoes, jury-rigging communication — while NASA races to bring him home. Directed by Ridley Scott. Which film?", options: ["The Martian", "Passengers", "Life", "Gravity"], correct: 0 }
        ]
      },
      // TILE 9: Mission: Impossible - Rogue Nation — Format B
      {
        tmdbId: 177677,
        title: "Mission: Impossible - Rogue Nation",
        posterPath: "/fRJLXQBHK2wyznK5yZbO7vmsuVK.jpg",
        questions: [
          { format: "B", text: "The lead actor — famous for doing his own stunts — actually clung to the side of a military transport plane during takeoff for real. The film's villain leads a rogue intelligence network called The Syndicate, and a key sequence involves an assassination attempt at a Vienna opera house.", options: ["True", "False"], correct: 0 },
          { format: "B", text: "Tom Cruise hangs off the side of an Airbus A400M during takeoff in this spy thriller, where Ethan Hunt must prove the existence of a shadowy anti-IMF organization called The Syndicate, led by Solomon Lane.", options: ["True", "False"], correct: 0 }
        ]
      }
    ]
  }
];
