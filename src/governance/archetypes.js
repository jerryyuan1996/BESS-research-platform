/* ---------------------------------------------------------------------------
   ARCHETYPES — four investors, and how each one reads the same market.

   DRAFT, AWAITING THE ANALYST'S EDIT. Every number in this file — each utility
   in a `reads` table, each dimension weight, each pillar weight, each limit,
   each cheque range and each score band — was drafted on 2026-10-10 from
   docs/investment-view-revision-plan-2026-10-10.md §3.4–§3.6 and has NOT been
   signed off. The plan gives one row of parameters per archetype and the
   developer's `reads` for grid scarcity and capital at risk; those are reused
   as the plan, amended the same day, now has them. EVERYTHING ELSE HERE IS A
   GUESS, there to be overwritten. Nothing in the application imports this
   module yet, so nothing here is published.

   THESE VALUES ARE METHODOLOGY. A weight is a position and a knock-out is a
   position; no observation implies either, so a machine has no standing to
   argue one. No ETL job, no rule and no agent may write or amend anything in
   this file. That is the analyst's decision of 2026-10-10 and it survives the
   plan's reversal of the automation rule: judgement may one day publish
   automatically, methodology never does.

   ---------------------------------------------------------------------------
   A GRADE DESCRIBES THE MARKET. AN ARCHETYPE IS HOW ONE INVESTOR READS IT.

   investability.js says what a 2 on grid scarcity IS. It says nothing about
   whether a 2 is good, because that has no single answer: a scarce connection
   is a wall to a first-time entrant, the thesis for a developer who can still
   secure one and protection for a fund that already owns one.

   So an archetype does not hold a weight per dimension and stop there. It holds
   a small table per dimension — `reads` — saying what each grade is worth to
   it, 0 to 100. The table may rise, fall, or peak in the middle. Nothing in
   this file may assume a higher grade reads better.

   ---------------------------------------------------------------------------
   A BARRIER IS A THRESHOLD, NOT A WEIGHT

   "Only large players can do this" cannot be expressed by a weighted average,
   because a strong return will always average the barrier away. So a barrier
   enters in one of two ways, and neither can be outvoted:

     KNOCK_OUT in `reads`   a GRADE this investor cannot live with
     `limits`               a FIGURE this investor will not exceed, compared
                            with the metric directly and never with the grade

   The second exists because the grade alone gets the important case wrong. A
   security that is a small share of a very large project grades better than a
   large share of a small one, and costs several times more in money. The share
   is in the grade; the money is in the metric; the limit is in money.

   Limits are tied to a ROUTE. Capital risked before the investment decision
   binds an investor that originates a project and does not bind one that buys
   it ready to build, which is how one market can be closed to a fund at
   origination and open to it as a co-investor.

   Layering: imports the vocabulary in investability.js and nothing else. No
   DOM, no market module, no ETL code.
   --------------------------------------------------------------------------- */

import {
  PILLARS, DIMENSIONS, DIMENSION_IDS, GRADED_BY, VERDICT, ROUTE, ARCHETYPE_IDS, dimension, dimensionsIn,
  effectiveGrade, sourcedOnly,
} from './investability.js';

/** What a `reads` table returns for a grade the investor cannot accept. */
export const KNOCK_OUT = 'knock-out';

/** What `ceiling` returns when a knock-out or a limit applies. The same word as the verdict. */
export const NOT_ACCESSIBLE = VERDICT.NOT_ACCESSIBLE;

const KO = KNOCK_OUT;

/* A reads table, written worst grade first so a row scans left to right the
   way the anchors are numbered: reads(grade 1, 2, 3, 4, 5). */
const reads = (g1, g2, g3, g4, g5) => Object.freeze({ 1: g1, 2: g2, 3: g3, 4: g4, 5: g5 });

/**
 * The figures a limit is compared with. All in USD or months, for the market's
 * reference project, supplied by the caller — this module converts nothing and
 * derives nothing.
 */
export const METRIC = {
  /** Non-refundable spend plus security posted before the investment decision. */
  PRE_FID_CAPITAL_USD: 'preFidCapitalUSD',
  /** The part of that which is security posted before consent is in hand. */
  SECURITY_BEFORE_CONSENT_USD: 'securityBeforeConsentUSD',
  /** Total cost of the reference project. */
  PROJECT_COST_USD: 'projectCostUSD',
  /** Months from a greenfield start to ready-to-build, at the midpoint of the range. */
  MONTHS_TO_RTB: 'monthsToReadyToBuild',
};

const ORIGINATION = ['greenfield'];
const WHOLE_PROJECT = ['greenfield', 'ready-to-build', 'operating'];

const M = 1e6;

export const ARCHETYPES = {
  /* -------------------------------------------------------------------------
     STRATEGIC. Holds the asset, so it reads hold IRR and cares most about
     whether the position can be built into a platform and whether the rules
     last. Money before the decision barely registers. Rationed grid capacity
     reads BEST: it can win the auction and the scarcity then protects it.
     ------------------------------------------------------------------------- */
  strategic: {
    id: 'strategic',
    label: ['Strategic', '战略投资者'],
    who: ['Utility, major IPP, state-backed sponsor', '公用事业公司、大型独立发电商、有国资背景的投资方'],
    entersAt: ['greenfield', 'ready-to-build', 'operating', 'co-invest'],
    defaultRoute: 'greenfield',
    returnBasis: 'hold-irr',
    returnReads: ['Hold IRR', '持有期IRR'],
    chequeUSD: [100 * M, 1000 * M],
    shutOutBy: ['An origin or ownership rule it cannot meet', '无法满足的原产地或股权规则'],
    pillarWeight: { return: 0.30, entry: 0.20, durability: 0.30, capital: 0.20 },
    weight: {
      assetReturn: 0.60, revenueCertainty: 0.40,
      capitalAtRisk: 0.05, approvalTransparency: 0.15, timeToRevenue: 0.15,
      gridScarcity: 0.30, foreignEntry: 0.15, supplyChainOrigin: 0.20,
      policyStability: 0.40, demandGrowth: 0.35, saturation: 0.25,
      debtAvailability: 0.15, exitLiquidity: 0.15, scaleRepeatability: 0.70,
    },
    reads: {
      assetReturn:          reads(10, 35, 60, 85, 100),
      revenueCertainty:     reads(30, 50, 70, 90, 100),
      capitalAtRisk:        reads(50, 70, 85, 95, 100),
      approvalTransparency: reads(20, 50, 75, 90, 100),
      timeToRevenue:        reads(30, 55, 75, 90, 100),
      gridScarcity:         reads(20, 70, 100, 80, 55),
      foreignEntry:         reads(KO, 45, 75, 90, 100),
      supplyChainOrigin:    reads(KO, 40, 70, 90, 100),
      policyStability:      reads(10, 40, 70, 90, 100),
      demandGrowth:         reads(15, 40, 65, 85, 100),
      saturation:           reads(10, 35, 65, 85, 100),
      debtAvailability:     reads(50, 65, 80, 90, 100),
      exitLiquidity:        reads(60, 70, 80, 90, 100),
      scaleRepeatability:   reads(5, 30, 60, 85, 100),
    },
    limits: [
      { id: 'pre-fid-capital', metric: METRIC.PRE_FID_CAPITAL_USD, max: 50 * M, routes: ORIGINATION,
        label: ['Capital risked before the investment decision', '最终投资决策前愿意承担的风险资本'] },
      { id: 'cheque', metric: METRIC.PROJECT_COST_USD, max: 1000 * M, routes: WHOLE_PROJECT,
        label: ['Largest single project it will fund', '愿意出资的单个项目上限'] },
    ],
  },

  /* -------------------------------------------------------------------------
     INFRASTRUCTURE FUND. Buys ready-to-build or operating, needs debt on the
     way in and a buyer on the way out, so the Capital pillar carries the most
     weight and a market with no debt at all is closed. Scarce grid reads well:
     it buys the connection rather than applying for one.
     ------------------------------------------------------------------------- */
  infraFund: {
    id: 'infraFund',
    label: ['Infrastructure fund', '基础设施基金'],
    who: ['Infrastructure or PE fund', '基础设施基金或私募股权基金'],
    entersAt: ['ready-to-build', 'operating', 'co-invest'],
    defaultRoute: 'ready-to-build',
    returnBasis: 'exit-irr',
    returnReads: ['Exit IRR and a levered check', '退出IRR，并以加杠杆后的回报复核'],
    chequeUSD: [30 * M, 300 * M],
    shutOutBy: ['No debt market; no secured revenue route', '没有债务融资市场；没有可锁定收入的途径'],
    pillarWeight: { return: 0.30, entry: 0.10, durability: 0.25, capital: 0.35 },
    weight: {
      assetReturn: 0.45, revenueCertainty: 0.55,
      capitalAtRisk: 0.05, approvalTransparency: 0.15, timeToRevenue: 0.10,
      gridScarcity: 0.30, foreignEntry: 0.20, supplyChainOrigin: 0.20,
      policyStability: 0.40, demandGrowth: 0.20, saturation: 0.40,
      debtAvailability: 0.45, exitLiquidity: 0.40, scaleRepeatability: 0.15,
    },
    reads: {
      assetReturn:          reads(5, 30, 60, 85, 100),
      /* Grade 1 is "no secured revenue route exists in the market", which is
         this investor's second shut-out. Grade 2 — the reference project is
         unsecured but a route exists — is a low score and not a knock-out:
         the fund can go and contract one. */
      revenueCertainty:     reads(KO, 35, 65, 90, 100),
      capitalAtRisk:        reads(40, 60, 80, 95, 100),
      approvalTransparency: reads(25, 50, 75, 90, 100),
      timeToRevenue:        reads(40, 60, 80, 90, 100),
      gridScarcity:         reads(70, 90, 100, 70, 45),
      foreignEntry:         reads(5, 40, 75, 92, 100),
      supplyChainOrigin:    reads(15, 45, 70, 90, 100),
      policyStability:      reads(5, 30, 65, 90, 100),
      demandGrowth:         reads(20, 45, 65, 85, 100),
      saturation:           reads(5, 30, 60, 85, 100),
      debtAvailability:     reads(KO, 25, 60, 85, 100),
      exitLiquidity:        reads(5, 30, 60, 85, 100),
      scaleRepeatability:   reads(30, 50, 70, 85, 100),
    },
    limits: [
      { id: 'pre-fid-capital', metric: METRIC.PRE_FID_CAPITAL_USD, max: 5 * M, routes: ORIGINATION,
        label: ['Capital risked before the investment decision', '最终投资决策前愿意承担的风险资本'] },
      { id: 'cheque', metric: METRIC.PROJECT_COST_USD, max: 300 * M, routes: WHOLE_PROJECT,
        label: ['Largest single project it will fund', '愿意出资的单个项目上限'] },
    ],
  },

  /* -------------------------------------------------------------------------
     FOREIGN FIRST-TIMER. First deal in the market and no local team, so Entry
     carries the most weight and every reading is the plain one: more open is
     better. What it cannot read it cannot enter — an unpublished process is a
     knock-out, not a low score, and so is a market that bars foreign control.
     ------------------------------------------------------------------------- */
  foreignFirstTimer: {
    id: 'foreignFirstTimer',
    label: ['Foreign first-timer', '首次进入的外资'],
    who: ['First deal in the market, no local team', '在该市场做第一单，没有本地团队'],
    entersAt: ['ready-to-build', 'operating', 'co-invest'],
    defaultRoute: 'ready-to-build',
    returnBasis: 'exit-irr',
    returnReads: ['Exit IRR', '退出IRR'],
    chequeUSD: [20 * M, 150 * M],
    shutOutBy: ['Uncertain screening; unpublished process; no partners', '审查结果不确定；流程不公开；找不到合作伙伴'],
    pillarWeight: { return: 0.25, entry: 0.35, durability: 0.20, capital: 0.20 },
    weight: {
      assetReturn: 0.50, revenueCertainty: 0.50,
      capitalAtRisk: 0.15, approvalTransparency: 0.25, timeToRevenue: 0.10,
      gridScarcity: 0.15, foreignEntry: 0.25, supplyChainOrigin: 0.10,
      policyStability: 0.45, demandGrowth: 0.20, saturation: 0.35,
      debtAvailability: 0.35, exitLiquidity: 0.50, scaleRepeatability: 0.15,
    },
    reads: {
      assetReturn:          reads(5, 30, 60, 85, 100),
      revenueCertainty:     reads(15, 40, 65, 88, 100),
      capitalAtRisk:        reads(5, 30, 60, 88, 100),
      approvalTransparency: reads(KO, 20, 55, 85, 100),
      timeToRevenue:        reads(15, 40, 65, 88, 100),
      gridScarcity:         reads(5, 30, 60, 85, 100),
      /* Grade 2 — screening with no statutory deadline or no published
         criteria — is NOT a knock-out. A discretionary test is common in mature
         markets and is a delay risk, not a closed door; only grade 1 closes it. */
      foreignEntry:         reads(KO, 15, 55, 85, 100),
      supplyChainOrigin:    reads(10, 40, 70, 90, 100),
      policyStability:      reads(5, 30, 60, 88, 100),
      demandGrowth:         reads(20, 45, 65, 85, 100),
      saturation:           reads(10, 35, 60, 85, 100),
      debtAvailability:     reads(10, 35, 65, 88, 100),
      exitLiquidity:        reads(5, 30, 60, 85, 100),
      scaleRepeatability:   reads(40, 55, 70, 85, 100),
    },
    limits: [
      { id: 'pre-fid-capital', metric: METRIC.PRE_FID_CAPITAL_USD, max: 3 * M, routes: ORIGINATION,
        label: ['Capital risked before the investment decision', '最终投资决策前愿意承担的风险资本'] },
      { id: 'cheque', metric: METRIC.PROJECT_COST_USD, max: 150 * M, routes: WHOLE_PROJECT,
        label: ['Largest single project it will fund', '愿意出资的单个项目上限'] },
    ],
  },

  /* -------------------------------------------------------------------------
     DEVELOPER. Early-stage capital that sells at ready-to-build, so Entry is
     nearly half the score and its return is what a buyer will pay for a
     consented, connected megawatt. Grid capacity that is rationed but
     obtainable is the best reading there is, and a market with none to be had
     is closed.

     Capital at risk carries NO knock-out, on purpose. The barrier is absolute,
     not relative: a large share of a small project can be money this investor
     has, and a small share of a large one can be money it does not. So the
     grade only scores, and the dollar limits below do the shutting out. The
     cost, accepted: grade 1 also covers security forfeitable on events the
     sponsor does not control, and that no longer closes a market by itself.
     ------------------------------------------------------------------------- */
  developer: {
    id: 'developer',
    label: ['Developer', '开发商'],
    who: ['Buys greenfield or ready-to-build projects, builds and sells at operation start', '收购绿地或可开工项目，建设至投运时出售'],
    entersAt: ['greenfield', 'ready-to-build'],
    defaultRoute: 'greenfield',
    returnBasis: 'development-multiple',
    returnReads: ['Build-to-operation return and time to operation', '建设至投运出售的回报与所需时间'],
    chequeUSD: null,   // no new cheque limit inferred from the expanded acquisition route
    shutOutBy: ['Security before consent above its limit; no obtainable connection; more than four years to ready-to-build',
                '取得许可前须提交的保证金超出其上限；拿不到并网容量；达到开工条件需四年以上'],
    pillarWeight: { return: 0.20, entry: 0.45, durability: 0.10, capital: 0.25 },
    weight: {
      assetReturn: 0.70, revenueCertainty: 0.30,
      capitalAtRisk: 0.25, approvalTransparency: 0.20, timeToRevenue: 0.20,
      gridScarcity: 0.25, foreignEntry: 0.05, supplyChainOrigin: 0.05,
      policyStability: 0.40, demandGrowth: 0.30, saturation: 0.30,
      debtAvailability: 0.10, exitLiquidity: 0.60, scaleRepeatability: 0.30,
    },
    reads: {
      assetReturn:          reads(10, 35, 60, 85, 100),
      revenueCertainty:     reads(20, 45, 65, 85, 100),
      capitalAtRisk:        reads(5, 20, 60, 90, 100),    // no knock-out: see above
      approvalTransparency: reads(5, 35, 65, 90, 100),
      timeToRevenue:        reads(5, 30, 60, 88, 100),
      gridScarcity:         reads(KO, 60, 100, 70, 40),   // plan §3.4, as written
      foreignEntry:         reads(30, 50, 75, 90, 100),
      supplyChainOrigin:    reads(30, 55, 75, 90, 100),
      policyStability:      reads(10, 35, 65, 88, 100),
      demandGrowth:         reads(20, 45, 65, 85, 100),
      saturation:           reads(15, 40, 65, 85, 100),
      debtAvailability:     reads(20, 45, 65, 85, 100),
      exitLiquidity:        reads(5, 25, 60, 88, 100),
      scaleRepeatability:   reads(10, 35, 65, 88, 100),
    },
    limits: [
      { id: 'pre-fid-capital', metric: METRIC.PRE_FID_CAPITAL_USD, max: 3 * M, routes: ORIGINATION,
        label: ['Capital risked on one project before the investment decision', '单个项目在最终投资决策前愿意承担的风险资本'] },
      { id: 'security-before-consent', metric: METRIC.SECURITY_BEFORE_CONSENT_USD, max: 3 * M, routes: ORIGINATION,
        label: ['Most security it will post before consent', '取得许可前愿意提交的保证金上限'] },
      { id: 'months-to-rtb', metric: METRIC.MONTHS_TO_RTB, max: 48, routes: ORIGINATION,
        label: ['Longest it will wait to reach ready-to-build', '达到开工条件愿意等待的最长时间'] },
    ],
  },
};

export function archetype(id){
  return ARCHETYPES[id] || null;
}

const resolve = (a) => {
  const found = typeof a === 'string' ? ARCHETYPES[a] : a;
  if (!found) throw new Error(`unknown archetype "${a}"`);
  return found;
};

/* A caller may hand over bare grades or whole grade records; both are read.
   Every grade is read through effectiveGrade, so a live held view is what is
   scored and a lapsed one is not. `on` is the evaluation date; it is needed
   only when a record carries a held layer, and effectiveGrade insists on it
   then. */
const gradeOf = (grades, dimensionId, on) => effectiveGrade(grades?.[dimensionId], on).grade;

/**
 * utility(a, d) = a.reads[d][ grade(d) ] — 0 to 100, or KNOCK_OUT.
 *
 * Null when the dimension has not been graded. Null is not zero and is not
 * treated as zero anywhere below: an ungraded dimension is unknown, and a score
 * that quietly skipped it would read as more certain than it is.
 */
export function utility(a, dimensionId, grades, on){
  const table = resolve(a).reads[dimensionId];
  if (!table) throw new Error(`${resolve(a).id}: no reads table for "${dimensionId}"`);
  const grade = gradeOf(grades, dimensionId, on);
  return grade === null ? null : table[grade];
}

/**
 * pillarScore(a, P) = Σ a.weight[d] · utility(a, d) / Σ a.weight[d], over the
 * dimensions in P.
 *
 * Null if any dimension in the pillar is ungraded — "not yet graded" is a
 * state the page shows, not a gap the arithmetic fills.
 *
 * A knock-out counts as ZERO here, so the score still says how the rest of the
 * pillar reads. It is `ceiling` that makes the knock-out decisive; this number
 * alone must never be read as the answer for a market that has one.
 */
export function pillarScore(a, pillar, grades, on){
  const arch = resolve(a);
  let sum = 0, weights = 0;
  for (const d of dimensionsIn(pillar)){
    const u = utility(arch, d.id, grades, on);
    if (u === null) return null;
    sum += arch.weight[d.id] * (u === KNOCK_OUT ? 0 : u);
    weights += arch.weight[d.id];
  }
  return weights > 0 ? sum / weights : null;
}

/**
 * fit(a) = Σ a.pillarWeight[P] · pillarScore(a, P). Null until every pillar has
 * a score.
 *
 * The only place on the platform where the four pillars become one number, and
 * it is one investor's number. There is no market-level blend and there must
 * not be one.
 */
export function fit(a, grades, on){
  const arch = resolve(a);
  let sum = 0;
  for (const pillar of PILLARS){
    const score = pillarScore(arch, pillar, grades, on);
    if (score === null) return null;
    sum += arch.pillarWeight[pillar] * score;
  }
  return sum;
}

/** Dimensions whose current grade this archetype reads as a knock-out. */
export function knockOuts(a, grades, on){
  const arch = resolve(a);
  return DIMENSION_IDS.filter(id => utility(arch, id, grades, on) === KNOCK_OUT);
}

/**
 * Limits this archetype breaches on a route, and limits that could not be
 * checked because the figure is missing.
 *
 * `unchecked` is returned separately and is NOT a breach, but it is not a
 * clearance either. A market with no sourced security figure has not passed the
 * developer's limit; nobody has looked. The page should say so.
 *
 * `incomplete` names metrics whose figure is only a LOWER BOUND — a ledger with
 * an item nobody has put a number on. A lower bound over the limit is a breach,
 * because the true figure can only be higher. A lower bound under it proves
 * nothing and is unchecked.
 */
export function limitCheck(a, metrics = {}, route, incomplete = []){
  const arch = resolve(a);
  const on = route || arch.defaultRoute;
  const breached = [], unchecked = [];
  for (const limit of arch.limits){
    if (!limit.routes.includes(on)) continue;
    const value = metrics?.[limit.metric];
    if (typeof value !== 'number' || !Number.isFinite(value)) unchecked.push(limit.id);
    else if (value > limit.max) breached.push(limit.id);
    else if (incomplete.includes(limit.metric)) unchecked.push(limit.id);
  }
  return { route: on, breached, unchecked };
}

/**
 * ceiling(a) = NOT_ACCESSIBLE if any utility is KNOCK_OUT, or any metric
 * breaches a.limits. Otherwise null: no ceiling applies.
 *
 * Takes no score and looks at no weight, which is the whole design. A knock-out
 * cannot be outvoted because nothing here is a vote.
 */
export function ceiling(a, grades, metrics = {}, route, on){
  const arch = resolve(a);
  if (knockOuts(arch, grades, on).length) return NOT_ACCESSIBLE;
  if (limitCheck(arch, metrics, route).breached.length) return NOT_ACCESSIBLE;
  return null;
}

/* ---------------------------------------------------------------------------
   THE SCORE CHECKS THE VERDICT. IT NEVER SETS IT. (plan §3.6)
   --------------------------------------------------------------------------- */

/** Lowest band first. A score at or above `from` and below the next band's `from` sits in the band. */
export const SCORE_BANDS = [
  { call: VERDICT.AVOID,          from: 0 },
  { call: VERDICT.WAIT,           from: 30 },
  { call: VERDICT.OPPORTUNISTIC,  from: 45 },
  { call: VERDICT.BUILD_POSITION, from: 60 },
  { call: VERDICT.ENTER_NOW,      from: 75 },
];

const BAND_ORDER = SCORE_BANDS.map(b => b.call);

/** The verdict a score would suggest, or null when there is no score. */
export function bandOf(score){
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  let call = SCORE_BANDS[0].call;
  for (const band of SCORE_BANDS) if (score >= band.from) call = band.call;
  return call;
}

/** Why a verdict and its score disagree. */
export const DISAGREEMENT = {
  /** A knock-out or a breached limit applies and the verdict is something else. */
  KNOCK_OUT_IGNORED: 'knock-out-ignored',
  /** The verdict is "not accessible" and nothing in the grades or metrics says why. */
  NO_KNOCK_OUT: 'no-knock-out',
  /** The verdict sits more than one band from its score. */
  BAND: 'band',
  /** The verdict is "enter now" and a limit on this route has no figure to be checked against. */
  UNCHECKED_LIMIT: 'unchecked-limit',
};

export const DISAGREEMENT_LABEL = {
  [DISAGREEMENT.KNOCK_OUT_IGNORED]: ['A knock-out applies and the verdict does not say so', '已触及否决项，但结论未予体现'],
  [DISAGREEMENT.NO_KNOCK_OUT]: ['Verdict says not accessible, and no knock-out or limit applies', '结论为"无法进入"，但并未触及任何否决项或上限'],
  [DISAGREEMENT.BAND]: ['Verdict and score disagree', '结论与评分不一致'],
  [DISAGREEMENT.UNCHECKED_LIMIT]: ['Verdict says enter now, and a limit has not been checked against a figure', '结论为"现在进入"，但仍有上限尚未对照实际数字核查'],
};

/**
 * Does a verdict sit where its score would put it?
 *
 * The analyst sets the call. This reports, and only reports, when the call is
 * more than one band from the score — one band is ordinary judgement, two is a
 * claim that needs a reason on the page. Nothing here returns a call to use.
 *
 * THE KNOCK-OUT IS CHECKED FIRST AND OVERRIDES ANY SCORE. A market that scores
 * 90 with a knock-out is expected to read "not accessible", and a verdict of
 * "enter now" there disagrees however well the bands line up.
 *
 * AN UNCHECKED LIMIT IS NOT A CLEARANCE. "Enter now" says the bar is cleared
 * today; if a limit on this route has no figure behind it, nobody has looked,
 * and the verdict is flagged whatever the score says. Only "enter now" is held
 * to this — every other call already stops short of committing capital.
 *
 * With no score and no knock-out there is nothing to check a band against, and
 * the result says so (`checked: false`) rather than passing.
 */
export function checkVerdict(call, score, ceilingValue = null, unchecked = []){
  const result = (expected, disagrees, kind = null, distance = null, checked = true) =>
    ({ call, expected, score: score ?? null, checked, disagrees, kind, distance, unchecked: [...unchecked] });
  const unlooked = call === VERDICT.ENTER_NOW && unchecked.length > 0;

  if (ceilingValue === NOT_ACCESSIBLE){
    return call === VERDICT.NOT_ACCESSIBLE
      ? result(NOT_ACCESSIBLE, false)
      : result(NOT_ACCESSIBLE, true, DISAGREEMENT.KNOCK_OUT_IGNORED);
  }

  const expected = bandOf(score);
  if (call === VERDICT.NOT_ACCESSIBLE) return result(expected, true, DISAGREEMENT.NO_KNOCK_OUT);
  if (expected === null) return result(null, unlooked, unlooked ? DISAGREEMENT.UNCHECKED_LIMIT : null, null, false);

  const distance = Math.abs(BAND_ORDER.indexOf(call) - BAND_ORDER.indexOf(expected));
  if (distance > 1) return result(expected, true, DISAGREEMENT.BAND, distance);
  return unlooked
    ? result(expected, true, DISAGREEMENT.UNCHECKED_LIMIT, distance)
    : result(expected, false, null, distance);
}

/**
 * Everything one archetype says about one market, for a verdict to be checked
 * against. `grades` is keyed by dimension id and holds bare grades or grade
 * records; `metrics` is keyed by METRIC; `verdict` is optional; `incomplete`
 * names the metrics that are lower bounds (see limitCheck).
 *
 * `on` is the evaluation date, needed once any grade carries a held layer.
 * Grades are read at their EFFECTIVE value — the analyst's held view while it
 * is live — and the result says so, dimension by dimension, in `grades`:
 * the effective grade, the sourced grade, whether a held view applied and
 * whether one has lapsed. `fitSourced` is the same score on sourced grades
 * alone, so the page can show how far the analyst's own judgement moves it.
 *
 * WHEN `ceiling` IS SET, `fit` IS NOT THE HEADLINE. The score is still returned,
 * because it says how the rest of the market reads, but a knock-out counted as
 * zero inside it and a page that leads with the number has let the barrier be
 * averaged away after all. `headline` says which of the two a page may lead
 * with.
 */
export function assess(a, grades, metrics = {}, verdict = null, incomplete = [], on){
  const arch = resolve(a);
  const route = verdict?.route || arch.defaultRoute;
  const limits = limitCheck(arch, metrics, route, incomplete);
  const cap = ceiling(arch, grades, metrics, route, on);
  const score = fit(arch, grades, on);

  const read = Object.fromEntries(DIMENSION_IDS.map(id => [id, effectiveGrade(grades?.[id], on)]));
  const heldApplied = DIMENSION_IDS.filter(id => read[id].applied);
  /* The same score with every held layer set aside. Equal to `fit` when no
     held view is live, so a page can compare the two without special cases. */
  const publicGrades = Object.fromEntries(DIMENSION_IDS.map(id => [id, sourcedOnly(grades?.[id])]));
  const fitSourced = heldApplied.length ? fit(arch, publicGrades) : score;

  return {
    archetype: arch.id,
    route,
    pillars: Object.fromEntries(PILLARS.map(p => [p, pillarScore(arch, p, grades, on)])),
    fit: score,
    fitSourced,
    grades: read,
    heldApplied,
    heldLapsed: DIMENSION_IDS.filter(id => read[id].lapsed),
    band: bandOf(score),
    ceiling: cap,
    headline: cap === NOT_ACCESSIBLE ? 'ceiling' : 'fit',
    knockOuts: knockOuts(arch, grades, on),
    limitsBreached: limits.breached,
    limitsUnchecked: limits.unchecked,
    check: verdict ? checkVerdict(verdict.call, score, cap, limits.unchecked) : null,
  };
}

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/**
 * Problems with one archetype's tables. Empty array means valid.
 *
 * Exists because the tables are edited by hand and the failure modes are quiet:
 * a dimension added to investability.js and not here scores as undefined, and a
 * pillar weight nudged without its neighbours makes every fit drift by a few
 * points with nothing failing.
 */
export function validateArchetype(a){
  const problems = [];
  const at = (m) => problems.push(`${a?.id || '?'}: ${m}`);
  if (!a || !ARCHETYPE_IDS.includes(a.id)) return [`unknown archetype "${a?.id}"`];

  for (const key of ['label', 'who', 'returnReads', 'shutOutBy']){
    if (!isPair(a[key])) at(`${key} must be an [en, zh] pair`);
  }
  if (!Array.isArray(a.entersAt) || !a.entersAt.length || a.entersAt.some(r => !ROUTE.includes(r))) at('entersAt must list known routes');
  else if (!a.entersAt.includes(a.defaultRoute)) at('defaultRoute must be one of entersAt');
  if (a.chequeUSD !== null && !(Array.isArray(a.chequeUSD) && a.chequeUSD.length === 2 && a.chequeUSD[0] > 0 && a.chequeUSD[0] <= a.chequeUSD[1])){
    at('chequeUSD must be null or a [min, max] range');
  }

  const pillarSum = PILLARS.reduce((s, p) => s + (a.pillarWeight?.[p] ?? NaN), 0);
  if (!(Math.abs(pillarSum - 1) < 1e-9)) at(`pillar weights sum to ${pillarSum}, not 1`);
  for (const p of Object.keys(a.pillarWeight || {})) if (!PILLARS.includes(p)) at(`pillar weight for unknown pillar "${p}"`);

  for (const d of DIMENSIONS){
    const w = a.weight?.[d.id];
    if (!(typeof w === 'number' && w > 0)) at(`${d.id}: weight must be a positive number`);

    const table = a.reads?.[d.id];
    if (!table){ at(`${d.id}: no reads table`); continue; }
    for (const grade of [1, 2, 3, 4, 5]){
      const u = table[grade];
      const number = typeof u === 'number' && u >= 0 && u <= 100;
      if (!number && u !== KNOCK_OUT) at(`${d.id}: grade ${grade} must read as 0–100 or KNOCK_OUT`);
      /* A rank grade is relative: the bottom fifth exists in every set. A
         knock-out on it would close a fixed share of markets by construction. */
      if (u === KNOCK_OUT && d.gradedBy === GRADED_BY.RANK) at(`${d.id}: a rank-graded dimension cannot carry a knock-out`);
    }
    if ([1, 2, 3, 4, 5].every(g => table[g] === KNOCK_OUT)) at(`${d.id}: every grade is a knock-out`);
  }
  for (const id of [...Object.keys(a.weight || {}), ...Object.keys(a.reads || {})]){
    if (!dimension(id)) at(`"${id}" is not a dimension`);
  }

  const metricKeys = Object.values(METRIC);
  const seen = new Set();
  for (const limit of a.limits || []){
    if (!limit.id || seen.has(limit.id)) at(`limit "${limit.id}" is missing an id or repeats one`);
    seen.add(limit.id);
    if (!metricKeys.includes(limit.metric)) at(`limit ${limit.id}: unknown metric "${limit.metric}"`);
    if (!(typeof limit.max === 'number' && limit.max > 0)) at(`limit ${limit.id}: max must be a positive number`);
    if (!Array.isArray(limit.routes) || !limit.routes.length || limit.routes.some(r => !ROUTE.includes(r))) at(`limit ${limit.id}: routes must list known routes`);
    if (!isPair(limit.label)) at(`limit ${limit.id}: label must be an [en, zh] pair`);
  }
  return problems;
}
