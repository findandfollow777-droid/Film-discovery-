// ORBIT – build-time generator for the git-ignored config.js the browser loads.
//
// Why this exists: config.js is git-ignored, so a GitHub-sourced Netlify build has
// no config.js in the repo. This script regenerates it at build time from env vars
// (see the [build] command in netlify.toml), so the deployed site gets the client
// values it needs WITHOUT the key ever being committed.
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

const OUT = join(process.cwd(), "config.js");
const tmdbKey = process.env.TMDB_API_KEY;

if (tmdbKey) {
  // env present → (over)write config.js from the environment value.
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
  console.log("generate-config: wrote config.js from environment (TMDB_API_KEY).");
} else if (existsSync(OUT)) {
  // env absent but a local config.js already exists → leave it untouched.
  // This protects the local dev file (which also holds the local-only Anthropic key).
  console.log("generate-config: TMDB_API_KEY not set; existing config.js left unchanged.");
} else {
  // env absent AND no config.js → fail the build loudly instead of deploying a broken site.
  console.error("generate-config: ERROR — TMDB_API_KEY is not set and no config.js exists.");
  console.error("Set TMDB_API_KEY in the Netlify build environment (Site settings → Environment variables).");
  process.exit(1);
}
