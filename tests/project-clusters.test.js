/* ---------------------------------------------------------------------------
   Clustering is where a map can quietly publish a wrong number.

   Every test here corresponds to a way the summed label could mislead: mixing
   operating capacity with capacity under construction, summing an energy total
   from the subset of projects that happen to publish one, or plotting a project
   whose position was never in the source.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clusterProjects, clusterLabel, fleetTotals, CLUSTER_MAX_ZOOM,
} from '../src/projects/clusters.js';
import { PROJECT_STAGE } from '../src/projects/schema.js';

let seq = 0;
const project = (over = {}) => ({
  id: `p-${++seq}`,
  marketId: 'gb',
  name: `Project ${seq}`,
  stage: PROJECT_STAGE.OPERATING,
  statusRaw: 'Operational',
  evidenceDate: '2026-08-01',
  expectedCod: null,
  capacityMW: 50,
  durationHours: 2,
  sourceIds: ['gb-neso-tec'],
  ...at(0, 0),
  ...over,
});

/* A test wants to say "put this project 20 screen pixels from that one", but a
   record has to carry real coordinates — latitude 100 does not exist and the
   schema rejects it. So tests place projects in pixel intent and `at()` converts
   to a valid degree position that the projection below turns back into exactly
   those pixels. */
const at = (x, y) => ({ lon: x / 1000, lat: y / 1000 });
const xy = p => [p.lon * 1000, p.lat * 1000];

test('projects close enough to overlap become one marker', () => {
  const markers = clusterProjects(
    [project({ ...at(100, 100) }), project({ ...at(105, 102) }), project({ ...at(108, 99) })],
    xy);

  assert.equal(markers.length, 1);
  assert.equal(markers[0].kind, 'cluster');
  assert.equal(markers[0].count, 3);
  assert.equal(markers[0].powerMW, 150);
});

test('a lone project is drawn as itself, never as a cluster of one', () => {
  const markers = clusterProjects([project({ ...at(10, 10) })], xy);
  assert.equal(markers.length, 1);
  assert.equal(markers[0].kind, 'project');
  assert.ok(!('count' in markers[0]), 'a single project must not be labelled with a count');
});

test('operating capacity is never merged with capacity under construction', () => {
  /* Same location, different stage. If these merged, a reader would see a
     940 MW operating fleet that does not exist yet. */
  const markers = clusterProjects([
    project({ ...at(100, 100), stage: PROJECT_STAGE.OPERATING, capacityMW: 40 }),
    project({ ...at(101, 100), stage: PROJECT_STAGE.OPERATING, capacityMW: 60 }),
    project({ ...at(100, 101), stage: PROJECT_STAGE.UNDER_CONSTRUCTION, capacityMW: 200 }),
    project({ ...at(102, 101), stage: PROJECT_STAGE.UNDER_CONSTRUCTION, capacityMW: 300 }),
  ], xy);

  assert.equal(markers.length, 2);
  const operating = markers.find(m => m.stage === PROJECT_STAGE.OPERATING);
  const building = markers.find(m => m.stage === PROJECT_STAGE.UNDER_CONSTRUCTION);
  assert.equal(operating.powerMW, 100);
  assert.equal(building.powerMW, 500);
});

test('a cluster never sums an energy total from a partial set', () => {
  /* The GB case: the TEC register publishes no duration, so some members have
     an MWh and some do not. Summing the ones that do would report 200 MWh for a
     fleet whose real energy is unknown and larger. */
  const markers = clusterProjects([
    project({ ...at(100, 100), capacityMW: 50, durationHours: 2 }),
    project({ ...at(101, 100), capacityMW: 50, durationHours: 2 }),
    project({ ...at(102, 100), capacityMW: 50, durationHours: null }),
  ], xy);

  const cluster = markers[0];
  assert.equal(cluster.count, 3);
  assert.equal(cluster.powerMW, 150, 'power is always known and always summed');
  assert.equal(cluster.energyMWh, null, 'energy must be withheld, not partially summed');
  assert.equal(cluster.energyKnown, 2);
});

test('a cluster sums energy only when every member publishes one', () => {
  const markers = clusterProjects([
    project({ ...at(100, 100), capacityMW: 50, durationHours: 2 }),
    project({ ...at(101, 100), capacityMW: 100, durationHours: 4 }),
  ], xy);
  assert.equal(markers[0].energyMWh, 500);
});

test('the label says what is missing rather than leaving it blank', () => {
  const [complete] = clusterProjects([
    project({ ...at(100, 100), capacityMW: 500, durationHours: 2 }),
    project({ ...at(101, 100), capacityMW: 440, durationHours: 2 }),
  ], xy);
  assert.equal(clusterLabel(complete)[0], '2 projects · 940 MW / 1,880 MWh');

  const [partial] = clusterProjects([
    project({ ...at(100, 100), capacityMW: 500, durationHours: 2 }),
    project({ ...at(101, 100), capacityMW: 440, durationHours: null }),
  ], xy);
  assert.match(clusterLabel(partial)[0], /^2 projects · 940 MW · energy not published for 1 of 2$/);
  assert.match(clusterLabel(partial)[1], /未公布能量容量/);
});

test('zooming in resolves a cluster into its projects', () => {
  const near = [
    project({ ...at(100, 100) }), project({ ...at(104, 101) }), project({ ...at(107, 103) }),
  ];
  assert.equal(clusterProjects(near, xy, { zoom: 1 })[0].kind, 'cluster');

  const zoomed = clusterProjects(near, xy, { zoom: CLUSTER_MAX_ZOOM });
  assert.equal(zoomed.length, 3);
  assert.ok(zoomed.every(m => m.kind === 'project'), 'past the zoom ceiling nothing is merged');
});

test('a higher zoom separates projects a lower zoom merged', () => {
  const pair = [project({ ...at(100, 100) }), project({ ...at(120, 100) })];
  assert.equal(clusterProjects(pair, xy, { zoom: 1 }).length, 1, 'merged when 20px apart at zoom 1');
  assert.equal(clusterProjects(pair, xy, { zoom: 4 }).length, 2, 'separate once the cell shrinks');
});

test('a project with no position stays off the map and out of the totals', () => {
  const markers = clusterProjects([
    project({ ...at(100, 100) }),
    project({ lat: null, lon: null }),
  ], xy);
  assert.equal(markers.length, 1);
  assert.equal(markers[0].kind, 'project');
});

test('a queue entry is never drawn as pipeline', () => {
  // Most of a queue never gets built; AEMO's proposed category alone is 18.6 GW.
  const markers = clusterProjects([
    project({ ...at(100, 100), stage: PROJECT_STAGE.GRID_APPLICATION }),
    project({ ...at(101, 100), stage: PROJECT_STAGE.ANNOUNCED }),
    project({ ...at(102, 100), stage: PROJECT_STAGE.PERMITTED }),
  ], xy);
  assert.deepEqual(markers, []);
});

test('fleet totals split by stage and report what cannot be plotted', () => {
  const totals = fleetTotals([
    project({ capacityMW: 100, durationHours: 2, stage: PROJECT_STAGE.OPERATING }),
    project({ capacityMW: 50, durationHours: null, stage: PROJECT_STAGE.OPERATING, lat: null, lon: null }),
    project({ capacityMW: 300, durationHours: 4, stage: PROJECT_STAGE.UNDER_CONSTRUCTION }),
    project({ capacityMW: 25, durationHours: 1, stage: PROJECT_STAGE.ANNOUNCED }),
  ]);

  assert.equal(totals[PROJECT_STAGE.OPERATING].count, 2);
  assert.equal(totals[PROJECT_STAGE.OPERATING].powerMW, 150);
  assert.equal(totals[PROJECT_STAGE.OPERATING].energyMWh, null, 'one member publishes no duration');
  assert.equal(totals[PROJECT_STAGE.OPERATING].plottable, 1, 'the unlocatable one is counted but not mapped');

  assert.equal(totals[PROJECT_STAGE.UNDER_CONSTRUCTION].energyMWh, 1200);
  assert.ok(!(PROJECT_STAGE.ANNOUNCED in totals), 'announced is not a mapped stage');
});
