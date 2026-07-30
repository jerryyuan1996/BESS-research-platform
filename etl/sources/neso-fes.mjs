/* NESO FES structured-data connector and deterministic transformer.

   The shared ETL runner is currently optimized for time-series price feeds, so
   this module exposes a tested research-snapshot transformer without pretending
   a multi-metric planning table is a price series. A future runner adapter can
   publish its output under public/data/public/ without changing the extraction
   rules used by the dashboard. */
import { httpGetJson } from '../lib/fetch.mjs';

export const FES_RESOURCE = {
  supply: '6c78a777-b885-4bb6-bc35-8100f9e137a2',
  demand: '300c07b9-baeb-4411-bc40-987cbb4aec0b',
};

const API = 'https://api.neso.energy/api/3/action/datastore_search';
const YEARS = [2024, 2030, 2035];
const PATHWAY = 'Ten Year Forecast';

const num = (row, year) => {
  const value = Number(row?.[String(year)]);
  return Number.isFinite(value) ? value : 0;
};

function one(rows, predicate, name){
  const matches = rows.filter(predicate);
  if (matches.length !== 1) throw new Error(`FES ${name}: expected one row, found ${matches.length}`);
  return matches[0];
}

function values(row, divisor = 1){
  return YEARS.map(year => num(row, year) / divisor);
}

function capacity(rows, predicate){
  const matches = rows.filter(row =>
    row.Pathway === PATHWAY &&
    row.Variable === 'Capacity (MW)' &&
    predicate(row));
  if (matches.length === 0) throw new Error('FES capacity selector returned no rows');
  return YEARS.map(year => matches.reduce((sum, row) => sum + num(row, year), 0) / 1000);
}

export function transformFes2025({ supplyRows, demandRows }){
  if (!Array.isArray(supplyRows) || !Array.isArray(demandRows)){
    throw new Error('FES transform requires supplyRows and demandRows arrays');
  }

  const demandTotal = one(demandRows, row =>
    row.Pathway === PATHWAY &&
    row['Data item'] === 'GBFES System Demand: Total' &&
    row.Unit === 'GWh', 'total demand');
  const peak = one(demandRows, row =>
    row.Pathway === PATHWAY &&
    String(row['Data item']).trim() === 'GBFES Peak Customer Demand: Total Consumption plus Losses' &&
    row.Unit === 'GW', 'peak demand');
  const dataCentre = one(demandRows, row =>
    row.Pathway === PATHWAY &&
    row['Data item'] === 'Data Centre Demand' &&
    row.Unit === 'GWh', 'data-centre demand');

  return {
    pathway: PATHWAY,
    vintage: 'FES 2025',
    years: YEARS,
    demand: {
      totalGWh: values(demandTotal),
      peakGW: values(peak),
      dataCentreGWh: values(dataCentre),
    },
    capacity: {
      batteryNetworkGW: capacity(supplyRows, row =>
        row.Type === 'Battery' && row.Connection !== 'Distributed - Micro'),
      windGW: capacity(supplyRows, row =>
        row.Type === 'Onshore Wind' || row.Type === 'Offshore Wind'),
      solarGW: capacity(supplyRows, row => row.Type === 'Solar PV'),
      gasGW: capacity(supplyRows, row => row.Type === 'Gas'),
      nuclearGW: capacity(supplyRows, row => row.Type === 'Nuclear'),
      interconnectorGW: capacity(supplyRows, row => row.Type === 'Interconnectors'),
      ldesGW: capacity(supplyRows, row => row.Type === 'Long Duration Energy Storage'),
    },
  };
}

async function rowsFor(resourceId, log){
  const url = `${API}?resource_id=${encodeURIComponent(resourceId)}&limit=1000`;
  const payload = await httpGetJson(url, { log, retries: 3 });
  if (!payload?.success || !Array.isArray(payload?.result?.records)){
    throw new Error(`NESO FES resource ${resourceId}: invalid CKAN response`);
  }
  if (payload.result.total > payload.result.records.length){
    throw new Error(`NESO FES resource ${resourceId}: response truncated`);
  }
  return payload.result.records;
}

export async function fetchFes2025({ log = () => {} } = {}){
  const [supplyRows, demandRows] = await Promise.all([
    rowsFor(FES_RESOURCE.supply, log),
    rowsFor(FES_RESOURCE.demand, log),
  ]);
  return transformFes2025({ supplyRows, demandRows });
}

