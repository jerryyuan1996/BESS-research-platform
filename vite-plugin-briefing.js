/* ---------------------------------------------------------------------------
   BRIEFING PLUGIN — the page gets the briefing, not the engine that made it.

   Three stubs are replaced here with the briefing the model builds from the view
   store, the changelog and the published summaries (src/briefing/disk.js),
   written out as literals:

     src/briefing/homeData.js       what the home page carries: the briefing
                                    less the analyst queue's words
     src/briefing/briefingData.js   the whole briefing, for /desk
     src/briefing/designData.js     what to build, for a dashboard's deep tabs

   The same function builds the weekly digest, so the page and the digest are
   one computation. It runs at build time, and a build follows every data
   refresh that changes anything, so the briefing is as current as the data.
   Dates in it are absolute; a page cuts "since your last visit" and "coming"
   on the reader's own clock.

   ON THE DEV SERVER the model's own modules are imported once and kept for the
   life of the server, so an edit to src/briefing/ or the engine needs a
   restart; an edit to the view store or the data does not.

   READ-ONLY. Nothing here writes. NOTHING PRIVATE CAN ARRIVE THIS WAY: the
   model reads view/, public/data/ and src/, and never local-data/.
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FULL = 'src/briefing/briefingData.js';
const HOME = 'src/briefing/homeData.js';
const DESIGN = 'src/briefing/designData.js';
const norm = (p) => p.split(path.sep).join('/');

/* Imported on use, not at the top: the model pulls in the registry and the
   engine, which the config itself has no need to bundle. */
const load = (root, file) => import(pathToFileURL(path.resolve(root, file)).href);

/** The module text a build serves in place of the full stub. */
export async function briefingModule(root, now = new Date(), watch = () => {}){
  const { briefingFromDisk } = await load(root, 'src/briefing/disk.js');
  const data = await briefingFromDisk({ root, now, watch });
  return `export const BRIEFING = ${JSON.stringify(data)};\n`;
}

/** The module text a build serves in place of the home stub. */
export async function homeModule(root, now = new Date(), watch = () => {}){
  const { briefingFromDisk } = await load(root, 'src/briefing/disk.js');
  const { homeProjection } = await load(root, 'src/briefing/model.js');
  const data = homeProjection(await briefingFromDisk({ root, now, watch }));
  return `export const HOME_BRIEFING = ${JSON.stringify(data)};\n`;
}

/** The module text a build serves in place of the design stub. */
export async function designModule(root, now = new Date(), watch = () => {}){
  const { briefingFromDisk } = await load(root, 'src/briefing/disk.js');
  const { designProjection } = await load(root, 'src/briefing/model.js');
  const data = designProjection(await briefingFromDisk({ root, now, watch }));
  return `export const DESIGN = ${JSON.stringify(data)};\n`;
}

export default function briefing(){
  let root = process.cwd();
  return {
    name: 'bess-briefing',
    configResolved(config){ root = config.root || root; },

    async load(id){
      const file = norm(id.split('?')[0]);
      const watch = (f) => this.addWatchFile(f);
      if (file.endsWith('/' + FULL)) return briefingModule(root, new Date(), watch);
      if (file.endsWith('/' + HOME)) return homeModule(root, new Date(), watch);
      if (file.endsWith('/' + DESIGN)) return designModule(root, new Date(), watch);
      return null;
    },
  };
}
