/* ============================================
   ORBIT - Awards Archive  (awards-browse.js)
   Browse film festivals, categories & years
============================================ */

(function () {
  "use strict";

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

  /* Festival → valid category mapping (for greying out incompatible sidebar options) */
  const FESTIVAL_CATEGORIES = {
    Oscar: ["Best Picture", "Best Director", "Best Actor", "Best Actress"],
    BAFTA: ["Best Film", "Best Director", "Best Actor", "Best Actress"],
    GoldenGlobe: ["Best Drama", "Best Comedy/Musical", "Best Director", "Best Actor (Drama)", "Best Actor (Comedy/Musical)", "Best Actress (Drama)", "Best Actress (Comedy/Musical)"],
    Cannes: ["Palme d'Or", "Grand Prix", "Best Director", "Jury Prize"],
    Venice: ["Golden Lion", "Silver Lion (Grand Jury)", "Silver Lion (Director)", "Best Director"],
    Berlin: ["Golden Bear", "Silver Bear (Grand Jury)", "Silver Bear (Director)"]
  };

  /* ---------- AWARDS INDEX (built once at init) ---------- */
  let movieAwardsIndex = {};  // tmdb_id → [{ festival, category, year, isWinner, person }]

  /* ==============================================
     INIT
  ============================================== */
  document.addEventListener("DOMContentLoaded", () => {
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
          if (yearData.winner) {
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

    // Group by year (descending), winners first within each year
    const grouped = {};
    entries.forEach(e => {
      if (!grouped[e.year]) grouped[e.year] = [];
      grouped[e.year].push(e);
    });

    const sortedYears = Object.keys(grouped).map(Number).sort((a, b) => b - a);

    // Deduplicate movies within each year (same tmdb_id)
    sortedYears.forEach(yr => {
      const seen = new Map();
      grouped[yr].forEach(entry => {
        const id = entry.movie.tmdb_id;
        // Keep the winner version if duplicate
        if (!seen.has(id) || (entry.isWinner && !seen.get(id).isWinner)) {
          seen.set(id, entry);
        }
      });
      // Sort: winners first, then nominees
      grouped[yr] = Array.from(seen.values()).sort((a, b) => {
        if (a.isWinner && !b.isWinner) return -1;
        if (!a.isWinner && b.isWinner) return 1;
        return 0;
      });
    });

    let html = "";
    sortedYears.forEach(yr => {
      const items = grouped[yr];
      const winnerCount = items.filter(e => e.isWinner).length;
      const nomineeCount = items.length - winnerCount;
      const subtitle = [];
      if (winnerCount) subtitle.push(`${winnerCount} winner${winnerCount > 1 ? "s" : ""}`);
      if (nomineeCount) subtitle.push(`${nomineeCount} nominee${nomineeCount > 1 ? "s" : ""}`);

      html += `<div class="results-year-group">
        <div class="year-heading">${yr}</div>
        <div class="year-subheading">${subtitle.join(", ")}</div>
        <div class="results-grid">`;

      items.forEach(entry => {
        const m = entry.movie;
        const posterSrc = m.poster_path ? `${TMDB_IMG_BASE}${m.poster_path}` : "";
        const badgeClass = entry.isWinner ? "award-badge-winner" : "award-badge-nominee";
        const badgeHtml = buildBadge(entry.isWinner, entry.festival);
        const tileClass = entry.isWinner ? "award-tile winner-tile" : "award-tile";
        const meta = [];
        if (m.person) meta.push(m.person);
        if (selectedFestivals.size !== 1) meta.push(getFestivalShortName(entry.festival));
        if (currentCategory === "All") meta.push(entry.category);

        html += `<div class="${tileClass}" data-tmdb-id="${m.tmdb_id}">
          <div class="award-tile-poster">
            ${posterSrc
              ? `<img src="${posterSrc}" alt="${escapeAttr(m.title)}" loading="lazy" onerror="this.outerHTML='<div class=\\'no-poster\\'><svg viewBox=\\'0 0 24 24\\' width=\\'32\\' height=\\'32\\' fill=\\'currentColor\\'><path d=\\'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z\\'/></svg></div>'">`
              : `<div class="no-poster"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"/></svg></div>`}
            <div class="${badgeClass}">${badgeHtml}</div>
          </div>
          <div class="award-tile-info">
            <div class="award-tile-title">${escapeHtml(m.title)}</div>
            ${meta.length ? `<div class="award-tile-meta">${escapeHtml(meta.join(" · "))}</div>` : ""}
          </div>
        </div>`;
      });

      html += `</div></div>`;
    });

    resultsContainer.innerHTML = html;
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
      const tile = e.target.closest(".award-tile");
      if (!tile) return;
      const tmdbId = parseInt(tile.dataset.tmdbId, 10);
      if (tmdbId && typeof openMovieCube === "function") {
        openMovieCube(tmdbId);
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

          if (yearData.winner) {
            const id = yearData.winner.tmdb_id;
            if (!idx[id]) idx[id] = [];
            idx[id].push({ festival: fKey, category: cat, year, isWinner: true, person: yearData.winner.person || null, title: yearData.winner.title });
          }
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
    }
    return tooltipEl;
  }

  function showTooltip(tile, e) {
    const tmdbId = parseInt(tile.dataset.tmdbId, 10);
    const awards = movieAwardsIndex[tmdbId];
    if (!awards || !awards.length) return;

    const tip = ensureTooltip();
    tip.innerHTML = buildTooltipHtml(awards);
    tip.classList.add("visible");
    positionTooltip(e);
  }

  function hideTooltip() {
    clearTimeout(hoverTimer);
    currentHoverTile = null;
    if (tooltipEl) tooltipEl.classList.remove("visible");
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

    resultsContainer.addEventListener("mouseenter", (e) => {
      const tile = e.target.closest(".award-tile");
      if (!tile) return;
      currentHoverTile = tile;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (currentHoverTile === tile) showTooltip(tile, e);
      }, 400);
    }, true);

    resultsContainer.addEventListener("mouseleave", (e) => {
      const tile = e.target.closest(".award-tile");
      if (!tile) return;
      hideTooltip();
    }, true);

    resultsContainer.addEventListener("mousemove", (e) => {
      const tile = e.target.closest(".award-tile");
      if (!tile) { hideTooltip(); return; }
      if (tile !== currentHoverTile) {
        hideTooltip();
        currentHoverTile = tile;
        hoverTimer = setTimeout(() => {
          if (currentHoverTile === tile) showTooltip(tile, e);
        }, 400);
      } else if (tooltipEl && tooltipEl.classList.contains("visible")) {
        positionTooltip(e);
      }
    });
  }

  /* ==============================================
     HELPERS
  ============================================== */
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

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeAttr(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

})();
