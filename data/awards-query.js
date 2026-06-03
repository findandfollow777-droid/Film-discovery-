/**
 * ORBIT — Awards Query Adapter (Phase 1.13a.2)
 *
 * Thin per-entry view over ORBIT's two coexisting awards data shapes:
 *   - data/awards-data.js  → AWARDS_BROWSE_DATABASE (aggregated: winner / winners[] / nominees[])
 *   - components/awards.js → AWARDS_DATABASE        (per-entry: { festival, category, year, won })
 *
 * Public API:
 *   window.OrbitAwards.getAwardsForFilm(tmdbId)
 *   window.OrbitAwards.getAwardsForPerson(personId)
 *   window.OrbitAwards.getAllAwards()
 *   window.OrbitAwards.getAwardsByFestivalAndYear(festival, year)
 *
 * Output record shape (per-entry, canonical):
 *   {
 *     tmdb_id:        number | null,
 *     person_id:      number | null,
 *     recipient_name: string,
 *     year:           number,
 *     festival_id:    'oscar'|'cannes'|'venice'|'berlin'|'bafta'|'globe' | null,
 *     festival_raw:   string,
 *     category:       string,
 *     won:            boolean,
 *     source:         'data/awards-data.js' | 'components/awards.js',
 *     raw:            object
 *   }
 *
 * Dedupe key: `${festival_id}|${category.toLowerCase().trim()}|${year}|${tmdb_id ?? 'null'}|${person_id ?? 'null'}`
 * Records with festival_id === null pass through without dedupe.
 *
 * When the awards rebuild ships native per-entry data, this adapter becomes
 * a thin passthrough or is deleted. Consumers (badges) read per-entry today;
 * their code does not change when the underlying storage changes.
 */
(function () {
  'use strict';

  // ── Lazy caches — build on first method call so AWARDS_BROWSE_DATABASE's
  //    enrichPersonData IIFE has finished populating person_id fields. ──
  let _allCache = null;
  let _filmIndex = null;
  let _personIndex = null;
  let _festYearIndex = null;
  const _warnedFestivals = new Set();

  // Replicated from components/award-badges.js — kept self-contained on purpose.
  // Strips every non-letter (whitespace, punctuation, dots) before matching, so
  // "Golden Globe" / "GoldenGlobe" / "B.A.F.T.A." / "Golden-Lion" all resolve.
  function detectFestivalId(festivalName) {
    if (!festivalName) return null;
    const s = String(festivalName).toLowerCase().replace(/[^a-z]/g, '');
    if (!s) return null;
    if (s.includes('oscar') || s.includes('academy')) return 'oscar';
    if (s.includes('cannes') || s.includes('palme')) return 'cannes';
    if (s.includes('venice') || s.includes('mostra') || s.includes('goldenlion')) return 'venice';
    if (s.includes('berlin') || s.includes('berlinale') || s.includes('goldenbear')) return 'berlin';
    if (s.includes('bafta') || s.includes('britishacademy')) return 'bafta';
    if (s.includes('goldenglobe') || s === 'globe' || s.includes('globes')) return 'globe';
    return null;
  }

  // tmdb_id and person_id of 0 are placeholders for "no linkage" — treat as null.
  function nullIfZero(n) {
    if (n === null || n === undefined) return null;
    const num = Number(n);
    if (!Number.isFinite(num) || num === 0) return null;
    return num;
  }

  function maybeWarnUnknownFestival(raw) {
    if (!raw) return;
    if (_warnedFestivals.has(raw)) return;
    _warnedFestivals.add(raw);
    console.warn('[awards-query] Unrecognised festival string (no canonical mapping):', raw);
  }

  function makeRecord(opts) {
    const festId = detectFestivalId(opts.festival_raw);
    if (!festId) maybeWarnUnknownFestival(opts.festival_raw);
    return {
      tmdb_id:        nullIfZero(opts.tmdb_id),
      person_id:      nullIfZero(opts.person_id),
      recipient_name: opts.recipient_name || '',
      year:           opts.year,
      festival_id:    festId,
      festival_raw:   opts.festival_raw,
      category:       opts.category,
      won:            Boolean(opts.won),
      source:         opts.source,
      raw:            opts.raw
    };
  }

  // ── Read AWARDS_BROWSE_DATABASE (aggregated) ──
  // Structure: Festival → Category → Year → { winner | winners[] | nominees[] }
  function readAggregated() {
    const out = [];
    let db;
    try { db = AWARDS_BROWSE_DATABASE; } catch (_) { db = undefined; }
    if (typeof db === 'undefined' || db === null) return out;

    for (const festRaw of Object.keys(db)) {
      const cats = db[festRaw];
      if (!cats) continue;
      for (const category of Object.keys(cats)) {
        const years = cats[category];
        if (!years) continue;
        for (const yearStr of Object.keys(years)) {
          const data = years[yearStr];
          if (!data) continue;
          const year = Number(yearStr);

          // winners[] — co-winner / tie case
          if (Array.isArray(data.winners)) {
            data.winners.forEach(function (entry) {
              if (!entry) return;
              out.push(makeRecord({
                tmdb_id:        entry.tmdb_id,
                person_id:      entry.person_id,
                recipient_name: entry.person || entry.person_name || entry.title || '',
                year:           year,
                festival_raw:   festRaw,
                category:       category,
                won:            true,
                source:         'data/awards-data.js',
                raw:            entry
              }));
            });
          }

          // winner — single
          if (data.winner) {
            out.push(makeRecord({
              tmdb_id:        data.winner.tmdb_id,
              person_id:      data.winner.person_id,
              recipient_name: data.winner.person || data.winner.person_name || data.winner.title || '',
              year:           year,
              festival_raw:   festRaw,
              category:       category,
              won:            true,
              source:         'data/awards-data.js',
              raw:            data.winner
            }));
          }

          // nominees[]
          if (Array.isArray(data.nominees)) {
            data.nominees.forEach(function (entry) {
              if (!entry) return;
              out.push(makeRecord({
                tmdb_id:        entry.tmdb_id,
                person_id:      entry.person_id,
                recipient_name: entry.person || entry.person_name || entry.title || '',
                year:           year,
                festival_raw:   festRaw,
                category:       category,
                won:            false,
                source:         'data/awards-data.js',
                raw:            entry
              }));
            });
          }
        }
      }
    }
    return out;
  }

  // ── Read AWARDS_DATABASE (per-entry) ──
  // Structure: tmdb_id → { title, awards: [{ festival, category, year, won, person?, person_id? }] }
  function readPerEntry() {
    const out = [];
    const db = (typeof window !== 'undefined' && window.AWARDS_DATABASE) ||
               (function () { try { return AWARDS_DATABASE; } catch (_) { return null; } })();
    if (!db) return out;

    for (const tmdbIdStr of Object.keys(db)) {
      const record = db[tmdbIdStr];
      if (!record || !Array.isArray(record.awards)) continue;
      const filmId = Number(tmdbIdStr);
      record.awards.forEach(function (award) {
        if (!award) return;
        out.push(makeRecord({
          tmdb_id:        filmId,
          person_id:      award.person_id,
          recipient_name: award.person || record.title || '',
          year:           award.year,
          festival_raw:   award.festival,
          category:       award.category,
          // explicit boolean coercion — historical strings 'true'/'True' show up
          won:            award.won === true || award.won === 'true' || award.won === 'True',
          source:         'components/awards.js',
          raw:            award
        }));
      });
    }
    return out;
  }

  function dedupeKey(rec) {
    if (rec.festival_id == null) return null;
    const cat = (rec.category || '').toLowerCase().trim();
    const t = rec.tmdb_id == null ? 'null' : String(rec.tmdb_id);
    const p = rec.person_id == null ? 'null' : String(rec.person_id);
    return rec.festival_id + '|' + cat + '|' + rec.year + '|' + t + '|' + p;
  }

  function build() {
    if (_allCache) return _allCache;

    const perEntry = readPerEntry();
    const aggregated = readAggregated();

    // Per-entry source wins over exploded-aggregate. First-encountered wins within a source.
    const seen = new Map();
    const out = [];

    function ingest(records) {
      records.forEach(function (rec) {
        const k = dedupeKey(rec);
        if (k == null) { out.push(rec); return; }
        if (seen.has(k)) return;
        seen.set(k, true);
        out.push(rec);
      });
    }

    ingest(perEntry);
    ingest(aggregated);

    _filmIndex = new Map();
    _personIndex = new Map();
    _festYearIndex = new Map();

    out.forEach(function (rec) {
      if (rec.tmdb_id != null) {
        if (!_filmIndex.has(rec.tmdb_id)) _filmIndex.set(rec.tmdb_id, []);
        _filmIndex.get(rec.tmdb_id).push(rec);
      }
      if (rec.person_id != null) {
        if (!_personIndex.has(rec.person_id)) _personIndex.set(rec.person_id, []);
        _personIndex.get(rec.person_id).push(rec);
      }
      if (rec.festival_id != null && rec.year != null) {
        const k = rec.festival_id + '|' + rec.year;
        if (!_festYearIndex.has(k)) _festYearIndex.set(k, []);
        _festYearIndex.get(k).push(rec);
      }
    });

    _allCache = out;
    return out;
  }

  function getAllAwards() {
    return build().slice();
  }

  function getAwardsForFilm(tmdbId) {
    const id = nullIfZero(tmdbId);
    if (id == null) return [];
    build();
    const hit = _filmIndex.get(id);
    return hit ? hit.slice() : [];
  }

  function getAwardsForPerson(personId) {
    const id = nullIfZero(personId);
    if (id == null) return [];
    build();
    const hit = _personIndex.get(id);
    return hit ? hit.slice() : [];
  }

  function getAwardsByFestivalAndYear(festival, year) {
    if (festival == null || year == null) return [];
    // Accept either a raw string ("GoldenGlobe", "Golden Globe", "Academy Awards")
    // or a canonical id ("globe", "oscar"). detectFestivalId handles both.
    const festId = detectFestivalId(festival);
    if (!festId) return [];
    build();
    const hit = _festYearIndex.get(festId + '|' + Number(year));
    return hit ? hit.slice() : [];
  }

  window.OrbitAwards = {
    getAwardsForFilm:           getAwardsForFilm,
    getAwardsForPerson:         getAwardsForPerson,
    getAllAwards:               getAllAwards,
    getAwardsByFestivalAndYear: getAwardsByFestivalAndYear
  };
})();
