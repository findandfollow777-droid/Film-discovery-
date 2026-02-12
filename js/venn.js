/* ============================================
   ORBIT - STELLAR TERRITORIES
   Organic layout with actor names as focal points
============================================ */

const MOVIES_PER_PERSON = 35;

// State
let people = [];
let currentSort = "chronology";
let isReversed = false;
let processedData = { soloMovies: [], sharedMovies: [] };
let hoveredActorIndex = null;

// Zoom/Pan state
let scale = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let lastPan = { x: 0, y: 0 };

// World dimensions
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 4000;

// Actor territory positions - CLOSE together so nebulas overlap at borders
const TERRITORY_LAYOUTS = {
  2: [
    { x: 0.4, y: 0.5, radius: 800 },
    { x: 0.6, y: 0.5, radius: 800 }
  ],
  3: [
    { x: 0.5, y: 0.38, radius: 700 },
    { x: 0.32, y: 0.62, radius: 700 },
    { x: 0.68, y: 0.62, radius: 700 }
  ],
  4: [
    { x: 0.38, y: 0.38, radius: 600 },
    { x: 0.62, y: 0.38, radius: 600 },
    { x: 0.38, y: 0.62, radius: 600 },
    { x: 0.62, y: 0.62, radius: 600 }
  ]
};

const ORBIT_COLORS = ['#00d9ff', '#ff006e', '#00ff88', '#ffd700'];

// DOM Elements
let vennViewport, vennWorld, moviesLayer, actorsLayer, vennLegend;
let convergenceCount, vennSubtitle;
let miniMap, miniMapCanvas, miniViewport;
let zoomIn, zoomOut, zoomReset, zoomLevel;
let decadeFilter, yearFilter, ratingFilter, billingFilter, roleFilter, excludeSelfCheckbox, featureFilmsOnly, reverseBtn;
let infoPanel, infoClose, infoPoster, infoTitle, infoYear, infoRating, infoPeople, infoSynopsis;

// Initialize
document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  loadData();

  if (people.length < 2) {
    alert("Need at least 2 people for this view.");
    window.location.href = "timeline.html";
    return;
  }

  // Fetch movies for any people that don't have them (e.g. from MovieCube Compare Actors)
  await ensurePeopleHaveMovies();

  // Log encountered people
  if (window.OrbitEncounters) {
    people.forEach(p => {
      window.OrbitEncounters.logEncounter({
        id: p.id,
        name: p.name,
        profile_path: p.profile || p.profile_path || null,
        known_for_department: p.role || null
      }, 'venn');
    });
  }

  // Initialize the shared movie cube component
  initMovieCube({
    onPersonClick: (personId, personName) => {
      // Navigate to timeline for this person
      closeMovieCube();
      window.location.href = `timeline.html?id=${personId}&name=${encodeURIComponent(personName)}`;
    },
    onAnchorClick: (movie) => {
      localStorage.setItem("anchorMovie", JSON.stringify(movie));
      window.location.href = "constellation.html";
    }
  });

  setupZoomPan();
  setupEventListeners();
  processAndRender();
  centerView();
}

async function ensurePeopleHaveMovies() {
  const needsFetch = people.filter(p => !p.movies || p.movies.length === 0);
  if (needsFetch.length === 0) return;

  await Promise.all(needsFetch.map(async (person) => {
    try {
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${person.id}/movie_credits?api_key=${TMDB_API_KEY}`
      );
      const credits = await creditsRes.json();

      const movieMap = new Map();

      (credits.cast || []).forEach(m => {
        if (!m.poster_path) return;
        if (!movieMap.has(m.id)) {
          movieMap.set(m.id, {
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            release_date: m.release_date,
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            popularity: m.popularity,
            overview: m.overview,
            genre_ids: m.genre_ids,
            character: m.character,
            jobs: ['acting'],
            personIndex: people.indexOf(person)
          });
        }
      });

      (credits.crew || []).forEach(m => {
        if (!m.poster_path) return;
        if (movieMap.has(m.id)) {
          const existing = movieMap.get(m.id);
          if (!existing.jobs.includes(m.job)) existing.jobs.push(m.job);
        } else {
          movieMap.set(m.id, {
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            release_date: m.release_date,
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            popularity: m.popularity,
            overview: m.overview,
            genre_ids: m.genre_ids,
            jobs: [m.job],
            personIndex: people.indexOf(person)
          });
        }
      });

      person.movies = Array.from(movieMap.values())
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, MOVIES_PER_PERSON);
    } catch (e) {
      console.error(`Failed to fetch movies for ${person.name}:`, e);
      person.movies = [];
    }
  }));

  // Update localStorage so subsequent visits have the data
  localStorage.setItem("vennPeople", JSON.stringify(people));
}

function cacheElements() {
  vennViewport = document.getElementById("vennViewport");
  vennWorld = document.getElementById("vennWorld");
  moviesLayer = document.getElementById("moviesLayer");
  actorsLayer = document.getElementById("actorsLayer");
  vennLegend = document.getElementById("vennLegend");
  convergenceCount = document.getElementById("convergenceCount");
  vennSubtitle = document.getElementById("vennSubtitle");
  miniMap = document.getElementById("miniMap");
  miniMapCanvas = document.getElementById("miniMapCanvas");
  miniViewport = document.getElementById("miniViewport");
  zoomIn = document.getElementById("zoomIn");
  zoomOut = document.getElementById("zoomOut");
  zoomReset = document.getElementById("zoomReset");
  zoomLevel = document.getElementById("zoomLevel");
  decadeFilter = document.getElementById("decadeFilter");
  yearFilter = document.getElementById("yearFilter");
  ratingFilter = document.getElementById("ratingFilter");
  billingFilter = document.getElementById("billingFilter");
  roleFilter = document.getElementById("roleFilter");
  excludeSelfCheckbox = document.getElementById("excludeSelf");
  featureFilmsOnly = document.getElementById("featureFilmsOnly");
  reverseBtn = document.getElementById("reverseBtn");
  infoPanel = document.getElementById("infoPanel");
  infoClose = document.getElementById("infoClose");
  infoPoster = document.getElementById("infoPoster");
  infoTitle = document.getElementById("infoTitle");
  infoYear = document.getElementById("infoYear");
  infoRating = document.getElementById("infoRating");
  infoPeople = document.getElementById("infoPeople");
  infoSynopsis = document.getElementById("infoSynopsis");
}

function loadData() {
  try {
    people = JSON.parse(localStorage.getItem("vennPeople") || "[]");
  } catch {
    people = [];
  }
}

// ============================================
// PROCESSING & FILTERING
// ============================================

function processAndRender() {
  const names = people.map(p => p.name).join(" × ");
  vennSubtitle.textContent = names;
  
  // Get all source movies
  const allSourceMovies = people.flatMap(p => p.movies || []);
  
  // Populate filters FIRST (before applying filters)
  populateFilters(allSourceMovies);
  
  // Get filter values
  const decadeVal = decadeFilter?.value || "all";
  const yearVal = yearFilter?.value || "all";
  const ratingVal = ratingFilter?.value || "all";
  const billingVal = billingFilter?.value || "all";
  const roleVal = roleFilter?.value || "all";
  const excludeSelf = excludeSelfCheckbox?.checked || false;
  const featuresOnly = featureFilmsOnly?.checked || false;
  
  const today = new Date();
  
  // Genre IDs to exclude for "Features Only"
  // 99 = Documentary, 10770 = TV Movie
  const NON_FEATURE_GENRES = [99, 10770];
  
  // Helper functions
  const isUnreleased = (m) => {
    if (!m.release_date) return true;
    return new Date(m.release_date) > today;
  };
  
  const isNonFeature = (m) => {
    const genres = m.genre_ids || [];
    return genres.some(g => NON_FEATURE_GENRES.includes(g));
  };
  
  const isSelf = (m) => {
    const char = (m.character || '').toLowerCase();
    return char.includes('himself') || char.includes('herself') || 
           char.includes('themselves') || char === 'self' ||
           char.includes('(self)') || char.includes('(himself)') || char.includes('(herself)');
  };
  
  const passesBillingFilter = (m) => {
    if (billingVal === "all") return true;
    // Billing only applies if movie has acting role
    if (!m.jobCategories?.includes('acting')) return true;
    const order = m.billing_order ?? m.order ?? 999;
    switch (billingVal) {
      case "lead": return order === 0;
      case "colead": return order >= 0 && order <= 2;
      case "supporting": return order >= 0 && order <= 5;
      default: return true;
    }
  };
  
  const passesRoleFilter = (m) => {
    if (roleVal === "all") return true;
    return m.jobCategories?.includes(roleVal) || false;
  };
  
  // Universal filter function - applies to ALL movies including convergences
  const filterFn = (m) => {
    // Exclude unreleased
    if (isUnreleased(m)) return false;
    
    // Features only filter (exclude documentaries and TV movies)
    if (featuresOnly && isNonFeature(m)) return false;
    
    // Self exclusion
    if (excludeSelf && isSelf(m)) return false;
    
    // Billing filter (for actors)
    if (!passesBillingFilter(m)) return false;
    
    // Role filter (for all job categories)
    if (!passesRoleFilter(m)) return false;
    
    const year = getYear(m);
    
    // Year filter - exact year match
    if (yearVal !== "all") {
      if (!year || year !== parseInt(yearVal)) return false;
    }
    
    // Decade filter - only if year filter not set
    if (yearVal === "all" && decadeVal !== "all") {
      if (!year) return false;
      const movieDecade = Math.floor(year / 10) * 10;
      if (movieDecade !== parseInt(decadeVal)) return false;
    }
    
    // Rating filter
    if (ratingVal !== "all" && (m.vote_average || 0) < parseFloat(ratingVal)) return false;
    
    return true;
  };
  
  // Build movie map - filter applied to ALL movies
  const moviePeopleMap = new Map();
  people.forEach((person, pIndex) => {
    (person.movies || []).filter(filterFn).forEach(movie => {
      if (!moviePeopleMap.has(movie.id)) {
        moviePeopleMap.set(movie.id, { movie, personIndices: [] });
      }
      moviePeopleMap.get(movie.id).personIndices.push(pIndex);
    });
  });
  
  // Extract shared movies - these are ALREADY filtered
  const sharedMovies = [];
  const sharedMovieIds = new Set();
  moviePeopleMap.forEach(entry => {
    if (entry.personIndices.length > 1) {
      sharedMovies.push(entry);
      sharedMovieIds.add(entry.movie.id);
    }
  });
  
  // Get solo movies per person - already filtered via moviePeopleMap
  const soloMoviesByPerson = people.map((person, pIndex) => {
    // Get solo movies from the already-filtered map
    let soloMovies = [];
    moviePeopleMap.forEach(entry => {
      if (entry.personIndices.length === 1 && entry.personIndices[0] === pIndex) {
        soloMovies.push(entry.movie);
      }
    });
    
    // Sort
    switch (currentSort) {
      case "chronology":
        soloMovies.sort((a, b) => new Date(b.release_date || "0") - new Date(a.release_date || "0"));
        break;
      case "rating":
        soloMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case "boxoffice":
        soloMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    
    if (isReversed) soloMovies.reverse();
    return soloMovies.slice(0, MOVIES_PER_PERSON).map(movie => ({ movie, personIndex: pIndex }));
  });
  
  processedData = { sharedMovies, soloMoviesByPerson };
  convergenceCount.textContent = sharedMovies.length;
  
  renderActorTerritories();
  renderMovies();
  renderLegend();
  updateMiniMap();
}

function populateFilters(movies) {
  const decades = new Set();
  const years = new Set();
  const roles = new Set();
  
  movies.forEach(m => {
    const year = getYear(m);
    if (year) {
      years.add(year);
      decades.add(Math.floor(year / 10) * 10);
    }
    // Collect job categories
    (m.jobCategories || []).forEach(jc => roles.add(jc));
  });
  
  // Preserve current selections
  const currentDecade = decadeFilter?.value || "all";
  const currentYear = yearFilter?.value || "all";
  const currentRole = roleFilter?.value || "all";
  
  if (decadeFilter) {
    const sorted = [...decades].sort((a, b) => b - a);
    decadeFilter.innerHTML = '<option value="all">All Decades</option>' +
      sorted.map(d => `<option value="${d}"${d == currentDecade ? ' selected' : ''}>${d}s</option>`).join('');
  }
  
  if (yearFilter) {
    const sorted = [...years].sort((a, b) => b - a);
    yearFilter.innerHTML = '<option value="all">All Years</option>' +
      sorted.map(y => `<option value="${y}"${y == currentYear ? ' selected' : ''}>${y}</option>`).join('');
  }
  
  // Populate role filter based on available job categories
  if (roleFilter) {
    const roleLabels = {
      'acting': '🎭 Acting',
      'directing': '🎬 Directing',
      'producing': '🎥 Producing',
      'writing': '✍️ Writing',
      'cinematography': '📷 Cinematography',
      'music': '🎵 Music',
      'editing': '✂️ Editing',
      'other_crew': '🎞️ Other Crew'
    };
    
    let options = '<option value="all">All Roles</option>';
    ['acting', 'directing', 'producing', 'writing', 'cinematography', 'music', 'editing', 'other_crew'].forEach(role => {
      if (roles.has(role)) {
        options += `<option value="${role}"${role === currentRole ? ' selected' : ''}>${roleLabels[role]}</option>`;
      }
    });
    
    roleFilter.innerHTML = options;
    
    // Show/hide filters based on what's available
    const hasActing = roles.has('acting');
    const hasCrew = [...roles].some(r => r !== 'acting');
    
    if (hasActing && !hasCrew) {
      // Pure actors - show billing, hide role
      if (billingFilter) billingFilter.style.display = '';
      roleFilter.style.display = 'none';
    } else if (hasCrew && !hasActing) {
      // Pure crew - hide billing, show role
      if (billingFilter) billingFilter.style.display = 'none';
      roleFilter.style.display = '';
    } else {
      // Mixed - show both
      if (billingFilter) billingFilter.style.display = '';
      roleFilter.style.display = '';
    }
  }
}

function getYear(movie) {
  if (!movie.release_date) return null;
  return parseInt(movie.release_date.substring(0, 4));
}

// ============================================
// RENDER ACTOR TERRITORIES
// ============================================

let nebulaLayer;

function renderActorTerritories() {
  if (!actorsLayer) return;
  actorsLayer.innerHTML = "";
  
  // Get or create nebula layer
  nebulaLayer = document.getElementById("nebulaLayer");
  if (nebulaLayer) nebulaLayer.innerHTML = "";
  
  const n = people.length;
  const layout = TERRITORY_LAYOUTS[n] || TERRITORY_LAYOUTS[2];
  
  people.forEach((person, i) => {
    const pos = layout[i];
    if (!pos) return;
    
    const x = pos.x * WORLD_WIDTH;
    const y = pos.y * WORLD_HEIGHT;
    const color = ORBIT_COLORS[i];
    const movieCount = (processedData.soloMoviesByPerson[i]?.length || 0) + 
      processedData.sharedMovies.filter(s => s.personIndices.includes(i)).length;
    
    // NEBULA - render to nebulaLayer (behind movies) - WIDE FADE
    if (nebulaLayer) {
      const nebula = document.createElement("div");
      nebula.className = `actor-nebula-glow orbit-${i + 1}`;
      nebula.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        width: 3200px;
        height: 3200px;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, 
          ${color}50 0%, 
          ${color}35 15%, 
          ${color}25 25%, 
          ${color}18 35%, 
          ${color}12 45%, 
          ${color}08 55%, 
          ${color}04 70%, 
          ${color}02 85%, 
          transparent 100%);
        filter: blur(100px);
        pointer-events: none;
      `;
      nebulaLayer.appendChild(nebula);
    }
    
    // ACTOR NAME - render to actorsLayer (in front of movies)
    const nameContainer = document.createElement("div");
    nameContainer.className = `actor-territory orbit-${i + 1}`;
    nameContainer.dataset.index = i;
    nameContainer.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    `;
    
    nameContainer.innerHTML = `
      <h2 class="actor-name">${person.name}</h2>
      <p class="actor-film-count">${movieCount} films</p>
    `;
    
    actorsLayer.appendChild(nameContainer);
  });
}

function highlightActor(index) {
  hoveredActorIndex = index;
  
  // Update territories
  document.querySelectorAll(".actor-territory").forEach((el, i) => {
    el.classList.toggle("highlighted", i === index);
  });
  
  // Update movies
  document.querySelectorAll(".venn-movie").forEach(el => {
    const movieIndices = el.dataset.personIndices.split(",").map(Number);
    if (index === null) {
      el.classList.remove("highlighted", "dimmed");
    } else if (movieIndices.includes(index)) {
      el.classList.add("highlighted");
      el.classList.remove("dimmed");
    } else {
      el.classList.add("dimmed");
      el.classList.remove("highlighted");
    }
  });
  
  // Update legend
  document.querySelectorAll(".legend-item").forEach((el, i) => {
    el.style.opacity = index === null || i === index ? 1 : 0.4;
  });
}

// ============================================
// RENDER MOVIES
// ============================================

// Helper to check if position is valid (not in shared regions)
function isValidPosition(x, y, cardWidth, cardHeight, sharedRegions) {
  for (const region of sharedRegions) {
    const dx = x - region.x;
    const dy = y - region.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < region.radius + cardWidth / 2) {
      return false;
    }
  }
  return true;
}

function renderMovies() {
  if (!moviesLayer) return;
  moviesLayer.innerHTML = "";
  
  const n = people.length;
  const layout = TERRITORY_LAYOUTS[n] || TERRITORY_LAYOUTS[2];
  const { sharedMovies, soloMoviesByPerson } = processedData;
  
  // Count total for sizing
  const totalMovies = soloMoviesByPerson.reduce((sum, arr) => sum + arr.length, 0) + sharedMovies.length;
  
  // Dynamic card sizing - bigger tiles for better visibility
  let cardWidth, cardHeight;
  if (totalMovies <= 5) {
    cardWidth = 200; cardHeight = 300;
  } else if (totalMovies <= 10) {
    cardWidth = 170; cardHeight = 255;
  } else if (totalMovies <= 20) {
    cardWidth = 145; cardHeight = 217;
  } else if (totalMovies <= 40) {
    cardWidth = 125; cardHeight = 187;
  } else if (totalMovies <= 70) {
    cardWidth = 110; cardHeight = 165;
  } else if (totalMovies <= 100) {
    cardWidth = 95; cardHeight = 142;
  } else {
    cardWidth = 85; cardHeight = 127;
  }
  
  // Calculate shared movie regions to avoid (with larger buffer)
  const sharedRegions = [];
  const convWidth = Math.min(cardWidth * 1.4, 220);
  const convHeight = convWidth * 1.5;
  
  if (sharedMovies.length > 0) {
    const borderMoviesTemp = new Map();
    sharedMovies.forEach(entry => {
      const { personIndices } = entry;
      const key = [...personIndices].sort((a, b) => a - b).join('-');
      if (!borderMoviesTemp.has(key)) {
        borderMoviesTemp.set(key, []);
      }
      borderMoviesTemp.get(key).push(entry);
    });
    
    borderMoviesTemp.forEach((movies, key) => {
      const actorIndices = key.split('-').map(Number);
      const positions = actorIndices.map(i => layout[i]).filter(Boolean);
      if (positions.length >= 2) {
        const midX = (positions[0].x + positions[1].x) / 2 * WORLD_WIDTH;
        const midY = (positions[0].y + positions[1].y) / 2 * WORLD_HEIGHT;
        // Tight exclusion - just the intersection tiles themselves
        const exclusionRadius = 180 + movies.length * 35;
        sharedRegions.push({ x: midX, y: midY, radius: exclusionRadius });
      }
    });
  }
  
  // Render solo movies - ORGANIC SPACE FLOATING with 5% overlap limit
  soloMoviesByPerson.forEach((movies, pIndex) => {
    const pos = layout[pIndex];
    if (!pos || movies.length === 0) return;
    
    const cx = pos.x * WORLD_WIDTH;
    const cy = pos.y * WORLD_HEIGHT;
    
    // Actor name exclusion (small - just the text)
    const nameRadius = 100;
    
    // Calculate direction AWAY from center (toward outer edge)
    const worldCenterX = WORLD_WIDTH / 2;
    const worldCenterY = WORLD_HEIGHT / 2;
    const outwardAngle = Math.atan2(cy - worldCenterY, cx - worldCenterX);
    
    // Place movies organically throughout the territory
    const placedPositions = [];
    
    // 5% overlap limit
    const maxOverlaps = Math.max(1, Math.floor(movies.length * 0.05));
    let currentOverlaps = 0;
    
    movies.forEach((entry, i) => {
      const { movie } = entry;
      
      let bestX = cx, bestY = cy;
      let bestScore = -Infinity;
      
      // Try more random positions to find non-overlapping spots
      for (let attempt = 0; attempt < 80; attempt++) {
        // Organic distribution - mix of patterns
        let angle, dist;
        
        if (attempt < 30) {
          // Random spread throughout territory
          angle = Math.random() * Math.PI * 2;
          // Mix of close and far distances
          const t = Math.random();
          dist = nameRadius + 40 + t * 700;
        } else if (attempt < 55) {
          // Fill gaps near intersections (but not in them)
          let nearestRegion = sharedRegions[0];
          let nearestDist = Infinity;
          for (const region of sharedRegions) {
            const d = Math.sqrt((cx - region.x) ** 2 + (cy - region.y) ** 2);
            if (d < nearestDist) {
              nearestDist = d;
              nearestRegion = region;
            }
          }
          if (nearestRegion) {
            const toRegion = Math.atan2(nearestRegion.y - cy, nearestRegion.x - cx);
            angle = toRegion + (Math.random() - 0.5) * 1.5;
            dist = nearestDist - nearestRegion.radius - cardWidth / 2 - 30 - Math.random() * 80;
            dist = Math.max(nameRadius + 50, dist);
          } else {
            angle = Math.random() * Math.PI * 2;
            dist = nameRadius + 50 + Math.random() * 500;
          }
        } else {
          // Outer edges
          angle = outwardAngle + (Math.random() - 0.5) * Math.PI * 1.2;
          dist = 500 + Math.random() * 350;
        }
        
        // Add jitter for organic feel
        const jitterX = (Math.random() - 0.5) * 30;
        const jitterY = (Math.random() - 0.5) * 30;
        
        const x = cx + Math.cos(angle) * dist + jitterX;
        const y = cy + Math.sin(angle) * dist + jitterY;
        
        // Calculate score for this position
        let score = 50; // Base score
        let valid = true;
        let wouldOverlap = false;
        
        // Not in shared regions
        for (const region of sharedRegions) {
          const dx = x - region.x;
          const dy = y - region.y;
          const distToRegion = Math.sqrt(dx * dx + dy * dy);
          if (distToRegion < region.radius + cardWidth / 2 + 10) {
            valid = false;
            break;
          }
          // Bonus for being close to intersection edge
          if (distToRegion < region.radius + cardWidth + 100) {
            score += 20;
          }
        }
        
        if (!valid) continue;
        
        // Not too close to actor name
        const distFromName = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (distFromName < nameRadius) {
          continue;
        }
        
        // Check overlap with placed movies - STRICT: cards touching = overlap
        let minDistToPlaced = Infinity;
        const minSeparation = Math.max(cardWidth, cardHeight) * 1.05; // Cards must not touch
        
        for (const p of placedPositions) {
          const dx = x - p.x;
          const dy = y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          minDistToPlaced = Math.min(minDistToPlaced, d);
          
          // Would this touch another card?
          if (d < minSeparation) {
            wouldOverlap = true;
          }
        }
        
        // If would overlap, only allow if under 5% limit
        if (wouldOverlap && currentOverlaps >= maxOverlaps) {
          continue; // Skip - too many overlaps already
        }
        
        // Strongly prefer positions with good spacing
        if (minDistToPlaced > minSeparation * 1.5) {
          score += 50; // Excellent spacing bonus
        } else if (minDistToPlaced > minSeparation * 1.2) {
          score += 30; // Good spacing bonus
        } else if (minDistToPlaced > minSeparation) {
          score += 10; // Acceptable spacing
        }
        
        // Within world bounds
        const margin = cardWidth * 0.4;
        if (x < margin || x > WORLD_WIDTH - margin || 
            y < margin || y > WORLD_HEIGHT - margin) {
          continue;
        }
        
        // Add randomness
        score += Math.random() * 15;
        
        if (score > bestScore) {
          bestScore = score;
          bestX = x;
          bestY = y;
        }
      }
      
      // Check if final position overlaps
      let finalOverlaps = false;
      const minSep = Math.max(cardWidth, cardHeight) * 1.05;
      for (const p of placedPositions) {
        const dx = bestX - p.x;
        const dy = bestY - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < minSep) {
          finalOverlaps = true;
          break;
        }
      }
      if (finalOverlaps) {
        currentOverlaps++;
      }
      
      // Random slight rotation for organic feel
      const rotation = (Math.random() - 0.5) * 8; // -4 to +4 degrees
      
      placedPositions.push({ x: bestX, y: bestY });
      const card = createMovieCard(movie, [pIndex], cardWidth, cardHeight, bestX, bestY, false, rotation);
      moviesLayer.appendChild(card);
    });
  });
  
  // Render shared movies - in the intersection zones
  if (sharedMovies.length > 0) {
    // Group movies by which pair of actors they involve
    const borderMovies = new Map(); // key: "0-1" -> movies along that border
    
    sharedMovies.forEach(entry => {
      const { personIndices } = entry;
      // Create a key for this combination
      const key = [...personIndices].sort((a, b) => a - b).join('-');
      if (!borderMovies.has(key)) {
        borderMovies.set(key, []);
      }
      borderMovies.get(key).push(entry);
    });
    
    // Position movies along each border with better spacing
    borderMovies.forEach((movies, key) => {
      const actorIndices = key.split('-').map(Number);
      
      // Get the two (or more) actor positions
      const positions = actorIndices.map(i => layout[i]).filter(Boolean);
      if (positions.length < 2) return;
      
      // Calculate the midpoint and direction of the border
      const p1 = { x: positions[0].x * WORLD_WIDTH, y: positions[0].y * WORLD_HEIGHT };
      const p2 = { x: positions[1].x * WORLD_WIDTH, y: positions[1].y * WORLD_HEIGHT };
      
      // Midpoint between the two actors
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      
      // Direction perpendicular to the line connecting actors
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const borderAngle = Math.atan2(dy, dx) + Math.PI / 2;
      
      // INCREASED spread for better spacing
      const gapBetweenCards = convWidth + 40; // Card width + gap
      const borderLength = Math.max(600, movies.length * gapBetweenCards);
      
      // Use grid layout for many movies
      const moviesPerRow = Math.ceil(Math.sqrt(movies.length * 1.5));
      const rows = Math.ceil(movies.length / moviesPerRow);
      
      movies.forEach((entry, i) => {
        const { movie, personIndices } = entry;
        
        let x, y;
        
        if (movies.length <= 4) {
          // Small count - line them along border
          const t = movies.length === 1 ? 0 : (i / (movies.length - 1)) - 0.5;
          const alongBorder = t * borderLength;
          
          x = midX + Math.cos(borderAngle) * alongBorder;
          y = midY + Math.sin(borderAngle) * alongBorder;
        } else {
          // Many movies - use a grid pattern centered on midpoint
          const col = i % moviesPerRow;
          const row = Math.floor(i / moviesPerRow);
          
          // Center the grid
          const gridWidth = (moviesPerRow - 1) * gapBetweenCards;
          const gridHeight = (rows - 1) * (convHeight + 30);
          
          const offsetX = (col - (moviesPerRow - 1) / 2) * gapBetweenCards;
          const offsetY = (row - (rows - 1) / 2) * (convHeight + 30);
          
          // Rotate grid to align with border
          x = midX + Math.cos(borderAngle) * offsetX - Math.sin(borderAngle) * offsetY;
          y = midY + Math.sin(borderAngle) * offsetX + Math.cos(borderAngle) * offsetY;
        }
        
        const card = createMovieCard(movie, personIndices, convWidth, convHeight, x, y, true);
        moviesLayer.appendChild(card);
      });
    });
  }
}

function createMovieCard(movie, personIndices, width, height, x, y, isConvergence, rotation = 0) {
  const card = document.createElement("div");
  const primaryIndex = personIndices[0];
  
  card.className = `venn-movie orbit-${primaryIndex + 1}${isConvergence ? ' convergence' : ''}`;
  card.dataset.movieId = movie.id;
  card.dataset.personIndices = personIndices.join(",");
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
  
  // Apply rotation for organic floating feel
  if (rotation && !isConvergence) {
    card.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  } else {
    card.style.transform = "translate(-50%, -50%)";
  }
  
  // Convergence movies get higher z-index to stay on top
  if (isConvergence) {
    card.style.zIndex = "30";
  }
  
  // Set gradient border for convergence
  if (isConvergence && personIndices.length >= 2) {
    const colors = personIndices.map(i => ORBIT_COLORS[i]);
    card.style.setProperty('--gradient-border', `linear-gradient(135deg, ${colors.join(', ')})`);
  }
  
  const year = getYear(movie);
  const rating = movie.vote_average?.toFixed(1) || "";
  const posterUrl = movie.poster_path 
    ? `${TMDB_IMG}w300${movie.poster_path}`
    : `https://placehold.co/${width}x${height}?text=?`;
  
  let dotsHtml = "";
  if (isConvergence) {
    dotsHtml = `<div class="convergence-dots">
      ${personIndices.map(i => `<div class="convergence-dot orbit-${i + 1}"></div>`).join('')}
    </div>`;
  }
  
  card.innerHTML = `
    <div class="movie-card-inner">
      ${dotsHtml}
      <img class="movie-poster" src="${posterUrl}" alt="${movie.title}" loading="lazy"
           onerror="this.src='https://placehold.co/${width}x${height}?text=?'">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        ${year ? `<div class="movie-year">${year}</div>` : ''}
      </div>
      ${rating ? `<div class="movie-rating">⭐ ${rating}</div>` : ''}
    </div>
  `;
  
  card.addEventListener("click", () => openMovieCube(movie.id));
  
  return card;
}

// ============================================
// LEGEND
// ============================================

function renderLegend() {
  if (!vennLegend) return;
  
  vennLegend.innerHTML = people.map((person, i) => {
    const soloCount = processedData.soloMoviesByPerson[i]?.length || 0;
    const sharedCount = processedData.sharedMovies.filter(s => s.personIndices.includes(i)).length;
    const total = soloCount + sharedCount;
    
    return `
      <div class="legend-item" data-index="${i}">
        <div class="legend-dot orbit-${i + 1}"></div>
        <span class="legend-name">${person.name}</span>
        <span class="legend-count">(${total})</span>
      </div>
    `;
  }).join('');
  
  // Legend hover events
  vennLegend.querySelectorAll(".legend-item").forEach(item => {
    item.addEventListener("mouseenter", () => highlightActor(parseInt(item.dataset.index)));
    item.addEventListener("mouseleave", () => highlightActor(null));
  });
}

// ============================================
// INFO PANEL
// ============================================

let currentInfoMovieId = null;

function showInfo(movie, personIndices) {
  infoPoster.src = `${TMDB_IMG}w342${movie.poster_path}`;
  infoTitle.textContent = movie.title;
  infoYear.textContent = movie.release_date ? movie.release_date.split("-")[0] : "";
  infoRating.textContent = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : "";
  infoSynopsis.textContent = movie.overview || "No synopsis available.";
  
  infoPeople.innerHTML = personIndices.map(i => 
    `<span class="info-person-tag orbit-${i + 1}">${people[i].name}</span>`
  ).join('');
  
  // Store movie ID for 3D popup
  currentInfoMovieId = movie.id;
  
  // Collapse bio panel if open
  const bioPanel = document.getElementById("bioPanelRight");
  if (bioPanel) {
    bioPanel.classList.remove("expanded");
  }
  
  infoPanel.hidden = false;
}

function hideInfo() {
  infoPanel.hidden = true;
  currentInfoMovieId = null;
}

// ============================================
// ZOOM & PAN
// ============================================

function setupZoomPan() {
  vennViewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = vennViewport.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, delta);
  }, { passive: false });
  
  vennViewport.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", endDrag);
  
  vennViewport.addEventListener("touchstart", handleTouchStart, { passive: false });
  vennViewport.addEventListener("touchmove", handleTouchMove, { passive: false });
  vennViewport.addEventListener("touchend", handleTouchEnd);
  
  zoomIn?.addEventListener("click", () => zoomAt(vennViewport.offsetWidth/2, vennViewport.offsetHeight/2, 1.3));
  zoomOut?.addEventListener("click", () => zoomAt(vennViewport.offsetWidth/2, vennViewport.offsetHeight/2, 0.7));
  zoomReset?.addEventListener("click", centerView);
}

function zoomAt(mx, my, factor) {
  const newScale = Math.max(0.2, Math.min(2.5, scale * factor));
  const worldX = (mx - panX) / scale;
  const worldY = (my - panY) / scale;
  panX = mx - worldX * newScale;
  panY = my - worldY * newScale;
  scale = newScale;
  applyTransform();
}

function centerView() {
  const vpW = vennViewport.offsetWidth;
  const vpH = vennViewport.offsetHeight;
  // Start more zoomed in for better visibility
  scale = Math.min(vpW / WORLD_WIDTH, vpH / WORLD_HEIGHT) * 1.4;
  // Clamp scale to reasonable range
  scale = Math.max(0.3, Math.min(1.5, scale));
  panX = (vpW - WORLD_WIDTH * scale) / 2;
  panY = (vpH - WORLD_HEIGHT * scale) / 2;
  applyTransform();
}

function applyTransform() {
  vennWorld.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  if (zoomLevel) zoomLevel.textContent = `${Math.round(scale * 100)}%`;
  updateMiniMap();
}

function startDrag(e) {
  if (e.target.closest(".venn-movie, .actor-territory")) return;
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  lastPan = { x: panX, y: panY };
  vennViewport.style.cursor = "grabbing";
}

function doDrag(e) {
  if (!isDragging) return;
  panX = lastPan.x + (e.clientX - dragStart.x);
  panY = lastPan.y + (e.clientY - dragStart.y);
  applyTransform();
}

function endDrag() {
  isDragging = false;
  vennViewport.style.cursor = "grab";
}

// Touch
let lastTouchDist = 0;

function handleTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    lastPan = { x: panX, y: panY };
  } else if (e.touches.length === 2) {
    isDragging = false;
    lastTouchDist = getTouchDist(e.touches);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    panX = lastPan.x + (e.touches[0].clientX - dragStart.x);
    panY = lastPan.y + (e.touches[0].clientY - dragStart.y);
    applyTransform();
  } else if (e.touches.length === 2) {
    const dist = getTouchDist(e.touches);
    const factor = dist / lastTouchDist;
    lastTouchDist = dist;
    const center = getTouchCenter(e.touches);
    const rect = vennViewport.getBoundingClientRect();
    zoomAt(center.x - rect.left, center.y - rect.top, factor);
  }
}

function handleTouchEnd() { isDragging = false; }
function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
function getTouchCenter(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  };
}

// ============================================
// MINIMAP
// ============================================

function updateMiniMap() {
  if (!miniMapCanvas || !miniViewport) return;
  
  const ctx = miniMapCanvas.getContext("2d");
  const w = miniMapCanvas.width = miniMap.offsetWidth;
  const h = miniMapCanvas.height = miniMap.offsetHeight;
  
  ctx.fillStyle = "rgba(5, 10, 20, 0.9)";
  ctx.fillRect(0, 0, w, h);
  
  const scaleX = w / WORLD_WIDTH;
  const scaleY = h / WORLD_HEIGHT;
  const s = Math.min(scaleX, scaleY);
  
  // Draw actor positions
  const layout = TERRITORY_LAYOUTS[people.length] || TERRITORY_LAYOUTS[2];
  people.forEach((_, i) => {
    const pos = layout[i];
    if (!pos) return;
    ctx.beginPath();
    ctx.arc(pos.x * WORLD_WIDTH * s, pos.y * WORLD_HEIGHT * s, 8, 0, Math.PI * 2);
    ctx.fillStyle = ORBIT_COLORS[i];
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  
  // Viewport indicator
  const vpW = vennViewport.offsetWidth;
  const vpH = vennViewport.offsetHeight;
  const vx = (-panX / scale) * s;
  const vy = (-panY / scale) * s;
  const vw = (vpW / scale) * s;
  const vh = (vpH / scale) * s;
  
  miniViewport.style.left = `${vx}px`;
  miniViewport.style.top = `${vy}px`;
  miniViewport.style.width = `${vw}px`;
  miniViewport.style.height = `${vh}px`;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      processAndRender();
    });
  });
  
  reverseBtn?.addEventListener("click", () => {
    isReversed = !isReversed;
    reverseBtn.classList.toggle("active", isReversed);
    processAndRender();
  });
  
  decadeFilter?.addEventListener("change", processAndRender);
  yearFilter?.addEventListener("change", processAndRender);
  ratingFilter?.addEventListener("change", processAndRender);
  billingFilter?.addEventListener("change", processAndRender);
  roleFilter?.addEventListener("change", processAndRender);
  excludeSelfCheckbox?.addEventListener("change", processAndRender);
  featureFilmsOnly?.addEventListener("change", processAndRender);
  
  // Change 4: Convergence count hover - highlight all shared movies
  convergenceCount?.parentElement?.addEventListener("mouseenter", () => {
    document.querySelectorAll(".venn-movie").forEach(el => {
      if (el.classList.contains("convergence")) {
        el.classList.add("highlighted");
        el.classList.remove("dimmed");
      } else {
        el.classList.add("dimmed");
        el.classList.remove("highlighted");
      }
    });
  });
  
  convergenceCount?.parentElement?.addEventListener("mouseleave", () => {
    document.querySelectorAll(".venn-movie").forEach(el => {
      el.classList.remove("highlighted", "dimmed");
    });
  });
  
  infoClose?.addEventListener("click", hideInfo);
  
  // Details button - opens 3D popup
  const infoDetailsBtn = document.getElementById("infoDetailsBtn");
  infoDetailsBtn?.addEventListener("click", () => {
    if (currentInfoMovieId) {
      openMoviePopup(currentInfoMovieId);
    }
  });
  
  document.addEventListener("click", (e) => {
    if (!infoPanel.hidden && !infoPanel.contains(e.target) && !e.target.closest(".venn-movie")) {
      hideInfo();
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideInfo();
  });
  
  window.addEventListener("resize", debounce(() => {
    updateMiniMap();
  }, 200));
}

function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

// ============================================
// PERSON BIO PANELS (Venn)
// ============================================

// Genre colors - vibrant palette
const GENRE_COLORS = {
  "Action": "#ff4757",
  "Adventure": "#ff7f50",
  "Animation": "#ffd700",
  "Comedy": "#7bed9f",
  "Crime": "#5352ed",
  "Documentary": "#a55eea",
  "Drama": "#00d9ff",
  "Family": "#ff6b81",
  "Fantasy": "#d65db1",
  "History": "#c9a227",
  "Horror": "#2f3542",
  "Music": "#1dd1a1",
  "Mystery": "#576574",
  "Romance": "#ff6b9d",
  "Science Fiction": "#00ff88",
  "TV Movie": "#747d8c",
  "Thriller": "#eb4d4b",
  "War": "#6c5ce7",
  "Western": "#cd6133",
  "Other": "#4a5568"
};

function getGenreColor(genreName, index) {
  return GENRE_COLORS[genreName] || `hsl(${(index * 47) % 360}, 70%, 55%)`;
}

function getGenreName(genreId) {
  const genres = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
  };
  return genres[genreId] || null;
}

function initVennBioPanels() {
  const panel = document.getElementById("bioPanelRight");
  const tabBtn = document.getElementById("bioPanelTabRight");
  const closeBtn = document.getElementById("bioCloseRight");
  const personTabs = document.getElementById("bioPersonTabs");
  
  if (!panel || people.length === 0 || people.length > 4) {
    if (panel) panel.style.display = "none";
    return;
  }
  
  // Build person tabs with photos
  let tabsHtml = "";
  people.forEach((person, idx) => {
    const photoUrl = person.profile 
      ? `https://image.tmdb.org/t/p/w45${person.profile}`
      : "https://placehold.co/24x24?text=?";
    const firstName = person.name.split(" ")[0];
    tabsHtml += `
      <div class="bio-person-tab ${idx === 0 ? 'active' : ''}" data-person-idx="${idx}">
        <img class="bio-person-tab-photo" src="${photoUrl}" alt="${firstName}">
        <span class="bio-person-tab-name">${firstName}</span>
      </div>
    `;
  });
  
  if (personTabs) {
    personTabs.innerHTML = tabsHtml;
    
    // Tab click handlers
    personTabs.querySelectorAll(".bio-person-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const idx = parseInt(tab.dataset.personIdx);
        
        // Update active state
        personTabs.querySelectorAll(".bio-person-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        // Load bio
        loadVennPersonBio(people[idx]);
      });
    });
  }
  
  // Tab button to open panel
  if (tabBtn) {
    tabBtn.addEventListener("click", () => {
      panel.classList.add("expanded");
      // Auto-load first person
      if (people.length > 0) {
        loadVennPersonBio(people[0]);
      }
    });
  }
  
  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("expanded");
    });
  }
}

async function loadVennPersonBio(person) {
  try {
    const { id: resolvedId, person: personData } = await resolvePersonId(person.id, person.name);
    if (!personData) throw new Error("Could not resolve person");
    
    const bioPhoto = document.getElementById("bioPhoto");
    const bioName = document.getElementById("bioName");
    const bioRole = document.getElementById("bioRole");
    const bioDates = document.getElementById("bioDates");
    const bioMemorial = document.getElementById("bioMemorial");
    const bioBirthplace = document.getElementById("bioBirthplace");
    const bioText = document.getElementById("bioText");
    const bioFilmCount = document.getElementById("bioFilmCount");
    const bioAvgRating = document.getElementById("bioAvgRating");
    const bioCareerSpan = document.getElementById("bioCareerSpan");
    const bioDebut = document.getElementById("bioDebut");
    
    if (bioPhoto) {
      bioPhoto.src = personData.profile_path 
        ? `https://image.tmdb.org/t/p/w185${personData.profile_path}`
        : "https://placehold.co/70x100?text=?";
    }
    
    if (bioName) bioName.textContent = personData.name || "Unknown";
    if (bioRole) bioRole.textContent = personData.known_for_department || "Artist";
    
    // Format dates
    if (bioDates) {
      const birth = personData.birthday ? new Date(personData.birthday).getFullYear() : null;
      const death = personData.deathday ? new Date(personData.deathday).getFullYear() : null;
      
      if (birth && death) {
        bioDates.textContent = `${birth} – ${death}`;
      } else if (birth) {
        bioDates.textContent = `Born ${birth}`;
      } else {
        bioDates.textContent = "";
      }
    }
    
    if (bioMemorial) {
      bioMemorial.hidden = !personData.deathday;
    }
    
    if (bioBirthplace) {
      bioBirthplace.textContent = personData.place_of_birth || "";
      bioBirthplace.hidden = !personData.place_of_birth;
    }
    
    if (bioText) {
      const bio = personData.biography || "No biography available.";
      bioText.textContent = bio.length > 300 ? bio.substring(0, 300) + "..." : bio;
    }
    
    // Get movies for this person
    const movies = person.movies || [];
    
    if (bioFilmCount) {
      bioFilmCount.textContent = movies.length;
    }
    
    if (bioAvgRating && movies.length > 0) {
      const avgRating = movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / movies.length;
      bioAvgRating.textContent = avgRating.toFixed(1);
    }
    
    // Career span & Debut
    if (movies.length > 0) {
      const years = movies
        .map(m => m.release_date ? parseInt(m.release_date.substring(0, 4)) : null)
        .filter(y => y && y > 1900)
        .sort((a, b) => a - b);
      
      if (years.length > 0) {
        const firstYear = years[0];
        const endYear = personData.deathday 
          ? parseInt(personData.deathday.substring(0, 4)) 
          : new Date().getFullYear();
        const span = endYear - firstYear;
        
        if (bioCareerSpan) bioCareerSpan.textContent = `${span}y`;
        
        if (bioDebut) {
          const debutMovie = movies.find(m => {
            const y = m.release_date ? parseInt(m.release_date.substring(0, 4)) : null;
            return y === firstYear;
          });
          if (debutMovie) {
            bioDebut.textContent = `Debut: ${debutMovie.title} (${firstYear})`;
            bioDebut.hidden = false;
          }
        }
      }
    }
    
    // Render genre pie
    renderVennGenrePie(movies);
    
  } catch (e) {
    console.error("Failed to load person bio:", e);
  }
}

function renderVennGenrePie(movies) {
  const pieContainer = document.getElementById("genrePie");
  const legendContainer = document.getElementById("genreLegend");
  const tooltip = document.getElementById("genreTooltip");
  
  if (!pieContainer || !legendContainer) return;
  
  // Count genres
  const genreCounts = {};
  let totalGenreOccurrences = 0;
  
  movies.forEach(movie => {
    const genres = movie.genre_ids || [];
    genres.forEach(genreId => {
      const genreName = getGenreName(genreId);
      if (genreName) {
        genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        totalGenreOccurrences++;
      }
    });
  });
  
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  let displayGenres = sortedGenres.slice(0, 6);
  const otherGenres = sortedGenres.slice(6);
  
  if (otherGenres.length > 0) {
    const otherCount = otherGenres.reduce((sum, [_, count]) => sum + count, 0);
    displayGenres.push(["Other", otherCount]);
  }
  
  if (displayGenres.length === 0) {
    pieContainer.innerHTML = '<text x="100" y="100" text-anchor="middle" fill="#666" font-size="12">No genre data</text>';
    legendContainer.innerHTML = "";
    return;
  }
  
  // Build pie slices
  const cx = 100, cy = 100, r = 70;
  let currentAngle = -90;
  let svgContent = "";
  
  displayGenres.forEach(([genre, count], index) => {
    const percentage = (count / totalGenreOccurrences) * 100;
    const angle = (count / totalGenreOccurrences) * 360;
    const color = getGenreColor(genre, index);
    
    const startAngle = currentAngle;
    const isLast = index === displayGenres.length - 1;
    const endAngle = isLast ? 270 : currentAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const sliceAngle = isLast ? (270 - startAngle) : angle;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    svgContent += `
      <path class="genre-pie-slice" d="${pathD}" fill="${color}"
        data-genre="${genre}" data-percent="${percentage.toFixed(1)}" data-count="${count}"/>
    `;
    
    currentAngle = endAngle;
  });
  
  pieContainer.innerHTML = svgContent;
  
  // Legend
  let legendHtml = "";
  displayGenres.forEach(([genre], index) => {
    const color = getGenreColor(genre, index);
    legendHtml += `
      <div class="genre-legend-item">
        <span class="genre-legend-color" style="background: ${color}"></span>
        <span>${genre}</span>
      </div>
    `;
  });
  legendContainer.innerHTML = legendHtml;
  
  // Tooltip handlers
  const slices = pieContainer.querySelectorAll(".genre-pie-slice");
  slices.forEach(slice => {
    slice.addEventListener("mouseenter", () => {
      tooltip.innerHTML = `
        <span style="color: #00d9ff; font-weight: 600;">${slice.dataset.genre}</span>
        <span style="color: #ffd700; margin-left: 8px;">${slice.dataset.percent}%</span>
        <span style="display: block; color: #8892a6; font-size: 10px;">${slice.dataset.count} films</span>
      `;
      tooltip.classList.add("visible");
    });
    slice.addEventListener("mousemove", (e) => {
      const rect = pieContainer.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 10) + "px";
      tooltip.style.top = (e.clientY - rect.top - 40) + "px";
    });
    slice.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
}

// Initialize bio panels after main init
setTimeout(initVennBioPanels, 1000);

// ============================================
// 3D MOVIE POPUP
// ============================================

let popupOverlay, popupClose, flipCard, currentFlipSide = 1;
let popupPoster, popupTitle, popupYear, popupRating, popupRuntime, popupSynopsis, popupBoxOffice;
let trailerBtn, anchorBtn, trailerOverlay, trailerClose, trailerContainer;

function initPopup() {
  popupOverlay = document.getElementById("popupOverlay");
  popupClose = document.getElementById("popupClose");
  flipCard = document.getElementById("flipCard");
  popupPoster = document.getElementById("popupPoster");
  popupTitle = document.getElementById("popupTitle");
  popupYear = document.getElementById("popupYear");
  popupRating = document.getElementById("popupRating");
  popupRuntime = document.getElementById("popupRuntime");
  popupSynopsis = document.getElementById("popupSynopsis");
  popupBoxOffice = document.getElementById("popupBoxOffice");
  trailerBtn = document.getElementById("trailerBtn");
  anchorBtn = document.getElementById("anchorBtn");
  trailerOverlay = document.getElementById("trailerOverlay");
  trailerClose = document.getElementById("trailerClose");
  trailerContainer = document.getElementById("trailerContainer");
  
  if (popupClose) {
    popupClose.addEventListener("click", closePopup);
  }
  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) closePopup();
    });
  }
  if (flipCard) {
    flipCard.addEventListener("click", flipNext);
  }
  if (trailerBtn) {
    trailerBtn.addEventListener("click", playTrailer);
  }
  if (anchorBtn) {
    anchorBtn.addEventListener("click", setAsAnchor);
  }
  if (trailerClose) {
    trailerClose.addEventListener("click", closeTrailer);
  }
}

async function openMoviePopup(movieId) {
  if (!popupOverlay) initPopup();
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
    const movie = await res.json();
    
    popupPoster.src = movie.poster_path ? `${TMDB_IMG}w500${movie.poster_path}` : "";
    popupTitle.textContent = movie.title;
    popupYear.textContent = movie.release_date ? movie.release_date.split("-")[0] : "";
    popupRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    popupRuntime.textContent = movie.runtime ? `${movie.runtime} min` : "";
    popupSynopsis.textContent = movie.overview || "No synopsis available.";
    
    if (popupBoxOffice && movie.revenue) {
      popupBoxOffice.textContent = `💰 $${(movie.revenue / 1000000).toFixed(0)}M`;
      popupBoxOffice.hidden = false;
    } else if (popupBoxOffice) {
      popupBoxOffice.hidden = true;
    }
    
    // Store for anchor
    currentInfoMovieId = movieId;
    
    // Reset flip
    currentFlipSide = 1;
    if (flipCard) {
      flipCard.style.transform = "rotateY(0deg)";
    }
    
    // Hide info panel
    hideInfo();
    
    popupOverlay.hidden = false;
    
  } catch (e) {
    console.error("Failed to load movie:", e);
  }
}

function closePopup() {
  if (popupOverlay) popupOverlay.hidden = true;
}

function flipNext() {
  currentFlipSide = currentFlipSide === 1 ? 2 : 1;
  const angle = (currentFlipSide - 1) * 180;
  if (flipCard) {
    flipCard.style.transform = `rotateY(-${angle}deg)`;
  }
}

async function playTrailer() {
  if (!currentInfoMovieId || !trailerOverlay || !trailerContainer) return;
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${currentInfoMovieId}/videos?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
    
    if (trailer) {
      trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" frameborder="0" allowfullscreen allow="autoplay"></iframe>`;
      trailerOverlay.hidden = false;
    } else {
      alert("No trailer available");
    }
  } catch (e) {
    console.error("Failed to load trailer:", e);
  }
}

function closeTrailer() {
  if (trailerContainer) trailerContainer.innerHTML = "";
  if (trailerOverlay) trailerOverlay.hidden = true;
}

function setAsAnchor() {
  if (!currentInfoMovieId) return;
  
  localStorage.setItem("anchorMovieId", currentInfoMovieId);
  closePopup();
  
  // Navigate to constellation
  window.location.href = "constellation.html";
}

// Init popup on load
setTimeout(initPopup, 500);