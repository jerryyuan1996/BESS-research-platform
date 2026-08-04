/* ---------------------------------------------------------------------------
   Ireland (SEM) — comparison interface. Economics are per MW per year, in EUR.

   REVISED 2026-07-30. Two changes, one a data refresh and one structural.

   1. CAPACITY PRICE. €149.96/kW/yr is the 2028/29 T-4 result. The 2029/30 T-4,
      held April 2026, cleared at €135,499.99/MW/yr — about 10% lower. The newer
      auction is the one a market-entry benchmark should carry.

   2. SYSTEM SERVICES ARE NO LONGER FLAT. This is the important one. DS3 expires
      at the end of 2026, extended only until FASS go-live in May 2027 with a
      long-stop of September 2027, and effective DS3 rates have already fallen
      more than 40% since 2022. A flat fifteen-year services line models a regime
      that will not exist for fourteen of those years.

   THE CURVE, AND WHY IT HAS THIS SHAPE. Great Britain has already run this
   experiment, and Modo draws the analogy explicitly — Ireland is heading where
   GB went "when frequency response revenues collapsed". The GB sequence:

       2020        FFR is 40-50% of battery revenue
       Q4 2020     Dynamic Containment launches, quickly becomes dominant
       2022        DC saturates and revenues fall away
       Jan 2024    Balancing Mechanism revenue overtakes frequency response

   Saturation arrived at roughly 1.1× the requirement — about 1,567 MW installed
   against a frequency response requirement below 1,400 MW — and the fall was on
   the order of 75-80% within two years of that crossing.

   Ireland's crossing is not in doubt: ~800 MW operational against a pipeline of
   ~10 GW / 50 GWh across 155 projects. What is different is that Ireland's
   transition is DATED rather than emergent, so the curve steps rather than
   drifting: years 1-2 are the DS3 run-out, year 3 is FASS, and the tail is the
   competitive-auction floor GB settled at.

   OPEN ITEM. The BASE level of €8,000/MW/yr is inherited from the prototype and
   is not verified — Modo describes DS3 as historically the dominant Irish
   revenue source, which €8,000 against €71,200 of merchant does not reflect. The
   curve is applied to whatever that level turns out to be; gate G6 closes it.
   docs/external-view.md §3.
   --------------------------------------------------------------------------- */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';

const capacity = {
  price: 135.50,
  unit: 'kW',
  priceCurrency: 'EUR',
  fxToMarket: 1,
  derating: 0.66,
  auction: ['T-4, April 2026', '2026年4月T-4拍卖'],
  deliveryYear: 2029,
  source: 'SEM-O PCAR2930T-4, €135,499.99/MW/yr (supersedes €149,960 for 2028/29)',
  note: [
    'De-rating factors are beginning to erode capacity payments, hardest at short duration.',
    '可信容量系数已开始侵蚀容量收入，短时长资产受影响最大。',
  ],
};

/* Multipliers on `services`, index 0 = year 1. GB-calibrated; see the header.
   The tail is a floor, and the engine holds the last value for any year beyond
   the array — extending a floor is not an additional assumption. */
const DS3_TO_FASS = [
  1.00,   // yr 1  — DS3 runs to end-2026
  0.85,   // yr 2  — extension to FASS go-live; rates already declining
  0.45,   // yr 3  — FASS competitive auctions begin. The step.
  0.30,   // yr 4
  0.25,   // yr 5
  0.22, 0.22, 0.21, 0.21, 0.20, 0.20, 0.19, 0.19, 0.18, 0.18,
];

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 1160000;

const economics = {
  capexPerMW: 1160000,

  /* ---- capital structure -------------------------------------------------
     The stack reconciles exactly to the installed cost above — `stackFrom`
     puts the residual in EPC — so introducing it moved no published return.
     What it adds is the ability to move one component without moving the rest,
     and a place for the market-specific lines to sit visibly rather than
     inside a single number. Component split is global until gate G24 closes.

     VAT is 23% here (Irish VAT, recoverable by a taxable business). It is carried as timing rather than cost:
     recoverable, so it drags the return only through the refund lag, and the
     lag is zero until an analyst sets one — gate G27. Set `vatRecoverable:
     false` and it capitalises instead.

     `devCostPct` is zero deliberately. Published installed-cost benchmarks are
     EPC scope and exclude development, so a non-zero value here would be a new
     cost rather than a reallocation, and that is an analyst's call — gate G25.
     Set it, then set `rtbPremiumPct`, and the Lab reports the implied RTB
     acquisition price per MW. */
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, 4),
  vatPct: 23, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  opexPerMW: 10000,

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // ≈ €89,430
  contractYears: 10,
  postFactor: 0.6,

  /* Irish wholesale spreads average ~€103/MWh on a merit order with no
     mid-merit cushion — wind and solar at zero marginal cost sit directly
     below gas. Unchanged. */
  merchGross: 71200,
  feePct: 9,

  services: 8000,
  servicesCurve: DS3_TO_FASS,

  grantPct: 0,
  degr: 2,

  capNote: ['Reliability Option difference payments above the strike', '高于执行价时的可靠性期权差价支付'],
  servicesNote: [
    'DS3 ends 2026; FASS competitive auctions from May 2027. Curve calibrated on GB’s frequency-response collapse.',
    'DS3于2026年结束；FASS竞价拍卖自2027年5月启动。衰减曲线以英国调频收入崩塌为标定依据。',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   The band that matters here is `services`, and it is asymmetric upward for a
   reason: €8,000/MW/yr is inherited from the prototype and unverified, while
   Modo describes DS3 as historically the DOMINANT Irish revenue source — which
   €8,000 against €71,200 of merchant plainly does not describe. The ceiling is
   what "dominant" would have to mean; the decay curve then applies on top of
   whatever level is chosen.
   --------------------------------------------------------------------------- */
const ranges = {
  /* ---- capital structure ------------------------------------------------
     Three levers with no published counterpart. They are seeded so that they
     change nothing, and bounded so that moving them stays inside what the
     market plausibly does rather than inside what the arithmetic allows. */
  devCostPct: limits(0, 0, 15, {
    basis: [
      'Development cost as a share of build capex — land, planning, grid studies, legal and the connection application. Zero-seeded because published installed-cost benchmarks are EPC scope and already exclude it, so any non-zero value here is a new cost rather than a reallocation. The 15% ceiling is the upper end of what developers describe for a consented storage project.',
      '开发成本占建设造价的比例 — 土地、规划、电网研究、法务及并网申请。种子值为零，因为公开的安装成本基准属EPC范围、本就不含开发成本，故此处任何非零值都是新增成本而非重新分配。15%上限为开发商对已获许可储能项目所述的上端水平。',
    ],
    source: 'No published series; bound set from developer commentary',
    gate: 'G25',
  }),
  rtbPremiumPct: limits(0, 0, 200, {
    basis: [
      'The margin an RTB seller takes over its development cost. An RTB trade is a private bilateral and no market publishes either leg, so this is an input by necessity. The ceiling is deliberately wide: at a scarce connection point a premium of more than 100% of development cost is not unusual, and a narrow bound would imply a precision that does not exist.',
      'RTB卖方在其开发成本之上收取的margin。RTB交易属私下双边交易，且没有市场公布其中任一部分，因此这必然是一个输入项。上限刻意设宽：在稀缺并网点，超过开发成本100%的溢价并不罕见，而过窄的边界会暗示一种并不存在的精确度。',
    ],
    source: 'Never published, in any market',
    gate: 'G25',
  }),
  constructionMonths: limits(12, 9, 60, {
    basis: [
      'Notice to proceed through to commercial operation. Twelve months is one spend period and reproduces the single up-front outflow the model has always used; beyond that the spend spreads across an S-curve and first revenue moves out. The ceiling is set by transformer supply rather than by construction: tier-1 HV power transformer lead times ran 2.5-5 years through 2026, so an HV connection can be the binding path.',
      '自开工令至商业运行。12个月为单一支出期，可复现模型一贯采用的单笔前置支出；超过则支出按S曲线分摊、首年收入相应推迟。上限由变压器供应而非施工决定：2026年一线高压电力变压器交付周期为2.5–5年，因此高压并网可能成为制约路径。',
    ],
    source: 'Transformer lead-time reporting, 2026; no published BESS build programme by market',
    gate: 'G26',
  }),
  capexPerMW: band(economics.capexPerMW, 180 * 4000, 260 * 4000, {
    basis: [
      'European turnkey 4h LFP is €180–260/kWh installed, i.e. €720k–1.04m/MW. The seed of €290/kWh sits above the European ceiling; Irish grid connection and island-market construction costs are the usual explanation.',
      '欧洲4小时磷酸铁锂交钥匙安装成本为€180–260/kWh，即每MW €72万–104万。种子值€290/kWh高于欧洲区间上限，通常归因于爱尔兰并网成本及岛屿市场施工成本。',
    ],
    source: '2026 European BESS turnkey EPC surveys (€180–260/kWh, 4h LFP)',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No published SEM-specific fixed-opex series. €10,000/MW/yr is ≈US$10,800, below the US utility-scale benchmark of US$15–25k/MW/yr, which is context rather than a bound.',
      '无SEM市场专属固定运维公开序列。€10,000/MW/年约合US$10,800，低于美国公用事业级基准US$15–25k/MW/年 — 后者仅为参照，非边界。',
    ],
    source: 'Platform seed',
    gate: 'G13',
  }),

  contracted: band(economics.contracted, null, Math.round(149.96 * capacity.derating * 1000), {
    basis: [
      'The 2029/30 T-4 (April 2026) cleared €135,499.99/MW/yr and the 2028/29 T-4 cleared €149,960 — about 10% higher. Both applied at the seeded 4h de-rating factor of 66%. The newer auction is what a market-entry benchmark carries; the older one is the ceiling.',
      '2029/30年度T-4拍卖（2026年4月）出清价为€135,499.99/MW/年，2028/29年度T-4为€149,960，高出约10%。两者均按种子设定的4小时可信容量系数66%换算。市场进入基准采用较新一次拍卖结果，较早一次作为上限。',
    ],
    source: 'SEM-O PCAR2930T-4 and PCAR2829T-4 final auction results',
  }),

  contractYears: limits(economics.contractYears, 1, 10, {
    basis: [
      'Ten years is the maximum capacity agreement available to new-build storage in the SEM; shorter agreements are also awarded.',
      '十年为SEM市场新建储能可获得的最长容量协议期限；较短期限的协议亦有授予。',
    ],
    source: 'SEM Capacity Remuneration Mechanism agreement lengths',
  }),

  postFactor: limits(economics.postFactor, 0, 1, {
    kind: 'dispersed',
    basis: [
      'What the capacity line is assumed to be replaced by after year 10. De-rating factors are already eroding capacity payments, hardest at short duration, so 0.6 is not a neutral assumption.',
      '第10年后容量收入假设可被替代的水平。可信容量系数已在侵蚀容量收入，且对短时长资产影响最大，因此0.6并非中性假设。',
    ],
    source: 'Methodology — no forward T-4 price forecast is carried',
  }),

  merchGross: band(economics.merchGross, null, null, {
    basis: [
      'Irish wholesale spreads average ~€103/MWh on a merit order with no mid-merit cushion — wind and solar at zero marginal cost sit directly below gas. No published per-MW Irish merchant benchmark exists to bound it two-sidedly.',
      '爱尔兰批发价差平均约€103/MWh，其调度序列缺乏中间负荷缓冲 — 边际成本为零的风电与光伏直接位于燃气之下。目前无公开的爱尔兰每MW市场化收入基准可提供双向边界。',
    ],
    source: 'SEM wholesale spread ~€103/MWh; platform seed for the per-MW level',
  }),

  feePct: limits(economics.feePct, 6, 12, {
    kind: 'dispersed',
    basis: [
      'Optimiser fees across the platform\'s six markets run 8–10% of market revenue; the band widens that by the stated dispersion.',
      '本平台六个市场的优化商费用为市场化收入的8–10%；该区间在此基础上按既定离散幅度扩展。',
    ],
    source: 'Platform cross-market seeds, widened by the stated dispersion',
  }),

  /* The one band on this page that is deliberately lopsided. */
  services: band(economics.services, null, Math.round(0.40 * economics.merchGross), {
    basis: [
      '€8,000/MW/yr is inherited and unverified. Modo describes DS3 as historically the dominant Irish revenue source, which €8,000 against €71,200 of merchant does not reflect. The ceiling applies the GB precedent — frequency response was 40–50% of battery revenue through 2020 — to the Irish merchant leg. The DS3→FASS decay curve applies on top of whatever level is set.',
      '€8,000/MW/年为沿用且未经验证的数值。Modo称DS3历史上是爱尔兰最主要的收入来源，而€8,000相对于€71,200的市场化收入并不符合这一描述。上限参照英国先例 — 2020年前调频收入占电池收入的40–50% — 应用于爱尔兰市场化收入。DS3至FASS的衰减曲线在所设水平之上叠加适用。',
    ],
    source: 'EirGrid DS3 settlement data would replace it; GB FFR share 40–50% (2020) used for the ceiling',
    gate: 'G6',
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

export const comparison = {
  archetype: {
    powerMW: 50,
    durationHours: 4,
  },

  score: {
    composite: 60,
    connectionRisk: 48,
  },

  capabilities: {
    capacityMarket: true,      // CRM, against a Reliability Option
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics,
  ranges,

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Reliability Option difference payments are additive to merchant, so both merchant legs are exposed from commercial operation. The DS3-to-FASS transition after year 1 is carried by servicesCurve rather than folded into the seed — which is the arrangement the platform-wide vintage rule was later generalised from.',
    '第1年。可靠性期权差价支付与市场化收入并存，因此两个市场化收入项自商业运行起即处于敞口状态。第1年之后由DS3向FASS的过渡由servicesCurve承载，而非并入种子值 — 本平台的口径年度规则正是由这一做法推广而来。',
  ]),

  narrative: {
    archetype: ['50 MW · 4h · CRM-led', '50MW · 4小时 · 容量机制主导'],
    thesis: [
      'Still the highest capacity pay per nameplate MW in the set, but the second revenue leg is being legislated away: DS3 ends in 2026 and FASS replaces a fixed tariff with an auction. Underwrite the capacity contract and the wholesale spread, not the system-services line.',
      '每铭牌MW容量付费仍为样本最高，但第二收入支柱正被立法取消：DS3于2026年终止，FASS将固定电价改为竞价。承销依据应为容量合同与批发价差，而非系统服务收入。',
    ],
    pipelineRatio: '~10×',
  },
};

export default comparison;
