# BAFTA Re-scrape Scope Audit — 2026-04-30

Audit-only investigation of scraper-gap artifacts across the 27 BAFTA ceremony CSVs (cer 53-79). Detects four artifact patterns. No CSV / scraper / scope / truth / known-issues modifications.

> **Note on Pattern A scope:** the brief lists `bafta.best_film_editing` as one of the three split-co-recipients categories. The canonical slug per `scripts/scrape-bafta-categories.json` and all 27 CSVs is `bafta.best_editing`. The audit uses the canonical slug.

> **Note on Pattern A breadth:** the strict-definition Pattern A targets only `split_co_recipients=false` categories (best_director, best_editing, best_original_score). The brief's "specific examples to verify" list includes cer 55, 66, 73 outstanding_debut won-row team-credit drops. These are technically a sibling artifact class — outstanding_debut has `recipient_type=producers` (multi-person) and is **not** in `split_co_recipients` — but the brief intro labels them as "Pattern A findings". This audit groups them as **Pattern A (extended)** under the same priority for re-scrape decisions, while noting the architectural distinction.

---

## Summary

- Total ceremonies examined: **27**
- Ceremonies needing re-scrape: **20**
- Ceremonies clean (post-fix or unaffected): **7** (cer 53, 58, 60, 62, 64, 65, 78)
- Total artifact rows detected: **52**
  - Pattern A (core, split_co_recipients): **1** (cer 61 best_director — Coens)
  - Pattern A (extended, outstanding_debut team-credit drops on won rows): **3** (cer 55 Hopkins+Usborne, cer 66 Layton+Doganis, cer 73 Jenkin+Byers+Waite)
  - Pattern B (outstanding_debut name-field role tags): **32**
  - Pattern C (outstanding_debut fused multi-recipient strings): **16**
- Pattern D (best_original_music slug variant): **none detected** — all 134 score rows uniformly use the canonical `bafta.best_original_score`. Informational confirmation that historical naming was normalised at scrape time.

**Control-group observations (post-architectural-fix re-scrapes, scrape_at = 2026-04-28):**
- Cer 60, 65, 78 — clean across A/B/C/D ✓
- Cer 76 — Pattern A clean (split_co_recipients categories) ✓ but **Pattern B/C residue persists in outstanding_debut**: the architectural fix (split_co_recipients metadata + Mode 2 parser fix + in-row split) does not propagate cleanup to outstanding_debut name-field artifacts because that category has `recipient_type=producers` (multi-person) and the in-row split fix only fires on single-recipient-type categories. **This is not a regression of the architectural fix — it is an out-of-scope artifact class for that fix.** Re-scraping older ceremonies under the current scrapers will likely leave Pattern B/C residue intact in outstanding_debut.
- Cer 70 — scrape_at 2026-04-28 (likely re-scraped during truth-curation Batch A even though not in the architectural-fix list per `co-winner-flag-misapplied-team-credits-2026-04-28`). Shows Pattern B/C residue, consistent with the cer 76 finding above.

---

## Per-ceremony findings

### Cer 53 (1999/2000 — *Ratcatcher* era)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical slug
- Re-scrape needed: **no**
- Scrape: 2026-04-27 (pre-architectural-fix; clean coincidentally — outstanding_debut won row "Lynne Ramsay" is a true single-recipient nomination per BAFTA records)

### Cer 54 (2001 — *Last Resort* era)
- Pattern A: 0
- Pattern B: 1 — `Mark Crowdy (Writer/Producer)` (nominated, *Saving Grace*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium — name cleanup)**
- Scrape: 2026-04-27 (pre-architectural-fix)

### Cer 55 (2002 — *Jump Tomorrow* era)
- **Pattern A (extended): 1** — outstanding_debut won row recipients=`["Joel Hopkins"]`, *Jump Tomorrow*. Per the brief, true credits are Joel Hopkins + Nicola Usborne. **NEW gap not yet logged in known-issues.**
- Pattern B: 2 — `Jack Lothian (Writer)` (nominated, *Late Night Shopping*); `Ruth Kenley-Letts (Producer)` (nominated, *Strictly Sinatra*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (High — Pattern A team-credit drop)**
- Scrape: 2026-04-27 (pre-architectural-fix)

### Cer 56 (2003 — *The Warrior* era)
- Pattern A: 0
- Pattern B: 1 — `Lucy Darwin (Producer)` (nominated, *Lost in La Mancha*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-27 (pre-fix)

### Cer 57 (2004 — *Kiss of Life* era)
- Pattern A: 0
- Pattern B: 2 — `Sergio Casci (Writer)` (*American Cousins*); `Jenny Mayhew (Writer)` (*To Kill a King*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-27 (pre-fix)

### Cer 58 (2005 — *A Way of Life* era)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no**
- Scrape: 2026-04-27 (pre-fix; coincidentally clean)

### Cer 59 (2006 — *Pride & Prejudice* era)
- Pattern A: 0
- Pattern B: 1 — `Richard Hawkins (Director)` (nominated, *Everything*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-27 (pre-fix)

### Cer 60 (2007 — *Red Road* era; Best Animated Film inaugural)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no — already post-fix scrape (2026-04-28); control group passes**

### Cer 61 (2008 — *Control* era; Coens win Best Director)
- **Pattern A (core): 1** — best_director won row recipients=`["Joel Coen"]`, *No Country for Old Men*. True credit is Joel Coen + Ethan Coen (Coen brothers as a directing duo). **NEW gap not yet logged in known-issues.**
- Pattern B: 1 — `Mia Bays (Producer)` (nominated, *Scott Walker: 30 Century Man*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (High — Pattern A team-credit drop in split_co_recipients core category)**
- Scrape: 2026-04-27 (pre-architectural-fix). Architectural fix should consolidate Coens to atomic `recipients=[{name: "Joel Coen"}, {name: "Ethan Coen"}]`.

### Cer 62 (2009 — *Hunger* era)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no**
- Scrape: 2026-04-27 (pre-fix; coincidentally clean)

### Cer 63 (2010 — *Moon* era)
- Pattern A: 0
- Pattern B: 1 — `Lucy Bailey, Andrew Thompson, Elizabeth Morgan Hemlock and David Pearson (Director/Producer)` (nominated, *Mugabe and the White African*)
- Pattern C: 1 — same row (the role tag and the fused 4-name string co-occur)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-27 (pre-fix)

### Cer 64 (2011 — *Four Lions* era)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no**
- Scrape: 2026-04-27 (pre-fix; coincidentally clean)

### Cer 65 (2012 — *Tyrannosaur* era; Best Documentary inaugural year, 3-nominee era_override)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no — already post-fix scrape (2026-04-28); control group passes**

### Cer 66 (2013 — *The Imposter* era)
- **Pattern A (extended): 1** — outstanding_debut won row recipients=`["Bart Layton"]`, *The Imposter*. True credits are Bart Layton + Dimitri Doganis. **NEW gap not yet logged in known-issues.**
- Pattern B: 1 — `David Morris (Director) and Jacqui Morris (Director/Producer)` (nominated, *McCullin*)
- Pattern C: 1 — same row (fused multi-recipient + role tags)
- Pattern D: canonical
- Re-scrape needed: **yes (High)**
- Scrape: 2026-04-26 (pre-architectural-fix)

### Cer 67 (2014 — *Kelly + Victor* era)
- Pattern A: 0
- Pattern B: 2 — `Paul Wright (Writer/Director) and Polly Stokes (Producer)` (*For Those in Peril*); `Scott Graham (Writer/Director)` (*Shell*)
- Pattern C: 1 — `Paul Wright (Writer/Director) and Polly Stokes (Producer)` (*For Those in Peril*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 68 (2015 — *Pride* era)
- Pattern A: 0
- Pattern B: 1 — `Paul Katis (Director/Producer) and Andrew de Lotbiniere (Producer)` (*Kajaki*)
- Pattern C: 1 — same row
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 69 (2016 — *Theeb* era)
- Pattern A: 0
- Pattern B: 1 — `Stephen Fingleton (Writer/Director)` (nominated, *The Survivalist*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 70 (2017 — *Under the Shadow* era)
- Pattern A: 0
- Pattern B: 3 — `George Amponsah (Writer/Director/Producer) and Dionne Walker (Writer/Producer)` (*The Hard Stop*); `Peter Middleton (Writer/Director/Producer), James Spinney (Writer/Director) and Jo-Jo Ellison (Producer)` (*Notes on Blindness*); `John Donnelly (Writer) and Ben A. Williams (Director)` (*The Pass*)
- Pattern C: 3 — same three rows (each with fused multi-recipient strings)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-28 (post-architectural-fix — yet still shows Pattern B/C residue, consistent with cer 76 observation)

### Cer 71 (2018 — *I Am Not a Witch* era)
- Pattern A: 0
- Pattern B: 1 — `Lucy Cohen (Director)` (nominated, *Kingdom of Us*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 72 (2019 — *Beast* era)
- Pattern A: 0
- Pattern B: 3 — `Michael Pearce (Writer/Director) and Lauren Dark (Producer)` (won, *Beast*); `Chris Kelly (Writer/Director/Producer)` (nominated, *A Cambodian Spring*); `Leanne Welham (Writer/Director) and Sophie Harman (Producer)` (nominated, *Pili*)
- Pattern C: 2 — `Michael Pearce ... and Lauren Dark` (*Beast* won); `Leanne Welham ... and Sophie Harman` (*Pili*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)** — the won row has both B and C; cleaning it is informational data quality
- Scrape: 2026-04-26 (pre-fix)

### Cer 73 (2020 — *Bait* era)
- **Pattern A (extended): 1** — outstanding_debut won row recipients=`["Mark Jenkin"]`, *Bait*. True credits are Mark Jenkin + Kate Byers + Linn Waite. **Already logged**: see known-issues `bafta-73-outstanding-debut-co-recipients-dropped-2026-04-29`.
- Pattern B: 2 — `Alex Holmes (Director)` (nominated, *Maiden*); `Álvaro Delgado-Aparicio (Writer/Director)` (nominated, *Retablo*)
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **yes (High)**
- Scrape: 2026-04-26 (pre-architectural-fix)

### Cer 74 (2021 — *His House* era)
- Pattern A: 0
- Pattern B: 4 — `Remi Weekes (Writer/Director)` (won, *His House*); `Ben Sharrock (Writer/Director) and Irune Gurtubai (Producer)` (*Limbo*); `Jack Sidey (Writer/Producer)` (*Moffie*); `Rose Glass (Writer/Director) and Oliver Kassman (Producer)` (*Saint Maud*)
- Pattern C: 2 — `Ben Sharrock ... and Irune Gurtubai` (*Limbo*); `Rose Glass ... and Oliver Kassman` (*Saint Maud*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 75 (2022 — *The Harder They Fall* era)
- Pattern A: 0
- Pattern B: 1 — `Posy Dixon (Writer/Director) and Liv Proctor (Producer)` (*Keyboard Fantasies*)
- Pattern C: 1 — same row
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 76 (2023 — *Aftersun* era)
- Pattern A: 0 (split_co_recipients categories clean — control group passes)
- Pattern B: 2 — `Marie Lidén (Director)` (*Electric Malady*); `Elena Sánchez Bellot (Director) and Maia Kenworthy (Director)` (*Rebellion*)
- Pattern C: 1 — `Elena Sánchez Bellot ... and Maia Kenworthy` (*Rebellion*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)** — but flagged: **Pattern B/C residue persists despite post-architectural-fix re-scrape on 2026-04-28**. Outstanding_debut name-field cleanup is out of scope for the architectural fix.
- Scrape: 2026-04-28 (post-fix; demonstrates that re-scraping alone will NOT clean B/C residue in outstanding_debut)

### Cer 77 (2024 — *Earth Mama* era)
- Pattern A: 0
- Pattern B: 2 — `Lisa Selby (Director), Rebecca Lloyd-Evans (Director), and Alex Fry (Director)` (*Blue Bag Life*); `Ella Glendining (Director)` (*Is There Anybody Out There?*)
- Pattern C: 1 — `Lisa Selby (Director), Rebecca Lloyd-Evans (Director), and Alex Fry (Director)` (*Blue Bag Life*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)**
- Scrape: 2026-04-26 (pre-fix)

### Cer 78 (2025 — *Kneecap* era; manually backfilled Sister Midnight 6th nomination)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 0
- Pattern D: canonical
- Re-scrape needed: **no — already post-fix scrape (2026-04-28); control group passes**. Manual backfill of Sister Midnight 6th nomination still in place from `bafta-78-outstanding-debut-wikipedia-gap-2026-04-27`.

### Cer 79 (2026 — *My Father's Shadow* era)
- Pattern A: 0
- Pattern B: 0
- Pattern C: 2 — `Jack King, Hollie Bryan, and Lucy Meer` (*The Ceremony*); `Cal McMau, Hunter Andrews, and Eoin Doran` (*Wasteman*)
- Pattern D: canonical
- Re-scrape needed: **yes (Medium)** — but Pattern C residue likely persists post-rescrape, same class as cer 76 observation
- Scrape: 2026-04-26 (pre-fix). Note: Cer 79 appears in the `bafta-team-category-recipient-splitting-2026-04-26` re-scrape scope, but the surface scrape_at on the row data is 2026-04-26 — these C-pattern rows exist in outstanding_debut nominee slate and survived the recipient_type fix because they're fused-and-string conjoined names, not recipient_type splits.

---

## Re-scrape recommended scope

### HIGH PRIORITY (4 ceremonies — Pattern A team-credit gaps)

1. **Cer 61** — best_director won row Coens consolidation. Architectural fix should atomise `recipients=[{name: "Joel Coen"}, {name: "Ethan Coen"}]`. **High confidence the fix will resolve this** (split_co_recipients=false on best_director, recipient_type=director in single set, in-row split applies).
2. **Cer 73** — outstanding_debut won row Bait Jenkin+Byers+Waite. **Lower confidence the architectural fix alone resolves this**: outstanding_debut has recipient_type=producers (multi-person), so the in-row split fix doesn't fire. May still need targeted manual backfill or parser enhancement. Already logged.
3. **Cer 55** — outstanding_debut won row Hopkins+Usborne. Same architectural class as cer 73 — uncertain whether re-scrape alone resolves. NEW gap not yet logged.
4. **Cer 66** — outstanding_debut won row Layton+Doganis. Same as cer 73, 55. NEW gap not yet logged.

### MEDIUM PRIORITY (16 ceremonies — Pattern B and/or C only)

54, 56, 57, 59, 63, 67, 68, 69, 70, 71, 72, 74, 75, 76, 77, 79.

**Caveat:** the cer 76 control-group evidence shows that re-scraping under the current scrapers does NOT clean Pattern B (role tags) or Pattern C (fused multi-recipient strings) within `bafta.outstanding_debut`. Re-scraping this list will refresh provenance metadata but **may not eliminate the B/C artifacts**. To actually clean B/C in outstanding_debut, the parser needs additional logic to (a) strip parenthetical role tags from name fields and (b) atomise fused-and-string multi-recipient strings even when the category is multi-person `recipient_type=producers`.

### LOW PRIORITY / no-op (7 ceremonies — clean already)

53, 58, 60, 62, 64, 65, 78.

- 60, 65, 78 are post-architectural-fix re-scrapes (control group, 2026-04-28).
- 53, 58, 62, 64 are pre-fix scrapes that happen to be clean (no team credits in outstanding_debut won rows; no role tags in nominee names).

---

## Cross-reference to known-issues entries

| Existing known-issue entry | Confirmed at | Audit findings |
|---|---|---|
| `bafta-73-outstanding-debut-co-recipients-dropped-2026-04-29` | cer 73 | Confirmed: outstanding_debut won row recipients=`["Mark Jenkin"]`, missing Byers + Waite. Status `resolved_date: null`, follow_up to backfill on next re-scrape. |
| `bafta-outstanding-debut-name-field-role-tags-2026-04-29` | cer 54, 55, 56, 57, 59, 61, 63, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77 (19 ceremonies) | Confirmed broadly: 32 Pattern B rows across 19 ceremonies. Status `resolved_date: null`. |
| `bafta-outstanding-debut-fused-multi-recipient-strings-2026-04-29` | cer 63, 66, 67, 68, 70, 72, 74, 75, 76, 77, 79 (11 ceremonies) | Confirmed: 16 Pattern C rows across 11 ceremonies. Status `resolved_date: null`. |
| `split-co-recipients-architectural-fix-2026-04-28` | post-fix re-scrapes: cer 60, 65, 76, 78 | Control group: split_co_recipients categories clean across all four. Pattern A core fix propagated correctly. **No regression.** |
| `co-winner-flag-misapplied-team-credits-2026-04-28` | post-fix re-scrapes | Confirmed clean in control group ceremonies. |

---

## New gaps not yet logged

Two new entries should be added (or the existing cer 73 entry extended) to track these distinct team-credit drops:

### Proposed: `bafta-61-best-director-coens-consolidation-2026-04-30`
- **Scope:** `data/scraped/bafta/bafta-ceremony-61.csv` bafta.best_director won row.
- **Description:** Joel Coen and Ethan Coen jointly won Best Director at the 61st BAFTAs for *No Country for Old Men*. The pre-architectural-fix scrape captured only "Joel Coen" as a single recipient. After re-scrape under the architectural fix (split_co_recipients=false on best_director + in-row split + Mode 2 parser fix), the row should consolidate to `recipients=[{name: "Joel Coen"}, {name: "Ethan Coen"}]`.
- **Resolution path:** re-scrape ceremony 61 (high confidence the fix resolves this — best_director is in single-recipient-type set, all three architectural fixes apply).
- **Source:** Wikipedia 61st British Academy Film Awards article; BAFTA archive.

### Proposed: `bafta-55-outstanding-debut-hopkins-usborne-co-recipients-dropped-2026-04-30`
- **Scope:** `data/scraped/bafta/bafta-ceremony-55.csv` bafta.outstanding_debut won row.
- **Description:** Joel Hopkins (writer/director) and Nicola Usborne (producer) jointly won Outstanding Debut at the 55th BAFTAs for *Jump Tomorrow*. The pre-architectural-fix scrape captured only "Joel Hopkins" as a single recipient. Re-scrape under the architectural fix may NOT resolve this because outstanding_debut has recipient_type=producers (multi-person) and the in-row split fix only fires on single-recipient-type categories. Manual backfill or parser enhancement may be required.
- **Resolution path:** (a) re-scrape and inspect output; (b) if re-scrape doesn't resolve, targeted manual edit adding Usborne as atomic recipient with role=producer; (c) parser enhancement to atomise fused-and-strings within multi-person categories.

### Proposed: `bafta-66-outstanding-debut-layton-doganis-co-recipients-dropped-2026-04-30`
- **Scope:** `data/scraped/bafta/bafta-ceremony-66.csv` bafta.outstanding_debut won row.
- **Description:** Bart Layton (director) and Dimitri Doganis (producer) jointly won Outstanding Debut at the 66th BAFTAs for *The Imposter*. The pre-architectural-fix scrape captured only "Bart Layton". Same architectural class as cer 55 and 73 — re-scrape alone may not resolve.
- **Resolution path:** as above for cer 55.
- **Source:** Wikipedia 66th British Academy Film Awards article; BAFTA nomination press materials.

### Optional clarifying note for existing entries

`bafta-outstanding-debut-name-field-role-tags-2026-04-29` and `bafta-outstanding-debut-fused-multi-recipient-strings-2026-04-29` both currently say resolution path = "re-scrape under corrected recipient_type and architectural fix". The cer 76 control-group evidence in this audit suggests **that resolution path is insufficient on its own** — re-scraping the post-fix scrapers preserves these artifacts because the in-row split fix is gated on `recipient_type ∈ SINGLE`. The follow_up notes on those entries should be updated to reflect that genuine cleanup requires either parser enhancement (strip role tags + atomise fused-and-strings on multi-person categories) or a Phase 4 manual cleanup pass.

---

## Estimated impact

- **Estimated CSV rows changing if all 20 flagged ceremonies re-scraped under current scrapers:** approximately 4 rows (high-confidence Pattern A consolidation: cer 61). The 3 outstanding_debut Pattern A rows (cer 55, 66, 73) and the 48 Pattern B/C rows likely remain unchanged absent further parser work.
- **Estimated wrapper validation outcome:** 27/27 PASS. The wrapper is already passing on all 27 ceremonies because the truth file uses substring-matchable forms. Re-scrape will not regress this.
- **Risk:** low. Architectural fix proven on cer 60/65/76/78 (split_co_recipients categories clean). Cer 61 is the only ceremony where re-scraping has high probability of measurable improvement.
- **Caveat:** the headline "re-scrape will fix everything" framing in the brief intro overstates what the architectural fix can do for outstanding_debut. The fix addresses split_co_recipients single-recipient categories. Outstanding_debut Patterns A-extended/B/C are a separate class needing additional parser work or manual cleanup.

---

## Recommendation

### Phase 2 scope — minimum viable (high-confidence improvement)

Re-scrape **cer 61 only** under the current scrapers. This is the ceremony where the architectural fix has highest confidence of producing measurably cleaner data (Coens consolidation in best_director). Verify wrapper still PASSes; verify Coens are atomic in recipients[].

### Phase 2 scope — full re-scrape (provenance refresh)

Re-scrape the 20 ceremonies in HIGH + MEDIUM priority. Provenance metadata refreshes (newer `scraped_at`, current `scrape_version`); split_co_recipients-class artifacts in best_director / best_editing / best_original_score get cleaned where present (cer 61 only); outstanding_debut Pattern B/C residue likely persists. Use this if a refresh is desired for catalog hygiene rather than data correction.

### Phase 2.5 scope — outstanding_debut deep-clean (preferred, blocks on parser work)

Before re-scraping the 16 Medium-priority ceremonies for genuine data improvement:
1. Extend the BAFTA scraper to strip parenthetical role tags from `recipients[].name` for `bafta.outstanding_debut` and similar multi-person credit categories where Wikipedia source-text annotates roles inline.
2. Extend the in-row split to fire on multi-person `recipient_type` categories when fused-and-strings are detected within a single recipient entry.
3. Re-scrape cer 55, 61, 66, 73 (HIGH) + the 16 Medium ceremonies.
4. Backfill cer 55/66/73 outstanding_debut team credits if (2) doesn't fully resolve them.

### Suggested order

1. Update the three known-issues entries flagged in "New gaps" above.
2. Update follow_ups on the two `bafta-outstanding-debut-*` entries to reflect the cer 76 evidence.
3. Implement Phase 2.5 parser work, OR do Phase 2 minimum viable (cer 61 only) and defer outstanding_debut cleanup.
4. Re-validate via wrapper after each step.
