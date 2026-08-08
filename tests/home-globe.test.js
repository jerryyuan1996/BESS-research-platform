import test from 'node:test';
import assert from 'node:assert/strict';

import { MARKET_SECTORS } from '../src/home/marketSectorBoundaries.js';
import { REGIONS as JAPAN_REGIONS } from '../src/markets/jp/tabs.js';

test('the globe exposes US and Japan electricity markets as separate sectors', () => {
  const ids = MARKET_SECTORS.map(sector => sector.id).toSorted();
  assert.deepEqual(ids, [
    'caiso',
    'ercot',
    'jp_hokkaido',
    'jp_kyushu',
    'jp_tokyo',
    'pjm',
  ]);

  for (const sector of MARKET_SECTORS){
    assert.match(sector.route, /^\/markets\//, `${sector.id}: route`);
    assert.ok(
      sector.feature?.geometry?.type === 'Polygon'
        || sector.feature?.geometry?.type === 'MultiPolygon',
      `${sector.id}: drawable boundary`,
    );
  }
});

test('Japan offers individual regional lenses without a comparison control', () => {
  const ids = JAPAN_REGIONS.map(([id]) => id);
  assert.deepEqual(ids, ['tokyo', 'kyushu', 'hokkaido']);
});
