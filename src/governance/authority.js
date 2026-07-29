/* ---------------------------------------------------------------------------
   AUTHORITY — who is allowed to change what.

   This file is the single definition of the boundary between automation and
   analyst judgement. Nothing else in the codebase may decide that a value is
   machine-writable; everything asks here.

   The rule, stated once:

     Observed public data and deterministic derived metrics publish
     automatically after validation. Model outputs recompute automatically using
     the currently APPROVED methodology and assumptions. Automation never
     directly modifies analyst-controlled assumptions, scoring methodology,
     qualitative conclusions, investment thesis, market status or house view.
     Material drift opens an evidence-backed pull request. A human merges it, or
     does not.

   Five classes, not two. The distinction that matters most is ANALYST vs
   METHODOLOGY: automation may *propose* a change to an analyst assumption,
   because an observation exists that bears on it. It may not propose a change to
   methodology at all, because no observation implies a discount rate or a
   scoring weight — those are positions, and a machine has no standing to argue
   one.

   Layering: this module imports only schema and assumption constants. No DOM, no
   market module, no ETL code. Both the browser app and the Node ETL import it,
   which is the point — one definition, enforced on both sides.
   --------------------------------------------------------------------------- */

/**
 * Authority classes, ordered from most to least machine-writable.
 */
export const AUTHORITY = {
  /** Fetched from a public source. Machine writes freely; publishes after validation. */
  OBSERVED: 'observed',

  /** Deterministic function of observed data. Machine computes; publishes after validation. */
  DERIVED: 'derived',

  /**
   * An analyst-set assumption that a public observation bears on.
   * Machine may PROPOSE a change with evidence. Machine may never apply one.
   */
  ANALYST: 'analyst',

  /**
   * Methodology, scoring, conclusions, thesis, house view.
   * Machine may not write and may not propose. There is no observation that
   * settles these, so an automated proposal would be a machine opinion.
   */
  METHODOLOGY: 'methodology',

  /** Identity and presentation: ids, slugs, flags, colours, locales. Human-set, not a judgement. */
  CONFIG: 'config',
};

/** Classes automation is permitted to write directly. */
export const MACHINE_WRITABLE = new Set([AUTHORITY.OBSERVED, AUTHORITY.DERIVED]);

/** Classes automation may raise a pull request against. */
export const MACHINE_PROPOSABLE = new Set([AUTHORITY.ANALYST]);

/**
 * Every field of the market comparison interface, classified.
 *
 * Keyed by the dotted path within a market's `comparison` object. The registry
 * is exhaustive by test: tests/governance.test.js asserts that every key present
 * in every market's comparison interface appears here, so a new field cannot
 * reach production unclassified. Add the field here in the same commit that adds
 * it to a market, and think about which class it belongs to — that is the whole
 * mechanism.
 */
export const COMPARISON_AUTHORITY = {
  // ---- archetype: the modelled reference asset -----------------------------
  // A choice of what to model, not an observation of the market.
  'archetype.powerMW': AUTHORITY.METHODOLOGY,
  'archetype.durationHours': AUTHORITY.METHODOLOGY,

  // ---- score: the scoring methodology --------------------------------------
  // Explicitly out of automation's reach, including proposals.
  'score.composite': AUTHORITY.METHODOLOGY,
  'score.connectionRisk': AUTHORITY.METHODOLOGY,

  // ---- capabilities: what mechanisms this market offers --------------------
  // Reads like a fact but is not one. "Tolling precedent exists in GB" is a
  // judgement about whether observed deals establish a precedent worth modelling.
  'capabilities.capacityMarket': AUTHORITY.ANALYST,
  'capabilities.merchant': AUTHORITY.ANALYST,
  'capabilities.ancillaryServices': AUTHORITY.ANALYST,
  'capabilities.tolling': AUTHORITY.ANALYST,
  'capabilities.longTermAward': AUTHORITY.ANALYST,

  // ---- economics: assumptions, several with public observable counterparts --
  'economics.capexPerMW': AUTHORITY.ANALYST,
  'economics.opexPerMW': AUTHORITY.ANALYST,

  // Capacity revenue. Auction clearing prices and de-rating factors are
  // published, so drift here is evidence-backed and proposable.
  'economics.contracted': AUTHORITY.ANALYST,
  'economics.contractYears': AUTHORITY.ANALYST,
  'economics.securedContracted': AUTHORITY.ANALYST,
  'economics.securedContractYears': AUTHORITY.ANALYST,

  // The step-down after contract expiry is a forward assumption with no
  // observable counterpart — nobody publishes what a battery earns in year 16.
  'economics.postFactor': AUTHORITY.METHODOLOGY,

  // Merchant revenue. Wholesale price series are observable; the translation
  // into an achieved annual figure is an assumption informed by them.
  'economics.merchGross': AUTHORITY.ANALYST,
  'economics.merchantNetOfFee': AUTHORITY.ANALYST,
  'economics.services': AUTHORITY.ANALYST,

  // Commercial terms. Not published anywhere; a machine cannot observe them.
  'economics.feePct': AUTHORITY.ANALYST,
  'economics.toll': AUTHORITY.ANALYST,
  'economics.tollYears': AUTHORITY.ANALYST,

  // Policy-set, therefore observable in principle.
  'economics.grantPct': AUTHORITY.ANALYST,

  // Degradation is a warranty/engineering assumption, not a market observation.
  'economics.degr': AUTHORITY.METHODOLOGY,

  // The renewal curve is by construction "assumed, not won" — see the engine's
  // auction-renewal model. Automating it would automate exactly the speculation
  // the three-class split was built to keep visible.
  'economics.auctionRenewalCurve': AUTHORITY.METHODOLOGY,
  'economics.riskClass': AUTHORITY.METHODOLOGY,

  // Qualitative notes attached to revenue lines.
  'economics.capNote': AUTHORITY.METHODOLOGY,
  'economics.tollNote': AUTHORITY.METHODOLOGY,
  'economics.grantNote': AUTHORITY.METHODOLOGY,

  // ---- narrative: the investment thesis ------------------------------------
  'narrative.archetype': AUTHORITY.METHODOLOGY,
  'narrative.thesis': AUTHORITY.METHODOLOGY,
  'narrative.pipelineRatio': AUTHORITY.ANALYST,

  // ---- engine participation ------------------------------------------------
  // Whether a market's inputs are complete enough to publish a number is an
  // analyst's call about data quality, not a threshold a script should trip.
  'engineReady': AUTHORITY.METHODOLOGY,
};

/**
 * Manifest fields, classified.
 *
 * `status` is the house view — the investment stance chip. It is the single most
 * judgement-laden field in the manifest and automation must never touch it.
 *
 * The freshness fields (`asOf`, `dataDate`, `lastVerified`, `sourceHealth`)
 * describe the SEED data and stay human-written. Live freshness is not recorded
 * here at all: it lives in each snapshot's provenance envelope, which the UI
 * reads directly. That keeps the wall absolute — the ETL never needs write
 * access to src/ even for its own metadata.
 */
export const MANIFEST_AUTHORITY = {
  id: AUTHORITY.CONFIG,
  slug: AUTHORITY.CONFIG,
  flag: AUTHORITY.CONFIG,
  shortName: AUTHORITY.CONFIG,
  name: AUTHORITY.CONFIG,
  currency: AUTHORITY.CONFIG,
  currencySymbol: AUTHORITY.CONFIG,
  locale: AUTHORITY.CONFIG,
  timezone: AUTHORITY.CONFIG,
  color: AUTHORITY.CONFIG,
  dashboardId: AUTHORITY.CONFIG,
  region: AUTHORITY.CONFIG,

  status: AUTHORITY.METHODOLOGY,        // house view
  modelVersion: AUTHORITY.METHODOLOGY,

  asOf: AUTHORITY.ANALYST,
  dataDate: AUTHORITY.ANALYST,
  lastVerified: AUTHORITY.ANALYST,
  sourceHealth: AUTHORITY.ANALYST,
};

/**
 * Global normalization assumptions, classified.
 *
 * FX is the one genuinely observable entry: ECB publishes reference rates daily.
 * It is still ANALYST rather than OBSERVED, and that is deliberate. The rate the
 * engine uses is the rate the analyst approved; the live rate is published
 * alongside it as an observation. Letting a daily rate silently move every
 * published IRR would mean the site said something different each morning with
 * no one having decided it should.
 *
 * The exit yields and life are methodology. No feed implies a discount rate.
 */
export const ASSUMPTION_AUTHORITY = {
  'FX.AUD': AUTHORITY.ANALYST,
  'FX.GBP': AUTHORITY.ANALYST,
  'FX.EUR': AUTHORITY.ANALYST,
  'FX.JPY': AUTHORITY.ANALYST,
  FX_SEED_DATE: AUTHORITY.ANALYST,

  LIFE: AUTHORITY.METHODOLOGY,
  EXIT_Y_CONTRACTED: AUTHORITY.METHODOLOGY,
  EXIT_Y_MERCHANT: AUTHORITY.METHODOLOGY,
  EXIT_Y_OPEX: AUTHORITY.METHODOLOGY,
  EXIT_Y_AUCTION: AUTHORITY.METHODOLOGY,
  UNLEVERED: AUTHORITY.METHODOLOGY,
  EXIT_YEARS: AUTHORITY.CONFIG,
  FX_NOTE: AUTHORITY.METHODOLOGY,
};

/* ---------------------------------------------------------------------------
   Queries. Callers ask these rather than reading the tables directly, so the
   default for an unrecognised path is safe rather than permissive.
   --------------------------------------------------------------------------- */

/**
 * Authority for a dotted path within a market comparison interface.
 * An unknown path is treated as METHODOLOGY — the most restrictive class — so
 * that forgetting to classify a new field fails closed rather than open.
 */
export function comparisonAuthority(path){
  return COMPARISON_AUTHORITY[path] ?? AUTHORITY.METHODOLOGY;
}

/** Authority for a manifest field. Unknown fields fail closed. */
export function manifestAuthority(field){
  return MANIFEST_AUTHORITY[field] ?? AUTHORITY.METHODOLOGY;
}

/** Authority for a global assumption. Unknown keys fail closed. */
export function assumptionAuthority(key){
  return ASSUMPTION_AUTHORITY[key] ?? AUTHORITY.METHODOLOGY;
}

/** May automation write this value directly, with no human in the loop? */
export function canMachineWrite(authority){
  return MACHINE_WRITABLE.has(authority);
}

/** May automation open a pull request proposing a change to this value? */
export function canMachinePropose(authority){
  return MACHINE_PROPOSABLE.has(authority);
}

/**
 * Human-readable explanation of a class. Rendered in the UI next to a value and
 * in the drift report, so a reader can always tell who set what they are
 * looking at.
 */
export const AUTHORITY_LABEL = {
  [AUTHORITY.OBSERVED]: ['Observed — fetched from a public source', '实测 — 取自公开来源'],
  [AUTHORITY.DERIVED]: ['Derived — computed from observed data', '衍生 — 由实测数据计算'],
  [AUTHORITY.ANALYST]: ['Analyst assumption — automation may propose, not change', '分析师假设 — 自动化仅可建议，不可更改'],
  [AUTHORITY.METHODOLOGY]: ['Analyst methodology — human-set only', '分析师方法论 — 仅由人工设定'],
  [AUTHORITY.CONFIG]: ['Configuration', '配置'],
};
