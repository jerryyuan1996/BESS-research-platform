/* ---------------------------------------------------------------------------
   SCOUT PLUGIN — scout cards reach the page in two sizes.

   view/scout/<id>.json is a whole card: facts with their quotations, a reason
   in two languages for each of twelve grades, four verdicts. Nine of them are
   far more than the home page should carry to print nine rows, so this hands
   over two things and keeps them apart:

     src/scout/scoutIndex.js   each card's four calls and nothing else. The
                               home board imports it, for its rows below the
                               scouting divider.
     src/scout/scoutCards.js   the cards whole, with what the pass log says
                               about them. Only the /scout page imports it, and
                               that page is loaded on demand.

   Both stubs are real files, for the reason vite-plugin-local-data.js gives:
   plain Node imports this tree in the test suite. Both are replaced in the dev
   server and in a build: a card is public.

   A market's name and region are NOT here. They are the analyst's, in
   src/governance/scout.js, and the pages read them from there.

   READ-ONLY. Nothing here writes to view/. The only writer is
   etl/lib/viewWriter.mjs.
   --------------------------------------------------------------------------- */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { cleanStreak, graduationProgress, cardIsEmpty } from './view/schema/scout.mjs';
import { SCOUT_IDS } from './src/governance/scout.js';

const INDEX_STUB = 'src/scout/scoutIndex.js';
const CARDS_STUB = 'src/scout/scoutCards.js';
const SCOUT_DIR = 'view/scout';
const PASSES = 'view/scout/passes.jsonl';
const CHANGELOG = 'view/changelog.jsonl';

/** Each written card's calls: { id: { archetype: { call, route } } }. What the home board prints. */
export function scoutIndex(cards){
  const index = {};
  for (const card of cards){
    if (cardIsEmpty(card)) continue;
    index[card.id] = Object.fromEntries(Object.entries(card.verdicts).map(([id, v]) => [id, { call: v.call, route: v.route }]));
  }
  return index;
}

/**
 * What the /scout page reads: the cards, when each was last covered by a
 * pass, how far each is toward graduation, and the streak of clean passes.
 */
export function scoutData(cards, passes, changelog){
  const written = cards.filter(card => !cardIsEmpty(card));
  const lastPass = {}, graduation = {};
  for (const card of written){
    lastPass[card.id] = passes.filter(p => p.cards.includes(card.id)).map(p => p.run).sort().pop() ?? null;
    graduation[card.id] = graduationProgress(card, passes, changelog.filter(e => e.market === card.id));
  }
  return {
    cards: Object.fromEntries(written.map(card => [card.id, card])),
    lastPass, graduation,
    streak: cleanStreak(passes), passes: passes.length,
  };
}

const lines = (text) => String(text || '').split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line));
const norm = (p) => p.split(path.sep).join('/');

export default function scout(){
  let root = process.cwd();
  const read = async (rel) => (existsSync(path.resolve(root, rel)) ? readFile(path.resolve(root, rel), 'utf8') : '');

  async function cards(ctx){
    const dir = path.resolve(root, SCOUT_DIR);
    ctx.addWatchFile(dir);
    if (!existsSync(dir)) return [];
    const files = (await readdir(dir)).filter(f => f.endsWith('.json') && SCOUT_IDS.includes(f.slice(0, -5))).sort();
    return Promise.all(files.map(async (f) => {
      ctx.addWatchFile(path.join(dir, f));
      return JSON.parse(await readFile(path.join(dir, f), 'utf8'));
    }));
  }

  return {
    name: 'bess-scout',
    configResolved(config){ root = config.root || root; },

    async load(id){
      const file = norm(id.split('?')[0]);
      if (file.endsWith('/' + INDEX_STUB)){
        return `export const SCOUT_CALLS = ${JSON.stringify(scoutIndex(await cards(this)))};\n`;
      }
      if (file.endsWith('/' + CARDS_STUB)){
        this.addWatchFile(path.resolve(root, PASSES));
        const data = scoutData(await cards(this), lines(await read(PASSES)), lines(await read(CHANGELOG)));
        return `export const SCOUT_DATA = ${JSON.stringify(data)};\n`;
      }
      return null;
    },
  };
}
