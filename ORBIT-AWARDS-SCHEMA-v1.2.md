# ORBIT Awards Schema v1.2.0

**Version:** 1.2.0  
**Date:** 2026-04-25  
**Status:** Active

---

## 1. Overview

This document defines the data schema for the ORBIT Awards system. It specifies the structure of Category and Award entities used across all festival scrapers.

## 2. Conventions

- All IDs use dot-separated lowercase slugs: `festival.category` or `festival.year.category.recipient_slug`
- Dates use ISO 8601 format
- Null fields are omitted in JSON output, empty string in CSV output
- Arrays are JSON-encoded when stored in CSV columns

## 3. Identifiers

### 3.1 Category ID

Format: `{festival}.{category_slug}`  
Example: `oscar.best_director`

### 3.2 Slug Construction

Slugify rule: lowercase, replace non-alphanumeric characters with `_`, collapse consecutive underscores, strip leading/trailing underscores.

### 3.3 Award Row ID

Format: `{category_id}.{year}.{trailing_slug}_unresolved`  
The `_unresolved` suffix indicates TMDB IDs have not yet been resolved (Phase 2). Once resolved, the trailing segment is rebuilt using TMDB IDs for stability.

## 4. Category Entity

See ORBIT-AWARDS-SCOPE for the full category registry. Each category record includes:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique category identifier |
| display_name | string | Current display name |
| historical_names | array | Array of {name, from, to} objects tracking name changes over time. `from` and `to` use ceremony year. |
| first_year | integer | First ceremony year this category was awarded |
| last_year | integer/null | Last ceremony year, or null if still active |
| tile_type | string | UI tile type: "film" or "person" |
| recipient_type | string | Type of recipient: "director", "actor", "actress", "producers", etc. |
| shortlist_published | boolean | Whether the Academy publishes a shortlist before nominations |
| typical_shortlist_size | integer | Usual number of nominees |
| merged_from | array/null | Category IDs that merged into this one |
| merged_into | string/null | Category ID this was merged into |

## 5. Ceremony Entity

| Field | Type | Description |
|-------|------|-------------|
| id | string | `{festival}.{year}` e.g. `oscar.2024` |
| ceremony_number | integer | e.g. 96 |
| year | integer | Ceremony year (year the ceremony was held) |
| date | string | ISO date of ceremony |

## 6. Award Entity (Row)

Each Award row represents one nomination or win for one recipient (or group of recipients) in one category at one ceremony.

### 6.1 Field List

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique row identifier per §3.3 |
| ceremony_id | string | yes | Reference to ceremony: `{festival}.{year}` |
| category_id | string | yes | Reference to category |
| year | integer | yes | Ceremony year |
| result | string | yes | `"won"` or `"nominated"` |
| recipients | array | yes | Array of recipient objects per §6.3 |
| film_tmdb_id | integer/null | no | TMDB movie ID (Phase 2) |
| film_title | string | yes | Title of the film |
| subject_title | string/null | no | Title of the awarded item when distinct from the film. Used for Best Original Song (song title) and Best Original Score where the score has a separately-credited title. Null for film-keyed and person-keyed categories where the film IS the awarded item. |
| film_release_year | integer/null | no | Film release year (Phase 2) |
| film_poster_path | string/null | no | TMDB poster path (Phase 2) |
| source_url | string | yes | URL of primary source |
| source_citation | string | yes | Human-readable citation |
| scraped_at | string | yes | UTC ISO timestamp of scrape |
| scrape_version | string | yes | Scraper version string |
| verified_status | string | yes | One of: `"unverified"`, `"auto_verified"`, `"manual_verified"`, `"flagged"` |
| flags | array | yes | Array of flag strings per §6.5 |
| notes | string/null | no | Free-text notes |

### 6.2 ID Construction

See §3.3. The trailing slug uses the primary recipient name (or film title for film-only categories), slugified per §3.2, with `_unresolved` suffix until TMDB resolution.

### 6.3 Recipients Array

Each element:

| Field | Type | Description |
|-------|------|-------------|
| name | string | Person or entity name |
| role | string/null | Role descriptor (e.g. "Director", "Producer") |
| tmdb_person_id | integer/null | TMDB person ID (Phase 2) |
| profile_path | string/null | TMDB profile image path (Phase 2) |

### 6.4 Verified Status Enum

| Value | Meaning |
|-------|---------|
| unverified | Not yet cross-checked |
| auto_verified | Automatically verified against a second source |
| manual_verified | Manually reviewed and confirmed by a human |
| flagged | Requires human review before use |

### 6.5 Flags Enum

| Flag | Meaning |
|------|---------|
| wikipedia_dlu_agree | Wikipedia and DLu sources agree on this row |
| wikipedia_dlu_disagree | Sources disagree on winner status or details |
| no_dlu_crosscheck_available | No matching DLu row found for cross-check |
| wikipedia_missing_dlu_present | Row exists in DLu but not found in Wikipedia parse |
| dlu_title_variance | DLu title differed in punctuation/casing but was merged via fuzzy match |
| manually_resolved | Previously flagged, resolved by human review |
| co_winner | Row is part of a tie (multiple winners in same category) |
| co_recipient | Nomination shared by multiple individually-credited recipients |

### 6.6 Worked Example — Best Original Song

Best Original Song rows populate both `film_title` (the film) and `subject_title` (the song):

```json
{
  "id": "oscar.best_original_song.2024.billie_eilish_unresolved",
  "ceremony_id": "oscar.2024",
  "category_id": "oscar.best_original_song",
  "year": 2024,
  "result": "won",
  "recipients": [
    { "name": "Billie Eilish", "tmdb_person_id": null, "profile_path": null, "role": null },
    { "name": "Finneas O'Connell", "tmdb_person_id": null, "profile_path": null, "role": null }
  ],
  "film_tmdb_id": null,
  "film_title": "Barbie",
  "subject_title": "What Was I Made For?",
  "film_release_year": null,
  "film_poster_path": null,
  "source_url": "https://en.wikipedia.org/wiki/96th_Academy_Awards",
  "source_citation": "96th Academy Awards Wikipedia article, Best Original Song section",
  "scraped_at": "2026-04-25T...",
  "scrape_version": "scrape-oscar-v1.1.0",
  "verified_status": "auto_verified",
  "flags": ["wikipedia_dlu_agree"],
  "notes": null
}
```

### 6.7 Co-winners

When two or more recipients share an award as a tie (not a team), each recipient gets their own row. Both rows have `result: "won"` and carry the `co_winner` flag. Notes reference the co-winner.

### 6.8 Co-recipients

When a single nomination is shared by multiple individually-credited people in a single-person category (e.g. two directors sharing Best Director), each person gets their own row with the `co_recipient` flag. Notes reference the co-recipient.

---

## 7. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-19 | Initial schema |
| 1.1.0 | 2026-04-25 | Added co_recipient flag, dlu_title_variance flag |
| 1.2.0 | 2026-04-25 | Added optional subject_title field on Award entity for categories where the awarded item has its own title distinct from the film (Best Original Song, optionally Best Original Score). Existing v1.1 data is forward-compatible (subject_title defaults null). |
