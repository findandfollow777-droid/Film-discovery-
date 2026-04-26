# ORBIT Awards Conflict Detail Report

**Date:** 2026-04-19

**Guiding principle:** Preservation beats tidiness. Every proposed action is flagged for human review. Nothing is auto-decided.

---

## PRESERVED — Not Flagged

**3,155 rows** are intentionally left alone. These include:

- Same film/person at different festivals (e.g. Parasite at Cannes 2019 AND Oscar 2020)
- Same person with multiple nominations in the same festival/year
- Same film/person in same festival/category but 2+ years apart (legitimate separate nominations)
- Rows where nominee or movie_title differs (case-insensitive exact match only; no fuzzy collapsing)

These rows are correct entries and require no action.

---

## Summary

| Metric | Count |
|--------|-------|
| Preserved rows (no action) | 3,155 |
| Bucket A — Exact duplicate groups | 12519 rows (6721 proposed drops) |
| Bucket B — Convention collisions | 2862 rows (1431 proposed drops) |
| Bucket C — Merge candidates | 6370 rows |
| Bucket D — Known gaps | 5 entries |
| Total proposed drops | 8152 |
| Total REVIEW_REQUIRED | 9232 |

---

## Bucket A — Exact Duplicates

**12519 rows total.** Showing up to 20:

| Action | Festival | Category | Year | Nominee | Movie | Won | Source | Review | Notes |
|--------|----------|----------|------|---------|-------|-----|--------|--------|-------|
| DROP | Oscar | Best Picture | 2024 |  | Oppenheimer | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Picture | 2024 |  | Oppenheimer | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Director | 2024 |  | Oppenheimer | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Director | 2024 |  | Oppenheimer | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Actor | 2024 |  | Oppenheimer | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Actor | 2024 |  | Oppenheimer | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Picture | 2023 |  | Everything Everywhere All at Once | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Picture | 2023 |  | Everything Everywhere All at Once | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Director | 2023 |  | Everything Everywhere All at Once | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Director | 2023 |  | Everything Everywhere All at Once | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Actor | 2023 |  | The Whale | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Actor | 2023 |  | The Whale | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Picture | 2022 |  | CODA | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Picture | 2022 |  | CODA | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Director | 2022 |  | The Power of the Dog | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Director | 2022 |  | The Power of the Dog | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Actor | 2022 |  | King Richard | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Actor | 2022 |  | King Richard | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |
| DROP | Oscar | Best Picture | 2021 |  | Nomadland | Y | awards7coltemplate.csv | FALSE | Exact duplicate — canonical is awardssample.csv |
| KEEP | Oscar | Best Picture | 2021 |  | Nomadland | Y | awardssample.csv | FALSE | Exact duplicate — keep canonical copy |

_...and 12499 more rows in the CSV output._


---

## Bucket B — Convention Collisions (Industry Festivals)

**2862 rows total.** Showing up to 20:

| Action | Festival | Category | Year | Nominee | Movie | Won | Source | Review | Notes |
|--------|----------|----------|------|---------|-------|-----|--------|--------|-------|
| KEEP | Oscar | Best Picture | 2000 |  | The Cider House Rules | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1999 |  | The Cider House Rules | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 2000 |  | The Green Mile | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1999 |  | The Green Mile | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 2000 |  | The Insider | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1999 |  | The Insider | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 2000 |  | The Sixth Sense | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1999 |  | The Sixth Sense | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1999 |  | Elizabeth | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1998 |  | Elizabeth | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1999 |  | Life Is Beautiful | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1998 |  | Life Is Beautiful | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1999 |  | Saving Private Ryan | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1998 |  | Saving Private Ryan | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1999 |  | The Thin Red Line | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1998 |  | The Thin Red Line | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1998 |  | As Good as It Gets | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1997 |  | As Good as It Gets | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |
| KEEP | Oscar | Best Picture | 1998 |  | The Full Monty | N | awards7coltemplate.csv | TRUE | Convention collision — ceremony year (later), proposed keep |
| DROP | Oscar | Best Picture | 1997 |  | The Full Monty | N | awards7coltemplate.csv | TRUE | Convention collision — film year (earlier), proposed drop |

_...and 2842 more rows in the CSV output._


---

## Bucket C — Merge Candidates

**6370 rows total.** Showing up to 20:

| Action | Festival | Category | Year | Nominee | Movie | Won | Source | Review | Notes |
|--------|----------|----------|------|---------|-------|-----|--------|--------|-------|
| MERGE | Oscar | Best Picture | 2025 |  | Anora | N | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Oscar | Best Picture | 2025 |  | Emilia Perez | N | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Oscar | Best Picture | 2023 |  | Tar | N | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2024 | Miguel Gomes | Grand Tour | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Jury Prize | 2024 |  | Emilia Perez | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2023 | Tran Anh Hung | The Pot-au-Feu | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2022 | Park Chan-wook | Decision to Leave | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2021 | Leos Carax | Annette | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2019 | Jean-Pierre & Luc Dardenne | Young Ahmed | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Jury Prize | 2019 |  | Les Miserables | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2018 | Pawel Pawlikowski | Cold War | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2017 | Sofia Coppola | The Beguiled | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2016 | Cristian Mungiu | Graduation | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2016 | Olivier Assayas | Personal Shopper | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2015 | Hou Hsiao-hsien | The Assassin | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2014 | Bennett Miller | Foxcatcher | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2013 | Amat Escalante | Heli | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2012 | Carlos Reygadas | Post Tenebras Lux | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2011 | Nicolas Winding Refn | Drive | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |
| MERGE | Cannes | Best Director | 2010 | Mathieu Amalric | On Tour | Y | awards7coltemplate.csv | TRUE | Unique to secondary file — merge into awardssample.csv |

_...and 6350 more rows in the CSV output._


---

## Bucket D — Known Gaps

**5 rows total.** Showing up to 20:

| Action | Festival | Category | Year | Nominee | Movie | Won | Source | Review | Notes |
|--------|----------|----------|------|---------|-------|-----|--------|--------|-------|
| SOURCE_EXTERNAL | BAFTA | Best Film | 2025 |  |  |  |  | TRUE | Missing year in BAFTA Best Film (range 2000-2026) |
| SOURCE_EXTERNAL | Cannes | Jury Prize | 2001 |  |  |  |  | TRUE | Missing year in Cannes Jury Prize (range 2000-2025) |
| SOURCE_EXTERNAL | Golden Globe | Best Actress (Drama) | 2025 |  |  |  |  | TRUE | Missing year in Golden Globe Best Actress (Drama) (range 2000-2026) |
| SOURCE_EXTERNAL | Golden Globe | Best Comedy/Musical | 2025 |  |  |  |  | TRUE | Missing year in Golden Globe Best Comedy/Musical (range 2000-2026) |
| SOURCE_EXTERNAL | Golden Globe | Best Drama | 2025 |  |  |  |  | TRUE | Missing year in Golden Globe Best Drama (range 2000-2026) |
