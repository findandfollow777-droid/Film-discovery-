/* ============================================
   ORBIT - Awards Archive  (awards-browse.js)
   Browse film festivals, categories & years
============================================ */

(function () {
  "use strict";

  /* ---------- PREVIEW MODE ---------- */
  const _previewMode = new URLSearchParams(window.location.search).get('preview') === 'true';
  if (_previewMode && typeof AWARDS_BROWSE_DATABASE_PREVIEW !== 'undefined') {
    // Swap the global database reference so the entire page renders preview data
    window.AWARDS_BROWSE_DATABASE = AWARDS_BROWSE_DATABASE_PREVIEW;
  }

  /* ---------- STATE ---------- */
  let selectedFestivals = new Set(); // empty = All festivals
  let currentCategory = "All";   // "All" | category name
  let currentYear     = null;    // null = all years | number
  let currentDecade   = null;    // null = all decades | number (e.g. 2020, 2010)

  /* ---------- DOM REFS ---------- */
  const tabsContainer      = document.getElementById("festivalTabs");
  const sidebar             = document.getElementById("categorySidebar");
  const decadeBarContainer  = document.getElementById("decadeBar");
  const yearPillsContainer  = document.getElementById("yearPills");
  const resultsContainer    = document.getElementById("resultsContainer");
  const guideBtn            = document.getElementById("guideBtn");
  const guideModal          = document.getElementById("guideModal");
  const guideModalClose     = document.getElementById("guideModalClose");
  const infoPanel           = document.getElementById("infoPanel");
  const infoPanelOverlay    = document.getElementById("infoPanelOverlay");
  const infoPanelClose      = document.getElementById("infoPanelClose");
  const infoPanelContent    = document.getElementById("infoPanelContent");

  /* ---------- CONSTANTS ---------- */
  const TMDB_IMG_BASE = OrbitUtils.TMDB_IMG + 'w300';
  const FESTIVAL_KEYS = ["Oscar", "Cannes", "Venice", "Berlin", "BAFTA", "GoldenGlobe"];

  const PERSON_CATS = new Set([
    "Best Actor", "Best Actress", "Best Supporting Actor", "Best Supporting Actress",
    "Best Director", "Best Actor (Drama)", "Best Actor (Comedy/Musical)",
    "Best Actress (Drama)", "Best Actress (Comedy/Musical)"
  ]);

  /* Festival → valid category mapping (for greying out incompatible sidebar options) */
  const FESTIVAL_CATEGORIES = {
    Oscar: ["Best Picture", "Best Director", "Best Actor", "Best Actress"],
    BAFTA: ["Best Film", "Best Director", "Best Actor", "Best Actress"],
    GoldenGlobe: ["Best Drama", "Best Comedy/Musical", "Best Director", "Best Actor (Drama)", "Best Actor (Comedy/Musical)", "Best Actress (Drama)", "Best Actress (Comedy/Musical)"],
    Cannes: ["Palme d'Or", "Grand Prix", "Best Director", "Jury Prize", "Best Actor", "Best Actress"],
    Venice: ["Golden Lion", "Silver Lion (Grand Jury)", "Silver Lion (Director)", "Best Director"],
    Berlin: ["Golden Bear", "Silver Bear (Grand Jury)", "Silver Bear (Director)", "Best Actor", "Best Actress"]
  };

  /* ---------- AWARDS INDEX (built once at init) ---------- */
  let movieAwardsIndex = {};  // tmdb_id → [{ festival, category, year, isWinner, person }]

  /* ==============================================
     INIT
  ============================================== */
  document.addEventListener("DOMContentLoaded", () => {
    // Show preview banner if in preview mode
    if (_previewMode) {
      const banner = document.createElement('div');
      banner.id = 'previewBanner';
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#1a1a2e;color:#f0c040;text-align:center;padding:6px 12px;font-size:13px;border-bottom:2px solid #f0c040;cursor:pointer;';
      banner.textContent = 'PREVIEW DATA — v1.2 schema — Oscar only — not production';
      banner.title = 'Click to dismiss for this session';
      banner.addEventListener('click', () => banner.remove());
      document.body.prepend(banner);
    }

    buildMovieAwardsIndex();
    renderFestivalTabs();
    renderCategorySidebar();
    renderDecadeBar();
    renderYearPills();
    renderResults();
    bindGuideModal();
    bindInfoPanel();
    bindTileClicks();
    bindTileHover();
    bindSidebarClicks();
    bindYearPillClicks();
    bindDecadeClicks();

    // Init MovieCube for tile clicks
    if (typeof initMovieCube === "function") {
      initMovieCube({
        onPersonClick: (personId) => {
          if (typeof openPeopleCube === 'function') openPeopleCube(parseInt(personId));
        },
        onAnchorClick: (movie) => {
          localStorage.setItem("anchorMovie", JSON.stringify(movie));
          localStorage.removeItem("anchorFromResults");
          window.location.href = "../games/constellation.html";
        }
      });
    }
    if (typeof initPeopleCube === 'function') initPeopleCube();

    // Smart back nav
    if (typeof initBackNav === "function") initBackNav();
  });

  /* ==============================================
     FESTIVAL TABS
  ============================================== */
  function renderFestivalTabs() {
    let html = "";

    // "All" tab
    html += `<button class="festival-tab active" data-festival="All">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4"/></svg>
      All
    </button>`;

    FESTIVAL_KEYS.forEach(key => {
      const svg = (typeof AWARD_SVGS !== "undefined" && AWARD_SVGS[key]) || "";
      const info = (typeof FESTIVAL_INFO !== "undefined" && FESTIVAL_INFO[key]) || {};
      const label = info.name || key;
      html += `<button class="festival-tab" data-festival="${key}">
        ${svg}
        ${label}
        <button class="tab-info-btn" data-info-festival="${key}" title="About ${label}">i</button>
      </button>`;
    });

    tabsContainer.innerHTML = html;

    // Click delegation
    tabsContainer.addEventListener("click", (e) => {
      const infoBtn = e.target.closest(".tab-info-btn");
      if (infoBtn) {
        e.stopPropagation();
        openInfoPanel("festival", infoBtn.dataset.infoFestival);
        return;
      }
      const tab = e.target.closest(".festival-tab");
      if (!tab) return;
      const festival = tab.dataset.festival;
      if (festival === "All") {
        selectedFestivals.clear();
      } else if (selectedFestivals.has(festival)) {
        selectedFestivals.delete(festival);
      } else {
        selectedFestivals.add(festival);
      }
      currentYear = null;
      currentDecade = null;
      tabsContainer.querySelectorAll(".festival-tab").forEach(t => {
        if (t.dataset.festival === "All") {
          t.classList.toggle("active", selectedFestivals.size === 0);
        } else {
          t.classList.toggle("active", selectedFestivals.has(t.dataset.festival));
        }
      });
      renderCategorySidebar();
      renderDecadeBar();
      renderYearPills();
      renderResults();
    });
  }

  /* ==============================================
     CATEGORY SIDEBAR
  ============================================== */
  function renderCategorySidebar() {
    const categories = getAllCategories();
    const validCats = getValidCategorySet();

    // Auto-deselect if the current category is no longer valid
    if (currentCategory !== "All" && validCats !== null && !validCats.has(currentCategory)) {
      currentCategory = "All";
      currentDecade = null;
      currentYear = null;
    }

    // Identify which categories are parent groups (have subcategories with parenthetical suffixes)
    const parentGroups = new Set();
    categories.forEach(cat => {
      const m = cat.match(/^(.+?)\s*\(/);
      if (m) {
        const base = m[1].trim();
        if (categories.includes(base)) parentGroups.add(base);
      }
    });

    let html = `<div class="sidebar-title">CATEGORIES</div>`;
    html += `<button class="category-item${currentCategory === "All" ? " active" : ""}" data-category="All">All Categories</button>`;

    const festsToCheck = selectedFestivals.size > 0 ? Array.from(selectedFestivals) : [];
    categories.forEach(cat => {
      const hasInfo = typeof CATEGORY_INFO !== "undefined" &&
        festsToCheck.some(f => CATEGORY_INFO[f] && CATEGORY_INFO[f][cat]);
      // Check if this is a subcategory (has a parenthetical and its parent exists)
      const m = cat.match(/^(.+?)\s*\((.+)\)$/);
      const isChild = m && parentGroups.has(m[1].trim());
      const childClass = isChild ? " category-child" : "";
      const childLabel = isChild ? m[2].replace(/\)$/, "") : cat;
      const isDisabled = validCats !== null && !validCats.has(cat);
      const disabledClass = isDisabled ? " filter-disabled" : "";
      html += `<button class="category-item${currentCategory === cat ? " active" : ""}${childClass}${disabledClass}" data-category="${cat}">
        <span>${childLabel}</span>
        ${hasInfo ? `<button class="cat-info-btn" data-info-cat="${cat}" title="About ${cat}">i</button>` : ""}
      </button>`;
    });

    sidebar.innerHTML = html;
  }

  /* Get ALL distinct categories across every festival (always full set for sidebar).
     Returns categories with parent groups — e.g. "Silver Lion" is added
     when both "Silver Lion (Director)" and "Silver Lion (Grand Jury)" exist. */
  function getAllCategories() {
    if (typeof AWARDS_BROWSE_DATABASE === "undefined") return [];
    const cats = new Set();
    FESTIVAL_KEYS.forEach(fKey => {
      const fest = AWARDS_BROWSE_DATABASE[fKey];
      if (fest) Object.keys(fest).forEach(c => cats.add(c));
    });

    // Add parent groups for categories with parenthetical subcategories
    const bases = {};
    cats.forEach(c => {
      const m = c.match(/^(.+?)\s*\(/);
      if (m) {
        const base = m[1].trim();
        if (!bases[base]) bases[base] = 0;
        bases[base]++;
      }
    });
    Object.keys(bases).forEach(base => {
      if (bases[base] >= 2) cats.add(base);
    });

    return Array.from(cats).sort();
  }

  /* Get the set of categories valid for the currently selected festivals.
     Returns null if no festivals are selected (all categories valid). */
  function getValidCategorySet() {
    if (selectedFestivals.size === 0) return null;
    const valid = new Set();
    selectedFestivals.forEach(fest => {
      if (FESTIVAL_CATEGORIES[fest]) {
        FESTIVAL_CATEGORIES[fest].forEach(cat => valid.add(cat));
      }
    });
    // Also mark parent groups as valid if they have valid children
    const allCats = getAllCategories();
    allCats.forEach(cat => {
      if (valid.has(cat)) return;
      const children = allCats.filter(c => c !== cat && c.startsWith(cat + " ("));
      if (children.length >= 2 && children.some(c => valid.has(c))) {
        valid.add(cat);
      }
    });
    return valid;
  }

  /* Expand a selected category to all matching DB categories.
     If the selected category is a parent group (e.g. "Silver Lion"),
     returns all subcategories that start with that base name.
     Otherwise returns just the selected category. */
  function expandCategory(selectedCat, festivalKeys) {
    if (selectedCat === "All") return null; // null = all categories
    const allCats = new Set();
    festivalKeys.forEach(fKey => {
      const fest = AWARDS_BROWSE_DATABASE[fKey];
      if (fest) Object.keys(fest).forEach(c => allCats.add(c));
    });
    // If the selected category exists as-is in the database, check if it's also a parent
    const isExact = allCats.has(selectedCat);
    const children = Array.from(allCats).filter(c => c !== selectedCat && c.startsWith(selectedCat + " ("));
    if (children.length > 0) {
      // It's a parent group — return all children (and the exact match if it exists)
      const result = children.slice();
      if (isExact) result.push(selectedCat);
      return result;
    }
    return [selectedCat];
  }

  /* ==============================================
     YEAR PILLS
  ============================================== */
  function renderYearPills() {
    let years = getYears();
    if (currentDecade !== null) {
      years = years.filter(y => y >= currentDecade && y < currentDecade + 10);
    }
    let html = `<button class="year-pill${currentYear === null ? " active" : ""}" data-year="all">All${currentDecade !== null ? " " + currentDecade + "s" : " Years"}</button>`;
    years.forEach(y => {
      html += `<button class="year-pill${currentYear === y ? " active" : ""}" data-year="${y}">${y}</button>`;
    });
    yearPillsContainer.innerHTML = html;
  }

  /* Get distinct years for current festival+category */
  function getYears() {
    if (typeof AWARDS_BROWSE_DATABASE === "undefined") return [];
    const years = new Set();
    const festivals = selectedFestivals.size === 0 ? FESTIVAL_KEYS : Array.from(selectedFestivals);
    const expanded = expandCategory(currentCategory, festivals);

    festivals.forEach(fKey => {
      const fest = AWARDS_BROWSE_DATABASE[fKey];
      if (!fest) return;
      const cats = expanded === null ? Object.keys(fest) : expanded;
      cats.forEach(cat => {
        const catData = fest[cat];
        if (catData) Object.keys(catData).forEach(y => years.add(parseInt(y, 10)));
      });
    });

    return Array.from(years).sort((a, b) => b - a);
  }

  /* ==============================================
     DECADE BAR
  ============================================== */
  function renderDecadeBar() {
    const years = getYears();
    if (years.length === 0) {
      decadeBarContainer.innerHTML = "";
      return;
    }
    const decades = new Set();
    years.forEach(y => decades.add(Math.floor(y / 10) * 10));
    const sorted = Array.from(decades).sort((a, b) => b - a);

    let html = `<button class="decade-btn${currentDecade === null ? " active" : ""}" data-decade="all">All</button>`;
    sorted.forEach(d => {
      html += `<button class="decade-btn${currentDecade === d ? " active" : ""}" data-decade="${d}">${d}s</button>`;
    });
    decadeBarContainer.innerHTML = html;
  }

  function bindDecadeClicks() {
    decadeBarContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".decade-btn");
      if (!btn) return;
      currentDecade = btn.dataset.decade === "all" ? null : parseInt(btn.dataset.decade, 10);
      currentYear = null;
      decadeBarContainer.querySelectorAll(".decade-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderYearPills();
      renderResults();
    });
  }

  /* ==============================================
     RENDER RESULTS
  ============================================== */
  function renderResults() {
    if (typeof AWARDS_BROWSE_DATABASE === "undefined") {
      resultsContainer.innerHTML = `<div class="results-empty">
        <div class="empty-icon"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg></div>
        <h3>Data Not Available</h3>
        <p>Awards data could not be loaded.</p>
      </div>`;
      return;
    }

    // Collect all entries: { movie, isWinner, festival, category, year }
    const entries = [];
    const festivals = selectedFestivals.size === 0 ? FESTIVAL_KEYS : Array.from(selectedFestivals);
    const expanded = expandCategory(currentCategory, festivals);

    festivals.forEach(fKey => {
      const fest = AWARDS_BROWSE_DATABASE[fKey];
      if (!fest) return;
      const cats = expanded === null ? Object.keys(fest) : expanded;
      cats.forEach(cat => {
        const catData = fest[cat];
        if (!catData) return;
        let years = currentYear ? [currentYear] : Object.keys(catData).map(Number);
        if (!currentYear && currentDecade !== null) {
          years = years.filter(y => y >= currentDecade && y < currentDecade + 10);
        }
        years.forEach(yr => {
          const yearData = catData[yr];
          if (!yearData) return;
          if (yearData.winners) {
            yearData.winners.forEach(w => {
              entries.push({ movie: w, isWinner: true, festival: fKey, category: cat, year: yr });
            });
          } else if (yearData.winner) {
            entries.push({ movie: yearData.winner, isWinner: true, festival: fKey, category: cat, year: yr });
          }
          if (yearData.nominees) {
            yearData.nominees.forEach(nom => {
              entries.push({ movie: nom, isWinner: false, festival: fKey, category: cat, year: yr });
            });
          }
        });
      });
    });

    if (entries.length === 0) {
      resultsContainer.innerHTML = `<div class="results-empty">
        <div class="empty-icon"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"/></svg></div>
        <h3>No Results</h3>
        <p>No awards found for the selected filters. Try broadening your selection.</p>
      </div>`;
      return;
    }

    // Deduplicate a list of entries by tmdb_id (or title|person for person tiles)
    function dedupEntries(list) {
      const seen = new Map();
      list.forEach(entry => {
        const id = entry.movie.tmdb_id || `${entry.movie.title}|${entry.movie.person_name || entry.movie.person || ''}`;
        if (!seen.has(id) || (entry.isWinner && !seen.get(id).isWinner)) {
          seen.set(id, entry);
        }
      });
      return Array.from(seen.values()).sort((a, b) => {
        if (a.isWinner && !b.isWinner) return -1;
        if (!a.isWinner && b.isWinner) return 1;
        return 0;
      });
    }

    // Flip tiles only in person-category filtered views (not "All")
    const isFlipView = currentCategory !== "All" && PERSON_CATS.has(currentCategory);

    // Build tile HTML for a single entry
    function buildTileHtml(entry) {
      const m = entry.movie;
      const personName = m.person_name || m.person || '';
      const personId = m.person_id || 0;
      const posterSrc = m.poster_path ? `${TMDB_IMG_BASE}${m.poster_path}` : "";
      const badgeClass = entry.isWinner ? "award-badge-winner" : "award-badge-nominee";
      const badgeHtml = buildBadge(entry.isWinner, entry.festival);

      // tmdb_id=0 (Cannes/Berlin acting) → always person tile
      if (!m.tmdb_id && personName) {
        return buildPersonTileHtml(entry, m, personName, personId, badgeClass, badgeHtml);
      }

      // Person category filtered view with movie poster → flip tile
      if (isFlipView && posterSrc) {
        return buildFlipTileHtml(entry, m, personName, personId, posterSrc, badgeClass, badgeHtml);
      }

      // Everything else → standard movie tile
      return buildMovieTileHtml(entry, m, personName, personId, posterSrc, badgeClass, badgeHtml);
    }

    function buildMovieTileHtml(entry, m, personName, personId, posterSrc, badgeClass, badgeHtml) {
      const tileClass = entry.isWinner ? "award-tile winner-tile" : "award-tile";
      const fallbackHtml = `<div class="no-poster"><span class="og og-film"></span><span class="no-poster-title">${escapeHtml(m.title)}</span></div>`;
      const fallbackEscaped = fallbackHtml.replace(/'/g, "\\'").replace(/"/g, "&quot;");
      const metaParts = [];
      if (personName && m.person_id) {
        metaParts.push(`<span class="person-link" data-person-id="${m.person_id}">${escapeHtml(personName)}</span>`);
      } else if (personName) {
        metaParts.push(escapeHtml(personName));
      }
      if (selectedFestivals.size !== 1) metaParts.push(escapeHtml(getFestivalShortName(entry.festival)));
      // Derive film release year from ceremony year:
      // Oscar/BAFTA/GoldenGlobe honour prior-year films; Cannes/Venice/Berlin honour same-year films
      const ceremonyOffsetFests = new Set(["Oscar", "BAFTA", "GoldenGlobe"]);
      const filmYear = ceremonyOffsetFests.has(entry.festival) ? entry.year - 1 : entry.year;
      return `<div class="${tileClass}" data-tmdb-id="${m.tmdb_id}" data-person-id="${personId}" data-film-year="${filmYear}">
        <div class="award-tile-poster">
          ${posterSrc
            ? `<img src="${posterSrc}" alt="${escapeAttr(m.title)}" loading="lazy" onerror="this.outerHTML='${fallbackEscaped}'">`
            : fallbackHtml}
          <div class="${badgeClass}">${badgeHtml}</div>
        </div>
        <div class="award-tile-info">
          <div class="award-tile-title">${escapeHtml(m.title)}</div>
          ${metaParts.length ? `<div class="award-tile-meta">${metaParts.join(" · ")}</div>` : ""}
          <div class="tile-year-line">Released <span class="tile-year-val">${filmYear}</span></div>
        </div>
      </div>`;
    }

    function buildPersonTileHtml(entry, m, personName, personId, badgeClass, badgeHtml) {
      const roleInfo = getPersonTileRole(entry.category);
      const glowNom = !entry.isWinner ? ' glow-nominee' : '';
      return `<div class="award-tile ${roleInfo.glowClass}${glowNom}" data-tmdb-id="0" data-person-id="${personId}">
        <div class="award-tile-poster">
          <div class="no-poster person-tile-bg">
            <div class="person-tile-inner">
              <div class="person-tile-name">${escapeHtml(personName)}</div>
              <div class="person-tile-film">${escapeHtml(m.title)}</div>
            </div>
          </div>
          <div class="role-tag ${roleInfo.tagClass}">${roleInfo.label}</div>
          <div class="${badgeClass}">${badgeHtml}</div>
        </div>
      </div>`;
    }

    function buildFlipTileHtml(entry, m, personName, personId, posterSrc, badgeClass, badgeHtml) {
      const roleInfo = getPersonTileRole(entry.category);
      const glowNom = !entry.isWinner ? ' glow-nominee' : '';
      const winnerClass = entry.isWinner ? ' winner-tile' : '';
      const fallbackHtml = `<div class="no-poster"><span class="og og-film"></span><span class="no-poster-title">${escapeHtml(m.title)}</span></div>`;
      const fallbackEscaped = fallbackHtml.replace(/'/g, "\\'").replace(/"/g, "&quot;");
      return `<div class="award-tile tile-wrap${winnerClass} ${roleInfo.glowClass}${glowNom}" data-tmdb-id="${m.tmdb_id}" data-person-id="${personId}">
        <div class="tile-inner">
          <div class="tile-face tile-front">
            ${posterSrc
              ? `<img src="${posterSrc}" alt="${escapeAttr(m.title)}" loading="lazy" onerror="this.outerHTML='${fallbackEscaped}'">`
              : fallbackHtml}
            <div class="${badgeClass}">${badgeHtml}</div>
          </div>
          <div class="tile-face tile-back">
            <div class="person-bg"></div>
            <div class="person-gradient"></div>
            <div class="role-tag ${roleInfo.tagClass}">${roleInfo.label}</div>
            <div class="${badgeClass}">${badgeHtml}</div>
            <div class="person-content">
              <div class="person-name">${escapeHtml(personName)}</div>
              <div class="person-film">${escapeHtml(m.title)}</div>
            </div>
          </div>
        </div>
      </div>`;
    }

    // Group by year
    const grouped = {};
    entries.forEach(e => {
      if (!grouped[e.year]) grouped[e.year] = [];
      grouped[e.year].push(e);
    });
    const sortedYears = Object.keys(grouped).map(Number).sort((a, b) => b - a);

    const isAllCategories = currentCategory === "All";
    let html = "";

    sortedYears.forEach(yr => {
      const yearEntries = grouped[yr];
      const winnerCount = yearEntries.filter(e => e.isWinner).length;
      const nomineeCount = yearEntries.length - winnerCount;
      const subtitle = [];
      if (winnerCount) subtitle.push(`${winnerCount} winner${winnerCount > 1 ? "s" : ""}`);
      if (nomineeCount) subtitle.push(`${nomineeCount} nominee${nomineeCount > 1 ? "s" : ""}`);

      html += `<div class="results-year-group">
        <div class="year-heading">${yr}</div>
        <div class="year-subheading">${subtitle.join(", ")}</div>`;

      if (isAllCategories) {
        // Group by category, dedup within each category
        const catMap = {};
        const catOrder = [];
        yearEntries.forEach(e => {
          if (!catMap[e.category]) { catMap[e.category] = []; catOrder.push(e.category); }
          catMap[e.category].push(e);
        });
        catOrder.forEach(cat => {
          const items = dedupEntries(catMap[cat]);
          html += `<div class="category-group">
            <div class="category-group-label">${escapeHtml(cat)}</div>
            <div class="category-tiles">`;
          items.forEach(entry => { html += buildTileHtml(entry); });
          html += `</div></div>`;
        });
      } else if (isFlipView) {
        // Person category: no dedup — one tile per nominee/winner
        const items = yearEntries.sort((a, b) => {
          if (a.isWinner && !b.isWinner) return -1;
          if (!a.isWinner && b.isWinner) return 1;
          return 0;
        });
        html += `<div class="results-grid">`;
        items.forEach(entry => { html += buildTileHtml(entry); });
        html += `</div>`;
      } else {
        // Movie category: dedup flat, render in grid
        const items = dedupEntries(yearEntries);
        html += `<div class="results-grid">`;
        items.forEach(entry => { html += buildTileHtml(entry); });
        html += `</div>`;
      }

      html += `</div>`;
    });

    resultsContainer.innerHTML = html;
    lazyLoadPersonPortraits();
  }

  /* ==============================================
     PERSON PORTRAIT LAZY LOADER
  ============================================== */
  function lazyLoadPersonPortraits() {
    // Person tiles (filtered view, tmdb_id=0)
    const personTiles = resultsContainer.querySelectorAll('.award-tile[data-tmdb-id="0"] .person-tile-bg');
    personTiles.forEach(tile => {
      const parent = tile.closest('.award-tile');
      if (!parent) return;
      const personId = parseInt(parent.dataset.personId, 10);
      if (!personId) return;
      loadPortrait(personId, imgUrl => {
        tile.style.backgroundImage = `linear-gradient(to top, rgba(5,8,18,0.97) 0%, rgba(5,8,18,0.65) 40%, rgba(5,8,18,0.08) 100%), url(${imgUrl})`;
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundPosition = 'center top';
      });
    });

    // Flip tile back faces
    const flipBacks = resultsContainer.querySelectorAll('.tile-wrap .tile-back .person-bg');
    flipBacks.forEach(bg => {
      const wrap = bg.closest('.tile-wrap');
      if (!wrap) return;
      const personId = parseInt(wrap.dataset.personId, 10);
      if (!personId) return;
      loadPortrait(personId, imgUrl => {
        bg.style.backgroundImage = `url(${imgUrl})`;
      });
    });
  }

  function loadPortrait(personId, onLoad) {
    const cacheKey = 'orbit_person_portrait_' + personId;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      if (cached !== 'none') onLoad(cached);
      return;
    }
    const apiKey = typeof TMDB_API_KEY !== 'undefined' ? TMDB_API_KEY : '';
    fetch(`${OrbitUtils.TMDB_BASE}/person/${personId}?api_key=${apiKey}`)
      .then(r => r.json())
      .then(data => {
        if (data.profile_path) {
          const imgUrl = (OrbitUtils.tmdbImageUrl ? OrbitUtils.tmdbImageUrl(data.profile_path, 'w185') : OrbitUtils.TMDB_IMG + 'w185' + data.profile_path);
          sessionStorage.setItem(cacheKey, imgUrl);
          onLoad(imgUrl);
        } else {
          sessionStorage.setItem(cacheKey, 'none');
        }
      })
      .catch(() => {
        sessionStorage.setItem(cacheKey, 'none');
      });
  }

  /* ==============================================
     INFO PANEL
  ============================================== */
  function openInfoPanel(type, key) {
    let html = "";

    if (type === "festival" && typeof FESTIVAL_INFO !== "undefined" && FESTIVAL_INFO[key]) {
      const f = FESTIVAL_INFO[key];
      const svg = (typeof AWARD_SVGS_DETAIL !== "undefined" && AWARD_SVGS_DETAIL[key]) || (typeof AWARD_SVGS !== "undefined" && AWARD_SVGS[key]) || "";
      html = `
        <div class="info-panel-glyph">${svg}</div>
        <div class="info-panel-name">${escapeHtml(f.name)}</div>
        <div class="info-panel-subtitle">${escapeHtml(f.location || "")}</div>
        <div class="info-stat-grid">
          <div class="info-stat">
            <div class="info-stat-label">Founded</div>
            <div class="info-stat-value">${f.founded || "—"}</div>
          </div>
          <div class="info-stat">
            <div class="info-stat-label">Season</div>
            <div class="info-stat-value">${escapeHtml(f.season || "—")}</div>
          </div>
          <div class="info-stat">
            <div class="info-stat-label">Top Award</div>
            <div class="info-stat-value">${escapeHtml(f.topAward || "—")}</div>
          </div>
        </div>
        <div class="info-description">${escapeHtml(f.description || "")}</div>
        ${f.notableWinners ? `
          <div class="info-notable">
            <div class="info-notable-title">Notable Winners</div>
            <ul class="info-notable-list">
              ${f.notableWinners.map(w => `<li>${escapeHtml(w)}</li>`).join("")}
            </ul>
          </div>` : ""}`;
    } else if (type === "category" && typeof CATEGORY_INFO !== "undefined") {
      const festKey = selectedFestivals.size === 1 ? Array.from(selectedFestivals)[0] : null;
      // Try current festival first, then find any match
      let c = null;
      if (festKey && CATEGORY_INFO[festKey]) c = CATEGORY_INFO[festKey][key];
      if (!c) {
        for (const fk of FESTIVAL_KEYS) {
          if (CATEGORY_INFO[fk] && CATEGORY_INFO[fk][key]) { c = CATEGORY_INFO[fk][key]; break; }
        }
      }
      if (c) {
        html = `
          <div class="info-panel-name">${escapeHtml(key)}</div>
          <div class="info-panel-subtitle">${festKey ? getFestivalShortName(festKey) : "Multiple Festivals"}</div>
          <div class="info-stat-grid">
            <div class="info-stat">
              <div class="info-stat-label">First Awarded</div>
              <div class="info-stat-value">${c.firstAwarded || "—"}</div>
            </div>
          </div>
          <div class="info-description">${escapeHtml(c.description || "")}</div>
          ${c.equivalent ? `<div class="info-equivalent">Comparable to: ${escapeHtml(c.equivalent)}</div>` : ""}`;
      }
    }

    if (!html) {
      html = `<div class="info-panel-name">${escapeHtml(key)}</div><div class="info-description">No additional information available.</div>`;
    }

    html += `<div class="info-panel-guide-cta">
      <div class="guide-cta-label">Want to know more?</div>
      <a href="awards-guide.html" class="guide-cta-link">
        <span>Full history, eras &amp; notable moments</span>
        <span class="guide-cta-arrow">&#8594; Guide</span>
      </a>
    </div>`;

    infoPanelContent.innerHTML = html;
    infoPanel.classList.add("open");
    infoPanelOverlay.hidden = false;
    infoPanelOverlay.classList.add("open");
  }

  function closeInfoPanel() {
    infoPanel.classList.remove("open");
    infoPanelOverlay.classList.remove("open");
    setTimeout(() => { infoPanelOverlay.hidden = true; }, 300);
  }

  function bindInfoPanel() {
    infoPanelClose.addEventListener("click", closeInfoPanel);
    infoPanelOverlay.addEventListener("click", closeInfoPanel);
  }

  /* ==============================================
     GUIDE MODAL
  ============================================== */
  function bindGuideModal() {
    guideBtn.addEventListener("click", () => { guideModal.hidden = false; });
    guideModalClose.addEventListener("click", () => { guideModal.hidden = true; });
    guideModal.addEventListener("click", (e) => {
      if (e.target === guideModal) guideModal.hidden = true;
    });
  }

  /* ==============================================
     ONE-TIME EVENT BINDINGS (avoid duplicates)
  ============================================== */
  function bindTileClicks() {
    resultsContainer.addEventListener("click", (e) => {
      // Flip tile click
      const flipWrap = e.target.closest(".tile-wrap");
      if (flipWrap) {
        const inner = flipWrap.querySelector('.tile-inner');
        const style = window.getComputedStyle(inner);
        const matrix = style.transform;
        // Check if rotated (back face showing) — matrix will contain negative values in [0] when rotated 180deg
        const isFlipped = matrix && matrix !== 'none' && parseFloat(matrix.split(',')[0].replace('matrix3d(', '').replace('matrix(', '')) < 0;
        if (isFlipped) {
          const personId = parseInt(flipWrap.dataset.personId, 10);
          if (personId && typeof openPeopleCube === "function") openPeopleCube(personId);
        } else {
          const tmdbId = parseInt(flipWrap.dataset.tmdbId, 10);
          if (tmdbId && typeof openMovieCube === "function") openMovieCube(tmdbId);
        }
        return;
      }

      // Standard tile click
      const tile = e.target.closest(".award-tile");
      if (!tile) return;
      const tmdbId = parseInt(tile.dataset.tmdbId, 10);
      if (tmdbId && typeof openMovieCube === "function") {
        openMovieCube(tmdbId);
      } else {
        const personId = parseInt(tile.dataset.personId, 10);
        if (personId && typeof openPeopleCube === "function") {
          openPeopleCube(personId);
        }
      }
    });
  }

  function bindSidebarClicks() {
    sidebar.addEventListener("click", (e) => {
      const catInfoBtn = e.target.closest(".cat-info-btn");
      if (catInfoBtn) {
        e.stopPropagation();
        openInfoPanel("category", catInfoBtn.dataset.infoCat);
        return;
      }
      const item = e.target.closest(".category-item");
      if (!item || item.classList.contains("filter-disabled")) return;
      currentCategory = item.dataset.category;
      currentDecade = null;
      currentYear = null;
      sidebar.querySelectorAll(".category-item").forEach(c => c.classList.remove("active"));
      item.classList.add("active");
      renderDecadeBar();
      renderYearPills();
      renderResults();
    });
  }

  function bindYearPillClicks() {
    yearPillsContainer.addEventListener("click", (e) => {
      const pill = e.target.closest(".year-pill");
      if (!pill) return;
      currentYear = pill.dataset.year === "all" ? null : parseInt(pill.dataset.year, 10);
      yearPillsContainer.querySelectorAll(".year-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderResults();
    });
  }

  /* ==============================================
     AWARDS INDEX (one-time scan of full database)
  ============================================== */
  function buildMovieAwardsIndex() {
    if (typeof AWARDS_BROWSE_DATABASE === "undefined") return;
    const idx = {};

    FESTIVAL_KEYS.forEach(fKey => {
      const fest = AWARDS_BROWSE_DATABASE[fKey];
      if (!fest) return;
      Object.keys(fest).forEach(cat => {
        const catData = fest[cat];
        if (!catData) return;
        Object.keys(catData).forEach(yr => {
          const yearData = catData[yr];
          if (!yearData) return;
          const year = parseInt(yr, 10);

          const winnerList = yearData.winners ? yearData.winners : yearData.winner ? [yearData.winner] : [];
          winnerList.forEach(w => {
            const id = w.tmdb_id;
            if (!idx[id]) idx[id] = [];
            idx[id].push({ festival: fKey, category: cat, year, isWinner: true, person: w.person || null, title: w.title });
          });
          if (yearData.nominees) {
            yearData.nominees.forEach(nom => {
              const id = nom.tmdb_id;
              if (!idx[id]) idx[id] = [];
              idx[id].push({ festival: fKey, category: cat, year, isWinner: false, person: nom.person || null, title: nom.title });
            });
          }
        });
      });
    });

    // Sort each movie's awards: wins first, then by year descending
    Object.values(idx).forEach(arr => {
      arr.sort((a, b) => {
        if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
        return b.year - a.year;
      });
    });

    movieAwardsIndex = idx;
  }

  /* ==============================================
     HOVER TOOLTIP
  ============================================== */
  let tooltipEl = null;
  let hoverTimer = null;
  let currentHoverTile = null;

  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "awards-tooltip";
      document.body.appendChild(tooltipEl);

      tooltipEl.addEventListener("mouseenter", () => {
        tooltipHovered = true;
        clearTimeout(hideTimer);
      });
      tooltipEl.addEventListener("mouseleave", () => {
        tooltipHovered = false;
        hideTooltip(true);
      });
    }
    return tooltipEl;
  }

  function showTooltip(tile, e) {
    const el = tile.closest('.tile-wrap') || tile;
    const tmdbId = parseInt(el.dataset.tmdbId || tile.dataset.tmdbId, 10);
    const awards = movieAwardsIndex[tmdbId];
    if (!awards || !awards.length) return;

    const tip = ensureTooltip();
    tip.innerHTML = buildTooltipHtml(awards);
    tip.classList.add("visible");
    positionTooltip(e);
  }

  let tooltipHovered = false;
  let hideTimer = null;

  function hideTooltip(immediate) {
    clearTimeout(hoverTimer);
    clearTimeout(hideTimer);
    if (immediate) {
      currentHoverTile = null;
      if (tooltipEl) tooltipEl.classList.remove("visible");
      return;
    }
    hideTimer = setTimeout(() => {
      if (!tooltipHovered) {
        currentHoverTile = null;
        if (tooltipEl) tooltipEl.classList.remove("visible");
      }
    }, 150);
  }

  function positionTooltip(e) {
    if (!tooltipEl) return;
    const pad = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = tooltipEl.getBoundingClientRect();
    let x = e.clientX + pad;
    let y = e.clientY + pad;

    // Flip left if near right edge
    if (x + rect.width + pad > vw) x = e.clientX - rect.width - pad;
    // Flip up if near bottom
    if (y + rect.height + pad > vh) y = e.clientY - rect.height - pad;
    // Clamp
    if (x < 4) x = 4;
    if (y < 4) y = 4;

    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }

  function buildTooltipHtml(awards) {
    const title = awards[0].title || "";
    let html = `<div class="awards-tooltip-title">${escapeHtml(title)}</div>`;
    html += `<div class="awards-tooltip-divider"></div>`;
    html += `<div class="awards-tooltip-list">`;

    awards.forEach(a => {
      const rowClass = a.isWinner ? "win" : "nom";
      const svg = (typeof AWARD_SVGS !== "undefined" && AWARD_SVGS[a.festival]) || "";
      const festName = getFestivalShortName(a.festival);
      const badgeLabel = a.isWinner ? "Winner" : "Nom";

      html += `<div class="awards-tooltip-row ${rowClass}">
        ${svg}
        <div class="awards-tooltip-row-text">
          <span class="awards-tooltip-cat">${escapeHtml(festName)} — ${escapeHtml(a.category)}</span>
          <span class="awards-tooltip-year">(${a.year})</span>
          ${a.person ? `<span class="awards-tooltip-person">${escapeHtml(a.person)}</span>` : ""}
        </div>
        <span class="awards-tooltip-badge">${badgeLabel}</span>
      </div>`;
    });

    html += `</div>`;
    return html;
  }

  function bindTileHover() {
    // Skip on touch-primary devices
    if (window.matchMedia("(hover: none)").matches) return;

    function hoverTarget(e) {
      return e.target.closest(".tile-wrap") || e.target.closest(".award-tile");
    }

    resultsContainer.addEventListener("mouseenter", (e) => {
      const tile = hoverTarget(e);
      if (!tile) return;
      currentHoverTile = tile;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (currentHoverTile === tile) showTooltip(tile, e);
      }, 400);
    }, true);

    resultsContainer.addEventListener("mouseleave", (e) => {
      const tile = hoverTarget(e);
      if (!tile) return;
      hideTooltip();
    }, true);

    resultsContainer.addEventListener("mousemove", (e) => {
      const tile = hoverTarget(e);
      if (!tile) { if (!tooltipHovered) hideTooltip(); return; }
      if (tile !== currentHoverTile) {
        hideTooltip(true);
        currentHoverTile = tile;
        hoverTimer = setTimeout(() => {
          if (currentHoverTile === tile) showTooltip(tile, e);
        }, 400);
      } else if (tooltipEl && tooltipEl.classList.contains("visible") && !tooltipHovered) {
        positionTooltip(e);
      }
    });
  }

  /* ==============================================
     HELPERS
  ============================================== */
  function getPersonTileRole(category) {
    if (category === 'Best Supporting Actress')
      return { glowClass: 'glow-actress', tagClass: 'actress', label: 'Supporting' };
    if (category === 'Best Supporting Actor')
      return { glowClass: 'glow-actor', tagClass: 'actor', label: 'Supporting' };
    if (/^Best Actress/.test(category))
      return { glowClass: 'glow-actress', tagClass: 'actress', label: 'Actress' };
    if (/^Best Actor/.test(category))
      return { glowClass: 'glow-actor', tagClass: 'actor', label: 'Actor' };
    return { glowClass: 'glow-director', tagClass: 'director', label: 'Director' };
  }

  /* Build orbit-style badge HTML: concentric rings + SVG core */
  function buildBadge(isWinner, festivalKey) {
    const rings = `<div class="badge-ring-outer"></div><div class="badge-ring-inner"></div>`;
    if (isWinner) {
      // Use the festival-specific glyph SVG for winners
      const festSvg = (typeof AWARD_SVGS !== "undefined" && AWARD_SVGS[festivalKey]) || "";
      return `${rings}<div class="badge-core">${festSvg}</div>`;
    }
    // Nominees get a simple dot
    return `${rings}<div class="badge-core"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg></div>`;
  }

  function getFestivalShortName(key) {
    const names = {
      Oscar: "Oscar",
      Cannes: "Cannes",
      Venice: "Venice",
      Berlin: "Berlin",
      BAFTA: "BAFTA",
      GoldenGlobe: "Golden Globe"
    };
    return names[key] || key;
  }

  /* ---------- TIME-BAR SCROLL HIDE / REVEAL ---------- */
  (function initTimeBarScroll() {
    let lastScrollY = window.scrollY;
    let scrollTimer = null;
    const SCROLL_PAUSE_MS = 400;

    function hideTimeBars() {
      decadeBarContainer.classList.add("scroll-hidden");
      yearPillsContainer.classList.add("scroll-hidden");
    }

    function showTimeBars() {
      decadeBarContainer.classList.remove("scroll-hidden");
      yearPillsContainer.classList.remove("scroll-hidden");
    }

    window.addEventListener("scroll", () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY && currentY > 150;
      lastScrollY = currentY;

      if (scrollingDown) {
        hideTimeBars();
      } else {
        // Scrolling up — show immediately
        showTimeBars();
      }

      // Reveal after pause regardless of direction
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(showTimeBars, SCROLL_PAUSE_MS);
    }, { passive: true });
  })();

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeAttr(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

})();
