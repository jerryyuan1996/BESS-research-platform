/* ---------------------------------------------------------------------------
   THE WEEKLY DIGEST, ON THE COMMAND LINE.

   Prints the briefing as Markdown: the body of the weekly GitHub issue. The
   workflow job that posts it is PR 6 of the guided-experience plan; this is
   the renderer, and the way to read the digest before it is ever posted.

     node scripts/briefing/weekly.mjs                 the last seven days, fund lens
     node scripts/briefing/weekly.mjs --days 14
     node scripts/briefing/weekly.mjs --lens strategic
     node scripts/briefing/weekly.mjs --with-draft    as it would read once the
                                                      drafted briefing content is applied

   It reads and prints. It writes nothing and changes nothing; `--with-draft`
   applies the draft in memory only.
   --------------------------------------------------------------------------- */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { briefingFromDisk, REPO_ROOT } from '../../src/briefing/disk.js';
import { renderDigest } from '../../src/briefing/markdown.js';
import { ARCHETYPE_IDS } from '../../src/governance/investability.js';

const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : null; };

async function draftOverlay(){
  const tool = path.join(REPO_ROOT, 'scripts', 'view', 'draft-briefing-content.mjs');
  if (!existsSync(tool)) throw new Error('no drafted content to overlay: scripts/view/draft-briefing-content.mjs is not here');
  const { briefingChanges } = await import(pathToFileURL(tool).href);
  const { createViewStore } = await import(pathToFileURL(path.join(REPO_ROOT, 'scripts', 'view', 'writer.mjs')).href);
  return briefingChanges(createViewStore());
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const lens = arg('--lens') || 'infraFund';
  if (!ARCHETYPE_IDS.includes(lens)) throw new Error(`--lens must be one of ${ARCHETYPE_IDS.join(', ')}`);
  const days = Number(arg('--days') || 7);
  const overlay = process.argv.includes('--with-draft') ? await draftOverlay() : [];
  const briefing = await briefingFromDisk({ overlay });
  process.stdout.write(renderDigest(briefing, { lens, days }));
}
