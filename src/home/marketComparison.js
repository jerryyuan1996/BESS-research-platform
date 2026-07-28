/* ---------------------------------------------------------------------------
   Apples-to-apples league table.

   The prototype hardcoded thirteen rows inline and iterated the fixed five-market
   MARKETS array. Rows now come from the metric catalogue (comparison/metrics.js)
   and columns from whatever market list is passed in — N markets, not five.

   Row order, labels, formatting, and the best/worst colouring rule are unchanged.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { METRICS, rank, metricLabel } from '../comparison/metrics.js';
import { runAll } from '../comparison/engine.js';
import { strategyById, baseStrategy } from '../comparison/strategies.js';

/* Structural commentary. Deliberately names no winner: rankings move when a
   market is added, and a sentence that names a winner goes stale silently. The
   claim here — read pairs of rows, not cells — holds at any N. */
const COMMENTARY = (n) => ([
  'Read this table by row pairs, not cell by cell. Revenue rows and capital rows move in opposite directions: high capacity pay arrives bundled with long duration, and therefore with several times the capex per MW. The two rows that most often get conflated are the first two — secured share and secured tenor. A market can be three-quarters secured for one year, or a tenth secured for fifteen; those are different assets and the exit column prices them differently. Across ' + n + ' markets, no row on its own ranks the set.',
  '本表应按行成对阅读，而非逐格阅读。收入行与资本行方向相反：高容量付费与长时长捆绑出现，因此每MW造价高出数倍。最常被混淆的是前两行 — 已锁定占比与锁定年限。一个市场可能四分之三收入锁定但仅一年，也可能十分之一锁定却长达十五年；二者是不同的资产，退出列对其定价亦不同。在' + n + '个市场中，没有任何单独一行能为整个样本排序。',
]);

/** Lists the base strategies in play, so the caption stays true as markets change. */
function baseStrategyCaption(marketList){
  const groups = new Map();
  for (const m of marketList){
    const id = baseStrategy(m);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(m.manifest);
  }
  const parts = [...groups.entries()].map(([sid, mfs]) =>
    L(strategyById(sid).n) + ' (' + mfs.map(mf => L(mf.shortName)).join(', ') + ')');
  return parts.join(' · ');
}

export function renderLeague(main, marketList, exitYear){
  const results = runAll(marketList, exitYear);

  const c = spacedCard(
    ['Apples-to-apples league — one currency, one model, each market’s base strategy',
     '同口径对比表 — 同一货币、同一模型、各市场基准策略'],
    [badge('calc'), badge('illus')]);

  const tbl = h('table', {},
    h('thead', {}, h('tr', {},
      h('th', { class: 'rowlbl' }, L(['Indicator', '指标'])),
      marketList.map(m => h('th', { class: 'num' }, m.manifest.flag + ' ' + L(m.manifest.shortName))))),
    h('tbody', {}, METRICS.map(metric => {
      const tr = h('tr', {}, h('td', { class: 'rowlbl' }, h('b', {}, L(metricLabel(metric, exitYear)))));
      const { best, worst } = rank(metric, marketList, results);
      marketList.forEach((m, i) => {
        const r = results.get(m.manifest.id);
        // Never substitute a number for "not applicable".
        const text = r && !r.na ? String(metric.format(m, r)) : 'N/A';
        const cls = metric.ctx ? ' ctx' : (r && r.na) ? ' ctx' : i === best ? ' best' : i === worst ? ' worst' : '';
        tr.append(h('td', { class: 'num' + cls }, text));
      });
      return tr;
    })));

  c.append(h('div', { class: 'tbl-wrap hm' }, tbl));
  c.append(h('div', { class: 'cap' },
    L(['Green = best of ', '绿色 = ']) + marketList.length +
    L([' on that indicator · red = weakest · grey italics = shown for context only, not rank-comparable. Base strategies: ',
       '个市场中该指标最优 · 红色 = 最弱 · 灰色斜体 = 仅供参考、不可排序比较。基准策略：']) +
    baseStrategyCaption(marketList) + '.'));
  c.append(why(COMMENTARY(marketList.length),
    ['Secured share and secured tenor are different questions', '锁定占比与锁定年限是两个问题']));
  main.append(c);
}
