/* ---------------------------------------------------------------------------
   Finland — comparison interface. Economics are per MW per year, in EUR.

   engineReady: FALSE, and that is the headline rather than a caveat. The
   structure below is evidenced end to end; the revenue level is not, and the
   $1M engine consumes the revenue level. Publishing a number the evidence does
   not carry, and letting it into a cross-market allocation ranking, is the
   failure mode this platform is built to avoid. So Finland gets a card, a source
   register and a thesis, and stays out of the engine until the gates close.

   ---------------------------------------------------------------------------
   WHY capacityMarket IS FALSE, WHICH IS MORE INTERESTING THAN IT SOUNDS

   Not "Finland has no capacity mechanism". It has one: peak load capacity under
   act 117/2011, administered by Finextra. The reason the flag is false is
   better than absence —

     The Energy Authority procured NO capacity for 1 Nov 2025 – 31 Oct 2026, and
     nothing has been held in the strategic reserve since July 2022. After
     Olkiluoto 3 entered service, national resource adequacy assessments show no
     concern against the LOLE 2.1 h/yr standard the Government adopted in
     March 2022.

   So there is a mechanism, it is dormant, and it is dormant because Finland does
   not presently have an adequacy problem. It is also a strategic reserve:
   capacity held OUTSIDE the market for scarcity, not an accreditation payment a
   merchant battery banks. Under the platform's definition — payment for
   accredited availability or resource adequacy, excluding operating-reserve
   markets (see RESOURCE_ADEQUACY_DEFINITION in markets/schema.js) — Finland
   scores no resource adequacy revenue on both counts.

   Fingrid does describe its FFR/FCR/aFRR/mFRR procurement as capacity markets,
   and storage participates in them heavily. Those are operating reserves, which
   the definition excludes on purpose: they are the `services` leg here, and they
   are the leg that saturates.

   ---------------------------------------------------------------------------
   THE SATURATION GATE, which is why the services leg is not a level

   Finland's reserve obligations for 2026 (Fingrid):

     FCR-D up    309 MW        FCR-N     128 MW
     FCR-D down  298 MW        aFRR      ~50 MW
     FFR         0–60 MW       mFRR up   880–1,300 MW · down 575 MW

   Against a battery fleet of roughly 250 MW operational in mid-2025, with
   Statkraft/OX2's 235 MW, Nivala's 70 MW and Uusikaupunki's 50 MW announced or
   under construction on top.

   Read those two lists together. The FAST products a battery actually wins —
   FFR, FCR-D, FCR-N — total under 800 MW of obligation, and the announced fleet
   alone approaches that. This is not a market with room for an assumed level to
   persist; it is one where the binding question is how fast the price falls.

   And the requirement forecast does not rescue it, because the growth is in the
   wrong products. Fingrid's own 2026–2036 forecast has mFRR down rising 567 →
   1,100 MW and mFRR up 290 → 530 MW, while FCR-N DECLINES 128 → 105 MW. The
   growth is in slower products where a battery competes against demand response
   and thermal plant on cost, not in the fast products where it has an advantage.

   A single flat `services` number here would be indefensible, and a rising one
   would be worse. Hence GATE FI-1 below: the services leg is not published until
   eligible/prequalified storage MW against procured MW per product can be
   tracked, which needs the Fingrid open-data series — which needs its licence
   read first (GATE FI-2).

   ---------------------------------------------------------------------------
   WHAT IS SOLID

   The merchant leg. Finland is inside the Nordic synchronous area and shares its
   frequency, so the volatility argument rests on wind being the swing producer
   and on the observed price record — negative prices, −500 €/MWh in 2024, and a
   day-ahead market that moved to a 15-minute market time unit on 1 October 2025,
   which shortens the cycle a battery is paid for. None of that depends on a
   reserve price holding up.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';

/* European turnkey mid-point, the platform's shared basis. Finland carries no
   market-specific capex evidence yet, so it takes the platform seed rather than
   inventing a local number — and the range below says so. */
const CAPEX_TOTAL_PER_MW = 440000;

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, 2),
  vatPct: 25.5, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
  opexPerMW: 9000,

  /* No resource adequacy revenue. Zero rather than absent, and the capability
     flag is what makes the engine report the route unavailable rather than
     modelling it at nil. */
  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* Day-ahead spread capture on a 2-hour asset. The one leg the evidence
     currently supports as a level rather than a curve. */
  merchGross: 78000,
  feePct: 10,

  /* GATE FI-1. Zero is not an estimate of Finnish reserve revenue — it is a
     refusal to publish one. Reserve income is the LARGEST real revenue line in
     this market and setting it to zero understates the asset substantially. That
     is the intended direction of the error: a market held out of the ranking
     with a visibly incomplete revenue line invites scrutiny, while a plausible
     number in the ranking does not. See the header and `engineReady`. */
  services: 0,

  grantPct: 0,
  degr: 2,

  servicesNote: [
    'Reserve revenue is withheld, not estimated at zero. Finland\'s fast-reserve obligations total under 800 MW while the announced battery fleet approaches that on its own, and Fingrid\'s own forecast has FCR-N declining while growth sits in slower products. A level published before that ratio can be tracked would be a forecast that today persists. Gate FI-1.',
    '备用收入为暂缓发布而非估计为零。芬兰快速备用需求合计不足800MW，而已公布的储能规模已接近该水平；且Fingrid自身预测显示FCR-N需求下降，增长集中于响应较慢的产品。在该比值可被持续跟踪之前发布任何水平值，等同于假设当前状况将长期持续。研究缺口FI-1。',
  ],
};

const ranges = {
  devCostPct: limits(0, 0, 15, {
    basis: ['Development cost as a share of build capex. Zero-seeded because published installed-cost benchmarks are EPC scope and already exclude it. No Finnish development-cost benchmark has been read, so the ceiling is the platform convention rather than a local observation.',
            '开发成本占建设造价的比例。种子值取零，因为公开的安装成本基准属EPC口径、本就不含该项。尚未获取芬兰本地开发成本基准，故上限采用平台惯例而非本地观测值。'],
    source: 'No published Finnish series; bound is the platform convention',
    gate: 'FI-3',
  }),
  rtbPremiumPct: limits(0, 0, 200, {
    basis: ['The margin a ready-to-build seller takes over development cost. No Finnish RTB trade is published — and in a market where the scarce asset is a contracted southern connection, the premium at a connected site is exactly the number nobody discloses.',
            '可开工项目卖方在开发成本之上收取的溢价。芬兰无公开的RTB交易 — 而在稀缺资产为已签约南部并网容量的市场中，已并网场址的溢价恰恰是无人披露的数据。'],
    source: 'Never published, in any market',
    gate: 'FI-3',
  }),
  constructionMonths: limits(12, 9, 24, {
    basis: ['Platform convention for a 2-hour build. Finnish programmes are not separately evidenced, though the announced fleet reaching commercial operation through 2026 suggests nothing unusual.',
            '2小时项目建设周期的平台惯例。芬兰本地工期未单独取证，但已公布机组于2026年前后陆续投运，表明并无异常。'],
    source: 'Platform convention; developer announcements for corroboration only',
    gate: 'FI-3',
  }),
  capexPerMW: band(economics.capexPerMW, 180 * 2000, 260 * 2000, {
    kind: 'dispersed',
    basis: ['The 2026 European turnkey range, €180–260/kWh installed, applied at the 2-hour reference. No Finland-specific capex has been observed.',
            '2026年欧洲整包价区间每千瓦时180–260欧元，按2小时参考时长换算。尚无芬兰本地造价观测值。'],
    source: 'European turnkey benchmark; no Finnish observation',
    gate: 'FI-3',
  }),
  opexPerMW: band(economics.opexPerMW, null, null, {
    kind: 'dispersed',
    basis: ['Platform convention pending a Finnish operating benchmark.', '平台惯例，待取得芬兰运维基准。'],
    source: 'Platform convention; no Finnish operating benchmark read',
    gate: 'FI-3',
  }),
  merchGross: band(economics.merchGross, null, null, {
    kind: 'part-sourced',
    basis: ['Day-ahead spread capture on a 2-hour asset in a market whose price record includes −500 €/MWh in 2024 and which moved to a 15-minute market time unit on 1 October 2025. The observable half is the price series; the capture assumption is not observed.',
            '基于2小时资产在日前市场的价差兑现。该市场2024年曾出现−500欧元/MWh，并已于2025年10月1日转为15分钟结算周期。价格序列为可观测部分，兑现率假设则非观测值。'],
    source: 'ENTSO-E Transparency Platform, bidding zone 10YFI-1--------U',
    gate: 'FI-4',
  }),
  feePct: limits(economics.feePct, 6, 12, {
    basis: ['Platform optimiser-fee convention. Finland has an active third-party optimisation market — Statkraft contracted OX2 batteries on a seven-year agreement — but no fee is disclosed in any of it.',
            '平台优化商费率惯例。芬兰存在活跃的第三方优化服务市场 — Statkraft已就OX2储能项目签署七年期协议 — 但其中均未披露费率。'],
    source: 'No disclosed Finnish optimiser fee; platform convention',
    gate: 'FI-3',
  }),
  /* NO BAND FOR `services`, deliberately. Every other range here lets a reader
     move a value inside evidenced bounds; this one has no value to move. A band
     of zero width fails the Lab's own rule that a band must have width, and a
     band with width would invite a reader to type in the number this market
     declines to publish and then read the output as though it were sourced.
     The withheld leg is stated in `servicesNote` and gated FI-1 instead. */
  degr: limits(economics.degr, 1, 3, {
    basis: ['The platform value, held constant across every market. No operator or OEM publishes a measured Finnish degradation series, and a fast-reserve duty cycle is not the one most published curves describe.',
            '全平台统一取值。无运营商或设备商公布芬兰实测衰减序列，且快速备用的充放循环特征与多数公开曲线所描述的工况不同。'],
    source: 'Platform value; no measured series published in any market',
    gate: 'FI-3',
  }),
};

export const comparison = {
  /* Two hours, not the four or six other markets reference. A Finnish battery is
     built for fast reserves and short-cycle spread, and the announced fleet is
     overwhelmingly 2-hour: Statkraft/OX2's two units are 110 MW/220 MWh and
     125 MW/250 MWh, Nivala 70 MW/140 MWh, Uusikaupunki 50 MW/100 MWh. */
  archetype: { powerMW: 50, durationHours: 2 },

  score: {
    /* Deliberately conservative, and not comparable to a market whose economics
       are complete. A composite computed from a revenue line that is withheld
       would rank Finland on a number this file declines to publish. */
    composite: 48,
    connectionRisk: 38,
  },

  capabilities: {
    capacityMarket: false,     // dormant strategic reserve, not adequacy revenue — see header
    merchant: true,            // day-ahead and intraday spread
    ancillaryServices: true,   // FFR, FCR-N, FCR-D up/down, aFRR, mFRR
    tolling: false,            // no repeatable PUBLIC precedent read — decision 4, round 1
  },

  /* THE FLAG THAT KEEPS THIS HONEST. Finland appears on the cards, in the nav
     and in its own source register, and is excluded from the league table, the
     $1M engine and the certainty frontier until GATE FI-1 and FI-2 close. */
  engineReady: false,

  economics,
  ranges,

  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. There is no contracted leg to defer to, so merchant exposure begins at commercial operation.',
    '第1年。无合同收入项可递延，故市场化敞口自商业运行起即存在。',
  ]),

  narrative: {
    archetype: ['50 MW · 2h · reserve-led', '50MW · 2小时 · 备用主导'],
    thesis: [
      'Europe\'s clearest fast-reserve market, and the clearest test of whether a reserve-led thesis survives its own buildout. Wind is the swing producer, the day-ahead market moved to 15-minute settlement in October 2025, and the strategic reserve has been dormant since 2022 because Olkiluoto 3 removed the adequacy problem. What is not yet answerable is the price path: fast-reserve obligations total under 800 MW and the announced battery fleet approaches that alone, so the revenue line is withheld rather than assumed.',
      '欧洲最典型的快速备用市场，也是"备用主导"投资逻辑能否经受住自身装机扩张考验的最清晰样本。风电为边际调节电源，日前市场已于2025年10月转为15分钟结算，而战略备用自2022年起处于休眠状态 — 原因是Olkiluoto 3核电机组投运后充裕度问题已消失。尚无法回答的是价格路径：快速备用需求合计不足800MW，仅已公布的储能项目即接近该规模，故收入项暂缓发布而非直接假设。',
    ],
    /* Fast-reserve obligation against the announced fleet, which is the ratio the
       thesis turns on. Announced is not financed — the number is deliberately
       the optimistic reading of supply, because that is the conservative reading
       of price. */
    pipelineRatio: '~0.8x',
  },
};

export default comparison;
