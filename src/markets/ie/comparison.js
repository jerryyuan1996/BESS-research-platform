/* Ireland: source-matched 2029/30 awarded-vintage illustration.
   Six hours is the approved research candidate, not an underwriting clearance.
   The four-hour archetype stays the scaling anchor. Services and their decay
   remain analyst assumptions; no DS3 right is extended beyond the long-stop.
   See docs/ireland-six-hour-learning-2026-11-01.md. */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';
import { quotedEconomics } from '../../comparison/supplierQuote.js';

const capacity = {
  price: 135.50,
  unit: 'kW',
  priceCurrency: 'EUR',
  fxToMarket: 1,
  derating: 0.277,
  auction: ['T-4, 26 March 2026; final results 5 May', '2026年3月26日T-4拍卖；5月5日最终结果'],
  deliveryYear: 2029,
  source: 'SEMO 2029/30 final results: €135,499.99/MW-year; IAIP2930T-4 v1.1 Table 3, 40–50 MW row: 4h factor .277. Approved 1 Nov 2026.',
  note: [
    'Award-vintage illustration, not an available new-entry price. Verify awarded MW, term and contract start against the project’s first revenue date.',
    '已授标批次参考情景，并非当前可取得的新入场价格。须核对获付MW、期限及合同开始日与项目首笔收入日期。',
  ],
};

/* Assumed services multipliers, index 0 = operating year 1. Retained by the
   analyst; relative years do not assert a calendar date for FASS commencement. */
const DS3_TO_FASS = [
  1.00,   // operating year 1: assumed competitive income
  0.85,   // operating year 2: assumed decay
  0.45,   // operating year 3: retained assumed step
  0.30,   // yr 4
  0.25,   // yr 5
  0.22, 0.22, 0.21, 0.21, 0.20, 0.20, 0.19, 0.19, 0.18, 0.18,
];

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 1160000;

/* The supplier quotation's DC block inside that total — method HELD: the total is a
   2026 European price survey that already prices today's DC blocks, so it stands and
   the quote says how much of it is the block (src/comparison/capex.js). */
const OPEX_SEED_PER_MW = 10000;
const QUOTED = quotedEconomics({ currency: 'EUR', hours: 4, method: 'held', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

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
  capexStack: QUOTED.capexStack,
  capexQuotedPerMW: QUOTED.capexQuotedPerMW,
  vatPct: 23, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  /* The flat seed was 10,000/MW/yr. The supplier's service package now runs as its own
     back-loaded line below, and this is the rest of fixed opex: the seed less the
     package's fifteen-year mean, so the fifteen-year total is unchanged. */
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // €135.50 × 1,000 × .277 = €37,533.50/MW/year
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
    'Assumed competitive services income, uncontracted and included in trading. The existing GB-calibrated decay is retained by the analyst; it is not continued DS3 tariffs beyond 30 September 2027. The successor start is unconfirmed.',
    '假设的竞争性辅助服务收入，未签约并计入交易收入。分析师保留既有英国经验递减曲线；这不代表2027年9月30日之后继续享有DS3费率。后继机制启动日期未确认。',
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

  contracted: band(economics.contracted, null, 149.96 * 0.268 * 1000, {
    basis: [
      'Keep price and credit within one award vintage: 2029/30 uses €135.50/kW-year × .277; the 2028/29 context ceiling uses €149.96 × .268. Verify actual awarded quantities and payment dates.',
      '价格和计入比例须属于同一授标批次：2029/30采用每kW年€135.50乘.277；2028/29参考上限采用€149.96乘.268。须核实实际获付数量及付款日期。',
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
      'Optimiser fees in Great Britain, Ireland, Western Australia, Romania, Poland and Japan run 8–10% of market revenue; the band widens that by the stated dispersion.',
      '英国、爱尔兰、西澳、罗马尼亚、波兰与日本的优化商费用为市场化收入的8–10%；该区间在此基础上按既定离散幅度扩展。',
    ],
    source: 'Platform cross-market seeds, widened by the stated dispersion',
  }),

  /* The one band on this page that is deliberately lopsided. */
  services: band(economics.services, null, Math.round(0.40 * economics.merchGross), {
    basis: [
      'Retained analyst assumption: €8,000/MW-year, with the existing decay and exploratory upper bound. Neither seed nor bound is an Irish successor-auction price; verify captured income and simultaneous availability.',
      '分析师保留的假设：每MW年€8,000、既有递减曲线和探索上限。种子值及上限均非爱尔兰后继拍卖价格；须核实实际捕获收入和同时履约能力。',
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

  /* How each line scales with duration, for the design-fit sweep
     (src/comparison/designFit.js). Shapes relative to four hours; the levels
     stay the engine's. Both curves are the dashboard's (data.js), moved over
     unchanged; its 4h de-rating point matches the capacity line's 0.66. */
  durationResponse: {
    hours: [1, 2, 4, 6, 8],
    capacityDerating: [0.072, 0.143, 0.277, 0.425, 0.549],
    capacityDeratingBasis: 'published',
    merchantCapture: [1.12, 1.00, 0.86, 0.75, 0.66],
    merchantCaptureBasis: 'seed',
    opexEnergyShare: 0.5,
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
      'Match capacity payment to the award vintage. Six hours improves hold IRR over four at the reviewed inputs, but remains below the fund’s target. Services are retained as assumed, uncontracted trading income. Verify cost scope, captured trading and actual contract dates before pricing.',
      '容量付款须匹配授标批次。在已复核输入下，六小时长持IRR高于四小时，但仍低于基金目标。辅助服务保留为假设、未签约的交易收入。定价前须核实造价范围、交易捕获及实际合同日期。',
    ],
    pipelineRatio: '~10×',
  },
};

export default comparison;
