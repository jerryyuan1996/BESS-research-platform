/* ---------------------------------------------------------------------------
   The committed transmission snapshots.

   These files are large and machine-generated, which is exactly why they need
   assertions: nobody reads a 1.5 MB JSON diff in a pull request. The tests below
   are the review a human cannot practically perform.

   The most important one is the band-coverage check. Italy is delivered as three
   files because its RTN is 15,079 segments and does not fit in one; splitting
   for delivery is legitimate, and silently losing a voltage class in the split
   would be the same failure as deleting the file, only harder to see. So the
   bands are checked for gaps and overlaps against the market's own declared
   floor, and every band the manifest promises is checked to exist.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { simplifyPath, SIMPLIFY_TOLERANCE } from '../etl/sources/osm-grid.mjs';
import { TRANSMISSION_VOLTAGE, bandsFor } from '../src/governance/transmissionVoltage.js';
import { GRID_MAPS } from '../src/markets/gridMapRegistry.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = resolve(ROOT, 'public/data/grid');

/* They live in public/ rather than src/ because they are fetched at runtime:
   importing Great Britain's snapshot put it in the bundle every visitor
   downloads to see the home page. */
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const listing = () => (existsSync(DIR) ? readdirSync(DIR) : []);
const manifests = () => listing()
  .filter(f => f.endsWith('.manifest.json'))
  .map(f => ({ file: resolve(DIR, f), manifest: read(resolve(DIR, f)) }));
const bandFiles = () => listing()
  .filter(f => f.endsWith('.json') && !f.endsWith('.manifest.json'))
  .map(f => resolve(DIR, f));

/* Per-FILE, not per-market. A market may ship as many bands and parts as its
   network needs; each delivered file has to stay fetchable and diffable. */
const MAX_BYTES = 2 * 1024 * 1024;

test('simplification keeps the ends and drops only sub-pixel detail', () => {
  /* A line that loses its last vertex stops short of the substation it connects
     to, which looks like a gap in the network rather than a rounding choice. */
  const straight = Array.from({ length: 50 }, (_, i) => [i * 0.0001, 0]);
  const simplified = simplifyPath(straight);
  assert.deepEqual(simplified[0], straight[0], 'first vertex must survive');
  assert.deepEqual(simplified.at(-1), straight.at(-1), 'last vertex must survive');
  assert.ok(simplified.length < straight.length, 'sub-tolerance vertices must go');

  assert.deepEqual(simplifyPath([[0, 0], [1, 1]]), [[0, 0], [1, 1]]);
  assert.deepEqual(simplifyPath([[0, 0]]), [[0, 0]]);
});

test('simplification never moves a vertex it keeps', () => {
  // It is a filter, not a smoother: a kept point is the surveyed point.
  const path = [[0, 0], [0.5, 0.3], [1, 0.1], [1.5, 0.9]];
  for (const point of simplifyPath(path)){
    assert.ok(path.some(p => p[0] === point[0] && p[1] === point[1]),
      `${JSON.stringify(point)} is not one of the original vertices`);
  }
});

test('declared bands tile the market’s range with no gap and no overlap', () => {
  /* The property that makes splitting safe. A gap means a voltage class is
     delivered by nobody; an overlap means a line is drawn and counted twice.
     Checked against the declaration, so it holds for a market whose snapshot has
     not been generated yet. */
  for (const marketId of Object.keys(TRANSMISSION_VOLTAGE)){
    const bands = bandsFor(marketId);
    const floor = TRANSMISSION_VOLTAGE[marketId].detailKV;
    assert.ok(bands.length, `${marketId}: no bands`);
    assert.equal(bands[0].maxKV, Infinity, `${marketId}: the top band must be open`);
    assert.equal(bands.at(-1).minKV, floor, `${marketId}: the lowest band must reach the declared floor`);

    for (let i = 1; i < bands.length; i++){
      assert.equal(bands[i].maxKV, bands[i - 1].minKV,
        `${marketId}: gap or overlap between ${bands[i].minKV} kV and ${bands[i - 1].minKV} kV`);
    }
    assert.ok(bands.some(b => b.backbone), `${marketId}: something must load with the map`);
    assert.ok(!bands.at(-1).backbone, `${marketId}: the lowest band must not be eager`);
  }
});

test('every manifest lists only bands its market declares', () => {
  const found = manifests();
  assert.ok(found.length, 'no transmission manifests — has the refresh script been run?');

  for (const { manifest } of found){
    const declared = bandsFor(manifest.marketId);
    assert.ok(declared.length, `${manifest.marketId}: manifest for an unknown market`);

    /* A band with no segments is legitimately absent, so the manifest may be
       shorter than the declaration — but it may never contain a band the market
       does not declare, which would mean the split invented a class. */
    for (const band of manifest.bands){
      assert.ok(declared.some(d => d.minKV === band.minKV),
        `${manifest.marketId}: manifest band ${band.minKV} kV is not declared`);
      assert.ok(band.urls?.length, `${manifest.marketId}: band ${band.band} has no files`);
    }
  }
});

test('every band file the manifest promises actually exists', () => {
  for (const { manifest } of manifests()){
    for (const band of manifest.bands){
      for (const url of band.urls){
        const file = resolve(ROOT, 'public', url.replace(/^\//, ''));
        assert.ok(existsSync(file), `${manifest.marketId}: ${url} is missing`);
        const part = read(file);
        assert.equal(part.marketId, manifest.marketId, `${url}: belongs to another market`);
        assert.equal(part.band, band.band, `${url}: band label disagrees with the manifest`);
      }
    }
  }
});

test('every segment sits inside the band that carries it', () => {
  /* A segment in the wrong file is a segment drawn at the wrong zoom and styled
     as the wrong voltage class. */
  for (const file of bandFiles()){
    const part = read(file);
    const max = part.maxKV ?? Infinity;
    for (const line of part.lines){
      assert.ok(line.kv >= part.minKV && line.kv < max,
        `${file}: ${line.kv} kV line in the ${part.minKV}–${part.maxKV ?? '∞'} band`);
    }
    for (const s of part.substations){
      assert.ok(s.kv >= part.minKV && s.kv < max,
        `${file}: ${s.kv} kV substation in the wrong band`);
    }
  }
});

test('nothing is below the market’s declared transmission floor', () => {
  for (const file of bandFiles()){
    const part = read(file);
    const floor = TRANSMISSION_VOLTAGE[part.marketId].detailKV;
    for (const line of part.lines){
      assert.ok(line.kv >= floor, `${file}: ${line.kv} kV is below the ${floor} kV floor`);
    }
  }
});

test('band geometry is on the planet and drawable', () => {
  for (const file of bandFiles()){
    const part = read(file);
    for (const line of part.lines.slice(0, 300)){
      assert.ok(line.path.length >= 2, `${file}: a line needs two points to be a line`);
      for (const [lon, lat] of line.path){
        assert.ok(Number.isFinite(lon) && Math.abs(lon) <= 180, `${file}: bad longitude ${lon}`);
        assert.ok(Number.isFinite(lat) && Math.abs(lat) <= 90, `${file}: bad latitude ${lat}`);
      }
    }
  }
});

test('the ODbL terms are in every delivered file, not only in a document', () => {
  for (const file of [...bandFiles(), ...manifests().map(m => m.file)]){
    const part = read(file);
    assert.match(part.licence?.attribution || '', /OpenStreetMap contributors/,
      `${file}: attribution must travel with the data`);
    assert.equal(part.licence.shareAlike, true);
  }
});

test('a band is simplified no harder than it needs to be', () => {
  /* Escalation is per band, so the backbone keeps full fidelity even where the
     detail class had to be coarsened. */
  for (const file of bandFiles()){
    const part = read(file);
    assert.ok(part.simplifyTolerance >= SIMPLIFY_TOLERANCE,
      `${file}: simplified finer than the base tolerance`);
    if (part.backbone){
      assert.equal(part.simplifyTolerance, SIMPLIFY_TOLERANCE,
        `${file}: the backbone should not need coarsening`);
    }
  }
});

test('no delivered file has grown past the point where a diff is reviewable', () => {
  /* Over budget is a reason to split, coarsen or tile — the refresh script does
     the first two automatically and reports when only tiles are left. It is
     never a reason to drop the data, which is why this asserts on delivered
     parts rather than on the band total. */
  for (const file of bandFiles()){
    const bytes = statSync(file).size;
    assert.ok(bytes <= MAX_BYTES,
      `${file}: ${(bytes / 1e6).toFixed(2)} MB. Split, coarsen or tile it — do not delete it.`);
  }
});

test('every market wired to a manifest has one, and it is its own', () => {
  const wired = GRID_MAPS.filter(map => map.transmissionManifest);
  assert.ok(wired.length, 'no market is wired to a transmission manifest');

  for (const map of wired){
    const file = resolve(ROOT, 'public', map.transmissionManifest.replace(/^\//, ''));
    assert.ok(existsSync(file), `${map.marketId}: ${map.transmissionManifest} does not exist`);
    assert.equal(read(file).marketId, map.marketId, `${map.marketId}: wired to another market's manifest`);
  }
});

test('Italy keeps its full RTN, split across bands rather than truncated', () => {
  /* The regression this file exists for. Italy's snapshot was once deleted for
     being 4.4 MB; the 132 kV floor and the full segment count must both survive
     any future change to how it is delivered. */
  const entry = manifests().find(m => m.manifest.marketId === 'it');
  if (!entry) return;                       // not generated in this checkout

  const { manifest } = entry;
  assert.equal(manifest.detailKV, 132, 'Terna’s RTN reaches 132 kV and the floor must say so');
  assert.equal(manifest.bands.length, 3, '380 kV · 220 kV · 132–150 kV');

  const total = manifest.bands.reduce((sum, band) => sum + band.lines, 0);
  assert.ok(total > 14_000, `only ${total} segments — the RTN has been truncated`);
  assert.equal(manifest.bands.filter(b => b.backbone).length, 2,
    '380 kV and 220 kV both load with the map');
});
