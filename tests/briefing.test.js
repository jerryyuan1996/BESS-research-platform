/* ---------------------------------------------------------------------------
   THE BRIEFING MODEL — PR 3 of the guided-experience plan.

   One computation feeds the home page, /desk and the weekly digest
   (src/briefing/). What is held here:

     the ORDER      call first, then value; a design that is not priced or not
                    compliant comes last in its call
     the RULES      when a call runs ahead of or behind its economics, how strong
                    the evidence is, what counts as a change (governance/briefing.js)
     the TAGS       which headline is about which market (governance/newsTags.js)
     the WORDS      every computed sentence comes in both languages, and none hedges
     the WALL       the page and the digest read one computation; neither reads a
                    private file or needs a DOM

   The live store is read with the drafted briefing content laid over it in
   memory when the draft is in the tree (PR 2), so the shortlist has plays to
   order; nothing is written.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { briefingFromDisk } from '../src/briefing/disk.js';
import { renderDigest, weekOf } from '../src/briefing/markdown.js';
import { classifyEntry, spreadMove } from '../src/briefing/changes.js';
import { staleReasons } from '../src/briefing/queue.js';
import { callSentence, marketList, inSentence } from '../src/briefing/sentences.js';
import { tagHeadline } from '../src/governance/newsTags.js';
import {
  disagreementOf, evidenceOf, DISAGREEMENT, EVIDENCE, TIER_ORDER, HEDGE_WORDS, SETUP_UNTIL, tierOf,
} from '../src/governance/briefing.js';
import { ARCHETYPE_IDS, VERDICT_IDS } from '../src/governance/investability.js';
import { briefingModule } from '../vite-plugin-briefing.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOW = new Date('2026-10-19T00:00:00Z');

async function draftOverlay(){
  const tool = path.join(REPO, 'scripts', 'view', 'draft-briefing-content.mjs');
  if (!existsSync(tool)) return [];
  const { briefingChanges } = await import(pathToFileURL(tool).href);
  const { createViewStore } = await import(pathToFileURL(path.join(REPO, 'scripts', 'view', 'writer.mjs')).href);
  return briefingChanges(createViewStore());
}

let cached = null;
const briefing = async () => (cached ??= briefingFromDisk({ now: NOW, overlay: await draftOverlay() }));

const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(s => typeof s === 'string' && s.trim().length > 0);
const hedges = (text) => HEDGE_WORDS.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text));

/* ---- the order ---------------------------------------------------------------- */

test('the shortlist is ordered by call, then value, and an unpriced design comes last in its call', async () => {
  const b = await briefing();
  for (const archetype of ARCHETYPE_IDS){
    const rows = b.lenses[archetype].rows;
    for (let i = 1; i < rows.length; i++){
      const a = rows[i - 1], c = rows[i];
      assert.ok(TIER_ORDER.indexOf(a.tier) <= TIER_ORDER.indexOf(c.tier), `${archetype}: ${a.market} (${a.tier}) before ${c.market} (${c.tier})`);
      if (a.call !== c.call) { assert.ok(VERDICT_IDS.indexOf(a.call) <= VERDICT_IDS.indexOf(c.call) || a.tier !== c.tier); continue; }
      const ea = b.plays[`${a.market}/${a.play}`].econ, ec = b.plays[`${c.market}/${c.play}`].econ;
      const pa = ea.priced && ea.eligible, pc = ec.priced && ec.eligible;
      assert.ok(pa || !pc, `${archetype}: an unpriced ${a.market} sits before a priced ${c.market}`);
      if (pa && pc) assert.ok(ea.value >= ec.value, `${archetype}: ${a.market} (${ea.value}) before ${c.market} (${ec.value}) in one call`);
    }
    for (const r of rows) assert.equal(r.tier, tierOf(r.call));
  }
});

test('every graded market has a row for every investor, and a play with its own call has one more', async () => {
  const b = await briefing();
  const graded = new Set(Object.values(b.lenses.infraFund.rows).map(r => r.market));
  for (const archetype of ARCHETYPE_IDS){
    const markets = new Set(b.lenses[archetype].rows.filter(r => !r.own).map(r => r.market));
    assert.deepEqual([...markets].sort(), [...graded].sort(), `${archetype}: a graded market has no row`);
  }
  const own = Object.values(b.plays).filter(p => !p.implicit);
  if (own.length){
    /* With plays written, Italy carries two for the fund: the market's call and MACSE's own. */
    const italy = b.lenses.infraFund.rows.filter(r => r.market === 'it');
    assert.equal(italy.length, 2);
    assert.ok(italy.some(r => r.own));
  }
});

/* ---- the rules ----------------------------------------------------------------- */

test('a call runs ahead of its economics, or behind them, by rule', () => {
  const priced = (value, eligible = true) => ({ priced: true, eligible, value });
  assert.equal(disagreementOf('enter-now', priced(100)), null);
  assert.equal(disagreementOf('enter-now', priced(-1)), DISAGREEMENT.AHEAD);
  assert.equal(disagreementOf('build-position', priced(120, false)), DISAGREEMENT.AHEAD, 'a design that fails its floor is not a design');
  assert.equal(disagreementOf('build-position', { priced: false }), DISAGREEMENT.AHEAD);
  assert.equal(disagreementOf('build-position', { priced: false, withheld: true }), null, 'a withheld market has no economics to disagree with');
  assert.equal(disagreementOf('opportunistic', priced(-500)), null, 'a situational call names its own price');
  assert.equal(disagreementOf('wait', priced(300), 0.1), DISAGREEMENT.BEHIND);
  assert.equal(disagreementOf('wait', priced(300), 0.6), null);
  assert.equal(disagreementOf('wait', priced(-20), 0), null);
  assert.equal(disagreementOf('not-accessible', priced(300), 0), null, 'a knock-out is not a disagreement');
});

test('evidence is thin on a placeholder, strong only when every reason has a source', () => {
  const econ = (patch = {}) => ({ priced: true, eligible: true, weakInputs: [], ...patch });
  assert.equal(evidenceOf(econ(), ['official', 'derived']), EVIDENCE.STRONG);
  assert.equal(evidenceOf(econ(), ['official', 'practitioner']), EVIDENCE.FAIR);
  assert.equal(evidenceOf(econ(), ['practitioner']), EVIDENCE.THIN);
  assert.equal(evidenceOf(econ({ weakInputs: [{ line: 'capture', basis: 'seed' }] }), ['official']), EVIDENCE.THIN);
  assert.equal(evidenceOf(econ({ eligible: false }), ['official']), EVIDENCE.FAIR);
  assert.equal(evidenceOf({ priced: false }, ['official']), EVIDENCE.THIN);
});

test('a change is a call, a catalyst or a rewrite — never a setup line, a grade or a reason', () => {
  const at = '2026-10-20T09:00:00.000Z';
  const verdict = (patch) => ({ archetype: 'infraFund', call: 'build-position', route: 'ready-to-build', because: [], despite: ['x', 'y'], ...patch });
  const line = (patch) => ({ id: 'x', at, market: 'it', author: { kind: 'analyst' }, reason: ['r', 'r'], evidence: [], ...patch });

  assert.equal(classifyEntry(line({ at: `${SETUP_UNTIL.slice(0, 8)}01T00:00:00.000Z`, path: 'verdicts.infraFund', from: null, to: verdict() })), null, 'the view being written for the first time is not a change');
  assert.equal(classifyEntry(line({ path: 'verdicts.infraFund', from: verdict(), to: verdict({ call: 'wait' }) })).cls, 'call');
  assert.equal(classifyEntry(line({ path: 'verdicts.infraFund', from: verdict(), to: verdict({ despite: ['new', 'new'] }) })), null, 'a reason rewritten is evidence');
  assert.equal(classifyEntry(line({ path: 'verdicts.infraFund', from: verdict(), to: verdict({ play: 'it-cap-4h' }) })), null, 'naming a play is bookkeeping');
  assert.equal(classifyEntry(line({ path: 'verdicts.infraFund', from: verdict(), to: verdict({ route: 'operating' }) })).cls, 'call');
  assert.equal(classifyEntry(line({ path: 'grades.assetReturn', from: { grade: 3 }, to: { grade: 4 } })), null);
  assert.equal(classifyEntry(line({ path: 'plays.it-cap-4h', from: null, to: { label: ['L', 'L'] } })).cls, 'view');
  assert.equal(classifyEntry(line({ path: 'thesis', from: null, to: ['t', 't'] })).cls, 'view');
  const trigger = { id: 'it-x-y', label: ['An event', '事件'], expected: '2026-11-24' };
  assert.equal(classifyEntry(line({ path: 'triggers.it-x-y', from: trigger, to: { ...trigger, outcome: { on: '2026-11-24', text: ['Done.', '完成。'] } } })).cls, 'catalyst');
  assert.equal(classifyEntry(line({ path: 'triggers.it-x-y', from: trigger, to: { ...trigger, expected: '2026-12-15' } })).cls, 'catalyst');
});

test('the changes the briefing carries exclude the setup of the view', async () => {
  const b = await briefing();
  assert.ok(b.changes.every(c => c.at.slice(0, 10) >= SETUP_UNTIL || c.source !== 'changelog'));
  assert.ok(b.changes.every(c => (c.cls === 'news' ? c.title && c.url && c.markets.length : isPair(c.text))));
});

/* ---- the tags ------------------------------------------------------------------ */

test('a headline is tagged by its terms, a market before its country', () => {
  const tag = (title, summary = '') => tagHeadline({ title, summary });
  assert.deepEqual(tag('Western Australia battery wins capacity credits'), ['wa']);
  assert.deepEqual(tag('Australia: 960MWh BESS commissioned'), ['nem']);
  assert.deepEqual(tag('New South Wales BESS earn AU$6 million'), ['nem']);
  assert.deepEqual(tag('Japan opens its fourth long-term auction'), ['jp_hokkaido', 'jp_kyushu', 'jp_tokyo']);
  assert.deepEqual(tag('TEPCO area battery clears in Tokyo'), ['jp_tokyo']);
  assert.deepEqual(tag('Terna sets MACSE cap'), ['it']);
  assert.deepEqual(tag('GB Energy backs storage'), ['gb']);
  assert.deepEqual(tag('El Salvador announces 1 GWh battery push'), []);
  assert.deepEqual(tag('Greek PM inaugurates 790MWh BESS'), []);
});

/* ---- the data ------------------------------------------------------------------ */

test('a spread move is the last week against the ninety days before it', () => {
  const day = (i, spread) => ({ d: new Date(Date.UTC(2026, 6, 1) + i * 86_400_000).toISOString().slice(0, 10), spread });
  const steady = Array.from({ length: 97 }, (_, i) => day(i, 100));
  assert.equal(spreadMove({ daily: steady, units: { price: 'AUD/MWh' } }, 'wa'), null);
  const jumped = [...steady.slice(0, 90), ...Array.from({ length: 7 }, (_, i) => day(90 + i, 150))];
  const move = spreadMove({ daily: jumped, units: { price: 'AUD/MWh' }, datasetId: 'wa-wem-prices' }, 'wa');
  assert.equal(move.cls, 'data');
  assert.equal(move.share, 0.5);
  assert.ok(isPair(move.text));
  assert.equal(spreadMove({ daily: steady.slice(0, 20) }, 'wa'), null, 'too short a series says nothing');
});

test('a grade reason that quotes an engine figure the engine no longer gives is queued', async () => {
  const view = { grades: {
    assetReturn: { reason: ['Ninth of fourteen markets on hold IRR, 4.7%.', '…'] },
    revenueCertainty: { reason: ['10% of revenue is secured, for fifteen years.', '…'] },
  } };
  assert.deepEqual(staleReasons(view, { hold: 0.051, secured: 0.117 }).map(s => s.dimension), ['assetReturn', 'revenueCertainty']);
  assert.deepEqual(staleReasons(view, { hold: 0.047, secured: 0.10 }), []);
  const b = await briefing();
  assert.ok(b.queue.every(q => isPair(q.text) && typeof q.path === 'string'));
});

/* ---- the words ----------------------------------------------------------------- */

test('every computed sentence comes in both languages, and none hedges', async () => {
  const b = await briefing();
  const texts = [];
  for (const archetype of ARCHETYPE_IDS){
    texts.push(b.lenses[archetype].call);
    for (const r of b.lenses[archetype].rows) if (r.flag) texts.push(r.flagText);
  }
  for (const line of b.build) texts.push(line.line);
  for (const c of b.changes) if (c.cls !== 'news') texts.push(c.text);
  for (const q of b.queue) texts.push(q.text);
  for (const t of texts){
    assert.ok(isPair(t), `not an [en, zh] pair: ${JSON.stringify(t)}`);
    assert.deepEqual(hedges(t[0]), [], `hedges: ${t[0]}`);
    assert.ok(!/undefined|NaN|\[object/.test(t.join(' ')), `a hole in: ${t.join(' / ')}`);
  }
  assert.equal(inSentence('Capacity market'), 'capacity market');
  assert.equal(inSentence('Reserve Capacity Mechanism'), 'Reserve Capacity Mechanism');
  assert.equal(inSentence('MACSE'), 'MACSE');
  assert.deepEqual(marketList(['ie', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido']), ['Ireland and Japan', '爱尔兰和日本']);
});

test('the call names the top play, the waiting ones and the next date, and nothing when there is nothing', () => {
  const row = (market, tier, call, econ, label, extra = {}) => ({ market, tier, call, econ, play: { label: [label, label] }, flag: null, ...extra });
  const rows = [
    row('it', 'pursue', 'enter-now', { priced: true, eligible: true, value: 295000, exit: 0.184 }, 'Capacity market · 4h'),
    row('jp_tokyo', 'prepare', 'build-position', { priced: true, eligible: false, value: 112000 }, 'LTDA · 6h', { flag: 'ahead' }),
    row('pl', 'watch', 'wait', { priced: true, eligible: true, value: -269000 }, 'Capacity market · 2h'),
  ];
  const [en, zh] = callSentence(rows, 'infraFund', { label: ['Second MACSE auction', '第二轮MACSE拍卖'], expected: '2026-11-24' }, 'exit');
  assert.match(en, /^One play clears a fund's bar today: Italy · Capacity market · 4h, at 18\.4% exit IRR/);
  assert.match(en, /Tokyo waits on a design that holds its floor/);
  assert.match(en, /Watch Poland\./);
  assert.match(en, /Next decisive date: 24 November 2026\. Second MACSE auction\.$/);
  assert.match(zh, /^今天有一个方案达到基金的门槛/);
  assert.match(callSentence([], 'developer', null, 'hold')[0], /^No play clears a developer's bar today\.$/);
});

/* ---- the wall ------------------------------------------------------------------ */

test('the page and the digest read one computation', async () => {
  const text = await briefingModule(REPO, NOW);
  const fromPlugin = JSON.parse(text.replace(/^export const BRIEFING = /, '').replace(/;\n$/, ''));
  assert.deepEqual(fromPlugin, JSON.parse(JSON.stringify(await briefingFromDisk({ now: NOW }))));
  const digest = renderDigest(await briefing());
  for (const heading of ['## What changed in the last 7 days', '## What\'s coming in 90 days', '## What to build', '## Your next actions', '## Analyst queue',
    '## 应建什么', '## 下一步行动']){
    assert.ok(digest.includes(heading), `the digest has no "${heading}"`);
  }
  assert.ok(!/undefined|NaN/.test(digest));
  const b=await briefing();
  const sample={market:'gb',hours:4,stage:'operating',priceUSDPerMW:123456,targetReturn:.12,returnBasis:'equity',route:'hold',currency:'GBP'};
  const priced=renderDigest({...b,acquisitions:{...b.acquisitions,[b.defaultLens]:[sample]}});
  assert.ok(priced.includes('$123,456') && priced.includes('12.0%') && priced.includes('GBP'));
  const unpriced=renderDigest({...b,acquisitions:{[b.defaultLens]:[]}});
  assert.ok(!unpriced.includes('## Projects to look for') && !unpriced.includes('## 值得筛选的收购方向'));
  const purchaseSection=priced.split('## Projects to look for')[1].split('## What to build')[0];
  assert.ok(!purchaseSection.includes('runs ahead of the economics'));
  assert.equal(weekOf(new Date('2026-10-18T23:07:00Z')), '2026-10-19', 'Sunday 23:07 UTC is Monday morning in Perth');
});

test('the briefing reads no private file and needs no DOM', async () => {
  const dir = path.join(REPO, 'src', 'briefing');
  const files = [...(await readdir(dir)).map(f => path.join(dir, f)), path.join(REPO, 'vite-plugin-briefing.js'),
    path.join(REPO, 'src', 'governance', 'briefing.js'), path.join(REPO, 'src', 'governance', 'newsTags.js')];
  for (const file of files){
    const source = await readFile(file, 'utf8');
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    assert.ok(!/local-data/.test(code), `${path.basename(file)} names the private folder`);
    assert.ok(!/\b(document|window|localStorage)\b/.test(code), `${path.basename(file)} reaches for a DOM`);
  }
});

/* ---- the home page (PR 4) ---------------------------------------------------------- */

test('"since your last visit" survives a reload and moves on a new visit', async () => {
  const { nextSeen } = await import('../src/briefing/since.js');
  const t0 = Date.parse('2026-10-19T08:00:00Z');
  const first = nextSeen({}, t0);
  assert.equal(first.firstVisit, true);
  assert.equal(first.since, t0 - 7 * 86_400_000, 'a first visit reads the last seven days');
  const reload = nextSeen({ at: first.at, prev: first.prev, first: first.firstVisit }, t0 + 5 * 60_000);
  assert.equal(reload.since, first.since, 'a reload inside the gap keeps the same "since"');
  assert.equal(reload.firstVisit, true, 'and is still the first visit');
  const nextWeek = nextSeen({ at: reload.at, prev: reload.prev }, t0 + 7 * 86_400_000);
  assert.equal(nextWeek.firstVisit, false);
  assert.equal(nextWeek.since, reload.at, 'a new visit starts where the last one was seen');
  assert.equal(nextSeen({ at: nextWeek.at, prev: nextWeek.prev }, nextWeek.at + 60_000).since, reload.at);
});

test('the home page carries the briefing less the queue\'s words, and /desk is a route', async () => {
  const { homeProjection } = await import('../src/briefing/model.js');
  const { parseRoute } = await import('../src/app/router.js');
  const b = await briefing();
  const home = homeProjection(b);
  assert.ok(!('queue' in home));
  assert.equal(home.queueSummary.total, b.queue.length);
  assert.equal(Object.values(home.queueSummary.byKind).reduce((a, c) => a + c, 0), b.queue.length);
  assert.deepEqual(home.lenses, b.lenses);
  assert.deepEqual(parseRoute('/desk'), { name: 'desk', region: null });
});

/* ---- the market brief (PR 5) -------------------------------------------------------- */

test('a play carries its bear and bull, and a market its grid with one modelled cell', async () => {
  const b = await briefing();
  const priced = Object.values(b.plays).filter(p => p.econ.priced);
  assert.ok(priced.length > 0);
  for (const p of priced){
    assert.ok('moic' in p.econ && 'payback' in p.econ, `${p.market}/${p.id}: no MOIC or payback`);
    if (p.econ.range) for (const end of ['bear', 'bull']) assert.ok(p.econ.range[end] === null || 'hold' in p.econ.range[end]);
  }
  for (const [market, grid] of Object.entries(b.grids)){
    if (!grid) { assert.equal(market, 'fi', 'only Finland is withheld'); continue; }
    const modelled = grid.cells.filter(c => c.archetype);
    assert.equal(modelled.length, 1, `${market}: one modelled design, on the base route`);
    assert.equal(modelled[0].route, grid.baseRoute);
    assert.ok(grid.cells.filter(c => c.best).length <= 1, `${market}: one best design at most`);
  }
});

/* ---- the weekly digest's job (PR 6) ----------------------------------------------- */

test('the weekly briefing posts on Monday morning in Perth, reads only, and never refreshes data', async () => {
  const wf = await readFile(path.join(REPO, '.github', 'workflows', 'etl.yml'), 'utf8');
  const start = wf.indexOf('\n  weekly-briefing:\n');
  assert.ok(start > 0, 'no weekly-briefing job');
  const job = wf.slice(start).split('\n').filter(line => !/^\s*#/.test(line)).join('\n');
  assert.match(wf, /cron: '7 23 \* \* 0'/, 'Sunday 23:07 UTC is Monday 07:07 in Perth');
  assert.match(job, /if: github\.event\.schedule == '7 23 \* \* 0' \|\| inputs\.weekly_briefing == true/);
  assert.match(job, /permissions:\s*\n\s*contents: read\s*\n\s*issues: write/);
  assert.ok(!/contents: write|pull-requests: write/.test(job), 'the weekly job can write to the repository');
  assert.match(job, /node scripts\/briefing\/weekly\.mjs > briefing\.md/);
  assert.ok(!/ANTHROPIC_API_KEY|agent\/run\.mjs/.test(job), 'the weekly briefing asks no model');
  assert.ok(!/git (add|commit|push)/.test(job), 'the weekly job commits nothing');
  /* One issue a week: an existing one for the week is edited, not duplicated. */
  assert.match(job, /gh issue edit "\$EXISTING" --body-file briefing\.md/);
  /* The data refresh does not run on the briefing's schedule or when it is dispatched. */
  const refresh = wf.slice(wf.indexOf('\n  refresh:\n'), wf.indexOf('\n  publish:\n'));
  assert.match(refresh, /github\.event\.schedule != '7 23 \* \* 0'/);
  assert.match(refresh, /inputs\.weekly_briefing != true/);
});
