/* ---------------------------------------------------------------------------
   Italy — comparison interface. Economics are per MW per year, in EUR.

   FOUR ROUTES TO MARKET — the richest set on this platform, and the reason Italy
   was added. A single dot on the certainty frontier would misrepresent this
   market more than any other.

     cap    the Mercato della Capacità. In the DY2027 auction, 95% of new
            de-rated capacity on 15-year contracts went to BESS, clearing at
            €47,000/MW/yr.
     mer    merchant. MSD is the deepest ancillary pool in Europe for storage.
     toll   three signed Italian tolls with European utility counterparties —
            Zelestra/BKW, Zelestra/EnBW, Axpo/Zelestra. No price disclosed in any.
     ltda   MACSE, Terna's centralised storage procurement.

   MACSE IS PRICED PER MWh-YEAR, NOT PER MW-YEAR, AND THAT CHANGES EVERYTHING.

   The first auction cleared at a weighted average €12,959 per MWh of storage per
   year, for 15 years from delivery year 2028. Because the payment follows ENERGY
   rather than POWER, the awarded fleet came in at 1,491 MW across 9,968 MWh —
   an average of 6.68 hours, against the four hours the rest of the Italian market
   indexes on. A developer optimising for MACSE builds a different machine.

   This file models the four-hour archetype, so the MACSE payment is carried at
   its four-hour equivalent of €51,836/MW/yr. A reader comparing Italy's award to
   Japan's or the NEM's must hold that in mind: at the 6.68 hours MACSE actually
   awarded, the same clearing price is €86,566/MW/yr.

   IS THE MACSE RETURN LOW? YES, AND THE ARITHMETIC IS UNAMBIGUOUS.

   On a like-for-like energy basis, against the same stored megawatt-hour:

       MACSE, weighted average          €12,959 /MWh/yr
       Merchant wholesale spread, North €24,500 /MWh/yr   (98,000 ÷ 4)
       Merchant wholesale spread, South €30,750 /MWh/yr   (123,000 ÷ 4)
       MACSE reserve premium (the cap)  €37,000 /MWh/yr

   MACSE cleared at 35% of its own price cap and at roughly 42–53% of the
   wholesale-arbitrage value of the same energy — before any MSD revenue at all.
   What the winner buys with that discount is a 15-year contract with the TSO as
   counterparty, which supports materially higher gearing at lower cost of debt.
   Whether that trade is worth making is exactly what the Investment Lab is for.

   MACSE AND THE CAPACITY MARKET DO NOT STACK. A MACSE-contracted system cannot
   simultaneously hold a capacity market nomination. The engine already treats
   routes as alternatives, so this is enforced structurally — but it is stated
   here because a reader adding the two lines together would overstate Italy
   badly.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';

const HOURS = 4;

/* Terna's first MACSE auction, 30 September 2025 (revised 10 October):
   9,968 MWh awarded across 14 projects at a weighted average of €12,959 per MWh
   of storage per year. Zonal clears ran €12,146 in Sud e Calabria to €15,846 in
   Sicilia. Delivery from 2028, 15-year term. */
const MACSE_PER_MWH_YR = 12959;

/* Capacity market: €47,000/MW/yr premium at the DY2027 auction, applied at the
   current four-hour de-rating factor of 67%. Terna has PROPOSED cutting that to
   53% for DY2028 — Italy currently has Europe's most favourable battery
   de-rating and the proposal withdraws a fifth of it. */
const CM_PREMIUM = 47000;
const CM_DERATING_4H = 0.67;

/* Modo's July 2026 Italy forecast, four-hour wholesale spread only, EXCLUDING
   MSD. South mainland is the anchor because MACSE is unavailable in the North
   and Centre-North — Terna set the requirement there at zero — so the southern
   zones are the only place all four routes coexist. */
const WHOLESALE_SOUTH = 123000;
const WHOLESALE_NORTH = 98000;

const economics = {
  capexPerMW: 220 * HOURS * 1000,        // €880,000 at the €220/kWh midpoint
  opexPerMW: 13000,

  contracted: Math.round(CM_PREMIUM * CM_DERATING_4H),   // €31,490
  contractYears: 15,
  postFactor: 0.5,

  merchGross: WHOLESALE_SOUTH,
  feePct: 9,

  /* MSD, derived from Modo's own published revenue split rather than from the
     spot index — see the ranges for why the spot figure cannot be used. */
  services: Math.round(WHOLESALE_SOUTH / 0.9 * 0.10),    // ≈ €13,667

  grantPct: 0,

  /* Derived from what the market itself prices: MACSE technical compliance
     requires an eight-hour system to be oversized 18% to hold contracted
     capacity for the full term. 1 − (1/1.18) = 15.3% over 15 years ≈ 1.02%/yr.
     This is the degradation an Italian 15-year obligation is actually written
     against, which makes it a better anchor than a warranty curve. */
  degr: 1.1,

  /* No Italian toll price has been disclosed in any of the three signed deals.
     The seed sits between the two published anchors a toll must clear — see the
     ranges for the arithmetic. */
  toll: 87000,
  tollYears: 10,
  tollRevertsToMerchant: true,

  ltda: {
    payment: MACSE_PER_MWH_YR * HOURS,   // €51,836/MW/yr at four hours
    years: 15,
    /* The assignee keeps MSD trading control of MACSE capacity but returns
       roughly 80% of the contribution margin to Terna. Corroborated by two
       independent secondary readings; the percentage is not verified in Terna's
       regulation text, which is why it carries a gate. */
    merchantRetention: 0.20,
    excludesGrant: true,
    note: [
      'MACSE: €12,959/MWh/yr weighted average, 15 yr from 2028. Terna resells the time-shifting product, so the owner does not keep dispatch optionality on contracted energy. Not stackable with the capacity market.',
      'MACSE：加权平均每MWh每年€12,959，自2028年起15年。Terna转售该时移产品，故业主对已签约电量不保留调度选择权。不可与容量市场叠加。',
    ],
  },

  capNote: [
    '15-yr contracts for new build at €47,000/MW/yr; 4h de-rating 67% today, proposed 53% for DY2028',
    '新建项目15年期合同，每MW每年€47,000；4小时折减系数现为67%，2028实需年度拟降至53%',
  ],
  tollNote: [
    '10-yr precedent tenor (Axpo / Zelestra, 207 MW, northern Italy); merchant tail from yr 11; no Italian toll price has been disclosed',
    '先例期限10年（Axpo与Zelestra，207MW，意大利北部）；第11年起转为市场化敞口；意大利从未披露租赁价格',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   Italy has the widest capex band on the platform — a factor of 2.4 — and that
   is not sloppiness. Two credible sources disagree by half: the European
   turnkey band puts a four-hour system at €720k–1.04m/MW, while expert
   interviews on Italian projects put all-in cost near $120/kWh, which is about
   €440k/MW. The authoritative document that would settle it, ARERA's reference
   technology study, exists and could not be machine-read. Until it is, the band
   is the honest form of the answer.
   --------------------------------------------------------------------------- */
const ranges = {
  capexPerMW: band(economics.capexPerMW, 440000, 260 * HOURS * 1000, {
    basis: [
      'The seed is the €220/kWh midpoint of the €180–260/kWh European turnkey 4h LFP band, whose ceiling sets the top of this range. The floor is a conflicting Italian datapoint: expert interviews in October 2025 put all-in Italian project cost near $120/kWh — roughly €440k/MW at four hours, about half the European band. The two could not be reconciled. ARERA\'s reference-technology cost study (Deliberazione 168/2025, Allegato B) would settle it and is the highest-value single follow-up for this market.',
      '种子值取欧洲4小时磷酸铁锂交钥匙区间€180–260/kWh的中值€220/kWh，该区间上限即为本range上限。下限来自一项相互矛盾的意大利数据：2025年10月的专家访谈显示意大利项目全包成本接近$120/kWh — 四小时下约合每MW €44万，约为欧洲区间的一半。二者无法调和。ARERA的参考技术成本研究（第168/2025号决议附件B）可解决该问题，是本市场最具价值的单项后续工作。',
    ],
    source: '2026 European BESS turnkey EPC surveys; Italian project expert interviews, October 2025; ARERA Del. 168/2025 Allegato B (not machine-readable)',
    gate: 'G22',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'A complete gap. No Italian fixed-opex figure was found from Terna, ARERA, GSE, MASE or trade press. €13,000/MW/yr is a placeholder consistent with the general European €10–15/kW/yr convention for grid-scale LFP and is NOT sourced. It should be replaced before it drives any published output.',
      '完全缺失。未能从Terna、ARERA、GSE、MASE或行业媒体找到任何意大利固定运维数据。每MW每年€13,000为占位值，与欧洲电网级磷酸铁锂每kW每年€10–15的通行惯例一致，但并无来源支撑。在其影响任何已发布结果之前应予替换。',
    ],
    source: 'No source — placeholder on the European convention',
    gate: 'G13',
  }),

  contracted: band(economics.contracted,
    Math.round(CM_PREMIUM * 0.53), Math.round(CM_PREMIUM * 0.90), {
      basis: [
        'The €47,000/MW/yr DY2027 clearing premium at three de-rating factors. The seed applies the current four-hour factor of 67%. The floor applies the 53% Terna has PROPOSED for DY2028 — a 21% cut per nameplate MW that would withdraw what is currently Europe\'s most favourable battery de-rating. The ceiling applies the 90% factor an eight-hour system receives today.',
        '以2027实需年度出清溢价每MW每年€47,000为基础，应用三种折减系数。种子值采用当前4小时系数67%。下限采用Terna为2028实需年度所拟定的53% — 按铭牌MW计相当于削减21%，将撤回目前欧洲最有利的储能折减待遇。上限采用八小时系统当前适用的90%系数。',
      ],
      source: 'Timera Energy on the DY2027 auction premium; Modo Energy on Terna\'s DY2028 de-rating proposal',
    }),

  contractYears: limits(economics.contractYears, 1, 15, {
    basis: [
      'New-build capacity receives 15-year contracts; existing capacity receives one year. A market-entry benchmark takes the new-build term.',
      '新建容量可获15年期合同，既有容量为一年期。市场进入基准采用新建项目期限。',
    ],
    source: 'Italian capacity market auction rules',
  }),

  postFactor: limits(economics.postFactor, 0, 1, {
    kind: 'dispersed',
    basis: [
      'No Italian source addresses post-contract capacity revenue persistence. 0.5 is the platform convention where a mechanism will still exist but its price is uncontracted.',
      '无意大利来源涉及合同期满后容量收入的持续性。当机制仍将存在但价格未合同化时，本平台惯例取0.5。',
    ],
    source: 'Methodology — no forward Italian capacity price forecast is carried',
  }),

  merchGross: band(economics.merchGross, WHOLESALE_NORTH, 200000, {
    basis: [
      'Wholesale spread only, four-hour basis, EXCLUDING MSD — the same basis on both ends. The seed and ceiling of the published forecast are Modo\'s July 2026 Italy view: €98,000/MW/yr in the North and €123,000 in the South mainland, roughly flat in real terms to 2040. South is the seed because MACSE is unavailable in the North and Centre-North, so the southern zones are the only place all four routes coexist. The upper bound is Timera\'s observed spring 2025 peak of above €200/kW annualised. Corroboration: Timera reports northern 4h day-ahead arbitrage struggling to reach €100/kW in 2024 and regularly exceeding it in 2025.',
      '仅为批发价差，四小时口径，不含辅助服务市场 — 两端口径一致。种子值与预测上限均取自Modo 2026年7月的意大利观点：北部每MW每年€98,000，南部大陆€123,000，按实际价值计至2040年大致持平。以南部作为种子值，因为北部与中北部无法参与MACSE，故南部区域是四条路径唯一并存之地。上限为Timera观测到的2025年春季峰值，年化超过每kW €200。佐证：Timera报告北部4小时日前套利在2024年难以达到每kW €100，2025年则经常超过该水平。',
    ],
    source: 'Modo Energy July 2026 Italy forecast; Timera Energy Italian arbitrage commentary',
  }),

  feePct: limits(economics.feePct, 6, 12, {
    kind: 'dispersed',
    basis: [
      'No Italian optimiser fee is published. The band is the platform\'s cross-market seed range of 8–10%, widened by the stated dispersion.',
      '意大利未公布优化商费率。该区间取本平台跨市场种子区间8–10%，并按既定离散幅度扩展。',
    ],
    source: 'Platform cross-market seeds; no Italian disclosure',
  }),

  /* The band that carries Italy's biggest open question. */
  services: band(economics.services, null, 30750, {
    basis: [
      'MSD, derived from Modo\'s published revenue split rather than from the spot index. Modo puts balancing at about 10% of southern mainland BESS revenue and about 20% in Sardinia; applying those to the €123,000 wholesale figure gives €13,700 and €30,750. The Clean Horizon Storage Index reported Italy at €654k/MW/yr North and €640k South in May 2026 with about 80% from tertiary reserve — those figures are correctly published but are a SINGLE MONTH ANNUALISED, a spot run-rate rather than an underwriting level, and they are roughly five times the forward view. Sustaining them would need about €530k/MW/yr of durable mFRR against a fleet Modo expects to grow from 1.9 GW to as much as 15 GW by 2030. MSD saturation is the dominant modelling risk in Italy.',
      '辅助服务市场收入，依据Modo公布的收入构成拆分推导，而非取自现货指数。Modo测算平衡服务约占南部大陆储能收入的10%、撒丁岛约20%；按€123,000的批发收入计算分别为€13,700与€30,750。Clean Horizon储能指数报告2026年5月意大利北部为每MW每年€654k、南部€640k，其中约80%来自三次备用 — 这些数据的公布无误，但属单月年化的现货运行率而非承销水平，约为远期预测的五倍。若要维持该水平，需在Modo预计装机将从1.9GW增至2030年最高15GW的背景下，持续获得约每MW每年€530k的三次备用收入。辅助服务市场饱和是意大利建模的主要风险。',
    ],
    source: 'Modo Energy July 2026 Italy forecast (revenue split); Clean Horizon Storage Index May 2026 (spot run-rate, not used as a seed)',
    gate: 'G23',
  }),

  toll: band(economics.toll, economics.ltda.payment, WHOLESALE_SOUTH, {
    basis: [
      'No Italian toll price has been disclosed in any of the three signed deals — Zelestra/BKW, Zelestra/EnBW and Axpo/Zelestra. Both ends are therefore anchors a rational toll must sit between rather than quotations. The floor is the MACSE four-hour equivalent of €51,836/MW/yr: below it a developer would take the TSO contract instead. The ceiling is the four-hour wholesale spread of €123,000/MW/yr: above it the offtaker loses money on the wholesale leg alone, before any MSD upside. The seed is the midpoint.',
      '三笔已签署的意大利租赁交易 — Zelestra与BKW、Zelestra与EnBW、Axpo与Zelestra — 均未披露价格。因此两端均为理性租赁定价所应落入的锚点区间，而非实际报价。下限为MACSE四小时等值的每MW每年€51,836：低于此水平开发商将转而选择电网运营商合同。上限为四小时批发价差每MW每年€123,000：高于此水平，承购方仅在批发环节即告亏损，尚未计入任何辅助服务市场的上行空间。种子值取中值。',
    ],
    source: 'Three signed Italian tolling agreements (prices undisclosed); bounded by the MACSE clear and the Modo wholesale forecast',
    gate: 'G16',
  }),

  tollYears: limits(economics.tollYears, 10, 15, {
    basis: [
      'Ten years is the only Italian toll tenor published — Axpo and Zelestra, 207 MW in northern Italy, July 2026. Fifteen is the MACSE term, the TSO-counterparty analogue that sets the upper anchor for what a long Italian contract looks like.',
      '十年是意大利唯一已公布的租赁期限 — Axpo与Zelestra，意大利北部207MW，2026年7月。十五年为MACSE期限，作为电网运营商作为对手方的类比，构成意大利长期合同形态的上限锚点。',
    ],
    source: 'Axpo / Zelestra tolling agreement, July 2026',
  }),

  'ltda.payment': band(economics.ltda.payment,
    Math.round(12146 * HOURS), Math.round(15846 * HOURS), {
      basis: [
        'Terna\'s first MACSE auction cleared at a weighted average €12,959 per MWh of storage per year, with zonal results running €12,146 in Sud e Calabria to €15,846 in Sicilia. All three converted to a four-hour equivalent. The price cap was €37,000/MWh/yr, so the auction cleared at 35% of its own ceiling. The second auction is scheduled for 24 November 2026 at 16 GWh, up from 10 GWh, with no published reserve premium at the time of writing.',
        'Terna首次MACSE拍卖以每MWh每年加权平均€12,959出清，各区域结果从南部及卡拉布里亚的€12,146至西西里的€15,846不等。三者均按四小时等值换算。价格上限为每MWh每年€37,000，故本次拍卖以其自身上限的35%出清。第二次拍卖定于2026年11月24日举行，规模由10GWh增至16GWh，截至撰写时尚未公布保留溢价。',
      ],
      source: 'Terna MACSE auction results, 30 September 2025 (revised 10 October 2025)',
    }),

  /* `ltda.years` carries NO range on purpose. Fifteen years is fixed by the
     scheme with delivery from 2028; it is not a biddable variable and not a
     modelling choice, so the Lab does not offer a slider that would imply it is
     one. Every other range on this platform is an honest interval around an
     uncertain value — an interval of zero width would be neither. */

  degr: limits(economics.degr, 1, 3, {
    kind: 'part-sourced',
    basis: [
      'The seed is derived from what the Italian market itself prices: MACSE technical compliance requires an eight-hour system to be oversized by 18% to hold contracted capacity across the term, which implies about 1.02%/yr over fifteen years. That makes it a better anchor than a warranty curve, because it is the degradation a fifteen-year Italian obligation is actually written against. The ceiling is the platform\'s general 3%/yr upper bound.',
      '种子值源自意大利市场自身的定价：MACSE技术合规要求八小时系统超配18%，以在整个合同期内维持已签约容量，据此推算约为每年1.02%。这使其成为优于质保曲线的锚点，因为它正是意大利十五年期义务实际据以订立的衰减水平。上限采用本平台通用的每年3%上界。',
    ],
    source: 'MACSE technical compliance oversizing requirement, via Italian trade press',
  }),
};

export const comparison = {
  archetype: {
    /* Four hours, matching the basis on which both published Italian revenue
       series are quoted and the Zelestra/EnBW toll of 300 MW / 1.2 GWh exactly.
       Note the tension this creates and read it as a finding: the MACSE-awarded
       fleet averaged 6.68 hours, because MACSE pays per MWh. A MACSE-optimised
       Italian battery is a materially different machine from a merchant one. */
    powerMW: 100,
    durationHours: HOURS,
  },

  score: {
    composite: 63,
    connectionRisk: 47,
  },

  /* No baseStrategy override. Japan and the NEM declare one because their
     centralised award is the route those markets are financed on; Italy's is
     not. In the DY2027 capacity auction 95% of new de-rated capacity went to
     BESS on 15-year contracts, in every zone, and that route stacks with
     merchant revenue where a MACSE award does not. So the default `cap` is the
     honest headline, and the MACSE spread — the reason this market was added —
     is carried where it belongs: as the other three dots on the frontier, and
     on every tab. Making the weakest route the headline would bury the finding
     rather than show it. */
  capabilities: {
    capacityMarket: true,
    merchant: true,
    ancillaryServices: true,
    tolling: true,
    longTermAward: true,
  },

  economics,
  ranges,

  narrative: {
    archetype: ['100 MW · 4h · four routes to market', '100MW · 4小时 · 四条售电路径'],
    thesis: [
      'The only market on this platform offering all four routes, and the only one where the choice between them is a genuine spread rather than a formality. MACSE cleared at 35% of its own price cap and at roughly half the wholesale value of the same stored energy — what it buys is a fifteen-year TSO counterparty and the gearing that comes with it. Three signed tolls prove an offtake market exists at a price nobody has published.',
      '本平台唯一提供全部四条路径的市场，也是唯一一个路径选择构成真实价差而非形式差别的市场。MACSE以其自身价格上限的35%出清，约为同等储存电量批发价值的一半 — 其换来的是十五年期电网运营商对手方以及随之而来的杠杆能力。三笔已签署的租赁交易证明存在承购市场，但无人公布其价格。',
    ],
    pipelineRatio: '~8×',
  },
};

export default comparison;
