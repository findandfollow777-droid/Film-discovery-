const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "nebula-data");
const REPORT_PATH = path.join(__dirname, "nebula-word-report.json");

// Stop words to filter out
const STOP_WORDS = new Set([
  // Articles, prepositions, conjunctions
  "the", "a", "an", "is", "it", "its", "and", "of", "to", "in", "for", "with",
  "this", "that", "on", "at", "by", "from", "as", "or", "but", "not", "no",
  "so", "if", "be", "was", "were", "been", "are", "am", "has", "had", "have",
  "do", "does", "did", "will", "would", "could", "should", "can", "may",
  "might", "shall", "being", "than", "then", "just", "about", "into", "up",
  "out", "down", "over", "after", "before", "between", "through", "each",
  "every", "all", "both", "more", "most", "other", "some", "such", "only",
  "same", "very", "too", "also", "own", "my", "your", "our", "his", "her",
  "their", "its", "me", "you", "us", "him", "them", "we", "they", "i",
  "who", "what", "which", "where", "when", "how", "why",

  // Generic film words
  "movie", "film", "watch", "watched", "watching", "scene", "scenes",
  "story", "plot", "character", "characters", "acting", "director",
  "ending", "movies", "films",

  // Filler words
  "really", "absolutely", "definitely", "completely", "totally", "quite",
  "pretty", "simply", "truly", "just", "ever", "even", "still", "already",
  "much", "many", "enough",

  // Common verbs
  "makes", "feels", "thinks", "got", "get", "made", "make", "feel",
  "think", "go", "goes", "went", "come", "comes", "came", "take",
  "takes", "took", "give", "gives", "gave", "see", "sees", "saw",
  "know", "knows", "knew", "want", "wants", "wanted", "need", "needs",
  "keep", "keeps", "kept", "let", "puts", "put",
]);

// Known phrases to detect as single units
const KNOWN_PHRASES = [
  "fast paced", "slow burn", "edge of seat", "must watch", "must see",
  "top notch", "well crafted", "heart wrenching", "gut wrenching",
  "nail biting", "jaw dropping", "mind blowing", "thought provoking",
  "spine tingling", "tear jerker", "feel good", "non stop", "next level",
  "edge of your seat", "once in a lifetime", "all time",
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function detectPhrases(reviews) {
  const phraseCounts = {};

  for (const review of reviews) {
    const lower = review.toLowerCase();

    // Check known phrases
    for (const phrase of KNOWN_PHRASES) {
      if (lower.includes(phrase)) {
        const key = phrase.replace(/\s+/g, "-");
        phraseCounts[key] = (phraseCounts[key] || 0) + 1;
      }
    }
  }

  // Detect bigrams (two consecutive non-stop-words appearing 2+ times)
  const bigramCounts = {};
  for (const review of reviews) {
    const words = tokenize(review);
    for (let i = 0; i < words.length - 1; i++) {
      if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
        const bigram = `${words[i]}-${words[i + 1]}`;
        bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
      }
    }
  }

  // Add bigrams appearing 2+ times
  for (const [bigram, count] of Object.entries(bigramCounts)) {
    if (count >= 2 && !phraseCounts[bigram]) {
      phraseCounts[bigram] = count;
    }
  }

  return phraseCounts;
}

function calculateWordFrequencies(reviews) {
  const wordCounts = {};

  // First detect phrases
  const phrases = detectPhrases(reviews);

  // Count individual words (excluding stop words)
  for (const review of reviews) {
    const words = tokenize(review);
    const counted = new Set(); // avoid counting same word twice in one review

    for (const word of words) {
      if (!STOP_WORDS.has(word) && !counted.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        counted.add(word);
      }
    }
  }

  // Merge phrases into word counts
  for (const [phrase, count] of Object.entries(phrases)) {
    wordCounts[phrase] = (wordCounts[phrase] || 0) + count;
  }

  return wordCounts;
}

function getTopWords(wordFreq, limit = 5) {
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function processAllMovies() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.error("No movie data files found.");
    process.exit(1);
  }

  console.log(`Processing ${files.length} movie files...\n`);

  // Global word tracking for the report
  const globalWordCounts = {}; // word -> total count
  const globalWordMovies = {}; // word -> set of movieIds
  let totalReviews = 0;
  const allUniqueWords = new Set();
  let totalUniquePerMovie = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.reviews || data.reviews.length === 0) {
      console.log(`Skipping ${file}: no reviews`);
      continue;
    }

    totalReviews += data.reviews.length;

    const wordFreq = calculateWordFrequencies(data.reviews);
    const topWords = getTopWords(wordFreq);

    // Update movie file
    data.wordFrequency = wordFreq;
    data.topWords = topWords;
    data.processedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Update global stats
    const uniqueWordsThisMovie = Object.keys(wordFreq).length;
    totalUniquePerMovie += uniqueWordsThisMovie;

    for (const [word, count] of Object.entries(wordFreq)) {
      allUniqueWords.add(word);
      globalWordCounts[word] = (globalWordCounts[word] || 0) + count;
      if (!globalWordMovies[word]) globalWordMovies[word] = new Set();
      globalWordMovies[word].add(data.movieId);
    }

    console.log(
      `Processed: ${data.title} — ${uniqueWordsThisMovie} unique words, top: [${topWords.join(", ")}]`
    );
  }

  // Build summary report
  const mostCommonWords = Object.entries(globalWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, count]) => ({
      word,
      count,
      inMovies: globalWordMovies[word].size,
    }));

  const report = {
    totalMovies: files.length,
    totalReviews,
    totalUniqueWords: allUniqueWords.size,
    averageUniqueWordsPerMovie:
      files.length > 0
        ? Math.round(totalUniquePerMovie / files.length)
        : 0,
    mostCommonWords,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`\n--- Word Processing Complete ---`);
  console.log(`Movies processed: ${files.length}`);
  console.log(`Total reviews: ${totalReviews}`);
  console.log(`Total unique words: ${allUniqueWords.size}`);
  console.log(`Avg unique words/movie: ${report.averageUniqueWordsPerMovie}`);
  console.log(`Report saved to: ${REPORT_PATH}`);
  console.log(`\nTop 10 most common words:`);

  mostCommonWords.slice(0, 10).forEach((w, i) => {
    console.log(
      `  ${i + 1}. "${w.word}" — ${w.count} total, in ${w.inMovies} movies`
    );
  });
}

processAllMovies();
