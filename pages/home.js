/* ============================================================
   HOME PAGE LOGIC — ORBIT Cinematic Landing Page
   Responsibilities:
   - Trending films + actors via TMDB (2 API calls on load)
   - Sacred Timeline SVG rendering for featured pairs
   - Mosaic poster image population
   - Showcase carousel tab switching
   - Search bar submit handling
   API CALL VOLUME: 2 calls on load (trending movies, trending people)
   No per-item API calls. Results cached in sessionStorage.
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
   SECTION 2 — renderTimeline(pair, containerId)
   ---------------------------------------------------------- */

function renderTimeline(pair, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const svgW = 1600;
  const svgH = 180;
  const yearStart = pair.yearStart;
  const yearEnd = pair.yearEnd;
  const xScale = 1560 / (yearEnd - yearStart + 2);

  function xPos(year) {
    return 20 + (year - yearStart + 1) * xScale;
  }

  const trackA = 75;
  const trackB = 120;
  const currentYear = new Date().getFullYear();

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;

  // Year axis labels every 5 years
  for (let y = yearStart - 1; y <= yearEnd + 1; y++) {
    if (y % 5 === 0) {
      svg += `<text x="${xPos(y)}" y="155" text-anchor="middle" font-size="9" fill="#64748b" font-family="Barlow, sans-serif">${y}</text>`;
    }
  }

  // Faint vertical grid lines at every decade
  for (let y = yearStart - 1; y <= yearEnd + 1; y++) {
    if (y % 10 === 0) {
      svg += `<line x1="${xPos(y)}" y1="50" x2="${xPos(y)}" y2="145" stroke="#1e293b" stroke-width="1"/>`;
    }
  }

  // Career base lines
  svg += `<line x1="${xPos(yearStart)}" y1="${trackA}" x2="${xPos(yearEnd)}" y2="${trackA}" stroke="#00d9ff" stroke-opacity="0.2" stroke-width="1.5"/>`;
  svg += `<line x1="${xPos(yearStart)}" y1="${trackB}" x2="${xPos(yearEnd)}" y2="${trackB}" stroke="#ffd700" stroke-opacity="0.16" stroke-width="1.5"/>`;

  // NOW dashed line
  if (currentYear >= yearStart - 1 && currentYear <= yearEnd + 1) {
    svg += `<line x1="${xPos(currentYear)}" y1="50" x2="${xPos(currentYear)}" y2="145" stroke="#64748b" stroke-width="0.5" stroke-dasharray="3,3" stroke-opacity="0.3"/>`;
  }

  // Determine shared films for labeling logic
  const sharedFilms = pair.films.filter(f => f.person === 'both');
  const firstShared = sharedFilms.length > 0 ? sharedFilms[0] : null;
  const lastShared = sharedFilms.length > 0 ? sharedFilms[sharedFilms.length - 1] : null;

  let labelAlt = 0; // alternation counter for shared labels

  // Render each film
  pair.films.forEach(film => {
    const x = xPos(film.year);

    if (film.person === 'both') {
      // Vertical connector line between tracks
      svg += `<line x1="${x}" y1="${trackA}" x2="${x}" y2="${trackB}" stroke="#a855f7" stroke-opacity="0.35" stroke-width="1"/>`;

      // Circles on both tracks
      const r = film.award ? 6 : 5;
      svg += `<circle cx="${x}" cy="${trackA}" r="${r}" fill="#a855f7"/>`;
      svg += `<circle cx="${x}" cy="${trackB}" r="${r}" fill="#a855f7"/>`;

      // Award ring
      if (film.award) {
        svg += `<circle cx="${x}" cy="${trackA}" r="9" fill="none" stroke="#ffd700" stroke-opacity="0.35" stroke-width="1.5"/>`;
        svg += `<circle cx="${x}" cy="${trackB}" r="9" fill="none" stroke="#ffd700" stroke-opacity="0.35" stroke-width="1.5"/>`;
      }

      // Label significant shared films: award:true + first + last shared
      const isSignificant = film.award || film === firstShared || film === lastShared;
      if (isSignificant) {
        const labelY = (labelAlt % 2 === 0) ? 55 : 140;
        svg += `<text x="${x}" y="${labelY}" text-anchor="middle" font-size="7.5" fill="#94a3b8" font-family="Barlow, sans-serif">${film.title} (${film.year})</text>`;
        labelAlt++;
      }
    } else if (film.person === 'A') {
      // Small cyan circle on personA track
      svg += `<circle cx="${x}" cy="${trackA}" r="3" fill="#00d9ff" fill-opacity="0.35"/>`;

      // Label only if award
      if (film.award) {
        svg += `<text x="${x}" y="${trackA - 10}" text-anchor="middle" font-size="7.5" fill="#94a3b8" font-family="Barlow, sans-serif">${film.title} (${film.year})</text>`;
      }
    } else if (film.person === 'B') {
      // Small gold circle on personB track
      svg += `<circle cx="${x}" cy="${trackB}" r="3" fill="#ffd700" fill-opacity="0.3"/>`;

      // Label only if award
      if (film.award) {
        svg += `<text x="${x}" y="${trackB + 15}" text-anchor="middle" font-size="7.5" fill="#94a3b8" font-family="Barlow, sans-serif">${film.title} (${film.year})</text>`;
      }
    }
  });

  svg += '</svg>';

  container.innerHTML = svg;

  // Update pair label text
  const pairLabel = document.querySelector('.timeline-pair-label');
  if (pairLabel) {
    pairLabel.textContent = pair.personA.name.toUpperCase() + ' \u00D7 ' + pair.personB.name.toUpperCase();
  }

  // Update legend labels
  const legendA = document.getElementById('legendPersonA');
  const legendB = document.getElementById('legendPersonB');
  if (legendA) legendA.textContent = pair.personA.name;
  if (legendB) legendB.textContent = pair.personB.name;
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
  const posterPaths = [];

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

    // Award badge for highly rated popular films
    if (movie.vote_count > 5000 && movie.vote_average > 7.5) {
      const badge = tile.querySelector('.film-tile-award');
      if (badge) badge.style.display = 'block';
    }

    if (movie.poster_path) posterPaths.push(movie.poster_path);
  });

  populateMosaic(posterPaths);
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

function populateMosaic(posterPaths) {
  if (!posterPaths || posterPaths.length === 0) return;

  setTimeout(() => {
    const cells = document.querySelectorAll('.mosaic-cell');
    if (cells.length === 0) return;

    // Shuffle poster paths
    const shuffled = [...posterPaths].sort(() => Math.random() - 0.5);

    // Repeat paths if fewer than 42
    const extended = [];
    while (extended.length < 42) {
      extended.push(...shuffled);
    }

    cells.forEach((cell, i) => {
      if (extended[i]) {
        cell.style.backgroundImage = `url(${TMDB_IMG}w92${extended[i]})`;
      }
    });
  }, 300);
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

function initScrollHint() {
  const scrollContainer = document.querySelector('.timeline-scroll-container');
  const hint = document.querySelector('.timeline-scroll-hint');

  if (scrollContainer && hint) {
    scrollContainer.addEventListener('scroll', () => {
      hint.classList.add('hidden');
    }, { once: true });
  }
}

/* ----------------------------------------------------------
   SECTION 9 — INIT
   ---------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const pair = FEATURED_PAIRS[pairIndex];
  renderTimeline(pair, 'timeline-svg-wrapper');
  loadTrendingFilms();
  loadTrendingPeople();
  initShowcase();
  initSearch();
  initScrollHint();

  // Film tiles -> MovieCube
  document.querySelectorAll('.film-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const id = tile.dataset.movieId;
      if (id && typeof openMovieCube === 'function') openMovieCube(parseInt(id));
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
