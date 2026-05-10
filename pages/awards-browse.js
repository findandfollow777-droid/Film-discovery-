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

  /* Legacy data source. v1 lazy per-festival fetch is a separate follow-on. */
  const AWARDS_DB = window.AWARDS_BROWSE_DATABASE;
  const PERSON_LOOKUP = window.PERSON_AWARD_LOOKUP;

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

  /* Phase 1 scope cap (ORBIT-AWARDS-SCOPE-v1.md): UI surfaces 2000-present
     only. DB may contain pre-2000 entries (e.g. Venice Best Actor 1970,
     1987) — those are deferred to phase 4 and filtered at the UI boundary,
     not deleted from data. */
  const MIN_YEAR = 2000;
  function inScope(year) { return year >= MIN_YEAR; }

  /* Film-tier categories — poster-bleed tile treatment (Prompt 2) */
  const FILM_CATEGORIES = new Set([
    'Best Picture', 'Best Film', "Palme d'Or", 'Golden Lion', 'Golden Bear',
    'Best Drama', 'Best Comedy/Musical'
  ]);

  /* Sidebar groups (Prompt 2) — order here is the render order.
     Categories not present in any group are skipped silently. */
  const CATEGORY_GROUPS = [
    { label: 'Top Prizes', categories: ['Best Picture', 'Best Film', "Palme d'Or", 'Golden Lion', 'Golden Bear', 'Best Drama', 'Best Comedy/Musical'] },
    { label: 'Direction',  categories: ['Best Director', 'Silver Lion (Director)', 'Silver Bear (Director)'] },
    { label: 'Performance',categories: ['Best Actor', 'Best Actress'] },
    { label: 'Other Awards', categories: ['Grand Prix', 'Jury Prize', 'Silver Lion (Grand Jury)', 'Silver Bear (Grand Jury)'] }
  ];

  /* Festival → valid category mapping (for greying out incompatible sidebar options) */
  const FESTIVAL_CATEGORIES = {
    Oscar: ["Best Picture", "Best Director", "Best Actor", "Best Actress"],
    BAFTA: ["Best Film", "Best Director", "Best Actor", "Best Actress"],
    GoldenGlobe: ["Best Drama", "Best Comedy/Musical", "Best Director", "Best Actor (Drama)", "Best Actor (Comedy/Musical)", "Best Actress (Drama)", "Best Actress (Comedy/Musical)"],
    Cannes: ["Palme d'Or", "Grand Prix", "Best Director", "Jury Prize", "Best Actor", "Best Actress"],
    Venice: ["Golden Lion", "Silver Lion (Grand Jury)", "Silver Lion (Director)", "Best Director"],
    Berlin: ["Golden Bear", "Silver Bear (Grand Jury)", "Silver Bear (Director)", "Best Actor", "Best Actress"]
  };

  /* ============================================================
     V1 LAZY FETCH — Cannes / Venice / Berlin (added May 7, 2026)
     Legacy AWARDS_BROWSE_DATABASE has no rows for these three winners-only
     festivals. Their data lives in per-festival v1 JSON files (~180–220KB
     each) loaded on demand. Oscar / BAFTA / GoldenGlobe continue using the
     legacy in-script DB unchanged.
     ============================================================ */
  const V1_FESTIVAL_MAP = {
    Cannes: 'cannes',
    Venice: 'venice',
    Berlin: 'berlin'
  };
  const V1_FESTIVAL_CACHE = {};   // legacyKey → reshaped festival object
  const V1_PENDING = {};          // legacyKey → in-flight Promise (dedupes)
  const V1_FAILED = {};           // legacyKey → true (no re-fetch loop)

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
    ensureLandmarkUI();
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
          window.location.href = "anchor-point.html";
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
      const festivalId = window.detectFestivalId ? window.detectFestivalId(key) : null;
      const info = (typeof FESTIVAL_INFO !== "undefined" && FESTIVAL_INFO[key]) || {};
      const label = info.name || key;
      const badgeHtml = festivalId
        ? `<div class="orbit-award-badge" data-award-badge="${festivalId}" data-status="winner" data-size="18" title="${label}"></div>`
        : "";
      html += `<button class="festival-tab" data-festival="${key}">
        ${badgeHtml}
        ${label}
        <button class="tab-info-btn" data-info-festival="${key}" title="About ${label}">i</button>
      </button>`;
    });

    tabsContainer.innerHTML = html;
    if (window.renderAwardBadges) window.renderAwardBadges(tabsContainer);

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

    let html = `<div class="sidebar-title">CATEGORIES</div>`;
    html += `<button class="category-item${currentCategory === "All" ? " active" : ""}" data-category="All">All Categories</button>`;

    const festsToCheck = selectedFestivals.size > 0 ? Array.from(selectedFestivals) : [];
    const available = new Set(categories);

    function buttonHtml(cat) {
      const hasInfo = typeof CATEGORY_INFO !== "undefined" &&
        festsToCheck.some(f => CATEGORY_INFO[f] && CATEGORY_INFO[f][cat]);
      const isDisabled = validCats !== null && !validCats.has(cat);
      const disabledClass = isDisabled ? " filter-disabled" : "";
      return `<button class="category-item${currentCategory === cat ? " active" : ""}${disabledClass}" data-category="${escapeAttr(cat)}">
        <span>${escapeHtml(cat)}</span>
        ${hasInfo ? `<button class="cat-info-btn" data-info-cat="${escapeAttr(cat)}" title="About ${escapeAttr(cat)}">i</button>` : ""}
      </button>`;
    }

    // Render grouped categories — only groups with at least one available category
    CATEGORY_GROUPS.forEach(group => {
      const present = group.categories.filter(c => available.has(c));
      if (!present.length) return;
      html += `<div class="cat-group-label">${escapeHtml(group.label)}</div>`;
      present.forEach(cat => { html += buttonHtml(cat); });
    });

    sidebar.innerHTML = html;
  }

  /* Get ALL distinct categories across every festival (always full set for sidebar).
     Returns categories with parent groups — e.g. "Silver Lion" is added
     when both "Silver Lion (Director)" and "Silver Lion (Grand Jury)" exist. */
  function getAllCategories() {
    if (!AWARDS_DB) return [];
    const cats = new Set();
    FESTIVAL_KEYS.forEach(fKey => {
      const fest = AWARDS_DB[fKey];
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
      const fest = AWARDS_DB[fKey];
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
    if (!AWARDS_DB) return [];
    const years = new Set();
    const festivals = selectedFestivals.size === 0 ? FESTIVAL_KEYS : Array.from(selectedFestivals);
    const expanded = expandCategory(currentCategory, festivals);

    festivals.forEach(fKey => {
      const fest = AWARDS_DB[fKey];
      if (!fest) return;
      const cats = expanded === null ? Object.keys(fest) : expanded;
      cats.forEach(cat => {
        const catData = fest[cat];
        if (catData) Object.keys(catData).forEach(y => {
          const yr = parseInt(y, 10);
          if (inScope(yr)) years.add(yr);
        });
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

    let html = '';
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
     V1 FETCH + LEGACY-SHAPE BUILDER
     (Cannes / Venice / Berlin only — see V1_FESTIVAL_MAP above.)
  ============================================== */

  /* Convert a v1 awards file into the legacy AWARDS_DB festival shape:
       { [categoryDisplayName]: { [year]: { winner | winners[], nominees[] } } }
     v1 stores each row separately. For a (category, year) bucket:
       - N won rows → N-way co-win (e.g. Cannes Best Actress 2024 — Emilia
         Pérez ensemble). Emit `winners: [...]` when N ≥ 2, else `winner: X`.
         If N === 0 (nominees-only bucket), emit `winner: null`.
       - Nominated rows fill the `nominees` array.
     Winners-only festivals (Cannes/Venice/Berlin) have zero nominated rows
     in their v1 files, so their `nominees` arrays come out empty — correct. */
  function buildLegacyFestivalDB(v1Data) {
    const db = {};
    if (!v1Data || !Array.isArray(v1Data.awards) || !Array.isArray(v1Data.categories)) return db;

    const catById = {};
    v1Data.categories.forEach(c => { catById[c.id] = c; });

    function buildEntry(award) {
      const recipients = Array.isArray(award.recipients) ? award.recipients : [];
      const recipientNames = recipients.map(r => r && r.name).filter(Boolean).join(', ');
      const firstPid = recipients.find(r => r && r.tmdb_person_id);
      const personId = firstPid ? firstPid.tmdb_person_id : 0;
      return {
        title: award.film_title || recipientNames || '',
        tmdb_id: award.film_tmdb_id || 0,
        poster_path: award.film_poster_path || null,
        person_name: recipientNames || null,
        person_id: personId
      };
    }

    // Parallel buckets: catName → year → array of entries (in source order).
    const winBuckets = {};
    const nomBuckets = {};
    for (const award of v1Data.awards) {
      let target;
      if (award.result === 'won') target = winBuckets;
      else if (award.result === 'nominated') target = nomBuckets;
      else continue;                                   // skip e.g. special_prize

      const cat = catById[award.category_id];
      if (!cat) continue;
      const catName = cat.display_name;
      const year = String(award.year);

      if (!target[catName]) target[catName] = {};
      if (!target[catName][year]) target[catName][year] = [];
      target[catName][year].push(buildEntry(award));
    }

    // Collapse to legacy shape — union of (cat, year) keys across both buckets.
    const allCats = new Set([...Object.keys(winBuckets), ...Object.keys(nomBuckets)]);
    allCats.forEach(catName => {
      db[catName] = {};
      const winYears = winBuckets[catName] || {};
      const nomYears = nomBuckets[catName] || {};
      const allYears = new Set([...Object.keys(winYears), ...Object.keys(nomYears)]);
      allYears.forEach(year => {
        const wins = winYears[year] || [];
        const nominees = nomYears[year] || [];
        if (wins.length === 1) {
          db[catName][year] = { winner: wins[0], nominees };
        } else if (wins.length >= 2) {
          db[catName][year] = { winners: wins, nominees };
        } else {
          db[catName][year] = { winner: null, nominees };
        }
      });
    });

    return db;
  }

  /* Fetch a single festival's v1 file. Returns Promise<festivalObject|null>.
     Populates AWARDS_DB[festivalKey] on success so all downstream readers
     (getAllCategories, getYears, renderResults, etc.) see it natively. */
  function fetchFestivalV1(festivalKey) {
    const slug = V1_FESTIVAL_MAP[festivalKey];
    if (!slug) return Promise.resolve(null);
    if (V1_FESTIVAL_CACHE[festivalKey]) return Promise.resolve(V1_FESTIVAL_CACHE[festivalKey]);
    if (V1_FAILED[festivalKey]) return Promise.resolve(null);
    if (V1_PENDING[festivalKey]) return V1_PENDING[festivalKey];

    const p = fetch(`../data/awards-v1-${slug}.json`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        const reshaped = buildLegacyFestivalDB(data);
        V1_FESTIVAL_CACHE[festivalKey] = reshaped;
        // Only populate slot if legacy didn't supply one (defensive — these
        // three festivals have no legacy rows today, but guard anyway).
        if (!AWARDS_DB[festivalKey] || Object.keys(AWARDS_DB[festivalKey]).length === 0) {
          AWARDS_DB[festivalKey] = reshaped;
        }
        delete V1_PENDING[festivalKey];
        return reshaped;
      })
      .catch(err => {
        console.warn(`[awards-browse] failed to load v1 ${slug}:`, err);
        V1_FAILED[festivalKey] = true;
        // Mark slot as empty object so downstream code treats it as
        // "no data" rather than re-triggering the fetch.
        if (!AWARDS_DB[festivalKey]) AWARDS_DB[festivalKey] = {};
        delete V1_PENDING[festivalKey];
        return null;
      });

    V1_PENDING[festivalKey] = p;
    return p;
  }

  /* Determine which v1 festivals are in scope for the current selection
     and still need fetching. Returns array of legacy festival keys. */
  function v1FestivalsNeedingFetch() {
    const inScopeFestivals = selectedFestivals.size === 0
      ? FESTIVAL_KEYS
      : Array.from(selectedFestivals);
    const needed = [];
    inScopeFestivals.forEach(fKey => {
      if (!V1_FESTIVAL_MAP[fKey]) return;            // not a v1 festival
      if (V1_FESTIVAL_CACHE[fKey]) return;            // already cached
      if (V1_FAILED[fKey]) return;                    // gave up — don't loop
      needed.push(fKey);
    });
    return needed;
  }

  /* ==============================================
     RENDER RESULTS
  ============================================== */
  function renderResults() {
    // V1 lazy-fetch gate: if any in-scope festival needs its v1 file,
    // kick off the fetches and re-render once they resolve. Show the
    // loading placeholder only when nothing is cached yet — avoids a
    // flash on cached data. (Year/category/decade clicks all funnel
    // through here, so this single gate covers every re-render path.)
    const needed = v1FestivalsNeedingFetch();
    if (needed.length > 0) {
      // Loading flashes only when the current selection has nothing to
      // render yet. "All" view always has legacy Oscar/BAFTA/GG; a single
      // already-cached v1 festival also counts.
      const inScope = selectedFestivals.size === 0
        ? FESTIVAL_KEYS
        : Array.from(selectedFestivals);
      const haveDataForSelection = inScope.some(f =>
        AWARDS_DB && AWARDS_DB[f] && Object.keys(AWARDS_DB[f]).length > 0
      );
      if (!haveDataForSelection) {
        resultsContainer.innerHTML = `<div class="results-empty">
          <div class="empty-icon"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg></div>
          <h3>Loading…</h3>
          <p>Fetching festival data.</p>
        </div>`;
      }
      Promise.all(needed.map(fetchFestivalV1)).then(() => renderResults());
      return;
    }

    if (!AWARDS_DB) {
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
      const fest = AWARDS_DB[fKey];
      if (!fest) return;
      const cats = expanded === null ? Object.keys(fest) : expanded;
      cats.forEach(cat => {
        const catData = fest[cat];
        if (!catData) return;
        let years = currentYear ? [currentYear] : Object.keys(catData).map(Number).filter(inScope);
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
      const festSlug = getFestivalGlowSlug(entry.festival);
      const festClass = festSlug ? ` fest-${festSlug}` : '';
      const filmCatClass = FILM_CATEGORIES.has(entry.category) ? ' is-film-cat' : '';
      const tileClass = (entry.isWinner ? "award-tile winner-tile" : "award-tile") + festClass + filmCatClass;
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
      return `<div class="${tileClass}" data-tmdb-id="${m.tmdb_id}" data-person-id="${personId}" data-film-year="${filmYear}" data-festival="${entry.festival}" data-category="${escapeAttr(entry.category)}" data-year="${entry.year}">
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
      const festSlug = getFestivalGlowSlug(entry.festival);
      const festClass = festSlug ? ` fest-${festSlug}` : '';
      return `<div class="award-tile ${roleInfo.glowClass}${glowNom}${festClass}" data-tmdb-id="0" data-person-id="${personId}" data-festival="${entry.festival}" data-category="${escapeAttr(entry.category)}" data-year="${entry.year}">
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
      const festSlug = getFestivalGlowSlug(entry.festival);
      const festClass = festSlug ? ` fest-${festSlug}` : '';
      const fallbackHtml = `<div class="no-poster"><span class="og og-film"></span><span class="no-poster-title">${escapeHtml(m.title)}</span></div>`;
      const fallbackEscaped = fallbackHtml.replace(/'/g, "\\'").replace(/"/g, "&quot;");
      return `<div class="award-tile tile-wrap${winnerClass} ${roleInfo.glowClass}${glowNom}${festClass}" data-tmdb-id="${m.tmdb_id}" data-person-id="${personId}" data-festival="${entry.festival}" data-category="${escapeAttr(entry.category)}" data-year="${entry.year}">
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
    if (window.renderAwardBadges) window.renderAwardBadges(resultsContainer);
    lazyLoadPersonPortraits();
    updateLandmarkUI();
    decorateTilesWithLandmarks();
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
      const festivalId = window.detectFestivalId ? window.detectFestivalId(key) : null;
      const badgeHtml = festivalId
        ? `<div class="orbit-award-badge" data-award-badge="${festivalId}" data-status="winner" data-size="76" title="${escapeHtml(f.name)}"></div>`
        : "";
      html = `
        <div class="info-panel-glyph">${badgeHtml}</div>
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
    if (window.renderAwardBadges) window.renderAwardBadges(infoPanelContent);
    infoPanel.classList.add("open");
    infoPanelOverlay.hidden = false;
    infoPanelOverlay.classList.add("open");
  }

  function closeInfoPanel() {
    infoPanel.classList.remove("open");
    infoPanelOverlay.classList.remove("open");
    setTimeout(() => { infoPanelOverlay.hidden = true; }, 300);
  }

  /* Rule 17: Black Hole exit helpers. */
  function triggerOrbitClose(overlay, btn, teardownFn) {
    if (!overlay) { if (teardownFn) teardownFn(); return; }
    if (overlay.classList.contains('orbit-popup-closing')) return;
    if (btn) btn.classList.add('closing');
    overlay.classList.add('orbit-popup-closing');
    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      if (btn) btn.classList.remove('closing');
      overlay.classList.remove('orbit-popup-closing');
      if (teardownFn) teardownFn();
    }, reduced ? 200 : 600);
  }

  function bindInfoPanel() {
    infoPanelClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerOrbitClose(infoPanel, infoPanelClose, closeInfoPanel);
    });
    infoPanelOverlay.addEventListener("click", () => {
      triggerOrbitClose(infoPanel, infoPanelClose, closeInfoPanel);
    });
  }

  /* ==============================================
     GUIDE MODAL
  ============================================== */
  function bindGuideModal() {
    const closeGuide = () => { guideModal.hidden = true; };
    guideBtn.addEventListener("click", () => { guideModal.hidden = false; });
    guideModalClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerOrbitClose(guideModal, guideModalClose, closeGuide);
    });
    guideModal.addEventListener("click", (e) => {
      if (e.target === guideModal) triggerOrbitClose(guideModal, guideModalClose, closeGuide);
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
    if (!AWARDS_DB) return;
    const idx = {};

    FESTIVAL_KEYS.forEach(fKey => {
      const fest = AWARDS_DB[fKey];
      if (!fest) return;
      Object.keys(fest).forEach(cat => {
        const catData = fest[cat];
        if (!catData) return;
        Object.keys(catData).forEach(yr => {
          const yearData = catData[yr];
          if (!yearData) return;
          const year = parseInt(yr, 10);
          if (!inScope(year)) return;

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
    if (window.renderAwardBadges) window.renderAwardBadges(tip);
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
      const festivalId = window.detectFestivalId ? window.detectFestivalId(a.festival) : null;
      const status = a.isWinner ? "winner" : "nominee";
      const badgeHtml = festivalId
        ? `<div class="orbit-award-badge" data-award-badge="${festivalId}" data-status="${status}" data-size="14" title="${getFestivalShortName(a.festival)} ${a.isWinner ? 'Winner' : 'Nominee'}"></div>`
        : "";
      const festName = getFestivalShortName(a.festival);
      const badgeLabel = a.isWinner ? "Winner" : "Nom";

      html += `<div class="awards-tooltip-row ${rowClass}">
        ${badgeHtml}
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

  /* Build orbit-style badge HTML using the new award-badge component */
  function buildBadge(isWinner, festivalKey) {
    const festivalId = window.detectFestivalId ? window.detectFestivalId(festivalKey) : null;
    const status = isWinner ? "winner" : "nominee";
    const size = isWinner ? "32" : "24";
    if (festivalId) {
      return `<div class="orbit-award-badge" data-award-badge="${festivalId}" data-status="${status}" data-size="${size}" title="${festivalKey} ${isWinner ? 'Winner' : 'Nominee'}"></div>`;
    }
    // Fallback: simple dot
    const rings = `<div class="badge-ring-outer"></div><div class="badge-ring-inner"></div>`;
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

  /* ============================================================
     LANDMARK FEATURES — Added 2026-05-05 (Prompt 1)
     Cannes-Amber identity layer:
       • Ceremony banner with landmark count
       • Toggleable landmark prose strip
       • Notable dots on landmark wins
       • Role-tag overlay on movie tiles (picture/director/actor/craft)
       • Festival-specific tile glow
     Truth files at ../data/reference/{slug}-landmark-truth.json
     handle two ceremony schemas:
       (a) Ceremony-numbered (Oscar / BAFTA / GG): keys "72", "73"…
       (b) Year-keyed (Cannes / Venice / Berlin): keys "2000", "2001"…
     ============================================================ */

  const truthCache = {};
  let landmarkStripVisible = false;
  let landmarkUpdateToken = 0;

  function getFestivalTruthSlug(key) {
    const map = { Oscar: 'oscar', BAFTA: 'bafta', GoldenGlobe: 'gg', Cannes: 'cannes', Venice: 'venice', Berlin: 'berlin' };
    return map[key] || '';
  }

  function getFestivalGlowSlug(key) {
    const map = { Oscar: 'oscar', Cannes: 'cannes', Venice: 'venice', Berlin: 'berlin', BAFTA: 'bafta', GoldenGlobe: 'globe' };
    return map[key] || '';
  }

  function getCeremonyName(key) {
    const map = {
      Oscar: 'Academy Awards',
      BAFTA: 'BAFTA Film Awards',
      GoldenGlobe: 'Golden Globes',
      Cannes: 'Cannes Film Festival',
      Venice: 'Venice Film Festival',
      Berlin: 'Berlin Film Festival'
    };
    return map[key] || key;
  }

  function ordinalSuffix(n) {
    const v = n % 100;
    if (v >= 11 && v <= 13) return n + 'th';
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }

  function slugifyCategory(cat) {
    if (!cat) return '';
    return cat.toLowerCase()
      .replace(/['‘’ʼ]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  async function getFestivalTruth(festivalKey) {
    const slug = getFestivalTruthSlug(festivalKey);
    if (!slug) return null;
    if (truthCache[slug] !== undefined) return truthCache[slug];
    try {
      const resp = await fetch(`../data/reference/${slug}-landmark-truth.json`);
      if (!resp.ok) {
        console.warn(`[awards-browse] Landmark truth not found for ${festivalKey} (${slug})`);
        truthCache[slug] = null;
        return null;
      }
      truthCache[slug] = await resp.json();
      return truthCache[slug];
    } catch (err) {
      console.error(`[awards-browse] Error loading truth for ${festivalKey}:`, err);
      truthCache[slug] = null;
      return null;
    }
  }

  /* Find a ceremony entry for the given year, handling both schema shapes:
       (a) keys are ceremony numbers — match by ceremony.ceremony_year
       (b) keys are years — direct lookup
     Returns { ceremonyKey, ceremony } or null. */
  function findCeremonyByYear(truth, year) {
    if (!truth || !truth.ceremonies) return null;
    const direct = truth.ceremonies[String(year)];
    if (direct && (direct.ceremony_year === year || !direct.ceremony_year)) {
      return { ceremonyKey: String(year), ceremony: direct };
    }
    for (const [k, v] of Object.entries(truth.ceremonies)) {
      if (v && v.ceremony_year === year) {
        return { ceremonyKey: k, ceremony: v };
      }
    }
    return null;
  }

  /* Returns { ceremony, ordinal, landmarks: [{key, catSlug, note, winner_film, winner_recipient}] }
     ordinal is the formatted ceremony ordinal (e.g. "96th") for ceremony-numbered
     festivals; null otherwise. */
  async function loadLandmarks(festivalKey, year) {
    const truth = await getFestivalTruth(festivalKey);
    if (!truth) return null;
    const found = findCeremonyByYear(truth, year);
    if (!found) return { ceremony: null, ordinal: null, landmarks: [] };

    const { ceremonyKey, ceremony } = found;
    const isCeremonyNumbered = /^\d+$/.test(ceremonyKey) && parseInt(ceremonyKey, 10) < 200;
    const ordinal = isCeremonyNumbered ? ordinalSuffix(parseInt(ceremonyKey, 10)) : null;

    const landmarks = [];
    if (ceremony.landmarks) {
      Object.entries(ceremony.landmarks).forEach(([key, data]) => {
        if (data && data.notable && data.note) {
          const dotIdx = key.indexOf('.');
          const catSlug = dotIdx >= 0 ? key.slice(dotIdx + 1) : key;
          landmarks.push({
            key,
            catSlug,
            note: data.note,
            winner_film: data.winner_film || null,
            winner_recipient: data.winner_recipient || null
          });
        }
      });
    }
    return { ceremony, ordinal, landmarks };
  }

  /* Map an award category label to a role-tag class. */
  function getCategoryRole(category) {
    if (!category) return 'role-craft';
    if (/Picture|Film|Drama|Comedy\/Musical|Palme|Lion|Bear/i.test(category)) return 'role-picture';
    if (/Director/i.test(category)) return 'role-director';
    if (/Actor|Actress/i.test(category)) return 'role-actor';
    return 'role-craft';
  }

  function roleLabelFromClass(roleClass) {
    switch (roleClass) {
      case 'role-picture': return 'Picture';
      case 'role-director': return 'Director';
      case 'role-actor': return 'Actor';
      default: return 'Craft';
    }
  }

  /* Combine landmark notes into prose. Each note is wrapped as a sentence. */
  function combineLandmarkNotes(landmarks) {
    if (!landmarks || !landmarks.length) return '';
    return landmarks.map(lm => {
      let txt = (lm.note || '').trim();
      if (!txt) return '';
      if (!/[.!?]$/.test(txt)) txt += '.';
      return escapeHtml(txt);
    }).filter(Boolean).join(' ');
  }

  /* Create the ceremony banner and landmark strip elements once,
     inserting them above resultsContainer inside .results-area. */
  function ensureLandmarkUI() {
    const awardsLayout = document.querySelector('.awards-layout');
    if (!awardsLayout || document.getElementById('ceremonyBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'ceremonyBanner';
    banner.className = 'ceremony-banner';
    banner.style.display = 'none';
    banner.innerHTML = `
      <div class="ceremony-banner-info">
        <div class="ceremony-banner-title"></div>
        <div class="ceremony-banner-meta"></div>
      </div>
      <button class="landmark-btn" type="button" aria-expanded="false">
        <span class="og og-sparkle landmark-btn-glyph" aria-hidden="true"></span>
        <span class="landmark-btn-count">0</span>
        <span class="landmark-btn-label">Landmark Moments</span>
      </button>`;

    const strip = document.createElement('div');
    strip.id = 'landmarkStrip';
    strip.className = 'landmark-strip';
    strip.innerHTML = `
      <span class="og og-sparkle landmark-strip-icon" aria-hidden="true"></span>
      <div class="landmark-strip-prose"></div>`;

    awardsLayout.parentNode.insertBefore(banner, awardsLayout);
    awardsLayout.parentNode.insertBefore(strip, awardsLayout);

    banner.querySelector('.landmark-btn').addEventListener('click', () => {
      const btn = banner.querySelector('.landmark-btn');
      if (btn.classList.contains('is-empty')) return;
      landmarkStripVisible = !landmarkStripVisible;
      strip.classList.toggle('is-visible', landmarkStripVisible);
      btn.setAttribute('aria-expanded', String(landmarkStripVisible));
    });
  }

  /* Show/hide the ceremony banner + landmark strip.
     Visible only when exactly 1 festival is selected AND a specific year is chosen. */
  async function updateLandmarkUI() {
    const banner = document.getElementById('ceremonyBanner');
    const strip = document.getElementById('landmarkStrip');
    if (!banner || !strip) return;

    const token = ++landmarkUpdateToken;

    const oneFest = selectedFestivals.size === 1;
    const oneYear = currentYear !== null;
    if (!oneFest || !oneYear) {
      banner.style.display = 'none';
      strip.classList.remove('is-visible');
      landmarkStripVisible = false;
      return;
    }

    const fest = Array.from(selectedFestivals)[0];
    const year = currentYear;

    // Hide banner during load so a stale ceremony never flashes between selections
    banner.style.display = 'none';
    strip.classList.remove('is-visible');

    const result = await loadLandmarks(fest, year);
    if (token !== landmarkUpdateToken) return; // a newer call superseded this one
    if (!result) {
      banner.style.display = 'none';
      strip.classList.remove('is-visible');
      return;
    }

    const { ceremony, ordinal, landmarks } = result;
    const titleEl = banner.querySelector('.ceremony-banner-title');
    const metaEl = banner.querySelector('.ceremony-banner-meta');
    const countEl = banner.querySelector('.landmark-btn-count');
    const labelEl = banner.querySelector('.landmark-btn-label');
    const btn = banner.querySelector('.landmark-btn');

    const festName = getFestivalShortName(fest);
    const refYear = (ceremony && ceremony.ceremony_year) || year;
    titleEl.textContent = ordinal
      ? `${ordinal} ${getCeremonyName(fest)} — ${festName} ${refYear}`
      : `${getCeremonyName(fest)} — ${festName} ${refYear}`;

    const metaParts = [];
    if (ceremony && ceremony.date) metaParts.push(ceremony.date);
    if (ceremony && ceremony.venue) metaParts.push(ceremony.venue);
    metaEl.textContent = metaParts.join(' · ');
    metaEl.style.display = metaParts.length ? '' : 'none';

    const count = landmarks.length;
    countEl.textContent = String(count);
    labelEl.textContent = count === 1 ? 'Landmark Moment' : 'Landmark Moments';
    btn.classList.toggle('is-empty', count === 0);
    btn.setAttribute('aria-expanded', String(landmarkStripVisible && count > 0));

    banner.style.display = 'flex';

    const proseEl = strip.querySelector('.landmark-strip-prose');
    proseEl.innerHTML = combineLandmarkNotes(landmarks);

    if (count === 0) {
      strip.classList.remove('is-visible');
      landmarkStripVisible = false;
    } else {
      strip.classList.toggle('is-visible', landmarkStripVisible);
    }
  }

  /* Walk rendered tiles and apply notable dots + role-tag overlays.
     Batches truth-file lookups per festival+year. */
  async function decorateTilesWithLandmarks() {
    if (!resultsContainer) return;
    const tiles = resultsContainer.querySelectorAll('.award-tile[data-festival][data-year]');
    if (!tiles.length) return;

    // Add role tags to movie tiles (skip person tiles which already carry .role-tag)
    tiles.forEach(tile => {
      if (tile.querySelector('.role-tag')) return;
      const cat = tile.dataset.category || '';
      const roleClass = getCategoryRole(cat);
      const tag = document.createElement('div');
      tag.className = `role-tag ${roleClass}`;
      tag.textContent = roleLabelFromClass(roleClass);
      const host = tile.querySelector('.award-tile-poster') || tile;
      const cs = window.getComputedStyle(host);
      if (cs.position === 'static') host.style.position = 'relative';
      host.appendChild(tag);
    });

    // Group tiles by festival+year for batched landmark lookups
    const groups = new Map();
    tiles.forEach(tile => {
      const fest = tile.dataset.festival;
      const year = parseInt(tile.dataset.year, 10);
      if (!fest || !year) return;
      const key = `${fest}|${year}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(tile);
    });

    for (const [key, list] of groups.entries()) {
      const [fest, yearStr] = key.split('|');
      const year = parseInt(yearStr, 10);
      const result = await loadLandmarks(fest, year);
      if (!result || !result.landmarks.length) continue;

      const landmarkMap = {};
      result.landmarks.forEach(lm => { landmarkMap[lm.catSlug] = lm; });

      list.forEach(tile => {
        // Notable dot only on winner tiles whose category has a landmark note
        const isWinner = tile.classList.contains('winner-tile');
        if (!isWinner) return;
        const catSlug = slugifyCategory(tile.dataset.category || '');
        const lm = landmarkMap[catSlug];
        if (!lm) return;
        if (tile.querySelector('.tile-notable-dot')) return;
        const dot = document.createElement('div');
        dot.className = 'tile-notable-dot';
        dot.title = lm.note;
        const host = tile.querySelector('.award-tile-poster') || tile;
        const cs = window.getComputedStyle(host);
        if (cs.position === 'static') host.style.position = 'relative';
        // Avoid colliding with the role-tag which also anchors top-left
        if (host.querySelector('.role-tag')) dot.style.top = '28px';
        host.appendChild(dot);
      });
    }
  }

})();
