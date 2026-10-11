/* ---------------------------------------------------------------------------
   THE HOME PAGE'S BOARD — the arrangement, checked against the committed view.

   The verdicts themselves are the analyst's and are pinned in view.test.js.
   What is pinned here is what the home page does with them, because each of
   these is a rule the plan states and a renderer could quietly break:

     - every registered market is on the board, graded or not
     - an ungraded market shows a return and never a verdict
     - where a ceiling applies the row leads with the barrier, not the score
     - a market the engine does not price has its Return pillar withheld
     - rows are ordered by verdict, then fit
     - a verdict that disagrees with its score carries the flag
     - the calendar loses no trigger, and the changelog reaches the page as
       ten short lines and nothing else
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { markets } from '../src/markets/registry.js';
import { viewFor, hasView, allTriggers, viewFileMarketIds } from '../src/markets/viewRegistry.js';
import { ledgerFor } from '../src/entry/ledgerRegistry.js';
import { FX } from '../src/comparison/assumptions.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { VERDICT, VERDICT_IDS, ARCHETYPE_IDS, PILLARS } from '../src/governance/investability.js';
import { NOT_ACCESSIBLE } from '../src/governance/archetypes.js';
import {
  buildBoard, resolveLens, marketReturn, returnKeyFor, monthsFrom, triggerCalendar, changesThisWeek,
} from '../src/home/boardModel.js';
import { digestChangelog, RECENT_CHANGES } from '../vite-plugin-view-changes.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ON = '2026-10-11';

/* Source with its comments removed: the boundary checks below are about what
   the code does, and the comments name the very things it must not do. */
const code = async (rel) => (await readFile(path.join(REPO, rel), 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const board = (lens = null, on = ON) => buildBoard(markets, { lens, on, usdPer: FX, viewFor, ledgerFor });

test('every registered market is on the board, and four of them are graded', () => {
  const b = board();
  assert.equal(b.rows.length, markets.length);
  assert.deepEqual(new Set(b.rows.map(r => r.market.manifest.id)), new Set(markets.map(m => m.manifest.id)));
  assert.equal(b.gradedCount, 4);
  assert.equal(b.ungradedCount, markets.length - 4);
  for (const r of b.rows) assert.equal(r.graded, hasView(r.market.manifest.id));
});

test('a market that has not been graded shows its return and no verdict', () => {
  for (const lens of [null, ...ARCHETYPE_IDS]){
    for (const r of board(lens).rows.filter(r => !r.graded)){
      const id = r.market.manifest.id;
      assert.equal(r.cells, null, `${id}: an ungraded market must carry no verdict cells`);
      assert.equal(r.cell, null);
      assert.equal(r.ret.withheld, false, `${id}: its return is what the row shows`);
      assert.ok(Number.isFinite(r.ret.hold.base), `${id}: a base hold IRR`);
    }
  }
});

test('the return on the board is the engine\'s own figure, not a second calculation', () => {
  for (const m of markets.filter(m => m.comparison.engineReady !== false)){
    const engine = runBaseCase(m, 5);
    const shown = marketReturn(m, 5);
    assert.equal(shown.hold.base, engine.irrHold, `${m.manifest.id}: hold IRR`);
    assert.equal(shown.exit.base, engine.irrExit, `${m.manifest.id}: exit IRR`);
  }
});

test('Finland has verdicts and its Return pillar is withheld', () => {
  const fi = board('foreignFirstTimer').rows.find(r => r.market.manifest.id === 'fi');
  assert.equal(fi.graded, true);
  assert.equal(fi.ret.withheld, true, 'the engine does not price Finland');
  for (const id of ARCHETYPE_IDS){
    const cell = fi.cells[id];
    assert.ok(VERDICT_IDS.includes(cell.call), `${id}: Finland still has a verdict`);
    assert.equal(cell.returnWithheld, true);
    assert.equal(cell.pillars.return, null, `${id}: no Return score may be shown for a withheld return`);
    for (const p of PILLARS.filter(p => p !== 'return')) assert.ok(Number.isFinite(cell.pillars[p]), `${id}: ${p}`);
  }
});

test('where a ceiling applies the row leads with the barrier and names it', () => {
  let closed = 0;
  for (const lens of ARCHETYPE_IDS){
    for (const r of board(lens).rows.filter(r => r.graded)){
      const cell = r.cell;
      const at = `${r.market.manifest.id}/${lens}`;
      if (cell.headline === 'ceiling'){
        closed++;
        assert.ok(cell.barriers.length > 0, `${at}: a closed row must say what shuts the investor out`);
        for (const b of cell.barriers) assert.ok(b.text[0] && b.text[1], `${at}: a barrier is bilingual`);
      } else {
        assert.equal(cell.headline, 'fit');
        assert.deepEqual(cell.barriers, [], `${at}: an open row names no barrier`);
      }
    }
  }
  assert.ok(closed >= 2, 'the plan\'s Western Australia case must be on the board');

  /* The case the plan was written around: the developer is shut out of
     Western Australia by money, and the board quotes the money. */
  const wa = board('developer').rows.find(r => r.market.manifest.id === 'wa').cell;
  assert.equal(wa.call, VERDICT.NOT_ACCESSIBLE);
  assert.equal(wa.headline, 'ceiling');
  assert.match(wa.barriers[0].text[0], /USD [\d.]+m, against a limit of USD 3m/);
});

test('rows are ordered by verdict, then by fit, with ungraded markets after', () => {
  for (const lens of ARCHETYPE_IDS){
    const rows = board(lens).rows;
    const firstUngraded = rows.findIndex(r => !r.graded);
    assert.ok(rows.slice(firstUngraded).every(r => !r.graded), `${lens}: ungraded markets come last, together`);
    const graded = rows.slice(0, firstUngraded);
    for (let i = 1; i < graded.length; i++){
      const a = graded[i - 1].cell, b = graded[i].cell;
      const ra = VERDICT_IDS.indexOf(a.call), rb = VERDICT_IDS.indexOf(b.call);
      assert.ok(ra <= rb, `${lens}: ${a.call} must not follow ${b.call}`);
      if (ra === rb) assert.ok(a.fit >= b.fit, `${lens}: within a verdict the better fit comes first`);
    }
    /* Ungraded markets keep registry order: ranking them by return is the
       mistake the board exists to correct. */
    const order = markets.map(m => m.manifest.id);
    const ungraded = rows.slice(firstUngraded).map(r => order.indexOf(r.market.manifest.id));
    assert.deepEqual(ungraded, [...ungraded].sort((a, b) => a - b));
  }
});

test('a verdict the score disagrees with carries the flag onto the board', () => {
  const flagged = [];
  for (const lens of ARCHETYPE_IDS){
    for (const r of board(lens).rows.filter(r => r.graded && r.cell.flag)){
      flagged.push(`${r.market.manifest.id}/${lens}`);
      assert.ok(r.cell.flag.label[0] && r.cell.flag.label[1]);
      /* view.test.js requires the analyst's answer in the store; the board
         must carry it rather than print the flag bare. */
      assert.ok(r.cell.flag.note, `${r.market.manifest.id}/${lens}: the recorded reason travels with the flag`);
    }
  }
  assert.ok(flagged.includes('gb/developer'), 'Great Britain\'s developer verdict sits two bands from its score');
});

test('"changes if" is the next trigger the verdict names, and a closed row needs none', () => {
  for (const lens of ARCHETYPE_IDS){
    for (const r of board(lens).rows.filter(r => r.graded)){
      const { cell } = r;
      const named = cell.verdict.changesIf;
      if (!named.length){ assert.equal(cell.changesIf, null); continue; }
      assert.ok(named.includes(cell.changesIf.id), 'only a trigger the verdict names');
      assert.equal(cell.changesIf.others, named.length - 1);
    }
  }
  /* A trigger whose date has passed is flagged, not hidden. */
  const late = board('foreignFirstTimer', '2031-01-01').rows.find(r => r.market.manifest.id === 'fi').cell.changesIf;
  assert.equal(late.overdue, true);
});

test('with no lens every graded market shows all four verdicts', () => {
  const b = board(null);
  assert.equal(b.lens, null);
  for (const r of b.rows.filter(r => r.graded)){
    assert.equal(r.cell, null);
    assert.deepEqual(Object.keys(r.cells), ARCHETYPE_IDS);
  }
  assert.equal(resolveLens('developer'), 'developer');
  assert.equal(resolveLens(null), null);
  assert.equal(resolveLens('not-an-investor'), null, 'a stale stored preference falls back to all four');
});

test('a holder reads the hold IRR and a seller the exit IRR', () => {
  assert.equal(returnKeyFor('strategic'), 'hold');
  assert.equal(returnKeyFor('infraFund'), 'exit');
  assert.equal(returnKeyFor('foreignFirstTimer'), 'exit');
  assert.equal(returnKeyFor('developer'), 'exit');
  assert.equal(returnKeyFor(null), 'hold');
});

test('no private figure reaches the board unless the caller offers one', () => {
  for (const r of board('developer').rows.filter(r => r.graded)){
    assert.equal(r.cell.confidential, false);
    assert.ok(r.cell.barriers.every(b => !b.confidential));
  }
  /* Offered one, the board uses it for the check and never prints it. */
  const mine = buildBoard(markets, {
    lens: 'developer', on: ON, usdPer: FX, viewFor, ledgerFor,
    privateMetricsFor: (id) => (id === 'fi' ? { preFidCapitalUSD: 987654321 } : {}),
  }).rows.find(r => r.market.manifest.id === 'fi').cell;
  assert.equal(mine.headline, 'ceiling');
  assert.equal(mine.confidential, true);
  assert.ok(mine.barriers.some(b => b.confidential));
  assert.ok(!JSON.stringify(mine.barriers).includes('987'), 'the private figure must not be in the text');
});

/* ---- the trigger calendar --------------------------------------------------- */

test('the calendar reads every market file, graded or not', async () => {
  const onDisk = (await readdir(path.join(REPO, 'view/markets'))).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
  assert.deepEqual([...viewFileMarketIds()].sort(), onDisk.sort(),
    'src/markets/viewRegistry.js must import every file in view/markets, or its triggers are missing from the home page');

  let expected = 0;
  for (const id of onDisk){
    const view = JSON.parse(await readFile(path.join(REPO, 'view/markets', id + '.json'), 'utf8'));
    expected += view.triggers.length;
  }
  assert.equal(allTriggers().length, expected);
  assert.ok(allTriggers().some(t => !hasView(t.market)), 'triggers of ungraded markets are included');
});

test('the calendar window is twelve months from the reader\'s date and loses nothing', () => {
  assert.deepEqual(monthsFrom('2026-10-11', 12).slice(0, 4), ['2026-10', '2026-11', '2026-12', '2027-01']);
  assert.equal(monthsFrom('2026-10-11', 12)[11], '2027-09');

  const all = allTriggers();
  for (const on of ['2026-10-11', '2027-06-30', '2031-01-01']){
    const c = triggerCalendar(all, on);
    assert.equal(c.months.length, 12);
    const placed = c.upcoming.length + c.overdue.length + c.later.length + c.undated.length;
    assert.equal(placed, all.length, `${on}: every trigger is in exactly one group`);
    assert.equal(c.lanes.flatMap(l => l.cells.flat()).length, c.upcoming.length);
    for (const lane of c.lanes) assert.equal(lane.cells.length, 12);
    for (const t of c.upcoming) assert.ok(c.months.includes(t.expected.slice(0, 7)));
    for (const t of c.undated) assert.equal(t.expected, null);
  }
  /* Far enough ahead, every dated trigger is overdue and says so. */
  const late = triggerCalendar(all, '2031-01-01');
  assert.equal(late.upcoming.length, 0);
  assert.equal(late.overdue.length, all.filter(t => t.expected !== null).length);
});

/* ---- what changed ----------------------------------------------------------- */

test('the changelog reaches the page as its last ten lines, reduced to five fields', async () => {
  const text = await readFile(path.join(REPO, 'view/changelog.jsonl'), 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  const digest = digestChangelog(text);

  assert.equal(digest.total, lines.length);
  assert.equal(digest.recent.length, Math.min(RECENT_CHANGES, lines.length));
  for (let i = 1; i < digest.recent.length; i++){
    assert.ok(digest.recent[i - 1].at >= digest.recent[i].at, 'newest first');
  }
  const newest = [...lines].sort((a, b) => b.at.localeCompare(a.at))[0];
  assert.equal(digest.recent[0].at, newest.at);
  for (const entry of digest.recent){
    /* Five fields, and a sixth only on a line a rule wrote: which rule. */
    assert.deepEqual(Object.keys(entry).filter(k => k !== 'rule').sort(), ['at', 'author', 'market', 'path', 'reason'],
      'the before and after records stay in the changelog and out of the bundle');
    assert.equal('rule' in entry, entry.author === 'rule');
    assert.ok(Array.isArray(entry.reason) && entry.reason.length === 2, 'the reason is an [en, zh] pair');
    assert.ok(['analyst', 'rule', 'agent'].includes(entry.author));
  }
  assert.equal(Object.values(digest.perDay).reduce((a, n) => a + n, 0) <= lines.length, true);
  assert.deepEqual(digestChangelog(''), { total: 0, recent: [], perDay: {} });
});

test('"changes this week" counts the seven days ending on the reader\'s date', () => {
  const perDay = { '2026-10-11': 3, '2026-10-05': 2, '2026-10-04': 7, '2026-10-12': 9 };
  assert.equal(changesThisWeek(perDay, '2026-10-11'), 5, 'the 5th to the 11th, and nothing dated after today');
  assert.equal(changesThisWeek(perDay, '2026-10-20'), 0);
  assert.equal(changesThisWeek({}, '2026-10-11'), 0);
});

/* ---- boundaries -------------------------------------------------------------- */

test('the home page writes nothing and reads no private file', async () => {
  for (const rel of ['src/home/boardModel.js', 'src/home/verdictHome.js', 'src/home/verdictBoard.js',
                     'src/home/returnEntryMap.js', 'src/home/triggerCalendar.js', 'src/home/changesPanel.js',
                     'src/markets/viewChanges.js', 'vite-plugin-view-changes.js']){
    const src = await code(rel);
    assert.ok(!/writeFile|appendFile|scripts\/view\/writer/.test(src), `${rel}: must not write the view store`);
    assert.ok(!/from\s+['"][^'"]*local-data/.test(src), `${rel}: must not import from local-data`);
  }
  /* The plugin opens one file, and it is the public changelog. */
  const plugin = await code('vite-plugin-view-changes.js');
  assert.ok(plugin.includes("'view/changelog.jsonl'"));
  assert.ok(!/readFile\([^)]*local/.test(plugin));
});

test('the board model is DOM-free, so the rules above can be tested without a browser', async () => {
  const src = await code('src/home/boardModel.js');
  assert.ok(!/\bdocument\b|\bwindow\b|utils\/dom\.js/.test(src));
  assert.ok(!/new Date\(\)|Date\.now\(\)/.test(src), 'the evaluation date is the caller\'s; no clock is read here');
});

test('nothing closed on the board is closed for a reason the store does not hold', () => {
  for (const lens of ARCHETYPE_IDS){
    for (const r of board(lens).rows.filter(r => r.graded && r.cell.headline === 'ceiling')){
      assert.equal(r.cell.call, NOT_ACCESSIBLE,
        `${r.market.manifest.id}/${lens}: a ceiling the verdict does not acknowledge would be flagged, not shown as settled`);
    }
  }
});
