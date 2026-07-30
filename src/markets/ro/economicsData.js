const OPCOM_2025 = 'https://www.opcom.ro/anunturi-stiri-comunicate-tip/ro/1447/1';
const ANRE_FUNNEL =
  'https://anre.ro/wp-content/uploads/2026/04/Informare-proiecte-RES_1-martie-2026-1.pdf';

export const RO_ECONOMICS = {
  marketId: 'ro',
  asOf: '2026-07-29',
  dna: {
    label: 'Merchant energy + balancing optionality, with no capacity-payment floor',
    driverChain: [
      'Solar growth + hydrology + gas/LNG marginal cost + cross-border flows',
      'Midday trough + evening scarcity + balancing need',
      'Day-ahead/intraday + reserve products',
      'ATR/connection conversion + effective competing BESS',
      'Captured spread + qualified balancing value',
      'BESS EBITDA, lender downside and equity return',
    ],
    ownerRule:
      'State aid reduces capital at risk; it is not operating revenue and a programme budget is not a project award.',
  },
  metrics: [
    {
      id: 'ro-dam-wap-2025',
      label: 'DAM weighted-average price, 2025',
      value: 575.22,
      display: '575.22',
      unit: 'RON/MWh',
      status: 'VERIFIED',
      authority: 'observed',
      formula: 'OPCOM annual weighted average',
      limitation: 'A price level, not a storage spread or achievable project margin.',
      source: { owner: 'OPCOM', url: OPCOM_2025, vintage: '2025 annual result' },
    },
    {
      id: 'ro-dam-volume-2025',
      label: 'DAM traded volume, 2025',
      value: 15.691726,
      display: '15.692',
      unit: 'TWh',
      status: 'VERIFIED',
      authority: 'observed',
      formula: '15,691,726 MWh ÷ 1,000,000',
      limitation: 'Market throughput, not BESS-addressable energy.',
      source: { owner: 'OPCOM', url: OPCOM_2025, vintage: '2025 annual result' },
    },
    {
      id: 'ro-dam-share-2025',
      label: 'DAM share of domestic consumption, 2025',
      value: 31.65,
      display: '31.65',
      unit: '%',
      status: 'VERIFIED',
      authority: 'observed',
      formula: 'OPCOM reported market share',
      limitation: 'Liquidity context only; it does not measure storage capture.',
      source: { owner: 'OPCOM', url: OPCOM_2025, vintage: '2025 annual result' },
    },
    {
      id: 'ro-dam-turnover-2025',
      label: 'DAM traded value, 2025',
      value: 9.0262096,
      display: '9.026',
      unit: 'RON bn',
      status: 'VERIFIED',
      authority: 'observed',
      formula: 'OPCOM reported RON 9,026,209,600 traded value ÷ 1bn',
      limitation: 'Gross exchange turnover, not the revenue pool available to BESS.',
      source: { owner: 'OPCOM', url: OPCOM_2025, vintage: '2025 annual result' },
    },
    {
      id: 'ro-res-valid-atr',
      label: 'Renewable capacity with valid ATR',
      value: 81.322,
      display: '81.322',
      unit: 'GW',
      status: 'PROXY',
      authority: 'observed',
      formula: 'ANRE reported stage total',
      limitation: 'All renewables and a paper-stage ceiling; not a BESS queue or expected COD.',
      source: { owner: 'ANRE', url: ANRE_FUNNEL, vintage: '1 Mar 2026' },
    },
    {
      id: 'ro-res-connection-contract-conversion',
      label: 'Connection-contract MW as share of valid ATR MW',
      value: 56.7,
      display: '56.7',
      unit: '%',
      status: 'DERIVED',
      authority: 'derived-observed',
      formula: '46.1 GW connection contracts ÷ 81.322 GW valid ATR × 100',
      limitation: 'Administrative conversion proxy across all renewables; stages are nested and not delivery probabilities.',
      source: { owner: 'ANRE', url: ANRE_FUNNEL, vintage: '1 Mar 2026' },
    },
    {
      id: 'ro-res-authorised-share-of-permitted',
      label: 'Establishment-authorised MW as share of permit-stage MW',
      value: 32.4,
      display: '32.4',
      unit: '%',
      status: 'DERIVED',
      authority: 'derived-observed',
      formula: '8.944 GW establishment authorisation ÷ 27.6 GW contract + construction permit × 100',
      limitation: 'All renewables, not BESS; does not evidence financing, construction or operation.',
      source: { owner: 'ANRE', url: ANRE_FUNNEL, vintage: '1 Mar 2026' },
    },
  ],
  coverage: {
    capacity:
      'Romania is energy-only: capacity-market revenue is N/A. State support belongs in net capex only after a project-level award.',
    competition:
      'ANRE provides an official all-renewables administrative funnel. It is useful for conversion pressure but is not a complete BESS queue.',
  },
  scenarios: [
    {
      case: 'Bear',
      bessOwner:
        'Wet hydrology, lower gas/LNG marginal cost, network delivery and fast BESS entry compress captured spread and balancing prices.',
      system:
        'Lower prices and fewer scarcity intervals are favourable for consumers and adequacy.',
      drivers: 'Wet hydro · lower LNG/gas SRMC · stronger imports · fast grid/BESS delivery',
    },
    {
      case: 'Base',
      bessOwner:
        'Solar deepens the midday trough, but normal hydrology and moderate storage conversion cap the owner margin.',
      system:
        'The system gains flexibility while connection and permitting remain the main delivery constraints.',
      drivers: 'Normal hydrology · central fuel case · selective connection conversion',
    },
    {
      case: 'Bull',
      bessOwner:
        'A connected project captures dry-hydro and high-fuel scarcity while competing projects remain stuck in the paper funnel.',
      system:
        'Higher prices and tighter balancing are adverse system outcomes despite stronger BESS-owner returns.',
      drivers: 'Dry hydro · high LNG/gas SRMC · delayed reinforcement · slow competitor conversion',
    },
  ],
  conclusion: {
    rating: 'Selective',
    text:
      'Romania is an attractive merchant setup only for projects with evidenced ATR and connection delivery, reserve qualification and a downside structure that survives without an unawarded grant.',
  },
  toBuild: [
    {
      id: 'ro-interval-spread',
      status: 'TO_BUILD',
      required: 'Governed OPCOM day-ahead and intraday interval ingestion',
      output: '1h/2h/4h gross spread and negative-price distributions',
      gate: 'Do not use the illustrative intra-year curve as observed evidence.',
    },
    {
      id: 'ro-capture',
      status: 'TO_BUILD',
      required: 'Dispatch-aware capture backtest with RTE, availability, liquidity and fees',
      output: 'Executable BESS margin by duration',
      gate: 'No merchant EBITDA until reproducible.',
    },
    {
      id: 'ro-hydrology',
      status: 'TO_BUILD',
      required: 'Governed reservoir, inflow and hydro-generation series',
      output: 'Dry/normal/wet hydro driver',
      gate: 'Hydro remains a scenario driver, not a quantified forecast.',
    },
    {
      id: 'ro-lng-srmc',
      status: 'TO_BUILD',
      required: 'Governed gas/LNG, carbon and thermal efficiency inputs',
      output: 'Marginal thermal-cost bridge',
      gate: 'Do not translate fuel prices directly into a storage spread.',
    },
  ],
};

export default RO_ECONOMICS;

