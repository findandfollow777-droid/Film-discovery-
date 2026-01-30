// ============================================
// MASTERMIND - Game Logic
// Orbit Games Suite - 60s Trivia Blitz
// ============================================

// Game configuration
const GAME_DURATION = 60; // seconds
const POINTS_CORRECT = 10;
const POINTS_WRONG = -5;
const COUNTDOWN_SECONDS = 3;

// Topic configurations
const TOPICS = {
  directors: { icon: "\u{1F3AC}", name: "Directors" },
  oscars: { icon: "\u{1F3C6}", name: "Oscar Winners" },
  quotes: { icon: "\u{1F4AC}", name: "Movie Quotes" },
  years: { icon: "\u{1F4C5}", name: "Release Years" },
  actors: { icon: "\u{1F3AD}", name: "Actor Roles" },
  taglines: { icon: "\u{1F4DD}", name: "Taglines" }
};

// Trivia questions by topic
const QUESTIONS = {
  directors: [
    { q: "Who directed 'The Dark Knight'?", a: "Christopher Nolan", wrong: ["Martin Scorsese", "David Fincher", "Steven Spielberg"] },
    { q: "Who directed 'Pulp Fiction'?", a: "Quentin Tarantino", wrong: ["Martin Scorsese", "Guy Ritchie", "Robert Rodriguez"] },
    { q: "Who directed 'Inception'?", a: "Christopher Nolan", wrong: ["Denis Villeneuve", "Ridley Scott", "James Cameron"] },
    { q: "Who directed 'The Godfather'?", a: "Francis Ford Coppola", wrong: ["Martin Scorsese", "Brian De Palma", "Sidney Lumet"] },
    { q: "Who directed 'Jaws'?", a: "Steven Spielberg", wrong: ["George Lucas", "Ridley Scott", "James Cameron"] },
    { q: "Who directed 'Fight Club'?", a: "David Fincher", wrong: ["Christopher Nolan", "Darren Aronofsky", "Paul Thomas Anderson"] },
    { q: "Who directed 'The Shining'?", a: "Stanley Kubrick", wrong: ["Alfred Hitchcock", "Roman Polanski", "John Carpenter"] },
    { q: "Who directed 'Schindler's List'?", a: "Steven Spielberg", wrong: ["Roman Polanski", "Stanley Kubrick", "Francis Ford Coppola"] },
    { q: "Who directed 'Interstellar'?", a: "Christopher Nolan", wrong: ["Denis Villeneuve", "Ridley Scott", "Alfonso Cuaron"] },
    { q: "Who directed 'The Matrix'?", a: "The Wachowskis", wrong: ["James Cameron", "Ridley Scott", "Steven Spielberg"] },
    { q: "Who directed 'Goodfellas'?", a: "Martin Scorsese", wrong: ["Francis Ford Coppola", "Brian De Palma", "Quentin Tarantino"] },
    { q: "Who directed 'Jurassic Park'?", a: "Steven Spielberg", wrong: ["James Cameron", "George Lucas", "Joe Johnston"] },
    { q: "Who directed 'Titanic'?", a: "James Cameron", wrong: ["Steven Spielberg", "Ridley Scott", "Ron Howard"] },
    { q: "Who directed 'Avatar'?", a: "James Cameron", wrong: ["Steven Spielberg", "Peter Jackson", "Ridley Scott"] },
    { q: "Who directed 'The Grand Budapest Hotel'?", a: "Wes Anderson", wrong: ["Noah Baumbach", "Sofia Coppola", "Paul Thomas Anderson"] },
    { q: "Who directed 'Psycho' (1960)?", a: "Alfred Hitchcock", wrong: ["Stanley Kubrick", "Billy Wilder", "Orson Welles"] },
    { q: "Who directed 'Blade Runner'?", a: "Ridley Scott", wrong: ["James Cameron", "Paul Verhoeven", "John Carpenter"] },
    { q: "Who directed 'E.T.'?", a: "Steven Spielberg", wrong: ["George Lucas", "Robert Zemeckis", "Joe Dante"] },
    { q: "Who directed 'Taxi Driver'?", a: "Martin Scorsese", wrong: ["Francis Ford Coppola", "Brian De Palma", "William Friedkin"] },
    { q: "Who directed 'Alien'?", a: "Ridley Scott", wrong: ["James Cameron", "John Carpenter", "David Cronenberg"] },
    { q: "Who directed 'The Silence of the Lambs'?", a: "Jonathan Demme", wrong: ["David Fincher", "Ridley Scott", "Michael Mann"] },
    { q: "Who directed '2001: A Space Odyssey'?", a: "Stanley Kubrick", wrong: ["Steven Spielberg", "Ridley Scott", "George Lucas"] },
    { q: "Who directed 'Apocalypse Now'?", a: "Francis Ford Coppola", wrong: ["Martin Scorsese", "Oliver Stone", "Stanley Kubrick"] },
    { q: "Who directed 'The Social Network'?", a: "David Fincher", wrong: ["Aaron Sorkin", "Danny Boyle", "Christopher Nolan"] },
    { q: "Who directed 'Kill Bill'?", a: "Quentin Tarantino", wrong: ["Robert Rodriguez", "Zack Snyder", "Guy Ritchie"] },
    { q: "Who directed 'Mad Max: Fury Road'?", a: "George Miller", wrong: ["Ridley Scott", "James Cameron", "Christopher Nolan"] },
    { q: "Who directed 'Get Out'?", a: "Jordan Peele", wrong: ["M. Night Shyamalan", "Ari Aster", "James Wan"] },
    { q: "Who directed 'Parasite'?", a: "Bong Joon-ho", wrong: ["Park Chan-wook", "Denis Villeneuve", "Hirokazu Kore-eda"] },
    { q: "Who directed 'The Departed'?", a: "Martin Scorsese", wrong: ["Christopher Nolan", "David Fincher", "Ridley Scott"] },
    { q: "Who directed 'Saving Private Ryan'?", a: "Steven Spielberg", wrong: ["Ridley Scott", "Oliver Stone", "Clint Eastwood"] },
    { q: "Who directed 'Forrest Gump'?", a: "Robert Zemeckis", wrong: ["Steven Spielberg", "Ron Howard", "Barry Levinson"] },
    { q: "Who directed 'The Revenant'?", a: "Alejandro G. Inarritu", wrong: ["Terrence Malick", "Denis Villeneuve", "Ridley Scott"] },
    { q: "Who directed 'Dunkirk'?", a: "Christopher Nolan", wrong: ["Steven Spielberg", "Ridley Scott", "Sam Mendes"] },
    { q: "Who directed 'La La Land'?", a: "Damien Chazelle", wrong: ["Wes Anderson", "Edgar Wright", "Greta Gerwig"] },
    { q: "Who directed 'Whiplash'?", a: "Damien Chazelle", wrong: ["David Fincher", "Darren Aronofsky", "Bennett Miller"] }
  ],
  oscars: [
    { q: "Which film won Best Picture in 2020?", a: "Parasite", wrong: ["1917", "Joker", "Once Upon a Time in Hollywood"] },
    { q: "Who won Best Actor for 'The Revenant'?", a: "Leonardo DiCaprio", wrong: ["Tom Hardy", "Will Smith", "Bryan Cranston"] },
    { q: "Which film won Best Picture in 1994?", a: "Forrest Gump", wrong: ["Pulp Fiction", "The Shawshank Redemption", "Quiz Show"] },
    { q: "Who won Best Actress for 'Black Swan'?", a: "Natalie Portman", wrong: ["Nicole Kidman", "Annette Bening", "Jennifer Lawrence"] },
    { q: "Which film won Best Picture in 2017?", a: "Moonlight", wrong: ["La La Land", "Manchester by the Sea", "Arrival"] },
    { q: "Who won Best Actor for 'Joker' (2019)?", a: "Joaquin Phoenix", wrong: ["Adam Driver", "Leonardo DiCaprio", "Antonio Banderas"] },
    { q: "Which film won Best Picture in 2010?", a: "The Hurt Locker", wrong: ["Avatar", "Inglourious Basterds", "Up in the Air"] },
    { q: "Who won Best Director for 'The Shape of Water'?", a: "Guillermo del Toro", wrong: ["Christopher Nolan", "Jordan Peele", "Denis Villeneuve"] },
    { q: "Which film won Best Picture in 2019?", a: "Green Book", wrong: ["Roma", "A Star Is Born", "Bohemian Rhapsody"] },
    { q: "Who won Best Actress for 'La La Land'?", a: "Emma Stone", wrong: ["Natalie Portman", "Isabelle Huppert", "Ruth Negga"] },
    { q: "Which film has won the most Oscars?", a: "Ben-Hur/Titanic/LOTR (11)", wrong: ["Gone with the Wind (8)", "West Side Story (10)", "Schindler's List (7)"] },
    { q: "Who won Best Actor for 'Bohemian Rhapsody'?", a: "Rami Malek", wrong: ["Christian Bale", "Bradley Cooper", "Viggo Mortensen"] },
    { q: "Which film won Best Picture in 2000?", a: "Gladiator", wrong: ["Crouching Tiger Hidden Dragon", "Traffic", "Erin Brockovich"] },
    { q: "Who won Best Actress for 'Monster'?", a: "Charlize Theron", wrong: ["Nicole Kidman", "Naomi Watts", "Diane Keaton"] },
    { q: "Which film won Best Picture in 2008?", a: "No Country for Old Men", wrong: ["There Will Be Blood", "Juno", "Atonement"] },
    { q: "Who won Best Actor for 'The Pianist'?", a: "Adrien Brody", wrong: ["Daniel Day-Lewis", "Jack Nicholson", "Nicolas Cage"] },
    { q: "Which film won Best Picture in 2004?", a: "Million Dollar Baby", wrong: ["The Aviator", "Sideways", "Ray"] },
    { q: "Who won Best Actress for 'The Iron Lady'?", a: "Meryl Streep", wrong: ["Viola Davis", "Michelle Williams", "Glenn Close"] },
    { q: "Which film won Best Picture in 2012?", a: "The Artist", wrong: ["The Descendants", "Hugo", "Midnight in Paris"] },
    { q: "Who won Best Actor for 'Lincoln'?", a: "Daniel Day-Lewis", wrong: ["Denzel Washington", "Hugh Jackman", "Bradley Cooper"] },
    { q: "Which film won Best Picture in 2015?", a: "Birdman", wrong: ["Boyhood", "The Grand Budapest Hotel", "Whiplash"] },
    { q: "Who won Best Actress for 'Blue Jasmine'?", a: "Cate Blanchett", wrong: ["Amy Adams", "Meryl Streep", "Sandra Bullock"] },
    { q: "Which film won Best Picture in 2016?", a: "Spotlight", wrong: ["The Revenant", "The Big Short", "Mad Max: Fury Road"] },
    { q: "Who won Best Actor for 'There Will Be Blood'?", a: "Daniel Day-Lewis", wrong: ["George Clooney", "Johnny Depp", "Viggo Mortensen"] },
    { q: "Which film won Best Picture in 2018?", a: "The Shape of Water", wrong: ["Three Billboards", "Get Out", "Lady Bird"] },
    { q: "Who won Best Supporting Actor for 'The Dark Knight'?", a: "Heath Ledger", wrong: ["Josh Brolin", "Robert Downey Jr.", "Philip Seymour Hoffman"] },
    { q: "Which film won Best Picture in 2022?", a: "CODA", wrong: ["The Power of the Dog", "Belfast", "West Side Story"] },
    { q: "Who won Best Actress for 'Silver Linings Playbook'?", a: "Jennifer Lawrence", wrong: ["Jessica Chastain", "Naomi Watts", "Emmanuelle Riva"] },
    { q: "Which film won Best Picture in 2014?", a: "12 Years a Slave", wrong: ["Gravity", "American Hustle", "The Wolf of Wall Street"] },
    { q: "Who won Best Director for 'Gravity'?", a: "Alfonso Cuaron", wrong: ["Steve McQueen", "David O. Russell", "Alexander Payne"] },
    { q: "Which animated film won Best Picture?", a: "None (never happened)", wrong: ["Toy Story 3", "Up", "WALL-E"] },
    { q: "Who won Best Actor for 'My Left Foot'?", a: "Daniel Day-Lewis", wrong: ["Tom Cruise", "Morgan Freeman", "Robin Williams"] },
    { q: "Which film won Best Picture in 1998?", a: "Titanic", wrong: ["Good Will Hunting", "L.A. Confidential", "As Good as It Gets"] },
    { q: "Who won Best Actress for 'Erin Brockovich'?", a: "Julia Roberts", wrong: ["Ellen Burstyn", "Joan Allen", "Juliette Binoche"] },
    { q: "Which film won Best Picture in 2002?", a: "A Beautiful Mind", wrong: ["The Lord of the Rings: Fellowship", "Moulin Rouge!", "In the Bedroom"] }
  ],
  quotes: [
    { q: "\"Here's looking at you, kid.\"", a: "Casablanca", wrong: ["Gone with the Wind", "The Maltese Falcon", "Citizen Kane"] },
    { q: "\"I'll be back.\"", a: "The Terminator", wrong: ["Predator", "Total Recall", "Commando"] },
    { q: "\"May the Force be with you.\"", a: "Star Wars", wrong: ["Star Trek", "Guardians of the Galaxy", "Interstellar"] },
    { q: "\"You talking to me?\"", a: "Taxi Driver", wrong: ["Goodfellas", "Raging Bull", "The Godfather"] },
    { q: "\"I see dead people.\"", a: "The Sixth Sense", wrong: ["The Others", "Ghost", "Poltergeist"] },
    { q: "\"Life is like a box of chocolates.\"", a: "Forrest Gump", wrong: ["Cast Away", "The Green Mile", "Big"] },
    { q: "\"Why so serious?\"", a: "The Dark Knight", wrong: ["Joker", "Batman Begins", "Batman Returns"] },
    { q: "\"You can't handle the truth!\"", a: "A Few Good Men", wrong: ["The Firm", "Jerry Maguire", "Regarding Henry"] },
    { q: "\"Here's Johnny!\"", a: "The Shining", wrong: ["Psycho", "Halloween", "The Exorcist"] },
    { q: "\"I'm the king of the world!\"", a: "Titanic", wrong: ["Gladiator", "Braveheart", "The Wolf of Wall Street"] },
    { q: "\"To infinity and beyond!\"", a: "Toy Story", wrong: ["WALL-E", "Finding Nemo", "Up"] },
    { q: "\"My precious.\"", a: "The Lord of the Rings", wrong: ["The Hobbit", "Harry Potter", "Pirates of the Caribbean"] },
    { q: "\"I am your father.\"", a: "The Empire Strikes Back", wrong: ["Star Wars", "Return of the Jedi", "Revenge of the Sith"] },
    { q: "\"Just keep swimming.\"", a: "Finding Nemo", wrong: ["Finding Dory", "Moana", "The Little Mermaid"] },
    { q: "\"Frankly, my dear, I don't give a damn.\"", a: "Gone with the Wind", wrong: ["Casablanca", "Citizen Kane", "The Maltese Falcon"] },
    { q: "\"You're gonna need a bigger boat.\"", a: "Jaws", wrong: ["The Perfect Storm", "Titanic", "Deep Blue Sea"] },
    { q: "\"There's no place like home.\"", a: "The Wizard of Oz", wrong: ["E.T.", "Home Alone", "Cast Away"] },
    { q: "\"Say hello to my little friend!\"", a: "Scarface", wrong: ["The Godfather", "Goodfellas", "Carlito's Way"] },
    { q: "\"I'll have what she's having.\"", a: "When Harry Met Sally", wrong: ["Sleepless in Seattle", "Pretty Woman", "You've Got Mail"] },
    { q: "\"You had me at hello.\"", a: "Jerry Maguire", wrong: ["Notting Hill", "The Notebook", "Love Actually"] },
    { q: "\"After all, tomorrow is another day.\"", a: "Gone with the Wind", wrong: ["Casablanca", "Rebecca", "An Affair to Remember"] },
    { q: "\"I feel the need... the need for speed.\"", a: "Top Gun", wrong: ["Days of Thunder", "The Fast and the Furious", "Rush"] },
    { q: "\"Roads? Where we're going we don't need roads.\"", a: "Back to the Future", wrong: ["E.T.", "Ghostbusters", "The Goonies"] },
    { q: "\"Elementary, my dear Watson.\"", a: "Sherlock Holmes (2009)", wrong: ["Sherlock Holmes (1939)", "A Game of Shadows", "Mr. Holmes"] },
    { q: "\"I drink your milkshake!\"", a: "There Will Be Blood", wrong: ["No Country for Old Men", "The Master", "Magnolia"] },
    { q: "\"Hasta la vista, baby.\"", a: "Terminator 2", wrong: ["The Terminator", "Total Recall", "Predator"] },
    { q: "\"You complete me.\"", a: "Jerry Maguire", wrong: ["The Notebook", "Titanic", "When Harry Met Sally"] },
    { q: "\"I'm walking here!\"", a: "Midnight Cowboy", wrong: ["Taxi Driver", "Mean Streets", "The French Connection"] },
    { q: "\"Wax on, wax off.\"", a: "The Karate Kid", wrong: ["Rocky", "Kickboxer", "Enter the Dragon"] },
    { q: "\"Keep your friends close, enemies closer.\"", a: "The Godfather Part II", wrong: ["Scarface", "Goodfellas", "The Godfather"] },
    { q: "\"I'm gonna make him an offer he can't refuse.\"", a: "The Godfather", wrong: ["Goodfellas", "Scarface", "Casino"] },
    { q: "\"Fasten your seatbelts, it's going to be a bumpy night.\"", a: "All About Eve", wrong: ["Sunset Boulevard", "Casablanca", "The Women"] },
    { q: "\"What we've got here is failure to communicate.\"", a: "Cool Hand Luke", wrong: ["The Shawshank Redemption", "Papillon", "Escape from Alcatraz"] },
    { q: "\"Get busy living, or get busy dying.\"", a: "The Shawshank Redemption", wrong: ["The Green Mile", "Cool Hand Luke", "Escape from Alcatraz"] },
    { q: "\"You want the truth? You can't handle the truth!\"", a: "A Few Good Men", wrong: ["The Firm", "Military Honors", "Crimson Tide"] }
  ],
  years: [
    { q: "When was 'The Godfather' released?", a: "1972", wrong: ["1974", "1970", "1975"] },
    { q: "When was 'Pulp Fiction' released?", a: "1994", wrong: ["1992", "1996", "1993"] },
    { q: "When was 'The Matrix' released?", a: "1999", wrong: ["1997", "2000", "1998"] },
    { q: "When was 'Titanic' released?", a: "1997", wrong: ["1995", "1998", "1999"] },
    { q: "When was 'Jurassic Park' released?", a: "1993", wrong: ["1994", "1991", "1995"] },
    { q: "When was 'Fight Club' released?", a: "1999", wrong: ["1998", "2000", "1997"] },
    { q: "When was 'The Dark Knight' released?", a: "2008", wrong: ["2007", "2009", "2010"] },
    { q: "When was 'Inception' released?", a: "2010", wrong: ["2009", "2011", "2012"] },
    { q: "When was 'Toy Story' released?", a: "1995", wrong: ["1994", "1996", "1997"] },
    { q: "When was 'Forrest Gump' released?", a: "1994", wrong: ["1993", "1995", "1992"] },
    { q: "When was 'The Shawshank Redemption' released?", a: "1994", wrong: ["1993", "1995", "1996"] },
    { q: "When was 'Gladiator' released?", a: "2000", wrong: ["1999", "2001", "2002"] },
    { q: "When was 'Avatar' released?", a: "2009", wrong: ["2008", "2010", "2011"] },
    { q: "When was 'The Lion King' (original) released?", a: "1994", wrong: ["1993", "1995", "1996"] },
    { q: "When was 'Jaws' released?", a: "1975", wrong: ["1974", "1976", "1977"] },
    { q: "When was 'Star Wars' (original) released?", a: "1977", wrong: ["1976", "1978", "1979"] },
    { q: "When was 'E.T.' released?", a: "1982", wrong: ["1981", "1983", "1984"] },
    { q: "When was 'Back to the Future' released?", a: "1985", wrong: ["1984", "1986", "1987"] },
    { q: "When was 'The Silence of the Lambs' released?", a: "1991", wrong: ["1990", "1992", "1989"] },
    { q: "When was 'Schindler's List' released?", a: "1993", wrong: ["1992", "1994", "1991"] },
    { q: "When was 'Goodfellas' released?", a: "1990", wrong: ["1989", "1991", "1992"] },
    { q: "When was 'The Shining' released?", a: "1980", wrong: ["1979", "1981", "1982"] },
    { q: "When was 'Alien' released?", a: "1979", wrong: ["1978", "1980", "1981"] },
    { q: "When was 'Blade Runner' released?", a: "1982", wrong: ["1981", "1983", "1984"] },
    { q: "When was 'Die Hard' released?", a: "1988", wrong: ["1987", "1989", "1990"] },
    { q: "When was 'Terminator 2' released?", a: "1991", wrong: ["1990", "1992", "1989"] },
    { q: "When was 'The Lord of the Rings: Fellowship' released?", a: "2001", wrong: ["2000", "2002", "2003"] },
    { q: "When was 'Finding Nemo' released?", a: "2003", wrong: ["2002", "2004", "2005"] },
    { q: "When was 'The Avengers' (Marvel) released?", a: "2012", wrong: ["2011", "2013", "2010"] },
    { q: "When was 'Frozen' released?", a: "2013", wrong: ["2012", "2014", "2015"] },
    { q: "When was 'Black Panther' released?", a: "2018", wrong: ["2017", "2019", "2016"] },
    { q: "When was 'Parasite' released?", a: "2019", wrong: ["2018", "2020", "2017"] },
    { q: "When was 'Get Out' released?", a: "2017", wrong: ["2016", "2018", "2019"] },
    { q: "When was 'Mad Max: Fury Road' released?", a: "2015", wrong: ["2014", "2016", "2013"] },
    { q: "When was 'Interstellar' released?", a: "2014", wrong: ["2013", "2015", "2016"] }
  ],
  actors: [
    { q: "Who played the Joker in 'The Dark Knight'?", a: "Heath Ledger", wrong: ["Joaquin Phoenix", "Jared Leto", "Jack Nicholson"] },
    { q: "Who played Jack in 'Titanic'?", a: "Leonardo DiCaprio", wrong: ["Brad Pitt", "Johnny Depp", "Matt Damon"] },
    { q: "Who played Neo in 'The Matrix'?", a: "Keanu Reeves", wrong: ["Brad Pitt", "Nicolas Cage", "Tom Cruise"] },
    { q: "Who played Forrest Gump?", a: "Tom Hanks", wrong: ["Robin Williams", "Tom Cruise", "John Travolta"] },
    { q: "Who played Tony Stark / Iron Man?", a: "Robert Downey Jr.", wrong: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"] },
    { q: "Who played Vito Corleone in 'The Godfather'?", a: "Marlon Brando", wrong: ["Al Pacino", "Robert De Niro", "James Caan"] },
    { q: "Who played the T-800 in 'The Terminator'?", a: "Arnold Schwarzenegger", wrong: ["Sylvester Stallone", "Dolph Lundgren", "Jean-Claude Van Damme"] },
    { q: "Who played Hannibal Lecter in 'Silence of the Lambs'?", a: "Anthony Hopkins", wrong: ["Gary Oldman", "Mads Mikkelsen", "Brian Cox"] },
    { q: "Who played Jack Sparrow?", a: "Johnny Depp", wrong: ["Orlando Bloom", "Geoffrey Rush", "Javier Bardem"] },
    { q: "Who played James Bond in 'Casino Royale' (2006)?", a: "Daniel Craig", wrong: ["Pierce Brosnan", "Timothy Dalton", "Sean Connery"] },
    { q: "Who played Maximus in 'Gladiator'?", a: "Russell Crowe", wrong: ["Joaquin Phoenix", "Gerard Butler", "Hugh Jackman"] },
    { q: "Who played Wolverine in the X-Men films?", a: "Hugh Jackman", wrong: ["Russell Crowe", "Christian Bale", "Liam Hemsworth"] },
    { q: "Who played Batman in 'The Dark Knight' trilogy?", a: "Christian Bale", wrong: ["Ben Affleck", "Michael Keaton", "Val Kilmer"] },
    { q: "Who played Andy Dufresne in 'Shawshank Redemption'?", a: "Tim Robbins", wrong: ["Morgan Freeman", "Tom Hanks", "Kevin Spacey"] },
    { q: "Who played Indiana Jones?", a: "Harrison Ford", wrong: ["Tom Selleck", "Kurt Russell", "Mel Gibson"] },
    { q: "Who played Ethan Hunt in Mission: Impossible?", a: "Tom Cruise", wrong: ["Matt Damon", "Jeremy Renner", "Daniel Craig"] },
    { q: "Who played Tyler Durden in 'Fight Club'?", a: "Brad Pitt", wrong: ["Edward Norton", "Jared Leto", "Meat Loaf"] },
    { q: "Who played The Dude in 'The Big Lebowski'?", a: "Jeff Bridges", wrong: ["John Goodman", "Steve Buscemi", "Philip Seymour Hoffman"] },
    { q: "Who played Gandalf in 'Lord of the Rings'?", a: "Ian McKellen", wrong: ["Christopher Lee", "Michael Gambon", "Patrick Stewart"] },
    { q: "Who played Captain America?", a: "Chris Evans", wrong: ["Chris Hemsworth", "Chris Pratt", "Sebastian Stan"] },
    { q: "Who played Thor in the MCU?", a: "Chris Hemsworth", wrong: ["Chris Evans", "Chris Pratt", "Tom Hiddleston"] },
    { q: "Who played Katniss in 'The Hunger Games'?", a: "Jennifer Lawrence", wrong: ["Shailene Woodley", "Emma Watson", "Kristen Stewart"] },
    { q: "Who played John Wick?", a: "Keanu Reeves", wrong: ["Liam Neeson", "Jason Statham", "Denzel Washington"] },
    { q: "Who played The Bride in 'Kill Bill'?", a: "Uma Thurman", wrong: ["Lucy Liu", "Daryl Hannah", "Vivica A. Fox"] },
    { q: "Who played Clarice Starling in 'Silence of the Lambs'?", a: "Jodie Foster", wrong: ["Julianne Moore", "Sigourney Weaver", "Glenn Close"] },
    { q: "Who played Dom Cobb in 'Inception'?", a: "Leonardo DiCaprio", wrong: ["Tom Hardy", "Joseph Gordon-Levitt", "Cillian Murphy"] },
    { q: "Who played Thanos in the MCU?", a: "Josh Brolin", wrong: ["James Brolin", "Michael Rooker", "Dave Bautista"] },
    { q: "Who played Loki in the MCU?", a: "Tom Hiddleston", wrong: ["Chris Hemsworth", "Idris Elba", "Anthony Hopkins"] },
    { q: "Who played Black Widow in the MCU?", a: "Scarlett Johansson", wrong: ["Elizabeth Olsen", "Brie Larson", "Zoe Saldana"] },
    { q: "Who played Hermione in Harry Potter?", a: "Emma Watson", wrong: ["Emma Stone", "Emma Roberts", "Bonnie Wright"] },
    { q: "Who played Darth Vader (voice)?", a: "James Earl Jones", wrong: ["David Prowse", "Sebastian Shaw", "Hayden Christensen"] },
    { q: "Who played Ellen Ripley in 'Alien'?", a: "Sigourney Weaver", wrong: ["Jamie Lee Curtis", "Linda Hamilton", "Geena Davis"] },
    { q: "Who played Sarah Connor in 'Terminator 2'?", a: "Linda Hamilton", wrong: ["Sigourney Weaver", "Jamie Lee Curtis", "Geena Davis"] },
    { q: "Who played The Joker in 'Joker' (2019)?", a: "Joaquin Phoenix", wrong: ["Heath Ledger", "Jared Leto", "Jack Nicholson"] },
    { q: "Who played Jules in 'Pulp Fiction'?", a: "Samuel L. Jackson", wrong: ["John Travolta", "Bruce Willis", "Harvey Keitel"] }
  ],
  taglines: [
    { q: "\"In space, no one can hear you scream.\"", a: "Alien", wrong: ["Gravity", "Interstellar", "Event Horizon"] },
    { q: "\"Who you gonna call?\"", a: "Ghostbusters", wrong: ["Men in Black", "The A-Team", "Beverly Hills Cop"] },
    { q: "\"Be afraid. Be very afraid.\"", a: "The Fly", wrong: ["A Nightmare on Elm Street", "Halloween", "The Thing"] },
    { q: "\"Just when you thought it was safe to go back in the water.\"", a: "Jaws 2", wrong: ["Deep Blue Sea", "The Meg", "47 Meters Down"] },
    { q: "\"The first rule is: you do not talk about it.\"", a: "Fight Club", wrong: ["The Game", "Se7en", "Gone Girl"] },
    { q: "\"Houston, we have a problem.\"", a: "Apollo 13", wrong: ["Gravity", "Interstellar", "The Martian"] },
    { q: "\"One ring to rule them all.\"", a: "The Lord of the Rings", wrong: ["The Hobbit", "Harry Potter", "Willow"] },
    { q: "\"This summer, the magic begins.\"", a: "Harry Potter and the Sorcerer's Stone", wrong: ["Fantasia", "The Wizard of Oz", "Narnia"] },
    { q: "\"The adventure of a lifetime.\"", a: "The Goonies", wrong: ["Indiana Jones", "Stand By Me", "E.T."] },
    { q: "\"Part man. Part machine. All cop.\"", a: "RoboCop", wrong: ["Terminator", "Judge Dredd", "Total Recall"] },
    { q: "\"They're here.\"", a: "Poltergeist", wrong: ["The Shining", "The Exorcist", "Signs"] },
    { q: "\"Get ready for rush hour.\"", a: "Speed", wrong: ["Rush Hour", "The Fast and the Furious", "Die Hard"] },
    { q: "\"An adventure 65 million years in the making.\"", a: "Jurassic Park", wrong: ["Land Before Time", "King Kong", "Godzilla"] },
    { q: "\"The longer you wait, the harder it gets.\"", a: "The 40-Year-Old Virgin", wrong: ["Superbad", "Knocked Up", "American Pie"] },
    { q: "\"His story will touch you, even though he can't.\"", a: "Edward Scissorhands", wrong: ["E.T.", "The Elephant Man", "Powder"] },
    { q: "\"Mischief. Mayhem. Soap.\"", a: "Fight Club", wrong: ["American Psycho", "Se7en", "The Game"] },
    { q: "\"Fear can hold you prisoner. Hope can set you free.\"", a: "The Shawshank Redemption", wrong: ["The Green Mile", "Escape from Alcatraz", "Papillon"] },
    { q: "\"The true story of a real fake.\"", a: "Catch Me If You Can", wrong: ["The Wolf of Wall Street", "American Hustle", "The Talented Mr. Ripley"] },
    { q: "\"A long time ago in a galaxy far, far away...\"", a: "Star Wars", wrong: ["Star Trek", "Guardians of the Galaxy", "Dune"] },
    { q: "\"Earth. It was fun while it lasted.\"", a: "Armageddon", wrong: ["Deep Impact", "Independence Day", "The Day After Tomorrow"] },
    { q: "\"Protecting the Earth from the scum of the universe.\"", a: "Men in Black", wrong: ["Ghostbusters", "Galaxy Quest", "The Fifth Element"] },
    { q: "\"With great power comes great responsibility.\"", a: "Spider-Man", wrong: ["Batman Begins", "Superman", "X-Men"] },
    { q: "\"The mission is a man.\"", a: "Saving Private Ryan", wrong: ["Black Hawk Down", "Platoon", "Dunkirk"] },
    { q: "\"Collide with destiny.\"", a: "Titanic", wrong: ["Poseidon", "The Perfect Storm", "Deep Impact"] },
    { q: "\"Reality is a thing of the past.\"", a: "The Matrix", wrong: ["Inception", "Total Recall", "Dark City"] },
    { q: "\"Some memories are best forgotten.\"", a: "Eternal Sunshine of the Spotless Mind", wrong: ["Memento", "Total Recall", "Inception"] },
    { q: "\"Don't breathe. Don't look back.\"", a: "A Quiet Place", wrong: ["Don't Breathe", "Bird Box", "Hush"] },
    { q: "\"The park is open.\"", a: "Jurassic World", wrong: ["Jurassic Park", "Westworld", "The Lost World"] },
    { q: "\"Witness the beginning of a happy ending.\"", a: "Shrek 2", wrong: ["Shrek", "Shrek Forever After", "Happily N'Ever After"] },
    { q: "\"He's the best there is. Actually, he's the only one there is.\"", a: "Ace Ventura: Pet Detective", wrong: ["The Mask", "Liar Liar", "Bruce Almighty"] },
    { q: "\"Size does matter.\"", a: "Godzilla (1998)", wrong: ["King Kong", "Pacific Rim", "Rampage"] },
    { q: "\"Nice planet. We'll take it.\"", a: "Mars Attacks!", wrong: ["Independence Day", "War of the Worlds", "Signs"] },
    { q: "\"Work. Family. Invisibility. Diaper changes.\"", a: "The Incredibles", wrong: ["Spy Kids", "Fantastic Four", "The Pacifier"] },
    { q: "\"You'll believe a man can fly.\"", a: "Superman (1978)", wrong: ["The Rocketeer", "Iron Man", "Up, Up and Away"] },
    { q: "\"The toys are back in town.\"", a: "Toy Story 2", wrong: ["Toy Story", "Small Soldiers", "Toy Story 3"] }
  ]
};

// Game state
let gameState = {
  selectedTopic: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  passed: 0,
  timeRemaining: GAME_DURATION,
  isPlaying: false,
  gameOver: false,
  timerInterval: null
};

// DOM Elements
let introSection, countdownSection, gameSection, resultSection;
let timerFill, timeRemaining, currentScore, correctCount, totalCount;
let questionNum, questionText, answersGrid, passBtn;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
});

function cacheElements() {
  introSection = document.getElementById("introSection");
  countdownSection = document.getElementById("countdownSection");
  gameSection = document.getElementById("gameSection");
  resultSection = document.getElementById("resultSection");
  
  timerFill = document.getElementById("timerFill");
  timeRemaining = document.getElementById("timeRemaining");
  currentScore = document.getElementById("currentScore");
  correctCount = document.getElementById("correctCount");
  totalCount = document.getElementById("totalCount");
  
  questionNum = document.getElementById("questionNum");
  questionText = document.getElementById("questionText");
  answersGrid = document.getElementById("answersGrid");
  passBtn = document.getElementById("passBtn");
}

function setupEventListeners() {
  // Topic selection
  document.querySelectorAll(".topic-card").forEach(card => {
    card.addEventListener("click", () => selectTopic(card.dataset.topic));
  });
  
  // Answer buttons
  answersGrid.querySelectorAll(".answer-btn").forEach(btn => {
    btn.addEventListener("click", () => handleAnswer(btn));
  });
  
  // Pass button
  passBtn.addEventListener("click", handlePass);
  
  // Play again
  document.getElementById("playAgainBtn").addEventListener("click", resetGame);
  
  // Share
  document.getElementById("shareBtn").addEventListener("click", shareResult);
  
  // Modals
  document.getElementById("helpBtn").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = false;
  });
  document.getElementById("helpClose").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = true;
  });
  document.getElementById("statsBtn").addEventListener("click", () => {
    loadStats();
    document.getElementById("statsModal").hidden = false;
  });
  document.getElementById("statsClose").addEventListener("click", () => {
    document.getElementById("statsModal").hidden = true;
  });
  
  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

// ============================================
// TOPIC SELECTION
// ============================================

function selectTopic(topic) {
  gameState.selectedTopic = topic;
  
  // Update countdown display
  document.getElementById("selectedTopicIcon").textContent = TOPICS[topic].icon;
  document.getElementById("selectedTopicName").textContent = TOPICS[topic].name;
  
  // Show countdown
  introSection.hidden = true;
  countdownSection.hidden = false;
  
  // Start countdown
  startCountdown();
}

function startCountdown() {
  let count = COUNTDOWN_SECONDS;
  const countdownEl = document.getElementById("countdownNumber");
  
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(interval);
      startGame();
    }
  }, 1000);
}

// ============================================
// GAME FLOW
// ============================================

function startGame() {
  // Prepare questions
  gameState.questions = shuffleArray([...QUESTIONS[gameState.selectedTopic]]);
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.correct = 0;
  gameState.wrong = 0;
  gameState.passed = 0;
  gameState.timeRemaining = GAME_DURATION;
  gameState.isPlaying = true;
  gameState.gameOver = false;
  
  // Show game section
  countdownSection.hidden = true;
  gameSection.hidden = false;
  
  // Load first question
  loadQuestion();
  
  // Start timer
  updateTimerDisplay();
  gameState.timerInterval = setInterval(tick, 1000);
}

function tick() {
  gameState.timeRemaining--;
  updateTimerDisplay();
  
  if (gameState.timeRemaining <= 0) {
    endGame();
  }
}

function updateTimerDisplay() {
  timeRemaining.textContent = gameState.timeRemaining;
  
  const percentage = (gameState.timeRemaining / GAME_DURATION) * 100;
  timerFill.style.width = `${percentage}%`;
  
  // Warning states
  timerFill.classList.remove("warning", "danger");
  if (gameState.timeRemaining <= 10) {
    timerFill.classList.add("danger");
  } else if (gameState.timeRemaining <= 20) {
    timerFill.classList.add("warning");
  }
}

function loadQuestion() {
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    // Cycle back if we run out
    gameState.questions = shuffleArray([...QUESTIONS[gameState.selectedTopic]]);
    gameState.currentQuestionIndex = 0;
  }
  
  const q = gameState.questions[gameState.currentQuestionIndex];
  
  questionNum.textContent = gameState.correct + gameState.wrong + gameState.passed + 1;
  questionText.textContent = q.q;
  
  // Shuffle answers
  const answers = shuffleArray([q.a, ...q.wrong]);
  
  const buttons = answersGrid.querySelectorAll(".answer-btn");
  buttons.forEach((btn, i) => {
    btn.textContent = answers[i];
    btn.className = "answer-btn";
    btn.disabled = false;
    btn.dataset.correct = answers[i] === q.a ? "true" : "false";
  });
  
  // Update counts
  totalCount.textContent = gameState.correct + gameState.wrong + gameState.passed;
}

function handleAnswer(btn) {
  if (!gameState.isPlaying) return;
  
  const isCorrect = btn.dataset.correct === "true";
  
  // Disable all buttons
  answersGrid.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);
  
  // Show feedback
  if (isCorrect) {
    btn.classList.add("correct");
    gameState.score += POINTS_CORRECT;
    gameState.correct++;
  } else {
    btn.classList.add("wrong");
    // Highlight correct answer
    answersGrid.querySelectorAll(".answer-btn").forEach(b => {
      if (b.dataset.correct === "true") b.classList.add("correct");
    });
    gameState.score = Math.max(0, gameState.score + POINTS_WRONG);
    gameState.wrong++;
  }
  
  // Update display
  currentScore.textContent = gameState.score;
  correctCount.textContent = gameState.correct;
  
  // Next question after brief delay
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    loadQuestion();
  }, 500);
}

function handlePass() {
  if (!gameState.isPlaying) return;
  
  gameState.passed++;
  gameState.currentQuestionIndex++;
  loadQuestion();
}

function endGame() {
  gameState.isPlaying = false;
  gameState.gameOver = true;
  clearInterval(gameState.timerInterval);
  
  // Save stats
  saveStats();
  
  // Show result
  showResult();
}

// ============================================
// RESULTS
// ============================================

function showResult() {
  gameSection.hidden = true;
  resultSection.hidden = false;
  
  document.getElementById("resultTopicIcon").textContent = TOPICS[gameState.selectedTopic].icon;
  document.getElementById("resultTopicName").textContent = TOPICS[gameState.selectedTopic].name;
  
  document.getElementById("finalScore").textContent = gameState.score;
  document.getElementById("resultCorrect").textContent = gameState.correct;
  document.getElementById("resultWrong").textContent = gameState.wrong;
  document.getElementById("resultPassed").textContent = gameState.passed;
  
  // Verdict
  const verdictEl = document.getElementById("resultVerdict");
  const iconEl = document.getElementById("resultIcon");
  
  if (gameState.score >= 100) {
    verdictEl.textContent = "Cinema Mastermind! 🏆";
    iconEl.textContent = "🏆";
  } else if (gameState.score >= 70) {
    verdictEl.textContent = "Film Scholar! 🎓";
    iconEl.textContent = "🎓";
  } else if (gameState.score >= 40) {
    verdictEl.textContent = "Movie Buff! 🎬";
    iconEl.textContent = "🎬";
  } else {
    verdictEl.textContent = "Keep Watching! 📺";
    iconEl.textContent = "📺";
  }

  // Mastermind shows only aggregate scores - no individual movie/actor links needed
}

function resetGame() {
  resultSection.hidden = true;
  introSection.hidden = false;
  
  gameState = {
    selectedTopic: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    passed: 0,
    timeRemaining: GAME_DURATION,
    isPlaying: false,
    gameOver: false,
    timerInterval: null
  };
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("mastermind_stats");
  return stored ? JSON.parse(stored) : {
    played: 0,
    totalScore: 0,
    bestScore: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    topicBests: {}
  };
}

function saveStats() {
  const stats = getStats();
  stats.played++;
  stats.totalScore += gameState.score;
  stats.bestScore = Math.max(stats.bestScore, gameState.score);
  stats.totalCorrect += gameState.correct;
  stats.totalAnswered += gameState.correct + gameState.wrong;
  
  // Track topic best
  if (!stats.topicBests[gameState.selectedTopic] || 
      stats.topicBests[gameState.selectedTopic] < gameState.score) {
    stats.topicBests[gameState.selectedTopic] = gameState.score;
  }
  
  localStorage.setItem("mastermind_stats", JSON.stringify(stats));
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statBestScore").textContent = stats.bestScore;
  document.getElementById("statAvgScore").textContent = stats.played > 0 
    ? Math.round(stats.totalScore / stats.played) 
    : 0;
  document.getElementById("statAccuracy").textContent = stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) + "%" 
    : "0%";
  
  // Topic bests
  const topicList = document.getElementById("topicStatList");
  topicList.innerHTML = Object.entries(stats.topicBests)
    .sort((a, b) => b[1] - a[1])
    .map(([topic, score]) => `
      <div class="topic-stat-item">
        <span>${TOPICS[topic].icon} ${TOPICS[topic].name}</span>
        <span>${score}</span>
      </div>
    `).join("") || "<p style='color: var(--ghost-gray); font-size: 13px;'>No games played yet</p>";
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  const total = gameState.correct + gameState.wrong;
  const accuracy = total > 0 ? Math.round((gameState.correct / total) * 100) : 0;
  
  const text = `🧠 Mastermind - ${TOPICS[gameState.selectedTopic].name}

Score: ${gameState.score} pts
✓ ${gameState.correct} correct
✗ ${gameState.wrong} wrong
→ ${gameState.passed} passed
Accuracy: ${accuracy}%

Play at orbit-game.com/arcade`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.textContent = "✓ Copied!";
    setTimeout(() => {
      btn.textContent = "📋 Share";
    }, 2000);
  });
}

// ============================================
// UTILITIES
// ============================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}