// ============================================
// JOURNEYS - Game Logic
// Orbit Games Suite - Six Degrees Connection
// TRUE HONEYCOMB PATH IMPLEMENTATION
// ============================================

// Daily puzzles - curated actor pairs with par values
const DAILY_JOURNEYS = [
  // Week 1 - Classic connections
  { start: { id: 31, name: "Tom Hanks" }, end: { id: 4724, name: "Kevin Bacon" }, par: 2 },
  { start: { id: 6193, name: "Leonardo DiCaprio" }, end: { id: 192, name: "Morgan Freeman" }, par: 3 },
  { start: { id: 1245, name: "Scarlett Johansson" }, end: { id: 380, name: "Robert De Niro" }, par: 3 },
  { start: { id: 287, name: "Brad Pitt" }, end: { id: 514, name: "Jack Nicholson" }, par: 2 },
  { start: { id: 500, name: "Tom Cruise" }, end: { id: 1532, name: "Bill Murray" }, par: 3 },
  { start: { id: 1892, name: "Matt Damon" }, end: { id: 85, name: "Johnny Depp" }, par: 3 },
  { start: { id: 3223, name: "Robert Downey Jr." }, end: { id: 2888, name: "Will Smith" }, par: 3 },

  // Week 2 - Modern stars
  { start: { id: 1136406, name: "Tom Holland" }, end: { id: 16828, name: "Chris Evans" }, par: 2 },
  { start: { id: 30614, name: "Ryan Gosling" }, end: { id: 3894, name: "Christian Bale" }, par: 3 },
  { start: { id: 1190668, name: "Timothée Chalamet" }, end: { id: 6193, name: "Leonardo DiCaprio" }, par: 3 },
  { start: { id: 54693, name: "Emma Stone" }, end: { id: 1245, name: "Scarlett Johansson" }, par: 3 },
  { start: { id: 73457, name: "Chris Pratt" }, end: { id: 31, name: "Tom Hanks" }, par: 3 },
  { start: { id: 505710, name: "Zendaya" }, end: { id: 9273, name: "Amy Adams" }, par: 4 },
  { start: { id: 74568, name: "Chris Hemsworth" }, end: { id: 287, name: "Brad Pitt" }, par: 3 },

  // Week 3 - Challenging paths
  { start: { id: 3490, name: "Adrien Brody" }, end: { id: 2, name: "Mark Hamill" }, par: 4 },
  { start: { id: 5344, name: "Meg Ryan" }, end: { id: 8691, name: "Zoe Saldaña" }, par: 4 }, // Fixed ID
  { start: { id: 738, name: "Sean Connery" }, end: { id: 3223, name: "Robert Downey Jr." }, par: 3 },
  { start: { id: 3084, name: "Marlon Brando" }, end: { id: 500, name: "Tom Cruise" }, par: 3 },
  { start: { id: 4517, name: "Joe Pesci" }, end: { id: 73457, name: "Chris Pratt" }, par: 4 },
  { start: { id: 10409, name: "Shelley Duvall" }, end: { id: 1190668, name: "Timothée Chalamet" }, par: 5 },
  { start: { id: 2176, name: "Tommy Lee Jones" }, end: { id: 54693, name: "Emma Stone" }, par: 4 }
];

// Game state
let gameState = {
  mode: 'menu', // 'menu' | 'daily' | 'challenge' | 'party' | 'duel'
  startActor: null,
  endActor: null,
  par: 3,
  chain: [], // Array of {type: 'actor'|'movie', id, name, photo?, poster?, isStart?, isGoal?}
  currentActor: null,
  searchType: 'movie',
  steps: 0,
  completed: false,
  puzzleNumber: 1,
  lastAddedId: null, // hex-pop animation target — cleared after 600ms
  // Party (Pass & Play) only
  activePlayer: 0,
  players: [
    { name: 'Player 1', steps: 0, chain: [] },
    { name: 'Player 2', steps: 0, chain: [] }
  ],
  // Best-of-N series + rivalry tracking (challenge / duel only)
  seriesLength: 1,    // 1, 3, 5, or 7
  seriesProgress: 0,  // 0-indexed round in the series
  challengeId: null,  // unique id for this round; persisted in localStorage
  replyTo: null,      // parent cid if this round is a reply (counter-challenge)
  senderName: '',     // optional creator-provided sender name (URL param `n`)
  opponentName: ''    // creator-provided "send to" name (saved on share)
};

/* ============================================================
   CHALLENGE STORAGE — Added 2026-05-02
   localStorage key: orbit_my_challenges (see data/storage-keys.md)
   Schema: { sent: [...], received: [...] }
   Each entry: { id, createdAt, startActor, endActor, par, seriesLength,
                 round, replyTo, sentTo?, from?, mySteps?, myChain?,
                 opponentResult?: {steps, completedAt} }
   ============================================================ */
const MY_CHALLENGES_KEY = 'orbit_my_challenges';

function loadMyChallenges() {
  try {
    const raw = localStorage.getItem(MY_CHALLENGES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.sent) && Array.isArray(parsed.received)) {
      return parsed;
    }
  } catch (e) { /* fall through */ }
  return { sent: [], received: [] };
}

function saveMyChallenges(data) {
  try {
    localStorage.setItem(MY_CHALLENGES_KEY, JSON.stringify(data));
  } catch (e) { /* storage full — silently fail */ }
}

function recordSentChallenge(entry) {
  const data = loadMyChallenges();
  // Replace any existing entry with the same id (idempotent on repeat shares)
  data.sent = data.sent.filter(c => c.id !== entry.id).concat(entry);
  saveMyChallenges(data);
}

function recordReceivedChallenge(entry) {
  const data = loadMyChallenges();
  data.received = data.received.filter(c => c.id !== entry.id).concat(entry);
  saveMyChallenges(data);
}

function recordOpponentResult(cid, steps) {
  const data = loadMyChallenges();
  const challenge = data.sent.find(c => c.id === cid);
  if (!challenge) return null;
  challenge.opponentResult = { steps, completedAt: Date.now() };
  saveMyChallenges(data);
  return challenge;
}

function recordMyResult(cid, steps, chain) {
  const data = loadMyChallenges();
  const challenge = data.received.find(c => c.id === cid);
  if (!challenge) return null;
  challenge.mySteps = steps;
  challenge.myChain = chain.map(({ photo, poster, ...rest }) => rest);
  challenge.completedAt = Date.now();
  saveMyChallenges(data);
  return challenge;
}

function newChallengeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getPlayerName(idx) {
  return (gameState.players?.[idx]?.name) || (idx === 0 ? 'Player 1' : 'Player 2');
}

// Cache for filmographies
let filmographyCache = {};

/* ============================================================
   PORTRAIT CACHE — Added 2026-05-02
   sessionStorage key: orbit_journeys_portraits
   Format: { [personId: number]: string | false }
     - string = TMDB profile_path (e.g. "/abc.jpg")
     - false  = TMDB has no portrait for this person
   Purpose: avoid re-fetching /person/{id} for actors picked
   mid-chain whose search result returned a null profile_path.
   See data/storage-keys.md.
   ============================================================ */
const PORTRAIT_CACHE_KEY = 'orbit_journeys_portraits';

function getCachedPortrait(personId) {
  try {
    const cache = JSON.parse(sessionStorage.getItem(PORTRAIT_CACHE_KEY) || '{}');
    return Object.prototype.hasOwnProperty.call(cache, personId) ? cache[personId] : null;
  } catch (e) {
    return null;
  }
}

function cachePortrait(personId, pathOrFalse) {
  try {
    const cache = JSON.parse(sessionStorage.getItem(PORTRAIT_CACHE_KEY) || '{}');
    cache[personId] = pathOrFalse;
    sessionStorage.setItem(PORTRAIT_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // Storage full — silently fail
  }
}

async function fetchAndCachePortrait(personId) {
  const cached = getCachedPortrait(personId);
  if (cached !== null) return cached;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();
    const pathOrFalse = data.profile_path || false;
    cachePortrait(personId, pathOrFalse);
    return pathOrFalse;
  } catch (err) {
    console.error('Portrait fetch failed:', err);
    cachePortrait(personId, false);
    return false;
  }
}

// Validation lock to prevent race conditions during async credit checks
let isValidating = false;

// DOM elements
let parValue, stepsValue;
let honeycombContainer;
let searchInput, searchResults;
let inputHint, currentActorName;
let undoBtn, resetBtn;
let celebrationOverlay, postgameResults;
let headerStatus;

// Honeycomb geometry (flat-top hexagons) — BASE values, scaled per render
const HEX_SIZE = 68; // radius (center to vertex) at scale 1.0
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;

// For SIDE-TOUCHING flat-top hexagons:
const HORIZ_SPACING = HEX_SIZE * 1.5;        // Gameplay spacing
const COMPLETE_SPACING = HEX_SIZE * 1.75;     // Completion spacing (touch, no overlap)
const VERT_OFFSET = HEX_HEIGHT * 0.5;        // Zigzag amount for honeycomb

/* Dynamic hex scaling — prevents overlap on long chains.
   Chain length grows with par; we shrink the hex (and everything that
   scales with it: spacing, labels, image clips) so the path still fits. */
function getHexScale(totalNodes) {
  if (totalNodes <= 7) return 1.0;
  if (totalNodes <= 10) return 0.8;
  if (totalNodes <= 15) return 0.65;
  return 0.5;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  setupEventListeners();
  const incoming = await checkUrlParams();
  if (!incoming) showModeMenu();
});

/* ============================================================
   MODE ROUTER — Added 2026-05-02
   Landing screen offers Daily / Challenge / Pass & Play.
   Game UI sections start hidden and are revealed when a mode
   is picked. Daily is the only mode that writes to journeys_stats
   and journeys_game_${date} — challenge/party are ephemeral.
   ============================================================ */

function showModeMenu() {
  gameState.mode = 'menu';
  document.getElementById('modeMenu').hidden = false;
  document.getElementById('infoBar').hidden = true;
  document.getElementById('honeycombSection').hidden = true;
  document.getElementById('inputSection').hidden = true;
  if (postgameResults) postgameResults.hidden = true;
}

function showGameUI() {
  document.getElementById('modeMenu').hidden = true;
  document.getElementById('infoBar').hidden = false;
  document.getElementById('honeycombSection').hidden = false;
  document.getElementById('inputSection').hidden = false;
}

function setModeTag(text, isDaily, puzzleNum) {
  const modeTag = document.getElementById('modeTag');
  if (isDaily) {
    modeTag.innerHTML = `${text}<span id="puzzleNumber">${puzzleNum != null ? puzzleNum : 1}</span>`;
  } else {
    modeTag.textContent = text;
  }
}

function startMode(mode) {
  gameState.mode = mode;
  const infoBar = document.getElementById('infoBar');
  infoBar.classList.toggle('party-mode', mode === 'party');

  if (mode === 'daily') {
    setModeTag('DAILY JOURNEY #', true);
    showGameUI();
    loadDailyPuzzle();
  } else if (mode === 'challenge') {
    openSetupOverlay('challenge');
  } else if (mode === 'party') {
    openSetupOverlay('party');
  } else if (mode === 'duel') {
    setModeTag('INCOMING CHALLENGE', false);
    showGameUI();
    loadCustomPuzzle(gameState.startActor, gameState.endActor, gameState.par, 'duel');
  }
}

/* ============================================================
   CUSTOM PUZZLE LOADER — Added 2026-05-02
   Used by Challenge and Duel modes (and Pass & Play in Step 4).
   Skips daily-only side effects: trackPlayed, saveTodayState,
   saveStats are all gated on gameState.mode === 'daily'.
   ============================================================ */
async function loadCustomPuzzle(start, end, par, mode) {
  gameState.mode = mode;
  gameState.startActor = { id: start.id, name: start.name };
  gameState.endActor = { id: end.id, name: end.name };
  gameState.par = par;
  gameState.chain = [{ type: 'actor', id: start.id, name: start.name, isStart: true }];
  gameState.currentActor = { id: start.id, name: start.name };
  gameState.steps = 0;
  gameState.completed = false;
  gameState.searchType = 'movie';

  // Mint a challengeId for challenge mode if we don't already have one (a duel
  // mode loads from URL, where cid was set by checkUrlParams).
  if (mode === 'challenge' && !gameState.challengeId) {
    gameState.challengeId = newChallengeId();
  }

  if (parValue) parValue.textContent = par;
  if (stepsValue) stepsValue.textContent = 0;

  await loadActorPhotos();
  setSearchType('movie');
  await loadFilmography(start.id);
  renderHoneycombPath();
  updateUI();
}

/* ============================================================
   SETUP OVERLAY — Added 2026-05-02
   Pick start + goal actors for a Challenge.
   ============================================================ */
let setupSearchDebounced = null;
let setupPickStage = 'start'; // 'start' | 'goal'
// Counter-challenge carry-forward — populated when user clicks Counter-challenge.
let pendingReplyTo = null;
let pendingSeriesLength = null;
let pendingSeriesProgress = null;

function openSetupOverlay(forMode) {
  gameState.mode = forMode; // 'challenge' (Step 4 will add 'party')
  gameState.startActor = null;
  gameState.endActor = null;

  setupPickStage = 'start';
  const titleMap = { challenge: 'CREATE CHALLENGE', party: 'PASS & PLAY' };
  document.getElementById('setupTitle').textContent = titleMap[forMode] || 'NEW JOURNEY';
  document.getElementById('setupInstruction').innerHTML =
    'Pick the <span class="setup-emph-cyan">START</span> actor';
  resetSetupPicks();
  document.getElementById('setupSearch').value = '';
  document.getElementById('setupSearch').placeholder = 'Search Start actor...';
  document.getElementById('setupSearchResults').hidden = true;
  // Restore default UI state (in case user is reopening after previous run)
  document.getElementById('setupSpinnerZone').hidden = true;
  document.getElementById('setupPicks').hidden = false;
  document.getElementById('setupSearchWrap').hidden = false;
  document.getElementById('randomizeBtn').hidden = false;
  document.getElementById('setupConfirmRow').hidden = true;
  // Player name inputs — only relevant for Pass & Play
  const setupNames = document.getElementById('setupNames');
  setupNames.hidden = forMode !== 'party';
  if (forMode === 'party') {
    document.getElementById('player1NameInput').value = '';
    document.getElementById('player2NameInput').value = '';
  }
  // Series selector — only for Create Challenge
  const setupSeries = document.getElementById('setupSeries');
  setupSeries.hidden = forMode !== 'challenge';
  if (forMode === 'challenge') {
    // Carry forward from a counter-challenge, otherwise default to Single (1).
    const desiredLen = pendingSeriesLength != null ? pendingSeriesLength : 1;
    gameState.seriesLength = desiredLen;
    gameState.seriesProgress = pendingSeriesProgress != null ? pendingSeriesProgress : 0;
    gameState.replyTo = pendingReplyTo;
    document.querySelectorAll('.setup-series-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.series) === desiredLen);
    });
    // Clear the carry-forward so a fresh "Create Challenge" later doesn't inherit it.
    pendingReplyTo = null;
    pendingSeriesLength = null;
    pendingSeriesProgress = null;
  } else {
    gameState.seriesLength = 1;
    gameState.seriesProgress = 0;
    gameState.replyTo = null;
  }

  document.getElementById('modeMenu').hidden = true;
  document.getElementById('setupOverlay').hidden = false;
  document.getElementById('setupSearch').focus();

  if (!setupSearchDebounced) initSetupOverlay();
}

function resetSetupPicks() {
  document.getElementById('setupStartPhoto').innerHTML = '<span class="og og-person-bare"></span>';
  document.getElementById('setupGoalPhoto').innerHTML = '<span class="og og-person-bare-gold"></span>';
  document.getElementById('setupStartName').textContent = '—';
  document.getElementById('setupGoalName').textContent = '—';
  document.getElementById('setupStartPick').classList.remove('picked');
  document.getElementById('setupGoalPick').classList.remove('picked');
}

function initSetupOverlay() {
  const setupSearchEl = document.getElementById('setupSearch');
  const setupResultsEl = document.getElementById('setupSearchResults');

  setupSearchDebounced = OrbitUtils.debounce(async () => {
    const query = setupSearchEl.value.trim();
    if (query.length < 2) {
      setupResultsEl.hidden = true;
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const results = (data.results || []).filter(p => p.known_for_department === 'Acting').slice(0, 8);
      if (!results.length) { setupResultsEl.hidden = true; return; }

      setupResultsEl.innerHTML = results.map(p => {
        const photo = p.profile_path ? `${TMDB_IMG}w92${p.profile_path}` : '';
        const safeName = (p.name || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `
          <div class="search-result-item" data-id="${p.id}" data-name="${safeName}" data-photo="${photo}">
            ${photo
              ? `<img class="search-result-img" src="${photo}" alt="">`
              : `<span class="search-result-img og og-person"></span>`}
            <div>
              <div class="search-result-title">${p.name}</div>
              <div class="search-result-sub">${p.known_for_department || 'Actor'}</div>
            </div>
          </div>`;
      }).join('');
      setupResultsEl.hidden = false;

      setupResultsEl.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = parseInt(item.dataset.id);
          const name = item.dataset.name;
          const photo = item.dataset.photo;
          handleSetupPick(id, name, photo);
        });
      });
    } catch (err) {
      console.error('Setup search failed:', err);
    }
  }, 300);

  setupSearchEl.addEventListener('input', setupSearchDebounced);
  document.getElementById('randomizeBtn').addEventListener('click', randomizePath);
  document.getElementById('setupResetBtn').addEventListener('click', resetSetupFlow);
  document.getElementById('setupStartGameBtn').addEventListener('click', beginCustomPuzzleFromSetup);
  document.getElementById('setupOverlay').addEventListener('orbit:close', () => {
    showModeMenu();
  });
  document.getElementById('holdingScreen').addEventListener('orbit:close', () => {
    // Decline incoming challenge → strip URL params, return to menu
    history.replaceState(null, '', window.location.pathname);
    showModeMenu();
  });
  document.getElementById('acceptChallengeBtn').addEventListener('click', () => {
    document.getElementById('holdingScreen').hidden = true;
    startMode('duel');
  });
  document.getElementById('resultBackHomeBtn').addEventListener('click', () => {
    document.getElementById('holdingScreen').hidden = true;
    if (window.location.search) {
      history.replaceState(null, '', window.location.pathname);
    }
    showModeMenu();
  });
  document.getElementById('counterChallengeBtn').addEventListener('click', () => {
    document.getElementById('holdingScreen').hidden = true;
    if (window.location.search) {
      history.replaceState(null, '', window.location.pathname);
    }
    // Carry the series forward — same series length, next round, link to parent cid.
    pendingReplyTo = gameState.challengeId;
    pendingSeriesLength = gameState.seriesLength;
    pendingSeriesProgress = gameState.seriesProgress + 1;
    openSetupOverlay('challenge');
  });

  // Series-selector buttons (challenge mode only, hidden for party)
  document.querySelectorAll('.setup-series-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.setup-series-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      gameState.seriesLength = parseInt(btn.dataset.series) || 1;
    });
  });
  document.getElementById('descrambleBtn').addEventListener('click', startPlayer2Turn);
  document.getElementById('holdingHelpBtn').addEventListener('click', () => {
    document.getElementById('holdingHelp').hidden = false;
  });
  document.getElementById('holdingHelpDismiss').addEventListener('click', () => {
    document.getElementById('holdingHelp').hidden = true;
  });
  document.getElementById('privacyShield').addEventListener('orbit:close', () => {
    // Abandoning mid-handoff — back to menu, drop transient state.
    gameState.players = [{ steps: 0, chain: [] }, { steps: 0, chain: [] }];
    gameState.activePlayer = 0;
    gameState.chain = [];
    gameState.completed = false;
    showModeMenu();
  });
}

function handleSetupPick(id, name, photo) {
  const fallbackGlyph = setupPickStage === 'goal'
    ? '<span class="og og-person-bare-gold"></span>'
    : '<span class="og og-person-bare"></span>';
  const photoHtml = photo
    ? `<img src="${photo}" alt="${name}">`
    : fallbackGlyph;

  if (setupPickStage === 'start') {
    gameState.startActor = { id, name, photo };
    document.getElementById('setupStartPhoto').innerHTML = photoHtml;
    document.getElementById('setupStartName').textContent = name;
    document.getElementById('setupStartPick').classList.add('picked');
    setupPickStage = 'goal';
    document.getElementById('setupInstruction').innerHTML =
      'Now pick the <span class="setup-emph-gold">GOAL</span> actor';
    document.getElementById('setupSearch').value = '';
    document.getElementById('setupSearch').placeholder = 'Search Goal actor...';
    document.getElementById('setupSearchResults').hidden = true;
    document.getElementById('setupSearch').focus();
  } else {
    if (gameState.startActor && id === gameState.startActor.id) {
      alert('Goal must be a different actor.');
      return;
    }
    gameState.endActor = { id, name, photo };
    document.getElementById('setupGoalPhoto').innerHTML = photoHtml;
    document.getElementById('setupGoalName').textContent = name;
    document.getElementById('setupGoalPick').classList.add('picked');
    document.getElementById('setupSearchResults').hidden = true;
    document.getElementById('setupInstruction').innerHTML =
      'Path locked. <span class="setup-emph-cyan">Start Game</span> when ready.';
    showSetupConfirm();
  }
}

function showSetupConfirm() {
  // Both picks made — surface confirm row, hide search + randomize.
  document.getElementById('setupSearchWrap').hidden = true;
  document.getElementById('randomizeBtn').hidden = true;
  document.getElementById('setupConfirmRow').hidden = false;
}

function hideSetupConfirm() {
  document.getElementById('setupSearchWrap').hidden = false;
  document.getElementById('randomizeBtn').hidden = false;
  document.getElementById('setupConfirmRow').hidden = true;
}

function resetSetupFlow() {
  setupPickStage = 'start';
  gameState.startActor = null;
  gameState.endActor = null;
  resetSetupPicks();
  hideSetupConfirm();
  document.getElementById('setupInstruction').innerHTML =
    'Pick the <span class="setup-emph-cyan">START</span> actor';
  document.getElementById('setupSearch').value = '';
  document.getElementById('setupSearch').placeholder = 'Search Start actor...';
  document.getElementById('setupSearchResults').hidden = true;
  document.getElementById('setupSearch').focus();
}

function beginCustomPuzzleFromSetup() {
  document.getElementById('setupOverlay').hidden = true;
  if (gameState.mode === 'challenge') {
    setModeTag('CREATE CHALLENGE', false);
    showGameUI();
    // Par starts at 3, will be set to max(3, steps) on completion.
    loadCustomPuzzle(gameState.startActor, gameState.endActor, 3, 'challenge');
  } else if (gameState.mode === 'party') {
    const p1Raw = document.getElementById('player1NameInput').value.trim();
    const p2Raw = document.getElementById('player2NameInput').value.trim();
    const p1Name = p1Raw || 'Player 1';
    const p2Name = p2Raw || 'Player 2';
    gameState.activePlayer = 0;
    gameState.players = [
      { name: p1Name, steps: 0, chain: [] },
      { name: p2Name, steps: 0, chain: [] }
    ];
    setModeTag(`PASS & PLAY — ${p1Name.toUpperCase()}`, false);
    document.getElementById('infoBar').classList.add('party-mode');
    showGameUI();
    loadCustomPuzzle(gameState.startActor, gameState.endActor, 0, 'party');
  }
}

/* ============================================================
   RANDOMIZE PATH — Added 2026-05-02
   Picks two distinct actors from the curated DAILY_JOURNEYS
   roster (verified IDs, all have TMDB portraits).
   ============================================================ */
/* Pick two distinct actors from DAILY_JOURNEYS who have NOT co-starred in
   any reasonably popular movie. TMDB's /discover/movie?with_cast=A,B returns
   the films they share; if total_results === 0, they're not direct co-stars,
   so the puzzle requires ≥3 hops. Up to `maxAttempts` rolls; if every attempt
   fails (extremely unlikely with the curated roster), accept the last pair. */
async function pickValidRandomPair(maxAttempts) {
  const pool = new Map();
  DAILY_JOURNEYS.forEach(p => {
    pool.set(p.start.id, p.start);
    pool.set(p.end.id, p.end);
  });
  const list = Array.from(pool.values());
  const tried = new Set();
  let lastStart = list[0];
  let lastGoal = list[1];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const a = Math.floor(Math.random() * list.length);
    let b = Math.floor(Math.random() * list.length);
    while (b === a) b = Math.floor(Math.random() * list.length);
    const start = list[a];
    const goal = list[b];
    lastStart = start;
    lastGoal = goal;

    // Bidirectional pair key — order doesn't matter for co-star check
    const key = [start.id, goal.id].sort().join(':');
    if (tried.has(key)) continue;
    tried.add(key);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${start.id},${goal.id}&vote_count.gte=10`
      );
      const data = await res.json();
      if ((data.total_results || 0) === 0) {
        return { start, goal };
      }
    } catch (err) {
      // Network hiccup — accept this pair rather than block the user.
      return { start, goal };
    }
  }
  return { start: lastStart, goal: lastGoal };
}

async function randomizePath() {
  // Reset state, show cosmic spinner, hide picks/search/randomize/confirm
  setupPickStage = 'start';
  gameState.startActor = null;
  gameState.endActor = null;
  resetSetupPicks();
  hideSetupConfirm();
  document.getElementById('setupPicks').hidden = true;
  document.getElementById('setupSearchWrap').hidden = true;
  document.getElementById('randomizeBtn').hidden = true;
  document.getElementById('setupSpinnerZone').hidden = false;
  document.getElementById('setupInstruction').innerHTML = '&nbsp;';

  // Hold the spinner for at least 1.5s for theatrical effect, while we
  // (a) roll a non-cosharing pair and (b) prefetch portraits in parallel.
  const minSpinner = new Promise(r => setTimeout(r, 1500));

  const { start, goal } = await pickValidRandomPair(4);
  const [startPath, goalPath] = await Promise.all([
    fetchAndCachePortrait(start.id),
    fetchAndCachePortrait(goal.id)
  ]);
  await minSpinner;

  document.getElementById('setupSpinnerZone').hidden = true;
  document.getElementById('setupPicks').hidden = false;

  const startPhoto = startPath ? `${TMDB_IMG}w185${startPath}` : '';
  const goalPhoto = goalPath ? `${TMDB_IMG}w185${goalPath}` : '';

  setupPickStage = 'start';
  handleSetupPick(start.id, start.name, startPhoto);
  handleSetupPick(goal.id, goal.name, goalPhoto);
  // handleSetupPick auto-shows the confirm row when both picks land.
}

/* ============================================================
   URL PARAM HANDLER — Added 2026-05-02
   Incoming challenge: ?s=<startId>&g=<goalId>&p=<par>
   Shows holding screen with both actors before duel starts.
   ============================================================ */
async function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('s') || !params.has('g')) return false;

  const startId = parseInt(params.get('s'));
  const goalId = parseInt(params.get('g'));
  const par = Math.max(3, parseInt(params.get('p') || '3'));
  const resultRaw = params.get('r');
  const result = resultRaw != null && !isNaN(parseInt(resultRaw)) ? parseInt(resultRaw) : null;
  if (!startId || !goalId || startId === goalId) return false;

  // Series + rivalry params
  const cid = params.get('cid') || null;
  const seriesLength = Math.max(1, parseInt(params.get('series') || '1'));
  const seriesProgress = Math.max(0, parseInt(params.get('round') || '0'));
  const replyTo = params.get('reply') || null;
  const senderName = (params.get('n') || '').trim();
  gameState.challengeId = cid;
  gameState.seriesLength = seriesLength;
  gameState.seriesProgress = seriesProgress;
  gameState.replyTo = replyTo;
  gameState.senderName = senderName;

  document.getElementById('modeMenu').hidden = true;
  document.getElementById('holdingScreen').hidden = false;
  if (!setupSearchDebounced) initSetupOverlay();

  // Toggle which content block shows based on whether a result is encoded.
  const isResultBack = result != null && result > 0;
  document.getElementById('holdingChallengeBlock').hidden = isResultBack;
  document.getElementById('acceptChallengeBtn').hidden = isResultBack;
  document.getElementById('holdingResultBlock').hidden = !isResultBack;
  document.querySelector('#holdingScreen .celebration-title').textContent =
    isResultBack ? "YOUR FRIEND'S RESULT" : 'INCOMING CHALLENGE';

  try {
    const [sData, gData] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${startId}?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/person/${goalId}?api_key=${TMDB_API_KEY}`).then(r => r.json())
    ]);

    document.getElementById('holdStartName').textContent = sData.name || 'Unknown';
    document.getElementById('holdGoalName').textContent = gData.name || 'Unknown';
    if (sData.profile_path) {
      document.getElementById('holdStartPhoto').innerHTML =
        `<img src="${TMDB_IMG}w185${sData.profile_path}" alt="${sData.name}">`;
    }
    if (gData.profile_path) {
      document.getElementById('holdGoalPhoto').innerHTML =
        `<img src="${TMDB_IMG}w185${gData.profile_path}" alt="${gData.name}">`;
    }
    document.getElementById('holdPar').textContent = par;

    gameState.startActor = { id: startId, name: sData.name };
    gameState.endActor = { id: goalId, name: gData.name };
    gameState.par = par;

    // Series info caption — shown on both incoming and result-back views
    if (seriesLength > 1) {
      const caption = `Best of ${seriesLength} • Round ${seriesProgress + 1}/${seriesLength}`;
      document.getElementById('holdingChallengeSeries').textContent = caption;
      document.getElementById('holdingChallengeSeries').hidden = false;
      document.getElementById('holdingSeriesInfo').textContent = caption;
      document.getElementById('holdingSeriesInfo').hidden = false;
    } else {
      document.getElementById('holdingChallengeSeries').hidden = true;
      document.getElementById('holdingSeriesInfo').hidden = true;
    }

    if (isResultBack) {
      document.getElementById('resultBackSteps').textContent = result;
      document.getElementById('resultBackPar').textContent = par;
      const verdictEl = document.getElementById('resultBackVerdict');
      const diff = result - par;
      if (diff < 0) {
        verdictEl.innerHTML = `<span class="og og-eagle"></span> ${-diff} Under Par!`;
        verdictEl.className = 'score-verdict under-par';
      } else if (diff === 0) {
        verdictEl.innerHTML = '<span class="og og-target"></span> On Par!';
        verdictEl.className = 'score-verdict on-par';
      } else {
        verdictEl.textContent = `${diff} Over Par`;
        verdictEl.className = 'score-verdict over-par';
      }

      // Persist the opponent's result against the matching sent challenge.
      if (cid) recordOpponentResult(cid, result);

      // Counter-challenge available unless we've already played all rounds.
      const canCounter = seriesLength === 1 || (seriesProgress + 1) < seriesLength;
      document.getElementById('counterChallengeBtn').hidden = !canCounter;
    } else {
      // Incoming challenge — record receipt against B's localStorage if cid present.
      if (cid) {
        recordReceivedChallenge({
          id: cid,
          receivedAt: Date.now(),
          from: senderName || null,
          startActor: { id: startId, name: sData.name },
          endActor: { id: goalId, name: gData.name },
          par,
          seriesLength,
          round: seriesProgress,
          replyTo
        });
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to load incoming challenge:', err);
    document.getElementById('holdingScreen').hidden = true;
    return false;
  }
}

function cacheElements() {
  parValue = document.getElementById("parValue");
  stepsValue = document.getElementById("stepsValue");

  honeycombContainer = document.getElementById("honeycombContainer");

  searchInput = document.getElementById("searchInput");
  searchResults = document.getElementById("searchResults");

  inputHint = document.getElementById("inputHint");
  currentActorName = document.getElementById("currentActorName");

  undoBtn = document.getElementById("undoBtn");
  resetBtn = document.getElementById("resetBtn");

  celebrationOverlay = document.getElementById("celebrationOverlay");
  postgameResults = document.getElementById("postgameResults");
  headerStatus = document.getElementById("headerStatus");
}

function setupEventListeners() {
  // Mode menu buttons
  document.getElementById('btnDaily').addEventListener('click', () => startMode('daily'));
  document.getElementById('btnChallenge').addEventListener('click', () => startMode('challenge'));
  document.getElementById('btnParty').addEventListener('click', () => startMode('party'));

  // Search input
  searchInput.addEventListener("input", OrbitUtils.debounce(handleSearch, 300));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") searchResults.hidden = true;
  });

  // Click outside to close search
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      searchResults.hidden = true;
    }
  });

  // Toggle buttons
  document.getElementById("movieToggle").addEventListener("click", () => setSearchType("movie"));
  document.getElementById("actorToggle").addEventListener("click", () => setSearchType("actor"));

  // Action buttons
  undoBtn.addEventListener("click", undoStep);
  resetBtn.addEventListener("click", resetGame);

  // Modals
  document.getElementById("helpBtn").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = false;
  });
  document.getElementById("helpClose").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = true;
  });
  document.getElementById("statsBtn").addEventListener("click", () => {
    loadStats();
    document.getElementById("statsModal").hidden = false;
  });
  document.getElementById("statsClose").addEventListener("click", () => {
    document.getElementById("statsModal").hidden = true;
  });

  // Share
  document.getElementById("shareBtn").addEventListener("click", shareResult);
  document.getElementById("rematchBtn").addEventListener("click", rematchParty);

  // Celebration overlay
  document.getElementById("celebrationClose").addEventListener("click", closeCelebration);
  celebrationOverlay.addEventListener("click", (e) => {
    if (e.target === celebrationOverlay) closeCelebration();
  });
  document.getElementById("reviewBtn").addEventListener("click", closeCelebration);

  // Postgame close button
  const postgameClose = document.getElementById("postgameClose");
  if (postgameClose) {
    postgameClose.addEventListener("click", () => {
      postgameResults.hidden = true;
    });
  }

  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Resize handler
  window.addEventListener('resize', OrbitUtils.debounce(() => {
    renderHoneycombPath();
  }, 200));
}

// ============================================
// PUZZLE LOADING
// ============================================

async function loadDailyPuzzle() {
  const puzzleIndex = OrbitUtils.getPuzzleIndex(DAILY_JOURNEYS.length);
  const puzzle = DAILY_JOURNEYS[puzzleIndex];

  gameState.puzzleNumber = puzzleIndex + 1;
  document.getElementById("puzzleNumber").textContent = gameState.puzzleNumber;

  gameState.startActor = { ...puzzle.start };
  gameState.endActor = { ...puzzle.end };
  gameState.par = puzzle.par;
  parValue.textContent = puzzle.par;

  // Check for saved state
  const savedState = loadTodayState();
  if (savedState && savedState.chain && savedState.chain.length > 0) {
    gameState.chain = savedState.chain;
    gameState.currentActor = savedState.currentActor;
    gameState.steps = savedState.steps || 0;
    gameState.completed = savedState.completed || false;
    gameState.searchType = savedState.searchType || 'movie';
  } else {
    gameState.currentActor = { ...puzzle.start };
    gameState.chain = [{ type: 'actor', id: puzzle.start.id, name: puzzle.start.name, isStart: true }];
    gameState.steps = 0;
    gameState.completed = false;
  }

  // Track that the player started today's puzzle
  trackPlayed();

  // Always load photos fresh from TMDB
  await loadActorPhotos();

  if (gameState.completed) {
    const inputSection = document.getElementById('inputSection');
    if (inputSection) inputSection.hidden = true;
    updateUI();
    renderHoneycombPath();
    showResult();
    return;
  }

  // Sync toggle UI with restored search type
  setSearchType(gameState.searchType);

  // Pre-load filmography for current actor
  if (gameState.currentActor && gameState.currentActor.id) {
    await loadFilmography(gameState.currentActor.id);
  }

  renderHoneycombPath();
  updateUI();
}

async function loadActorPhotos() {
  const placeholder = (color) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='185' height='185' viewBox='0 0 185 185'%3E%3Crect fill='%23111827' width='185' height='185'/%3E%3Ctext x='92' y='100' text-anchor='middle' fill='${encodeURIComponent(color)}' font-size='48'%3E%3F%3C/text%3E%3C/svg%3E`;

  // Load start actor photo
  if (gameState.startActor && gameState.startActor.id) {
    try {
      const { id: resolvedId, person: data } = await resolvePersonId(
        gameState.startActor.id, gameState.startActor.name
      );
      gameState.startActor.id = resolvedId;
      gameState.startActor.photo = data && data.profile_path
        ? `${TMDB_IMG}w185${data.profile_path}`
        : placeholder('#00d9ff');
      if (gameState.chain[0] && gameState.chain[0].isStart) {
        gameState.chain[0].photo = gameState.startActor.photo;
      }
    } catch (err) {
      console.error("Error loading start actor photo:", err);
      gameState.startActor.photo = placeholder('#00d9ff');
    }
  }

  // Load end actor photo
  if (gameState.endActor && gameState.endActor.id) {
    try {
      const { id: resolvedId, person: data } = await resolvePersonId(
        gameState.endActor.id, gameState.endActor.name
      );
      gameState.endActor.id = resolvedId;
      gameState.endActor.photo = data && data.profile_path
        ? `${TMDB_IMG}w185${data.profile_path}`
        : placeholder('#ffd700');
      const goalItem = gameState.chain.find(item => item.isGoal);
      if (goalItem) goalItem.photo = gameState.endActor.photo;
    } catch (err) {
      console.error("Error loading end actor photo:", err);
      gameState.endActor.photo = placeholder('#ffd700');
    }
  }

  // Load photos for chain actors
  for (const item of gameState.chain) {
    if (item.type === 'actor' && !item.photo) {
      try {
        const { id: resolvedId, person: data } = await resolvePersonId(
          item.id, item.name
        );
        item.id = resolvedId;
        item.photo = data && data.profile_path
          ? `${TMDB_IMG}w185${data.profile_path}`
          : placeholder('#a855f7');
      } catch (err) {
        item.photo = placeholder('#a855f7');
      }
    }
    // Load posters for movies
    if (item.type === 'movie' && !item.poster) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${item.id}?api_key=${TMDB_API_KEY}`
        );
        const data = await res.json();
        item.poster = data.poster_path ? `${TMDB_IMG}w185${data.poster_path}` : null;
      } catch (err) {
        item.poster = null;
      }
    }
  }
}

function setLastAdded(id) {
  gameState.lastAddedId = id;
  setTimeout(() => {
    if (gameState.lastAddedId === id) gameState.lastAddedId = null;
  }, 600);
}

async function loadFilmography(actorId) {
  if (filmographyCache[actorId]) return filmographyCache[actorId];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();

    const seen = new Set();
    const movies = [];

    for (const m of (data.cast || []).concat(data.crew || [])) {
      if (m.vote_count > 10 && !seen.has(m.id)) {
        seen.add(m.id);
        movies.push({ id: m.id, title: m.title });
      }
    }

    filmographyCache[actorId] = movies;
    return movies;
  } catch (err) {
    console.error("Error loading filmography:", err);
    return [];
  }
}

// ============================================
// SEARCH
// ============================================

function setSearchType(type) {
  gameState.searchType = type;

  document.getElementById("movieToggle").classList.toggle("active", type === "movie");
  document.getElementById("actorToggle").classList.toggle("active", type === "actor");

  searchInput.placeholder = type === "movie" ? "Search for a movie..." : "Search for an actor...";
  searchInput.value = "";
  searchResults.hidden = true;

  updateInputHint();
}

function updateInputHint() {
  const lastItem = gameState.chain[gameState.chain.length - 1];

  if (lastItem.type === 'actor') {
    currentActorName.textContent = lastItem.name;
    inputHint.innerHTML = `Find a movie featuring <span id="currentActorName">${lastItem.name}</span>`;
  } else {
    inputHint.innerHTML = `Find an actor from <span id="currentActorName">${lastItem.name}</span>`;
  }
}

async function handleSearch() {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    searchResults.hidden = true;
    return;
  }

  const endpoint = gameState.searchType === 'movie' ? 'search/movie' : 'search/person';

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    let results = (data.results || []).slice(0, 6);

    // In actor mode, pin the goal actor to the top — they're always a valid pick.
    if (
      gameState.searchType === 'actor' &&
      gameState.endActor &&
      !gameState.completed
    ) {
      const goalId = gameState.endActor.id;
      const filtered = results.filter(r => r.id !== goalId);
      results = [{
        id: goalId,
        name: gameState.endActor.name,
        photo: gameState.endActor.photo,
        isGoalPin: true
      }, ...filtered].slice(0, 6);
    }

    if (results.length === 0) {
      searchResults.hidden = true;
      return;
    }

    searchResults.innerHTML = results.map(item => {
      if (gameState.searchType === 'movie') {
        const poster = item.poster_path ? `${TMDB_IMG}w92${item.poster_path}` : "";
        const year = item.release_date?.split("-")[0] || "";
        const safeTitle = (item.title || "").replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const posterPath = item.poster_path || "";
        return `
          <div class="search-result-item" data-id="${item.id}" data-title="${safeTitle}" data-type="movie" data-poster="${posterPath}">
            <img class="search-result-img poster" src="${poster}" alt="">
            <div>
              <div class="search-result-title">${item.title}</div>
              <div class="search-result-sub">${year}</div>
            </div>
          </div>
        `;
      } else {
        const isGoalPin = !!item.isGoalPin;
        const photo = isGoalPin
          ? (item.photo || "")
          : (item.profile_path ? `${TMDB_IMG}w185${item.profile_path}` : "");
        const safeName = (item.name || "").replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const subtext = isGoalPin ? 'GOAL' : (item.known_for_department || 'Actor');
        const cls = isGoalPin ? 'search-result-item search-goal-pin' : 'search-result-item';
        return `
          <div class="${cls}" data-id="${item.id}" data-name="${safeName}" data-type="actor" data-photo="${photo}">
            <img class="search-result-img" src="${photo}" alt="">
            <div>
              <div class="search-result-title">${item.name}</div>
              <div class="search-result-sub">${subtext}</div>
            </div>
          </div>
        `;
      }
    }).join("");

    searchResults.hidden = false;

    searchResults.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => handleSelection(item));
    });

  } catch (err) {
    console.error("Search error:", err);
  }
}

async function handleSelection(item) {
  const type = item.dataset.type;
  const id = parseInt(item.dataset.id);

  searchInput.value = "";
  searchResults.hidden = true;

  if (type === 'movie') {
    const posterPath = item.dataset.poster;
    await handleMovieSelection(id, item.dataset.title, posterPath);
  } else {
    await handleActorSelection(id, item.dataset.name, item.dataset.photo);
  }
}

async function handleMovieSelection(movieId, movieTitle, posterPath) {
  if (isValidating) return;
  isValidating = true;
  searchInput.disabled = true;

  const currentActorId = gameState.currentActor.id;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await res.json();

    const inCast = (credits.cast || []).some(c => c.id === currentActorId);
    const inCrew = (credits.crew || []).some(c => c.id === currentActorId);

    if (!inCast && !inCrew) {
      showNotification(`${gameState.currentActor.name} is not in ${movieTitle}`, 'error');
      return;
    }

    // Prevent duplicate movies in the chain
    if (gameState.chain.some(item => item.type === 'movie' && item.id === movieId)) {
      showNotification("You've already used this movie", 'error');
      return;
    }

    const posterUrl = posterPath ? `${TMDB_IMG}w185${posterPath}` : null;
    gameState.chain.push({ type: 'movie', id: movieId, name: movieTitle, poster: posterUrl });
    gameState.steps++;
    setLastAdded(movieId);

    setSearchType('actor');
    renderHoneycombPath();
    updateUI();
    saveTodayState();

  } catch (err) {
    console.error("Error validating movie:", err);
    showNotification('Failed to validate connection. Try again.', 'error');
  } finally {
    isValidating = false;
    searchInput.disabled = false;
  }
}

async function handleActorSelection(actorId, actorName, actorPhoto) {
  if (isValidating) return;

  const lastMovie = gameState.chain[gameState.chain.length - 1];

  if (lastMovie.type !== 'movie') {
    showNotification("Please select a movie first", 'error');
    if (actorId === gameState.endActor?.id) flashGoalFail();
    return;
  }

  isValidating = true;
  searchInput.disabled = true;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${lastMovie.id}/credits?api_key=${TMDB_API_KEY}`
    );
    const credits = await res.json();

    const inCast = (credits.cast || []).some(c => c.id === actorId);
    const inCrew = (credits.crew || []).some(c => c.id === actorId);

    if (!inCast && !inCrew) {
      showNotification(`${actorName} is not in ${lastMovie.name}`, 'error');
      if (actorId === gameState.endActor?.id) flashGoalFail();
      return;
    }

    // Check for loops (before goal check — prevent re-using start actor as goal)
    if (gameState.chain.some(item => item.type === 'actor' && item.id === actorId)) {
      showNotification("You've already used this actor", 'error');
      return;
    }

    // Check if this is the GOAL actor!
    if (actorId === gameState.endActor.id) {
      let goalPhoto = actorPhoto || gameState.endActor.photo;
      if (!goalPhoto) {
        const path = await fetchAndCachePortrait(actorId);
        if (path) goalPhoto = `${TMDB_IMG}w185${path}`;
      }

      // 1) Green tick on placeholder (chain still dashed).
      flashGoalSuccess();
      await new Promise(r => setTimeout(r, 600));

      // 2) Spawn supernova hex at the goal's screen position.
      const placeholderHex = honeycombContainer.querySelector('.hex-placeholder');
      let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      if (placeholderHex) {
        const rect = placeholderHex.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
      }
      triggerCompletionSupernova(cx, cy);

      // 3) Wait for supernova to engulf the screen, then join the chain
      //    behind the bright peak — user can't see the transition.
      await new Promise(r => setTimeout(r, 850));
      gameState.chain.push({
        type: 'actor',
        id: actorId,
        name: actorName,
        photo: goalPhoto,
        isGoal: true
      });
      setLastAdded(actorId);
      gameState.completed = true;
      updateUI();
      saveTodayState();
      saveStats();
      renderHoneycombPath();

      // 4) Let the supernova fade out, revealing the completed chain.
      await new Promise(r => setTimeout(r, 1050));
      handleCompletion();
      return;
    }

    let resolvedPhoto = actorPhoto;
    if (!resolvedPhoto) {
      const path = await fetchAndCachePortrait(actorId);
      if (path) resolvedPhoto = `${TMDB_IMG}w185${path}`;
    }
    gameState.chain.push({ type: 'actor', id: actorId, name: actorName, photo: resolvedPhoto });
    gameState.currentActor = { id: actorId, name: actorName };
    setLastAdded(actorId);

    await loadFilmography(actorId);

    setSearchType('movie');
    renderHoneycombPath();
    updateUI();
    saveTodayState();

  } catch (err) {
    console.error("Error validating actor:", err);
    showNotification('Failed to validate connection. Try again.', 'error');
  } finally {
    isValidating = false;
    searchInput.disabled = false;
  }
}

// ============================================
// HONEYCOMB PATH RENDERING (SVG-based)
// ============================================

function renderHoneycombPath() {
  if (!honeycombContainer) return;

  const rect = honeycombContainer.getBoundingClientRect();
  const W = rect.width || 800;
  const H = rect.height || 280;

  const isComplete = gameState.completed;
  const centerY = H / 2;

  // Middle chain items (everything except START chain[0] and GOAL if complete)
  const middleItems = [];
  for (let i = 1; i < gameState.chain.length; i++) {
    const item = gameState.chain[i];
    if (item.isGoal) continue;
    middleItems.push(item);
  }

  // Compute current hex scale based on total node count.
  const totalNodes = middleItems.length + 2; // START + middles + GOAL
  const tierScale = getHexScale(totalNodes);
  let hexSize = Math.round(HEX_SIZE * tierScale);

  // Width-aware cap: shrink further if even-distribution slot would force
  // more than ~15% overlap. Slot per node ≈ (W - margins) / (totalNodes-1).
  // Hex visual width = 2 * hexSize. We want slot >= 1.7 * hexSize for
  // no/marginal overlap → hexSize <= slot / 1.7.
  if (totalNodes > 2) {
    const avail = Math.max(0, W - 60);
    const maxHexFromWidth = Math.floor(avail / ((totalNodes - 1) * 1.7));
    hexSize = Math.min(hexSize, maxHexFromWidth);
  }
  hexSize = Math.max(28, hexSize);

  const hexHeight = Math.sqrt(3) * hexSize;
  const horizSpacing = hexSize * 1.5;
  const completeSpacing = hexSize * 1.75;
  const vertOffset = hexHeight * 0.5;

  let startPos, goalPos, middlePositions;

  if (isComplete) {
    // CENTERED chain. Cap spacing so the chain never exceeds W; otherwise
    // long completed chains run off the canvas.
    const margin = 30;
    const maxChainWidth = Math.max(0, W - margin * 2);
    const desired = (totalNodes - 1) * completeSpacing;
    const finalSpacing = desired <= maxChainWidth
      ? completeSpacing
      : maxChainWidth / Math.max(1, totalNodes - 1);

    const totalChainWidth = (totalNodes - 1) * finalSpacing;
    const chainStartX = (W - totalChainWidth) / 2;

    startPos = { x: chainStartX, y: centerY };
    goalPos = { x: chainStartX + (totalNodes - 1) * finalSpacing, y: centerY };

    middlePositions = [];
    for (let i = 0; i < middleItems.length; i++) {
      const x = chainStartX + (i + 1) * finalSpacing;
      const zigzag = ((i + 1) % 2 === 0 ? -vertOffset * 0.35 : vertOffset * 0.35);
      middlePositions.push({ x, y: centerY + zigzag });
    }
  } else {
    // Gameplay: START fixed left, GOAL fixed right; middles distributed evenly.
    startPos = { x: hexSize + 30, y: centerY };
    goalPos = { x: W - hexSize - 30, y: centerY };
    middlePositions = computeMiddlePositions(middleItems.length, startPos, goalPos, centerY, horizSpacing, vertOffset);
  }

  // Assemble full node list: START + middles + GOAL
  const allNodes = [];
  allNodes.push({ pos: startPos, item: gameState.chain[0], isPlaceholder: false });
  middleItems.forEach((item, i) => {
    allNodes.push({ pos: middlePositions[i], item, isPlaceholder: false });
  });
  const goalItem = isComplete
    ? gameState.chain.find(item => item.isGoal)
    : null;
  allNodes.push({ pos: goalPos, item: goalItem, isPlaceholder: !isComplete });

  // Build SVG
  let svg = `<svg class="honeycomb-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // Defs for gradients, filters, clip paths
  svg += `
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00d9ff"/>
        <stop offset="50%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="${isComplete ? '#ffd700' : '#14b8a6'}"/>
      </linearGradient>
      <linearGradient id="lineGradientGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffd700"/>
        <stop offset="100%" stop-color="#ffaa00"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  `;

  // Draw connection lines center-to-center (hex edges provide visual connection)
  for (let i = 1; i < allNodes.length; i++) {
    const prev = allNodes[i - 1].pos;
    const curr = allNodes[i].pos;

    const node = allNodes[i];
    const isToPlaceholder = node.isPlaceholder;
    const isToGoal = node.item && node.item.isGoal;

    if (isToPlaceholder) {
      // Dashed faded line to GOAL placeholder
      svg += `<line x1="${prev.x}" y1="${prev.y}" x2="${curr.x}" y2="${curr.y}"
                    stroke="#ffd700" stroke-width="2" stroke-linecap="round"
                    stroke-dasharray="8,6" opacity="0.3"/>`;
    } else {
      const strokeColor = isToGoal ? 'url(#lineGradientGold)' : 'url(#lineGradient)';
      svg += `<line x1="${prev.x}" y1="${prev.y}" x2="${curr.x}" y2="${curr.y}"
                    stroke="${strokeColor}" stroke-width="3" stroke-linecap="round"
                    filter="url(#glow)" opacity="0.6"/>`;
    }
  }

  // Draw hexagon nodes
  allNodes.forEach((node, i) => {
    svg += renderHexagonNode(node.pos, node.item, i, node.isPlaceholder, isComplete, hexSize);
  });

  svg += `</svg>`;
  honeycombContainer.innerHTML = svg;

  // Add click handlers ONLY when game is complete
  if (isComplete) {
    attachClickHandlers();
  } else {
    // Placeholder goal hex is clickable — try-finish shortcut.
    const placeholderHex = honeycombContainer.querySelector('.hex-placeholder');
    if (placeholderHex) {
      placeholderHex.style.cursor = 'pointer';
      placeholderHex.addEventListener('click', handleGoalClick);
    }
  }

  // Update header status
  if (headerStatus) {
    headerStatus.textContent = isComplete ? 'COMPLETE ✓' : '';
    headerStatus.classList.toggle('visible', isComplete);
  }
}

function computeMiddlePositions(count, startPos, goalPos, centerY, horizSpacing, vertOffset) {
  // Only used during gameplay (completion is handled inline)
  if (count === 0) return [];

  const vo = vertOffset != null ? vertOffset : VERT_OFFSET;

  // Distribute middles EVENLY between start and goal so they never stack
  // on top of each other. As count grows, the slot tightens — pair with
  // hex shrinkage in renderHoneycombPath to keep overlap marginal.
  const span = goalPos.x - startPos.x;
  const slot = span / (count + 1);

  const positions = [];
  for (let i = 0; i < count; i++) {
    const x = startPos.x + (i + 1) * slot;
    const zigzag = (i % 2 === 0 ? -vo * 0.4 : vo * 0.4);
    positions.push({ x, y: centerY + zigzag });
  }

  return positions;
}

function hexPathD(cx, cy, size) {
  // Flat-top hexagon: first vertex at angle 0 (right), flat edges on top/bottom
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // Flat-top orientation
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return `M${points.join('L')}Z`;
}

function renderHexagonNode(pos, item, index, isPlaceholder, isComplete, hexSize) {
  // Default to base if caller didn't pass a scaled size.
  const HS = hexSize != null ? hexSize : HEX_SIZE;
  // Scale-relative offset so labels and font sizes shrink with the hex.
  const sFactor = HS / HEX_SIZE;
  let svg = '';

  const isStart = item?.isStart;
  const isGoal = item?.isGoal;
  const isMovie = item?.type === 'movie';
  const isActor = item?.type === 'actor';

  // Determine colors
  let fillColor, strokeColor, glowFilter;
  if (isPlaceholder) {
    // Match the regular goal hex fill so portrait letterbox bands read as gold
    fillColor = 'rgba(255, 215, 0, 0.2)';
    strokeColor = '#ffd700';
    glowFilter = 'filter="url(#glow)"';
  } else if (isStart) {
    fillColor = 'rgba(0, 217, 255, 0.15)';
    strokeColor = '#00d9ff';
    glowFilter = 'filter="url(#glowStrong)"';
  } else if (isGoal) {
    fillColor = 'rgba(255, 215, 0, 0.2)';
    strokeColor = '#ffd700';
    glowFilter = 'filter="url(#glowStrong)"';
  } else if (isMovie) {
    fillColor = 'rgba(0, 217, 255, 0.1)';
    strokeColor = '#00d9ff';
    glowFilter = 'filter="url(#glow)"';
  } else if (isActor) {
    fillColor = 'rgba(168, 85, 247, 0.15)';
    strokeColor = '#a855f7';
    glowFilter = 'filter="url(#glow)"';
  } else {
    fillColor = 'rgba(30, 41, 59, 0.5)';
    strokeColor = '#64748b';
    glowFilter = '';
  }

  const strokeWidth = (isStart || isGoal) ? 3 : 2;
  const clickableClass = !isPlaceholder && isComplete ? 'hex-clickable' : '';
  const placeholderClass = isPlaceholder ? 'hex-placeholder' : '';
  const dataAttrs = !isPlaceholder && item
    ? `data-type="${item.type}" data-id="${item.id}" data-name="${(item.name || '').replace(/"/g, '&quot;')}"`
    : '';
  const isNew =
    (item && item.id != null && item.id === gameState.lastAddedId) ||
    (isPlaceholder && gameState.lastAddedId === 'placeholder-init');
  const newClass = isNew ? 'hex-new' : '';

  svg += `<g class="hex-node ${clickableClass} ${placeholderClass}" transform="translate(${pos.x}, ${pos.y})" ${dataAttrs}>`;
  svg += `<g class="hex-content ${newClass}">`;

  // Scaled label offsets + fonts so they shrink with the hex.
  const nameY = HS + Math.round(26 * sFactor);
  const badgeY = HS + Math.round(50 * sFactor);
  const nameFont = Math.max(10, Math.round(20 * sFactor));
  const badgeFont = Math.max(9, Math.round(18 * sFactor));
  const movieFont = Math.max(8, Math.round(11 * sFactor));
  const movieLine = Math.max(10, Math.round(14 * sFactor));

  // Hexagon background
  svg += `<path d="${hexPathD(0, 0, HS)}" fill="${fillColor}" stroke="${strokeColor}"
               stroke-width="${strokeWidth}" ${glowFilter}/>`;

  // Content
  if (isPlaceholder) {
    // Goal hex during gameplay — render the goal actor's portrait at full strength.
    const goalPhoto = gameState.endActor?.photo || '';
    if (goalPhoto) {
      const goalClipId = `hex-clip-goal-${index}`;
      svg += `<defs><clipPath id="${goalClipId}"><path d="${hexPathD(0, 0, HS - 2)}"/></clipPath></defs>`;
      svg += `<image href="${goalPhoto}" x="${-HS + 2}" y="${-HS + 2}"
                   width="${(HS - 2) * 2}" height="${(HS - 2) * 2}"
                   clip-path="url(#${goalClipId})" preserveAspectRatio="xMidYMin meet"/>`;
    } else {
      // Person silhouette fallback (matches .og-person glyph)
      const r = HS - 2;
      svg += `<g opacity="0.85">
        <circle cx="0" cy="${-8 * sFactor}" r="${r * 0.22}" stroke="#ffd700" stroke-width="3" fill="none"/>
        <path d="M${-r * 0.5} ${r * 0.55}Q${-r * 0.5} ${r * 0.18} 0 ${r * 0.18}Q${r * 0.5} ${r * 0.18} ${r * 0.5} ${r * 0.55}"
              stroke="#ffd700" stroke-width="3" fill="none"/>
      </g>`;
    }
    svg += `<text x="0" y="${nameY}" text-anchor="middle" fill="#f1f5f9"
                 font-size="${nameFont}" font-family="Barlow, sans-serif" font-weight="600">${escapeHtml(gameState.endActor?.name || 'GOAL')}</text>`;
    svg += `<text x="0" y="${badgeY}" text-anchor="middle" fill="#ffd700"
                 font-size="${badgeFont}" font-family="Orbitron, sans-serif" font-weight="bold" letter-spacing="2">GOAL</text>`;

    // Fail overlay — red flash + white X. Hidden by default; .hex-fail
    // class triggers fade-in/out animation in sync with the shake.
    const cx = HS * 0.3;
    const xStroke = Math.max(4, Math.round(9 * sFactor));
    svg += `<g class="hex-fail-overlay" opacity="0">
      <path d="${hexPathD(0, 0, HS)}" fill="rgba(239, 68, 68, 0.5)"/>
      <line x1="${-cx}" y1="${-cx}" x2="${cx}" y2="${cx}" stroke="#ffffff" stroke-width="${xStroke}" stroke-linecap="round"/>
      <line x1="${-cx}" y1="${cx}" x2="${cx}" y2="${-cx}" stroke="#ffffff" stroke-width="${xStroke}" stroke-linecap="round"/>
    </g>`;

    // Success overlay — green flash + white tick. Fires on the placeholder
    // BEFORE the chain joins up to the goal actor.
    svg += `<g class="hex-success-overlay" opacity="0">
      <path d="${hexPathD(0, 0, HS)}" fill="rgba(16, 185, 129, 0.55)"/>
      <polyline points="${-cx},${-cx * 0.15} ${-cx * 0.25},${cx * 0.55} ${cx},${-cx * 0.55}"
                fill="none" stroke="#ffffff" stroke-width="${xStroke}" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
  } else if (isMovie) {
    // Movie title — wrap width also scales (fewer chars per line on smaller hexes).
    const wrapWidth = Math.max(6, Math.round(12 * sFactor));
    const words = (item.name || '').toUpperCase().split(' ');
    const lines = wrapText(words, wrapWidth);
    // dominant-baseline="central" makes the y coordinate the visual center
    // of each line, so the block stays centered at any font size.
    const startY = -(lines.length - 1) * movieLine / 2;

    lines.slice(0, 4).forEach((line, i) => {
      svg += `<text x="0" y="${startY + i * movieLine}" text-anchor="middle" dominant-baseline="central"
                   fill="#00d9ff" font-size="${movieFont}" font-family="Orbitron, sans-serif" font-weight="bold">${escapeHtml(line)}</text>`;
    });
  } else if (isActor) {
    // Actor photo clipped to hexagon shape (fills entire hex)
    const photoUrl = item.photo || '';
    if (photoUrl) {
      const clipId = `hex-clip-${index}`;
      svg += `<defs><clipPath id="${clipId}"><path d="${hexPathD(0, 0, HS - 2)}"/></clipPath></defs>`;
      svg += `<image href="${photoUrl}" x="${-HS + 2}" y="${-HS + 2}"
                   width="${(HS - 2) * 2}" height="${(HS - 2) * 2}"
                   clip-path="url(#${clipId})" preserveAspectRatio="xMidYMin meet"/>`;
    } else {
      // Person silhouette fallback (matches .og-person glyph)
      const r = HS - 2;
      svg += `<g opacity="0.85">
        <circle cx="0" cy="${-8 * sFactor}" r="${r * 0.22}" stroke="${strokeColor}" stroke-width="3" fill="none"/>
        <path d="M${-r * 0.5} ${r * 0.55}Q${-r * 0.5} ${r * 0.18} 0 ${r * 0.18}Q${r * 0.5} ${r * 0.18} ${r * 0.5} ${r * 0.55}"
              stroke="${strokeColor}" stroke-width="3" fill="none"/>
      </g>`;
    }

    // Name below
    svg += `<text x="0" y="${nameY}" text-anchor="middle" fill="#f1f5f9"
                 font-size="${nameFont}" font-family="Barlow, sans-serif" font-weight="600">${escapeHtml(item.name)}</text>`;

    // Badge
    if (isStart) {
      svg += `<text x="0" y="${badgeY}" text-anchor="middle" fill="#00d9ff"
                   font-size="${badgeFont}" font-family="Orbitron, sans-serif" font-weight="bold" letter-spacing="2">START</text>`;
    } else if (isGoal) {
      svg += `<text x="0" y="${badgeY}" text-anchor="middle" fill="#ffd700"
                   font-size="${badgeFont}" font-family="Orbitron, sans-serif" font-weight="bold" letter-spacing="2">GOAL ✓</text>`;
    }
  }

  svg += `</g></g>`; // close .hex-content then .hex-node
  return svg;
}

function wrapText(words, maxLen) {
  const lines = [];
  let current = '';
  words.forEach(word => {
    if ((current + ' ' + word).trim().length > maxLen) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  });
  if (current) lines.push(current);
  return lines;
}

function escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function handleGoalClick() {
  if (gameState.completed || isValidating) return;
  const lastItem = gameState.chain[gameState.chain.length - 1];

  if (!lastItem || lastItem.type !== 'movie') {
    showNotification('Pick a movie first', 'error');
    flashGoalFail();
    return;
  }

  const stepsBefore = gameState.chain.length;
  await handleActorSelection(
    gameState.endActor.id,
    gameState.endActor.name,
    gameState.endActor.photo
  );
  // If chain didn't grow, the credit check failed — flash to confirm.
  if (gameState.chain.length === stepsBefore) {
    flashGoalFail();
  }
}

function flashGoalFail() {
  const placeholderInner = honeycombContainer.querySelector('.hex-placeholder .hex-content');
  if (!placeholderInner) return;
  // Re-trigger animation: remove class, force reflow, re-add.
  placeholderInner.classList.remove('hex-fail');
  void placeholderInner.offsetWidth;
  placeholderInner.classList.add('hex-fail');
  setTimeout(() => placeholderInner.classList.remove('hex-fail'), 800);
}

function flashGoalSuccess() {
  // Target the PLACEHOLDER hex (chain not yet joined). Mirrors flashGoalFail.
  const placeholderInner = honeycombContainer.querySelector('.hex-placeholder .hex-content');
  if (!placeholderInner) return;
  placeholderInner.classList.remove('hex-success');
  void placeholderInner.offsetWidth;
  placeholderInner.classList.add('hex-success');
  setTimeout(() => placeholderInner.classList.remove('hex-success'), 800);
}

/* Cinematic completion supernova. A radial-gradient hex grows from the
   goal's screen position, engulfs the viewport at peak brightness, then
   fades — revealing the completed chain that was joined behind it. */
function triggerCompletionSupernova(centerX, centerY) {
  const sn = document.createElement('div');
  sn.className = 'completion-supernova';
  sn.style.left = centerX + 'px';
  sn.style.top = centerY + 'px';
  document.body.appendChild(sn);
  setTimeout(() => sn.remove(), 1900);
}

function attachClickHandlers() {
  // ONLY attach when game is complete - prevents cheating!
  if (!gameState.completed) return;

  const nodes = honeycombContainer.querySelectorAll('.hex-clickable');
  nodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const type = node.getAttribute('data-type');
      const id = node.getAttribute('data-id');
      const name = node.getAttribute('data-name');

      if (type === 'actor') {
        window.location.href = `../pages/timeline.html?search=${encodeURIComponent(name)}&type=person`;
      } else if (type === 'movie') {
        localStorage.setItem("singleMovie", JSON.stringify({ id: parseInt(id), title: name }));
        localStorage.setItem("resultsMode", "single");
        window.location.href = '../pages/results.html';
      }
    });
  });
}

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
  const movieCount = gameState.chain.filter(item => item.type === 'movie').length;
  stepsValue.textContent = movieCount;
  gameState.steps = movieCount;

  undoBtn.disabled = gameState.chain.length <= 1;

  updateInputHint();
}

function showNotification(message, type = 'info') {
  const hint = document.getElementById("inputHint");
  const originalText = hint.innerHTML;
  hint.innerHTML = `<span style="color: ${type === 'error' ? '#ff4757' : '#14b8a6'}">${message}</span>`;
  setTimeout(() => {
    hint.innerHTML = originalText;
    updateInputHint();
  }, 2000);
}

// ============================================
// GAME ACTIONS
// ============================================

function undoStep() {
  if (gameState.chain.length <= 1) return;

  const removed = gameState.chain.pop();

  // Decrement steps if we removed a movie (movies increment steps on add)
  if (removed.type === 'movie' && gameState.steps > 0) {
    gameState.steps--;
  }

  const lastItem = gameState.chain[gameState.chain.length - 1];
  if (lastItem.type === 'actor') {
    gameState.currentActor = { id: lastItem.id, name: lastItem.name };
    setSearchType('movie');
  } else {
    setSearchType('actor');
  }

  renderHoneycombPath();
  updateUI();
  saveTodayState();
}

function resetGame() {
  celebrationOverlay.hidden = true;
  postgameResults.hidden = true;
  gameState.completed = false;

  gameState.chain = [{
    type: 'actor',
    id: gameState.startActor.id,
    name: gameState.startActor.name,
    photo: gameState.startActor.photo,
    isStart: true
  }];
  gameState.currentActor = { ...gameState.startActor };
  gameState.steps = 0;
  gameState.searchType = 'movie';

  const inputSection = document.getElementById('inputSection');
  if (inputSection) inputSection.hidden = false;

  setSearchType('movie');
  renderHoneycombPath();
  updateUI();
  saveTodayState();
}

/* ============================================================
   PASS & PLAY HANDOFF — Added 2026-05-02
   After Player 1 finishes, snapshot their run, show Privacy
   Shield ("hand the device to P2"). On Descramble, reset the
   board for P2 starting from the same start actor.
   ============================================================ */

function handleCompletion() {
  if (gameState.mode === 'party') {
    // Snapshot the just-finished player (preserve their name)
    const existingName = getPlayerName(gameState.activePlayer);
    gameState.players[gameState.activePlayer] = {
      name: existingName,
      steps: gameState.steps,
      chain: gameState.chain.slice()
    };
    if (gameState.activePlayer === 0) {
      showPrivacyShield();
      return;
    }
    // Player 2 done — fall through to dual-score result
  }
  showResult();
}

function showPrivacyShield() {
  // Reflect the next player's name on the shield.
  const nextLabel = document.querySelector('#privacyShield .privacy-next');
  if (nextLabel) nextLabel.textContent = getPlayerName(1).toUpperCase();
  document.getElementById('privacyShield').hidden = false;
}

function renderPartyPathways() {
  const list1 = document.getElementById('partyPathList1');
  const list2 = document.getElementById('partyPathList2');
  document.getElementById('partyPathTitle1').textContent = `${getPlayerName(0)}'s Path`;
  document.getElementById('partyPathTitle2').textContent = `${getPlayerName(1)}'s Path`;

  function rowHtml(item) {
    const safeName = escapeHtml(item.name || '');
    const cls = item.type === 'movie' ? 'party-row-movie' : 'party-row-actor';
    const badge = item.isStart ? '<span class="party-row-badge cyan">START</span>'
                : item.isGoal  ? '<span class="party-row-badge gold">GOAL</span>'
                : '';
    return `<li class="party-row ${cls}" data-id="${item.id}" data-type="${item.type}" data-name="${safeName}">
      <span class="party-row-name">${safeName}</span>${badge}
    </li>`;
  }

  list1.innerHTML = (gameState.players[0].chain || []).map(rowHtml).join('');
  list2.innerHTML = (gameState.players[1].chain || []).map(rowHtml).join('');

  // Wire click handlers — actors → actor-timeline, movies → MovieCube popup
  [list1, list2].forEach(list => {
    list.querySelectorAll('.party-row').forEach(row => {
      row.addEventListener('click', () => {
        const type = row.dataset.type;
        const id = parseInt(row.dataset.id);
        if (!id) return;
        if (type === 'movie' && typeof window.openMovieCube === 'function') {
          window.openMovieCube(id);
        } else if (type === 'movie') {
          // MovieCube unavailable — fall back to results page
          localStorage.setItem('singleMovie', JSON.stringify({ id, title: row.dataset.name }));
          localStorage.setItem('resultsMode', 'single');
          window.location.href = '../pages/results.html';
        } else if (type === 'actor') {
          OrbitUtils.navigateToTimeline(id, row.dataset.name, 'person');
        }
      });
    });
  });

  document.getElementById('partyPathways').hidden = false;
}

function rematchParty() {
  if (gameState.mode !== 'party' || !gameState.startActor || !gameState.endActor) return;
  // Preserve names; clear chains and scores.
  const n1 = getPlayerName(0);
  const n2 = getPlayerName(1);
  gameState.players = [
    { name: n1, steps: 0, chain: [] },
    { name: n2, steps: 0, chain: [] }
  ];
  gameState.activePlayer = 0;
  // Hide party-result UI before reloading the puzzle.
  document.getElementById('partyPathways').hidden = true;
  document.getElementById('rematchBtn').hidden = true;
  celebrationOverlay.hidden = true;
  setModeTag(`PASS & PLAY — ${n1.toUpperCase()}`, false);
  loadCustomPuzzle(gameState.startActor, gameState.endActor, 0, 'party');
}

function startPlayer2Turn() {
  document.getElementById('privacyShield').hidden = true;
  gameState.activePlayer = 1;
  gameState.completed = false;
  gameState.steps = 0;
  gameState.searchType = 'movie';
  gameState.chain = [{
    type: 'actor',
    id: gameState.startActor.id,
    name: gameState.startActor.name,
    photo: gameState.startActor.photo,
    isStart: true
  }];
  gameState.currentActor = { id: gameState.startActor.id, name: gameState.startActor.name };
  setModeTag(`PASS & PLAY — ${getPlayerName(1).toUpperCase()}`, false);
  setSearchType('movie');
  renderHoneycombPath();
  updateUI();
}

// ============================================
// RESULT & CELEBRATION
// ============================================

function showResult() {
  const steps = gameState.steps;
  const titleEl = document.querySelector('.celebration-title');
  const scoreDisplay = document.querySelector('.score-display');
  const nextPuzzle = document.querySelector('.next-puzzle');
  const shareBtn = document.getElementById('shareBtn');
  const reviewBtn = document.getElementById('reviewBtn');
  const verdictEl = document.getElementById("scoreVerdict");
  const yourLabel = document.querySelector('.your-score .score-label');
  const parLabel = document.querySelector('.par-score .score-label');

  // Reset score labels to defaults; modes override below.
  if (yourLabel) yourLabel.textContent = 'Your Steps';
  if (parLabel) parLabel.textContent = 'Par';

  if (gameState.mode === 'party') {
    document.getElementById('challengeLinkDisplay').hidden = true;
    const p1 = gameState.players[0].steps;
    const p2 = gameState.players[1].steps;
    const n1 = getPlayerName(0);
    const n2 = getPlayerName(1);
    document.getElementById('yourSteps').textContent = p1;
    document.getElementById('parSteps').textContent = p2;
    yourLabel.textContent = n1;
    parLabel.textContent = n2;

    if (p1 < p2) {
      verdictEl.innerHTML = `<span class="og og-trophy"></span> ${escapeHtml(n1)} Wins!`;
      verdictEl.className = 'score-verdict party-p1-wins';
    } else if (p1 > p2) {
      verdictEl.innerHTML = `<span class="og og-trophy"></span> ${escapeHtml(n2)} Wins!`;
      verdictEl.className = 'score-verdict party-p2-wins';
    } else {
      verdictEl.innerHTML = '<span class="og og-target"></span> Tie!';
      verdictEl.className = 'score-verdict on-par';
    }

    titleEl.textContent = 'JOURNEY COMPLETE!';
    scoreDisplay.style.display = '';
    nextPuzzle.style.display = 'none';
    reviewBtn.textContent = 'Back to Menu';
    shareBtn.innerHTML = '<span class="og og-clipboard"></span> Share Result';
    document.getElementById('rematchBtn').hidden = false;
    celebrationOverlay.classList.add('party-result');
    renderPartyPathways();
    celebrationOverlay.hidden = false;
    return;
  }
  // Hide party-only UI + drop the party-result class when not in party mode
  celebrationOverlay.classList.remove('party-result');
  document.getElementById('rematchBtn').hidden = true;
  document.getElementById('partyPathways').hidden = true;

  if (gameState.mode === 'challenge') {
    // Creator just solved their own challenge — their steps become Par.
    gameState.par = Math.max(3, steps);
    if (parValue) parValue.textContent = gameState.par;

    titleEl.textContent = 'CHALLENGE CREATED!';
    scoreDisplay.style.display = 'none';
    nextPuzzle.style.display = 'none';

    // Surface the link on screen
    const url = `${window.location.origin}${window.location.pathname}?s=${gameState.startActor.id}&g=${gameState.endActor.id}&p=${gameState.par}`;
    document.getElementById('challengePar').textContent = gameState.par;
    document.getElementById('challengeLinkInput').value = url;
    document.getElementById('challengeLinkDisplay').hidden = false;
    // Auto-select the link on focus for easy manual copy
    document.getElementById('challengeLinkInput').addEventListener('focus', function () {
      this.select();
    }, { once: true });

    shareBtn.innerHTML = '<span class="og og-clipboard"></span> Copy Challenge Link';
    reviewBtn.textContent = 'Back to Menu';
  } else {
    document.getElementById('challengeLinkDisplay').hidden = true;
    // Daily or duel: show steps vs par + verdict.
    const par = gameState.par;
    document.getElementById("yourSteps").textContent = steps;
    document.getElementById("parSteps").textContent = par;

    if (steps < par) {
      verdictEl.innerHTML = `<span class="og og-eagle"></span> ${par - steps} Under Par!`;
      verdictEl.className = "score-verdict under-par";
    } else if (steps === par) {
      verdictEl.innerHTML = '<span class="og og-target"></span> On Par!';
      verdictEl.className = "score-verdict on-par";
    } else {
      verdictEl.textContent = `${steps - par} Over Par`;
      verdictEl.className = "score-verdict over-par";
    }

    titleEl.textContent = 'JOURNEY COMPLETE!';
    scoreDisplay.style.display = '';

    if (gameState.mode === 'duel') {
      nextPuzzle.style.display = 'none';
      reviewBtn.textContent = 'Back to Menu';
      shareBtn.innerHTML = '<span class="og og-clipboard"></span> Share Result';
    } else {
      // daily
      nextPuzzle.style.display = '';
      reviewBtn.textContent = 'Review Journey';
      shareBtn.innerHTML = '<span class="og og-clipboard"></span> Share';
      startNextPuzzleCountdown();
    }
  }

  celebrationOverlay.hidden = false;
}

function closeCelebration() {
  celebrationOverlay.hidden = true;
  celebrationOverlay.classList.remove('party-result');
  // Always reset party-only UI so it doesn't leak into other modes.
  const rematchBtn = document.getElementById('rematchBtn');
  if (rematchBtn) rematchBtn.hidden = true;
  const partyPathways = document.getElementById('partyPathways');
  if (partyPathways) partyPathways.hidden = true;

  if (gameState.mode === 'daily') {
    renderPostGameResults();
  } else {
    // challenge / duel / party — back to menu, reset transient state, strip URL.
    if (window.location.search) {
      history.replaceState(null, '', window.location.pathname);
    }
    showModeMenu();
    gameState.chain = [];
    gameState.completed = false;
  }
}

function renderPostGameResults() {
  const moviesGrid = document.getElementById('moviesGrid');
  const actorsGrid = document.getElementById('actorsGrid');
  if (!moviesGrid || !actorsGrid) return;

  const movies = gameState.chain.filter(item => item.type === 'movie');
  const actors = gameState.chain.filter(item => item.type === 'actor');

  // Render movies
  moviesGrid.innerHTML = movies.map(movie => {
    const safeTitle = (movie.name || '').replace(/"/g, '&quot;');
    const posterSrc = movie.poster || '';
    return `
      <div class="postgame-card postgame-movie" data-id="${movie.id}" data-title="${safeTitle}">
        <img class="postgame-poster" src="${posterSrc}" alt="${movie.name}" data-movie-id="${movie.id}">
        <div class="postgame-title">${movie.name}</div>
      </div>
    `;
  }).join('');

  // Render actors
  actorsGrid.innerHTML = actors.map(actor => {
    const isStart = actor.isStart;
    const isGoal = actor.isGoal;
    const badgeClass = isStart ? 'badge-start' : isGoal ? 'badge-goal' : '';
    const badgeText = isStart ? 'START' : isGoal ? 'GOAL' : '';
    const photo = actor.photo || '';
    return `
      <div class="postgame-card postgame-actor" data-id="${actor.id}" data-name="${(actor.name || '').replace(/"/g, '&quot;')}">
        <img class="postgame-photo" src="${photo}" alt="${actor.name}">
        <div class="postgame-title">${actor.name}</div>
        ${badgeText ? `<div class="postgame-badge ${badgeClass}">${badgeText}</div>` : ''}
      </div>
    `;
  }).join('');

  postgameResults.hidden = false;

  // Fetch missing posters
  movies.forEach(async (movie) => {
    if (movie.poster) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      const posterUrl = data.poster_path ? `${TMDB_IMG}w185${data.poster_path}` : '';
      const img = moviesGrid.querySelector(`img[data-movie-id="${movie.id}"]`);
      if (img && posterUrl) img.src = posterUrl;
    } catch (err) {}
  });

  // Click handlers - ONLY post-game
  moviesGrid.querySelectorAll('.postgame-movie').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const title = card.dataset.title;
      localStorage.setItem("singleMovie", JSON.stringify({ id, title }));
      localStorage.setItem("resultsMode", "single");
      window.location.href = '../pages/results.html';
    });
  });

  actorsGrid.querySelectorAll('.postgame-actor').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      window.location.href = `../pages/timeline.html?search=${encodeURIComponent(name)}&type=person`;
    });
  });
}

// ============================================
// STATISTICS
// ============================================

function getStats() {
  const stored = localStorage.getItem("journeys_stats");
  return stored ? JSON.parse(stored) : { played: 0, solved: 0, totalSteps: 0, underPar: 0 };
}

function saveStats() {
  if (gameState.mode !== 'daily') return; // only daily counts toward stats
  const stats = getStats();
  stats.solved++;
  stats.totalSteps += gameState.steps;
  if (gameState.steps < gameState.par) stats.underPar++;
  localStorage.setItem("journeys_stats", JSON.stringify(stats));
}

function trackPlayed() {
  const key = getTodayKey() + '_tracked';
  if (localStorage.getItem(key)) return;
  const stats = getStats();
  stats.played++;
  localStorage.setItem("journeys_stats", JSON.stringify(stats));
  localStorage.setItem(key, '1');
}

function loadStats() {
  const stats = getStats();
  document.getElementById("statPlayed").textContent = stats.played;
  document.getElementById("statSolved").textContent = stats.solved;
  document.getElementById("statAvgSteps").textContent = stats.solved > 0 ? (stats.totalSteps / stats.solved).toFixed(1) : 0;
  document.getElementById("statUnderPar").textContent = stats.underPar;
}

// ============================================
// STATE PERSISTENCE
// ============================================

function getTodayKey() {
  const today = new Date();
  return `journeys_game_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
}

function saveTodayState() {
  if (gameState.mode !== 'daily') return; // challenge/duel/party are ephemeral
  const stateToSave = {
    ...gameState,
    startActor: { id: gameState.startActor.id, name: gameState.startActor.name },
    endActor: { id: gameState.endActor.id, name: gameState.endActor.name },
    chain: gameState.chain.map(item => {
      const { photo, poster, ...rest } = item;
      return rest;
    })
  };
  localStorage.setItem(getTodayKey(), JSON.stringify(stateToSave));
}

function loadTodayState() {
  const stored = localStorage.getItem(getTodayKey());
  return stored ? JSON.parse(stored) : null;
}

// ============================================
// SHARING
// ============================================

function shareResult() {
  if (gameState.mode === 'challenge') return generateChallengeLink();
  if (gameState.mode === 'party') return shareParty();
  if (gameState.mode === 'duel') return shareDuelResult();

  const steps = gameState.steps;
  const par = gameState.par;

  let verdict = "";
  if (steps < par) verdict = `🦅 ${par - steps} under par!`;
  else if (steps === par) verdict = "🎯 On par!";
  else verdict = `${steps - par} over par`;

  const chainEmoji = gameState.chain.map(item => item.type === 'actor' ? '🎭' : '🎬').join('→');

  const header = gameState.mode === 'duel'
    ? `🛤️ Journeys Challenge`
    : `🛤️ Journeys #${gameState.puzzleNumber}`;

  const text = `${header}

${gameState.startActor.name} → ${gameState.endActor.name}

${chainEmoji}
${steps} steps (Par ${par})
${verdict}

Play at orbit-game.com/journeys`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.innerHTML = "<span>✓</span> Copied!";
    setTimeout(() => {
      btn.innerHTML = '<span class="og og-clipboard"></span> Share';
    }, 2000);
  });
}

function shareDuelResult() {
  const steps = gameState.steps;
  const par = gameState.par;
  let verdict = 'On par!';
  if (steps < par) verdict = `🦅 ${par - steps} under par!`;
  else if (steps > par) verdict = `${steps - par} over par`;

  // Persist B's own result against the matching received challenge (if cid present).
  if (gameState.challengeId) {
    recordMyResult(gameState.challengeId, steps, gameState.chain);
  }

  // Build result-back URL — preserve cid + series metadata so A's browser can
  // record it against the same rivalry and offer a counter-challenge.
  const params = new URLSearchParams();
  params.set('s', gameState.startActor.id);
  params.set('g', gameState.endActor.id);
  params.set('p', par);
  params.set('r', steps);
  if (gameState.challengeId) params.set('cid', gameState.challengeId);
  if (gameState.seriesLength > 1) {
    params.set('series', gameState.seriesLength);
    params.set('round', gameState.seriesProgress);
  }
  if (gameState.replyTo) params.set('reply', gameState.replyTo);
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

  const text = `🛤️ JOURNEYS RESULT

${gameState.startActor.name} → ${gameState.endActor.name}
I scored ${steps} (Par ${par}) — ${verdict}

See my run: ${url}

Powered by Orbit`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('shareBtn');
    btn.innerHTML = '<span>✓</span> Result link copied!';
    setTimeout(() => {
      btn.innerHTML = '<span class="og og-clipboard"></span> Share Result';
    }, 2000);
  }).catch(() => {
    prompt('Copy this result link:', url);
  });
}

function shareParty() {
  const p1 = gameState.players[0].steps;
  const p2 = gameState.players[1].steps;
  const n1 = getPlayerName(0);
  const n2 = getPlayerName(1);
  let verdict = 'Tie!';
  if (p1 < p2) verdict = `${n1} wins!`;
  else if (p1 > p2) verdict = `${n2} wins!`;

  const text = `🛤️ Journeys Pass & Play

${gameState.startActor.name} → ${gameState.endActor.name}

${n1}: ${p1} steps
${n2}: ${p2} steps
${verdict}

Play at orbit-game.com/journeys`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('shareBtn');
    btn.innerHTML = '<span>✓</span> Copied!';
    setTimeout(() => {
      btn.innerHTML = '<span class="og og-clipboard"></span> Share Result';
    }, 2000);
  });
}

function generateChallengeLink() {
  const cid = gameState.challengeId || newChallengeId();
  gameState.challengeId = cid;

  const opponentInput = document.getElementById('challengeOpponentInput');
  const sentTo = (opponentInput?.value || '').trim();
  gameState.opponentName = sentTo;

  // Build URL with all challenge metadata
  const params = new URLSearchParams();
  params.set('s', gameState.startActor.id);
  params.set('g', gameState.endActor.id);
  params.set('p', gameState.par);
  params.set('cid', cid);
  if (gameState.seriesLength > 1) {
    params.set('series', gameState.seriesLength);
    params.set('round', gameState.seriesProgress);
  }
  if (gameState.replyTo) params.set('reply', gameState.replyTo);
  // Sender name only embedded if user has named themselves (we use the
  // challenge-opponent-input label "Sending to" so we DON'T embed sentTo —
  // sentTo is local-only for rivalry tracking. See `n` param if desired later).

  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

  // Persist the sent challenge for the My Challenges page + rivalries.
  recordSentChallenge({
    id: cid,
    createdAt: Date.now(),
    startActor: { id: gameState.startActor.id, name: gameState.startActor.name },
    endActor:   { id: gameState.endActor.id,   name: gameState.endActor.name },
    par: gameState.par,
    seriesLength: gameState.seriesLength,
    round: gameState.seriesProgress,
    replyTo: gameState.replyTo,
    sentTo: sentTo || null,
    myChain: gameState.chain.map(({ photo, poster, ...rest }) => rest)
  });

  const seriesLabel = gameState.seriesLength > 1
    ? `Best of ${gameState.seriesLength} • Round ${gameState.seriesProgress + 1}/${gameState.seriesLength}\n`
    : '';
  const text = `🛤️ JOURNEYS CHALLENGE

${gameState.startActor.name} → ${gameState.endActor.name}
${seriesLabel}Can you beat my Par ${gameState.par}?

Play: ${url}

Powered by Orbit`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    btn.innerHTML = '<span>✓</span> Link Copied!';
    setTimeout(() => {
      btn.innerHTML = '<span class="og og-clipboard"></span> Copy Challenge Link';
    }, 2000);
  }).catch(() => {
    prompt('Copy this challenge link:', url);
  });
}

// ============================================
// COUNTDOWN
// ============================================

function startNextPuzzleCountdown() {
  const nextTimer = document.getElementById("nextTimer");

  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    nextTimer.textContent = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  update();
  setInterval(update, 1000);
}

// ============================================
// UTILITIES
// ============================================

// ============================================
// CANVAS HONEYCOMB BACKGROUND
// ============================================

(function initHoneycombBG() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, hexes = [], frame = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    hexes = buildHexes();
  }

  function hexPath(cx, cy, r, rotation) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + rotation;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function buildHexes() {
    const count = Math.round(80 + W / 18);
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const edge = Math.abs(x - W / 2) / (W / 2);
      const r = 10 + edge * 30 + Math.random() * 25;
      const baseAlpha = 0.03 + edge * 0.14 + Math.random() * 0.05;
      const rotation = Math.random() * Math.PI;
      const blurLevel = Math.random() < 0.25 ? 1 + Math.random() * 3 : 0;
      const leftness = 1 - x / W;
      let cr, cg, cb;
      if (Math.random() < 0.08) { cr = 168; cg = 85; cb = 247; }
      else {
        cr = Math.round(0 * leftness + 255 * (1 - leftness));
        cg = Math.round(217 * leftness + 215 * (1 - leftness));
        cb = Math.round(255 * leftness + 0 * (1 - leftness));
      }
      const speed = 0.3 + Math.random() * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const driftAmp = 3 + Math.random() * 10;
      arr.push({ x, y, r, rotation, baseAlpha, blurLevel, cr, cg, cb, speed, phase, driftAmp });
    }
    return arr;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5) * W;
      const sy = (Math.sin(i * 269.5 + 183.3) * 0.5 + 0.5) * H;
      const sr = 0.4 + (i % 5) * 0.2;
      const sa = 0.2 + Math.sin(frame * 0.01 + i) * 0.15;
      ctx.fillStyle = `rgba(200,220,255,${sa})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    const t = frame * 0.008;
    for (const h of hexes) {
      const pulse = Math.sin(t * h.speed + h.phase);
      const dy = pulse * h.driftAmp;
      const alpha = h.baseAlpha * (0.7 + pulse * 0.3);
      const scale = 1 + pulse * 0.04;

      ctx.save();
      ctx.translate(h.x, h.y + dy);
      ctx.scale(scale, scale);
      if (h.blurLevel > 0) ctx.filter = `blur(${h.blurLevel}px)`;

      hexPath(0, 0, h.r, h.rotation);
      ctx.fillStyle = `rgba(${h.cr},${h.cg},${h.cb},${alpha * 0.12})`;
      ctx.fill();

      hexPath(0, 0, h.r, h.rotation);
      ctx.strokeStyle = `rgba(${h.cr},${h.cg},${h.cb},${alpha})`;
      ctx.lineWidth = h.r > 25 ? 1 : 0.6;
      ctx.stroke();

      ctx.filter = 'none';
      ctx.restore();
    }

    // Gradients
    const grdL = ctx.createRadialGradient(0, H * 0.4, 0, 0, H * 0.4, W * 0.5);
    grdL.addColorStop(0, 'rgba(0,217,255,0.06)');
    grdL.addColorStop(1, 'transparent');
    ctx.fillStyle = grdL;
    ctx.fillRect(0, 0, W, H);

    const grdR = ctx.createRadialGradient(W, H * 0.6, 0, W, H * 0.6, W * 0.5);
    grdR.addColorStop(0, 'rgba(255,215,0,0.05)');
    grdR.addColorStop(1, 'transparent');
    ctx.fillStyle = grdR;
    ctx.fillRect(0, 0, W, H);

    frame++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();