/* ---------------------------------------------------------------------------
   Refresh the OpenStreetMap transmission snapshots.

     node scripts/refresh-grid-networks.mjs [marketId ...]

   With no arguments it does every market that declares a transmission
   definition.

   THE RULE THIS SCRIPT ENFORCES: a delivery constraint transforms data, it never
   discards it. An earlier version deleted Italy's snapshot when it came back at
   4.4 MB, which silently removed the largest transmission network on the
   platform because a file was inconvenient. Terna's RTN runs to 132 kV and every
   segment of it is analytically real, so the pipeline now:

     1. keeps the raw fetch, unsimplified, in local-data/raw/ — the ingest of
        record, so a representation decision can always be revisited without
        re-querying a free public endpoint;
     2. splits the normalized network into the market's declared voltage bands
        (Italy: 380 kV · 220 kV · 132–150 kV);
     3. simplifies each band, escalating the tolerance only for a band that
        exceeds the per-file budget, and reporting the tolerance it settled on;
     4. writes every band regardless. A band that will not fit even at the
        coarsest sane tolerance is reported as needing tiles — and still written.

   Nothing is deleted for being large. The only failure that drops data is a
   fetch that did not complete, because a partial network is a wrong network.

   Outputs go to public/data/grid/ and are fetched at runtime: importing them put
   3.5 MB into the bundle every visitor downloads to see the home page.

   LICENCE: ODbL. Attribution rides in every band file and is rendered by the map.
   --------------------------------------------------------------------------- */
import { writeFileSync, statSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchMarketGrid, simplifyPath, SIMPLIFY_TOLERANCE } from '../etl/sources/osm-grid.mjs';
import { TRANSMISSION_VOLTAGE, bandsFor } from '../src/governance/transmissionVoltage.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = resolve(ROOT, 'public/data/grid');
const RAW_DIR = resolve(ROOT, 'local-data/raw/grid');

/* Per-FILE budget, not per-market. A market may ship as many bands as its
   network needs; each one has to stay small enough to fetch quickly on a mobile
   connection and to diff in a pull request. */
const MAX_BYTES = 2 * 1024 * 1024;

/* Escalation ladder in degrees. 0.004° is ~440 m — under a pixel at the zoom
   the backbone is read at. The last rung is ~1.4 km, which is still under a
   pixel at national zoom and is where a band should be tiled instead. */
const TOLERANCES = [SIMPLIFY_TOLERANCE, 0.006, 0.009, 0.013];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = (message) => process.stdout.write(message + '\n');
const mb = (bytes) => (bytes / 1e6).toFixed(2);
const bandId = (band) => (band.maxKV === Infinity ? `${band.minKV}plus` : `${band.minKV}-${band.maxKV - 1}`);

const requested = process.argv.slice(2).filter(a => !a.startsWith('-'));
const markets = requested.length ? requested : Object.keys(TRANSMISSION_VOLTAGE);

const unknown = markets.filter(id => !TRANSMISSION_VOLTAGE[id]);
if (unknown.length){
  log(`unknown market(s): ${unknown.join(', ')}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(RAW_DIR, { recursive: true });

let fetchFailures = 0;
let needsTiles = 0;

for (const [index, marketId] of markets.entries()){
  if (index) await sleep(20_000);          // be a good citizen of a free endpoint

  let grid;
  try {
    grid = await fetchMarketGrid(marketId, { log: m => log('  ' + m) });
  } catch (error){
    fetchFailures += 1;
    log(`  ✖ ${marketId}: ${error.message}`);
    continue;                              // an incomplete fetch is the one thing worth dropping
  }

  const fetchedAt = new Date().toISOString().slice(0, 10);

  /* 1 · The ingest of record. Unsimplified, unsplit, uncommitted — local-data is
     gitignored, so this is a working artefact rather than repo weight, and it
     means a future decision about representation never needs another 15,000-way
     query against a volunteer-funded endpoint. */
  const rawFile = resolve(RAW_DIR, `${marketId}-transmission-osm.raw.json`);
  writeFileSync(rawFile, JSON.stringify({
    marketId, fetchedAt, licence: grid.licence,
    bulkKV: grid.bulkKV, detailKV: grid.detailKV, operator: grid.operator,
    droppedOutsideMarket: grid.droppedOutsideMarket,
    lines: grid.lines, substations: grid.substations,
  }) + '\n');
  log(`  · ${marketId}: raw ingest kept at local-data/raw/grid (${mb(statSync(rawFile).size)} MB)`);

  // 2 · Split into the market's declared voltage bands.
  const bands = bandsFor(marketId);
  const manifest = [];

  for (const band of bands){
    const inBand = (kv) => kv >= band.minKV && kv < band.maxKV;
    const lines = grid.lines.filter(line => inBand(line.kv));
    const substations = grid.substations.filter(s => inBand(s.kv));
    if (!lines.length && !substations.length) continue;

    /* 3 · Simplify, escalating only if this band needs it. Bands are written
       independently, so Italy's 380 kV class keeps full fidelity even though its
       132 kV class has to be coarsened. */
    let chosen = null;
    for (const tolerance of TOLERANCES){
      const payload = {
        marketId, band: bandId(band), minKV: band.minKV,
        maxKV: band.maxKV === Infinity ? null : band.maxKV,
        backbone: band.backbone,
        licence: grid.licence, operator: grid.operator,
        bulkKV: grid.bulkKV, detailKV: grid.detailKV,
        simplifyTolerance: tolerance, fetchedAt,
        lines: lines.map(line => ({ ...line, path: simplifyPath(line.path, tolerance) })),
        substations,
      };
      const text = JSON.stringify(payload) + '\n';
      chosen = { payload, text, bytes: Buffer.byteLength(text), tolerance };
      if (chosen.bytes <= MAX_BYTES) break;
    }

    /* 4 · Written either way, and chunked if a band is still over budget at the
       coarsest sane tolerance. Italy's 132–219 kV class is 11,266 segments and
       does not fit in one file however hard it is simplified — so it becomes
       several, and the loader concatenates them. Chunking is the last transform
       before tiles, and it keeps every delivered file inside the budget without
       a native tile toolchain. Nothing is dropped at any step. */
    const parts = chosen.bytes > MAX_BYTES
      ? Math.ceil(chosen.bytes / MAX_BYTES)
      : 1;
    const perPart = Math.ceil(chosen.payload.lines.length / parts);
    const urls = [];

    for (let part = 0; part < parts; part++){
      const slice = {
        ...chosen.payload,
        part: part + 1,
        parts,
        lines: chosen.payload.lines.slice(part * perPart, (part + 1) * perPart),
        // Substations ride with the first part; they are a fraction of the bytes.
        substations: part === 0 ? chosen.payload.substations : [],
      };
      const name = parts === 1
        ? `${marketId}-transmission-${bandId(band)}.json`
        : `${marketId}-transmission-${bandId(band)}.part${part + 1}.json`;
      const text = JSON.stringify(slice) + '\n';
      writeFileSync(resolve(OUT_DIR, name), text);
      urls.push({ url: `/data/grid/${name}`, bytes: Buffer.byteLength(text) });
    }

    const largest = Math.max(...urls.map(u => u.bytes));
    const stillOver = largest > MAX_BYTES;
    if (stillOver) needsTiles += 1;

    manifest.push({
      band: bandId(band), minKV: band.minKV,
      maxKV: band.maxKV === Infinity ? null : band.maxKV,
      backbone: band.backbone,
      urls: urls.map(u => u.url),
      lines: lines.length, substations: substations.length,
      simplifyTolerance: chosen.tolerance,
      bytes: urls.reduce((total, u) => total + u.bytes, 0),
      largestPartBytes: largest,
      overBudget: stillOver,
    });

    log(`  ${stillOver ? '!' : '✔'} ${marketId} ${bandId(band)} kV: ${lines.length} lines, `
      + `${substations.length} substations, ${mb(chosen.bytes)} MB @ tol ${chosen.tolerance}`
      + (parts > 1 ? ` → ${parts} parts, largest ${mb(largest)} MB` : '')
      + (stillOver ? ' — still over budget, tile this band (data retained)' : ''));
  }

  /* The manifest is what the map reads. It names the bands, says which are
     backbone, and carries the byte counts so a reader of the repo can see the
     delivery decisions without opening a 2 MB file. */
  writeFileSync(resolve(OUT_DIR, `${marketId}-transmission.manifest.json`),
    JSON.stringify({ marketId, fetchedAt, licence: grid.licence, operator: grid.operator,
      bulkKV: grid.bulkKV, detailKV: grid.detailKV,
      droppedOutsideMarket: grid.droppedOutsideMarket, bands: manifest }, null, 1) + '\n');
}

if (needsTiles){
  log(`\n${needsTiles} band(s) exceed ${mb(MAX_BYTES)} MB and were written anyway.`);
  log('Convert those to vector tiles / PMTiles — do not drop them.');
}
if (fetchFailures){
  log(`\n${fetchFailures} market(s) failed to fetch. Nothing partial was published for them.`);
  process.exit(1);
}
