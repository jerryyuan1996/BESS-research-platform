/* ---------------------------------------------------------------------------
   LOCAL CHECK — every held view has a private reason.

   A held grade is the analyst's own judgement, and the one thing about it that
   cannot be published is why. The view writer already refuses to write a held
   view with no reason in the private overlay; this is the same rule run over
   the whole store, for a note deleted afterwards or a branch pulled from
   another machine.

   IT RUNS ON THE ANALYST'S MACHINE AND NOWHERE ELSE. The overlay is
   git-ignored, so CI has no file to check against and this is deliberately not
   part of `npm test` or of the build. With no overlay present it says so and
   exits 0: there is nothing it could check, and failing would make a public
   pipeline depend on a private folder.

   Run:  npm run view:check-held
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createViewStore } from './writer.mjs';
import { NOTES_KEY, heldWithoutReason, validateNotes } from '../../src/local/notes.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(HERE, '..', '..', 'local-data', `${NOTES_KEY}.json`);

if (!existsSync(file)){
  console.log(`  held views: no local-data/${NOTES_KEY}.json on this machine — nothing to check.`);
  process.exit(0);
}

const notes = JSON.parse(await readFile(file, 'utf8'));
const malformed = validateNotes(notes);
if (malformed.length){
  console.error(`  held views: local-data/${NOTES_KEY}.json is malformed:\n    ${malformed.join('\n    ')}`);
  process.exit(1);
}

const views = await createViewStore().readAll();
const held = views.flatMap(v => Object.entries(v.grades).filter(([, g]) => g.held).map(([id]) => `${v.marketId}/${id}`));
const missing = heldWithoutReason(views, notes);

if (missing.length){
  console.error(`  held views: ${missing.length} of ${held.length} have no private reason:`);
  for (const m of missing) console.error(`    ${m.marketId}: add held.${m.dimension}.reason`);
  process.exit(1);
}
console.log(`  held views: ${held.length} checked, each with a private reason.`);
