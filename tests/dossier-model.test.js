/* ---------------------------------------------------------------------------
   THE DOSSIER MODEL INTERFACE.

   Project-specific arithmetic lives outside this repository, so what can be
   tested here is the CONTRACT it has to satisfy — and the contract is doing real
   work, because it is what stops a transcription publishing plausible wrong
   numbers.

   Three refusals are asserted, and each exists because the alternative is
   worse than an absent number:

     · a model with no golden checks cannot claim to reproduce anything;
     · a model whose goldens fail does not get to show its outputs;
     · an input with no provenance invites a reader to move it and treat the
       result as sourced.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GAP, GAP_LABEL, GAP_SEVERITY, GAP_SEVERITY_LABEL,
  validateModel, baseInputs, scenarioInputs, readPath,
  runGoldenChecks, verifyModel,
} from '../src/projects/dossier/model.js';

/* A minimal well-formed model. Arithmetic deliberately trivial: these tests are
   about the contract, not about anyone's formulas. */
const ok = () => ({
  name: ['M', 'M'],
  calculate: (i) => ({ total: i.a * i.b, nested: { half: (i.a * i.b) / 2 } }),
  inputs: [
    { key: 'a', label: ['A', 'A'], base: 10, min: 0, max: 100, source: 'test' },
    { key: 'b', label: ['B', 'B'], base: 3, min: 0, max: 10, source: 'test' },
  ],
  scenarios: [{ id: 'big', name: ['Big', '大'], overrides: { b: 5 } }],
  golden: [
    { id: 'base', expect: { total: 30 } },
    { id: 'big', scenarioId: 'big', expect: { total: 50 } },
  ],
});

test('a well-formed model validates and verifies', () => {
  const m = ok();
  assert.deepEqual(validateModel(m), []);
  const v = verifyModel(m);
  assert.ok(v.publishable);
  assert.ok(v.golden.every(g => g.ok));
});

test('a model with no golden checks is rejected', () => {
  /* The central rule. A transcription is a CLAIM that this code reproduces that
     spreadsheet; without goldens the claim has no evidence and the numbers are
     plausible rather than verified. */
  const problems = validateModel({ ...ok(), golden: [] });
  assert.ok(problems.some(p => /golden/.test(p)));
});

test('a model whose goldens fail is not publishable', () => {
  const m = { ...ok(), golden: [{ id: 'base', expect: { total: 999 } }] };
  const v = verifyModel(m);
  assert.equal(v.publishable, false);
  assert.equal(v.golden[0].ok, false);
  assert.match(v.golden[0].failures[0].message, /differs by/);
});

test('tolerance is explicit, and absent means exact', () => {
  /* "Agrees to the cent" and "agrees to a basis point" are different claims and
     the model says which it is making. */
  const drifty = { ...ok(), calculate: (i) => ({ total: i.a * i.b + 0.4 }) };
  assert.equal(runGoldenChecks({ ...drifty, golden: [{ id: 'x', expect: { total: 30 } }] })[0].ok, false,
    'no tolerance must mean exact');
  assert.equal(runGoldenChecks({ ...drifty, golden: [{ id: 'x', expect: { total: 30 }, tolerance: { default: 0.5 } }] })[0].ok, true,
    'a declared tolerance must be honoured');
  assert.equal(runGoldenChecks({ ...drifty, golden: [{ id: 'x', expect: { total: 30 }, tolerance: { total: 0.5 } }] })[0].ok, true,
    'per-path tolerance must be honoured');
});

test('a calculate() that throws is a failed golden, not a crash', () => {
  const boom = { ...ok(), calculate: () => { throw new Error('bad input'); } };
  const v = verifyModel(boom);
  assert.equal(v.publishable, false);
  assert.match(v.golden[0].failures[0].path, /threw/);
});

test('every input needs provenance or a gap that explains its absence', () => {
  const m = ok();
  m.inputs[0] = { key: 'a', label: ['A', 'A'], base: 10 };
  assert.ok(validateModel(m).some(p => /needs a source/.test(p)));

  /* Naming a gap is the accepted alternative — that is the ledger doing its job
     rather than being bypassed. */
  m.inputs[0].gapId = 'G1';
  assert.deepEqual(validateModel(m), []);
});

test('a gap without a reason is rejected, and a blocking gap withholds outputs', () => {
  const m = ok();
  m.gaps = [{ id: 'G1', kind: GAP.HARDCODED, severity: GAP_SEVERITY.NOTED, what: ['x', 'x'] }];
  assert.ok(validateModel(m).some(p => /a gap without a reason/.test(p)));

  m.gaps = [{ id: 'G1', kind: GAP.EXTERNAL_DEPENDENCY, severity: GAP_SEVERITY.BLOCKING,
              what: ['x', 'x'], why: ['y', 'y'] }];
  const v = verifyModel(m);
  assert.equal(v.publishable, false, 'a blocking gap must withhold outputs even when goldens pass');
  assert.equal(v.blocking.length, 1);
});

test('a base value outside its own bounds is rejected', () => {
  const m = ok();
  m.inputs[0].base = 500;   // max is 100
  assert.ok(validateModel(m).some(p => /outside \[min, max\]/.test(p)));
});

test('scenarios layer over the base rather than replacing it', () => {
  const m = ok();
  assert.deepEqual(baseInputs(m), { a: 10, b: 3 });
  assert.deepEqual(scenarioInputs(m, 'big'), { a: 10, b: 5 },
    'an override changes only what it names');
  assert.deepEqual(scenarioInputs(m, 'nope'), baseInputs(m),
    'an unknown scenario falls back to base rather than producing a partial input set');
});

test('golden expectations may address nested output paths', () => {
  const m = { ...ok(), golden: [{ id: 'base', expect: { 'nested.half': 15 } }] };
  assert.equal(runGoldenChecks(m)[0].ok, true);
  assert.equal(readPath({ a: { b: 2 } }, 'a.b'), 2);
  assert.equal(readPath({}, 'a.b.c'), undefined, 'a missing path must not throw');
});

test('the platform comparison must explain itself and never replace a value', () => {
  const m = ok();
  m.platformCompare = [{ label: ['x', 'x'], platformPath: 'economics.capexPerMW' }];
  assert.ok(validateModel(m).some(p => /explanation/.test(p)),
    'a difference with no explanation is a number nobody can act on');

  m.platformCompare = [{ label: ['x', 'x'], projectValue: 1, platformPath: 'economics.capexPerMW',
                         explanation: ['e', 'e'] }];
  assert.deepEqual(validateModel(m), []);
  /* The contract is display-only: nothing in the model interface writes a
     platform value into inputs, and `calculate` never sees one. */
  assert.ok(!('platformValue' in m.platformCompare[0]),
    'the platform value is read at render time, never stored on the project model');
});

test('the gap vocabulary is complete', () => {
  for (const kind of Object.values(GAP)) assert.ok(GAP_LABEL[kind], `${kind} has no label`);
  for (const s of Object.values(GAP_SEVERITY)) assert.ok(GAP_SEVERITY_LABEL[s], `${s} has no label`);
});

test('a dossier with no model at all is fine', () => {
  assert.deepEqual(validateModel(null), []);
  assert.deepEqual(validateModel(undefined), []);
});
