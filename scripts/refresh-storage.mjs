/* ---------------------------------------------------------------------------
   Refresh the OpenStreetMap storage snapshots.

     node scripts/refresh-storage.mjs [marketId ...]

   Only markets whose OSM coverage has been MEASURED against a published fleet
   total are eligible, which today means Ireland alone. The connector refuses
   anything else rather than quietly publishing four batteries as a national
   pipeline — see src/governance/projectPipelineSources.js.

   Unlike the transmission snapshots these are small (24 projects, ~10 kB) and
   are imported directly by the market that owns them.
   --------------------------------------------------------------------------- */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchMarketStorage, OSM_STORAGE_MARKETS } from '../etl/sources/osm-storage.mjs';
import { validateProjects } from '../src/projects/schema.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const log = (message) => process.stdout.write(message + '\n');

const requested = process.argv.slice(2).filter(a => !a.startsWith('-'));
const markets = requested.length ? requested : OSM_STORAGE_MARKETS;

let failures = 0;

for (const marketId of markets){
  try {
    const evidenceDate = new Date().toISOString().slice(0, 10);
    const result = await fetchMarketStorage(marketId, { log: m => log('  ' + m), evidenceDate });

    /* Validate before writing. A record that fails the schema would render as a
       blank row or a misplaced marker, and finding that in the browser is far
       more expensive than finding it here. */
    const problems = validateProjects(result.projects);
    if (problems.length){
      failures += 1;
      log(`  ✖ ${marketId}: ${problems.length} schema problem(s), nothing written`);
      problems.slice(0, 5).forEach(p => log(`      ${p}`));
      continue;
    }

    const file = resolve(ROOT, 'src/markets', marketId, `${marketId}-storage-osm.json`);
    writeFileSync(file, JSON.stringify({
      marketId,
      licence: result.licence,
      fetchedAt: evidenceDate,
      note: 'OpenStreetMap battery plants, clipped to the market boundary. '
        + 'Regenerate with `npm run refresh:storage`.',
      projects: result.projects,
    }, null, 1) + '\n');

    const mw = result.projects.reduce((total, p) => total + p.capacityMW, 0);
    log(`  ✔ ${marketId}: ${result.projects.length} projects, ${Math.round(mw)} MW`);
  } catch (error){
    failures += 1;
    log(`  ✖ ${marketId}: ${error.message}`);
  }
}

if (failures) process.exit(1);
