/* ---------------------------------------------------------------------------
   Finland — comparison interface. Economics are per MW per year, in EUR.

   REVISED 2026-10-17: engine-ready. Until then this market was held out of the
   engine because its reserve level was not evidenced. The analyst ruled that
   the level is what Fingrid's 2026 annual market paid, spread across the
   fleet, and that the negotiated optimiser floor enters as a floor — both set
   below, with their arithmetic. The saturation argument that follows is why
   that level is low, and it still stands.

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

   Against connected storage that passed 1,050 MW in early February 2026 —
   261 systems of 1 MW and above totalling ~980 MW, plus ~70 MW of smaller
   batteries tracked through the reserve markets.

   Read those two lists together and the result is an ACUTE SATURATION WARNING.
   Connected storage of ~1,050 MW stands against fast-reserve obligations
   summing to about 795 MW.

   That is a warning and not a proof, and the difference is worth being exact
   about, because overstating it would be the same failure as the understatement
   it replaced:

     · The 795 MW is a SUM ACROSS DISTINCT PRODUCTS — FFR, FCR-D up, FCR-D down,
       FCR-N — procured separately, with their own prequalification and their own
       clearing. A megawatt is not fungible across them, so the sum is an
       accounting convenience rather than a single market to be filled.
     · The 1,050 MW counts all storage of 1 MW and above rather than batteries
       alone, and 56% of it sits on the distribution grid. Distribution-connected
       storage does reach the reserve markets, but not every megawatt is
       prequalified for every product.

   So this is an upper bound on competition set against an aggregate of separate
   demands. What it does NOT establish is that the competing fleet exceeds the
   demand it competes for. What it does establish is that the margin for an
   assumed revenue level to persist is thin enough that publishing one would be a
   forecast rather than an observation — which is all the withheld line needs.

   The requirement forecast tilts against a battery without rescuing or dooming
   anything, and the earlier wording here overstated it. CORRECTED 2026-08-19
   against the source: on Fingrid's 2026–2036 forecast the fast block — FFR,
   FCR-N and FCR-D — rises from about 734 MW to about 853 MW, roughly +16%,
   because FCR-D up (307 → 379) and FCR-D down (296 → 366) both grow even as
   FCR-N declines 128 → 105. The slower block, aFRR and mFRR, rises from about
   960 MW to about 1,850 MW, roughly +93%. So fast procurement GROWS; the weight
   of the growth simply sits in the slower products, where a battery competes
   against demand response and thermal plant on cost rather than where it has an
   advantage. That is the real point and it survives; "the growth is in the
   wrong products" was the wrong way to say it, because it implied the fast
   products were shrinking.

   Both figures are a non-binding forecast of AVERAGE PROCUREMENT, which is a
   different measure from the obligation table. They are never differenced.

   A single flat `services` number here would be indefensible, and a rising one
   would be worse. Hence GATE FI-1 below: the services leg is not published until
   eligible/prequalified storage MW against procured MW per product can be
   tracked. That needs the Fingrid open-data series, which is published under
   Creative Commons Attribution and is therefore republishable — what remains is
   provisioning the API key, recording the terms accepted at registration and
   implementing the attribution (GATE FI-2).

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
import { quotedEconomics } from '../../comparison/supplierQuote.js';

/* European turnkey mid-point, the platform's shared basis. Finland carries no
   market-specific capex evidence yet, so it takes the platform seed rather than
   inventing a local number — and the range below says so. */
const CAPEX_TOTAL_PER_MW = 440000;

/* The supplier quotation's DC block inside that total — method HELD: the total is a
   2026 European price survey that already prices today's DC blocks, so it stands and
   the quote says how much of it is the block (src/comparison/capex.js). */
const OPEX_SEED_PER_MW = 9000;
const QUOTED = quotedEconomics({ currency: 'EUR', hours: 2, method: 'held', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: QUOTED.capexStack,
  capexQuotedPerMW: QUOTED.capexQuotedPerMW,
  vatPct: 25.5, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
  /* The flat seed was 9,000/MW/yr. The supplier's service package now runs as its own
     back-loaded line below, and this is the rest of fixed opex: the seed less the
     package's fifteen-year mean, so the fifteen-year total is unchanged. */
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

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

  /* GATE FI-1. NULL, not zero, and the distinction is the point.

     An earlier draft wrote 0 and explained the refusal in the note below. That
     is the wrong machine representation: prose says "unknown", the object says
     "zero", and every consumer reads the object. Zero is a claim — that a
     Finnish battery earns nothing from reserves — which is false, and false in
     the way that survives being copied into an export.

     null says "not evidenced", `unavailable` says why in a form a machine can
     carry, and validation refuses the combination on an engine-ready market.
     See UNAVAILABLE_REQUIRES_UNREADY in markets/schema.js. */
  /* REVISED 2026-10-17 — GATE FI-1 CLOSED ON A FLOOR-LEVEL OBSERVATION, the
     analyst's ruling of 2026-10-17. What Fingrid's 2026 annual reserve market
     actually paid, spread across the fleet that competes for it:

        FCR-D up    237 MW × €3.50/MW,h      FCR-N annual   0 MW, €0
        FCR-D down  163 MW × €6.00/MW,h      (cleared at zero; all hourly)

        (237 × 3.50 + 163 × 6.00) × 8,760 h ÷ 1,050 MW connected = €15,080/MW/yr

     Fingrid, yearly-market results for delivery year 2026. The hourly markets
     (FCR-N, the FCR-D remainder, aFRR, mFRR, FFR) are NOT counted: their prices
     are not yet tracked here (gate FI-2), and in a saturated market the hourly
     clearing is where cannibalisation shows first. So this is the reserve
     revenue an average connected megawatt can show today from the one fixed-
     price market, not a forecast of what a well-optimised one earns — which is
     why it is the seed and the band runs well above it. */
  services: Math.round((237 * 3.50 + 163 * 6.00) * 8760 / 1050),   // 15,080
  servicesNote: [
    'Fingrid’s 2026 annual FCR-D clearing spread across the 1,050 MW connected fleet; the hourly reserve markets are not counted.',
    'Fingrid 2026年度FCR-D出清收入按1,050MW并网储能分摊；未计入小时级备用市场。',
  ],

  /* THE NEGOTIATED FLOOR (the analyst's rulings of 2026-10-10). Finnish
     optimisers and offtakers sign floors of seven years or more that cover the
     whole project at no more than half of expected revenue, and a floor is a
     secured route at its own level. Modelled as a floor under the market line
     (`tollIsFloor`, src/comparison/engine.js): the owner earns the larger of the
     floor and the market for the floor's term, and the floor is the secured part.

        expected year 1 = 78,000 × (1 − 10%) + 15,080 = 85,280
        floor           = 50% × 85,280 = 42,640/MW/yr for 7 years

     Practitioner basis, recorded without its source. */
  toll: Math.round(0.5 * (78000 * 0.9 + Math.round((237 * 3.50 + 163 * 6.00) * 8760 / 1050))),   // 42,640
  tollYears: 7,
  tollIsFloor: true,
  tollRevertsToMerchant: true,
  tollNote: [
    'Negotiated optimiser floor at half of expected revenue for seven years; the owner keeps the market revenue above it',
    '与优化商协商的保底，为预期收入的一半、为期七年；高于保底的市场收入归业主所有',
  ],

  grantPct: 0,
  degr: 2,

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
  /* Low end: the hourly FCR-N market already clears at zero in hours of surplus,
     so a battery that wins nothing annual can earn nothing from reserves. High
     end: one MW holding both FCR-D products in the annual market all year at the
     2026 prices, (3.50 + 6.00) × 8,760 = €83,220. */
  services: limits(economics.services, 0, Math.round((3.50 + 6.00) * 8760), {
    basis: ['From nothing — FCR-N annual cleared at zero for 2026 and the hourly markets are saturating — to one MW holding both FCR-D products in the annual market all year at the 2026 prices. The seed is the 2026 annual clearing spread across the 1,050 MW connected fleet.',
            '下限为零 — 2026年度FCR-N以零出清，小时级市场趋于饱和；上限为1MW全年在年度市场同时持有FCR-D上下调两个品种、按2026年价格计算。种子值为2026年度出清收入按1,050MW并网储能分摊。'],
    source: 'Fingrid, yearly reserve market results for delivery year 2026',
    gate: 'FI-2',
  }),
  toll: limits(economics.toll, Math.round(economics.toll * 0.6), economics.toll, {
    basis: ['A floor of at most half of expected revenue (the analyst’s practitioner input); the seed is that ceiling, and a lower floor down to 30% of expected is within what is signed.',
            '保底不超过预期收入的一半（分析师的实务输入）；种子值即该上限，低至预期收入30%的保底亦在已签约范围内。'],
    source: 'Analyst practitioner input, 2026-10-10',
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
     125 MW/250 MWh, Uusikaupunki 50 MW/100 MWh. Nivala, as sold in October 2026,
     is a 100 MW/400 MWh four-hour build — the first sign of longer duration. */
  archetype: { powerMW: 50, durationHours: 2 },

  capabilities: {
    capacityMarket: false,     // dormant strategic reserve, not adequacy revenue — see header
    merchant: true,            // day-ahead and intraday spread
    ancillaryServices: true,   // FFR, FCR-N, FCR-D up/down, aFRR, mFRR
    tolling: true,             // the negotiated optimiser floor, as a floor (tollIsFloor) — 2026-10-17
  },

  /* In the engine since 2026-10-17, when the reserve line was set at its 2026
     floor-level observation (gate FI-1, above). Gate FI-2 — the hourly reserve
     prices — still decides whether the seed is too low. */
  engineReady: true,

  /* The negotiated floor is the route the fund play takes (the analyst's
     instruction of 2026-10-17), so it is the case the cockpit models. */
  baseStrategy: 'toll',

  /* The design sweep's response to duration. Capture is Romania's 2-hour-
     referenced seed curve, the platform's other short-duration merchant market,
     until a Finnish 15-minute backtest replaces it (gate FI-4). Reserves are
     paid per MW and do not scale with hours. */
  durationResponse: {
    hours: [1, 2, 4, 6, 8],
    merchantCapture: [1.1, 1.0, 0.82, 0.7, 0.62],
    merchantCaptureBasis: 'seed',
    opexEnergyShare: 0.5,
    note: ['Seed capture curve shared with Romania until a Finnish 15-minute backtest replaces it (gate FI-4).',
           '在芬兰15分钟回测替代之前，暂与罗马尼亚共用种子捕获曲线（研究缺口FI-4）。'],
  },

  economics,
  ranges,

  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. There is no contracted leg to defer to, so merchant exposure begins at commercial operation.',
    '第1年。无合同收入项可递延，故市场化敞口自商业运行起即存在。',
  ]),

  narrative: {
    archetype: ['50 MW · 2h · trading under a floor', '50MW · 2小时 · 保底下的交易'],
    thesis: [
      'Europe\'s clearest fast-reserve market, and the clearest test of whether a reserve-led thesis survives its own buildout. Wind is the swing producer, the day-ahead market moved to 15-minute settlement in October 2025, and the strategic reserve has been dormant since 2022 because Olkiluoto 3 removed the adequacy problem. Connected storage passed 1,050 MW in February 2026 against about 795 MW of fast-reserve obligation and FCR-N’s annual auction cleared at zero, so reserves are priced at what the 2026 annual market paid across the fleet, trading carries the case, and a negotiated floor secures half of it for seven years.',
      '欧洲最典型的快速备用市场，也是"备用主导"投资逻辑能否经受住自身装机扩张考验的最清晰样本。风电为边际调节电源，日前市场已于2025年10月转为15分钟结算，而战略备用自2022年起处于休眠状态 — 原因是Olkiluoto 3核电机组投运后充裕度问题已消失。2026年2月已并网储能超过1,050MW，而快速备用需求合计约795MW，FCR-N年度拍卖以零出清，因此备用收入按2026年度市场在全部储能间分摊的水平计价，交易支撑投资逻辑，协商保底锁定其一半、为期七年。',
    ],
    /* PIPELINE TO OPERATING, which is what this field means everywhere else on
       the platform — not the saturation ratio, which an earlier draft put here.
       Finland's own basis: more than 30,000 MW of storage connection requests
       against about 1,050 MW connected.

       The saturation comparison — connected storage against the summed
       fast-reserve obligation — is a different quantity and lives in data.js
       under `saturation`, where it can carry the qualifications it needs. Two
       ratios in one field would have made the league table's column mean
       something different for one market than for the other fourteen. */
    pipelineRatio: '~29×',
  },
};

export default comparison;
