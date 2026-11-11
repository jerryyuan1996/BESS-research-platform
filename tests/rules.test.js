/* ---------------------------------------------------------------------------
   THE RULES ENGINE.

   A rule is a trigger the analyst wrote in advance. These tests run one on a
   fixture snapshot, against a temporary store, and assert the whole of what
   the plan asks of it: it fires when its line is crossed and not before; it
   writes the market file, the index and one changelog line naming the rule
   and its evidence; it does nothing the second time; a dry run writes
   nothing; it will not test a snapshot it has no business trusting; and the
   analyst can undo it with one command.

   No test here touches the committed store. The rule tested is the first
   real one, as written in docs/investability-phase-3-plan.md §5.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { runRules, evaluateRules, summaryVerifies, renderRulesReport, RULE_STATUS } from '../etl/rules.mjs';
import { createViewStore } from '../etl/lib/viewWriter.mjs';
import { sha256 } from '../etl/lib/envelope.mjs';
import { validateMarketView, validateChangelogEntry, readPath, writePath, emptyView } from '../view/schema/view.mjs';
import { thresholdFor } from '../src/governance/materiality.js';
import { MIN_WINDOW_DAYS, MAX_MACHINE_CHANGES_PER_RUN } from '../src/governance/automation.js';
import { datasetById } from '../src/governance/datasets.js';

const analyst = { kind: 'analyst' };
const reason = ['Because the source says so.', '因为来源如此表述。'];
const NOW = new Date('2026-10-12T06:00:00Z');

/* The baseline and the fraction the threshold is derived from. */
const BASELINE = 56.31;
const FRACTION = thresholdFor('economics.merchGross').ceiling;
const THRESHOLD = 45.05;

const RULE = {
  id: 'wa-wem-spread-compression', kind: 'data', market: 'wa',
  label: ['Trailing-year WEM spread falls a fifth below its level when the grade was set', '西澳电力市场近一年价差较评分时下降五分之一'],
  expected: null, watches: ['assetReturn'], direction: 'down',
  source: { publisher: 'AEMO', url: 'https://data.wa.aemo.com.au/', access: 'opened' },
  when: {
    dataset: 'wa-wem-prices', field: 'derived.spreadMean', op: '<', value: THRESHOLD,
    guard: [{ field: 'derived.spreadDays', op: '>=', value: 300 }],
    basis: ['56.31 AUD/MWh on 2026-10-10, less the 20% at which drift in merchant revenue is material.', '2026-10-10的56.31澳元/MWh，减去商业收入偏离被视为重大的20%。'],
  },
  effect: [
    { path: 'grades.assetReturn.trend', to: 'deteriorating' },
    { path: 'grades.assetReturn.trendCause', to: ['The trailing-year wholesale spread has fallen a fifth.', '近一年批发价差已下降五分之一。'] },
  ],
  note: ['The trailing-year wholesale spread has fallen a fifth below its level when the grade was set. The rank is unchanged.', '近一年批发价差较评分时下降五分之一。排名未变。'],
};

const GRADE = {
  dimension: 'assetReturn', grade: 4, trend: 'stable', basis: 'derived', evidence: ['comparison-engine'],
  reason: ['Fourth of fourteen markets on hold IRR.', '持有期IRR在十四个市场中排第四。'],
  asOf: '2026-10-10', author: 'analyst', lockedUntil: null,
};

/** A published summary, with a checksum that verifies. */
function summary({ spreadMean = BASELINE, spreadDays = 353, fetchedAt = '2026-10-12T04:00:00.000Z', datasetId = 'wa-wem-prices' } = {}){
  const body = {
    schemaVersion: 1, datasetId, marketId: 'wa', authority: 'observed', fetchedAt,
    derived: { authority: 'derived', spreadMean, spreadDays },
    sourceSnapshot: { file: `${datasetId}.json`, contentChecksum: `sha256:${'a'.repeat(64)}`, points: 17000 },
  };
  return { ...body, summaryChecksum: sha256(body) };
}

async function scratch(run, { rule = RULE, grade = GRADE } = {}){
  const root = await mkdtemp(path.join(tmpdir(), 'bess-rules-'));
  try {
    const store = createViewStore(root);
    await store.apply({ market: 'wa', path: 'grades.assetReturn', to: grade, reason, author: analyst }, new Date('2026-10-10T01:00:00Z'));
    if (rule) await store.apply({ market: 'wa', path: `triggers.${rule.id}`, to: rule, reason, author: analyst }, new Date('2026-10-11T01:00:00Z'));
    await run(store, root);
  } finally { await rm(root, { recursive: true, force: true }); }
}

const files = async (root) => Promise.all(['markets/wa.json', 'index.json', 'changelog.jsonl'].map(f => readFile(path.join(root, f), 'utf8')));
const go = (store, spread, patch = {}) => runRules({
  store, now: NOW, fetched: ['wa-wem-prices'], readSummary: async () => summary(spread), ...patch,
});

test('the threshold is the baseline less the materiality ceiling, and nothing else', () => {
  /* The rule borrows the analyst's own number: the move at which drift in the
     assumption this dataset bears on is material whatever the model says. If
     that ceiling is revised, this fails and the rule is looked at again. */
  assert.equal(FRACTION, 0.20);
  assert.ok(datasetById('wa-wem-prices').bearsOn.includes('economics.merchGross'));
  assert.equal(Math.round(BASELINE * (1 - FRACTION) * 100) / 100, THRESHOLD);
  assert.equal(RULE.when.guard[0].value, MIN_WINDOW_DAYS);
});

test('a rule does not fire while its line is not crossed', () => scratch(async (store, root) => {
  const before = await files(root);
  for (const spreadMean of [BASELINE, 50, THRESHOLD]){
    const result = await go(store, { spreadMean });
    assert.equal(result.reports[0].status, RULE_STATUS.NOT_MET);
    assert.equal(result.reports[0].observed, spreadMean);
    assert.equal(result.written, 0);
  }
  assert.deepEqual(await files(root), before);
}));

test('a crossing prepares evidenced entries without changing the market, index or changelog', () => scratch(async (store, root) => {
  const before = await files(root);
  const result = await go(store, { spreadMean: 44.2 });
  assert.equal(result.reports[0].status, RULE_STATUS.CROSSED);
  assert.equal(result.written, 0);
  assert.equal(result.rejected, null);

  /* The record: exactly the effect's fields changed, and the stamps. */
  const view = await store.read('wa');
  assert.deepEqual(validateMarketView(view), []);
  assert.deepEqual(view.grades.assetReturn, GRADE);
  assert.deepEqual(await files(root), before);
  assert.deepEqual(result.entries[0].to, { ...GRADE, trend: 'deteriorating', trendCause: RULE.effect[1].to, author: 'rule', asOf: '2026-10-12' });
  assert.equal(view.grades.assetReturn.grade, 4, 'the grade number is not the rule\'s to move');

  /* One line, and it says who, why and on what. */
  const log = await store.changelog();
  assert.equal(log.length, 2);
  const entry = result.entries[0];
  assert.deepEqual(validateChangelogEntry(entry), []);
  assert.deepEqual(entry.author, { kind: 'rule', rule: RULE.id, run: NOW.toISOString() });
  assert.equal(entry.trigger, RULE.id);
  assert.equal(entry.path, 'grades.assetReturn');
  assert.deepEqual(entry.from, GRADE);
  assert.deepEqual(entry.reason, RULE.note);
  assert.deepEqual(entry.evidence, [{
    publisher: 'AEMO WEM Data', url: 'https://data.wa.aemo.com.au/', class: 'official',
    retrievedAt: '2026-10-12T04:00:00.000Z', sha256: `sha256:${'a'.repeat(64)}`,
    dataset: 'wa-wem-prices', field: 'derived.spreadMean', observed: 44.2, op: '<', threshold: THRESHOLD,
  }]);

  /* The changelog still accounts for the file, line by line. */
  let replayed = emptyView('wa');
  for (const e of log){
    assert.deepEqual(readPath(replayed, e.path), e.from);
    replayed = writePath(replayed, e.path, e.to);
  }
  assert.deepEqual(replayed, view);
  assert.ok(existsSync(path.join(root, 'index.json')));
}));

test('repeated crossings remain report-only and are not marked applied', () => scratch(async (store, root) => {
  await go(store, { spreadMean: 44.2 });
  const after = await files(root);
  for (const spreadMean of [44.2, 30, 60]){
    const again = await go(store, { spreadMean }, { now: new Date('2026-10-13T06:00:00Z') });
    assert.equal(again.reports[0].status, spreadMean < THRESHOLD ? RULE_STATUS.CROSSED : RULE_STATUS.NOT_MET);
    assert.equal(again.written, 0);
    assert.equal(again.rejected, null);
  }
  assert.deepEqual(await files(root), after);
}));

test('both legacy dry-run and ordinary invocation prepare the same report without writing', () => scratch(async (store, root) => {
  const before = await files(root);
  const dry = await go(store, { spreadMean: 44.2 }, { dryRun: true });
  assert.equal(dry.reports[0].status, RULE_STATUS.CROSSED);
  assert.equal(dry.written, 0);
  assert.equal(dry.entries.length, 1);
  assert.deepEqual(await files(root), before);
  assert.match(renderRulesReport(dry), /report only, nothing written/);
  assert.match(renderRulesReport(dry), /Would change `wa` `grades\.assetReturn`/);

  const real = await go(store, { spreadMean: 44.2 });
  assert.deepEqual(real.entries, dry.entries, 'a dry run and a real run differ');
}));

test('a rule is not tested on a snapshot it has no business trusting', () => scratch(async (store, root) => {
  const before = await files(root);
  const status = async (patch, spread = { spreadMean: 30 }) => (await go(store, spread, patch)).reports[0].status;

  /* Not fetched in this run — skipped or failed, with an older file on disk. */
  assert.equal(await status({ fetched: ['fx-ecb'] }), RULE_STATUS.NOT_FETCHED);
  assert.equal(await status({ fetched: [] }), RULE_STATUS.NOT_FETCHED);
  /* Nothing published. */
  assert.equal(await status({ readSummary: async () => null }), RULE_STATUS.NO_SNAPSHOT);
  /* Edited by hand: the checksum no longer matches. */
  const edited = { ...summary({ spreadMean: 56 }), derived: { spreadMean: 30, spreadDays: 353 } };
  assert.equal(summaryVerifies(edited), false);
  assert.equal(summaryVerifies(summary()), true);
  assert.equal(await status({ readSummary: async () => edited }), RULE_STATUS.UNVERIFIED);
  /* Older than the dataset's own staleness limit. */
  assert.equal(await status({}, { spreadMean: 30, fetchedAt: '2026-10-01T04:00:00.000Z' }), RULE_STATUS.STALE);
  /* Too short a window, whatever the rule's own guard says. */
  assert.equal(await status({}, { spreadMean: 30, spreadDays: MIN_WINDOW_DAYS - 1 }), RULE_STATUS.SHORT_WINDOW);

  assert.deepEqual(await files(root), before);
}));

test('the season guard cannot be written out of a rule', () => scratch(async (store, root) => {
  const result = await go(store, { spreadMean: 30, spreadDays: 120 });
  assert.equal(result.reports[0].status, RULE_STATUS.SHORT_WINDOW);
  assert.equal(result.written, 0);
}, { rule: { ...RULE, when: { ...RULE.when, guard: [] } } }));

test('a pinned grade, a practitioner grade and a trigger with no effect are all left alone', async () => {
  /* Pinned: the rule fires, the gate refuses the batch, nothing is written. */
  await scratch(async (store, root) => {
    const before = await files(root);
    const result = await go(store, { spreadMean: 30 });
    assert.equal(result.written, 0);
    assert.match(result.rejected.reason, /pinned until 2027-01-31/);
    assert.deepEqual(await files(root), before);
  }, { grade: { ...GRADE, lockedUntil: '2027-01-31' } });

  /* A pin that has ended no longer holds. */
  await scratch(async (store) => {
    const result = await go(store, { spreadMean: 30 });
    assert.equal(result.written, 0);
    assert.equal(result.entries.length, 1);
  }, { grade: { ...GRADE, lockedUntil: '2026-10-11' } });

  await scratch(async (store) => {
    const result = await go(store, { spreadMean: 30 });
    assert.equal(result.written, 0);
    assert.match(result.rejected.reason, /practitioner grade/);
  }, { grade: { dimension: 'assetReturn', grade: 4, trend: 'stable', basis: 'practitioner', evidence: [], asOf: '2026-10-10', author: 'analyst', lockedUntil: null } });

  /* An ordinary data trigger is a date to look again, not a rule. */
  await scratch(async (store) => {
    const result = await go(store, { spreadMean: 30 });
    assert.deepEqual(result.reports, []);
    assert.equal(result.written, 0);
  }, { rule: { ...RULE, effect: null } });
});

test('over the cap, the run writes nothing at all', () => scratch(async (store, root) => {
  /* Four rules on one snapshot, each moving a different grade. */
  const dims = ['revenueCertainty', 'policyStability', 'demandGrowth'];
  for (const [i, dimension] of dims.entries()){
    await store.apply({ market: 'wa', path: `grades.${dimension}`, to: { ...GRADE, dimension }, reason, author: analyst }, new Date(`2026-10-10T02:0${i}:00Z`));
    await store.apply({ market: 'wa', path: `triggers.wa-rule-${i}`, reason, author: analyst, to: {
      ...RULE, id: `wa-rule-${i}`, watches: [dimension],
      effect: [{ path: `grades.${dimension}.trend`, to: 'deteriorating' }, { path: `grades.${dimension}.trendCause`, to: RULE.effect[1].to }],
    } }, new Date(`2026-10-11T02:0${i}:00Z`));
  }
  assert.equal(MAX_MACHINE_CHANGES_PER_RUN, 3);
  const before = await files(root);
  const result = await go(store, { spreadMean: 30 });
  assert.equal(result.changes.length, 4);
  assert.equal(result.written, 0);
  assert.match(result.rejected.reason, /4 machine changes and the cap is 3/);
  assert.deepEqual(await files(root), before);

  /* With room under the cap, all four go through as one run. */
  const all = await runRules({ store, now: NOW, fetched: ['wa-wem-prices'], readSummary: async () => summary({ spreadMean: 30 }), cap: 4 });
  assert.equal(all.written, 0);
  assert.equal(all.entries.length, 4);
  assert.deepEqual(await files(root), before);
}));

test('only an analyst can apply and revert a reported crossing', () => scratch(async (store) => {
  const proposed = (await go(store, { spreadMean: 44.2 })).changes[0];
  await assert.rejects(store.apply(proposed, NOW), /is not live/);
  const applied = await store.apply({ ...proposed, author: analyst, to: { ...proposed.to, author: 'analyst' } }, NOW);
  const reverted = await store.revert(applied.id, new Date('2026-10-13T09:00:00Z'));
  assert.equal(reverted.author.kind, 'analyst');
  assert.equal(reverted.reverts, applied.id);
  assert.deepEqual((await store.read('wa')).grades.assetReturn, GRADE);
  await assert.rejects(store.revert('no-such-id'), /not a changelog id/);
}));

test('the engine reads published data and the view, and nothing private', async () => {
  const source = await readFile(new URL('../etl/rules.mjs', import.meta.url), 'utf8');
  const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m => m[1]);
  for (const spec of imports){
    assert.ok(/^(node:url|\.\.\/src\/governance\/|\.\.\/view\/schema\/|\.\/lib\/)/.test(spec), `etl/rules.mjs imports ${spec}`);
  }
  assert.ok(!/node:fs/.test(source), 'the engine touches the filesystem only through the two boundaries');
  /* evaluateRules is given its reader; it has no other way to a file. */
  const result = await evaluateRules({ views: [], changelog: [], readSummary: async () => { throw new Error('read'); }, fetched: [], now: NOW });
  assert.deepEqual(result.changes, []);
});

test('the committed rule is the one that was approved, and its line is the derivation', async () => {
  /* The first real rule, in the store. Its threshold must go on being the
     baseline less the materiality ceiling: revise either and this fails, so
     the rule is looked at again rather than left testing a stale line. */
  const committed = createViewStore();
  const view = await committed.read('wa');
  const rule = view.triggers.find(t => t.id === RULE.id);
  assert.ok(rule, 'the rule is not in the committed store');
  assert.deepEqual(rule.when.dataset, 'wa-wem-prices');
  assert.equal(rule.when.field, 'derived.spreadMean');
  assert.equal(rule.when.op, '<');
  assert.equal(rule.when.value, Math.round(BASELINE * (1 - FRACTION) * 100) / 100);
  assert.deepEqual(rule.when.guard, [{ field: 'derived.spreadDays', op: '>=', value: MIN_WINDOW_DAYS }]);
  /* It moves a trend and its cause. Not the grade's number, and no verdict. */
  assert.deepEqual(rule.effect.map(step => step.path), ['grades.assetReturn.trend', 'grades.assetReturn.trendCause']);
  assert.notEqual(view.grades.assetReturn.basis, 'practitioner', 'a rule cannot act on a practitioner grade');
  /* Armed by the analyst, and nobody else. */
  const writes = (await committed.changelog()).filter(e => e.market === 'wa' && e.path === `triggers.${RULE.id}`);
  assert.ok(writes.length >= 1);
  for (const write of writes) assert.equal(write.author.kind, 'analyst');
});
