/* ---------------------------------------------------------------------------
   INVESTABILITY AND ARCHETYPES.

   Both modules are methodology written by hand, and nothing renders them yet,
   so a broken table produces no wrong pixel anywhere. These tests pin the SHAPE
   — every dimension anchored, every archetype complete, the knock-out decisive
   — and deliberately pin almost none of the VALUES, which are drafts awaiting
   the analyst's edit. A test that froze a guessed weight would be defending the
   guess.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PILLARS, PILLAR_LABEL, PILLAR_QUESTION, GRADES, GRADED_BY,
  DIMENSIONS, DIMENSION_IDS, GRADED_DIMENSIONS, ANCHORED_DIMENSIONS, dimension, dimensionsIn, anchorText,
  TREND, TREND_LABEL, BASIS, BASIS_LABEL,
  VERDICT, VERDICT_IDS, VERDICT_LABEL, VERDICT_MEANING, ROUTE, ROUTE_LABEL,
  ARCHETYPE_IDS, MAX_BECAUSE, validateGrade, validateVerdict,
} from '../src/governance/investability.js';
import {
  ARCHETYPES, KNOCK_OUT, NOT_ACCESSIBLE, METRIC, SCORE_BANDS, DISAGREEMENT, DISAGREEMENT_LABEL,
  archetype, utility, pillarScore, fit, knockOuts, limitCheck, ceiling,
  bandOf, checkVerdict, assess, validateArchetype,
} from '../src/governance/archetypes.js';

const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(s => typeof s === 'string' && s.trim().length > 0);
const hasChinese = (s) => /[一-鿿]/.test(s);
const bilingual = (v) => isPair(v) && !hasChinese(v[0]) && hasChinese(v[1]);

const allGrades = (grade) => Object.fromEntries(DIMENSION_IDS.map(id => [id, grade]));

/* A grade set this archetype reads with no knock-out anywhere, found from its
   own tables so the tests keep working when the analyst rewrites them. */
const cleanGrades = (a) => Object.fromEntries(DIMENSION_IDS.map(id => {
  const grade = [5, 4, 3, 2, 1].find(g => a.reads[id][g] !== KNOCK_OUT);
  return [id, grade];
}));

/* Grades whose fit lands as close as these tables allow to a target score. */
const gradesScoring = (a, target) => {
  let best = null;
  for (const g of [1, 2, 3, 4, 5]){
    const grades = Object.fromEntries(DIMENSION_IDS.map(id => [id, a.reads[id][g] === KNOCK_OUT ? cleanGrades(a)[id] : g]));
    const score = fit(a, grades);
    if (!best || Math.abs(score - target) < Math.abs(best.score - target)) best = { grades, score };
  }
  return best;
};

const goodGrade = () => ({
  dimension: 'capitalAtRisk', grade: 2,
  metric: { perMW: 80600, perProject: 16100000, shareOfCost: 0.037, currency: 'USD' },
  trend: 'stable', basis: 'official', evidence: ['a-source-id'],
  reason: ['Security is posted before capacity is certain.', '在容量尚未确定之前就须提交保证金。'],
  asOf: '2026-10-10', author: 'analyst', lockedUntil: null,
});

const goodVerdict = () => ({
  archetype: 'developer', call: 'not-accessible', route: 'greenfield', where: null,
  because: [{ dimension: 'capitalAtRisk', text: ['Security before consent exceeds its limit.', '取得许可前的保证金超出其上限。'] }],
  despite: ['The asset carries the most secured revenue in the set.', '该资产的已锁定收入在各市场中最高。'],
  changesIf: ['a-trigger-id'], reviewBy: '2027-01-31',
  author: 'analyst', asOf: '2026-10-10', lockedUntil: null,
});

/* ---- the vocabulary ------------------------------------------------------- */

test('four pillars, fourteen dimensions, twelve of them anchored by hand', () => {
  assert.deepEqual(PILLARS, ['return', 'entry', 'durability', 'capital']);
  for (const p of PILLARS){
    assert.ok(bilingual(PILLAR_LABEL[p]), `${p}: label`);
    assert.ok(bilingual(PILLAR_QUESTION[p]), `${p}: question`);
  }
  assert.equal(GRADED_DIMENSIONS.length, 12, 'the plan grades twelve dimensions against anchors');
  assert.equal(DIMENSIONS.length, 14);
  assert.equal(new Set(DIMENSION_IDS).size, DIMENSION_IDS.length, 'a dimension id repeats');

  /* The plan's own split: six entry, three durability, three capital, and two
     Return dimensions. Asset return alone is ranked; revenue certainty is read
     against absolute anchors, so it can carry a knock-out. */
  assert.deepEqual(PILLARS.map(p => dimensionsIn(p).length), [2, 6, 3, 3]);
  assert.deepEqual(DIMENSIONS.filter(d => d.gradedBy === GRADED_BY.RANK).map(d => d.id), ['assetReturn']);
  assert.equal(ANCHORED_DIMENSIONS.length, 13);
  assert.ok(GRADED_DIMENSIONS.every(d => d.pillar !== 'return'));
  assert.deepEqual(GRADED_DIMENSIONS.map(d => d.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('every dimension has a label, a question and a measure in both languages', () => {
  for (const d of DIMENSIONS){
    assert.ok(PILLARS.includes(d.pillar), `${d.id}: unknown pillar`);
    for (const key of ['label', 'question', 'measure', 'open']){
      assert.ok(bilingual(d[key]), `${d.id}: ${key} must be an [en, zh] pair with Chinese in the second slot`);
    }
    assert.equal(dimension(d.id), d);
  }
  assert.equal(dimension('nope'), null);
});

test('every dimension has five anchors in both languages', () => {
  assert.deepEqual(GRADES, [5, 4, 3, 2, 1]);
  for (const d of DIMENSIONS){
    assert.deepEqual(Object.keys(d.anchors).map(Number).sort(), [1, 2, 3, 4, 5], `${d.id}: anchors must be exactly grades 1 to 5`);
    for (const grade of GRADES){
      const anchor = d.anchors[grade];
      assert.ok(bilingual(anchor), `${d.id}/${grade}: anchor must be an [en, zh] pair`);
      assert.ok(anchor[0].length >= 12, `${d.id}/${grade}: anchor is too short to be checkable`);
      assert.equal(anchorText(d.id, grade), anchor);
    }
  }
  /* Five DIFFERENT lines. Two grades sharing an anchor cannot be told apart. */
  for (const d of DIMENSIONS){
    assert.equal(new Set(GRADES.map(g => d.anchors[g][0])).size, 5, `${d.id}: two grades share an anchor`);
    assert.equal(new Set(GRADES.map(g => d.anchors[g][1])).size, 5, `${d.id}: two grades share a Chinese anchor`);
  }
  assert.equal(anchorText('capitalAtRisk', 6), null);
});

test('the two anchor sets the plan wrote are reused verbatim', () => {
  assert.equal(anchorText('capitalAtRisk', 5)[0], 'Under 0.5% of project cost, and nothing posted as security');
  assert.equal(anchorText('capitalAtRisk', 1)[0], 'Over 6%, or security forfeitable on events the sponsor does not control');
  assert.equal(anchorText('approvalTransparency', 3)[0],
    'Process published; timeframes and queue not; outcomes depend on bilateral negotiation');
  assert.equal(anchorText('approvalTransparency', 1)[0], 'No published process, or a moratorium with no stated end');
});

test('six verdicts, each with a label and a meaning in both languages', () => {
  assert.deepEqual(VERDICT_IDS, ['enter-now', 'build-position', 'opportunistic', 'wait', 'avoid', 'not-accessible']);
  for (const id of VERDICT_IDS){
    assert.ok(bilingual(VERDICT_LABEL[id]), `${id}: label`);
    assert.ok(bilingual(VERDICT_MEANING[id]), `${id}: meaning`);
  }
  assert.ok(!VERDICT_IDS.includes('selective'), '"Selective" is retired');
  /* The two must stay distinguishable: one is about the investor, one about the market. */
  assert.notEqual(VERDICT_LABEL[VERDICT.NOT_ACCESSIBLE][1], VERDICT_LABEL[VERDICT.AVOID][1]);

  for (const r of ROUTE) assert.ok(bilingual(ROUTE_LABEL[r]), `${r}: route label`);
  for (const t of TREND) assert.ok(bilingual(TREND_LABEL[t]), `${t}: trend label`);
  for (const b of Object.values(BASIS)) assert.ok(bilingual(BASIS_LABEL[b]), `${b}: basis label`);
  for (const k of Object.values(DISAGREEMENT)) assert.ok(bilingual(DISAGREEMENT_LABEL[k]), `${k}: disagreement label`);
});

/* ---- the validators ------------------------------------------------------- */

test('a well-formed grade validates, and so does one with no metric', () => {
  assert.deepEqual(validateGrade(goodGrade()), []);
  const { metric, ...bare } = goodGrade();
  assert.deepEqual(validateGrade(bare), []);
});

test('a grade outside 1–5 is rejected', () => {
  for (const grade of [0, 6, -1, 2.5, '3', null, undefined, NaN]){
    assert.ok(validateGrade({ ...goodGrade(), grade }).some(p => /grade must be/.test(p)), `grade ${String(grade)} was accepted`);
  }
  for (const grade of [1, 2, 3, 4, 5]) assert.deepEqual(validateGrade({ ...goodGrade(), grade }), []);
});

test('a grade names its dimension, trend, basis, sources and dates', () => {
  const bad = (patch, pattern) => {
    const problems = validateGrade({ ...goodGrade(), ...patch });
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern} from ${JSON.stringify(patch)}, got ${JSON.stringify(problems)}`);
  };
  bad({ dimension: 'vibes' }, /unknown dimension/);
  bad({ trend: 'up' }, /trend must be/);
  bad({ trend: 'deteriorating' }, /trendCause/);
  bad({ basis: 'hearsay' }, /basis must be/);
  bad({ evidence: [] }, /no evidence/);
  bad({ evidence: 'a-source-id' }, /evidence must be/);
  bad({ reason: ['English only'] }, /reason must be/);
  bad({ reason: 'English only' }, /reason must be/);
  bad({ asOf: '10 Oct 2026' }, /asOf/);
  bad({ asOf: '2026-02-30' }, /asOf/);
  bad({ author: 'intern' }, /author/);
  bad({ lockedUntil: 'forever' }, /lockedUntil/);
  bad({ lockedUntil: undefined }, /lockedUntil/);
  bad({ metric: { perMW: '80600' } }, /metric\.perMW/);
  bad({ metric: { perMW: 1, currency: 'dollars' } }, /currency/);
  assert.deepEqual(validateGrade(null), ['grade record is missing']);

  assert.deepEqual(validateGrade({ ...goodGrade(), trend: 'deteriorating', trendCause: ['A rule changed.', '规则发生变化。'] }), []);
  assert.deepEqual(validateGrade({ ...goodGrade(), lockedUntil: '2027-06-30' }), []);
});

test('a practitioner grade may stand without a public reason or a source, and no other basis may', () => {
  const { reason, ...unreasoned } = goodGrade();
  assert.deepEqual(validateGrade({ ...unreasoned, basis: BASIS.PRACTITIONER, evidence: [] }), []);
  for (const basis of [BASIS.OFFICIAL, BASIS.THIRD_PARTY, BASIS.DERIVED]){
    assert.ok(validateGrade({ ...unreasoned, basis }).some(p => /reason/.test(p)), `${basis}: accepted with no reason`);
    assert.ok(validateGrade({ ...goodGrade(), basis, evidence: [] }).some(p => /no evidence/.test(p)), `${basis}: accepted with no source`);
  }
});

test('a well-formed verdict validates', () => {
  assert.deepEqual(validateVerdict(goodVerdict()), []);
  assert.deepEqual(validateVerdict({ ...goodVerdict(), where: ['The north', '北部'] }), []);
});

test('a verdict with no despite is rejected', () => {
  const { despite, ...assertion } = goodVerdict();
  assert.ok(validateVerdict(assertion).some(p => /despite is required/.test(p)));
  for (const empty of [null, '', [], ['', ''], ['Only English'], ['English', '   '], 'a plain string']){
    assert.ok(validateVerdict({ ...goodVerdict(), despite: empty }).some(p => /despite is required/.test(p)),
      `despite ${JSON.stringify(empty)} was accepted`);
  }
});

test('a verdict argues from at most three dimensions, and at least one', () => {
  const reason = (dimensionId) => ({ dimension: dimensionId, text: ['Because.', '原因如此。'] });
  assert.equal(MAX_BECAUSE, 3);
  assert.deepEqual(validateVerdict({ ...goodVerdict(), because: ['capitalAtRisk', 'gridScarcity', 'timeToRevenue'].map(reason) }), []);
  assert.ok(validateVerdict({ ...goodVerdict(), because: ['capitalAtRisk', 'gridScarcity', 'timeToRevenue', 'saturation'].map(reason) })
    .some(p => /at most 3/.test(p)));
  assert.ok(validateVerdict({ ...goodVerdict(), because: [] }).some(p => /at least one/.test(p)));
  assert.ok(validateVerdict({ ...goodVerdict(), because: [reason('vibes')] }).some(p => /unknown dimension/.test(p)));
  assert.ok(validateVerdict({ ...goodVerdict(), because: [{ dimension: 'saturation', text: 'English only' }] }).some(p => /text must be/.test(p)));
});

test('a verdict names a known archetype, call and route, and a wait says what it waits for', () => {
  const bad = (patch, pattern) => {
    const problems = validateVerdict({ ...goodVerdict(), ...patch });
    assert.ok(problems.some(p => pattern.test(p)), `expected ${pattern} from ${JSON.stringify(patch)}, got ${JSON.stringify(problems)}`);
  };
  bad({ archetype: 'tourist' }, /unknown archetype/);
  bad({ call: 'selective' }, /call must be/);
  bad({ route: 'by-accident' }, /route must be/);
  bad({ where: 'the north' }, /where must be/);
  bad({ changesIf: 'a-trigger-id' }, /changesIf/);
  bad({ reviewBy: 'next year' }, /reviewBy/);
  bad({ author: 'nobody' }, /author/);
  bad({ call: 'wait', changesIf: [] }, /names the trigger/);
  bad({ call: 'wait', reviewBy: null }, /review date/);
  assert.deepEqual(validateVerdict({ ...goodVerdict(), call: 'wait' }), []);
  assert.deepEqual(validateVerdict({ ...goodVerdict(), call: 'avoid', changesIf: [], reviewBy: null }), []);
  assert.deepEqual(validateVerdict(undefined), ['verdict record is missing']);
});

/* ---- the archetype tables ------------------------------------------------- */

test('four archetypes, each one valid', () => {
  assert.deepEqual(Object.keys(ARCHETYPES), ARCHETYPE_IDS);
  assert.deepEqual(ARCHETYPE_IDS, ['strategic', 'infraFund', 'foreignFirstTimer', 'developer']);
  for (const id of ARCHETYPE_IDS){
    assert.equal(archetype(id).id, id);
    assert.deepEqual(validateArchetype(ARCHETYPES[id]), [], `${id}: tables are invalid`);
  }
  assert.equal(archetype('tourist'), null);
});

test('every archetype has a reads table and a weight for every dimension', () => {
  for (const a of Object.values(ARCHETYPES)){
    assert.deepEqual(Object.keys(a.reads).sort(), [...DIMENSION_IDS].sort(), `${a.id}: reads must cover exactly the dimensions`);
    assert.deepEqual(Object.keys(a.weight).sort(), [...DIMENSION_IDS].sort(), `${a.id}: weights must cover exactly the dimensions`);
    for (const id of DIMENSION_IDS){
      assert.ok(a.weight[id] > 0, `${a.id}/${id}: weight`);
      assert.deepEqual(Object.keys(a.reads[id]).map(Number), [1, 2, 3, 4, 5], `${a.id}/${id}: reads must map grades 1 to 5`);
      for (const grade of [1, 2, 3, 4, 5]){
        const u = a.reads[id][grade];
        assert.ok(u === KNOCK_OUT || (typeof u === 'number' && u >= 0 && u <= 100),
          `${a.id}/${id}/${grade}: reads as ${String(u)}, not 0–100 or KNOCK_OUT`);
      }
    }
  }
});

test('pillar weights sum to 1', () => {
  for (const a of Object.values(ARCHETYPES)){
    assert.deepEqual(Object.keys(a.pillarWeight).sort(), [...PILLARS].sort(), `${a.id}: a weight for every pillar and no other`);
    const sum = PILLARS.reduce((s, p) => s + a.pillarWeight[p], 0);
    assert.ok(Math.abs(sum - 1) < 1e-9, `${a.id}: pillar weights sum to ${sum}`);
  }
});

test('a rank-graded dimension never carries a knock-out', () => {
  /* The bottom fifth exists in every set of markets. A knock-out there would
     close a fixed share of them by construction, whatever they were like. */
  for (const a of Object.values(ARCHETYPES)){
    for (const d of DIMENSIONS.filter(x => x.gradedBy === GRADED_BY.RANK)){
      assert.ok(!Object.values(a.reads[d.id]).includes(KNOCK_OUT), `${a.id}/${d.id}: knock-out on a ranked dimension`);
    }
  }
  const broken = structuredClone(ARCHETYPES.developer);
  broken.reads.assetReturn[1] = KNOCK_OUT;
  assert.ok(validateArchetype(broken).some(p => /rank-graded/.test(p)));
});

test('the validator catches the quiet ways a hand-edited table breaks', () => {
  const broken = (edit) => { const a = structuredClone(ARCHETYPES.strategic); edit(a); return validateArchetype(a); };
  assert.ok(broken(a => { a.pillarWeight.return += 0.05; }).some(p => /pillar weights sum/.test(p)));
  assert.ok(broken(a => { delete a.reads.saturation; }).some(p => /saturation: no reads table/.test(p)));
  assert.ok(broken(a => { delete a.weight.saturation; }).some(p => /saturation: weight/.test(p)));
  assert.ok(broken(a => { a.reads.saturation[3] = 140; }).some(p => /grade 3 must read/.test(p)));
  assert.ok(broken(a => { a.reads.vibes = a.reads.saturation; }).some(p => /not a dimension/.test(p)));
  assert.ok(broken(a => { a.limits[0].metric = 'vibes'; }).some(p => /unknown metric/.test(p)));
  assert.ok(broken(a => { a.defaultRoute = 'by-accident'; }).some(p => /defaultRoute/.test(p)));
});

test('the reads rows the plan wrote are in the developer table as the plan has them', () => {
  assert.deepEqual({ ...ARCHETYPES.developer.reads.gridScarcity }, { 1: KNOCK_OUT, 2: 60, 3: 100, 4: 70, 5: 40 });
  assert.deepEqual({ ...ARCHETYPES.developer.reads.capitalAtRisk }, { 1: 5, 2: 20, 3: 60, 4: 90, 5: 100 });
});

test('the developer is shut out by the money, not by the share', () => {
  /* The worst grade on capital at risk scores badly and closes nothing; the
     dollar figure over the limit closes the market at any grade. */
  const dev = ARCHETYPES.developer;
  assert.ok(!Object.values(dev.reads.capitalAtRisk).includes(KNOCK_OUT));
  assert.equal(ceiling(dev, { ...cleanGrades(dev), capitalAtRisk: 1 }), null);
  const limit = dev.limits.find(l => l.metric === METRIC.PRE_FID_CAPITAL_USD);
  for (const grade of [1, 2, 3, 4, 5]){
    assert.equal(ceiling(dev, { ...cleanGrades(dev), capitalAtRisk: grade }, { [METRIC.PRE_FID_CAPITAL_USD]: limit.max * 2 }), NOT_ACCESSIBLE);
  }
});

test('a discretionary screening is a low score for the first-timer, and only a bar on foreign control closes the market', () => {
  const first = ARCHETYPES.foreignFirstTimer;
  assert.equal(first.reads.foreignEntry[1], KNOCK_OUT);
  assert.notEqual(first.reads.foreignEntry[2], KNOCK_OUT);
  assert.ok(first.reads.foreignEntry[2] < first.reads.foreignEntry[3]);
  assert.equal(ceiling(first, { ...cleanGrades(first), foreignEntry: 2 }), null);
});

test('a preference may be non-monotonic, and scarcity reads in opposite directions', () => {
  /* The design claim that justifies a table instead of a weight. If every
     archetype read every dimension the same way round, the tables would be an
     elaborate way of writing a sign. */
  const scarce = 3, abundant = 5;
  assert.ok(utility('developer', 'gridScarcity', { gridScarcity: scarce }) > utility('developer', 'gridScarcity', { gridScarcity: abundant }));
  assert.ok(utility('foreignFirstTimer', 'gridScarcity', { gridScarcity: scarce }) < utility('foreignFirstTimer', 'gridScarcity', { gridScarcity: abundant }));
});

/* ---- the arithmetic ------------------------------------------------------- */

test('utility is a lookup: a number, a knock-out, or null when ungraded', () => {
  assert.equal(utility('developer', 'gridScarcity', { gridScarcity: 3 }), 100);
  assert.equal(utility('developer', 'gridScarcity', { gridScarcity: 1 }), KNOCK_OUT);
  assert.equal(utility('developer', 'gridScarcity', {}), null);
  assert.equal(utility('developer', 'gridScarcity', { gridScarcity: 7 }), null);
  /* A whole grade record reads the same as a bare grade. */
  assert.equal(utility(ARCHETYPES.developer, 'capitalAtRisk', { capitalAtRisk: goodGrade() }), 20);
  assert.throws(() => utility('tourist', 'gridScarcity', {}), /unknown archetype/);
  assert.throws(() => utility('developer', 'vibes', {}), /no reads table/);
});

test('pillarScore is the weighted mean of utilities over the pillar', () => {
  for (const a of Object.values(ARCHETYPES)){
    const grades = cleanGrades(a);
    for (const p of PILLARS){
      const dims = dimensionsIn(p);
      const expected = dims.reduce((s, d) => s + a.weight[d.id] * a.reads[d.id][grades[d.id]], 0)
        / dims.reduce((s, d) => s + a.weight[d.id], 0);
      assert.ok(Math.abs(pillarScore(a, p, grades) - expected) < 1e-9, `${a.id}/${p}`);
      assert.ok(pillarScore(a, p, grades) >= 0 && pillarScore(a, p, grades) <= 100);
    }
  }
  /* Scaling every weight in a pillar changes nothing: they are relative. */
  const scaled = structuredClone(ARCHETYPES.infraFund);
  for (const d of dimensionsIn('capital')) scaled.weight[d.id] *= 7;
  assert.ok(Math.abs(pillarScore(scaled, 'capital', allGrades(3)) - pillarScore('infraFund', 'capital', allGrades(3))) < 1e-9);
});

test('fit is the pillar-weighted sum of pillar scores', () => {
  for (const a of Object.values(ARCHETYPES)){
    const grades = cleanGrades(a);
    const expected = PILLARS.reduce((s, p) => s + a.pillarWeight[p] * pillarScore(a, p, grades), 0);
    assert.ok(Math.abs(fit(a, grades) - expected) < 1e-9, a.id);
    assert.ok(fit(a, grades) >= 0 && fit(a, grades) <= 100);
  }
});

test('an ungraded dimension leaves its pillar and the fit unscored, not quietly rescaled', () => {
  const grades = cleanGrades(ARCHETYPES.strategic);
  delete grades.exitLiquidity;
  assert.equal(pillarScore('strategic', 'capital', grades), null);
  assert.equal(fit('strategic', grades), null);
  assert.notEqual(pillarScore('strategic', 'entry', grades), null, 'a gap in one pillar must not blank another');
  assert.equal(assess('strategic', grades).band, null);
});

/* ---- the knock-out -------------------------------------------------------- */

test('a knock-out yields the not-accessible ceiling whatever the other grades are', () => {
  let tried = 0;
  for (const a of Object.values(ARCHETYPES)){
    for (const id of DIMENSION_IDS){
      for (const grade of [1, 2, 3, 4, 5]){
        if (a.reads[id][grade] !== KNOCK_OUT) continue;
        tried++;
        /* Every other dimension at its best, at its worst-but-clean, and at each
           flat grade the archetype can live with. The answer may not move. */
        const others = [cleanGrades(a), ...[1, 2, 3, 4, 5].map(g => allGrades(g))];
        for (const base of others){
          const grades = { ...base, [id]: grade };
          assert.equal(ceiling(a, grades), NOT_ACCESSIBLE, `${a.id}: ${id}=${grade} did not knock out`);
          assert.ok(knockOuts(a, grades).includes(id));
        }
        /* And the score beside it can be high: that is exactly the case a
           weighted average would have waved through. */
        const best = { ...cleanGrades(a), [id]: grade };
        assert.equal(assess(a, best).ceiling, NOT_ACCESSIBLE);
        assert.equal(checkVerdict(VERDICT.ENTER_NOW, fit(a, best), ceiling(a, best)).disagrees, true);
      }
    }
  }
  assert.ok(tried >= 4, 'expected every archetype to carry at least one knock-out');
  for (const a of Object.values(ARCHETYPES)){
    assert.ok(DIMENSION_IDS.some(id => Object.values(a.reads[id]).includes(KNOCK_OUT)), `${a.id}: nothing shuts it out`);
    assert.equal(ceiling(a, cleanGrades(a)), null, `${a.id}: a clean market must carry no ceiling`);
  }
});

test('the fund is shut out where no secured route exists, not where the reference project is unsecured', () => {
  /* Grade 1 on revenue certainty describes the market; grade 2 describes a
     project that could still go and contract something. Only the first closes
     the door, or the fund would be knocked out of every merchant market. */
  const fund = ARCHETYPES.infraFund;
  assert.equal(fund.reads.revenueCertainty[1], KNOCK_OUT);
  assert.equal(ceiling(fund, { ...cleanGrades(fund), revenueCertainty: 1 }), NOT_ACCESSIBLE);
  assert.equal(ceiling(fund, { ...cleanGrades(fund), revenueCertainty: 2 }), null);
  assert.match(anchorText('revenueCertainty', 1)[0], /^No secured revenue route exists in the market/);
});

test('a knock-out does not need the other grades to be known', () => {
  assert.equal(ceiling('developer', { gridScarcity: 1 }), NOT_ACCESSIBLE);
  assert.equal(fit('developer', { gridScarcity: 1 }), null);
});

test('a limit is compared with the figure, not with the grade', () => {
  /* The case the plan turns on: a security that is a modest SHARE of a very
     large project grades acceptably and still costs more than the developer
     will post. Grade 2 on capital at risk is not a knock-out for a developer;
     the dollar figure is. */
  const dev = ARCHETYPES.developer;
  const grades = { ...cleanGrades(dev), capitalAtRisk: 2 };
  assert.equal(ceiling(dev, grades), null);

  const limit = dev.limits.find(l => l.metric === METRIC.SECURITY_BEFORE_CONSENT_USD);
  assert.ok(limit, 'the developer needs a limit on security posted before consent');
  assert.equal(ceiling(dev, grades, { [METRIC.SECURITY_BEFORE_CONSENT_USD]: limit.max }), null, 'at the limit is inside it');
  assert.equal(ceiling(dev, grades, { [METRIC.SECURITY_BEFORE_CONSENT_USD]: limit.max + 1 }), NOT_ACCESSIBLE);
  assert.deepEqual(limitCheck(dev, { [METRIC.SECURITY_BEFORE_CONSENT_USD]: limit.max + 1 }).breached, [limit.id]);

  const months = dev.limits.find(l => l.metric === METRIC.MONTHS_TO_RTB);
  assert.equal(ceiling(dev, grades, { [METRIC.MONTHS_TO_RTB]: months.max + 1 }), NOT_ACCESSIBLE);
});

test('a missing figure is reported as unchecked, never as a pass', () => {
  const { breached, unchecked } = limitCheck('developer', {});
  assert.deepEqual(breached, []);
  assert.deepEqual(unchecked, ARCHETYPES.developer.limits.map(l => l.id));
  assert.deepEqual(assess('developer', cleanGrades(ARCHETYPES.developer)).limitsUnchecked, unchecked);
});

test('a limit binds only on the routes it names', () => {
  /* Money risked before the investment decision is the originator's problem.
     A fund buying ready-to-build has not spent it, and one co-investing behind
     a larger sponsor is not writing the whole cheque either. */
  const fund = ARCHETYPES.infraFund;
  const grades = cleanGrades(fund);
  const preFid = fund.limits.find(l => l.metric === METRIC.PRE_FID_CAPITAL_USD);
  const cheque = fund.limits.find(l => l.metric === METRIC.PROJECT_COST_USD);
  const metrics = { [METRIC.PRE_FID_CAPITAL_USD]: preFid.max * 3, [METRIC.PROJECT_COST_USD]: cheque.max * 1.4 };

  assert.equal(ceiling(fund, grades, { [METRIC.PRE_FID_CAPITAL_USD]: preFid.max * 3 }, 'greenfield'), NOT_ACCESSIBLE);
  assert.equal(ceiling(fund, grades, { [METRIC.PRE_FID_CAPITAL_USD]: preFid.max * 3 }, 'ready-to-build'), null);
  assert.equal(ceiling(fund, grades, metrics, 'ready-to-build'), NOT_ACCESSIBLE, 'the cheque still binds on a whole project');
  assert.equal(ceiling(fund, grades, metrics, 'co-invest'), null);
  assert.equal(limitCheck(fund, metrics).route, fund.defaultRoute);
  assert.equal(assess(fund, grades, metrics, { call: 'opportunistic', route: 'co-invest' }).ceiling, null);
});

/* ---- the band check ------------------------------------------------------- */

test('score bands are the plan\'s: 75, 60, 45, 30', () => {
  assert.deepEqual(SCORE_BANDS.map(b => [b.call, b.from]), [
    ['avoid', 0], ['wait', 30], ['opportunistic', 45], ['build-position', 60], ['enter-now', 75],
  ]);
  const at = { 100: 'enter-now', 75: 'enter-now', 74.99: 'build-position', 60: 'build-position', 59.9: 'opportunistic',
               45: 'opportunistic', 44: 'wait', 30: 'wait', 29.99: 'avoid', 0: 'avoid' };
  for (const [score, call] of Object.entries(at)) assert.equal(bandOf(Number(score)), call, `score ${score}`);
  assert.equal(bandOf(null), null);
  assert.equal(bandOf(NaN), null);
});

test('the band check accepts a verdict one band from its score and flags one two bands away', () => {
  const score = 65;   // build position
  assert.equal(checkVerdict('build-position', score).disagrees, false);
  assert.equal(checkVerdict('build-position', score).distance, 0);

  for (const oneAway of ['enter-now', 'opportunistic']){
    const check = checkVerdict(oneAway, score);
    assert.equal(check.disagrees, false, `${oneAway} is one band from ${score} and was flagged`);
    assert.equal(check.distance, 1);
    assert.equal(check.expected, 'build-position');
  }

  const twoAway = checkVerdict('wait', score);
  assert.equal(twoAway.disagrees, true);
  assert.equal(twoAway.kind, DISAGREEMENT.BAND);
  assert.equal(twoAway.distance, 2);
  assert.equal(checkVerdict('avoid', score).distance, 3);
  assert.equal(checkVerdict('avoid', 80).distance, 4);

  /* Every pair, both directions. */
  const order = SCORE_BANDS.map(b => b.call);
  const mid = (i) => i + 1 < SCORE_BANDS.length ? (SCORE_BANDS[i].from + SCORE_BANDS[i + 1].from) / 2 : 90;
  order.forEach((call, i) => order.forEach((_, j) => {
    assert.equal(checkVerdict(call, mid(j)).disagrees, Math.abs(i - j) > 1, `${call} against a score of ${mid(j)}`);
  }));
});

test('the band check reports and never decides', () => {
  /* It hands back the author's call untouched. `expected` is what the score
     suggests, for the page to show beside it — not a value anything applies. */
  const check = checkVerdict('wait', 90);
  assert.equal(check.call, 'wait');
  assert.equal(check.expected, 'enter-now');
  assert.equal(check.disagrees, true);
});

test('a knock-out overrides any score in the band check', () => {
  for (const score of [0, 29, 50, 74, 90, 100, null]){
    assert.equal(checkVerdict('not-accessible', score, NOT_ACCESSIBLE).disagrees, false, `score ${score}`);
    for (const call of ['enter-now', 'build-position', 'opportunistic', 'wait', 'avoid']){
      const check = checkVerdict(call, score, NOT_ACCESSIBLE);
      assert.equal(check.disagrees, true, `${call} at ${score} passed over a knock-out`);
      assert.equal(check.kind, DISAGREEMENT.KNOCK_OUT_IGNORED);
      assert.equal(check.expected, NOT_ACCESSIBLE);
    }
  }
});

test('"not accessible" with no knock-out behind it is flagged too', () => {
  /* "Not accessible" and "Avoid" are different statements. If nothing knocks
     the investor out, the author either means Avoid or knows a barrier the
     grades do not yet record — and either way the page should ask. */
  const check = checkVerdict('not-accessible', 20, null);
  assert.equal(check.disagrees, true);
  assert.equal(check.kind, DISAGREEMENT.NO_KNOCK_OUT);
});

test('"enter now" with an unchecked limit is flagged, and no other call is', () => {
  /* Nobody has looked at the figure. That is fine for a Wait and not for a
     verdict that says the bar is cleared today. */
  const flagged = checkVerdict('enter-now', 80, null, ['security-before-consent']);
  assert.equal(flagged.disagrees, true);
  assert.equal(flagged.kind, DISAGREEMENT.UNCHECKED_LIMIT);
  assert.deepEqual(flagged.unchecked, ['security-before-consent']);
  assert.equal(checkVerdict('enter-now', 80, null, []).disagrees, false);
  assert.equal(checkVerdict('enter-now', null, null, ['cheque']).disagrees, true, 'holds with no score too');
  for (const call of ['build-position', 'opportunistic', 'wait', 'avoid']){
    assert.notEqual(checkVerdict(call, 65, null, ['cheque']).kind, DISAGREEMENT.UNCHECKED_LIMIT, call);
  }
  /* The stronger statements still win: a knock-out, then a band gap. */
  assert.equal(checkVerdict('enter-now', 80, NOT_ACCESSIBLE, ['cheque']).kind, DISAGREEMENT.KNOCK_OUT_IGNORED);
  assert.equal(checkVerdict('enter-now', 40, null, ['cheque']).kind, DISAGREEMENT.BAND);

  /* Through assess: the same verdict passes once the figures are supplied. */
  const dev = ARCHETYPES.developer;
  const grades = cleanGrades(dev);
  const verdict = { call: 'enter-now', route: 'greenfield' };
  assert.equal(assess(dev, grades, {}, verdict).check.kind, DISAGREEMENT.UNCHECKED_LIMIT);
  const figures = Object.fromEntries(dev.limits.map(l => [l.metric, l.max]));
  assert.equal(assess(dev, grades, figures, verdict).check.disagrees, false);
});

test('the score is not the headline when a ceiling applies', () => {
  const dev = ARCHETYPES.developer;
  const shut = assess(dev, { ...cleanGrades(dev), gridScarcity: 1 });
  assert.equal(shut.headline, 'ceiling');
  assert.ok(shut.fit > 0, 'the score is still returned, for what the rest of the market reads as');
  assert.equal(assess(dev, cleanGrades(dev)).headline, 'fit');
});

test('with no score and no knock-out the check says it could not check', () => {
  const check = checkVerdict('build-position', null);
  assert.equal(check.checked, false);
  assert.equal(check.disagrees, false);
  assert.equal(check.expected, null);
});

test('assess ties the pieces together for one archetype and one market', () => {
  for (const a of Object.values(ARCHETYPES)){
    const { grades, score } = gradesScoring(a, 65);
    const result = assess(a, grades, {}, { call: bandOf(score), route: a.defaultRoute });
    assert.equal(result.archetype, a.id);
    assert.equal(result.fit, score);
    assert.equal(result.band, bandOf(score));
    assert.equal(result.ceiling, null);
    assert.deepEqual(result.knockOuts, []);
    assert.equal(result.check.disagrees, false);
    assert.deepEqual(Object.keys(result.pillars), PILLARS);
    assert.equal(assess(a, grades).check, null, 'no verdict, nothing to check');
  }
});

test('neither module reaches for the DOM, a market or the ETL', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const file of ['investability.js', 'archetypes.js']){
    const source = await readFile(new URL(`../src/governance/${file}`, import.meta.url), 'utf8');
    const imports = [...source.matchAll(/^import[^;]*?from\s+'([^']+)'/gm)].map(m => m[1]);
    for (const from of imports){
      assert.ok(from === './investability.js', `${file} imports ${from} — governance vocabulary imports no market, DOM or ETL module`);
    }
    assert.ok(!/\b(document|window)\./.test(source), `${file} touches the DOM`);
    assert.match(source, /DRAFT, AWAITING THE ANALYST'S EDIT/, `${file}: the draft notice is gone — remove this assertion when the tables are signed off`);
    assert.match(source, /THESE VALUES ARE METHODOLOGY/, `${file}: must state that no automation may write it`);
  }
});
