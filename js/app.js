/* =============================================
   ORBIT - CINEMATIC MOVIE DISCOVERY
   Complete Application Logic
============================================= */

const TMDB_API_KEY = "dd1b9aebd0769bc49a68b7853b6f4266";

// =============================================
// GENRE & KEYWORD MAPPINGS
// =============================================

const GENRE_MAP = {
  "Action": 28,
  "Adventure": 12,
  "Animation": 16,
  "Comedy": 35,
  "Crime": 80,
  "Documentary": 99,
  "Drama": 18,
  "Family": 10751,
  "Fantasy": 14,
  "History": 36,
  "Horror": 27,
  "Music": 10402,
  "Mystery": 9648,
  "Romance": 10749,
  "Science Fiction": 878,
  "Thriller": 53,
  "TV Movie": 10770,
  "War": 10752,
  "Western": 37
};

const GENRE_EMOJIS = {
  "Action": "💥",
  "Adventure": "🗺️",
  "Animation": "🎨",
  "Comedy": "😂",
  "Crime": "🔪",
  "Documentary": "📽️",
  "Drama": "🎭",
  "Family": "👨‍👩‍👧‍👦",
  "Fantasy": "🐉",
  "History": "📜",
  "Horror": "👻",
  "Music": "🎵",
  "Mystery": "🔍",
  "Romance": "💕",
  "Science Fiction": "🚀",
  "Thriller": "😱",
  "TV Movie": "📺",
  "War": "⚔️",
  "Western": "🤠"
};

const KEYWORD_MAP = {
  "Noir": 210024,
  "Gritty": 9715,
  "Dark": 207928,
  "Uplifting": 10683,
  "Quirky": 10683,
  "Whimsical": 10683,
  "Bleak": 207928,
  "Slow-burn": 14537,
  "Fast-paced": 9715,
  "Intense": 9715,
  "Suspenseful": 818,
  "Emotional": 3205,
  "Feel-good": 10683,
  "Atmospheric": 9715,
  "Cerebral": 4344,
  "Twisted": 818,
  "Violent": 9663,
  "Gore": 12670,
  "Family-friendly": 6054,
  "Heartwarming": 10683,
  "Mind-bending": 818
};

// SETTING KEYWORDS - For movies SET IN a time period (not release date)
const SETTING_KEYWORD_MAP = {
  // Decades (when movie is SET, not released)
  decades: {
    1900: 291078,  // 1900s
    1910: 291079,  // 1910s
    1920: 12377,   // 1920s / roaring twenties
    1930: 291081,  // 1930s
    1940: 291082,  // 1940s
    1950: 9673,    // 1950s
    1960: 10916,   // 1960s
    1970: 11953,   // 1970s
    1980: 13065,   // 1980s
    1990: 168426,  // 1990s
    2000: 259648,  // 2000s
    2010: 287213,  // 2010s
    2020: 322276   // 2020s
  },
  // Centuries
  centuries: {
    2000: 315058,  // 21st century
    1900: 165710,  // 20th century
    1800: 207928,  // 19th century
    1700: 160279,  // 18th century
    1600: 261893,  // 17th century
    1500: 272153,  // 16th century
    0: 162861      // ancient (using ancient greece as proxy)
  },
  // Time periods / eras
  timePeriods: {
    "Ancient": [5049, 162861],      // ancient rome, ancient greece
    "Medieval": [161257],            // medieval
    "Renaissance": [272153],         // 16th century (renaissance era)
    "Victorian": [252596],           // victorian era
    "Modern Day": [315058],          // 21st century / contemporary
    "Near Future": [4565],           // dystopia (near future often dystopian)
    "Far Future": [4379],            // space travel / far future
    "Post-Apocalyptic": [4458]       // post-apocalyptic future
  }
};

const state = {
  filters: [],
  genreLogic: "or"
};

const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const searchDropdown = document.getElementById("searchDropdown");

// Move dropdown to body to fix positioning (backdrop-filter on parent breaks position:fixed)
document.body.appendChild(searchDropdown);

const focusOverlay = document.getElementById("focusOverlay");
const focusTitle = document.getElementById("focusTitle");
const focusContent = document.getElementById("focusContent");
const focusCloseButton = document.getElementById("focusCloseButton");
const addToSearchButton = document.getElementById("addToSearchButton");
const orbitPanel = document.getElementById("orbitPanel");
const orbitPanelToggle = document.getElementById("orbitPanelToggle");
const orbitFiltersEmpty = document.getElementById("orbitFiltersEmpty");
const orbitFilters = document.getElementById("orbitFilters");
const orbitPanelActions = document.getElementById("orbitPanelActions");
const launchCard = document.getElementById("launchCard");
const clearAllButton = document.getElementById("clearAllButton");

let searchDebounceTimer;

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounceTimer);
  const query = searchInput.value.trim();
  const type = searchType.value;
  
  if (query.length > 2) {
    searchDebounceTimer = setTimeout(() => fetchSearchResults(query, type), 300);
  } else {
    hideSearchDropdown();
  }
});

async function fetchSearchResults(query, type) {
  let endpoint = "";
  
  switch(type) {
    case "movie":
      endpoint = `/search/movie`;
      break;
    case "person":
      endpoint = `/search/person`;
      break;
    case "company":
      endpoint = `/search/company`;
      break;
  }
  
  const url = `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    renderSearchDropdown(data.results.slice(0, 6), type);
  } catch (err) {
    console.error("Search error:", err);
  }
}

function renderSearchDropdown(results, type) {
  if (results.length === 0) {
    hideSearchDropdown();
    return;
  }
  
  // Get search input position and size with extra precision
  const rect = searchInput.getBoundingClientRect();
  const containerRect = searchInput.parentElement.getBoundingClientRect();
  
  // Position dropdown directly below search input with no gap
  searchDropdown.style.display = 'block';
  searchDropdown.style.position = 'fixed';
  searchDropdown.style.top = `${rect.bottom}px`; // No gap - seamless connection
  searchDropdown.style.left = `${rect.left}px`;
  searchDropdown.style.width = `${rect.width}px`;
  searchDropdown.style.zIndex = '10000';
  
  // Add class to input for seamless visual connection
  searchInput.classList.add('dropdown-open');
  
  // Remove top border for seamless connection
  searchDropdown.style.borderTop = 'none';
  searchDropdown.style.borderTopLeftRadius = '0';
  searchDropdown.style.borderTopRightRadius = '0';
  
  searchDropdown.innerHTML = results.map(item => {
    let icon, title, meta, image;
    
    switch(type) {
      case "movie":
        icon = "🎬";
        title = item.title;
        meta = item.release_date ? item.release_date.split('-')[0] : 'N/A';
        image = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://placehold.co/45x68?text=No+Image';
        break;
      case "person":
        icon = "🎭";
        title = item.name;
        meta = item.known_for_department || 'Unknown';
        image = item.profile_path ? `https://image.tmdb.org/t/p/w92${item.profile_path}` : 'https://placehold.co/45x68?text=No+Image';
        break;
      case "company":
        icon = "🏛️";
        title = item.name;
        meta = item.origin_country || '';
        image = item.logo_path ? `https://image.tmdb.org/t/p/w92${item.logo_path}` : 'https://placehold.co/45x68?text=No+Logo';
        break;
    }
    
    return `
      <div class="dropdown-item" data-id="${item.id}" data-type="${type}">
        <img src="${image}" alt="${title}" onerror="this.src='https://placehold.co/45x68?text=?'">
        <div class="dropdown-info">
          <div class="movie-title">${icon} ${title}</div>
          <div class="movie-meta">${meta}</div>
        </div>
      </div>
    `;
  }).join('');
  
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => handleSearchItemClick(item));
  });
}

async function handleSearchItemClick(item) {
  const id = item.dataset.id;
  const type = item.dataset.type;
  
  // Show hyperspace transition
  const hyperspace = document.getElementById('hyperspaceOverlay');
  hyperspace.hidden = false;
  
  // Clear previous multi-person state - this is a fresh search
  localStorage.removeItem("vennPeople");
  
  // For movies, check if it has a collection
  if (type === "movie") {
    try {
      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
      const movie = await movieRes.json();
      
      if (movie.belongs_to_collection) {
        // Has collection - go to Timeline to show all films in collection
        localStorage.setItem("timelineMovieId", id);
        localStorage.setItem("timelineType", "movie");
        setTimeout(() => {
          window.location.href = 'games/timeline.html';
        }, 600);
      } else {
        // No collection - go to Results page with this single movie prominently displayed
        localStorage.setItem("singleMovie", JSON.stringify(movie));
        localStorage.setItem("resultsMode", "single");
        setTimeout(() => {
          window.location.href = 'games/results.html';
        }, 600);
      }
    } catch (err) {
      console.error("Movie check error:", err);
      // Fallback to timeline
      localStorage.setItem("timelineMovieId", id);
      localStorage.setItem("timelineType", "movie");
      setTimeout(() => {
        window.location.href = 'games/timeline.html';
      }, 600);
    }
  } else {
    // Person or company - go to Timeline
    localStorage.setItem("timelineMovieId", id);
    localStorage.setItem("timelineType", type);
    
    setTimeout(() => {
      window.location.href = 'games/timeline.html';
    }, 800);
  }
}

function hideSearchDropdown() {
  searchDropdown.style.display = 'none';
  searchDropdown.innerHTML = '';
  searchInput.classList.remove('dropdown-open');
}

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target) && !searchType.contains(e.target)) {
    hideSearchDropdown();
  }
});

// Reposition dropdown on scroll/resize to keep it attached
window.addEventListener('scroll', () => {
  if (searchDropdown.style.display === 'block') {
    const rect = searchInput.getBoundingClientRect();
    searchDropdown.style.top = `${rect.bottom}px`;
    searchDropdown.style.left = `${rect.left}px`;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (searchDropdown.style.display === 'block') {
    const rect = searchInput.getBoundingClientRect();
    searchDropdown.style.top = `${rect.bottom}px`;
    searchDropdown.style.left = `${rect.left}px`;
    searchDropdown.style.width = `${rect.width}px`;
  }
});

const sectionDefinitions = {
  people: { title: "People", builder: buildPeopleContent },
  genres: { title: "Genres", builder: buildGenresContent },
  setting: { title: "Setting", builder: buildSettingContent },
  dateRuntime: { title: "Date & Runtime", builder: buildDateRuntimeContent },
  ratings: { title: "Ratings", builder: buildRatingsContent },
  regionLanguage: { title: "Region & Language", builder: buildRegionLanguageContent },
  production: { title: "Production & Box Office", builder: buildProductionContent },
  watch: { title: "Watch Providers", builder: buildWatchContent },
  suitability: { title: "Suitability", builder: buildSuitabilityContent }
};

let currentSectionKey = null;

document.querySelectorAll(".section-card:not(.launch-card)").forEach((card) => {
  card.addEventListener("click", () => openFocusCard(card.dataset.section));
});

function openFocusCard(sectionKey) {
  currentSectionKey = sectionKey;
  const def = sectionDefinitions[sectionKey];
  if (!def) return;
  
  focusContent.innerHTML = "";
  focusTitle.textContent = def.title;
  def.builder(focusContent);
  
  focusOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeFocusCard() {
  focusOverlay.hidden = true;
  document.body.style.overflow = '';
}

focusCloseButton.addEventListener("click", closeFocusCard);

addToSearchButton.addEventListener("click", () => {
  if (!currentSectionKey) return;
  const labels = collectLabelsForSection(currentSectionKey);
  
  state.filters = state.filters.filter((f) => f.section !== currentSectionKey);
  labels.forEach((item) => {
    state.filters.push({
      id: `${currentSectionKey}-${item.label}`,
      section: currentSectionKey,
      label: item.label,
      value: item.value
    });
  });
  
  updateUIFromState();
  closeFocusCard();
});

function updateUIFromState() {
  const hasFilters = state.filters.length > 0;
  launchCard.disabled = !hasFilters;
  
  if (!hasFilters) {
    orbitFiltersEmpty.hidden = false;
    orbitFilters.hidden = true;
    orbitPanelActions.hidden = true;
  } else {
    orbitFiltersEmpty.hidden = true;
    orbitFilters.hidden = false;
    orbitPanelActions.hidden = false;
    renderFilterChips();
  }
  
  const sectionsWithFilters = new Set(state.filters.map((f) => f.section));
  document.querySelectorAll(".section-card:not(.launch-card)").forEach((card) => {
    if (sectionsWithFilters.has(card.dataset.section)) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

function renderFilterChips() {
  orbitFilters.innerHTML = "";
  const container = document.createElement("div");
  container.className = "filter-chips";
  
  state.filters.forEach((filter) => {
    const chip = document.createElement("div");
    chip.className = "filter-chip";
    chip.innerHTML = `
      <div class="filter-chip-main">
        <div class="filter-chip-section">${sectionDefinitions[filter.section]?.title || filter.section}</div>
        <div class="filter-chip-label">${filter.label}</div>
      </div>
    `;
    const remove = document.createElement("button");
    remove.className = "filter-chip-remove";
    remove.textContent = "✕";
    remove.onclick = () => {
      state.filters = state.filters.filter(f => f.id !== filter.id);
      updateUIFromState();
    };
    chip.appendChild(remove);
    container.appendChild(chip);
  });
  orbitFilters.appendChild(container);
}

orbitPanelToggle.onclick = () => orbitPanel.classList.toggle("collapsed");
clearAllButton.onclick = () => {
  state.filters = [];
  updateUIFromState();
};

launchCard.addEventListener("click", async () => {
  if (launchCard.disabled) return;
  
  try {
    const queryParams = buildTMDBQueryFromFilters(state.filters);
    
    // Check if language filter is set - the filter extraction now handles the English Only toggle
    const hasLanguageFilter = state.filters.some(f => f.section === "regionLanguage" && f.value?.type === "language");
    // If no language filter is present, it means English Only is OFF and no language selected - search all languages
    const languageParam = hasLanguageFilter ? '' : '';
    
    // Quick preview check - see if results will be capped
    const previewUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}${languageParam}&page=1`;
    const previewResponse = await fetch(previewUrl);
    const previewData = await previewResponse.json();
    
    const MAX_PAGES = 25; // 500 movies cap
    const totalAvailable = previewData.total_pages || 0;
    const totalMovies = previewData.total_results || 0;
    
    console.log(`Preview: ${totalMovies} movies across ${totalAvailable} pages`);
    
    // Warn if results will be capped (more than 500)
    if (totalAvailable > MAX_PAGES) {
      const proceed = confirm(
        `Your search found ~${totalMovies.toLocaleString()} movies!\n\n` +
        `We'll show the top 500 results.\n\n` +
        `💡 Tip: Add more filters (genre, year, person) for more refined results.\n\n` +
        `Continue anyway?`
      );
      if (!proceed) return;
    }
    
    // Show hyperspace
    const hyperspace = document.getElementById('hyperspaceOverlay');
    hyperspace.hidden = false;
    
    // Fetch pages with a reasonable cap (500 movies max)
    const allMovies = [];
    let currentPage = 1;
    
    console.log("Fetching results...");
    
    // Use preview data for first page
    if (previewData.results && previewData.results.length > 0) {
      allMovies.push(...previewData.results);
      const pagesToFetch = Math.min(totalAvailable, MAX_PAGES);
      console.log(`Page 1: ${previewData.results.length} movies (fetching ${pagesToFetch} of ${totalAvailable} pages)`);
      
      // Fetch remaining pages up to cap
      for (currentPage = 2; currentPage <= pagesToFetch; currentPage++) {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}${languageParam}&page=${currentPage}`;
        const response = await fetch(url);
        
        if (!response.ok) break;
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          allMovies.push(...data.results);
          console.log(`Page ${currentPage}: ${data.results.length} movies (total: ${allMovies.length})`);
        } else {
          break;
        }
      }
    }
    
    console.log(`Total movies fetched: ${allMovies.length}`);
    
    // Show note in results if capped
    const wasCapped = totalAvailable > MAX_PAGES;
    if (wasCapped) {
      localStorage.setItem("resultsCapped", "true");
      localStorage.setItem("totalAvailable", totalMovies.toString());
    } else {
      localStorage.removeItem("resultsCapped");
      localStorage.removeItem("totalAvailable");
    }
    
    if (allMovies.length === 0) {
      hyperspace.hidden = true;
      alert("No movies found matching your criteria.");
      return;
    }
    
    const selectedGenres = getSelectedGenres(state.filters);
    const genresToUse = selectedGenres.length >= 2 
      ? selectedGenres.slice(0, 3)
      : getTopGenresFromMovies(allMovies);
    
    localStorage.setItem("movies", JSON.stringify(allMovies));
    localStorage.setItem("genres", JSON.stringify(genresToUse));
    localStorage.setItem("orbitFilters", JSON.stringify(state.filters));
    // Save base query (strip watch provider params so results page can re-add them)
    const baseParams = new URLSearchParams(queryParams);
    baseParams.delete("with_watch_providers");
    baseParams.delete("watch_region");
    localStorage.setItem("orbitBaseQuery", baseParams.toString());
    
    // Navigate to results page
    setTimeout(() => {
      window.location.href = "games/results.html";
    }, 500);
  } catch (err) {
    const hyperspace = document.getElementById('hyperspaceOverlay');
    hyperspace.hidden = true;
    console.error("Launch error:", err);
    alert("Failed to launch orbit. Please try again.");
  }
});

function buildTMDBQueryFromFilters(filters) {
  const params = new URLSearchParams();
  
  params.append("sort_by", "popularity.desc");
  params.append("include_adult", "false");
  params.append("include_video", "false");
  
  filters.forEach(filter => {
    if (!filter.value) return;
    
    switch(filter.section) {
      case "people":
        if (filter.value.type === "person" && filter.value.id) {
          const paramName = filter.value.role === "cast" ? "with_cast" :
                           filter.value.role === "crew" ? "with_crew" :
                           "with_people";
          const existing = params.get(paramName);
          params.set(paramName, existing ? `${existing},${filter.value.id}` : filter.value.id);
        }
        break;
        
      case "genres":
        if (filter.value.type === "genre") {
          const genreId = GENRE_MAP[filter.value.name];
          if (genreId) {
            const existing = params.get("with_genres");
            params.set("with_genres", existing ? `${existing},${genreId}` : genreId);
          }
        } else if (filter.value.type === "keyword") {
          const keywordId = KEYWORD_MAP[filter.value.name];
          if (keywordId) {
            const existing = params.get("with_keywords");
            params.set("with_keywords", existing ? `${existing},${keywordId}` : keywordId);
          }
        }
        break;
        
      case "setting":
        // Use keywords for setting (when movie is SET, not released)
        if (filter.value.type === "decade") {
          const keywordId = SETTING_KEYWORD_MAP.decades[filter.value.decade];
          if (keywordId) {
            const existing = params.get("with_keywords");
            params.set("with_keywords", existing ? `${existing}|${keywordId}` : keywordId);
          }
        } else if (filter.value.type === "century") {
          const keywordId = SETTING_KEYWORD_MAP.centuries[filter.value.century];
          if (keywordId) {
            const existing = params.get("with_keywords");
            params.set("with_keywords", existing ? `${existing}|${keywordId}` : keywordId);
          }
        } else if (filter.value.type === "timePeriod") {
          const keywordIds = SETTING_KEYWORD_MAP.timePeriods[filter.value.name];
          if (keywordIds && keywordIds.length > 0) {
            const existing = params.get("with_keywords");
            // Join multiple keywords with | (OR) for broader results
            const keywordsStr = keywordIds.join("|");
            params.set("with_keywords", existing ? `${existing}|${keywordsStr}` : keywordsStr);
          }
        }
        break;
        
      case "dateRuntime":
        if (filter.value.type === "year") {
          params.set("primary_release_year", filter.value.year);
        } else if (filter.value.type === "decade") {
          const start = filter.value.decade;
          const end = start + 9;
          params.set("primary_release_date.gte", `${start}-01-01`);
          params.set("primary_release_date.lte", `${end}-12-31`);
        } else if (filter.value.type === "runtime") {
          if (filter.value.min) params.set("with_runtime.gte", filter.value.min);
          if (filter.value.max) params.set("with_runtime.lte", filter.value.max);
        }
        break;
        
      case "ratings":
        if (filter.value.type === "rating") {
          if (filter.value.min !== undefined) params.set("vote_average.gte", filter.value.min);
          if (filter.value.max !== undefined) params.set("vote_average.lte", filter.value.max);
        } else if (filter.value.type === "votes") {
          params.set("vote_count.gte", filter.value.min);
        }
        break;
        
      case "regionLanguage":
        if (filter.value.type === "region") {
          params.set("with_origin_country", filter.value.code);
        } else if (filter.value.type === "language") {
          params.set("with_original_language", filter.value.code);
        }
        break;
        
      case "production":
        if (filter.value.type === "company" && filter.value.id) {
          const existing = params.get("with_companies");
          params.set("with_companies", existing ? `${existing},${filter.value.id}` : filter.value.id);
        } else if (filter.value.type === "boxoffice") {
          if (filter.value.min) params.set("revenue.gte", filter.value.min);
          if (filter.value.max) params.set("revenue.lte", filter.value.max);
        }
        break;
        
      case "watch":
        if (filter.value.type === "provider" && filter.value.id) {
          const existing = params.get("with_watch_providers");
          params.set("with_watch_providers", existing ? `${existing},${filter.value.id}` : filter.value.id);
          if (filter.value.region) params.set("watch_region", filter.value.region);
        }
        break;
        
      case "suitability":
        if (filter.value.type === "certification") {
          params.set("certification", filter.value.rating);
          params.set("certification_country", "US");
        }
        break;
    }
  });

  // Inject saved watch providers from Region settings (if not already set by a filter)
  if (!params.has("with_watch_providers")) {
    try {
      const savedProviders = JSON.parse(localStorage.getItem("watchProviders") || "[]");
      const savedCountry = localStorage.getItem("watchCountry");
      if (savedProviders.length > 0 && savedCountry) {
        const providerIds = savedProviders.map(p => p.id).join("|");
        params.set("with_watch_providers", providerIds);
        params.set("watch_region", savedCountry);
        console.log("[Orbit] Applying saved watch providers:", providerIds, "region:", savedCountry);
      }
    } catch (e) {
      console.error("[Orbit] Failed to read saved watch providers:", e);
    }
  }

  return params.toString();
}

function getSelectedGenres(filters) {
  return filters
    .filter(f => f.section === "genres" && f.value.type === "genre")
    .map(f => GENRE_MAP[f.value.name])
    .filter(id => id !== undefined);
}

function getTopGenresFromMovies(movies) {
  const genreCounts = {};
  movies.forEach(movie => {
    movie.genre_ids?.forEach(id => {
      genreCounts[id] = (genreCounts[id] || 0) + 1;
    });
  });
  
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => parseInt(id));
}

// =============================================
// SECTION BUILDERS
// =============================================

function makeSectionLabel(text) {
  const label = document.createElement("div");
  label.className = "focus-section-label";
  label.textContent = text;
  return label;
}

function makeChip(label, section, value) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = label;
  chip.dataset.value = JSON.stringify(value);
  chip.addEventListener("click", () => {
    chip.classList.toggle("active");
  });
  return chip;
}

// =============================================
// 1. PEOPLE SECTION
// =============================================

function buildPeopleContent(root) {
  root.appendChild(makeSectionLabel("People search"));
  const desc = document.createElement("p");
  desc.style.fontSize = "13px";
  desc.style.color = "var(--muted-silver)";
  desc.style.marginBottom = "12px";
  desc.textContent = "Search for actors, directors, or other people. Select from the dropdown.";
  root.appendChild(desc);
  
  const roleFilter = document.createElement("div");
  roleFilter.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  `;
  
  const roles = [
    { value: "any", label: "Any Role" },
    { value: "cast", label: "Actor" },
    { value: "crew", label: "Behind Camera" }
  ];
  
  let selectedRole = "any";
  
  roles.forEach(role => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-filter-btn";
    btn.dataset.role = role.value;
    btn.textContent = role.label;
    btn.style.cssText = `
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid rgba(0, 217, 255, 0.2);
      background: ${role.value === "any" ? "var(--accent-cyan)" : "rgba(20, 30, 60, 0.5)"};
      color: ${role.value === "any" ? "#000" : "var(--film-white)"};
    `;
    
    btn.addEventListener("click", () => {
      selectedRole = role.value;
      roleFilter.querySelectorAll(".role-filter-btn").forEach(b => {
        if (b.dataset.role === selectedRole) {
          b.style.background = "var(--accent-cyan)";
          b.style.color = "#000";
        } else {
          b.style.background = "rgba(20, 30, 60, 0.5)";
          b.style.color = "var(--film-white)";
        }
      });
    });
    
    roleFilter.appendChild(btn);
  });
  
  root.appendChild(roleFilter);
  
  const container = document.createElement("div");
  container.style.position = "relative";
  
  const row = document.createElement("div");
  row.className = "input-row";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "peopleInput";
  input.placeholder = "Type a name (actor, director…)";
  input.autocomplete = "off";
  row.appendChild(input);
  container.appendChild(row);
  
  root.appendChild(container);
  
  let dropdown = document.getElementById("peopleDropdownGlobal");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "peopleDropdownGlobal";
    dropdown.className = "people-dropdown-global";
    dropdown.style.cssText = `
      display: none;
      position: fixed;
      max-height: 400px;
      width: 500px;
      overflow-y: auto;
      background: rgba(10, 14, 26, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
      z-index: 10000;
    `;
    document.body.appendChild(dropdown);
  }
  
  let peopleDebounceTimer;
  let selectedPeople = [];
  
  input.addEventListener('input', () => {
    clearTimeout(peopleDebounceTimer);
    const query = input.value.trim();
    
    if (query.length > 1) {
      peopleDebounceTimer = setTimeout(() => {
        const rect = input.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 4}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${Math.max(rect.width, 500)}px`;
        
        fetchPeopleSuggestions(query, dropdown, selectedRole);
      }, 300);
    } else {
      dropdown.style.display = 'none';
    }
  });
  
  const selectedContainer = document.createElement("div");
  selectedContainer.id = "selectedPeopleContainer";
  selectedContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  `;
  root.appendChild(selectedContainer);
  
  async function fetchPeopleSuggestions(query, dropdown, role) {
    const url = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      renderPeopleDropdown(data.results.slice(0, 8), dropdown, input, selectedPeople, selectedContainer, role);
    } catch (err) {
      console.error("People search error:", err);
    }
  }
  
  function renderPeopleDropdown(people, dropdown, input, selectedPeople, selectedContainer, role) {
    if (people.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    
    dropdown.style.display = 'block';
    dropdown.innerHTML = people.map(person => `
      <div class="people-dropdown-item" data-id="${person.id}" data-name="${person.name}" data-role="${role}" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(120, 190, 255, 0.1);
        transition: background 0.15s ease;
      " onmouseover="this.style.background='rgba(111, 210, 255, 0.1)'" onmouseout="this.style.background='transparent'">
        <img 
          src="${person.profile_path ? 'https://image.tmdb.org/t/p/w45' + person.profile_path : 'https://placehold.co/45x68?text=?'}" 
          style="width: 35px; height: 52px; object-fit: cover; border-radius: 4px; flex-shrink: 0;"
          onerror="this.src='https://placehold.co/35x52?text=?'"
        />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 500; color: var(--film-white); margin-bottom: 2px;">${person.name}</div>
          <div style="font-size: 12px; color: var(--muted-silver);">${person.known_for_department || 'Unknown'}</div>
        </div>
      </div>
    `).join('');
    
    dropdown.querySelectorAll('.people-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const personId = item.dataset.id;
        const personName = item.dataset.name;
        const personRole = item.dataset.role;
        
        if (selectedPeople.some(p => p.id === personId && p.role === personRole)) {
          return;
        }
        
        selectedPeople.push({ id: personId, name: personName, role: personRole });
        
        let roleLabel = "";
        if (personRole === "cast") roleLabel = " (Actor)";
        else if (personRole === "crew") roleLabel = " (Behind Camera)";
        
        const chip = document.createElement("div");
        chip.className = "selected-person-chip";
        chip.dataset.personId = personId;
        chip.dataset.personName = personName;
        chip.dataset.personRole = personRole;
        chip.style.cssText = `
          background: rgba(111, 210, 255, 0.15);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 999px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--film-white);
        `;
        chip.innerHTML = `
          <span>${personName}${roleLabel}</span>
          <button style="
            background: transparent;
            border: none;
            color: var(--muted-silver);
            cursor: pointer;
            font-size: 14px;
            padding: 0 4px;
            transition: color 0.15s;
          " onmouseover="this.style.color='var(--danger-red)'" onmouseout="this.style.color='var(--muted-silver)'">✕</button>
        `;
        
        chip.querySelector('button').addEventListener('click', () => {
          selectedPeople = selectedPeople.filter(p => !(p.id === personId && p.role === personRole));
          chip.remove();
        });
        
        selectedContainer.appendChild(chip);
        input.value = '';
        dropdown.style.display = 'none';
      });
    });
    
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }, { once: true });
  }
  
  const closeButton = document.getElementById('focusCloseButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  }
}

// =============================================
// 2. GENRES SECTION
// =============================================

function buildGenresContent(root) {
  const toggleContainer = document.createElement("div");
  toggleContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px;
    background: rgba(15, 23, 41, 0.5);
    border-radius: 8px;
  `;
  
  const toggleLabel = document.createElement("span");
  toggleLabel.textContent = "Match:";
  toggleLabel.style.cssText = "font-size: 13px; font-weight: 600; color: var(--accent-cyan);";
  toggleContainer.appendChild(toggleLabel);
  
  const orBtn = document.createElement("button");
  orBtn.type = "button";
  orBtn.textContent = "Any (OR)";
  orBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.genreLogic === "or" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.genreLogic === "or" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;
  
  const andBtn = document.createElement("button");
  andBtn.type = "button";
  andBtn.textContent = "All (AND)";
  andBtn.style.cssText = `
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid rgba(0, 217, 255, 0.2);
    background: ${state.genreLogic === "and" ? "var(--accent-cyan)" : "transparent"};
    color: ${state.genreLogic === "and" ? "#000" : "var(--film-white)"};
    transition: all 0.2s;
  `;
  
  orBtn.addEventListener("click", () => {
    state.genreLogic = "or";
    orBtn.style.background = "var(--accent-cyan)";
    orBtn.style.color = "#000";
    andBtn.style.background = "transparent";
    andBtn.style.color = "var(--film-white)";
  });
  
  andBtn.addEventListener("click", () => {
    state.genreLogic = "and";
    andBtn.style.background = "var(--accent-cyan)";
    andBtn.style.color = "#000";
    orBtn.style.background = "transparent";
    orBtn.style.color = "var(--film-white)";
  });
  
  toggleContainer.appendChild(orBtn);
  toggleContainer.appendChild(andBtn);
  root.appendChild(toggleContainer);
  
  root.appendChild(makeSectionLabel("Genres"));
  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "History",
    "Horror", "Music", "Mystery", "Romance", "Science Fiction",
    "Thriller", "TV Movie", "War", "Western"
  ];
  
  const genreGroup = document.createElement("div");
  genreGroup.className = "chip-group";
  genres.forEach(g => {
    const emoji = GENRE_EMOJIS[g] || "🎬";
    const chip = makeChip(`${emoji} ${g}`, "genres", { type: "genre", name: g });
    chip.id = `genre-${g.replace(/\s+/g, '-')}`;
    genreGroup.appendChild(chip);
  });
  root.appendChild(genreGroup);
  
  root.appendChild(makeSectionLabel("Keywords & Mood"));
  
  const keywordCategories = [
    { label: "Tone", keywords: ["Noir", "Gritty", "Dark", "Uplifting", "Quirky", "Whimsical", "Bleak"] },
    { label: "Pace", keywords: ["Slow-burn", "Fast-paced", "Intense", "Suspenseful"] },
    { label: "Mood", keywords: ["Emotional", "Feel-good", "Atmospheric", "Cerebral", "Twisted"] },
    { label: "Content", keywords: ["Violent", "Gore", "Family-friendly", "Heartwarming", "Mind-bending"] }
  ];
  
  keywordCategories.forEach(cat => {
    const catLabel = document.createElement("div");
    catLabel.textContent = cat.label;
    catLabel.style.cssText = "font-size: 11px; color: var(--muted-silver); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 1px;";
    root.appendChild(catLabel);
    
    const keywordGroup = document.createElement("div");
    keywordGroup.className = "chip-group";
    cat.keywords.forEach(kw => {
      const chip = makeChip(kw, "genres", { type: "keyword", name: kw });
      chip.id = `keyword-${kw.replace(/\s+/g, '-')}`;
      keywordGroup.appendChild(chip);
    });
    root.appendChild(keywordGroup);
  });
}

// =============================================
// 3. SETTING SECTION
// =============================================

function buildSettingContent(root) {
  // Create groups for mutual exclusivity tracking
  const decadeGroup = document.createElement("div");
  decadeGroup.className = "chip-group";
  decadeGroup.dataset.settingGroup = "decade";
  
  const centuryGroup = document.createElement("div");
  centuryGroup.className = "chip-group";
  centuryGroup.dataset.settingGroup = "century";
  
  const periodGroup = document.createElement("div");
  periodGroup.className = "chip-group";
  periodGroup.dataset.settingGroup = "period";
  
  // Function to handle mutual exclusivity
  function handleSettingSelection(clickedGroup) {
    const allGroups = [decadeGroup, centuryGroup, periodGroup];
    allGroups.forEach(group => {
      if (group !== clickedGroup) {
        // Deselect all chips in other groups
        group.querySelectorAll('.chip.active').forEach(chip => {
          chip.classList.remove('active');
        });
        // Remove disabled state when selection is cleared
        group.classList.remove('setting-disabled');
      }
    });
    
    // Check if clicked group has any active selections
    const hasActiveInClicked = clickedGroup.querySelectorAll('.chip.active').length > 0;
    
    // Disable/enable other groups based on selection
    allGroups.forEach(group => {
      if (group !== clickedGroup) {
        if (hasActiveInClicked) {
          group.classList.add('setting-disabled');
        } else {
          group.classList.remove('setting-disabled');
        }
      }
    });
  }
  
  // DECADES (1900s - 2020s)
  root.appendChild(makeSectionLabel("Decades (when movie is set)"));
  const decades = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  decades.forEach(d => {
    const chip = makeChip(`${d}s`, "setting", { type: "decade", decade: d });
    chip.id = `setting-decade-${d}`;
    chip.addEventListener('click', () => {
      setTimeout(() => handleSettingSelection(decadeGroup), 10);
    });
    decadeGroup.appendChild(chip);
  });
  root.appendChild(decadeGroup);
  
  // CENTURIES (2000s, 1900s, 1800s, etc.)
  root.appendChild(makeSectionLabel("Centuries"));
  const centuries = [
    { label: "21st (2000s)", value: 2000 },
    { label: "20th (1900s)", value: 1900 },
    { label: "19th (1800s)", value: 1800 },
    { label: "18th (1700s)", value: 1700 },
    { label: "17th (1600s)", value: 1600 },
    { label: "16th (1500s)", value: 1500 },
    { label: "Earlier", value: 0 }
  ];
  centuries.forEach(c => {
    const chip = makeChip(c.label, "setting", { type: "century", century: c.value, label: c.label });
    chip.id = `setting-century-${c.value}`;
    chip.addEventListener('click', () => {
      setTimeout(() => handleSettingSelection(centuryGroup), 10);
    });
    centuryGroup.appendChild(chip);
  });
  root.appendChild(centuryGroup);
  
  // TIME PERIODS (story setting)
  root.appendChild(makeSectionLabel("Time Period (story setting)"));
  const periods = [
    "Ancient", "Medieval", "Renaissance", "Victorian",
    "Modern Day", "Near Future", "Far Future", "Post-Apocalyptic"
  ];
  periods.forEach(p => {
    const chip = makeChip(p, "setting", { type: "timePeriod", name: p, keywordId: 0 });
    chip.id = `period-${p.replace(/\s+/g, '-')}`;
    chip.addEventListener('click', () => {
      setTimeout(() => handleSettingSelection(periodGroup), 10);
    });
    periodGroup.appendChild(chip);
  });
  root.appendChild(periodGroup);
}

// =============================================
// 4. DATE & RUNTIME SECTION
// =============================================

function buildDateRuntimeContent(root) {
  root.appendChild(makeSectionLabel("Specific Year"));
  const yearRow = document.createElement("div");
  yearRow.className = "input-row";
  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.id = "yearInput";
  yearInput.placeholder = "e.g., 2020";
  yearInput.min = "1900";
  yearInput.max = "2030";
  yearRow.appendChild(yearInput);
  root.appendChild(yearRow);
  
  root.appendChild(makeSectionLabel("Decades (when movie was made)"));
  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const decadeGroup = document.createElement("div");
  decadeGroup.className = "chip-group";
  decades.forEach(d => {
    const chip = makeChip(`${d}s`, "dateRuntime", { type: "decade", decade: d });
    chip.id = `date-decade-${d}`;
    decadeGroup.appendChild(chip);
  });
  root.appendChild(decadeGroup);
  
  const quickGroup = document.createElement("div");
  quickGroup.className = "chip-group";
  quickGroup.style.marginTop = "12px";
  
  const newRelease = makeChip("New Releases (6 months)", "dateRuntime", { 
    type: "dateRange",
    start: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const classic = makeChip("Classic (Pre-1980)", "dateRuntime", {
    type: "dateRange",
    start: "1900-01-01",
    end: "1979-12-31"
  });
  quickGroup.appendChild(newRelease);
  quickGroup.appendChild(classic);
  root.appendChild(quickGroup);
  
  root.appendChild(makeSectionLabel("Runtime (minutes)"));
  
  const runtimeRow = document.createElement("div");
  runtimeRow.className = "input-row";
  runtimeRow.style.flexDirection = "column";
  runtimeRow.style.gap = "12px";
  
  const minRow = document.createElement("div");
  minRow.style.display = "flex";
  minRow.style.gap = "12px";
  minRow.style.width = "100%";
  minRow.style.alignItems = "center";
  
  const minLabel = document.createElement("span");
  minLabel.textContent = "Min:";
  minLabel.style.minWidth = "40px";
  const minSlider = document.createElement("input");
  minSlider.type = "range";
  minSlider.id = "runtimeMin";
  minSlider.min = "0";
  minSlider.max = "300";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "0";
  minValue.id = "runtimeMinValue";
  
  minSlider.addEventListener("input", () => {
    minValue.textContent = minSlider.value;
    const maxSlider = document.getElementById("runtimeMax");
    if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
      maxSlider.value = minSlider.value;
      document.getElementById("runtimeMaxValue").textContent = minSlider.value;
    }
  });
  
  minRow.appendChild(minLabel);
  minRow.appendChild(minSlider);
  minRow.appendChild(minValue);
  
  const maxRow = document.createElement("div");
  maxRow.style.display = "flex";
  maxRow.style.gap = "12px";
  maxRow.style.width = "100%";
  maxRow.style.alignItems = "center";
  
  const maxLabel = document.createElement("span");
  maxLabel.textContent = "Max:";
  maxLabel.style.minWidth = "40px";
  const maxSlider = document.createElement("input");
  maxSlider.type = "range";
  maxSlider.id = "runtimeMax";
  maxSlider.min = "0";
  maxSlider.max = "300";
  maxSlider.value = "300";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "300";
  maxValue.id = "runtimeMaxValue";
  
  maxSlider.addEventListener("input", () => {
    maxValue.textContent = maxSlider.value;
    const minSlider = document.getElementById("runtimeMin");
    if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
      minSlider.value = maxSlider.value;
      document.getElementById("runtimeMinValue").textContent = maxSlider.value;
    }
  });
  
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);
  
  runtimeRow.appendChild(minRow);
  runtimeRow.appendChild(maxRow);
  root.appendChild(runtimeRow);
  
  const runtimeQuick = document.createElement("div");
  runtimeQuick.className = "chip-group";
  runtimeQuick.style.marginTop = "12px";
  [
    { label: "Short Films (<60min)", min: 0, max: 59 },
    { label: "Standard (90-120min)", min: 90, max: 120 },
    { label: "Long (2h+)", min: 120, max: 300 },
    { label: "Epic (3h+)", min: 180, max: 300 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "dateRuntime", {
      type: "runtime",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("runtimeMin").value = preset.min;
      document.getElementById("runtimeMax").value = preset.max;
      document.getElementById("runtimeMinValue").textContent = preset.min;
      document.getElementById("runtimeMaxValue").textContent = preset.max;
    });
    runtimeQuick.appendChild(chip);
  });
  root.appendChild(runtimeQuick);
}

// =============================================
// 5. RATINGS SECTION
// =============================================

function buildRatingsContent(root) {
  root.appendChild(makeSectionLabel("Quality Score Range (0-10)"));
  
  const ratingRow = document.createElement("div");
  ratingRow.className = "input-row";
  ratingRow.style.flexDirection = "column";
  ratingRow.style.gap = "12px";
  
  const minRow = document.createElement("div");
  minRow.style.display = "flex";
  minRow.style.gap = "12px";
  minRow.style.width = "100%";
  minRow.style.alignItems = "center";
  
  const minLabel = document.createElement("span");
  minLabel.textContent = "Min:";
  minLabel.style.minWidth = "40px";
  const minSlider = document.createElement("input");
  minSlider.type = "range";
  minSlider.id = "ratingMin";
  minSlider.min = "0";
  minSlider.max = "10";
  minSlider.step = "0.1";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "0.0";
  minValue.id = "ratingMinValue";
  
  minSlider.addEventListener("input", () => {
    minValue.textContent = parseFloat(minSlider.value).toFixed(1);
    const maxSlider = document.getElementById("ratingMax");
    if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) {
      maxSlider.value = minSlider.value;
      document.getElementById("ratingMaxValue").textContent = parseFloat(minSlider.value).toFixed(1);
    }
  });
  
  minRow.appendChild(minLabel);
  minRow.appendChild(minSlider);
  minRow.appendChild(minValue);
  
  const maxRow = document.createElement("div");
  maxRow.style.display = "flex";
  maxRow.style.gap = "12px";
  maxRow.style.width = "100%";
  maxRow.style.alignItems = "center";
  
  const maxLabel = document.createElement("span");
  maxLabel.textContent = "Max:";
  maxLabel.style.minWidth = "40px";
  const maxSlider = document.createElement("input");
  maxSlider.type = "range";
  maxSlider.id = "ratingMax";
  maxSlider.min = "0";
  maxSlider.max = "10";
  maxSlider.step = "0.1";
  maxSlider.value = "10";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "10.0";
  maxValue.id = "ratingMaxValue";
  
  maxSlider.addEventListener("input", () => {
    maxValue.textContent = parseFloat(maxSlider.value).toFixed(1);
    const minSlider = document.getElementById("ratingMin");
    if (parseFloat(maxSlider.value) < parseFloat(minSlider.value)) {
      minSlider.value = maxSlider.value;
      document.getElementById("ratingMinValue").textContent = parseFloat(maxSlider.value).toFixed(1);
    }
  });
  
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);
  
  ratingRow.appendChild(minRow);
  ratingRow.appendChild(maxRow);
  root.appendChild(ratingRow);
  
  const ratingQuick = document.createElement("div");
  ratingQuick.className = "chip-group";
  ratingQuick.style.marginTop = "12px";
  [
    { label: "Certified Fresh (8.0+)", min: 8.0, max: 10.0 },
    { label: "Hidden Gems (6.5-7.5)", min: 6.5, max: 7.5 },
    { label: "Cult Classics (<6.0)", min: 0, max: 6.0 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "ratings", {
      type: "rating",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("ratingMin").value = preset.min;
      document.getElementById("ratingMax").value = preset.max;
      document.getElementById("ratingMinValue").textContent = preset.min.toFixed(1);
      document.getElementById("ratingMaxValue").textContent = preset.max.toFixed(1);
    });
    ratingQuick.appendChild(chip);
  });
  root.appendChild(ratingQuick);
  
  root.appendChild(makeSectionLabel("Minimum Votes (reliability)"));
  const voteGroup = document.createElement("div");
  voteGroup.className = "chip-group";
  [
    { label: "100+", votes: 100 },
    { label: "1,000+", votes: 1000 },
    { label: "5,000+", votes: 5000 },
    { label: "10,000+", votes: 10000 }
  ].forEach(v => {
    const chip = makeChip(v.label, "ratings", { type: "votes", min: v.votes });
    chip.id = `votes-${v.votes}`;
    voteGroup.appendChild(chip);
  });
  root.appendChild(voteGroup);
}

// =============================================
// 6. REGION & LANGUAGE SECTION
// =============================================

function buildRegionLanguageContent(root) {
  root.appendChild(makeSectionLabel("Production Region"));
  
  const regionRow = document.createElement("div");
  regionRow.className = "input-row";
  const regionInput = document.createElement("input");
  regionInput.type = "text";
  regionInput.id = "regionInput";
  regionInput.placeholder = "Search for country...";
  regionInput.autocomplete = "off";
  regionRow.appendChild(regionInput);
  root.appendChild(regionRow);
  
  const regionContainer = document.createElement("div");
  regionContainer.id = "selectedRegionContainer";
  regionContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  root.appendChild(regionContainer);
  
  const regions = [
    { code: "US", name: "🇺🇸 United States" },
    { code: "GB", name: "🇬🇧 United Kingdom" },
    { code: "FR", name: "🇫🇷 France" },
    { code: "DE", name: "🇩🇪 Germany" },
    { code: "JP", name: "🇯🇵 Japan" },
    { code: "KR", name: "🇰🇷 South Korea" },
    { code: "CN", name: "🇨🇳 China" },
    { code: "IN", name: "🇮🇳 India" },
    { code: "IT", name: "🇮🇹 Italy" },
    { code: "ES", name: "🇪🇸 Spain" },
    { code: "CA", name: "🇨🇦 Canada" },
    { code: "AU", name: "🇦🇺 Australia" }
  ];
  
  let selectedRegion = null;
  
  regionInput.addEventListener("input", () => {
    const query = regionInput.value.toLowerCase();
    const filtered = regions.filter(r => r.name.toLowerCase().includes(query) || r.code.toLowerCase().includes(query));
    
    if (filtered.length > 0 && query.length > 0) {
      renderRegionSuggestions(filtered.slice(0, 5));
    } else {
      hideRegionSuggestions();
    }
  });
  
  function renderRegionSuggestions(items) {
    hideRegionSuggestions();
    const dropdown = document.createElement("div");
    dropdown.id = "regionDropdown";
    dropdown.style.cssText = `
      position: absolute;
      background: rgba(10, 14, 26, 0.98);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
    `;
    
    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        selectedRegion = item;
        regionInput.value = "";
        hideRegionSuggestions();
        
        regionContainer.innerHTML = `
          <div data-region-code="${item.code}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${item.name}</span>
            <button id="removeRegion" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
          </div>
        `;
        
        document.getElementById("removeRegion").onclick = () => {
          selectedRegion = null;
          regionContainer.innerHTML = "";
        };
        
        // Smart language linking - auto-adjust based on country
        handleRegionLanguageLink(item.code);
      };
      dropdown.appendChild(opt);
    });
    
    regionRow.appendChild(dropdown);
  }
  
  // Country-to-language mapping
  const countryLanguageMap = {
    "US": "en", "GB": "en", "CA": "en", "AU": "en", "NZ": "en", "IE": "en", // English-speaking
    "FR": "fr", "BE": "fr", // French
    "DE": "de", "AT": "de", // German
    "ES": "es", "MX": "es", "AR": "es", // Spanish
    "IT": "it", // Italian
    "JP": "ja", // Japanese
    "KR": "ko", // Korean
    "CN": "zh", "TW": "zh", "HK": "zh", // Chinese
    "IN": "hi", // Hindi (India has many, but Hindi is primary)
    "RU": "ru", // Russian
    "BR": "pt", "PT": "pt", // Portuguese
    "SE": "sv", // Swedish
    "DK": "da", // Danish
    "NO": "no", // Norwegian
    "FI": "fi", // Finnish
    "NL": "nl", // Dutch
    "PL": "pl", // Polish
    "TR": "tr", // Turkish
    "TH": "th", // Thai
    "ID": "id", // Indonesian
    "VN": "vi"  // Vietnamese
  };
  
  const languageNames = {
    "en": "English", "fr": "French", "de": "German", "es": "Spanish",
    "it": "Italian", "ja": "Japanese", "ko": "Korean", "zh": "Chinese",
    "hi": "Hindi", "ru": "Russian", "pt": "Portuguese", "ar": "Arabic",
    "sv": "Swedish", "da": "Danish", "no": "Norwegian", "fi": "Finnish",
    "nl": "Dutch", "pl": "Polish", "tr": "Turkish", "th": "Thai",
    "id": "Indonesian", "vi": "Vietnamese"
  };
  
  function handleRegionLanguageLink(countryCode) {
    const langCode = countryLanguageMap[countryCode];
    if (!langCode) return;
    
    const englishToggle = document.getElementById("englishOnlyToggle");
    const langSearchSection = document.getElementById("langSearchSection");
    const langContainer = document.getElementById("selectedLanguageContainer");
    const toggleKnob = document.getElementById("toggleKnob");
    const toggleBg = englishToggle?.parentElement?.querySelector('span');
    
    if (langCode === "en") {
      // English-speaking country - ensure English Only is ON
      if (englishToggle && !englishToggle.checked) {
        englishToggle.checked = true;
        sessionStorage.setItem('englishOnlyToggle', 'true');
        if (toggleBg) toggleBg.style.background = 'var(--accent-cyan)';
        if (toggleKnob) {
          toggleKnob.style.transform = 'translateX(24px)';
          toggleKnob.style.background = 'white';
        }
        if (langSearchSection) langSearchSection.style.display = 'none';
        if (langContainer) langContainer.innerHTML = '';
      }
    } else {
      // Non-English country - turn OFF English Only and set the language
      if (englishToggle) {
        englishToggle.checked = false;
        sessionStorage.setItem('englishOnlyToggle', 'false');
        if (toggleBg) toggleBg.style.background = 'rgba(255,255,255,0.1)';
        if (toggleKnob) {
          toggleKnob.style.transform = 'translateX(0)';
          toggleKnob.style.background = 'var(--muted-silver)';
        }
        if (langSearchSection) langSearchSection.style.display = 'block';
      }
      
      // Auto-select the language
      const langName = languageNames[langCode] || langCode;
      if (langContainer) {
        langContainer.innerHTML = `
          <div data-lang-code="${langCode}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${langName}</span>
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
          </div>
        `;
        
        document.getElementById("removeLanguage").onclick = () => {
          langContainer.innerHTML = "";
        };
      }
    }
  }
  
  function hideRegionSuggestions() {
    const existing = document.getElementById("regionDropdown");
    if (existing) existing.remove();
  }
  
  root.appendChild(makeSectionLabel("Original Language"));
  
  // English Only Toggle
  const englishToggleRow = document.createElement("div");
  englishToggleRow.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: 10px;
    margin-bottom: 12px;
  `;
  
  const toggleLabel = document.createElement("div");
  toggleLabel.innerHTML = `
    <span style="font-weight: 600; color: var(--film-white);">English Only</span>
    <span style="font-size: 11px; color: var(--muted-silver); display: block; margin-top: 2px;">Hollywood, UK, Australian & Canadian cinema</span>
  `;
  
  const toggleSwitch = document.createElement("label");
  toggleSwitch.style.cssText = `
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    cursor: pointer;
  `;
  toggleSwitch.innerHTML = `
    <input type="checkbox" id="englishOnlyToggle" style="opacity: 0; width: 0; height: 0;">
    <span style="
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.1);
      border-radius: 26px;
      transition: 0.3s;
    "></span>
    <span style="
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: var(--muted-silver);
      border-radius: 50%;
      transition: 0.3s;
    " id="toggleKnob"></span>
  `;
  
  englishToggleRow.appendChild(toggleLabel);
  englishToggleRow.appendChild(toggleSwitch);
  root.appendChild(englishToggleRow);
  
  // Language search row (hidden when English Only is ON)
  const langSearchSection = document.createElement("div");
  langSearchSection.id = "langSearchSection";
  
  const langRow = document.createElement("div");
  langRow.className = "input-row";
  const langInput = document.createElement("input");
  langInput.type = "text";
  langInput.id = "languageInput";
  langInput.placeholder = "Search for language (Korean, French, Hindi...)";
  langInput.autocomplete = "off";
  langRow.appendChild(langInput);
  langSearchSection.appendChild(langRow);
  
  const langContainer = document.createElement("div");
  langContainer.id = "selectedLanguageContainer";
  langContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;";
  langSearchSection.appendChild(langContainer);
  
  root.appendChild(langSearchSection);
  
  // Toggle functionality
  const englishToggle = toggleSwitch.querySelector('#englishOnlyToggle');
  const toggleKnob = toggleSwitch.querySelector('#toggleKnob');
  const toggleBg = toggleSwitch.querySelector('span');
  
  // Check sessionStorage for saved state (default to ON)
  const savedState = sessionStorage.getItem('englishOnlyToggle');
  const isEnglishOnly = savedState === null ? true : savedState === 'true';
  
  function updateToggleUI(isOn) {
    if (isOn) {
      toggleBg.style.background = 'var(--accent-cyan)';
      toggleKnob.style.transform = 'translateX(24px)';
      toggleKnob.style.background = 'white';
      langSearchSection.style.display = 'none';
    } else {
      toggleBg.style.background = 'rgba(255,255,255,0.1)';
      toggleKnob.style.transform = 'translateX(0)';
      toggleKnob.style.background = 'var(--muted-silver)';
      langSearchSection.style.display = 'block';
    }
  }
  
  englishToggle.checked = isEnglishOnly;
  updateToggleUI(isEnglishOnly);
  
  englishToggle.addEventListener('change', () => {
    const isOn = englishToggle.checked;
    sessionStorage.setItem('englishOnlyToggle', isOn.toString());
    updateToggleUI(isOn);
    
    // Clear any selected language when turning English Only ON
    if (isOn) {
      selectedLanguage = null;
      langContainer.innerHTML = '';
    }
  });
  
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
    { code: "sv", name: "Swedish" },
    { code: "da", name: "Danish" },
    { code: "no", name: "Norwegian" },
    { code: "fi", name: "Finnish" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" },
    { code: "th", name: "Thai" },
    { code: "id", name: "Indonesian" },
    { code: "vi", name: "Vietnamese" }
  ];
  
  let selectedLanguage = null;
  
  langInput.addEventListener("input", () => {
    const query = langInput.value.toLowerCase();
    const filtered = languages.filter(l => l.name.toLowerCase().includes(query) || l.code.toLowerCase().includes(query));
    
    if (filtered.length > 0 && query.length > 0) {
      renderLanguageSuggestions(filtered.slice(0, 5));
    } else {
      hideLanguageSuggestions();
    }
  });
  
  function renderLanguageSuggestions(items) {
    hideLanguageSuggestions();
    const dropdown = document.createElement("div");
    dropdown.id = "languageDropdown";
    dropdown.style.cssText = `
      position: absolute;
      background: rgba(10, 14, 26, 0.98);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
    `;
    
    items.forEach(item => {
      const opt = document.createElement("div");
      opt.style.cssText = "padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0, 217, 255, 0.1); transition: background 0.15s;";
      opt.textContent = item.name;
      opt.onmouseover = () => opt.style.background = "rgba(0, 217, 255, 0.1)";
      opt.onmouseout = () => opt.style.background = "transparent";
      opt.onclick = () => {
        selectedLanguage = item;
        langInput.value = "";
        hideLanguageSuggestions();
        
        langContainer.innerHTML = `
          <div data-lang-code="${item.code}" style="
            background: rgba(111, 210, 255, 0.15);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          ">
            <span>${item.name}</span>
            <button id="removeLanguage" style="background: transparent; border: none; color: var(--muted-silver); cursor: pointer; font-size: 14px; padding: 0 4px;">✕</button>
          </div>
        `;
        
        document.getElementById("removeLanguage").onclick = () => {
          selectedLanguage = null;
          langContainer.innerHTML = "";
        };
      };
      dropdown.appendChild(opt);
    });
    
    langRow.appendChild(dropdown);
  }
  
  function hideLanguageSuggestions() {
    const existing = document.getElementById("languageDropdown");
    if (existing) existing.remove();
  }
}

// =============================================
// 7. PRODUCTION & BOX OFFICE SECTION
// =============================================

function buildProductionContent(root) {
  root.appendChild(makeSectionLabel("Studios & Production Companies"));
  
  const desc = document.createElement("p");
  desc.style.fontSize = "13px";
  desc.style.color = "var(--muted-silver)";
  desc.style.marginBottom = "16px";
  desc.textContent = "Select from top studios or search for others.";
  root.appendChild(desc);
  
  const topStudios = [
    { name: "Disney", id: 2 },
    { name: "Warner Bros", id: 174 },
    { name: "Universal", id: 33 },
    { name: "Paramount", id: 4 },
    { name: "Sony", id: 5 },
    { name: "20th Century", id: 25 },
    { name: "A24", id: 41077 },
    { name: "Marvel Studios", id: 420 },
    { name: "Pixar", id: 3 },
    { name: "Lucasfilm", id: 1 }
  ];
  
  const studioGroup = document.createElement("div");
  studioGroup.className = "chip-group";
  topStudios.forEach(studio => {
    const chip = makeChip(`🏛️ ${studio.name}`, "production", { type: "company", id: studio.id, name: studio.name });
    chip.id = `studio-${studio.name.replace(/\s+/g, '-')}`;
    studioGroup.appendChild(chip);
  });
  root.appendChild(studioGroup);
  
  const studioRow = document.createElement("div");
  studioRow.className = "input-row";
  studioRow.style.marginTop = "16px";
  const studioInput = document.createElement("input");
  studioInput.type = "text";
  studioInput.id = "studioInput";
  studioInput.placeholder = "Search for other studios...";
  studioInput.autocomplete = "off";
  studioRow.appendChild(studioInput);
  root.appendChild(studioRow);
  
  const studioSearchNote = document.createElement("p");
  studioSearchNote.style.fontSize = "12px";
  studioSearchNote.style.color = "var(--muted-silver)";
  studioSearchNote.style.marginTop = "8px";
  studioSearchNote.style.fontStyle = "italic";
  studioSearchNote.textContent = "Note: Studio search autocomplete coming soon. Use preset chips for now.";
  root.appendChild(studioSearchNote);
  
  root.appendChild(makeSectionLabel("Box Office (Worldwide Gross)"));
  
  const boxOfficeRow = document.createElement("div");
  boxOfficeRow.className = "input-row";
  boxOfficeRow.style.flexDirection = "column";
  boxOfficeRow.style.gap = "12px";
  
  const minRow = document.createElement("div");
  minRow.style.display = "flex";
  minRow.style.gap = "12px";
  minRow.style.width = "100%";
  minRow.style.alignItems = "center";
  
  const minLabel = document.createElement("span");
  minLabel.textContent = "Min:";
  minLabel.style.minWidth = "40px";
  const minSlider = document.createElement("input");
  minSlider.type = "range";
  minSlider.id = "boxOfficeMin";
  minSlider.min = "0";
  minSlider.max = "2000";
  minSlider.value = "0";
  minSlider.style.flex = "1";
  const minValue = document.createElement("span");
  minValue.textContent = "$0M";
  minValue.id = "boxOfficeMinValue";
  
  minSlider.addEventListener("input", () => {
    minValue.textContent = `$${minSlider.value}M`;
  });
  
  minRow.appendChild(minLabel);
  minRow.appendChild(minSlider);
  minRow.appendChild(minValue);
  
  const maxRow = document.createElement("div");
  maxRow.style.display = "flex";
  maxRow.style.gap = "12px";
  maxRow.style.width = "100%";
  maxRow.style.alignItems = "center";
  
  const maxLabel = document.createElement("span");
  maxLabel.textContent = "Max:";
  maxLabel.style.minWidth = "40px";
  const maxSlider = document.createElement("input");
  maxSlider.type = "range";
  maxSlider.id = "boxOfficeMax";
  maxSlider.min = "0";
  maxSlider.max = "2000";
  maxSlider.value = "2000";
  maxSlider.style.flex = "1";
  const maxValue = document.createElement("span");
  maxValue.textContent = "$2000M+";
  maxValue.id = "boxOfficeMaxValue";
  
  maxSlider.addEventListener("input", () => {
    maxValue.textContent = `$${maxSlider.value}M${maxSlider.value === "2000" ? "+" : ""}`;
  });
  
  maxRow.appendChild(maxLabel);
  maxRow.appendChild(maxSlider);
  maxRow.appendChild(maxValue);
  
  boxOfficeRow.appendChild(minRow);
  boxOfficeRow.appendChild(maxRow);
  root.appendChild(boxOfficeRow);
  
  const boxOfficeQuick = document.createElement("div");
  boxOfficeQuick.className = "chip-group";
  boxOfficeQuick.style.marginTop = "12px";
  [
    { label: "Blockbuster ($500M+)", min: 500000000, max: 10000000000 },
    { label: "Billion Dollar Club", min: 1000000000, max: 10000000000 }
  ].forEach(preset => {
    const chip = makeChip(preset.label, "production", {
      type: "boxoffice",
      min: preset.min,
      max: preset.max
    });
    chip.addEventListener("click", () => {
      document.getElementById("boxOfficeMin").value = preset.min / 1000000;
      document.getElementById("boxOfficeMax").value = Math.min(preset.max / 1000000, 2000);
      document.getElementById("boxOfficeMinValue").textContent = `$${preset.min / 1000000}M`;
      document.getElementById("boxOfficeMaxValue").textContent = preset.max >= 2000000000 ? "$2000M+" : `$${preset.max / 1000000}M`;
    });
    boxOfficeQuick.appendChild(chip);
  });
  root.appendChild(boxOfficeQuick);
}

// =============================================
// 8. WATCH PROVIDERS SECTION
// =============================================

function buildWatchContent(root) {
  const savedCountry = localStorage.getItem("watchCountry") || "";
  let allProviderData = [];

  // --- Country selector ---
  root.appendChild(makeSectionLabel("Your Country"));

  const countrySelect = document.createElement("select");
  countrySelect.id = "watchCountrySelect";
  countrySelect.style.cssText = "width: 100%; padding: 10px 12px; background: rgba(15,23,41,0.6); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; color: var(--film-white); font-size: 13px; margin-bottom: 16px; cursor: pointer; appearance: none;";
  const countries = [
    ["", "Select country..."],
    ["US", "United States"], ["GB", "United Kingdom"], ["CA", "Canada"], ["AU", "Australia"],
    ["NZ", "New Zealand"], ["IE", "Ireland"], ["DE", "Germany"], ["FR", "France"],
    ["ES", "Spain"], ["IT", "Italy"], ["PT", "Portugal"], ["NL", "Netherlands"],
    ["BE", "Belgium"], ["AT", "Austria"], ["CH", "Switzerland"], ["SE", "Sweden"],
    ["NO", "Norway"], ["DK", "Denmark"], ["FI", "Finland"], ["PL", "Poland"],
    ["BR", "Brazil"], ["MX", "Mexico"], ["AR", "Argentina"], ["CL", "Chile"],
    ["CO", "Colombia"], ["JP", "Japan"], ["KR", "South Korea"], ["IN", "India"],
    ["SG", "Singapore"], ["ZA", "South Africa"]
  ];
  countrySelect.innerHTML = countries.map(([code, name]) =>
    `<option value="${code}"${code === savedCountry ? " selected" : ""}>${name}</option>`
  ).join("");
  root.appendChild(countrySelect);

  // --- Provider chips ---
  root.appendChild(makeSectionLabel("Your Streaming Services"));

  const hint = document.createElement("p");
  hint.style.cssText = "font-size: 11px; color: var(--muted-silver); margin-bottom: 10px; font-style: italic;";
  hint.textContent = "Select services you subscribe to. Orbit Search will filter results to these.";
  root.appendChild(hint);

  const providerContainer = document.createElement("div");
  providerContainer.id = "watchProviderChips";
  providerContainer.className = "chip-group";
  providerContainer.style.flexWrap = "wrap";
  root.appendChild(providerContainer);

  // --- Status indicator ---
  const status = document.createElement("div");
  status.id = "watchStatus";
  status.style.cssText = "margin-top: 12px; padding: 8px 12px; border-radius: 8px; font-size: 11px; display: none;";
  root.appendChild(status);

  function updateStatus() {
    const country = countrySelect.value;
    const activeChips = providerContainer.querySelectorAll(".chip.active");
    if (country && activeChips.length > 0) {
      const names = Array.from(activeChips).map(c => {
        try { return JSON.parse(c.dataset.value).name; } catch { return ""; }
      }).filter(Boolean);
      status.style.display = "block";
      status.style.background = "rgba(0,217,255,0.08)";
      status.style.border = "1px solid rgba(0,217,255,0.25)";
      status.style.color = "var(--accent-cyan)";
      status.textContent = `Orbit will filter by: ${names.join(", ")} (${country})`;
    } else {
      status.style.display = "none";
    }
  }

  function saveToLocalStorage() {
    const country = countrySelect.value;
    if (country) {
      localStorage.setItem("watchCountry", country);
    } else {
      localStorage.removeItem("watchCountry");
    }

    const activeChips = providerContainer.querySelectorAll(".chip.active");
    const providers = Array.from(activeChips).map(c => {
      try { return JSON.parse(c.dataset.value); } catch { return null; }
    }).filter(Boolean).map(v => ({ id: v.id, name: v.name, logo: v.logo || "" }));
    localStorage.setItem("watchProviders", JSON.stringify(providers));

    updateStatus();
  }

  function loadProviders(country) {
    if (!country) {
      providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
      return;
    }
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Loading providers...</span>';

    fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${TMDB_API_KEY}&watch_region=${country}`)
      .then(res => res.json())
      .then(data => {
        allProviderData = (data.results || []).slice(0, 25);
        providerContainer.innerHTML = "";

        let savedIds = [];
        try { savedIds = JSON.parse(localStorage.getItem("watchProviders") || "[]").map(p => p.id); } catch {}

        allProviderData.forEach(p => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "chip";
          if (savedIds.includes(p.provider_id)) chip.classList.add("active");
          chip.dataset.value = JSON.stringify({ type: "provider", id: p.provider_id, name: p.provider_name, logo: p.logo_path, region: country });
          chip.style.cssText = "display: flex; align-items: center; gap: 6px; padding: 6px 10px;";
          const logo = p.logo_path ? `<img src="https://image.tmdb.org/t/p/w45${p.logo_path}" style="width:20px;height:20px;border-radius:3px;">` : "";
          chip.innerHTML = `${logo}<span>${p.provider_name}</span>`;
          chip.addEventListener("click", () => {
            chip.classList.toggle("active");
            saveToLocalStorage();
          });
          providerContainer.appendChild(chip);
        });

        updateStatus();
      })
      .catch(() => {
        providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Failed to load providers</span>';
      });
  }

  countrySelect.addEventListener("change", () => {
    saveToLocalStorage();
    loadProviders(countrySelect.value);
  });

  // Auto-load if country already set
  if (savedCountry) {
    loadProviders(savedCountry);
  } else {
    providerContainer.innerHTML = '<span style="font-size: 11px; color: var(--muted-silver);">Select a country to see providers</span>';
  }
}

function detectCountryFromBrowser() {
  const lang = navigator.language || navigator.userLanguage || "en-US";
  const parts = lang.split("-");
  return parts.length > 1 ? parts[1].toUpperCase() : "US";
}

// =============================================
// 9. SUITABILITY SECTION
// =============================================

function buildSuitabilityContent(root) {
  root.appendChild(makeSectionLabel("Age Rating / Certification"));
  
  const ratings = ["G", "PG", "PG-13", "R", "NC-17", "Unrated"];
  const ratingGroup = document.createElement("div");
  ratingGroup.className = "chip-group";
  ratings.forEach(r => {
    const chip = makeChip(r, "suitability", { type: "certification", rating: r });
    chip.id = `cert-${r.replace('-', '')}`;
    ratingGroup.appendChild(chip);
  });
  root.appendChild(ratingGroup);
  
  const note = document.createElement("p");
  note.style.fontSize = "12px";
  note.style.color = "var(--muted-silver)";
  note.style.marginTop = "12px";
  note.style.fontStyle = "italic";
  note.textContent = "Note: Ratings are US certifications. Other regions may have different classifications.";
  root.appendChild(note);
}

// =============================================
// COLLECT LABELS FOR EACH SECTION
// =============================================

function collectLabelsForSection(sectionKey) {
  const results = [];
  
  switch (sectionKey) {
    case "people":
      const selectedPeopleChips = document.querySelectorAll('.selected-person-chip');
      return Array.from(selectedPeopleChips).map(chip => {
        const role = chip.dataset.personRole;
        let roleLabel = "";
        if (role === "cast") roleLabel = " (Actor)";
        else if (role === "crew") roleLabel = " (Behind Camera)";
        
        return {
          label: chip.dataset.personName + roleLabel,
          value: {
            type: "person",
            id: chip.dataset.personId,
            name: chip.dataset.personName,
            role: role
          }
        };
      });
      
    case "genres":
      const genreChips = document.querySelectorAll('.chip.active');
      return Array.from(genreChips).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return { label: chip.textContent, value };
      });
      
    case "setting":
      const settingChips = document.querySelectorAll('#focusContent .chip.active');
      return Array.from(settingChips).map(chip => {
        const value = JSON.parse(chip.dataset.value);
        let label = chip.textContent;
        if (value.type === "decade") {
          label = `Set in ${value.decade}s`;
        } else if (value.type === "century") {
          label = `Set in ${value.label || value.century + 's'}`;
        } else if (value.type === "timePeriod") {
          label = `${value.name} Era`;
        }
        return { label, value };
      });
      
    case "dateRuntime":
      const yearInput = document.getElementById("yearInput");
      if (yearInput && yearInput.value) {
        results.push({
          label: `Year: ${yearInput.value}`,
          value: { type: "year", year: parseInt(yearInput.value) }
        });
      }
      
      const decadeChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "decade";
        });
      
      decadeChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: `Made in ${value.decade}s`,
          value
        });
      });
      
      const runtimeMin = document.getElementById("runtimeMin");
      const runtimeMax = document.getElementById("runtimeMax");
      if (runtimeMin && runtimeMax) {
        const min = parseInt(runtimeMin.value);
        const max = parseInt(runtimeMax.value);
        if (min > 0 || max < 300) {
          results.push({
            label: `Runtime: ${min}-${max} min`,
            value: { type: "runtime", min, max }
          });
        }
      }
      
      return results;
      
    case "ratings":
      const ratingMin = document.getElementById("ratingMin");
      const ratingMax = document.getElementById("ratingMax");
      if (ratingMin && ratingMax) {
        const min = parseFloat(ratingMin.value);
        const max = parseFloat(ratingMax.value);
        if (min > 0 || max < 10) {
          results.push({
            label: `Rating: ${min.toFixed(1)}-${max.toFixed(1)}`,
            value: { type: "rating", min, max }
          });
        }
      }
      
      const voteChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "votes";
        });
      
      voteChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: `Min votes: ${value.min.toLocaleString()}`,
          value
        });
      });
      
      return results;
      
    case "regionLanguage":
      const regionContainer = document.getElementById("selectedRegionContainer");
      if (regionContainer && regionContainer.children.length > 0) {
        const regionChip = regionContainer.querySelector('[data-region-code]');
        const regionText = regionContainer.querySelector('span')?.textContent;
        if (regionChip && regionText) {
          const code = regionChip.dataset.regionCode;
          results.push({
            label: `Region: ${regionText}`,
            value: { type: "region", code: code, name: regionText }
          });
        }
      }
      
      // Check English Only toggle first
      const englishToggle = document.getElementById("englishOnlyToggle");
      const langContainer = document.getElementById("selectedLanguageContainer");
      
      if (englishToggle && englishToggle.checked) {
        // English Only is ON - use English
        results.push({
          label: `Language: English`,
          value: { type: "language", code: "en", name: "English" }
        });
      } else if (langContainer && langContainer.children.length > 0) {
        // English Only is OFF - use selected language
        const langChip = langContainer.querySelector('[data-lang-code]');
        const langText = langContainer.querySelector('span')?.textContent;
        if (langChip && langText) {
          const langCode = langChip.dataset.langCode;
          results.push({
            label: `Language: ${langText}`,
            value: { type: "language", code: langCode, name: langText }
          });
        }
      }
      // If English Only is OFF and no language selected, don't add any language filter (all languages)
      
      return results;
      
    case "production":
      const studioChips = Array.from(document.querySelectorAll('#focusContent .chip.active'))
        .filter(chip => {
          const val = JSON.parse(chip.dataset.value);
          return val.type === "company";
        });
      
      studioChips.forEach(chip => {
        const value = JSON.parse(chip.dataset.value);
        results.push({
          label: chip.textContent,
          value
        });
      });
      
      const boxOfficeMin = document.getElementById("boxOfficeMin");
      const boxOfficeMax = document.getElementById("boxOfficeMax");
      if (boxOfficeMin && boxOfficeMax) {
        const min = parseInt(boxOfficeMin.value) * 1000000;
        const max = parseInt(boxOfficeMax.value) * 1000000;
        if (min > 0 || max < 2000000000) {
          results.push({
            label: `Box Office: $${min/1000000}M-$${max/1000000}M${max >= 2000000000 ? '+' : ''}`,
            value: { type: "boxoffice", min, max }
          });
        }
      }
      
      return results;
      
    case "watch":
      const watchChips = document.querySelectorAll('#watchProviderChips .chip.active');
      return Array.from(watchChips).map(chip => {
        try {
          const val = JSON.parse(chip.dataset.value);
          return { label: val.name, value: val };
        } catch { return null; }
      }).filter(Boolean);
      
    case "suitability":
      const certChips = Array.from(document.querySelectorAll('#focusContent .chip.active'));
      return certChips.map(chip => {
        const value = JSON.parse(chip.dataset.value);
        return {
          label: `Rated ${value.rating}`,
          value
        };
      });
      
    default:
      return [];
  }
}

// Region modal removed - all streaming settings consolidated into Watch Providers section