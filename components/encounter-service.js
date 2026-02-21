// ============================================
// ORBIT ENCOUNTER TRACKING SERVICE
// Silently logs people encountered across all features
// ============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'orbit_people_encountered';
  const DEBOUNCE_MS = 500;

  let data = null;
  let saveTimer = null;

  // ── Persistence ──

  function load() {
    if (data) return data;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1) {
          data = parsed;
          return data;
        }
      }
    } catch (e) { /* silent */ }
    data = { version: 1, people: {}, stats: { total_people: 0, total_encounters: 0, sources_breakdown: {} } };
    return data;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* silent — quota exceeded etc. */ }
  }

  function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(save, DEBOUNCE_MS);
  }

  // ── Core API ──

  function logEncounter(person, source) {
    if (!person || !person.id || !person.name || !source) return;

    const d = load();
    const id = String(person.id);
    const now = new Date().toISOString();

    if (d.people[id]) {
      // Existing person — increment
      const entry = d.people[id];
      entry.encounter_count++;
      entry.last_encountered = now;
      if (person.profile_path) entry.profile_path = person.profile_path;
      if (entry.sources.indexOf(source) === -1) {
        entry.sources.push(source);
      }
    } else {
      // New person
      d.people[id] = {
        name: person.name,
        profile_path: person.profile_path || null,
        known_for: person.known_for_department || null,
        first_encountered: now,
        last_encountered: now,
        encounter_count: 1,
        sources: [source],
        bookmarked: false
      };
      d.stats.total_people++;
    }

    d.stats.total_encounters++;
    d.stats.sources_breakdown[source] = (d.stats.sources_breakdown[source] || 0) + 1;

    debouncedSave();
  }

  function getEncountered() {
    return load().people;
  }

  function getEncounterStats() {
    const d = load();
    const peopleEntries = Object.values(d.people);
    const top_encountered = peopleEntries
      .sort((a, b) => b.encounter_count - a.encounter_count)
      .slice(0, 5)
      .map(p => ({ name: p.name, count: p.encounter_count }));

    return {
      total_people: d.stats.total_people,
      total_encounters: d.stats.total_encounters,
      sources_breakdown: { ...d.stats.sources_breakdown },
      top_encountered
    };
  }

  function isEncountered(personId) {
    return !!load().people[String(personId)];
  }

  function getEncounterCount(personId) {
    const entry = load().people[String(personId)];
    return entry ? entry.encounter_count : 0;
  }

  function toggleBookmark(personId) {
    const d = load();
    const entry = d.people[String(personId)];
    if (!entry) return false;
    entry.bookmarked = !entry.bookmarked;
    debouncedSave();
    return entry.bookmarked;
  }

  function clearEncounters() {
    data = { version: 1, people: {}, stats: { total_people: 0, total_encounters: 0, sources_breakdown: {} } };
    save();
  }

  // ── Init ──

  load();

  // ── Exports ──

  window.OrbitEncounters = {
    logEncounter,
    getEncountered,
    getEncounterStats,
    isEncountered,
    getEncounterCount,
    toggleBookmark,
    clearEncounters
  };

})();
