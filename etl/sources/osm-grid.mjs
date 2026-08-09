/* ---------------------------------------------------------------------------
   OpenStreetMap transmission network, via the Overpass API.

   Open Infra Map is a renderer over OpenStreetMap, not a data source, and its
   own tile server carries no usage policy — so this connector goes to OSM
   directly and never touches openinframap.org.

   LICENCE. OpenStreetMap is ODbL: attribution to "© OpenStreetMap contributors"
   is required wherever this data is displayed, and share-alike attaches to a
   published derived database. The platform owner has accepted both for
   non-commercial personal study (2026-08-09). `LICENCE` below travels with every
   snapshot so the renderer cannot lose it.

   WHAT IT ASKS FOR. Each market's own definition of transmission, from
   src/governance/transmissionVoltage.js — there is no global threshold, because
   132 kV is transmission in Scotland and distribution in England, and 220 kV
   would reduce Western Australia's whole network to about a hundred segments.

   WHAT IT REFUSES TO DO. Publish a partial network. Overpass is a shared public
   endpoint with no SLA — a handful of probe queries on 2026-08-08 returned 429
   and 504 — and a half-fetched grid is worse than no grid: it looks like a
   sparse network rather than a failed download. Any market that errors fails the
   whole run rather than writing a thinner file than last time.
   --------------------------------------------------------------------------- */
import { httpGet, FetchError } from '../lib/fetch.mjs';
import { clipGridToMarket } from '../lib/geo.mjs';
import { TRANSMISSION_VOLTAGE } from '../../src/governance/transmissionVoltage.js';
import { gridMapForMarket } from '../../src/markets/gridMapRegistry.js';

const ENDPOINT = 'https://overpass-api.de/api/interpreter';

export const LICENCE = {
  id: 'odbl-1.0',
  name: 'Open Database Licence 1.0',
  attribution: '© OpenStreetMap contributors',
  url: 'https://www.openstreetmap.org/copyright',
  shareAlike: true,
  note: 'Accepted for non-commercial personal study. Attribution must be shown wherever the layer is drawn.',
};

/* Bounding boxes are south,west,north,east — Overpass's order, not GeoJSON's.
   Deliberately generous: a box that clips a market's network at the edge would
   publish a truncated grid, and the voltage filter does the real narrowing. */
export const MARKET_BBOX = {
  gb: [49.8, -8.3, 61.0, 1.9],
  ie: [51.3, -10.6, 55.5, -5.3],
  de: [47.2, 5.8, 55.1, 15.1],
  it: [35.4, 6.6, 47.2, 18.6],
  ro: [43.5, 20.2, 48.3, 29.8],
  pl: [48.9, 14.1, 55.0, 24.2],
  jp_tokyo: [34.5, 137.4, 37.2, 141.1],
  jp_kyushu: [30.9, 128.5, 34.8, 132.1],
  jp_hokkaido: [41.3, 139.3, 45.6, 146.0],
  wa: [-35.3, 112.8, -13.5, 129.2],
  nem: [-43.7, 129.0, -10.0, 154.0],
  pjm: [35.4, -89.6, 42.7, -73.8],
  ercot: [25.8, -106.8, 36.6, -93.4],
  caiso: [32.4, -124.6, 42.1, -114.0],
};

/**
 * A regex that MATCHES A SUPERSET of the levels at or above `minKV`.
 *
 * Deliberately a superset, and it matters that this is understood. OSM stores
 * voltage as a string and a line may carry several, semicolon separated
 * ("400000;220000"), so a numeric comparison in Overpass is unreliable. A regex
 * can only band by digit count and leading digit, which cannot separate 132 kV
 * from 110 kV — both are six digits starting with 1.
 *
 * So this narrows the transfer and `normalizeGrid` applies the EXACT threshold
 * afterwards, where real numbers are available and a multi-voltage line can be
 * judged on its highest level. Trying to make the regex exact is what produced
 * the first version of this function, which silently pulled 110 kV distribution
 * into Great Britain's 132 kV layer and 220 kV into CAISO's 230 kV layer.
 */
export function voltagePrefilter(minKV){
  const digits = String(Math.round(minKV * 1000)).length;
  const lead = String(Math.round(minKV * 1000))[0];
  const bands = [`[${lead}-9][0-9]{${digits - 1}}`];
  // Anything with more digits is unambiguously higher.
  for (let d = digits + 1; d <= 7; d++) bands.push(`[1-9][0-9]{${d - 1}}`);
  return `^(${bands.join('|')})$`;
}

/** The Overpass QL for one market at one voltage floor. */
export function queryFor(bbox, minKV){
  const bb = bbox.join(',');
  const v = `["voltage"~"${voltagePrefilter(minKV)}"]`;
  return [
    '[out:json][timeout:180];',
    '(',
    `  way[power=line]${v}(${bb});`,
    `  way[power=cable]${v}(${bb});`,
    ');',
    'out tags geom;',
    '(',
    `  way[power=substation]${v}(${bb});`,
    `  node[power=substation]${v}(${bb});`,
    ');',
    'out tags center;',
  ].join('\n');
}

const firstVoltageKV = (tags) => {
  const raw = String(tags?.voltage || '').split(';').map(Number).filter(Number.isFinite);
  return raw.length ? Math.max(...raw) / 1000 : null;
};

const round = (value) => Math.round(value * 10_000) / 10_000;

/* Simplification tolerance in degrees. A transmission line is drawn at national
   zoom on a 760px canvas, where 0.004° is well under a pixel — every vertex
   below that is repo weight and nothing else. PJM returns 15,026 line ways and
   an unsimplified snapshot is tens of megabytes, which is not a thing to put in
   a git history that exists to be diffed. */
export const SIMPLIFY_TOLERANCE = 0.004;

/**
 * Drop vertices closer than `tolerance` to the last kept one.
 *
 * Perpendicular-distance simplification (Douglas-Peucker) would be tidier, but
 * this is the routine scripts/refresh-grid-boundaries.mjs already uses for the
 * market boundaries, and a transmission line and a coastline want the same
 * treatment. Endpoints are always kept: a line that loses its last vertex stops
 * short of the substation it connects to.
 */
export function simplifyPath(path, tolerance = SIMPLIFY_TOLERANCE){
  if (!Array.isArray(path) || path.length <= 2) return path;
  const kept = [path[0]];
  let previous = path[0];
  for (let i = 1; i < path.length - 1; i++){
    const dx = path[i][0] - previous[0];
    const dy = path[i][1] - previous[1];
    if ((dx * dx) + (dy * dy) >= tolerance * tolerance){
      kept.push(path[i]);
      previous = path[i];
    }
  }
  kept.push(path[path.length - 1]);
  return kept;
}

/** Overpass elements → the shape the map layer draws. */
export function normalizeGrid(elements, { detailKV }){
  const lines = [];
  const substations = [];

  for (const el of elements || []){
    const kv = firstVoltageKV(el.tags);
    if (kv == null || kv < detailKV) continue;

    if (el.type === 'way' && Array.isArray(el.geometry)){
      lines.push({
        id: `w${el.id}`,
        kv,
        operator: el.tags.operator || null,
        name: el.tags.name || null,
        circuits: Number(el.tags.circuits) || null,
        underground: el.tags.power === 'cable' || el.tags.location === 'underground',
        path: simplifyPath(el.geometry.map(p => [round(p.lon), round(p.lat)])),
      });
    } else if (el.center || (el.type === 'node' && Number.isFinite(el.lat))){
      const lon = el.center ? el.center.lon : el.lon;
      const lat = el.center ? el.center.lat : el.lat;
      substations.push({
        id: `${el.type[0]}${el.id}`,
        kv,
        name: el.tags.name || null,
        operator: el.tags.operator || null,
        coord: [round(lon), round(lat)],
      });
    }
  }

  return { lines, substations };
}

async function overpass(query, { log } = {}){
  const response = await httpGet(ENDPOINT, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
    timeoutMs: 190_000,
    /* Overpass rate-limits hard and the shared library already backs off on 429
       and 5xx. Five attempts rather than the default three because the failure
       is usually load, not the request. */
    retries: 5,
    log,
  });
  return response.json();
}

/**
 * Fetch one market's transmission network.
 *
 * Throws rather than returning a partial result — see the header.
 */
export async function fetchMarketGrid(marketId, { log = () => {} } = {}){
  const bbox = MARKET_BBOX[marketId];
  const definition = TRANSMISSION_VOLTAGE[marketId];
  if (!bbox) throw new Error(`osm-grid: no bounding box declared for ${marketId}`);
  if (!definition) throw new Error(`osm-grid: no transmission definition for ${marketId}`);

  log(`osm-grid ${marketId}: requesting ≥${definition.detailKV} kV`);
  let payload;
  try {
    payload = await overpass(queryFor(bbox, definition.detailKV), { log });
  } catch (error){
    /* Named explicitly so a run that fails here is not mistaken for a market
       that genuinely has no transmission network at this voltage. */
    throw new FetchError(
      `osm-grid ${marketId}: Overpass did not return a complete network (${error.message}). `
      + 'Refusing to publish a partial grid.',
      { url: ENDPOINT, status: error.status ?? null, retryable: true });
  }

  const raw = normalizeGrid(payload.elements, { detailKV: definition.detailKV });

  /* The bounding box is a rectangle and the market is not. Poland's box reaches
     into Brandenburg, Great Britain's contains Ireland — so everything is cut to
     the market's own boundary before it is returned. See etl/lib/geo.mjs. */
  const boundary = gridMapForMarket(marketId)?.boundary;
  if (!boundary) throw new Error(`osm-grid ${marketId}: no boundary to clip against`);
  const { lines, substations, dropped } = clipGridToMarket(raw, boundary);

  /* A market with a declared transmission definition has a transmission network.
     Zero lines means the query failed silently or the bbox is wrong — either
     way it is a bug, not a finding. */
  if (!lines.length){
    throw new Error(`osm-grid ${marketId}: returned no lines at ≥${definition.detailKV} kV — check the bbox and threshold`);
  }

  log(`osm-grid ${marketId}: ${lines.length} lines, ${substations.length} substations`
    + ` (dropped ${dropped.lines} lines, ${dropped.substations} substations outside the market)`);
  return {
    marketId,
    licence: LICENCE,
    bulkKV: definition.bulkKV,
    detailKV: definition.detailKV,
    operator: definition.operator,
    lines,
    substations,
    droppedOutsideMarket: dropped,
  };
}
