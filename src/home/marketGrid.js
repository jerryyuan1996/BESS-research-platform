/* ---------------------------------------------------------------------------
   Market universe — the card grid.

   Registry-driven: renders whatever markets it is handed. A sixth market appears
   here the moment it is registered, with no edit to this file.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { marketCard } from '../components/marketCard.js';
import { why } from '../components/decisionLogic.js';
import { runBaseCase } from '../comparison/engine.js';

/* Authored commentary. Deliberately NOT regenerated from the data — investment
   commentary is editorial (see docs/migration-notes.md section 7). The market
   count is interpolated so the sentence stays true as markets are added; the
   substantive claims are the author's and are left verbatim. */
const COMMENTARY = (n) => ([
  'All ' + n + ' dashboards independently conclude "Selective", and their composite scores sit within four points of each other — each market is attractive on its own terms. The dispersion that matters to an allocator only appears when the metrics are forced into one currency and one model, which is what the rest of this page does. The cards are a map; the comparison below is the decision layer.',
  n + '个看板各自独立得出"选择性投资"的结论，综合评分相差不过四分 — 每个市场就其自身条件而言都具吸引力。对资本配置者真正重要的离散度，只有在将指标强制归入同一货币与同一模型后才会显现，而这正是本页其余部分的工作。上方卡片是地图；下方对比才是决策层。',
]);

export function renderMarketGrid(main, marketList, exitYear){
  const g = h('div', { class: 'mgrid' });
  for (const m of marketList) g.append(marketCard(m, runBaseCase(m, exitYear)));
  main.append(g);
  main.append(why(COMMENTARY(marketList.length),
    ['Scores are local; the comparison is global', '评分是本地的，对比才是全局的']));
}
