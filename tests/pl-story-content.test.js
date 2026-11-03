/* ---------------------------------------------------------------------------
   The Poland story's words (pl-build-evidence.md §4, storyboard G-1).

   Four claims:

     1. SCRIPT PARITY. Every bilingual sentence, control, label and caption is
        the storyboard's own cell, after ‹bound: x› and {token} are normalised
        to the same placeholder. Token order is compared too, so a sentence
        that keeps its words while pointing at the wrong field still fails.

     2. COMPLETENESS. Thirteen shots, the six chapters in order, one marker per
        shot, and a story that validates and is not stale against the live row.

     3. BINDING. The declared tokens are exactly the values the row can fill,
        each from the owner the decision record gives it, and no figure is
        typed into the module.

     4. THE FIVE DECLARED DEPARTURES, each named by the decision record, and
        the chart gate that decides which pl-05 sentence ships.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story } from '../src/markets/pl/story.js';
import {
  storyValues, storySources, storyMatches, storyWithGate, storyWithAvailableValues,
  cardFigures, storyRows, datePair,
} from '../src/markets/pl/storyBindings.js';
import { validateStory, isStale, fillPair, CHAPTERS, MARKERS, tokensIn } from '../src/experience/story/contract.js';
import { HOME_BRIEFING } from '../src/briefing/homeData.js';
import { fmtUSD } from '../src/utils/formatting.js';
import { opportunities, CALLS, returnPct, share, money, pct } from '../src/experience/model.js';
import { marginText } from '../src/experience/decision.js';
import { PL_CHART } from '../src/markets/pl/data/capacityAuctions.js';

const row = opportunities('infraFund').find(r => r.id === 'pl');
const ui = { CALLS, returnPct, marginText };
const sources = storySources();
const composed = { ...story, sources };
const values = storyValues(row, ui);
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const md = readFileSync(new URL('../docs/immersive-experience-plan/poland-storyboard.md', import.meta.url), 'utf8');

/* The script's phrase for a token, so a swapped binding is caught even when
   the sentence keeps its words. */
const PHRASE = {
  call: 'call', playName: 'play name', cardFigures: 'card figures', nextAction: 'next action',
  playEvidence: 'play evidence', marketCall: 'market call', marketPlayName: 'market play name',
  marketNextAction: 'market next action', marketEvidence: 'market evidence',
  watchedEvent: 'watched event', ungrantedMerchantValue: 'ungranted merchant value',
  ungrantedBestValue: 'ungranted best value', grantPlayValue: 'grant play value',
  merchantBand: 'merchant band', h01Year: 'H-PL-01 year', h02ActYear: 'H-PL-02 act year',
  existingTerm: 'existing term', modernisedTerm: 'modernised term', newBuildTerm: 'new-build term',
  firstBatteryDeliveryYear: 'first battery delivery year',
  secondBatteryDeliveryYear: 'second battery delivery year',
  earlyBatteryFactor: 'battery factor, early auctions',
  firstBatteryObligation: 'battery obligation, first auction',
  secondBatteryObligation: 'battery obligation, second auction',
  secondBatteryUnits: 'battery units, second auction',
  lastMainAuctionYear: 'last main auction year', lastMainDeliveryYear: 'last main delivery year',
  supplementaryEndYear: 'supplementary end year',
  lastMainBatteryFactor: 'battery factor, last main auction',
  firstContractValue: 'contract value, first battery auction',
  lastContractValue: 'contract value, last main auction',
  certificationHours: 'certification hours', milestoneDeliveryYear: 'milestone delivery year',
  cohortListDate: 'cohort list date', cohortSignedGrants: 'cohort signed grants',
  researchCheckDate: 'research check date', sourceCheckedDate: 'source checked date',
  grantShare: 'grant share', playDuration: 'play duration', auctionSeries: 'auction series',
};

/* A markdown link becomes its text, bold markers go, and both token spellings
   collapse to one placeholder. */
const normal = (text) => text
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replaceAll('**', '')
  .replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g, '<value>')
  .trim();
const phraseOrder = (text) => [...text.matchAll(/‹bound: ([^›]+)›/g)].map(m => m[1]);
const tokenOrder = (text) => tokensIn(text).map(t => PHRASE[t] || `?${t}`);

/** One shot's page-text table from the storyboard. */
function cellsOf(id){
  const start = md.indexOf('### ' + id + ' — ');
  const next = md.indexOf('\n### pl-', start + 1);
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

/* Cells whose wording the decision record replaces, so parity is asserted
   against the correction instead of the signed script. */
const REPLACED = new Set(['pl-06 copy', 'pl-12 controls']);

/* ---- 1. script parity ---------------------------------------------------- */

test('the module holds the storyboard sentence for every shot it copies', () => {
  for (const shot of shots){
    const cells = cellsOf(shot.id);
    for (const [field, key] of [['question', 'Question'], ['copy', 'Copy']]){
      if (REPLACED.has(`${shot.id} ${field}`)) continue;
      const expected = cells[key].map(normal);
      assert.deepEqual(shot[field].map(normal), expected, `${shot.id} ${field}`);
      assert.deepEqual(tokenOrder(shot[field][0]), phraseOrder(cells[key][0]), `${shot.id} ${field} tokens`);
    }
    if (shot.meaning === null) assert.equal(cells.Meaning, undefined, `${shot.id} has no meaning cell`);
    else {
      assert.deepEqual(shot.meaning.map(normal), cells.Meaning.map(normal), `${shot.id} meaning`);
      assert.deepEqual(tokenOrder(shot.meaning[0]), phraseOrder(cells.Meaning[0]), `${shot.id} meaning tokens`);
    }
    if (REPLACED.has(`${shot.id} controls`)) continue;
    const controls = splitCell(cells.Controls);
    assert.deepEqual(shot.controls.map(p => p.map(normal)), controls.map(p => p.map(normal)), `${shot.id} controls`);
    assert.equal(shot.controls.length, controls.length, `${shot.id} control count`);
    if (cells.Labels){
      const labels = splitCell(cells.Labels);
      const mine = Object.values(shot.labels);
      assert.equal(mine.length, labels.length, `${shot.id} label count`);
      mine.forEach((labelPair, i) => {
        assert.deepEqual(labelPair.map(normal), labels[i].map(normal), `${shot.id} label ${i}`);
        assert.deepEqual(tokenOrder(labelPair[0]), phraseOrder(labels[i][0]), `${shot.id} label ${i} tokens`);
      });
    }
    if (cells.Caption){
      assert.deepEqual(shot.caption.map(normal), cells.Caption.map(normal), `${shot.id} caption`);
      assert.deepEqual(tokenOrder(shot.caption[0]), phraseOrder(cells.Caption[0]), `${shot.id} caption tokens`);
    }
  }
});

/* ---- 1b. the departures the decision record names ------------------------ */

test('pl-06 carries the scope correction: quarterly has no terminal year', () => {
  const shot = shots.find(s => s.id === 'pl-06');
  assert.deepEqual(shot.copy, [
    'Not a long one. No main auction is scheduled after the one for {lastMainDeliveryYear}. Quarterly additional auctions admit existing units. Supplementary auctions buy a year at a time through {supplementaryEndYear}. A successor framework is not yet law.',
    '拿不到长期合同。交付年{lastMainDeliveryYear}之后不再有主拍卖排期。季度追加拍卖面向既有机组。补充拍卖逐年采购，持续至{supplementaryEndYear}年。接续机制尚未立法。',
  ]);
  /* The signed sentence tied both products to one end date; the correction
     mentions the end date once, beside the supplementary product only. */
  for (const text of shot.copy){
    const mentions = tokensIn(text).filter(token => token === 'supplementaryEndYear');
    assert.equal(mentions.length, 1, text);
    assert.equal(/quarterly[^.]*supplementaryEndYear|季度[^。]*supplementaryEndYear/i.test(text), false, text);
  }
});

test('pl-12 states the statutory delay bands, not a monthly cut', () => {
  const shot = shots.find(s => s.id === 'pl-12');
  const second = shot.extra.factors[1].affects;
  assert.deepEqual(second, [
    "late completion can reduce the grant; check the agreement's deadline and the statutory delay bands; see Execution",
    '延期完工可能导致补贴扣减；须核查协议期限及法定延迟档位；见执行步骤',
  ]);
  for (const text of second) assert.equal(/each month|每延迟一个月|每(个)?月/.test(text), false, text);
});

test('pl-00 leaves the other two metrics to the decision panel', () => {
  const figures = cardFigures(row, ui);
  assert.equal(figures[0], `${pct(row.investment.holdIRR)} (${marginText(row)[0]})`);
  assert.equal(/downside|peak|ceiling|peak pre-COD/i.test(figures[0]), false, figures[0]);
  /* The full panel is still the page's: the shot's exit points at it rather
     than copying its numbers. */
  assert.deepEqual(story.opening.controls.map(pair => pair[0]), ['Start the story', 'Go to the investment case']);
  assert.equal(/peak|ceiling|downside/i.test(story.opening.copy[0]), false);
});

test('the transfer sentence sits on pl-09 and is reachable from pl-12', () => {
  const grantHotspot = shots.find(s => s.id === 'pl-09').extra.hotspots.find(h => /Grant agreement/.test(h.name[0]));
  assert.match(grantHotspot.role[0], /Grant transfer to a buyer: not verified\./);
  assert.match(grantHotspot.role[1], /补贴能否随出售转移给买方：尚未核验。/);
  const exits = shots.find(s => s.id === 'pl-12').extra.exits;
  assert.ok(exits.some(e => e.anchor === 'story-pl-09'), 'pl-12 reaches the transfer note');
  assert.ok(exits.some(e => e.anchor === 'bankable') && exits.some(e => e.anchor === 'downside'));
});

test('pl-12 keeps the four factor cards and adds one exit, and nothing else moved', () => {
  const shot = shots.find(s => s.id === 'pl-12');
  assert.equal(shot.extra.factors.length, 4);
  assert.equal(shot.controls.length, 9, 'four cards, four script links and the transfer exit');
  assert.deepEqual(shot.controls.slice(0, 4).map(pair => pair[0]),
    ['Trading margins', 'Late completion', 'Price paid', 'Connection']);
  assert.deepEqual(shot.extra.exits.map(e => e.anchor), ['bankable', 'revenue', 'execution', 'downside', 'story-pl-09']);
});

/* ---- 2. completeness ----------------------------------------------------- */

test('thirteen shots, six chapters, one marker each and a valid story', () => {
  assert.deepEqual(validateStory(composed), { ok: true, complete: true, problems: [] });
  assert.deepEqual(story.chapters.map(c => c.id), CHAPTERS);
  assert.deepEqual(shots.map(s => s.id), Array.from({ length: 13 }, (_, i) => 'pl-' + String(i).padStart(2, '0')));
  assert.equal(story.opening.id, 'pl-00');
  assert.equal(story.playRef, row.play.id);
  assert.equal(isStale(composed, row), false);
  assert.equal(story.reviewedAgainst.on, '2026-11-01');
  assert.equal(story.reviewedAgainst.hours, row.play.hours);
  assert.equal(story.reviewedAgainst.call, row.call);
  assert.equal(story.reviewedAgainst.lens, 'infraFund');
  for (const shot of shots){
    assert.ok(MARKERS[shot.marker.level] || shot.marker.level === 'play', `${shot.id} marker`);
    if (shot.marker.level !== 'play'){
      assert.equal(shot.marker.change.length, 2);
      assert.ok(shot.marker.change.every(text => text.trim().length > 0));
    }
  }
});

test('the marker levels are the ones G-1 signed off, and pl-00 keeps each card’s own', () => {
  const levels = Object.fromEntries(shots.map(s => [s.id, s.marker.level]));
  assert.deepEqual(levels, {
    'pl-00': 'play', 'pl-01': 'fair', 'pl-02': 'strong', 'pl-03': 'strong', 'pl-04': 'strong',
    'pl-05': 'fair', 'pl-06': 'strong', 'pl-07': 'fair', 'pl-08': 'fair', 'pl-09': 'fair',
    'pl-10': 'fair', 'pl-11': 'fair', 'pl-12': 'fair',
  });
  const cards = storyRows(row);
  assert.equal(cards.grant.play.id, 'pl-grant-4h');
  assert.equal(cards.capacity.play.id, 'pl-cap-4h');
  assert.equal(cards.grant.evidence, 'fair');
  assert.equal(cards.capacity.evidence, 'fair');
  assert.equal(Object.hasOwn(cards.capacity, 'investment'), false, 'the capacity card owns no financial case');
});

test('a filled story reads in both languages with no gap or stray token', () => {
  const gated = storyWithGate(composed, true);
  const all = [gated.opening, ...gated.chapters.flatMap(c => c.shots)];
  for (const shot of all){
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

test('the figures are the records’ own, at their published precision', () => {
  assert.equal(values.firstBatteryDeliveryYear, '2027');
  assert.equal(values.secondBatteryDeliveryYear, '2028');
  assert.equal(values.earlyBatteryFactor, '95.00%');
  assert.equal(values.firstBatteryObligation, '165 MW');
  assert.equal(values.secondBatteryObligation, '1,734 MW');
  assert.equal(values.secondBatteryUnits, '33');
  assert.equal(values.lastMainAuctionYear, '2025');
  assert.equal(values.lastMainDeliveryYear, '2030');
  assert.equal(values.supplementaryEndYear, '2028');
  assert.equal(values.lastMainBatteryFactor, '13.39%');
  assert.equal(values.firstContractValue, 'PLN 386.03');
  assert.equal(values.lastContractValue, 'PLN 62.27');
  assert.equal(values.certificationHours, '4');
  assert.equal(values.milestoneDeliveryYear, '3');
  assert.equal(values.existingTerm, '1');
  assert.equal(values.modernisedTerm, '7');
  assert.equal(values.newBuildTerm, '17');
  assert.equal(values.h01Year, '2015');
  assert.equal(values.h02ActYear, '2017');
  assert.equal(values.cohortSignedGrants, '170');
  assert.deepEqual(values.cohortListDate, ['12 December 2025', '2025年12月12日']);
  assert.deepEqual(values.researchCheckDate, ['31 October 2026', '2026年10月31日']);
});

test('the card and design figures come from the page, not from a pasted string', () => {
  assert.equal(values.playDuration, String(row.play.hours));
  assert.equal(values.grantShare, '37.3%');
  assert.equal(values.grantShare, `${row.play.grantPct.toFixed(1)}%`);
  /* The two design values are the briefing's own cells at this row's duration. */
  const grid = HOME_BRIEFING.grids.pl;
  const merchant = grid.cells.find(cell => cell.route === 'mer' && cell.hours === row.play.hours);
  const best = grid.cells.find(cell => cell.best && cell.priced);
  assert.equal(values.ungrantedMerchantValue, fmtUSD(merchant.value));
  assert.equal(values.ungrantedBestValue, fmtUSD(best.value));
  assert.equal(best.route, 'cap', 'the best ungranted design holds a capacity agreement');
  assert.equal(values.grantPlayValue, fmtUSD(HOME_BRIEFING.plays['pl/pl-grant-4h'].econ.value));
  assert.deepEqual(values.merchantBand, ['2 and 4', '2和4']);
  assert.equal(values.marketCall[0], 'Watch');
  assert.equal(values.call[0], 'Situational');
  assert.match(values.marketNextAction[0], /successor/i);
  assert.match(values.nextAction[0], /ranking list/i);
});

test('pl-05 ships the numbers now, and keeps the Example sentence for a re-gate', () => {
  assert.equal(PL_CHART.quantitativeReady, true);
  const released = storyWithGate(composed);
  const regated = storyWithGate(composed, false);
  const numeric = story.chapters.find(c => c.id === 'tensions').shots[0];
  const releasedShot = released.chapters.find(c => c.id === 'tensions').shots[0];
  const regatedShot = regated.chapters.find(c => c.id === 'tensions').shots[0];
  assert.deepEqual(releasedShot.copy, numeric.copy, 'the signed sentence is what ships');
  assert.deepEqual(regatedShot.copy, numeric.exampleCopy, 'the gate still knows how to retreat');
  /* The Example sentence carries no digit, in either language. */
  for (const text of numeric.exampleCopy) assert.equal(/\d/.test(text), false, text);
  assert.equal(/Example|示例/.test(numeric.exampleCopy.join(' ')), true, 'the Example tag stays');
  /* Only pl-05 has a second form. */
  assert.equal(released.chapters.flatMap(c => c.shots).filter(s => s.exampleCopy).length, 1);
});

test('a missing binding replaces its sentence in the approved wording', () => {
  assert.equal(storyWithAvailableValues(composed, values).opening, composed.opening);
  const missing = storyWithAvailableValues(composed, { ...values, grantPlayValue: null });
  const pl11 = missing.chapters.find(c => c.id === 'payment').shots[1];
  assert.deepEqual(pl11.copy, story.text['Missing financial binding']);
  assert.ok(missing.missingBindings.includes('grantPlayValue'));
  const recordGap = storyWithAvailableValues(composed, { ...values, secondBatteryUnits: null });
  const pl03 = recordGap.chapters.find(c => c.id === 'choices').shots[1];
  assert.deepEqual(pl03.copy, story.text['Missing evidence binding']);
});

test('a withheld record never prints as zero', () => {
  assert.equal(storyWithAvailableValues(composed, { ...values, firstBatteryObligation: null }).chapters
    .find(c => c.id === 'choices').shots[1].copy[0].includes('0 MW'), false);
});

test('the reviewed tuple returns to research when the lens, call or duration moved', () => {
  assert.equal(storyMatches(story, row, 'infraFund'), true);
  assert.equal(storyMatches(story, row, 'strategic'), false);
  assert.equal(storyMatches(story, { ...row, call: 'wait' }, 'infraFund'), false);
  assert.equal(storyMatches(story, { ...row, play: { ...row.play, hours: 2 } }, 'infraFund'), false);
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
  const source = readFileSync(new URL('../src/markets/pl/story.js', import.meta.url), 'utf8');
  assert.equal(/^\s*import\s/m.test(source), false, 'the content module imports nothing');
  assert.equal(/document\.|createElement/.test(source), false, 'and draws nothing');
  for (const shot of shots){
    for (const text of shot.copy) assert.equal(/\d{4,}/.test(text.replace(/\b(19|20)\d{2}\b/g, '')), false, `${shot.id}: ${text}`);
  }
  assert.ok(story.text['Missing financial binding']);
  assert.ok(story.text['Missing evidence binding']);
});

test('dated helpers keep day, month and year precision apart', () => {
  assert.deepEqual(datePair('2026-11-02'), ['2 November 2026', '2026年11月2日']);
  assert.deepEqual(datePair('2025-12'), ['December 2025', '2025年12月']);
  assert.deepEqual(datePair('2030'), ['2030', '2030年']);
  assert.equal(datePair(null), null);
  void share; void money;
});
