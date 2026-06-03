/* ============================================
   ORBIT — Festival Guide Data
   Canonical data for the Awards Guide festival
   sub-pages. Keyed by festival id.
============================================ */

window.FESTIVAL_GUIDE_DATA = {
  cannes: {
    id: 'cannes',
    name: 'Cannes',
    fullName: 'Festival de Cannes',
    accentVar: '--fest-cannes',
    accentRgbVar: '--fest-cannes-rgb',
    legacyGlyph: 'og-palm',
    pageTitle: 'CANNES',
    tagline: "The Riviera\u2019s annual reckoning with what cinema can be.",
    hero: {
      eyebrow: 'A FILM FESTIVAL',
      heroName: 'Festival de Cannes',
      heroFullName: '"Cannes" \u2014 The Riviera\'s annual ceremony of world cinema',
      founded: '1946',
      location: 'Cannes, France',
      held: 'May, annually',
      awardingBody: 'Festival de Cannes',
      format: 'Festival jury'
    },
    about: {
      eyebrow: '\u2014 About',
      title: 'The festival the war delayed',
      paragraphs: [
        "Cannes was conceived in 1939 as <strong>France\u2019s answer to fascist Venice</strong> \u2014 a free, open festival to counter Mussolini\u2019s politicised Mostra. War shut it down before it could open, and the first edition didn\u2019t run until <strong>September 1946</strong>.",
        "What it became, almost by accident, was something more powerful than its founders intended: the world\u2019s most influential gatekeeper of <strong>auteur cinema</strong>. To screen In Competition at Cannes is to be admitted into a canon \u2014 and to win the Palme d\u2019Or is to enter a register that includes Coppola, Tarantino, Loach, Bong."
      ],
      pullQuote: 'Films are not made at Cannes. Reputations are.',
      paragraphsAfter: [
        "The festival\u2019s tone is unmistakeably <strong>French</strong>: rigorous, opinionated, occasionally hostile. Boos at premieres are part of the texture. So are eight-minute standing ovations. Cannes does not pretend to neutrality \u2014 and that, more than anything, is why filmmakers fight to be there."
      ]
    },
    topPrize: {
      eyebrow: '\u2014 The Top Prize',
      sectionTitle: 'The Palme d\'Or',
      name: 'Palme d\'Or',
      translation: '"Golden Palm"',
      description: "Cannes\u2019s highest honour, awarded to the year\u2019s outstanding film In Competition. The trophy is a stylised palm frond \u2014 drawn from the city\u2019s coat of arms \u2014 set in a crystal cushion. Designed in 1955, redesigned in 1997 by Caroline Scheufele of jeweller Chopard, the current Palme is hand-crafted in 24-carat gold.",
      stats: [
        { number: '77', label: 'Awarded since 1955' },
        { number: '3',  label: 'Also won Best Picture' },
        { number: '2',  label: 'Two-time winners' }
      ],
      svg: '<svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10 C48 20 40 30 32 38 C24 46 18 48 14 46 C12 44 14 40 20 36 C26 32 34 28 42 20 C38 28 30 38 24 44 C18 50 12 52 10 50 C8 48 10 44 16 38 C22 32 32 24 42 16 C36 24 26 36 20 44 C14 52 10 56 12 58 C14 60 18 58 24 52 C30 46 38 36 46 24 L50 10 Z" fill="currentColor" opacity="0.9"/><path d="M50 10 C52 20 60 30 68 38 C76 46 82 48 86 46 C88 44 86 40 80 36 C74 32 66 28 58 20 C62 28 70 38 76 44 C82 50 88 52 90 50 C92 48 90 44 84 38 C78 32 68 24 58 16 C64 24 74 36 80 44 C86 52 90 56 88 58 C86 60 82 58 76 52 C70 46 62 36 54 24 L50 10 Z" fill="currentColor" opacity="0.9"/><line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="2.5" opacity="0.7"/><rect x="38" y="90" width="24" height="6" rx="2" fill="currentColor" opacity="0.6"/><rect x="34" y="96" width="32" height="4" rx="2" fill="currentColor" opacity="0.5"/><path d="M28 100 L28 108 Q28 114 34 114 L66 114 Q72 114 72 108 L72 100 Z" fill="currentColor" opacity="0.35"/><rect x="32" y="114" width="36" height="4" rx="2" fill="currentColor" opacity="0.3"/></svg>'
    },
    otherPrizes: {
      eyebrow: '\u2014 Other Major Prizes',
      sectionTitle: 'The full roll call',
      prizes: [
        { name: 'Grand Prix',             translation: '"Grand Prize"',                          desc: 'The runner-up to the Palme d\'Or \u2014 and one of cinema\'s most prestigious near-misses. Recent winners include Sentimental Value (2025), Zone of Interest (2023), Close (2022).' },
        { name: 'Jury Prize',             translation: '"Prix du Jury"',                         desc: 'The third-tier honour at Cannes, awarded at the jury\'s discretion to a film of distinction that didn\'t take the top two prizes. Often a flag for the most critically beloved outsider of the festival.' },
        { name: 'Best Director',          translation: '"Prix de la mise en sc\u00e8ne"',        desc: 'For directorial achievement on a film In Competition. A lineage that runs from Robert Bresson to Sofia Coppola to Bong Joon-ho.' },
        { name: 'Best Screenplay',        translation: '"Prix du sc\u00e9nario"',                desc: 'For the most distinguished screenplay in the official competition. Often the most cerebral honour of the festival.' },
        { name: 'Best Actor',             translation: '"Prix d\'interpr\u00e9tation masculine"', desc: 'Acting honour for a male performance In Competition. Dean Stockwell, Jack Lemmon, Mathieu Amalric, Caleb Landry Jones \u2014 the list bends towards inwardness.' },
        { name: 'Best Actress',           translation: '"Prix d\'interpr\u00e9tation f\u00e9minine"', desc: 'Acting honour for a female performance In Competition. From Ingrid Bergman to Vicky Krieps to Cate Blanchett \u2014 Cannes\'s actress prize has long been a critic\'s prize first.' },
        { name: 'Cam\u00e9ra d\'Or',      translation: '"Golden Camera"',                       desc: 'For the best first feature shown anywhere at the festival \u2014 Competition, Un Certain Regard, or the parallel sections. A genuine launchpad: Steve McQueen, Jim Jarmusch, Naomi Kawase all started here.' },
        { name: 'Short Film Palme d\'Or', translation: '"Palme d\'Or du court m\u00e9trage"',    desc: 'The festival\'s separate honour for short-format work. Often where the next decade of feature directors are first spotted.' }
      ]
    },
    moments: {
      eyebrow: '\u2014 Notable Moments',
      sectionTitle: 'Cannes after dark',
      items: [
        { year: '1968', headline: 'The Festival That Stopped',  text: "Truffaut, Godard and Lelouch led the shutdown of Cannes mid-festival in solidarity with the May \u201968 Paris uprisings. The films went unscreened. Cinema, briefly, chose politics over premiere." },
        { year: '1994', headline: 'Pulp Wins Palme',            text: "A 31-year-old Tarantino takes the Palme d\u2019Or for Pulp Fiction over Krzysztof Kie\u015Blowski\u2019s Three Colours: Red. The vote was 5\u20134. American indie cinema\u2019s coronation." },
        { year: '2019', headline: 'Parasite, by acclamation',   text: "Bong Joon-ho\u2019s Parasite wins the Palme d\u2019Or unanimously \u2014 the first Korean film to do so. Nine months later, it would win Best Picture too. The first ever Palme/Oscar double in the same year." },
        { year: '2021', headline: 'Spike Lee\'s Slip',          text: "Jury president Spike Lee accidentally announces Titane as Palme winner at the start of the ceremony, fifteen minutes before he was meant to. The ovation, when it actually came, was real." }
      ]
    },
    trivia: {
      eyebrow: '\u2014 Did You Know',
      sectionTitle: 'Cannes lore',
      stripEyebrow: 'SEVEN THINGS',
      items: [
        "<strong>Only three films</strong> have won both the Palme d\u2019Or and the Oscar for Best Picture: Marty (1955), The Lost Weekend (1945, retroactive), and Parasite (2019).",
        "The festival was originally scheduled to <strong>open in September 1939</strong>. The first guests had already arrived when Hitler invaded Poland and the festival was cancelled.",
        "The Palme d\u2019Or trophy is <strong>made of solid 24-carat gold</strong>, hand-finished by Chopard. The crystal cushion alone takes 40 hours to polish.",
        "Films must <strong>premiere at Cannes</strong> to compete \u2014 no prior public screening anywhere in the world is permitted In Competition.",
        "The official festival logo \u2014 a stylised palm frond \u2014 was designed in 1939 and has never been changed.",
        "A <strong>jury of nine</strong> votes on the prizes, presided over by a major filmmaker. Past presidents include Sophia Loren, Clint Eastwood, Tilda Swinton and Spike Lee.",
        "Films can win the Palme d\u2019Or <strong>without ever having a US theatrical release</strong> \u2014 Uncle Boonmee Who Can Recall His Past Lives (2010) is one such case."
      ]
    },
    browseCta: {
      label: 'Now you know the prizes',
      text: 'Browse every Cannes winner since 1946',
      href: 'awards-browse.html?festival=cannes'
    }
  },

  oscar: {
    id: 'oscar', name: 'Oscar', fullName: 'Academy Awards',
    accentVar: '--fest-oscar', accentRgbVar: '--fest-oscar-rgb',
    legacyGlyph: 'og-statuette',
    pageTitle: 'OSCAR', tagline: "Hollywood\u2019s self-portrait."
  },
  venice: {
    id: 'venice', name: 'Venice', fullName: 'Mostra Internazionale',
    accentVar: '--fest-venice', accentRgbVar: '--fest-venice-rgb',
    legacyGlyph: 'og-lion',
    pageTitle: 'VENICE', tagline: "The world\u2019s oldest film festival."
  },
  berlin: {
    id: 'berlin', name: 'Berlin', fullName: 'Berlinale',
    accentVar: '--fest-berlin', accentRgbVar: '--fest-berlin-rgb',
    legacyGlyph: 'og-bear',
    pageTitle: 'BERLIN', tagline: "The Cold War\u2019s cinematic checkpoint."
  },
  bafta: {
    id: 'bafta', name: 'BAFTA', fullName: 'British Academy Film Awards',
    accentVar: '--fest-bafta', accentRgbVar: '--fest-bafta-rgb',
    legacyGlyph: 'og-mask',
    pageTitle: 'BAFTA', tagline: "Britain\u2019s answer to the Academy."
  },
  globe: {
    id: 'globe', name: 'Golden Globe', fullName: 'Golden Globe Awards',
    accentVar: '--fest-globe', accentRgbVar: '--fest-globe-rgb',
    legacyGlyph: 'og-globe',
    pageTitle: 'GOLDEN GLOBE', tagline: "Awards season\u2019s loose-tongued opening night."
  }
};
