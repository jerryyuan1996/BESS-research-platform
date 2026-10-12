/* ---------------------------------------------------------------------------
   What changed — the last ten lines of the view store's changelog.

   Every change to a grade, a verdict or a trigger writes one changelog line,
   and the changelog is the only marking a change gets (plan section 7.5). This
   shows the newest ten: when, which market, who made it, what it touched and
   the reason given.

   The reason printed is the PUBLIC one recorded with the change. Where the
   analyst's own reason is private, the public line says so and nothing more;
   the private text lives in local-data/ and is never read here.

   The author is always shown, and a rule is named. A rule or an agent may
   write the view, and nothing else on the page marks which did: this column
   and the /changes page it links to are where a reader finds out.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { byId } from '../markets/registry.js';
import { scoutMarket } from '../governance/scout.js';
import { boardTriggers } from '../markets/viewBoard.js';
import { dimension } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';

const AUTHOR = {
  analyst: ['Analyst', '分析师'],
  rule: ['Rule', '规则'],
  agent: ['Agent', '智能体'],
};

const KIND = {
  grades: ['Grade', '评级'],
  verdicts: ['Verdict', '结论'],
  triggers: ['Trigger', '触发事件'],
  thesis: ['Thesis', '投资论点'],
  facts: ['Facts', '事实'],
  returnSignal: ['Return signal', '回报参考信号'],
  checked: ['Spot-check', '抽查'],
};

/**
 * "grades.capitalAtRisk.held" → "Grade · Capital at risk · practitioner view".
 * A trigger is named by what it is, where the store still holds it; one since
 * removed falls back to its id.
 */
export function pathLabel(path){
  const [kind, id, layer] = String(path).split('.');
  const parts = [L(KIND[kind] || [kind, kind])];
  if (kind === 'grades' && id) parts.push(L(dimension(id)?.label || [id, id]));
  else if (kind === 'verdicts' && id) parts.push(L(ARCHETYPES[id]?.label || [id, id]));
  else if (kind === 'triggers' && id) parts.push(L(boardTriggers().find(t => t.id === id)?.label || [id, id]));
  else if (id) parts.push(id);
  if (layer === 'held') parts.push(L(['practitioner view', '从业者观点']));
  return parts.join(' · ');
}

/**
 * @param parent   where the panel goes
 * @param changes  the digest from markets/viewChanges.js
 */
export function renderChangesPanel(parent, changes){
  if (!changes.recent.length){
    parent.append(h('div', { class: 'note' }, L(['No change is recorded yet.', '尚未记录任何变更。'])));
    return;
  }
  parent.append(h('ol', { class: 'cp-list' }, changes.recent.map(entry => {
    const market = byId(entry.market);
    return h('li', { class: 'cp-item' },
      h('div', { class: 'cp-meta' },
        h('span', { class: 'cp-date' }, String(entry.at).slice(0, 10)),
        h('b', {}, market ? L(market.manifest.shortName) : scoutMarket(entry.market) ? L(scoutMarket(entry.market).name) : entry.market),
        h('span', { class: 'cp-author' + (entry.author === 'rule' || entry.author === 'agent' ? ' cl-machine' : '') },
          L(AUTHOR[entry.author] || ['Unknown author', '作者不详']),
          entry.rule ? `: ${L(boardTriggers().find(t => t.id === entry.rule)?.label || [entry.rule, entry.rule])}` : '')),
      h('div', { class: 'cp-path' }, pathLabel(entry.path), ' ', h('code', {}, entry.path)),
      h('div', { class: 'cp-reason' }, L(entry.reason)));
  })));
  parent.append(h('div', { class: 'cap' }, L([
    `The newest ${changes.recent.length} of ${changes.total} changes recorded in the view store. `,
    `投资判断库共记录${changes.total}项变更，此处为最近${changes.recent.length}项。`,
  ]), h('a', { href: '/changes', onclick: (e) => { e.preventDefault(); navigate('/changes'); } },
    L(['See every change, by market and author →', '查看全部变更，可按市场和作者筛选 →']))));
}
