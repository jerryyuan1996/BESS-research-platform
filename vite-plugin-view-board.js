/* ---------------------------------------------------------------------------
   VIEW-BOARD PLUGIN — the home page gets each market's grades, calls and
   amounts, and not its words.

   view/markets/<id>.json is a whole market view and src/markets/<id>/
   entryLedger.js a whole ledger: reasons, arguments and forfeiture terms in
   two languages. The home board prints none of them, and carrying them cost
   about five kilobytes a market. So src/markets/viewBoardData.js is replaced
   here with the projection in src/markets/boardProjection.js, written out as a
   literal, and the whole records travel with each market's own dashboard.

   The stub is a real file, for the reason vite-plugin-local-data.js gives:
   plain Node imports this tree in the test suite. There it works the same
   projection out from the same files, and tests/verdict-board.test.js asserts
   the two are one object. It is replaced on the dev server and in a build: a
   view is public.

   READ-ONLY. Nothing here writes to view/. The only writer is
   etl/lib/viewWriter.mjs.

   NOTHING PRIVATE CAN ARRIVE THIS WAY. A market view and a ledger hold public
   text only; the analyst's private reasons live in a folder this never opens.
   --------------------------------------------------------------------------- */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { boardData } from './src/markets/boardProjection.js';

const STUB = 'src/markets/viewBoardData.js';
const VIEW_DIR = 'view/markets';
const MARKET_DIR = 'src/markets';
const LEDGER_FILE = 'entryLedger.js';

const norm = (p) => p.split(path.sep).join('/');

/**
 * The projection, read from disk.
 *
 * @param root   the repository root
 * @param watch  called with every file read, so the dev server reloads on a change
 */
export async function readBoardData(root, watch = () => {}){
  const viewDir = path.resolve(root, VIEW_DIR);
  const views = [];
  for (const name of existsSync(viewDir) ? (await readdir(viewDir)).filter(f => f.endsWith('.json')).sort() : []){
    const file = path.join(viewDir, name);
    watch(file);
    views.push(JSON.parse(await readFile(file, 'utf8')));
  }

  const marketDir = path.resolve(root, MARKET_DIR);
  const ledgers = [];
  for (const entry of (await readdir(marketDir, { withFileTypes: true })).filter(d => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))){
    const file = path.join(marketDir, entry.name, LEDGER_FILE);
    if (!existsSync(file)) continue;
    watch(file);
    /* A ledger is a module of plain data with no imports. The query makes Node
       read it again after an edit instead of answering from its module cache. */
    const stamp = (await readFile(file)).length + '-' + Date.now();
    const module = await import(`${pathToFileURL(file).href}?board=${stamp}`);
    /* One export for a market with one ledger; several where a dashboard
       serves more than one market. */
    for (const value of Object.values(module)){
      for (const ledger of Array.isArray(value) ? value : [value]){
        if (ledger && typeof ledger === 'object' && ledger.marketId && Array.isArray(ledger.items)) ledgers.push(ledger);
      }
    }
  }
  return boardData(views, ledgers);
}

export default function viewBoard(){
  let root = process.cwd();
  return {
    name: 'bess-view-board',
    configResolved(config){ root = config.root || root; },

    async load(id){
      if (!norm(id.split('?')[0]).endsWith('/' + STUB)) return null;
      const data = await readBoardData(root, (file) => this.addWatchFile(file));
      return `export const BOARD = ${JSON.stringify(data)};\n`;
    },
  };
}
