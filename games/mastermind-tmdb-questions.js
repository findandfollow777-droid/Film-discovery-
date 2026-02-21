// Auto-generated TMDB trivia for Mastermind
// Generated: 2026-02-21T09:08:21.374Z
// Movies processed: 172
// Year questions: 172
// Tagline questions: 170

const TMDB_YEARS = [
  {
    "q": "In what year was \"The Godfather\" released?",
    "a": "1972",
    "wrong": [
      "1969",
      "1971",
      "1974"
    ]
  },
  {
    "q": "In what year was \"The Godfather Part II\" released?",
    "a": "1974",
    "wrong": [
      "1971",
      "1973",
      "1976"
    ]
  },
  {
    "q": "In what year was \"GoodFellas\" released?",
    "a": "1990",
    "wrong": [
      "1987",
      "1989",
      "1992"
    ]
  },
  {
    "q": "In what year was \"Once Upon a Time in America\" released?",
    "a": "1984",
    "wrong": [
      "1981",
      "1983",
      "1986"
    ]
  },
  {
    "q": "In what year was \"The Thing\" released?",
    "a": "1982",
    "wrong": [
      "1979",
      "1981",
      "1984"
    ]
  },
  {
    "q": "In what year was \"One Flew Over the Cuckoo's Nest\" released?",
    "a": "1975",
    "wrong": [
      "1972",
      "1974",
      "1977"
    ]
  },
  {
    "q": "In what year was \"Full Metal Jacket\" released?",
    "a": "1987",
    "wrong": [
      "1984",
      "1986",
      "1989"
    ]
  },
  {
    "q": "In what year was \"American History X\" released?",
    "a": "1998",
    "wrong": [
      "1995",
      "1997",
      "2000"
    ]
  },
  {
    "q": "In what year was \"Jaws\" released?",
    "a": "1975",
    "wrong": [
      "1972",
      "1974",
      "1977"
    ]
  },
  {
    "q": "In what year was \"The Shining\" released?",
    "a": "1980",
    "wrong": [
      "1977",
      "1979",
      "1982"
    ]
  },
  {
    "q": "In what year was \"Magnolia\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"Alien\" released?",
    "a": "1979",
    "wrong": [
      "1976",
      "1978",
      "1981"
    ]
  },
  {
    "q": "In what year was \"The Others\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb\" released?",
    "a": "1964",
    "wrong": [
      "1961",
      "1963",
      "1966"
    ]
  },
  {
    "q": "In what year was \"The Man Who Fell to Earth\" released?",
    "a": "1976",
    "wrong": [
      "1973",
      "1975",
      "1978"
    ]
  },
  {
    "q": "In what year was \"Back to the Future\" released?",
    "a": "1985",
    "wrong": [
      "1982",
      "1984",
      "1987"
    ]
  },
  {
    "q": "In what year was \"Top Gun\" released?",
    "a": "1986",
    "wrong": [
      "1983",
      "1985",
      "1988"
    ]
  },
  {
    "q": "In what year was \"Blade Runner\" released?",
    "a": "1982",
    "wrong": [
      "1979",
      "1981",
      "1984"
    ]
  },
  {
    "q": "In what year was \"Indiana Jones and the Last Crusade\" released?",
    "a": "1989",
    "wrong": [
      "1986",
      "1988",
      "1991"
    ]
  },
  {
    "q": "In what year was \"The Empire Strikes Back\" released?",
    "a": "1980",
    "wrong": [
      "1977",
      "1979",
      "1982"
    ]
  },
  {
    "q": "In what year was \"The Great Dictator\" released?",
    "a": "1940",
    "wrong": [
      "1937",
      "1939",
      "1942"
    ]
  },
  {
    "q": "In what year was \"Star Wars\" released?",
    "a": "1977",
    "wrong": [
      "1974",
      "1976",
      "1979"
    ]
  },
  {
    "q": "In what year was \"Raiders of the Lost Ark\" released?",
    "a": "1981",
    "wrong": [
      "1978",
      "1980",
      "1983"
    ]
  },
  {
    "q": "In what year was \"Léon: The Professional\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"A Clockwork Orange\" released?",
    "a": "1971",
    "wrong": [
      "1968",
      "1970",
      "1973"
    ]
  },
  {
    "q": "In what year was \"The Good, the Bad and the Ugly\" released?",
    "a": "1966",
    "wrong": [
      "1963",
      "1965",
      "1968"
    ]
  },
  {
    "q": "In what year was \"Braveheart\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"Scarface\" released?",
    "a": "1983",
    "wrong": [
      "1980",
      "1982",
      "1985"
    ]
  },
  {
    "q": "In what year was \"Rocky\" released?",
    "a": "1976",
    "wrong": [
      "1973",
      "1975",
      "1978"
    ]
  },
  {
    "q": "In what year was \"Aliens\" released?",
    "a": "1986",
    "wrong": [
      "1983",
      "1985",
      "1988"
    ]
  },
  {
    "q": "In what year was \"Die Hard\" released?",
    "a": "1988",
    "wrong": [
      "1985",
      "1987",
      "1990"
    ]
  },
  {
    "q": "In what year was \"The Karate Kid\" released?",
    "a": "1984",
    "wrong": [
      "1981",
      "1983",
      "1986"
    ]
  },
  {
    "q": "In what year was \"The Incredibles\" released?",
    "a": "2004",
    "wrong": [
      "2001",
      "2003",
      "2006"
    ]
  },
  {
    "q": "In what year was \"The Princess Bride\" released?",
    "a": "1987",
    "wrong": [
      "1984",
      "1986",
      "1989"
    ]
  },
  {
    "q": "In what year was \"The Breakfast Club\" released?",
    "a": "1985",
    "wrong": [
      "1982",
      "1984",
      "1987"
    ]
  },
  {
    "q": "In what year was \"Fight Club\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"Pulp Fiction\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"Forrest Gump\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"Schindler's List\" released?",
    "a": "1993",
    "wrong": [
      "1990",
      "1992",
      "1995"
    ]
  },
  {
    "q": "In what year was \"Se7en\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"The Green Mile\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"Jurassic Park\" released?",
    "a": "1993",
    "wrong": [
      "1990",
      "1992",
      "1995"
    ]
  },
  {
    "q": "In what year was \"The Silence of the Lambs\" released?",
    "a": "1991",
    "wrong": [
      "1988",
      "1990",
      "1993"
    ]
  },
  {
    "q": "In what year was \"Saving Private Ryan\" released?",
    "a": "1998",
    "wrong": [
      "1995",
      "1997",
      "2000"
    ]
  },
  {
    "q": "In what year was \"City of God\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"Three Colors: Red\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"Good Will Hunting\" released?",
    "a": "1997",
    "wrong": [
      "1994",
      "1996",
      "1999"
    ]
  },
  {
    "q": "In what year was \"Charlie and the Chocolate Factory\" released?",
    "a": "2005",
    "wrong": [
      "2002",
      "2004",
      "2007"
    ]
  },
  {
    "q": "In what year was \"The Shawshank Redemption\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"The Truman Show\" released?",
    "a": "1998",
    "wrong": [
      "1995",
      "1997",
      "2000"
    ]
  },
  {
    "q": "In what year was \"Titanic\" released?",
    "a": "1997",
    "wrong": [
      "1994",
      "1996",
      "1999"
    ]
  },
  {
    "q": "In what year was \"The Matrix\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"Predator\" released?",
    "a": "1987",
    "wrong": [
      "1984",
      "1986",
      "1989"
    ]
  },
  {
    "q": "In what year was \"The Usual Suspects\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"Amélie\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Lost in Translation\" released?",
    "a": "2003",
    "wrong": [
      "2000",
      "2002",
      "2005"
    ]
  },
  {
    "q": "In what year was \"Reservoir Dogs\" released?",
    "a": "1992",
    "wrong": [
      "1989",
      "1991",
      "1994"
    ]
  },
  {
    "q": "In what year was \"Catch Me If You Can\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"Shutter Island\" released?",
    "a": "2010",
    "wrong": [
      "2007",
      "2009",
      "2012"
    ]
  },
  {
    "q": "In what year was \"The Lord of the Rings: The Fellowship of the Ring\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"The Lord of the Rings: The Two Towers\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"The Lord of the Rings: The Return of the King\" released?",
    "a": "2003",
    "wrong": [
      "2000",
      "2002",
      "2005"
    ]
  },
  {
    "q": "In what year was \"The Dark Knight\" released?",
    "a": "2008",
    "wrong": [
      "2005",
      "2007",
      "2010"
    ]
  },
  {
    "q": "In what year was \"Batman Begins\" released?",
    "a": "2005",
    "wrong": [
      "2002",
      "2004",
      "2007"
    ]
  },
  {
    "q": "In what year was \"Gladiator\" released?",
    "a": "2000",
    "wrong": [
      "1997",
      "1999",
      "2002"
    ]
  },
  {
    "q": "In what year was \"Monsters, Inc.\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Princess Mononoke\" released?",
    "a": "1997",
    "wrong": [
      "1994",
      "1996",
      "1999"
    ]
  },
  {
    "q": "In what year was \"The Prestige\" released?",
    "a": "2006",
    "wrong": [
      "2003",
      "2005",
      "2008"
    ]
  },
  {
    "q": "In what year was \"The Sixth Sense\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"A Beautiful Mind\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Kill Bill: Vol. 1\" released?",
    "a": "2003",
    "wrong": [
      "2000",
      "2002",
      "2005"
    ]
  },
  {
    "q": "In what year was \"Inglourious Basterds\" released?",
    "a": "2009",
    "wrong": [
      "2006",
      "2008",
      "2011"
    ]
  },
  {
    "q": "In what year was \"Star Wars: Episode I - The Phantom Menace\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"Star Wars: Episode II - Attack of the Clones\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"Star Wars: Episode III - Revenge of the Sith\" released?",
    "a": "2005",
    "wrong": [
      "2002",
      "2004",
      "2007"
    ]
  },
  {
    "q": "In what year was \"Taxi Driver\" released?",
    "a": "1976",
    "wrong": [
      "1973",
      "1975",
      "1978"
    ]
  },
  {
    "q": "In what year was \"Life Is Beautiful\" released?",
    "a": "1997",
    "wrong": [
      "1994",
      "1996",
      "1999"
    ]
  },
  {
    "q": "In what year was \"Howl's Moving Castle\" released?",
    "a": "2004",
    "wrong": [
      "2001",
      "2003",
      "2006"
    ]
  },
  {
    "q": "In what year was \"Spirited Away\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Apollo 13\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"GoldenEye\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Philosopher's Stone\" released?",
    "a": "2001",
    "wrong": [
      "1998",
      "2000",
      "2003"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Chamber of Secrets\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Goblet of Fire\" released?",
    "a": "2005",
    "wrong": [
      "2002",
      "2004",
      "2007"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Half-Blood Prince\" released?",
    "a": "2009",
    "wrong": [
      "2006",
      "2008",
      "2011"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Deathly Hallows: Part 1\" released?",
    "a": "2010",
    "wrong": [
      "2007",
      "2009",
      "2012"
    ]
  },
  {
    "q": "In what year was \"Harry Potter and the Deathly Hallows: Part 2\" released?",
    "a": "2011",
    "wrong": [
      "2008",
      "2010",
      "2013"
    ]
  },
  {
    "q": "In what year was \"Pirates of the Caribbean: The Curse of the Black Pearl\" released?",
    "a": "2003",
    "wrong": [
      "2000",
      "2002",
      "2005"
    ]
  },
  {
    "q": "In what year was \"Pirates of the Caribbean: Dead Man's Chest\" released?",
    "a": "2006",
    "wrong": [
      "2003",
      "2005",
      "2008"
    ]
  },
  {
    "q": "In what year was \"Pirates of the Caribbean: At World's End\" released?",
    "a": "2007",
    "wrong": [
      "2004",
      "2006",
      "2009"
    ]
  },
  {
    "q": "In what year was \"Iron Man\" released?",
    "a": "2008",
    "wrong": [
      "2005",
      "2007",
      "2010"
    ]
  },
  {
    "q": "In what year was \"Iron Man 2\" released?",
    "a": "2010",
    "wrong": [
      "2007",
      "2009",
      "2012"
    ]
  },
  {
    "q": "In what year was \"Captain America: The First Avenger\" released?",
    "a": "2011",
    "wrong": [
      "2008",
      "2010",
      "2013"
    ]
  },
  {
    "q": "In what year was \"Thor\" released?",
    "a": "2011",
    "wrong": [
      "2008",
      "2010",
      "2013"
    ]
  },
  {
    "q": "In what year was \"The Amazing Spider-Man\" released?",
    "a": "2012",
    "wrong": [
      "2009",
      "2011",
      "2014"
    ]
  },
  {
    "q": "In what year was \"Spider-Man\" released?",
    "a": "2002",
    "wrong": [
      "1999",
      "2001",
      "2004"
    ]
  },
  {
    "q": "In what year was \"Spider-Man 3\" released?",
    "a": "2007",
    "wrong": [
      "2004",
      "2006",
      "2009"
    ]
  },
  {
    "q": "In what year was \"Transformers\" released?",
    "a": "2007",
    "wrong": [
      "2004",
      "2006",
      "2009"
    ]
  },
  {
    "q": "In what year was \"The Lion King\" released?",
    "a": "1994",
    "wrong": [
      "1991",
      "1993",
      "1996"
    ]
  },
  {
    "q": "In what year was \"Toy Story\" released?",
    "a": "1995",
    "wrong": [
      "1992",
      "1994",
      "1997"
    ]
  },
  {
    "q": "In what year was \"Toy Story 2\" released?",
    "a": "1999",
    "wrong": [
      "1996",
      "1998",
      "2001"
    ]
  },
  {
    "q": "In what year was \"WALL·E\" released?",
    "a": "2008",
    "wrong": [
      "2005",
      "2007",
      "2010"
    ]
  },
  {
    "q": "In what year was \"Finding Nemo\" released?",
    "a": "2003",
    "wrong": [
      "2000",
      "2002",
      "2005"
    ]
  },
  {
    "q": "In what year was \"Kung Fu Panda\" released?",
    "a": "2008",
    "wrong": [
      "2005",
      "2007",
      "2010"
    ]
  },
  {
    "q": "In what year was \"Up\" released?",
    "a": "2009",
    "wrong": [
      "2006",
      "2008",
      "2011"
    ]
  },
  {
    "q": "In what year was \"Cars\" released?",
    "a": "2006",
    "wrong": [
      "2003",
      "2005",
      "2008"
    ]
  },
  {
    "q": "In what year was \"2001: A Space Odyssey\" released?",
    "a": "1968",
    "wrong": [
      "1965",
      "1967",
      "1970"
    ]
  },
  {
    "q": "In what year was \"Inception\" released?",
    "a": "2010",
    "wrong": [
      "2007",
      "2009",
      "2012"
    ]
  },
  {
    "q": "In what year was \"Avatar\" released?",
    "a": "2009",
    "wrong": [
      "2006",
      "2008",
      "2011"
    ]
  },
  {
    "q": "In what year was \"Interstellar\" released?",
    "a": "2014",
    "wrong": [
      "2011",
      "2013",
      "2016"
    ]
  },
  {
    "q": "In what year was \"Mad Max: Fury Road\" released?",
    "a": "2015",
    "wrong": [
      "2012",
      "2014",
      "2017"
    ]
  },
  {
    "q": "In what year was \"Avengers: Infinity War\" released?",
    "a": "2018",
    "wrong": [
      "2015",
      "2017",
      "2020"
    ]
  },
  {
    "q": "In what year was \"The Avengers\" released?",
    "a": "2012",
    "wrong": [
      "2009",
      "2011",
      "2014"
    ]
  },
  {
    "q": "In what year was \"Django Unchained\" released?",
    "a": "2012",
    "wrong": [
      "2009",
      "2011",
      "2014"
    ]
  },
  {
    "q": "In what year was \"The Revenant\" released?",
    "a": "2015",
    "wrong": [
      "2012",
      "2014",
      "2017"
    ]
  },
  {
    "q": "In what year was \"Whiplash\" released?",
    "a": "2014",
    "wrong": [
      "2011",
      "2013",
      "2016"
    ]
  },
  {
    "q": "In what year was \"It\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Thor: Ragnarok\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Guardians of the Galaxy Vol. 2\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Guardians of the Galaxy\" released?",
    "a": "2014",
    "wrong": [
      "2011",
      "2013",
      "2016"
    ]
  },
  {
    "q": "In what year was \"Captain America: Civil War\" released?",
    "a": "2016",
    "wrong": [
      "2013",
      "2015",
      "2018"
    ]
  },
  {
    "q": "In what year was \"Avengers: Age of Ultron\" released?",
    "a": "2015",
    "wrong": [
      "2012",
      "2014",
      "2017"
    ]
  },
  {
    "q": "In what year was \"Black Panther\" released?",
    "a": "2018",
    "wrong": [
      "2015",
      "2017",
      "2020"
    ]
  },
  {
    "q": "In what year was \"Avengers: Endgame\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Spider-Man: Far From Home\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Spider-Man: Homecoming\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Star Wars: The Last Jedi\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Star Wars: The Rise of Skywalker\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Frozen II\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Inside Out\" released?",
    "a": "2015",
    "wrong": [
      "2012",
      "2014",
      "2017"
    ]
  },
  {
    "q": "In what year was \"Coco\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Zootopia\" released?",
    "a": "2016",
    "wrong": [
      "2013",
      "2015",
      "2018"
    ]
  },
  {
    "q": "In what year was \"The Maze Runner\" released?",
    "a": "2014",
    "wrong": [
      "2011",
      "2013",
      "2016"
    ]
  },
  {
    "q": "In what year was \"The Hunger Games: Mockingjay - Part 1\" released?",
    "a": "2014",
    "wrong": [
      "2011",
      "2013",
      "2016"
    ]
  },
  {
    "q": "In what year was \"Beauty and the Beast\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"A Quiet Place\" released?",
    "a": "2018",
    "wrong": [
      "2015",
      "2017",
      "2020"
    ]
  },
  {
    "q": "In what year was \"Blade Runner 2049\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Dunkirk\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"The Shape of Water\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Jumanji: Welcome to the Jungle\" released?",
    "a": "2017",
    "wrong": [
      "2014",
      "2016",
      "2019"
    ]
  },
  {
    "q": "In what year was \"Joker\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Parasite\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Once Upon a Time... in Hollywood\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Midsommar\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"John Wick: Chapter 3 - Parabellum\" released?",
    "a": "2019",
    "wrong": [
      "2016",
      "2018",
      "2021"
    ]
  },
  {
    "q": "In what year was \"Soul\" released?",
    "a": "2020",
    "wrong": [
      "2017",
      "2019",
      "2022"
    ]
  },
  {
    "q": "In what year was \"Fast X\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Oppenheimer\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Dune: Part Two\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Godzilla x Kong: The New Empire\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Inside Out 2\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Furiosa: A Mad Max Saga\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Transformers One\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Dune\" released?",
    "a": "2021",
    "wrong": [
      "2018",
      "2020",
      "2023"
    ]
  },
  {
    "q": "In what year was \"Spider-Man: No Way Home\" released?",
    "a": "2021",
    "wrong": [
      "2018",
      "2020",
      "2023"
    ]
  },
  {
    "q": "In what year was \"Venom: Let There Be Carnage\" released?",
    "a": "2021",
    "wrong": [
      "2018",
      "2020",
      "2023"
    ]
  },
  {
    "q": "In what year was \"Eternals\" released?",
    "a": "2021",
    "wrong": [
      "2018",
      "2020",
      "2023"
    ]
  },
  {
    "q": "In what year was \"Shang-Chi and the Legend of the Ten Rings\" released?",
    "a": "2021",
    "wrong": [
      "2018",
      "2020",
      "2023"
    ]
  },
  {
    "q": "In what year was \"Black Panther: Wakanda Forever\" released?",
    "a": "2022",
    "wrong": [
      "2019",
      "2021",
      "2024"
    ]
  },
  {
    "q": "In what year was \"Thor: Love and Thunder\" released?",
    "a": "2022",
    "wrong": [
      "2019",
      "2021",
      "2024"
    ]
  },
  {
    "q": "In what year was \"Jurassic World Dominion\" released?",
    "a": "2022",
    "wrong": [
      "2019",
      "2021",
      "2024"
    ]
  },
  {
    "q": "In what year was \"Top Gun: Maverick\" released?",
    "a": "2022",
    "wrong": [
      "2019",
      "2021",
      "2024"
    ]
  },
  {
    "q": "In what year was \"Black Adam\" released?",
    "a": "2022",
    "wrong": [
      "2019",
      "2021",
      "2024"
    ]
  },
  {
    "q": "In what year was \"Ant-Man and the Wasp: Quantumania\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Spider-Man: Across the Spider-Verse\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Kung Fu Panda 4\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Kingdom of the Planet of the Apes\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Venom: The Last Dance\" released?",
    "a": "2024",
    "wrong": [
      "2021",
      "2023",
      "2026"
    ]
  },
  {
    "q": "In what year was \"Godzilla Minus One\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Barbie\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Elemental\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  },
  {
    "q": "In what year was \"Guardians of the Galaxy Vol. 3\" released?",
    "a": "2023",
    "wrong": [
      "2020",
      "2022",
      "2025"
    ]
  }
];

const TMDB_TAGLINES = [
  {
    "q": "Complete the tagline for \"The Godfather\": \"An offer you can't...\"",
    "a": "refuse.",
    "wrong": [
      "the truth",
      "to the end",
      "is just the beginning"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The rise and fall of the Corleone empire.\"?",
    "a": "The Godfather Part II",
    "wrong": [
      "A Clockwork Orange",
      "Jaws",
      "The Godfather"
    ]
  },
  {
    "q": "Complete the tagline for \"GoodFellas\": \"Three decades of life in...\"",
    "a": "the mafia.",
    "wrong": [
      "changes everything",
      "will rise",
      "to the end"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Crime, passion and lust for power.\"?",
    "a": "Once Upon a Time in America",
    "wrong": [
      "Die Hard",
      "Jaws",
      "Blade Runner"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Anytime. Anywhere. Anyone.\"?",
    "a": "The Thing",
    "wrong": [
      "Full Metal Jacket",
      "GoodFellas",
      "Back to the Future"
    ]
  },
  {
    "q": "Which movie has the tagline: \"In this clean, orderly, disciplined world, who needs guys like McMurphy? Everybody.\"?",
    "a": "One Flew Over the Cuckoo's Nest",
    "wrong": [
      "Star Wars",
      "The Breakfast Club",
      "The Godfather Part II"
    ]
  },
  {
    "q": "Which movie has the tagline: \"In Vietnam, the wind doesn't blow. It sucks.\"?",
    "a": "Full Metal Jacket",
    "wrong": [
      "Scarface",
      "GoodFellas",
      "Aliens"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Some legacies must end.\"?",
    "a": "American History X",
    "wrong": [
      "The Lord of the Rings: The Two Towers",
      "Schindler's List",
      "Forrest Gump"
    ]
  },
  {
    "q": "Complete the tagline for \"Jaws\": \"The terrifying motion picture from the terrifying No. 1...\"",
    "a": "best seller.",
    "wrong": [
      "of the century",
      "will rise",
      "of all time"
    ]
  },
  {
    "q": "Which movie has the tagline: \"A masterpiece of modern horror.\"?",
    "a": "The Shining",
    "wrong": [
      "Taxi Driver",
      "One Flew Over the Cuckoo's Nest",
      "The Empire Strikes Back"
    ]
  },
  {
    "q": "Complete the tagline for \"Magnolia\": \"Things fall down. People look up. And when it rains,...\"",
    "a": "it pours.",
    "wrong": [
      "will rise",
      "to the end",
      "from the start"
    ]
  },
  {
    "q": "Complete the tagline for \"Alien\": \"In space no one can hear...\"",
    "a": "you scream.",
    "wrong": [
      "will rise",
      "changes everything",
      "in the dark"
    ]
  },
  {
    "q": "Complete the tagline for \"The Others\": \"Sooner or later they’ll find...\"",
    "a": "you.",
    "wrong": [
      "begins now",
      "to the end",
      "the truth"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The hot-line suspense comedy.\"?",
    "a": "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    "wrong": [
      "The Good, the Bad and the Ugly",
      "A Clockwork Orange",
      "The Godfather Part II"
    ]
  },
  {
    "q": "Complete the tagline for \"The Man Who Fell to Earth\": \"Power, space, time and a...\"",
    "a": "visitor.",
    "wrong": [
      "above all",
      "will rise",
      "never ends"
    ]
  },
  {
    "q": "Complete the tagline for \"Back to the Future\": \"He was never in time for his classes... He wasn't in time for his dinner... Then one day... he wasn't in his time...\"",
    "a": "at all.",
    "wrong": [
      "strikes back",
      "at any cost",
      "to the end"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Up there with the best of the best.\"?",
    "a": "Top Gun",
    "wrong": [
      "The Usual Suspects",
      "Star Wars",
      "Three Colors: Red"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Man has made his match... now it's his problem.\"?",
    "a": "Blade Runner",
    "wrong": [
      "Predator",
      "Once Upon a Time in America",
      "The Godfather"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Have the adventure of your life keeping up with the Joneses.\"?",
    "a": "Indiana Jones and the Last Crusade",
    "wrong": [
      "Alien",
      "The Empire Strikes Back",
      "Jurassic Park"
    ]
  },
  {
    "q": "Complete the tagline for \"The Empire Strikes Back\": \"The Star Wars saga...\"",
    "a": "continues.",
    "wrong": [
      "strikes back",
      "no turning back",
      "above all"
    ]
  },
  {
    "q": "Complete the tagline for \"Star Wars\": \"A long time ago in a galaxy far,...\"",
    "a": "far away...",
    "wrong": [
      "no turning back",
      "will rise",
      "never ends"
    ]
  },
  {
    "q": "Complete the tagline for \"Raiders of the Lost Ark\": \"The return of the great...\"",
    "a": "adventure.",
    "wrong": [
      "once more",
      "strikes back",
      "for revenge"
    ]
  },
  {
    "q": "Complete the tagline for \"Léon: The Professional\": \"If you want the job done right, hire...\"",
    "a": "a professional.",
    "wrong": [
      "the truth",
      "strikes back",
      "is just the beginning"
    ]
  },
  {
    "q": "Complete the tagline for \"A Clockwork Orange\": \"Being the adventures of a young man whose principal interests are rape, ultra-violence...\"",
    "a": "and Beethoven.",
    "wrong": [
      "strikes back",
      "from the start",
      "for revenge"
    ]
  },
  {
    "q": "Which movie has the tagline: \"For three men the Civil War wasn't hell. It was practice.\"?",
    "a": "The Good, the Bad and the Ugly",
    "wrong": [
      "Taxi Driver",
      "The Godfather",
      "One Flew Over the Cuckoo's Nest"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Every man dies, not every man really lives.\"?",
    "a": "Braveheart",
    "wrong": [
      "GoodFellas",
      "City of God",
      "Pirates of the Caribbean: The Curse of the Black Pearl"
    ]
  },
  {
    "q": "Complete the tagline for \"Scarface\": \"He loved the American Dream. With...\"",
    "a": "a vengeance.",
    "wrong": [
      "in the dark",
      "of the century",
      "of all time"
    ]
  },
  {
    "q": "Which movie has the tagline: \"His whole life was a million-to-one shot.\"?",
    "a": "Rocky",
    "wrong": [
      "Blade Runner",
      "Back to the Future",
      "Raiders of the Lost Ark"
    ]
  },
  {
    "q": "Which movie has the tagline: \"This time it's war.\"?",
    "a": "Aliens",
    "wrong": [
      "Braveheart",
      "The Empire Strikes Back",
      "The Breakfast Club"
    ]
  },
  {
    "q": "Which movie has the tagline: \"40 stories of sheer adventure!\"?",
    "a": "Die Hard",
    "wrong": [
      "Titanic",
      "Good Will Hunting",
      "Scarface"
    ]
  },
  {
    "q": "Which movie has the tagline: \"He taught him the secret to karate lies in the mind and heart. Not in the hands.\"?",
    "a": "The Karate Kid",
    "wrong": [
      "One Flew Over the Cuckoo's Nest",
      "Predator",
      "The Godfather Part II"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Expect the incredible.\"?",
    "a": "The Incredibles",
    "wrong": [
      "Harry Potter and the Chamber of Secrets",
      "The Usual Suspects",
      "Se7en"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Heroes. Giants. Villains. Wizards. True Love.\"?",
    "a": "The Princess Bride",
    "wrong": [
      "Back to the Future",
      "Titanic",
      "Toy Story"
    ]
  },
  {
    "q": "Complete the tagline for \"The Breakfast Club\": \"They only met once, but it changed their...\"",
    "a": "lives forever.",
    "wrong": [
      "changes everything",
      "from the start",
      "at any cost"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Mischief. Mayhem. Soap.\"?",
    "a": "Fight Club",
    "wrong": [
      "Léon: The Professional",
      "Batman Begins",
      "The Matrix"
    ]
  },
  {
    "q": "Which movie has the tagline: \"You won’t know the facts until you’ve seen the fiction.\"?",
    "a": "Pulp Fiction",
    "wrong": [
      "The Breakfast Club",
      "Titanic",
      "American History X"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The world will never be the same once you've seen it through the eyes of Forrest Gump.\"?",
    "a": "Forrest Gump",
    "wrong": [
      "Kill Bill: Vol. 1",
      "Jurassic Park",
      "Princess Mononoke"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Whoever saves one life, saves the world entire.\"?",
    "a": "Schindler's List",
    "wrong": [
      "American History X",
      "Monsters, Inc.",
      "Se7en"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Gluttony. Greed. Sloth. Envy. Wrath. Pride. Lust.\"?",
    "a": "Se7en",
    "wrong": [
      "Toy Story 2",
      "The Lord of the Rings: The Fellowship of the Ring",
      "Princess Mononoke"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Paul Edgecomb didn't believe in miracles. Until the day he met one.\"?",
    "a": "The Green Mile",
    "wrong": [
      "Princess Mononoke",
      "Fight Club",
      "City of God"
    ]
  },
  {
    "q": "Which movie has the tagline: \"An adventure 65 million years in the making.\"?",
    "a": "Jurassic Park",
    "wrong": [
      "The Sixth Sense",
      "Titanic",
      "Harry Potter and the Chamber of Secrets"
    ]
  },
  {
    "q": "Complete the tagline for \"The Silence of the Lambs\": \"To enter the mind of a killer she must challenge the mind of...\"",
    "a": "a madman.",
    "wrong": [
      "above all",
      "once more",
      "no turning back"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The mission is a man.\"?",
    "a": "Saving Private Ryan",
    "wrong": [
      "WALL·E",
      "Magnolia",
      "GoodFellas"
    ]
  },
  {
    "q": "Which movie has the tagline: \"If you run, the beast catches you; if you stay, the beast eats you.\"?",
    "a": "City of God",
    "wrong": [
      "Fight Club",
      "Up",
      "Léon: The Professional"
    ]
  },
  {
    "q": "Complete the tagline for \"Three Colors: Red\": \"The invisible thread of...\"",
    "a": "destinies.",
    "wrong": [
      "once more",
      "is just the beginning",
      "will rise"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Some people can never believe in themselves, until someone believes in them.\"?",
    "a": "Good Will Hunting",
    "wrong": [
      "Toy Story 2",
      "The Others",
      "Die Hard"
    ]
  },
  {
    "q": "Complete the tagline for \"Charlie and the Chocolate Factory\": \"Prepare for a taste of...\"",
    "a": "adventure.",
    "wrong": [
      "strikes back",
      "the truth",
      "at any cost"
    ]
  },
  {
    "q": "Complete the tagline for \"The Shawshank Redemption\": \"Fear can hold you prisoner. Hope can set...\"",
    "a": "you free.",
    "wrong": [
      "begins now",
      "to the end",
      "above all"
    ]
  },
  {
    "q": "Which movie has the tagline: \"On the air. Unaware.\"?",
    "a": "The Truman Show",
    "wrong": [
      "The Lord of the Rings: The Two Towers",
      "Harry Potter and the Chamber of Secrets",
      "Jurassic Park"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Nothing on earth could come between them.\"?",
    "a": "Titanic",
    "wrong": [
      "American History X",
      "Full Metal Jacket",
      "The Usual Suspects"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Believe the unbelievable.\"?",
    "a": "The Matrix",
    "wrong": [
      "The Dark Knight",
      "Schindler's List",
      "The Truman Show"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Soon the hunt will begin.\"?",
    "a": "Predator",
    "wrong": [
      "The Thing",
      "The Silence of the Lambs",
      "Life Is Beautiful"
    ]
  },
  {
    "q": "Complete the tagline for \"The Usual Suspects\": \"Five criminals. One line up....\"",
    "a": "No coincidence.",
    "wrong": [
      "you imagined",
      "once more",
      "begins now"
    ]
  },
  {
    "q": "Which movie has the tagline: \"She’ll change your life.\"?",
    "a": "Amélie",
    "wrong": [
      "The Others",
      "GoldenEye",
      "The Sixth Sense"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Everyone wants to be found.\"?",
    "a": "Lost in Translation",
    "wrong": [
      "The Dark Knight",
      "Pulp Fiction",
      "Catch Me If You Can"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Every dog has his day.\"?",
    "a": "Reservoir Dogs",
    "wrong": [
      "Full Metal Jacket",
      "American History X",
      "Jurassic Park"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The true story of a real fake.\"?",
    "a": "Catch Me If You Can",
    "wrong": [
      "The Amazing Spider-Man",
      "The Dark Knight",
      "Se7en"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Someone is missing.\"?",
    "a": "Shutter Island",
    "wrong": [
      "Spider-Man",
      "Pirates of the Caribbean: Dead Man's Chest",
      "Monsters, Inc."
    ]
  },
  {
    "q": "Complete the tagline for \"The Lord of the Rings: The Fellowship of the Ring\": \"One ring to rule them...\"",
    "a": "all.",
    "wrong": [
      "to the end",
      "begins now",
      "is just the beginning"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The journey continues.\"?",
    "a": "The Lord of the Rings: The Two Towers",
    "wrong": [
      "The Lord of the Rings: The Fellowship of the Ring",
      "Braveheart",
      "Fight Club"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The eye of the enemy is moving.\"?",
    "a": "The Lord of the Rings: The Return of the King",
    "wrong": [
      "Three Colors: Red",
      "The Lord of the Rings: The Fellowship of the Ring",
      "Spider-Man 3"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Welcome to a world without rules.\"?",
    "a": "The Dark Knight",
    "wrong": [
      "Catch Me If You Can",
      "Howl's Moving Castle",
      "Saving Private Ryan"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Evil fears the knight.\"?",
    "a": "Batman Begins",
    "wrong": [
      "Up",
      "Star Wars: Episode II - Attack of the Clones",
      "American History X"
    ]
  },
  {
    "q": "Which movie has the tagline: \"What we do in life echoes in eternity.\"?",
    "a": "Gladiator",
    "wrong": [
      "Braveheart",
      "Star Wars: Episode III - Revenge of the Sith",
      "Titanic"
    ]
  },
  {
    "q": "Which movie has the tagline: \"It's nothing personal. It's just their job.\"?",
    "a": "Monsters, Inc.",
    "wrong": [
      "Kung Fu Panda",
      "The Usual Suspects",
      "The Silence of the Lambs"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The fate of the world rests on the courage of one warrior.\"?",
    "a": "Princess Mononoke",
    "wrong": [
      "Harry Potter and the Goblet of Fire",
      "City of God",
      "Spider-Man"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Are You Watching Closely?\"?",
    "a": "The Prestige",
    "wrong": [
      "Spirited Away",
      "Mad Max: Fury Road",
      "Captain America: Civil War"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Not every gift is a blessing.\"?",
    "a": "The Sixth Sense",
    "wrong": [
      "Saving Private Ryan",
      "The Matrix",
      "The Dark Knight"
    ]
  },
  {
    "q": "Complete the tagline for \"A Beautiful Mind\": \"He saw the world in a way no one could...\"",
    "a": "have imagined.",
    "wrong": [
      "of all time",
      "of the century",
      "begins now"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Here comes the bride.\"?",
    "a": "Kill Bill: Vol. 1",
    "wrong": [
      "The Sixth Sense",
      "The Others",
      "Three Colors: Red"
    ]
  },
  {
    "q": "Complete the tagline for \"Inglourious Basterds\": \"Once upon a time in Nazi...\"",
    "a": "occupied France...",
    "wrong": [
      "will rise",
      "to the end",
      "at any cost"
    ]
  },
  {
    "q": "Complete the tagline for \"Star Wars: Episode I - The Phantom Menace\": \"Every saga has a...\"",
    "a": "beginning.",
    "wrong": [
      "at any cost",
      "the truth",
      "no turning back"
    ]
  },
  {
    "q": "Complete the tagline for \"Star Wars: Episode II - Attack of the Clones\": \"A Jedi shall not know anger. Nor hatred....\"",
    "a": "Nor love.",
    "wrong": [
      "no turning back",
      "the truth",
      "of all time"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Every story has a hero. Every hero has a destiny. Every saga has an end.\"?",
    "a": "Star Wars: Episode III - Revenge of the Sith",
    "wrong": [
      "Harry Potter and the Goblet of Fire",
      "Fight Club",
      "The Incredibles"
    ]
  },
  {
    "q": "Complete the tagline for \"Taxi Driver\": \"On every street in every city in this country, there's a nobody who dreams of being somebody. He's a lonely forgotten man desperate to prove that...\"",
    "a": "he's alive.",
    "wrong": [
      "changes everything",
      "for revenge",
      "no turning back"
    ]
  },
  {
    "q": "Which movie has the tagline: \"An unforgettable fable that proves love, family and imagination conquer all.\"?",
    "a": "Life Is Beautiful",
    "wrong": [
      "Pulp Fiction",
      "The Lion King",
      "Spider-Man"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The two lived there.\"?",
    "a": "Howl's Moving Castle",
    "wrong": [
      "Transformers",
      "Harry Potter and the Deathly Hallows: Part 2",
      "Monsters, Inc."
    ]
  },
  {
    "q": "Which movie has the tagline: \"Beyond the tunnel was a mysterious town.\"?",
    "a": "Spirited Away",
    "wrong": [
      "The Lord of the Rings: The Fellowship of the Ring",
      "Forrest Gump",
      "Harry Potter and the Goblet of Fire"
    ]
  },
  {
    "q": "Which movie has the tagline: \"\"Houston, we have a problem.\"\"?",
    "a": "Apollo 13",
    "wrong": [
      "Back to the Future",
      "The Shawshank Redemption",
      "The Lord of the Rings: The Two Towers"
    ]
  },
  {
    "q": "Complete the tagline for \"GoldenEye\": \"No limits. No fears. No...\"",
    "a": "substitutes.",
    "wrong": [
      "strikes back",
      "no turning back",
      "once more"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Let the magic begin.\"?",
    "a": "Harry Potter and the Philosopher's Stone",
    "wrong": [
      "The Sixth Sense",
      "Star Wars: Episode II - Attack of the Clones",
      "Pirates of the Caribbean: The Curse of the Black Pearl"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Something evil has returned to Hogwarts!\"?",
    "a": "Harry Potter and the Chamber of Secrets",
    "wrong": [
      "Thor",
      "Pulp Fiction",
      "American History X"
    ]
  },
  {
    "q": "Complete the tagline for \"Harry Potter and the Goblet of Fire\": \"Dark and difficult times lie...\"",
    "a": "ahead.",
    "wrong": [
      "no turning back",
      "to survive",
      "changes everything"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Dark secrets revealed.\"?",
    "a": "Harry Potter and the Half-Blood Prince",
    "wrong": [
      "Midsommar",
      "Avengers: Age of Ultron",
      "Kung Fu Panda"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Nowhere is safe.\"?",
    "a": "Harry Potter and the Deathly Hallows: Part 1",
    "wrong": [
      "Whiplash",
      "Coco",
      "Spider-Man: Far From Home"
    ]
  },
  {
    "q": "Which movie has the tagline: \"It all ends.\"?",
    "a": "Harry Potter and the Deathly Hallows: Part 2",
    "wrong": [
      "City of God",
      "Black Panther",
      "Dunkirk"
    ]
  },
  {
    "q": "Complete the tagline for \"Pirates of the Caribbean: The Curse of the Black Pearl\": \"Prepare to be blown out of...\"",
    "a": "the water.",
    "wrong": [
      "will rise",
      "the truth",
      "once more"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Captain Jack is back!\"?",
    "a": "Pirates of the Caribbean: Dead Man's Chest",
    "wrong": [
      "Harry Potter and the Goblet of Fire",
      "Gladiator",
      "American History X"
    ]
  },
  {
    "q": "Which movie has the tagline: \"At the end of the world, the adventure begins.\"?",
    "a": "Pirates of the Caribbean: At World's End",
    "wrong": [
      "The Matrix",
      "Finding Nemo",
      "Guardians of the Galaxy"
    ]
  },
  {
    "q": "Complete the tagline for \"Iron Man\": \"Heroes aren't born. They're...\"",
    "a": "built.",
    "wrong": [
      "never ends",
      "of all time",
      "from the start"
    ]
  },
  {
    "q": "Complete the tagline for \"Iron Man 2\": \"It's not the armor that makes the hero, but the...\"",
    "a": "man inside.",
    "wrong": [
      "begins now",
      "never ends",
      "in the dark"
    ]
  },
  {
    "q": "Which movie has the tagline: \"When patriots become heroes.\"?",
    "a": "Captain America: The First Avenger",
    "wrong": [
      "Harry Potter and the Half-Blood Prince",
      "Transformers",
      "Inception"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Courage is immortal.\"?",
    "a": "Thor",
    "wrong": [
      "Spirited Away",
      "Charlie and the Chocolate Factory",
      "Howl's Moving Castle"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The untold story begins.\"?",
    "a": "The Amazing Spider-Man",
    "wrong": [
      "The Incredibles",
      "Inside Out",
      "The Lord of the Rings: The Return of the King"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Go for the ultimate spin.\"?",
    "a": "Spider-Man",
    "wrong": [
      "Pulp Fiction",
      "Spirited Away",
      "Harry Potter and the Chamber of Secrets"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The greatest battle lies within.\"?",
    "a": "Spider-Man 3",
    "wrong": [
      "Amélie",
      "Kung Fu Panda",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Their war. Our world.\"?",
    "a": "Transformers",
    "wrong": [
      "Catch Me If You Can",
      "Good Will Hunting",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The greatest adventure of all is finding our place in the Circle of Life.\"?",
    "a": "The Lion King",
    "wrong": [
      "Jurassic Park",
      "GoodFellas",
      "Back to the Future"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The adventure takes off when toys come to life!\"?",
    "a": "Toy Story",
    "wrong": [
      "Toy Story 2",
      "The Lord of the Rings: The Fellowship of the Ring",
      "Reservoir Dogs"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The toys are back in town!\"?",
    "a": "Toy Story 2",
    "wrong": [
      "Indiana Jones and the Last Crusade",
      "The Lord of the Rings: The Fellowship of the Ring",
      "Schindler's List"
    ]
  },
  {
    "q": "Complete the tagline for \"WALL·E\": \"After 700 years of doing what he was built for, he'll discover what he was...\"",
    "a": "meant for.",
    "wrong": [
      "of the century",
      "at any cost",
      "of all time"
    ]
  },
  {
    "q": "Which movie has the tagline: \"There are 3.7 trillion fish in the ocean. They're looking for one.\"?",
    "a": "Finding Nemo",
    "wrong": [
      "Kung Fu Panda",
      "The Lord of the Rings: The Fellowship of the Ring",
      "Life Is Beautiful"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Prepare for awesomeness.\"?",
    "a": "Kung Fu Panda",
    "wrong": [
      "Star Wars: The Last Jedi",
      "Mad Max: Fury Road",
      "Spider-Man"
    ]
  },
  {
    "q": "Complete the tagline for \"Up\": \"Change is in the...\"",
    "a": "air.",
    "wrong": [
      "once more",
      "never ends",
      "in the dark"
    ]
  },
  {
    "q": "Complete the tagline for \"Cars\": \"Ahhh... it's got that new...\"",
    "a": "movie smell.",
    "wrong": [
      "never ends",
      "at any cost",
      "to the end"
    ]
  },
  {
    "q": "Which movie has the tagline: \"An epic drama of adventure and exploration.\"?",
    "a": "2001: A Space Odyssey",
    "wrong": [
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
      "One Flew Over the Cuckoo's Nest",
      "Jaws"
    ]
  },
  {
    "q": "Complete the tagline for \"Inception\": \"Your mind is the scene of...\"",
    "a": "the crime.",
    "wrong": [
      "never ends",
      "of all time",
      "no turning back"
    ]
  },
  {
    "q": "Complete the tagline for \"Avatar\": \"Enter the world of...\"",
    "a": "Pandora.",
    "wrong": [
      "from the start",
      "changes everything",
      "above all"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Mankind was born on Earth. It was never meant to die here.\"?",
    "a": "Interstellar",
    "wrong": [
      "Black Panther",
      "Avengers: Endgame",
      "Thor: Ragnarok"
    ]
  },
  {
    "q": "Complete the tagline for \"Mad Max: Fury Road\": \"The future belongs to the...\"",
    "a": "mad.",
    "wrong": [
      "begins now",
      "of all time",
      "to the end"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Destiny arrives all the same.\"?",
    "a": "Avengers: Infinity War",
    "wrong": [
      "Inception",
      "It",
      "Zootopia"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Some assembly required.\"?",
    "a": "The Avengers",
    "wrong": [
      "The Incredibles",
      "Avatar",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Complete the tagline for \"Django Unchained\": \"Life, liberty, and the pursuit...\"",
    "a": "of vengeance.",
    "wrong": [
      "begins now",
      "of the century",
      "never ends"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Blood lost. Life found.\"?",
    "a": "The Revenant",
    "wrong": [
      "Transformers One",
      "Iron Man 2",
      "Cars"
    ]
  },
  {
    "q": "Complete the tagline for \"Whiplash\": \"The road to greatness can take you to...\"",
    "a": "the edge.",
    "wrong": [
      "to survive",
      "changes everything",
      "will rise"
    ]
  },
  {
    "q": "Which movie has the tagline: \"You'll float too.\"?",
    "a": "It",
    "wrong": [
      "Inside Out",
      "The Hunger Games: Mockingjay - Part 1",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Which movie has the tagline: \"No hammer. No problem.\"?",
    "a": "Thor: Ragnarok",
    "wrong": [
      "Star Wars: The Rise of Skywalker",
      "Top Gun: Maverick",
      "Midsommar"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Anyone can save the galaxy once.\"?",
    "a": "Guardians of the Galaxy Vol. 2",
    "wrong": [
      "Captain America: Civil War",
      "Inglourious Basterds",
      "A Quiet Place"
    ]
  },
  {
    "q": "Which movie has the tagline: \"When things get bad, they'll do their worst.\"?",
    "a": "Guardians of the Galaxy",
    "wrong": [
      "Guardians of the Galaxy Vol. 3",
      "Avengers: Infinity War",
      "Cars"
    ]
  },
  {
    "q": "Which movie has the tagline: \"United we stand. Divided we fall.\"?",
    "a": "Captain America: Civil War",
    "wrong": [
      "Black Panther: Wakanda Forever",
      "Ant-Man and the Wasp: Quantumania",
      "The Prestige"
    ]
  },
  {
    "q": "Which movie has the tagline: \"A new age has come.\"?",
    "a": "Avengers: Age of Ultron",
    "wrong": [
      "Shutter Island",
      "Guardians of the Galaxy Vol. 3",
      "Charlie and the Chocolate Factory"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Long live the king.\"?",
    "a": "Black Panther",
    "wrong": [
      "Blade Runner 2049",
      "Venom: The Last Dance",
      "Thor"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Avenge the fallen.\"?",
    "a": "Avengers: Endgame",
    "wrong": [
      "Parasite",
      "Black Panther",
      "Spider-Man: Far From Home"
    ]
  },
  {
    "q": "Complete the tagline for \"Spider-Man: Far From Home\": \"It's time to step...\"",
    "a": "up.",
    "wrong": [
      "changes everything",
      "of the century",
      "of all time"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Homework can wait. The city can't.\"?",
    "a": "Spider-Man: Homecoming",
    "wrong": [
      "Kung Fu Panda",
      "Ant-Man and the Wasp: Quantumania",
      "Shutter Island"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Let the past die.\"?",
    "a": "Star Wars: The Last Jedi",
    "wrong": [
      "Black Panther",
      "Jurassic World Dominion",
      "Spider-Man 3"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The Saga Concludes.\"?",
    "a": "Star Wars: The Rise of Skywalker",
    "wrong": [
      "Whiplash",
      "Frozen II",
      "Harry Potter and the Deathly Hallows: Part 1"
    ]
  },
  {
    "q": "Complete the tagline for \"Frozen II\": \"The past is not what...\"",
    "a": "it seems.",
    "wrong": [
      "of the century",
      "once more",
      "never ends"
    ]
  },
  {
    "q": "Complete the tagline for \"Inside Out\": \"Meet the little voices inside...\"",
    "a": "your head.",
    "wrong": [
      "to the end",
      "from the start",
      "in the dark"
    ]
  },
  {
    "q": "Complete the tagline for \"Coco\": \"The celebration of a...\"",
    "a": "lifetime.",
    "wrong": [
      "no turning back",
      "never ends",
      "to survive"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Welcome to the urban jungle.\"?",
    "a": "Zootopia",
    "wrong": [
      "Inception",
      "The Prestige",
      "Harry Potter and the Half-Blood Prince"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Get ready to run.\"?",
    "a": "The Maze Runner",
    "wrong": [
      "Harry Potter and the Goblet of Fire",
      "Mad Max: Fury Road",
      "Captain America: The First Avenger"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Fire burns brighter in the darkness.\"?",
    "a": "The Hunger Games: Mockingjay - Part 1",
    "wrong": [
      "Cars",
      "Iron Man",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Be our guest.\"?",
    "a": "Beauty and the Beast",
    "wrong": [
      "Shutter Island",
      "Transformers One",
      "Barbie"
    ]
  },
  {
    "q": "Which movie has the tagline: \"If they hear you, they hunt you.\"?",
    "a": "A Quiet Place",
    "wrong": [
      "Inception",
      "Fast X",
      "Harry Potter and the Half-Blood Prince"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The key to the future is finally unearthed.\"?",
    "a": "Blade Runner 2049",
    "wrong": [
      "Eternals",
      "The Dark Knight",
      "Thor"
    ]
  },
  {
    "q": "Which movie has the tagline: \"When 400,000 men couldn't get home, home came for them.\"?",
    "a": "Dunkirk",
    "wrong": [
      "Spider-Man 3",
      "Captain America: Civil War",
      "Frozen II"
    ]
  },
  {
    "q": "Complete the tagline for \"The Shape of Water\": \"A fairy tale for troubled...\"",
    "a": "times.",
    "wrong": [
      "the truth",
      "of the century",
      "strikes back"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The game has evolved.\"?",
    "a": "Jumanji: Welcome to the Jungle",
    "wrong": [
      "Inside Out",
      "Kingdom of the Planet of the Apes",
      "Jurassic World Dominion"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Put on a happy face.\"?",
    "a": "Joker",
    "wrong": [
      "Black Adam",
      "Spider-Man: Homecoming",
      "Star Wars: The Last Jedi"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Act like you own the place.\"?",
    "a": "Parasite",
    "wrong": [
      "Avatar",
      "Jurassic World Dominion",
      "Beauty and the Beast"
    ]
  },
  {
    "q": "Complete the tagline for \"Once Upon a Time... in Hollywood\": \"In this town, it can all change…...\"",
    "a": "Like that.",
    "wrong": [
      "will rise",
      "no turning back",
      "the truth"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Let the festivities begin.\"?",
    "a": "Midsommar",
    "wrong": [
      "Beauty and the Beast",
      "Black Adam",
      "Joker"
    ]
  },
  {
    "q": "Which movie has the tagline: \"If you want peace, prepare for war.\"?",
    "a": "John Wick: Chapter 3 - Parabellum",
    "wrong": [
      "Beauty and the Beast",
      "Avengers: Infinity War",
      "Spider-Man: Far From Home"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Everybody has a soul. Joe Gardner is about to find his.\"?",
    "a": "Soul",
    "wrong": [
      "Shang-Chi and the Legend of the Ten Rings",
      "Avengers: Endgame",
      "Inception"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The end of the road begins.\"?",
    "a": "Fast X",
    "wrong": [
      "Zootopia",
      "Interstellar",
      "The Hunger Games: Mockingjay - Part 1"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The world forever changes.\"?",
    "a": "Oppenheimer",
    "wrong": [
      "Black Panther",
      "Midsommar",
      "Black Panther: Wakanda Forever"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Long live the fighters.\"?",
    "a": "Dune: Part Two",
    "wrong": [
      "Jurassic World Dominion",
      "Dunkirk",
      "Ant-Man and the Wasp: Quantumania"
    ]
  },
  {
    "q": "Complete the tagline for \"Godzilla x Kong: The New Empire\": \"Rise together or fall...\"",
    "a": "alone.",
    "wrong": [
      "of the century",
      "begins now",
      "is just the beginning"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Make room for new emotions.\"?",
    "a": "Inside Out 2",
    "wrong": [
      "Thor: Ragnarok",
      "The Revenant",
      "Oppenheimer"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Fury is born.\"?",
    "a": "Furiosa: A Mad Max Saga",
    "wrong": [
      "Dunkirk",
      "Parasite",
      "Barbie"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Witness the origin.\"?",
    "a": "Transformers One",
    "wrong": [
      "Captain America: Civil War",
      "Zootopia",
      "Coco"
    ]
  },
  {
    "q": "Which movie has the tagline: \"It begins.\"?",
    "a": "Dune",
    "wrong": [
      "Harry Potter and the Deathly Hallows: Part 2",
      "Thor",
      "Elemental"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The Multiverse unleashed.\"?",
    "a": "Spider-Man: No Way Home",
    "wrong": [
      "The Shape of Water",
      "A Quiet Place",
      "Thor"
    ]
  },
  {
    "q": "Complete the tagline for \"Venom: Let There Be Carnage\": \"You are what you...\"",
    "a": "eat.",
    "wrong": [
      "will rise",
      "of all time",
      "for revenge"
    ]
  },
  {
    "q": "Which movie has the tagline: \"In the beginning...\"?",
    "a": "Eternals",
    "wrong": [
      "The Maze Runner",
      "Dunkirk",
      "Guardians of the Galaxy"
    ]
  },
  {
    "q": "Complete the tagline for \"Shang-Chi and the Legend of the Ten Rings\": \"You can't outrun your...\"",
    "a": "destiny.",
    "wrong": [
      "strikes back",
      "will rise",
      "to the end"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Forever.\"?",
    "a": "Black Panther: Wakanda Forever",
    "wrong": [
      "Black Adam",
      "Godzilla Minus One",
      "Spider-Man: Far From Home"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The one is not the only.\"?",
    "a": "Thor: Love and Thunder",
    "wrong": [
      "Black Panther: Wakanda Forever",
      "Coco",
      "Avengers: Age of Ultron"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The epic conclusion of the Jurassic era.\"?",
    "a": "Jurassic World Dominion",
    "wrong": [
      "John Wick: Chapter 3 - Parabellum",
      "Whiplash",
      "Dune: Part Two"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Feel the need... The need for speed.\"?",
    "a": "Top Gun: Maverick",
    "wrong": [
      "Godzilla Minus One",
      "Guardians of the Galaxy Vol. 3",
      "Spider-Man: Homecoming"
    ]
  },
  {
    "q": "Which movie has the tagline: \"The hierarchy of power in the DC Universe is about to change.\"?",
    "a": "Black Adam",
    "wrong": [
      "Dune: Part Two",
      "Guardians of the Galaxy Vol. 2",
      "The Maze Runner"
    ]
  },
  {
    "q": "Complete the tagline for \"Ant-Man and the Wasp: Quantumania\": \"Witness the beginning of a...\"",
    "a": "new dynasty.",
    "wrong": [
      "begins now",
      "of all time",
      "is just the beginning"
    ]
  },
  {
    "q": "Complete the tagline for \"Spider-Man: Across the Spider-Verse\": \"It's how you wear the mask...\"",
    "a": "that matters.",
    "wrong": [
      "in the dark",
      "once more",
      "to the end"
    ]
  },
  {
    "q": "Complete the tagline for \"Kingdom of the Planet of the Apes\": \"No one can stop the...\"",
    "a": "reign.",
    "wrong": [
      "strikes back",
      "changes everything",
      "at any cost"
    ]
  },
  {
    "q": "Which movie has the tagline: \"'Til death do they part.\"?",
    "a": "Venom: The Last Dance",
    "wrong": [
      "The Shape of Water",
      "Spider-Man: Homecoming",
      "A Quiet Place"
    ]
  },
  {
    "q": "Complete the tagline for \"Godzilla Minus One\": \"Live and Fight. Survive and...\"",
    "a": "Resist.",
    "wrong": [
      "changes everything",
      "no turning back",
      "the truth"
    ]
  },
  {
    "q": "Complete the tagline for \"Barbie\": \"She's everything. He's just...\"",
    "a": "Ken.",
    "wrong": [
      "at any cost",
      "is just the beginning",
      "for revenge"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Opposites react.\"?",
    "a": "Elemental",
    "wrong": [
      "Jumanji: Welcome to the Jungle",
      "Interstellar",
      "Mad Max: Fury Road"
    ]
  },
  {
    "q": "Which movie has the tagline: \"Once more with feeling.\"?",
    "a": "Guardians of the Galaxy Vol. 3",
    "wrong": [
      "Interstellar",
      "A Quiet Place",
      "Thor: Ragnarok"
    ]
  }
];
