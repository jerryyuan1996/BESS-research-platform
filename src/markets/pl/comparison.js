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
   --------------------------------------------------------------------------- */
import { capacityRevenuePerMW } from '../../comparison/capacityLine.js';
import { band, limits } from '../../comparison/ranges.js';

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

const economics = {
  capexPerMW: 970000,
  opexPerMW: 9000,

  capacity,
  contracted: capacityRevenuePerMW(capacity),   // ≈ €14,481
  contractYears: 17,
  postFactor: 0.5,

  /* Deliberately unchanged. Clean Horizon's Storage Index put a Polish 2h at
     €800k+/MW/yr in May 2026 on the back of aFRR capacity above €120/MW/h — a
     monthly run-rate, annualised at 1.5 cycles/day, gross of fees, in a market
     with very little operational capacity. That is a signal, not an
     underwriting number, and docs/external-view.md §5.4 records why we do not
     carry it. */
  merchGross: 78000,
  feePct: 9,
  services: 10000,
  grantPct: 10,
  degr: 2,

  grantNote: ['Includes a 10% capital-support assumption', '含10%资本支持假设'],
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

  /* Read the basis before moving this one. */
  merchGross: band(economics.merchGross, null, 800000, {
    basis: [
      'The ceiling is Clean Horizon\'s May 2026 Storage Index run-rate for a Polish 2h — €800k+/MW/yr on the back of aFRR capacity above €120/MW/h. It is a SIGNAL, NOT AN UNDERWRITING NUMBER: a monthly spot run-rate, annualised at 1.5 cycles/day, gross of fees, in a market with very little operational capacity. Poland has ~5.1 GW of battery contracted for 2030 delivery; that level does not survive it. docs/external-view.md §5.4 records why the platform does not carry it.',
      '上限为Clean Horizon 2026年5月储能指数中波兰2小时资产的收入运行率 — 在aFRR容量价格超过€120/MW/h的背景下达到€80万+/MW/年。这是一个信号，而非承销数值：其为月度现货运行率，按每日1.5次循环年化，未扣除费用，且所处市场几乎没有已投运容量。波兰已有约5.1GW电池签约2030年交付；该水平无法在此情形下维持。docs/external-view.md §5.4 记录了本平台不采用该数值的原因。',
    ],
    source: 'Clean Horizon Storage Index, May 2026 (spot run-rate, 2h, gross of fees)',
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
      'Polish aFRR capacity has cleared above €120/MW/h, which is the driver behind the merchant ceiling above rather than a per-MW services benchmark. No separate published system-services series exists for a Polish BESS.',
      '波兰aFRR容量出清价已超过€120/MW/h，该数据支撑的是上方市场化收入上限，而非每MW系统服务基准。目前无针对波兰储能的独立系统服务公开序列。',
    ],
    source: 'Platform seed; Polish aFRR capacity >€120/MW/h as context',
  }),

  grantPct: limits(economics.grantPct, 0, 10, {
    basis: [
      'Zero is a project with no capital support, which is the default. The seeded 10% is an assumption rather than a named scheme award, so the band does not extend above it.',
      '取零对应无任何资本支持的项目，即默认情形。种子设定的10%属假设值而非具名计划的实际授予，故区间不向上延伸。',
    ],
    source: 'Platform assumption — not tied to a named Polish support scheme',
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
    composite: 60,
    connectionRisk: 51,
  },

  capabilities: {
    capacityMarket: true,      // capacity contract via auction
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics,
  ranges,

  narrative: {
    archetype: ['100 MW · 4h · capacity contract', '100MW · 4小时 · 容量合同'],
    thesis: [
      'A seventeen-year contract on thirteen percent of nameplate. The tenor is real and still the longest in the set; the volume is what the regulator controls, and it was cut by four fifths in a single auction.',
      '十七年期合同，但仅覆盖铭牌容量的13%。期限确为样本中最长；而容量由监管机构掌控，并在一次拍卖中被削减五分之四。',
    ],
    pipelineRatio: '~13×',
  },
};

export default comparison;
