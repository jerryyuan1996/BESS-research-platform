/* ---------------------------------------------------------------------------
   THE TRANSMISSION LAYER'S GEOMETRY, WITHOUT A BROWSER.

   Phase A2 replaced one <path> per transmission segment with one path per band
   class and style. That is a large reduction in nodes — 7,771 backbone paths in
   Great Britain became one — and the risk it carries is silent: a merged path
   that drops a segment looks exactly like a complete one.

   So these tests hold the merge against the two properties that matter. Nothing
   is lost (the subpath count equals the number of drawable lines, and the
   subpath count of the real Great Britain files is checked against their own
   declared totals), and nothing is invented (an unprojectable point drops its
   segment rather than emitting "undefined" into path data, which is what the
   previous implementation would have done).
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { transmissionSegments, linePathData } from '../src/components/transmissionGeometry.js';

/** A projection that stands in for d3's: linear, and explicit about its origin. */
const project = ([lon, lat]) => [100 + lon * 10, 200 - lat * 10];

const line = (path, kv, extra = {}) => ({ path, kv, ...extra });
const countSubpaths = (d) => (d.match(/M/g) || []).length;

test('every drawable segment becomes exactly one subpath', () => {
  const lines = [
    line([[0, 0], [1, 1]], 400),
    line([[1, 1], [2, 2], [3, 1]], 275),
    line([[2, 0], [2, 2]], 132),
  ];
  const band = transmissionSegments({ lines, backboneFloor:275, project });

  assert.equal(band.segments.length, 2, 'one path for the backbone class, one for the detail class');
  assert.equal(band.subpaths, 3);
  const total = band.segments.reduce((sum, segment) => sum + countSubpaths(segment.d), 0);
  assert.equal(total, 3, 'no segment may be lost in the join');
});

test('path data is the same drawing, not a redrawn one', () => {
  const lines = [line([[0, 0], [1, 1]], 400), line([[2, 2], [3, 3]], 400)];
  const band = transmissionSegments({ lines, backboneFloor:275, project });
  const [only] = band.segments;
  /* Two subpaths, each "M…L…", separated by a space — a path data string, which
     is exactly what the element-per-line version wrote into each `d`. */
  assert.equal(only.d, 'M100 200 L110 190 M120 180 L130 170');
  assert.equal(countSubpaths(only.d), 2);
});

test('band class and underground are kept apart, because the stylesheet does', () => {
  const lines = [
    line([[0, 0], [1, 1]], 400, { underground:true }),
    line([[1, 1], [2, 2]], 400),
    line([[2, 2], [3, 3]], 132, { underground:true }),
    line([[3, 3], [4, 4]], 132),
  ];
  const band = transmissionSegments({ lines, backboneFloor:275, project });
  const keys = band.segments.map(s => `${s.bandClass}/${s.underground ? 'underground' : 'overhead'}`).sort();
  assert.deepEqual(keys, ['bulk/overhead', 'bulk/underground', 'detail/overhead', 'detail/underground']);
  assert.equal(band.subpaths, 4);
});

test('a segment that cannot be projected is dropped, not written as undefined', () => {
  const partial = [[0, 0], [1, 1], [NaN, 2]];
  const band = transmissionSegments({
    lines: [line([[0, 0], [1, 1]], 400), line(partial, 400), line([[5, 5]], 400)],
    backboneFloor:275,
    project,
  });
  assert.equal(band.subpaths, 1, 'only the fully projectable line survives');
  assert.doesNotMatch(band.segments[0].d, /undefined|NaN/);
});

test('a line is projected once, and the cached path is reused', () => {
  let calls = 0;
  const counting = (point) => { calls += 1; return project(point); };
  const shared = line([[0, 0], [1, 1], [2, 2]], 400);

  /* One cache, shared by every band — which is how the component holds it: the
     cache lives for the map's lifetime, not for one call. */
  const cache = new WeakMap();
  const first = transmissionSegments({ lines:[shared], backboneFloor:275, project:counting, cache });
  const callsAfterFirst = calls;
  assert.equal(callsAfterFirst, 3);

  /* The same line object, a second band — the case that used to re-project every
     line on every arrival. */
  const second = transmissionSegments({ lines:[shared], backboneFloor:275, project:counting, cache });
  assert.equal(calls, callsAfterFirst, 'cached geometry must not be reprojected');
  assert.equal(second.segments[0].d, first.segments[0].d);
});

test('substations are one path per band class, not one element each', () => {
  const band = transmissionSegments({
    substations:[{ coord:[0, 0], kv:400 }, { coord:[1, 0], kv:400 }, { coord:[0, 1], kv:132 }],
    backboneFloor:275,
    project,
  });
  assert.equal(band.substations.length, 2);
  const bulk = band.substations.find(s => s.bandClass === 'bulk');
  assert.equal(countSubpaths(bulk.d), 2);
  assert.match(bulk.d, /^M97\.4 197\.4h5\.2v5\.2h-5\.2z/);
});

test('an empty band produces nothing at all, not an empty element', () => {
  const band = transmissionSegments({ project });
  assert.deepEqual(band, { segments:[], substations:[], subpaths:0 });
});

test('linePathData reports a one-point line as undrawable', () => {
  assert.equal(linePathData({ path:[[0, 0]] }, project, new WeakMap()), '');
  assert.equal(linePathData({ path:null }, project, new WeakMap()), '');
  assert.equal(linePathData({ path:[[0, 0], [1, 1]] }, project, new WeakMap()), 'M100 200 L110 190');
});

/* The real payloads. These are the files the GB map fetches, and the numbers they
   declare about themselves are the contract the merge has to keep. */
for (const [file, declared, subs] of [
  ['gb-transmission-275plus.json', 7771, 193],
  ['gb-transmission-132-274.json', 6272, 570],
]){
  test(`${file}: every declared segment reaches the map`, async () => {
    const payload = JSON.parse(await readFile(
      new URL(`../public/data/grid/${file}`, import.meta.url), 'utf8'));
    assert.equal(payload.lines.length, declared);
    assert.equal(payload.substations.length, subs);

    const band = transmissionSegments({
      lines:payload.lines, substations:payload.substations, backboneFloor:275, project,
    });
    assert.equal(band.subpaths, declared,
      'a dropped segment would reduce the subpath count with nothing else to show for it');
    /* And the merge is worth doing: thousands of segments, a handful of elements. */
    assert.ok(band.segments.length <= 4, `expected at most 4 paths, got ${band.segments.length}`);
    assert.equal(band.substations.reduce((n, s) => n + countSubpaths(s.d), 0), subs);
  });
}
