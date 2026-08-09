/* ---------------------------------------------------------------------------
   Battery storage projects from OpenStreetMap, via Overpass.

   Admissible for ONE market. Ireland's OSM coverage was measured on 2026-08-09
   at 26 plants totalling 1,039 MW against the roughly 1 GW ESB Networks reports
   as available on the network — effectively the whole fleet, and better than
   EirGrid's own lists, which are PDFs with no storage flag and no coordinates.

   The same measurement disqualified everywhere else: Italy 11 plants against a
   fleet MACSE alone is adding 1,491 MW to, Poland 4, Japan one, Romania one.
   `VERIFIED_STORAGE_MARKETS` in the governance registry is the gate, and this
   connector refuses any market that is not on it — so nobody can point it at
   Poland and quietly publish four batteries as a national pipeline.

   LICENCE: ODbL. Attribution travels with the data, as it does for the grid.
   --------------------------------------------------------------------------- */
import { httpGet, FetchError } from '../lib/fetch.mjs';
import { clipProjectsToMarket } from '../lib/geo.mjs';
import { MARKET_BBOX, LICENCE } from './osm-grid.mjs';
import { gridMapForMarket } from '../../src/markets/gridMapRegistry.js';
import { PIPELINE_SOURCES } from '../../src/governance/projectPipelineSources.js';
import { PROJECT_STAGE, PROJECT_TECHNOLOGY } from '../../src/projects/schema.js';

const ENDPOINT = 'https://overpass-api.de/api/interpreter';

export { LICENCE };

/** Markets this connector is allowed to run for. */
export const OSM_STORAGE_MARKETS =
  Object.keys(PIPELINE_SOURCES).filter(id => PIPELINE_SOURCES[id].storage?.id === 'osm-storage');

/**
 * "100 MW", "50.5 megawatts", "2 GW" → megawatts.
 * Returns null rather than guessing: an unparseable tag is missing data.
 */
export function parsePower(value){
  const match = String(value ?? '').match(/([\d.]+)\s*(k|M|G)?\s*W(?!h)/i);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  const unit = (match[2] || 'M').toUpperCase();
  return unit === 'K' ? n / 1000 : unit === 'G' ? n * 1000 : n;
}

/** "25 MWh", "1.5 GWh" → megawatt-hours, or null. */
export function parseEnergy(value){
  const match = String(value ?? '').match(/([\d.]+)\s*(k|M|G)\s*Wh/i);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  const unit = match[2].toUpperCase();
  return unit === 'K' ? n / 1000 : unit === 'G' ? n * 1000 : n;
}

/* OSM records what exists and what is being built, and nothing about consenting
   or queueing — which suits this platform, because a queue is not a pipeline.
   An untagged plant is treated as operating: it is on the map because a surveyor
   saw it. `construction:power` and lifecycle prefixes say otherwise. */
export function stageOf(tags){
  if (tags['construction:power'] || tags.construction === 'yes') return PROJECT_STAGE.UNDER_CONSTRUCTION;
  if (tags['proposed:power'] || tags.proposed === 'yes') return PROJECT_STAGE.ANNOUNCED;
  return PROJECT_STAGE.OPERATING;
}

const slug = (value, fallback) => {
  const s = String(value ?? '').toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return s || fallback;
};

/**
 * Overpass elements → canonical project records (src/projects/schema.js).
 *
 * @param {object[]} elements
 * @param {object} ctx  { marketId, evidenceDate }
 */
export function normalizeStorage(elements, { marketId, evidenceDate }){
  const projects = [];

  for (const el of elements || []){
    const tags = el.tags || {};
    const lon = el.center ? el.center.lon : el.lon;
    const lat = el.center ? el.center.lat : el.lat;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

    const powerMW = parsePower(tags['plant:output:electricity']);
    /* No power rating, no project. A battery of unknown size cannot be summed
       into a cluster label and would make every total on the page wrong. */
    if (!Number.isFinite(powerMW) || powerMW <= 0) continue;

    const energyMWh = parseEnergy(tags['plant:storage']);

    projects.push({
      id: `${marketId}-osm-${el.type[0]}${el.id}`,
      marketId,
      name: tags.name || `Unnamed battery (OSM ${el.type}/${el.id})`,
      technology: PROJECT_TECHNOLOGY.STORAGE,
      stage: stageOf(tags),
      statusRaw: tags['construction:power'] ? 'construction' : 'operational (OSM)',
      capacityMW: powerMW,
      /* Duration rather than MWh, because the schema derives energy from hours
         and a record must not be able to carry two disagreeing numbers. */
      durationHours: energyMWh != null ? energyMWh / powerMW : null,
      operator: tags.operator || null,
      lon: Math.round(lon * 10_000) / 10_000,
      lat: Math.round(lat * 10_000) / 10_000,
      /* OSM records no commissioning date. `start_date` exists but is rare and
         often the survey date rather than COD, so it is not read: a wrong COD is
         worse than an absent one. */
      expectedCod: null,
      sourceIds: ['osm-storage'],
      evidenceDate,
    });
  }

  /* Deterministic order so a re-fetch that returns the same fleet produces the
     same file and the envelope checksum does not churn. */
  return projects.sort((a, b) => a.id.localeCompare(b.id));
}

/** Fetch one market's mapped battery fleet. */
export async function fetchMarketStorage(marketId, { log = () => {}, evidenceDate } = {}){
  if (!OSM_STORAGE_MARKETS.includes(marketId)){
    throw new Error(
      `osm-storage: ${marketId} is not a verified OpenStreetMap storage market. `
      + `Coverage was measured and rejected — see src/governance/projectPipelineSources.js.`);
  }
  const bbox = MARKET_BBOX[marketId];
  if (!bbox) throw new Error(`osm-storage: no bounding box for ${marketId}`);

  const bb = bbox.join(',');
  const query = [
    '[out:json][timeout:180];',
    '(',
    `  way[power=plant]["plant:source"=battery](${bb});`,
    `  relation[power=plant]["plant:source"=battery](${bb});`,
    ');',
    'out tags center;',
  ].join('\n');

  let payload;
  try {
    const response = await httpGet(ENDPOINT, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      timeoutMs: 190_000,
      retries: 5,
      log,
    });
    payload = await response.json();
  } catch (error){
    throw new FetchError(
      `osm-storage ${marketId}: Overpass did not return a complete fleet (${error.message}). `
      + 'Refusing to publish a partial pipeline.',
      { url: ENDPOINT, status: error.status ?? null, retryable: true });
  }

  const all = normalizeStorage(payload.elements, {
    marketId,
    evidenceDate: evidenceDate || new Date().toISOString().slice(0, 10),
  });
  const boundary = gridMapForMarket(marketId)?.boundary;
  if (!boundary) throw new Error(`osm-storage ${marketId}: no boundary to clip against`);
  const { projects, dropped } = clipProjectsToMarket(all, boundary);

  /* The coverage figure that admitted this market is a claim about a fleet size.
     If the fetch comes back far below it, the source has degraded or the query
     broke, and publishing would quietly shrink a market's pipeline. */
  const expected = PIPELINE_SOURCES[marketId]?.storage?.coverage;
  if (expected?.plants && projects.length < expected.plants * 0.6){
    throw new Error(
      `osm-storage ${marketId}: ${projects.length} plants against ${expected.plants} measured on `
      + `${expected.measuredOn}. Coverage has dropped by more than 40% — re-verify before publishing.`);
  }

  log(`osm-storage ${marketId}: ${projects.length} projects (dropped ${dropped} outside the market)`);
  return { marketId, licence: LICENCE, projects, droppedOutsideMarket: dropped };
}
