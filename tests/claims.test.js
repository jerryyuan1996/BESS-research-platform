/* ---------------------------------------------------------------------------
   CLAIM VALIDATION — the mechanical half, demonstrated on the pilot.

   What is checked here is the part a machine can own: one sentence, a declared
   basis, and evidence ids that resolve to records in the section's own market.
   Whether a claim is analytically sound is human review, and no test in this
   file should ever be read as standing in for it.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markets } from '../src/markets/registry.js';
import {
  validateClaim, evidenceIds, CLAIM_BASIS, READINESS, NO_CLAIM_SECTIONS,
} from '../src/governance/claims.js';

const market = (id) => markets.find(m => m.manifest.id === id);

test('a well-formed claim on real evidence validates', () => {
  const claim = {
    text: ['Capacity payments set the floor for WA storage revenue, at a price the regulator has already fixed for 2028-29.',
           '容量收入构成西澳储能收益的下限，且该价格已由监管机构就2028-29年度确定。'],
    basis: CLAIM_BASIS.MEASURED,
    evidence: ['brcp', 'crc'],
  };
  assert.deepEqual(validateClaim(claim, market('wa')), []);
});

test('a retired or mistyped evidence id cannot pass', () => {
  /* The failure this validation exists for. An unresolvable id would otherwise
     render a confident sentence whose support does not exist. */
  const claim = {
    text: ['Something is true.', '某事成立。'],
    basis: CLAIM_BASIS.MEASURED,
    evidence: ['brcp', 'noSuchRecord'],
  };
  const problems = validateClaim(claim, market('wa'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /"noSuchRecord" does not resolve in wa/);
});

test('an id belonging to another market does not resolve', () => {
  /* PJM's auction record is real, and it is not WA evidence. */
  assert.ok(evidenceIds(market('pjm')).has('bra2829'));
  const problems = validateClaim({
    text: ['A claim.', '一项结论。'], basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
  }, market('wa'));
  assert.match(problems[0], /does not resolve in wa/);
});

test('a claim must be one sentence', () => {
  const two = validateClaim({
    text: ['This is one point. And this is another.', '这是一点。这是另一点。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
  }, market('wa'));
  assert.ok(two.some(p => /exactly one sentence/.test(p)));

  /* A semicolon is the usual way a second sentence gets smuggled in. */
  const smuggled = validateClaim({
    text: ['Revenue is capacity-led; arbitrage is thin.', '收入以容量为主；套利较薄。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
  }, market('wa'));
  assert.ok(smuggled.some(p => /exactly one sentence/.test(p)));
});

test('the basis must be declared, so a forecast cannot read as fact', () => {
  const problems = validateClaim({
    text: ['Reserve prices fall through 2030.', '备用价格将持续下降至2030年。'],
    evidence: ['reserveForecast'],
  }, market('fi'));
  assert.ok(problems.some(p => /basis must be one of/.test(p)));

  /* Declared as a forecast, the same sentence is acceptable to the validator —
     whether the wording conveys forecast-ness is the reviewer's call. */
  assert.deepEqual(validateClaim({
    text: ['Reserve prices fall through 2030.', '备用价格将持续下降至2030年。'],
    basis: CLAIM_BASIS.FORECAST, evidence: ['reserveForecast'],
  }, market('fi')), []);
});

test('a claim citing nothing is refused', () => {
  const problems = validateClaim({
    text: ['Something is true.', '某事成立。'], basis: CLAIM_BASIS.MEASURED, evidence: [],
  }, market('wa'));
  assert.ok(problems.some(p => /at least one evidence id/.test(p)));
});

test('an external dependency must declare itself', () => {
  const problems = validateClaim({
    text: ['A claim.', '一项结论。'], basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
    external: [{ section: 'grid' }],
  }, market('wa'));
  assert.ok(problems.some(p => /name the section and why/.test(p)));
});

test('absence is a valid state, not a validation failure', () => {
  /* A blocked or descriptive section carries no claim, and that must not read
     as an error — otherwise the pressure is to write something. */
  assert.deepEqual(validateClaim(null, market('fi')), []);
  assert.deepEqual(validateClaim(undefined, market('wa')), []);
  for (const id of NO_CLAIM_SECTIONS) assert.ok(typeof id === 'string');
  assert.ok(Object.values(READINESS).includes('blocked'));
});
