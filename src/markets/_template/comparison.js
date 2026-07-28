/* ---------------------------------------------------------------------------
   TEMPLATE — comparison interface.

   This is the ONLY thing the global comparison engine reads. Populate it and the
   market appears automatically in every home-page comparison: market cards, the
   league table, the revenue-anatomy chart, the $1M engine, the certainty frontier
   and the waterfall selector.

   The engine never scrapes your dashboard, your DOM, or your data files. If a
   number should influence the home page, it belongs here.

   ALL ECONOMICS ARE PER MW PER YEAR, IN THIS MARKET'S NATIVE CURRENCY.
   The engine converts to USD using the FX rate for manifest.currency.
   --------------------------------------------------------------------------- */

export const comparison = {
  /* The reference project this market is compared on. Every market is compared
     at its own archetype — that is the point of normalizing per MW and per MWh
     rather than comparing project totals. */
  archetype: {
    powerMW: 100,
    durationHours: 4,
  },

  /* Scores from this market's own dashboard. `composite` is shown for context
     only and is explicitly NOT rank-compared across markets — each market scores
     itself on its own basis. `connectionRisk` IS compared (lower is safer). */
  score: {
    composite: 0,          // 0-100
    connectionRisk: 0,     // 0-100, lower = safer
  },

  /* Capability flags decide which routes to market apply (brief section 10).
     A false flag means the strategy is genuinely unavailable — the engine returns
     "N/A" and the $1M engine omits the row. It never substitutes zero.

     Set a flag true ONLY if the corresponding economics fields are populated;
     validation enforces this. */
  capabilities: {
    capacityMarket: false,     // needs economics.contracted / contractYears / postFactor
    merchant: true,            // needs economics.merchGross / feePct
    ancillaryServices: false,  // needs economics.services
    tolling: false,            // needs economics.toll / tollYears
  },

  /* Optional: the route this market is presented under by default. If omitted,
     the engine uses capacity-backed where a capacity market exists, merchant
     otherwise — which is the prototype's rule. */
  // baseStrategy: 'cap',

  economics: {
    // --- always required ---
    capexPerMW: 0,             // all-in installed cost
    opexPerMW: 0,              // fixed operating cost per year
    merchGross: 0,             // GROSS merchant revenue, before the optimiser fee
    feePct: 0,                 // optimiser fee, % of gross merchant revenue
    services: 0,               // ancillary-service revenue (0 if none)
    grantPct: 0,               // capital grant as % of capex (0 if none)
    degr: 2,                   // merchant revenue degradation, %/yr

    // --- required when capabilities.capacityMarket is true ---
    contracted: 0,             // capacity revenue per MW per year, AFTER de-rating
    contractYears: 0,          // contract tenor in years
    postFactor: 0,             // fraction of `contracted` still earned after expiry (0-1)

    // --- required when capabilities.tolling is true ---
    // toll: 0,
    // tollYears: 15,

    // --- optional obligation notes, shown under the route name in the $1M engine ---
    // capNote:   ['Obligation attached to the capacity revenue', '容量收入附带的义务'],
    // tollNote:  ['Tenor / rollover assumption', '期限/续签假设'],
    // grantNote: ['Grant conditionality', '补贴条件'],
  },

  /* Prose shown on the market card and in the league table. Authored, not derived. */
  narrative: {
    archetype: ['100 MW · 4h · route-to-market', '100MW · 4小时 · 售电路径'],
    thesis: [
      'One or two sentences: what this market is, and what the risk actually is.',
      '一到两句话：该市场的本质，以及真实风险所在。',
    ],
    pipelineRatio: '~0×',      // pipeline-to-operating ratio, on this market's own basis
  },
};

export default comparison;
