import { AUTHORITY } from './authority.js';
import { sourceById } from './sourceRegistry.js';
import { UNIT, YEAR_BASIS, VALUE_BASIS, validateMetricBasis } from './units.js';

const jpPlanningMetric = ({ id, label, values, basis }) => ({
  id,
  marketId: 'jp',
  label,
  authority: AUTHORITY.OFFICIAL_FORECAST,
  unit: UNIT.GW,
  yearBasis: YEAR_BASIS.FISCAL,
  valueBasis: basis,
  sourceIds: ['jp-occto-supply-plan-2025'],
  vintage: 'OCCTO Aggregation of Electricity Supply Plans FY2025',
  transformation: 'OCCTO FY2025 supply-plan table values are published in 10^4 kW. Select FY2025, FY2030 and FY2034 for the named region and divide by 100 to express GW; no interpolation.',
  values: [2025, 2030, 2034].map((year, index) => ({ year, value: values[index] })),
});

const JP_OFFICIAL_METRICS = [
  jpPlanningMetric({
    id: 'jp-tokyo-peak-demand',
    label: ['Tokyo-area peak demand forecast', '东京区域峰值需求预测'],
    values: [54.88, 57.61, 58.80],
    basis: VALUE_BASIS.PEAK,
  }),
  jpPlanningMetric({
    id: 'jp-tokyo-supply-capacity',
    label: ['Tokyo-area projected supply capacity', '东京区域预测供给能力'],
    values: [64.54, 64.65, 66.60],
    basis: VALUE_BASIS.NAMEPLATE,
  }),
  jpPlanningMetric({
    id: 'jp-kyushu-peak-demand',
    label: ['Kyushu-area peak demand forecast', '九州区域峰值需求预测'],
    values: [15.63, 15.90, 15.89],
    basis: VALUE_BASIS.PEAK,
  }),
  jpPlanningMetric({
    id: 'jp-kyushu-supply-capacity',
    label: ['Kyushu-area projected supply capacity', '九州区域预测供给能力'],
    values: [18.61, 18.05, 18.20],
    basis: VALUE_BASIS.NAMEPLATE,
  }),
  jpPlanningMetric({
    id: 'jp-hokkaido-winter-peak-demand',
    label: ['Hokkaido winter peak demand forecast', '北海道冬季峰值需求预测'],
    values: [5.02, 5.39, 5.38],
    basis: VALUE_BASIS.PEAK,
  }),
  jpPlanningMetric({
    id: 'jp-hokkaido-winter-supply-capacity',
    label: ['Hokkaido winter projected supply capacity', '北海道冬季预测供给能力'],
    values: [5.80, 7.26, 7.82],
    basis: VALUE_BASIS.NAMEPLATE,
  }),
];

/* Metric-level lineage for the GB pilot. Values remain in the registry so the
   chart, export and provenance panel cannot quietly diverge. */
export const METRICS = [
  {
    id: 'gb-fes-total-system-demand',
    marketId: 'gb',
    label: ['FES system demand — total', 'FES系统总需求'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GWH,
    yearBasis: YEAR_BASIS.FISCAL,
    valueBasis: VALUE_BASIS.ANNUAL_ENERGY,
    sourceIds: ['gb-neso-fes-ed1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ED1: Aggregation Level=GBFES System Demand; Data item=Total; Unit=GWh; Peak/Annual/Minimum=Annual; Pathway=Ten Year Forecast.',
    values: [{ year: 2024, value: 289650 }, { year: 2030, value: 330877 }, { year: 2035, value: 396764 }],
  },
  {
    id: 'gb-fes-peak-customer-demand',
    marketId: 'gb',
    label: ['FES peak customer demand — total consumption plus losses', 'FES客户峰值需求 — 总用电量加损耗'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.FISCAL,
    valueBasis: VALUE_BASIS.PEAK,
    sourceIds: ['gb-neso-fes-ed1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ED1: Aggregation Level=GBFES Peak Customer Demand; Data item=Total Consumption plus Losses; Unit=GW; Peak/Annual/Minimum=Peak.',
    values: [{ year: 2024, value: 58.339 }, { year: 2030, value: 63.552 }, { year: 2035, value: 71.914 }],
  },
  {
    id: 'gb-fes-data-centre-demand',
    marketId: 'gb',
    label: ['FES data-centre demand', 'FES数据中心需求'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GWH,
    yearBasis: YEAR_BASIS.FISCAL,
    valueBasis: VALUE_BASIS.ANNUAL_ENERGY,
    sourceIds: ['gb-neso-fes-ed1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ED1: Data item=Data Centre Demand; Unit=GWh; Pathway=Ten Year Forecast.',
    values: [{ year: 2024, value: 7738 }, { year: 2030, value: 20099 }, { year: 2035, value: 33211 }],
  },
  {
    id: 'gb-fes-network-battery-capacity',
    marketId: 'gb',
    label: ['FES network-connected battery capacity', 'FES联网电池容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Category=Battery; sum Transmission + Distributed; exclude Distributed-Micro; divide by 1,000.',
    values: [{ year: 2024, value: 6.587378 }, { year: 2030, value: 23.865084 }, { year: 2035, value: 28.181512 }],
  },
  {
    id: 'gb-fes-wind-capacity',
    marketId: 'gb',
    label: ['FES wind capacity — onshore and offshore', 'FES风电容量 — 陆上与海上'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); sum Wind Onshore and Wind Offshore across connections; divide by 1,000.',
    values: [{ year: 2024, value: 30.0066008 }, { year: 2030, value: 69.4787127 }, { year: 2035, value: 98.8815021 }],
  },
  {
    id: 'gb-fes-solar-capacity',
    marketId: 'gb',
    label: ['FES solar PV capacity', 'FES光伏容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Category=Solar; sum across connections; divide by 1,000.',
    values: [{ year: 2024, value: 18.788487 }, { year: 2030, value: 36.30757 }, { year: 2035, value: 46.62353 }],
  },
  {
    id: 'gb-fes-gas-capacity',
    marketId: 'gb',
    label: ['FES gas capacity', 'FES燃气发电容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Category=Gas; sum across connections; divide by 1,000.',
    values: [{ year: 2024, value: 39.31205 }, { year: 2030, value: 36.443099 }, { year: 2035, value: 32.378055 }],
  },
  {
    id: 'gb-fes-nuclear-capacity',
    marketId: 'gb',
    label: ['FES nuclear capacity', 'FES核电容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Category=Nuclear; sum across connections; divide by 1,000.',
    values: [{ year: 2024, value: 6.076 }, { year: 2030, value: 2.90 }, { year: 2035, value: 4.57 }],
  },
  {
    id: 'gb-fes-interconnector-capacity',
    marketId: 'gb',
    label: ['FES interconnector capacity', 'FES互联线路容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Category=Interconnector; sum across connections; divide by 1,000.',
    values: [{ year: 2024, value: 9.80 }, { year: 2030, value: 11.70 }, { year: 2035, value: 16.90 }],
  },
  {
    id: 'gb-fes-ldes-capacity',
    marketId: 'gb',
    label: ['FES long-duration electricity storage capacity', 'FES长时电力储能容量'],
    authority: AUTHORITY.OFFICIAL_FORECAST,
    unit: UNIT.GW,
    yearBasis: YEAR_BASIS.CALENDAR,
    valueBasis: VALUE_BASIS.NAMEPLATE,
    sourceIds: ['gb-neso-fes-es1-2025'],
    vintage: 'FES 2025 — Ten Year Forecast',
    transformation: 'ES1: Variable=Capacity (MW); Type=Long Duration Energy Storage; sum technologies and connections; divide by 1,000.',
    values: [{ year: 2024, value: 2.752294 }, { year: 2030, value: 3.002194 }, { year: 2035, value: 7.158094 }],
  },
  {
    id: 'gb-tec-exact-ess-forward-capacity',
    marketId: 'gb',
    label: ['TEC exact-ESS forward capacity by effective year', 'TEC纯储能前瞻容量（按生效年份）'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.EFFECTIVE_DATE,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Plant Type exactly "Energy Storage System"; deduplicate by Project ID; retain row with maximum cumulative capacity (latest effective date breaks ties); exclude Built and years before 2026.',
    values: [
      { year: 2026, value: 3253.6 }, { year: 2027, value: 10396 }, { year: 2028, value: 10145.1 },
      { year: 2029, value: 12132.4 }, { year: 2030, value: 7513.6 }, { year: 2031, value: 12815.2 },
      { year: 2032, value: 6987 }, { year: 2033, value: 24435.4 }, { year: 2034, value: 23480.2 },
      { year: 2035, value: 12086.8 }, { year: 2036, value: 8006.2 }, { year: 2037, value: 36661.4 },
      { year: 2038, value: 6980.9 }, { year: 2039, value: 2302 },
    ],
  },
  {
    id: 'gb-tec-exact-ess-forward-gate-2',
    marketId: 'gb',
    label: ['TEC exact-ESS Gate 2 capacity by effective year', 'TEC纯储能Gate 2容量（按生效年份）'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.EFFECTIVE_DATE,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Apply the exact-ESS, deduplication and forward filters, then Gate=2.',
    values: [
      { year: 2026, value: 931.8 }, { year: 2027, value: 4113.7 }, { year: 2028, value: 2075.9 },
      { year: 2029, value: 657 }, { year: 2030, value: 0 }, { year: 2031, value: 0 },
      { year: 2032, value: 0 }, { year: 2033, value: 0 }, { year: 2034, value: 0 },
      { year: 2035, value: 0 }, { year: 2036, value: 0 }, { year: 2037, value: 0 },
      { year: 2038, value: 0 }, { year: 2039, value: 0 },
    ],
  },
  {
    id: 'gb-tec-exact-ess-forward-gate-1',
    marketId: 'gb',
    label: ['TEC exact-ESS Gate 1 capacity by effective year', 'TEC纯储能Gate 1容量（按生效年份）'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.EFFECTIVE_DATE,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Apply the exact-ESS, deduplication and forward filters, then Gate=1.',
    values: [
      { year: 2026, value: 557 }, { year: 2027, value: 1291.5 }, { year: 2028, value: 2752.3 },
      { year: 2029, value: 4305 }, { year: 2030, value: 5596.9 }, { year: 2031, value: 6224 },
      { year: 2032, value: 5081.5 }, { year: 2033, value: 18852.7 }, { year: 2034, value: 18161.9 },
      { year: 2035, value: 6297.8 }, { year: 2036, value: 5607.5 }, { year: 2037, value: 23030 },
      { year: 2038, value: 4430.9 }, { year: 2039, value: 840 },
    ],
  },
  {
    id: 'gb-tec-exact-ess-forward-gate-unpopulated',
    marketId: 'gb',
    label: ['TEC exact-ESS capacity with Gate not populated', 'TEC纯储能Gate未填报容量'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.EFFECTIVE_DATE,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Apply the exact-ESS, deduplication and forward filters, then Gate is null/blank. Unknown is not mapped to Gate 1.',
    values: [
      { year: 2026, value: 1764.8 }, { year: 2027, value: 4990.8 }, { year: 2028, value: 5316.9 },
      { year: 2029, value: 7170.4 }, { year: 2030, value: 1916.7 }, { year: 2031, value: 6591.2 },
      { year: 2032, value: 1905.5 }, { year: 2033, value: 5582.7 }, { year: 2034, value: 5318.3 },
      { year: 2035, value: 5789 }, { year: 2036, value: 2398.7 }, { year: 2037, value: 13631.4 },
      { year: 2038, value: 2550 }, { year: 2039, value: 1462 },
    ],
  },
  {
    id: 'gb-tec-exact-ess-analyst-weighted-forward',
    marketId: 'gb',
    label: ['TEC exact-ESS analyst-weighted forward capacity', 'TEC纯储能分析师加权前瞻容量'],
    authority: AUTHORITY.ANALYST_SCENARIO,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.EFFECTIVE_DATE,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29; GB screening weights v1',
    transformation: 'Apply exact-ESS/dedup/forward filters; weight Under Construction 90%, Gate 2 + Consents Approved 60%, other Gate 2 45%, Gate 1 25%, Gate unpopulated 20%. These are analyst screening weights, not NESO probabilities.',
    values: [
      { year: 2026, value: 1039.9 }, { year: 2027, value: 3450.8 }, { year: 2028, value: 2829 },
      { year: 2029, value: 2836 }, { year: 2030, value: 1782.6 }, { year: 2031, value: 2874.2 },
      { year: 2032, value: 1651.5 }, { year: 2033, value: 5829.7 }, { year: 2034, value: 5604.1 },
      { year: 2035, value: 2732.3 }, { year: 2036, value: 1881.6 }, { year: 2037, value: 8639.8 },
      { year: 2038, value: 1617.7 }, { year: 2039, value: 502.4 },
    ],
  },
  {
    id: 'gb-tec-exact-ess-built-capacity',
    marketId: 'gb',
    label: ['TEC exact-ESS built capacity', 'TEC纯储能已建容量'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.MW,
    yearBasis: YEAR_BASIS.SNAPSHOT,
    valueBasis: VALUE_BASIS.CUMULATIVE_CONTRACTED,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Apply exact-ESS and Project ID deduplication, then Project Status=Built; sum cumulative capacity.',
    values: [{ year: 2026, value: 3627.9 }],
  },
  {
    id: 'gb-tec-exact-ess-project-count',
    marketId: 'gb',
    label: ['TEC exact-ESS unique project count', 'TEC纯储能唯一项目数'],
    authority: AUTHORITY.DERIVED_OBSERVED,
    unit: UNIT.COUNT,
    yearBasis: YEAR_BASIS.SNAPSHOT,
    valueBasis: VALUE_BASIS.COUNT,
    sourceIds: ['gb-neso-tec-register'],
    vintage: 'TEC snapshot retrieved 2026-07-29',
    transformation: 'Plant Type exactly Energy Storage System; count unique Project ID after deterministic deduplication.',
    values: [{ year: 2026, value: 714 }],
  },
  ...JP_OFFICIAL_METRICS,
];

const metricByIdMap = new Map(METRICS.map(metric => [metric.id, metric]));

export function metricById(id){
  return metricByIdMap.get(id) || null;
}

export function metricsForMarket(marketId){
  return METRICS.filter(metric => metric.marketId === marketId);
}

export function metricValues(id){
  const metric = metricById(id);
  if (!metric) throw new Error(`Unknown metric "${id}"`);
  return metric.values.map(point => point.value);
}

export function metricYears(id){
  const metric = metricById(id);
  if (!metric) throw new Error(`Unknown metric "${id}"`);
  return metric.values.map(point => point.year);
}

export function validateMetric(metric){
  const problems = [];
  for (const key of ['id', 'marketId', 'authority', 'unit', 'yearBasis', 'valueBasis', 'vintage', 'transformation']){
    if (metric?.[key] === undefined || metric[key] === null || metric[key] === '') problems.push(`${key} is required`);
  }
  if (!/^[a-z0-9-]+$/.test(metric?.id || '')) problems.push('id must be URL-safe');
  if (!Array.isArray(metric?.label) || metric.label.length !== 2 || metric.label.some(v => !v)) problems.push('label must be [en, zh]');
  if (!Object.values(AUTHORITY).includes(metric?.authority)) problems.push(`unknown authority "${metric?.authority}"`);
  problems.push(...validateMetricBasis(metric));
  if (!Array.isArray(metric?.sourceIds) || metric.sourceIds.length === 0) problems.push('sourceIds must be non-empty');
  else for (const sourceId of metric.sourceIds) if (!sourceById(sourceId)) problems.push(`unknown source "${sourceId}"`);
  if (!Array.isArray(metric?.values) || metric.values.length === 0) problems.push('values must be non-empty');
  else {
    let previousYear = -Infinity;
    for (const [index, point] of metric.values.entries()){
      if (!Number.isInteger(point?.year)) problems.push(`values[${index}].year must be an integer`);
      if (!Number.isFinite(point?.value)) problems.push(`values[${index}].value must be finite`);
      if (point?.year <= previousYear) problems.push('values must be strictly ordered by year');
      previousYear = point?.year;
    }
  }
  return problems;
}

export function validateMetricRegistry(metrics = METRICS){
  const problems = [];
  const ids = new Set();
  for (const metric of metrics){
    if (ids.has(metric.id)) problems.push(`${metric.id}: duplicate id`);
    ids.add(metric.id);
    problems.push(...validateMetric(metric).map(problem => `${metric.id || '(missing id)'}: ${problem}`));
  }
  return problems;
}

