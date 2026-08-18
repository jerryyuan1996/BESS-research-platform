/* ---------------------------------------------------------------------------
   The market-module contract.

   Standardize only what must be standardized (brief section 22):

     STANDARDIZED            identity, routing, metadata, comparison interface,
                             sources interface, component contracts
     MARKET-SPECIFIC         detailed sections, mechanisms, regulations, revenue
                             structures, investment labs, country metrics

   There is deliberately no universal detailed-dashboard schema. WA's RCM engine,
   Ireland's Reliability Option and Poland's 17-year contract do not fit one
   shape, and forcing them to would be the wrong abstraction.

   A market module's default export:

     {
       manifest,      // identity + metadata          (required)
       comparison,    // normalized comparison inputs (required for home-page participation)
       sources,       // source register              (optional)
       tabs,          // [[id, [en, zh]], ...]        (optional)
       dashboard,     // (container, market) => void  (optional)
     }

   A market with manifest + comparison but no dashboard still appears everywhere
   on the home page; its route renders a "pending migration" page.
   --------------------------------------------------------------------------- */

/** Fields every manifest must define. */
export const REQUIRED_MANIFEST_FIELDS = [
  'id',          // stable short key, lowercase, used in results and tests
  'slug',        // URL segment: /markets/<slug>
  'flag',        // emoji shown in cards, nav and tables
  'shortName',   // [en, zh] — table headers, nav, chart axes
  'name',        // [en, zh] — card titles, page titles
  'currency',    // ISO 4217; must have an FX rate in comparison/assumptions.js
  'locale',      // BCP-47, for that market's own number formatting
  'status',      // [en, zh] — investment stance chip
  'color',       // CSS colour for this market's series
];

/** Freshness metadata (brief section 21). Optional, but the shape is fixed. */
export const METADATA_FIELDS = [
  'asOf',          // date the seed snapshot was verified
  'dataDate',      // period the underlying data covers
  'modelVersion',  // the market's own model version string
  'sourceHealth',  // [en, zh] — plain description of ingestion status
  'lastVerified',  // date public sources were last re-checked
  'timezone',      // IANA zone, for timestamped series
];

/**
 * The reader-facing definition of what `capacityMarket` actually asserts.
 *
 * The key is narrower than its name, and the gap matters. "Does this market have
 * a capacity market" is not the question — several markets have arrangements
 * that answer yes while paying a merchant battery nothing for adequacy. Finland
 * is the clearest case: a statutory peak-load arrangement, and a TSO that calls
 * its FFR/FCR/aFRR/mFRR procurement capacity markets, with no accredited
 * adequacy payment a battery can bank.
 *
 * Note what is deliberately absent: any claim about duration. PJM's Base
 * Residual Auction clears ONE DELIVERY YEAR at a time, so a definition built on
 * "long-term" would mislabel the largest capacity market on this platform.
 * Tenor is reported separately, from `contractYears` — or from
 * `securedContractYears` where `riskClass` is 'auction-renewal', which is how
 * PJM carries it and why a label reading only the former would render its
 * one-year commitment as blank.
 *
 * The internal key keeps its name so no market module, fixture or test moves.
 */
export const RESOURCE_ADEQUACY_DEFINITION = [
  'Payment for accredited availability or resource adequacy, excluding operating-reserve markets. Contract duration is reported separately.',
  '为已核定的可用容量或容量充裕度支付的收入，不含运行备用市场。合约期限单独列示。',
];

/** The reader-facing name for the `capacityMarket` capability. */
export const RESOURCE_ADEQUACY_LABEL = ['Resource adequacy revenue', '容量充裕度收入'];

/** Capability flags. Absent or false means "this market does not have it". */
export const CAPABILITY_FLAGS = [
  'capacityMarket',     // resource adequacy revenue — see RESOURCE_ADEQUACY_DEFINITION
  'merchant',           // exposure to wholesale energy spreads
  'ancillaryServices',  // system-service revenue
  'tolling',            // a tolling or floor structure with market precedent
  'longTermAward',      // a representative long-term fixed award scenario is loaded
];

/**
 * Revenue risk classes.
 *
 *   (unset)          contracted line for contractYears, then postFactor.
 *                    Every pre-Japan market. Formulas frozen.
 *   auction-renewal  capacity revenue is won one delivery period at a time.
 *                    Secured years and assumed renewal years are separate streams
 *                    and are priced at different exit yields.
 */
export const RISK_CLASSES = [undefined, 'auction-renewal'];

/* ---------------------------------------------------------------------------
   THE AUCTION-RENEWAL SCENARIO.

   `auctionRenewalCurve` is a bare array of payments, and a bare array hides the
   argument. Two different markets can produce the same number from opposite
   stories — a rising clearing price against a falling accreditation, or the
   reverse — and a reader cannot tell which, or disagree with either half.

   So a market that carries a renewal curve must also declare what each year is
   MADE of. One entry per curve year, each naming the delivery year, the assumed
   clearing price in that auction's own unit, the assumed accreditation applied
   to it, and the payment those two produce — which must be the curve value, so
   the arithmetic cannot drift away from the assumptions that justify it.

   `cleared` is false on every scenario entry, by construction. A cleared auction
   is a SECURED year and belongs in `securedContracted`; anything in the curve is
   an analyst scenario and is labelled as one wherever it renders.

   What this deliberately does NOT require is a shape. PJM's renewal rises above
   its secured year before it falls, because the price collar lifts in 2030/31
   while 4-hour storage accreditation erodes — and a rule that forced the curve
   to decline monotonically would have made that unstateable. The constraint is
   that every year is explained, not that every year is worse.

     securedYear   { deliveryYear, price, priceUnit, accreditation,
                     paymentPerMWYr, cleared: true }
     years[]       the same shape with cleared: false, one per curve entry
     basis         [en, zh] — why this path and not another
     source        what the price and accreditation assumptions are built from
     gate          the research gate that closes the weakest input
   --------------------------------------------------------------------------- */
export const RENEWAL_SCENARIO_YEAR_FIELDS = [
  'deliveryYear', 'price', 'priceUnit', 'accreditation', 'paymentPerMWYr', 'cleared',
];

/**
 * Multi-region markets.
 *
 * Several allocation points may share one research dashboard. Tokyo, Kyushu and
 * Hokkaido are three separate exposures for a portfolio — different price
 * formation, different grid, different saturation — but one national rulebook, so
 * duplicating the Capacity Market and balancing rules three times would be wrong.
 *
 *   dashboardId  which dashboard renders this market. Defaults to `id`.
 *   region       which regional lens that dashboard opens in.
 *
 * A market with `dashboardId !== id` contributes no dashboard of its own; the
 * owning module does. Only distinct dashboardIds count as detail dashboards.
 */
export const MULTI_REGION_FIELDS = ['dashboardId', 'region'];

/** Economics fields the engine reads, in native currency, per MW per year. */
/* ---------------------------------------------------------------------------
   UNAVAILABLE ECONOMICS, and why null rather than zero.

   A market can be registered before every revenue line can be evidenced.
   Finland is the case: its reserve income is the largest real line in the
   market and the one the evidence cannot yet size, so the platform declines to
   publish a level.

   The first attempt wrote `services: 0` and explained the refusal in prose. That
   is the wrong machine representation, and the reason is precise: prose says
   "unknown", the object says "zero", and every consumer reads the object. Zero
   is a CLAIM — it says this market earns nothing from reserves, which is false
   and is the sort of false that survives being copied into an export.

   So an unavailable field is `null`, and the market declares WHY in
   `economics.unavailable`, keyed by field. Validation accepts a null required
   field only when both hold: the market is `engineReady: false`, and the field
   is named in `unavailable`. A market cannot go unready-and-silent, and it
   cannot go engine-ready with a hole.

       economics: {
         services: null,
         unavailable: {
           services: ['why, in English', '中文说明'],
         },
       }

   tests/registry.test.js asserts that nothing computes on an unready market's
   economics while it is unready.
   --------------------------------------------------------------------------- */
export const UNAVAILABLE_REQUIRES_UNREADY = true;

export const ECONOMICS_FIELDS = {
  required: [
    'capexPerMW',       // all-in installed cost
    'opexPerMW',        // fixed operating cost
    'merchGross',       // gross merchant revenue before optimiser fee
    'feePct',           // optimiser fee, % of gross merchant
    'services',         // ancillary-service revenue
    'grantPct',         // capital grant, % of capex
    'degr',             // merchant degradation, %/yr
  ],
  capacityMarket: [
    'contracted',       // capacity revenue per MW per year
    'contractYears',    // contract tenor
    'postFactor',       // fraction of `contracted` earned after expiry
  ],
  // Replaces the three fields above when riskClass === 'auction-renewal'.
  capacityMarketAuctionRenewal: [
    'securedContracted',        // payment secured by an executed award, per MW per year
    'securedContractYears',     // how long that award actually covers
    'auctionRenewalCurve',      // assumed payments per year AFTER the secured period
    'auctionRenewalScenario',   // what those assumed payments are made of — see below
  ],
  tolling: [
    'toll',             // fixed toll per MW per year
    'tollYears',        // toll tenor
  ],
  optional: [
    'capNote',          // [en, zh] obligation attached to the capacity revenue
    'tollNote',
    'grantNote',
  ],
};

/** Everything a comparison interface must expose. */
export const COMPARISON_SHAPE = {
  archetype: ['powerMW', 'durationHours'],
  score: ['composite', 'connectionRisk'],
  narrative: ['archetype', 'thesis', 'pipelineRatio'],
  capabilities: CAPABILITY_FLAGS,
  economics: ECONOMICS_FIELDS,
  refinement: [
    'confidenceScore', 'consensus', 'currentUpdate', 'investmentGate',
    'revenueEvidence', 'pipeline', 'contractRisk',
  ],
};
