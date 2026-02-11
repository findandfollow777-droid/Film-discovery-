// theme-taxonomy.js

const THEME_TAXONOMY = {
  // RELATIONSHIPS
  "Family": ["family", "family-dynamics", "father-son", "mother-daughter",
             "fatherhood", "motherhood", "sibling-rivalry", "parenthood",
             "dysfunctional-family", "father-daughter", "family-dysfunction",
             "family-bonds", "family-loyalty", "generational-conflict",
             "parent-child", "mother-son", "siblings", "orphan", "adoption",
             "maternal-instinct", "paternal", "estranged-family",
             "family-conflict", "familial-duty", "family-honor",
             "family-legacy", "family-secrets", "generational-trauma",
             "parental-love", "parental-sacrifice", "domestic-life",
             "sibling-bond", "sibling-relationship", "father-figure"],
  "Love & Romance": ["love", "forbidden-love", "unrequited-love", "romance",
                      "heartbreak", "marriage", "infidelity", "devotion",
                      "forbidden love", "jealousy", "passion", "desire",
                      "seduction", "attraction", "relationship",
                      "romantic-love", "love-triangle", "marital-conflict",
                      "unconditional-love", "star-crossed-lovers",
                      "romantic-obsession", "love-and-loss", "lost-love",
                      "sexual-awakening", "intimacy", "partnership",
                      "toxic-relationship", "divorce", "marital-dysfunction",
                      "unrequited love", "romantic-idealism"],
  "Friendship": ["friendship", "brotherhood", "loyalty", "camaraderie",
                  "betrayal-of-trust", "trust", "betrayal", "teamwork",
                  "mentorship", "bonds", "companionship", "solidarity",
                  "bonding", "male-bonding", "female-friendship",
                  "unlikely-friendship", "mentor-student",
                  "found-family", "community", "cooperation",
                  "unity", "sisterhood", "commitment"],

  // PERSONAL JOURNEY
  "Coming of Age": ["coming-of-age", "growing-up", "adolescence", "youth",
                     "loss-of-innocence", "self-discovery", "nostalgia",
                     "innocence", "maturity", "childhood", "first-love",
                     "rite-of-passage", "teenage-angst", "youthful-rebellion",
                     "college", "high-school", "teenage"],
  "Identity": ["identity", "belonging", "alienation",
                "cultural-identity", "gender-identity", "duality",
                "transformation", "self-acceptance", "masculinity",
                "femininity", "individuality", "authenticity",
                "displacement", "cultural-clash", "assimilation",
                "self-exploration", "reinvention", "persona",
                "dual-identity", "cultural-assimilation", "outsider",
                "nonconformity", "immigration", "immigrant-experience",
                "cultural-displacement", "sexual-identity",
                "self-expression", "otherness", "existential-crisis",
                "gender-roles", "female-empowerment", "sexuality",
                "tradition-vs-modernity", "adaptation",
                "humanity", "human-connection", "vulnerability"],
  "Redemption": ["redemption", "atonement", "second-chances", "forgiveness",
                  "moral-transformation", "sacrifice", "guilt",
                  "healing", "self-sacrifice", "responsibility",
                  "moral-redemption", "repentance", "absolution",
                  "personal-growth", "renewal", "salvation",
                  "inner-conflict", "conscience",
                  "moral-awakening", "moral-reckoning",
                  "compassion", "moral-courage", "dignity",
                  "self-worth", "protection"],

  // CONFLICT
  "Survival": ["survival", "endurance", "perseverance", "against-all-odds",
                "stranded", "wilderness", "resilience", "desperation",
                "courage", "hope", "determination", "resourcefulness",
                "tenacity", "self-preservation", "will-to-live",
                "struggle", "adversity", "overcoming-adversity",
                "adventure"],
  "Revenge": ["revenge", "vengeance", "retribution", "vendetta"],
  "War & Conflict": ["war", "combat", "military", "resistance", "occupation",
                      "terrorism", "civil-war", "violence", "heroism",
                      "honor", "duty", "good-vs-evil", "battle",
                      "warfare", "soldier", "patriotism", "conquest",
                      "revolution", "guerrilla-warfare", "anti-war",
                      "wartime", "collateral-damage",
                      "brotherhood-in-arms", "cost-of-war",
                      "horrors-of-war", "war-trauma",
                      "humanity-in-darkness", "futility-of-war",
                      "espionage", "persecution"],
  "Power & Corruption": ["corruption", "power", "greed", "ambition",
                          "political-intrigue", "abuse-of-power",
                          "deception", "manipulation", "exploitation",
                          "moral-corruption", "power-dynamics",
                          "moral-compromise", "tyranny", "control",
                          "authoritarianism", "totalitarianism",
                          "megalomania", "hubris", "political-corruption",
                          "corporate-greed", "power-struggle",
                          "political-power", "institutional-corruption",
                          "power-corruption", "dominance",
                          "abuse-of-authority", "systemic-corruption",
                          "fame", "competition", "leadership",
                          "artistic-ambition", "artistic-integrity"],

  // EXISTENTIAL
  "Grief & Loss": ["grief", "loss", "mourning", "death", "bereavement",
                    "letting-go", "coping", "mortality", "aging",
                    "trauma", "loneliness", "isolation", "acceptance",
                    "regret", "melancholy", "sorrow", "solitude",
                    "emotional-pain", "widowhood", "terminal-illness",
                    "loss-of-faith", "existential-loneliness",
                    "emotional-isolation", "separation",
                    "abandonment", "neglect", "loss-of-purpose",
                    "disillusionment", "emptiness", "despair",
                    "midlife-crisis", "faith"],
  "Obsession": ["obsession", "addiction", "compulsion", "madness",
                 "descent-into-darkness", "paranoia", "self-destruction",
                 "fixation", "mania", "delusion", "psychosis",
                 "substance-abuse", "alcoholism", "jealous-obsession",
                 "fanaticism", "spiraling", "mental-illness",
                 "psychological-breakdown", "unraveling",
                 "self-destructive-behavior", "toxic-obsession",
                 "dark-obsession", "temptation", "voyeurism",
                 "moral-decay", "conspiracy", "surveillance"],
  "Freedom": ["freedom", "imprisonment", "escape", "liberation",
               "oppression", "rebellion", "independence", "autonomy",
               "confinement", "captivity", "emancipation",
               "breaking-free", "self-liberation", "defiance",
               "resistance-to-authority", "free-will",
               "political-freedom", "social-freedom", "escapism"],
  "Fate & Destiny": ["fate", "destiny", "chance", "coincidence",
                      "predetermination", "time", "legacy", "memory",
                      "prophecy", "karma", "serendipity",
                      "inevitability", "mortality-and-legacy",
                      "generational-legacy", "historical-legacy",
                      "circle-of-life", "impermanence",
                      "dreams-vs-reality", "consequences",
                      "truth", "secrets", "homecoming"],

  // SOCIAL
  "Class & Inequality": ["class-divide", "wealth-gap", "poverty", "privilege",
                          "social-mobility", "inequality", "social-inequality",
                          "wealth", "disparity", "class-conflict",
                          "elitism", "working-class", "socioeconomic",
                          "class-struggle", "social-stratification",
                          "haves-vs-have-nots", "economic-disparity",
                          "social-class", "upper-class", "lower-class"],
  "Justice": ["justice", "injustice", "legal-system", "wrongful-accusation",
               "moral-dilemma", "vigilantism", "moral-ambiguity",
               "ethics", "moral-conflict", "moral-consequence",
               "rule-of-law", "crime-and-punishment", "due-process",
               "wrongful-conviction", "social-justice", "ethical-dilemma",
               "moral-complexity", "moral-choice", "moral-gray-area",
               "moral-responsibility", "moral-struggle",
               "moral-consequences", "moral-duty"],
  "Race & Prejudice": ["racism", "prejudice", "discrimination",
                        "civil-rights", "segregation", "xenophobia",
                        "intolerance", "racial-injustice", "bigotry",
                        "racial-tension", "racial-identity",
                        "colonialism", "imperialism", "apartheid",
                        "slavery", "racial-equality", "racial-prejudice",
                        "anti-semitism", "ethnic-conflict"],
};

// Group labels for UI section headers
const THEME_GROUPS = {
  "Relationships": ["Family", "Love & Romance", "Friendship"],
  "Personal Journey": ["Coming of Age", "Identity", "Redemption"],
  "Conflict": ["Survival", "Revenge", "War & Conflict", "Power & Corruption"],
  "Existential": ["Grief & Loss", "Obsession", "Freedom", "Fate & Destiny"],
  "Social": ["Class & Inequality", "Justice", "Race & Prejudice"],
};

// Build a reverse lookup: raw string → normalised category name
// e.g. "father-son" → "Family", "vengeance" → "Revenge"
const _rawToNormalised = {};
for (const [category, rawTerms] of Object.entries(THEME_TAXONOMY)) {
  for (const term of rawTerms) {
    _rawToNormalised[term.toLowerCase()] = category;
  }
}

/**
 * Given a raw theme string, return the normalised category name.
 * Returns null if no match found.
 */
function normaliseTheme(rawTheme) {
  if (!rawTheme) return null;
  const key = rawTheme.toLowerCase().trim();
  // Direct match
  if (_rawToNormalised[key]) return _rawToNormalised[key];
  // Try hyphenated variant (e.g. "family bonds" → "family-bonds")
  const hyphenated = key.replace(/\s+/g, "-");
  if (_rawToNormalised[hyphenated]) return _rawToNormalised[hyphenated];
  // Try spaced variant (e.g. "good-vs-evil" with space)
  const spaced = key.replace(/-/g, " ");
  if (_rawToNormalised[spaced]) return _rawToNormalised[spaced];
  return null;
}

/**
 * Given an array of raw themes, return deduplicated array of normalised category names.
 * Also returns any raw themes that didn't map to a category (unmapped).
 */
function normaliseThemes(rawThemes) {
  const normalised = new Set();
  const unmapped = [];

  for (const raw of rawThemes) {
    const cat = normaliseTheme(raw);
    if (cat) {
      normalised.add(cat);
    } else {
      unmapped.push(raw);
    }
  }

  return {
    normalised: Array.from(normalised),
    unmapped
  };
}

// Dual environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THEME_TAXONOMY, THEME_GROUPS, normaliseTheme, normaliseThemes };
}
