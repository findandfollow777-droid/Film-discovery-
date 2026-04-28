# Investigation — `SINGLE_PERSON_RECIPIENT_TYPES` architectural fix

**Date:** 2026-04-28 (filename retains 2026-04-26 per prompt)
**Scope:** Read-only audit of `SINGLE_PERSON_RECIPIENT_TYPES` behaviour across the three Phase-1 scrapers (Oscar / BAFTA / GG).
**Goal:** Surface every (festival, category) pair where the current global splitting heuristic produces wrong rows for team-credited nominations, and propose the smallest architectural fix.

---

## Phase 1 — Scraper internals

### 1.1 The constant

| Scraper | File | Line | Members | Identical? |
|---|---|---|---|---|
| Oscar | `scripts/scrape-oscar.py` | 787 | `{"director", "actor", "actress", "cinematographer", "editor", "composer"}` | — |
| BAFTA | `scripts/scrape-bafta.py` | 73 | `{"director", "actor", "actress", "cinematographer", "editor", "composer"}` | identical to Oscar |
| GG | `scripts/scrape-gg.py` | 103 | `{"director", "actor", "actress", "composer"}` | **diverged**: drops `cinematographer` and `editor` (GG has neither category) |

The Oscar and BAFTA sets are byte-identical. GG dropped `cinematographer` and `editor` because the GG scope has no such categories — semantic divergence, not a behavioural change. **No other constant or per-festival recipient logic exists.**

### 1.2 Where it gets used

Same shape in all three scrapers — only the line numbers differ.

| Scraper | `is_single_person` decision | `_split_co_recipients` definition |
|---|---|---|
| Oscar | `scrape-oscar.py:843` | `scrape-oscar.py:793` |
| BAFTA | `scrape-bafta.py:440` | `scrape-bafta.py:415` |
| GG | `scrape-gg.py:567` | `scrape-gg.py:542` |

`build_award_rows` does:

```python
is_single_person = cat.get("recipient_type", "") in SINGLE_PERSON_RECIPIENT_TYPES
...
if is_single_person and name:
    split_names = _split_co_recipients(name)   # tries to split "A and B"
else:
    split_names = [name] if name else [""]
```

When `len(split_names) > 1`, the scraper produces **one row per individual**, each carrying flag `co_recipient`. When `is_single_person` is False, all parsed names are kept on a single row in the `recipients[]` array.

### 1.3 Two failure modes (both silent)

**Mode 1 — over-splitting.** `_split_co_recipients` only fires when `name` is a string containing " and " / " & " / "; ". That happens when the upstream parser captured *plain-text* "X and Y" — typically when neither name was wikilinked. Result: one team nomination becomes two rows with `co_recipient` flag.

**Mode 2 — silent data loss.** When the wikitext format is *Person-first* (`[[A]] and [[B]] – ''Film''`), `_extract_person_name(left)` returns only the *first* wikilink's display name. The second name is dropped. `name="A"` → `_split_co_recipients` doesn't split → the nomination produces one row missing recipient B. No flag is set.

The two modes depend entirely on whether names were wikilinked in source markup, which varies from year to year and editor to editor. Neither mode is surfaced as a flag a downstream consumer can rely on.

---

## Phase 2 — Per-festival category audit (categories.json `recipient_type` ∈ SINGLE set)

Classification key:
- **ALWAYS single** — the festival's convention is one named individual per nomination. Multiple wins/nominations from the same film in the same year are *separate nominations*, not team credits.
- **SOMETIMES team** — usually single, but the category occasionally credits a duo or team as a single nomination.
- **USUALLY team** — most nominations credit multiple individuals as a single team.

### 2.1 Oscar (8 categories in SINGLE set)

| Category | recipient_type | Classification | Reason |
|---|---|---|---|
| `oscar.best_director` | director | **SOMETIMES team** | Joel & Ethan Coen, Daniels (Kwan/Scheinert), Wachowskis. Both names sit on one nomination in AMPAS records. |
| `oscar.best_actor` | actor | ALWAYS single | One credited lead per nomination. |
| `oscar.best_actress` | actress | ALWAYS single | One credited lead per nomination. |
| `oscar.best_supporting_actor` | actor | ALWAYS single | Two supporting actors from the same film are two distinct nominations. |
| `oscar.best_supporting_actress` | actress | ALWAYS single | As above. |
| `oscar.best_cinematography` | cinematographer | ALWAYS single | One DP credited. |
| `oscar.best_film_editing` | editor | **SOMETIMES team** (de facto USUALLY team) | Most modern editing nominations credit two or more editors (Hill/Hanley, Wall/Baxter, Cuarón/Sanger). Already 28 multi-recipient single rows captured correctly by the Film-first parser branch. |
| `oscar.best_original_score` | composer | **SOMETIMES team** | Composer duos are common (Reznor/Ross, O'Halloran/Hauschka, Ducol/Camille). 8 multi-recipient single rows already captured correctly. |

### 2.2 BAFTA (9 categories in SINGLE set)

| Category | recipient_type | Classification | Reason |
|---|---|---|---|
| `bafta.best_director` | director | **SOMETIMES team** | Same convention as Oscar. Dayton/Faris (LMS 2007), Daniels (EEAAO 2023). |
| `bafta.best_leading_actor` | actor | ALWAYS single | |
| `bafta.best_leading_actress` | actress | ALWAYS single | |
| `bafta.best_supporting_actor` | actor | ALWAYS single | |
| `bafta.best_supporting_actress` | actress | ALWAYS single | |
| `bafta.best_cinematography` | cinematographer | ALWAYS single | |
| `bafta.best_editing` | editor | **SOMETIMES team** (de facto USUALLY team) | Editing teams pervasive at BAFTA too. 22 multi-recipient single rows captured correctly. |
| `bafta.best_original_score` | composer | **SOMETIMES team** | 19 multi-recipient single rows (Zimmer/Gerrard, Yared/Burnett, Reznor/Ross, etc.). |
| `bafta.ee_rising_star` | actor | ALWAYS single | Public-vote single-person award. |

### 2.3 GG (8 categories in SINGLE set)

| Category | recipient_type | Classification | Reason |
|---|---|---|---|
| `gg.best_director` | director | **SOMETIMES team** | Same convention as Oscar/BAFTA. |
| `gg.best_actor_drama` | actor | ALWAYS single | |
| `gg.best_actress_drama` | actress | ALWAYS single | |
| `gg.best_actor_musical_comedy` | actor | ALWAYS single | |
| `gg.best_actress_musical_comedy` | actress | ALWAYS single | |
| `gg.best_supporting_actor` | actor | ALWAYS single | |
| `gg.best_supporting_actress` | actress | ALWAYS single | |
| `gg.best_original_score` | composer | **SOMETIMES team** | 82nd GG (2025): Reznor/Ross — Atticus Ross silently dropped (Mode 2), confirmed manually during GG scraper bring-up. |

### 2.4 Out of scope (not in SINGLE set, no current bug surface)

`writer` (Oscar/BAFTA/GG screenplay), `songwriter` (Oscar/GG original song), `producers`, `casting_director`, `art_director`, `costume_designer`, `makeup_artist`, `sound_mixer`, `sound_editor`, `vfx_supervisor`, `country`, `multiple_persons`, `film_and_director` — all bypass the SINGLE-set check and therefore the splitting code path. They go through the multi-recipient single-row branch and rely on `extra_names` populated by the parser. Any data-loss issues there are parser bugs, not splitting bugs.

---

## Phase 3 — Empirical evidence

Two data signals were measured across all scraped CSVs:
- **Mode 1 evidence** = rows with `co_recipient` flag (direct fingerprint of `_split_co_recipients` firing).
- **Already-correct** = `len(recipients_json) > 1` on a single row (multi-recipient teams preserved as one nomination).

### 3.1 Mode 1 (over-split) — confirmed cases

```
oscar.best_director: 6 rows across ceremonies [80, 83, 95]
  - 2008 (80th)  No Country for Old Men    [Joel Coen / Ethan Coen]    won
  - 2011 (83rd)  True Grit                  [Joel Coen / Ethan Coen]    nominated
  - 2023 (95th)  Everything Everywhere AAO  [Daniel Kwan / Daniel Scheinert]  won

bafta.best_director: 4 rows across ceremonies [60, 76]
  - 2007 (60th)  Little Miss Sunshine       [Jonathan Dayton / Valerie Faris]   nominated
  - 2023 (76th)  Everything Everywhere AAO  [Daniel Kwan / Daniel Scheinert]    nominated

bafta.best_editing: 4 rows across ceremonies [65, 78]
  - 2012 (65th)  Senna                      [Gregers Sall / Chris King]         won
  - 2025 (78th)  Kneecap                    [Julian Ulrichs / Chris Gill]       nominated
```

### 3.2 Mode 2 (silent data loss) — suspected, low empirical surface yet

| Festival/Category | Suspected cases |
|---|---|
| `gg.best_original_score` | 82nd GG Challengers (Reznor/Ross — only Trent captured, Atticus dropped). Other ceremonies not yet scraped. |
| `gg.best_director` | No duos in 83rd ceremony scrape. Older ceremonies (Coens, Daniels, etc.) not yet scraped. |

GG only has ceremony 83 currently in `data/scraped/gg/`, so Mode-2 evidence is necessarily thin. The architectural exposure is identical to Oscar/BAFTA, so re-scraping older GG ceremonies will surface more cases.

### 3.3 Already-correct multi-recipient single-row rows (NOT to re-scrape)

These rows are stored as one nomination with multiple `recipients[]` entries — no consolidation needed.

```
oscar.best_cinematography:    2 rows
oscar.best_film_editing:     28 rows
oscar.best_original_score:    8 rows
bafta.best_cinematography:    4 rows
bafta.best_editing:          22 rows
bafta.best_original_score:   19 rows
```

The discrepancy between SOMETIMES-team categories with many multi-recipient single rows (correct) and a small handful of `co_recipient` rows (Mode 1 split) is explained by *wikitext layout convention*: the Film-first format (`''Film'' – Editor1 and Editor2`) routes through the `left_is_film` branch which captures `extra_names`; the Person-first format (`Editor1 and Editor2 – ''Film''`) routes through `right_is_film` which only captures the first name. A handful of years use Person-first plain-text "and" patterns and trip Mode 1; the rest use Film-first wikilinked patterns and stay correct.

### 3.4 Sample rows (≤10 per affected category)

`oscar.best_director` — co_recipient rows (all of them):
| year | film | recipients | flags |
|---|---|---|---|
| 2008 | No Country for Old Men | Joel Coen | co_recipient, co_winner |
| 2008 | No Country for Old Men | Ethan Coen | co_recipient, co_winner |
| 2011 | True Grit | Joel Coen | co_recipient |
| 2011 | True Grit | Ethan Coen | co_recipient |
| 2023 | Everything Everywhere All at Once | Daniel Kwan | co_recipient, co_winner |
| 2023 | Everything Everywhere All at Once | Daniel Scheinert | co_recipient, co_winner |

`bafta.best_director` — co_recipient rows (all of them):
| year | film | recipients | flags |
|---|---|---|---|
| 2007 | Little Miss Sunshine | Jonathan Dayton | single_source_wikipedia_only, co_recipient |
| 2007 | Little Miss Sunshine | Valerie Faris | single_source_wikipedia_only, co_recipient |
| 2023 | Everything Everywhere All at Once | Daniel Kwan | single_source_wikipedia_only, co_recipient |
| 2023 | Everything Everywhere All at Once | Daniel Scheinert | single_source_wikipedia_only, co_recipient |

`bafta.best_editing` — co_recipient rows (all of them):
| year | film | recipients | flags |
|---|---|---|---|
| 2012 | Senna | Gregers Sall | single_source_wikipedia_only, co_recipient, co_winner |
| 2012 | Senna | Chris King | single_source_wikipedia_only, co_recipient, co_winner |
| 2025 | Kneecap | Julian Ulrichs | single_source_wikipedia_only, co_recipient |
| 2025 | Kneecap | Chris Gill | single_source_wikipedia_only, co_recipient |

Already-team-correct sample (`bafta.best_original_score`, abbreviated):
| year | film | recipients |
|---|---|---|
| 2002 | Moulin Rouge! | [Craig Armstrong, Marius de Vries] |
| 2004 | Cold Mountain | [Gabriel Yared, T Bone Burnett] |
| 2012 | The Girl with the Dragon Tattoo | [Trent Reznor, Atticus Ross] |
| 2021 | Soul | [Jon Batiste, Trent Reznor, Atticus Ross] |
| 2025 | Emilia Pérez | [Camille, Clément Ducol] |

These rows are already correct per the proposed convention — no re-scrape needed.

---

## Phase 4 — Festival summary

### Oscar
- Categories with recipient_type in SINGLE set: **8**
- **Confirmed AFFECTED** (Mode 1 splitting in scraped data):
  - `oscar.best_director` (director, 6 rows / 3 pairs)
- **Likely AFFECTED** (SOMETIMES team — Mode 2 latent risk; no Mode 1 evidence yet):
  - `oscar.best_film_editing` (editor) — 28 already-correct multi-recipient rows; not currently broken but will break if a future ceremony's wikitext flips to Person-first.
  - `oscar.best_original_score` (composer) — 8 already-correct multi-recipient rows; same risk.
- Not affected:
  - `oscar.best_actor`, `oscar.best_actress`, `oscar.best_supporting_actor`, `oscar.best_supporting_actress`, `oscar.best_cinematography`.

### BAFTA
- Categories with recipient_type in SINGLE set: **9**
- **Confirmed AFFECTED**:
  - `bafta.best_director` (director, 4 rows / 2 pairs)
  - `bafta.best_editing` (editor, 4 rows / 2 pairs)
- **Likely AFFECTED**:
  - `bafta.best_original_score` (composer) — 19 already-correct multi-recipient rows; no Mode 1 evidence yet but architecturally exposed.
- Not affected:
  - `bafta.best_leading_actor`, `bafta.best_leading_actress`, `bafta.best_supporting_actor`, `bafta.best_supporting_actress`, `bafta.best_cinematography`, `bafta.ee_rising_star`.

### GG
- Categories with recipient_type in SINGLE set: **8**
- **Confirmed AFFECTED**: (none surfaced yet — only ceremony 83 scraped)
- **Likely AFFECTED** (architectural, not yet observable):
  - `gg.best_director` (director) — Person-first format observed at 83rd; Mode 2 will fire on older ceremonies that had duo directors.
  - `gg.best_original_score` (composer) — 82nd Reznor/Ross dropped Atticus during scraper bring-up (manual observation).
- Not affected:
  - `gg.best_actor_drama`, `gg.best_actress_drama`, `gg.best_actor_musical_comedy`, `gg.best_actress_musical_comedy`, `gg.best_supporting_actor`, `gg.best_supporting_actress`.

---

## Phase 5 — Re-scrape scope

Only the **confirmed AFFECTED** rows actually need consolidation. The "likely AFFECTED" categories are a one-line categories.json change; their existing rows are already correct.

| Festival | Category | Ceremonies needing re-scrape | Rows that consolidate |
|---|---|---|---|
| Oscar | `oscar.best_director` | 80 (2008), 83 (2011), 95 (2023) | 6 rows → 3 rows |
| BAFTA | `bafta.best_director` | 60 (2007), 76 (2023) | 4 rows → 2 rows |
| BAFTA | `bafta.best_editing` | 65 (2012), 78 (2025) | 4 rows → 2 rows |
| GG | `gg.best_director` | unknown until older GG ceremonies are scraped — 0 ceremonies in scope today |
| GG | `gg.best_original_score` | 82 (2025) for Reznor/Ross consolidation; verify others as scraped |

**Total empirical scope today: 7 ceremonies, ~14 rows → 7 rows after consolidation.** Plus zero-to-many GG ceremonies as the GG scope expands.

The "likely AFFECTED" `oscar.best_film_editing`, `oscar.best_original_score`, `bafta.best_original_score` need *no row changes* once the categories.json change is applied — their data is already correct. They get re-scrape coverage during normal Phase-1 batch runs.

---

## Phase 6 — Schema implications

Schema v1.2 (`ORBIT-AWARDS-SCHEMA-v1.2.md`, §4) does **not** carry a per-category field that encodes "is this category team-credited or individual-credited?". Today's behaviour is implied by `recipient_type` ∈ a hardcoded global set inside each scraper.

### Proposed schema change

Add an optional per-category boolean to the Category entity:

```
| split_co_recipients | bool | Defaults to true. When false, the scraper
                              keeps multi-name credits on a single row in
                              recipients[] instead of splitting into one
                              row per name. Use false for team-credited
                              categories (editor, composer pairs,
                              co-director duos). |
```

Default `true` preserves current behaviour for any unannotated existing category. The fix becomes a categories.json edit per affected category, not a global scraper rewrite.

**Schema bump: v1.2 → v1.3.** Minor change (additive optional field, default preserves prior behaviour, existing rows remain valid).

Alternative naming considered and rejected:
- `team_credited: bool` — semantically nicer but requires inverting the default (true preserves new behaviour, false old) and implies *more* than the splitting question.
- `recipient_grouping: "team" | "individual"` — adds a new enum we'd then have to maintain.

`split_co_recipients` is the smallest, most behaviourally-faithful name.

---

## Phase 7 — Recommended fix path

1. **Schema bump** v1.2 → v1.3.
   - Add `split_co_recipients: bool` (default true) to Category §4.
   - Update version table; note in v1.3 changelog.

2. **Categories.json edits** — set `split_co_recipients: false` on the SOMETIMES-team / USUALLY-team rows below:
   - `scripts/scrape-oscar-categories.json`:
     - `oscar.best_director`
     - `oscar.best_film_editing`
     - `oscar.best_original_score`
   - `scripts/scrape-bafta-categories.json`:
     - `bafta.best_director`
     - `bafta.best_editing`
     - `bafta.best_original_score`
   - `scripts/scrape-gg-categories.json`:
     - `gg.best_director`
     - `gg.best_original_score`

3. **Scraper changes** — per scraper:
   - Replace the global `is_single_person = cat.get("recipient_type", "") in SINGLE_PERSON_RECIPIENT_TYPES` with `is_single_person = cat.get("split_co_recipients", True) and cat.get("recipient_type", "") in SINGLE_PERSON_RECIPIENT_TYPES`. Smallest possible change; the SINGLE set still acts as a recipient-type allowlist (so we don't misfire on `producers`/`writer`), but a category-level opt-out prevents splitting.
   - Additionally, fix the **Mode 2 data-loss bug** in the parser: the `right_is_film` branch should populate `extra_names` from `_extract_all_names(left)` so both wikilinked names land in `recipients[]`. This is a one-line addition mirroring the symmetric `left_is_film` branch and is required for `split_co_recipients=false` to work end-to-end. Applies to all three scrapers (parser code is identical).

4. **Re-scrape scope** — minimum to converge data with new behaviour:
   - Oscar ceremonies: **80, 83, 95** (consolidates 6 director rows to 3).
   - BAFTA ceremonies: **60, 65, 76, 78** (consolidates director + editing).
   - GG ceremony: **82** (Reznor/Ross). 83 already correct (no duos at 83rd). Older GG ceremonies will be covered by their first scrape.
   - The "likely AFFECTED" categories (editor/score rows already on single rows) need no row changes; just the categories.json flag for forward correctness.

5. **Verification approach**:
   - Use the existing per-festival batch wrappers (`scripts/scrape-bafta-batch.py`, the upcoming `scrape-gg-batch.py`, and whatever Oscar uses) to re-run the affected ceremonies.
   - Add the affected director/editor pairs to each festival's `*-landmark-truth.json` so the wrapper can assert the expected single-row outcome (e.g. `{"winner_film": "Everything Everywhere All at Once", "winner_recipients": ["Daniel Kwan", "Daniel Scheinert"], "expected_nomination_count": N}`). The current truth schema records a single `winner_recipient` string; extending to a `winner_recipients` array (or accepting either) is part of the v1.3 follow-through.
   - Spot-check a few Person-first composer rows after the parser fix to confirm Mode 2 loss is closed.

---

## Appendix — divergence note

The `SINGLE_PERSON_RECIPIENT_TYPES` constant has *not* drifted in semantics across Oscar/BAFTA. GG drops two members but only because GG has no editing/cinematography categories. Once the proposed `split_co_recipients` flag is in place, the global set can stay a recipient-type allowlist; the only per-festival behaviour worth keeping is "which recipient types could ever be single?" (currently the same answer everywhere except GG-which-doesn't-have-them).

The deeper architectural takeaway: the bug is jointly a *schema gap* (no per-category splitting flag) and a *parser gap* (Mode 2 silent loss in the `right_is_film` branch). Fixing one without the other still leaves data wrong; the v1.3 schema bump and the parser one-liner are both required.
