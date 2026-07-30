import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE_FILES = {
  ireland: 'NUTS_RG_01M_2021_4326.geojson',
  wa: 'wa-regions.geojson',
  perth: 'abs-perth.geojson',
  waState: 'abs-wa-state.geojson',
};
const SOURCES = {
  ireland: 'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_01M_2021_4326.geojson',
  wa: 'https://services.slip.wa.gov.au/public/rest/services/SLIP_Public_Services/Boundaries_WFS/MapServer/28/query?where=1%3D1&outFields=region&outSR=4326&geometryPrecision=3&f=geojson',
  perth: "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/GCCSA/MapServer/0/query?where=gccsa_name_2021%3D%27Greater%20Perth%27&outFields=gccsa_code_2021,gccsa_name_2021&outSR=4326&geometryPrecision=3&f=geojson",
  waState: "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/STE/FeatureServer/1/query?where=state_code_2021%3D%275%27&outFields=state_code_2021%2Cstate_name_2021&returnGeometry=true&outSR=4326&maxAllowableOffset=0.05&geometryPrecision=3&f=geojson",
};

const cacheFlag = process.argv.indexOf('--cache-dir');
const cacheDir = cacheFlag >= 0 ? process.argv[cacheFlag + 1] : null;

async function sourceJson(key){
  if (cacheDir){
    return JSON.parse(await readFile(resolve(cacheDir, CACHE_FILES[key]), 'utf8'));
  }
  const response = await fetch(SOURCES[key], { headers:{ accept:'application/geo+json,application/json' } });
  if (!response.ok) throw new Error(`${key} boundary fetch failed: HTTP ${response.status}`);
  return response.json();
}

function distanceSquared(a, b){
  return ((a[0] - b[0]) ** 2) + ((a[1] - b[1]) ** 2);
}

function rounded(point){
  return point.map(value => Math.round(value * 10_000) / 10_000);
}

function simplifyRing(ring, tolerance){
  if (ring.length < 5) return ring.map(rounded);
  const kept = [ring[0]];
  let previous = ring[0];
  for (let index = 1; index < ring.length - 1; index += 1){
    if (distanceSquared(ring[index], previous) >= tolerance ** 2){
      kept.push(ring[index]);
      previous = ring[index];
    }
  }
  kept.push(kept[0]);
  return (kept.length >= 4 ? kept : ring).map(rounded);
}

function simplifyGeometry(geometry, tolerance){
  const simplifyPolygon = polygon => polygon.map(ring => simplifyRing(ring, tolerance));
  return {
    ...geometry,
    coordinates:geometry.type === 'Polygon'
      ? simplifyPolygon(geometry.coordinates)
      : geometry.coordinates.map(simplifyPolygon),
  };
}

function bboxArea(ring){
  const xs = ring.map(point => point[0]);
  const ys = ring.map(point => point[1]);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

function filterSmallPolygons(geometry, minArea){
  if (geometry.type !== 'MultiPolygon') return geometry;
  return {
    ...geometry,
    coordinates:geometry.coordinates.filter(polygon => bboxArea(polygon[0]) > minArea),
  };
}

function feature(feature, tolerance, properties){
  return {
    type:'Feature',
    properties:Object.fromEntries(properties.map(key => [key, feature.properties[key]])),
    geometry:simplifyGeometry(feature.geometry, tolerance),
  };
}

async function writeCollection(relativePath, features){
  const output = resolve(ROOT, relativePath);
  const allowedRoot = resolve(ROOT, 'src', 'markets');
  if (!output.startsWith(`${allowedRoot}\\`) && !output.startsWith(`${allowedRoot}/`)){
    throw new Error(`Refusing to write outside src/markets: ${output}`);
  }
  await writeFile(output, `${JSON.stringify({ type:'FeatureCollection', features })}\n`, 'utf8');
  console.log(`Updated ${relativePath} (${features.length} features)`);
}

const [nuts, waRegions, perth, waState] = await Promise.all([
  sourceJson('ireland'),
  sourceJson('wa'),
  sourceJson('perth'),
  sourceJson('waState'),
]);

const irelandFeatures = nuts.features
  .filter(item => ['IE', 'UKN'].includes(item.properties.NUTS_ID))
  .map(item => feature(item, 0.012, ['NUTS_ID', 'NAME_LATN', 'NAME_ENGL']));

const swisRegions = new Set(['Great Southern', 'South West', 'Wheatbelt', 'Peel', 'Mid West']);
const waFeatures = [
  ...waRegions.features
    .filter(item => swisRegions.has(item.properties.region))
    .map(item => feature(item, 0.02, ['region'])),
  ...perth.features.map(item => feature(item, 0.008, ['gccsa_code_2021', 'gccsa_name_2021'])),
];

const waStateFeatures = waState.features.map(item => {
  const simplified = feature(item, 0.15, ['state_code_2021', 'state_name_2021']);
  return {
    ...simplified,
    geometry:filterSmallPolygons(simplified.geometry, 0.02),
  };
});

await Promise.all([
  writeCollection('src/markets/ie/ireland-sem-boundary.json', irelandFeatures),
  writeCollection('src/markets/wa/wa-swis-context-boundary.json', waFeatures),
  writeCollection('src/markets/wa/wa-state-boundary.json', waStateFeatures),
]);
