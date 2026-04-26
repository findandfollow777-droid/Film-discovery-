# Phase 6 — UI Integration Backlog

This file tracks UI-side issues discovered during the Phase 1.5 preview build that need addressing during Phase 6 (full UI integration) work. Each item is paired with a known-issues entry where applicable.

Cross-references:
- ORBIT-AWARDS-HANDOVER-v1.1.docx — Phase 6 scope and runbook
- Separate Claude conversation "2 To Do" (https://claude.ai/chat/8b15d43e-4892-4a71-9bc0-cab74b91f416) is handling year-context navigation work; items below are scoped to data-rendering concerns NOT covered there

---

## P6-001 — Subject title rendering for Best Original Song

Source: known-issues compile-preview-subject-title-missing-from-legacy-view-2026-04-25

Best Original Song tiles currently render the film name only ("Barbie") with no song name ("What Was I Made For?"). The schema captures both via film_title and subject_title fields. Phase 6 work needs to: (a) decide whether to extend the legacy-view compile to pass subject_title through, OR target the v1.2 canonical JSON directly for this category; (b) update the tile renderer for Best Original Song to display the song name prominently with the film as secondary context.

Likely tile shape:

```
| What Was I Made For? |    <- subject_title
| from Barbie          |    <- film_title
| Billie Eilish, Finneas |  <- recipients[*].name
```

## P6-002 — Co-winner tile rendering decision

Source: known-issues preview-co-winner-rendering-tile-merge-2026-04-25

Co-winners currently merge into a single tile with ampersand-joined names. Per schema, the data ships them as separate rows. Phase 6 work needs a decision: render as two distinct tiles (faithful to data, breaks visual "one tile per category-year" assumption) or keep visual merge (ampersand-joined). Either is supportable from the data side; the choice is editorial.

Affects: ~10 known co-winner cases per festival across 25 years (Cannes especially frequent). Visual treatment should be consistent across all festivals.

## P6-003 — Phase 1.5 preview build itself

The preview build at awards-browse.html?preview=true is a development tool, not user-facing. It uses the existing UI to render v1.2 preview data, which exposes UI-vs-schema mismatches by design. Items P6-001 and P6-002 emerged from the preview review on 2026-04-25.

The preview build itself does not need production polish — it ships only when internal review is complete and the v1.2 dataset goes live (via swap of awards-data.js to derive from the canonical v1.2 JSON).

## Known omissions

These items are NOT logged here because they're in scope for separate work:

- Year context display (ceremony year vs film release year prominence) — handled in separate Claude thread "2 To Do" (https://claude.ai/chat/8b15d43e-4892-4a71-9bc0-cab74b91f416)
- Sticky year headers, year rail scrubber, ceremony-year-prominent layout — same separate thread
- Posters and portraits not rendering in preview mode — expected, blocked by Phase 2 (TMDB resolution); not a UI issue
