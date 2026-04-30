/* ============================================
   ORBIT — Quick Search Modal
   Ported from inline quick search in index.html.
   Opens via tile click or Cmd+K / Ctrl+K.
============================================ */

(function () {
  'use strict';

  /* ── Constants ── */
  var CREW_DEPTS = ['Directing','Writing','Production','Camera','Editing','Sound','Art','Costume & Make-Up'];
  var PLACEHOLDERS = {
    movie: 'Search movies\u2026',
    actor: 'Search actors\u2026',
    crew:  'Search directors, writers, producers\u2026'
  };
  var HINTS = {
    movie: ['Oppenheimer', 'Parasite', 'The Godfather'],
    actor: ['Cate Blanchett', 'Denzel Washington', 'Saoirse Ronan'],
    crew:  ['Christopher Nolan', 'Greta Gerwig', 'Roger Deakins']
  };

  /* ── DOM refs ── */
  var backdrop = document.getElementById('qsBackdrop');
  var modal    = backdrop && backdrop.querySelector('.qs-modal');
  var input    = document.getElementById('qsModalInput');
  var results  = document.getElementById('qsResults');
  var tile     = document.getElementById('qsTile');
  var typePills;

  if (!backdrop || !input || !results) return;
  typePills = backdrop.querySelectorAll('.qs-type-pill');

  /* ── State ── */
  var debounceTimer = null;
  var fetchController = null;
  var searchVersion = 0;
  var focusedIdx = -1;
  var currentResults = [];

  /* ============================================================
     CAST STRIP STATE — Added 2026-04-30
     Multi-person staging area (max 4) for joint timeline / Venn.
     Person tabs only — movie tab does not interact with cast.
     ============================================================ */
  /* localStorage keys touched on joint navigation:
     - timelineMovieId (string ID): anchor person ID — read by timeline.js
     - timelineType ("person"): tells timeline.js to load person
     - timelinePendingPeople (JSON array of IDs): additional people to load
       after the anchor — read & cleared by timeline.js
     - vennPeople (JSON array of {id,name}): people set for venn.js
     All keys are pre-existing — see data/storage-keys.md. */
  var QS_CAST_STORAGE_KEY = 'qs_cast_v1'; /* sessionStorage — cleared on tab close */
  var qsCast = []; /* { id, name, initials, department, profile_path } */
  try {
    var savedCast = sessionStorage.getItem(QS_CAST_STORAGE_KEY);
    if (savedCast) {
      var parsed = JSON.parse(savedCast);
      if (Array.isArray(parsed)) qsCast = parsed.slice(0, 4);
    }
  } catch (e) { /* sessionStorage unavailable */ }
  function persistCast() {
    try { sessionStorage.setItem(QS_CAST_STORAGE_KEY, JSON.stringify(qsCast)); }
    catch (e) { /* quota or unavailable */ }
  }
  var QS_CAST_COLOURS = ['var(--accent-cyan)', 'var(--accent-gold)', 'var(--success-green)', 'var(--prestige-purple)'];
  var QS_CAST_MAX = 4;
  var castDragSrcIdx = -1;
  var lastCollabAnchorId = null; /* anchor id whose collab list is currently rendered */

  /* ── Awards lookup (graceful) ── */
  var awardsDb = null;
  try {
    if (typeof AWARDS_BROWSE_DATABASE !== 'undefined') awardsDb = AWARDS_BROWSE_DATABASE;
  } catch (e) { /* ignore */ }

  function getAwardBadge(type, id) {
    if (!awardsDb) return '';
    try {
      if (type === 'movie') {
        var festivals = ['Oscar','Cannes','Venice','Berlin','BAFTA','GoldenGlobe'];
        for (var f = 0; f < festivals.length; f++) {
          var fest = festivals[f];
          var cats = awardsDb[fest];
          if (!cats) continue;
          for (var cat in cats) {
            var years = cats[cat];
            for (var yr in years) {
              var entry = years[yr];
              if (entry.winner && entry.winner.tmdb_id === id) {
                var label = fest === 'GoldenGlobe' ? 'Golden Globe' : fest;
                return '<span class="qs-award-badge">\uD83C\uDFC6 ' + label + ' ' + cat + '</span>';
              }
            }
          }
        }
      }
    } catch (e) { /* graceful fallback */ }
    return '';
  }

  /* ── Open / Close ── */

  function openModal() {
    backdrop.classList.add('qs-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 50);
    /* Restore cast UI if state persisted from a prior open. If the user has
       a cast, drop them back into the anchor's collaborators view rather
       than the empty hint pills (option b). */
    renderCastStrip();
    if (qsCast.length > 0) {
      lastCollabAnchorId = null; /* force re-render */
      refreshAnchorView();
    } else {
      showEmpty();
    }
  }

  function closeModal() {
    backdrop.classList.remove('qs-open');
    document.body.style.overflow = '';
    input.value = '';
    clearTimeout(debounceTimer);
    if (fetchController) { fetchController.abort(); fetchController = null; }
    searchVersion++;
    focusedIdx = -1;
    currentResults = [];
    showEmpty();
  }

  /* Rule 17: trigger Black Hole exit, then run closeModal teardown */
  function triggerOrbitClose() {
    var btn = document.getElementById('qsCloseBtn');
    if (backdrop.classList.contains('orbit-popup-closing')) return;
    if (btn) btn.classList.add('closing');
    backdrop.classList.add('orbit-popup-closing');
    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      if (btn) btn.classList.remove('closing');
      backdrop.classList.remove('orbit-popup-closing');
      closeModal();
    }, reduced ? 200 : 600);
  }

  function isOpen() {
    return backdrop.classList.contains('qs-open');
  }

  /* ── Tile click ── */
  if (tile) {
    tile.addEventListener('click', function () { openModal(); });
  }

  /* ── Cmd+K / Ctrl+K ── */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen()) triggerOrbitClose(); else openModal();
    }
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      triggerOrbitClose();
    }
  });

  /* ── Backdrop click ── */
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) triggerOrbitClose();
  });

  /* ── Close button ── */
  var closeBtn = document.getElementById('qsCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      triggerOrbitClose();
    });
  }

  /* ── Type pills ── */
  typePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      typePills.forEach(function (p) { p.classList.remove('qs-active'); });
      this.classList.add('qs-active');
      input.placeholder = PLACEHOLDERS[this.dataset.type] || 'Search\u2026';
      // Preserve the user's typed query when switching types so they don't
      // have to retype on a mode mistake. Re-run the search under the new
      // type if there's something to search.
      clearTimeout(debounceTimer);
      if (fetchController) { fetchController.abort(); fetchController = null; }
      searchVersion++;
      focusedIdx = -1;
      var q = input.value.trim();
      if (q.length >= 2) {
        fetchResults(q);
      } else {
        showEmpty();
      }
      input.focus();
    });
  });

  /* ── Input ── */
  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var q = input.value.trim();
    if (q.length < 2) { showEmpty(); return; }
    debounceTimer = setTimeout(function () { fetchResults(q); }, 300);
  });

  /* ── Keyboard nav ── */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length) setFocus(focusedIdx + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length) setFocus(focusedIdx - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var idx = focusedIdx >= 0 ? focusedIdx : 0;
      if (currentResults[idx]) selectResult(currentResults[idx]);
    }
  });

  function setFocus(idx) {
    if (idx < 0) idx = currentResults.length - 1;
    if (idx >= currentResults.length) idx = 0;
    focusedIdx = idx;
    var rows = results.querySelectorAll('.qs-result-row');
    rows.forEach(function (r, i) {
      r.classList.toggle('qs-focused', i === idx);
    });
    if (rows[idx]) rows[idx].scrollIntoView({ block: 'nearest' });
  }

  /* ── Empty state ── */
  function showEmpty() {
    var type = getType();
    var hints = HINTS[type] || HINTS.movie;
    results.innerHTML =
      '<div class="qs-empty">' +
        '<svg class="qs-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
          '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>' +
        '</svg>' +
        '<div class="qs-empty-text">Try searching for a ' + type + '</div>' +
        '<div class="qs-hint-pills">' +
          hints.map(function (h) {
            return '<button class="qs-hint-pill" data-hint="' + h.replace(/"/g, '&quot;') + '">' + h + '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    results.querySelectorAll('.qs-hint-pill').forEach(function (pill) {
      pill.addEventListener('click', async function () {
        var hint = this.dataset.hint;
        input.value = hint;
        // Run the search immediately (skip the 300ms debounce) and auto-select
        // the top result. This treats a hint click as "I want this thing" — for
        // movies it navigates straight to timeline; for actors/crew it lands
        // on the collaborators panel where the "Go to timeline →" button lives.
        clearTimeout(debounceTimer);
        if (fetchController) { fetchController.abort(); fetchController = null; }
        searchVersion++;
        focusedIdx = -1;

        // Orbit-themed portal animation while the search + auto-select happens.
        // Cyan / purple / gold rings around a pulsing cosmic core.
        var portalHTML =
          '<div class="qs-portal">' +
            '<div class="qs-portal-stage">' +
              '<div class="qs-portal-ring qs-portal-ring-3"></div>' +
              '<div class="qs-portal-ring qs-portal-ring-2"></div>' +
              '<div class="qs-portal-ring qs-portal-ring-1"></div>' +
              '<div class="qs-portal-core"></div>' +
            '</div>' +
            '<div class="qs-portal-label">Charting orbit…</div>' +
          '</div>';
        results.innerHTML = portalHTML;

        await fetchResults(hint);

        if (currentResults.length > 0) {
          // Re-render the portal so the result rows that fetchResults injected
          // don't flash before the auto-select fires. Short hold so the orbital
          // animation reads, then selectResult navigates (movie) or shows the
          // collaborators panel (actor/crew).
          results.innerHTML = portalHTML;
          var topResult = currentResults[0];
          setTimeout(function () { selectResult(topResult); }, 280);
        } else {
          showEmpty();
        }
      });
    });
    currentResults = [];
    focusedIdx = -1;
  }

  /* ── Helpers ── */
  function getType() {
    var active = backdrop.querySelector('.qs-type-pill.qs-active');
    return active ? active.dataset.type : 'movie';
  }

  /* ── Fetch ── */
  async function fetchResults(query) {
    var type = getType();
    var version = ++searchVersion;
    var endpoint;
    switch (type) {
      case 'movie': endpoint = '/search/movie'; break;
      case 'actor': case 'crew': endpoint = '/search/person'; break;
      default: return;
    }
    if (fetchController) fetchController.abort();
    fetchController = new AbortController();
    try {
      var res = await fetch(
        'https://api.themoviedb.org/3' + endpoint +
        '?api_key=' + TMDB_API_KEY +
        '&query=' + encodeURIComponent(query),
        { signal: fetchController.signal }
      );
      var data = await res.json();
      if (version !== searchVersion || getType() !== type) return;
      var items = data.results || [];
      if (type === 'actor') items = items.filter(function (p) { return p.known_for_department === 'Acting'; });
      else if (type === 'crew') items = items.filter(function (p) { return CREW_DEPTS.indexOf(p.known_for_department) !== -1; });
      renderResults(items.slice(0, 8), type);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      fetchController = null;
    }
  }

  /* ── Render ── */
  function renderResults(items, type) {
    if (!items.length) {
      results.innerHTML =
        '<div class="qs-empty">' +
          '<div class="qs-empty-text">No results found</div>' +
        '</div>';
      currentResults = [];
      focusedIdx = -1;
      return;
    }
    currentResults = items.map(function (item) {
      return { id: item.id, type: type, title: item.title || item.name, raw: item };
    });
    focusedIdx = -1;

    results.innerHTML = items.map(function (item, idx) {
      var title, sub, imgHtml, ratingHtml = '', badgeHtml = '';

      if (type === 'movie') {
        title = item.title || '';
        sub = item.release_date ? item.release_date.split('-')[0] : '';
        var rating = item.vote_average;
        if (rating && rating > 0) ratingHtml = '<span class="qs-result-rating">\u2605 ' + rating.toFixed(1) + '</span>';
        badgeHtml = getAwardBadge('movie', item.id);
        if (item.poster_path) {
          imgHtml = '<img src="https://image.tmdb.org/t/p/w92' + item.poster_path + '" class="qs-result-poster" onerror="this.style.display=\'none\'">';
        } else {
          imgHtml = '<div class="qs-result-poster-empty">\uD83C\uDFAC</div>';
        }
      } else {
        title = item.name || '';
        sub = type === 'crew' ? (item.known_for_department || 'Crew') :
              (item.known_for || []).map(function (k) { return k.title || k.name; }).slice(0, 2).join(', ') || 'Actor';
        if (item.profile_path) {
          imgHtml = '<img src="https://image.tmdb.org/t/p/w92' + item.profile_path + '" class="qs-result-photo" onerror="this.style.display=\'none\'">';
        } else {
          imgHtml = '<div class="qs-result-photo-empty">\uD83D\uDC64</div>';
        }
      }

      return '<div class="qs-result-row" data-idx="' + idx + '">' +
        imgHtml +
        '<div class="qs-result-info">' +
          '<div class="qs-result-title">' + esc(title) + ratingHtml + badgeHtml + '</div>' +
          '<div class="qs-result-sub">' + esc(sub) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    results.querySelectorAll('.qs-result-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        var i = parseInt(this.dataset.idx, 10);
        if (currentResults[i]) selectResult(currentResults[i]);
      });
      row.addEventListener('mouseenter', function () {
        var i = parseInt(this.dataset.idx, 10);
        focusedIdx = i;
        results.querySelectorAll('.qs-result-row').forEach(function (r, ri) {
          r.classList.toggle('qs-focused', ri === i);
        });
      });
    });
  }

  /* ── Select ── */
  async function selectResult(item) {
    if (!item) return;
    var tab = getType();
    if (tab === 'movie' && item.type === 'movie') {
      navigateTo(item);
      return;
    }
    /* Person flow: selecting auto-adds them to the cast (no candidate /
       confirm step). The cast row appears immediately with the Search
       Timeline CTA, and the collab panel renders below. If the person
       is already in the cast or the cast is full, fall back to just
       showing the panel. */
    if (!inCast(item.id) && qsCast.length < QS_CAST_MAX) {
      addToCast({
        id: item.id,
        name: item.title,
        department: (item.raw && item.raw.known_for_department) || '',
        profile_path: (item.raw && item.raw.profile_path) || ''
      });
      return;
    }
    showCollaborators(item);
  }

  /* ============================================================
     CAST STRIP HELPERS — Added 2026-04-30
     ============================================================ */

  function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0].charAt(0) : '';
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  function inCast(personId) {
    for (var i = 0; i < qsCast.length; i++) {
      if (String(qsCast[i].id) === String(personId)) return true;
    }
    return false;
  }

  function addToCast(person) {
    if (!person || person.id == null) return;
    if (inCast(person.id)) return;
    if (qsCast.length >= QS_CAST_MAX) return;
    var record = {
      id: person.id,
      name: person.name,
      initials: getInitials(person.name),
      department: person.department || '',
      profile_path: person.profile_path || ''
    };
    qsCast.push(record);
    persistCast();
    renderCastStrip();
    /* Clear the search input + refocus so the user can search the next
       person without manually clearing. */
    input.value = '';
    clearTimeout(debounceTimer);
    if (fetchController) { fetchController.abort(); fetchController = null; }
    searchVersion++;
    focusedIdx = -1;
    /* Always re-render the persistent cast stage so the new row appears. */
    renderCollabCastList();
    /* If a collab panel is currently visible (user is on it — e.g. clicked
       + Add from a collaborator row), update its candidate / CTAs in place
       so "the collaborators remain" without a refetch. Otherwise (e.g. user
       just clicked a search result and the results list was showing), drop
       them into the newly-added person's collab view. */
    if (document.getElementById('qsCollabList')) {
      renderCollabCandidate({
        id: record.id,
        title: record.name,
        raw: { profile_path: record.profile_path, known_for_department: record.department }
      });
      updateCollabRowCtas();
    } else {
      showCollaborators({
        id: record.id,
        type: 'actor',
        title: record.name,
        raw: { profile_path: record.profile_path, known_for_department: record.department }
      });
    }
    input.focus();
  }

  function clearAllCast() {
    if (qsCast.length === 0) return;
    qsCast = [];
    persistCast();
    lastCollabAnchorId = null;
    renderCollabCastList();
    showEmpty();
    input.focus();
  }

  function removeFromCast(personId) {
    /* If the removed person is the one whose collabs are currently
       displayed, we need to refetch (their collab list is no longer
       "their" cast). Otherwise just patch the DOM in place. */
    var wasShownCollab = String(lastCollabAnchorId) === String(personId);
    qsCast = qsCast.filter(function (p) { return String(p.id) !== String(personId); });
    persistCast();
    renderCastStrip();

    if (qsCast.length === 0) {
      lastCollabAnchorId = null;
      renderCollabCastList(); /* hide the persistent stage */
      showEmpty();
      return;
    }

    if (wasShownCollab) {
      var anchor = qsCast[0];
      showCollaborators({
        id: anchor.id,
        type: 'actor',
        title: anchor.name,
        raw: { profile_path: anchor.profile_path, known_for_department: anchor.department }
      });
    } else {
      renderCollabCastList();
      updateCollabRowCtas();
    }
  }

  /* Used by drag-reorder. Re-renders the cast list in place (which reflects
     the new ordering) and refetches collabs only if the anchor changed
     AND the prior collab subject is no longer the anchor. */
  function refreshAnchorView() {
    if (qsCast.length === 0) {
      lastCollabAnchorId = null;
      showEmpty();
      return;
    }
    var anchor = qsCast[0];
    if (lastCollabAnchorId === anchor.id) {
      renderCollabCastList();
      updateCollabRowCtas();
      return;
    }
    showCollaborators({
      id: anchor.id,
      type: 'actor',
      title: anchor.name,
      raw: { profile_path: anchor.profile_path, known_for_department: anchor.department }
    });
  }

  function renderCastStrip() {
    /* The standalone "YOUR CAST" chip strip was removed — the cast list
       now lives only inside the collab panel. Keep the joint-button
       visibility update so add/remove still toggle the footer buttons,
       then bail out before touching the deleted markup. */
    updateJointButtons();
    var strip = document.getElementById('qsCastStrip');
    var chips = document.getElementById('qsCastChips');
    var count = document.getElementById('qsCastCount');
    if (!strip || !chips || !count) return;

    if (qsCast.length === 0) {
      strip.style.display = 'none';
      chips.innerHTML = '';
      updateJointButtons();
      return;
    }

    strip.style.display = '';
    count.textContent = qsCast.length;

    chips.innerHTML = qsCast.map(function (p, idx) {
      var colour = QS_CAST_COLOURS[idx % QS_CAST_COLOURS.length];
      var anchorClass = idx === 0 ? ' qs-chip-anchor' : '';
      return '<div class="qs-chip' + anchorClass + '" draggable="true" ' +
             'data-person-id="' + esc(String(p.id)) + '" data-idx="' + idx + '" ' +
             'style="border-color:' + colour + '">' +
        '<span class="qs-chip-grip">&#10303;</span>' +
        '<div class="qs-chip-avatar" style="background:' + colour + '">' + esc(p.initials) + '</div>' +
        '<span class="qs-chip-name">' + esc(p.name) + '</span>' +
        '<span class="qs-chip-timeline" data-person-id="' + esc(String(p.id)) + '">Timeline &rarr;</span>' +
        '<span class="qs-chip-remove" data-person-id="' + esc(String(p.id)) + '">&times;</span>' +
      '</div>';
    }).join('');

    /* Wire chip events */
    chips.querySelectorAll('.qs-chip-timeline').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var pid = this.dataset.personId;
        navigateTo({ id: pid, type: 'actor', title: '' });
      });
    });
    chips.querySelectorAll('.qs-chip-remove').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        removeFromCast(this.dataset.personId);
      });
    });

    /* Wire drag-to-reorder (insert-at-position semantics) */
    chips.querySelectorAll('.qs-chip').forEach(function (chip) {
      chip.addEventListener('dragstart', function (e) {
        castDragSrcIdx = parseInt(this.dataset.idx, 10);
        this.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', String(castDragSrcIdx)); } catch (err) { /* IE quirk */ }
        }
      });
      chip.addEventListener('dragend', function () {
        this.classList.remove('dragging');
        chips.querySelectorAll('.qs-chip').forEach(function (c) { c.classList.remove('drag-over'); });
        castDragSrcIdx = -1;
      });
      chip.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
      });
      chip.addEventListener('dragleave', function () {
        this.classList.remove('drag-over');
      });
      chip.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        var srcIdx = castDragSrcIdx;
        var tgtIdx = parseInt(this.dataset.idx, 10);
        if (srcIdx < 0 || isNaN(tgtIdx) || srcIdx === tgtIdx) return;
        var moved = qsCast.splice(srcIdx, 1)[0];
        qsCast.splice(tgtIdx, 0, moved);
        persistCast();
        renderCastStrip();
        refreshAnchorView();
      });
    });

    updateJointButtons();
  }

  function updateJointButtons() {
    var jt = document.getElementById('qsJointTimeline');
    var jv = document.getElementById('qsJointVenn');
    var show = qsCast.length >= 2;
    if (jt) jt.style.display = show ? '' : 'none';
    if (jv) jv.style.display = show ? '' : 'none';
  }

  /* In-place CTA refresh for the currently-rendered collaborators view. */
  function updateCollabRowCtas() {
    var collabList = document.getElementById('qsCollabList');
    if (!collabList) return;
    collabList.querySelectorAll('.qs-collab-row').forEach(function (row) {
      var pid = row.dataset.personId;
      if (!pid) return;
      var cta = row.querySelector('.qs-collab-cta');
      if (!cta) return;
      cta.outerHTML = collabCtaHtml(pid);
    });
    /* Re-wire add buttons; pull person info from the row dataset so we
       don't need to keep topCollabs in scope. */
    collabList.querySelectorAll('.qs-add-btn[data-collab-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var row = this.closest('.qs-collab-row');
        if (!row) return;
        addToCast({
          id: row.dataset.personId,
          name: row.dataset.personName,
          department: row.dataset.personDept || '',
          profile_path: row.dataset.personPp || ''
        });
      });
    });
  }

  function updateCollabHeader() {
    var hdr = document.getElementById('qsCollabHeaderLabel');
    if (hdr && qsCast.length > 0) {
      hdr.textContent = qsCast[0].name.toUpperCase() + ' · FREQUENT COLLABORATORS';
    }
  }

  /* Render the stacked cast list into the persistent stage above the
     results area. Survives across search/collab re-renders so the rows
     stay visible while the user types another query. */
  function renderCollabCastList() {
    var castEl = document.getElementById('qsCastStage');
    if (!castEl) return;
    if (qsCast.length === 0) {
      castEl.style.display = 'none';
      castEl.innerHTML = '';
      updateJointButtons();
      return;
    }
    castEl.style.display = '';
    var rowsHtml = qsCast.map(function (p, idx) {
      var isAnchor = idx === 0;
      var avatarHtml = p.profile_path
        ? '<img src="https://image.tmdb.org/t/p/w92' + p.profile_path + '" class="qs-collab-cast-avatar" onerror="this.style.display=\'none\'">'
        : '<div class="qs-collab-cast-avatar qs-collab-cast-avatar-empty">' + esc(p.initials) + '</div>';
      return '<div class="qs-collab-cast-row' + (isAnchor ? ' qs-collab-cast-anchor' : '') + '" data-person-id="' + esc(String(p.id)) + '">' +
        avatarHtml +
        '<div class="qs-collab-cast-info">' +
          '<div class="qs-collab-cast-name">' + esc(p.name) + '</div>' +
          '<div class="qs-collab-cast-dept">' + esc(p.department || '') + '</div>' +
        '</div>' +
        '<button class="qs-search-timeline-btn" data-cast-timeline="' + esc(String(p.id)) + '">Search Timeline →</button>' +
        '<span class="qs-collab-cast-remove" data-cast-remove="' + esc(String(p.id)) + '" title="Remove from cast">×</span>' +
      '</div>';
    }).join('');
    castEl.innerHTML = rowsHtml +
      '<button class="qs-cast-clear" id="qsCastClear" type="button">Clear all</button>';

    var clearBtn = castEl.querySelector('#qsCastClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearAllCast();
      });
    }

    castEl.querySelectorAll('[data-cast-timeline]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var pid = this.dataset.castTimeline;
        var person = null;
        for (var i = 0; i < qsCast.length; i++) {
          if (String(qsCast[i].id) === pid) { person = qsCast[i]; break; }
        }
        navigateTo({ id: pid, type: 'actor', title: person ? person.name : '' });
      });
    });
    castEl.querySelectorAll('[data-cast-remove]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        removeFromCast(this.dataset.castRemove);
      });
    });
    updateJointButtons();
  }

  /* Render the candidate row for a searched person not yet in cast. If
     they are already in cast, hide it. */
  function renderCollabCandidate(item) {
    var candEl = document.getElementById('qsCollabCandidate');
    if (!candEl || !item) return;
    if (inCast(item.id)) {
      candEl.style.display = 'none';
      candEl.innerHTML = '';
      return;
    }
    candEl.style.display = '';
    var pp = item.raw && item.raw.profile_path;
    var dept = (item.raw && item.raw.known_for_department) || '';
    var avatarHtml = pp
      ? '<img src="https://image.tmdb.org/t/p/w92' + pp + '" class="qs-collab-cast-avatar" onerror="this.style.display=\'none\'">'
      : '<div class="qs-collab-cast-avatar qs-collab-cast-avatar-empty">' + esc(getInitials(item.title)) + '</div>';
    candEl.innerHTML =
      avatarHtml +
      '<div class="qs-collab-cast-info">' +
        '<div class="qs-collab-cast-name">' + esc(item.title || '') + '</div>' +
        '<div class="qs-collab-cast-dept">' + esc(dept) + '</div>' +
      '</div>' +
      '<div class="qs-collab-go-slot" id="qsCollabGoSlot">' + mainResultCtaHtml(item.id) + '</div>';
    /* Pass a normalized person record so wireMainResultCtas's addToCast
       receives proper name / dept / profile_path. */
    wireMainResultCtas({
      id: item.id,
      name: item.title,
      title: item.title,
      raw: { profile_path: pp || '', known_for_department: dept }
    });
  }

  function updateMainResultCta() {
    var slot = document.getElementById('qsCollabGoSlot');
    if (!slot) return;
    var anchor = qsCast[0];
    if (!anchor) return;
    slot.innerHTML = mainResultCtaHtml(anchor.id);
    wireMainResultCtas(anchor);
  }

  function collabCtaHtml(personId) {
    if (inCast(personId)) {
      return '<span class="qs-collab-cta qs-in-cast-label">In cast</span>';
    }
    if (qsCast.length >= QS_CAST_MAX) {
      return '<span class="qs-collab-cta qs-in-cast-label">Cast full</span>';
    }
    return '<button class="qs-collab-cta qs-add-btn" data-collab-add="' + esc(String(personId)) + '">+ Add</button>';
  }

  function mainResultCtaHtml(personId) {
    if (inCast(personId)) {
      return '<span class="qs-in-cast-label">In cast</span>' +
             '<span class="qs-solo-timeline" data-solo="1">Go solo &rarr;</span>';
    }
    if (qsCast.length >= QS_CAST_MAX) {
      return '<span class="qs-in-cast-label">Cast full</span>' +
             '<span class="qs-solo-timeline" data-solo="1">Go solo &rarr;</span>';
    }
    return '<button class="qs-add-btn" data-add-main="1">+ Add to cast</button>' +
           '<span class="qs-solo-timeline" data-solo="1">Go solo &rarr;</span>';
  }

  function wireMainResultCtas(item) {
    var slot = document.getElementById('qsCollabGoSlot');
    if (!slot) return;
    var addBtn = slot.querySelector('[data-add-main]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addToCast({
          id: item.id,
          name: item.name || item.title,
          department: (item.raw && item.raw.known_for_department) || '',
          profile_path: (item.raw && item.raw.profile_path) || ''
        });
      });
    }
    var solo = slot.querySelector('[data-solo]');
    if (solo) {
      solo.addEventListener('click', function () {
        navigateTo({ id: item.id, type: 'actor', title: item.name || item.title });
      });
    }
  }

  /* ── Joint navigation ── */
  function navigateJointTimeline() {
    if (qsCast.length < 2) return;
    closeModal();
    /* Pattern mirrors people-profile.js navigateToSacredTimeline (line 96):
       timelinePendingPeople is ONLY consumed by timeline.js loadFromUrlSearch
       (line 148), which is gated on the ?type=person&search= URL params.
       Setting timelineMovieId alone routes through loadInitialData which
       loads only the anchor — that's why the prior approach showed one
       person. Use URL params so loadFromUrlSearch fires and addPerson()
       runs for each pending ID. */
    localStorage.removeItem('vennPeople');
    localStorage.removeItem('orbitFilters');
    localStorage.removeItem('movies');
    localStorage.removeItem('orbitBaseQuery');
    localStorage.setItem('timelineMovieId', String(qsCast[0].id));
    localStorage.setItem('timelineType', 'person');
    localStorage.setItem('timelineMediaMode', 'both');
    localStorage.setItem(
      'timelinePendingPeople',
      JSON.stringify(qsCast.slice(1).map(function (p) { return p.id; }))
    );
    var anchorName = encodeURIComponent(qsCast[0].name || '');
    window.location.href = 'pages/timeline.html?type=person&search=' + anchorName;
  }

  function navigateJointVenn() {
    if (qsCast.length < 2) return;
    closeModal();
    localStorage.setItem(
      'vennPeople',
      JSON.stringify(qsCast.map(function (p) { return { id: p.id, name: p.name }; }))
    );
    window.location.href = 'pages/venn.html';
  }

  /* Wire footer joint buttons once on init */
  var jtBtn = document.getElementById('qsJointTimeline');
  var jvBtn = document.getElementById('qsJointVenn');
  if (jtBtn) jtBtn.addEventListener('click', navigateJointTimeline);
  if (jvBtn) jvBtn.addEventListener('click', navigateJointVenn);

  /* ── Navigate to timeline ── */
  async function navigateTo(item) {
    closeModal();
    localStorage.removeItem('vennPeople');
    localStorage.removeItem('orbitFilters');
    localStorage.removeItem('movies');
    localStorage.removeItem('orbitBaseQuery');

    if (item.type === 'movie') {
      try {
        var res = await fetch('https://api.themoviedb.org/3/movie/' + item.id + '?api_key=' + TMDB_API_KEY);
        var movie = await res.json();
        localStorage.setItem('timelineMovieId', item.id);
        localStorage.setItem('timelineType', 'movie');
        if (movie.belongs_to_collection) {
          window.location.href = 'pages/timeline.html';
        } else {
          window.location.href = 'pages/timeline.html?openCube=' + item.id;
        }
      } catch (e) {
        localStorage.setItem('timelineMovieId', item.id);
        localStorage.setItem('timelineType', 'movie');
        window.location.href = 'pages/timeline.html';
      }
    } else {
      localStorage.setItem('timelineMovieId', item.id);
      localStorage.setItem('timelineType', 'person');
      localStorage.setItem('timelineMediaMode', 'both');
      window.location.href = 'pages/timeline.html';
    }
  }

  /* ============================================================
     COLLABORATOR SUGGESTIONS — Added April 2026
     When a person is selected, fetch their combined credits from
     TMDB and show top frequent collaborators before navigating.
     ============================================================ */

  async function showCollaborators(item) {
    /* Show loading state in results area */
    focusedIdx = -1;
    currentResults = [];
    /* Track which anchor's collab list we're rendering so we can refresh
       in place on add/remove without re-fetching. */
    lastCollabAnchorId = item.id;

    /* The cast list now lives in the persistent #qsCastStage above the
       results area, so it isn't rebuilt here. The collab panel only
       renders the candidate row (cast-full fallback), header, and list. */
    results.innerHTML =
      '<div class="qs-collab-panel">' +
        '<div class="qs-collab-candidate" id="qsCollabCandidate" style="display:none"></div>' +
        '<div class="qs-collab-divider"></div>' +
        '<div class="qs-collab-label" id="qsCollabHeaderLabel">' +
          esc((item.title || '').toUpperCase()) +
          ' \u00B7 FREQUENT COLLABORATORS' +
        '</div>' +
        '<div class="qs-collab-list" id="qsCollabList">' +
          '<div class="qs-collab-loading">' +
            '<div class="qs-collab-spinner"></div>' +
            'Finding collaborators\u2026' +
          '</div>' +
        '</div>' +
        '<button class="qs-collab-back" id="qsCollabBack">\u2190 Back to search</button>' +
      '</div>';

    renderCollabCastList();
    renderCollabCandidate(item);

    /* Wire the "Back" button */
    document.getElementById('qsCollabBack').addEventListener('click', function () {
      showEmpty();
      input.focus();
    });

    /* Fetch combined credits from TMDB */
    var collabList = document.getElementById('qsCollabList');
    try {
      /* TMDB API call: 1 request for combined credits
         — per Rule 9, this is a single on-demand call, not in a loop */
      var cacheKey = 'qs_collab_' + item.id;
      var cached = sessionStorage.getItem(cacheKey);
      var credits;
      if (cached) {
        credits = JSON.parse(cached);
      } else {
        var res = await fetch(
          'https://api.themoviedb.org/3/person/' + item.id +
          '/combined_credits?api_key=' + TMDB_API_KEY
        );
        credits = await res.json();
        try { sessionStorage.setItem(cacheKey, JSON.stringify(credits)); } catch (e) { /* quota */ }
      }

      /* Count co-workers across cast + crew credits */
      var personCounts = {};   /* id → { name, department, profile_path, count, topFilm } */
      var allCredits = (credits.cast || []).concat(credits.crew || []);

      allCredits.forEach(function (credit) {
        /* For each movie/show this person worked on, we'd need another
           API call to get the full cast. Instead, use the credits we have:
           if this person is cast, their co-stars are in the same movie's
           credits. But TMDB combined_credits only gives US the person's
           own roles — not co-workers directly.

           Alternative approach: scan the person's known_for + cast credits
           for recurring names in the "cast" entries that TMDB returns
           within each credit item. Actually, combined_credits doesn't
           nest cast per movie.

           Best approach with 1 API call: fetch the person's movie credits,
           then for the top ~10 most popular movies, we already have the
           movie IDs. We can use a second strategy: check if TMDB gives
           us credit_id or anything. No — combined_credits is flat.

           Revised approach: we'll use a lightweight method — fetch credits
           for this person's top 10 movies (by popularity) in parallel,
           then count people across those casts. This is ~10 API calls
           but they fire in parallel and are cached. */
      });

      /* Fetch cast lists for the person's top credits.
         Per Rule 24 amendment: TV credits are included when the actor
         appeared in 20+ episodes — proxy for "more than one year on the
         show" (cheap, zero extra API calls). Excludes guest spots. */
      var movieCredits = (credits.cast || [])
        .filter(function (c) {
          if (c.media_type === 'movie' || !c.media_type) return true;
          if (c.media_type === 'tv') return (c.episode_count || 0) >= 20;
          return false;
        })
        .sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); })
        .slice(0, 10);

      /* Per Rule 9: ~10 parallel API calls, on-demand only when user
         clicks a person. Results cached in sessionStorage. */
      var castPromises = movieCredits.map(function (credit) {
        var mediaPath = credit.media_type === 'tv' ? 'tv' : 'movie';
        var movieCacheKey = 'qs_' + mediaPath + '_credits_' + credit.id;
        var movieCached = sessionStorage.getItem(movieCacheKey);
        if (movieCached) return Promise.resolve(JSON.parse(movieCached));
        return fetch(
          'https://api.themoviedb.org/3/' + mediaPath + '/' + credit.id +
          '/credits?api_key=' + TMDB_API_KEY
        ).then(function (r) { return r.json(); })
         .then(function (data) {
           try { sessionStorage.setItem(movieCacheKey, JSON.stringify(data)); } catch (e) { /* quota */ }
           return data;
         })
         .catch(function () { return null; });
      });

      var allCasts = await Promise.all(castPromises);

      /* Tally co-workers (exclude the selected person) */
      var coworkers = {};
      allCasts.forEach(function (movieData, movieIdx) {
        if (!movieData) return;
        var people = (movieData.cast || []).concat(movieData.crew || []);
        people.forEach(function (p) {
          if (p.id === item.id) return; /* skip self */
          if (!coworkers[p.id]) {
            coworkers[p.id] = {
              id: p.id,
              name: p.name,
              department: p.known_for_department || p.department || '',
              profile_path: p.profile_path || '',
              count: 0,
              films: []
            };
          }
          var filmTitle = movieCredits[movieIdx] &&
            (movieCredits[movieIdx].title || movieCredits[movieIdx].name);
          if (filmTitle && coworkers[p.id].films.indexOf(filmTitle) === -1) {
            coworkers[p.id].count++;
            coworkers[p.id].films.push(filmTitle);
          }
        });
      });

      /* Sort by collaboration count, take top 5 */
      var topCollabs = Object.values(coworkers)
        .filter(function (c) { return c.count >= 2; })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 5);

      if (!topCollabs.length) {
        collabList.innerHTML =
          '<div class="qs-collab-empty">No frequent collaborators found</div>';
        return;
      }

      collabList.innerHTML = topCollabs.map(function (collab, idx) {
        var imgHtml = collab.profile_path
          ? '<img src="https://image.tmdb.org/t/p/w92' + collab.profile_path + '" class="qs-collab-photo" onerror="this.style.display=\'none\'">'
          : '<div class="qs-collab-photo qs-collab-photo-empty">\uD83D\uDC64</div>';
        var filmsPreview = collab.films.slice(0, 3).join(', ');
        return '<div class="qs-collab-row" data-collab-idx="' + idx + '" ' +
               'data-person-id="' + esc(String(collab.id)) + '" ' +
               'data-person-name="' + esc(collab.name) + '" ' +
               'data-person-dept="' + esc(collab.department) + '" ' +
               'data-person-pp="' + esc(collab.profile_path) + '">' +
          imgHtml +
          '<div class="qs-collab-info">' +
            '<div class="qs-collab-name">' + esc(collab.name) + '</div>' +
            '<div class="qs-collab-meta">' +
              '<span class="qs-collab-count">' + collab.count + ' films together</span>' +
              ' \u00B7 ' + esc(filmsPreview) +
            '</div>' +
          '</div>' +
          '<div class="qs-collab-dept">' + esc(collab.department) + '</div>' +
          collabCtaHtml(collab.id) +
        '</div>';
      }).join('');

      /* Wire + Add buttons on collaborator rows. Whole-row click is no
         longer the action \u2014 the explicit Add button is, since we now
         stage people instead of navigating. */
      function wireCollabAddButtons() {
        collabList.querySelectorAll('.qs-add-btn[data-collab-add]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var idx = parseInt(this.closest('.qs-collab-row').dataset.collabIdx, 10);
            var collab = topCollabs[idx];
            if (collab) {
              addToCast({
                id: collab.id,
                name: collab.name,
                department: collab.department,
                profile_path: collab.profile_path
              });
            }
          });
        });
      }
      wireCollabAddButtons();

    } catch (err) {
      console.error('[qs-collabs]', err);
      collabList.innerHTML =
        '<div class="qs-collab-empty">Could not load collaborators</div>';
    }
  }

  /* ── Escape HTML ── */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
