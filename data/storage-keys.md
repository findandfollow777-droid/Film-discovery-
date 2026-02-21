# ORBIT localStorage & sessionStorage Key Registry

## User Preferences & Settings

| Key | Storage | Format | Set By | Read By | Purpose |
|-----|---------|--------|--------|---------|---------|
| `orbit_preferences_scope` | local | JSON object | profile.js | profile.js, randomizer.js, tv-randomizer.js | Randomizer scope toggle (randomizer / orbit / quick) |
| `orbit_user_country` | local | String (ISO 3166-1) | profile.js | profile.js, randomizer.js, tv.js, app.js, both.js, utils.js | Streaming provider country |
| `orbit_user_providers` | local | JSON array | profile.js | profile.js, randomizer.js, tv.js, app.js, both.js, utils.js, moviecube.js | Streaming provider IDs |
| `orbit_providers_expanded` | local | `"true"` / `"false"` | profile.js | profile.js | Provider panel collapse/expand state |
| `orbit_randomizer_streaming_filter` | local | `"true"` / `"false"` | randomizer.js | randomizer.js | Streaming filter toggle |
| `orbit_tv_randomizer_streaming_filter` | local | `"true"` / `"false"` | tv-randomizer.js | tv-randomizer.js | TV streaming filter toggle |
| `englishOnlyToggle` | session | `"true"` / `"false"` | app.js, both.js | app.js, both.js, tv.js | English language filter |
| `watchCountry` | local | String | app.js, both.js, tv.js, moviecube.js | app.js, both.js, tv.js, moviecube.js | **Legacy** — superseded by `orbit_user_country` |
| `watchProviders` | local | JSON array | app.js, both.js, tv.js, moviecube.js | app.js, both.js, tv.js, moviecube.js | **Legacy** — superseded by `orbit_user_providers` |

## Navigation State

| Key | Storage | Format | Set By | Read By | Purpose |
|-----|---------|--------|--------|---------|---------|
| `orbit_nav_history` | session | JSON array | utils.js | utils.js | Back-navigation history stack |
| `orbit_profile_referrer` | session | String (URL) | people-library.js | people-profile.js | Referrer for back navigation |
| `timelineMovieId` | local | String (ID) | Multiple launchers | actor-timeline.js, timeline.js, series.js | Movie/person/show ID for timeline |
| `timelineType` | local | `"movie"` / `"person"` / `"tv"` | Multiple | Multiple game pages | Media type for timeline context |
| `timelineMediaMode` | local | `"movies"` / `"shows"` / `"both"` | people-profile.js, timeline.js | timeline.js | Timeline view mode |
| `timelinePendingPeople` | local | JSON array | people-profile.js | timeline.js | People queued for Venn/timeline |
| `returnToProfile` | local | String (ID) | people-profile.js | timeline.js | Person ID to return to after timeline |
| `returnToResults` | local | `"true"` | results.js | timeline.js | Flag: return to results after timeline |
| `vennPeople` | local | JSON array | Multiple | venn.js, timeline.js, etc. | Selected people for Venn diagram |

## Daily Game State

Pattern: `{gameName}_{date}` where date = `YYYY_M_D`

| Key Pattern | Set By | Read By | Purpose |
|-------------|--------|---------|---------|
| `orbit_game_${today}` | arcade.js | arcade.js | Constellation daily state |
| `collision_game_${today}` | arcade.js | arcade.js | Collision Course daily state |
| `triple_collision_${today}` | arcade.js | arcade.js | Triple Collision daily state |
| `journeys_game_${today}` | arcade.js | arcade.js | Journeys daily state |
| `connections_game_${today}` | arcade.js | arcade.js | Connections daily state |
| `screenshot_game_${today}` | arcade.js | arcade.js | Screenshot Speed daily state |
| `sequelshot_${today}` | arcade.js | arcade.js | Sequel Shot daily state |
| `mastermind_game_${today}` | arcade.js | arcade.js | Mastermind daily state |
| `alternate_game_${today}` | arcade.js | arcade.js | Alternate Universe daily state |

## Game Statistics

| Key | Format | Set By | Read By | Purpose |
|-----|--------|--------|---------|---------|
| `orbit_game_stats` | JSON `{played, wins, streak, ...}` | game.js | game.js, profile.js | Constellation stats |
| `collision_stats` | JSON `{played, totalScore, bestScore}` | collision.js | collision.js, profile.js | Collision stats |
| `triple_collision_stats` | JSON | triple-collision.js | triple-collision.js, profile.js | Triple Collision stats |
| `journeys_stats` | JSON `{played, solved}` | journeys.js | journeys.js, profile.js | Journeys stats |
| `connections_stats` | JSON | connections.js | connections.js, profile.js | Connections stats |
| `screenshot_stats` | JSON | screenshot.js | screenshot.js, profile.js | Screenshot stats |
| `mastermind_stats` | JSON | mastermind.js | mastermind.js, profile.js | Mastermind stats |
| `sequelshot_stats` | JSON | sequel-shot.js | sequel-shot.js | Sequel Shot stats |
| `orbit_tenth_star_stats` | JSON | tenth-star.js | tenth-star.js, profile.js | Tenth Star stats |
| `orbit_tenth_star_${puzzleId}` | JSON | tenth-star.js | tenth-star.js | Individual puzzle state |
| `alternate_comments_${weekNumber}` | JSON | alternate.js | alternate.js | Community comments |

## Cache Keys

| Key | Storage | TTL | Set By | Read By | Purpose |
|-----|---------|-----|--------|---------|---------|
| `orbit_people_profiles_v3` | local | 30 days | people-profile.js | people-library.js, people-profile.js | Actor profile cache |
| `orbit_library_browse_page_${page}` | local | 1 session | people-library.js | people-library.js | Paginated browse results |
| `orbit_genre_cache` | session | Session | people-library.js | people-library.js | Genre breakdown cache |
| `orbit_nebula_cache_${movieId}` | local | 24 hours | nebula-service.js | nebula-service.js | Word cloud data |
| `cube_trivia_${movieId}` | local | 1 session | moviecube.js | moviecube.js | MovieCube trivia questions |
| `cube_actor_trivia_${personId}` | local | 1 session | people-cube.js | people-cube.js | PeopleCube trivia questions |
| `orbit_pcube_cache` | session | 1 hour, max 30 | people-cube.js | people-cube.js | People Cube data cache |
| `orbit_map_results` | local | Until cleared | orbit-map.js | results.js | Discovery Map results |

## User Lists & Memory

| Key | Format | Set By | Read By | Purpose |
|-----|--------|--------|---------|---------|
| `orbit_shortlist` | JSON `{movies, updatedAt}` | shortlist-service.js | shortlist-service.js | Curated shortlist (max 20) |
| `orbitSwipeMemory` | JSON `{liked, disliked, genreAffinities}` | swipe-memory.js | swipe-memory.js, profile.js | Swipe like/dislike history (max 500) |
| `orbit_comfort_list` | JSON array | profile.js | profile.js | Comfort TV shows |
| `orbit_people_encountered` | JSON object | encounter-service.js | encounter-service.js | Silently logged people encounters |
| `orbit_user_reviews_${movieId}` | JSON array | nebula-utils.js, nebula-service.js | nebula-utils.js, nebula-service.js | User 5-word reviews |

## Discovery & Search State

| Key | Storage | Format | Set By | Read By | Purpose |
|-----|---------|--------|--------|---------|---------|
| `movies` | local | JSON array | app.js, tv.js, both.js | results.js | Current search results |
| `genres` | local | JSON array | app.js, tv.js, both.js | app.js, tv.js, both.js | Genre list for results |
| `orbitFilters` | local | JSON object | app.js, tv.js, both.js | results.js, app.js | Active filter state |
| `mediaType` | local | `"movie"` / `"tv"` / `"both"` | app.js, tv.js, both.js, profile.js | results.js | Search media type |
| `resultsCapped` | local | `"true"` | app.js, tv.js | results.js | Flag: result limit hit |
| `totalAvailable` | local | String (number) | app.js, tv.js | results.js | Total available count |
| `orbitBaseQuery` | local | String (query params) | app.js | app.js | Base query string |

## Game Launching State

| Key | Format | Set By | Read By | Purpose |
|-----|--------|--------|---------|---------|
| `anchorMovie` | JSON object | Multiple | constellation.js, results.js | Starting movie for games |
| `constellationMovies` | JSON array | Multiple | constellation.js | Movies for Constellation |
| `singleMovie` | JSON object | Multiple | results.js | Single-movie result mode |
| `resultsMode` | String | Multiple | results.js | Results display mode |

## Feature Flags

| Key | Format | Set By | Read By | Purpose |
|-----|--------|--------|---------|---------|
| `orbit_stellar_catalog_intro_seen` | `"true"` | people-library.js | people-library.js | First-visit overlay dismissed |
| `orbit_randomizer_intro_seen` | `"true"` | randomizer.js | randomizer.js | Randomizer intro dismissed |
| `swipeHintDismissed` | `"true"` | results.js | results.js | Swipe hint dismissed |

---

## Flagged Issues

### Written but never read (dead keys)
- `orbit_people_profiles_v2` — legacy cache, replaced by v3
- `orbit_people_profiles` — original legacy cache
- `timelineShowId` — series.js sets this but nothing reads it (should be `timelineMovieId`)
- `anchorMovieId` — venn.js sets this but unused variant of `anchorMovie`
- `timeCommitmentFilter` — tv.js sets this but never read back

### Read but never written (potential bugs)
- `orbit_trivia_stats` — profile.js reads this but nothing writes it
- `orbit_profile_person_id` — people-profile.js reads as fallback but never reliably written

### Legacy duplicates
- `watchCountry` / `watchProviders` — still read by some files alongside `orbit_user_country` / `orbit_user_providers`

### Naming inconsistencies
- `timelineMovieId` vs `timelineShowId` (unused)
- `anchorMovie` vs `anchorMovieId` (unused)
