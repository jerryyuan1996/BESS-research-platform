/* Cross-market forecast release contract.

   This is intentionally about evidence coverage, not market attractiveness.
   A market can be commercially attractive with medium forecast confidence, or
   unattractive with high confidence. The UI must never blend the two.

   Confidence follows FORECAST_UPGRADE_PLAN.md: five dimensions scored 0–2.
   8–10 = High, 5–7 = Medium, 0–4 = Low. */

const DIMENSIONS = [
  'officialForwardCoverage',
  'historicalDepth',
  'projectCompleteness',
  'revenueEvidence',
  'gridSpatialEvidence',
];

const score = dimensions => DIMENSIONS.reduce((total, key) => total + dimensions[key], 0);
const band = value => value >= 8 ? 'High' : value >= 5 ? 'Medium' : 'Low';

function release(config){
  const confidenceScore = score(config.confidence);
  return Object.freeze({
    ...config,
    confidenceScore,
    confidenceBand: band(confidenceScore),
  });
}

export const MARKET_FORECAST_COVERAGE = Object.freeze({
  wa: release({
    marketId: 'wa',
    displayYears: [2026, 2030, 2035],
    officialAnchor: 'AEMO WEM Electricity Statement of Opportunities',
    queueCoverage: 'partial-public-evidence',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 2, projectCompleteness: 0,
      revenueEvidence: 2, gridSpatialEvidence: 1,
    },
    invalidation: 'AEMO adequacy need, RCM price formation or connection timing moves outside the approved scenario range.',
  }),
  gb: release({
    marketId: 'gb',
    displayYears: [2024, 2030, 2035],
    officialAnchor: 'NESO Future Energy Scenarios 2025 — Ten Year Forecast',
    queueCoverage: 'strong-public-registers-not-delivery-forecast',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 2, projectCompleteness: 2,
      revenueEvidence: 2, gridSpatialEvidence: 2,
    },
    invalidation: 'Connection delivery or realised revenue capture fails to keep pace with official system need.',
  }),
  ie: release({
    marketId: 'ie',
    displayYears: [2025, 2030, 2034],
    officialAnchor: 'EirGrid/SONI AIRAA 2025–2034 and transmission plans',
    queueCoverage: 'partial-composite-no-complete-public-funnel',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 2, projectCompleteness: 0,
      revenueEvidence: 2, gridSpatialEvidence: 2,
    },
    invalidation: 'Interconnection, FASS repricing or connection constraints remove the captured system-value case.',
  }),
  ro: release({
    marketId: 'ro',
    displayYears: [2026, 2030, 2035],
    officialAnchor: 'Transelectrica Romanian Power Grid Development Plan 2026–2035',
    queueCoverage: 'allocation-process-subset-no-complete-public-funnel',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 1, projectCompleteness: 0,
      revenueEvidence: 1, gridSpatialEvidence: 2,
    },
    invalidation: 'Connection-capacity allocation, reinforcement delivery or balancing-market access misses the approved case.',
  }),
  pl: release({
    marketId: 'pl',
    displayYears: [2026, 2030, 2034],
    contextYears: [2040],
    officialAnchor: 'PSE Transmission Network Development Plan 2025–2034',
    queueCoverage: 'plan-and-auction-subset-no-complete-public-funnel',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 1, projectCompleteness: 0,
      revenueEvidence: 2, gridSpatialEvidence: 2,
    },
    invalidation: 'Capacity-payment basis, connection delivery or coal-retirement timing differs materially from the approved case.',
  }),
  jp: release({
    marketId: 'jp',
    displayYears: [2025, 2030, 2034],
    contextYears: [2040],
    officialAnchor: 'OCCTO Aggregation of Electricity Supply Plans FY2025',
    queueCoverage: 'official-awards-and-tso-subsets-no-complete-public-funnel',
    confidence: {
      officialForwardCoverage: 2, historicalDepth: 2, projectCompleteness: 0,
      revenueEvidence: 2, gridSpatialEvidence: 2,
    },
    invalidation: 'Regional price capture, balancing qualification, grid deliverability or saturation moves outside the approved case.',
  }),
});

export function forecastCoverageForMarket(marketId){
  if (marketId.startsWith('jp_')) return MARKET_FORECAST_COVERAGE.jp;
  return MARKET_FORECAST_COVERAGE[marketId] || null;
}

export function validateForecastCoverage(registry = MARKET_FORECAST_COVERAGE){
  const problems = [];
  for (const [id, item] of Object.entries(registry)){
    if (item.marketId !== id) problems.push(`${id}: marketId mismatch`);
    if (!Array.isArray(item.displayYears) || item.displayYears.length < 3) problems.push(`${id}: three display years required`);
    if (item.displayYears.some((year, index) => !Number.isInteger(year) || (index && year <= item.displayYears[index - 1]))) {
      problems.push(`${id}: displayYears must be increasing integers`);
    }
    for (const key of DIMENSIONS){
      if (!Number.isInteger(item.confidence?.[key]) || item.confidence[key] < 0 || item.confidence[key] > 2) {
        problems.push(`${id}: ${key} must be an integer from 0 to 2`);
      }
    }
    if (item.confidenceScore !== score(item.confidence)) problems.push(`${id}: confidenceScore does not reconcile`);
    if (item.confidenceBand !== band(item.confidenceScore)) problems.push(`${id}: confidenceBand does not reconcile`);
    if (!item.officialAnchor || !item.queueCoverage || !item.invalidation) problems.push(`${id}: release metadata incomplete`);
  }
  return problems;
}
