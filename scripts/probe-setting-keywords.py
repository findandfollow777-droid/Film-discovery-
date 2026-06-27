#!/usr/bin/env python3
"""
ORBIT — SETTING tab keyword-coverage DISCOVERY probe  (throwaway research)
==========================================================================
Read-only research, like scripts/audit-awards-*.py. Maps which "where/when a
story is set" concepts resolve to real, well-populated TMDB keywords, so the
DATA defines Setting's axes rather than the artboard.

Method (mirrors scripts/resolve-film-tmdb-ids.py for key + caching):
  For each candidate term:
    1. GET /search/keyword?query={term}  -> top keyword candidates
    2. For the top few candidates: GET /discover/movie?with_keywords={id}
       -> total_results, so "best" = highest film coverage (not just first hit)
    3. If the term is weak/none, try ONE listed synonym (no fishing beyond that)
  Caches every response to data/setting-keyword-probe-cache.json (re-runs free).
  Rate-limited politely. Does NOT touch any app file.

Run from project root:
    python3 scripts/probe-setting-keywords.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_FILE  = PROJECT_ROOT / "config.js"
CACHE_FILE   = PROJECT_ROOT / "data" / "setting-keyword-probe-cache.json"
OUT_MD       = PROJECT_ROOT / "data" / "setting-keyword-probe.md"
BASE_URL     = "https://api.themoviedb.org/3"

# Rate limiting (TMDB allows ~40 requests / 10 seconds)
REQUESTS_PER_BURST = 38
BURST_PAUSE        = 10.5
INTER_REQUEST_GAP  = 0.12

# How many keyword candidates per term to score by coverage before picking best
TOP_N_KEYWORDS = 3

# ── API key (same read as resolve-film-tmdb-ids.py — never hardcoded) ──────────

def load_api_key() -> str:
    if not CONFIG_FILE.exists():
        sys.exit(f"FATAL: {CONFIG_FILE} not found")
    text = CONFIG_FILE.read_text(encoding="utf-8")
    m = re.search(r"TMDB_API_KEY\s*=\s*['\"]([^'\"]+)['\"]", text)
    if m:
        return m.group(1)
    m = re.search(r"['\"]([a-f0-9]{32})['\"]", text)
    if m:
        return m.group(1)
    sys.exit("FATAL: no TMDB API key found in config.js")

# ── Cache ─────────────────────────────────────────────────────────────────────

def load_cache() -> dict:
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_cache(cache: dict) -> None:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = CACHE_FILE.with_suffix(CACHE_FILE.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2, sort_keys=True)
    os.replace(tmp, CACHE_FILE)

# ── Rate-limited GET (cached) ──────────────────────────────────────────────────

_req = 0
API_KEY = None
CACHE = {}

def _throttle():
    global _req
    _req += 1
    if _req % REQUESTS_PER_BURST == 0:
        time.sleep(BURST_PAUSE)
    else:
        time.sleep(INTER_REQUEST_GAP)

def get(path: str, params: dict) -> dict:
    """GET with on-disk cache keyed by path+params (api_key excluded from key)."""
    ck = path + "?" + urllib.parse.urlencode(sorted(params.items()))
    if ck in CACHE:
        return CACHE[ck]
    q = dict(params); q["api_key"] = API_KEY
    url = f"{BASE_URL}{path}?{urllib.parse.urlencode(q)}"
    _throttle()
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=20) as r:
                data = json.loads(r.read().decode("utf-8"))
            CACHE[ck] = data
            return data
        except Exception as e:
            if attempt == 2:
                print(f"  ! request failed ({e}) for {path} {params}")
                return {}
            time.sleep(1.5)

def search_keywords(term: str):
    """Return list of {id,name} keyword candidates for a term."""
    data = get("/search/keyword", {"query": term})
    return [{"id": k["id"], "name": k["name"]} for k in data.get("results", [])]

def discover_count(keyword_id: int) -> int:
    data = get("/discover/movie", {"with_keywords": str(keyword_id)})
    return int(data.get("total_results", 0))

def search_collection(term: str):
    data = get("/search/collection", {"query": term})
    res = data.get("results", [])
    return [{"id": c["id"], "name": c["name"]} for c in res[:2]]

# ── Probe one term: score top-N keyword candidates by coverage ─────────────────

def probe_term(term: str, synonym: str | None):
    """Returns dict: best {name,id,count}, second {name,id,count}|None, source term."""
    def score(t):
        cands = search_keywords(t)[:TOP_N_KEYWORDS]
        scored = []
        for c in cands:
            scored.append({"name": c["name"], "id": c["id"], "count": discover_count(c["id"])})
        scored.sort(key=lambda x: x["count"], reverse=True)
        return scored

    scored = score(term)
    used = term
    # If the obvious term yields nothing usable, try the single synonym
    if (not scored or scored[0]["count"] == 0) and synonym:
        alt = score(synonym)
        if alt and (not scored or alt[0]["count"] > scored[0]["count"]):
            scored = alt
            used = f"{term} -> {synonym}"

    best   = scored[0] if scored else None
    second = scored[1] if len(scored) > 1 else None
    return {"term": term, "used": used, "best": best, "second": second}

# ── Candidate set (term, synonym|None) grouped by axis ─────────────────────────

AXES = {
    "A. TIME PERIOD / ERA": [
        ("antiquity", "ancient world"),
        ("medieval", "middle ages"),
        ("renaissance", None),
        ("industrial revolution", None),
        ("victorian", "victorian era"),
        ("1920s", "roaring twenties"),
        ("world war ii", "second world war"),
        ("cold war", None),
        ("contemporary", "present day"),
        ("near future", None),
        ("dystopia", "dystopian future"),
        ("post-apocalyptic", "post-apocalypse"),
        ("ancient rome", "roman empire"),
        ("ancient greece", "greek mythology"),
        ("middle ages", None),
    ],
    "B. ENVIRONMENT": [
        ("urban", "city"),
        ("suburb", "suburbia"),
        ("rural", "countryside"),
        ("wilderness", None),
        ("jungle", None),
        ("ocean", "sea"),
        ("desert", None),
        ("arctic", "polar"),
        ("underground", None),
        ("outer space", "space"),
        ("mountains", "mountain"),
        ("forest", None),
    ],
    "C. GEOGRAPHY-OF-STORY (expected WEAK)": [
        ("set in europe", "europe"),
        ("set in asia", "asia"),
        ("africa", None),
        ("latin america", "south america"),
        ("middle east", None),
        ("japan", None),
        ("new york city", None),
        ("paris", None),
        ("london", None),
        ("tokyo", None),
    ],
    "D. SPECIFIC PLACES — CITIES + LANDMARKS": [
        ("new york city", "new york"),
        ("los angeles", None),
        ("paris", None),
        ("london", None),
        ("tokyo", None),
        ("rome", None),
        ("hong kong", None),
        ("mumbai", None),
        ("berlin", None),
        ("mexico city", None),
        ("sydney", None),
        ("lagos", None),
        ("las vegas", None),
        ("hawaii", None),
        ("white house", None),
        ("route 66", None),
    ],
    "E. FICTIONAL WORLDS (expected COLLECTIONS)": [
        ("middle-earth", "middle earth"),
        ("wizarding world", "hogwarts"),
        ("star wars", None),
        ("dune", None),
        ("pandora", None),
        ("marvel cinematic universe", "mcu"),
        ("wakanda", None),
        ("gotham", "gotham city"),
    ],
    "F. SETTING-TYPE / INSTITUTION (hypothesised STRONGEST)": [
        ("high school", None),
        ("college", "university"),
        ("prison", None),
        ("hospital", None),
        ("spaceship", "spacecraft"),
        ("island", None),
        ("small town", None),
        ("road trip", None),
        ("ship", "at sea"),
        ("train", None),
        ("airplane", "airport"),
        ("hotel", None),
        ("military base", "army base"),
        ("space station", None),
        ("apocalypse", None),
        ("post-apocalyptic", "post-apocalypse"),
        ("dystopia", "dystopian future"),
        ("courtroom", "trial"),
        ("farm", None),
        ("factory", None),
    ],
    "G. HOLIDAYS / CALENDAR-TIME": [
        ("christmas", None),
        ("halloween", None),
        ("thanksgiving", None),
        ("new year's eve", "new year"),
        ("summer", None),
        ("winter", None),
        ("valentine's day", "valentine"),
        ("summer vacation", "summer camp"),
    ],
    "H. TIME-OF-DAY / ATMOSPHERE": [
        ("night", None),
        ("one night", "single night"),
        ("snow", None),
        ("rain", None),
        ("heatwave", "heat wave"),
    ],
}

# Fictional worlds: also sanity-check as TMDB collections
COLLECTION_CHECKS = ["star wars", "lord of the rings", "dune", "harry potter", "avatar"]

# ── Run ─────────────────────────────────────────────────────────────────────

def fmt(slot):
    if not slot:
        return "—", "—", "—"
    return slot["name"], str(slot["id"]), str(slot["count"])

def main():
    global API_KEY, CACHE
    API_KEY = load_api_key()
    print(f"API key loaded (last 4: ...{API_KEY[-4:]})")
    CACHE = load_cache()
    print(f"Cache entries: {len(CACHE)}")

    results = {}
    all_counts = []
    for axis, terms in AXES.items():
        print(f"\n=== {axis} ===")
        rows = []
        for term, syn in terms:
            r = probe_term(term, syn)
            rows.append(r)
            bn, bi, bc = fmt(r["best"])
            print(f"  {term:28s} -> {bn[:30]:30s} id={bi:8s} count={bc}")
            if r["best"]:
                all_counts.append(r["best"]["count"])
            save_cache(CACHE)  # checkpoint after each term
        results[axis] = rows

    # Collection sanity-check for fictional worlds
    print("\n=== COLLECTION CHECK (E sanity) ===")
    coll = {}
    for name in COLLECTION_CHECKS:
        c = search_collection(name)
        coll[name] = c
        print(f"  {name:24s} -> {[x['name'] for x in c]}")
        save_cache(CACHE)

    # ── Build markdown report ──
    lines = []
    lines.append("# ORBIT — SETTING keyword-coverage probe results\n")
    lines.append(f"_Probed {sum(len(v) for v in AXES.values())} terms across {len(AXES)} axes "
                 f"via /search/keyword + /discover/movie. Counts are TMDB total_results._\n")

    def verdict(count):
        # Provisional cutoffs — see distribution note; final bar TBD by Daniel.
        if count is None:
            return "NONE"
        if count >= 800:
            return "STRONG"
        if count >= 100:
            return "WEAK"
        return "NONE"

    for axis, rows in results.items():
        lines.append(f"\n## {axis}\n")
        lines.append("| term | best keyword | id | total_results | 2nd choice (count) | verdict |")
        lines.append("|---|---|---|---:|---|---|")
        for r in rows:
            bn, bi, bc = fmt(r["best"])
            sn, si, sc = fmt(r["second"])
            count = r["best"]["count"] if r["best"] else None
            second_str = f"{sn} ({sc})" if r["second"] else "—"
            note = "" if r["used"] == r["term"] else f" _[{r['used']}]_"
            lines.append(f"| {r['term']}{note} | {bn} | {bi} | {bc} | {second_str} | {verdict(count)} |")

    lines.append("\n## E. Collection sanity-check (fictional worlds)\n")
    lines.append("| franchise query | top /search/collection matches |")
    lines.append("|---|---|")
    for name, c in coll.items():
        matches = ", ".join("{} (id {})".format(x["name"], x["id"]) for x in c) or "—"
        lines.append(f"| {name} | {matches} |")

    # Distribution summary
    all_counts.sort(reverse=True)
    lines.append("\n## Count distribution (all best-keyword counts, desc)\n")
    lines.append("```")
    lines.append(" ".join(str(c) for c in all_counts))
    lines.append("```")
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    save_cache(CACHE)
    print(f"\nWrote {OUT_MD}")
    print(f"Total best-keyword counts collected: {len(all_counts)}")

# ══════════════════════════════════════════════════════════════════════════════
# MANUAL RE-RESOLVE PASS  (added — fixes "best-by-coverage grabbed wrong keyword")
# Run: python3 scripts/probe-setting-keywords.py --reresolve
# For each term: list TOP-5 /search/keyword hits (name+id+count), then pick the
# keyword whose NAME semantically matches the intended SETTING concept — NOT the
# most populous fuzzy hit. Name-match is the whole point of this pass.
# ══════════════════════════════════════════════════════════════════════════════

RR_OUT_MD = PROJECT_ROOT / "data" / "setting-keyword-reresolve.md"
TOP5 = 5

# Agreed bars for this pass (Daniel can still shift): name-match REQUIRED first.
def rr_verdict(count, name_ok):
    if not name_ok:
        return "NONE-CONFIRMED"
    if count >= 700:
        return "STRONG"
    if count >= 150:
        return "WEAK"
    return "NONE"

def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]", " ", s.lower()).strip()

def _tokens(s: str):
    return set(_norm(s).split())

def name_match_score(intended: str, kw_name: str) -> int:
    """Higher = the keyword NAME better matches the intended concept.
    0 means no real semantic match (homophone/substring junk like gothic~gotham)."""
    a, b = _norm(intended), _norm(kw_name)
    if not b:
        return 0
    if a == b:
        return 100                      # exact: "tokyo" == "tokyo"
    # "city, country" canonical form: "paris, france" for intended "paris"
    if b.startswith(a + " ") or b.startswith(a + ","):
        return 90
    ta, tb = _tokens(intended), _tokens(kw_name)
    if ta and ta <= tb:                 # all intended words present as whole tokens
        return 80                       # "ancient rome" ⊆ "ancient rome (the empire)"
    if ta & tb:                         # share at least one whole word
        # require the shared word to be the MAIN noun, not a stray modifier
        return 55
    return 0                            # substring-only / homophone → reject

def top5_hits(query: str):
    """Return up to 5 {name,id,count} for a raw query, in TMDB search order."""
    out = []
    for k in search_keywords(query)[:TOP5]:
        out.append({"name": k["name"], "id": k["id"],
                    "count": discover_count(k["id"])})
    return out

def reresolve_term(intended: str, queries):
    """Across all listed query spellings, gather hits, name-match, pick best.
    Returns dict with chosen keyword(s) + the full top-5 evidence per query."""
    evidence = {}           # query -> [hits]
    candidates = []         # flattened, de-duped by id, with name_match_score
    seen_ids = set()
    for q in queries:
        hits = top5_hits(q)
        evidence[q] = hits
        for h in hits:
            if h["id"] in seen_ids:
                continue
            seen_ids.add(h["id"])
            candidates.append({**h,
                               "match": name_match_score(intended, h["name"]),
                               "via": q})
    # Keep only name-matching candidates. Rank by COUNT first: TMDB stores the
    # canonical city keyword as "City, Region" (e.g. "tokyo, japan" 462) while a
    # near-empty bare "tokyo" (4) also name-matches — the populated one is correct,
    # so count leads, name-match score only breaks ties.
    named = [c for c in candidates if c["match"] > 0]
    named.sort(key=lambda c: (c["count"], c["match"]), reverse=True)
    best = named[0] if named else None
    # A legit secondary fit (e.g. "new york" vs "new york city") for union
    second = named[1] if len(named) > 1 else None
    return {"intended": intended, "queries": queries, "evidence": evidence,
            "best": best, "second": second,
            "all_named": named}

# (intended term, [query spellings to try])
RR_GROUPS = {
    "GROUP 1 — confirmed/suspected false positives": [
        ("london", ["london"]),
        ("1920s", ["1920s", "roaring twenties", "jazz age"]),
        ("gotham", ["gotham", "gotham city"]),
        ("dune", ["dune", "arrakis"]),
        ("tokyo", ["tokyo"]),
        ("berlin", ["berlin"]),
    ],
    "GROUP 2 — CITIES near/below the strong cut": [
        ("tokyo", ["tokyo"]),
        ("berlin", ["berlin"]),
        ("hong kong", ["hong kong"]),
        ("rome", ["rome"]),
        ("mumbai", ["mumbai", "bombay"]),
        ("mexico city", ["mexico city"]),
        ("sydney", ["sydney"]),
        ("lagos", ["lagos"]),
        ("chicago", ["chicago"]),
        ("san francisco", ["san francisco"]),
        ("las vegas", ["las vegas"]),
        ("hawaii", ["hawaii"]),
    ],
    "GROUP 3 — INSTITUTION / PLACE-TYPE near-cutoff": [
        ("island", ["island"]),
        ("train", ["train"]),
        ("hospital", ["hospital"]),
        ("college", ["college", "university"]),
        ("hotel", ["hotel"]),
        ("ship", ["ship", "at sea"]),
        ("airplane", ["airplane", "airliner"]),
        ("military base", ["military base", "army base"]),
        ("space station", ["space station"]),
        ("courtroom", ["courtroom"]),
        ("farm", ["farm"]),
        ("factory", ["factory"]),
        ("mansion", ["mansion"]),
        ("boarding school", ["boarding school"]),
        ("summer camp", ["summer camp"]),
        ("apartment", ["apartment"]),
    ],
    "GROUP 4 — ERA survivors + second look": [
        ("world war ii", ["world war ii"]),
        ("dystopia", ["dystopia"]),
        ("post-apocalyptic", ["post-apocalyptic", "post-apocalypse"]),
        ("cold war", ["cold war"]),
        ("medieval", ["medieval", "middle ages"]),
        ("victorian", ["victorian", "victorian era"]),
        ("ancient rome", ["ancient rome", "roman empire"]),
    ],
    "GROUP 5 — SEASONAL confirm": [
        ("christmas", ["christmas"]),
        ("halloween", ["halloween"]),
        ("summer", ["summer"]),
        ("winter", ["winter"]),
        ("new year's eve", ["new year's eve", "new year"]),
        ("thanksgiving", ["thanksgiving"]),
    ],
}

def _rr_fmt_best(b):
    if not b:
        return "—", "—", "—"
    return b["name"], str(b["id"]), str(b["count"])

def reresolve():
    global API_KEY, CACHE
    API_KEY = load_api_key()
    print(f"API key loaded (last 4: ...{API_KEY[-4:]})")
    CACHE = load_cache()
    print(f"Cache entries: {len(CACHE)}")

    results = {}
    for group, terms in RR_GROUPS.items():
        print(f"\n=== {group} ===")
        rows = []
        for intended, queries in terms:
            r = reresolve_term(intended, queries)
            rows.append(r)
            bn, bi, bc = _rr_fmt_best(r["best"])
            ok = bool(r["best"])
            print(f"  {intended:18s} -> {bn[:28]:28s} id={bi:8s} "
                  f"count={bc:>6} {rr_verdict(int(bc) if ok else 0, ok)}")
            save_cache(CACHE)
        results[group] = rows

    # ── Markdown ──
    L = []
    L.append("# ORBIT — SETTING keyword RE-RESOLVE (name-match pass)\n")
    L.append("_Top-5 hits per term; keyword chosen by NAME-match to the intended "
             "SETTING concept, not by raw coverage. Bars: STRONG ≥700, WEAK 150–699, "
             "NONE <150, NONE-CONFIRMED = no correctly-named keyword exists._\n")

    L.append("\n## Consolidated re-resolve table\n")
    L.append("| intended term | correct keyword | id | total_results | top-5 alternates seen (name:count) | verdict |")
    L.append("|---|---|---|---:|---|---|")
    for group, rows in results.items():
        L.append(f"| **{group}** | | | | | |")
        for r in rows:
            bn, bi, bc = _rr_fmt_best(r["best"])
            ok = bool(r["best"])
            # flatten alternates across queries, dedupe, keep order
            alts, seen = [], set()
            for q, hits in r["evidence"].items():
                for h in hits:
                    if h["id"] in seen:
                        continue
                    seen.add(h["id"])
                    alts.append(f"{h['name']}:{h['count']}")
            alt_str = "; ".join(alts[:5]) or "—"
            sec = ""
            if r["second"]:
                sec = f" _(2nd fit: {r['second']['name']} {r['second']['count']})_"
            L.append(f"| {r['intended']} | {bn}{sec} | {bi} | {bc} | {alt_str} | "
                     f"{rr_verdict(int(bc) if ok else 0, ok)} |")

    RR_OUT_MD.write_text("\n".join(L), encoding="utf-8")
    save_cache(CACHE)
    print(f"\nWrote {RR_OUT_MD}")

if __name__ == "__main__":
    if "--reresolve" in sys.argv:
        reresolve()
    else:
        main()
