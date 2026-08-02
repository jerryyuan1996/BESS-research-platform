/* ---------------------------------------------------------------------------
   Germany — comparison interface. Economics are per MW per year, in EUR.

   EUROPE'S MOST ACTIVE BESS FINANCING MARKET, AND THE ONE WITH THE LEAST
   CONTRACTED REVENUE TO FINANCE AGAINST. Those are the same fact.

   Germany led Europe on tolling agreements in Q1 2026 and was the single most
   active market of 2025 with 25 transactions. It reached that position with no
   capacity revenue available to the asset class at all — which is why tolling
   grew: it is the only way a German battery converts a merchant position into
   something a lender will size against.

   THE CAPACITY MARKET EXISTS AND THIS ASSET CANNOT BID INTO IT.

   That sentence needs both halves. The Electricity Supply Security and Capacity
   Act (StromVKG) is law, and the Bundesnetzagentur opened a 4.5 GW auction with
   a September 2026 bid deadline, 15-year contracts and a €244,000/MW/yr price
   cap on de-rated capacity. But eligibility requires TEN HOURS of continuous
   discharge, 92% round-trip efficiency and 100% technical availability. A
   four-hour battery is not a marginal case here; it is ineligible. The realistic
   entry point for shorter duration is a later ~2 GW auction in May 2027, and the
   scheme has not yet received European Commission state-aid approval.

   So `capacityMarket` is declared FALSE — not because Germany lacks a mechanism,
   but because the mechanism does not admit the archetype. It is the same
   reasoning Japan's LTDA applies in reverse: a scheme's duration floor decides
   whether a route exists for the asset being modelled.

   TWO ROUTES, THEN: merchant and toll.

   REVENUE IS THE HARDEST NUMBER ON THIS PAGE, AND NOT FOR LACK OF DATA.

   German BESS revenue is published, frequently, and it moves violently. One
   optimiser's real 2h book ran €264,955/MW/yr annualised in October 2025,
   €142,727 in November and €107,556 in December — a 2.5× swing in one quarter.
   Modo's near-term 2h figure is €240,000 and its own LIFETIME-LEVELISED central
   range is €115,000–130,000, converging on about €125,000 by 2030 as the
   ancillary leg collapses from 55% of revenue to roughly 5%.

   A fifteen-year model must take the levelised number. Seeding the €240,000 spot
   figure would be underwriting a 2026 peak for fifteen years, and Modo's own
   April 2026 update cut lifetime revenues 16% across the curve.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';

/* Modo publishes 2h revenue but not 4h. The scaling factor is derived from the
   two figures it DOES publish for both durations — capex and unlevered IRR:

       4h capex €935k vs 2h €700k          = 1.336×
       4h IRR 13.7% vs 2h 12.2% at 2026 COD = 1.123×

   For a higher return on a larger capital base, revenue must rise by the product
   of the two: 1.336 × 1.123 ≈ 1.50. Stated here rather than buried because every
   German revenue figure below depends on it, and a reader who disputes it can
   discount all of them at once. */
const DURATION_SCALAR = 1.50;

/* Modo's lifetime-levelised central band for a 2h asset, the basis a fifteen-year
   model needs. Midpoint €122,500. */
const LEVELISED_2H = (115000 + 130000) / 2;

const economics = {
  /* Modo's published 4h figure, €935k/MW = €234/kWh. Carried as published: it is
     NOT confirmed whether it includes the Baukostenzuschuss, and adding a cost
     that may already be inside it would overstate German capex by up to 18%. The
     BKZ is instead carried at the top of the band — see ranges. */
  capexPerMW: 935000,
  opexPerMW: 17000,

  /* Ineligible, not zero-valued. The capacity market exists; a four-hour battery
     cannot bid into it. See the header. */
  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  merchGross: Math.round(LEVELISED_2H * DURATION_SCALAR),   // €183,750 → 184,000
  feePct: 9,

  /* Momentanreserve, the grid-forming inertia product all four TSOs began
     procuring in January 2026. Seeded at the BOTTOM-UP figure rather than the
     published range, because the two disagree and the conservative one is
     derivable: at the €805/MWs/yr premium price and 90% availability a battery
     earns €3,019/MW/yr, doubled to €6,038 because it supplies positive and
     negative inertia simultaneously. Modo puts the same product at €8–20k. The
     factor that would reconcile them — MWs registered per MW of rating — is not
     published, so the band carries the upside and the seed does not. */
  services: 6038,

  grantPct: 0,
  degr: 2,

  /* No German toll fee has ever been publicly disclosed, in any deal. The seed
     is the midpoint of a band derived from Modo's published breakeven analysis,
     scaled for duration — see ranges for the arithmetic. */
  toll: 140000,
  /* The flagship deal: Next Kraftwerke / ECO STOR at Förderstedt, 300 MW and
     more than 700 MWh, 80% tolled, five years. Five is short against a fifteen-
     year window, and that merchant tail is the German toll's defining feature. */
  tollYears: 5,
  tollRevertsToMerchant: true,

  capNote: [
    'The StromVKG capacity market requires 10 hours of continuous discharge. A four-hour battery is ineligible until at least the May 2027 auction.',
    'StromVKG容量市场要求连续放电10小时。四小时储能在2027年5月拍卖之前不具备参与资格。',
  ],
  tollNote: [
    '5-yr precedent tenor (Next Kraftwerke / ECO STOR, Förderstedt, 300 MW, 80% tolled); merchant tail from yr 6; no German toll price has been disclosed',
    '先例期限5年（Next Kraftwerke与ECO STOR的Förderstedt项目，300MW，80%租赁）；第6年起转为市场化敞口；德国从未披露租赁价格',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   Germany's merchant band is the widest on the platform and every endpoint is a
   REALISED monthly figure from one optimiser's book, not a scenario. That is the
   point: a market whose revenue moved 2.5× in a single quarter cannot honestly
   be represented by one number, and the band is where that shows.
   --------------------------------------------------------------------------- */
const ranges = {
  capexPerMW: band(economics.capexPerMW, 180 * 4000, 935000 + 165000, {
    basis: [
      '€935k/MW is €234/kWh at four hours, inside the €180–260/kWh European turnkey band whose floor sets the low end. The ceiling adds the Baukostenzuschuss at its highest reported level — €165,000/MW at SWM Infrastruktur in Munich, against €110,000/MW at Mitnetz Strom — because it is NOT confirmed whether the published capex already includes it. The BKZ is a one-off, non-refundable grid-connection contribution the Bundesgerichtshof upheld against storage on 15 July 2025, with no reimbursement of charges already levied.',
      '€935k/MW在四小时下相当于€234/kWh，处于€180–260/kWh的欧洲交钥匙区间内，该区间下限即为本band下限。上限叠加了报告中最高水平的并网工程费分摊（BKZ）— 慕尼黑SWM Infrastruktur为每MW €165,000，Mitnetz Strom为每MW €110,000 — 因为尚未确认已公布造价是否已包含该项。BKZ为一次性、不可退还的并网成本分摊，德国联邦最高法院已于2025年7月15日裁定其适用于储能，且已征收部分不予返还。',
    ],
    source: 'Modo Energy German BESS investment outlook Q2 2026; Bundesgerichtshof ruling 15 July 2025; reported BKZ tariffs',
    gate: 'G19',
  }),

  opexPerMW: band(economics.opexPerMW, 11200, 23400, {
    basis: [
      'No published German fixed-opex series exists. Both ends apply the 1.2–2.5% of capex benchmark to the €935k 4h figure — 1.2–1.4% for top operators, 2.0–2.5% typical. Grid fees are excluded: storage commissioned before 4 August 2029 is exempt, and the BNetzA AgNes framework that follows charges €4–7k/MW/yr on capacity only, with 20-year grandfathering where FID precedes the final decision.',
      '德国无公开的固定运维成本序列。两端均按造价的1.2–2.5%基准应用于4小时€935k的造价数据 — 头部运营商为1.2–1.4%，行业普遍为2.0–2.5%。不含电网费用：2029年8月4日前投运的储能可豁免，其后适用的BNetzA AgNes框架仅按容量收取每MW每年€4–7k，且在最终决定前作出投资决策的项目享有20年祖父条款保护。',
    ],
    source: 'Industry O&M benchmark applied to Modo capex; BNetzA AgNes interim ruling 27 May 2026',
    gate: 'G13',
  }),

  /* Every endpoint is a realised month from a live optimiser's book. */
  merchGross: band(economics.merchGross,
    Math.round(107556 * DURATION_SCALAR),
    Math.round(264955 * DURATION_SCALAR), {
      basis: [
        'The seed is Modo\'s lifetime-levelised 2h central range of €115–130k, taken at its €122,500 midpoint and scaled 1.50× to four hours. Both band ends are REALISED monthly figures from one optimiser\'s 2h portfolio, annualised and scaled on the same basis: €107,556/MW/yr in December 2025 at the floor and €264,955 in October 2025 at the ceiling — a 2.5× swing in a single quarter. Modo\'s near-term 2h figure of €240,000 sits near that ceiling and is a 2026 peak rather than a run-rate; its own forecast has revenues roughly halving by 2030 as the ancillary leg falls from 55% of revenue to about 5%.',
        '种子值取Modo全生命周期平准化的2小时中枢区间€115–130k的中值€122,500，并按1.50倍折算至四小时。区间两端均为某优化商2小时资产组合的实际月度数据，经年化并按同一口径折算：下限为2025年12月的每MW每年€107,556，上限为2025年10月的€264,955 — 单季度波动达2.5倍。Modo的近期2小时数据€240,000接近该上限，属2026年峰值而非常态水平；其自身预测显示，随着辅助服务收入占比从55%降至约5%，收入到2030年将大致腰斩。',
      ],
      source: 'Modo Energy German BESS investment outlook Q2 2026 (levelised central); enspired trading monthly portfolio performance (realised)',
      gate: 'G20',
    }),

  feePct: limits(economics.feePct, 6, 12, {
    kind: 'dispersed',
    basis: [
      'No German route-to-market fee percentage is published. The band is the platform\'s own cross-market seed range of 8–10%, widened by the stated dispersion.',
      '德国未公布任何售电路径服务费率。该区间取本平台跨市场种子区间8–10%，并按既定离散幅度扩展。',
    ],
    source: 'Platform cross-market seeds; no German disclosure',
  }),

  services: band(economics.services, null, 20000, {
    basis: [
      'Momentanreserve, procured jointly by 50Hertz, Amprion, TenneT and TransnetBW from 22 January 2026 on fixed-price contracts of 2–10 years. The seed is derived bottom-up from the published tender price: €805/MWs/yr premium at 90% availability gives €3,019/MW/yr, doubled to €6,038 because a battery supplies positive and negative inertia at once. The ceiling is Modo\'s published €8–20k/MW/yr for the same product. The two disagree by roughly three times and the reconciling factor — MWs registered per MW of rating — is not published, so the seed takes the derivable end.',
      'Momentanreserve由50Hertz、Amprion、TenneT与TransnetBW四家电网运营商自2026年1月22日起联合采购，采用2–10年固定价格合同。种子值依据公开招标价格自下而上推算：90%可用率下溢价档为每MWs每年€805，对应每MW每年€3,019，因电池可同时提供正负惯量而翻倍至€6,038。上限为Modo就同一产品公布的每MW每年€8–20k。两者相差约三倍，而用于调和的换算系数 — 每MW额定容量可注册的MWs — 并未公开，故种子值采用可推导的一端。',
    ],
    source: 'German TSO Momentanreserve tender, January 2026; Modo Energy Q2 2026',
    gate: 'G21',
  }),

  /* Derived from a sensitivity table, not quoted from a deal. */
  toll: band(economics.toll, 95000, Math.round(115000 * 1.336), {
    basis: [
      'No German toll fee has been publicly disclosed in any transaction — not at Förderstedt, not at ju:niz, not in Aurora\'s or Modo\'s public work. Both ends come from Modo\'s published breakeven analysis for a 2h asset: below €95k/MW/yr merchant beats tolling, and above €115k the return curves flatten because the project cannot support more debt. The floor keeps the 2h figure unscaled — the case where a toll does not scale with duration at all — and the ceiling scales it by the 4h capex ratio of 1.336, because that ceiling is a debt-capacity limit and debt capacity scales with capital cost.',
      '德国从未在任何交易中公开披露租赁费用 — Förderstedt项目未披露，ju:niz项目未披露，Aurora与Modo的公开研究中亦无。两端均来自Modo针对2小时资产公布的盈亏平衡分析：低于每MW每年€95k时市场化优于租赁，高于€115k时回报曲线趋平，因为项目无法承载更多债务。下限保留未经折算的2小时数值 — 即租赁费用完全不随时长变化的情形 — 上限则按4小时造价比率1.336折算，因为该上限本质是债务承载能力约束，而债务承载能力随资本成本同步变化。',
    ],
    source: 'Modo Energy tolling breakeven analysis (2h basis); Aurora Energy Research tolling share estimate',
    gate: 'G16',
  }),

  tollYears: limits(economics.tollYears, 5, 10, {
    basis: [
      'Both ends observed. Next Kraftwerke / ECO STOR contracted five years over the 300 MW Förderstedt asset, 80% tolled; Next Kraftwerke / ju:niz Energy contracted seven. Reported tenors cluster at 5–10 years, matching lender appetite, and German deals cluster at 80–100% tolled — banks generally will not finance beyond 80% contracted revenue.',
      '两端均为实测值。Next Kraftwerke与ECO STOR就300MW的Förderstedt项目签订五年期合约，租赁比例80%；Next Kraftwerke与ju:niz Energy签订七年期合约。已报告的期限集中于5–10年，与贷款人偏好一致，德国交易的租赁比例集中在80–100% — 银行通常不会为超过80%的合同化收入提供融资。',
    ],
    source: 'Next Kraftwerke press releases (ECO STOR Förderstedt, ju:niz Energy)',
  }),

  degr: limits(economics.degr, 1, 3, {
    kind: 'dispersed',
    basis: [
      'No German degradation series is published. 2%/yr is the platform seed in every market.',
      '德国未公布衰减率序列。各市场种子值均为每年2%。',
    ],
    source: 'Platform seed — held constant across all markets',
    gate: 'G13',
  }),
};

export const comparison = {
  archetype: {
    /* No published average German project size exists. 100 MW is a modelling
       convention; four hours is not — it is the duration Modo's own headline
       13.7% IRR is computed on, Fluence reports its German book shifting from
       2h to 4h, and newly installed duration rose from 1.7h to 2.3h in H1 2026.
       The 2.3h figure includes residential and C&I systems and is not the
       grid-scale archetype. */
    powerMW: 100,
    durationHours: 4,
  },

  score: {
    composite: 62,
    connectionRisk: 44,
  },

  capabilities: {
    /* Legislated but closed to this asset: the StromVKG auction requires ten
       hours of continuous discharge. See the header. */
    capacityMarket: false,
    merchant: true,
    ancillaryServices: true,
    tolling: true,
    longTermAward: false,
  },

  economics,
  ranges,

  narrative: {
    archetype: ['100 MW · 4h · merchant + toll', '100MW · 4小时 · 市场化+租赁'],
    thesis: [
      'Europe\'s most liquid power market for storage, and the one with no capacity revenue available to a four-hour battery. Germany rejected the bidding-zone split in December 2025, so its €3.1bn annual congestion bill never reaches a locational price a battery could trade against. Tolling is the answer the market found: six of Europe\'s fifteen standalone toll deals in 2025 were German, and Aurora expects 40–50% of the fleet to end up contracted that way.',
      '欧洲储能流动性最强的电力市场，同时也是四小时电池无法获得任何容量收入的市场。德国已于2025年12月否决报价区拆分，因此其每年31亿欧元的拥塞成本从未转化为电池可交易的区位价格信号。租赁是市场找到的答案：2025年欧洲十五笔独立租赁交易中有六笔在德国，Aurora预计40–50%的存量最终将以该方式签约。',
    ],
    pipelineRatio: '~5×',
  },
};

export default comparison;
