const URE_2030 =
  'https://www.ure.gov.pl/en/communication/news/504%2CThe-President-of-URE-announces-the-final-results-of-the-main-capacity-market-auc.html';
const URE_REFUSALS =
  'https://ure.gov.pl/en/communication/news/436%2CSummary-of-URE-activities-in-2024-deregulation-demands-and-new-competences-of-th.html';
const PSE_PLAN =
  'https://www.pse.pl/documents/31287/22159050/Development_plan_2025_2034_main_document_20_12_2024.pdf/6397676d-d217-4bcb-b04c-f3fafc2dde12?safeargs=76657273696f6e3d312e31';

export const PL_ECONOMICS = {
  marketId: 'pl',
  asOf: '2026-07-29',
  dna: {
    label: 'Contracted adequacy + merchant volatility, gated by connection and auction vintage',
    driverChain: [
      'Coal retirement + renewable growth + demand',
      'Adequacy need + intraday volatility',
      'Capacity auction + energy/balancing markets',
      'Connection access + effective competing BESS',
      'Capacity obligation + captured spread',
      'BESS EBITDA, debt capacity and equity return',
    ],
    ownerRule:
      'Capacity-market revenue is price × awarded de-rated obligation. It is never price × BESS nameplate MW.',
  },
  metrics: [
    {
      id: 'pl-cm-2030-price',
      label: '2030 main-auction price, Polish physical units',
      value: 465.02,
      display: '465.02',
      unit: 'PLN/kW/year',
      status: 'VERIFIED',
      authority: 'observed',
      formula: 'Reported final auction closing price',
      limitation: 'Applies to the awarded capacity obligation, not battery nameplate MW.',
      source: { owner: 'URE', url: URE_2030, vintage: 'Final result published 17 Feb 2026' },
    },
    {
      id: 'pl-cm-2030-total-obligation',
      label: 'Total 2030 capacity obligations, all auctions to date',
      value: 21.8,
      display: '21.8',
      unit: 'GW',
      status: 'VERIFIED',
      authority: 'observed',
      formula: 'Reported URE aggregate',
      limitation: 'All technologies and auction vintages; not BESS-only competition.',
      source: { owner: 'URE', url: URE_2030, vintage: '2030 delivery year' },
    },
    {
      id: 'pl-res-refused-capacity-2024',
      label: 'RES connection applications refused in 2024',
      value: 42.4,
      display: '<42.4',
      unit: 'GW',
      status: 'PROXY',
      authority: 'observed',
      formula: 'URE aggregate across 6,259 refused RES applications',
      limitation: 'Applications can be duplicated; this is not unique project capacity or a BESS queue.',
      source: { owner: 'URE', url: URE_REFUSALS, vintage: 'Activity Report 2024' },
    },
    {
      id: 'pl-res-share-of-refused-capacity',
      label: 'RES share of all refused application MW',
      value: 57.6,
      display: '57.6',
      unit: '%',
      status: 'DERIVED',
      authority: 'derived-observed',
      formula: '42.4 GW RES ÷ 73.6 GW all refused applications × 100',
      limitation: 'A pressure indicator only; both numerator and denominator can contain repeat applications.',
      source: { owner: 'URE', url: URE_REFUSALS, vintage: 'Activity Report 2024' },
    },
    {
      id: 'pl-storage-connection-agreements',
      label: 'Storage capacity with connection agreements',
      value: 1.9014,
      display: '1.901',
      unit: 'GW',
      status: 'PROXY',
      authority: 'observed',
      formula: '1,901.4 MW ÷ 1,000',
      limitation: 'Connection capacity at 31 Dec 2023; not operating, de-rated or contracted capacity.',
      source: { owner: 'PSE', url: PSE_PLAN, vintage: 'Snapshot at 31 Dec 2023' },
    },
    {
      id: 'pl-storage-connection-conditions',
      label: 'Storage capacity with connection conditions',
      value: 9.7867,
      display: '9.787',
      unit: 'GW',
      status: 'PROXY',
      authority: 'observed',
      formula: '9,786.7 MW ÷ 1,000',
      limitation: 'Earlier-stage connection evidence; not an operating fleet or a complete project queue.',
      source: { owner: 'PSE', url: PSE_PLAN, vintage: 'Snapshot at 31 Dec 2023' },
    },
  ],
  coverage: {
    capacity:
      'Official market-wide price and obligation totals are covered. Technology-level BESS nameplate, de-rated obligation and contract duration must still be reconstructed by auction vintage.',
    competition:
      'PSE connection agreements/conditions and URE refusals are pressure proxies. A complete public BESS queue through construction and operation is not verified.',
  },
  scenarios: [
    {
      case: 'Bear',
      bessOwner:
        'Project misses or clears with a weaker correction factor; faster competitor delivery compresses spread and auction value.',
      system:
        'Adequacy and connection availability improve as new flexibility and grid capacity arrive.',
      drivers: 'Lower thermal scarcity · faster network delivery · high BESS entry · tougher de-rating',
    },
    {
      case: 'Base',
      bessOwner:
        'Connected project clears on evidenced auction terms; contracted obligation supports debt while merchant value dilutes gradually.',
      system:
        'Coal exits are broadly matched by renewables, flexibility and planned network delivery.',
      drivers: 'Published auction vintage · moderate entry · planned coal exit · post-2024 market data',
    },
    {
      case: 'Bull',
      bessOwner:
        'A project already holding connection and certification captures scarcity while competing projects remain delayed.',
      system:
        'Tighter adequacy and persistent connection bottlenecks are adverse for the system even though they lift owner value.',
      drivers: 'Slow competitor conversion · stronger auction scarcity · wider realised spreads',
    },
  ],
  conclusion: {
    rating: 'Positive with conditions',
    text:
      'Poland can support financeable BESS, but only after connection, certification, auction price, applicable correction factor and awarded obligation are evidenced for the same vintage.',
  },
  toBuild: [
    {
      id: 'pl-interval-spread',
      status: 'TO_BUILD',
      required: 'Governed TGE/JEPX-style interval day-ahead and intraday price ingestion',
      output: 'Daily 1h/2h/4h gross spread distributions',
      gate: 'Do not promote the existing illustrative spread series.',
    },
    {
      id: 'pl-capture',
      status: 'TO_BUILD',
      required: 'Dispatch-aware price capture with RTE, availability, gate closure and optimiser fees',
      output: 'Realised owner margin by duration',
      gate: 'No merchant EBITDA until the backtest is reproducible.',
    },
    {
      id: 'pl-lng-srmc',
      status: 'TO_BUILD',
      required: 'Governed coal, gas/LNG and carbon input series',
      output: 'Thermal marginal-cost bridge',
      gate: 'Use as an explanatory sensitivity only, never an observed spread.',
    },
  ],
};

export default PL_ECONOMICS;

