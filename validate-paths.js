#!/usr/bin/env node

/**
 * ORBIT Path Validator
 * Scans HTML and CSS files for broken path references.
 * JS files are checked only for static fetch() calls with literal paths.
 *
 * Usage:  node validate-paths.js [--verbose]
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const verbose = process.argv.includes('--verbose');

// ── helpers ──────────────────────────────────────────────────────────────

function globFiles(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'nebula-data'].includes(entry.name)) continue;
      globFiles(full, exts, results);
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function shouldIgnore(ref) {
  if (!ref) return true;
  if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('//')) return true;
  if (ref.startsWith('data:')) return true;
  if (ref.startsWith('#')) return true;
  if (ref.startsWith('javascript:')) return true;
  if (ref.startsWith('mailto:')) return true;
  if (ref.includes('${')) return true;          // template literal
  if (ref.includes('`')) return true;
  if (ref.startsWith('%23')) return true;        // URL-encoded # in inline SVGs
  if (ref === '') return true;
  return false;
}

function clean(ref) {
  let r = ref.trim().replace(/['"]/g, '');
  // strip query string
  const qi = r.indexOf('?');
  if (qi >= 0) r = r.substring(0, qi);
  // strip fragment
  const hi = r.indexOf('#');
  if (hi >= 0) r = r.substring(0, hi);
  return r;
}

function resolveRef(sourceFile, ref) {
  return path.resolve(path.dirname(sourceFile), ref);
}

// ── extractors ───────────────────────────────────────────────────────────

function extractHtmlRefs(content) {
  const refs = [];
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(content)) !== null) refs.push(m[1]);
  return refs;
}

function extractCssRefs(content) {
  const refs = [];
  // @import url('...') or @import '...'
  const importRe = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?/gi;
  let m;
  while ((m = importRe.exec(content)) !== null) refs.push(m[1]);
  // url(...) in properties — skip inline data and http
  const urlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  while ((m = urlRe.exec(content)) !== null) {
    const val = m[1].trim();
    if (!val.startsWith('data:') && !val.startsWith('http') && !val.startsWith('%23') && !val.startsWith('#')) {
      refs.push(val);
    }
  }
  return refs;
}

/**
 * For JS we only check static fetch() calls with literal string paths.
 * Navigation (window.location) uses dynamic OrbitUtils.ROOT so we skip those.
 */
function extractJsFetchRefs(content) {
  const refs = [];
  const re = /fetch\(\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(content)) !== null) refs.push(m[1]);
  return refs;
}

// ── main ─────────────────────────────────────────────────────────────────

let totalChecked = 0;
let totalBroken = 0;
const brokenFiles = {};

function checkFile(filePath, extractor) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const refs = extractor(content);
  const rel = path.relative(ROOT, filePath);

  // Skip self
  if (rel === 'validate-paths.js') return;

  for (const raw of refs) {
    if (shouldIgnore(raw)) continue;
    const cleaned = clean(raw);
    if (!cleaned || shouldIgnore(cleaned)) continue;

    // Skip bare words (not paths): e.g. font format strings
    if (/^[a-z0-9-]+$/i.test(cleaned) && !cleaned.includes('/') && !cleaned.includes('.')) continue;

    const resolved = resolveRef(filePath, cleaned);
    totalChecked++;

    if (!fs.existsSync(resolved)) {
      totalBroken++;
      if (!brokenFiles[rel]) brokenFiles[rel] = [];
      brokenFiles[rel].push(cleaned);
    } else if (verbose) {
      console.log(`  \x1b[32m✓\x1b[0m ${cleaned}`);
    }
  }
}

console.log('\n\x1b[1mORBIT Path Validator\x1b[0m\n');

const htmlFiles = globFiles(ROOT, ['.html']);
console.log(`Scanning ${htmlFiles.length} HTML files...`);
for (const f of htmlFiles) {
  if (verbose) console.log(`\n\x1b[36m${path.relative(ROOT, f)}\x1b[0m`);
  checkFile(f, extractHtmlRefs);
}

const cssFiles = globFiles(ROOT, ['.css']);
console.log(`Scanning ${cssFiles.length} CSS files...`);
for (const f of cssFiles) {
  if (verbose) console.log(`\n\x1b[36m${path.relative(ROOT, f)}\x1b[0m`);
  checkFile(f, extractCssRefs);
}

const jsFiles = globFiles(ROOT, ['.js', '.mjs']);
console.log(`Scanning ${jsFiles.length} JS files...`);
for (const f of jsFiles) {
  if (verbose) console.log(`\n\x1b[36m${path.relative(ROOT, f)}\x1b[0m`);
  checkFile(f, extractJsFetchRefs);
}

// ── report ───────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));

if (totalBroken === 0) {
  console.log(`\n\x1b[32mAll ${totalChecked} path references resolved successfully.\x1b[0m\n`);
} else {
  console.log(`\n\x1b[31m${totalBroken} broken references found (out of ${totalChecked} checked):\x1b[0m\n`);
  for (const [file, refs] of Object.entries(brokenFiles)) {
    console.log(`  \x1b[33m${file}\x1b[0m`);
    for (const ref of refs) {
      console.log(`    \x1b[31m✗\x1b[0m ${ref}`);
    }
  }
  console.log('');
}

process.exit(totalBroken > 0 ? 1 : 0);
