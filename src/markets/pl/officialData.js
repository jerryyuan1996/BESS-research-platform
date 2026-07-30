import { AUTHORITY } from '../../governance/authority.js';

const NECP_URL =
  'https://www.gov.pl/web/energia/krajowy-plan-w-dziedzinie-energii-i-klimatu-do-2030-r-z-perspektywa-do-2040-r---przyjety-przez-rade-ministrow';
const NECP_WAM_URL =
  'https://www.gov.pl/attachment/452787b4-3bdd-45b1-9c1a-1efe340784a3';
const PSE_PLAN_URL =
  'https://www.pse.pl/documents/31287/22159050/Development_plan_2025_2034_main_document_20_12_2024.pdf/6397676d-d217-4bcb-b04c-f3fafc2dde12?safeargs=76657273696f6e3d312e31';

const planningBasis =
  'Official planning capacity (net available/installed as stated by the source); not capacity-market de-rated or contracted capacity.';

export const PL_SYSTEM_EVOLUTION = {
  marketId: 'pl',
  authority: AUTHORITY.OFFICIAL_FORECAST,
  pathway: 'Adopted NECP WAM plus PSE Transmission Network Development Plan 2025–2034',
  vintage: 'NECP adopted 8 June 2026; PSE plan dated 20 December 2024',
  years: [2025, 2030, 2034],
  coverage: {
    status: 'official-scenario-composite',
    statement:
      '2025 and 2030 are NECP WAM model points; 2034 is PSE DTS planning evidence. Different source definitions are displayed explicitly and are not silently interpolated.',
    capacityBasis: planningBasis,
  },
  points: [
    {
      year: 2025,
      label: 'Today · WAM model point',
      source: 'NECP WAM',
      observed: false,
      totalNetCapacityGW: 74.553,
      coalNetCapacityGW: 21.472,
      onshoreWindNetCapacityGW: 10.744,
      offshoreWindNetCapacityGW: 0,
      solarNetCapacityGW: 24.195,
      storageNetCapacityGW: 0.55,
      nuclearNetCapacityGW: 0,
      annualDemandTWh: null,
      winterPeakGW: null,
      basis: planningBasis,
      note: 'The source labels 2025 as a model forecast; it is not an observed current-state measurement.',
    },
    {
      year: 2030,
      label: '2030 · adopted WAM pathway',
      source: 'NECP WAM',
      observed: false,
      totalNetCapacityGW: 98.824,
      coalNetCapacityGW: 14.863,
      onshoreWindNetCapacityGW: 16.476,
      offshoreWindNetCapacityGW: 5.873,
      solarNetCapacityGW: 32.395,
      storageNetCapacityGW: 5.865,
      nuclearNetCapacityGW: 0,
      annualDemandTWh: null,
      winterPeakGW: null,
      basis: planningBasis,
    },
    {
      year: 2034,
      label: '2034 · PSE network-plan case',
      source: 'PSE DTS scenario',
      observed: false,
      totalNetCapacityGW: null,
      coalNetCapacityGW: null,
      onshoreWindNetCapacityGW: 19.362,
      offshoreWindNetCapacityGW: 11.885,
      solarNetCapacityGW: 45,
      storageNetCapacityGW: 15.207,
      nuclearNetCapacityGW: null,
      annualDemandTWh: 243.2,
      winterPeakGW: 42.782,
      basis: planningBasis,
      note:
        'Demand and peak include electric vehicles and potential additional customers; PSE also publishes 205.7 TWh and 38.505 GW excluding them.',
    },
  ],
  context2040: {
    year: 2040,
    label: '2040 · policy context only',
    source: 'NECP WAM',
    totalNetCapacityGW: 155.777,
    coalNetCapacityGW: 4.572,
    onshoreWindNetCapacityGW: 28.782,
    offshoreWindNetCapacityGW: 17.9,
    solarNetCapacityGW: 43.037,
    storageNetCapacityGW: 19.055,
    nuclearNetCapacityGW: 5.91,
    basis: planningBasis,
    note: 'Context only — 2040 is outside the PSE 2025–2034 primary network-plan rail.',
  },
  provenance: [
    {
      owner: 'Polish Ministry of Energy / Council of Ministers',
      authority: AUTHORITY.OFFICIAL_FORECAST,
      sourceId: 'pl-necp-wam-2026',
      url: NECP_WAM_URL,
      landingUrl: NECP_URL,
      transformation: 'Manual structured extraction of the WAM capacity table.',
      lastChecked: '2026-07-29',
      sourceCadence: 'Policy-plan revision cycle',
      machineReadable: 'Limited — public attachment',
      automation: 'C — fetchable attachment; table extraction and scenario checks require review',
      freshness: 'Council of Ministers adoption dated 8 June 2026',
    },
    {
      owner: 'Polskie Sieci Elektroenergetyczne (PSE)',
      authority: AUTHORITY.OFFICIAL_FORECAST,
      sourceId: 'pl-pse-development-plan-2025-2034',
      url: PSE_PLAN_URL,
      transformation: 'Manual structured extraction of the DTS scenario and connection snapshot.',
      lastChecked: '2026-07-29',
      sourceCadence: 'Statutory transmission-planning cycle',
      machineReadable: 'Limited — public PDF',
      automation: 'C — fetchable PDF; tables require review',
      freshness: 'Current published 2025–2034 plan vintage',
    },
  ],
};

export const PL_QUEUE_COVERAGE = {
  marketId: 'pl',
  authority: AUTHORITY.OBSERVED,
  completeOfficialBessQueue: false,
  coverageStatement:
    'No single public official register was verified that follows every Polish BESS project through connection, permit, financing, construction and operation.',
  knownConnectionSnapshot: {
    asOf: '2023-12-31',
    connectionAgreementMW: 1901.4,
    connectionConditionsMW: 9786.7,
    basis:
      'PSE storage-facility connection capacity. It is not operating nameplate MW, capacity-market de-rated MW or contracted capacity obligation.',
  },
  capacityMarketEvidence: {
    nameplateAwardMW: {
      value: null,
      display: 'N/A',
      reason: 'Not evidenced in the implemented official extraction.',
    },
    deRatedObligationMW: {
      value: null,
      display: 'N/A',
      reason: 'Requires auction-vintage results plus the applicable correction-factor table.',
    },
    contractedBessObligationMW: {
      value: null,
      display: 'N/A',
      reason: 'Requires technology-level reconstruction from PSE/URE final results.',
    },
  },
  provenance: {
    owner: 'Polskie Sieci Elektroenergetyczne (PSE)',
    authority: AUTHORITY.OBSERVED,
    sourceId: 'pl-pse-development-plan-2025-2034',
    url: PSE_PLAN_URL,
    lastChecked: '2026-07-29',
    machineReadable: 'Limited — public PDF',
    automation: 'C — scheduled fetch possible; project and technology classification require review',
    freshness: 'Connection snapshot dated 31 December 2023 in the current plan',
  },
};

export const PL_OPPORTUNITY_LOGIC = {
  marketId: 'pl',
  authority: AUTHORITY.METHODOLOGY,
  attractiveness: {
    rating: 'Selective-positive',
    statement:
      'Coal retirement, storage growth and a capacity mechanism support the thesis, but project value depends on connection evidence and auction-vintage economics.',
  },
  logic: [
    'Coal capacity retires while demand and variable renewables rise.',
    'The system needs firm flexibility and the capacity market can contract qualifying resources.',
    'Nameplate capacity is not the paid obligation: correction factors and auction vintage determine de-rated capacity.',
    'Connection conditions, certification and duration compliance decide which projects convert.',
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
      'The adopted NECP WAM and PSE plan quantify the system transition and connection evidence on public official sources.',
    largestUncertainty:
      'A complete BESS queue and an auction-vintage reconstruction of nameplate, de-rated and contracted storage capacity were not verified.',
    lastEvaluated: '2026-07-29',
    invalidation:
      'Reassess after material correction-factor, auction-rule or connection-reform changes, or when observed storage delivery diverges from the official planning pathway.',
  },
};

