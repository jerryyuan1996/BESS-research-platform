import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* The aggregator first: maps register themselves as market chunks load, and
   these assertions are properties of the whole COLLECTION. See
   src/markets/gridMapRegistry.all.js. */
import '../src/markets/gridMapRegistry.all.js';
import { allGridMaps } from '../src/markets/gridMapRegistry.js';
import {
  gridMapSources, validateGridMapCollection,
} from '../src/governance/gridMapSources.js';

test('every allocation dashboard has an investor-grade public-source grid map', () => {
  assert.equal(allGridMaps().length, 18);
  assert.deepEqual(
    allGridMaps().map(map => map.id),
    [
      'wa-grid-map', 'nem-grid-map', 'gb-grid-map', 'de-grid-map', 'it-grid-map',
      'ie-grid-map', 'ro-grid-map', 'pl-grid-map',
      'jp-tokyo-grid-map', 'jp-kyushu-grid-map', 'jp-hokkaido-grid-map',
      'pjm-grid-map', 'ercot-grid-map', 'caiso-grid-map', 'fi-grid-map', 'ca_on-grid-map', 'sa-grid-map', 'es-grid-map',
    ],
  );
  assert.deepEqual(validateGridMapCollection(allGridMaps()), []);
});

test('map source records are unique, public and future-refreshable', () => {
  const sources = gridMapSources(allGridMaps());
  const keys = sources.map(source => `${source.marketMapId}:${source.id}`);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(sources.length >= allGridMaps().length * 3);

  for (const map of allGridMaps()){
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
  assert.match(script, /allGridMaps()/);
  assert.doesNotMatch(script, /writeFile|appendFile|createWriteStream/);
  assert.equal(pkg.scripts['etl:verify:grid-maps'], 'node etl/verify-grid-map-sources.mjs');
});
