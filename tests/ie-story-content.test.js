/* Ireland: the thirteen signed shots, their bilingual parity with the
   storyboard cells, and the binding map of ie-build-evidence §4.

   Six fields differ from the storyboard on purpose, and each is asserted as a
   mechanical derivation rather than waved through: the §7 services wording
   (B-IE-COPY) in ie-00, ie-03 and ie-10, the offered-share sentence in ie-06
   (B-IE-PARTICIPATION), the governed secured-revenue sentence in ie-09 (§7),
   and one preposition before a day-precision date in ie-02.                 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { story, SERVICES_LABEL } from '../src/markets/ie/story.js';
import { storyValues, storyWithAvailableValues, storyMatches, datePair, crmContext, historyNodes } from '../src/markets/ie/storyBindings.js';
import { validateStory, isStale, tokensIn, fillPair, CHAPTERS } from '../src/experience/story/contract.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';
import { IE_STORY_EVIDENCE as ev } from '../src/markets/ie/data/storyEvidence.js';
import { IE_CRM_AUCTIONS as crm } from '../src/markets/ie/data/crmAuctions.js';

const row = opportunities('infraFund').find((r) => r.id === 'ie');
const values = storyValues(row, { CALLS, returnPct });
const shots = [story.opening, ...story.chapters.flatMap((c) => c.shots)];

const md = readFileSync(new URL('../docs/immersive-experience-plan/ireland-storyboard.md', import.meta.url), 'utf8').replaceAll('\r', '');

/** The storyboard block for a shot, and its Page text rows. */
function pageOf(id) {
  const start = md.indexOf(`### ${id} — `);
  const end = md.indexOf('\n### ', start + 1);
  const block = md.slice(start, end < 0 ? md.indexOf('## 9. Copy', start) : end);
  const rows = block.slice(block.indexOf('| Page text |')).split('\n')
    .filter((l) => l.startsWith('| ') && !l.startsWith('| ---'));
  return Object.fromEntries(rows.slice(1).map((l) => {
    const cells = l.slice(2, -2).split(' | ');
    return [cells[0], [cells[1], cells[2]]];
  }));
}

/** Both sides to one shape: bound values, tokenised identifiers, one quote. */
const normal = (s) => String(s)
  .replaceAll('**', '')
  .replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g, '<value>')
  .replace(/\bDS3\b|\bTOR1\b|\bTOR2\b|\bfive\b|五项/g, '<value>')
  .replace(/[“”"]/g, '"')
  .replace(/[‘’']/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const splitPair = (pair) => pair[0].split(' · ').map((en, i) => [normal(en), normal(pair[1].split(' · ')[i])]);

test('thirteen shots are complete under the unchanged contract', () => {
  assert.deepEqual(validateStory(story), { ok: true, complete: true, problems: [] });
  assert.deepEqual(story.chapters.map((c) => c.id), CHAPTERS);
  assert.deepEqual(shots.map((s) => s.id), Array.from({ length: 13 }, (_, i) => 'ie-' + String(i).padStart(2, '0')));
  assert.equal(isStale(story, row), false);
  assert.equal(story.reviewedAgainst.lens, 'infraFund');
  assert.equal(story.reviewedAgainst.on, '2026-11-01');
  assert.equal(story.playRef, row.play.id);
  assert.deepEqual(story.supportedLocales, ['en', 'zh']);
  assert.deepEqual(story.chapters.map((c) => c.title), [
    ['Origins', '系统起点'],
    ['Historical choices', '历史选择'],
    ['Today’s tensions', '当下矛盾'],
    ['Add a battery', '加入电池'],
    ['Who pays', '谁来付钱'],
    ['The investment', '回到投资'],
  ]);
});

test('both languages, markers, labels, controls and captions match the storyboard cells', () => {
  for (const shot of shots) {
    const page = pageOf(shot.id);
    /* Reconciled fields are asserted below; the rest must be the cell itself. */
    for (const [key, label] of [['question', 'Question'], ['copy', 'Copy'], ['meaning', 'Meaning']]) {
      if (!shot[key]) continue;
      const reconciled = (shot.id === 'ie-00' && key === 'copy')
        || (shot.id === 'ie-02' && key === 'copy')
        || (shot.id === 'ie-03' && key === 'meaning')
        || (shot.id === 'ie-06' && key === 'copy')
        || (shot.id === 'ie-09' && key === 'meaning')
        || (shot.id === 'ie-11' && key === 'copy');
      if (reconciled) continue;
      assert.deepEqual(shot[key].map(normal), page[label].map(normal), `${shot.id} ${key}`);
    }
    const controls = splitPair(page.Controls);
    assert.deepEqual(shot.controls.map((p) => p.map(normal)), controls, `${shot.id} controls`);
    if (page.Labels && shot.id !== 'ie-10') {
      assert.deepEqual(Object.values(shot.labels).map((p) => p.map(normal)), splitPair(page.Labels), `${shot.id} labels`);
    }
    if (page.Caption) assert.deepEqual(shot.caption.map(normal), page.Caption.map(normal), `${shot.id} caption`);
    if (shot.marker.level !== 'play') {
      const change = [page.Marker[0].split('What would change it: ')[1], page.Marker[1].split('会改变判断的证据：')[1]];
      assert.deepEqual(shot.marker.change.map(normal), change.map(normal), `${shot.id} marker`);
      assert.equal(shot.marker.level, page.Marker[0].split(' ')[0].toLowerCase());
    } else {
      assert.equal(shot.id, 'ie-00');
      assert.match(page.Marker[0], /play's own marker/);
    }
  }
});

test('the six reconciled fields are mechanical, not new prose', () => {
  const byId = Object.fromEntries(shots.map((s) => [s.id, s]));

  /* B-IE-COPY: the exact §7 services wording replaces the zero-services lines. */
  assert.ok(byId['ie-00'].copy[0].includes(SERVICES_LABEL[0]));
  assert.ok(byId['ie-00'].copy[0].includes('Follow the story from a small island grid to the contract.'));
  assert.ok(!JSON.stringify(byId['ie-00'].copy).includes('prices the project without them'));
  assert.deepEqual(byId['ie-03'].meaning, SERVICES_LABEL);
  assert.ok(!JSON.stringify(byId['ie-03'].meaning).includes('does not rely on it'));
  assert.deepEqual(byId['ie-10'].labels.services, SERVICES_LABEL);
  assert.ok(!JSON.stringify(byId['ie-10'].labels).includes('not counted in this play'));

  /* B-IE-PARTICIPATION: the offered share replaces the ambiguous sentence. */
  const signed = pageOf('ie-06').Copy;
  const replaced = [
    normal(signed[0]).replace('In the latest auction most qualified new batteries did not bid.', 'Only <value> of qualified new battery capacity was offered.'),
    normal(signed[1]).replace('最近一轮拍卖中，多数已获资格的新建电池没有报价。', '已获资格的新建电池容量中，仅<value>提交了报价。'),
  ];
  assert.deepEqual(byId['ie-06'].copy.map(normal), replaced);

  /* §7's governed secured-revenue sentence, with its merchant tail. */
  assert.deepEqual(byId['ie-09'].meaning.map(normal), [
    'Conditional on obtaining and performing the modelled capacity award, capacity secures <value> of first-year revenue for <value> years. After expiry, revenue is merchant unless a new contract is won; renewal is an assumption.',
    '以取得并履行模型中的容量授标为条件，容量付款在<value>年内锁定首年收入的<value>。到期后，若未赢得新合同，则承担市场风险；续期仍是假设。',
  ]);

  /* Punctuation only: the action text is a whole sentence with its own stop. */
  assert.deepEqual(byId['ie-11'].copy.map(normal), pageOf('ie-11').Copy.map(normal).map((s) => s
    .replace('Then <value>.', 'Then: <value>')
    .replace('随后：<value>。', '随后：<value>')));

  /* One preposition: a day-precision date cannot follow “In”. */
  assert.deepEqual(byId['ie-02'].copy.map(normal), pageOf('ie-02').Copy.map(normal).map((s) => s.replace(/^In /, 'On ')));
});

test('every figure resolves from a field, and no string prints an unresolved one', () => {
  for (const token of story.tokens) assert.notEqual(values[token], undefined, `${token} has no value entry`);
  const filled = storyWithAvailableValues(story, values);
  const strings = (shot) => [shot.question, shot.copy, shot.meaning, shot.marker.change, shot.caption,
    ...Object.values(shot.labels || {}), shot.controls].filter(Boolean);
  for (const shot of [filled.opening, ...filled.chapters.flatMap((c) => c.shots)]) {
    for (const pair of strings(shot)) {
      for (const text of fillPair(pair, values)) {
        assert.ok(!/\{[A-Za-z]/.test(text), `${shot.id}: unresolved token in "${text}"`);
        assert.ok(!/undefined|NaN|null/.test(text), `${shot.id}: placeholder in "${text}"`);
        assert.ok(!text.includes('— ·') && !text.includes('· —'), `${shot.id}: em dash where a figure belongs`);
      }
    }
  }
  /* Every declared token is actually used: no dead weight in the chunk. */
  const used = new Set([...shots.flatMap((s) => [s.question, s.copy, s.meaning, s.marker.change, s.caption,
    ...Object.values(s.labels || {}), s.controls].filter(Boolean)), ...Object.values(story.text)].flatMap(tokensIn));
  assert.deepEqual([...story.tokens].filter((t) => !used.has(t)), []);
});

test('the live figures are the card’s own, and the chart context is not the play duration', () => {
  assert.equal(values.cardFigures[0], `${returnPct(row.investment.holdIRR)} · ${Math.round(row.investment.secured * 100)}% / ${row.investment.securedYears} years`);
  assert.equal(values.securedShare, Math.round(row.investment.secured * 100) + '%');
  assert.equal(values.securedTenor, String(row.investment.securedYears));
  assert.deepEqual(values.nextAction, row.play.action.text);
  assert.deepEqual(values.call, CALLS.wait);
  assert.equal(values.playDuration, '6');

  /* The whole point of the fixed-context label: 4 is the chart's column, 6 is
     the play. A changed play duration must not relabel the historical series. */
  assert.equal(values.crmContextDuration, String(crm.contextHours.value));
  assert.equal(values.crmContextDuration, '4');
  assert.equal(row.play.hours, 6);
  assert.deepEqual(values.crmBand, crmContext().band);
  const relabelled = storyValues({ ...row, play: { ...row.play, hours: 8 } }, { CALLS, returnPct });
  assert.equal(relabelled.crmContextDuration, '4');
  assert.equal(relabelled.playDuration, '8');

  /* Dated evidence, each from its registered field. */
  assert.deepEqual(values.semGoLive, ['1 November 2007', '2007年11月1日']);
  assert.deepEqual(values.isemGoLive, ['1 October 2018', '2018年10月1日']);
  assert.deepEqual(values.ds3Start, ['2011', '2011年']);
  assert.deepEqual(values.snspDate, ['March 2022', '2022年3月']);
  assert.equal(values.snspLimit, '75%');
  assert.deepEqual(values.vcAward, ['2019', '2019年']);
  assert.deepEqual(values.vcServicesWord, ['five', '五项']);
  assert.deepEqual(values.longStop, ['30 September 2027', '2027年9月30日']);
  assert.equal(values.roMaxYears, String(ev.ro.maxYears.value));
  assert.equal(values.dataCentreShare, '23%');
  assert.deepEqual(values.dataCentreYear, ['2025', '2025年']);
  assert.deepEqual(values.vcAwardedMW, ['110 MW', '110MW']);
  assert.equal(values.vcWinners, '3');
  assert.equal(values.serviceCodes.length, 5);

  /* The withheld share is absent, not zero and not estimated. */
  assert.equal(crm.participation.offeredNewShare.value, null);
  assert.equal(values.newBatteryOfferedShare, null);
});

test('the withheld participation sentence falls back to the same copy without it', () => {
  const published = storyWithAvailableValues(story, values);
  const shot = published.chapters[2].shots[1];
  assert.equal(shot.id, 'ie-06');
  assert.deepEqual(shot.copy, story.chapters[2].shots[1].copyWhenWithheld);
  assert.ok(!JSON.stringify(shot.copy).includes('newBatteryOfferedShare'));
  assert.deepEqual(published.missingBindings, ['newBatteryOfferedShare']);
  /* A cleared build restores the full sentence without touching the story. */
  const cleared = storyValues(row, { CALLS, returnPct });
  cleared.newBatteryOfferedShare = '20%';
  const full = storyWithAvailableValues(story, cleared);
  assert.ok(fillPair(full.chapters[2].shots[1].copy, cleared)[0].includes('Only 20% of qualified new battery capacity was offered.'));
  assert.deepEqual(full.missingBindings, []);
});

test('a different lens, call or duration returns the story to research', () => {
  assert.equal(storyMatches(story, row, 'infraFund'), true);
  assert.equal(storyMatches(story, row, 'strategic'), false);
  assert.equal(storyMatches(story, row, null), false);
  assert.equal(storyMatches(story, { ...row, call: 'research' }, 'infraFund'), false);
  assert.equal(storyMatches(story, { ...row, play: { ...row.play, hours: 4 } }, 'infraFund'), false);
  assert.equal(storyMatches(story, { ...row, play: { ...row.play, id: 'ie-cap-4h' } }, 'infraFund'), false);
});

test('the page vocabulary is bilingual, aligned and split like the shell expects', () => {
  for (const [key, pair] of Object.entries(story.text)) {
    assert.equal(pair.length, 2, key);
    assert.ok(pair[0].trim() && pair[1].trim(), key);
    assert.deepEqual(tokensIn(pair[0]).sort(), tokensIn(pair[1]).sort(), key);
    if (pair[0].includes('; ') || pair[1].includes('；')) {
      assert.equal(pair[0].split('; ').length, pair[1].split('；').length, `${key} segment count`);
    }
  }
  assert.equal(SERVICES_LABEL[0].split('; ').length, SERVICES_LABEL[1].split('；').length);
});

test('dates keep the precision the record stores', () => {
  assert.deepEqual(datePair('2011', 'year'), ['2011', '2011年']);
  assert.deepEqual(datePair('2022-03', 'month'), ['March 2022', '2022年3月']);
  assert.deepEqual(datePair('2027-09-30', 'day'), ['30 September 2027', '2027年9月30日']);
  assert.equal(datePair(null), null);
  assert.deepEqual(historyNodes.map((n) => n.id), ['H-IE-01', 'H-IE-02', 'H-IE-03', 'H-IE-04', 'H-IE-05', 'H-IE-06']);
  assert.deepEqual(historyNodes.map((n) => n.when), ['2007-11-01', '2011', '2018-10-01', '2019', '2022-03', '2025-06-23']);
});
