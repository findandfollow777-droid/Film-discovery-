// ============================================
// ORBIT Discovery Dimensions — ERA_DECADE_MAP
// Shared constant: used by build scripts (CommonJS)
// and client-side code (<script> tag)
// ============================================

const ERA_DECADE_MAP = {
  // Antiquity & Classical
  "Ancient":          [-3000, -2000, -1000, -500, -400, -300, -200, -100],
  "Classical":        [-500, -400, -300, -200, -100, 0, 100, 200],
  "Roman Empire":     [-100, 0, 100, 200, 300, 400],
  "Biblical":         [-1000, -500, -400, -300, -200, -100, 0],

  // Medieval & Renaissance
  "Medieval":         [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
  "Dark Ages":        [500, 600, 700, 800, 900],
  "Crusades":         [1000, 1100, 1200],
  "Renaissance":      [1300, 1400, 1500],

  // Early Modern
  "Tudor":            [1480, 1500, 1550],
  "Elizabethan":      [1550, 1560, 1570, 1580, 1590, 1600],
  "Colonial":         [1600, 1610, 1620, 1630, 1640, 1650, 1660, 1670, 1680, 1690, 1700, 1710, 1720, 1730, 1740, 1750, 1760, 1770],
  "Age of Enlightenment": [1680, 1690, 1700, 1710, 1720, 1730, 1740, 1750, 1760, 1770, 1780],

  // Revolutionary Era
  "American Revolution":  [1760, 1770, 1780],
  "French Revolution":    [1780, 1790, 1800],
  "Napoleonic":           [1790, 1800, 1810],

  // 19th Century
  "Regency":          [1810, 1820],
  "Victorian":        [1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900],
  "Antebellum":       [1820, 1830, 1840, 1850, 1860],
  "American Civil War":   [1860],
  "Reconstruction":   [1860, 1870, 1880],
  "Gilded Age":       [1870, 1880, 1890, 1900],
  "Wild West":        [1850, 1860, 1870, 1880, 1890, 1900],

  // Turn of Century
  "Edwardian":        [1900, 1910],
  "Belle Époque":     [1870, 1880, 1890, 1900, 1910],

  // World Wars
  "World War I":      [1910, 1920],
  "Roaring Twenties": [1920],
  "Interwar":         [1920, 1930],
  "Great Depression": [1930],
  "World War II":     [1930, 1940],

  // Post-War
  "Post-War":         [1940, 1950],
  "Cold War":         [1940, 1950, 1960, 1970, 1980, 1990],
  "Atomic Age":       [1940, 1950, 1960],
  "1950s America":    [1950],
  "Swinging Sixties": [1960],
  "Vietnam Era":      [1960, 1970],
  "Civil Rights Era": [1950, 1960],
  "Disco Era":        [1970],
  "Reagan Era":       [1980],

  // Modern / Contemporary
  "Modern Day":       [1990, 2000, 2010, 2020],
  "Y2K":              [1990, 2000],
  "Post-9/11":        [2000, 2010],
  "Contemporary":     [2010, 2020],

  // Speculative
  "Near Future":      [2030, 2040, 2050],
  "Far Future":       [2100, 2200, 2500, 3000],
  "Post-Apocalyptic": [],
  "Prehistoric":      [-100000, -10000, -5000]
};

/**
 * Given a decade (e.g. 1940), return all era labels that include it.
 */
function getErasForDecade(decade) {
  return Object.entries(ERA_DECADE_MAP)
    .filter(([era, decades]) => decades.includes(decade))
    .map(([era]) => era);
}

/**
 * Given an era label (e.g. "World War II"), return its decade array.
 */
function getDecadesForEra(eraLabel) {
  return ERA_DECADE_MAP[eraLabel] || [];
}

// CommonJS export (Node scripts)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ERA_DECADE_MAP, getErasForDecade, getDecadesForEra };
}
