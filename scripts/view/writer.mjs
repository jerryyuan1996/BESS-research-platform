/* ---------------------------------------------------------------------------
   THE ANALYST'S DOOR TO THE VIEW WRITER.

   The writer itself is etl/lib/viewWriter.mjs: one module writes view/, and a
   rule, the agent and the analyst all go through it and through the same gate.
   This file is the command line a person runs, and it adds the one check that
   cannot live in the writer.

   THE PRIVATE REASON. A held view is the analyst's own judgement, and the one
   thing about it that cannot be published is why. That reason is in the
   private overlay, local-data/view-notes.json, which is git-ignored and exists
   on the analyst's machine only. The writer has no path to that folder and
   must never grow one — automation runs through it. So the check is supplied
   from here: this door reads the overlay and tells the writer whether a reason
   exists. Through any other door a held view cannot be written at all, which
   is the intended result and not a gap.

   Nothing under etl/ or agent/ may import this file. tests/view.test.js
   asserts it.

   Run as a tool:
     node scripts/view/writer.mjs apply <change.json>     one change, or an array
     node scripts/view/writer.mjs revert <changelog-id>   undo one change by id
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createViewStore as createCoreStore, ViewRejected, VIEW_ROOT } from '../../etl/lib/viewWriter.mjs';
import { NOTES_KEY, heldNote } from '../../src/local/notes.js';

export { ViewRejected, VIEW_ROOT };

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* The private overlay, read from disk. On any machine but the analyst's there
   is no file, and no held view can be written. */
const LOCAL_NOTES = path.resolve(HERE, '..', '..', 'local-data', `${NOTES_KEY}.json`);

async function readLocalNotes(){
  if (!existsSync(LOCAL_NOTES)) return null;
  return JSON.parse(await readFile(LOCAL_NOTES, 'utf8'));
}

/**
 * @param root   the store's directory; tests pass a temporary one
 * @param notes  how to read the private overlay; tests pass their own
 */
export function createViewStore(root = VIEW_ROOT, { notes = readLocalNotes } = {}){
  return createCoreStore(root, {
    heldReason: async (market, dimension) => heldNote(market, dimension, await notes()),
    heldMissing: (dimension) => `no private reason in local-data/${NOTES_KEY}.json — add held.${dimension}.reason for this market first`,
  });
}

/* ---- command line ---------------------------------------------------------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const [command, argument] = process.argv.slice(2);
  const store = createViewStore();
  try {
    if (command === 'apply' && argument){
      const loaded = JSON.parse(await readFile(argument, 'utf8'));
      for (const change of Array.isArray(loaded) ? loaded : [loaded]){
        const entry = await store.apply(change);
        console.log(`  ${entry.market}  ${entry.path}`);
      }
    } else if (command === 'revert' && argument){
      const entry = await store.revert(argument);
      console.log(`  reverted  ${entry.market}  ${entry.path}`);
      if (entry.from?.author === 'rule'){
        console.log('  The rule that made this change stays fired. Rewrite its trigger record to arm it again.');
      }
    } else {
      console.error('usage: node scripts/view/writer.mjs apply <change.json>     the file holds one change, or an array of them\n'
        + '       node scripts/view/writer.mjs revert <changelog-id>   undo one change by its id');
      process.exit(2);
    }
  } catch (error){
    console.error(error.message);
    process.exit(1);
  }
}
