# ORBIT Awards Data Audit Report

**Date:** 2026-04-19

## A. Per-File Breakdown

| File | Rows | Pre-2000 | Post-2000 | Distinct Festivals |
|------|------|----------|-----------|-------------------|
| awards7coltemplate.csv | 5126 | 3020 | 2106 | 6 |
| awardssample.csv | 9787 | 6116 | 3671 | 6 |
| ggdirector2000.csv | 141 | 0 | 141 | 1 |
| ggdirectorearly.csv | 245 | 245 | 0 | 1 |
| goldenglobeextra.csv | 965 | 711 | 254 | 1 |
| baftaactordata.csv | 141 | 0 | 141 | 1 |
| baftaactorearly.csv | 222 | 222 | 0 | 1 |
| baftaactressraw.csv | 330 | 190 | 140 | 1 |
| baftadirectorraw.csv | 217 | 77 | 140 | 1 |
| persondataraw.csv | 2553 | 1414 | 1139 | 3 |

**Total rows across all files: 19727**

## B. True Duplicates

**Total duplicate rows:** 6721

- Intra-file duplicates: 850
- Cross-file duplicates: 5871

### Top 10 File-Pair Overlaps

| File A | File B | Shared Keys |
|--------|--------|-------------|
| awards7coltemplate.csv | awardssample.csv | 3580 |
| awards7coltemplate.csv | persondataraw.csv | 798 |
| awards7coltemplate.csv | baftaactressraw.csv | 326 |
| awards7coltemplate.csv | ggdirectorearly.csv | 245 |
| baftaactorearly.csv | persondataraw.csv | 221 |
| awards7coltemplate.csv | baftadirectorraw.csv | 217 |
| awards7coltemplate.csv | baftaactorearly.csv | 209 |
| awards7coltemplate.csv | goldenglobeextra.csv | 201 |
| baftadirectorraw.csv | persondataraw.csv | 189 |
| ggdirectorearly.csv | goldenglobeextra.csv | 148 |

### 10 Highest-Count Duplicate Keys

| Festival | Category | Year | Nominee | Movie | Won | Count |
|----------|----------|------|---------|-------|-----|-------|
| BAFTA | Best Actor | 1965 | anthony quinn | zorba the greek | False | 4 |
| BAFTA | Best Film | 2002 |  | amelie | False | 3 |
| BAFTA | Best Actor | 2024 | cillian murphy | oppenheimer | True | 3 |
| BAFTA | Best Actor | 2024 | bradley cooper | maestro | False | 3 |
| BAFTA | Best Actor | 2024 | colman domingo | rustin | False | 3 |
| BAFTA | Best Actor | 2024 | paul giamatti | the holdovers | False | 3 |
| BAFTA | Best Actor | 2024 | barry keoghan | saltburn | False | 3 |
| BAFTA | Best Actor | 2024 | teo yoo | past lives | False | 3 |
| BAFTA | Best Actor | 2023 | austin butler | elvis | True | 3 |
| BAFTA | Best Actor | 2023 | colin farrell | the banshees of inisherin | False | 3 |

## C. Cross-Year Appearances

**Tuples appearing in multiple years:** 1498

- 1-year gaps: 1510
- 2-year gaps: 246
- 3+ year gaps: 904

### Convention Collision Suspects (Industry, 1yr gap) (1510 total, showing up to 12)

| Festival | Category | Nominee | Movie | Years | Gap |
|----------|----------|---------|-------|-------|-----|
| Oscar | Best Picture |  | the cider house rules | 1999, 2000 | 1 |
| Oscar | Best Picture |  | the green mile | 1999, 2000 | 1 |
| Oscar | Best Picture |  | the insider | 1999, 2000 | 1 |
| Oscar | Best Picture |  | the sixth sense | 1999, 2000 | 1 |
| Oscar | Best Picture |  | elizabeth | 1998, 1999 | 1 |
| Oscar | Best Picture |  | life is beautiful | 1998, 1999 | 1 |
| Oscar | Best Picture |  | saving private ryan | 1998, 1999 | 1 |
| Oscar | Best Picture |  | the thin red line | 1998, 1999 | 1 |
| Oscar | Best Picture |  | as good as it gets | 1997, 1998 | 1 |
| Oscar | Best Picture |  | the full monty | 1997, 1998 | 1 |
| Oscar | Best Picture |  | good will hunting | 1997, 1998 | 1 |
| Oscar | Best Picture |  | l.a. confidential | 1997, 1998 | 1 |

### Film Festival 1-Year Gap Red Flags (0 total, showing up to 12)

_None found._

### 2-Year Gaps (246 total, showing up to 12)

| Festival | Category | Nominee | Movie | Years | Gap |
|----------|----------|---------|-------|-------|-----|
| Oscar | Best Director |  | martin scorsese | 1980, 1981, 1988, 1989, 1990, 1991, 2002, 2003, 2004, 2005, 2007, 2011, 2012, 2013, 2014, 2019, 2020, 2024 | 2 |
| Oscar | Best Actor |  | jack nicholson | 1970, 1971, 1973, 1974, 1975, 1976, 1985, 1986, 1987, 1988, 1997, 2002, 2003 | 2 |
| Oscar | Best Director |  | woody allen | 1978, 1979, 1984, 1985, 1986, 1987, 1989, 1990, 1994, 1995, 2011, 2012 | 2 |
| Oscar | Best Director |  | david lean | 1955, 1956, 1958, 1963, 1965, 1966, 1984, 1985 | 2 |
| Oscar | Best Director |  | david lean | 1955, 1956, 1958, 1963, 1965, 1966, 1984, 1985 | 2 |
| Oscar | Best Director |  | ingmar bergman | 1973, 1974, 1976, 1977, 1983, 1984 | 2 |
| Oscar | Best Director |  | sydney pollack | 1969, 1970, 1982, 1983, 1985 | 2 |
| Oscar | Best Actor |  | dustin hoffman | 1967, 1968, 1969, 1970, 1974, 1975, 1980, 1982, 1983, 1988, 1997, 1998 | 2 |
| Oscar | Best Actor |  | paul newman | 1958, 1959, 1961, 1962, 1963, 1964, 1967, 1968, 1981, 1982, 1983, 1986, 1994, 1995 | 2 |
| Oscar | Best Actor |  | peter o'toole | 1962, 1963, 1964, 1965, 1968, 1969, 1970, 1972, 1973, 1980, 1981, 1982, 1983, 2006, 2007 | 2 |
| Oscar | Best Actor |  | warren beatty | 1967, 1968, 1978, 1979, 1981, 1982, 1991, 1992 | 2 |
| Oscar | Best Director |  | francis ford coppola | 1972, 1973, 1975, 1979, 1980, 1990, 1991 | 2 |

### 3+ Year Gaps (904 total, showing up to 12)

| Festival | Category | Nominee | Movie | Years | Gap |
|----------|----------|---------|-------|-------|-----|
| Cannes | Palme d'Or |  | bird | 1988, 2024 | 36 |
| Oscar | Best Actress |  | little women | 1995, 2020 | 25 |
| Oscar | Best Actress |  | a star is born | 1954, 2019 | 65 |
| Berlin | Golden Bear |  | richard iii | 1956, 1996 | 40 |
| BAFTA | Best Director | roman polanski | the pianist | 1983, 2003 | 20 |
| Oscar | Best Director |  | mike nichols | 1966, 1967, 1968, 1983, 1984, 1988, 1989 | 15 |
| Oscar | Best Director |  | mike nichols | 1966, 1967, 1968, 1983, 1984, 1988, 1989 | 4 |
| Oscar | Best Director |  | alan parker | 1978, 1979, 1988, 1989 | 9 |
| Oscar | Best Director |  | martin scorsese | 1980, 1981, 1988, 1989, 1990, 1991, 2002, 2003, 2004, 2005, 2007, 2011, 2012, 2013, 2014, 2019, 2020, 2024 | 7 |
| Oscar | Best Director |  | martin scorsese | 1980, 1981, 1988, 1989, 1990, 1991, 2002, 2003, 2004, 2005, 2007, 2011, 2012, 2013, 2014, 2019, 2020, 2024 | 11 |
| Oscar | Best Director |  | martin scorsese | 1980, 1981, 1988, 1989, 1990, 1991, 2002, 2003, 2004, 2005, 2007, 2011, 2012, 2013, 2014, 2019, 2020, 2024 | 4 |
| Oscar | Best Director |  | martin scorsese | 1980, 1981, 1988, 1989, 1990, 1991, 2002, 2003, 2004, 2005, 2007, 2011, 2012, 2013, 2014, 2019, 2020, 2024 | 5 |

## D. Post-2000 Data Quality

**Post-2000 rows (deduplicated): 5131**

| Festival | Category | Rows | Winners | Nominees | Missing TMDB | Missing Person | Year Range |
|----------|----------|------|---------|----------|-------------|----------------|------------|
| BAFTA | Best Actor | 374 | 52 | 322 | 374 | 233 | 2000-2026 |
| BAFTA | Best Actress | 380 | 55 | 325 | 380 | 232 | 2000-2026 |
| BAFTA | Best Director | 389 | 63 | 326 | 389 | 238 | 2000-2026 |
| BAFTA | Best Film | 130 | 26 | 104 | 129 | 0 | 2000-2026 |
| Berlin | Golden Bear | 127 | 28 | 99 | 126 | 0 | 2000-2025 |
| Berlin | Silver Bear (Director) | 51 | 51 | 0 | 50 | 26 | 2000-2025 |
| Berlin | Silver Bear (Grand Jury) | 27 | 27 | 0 | 26 | 0 | 2000-2025 |
| Cannes | Best Director | 55 | 55 | 0 | 54 | 28 | 2000-2025 |
| Cannes | Grand Prix | 28 | 28 | 0 | 27 | 0 | 2000-2025 |
| Cannes | Jury Prize | 34 | 34 | 0 | 32 | 0 | 2000-2025 |
| Cannes | Palme d'Or | 428 | 25 | 403 | 427 | 0 | 2000-2025 |
| Golden Globe | Best Actor (Comedy/Musical) | 251 | 50 | 201 | 251 | 125 | 2000-2024 |
| Golden Globe | Best Actor (Drama) | 251 | 50 | 201 | 251 | 125 | 2000-2024 |
| Golden Globe | Best Actress (Comedy/Musical) | 252 | 50 | 202 | 252 | 126 | 2000-2024 |
| Golden Globe | Best Actress (Drama) | 255 | 51 | 204 | 255 | 128 | 2000-2026 |
| Golden Globe | Best Comedy/Musical | 87 | 26 | 61 | 86 | 0 | 2000-2026 |
| Golden Globe | Best Director | 389 | 67 | 322 | 389 | 248 | 2000-2026 |
| Golden Globe | Best Drama | 133 | 26 | 107 | 132 | 0 | 2000-2026 |
| Oscar | Best Actor | 367 | 77 | 290 | 331 | 242 | 2000-2026 |
| Oscar | Best Actress | 382 | 77 | 305 | 376 | 257 | 2000-2026 |
| Oscar | Best Director | 369 | 79 | 290 | 328 | 244 | 2000-2026 |
| Oscar | Best Picture | 187 | 29 | 158 | 148 | 0 | 2000-2026 |
| Venice | Golden Lion | 106 | 26 | 80 | 105 | 0 | 2000-2025 |
| Venice | Silver Lion (Director) | 53 | 53 | 0 | 52 | 27 | 2000-2025 |
| Venice | Silver Lion (Grand Jury) | 26 | 26 | 0 | 25 | 0 | 2000-2025 |

## E. Year Coverage Gaps Post-2000

**Categories with year gaps: 5**

| Festival | Category | Max Year | Missing Years |
|----------|----------|----------|---------------|
| BAFTA | Best Film | 2026 | 2025 |
| Cannes | Jury Prize | 2025 | 2001 |
| Golden Globe | Best Actress (Drama) | 2026 | 2025 |
| Golden Globe | Best Comedy/Musical | 2026 | 2025 |
| Golden Globe | Best Drama | 2026 | 2025 |

## F. Festival Name Variants

| Festival String | Row Count |
|-----------------|-----------|
| BAFTA | 5790 |
| Oscar | 5397 |
| Golden Globe | 5242 |
| Cannes | 1851 |
| Berlin | 803 |
| Venice | 644 |

## G. Canonical File Map

**Categories appearing in multiple files: 25**

### BAFTA - Best Actor

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 259 | **Top contributor** |
| baftaactordata.csv | 141 | Secondary |
| awards7coltemplate.csv | 140 | Secondary |
| persondataraw.csv | 129 | Secondary |

### BAFTA - Best Actress

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 256 | **Top contributor** |
| baftaactressraw.csv | 140 | Secondary |
| awards7coltemplate.csv | 139 | Secondary |
| persondataraw.csv | 127 | Secondary |

### BAFTA - Best Director

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 258 | **Top contributor** |
| awards7coltemplate.csv | 140 | Secondary |
| baftadirectorraw.csv | 140 | Secondary |
| persondataraw.csv | 128 | Secondary |

### BAFTA - Best Film

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 128 | **Top contributor** |
| awards7coltemplate.csv | 127 | Secondary |

### Berlin - Golden Bear

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 125 | **Top contributor** |
| awards7coltemplate.csv | 124 | Secondary |

### Berlin - Silver Bear (Director)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 26 | **Top contributor** |
| awards7coltemplate.csv | 25 | Secondary |

### Berlin - Silver Bear (Grand Jury)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 26 | **Top contributor** |
| awards7coltemplate.csv | 25 | Secondary |

### Cannes - Best Director

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 28 | **Top contributor** |
| awards7coltemplate.csv | 27 | Secondary |

### Cannes - Grand Prix

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 28 | **Top contributor** |
| awards7coltemplate.csv | 27 | Secondary |

### Cannes - Jury Prize

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 32 | **Top contributor** |
| awards7coltemplate.csv | 30 | Secondary |

### Cannes - Palme d'Or

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 424 | **Top contributor** |
| awards7coltemplate.csv | 423 | Secondary |

### Golden Globe - Best Actor (Comedy/Musical)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 126 | **Top contributor** |
| persondataraw.csv | 76 | Secondary |
| goldenglobeextra.csv | 50 | Secondary |

### Golden Globe - Best Actor (Drama)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 126 | **Top contributor** |
| persondataraw.csv | 76 | Secondary |
| goldenglobeextra.csv | 50 | Secondary |

### Golden Globe - Best Actress (Comedy/Musical)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 126 | **Top contributor** |
| persondataraw.csv | 76 | Secondary |
| goldenglobeextra.csv | 50 | Secondary |

### Golden Globe - Best Actress (Drama)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 128 | **Top contributor** |
| persondataraw.csv | 76 | Secondary |
| goldenglobeextra.csv | 51 | Secondary |

### Golden Globe - Best Comedy/Musical

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 87 | **Top contributor** |
| awards7coltemplate.csv | 86 | Secondary |

### Golden Globe - Best Director

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 262 | **Top contributor** |
| awards7coltemplate.csv | 141 | Secondary |
| ggdirector2000.csv | 141 | Secondary |
| persondataraw.csv | 76 | Secondary |
| goldenglobeextra.csv | 53 | Secondary |

### Golden Globe - Best Drama

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 132 | **Top contributor** |
| awards7coltemplate.csv | 131 | Secondary |

### Oscar - Best Actor

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 248 | **Top contributor** |
| persondataraw.csv | 125 | Secondary |
| awards7coltemplate.csv | 28 | Secondary |

### Oscar - Best Actress

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 256 | **Top contributor** |
| awards7coltemplate.csv | 125 | Secondary |
| persondataraw.csv | 125 | Secondary |

### Oscar - Best Director

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 250 | **Top contributor** |
| persondataraw.csv | 125 | Secondary |
| awards7coltemplate.csv | 31 | Secondary |

### Oscar - Best Picture

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 183 | **Top contributor** |
| awards7coltemplate.csv | 182 | Secondary |

### Venice - Golden Lion

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awards7coltemplate.csv | 104 | **Top contributor** |
| awardssample.csv | 104 | Secondary |

### Venice - Silver Lion (Director)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 27 | **Top contributor** |
| awards7coltemplate.csv | 26 | Secondary |

### Venice - Silver Lion (Grand Jury)

| File | Post-2000 Rows | Role |
|------|---------------|------|
| awardssample.csv | 26 | **Top contributor** |
| awards7coltemplate.csv | 25 | Secondary |
