/* ---------------------------------------------------------------------------
   The congestion layer's contract.

   The register makes a claim the rest of this platform does not: that a revenue
   opportunity has an end date. That claim is only worth publishing if three
   things hold, and they are what this file asserts.

     SOURCED     every constraint, every measurement and every relief project
                 carries a public HTTPS source, like every other number here
     BOUNDED     every constraint names how a battery is paid, from a controlled
                 vocabulary — a constraint with no mechanism is a fact, not an
                 opportunity
     JOINED      the map layer, the per-market table and the home-page comparison
                 all read the same register, so they cannot disagree
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, comparableMarkets } from '../src/markets/registry.js';
import {
  CONGESTION_REGISTERS, congestionFor, congestionForDashboard, allZones,
} from '../src/markets/congestionRegistry.js';
import { GRID_MAPS, gridMapForMarket, gridMapById } from '../src/markets/gridMapRegistry.js';
import {
  validateCongestionCollection, CAPTURE, CAPTURE_LABEL, CAPTURE_PAYS, CAPTURE_FLOW, CAPTURE_FLOW_LABEL,
  RELIEF_STATUS, RELIEF_STATUS_LABEL, reliefRunway, HORIZON_YEAR,
} from '../src/governance/congestion.js';
import { LAB_FIELDS } from '../src/comparison/ranges.js';

const FROM = 2026;

test('every congestion register is structurally valid and publicly sourced', () => {
  assert.deepEqual(validateCongestionCollection(CONGESTION_REGISTERS), []);
});

test('every allocation market has a congestion register', () => {
  for (const m of comparableMarkets()){
    const register = congestionFor(m.manifest.id);
    assert.ok(register, `${m.manifest.id}: no congestion register — it would be absent from the home comparison`);
    assert.ok(register.zones.length, `${m.manifest.id}: register has no zones`);
  }
});

test('a constraint always states how a battery is paid, and whether it pays at all', () => {
  for (const zone of allZones()){
    const mechanism = zone.capture.mechanism;
    assert.ok(Object.values(CAPTURE).includes(mechanism),
      `${zone.id}: mechanism outside the vocabulary`);
    assert.ok(CAPTURE_LABEL[mechanism], `${zone.id}: mechanism has no label`);
    assert.ok(['pays', 'charges', 'neither'].includes(CAPTURE_FLOW[mechanism]),
      `${zone.id}: mechanism does not declare which way the money runs`);
    assert.ok(CAPTURE_FLOW_LABEL[CAPTURE_FLOW[mechanism]],
      `${zone.id}: money-flow direction has no label`);
    assert.equal(CAPTURE_PAYS[mechanism], CAPTURE_FLOW[mechanism] === 'pays',
      `${zone.id}: CAPTURE_PAYS must stay derived from CAPTURE_FLOW, not maintained separately`);
  }
});

/* Three directions, and each one has to be exercised by a real market or the
   distinction is decoration:

     charges   Romania prices congestion at the connection auction, so the
               developer pays it before the asset exists
     neither   the NEM holds no firm transmission rights and killed the
               Congestion Relief Market, so a constrained battery gets nothing

   If either disappears, the vocabulary has drifted ahead of the evidence. */
test('every money-flow direction is exercised by a real market', () => {
  const zones = allZones();
  const byFlow = (flow) => zones.filter(z => CAPTURE_FLOW[z.capture.mechanism] === flow);

  assert.ok(byFlow('pays').length, 'no market pays for congestion relief');
  assert.ok(byFlow('charges').some(z => z.marketId === 'ro'),
    'Romania allocates connections by auction and should be a charging market');
});

test('every constraint names what ends it, including when the answer is nothing', () => {
  for (const zone of allZones()){
    assert.ok(zone.relief, `${zone.id}: no relief entry`);
    assert.ok(Object.values(RELIEF_STATUS).includes(zone.relief.status), `${zone.id}: invalid relief status`);
    assert.ok(RELIEF_STATUS_LABEL[zone.relief.status], `${zone.id}: relief status has no label`);
    if (zone.relief.expected != null){
      assert.ok(zone.relief.expected > FROM - 20 && zone.relief.expected < HORIZON_YEAR,
        `${zone.id}: relief year ${zone.relief.expected} is implausible`);
    }
  }
});

test('runway is years to the published commissioning year, and null when there is none', () => {
  const gb = congestionFor('gb');
  const b6 = gb.zones.find(z => z.id === 'gb-b6');
  assert.equal(b6.relief.expected, 2029);
  assert.equal(reliefRunway(b6, 2026), 3);
  assert.equal(reliefRunway(b6, 2029), 0, 'a relieved constraint has no runway left, not a negative one');
  assert.equal(reliefRunway(b6, 2031), 0);

  const open = allZones().find(z => z.relief.expected == null);
  assert.ok(open, 'expected at least one constraint with no committed relief date');
  assert.equal(reliefRunway(open, 2026), null);
});

test('a constraint that bears on an assumption names a field the Lab actually renders', () => {
  const known = new Set(LAB_FIELDS.map(f => f.key));
  for (const zone of allZones()){
    if (zone.bearsOn == null) continue;
    assert.ok(known.has(zone.bearsOn),
      `${zone.id}: bearsOn "${zone.bearsOn}" is not a field the Investment Lab renders`);
    const market = markets.find(m => m.manifest.id === zone.marketId);
    assert.ok(market.comparison.ranges[zone.bearsOn],
      `${zone.id}: ${zone.marketId} declares no range for ${zone.bearsOn}, so the warning would never be seen`);
  }
});

/* The warning the Lab shows is only honest if it is restricted to mechanisms
   that pay. A connection auction bears on capex as a COST — telling a reader
   that cost "is relieved in 2029" would be exactly backwards. */
test('a charging mechanism never carries a relief warning on a revenue assumption', () => {
  for (const zone of allZones()){
    if (CAPTURE_FLOW[zone.capture.mechanism] !== 'charges') continue;
    assert.notEqual(zone.bearsOn, 'merchGross',
      `${zone.id}: a charging mechanism must not warn against merchant revenue`);
    assert.notEqual(zone.bearsOn, 'services',
      `${zone.id}: a charging mechanism must not warn against system services`);
  }
});

test('each grid map carries the congestion register of its own market', () => {
  for (const map of GRID_MAPS){
    assert.ok(map.marketId, `${map.id}: joined map has no marketId`);
    const register = congestionFor(map.marketId);
    assert.ok(register, `${map.id}: joined to a market with no register`);
    assert.equal(map.constraints.length, register.zones.length,
      `${map.id}: map constraints and register zones disagree`);
    for (const zone of map.constraints){
      assert.ok(register.zones.some(z => z.id === zone.id),
        `${map.id}: constraint ${zone.id} is not in the market's register`);
    }
  }
});

test('the three Japan areas resolve to different registers on one dashboard', () => {
  const areas = ['tokyo', 'kyushu', 'hokkaido'];
  const ids = areas.map(a => congestionForDashboard('jp', a).marketId);
  assert.deepEqual(ids, ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']);
  // …and an unknown region falls back rather than throwing.
  assert.equal(congestionForDashboard('jp', 'nowhere').marketId, 'jp_tokyo');
  assert.equal(gridMapForMarket('jp', 'kyushu').marketId, 'jp_kyushu');
  assert.equal(gridMapForMarket('jp').marketId, 'jp_tokyo');
});

test('interface constraints carry a drawable line and zone constraints a point', () => {
  for (const zone of allZones()){
    if (zone.shape === 'interface'){
      assert.ok(Array.isArray(zone.coords) && zone.coords.length >= 2,
        `${zone.id}: an interface needs at least two coordinates to draw`);
      assert.equal(zone.coord, undefined, `${zone.id}: an interface must not also carry a point`);
    } else {
      assert.ok(Array.isArray(zone.coord) && zone.coord.length === 2,
        `${zone.id}: a zone needs a coordinate`);
    }
  }
});

test('a constraint sits inside the market map it is drawn on', () => {
  /* A miscoded longitude puts Poland's corridor in the Atlantic and nobody
     notices, because the projection clips it silently. Bound each constraint by
     its own map's boundary extent instead. */
  for (const map of GRID_MAPS){
    const features = map.boundary.type === 'FeatureCollection' ? map.boundary.features : [map.boundary];
    let west = 180, east = -180, south = 90, north = -90;
    const visit = (coords) => {
      if (typeof coords[0] === 'number'){
        west = Math.min(west, coords[0]); east = Math.max(east, coords[0]);
        south = Math.min(south, coords[1]); north = Math.max(north, coords[1]);
        return;
      }
      coords.forEach(visit);
    };
    features.forEach(f => f.geometry && visit(f.geometry.coordinates));

    // A generous margin: constraints are representative locality centroids and
    // an interface may legitimately run just outside a national outline.
    const pad = 3;
    for (const zone of map.constraints){
      const points = zone.shape === 'interface' ? zone.coords : [zone.coord];
      for (const [lon, lat] of points){
        assert.ok(lon >= west - pad && lon <= east + pad,
          `${zone.id}: longitude ${lon} is outside ${map.id} (${west.toFixed(1)}…${east.toFixed(1)})`);
        assert.ok(lat >= south - pad && lat <= north + pad,
          `${zone.id}: latitude ${lat} is outside ${map.id} (${south.toFixed(1)}…${north.toFixed(1)})`);
      }
    }
  }
});

test('intensity is a bounded ranking, so it can size a marker but never be printed', () => {
  for (const zone of allZones()){
    assert.ok(Number.isFinite(zone.intensity) && zone.intensity > 0 && zone.intensity <= 1,
      `${zone.id}: intensity must be a 0–1 ranking`);
  }

  /* What matters is that the home-page comparison picks the same headline
     constraint every time, which needs a UNIQUE maximum per market — not a high
     one. Tokyo's most binding constraint is genuinely weak: output control
     reached the area for the first time in March 2026, and inflating it to look
     comparable with Kyushu would be the misrepresentation, not the low number. */
  for (const register of CONGESTION_REGISTERS){
    const top = Math.max(...register.zones.map(z => z.intensity));
    const tied = register.zones.filter(z => z.intensity === top);
    assert.equal(tied.length, 1,
      `${register.marketId}: ${tied.length} constraints tie at intensity ${top}, so the headline row is not deterministic`);
  }
});

test('the grid map registry still exposes every market map exactly once', () => {
  const ids = GRID_MAPS.map(m => m.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate grid map id');
  for (const m of comparableMarkets()){
    const map = m.manifest.dashboardId === 'jp'
      ? gridMapForMarket('jp', m.manifest.region)
      : gridMapById(`${m.manifest.id}-grid-map`);
    assert.ok(map, `${m.manifest.id}: no grid map resolves for this market`);
  }
});
