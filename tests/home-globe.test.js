import test from 'node:test';
import assert from 'node:assert/strict';
import { geoArea } from 'd3-geo';

import { MARKET_SECTORS } from '../src/home/marketSectorBoundaries.js';
import { d3Winding } from '../src/home/geoWinding.js';
import westernAustralia from '../src/markets/wa/wa-state-boundary.json' with { type:'json' };
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

/* The failure this guards against does not look like a missing shape. A ring
   wound the wrong way for d3-geo is read as its own complement, so the market
   covers the entire globe and every country underneath it disappears — which is
   what shipped when the US and Japan sectors were added and the winding helper
   reversed every ring unconditionally.

   geoArea returns steradians, so the whole sphere is 4π ≈ 12.57 and an inverted
   polygon lands just under it. No market on this platform covers more than a
   few hundredths of the Earth, so the two cases are nowhere near each other and
   the bound does not need to be tight to be decisive. */
const SPHERE = 4 * Math.PI;

test('every drawn boundary is a market, not an inverted ring covering the globe', () => {
  const shapes = [
    ...MARKET_SECTORS.map(sector => [sector.id, sector.feature]),
    ['wa', westernAustralia.features[0]],
  ];

  for (const [id, feature] of shapes){
    const area = geoArea(d3Winding(feature));
    assert.ok(area > 0, `${id}: boundary encloses nothing`);
    assert.ok(area < 0.1,
      `${id}: covers ${(area / SPHERE * 100).toFixed(1)}% of the globe — the ring is inverted`);
  }
});

test('winding is corrected by measurement, never applied blindly', () => {
  /* Both conventions are present in the repo's own boundary files, which is why
     an unconditional reversal cannot be right for both. */
  const wa = westernAustralia.features[0];               // ABS — RFC 7946 winding
  const sector = MARKET_SECTORS[0].feature;              // generated — d3 winding

  assert.ok(geoArea(wa) > SPHERE / 2, 'ABS ships the winding d3-geo reads inverted');
  assert.ok(geoArea(sector) < 0.1, 'the generated boundaries already ship d3 winding');

  // Idempotent: a feature already wound correctly must survive a second pass.
  const once = d3Winding(sector);
  assert.equal(geoArea(d3Winding(once)), geoArea(once));
});

test('Japan offers individual regional lenses without a comparison control', () => {
  const ids = JAPAN_REGIONS.map(([id]) => id);
  assert.deepEqual(ids, ['tokyo', 'kyushu', 'hokkaido']);
});
