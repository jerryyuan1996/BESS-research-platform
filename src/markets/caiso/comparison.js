/* ---------------------------------------------------------------------------
   CAISO. Comparison interface.
   Economics are per MW per year, in USD.

   THE THIRD US ANSWER, AND THE ONLY ONE WHERE CONTRACT REVENUE IS THE MAJORITY.

   PJM pays for capacity through a published auction that secures one delivery
   year. ERCOT pays for it not at all. CAISO pays for it through bilateral
   Resource Adequacy contracts — and unlike either neighbour, that contracted line
   is most of what a Californian battery earns: RA averaged $8.77/kW-month across
   H1 2025 against merchant earnings nearer $2.5-3/kW-month.

   So the three US markets are not one region modelled three times. They are the
   three available answers to whether capacity should be centrally cleared,
   bilaterally negotiated, or not paid for, and they sit on one federal tax layer
   so the comparison isolates exactly that question.

   FOUR HOURS IS A CEILING HERE, NOT A FLOOR.

   The CPUC sets net qualifying capacity from tested sustained output over four
   hours, and a battery that can discharge for longer receives NO additional RA
   credit for it. That inverts PJM, where the ELCC ladder pays nine points to go
   from four hours to six and nineteen to reach ten. In CAISO the fifth hour earns
   nothing from the contracted line and only what the spread pays from the
   merchant one — which is why this market's duration answer is exactly four, and
   why moving off it is a loss in both directions.

   THE RECONCILIATION THIS MODEL DOES NOT ATTEMPT.

   Modo reports a full CAISO stack of $14.83/kW-month for 2025 with an RA contract
   in place. RA benchmarked at $8.77 and merchant ran $2.5-3. Those do not add up,
   and the residual of roughly $3/kW-month is not explained by any source found.
   It is recorded as a coverage gap rather than allocated to a leg, because
   assigning an unexplained residual to either would fabricate precision.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { stackFrom } from '../../comparison/capex.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { COMPOSITE, CONNECTION_RISK } from './scores.js';

/* Same NREL benchmark and the same four-hour basis as PJM — one capex source
   across the US markets, so the differences between them are mechanism rather
   than a different cost claim. */
const CAPEX_PER_KWH = 334;
const HOURS = 4;
const CAPEX_TOTAL_PER_MW = CAPEX_PER_KWH * HOURS * 1000;   // $1,336,000

/* ---------------------------------------------------------------------------
   RESOURCE ADEQUACY — a contract, not a clearing price.

   $8.77/kW-month is Modo's benchmark of average RA capacity prices across the
   first half of 2025, up more than 12% year on year. Annualised:

     8.77 × 12 × 1,000 = $105,240/MW/yr

   It is a benchmark of many bilateral deals rather than an auction result, which
   is the important difference from PJM: there is no single published number that
   a specific project will receive, and the dispersion is wide. Reported CAISO RA
   ranged $4.29-14.67/kW-month in unconstrained areas as recently as 2022, with
   outliers to $30, and the CPUC recorded 82 instances of load-serving entities
   paying above $100/kW-month between 2023 and 2024. */
const RA_PER_KW_MONTH = 8.77;
const RA_PER_MW_YR = Math.round(RA_PER_KW_MONTH * 12 * 1000);      // 105,240

/* ---------------------------------------------------------------------------
   THE MERCHANT LEGS, BOTH AT THE YEAR-1 VINTAGE.

   RA is additive to merchant rather than a substitute for it — a Californian
   battery sells capacity to a load-serving entity and still trades its own energy
   — so merchant exposure begins at commercial operation and year 1 is the
   vintage. See src/comparison/vintage.js.

   Modo's CAISO merchant benchmark is a single combined figure for energy
   arbitrage and ancillary services. CY2025 ran about $2.6/kW-month across the
   months published — $2.54 in September, $2.99 in October, a record low in
   December — which annualises to $31,200/MW/yr.

     energy   80%  = $24,960/MW/yr
     ancillary 20% = $6,240/MW/yr

   THE 80/20 SPLIT IS ESTIMATED. No source found decomposes the CAISO benchmark,
   and the split is labelled estimated wherever it is used. It is applied only to
   read the published combined figure apart; both forward cases move together on
   the same assumptions, which is the whole point of the vintage rule. */
const MERCHANT_2025_PER_KW_MONTH = 2.6;
const MERCHANT_2025 = Math.round(MERCHANT_2025_PER_KW_MONTH * 12 * 1000);   // 31,200
const ENERGY_SHARE_ESTIMATED = 0.80;

const ENERGY_BASE = Math.round(MERCHANT_2025 * ENERGY_SHARE_ESTIMATED);          // 24,960
const AS_BASE = MERCHANT_2025 - ENERGY_BASE;                                     // 6,240

/* Downside is January 2026 — $1.81/kW-month, the weakest month published — and
   upside is October 2025 at $2.99. Both annualised and split on the same
   estimated share, so the three cases differ in level and not in method. */
const MERCHANT_DOWNSIDE = Math.round(1.81 * 12 * 1000);                          // 21,720
const MERCHANT_UPSIDE = Math.round(2.99 * 12 * 1000);                            // 35,880
const ENERGY_DOWNSIDE = Math.round(MERCHANT_DOWNSIDE * ENERGY_SHARE_ESTIMATED);
const ENERGY_UPSIDE = Math.round(MERCHANT_UPSIDE * ENERGY_SHARE_ESTIMATED);
const AS_DOWNSIDE = MERCHANT_DOWNSIDE - ENERGY_DOWNSIDE;
const AS_UPSIDE = MERCHANT_UPSIDE - ENERGY_UPSIDE;

/* Ancillary saturation, as a path rather than a level — the same treatment PJM's
   Regulation line gets and the same mechanism Ireland and Romania use. CAISO
   ancillary requirements are small relative to a 16.7 GW fleet and rising,
   with batteries about 46% of a roughly 500 GW interconnection queue. The curve
   is a fleet ratio held flat once the requirement is comprehensively oversupplied,
   because nothing published extends the projection further. */
const AS_CURVE = [1, 0.86, 0.76, 0.68, 0.62, 0.58, 0.55, 0.53, 0.52, 0.51, 0.50, 0.50, 0.50, 0.50, 0.50];

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, HOURS),

  /* No US value-added tax. California applies sales tax to equipment with a
     partial manufacturing exemption whose application to standalone storage was
     not settled in a citable source, so nothing is modelled. Gate G29. */
  vatPct: 0, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,

  /* Held equal to PJM, ERCOT and the NEM so cross-market comparison is not
     driven by an unobserved input. */
  opexPerMW: 20000,

  /* Resource Adequacy. A contract with a counterparty and a tenor, which is why
     it uses the standard contracted fields rather than the auction-renewal class
     PJM needs: a CAISO project signs for years, not for one delivery year. */
  contracted: RA_PER_MW_YR,
  /* Ten years. RA tenors are negotiated and range widely; the longest publicly
     named is Ormat's fifteen-year agreement with the City of Riverside. */
  contractYears: 10,
  /* What re-contracting is worth after the first term. California is adding
     storage faster than it is adding RA requirement, so the honest expectation is
     a lower clearing level rather than the same one — but RA has repriced upward
     before, and the CPUC's own procurement backstop puts a floor under demand. */
  postFactor: 0.75,

  merchGross: ENERGY_BASE,
  /* No CAISO optimiser fee is disclosed. Held equal to the other US markets. */
  feePct: 5,
  services: AS_BASE,
  servicesCurve: AS_CURVE,
  servicesNote: [
    'CAISO ancillary requirements are small against a 16.7 GW fleet with batteries about 46% of a ~500 GW queue. The curve is a fleet ratio, flat once the requirement is comprehensively oversupplied.',
    'CAISO辅助服务需求相对于16.7GW的机组规模较小，而储能约占约500GW排队量的46%。该曲线为机组规模比率，在需求被全面超额供给后保持不变。',
  ],

  /* Seeded at zero and editable in the home-page Investment Lab, identical to
     PJM and ERCOT. The credit is federal and moves all three US markets by the
     same proportion. */
  grantPct: 0,
  degr: 2,

  capNote: [
    'Resource Adequacy is a bilateral contract, not a cleared auction price. No single published number is what a specific project receives, and reported RA has ranged $4.29–14.67/kW-month in unconstrained areas.',
    '容量充裕度是双边合约而非拍卖出清价格。不存在某一公开数字即为特定项目所获金额，且非受限区域已报告的容量充裕度价格区间为每kW每月$4.29–14.67。',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   The widest band here is the CONTRACTED line, which is unusual — in every other
   market on this platform the contracted leg is the narrow one and merchant is
   wide. CAISO inverts that because RA is negotiated deal by deal rather than
   cleared, so the dispersion is in the contract and not in the market.
   --------------------------------------------------------------------------- */
const ranges = {
  capexPerMW: band(economics.capexPerMW, 230 * HOURS * 1000, null, {
    basis: [
      'NREL\'s 2025 cost update puts a utility-scale four-hour system at $334/kWh installed, × 4,000 kWh/MW — the same source and basis PJM uses, so any difference between the two US markets is mechanism rather than a different cost claim. The floor is the low end of reported US EPC pricing for four-hour LFP front-of-meter, $230/kWh post-tariff.',
      'NREL 2025年成本更新显示公用事业级四小时系统安装成本为每kWh $334，乘以4,000 kWh/MW — 与PJM采用相同来源与口径，因此两个美国市场之间的差异源于机制而非不同的成本主张。下限取美国四小时LFP电网侧EPC报价低端，即计入关税后的每kWh $230。',
    ],
    source: 'NREL, Cost Projections for Utility-Scale Battery Storage: 2025 Update; reported US EPC pricing',
    gate: 'G15',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No US operator, ISO or laboratory publishes a fixed opex figure for grid-scale storage. $20,000/MW/yr is held equal to PJM, ERCOT and the NEM so that cross-market comparison is not driven by an unobserved input.',
      '美国无任何运营商、独立系统运营机构或实验室公布电网级储能的固定运维成本。每MW每年$20,000与PJM、ERCOT及NEM保持一致，以避免跨市场比较被未观测输入所驱动。',
    ],
    source: 'No published series',
    gate: 'G13',
  }),

  contracted: band(economics.contracted, Math.round(4.29 * 12 * 1000), Math.round(14.67 * 12 * 1000), {
    basis: [
      'Modo benchmarked average CAISO RA capacity prices at $8.77/kW-month across H1 2025, up more than 12% year on year — $105,240/MW/yr. Both band ends are the reported range for RA contracts in unconstrained areas, $4.29 to $14.67/kW-month. This is the widest contracted band on the platform and it is wide for a structural reason rather than a lack of evidence: RA is negotiated bilaterally, so there is no clearing price and a specific project\'s outcome depends on its counterparty, its local capacity area and its deliverability status. Outliers exist in both directions — top earners have reached $30/kW-month, and the CPUC recorded 82 instances above $100/kW-month between 2023 and 2024, which the band deliberately excludes as unrepresentative of a new-build contract.',
      'Modo测算2025年上半年CAISO容量充裕度平均价格为每kW每月$8.77，同比上涨逾12%，折合每MW每年$105,240。区间两端为非受限区域容量充裕度合约的已报告范围，即每kW每月$4.29至$14.67。这是本平台最宽的合同化区间，其宽度源于结构性原因而非证据不足：容量充裕度采取双边协商，不存在出清价格，特定项目的结果取决于其交易对手、所在本地容量区及可交付性状态。两个方向均存在离群值 — 高者曾达每kW每月$30，且CPUC记录到2023至2024年间有82次超过每kW每月$100 — 本区间刻意将其排除，因其不能代表新建项目的合约水平。',
    ],
    source: 'Modo Energy CAISO RA benchmark H1 2025; reported CAISO RA contract range; CPUC RA price observations',
    gate: 'G33',
  }),

  contractYears: limits(economics.contractYears, 5, 15, {
    kind: 'part-sourced',
    basis: [
      'RA tenors are negotiated rather than set by a scheme, and most are not published. The high end is observed: Ormat contracted a fifteen-year RA agreement with the City of Riverside. Ten years is the modelling seed and the low end reflects the shorter rolling contracts that make up much of the market.',
      '容量充裕度期限由协商确定而非由机制规定，且多数未公开。上限为实测值：Ormat与Riverside市签订了十五年期容量充裕度协议。十年为建模种子值，下限反映构成市场大部分的较短期滚动合约。',
    ],
    source: 'Ormat / City of Riverside 15-year RA agreement; no published tenor distribution',
    gate: 'G33',
  }),

  merchGross: band(economics.merchGross, ENERGY_DOWNSIDE, ENERGY_UPSIDE, {
    basis: [
      'Three cases at the year-1 vintage, all from Modo\'s CAISO merchant benchmark and all split on the same estimated 80/20 energy-to-ancillary share. BASE is about $2.6/kW-month across the months published for calendar 2025 — $2.54 in September and $2.99 in October, with a record low in December. DOWNSIDE is January 2026 at $1.81/kW-month, the weakest month published. UPSIDE is October 2025 at $2.99. The band is narrow because CAISO merchant revenue is genuinely the small part of this market: RA at $8.77/kW-month is several times any point in this range, which is why the contracted band above carries the real uncertainty.',
      '三种情形均按第1年口径列示，全部取自Modo的CAISO市场化收入基准，并按同一估算的80/20电能量与辅助服务占比拆分。基准情形为2025日历年已公布月份的约每kW每月$2.6 — 9月为$2.54，10月为$2.99，12月创历史新低。下行情形为2026年1月的每kW每月$1.81，为已公布的最弱月份。上行情形为2025年10月的$2.99。区间较窄，因为CAISO市场化收入确实只是该市场中较小的部分：每kW每月$8.77的容量充裕度收入是本区间任一点的数倍，因此真正的不确定性由上方的合同化区间承载。',
    ],
    source: 'Modo Energy CAISO BESS merchant benchmark, CY2025 and January 2026',
    gate: 'G32',
  }),

  feePct: limits(economics.feePct, 3, 10, {
    kind: 'part-sourced',
    basis: [
      'No CAISO optimiser fee is disclosed. The band is the generic 3-10% revenue-share range reported for third-party optimisation and 5% is the midpoint, held equal to PJM, ERCOT and the NEM.',
      '未披露任何CAISO优化商费率。该区间采用第三方优化服务公开的3–10%通用收益分成范围，5%为中值，并与PJM、ERCOT及NEM保持一致。',
    ],
    source: 'Generic third-party optimisation revenue-share band; no CAISO disclosure',
  }),

  services: band(economics.services, AS_DOWNSIDE, AS_UPSIDE, {
    basis: [
      'The ancillary fifth of the same merchant benchmark, at the same year-1 vintage and on the same estimated 80/20 split. Saturation after year 1 is carried by `servicesCurve` rather than folded into this seed: CAISO ancillary requirements are small against a 16.7 GW fleet, with batteries about 46% of a roughly 500 GW interconnection queue behind it.',
      '同一市场化收入基准中辅助服务所占的五分之一，按相同的第1年口径与相同的估算80/20拆分。第1年之后的饱和由`servicesCurve`承载，而非并入本种子值：CAISO辅助服务需求相对于16.7GW的机组规模较小，其后还有约500GW并网排队，其中储能约占46%。',
    ],
    source: 'Modo Energy CAISO BESS merchant benchmark; CAISO interconnection queue composition',
    gate: 'G30',
  }),

  grantPct: limits(economics.grantPct, 0, 37, {
    kind: 'part-sourced',
    basis: [
      'The §48E investment tax credit, seeded at zero and editable here. Standalone storage qualifies at 30% of eligible basis on construction start through 2033; transferred credits clear at roughly 93 cents, so a sponsor monetising through the transfer market realises about 27.9%. The 37% ceiling adds the 10-point domestic-content adder on the same basis. The floor is zero and it is a cliff rather than a slope: from 2026 a failed Material Assistance Cost Ratio voids the credit entirely. Federal, and identical across all three US markets on this platform.',
      '§48E投资税收抵免，种子值设为零并可在此编辑。独立储能在2033年前开工可享受合格投资基础30%的抵免；转让市场成交价约93美分，故通过转让变现的投资人实际实现约27.9%。37%的上限在同一基础上叠加10个百分点的本土含量加成。下限为零，且属断崖式而非递减式：自2026年起，未通过实质协助成本比率将使该抵免完全失效。该项属联邦层面，在本平台三个美国市场中完全一致。',
    ],
    source: 'IRC §48E; One Big Beautiful Bill Act material-assistance provisions; IRS Notice 2026-15',
    gate: 'G31',
  }),

  devCostPct: limits(economics.devCostPct, 0, 15, {
    basis: [
      'Development cost as a share of build capex — land, CEQA review, interconnection studies and legal. Zero-seeded because published installed-cost benchmarks are EPC scope and already exclude it. CAISO sits at the HIGH end of the range in practice: interconnection has overtaken technology cost as the binding constraint on deployment, and CEQA review is a step Texas has no equivalent of.',
      '开发成本占建设造价的比例 — 土地、CEQA环境审查、并网研究及法务。种子值为零，因为公开的安装成本基准属EPC范围、本就不含开发成本。CAISO在实践中处于该区间高端：并网已取代技术成本成为制约建设的瓶颈，且CEQA审查是德州所没有的环节。',
    ],
    source: 'No published series; bound set from developer commentary',
    gate: 'G25',
  }),

  rtbPremiumPct: limits(economics.rtbPremiumPct, 0, 200, {
    basis: [
      'The margin an RTB seller takes over its development cost. An RTB trade is a private bilateral and no market publishes either leg. CAISO should sit toward the HIGH end for the same reason PJM does: a project holding full-capacity deliverability and a completed study position is scarce against a queue of roughly 500 GW.',
      'RTB卖方在其开发成本之上收取的margin。RTB交易属私下双边交易，市场不公布其中任一部分。CAISO应处于该区间高端，原因与PJM相同：相对约500GW的排队量，持有全容量可交付性并已完成研究流程的项目极为稀缺。',
    ],
    source: 'Never published, in any market',
    gate: 'G25',
  }),

  constructionMonths: limits(economics.constructionMonths, 9, 60, {
    basis: [
      'Notice to proceed through to commercial operation. Twelve months is one spend period. The ceiling is set by transformer supply rather than construction: tier-1 HV power transformer lead times ran 2.5-5 years through 2026. This field starts at NTP and therefore excludes the CAISO interconnection process, which is scored separately and is the binding constraint on this market.',
      '自开工令至商业运行。12个月为单一支出期。上限由变压器供应而非施工决定：2026年一线高压电力变压器交付周期为2.5–5年。本字段自开工令起算，因此不含CAISO并网流程 — 该流程单独评分，且是本市场的约束性瓶颈。',
    ],
    source: 'Transformer lead-time reporting, 2026; CAISO interconnection scored separately',
    gate: 'G26',
  }),

  degr: limits(economics.degr, 1, 4, {
    kind: 'dispersed',
    basis: [
      'No US operator or OEM publishes a measured degradation series. 2%/yr is the platform seed held constant across every market. CAISO is the market where it matters least to the contracted line and most to the merchant one: RA is paid on tested four-hour capacity, so degradation threatens the qualifying capacity itself rather than merely the revenue — a battery that can no longer sustain four hours loses NQC, not just spread.',
      '美国无任何运营商或设备商公布实测衰减序列。每年2%为各市场统一的平台种子值。CAISO是该假设对合同化收入影响最小、对市场化收入影响最大的市场：容量充裕度按实测四小时容量支付，因此衰减威胁的是合格容量本身而不仅是收入 — 无法维持四小时放电的电池将丧失净合格容量，而非仅损失价差。',
    ],
    source: 'Platform seed; CPUC four-hour NQC testing',
    gate: 'G13',
  }),
};

export const comparison = {
  /* Capacity-backed, and here that is not merely the default — RA is the
     majority of a Californian battery's revenue rather than a supplement to it. */
  baseStrategy: 'cap',

  archetype: {
    /* A modelling convention, stated as one. Four hours is not a convention: it
       is what the CPUC tests net qualifying capacity on, and no additional RA
       credit is given beyond it. */
    powerMW: 100,
    durationHours: HOURS,
  },

  score: {
    composite: COMPOSITE,
    connectionRisk: CONNECTION_RISK,
  },

  capabilities: {
    capacityMarket: true,       // bilateral Resource Adequacy
    merchant: true,             // nodal energy arbitrage
    ancillaryServices: true,
    /* RA already IS the contracted route here. A separate toll would be a second
       contracted line over the same capacity, and no CAISO battery toll distinct
       from an RA agreement was located. */
    tolling: false,
    longTermAward: false,
  },

  economics,
  ranges,

  /* Both merchant legs priced at year 1: RA is additive to merchant, so a
     Californian battery trades its own energy from commercial operation.
     See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1, because a Resource Adequacy contract sells capacity to a load-serving entity and leaves the energy and ancillary legs with the owner — merchant exposure begins at commercial operation. Both legs come from the same published merchant benchmark, split on one estimated 80/20 share, and move together on one set of forward assumptions: a 16.7 GW fleet with batteries about 46% of a roughly 500 GW queue behind it, midday solar driving the negative prices a battery charges into, and ancillary requirements that do not grow with the fleet.',
    '第1年，因为容量充裕度合约将容量出售给负荷服务实体，而电能量与辅助服务收入仍归业主所有 — 市场化敞口自商业运行起即开始。两个收入项均取自同一已公布的市场化收入基准，按同一估算的80/20比例拆分，并基于同一套前瞻假设同步变动：机组规模为16.7GW，其后约500GW排队中储能约占46%，午间光伏形成储能赖以充电的负电价，而辅助服务需求不随机组规模增长。',
  ]),

  narrative: {
    archetype: ['100 MW · 4h · RA-contracted', '100MW · 4小时 · 容量充裕度合约'],
    thesis: [
      'The only US market where the contracted line is the majority of the revenue, and the only one where four hours is a ceiling rather than a floor. Resource Adequacy averaged $8.77/kW-month in H1 2025 against merchant earnings nearer $2.5-3, so a Californian battery is substantially a capacity contract with a trading option attached. What is uncertain here is the opposite of everywhere else: the merchant band is narrow and the CONTRACTED band is wide, because RA is negotiated deal by deal rather than cleared — $4.29 to $14.67/kW-month in unconstrained areas. Underwrite the counterparty, the tenor and the deliverability status; the spread is the small part.',
      '这是美国唯一一个合同化收入占据大部分收入的市场，也是唯一一个四小时构成上限而非下限的市场。2025年上半年容量充裕度平均为每kW每月$8.77，而市场化收入约为$2.5–3，因此加州储能在实质上是一份附带交易期权的容量合约。此处的不确定性与其他各处恰恰相反：市场化区间较窄，而合同化区间较宽，因为容量充裕度是逐笔协商而非集中出清 — 非受限区域为每kW每月$4.29至$14.67。承销依据应为交易对手、合约期限与可交付性状态；价差只是其中较小的部分。',
    ],
    /* Roughly 500 GW in the CAISO queue with batteries about 46% of it — about
       230 GW — against a fleet of 16.7 GW. */
    pipelineRatio: '~15×',
  },
};

export default comparison;
