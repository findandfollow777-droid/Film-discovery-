#!/usr/bin/env node

// build-nebula-index.js
// Generates an index file for quick nebula data lookups
// Run this after generating nebula data files

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NEBULA_DATA_DIR = join(__dirname, 'nebula-data');
const INDEX_FILE = join(NEBULA_DATA_DIR, 'index.json');

/**
 * Get the top word from word frequency data
 * @param {Object} wordFrequency - Object mapping words to counts
 * @returns {string} The most frequent word
 */
function getTopWord(wordFrequency) {
  if (!wordFrequency || Object.keys(wordFrequency).length === 0) {
    return 'unknown';
  }

  const entries = Object.entries(wordFrequency);
  entries.sort((a, b) => b[1] - a[1]); // Sort by count descending

  return entries[0][0]; // Return the word with highest count
}

/**
 * Scan nebula data directory and build index
 */
async function buildNebulaIndex() {
  console.log('🔍 Scanning nebula-data directory...');

  try {
    // Read all files in nebula-data directory
    const files = await readdir(NEBULA_DATA_DIR);

    // Filter for JSON files (excluding index.json itself)
    const nebulaFiles = files.filter(file =>
      extname(file) === '.json' && file !== 'index.json'
    );

    console.log(`📊 Found ${nebulaFiles.length} nebula data files`);

    const movies = {};
    let processedCount = 0;
    let errorCount = 0;

    // Process each nebula data file
    for (const file of nebulaFiles) {
      try {
        const filePath = join(NEBULA_DATA_DIR, file);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Validate required fields
        if (!data.movieId || !data.title) {
          console.warn(`⚠️  Skipping ${file}: Missing movieId or title`);
          errorCount++;
          continue;
        }

        // Extract key information
        const movieId = String(data.movieId);
        const title = data.title;
        const topWord = getTopWord(data.wordFrequency);
        const reviewCount = data.reviews ? data.reviews.length : 0;

        // Add to index
        movies[movieId] = {
          title,
          topWord,
          reviewCount
        };

        processedCount++;

        // Progress indicator
        if (processedCount % 50 === 0) {
          console.log(`  ✓ Processed ${processedCount} files...`);
        }

      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        errorCount++;
      }
    }

    // Build index object
    const index = {
      generatedAt: new Date().toISOString(),
      totalMovies: Object.keys(movies).length,
      movies
    };

    // Write index file
    await writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

    console.log('\n✅ Index generation complete!');
    console.log(`   Total movies indexed: ${index.totalMovies}`);
    console.log(`   Errors encountered: ${errorCount}`);
    console.log(`   Index file: ${INDEX_FILE}`);

    // Show sample of indexed movies
    console.log('\n📝 Sample entries:');
    const sampleIds = Object.keys(movies).slice(0, 5);
    sampleIds.forEach(id => {
      const movie = movies[id];
      console.log(`   ${id}: "${movie.title}" - top word: "${movie.topWord}" (${movie.reviewCount} reviews)`);
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: nebula-data directory not found at ${NEBULA_DATA_DIR}`);
      console.error('   Make sure to run this script from the project root.');
      process.exit(1);
    } else {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    }
  }
}

// Run the script
console.log('🌌 Nebula Data Index Builder\n');
buildNebulaIndex();
