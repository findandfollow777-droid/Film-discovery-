# BAFTA Scraper Recipient-Splitting Investigation

**Date:** 2026-04-26  
**Scope:** All 26 BAFTA categories, ceremonies 78 and 79  
**Status:** Investigation complete — awaiting fix decision

---

## A. BUG ROOT CAUSE

### Mechanism

The BAFTA scraper (inherited from Oscar scraper architecture) uses a `SINGLE_PERSON_RECIPIENT_TYPES` set to decide whether to split multi-name recipient strings into separate rows:

```python
SINGLE_PERSON_RECIPIENT_TYPES = {
    "director", "actor", "actress", "cinematographer",
    "editor", "composer",
}
```

When a category's `recipient_type` is in this set AND the parsed recipient name contains "and", "&", or ";", the parser calls `_split_co_recipients()` to produce one row per name. Otherwise, all names are kept in a single row's `recipients` array.

### The Problem

**`bafta.outstanding_debut`** has `recipient_type: "director"`, which is in `SINGLE_PERSON_RECIPIENT_TYPES`. But this BAFTA category credits **teams** (writer + director + producer), not single directors. When Wikipedia lists "Jack King, Hollie Bryan and Lucy Meer" for *The Ceremony*, the parser splits this into 3 separate rows instead of keeping it as one row with 3 recipients.

**`bafta.best_editing`** has `recipient_type: "editor"`, also in the set. While most BAFTA editing nominations are single editors, some are teams (e.g., Julian Ulrichs and Chris Gill for *Kneecap* at ceremony 78). The split produces 2 rows with `co_recipient` flags — structurally "working" but semantically wrong (these aren't co-recipients sharing an award; they're a single editing team).

### Affected Categories

| Category | recipient_type | in SINGLE set? | BAFTA reality | Mismatch? |
|----------|---------------|----------------|---------------|-----------|
| bafta.best_leading_actor | actor | YES | Single person | No |
| bafta.best_supporting_actor | actor | YES | Single person | No |
| bafta.ee_rising_star | actor | YES | Single person | No |
| bafta.best_leading_actress | actress | YES | Single person | No |
| bafta.best_supporting_actress | actress | YES | Single person | No |
| bafta.best_cinematography | cinematographer | YES | Usually single, rarely team | Minor risk |
| bafta.best_original_score | composer | YES | Usually single, rarely team | Minor risk |
| bafta.best_director | director | YES | Single person | No |
| **bafta.outstanding_debut** | **director** | **YES** | **Team (W+D+P)** | **YES — confirmed bug** |
| **bafta.best_editing** | **editor** | **YES** | **Sometimes team** | **YES — confirmed bug** |
| bafta.best_film | producers | no | Team | No |
| bafta.outstanding_british_film | producers | no | Team | No |
| bafta.best_documentary | producers | no | Team | No |
| bafta.best_animated_film | producers | no | Team | No |
| bafta.best_childrens_film | film_and_director | no | Team | No |
| bafta.best_film_not_in_english | producers | no | Team | No |
| bafta.best_british_short_film | producers | no | Team | No |
| bafta.best_british_short_animation | producers | no | Team | No |
| bafta.best_casting | casting_director | no | Usually single | No |
| bafta.best_costume_design | costume_designer | no | Usually single | No |
| bafta.best_makeup_and_hair | makeup_artist | no | Team | No |
| bafta.best_production_design | art_director | no | Team | No |
| bafta.best_sound | sound_mixer | no | Team | No |
| bafta.best_special_visual_effects | vfx_supervisor | no | Team | No |
| bafta.best_adapted_screenplay | writer | no | Sometimes team | No |
| bafta.best_original_screenplay | writer | no | Sometimes team | No |

**Confirmed mismatches: 2 categories** (outstanding_debut, best_editing)  
**Minor risk: 2 categories** (cinematography, original_score — rarely team-credited at BAFTAs but possible)

---

## B. SCOPE OF DATA CORRUPTION

### Ceremony 79 (2026)

| Category | Expected rows | Actual rows | Issue |
|----------|--------------|-------------|-------|
| bafta.outstanding_debut | 5 | 9 | 4 extra rows from team splits (The Ceremony 3x, Wasteman 3x) |
| All other categories | correct | correct | No issues found |

**Silent split over-count: +4 rows**

### Ceremony 78 (2025)

| Category | Expected rows | Actual rows | Issue |
|----------|--------------|-------------|-------|
| bafta.outstanding_debut | 5 or 6 | 5 | Possible under-count (Sister Midnight team may have been collapsed) OR correct if Sister Midnight had single-credit nominee. Cannot confirm without checking raw wikitext. |
| bafta.best_editing | 5 (if Kneecap has 1 editor) or 6 (if 2 legitimately different editors) | 6 | Julian Ulrichs and Chris Gill split as co_recipient — likely a team, not two separate nominations |

**Silent split over-count: +1 row (editing)**  
**Possible under-count: TBD (outstanding_debut ceremony 78 needs wikitext verification)**

### Estimated total affected rows: 5-6 across both ceremonies

---

## C. FIX OPTIONS

### Option 1: Pure metadata fix (categories.json only)

Change `recipient_type` for the two affected categories:

| Category | Current | Proposed |
|----------|---------|----------|
| bafta.outstanding_debut | "director" | "team" or "producers" |
| bafta.best_editing | "editor" | Leave as "editor" but... |

**Problem with Option 1 for best_editing:** The `editor` type is in SINGLE_PERSON_RECIPIENT_TYPES globally (shared with Oscar scraper). Changing `bafta.best_editing` to a non-split type would be correct for BAFTA team-credited editing nominations, but the Oscar scraper's `oscar.best_film_editing` also uses `editor` — and Oscar editing nominations ARE single-person. So a global change to remove `editor` from the SINGLE set would break Oscar.

For `outstanding_debut`, changing recipient_type to `"producers"` or a new type like `"team"` would work cleanly — it's BAFTA-only, no Oscar equivalent.

**Confidence: 90% for outstanding_debut, 50% for best_editing** (editing needs a per-festival override, not a type rename)

### Option 2: Metadata fix + scraper code change

(a) Change `bafta.outstanding_debut` recipient_type to `"team"` or `"producers"` in categories.json  
(b) Add a per-category override in scrape-bafta.py that checks a `"force_combine": true` flag on categories that should never split, regardless of recipient_type. This would let `bafta.best_editing` keep `recipient_type: "editor"` (semantically correct for the schema) while preventing the split behavior.

Alternatively: move `SINGLE_PERSON_RECIPIENT_TYPES` into each festival's categories.json as a per-category boolean `"split_co_recipients": true/false`, giving full control without global constants.

**Confidence: 95%** — this fully resolves both categories without cross-festival side effects.

---

## D. RECOMMENDATIONS

1. **Immediate fix (categories.json only):** Change `bafta.outstanding_debut` recipient_type from `"director"` to `"producers"`. This resolves the confirmed 4-row over-count in ceremony 79 and likely the ceremony 78 issue. The `"producers"` type is already used for other BAFTA team categories and is NOT in SINGLE_PERSON_RECIPIENT_TYPES.

2. **Deferred fix for best_editing:** Log as known issue. The Kneecap co-recipient split at ceremony 78 is a minor data anomaly (2 rows instead of 1 for one nomination). A per-category `force_combine` flag would fix it cleanly but requires scraper code change.

3. **Re-scrape scope:** Ceremonies 78 and 79 only (the only two BAFTA ceremonies scraped so far).

4. **Verification after fix:**
   - Ceremony 79 outstanding_debut: 5 rows (down from 9)
   - Ceremony 79 total: ~135 (down from 139)
   - Ceremony 78 outstanding_debut: verify row count matches Wikipedia nomination count
   - Ceremony 78 best_editing: still 6 rows (the Kneecap split remains until the deferred fix)

5. **Verification weakness:** The current "0 flagged" check passes even when rows are silently split. This is because the split rows are structurally valid — they have correct film titles, correct recipient names, and correct win/nominate status. The bug is semantic (wrong row count per nomination), not structural. A future verification step should compare per-category row counts against expected nomination slate sizes.

---

## E. KNOWN-ISSUES ENTRIES TO LOG

### Entry 1: Silent recipient splitting on team categories

```json
{
  "issue_id": "bafta-team-category-recipient-splitting-2026-04-26",
  "discovered_date": "2026-04-26",
  "scope": "BAFTA ceremonies 78, 79 — bafta.outstanding_debut confirmed, bafta.best_editing minor",
  "issue_type": "recipient_type_mismatch",
  "description": "bafta.outstanding_debut had recipient_type 'director' which is in SINGLE_PERSON_RECIPIENT_TYPES, causing multi-name teams to be split into separate rows. Ceremony 79 produced 9 rows instead of 5 (The Ceremony and Wasteman teams split). bafta.best_editing similarly split the Kneecap editing team at ceremony 78.",
  "resolution": "TBD — recommended: change outstanding_debut recipient_type to 'producers'; defer best_editing fix.",
  "resolved_date": null
}
```

### Entry 2: Verification gap — silent splits pass "0 flagged" check

```json
{
  "issue_id": "verification-gap-silent-splits-2026-04-26",
  "discovered_date": "2026-04-26",
  "scope": "All scraped ceremonies (Oscar and BAFTA)",
  "issue_type": "verification_weakness",
  "description": "The scraper's verification (exit code 0 = all categories have rows, exit code 2 = flagged rows) does not detect silent recipient splits. A category producing 9 rows instead of 5 passes with exit code 0. The 'all rows auto_verified' status is also misleading — it verifies provenance, not semantic correctness of row-count-per-nomination. Manual spot-checks caught this issue; automated checks did not.",
  "resolution": "DEFERRED. Future improvement: add expected-row-count bounds per category (e.g., BAFTA Outstanding Debut typically has 5-6 nominations, never 9). Log a warning when row count exceeds bounds.",
  "resolved_date": null
}
```
