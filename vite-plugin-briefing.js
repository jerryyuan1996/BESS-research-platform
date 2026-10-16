/* ---------------------------------------------------------------------------
   BRIEFING PLUGIN — the page gets the briefing, not the engine that made it.

   src/briefing/briefingData.js is replaced here with the briefing the model
   builds from the view store, the changelog and the published summaries
   (src/briefing/disk.js), written out as a literal. The same function builds
   the weekly digest, so the page and the digest are one computation.

   It runs at build time, and a build follows every data refresh that changes
   anything, so the briefing is as current as the data. Dates in it are
   absolute; a page cuts "since your last visit" and "coming" on the reader's
   own clock.

   READ-ONLY. Nothing here writes. NOTHING PRIVATE CAN ARRIVE THIS WAY: the
   model reads view/, public/data/ and src/, and never local-data/.
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const STUB = 'src/briefing/briefingData.js';
const norm = (p) => p.split(path.sep).join('/');

/** The module text a build serves in place of the stub: the briefing, as a literal. */
export async function briefingModule(root, now = new Date(), watch = () => {}){
  /* Imported here, not at the top: the model pulls in the registry and the
     engine, which the config itself has no need to bundle. */
  const { briefingFromDisk } = await import(pathToFileURL(path.resolve(root, 'src/briefing/disk.js')).href);
  const data = await briefingFromDisk({ root, now, watch });
  return `export const BRIEFING = ${JSON.stringify(data)};\n`;
}

export default function briefing(){
  let root = process.cwd();
  return {
    name: 'bess-briefing',
    configResolved(config){ root = config.root || root; },

    async load(id){
      if (!norm(id.split('?')[0]).endsWith('/' + STUB)) return null;
      return briefingModule(root, new Date(), (file) => this.addWatchFile(file));
    },
  };
}
