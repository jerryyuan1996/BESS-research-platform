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
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';

/* Multipliers on `services`, index 0 = year 1. Decays €30,000 → ~€10,000 by
   year 5 as the pipeline lands. Calibrated on GB's frequency-response collapse:
   saturation arrived at roughly 1.1× the requirement and cut per-MW revenue
   75-80% within two years. Romania crosses that threshold sooner than GB did,
   because the pipeline is larger relative to the requirement. */
const FCR_SATURATION = [
  1.00,   // yr 1  — ~37 MW of storage operational against a deep FCR requirement
  0.85,   // yr 2  — first GW lands
  0.65,   // yr 3
  0.48,   // yr 4
  0.33,   // yr 5  — ≈€10,000/MW/yr; the competitive floor
  0.33, 0.32, 0.32, 0.31, 0.31, 0.30, 0.30, 0.29, 0.29, 0.28,
];

const economics = {
  capexPerMW: 630000,
  opexPerMW: 8000,

  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* €110,000 + €30,000 = €140,000/MW/yr gross = €140/kW/yr, the Clean Horizon
     assessment. Weighted to merchant: Romania's edge is day-ahead volatility,
     which is structural, rather than reserve scarcity, which is temporary. */
  merchGross: 110000,
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
    'FCR ~€70/MW/h today; ancillary leg decays as a >9 GW pipeline lands. Merchant leg held flat.',
    '当前FCR约€70/MW/h；随9GW以上管线投运，辅助服务收入衰减。市场化收入维持不变。',
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

  /* Both ends are Clean Horizon positions — the one we carried before the 2026-07-30
     revision, and the whole of the assessment that caused it. */
  merchGross: band(economics.merchGross, 55400, 140000, {
    basis: [
      'The floor is the merchant line this platform carried before the 2026-07-30 revision. The ceiling is Clean Horizon\'s full ~€140/kW/yr Romanian assessment attributed entirely to the merchant leg, i.e. the level if system services are worth nothing. The seed splits it €110k merchant / €30k services because Romania\'s edge is day-ahead volatility, which is structural, rather than reserve scarcity, which is not.',
      '下限为本平台在2026年7月30日修订前所采用的市场化收入。上限为Clean Horizon对罗马尼亚约€140/kW/年的完整评估值全部计入市场化收入的情形，即假设系统服务价值为零。种子值按€11万市场化/€3万系统服务拆分，因为罗马尼亚的优势在于结构性的日前市场波动，而非并不持久的备用容量稀缺。',
    ],
    source: 'Clean Horizon Romania assessment ~€140/kW/yr; 2025 DAM average €110/MWh, max daily spread €168/MWh',
    gate: 'G9',
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

  score: {
    composite: 61,
    connectionRisk: 53,
  },

  capabilities: {
    capacityMarket: false,     // no capacity mechanism
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics,
  ranges,

  narrative: {
    archetype: ['50 MW · 2h · merchant + grant', '50MW · 2小时 · 市场化+补贴'],
    thesis: [
      'The best raw spread economics in the set and still zero contracted revenue. A €110/MWh day-ahead average with a €168/MWh maximum daily spread pays for the asset; the FCR premium on top of it pays for the first five years and then does not. Structure — the grant, plus a negotiated floor — has to do the work the market never will.',
      '样本中原始价差经济性最佳，且合同化收入仍为零。日前均价€110/MWh、单日最大价差€168/MWh足以支撑资产本身；叠加的FCR溢价可支撑前五年，其后不再。仍须由结构 — 补贴加谈判保底 — 承担市场永不承担的职能。',
    ],
    pipelineRatio: '~3.0×',
  },
};

export default comparison;
