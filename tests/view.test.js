/* ---------------------------------------------------------------------------
   THE VIEW STORE.

   Two things are tested and they are different. The store ON DISK must be
   valid, consistent with its index and fully accounted for by its changelog —
   that is the committed state anyone reading the repository relies on. And the
   WRITER must refuse what it should refuse, which is tested against a
   temporary directory so that no test ever writes the real store.

   The wall this store sits behind is asserted here too: each author writes
   only what its class allows, the store has one writer and two doors, and no
   path spells a change to methodology. Until 2026-10-11 the rule was "only the
   analyst writes the view"; the four tests that pinned it are rewritten below
   to pin what replaced it. What a machine author may and may not do in detail
   is in tests/view-automation.test.js.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  VIEW_SECTIONS, PERMITTED_AUTHORS, LIVE_AUTHORS, HELD_AUTHORS, MACHINE_AUTHORS, emptyView, validateMarketView,
  parsePath, readPath, writePath, buildIndex, validateChangelogEntry, INTERNAL_EVIDENCE, authorMayWrite,
} from '../view/schema/view.mjs';
import { SCOUT_LIVE_AUTHORS, emptyCard, parseScoutPath, readScoutPath, writeScoutPath } from '../view/schema/scout.mjs';
import { isScoutId } from '../src/governance/scout.js';
import { isRule } from '../src/governance/triggers.js';
import { assessMarket, disagreements } from '../src/entry/assessment.js';
import { returnGradesFor } from '../src/comparison/returnGrades.js';
import { ledgerFor } from '../src/entry/ledgerRegistry.js';
import { FX } from '../src/comparison/assumptions.js';
import { NOT_ACCESSIBLE } from '../src/governance/archetypes.js';
import { BASIS } from '../src/governance/investability.js';
import { createViewStore, ViewRejected, VIEW_ROOT } from '../scripts/view/writer.mjs';
import { byId } from '../src/markets/registry.js';
import { ARCHETYPE_IDS, DIMENSION_IDS } from '../src/governance/investability.js';
import { SOURCE_DECISION_PROFILE } from '../src/governance/triggers.js';
import { markets as registered } from '../src/markets/registry.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { supportedStrategies, STRATEGIES } from '../src/comparison/strategies.js';
import { REVENUE_ROUTES, playsOf, playCall, validatePlay, playTitle } from '../src/governance/plays.js';
import { validateTrigger, overdue } from '../src/governance/triggers.js';
import { triggerCalendar } from '../src/home/boardModel.js';

const committed = createViewStore();

/* The date the committed store is read at. Fixed, so that a held view reaching
   its review date changes what the page shows and not whether the suite
   passes: these tests are about the store as committed, not about today. */
const ON = '2026-10-11';

const analyst = { kind: 'analyst' };
const reason = ['Because the source says so.', '因为来源如此表述。'];

const trigger = (patch = {}) => ({
  id: 'fi-an-event', kind: 'event', market: 'fi', label: ['An event', '一个事件'],
  expected: '2027-04', watches: ['foreignEntry'], direction: 'down', source: 'a-source', effect: null, ...patch,
});
const grade = (patch = {}) => ({
  dimension: 'foreignEntry', grade: 4, trend: 'stable', basis: 'practitioner', evidence: [],
  asOf: '2026-10-10', author: 'analyst', lockedUntil: null, ...patch,
});
const verdict = (patch = {}) => ({
  archetype: 'developer', call: 'build-position', route: 'greenfield', where: null,
  because: [{ dimension: 'gridScarcity', text: ['Capacity is the scarce asset.', '并网容量才是稀缺资源。'] }],
  despite: ['Nothing is contracted.', '没有任何合同化收入。'],
  changesIf: ['fi-an-event'], reviewBy: '2027-01-31', author: 'analyst', asOf: '2026-10-10', lockedUntil: null, ...patch,
});

/* A play: one design worth an investor's attention (governance/plays.js). */
const play = (patch = {}) => ({
  id: 'fi-mer-2h', label: ['Merchant · 2h', '纯市场化 · 2小时'],
  route: 'mer', hours: 2, stage: 'ready-to-build',
  why: ['A line on why this design.', '一句说明为何选此方案。'],
  action: { text: ['The next concrete step.', '下一步的具体行动。'], due: '2026-12-31' },
  author: 'analyst', asOf: '2026-10-16', lockedUntil: null, ...patch,
});

async function scratch(run){
  const root = await mkdtemp(path.join(tmpdir(), 'bess-view-'));
  try { await run(createViewStore(root), root); }
  finally { await rm(root, { recursive: true, force: true }); }
}

const rejects = (promise, pattern) => assert.rejects(promise, (error) => {
  assert.ok(error instanceof ViewRejected, `expected a ViewRejected, got ${error?.name}: ${error?.message}`);
  assert.match(error.message, pattern);
  return true;
});

/* ---- the store on disk ------------------------------------------------------ */

test('every committed market view is valid and belongs to a registered market', async () => {
  const views = await committed.readAll();
  assert.ok(views.length > 0, 'the store is empty');
  for (const view of views){
    assert.deepEqual(validateMarketView(view), [], `${view.marketId}: view is invalid`);
    assert.ok(byId(view.marketId), `${view.marketId}: a view for a market that is not registered`);
  }
  const files = (await readdir(path.join(VIEW_ROOT, 'markets'))).sort();
  assert.deepEqual(files, views.map(v => `${v.marketId}.json`).sort(), 'a file is named for a different market than it holds');
});

test('the committed index is exactly what the market views produce', async () => {
  const index = JSON.parse(await readFile(path.join(VIEW_ROOT, 'index.json'), 'utf8'));
  assert.deepEqual(index, buildIndex(await committed.readAll()));
});

test('the changelog accounts for the committed store, line by line', async () => {
  /* Replaying every entry from nothing must arrive at the files on disk. A
     hand edit to a market file — the one way round the writer — breaks this. */
  /* TWO TIERS, ONE CHANGELOG. A line with no `tier` is a market's and replays
     into view/markets/; a line that says `tier: 'scout'` is a card's and
     replays into view/scout/. Each tier must arrive at its own files, and a
     line is read against its own tier's paths and no other's. */
  const entries = await committed.changelog();
  assert.ok(entries.length > 0);
  const replayed = new Map(), replayedCards = new Map();
  const ids = new Set();
  for (const entry of entries){
    assert.ok(!ids.has(entry.id), `${entry.id}: changelog id repeats`);
    ids.add(entry.id);
    assert.equal(entry.tier === 'scout', isScoutId(entry.market), `${entry.id}: the tier a line claims is not the one its market is in`);
    if (entry.tier === 'scout'){
      assert.deepEqual(validateChangelogEntry(entry, { parse: parseScoutPath }), [], `${entry.id}: changelog entry is invalid`);
      const before = replayedCards.get(entry.market) || emptyCard(entry.market);
      assert.deepEqual(readScoutPath(before, entry.path), entry.from, `${entry.id}: "from" does not match the state the earlier entries leave`);
      replayedCards.set(entry.market, writeScoutPath(before, entry.path, entry.to));
      continue;
    }
    assert.deepEqual(validateChangelogEntry(entry), [], `${entry.id}: changelog entry is invalid`);
    const before = replayed.get(entry.market) || emptyView(entry.market);
    assert.deepEqual(readPath(before, entry.path), entry.from, `${entry.id}: "from" does not match the state the earlier entries leave`);
    replayed.set(entry.market, writePath(before, entry.path, entry.to));
  }
  const views = await committed.readAll();
  assert.deepEqual([...replayed.keys()].sort(), views.map(v => v.marketId).sort());
  for (const view of views) assert.deepEqual(replayed.get(view.marketId), view, `${view.marketId}: the file differs from its changelog`);
  const cards = await committed.readAllCards();
  assert.deepEqual([...replayedCards.keys()].sort(), cards.map(c => c.id).sort());
  for (const card of cards) assert.deepEqual(replayedCards.get(card.id), card, `${card.id}: the card differs from its changelog`);

  const stamps = entries.map(e => e.at);
  assert.deepEqual(stamps, [...stamps].sort(), 'the changelog is append-only and in order');
});

test('every committed trigger cites a source that exists', async () => {
  for (const view of await committed.readAll()){
    const { SRC } = await import(`../src/markets/${view.marketId.replace('_', '-')}/sources.js`).catch(() => ({ SRC: null }));
    for (const t of view.triggers){
      if (typeof t.source !== 'string' || t.source === SOURCE_DECISION_PROFILE) continue;
      assert.ok(SRC?.[t.source], `${t.id}: cites "${t.source}", which is not in ${view.marketId}'s register`);
    }
  }
});

test('every committed grade cites evidence a reader can open, or says it is practitioner judgement', async () => {
  for (const view of await committed.readAll()){
    if (!Object.keys(view.grades).length) continue;
    /* Japan's three allocation points share one dashboard and one register. */
    const dir = view.marketId.startsWith('jp_') ? 'jp' : view.marketId.replace('_', '-');
    const { SRC } = await import(`../src/markets/${dir}/sources.js`);
    for (const [id, record] of Object.entries(view.grades)){
      if (record.basis === BASIS.PRACTITIONER) continue;
      for (const key of record.evidence){
        assert.ok(SRC[key] || INTERNAL_EVIDENCE[key], `${view.marketId}/${id}: cites "${key}", which is neither in the register nor a part of the platform`);
      }
    }
  }
});

test('a graded market is graded on every dimension, so every archetype has a score', async () => {
  /* Half-graded is the state the arithmetic refuses to paper over: one missing
     dimension blanks its pillar and the fit. A market is entered whole. */
  const graded = (await committed.readAll()).filter(v => Object.keys(v.grades).length);
  /* The four corners first, then the other eleven as the analyst graded them
     (plan phase 5). Every registered market is graded except Ontario,
     registered on 2026-10-23 and not yet graded. */
  assert.deepEqual(graded.map(v => v.marketId).sort(), registered.map(m => m.manifest.id).filter(id => id !== 'ca_on').sort());
  for (const view of graded){
    assert.deepEqual(Object.keys(view.grades).sort(), [...DIMENSION_IDS].sort(), `${view.marketId}: not graded on every dimension`);
    const result = assessMarket(view, byId(view.marketId), ledgerFor(view.marketId), FX, { on: ON });
    for (const id of ARCHETYPE_IDS){
      const a = result.byArchetype[id];
      assert.ok(a.fit >= 0 && a.fit <= 100, `${view.marketId}/${id}: no score`);
      assert.equal(a.headline, a.ceiling === NOT_ACCESSIBLE ? 'ceiling' : 'fit');
    }
  }
});

test('the plan\'s Western Australia case falls out of the data', async () => {
  /* The reason the whole revision exists: the market with the most secured
     revenue on the platform is closed, at origination, to three of the four
     investors — by the size of the cheque and the security, not by its score.
     Its scores are good. A weighted average would have waved all four in. */
  /* Read at each investor's usual route, so without the verdicts: a verdict
     names its own route, and the fund's is the co-investment tested below. */
  const view = { ...(await committed.read('wa')), verdicts: {} };
  const result = assessMarket(view, byId('wa'), ledgerFor('wa'), FX, { on: ON });
  const at = (id) => result.byArchetype[id];
  assert.equal(at('strategic').ceiling, null);
  assert.equal(at('developer').ceiling, NOT_ACCESSIBLE);
  assert.ok(at('developer').limitsBreached.includes('pre-fid-capital'));
  assert.equal(at('infraFund').ceiling, NOT_ACCESSIBLE);
  assert.equal(at('foreignFirstTimer').ceiling, NOT_ACCESSIBLE);
  /* No score is in the Wait or Avoid band. On the score alone every one of
     these would have been told to go ahead in some form. */
  for (const id of ARCHETYPE_IDS) assert.ok(at(id).fit >= 45, `${id}: the score alone would not have shut it out`);

  /* And the same market is open to the fund as a co-investor. */
  const coInvest = { ...view, verdicts: { infraFund: { call: 'opportunistic', route: 'co-invest' } } };
  assert.equal(assessMarket(coInvest, byId('wa'), ledgerFor('wa'), FX, { on: ON }).byArchetype.infraFund.ceiling, null);
});

test('a market with no ledger can still have its cheque checked', async () => {
  const view = { ...(await committed.read('wa')), verdicts: {} };
  const result = assessMarket(view, byId('wa'), null, FX, { on: ON });
  assert.equal(result.totals, null);
  assert.ok(result.byArchetype.foreignFirstTimer.limitsBreached.includes('cheque'));
  assert.ok(result.byArchetype.developer.limitsUnchecked.includes('pre-fid-capital'));
  assert.deepEqual(disagreements(result), [], 'no verdicts set, nothing to disagree with');
});

test('a committed verdict the score disagrees with says why', async () => {
  /* The analyst sets the call and the score only checks it — but a call two
     bands from its score, or one that ignores a knock-out, must carry its
     reason. A flag with no answer beside it is an unexamined disagreement. */
  let verdicts = 0;
  for (const view of await committed.readAll()){
    if (!Object.keys(view.verdicts).length) continue;
    const result = assessMarket(view, byId(view.marketId), ledgerFor(view.marketId), FX, { on: ON });
    verdicts += Object.keys(view.verdicts).length;
    for (const flag of disagreements(result)){
      const note = view.verdicts[flag.archetype].scoreNote;
      assert.ok(Array.isArray(note) && note[0] && note[1],
        `${view.marketId}/${flag.archetype}: "${flag.call}" disagrees with its score (${flag.kind}) and carries no scoreNote`);
    }
  }
  /* Every graded market by four archetypes; Ontario is not yet graded. */
  assert.equal(verdicts, (registered.length - 1) * ARCHETYPE_IDS.length, 'every graded market by four archetypes');
});

test('every machine-written line in the committed store is accounted for', async () => {
  /* Three kinds of author, two of them live, one that writes a held view. A
     change to any of these lists is a governance decision, not an edit. */
  assert.deepEqual(PERMITTED_AUTHORS, ['analyst', 'rule', 'agent']);
  assert.deepEqual(MACHINE_AUTHORS, ['rule', 'agent']);
  assert.deepEqual(LIVE_AUTHORS, ['analyst', 'rule'], 'the agent runs dry until the analyst makes it live');
  assert.deepEqual(HELD_AUTHORS, ['analyst'], 'this list does not grow');
  /* Scout cards have a live list of their own. The agent joins THAT one when
     the analyst says so, and LIVE_AUTHORS above does not move when it does. */
  assert.deepEqual(SCOUT_LIVE_AUTHORS, ['analyst'], 'the agent runs dry on scout cards until the analyst makes it live there');

  const all = await committed.changelog();
  /* A scout line is the scouting tier's: tests/scout.test.js accounts for
     those. Here, the one thing that must hold of them from this side — */
  for (const entry of all.filter(e => e.tier === 'scout')){
    assert.ok(SCOUT_LIVE_AUTHORS.includes(entry.author.kind), `${entry.id}: written by "${entry.author.kind}", which is not live on scout cards`);
  }
  /* — and the one that must hold of every market, whatever the card list says:
     NO LINE ON A CORE MARKET IS THE AGENT'S. */
  const entries = all.filter(e => e.tier !== 'scout');
  for (const entry of entries){
    assert.notEqual(entry.author.kind, 'agent', `${entry.id}: the agent wrote a core market`);
    assert.ok(!isScoutId(entry.market), `${entry.id}: a market line for a scout id`);
  }
  const views = new Map((await committed.readAll()).map(v => [v.marketId, v]));
  const lastWrite = new Map();

  entries.forEach((entry, i) => {
    const kind = entry.author.kind;
    assert.ok(LIVE_AUTHORS.includes(kind), `${entry.id}: written by "${kind}", which is not live`);
    if (kind === 'rule'){
      /* A rule line traces to a rule the analyst wrote before it fired, and to
         the snapshot it fired on. */
      const armed = entries.slice(0, i).filter(e => e.market === entry.market && e.path === `triggers.${entry.trigger}`).pop();
      assert.ok(armed, `${entry.id}: fired on "${entry.trigger}", which was never written`);
      assert.equal(armed.author.kind, 'analyst', `${entry.id}: its rule was not written by the analyst`);
      assert.ok(isRule(armed.to), `${entry.id}: its trigger carried no effect when it fired`);
      assert.equal(entry.author.rule, entry.trigger);
      for (const e of entry.evidence) assert.match(e.sha256, /^sha256:[0-9a-f]{64}$/, `${entry.id}: evidence with no checksum`);
      assert.ok(entry.evidence.length > 0, `${entry.id}: a rule line with no evidence`);
    }
    /* A trigger that carries an effect is a rule, and only the analyst writes one. */
    if (parsePath(entry.path).section === 'triggers' && isRule(entry.to)){
      assert.equal(kind, 'analyst', `${entry.id}: a rule written by "${kind}"`);
    }
    lastWrite.set(`${entry.market}/${entry.path}`, kind);
  });

  /* The stamp on each record is the author of the last change to it. */
  for (const view of views.values()){
    for (const [section, records] of [['grades', view.grades], ['verdicts', view.verdicts]]){
      for (const [key, record] of Object.entries(records)){
        assert.equal(record.author, lastWrite.get(`${view.marketId}/${section}.${key}`),
          `${view.marketId} ${section}.${key}: stamped "${record.author}", last written by someone else`);
      }
    }
  }
});

/* ---- the schema ------------------------------------------------------------- */

test('a path names one whole record, and no path spells methodology', () => {
  assert.deepEqual(parsePath('grades.foreignEntry'), { section: 'grades', key: 'foreignEntry', layer: null });
  assert.deepEqual(parsePath('verdicts.developer'), { section: 'verdicts', key: 'developer', layer: null });
  assert.deepEqual(parsePath('triggers.fi-an-event'), { section: 'triggers', key: 'fi-an-event', layer: null });
  assert.deepEqual(parsePath('thesis'), { section: 'thesis', key: null, layer: null });
  /* The one layer with a path of its own: the analyst's held view. */
  assert.deepEqual(parsePath('grades.foreignEntry.held'), { section: 'grades', key: 'foreignEntry', layer: 'held' });
  assert.deepEqual(parsePath('plays.it-cap-4h'), { section: 'plays', key: 'it-cap-4h', layer: null });
  assert.deepEqual(VIEW_SECTIONS, ['grades', 'verdicts', 'triggers', 'thesis', 'plays']);
  for (const id of DIMENSION_IDS) assert.ok(parsePath(`grades.${id}`));
  for (const id of ARCHETYPE_IDS) assert.ok(parsePath(`verdicts.${id}`));

  const refused = [
    'weights.developer', 'archetypes.developer.limits', 'anchors.capitalAtRisk', 'reads.gridScarcity',
    'pillarWeight.entry', 'discountRate', 'economics.merchGross', 'assumptions.economics.merchGross',
    'grades.vibes', 'verdicts.tourist',
    /* One field inside a record: the half-edit a whole-record store prevents. */
    'verdicts.developer.call', 'grades.foreignEntry.grade', 'grades.foreignEntry.held.grade',
    'grades.vibes.held', 'verdicts.developer.held',
    /* A play is one whole record too, and its id is a slug. */
    'plays.it', 'plays.IT-cap-4h', 'plays.it_cap_4h', 'plays.it-cap-4h.calls', 'plays.it-cap-4h.calls.infraFund', 'plays.',
    '', 'grades', 'grades.', '../src/governance/archetypes.js', null, undefined, 7,
  ];
  for (const p of refused) assert.equal(parsePath(p), null, `"${p}" parsed as a view-store path`);
});

test('a market view is validated as a whole', () => {
  const good = { ...emptyView('fi'), triggers: [trigger()], grades: { foreignEntry: grade() }, verdicts: { developer: verdict() } };
  assert.deepEqual(validateMarketView(good), []);
  const bad = (edit, pattern) => {
    const view = structuredClone(good); edit(view);
    const problems = validateMarketView(view);
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern}, got ${JSON.stringify(problems)}`);
  };
  bad(v => { v.grades.saturation = grade(); }, /holds a record for "foreignEntry"/);
  bad(v => { v.grades.foreignEntry.grade = 9; }, /grade must be/);
  bad(v => { v.verdicts.strategic = verdict(); }, /holds a record for "developer"/);
  bad(v => { delete v.verdicts.developer.despite; }, /despite is required/);
  bad(v => { v.verdicts.developer.changesIf = ['no-such-trigger']; }, /not a trigger of this market/);
  bad(v => { v.triggers[0].market = 'wa'; }, /belongs to "wa"/);
  bad(v => { v.triggers.push(trigger()); }, /appears twice/);
  bad(v => { v.thesis = 'English only'; }, /thesis must be/);
  bad(v => { v.weights = { entry: 0.9 }; }, /not a section of a market view/);
  bad(v => { v.assumptions = {}; }, /not a section of a market view/);
  assert.deepEqual(validateMarketView({}), ['view has no marketId']);
});

test('a play is a whole design: route, hours, stage, why, action, and calls of its own', () => {
  const good = { ...emptyView('fi'), triggers: [trigger()], grades: { foreignEntry: grade() },
    verdicts: { developer: verdict({ route: 'ready-to-build', play: 'fi-mer-2h' }) },
    plays: { 'fi-mer-2h': play(), 'fi-toll-2h': play({ id: 'fi-toll-2h', route: 'toll',
      calls: { infraFund: verdict({ archetype: 'infraFund', call: 'opportunistic', route: 'ready-to-build' }) } }) } };
  assert.deepEqual(validateMarketView(good), []);
  const bad = (edit, pattern) => {
    const view = structuredClone(good); edit(view);
    const problems = validateMarketView(view);
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern}, got ${JSON.stringify(problems)}`);
  };
  bad(v => { v.plays['fi-mer-2h'].route = 'ppa'; }, /route must be one of/);
  bad(v => { v.plays['fi-mer-2h'].hours = 0; }, /hours must be a number/);
  bad(v => { v.plays['fi-mer-2h'].hours = 400; }, /hours must be a number/);
  bad(v => { v.plays['fi-mer-2h'].stage = 'brownfield'; }, /stage must be one of/);
  bad(v => { v.plays['fi-mer-2h'].why = 'English only'; }, /why must be an \[en, zh\] pair/);
  bad(v => { v.plays['fi-mer-2h'].action.due = '2026-13-01'; }, /action.due must be/);
  bad(v => { delete v.plays['fi-mer-2h'].action; }, /action must be/);
  bad(v => { v.plays['fi-mer-2h'].irr = 0.15; }, /"irr" is not a field of a play/);
  bad(v => { v.plays['fi-mer-2h'].id = 'fi-other'; }, /its id is "fi-other"/);
  bad(v => { delete v.plays['fi-mer-2h'].lockedUntil; }, /lockedUntil must be/);
  /* A verdict names a play that exists, and enters it at the play's stage. */
  bad(v => { v.verdicts.developer.play = 'fi-cap-4h'; }, /not a play of this market/);
  bad(v => { v.verdicts.developer.route = 'greenfield'; }, /enters by "greenfield"/);
  /* A play's own call is a full verdict, entered at the play's stage, on triggers of this market. */
  bad(v => { delete v.plays['fi-toll-2h'].calls.infraFund.despite; }, /despite is required/);
  bad(v => { v.plays['fi-toll-2h'].calls.infraFund.route = 'operating'; }, /the play's stage is "ready-to-build"/);
  bad(v => { v.plays['fi-toll-2h'].calls.infraFund.changesIf = ['no-such-trigger']; }, /not a trigger of this market/);
  bad(v => { v.plays['fi-toll-2h'].calls.strategic = v.plays['fi-toll-2h'].calls.infraFund; }, /holds a record for "infraFund"/);
  /* One design, one call: no own call where the market's verdict already names the play. */
  bad(v => { v.plays['fi-mer-2h'].calls = { developer: verdict({ route: 'ready-to-build' }) }; }, /already names this play/);
  bad(v => { v.plays = []; }, /plays must be an object/);

  /* The call a play carries: its own, or the market's. */
  assert.equal(playCall(good, good.plays['fi-toll-2h'], 'infraFund').own, true);
  assert.equal(playCall(good, good.plays['fi-mer-2h'], 'developer').verdict.call, 'build-position');
  assert.equal(playCall(good, good.plays['fi-mer-2h'], 'strategic'), null);
  assert.deepEqual(playsOf(good).map(p => p.id), ['fi-mer-2h', 'fi-toll-2h']);
  assert.deepEqual(playsOf(emptyView('fi')), []);
});

test('a play\'s route is one of the engine\'s, and every committed play can be priced', async () => {
  assert.deepEqual([...REVENUE_ROUTES].sort(), STRATEGIES.map(s => s.id).sort(), 'the play vocabulary and the engine\'s routes disagree');
  for (const view of await committed.readAll()){
    for (const p of playsOf(view)){
      const market = byId(view.marketId);
      assert.ok(supportedStrategies(market).some(s => s.id === p.route), `${view.marketId} ${p.id}: the market does not support route "${p.route}"`);
      const grid = market.comparison.durationResponse?.hours || [market.comparison.archetype.durationHours];
      assert.ok(grid.includes(p.hours), `${view.marketId} ${p.id}: ${p.hours}h is not on the market's duration grid ${JSON.stringify(grid)}`);
    }
  }
});

test('a trigger\'s outcome closes it: never overdue, and out of the calendar\'s lanes', () => {
  const happened = trigger({ id: 'fi-happened', expected: '2026-09', outcome: { on: '2026-09-15', text: ['It happened.', '已发生。'] } });
  const pending = trigger({ id: 'fi-pending', expected: '2026-09' });
  assert.deepEqual(validateTrigger(happened), []);
  for (const outcome of [{ on: '2026-09', text: ['x', 'y'] }, { on: '2026-09-15', text: 'x' }, { on: '2026-09-15', text: ['x', 'y'], by: 'me' }, 'yes']){
    assert.ok(validateTrigger(trigger({ outcome })).length > 0, `outcome ${JSON.stringify(outcome)} was accepted`);
  }
  assert.deepEqual(overdue([happened, pending], '2026-10-16').map(t => t.id), ['fi-pending']);
  const calendar = triggerCalendar([happened, pending], '2026-10-16');
  assert.deepEqual(calendar.overdue.map(t => t.id), ['fi-pending']);
  assert.deepEqual(calendar.resolved.map(t => t.id), ['fi-happened']);
  assert.deepEqual(calendar.later.map(t => t.id), []);
});

test('only the analyst writes a play, and the last play out removes the section', () => scratch(async (store, root) => {
  assert.equal(authorMayWrite('plays.fi-mer-2h', 'analyst'), true);
  for (const kind of MACHINE_AUTHORS) assert.equal(authorMayWrite('plays.fi-mer-2h', kind), false, `a ${kind} may write a play`);
  for (const kind of MACHINE_AUTHORS){
    await rejects(store.apply({ market: 'fi', path: 'plays.fi-mer-2h', to: play({ author: kind }), reason,
      author: { kind, run: '2026-10-16T00:00:00.000Z' } }), /may not write the view/);
  }
  assert.ok(!existsSync(path.join(root, 'markets')), 'a refused play left something on disk');

  await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst });
  await store.apply({ market: 'fi', path: 'plays.fi-mer-2h', to: play(), reason, author: analyst });
  await rejects(store.apply({ market: 'fi', path: 'plays.fi-toll-2h', to: play({ id: 'fi-toll-2h', author: 'rule' }), reason, author: analyst }), /the change is the analyst's/);
  await store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict({ route: 'ready-to-build', play: 'fi-mer-2h' }), reason, author: analyst });
  const index = JSON.parse(await readFile(path.join(root, 'index.json'), 'utf8'));
  assert.equal(index.fi.developer.play, 'fi-mer-2h', 'the index does not carry the play a verdict names');
  /* A play a verdict names cannot be removed from under it. */
  await rejects(store.apply({ market: 'fi', path: 'plays.fi-mer-2h', to: null, reason, author: analyst }), /not a play of this market/);
  await store.apply({ market: 'fi', path: 'verdicts.developer', to: null, reason, author: analyst });
  await store.apply({ market: 'fi', path: 'plays.fi-mer-2h', to: null, reason, author: analyst });
  await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: null, reason, author: analyst });
  assert.deepEqual(await store.read('fi'), emptyView('fi'));
  const log = await store.changelog();
  assert.ok(log.every(e => validateChangelogEntry(e).length === 0));
}));

/* ---- the writer -------------------------------------------------------------- */

test('a change writes the market file, the index and one changelog line', () => scratch(async (store, root) => {
  const now = new Date('2026-10-11T09:00:00Z');
  const first = await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst }, now);
  assert.equal(first.from, null);
  assert.equal(first.at, '2026-10-11T09:00:00.000Z');

  await store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict(), reason, author: analyst, trigger: 'fi-an-event' },
    new Date('2026-10-11T09:05:00Z'));
  const view = await store.read('fi');
  assert.deepEqual(validateMarketView(view), []);
  assert.equal(view.verdicts.developer.call, 'build-position');

  const index = JSON.parse(await readFile(path.join(root, 'index.json'), 'utf8'));
  assert.deepEqual(index, { fi: { developer: { call: 'build-position', route: 'greenfield', asOf: '2026-10-10', reviewBy: '2027-01-31' } } });

  const log = await store.changelog();
  assert.equal(log.length, 2);
  assert.equal(log[1].trigger, 'fi-an-event');
  assert.deepEqual(log[1].to, verdict());

  /* Replacing a record keeps what it replaced. */
  const changed = await store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict({ call: 'wait' }), reason, author: analyst },
    new Date('2026-10-12T09:00:00Z'));
  assert.equal(changed.from.call, 'build-position');
  assert.equal(changed.to.call, 'wait');
  assert.equal((await store.changelog()).length, 3);
}));

test('each author writes only what its class allows', () => scratch(async (store, root) => {
  /* Something that is not one of the three kinds is refused everywhere. */
  for (const kind of ['etl', 'bot', 'admin', undefined]){
    await rejects(store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: { kind } }), /may not write the view/);
    for (const path of ['grades.foreignEntry', 'verdicts.developer', 'triggers.fi-an-event', 'thesis', 'grades.foreignEntry.held']){
      assert.equal(authorMayWrite(path, kind), false, `"${kind}" may write ${path}`);
    }
  }
  await rejects(store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason }), /may not write the view/);
  assert.ok(!existsSync(path.join(root, 'markets')), 'a refused change left something on disk');

  /* The analyst writes every section. A rule writes grades and verdicts and
     nothing else. An agent has no path to a held view. */
  for (const path of ['grades.foreignEntry', 'verdicts.developer', 'triggers.fi-an-event', 'thesis', 'grades.foreignEntry.held']){
    assert.equal(authorMayWrite(path, 'analyst'), true);
  }
  assert.equal(authorMayWrite('grades.foreignEntry', 'rule'), true);
  assert.equal(authorMayWrite('verdicts.developer', 'rule'), true);
  for (const path of ['thesis', 'triggers.fi-an-event', 'grades.foreignEntry.held']) assert.equal(authorMayWrite(path, 'rule'), false, `a rule may write ${path}`);
  assert.equal(authorMayWrite('grades.foreignEntry.held', 'agent'), false);
  /* And no author at all has a path into methodology. */
  for (const kind of PERMITTED_AUTHORS){
    for (const path of ['weights.developer', 'anchors.capitalAtRisk', 'bands.wait', 'discountRate', 'economics.merchGross']){
      assert.equal(authorMayWrite(path, kind), false, `"${kind}" may write ${path}`);
    }
  }

  /* A machine author with no rule behind it and no evidence gets nowhere,
     even on a path its class may write. The detail is in view-automation. */
  await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst });
  await store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict(), reason, author: analyst });
  const before = await readFile(path.join(root, 'changelog.jsonl'), 'utf8');
  for (const kind of MACHINE_AUTHORS){
    const author = { kind, run: '2026-10-11T00:00:00.000Z' };
    await rejects(store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict({ call: 'wait', author: kind }), reason, author }), /refused to/);
    await rejects(store.apply({ market: 'fi', path: 'verdicts.developer', to: null, reason, author }), /may not remove/);
    await rejects(store.apply({ market: 'fi', path: 'verdicts.strategic', to: verdict({ archetype: 'strategic', author: kind }), reason, author }), /may not create/);
  }
  assert.equal(await readFile(path.join(root, 'changelog.jsonl'), 'utf8'), before, 'a refused machine change reached the changelog');
}));

test('a refused change writes nothing at all', () => scratch(async (store, root) => {
  await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst });
  const snapshot = async () => [
    await readFile(path.join(root, 'markets', 'fi.json'), 'utf8'),
    await readFile(path.join(root, 'index.json'), 'utf8'),
    await readFile(path.join(root, 'changelog.jsonl'), 'utf8'),
  ];
  const before = await snapshot();
  const change = (patch) => ({ market: 'fi', path: 'verdicts.developer', to: verdict(), reason, author: analyst, ...patch });

  await rejects(store.apply(change({ path: 'weights.developer' })), /not a view-store path/);
  await rejects(store.apply(change({ path: 'verdicts.developer.call', to: 'wait' })), /not a view-store path/);
  await rejects(store.apply(change({ reason: ['English only'] })), /reason as an \[en, zh\] pair/);
  await rejects(store.apply(change({ reason: undefined })), /reason as an \[en, zh\] pair/);
  await rejects(store.apply(change({ to: undefined })), /states its new value/);
  await rejects(store.apply(change({ to: verdict({ despite: undefined }) })), /despite is required/);
  await rejects(store.apply(change({ to: verdict({ changesIf: ['no-such-trigger'] }) })), /not a trigger of this market/);
  await rejects(store.apply(change({ to: verdict({ archetype: 'strategic' }) })), /holds a record for "strategic"/);
  await rejects(store.apply(change({ path: 'grades.foreignEntry', to: grade({ grade: 6 }) })), /grade must be/);
  await rejects(store.apply(change({ path: 'triggers.fi-an-event', to: trigger() })), /nothing would change/);
  /* An effect names a field, never a whole record, a held view or methodology. */
  const withEffect = (effect) => change({ path: 'triggers.fi-rule', to: trigger({ id: 'fi-rule', effect, note: reason }) });
  await rejects(store.apply(withEffect([{ path: 'verdicts.developer', to: 'wait' }])), /not a field a rule may change/);
  await rejects(store.apply(withEffect([{ path: 'grades.foreignEntry.held', to: 1 }])), /not a field a rule may change/);
  await rejects(store.apply(withEffect([{ path: 'weights.developer', to: 0.9 }])), /not a field a rule may change/);
  await rejects(store.apply(change({ path: 'triggers.fi-rule', to: trigger({ id: 'fi-rule', effect: [{ path: 'verdicts.developer.call', to: 'wait' }] }) })), /carries a note/);
  await rejects(store.apply(change({ path: 'triggers.fi-data', to: trigger({ id: 'fi-data', kind: 'data' }) })), /states its `when`/);
  /* A record is stamped with the author of the change that writes it. */
  await rejects(store.apply(change({ to: verdict({ author: 'rule' }) })), /the change is the analyst's/);
  await rejects(store.apply(change({ market: '../escape' })), /not a market id/);

  assert.deepEqual(await snapshot(), before);
}));

test('removing a record is a change like any other, and is refused if it would strand a verdict', () => scratch(async (store) => {
  await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst });
  await store.apply({ market: 'fi', path: 'verdicts.developer', to: verdict(), reason, author: analyst });
  await rejects(store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: null, reason, author: analyst }), /not a trigger of this market/);
  await store.apply({ market: 'fi', path: 'verdicts.developer', to: null, reason, author: analyst });
  const removed = await store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: null, reason, author: analyst });
  assert.equal(removed.to, null);
  assert.deepEqual(await store.read('fi'), emptyView('fi'));
}));

test('a dry run and a real run cannot differ, and a dry run writes nothing', () => scratch(async (store, root) => {
  const change = { market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: analyst };
  const now = new Date('2026-10-11T09:00:00Z');
  const { entry } = await store.prepare(change, now);
  assert.ok(!existsSync(path.join(root, 'changelog.jsonl')));
  assert.deepEqual(await store.apply(change, now), entry);
}));

/* ---- the wall ---------------------------------------------------------------- */
test('the view has one writer and two doors', async () => {
  /* Until 2026-10-11 nothing under etl/ could reach the writer. Rules and the
     agent write the view now, so what is pinned is narrower and more exact:
     ONE module writes view/; a machine reaches it from exactly two files; a
     person reaches it through scripts/, which is the only door that reads the
     private overlay; and nothing the browser loads writes the view at all. */
  const walk = async (dir) => {
    const out = [];
    for (const entry of await readdir(dir, { withFileTypes: true })){
      if (entry.name === 'node_modules' || entry.name === 'out') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...await walk(full));
      else if (/\.(m?js)$/.test(entry.name)) out.push(full);
    }
    return out;
  };
  const repo = path.resolve(VIEW_ROOT, '..');
  const rel = (file) => path.relative(repo, file).replace(/\\/g, '/');
  const CORE = /from\s+['"][^'"]*lib\/viewWriter\.mjs['"]/;
  const ANALYST_DOOR = /scripts\/view\/writer|['"][^'"]*\/view\/writer\.mjs['"]/;

  const importers = [];
  for (const dir of ['etl', 'agent', 'scripts', 'src']){
    if (!existsSync(path.join(repo, dir))) continue;
    for (const file of await walk(path.join(repo, dir))){
      const source = await readFile(file, 'utf8');
      if (CORE.test(source)) importers.push(rel(file));
      if (dir === 'src'){
        assert.ok(!/viewWriter|view\/writer/.test(source), `${rel(file)}: the app reaches for the view writer`);
      }
      if (dir === 'etl' || dir === 'agent'){
        /* Automation never sees the private overlay: not the folder, not the
           module that reads it, not the door that does. */
        assert.ok(!ANALYST_DOOR.test(source), `${rel(file)}: automation imports the analyst's door`);
        assert.ok(!/local-data/.test(source), `${rel(file)}: automation names the private folder`);
        assert.ok(!/src\/local\//.test(source), `${rel(file)}: automation imports the private overlay`);
      }
    }
  }
  assert.deepEqual(importers.sort(), ['agent/run.mjs', 'etl/rules.mjs', 'scripts/view/writer.mjs'],
    'the view writer is imported from exactly these three files');

  /* Only the writer itself spells a write to the store. */
  for (const dir of ['etl', 'agent']){
    for (const file of await walk(path.join(repo, dir))){
      if (rel(file) === 'etl/lib/viewWriter.mjs') continue;
      const source = await readFile(file, 'utf8');
      assert.ok(!/['"`]view['"`]|view\/markets|changelog\.jsonl/.test(source), `${rel(file)}: names a view-store file directly`);
    }
  }
  /* No workflow runs the analyst's door: a machine has its own. */
  const workflows = path.join(repo, '.github', 'workflows');
  for (const file of existsSync(workflows) ? await readdir(workflows) : []){
    const source = await readFile(path.join(workflows, file), 'utf8');
    assert.ok(!/scripts\/view\/writer/.test(source), `${file}: a workflow runs the analyst's writer`);
  }
});

test('a derived asset-return grade is the market\'s fifth in the engine\'s ranking', async () => {
  /* Asset return is graded by rank until the terminal-value gate closes
     (plan section 3.5), and nothing computed the rank: the grades were worked
     out by hand. This reports. It writes nothing and proposes no grade: a
     failure says the engine's ordering has moved under a stored grade, which
     is the moment the analyst would want to look.

       fifth = ceil(rank x 5 / n)      rank 1 is the highest hold IRR
       grade = 6 - fifth

     The convention is read off the store, not chosen here: Great Britain is
     ninth of fourteen and was graded 2. A market the engine does not price has
     no rank and is not checked: Finland's grade is a practitioner one. One
     grade serves a holder and a seller only while hold and exit IRR put every
     market in the same fifth, and that is asserted. Since 2026-10-17 the two
     orders differ inside a fifth (WA and Romania swap at the top, NEM and GB
     in the middle) without moving any market's grade. */
  const priced = registered
    .map(m => ({ id: m.manifest.id, result: runBaseCase(m, 5) }))
    .filter(r => !r.result.na && Number.isFinite(r.result.irrHold));
  const order = (key) => [...priced].sort((a, b) => b.result[key] - a.result[key]).map(r => r.id);
  const byHold = order('irrHold'), byExit = order('irrExit');
  const fifthGrade = (ranking, id) => 6 - Math.ceil((ranking.indexOf(id) + 1) * 5 / ranking.length);
  // B3 correctly changes the exit ordering. The existing methodology already
  // requires each investor's return basis; a shared grade is no longer valid.
  const grades = returnGradesFor(registered,5);
  for(const id of byHold) assert.equal(grades[id]['hold-irr'].grade,fifthGrade(byHold,id));
  for(const id of byExit) assert.equal(grades[id]['exit-irr'].grade,fifthGrade(byExit,id));

  const expected = (id) => fifthGrade(byHold, id);
  const drift = [];
  for (const view of await committed.readAll()){
    const record = view.grades.assetReturn;
    if (!record || record.basis !== BASIS.DERIVED) continue;
    assert.ok(byHold.includes(view.marketId), `${view.marketId}: a derived asset-return grade on a market the engine does not price`);
    if (record.grade !== expected(view.marketId)){
      drift.push(`${view.marketId}: stored ${record.grade}, and rank ${byHold.indexOf(view.marketId) + 1} of ${byHold.length} is ${expected(view.marketId)}`);
    }
  }
  assert.deepEqual(drift, [], 'the engine\'s ranking has moved under a stored grade: the analyst regrades it, nothing here does');
});

test('a play label names its design; the stage is added where it is shown', () => {
  assert.deepEqual(validatePlay(play(), 'fi-mer-2h'), []);
  for (const label of [['Merchant · 2h · ready-to-build', '纯市场化 · 2小时'], ['Merchant · 2h', '纯市场化 · 2小时 · 已投运'], ['Merchant · 2h · operating, awarded', '纯市场化 · 2小时']]){
    assert.ok(validatePlay(play({ label }), 'fi-mer-2h').some(p => /names a stage/.test(p)), label.join(' | '));
  }
  assert.deepEqual(playTitle(play()), ['Merchant · 2h · ready-to-build', '纯市场化 · 2小时 · 具备开工条件']);
  assert.deepEqual(playTitle(play(), 'operating'), ['Merchant · 2h · operating', '纯市场化 · 2小时 · 在运资产']);
  assert.deepEqual(playTitle(play(), 'co-invest')[0], 'Merchant · 2h · co-investment');
});
