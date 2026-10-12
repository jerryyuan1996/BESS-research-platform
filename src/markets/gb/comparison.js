/* ---------------------------------------------------------------------------
   GB — comparison interface. Economics are per MW per year, in GBP.

   REVISED 2026-07-30. The archetype moves from 2h to 4h, which is a house
   position rather than a data refresh, and it is the position the T-4 2029/30
   result supports: two-hour systems led on connection capacity, but four- and
   five-hour systems combined won more DE-RATED capacity, which is the thing the
   auction actually pays for.

       new-build storage awards, T-4 2029/30
       2h  431 MW · 4h  224 MW · 5h  273 MW · 8h  70 MW      (1.18 GW total)

   Fleet-wide the same split shows up in energy: two-hour-and-longer batteries
   captured 65% of available Equivalent Energy Time in 2025/26 against 29% for
   sub-two-hour. The expected end state, which most GB analysts now describe, is
   a two-tier market where 4h and 8h dominate T-4 and 1-2h are squeezed into
   lower-margin ancillary.

   Unit costs are unchanged in the move: £460k/MW at 2h and £900k/MW at 4h are
   both ≈£225/kWh, which sits inside the European turnkey band.

   GB is still the only market declaring `tolling`, and the structure is now
   modelled as the precedent actually reads rather than as a simplification —
   see tollNote.
   --------------------------------------------------------------------------- */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { stackFrom } from '../../comparison/capex.js';

const capacity = {
  price: 27.10,
  unit: 'kW',
  priceCurrency: 'GBP',
  fxToMarket: 1,

  /* ASSUMPTION, and the weakest input in this file. NESO publishes de-rating
     factors by duration in the Auction Guidelines workbook; the values we hold
     are 1h 10.47% and 2h 20.94% (CM year 2024/25). GB's methodology does not
     scale linearly past 2h — a 4h factor is well below 2 × the 2h factor — so
     0.38 is an interpolation, not an observation. Gate G1 closes it.

     The direction of travel is downward: factors fell sharply for 2026/27 and
     2027/28 on a NESO stress-event methodology change, partially recovered for
     2028/29 and 2029/30, and NESO's stated long-run expectation is further
     decline as stress events lengthen. */
  derating: 0.38,

  auction: ['T-4, March 2026', '2026年3月T-4拍卖'],
  deliveryYear: 2029,
  source: 'NESO T-4 2029/30 clearing price £27.10/kW/yr; 4h de-rating factor interpolated — see gate G1',
  note: [
    '£27.10/kW follows three consecutive T-4s at £60-65/kW. De-rating for 4h is interpolated, not published.',
    '£27.10/kW之前连续三次T-4拍卖为£60–65/kW。4小时可信容量系数为插值，非公布值。',
  ],
};

/* The installed cost the component stack must reconcile to. */
const CAPEX_TOTAL_PER_MW = 900000;

const economics = {
  /* ≈£225/kWh at 4h — the same unit cost the 2h archetype carried, and inside
     the European turnkey 4h LFP band. Quoted alongside GB tolls of
     £70-80k/MW/yr and unlevered IRRs of 10-12%. */
  capexPerMW: 900000,

  /* ---- capital structure -------------------------------------------------
     The stack reconciles exactly to the installed cost above — `stackFrom`
     puts the residual in EPC — so introducing it moved no published return.
     What it adds is the ability to move one component without moving the rest,
     and a place for the market-specific lines to sit visibly rather than
     inside a single number. Component split is global until gate G24 closes.

     VAT is 20% here (UK VAT, recoverable by a taxable business). It is carried as timing rather than cost:
     recoverable, so it drags the return only through the refund lag, and the
     lag is zero until an analyst sets one — gate G27. Set `vatRecoverable:
     false` and it capitalises instead.

     `devCostPct` is zero deliberately. Published installed-cost benchmarks are
     EPC scope and exclude development, so a non-zero value here would be a new
     cost rather than a reallocation, and that is an analyst's call — gate G25.
     Set it, then set `rtbPremiumPct`, and the Lab reports the implied RTB
     acquisition price per MW. */
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, 4),
  vatPct: 20, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  /* Twelve months is one spend period, which is the single up-front outflow the
     model has always used. Longer builds split the spend across an S-curve and
     push first revenue out; that is what an HV transformer lead time does. */
  constructionMonths: 12,
  opexPerMW: 13000,          // scaled from £9,000 at 2h for the larger energy block

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // ≈ £10,298
  contractYears: 15,         // 15-year agreements are on offer to new build
  postFactor: 0.5,

  /* ASSUMPTION. £73,145/MW/yr is Modo's ME BESS GB benchmark for a TWO-HOUR
     battery over the twelve months to April 2026 — an observation, and one the
     previous archetype used correctly. There is no public 4h GB series, so
     1.30× is inferred from the duration capture split (65% vs 29% of available
     EET) and from Germany, where Modo has 4h at 13.7% unlevered IRR against
     12.2% for 2h at 2026 COD. Gate G2 closes it. */
  merchGross: 95000,
  feePct: 10,

  /* Left flat, and that is the point: GB already had its system-services
     collapse. Dynamic Containment launched Q4 2020, dominated by 2021,
     saturated through 2022, and by January 2024 Balancing Mechanism revenue
     had overtaken frequency response entirely. £4,000/MW/yr is the level after
     that happened — which is why Ireland's servicesCurve is calibrated here. */
  services: 4000,
  grantPct: 0,
  degr: 2,

  /* Drax/Fidra, 2026: a fixed annual fee for TEN years from COD, full dispatch
     control to the offtaker — and the owner retains Capacity Market revenue.
     Both of those were previously modelled wrongly: 15 years "assumed
     rollable", and the toll replacing the capacity line instead of sitting
     alongside it. */
  toll: 75000,
  tollYears: 10,
  tollAdditiveWithCapacity: true,
  tollRevertsToMerchant: true,

  capNote: ['CM availability obligation; stress-event penalties', '容量市场可用性义务；紧张事件罚则'],
  tollNote: [
    '10-yr precedent tenor (Drax/Fidra); owner retains CM revenue; merchant tail from yr 11',
    '先例期限10年（Drax/Fidra）；业主保留容量市场收入；第11年起转为市场化敞口',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   GB is the market where the capacity band is widest and the reason is not
   uncertainty about our arithmetic — it is that the T-4 clearing price has ranged
   from £6.44 to £65/kW across completed auctions. A ten-fold band on the biggest
   contracted line is the honest statement of what a capacity-backed GB case is
   exposed to.
   --------------------------------------------------------------------------- */
const EUR_PER_GBP = 1.27 / 1.08;              // via the platform's USD cross-rates

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
  /* £225/kWh is ≈€265/kWh, marginally ABOVE the €180-260/kWh European turnkey
     band — GB grid connection and construction are the usual explanation. Worth
     seeing rather than smoothing: the floor is an observation, the ceiling is
     dispersion, and the seed sits outside what the European market reports. */
  capexPerMW: band(economics.capexPerMW, Math.round(180 / EUR_PER_GBP) * 4000, null, {
    basis: [
      'European turnkey 4h LFP is €180–260/kWh installed; at the platform\'s cross-rates that is ≈£153–221/kWh. The seed of £225/kWh sits just above the European ceiling, so only the floor is an observation.',
      '欧洲4小时磷酸铁锂交钥匙安装成本为€180–260/kWh，按本平台交叉汇率约合£153–221/kWh。种子值£225/kWh略高于欧洲区间上限，故仅下限为实测观察值。',
    ],
    source: '2026 European BESS turnkey EPC surveys (€180–260/kWh, 4h LFP)',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No published GB-specific fixed-opex series. £13,000/MW/yr is ≈US$16,500, inside the US utility-scale benchmark of US$15–25k/MW/yr, which is context rather than a bound.',
      '无英国专属固定运维公开序列。£13,000/MW/年约合US$16,500，处于美国公用事业级基准US$15–25k/MW/年区间内 — 后者仅为参照，非边界。',
    ],
    source: 'Platform seed, scaled from £9,000/MW/yr at 2h',
    gate: 'G13',
  }),

  /* Price moves, de-rating held. The 0.38 factor is itself an interpolation
     (gate G1) and moving both at once would make the band uninterpretable. */
  contracted: band(economics.contracted,
    Math.round(6.44 * capacity.derating * 1000),
    Math.round(65 * capacity.derating * 1000), {
      basis: [
        'Completed T-4 auctions have cleared between £6.44 and £65/kW/yr; £27.10 (T-4 2029/30) follows three consecutive clears at £60–65. Both ends are applied at the seeded 4h de-rating factor of 38%, which is itself interpolated.',
        '已完成的T-4拍卖出清价介于£6.44至£65/kW/年之间；£27.10（T-4 2029/30）之前为连续三次£60–65的出清。两端均按种子设定的4小时可信容量系数38%换算，而该系数本身为插值。',
      ],
      source: 'NESO EMR Delivery Body, completed T-4 auction results; de-rating interpolated — gate G1',
      gate: 'G1',
    }),

  contractYears: limits(economics.contractYears, 1, 15, {
    basis: [
      'The Capacity Market offers 1, 3, 9 and 15-year agreements; 15 years is available to new build and is what a market-entry benchmark takes.',
      '容量市场提供1年、3年、9年及15年期协议；新建项目可获15年期，市场进入基准即采用该期限。',
    ],
    source: 'NESO Capacity Market agreement lengths, T-4 2029/30',
  }),

  postFactor: limits(economics.postFactor, 0, 1, {
    kind: 'dispersed',
    basis: [
      'What a 15-year agreement is assumed to be replaced by on expiry. 0.5 assumes half the level re-clears; the CM will still exist, but nothing about the price is contracted.',
      '15年期协议到期后假设可被替代的水平。取0.5表示假设仅一半价格再次出清；容量市场届时仍将存在，但价格并无任何合同保障。',
    ],
    source: 'Methodology — no forward T-4 price forecast is carried',
  }),

  toll: band(economics.toll, 70000, 80000, {
    basis: [
      'GB tolls are quoted at £70–80k/MW/yr. Both ends observed, so the band is the quotation rather than a dispersion around its midpoint.',
      '英国租赁费报价为£70–80k/MW/年。两端均为实测值，故该区间直接采用报价范围，而非其中值的离散区间。',
    ],
    source: 'Reported GB tolling terms, 2026 (Drax/Fidra precedent and market quotation)',
  }),

  tollYears: limits(economics.tollYears, 5, 15, {
    basis: [
      'The Drax/Fidra precedent is a ten-year fixed annual fee from COD. Five years is the shortest tenor at which a toll still supports term debt; fifteen is the full comparison window.',
      'Drax/Fidra先例为自投运起十年期固定年费。五年是租赁结构仍可支撑定期贷款的最短期限；十五年为完整比较窗口。',
    ],
    source: 'Drax/Fidra 2026 tolling precedent; grid-forming agreements run 2–10 years',
  }),

  merchGross: band(economics.merchGross, 73145, null, {
    basis: [
      '£73,145/MW/yr is Modo\'s ME BESS GB benchmark for a TWO-HOUR battery over the twelve months to April 2026 — an observation, and the floor here because it is the 4h number without any duration uplift. The seeded 1.30× uplift is inferred, not measured.',
      '£73,145/MW/年为Modo ME BESS英国基准，对应截至2026年4月的十二个月、两小时电池 — 属实测观察值，在此作为下限，即不含任何时长提升的4小时数值。种子设定的1.30倍提升系推断值，非实测。',
    ],
    source: 'Modo ME BESS GB 2h benchmark, TTM April 2026; 4h series not public — gate G2',
    gate: 'G2',
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
      'GB has already had its system-services collapse: Dynamic Containment launched Q4 2020, saturated through 2022, and by January 2024 Balancing Mechanism revenue had overtaken frequency response entirely. £4,000/MW/yr is the level AFTER that, so the band is narrow by design.',
      '英国系统服务收入的崩塌已经发生：Dynamic Containment于2020年第四季度推出，至2022年趋于饱和，到2024年1月平衡机制收入已完全超过调频收入。£4,000/MW/年是崩塌之后的水平，故该区间刻意设定得较窄。',
    ],
    source: 'Post-saturation GB frequency-response level; the calibration Ireland\'s curve decays to',
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
    powerMW: 100,
    durationHours: 4,
  },

  score: {
    connectionRisk: 43,
  },

  capabilities: {
    capacityMarket: true,      // Capacity Market
    merchant: true,
    ancillaryServices: true,
    tolling: true,             // tolling precedent exists in GB
  },

  economics,
  ranges,

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Capacity Market revenue is additive to merchant, so both merchant legs are exposed from commercial operation and are stated on the same observed basis.',
    '第1年。容量市场收入与市场化收入并存，因此两个市场化收入项自商业运行起即处于敞口状态，并按同一观测口径列示。',
  ]),

  narrative: {
    archetype: ['100 MW · 4h · T-4 + trading', '100MW · 4小时 · T-4容量 + 交易'],
    thesis: [
      'Trading-led and connection-rationed, now underwritten at four hours. Two-hour assets still win connections; four- and five-hour assets win de-rated capacity, and de-rated capacity is what the auction pays for.',
      '交易主导、并网配给，现以4小时为承销基准。2小时资产仍能获得并网容量，但4–5小时资产赢得更多可信容量 — 而拍卖支付的正是可信容量。',
    ],
    pipelineRatio: '~2.5×',
  },
};

export default comparison;
