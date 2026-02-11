const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic();
const DATA_DIR = path.join(__dirname, "nebula-data");
const ERROR_LOG = path.join(__dirname, "nebula-generation-errors.log");
const DELAY_MS = 1500;
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1000;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function buildPrompt(title) {
  return `You are generating Orbit Impressions for a movie discovery platform.

TASK: Generate exactly 20 five-word reviews for the movie "${title}".

Respond ONLY with a JSON object in this exact format, no markdown, no backticks:
{
  "reviews": [
    "exactly five words per review",
    ... (20 total)
  ]
}

CRITICAL - WHAT REVIEWS SHOULD BE:
Reviews express REACTIONS, EMOTIONS, and QUALITY JUDGMENTS — how the film made you feel, whether it's good, what kind of experience it delivers.

✓ GOOD examples: "Still processing this emotional masterpiece", "Deserves every award it won", "Left me completely emotionally wrecked", "Cinema at its absolute finest", "Haunted me for weeks after"

✗ BAD examples (DO NOT DO THIS): "Man enters other people's dreams", "Hero saves world from aliens" — these describe PLOT, not reactions.

REVIEW RULES:
- Each review must be EXACTLY 5 words. Hyphenated compounds count as one word.
- NEVER describe plot events. Only express feelings, opinions, quality judgments.
- Mix: emotional impact, quality assessment, rewatchability, viewing experience, recommendations.
- Be specific to THIS film's reputation. Avoid generic praise.
- Maximise vocabulary diversity across the 20 reviews.`;
}

function validateResponse(text, title) {
  let parsed;
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Invalid JSON for "${title}": ${text.substring(0, 200)}`);
  }

  if (!parsed.reviews || !Array.isArray(parsed.reviews)) {
    throw new Error(`No reviews array for "${title}"`);
  }

  if (parsed.reviews.length !== 20) {
    throw new Error(
      `Expected 20 reviews for "${title}", got ${parsed.reviews.length}`
    );
  }

  const issues = [];
  let validCount = 0;

  parsed.reviews.forEach((review, i) => {
    const wc = countWords(review);
    if (wc === 5) {
      validCount++;
    } else {
      issues.push(`Review ${i + 1} has ${wc} words: "${review}"`);
    }
  });

  return {
    reviews: parsed.reviews,
    validation: {
      totalReviews: parsed.reviews.length,
      validFiveWord: validCount,
      issues,
    },
  };
}

function logError(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(ERROR_LOG, `[${timestamp}] ${msg}\n`);
}

async function generateForMovie(movie, index, total) {
  const outputPath = path.join(DATA_DIR, `${movie.id}.json`);

  // Resume capability: skip if already generated
  if (fs.existsSync(outputPath)) {
    console.log(`Skipped ${index + 1}/${total}: ${movie.title} (already exists)`);
    return true;
  }

  const prompt = buildPrompt(movie.title);
  let lastError;

  // Retry once on failure
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].text;
      const { reviews, validation } = validateResponse(text, movie.title);

      const output = {
        movieId: movie.id,
        title: movie.title,
        generatedAt: new Date().toISOString(),
        reviews,
        validation,
      };

      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

      const status = validation.issues.length > 0
        ? `⚠ (${validation.issues.length} word-count issues)`
        : "✓";
      console.log(`Generated ${index + 1}/${total}: ${movie.title} ${status}`);
      return true;
    } catch (err) {
      lastError = err;
      if (attempt === 1) {
        console.log(
          `Retry ${movie.title} (attempt ${attempt} failed: ${err.message})`
        );
        await sleep(2000);
      }
    }
  }

  const errMsg = `FAILED ${movie.title} (id: ${movie.id}): ${lastError.message}`;
  console.error(errMsg);
  logError(errMsg);
  return false;
}

async function main() {
  // Determine which seed file to use
  const args = process.argv.slice(2);
  const seedFile = args.includes("--test")
    ? "nebula-seed-test.json"
    : "nebula-seed-movies.json";

  const seedPath = path.join(__dirname, seedFile);

  if (!fs.existsSync(seedPath)) {
    console.error(`Seed file not found: ${seedPath}`);
    process.exit(1);
  }

  const { movies } = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  console.log(`\nOrbit Nebula Review Generator`);
  console.log(`Seed file: ${seedFile} (${movies.length} movies)`);
  console.log(`Model: ${MODEL}`);
  console.log(`Delay: ${DELAY_MS}ms between requests\n`);

  ensureDir(DATA_DIR);

  let successes = 0;
  let failures = 0;
  let skipped = 0;

  for (let i = 0; i < movies.length; i++) {
    const outputPath = path.join(DATA_DIR, `${movies[i].id}.json`);
    if (fs.existsSync(outputPath)) {
      skipped++;
      console.log(
        `Skipped ${i + 1}/${movies.length}: ${movies[i].title} (already exists)`
      );
      continue;
    }

    const ok = await generateForMovie(movies[i], i, movies.length);
    if (ok) successes++;
    else failures++;

    // Rate limiting delay (skip on last item)
    if (i < movies.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n--- Generation Complete ---`);
  console.log(`Successes: ${successes}`);
  console.log(`Skipped (already existed): ${skipped}`);
  console.log(`Failures: ${failures}`);

  if (failures > 0) {
    console.log(`Check ${ERROR_LOG} for details.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
