/* ---------------------------------------------------------------------------
   Australia — National Electricity Market (NEM). Comparison interface.
   Economics are per MW per year, in AUD.

   THE PLATFORM'S SECOND AUSTRALIAN MARKET, AND WA'S OPPOSITE.

   Western Australia's WEM pays for capacity through the Reserve Capacity
   Mechanism. The NEM has no capacity market at all and is staying that way: the
   Nelson Review's final report (16 December 2025) explicitly keeps the
   energy-only model, and every NEM jurisdiction except Queensland had agreed the
   remaining recommendations by March 2026. So the two Australian markets on this
   platform differ on the single question the comparison engine cares about most,
   which is why both are carried rather than one.

   REFERENCE REGION: NSW1. The NEM is five regions with genuinely different
   prices, and modelling a national average would produce a market that does not
   exist. New South Wales is the reference because it is the deepest and best
   instrumented: the largest installed fleet (4,865 MWh of the ~19 GWh NEM total
   at Q2 2026), the largest single share of CIS Tender 3, and the only region
   with a second, separately-priced long-term contracting route — the NSW
   Roadmap LTESA. It is also representative rather than exceptional: over
   October 2025 to March 2026 NSW revenues fell 51%, between Queensland's 73%
   collapse and South Australia's 49% growth. South Australia would have
   mis-anchored the model badly in the other direction.

   THREE ROUTES, AND NO CAPACITY ROUTE.

     merchant   energy arbitrage, which drives more than 95% of forecast
                merchant revenue over asset life
     toll       a virtual toll. Snowy Hydro / Akaysha signed a 15-year, 220 MW
                arrangement over the 311 MW Elaine BESS in September 2025 — the
                largest four-hour virtual toll in the market. NO AUSTRALIAN TOLL
                PRICE HAS EVER BEEN DISCLOSED, for any deal.
     ltda       the Capacity Investment Scheme, modelled below

   THE CIS IS NOT A FIXED PAYMENT, AND MODELLING IT AS ONE NEEDS SAYING OUT LOUD.

   A CIS agreement is a two-sided collar: the Commonwealth pays 90% of the
   shortfall below an agreed annual revenue floor and takes 50% of revenue above
   an agreed ceiling, with the project keeping 100% in between. Bidders submit
   the floor, the ceiling and an annual payment cap, and NONE of those are
   published for any project — they are commercial-in-confidence, and the Nelson
   Review's recommendation that the successor scheme SHOULD publish its clearing
   prices is the clearest confirmation that this one does not.

   While the floor binds, owner receipts are R + 0.9 × (floor − R), which is
   0.9 × floor + 0.1 × R — a fixed payment plus a 10% retention of market
   revenue, exactly the shape `ltda` already models. That linearisation is exact
   only in the floor-binding regime, and at today's merchant levels the floor
   does bind. It stops being exact if merchant revenue recovers past the floor,
   where retention steps to 1.0. See the ranges for what that means.

   The floor itself has to be estimated because nothing publishes it. Two
   independent build-ups bracket it, and their midpoint is what the seed uses;
   the derivation is in the `ltda` block below.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';

/* GenCost 2025-26 (CSIRO, 15 July 2026) puts a four-hour BESS at A$385/kWh
   installed. 4 h × 1,000 kWh/MW × 385 = A$1.54m/MW. The figure decomposes
   consistently with GenCost's own 2 h ($525/kWh) and 24 h ($266/kWh) points on a
   common ~$560/kW power cost plus ~$245/kWh energy cost, and reproduces Modo's
   independent finding that four hours costs about 1.5× two hours. */
const CAPEX_PER_KWH = 385;
const HOURS = 4;

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = CAPEX_PER_KWH * HOURS * 1000;

const economics = {
  capexPerMW: CAPEX_PER_KWH * HOURS * 1000,     // A$1,540,000

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
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, HOURS),
  vatPct: 10, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  opexPerMW: 20000,

  /* No capacity mechanism exists, so the contracted line is genuinely zero
     rather than small — the same declaration Romania makes, for the same
     reason. The NSW LTESA is a separate structure and is documented on the
     dashboard rather than modelled as a capacity payment; it is an option to
     draw a tapering annuity, not a payment for availability. */
  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* Modo's ME BESS AUS NEM index for calendar 2025 is A$128k/MW/yr across a
     fleet averaging 2.38 h (18,961 MWh over 7,960 MW, June 2026). Strip the 9%
     FCAS share carried separately below, scale to the four-hour archetype, and
     apply the 0.95 capture penalty Modo measured on a four-hour unit against
     adjacent two-hour units:

         128,000 × 0.91 × (4 / 2.38) × 0.95 ≈ 186,000

     A full calendar year is the right basis for a fifteen-year model. The
     six-month window to March 2026 would give ≈105,000 and May 2026 alone
     ≈42,000 — those are the floor of the range, not the seed. */
  merchGross: 186000,
  feePct: 5,

  /* FCAS, which is power-based and therefore does NOT scale with duration.
     9% of the calendar-2025 index; AEMO's Q2 2026 quarterly puts FCAS at 8.3% of
     battery revenue after a 51% quarterly fall, so this is a saturating line. */
  services: 9000,

  grantPct: 0,
  degr: 2,

  /* The NEM-specific haircut, and the reason this field exists at all outside
     WA. Two components, both on market revenue:
       · marginal loss factors, a permanent settlement multiplier — Modo measured
         the average cost to NEM batteries at A$3.2k/MW/yr in 2024, ≈2.2% of that
         year's index, with several NSW and QLD assets facing further declines
       · network curtailment, ≈90,929 MWh across the battery fleet in 2025
     Together ≈5%. */
  naqFactor: 0.95,

  /* No Australian toll price has ever been disclosed — not for Elaine, Orana,
     Brendale, Western Downs or any other deal. A virtual toll transfers all
     market risk to the offtaker, so it must clear below risk-adjusted expected
     merchant revenue; the NSW LTESA Round 6 cap of A$150k/MW/yr brackets it from
     above for the same asset class in the same region. */
  toll: 140000,
  tollYears: 15,
  tollRevertsToMerchant: true,

  ltda: {
    /* 0.9 × an estimated A$135k/MW/yr floor.

       Floor build-up (a): legal commentary describes the floor as referable to
       operating costs and debt service. At A$1.54m/MW, 60% gearing, 7% cost of
       debt over 15 years: 0.924m × 0.10979 ≈ A$101k debt service, plus A$20k
       opex ≈ A$121k.
       Floor build-up (b): the NSW LTESA Round 6 competitively-bid annuity cap
       for lithium-ion, same region and asset class, ≈A$150k.
       Midpoint A$135k; the Commonwealth pays 90% of the shortfall to it. */
    payment: 121500,
    years: 15,
    merchantRetention: 0.10,
    /* A competitively bid underwrite and a capital grant would be support
       counted twice; the CIS displaced grants rather than joining them. */
    excludesGrant: true,
    note: [
      'CIS agreement: Commonwealth pays 90% of the shortfall below an agreed floor and takes 50% above a ceiling. Floor, ceiling and payment cap are commercial-in-confidence for every project.',
      'CIS协议：联邦政府补足低于约定下限部分的90%，并分享超出上限部分的50%。各项目的下限、上限及支付上限均属商业机密。',
    ],
  },

  capNote: [
    'The NEM has no capacity mechanism. The Nelson Review kept the energy-only model in December 2025.',
    'NEM没有容量机制。2025年12月的Nelson评估维持了纯电量市场模式。',
  ],
  tollNote: [
    '15-yr precedent tenor (Snowy Hydro / Akaysha, Elaine BESS, Sep 2025); no Australian toll price has been disclosed',
    '先例期限15年（Snowy Hydro/Akaysha，Elaine储能，2025年9月）；澳大利亚从未披露过租赁价格',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   The NEM has the widest merchant band on the platform and it is entirely
   sourced: the same fleet index ran from A$29k/MW/yr in May 2026 — the lowest
   month since the index launched in July 2022 — to A$148k across calendar 2024,
   before any duration scaling. A market whose realised revenue moves five-fold
   in two years should not be represented by one number, and here it is not.
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
  capexPerMW: band(economics.capexPerMW, 355 * HOURS * 1000, null, {
    basis: [
      'CSIRO GenCost 2025-26 puts a 4h BESS at A$385/kWh installed. The floor applies GenCost\'s own 2h cost trajectory — A$525/kWh in 2025 falling to A$484/kWh by 2030, a 7.8% decline — to the 4h point, giving ≈A$355/kWh. Both × 4,000 kWh/MW.',
      'CSIRO GenCost 2025-26显示4小时储能安装成本为A$385/kWh。下限按GenCost自身的2小时成本轨迹推算 — 2025年A$525/kWh降至2030年A$484/kWh，降幅7.8% — 应用于4小时项目约合A$355/kWh。两者均乘以4,000 kWh/MW。',
    ],
    source: 'CSIRO GenCost 2025-26 Final, 15 July 2026',
    gate: 'G15',
  }),

  opexPerMW: band(economics.opexPerMW, null, 36650, {
    basis: [
      'GenCost carries fixed O&M in an appendix workbook that is not extractable as published text, so no authoritative NEM figure is in hand. A$20,000/MW/yr is ≈1.3% of capex, covering the long-term service agreement, insurance, land, and market and AEMO fees. The ceiling is the only sourced Australian observation found — A$7.33m/yr for a 200 MW plant — which is a WEM project from a vendor publication and probably bundles network charges.',
      'GenCost将固定运维成本置于附录工作簿中，其内容无法作为已发布文本提取，因此暂无权威的NEM数据。A$20,000/MW/年约为造价的1.3%，涵盖长期服务协议、保险、土地及市场与AEMO费用。上限为唯一可查的澳大利亚观测值 — 200MW电站每年A$733万 — 但该数据来自供应商刊物、属WEM项目，且可能包含电网费用。',
    ],
    source: 'CSIRO GenCost 2025-26 Appendix B (not machine-extractable); vendor observation for a 200 MW WEM plant',
    gate: 'G13',
  }),

  merchGross: band(economics.merchGross,
    Math.round(29000 * 0.91 * (4 / 2.38) * 0.95),
    Math.round(148000 * 0.91 * (4 / 2.38) * 0.95), {
      basis: [
        'Modo\'s ME BESS AUS NEM index, both ends scaled to the 4h archetype on the same basis as the seed. The floor is May 2026 — A$29k/MW/yr, the lowest month since the index launched in July 2022 — and the ceiling is calendar 2024 at A$148k, the year before spreads compressed. The seed is calendar 2025 at A$128k. NEM-wide charge/discharge spreads fell 85% year-on-year in Q2 2026 as the fleet passed 9,000 MW, so the direction of travel within this band is downward.',
        '数据来自Modo的ME BESS AUS NEM指数，两端均按与种子值相同的口径折算至4小时原型。下限为2026年5月的A$29k/MW/年 — 该指数自2022年7月推出以来的最低月份 — 上限为2024日历年的A$148k，即价差收窄前的年份。种子值为2025日历年的A$128k。随着装机规模突破9,000MW，2026年第二季度全NEM充放电价差同比下跌85%，因此该区间内的趋势方向向下。',
      ],
      source: 'Modo Energy ME BESS AUS NEM Index; AEMO Quarterly Energy Dynamics Q2 2026',
    }),

  feePct: limits(economics.feePct, 3, 10, {
    kind: 'part-sourced',
    basis: [
      'No Australian optimiser fee is disclosed. Third-party optimisation covers more than 800 MW of NEM storage, and the reported generic band for revenue-share models is 3–10%; some structures instead split revenue above a floor 50/50. 5% is the midpoint.',
      '澳大利亚未披露优化商费率。第三方优化服务覆盖NEM超过800MW储能，收益分成模式的公开区间为3–10%；部分结构则对高于保底线的收益按50/50分成。5%为区间中值。',
    ],
    source: 'GridBeyond BESS revenue models (generic 3–10% band); no Australian disclosure',
  }),

  services: band(economics.services, 2400, 11520, {
    basis: [
      'FCAS is structurally saturating. The floor is AEMO\'s Q2 2026 quarterly — A$4.8m across a ~7,960 MW fleet, annualised — after FCAS fell 51% in a single quarter to 8.3% of battery revenue. The ceiling is 9% of the calendar-2025 index. FCAS is a power-based service and does not scale with duration, so neither end is adjusted for the 4h archetype.',
      'FCAS正在结构性饱和。下限为AEMO 2026年第二季度数据 — 约7,960MW装机对应A$480万，年化计算 — 此前FCAS单季度下跌51%，占储能收入比重降至8.3%。上限为2025日历年指数的9%。FCAS属功率型服务，不随时长扩展，故两端均未按4小时原型调整。',
    ],
    source: 'AEMO Quarterly Energy Dynamics Q2 2026; Modo ME BESS AUS NEM Index',
  }),

  /* Both ends are real signed deals. */
  toll: band(economics.toll, 133000, 150000, {
    basis: [
      'No Australian BESS toll price has ever been disclosed, so both ends are derived rather than quoted. The floor applies a 30% offtaker risk discount to the implied long-run merchant level; the ceiling is the NSW LTESA Round 6 average annuity cap of A$150k/MW/yr, which is what the same asset class clears at under a competitively bid state contract in the same region — a toll cannot rationally price above the state\'s own cap for a comparable structure.',
      '澳大利亚从未披露过储能租赁价格，故两端均为推导值而非报价。下限为对隐含长期市场化收入水平施加30%承购方风险折价；上限为新南威尔士LTESA第6轮平均年金上限A$150k/MW/年，即同一区域、同类资产在竞争性投标的州级合同下的出清水平 — 租赁价格不可能理性地高于州政府对可比结构自身设定的上限。',
    ],
    source: 'Snowy Hydro / Akaysha Elaine BESS 15-yr virtual toll (Sep 2025, price undisclosed); NSW LTESA Round 6 annuity cap',
    gate: 'G16',
  }),

  tollYears: limits(economics.tollYears, 12, 15, {
    basis: [
      'Both ends observed: EnergyAustralia / Akaysha contracted 12 years over 200 MW of the Orana BESS in August 2024; Snowy Hydro / Akaysha contracted 15 years over 220 MW of the 311 MW / 1,244 MWh Elaine BESS in September 2025, described as the largest four-hour virtual toll in the Australian market.',
      '两端均为实测值：EnergyAustralia与Akaysha于2024年8月就Orana储能200MW签订12年合约；Snowy Hydro与Akaysha于2025年9月就311MW/1,244MWh的Elaine储能220MW签订15年合约，被称为澳大利亚市场最大的四小时虚拟租赁交易。',
    ],
    source: 'Snowy Hydro (Sep 2025); EnergyAustralia (Aug 2024)',
  }),

  'ltda.payment': band(economics.ltda.payment, 108000, 135000, {
    basis: [
      'CIS floors are commercial-in-confidence for every project, so both ends are 90% of a bracketed floor. The low end takes the debt-and-opex build-up (A$120k floor → A$108k); the high end takes the NSW LTESA Round 6 annuity cap as the floor proxy (A$150k → A$135k). The seed is 90% of the A$135k midpoint. Round 5 cleared at ≈A$185k and Round 6 at ≈A$150k — a 19% compression in one round, which is the direction to read this band in.',
      '各项目的CIS保底价格均属商业机密，故两端均取推算保底值的90%。下限采用债务与运维成本推算（保底A$120k → A$108k）；上限以新南威尔士LTESA第6轮年金上限作为保底代理（A$150k → A$135k）。种子值为A$135k中值的90%。第5轮出清约A$185k、第6轮约A$150k — 单轮压缩19%，这正是解读该区间应有的方向。',
    ],
    source: 'DCCEEW Capacity Investment Scheme (floors unpublished); NSW Roadmap LTESA Round 5 and 6 annuity caps',
    gate: 'G17',
  }),

  'ltda.years': limits(economics.ltda.years, 10, 15, {
    basis: [
      'CIS agreements run 10–15 years and the term is a biddable variable, so the awarded term is not published either. 15 years suits a four-hour asset with a twenty-year life. CIS Tender 8 storage must be operational by 31 December 2029.',
      'CIS协议期限为10–15年，且期限属可投标变量，因此实际授予期限亦不公开。15年适用于寿命二十年的四小时资产。CIS第8轮招标的储能项目须于2029年12月31日前投运。',
    ],
    source: 'DCCEEW Capacity Investment Scheme tender documentation',
  }),

  naqFactor: limits(economics.naqFactor, 0.90, 0.98, {
    kind: 'part-sourced',
    basis: [
      'Marginal loss factors plus network curtailment, both on market revenue. The high end is an asset sited close to a regional reference node, where battery MLFs sit much nearer 1.0 than solar or wind. The low end is a constrained sub-region: Modo reports some batteries carrying MLF costs 5–10× the A$3.2k/MW/yr fleet average, and the Blyth BESS lost an estimated 14,180 MWh to network curtailment across June and July 2025 alone. Modo separately finds location moves IRRs by up to 1.8 percentage points.',
      '包括边际损耗系数与网络限电，二者均作用于市场化收入。上限对应邻近区域参考节点选址的资产，此类电池的MLF远比光伏或风电更接近1.0。下限对应受约束的次区域：Modo报告部分电池承担的MLF成本达全行业平均A$3.2k/MW/年的5–10倍，而Blyth储能仅在2025年6至7月就因网络限电损失约14,180MWh。Modo另发现选址可使内部收益率相差最多1.8个百分点。',
    ],
    source: 'Modo Energy NEM marginal loss factor analysis; WattClarity 2025 fleet curtailment review',
    gate: 'G18',
  }),

  degr: limits(economics.degr, 1, 4, {
    kind: 'dispersed',
    basis: [
      'The band is wider than every other market on this platform because the NEM is where degradation is most value-relevant: Modo finds Queensland projects face value reduction once degradation costs are included. Australian warranties commonly guarantee 60–70% capacity retention, and industry commentary warns explicitly that a model assuming 2%/yr overstates revenue where the asset fades at 4%.',
      '该区间宽于本平台其他任何市场，因为NEM是衰减对价值影响最显著的市场：Modo发现，一旦计入衰减成本，昆士兰项目将出现价值下降。澳大利亚质保通常保证60–70%的容量保持率，业内评论明确警告：若资产实际衰减率为4%，按2%/年建模将高估收入。',
    ],
    source: 'Australian BESS warranty envelopes; Modo NEM outlook April 2026',
    gate: 'G13',
  }),
};

export const comparison = {
  /* The Capacity Investment Scheme, not merchant. Without an explicit base the
     engine would fall back to merchant, because the NEM has no capacity market —
     but merchant is not how a NEM battery reaching financial close in 2026 is
     actually contracted. The CIS has supported 75 projects and 21.6 GWh, and
     Tender 8 alone awarded 4.2 GW in June 2026. The merchant case remains one
     click away on the frontier and in the Lab, which is the point of carrying
     every route rather than one. */
  baseStrategy: 'ltda',

  archetype: {
    /* CIS Tender 8 (24 June 2026), the largest storage procurement in the
       scheme's history, awarded 4,205 MW across 15 standalone lithium-ion
       projects — 280 MW average. The tender was specified four-hour-equivalent
       and reported project durations ran from just over 4 h to more than 5 h. */
    powerMW: 280,
    durationHours: HOURS,
  },

  score: {
    connectionRisk: 46,
  },

  capabilities: {
    /* The one flag that matters here. The NEM is energy-only and the Nelson
       Review kept it that way in December 2025. */
    capacityMarket: false,
    merchant: true,
    ancillaryServices: true,
    tolling: true,
    longTermAward: true,
  },

  economics,
  ranges,

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. The Capacity Investment Scheme underwrites a revenue floor rather than replacing market exposure — the project keeps its market revenue and the Commonwealth tops up below the floor — so both merchant legs are exposed from commercial operation and are stated on the same calendar-2025 fleet basis.',
    '第1年。容量投资计划承销的是收入下限而非取代市场敞口 — 项目保留其市场化收入，联邦政府仅补足低于下限的部分 — 因此两个市场化收入项自商业运行起即处于敞口状态，并按同一2025日历年机组口径列示。',
  ]),

  narrative: {
    archetype: ['280 MW · 4h · NSW1 reference', '280MW · 4小时 · 以NSW1为参考'],
    thesis: [
      'The deepest storage build in the set and the thinnest contracted revenue to underwrite it. There is no capacity market and there will not be one, so certainty has to be bought — through a CIS floor whose level nobody publishes, or a virtual toll whose price nobody discloses. Meanwhile the merchant leg that funds everything else fell to a record low in May 2026 as the fleet passed 9,000 MW.',
      '本样本中储能建设规模最深，而可用于承销的合同化收入最薄。这里没有容量市场，未来也不会有，因此确定性必须购买 — 或通过无人公布水平的CIS保底价格，或通过无人披露价格的虚拟租赁。与此同时，支撑其余一切的市场化收入随装机突破9,000MW，于2026年5月跌至历史新低。',
    ],
    pipelineRatio: '~4.5×',
  },
};

export default comparison;
