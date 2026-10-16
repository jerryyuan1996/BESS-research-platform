import { AUTHORITY } from '../../governance/authority.js';

const TRANSELECTRICA_PLAN_URL =
  'https://www.transelectrica.ro/documents/10179/20107575/01_Nota%2BPD%2BRET%2B2026-2035%2Binclusiv%2Banexe_EN.pdf/2ff26066-2f3a-4401-91d6-863abec723ed?version=1.0';
const ANRE_FUNNEL_URL =
  'https://anre.ro/wp-content/uploads/2026/04/Informare-proiecte-RES_1-martie-2026-1.pdf';

export const RO_SYSTEM_EVOLUTION = {
  marketId: 'ro',
  authority: AUTHORITY.OFFICIAL_FORECAST,
  pathway: 'Electricity Transmission Grid Development Plan 2026–2035',
  vintage: 'Transelectrica plan approved 30 July 2025',
  years: [2026, 2030, 2035],
  coverage: {
    status: 'partial',
    statement:
      'The public English plan synthesis identifies the official network pathway and dated projects, but does not publish a comparable national demand-and-storage series for all three display years.',
    rule:
      'Unsupported national quantities remain N/A. No value is interpolated between plan years.',
  },
  points: [
    {
      year: 2026,
      label: 'Today · plan opening',
      demandTWh: null,
      peakDemandGW: null,
      storageGW: null,
      evidence:
        'Current official RET planning window. The synthesis establishes the 2026–2035 network programme, not a complete quantitative system snapshot.',
    },
    {
      year: 2030,
      label: '2030 · reinforcement delivery',
      demandTWh: null,
      peakDemandGW: null,
      storageGW: null,
      evidence:
        'Named 2030 works include Brașov–Sibiu South, Cetate–Calafat, Alba Iulia–Cluj Florești, Bucharest South–Mostiștea and Lotru–Sibiu South reinforcements.',
    },
    {
      year: 2035,
      label: '2035 · official plan horizon',
      demandTWh: null,
      peakDemandGW: null,
      storageGW: null,
      evidence:
        'End of the adopted transmission-development horizon. The public synthesis does not evidence a comparable national demand or storage-capacity point.',
    },
  ],
  provenance: {
    owner: 'CNTEE Transelectrica SA',
    authority: AUTHORITY.OFFICIAL_FORECAST,
    sourceId: 'ro-transelectrica-ret-plan-2026-2035',
    url: TRANSELECTRICA_PLAN_URL,
    transformation: 'Manual structured extraction; official dates and project names preserved.',
    lastChecked: '2026-07-29',
    sourceCadence: 'At least every two years under the published planning process',
    machineReadable: 'Limited — public PDF synthesis',
    automation: 'C — fetchable PDF; table and narrative extraction require review',
    freshness: 'Current published 2026–2035 plan vintage',
  },
};

export const RO_QUEUE_COVERAGE = {
  marketId: 'ro',
  authority: AUTHORITY.OBSERVED,
  completeOfficialBessQueue: false,
  coverageStatement:
    'No single public official register was verified that follows every Romanian BESS project through connection, permit, financing, construction and operation.',
  knownOfficialFunnel: {
    asOf: '2026-03-01',
    scope: 'All renewable-energy projects, not a BESS-only queue',
    validAtrGW: 81.322,
    connectionContractGW: 46.1,
    contractAndConstructionPermitGW: 27.6,
    plusAnreEstablishmentAuthorisationGW: 8.944,
    basis:
      'Project capacity at successive administrative stages. These nested national totals are not operating capacity and must not be summed.',
  },
  provenance: {
    owner: 'Romanian Energy Regulatory Authority (ANRE)',
    authority: AUTHORITY.OBSERVED,
    sourceId: 'ro-anre-res-project-funnel-2026-03-01',
    url: ANRE_FUNNEL_URL,
    lastChecked: '2026-07-29',
    machineReadable: 'Limited — public PDF',
    automation: 'C — scheduled fetch possible; classification and stage validation require review',
    freshness: 'Official snapshot dated 1 March 2026',
  },
};

export const RO_OPPORTUNITY_LOGIC = {
  marketId: 'ro',
  authority: AUTHORITY.METHODOLOGY,
  attractiveness: {
    rating: 'Conditional',
    statement:
      'Strong merchant volatility and capital support can be attractive, but only for projects with evidenced connection progress and a financeable downside revenue structure.',
  },
  logic: [
    'Solar build-out deepens the midday trough and evening ramp.',
    'Storage can monetise wholesale and balancing volatility.',
    'There is no capacity mechanism, so the revenue line remains predominantly merchant.',
    'Connection, permitting and award evidence decide which projects convert.',
  ],
  confidence: {
    score: 5,
    label: 'Medium',
    rubric: 'Five dimensions scored 0–2; 8–10 High, 5–7 Medium, 0–4 Low.',
    dimensions: {
      evidence: 2,
      execution: 1,
      backtest: 0,
      sensitivity: 1,
      freshness: 1,
    },
    strongestEvidence:
      'Official market, regulatory and transmission-plan evidence supports the market mechanism and connection bottleneck.',
    largestUncertainty:
      'No complete BESS queue and no reproducible project-level merchant/balancing backtest were verified.',
    lastEvaluated: '2026-07-29',
    invalidation:
      'Reassess if connection reform materially changes conversion times, a capacity-style revenue mechanism is introduced, or realised spread capture diverges from the underwriting case.',
  },
};

