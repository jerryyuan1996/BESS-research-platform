/* ---------------------------------------------------------------------------
   Japan — the three regional lenses.

   Same national rulebook, three different storage problems:

     Tokyo     load depth / scarcity / flexibility
     Kyushu    solar surplus / curtailment / export constraint
     Hokkaido  renewable export / weak grid / interconnector constraint

   Only genuinely regional facts belong here. Anything true of every Japanese
   BESS lives in national.js.

   DATA PROVENANCE — read before using any number below.
   Two classes of value are mixed here and are badged differently throughout:

     ANCHORED   verified against the cited public source. Capacity Market area
                prices and contracted capacity, connection-study caps, verified
                curtailment days, Hokkaido–Honshu capacity, HEPCO charging-control
                system count, Hokkaido balancing/queue signals.

     SEED       illustrative, pending the ETL described in
                docs/japan-etl-gates.md. Every economics field: capex, opex,
                merchant margin, incremental balancing value, expected-capacity
                factor, renewal curve, and all three scorecards.

   The seed values are internally consistent and derived by a stated rule, but
   they are NOT a substitute for the 12-month area-price backtest the methodology
   requires. The dashboard says so on every affected card.
   --------------------------------------------------------------------------- */

import { band, limits } from '../../comparison/ranges.js';
import { stackFrom } from '../../comparison/capex.js';

/* Reference asset — identical in all three regions on purpose. The controlled
   experiment the Regional Benchmark tab asks: same 50 MW / 6h battery, same
   capex, what changes when you move it?

   REVISED 2026-07-30: 4h → 6h. This is not a preference. LTDA Round 3 eliminated
   the 3-6 hour bracket and set a hard SIX-HOUR MINIMUM for BESS; the capacity
   auction that awarded 1.25 GW of storage carried the same six-hour requirement.
   A four-hour Japanese battery cannot bid into the route that makes Japan
   bankable, so a four-hour reference asset was modelling a market that is closed.
   docs/external-view.md §3. */
export const JP_REFERENCE = {
  powerMW: 50,
  durationHours: 6,
  usableFraction: 0.95,
  rtePct: 88,
  availPct: 92,
  cyclesPerDay: 1,
  lifeYears: 15,
  degrPct: 2,
};

/* Common cost basis, JPY.

   REVISED 2026-07-30: ¥45,000/kWh → ¥60,000/kWh. Japanese grid-scale BESS
   averaged around ¥68,000/kWh in FY2024 (~US$433/kWh), with system costs
   reported at 2.5-3× global benchmarks. ¥45,000 was a seed that quietly assumed
   Japan builds at world prices, which is the one thing every source says it does
   not — and which is the reason the LTDA exists at all.

   ¥60,000 sits between the FY2024 observation and global convergence, allowing
   for decline to a 2026-27 COD. It remains an ANALYST assumption: gate G5.

   ¥60,000/kWh × 6 h × 1,000 kWh/MWh = ¥360m/MW. */
export const JP_COMMON_COST = {
  capexPerKWh: 60000,
  capexPerMW: 360000000,
  opexPerMW: 1800000,
  optimiserFeePct: 10,
};

/* ---- capital structure, shared by all three areas -------------------------
   The stack reconciles exactly to ¥360m/MW, so introducing it moved no
   published Japanese return. The component shares are global — gate G24 — which
   matters more here than anywhere else on the platform: Japan's capex premium
   over global benchmarks is the whole reason gate G5 exists, and a global split
   cannot say which component carries it. Balance of plant and civil works are
   the usual explanation and this stack cannot yet confirm it.

   Consumption tax is 10% and recoverable by a taxable enterprise. The TEPCO
   connection regime — a 10% deposit and a first contribution of at least 50%
   from 1 April 2026 — is a genuine working-capital cost that is not modelled
   here: it is a payment schedule against a connection charge whose amount is
   project-specific and unpublished. Gate G26.

   Six-hour Japanese builds are not fast, but no public source gives a
   programme, so twelve months is carried as the platform default rather than an
   estimate dressed as evidence. */
export const JP_CAPEX_STACK = stackFrom(JP_COMMON_COST.capexPerMW, 6);
export const JP_CAPITAL = {
  capexStack: JP_CAPEX_STACK,
  vatPct: 10, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
};

/* How each line scales with duration, for the design-fit sweep
   (src/comparison/designFit.js) — shared by the three areas, like the curves it
   comes from. Shapes relative to the six-hour archetype; the capture curve is
   the dashboard's national shape, moved over unchanged. On JEPX's own prices
   for the twelve months to 13 October 2026 it is close to what the three areas
   paid (6h 0.87-0.89 and 8h 0.72-0.73 of the 4h rate, against 0.85 and 0.72
   here — docs/duration-and-route-fit-plan.md §3.3).

   The long-term award is paid per kW, so it does not grow with energy. Its
   six-hour floor and twenty-year term are the scheme's own fields
   (`economics.ltda.minDurationHours`, `.years`), and under decision 6 of the
   plan the floor is tested at the end of the term: gate DG-5 asks whether
   OCCTO measures it that way.

   NO CAPACITY RESPONSE IS DECLARED, deliberately. The Capacity Market route
   carries JP_EXPECTED_CAPACITY_FACTOR, which is the FOUR-hour factor, at the
   six-hour archetype. Scaling a 4h level by a curve read from 6h would compound
   that rather than expose it, so the route is priced at the archetype only
   until the factor is put right. */
export const JP_DURATION_RESPONSE = {
  hours: [1, 2, 4, 6, 8],
  merchantCapture: [1.25, 1.15, 1.00, 0.85, 0.72],
  merchantCaptureBasis: 'seed',
  opexEnergyShare: 0.5,
  routeRules: {
    ltda: { paymentBasis: 'kW', floorKind: 'binary' },
  },
};

/* Expected Capacity factor applied to the Capacity Market area price for a 4h
   battery. The formula is national, so the same factor is used in all three
   areas and capacity revenue differs only by area price — which is the point.
   SEED, and the single highest-leverage open input in the whole Japan build. */
export const JP_EXPECTED_CAPACITY_FACTOR = 0.70;

/* Auction-renewal path. The Capacity Market main auction secures one delivery
   year; years 2-15 are assumed, not won. Rule: linear decline from 90% of the
   secured payment in year 2 to 60% in year 15, reflecting storage entering the
   auction. SEED — replace with a scenario from the Capacity & LTDA tab. */
const RENEWAL_YEARS = 14, RENEWAL_FROM = 0.90, RENEWAL_TO = 0.60;
const renewalTaper = (i) =>
  RENEWAL_FROM + (RENEWAL_TO - RENEWAL_FROM) * (i / (RENEWAL_YEARS - 1));

function renewalCurve(securedJPYperMW){
  return Array.from({ length: RENEWAL_YEARS }, (_, i) =>
    Math.round(securedJPYperMW * renewalTaper(i)));
}

/* The same taper, decomposed into the two things it is actually a claim about.
   markets/schema.js requires every uncleared year to say what it is made of, so
   that a reader can disagree with the price path and the accreditation path
   separately instead of with one blended number.

   In Japan the taper sits entirely on the AREA PRICE — more storage bidding into
   the main auction clears it lower — while the Expected Capacity factor is a
   national formula and does not move with penetration. The payment is computed
   from `securedJPYperMW` exactly as `renewalCurve` computes it, so introducing
   this declaration moved no published Japanese number.

   The secured award is delivery year 2029; the assumed years run FY2030-FY2043. */
const RENEWAL_FIRST_DELIVERY_YEAR = 2030;

function renewalScenario(area){
  const securedJPYperMW = secured(area);
  return {
    basis: [
      'One linear path, applied to the area clearing price rather than to the payment: the Capacity Market main auction secures a single delivery year, and every year after it has to be re-won against a fleet that grows each round. 90% of the secured price in the first assumed year falling to 60% by year 15 is a SEED taper, not an observation — no Japanese post-2029 clearing price exists to test it against. The Expected Capacity factor is held flat at ' + JP_EXPECTED_CAPACITY_FACTOR + ' because it is a national formula that does not respond to how much storage is bidding.',
      '这是一条线性路径，且作用于区域出清价格而非直接作用于收入：容量市场主拍卖仅锁定一个实需年度，其后每一年都须面对逐轮扩大的机组规模重新竞标。首个假设年度取已锁定价格的90%、至第15年降至60%，这是种子设定的递减路径而非观测值 — 日本不存在2029年之后的出清价格可供检验。期待容量系数固定为' + JP_EXPECTED_CAPACITY_FACTOR + '，因为它属于全国统一公式，不随投标储能规模变化。',
    ],
    source: 'OCCTO Capacity Market main auction area prices (delivery year 2029); taper and Expected Capacity factor are analyst seeds',
    gate: 'G20',
    securedYear: {
      deliveryYear: '2029',
      price: cmPrice[area],
      priceUnit: 'JPY/kW/yr',
      accreditation: JP_EXPECTED_CAPACITY_FACTOR,
      paymentPerMWYr: securedJPYperMW,
      cleared: true,
    },
    years: Array.from({ length: RENEWAL_YEARS }, (_, i) => ({
      deliveryYear: String(RENEWAL_FIRST_DELIVERY_YEAR + i),
      price: Math.round(cmPrice[area] * renewalTaper(i)),
      priceUnit: 'JPY/kW/yr',
      accreditation: JP_EXPECTED_CAPACITY_FACTOR,
      paymentPerMWYr: Math.round(securedJPYperMW * renewalTaper(i)),
      cleared: false,
    })),
  };
}

const cmPrice = { tokyo: 15111, kyushu: 15112, hokkaido: 14972 };
const secured = (area) => Math.round(cmPrice[area] * 1000 * JP_EXPECTED_CAPACITY_FACTOR);

/* ---------------------------------------------------------------------------
   THE LONG-TERM DECARBONIZATION AUCTION — Japan's bankable route.

   Round 3 (results 13 May 2026) is now the route a Japanese BESS is underwritten
   on, and it is structurally unlike everything else in this platform:

     · 20-year Capacity Reserve Agreement with OCCTO, CPI-indexed
     · hard 6-hour minimum duration; the 3-6h bracket was abolished
     · pay-as-bid, and CLEARING PRICES ARE NOT PUBLISHED
     · ~90% of net profit from other markets is returned to OCCTO for the term
     · ~575 MW of standalone BESS awarded; ~46% bid success, up from ~20%

   PRICING A PAY-AS-BID AUCTION WITH NO PUBLISHED CLEARING PRICE.

   The published anchor is the bid ceiling. Round 4 (FY2026 outline, OCCTO, 2
   September 2026) sets it at ¥70,675-74,417/kW/yr for batteries by area, down
   from the FY2024 ¥87,683-93,883/kW/yr this file first carried for
   6h+ duration (against ~¥56,545-77,509 for the abolished 3-6h bracket). It is
   tempting to take a fraction of that ceiling, and it is wrong: in a pay-as-bid
   auction with real competition — 46% success means more than half the bid
   capacity lost — a bidder bids its cost, not the cap. Anchoring to the ceiling
   would model a bidder with no competitors.

   So the award is derived as cost-reflective fixed-cost recovery, which is what
   the bid actually is:

       capex annuitised over the 20-year term at a required return
     + opex
     - the sliver of market revenue the bidder still keeps after the clawback
     = the bid

   That lands at ~¥37,000/kW/yr, or about 51% of the FY2026 ceiling midpoint
   (37,000 / 72,546; it was 41% of the FY2024 midpoint) — a
   plausible competitive clearing level, and one that moves correctly if the
   capex assumption moves. It remains an ANALYST assumption: gate G4 (OCCTO
   Round 3 guidelines) is what would replace it with an observation.
   --------------------------------------------------------------------------- */

/** Required return used to annuitise capex into an LTDA bid. Nominal, pre-tax. */
const LTDA_REQUIRED_RETURN = 0.08;
const LTDA_TERM_YEARS = 20;

/** Published FY2026 (Round 4) battery bid ceiling by area, ¥/kW/yr. Context, not an
    input. Supersedes the FY2024 6h+ band of [87683, 93883]. */
export const JP_LTDA_CAP_BAND = [70675, 74417];

function ltdaCostReflectiveBid(retainedMarketPerMW){
  const capexPerKW = JP_COMMON_COST.capexPerMW / 1000;
  const r = LTDA_REQUIRED_RETURN;
  const annuityFactor = r / (1 - Math.pow(1 + r, -LTDA_TERM_YEARS));
  const perKW = capexPerKW * annuityFactor
    + JP_COMMON_COST.opexPerMW / 1000
    - retainedMarketPerMW / 1000;
  return Math.round(perKW / 1000) * 1000 * 1000;   // to ¥/MW/yr, rounded to ¥1,000/kW
}

/* Fraction of other-market net profit the owner keeps. The LTDA returns ~90% to
   OCCTO, which is why the award and the merchant stack are very nearly
   alternatives rather than a stack — and why co-located projects, which are NOT
   subject to the clawback, are where advisers are steering developers. */
export const JP_LTDA_MERCHANT_RETENTION = 0.10;

/* Arbitrage uplift from the 4h reference the seed economics were built on to the
   6h asset the LTDA now requires. Sub-linear: 50% more energy does not buy 50%
   more spread, because the marginal hours are the less valuable ones. Balancing
   value is power-based and is NOT scaled. SEED. */
const JP_6H_MERCHANT_UPLIFT = 1.25;

/* Normalized economics for one area.

   Note what falls out of this: because the LTDA bid is cost-reflective and costs
   are national, all three areas land on the SAME award. That is not a modelling
   shortcut — it is the finding. The LTDA does not differentiate regions, exactly
   as the Capacity Market area prices do not (¥14,972 / ¥15,111 / ¥15,112, within
   0.9% of each other). Whatever separates Tokyo from Kyushu from Hokkaido has to
   be earned in the market legs, which is the premise the three-region split was
   built on. */
function regionEcon(area, merchGross4hJPYMWYr, balancingJPYMWYr){
  const merchGross = Math.round(merchGross4hJPYMWYr * JP_6H_MERCHANT_UPLIFT);

  /* Market revenue the owner actually keeps under the clawback, net of the
     optimiser fee on the traded leg. This is what a bidder can deduct from the
     fixed-cost recovery it needs the award to cover. */
  const retained = (merchGross * (1 - JP_COMMON_COST.optimiserFeePct / 100) + balancingJPYMWYr)
    * JP_LTDA_MERCHANT_RETENTION;

  return {
    merchGrossJPYMWYr: merchGross,
    merchGross4hJPYMWYr,                       // kept for the Regional Benchmark tab
    balancingIncrementalJPYMWYr: balancingJPYMWYr,
    securedContractedJPYMWYr: secured(area),
    capacityAreaPriceJPYkWYr: cmPrice[area],
    renewal: renewalCurve(secured(area)),
    renewalScenario: renewalScenario(area),
    ltdaPaymentJPYMWYr: ltdaCostReflectiveBid(retained),
  };
}

export const JP_REGIONS = {
  // =========================================================================
  tokyo: {
    id: 'jp_tokyo',
    short: ['Tokyo', '东京'],
    name: ['Japan — Tokyo Area', '日本 — 东京区域'],
    area: ['Tokyo Area', '东京区域'],
    tso: ['TEPCO Power Grid', '东京电力电网'],
    color: 'var(--s7)',
    thesis: ['Load depth / scarcity / flexibility', '负荷深度 / 稀缺性 / 灵活性'],
    thesisLong: [
      'The large-load, scarcity and flexibility benchmark. Underwrite Tokyo-area price capture and connection quality, not demand size — being inside TEPCO territory is not itself an underwriting argument.',
      '大负荷、稀缺性与灵活性基准市场。应以东京区域价格兑现与并网质量为承销依据，而非负荷规模 — 身处东京电力辖区本身并不构成投资理由。',
    ],
    conclusion: [
      'Prefer projects with strong import/export evidence and demonstrated Tokyo-area price capture; do not pay a development premium merely for being in TEPCO territory.',
      '优先选择具备充分充放电接入证据、且已验证东京区域价格兑现能力的项目；不应仅因位于东京电力辖区而支付开发溢价。',
    ],

    // ---- JEPX (SEED) ----
    jepx: {
      avgJPYkWh: 13.8, p95JPYkWh: 31.5, p05JPYkWh: 5.9,
      optimised4hSpreadJPYkWh: 9.0,
      nearZeroIntervalsPct: 3.1,
      basisToSystemJPYkWh: 0.6,
      marketSplitHoursPct: 12.4,
    },

    // ---- curtailment (ANCHORED: OCCTO verified days) ----
    curtailment: {
      verified: [
        { m: ['Mar 2026', '2026年3月'], days: 5 },
        { m: ['Apr 2026', '2026年4月'], days: 6 },
        { m: ['May 2026', '2026年5月'], days: 9 },
      ],
      totalDays: 20,
      window: ['Mar–May 2026', '2026年3–5月'],
      note: ['Tokyo can no longer be treated as structurally curtailment-free.',
             '东京已不能再被视为结构性无弃电区域。'],
    },

    // ---- grid (ANCHORED: study cap, deposit rule) ----
    grid: {
      studyCap: 11,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: 10,
      firstContributionPct: 50,
      contributionFrom: ['1 Apr 2026', '2026年4月1日'],
      constraint: ['Load-centre congestion, network headroom, emerging output control',
                   '负荷中心拥塞、网络裕度、新出现的出力抑制'],
    },
    interties: {
      headline: ['Tokyo interfaces and system basis', '东京联络线与系统价差'],
      note: ['Tokyo is a 50 Hz importing area; the relevant exposure is inter-area basis rather than a single binding export link.',
             '东京为50Hz受电区域；相关敞口是跨区价差，而非单一约束性外送通道。'],
    },

    saturation: {
      signal: ['Project- and queue-specific', '按项目与队列而定'],
      pipelineRatio: '~4.5×',
    },

    // duration-need index: w sums to 100, s is 0-3, higher = longer duration needed
    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 1 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 2 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 1 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 2 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    // ---- normalized economics for the global engine (SEED) ----
    econ: regionEcon('tokyo', 11500000, 2400000),
  },

  // =========================================================================
  kyushu: {
    id: 'jp_kyushu',
    short: ['Kyushu', '九州'],
    name: ['Japan — Kyushu Area', '日本 — 九州区域'],
    area: ['Kyushu Area', '九州区域'],
    tso: ['Kyushu Electric Power Transmission and Distribution', '九州电力输配电'],
    color: 'var(--s8)',
    thesis: ['Renewable surplus / curtailment / export constraint', '新能源过剩 / 弃电 / 外送约束'],
    thesisLong: [
      'The renewable-surplus and curtailment benchmark. Value depends on charging access during low-price windows, regional price capture and how far network reinforcement compresses the scarcity rent that curtailment creates.',
      '新能源过剩与弃电基准市场。价值取决于低价窗口的充电接入、区域价格捕获，以及电网强化在多大程度上压缩弃电所产生的稀缺租金。',
    ],
    conclusion: [
      'Curtailment creates system need, not automatic project revenue. Invest only where the site can import during low-price periods, export when value returns, and survive the downside of lower curtailment after grid reinforcement.',
      '弃电创造的是系统需求，而非项目收入。仅在场址能于低价时段充电、在价值回归时放电，并能承受电网强化后弃电减少的下行情景时方可投资。',
    ],

    jepx: {
      avgJPYkWh: 11.9, p95JPYkWh: 29.8, p05JPYkWh: 1.4,
      optimised4hSpreadJPYkWh: 10.5,
      nearZeroIntervalsPct: 14.6,
      basisToSystemJPYkWh: -1.3,
      marketSplitHoursPct: 26.8,
    },

    // ANCHORED: OCCTO verified 50 days Jan–Mar 2026
    curtailment: {
      verified: [
        { m: ['Jan 2026', '2026年1月'], days: 12 },
        { m: ['Feb 2026', '2026年2月'], days: 14 },
        { m: ['Mar 2026', '2026年3月'], days: 24 },
      ],
      totalDays: 50,
      window: ['Jan–Mar 2026', '2026年1–3月'],
      note: ['Chronic solar surplus; the deepest low-price charging windows in the set.',
             '长期光伏过剩；样本中最深的低价充电窗口。'],
    },

    grid: {
      studyCap: 8,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: null,
      firstContributionPct: 50,
      contributionFrom: ['2026', '2026年'],
      constraint: ['Solar surplus, local congestion, Kanmon export headroom',
                   '光伏过剩、局部拥塞、关门联络线外送裕度'],
    },
    interties: {
      headline: ['Kanmon interface to western Honshu', '关门联络线（至本州西部）'],
      transferTripFrom: ['1 Apr 2026', '2026年4月1日'],
      note: ['The expanded transfer-trip system in operation from 1 Apr 2026 raises renewable export over Kanmon and is expected to reduce curtailment — which is a downside for a merchant battery, not an upside.',
             '自2026年4月1日投运的扩容转移跳闸系统提升了关门断面的新能源外送能力并有望减少弃电 — 对市场化储能而言这是下行因素而非利好。'],
    },

    saturation: {
      signal: ['Project- and queue-specific', '按项目与队列而定'],
      pipelineRatio: '~6.2×',
    },

    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 3 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 3 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 3 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 2 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    econ: regionEcon('kyushu', 13400000, 2000000),
  },

  // =========================================================================
  hokkaido: {
    id: 'jp_hokkaido',
    short: ['Hokkaido', '北海道'],
    name: ['Japan — Hokkaido Area', '日本 — 北海道区域'],
    area: ['Hokkaido Area', '北海道区域'],
    tso: ['Hokkaido Electric Power Network', '北海道电力网络'],
    color: 'var(--s4)',
    thesis: ['Renewable export / weak grid / interconnector constraint', '新能源外送 / 弱网 / 跨区互联约束'],
    thesisLong: [
      'The renewable-export and interconnector-constrained benchmark. A small local demand pool, Hokkaido Area Price separation, limited Hokkaido–Honshu transfer, charging-side network headroom, and the fastest balancing-market saturation in the set.',
      '新能源外送与跨区互联受限的基准市场。本地需求池小、北海道区域电价分离、北海道—本州输电能力有限、充电侧网络裕度不足，且调整力市场饱和速度为样本之最。',
    ],
    conclusion: [
      'Do not equate high renewable potential with high battery returns. Hokkaido projects must prove both charging access and export value, and the model must stress interconnector expansion plus rapid balancing-market saturation.',
      '不可将高新能源潜力等同于高储能回报。北海道项目须同时证明充电接入与外送价值，模型亦须对跨区互联扩容及调整力市场快速饱和进行压力测试。',
    ],

    jepx: {
      avgJPYkWh: 12.6, p95JPYkWh: 30.4, p05JPYkWh: 2.2,
      optimised4hSpreadJPYkWh: 9.5,
      nearZeroIntervalsPct: 9.8,
      basisToSystemJPYkWh: -0.7,
      marketSplitHoursPct: 31.5,
    },

    // ANCHORED: OCCTO verified 36 days Mar–May 2026
    curtailment: {
      verified: [
        { m: ['Mar 2026', '2026年3月'], days: 7 },
        { m: ['Apr 2026', '2026年4月'], days: 11 },
        { m: ['May 2026', '2026年5月'], days: 18 },
      ],
      totalDays: 36,
      window: ['Mar–May 2026', '2026年3–5月'],
      note: ['Rising month on month through spring, driven by wind and solar against a small local load.',
             '春季逐月上升，源于风光出力与本地小负荷之间的失配。'],
    },

    // ANCHORED: 5-study cap, 27 charging-control systems
    grid: {
      studyCap: 5,
      studyCapFrom: ['1 Aug 2026', '2026年8月1日'],
      depositPct: null,
      firstContributionPct: null,
      contributionFrom: ['Verify current HEPCO terms', '须核验北海道电力网络现行条款'],
      chargingControlSystems: 27,
      chargingControlAsOf: ['10 Apr 2026', '2026年4月10日'],
      constraint: ['Renewable export, charging-side forward-flow headroom, Hokkaido–Honshu transfer, local congestion',
                   '新能源外送、充电侧正向潮流裕度、北海道—本州输电能力、局部拥塞'],
    },
    // ANCHORED: 0.9 GW → 1.2 GW by FY2027-end
    interties: {
      headline: ['Hokkaido–Honshu interconnection', '北海道—本州联络线'],
      currentMW: 900,
      plannedMW: 1200,
      plannedBy: ['End FY2027', '2027财年末'],
      note: ['A larger Sea-of-Japan route remains a forward reinforcement theme and must be treated as a scenario, not as current capacity.',
             '更大规模的日本海通道仍属远期强化议题，只能作为情景处理，不得计入当前容量。'],
    },

    // ANCHORED: >0.2 GW balancing registration FY2026; ~2 GW connection applications
    saturation: {
      balancingRegisteredGW: 0.2,
      balancingRegisteredBasis: ['Expected FY2026', '预计FY2026'],
      connectionApplicationsGW: 2.0,
      signal: ['>0.2 GW balancing registration expected FY2026; ~2 GW connection-contract applications',
               '预计FY2026调整力注册容量超0.2GW；并网合同申请约2GW'],
      pipelineRatio: '~18×',
      note: ['Track separately from operating capacity. This is the clearest cannibalisation signal in the Japan set.',
             '须与在运容量分开跟踪。这是日本样本中最明确的收益蚕食信号。'],
    },

    durFactors: [
      { n: ['High-price event duration', '高价事件时长'], w: 12, s: 2 },
      { n: ['Low-price charging-window duration', '低价充电窗口时长'], w: 12, s: 3 },
      { n: ['Net-load ramp duration', '净负荷爬坡时长'], w: 10, s: 3 },
      { n: ['Balancing energy requirement', '调整力电量需求'], w: 10, s: 2 },
      { n: ['Capacity expected-capacity treatment', '容量市场期待容量处理'], w: 12, s: 2 },
      { n: ['LTDA duration / eligibility', '长期脱碳拍卖时长/资格'], w: 14, s: 2 },
      { n: ['Curtailment intensity', '弃电强度'], w: 10, s: 3 },
      { n: ['Import / export constraints', '充放电约束'], w: 8, s: 3 },
      { n: ['Degradation headroom', '衰减裕度'], w: 5, s: 1 },
      { n: ['Augmentation flexibility', '增容灵活性'], w: 7, s: 2 },
    ],

    econ: regionEcon('hokkaido', 12100000, 1500000),
  },
};

export const REGION_IDS = ['tokyo', 'kyushu', 'hokkaido'];

/* ---------------------------------------------------------------------------
   Investment-Lab bounds, built once for all three areas.

   Costs are national and the LTDA does not differentiate regions, so every band
   below is identical across Tokyo, Kyushu and Hokkaido except `securedContracted`
   and `services`, which are derived from each area's own seed. That is the same
   finding regionEcon() produces: whatever separates the three areas has to be
   earned in the market legs.

   Two fields are deliberately NOT given a band, and so are not editable:

     securedContractYears  the Capacity Market main auction secures one delivery
                           year. There is no longer award to select.
     ltda.years            the Capacity Reserve Agreement is twenty years, fixed
                           by the scheme, and outlives the comparison window.
   --------------------------------------------------------------------------- */
export function jpRanges(economics){
  return {
    capexPerMW: band(economics.capexPerMW, 45000 * 6000, 68000 * 6000, {
      basis: [
        'Japanese grid-scale BESS averaged ~¥68,000/kWh in FY2024 (~US$433/kWh), with system costs reported at 2.5–3× global benchmarks. ¥45,000/kWh was this platform\'s previous seed and assumed convergence to world prices. ¥60,000 sits between the observation and that convergence, allowing for decline to a 2026-27 COD. Both ends × 6,000 kWh/MW.',
        '日本电网级储能在2024财年平均约¥68,000/kWh（约US$433/kWh），系统成本据报为全球基准的2.5–3倍。¥45,000/kWh为本平台此前种子值，隐含向全球价格收敛的假设。¥60,000介于实测值与该收敛之间，并考虑至2026–27年投运期间的成本下降。两端均乘以6,000 kWh/MW。',
      ],
      source: 'MRI / METI cost estimates and IEEFA, FY2024 observation ~¥68,000/kWh',
      gate: 'G5',
    }),

    opexPerMW: band(economics.opexPerMW, null, null, {
      basis: [
        'No published Japanese fixed-opex series. ¥1.8m/MW/yr is ≈US$11,500, below the US utility-scale benchmark of US$15–25k/MW/yr, which is context rather than a bound.',
        '无日本固定运维公开序列。¥180万/MW/年约合US$11,500，低于美国公用事业级基准US$15–25k/MW/年 — 后者仅为参照，非边界。',
      ],
      source: 'Platform seed',
      gate: 'G13',
    }),

    /* The area price is anchored; the factor applied to it is not. */
    securedContracted: band(economics.securedContracted, null, null, {
      basis: [
        'The Capacity Market area price is ANCHORED (OCCTO, delivery year 2029) and the three areas sit within 0.9% of each other at ¥14,972–15,112/kW/yr. What is seeded is the Expected Capacity factor of 0.70 applied to it — the single highest-leverage open input in the Japan build — so the band is dispersion around the product, not around the price.',
        '容量市场分区价格为已锚定数据（OCCTO，2029实需年度），三个区域价格差异在0.9%以内，为¥14,972–15,112/kW/年。种子设定的是施加于其上的预期容量系数0.70 — 该系数是日本模型中影响最大的未决输入 — 因此区间为该乘积的离散范围，而非价格的离散范围。',
      ],
      source: 'OCCTO Capacity Market area prices (anchored); Expected Capacity factor is a seed — docs/japan-etl-gates.md',
    }),

    /* Pay-as-bid with no published clearing price. The band is the honest width
       of that: a cost-reflective bid at the bottom, the published cap at the top. */
    'ltda.payment': band(economics.ltda.payment, null, JP_LTDA_CAP_BAND[0] * 1000, {
      basis: [
        'LTDA Round 3 is pay-as-bid and clearing prices are NOT published. The ceiling is the FY2026 (Round 4) battery maximum, ¥70,675–74,417/kW/yr by area, down from ¥87,683–93,883 in FY2024. The seed is derived instead as cost-reflective fixed-cost recovery — capex annuitised over the 20-year term at 8%, plus opex, less the sliver of market revenue retained after the ~90% clawback — which lands at ~51% of the ceiling midpoint. With ~46% bid success, more than half the bid capacity lost, so a bidder bids its cost rather than the cap.',
        '长期脱碳拍卖第3轮采用按报价成交，且出清价格不予公布。上限为2026财年（第四轮）蓄电池上限，按区域为¥70,675–74,417/kW/年，低于2024财年的¥87,683–93,883。种子值则按成本反映型固定成本回收推导 — 资本开支按8%在20年期限内年金化，加运维成本，减去在约90%收益上缴后所保留的少量市场收入 — 结果约为上限中值的51%。在约46%的中标率下，超过半数投标容量落标，因此投标人按成本而非按上限报价。',
      ],
      source: 'OCCTO LTDA Round 3 (results 13 May 2026); OCCTO FY2026 Round 4 solicitation outline (2 Sep 2026) for the ceiling',
      gate: 'G4',
    }),

    merchGross: band(economics.merchGross, null, null, {
      basis: [
        'JEPX day-ahead and intraday capture for a six-hour asset, uplifted 1.25× from the four-hour seed the economics were originally built on. The uplift is sub-linear on purpose — 50% more energy does not buy 50% more spread, because the marginal hours are the less valuable ones.',
        '六小时资产在JEPX日前及日内市场的价格兑现，在原economics所依据的四小时种子基础上按1.25倍提升。该提升刻意设为次线性 — 能量增加50%并不能带来50%的价差增长，因为边际小时数属于价值较低的时段。',
      ],
      source: 'Platform seed — JEPX area prices, pending the 12-month backtest in docs/japan-etl-gates.md',
    }),

    feePct: limits(economics.feePct, 6, 12, {
      kind: 'dispersed',
      basis: [
        'Optimiser fees across the platform\'s six markets run 8–10% of market revenue; the band widens that by the stated dispersion.',
        '本平台六个市场的优化商费用为市场化收入的8–10%；该区间在此基础上按既定离散幅度扩展。',
      ],
      source: 'Platform cross-market seeds, widened by the stated dispersion',
    }),

    services: band(economics.services, null, null, {
      basis: [
        'EPRX balancing, counted as INCREMENTAL value only — the part a battery earns beyond what the energy leg already captures. Seeded per area; no public per-MW Japanese balancing series exists.',
        'EPRX平衡市场，仅计入增量价值 — 即电池在电能量收入之外额外获得的部分。按区域设定种子值；目前无公开的日本每MW平衡市场收入序列。',
      ],
      source: 'Platform seed — EPRX incremental balancing value',
    }),

    degr: limits(economics.degr, 1, 3, {
      kind: 'dispersed',
      basis: [
        'Applied to the market revenue leg. 2%/yr is the platform seed in every market; no market-specific degradation series is carried.',
        '适用于市场化收入部分。各市场种子值均为每年2%；本平台未采用市场专属的衰减序列。',
      ],
      source: 'Platform seed — held constant across all markets',
      gate: 'G13',
    }),
  };
}

export const DUR_BANDS = [
  { lo: 0,  hi: 39,  c: 'info',     n: ['Short duration adequate', '短时长即可'],
    d: ['2h configurations capture most of the available value.', '2小时配置即可捕获大部分可得价值。'] },
  { lo: 40, hi: 59,  c: 'good',     n: ['4h is the reference', '4小时为参考配置'],
    d: ['Matches the reference archetype used across this platform.', '与本平台通用参考原型一致。'] },
  { lo: 60, hi: 79,  c: 'warn',     n: ['Longer duration favoured', '倾向更长时长'],
    d: ['6h+ may earn its capital if the charging window supports it.', '若充电窗口支持，6小时以上可能收回其资本投入。'] },
  { lo: 80, hi: 100, c: 'serious',  n: ['Long duration required', '需长时储能'],
    d: ['Each incremental MWh still needs identifiable repeatable value.', '每增量MWh仍须具备可识别、可重复的价值。'] },
];

export default JP_REGIONS;
