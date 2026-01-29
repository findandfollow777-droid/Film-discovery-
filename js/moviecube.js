// ============================================
// SHARED MOVIE CUBE COMPONENT
// Uses EXACT same class names as Results page for consistent styling
// Wrapped in IIFE to avoid variable conflicts
// ============================================

(function() {
  // Read API key at runtime
  function getApiKey() {
    return (typeof TMDB_API_KEY !== 'undefined') ? TMDB_API_KEY : "dd1b9aebd0769bc49a68b7853b6f4266";
  }
  function getImgBase() {
    return (typeof TMDB_IMG !== 'undefined') ? TMDB_IMG : "https://image.tmdb.org/t/p/";
  }

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect fill='%23374151' width='50' height='50'/%3E%3Ccircle cx='25' cy='18' r='10' fill='%236B7280'/%3E%3Cellipse cx='25' cy='45' rx='18' ry='15' fill='%236B7280'/%3E%3C/svg%3E";
  
  const DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150' viewBox='0 0 100 150'%3E%3Crect fill='%23374151' width='100' height='150'/%3E%3Ctext x='50' y='75' font-family='Arial' font-size='12' fill='%236B7280' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";

  // State
  let cubeOverlay, cube, currentFace = 1;
  let cubeMovieData = null;
  let similarMovies = [];

  // Trivia state
  let triviaQuestions = [];
  let triviaIndex = 0;
  let triviaScore = 0;
  let triviaAnswered = false;

  // Venn compare state
  let vennCompareMode = false;
  let vennSelectedActors = [];

  // DOM refs - Main popup
  let cubePoster, cubeTitle, cubeYear, cubeRating, cubeRuntime, cubeSynopsis, cubeGenres, cubeWhereToWatch;
  let cubeDirector, cubeCastGrid, cubeAllCastBtn;
  let cubeStatRuntime, cubeStatBudget, cubeStatRevenue, cubeStatPopularity, cubeStatVotes, cubeStatLanguage;
  let cubeProductionCompanies;
  let cubeTrailerBtn, cubeAnchorBtn, cubeSimilarBtn, cubeSimilarOverlay;
  
  // DOM refs - Trailer modal
  let cubeTrailerOverlay, cubeTrailerContainer;
  
  // DOM refs - All Cast modal
  let cubeAllCastOverlay, cubeAllCastTimeline;

  // Callbacks
  let onPersonClick = null;
  let onAnchorClick = null;

  // ============================================
  // INIT
  // ============================================

  function initMovieCube(options = {}) {
    onPersonClick = options.onPersonClick || null;
    onAnchorClick = options.onAnchorClick || null;
    
    if (!document.getElementById("movieCubeOverlay")) {
      injectCubeHTML();
    }
    
    cubeOverlay = document.getElementById("movieCubeOverlay");
    cube = document.getElementById("movieCube");
    
    cubePoster = document.getElementById("cubePosterLarge");
    cubeTitle = document.getElementById("cubePopupTitle");
    cubeYear = document.getElementById("cubePopupYear");
    cubeRating = document.getElementById("cubePopupRating");
    cubeRuntime = document.getElementById("cubePopupRuntime");
    cubeSynopsis = document.getElementById("cubePopupSynopsis");
    cubeGenres = document.getElementById("cubePopupGenres");
    cubeWhereToWatch = document.getElementById("cubeWhereToWatch");
    
    cubeDirector = document.getElementById("cubeDirectorInfo");
    cubeCastGrid = document.getElementById("cubeCastGrid");
    cubeAllCastBtn = document.getElementById("cubeAllCastBtn");
    
    cubeStatRuntime = document.getElementById("cubeStatRuntime");
    cubeStatBudget = document.getElementById("cubeStatBudget");
    cubeStatRevenue = document.getElementById("cubeStatRevenue");
    cubeStatPopularity = document.getElementById("cubeStatPopularity");
    cubeStatVotes = document.getElementById("cubeStatVotes");
    cubeStatLanguage = document.getElementById("cubeStatLanguage");
    cubeProductionCompanies = document.getElementById("cubeProductionCompanies");
    
    cubeTrailerBtn = document.getElementById("cubeTrailerBtn");
    cubeAnchorBtn = document.getElementById("cubeAnchorBtn");
    cubeSimilarBtn = document.getElementById("cubeSimilarBtn");
    cubeSimilarOverlay = document.getElementById("cubeSimilarOverlay");
    
    // Trailer modal
    cubeTrailerOverlay = document.getElementById("cubeTrailerOverlay");
    cubeTrailerContainer = document.getElementById("cubeTrailerContainer");
    
    // All Cast modal
    cubeAllCastOverlay = document.getElementById("cubeAllCastOverlay");
    cubeAllCastTimeline = document.getElementById("cubeAllCastTimeline");
    
    setupCubeEvents();
  }

  function injectCubeHTML() {
    // Uses EXACT same structure and class names as results.html
    const html = `
      <div class="movie-popup-overlay" id="movieCubeOverlay" hidden>
        <div class="movie-popup">
          <button class="popup-close" id="cubeCloseBtn">✕</button>
          
          <!-- CUBE NAVIGATION -->
          <div class="cube-nav">
            <button class="cube-nav-btn active" data-face="1">🎬 Poster</button>
            <button class="cube-nav-btn" data-face="2">📝 Info</button>
            <button class="cube-nav-btn" data-face="3">👥 Cast</button>
            <button class="cube-nav-btn" data-face="4">📊 Stats</button>
            <button class="cube-nav-btn" data-face="5">🧠 Trivia</button>
          </div>
          
          <!-- 3D CUBE SCENE -->
          <div class="cube-scene">
            <div class="cube" id="movieCube" data-face="1">
              
              <!-- FACE 1: POSTER -->
              <div class="cube-face face-front" data-face="1">
                <div class="poster-showcase">
                  <img class="popup-poster-large" id="cubePosterLarge" src="" alt="">
                </div>
              </div>
              
              <!-- FACE 2: INFO -->
              <div class="cube-face face-right" data-face="2">
                <div class="popup-details">
                  <h2 class="popup-title" id="cubePopupTitle"></h2>
                  <div class="popup-meta">
                    <span class="popup-year" id="cubePopupYear"></span>
                    <span class="popup-rating">⭐ <span id="cubePopupRating"></span></span>
                    <span class="popup-runtime" id="cubePopupRuntime"></span>
                  </div>
                  <p class="popup-synopsis" id="cubePopupSynopsis"></p>
                  <div class="popup-genres" id="cubePopupGenres"></div>
                  <div class="where-to-watch" id="cubeWhereToWatch"></div>
                </div>
              </div>
              
              <!-- FACE 3: CAST -->
              <div class="cube-face face-back" data-face="3">
                <div class="cast-section">
                  <h3 class="section-title">🎬 Director</h3>
                  <div class="director-info" id="cubeDirectorInfo"></div>
                  <h3 class="section-title">👥 Top Cast</h3>
                  <div class="cast-grid" id="cubeCastGrid"></div>
                  <button class="all-cast-btn" id="cubeAllCastBtn">View All Cast →</button>
                  <div class="cube-venn-bar">
                    <button class="cube-venn-toggle" id="cubeVennToggle">🔀 Compare Actors</button>
                    <button class="cube-venn-launch" id="cubeVennLaunch" hidden>View Venn →</button>
                  </div>
                </div>
              </div>
              
              <!-- FACE 4: STATS -->
              <div class="cube-face face-left" data-face="4">
                <div class="stats-section">
                  <h3 class="section-title">📊 Statistics</h3>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <span class="stat-label">Runtime</span>
                      <span class="stat-value" id="cubeStatRuntime">--</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Budget</span>
                      <span class="stat-value" id="cubeStatBudget">--</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Revenue</span>
                      <span class="stat-value" id="cubeStatRevenue">--</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Popularity</span>
                      <span class="stat-value" id="cubeStatPopularity">--</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Reviews</span>
                      <span class="stat-value" id="cubeStatVotes">--</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Language</span>
                      <span class="stat-value" id="cubeStatLanguage">--</span>
                    </div>
                  </div>
                  <div class="production-companies" id="cubeProductionCompanies"></div>
                </div>
              </div>
              
            </div>
            <!-- TRIVIA OVERLAY - flat, outside 3D cube -->
            <div class="cube-trivia-overlay" id="cubeTriviaOverlay">
              <div class="cube-trivia-section" id="cubeTriviaSection">
                <h3 class="section-title">🧠 Movie Trivia</h3>
                <div class="cube-trivia-progress" id="cubeTriviaProgress"></div>
                <div class="cube-trivia-question" id="cubeTriviaQuestion"></div>
                <div class="cube-trivia-options" id="cubeTriviaOptions"></div>
                <div class="cube-trivia-score" id="cubeTriviaScore"></div>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="popup-actions-bar">
            <button class="anchor-btn-primary" id="cubeAnchorBtn">
              <span class="anchor-icon">✦</span> Make Anchor Film
            </button>
            <div class="secondary-actions">
              <button class="action-btn-secondary" id="cubeTrailerBtn">
                <span class="play-icon">▶</span> Trailer
              </button>
              <button class="action-btn-secondary" id="cubeSimilarBtn">
                <span class="similar-icon">🎯</span> Similar Movies
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- SIMILAR MOVIES OVERLAY -->
      <div class="similar-overlay" id="cubeSimilarOverlay" hidden>
        <div class="similar-modal">
          <button class="modal-close" id="cubeSimilarClose">✕</button>
          <h2 class="modal-title">Similar Movies</h2>
          <div class="similar-panel-grid" id="cubeSimilarGrid"></div>
        </div>
      </div>
      
      <!-- ALL CAST OVERLAY -->
      <div class="all-cast-overlay" id="cubeAllCastOverlay" hidden>
        <div class="all-cast-modal">
          <button class="modal-close" id="cubeAllCastClose">✕</button>
          <h2 class="modal-title">Full Cast</h2>
          <div class="all-cast-timeline" id="cubeAllCastTimeline"></div>
          <div class="cube-venn-bar" id="cubeAllCastVennBar">
            <button class="cube-venn-toggle" id="cubeAllCastVennToggle">🔀 Compare Actors</button>
            <button class="cube-venn-launch" id="cubeAllCastVennLaunch" hidden>View Venn →</button>
          </div>
        </div>
      </div>
      
      <!-- TRAILER OVERLAY -->
      <div class="trailer-overlay" id="cubeTrailerOverlay" hidden>
        <div class="trailer-popup">
          <button class="trailer-close" id="cubeTrailerClose">✕</button>
          <div class="trailer-container" id="cubeTrailerContainer"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  function setupCubeEvents() {
    document.getElementById("cubeCloseBtn")?.addEventListener("click", closeMovieCube);
    
    cubeOverlay?.addEventListener("click", (e) => {
      if (e.target === cubeOverlay) closeMovieCube();
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close in order: trailer > similar > all cast > main popup
        if (cubeTrailerOverlay && !cubeTrailerOverlay.hidden) {
          closeTrailer();
        } else if (cubeSimilarOverlay && !cubeSimilarOverlay.hidden) {
          closeSimilarPanel();
        } else if (cubeAllCastOverlay && !cubeAllCastOverlay.hidden) {
          closeAllCast();
        } else if (cubeOverlay && !cubeOverlay.hidden) {
          closeMovieCube();
        }
      }
    });
    
    // Nav buttons - use event delegation since they're created dynamically
    document.addEventListener("click", (e) => {
      const navBtn = e.target.closest("#movieCubeOverlay .cube-nav-btn");
      if (navBtn) {
        rotateCube(parseInt(navBtn.dataset.face));
      }
    });
    
    // Trailer button - embedded player
    cubeTrailerBtn?.addEventListener("click", openTrailer);
    
    // Anchor button
    cubeAnchorBtn?.addEventListener("click", () => {
      if (onAnchorClick && cubeMovieData) {
        onAnchorClick(cubeMovieData);
      } else if (cubeMovieData) {
        // Navigate to results page with this movie as anchor
        const params = new URLSearchParams({ 
          anchor: cubeMovieData.id, 
          title: cubeMovieData.title 
        });
        window.location.href = `results.html?${params}`;
      }
    });
    
    // Similar movies toggle
    cubeSimilarBtn?.addEventListener("click", openSimilarPanel);
    
    // Similar close
    document.getElementById("cubeSimilarClose")?.addEventListener("click", closeSimilarPanel);
    cubeSimilarOverlay?.addEventListener("click", (e) => {
      if (e.target === cubeSimilarOverlay) closeSimilarPanel();
    });
    
    // All cast button
    cubeAllCastBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      showAllCast();
    });
    
    // All cast close
    document.getElementById("cubeAllCastClose")?.addEventListener("click", closeAllCast);
    cubeAllCastOverlay?.addEventListener("click", (e) => {
      if (e.target === cubeAllCastOverlay) closeAllCast();
    });
    
    // Trailer close
    document.getElementById("cubeTrailerClose")?.addEventListener("click", closeTrailer);
    cubeTrailerOverlay?.addEventListener("click", (e) => {
      if (e.target === cubeTrailerOverlay) closeTrailer();
    });
    
    // Similar movie clicks
    document.addEventListener("click", (e) => {
      const similarItem = e.target.closest("#cubeSimilarOverlay .similar-panel-item");
      if (similarItem) {
        const movieId = similarItem.dataset.movieId;
        if (movieId) {
          closeSimilarPanel();
          openMovieCube(parseInt(movieId));
        }
      }
    });

    // Trivia option clicks - event delegation for reliable 3D click handling
    document.addEventListener("click", (e) => {
      const opt = e.target.closest("#movieCubeOverlay .cube-trivia-option");
      if (opt) {
        handleTriviaAnswer(opt);
      }
      const retry = e.target.closest("#movieCubeOverlay .cube-trivia-retry");
      if (retry) {
        if (cubeMovieData) localStorage.removeItem(`cube_trivia_${cubeMovieData.id}`);
        const section = document.getElementById("cubeTriviaSection");
        if (section) {
          section.innerHTML = `
            <h3 class="section-title">🧠 Movie Trivia</h3>
            <div class="cube-trivia-progress" id="cubeTriviaProgress"></div>
            <div class="cube-trivia-question" id="cubeTriviaQuestion"></div>
            <div class="cube-trivia-options" id="cubeTriviaOptions"></div>
            <div class="cube-trivia-score" id="cubeTriviaScore"></div>
          `;
          populateTriviaFace();
        }
      }
    });

    // Venn compare toggle - both main cast face and all-cast overlay
    document.addEventListener("click", (e) => {
      if (e.target.closest("#cubeVennToggle") || e.target.closest("#cubeAllCastVennToggle")) {
        toggleVennCompareMode();
      }
      if (e.target.closest("#cubeVennLaunch") || e.target.closest("#cubeAllCastVennLaunch")) {
        launchVennFromCube();
      }
    });

    // Cast/director/all-cast clicks - event delegation
    document.addEventListener("click", (e) => {
      // Main cube overlay (cast grid + director)
      const person = e.target.closest("#movieCubeOverlay .clickable-person");
      if (person) {
        handlePersonClick(person);
        return;
      }
      // All cast overlay
      const allCastPerson = e.target.closest("#cubeAllCastOverlay .all-cast-member");
      if (allCastPerson) {
        handlePersonClick(allCastPerson);
      }
    });
  }

  // ============================================
  // OPEN / CLOSE
  // ============================================

  async function openMovieCube(movieId) {
    if (!cubeOverlay) {
      console.warn("Movie cube not initialized. Call initMovieCube() first.");
      return;
    }
    
    currentFace = 1;
    rotateCube(1);
    
    // Reset similar overlay
    if (cubeSimilarOverlay) cubeSimilarOverlay.hidden = true;
    
    try {
      const [movieRes, creditsRes, videosRes, similarRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${getApiKey()}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${getApiKey()}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${getApiKey()}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${getApiKey()}`)
      ]);
      
      cubeMovieData = await movieRes.json();
      const credits = await creditsRes.json();
      const videos = await videosRes.json();
      const similar = await similarRes.json();
      
      cubeMovieData.credits = credits;
      cubeMovieData.videos = videos.results || [];
      similarMovies = similar.results || [];
      
      populatePosterFace();
      populateInfoFace();
      populateCastFace(credits);
      populateStatsFace();
      populateSimilarPanel();
      populateTriviaFace();
      populateWhereToWatch(cubeMovieData.id);

      cubeOverlay.hidden = false;
      document.body.style.overflow = "hidden";
      
    } catch (err) {
      console.error("Error opening movie cube:", err);
    }
  }

  function closeMovieCube() {
    if (cubeOverlay) {
      cubeOverlay.hidden = true;
      document.body.style.overflow = "";
    }
    cubeMovieData = null;
  }

  function rotateCube(faceNum) {
    currentFace = faceNum;
    // For faces 1-4, rotate the 3D cube. For face 5, keep cube at face 1 and show flat overlay.
    if (cube) cube.dataset.face = faceNum <= 4 ? faceNum.toString() : "1";

    // Toggle trivia overlay
    const triviaOverlay = document.getElementById("cubeTriviaOverlay");
    if (triviaOverlay) {
      triviaOverlay.classList.toggle("active", faceNum === 5);
    }

    // Update active nav button
    document.querySelectorAll("#movieCubeOverlay .cube-nav-btn").forEach(btn => {
      btn.classList.toggle("active", parseInt(btn.dataset.face) === faceNum);
    });
  }

  // ============================================
  // POPULATE FACES
  // ============================================

  function populatePosterFace() {
    if (cubePoster && cubeMovieData.poster_path) {
      cubePoster.src = `${getImgBase()}w780${cubeMovieData.poster_path}`;
    }
  }

  function populateInfoFace() {
    if (cubeTitle) cubeTitle.textContent = cubeMovieData.title || "";
    if (cubeYear) cubeYear.textContent = cubeMovieData.release_date?.split("-")[0] || "";
    if (cubeRating) cubeRating.textContent = cubeMovieData.vote_average?.toFixed(1) || "N/A";
    if (cubeRuntime) cubeRuntime.textContent = cubeMovieData.runtime ? `${cubeMovieData.runtime} min` : "";
    if (cubeSynopsis) cubeSynopsis.textContent = cubeMovieData.overview || "No synopsis available.";
    
    if (cubeGenres && cubeMovieData.genres) {
      cubeGenres.innerHTML = cubeMovieData.genres.map(g => 
        `<span class="genre-tag">${g.name}</span>`
      ).join("");
    }
  }

  function getWatchCountry() {
    const saved = localStorage.getItem("watchCountry");
    if (saved) return saved;
    // Derive from browser language (e.g. "en-US" → "US", "en-GB" → "GB")
    const lang = navigator.language || navigator.userLanguage || "en-US";
    const parts = lang.split("-");
    return parts.length > 1 ? parts[1].toUpperCase() : "US";
  }

  async function populateWhereToWatch(movieId) {
    if (!cubeWhereToWatch) return;
    cubeWhereToWatch.innerHTML = '<div class="watch-loading">Loading streaming info...</div>';

    try {
      const region = getWatchCountry();
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${getApiKey()}`);
      const data = await res.json();
      const regionData = data.results?.[region];

      if (!regionData) {
        cubeWhereToWatch.innerHTML = `
          <div class="watch-section">
            <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
            <p class="watch-none">Not currently streaming</p>
          </div>`;
        return;
      }

      // Combine flatrate (subscription), rent, buy
      const providers = [];
      const seen = new Set();
      ['flatrate', 'rent', 'buy'].forEach(type => {
        (regionData[type] || []).forEach(p => {
          if (!seen.has(p.provider_id)) {
            seen.add(p.provider_id);
            providers.push({ id: p.provider_id, name: p.provider_name, logo: p.logo_path, type });
          }
        });
      });

      if (providers.length === 0) {
        cubeWhereToWatch.innerHTML = `
          <div class="watch-section">
            <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
            <p class="watch-none">Not currently streaming</p>
          </div>`;
        return;
      }

      const logoBase = getImgBase() + "w45";
      // Check user's subscribed providers
      let subscribedIds = new Set();
      try {
        JSON.parse(localStorage.getItem("watchProviders") || "[]").forEach(p => subscribedIds.add(p.id));
      } catch {}

      cubeWhereToWatch.innerHTML = `
        <div class="watch-section">
          <h4 class="watch-title">📡 Where to Watch <span class="watch-region">(${region})</span></h4>
          <div class="watch-providers">
            ${providers.slice(0, 8).map(p => {
              const subscribed = subscribedIds.size > 0 && subscribedIds.has(p.id) ? " watch-subscribed" : "";
              return `
              <div class="watch-provider${subscribed}" title="${p.name}">
                <img class="watch-logo" src="${logoBase}${p.logo}" alt="${p.name}" onerror="this.style.display='none'">
                <span class="watch-name">${p.name}</span>
              </div>`;
            }).join("")}
          </div>
        </div>`;
    } catch (e) {
      console.error("Watch providers error:", e);
      cubeWhereToWatch.innerHTML = '';
    }
  }

  function populateCastFace(credits) {
    // Reset venn compare state
    vennCompareMode = false;
    vennSelectedActors = [];
    const toggleBtn = document.getElementById("cubeVennToggle");
    const launchBtn = document.getElementById("cubeVennLaunch");
    if (toggleBtn) toggleBtn.textContent = "🔀 Compare Actors";
    if (launchBtn) launchBtn.hidden = true;

    if (cubeDirector) {
      const director = credits.crew?.find(c => c.job === "Director");
      if (director) {
        const photo = director.profile_path ? `${getImgBase()}w92${director.profile_path}` : DEFAULT_AVATAR;
        cubeDirector.innerHTML = `
          <div class="clickable-person director-clickable" data-person-id="${director.id}" data-person-name="${director.name}">
            <img class="director-photo" src="${photo}" alt="${director.name}" onerror="this.src='${DEFAULT_AVATAR}'">
            <span class="director-name">${director.name}</span>
          </div>
        `;
      } else {
        cubeDirector.innerHTML = '<span class="no-data">Unknown</span>';
      }
    }

    if (cubeCastGrid) {
      const cast = credits.cast?.slice(0, 5) || [];
      cubeCastGrid.innerHTML = cast.map(actor => {
        const photo = actor.profile_path ? `${getImgBase()}w92${actor.profile_path}` : DEFAULT_AVATAR;
        return `
          <div class="cast-member clickable-person" data-person-id="${actor.id}" data-person-name="${actor.name}">
            <img class="cast-photo" src="${photo}" alt="${actor.name}" onerror="this.src='${DEFAULT_AVATAR}'">
            <div class="cast-name">${actor.name}</div>
          </div>
        `;
      }).join("");
    }
  }

  function handlePersonClick(el) {
    const id = el.dataset.personId;
    const name = el.dataset.personName;

    // If venn compare mode, toggle selection instead of navigating
    if (vennCompareMode) {
      toggleVennActorSelection(el);
      return;
    }

    if (onPersonClick) {
      onPersonClick(id, name);
    } else {
      window.location.href = `timeline.html?id=${id}&name=${encodeURIComponent(name)}`;
    }
  }

  function populateStatsFace() {
    const m = cubeMovieData;
    if (cubeStatRuntime) cubeStatRuntime.textContent = m.runtime ? `${m.runtime} min` : "--";
    if (cubeStatBudget) cubeStatBudget.textContent = m.budget ? `$${(m.budget / 1000000).toFixed(1)}M` : "--";
    if (cubeStatRevenue) cubeStatRevenue.textContent = m.revenue ? `$${(m.revenue / 1000000).toFixed(1)}M` : "--";
    if (cubeStatPopularity) cubeStatPopularity.textContent = m.popularity ? m.popularity.toFixed(0) : "--";
    if (cubeStatVotes) cubeStatVotes.textContent = m.vote_count ? m.vote_count.toLocaleString() : "--";
    if (cubeStatLanguage) cubeStatLanguage.textContent = m.original_language?.toUpperCase() || "--";
    
    if (cubeProductionCompanies && m.production_companies?.length) {
      cubeProductionCompanies.innerHTML = `
        <h4 class="production-title">Production</h4>
        <div class="production-list">
          ${m.production_companies.slice(0, 3).map(c => `<span>${c.name}</span>`).join(" • ")}
        </div>
      `;
    } else if (cubeProductionCompanies) {
      cubeProductionCompanies.innerHTML = "";
    }
  }

  // ============================================
  // TRAILER - Embedded YouTube Player
  // ============================================

  async function openTrailer() {
    if (!cubeMovieData) return;
    
    // First check if we already have videos
    let videos = cubeMovieData.videos;
    
    // If not, fetch them
    if (!videos || videos.length === 0) {
      try {
        const videosRes = await fetch(`https://api.themoviedb.org/3/movie/${cubeMovieData.id}/videos?api_key=${getApiKey()}`);
        const videosData = await videosRes.json();
        videos = videosData.results || [];
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    }
    
    const trailer = videos?.find(v => v.type === "Trailer" && v.site === "YouTube") 
      || videos?.find(v => v.site === "YouTube");
    
    if (trailer) {
      showTrailer(trailer.key);
    } else {
      // Fallback: search YouTube
      const searchQuery = encodeURIComponent(`${cubeMovieData.title} ${cubeMovieData.release_date?.split("-")[0] || ""} official trailer`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank");
    }
  }

  function showTrailer(youtubeId) {
    if (!cubeTrailerContainer || !cubeTrailerOverlay) return;
    
    cubeTrailerContainer.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
      </iframe>
    `;
    cubeTrailerOverlay.hidden = false;
  }

  function closeTrailer() {
    if (cubeTrailerOverlay) cubeTrailerOverlay.hidden = true;
    if (cubeTrailerContainer) cubeTrailerContainer.innerHTML = "";
  }

  // ============================================
  // SIMILAR MOVIES
  // ============================================

  function openSimilarPanel() {
    if (!cubeSimilarOverlay) return;
    cubeSimilarOverlay.hidden = false;
  }

  function closeSimilarPanel() {
    if (!cubeSimilarOverlay) return;
    cubeSimilarOverlay.hidden = true;
  }

  function populateSimilarPanel() {
    const grid = document.getElementById("cubeSimilarGrid");
    if (!grid) return;
    
    grid.innerHTML = similarMovies.slice(0, 12).map(movie => {
      const poster = movie.poster_path 
        ? `${getImgBase()}w154${movie.poster_path}`
        : DEFAULT_POSTER;
      return `
        <div class="similar-panel-item" data-movie-id="${movie.id}">
          <img class="similar-panel-poster" src="${poster}" alt="${movie.title}" onerror="this.src='${DEFAULT_POSTER}'">
          <div class="similar-panel-title">${movie.title}</div>
        </div>
      `;
    }).join("");
  }

  // ============================================
  // ALL CAST
  // ============================================

  function showAllCast() {
    if (!cubeAllCastOverlay || !cubeAllCastTimeline || !cubeMovieData?.credits?.cast) return;

    // Reset venn state for all-cast panel
    vennCompareMode = false;
    vennSelectedActors = [];
    const toggleBtn = document.getElementById("cubeAllCastVennToggle");
    const launchBtn = document.getElementById("cubeAllCastVennLaunch");
    if (toggleBtn) { toggleBtn.textContent = "🔀 Compare Actors"; toggleBtn.classList.remove("active"); }
    if (launchBtn) launchBtn.hidden = true;

    const cast = cubeMovieData.credits.cast;

    cubeAllCastTimeline.innerHTML = cast.map(person => {
      const photo = person.profile_path
        ? `${getImgBase()}w92${person.profile_path}`
        : DEFAULT_AVATAR;
      return `
        <div class="all-cast-member clickable-person" data-person-id="${person.id}" data-person-name="${escapeQuotes(person.name)}">
          <img class="all-cast-photo" src="${photo}" alt="${person.name}" onerror="this.src='${DEFAULT_AVATAR}'">
          <div class="all-cast-name">${person.name}</div>
          <div class="all-cast-character">${person.character || ''}</div>
        </div>
      `;
    }).join("");

    cubeAllCastOverlay.hidden = false;
  }

  function closeAllCast() {
    if (cubeAllCastOverlay) cubeAllCastOverlay.hidden = true;
  }

  function escapeQuotes(str) {
    return str ? str.replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
  }

  // ============================================
  // TRIVIA
  // ============================================

  function getTriviaCache(movieId) {
    try {
      const data = JSON.parse(localStorage.getItem(`cube_trivia_${movieId}`));
      if (data && data.questions && data.questions.length === 3) return data;
    } catch (e) {}
    return null;
  }

  function setTriviaCache(movieId, questions) {
    try {
      localStorage.setItem(`cube_trivia_${movieId}`, JSON.stringify({ questions, ts: Date.now() }));
    } catch (e) {}
  }

  function generateTriviaQuestions(movie) {
    const questions = [];
    const m = movie;

    // Pool of potential questions from TMDB data
    const pool = [];

    // Budget question
    if (m.budget && m.budget > 0) {
      const correct = `$${(m.budget / 1000000).toFixed(0)}M`;
      const base = m.budget / 1000000;
      const wrongs = [
        `$${Math.max(1, Math.round(base * 0.4))}M`,
        `$${Math.round(base * 1.8)}M`,
        `$${Math.round(base * 3.2)}M`
      ].filter(w => w !== correct);
      pool.push({ q: `What was the budget of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3) });
    }

    // Revenue question
    if (m.revenue && m.revenue > 0) {
      const rev = m.revenue / 1000000;
      const correct = rev >= 1000 ? `$${(rev / 1000).toFixed(1)}B` : `$${rev.toFixed(0)}M`;
      const variants = [rev * 0.3, rev * 0.6, rev * 2.5].map(v =>
        v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${Math.round(v)}M`
      ).filter(w => w !== correct);
      pool.push({ q: `How much did "${m.title}" earn at the box office?`, correct, wrongs: variants.slice(0, 3) });
    }

    // Runtime question
    if (m.runtime) {
      const correct = `${m.runtime} minutes`;
      const wrongs = [
        `${m.runtime + 23} minutes`,
        `${Math.max(60, m.runtime - 31)} minutes`,
        `${m.runtime + 47} minutes`
      ].filter(w => w !== correct);
      pool.push({ q: `What is the runtime of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3) });
    }

    // Tagline question
    if (m.tagline && m.tagline.length > 5) {
      const correct = m.tagline;
      const fakeTaglines = [
        "Every story has a beginning.",
        "The truth will set you free.",
        "Nothing is what it seems.",
        "One moment changes everything.",
        "Beyond the impossible."
      ].filter(t => t !== correct);
      // Shuffle and pick 3
      for (let i = fakeTaglines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fakeTaglines[i], fakeTaglines[j]] = [fakeTaglines[j], fakeTaglines[i]];
      }
      pool.push({ q: `What is the tagline of "${m.title}"?`, correct, wrongs: fakeTaglines.slice(0, 3) });
    }

    // Original language question
    if (m.original_language) {
      const langMap = { en: "English", fr: "French", es: "Spanish", de: "German", ja: "Japanese", ko: "Korean", it: "Italian", pt: "Portuguese", zh: "Chinese", hi: "Hindi", ru: "Russian", ar: "Arabic", sv: "Swedish", da: "Danish", nl: "Dutch", pl: "Polish", th: "Thai" };
      const correct = langMap[m.original_language] || m.original_language.toUpperCase();
      const others = Object.values(langMap).filter(l => l !== correct);
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      pool.push({ q: `What is the original language of "${m.title}"?`, correct, wrongs: others.slice(0, 3) });
    }

    // Release year question
    if (m.release_date) {
      const year = parseInt(m.release_date.split("-")[0]);
      const correct = `${year}`;
      const wrongs = [`${year - 2}`, `${year + 1}`, `${year - 4}`].filter(w => w !== correct);
      pool.push({ q: `What year was "${m.title}" released?`, correct, wrongs: wrongs.slice(0, 3) });
    }

    // Production country question
    if (m.production_countries && m.production_countries.length > 0) {
      const correct = m.production_countries[0].name;
      const fakeCountries = ["United States of America", "United Kingdom", "France", "Germany", "Japan", "South Korea", "Canada", "Australia", "India", "Italy"].filter(c => c !== correct);
      for (let i = fakeCountries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fakeCountries[i], fakeCountries[j]] = [fakeCountries[j], fakeCountries[i]];
      }
      pool.push({ q: `Which country produced "${m.title}"?`, correct, wrongs: fakeCountries.slice(0, 3) });
    }

    // Director question (from credits)
    if (m.credits && m.credits.crew) {
      const director = m.credits.crew.find(c => c.job === "Director");
      if (director) {
        const correct = director.name;
        const otherDirectors = m.credits.crew
          .filter(c => c.job !== "Director" && c.department === "Directing")
          .map(c => c.name);
        const fallbackNames = ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Denis Villeneuve", "Ridley Scott", "James Cameron", "Quentin Tarantino"]
          .filter(n => n !== correct);
        const wrongPool = [...new Set([...otherDirectors, ...fallbackNames])].filter(n => n !== correct);
        for (let i = wrongPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [wrongPool[i], wrongPool[j]] = [wrongPool[j], wrongPool[i]];
        }
        pool.push({ q: `Who directed "${m.title}"?`, correct, wrongs: wrongPool.slice(0, 3) });
      }
    }

    // Composer question (from credits)
    if (m.credits && m.credits.crew) {
      const composer = m.credits.crew.find(c => c.job === "Original Music Composer" || c.job === "Music");
      if (composer) {
        const correct = composer.name;
        const fallbackComposers = ["Hans Zimmer", "John Williams", "Danny Elfman", "Howard Shore", "Alexandre Desplat", "Ludwig Göransson", "Michael Giacchino"]
          .filter(n => n !== correct);
        for (let i = fallbackComposers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fallbackComposers[i], fallbackComposers[j]] = [fallbackComposers[j], fallbackComposers[i]];
        }
        pool.push({ q: `Who composed the music for "${m.title}"?`, correct, wrongs: fallbackComposers.slice(0, 3) });
      }
    }

    // Shuffle pool and pick 3
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const selected = pool.slice(0, 3);
    for (const item of selected) {
      // Shuffle options
      const options = [item.correct, ...item.wrongs.slice(0, 3)];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      questions.push({ question: item.q, options, correctAnswer: item.correct });
    }

    return questions;
  }

  function populateTriviaFace() {
    if (!cubeMovieData) return;

    const cached = getTriviaCache(cubeMovieData.id);
    if (cached) {
      triviaQuestions = cached.questions;
    } else {
      triviaQuestions = generateTriviaQuestions(cubeMovieData);
      if (triviaQuestions.length > 0) {
        setTriviaCache(cubeMovieData.id, triviaQuestions);
      }
    }

    triviaIndex = 0;
    triviaScore = 0;
    triviaAnswered = false;

    if (triviaQuestions.length === 0) {
      const section = document.getElementById("cubeTriviaSection");
      if (section) section.innerHTML = '<h3 class="section-title">🧠 Movie Trivia</h3><p style="color: var(--muted-silver); text-align: center; margin-top: 40px;">Not enough data to generate trivia for this movie.</p>';
      return;
    }

    renderTriviaQuestion();
  }

  function renderTriviaQuestion() {
    const progressEl = document.getElementById("cubeTriviaProgress");
    const questionEl = document.getElementById("cubeTriviaQuestion");
    const optionsEl = document.getElementById("cubeTriviaOptions");
    const scoreEl = document.getElementById("cubeTriviaScore");
    if (!progressEl || !questionEl || !optionsEl || !scoreEl) return;

    // Progress dots
    progressEl.innerHTML = triviaQuestions.map((_, i) => {
      let cls = "cube-trivia-dot";
      if (i === triviaIndex) cls += " active";
      return `<span class="${cls}" data-idx="${i}"></span>`;
    }).join("");

    const q = triviaQuestions[triviaIndex];
    questionEl.textContent = q.question;

    optionsEl.innerHTML = q.options.map((opt, i) =>
      `<button class="cube-trivia-option" data-idx="${i}">${opt}</button>`
    ).join("");

    scoreEl.textContent = `Score: ${triviaScore} / ${triviaQuestions.length}`;
    triviaAnswered = false;
  }

  function handleTriviaAnswer(btn) {
    if (triviaAnswered) return;
    triviaAnswered = true;

    const q = triviaQuestions[triviaIndex];
    const selected = btn.textContent;
    const isCorrect = selected === q.correctAnswer;

    // Mark all buttons as answered
    const optionsEl = document.getElementById("cubeTriviaOptions");
    optionsEl.querySelectorAll(".cube-trivia-option").forEach(b => {
      b.classList.add("cube-trivia-answered");
      if (b.textContent === q.correctAnswer) {
        b.classList.add("cube-trivia-correct");
      }
    });

    if (isCorrect) {
      triviaScore++;
      btn.classList.add("cube-trivia-correct");
    } else {
      btn.classList.add("cube-trivia-wrong");
    }

    // Update progress dot
    const dots = document.querySelectorAll("#cubeTriviaProgress .cube-trivia-dot");
    if (dots[triviaIndex]) {
      dots[triviaIndex].classList.remove("active");
      dots[triviaIndex].classList.add(isCorrect ? "correct" : "wrong");
    }

    // Update score
    const scoreEl = document.getElementById("cubeTriviaScore");
    if (scoreEl) scoreEl.textContent = `Score: ${triviaScore} / ${triviaQuestions.length}`;

    // Advance after delay
    setTimeout(() => {
      triviaIndex++;
      if (triviaIndex < triviaQuestions.length) {
        renderTriviaQuestion();
      } else {
        showTriviaResult();
      }
    }, 1200);
  }

  function showTriviaResult() {
    const section = document.getElementById("cubeTriviaSection");
    if (!section) return;

    const emoji = triviaScore === 3 ? "🏆" : triviaScore === 2 ? "⭐" : triviaScore === 1 ? "👍" : "😅";

    section.innerHTML = `
      <div class="cube-trivia-final">
        <h3 class="section-title">🧠 Trivia Complete!</h3>
        <div class="cube-trivia-final-score">${emoji} ${triviaScore} / ${triviaQuestions.length}</div>
        <div class="cube-trivia-final-label">${triviaScore === 3 ? "Perfect score!" : triviaScore === 2 ? "Well done!" : triviaScore === 1 ? "Not bad!" : "Better luck next time!"}</div>
        <button class="cube-trivia-retry" id="cubeTriviaRetry">🔄 Play Again</button>
      </div>
    `;

  }

  // ============================================
  // VENN COMPARE
  // ============================================

  function toggleVennCompareMode() {
    vennCompareMode = !vennCompareMode;
    const label = vennCompareMode ? "✕ Cancel Compare" : "🔀 Compare Actors";

    // Sync both toggle buttons (main cast face + all-cast overlay)
    ["cubeVennToggle", "cubeAllCastVennToggle"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) { btn.textContent = label; btn.classList.toggle("active", vennCompareMode); }
    });

    if (!vennCompareMode) {
      vennSelectedActors = [];
      document.querySelectorAll(".cube-venn-selected").forEach(el => {
        el.classList.remove("cube-venn-selected");
      });
      ["cubeVennLaunch", "cubeAllCastVennLaunch"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.hidden = true;
      });
    }
  }

  function toggleVennActorSelection(el) {
    const id = el.dataset.personId;
    const name = el.dataset.personName;
    const idx = vennSelectedActors.findIndex(a => a.id === id);

    if (idx >= 0) {
      vennSelectedActors.splice(idx, 1);
      el.classList.remove("cube-venn-selected");
    } else {
      if (vennSelectedActors.length >= 4) return;
      vennSelectedActors.push({ id, name });
      el.classList.add("cube-venn-selected");
    }

    // Sync both launch buttons
    ["cubeVennLaunch", "cubeAllCastVennLaunch"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.hidden = vennSelectedActors.length < 2;
        btn.textContent = `View Venn (${vennSelectedActors.length}) →`;
      }
    });
  }

  function launchVennFromCube() {
    if (vennSelectedActors.length < 2) return;
    // Store selected actors in the format venn.js expects
    const vennPeople = vennSelectedActors.map(a => ({
      id: parseInt(a.id),
      name: a.name
    }));
    localStorage.setItem("vennPeople", JSON.stringify(vennPeople));
    window.location.href = "venn.html";
  }

  // ============================================
  // EXPORTS
  // ============================================
  window.initMovieCube = initMovieCube;
  window.openMovieCube = openMovieCube;
  window.closeMovieCube = closeMovieCube;

})();