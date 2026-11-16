/* ---------------------------------------------------------------------------
   THE ASSET-RETURN GRADE ON THE INVESTMENT MODEL.

   Signed off by the analyst on 16 November 2026
   (docs/return-model-alignment-plan-2026-11-15.md). The grade ranks the
   all-equity hold return of the case on each investor's card, among every
   market the model prices, and cuts the ranking into fifths.

   What these tests hold:
     · the rule's arithmetic, its tie handling and what it refuses to rank
     · the figure ranked IS the figure on the card, for every market and
       investor — the defect this replaced was a grade quoting one model
       beside a card showing another
     · the published ranking and its four boundaries, so a model change that
       moves a grade fails here and reaches the analyst
     · the analyst's own grade is never overridden, and a divergence between
       investors is reported, never resolved by picking one
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

import { fifthGrade, gradeByFifths } from '../src/comparison/returnGrades.js';
import { cardHoldReturn, headlineReturnGrades, commonGrade } from '../src/opportunities/returnGrades.js';
import { opportunitySummary } from '../src/opportunities/summary.js';
import { briefingFromDisk, readBriefingInputs } from '../src/briefing/disk.js';
import { homeProjection } from '../src/briefing/model.js';
import { assessMarket } from '../src/entry/assessment.js';
import { ARCHETYPE_IDS, ASSET_GRADE_BASIS, DIMENSIONS } from '../src/governance/investability.js';
import { ARCHETYPES } from '../src/governance/archetypes.js';
import { markets, byId } from '../src/markets/registry.js';
import { ledgerFor } from '../src/entry/ledgerRegistry.js';
import { FX } from '../src/comparison/assumptions.js';
import { returnKeyFor } from '../src/home/boardModel.js';

const NOW = new Date('2026-11-16T04:00:00Z');
const briefing = await briefingFromDisk({ now: NOW });
const { views } = await readBriefingInputs();
const summary = opportunitySummary(homeProjection(briefing), views);

test('the fifths rule: seventeen markets cut 3 / 3 / 4 / 3 / 4', () => {
  const grades = Array.from({ length: 17 }, (_, i) => fifthGrade(i + 1, 17));
  assert.deepEqual(grades, [5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
  assert.deepEqual(Array.from({ length: 15 }, (_, i) => fifthGrade(i + 1, 15)), [5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1]);
  assert.equal(fifthGrade(6, 17), 4, 'the worked example: 6 × 5 ÷ 17 = 1.76, up to 2, and 6 − 2 = 4');
});

test('ties keep their given order, and a market with no figure is not ranked last by default', () => {
  const g = gradeByFifths([['a', 0.10], ['b', 0.10], ['c', null], ['d', NaN], ['e', 0.20], ['f', undefined]]);
  assert.deepEqual(Object.keys(g).sort(), ['a', 'b', 'e']);
  assert.deepEqual([g.e.rank, g.a.rank, g.b.rank], [1, 2, 3]);
  assert.equal(g.a.count, 3);
  assert.deepEqual(gradeByFifths([]), {});
});

test('the figure ranked is the figure on the card, for every priced market and investor', () => {
  let compared = 0;
  for (const market of markets){
    const id = market.manifest.id;
    for (const investor of ARCHETYPE_IDS){
      const card = summary[investor].markets[id]?.holdIRR ?? null;
      const grade = briefing.returnGrades[id]?.[investor];
      if (card === null){ assert.equal(grade, undefined, `${id}/${investor}: no card return, so no grade`); continue; }
      assert.ok(grade, `${id}/${investor}: a priced card has a grade`);
      assert.ok(Math.abs(grade.value - card) < 5e-5, `${id}/${investor}: grade ranks ${grade.value}, the card shows ${card}`);
      compared++;
    }
  }
  assert.equal(compared, 17 * 4);
  assert.equal(briefing.returnGrades.sa, undefined, 'Saudi Arabia is not priced and is not ranked');
});

test('the published ranking: five fifths, the stored moves and the four boundaries', () => {
  const by = (investor) => Object.fromEntries(Object.entries(briefing.returnGrades).map(([id, g]) => [id, g[investor].grade]));
  const expected = { wa: 5, fi: 5, it: 5, pl: 4, ro: 4, de: 4, nem: 3, caiso: 3, gb: 3, ca_on: 3, ie: 2, jp_kyushu: 2, es: 2, jp_tokyo: 1, jp_hokkaido: 1, pjm: 1, ercot: 1 };
  /* All four investors' cards give the same grade today; the plays differ in
     Great Britain, Germany and Poland without crossing a boundary. */
  for (const investor of ARCHETYPE_IDS) assert.deepEqual(by(investor), expected, investor);
  for (const [id, g] of Object.entries(briefing.returnGrades)) assert.equal(commonGrade(g), expected[id], id);

  /* The boundaries sit after ranks 3, 6, 10 and 13. The markets either side
     are pinned so a near-tie that flips is a visible, reviewed change. */
  const order = Object.entries(briefing.returnGrades).sort((a, b) => a[1].infraFund.rank - b[1].infraFund.rank).map(([id]) => id);
  assert.deepEqual([3, 6, 10, 13].map(cut => [order[cut - 1], order[cut]]), [['it', 'pl'], ['de', 'nem'], ['ca_on', 'ie'], ['es', 'jp_tokyo']]);
  assert.equal(briefing.returnGrades.it.infraFund.count, 17, 'Ontario and Spain are ranked; they stay ungraded');
});

test('Poland is graded on two different cases: the grant cohort, and the capacity case for the new entrant', () => {
  const play = (investor) => briefing.lenses[investor].rows.find(r => r.market === 'pl').play;
  assert.equal(play('infraFund'), 'pl-grant-4h');
  assert.equal(play('foreignFirstTimer'), 'pl-cap-4h');
  assert.notEqual(briefing.returnGrades.pl.infraFund.value, briefing.returnGrades.pl.foreignFirstTimer.value);
  assert.equal(briefing.returnGrades.pl.infraFund.grade, briefing.returnGrades.pl.foreignFirstTimer.grade);
});

test('a common asset benchmark: each investor keeps its own return objective and tests', () => {
  assert.equal(ASSET_GRADE_BASIS, 'all-equity-hold');
  /* The grade's basis is one for all four; the investor's own objective is not rewritten. */
  assert.deepEqual(ARCHETYPE_IDS.map(a => ARCHETYPES[a].returnBasis), ['hold-irr', 'exit-irr', 'exit-irr', 'development-multiple']);
  assert.deepEqual(ARCHETYPE_IDS.map(returnKeyFor), ['hold', 'exit', 'exit', 'exit']);
  /* The sale, levered and target tests are still on the card. */
  const card = summary.infraFund.markets.it;
  for (const key of ['holdIRR', 'saleIRR', 'leveredIRR', 'irr']) assert.ok(Number.isFinite(card[key]), key);
  assert.ok(Number.isFinite(card.test.target) && Number.isFinite(card.test.leveredTarget));
  const measure = DIMENSIONS.find(d => d.id === 'assetReturn').measure;
  assert.match(measure[0], /all-equity hold return/);
  assert.match(measure[1], /全股权长持回报/);
});

test('a stored grade is replaced only where it is derived; the analyst\'s own grade and a held view stand', () => {
  const fi = views.find(v => v.marketId === 'fi');
  assert.equal(fi.grades.assetReturn.basis, 'practitioner');
  assert.equal(briefing.returnGrades.fi.infraFund.grade, 5, 'the model would grade Finland 5');
  const assessed = assessMarket(fi, byId('fi'), ledgerFor('fi'), FX, { on: '2026-11-16', returnGrades: briefing.returnGrades });
  for (const investor of ARCHETYPE_IDS) assert.equal(assessed.byArchetype[investor].grades.assetReturn.grade, 4, `${investor}: Finland keeps the practitioner 4`);

  /* A derived record takes the computed grade, per investor. */
  const de = views.find(v => v.marketId === 'de');
  const forced = { de: Object.fromEntries(ARCHETYPE_IDS.map((a, i) => [a, { grade: i === 0 ? 2 : 5 }])) };
  const split = assessMarket(de, byId('de'), ledgerFor('de'), FX, { on: '2026-11-16', returnGrades: forced });
  assert.deepEqual(ARCHETYPE_IDS.map(a => split.byArchetype[a].grades.assetReturn.grade), [2, 5, 5, 5]);
  assert.equal(commonGrade(forced.de), null, 'a divergence gives no common grade: no default investor is chosen');

  /* A live held layer still sits on top of the computed grade. */
  const held = { ...de, grades: { ...de.grades, assetReturn: { ...de.grades.assetReturn, held: { grade: 1, confidence: 'low', asOf: '2026-11-16', reviewBy: '2027-03-31', publicNote: null } } } };
  const withHeld = assessMarket(held, byId('de'), ledgerFor('de'), FX, { on: '2026-11-16', returnGrades: briefing.returnGrades });
  assert.equal(withHeld.byArchetype.infraFund.grades.assetReturn.grade, 1);
  assert.equal(withHeld.byArchetype.infraFund.grades.assetReturn.sourced, 4);

  /* With no computed grades the stored grade is scored as it stands. */
  const plain = assessMarket(de, byId('de'), ledgerFor('de'), FX, { on: '2026-11-16' });
  assert.equal(plain.byArchetype.infraFund.grades.assetReturn.grade, de.grades.assetReturn.grade);
});

test('the grader prices the standard design where no play is written, and nothing where the model is withheld', () => {
  assert.ok(Number.isFinite(cardHoldReturn(byId('es'), 'infraFund', null)));
  assert.equal(cardHoldReturn(byId('sa'), 'infraFund', null), null);
  const g = headlineReturnGrades(markets);
  assert.equal(g.sa, undefined);
  assert.equal(g.es.infraFund.basis, ASSET_GRADE_BASIS);
  assert.equal(g.es.infraFund.play, null);
});
