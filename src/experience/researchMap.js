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
  rcm:       'revenue-drivers:award',
  energy:    'revenue-drivers:merchant',
  services:  'revenue-drivers:ancillary',
  fcess:     'revenue-drivers:ancillary',
  duration:  'revenue',
  portfolio: 'bankable',
  entry:     'execution',
  pipeline:  'execution',
  grid:      'execution',
  data:      'sources',
};

/** The order sections are read in when a chapter draws from several. */
export const SECTION_ORDER = ['home', 'story', 'capacity', 'energy', 'services', 'duration',
  'portfolio', 'entry', 'grid', 'pipeline', 'data', 'case', 'benchmark', 'rcm', 'fcess'];

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

/* Remaining dashboards: placements refer to the existing public research only.
   Unrouted comparisons stay on the decision list, not on the market page. */
const GB = {
  "benchmark": {
    "Market design — the same asset earns differently in each market": [],
    "Capacity economics compared — the single largest structural difference": [],
    "Scale — the GB sponsor is not competing in the same market size": [],
    "What actually constrains delivery in each market": [],
    "System services in both markets — the same saturation story, four years apart": [],
    "What transfers from Ireland to a GB decision — and what does not": []
  },
  "home": {
    "Institutional Investor Walkthrough": [],
    "Card A": ["revenue-drivers:award"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["revenue-drivers:ancillary"],
    "Card D": ["revenue"],
    "Card E": ["system"],
    "Card F": ["bankable"],
    "Revenue Driver Bridge": ["revenue"]
  },
  "story": {
    "P0 Economics DNA — how GB system stress becomes BESS cash flow": ["system"],
    "Official first-pass economics — VERIFIED, DERIVED and PROXY": ["revenue"],
    "Capacity accreditation — nameplate is not paid capacity": ["revenue-drivers:award"],
    "Operating vs committed BESS competition — coverage boundary first": ["downside"],
    "Executable spread / capture-rate release gates": ["bankable"],
    "One-minute orientation for a new institutional investor": ["system"],
    "Official system evolution — FES 2025 Ten Year Forecast": ["system"],
    "Before and after the battery build — what changed in the investable market": ["system"],
    "Who owns GB storage — five strategies competing for the same MW": ["execution"],
    "Exit channels — how capital actually recycles out of GB storage": ["bankable"],
    "Near-term outlook — 2026 to 2029: execution decides returns": ["downside"],
    "Long-term outlook — 2030 to 2035: policy demand meets delivery reality": ["downside"],
    "What breaks this storyline — three monitored uncertainties": ["downside"],
    "Bridge to the detailed dashboard": []
  },
  "grid": {
    "Interactive GB grid — past structure, current pressure and future plan": ["system"],
    "The network build behind the offers — named projects and their consenting position": ["system"]
  },
  "capacity": {
    "De-rating factors": ["revenue-drivers:award", "mechanism"],
    "Nameplate → paid capacity": ["revenue-drivers:award", "mechanism"],
    "What can go wrong": ["downside", "revenue-drivers:award"]
  },
  "energy": {
    "Buildout paths": ["downside"]
  },
  "services": {
    "Auctioned service suite": ["revenue-drivers:ancillary", "mechanism"],
    "Underwriting rule": ["bankable"]
  },
  "pipeline": {
    "Contracted-revenue benchmarks": ["bankable"]
  }
};

const DE = {
  "benchmark": {
    "One variable, isolated": [],
    "And the mirror-image weakness": []
  },
  "home": {
    "Position at a glance": ["bankable"],
    "The four facts": ["system"],
    "Where German BESS revenue comes from, and where it is going": ["revenue"]
  },
  "story": {
    "What changes next, and when": ["downside"]
  },
  "grid": {
    "Interactive Germany grid — past, current and planned": ["system"],
    "The corridors behind the congestion — named projects and approval stage": ["system"]
  },
  "capacity": {
    "The StromVKG": ["revenue-drivers:award", "mechanism"],
    "Tolling": ["bankable", "revenue-drivers"],
    "Momentanreserve": ["revenue-drivers:ancillary", "mechanism"]
  },
  "services": {
    "Saturation, measured": ["revenue-drivers:ancillary", "downside"],
    "The Great Britain precedent": ["downside"]
  },
  "energy": {
    "Which revenue number": ["bankable"]
  }
};

const IT = {
  "benchmark": {
    "One variable, isolated": [],
    "And the mirror-image weakness": []
  },
  "home": {
    "Position at a glance": ["bankable"],
    "The four facts": ["system"],
    "The four routes on one basis": ["revenue"]
  },
  "story": {
    "Six bidding zones, and what each one offers a battery": ["system"]
  },
  "grid": {
    "Interactive Italy grid — past, current and planned": ["system"],
    "Named transmission relief": ["system"]
  },
  "capacity": {
    "MACSE —": ["revenue-drivers:award", "mechanism"],
    "What a MACSE winner gives up": ["bankable", "downside"],
    "The capacity market": ["revenue-drivers:award", "mechanism"],
    "Tolling": ["bankable", "revenue-drivers"]
  },
  "services": {
    "The number this platform refuses to use": ["downside"],
    "Where MSD prices are highest": ["revenue-drivers:ancillary", "system"]
  }
};

const IE = {
  "benchmark": {
    "Market design — the same asset earns differently in each market": [],
    "Capacity economics compared — the single largest structural difference": [],
    "Scale and saturation — a ratio, not a level": [],
    "Route to market — self-dispatch versus central scheduling": [],
    "System services in both markets — the same saturation story, four years apart": [],
    "What transfers from GB to an Irish decision — and what does not": []
  },
  "home": {
    "Institutional Investor Walkthrough": [],
    "Card A": ["revenue-drivers:award"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["revenue-drivers:ancillary"],
    "Card D": ["revenue"],
    "Card E": ["system"],
    "Card F": ["execution"],
    "Revenue Driver Bridge": ["revenue"]
  },
  "story": {
    "P0 Economics DNA — how all-island scarcity becomes BESS cash flow": ["system"],
    "Official first-pass economics — VERIFIED, DERIVED and PROXY": ["revenue"],
    "Capacity accreditation — approved de-rated MW drives cash": ["revenue-drivers:award"],
    "Operating vs committed BESS competition — auction evidence within its boundary": ["downside"],
    "Executable spread / capture-rate release gates": ["bankable"],
    "Official system evolution — GCS/AIRAA, SOEF and CSO": ["system"],
    "Opportunity logic — attractiveness is separate from confidence": ["bankable"],
    "One-minute orientation for a new institutional investor": ["system"],
    "Demand growth — the reason the capacity price keeps clearing high": ["system"],
    "Who owns Irish storage — five strategies competing for the same de-rated MW": ["execution"],
    "Exit channels — how capital recycles out of Irish storage": ["bankable"],
    "Near-term outlook — 2026 to 2029: two compressions, one support": ["downside"],
    "Long-term outlook — 2030 to 2035: adequacy, ambition and augmentation": ["downside"],
    "What breaks this storyline — three monitored uncertainties": ["downside"],
    "Bridge to the detailed dashboard": []
  },
  "grid": {
    "#geo-grid-map": ["system"],
    "Constraint and dispatch-down — the system problem storage is paid to solve": ["system"],
    "The network build behind the offers — named projects and their delivery step": ["system"]
  },
  "capacity": {
    "Reliability Option": ["revenue-drivers:award", "mechanism", "downside"],
    "Nameplate → paid capacity": ["revenue-drivers:award", "mechanism"]
  },
  "energy": {
    "Captured spread": ["downside"]
  },
  "services": {
    "FASS transition": ["revenue-drivers:ancillary", "downside"],
    "Service suite": ["revenue-drivers:ancillary", "mechanism"],
    "Underwriting rule": ["bankable"]
  }
};

const RO = {
  "benchmark": {
    "Market design — the same asset earns differently in each market": [],
    "Revenue certainty compared — what a capacity mechanism is worth": [],
    "Scale and fundamentals — similar problem, different size": [],
    "Where the constraint sits in each market": [],
    "What transfers from Poland to a Romanian decision — and what does not": []
  },
  "home": {
    "Institutional Investor Walkthrough": [],
    "Card A": ["revenue-drivers:award"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["revenue-drivers:ancillary"],
    "Card D": ["revenue"],
    "Card E": ["system"],
    "Card F": ["bankable"],
    "Revenue Driver Bridge": ["revenue"]
  },
  "story": {
    "One-minute orientation for a new institutional investor": ["system"],
    "Official system evolution — named plan years, no invented bridge": ["system"],
    "Public pipeline evidence — useful funnel, incomplete BESS queue": ["execution"],
    "Romania opportunity logic — attractiveness is not confidence": ["bankable"],
    "Economics DNA — what creates and captures Romanian BESS value": ["system"],
    "Governed first pass — verified facts, derived signals and proxies": ["revenue"],
    "Capacity and competition coverage": ["downside"],
    "Who is building Romanian storage — four strategies, one bottleneck": ["execution"],
    "Near-term outlook — 2026 to 2029: convert or lose the window": ["downside"],
    "Long-term outlook — 2030 to 2035: coal exit and the second window": ["downside"],
    "What breaks this storyline — three monitored uncertainties": ["downside"],
    "Bridge to the detailed dashboard": []
  },
  "grid": {
    "Interactive Romania grid — past, current and planned": ["system"],
    "The network build behind the offers — named works in the adopted RET plan": ["system"]
  },
  "capacity": {
    "The support stack": ["revenue-drivers:award", "mechanism"],
    "Grant mechanics": ["revenue-drivers:award", "execution"],
    "Adequacy context": ["system"]
  },
  "energy": {
    "Captured spread": ["downside"]
  },
  "services": {
    "Reserve products": ["revenue-drivers:ancillary", "mechanism"],
    "aFRR capacity price trend": ["revenue-drivers:ancillary", "downside"],
    "Evidence ladder": ["bankable"]
  }
};

const PL = {
  "benchmark": {
    "Market design — the same asset earns differently in each market": [],
    "Revenue certainty compared — what the capacity mechanism is worth": [],
    "Scale and fundamentals — same problem, different size": [],
    "Where value is created in each market": [],
    "What transfers from Romania to a Polish decision — and what does not": []
  },
  "home": {
    "Institutional Investor Walkthrough": [],
    "Card A": ["revenue-drivers:award"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["revenue-drivers:ancillary"],
    "Card D": ["revenue"],
    "Card E": ["system"],
    "Card F": ["execution"],
    "Revenue Driver Bridge": ["revenue"]
  },
  "story": {
    "One-minute orientation for a new institutional investor": ["system"],
    "Official system evolution — adopted pathway and planning basis": ["system"],
    "Storage evidence — connection snapshot, not a complete queue": ["sources"],
    "Poland opportunity logic — attractiveness is not confidence": ["bankable"],
    "Economics DNA — what creates and captures Polish BESS value": ["system"],
    "Governed first pass — verified facts, derived signals and proxies": ["revenue"],
    "Capacity and competition coverage": ["downside"],
    "The price shape — coal exit meets solar growth": ["system"],
    "Who is building Polish storage — four strategies, one bottleneck": ["execution"],
    "Near-term outlook — 2026 to 2029: auction position decides returns": ["downside"],
    "Long-term outlook — 2030 to 2035: obligation, replacement and the second window": ["downside"],
    "What breaks this storyline — three monitored uncertainties": ["downside"],
    "Bridge to the detailed dashboard": []
  },
  "grid": {
    "Interactive Poland grid — past, current and planned": ["system"],
    "The network build behind the refusals — named projects in the agreed PRSP": ["system"]
  },
  "capacity": {
    "The obligation side": ["revenue-drivers:award", "mechanism", "downside"],
    "Correction factors": ["revenue-drivers:award", "mechanism"]
  },
  "energy": {
    "Captured spread": ["downside"]
  },
  "services": {
    "Reserve products": ["revenue-drivers:ancillary", "mechanism"],
    "aFRR capacity price trend": ["revenue-drivers:ancillary", "downside"],
    "Evidence ladder": ["bankable"]
  }
};

const PJM = {
  "benchmark": {
    "How the contracted line is produced, market by market": [],
    "Where PJM sits on the two things it is worst at": []
  },
  "home": {
    "Position at a glance": ["bankable"],
    "The four facts": ["system"],
    "What the operating fleet earns, and why this model publishes less": ["revenue"]
  },
  "story": {
    "What changes next, and when": ["downside"]
  },
  "grid": {
    "Interactive PJM grid — past, current and planned": ["system"]
  },
  "capacity": {
    "The ELCC ladder": ["revenue-drivers:award", "mechanism"],
    "The fourteen assumed years": ["revenue-drivers:award", "downside"]
  },
  "energy": {
    "The node decides": ["revenue-drivers:merchant", "system"]
  },
  "services": {
    "Why the observed number": ["revenue-drivers:ancillary", "downside"],
    "Regulation does not pay": ["revenue-drivers:ancillary", "mechanism"]
  }
};

const ERCOT = {
  "benchmark": {
    "The two bargains, side by side": [],
    "What that means for an allocation": []
  },
  "home": {
    "Position at a glance": ["bankable"],
    "The four facts": ["system"],
    "The collapse, and the fleet size that explains it": ["revenue"]
  },
  "story": {
    "What changes next, and when": ["downside"]
  },
  "grid": {
    "Interactive ERCOT grid — past, current and planned": ["system"]
  },
  "capacity": {
    "A real market": ["bankable", "revenue-drivers"],
    "Named tolled assets": ["bankable", "revenue-drivers"],
    "Why there is no capacity market": ["revenue-drivers:award", "mechanism"]
  },
  "energy": {
    "ORDC": ["revenue-drivers:merchant", "mechanism"],
    "The disagreement": ["downside"]
  },
  "services": {
    "Why the observed number": ["revenue-drivers:ancillary", "downside"],
    "RTC+B": ["revenue-drivers:ancillary", "mechanism", "downside"]
  }
};

const CAISO = {
  "benchmark": {
    "The three bargains": [],
    "What the federal layer does not differentiate": []
  },
  "home": {
    "Position at a glance": ["bankable"],
    "Where the revenue actually comes from": ["revenue"],
    "The four facts": ["system"]
  },
  "story": {
    "What changes next, and when": ["downside"]
  },
  "grid": {
    "Interactive CAISO grid — past, current and planned": ["system", "execution"]
  },
  "capacity": {
    "The contracted line": ["revenue-drivers:award", "bankable"],
    "Slice of Day": ["revenue-drivers:award", "mechanism"]
  },
  "energy": {
    "The residual nobody explains": ["revenue-drivers:merchant", "downside"]
  },
  "services": {
    "Where the ancillary seed": ["revenue-drivers:ancillary", "downside"]
  }
};

const FI = {
  "home": {
    "#card": ["bankable"],
    "Card A": ["revenue-drivers:ancillary"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["bankable"],
    "Card D": ["execution"]
  },
  "story": {
    "What the reserve boom did to reserve prices": ["downside"],
    "Why adequacy stopped being the question": ["system"]
  },
  "grid": {
    "Interactive Finland grid — the north–south cut and the restricted south": ["system"]
  },
  "capacity": {
    "#card": ["revenue-drivers:award", "mechanism"]
  },
  "services": {
    "What the system procures": ["revenue-drivers:ancillary", "mechanism", "downside"]
  }
};

const CA_ON = {
  "home": {
    "#card": ["bankable"],
    "Card A": ["revenue-drivers:award"],
    "Card B": ["revenue-drivers:merchant"],
    "Card C": ["bankable"],
    "Card D": ["downside"]
  },
  "story": {
    "What Market Renewal did to the spread": ["revenue-drivers:merchant"]
  },
  "grid": {
    "Interactive Ontario storage map": ["execution"],
    "The transmission system": ["execution"]
  },
  "capacity": {
    "The terms": ["revenue-drivers:award", "bankable", "downside"]
  },
  "energy": {
    "The trading line": ["revenue-drivers:merchant", "downside"]
  }
};

const SA = {
  "home": {
    "#card": ["bankable"]
  },
  "grid": {
    "Interactive Saudi storage map": ["execution"],
    "The transmission system": ["execution"]
  },
  "capacity": {
    "The terms": ["revenue-drivers:award", "bankable"],
    "Group 1 awards": ["execution"]
  },
  "duration": {
    "#card": ["execution"]
  }
};

const ES = {
  "home": {
    "#card": ["bankable"],
    "Card A": ["revenue-drivers:merchant"],
    "Card B": ["downside"],
    "Card C": ["revenue-drivers:award"],
    "Card D": ["execution"]
  },
  "story": {
    "Price level against battery value": ["revenue-drivers:merchant"]
  },
  "grid": {
    "Interactive Spain storage map": ["execution"],
    "The transmission system": ["execution"]
  },
  "energy": {
    "The fleet path": ["revenue-drivers:merchant", "downside"]
  },
  "capacity": {
    "What Order": ["revenue-drivers:award", "downside"]
  }
};

const WA = {
  "home": {
    "#tab-home": []
  },
  "story": {
    "#tab-story": ["system"]
  },
  "rcm": {
    "#tab-rcm": ["revenue-drivers:award", "mechanism", "bankable"]
  },
  "fcess": {
    "#tab-fcess": ["revenue-drivers:ancillary", "mechanism"]
  },
  "grid": {
    "#tab-grid": ["system", "execution"]
  },
  "pipeline": {
    "#tab-pipeline": ["execution", "downside"]
  },
  "portfolio": {
    "#tab-portfolio": []
  }
};

/** Card-level placements, by the dashboard that owns the research. */
export const MARKET_MAPS = { nem: NEM, jp: JP, gb: GB, de: DE, it: IT, ie: IE, ro: RO, pl: PL, pjm: PJM, ercot: ERCOT, caiso: CAISO, fi: FI, ca_on: CA_ON, sa: SA, es: ES, wa: WA };

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
  {"market": "gb", "section": "benchmark", "card": "Market design — the same asset earns differently in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "benchmark", "card": "Capacity economics compared — the single largest structural difference", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "benchmark", "card": "Scale — the GB sponsor is not competing in the same market size", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "benchmark", "card": "What actually constrains delivery in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "benchmark", "card": "System services in both markets — the same saturation story, four years apart", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "benchmark", "card": "What transfers from Ireland to a GB decision — and what does not", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "gb", "section": "home", "card": "Institutional Investor Walkthrough", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A navigation walkthrough between research tabs. The market page already supplies the chapter path and its own investment view; the original remains reachable."},
  {"market": "gb", "section": "story", "card": "Bridge to the detailed dashboard", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A question map linking to the detailed research tabs. Chapter disclosures now provide those routes on the market page; the original links stay in their tab."},
  {"market": "de", "section": "benchmark", "card": "One variable, isolated", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "de", "section": "benchmark", "card": "And the mirror-image weakness", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "it", "section": "benchmark", "card": "One variable, isolated", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "it", "section": "benchmark", "card": "And the mirror-image weakness", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "Market design — the same asset earns differently in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "Capacity economics compared — the single largest structural difference", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "Scale and saturation — a ratio, not a level", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "Route to market — self-dispatch versus central scheduling", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "System services in both markets — the same saturation story, four years apart", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "benchmark", "card": "What transfers from GB to an Irish decision — and what does not", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ie", "section": "home", "card": "Institutional Investor Walkthrough", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A navigation walkthrough between research tabs. The market page already supplies the chapter path and its own investment view; the original remains reachable."},
  {"market": "ie", "section": "story", "card": "Bridge to the detailed dashboard", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A question map linking to the detailed research tabs. Chapter disclosures now provide those routes on the market page; the original links stay in their tab."},
  {"market": "ro", "section": "benchmark", "card": "Market design — the same asset earns differently in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ro", "section": "benchmark", "card": "Revenue certainty compared — what a capacity mechanism is worth", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ro", "section": "benchmark", "card": "Scale and fundamentals — similar problem, different size", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ro", "section": "benchmark", "card": "Where the constraint sits in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ro", "section": "benchmark", "card": "What transfers from Poland to a Romanian decision — and what does not", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ro", "section": "home", "card": "Institutional Investor Walkthrough", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A navigation walkthrough between research tabs. The market page already supplies the chapter path and its own investment view; the original remains reachable."},
  {"market": "ro", "section": "story", "card": "Bridge to the detailed dashboard", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A question map linking to the detailed research tabs. Chapter disclosures now provide those routes on the market page; the original links stay in their tab."},
  {"market": "pl", "section": "benchmark", "card": "Market design — the same asset earns differently in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pl", "section": "benchmark", "card": "Revenue certainty compared — what the capacity mechanism is worth", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pl", "section": "benchmark", "card": "Scale and fundamentals — same problem, different size", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pl", "section": "benchmark", "card": "Where value is created in each market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pl", "section": "benchmark", "card": "What transfers from Romania to a Polish decision — and what does not", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pl", "section": "home", "card": "Institutional Investor Walkthrough", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A navigation walkthrough between research tabs. The market page already supplies the chapter path and its own investment view; the original remains reachable."},
  {"market": "pl", "section": "story", "card": "Bridge to the detailed dashboard", "routed": true, "suggest": "Keep in the research tabs only", "reason": "A question map linking to the detailed research tabs. Chapter disclosures now provide those routes on the market page; the original links stay in their tab."},
  {"market": "pjm", "section": "benchmark", "card": "How the contracted line is produced, market by market", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "pjm", "section": "benchmark", "card": "Where PJM sits on the two things it is worst at", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ercot", "section": "benchmark", "card": "The two bargains, side by side", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "ercot", "section": "benchmark", "card": "What that means for an allocation", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "caiso", "section": "benchmark", "card": "The three bargains", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "caiso", "section": "benchmark", "card": "What the federal layer does not differentiate", "routed": false, "suggest": "Keep unrouted until reviewed; consider the relevant market-background or financing chapter", "reason": "This comparison has no research tab today. Showing it in a chapter would be a new publication, not a relocation; the analyst must decide its destination or deletion."},
  {"market": "wa", "section": "home", "card": "#tab-home", "routed": true, "suggest": "Keep the whole overview in the research tabs", "reason": "The hand-written overview combines navigation, signals and a house view already present on the market page. It is preserved rather than split into copied cards."},
  {"market": "wa", "section": "portfolio", "card": "#tab-portfolio", "routed": true, "suggest": "Keep the public withheld notice in its research tab", "reason": "The project-level portfolio is confidential. The context adapter never imports its renderer; the public tab and its withheld notice remain unchanged."},
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
 * @param owner    the dashboard that owns the research (Japan uses 'jp')
 * @param chapter  a key of CHAPTERS
 * @param slot     for `revenue-drivers`, one of SLOTS; null for research across them
 */
export function picksFor(owner, chapter, slot = null){
  if (!MARKET_MAPS[owner]) return [];
  const target = slot ? chapter + ':' + slot : chapter;
  return SECTION_ORDER.flatMap(section => {
    /* WA's hand-written names differ, and its unassigned overview/portfolio
       tabs have no contextual renderer. Do not emit an empty rest-pick for
       a whole tab excluded in full. The history-only dashboards have no case
       or entry section. A pick must name an existing public research unit. */
    if (owner === 'wa' ? ['home', 'portfolio', 'capacity', 'services', 'benchmark'].includes(section)
      : ['rcm', 'fcess'].includes(section)) return [];
    if (['ca_on', 'sa', 'es'].includes(owner) && ['case', 'entry'].includes(section)) return [];
    const mine = owned(owner, section);
    const cards = mine.filter(([, to]) => to.includes(target)).map(([phrase]) => phrase);
    const rest = DEFAULT_MAP[section] === target;
    if (!cards.length && !rest) return [];
    return [{ section, cards, rest, except: rest ? mine.map(([phrase]) => phrase) : [] }];
  });
}

/** Markets whose research is placed, by dashboard owner. */
export const mappedOwners = () => Object.keys(MARKET_MAPS);
