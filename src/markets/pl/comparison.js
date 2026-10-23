/* ---------------------------------------------------------------------------
   Poland — comparison interface. Economics are per MW per year, in EUR.

   REVISED 2026-07-30 against the December 2025 main auction (2030 delivery).
   The previous values reproduced the prototype: €60.9/kW × 0.65, from the
   December 2024 auction, carrying a "(seed, verify)" comment. Both halves moved,
   in opposite directions, and the net effect is a 63% cut:

       clearing price   PLN 264.90  →  PLN 465.02 /kW/yr        (+76%)
       KWD correction        0.65   →       0.1339              (-79%)
       per nameplate MW    €39,585  →      €14,481

   PSE cut the availability correction factor for storage from ~60% (2024) and
   95% (2023) to 13.39%: for every 100 MW of battery built, 13.4 MW of capacity
   obligation can be contracted. Around 685 MW of de-rated obligation was awarded
   against roughly 5.1 GW of physical battery.

   READ THIS BEFORE QUOTING THE NUMBER. Contracts already won at the old factors
   are grandfathered for their full seventeen years. This figure is therefore
   wrong for an existing contracted asset and right for a new entrant — and a
   market-entry benchmark is what the cockpit models. docs/external-view.md §3.

   The capacity line is declared as its components rather than as a product, so
   price and de-rating can drift, and be proposed against, independently. That
   separation exists because of this market.

   MERCHANT RE-SEEDED 2026-10-23, UP (docs/merchant-lines-plan-2026-10.md §2,
   approved by the analyst). The €78k seed was a prototype value with no
   derivation: 49% of 2025's theoretical four-hour spread and 54% of what a 4h
   battery could schedule at PSE's own day-ahead prices (€145.7k). The seed is
   now that observed value restated at year 1 (COD 2028) along the fleet path
   the capacity-market and grant cohorts produce, with `merchantCurve` after it.
   --------------------------------------------------------------------------- */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';
import { quotedEconomics } from '../../comparison/supplierQuote.js';

/* The merchant leg's level and path (docs/merchant-lines-plan-2026-10.md §2).

   DA_VALUE_4H_2025  2025 day-ahead value of a 1 MW / 4h battery at PSE's
                     csdac-pln prices (ECB rate of the trading day): one cycle a
                     day, 88% round trip, perfect foresight, €399.1/MW/day × 365.
                     Realisation 100% (gate MR-1).
   PATH              factor by calendar year from Poland's average fleet (GW:
                     2025 0.3, 2026 0.9, 2027 1.95, 2028 3.5, 2029 4.75, 2030
                     5.75, then flat) over the 18.08 GW average load (PSE
                     kse-load, 2025), on Romania's Bulgaria-fitted curve. The
                     fleet follows PSE's capacity-market ramp (~2 GW 2028, ~4 GW
                     2029, up to 5 GW 2030) and NFOŚiGW's 3.9 GW / 14.5 GWh
                     cohort, together about 5 GW by 2029 and over 6 GW in 2030.
   FAST_2028/SLOW    2028 factor with the grant cohort fully additive, and with
                     the capacity ramp alone. */
const DA_VALUE_4H_2025 = 399.1 * 365;          // €145,671.5
const PATH = { 2026: 0.976, 2027: 0.940, 2028: 0.898, 2029: 0.871, 2030: 0.853 };
const FAST_2028 = 0.866, SLOW_2028 = 0.924;
const YEAR_ONE = 2028;

/* PLN per EUR. Stated here rather than in the global FX table because Poland is
   modelled in EUR throughout and this rate converts one input, not the market. */
const PLN_PER_EUR = 4.30;

const capacity = {
  price: 465.02,
  unit: 'kW',
  priceCurrency: 'PLN',
  fxToMarket: 1 / PLN_PER_EUR,
  derating: 0.1339,
  auction: ['Main auction, December 2025', '2025年12月主拍卖'],
  deliveryYear: 2030,
  source: 'URE final results, 2030 delivery year; KWD availability correction factor for BESS',
  note: [
    'KWD cut to 13.39%, from ~60% (2024) and 95% (2023). Contracts already won are grandfathered.',
    'KWD由约60%（2024年）及95%（2023年）降至13.39%。已中标合同按原系数锁定。',
  ],
};

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 970000;

/* The supplier quotation's DC block inside that total — method HELD: the total is a
   2026 European price survey that already prices today's DC blocks, so it stands and
   the quote says how much of it is the block (src/comparison/capex.js). */
const OPEX_SEED_PER_MW = 9000;
const QUOTED = quotedEconomics({ currency: 'EUR', hours: 4, method: 'held', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

const economics = {
  capexPerMW: 970000,

  /* ---- capital structure -------------------------------------------------
     The stack reconciles exactly to the installed cost above — `stackFrom`
     puts the residual in EPC — so introducing it moved no published return.
     What it adds is the ability to move one component without moving the rest,
     and a place for the market-specific lines to sit visibly rather than
     inside a single number. Component split is global until gate G24 closes.

     VAT is 23% here (Polish VAT, recoverable as input tax). It is carried as timing rather than cost:
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
  /* The flat seed was 9,000/MW/yr. The supplier's service package now runs as its own
     back-loaded line below, and this is the rest of fixed opex: the seed less the
     package's fifteen-year mean, so the fifteen-year total is unchanged. */
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // ≈ €14,481
  contractYears: 17,
  postFactor: 0.5,

  /* The 2025 day-ahead value restated at year 1: €145,671.5 × 0.898 = €130,813.
     Was €78,000. Clean Horizon's €800k+ May 2026 run-rate stays context only
     (docs/external-view.md §5.4). */
  merchGross: Math.round(DA_VALUE_4H_2025 * PATH[YEAR_ONE]),
  /* Year 1 = 2028: 0.871 ÷ 0.898 and 0.853 ÷ 0.898, held after year 3. */
  merchantCurve: [1.000, 0.970, 0.950],
  merchantCurveBasis: {
    yearOne: YEAR_ONE,
    text: [
      'Poland\'s fleet, 0.3 GW in 2025 to 5.75 GW in 2030 (PSE\'s capacity-market ramp and the NFOŚiGW grant cohort), on the compression Bulgaria\'s fleet produced in 2026: −24.3% × (1 − e^(−x/0.324)), x = added battery MW ÷ average load.',
      '波兰储能由2025年的0.3GW增至2030年的5.75GW（PSE容量市场投运节奏及国家环保基金补贴批次），并采用保加利亚储能在2026年造成的价差压缩曲线：−24.3% × (1 − e^(−x/0.324))，x为新增电池功率除以平均负荷。',
    ],
  },
  feePct: 9,
  services: 10000,
  /* NFOŚiGW / Modernisation Fund grants (source `nfos`) are awarded per project
     by competitive call, so a new entrant holds none until it wins one. New-entry
     screening therefore carries zero; an awarded project's grant can be entered
     in the Lab. */
  grantPct: 0,
  degr: 2,

  grantNote: ['NFOŚiGW / Modernisation Fund grants are awarded per project; a new entrant without an award carries none', '国家环保基金/现代化基金补贴按项目授予；未获授予的新进入者不计补贴'],
  capNote: [
    '17-yr contract on 13.39% of nameplate; outlives the 15-yr window',
    '17年合同，仅覆盖铭牌容量的13.39%；期限长于15年比较窗口',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   Poland is the market that proves why ranges belong on this platform at all.
   Both halves of the capacity line moved in the December 2025 auction, in
   opposite directions, and the correction factor moved by four fifths. A single
   seeded number cannot express that; a band whose two endpoints are two real
   auctions can.

   The merchant ceiling is the uncomfortable one and it is deliberately left in.
   Clean Horizon's Storage Index put a Polish 2h at €800k+/MW/yr — read the basis
   before using it.
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
      'European turnkey 4h LFP is €180–260/kWh installed, i.e. €720k–1.04m/MW. The seed of €242.5/kWh sits inside that band, so both ends are observations.',
      '欧洲4小时磷酸铁锂交钥匙安装成本为€180–260/kWh，即每MW €72万–104万。种子值€242.5/kWh处于该区间之内，故两端均为实测观察值。',
    ],
    source: '2026 European BESS turnkey EPC surveys (€180–260/kWh, 4h LFP)',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No published Polish fixed-opex series. €9,000/MW/yr is ≈US$9,700, below the US utility-scale benchmark of US$15–25k/MW/yr, which is context rather than a bound.',
      '无波兰固定运维公开序列。€9,000/MW/年约合US$9,700，低于美国公用事业级基准US$15–25k/MW/年 — 后者仅为参照，非边界。',
    ],
    source: 'Platform seed',
    gate: 'G13',
  }),

  /* Two auctions, both published, price and correction factor moving together —
     which is what a new entrant is actually exposed to. */
  contracted: band(economics.contracted,
    Math.round(264.90 * 0.1339 / 4.30 * 1000),
    Math.round(465.02 * 0.60 / 4.30 * 1000), {
      basis: [
        'The December 2025 auction cleared PLN 465.02/kW/yr (+76% on Dec-2024\'s PLN 264.90) while PSE cut the KWD availability correction factor for storage to 13.39%, from ~60% in 2024 and 95% in 2023. The floor pairs the old price with the new factor; the ceiling pairs the new price with the 2024 factor. Around 685 MW of de-rated obligation was awarded against roughly 5.1 GW of physical battery.',
        '2025年12月拍卖出清价为PLN 465.02/kW/年（较2024年12月的PLN 264.90上涨76%），与此同时PSE将储能的KWD可用性修正系数下调至13.39%，此前2024年约为60%、2023年为95%。下限为旧价格配新系数，上限为新价格配2024年系数。约685MW的折减后容量义务对应约5.1GW的物理电池容量。',
      ],
      source: 'URE final auction results, 2030 and 2029 delivery years; PSE KWD correction factors',
      gate: 'G3',
    }),

  contractYears: limits(economics.contractYears, 1, 17, {
    basis: [
      'Seventeen years is the longest new-build capacity agreement in the platform and outlives the 15-year comparison window. Contracts already won at the old correction factors are grandfathered for their full term — which is why this figure is right for a new entrant and wrong for an existing contracted asset.',
      '十七年是本平台中最长的新建容量协议期限，超出15年比较窗口。已按旧修正系数中标的合同在其完整期限内受祖父条款保护 — 这正是该数值适用于新进入者、而不适用于既有已签约资产的原因。',
    ],
    source: 'Polish capacity market, 17-year agreements for new build',
  }),

  postFactor: limits(economics.postFactor, 0, 1, {
    kind: 'dispersed',
    basis: [
      'Immaterial at the seeded level and at this tenor: a 17-year contract outlives the 15-year comparison window, so nothing after expiry enters the model at all. It becomes material only if the contract length is shortened below 15.',
      '在种子设定水平与该期限下并不重要：17年合同长于15年比较窗口，因此到期后的情形完全不进入模型。仅当合同年限缩短至15年以下时才具实质影响。',
    ],
    source: 'Methodology — no forward auction price forecast is carried',
  }),

  /* Both ends are the same observed series at other realisations and build rates. */
  merchGross: band(economics.merchGross,
    Math.round(DA_VALUE_4H_2025 * 0.80 * FAST_2028),
    Math.round(DA_VALUE_4H_2025 * 1.10 * SLOW_2028), {
      basis: [
        'The seed is the 2025 day-ahead value of a 4h battery at PSE\'s prices (€145.7k: hourly, one cycle a day, 88% round trip, perfect foresight) restated at year 1 (COD 2028) by the fleet path, × 0.898. The floor takes 80% realisation with the grant cohort fully additive to the capacity ramp (× 0.866); the ceiling 110% with the capacity ramp alone (× 0.924). Clean Horizon\'s May 2026 run-rate of €800k+ for a 2h is a spot signal and stays outside the band (docs/external-view.md §5.4).',
        '种子值为4h电池按PSE价格计算的2025年日前价值（€145.7k：小时价格、每日一次循环、往返效率88%、完全预见），按储能增长路径折算至第1年（2028年投运），× 0.898。下限取80%实现率且补贴批次完全叠加于容量市场节奏（× 0.866）；上限取110%实现率且仅计容量市场节奏（× 0.924）。Clean Horizon 2026年5月2小时资产€80万+的运行率属现货信号，不纳入区间（docs/external-view.md §5.4）。',
      ],
      source: 'PSE csdac-pln (SDAC day-ahead price, Polish zone), 2025; PSE capacity-market ramp via Parkiet; NFOŚiGW ranking list, 12 Dec 2025; docs/merchant-lines-plan-2026-10.md',
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
      'Polish aFRR capacity has cleared above €120/MW/h, which is the driver behind the merchant ceiling above rather than a per-MW services benchmark. No separate published system-services series exists for a Polish BESS.',
      '波兰aFRR容量出清价已超过€120/MW/h，该数据支撑的是上方市场化收入上限，而非每MW系统服务基准。目前无针对波兰储能的独立系统服务公开序列。',
    ],
    source: 'Platform seed; Polish aFRR capacity >€120/MW/h as context',
  }),

  grantPct: limits(economics.grantPct, 0, 40, {
    basis: [
      'Zero is a new entrant, because the NFOŚiGW round is allocated. The ceiling covers an awarded project: the 12 December 2025 ranking list gives PLN 3.735bn of grants against PLN 9.847bn of cost across 169 projects, a 37.9% average grant (loans of PLN 0.415bn are financing, not a grant). The awardee play prices at 37.9%.',
      '取零对应新进入者，因为国家环保基金的本轮补贴已分配完毕。上限覆盖已获授予的项目：2025年12月12日排名清单显示169个项目总成本PLN 98.47亿、补贴PLN 37.35亿，平均补贴比例37.9%（PLN 4.15亿贷款属融资而非补贴）。补贴获得者投资机会按37.9%定价。',
    ],
    source: 'NFOŚiGW Modernisation Fund storage programme, ranking list of 12 Dec 2025',
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
  /* The capacity agreement is a legacy DY2030 vintage. The last main auction has
     ended, so a new entrant defaults to merchant + balancing pending a successor.

     One route did open, and it is deliberately NOT in this case. The supplementary
     T-1 auction of 3 September 2026 (delivery 2027) cleared batteries for the first
     time, at PLN 325.55k/MW/yr on the 95% availability factor set in 2022 rather
     than the 13.39% of the last main auction. It is a one-year top-up open to a
     battery already online before its delivery year, so it is vintage-specific
     income for early-COD assets, not a contract a new entrant can plan on. Modo's
     own versions disagree on the battery volume (80 vs 94 MW de-rated). */
  baseStrategy: 'mer',
  archetype: {
    powerMW: 100,
    durationHours: 4,
  },

  /* How each line scales with duration, for the design-fit sweep
     (src/comparison/designFit.js). Shapes relative to four hours.

     The capacity line scales to four hours and no further. The December 2025
     auction applied one correction factor, 13.39%, to storage of every
     duration, but to CERTIFIED capacity, which must be deliverable for four
     uninterrupted hours, so a shorter battery certifies MWh ÷ 4: the factor is
     0.1339 × min(1, h/4). Gate DG-1, opened 2026-10-15, and the analyst's
     correction of the same day, replacing first the dashboard's duration-scaled
     seed and then PR 1's flat curve. The capture curve is the dashboard's. */
  durationResponse: {
    hours: [1, 2, 4, 6, 8],
    capacityDerating: [0.1339 / 4, 0.1339 / 2, 0.1339, 0.1339, 0.1339],
    capacityDeratingBasis: ['rule', 'rule', 'published', 'published', 'published'],
    /* Observed: 2023–2025 mean of day-ahead value per MWh by duration,
       relative to 2h (PSE for 2025). Was the seed 1.12, 1.00, 0.84, 0.72, 0.63. */
    merchantCapture: [1.086, 1.000, 0.845, 0.708, 0.571],
    merchantCaptureBasis: 'observed',
    opexEnergyShare: 0.5,
  },

  capabilities: {
    capacityMarket: true,      // capacity contract via auction
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics,
  ranges,

  /* The line the evidence rule checks (src/governance/briefing.js). */
  merchantEvidence: {
    year: 2025,
    hours: 4,
    observedPerMW: Math.round(DA_VALUE_4H_2025),
    restateFactor: PATH[YEAR_ONE],
    /* 2023–2025 observed: €68,985 / €124,830 / €145,672. */
    range: [Math.round(189.0 * 365), Math.round(DA_VALUE_4H_2025)],
    pathFit: 'other-market',
    source: 'PSE csdac-pln, 2025',
    basis: [
      '2025 day-ahead value of a 4h battery at PSE\'s prices: hourly, one cycle a day, 88% round trip, perfect foresight.',
      '4h电池按PSE价格计算的2025年日前价值：小时价格、每日一次循环、往返效率88%、完全预见。',
    ],
  },

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Capacity contract revenue is additive to merchant, so both merchant legs are exposed from commercial operation and are stated on the same observed basis.',
    '第1年。容量合同收入与市场化收入并存，因此两个市场化收入项自商业运行起即处于敞口状态，并按同一观测口径列示。',
  ]),

  narrative: {
    archetype: ['100 MW · 4h · new-entry merchant + balancing', '100MW · 4小时 · 新进入者市场化+平衡服务'],
    thesis: [
      'No new-entry capacity route, but the day-ahead market pays almost twice what the platform carried. The December 2025 auction was the last main auction; the seventeen-year contract stays visible as a legacy vintage, and the one-year supplementary auctions are a top-up for assets already online. An uncontracted four-hour project returns about 7%, below the platform\'s yields; a project in the 2025 NFOŚiGW grant cohort returns about 17%.',
      '没有新进入者的容量路径，但日前市场的收益几乎是本平台此前所采用水平的两倍。2025年12月拍卖是最后一次主拍卖；17年容量合同仅作为历史年份保留，一年期补充拍卖只是已投运资产的增量收入。无合同的四小时项目回报约7%，低于本平台收益率；2025年国家环保基金补贴批次中的项目回报约17%。',
    ],
    pipelineRatio: '~13×',
  },
};

export default comparison;
