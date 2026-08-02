import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { GRID_MAPS } from '../src/markets/gridMapRegistry.js';
import {
  gridMapSources, validateGridMapCollection,
} from '../src/governance/gridMapSources.js';

test('every allocation dashboard has an investor-grade public-source grid map', () => {
  assert.equal(GRID_MAPS.length, 11);
  assert.deepEqual(
    GRID_MAPS.map(map => map.id),
    [
      'wa-grid-map', 'nem-grid-map', 'gb-grid-map', 'de-grid-map', 'it-grid-map',
      'ie-grid-map', 'ro-grid-map', 'pl-grid-map',
      'jp-tokyo-grid-map', 'jp-kyushu-grid-map', 'jp-hokkaido-grid-map',
    ],
  );
  assert.deepEqual(validateGridMapCollection(GRID_MAPS), []);
});

test('map source records are unique, public and future-refreshable', () => {
  const sources = gridMapSources(GRID_MAPS);
  const keys = sources.map(source => `${source.marketMapId}:${source.id}`);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(sources.length >= GRID_MAPS.length * 3);

  for (const map of GRID_MAPS){
    assert.ok(map.sourceCatalog.some(source => ['A', 'B'].includes(source.automation)),
      `${map.id}: at least one structured/downloadable source is required`);
    const catalogUrls = new Set(map.sourceCatalog.map(source => source.url));
    for (const item of [...map.points, ...map.routes]){
      assert.ok(catalogUrls.has(item.sourceUrl), `${map.id}/${item.id}: source is outside the refresh register`);
    }
  }
});

test('the repository exposes a read-only reachability checker for map sources', async () => {
  const script = await readFile(new URL('../etl/verify-grid-map-sources.mjs', import.meta.url), 'utf8');
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(script, /method,\s*redirect:'follow'/);
  assert.match(script, /GRID_MAPS/);
  assert.doesNotMatch(script, /writeFile|appendFile|createWriteStream/);
  assert.equal(pkg.scripts['etl:verify:grid-maps'], 'node etl/verify-grid-map-sources.mjs');
});
