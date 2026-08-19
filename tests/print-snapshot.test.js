/* ---------------------------------------------------------------------------
   A PRINTED RESULT MUST CARRY THE ASSUMPTIONS THAT PRODUCED IT.

   On screen the reader can see the slider. On paper they cannot, so an IRR
   printed without its input set is a number with no provenance that still looks
   authoritative — the most dangerous artefact this platform can emit.

   Two layers are checked here, because the failure can happen in either.

   THE CONTRACT (src/print/printContext.js) governs what may be printed at all:
   a run that failed or was withheld must not carry a headline result, and a
   successful one must carry its assumptions. This is testable without a DOM
   because the adapter is a pure function of the inputs that were calculated.

   THE STYLESHEET governs what reaches the page: controls removed, snapshot
   shown, table headers repeated across sheets, charts not clipped, caveats and
   gap notices at full weight.

   WHAT IS NOT COVERED HERE. The DOM wiring — that the snapshot element is
   inserted immediately before the outputs, and that both are replaced in one
   pass — has no test, because the project has no DOM shim and adding one for
   this would be a large dependency for a small assertion. It was verified in a
   browser instead: changing capacity from 50 to 75 moved the printed
   assumption and the headline NPV together, in the same frame.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createPrintContext, validatePrintContext, PRINT_STATUS } from '../src/print/printContext.js';
import { printContextFor } from '../src/components/dossierModelPanel.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRINT_CSS = readFileSync(path.join(REPO, 'src/styles/print.css'), 'utf8');

/* A minimal model, in the shape the panel consumes. */
const model = () => ({
  name: ['Test model', '测试模型'],
  version: 'v2',
  vintage: '2026-08-19',
  calculate: (i) => ({ irr: i.capacity / 1000, npv: i.capacity * 100 }),
  inputs: [
    { key: 'capacity', label: ['Capacity', '容量'], base: 50, min: 1, max: 200, step: 1,
      unit: 'MW', source: 'test' },
    { key: 'rate', label: ['Rate', '费率'], base: 0.08, min: 0, max: 1, step: 0.01, source: 'test' },
  ],
  kpis: [{ label: ['IRR', 'IRR'], path: 'irr', unit: 'pct' },
         { label: ['NPV', 'NPV'], path: 'npv', unit: 'money' }],
  scenarios: [{ id: 'high', name: ['High case', '高情景'], overrides: { capacity: 150 } }],
  gaps: [{ id: 'G1', severity: 'material', what: ['A material gap', '一项重要缺口'],
           why: ['because', '因为'] }],
});
const verdict = { golden: [], blocking: [], shape: [], publishable: true };
const ctxFor = (inputs, scenario = null) => {
  const m = model();
  return printContextFor(m, inputs, verdict, scenario, m.calculate(inputs), PRINT_STATUS.OK, null);
};

test('changing an input changes both the printed assumption and the printed result', () => {
  /* The property the whole design exists for. The context is built from the
     inputs that were just calculated, so the two cannot drift apart — there is
     no second copy of the selected values to fall out of date. */
  const a = ctxFor({ capacity: 50, rate: 0.08 });
  const b = ctxFor({ capacity: 75, rate: 0.08 });

  const printed = (c, label) => c.assumptions.find(x => x.label[0] === label).value;
  assert.notEqual(printed(a, 'Capacity'), printed(b, 'Capacity'),
    'the printed assumption did not move with the input');

  const out = (c, label) => c.outputs.find(x => x.label[0] === label).value;
  assert.notEqual(out(a, 'NPV'), out(b, 'NPV'),
    'the printed result did not move with the input');

  /* And the untouched input is untouched, so a change cannot quietly rewrite
     the rest of the sheet. */
  assert.equal(printed(a, 'Rate'), printed(b, 'Rate'));
});

test('the selected scenario is named in print', () => {
  const plain = ctxFor({ capacity: 50, rate: 0.08 });
  assert.equal(plain.scenario, null, 'base case carries no scenario, rather than a fabricated one');

  const scenario = model().scenarios[0];
  const high = ctxFor({ capacity: 150, rate: 0.08 }, scenario);
  assert.equal(high.scenario.id, 'high');
  assert.deepEqual(high.scenario.name, ['High case', '高情景']);
});

test('the model identifier and assumption vintage are printed', () => {
  const c = ctxFor({ capacity: 50, rate: 0.08 });
  assert.equal(c.model.id, 'Test model');
  assert.equal(c.model.version, 'v2');
  assert.equal(c.model.vintage, '2026-08-19');
});

test('a withheld run prints its reason and no headline result', () => {
  /* A blocking gap must reach paper as a withheld notice, not as a blank
     space — which is indistinguishable from a model nobody ran. */
  const m = model();
  const withheld = printContextFor(m, { capacity: 50, rate: 0.08 },
    { ...verdict, blocking: [m.gaps[0]] }, null, null, PRINT_STATUS.WITHHELD,
    ['Outputs withheld by a blocking gap', '因阻断性缺口暂缓发布输出']);

  assert.equal(withheld.status, PRINT_STATUS.WITHHELD);
  assert.deepEqual(withheld.outputs, [], 'a withheld run must print no headline result');
  assert.ok(withheld.statusReason[0].length > 0, 'and must say why');
  assert.ok(withheld.assumptions.length, 'while still printing what was assumed');
});

test('a failed calculation cannot print a stale headline result', () => {
  /* The contract refuses the combination outright, so a caller cannot pass the
     previous run's outputs alongside a failure status. */
  assert.throws(() => createPrintContext({
    status: PRINT_STATUS.FAILED,
    statusReason: ['threw', '报错'],
    model: { id: 'm' },
    assumptions: [{ label: ['a', 'a'], value: '1' }],
    outputs: [{ label: ['IRR', 'IRR'], value: '12%' }],
    gaps: [],
  }), /must not\s+print a headline result|non-ok run/);
});

test('a result may not be printed without its governing assumptions', () => {
  const problems = validatePrintContext({
    status: PRINT_STATUS.OK, model: { id: 'm' },
    assumptions: [], outputs: [{ label: ['IRR', 'IRR'], value: '12%' }], gaps: [],
  });
  assert.ok(problems.some(p => /assumptions that governed it/.test(p)));
});

test('material gaps travel with the snapshot', () => {
  const c = ctxFor({ capacity: 50, rate: 0.08 });
  assert.equal(c.gaps.length, 1);
  assert.equal(c.gaps[0].id, 'G1');
});

test('the context is frozen — a record of a run that already happened', () => {
  const c = ctxFor({ capacity: 50, rate: 0.08 });
  assert.throws(() => { c.status = PRINT_STATUS.OK; }, TypeError);
  assert.throws(() => { c.assumptions[0].value = '999'; }, TypeError);
});

/* ---- the stylesheet -------------------------------------------------------- */

/** The declarations inside the top-level `@media print` block. */
const printBlock = (() => {
  const at = PRINT_CSS.indexOf('@media print{');
  assert.ok(at >= 0, 'print.css has no @media print block');
  let depth = 0, i = PRINT_CSS.indexOf('{', at);
  const start = i;
  for (; i < PRINT_CSS.length; i++){
    if (PRINT_CSS[i] === '{') depth++;
    else if (PRINT_CSS[i] === '}' && --depth === 0) break;
  }
  return PRINT_CSS.slice(start, i);
})();

test('no control prints', () => {
  /* Sliders, boxes and buttons say nothing on paper about where they were set.
     Their values print, in the snapshot, instead. */
  for (const sel of ['input', 'select', 'button', '.btn', '.frm', '.seg', '.ctrls', '.tabs']){
    assert.ok(new RegExp('(^|[,\\s])' + sel.replace('.', '\\.') + '\\s*[,{]').test(printBlock),
      `${sel} is not hidden in print`);
  }
  assert.match(printBlock, /display:\s*none\s*!important/);
});

test('the snapshot is hidden on screen and shown in print', () => {
  assert.match(PRINT_CSS, /\.print-snap\{\s*display:none;\s*\}/,
    'the snapshot must not compete with the controls on screen');
  assert.match(printBlock, /\.print-snap\{\s*display:block;\s*\}/);
});

test('the snapshot cannot be separated from the outputs it governs', () => {
  assert.match(printBlock, /break-after:\s*avoid/,
    'the snapshot must not end a page whose results begin the next one');
  assert.match(printBlock, /\.print-snap\{[^}]*break-inside:\s*avoid/s);
});

test('long tables repeat their headers', () => {
  assert.match(printBlock, /thead\{\s*display:table-header-group/,
    'a table crossing a page boundary must relabel its columns');
  assert.match(printBlock, /tr[^{]*\{[^}]*break-inside:\s*avoid/,
    'a row split across sheets is unreadable');
});

test('charts and wide tables are not clipped', () => {
  assert.match(printBlock, /svg\{[^}]*max-width:\s*100%\s*!important/s,
    'an SVG laid out to a viewBox prints past the margin without this');
  assert.match(printBlock, /\.tbl-wrap\{[^}]*overflow:\s*visible\s*!important/s,
    'paper cannot scroll, so the scroll wrapper must stop clipping');
});

test('caveats, sources and gap notices survive print at full weight', () => {
  for (const sel of ['.cap', '.src', '.why', '.warnbox', '.gap-ledger', '.print-snap-gaps',
                     '.print-snap-status']){
    assert.ok(printBlock.includes(sel), `${sel} is not preserved for print`);
  }
  assert.match(printBlock, /opacity:\s*1\s*!important/,
    'a caveat faded for print is a caveat that did not print');
});

test('the overflow fade is cleared in print and in forced colours', () => {
  /* A mask is not a colour, so it survives a forced-colours palette
     substitution and can hide content the reader explicitly asked to see. */
  assert.match(printBlock, /\.tabs\[data-overflow\]\{[^}]*mask-image:\s*none/s);
  assert.match(PRINT_CSS, /@media \(forced-colors: active\)\{[^}]*mask-image:\s*none/s);
});
