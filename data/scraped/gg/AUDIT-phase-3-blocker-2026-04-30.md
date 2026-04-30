# GG Phase 3 Blocker Investigation — 2026-04-30

## TL;DR

**Root cause:** `scripts/scrape-gg.py` uses one section-detection strategy — find every `{{Award category|...}}` template via `mwparserfromhell`. That template was added to GG Wikipedia articles only at the 81st ceremony (2024). For cer 58–80 the data is on the page but lives inside a different scaffolding: a wikitable whose category headers are bare `! [[Golden Globe Award for X|Display]]` cells. The scraper finds 0 sections and writes 23 empty CSVs.

**Proposed fix scope:** 
- **Scraper** (`scrape-gg.py`): add a *fallback* section-detection branch that walks the wikitable header cells when 0 `Award category` templates are found. Bullet parsing is reusable as-is — `*`/`**` winner/nominee structure is identical for cer 60–80 and cer 81–83. Lower `MIN_CEREMONY` from 58 to 57 (off-by-one vs. the scope doc).
- **Categories file** (`scrape-gg-categories.json`): add a small set of section_aliases for the *table-header* display labels used in older articles ("Drama" / "Actor" / "Actress" / "Supporting Actor" etc. — the abbreviated cell labels), and possibly the wikilink-target form `Best Actor – Motion Picture Drama` (older URL slug).
- **No expectations / truth file changes** required for Phase 3.6.

**Estimated effort:** ~1 focused session. The fallback parser is well-bounded; the riskiest file is cer 58 (mixed bullet styles, see §3.4).

---

## 1. Article URL & redirect handling

### How URLs are constructed

`scrape-gg.py:181-194` calls the MediaWiki Action API with `page={ordinal}_Golden_Globe_Awards` and `redirects=1`. The `redirects=1` parameter makes the API silently follow the page rename redirect.

### Redirect behaviour observed

Wikipedia renamed every GG ceremony article from `{N}th Golden Globe Awards` → `{N}th Golden Globes` (verified across cer 58, 79, 80, 81). The `redirects=1` param works correctly: the scraper successfully fetches every page. Confirmed by:

| Ceremony | Requested page | Resolved title | Wikitext fetched |
|---|---|---|---|
| 81 | `81st_Golden_Globe_Awards` | `81st Golden Globes` | 61 KB ✓ |
| 80 | `80th_Golden_Globe_Awards` | `80th Golden Globes` | 49 KB ✓ |
| 79 | `79th_Golden_Globe_Awards` | `79th Golden Globes` | 32 KB ✓ |
| 58 | `58th_Golden_Globe_Awards` | `58th Golden Globes` | 21 KB ✓ |

**The redirect is not the blocker.** Every page fetches. The wikitext is fully available in `data/scraped/gg/raw/ceremony-{58..80}-wikipedia.json` for offline analysis.

The blocker is downstream — section detection on the (correctly-fetched) wikitext.

---

## 2. Section detection deltas

### Cer 81 (canonical baseline — works)

`scrape-gg.py:228` matches `{{Award category|...}}` templates. Cer 81's article wraps each category in this template:

```
{{Award category|#F9EFAA|[[Golden Globe Award for Best Motion Picture – Drama|Best Motion Picture – Drama]]}}
* '''[[Oppenheimer (film)|Oppenheimer]]'''
** [[The Holdovers (film)|The Holdovers]]
** ...
```

Result on cer 81: 27 templates found → 15 film categories matched → 92 rows ✓

### Cer 80 (and ALL older — fails)

Cer 80 uses a wikitable instead. The category boundary is a table header cell:

```
==Winners and nominees==
===Film===
{| class=wikitable style="width=100%"
! colspan="2"| Best Motion Picture
|-
! style="width=50%"| [[Golden Globe Award for Best Motion Picture – Drama|Drama]]
! style="width=50%"| [[Golden Globe Award for Best Motion Picture – Musical or Comedy|Musical or Comedy]]
|-
| valign="top" |
* '''''[[The Fabelmans]]'''''
** ''[[Avatar: The Way of Water]]''
** ''[[Elvis (2022 film)|Elvis]]''
...
```

Result on cer 80: **0 `Award category` templates found** → all 14 active categories WARN missing → 0 rows.

### Cer 58 (oldest fetched — fails for an additional reason)

Cer 58 has the same table-based scaffolding **but with a flatter bullet style**:

```
! colspan="2" |Best Motion Picture
|-
! style="width=50%" |[[Golden Globe Award for Best Motion Picture – Drama|Drama]]
...
| valign="top" |

'''''[[Gladiator (2000 film)|Gladiator]]'''''
* ''[[Billy Elliot]]''
* ''[[Erin Brockovich (film)|Erin Brockovich]]''
* ...
```

Note: winner is bare `'''…'''` (no `*` prefix), nominees use single `*` (not `**`). This won't parse with the existing `parse_nominees_from_section` which expects `*` for winner and `**` for nominee. Cer 58 has 11 nested `* '''` winner bullets *somewhere* in the file (likely TV section uses the modern style) but film categories use the flat style. Mixed-format article.

### Section structure summary

| Ceremony | Award category template | Table-header detection needed | Bullet style |
|---|---|---|---|
| 81–83 | ✅ found (27 templates each) | not needed | `*` / `**` |
| 60–80 | ❌ 0 templates | needed (table-header cells) | `*` / `**` (works) |
| 58–59 | ❌ 0 templates | needed (table-header cells) | mixed flat + nested ⚠️ |

### Concrete deltas requiring scraper change

1. **Section detection fallback**: when `extract_category_sections()` returns 0 results, run a second pass that walks the parsed wikitext for `! [[Golden Globe Award for ...|Display]]` table header cells. Scope: contributes the section-name (the `Display` text or the wikilink target) and the section-text (the table cell's content until the next `! ` or `|-` row separator, or the `|}` table close).
2. **Bullet style normalization for cer 58–59 only**: the existing `parse_nominees_from_section` handles `*` and `**` correctly. The flat-format quirk (bare `'''winner'''` + `*` nominees, no `**`) only affects cer 58–59 film categories. Either (a) re-bullet-ify those rows pre-parse, or (b) detect "no `**` in section" → treat first bold line as winner and remaining `*` as nominees. The flat style is a clear minority — defer detailed handling decision to the Phase 3.6 implementation.

---

## 3. Category naming drift

### Existing aliases in `scrape-gg-categories.json`

`scrape-gg-categories.json` already covers display-name and historical-name drift well (verified line-by-line):

| Category | Aliases handled |
|---|---|
| `gg.best_motion_picture_drama` | en-dash, hyphen, no-dash variants |
| `gg.best_motion_picture_musical_comedy` | "Comedy or Musical" reversal, en-dash/hyphen |
| `gg.best_motion_picture_animated` | "Best Animated Feature Film", "Best Animated Feature" |
| `gg.best_motion_picture_non_english` | "Best Foreign Language Film" (1965–2021), "Best Foreign Film" |
| `gg.best_actor_drama` | "Best Performance by an Actor", "Best Male Actor" (2026 rename) |
| `gg.best_actor_musical_comedy` | same expansion |
| `gg.best_actress_drama` / `_musical_comedy` | same expansion |
| `gg.best_supporting_actor` / `_actress` | "Best Performance by an Actor in a Supporting Role" |
| `gg.best_director` / `_screenplay` / `_original_score` / `_original_song` | en-dash/hyphen variants |

### Missing aliases — to be added in Phase 3.6

The older-article wikitable uses **abbreviated cell labels** in the `[[Award page|Display]]` form. The `Display` text is short — sometimes just "Drama" / "Actor" / "Supporting Actor". The scraper's `match_category_to_section` (line 285) already does substring matching, so partial overlap with existing aliases would generally work. But two specific cases need explicit aliases:

1. **`gg.best_actor_drama`**: cer 79 wikitext has `[[Golden Globe Award for Best Actor – Motion Picture Drama|Actor]]` — the **wikilink target** (`Best Actor – Motion Picture Drama`) is a different word order than today's `Best Actor in a Motion Picture – Drama`. Phase 3.6 should add: `"Best Actor – Motion Picture Drama"`, `"Best Actor - Motion Picture Drama"`. Similarly for actress / musical-comedy / supporting variants.
2. **`gg.best_actress_musical_comedy`**: cer 79 has `[[…|Best Actress – Motion Picture Comedy or Musical|Actress]]` — confirms the "Comedy or Musical" reversal in the link target. Already covered for the display name; needs link-target alias added too.

The match logic in `_extract_category_name_from_template` extracts the *Display* text (after the pipe), not the link target. For table-header parsing in the fallback, Phase 3.6 should extract **both** (link target AND display) and feed both into the alias-match pool.

### Wikipedia category renames within scope (1944–2026)

A non-exhaustive list, derived from the cache files and confirmed against `historical_names`:

| Modern name | Older name | Era boundary |
|---|---|---|
| Best Motion Picture – Non-English Language | Best Foreign Language Film | renamed at 79th GG (2022) |
| Best Motion Picture – Animated | (didn't exist) | introduced at 64th GG (2007) |
| Best Male Actor in a Motion Picture – Drama | Best Actor in a Motion Picture – Drama | renamed at 83rd GG (2026) |
| Best Female Actor in a Motion Picture – Drama | Best Actress in a Motion Picture – Drama | renamed at 83rd GG (2026) |
| Best Supporting Male Actor in a Motion Picture | Best Supporting Actor in a Motion Picture | renamed at 83rd GG (2026) |
| Cinematic and Box Office Achievement | (didn't exist) | introduced at 81st GG (2024) |

All are already covered in `historical_names`. The expectations file's `first_year` filtering correctly elides categories before their introduction.

---

## 4. Ceremony 57 floor

### Where the floor lives

`scrape-gg.py:96`:
```python
MIN_CEREMONY = 58  # year 2001
```

Enforcement at `scrape-gg.py:765-768`:
```python
if ceremony_num < MIN_CEREMONY:
    print(f"ERROR: Ceremony {ceremony_num} is before the minimum supported ({MIN_CEREMONY}).")
    print(f"  This scraper only supports ceremonies from {MIN_CEREMONY} ({ceremony_to_year(MIN_CEREMONY)}) onwards.")
    sys.exit(1)
```

Comment intent: floor was set at "year 2001" (cer 58 = 2001) — but `CEREMONY_YEAR_OFFSET = 1943` means cer 57 = 2000. The off-by-one is explicit in the original handover note (line 7-15 of the scraper docstring).

### What the scope says

`ORBIT-AWARDS-SCOPE-v1.4.md:19`:
```
| Golden Globe | golden_globe. | 2000-present | Planned | TBD |
```

Cross-referencing Oscar (line 17) and BAFTA (line 18), both also "2000-present". BAFTA's wrapper covers cer 53–79 (27 ceremonies); cer 53 = 2000 (offset 1947). So the scope's "2000-present" means **ceremony year 2000 onwards**, not honours-year 2000.

For GG, ceremony year 2000 = cer 57 (offset 1943). Therefore:

- **Scope says**: cer 57 in scope (2000 ceremony year).
- **Scraper says**: cer 58 floor (2001 ceremony year).
- **Off-by-one**: scraper is wrong vs. scope. Scope is authoritative.

### Recommendation

Phase 3.6 should change `MIN_CEREMONY = 58` → `MIN_CEREMONY = 57`. This unblocks cer 57 (Jan 2000 ceremony, honouring 1999 films). 27 GG ceremonies in total then matches the BAFTA 27-ceremony footprint and the "27/27 truth coverage" wording in earlier prompts.

Note: the cer 57 Wikipedia article structure is **not yet verified** because the floor blocks fetching it. The Phase 3.6 implementation should fetch and inspect cer 57 *before* applying any cleanup, in case its format varies further (some pre-2000 GG articles use yet a third format style; cer 57 is on the boundary).

---

## 5. Stray files cleanup

Inventory at audit time:

| Type | Count | Location | Cer range | Action |
|---|---|---|---|---|
| Empty CSVs | 23 | `data/scraped/gg/gg-ceremony-{58..80}.csv` | 58–80 | **Delete** — all header-only, no data |
| Raw cache JSONs | 23 | `data/scraped/gg/raw/ceremony-{58..80}-wikipedia.json` | 58–80 | **Keep** — real Wikipedia content, useful for Phase 3.6 dev/test |
| `.parse-error` placeholders | 316 | `data/scraped/gg/raw/ceremony-{58..80}-{slug}.parse-error` | 58–80 | **Delete** — generated by failed scrape, regenerated automatically |

Plus existing valid GG state (DO NOT touch in Phase 3.6 cleanup):
- `gg-ceremony-{81,82,83}.csv` — 92 rows each, valid
- `raw/ceremony-{81,82,83}-wikipedia.json` — valid
- `raw/.gitkeep`, `batch-reports/.gitkeep` — committed

### Confirmation: cer 81 unaffected

Cer 81's CSV is the canary that succeeded in this Phase 3 run. Inspection shows 92 rows, 15 categories, no corruption. The wrapper validates it 1/1 PASS (Phase E silent — no truth coverage yet).

---

## 6. Recommended Phase 3.6 scope

### Smallest viable change set

Three files touched, in increasing risk order:

1. **`scripts/scrape-gg.py`** — two changes:
   - Lower `MIN_CEREMONY` from 58 to 57.
   - Add a fallback in `extract_category_sections()`: when the `Award category` template scan returns 0 results, run a second pass that locates `! [[Golden Globe Award for X|Display]]` table-header cells and slices the section text from each header to the next sibling header / row separator / table close. Return `(category_name, section_text)` tuples in the same shape as the existing path so downstream code is untouched.
   - Optionally: if cer 58–59 flat bullet style needs handling, normalise pre-parse (e.g., re-bullet-ify a `'''winner'''` line at top of a section to `* '''winner'''`, and convert `*` nominees to `**` when the section has no `**`). Defer this decision to first sight of cer 58 output.

2. **`scripts/scrape-gg-categories.json`** — additive only:
   - Add link-target aliases for older actor/actress link form (`Best Actor – Motion Picture Drama`, etc.).
   - Sanity-check during Phase 3.6: read the section names extracted from cer 80 fallback parse, then verify that at least one alias-or-link-target matches each of the 14 active categories. If any miss, add a targeted alias.

3. **Cleanup** (last, after wrapper validates):
   - Delete the 23 empty CSVs and 316 `.parse-error` files.
   - Keep all raw cache JSONs.

### Acceptance criteria

After Phase 3.6 lands, the following must all hold:

- `python3 scripts/scrape-gg.py --ceremony 57` succeeds (does not error on minimum).
- Re-scraping cer 80 produces a CSV with ~84 rows (14 active categories × 6 nominees average; cinematic_box_office_achievement absent at cer 80 because first_year=2024). Cer 80 structural Phase A–D should PASS via the wrapper.
- Re-scraping all of cer 57–80 produces non-empty CSVs and the wrapper PASSes Phases A–D on each (Phase E silent for cer 57–80, no truth coverage yet).
- Cer 81 / 82 / 83 re-scrapes produce **identical** CSVs to current state (the `Award category` template path is unchanged).
- Combined wrapper sweep: 27/27 PASS Phases A–D, 2/27 Phase E covered (unchanged from current).

### Risks to watch

- **Cer 58–59 flat bullet style**: untested in this audit; first re-scrape after fallback lands will reveal whether the bullet normalization shortcut is needed.
- **Cer 57**: format unknown until floor is lowered and a fetch is attempted. Could be in either format era or a third one.
- **Multi-row wikitable cells**: some older articles (cer 80, cer 65) use `colspan="2"` on a parent header (e.g. "Best Motion Picture") that itself contains two nested category headers (Drama / Musical-or-Comedy). The fallback section walker must NOT match the parent (which has no Award-link wikilink in its text) and MUST match the children (which do). The proposed wikilink anchor `[[Golden Globe Award for ...]]` discriminator handles this — verify in Phase 3.6.
- **Cer 65 abbreviated link targets**: the wikilink target for actor categories at cer 65 is `Best Actor – Motion Picture Drama` (not `Best Actor in a Motion Picture – Drama`). The new aliases must cover this older form.
