/* ============================================================
   HOME PAGE LOGIC — ORBIT Cinematic Landing Page
   Responsibilities:
   - Trending films + actors via TMDB (2 API calls on load)
   - Sacred Timeline SVG rendering for featured pairs
   - Mosaic poster image population
   - Showcase carousel tab switching
   - Search bar submit handling
   API CALL VOLUME: 5 calls on load (trending movies, trending people,
   mosaic: 2× trending pages + 1× top rated). All cached in sessionStorage.
   Added: 2026-03-28
   ============================================================ */

const TMDB_IMG = OrbitUtils.TMDB_IMG;

/* ----------------------------------------------------------
   SECTION 1 — FEATURED PAIRS
   ---------------------------------------------------------- */

const FEATURED_PAIRS = [
  {
    personA: { name: 'Scorsese', labelColor: 'cyan' },
    personB: { name: 'De Niro', labelColor: 'gold' },
    yearStart: 1973,
    yearEnd: 2019,
    films: [
      // Shared (both)
      { title: 'Mean Streets', year: 1973, person: 'both', award: false },
      { title: 'Taxi Driver', year: 1976, person: 'both', award: false },
      { title: 'Raging Bull', year: 1980, person: 'both', award: true },
      { title: 'The King of Comedy', year: 1982, person: 'both', award: false },
      { title: 'Goodfellas', year: 1990, person: 'both', award: true },
      { title: 'Cape Fear', year: 1991, person: 'both', award: false },
      { title: 'Casino', year: 1995, person: 'both', award: false },
      { title: 'The Irishman', year: 2019, person: 'both', award: false },
      // Scorsese solo
      { title: 'Alice Doesn\'t Live Here', year: 1974, person: 'A', award: false },
      { title: 'The Last Waltz', year: 1978, person: 'A', award: false },
      { title: 'The Color of Money', year: 1986, person: 'A', award: false },
      { title: 'The Last Temptation', year: 1988, person: 'A', award: false },
      { title: 'The Age of Innocence', year: 1993, person: 'A', award: false },
      { title: 'Gangs of New York', year: 2002, person: 'A', award: false },
      { title: 'The Aviator', year: 2004, person: 'A', award: true },
      { title: 'The Departed', year: 2006, person: 'A', award: true },
      { title: 'Hugo', year: 2011, person: 'A', award: false },
      { title: 'The Wolf of Wall Street', year: 2013, person: 'A', award: false },
      // De Niro solo
      { title: 'The Godfather Part II', year: 1974, person: 'B', award: true },
      { title: 'The Deer Hunter', year: 1978, person: 'B', award: true },
      { title: 'Once Upon a Time in America', year: 1984, person: 'B', award: false },
      { title: 'Midnight Run', year: 1988, person: 'B', award: false },
      { title: 'A Bronx Tale', year: 1993, person: 'B', award: false },
      { title: 'Heat', year: 1995, person: 'B', award: false },
      { title: 'Analyze This', year: 1999, person: 'B', award: false },
      { title: 'Meet the Parents', year: 2000, person: 'B', award: false },
      { title: 'Silver Linings Playbook', year: 2012, person: 'B', award: false }
    ]
  },
  {
    personA: { name: 'Kubrick', labelColor: 'cyan' },
    personB: { name: 'Nicholson', labelColor: 'gold' },
    yearStart: 1962,
    yearEnd: 2002,
    films: [
      // Shared
      { title: 'The Shining', year: 1980, person: 'both', award: false },
      // Kubrick solo
      { title: 'Lolita', year: 1962, person: 'A', award: false },
      { title: 'Dr. Strangelove', year: 1964, person: 'A', award: false },
      { title: '2001 A Space Odyssey', year: 1968, person: 'A', award: true },
      { title: 'A Clockwork Orange', year: 1971, person: 'A', award: false },
      { title: 'Barry Lyndon', year: 1975, person: 'A', award: false },
      { title: 'Full Metal Jacket', year: 1987, person: 'A', award: false },
      { title: 'Eyes Wide Shut', year: 1999, person: 'A', award: false },
      // Nicholson solo
      { title: 'Easy Rider', year: 1969, person: 'B', award: false },
      { title: 'Chinatown', year: 1974, person: 'B', award: true },
      { title: 'One Flew Over the Cuckoo\'s Nest', year: 1975, person: 'B', award: true },
      { title: 'The Witches of Eastwick', year: 1987, person: 'B', award: false },
      { title: 'Batman', year: 1989, person: 'B', award: false },
      { title: 'A Few Good Men', year: 1992, person: 'B', award: false },
      { title: 'As Good as It Gets', year: 1997, person: 'B', award: true },
      { title: 'About Schmidt', year: 2002, person: 'B', award: false }
    ]
  },
  {
    personA: { name: 'Nolan', labelColor: 'cyan' },
    personB: { name: 'Bale', labelColor: 'gold' },
    yearStart: 2000,
    yearEnd: 2023,
    films: [
      // Shared
      { title: 'Batman Begins', year: 2005, person: 'both', award: false },
      { title: 'The Prestige', year: 2006, person: 'both', award: false },
      { title: 'The Dark Knight', year: 2008, person: 'both', award: false },
      { title: 'The Dark Knight Rises', year: 2012, person: 'both', award: false },
      // Nolan solo
      { title: 'Memento', year: 2000, person: 'A', award: false },
      { title: 'Insomnia', year: 2002, person: 'A', award: false },
      { title: 'Inception', year: 2010, person: 'A', award: true },
      { title: 'Interstellar', year: 2014, person: 'A', award: false },
      { title: 'Dunkirk', year: 2017, person: 'A', award: true },
      { title: 'Tenet', year: 2020, person: 'A', award: false },
      { title: 'Oppenheimer', year: 2023, person: 'A', award: true },
      // Bale solo
      { title: 'American Psycho', year: 2000, person: 'B', award: false },
      { title: 'The Machinist', year: 2004, person: 'B', award: false },
      { title: '3:10 to Yuma', year: 2007, person: 'B', award: false },
      { title: 'The Fighter', year: 2010, person: 'B', award: true },
      { title: 'American Hustle', year: 2013, person: 'B', award: false },
      { title: 'Vice', year: 2018, person: 'B', award: false },
      { title: 'Amsterdam', year: 2022, person: 'B', award: false }
    ]
  },
  {
    personA: { name: 'PTA', labelColor: 'cyan' },
    personB: { name: 'Daniel Day-Lewis', labelColor: 'gold' },
    yearStart: 1989,
    yearEnd: 2017,
    films: [
      // Shared
      { title: 'There Will Be Blood', year: 2007, person: 'both', award: true },
      { title: 'Phantom Thread', year: 2017, person: 'both', award: false },
      // PTA solo
      { title: 'Boogie Nights', year: 1997, person: 'A', award: false },
      { title: 'Magnolia', year: 1999, person: 'A', award: false },
      { title: 'Punch-Drunk Love', year: 2002, person: 'A', award: false },
      { title: 'The Master', year: 2012, person: 'A', award: false },
      { title: 'Inherent Vice', year: 2014, person: 'A', award: false },
      // DDL solo
      { title: 'My Left Foot', year: 1989, person: 'B', award: true },
      { title: 'The Last of the Mohicans', year: 1992, person: 'B', award: false },
      { title: 'In the Name of the Father', year: 1993, person: 'B', award: false },
      { title: 'The Age of Innocence', year: 1993, person: 'B', award: false },
      { title: 'Gangs of New York', year: 2002, person: 'B', award: false },
      { title: 'Lincoln', year: 2012, person: 'B', award: true }
    ]
  }
];

const pairIndex = Math.floor(Date.now() / (3 * 60 * 60 * 1000)) % FEATURED_PAIRS.length;

/* ----------------------------------------------------------
   SECTION 2 — loadTimelinePreview(pair)
   Loads the real timeline.html in an iframe for pixel-perfect
   consistency with the rest of ORBIT.
   ---------------------------------------------------------- */

function loadTimelinePreview(pair) {
  const frame = document.getElementById('timeline-preview-frame');
  const pairLabel = document.getElementById('timeline-pair-label');
  if (!frame) return;

  // Update the pair name label above the iframe
  if (pairLabel) {
    pairLabel.textContent = pair.personA.name.toUpperCase() + ' \u00D7 ' + pair.personB.name.toUpperCase();
  }

  // timeline.html reads ?search= and ?type= URL params
  // Load person A first — the real timeline will render their filmography
  const params = new URLSearchParams({
    type: 'person',
    search: pair.personA.name,
    embed: '1'
  });

  // Set iframe src after short delay so main page renders first
  setTimeout(() => {
    frame.src = 'timeline.html?' + params.toString();
  }, 400);
}

/* ----------------------------------------------------------
   SECTION 3 — loadTrendingFilms()
   ---------------------------------------------------------- */

async function loadTrendingFilms() {
  const CACHE_KEY = 'orbit_home_trending_films';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    // Check sessionStorage cache
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingFilms(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    // Cache with timestamp
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingFilms(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending films', err);
  }
}

function applyTrendingFilms(results) {
  const tiles = document.querySelectorAll('.film-tile');

  results.forEach((movie, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const poster = tile.querySelector('.film-tile-poster');
    if (poster && movie.poster_path) {
      poster.style.backgroundImage = `url(${TMDB_IMG}w342${movie.poster_path})`;
    }

    const title = tile.querySelector('.film-tile-title');
    if (title) title.textContent = movie.title;

    const meta = tile.querySelector('.film-tile-meta');
    if (meta) meta.textContent = (movie.release_date || '').split('-')[0];

    tile.dataset.movieId = movie.id;

    if (movie.vote_count > 5000 && movie.vote_average > 7.5) {
      const badge = tile.querySelector('.film-tile-award');
      if (badge) badge.style.display = 'block';
    }
  });
}

/* ----------------------------------------------------------
   SECTION 4 — loadTrendingPeople()
   ---------------------------------------------------------- */

async function loadTrendingPeople() {
  const CACHE_KEY = 'orbit_home_trending_people';
  const CACHE_TTL = 30 * 60 * 1000;

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        applyTrendingPeople(parsed.data);
        return;
      }
    }

    const response = await OrbitUtils.tmdbFetch('/trending/person/week', { language: 'en-US' });
    const results = (response.results || []).slice(0, 5);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }));

    applyTrendingPeople(results);
  } catch (err) {
    console.warn('ORBIT: Failed to load trending people', err);
  }
}

function applyTrendingPeople(results) {
  const tiles = document.querySelectorAll('.actor-tile');

  results.forEach((person, i) => {
    if (!tiles[i]) return;
    const tile = tiles[i];

    const portrait = tile.querySelector('.actor-portrait');
    if (portrait && person.profile_path) {
      portrait.style.backgroundImage = `url(${TMDB_IMG}w185${person.profile_path})`;
    }

    const name = tile.querySelector('.actor-name');
    if (name) name.textContent = person.name;

    const dept = tile.querySelector('.actor-dept');
    if (dept) dept.textContent = person.known_for_department || '';

    tile.dataset.personId = person.id;
    tile.dataset.name = person.name;
  });
}

/* ----------------------------------------------------------
   SECTION 5 — populateMosaic(posterPaths)
   ---------------------------------------------------------- */

async function loadMosaicPosters() {
  const CACHE_KEY = 'orbit_home_mosaic_posters';
  const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        populateMosaic(parsed.data);
        return;
      }
    }

    const [page1, page2, topRated] = await Promise.all([
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 1 }),
      OrbitUtils.tmdbFetch('/trending/movie/week', { language: 'en-US', page: 2 }),
      OrbitUtils.tmdbFetch('/movie/top_rated', { language: 'en-US', page: 1 })
    ]);

    const paths = [
      ...(page1.results || []),
      ...(page2.results || []),
      ...(topRated.results || [])
    ].map(m => m.poster_path).filter(Boolean);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: paths, timestamp: Date.now() }));
    populateMosaic(paths);
  } catch (err) {
    console.warn('ORBIT: Failed to load mosaic posters', err);
  }
}

function populateMosaic(posterPaths) {
  if (!posterPaths || posterPaths.length === 0) return;

  const cells = document.querySelectorAll('.mosaic-cell');
  if (cells.length === 0) return;

  // Fisher-Yates shuffle
  const shuffled = [...posterPaths];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure no adjacent cells repeat if we need to extend
  const paths = [];
  let idx = 0;
  for (let i = 0; i < cells.length; i++) {
    if (idx >= shuffled.length) idx = 0;
    // Skip if same as previous to avoid adjacent repeats
    if (i > 0 && paths[i - 1] === shuffled[idx] && shuffled.length > 1) {
      idx = (idx + 1) % shuffled.length;
    }
    paths.push(shuffled[idx]);
    idx++;
  }

  // Staggered fade-in
  cells.forEach((cell, i) => {
    cell.style.opacity = '0';
    cell.style.transition = 'opacity 0.8s ease';
    cell.style.backgroundImage = `url(${TMDB_IMG}w92${paths[i]})`;
    cell.style.backgroundSize = 'cover';
    cell.style.backgroundPosition = 'center';
    setTimeout(() => { cell.style.opacity = '1'; }, 50 * i);
  });
}

/* ----------------------------------------------------------
   SECTION 6 — initShowcase()
   ---------------------------------------------------------- */

function initShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      if (panels[index]) panels[index].classList.add('active');
    });
  });
}

/* ----------------------------------------------------------
   SECTION 7 — initSearch()
   ---------------------------------------------------------- */

function initSearch() {
  const input = document.querySelector('.hero-search-input');
  const btn = document.querySelector('.hero-search-btn');

  function submitSearch() {
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;
    window.location.href = '../index.html?quicksearch=' + encodeURIComponent(q);
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch();
      }
    });
  }

  if (btn) {
    btn.addEventListener('click', submitSearch);
  }

  // Seed suggestion clicks
  document.querySelectorAll('.hero-seed').forEach(seed => {
    seed.addEventListener('click', () => {
      if (!input) return;
      const text = seed.textContent || '';
      // Extract first name (e.g., "Scorsese" from "Scorsese + De Niro")
      const firstName = text.split('+')[0].trim().split('\u00D7')[0].trim();
      input.value = firstName;
      submitSearch();
    });
  });
}

/* ----------------------------------------------------------
   SECTION 8 — initScrollHint()
   ---------------------------------------------------------- */

/* ----------------------------------------------------------
   SECTION 9 — INIT
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const pair = FEATURED_PAIRS[pairIndex];
  loadTimelinePreview(pair);
  loadTrendingFilms();
  loadTrendingPeople();
  loadMosaicPosters();
  initShowcase();
  initSearch();

  // Film tiles -> MovieCube (with fallback)
  document.querySelectorAll('.film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const movieId = parseInt(tile.dataset.movieId);
      if (movieId && typeof openMovieCube === 'function') {
        openMovieCube(movieId);
      } else if (movieId) {
        window.location.href = 'results.html?movie=' + movieId;
      }
    });
  });

  // Actor tiles -> Timeline
  document.querySelectorAll('.actor-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const name = tile.dataset.name;
      if (name) window.location.href = 'timeline.html?type=person&search=' + encodeURIComponent(name);
    });
  });
});
