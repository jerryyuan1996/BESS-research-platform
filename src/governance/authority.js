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

  /** Canonical name for a deterministic metric whose inputs are all observed. */
  DERIVED_OBSERVED: 'derived-observed',

  /** A pathway or projection published by an official body, preserving its vintage and scenario. */
  OFFICIAL_FORECAST: 'official-forecast',

  /** A forward series approved by the analyst; automation may recompute but not redefine it. */
  ANALYST_SCENARIO: 'analyst-scenario',

  /** Synthetic data used only to demonstrate a component; never an investment input. */
  ILLUSTRATIVE_SEED: 'illustrative-seed',

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
export const MACHINE_WRITABLE = new Set([
  AUTHORITY.OBSERVED,
  AUTHORITY.DERIVED,
  AUTHORITY.DERIVED_OBSERVED,
  AUTHORITY.OFFICIAL_FORECAST,
]);

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

  /* ---- capital structure -------------------------------------------------
     The component stack is ANALYST rather than DERIVED even though it is
     currently generated from a share model. The shares are a placeholder for
     evidence that does not exist yet (gate G24), and the moment a market gets a
     real component quotation it will be written here directly — classifying it
     DERIVED would say the platform can recompute it, which it cannot.

     A statutory VAT rate is a public fact and it is still ANALYST here, which
     looks wrong for a second and then does not: the comparison interface is not
     a machine-writable surface at all. The ETL writes to `public/data/public/`
     and nowhere else, so a field's class in this table says who may propose a
     change to it, not whether the underlying number is observable. Whether VAT
     is recoverable, and how long the refund takes, are positions on a project's
     tax structuring and would be analyst judgements in any case. */
  'economics.capexStack.dcBlockPerKWh': AUTHORITY.ANALYST,
  'economics.capexStack.pcsPerMW': AUTHORITY.ANALYST,
  'economics.capexStack.transformerHvPerMW': AUTHORITY.ANALYST,
  'economics.capexStack.bopPerMW': AUTHORITY.ANALYST,
  'economics.capexStack.bopPerKWh': AUTHORITY.ANALYST,
  'economics.capexStack.epcPct': AUTHORITY.ANALYST,
  'economics.capexStack.connectionFeePerMW': AUTHORITY.ANALYST,
  'economics.capexStack.dutyPct': AUTHORITY.ANALYST,
  'economics.capexStack.otherPerMW': AUTHORITY.ANALYST,

  'economics.vatPct': AUTHORITY.ANALYST,
  'economics.vatRecoverable': AUTHORITY.ANALYST,
  'economics.vatLagMonths': AUTHORITY.ANALYST,

  /* Development cost and the premium paid over it are the two inputs on this
     platform with no public counterpart anywhere — an RTB trade is a private
     bilateral. They are ANALYST by necessity, not by preference. Gate G25. */
  'economics.devCostPct': AUTHORITY.ANALYST,
  'economics.rtbPremiumPct': AUTHORITY.ANALYST,

  /* Build programme. Observable in principle from a proponent's own schedule,
     but what the model needs is the programme for the archetype rather than for
     any one project, so it stays a judgement. */
  'economics.constructionMonths': AUTHORITY.ANALYST,

  // Capacity revenue. Auction clearing prices and de-rating factors are
  // published, so drift here is evidence-backed and proposable.
  //
  // `contracted` is now DERIVED from `capacity` in every market that declares
  // one — it stays ANALYST because a market may still assert it directly, and
  // because failing open on a revenue line would be the wrong default. What
  // changed is that the two things that actually move are separately visible:
  // Poland's clearing price rose 76% while its de-rating factor fell 79%, and a
  // fused number could report neither.
  'economics.contracted': AUTHORITY.ANALYST,
  'economics.contractYears': AUTHORITY.ANALYST,
  'economics.securedContracted': AUTHORITY.ANALYST,
  'economics.securedContractYears': AUTHORITY.ANALYST,

  // The capacity line's components. A clearing price is published by the
  // auction body; a de-rating factor is published alongside it. Both are exactly
  // the kind of observation the ETL exists to notice.
  'economics.capacity.price': AUTHORITY.ANALYST,
  'economics.capacity.derating': AUTHORITY.ANALYST,
  'economics.capacity.fxToMarket': AUTHORITY.ANALYST,
  'economics.capacity.deliveryYear': AUTHORITY.ANALYST,
  // Which auction a price came from, and what units it is in, describe the
  // observation rather than being one.
  'economics.capacity.unit': AUTHORITY.CONFIG,
  'economics.capacity.priceCurrency': AUTHORITY.CONFIG,
  'economics.capacity.auction': AUTHORITY.METHODOLOGY,
  'economics.capacity.source': AUTHORITY.METHODOLOGY,
  'economics.capacity.note': AUTHORITY.METHODOLOGY,

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

  // How a toll interacts with the rest of the stack is a reading of the deal
  // structure, not a term. Drax/Fidra leaves Capacity Market revenue with the
  // owner; whether that generalises to "the GB toll" is a judgement.
  'economics.tollAdditiveWithCapacity': AUTHORITY.METHODOLOGY,
  'economics.tollRevertsToMerchant': AUTHORITY.METHODOLOGY,

  // The services decay curve. Not an assumption about a value — an assumption
  // about a REGIME, calibrated on another market's history. No feed implies it,
  // and no observation of today's DS3 rate settles what FASS will clear at, so
  // automation may neither write nor propose it. It is a forward case a human
  // approved: ANALYST_SCENARIO is exactly that class.
  'economics.servicesCurve': AUTHORITY.ANALYST_SCENARIO,
  'economics.servicesNote': AUTHORITY.METHODOLOGY,

  // Network-access haircut. What is lost when a market's access regime
  // deprioritises you. Observable in principle from constraint data, which is
  // why it is proposable rather than methodology.
  'economics.naqFactor': AUTHORITY.ANALYST,

  // Long-term award. The payment is a bid into a pay-as-bid auction that does
  // not publish clearing prices, so it is an assumption informed by a published
  // ceiling; the tenor and the clawback are rules, but reading the clawback as a
  // retention fraction is a modelling decision.
  'economics.ltda.payment': AUTHORITY.ANALYST,
  'economics.ltda.years': AUTHORITY.ANALYST,
  'economics.ltda.merchantRetention': AUTHORITY.METHODOLOGY,
  'economics.ltda.note': AUTHORITY.METHODOLOGY,
  /* What the award pays after its term ends, and whether a capital grant may be
     stacked on top of a competitively bid award. Both are modelling positions
     rather than published scheme parameters. */
  'economics.ltda.postFactor': AUTHORITY.METHODOLOGY,
  'economics.ltda.excludesGrant': AUTHORITY.METHODOLOGY,
  /* An eligibility rule the scheme publishes, where it has one. */
  'economics.ltda.minDurationHours': AUTHORITY.ANALYST,

  // Policy-set, therefore observable in principle.
  'economics.grantPct': AUTHORITY.ANALYST,
  'economics.grantCapPerMWh': AUTHORITY.ANALYST,
  'economics.grantCapAbsolute': AUTHORITY.ANALYST,

  // Degradation is a warranty/engineering assumption, not a market observation.
  'economics.degr': AUTHORITY.METHODOLOGY,

  // The renewal curve is by construction "assumed, not won" — see the engine's
  // auction-renewal model. Automating it would automate exactly the speculation
  // the three-class split was built to keep visible.
  'economics.auctionRenewalCurve': AUTHORITY.METHODOLOGY,
  'economics.riskClass': AUTHORITY.METHODOLOGY,

  /* ---- what the renewal curve is made of ---------------------------------
     The curve above is a blended number and stays METHODOLOGY. Its components
     do not all belong in one class, and that is the reason for decomposing it.

     The SECURED year is a cleared auction. Its clearing price and its
     accreditation factor are both published by the auction body — PJM posts the
     RPM result and the ELCC class ratings as separate documents — so they are
     exactly the kind of observation the ETL exists to notice, and they are
     proposable. The payment is their product and moves only when they do.

     The ASSUMED years are not. They are a forward path a human approved, with no
     observable counterpart until each auction actually runs, which is precisely
     what ANALYST_SCENARIO is for: automation may recompute the payment when the
     approved price and accreditation paths change, but may not redefine the
     paths. A machine has no standing to argue what PJM clears at in 2034. */
  'economics.auctionRenewalScenario.securedYear.price': AUTHORITY.ANALYST,
  'economics.auctionRenewalScenario.securedYear.accreditation': AUTHORITY.ANALYST,
  'economics.auctionRenewalScenario.securedYear.paymentPerMWYr': AUTHORITY.ANALYST,
  'economics.auctionRenewalScenario.securedYear.deliveryYear': AUTHORITY.CONFIG,
  'economics.auctionRenewalScenario.securedYear.priceUnit': AUTHORITY.CONFIG,
  // Whether the year cleared is a fact about the world, but it is the structural
  // claim the whole split rests on, so it is not machine-touchable.
  'economics.auctionRenewalScenario.securedYear.cleared': AUTHORITY.METHODOLOGY,

  'economics.auctionRenewalScenario.years': AUTHORITY.ANALYST_SCENARIO,
  'economics.auctionRenewalScenario.basis': AUTHORITY.METHODOLOGY,
  'economics.auctionRenewalScenario.source': AUTHORITY.METHODOLOGY,
  'economics.auctionRenewalScenario.gate': AUTHORITY.METHODOLOGY,

  // Qualitative notes attached to revenue lines.
  'economics.capNote': AUTHORITY.METHODOLOGY,
  'economics.tollNote': AUTHORITY.METHODOLOGY,
  'economics.grantNote': AUTHORITY.METHODOLOGY,

  /* ---- the merchant vintage ------------------------------------------------
     Which year both merchant legs are priced at, and the three cases at that
     year. See src/comparison/vintage.js.

     The year itself is METHODOLOGY, not an observation: it follows from how the
     base route covers merchant exposure, and no feed implies it. The three cases
     are ANALYST_SCENARIO — forward views a human approved, which automation may
     recompute when the approved inputs move but may not redefine. That is the
     same class the services decay curve carries, for the same reason.

     Note that the base case is the published seed and the outer cases are the
     band endpoints; classifying them here does not create a second writable copy
     of those numbers, because vintage.js derives them rather than restating them. */
  'merchantVintage.year': AUTHORITY.METHODOLOGY,
  'merchantVintage.basis': AUTHORITY.METHODOLOGY,
  'merchantVintage.cases.downside.merchGross': AUTHORITY.ANALYST_SCENARIO,
  'merchantVintage.cases.downside.services': AUTHORITY.ANALYST_SCENARIO,
  'merchantVintage.cases.base.merchGross': AUTHORITY.ANALYST_SCENARIO,
  'merchantVintage.cases.base.services': AUTHORITY.ANALYST_SCENARIO,
  'merchantVintage.cases.upside.merchGross': AUTHORITY.ANALYST_SCENARIO,
  'merchantVintage.cases.upside.services': AUTHORITY.ANALYST_SCENARIO,

  // ---- narrative: the investment thesis ------------------------------------
  'narrative.archetype': AUTHORITY.METHODOLOGY,
  'narrative.thesis': AUTHORITY.METHODOLOGY,
  'narrative.pipelineRatio': AUTHORITY.ANALYST,

  // ---- engine participation ------------------------------------------------
  // Whether a market's inputs are complete enough to publish a number is an
  // analyst's call about data quality, not a threshold a script should trip.
  'engineReady': AUTHORITY.METHODOLOGY,

  // Which route a market is PRESENTED under. Japan moving from the annual
  // capacity auction to the long-term award is the house view on what a
  // Japanese battery is, and no observation settles it.
  'baseStrategy': AUTHORITY.METHODOLOGY,
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

  /* Sponsor underwriting position (src/comparison/sponsorAssumptions.js).

     Both are METHODOLOGY, and the reasoning is the same one that puts the exit
     yields there: no feed observes them. The OEM multiplier is a negotiated
     buying position and the discount delta is a view on the cost of capital —
     neither is a published series, and both move every IRR the platform prints,
     on the cockpit and on all twelve dashboards. An ETL that could propose
     against these could restate the entire house position overnight. */
  OEM_CAPEX_MULTIPLIER: AUTHORITY.METHODOLOGY,
  SPONSOR_DISCOUNT_DELTA_PP: AUTHORITY.METHODOLOGY,
};

/* ---------------------------------------------------------------------------
   Ranges — the bounds the Investment Lab enforces.

   Classified by RULE rather than by enumeration, because every band has the same
   seven leaves and the same governance answer whichever field it bounds. Listing
   `ranges.capexPerMW.min` … `ranges.tollYears.gate` for eight markets would be a
   hundred lines that say one thing four times over.

   The answer itself:

     min / max   ANALYST. A bound is a claim about what the evidence supports.
                 Two auction clears moving is exactly the kind of observation the
                 ETL should be able to notice and propose against — the same
                 class the value it bounds already carries.

     seed        Inherits from the economics field it mirrors, and cannot be more
                 permissive than it. A band must never become a side door through
                 which automation writes a value it is not allowed to write.

     kind        METHODOLOGY. Whether a band counts as sourced or dispersed is an
     basis       argument about evidence, and `source` is a citation — the
     source      existing test in this suite says automation must not be able to
     gate        propose a change to one of those.
   --------------------------------------------------------------------------- */
const RANGE_LEAF_AUTHORITY = {
  min: AUTHORITY.ANALYST,
  max: AUTHORITY.ANALYST,
  kind: AUTHORITY.METHODOLOGY,
  basis: AUTHORITY.METHODOLOGY,
  source: AUTHORITY.METHODOLOGY,
  gate: AUTHORITY.METHODOLOGY,
};

/** Resolves a `ranges.<field>.<leaf>` path, or null when the path is not one. */
function rangeAuthority(path){
  if (!path.startsWith('ranges.')) return null;
  const rest = path.slice('ranges.'.length);
  const cut = rest.lastIndexOf('.');
  if (cut < 0) return null;
  const field = rest.slice(0, cut);            // may itself be dotted: `ltda.payment`
  const leaf = rest.slice(cut + 1);
  if (leaf === 'seed') return COMPARISON_AUTHORITY['economics.' + field] ?? AUTHORITY.METHODOLOGY;
  return RANGE_LEAF_AUTHORITY[leaf] ?? null;
}

/* IC review metadata is a human-owned decision overlay. It is deliberately
   classified as one restrictive subtree: automation may read and recompute from
   it, but may neither publish nor propose changes to review conclusions,
   evidence labels, gates or contract-risk judgements. */
function refinementAuthority(path){
  return path.startsWith('refinement.') ? AUTHORITY.METHODOLOGY : null;
}
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
  return COMPARISON_AUTHORITY[path] ?? rangeAuthority(path) ?? refinementAuthority(path) ?? AUTHORITY.METHODOLOGY;
}

/**
 * Has this path been classified deliberately, rather than falling through to the
 * fail-closed default? The suite asserts this over every field of every market,
 * so a new comparison field cannot be added without someone deciding who owns it.
 */
export function isClassified(path){
  return (path in COMPARISON_AUTHORITY) || rangeAuthority(path) != null || refinementAuthority(path) != null;
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
  [AUTHORITY.DERIVED_OBSERVED]: ['Derived-observed — deterministic calculation from official data', '观察衍生 — 基于官方数据的确定性计算'],
  [AUTHORITY.OFFICIAL_FORECAST]: ['Official forecast — source pathway and vintage preserved', '官方预测 — 保留来源情景与版本'],
  [AUTHORITY.ANALYST_SCENARIO]: ['Analyst scenario — human-approved forward case', '分析师情景 — 人工批准的前瞻情景'],
  [AUTHORITY.ILLUSTRATIVE_SEED]: ['Illustrative — excluded from investment metrics', '示例数据 — 不计入投资指标'],
  [AUTHORITY.ANALYST]: ['Analyst assumption — automation may propose, not change', '分析师假设 — 自动化仅可建议，不可更改'],
  [AUTHORITY.METHODOLOGY]: ['Analyst methodology — human-set only', '分析师方法论 — 仅由人工设定'],
  [AUTHORITY.CONFIG]: ['Configuration', '配置'],
};
