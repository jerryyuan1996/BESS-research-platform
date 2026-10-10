/* ---------------------------------------------------------------------------
   THE CAPITAL-AT-RISK LEDGER AND THE TRIGGER VOCABULARY.

   Neither renders anywhere yet and nothing computes an IRR from either, so a
   ledger that quietly lost an item or a trigger with an impossible date would
   fail nothing else. The arithmetic here also carries the plan's central
   example — the market with the smaller SHARE at risk asks for the larger SUM —
   and that is pinned as a relationship, not as two numbers.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ITEM_KIND, ITEM_KIND_LABEL, ITEM_STATUS, ITEM_STATUS_LABEL,
  validateLedger, referenceProject, itemUSD, ledgerTotals, limitInputs, carryingCostUSD,
} from '../src/entry/ledger.js';
import { allLedgers, ledgerFor, hasLedger, ledgerMarketIds } from '../src/entry/ledgerRegistry.js';
import {
  TRIGGER_KIND, TRIGGER_DIRECTION, TRIGGER_DIRECTION_LABEL, SOURCE_DECISION_PROFILE,
  validateTrigger, sourceProblems, byExpected, triggersWatching, overdue,
} from '../src/governance/triggers.js';
import { ARCHETYPES, METRIC, limitCheck } from '../src/governance/archetypes.js';
import { byId } from '../src/markets/registry.js';
import { FX } from '../src/comparison/assumptions.js';

const bilingual = (v) => Array.isArray(v) && v.length === 2 && /[一-鿿]/.test(v[1]) && !/[一-鿿]/.test(v[0]);

const totalsFor = (marketId) => {
  const market = byId(marketId);
  const project = referenceProject(market.comparison, FX[market.manifest.currency]);
  return ledgerTotals(ledgerFor(marketId), FX, project.costUSD);
};

const item = (patch = {}) => ({
  id: 'a-guarantee', kind: 'security', label: ['A guarantee', '一项保函'],
  amount: { perMW: 1000, currency: 'EUR' },
  postedAt: 'application', releasedAt: 'entry',
  beforeFid: true, beforeConsent: true, refundable: true,
  form: ['Bank guarantee', '银行保函'], lostIf: ['The project is withdrawn', '项目撤回'],
  evidence: ['a-source'], status: 'verified',
  ...patch,
});
const ledger = (items) => ({
  marketId: 'xx', basis: { powerMW: 10, durationHours: 2 },
  summary: ['A test ledger.', '测试台账。'], limit: ['Nothing is real here.', '此处均非真实数据。'], items,
});

/* ---- the ledgers the repository holds -------------------------------------- */

test('every ledger validates and belongs to a registered market', () => {
  assert.deepEqual(ledgerMarketIds().sort(), ['fi', 'gb', 'ro', 'wa'], 'the four corners, and only those so far');
  for (const l of allLedgers()){
    assert.deepEqual(validateLedger(l), [], `${l.marketId}: ledger is invalid`);
    const market = byId(l.marketId);
    assert.ok(market, `${l.marketId}: not a registered market`);
    /* The ledger is always costed on the project the engine prices. */
    assert.deepEqual(l.basis, market.comparison.archetype, `${l.marketId}: basis is not the comparison archetype`);
    assert.ok(bilingual(l.summary) && bilingual(l.limit), `${l.marketId}: summary and limit in both languages`);
    for (const i of l.items){
      assert.ok(bilingual(i.label) && bilingual(i.form), `${l.marketId}/${i.id}: label and form in both languages`);
    }
  }
  assert.ok(hasLedger('wa'));
  assert.equal(ledgerFor('ercot'), null, 'absence stays comfortable');
});

test('every register key a ledger cites exists in that market\'s sources', async () => {
  for (const l of allLedgers()){
    const { SRC } = await import(`../src/markets/${l.marketId}/sources.js`);
    for (const i of l.items) for (const source of i.evidence){
      if (typeof source === 'string') assert.ok(SRC[source], `${l.marketId}/${i.id}: cites "${source}", which is not in the register`);
    }
  }
});

test('nothing reached only through a search summary is marked verified', () => {
  for (const l of allLedgers()) for (const i of l.items){
    if (i.evidence.some(s => s?.access === 'search-summary')) assert.notEqual(i.status, 'verified', `${l.marketId}/${i.id}`);
  }
});

test('the barrier is absolute, not relative: the smaller share is the larger sum', () => {
  /* The plan's central example. Western Australia's security is a smaller
     share of project cost than Romania's guarantees and several times more
     money, because the project is many times larger. A grade written on the
     share alone would rank them the wrong way round for a small developer. */
  const wa = totalsFor('wa'), ro = totalsFor('ro');
  assert.ok(wa.shareOfCost < ro.shareOfCost, 'WA should be the smaller share');
  assert.ok(wa.preFid.usd > 3 * ro.preFid.usd, 'WA should be several times the money');

  /* And so the developer's dollar limit closes one and not the other. */
  const check = (totals) => { const { metrics, incomplete } = limitInputs(totals); return limitCheck('developer', metrics, 'greenfield', incomplete); };
  assert.ok(check(wa).breached.includes('pre-fid-capital'));
  assert.ok(!check(ro).breached.includes('pre-fid-capital'));
});

test('Romania\'s ledger reads the guarantee amounts from the dashboard\'s own data', async () => {
  const { M } = await import('../src/markets/ro/data.js');
  const byItem = Object.fromEntries(ledgerFor('ro').items.map(i => [i.id, i]));
  assert.equal(byItem['auction-guarantee'].amount.perMW, M.official.auctionGuarEurMW);
  assert.equal(byItem['establishment-guarantee'].amount.perKW, M.official.estabGuarEurKW);
  /* The third has no amount because the tariff it is a share of is unpublished. */
  assert.equal(byItem['connection-tariff-guarantee'].amount, null);
  assert.ok(totalsFor('ro').preFid.lowerBound);
});

test('an empty ledger supplies no figure, so every limit reads as unchecked', () => {
  const gb = totalsFor('gb');
  assert.equal(gb.empty, true);
  assert.equal(gb.shareOfCost, null, 'zero would say the market asks for nothing');
  assert.equal(gb.weakestStatus, 'unsourced');
  const { metrics } = limitInputs(gb);
  assert.ok(!(METRIC.PRE_FID_CAPITAL_USD in metrics));
  assert.ok(METRIC.PROJECT_COST_USD in metrics, 'project cost comes from the engine and is known');
  assert.ok(limitCheck('developer', metrics, 'greenfield').unchecked.includes('pre-fid-capital'));
});

/* ---- the arithmetic --------------------------------------------------------- */

test('an item converts per MW, per kW and fixed amounts for the reference project', () => {
  const basis = { powerMW: 10, durationHours: 2 }, fx = { EUR: 1.1, AUD: 0.5 };
  assert.equal(itemUSD(item(), basis, fx), 1000 * 10 * 1.1);
  assert.equal(itemUSD(item({ amount: { perKW: 3, currency: 'EUR' } }), basis, fx), 3 * 10 * 1000 * 1.1);
  assert.equal(itemUSD(item({ amount: { fixed: 5000, currency: 'AUD' } }), basis, fx), 2500);
  assert.equal(itemUSD(item({ amount: null }), basis, fx), null);
  assert.equal(itemUSD(item({ amount: { fixed: 1, currency: 'XXX' } }), basis, fx), null, 'no rate, no number');
});

test('totals separate what is spent before the decision, what is pledged, and what is pledged before consent', () => {
  const fx = { EUR: 1 };
  const totals = ledgerTotals(ledger([
    item({ id: 'a', amount: { fixed: 100, currency: 'EUR' } }),
    item({ id: 'b', amount: { fixed: 40, currency: 'EUR' }, beforeConsent: false }),
    item({ id: 'c', kind: 'fee', amount: { fixed: 10, currency: 'EUR' }, refundable: false, releasedAt: null }),
    item({ id: 'd', amount: { fixed: 999, currency: 'EUR' }, beforeFid: false }),
  ]), fx, 1000);
  assert.equal(totals.preFid.usd, 150);
  assert.equal(totals.security.usd, 140);
  assert.equal(totals.securityBeforeConsent.usd, 100);
  assert.equal(totals.shareOfCost, 0.15);
  assert.equal(totals.perMWUSD, 15);
  assert.deepEqual(totals.byStage, { application: 150 });
  assert.equal(totals.preFid.lowerBound, false);
  assert.equal(totals.weakestStatus, 'verified');
});

test('an unquantified item makes the total a lower bound instead of vanishing', () => {
  const totals = ledgerTotals(ledger([
    item({ id: 'a', amount: { fixed: 100, currency: 'EUR' } }),
    item({ id: 'b', amount: null, amountNote: ['Unpublished', '未公开'], status: 'verify' }),
    item({ id: 'c', amount: { fixed: 5, currency: 'EUR' }, beforeConsent: null }),
  ]), { EUR: 1 }, 1000);
  assert.equal(totals.preFid.usd, 105);
  assert.equal(totals.preFid.lowerBound, true);
  assert.deepEqual(totals.unquantified, ['b']);
  /* Position relative to consent not established: the figure is "at least". */
  assert.equal(totals.securityBeforeConsent.usd, 100);
  assert.equal(totals.securityBeforeConsent.lowerBound, true);
  assert.equal(totals.weakestStatus, 'verify');
  assert.deepEqual(limitInputs(totals).incomplete.sort(), [METRIC.PRE_FID_CAPITAL_USD, METRIC.SECURITY_BEFORE_CONSENT_USD].sort());
});

test('a lower bound over a limit is a breach; a lower bound under it is unchecked, never a pass', () => {
  const dev = ARCHETYPES.developer;
  const max = dev.limits.find(l => l.id === 'pre-fid-capital').max;
  const incomplete = [METRIC.PRE_FID_CAPITAL_USD];
  assert.deepEqual(limitCheck(dev, { [METRIC.PRE_FID_CAPITAL_USD]: max + 1 }, 'greenfield', incomplete).breached, ['pre-fid-capital']);
  const under = limitCheck(dev, { [METRIC.PRE_FID_CAPITAL_USD]: max / 2 }, 'greenfield', incomplete);
  assert.deepEqual(under.breached, []);
  assert.ok(under.unchecked.includes('pre-fid-capital'));
  assert.ok(!limitCheck(dev, { [METRIC.PRE_FID_CAPITAL_USD]: max / 2 }, 'greenfield').unchecked.includes('pre-fid-capital'));
});

test('the reference project is power × installed cost × rate, or null', () => {
  const comparison = { archetype: { powerMW: 50, durationHours: 2 }, economics: { capexPerMW: 400000 } };
  assert.equal(referenceProject(comparison, 1.1).costUSD, 50 * 400000 * 1.1);
  assert.equal(referenceProject(comparison, undefined), null);
  assert.equal(referenceProject({}, 1), null);
});

test('carrying cost is amount × rate × years, and null on a missing input', () => {
  assert.equal(carryingCostUSD(1000000, 0.08, 18), 120000);
  assert.equal(carryingCostUSD(1000000, undefined, 18), null);
});

test('the ledger validator refuses the quiet failures', () => {
  const bad = (patch, pattern, top = {}) => {
    const problems = validateLedger({ ...ledger([item(patch)]), ...top });
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern}, got ${JSON.stringify(problems)}`);
  };
  assert.deepEqual(validateLedger(ledger([item()])), []);
  assert.deepEqual(validateLedger(ledger([])), [], 'an empty ledger is valid');
  bad({ kind: 'bribe' }, /kind must be/);
  bad({ postedAt: 'someday' }, /postedAt must be a pathway stage/);
  bad({ amount: { perMW: 1, perKW: 1, currency: 'EUR' } }, /exactly one of/);
  bad({ amount: { perMW: 1 } }, /currency/);
  bad({ amount: null }, /amountNote/);
  bad({ beforeFid: undefined }, /beforeFid must be stated/);
  bad({ beforeConsent: undefined }, /beforeConsent/);
  bad({ lostIf: undefined }, /how they are lost/);
  bad({ refundable: false }, /no release stage/);
  bad({ evidence: [] }, /no evidence/);
  bad({ status: 'probably' }, /status must be/);
  bad({ evidence: [{ publisher: 'P', url: 'https://example.org', access: 'search-summary' }] }, /search summary cannot verify/);
  bad({}, /limit must be/, { limit: undefined });
  bad({}, /basis must give/, { basis: {} });
  for (const k of ITEM_KIND) assert.ok(bilingual(ITEM_KIND_LABEL[k]));
  for (const s of ITEM_STATUS) assert.ok(bilingual(ITEM_STATUS_LABEL[s]));
});

/* ---- triggers ---------------------------------------------------------------- */

const trigger = (patch = {}) => ({
  id: 'xx-an-event', kind: 'event', market: 'xx', label: ['An event', '一个事件'],
  expected: '2027-04', watches: ['foreignEntry'], direction: 'down', source: 'a-source', effect: null,
  ...patch,
});

test('a trigger is a dated record that names what it would move', () => {
  assert.deepEqual(validateTrigger(trigger()), []);
  assert.deepEqual(validateTrigger(trigger({ expected: null })), [], 'announced and undated is allowed');
  assert.deepEqual(validateTrigger(trigger({ expected: '2027-02-28', source: SOURCE_DECISION_PROFILE })), []);
  const bad = (patch, pattern) => assert.ok(validateTrigger(trigger(patch)).some(p => pattern.test(p)), `${JSON.stringify(patch)} was accepted`);
  bad({ id: 'Not A Slug' }, /kebab-case/);
  bad({ kind: 'rumour' }, /kind must be/);
  bad({ label: 'An event' }, /label must be/);
  bad({ expected: 'spring 2027' }, /expected must be/);
  bad({ expected: '2027-13' }, /expected must be/);
  bad({ expected: '2027-02-30' }, /expected must be/);
  bad({ watches: [] }, /at least one dimension/);
  bad({ watches: ['vibes'] }, /unknown dimension/);
  bad({ direction: 'sideways' }, /direction must be/);
  bad({ source: '' }, /source is empty/);
  bad({ source: { publisher: 'P', url: 'http://insecure.example', access: 'opened' } }, /https/);
  bad({ source: { publisher: 'P', url: 'https://example.org', access: 'heard' } }, /access must be/);
  for (const d of Object.values(TRIGGER_DIRECTION)) assert.ok(bilingual(TRIGGER_DIRECTION_LABEL[d]));
  assert.deepEqual(Object.values(TRIGGER_KIND), ['event', 'data']);
  assert.deepEqual(sourceProblems({ publisher: 'P', url: 'https://example.org', access: 'opened' }), []);
});

test('a trigger may not carry an effect yet', () => {
  /* A pre-written change that applies itself is automation writing judgement.
     The plan allows it in a later phase; until the authority model is rewritten
     it is refused here rather than stored and ignored. */
  const withEffect = trigger({ effect: [{ path: 'verdicts.developer.call', to: 'wait' }] });
  assert.ok(validateTrigger(withEffect).some(p => /effect must be null/.test(p)));
});

test('triggers sort by when they are expected, a bare month at its end, undated last', () => {
  const list = [
    trigger({ id: 'xx-undated', expected: null }),
    trigger({ id: 'xx-month', expected: '2026-12' }),
    trigger({ id: 'xx-day', expected: '2026-12-03' }),
    trigger({ id: 'xx-early', expected: '2026-10-30', watches: ['assetReturn'] }),
  ];
  assert.deepEqual(byExpected(list).map(t => t.id), ['xx-early', 'xx-day', 'xx-month', 'xx-undated']);
  assert.deepEqual(triggersWatching(list, 'assetReturn').map(t => t.id), ['xx-early']);
  /* A month is overdue only once it has ended. */
  assert.deepEqual(overdue(list, '2026-12-15').map(t => t.id), ['xx-early', 'xx-day']);
  assert.deepEqual(overdue(list, '2027-01-01').map(t => t.id), ['xx-early', 'xx-day', 'xx-month']);
});
