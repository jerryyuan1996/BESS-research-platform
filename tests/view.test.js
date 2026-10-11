/* ---------------------------------------------------------------------------
   THE VIEW STORE.

   Two things are tested and they are different. The store ON DISK must be
   valid, consistent with its index and fully accounted for by its changelog —
   that is the committed state anyone reading the repository relies on. And the
   WRITER must refuse what it should refuse, which is tested against a
   temporary directory so that no test ever writes the real store.

   The wall this store sits beside is asserted here too: only the analyst may
   write it, the ETL cannot reach the writer, and no path spells a change to
   methodology.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  VIEW_SECTIONS, PERMITTED_AUTHORS, emptyView, validateMarketView, parsePath, readPath, writePath,
  buildIndex, validateChangelogEntry, INTERNAL_EVIDENCE,
} from '../view/schema/view.mjs';
import { assessMarket, disagreements } from '../src/entry/assessment.js';
import { ledgerFor } from '../src/entry/ledgerRegistry.js';
import { FX } from '../src/comparison/assumptions.js';
import { NOT_ACCESSIBLE } from '../src/governance/archetypes.js';
import { BASIS } from '../src/governance/investability.js';
import { createViewStore, ViewRejected, VIEW_ROOT } from '../scripts/view/writer.mjs';
import { byId } from '../src/markets/registry.js';
import { ARCHETYPE_IDS, DIMENSION_IDS } from '../src/governance/investability.js';
import { SOURCE_DECISION_PROFILE } from '../src/governance/triggers.js';

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
  const entries = await committed.changelog();
  assert.ok(entries.length > 0);
  const replayed = new Map();
  const ids = new Set();
  for (const entry of entries){
    assert.deepEqual(validateChangelogEntry(entry), [], `${entry.id}: changelog entry is invalid`);
    assert.ok(!ids.has(entry.id), `${entry.id}: changelog id repeats`);
    ids.add(entry.id);
    const before = replayed.get(entry.market) || emptyView(entry.market);
    assert.deepEqual(readPath(before, entry.path), entry.from, `${entry.id}: "from" does not match the state the earlier entries leave`);
    replayed.set(entry.market, writePath(before, entry.path, entry.to));
  }
  const views = await committed.readAll();
  assert.deepEqual([...replayed.keys()].sort(), views.map(v => v.marketId).sort());
  for (const view of views) assert.deepEqual(replayed.get(view.marketId), view, `${view.marketId}: the file differs from its changelog`);

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
    const { SRC } = await import(`../src/markets/${view.marketId.replace('_', '-')}/sources.js`);
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
  assert.deepEqual(graded.map(v => v.marketId).sort(), ['fi', 'gb', 'ro', 'wa'], 'the four corners');
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
  assert.equal(verdicts, 16, 'four markets by four archetypes');
});

test('nothing in the committed store was written by automation', async () => {
  assert.deepEqual(PERMITTED_AUTHORS, ['analyst'], 'widening this list is the governance rewrite, not an edit');
  for (const entry of await committed.changelog()) assert.equal(entry.author.kind, 'analyst', entry.id);
  for (const view of await committed.readAll()){
    for (const record of [...Object.values(view.grades), ...Object.values(view.verdicts)]){
      assert.equal(record.author, 'analyst', `${view.marketId}: a record authored by ${record.author}`);
    }
    for (const t of view.triggers) assert.equal(t.effect, null, `${t.id}: carries an effect`);
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
  assert.deepEqual(VIEW_SECTIONS, ['grades', 'verdicts', 'triggers', 'thesis']);
  for (const id of DIMENSION_IDS) assert.ok(parsePath(`grades.${id}`));
  for (const id of ARCHETYPE_IDS) assert.ok(parsePath(`verdicts.${id}`));

  const refused = [
    'weights.developer', 'archetypes.developer.limits', 'anchors.capitalAtRisk', 'reads.gridScarcity',
    'pillarWeight.entry', 'discountRate', 'economics.merchGross', 'assumptions.economics.merchGross',
    'grades.vibes', 'verdicts.tourist',
    /* One field inside a record: the half-edit a whole-record store prevents. */
    'verdicts.developer.call', 'grades.foreignEntry.grade', 'grades.foreignEntry.held.grade',
    'grades.vibes.held', 'verdicts.developer.held',
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

test('only the analyst may write the view', () => scratch(async (store, root) => {
  for (const kind of ['agent', 'rule', 'etl', undefined]){
    await rejects(store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason, author: { kind } }), /may not write the view/);
  }
  await rejects(store.apply({ market: 'fi', path: 'triggers.fi-an-event', to: trigger(), reason }), /may not write the view/);
  assert.ok(!existsSync(path.join(root, 'markets')), 'a refused change left something on disk');
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
  await rejects(store.apply(change({ path: 'triggers.fi-rule', to: trigger({ id: 'fi-rule', effect: [{ path: 'verdicts.developer', to: 'wait' }] }) })), /effect must be null/);
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

test('the ETL cannot reach the view writer, and nothing in the app writes the view', async () => {
  /* The ETL's write boundary still stops at public/data/public/. This store is
     written by a person through a tool the ETL does not import; when rules and
     an agent are allowed to write here, this test and the authority model are
     rewritten together, on purpose. */
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
  for (const dir of ['etl', 'src', '.github']){
    if (!existsSync(path.join(repo, dir))) continue;
    for (const file of await walk(path.join(repo, dir))){
      const source = await readFile(file, 'utf8');
      assert.ok(!/scripts\/view\/writer|view\/writer\.mjs/.test(source), `${path.relative(repo, file)} imports the view writer`);
    }
  }
  const workflows = path.join(repo, '.github', 'workflows');
  for (const file of existsSync(workflows) ? await readdir(workflows) : []){
    const source = await readFile(path.join(workflows, file), 'utf8');
    assert.ok(!/view\/writer/.test(source), `${file}: a workflow runs the view writer`);
  }
});
