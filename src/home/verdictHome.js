/* ---------------------------------------------------------------------------
   The home page's body — verdicts first.

     lens              which investor is reading
     verdict board     every market for that investor, by verdict then fit,
                       and below it the scouting tier's cards, calls only
     return × entry    the one chart: why a ranking by return misleads
     what changed      the last ten changes to the view
     trigger calendar  what is due in the next twelve months

   Fetched on demand by homePage.js, because it needs the whole method layer.
   It does not need a market's words: see markets/boardProjection.js.

   THE LENS IS A PREFERENCE, STORED LIKE LANGUAGE AND THEME. With none chosen
   the board shows all four investors side by side. It is never a filter on
   the data: every investor's verdict is in the view store whichever is shown.

   THE EVALUATION DATE IS THE READER'S, as on the Investment Case tab. A held
   view lapses, a trigger becomes overdue and the calendar's window moves with
   the reader's clock and no rebuild. This is the one clock read here.

   ONE SENTENCE ABOVE EVERY SECTION SAYS WHAT IT ARGUES (plan section 6.6).
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, setLens } from '../app/state.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { markets } from '../markets/registry.js';
import { boardViewFor, boardLedgerFor, boardTriggers } from '../markets/viewBoard.js';
import { VIEW_CHANGES } from '../markets/viewChanges.js';
import { privateMetrics } from '../local/notes.js';
import { FX } from '../comparison/assumptions.js';
import { ARCHETYPE_IDS } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { homeState } from './state.js';
import { buildBoard, resolveLens, triggerCalendar, changesThisWeek } from './boardModel.js';
import { renderVerdictBoard, renderScoutRows } from './verdictBoard.js';
import { scoutBoardRows } from '../scout/boardRows.js';
import { SCOUT_CALLS } from '../scout/scoutIndex.js';
import { renderReturnEntryMap } from './returnEntryMap.js';
import { renderTriggerCalendar } from './triggerCalendar.js';
import { renderChangesPanel } from './changesPanel.js';

const today = () => new Date().toISOString().slice(0, 10);

function lensBar(lens){
  const button = (id, label) => h('button', {
    class: 'btn lens-btn',
    type: 'button',
    'aria-pressed': String(lens === id),
    onclick: () => {
      const y = window.scrollY;
      setLens(id);
      requestRender();
      window.scrollTo(0, y);
    },
  }, L(label));

  const bar = h('div', { class: 'lens-bar', role: 'group', 'aria-label': L(['Investor lens', '投资者视角']) },
    h('span', { class: 'lens-label' }, L(['Investor', '投资者'])),
    button(null, ['All four', '全部四类']),
    ARCHETYPE_IDS.map(id => button(id, ARCHETYPES[id].label)));

  const arch = lens ? ARCHETYPES[lens] : null;
  const about = arch
    ? h('div', { class: 'lens-about' },
        h('b', {}, L(arch.label) + ' — '), L(arch.who), L(['. ', '。']),
        L(['Reads return as: ', '回报口径：']), L(arch.returnReads), L(['. ', '。']),
        L(['Shut out by: ', '会被挡在门外的情形：']), L(arch.shutOutBy), L(['.', '。']))
    : h('div', { class: 'lens-about' }, L([
        'No investor chosen, so each market shows all four verdicts. Choose one to order the board for that investor and see its pillars.',
        '尚未选定投资者，因此每个市场同时列出四类结论。选定一类后，看板将按该类投资者排序，并显示其四大支柱读数。',
      ]));
  return h('div', { class: 'lens' }, bar, about);
}

export function renderVerdictHome(main){
  const on = today();
  const lens = resolveLens(app.lens);
  const board = buildBoard(markets, {
    lens, on, usdPer: FX, exitYear: homeState.exitYear,
    /* The projection: grades as numbers, calls and amounts. The reasons and
       arguments stay with each market's own dashboard. */
    viewFor: boardViewFor, ledgerFor: boardLedgerFor,
    /* Empty in a build, so the published page always gets the public answer. */
    privateMetricsFor: privateMetrics,
  });
  const week = changesThisWeek(VIEW_CHANGES.perDay, on);

  main.append(lensBar(lens));
  main.append(h('div', { class: 'vh-asat' },
    L(['As at ', '截至 ']) + on + ' · '
    + L([`${week} ${week === 1 ? 'change' : 'changes'} in the last seven days`, `近七天有${week}项变更`]) + ' · '
    + L([`${board.gradedCount} of ${board.rows.length} markets graded`, `${board.rows.length}个市场中已评级${board.gradedCount}个`])));

  /* ---- the board ---- */
  const boardCard = spacedCard(
    lens
      ? [`Verdict board — every market for the ${ARCHETYPES[lens].label[0].toLowerCase()}, ordered by verdict then fit`,
         `投资结论看板 — ${ARCHETYPES[lens].label[1]}眼中的全部市场，按结论、再按匹配度排序`]
      : ['Verdict board — every market, read by all four investors', '投资结论看板 — 四类投资者眼中的全部市场'],
    []);
  boardCard.append(h('div', { class: 'cap' }, L([
    'The same market is a different answer for a different investor. The analyst sets each verdict; the score only checks it. A barrier is a threshold and never a weight, so where one applies the row leads with the barrier and not with the score.',
    '同一个市场，对不同投资者是不同的答案。每个结论由分析师设定，评分只用于校验。门槛是硬性阈值而非权重，因此一旦触及，该行先说明门槛，而不是评分。',
  ])));
  renderVerdictBoard(boardCard, board);
  /* Below the board, the markets that have a card and no dashboard. */
  renderScoutRows(boardCard, scoutBoardRows(SCOUT_CALLS, lens), lens);
  if (board.rows.some(r => r.graded && Object.values(r.cells).some(c => c.confidential))){
    boardCard.append(h('div', { class: 'cap' }, badge('conf'), ' ', L([
      'On this screen a limit is checked against a private figure. The published page does not have it and may read differently.',
      '本屏幕上有上限是对照私有数字核查的。公开发布的页面没有该数字，读数可能不同。',
    ])));
  }
  main.append(boardCard);

  /* ---- the map ---- */
  const mapCard = spacedCard(['Return against ease of entry', '回报与进入难易程度'], [badge('calc'), badge('illus')]);
  mapCard.append(h('div', { class: 'cap' }, L([
    'The markets that pay most are not the ones that are easiest to enter, so a ranking by return points away from where capital can actually go. Upper left is rich and gated; lower right is open and thin.',
    '回报最高的市场并不是最容易进入的市场，因此按回报排名所指的方向，恰恰不是资本真正进得去的地方。左上角回报高但设有门槛，右下角容易进入但回报偏薄。',
  ])));
  renderReturnEntryMap(mapCard, board);
  if (lens === 'developer'){
    mapCard.append(h('div', { class: 'cap' }, L([
      'A developer sells before the build, and its own measure, the development multiple, is not modelled. The return shown is the exit IRR a buyer of its project would earn.',
      '开发商在建设前出售项目，其自身的衡量指标（开发倍数）未建模。此处所示回报为项目买方可获得的退出IRR。',
    ])));
  }
  main.append(mapCard);

  /* ---- what changed, and what is coming ---- */
  const pair = h('div', { class: 'grid g2 vh-pair' });
  const changes = spacedCard(['What changed', '近期变更'], []);
  changes.append(h('div', { class: 'cap' }, L([
    'A verdict that moves leaves a line saying who moved it and why. These are the last ten.',
    '结论每次变动都会留下一条记录，写明由谁改动及其原因。此处为最近十条。',
  ])));
  renderChangesPanel(changes, VIEW_CHANGES);

  const calendar = spacedCard(['Trigger calendar — the next twelve months', '触发事件日历 — 未来十二个月'], []);
  calendar.append(h('div', { class: 'cap' }, L([
    'Each mark is a dated event that would move a grade, and with it a verdict. It says when to look again.',
    '每个标记都是一个有日期的事件，它会改变某项评级，进而改变结论。它告诉你何时该再看一次。',
  ])));
  renderTriggerCalendar(calendar, triggerCalendar(boardTriggers(), on));
  pair.append(changes, calendar);
  main.append(pair);
}
