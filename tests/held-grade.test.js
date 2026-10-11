/* ---------------------------------------------------------------------------
   THE HELD LAYER.

   A sourced grade says what public sources support. A held grade says what the
   analyst believes, and sits on top of it. The gap between the two is the most
   valuable thing the platform holds, and every rule here exists to keep that
   gap honest: the held view is the one scored, both are always reported, it
   goes stale, only the analyst writes it, nothing underneath it is stripped,
   and the reason for it never reaches a reader.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  DIMENSION_IDS, BASIS, CONFIDENCE, CONFIDENCE_LABEL, HELD_MAX_MONTHS,
  validateGrade, validateHeld, effectiveGrade, sourcedOnly,
} from '../src/governance/investability.js';
import {
  ARCHETYPES, KNOCK_OUT, NOT_ACCESSIBLE, METRIC, utility, pillarScore, fit, knockOuts, ceiling, assess,
} from '../src/governance/archetypes.js';
import {
  parsePath, isHeldPath, authorMayWrite, HELD_AUTHORS, PERMITTED_AUTHORS, gapFor, GAP_MOVEMENT,
  emptyView, validateMarketView, validateChangelogEntry, writePath,
} from '../view/schema/view.mjs';
import { createViewStore, ViewRejected, VIEW_ROOT } from '../scripts/view/writer.mjs';
import { trackRecord } from '../scripts/view/track-record.mjs';
import {
  NOTES_KEY, PRIVATE_METRICS, validateNotes, heldNote, privateMetrics, heldWithoutReason, hasNotes,
} from '../src/local/notes.js';
import { assessMarket } from '../src/entry/assessment.js';
import { ledgerFor } from '../src/entry/ledgerRegistry.js';
import { byId } from '../src/markets/registry.js';
import { FX } from '../src/comparison/assumptions.js';

const BEFORE = '2026-12-01', ON_REVIEW = '2027-03-31', AFTER = '2027-04-01';

const sourced = (dimension, grade, patch = {}) => ({
  dimension, grade, trend: 'stable', basis: 'official', evidence: ['a-source'],
  reason: ['What public sources support.', '公开来源所支持的判断。'],
  asOf: '2026-10-10', author: 'analyst', lockedUntil: null, ...patch,
});
const held = (grade, patch = {}) => ({
  grade, confidence: 'medium', asOf: '2026-10-11', reviewBy: ON_REVIEW, publicNote: null, ...patch,
});
const withHeld = (dimension, sourcedGrade, heldGrade, patch = {}) => ({ ...sourced(dimension, sourcedGrade), held: held(heldGrade, patch) });

/* A full set of grades this archetype reads with no knock-out, as records. */
const clean = (a) => Object.fromEntries(DIMENSION_IDS.map(id => {
  const grade = [5, 4, 3, 2, 1].find(g => a.reads[id][g] !== KNOCK_OUT);
  return [id, sourced(id, grade)];
}));

const analyst = { kind: 'analyst' };
const reason = ['Because.', '原因如此。'];
const notesFor = (dimension) => ({ fi: { held: { [dimension]: { reason: ['A private reason.', '一条不公开的理由。'] } } } });

async function scratch(run, notes = notesFor('gridScarcity')){
  const root = await mkdtemp(path.join(tmpdir(), 'bess-held-'));
  try { await run(createViewStore(root, { notes: async () => notes }), root); }
  finally { await rm(root, { recursive: true, force: true }); }
}
const rejects = (promise, pattern) => assert.rejects(promise, (error) => {
  assert.ok(error instanceof ViewRejected, `expected a ViewRejected, got ${error?.name}: ${error?.message}`);
  assert.match(error.message, pattern);
  return true;
});

/* ---- rule 1: the effective grade -------------------------------------------- */

test('the effective grade is the held one while it is live, and the sourced one otherwise', () => {
  const record = withHeld('gridScarcity', 2, 1);
  assert.deepEqual(effectiveGrade(record, BEFORE),
    { grade: 1, sourced: 2, held: 1, applied: true, lapsed: false, confidence: 'medium', reviewBy: ON_REVIEW });
  /* Live up to and including the review date. */
  assert.equal(effectiveGrade(record, ON_REVIEW).grade, 1);

  /* No held layer: the sourced grade, for a record or a bare number, date or no date. */
  const plain = { grade: 3, sourced: 3, held: null, applied: false, lapsed: false, confidence: null, reviewBy: null };
  assert.deepEqual(effectiveGrade(sourced('gridScarcity', 3)), plain);
  assert.deepEqual(effectiveGrade(3, BEFORE), plain);
  assert.equal(effectiveGrade(undefined).grade, null);
  assert.equal(effectiveGrade(9).grade, null);
});

test('a lapsed review date falls back to the sourced grade and is reported as lapsed', () => {
  const lapsed = effectiveGrade(withHeld('gridScarcity', 2, 1), AFTER);
  assert.equal(lapsed.grade, 2);
  assert.equal(lapsed.applied, false);
  assert.equal(lapsed.lapsed, true);
  /* Still reported: what the view was and when it was due. Flagged, not dropped. */
  assert.equal(lapsed.held, 1);
  assert.equal(lapsed.reviewBy, ON_REVIEW);
});

test('a held grade cannot be evaluated without a date', () => {
  /* Which side of the review date "now" falls on is the one thing this
     function must never guess. */
  for (const on of [undefined, null, '', 'today', '2027-13-01']){
    assert.throws(() => effectiveGrade(withHeld('gridScarcity', 2, 1), on), /needs an evaluation date/);
  }
  const grades = { ...clean(ARCHETYPES.developer), gridScarcity: withHeld('gridScarcity', 2, 1) };
  assert.throws(() => fit('developer', grades), /needs an evaluation date/);
  assert.throws(() => knockOuts('developer', grades), /needs an evaluation date/);
});

test('a held grade overrides the sourced one in utility, pillar score and fit', () => {
  for (const a of Object.values(ARCHETYPES)){
    const base = clean(a);
    /* A dimension where two grades read differently and neither is a knock-out. */
    const id = DIMENSION_IDS.find(d => typeof a.reads[d][4] === 'number' && typeof a.reads[d][3] === 'number' && a.reads[d][4] !== a.reads[d][3]);
    const grades = { ...base, [id]: withHeld(id, 4, 3) };
    const asHeld = { ...base, [id]: sourced(id, 3) }, asSourced = { ...base, [id]: sourced(id, 4) };

    assert.equal(utility(a, id, grades, BEFORE), a.reads[id][3], `${a.id}/${id}`);
    assert.equal(fit(a, grades, BEFORE), fit(a, asHeld), `${a.id}: live held view must score as the held grade`);
    assert.equal(fit(a, grades, AFTER), fit(a, asSourced), `${a.id}: lapsed held view must score as the sourced grade`);
    assert.notEqual(fit(a, grades, BEFORE), fit(a, grades, AFTER));
    for (const p of ['return', 'entry', 'durability', 'capital']){
      assert.equal(pillarScore(a, p, grades, BEFORE), pillarScore(a, p, asHeld));
    }
  }
});

test('a held 1 knocks out where the sourced 2 does not, and the reverse', () => {
  /* The developer reads grid scarcity 1 as a knock-out and 2 as a score. */
  const dev = ARCHETYPES.developer;
  assert.equal(dev.reads.gridScarcity[1], KNOCK_OUT);
  assert.notEqual(dev.reads.gridScarcity[2], KNOCK_OUT);
  const base = clean(dev);

  const heldClosed = { ...base, gridScarcity: withHeld('gridScarcity', 2, 1) };
  assert.equal(ceiling(dev, heldClosed, {}, 'greenfield', BEFORE), NOT_ACCESSIBLE);
  assert.deepEqual(knockOuts(dev, heldClosed, BEFORE), ['gridScarcity']);
  assert.equal(ceiling(dev, heldClosed, {}, 'greenfield', AFTER), null, 'once lapsed, the sourced 2 is what counts');

  const heldOpen = { ...base, gridScarcity: withHeld('gridScarcity', 1, 2) };
  assert.equal(ceiling(dev, heldOpen, {}, 'greenfield', BEFORE), null);
  assert.deepEqual(knockOuts(dev, heldOpen, BEFORE), []);
  assert.equal(ceiling(dev, heldOpen, {}, 'greenfield', AFTER), NOT_ACCESSIBLE, 'once lapsed, the sourced 1 closes it again');
});

/* ---- rule 3: both are reported ------------------------------------------------ */

test('assess reports the effective grade, the sourced grade, and whether a held view applied or lapsed', () => {
  const dev = ARCHETYPES.developer;
  const grades = { ...clean(dev), gridScarcity: withHeld('gridScarcity', 2, 1), saturation: withHeld('saturation', 4, 3) };

  const live = assess(dev, grades, {}, null, [], BEFORE);
  assert.deepEqual(live.grades.gridScarcity, { grade: 1, sourced: 2, held: 1, applied: true, lapsed: false, confidence: 'medium', reviewBy: ON_REVIEW });
  assert.deepEqual(live.heldApplied, ['gridScarcity', 'saturation']);
  assert.deepEqual(live.heldLapsed, []);
  assert.equal(live.ceiling, NOT_ACCESSIBLE);
  assert.equal(live.headline, 'ceiling');
  /* The same market on public sources alone, beside it. */
  assert.equal(live.fitSourced, fit(dev, { ...clean(dev), gridScarcity: sourced('gridScarcity', 2), saturation: sourced('saturation', 4) }));
  assert.notEqual(live.fit, live.fitSourced);

  const lapsed = assess(dev, grades, {}, null, [], AFTER);
  assert.deepEqual(lapsed.heldApplied, []);
  assert.deepEqual(lapsed.heldLapsed, ['gridScarcity', 'saturation']);
  assert.equal(lapsed.grades.gridScarcity.grade, 2);
  assert.equal(lapsed.grades.gridScarcity.held, 1, 'the lapsed view is still reported');
  assert.equal(lapsed.ceiling, null);
  assert.equal(lapsed.fit, lapsed.fitSourced);

  /* With no held view anywhere the two scores are the same number. */
  const none = assess(dev, clean(dev));
  assert.equal(none.fit, none.fitSourced);
  assert.deepEqual(none.heldApplied, []);
});

test('the band check runs on the effective grade', () => {
  const dev = ARCHETYPES.developer;
  const grades = { ...clean(dev), gridScarcity: withHeld('gridScarcity', 2, 1) };
  const verdict = { call: 'build-position', route: 'greenfield' };
  assert.equal(assess(dev, grades, {}, verdict, [], BEFORE).check.kind, 'knock-out-ignored');
  assert.notEqual(assess(dev, grades, {}, verdict, [], AFTER).check.kind, 'knock-out-ignored');
});

/* ---- the shape, and rule 5 ---------------------------------------------------- */

test('a held view needs a grade, a confidence and a review date within twelve months', () => {
  assert.deepEqual(validateHeld(held(1)), []);
  assert.deepEqual(validateGrade(withHeld('gridScarcity', 2, 1)), []);
  assert.deepEqual(validateHeld(held(1, { publicNote: ['Capacity is tighter than the register shows.', '实际容量比登记册显示的更紧张。'] })), []);

  const bad = (patch, pattern) => {
    const problems = validateGrade({ ...sourced('gridScarcity', 2), held: { ...held(1), ...patch } });
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern} from ${JSON.stringify(patch)}, got ${JSON.stringify(problems)}`);
  };
  for (const grade of [0, 6, 2.5, '1', null]) bad({ grade }, /grade must be a whole number from 1 to 5/);
  bad({ reviewBy: undefined }, /reviewBy is required/);
  bad({ reviewBy: null }, /reviewBy is required/);
  bad({ reviewBy: 'next spring' }, /reviewBy is required/);
  bad({ reviewBy: '2026-10-11' }, /must be after asOf/);
  bad({ reviewBy: '2027-10-12' }, /more than 12 months/);
  bad({ asOf: undefined }, /asOf must be/);
  bad({ confidence: 'certain' }, /confidence must be/);
  bad({ publicNote: 'English only' }, /publicNote must be/);
  bad({ publicNote: undefined }, /publicNote must be/);
  /* No slot for the reason or for a figure: those are private. */
  bad({ reason: ['Because of a deal.', '因为一宗交易。'] }, /belongs in the private overlay/);
  bad({ metric: { perProject: 1 } }, /belongs in the private overlay/);

  assert.equal(HELD_MAX_MONTHS, 12);
  assert.deepEqual(validateHeld(held(1, { reviewBy: '2027-10-11' })), [], 'exactly twelve months is allowed');
  assert.deepEqual(CONFIDENCE, ['high', 'medium', 'low']);
  for (const c of CONFIDENCE) assert.ok(/[一-鿿]/.test(CONFIDENCE_LABEL[c][1]) && CONFIDENCE_LABEL[c][0]);
});

test('a record with evidence and a practitioner basis is rejected, and pointed to `held`', () => {
  const relabelled = sourced('gridScarcity', 1, { basis: BASIS.PRACTITIONER });
  const problems = validateGrade(relabelled);
  assert.ok(problems.some(p => /keep a sourced basis and record your own view in `held`/.test(p)), JSON.stringify(problems));
  /* Evidence alone, or a public reason alone, is enough to trip it. */
  const { reason: dropped, ...evidenceOnly } = relabelled;
  assert.ok(validateGrade(evidenceOnly).some(p => /`held`/.test(p)));
  assert.ok(validateGrade({ ...relabelled, evidence: [] }).some(p => /`held`/.test(p)));

  /* What practitioner is still for: no public evidence at all. */
  const bare = { ...evidenceOnly, evidence: [] };
  assert.deepEqual(validateGrade(bare), []);
  /* And there is nothing for a held view to depart from there. */
  assert.ok(validateGrade({ ...bare, held: held(1) }).some(p => /already the analyst's view/.test(p)));
});

/* ---- rule 2: nothing is stripped ---------------------------------------------- */

test('the held view has a path of its own, and writing it touches nothing else', () => scratch(async (store, root) => {
  const record = sourced('gridScarcity', 2);
  await store.apply({ market: 'fi', path: 'grades.gridScarcity', to: record, reason, author: analyst });
  const file = path.join(root, 'markets', 'fi.json');
  const before = await readFile(file, 'utf8');

  const opened = await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst });
  assert.equal(opened.from, null);
  const withLayer = await store.read('fi');
  assert.deepEqual(sourcedOnly(withLayer.grades.gridScarcity), record, 'the sourced record changed when a held view was added');
  assert.deepEqual(withLayer.grades.gridScarcity.held, held(1));
  assert.deepEqual(validateMarketView(withLayer), []);

  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: null, reason, author: analyst });
  assert.equal(await readFile(file, 'utf8'), before, 'removing the held view did not leave the file byte-identical');
}));

test('a held view cannot ride inside a sourced grade, sit on nothing, or be orphaned', () => scratch(async (store) => {
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst }), /no sourced grade for a held view to sit on/);
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity', to: withHeld('gridScarcity', 2, 1), reason, author: analyst }), /written at grades\.gridScarcity\.held/);

  await store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', 2), reason, author: analyst });
  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst });
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity', to: null, reason, author: analyst }), /remove the held view first/);
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(7), reason, author: analyst }), /grade must be a whole number/);
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: { ...held(1), reviewBy: undefined }, reason, author: analyst }), /reviewBy is required/);
}));

test('the sourced grade can change underneath a held view, which stays exactly as it was', () => scratch(async (store) => {
  await store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', 3), reason, author: analyst });
  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst });
  const entry = await store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', 2), reason, author: analyst });

  const view = await store.read('fi');
  assert.equal(view.grades.gridScarcity.grade, 2);
  assert.deepEqual(view.grades.gridScarcity.held, held(1), 'the held view moved when the sourced grade did');
  /* And the changelog shows the gap changed. */
  assert.deepEqual(entry.gap, { dimension: 'gridScarcity', held: 1, sourcedWas: 3, sourced: 2, movement: 'toward' });
}));

/* ---- rule 4: only the analyst writes it --------------------------------------- */

test('a held view is written by the analyst alone', () => scratch(async (store) => {
  assert.deepEqual(HELD_AUTHORS, ['analyst'], 'this list does not grow');
  assert.ok(isHeldPath('grades.gridScarcity.held'));
  assert.ok(!isHeldPath('grades.gridScarcity'));

  await store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', 2), reason, author: analyst });
  for (const kind of ['rule', 'agent', 'etl', undefined]){
    await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: { kind } }), /may not write a held view/);
  }
  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst });
  /* Changing it and removing it are refused to a machine as well. */
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(2), reason, author: { kind: 'agent' } }), /may not write a held view/);
  await rejects(store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: null, reason, author: { kind: 'rule' } }), /may not write a held view/);
  assert.deepEqual((await store.read('fi')).grades.gridScarcity.held, held(1));
}));

test('the held gate does not move when the general gate is widened', () => {
  /* The plan goes on to let rules and an agent write sourced grades. On that
     day PERMITTED_AUTHORS grows and this must not. Simulated here by asking
     the gate about each kind directly: whatever the general list says, a held
     path answers for the analyst only. */
  for (const kind of ['rule', 'agent']){
    assert.equal(authorMayWrite('grades.gridScarcity.held', kind), false, `${kind} may write a held view`);
    assert.equal(authorMayWrite('grades.gridScarcity', kind), PERMITTED_AUTHORS.includes(kind));
  }
  assert.equal(authorMayWrite('grades.gridScarcity.held', 'analyst'), true);
  assert.equal(authorMayWrite('weights.developer', 'analyst'), false);
  /* A changelog line claiming a machine wrote one is itself invalid. */
  const forged = { id: 'x', at: '2026-10-11T00:00:00.000Z', market: 'fi', author: { kind: 'agent' },
    path: 'grades.gridScarcity.held', from: null, to: held(1), reason, evidence: [] };
  assert.ok(validateChangelogEntry(forged).some(p => /written by the analyst alone/.test(p)));
});

/* ---- rule 6: the private reason ------------------------------------------------ */

test('a held view cannot be written without a private reason in the overlay', async () => {
  const change = { market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst };
  const seed = (store) => store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', 2), reason, author: analyst });

  /* No overlay at all — any machine but the analyst's. */
  await scratch(async (store) => { await seed(store); await rejects(store.apply(change), /no private reason in local-data/); }, null);
  /* An overlay with a reason for a different dimension, or a different market. */
  await scratch(async (store) => { await seed(store); await rejects(store.apply(change), /no private reason/); }, notesFor('saturation'));
  await scratch(async (store) => { await seed(store); await rejects(store.apply(change), /no private reason/); },
    { wa: { held: { gridScarcity: { reason: ['a', '甲'] } } } });
  /* Removing a held view needs no reason. */
  await scratch(async (store) => {
    await seed(store); await store.apply(change);
  });
});

test('the local check lists held views with no reason, and reports nothing when there is no overlay', () => {
  const views = [{ marketId: 'fi', grades: { gridScarcity: withHeld('gridScarcity', 2, 1), saturation: withHeld('saturation', 3, 2), demandGrowth: sourced('demandGrowth', 4) } }];
  assert.deepEqual(heldWithoutReason(views, notesFor('gridScarcity')), [{ marketId: 'fi', dimension: 'saturation' }]);
  assert.deepEqual(heldWithoutReason(views, { fi: { held: { gridScarcity: { reason: ['a', '甲'] }, saturation: { reason: ['b', '乙'] } } } }), []);
  /* No overlay: not "everything is missing". The public pipeline must never
     fail, or pass, on the strength of a folder it cannot see. */
  assert.deepEqual(heldWithoutReason(views, null), []);
  assert.equal(hasNotes(null), false);
  assert.equal(heldNote('fi', 'gridScarcity'), null, 'under plain Node, as in a build, there is no overlay');
});

/* ---- rule 7: private metrics ---------------------------------------------------- */

test('a private figure checks a limit the public data cannot, and only where it is offered', async () => {
  const view = { ...(await createViewStore().read('gb')), verdicts: {} };
  const market = byId('gb'), ledger = ledgerFor('gb');
  const dev = ARCHETYPES.developer;
  const limit = dev.limits.find(l => l.metric === METRIC.SECURITY_BEFORE_CONSENT_USD);

  /* The public answer: nobody has a figure, so the limit is unchecked. */
  const open = assessMarket(view, market, ledger, FX);
  assert.ok(open.byArchetype.developer.limitsUnchecked.includes(limit.id));
  assert.deepEqual(open.privateMetricsUsed, []);

  /* The analyst's screen: his figure decides it, either way. */
  const over = assessMarket(view, market, ledger, FX, { privateMetrics: { [limit.metric]: limit.max * 2 } });
  assert.ok(over.byArchetype.developer.limitsBreached.includes(limit.id));
  assert.equal(over.byArchetype.developer.ceiling, NOT_ACCESSIBLE);
  assert.deepEqual(over.privateMetricsUsed, [limit.metric]);
  const under = assessMarket(view, market, ledger, FX, { privateMetrics: { [limit.metric]: limit.max / 2 } });
  assert.ok(!under.byArchetype.developer.limitsUnchecked.includes(limit.id), 'a private figure is complete, not a lower bound');
  assert.ok(!under.byArchetype.developer.limitsBreached.includes(limit.id));

  /* In a build there is nothing to offer. */
  assert.deepEqual(privateMetrics('gb'), {});
});

test('the overlay holds reasons and limit figures, and the view store has no slot for either', () => {
  const notes = { wa: { held: { capitalAtRisk: { reason: ['a', '甲'] } }, metrics: { [METRIC.PRE_FID_CAPITAL_USD]: 1 } } };
  assert.deepEqual(validateNotes(notes), []);
  assert.deepEqual(privateMetrics('wa', notes), { [METRIC.PRE_FID_CAPITAL_USD]: 1 });
  assert.deepEqual(privateMetrics('fi', notes), {});
  assert.ok(!PRIVATE_METRICS.includes(METRIC.PROJECT_COST_USD), 'project cost comes from the engine and is public');
  const bad = (n, pattern) => assert.ok(validateNotes(n).some(p => pattern.test(p)), JSON.stringify(n));
  bad({ wa: { metrics: { [METRIC.PROJECT_COST_USD]: 1 } } }, /not a figure a limit is checked against/);
  bad({ wa: { metrics: { [METRIC.PRE_FID_CAPITAL_USD]: '16m' } } }, /must be a non-negative number/);
  bad({ wa: { held: { vibes: { reason: ['a', '甲'] } } } }, /unknown dimension/);
  bad({ wa: { held: { capitalAtRisk: {} } } }, /reason must be/);

  /* A view carrying a private section is not a valid view, and no path writes one. */
  for (const key of ['metrics', 'held', 'notes']){
    assert.ok(validateMarketView({ ...emptyView('wa'), [key]: {} }).some(p => /not a section of a market view/.test(p)), key);
  }
  for (const p of ['metrics.preFidCapitalUSD', 'held.capitalAtRisk', 'grades.capitalAtRisk.held.reason', 'grades.capitalAtRisk.metric']){
    assert.equal(parsePath(p), null, `"${p}" parsed as a view-store path`);
  }
});

test('the public bundle contains no overlay content', async (t) => {
  /* Two halves. Structurally, the module a build ships is the empty stub —
     checked always. And where this machine has both a build and an overlay,
     no sentence and no figure from the overlay appears anywhere in the build. */
  const stub = await import('../src/local/payload.js');
  assert.deepEqual(stub.default, {});
  assert.equal(stub.AVAILABLE, false);

  const repo = path.resolve(VIEW_ROOT, '..');
  const overlay = path.join(repo, 'local-data', `${NOTES_KEY}.json`);
  const assets = path.join(repo, 'dist', 'assets');
  if (!existsSync(overlay) || !existsSync(assets)){
    t.diagnostic('no overlay or no build on this machine — the content scan was skipped; the structural check ran');
    return;
  }
  const strings = [];
  const walk = (v) => {
    if (typeof v === 'string' && v.length >= 24) strings.push(v);
    else if (typeof v === 'number' && v >= 1000) strings.push(String(v));
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(JSON.parse(await readFile(overlay, 'utf8')));
  assert.ok(strings.length > 0, 'the overlay is empty, so this test proves nothing');
  for (const name of await readdir(assets)){
    if (!/\.(js|css|json)$/.test(name)) continue;
    const text = await readFile(path.join(assets, name), 'utf8');
    for (const s of strings) assert.ok(!text.includes(s), `${name} contains overlay content: "${s.slice(0, 40)}…"`);
  }
});

/* ---- rule 8: the track record --------------------------------------------------- */

test('a sourced grade moving under a held view records which way the gap moved', () => {
  assert.deepEqual(GAP_MOVEMENT, ['toward', 'met', 'away', 'none', 'opened', 'revised', 'withdrawn']);
  const viewWith = (grade, heldGrade) => ({ ...emptyView('fi'), grades: { gridScarcity: heldGrade === null ? sourced('gridScarcity', grade) : withHeld('gridScarcity', grade, heldGrade) } });
  const move = (from, to, h) => gapFor('grades.gridScarcity', viewWith(from, h), viewWith(to, h))?.movement;
  assert.equal(move(4, 3, 1), 'toward');
  assert.equal(move(2, 1, 1), 'met');
  assert.equal(move(2, 3, 1), 'away');
  assert.equal(move(1, 3, 2), 'none', 'crossed to the same distance on the other side');
  assert.equal(move(2, 3, null), undefined, 'no held view, nothing to record');

  const layer = (from, to) => gapFor('grades.gridScarcity.held', viewWith(2, from), viewWith(2, to)).movement;
  assert.equal(layer(null, 1), 'opened');
  assert.equal(layer(1, 3), 'revised');
  assert.equal(layer(1, null), 'withdrawn');
  assert.equal(gapFor('verdicts.developer', emptyView('fi'), emptyView('fi')), null);
});

test('the track record counts movements by dimension from the changelog', () => scratch(async (store) => {
  const set = (grade) => store.apply({ market: 'fi', path: 'grades.gridScarcity', to: sourced('gridScarcity', grade), reason, author: analyst });
  await set(4);
  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: held(1), reason, author: analyst });
  await set(3); await set(2); await set(3); await set(1);
  await store.apply({ market: 'fi', path: 'grades.gridScarcity.held', to: null, reason, author: analyst });
  await set(2);   // no held view any more: not counted

  const log = await store.changelog();
  for (const entry of log) assert.deepEqual(validateChangelogEntry(entry), [], entry.id);
  assert.deepEqual(trackRecord(log), {
    gridScarcity: { toward: 2, met: 1, away: 1, none: 0, opened: 1, revised: 0, withdrawn: 1 },
  });
  assert.deepEqual(trackRecord([]), {});
}));

/* ---- the committed store -------------------------------------------------------- */

test('every held view in the committed store sits on an intact sourced grade', async () => {
  for (const view of await createViewStore().readAll()){
    for (const [id, record] of Object.entries(view.grades)){
      if (!record.held) continue;
      assert.deepEqual(validateHeld(record.held), [], `${view.marketId}/${id}`);
      const beneath = sourcedOnly(record);
      assert.notEqual(beneath.basis, BASIS.PRACTITIONER, `${view.marketId}/${id}: a held view on a practitioner grade`);
      assert.deepEqual(validateGrade(beneath), [], `${view.marketId}/${id}: the sourced grade beneath the held view is not valid on its own`);
      assert.ok(beneath.evidence.length && beneath.reason, `${view.marketId}/${id}: the sourced grade lost its evidence or reason`);
    }
  }
});
