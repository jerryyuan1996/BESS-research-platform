/* ---------------------------------------------------------------------------
   Market map boundaries, extracted from the vendored world-atlas TopoJSON.

   Ireland, Romania and Poland took their outlines from Eurostat GISCO over the
   network. Germany, Italy and the NEM take theirs from `world-atlas`, which is
   already a dependency of this project — the home-page globe renders from the
   same file. That means these boundaries regenerate offline and carry the same
   attribution the globe already shows: Natural Earth, via world-atlas.

   The maps are declared "representative national orientation only", so 110m
   resolution is the right resolution: a finer outline would imply a precision
   the markers on top of it do not have.

       npm run refresh:market-boundaries

   Re-run only when world-atlas is upgraded. The output is committed.
   --------------------------------------------------------------------------- */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/* ISO 3166-1 numeric ids, which is how Natural Earth keys its country features.
   The NEM covers the eastern and southern Australian states rather than the
   whole continent; the outline is the country and the market's extent is carried
   by `viewBounds` on its map, exactly as WA's map narrows to one state. */
const TARGETS = [
  { id: 276, out: 'src/markets/de/de-boundary.json', name: 'Germany' },
  { id: 380, out: 'src/markets/it/it-boundary.json', name: 'Italy' },
  { id: 36, out: 'src/markets/nem/au-boundary.json', name: 'Australia' },
];

const round = (n, dp = 3) => Number(n.toFixed(dp));
const roundRing = (ring) => ring.map(([x, y]) => [round(x), round(y)]);
const roundGeometry = (geometry) => {
  if (geometry.type === 'Polygon'){
    return { ...geometry, coordinates: geometry.coordinates.map(roundRing) };
  }
  if (geometry.type === 'MultiPolygon'){
    return { ...geometry, coordinates: geometry.coordinates.map(p => p.map(roundRing)) };
  }
  return geometry;
};

const atlasPath = resolve(ROOT, 'node_modules/world-atlas/countries-110m.json');
const atlas = JSON.parse(await readFile(atlasPath, 'utf8'));
const countries = feature(atlas, atlas.objects.countries).features;

for (const target of TARGETS){
  const match = countries.find(c => Number(c.id) === target.id);
  if (!match) throw new Error(`${target.name}: no feature with id ${target.id} in world-atlas`);

  const out = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { name: target.name, source: 'Natural Earth 110m via world-atlas' },
      geometry: roundGeometry(match.geometry),
    }],
  };

  const path = resolve(ROOT, target.out);
  await writeFile(path, JSON.stringify(out) + '\n');
  const rings = out.features[0].geometry.type === 'Polygon'
    ? 1 : out.features[0].geometry.coordinates.length;
  console.log(`${target.name.padEnd(10)} → ${target.out}  (${rings} polygon${rings === 1 ? '' : 's'})`);
}
