// Temporary script to parse awards CSV and extract unique movies
const csv = `tmdb_id,title,year,festival,category,won
0,Ben-Hur,1959,BAFTA,Best Film,true
0,Anatomy of a Murder,1959,BAFTA,Best Film,false
0,The Face,1959,BAFTA,Best Film,false
0,The Nun's Story,1959,BAFTA,Best Film,false
0,Sapphire,1959,BAFTA,Best Film,false
0,Some Like It Hot,1959,BAFTA,Best Film,false
0,Room at the Top,1958,BAFTA,Best Film,true
0,Cat on a Hot Tin Roof,1958,BAFTA,Best Film,false
0,The Defiant Ones,1958,BAFTA,Best Film,false
0,Ice Cold in Alex,1958,BAFTA,Best Film,false
0,Indiscreet,1958,BAFTA,Best Film,false
0,The Bridge on the River Kwai,1957,BAFTA,Best Film,true
0,12 Angry Men,1957,BAFTA,Best Film,false
0,3:10 to Yuma,1957,BAFTA,Best Film,false
0,The Bachelor Party,1957,BAFTA,Best Film,false
0,Paths of Glory,1957,BAFTA,Best Film,false
0,Gervaise,1956,BAFTA,Best Film,true
0,Baby Doll,1956,BAFTA,Best Film,false
0,The Battle of the River Plate,1956,BAFTA,Best Film,false
0,The Killing,1956,BAFTA,Best Film,false
0,The Man Who Never Was,1956,BAFTA,Best Film,false
0,Richard III,1955,BAFTA,Best Film,true
0,Bad Day at Black Rock,1955,BAFTA,Best Film,false
0,Carmen Jones,1955,BAFTA,Best Film,false
0,The Dam Busters,1955,BAFTA,Best Film,false
0,East of Eden,1955,BAFTA,Best Film,false
0,The Ladykillers,1955,BAFTA,Best Film,false
0,Seven Samurai,1955,BAFTA,Best Film,false
0,The Wages of Fear,1954,BAFTA,Best Film,true
0,The Caine Mutiny,1954,BAFTA,Best Film,false
0,Hobson's Choice,1954,BAFTA,Best Film,false
0,How to Marry a Millionaire,1954,BAFTA,Best Film,false
0,Rear Window,1954,BAFTA,Best Film,false
0,Seven Brides for Seven Brothers,1954,BAFTA,Best Film,false
0,Forbidden Games,1953,BAFTA,Best Film,true
0,The Bad and the Beautiful,1953,BAFTA,Best Film,false
0,Come Back Little Sheba,1953,BAFTA,Best Film,false
0,The Cruel Sea,1953,BAFTA,Best Film,false
0,From Here to Eternity,1953,BAFTA,Best Film,false
0,Genevieve,1953,BAFTA,Best Film,false
0,Julius Caesar,1953,BAFTA,Best Film,false
0,Roman Holiday,1953,BAFTA,Best Film,false
0,Shane,1953,BAFTA,Best Film,false
0,The Sound Barrier,1952,BAFTA,Best Film,true
0,The African Queen,1952,BAFTA,Best Film,false
0,Angels One Five,1952,BAFTA,Best Film,false
0,The Boy Kumasenu,1952,BAFTA,Best Film,false
0,Carrie,1952,BAFTA,Best Film,false
0,Casque d'Or,1952,BAFTA,Best Film,false
0,Cry the Beloved Country,1952,BAFTA,Best Film,false
0,Death of a Salesman,1952,BAFTA,Best Film,false
0,Limelight,1952,BAFTA,Best Film,false
0,Mandy,1952,BAFTA,Best Film,false
0,Miracle in Milan,1952,BAFTA,Best Film,false
0,Los Olvidados,1952,BAFTA,Best Film,false
0,Pat and Mike,1952,BAFTA,Best Film,false
0,The Quiet Man,1952,BAFTA,Best Film,false
0,Rashomon,1952,BAFTA,Best Film,false
0,The River,1952,BAFTA,Best Film,false
0,Singin' in the Rain,1952,BAFTA,Best Film,false
0,A Streetcar Named Desire,1952,BAFTA,Best Film,false
0,Viva Zapata!,1952,BAFTA,Best Film,false
0,La Ronde,1951,BAFTA,Best Film,true
0,An American in Paris,1951,BAFTA,Best Film,false
0,The Browning Version,1951,BAFTA,Best Film,false
0,Detective Story,1951,BAFTA,Best Film,false
0,Fourteen Hours,1951,BAFTA,Best Film,false
0,The Lavender Hill Mob,1951,BAFTA,Best Film,false
0,The Magic Box,1951,BAFTA,Best Film,false
0,The Man in the White Suit,1951,BAFTA,Best Film,false
0,A Walk in the Sun,1951,BAFTA,Best Film,false
0,All About Eve,1950,BAFTA,Best Film,true
0,The Asphalt Jungle,1950,BAFTA,Best Film,false
0,Beauty and the Beast,1950,BAFTA,Best Film,false
0,The Men,1950,BAFTA,Best Film,false
0,On the Town,1950,BAFTA,Best Film,false
0,Orpheus,1950,BAFTA,Best Film,false
0,Sunset Boulevard,1950,BAFTA,Best Film,false
0,Anne of the Thousand Days,1969,Golden Globe,Best Drama,true
0,Butch Cassidy and the Sundance Kid,1969,Golden Globe,Best Drama,false
0,Midnight Cowboy,1969,Golden Globe,Best Drama,false
0,The Prime of Miss Jean Brodie,1969,Golden Globe,Best Drama,false
0,They Shoot Horses Don't They?,1969,Golden Globe,Best Drama,false
0,The Secret of Santa Vittoria,1969,Golden Globe,Best Comedy/Musical,true
0,Cactus Flower,1969,Golden Globe,Best Comedy/Musical,false
0,Goodbye Columbus,1969,Golden Globe,Best Comedy/Musical,false
0,Hello Dolly!,1969,Golden Globe,Best Comedy/Musical,false
0,Paint Your Wagon,1969,Golden Globe,Best Comedy/Musical,false
0,The Lion in Winter,1968,Golden Globe,Best Drama,true
0,Charly,1968,Golden Globe,Best Drama,false
0,The Fixer,1968,Golden Globe,Best Drama,false
0,The Heart Is a Lonely Hunter,1968,Golden Globe,Best Drama,false
0,The Shoes of the Fisherman,1968,Golden Globe,Best Drama,false
0,Oliver!,1968,Golden Globe,Best Comedy/Musical,true
0,Finian's Rainbow,1968,Golden Globe,Best Comedy/Musical,false
0,Funny Girl,1968,Golden Globe,Best Comedy/Musical,false
0,The Odd Couple,1968,Golden Globe,Best Comedy/Musical,false
0,Yours Mine and Ours,1968,Golden Globe,Best Comedy/Musical,false
0,In the Heat of the Night,1967,Golden Globe,Best Drama,true
0,Bonnie and Clyde,1967,Golden Globe,Best Drama,false
0,Far from the Madding Crowd,1967,Golden Globe,Best Drama,false
0,Guess Who's Coming to Dinner,1967,Golden Globe,Best Drama,false
0,In Cold Blood,1967,Golden Globe,Best Drama,false
0,The Graduate,1967,Golden Globe,Best Comedy/Musical,true
0,Camelot,1967,Golden Globe,Best Comedy/Musical,false
0,Doctor Dolittle,1967,Golden Globe,Best Comedy/Musical,false
0,The Taming of the Shrew,1967,Golden Globe,Best Comedy/Musical,false
0,Thoroughly Modern Millie,1967,Golden Globe,Best Comedy/Musical,false
0,A Man for All Seasons,1966,Golden Globe,Best Drama,true
0,Born Free,1966,Golden Globe,Best Drama,false
0,The Professionals,1966,Golden Globe,Best Drama,false
0,The Sand Pebbles,1966,Golden Globe,Best Drama,false
0,Who's Afraid of Virginia Woolf?,1966,Golden Globe,Best Drama,false
0,The Russians Are Coming the Russians Are Coming,1966,Golden Globe,Best Comedy/Musical,true
0,Alfie,1966,Golden Globe,Best Comedy/Musical,false
0,Georgy Girl,1966,Golden Globe,Best Comedy/Musical,false
0,Gambit,1966,Golden Globe,Best Comedy/Musical,false
0,A Funny Thing Happened on the Way to the Forum,1966,Golden Globe,Best Comedy/Musical,false
0,Doctor Zhivago,1965,Golden Globe,Best Drama,true
0,The Collector,1965,Golden Globe,Best Drama,false
0,The Flight of the Phoenix,1965,Golden Globe,Best Drama,false
0,A Patch of Blue,1965,Golden Globe,Best Drama,false
0,Ship of Fools,1965,Golden Globe,Best Drama,false
0,The Sound of Music,1965,Golden Globe,Best Comedy/Musical,true
0,Cat Ballou,1965,Golden Globe,Best Comedy/Musical,false
0,The Great Race,1965,Golden Globe,Best Comedy/Musical,false
0,Those Magnificent Men in Their Flying Machines,1965,Golden Globe,Best Comedy/Musical,false
0,A Thousand Clowns,1965,Golden Globe,Best Comedy/Musical,false
0,Becket,1964,Golden Globe,Best Drama,true
0,The Chalk Garden,1964,Golden Globe,Best Drama,false
0,Dear Heart,1964,Golden Globe,Best Drama,false
0,The Night of the Iguana,1964,Golden Globe,Best Drama,false
0,Zorba the Greek,1964,Golden Globe,Best Drama,false
0,My Fair Lady,1964,Golden Globe,Best Comedy/Musical,true
0,Father Goose,1964,Golden Globe,Best Comedy/Musical,false
0,Mary Poppins,1964,Golden Globe,Best Comedy/Musical,false
0,The Unsinkable Molly Brown,1964,Golden Globe,Best Comedy/Musical,false
0,The World of Henry Orient,1964,Golden Globe,Best Comedy/Musical,false
0,The Cardinal,1963,Golden Globe,Best Drama,true
0,America America,1963,Golden Globe,Best Drama,false
0,Captain Newman M.D.,1963,Golden Globe,Best Drama,false
0,The Caretakers,1963,Golden Globe,Best Drama,false
0,Cleopatra,1963,Golden Globe,Best Drama,false
0,Lilies of the Field,1963,Golden Globe,Best Drama,false
0,Hud,1963,Golden Globe,Best Drama,false
0,Tom Jones,1963,Golden Globe,Best Comedy/Musical,true
0,Bye Bye Birdie,1963,Golden Globe,Best Comedy/Musical,false
0,Irma la Douce,1963,Golden Globe,Best Comedy/Musical,false
0,It's a Mad Mad Mad Mad World,1963,Golden Globe,Best Comedy/Musical,false
0,A Ticklish Affair,1963,Golden Globe,Best Comedy/Musical,false
0,Under the Yum Yum Tree,1963,Golden Globe,Best Comedy/Musical,false
0,Lawrence of Arabia,1962,Golden Globe,Best Drama,true
0,The Chapman Report,1962,Golden Globe,Best Drama,false
0,Days of Wine and Roses,1962,Golden Globe,Best Drama,false
0,Freud,1962,Golden Globe,Best Drama,false
0,Hemingway's Adventures of a Young Man,1962,Golden Globe,Best Drama,false
0,Lisa,1962,Golden Globe,Best Drama,false
0,The Longest Day,1962,Golden Globe,Best Drama,false
0,The Miracle Worker,1962,Golden Globe,Best Drama,false
0,Mutiny on the Bounty,1962,Golden Globe,Best Drama,false
0,To Kill a Mockingbird,1962,Golden Globe,Best Drama,false
0,The Music Man,1962,Golden Globe,Best Comedy/Musical,true
0,Billy Rose's Jumbo,1962,Golden Globe,Best Comedy/Musical,false
0,Boys' Night Out,1962,Golden Globe,Best Comedy/Musical,false
0,Gypsy,1962,Golden Globe,Best Comedy/Musical,false
0,That Touch of Mink,1962,Golden Globe,Best Comedy/Musical,false
0,The Wonderful World of the Brothers Grimm,1962,Golden Globe,Best Comedy/Musical,false
0,The Guns of Navarone,1961,Golden Globe,Best Drama,true
0,El Cid,1961,Golden Globe,Best Drama,false
0,Fanny,1961,Golden Globe,Best Drama,false
0,Judgment at Nuremberg,1961,Golden Globe,Best Drama,false
0,Splendor in the Grass,1961,Golden Globe,Best Drama,false
0,A Majority of One,1961,Golden Globe,Best Comedy/Musical,true
0,Breakfast at Tiffany's,1961,Golden Globe,Best Comedy/Musical,false
0,One Two Three,1961,Golden Globe,Best Comedy/Musical,false
0,The Parent Trap,1961,Golden Globe,Best Comedy/Musical,false
0,Pocketful of Miracles,1961,Golden Globe,Best Comedy/Musical,false
0,Spartacus,1960,Golden Globe,Best Drama,true
0,Elmer Gantry,1960,Golden Globe,Best Drama,false
0,Inherit the Wind,1960,Golden Globe,Best Drama,false
0,Sons and Lovers,1960,Golden Globe,Best Drama,false
0,Sunrise at Campobello,1960,Golden Globe,Best Drama,false
0,The Apartment,1960,Golden Globe,Best Comedy/Musical,true
0,The Facts of Life,1960,Golden Globe,Best Comedy/Musical,false
0,The Grass Is Greener,1960,Golden Globe,Best Comedy/Musical,false
0,It Started in Naples,1960,Golden Globe,Best Comedy/Musical,false
0,Our Man in Havana,1960,Golden Globe,Best Comedy/Musical,false
0,Ben-Hur,1959,Golden Globe,Best Drama,true
0,Anatomy of a Murder,1959,Golden Globe,Best Drama,false
0,The Diary of Anne Frank,1959,Golden Globe,Best Drama,false
0,The Nun's Story,1959,Golden Globe,Best Drama,false
0,On the Beach,1959,Golden Globe,Best Drama,false
0,Some Like It Hot,1959,Golden Globe,Best Comedy/Musical,true
0,But Not for Me,1959,Golden Globe,Best Comedy/Musical,false
0,Operation Petticoat,1959,Golden Globe,Best Comedy/Musical,false
0,Pillow Talk,1959,Golden Globe,Best Comedy/Musical,false
0,Who Was That Lady?,1959,Golden Globe,Best Comedy/Musical,false
0,The Defiant Ones,1958,Golden Globe,Best Drama,true
0,Cat on a Hot Tin Roof,1958,Golden Globe,Best Drama,false
0,Home Before Dark,1958,Golden Globe,Best Drama,false
0,I Want to Live!,1958,Golden Globe,Best Drama,false
0,Separate Tables,1958,Golden Globe,Best Drama,false
0,Auntie Mame,1958,Golden Globe,Best Comedy/Musical,true
0,Bell Book and Candle,1958,Golden Globe,Best Comedy/Musical,false
0,Indiscreet,1958,Golden Globe,Best Comedy/Musical,false
0,Me and the Colonel,1958,Golden Globe,Best Comedy/Musical,false
0,The Perfect Furlough,1958,Golden Globe,Best Comedy/Musical,false
0,The Bridge on the River Kwai,1957,Golden Globe,Best Drama,true
0,12 Angry Men,1957,Golden Globe,Best Drama,false
0,Peyton Place,1957,Golden Globe,Best Drama,false
0,Sayonara,1957,Golden Globe,Best Drama,false
0,Wild Is the Wind,1957,Golden Globe,Best Drama,false
0,Les Girls,1957,Golden Globe,Best Comedy/Musical,true
0,Don't Go Near the Water,1957,Golden Globe,Best Comedy/Musical,false
0,Love in the Afternoon,1957,Golden Globe,Best Comedy/Musical,false
0,Pal Joey,1957,Golden Globe,Best Comedy/Musical,false
0,Silk Stockings,1957,Golden Globe,Best Comedy/Musical,false
0,Around the World in 80 Days,1956,Golden Globe,Best Drama,true
0,Giant,1956,Golden Globe,Best Drama,false
0,Lust for Life,1956,Golden Globe,Best Drama,false
0,The Rainmaker,1956,Golden Globe,Best Drama,false
0,War and Peace,1956,Golden Globe,Best Drama,false
0,The King and I,1956,Golden Globe,Best Comedy/Musical,true
0,Bus Stop,1956,Golden Globe,Best Comedy/Musical,false
0,The Opposite Sex,1956,Golden Globe,Best Comedy/Musical,false
0,The Solid Gold Cadillac,1956,Golden Globe,Best Comedy/Musical,false
0,The Teahouse of the August Moon,1956,Golden Globe,Best Comedy/Musical,false
0,East of Eden,1955,Golden Globe,Best Drama,true
0,Guys and Dolls,1955,Golden Globe,Best Comedy/Musical,true
0,On the Waterfront,1954,Golden Globe,Best Drama,true
0,Carmen Jones,1954,Golden Globe,Best Comedy/Musical,true
0,The Robe,1953,Golden Globe,Best Drama,true
0,The Greatest Show on Earth,1952,Golden Globe,Best Drama,true
0,With a Song in My Heart,1952,Golden Globe,Best Comedy/Musical,true
0,A Place in the Sun,1951,Golden Globe,Best Drama,true
0,An American in Paris,1951,Golden Globe,Best Comedy/Musical,true
0,Sunset Boulevard,1950,Golden Globe,Best Drama,true
0,sex lies and videotape,1989,Cannes,Palme d'Or,true
0,Do the Right Thing,1989,Cannes,Palme d'Or,false
0,Cinema Paradiso,1989,Cannes,Palme d'Or,false
0,Mystery Train,1989,Cannes,Palme d'Or,false
0,Sweetie,1989,Cannes,Palme d'Or,false
0,Time of the Gypsies,1989,Cannes,Palme d'Or,false
0,Pelle the Conqueror,1988,Cannes,Palme d'Or,true
0,Bird,1988,Cannes,Palme d'Or,false
0,A World Apart,1988,Cannes,Palme d'Or,false
0,Drowning by Numbers,1988,Cannes,Palme d'Or,false
0,Short Film About Killing,1988,Cannes,Palme d'Or,false
0,Under the Sun of Satan,1987,Cannes,Palme d'Or,true
0,Wings of Desire,1987,Cannes,Palme d'Or,false
0,The Glass Menagerie,1987,Cannes,Palme d'Or,false
0,Barfly,1987,Cannes,Palme d'Or,false
0,Shinran: Path to Purity,1987,Cannes,Palme d'Or,false
0,The Mission,1986,Cannes,Palme d'Or,true
0,The Sacrifice,1986,Cannes,Palme d'Or,false
0,Down by Law,1986,Cannes,Palme d'Or,false
0,After Hours,1986,Cannes,Palme d'Or,false
0,Mona Lisa,1986,Cannes,Palme d'Or,false
0,Runaway Train,1986,Cannes,Palme d'Or,false
0,When Father Was Away on Business,1985,Cannes,Palme d'Or,true
0,Birdy,1985,Cannes,Palme d'Or,false
0,Pale Rider,1985,Cannes,Palme d'Or,false
0,Kiss of the Spider Woman,1985,Cannes,Palme d'Or,false
0,Mask,1985,Cannes,Palme d'Or,false
0,The Purple Rose of Cairo,1985,Cannes,Palme d'Or,false
0,Paris Texas,1984,Cannes,Palme d'Or,true
0,Under the Volcano,1984,Cannes,Palme d'Or,false
0,Voyage to Cythera,1984,Cannes,Palme d'Or,false`;

const lines = csv.trim().split('\n').slice(1);
const unique = new Map();
const entries = [];

lines.forEach(line => {
  // Parse: 0,title,year,festival,category,won
  const match = line.match(/^0,(.+),(\d{4}),(.+),(.+),(true|false)$/);
  if (!match) { console.error('PARSE FAIL:', line); return; }
  const [, title, year, festival, category, won] = match;
  entries.push({ title, year: parseInt(year), festival, category, won: won === 'true' });
  const key = title + '|' + year;
  if (!unique.has(key)) unique.set(key, { title, year });
});

console.log('Total CSV entries:', entries.length);
console.log('Unique movies:', unique.size);

// Output unique movies as JSON
const fs = require('fs');
fs.writeFileSync('tmdb-lookup-list.json', JSON.stringify(Array.from(unique.values()), null, 2));
console.log('Wrote tmdb-lookup-list.json');

// Also save the full parsed entries
fs.writeFileSync('awards-csv-parsed.json', JSON.stringify(entries, null, 2));
console.log('Wrote awards-csv-parsed.json');
