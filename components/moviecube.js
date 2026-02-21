// ============================================
// SHARED MOVIE CUBE COMPONENT
// Uses EXACT same class names as Results page for consistent styling
// Wrapped in IIFE to avoid variable conflicts
// ============================================

(function() {
  // Read API key at runtime
  function getApiKey() {
    return TMDB_API_KEY;
  }
  function getImgBase() {
    return TMDB_IMG;
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
  let triviaSessionResults = [];

  // orbit_trivia_stats — Persistent trivia performance tracking
  // Trivia stats come from shared trivia-stats.js (window.getTriviaStats, etc.)

  // Settings data for Discovery Dimensions
  let _movieSettingsData = null;
  let _movieSettingsLoading = false;

  async function getMovieSettings() {
    if (_movieSettingsData) return _movieSettingsData;
    if (_movieSettingsLoading) {
      return new Promise(resolve => {
        const check = setInterval(() => {
          if (_movieSettingsData || !_movieSettingsLoading) {
            clearInterval(check);
            resolve(_movieSettingsData);
          }
        }, 100);
      });
    }
    _movieSettingsLoading = true;
    try {
      const response = await fetch(OrbitUtils.ROOT + 'data/orbit-movie-settings.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      _movieSettingsData = await response.json();
    } catch (e) {
      console.warn('[MovieCube] Settings data not available:', e.message);
      _movieSettingsData = null;
    }
    _movieSettingsLoading = false;
    return _movieSettingsData;
  }

  // results.html, timeline.html, venn.html live in pages/
  const _pagesPrefix = OrbitUtils.ROOT + 'pages/';

  // Venn compare state
  let vennCompareMode = false;
  let vennSelectedActors = [];

  // DOM refs - Main popup
  let cubePoster, cubeTitle, cubeYear, cubeRating, cubeRuntime, cubeSynopsis, cubeGenres, cubeWhereToWatch;
  let cubeDirector, cubeCastGrid, cubeAllCastBtn;
  let cubeStatRuntime, cubeStatBudget, cubeStatRevenue, cubeStatPopularity, cubeStatVotes, cubeStatLanguage;
  let cubeProductionCompanies;
  let cubeTrailerBtn, cubeAnchorBtn, cubeSimilarBtn, cubeSimilarOverlay;
  let cubeShortlistBtn;

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
    cubeShortlistBtn = document.getElementById("shortlist-btn");
    // cubeAwards removed — awards now on Face 7

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
            <button class="cube-nav-btn active" data-face="1"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg> Poster</button>
            <button class="cube-nav-btn" data-face="2"><span class="og og-notepad"></span> Info</button>
            <button class="cube-nav-btn" data-face="3"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="8" r="3.5"/><path d="M19 21v-1.5c0-2-1.6-3.5-3.5-3.5h-7C6.6 16 5 17.5 5 19.5V21"/><circle cx="5" cy="9" r="2" opacity="0.5"/><circle cx="19" cy="9" r="2" opacity="0.5"/></svg> Cast</button>
            <button class="cube-nav-btn" data-face="4"><span class="og og-stats"></span> Stats</button>
            <button class="cube-nav-btn" data-face="5"><span class="og og-brain"></span> Trivia</button>
            <button class="cube-nav-btn" data-face="6" title="Nebula Impressions">✦ Nebula</button>
            <button class="cube-nav-btn cube-awards-nav" data-face="7" id="cubeAwardsNav" style="display:none"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"/></svg> Awards</button>
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
                  <div class="cube-dimensions" id="cubeDimensions"></div>
                  <div class="where-to-watch" id="cubeWhereToWatch"></div>
                </div>
              </div>

              <!-- FACE 3: CAST -->
              <div class="cube-face face-back" data-face="3">
                <div class="cast-section">
                  <h3 class="section-title"><span class="og og-film"></span> Director</h3>
                  <div class="director-info" id="cubeDirectorInfo"></div>
                  <h3 class="section-title"><span class="og og-people"></span> Top Cast</h3>
                  <div class="cast-grid" id="cubeCastGrid"></div>
                  <button class="all-cast-btn" id="cubeAllCastBtn">View All Cast →</button>
                  <div class="cube-venn-bar">
                    <button class="cube-venn-toggle" id="cubeVennToggle"><span class="og og-shuffle"></span> Compare Actors</button>
                    <button class="cube-venn-launch" id="cubeVennLaunch" hidden>View Venn →</button>
                  </div>
                </div>
              </div>
              
              <!-- FACE 4: STATS -->
              <div class="cube-face face-left" data-face="4">
                <div class="stats-section">
                  <h3 class="section-title"><span class="og og-stats"></span> Statistics</h3>
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

              <!-- FACE 5: TRIVIA (shares position with face-right) -->
              <div class="cube-face face-trivia" data-face="5">
                <div class="cube-trivia-section" id="cubeTriviaSection">
                  <h3 class="section-title"><span class="og og-brain"></span> Movie Trivia</h3>
                  <div class="cube-trivia-progress" id="cubeTriviaProgress"></div>
                  <div class="cube-trivia-question" id="cubeTriviaQuestion"></div>
                  <div class="cube-trivia-options" id="cubeTriviaOptions"></div>
                  <div class="cube-trivia-score" id="cubeTriviaScore"></div>
                </div>
              </div>

              <!-- FACE 6: NEBULA (shares position with face-left) -->
              <div class="cube-face face-nebula" data-face="6">
                <!-- Header -->
                <div class="nebula-header">
                  <span class="nebula-title">NEBULA IMPRESSIONS</span>
                  <span class="nebula-source-badge" id="nebula-source-badge">✦ Orbit Impressions</span>
                </div>

                <!-- Threshold progress bar -->
                <div class="nebula-threshold-bar">
                  <div class="nebula-threshold-fill" id="nebula-threshold-fill"></div>
                  <span class="nebula-threshold-text" id="nebula-threshold-text">0 / 50 reviews</span>
                </div>

                <!-- Nebula cloud area -->
                <div class="nebula-cloud" id="nebula-cloud">
                  <!-- Gas clouds (background) -->
                  <div class="nebula-gas gas-1"></div>
                  <div class="nebula-gas gas-2"></div>
                  <div class="nebula-gas gas-3"></div>
                  <div class="nebula-gas gas-4"></div>

                  <!-- Dust particles -->
                  <div class="nebula-dust" id="nebula-dust"></div>

                  <!-- Movie title (center) -->
                  <div class="nebula-movie-title" id="nebula-movie-title"></div>

                  <!-- Floating words container -->
                  <div class="nebula-words" id="nebula-words"></div>
                </div>

                <!-- User input strip -->
                <div class="nebula-input-strip">
                  <label class="nebula-input-label">Write your 5-word impression:</label>
                  <div class="nebula-word-slots">
                    <input type="text" class="nebula-word-input" maxlength="15" placeholder="..." data-slot="1">
                    <input type="text" class="nebula-word-input" maxlength="15" placeholder="..." data-slot="2">
                    <input type="text" class="nebula-word-input" maxlength="15" placeholder="..." data-slot="3">
                    <input type="text" class="nebula-word-input" maxlength="15" placeholder="..." data-slot="4">
                    <input type="text" class="nebula-word-input" maxlength="15" placeholder="..." data-slot="5">
                  </div>
                  <button class="nebula-submit-btn" id="nebula-submit-btn" disabled>
                    LAUNCH INTO NEBULA ✦
                  </button>
                </div>

                <!-- Review feed -->
                <div class="nebula-review-feed" id="nebula-review-feed">
                  <!-- Reviews will be populated here -->
                </div>
              </div>

              <!-- FACE 7: AWARDS (shares position with face-back) -->
              <div class="cube-face face-awards" data-face="7">
                <div class="awards-section" id="cubeAwardsSection">
                  <div class="awards-face-content" id="cubeAwardsContent">
                    <!-- Content populated dynamically -->
                  </div>
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
              <button class="shortlist-btn not-added" id="shortlist-btn" title="Add to Shortlist">
                <span class="shortlist-icon">☆</span>
                <span class="shortlist-label">Shortlist</span>
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
            <button class="cube-venn-toggle" id="cubeAllCastVennToggle"><span class="og og-shuffle"></span> Compare Actors</button>
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
        // If on nebula/trivia face, go back to face 1
        if (cubeTrailerOverlay && !cubeTrailerOverlay.hidden) {
          closeTrailer();
        } else if (cubeSimilarOverlay && !cubeSimilarOverlay.hidden) {
          closeSimilarPanel();
        } else if (cubeAllCastOverlay && !cubeAllCastOverlay.hidden) {
          closeAllCast();
        } else if (currentFace === 5 || currentFace === 6) {
          rotateCube(1); // Go back to poster face
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
        window.location.href = `${_pagesPrefix}results.html?${params}`;
      }
    });
    
    // Similar movies toggle
    cubeSimilarBtn?.addEventListener("click", openSimilarPanel);

    // Shortlist button
    cubeShortlistBtn?.addEventListener("click", handleShortlistClick);

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
        populateTriviaFace();
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

    // Close People Cube if open (mutual exclusion)
    if (typeof closePeopleCube === 'function') closePeopleCube();

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
      updateShortlistButton();

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
    // Stop nebula physics if running
    stopNebulaPhysics();
    cubeMovieData = null;
  }

  function rotateCube(faceNum) {
    const prevFace = currentFace;
    currentFace = faceNum;

    // All faces (1-7) now rotate the 3D cube
    if (cube) {
      cube.dataset.face = faceNum.toString();
    }

    // Handle nebula face navigation
    if (faceNum === 6 && prevFace !== 6) {
      if (cubeMovieData) {
        loadNebulaFace(cubeMovieData.id, cubeMovieData.title);
      }
    } else if (prevFace === 6 && faceNum !== 6) {
      stopNebulaPhysics();
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

    // Discovery Dimensions
    populateDimensions(cubeMovieData.id);

    // Awards face — show nav button only if movie has awards
    populateAwardsFace(cubeMovieData.id);
  }

  // ============================================
  // DISCOVERY DIMENSIONS (Settings metadata)
  // ============================================

  function createLocationSVG() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  function createTimeSVG() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }

  function createThemeSVG() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }

  function createBasedOnSVG() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  }

  async function populateDimensions(movieId) {
    const container = document.getElementById('cubeDimensions');
    if (!container) return;
    container.innerHTML = '';

    const id = String(movieId);

    const settings = await getMovieSettings();
    if (!settings?.movies?.[id]) return;

    const movie = settings.movies[id];
    const chips = [];

    // Location
    if (movie.location?.coordinates?.length > 0) {
      const locations = movie.location.coordinates
        .slice(0, 3)
        .map(c => c.label)
        .filter(Boolean);
      if (locations.length > 0) {
        chips.push({ icon: createLocationSVG(), items: locations, type: 'location' });
      }
    }

    // Time period
    const timeParts = [];
    if (movie.time_period?.era_labels?.length > 0) {
      timeParts.push(...movie.time_period.era_labels.slice(0, 2));
    }
    if (movie.time_period?.decades?.length > 0 && timeParts.length === 0) {
      timeParts.push(...movie.time_period.decades.slice(0, 2));
    }
    if (movie.time_period?.setting_type === 'near_future') {
      timeParts.push('Near Future');
    } else if (movie.time_period?.setting_type === 'far_future') {
      timeParts.push('Far Future');
    }
    if (timeParts.length > 0) {
      chips.push({ icon: createTimeSVG(), items: timeParts, type: 'time' });
    }

    // Themes — prefer normalised names
    const themeList = movie.themes_normalised?.length > 0 ? movie.themes_normalised : movie.themes;
    if (themeList?.length > 0) {
      chips.push({ icon: createThemeSVG(), items: themeList.slice(0, 3), type: 'theme' });
    }

    // Based on — data is an object { type, detail, source }
    const basedOnType = typeof movie.based_on === 'object' ? movie.based_on?.type : movie.based_on;
    if (basedOnType && basedOnType !== 'original') {
      const basedOnLabels = {
        'novel': 'Based on Novel', 'true_story': 'True Story',
        'sequel': 'Sequel', 'prequel': 'Prequel',
        'comic': 'Based on Comic', 'play': 'Based on Play',
        'video_game': 'Based on Video Game', 'short_story': 'Based on Short Story',
        'remake': 'Remake', 'spin-off': 'Spin-off'
      };
      chips.push({ icon: createBasedOnSVG(), items: [basedOnLabels[basedOnType] || basedOnType], type: 'based-on' });
    }

    if (chips.length === 0) return;

    chips.forEach(chip => {
      const row = document.createElement('div');
      row.className = `dimension-row dimension-${chip.type}`;
      row.innerHTML = `
        <span class="dimension-icon">${chip.icon}</span>
        <span class="dimension-text">${chip.items.join(' \u00B7 ')}</span>
      `;
      container.appendChild(row);
    });
  }

  // ============================================
  // AWARDS FACE (Face 7)
  // ============================================

  function getAwardGlyphSVG(festival, size, isWinner) {
    const ringColor = isWinner ? '#00d9ff' : '#64748b';
    const strokeColor = isWinner ? '#ffd700' : '#94a3b8';
    const sw = size <= 32 ? 3 : size <= 48 ? 2.5 : 2;
    const rw = size <= 32 ? 4 : size <= 48 ? 2.5 : 2;

    const glyphs = {
      'Oscar': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="50" cy="20" rx="5" ry="6"/>
          <path d="M38 32 Q50 28 62 32"/>
          <path d="M38 32 L38 38 Q40 44 52 42"/>
          <path d="M62 32 L62 38 Q60 44 48 42"/>
          <line x1="50" y1="26" x2="50" y2="50"/>
          <line x1="46" y1="40" x2="54" y2="40"/>
          <path d="M38 38 L40 56 Q50 62 60 56 L62 38"/>
          <ellipse cx="50" cy="74" rx="12" ry="4"/>
          <path d="M36 78 L36 88 Q50 92 64 88 L64 78"/>
        </g>
      </svg>`,

      'Cannes': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 85 Q48 70 50 55 Q52 40 50 12"/>
          <path d="M50 55 Q44 54 35 58 M50 50 Q42 48 30 52 M50 45 Q40 42 26 44 M50 40 Q40 36 24 36 M50 35 Q42 30 28 28 M50 30 Q44 24 34 20 M50 25 Q46 20 40 14 M50 20 Q48 16 46 10"/>
          <path d="M50 55 Q56 54 65 58 M50 50 Q58 48 70 52 M50 45 Q60 42 74 44 M50 40 Q60 36 76 36 M50 35 Q58 30 72 28 M50 30 Q56 24 66 20 M50 25 Q54 20 60 14 M50 20 Q52 16 54 10"/>
          <rect x="40" y="85" width="20" height="8" rx="1"/>
        </g>
      </svg>`,

      'Venice': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M72 38 Q78 34 76 28 Q72 30 70 28 Q72 24 68 22 Q66 26 64 24 Q66 20 62 18 Q60 22 58 20 Q58 16 54 16 Q54 20 52 20"/>
          <path d="M72 38 Q76 42 78 46 L82 48 Q84 46 86 48"/>
          <path d="M78 46 Q76 50 72 52"/>
          <circle cx="76" cy="42" r="2"/>
          <path d="M70 34 Q72 30 68 32"/>
          <path d="M52 20 Q44 22 38 28 Q32 34 30 44 L28 58"/>
          <path d="M72 52 Q66 56 58 58 Q50 60 42 58 L28 58"/>
          <path d="M58 58 L60 68 Q62 72 58 74"/>
          <path d="M48 58 L46 72 Q44 76 48 78"/>
          <path d="M32 58 L30 72 Q28 76 32 78"/>
          <path d="M28 56 Q24 62 22 72 Q20 76 24 78"/>
          <path d="M28 54 Q20 50 18 44 Q20 42 22 44"/>
          <path d="M42 44 Q38 36 42 28 Q48 32 56 30"/>
          <path d="M42 28 Q46 22 52 24"/>
          <path d="M44 32 Q48 28 54 28"/>
          <rect x="16" y="82" width="68" height="6" rx="1"/>
        </g>
      </svg>`,

      'Berlin': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="40" cy="16" r="4"/>
          <circle cx="60" cy="16" r="4"/>
          <ellipse cx="50" cy="24" rx="12" ry="10"/>
          <ellipse cx="50" cy="28" rx="5" ry="4"/>
          <ellipse cx="50" cy="26" rx="2" ry="1.5"/>
          <circle cx="44" cy="22" r="1.5"/>
          <circle cx="56" cy="22" r="1.5"/>
          <path d="M47 30 Q50 32 53 30"/>
          <path d="M38 32 Q32 40 32 52 L32 70"/>
          <path d="M62 32 Q68 40 68 52 L68 70"/>
          <path d="M32 70 Q50 78 68 70"/>
          <path d="M32 42 Q26 40 22 44 L18 52"/>
          <path d="M68 42 Q74 40 78 44 L82 52"/>
          <ellipse cx="18" cy="54" rx="4" ry="3"/>
          <ellipse cx="82" cy="54" rx="4" ry="3"/>
          <path d="M38 70 L38 82 Q38 86 44 86"/>
          <path d="M62 70 L62 82 Q62 86 56 86"/>
          <ellipse cx="44" cy="86" rx="6" ry="3"/>
          <ellipse cx="56" cy="86" rx="6" ry="3"/>
        </g>
      </svg>`,

      'BAFTA': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 10 Q68 10 72 26 L72 38 Q72 54 50 62 Q28 54 28 38 L28 26 Q32 10 50 10 Z"/>
          <path d="M36 28 Q32 32 34 40 Q38 44 44 40 Q46 34 42 28 Q38 26 36 28 Z"/>
          <path d="M64 28 Q68 32 66 40 Q62 44 56 40 Q54 34 58 28 Q62 26 64 28 Z"/>
          <path d="M50 32 L50 46"/>
          <path d="M46 46 L50 52 L54 46"/>
          <path d="M32 24 Q38 20 46 24"/>
          <path d="M68 24 Q62 20 54 24"/>
          <path d="M30 40 Q34 44 38 42"/>
          <path d="M70 40 Q66 44 62 42"/>
          <line x1="50" y1="62" x2="50" y2="74"/>
          <path d="M34 78 L34 92 L66 92 L66 78 Z"/>
          <path d="M34 78 L42 72 L74 72 L66 78"/>
          <path d="M66 78 L74 72 L74 86 L66 92"/>
        </g>
      </svg>`,

      'Golden Globe': `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
        <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="50" cy="34" r="20"/>
          <ellipse cx="50" cy="34" rx="20" ry="7"/>
          <ellipse cx="50" cy="24" rx="16" ry="4"/>
          <ellipse cx="50" cy="44" rx="16" ry="4"/>
          <ellipse cx="50" cy="34" rx="7" ry="20"/>
          <ellipse cx="50" cy="34" rx="14" ry="20"/>
          <path d="M36 52 Q50 58 64 52"/>
          <path d="M46 56 L46 66 L54 66 L54 56"/>
          <path d="M36 66 L36 72 L64 72 L64 66 Z"/>
          <ellipse cx="50" cy="76" rx="16" ry="4"/>
          <path d="M34 76 L34 84 Q34 88 50 88 Q66 88 66 84 L66 76"/>
          <ellipse cx="50" cy="88" rx="16" ry="4"/>
        </g>
      </svg>`
    };

    // Aliases
    glyphs['Academy Awards'] = glyphs['Oscar'];

    // Fallback: generic star glyph
    const fallback = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" stroke="${ringColor}" stroke-width="${rw}" fill="none"/>
      <g stroke="${strokeColor}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 15 L58 38 L82 38 L63 52 L70 76 L50 62 L30 76 L37 52 L18 38 L42 38 Z"/>
      </g>
    </svg>`;

    return glyphs[festival] || fallback;
  }

  function populateAwardsFace(movieId) {
    const navBtn = document.getElementById('cubeAwardsNav');
    const content = document.getElementById('cubeAwardsContent');
    if (!content) return;

    // Enhanced debug logging
    console.log('[Awards Debug] Called with movieId:', movieId, 'type:', typeof movieId);
    console.log('[Awards Debug] PRESTIGE_DATABASE exists:', typeof window.PRESTIGE_DATABASE !== 'undefined');
    console.log('[Awards Debug] getMovieAwards exists:', typeof window.getMovieAwards === 'function');

    if (typeof window.getMovieAwards === 'function') {
      console.log('[Awards Debug] getMovieAwards(155):', window.getMovieAwards(155));
      console.log('[Awards Debug] getMovieAwards("155"):', window.getMovieAwards("155"));
      console.log('[Awards Debug] getMovieAwards(movieId):', window.getMovieAwards(movieId));
    }

    if (typeof window.PRESTIGE_DATABASE !== 'undefined') {
      console.log('[Awards Debug] Direct lookup [155]:', window.PRESTIGE_DATABASE[155]);
      console.log('[Awards Debug] Direct lookup ["155"]:', window.PRESTIGE_DATABASE["155"]);
      console.log('[Awards Debug] Direct lookup [movieId]:', window.PRESTIGE_DATABASE[movieId]);
    }

    let allAwards = [];

    // Source A: PRESTIGE_DATABASE (by movie ID)
    // Uses "name" field for festival, all entries are wins
    // FIX: Handle both numeric and string IDs
    const numId = Number(movieId);
    const strId = String(movieId);

    let movieAwards = null;
    if (typeof window.getMovieAwards === 'function') {
      movieAwards = window.getMovieAwards(numId) || window.getMovieAwards(strId);
      console.log('[Awards Debug] Retrieved via getMovieAwards:', movieAwards);
    }
    if (!movieAwards && typeof window.PRESTIGE_DATABASE !== 'undefined') {
      const entry = window.PRESTIGE_DATABASE[numId] || window.PRESTIGE_DATABASE[strId];
      if (entry?.awards?.length > 0) {
        movieAwards = entry.awards;
        console.log('[Awards Debug] Retrieved via direct lookup:', movieAwards);
      }
    }

    // TEMPORARY FIX: Hardcoded Dark Knight award (ID 155 missing from awards.js)
    if (!movieAwards && (numId === 155 || strId === "155")) {
      console.log('[Awards Debug] ⚠️ ID 155 not in database - injecting hardcoded Dark Knight award');
      movieAwards = [
        { name: "Oscar", year: 2009, category: "Best Supporting Actor", person: "Heath Ledger", won: true }
      ];
    }

    // Normalize field names
    if (movieAwards) {
      movieAwards.forEach(a => {
        allAwards.push({
          festival: a.festival || a.name || 'Unknown',
          year: a.year,
          category: a.category,
          won: a.won !== undefined ? a.won : true, // PRESTIGE_DATABASE entries are all wins
          person: a.person || null
        });
      });
    }

    // Source B: CSV-loaded data (if available)
    // Check for any CSV awards data in global scope
    if (typeof window.csvAwardsData !== 'undefined' && window.csvAwardsData) {
      // Merge CSV data if available
      // This would need to be implemented based on actual CSV data structure
    }

    // Deduplicate awards (same festival + category + year)
    const uniqueAwards = [];
    const seen = new Set();
    allAwards.forEach(award => {
      const key = `${award.festival}|${award.category}|${award.year}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueAwards.push(award);
      }
    });

    if (uniqueAwards.length === 0) {
      if (navBtn) navBtn.style.display = 'none';
      content.innerHTML = '';
      return;
    }

    // Show nav button with SVG glyph
    if (navBtn) {
      navBtn.style.display = '';
      navBtn.innerHTML = `${getAwardGlyphSVG('Oscar', 14, true)} Awards`;
    }

    // Build header with movie title
    const movieTitle = cubeMovieData?.title || '';
    const winsCount = uniqueAwards.filter(a => a.won).length;
    const nomsCount = uniqueAwards.filter(a => !a.won).length;
    const festivals = [...new Set(uniqueAwards.map(a => a.festival))];

    let summaryText = '';
    if (winsCount > 0 && nomsCount > 0) {
      summaryText = `${winsCount} win${winsCount !== 1 ? 's' : ''}, ${nomsCount} nomination${nomsCount !== 1 ? 's' : ''} · ${festivals.length} festival${festivals.length !== 1 ? 's' : ''}`;
    } else if (winsCount > 0) {
      summaryText = `${winsCount} award${winsCount !== 1 ? 's' : ''} · ${festivals.length} festival${festivals.length !== 1 ? 's' : ''}`;
    } else {
      summaryText = `${nomsCount} nomination${nomsCount !== 1 ? 's' : ''} · ${festivals.length} festival${festivals.length !== 1 ? 's' : ''}`;
    }

    const isCompact = uniqueAwards.length <= 3;

    // Smart header glyph: use specific festival if only one, else default to Oscar
    const headerFestival = festivals.length === 1 ? festivals[0] : 'Oscar';
    const headerGlyph = getAwardGlyphSVG(headerFestival, 48, true);

    content.innerHTML = `
      <div class="awards-face-header">
        <div class="awards-header-glyph">${headerGlyph}</div>
        <h3 class="awards-face-title">Awards & Recognition</h3>
        <div class="awards-movie-name">${movieTitle}</div>
      </div>
      <div class="awards-summary">${summaryText}</div>
      <div class="awards-list ${isCompact ? 'awards-compact' : ''}" id="cubeAwardsList"></div>
    `;

    const list = document.getElementById('cubeAwardsList');
    if (!list) return;

    if (isCompact) {
      // Compact mode: no festival headers, festival name in each entry
      uniqueAwards.forEach(award => {
        const isWin = award.won === true || award.won === 'true' || award.won === 'True';
        const glyph = getAwardGlyphSVG(award.festival, 40, isWin);
        const personText = award.person ? ` — ${award.person}` : '';

        const entry = document.createElement('div');
        entry.className = `award-entry-compact ${isWin ? 'won' : 'nominated'}`;
        entry.innerHTML = `
          <div class="award-compact-glyph">${glyph}</div>
          <div class="award-compact-festival">${award.festival}</div>
          <div class="award-compact-category">${award.category}${personText}</div>
          <div class="award-compact-meta">
            <span class="award-compact-year">${award.year || ''}</span>
            <span class="award-compact-result">${isWin ? 'WON' : 'NOM'}</span>
          </div>
        `;
        list.appendChild(entry);
      });
    } else {
      // Full mode: keep existing festival-grouped layout
      const byFestival = {};
      uniqueAwards.forEach(a => {
        const fest = a.festival || 'Other';
        if (!byFestival[fest]) byFestival[fest] = [];
        byFestival[fest].push(a);
      });

      Object.entries(byFestival).forEach(([festival, items]) => {
        const group = document.createElement('div');
        group.className = 'awards-festival-group';

        const headerGlyph = getAwardGlyphSVG(festival, 24, true);
        const header = document.createElement('div');
        header.className = 'awards-festival-header';
        header.innerHTML = `
          <span class="awards-festival-icon">${headerGlyph}</span>
          <span class="awards-festival-name">${festival}</span>
        `;
        group.appendChild(header);

        items.forEach(award => {
          const row = document.createElement('div');
          row.className = `awards-entry ${award.won ? 'awards-won' : 'awards-nom'}`;
          const status = award.won ? 'WON' : 'NOM';
          const person = award.person ? ` — ${award.person}` : '';

          row.innerHTML = `
            <div class="award-details">
              <span class="awards-status">${status}</span>
              <span class="awards-category">${award.category || ''}${person}</span>
              <span class="awards-year">${award.year || ''}</span>
            </div>
          `;
          group.appendChild(row);
        });

        list.appendChild(group);
      });
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
    if (toggleBtn) toggleBtn.innerHTML = '<span class="og og-shuffle"></span> Compare Actors';
    if (launchBtn) launchBtn.hidden = true;

    if (cubeDirector) {
      const director = credits.crew?.find(c => c.job === "Director");
      if (director) {
        const photo = director.profile_path ? `${getImgBase()}w92${director.profile_path}` : DEFAULT_AVATAR;
        cubeDirector.innerHTML = `
          <div class="clickable-person director-clickable" data-person-id="${director.id}" data-person-name="${director.name}">
            <img class="director-photo" src="${photo}" alt="${director.name}" onerror="this.src='${DEFAULT_AVATAR}'">
            <span class="director-name">${director.name}<a href="people-profile.html?id=${director.id}" class="mc-profile-link" title="View Profile" onclick="event.stopPropagation()">☆</a></span>
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
            <div class="cast-name">${actor.name}<a href="people-profile.html?id=${actor.id}" class="mc-profile-link" title="View Profile" onclick="event.stopPropagation()">☆</a></div>
          </div>
        `;
      }).join("");

      // Log encountered cast
      if (window.OrbitEncounters) {
        cast.forEach(actor => {
          window.OrbitEncounters.logEncounter({
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
            known_for_department: 'Acting'
          }, 'moviecube');
        });
      }
    }

    // Log encountered director
    if (window.OrbitEncounters) {
      const director = credits.crew?.find(c => c.job === "Director");
      if (director) {
        window.OrbitEncounters.logEncounter({
          id: director.id,
          name: director.name,
          profile_path: director.profile_path,
          known_for_department: 'Directing'
        }, 'moviecube');
      }
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

    // Log encounter on click
    if (window.OrbitEncounters && id && name) {
      window.OrbitEncounters.logEncounter({
        id: parseInt(id),
        name: name,
        profile_path: null,
        known_for_department: null
      }, 'moviecube');
    }

    if (onPersonClick) {
      onPersonClick(id, name);
    } else {
      window.location.href = `${_pagesPrefix}timeline.html?id=${id}&name=${encodeURIComponent(name)}`;
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
    if (toggleBtn) { toggleBtn.innerHTML = '<span class="og og-shuffle"></span> Compare Actors'; toggleBtn.classList.remove("active"); }
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
      pool.push({ q: `What was the budget of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3), category: "production" });
    }

    // Revenue question
    if (m.revenue && m.revenue > 0) {
      const rev = m.revenue / 1000000;
      const correct = rev >= 1000 ? `$${(rev / 1000).toFixed(1)}B` : `$${rev.toFixed(0)}M`;
      const variants = [rev * 0.3, rev * 0.6, rev * 2.5].map(v =>
        v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${Math.round(v)}M`
      ).filter(w => w !== correct);
      pool.push({ q: `How much did "${m.title}" earn at the box office?`, correct, wrongs: variants.slice(0, 3), category: "production" });
    }

    // Runtime question
    if (m.runtime) {
      const correct = `${m.runtime} minutes`;
      const wrongs = [
        `${m.runtime + 23} minutes`,
        `${Math.max(60, m.runtime - 31)} minutes`,
        `${m.runtime + 47} minutes`
      ].filter(w => w !== correct);
      pool.push({ q: `What is the runtime of "${m.title}"?`, correct, wrongs: wrongs.slice(0, 3), category: "production" });
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
      pool.push({ q: `What is the tagline of "${m.title}"?`, correct, wrongs: fakeTaglines.slice(0, 3), category: "tagline" });
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
      pool.push({ q: `What is the original language of "${m.title}"?`, correct, wrongs: others.slice(0, 3), category: "production" });
    }

    // Release year question
    if (m.release_date) {
      const year = parseInt(m.release_date.split("-")[0]);
      const correct = `${year}`;
      const wrongs = [`${year - 2}`, `${year + 1}`, `${year - 4}`].filter(w => w !== correct);
      pool.push({ q: `What year was "${m.title}" released?`, correct, wrongs: wrongs.slice(0, 3), category: "timeline" });
    }

    // Production country question
    if (m.production_countries && m.production_countries.length > 0) {
      const correct = m.production_countries[0].name;
      const fakeCountries = ["United States of America", "United Kingdom", "France", "Germany", "Japan", "South Korea", "Canada", "Australia", "India", "Italy"].filter(c => c !== correct);
      for (let i = fakeCountries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fakeCountries[i], fakeCountries[j]] = [fakeCountries[j], fakeCountries[i]];
      }
      pool.push({ q: `Which country produced "${m.title}"?`, correct, wrongs: fakeCountries.slice(0, 3), category: "production" });
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
        pool.push({ q: `Who directed "${m.title}"?`, correct, wrongs: wrongPool.slice(0, 3), category: "crew" });
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
        pool.push({ q: `Who composed the music for "${m.title}"?`, correct, wrongs: fallbackComposers.slice(0, 3), category: "crew" });
      }
    }

    // Cinematographer question (from credits)
    if (m.credits && m.credits.crew) {
      const dp = m.credits.crew.find(c => c.job === "Director of Photography");
      if (dp) {
        const correct = dp.name;
        const fallbackDPs = ["Roger Deakins", "Emmanuel Lubezki", "Robert Richardson", "Janusz Kamiński", "Hoyte van Hoytema", "Bradford Young", "Greig Fraser", "Bruno Delbonnel", "Vittorio Storaro", "Wally Pfister", "Dariusz Wolski", "Matthew Libatique", "Rodrigo Prieto", "Linus Sandgren", "Ari Wegner"]
          .filter(n => n !== correct);
        for (let i = fallbackDPs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [fallbackDPs[i], fallbackDPs[j]] = [fallbackDPs[j], fallbackDPs[i]];
        }
        pool.push({ q: `Who was the cinematographer on "${m.title}"?`, correct, wrongs: fallbackDPs.slice(0, 3), category: "crew" });
      }
    }

    // Production Company question
    if (m.production_companies && m.production_companies.length > 0) {
      const correct = m.production_companies[0].name;
      const fallbackStudios = ["Warner Bros. Pictures", "Universal Pictures", "20th Century Studios", "Paramount Pictures", "Columbia Pictures", "Lionsgate", "A24", "New Line Cinema", "Miramax", "Focus Features", "MGM", "DreamWorks Pictures", "Searchlight Pictures", "Blumhouse Productions", "Legendary Entertainment"]
        .filter(s => s !== correct);
      for (let i = fallbackStudios.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fallbackStudios[i], fallbackStudios[j]] = [fallbackStudios[j], fallbackStudios[i]];
      }
      pool.push({ q: `Which studio produced "${m.title}"?`, correct, wrongs: fallbackStudios.slice(0, 3), category: "production" });
    }

    // Genre exclusion question
    if (m.genres && m.genres.length >= 2) {
      const movieGenreNames = m.genres.map(g => g.name);
      const allGenres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"];
      const notInMovie = allGenres.filter(g => !movieGenreNames.includes(g));
      if (notInMovie.length > 0) {
        for (let i = notInMovie.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [notInMovie[i], notInMovie[j]] = [notInMovie[j], notInMovie[i]];
        }
        const correct = notInMovie[0];
        // Wrongs are 3 genres the movie DOES have
        const wrongsFromMovie = [...movieGenreNames];
        for (let i = wrongsFromMovie.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [wrongsFromMovie[i], wrongsFromMovie[j]] = [wrongsFromMovie[j], wrongsFromMovie[i]];
        }
        pool.push({ q: `Which genre does "${m.title}" NOT belong to?`, correct, wrongs: wrongsFromMovie.slice(0, 3), category: "production" });
      }
    }

    // Collection / Franchise question
    if (m.belongs_to_collection && m.belongs_to_collection.name) {
      const correct = m.belongs_to_collection.name;
      const fallbackCollections = ["Marvel Cinematic Universe", "Star Wars Collection", "Harry Potter Collection", "The Lord of the Rings Collection", "James Bond Collection", "Fast & Furious Collection", "Jurassic Park Collection", "The Dark Knight Collection", "Pirates of the Caribbean Collection", "Mission: Impossible Collection", "Indiana Jones Collection", "Toy Story Collection", "The Hunger Games Collection", "Alien Collection", "Terminator Collection", "John Wick Collection"]
        .filter(c => c !== correct);
      for (let i = fallbackCollections.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fallbackCollections[i], fallbackCollections[j]] = [fallbackCollections[j], fallbackCollections[i]];
      }
      pool.push({ q: `"${m.title}" belongs to which film franchise?`, correct, wrongs: fallbackCollections.slice(0, 3), category: "production" });
    }

    // Cast size question
    if (m.credits && m.credits.cast && m.credits.cast.length >= 10) {
      const castLen = m.credits.cast.length;
      const bucket = Math.floor(castLen / 10) * 10;
      const correct = `${bucket}–${bucket + 10}`;
      const offsets = [-20, 20, 40].map(off => {
        const b = Math.max(0, bucket + off);
        return `${b}–${b + 10}`;
      }).filter(w => w !== correct);
      pool.push({ q: `Approximately how many credited cast members does "${m.title}" have?`, correct, wrongs: offsets.slice(0, 3), category: "production" });
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
      questions.push({ question: item.q, options, correctAnswer: item.correct, category: item.category || "general" });
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
    triviaSessionResults = [];

    const section = document.getElementById("cubeTriviaSection");
    if (!section) return;

    if (triviaQuestions.length === 0) {
      section.innerHTML = '<h3 class="section-title">Movie Trivia</h3><p style="color: var(--muted-silver); text-align: center; margin-top: 40px;">Not enough data to generate trivia for this movie.</p>';
      return;
    }

    const stats = getTriviaStats();
    const accuracy = getTriviaAccuracy();
    const alreadyCompleted = stats.moviesCompleted.includes(cubeMovieData.id);

    section.innerHTML = `
      <h3 class="section-title">Movie Trivia</h3>
      <div class="cube-trivia-stats-bar" id="cubeTriviaStatsBar">
        <div class="trivia-stat-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
          <span>${accuracy}%</span>
        </div>
        <div class="trivia-stat-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span>${stats.currentStreak}</span>
        </div>
        <div class="trivia-stat-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          <span>${stats.moviesQuizzed}</span>
        </div>
      </div>
      ${alreadyCompleted ? '<div class="cube-trivia-completed-badge">Completed — play again?</div>' : ''}
      <div class="cube-trivia-progress" id="cubeTriviaProgress"></div>
      <div class="cube-trivia-question" id="cubeTriviaQuestion"></div>
      <div class="cube-trivia-options" id="cubeTriviaOptions"></div>
      <div class="cube-trivia-score" id="cubeTriviaScore"></div>
    `;

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

    // Record stats
    const category = q.category || "general";
    triviaSessionResults.push({ category, isCorrect });
    const updatedStats = recordTriviaAnswer(category, isCorrect, 'movieCube');
    const statsBar = document.getElementById("cubeTriviaStatsBar");
    if (statsBar) {
      const pills = statsBar.querySelectorAll(".trivia-stat-pill span");
      if (pills[0]) pills[0].textContent = getTriviaAccuracy() + "%";
      if (pills[1]) pills[1].textContent = updatedStats.currentStreak;
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

    const total = triviaQuestions.length;
    const stats = recordTriviaRoundComplete('movie', cubeMovieData.id, triviaScore, total);
    const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
    const perfect = triviaScore === total;
    const label = perfect ? "Perfect score!" : triviaScore >= total * 0.66 ? "Well done!" : triviaScore >= total * 0.33 ? "Not bad!" : "Better luck next time!";

    const catMap = { production: "Production", crew: "Crew", tagline: "Tagline", timeline: "Timeline", general: "General" };
    const catAgg = {};
    for (const r of triviaSessionResults) {
      if (!catAgg[r.category]) catAgg[r.category] = { correct: 0, total: 0 };
      catAgg[r.category].total++;
      if (r.isCorrect) catAgg[r.category].correct++;
    }
    const catRows = Object.entries(catAgg).map(([cat, data]) => {
      const pct = Math.round((data.correct / data.total) * 100);
      const color = pct === 100 ? "#00ff88" : pct >= 50 ? "var(--accent-cyan)" : "var(--danger-red)";
      return `<div class="trivia-cat-row">
        <span class="trivia-cat-name">${catMap[cat] || cat}</span>
        <span class="trivia-cat-score" style="color:${color}">${data.correct}/${data.total}</span>
      </div>`;
    }).join("");

    section.innerHTML = `
      <div class="cube-trivia-final">
        <h3 class="section-title">Trivia Complete!</h3>
        <div class="cube-trivia-final-score">${triviaScore} / ${total}</div>
        <div class="cube-trivia-final-label">${label}</div>
        ${perfect ? '<div class="trivia-perfect-badge">★ PERFECT</div>' : ''}
        <div class="trivia-session-cats">${catRows}</div>
        <div class="trivia-lifetime-summary">
          <div class="trivia-lifetime-row"><span>Lifetime Accuracy</span><span class="trivia-lifetime-val">${accuracy}%</span></div>
          <div class="trivia-lifetime-row"><span>Answer Streak</span><span class="trivia-lifetime-val">${stats.currentStreak}</span></div>
          <div class="trivia-lifetime-row"><span>Best Streak</span><span class="trivia-lifetime-val">${stats.bestStreak}</span></div>
          <div class="trivia-lifetime-row"><span>Movies Quizzed</span><span class="trivia-lifetime-val">${stats.moviesQuizzed}</span></div>
          <div class="trivia-lifetime-row"><span>Perfect Rounds</span><span class="trivia-lifetime-val">${stats.perfectRounds}</span></div>
        </div>
        <button class="cube-trivia-retry">Play Again</button>
      </div>
    `;
  }

  // ============================================
  // VENN COMPARE
  // ============================================

  function toggleVennCompareMode() {
    vennCompareMode = !vennCompareMode;
    const label = vennCompareMode ? "✕ Cancel Compare" : '<span class="og og-shuffle"></span> Compare Actors';

    // Sync both toggle buttons (main cast face + all-cast overlay)
    ["cubeVennToggle", "cubeAllCastVennToggle"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) { btn.innerHTML = label; btn.classList.toggle("active", vennCompareMode); }
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
    window.location.href = `${_pagesPrefix}venn.html`;
  }

  // ============================================
  // NEBULA DATA CHECKS
  // ============================================

  // Nebula service module (loaded dynamically)
  let nebulaService = null;

  // Load nebula service module
  async function loadNebulaService() {
    if (!nebulaService) {
      try {
        // Try dynamic import first
        nebulaService = await import('./nebula-service.js');
      } catch (error) {
        console.warn('Dynamic import failed, checking for global nebula service:', error);
        // Fallback: check if loaded as script tag (functions on window)
        if (window.getMergedNebulaData && window.getTopWords && window.saveUserReview) {
          nebulaService = {
            getMergedNebulaData: window.getMergedNebulaData,
            getTopWords: window.getTopWords,
            saveUserReview: window.saveUserReview,
            getUserReviews: window.getUserReviews,
            calculateWordFrequencies: window.calculateWordFrequencies,
            clearUserReviews: window.clearUserReviews
          };
        } else {
          console.error('Nebula service not available');
        }
      }
    }
    return nebulaService;
  }

  // Cache nebula index in memory
  let nebulaIndexCache = null;
  let nebulaIndexFetchTime = null;
  const NEBULA_INDEX_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  // Resolve nebula-data path relative to project root
  const _nebulaDataPath = OrbitUtils.ROOT + 'data/nebula-data';

  /**
   * Check if nebula data is available for a movie
   * @param {number|string} movieId - The TMDB movie ID
   * @returns {Promise<boolean>} True if nebula data exists for this movie
   */
  async function checkNebulaAvailable(movieId) {
    try {
      // Check if we have a valid cached index
      const now = Date.now();
      if (nebulaIndexCache && nebulaIndexFetchTime && (now - nebulaIndexFetchTime < NEBULA_INDEX_CACHE_DURATION)) {
        // Use cached index
        return nebulaIndexCache.movies && nebulaIndexCache.movies.hasOwnProperty(String(movieId));
      }

      // Fetch the nebula index
      const response = await fetch(`${_nebulaDataPath}/index.json`);

      if (!response.ok) {
        console.warn('Nebula index not found');
        return false;
      }

      const index = await response.json();

      // Cache the index
      nebulaIndexCache = index;
      nebulaIndexFetchTime = now;

      // Check if movieId exists in the index
      return index.movies && index.movies.hasOwnProperty(String(movieId));

    } catch (error) {
      console.error('Error checking nebula availability:', error);
      return false;
    }
  }

  // ============================================
  // NEBULA FACE - RENDERING & PHYSICS
  // ============================================

  // Nebula state
  let nebulaData = null;
  let nebulaWords = [];
  let nebulaPhysicsRunning = false;
  let nebulaAnimationFrame = null;

  /**
   * Load and display the nebula face
   * @param {number|string} movieId - The TMDB movie ID
   * @param {string} movieTitle - The movie title
   */
  async function loadNebulaFace(movieId, movieTitle) {
    const service = await loadNebulaService();
    if (!service) {
      showNebulaError('Nebula service not available');
      return;
    }

    try {
      // Get merged nebula data (AI + user reviews)
      const data = await service.getMergedNebulaData(movieId);

      if (!data) {
        showNebulaError('No impressions yet — be the first!');
        initNebulaInput(movieId);
        return;
      }

      // Use cube movie title as fallback when AI data has no title
      if (!data.title && movieTitle) {
        data.title = movieTitle;
      }

      nebulaData = data;
      renderNebula(data);
      initNebulaInput(movieId);

    } catch (error) {
      console.error('Error loading nebula face:', error);
      showNebulaError('Failed to load nebula data');
    }
  }

  /**
   * Restore the nebula-cloud inner structure (gas clouds, dust, title, words).
   * Called before every render to undo any prior showNebulaError clobbering.
   */
  function restoreCloudStructure() {
    const cloudEl = document.getElementById('nebula-cloud');
    if (!cloudEl) return;
    cloudEl.innerHTML = `
      <div class="nebula-gas gas-1"></div>
      <div class="nebula-gas gas-2"></div>
      <div class="nebula-gas gas-3"></div>
      <div class="nebula-gas gas-4"></div>
      <div class="nebula-dust" id="nebula-dust"></div>
      <div class="nebula-movie-title" id="nebula-movie-title"></div>
      <div class="nebula-words" id="nebula-words"></div>
    `;
  }

  /**
   * Show error message in nebula cloud
   */
  function showNebulaError(message) {
    restoreCloudStructure();
    const cloudEl = document.getElementById('nebula-cloud');
    if (cloudEl) {
      // Overlay the error on top of the (now-empty) cloud
      const msgEl = document.createElement('div');
      msgEl.className = 'nebula-error-msg';
      msgEl.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#8892a6;z-index:5;';
      msgEl.innerHTML = `<p style="font-size:14px;margin:0;">${message}</p>`;
      cloudEl.appendChild(msgEl);
    }
  }

  /**
   * Render the nebula visualization
   * @param {Object} data - Merged nebula data
   */
  function renderNebula(data) {
    // Rebuild cloud children in case a prior error clobbered them
    restoreCloudStructure();

    // Update movie title
    const titleEl = document.getElementById('nebula-movie-title');
    if (titleEl) {
      titleEl.textContent = data.title ? data.title.toUpperCase() : '';
    }

    // Update source badge
    updateSourceBadge(data.userReviewCount, data.communityThreshold);

    // Update threshold bar
    updateThresholdBar(data.userReviewCount, data.communityThreshold);

    // Render dust particles
    renderDustParticles();

    // Get top 30 words (service should be loaded by now)
    if (!nebulaService) {
      console.error('Nebula service not loaded');
      return;
    }

    const topWords = nebulaService.getTopWords(data.wordFrequency, 30);

    // Render floating words
    renderFloatingWords(topWords, data.reviews);

    // Render review feed
    renderReviewFeed(data.reviews);

    // Start physics animation
    startNebulaPhysics();
  }

  /**
   * Update source badge based on user review count
   */
  function updateSourceBadge(userCount, threshold) {
    const badgeEl = document.getElementById('nebula-source-badge');
    if (!badgeEl) return;

    badgeEl.className = 'nebula-source-badge';

    if (userCount === 0) {
      badgeEl.textContent = '✦ Orbit Impressions';
      // Default purple style
    } else if (userCount < threshold) {
      const percentage = Math.round((userCount / threshold) * 100);
      badgeEl.textContent = `◐ ${percentage}% Community`;
      badgeEl.classList.add('mixed');
    } else {
      badgeEl.textContent = '★ Community Voices';
      badgeEl.classList.add('community');
    }
  }

  /**
   * Update threshold progress bar
   */
  function updateThresholdBar(userCount, threshold) {
    const fillEl = document.getElementById('nebula-threshold-fill');
    const textEl = document.getElementById('nebula-threshold-text');

    if (fillEl) {
      const percentage = Math.min(100, (userCount / threshold) * 100);
      fillEl.style.width = `${percentage}%`;
    }

    if (textEl) {
      textEl.textContent = `${userCount} / ${threshold} reviews`;
    }
  }

  /**
   * Render dust particles
   */
  function renderDustParticles() {
    const dustEl = document.getElementById('nebula-dust');
    if (!dustEl) return;

    dustEl.innerHTML = '';

    // Create 40 dust particles at random positions
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'nebula-dust-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 3}s`;
      dustEl.appendChild(particle);
    }
  }

  /**
   * Render floating words with physics
   */
  function renderFloatingWords(topWords, reviews) {
    const wordsEl = document.getElementById('nebula-words');
    if (!wordsEl) return;

    wordsEl.innerHTML = '';
    nebulaWords = [];

    if (!topWords || topWords.length === 0) return;

    // Get container dimensions
    const cloudEl = document.getElementById('nebula-cloud');
    if (!cloudEl) return;

    const rect = cloudEl.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Determine frequency tiers (quintiles)
    const counts = topWords.map(w => w[1]);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const range = maxCount - minCount;

    // Distribute words in a grid pattern for initial positions
    const cols = 6;
    const rows = Math.ceil(topWords.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    topWords.forEach(([word, count], index) => {
      // Calculate brightness tier (1-5)
      const normalizedCount = range > 0 ? (count - minCount) / range : 0.5;
      let tier = Math.ceil(normalizedCount * 5);
      if (tier === 0) tier = 1;

      // Determine if word is from user review
      const isUserWord = reviews.some(r =>
        r.source === 'user' && r.text.toLowerCase().includes(word.toLowerCase())
      );

      // Create word element
      const wordEl = document.createElement('div');
      wordEl.className = `nebula-word brightness-${tier}`;
      if (isUserWord) wordEl.classList.add('user-word');
      wordEl.textContent = word;
      wordEl.dataset.word = word;

      // Grid position with random offset
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.5;
      const y = row * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.5;

      // Random velocity
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;

      wordsEl.appendChild(wordEl);

      // Store word physics state
      nebulaWords.push({
        el: wordEl,
        x, y, vx, vy,
        width: 0, height: 0 // Will be measured after render
      });
    });

    // Measure word dimensions after rendering
    setTimeout(() => {
      nebulaWords.forEach(word => {
        const rect = word.el.getBoundingClientRect();
        word.width = rect.width;
        word.height = rect.height;
        word.el.style.left = `${word.x}px`;
        word.el.style.top = `${word.y}px`;
      });
    }, 0);
  }

  /**
   * Render review feed
   */
  function renderReviewFeed(reviews) {
    const feedEl = document.getElementById('nebula-review-feed');
    if (!feedEl) return;

    feedEl.innerHTML = '';

    // Sort reviews: user first, then AI
    const sortedReviews = [...reviews].sort((a, b) => {
      if (a.source === 'user' && b.source !== 'user') return -1;
      if (a.source !== 'user' && b.source === 'user') return 1;
      return 0;
    });

    sortedReviews.forEach(review => {
      const itemEl = document.createElement('div');
      itemEl.className = 'nebula-review-item';

      const sourceIcon = review.source === 'user' ? '☉' : '✦';
      const sourceClass = review.source === 'user' ? 'user' : '';

      itemEl.innerHTML = `
        <span class="nebula-review-source ${sourceClass}">${sourceIcon}</span>
        <span class="nebula-review-text ${sourceClass}">${review.text}</span>
      `;

      feedEl.appendChild(itemEl);
    });
  }

  /**
   * Initialize nebula input handlers
   */
  function initNebulaInput(movieId) {
    const inputs = document.querySelectorAll('.nebula-word-input');
    const submitBtn = document.getElementById('nebula-submit-btn');

    if (!submitBtn) return;

    // Check if all inputs have single-word values
    function checkInputs() {
      const values = Array.from(inputs).map(input => input.value.trim());
      const allFilled = values.every(v => v.length > 0);
      submitBtn.disabled = !allFilled;
    }

    // Add input listeners — block spaces, strip on paste, auto-advance
    inputs.forEach((input, idx) => {
      // Block space key
      input.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          // Flash a subtle error hint
          input.classList.add('nebula-input-error');
          setTimeout(() => input.classList.remove('nebula-input-error'), 600);
        }
      });

      // Strip spaces on paste / any input (catches autocomplete, paste, etc.)
      input.addEventListener('input', () => {
        const stripped = input.value.replace(/\s+/g, '');
        if (stripped !== input.value) {
          input.value = stripped;
          input.classList.add('nebula-input-error');
          setTimeout(() => input.classList.remove('nebula-input-error'), 600);
        }
        checkInputs();
      });
    });

    // Submit handler
    submitBtn.addEventListener('click', async () => {
      const words = Array.from(inputs).map(input => input.value.trim().replace(/\s+/g, ''));
      const reviewText = words.join(' ');

      const service = await loadNebulaService();
      if (!service) return;

      const result = service.saveUserReview(movieId, reviewText);

      if (result.success) {
        // Clear inputs
        inputs.forEach(input => input.value = '');
        submitBtn.disabled = true;

        // Reload nebula with updated data
        const movieTitle = nebulaData ? nebulaData.title : '';
        loadNebulaFace(movieId, movieTitle);
      } else {
        alert(result.error || 'Failed to save review');
      }
    });
  }

  /**
   * Start nebula physics animation
   */
  function startNebulaPhysics() {
    if (nebulaPhysicsRunning) return;

    nebulaPhysicsRunning = true;

    const cloudEl = document.getElementById('nebula-cloud');
    if (!cloudEl) return;

    function animate() {
      if (!nebulaPhysicsRunning) return;

      const rect = cloudEl.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update each word
      nebulaWords.forEach(word => {
        // Update position
        word.x += word.vx;
        word.y += word.vy;

        // Bounce off walls
        if (word.x <= 0 || word.x + word.width >= width) {
          word.vx *= -1;
          word.x = Math.max(0, Math.min(width - word.width, word.x));
        }
        if (word.y <= 0 || word.y + word.height >= height) {
          word.vy *= -1;
          word.y = Math.max(0, Math.min(height - word.height, word.y));
        }

        // Apply position
        word.el.style.left = `${word.x}px`;
        word.el.style.top = `${word.y}px`;
      });

      // Simple collision detection (optional, can be expensive)
      for (let i = 0; i < nebulaWords.length; i++) {
        for (let j = i + 1; j < nebulaWords.length; j++) {
          const w1 = nebulaWords[i];
          const w2 = nebulaWords[j];

          // Check overlap
          if (
            w1.x < w2.x + w2.width &&
            w1.x + w1.width > w2.x &&
            w1.y < w2.y + w2.height &&
            w1.y + w1.height > w2.y
          ) {
            // Simple bounce: swap velocities
            const tempVx = w1.vx;
            const tempVy = w1.vy;
            w1.vx = w2.vx;
            w1.vy = w2.vy;
            w2.vx = tempVx;
            w2.vy = tempVy;

            // Separate them slightly
            const dx = (w1.x + w1.width / 2) - (w2.x + w2.width / 2);
            const dy = (w1.y + w1.height / 2) - (w2.y + w2.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;

            w1.x += nx * 2;
            w1.y += ny * 2;
            w2.x -= nx * 2;
            w2.y -= ny * 2;
          }
        }
      }

      nebulaAnimationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  /**
   * Stop nebula physics animation
   */
  function stopNebulaPhysics() {
    nebulaPhysicsRunning = false;
    if (nebulaAnimationFrame) {
      cancelAnimationFrame(nebulaAnimationFrame);
      nebulaAnimationFrame = null;
    }
  }

  // ============================================
  // SHORTLIST FUNCTIONS
  // ============================================

  /**
   * Load shortlist service functions (from global window scope)
   */
  function getShortlistFunctions() {
    return {
      getShortlist: window.getShortlist,
      addToShortlist: window.addToShortlist,
      removeFromShortlist: window.removeFromShortlist,
      isInShortlist: window.isInShortlist,
      getShortlistCount: window.getShortlistCount
    };
  }

  /**
   * Update shortlist button state based on current movie and shortlist status
   */
  function updateShortlistButton() {
    if (!cubeShortlistBtn || !cubeMovieData) return;

    const shortlistFns = getShortlistFunctions();
    if (!shortlistFns.isInShortlist || !shortlistFns.getShortlistCount) {
      // Shortlist service not loaded, hide button
      cubeShortlistBtn.style.display = 'none';
      return;
    }

    cubeShortlistBtn.style.display = 'flex';

    const movieId = cubeMovieData.id;
    const isAdded = shortlistFns.isInShortlist(movieId);
    const count = shortlistFns.getShortlistCount();

    // Reset classes
    cubeShortlistBtn.className = 'shortlist-btn';

    const iconSpan = cubeShortlistBtn.querySelector('.shortlist-icon');
    const labelSpan = cubeShortlistBtn.querySelector('.shortlist-label');

    if (isAdded) {
      // Movie IS in shortlist
      cubeShortlistBtn.classList.add('added');
      cubeShortlistBtn.disabled = false;
      cubeShortlistBtn.title = 'Remove from Shortlist';
      if (iconSpan) iconSpan.textContent = '★';
      if (labelSpan) labelSpan.textContent = `Shortlisted (${count})`;
    } else {
      // Movie NOT in shortlist
      cubeShortlistBtn.classList.add('not-added');
      cubeShortlistBtn.disabled = false;
      cubeShortlistBtn.title = 'Add to Shortlist';
      if (iconSpan) iconSpan.textContent = '☆';
      if (labelSpan) labelSpan.textContent = count > 0 ? `Shortlist (${count})` : 'Shortlist';
    }
  }

  /**
   * Handle shortlist button click
   */
  function handleShortlistClick() {
    if (!cubeMovieData) return;

    const shortlistFns = getShortlistFunctions();
    if (!shortlistFns.addToShortlist || !shortlistFns.removeFromShortlist || !shortlistFns.isInShortlist) {
      console.warn('Shortlist service not loaded');
      return;
    }

    const movieId = cubeMovieData.id;
    const isAdded = shortlistFns.isInShortlist(movieId);

    if (isAdded) {
      // Remove from shortlist
      const result = shortlistFns.removeFromShortlist(movieId);
      if (result.success) {
        // Brief visual feedback
        flashShortlistButton('removed');
      }
    } else {
      // Add to shortlist
      const movieData = {
        id: cubeMovieData.id,
        title: cubeMovieData.title || 'Unknown',
        year: cubeMovieData.release_date ? new Date(cubeMovieData.release_date).getFullYear() : null,
        poster: cubeMovieData.poster_path || null
      };

      const result = shortlistFns.addToShortlist(movieData);
      if (result.success) {
        // Brief visual feedback
        flashShortlistButton('added');
      } else {
        // Show error (e.g., list full)
        console.warn('Failed to add to shortlist:', result.error);
      }
    }

    // Update button state
    updateShortlistButton();

    // Update floating badge if it exists
    if (typeof window.updateShortlistBadge === 'function') {
      window.updateShortlistBadge();
    }
  }

  /**
   * Flash button with brief animation for feedback
   */
  function flashShortlistButton(action) {
    if (!cubeShortlistBtn) return;

    // Add flash class
    cubeShortlistBtn.classList.add('shortlist-flash');

    // Remove after animation
    setTimeout(() => {
      cubeShortlistBtn.classList.remove('shortlist-flash');
    }, 300);
  }

  // ============================================
  // EXPORTS
  // ============================================
  window.initMovieCube = initMovieCube;
  window.openMovieCube = openMovieCube;
  window.closeMovieCube = closeMovieCube;
  window.checkNebulaAvailable = checkNebulaAvailable;

})();