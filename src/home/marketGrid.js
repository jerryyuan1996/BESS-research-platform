/* ---------------------------------------------------------------------------
   Market universe — the card grid.

   Registry-driven: renders whatever markets it is handed. A sixth market appears
   here the moment it is registered, with no edit to this file.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { marketCard } from '../components/marketCard.js';
import { why } from '../components/decisionLogic.js';
import { runScenarioSet } from '../comparison/refinement.js';

/* Authored commentary. Deliberately NOT regenerated from the data — investment
   commentary is editorial (see docs/migration-notes.md section 7). The market
   count is interpolated so the sentence stays true as markets are added; the
   substantive claims are the author's and are left verbatim. */
const COMMENTARY = (n) => ([
  'The ' + n + ' cards show owner Base/Bull returns beside evidence confidence and the first unmet approval gate. A high return is not a recommendation when the fixed revenue is a private proxy or the evidence is incomplete.',
  n + '张卡片将业主基准/乐观回报与证据置信度及首个未满足审批门槛并列展示。当固定收入属于私有代理或证据不完整时，高回报不构成配置建议。',
]);

export function renderMarketGrid(main, marketList, exitYear, lead = null){
  const g = h('div', { class: 'mgrid' });
  if (lead) g.append(lead);
  for (const m of marketList){
    const scenarios = runScenarioSet(m, undefined, exitYear);
    g.append(marketCard(m, scenarios.base.result, scenarios));
  }
  main.append(g);
  main.append(why(COMMENTARY(marketList.length),
    ['Return and confidence answer different questions', '回报与置信度回答不同问题']));
  return g;
}
