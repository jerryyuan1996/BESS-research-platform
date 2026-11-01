/* ---------------------------------------------------------------------------
   VIEW-CHANGES PLUGIN — the last few changelog lines reach the page, and the
   rest of the changelog does not.

   view/changelog.jsonl is append-only and every line carries the whole record
   before and after the change. That is what an audit needs and far more than a
   page does: 101 lines were already 86 kB, and the file only grows. The home
   page shows the last ten changes with who made each, what it touched, why and
   when, so that is all this hands over.

   The stub at src/markets/viewChanges.js is a real file, for the reason
   vite-plugin-local-data.js gives: plain Node imports this tree in the test
   suite, and a Vite virtual module does not exist outside Vite. Unlike the
   local-data stubs, this one is replaced in BOTH modes — the changelog is
   public and belongs in a build.

   The /changes route receives a lightweight complete filter index. Full
   before/after records live in lazy twenty-record modules, emitted as normal
   content-hashed build assets and scanned by the same publishing pipeline.
   Every record is preserved; only visible pages are downloaded.

   READ-ONLY. Nothing here writes to view/. The only writer is
   etl/lib/viewWriter.mjs.

   NOTHING PRIVATE CAN ARRIVE THIS WAY. A changelog line holds public text
   only; the analyst's private reasons live in local-data/, which this never
   opens. The `from` and `to` records are dropped all the same, so the digest
   is the five fields below and nothing that was not asked for.
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const STUB = 'src/markets/viewChanges.js';
const FULL_STUB = 'src/markets/viewChangelog.js';
const CHANGELOG = 'view/changelog.jsonl';
const PAGE_MODULE = 'virtual:bess-view-history/';
export const HISTORY_PAGE_SIZE = 20;

/** How many changes the page shows. */
export const RECENT_CHANGES = 10;

/** How many days of per-day counts are kept, back from the newest change. */
export const COUNT_DAYS = 31;

/**
 * Reduces the changelog to what the home page prints.
 *
 * @param text  the whole of changelog.jsonl
 * @returns {{ total, recent, perDay }}
 *   recent  the newest `limit` changes, newest first, each
 *           { at, market, author, path, reason }
 *   perDay  changes per calendar day (UTC) for the COUNT_DAYS up to the newest
 *           change, so the page can say "n changes this week" against the
 *           reader's own date without being handed every line
 */
export function digestChangelog(text, limit = RECENT_CHANGES){
  const lines = String(text || '').split(/\r?\n/).filter(line => line.trim());
  const entries = lines.map(line => JSON.parse(line));
  const newestFirst = [...entries].sort((a, b) => String(b.at).localeCompare(String(a.at)));

  const recent = newestFirst.slice(0, limit).map(entry => ({
    at: entry.at,
    market: entry.market,
    author: entry.author?.kind || null,
    /* Which rule, when a rule made the change: "a rule" is not an answer to
       "who". The id only; the page names it from the trigger it already holds. */
    ...(entry.author?.kind === 'rule' ? { rule: entry.author.rule } : {}),
    path: entry.path,
    reason: entry.reason,
  }));

  const perDay = {};
  if (newestFirst.length){
    const newest = Date.parse(newestFirst[0].at);
    for (const entry of newestFirst){
      if (newest - Date.parse(entry.at) > COUNT_DAYS * 86400000) break;
      const day = String(entry.at).slice(0, 10);
      perDay[day] = (perDay[day] || 0) + 1;
    }
  }
  return { total: entries.length, recent, perDay };
}

/** Every changelog line, as written. What the /changes page reads. */
export function fullChangelog(text){
  return String(text || '').split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line));
}

/** Preserve every record; the route initially downloads only its visible pages. */
export function archiveChangelog(text, pageSize = HISTORY_PAGE_SIZE){
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid history page size');
  const entries = fullChangelog(text).sort((a,b) => String(b.at).localeCompare(String(a.at)));
  const pages = [];
  for (let i = 0; i < entries.length; i += pageSize) pages.push(entries.slice(i, i + pageSize));
  const index = entries.map((e,i) => ({id:e.id,at:e.at,market:e.market,author:{kind:e.author?.kind},page:Math.floor(i/pageSize)}));
  const labels = {};
  // Chronological traversal preserves the latest label for retired triggers.
  for (const e of [...entries].reverse()) {
    const [section,key] = e.path.split('.'), record = e.to || e.from;
    if (section === 'triggers' && key && Array.isArray(record?.label)) labels[`${e.market}/${key}`] = record.label;
  }
  return {index,pages,labels};
}

const norm = (p) => p.split(path.sep).join('/');

export default function viewChanges(){
  let root = process.cwd();
  return {
    name: 'bess-view-changes',
    configResolved(config){ root = config.root || root; },
    resolveId(id){ if (id.startsWith(PAGE_MODULE)) return '\0' + id; },

    async load(id){
      if (id.startsWith('\0' + PAGE_MODULE)) {
        const source = path.resolve(root, CHANGELOG);
        this.addWatchFile(source);
        const archive = archiveChangelog(existsSync(source) ? await readFile(source,'utf8') : '');
        const page = Number(id.slice(PAGE_MODULE.length + 1));
        if (!Number.isInteger(page) || !archive.pages[page]) throw new Error('Unknown history page');
        return `export default ${JSON.stringify(archive.pages[page])};\n`;
      }
      const file = norm(id.split('?')[0]);
      const full = file.endsWith('/' + FULL_STUB);
      if (!full && !file.endsWith('/' + STUB)) return null;
      const source = path.resolve(root, CHANGELOG);
      this.addWatchFile(source);
      if (full){
        const archive = archiveChangelog(existsSync(source) ? await readFile(source, 'utf8') : '');
        const loaders = archive.pages.map((_,i) => `()=>import(${JSON.stringify(PAGE_MODULE+i)})`).join(',');
        return `export const VIEW_CHANGELOG = ${JSON.stringify(archive.index)};\n` +
          `export const VIEW_TRIGGER_LABELS = ${JSON.stringify(archive.labels)};\n` +
          `const pages=[${loaders}];\nexport const loadChangelogPage=i=>pages[i]().then(m=>m.default);\n`;
      }
      const digest = existsSync(source)
        ? digestChangelog(await readFile(source, 'utf8'))
        : digestChangelog('');
      return `export const VIEW_CHANGES = ${JSON.stringify(digest)};\n`;
    },
  };
}
