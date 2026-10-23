/* ---------------------------------------------------------------------------
   Romania — comparison interface. Economics are per MW per year, in EUR.

   Romania is the reason capability flags exist. It has no capacity mechanism, so
   the capacity-backed route is genuinely unavailable — not zero-valued. The
   engine returns { na: ['No capacity mechanism', '无容量机制'] } for 'cap' and the
   $1M engine omits the row entirely, exactly as the prototype did.

   REVISED 2026-07-30, upward. This is the one market in the set where the
   external view says we were UNDERSTATING, and the revision doubles the revenue
   line. The evidence, and then the discipline applied to it.

   THE CASE FOR A HIGHER LEVEL
     · Clean Horizon puts Romanian BESS revenue at ~€140/kW/yr, "among the
       attractive near-term BESS markets in Europe". We carried €70.4/kW/yr.
     · The 2025 day-ahead market averaged €110/MWh with a maximum daily price
       spread of €168/MWh — described as exceptionally high in a European context.
     · FCR clears around €70/MW/h and is the most lucrative ancillary product;
       aFRR up and down sit near €9/MW/h.
     · In 2025 the regulator ELIMINATED DOUBLE TAXATION of stored electricity,
       exempting charging and discharging volumes from network tariffs. That is a
       dated, structural improvement to project economics that the old line
       predates and does not reflect.
     · Regional corroboration from the same index: Latvia €338k/MW/yr, Lithuania
       €326k, Estonia €175k. Immature ancillary markets in this region clear far
       above where we had Romania.

   THE DISCIPLINE APPLIED TO IT
     A high level in an ancillary-led market is a statement about scarcity, and
     scarcity is the thing buildout destroys. Romania's pipeline exceeds 9 GW with
     more than 2 GW expected operational by the end of 2026. FCR at €70/MW/h does
     not survive that, and an aggressive level with no decay attached would be a
     forecast that the future looks like the present.

     So the ancillary leg gets a saturation curve on the same GB calibration
     Ireland uses — see servicesCurve below — while the merchant leg, which is
     driven by structural price spread rather than by a procurement volume, is
     held flat. That split is the argument: what saturates is the reserve
     product, not the volatility.

   The split between the two legs is weighted toward merchant because the
   underlying driver is DAM volatility; the FCR strength shows up in the services
   leg and is therefore the part that decays.

   REVISED 2026-10-23, DOWN, AND THE MERCHANT LEG IS NO LONGER FLAT. The analyst
   approved docs/merchant-lines-plan-2026-10.md. The €110k seed was the whole of
   2025's theoretical spread (TB2 €151.0/MWh × 2h × 365 = €110.2k), 104% of what
   a 2h battery could schedule at perfect foresight (€105.3k), with nothing for
   the fleet now arriving. That fleet is Romania's own: Transelectrica lists
   599 MW on 1 April 2026 and 989 MW on 1 August, doubling by year-end.
   Bulgaria's 5.4 GW mostly stays behind the border, which since April 2026 has
   split the two prices in up to 63% of hours.

   The seed is now the observed 2025 day-ahead value restated at year 1 (COD
   2027) along a path fitted on what Bulgaria's fleet did to Bulgarian prices,
   and `merchantCurve` carries the decline after year 1.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';
import { quotedEconomics } from '../../comparison/supplierQuote.js';

/* Multipliers on `services`, index 0 = year 1. Decays €30,000 → ~€10,000 by
   year 5 as the pipeline lands. Calibrated on GB's frequency-response collapse:
   saturation arrived at roughly 1.1× the requirement and cut per-MW revenue
   75-80% within two years. Romania crosses that threshold sooner than GB did,
   because the pipeline is larger relative to the requirement. */
/* The merchant leg's level and path (docs/merchant-lines-plan-2026-10.md §1).

   DA_VALUE_2H_2025  2025 day-ahead value of a 1 MW / 2h battery: hourly prices,
                     one cycle a day, 88% round trip, perfect foresight, so
                     €288.5/MW/day × 365. Realisation is taken at 100%: the
                     15-minute uplift (+8.7% in 2026) and intraday re-trading
                     offset imperfect foresight (gate MR-1).
   PATH              factor on that value by calendar year, from Romania's
                     average fleet (GW: 2025 0.3, 2026 1.1, 2027 2.75, 2028 4.25,
                     2029 5.75, then flat) over its 6.06 GW average load, on
                     −24.3% × (1 − e^(−x/0.324)), fitted on Bulgaria against
                     Poland in January–July and April–September 2026.
   SLOW_2027         the 2027 factor at half the build rate, for the ceiling. */
const DA_VALUE_2H_2025 = 288.5 * 365;          // €105,302.5
const DA_VALUE_2H_2024 = 328.7 * 365;          // €119,975.5, the record year
const PATH = { 2026: 0.919, 2027: 0.827, 2028: 0.789, 2029: 0.772 };
const SLOW_2027 = 0.840;
const YEAR_ONE = 2027;

const FCR_SATURATION = [
  1.00,   // yr 1  — ~37 MW of storage operational against a deep FCR requirement
  0.85,   // yr 2  — first GW lands
  0.65,   // yr 3
  0.48,   // yr 4
  0.33,   // yr 5  — ≈€10,000/MW/yr; the competitive floor
  0.33, 0.32, 0.32, 0.31, 0.31, 0.30, 0.30, 0.29, 0.29, 0.28,
];

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 630000;

/* The supplier quotation's DC block inside that total — method HELD: the total is a
   2026 European price survey that already prices today's DC blocks, so it stands and
   the quote says how much of it is the block (src/comparison/capex.js). */
const OPEX_SEED_PER_MW = 8000;
const QUOTED = quotedEconomics({ currency: 'EUR', hours: 2, method: 'held', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

const economics = {
  capexPerMW: 630000,

  /* ---- capital structure -------------------------------------------------
     The stack reconciles exactly to the installed cost above — `stackFrom`
     puts the residual in EPC — so introducing it moved no published return.
     What it adds is the ability to move one component without moving the rest,
     and a place for the market-specific lines to sit visibly rather than
     inside a single number. Component split is global until gate G24 closes.

     VAT is 21% here (TVA, raised from 19% on 1 August 2025). It is carried as timing rather than cost:
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
  vatPct: 21, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  /* The flat seed was 8,000/MW/yr. The supplier's service package now runs as its own
     back-loaded line below, and this is the rest of fixed opex: the seed less the
     package's fifteen-year mean, so the fifteen-year total is unchanged. */
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* The 2025 day-ahead value restated at year 1: €105,302.5 × 0.827 = €87,085.
     Was €110,000, Clean Horizon's ~€140/kW/yr split €110k merchant / €30k
     services; the services leg and its saturation curve are unchanged. */
  merchGross: Math.round(DA_VALUE_2H_2025 * PATH[YEAR_ONE]),
  /* Year 1 = 2027. 0.789 ÷ 0.827 and 0.772 ÷ 0.827, held after year 3: the
     fitted curve flattens, so most of the compression is in before COD. */
  merchantCurve: [1.000, 0.955, 0.934],
  merchantCurveBasis: {
    yearOne: YEAR_ONE,
    text: [
      'Romania\'s own fleet, 0.3 GW in 2025 to 5.75 GW in 2029 at 2026\'s +1.5 GW a year, on the compression Bulgaria\'s fleet produced in 2026: −24.3% × (1 − e^(−x/0.324)), x = added battery MW ÷ average load.',
      '罗马尼亚自身储能由2025年的0.3GW按2026年每年新增1.5GW的速度增至2029年的5.75GW，并采用保加利亚储能在2026年造成的价差压缩曲线：−24.3% × (1 − e^(−x/0.324))，x为新增电池功率除以平均负荷。',
    ],
  },
  feePct: 10,
  services: 30000,
  servicesCurve: FCR_SATURATION,

  /* The scheme is a competitive award with hard ceilings, not an entitlement:
     EC-approved March 2026, €150m tranche for standalone storage, capped at
     €69,000/MWh installed and €15m per company, targeting ≥2,174 MWh. At this
     archetype (50 MW / 2h = 100 MWh) neither cap binds — 20% of capex is
     €126,000/MW against a €138,000/MW ceiling — but both bind immediately if
     capex rises or the duration is lengthened, which a bare percentage would
     sail straight past. The engine applies whichever is lowest. */
  grantPct: 20,
  grantCapPerMWh: 69000,
  grantCapAbsolute: 15000000,

  degr: 2,

  grantNote: [
    '20% capital grant — competitive award, capped at €69k/MWh and €15m per company',
    '20%资本补贴 — 竞争性授予，上限为每MWh 6.9万欧元及每家企业1,500万欧元',
  ],
  servicesNote: [
    'FCR ~€70/MW/h today; ancillary leg decays as a >9 GW pipeline lands. Merchant leg falls with Romania\'s own fleet: −4.5% in year 2, −6.6% from year 3.',
    '当前FCR约€70/MW/h；随9GW以上管线投运，辅助服务收入衰减。市场化收入随罗马尼亚自身储能增长而下降：第2年−4.5%，第3年起−6.6%。',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   No `contracted`, `contractYears` or `postFactor` band is declared, and that is
   not an omission. Romania has no capacity mechanism, so there is no contracted
   line to move — the Lab renders no contracted-revenue group for this market,
   for the same reason the $1M engine renders no capacity row.

   The grant band starts at ZERO. The scheme is a competitive award with hard
   ceilings, not an entitlement, so a project that does not win it gets nothing;
   modelling it only as a deterministic 20% hides the binary.
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
  capexPerMW: band(economics.capexPerMW, 180 * 2000, 260 * 2000, {
    basis: [
      'European turnkey 4h LFP is €180–260/kWh installed; at the 2h archetype that is €360k–520k/MW. The seed of €315/kWh sits above the European ceiling — short-duration systems carry more power-block cost per kWh, which is the expected direction.',
      '欧洲4小时磷酸铁锂交钥匙安装成本为€180–260/kWh；按2小时原型换算为每MW €36万–52万。种子值€315/kWh高于欧洲区间上限 — 短时长系统每kWh承担更高的功率段成本，方向符合预期。',
    ],
    source: '2026 European BESS turnkey EPC surveys (€180–260/kWh, 4h LFP)',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No published Romanian fixed-opex series. €8,000/MW/yr is ≈US$8,600, the lowest in the platform and well below the US utility-scale benchmark of US$15–25k/MW/yr.',
      '无罗马尼亚固定运维公开序列。€8,000/MW/年约合US$8,600，为本平台最低值，且远低于美国公用事业级基准US$15–25k/MW/年。',
    ],
    source: 'Platform seed',
    gate: 'G13',
  }),

  /* Both ends are the same observed series at other realisations and build rates. */
  merchGross: band(economics.merchGross,
    Math.round(DA_VALUE_2H_2025 * 0.80 * PATH[YEAR_ONE]),
    Math.round(DA_VALUE_2H_2024 * 1.10 * SLOW_2027), {
      basis: [
        'The seed is the 2025 day-ahead value of a 2h battery (€105.3k: hourly prices, one cycle a day, 88% round trip, perfect foresight) restated at year 1 (COD 2027) by the fleet path, × 0.827. The floor takes 80% realisation, the case where intraday re-trading does not recover imperfect foresight. The ceiling takes 2024\'s record €120.0k at 110% realisation and half the build rate (× 0.840); it is about the €110k the platform carried before 2026-10-23.',
        '种子值为2h电池2025年日前价值（€105.3k：小时价格、每日一次循环、往返效率88%、完全预见）按储能增长路径折算至第1年（2027年投运），× 0.827。下限取80%实现率，即日内再交易无法弥补预测误差的情形。上限取2024年创纪录的€120.0k、110%实现率及一半的建设速度（× 0.840），约等于本平台2026年10月23日前采用的€110k。',
      ],
      source: 'SDAC day-ahead results for Romania, 2023–2025 (ENTSO-E 12.1.D / OPCOM); Transelectrica storage list, 1 Apr and 1 Aug 2026; ESO Bulgaria storage counts; docs/merchant-lines-plan-2026-10.md',
      gate: 'MR-1',
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
      'FCR clears around €70/MW/h today and is the most lucrative Romanian ancillary product; aFRR up and down sit near €9/MW/h. Whatever level is set, the FCR saturation curve decays it to roughly a third by year 5 — a >9 GW pipeline with >2 GW expected operational by end-2026 does not leave €70/MW/h standing.',
      '当前FCR出清价约€70/MW/h，是罗马尼亚最具收益的辅助服务产品；aFRR上下调约为€9/MW/h。无论设定何种水平，FCR饱和曲线都会使其在第5年衰减至约三分之一 — 超过9GW的管线、且预计2026年底前超过2GW投运，不可能让€70/MW/h维持。',
    ],
    source: 'Romanian FCR ~€70/MW/h, aFRR ~€9/MW/h; saturation curve calibrated on GB',
    gate: 'G9',
  }),

  grantPct: limits(economics.grantPct, 0, 20, {
    basis: [
      'Zero is a project that does not win the award, which is the outcome a deterministic 20% hides: the Modernisation Fund tranche is €150m for standalone storage, allocated by competitive bidding and capped at €69,000/MWh installed and €15m per company. At this 50 MW / 2h archetype 20% of capex is €126,000/MW against a €138,000/MW ceiling, so the cap does not bind — but it binds immediately if capex rises or duration lengthens.',
      '取零对应未中标的项目，而这正是按确定性20%建模所掩盖的结果：现代化基金面向独立储能的批次为€1.5亿，通过竞争性投标分配，上限为每MWh装机€69,000及每家企业€1,500万。在50MW/2小时原型下，造价的20%为每MW €126,000，低于每MW €138,000的上限，故上限不约束 — 但一旦造价上升或时长延长，上限将立即生效。',
    ],
    source: 'EC approval March 2026; Romanian Modernisation Fund €150m standalone-storage tranche',
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
    durationHours: 2,
  },

  /* How each line scales with duration, for the design-fit sweep
     (src/comparison/designFit.js). Shapes relative to two hours; the capture
     curve is the dashboard's, moved over unchanged. No capacity line to scale.
     The grant's per-MWh ceiling scales by itself: the engine reads it against
     the duration it is given. */
  durationResponse: {
    hours: [1, 2, 4, 6, 8],
    /* Observed: the 2023–2025 mean of day-ahead value per MWh by duration,
       relative to 2h (docs/merchant-lines-plan-2026-10.md §1). Was the
       dashboard's seed of 1.10, 1.00, 0.82, 0.70, 0.62. */
    merchantCapture: [1.095, 1.000, 0.833, 0.688, 0.556],
    merchantCaptureBasis: 'observed',
    opexEnergyShare: 0.5,
  },

  capabilities: {
    capacityMarket: false,     // no capacity mechanism
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics,
  ranges,

  /* The line the evidence rule checks (src/governance/briefing.js): the 2025
     day-ahead value against the seed restated at 2025 (÷ 0.827). */
  merchantEvidence: {
    year: 2025,
    hours: 2,
    observedPerMW: Math.round(DA_VALUE_2H_2025),
    restateFactor: PATH[YEAR_ONE],
    /* 2023–2025 observed: €79,351 / €119,976 / €105,303. */
    range: [Math.round(217.4 * 365), Math.round(DA_VALUE_2H_2024)],
    pathFit: 'other-market',
    source: 'SDAC day-ahead results for Romania, 2025; recompute from ENTSO-E or OPCOM before publication (gate MR-4)',
    basis: [
      '2025 day-ahead value of a 2h battery: hourly prices, one cycle a day, 88% round trip, perfect foresight.',
      '2h电池2025年日前价值：小时价格、每日一次循环、往返效率88%、完全预见。',
    ],
  },

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Romania has no capacity mechanism, so both merchant legs carry the entire return and are exposed from commercial operation. FCR saturation after year 1 is carried by servicesCurve rather than folded into the seed.',
    '第1年。罗马尼亚没有容量机制，因此两个市场化收入项承担全部回报，并自商业运行起即处于敞口状态。第1年之后的FCR饱和由servicesCurve承载，而非并入种子值。',
  ]),

  narrative: {
    archetype: ['50 MW · 2h · merchant + grant', '50MW · 2小时 · 市场化+补贴'],
    thesis: [
      'Wide day-ahead spreads, zero contracted revenue, and a home fleet that doubles this year. Bulgaria\'s batteries mostly stay behind the border; Romania\'s own build takes about 17% off the two-hour value by 2027, and the FCR premium fades after the first five years. Structure — the grant, plus a negotiated floor — has to do the work the market will not.',
      '日前价差宽、合同化收入为零，且本国储能规模今年翻倍。保加利亚的电池大多被边境阻隔；罗马尼亚自身的建设到2027年将使两小时价值减少约17%，FCR溢价在前五年后消退。仍须由结构 — 补贴加谈判保底 — 承担市场不会承担的职能。',
    ],
    pipelineRatio: '~3.0×',
  },
};

export default comparison;
