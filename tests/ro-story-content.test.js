/* ---------------------------------------------------------------------------
   The Romania story's words (ro-build-evidence.md §4-5, storyboard G-1).

   Three claims:

     1. SCRIPT PARITY. Every bilingual sentence, control, label and caption is
        the storyboard's own cell, after ‹bound: x› and {token} are normalised
        to the same placeholder. Token order is compared too, so a sentence
        that keeps its words while pointing at the wrong field still fails.

     2. COMPLETENESS. Thirteen shots, the six chapters in order, one marker per
        shot with its clause, and the story validates and is not stale against
        the live row.

     3. BINDING. The declared tokens are exactly the values the market row can
        fill, each with the owner the decision record gives it, and no figure
        is typed into the module.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story } from '../src/markets/ro/story.js';
import {
  storyValues, storySources, storyWithAvailableValues, cardRows, indexPath, datePair,
} from '../src/markets/ro/storyBindings.js';
import { validateStory, isStale, fillPair, CHAPTERS, MARKERS, tokensIn } from '../src/experience/story/contract.js';
import { opportunities, CALLS, returnPct, share, money, pct } from '../src/experience/model.js';
import { marginText } from '../src/experience/decision.js';
import { operatingPrice } from '../src/experience/projectFacts.js';

const row = opportunities('infraFund').find(r => r.id === 'ro');
const ui = { CALLS, returnPct, marginText, playTitle: undefined };
const sources = storySources();
const composed = { ...story, sources };
const values = storyValues(row, { CALLS, returnPct, marginText });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const md = readFileSync(new URL('../docs/immersive-experience-plan/romania-storyboard.md', import.meta.url), 'utf8');

/* The script's phrase for a token, so a swapped binding is caught even when
   the sentence keeps its words. */
const PHRASE = {
  call: 'call', playName: 'play title', cardFigures: 'card figures', nextAction: 'next action',
  playEvidence: 'play evidence', securedShare: 'secured share', playDuration: 'play duration',
  bestMerchantDuration: 'best merchant duration', longerMerchantDuration: 'longer merchant duration',
  merchantValueBest: 'merchant value at best', merchantValueLonger: 'merchant value longer',
  valueIndexPath: 'value index path', curveFirstYear: 'curve first year', optimiserFee: 'optimiser fee',
  grantNote: 'grant note', nextTrigger: 'next trigger', fleetCount: 'fleet count',
  fleetCountDate: 'fleet count date', fleetObservations: 'fleet observations',
  fleetYearEndAdditions: 'fleet year-end additions', plan2030Level: 'plan 2030 level',
  bgFleetEnd2025: 'Bulgaria fleet end-2025', auctionThreshold: 'auction threshold',
  grantBuildDeadline: 'grant build deadline', grantOperationYears: 'grant operation years',
  researchCheckDate: 'research check date', sourceCheckedDate: 'source checked date',
};

const normal = (text) => text
  .replaceAll('**', '')
  .replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g, '<value>')
  .trim();
const frame = (text) => text
  .replace('Existing play card: ', '').replace('Beneath it: ', '')
  .replace('现有方案卡：', '').replace('卡片下方：', '')
  .replaceAll('"', '').replaceAll('“', '').replaceAll('”', '');

/** The ordered tokens a string uses, as script phrases. */
const phraseOrder = (text) => [...text.matchAll(/‹bound: ([^›]+)›/g)].map(m => m[1]);
const tokenOrder = (text) => tokensIn(text).map(t => PHRASE[t] || `?${t}`);

/** One shot's page-text table from the storyboard. */
function cellsOf(id){
  const start = md.indexOf('### ' + id + ' — ');
  const next = md.indexOf('\n### ro-', start + 1);
  const block = md.slice(start, next < 0 ? md.indexOf('## 9.') : next);
  const page = block.slice(block.indexOf('| Page text |'));
  const rows = {};
  for (const line of page.split('\n')){
    if (!line.startsWith('| ') || line.startsWith('| ---') || line.startsWith('| Page text')) continue;
    const cells = line.slice(2, -2).split(' | ');
    if (cells.length === 3) rows[cells[0]] = [cells[1], cells[2]];
  }
  return rows;
}
const splitCell = (pair) => pair[0].split(' · ').map((en, i) => [en, pair[1].split(' · ')[i]]);

/* ---- 1. script parity ---------------------------------------------------- */

test('the module holds the storyboard sentence for every shot', () => {
  for (const shot of shots){
    const cells = cellsOf(shot.id);
    for (const [field, key] of [['question', 'Question'], ['copy', 'Copy']]){
      const expected = (shot.id === 'ro-00' ? cells[key].map(frame) : cells[key]).map(normal);
      assert.deepEqual(shot[field].map(normal), expected, `${shot.id} ${field}`);
      assert.deepEqual(tokenOrder(shot[field][0]), phraseOrder((shot.id === 'ro-00' ? frame(cells[key][0]) : cells[key][0])), `${shot.id} ${field} tokens`);
    }
    if (shot.meaning === null) assert.equal(cells.Meaning, undefined, `${shot.id} has no meaning cell`);
    else {
      assert.deepEqual(shot.meaning.map(normal), cells.Meaning.map(normal), `${shot.id} meaning`);
      assert.deepEqual(tokenOrder(shot.meaning[0]), phraseOrder(cells.Meaning[0]), `${shot.id} meaning tokens`);
    }
    const controls = splitCell(cells.Controls);
    assert.deepEqual(shot.controls.map(p => p.map(normal)), controls.map(p => p.map(normal)), `${shot.id} controls`);
    assert.equal(shot.controls.length, controls.length, `${shot.id} control count`);
    if (cells.Labels){
      const labels = splitCell(cells.Labels);
      const mine = Object.values(shot.labels);
      assert.equal(mine.length, labels.length, `${shot.id} label count`);
      mine.forEach((pair, i) => {
        /* ro-11's third label is the one sanctioned departure: the decision
           record suppresses a numeric count of announcements while the
           source-use gate is open, and no token can hold a null count. */
        if (shot.id === 'ro-11' && i === 2) return;
        assert.deepEqual(pair.map(normal), labels[i].map(normal), `${shot.id} label ${i}`);
        assert.deepEqual(tokenOrder(pair[0]), phraseOrder(labels[i][0]), `${shot.id} label ${i} tokens`);
      });
    }
    if (cells.Caption){
      assert.deepEqual(shot.caption.map(normal), cells.Caption.map(normal), `${shot.id} caption`);
      assert.deepEqual(tokenOrder(shot.caption[0]), phraseOrder(cells.Caption[0]), `${shot.id} caption tokens`);
    }
  }
});

test('the one departure from the storyboard is the floor label, and it counts nothing', () => {
  const label = story.chapters.find(c => c.id === 'payment').shots[1].labels.l03;
  assert.deepEqual(label, ['Announced in this market: a floor, level not disclosed', '本市场已公布：保底，金额未披露']);
  for (const text of label) assert.equal(/\d|[一二两三]项|one|a single/i.test(text.replace('a floor', '')), false, text);
});

/* ---- 2. completeness ----------------------------------------------------- */

test('thirteen shots, six chapters, one marker each and a valid story', () => {
  assert.deepEqual(validateStory(composed), { ok: true, complete: true, problems: [] });
  assert.deepEqual(story.chapters.map(c => c.id), CHAPTERS);
  assert.deepEqual(shots.map(s => s.id), Array.from({ length: 13 }, (_, i) => 'ro-' + String(i).padStart(2, '0')));
  assert.equal(story.opening.id, 'ro-00');
  assert.equal(story.playRef, row.play.id);
  assert.equal(isStale(composed, row), false);
  assert.equal(story.reviewedAgainst.on, '2026-11-02');
  assert.equal(story.reviewedAgainst.hours, row.play.hours);
  assert.equal(story.reviewedAgainst.call, row.call);
  for (const shot of shots){
    assert.ok(MARKERS[shot.marker.level] || shot.marker.level === 'play', `${shot.id} marker`);
    if (shot.marker.level !== 'play') {
      assert.equal(shot.marker.change.length, 2);
      assert.ok(shot.marker.change.every(text => text.trim().length > 0));
    }
  }
});

test('the marker levels are the ones G-1 signed off', () => {
  const levels = Object.fromEntries(shots.map(s => [s.id, s.marker.level]));
  assert.deepEqual(levels, {
    'ro-00': 'play', 'ro-01': 'fair', 'ro-02': 'strong', 'ro-03': 'fair', 'ro-04': 'fair',
    'ro-05': 'thin', 'ro-06': 'fair', 'ro-07': 'thin', 'ro-08': 'fair', 'ro-09': 'fair',
    'ro-10': 'fair', 'ro-11': 'fair', 'ro-12': 'fair',
  });
});

test('a filled story reads in both languages with no gap or stray token', () => {
  for (const shot of shots){
    for (const field of ['question', 'copy', 'meaning']){
      if (!shot[field]) continue;
      for (const text of fillPair(shot[field], values)) assert.ok(!/undefined|NaN|\{[a-zA-Z]|\u2014\u2014/.test(text), `${shot.id} ${field}: ${text}`);
    }
    for (const pair of shot.controls) for (const text of fillPair(pair, values)) assert.ok(!/undefined|NaN/.test(text), `${shot.id} control: ${text}`);
    for (const pair of Object.values(shot.labels || {})) for (const text of fillPair(pair, values)) assert.ok(!/undefined|NaN/.test(text), `${shot.id} label: ${text}`);
  }
});

/* ---- 3. binding --------------------------------------------------------- */

test('every declared token is a value the row fills, and nothing else is declared', () => {
  assert.deepEqual(Object.keys(values).sort(), story.tokens.slice().sort(), 'declared tokens and resolved values are the same set');
  for (const token of story.tokens) assert.ok(PHRASE[token], `${token} has an entry in the binding table`);
});

test('a withheld record prints as an em dash and never as zero', () => {
  const gated = ['fleetCount', 'fleetCountDate', 'fleetYearEndAdditions', 'plan2030Level', 'bgFleetEnd2025', 'grantBuildDeadline', 'grantOperationYears'];
  for (const token of gated) assert.equal(values[token], null, `${token} is withheld`);
  const shot = shots.find(s => s.id === 'ro-06');
  for (const text of fillPair(shot.copy, values)) assert.ok(!/0 MW|0%|null/.test(text), 'no zero stands in for the count');
});

test('cardFigures is the enumerated panel, not a pasted summary', () => {
  const rows = cardRows(row, { CALLS, returnPct, marginText });
  assert.deepEqual(rows.map(r => r.key), ['baseIrr', 'bearIrr', 'peakEquity', 'ceiling', 'operating']);
  const expected = rows.map(r => r.value[0] + (r.note ? ` (${r.note[0]})` : '')).join(' · ');
  assert.equal(values.cardFigures[0], expected);
  assert.ok(values.cardFigures[0].includes(pct(row.investment.holdIRR)));
  assert.ok(values.cardFigures[0].includes(money(row.investment.peakEquityPerMW * row.investment.powerMW, row.investment.currency)));
  assert.ok(values.cardFigures[0].includes('No supported price'), 'the null ceiling keeps its own wording');
});

test('the mirrored formatters agree with the market card on this row', () => {
  assert.equal(values.securedShare, share(row.investment.secured));
  assert.equal(values.securedShare, '0%');
  assert.ok(operatingPrice(row.investment)[1].includes(money(row.investment.operatingPurchase.maxPricePerMW, row.investment.currency)));
  assert.ok(values.cardFigures[1].includes(operatingPrice(row.investment)[1]));
  assert.equal(values.playDuration, String(row.play.hours));
  assert.equal(values.curveFirstYear, String(row.market.comparison.economics.merchantCurveBasis.yearOne));
  assert.equal(values.optimiserFee, row.market.comparison.economics.feePct + '%');
  assert.deepEqual(values.grantNote, row.market.comparison.economics.grantNote);
  assert.equal(values.auctionThreshold, '5 MW');
});

test('the index path is the model relative path: basis 100, no 2026 point, a flat tail', () => {
  const path = values.valueIndexPath;
  assert.deepEqual(path.map(p => p.year), [2025, 2026, 2027, 2028, 2029, 2030]);
  assert.equal(path[0].value, 100);
  assert.equal(path[0].kind, 'basis');
  assert.equal(path[1].value, null, 'no inferred intermediate point');
  assert.deepEqual(path.slice(2).map(p => +p.value.toFixed(4)), [82.7, 78.9785, 77.2418, 77.2418]);
  const c = row.market.comparison;
  const moved = indexPath({ ...c, merchantEvidence: { ...c.merchantEvidence, restateFactor: 0.5 } });
  assert.equal(+moved[2].value.toFixed(4), 50, 'the path follows the public factor');
  assert.equal(indexPath({}), null);
});

test('a missing financial binding falls back to the figure-free sentence', () => {
  assert.deepEqual(storyWithAvailableValues(composed, values).opening, composed.opening);
  /* The opening carries {cardFigures}, so a missing card replaces its prose
     with the signed-off sentence rather than printing a half-filled line. */
  const missing = storyWithAvailableValues(composed, { ...values, cardFigures: null });
  assert.deepEqual(missing.opening.copy, story.text['Missing financial binding']);
  assert.ok(missing.missingBindings.includes('cardFigures'));
  assert.equal(missing.chapters.every(c => c.shots.length > 0), true, 'the chapters survive the fallback');
});

test('every claim resolves to an openable source, and every source names a locator', () => {
  for (const [id, claim] of Object.entries(story.claims)){
    assert.ok(claim.sources.length, `${id} cites a source`);
    for (const sourceId of claim.sources){
      const source = composed.sources[sourceId];
      assert.ok(source, `${id} -> ${sourceId}`);
      assert.ok(/^(https?:|\/)/.test(source.url), `${sourceId} is openable: ${source.url}`);
      assert.ok(source.title && source.locator && source.checkedOn, `${sourceId} is described`);
    }
  }
});

test('content carries no rendering code and no figure outside a token', () => {
  const source = readFileSync(new URL('../src/markets/ro/story.js', import.meta.url), 'utf8');
  assert.equal(/^\s*import\s/m.test(source), false, 'the content module imports nothing');
  assert.equal(/document\.|createElement/.test(source), false, 'and draws nothing');
  /* Dates are the allowed exception and the contract already refuses any other
     digit in copy. What it cannot see is a four-digit amount typed as prose, so
     that is what this checks. */
  for (const shot of shots){
    for (const text of shot.copy) assert.equal(/\d{4,}/.test(text.replace(/\b(19|20)\d{2}\b/g, '')), false, `${shot.id}: ${text}`);
  }
  assert.ok(story.text['Missing financial binding']);
});

test('dated helpers keep day, month and year precision apart', () => {
  assert.deepEqual(datePair('2026-11-02'), ['2 November 2026', '2026年11月2日']);
  assert.deepEqual(datePair('2014-11'), ['early November 2014', '2014年11月']);
  assert.deepEqual(datePair('2030'), ['2030', '2030年']);
  assert.equal(datePair(null), null);
});

test('every timeline node keeps the four approved fields in both languages', () => {
  const block = (id) => {
    const start = md.indexOf('### ' + id + ' — ');
    const next = md.indexOf('\n### ro-', start + 1);
    return md.slice(start, next < 0 ? md.indexOf('## 9.') : next);
  };
  const nodesOf = (id) => {
    const text = block(id).slice(block(id).indexOf('Timeline nodes (page text):'));
    const rows = [];
    let current = null;
    for (const line of text.split('\n')){
      if (!line.startsWith('|') || line.startsWith('| ---') || line.startsWith('| Node')) continue;
      const cells = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
      if (cells.length < 4) continue;
      if (cells[0]) current = cells[0];
      rows.push([cells[1], cells[2], cells[3]]);
    }
    const order = [...new Set(rows.map(() => null))];
    void order;
    const field = { Constraint: 'constraint', Choice: 'choice', 'What remains': 'remains', 'Effect today': 'effect' };
    const grouped = [];
    for (const [name, en, zh] of rows){
      const key = field[name];
      assert.ok(key, `unknown field ${name}`);
      const at = grouped.findIndex(node => !node[key]);
      const node = at < 0 ? (grouped.push({}), grouped[grouped.length - 1]) : grouped[at];
      node[key] = [en, zh];
    }
    return grouped;
  };
  for (const id of ['ro-02', 'ro-03']){
    const shot = shots.find(s => s.id === id);
    const expected = nodesOf(id);
    assert.equal(shot.extra.historyNodes.length, expected.length, `${id} node count`);
    shot.extra.historyNodes.forEach((node, i) => {
      for (const key of ['constraint', 'choice', 'remains', 'effect']){
        assert.deepEqual(node[key].map(normal), expected[i][key].map(normal), `${id} node ${i} ${key}`);
        assert.deepEqual(tokenOrder(node[key][0]), phraseOrder(expected[i][key][0]), `${id} node ${i} ${key} tokens`);
      }
    });
  }
});
