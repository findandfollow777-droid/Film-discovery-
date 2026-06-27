// ORBIT – build-time generator for the browser's TMDB config.
//
// Why this exists: the local config.js is git-ignored, and Netlify applies .gitignore
// to the publish dir — so a generated config.js would be excluded from the deploy and
// 404. Instead this script writes a NON-ignored runtime-config.js at build time from
// env vars, and netlify.toml rewrites /config.js → /runtime-config.js so every page's
// <script src=".../config.js"> resolves to it. The key is never committed.
//
// Scope: emits the TMDB key ONLY. It deliberately never emits an Anthropic key —
// that one must never live in browser-served config.js (the AI-bio call routes
// through netlify/functions/ai-bio.js in production instead).
//
// Safety: this script NEVER prints a key value to stdout/stderr (Netlify build logs
// are public on public repos), and it contains no hardcoded key — values come only
// from the environment.

import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "runtime-config.js");
const tmdbKey = process.env.TMDB_API_KEY;

if (tmdbKey) {
  // env present → (over)write runtime-config.js from the environment value.
  // A single-quoted literal can't safely contain these characters; fail loudly
  // rather than emit malformed JS (TMDB keys are hex, so this should never trip).
  if (/['\\\r\n]/.test(tmdbKey)) {
    console.error("generate-config: ERROR — TMDB_API_KEY contains characters that can't be embedded safely.");
    process.exit(1);
  }

  // Reproduces the exact declaration format pages already expect:
  //   const TMDB_API_KEY = '<value>';   (top-level const, single quotes, semicolon)
  const contents = `// ORBIT – TMDB API Configuration
const TMDB_API_KEY = '${tmdbKey}';
`;

  writeFileSync(OUT, contents);
  console.log("generate-config: wrote runtime-config.js from environment (TMDB_API_KEY).");
} else if (existsSync(OUT)) {
  // env absent but a runtime-config.js already exists → leave it untouched.
  // (The local secret config.js is separate and is never read or written by this script.)
  console.log("generate-config: TMDB_API_KEY not set; existing runtime-config.js left unchanged.");
} else {
  // env absent AND no runtime-config.js → fail the build loudly instead of deploying a broken site.
  console.error("generate-config: ERROR — TMDB_API_KEY is not set and no runtime-config.js exists.");
  console.error("Set TMDB_API_KEY in the Netlify build environment (Site settings → Environment variables).");
  process.exit(1);
}
