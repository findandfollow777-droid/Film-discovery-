const fs = require('fs');
const results = JSON.parse(fs.readFileSync('tmdb-lookup-results.json', 'utf8'));

// Fix 'The Face' 1959 -> Bergman's 'The Magician' (Ansiktet)
results['The Face|1959'] = {
  title: 'The Face',
  year: '1959',
  tmdb_id: 29453,
  poster_path: '/46DEYkr96MxzUmdwgmj2U7gWokZ.jpg',
  tmdb_title: 'The Magician',
  tmdb_year: '1958'
};

// Fix 'A Walk in the Sun' 1951 -> 1945 war film
results['A Walk in the Sun|1951'] = {
  title: 'A Walk in the Sun',
  year: '1951',
  tmdb_id: 43488,
  poster_path: '/uHZX36Ls2rtfMZqX1mmhmbV92R8.jpg',
  tmdb_title: 'A Walk in the Sun',
  tmdb_year: '1945'
};

fs.writeFileSync('tmdb-lookup-results.json', JSON.stringify(results, null, 2));

const nullCount = Object.values(results).filter(v => !v.poster_path).length;
console.log('Fixed 2 entries. Null posters remaining:', nullCount);
