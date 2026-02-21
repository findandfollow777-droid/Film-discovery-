#!/usr/bin/env node

// ============================================
// MASTERMIND AI Question Generator
// Generates Directors, Oscars, Quotes, and
// Actor Roles trivia via Claude Haiku.
//
// Prerequisites:
//   npm install @anthropic-ai/sdk
//   export ANTHROPIC_API_KEY=your_key_here
//
// Usage: node scripts/generate-mastermind-ai.js
// Output: games/mastermind-ai-questions.js
// ============================================

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const MODEL = 'claude-haiku-4-5-20251001';
const BATCHES_PER_TOPIC = 10; // 10 × 20 = 200 raw questions per topic

// ============================================
// Prompts
// ============================================

const SYSTEM_PROMPT = `You are a movie trivia question writer for a fast-paced quiz game. Generate exactly 20 multiple-choice questions.

Rules:
- Each question has exactly 1 correct answer and 3 plausible wrong answers
- Questions should range from medium to hard difficulty
- Wrong answers must be believable — they should be real names/films/facts, just not the correct one
- No duplicate questions within this batch
- Aim for variety across decades (1950s–2020s)
- Focus on well-known films that a movie enthusiast would recognise

Output ONLY a valid JSON array, no other text:
[
  { "q": "Question?", "a": "Correct Answer", "wrong": ["Wrong1", "Wrong2", "Wrong3"] },
  ...
]`;

const TOPIC_PROMPTS = {
  directors: `Generate 20 film director trivia questions. Types to mix:
- "Who directed [Movie]?"
- "[Director] did NOT direct which of these films?"
- "Which director made both [Film A] and [Film B]?"
- "[Movie] was whose directorial debut?"
Focus on major directors: Spielberg, Scorsese, Kubrick, Nolan, Coppola, Tarantino, Fincher, Villeneuve, PTA, Wes Anderson, Ridley Scott, Hitchcock, Kurosawa, Cameron, the Coens, Soderbergh, Ang Lee, Greta Gerwig, Barry Jenkins, etc.`,

  oscars: `Generate 20 Academy Awards trivia questions. Types to mix:
- "Which film won Best Picture in [Year]?"
- "[Actor/Actress] won Best Actor/Actress for which film?"
- "Which film was NOT nominated for Best Picture in [Year]?"
- "Who won Best Director for [Film]?"
- "[Film] won how many Oscars?"
Focus on ceremonies from 1970–2025. Use real winners and nominees only. Include Best Picture, Best Director, Best Actor, Best Actress, Best Supporting Actor/Actress.`,

  quotes: `Generate 20 famous movie quote trivia questions. Types to mix:
- "Which movie features the line: '[quote]'?"
- "Who said '[quote]' in [Movie]?"
- "Complete the quote from [Movie]: '[partial quote]...'"
Use iconic, well-known quotes that movie fans would recognise. Span decades from 1940s–2020s. Include both classic and modern films.`,

  actors: `Generate 20 actor/actress role trivia questions. Types to mix:
- "Who played [Character] in [Movie]?"
- "[Actor] has NOT appeared in which of these films?"
- "Which actor starred in both [Film A] and [Film B]?"
- "[Actor] played what character in [Movie]?"
Focus on A-list actors with recognisable filmographies. Span decades. Include both men and women.`
};

// ============================================
// Generation
// ============================================

async function generateBatch(topic, batchNum) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `${TOPIC_PROMPTS[topic]}\n\nThis is batch ${batchNum + 1} of ${BATCHES_PER_TOPIC}. Avoid repeating questions from earlier batches — focus on different films/directors/actors each time.`
    }]
  });

  const text = msg.content[0].text.trim();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error(`    JSON parse failed for ${topic} batch ${batchNum + 1}`);
    console.error(`    Response start: ${cleaned.substring(0, 200)}`);
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.error(`    Response was not an array for ${topic} batch ${batchNum + 1}`);
    return [];
  }

  // Validate structure: each item needs q, a, wrong (array of 3)
  return parsed.filter(item => {
    if (!item.q || !item.a || !Array.isArray(item.wrong)) return false;
    if (item.wrong.length < 3) return false;
    // Trim to exactly 3 wrongs
    item.wrong = item.wrong.slice(0, 3);
    return true;
  });
}

// ============================================
// Deduplication
// ============================================

function deduplicateQuestions(questions) {
  const seen = new Set();
  return questions.filter(q => {
    const key = q.q.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================
// Main
// ============================================

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Run: export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  const allQuestions = {};

  for (const [topic, prompt] of Object.entries(TOPIC_PROMPTS)) {
    console.log(`\nGenerating ${topic}...`);
    allQuestions[topic] = [];

    for (let i = 0; i < BATCHES_PER_TOPIC; i++) {
      try {
        const batch = await generateBatch(topic, i);
        allQuestions[topic].push(...batch);
        console.log(`  Batch ${i + 1}/${BATCHES_PER_TOPIC}: ${batch.length} questions`);
      } catch (err) {
        console.error(`  Batch ${i + 1} failed: ${err.message}`);
      }
      // Rate limiting pause between batches
      await new Promise(r => setTimeout(r, 1000));
    }

    // Deduplicate within topic
    allQuestions[topic] = deduplicateQuestions(allQuestions[topic]);
    console.log(`  Total ${topic}: ${allQuestions[topic].length} questions (after dedup)`);
  }

  const output = `// AI-generated trivia for Mastermind
// Generated: ${new Date().toISOString()}
// Model: ${MODEL}
// Directors: ${allQuestions.directors.length} questions
// Oscars: ${allQuestions.oscars.length} questions
// Quotes: ${allQuestions.quotes.length} questions
// Actors: ${allQuestions.actors.length} questions

const AI_DIRECTORS = ${JSON.stringify(allQuestions.directors, null, 2)};

const AI_OSCARS = ${JSON.stringify(allQuestions.oscars, null, 2)};

const AI_QUOTES = ${JSON.stringify(allQuestions.quotes, null, 2)};

const AI_ACTORS = ${JSON.stringify(allQuestions.actors, null, 2)};
`;

  const outPath = path.join(__dirname, '..', 'games', 'mastermind-ai-questions.js');
  fs.writeFileSync(outPath, output, 'utf-8');

  console.log('\n=== SUMMARY ===');
  let total = 0;
  for (const [topic, qs] of Object.entries(allQuestions)) {
    console.log(`  ${topic}: ${qs.length} questions`);
    total += qs.length;
  }
  console.log(`  TOTAL: ${total} questions`);
  console.log(`\nOutput: ${outPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
