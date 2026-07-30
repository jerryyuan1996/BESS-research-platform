import { CORE_MARKET_SOURCES } from './coreMarketSources.js';

/* Governed public-source registry.

   This is the source-level contract. Market source drawers remain the compact
   presentation adapter; governed metrics resolve to these stable source ids.
   The GB records are the first implemented market slice and are intentionally
   detailed enough to support automated refreshes without relying on page text. */

export const AUTOMATION_GRADE = new Set(['A', 'B', 'C', 'D']);
export const SOURCE_QUALITY = new Set(['high', 'medium-high', 'medium', 'low']);

export const SOURCE_REGISTRY = [
  {
    id: 'gb-neso-capacity-market-register',
    marketId: 'gb',
    category: 'capacity-competition',
    owner: 'National Energy System Operator',
    title: ['Capacity Market Register', '容量市场登记册'],
    canonicalUrl: 'https://www.neso.energy/data-portal/capacity-market-register',
    resourceLocator: 'CKAN package capacity-market-register; CMU resource 25a5fa2e-873d-41c5-8aaf-fbc2b06d79e6',
    format: 'CSV via NESO Data Portal / CKAN API',
    cadence: 'weekly',
    licence: 'NESO Open Data Licence',
    automation: 'A',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 14,
  },
  {
    id: 'gb-neso-tec-register',
    marketId: 'gb',
    category: 'grid-competition',
    owner: 'National Energy System Operator',
    title: ['Transmission Entry Capacity Register', '输电接入容量登记册'],
    canonicalUrl: 'https://www.neso.energy/data-portal/transmission-entry-capacity-tec-register/tec_register',
    resourceLocator: 'CKAN DataStore resource 17becbab-e3e8-473f-b303-3806f43a6a10',
    format: 'CSV / CKAN DataStore API',
    cadence: 'Tuesday and Friday',
    licence: 'NESO Open Data Licence',
    automation: 'A',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 7,
    checksum: 'sha256:abfda0d6c7bac6a0efd1349e49a1a00ac81256d896d9e61d41f21cb2adc85d40',
  },
  {
    id: 'gb-neso-fes-es1-2025',
    marketId: 'gb',
    category: 'system-planning',
    owner: 'National Energy System Operator',
    title: ['FES 2025 Electricity Supply Data Table ES1', 'FES 2025电力供应数据表ES1'],
    canonicalUrl: 'https://www.neso.energy/data-portal/future-energy-scenario-electricity-supply-data-table-es1/electricity_supply_data_table_es1_2025',
    resourceLocator: 'CKAN DataStore resource 6c78a777-b885-4bb6-bc35-8100f9e137a2',
    format: 'Structured CKAN DataStore table',
    cadence: 'annual',
    licence: 'NESO Open Data Licence',
    automation: 'A',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 450,
    checksum: 'sha256:051aad29cc5122dac6d2936b6fd9887217adb69fe5342be4815d1c57b8dbecf5',
  },
  {
    id: 'gb-neso-fes-ed1-2025',
    marketId: 'gb',
    category: 'system-planning',
    owner: 'National Energy System Operator',
    title: ['FES 2025 Electricity Demand Summary ED1', 'FES 2025电力需求汇总ED1'],
    canonicalUrl: 'https://www.neso.energy/data-portal/fes-electricity-demand-summary-data-table-ed1/electricity_demand_summary_ed1_2025',
    resourceLocator: 'CKAN DataStore resource 300c07b9-baeb-4411-bc40-987cbb4aec0b',
    format: 'Structured CKAN DataStore table',
    cadence: 'annual',
    licence: 'NESO Open Data Licence',
    automation: 'A',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 450,
    checksum: 'sha256:413de71ce80bf99e260cb6b5cf158a3e40dc7f8f3982d121c860533fadcd4167',
  },
  {
    id: 'gb-neso-fes-documents',
    marketId: 'gb',
    category: 'system-planning',
    owner: 'National Energy System Operator',
    title: ['Future Energy Scenarios documents and workbooks', '未来能源情景文件与工作簿'],
    canonicalUrl: 'https://www.neso.energy/publications/future-energy-scenarios-fes/fes-documents',
    resourceLocator: 'Annual publication archive',
    format: 'Excel and PDF',
    cadence: 'annual',
    licence: 'NESO Open Data Licence',
    automation: 'B',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 450,
  },
  {
    id: 'gb-neso-etys',
    marketId: 'gb',
    category: 'grid',
    owner: 'National Energy System Operator',
    title: ['Electricity Ten Year Statement', '电力十年声明'],
    canonicalUrl: 'https://www.neso.energy/publications/electricity-ten-year-statement-etys',
    resourceLocator: 'Annual report and data workbook',
    format: 'PDF and Excel',
    cadence: 'annual',
    licence: 'NESO Open Data Licence',
    automation: 'B',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 450,
  },
  {
    id: 'gb-neso-beyond-2030',
    marketId: 'gb',
    category: 'grid',
    owner: 'National Energy System Operator',
    title: ['Beyond 2030', '超越2030'],
    canonicalUrl: 'https://www.neso.energy/publications/beyond-2030',
    resourceLocator: 'Report and data workbook',
    format: 'PDF and Excel',
    cadence: 'periodic',
    licence: 'NESO Open Data Licence',
    automation: 'B',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 730,
  },
  {
    id: 'gb-entsoe-transparency',
    marketId: 'gb',
    category: 'wholesale',
    owner: 'European Network of Transmission System Operators for Electricity',
    title: ['ENTSO-E Transparency Platform — GB day-ahead prices', 'ENTSO-E透明度平台 — 英国日前电价'],
    canonicalUrl: 'https://transparency.entsoe.eu/',
    resourceLocator: 'A44 day-ahead price document for GB bidding zone',
    format: 'REST XML',
    cadence: 'daily',
    licence: 'ENTSO-E reuse permitted with attribution',
    automation: 'A',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 3,
  },
  {
    id: 'gb-elexon-bmrs',
    marketId: 'gb',
    category: 'wholesale-balancing',
    owner: 'Elexon',
    title: ['BMRS API', 'BMRS接口'],
    canonicalUrl: 'https://bmrs.elexon.co.uk/api-documentation/introduction',
    resourceLocator: 'Endpoint-dependent REST resources',
    format: 'REST JSON / CSV',
    cadence: 'near-real-time',
    licence: 'Elexon BMRS public data terms',
    automation: 'B',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 3,
  },
  {
    id: 'gb-desnz-clean-power-2030',
    marketId: 'gb',
    category: 'policy-system',
    owner: 'Department for Energy Security and Net Zero',
    title: ['Clean Power 2030 Action Plan', '清洁电力2030行动计划'],
    canonicalUrl: 'https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report',
    resourceLocator: 'Main report',
    format: 'HTML / PDF',
    cadence: 'policy updates',
    licence: 'Open Government Licence',
    automation: 'C',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 730,
  },
  {
    id: 'gb-desnz-repd',
    marketId: 'gb',
    category: 'competition',
    owner: 'Department for Energy Security and Net Zero',
    title: ['Renewable Energy Planning Database', '可再生能源规划数据库'],
    canonicalUrl: 'https://ckan.publishing.service.gov.uk/dataset/repd',
    resourceLocator: 'Quarterly CKAN resources',
    format: 'CSV / Excel',
    cadence: 'quarterly',
    licence: 'Open Government Licence',
    automation: 'B',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 120,
  },
  {
    id: 'gb-ofgem-ldes-model',
    marketId: 'gb',
    category: 'contract-policy',
    owner: 'Office of Gas and Electricity Markets',
    title: ['LDES Cap and Floor Financial Model and Handbook', '长时储能上下限财务模型与手册'],
    canonicalUrl: 'https://www.ofgem.gov.uk/guidance/long-duration-electricity-storage-ldes-cap-and-floor-financial-model-and-handbook',
    resourceLocator: 'Current handbook and macro-enabled workbook',
    format: 'PDF / XLSM',
    cadence: 'per decision window',
    licence: 'Open publication; workbook parsing must be controlled',
    automation: 'C',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 365,
  },
  {
    id: 'gb-desnz-clean-flexibility-roadmap',
    marketId: 'gb',
    category: 'market-reform',
    owner: 'Department for Energy Security and Net Zero',
    title: ['Clean Flexibility Roadmap', '清洁灵活性路线图'],
    canonicalUrl: 'https://www.gov.uk/government/publications/clean-flexibility-roadmap/clean-flexibility-roadmap',
    resourceLocator: 'Current publication',
    format: 'HTML / PDF',
    cadence: 'periodic',
    licence: 'Open Government Licence',
    automation: 'C',
    quality: 'high',
    retrievedAt: '2026-07-29',
    staleAfterDays: 730,
  },
  ...CORE_MARKET_SOURCES,
];

const sourceByIdMap = new Map(SOURCE_REGISTRY.map(source => [source.id, source]));

export function sourceById(id){
  return sourceByIdMap.get(id) || null;
}

export function sourcesForMarket(marketId){
  return SOURCE_REGISTRY.filter(source => source.marketId === marketId);
}

export function validateSource(source){
  const problems = [];
  for (const key of ['id', 'marketId', 'category', 'owner', 'canonicalUrl', 'resourceLocator', 'format', 'cadence', 'licence', 'automation', 'quality', 'retrievedAt']){
    if (source?.[key] === undefined || source[key] === null || source[key] === '') problems.push(`${key} is required`);
  }
  if (!/^[a-z0-9-]+$/.test(source?.id || '')) problems.push('id must be URL-safe');
  if (!Array.isArray(source?.title) || source.title.length !== 2 || source.title.some(v => !v)) problems.push('title must be [en, zh]');
  try { new URL(source?.canonicalUrl); } catch { problems.push('canonicalUrl must be an absolute URL'); }
  if (!AUTOMATION_GRADE.has(source?.automation)) problems.push(`unknown automation grade "${source?.automation}"`);
  if (!SOURCE_QUALITY.has(source?.quality)) problems.push(`unknown quality "${source?.quality}"`);
  if (Number.isNaN(Date.parse(source?.retrievedAt))) problems.push('retrievedAt must be a date');
  if (!Number.isFinite(source?.staleAfterDays) || source.staleAfterDays <= 0) problems.push('staleAfterDays must be positive');
  if (source?.checksum && !/^sha256:[a-f0-9]{64}$/.test(source.checksum)) problems.push('checksum must be sha256:<64 hex>');
  return problems;
}

export function validateSourceRegistry(sources = SOURCE_REGISTRY){
  const problems = [];
  const ids = new Set();
  for (const source of sources){
    if (ids.has(source.id)) problems.push(`${source.id}: duplicate id`);
    ids.add(source.id);
    problems.push(...validateSource(source).map(problem => `${source.id || '(missing id)'}: ${problem}`));
  }
  return problems;
}

