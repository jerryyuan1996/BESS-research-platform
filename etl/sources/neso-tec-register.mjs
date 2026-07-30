/* NESO TEC Register connector and normalized BESS competition view.

   The output deliberately preserves source gaps. In particular, no duration or
   MWh is synthesized because the register contains neither field. */
import { httpGetJson } from '../lib/fetch.mjs';

export const TEC_RESOURCE_ID = '17becbab-e3e8-473f-b303-3806f43a6a10';
const API = 'https://api.neso.energy/api/3/action/datastore_search';

const capacityOf = row => {
  for (const field of ['Cumulative Total Capacity (MW)', 'MW Connected', 'MW Increase / Decrease']){
    const value = Number(row?.[field]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return 0;
};

const yearOf = row => {
  const match = String(row?.['MW Effective From'] || '').match(/^(\d{4})-/);
  return match ? Number(match[1]) : null;
};

const projectKey = row => row?.['Project ID'] || row?.['Project Number'] || row?.['Project Name'];

export function deliveryWeight(row){
  if (row?.['Project Status'] === 'Under Construction/Commissioning') return 0.90;
  if (String(row?.Gate) === '2' && row?.['Project Status'] === 'Consents Approved') return 0.60;
  if (String(row?.Gate) === '2') return 0.45;
  if (String(row?.Gate) === '1') return 0.25;
  return 0.20;
}

export function normalizeTecRegister(rows, { fromYear = 2026 } = {}){
  if (!Array.isArray(rows)) throw new Error('TEC transform requires an array');

  const exactEss = rows.filter(row => String(row?.['Plant Type'] || '').trim() === 'Energy Storage System');
  const deduped = new Map();
  for (const row of exactEss){
    const key = projectKey(row);
    if (!key) continue;
    const previous = deduped.get(key);
    const capacity = capacityOf(row);
    const previousCapacity = previous ? capacityOf(previous) : -1;
    const date = String(row?.['MW Effective From'] || '');
    const previousDate = String(previous?.['MW Effective From'] || '');
    if (!previous || capacity > previousCapacity || (capacity === previousCapacity && date > previousDate)){
      deduped.set(key, row);
    }
  }

  const projects = [...deduped.values()].map(row => ({
    sourceProjectId: row['Project ID'] || null,
    projectNumber: row['Project Number'] || null,
    name: row['Project Name'],
    owner: row['Customer Name'] || null,
    connectionSite: row['Connection Site'] || null,
    hostTO: row['HOST TO'] || null,
    capacityMW: capacityOf(row),
    expectedCod: row['MW Effective From'] || null,
    codYear: yearOf(row),
    status: row['Project Status'] || null,
    gate: row.Gate == null || row.Gate === '' ? null : String(row.Gate),
    durationHours: null,
  }));

  const built = projects.filter(project => project.status === 'Built');
  const forward = projects.filter(project =>
    project.status !== 'Built' &&
    Number.isInteger(project.codYear) &&
    project.codYear >= fromYear);
  const years = [...new Set(forward.map(project => project.codYear))].sort((a, b) => a - b);
  const aggregate = predicate => years.map(year =>
    Math.round(forward
      .filter(project => project.codYear === year && predicate(project))
      .reduce((sum, project) => sum + project.capacityMW, 0) * 10) / 10);
  const weighted = years.map(year =>
    Math.round(forward
      .filter(project => project.codYear === year)
      .reduce((sum, project) => sum + project.capacityMW * deliveryWeight({
        'Project Status': project.status,
        Gate: project.gate,
      }), 0) * 10) / 10);

  return {
    sourceRecords: rows.length,
    exactEssRows: exactEss.length,
    uniqueProjects: projects.length,
    durationCoveragePct: 0,
    builtMW: Math.round(built.reduce((sum, project) => sum + project.capacityMW, 0) * 10) / 10,
    forwardMW: Math.round(forward.reduce((sum, project) => sum + project.capacityMW, 0) * 10) / 10,
    years,
    rawMW: aggregate(() => true),
    gate2MW: aggregate(project => project.gate === '2'),
    gate1MW: aggregate(project => project.gate === '1'),
    gateUnpopulatedMW: aggregate(project => project.gate === null),
    analystWeightedMW: weighted,
    projects,
  };
}

export async function fetchTecRegister({ log = () => {} } = {}){
  const url = `${API}?resource_id=${encodeURIComponent(TEC_RESOURCE_ID)}&limit=10000`;
  const payload = await httpGetJson(url, { log, retries: 3 });
  if (!payload?.success || !Array.isArray(payload?.result?.records)){
    throw new Error('NESO TEC Register: invalid CKAN response');
  }
  if (payload.result.total > payload.result.records.length){
    throw new Error('NESO TEC Register: response truncated');
  }
  return normalizeTecRegister(payload.result.records);
}

