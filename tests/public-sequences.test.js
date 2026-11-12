/* ---------------------------------------------------------------------------
   The step-through sequences of the explanatory scene: content rules.

   A sequence is content. These tests hold every step to the rules the plan
   sets for it, so a step cannot drift from the research it restates:

     - every step answers one of the six questions, sits in one of the three
       views and declares only facts a scenario may hold;
     - every step cites source ids that are in that market's own public
       content, and for Japan in that area's own pool;
     - no step types a figure: a year is a date, anything else would be a
       number nobody sourced;
     - every reader-facing string is an [en, zh] pair;
     - a contracted sequence is the shared six stages, in order, and its
       payment gates open in the order the stages say.

   Pure data and pure functions: nothing here needs a browser. The drawing and
   the controls are exercised in e2e/public-scene.spec.js.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import nem from '../src/experience/story/public/sequences/nem.js';
import jp from '../src/experience/story/public/sequences/jp.js';
import { STAGES, contracted } from '../src/experience/story/public/sequences/contracted.js';
import { SCENARIO, baseScenario, readScenario, paymentOutcome, limitOf } from '../src/experience/story/public/scenario.js';
import { loadPublicContent } from '../src/experience/story/public/content.js';
import { PUBLIC_CATALOG } from '../src/experience/story/public/catalog.js';

const QUESTIONS = ['system', 'constraint', 'response', 'value', 'payer', 'limit'];
const VIEWS = ['system', 'storage', 'mechanism'];
const MARKETS = { nem: nem.for('nem'), jp_tokyo: jp.for('jp_tokyo'), jp_kyushu: jp.for('jp_kyushu'), jp_hokkaido: jp.for('jp_hokkaido') };

const isPair = (value) => Array.isArray(value) && value.length === 2 && value.every(s => typeof s === 'string' && s.trim().length > 0);
/* A year is a date. Any other digit in a caption is a typed figure. */
const strayFigures = (text) => String(text).replace(/(19|20)\d{2}年/g, '').replace(/\b(19|20)\d{2}\b/g, '').match(/\d/g) || [];
const everyStep = () => Object.entries(MARKETS).flatMap(([market, sequences]) =>
  sequences.flatMap(sequence => sequence.steps.map(step => ({ market, sequence, step, where: `${market} › ${sequence.id} › ${step.id}` }))));

test('the release carries the sequences the plan names, four for each market', () => {
  assert.deepEqual(nem.sequences.map(q => q.id), ['nem-shift', 'nem-fcas', 'nem-cis', 'nem-network']);
  assert.deepEqual(jp.sequences.map(q => q.id), ['jp-tokyo-access', 'jp-kyushu-surplus', 'jp-hokkaido-link', 'jp-ltda']);
  /* A reader in one area of Japan gets that area's sequence and the national award. */
  assert.deepEqual(MARKETS.jp_kyushu.map(q => q.id), ['jp-kyushu-surplus', 'jp-ltda']);
  assert.deepEqual(MARKETS.jp_hokkaido.map(q => q.id), ['jp-hokkaido-link', 'jp-ltda']);
  assert.deepEqual(MARKETS.jp_tokyo.map(q => q.id), ['jp-tokyo-access', 'jp-ltda']);
  assert.deepEqual(jp.for('nem'), [jp.sequences.at(-1)], 'an unknown area gets the national sequence only');
});

test('every chapter that draws a scene opens on a sequence of its own', () => {
  for (const [market, sequences] of Object.entries(MARKETS)){
    for (const view of VIEWS) assert.ok(sequences.some(q => q.home.includes(view)), `${market}: no sequence opens the ${view} chapter`);
    const ids = sequences.map(q => q.id);
    assert.equal(new Set(ids).size, ids.length, `${market}: sequence ids repeat`);
    for (const q of sequences){
      assert.ok(isPair(q.title), `${q.id}: title is an [en, zh] pair`);
      assert.ok(q.home.length && q.home.every(view => VIEWS.includes(view)), `${q.id}: home names scene views`);
      assert.ok(q.steps.length >= 4 && q.steps.length <= 7, `${q.id}: ${q.steps.length} steps`);
      assert.equal(q.gates.length, 3, `${q.id}: three payment gates`);
      assert.ok(q.gates.every(isPair), `${q.id}: gate names are pairs`);
      const stepIds = q.steps.map(step => step.id);
      assert.equal(new Set(stepIds).size, stepIds.length, `${q.id}: step ids repeat`);
    }
  }
});

test('every step answers one question, in one view, with a scenario the drawing can show', () => {
  for (const { sequence, step, where } of everyStep()){
    assert.ok(QUESTIONS.includes(step.asks), `${where}: asks "${step.asks}"`);
    assert.ok(VIEWS.includes(step.view), `${where}: view "${step.view}"`);
    assert.ok(isPair(step.title), `${where}: title is an [en, zh] pair`);
    assert.ok(isPair(step.text), `${where}: text is an [en, zh] pair`);
    for (const [key, value] of Object.entries({ ...(sequence.base || {}), ...step.state })){
      if (key === 'soc'){ assert.ok(typeof value === 'number' && value >= 0 && value <= 1, `${where}: soc ${value}`); continue; }
      assert.ok(SCENARIO[key], `${where}: "${key}" is not a scenario fact`);
      assert.ok(SCENARIO[key].includes(value), `${where}: ${key} cannot be ${JSON.stringify(value)}`);
    }
  }
  /* A sequence is an argument, not a list: it ends on what limits the value, or on who pays. */
  for (const sequences of Object.values(MARKETS)) for (const q of sequences){
    assert.ok(['limit', 'payer'].includes(q.steps.at(-1).asks), `${q.id}: ends on "${q.steps.at(-1).asks}"`);
    assert.ok(new Set(q.steps.map(step => step.asks)).size >= 3, `${q.id}: asks fewer than three different questions`);
  }
});

test('no step types a figure: a year is a date, and nothing else is a number', () => {
  for (const { sequence, step, where } of everyStep()){
    for (const text of [...step.title, ...step.text]) assert.deepEqual(strayFigures(text), [], `${where}: typed figure in "${text}"`);
    for (const text of sequence.title) assert.deepEqual(strayFigures(text), [], `${sequence.id}: typed figure in its title`);
  }
  assert.deepEqual(strayFigures('In 2018 an earthquake'), []);
  assert.deepEqual(strayFigures('2016年南澳'), []);
  assert.deepEqual(strayFigures('pays 90% of the gap'), ['9', '0'], 'the rule sees a share');
});

test('every step cites sources that are in its own market’s public content', async () => {
  for (const [market, sequences] of Object.entries(MARKETS)){
    const content = await loadPublicContent(market);
    for (const q of sequences) for (const step of q.steps){
      assert.ok(Array.isArray(step.sources) && step.sources.length, `${market} › ${q.id} › ${step.id}: cites no source`);
      for (const key of step.sources){
        assert.ok(content.sources[key]?.url, `${market} › ${q.id} › ${step.id}: ${key} is not in this market’s source pool`);
      }
    }
  }
});

test('a contracted sequence is the shared six stages, and its gates open in their order', () => {
  assert.deepEqual(STAGES, ['availability', 'accreditation', 'award', 'obligation', 'performance', 'settlement']);
  for (const q of [nem.sequences.find(s => s.id === 'nem-cis'), jp.sequences.find(s => s.id === 'jp-ltda')]){
    assert.equal(q.family, 'contracted');
    assert.deepEqual(q.steps.map(step => step.id), STAGES, `${q.id}: six stages in order`);
    assert.deepEqual(q.steps.map(step => step.stage), [0, 1, 2, 3, 4, 5]);
    assert.ok(q.stages.length === 6 && q.stages.every(isPair), `${q.id}: each stage has the market’s own name`);
    const gates = q.steps.map(step => [step.state.qualified, step.state.awarded, step.state.delivers]);
    /* Being able to deliver earns nothing; an award pays nothing until the obligation is met. */
    assert.deepEqual(gates[0].slice(0, 2), [false, false], 'stage 1: neither qualified nor awarded');
    assert.deepEqual(gates[1].slice(0, 2), [true, false], 'stage 2: qualified, not awarded');
    assert.deepEqual(gates[2], [true, true, false], 'stage 3: awarded, nothing delivered yet');
    assert.deepEqual(gates[5], [true, true, true], 'stage 6: the payment settles');
    const open = gates.map(g => g.filter(Boolean).length);
    /* Stage 1 shows a plant that works (delivers) with no route to payment. */
    assert.deepEqual(open.slice(1), [...open.slice(1)].sort((a, b) => a - b), `${q.id}: a gate shuts again after it opened`);
  }
  const made = contracted({ id: 'x', home: ['mechanism'], title: ['T', 'T'], gates: [], stages: Object.fromEntries(STAGES.map(key => [key, { name: [key, key], title: ['t', 't'], text: ['x', 'x'], sources: [] }])) });
  assert.deepEqual(made.stages.map(pair => pair[0]), STAGES);
});

test('the payment line says paid only when all three conditions hold', () => {
  const paid = paymentOutcome({ qualified: true, awarded: true, delivers: true });
  for (const [qualified, awarded, delivers] of [[false, true, true], [true, false, true], [true, true, false], [false, false, false]]){
    const line = paymentOutcome({ qualified, awarded, delivers });
    assert.ok(isPair(line));
    assert.notDeepEqual(line, paid, `${qualified}/${awarded}/${delivers} must not read as paid`);
  }
  /* The first condition that fails is the one named. */
  assert.match(paymentOutcome({ qualified: false, awarded: false, delivers: false })[0], /^The first condition is not met/);
  assert.match(paymentOutcome({ qualified: true, awarded: false, delivers: false })[0], /^The second condition is not met/);
  assert.match(paymentOutcome({ qualified: true, awarded: true, delivers: false })[0], /^Awarded, but the third condition is not met/);
});

test('the words under the drawing are made from the scenario, for every market theme', () => {
  const themes = [...new Set(Object.values(PUBLIC_CATALOG).map(entry => entry.theme).filter(Boolean))];
  assert.ok(themes.length >= 8, 'the catalogue names its themes');
  for (const theme of themes){
    const base = baseScenario(theme);
    for (const [key, value] of Object.entries(base)) if (key !== 'soc') assert.ok(SCENARIO[key].includes(value), `${theme}: base ${key}`);
    const lines = readScenario(base, theme);
    assert.ok(lines.every(([key, text]) => typeof key === 'string' && isPair(text)), `${theme}: every line is a keyed pair`);
    assert.equal(lines.at(-1)[0], 'payment', 'the payment line closes the reading of the payment chain');
    for (const view of ['system', 'storage']) assert.equal(readScenario(base, theme, view).some(([key]) => key === 'payment'), false, `${theme}: the ${view} view draws no rail and reads no payment`);
    for (const [, text] of lines) for (const half of text) assert.deepEqual(strayFigures(half), [], `${theme}: typed figure in "${half}"`);
  }
  /* A system with no neighbour never reads as a full link, whatever the switch says. */
  assert.equal(limitOf('island'), 'boundary');
  const island = readScenario({ ...baseScenario('island'), network: 'constrained' }, 'island').find(([key]) => key === 'network')[1][0];
  assert.match(island, /no link to a neighbour/);
  /* An open connection overrides the flow, and night hides the curtailment line. */
  const open = readScenario({ ...baseScenario('kyushu'), breaker: 'open', flow: 'charge' }, 'kyushu').find(([key]) => key === 'flow')[1][0];
  assert.match(open, /neither charge nor discharge/);
  assert.equal(readScenario({ ...baseScenario('kyushu'), time: 'night', solar: 'curtailed' }, 'kyushu').some(([key]) => key === 'solar'), false);
});

test('sequences are content: they import the template and nothing else, and load only with the scene', () => {
  const read = (file) => readFileSync(new URL('../src/experience/story/public/' + file, import.meta.url), 'utf8');
  for (const file of ['sequences/nem.js', 'sequences/jp.js']){
    const imports = [...read(file).matchAll(/^import .* from '([^']+)';$/gm)].map(m => m[1]);
    assert.deepEqual(imports, ['./contracted.js'], `${file} imports ${imports}`);
  }
  assert.doesNotMatch(read('sequences/contracted.js'), /^import /m);
  assert.doesNotMatch(read('scenario.js'), /^import /m, 'the scenario rules are pure');
  /* Fetched by the scene, on demand, and by nothing that loads earlier. */
  assert.match(read('scene.js'), /nem:\(\)=>import\('\.\/sequences\/nem\.js'\)/);
  for (const file of ['chapter.js', 'pack.js', 'overview.js', 'content.js']) assert.doesNotMatch(read(file), /sequences\//, `${file} must not import a sequence`);
  assert.match(read('chapter.js'), /scene\.loadSequences\(data\.marketId\)/);
});
