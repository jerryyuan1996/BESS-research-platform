/* ---------------------------------------------------------------------------
   The OSM transmission connector, without the network.

   The threshold logic is the part that can be wrong silently. A voltage filter
   that is slightly too generous puts distribution lines on a transmission map,
   and nothing about the result looks broken — Great Britain would simply appear
   to have a far denser 132 kV network than it does, because 110 kV would be in
   it. So the superset property and the exact cut are asserted separately.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  voltagePrefilter, normalizeGrid, queryFor, MARKET_BBOX, LICENCE,
} from '../etl/sources/osm-grid.mjs';
import { TRANSMISSION_VOLTAGE } from '../src/governance/transmissionVoltage.js';

const LEVELS = [66, 110, 132, 138, 154, 161, 220, 230, 275, 345, 400, 500, 765];

test('the prefilter never drops a level that should be transferred', () => {
  /* Superset is the contract. Missing a qualifying level would silently truncate
     a market's network; transferring a few extra is only bandwidth. */
  for (const definition of Object.values(TRANSMISSION_VOLTAGE)){
    const re = new RegExp(voltagePrefilter(definition.detailKV));
    for (const kv of LEVELS.filter(v => v >= definition.detailKV)){
      assert.ok(re.test(String(kv * 1000)),
        `${definition.detailKV} kV filter must transfer ${kv} kV`);
    }
  }
});

test('the exact threshold is applied after transfer, not by the regex', () => {
  /* 110 and 132 kV are both six digits starting with 1, so no regex separates
     them. This is the assertion that stops someone "simplifying" the two-stage
     filter back into one. */
  const re = new RegExp(voltagePrefilter(132));
  assert.ok(re.test('110000'), 'the regex alone cannot exclude 110 kV — by design');

  const { lines } = normalizeGrid([
    way(1, '110000'), way(2, '132000'), way(3, '400000'),
  ], { detailKV: 132 });

  assert.deepEqual(lines.map(l => l.kv), [132, 400], '110 kV must be dropped after transfer');
});

test('a multi-voltage line is judged on its highest level', () => {
  // A 400/132 kV tower carries transmission and belongs on the map.
  const { lines } = normalizeGrid([way(1, '400000;132000')], { detailKV: 275 });
  assert.equal(lines.length, 1);
  assert.equal(lines[0].kv, 400);
});

test('an untagged or unparseable voltage is dropped, never assumed', () => {
  const { lines } = normalizeGrid([
    way(1, undefined), way(2, ''), way(3, 'unknown'), way(4, '400000'),
  ], { detailKV: 132 });
  assert.deepEqual(lines.map(l => l.id), ['w4']);
});

test('substations come back as points and lines as paths', () => {
  const { lines, substations } = normalizeGrid([
    way(1, '400000'),
    { type:'node', id:9, lat:53.15, lon:-7.16, tags:{ power:'substation', voltage:'220000', operator:'EirGrid' } },
    { type:'way', id:10, center:{ lat:53.2, lon:-7.2 }, tags:{ power:'substation', voltage:'400000' } },
  ], { detailKV: 132 });

  assert.equal(lines.length, 1);
  assert.ok(Array.isArray(lines[0].path) && lines[0].path.length === 2);
  assert.equal(substations.length, 2);
  assert.deepEqual(substations[0].coord, [-7.16, 53.15]);
  assert.equal(substations[0].operator, 'EirGrid');
});

test('underground cable is distinguishable from overhead line', () => {
  const { lines } = normalizeGrid([
    { type:'way', id:5, tags:{ power:'cable', voltage:'400000' }, geometry:[{lon:0,lat:0},{lon:1,lat:1}] },
  ], { detailKV: 132 });
  assert.equal(lines[0].underground, true);
});

test('every market with a transmission definition has a bounding box', () => {
  for (const id of Object.keys(TRANSMISSION_VOLTAGE)){
    const bbox = MARKET_BBOX[id];
    assert.ok(bbox, `${id}: no bounding box`);
    const [s, w, n, e] = bbox;
    assert.ok(s < n && w < e, `${id}: bounding box is inside out`);
    assert.ok(s >= -90 && n <= 90 && w >= -180 && e <= 180, `${id}: bounding box leaves the planet`);
  }
});

test('the query is well formed Overpass QL', () => {
  /* The first version omitted the brackets around the voltage filter and every
     request came back 400. Cheap to assert, and the failure was invisible until
     the endpoint rejected it. */
  const query = queryFor(MARKET_BBOX.ie, 110);
  assert.match(query, /\[power=line\]\["voltage"~/, 'tag filters must be bracketed');
  assert.match(query, /^\[out:json\]\[timeout:\d+\];/);
  assert.match(query, /out tags geom;/);
  assert.equal((query.match(/\(/g) || []).length, (query.match(/\)/g) || []).length, 'unbalanced parentheses');
});

test('the ODbL terms travel with the data', () => {
  // Share-alike and attribution are obligations, so they cannot live only in a doc.
  assert.equal(LICENCE.shareAlike, true);
  assert.match(LICENCE.attribution, /OpenStreetMap contributors/);
  assert.ok(LICENCE.url.startsWith('https://'));
});

function way(id, voltage){
  return {
    type: 'way', id,
    tags: { power: 'line', ...(voltage === undefined ? {} : { voltage }) },
    geometry: [{ lon: 0, lat: 0 }, { lon: 1, lat: 1 }],
  };
}
