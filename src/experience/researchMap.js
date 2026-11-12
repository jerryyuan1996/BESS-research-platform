/* ---------------------------------------------------------------------------
   RESEARCH IN CONTEXT: which research card is read under which chapter.

   The market page states a call and explains it in chapters. The research
   behind each chapter used to sit in a separate set of tabs. This map places
   every card of that research under the chapter it supports, so a reader can
   open "the research behind this section" where the question arises. Nothing
   is copied or moved: the card stays in its research tab, and the chapter
   draws the same card from the same source (researchExcerpt in
   src/markets/_shared/engine.js). The tabs, the research dialog and every
   deep link stay as they are.

   THREE LAYERS, IN THIS ORDER
     1. A card named under a market's `cards` goes where that line says.
        An empty list means it has no home yet and waits on the analyst:
        it is on the decision list (UNASSIGNED) and no chapter shows it.
     2. Otherwise the card follows its section's DEFAULT, which every market
        on the block engine shares.
     3. A section with no default must place every one of its cards by name.

   A card is named by a phrase of its English title, or `#type` for a section
   that is one component (src/markets/_shared/researchUnits.js). One card may
   be read in two places, which is two views of one source and not a copy.

   tests/research-map.test.js loads every routed section of each mapped market
   and fails unless each card resolves to a chapter or to the decision list,
   and each phrase here names exactly one card.
   `node scripts/research/coverage.mjs` prints the result as a table.

   Pure data and three small functions: no DOM and no market import, so the
   page loads this only when a reader opens a disclosure.
   --------------------------------------------------------------------------- */

/** Chapters a card can be read under, by the id the page gives each one. */
export const CHAPTERS = {
  /* Already shown by the page itself; no disclosure is added. */
  history:           { wired: true,  where: ['Market background · Historical background', '市场背景 · 历史背景'] },
  decision:          { wired: true,  where: ['Decision panel and investment view', '投资判断与市场投资判断'] },
  /* The shared market-background reading. */
  system:            { wired: false, where: ['Market background · System tensions', '市场背景 · 系统矛盾'] },
  mechanism:         { wired: false, where: ['Market background · Market mechanism', '市场背景 · 市场机制'] },
  /* The market page. */
  'revenue-drivers': { wired: false, where: ['WHY THE REVENUE EXISTS', '收入背后的经济动因'] },
  revenue:           { wired: false, where: ['REVENUE BREAKDOWN', '收益拆解'] },
  bankable:          { wired: false, where: ['THE BANKABLE CASE', '可融资方案'] },
  execution:         { wired: false, where: ['STEP-BY-STEP OPERATION GUIDANCE', '逐步执行指南'] },
  downside:          { wired: false, where: ['DOWNSIDE RISK', '下行风险'] },
  sources:           { wired: false, where: ['RESEARCH & PROVENANCE', '研究与来源'] },
};

/* Under WHY THE REVENUE EXISTS a card sits beneath the mechanism it explains.
   A slot is that mechanism's family: the long-term award or capacity payment,
   energy trading, or ancillary services. Which mechanism card fills which slot
   is MECHANISM_RESEARCH in src/opportunities/revenue.js, beside the cards.
   `revenue-drivers` with no slot is research that spans them. */
export const SLOTS = ['award', 'merchant', 'ancillary'];

/** Research section → chapter, for every market on the shared block engine. */
export const DEFAULT_MAP = {
  case:      'decision',
  story:     'history',
  capacity:  'revenue-drivers:award',
  energy:    'revenue-drivers:merchant',
  services:  'revenue-drivers:ancillary',
  duration:  'revenue',
  portfolio: 'bankable',
  entry:     'execution',
  pipeline:  'execution',
  grid:      'execution',
  data:      'sources',
};

/** The order sections are read in when a chapter draws from several. */
export const SECTION_ORDER = ['home', 'story', 'capacity', 'energy', 'services', 'duration',
  'portfolio', 'entry', 'grid', 'pipeline', 'data', 'case', 'benchmark'];

const NONE = [];

/* ---- National Electricity Market ------------------------------------------ */
const NEM = {
  home: {
    'Institutional Investor Walkthrough': NONE,
    'Card A — Contracted Revenue Signal': ['revenue-drivers:award'],
    'Card B — Merchant Signal': ['revenue-drivers:merchant'],
    'Card C — FCAS Signal': ['revenue-drivers:ancillary'],
    'Card D — Duration Signal': ['revenue'],
    'Card E — Grid & Congestion Signal': ['system'],
    'Card F — Underwriting rules': ['bankable'],
    'Revenue Driver Bridge': ['revenue'],
  },
  story: {
    'One-minute orientation': ['system'],
    'Fleet growth and revenue collapse': ['downside'],
    'Monthly path through 2026': ['revenue-drivers:merchant'],
    'Who is building NEM storage': ['execution'],
    'Near-term outlook': ['downside'],
    'Long-term outlook': ['downside'],
    'What breaks this storyline': ['downside'],
    'Bridge to the detailed dashboard': NONE,
  },
  capacity: {
    'The support stack': ['revenue-drivers:award', 'mechanism'],
    'How a CIS agreement actually pays': ['revenue-drivers:award', 'mechanism'],
  },
  energy: {
    'Regional divergence': ['revenue-drivers:merchant', 'system'],
    'Negative prices': ['revenue-drivers:merchant', 'system'],
    'Captured spread by COD year': ['downside'],
  },
  services: {
    'The markets, and why none of them pays for duration': ['revenue-drivers:ancillary', 'mechanism'],
  },
  duration: {
    'Fleet duration': ['downside'],
  },
  pipeline: {
    'Delivered, awarded, queued and required': ['downside'],
  },
  grid: {
    'Interactive NEM grid': ['system'],
    'No firm access': ['system', 'execution'],
    'The 2026 ISP optimal development path': ['system'],
    'The ISP register, project by project': ['system'],
  },
  benchmark: {
    'Market design — the same asset earns differently': NONE,
    'Revenue certainty compared': NONE,
    'Cost and scale': NONE,
    'Where the constraint sits in each market': NONE,
    'What transfers from the WEM to a NEM decision': NONE,
  },
};

/* ---- Japan: one research dashboard, read through Tokyo, Kyushu or Hokkaido -- */
const JP = {
  home: {
    'Economics DNA': ['system'],
    'Governed first pass': ['revenue'],
    'Capacity and competition coverage': ['sources'],
    'Official system evolution': ['system'],
    'Institutional Investor Walkthrough': NONE,
    'Card A — Japan national market stack': ['revenue-drivers', 'mechanism'],
    ' — investment signal': ['system'],
    'Card C — Regional market snapshot': ['revenue-drivers:merchant'],
    'Card D — Capacity Market, delivery year 2029': ['revenue-drivers:award'],
    'Card F — Grid and connection at a glance': ['execution'],
  },
  story: {
    'What breaks the thesis': ['downside'],
  },
  capacity: {
    'Capacity Market architecture': ['revenue-drivers:award', 'mechanism'],
    'Revenue classification': ['bankable'],
    'LTDA — long-term decarbonization auction': ['revenue-drivers:award', 'mechanism'],
  },
  energy: {
    'Curtailment overlap with the charging window': ['revenue-drivers:merchant', 'system'],
  },
  services: {
    'Product matrix': ['revenue-drivers:ancillary', 'mechanism'],
  },
  pipeline: {
    'Saturation signals': ['downside'],
  },
  grid: {
    ' — physical grid, supply and demand': ['system'],
    'The interconnector build behind the curtailment': ['system'],
  },
  benchmark: {
    'One-page comparison matrix': NONE,
  },
};

/** Card-level placements, by the dashboard that owns the research. */
export const MARKET_MAPS = { nem: NEM, jp: JP };

/**
 * THE DECISION LIST: research with no clear home on the market page.
 *
 * One record for each card a market map places nowhere. Every card listed
 * stays where it is today; none is deleted without the analyst's answer.
 * Read by the coverage test and scripts/research/coverage.mjs only. The page
 * never imports it, so none of this text is shipped.
 */
export const UNASSIGNED = [
  { market: 'nem', section: 'home', card: 'Institutional Investor Walkthrough', routed: true,
    suggest: 'Keep in the research tabs only',
    reason: 'A six-step set of links between research tabs. Its one content sentence restates the house view the page already opens with.' },
  { market: 'nem', section: 'story', card: 'Bridge to the detailed dashboard', routed: true,
    suggest: 'Keep in the research tabs only',
    reason: 'Links from the story to the other research tabs and nothing else. The chapter disclosures now do that job on the market page.' },
  { market: 'nem', section: 'benchmark', card: 'Market design — the same asset earns differently', routed: false,
    suggest: 'Market background · System tensions, or delete',
    reason: 'The NEM against the WEM, written and never given a tab, so no reader can reach it today. Publishing it is a new publication, not a relocation.' },
  { market: 'nem', section: 'benchmark', card: 'Revenue certainty compared', routed: false,
    suggest: 'THE BANKABLE CASE, or delete',
    reason: 'Same unrouted section. It prices a capacity mechanism the NEM does not have, on illustrative figures.' },
  { market: 'nem', section: 'benchmark', card: 'Cost and scale', routed: false,
    suggest: 'Delete, or keep unrouted',
    reason: 'Same unrouted section. Two capital-cost bases side by side on illustrative figures; the published cost lines already sit in the bankable case.' },
  { market: 'nem', section: 'benchmark', card: 'Where the constraint sits in each market', routed: false,
    suggest: 'Market background · System tensions, or delete',
    reason: 'Same unrouted section. A two-market comparison of what each network rations.' },
  { market: 'nem', section: 'benchmark', card: 'What transfers from the WEM to a NEM decision', routed: false,
    suggest: 'Market background · System tensions, or delete',
    reason: 'Same unrouted section. The rule for reading the comparison, which has no use without the cards above it.' },
  { market: 'jp', section: 'home', card: 'Institutional Investor Walkthrough', routed: true,
    suggest: 'Keep in the research tabs only',
    reason: 'A six-step set of links between research tabs. Its storyline sentence restates the house view the page already opens with.' },
  { market: 'jp', section: 'benchmark', card: 'One-page comparison matrix', routed: false,
    suggest: 'Market background · System tensions, or delete',
    reason: 'Tokyo, Kyushu and Hokkaido on one table, written and never given a tab, so no reader can reach it today. Publishing it is a new publication, not a relocation.' },
];

/* ---- reading the map ------------------------------------------------------- */

const owned = (owner, section) => Object.entries(MARKET_MAPS[owner]?.[section] || {});

/** Does a phrase from this map name a unit with this key? As unitsMatching(). */
export const names = (phrase, key) => (phrase.startsWith('#') ? key === phrase : !key.startsWith('#') && key.includes(phrase));

/**
 * Where one card of a market's research is read: a list of `chapter` or
 * `chapter:slot`. Empty when the card is on the decision list, and when the
 * section has no default and the map does not name the card.
 */
export function placementsOf(owner, section, key){
  const named = owned(owner, section).find(([phrase]) => names(phrase, key));
  if (named) return named[1];
  return DEFAULT_MAP[section] ? [DEFAULT_MAP[section]] : NONE;
}

/**
 * The picks researchExcerpt() takes for one chapter of one market: the cards
 * named for it, plus the rest of each section whose default it is.
 *
 * @param owner    the dashboard that owns the research ('nem', 'jp')
 * @param chapter  a key of CHAPTERS
 * @param slot     for `revenue-drivers`, one of SLOTS; null for research across them
 */
export function picksFor(owner, chapter, slot = null){
  if (!MARKET_MAPS[owner]) return [];
  const target = slot ? chapter + ':' + slot : chapter;
  return SECTION_ORDER.flatMap(section => {
    const mine = owned(owner, section);
    const cards = mine.filter(([, to]) => to.includes(target)).map(([phrase]) => phrase);
    const rest = DEFAULT_MAP[section] === target;
    if (!cards.length && !rest) return [];
    return [{ section, cards, rest, except: rest ? mine.map(([phrase]) => phrase) : [] }];
  });
}

/** Markets whose research is placed, by dashboard owner. */
export const mappedOwners = () => Object.keys(MARKET_MAPS);
