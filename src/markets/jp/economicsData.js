const OCCTO_2029 =
  'https://www.occto.or.jp/assets/various/capacity-market/jitsujukyukanren/2029_jitsujukyu_kanren/260123_mainauction_youryouyakujokekka_kouhyou_jitsujukyu2029.pdf';

const areaPool = {
  hokkaido: 78.30094507,
  tokyo: 759.039397128,
  kyushu: 265.081345627,
};

export const JP_ECONOMICS = {
  marketId: 'jp',
  asOf: '2026-07-29',
  architecture: {
    rulebook: 'One national rulebook',
    overlays: ['tokyo', 'kyushu', 'hokkaido'],
    onlineOfflineLogic:
      'Retain the verified product-specific online/offline eligibility logic; do not apply a generic online premium.',
  },
  dna: {
    label: 'National market optionality, regional area-price capture and site deliverability',
    driverChain: [
      'Regional demand + renewables + nuclear/thermal + interconnection',
      'Area scarcity + curtailment + basis + balancing need',
      'JEPX + EPRX + Capacity Market + LTDA',
      'Qualified BESS + connection queue + duration',
      'Area capture + awarded capacity + incremental balancing value',
      'BESS EBITDA, delivery risk and equity return',
    ],
    ownerRule:
      'Capacity price is national-market evidence; owner payment still requires awarded Expected Capacity. LTDA revenue sharing prevents stacking the full headline payment with full merchant revenue.',
  },
  nationalMetrics: [
    {
      id: 'jp-cm-2029-total',
      label: '2029 Capacity Market total contracted capacity',
      value: 166.079863,
      display: '166.080',
      unit: 'GW',
      status: 'VERIFIED',
      authority: 'observed',
      formula: '166,079,863 kW ÷ 1,000,000',
      limitation: 'All technologies nationally; not BESS competition or nameplate capacity.',
      source: { owner: 'OCCTO', url: OCCTO_2029, vintage: 'FY2025 auction for FY2029 delivery' },
    },
    {
      id: 'jp-cm-area-price-range',
      label: 'Price range across Hokkaido, Tokyo and Kyushu',
      value: 140,
      display: '140',
      unit: 'JPY/kW/year',
      status: 'DERIVED',
      authority: 'derived-observed',
      formula: '15,112 Kyushu − 14,972 Hokkaido',
      limitation: 'Only 0.93% of the maximum area price; capacity price alone does not explain regional BESS returns.',
      source: { owner: 'OCCTO', url: OCCTO_2029, vintage: 'FY2029 delivery' },
    },
  ],
  regions: {
    tokyo: {
      id: 'tokyo',
      label: 'Tokyo',
      dna: 'Deep load + scarcity/flexibility; value depends on area capture and connection quality.',
      capacityPriceJPYkWYr: 15111,
      contractedCapacityGW: 52.376601,
      capacityPoolJPYbn: areaPool.tokyo,
      curtailmentDays: 20,
      studyCap: 11,
      competitionSignal: 'No complete public BESS queue; study cap and disclosed projects are partial proxies.',
      metrics: {
        capacity: 'VERIFIED',
        curtailment: 'PROXY',
        studyCap: 'PROXY',
      },
      scenario: {
        Bear: {
          bessOwner: 'Low area basis and fast competitor entry compress merchant and balancing capture.',
          system: 'Deep load is served with fewer scarcity intervals.',
          drivers: 'Lower LNG SRMC · strong inter-area imports · faster connection delivery',
        },
        Base: {
          bessOwner: 'Moderate capture in the deepest load pool, conditional on import/export evidence.',
          system: 'Load growth is met with planned supply and flexibility.',
          drivers: 'Central fuel case · normal basis · partial project delivery',
        },
        Bull: {
          bessOwner: 'A connected asset captures import tightness and scarcity before competing BESS arrives.',
          system: 'Higher area prices and scarcity are adverse for consumers.',
          drivers: 'High LNG SRMC · constrained imports · slow competitor delivery',
        },
      },
      conclusion: 'Prefer proven bidirectional connection and demonstrated Tokyo area-price capture; do not pay for the postcode.',
    },
    kyushu: {
      id: 'kyushu',
      label: 'Kyushu',
      dna: 'Solar surplus + curtailment + export constraint; charging access is the scarce right.',
      capacityPriceJPYkWYr: 15112,
      contractedCapacityGW: 18.363521,
      capacityPoolJPYbn: areaPool.kyushu,
      curtailmentDays: 50,
      studyCap: 8,
      competitionSignal: 'Named projects are a subset; curtailment and study capacity are better public pressure signals.',
      metrics: {
        capacity: 'VERIFIED',
        curtailment: 'PROXY',
        studyCap: 'PROXY',
      },
      scenario: {
        Bear: {
          bessOwner: 'Grid reinforcement and rapid BESS entry absorb the solar trough and compress cycling value.',
          system: 'Curtailment falls and export capability improves.',
          drivers: 'Faster Kanmon/export delivery · high BESS conversion · lower fuel scarcity',
        },
        Base: {
          bessOwner: 'Solar surplus supports charging, offset by gradual competition and constraint relief.',
          system: 'Curtailment remains material but improves incrementally.',
          drivers: 'Continued solar growth · partial grid relief · moderate BESS entry',
        },
        Bull: {
          bessOwner: 'A connected asset captures persistent near-zero charging and export-constrained price separation.',
          system: 'High curtailment and congestion remain adverse system outcomes.',
          drivers: 'Delayed export relief · slow competitor delivery · high evening LNG SRMC',
        },
      },
      conclusion: 'Underwrite verified solar-surplus charging access and curtailment exposure; reinforcement is the downside overlay.',
    },
    hokkaido: {
      id: 'hokkaido',
      label: 'Hokkaido',
      dna: 'Renewable export + weak grid + interconnector constraint; high value signal with high execution risk.',
      capacityPriceJPYkWYr: 14972,
      contractedCapacityGW: 5.461594,
      capacityPoolJPYbn: areaPool.hokkaido,
      curtailmentDays: 36,
      studyCap: 5,
      competitionSignal: '≈2 GW connection applications and >0.2 GW FY2026 balancing registration are pressure proxies, not a complete queue.',
      metrics: {
        capacity: 'VERIFIED',
        curtailment: 'PROXY',
        studyCap: 'PROXY',
      },
      scenario: {
        Bear: {
          bessOwner: 'Interconnector reinforcement and heavy BESS entry reduce basis while the small balancing pool saturates.',
          system: 'Export capability and flexibility improve.',
          drivers: '1.2 GW interconnector delivered · 2 GW queue converts · balancing saturation',
        },
        Base: {
          bessOwner: 'Persistent export constraints support value, offset by connection and saturation risk.',
          system: 'Renewable integration improves but remains constrained.',
          drivers: 'Planned interconnector · partial queue conversion · normal hydro/fuel case',
        },
        Bull: {
          bessOwner: 'A connected, qualified asset captures strong area separation before grid and competitor delivery.',
          system: 'Congestion and curtailment remain high, an adverse system outcome.',
          drivers: 'Delayed reinforcement · slow queue conversion · high LNG SRMC',
        },
      },
      conclusion: 'Treat as an execution-led opportunity: connection and accepted balancing volume matter more than headline price.',
    },
  },
  coverage: {
    capacity:
      'OCCTO covers market-wide area price, capacity and pool value. BESS-specific awarded Expected Capacity is not separated in this first pass.',
    competition:
      'Curtailment days, study caps, named projects and Hokkaido queue/registration signals are partial proxies; no complete public national BESS queue is verified.',
  },
  conclusion: {
    rating: 'Regional selection required',
    text:
      'The national rulebook creates options, not a generic Japan premium. Tokyo is capture-led, Kyushu charging-access-led and Hokkaido execution-led.',
  },
  toBuild: [
    {
      id: 'jp-area-interval-spread',
      status: 'TO_BUILD',
      required: 'Governed JEPX 30-minute area-price ingestion',
      output: '1h/2h/4h gross spread by area',
      gate: 'Existing regional spread seeds remain illustrative.',
    },
    {
      id: 'jp-area-capture',
      status: 'TO_BUILD',
      required: 'Dispatch-aware capture with RTE, SOC reservation, fees and EPRX opportunity cost',
      output: 'Owner margin by region and duration',
      gate: 'No generic online premium and no merchant EBITDA before reproducible backtest.',
    },
    {
      id: 'jp-area-basis',
      status: 'TO_BUILD',
      required: 'System-price and area-price interval join',
      output: 'Tokyo/Kyushu/Hokkaido basis distributions and split hours',
      gate: 'Do not promote current basis seeds.',
    },
    {
      id: 'jp-hydrology',
      status: 'TO_BUILD',
      required: 'Governed reservoir, hydro and pumped-storage operating data',
      output: 'Hydrology sensitivity by region',
      gate: 'Use qualitatively until source definitions are reconciled.',
    },
    {
      id: 'jp-lng-srmc',
      status: 'TO_BUILD',
      required: 'Official LNG import/fuel-cost, efficiency and carbon inputs',
      output: 'LNG marginal-cost bridge',
      gate: 'Do not map LNG prices one-for-one to area spread.',
    },
  ],
};

export default JP_ECONOMICS;

