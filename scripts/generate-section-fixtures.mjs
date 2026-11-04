#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   TAKE A CONTENT FINGERPRINT BEFORE A MARKET'S SECTIONS ARE SPLIT.

     node scripts/generate-section-fixtures.mjs --markets gb,ie,pl,ro

   A loader refactor must not move a number, a source reference or a Chinese
   sentence. The only evidence that it did not is a digest of every section
   specification, taken from the single-file implementation BEFORE anything
   moves, using the same harness that tests/market-sections-parity.test.js runs
   afterwards.

   This is the rollout's equivalent of the pilot's nem-sections-content.json.
   It is a dev tool, never imported by the site. Run it once per market, commit
   the result, and only then split that market's sections.js.
   --------------------------------------------------------------------------- */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marketApi, buildAllMarketSections, digests } from '../tests/helpers/market-sections.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const MARKETS = (option('--markets', 'gb,ie,pl,ro') || '').split(',').map(s => s.trim()).filter(Boolean);

for (const id of MARKETS){
  const api = await marketApi(id);
  const sections = await buildAllMarketSections(id, api);
  const ids = Object.keys(sections).sort();
  if (!ids.length) throw new Error(`${id}: harness built no sections — refusing to write an empty fixture`);

  const sectionsDigest = digests(sections);
  const totalBytes = Object.values(sectionsDigest).reduce((n, s) => n + s.bytes, 0);
  const fixture = {
    market: id,
    takenFrom: `src/markets/${id}/sections.js (single-file implementation, before the split)`,
    note: 'Digests of every section specification: bilingual strings, numbers, block order, source references and function source. See tests/market-sections-parity.test.js.',
    totalBytes,
    sections: sectionsDigest,
  };
  const out = path.join(REPO, 'tests/fixtures', `${id}-sections-content.json`);
  await writeFile(out, JSON.stringify(fixture, null, 2) + '\n');
  console.log(`${id}: ${ids.length} sections, ${totalBytes} bytes of specification → ${path.relative(REPO, out)}`);
  for (const sectionId of ids) console.log(`    ${sectionId.padEnd(12)} ${String(sectionsDigest[sectionId].bytes).padStart(8)} B  ${sectionsDigest[sectionId].sha}`);
}
