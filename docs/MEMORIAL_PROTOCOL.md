# Memorial Protocol — Recently Deceased People

When a person in the film industry passes away, the following steps must be completed to activate memorial treatment across ORBIT.

---

## Step 1: Add to the RECENTLY_DECEASED list

**File:** `pages/people-library.js` (top of file, inside the IIFE)

Add a new entry to the `RECENTLY_DECEASED` array with the person's **TMDB person ID** and **date of death**:

```js
{ id: 12345, date: 'YYYY-MM-DD' },  // Person Name
```

Entries automatically expire after **12 months** (handled by `isRecentlyDeceased()`). Old entries can be cleaned up periodically but are harmless if left.

### What this activates (Observatory):
- **Greyed photo** — `grayscale(100%)`, `opacity: 0.7` via `.pl-card-photo--memorial`
- **Muted italic name** — prefixed with "Remembering" via `.pl-card--memorial`
- **Subtle hover restore** — `grayscale(60%)`, `opacity: 0.85` on hover

---

## Step 2: Verify TMDB `deathday` field is populated

All other pages read the `deathday` field directly from the **TMDB person API response**. TMDB is usually updated within hours of a public death announcement, but verify by checking:

```
https://api.themoviedb.org/3/person/{TMDB_ID}?api_key=YOUR_KEY
```

Confirm the `deathday` field is set to `"YYYY-MM-DD"` (not `null`).

### What this activates (automatic, no code change needed):

| Page | Feature | File : Lines |
|------|---------|-------------|
| **People Profile** | Greyed hero photo via `.pp-hero-photo--memorial`; "Died [date]" in lifespan | `pages/people-profile.js : 682-688` / `pages/people-profile.css` |
| **People Cube** | Greyed photo via `.pcube-photo--memorial`; "Died [date] (age X)" row in `.pcube-memorial` style | `components/people-cube.js : 553-554` / `components/people-cube.css` |
| **Results** | "Remembering [FirstName]" memorial banner; dates formatted as `birth – death` | `pages/results.js : 1408-1433` |
| **Venn** | Memorial banner shown; dates as `birth – death`; career span ends at death year | `pages/venn.js : 1360-1375, 1406-1410` |
| **Timeline** | Memorial banner shown; dates as `birth – death`; career span ends at death year | `pages/timeline.js : 2831-2847, 2912-2916` |

---

## Greyed Photo Treatment

All greyed photos follow the same visual pattern across all three locations:

| State | Filter | Opacity | Border |
|-------|--------|---------|--------|
| **Default** | `grayscale(100%)` | `0.7` | `rgba(148, 163, 184, 0.4)` (muted gray) |
| **Hover** | `grayscale(60%)` | `0.85` | same |

This applies to:
- **Observatory** grid card photo (`.pl-card-photo--memorial`)
- **People Profile** hero photo (`.pp-hero-photo--memorial`)
- **People Cube** popup photo (`.pcube-photo--memorial`)

---

## Summary Checklist

- [ ] Add `{ id, date }` entry to `RECENTLY_DECEASED` in `pages/people-library.js`
- [ ] Confirm TMDB has `deathday` populated for the person
- [ ] Verify Observatory card shows greyed photo + "Remembering [Name]"
- [ ] Verify People Profile hero photo is greyed
- [ ] Verify People Cube popup photo is greyed + shows "Died" row
- [ ] Verify Results / Venn / Timeline show memorial banner and correct date range

---

## CSS Classes Reference

| Class | File | Purpose |
|-------|------|---------|
| `.pl-card--memorial` | `pages/people-library.css` | Card-level memorial state (italic name, hover restore) |
| `.pl-card-photo--memorial` | `pages/people-library.css` | Observatory greyed photo |
| `.pp-hero-photo--memorial` | `pages/people-profile.css` | Profile hero greyed photo |
| `.pcube-photo--memorial` | `components/people-cube.css` | People Cube greyed photo |
| `.pcube-memorial` | `components/people-cube.css` | People Cube "Died" row (gray italic) |
