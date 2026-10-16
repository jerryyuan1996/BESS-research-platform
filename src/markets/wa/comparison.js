/* ---------------------------------------------------------------------------
   WA — comparison interface.

   This is the ONLY thing the global comparison engine reads from this market. It
   is a deliberate, narrow contract: the dashboard below it holds far more detail
   (RCM forecasting, dispatch co-optimisation, a project underwriting layer) and
   none of that is visible to the home page.

   Economics are per MW per year, in AUD.

   REVISED 2026-07-30. Three changes, all following from one fact: the WEM now
   prices a SIX-HOUR battery, and we were buying eight.

   1. DURATION 8h → 7h. The ERA's 2028-29 benchmark facility is 200 MW /
      1,200 MWh, and flexible capacity credits require defending a six-hour
      dispatch window. Eight hours bought a third more energy capex than the
      mechanism pays for. Seven keeps a ~17% buffer over the six-hour obligation
      for round-trip efficiency, degradation across the ten-year election, and
      availability — a battery that cannot defend the window loses the credit,
      so the buffer is the product, not padding.

      CORRECTED 2026-10-15, gate DG-6: the buffer is ZERO. AEMO's 2026 ESOO set
      the ESR Duration Requirement at seven hours for storage certified in the
      2026 Reserve Capacity Cycle, which is Capacity Year 2028-29, and credits
      are re-certified every cycle at min(MW, MWh ÷ 7h) with degradation
      counted (ESM Rules 4.11.3). Holding full credits for the ten-year
      election without augmentation needs about 8.4h; the ten-year fixed price
      tests a 7.5h floor every cycle, which needs about 9.0h
      (docs/duration-and-route-fit-research-gates.md). The archetype is
      unchanged here: it is methodology, and the design-fit sweep reports it.

      Capex per kWh is UNCHANGED at A$520 — the ERA's own benchmark figure, and
      the one number in this file that was already exactly right. A$520/kWh sits
      well above CSIRO's national A$301-377/kWh, so it embeds WA's regional
      premium and may embed more than that.

   2. CAPACITY PRICE. The BRCP for 2028-29 rose 35% to A$488,500/MW (ERA final
      determination, 13 March 2026 — the A$491,700 this file first carried
      was the February draft), but AEMO
      forecasts a surplus for the first three years of the outlook — 347 MW
      against a Peak RCR of 6,323 MW in 2028-29 — and a surplus suppresses the
      Reserve Capacity Price actually paid. The realised RCP is expected nearer
      A$422,372/MW. That figure is corroborated from the other direction: the
      ten-year fixed-price election is quoted at ~A$844.7m for a 200 MW battery,
      which is A$422,350/MW/yr. The surplus-adjusted estimate was built on the
      draft BRCP; scaling its ratio onto the final (422,372 / 491,700 × 488,500)
      gives ~A$419,600, 0.65% lower. Held at the corroborated figure until AEMO
      assigns Capacity Credits and the realised price is an observation.

   3. THE ELECTION IS NOT FREE CERTAINTY — see naqFactor below.
   --------------------------------------------------------------------------- */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';
import { quotedEconomics, rebuiltEnd } from '../../comparison/supplierQuote.js';

const capacity = {
  /* Quoted per MW, not per kW: the RCM pays a Reserve Capacity Price against
     assigned Capacity Credits rather than a per-kW clearing price against a
     de-rating factor. The seven-hour build is what secures the full flexible
     credit, so the factor here is 1 and the buffer lives in the archetype. */
  price: 422372,
  unit: 'MW',
  priceCurrency: 'AUD',
  fxToMarket: 1,
  derating: 1,
  auction: ['2026 Reserve Capacity Cycle', '2026年备用容量周期'],
  deliveryYear: 2028,
  source: 'Surplus-adjusted RCP for 2028-29; BRCP A$488,500/MW (ERA final determination, 13 Mar 2026), AEMO forecasts a 347 MW surplus',
  note: [
    'Benchmark facility is 200 MW / 1,200 MWh at A$520/kWh. Surplus suppresses the realised RCP below the BRCP.',
    '基准设施为200MW/1,200MWh，A$520/kWh。容量盈余使实际支付的RCP低于BRCP。',
  ],
};

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 3640000;

/* REVISED 2026-10-17 — method REBUILT. The benchmark above is the ERA's 2028-29 benchmark unit cost, priced on
   DC blocks older and dearer than the supplier quotation: its 56% DC slice is replaced
   by the quote landed (A$142.54/kWh at the meter), while PCS, transformer, BOP and EPC
   are held at their benchmark amounts (44% of it). src/comparison/capex.js. */
const OPEX_SEED_PER_MW = 18000;
const QUOTED = quotedEconomics({ currency: 'AUD', hours: 7, method: 'rebuilt', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

const economics = {
  capexPerMW: QUOTED.capexPerMW,   // A$2,599,346; was 7,000 kWh/MW × A$520/kWh (ERA benchmark unit cost)
  capexQuotedPerMW: QUOTED.capexQuotedPerMW,

  /* ---- capital structure -------------------------------------------------
     The stack reconciles exactly to the installed cost above — `stackFrom`
     puts the residual in EPC — so introducing it moved no published return.
     What it adds is the ability to move one component without moving the rest,
     and a place for the market-specific lines to sit visibly rather than
     inside a single number. Component split is global until gate G24 closes.

     VAT is 10% here (GST, recoverable by a registered enterprise). It is carried as timing rather than cost:
     recoverable, so it drags the return only through the refund lag, and the
     lag is zero until an analyst sets one — gate G27. Set `vatRecoverable:
     false` and it capitalises instead.

     `devCostPct` is zero deliberately. Published installed-cost benchmarks are
     EPC scope and exclude development, so a non-zero value here would be a new
     cost rather than a reallocation, and that is an analyst's call — gate G25.
     Set it, then set `rtbPremiumPct`, and the Lab reports the implied RTB
     acquisition price per MW. */
  capexStack: QUOTED.capexStack,
  vatPct: 10, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  /* Seed A$18,000/MW/yr less the service package's fifteen-year mean; the package
     runs as its own back-loaded line. */
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // A$422,372
  contractYears: 10,         // 10-yr fixed-price election
  postFactor: 0.85,

  merchGross: 139000,
  feePct: 8,
  services: 12000,

  /* THE PRICE OF THE FIXED-PRICE ELECTION.

     Electing a fixed Reserve Capacity Price sacrifices transmission access
     priority and forfeits upside. What is actually lost is dispatch headroom:
     Network Access Quantities cap what a facility may export and cannot be
     exceeded, existing "foundation" generators hold priority, and new entrants
     take the remaining headroom. So the cost lands on the ENERGY revenue, not
     on the capacity payment — you keep the credit and lose some of the hours
     in which you could have earned around it.

     10% is an analyst assumption, not an observation. Gate G8 (AEMO WEM
     constraint and dispatch data) is what would replace it with a measurement.

     The other half — forfeiting capacity-price upside if the market tightens —
     is deliberately NOT quantified here. Sizing it means forecasting future
     RCPs, which is methodology rather than observation, and the honest place
     to show it is a sensitivity in the project-debt tab. */
  naqFactor: 0.90,

  grantPct: 0,
  degr: 2,

  capNote: [
    'RCM refund exposure; 10-yr fixed-price election forfeits transmission access priority',
    'RCM退款敞口；10年固定价选择权将丧失输电接入优先权',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. See src/comparison/ranges.js for the two
   derivation rules; each band below states which one it used.
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
  /* A$301/kWh is CSIRO's national low; A$520/kWh is the ERA benchmark this
     market is seeded at. The ERA figure sits well above CSIRO, which is WA's
     regional premium and possibly more than that, so the seed is at the top of
     what anyone has observed and the upper end is dispersion, not evidence. */
  capexPerMW: band(economics.capexPerMW, rebuiltEnd(301 * 7000, 7, 'AUD'), null, {
    basis: [
      'CSIRO GenCost national A$301/kWh at the low end against the ERA benchmark A$520/kWh this market is seeded at, both × 7,000 kWh/MW.',
      '低端为CSIRO GenCost全国口径A$301/kWh，高端为本市场种子所用ERA基准A$520/kWh，均乘以7,000 kWh/MW。',
    ],
    source: 'ERA 2028-29 benchmark facility (200 MW / 1,200 MWh); CSIRO GenCost A$301–377/kWh',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No published WEM-specific fixed-opex series. A$18,000/MW/yr is ≈US$11,900, below the US utility-scale benchmark of US$15–25k/MW/yr, which is context rather than a bound.',
      '无WEM市场专属固定运维公开序列。A$18,000/MW/年约合US$11,900，低于美国公用事业级基准US$15–25k/MW/年 — 后者仅为参照，非边界。',
    ],
    source: 'Platform seed; US utility-scale O&M benchmark US$15–25/kW/yr as context',
    gate: 'G13',
  }),

  /* The BRCP is the administered ceiling; what a facility is paid is the
     surplus-suppressed RCP, which is the seed. Both ends are published. */
  contracted: band(economics.contracted, null, 488500, {
    basis: [
      'BRCP for 2028-29 is A$488,500/MW (+35%, ERA final determination 13 March 2026), but AEMO forecasts a 347 MW surplus against a 6,323 MW Peak RCR and a surplus suppresses the realised price. A$422,372 is the surplus-adjusted level, corroborated by the ten-year fixed-price election at ~A$844.7m for 200 MW.',
      '2028–29年BRCP为A$488,500/MW（上涨35%，ERA于2026年3月13日最终裁定），但AEMO预测在6,323MW峰值容量需求下存在347MW盈余，盈余将压低实际出清价格。A$422,372为经盈余调整后的水平，并由200MW设施十年固定价选择权约A$8.447亿的报价相互印证。',
    ],
    source: 'ERA BRCP 2028-29; AEMO 2026 ESOO capacity balance',
  }),

  contractYears: limits(economics.contractYears, 1, 10, {
    basis: [
      'The fixed-price election runs ten years and is not extendable; below that a facility takes the annually-cleared price instead.',
      '固定价选择权期限为十年且不可延长；低于该期限则须接受按年出清的价格。',
    ],
    source: 'WEM Reserve Capacity Mechanism fixed-price election',
  }),

  postFactor: limits(economics.postFactor, 0, 1, {
    kind: 'dispersed',
    basis: [
      'What the facility retains once the election expires and it returns to the annually-cleared price. 1 assumes the same level clears again; 0 assumes no capacity revenue at all.',
      '选择权到期、回归按年出清价格后设施所保留的比例。取1表示假设同一水平再次出清；取0表示假设不再获得任何容量收入。',
    ],
    source: 'Methodology — no forward RCP forecast is carried',
  }),

  merchGross: band(economics.merchGross, null, null, {
    basis: [
      'No published WEM merchant benchmark equivalent to Modo\'s GB series. The seed is the platform\'s own energy-arbitrage estimate for a seven-hour facility.',
      '西澳无与Modo英国序列相当的公开市场化收入基准。种子值为本平台对七小时设施电能量套利的自有估算。',
    ],
    source: 'Platform seed — WEM energy arbitrage, 7h archetype',
  }),

  feePct: limits(economics.feePct, 6, 12, {
    kind: 'dispersed',
    basis: [
      'Optimiser fees in Great Britain, Ireland, Western Australia, Romania, Poland and Japan run 8–10% of market revenue; the band widens that by the stated dispersion.',
      '英国、爱尔兰、西澳、罗马尼亚、波兰与日本的优化商费用为市场化收入的8–10%；该区间在此基础上按既定离散幅度扩展。',
    ],
    source: 'Platform cross-market seeds, widened by the stated dispersion',
  }),

  services: band(economics.services, null, null, {
    basis: [
      'FCESS revenue for a seven-hour facility. WA\'s FCESS markets are small and thinly reported; no public per-MW series exists.',
      '七小时设施的FCESS收入。西澳FCESS市场规模小且公开披露有限，无公开的每MW收入序列。',
    ],
    source: 'Platform seed — WEM FCESS',
  }),

  naqFactor: limits(economics.naqFactor, 0.75, 1.00, {
    kind: 'dispersed',
    basis: [
      '1.00 is not electing the fixed price and keeping transmission access priority. 0.90 is the seeded 10% dispatch-headroom haircut, which is an analyst assumption rather than a measurement; 0.75 is a materially worse constraint outcome.',
      '取1.00表示不行使固定价选择权、保留输电接入优先权。0.90为种子假设的10%调度裕度折损，属分析师假设而非实测；0.75对应显著更差的约束情形。',
    ],
    source: 'Analyst assumption — AEMO WEM constraint/NAQ data would replace it',
    gate: 'G8',
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
    powerMW: 200,
    durationHours: 7,
  },

  /* How each line scales with duration, for the design-fit sweep
     (src/comparison/designFit.js). Shapes relative to seven hours.

     CAPTURE IS OBSERVED, and is the one curve in this block that is new rather
     than moved: WA's hand-written dashboard carries none. It is the mean daily
     margin of the best contiguous charge window followed by a later contiguous
     discharge window, at 88% round-trip efficiency, perfect foresight and one
     cycle a day, on the published WEM energy reference prices for the twelve
     months to 14 October 2026 (public/data/public/wa-wem-prices.json, through
     meanDailyExecutableSpread). Margin rather than spread, because merchGross
     is net of what charging costs:

         4h 50.46 · 6h 38.25 · 7h 33.02 · 8h 27.35 · 10h 14.79   A$/MWh

     Per megawatt that is flat from six hours to seven: the seventh hour is
     bought for the ESR requirement, not for prices (plan §3.3).

     THE CAPACITY LINE FOLLOWS THE RULE, not a table. Capacity Credits de-rate
     linearly with duration below the ESR Duration Requirement — seven hours
     from AEMO's 2026 ESOO — and, under decision 6 of the plan, that is tested
     year by year as the battery fades, over the ten-year election. Whether the
     seven-hour requirement is the one this archetype's cycle bids into, and
     how the RCM treats fade, were gates DG-6 and DG-5: both closed on
     2026-10-15 — it is, and credits are re-certified every cycle with
     degradation counted. The ten-year fixed price's 7.5h floor is not modelled,
     because the engine prices the surplus-adjusted Reserve Capacity Price. */
  durationResponse: {
    hours: [4, 6, 7, 8, 10],
    merchantCapture: [1.528, 1.158, 1.000, 0.828, 0.448],
    merchantCaptureBasis: 'observed',
    opexEnergyShare: 0.5,
    routeRules: {
      cap: { floorHours: 7, floorKind: 'linear', termYears: 10 },
    },
  },

  capabilities: {
    capacityMarket: true,      // Reserve Capacity Mechanism
    merchant: true,
    ancillaryServices: true,   // FCESS
    tolling: false,            // no WA tolling precedent
  },

  economics,
  ranges,

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. The Reserve Capacity Mechanism payment is additive to merchant revenue rather than a substitute for it, so both merchant legs are exposed from commercial operation and are stated at commissioning-year conditions.',
    '第1年。储备容量机制收入与市场化收入并存而非取代后者，因此两个市场化收入项自商业运行起即处于敞口状态，并按投运年度条件列示。',
  ]),

  narrative: {
    archetype: ['200 MW · 7h · RCM-led', '200MW · 7小时 · RCM主导'],
    thesis: [
      'Capacity-led islanded market, built one hour past the obligation rather than two. The mechanism now prices a six-hour battery; the seventh hour is the buffer that defends the credit, and the eighth was capex the market does not pay for.',
      '容量主导的孤立市场，按义务时长加一小时而非加两小时建设。机制现按6小时电池定价；第7小时是保住容量信用的缓冲，第8小时则是市场不予付费的资本开支。',
    ],
    pipelineRatio: '~2.4×',
  },
};

export default comparison;
