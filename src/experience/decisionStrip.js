import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { CALLS, LENSES, money, returnPct } from './model.js';
import { STAGE_LABEL } from '../acquisition/parameters.js';
import { decisionTrace, situationalQualifier, QUALIFIER_LABEL, DEBT_LABEL, statedPrice } from './traceability.js';

export function callTag(row) {
  const qualifier = situationalQualifier(row);
  return h('span', { class:`ix-tag ${row.call}${qualifier ? ' ix-qualified-' + qualifier : ''}`, 'data-call':row.call },
    h('span', {}, L(CALLS[row.call] || CALLS.research)),
    qualifier ? h('span', { class:'ix-call-qualifier', 'data-qualifier':qualifier }, ' · ', L(QUALIFIER_LABEL[qualifier])) : null);
}
const rate = value => Number.isFinite(value) ? ((Math.abs(value)<1e-12?0:value) * 100).toFixed(2) + '%' : '—';
const evidenceLabel = { strong:['Strong', '充分'], fair:['Fair', '尚可'], thin:['Thin', '单薄'] };

/** The same six-part reading order on brief cards, comparison rows and decisions. */
export function decisionStrip(row) {
  const i = row.investment, trace = decisionTrace(row, Object.values(HOME_BRIEFING.triggers)), price = statedPrice(row);
  const item = (key,label,...content) => h('div', { class:'ix-strip-item', 'data-strip-element':key },
    h('dt', {}, L(label)), h('dd', {}, ...content));
  const b = i?.targetBuildUp;
  const breakdown = b ? h('small', { class:'ix-target-build-up' },
    h('span', {}, L(['Government rate', '政府利率']), ' ', rate(b.government)), ' + ',
    h('span', {}, L(['Investor / stage premium', '投资者／阶段溢价']), ' ', rate(b.investorStage)), ' + ',
    h('span', {}, L(['Merchant premium', '市场化收入溢价']), ' ', rate(b.merchant)),
    h('span', { class:'ix-target-basis' }, L(STAGE_LABEL[i.stage]), ' · ', i.currency)) : null;
  return h('dl', { class:'ix-decision-strip', 'data-market':row.id, 'data-investor':row.investor,
    'aria-label':L(['Decision trace', '投资判断依据']) },
    item('call', ['Call / investor', '建议／投资者'], callTag(row), h('small', {}, L(LENSES[row.investor] || LENSES.infraFund))),
    item('target', ['All-equity IRR / target', '全股权 IRR／目标'],
      h('strong', {}, returnPct(i?.holdIRR), ' / ', rate(i?.test?.target)), breakdown,
      price && situationalQualifier(row) === 'price' ? h('small', {class:'ix-stated-price'},
        L(price.operating ? ['Operating purchase ceiling: ', '在运资产收购上限：'] : ['Project-rights ceiling: ', '项目权利收购上限：']), money(price.amount,i.currency), '/MW') : null),
    item('debt', ['Debt effect', '债务影响'], h('strong', { class:'ix-debt-effect ' + trace.debt, 'data-debt-effect':trace.debt }, L(DEBT_LABEL[trace.debt])),
      h('small', {}, L(['Levered IRR ', '杠杆后 IRR ']), returnPct(i?.leveredIRR))),
    item('gate', ['Before committing', '投入前核验'], L(trace.gate)),
    trace.event ? item('event', trace.event.overdue ? ['Dated event · overdue', '已定日期事件 · 已逾期'] : ['Next dated event', '下一已定日期事件'],
      h('time', { datetime:trace.event.expected }, trace.event.expected), ' · ', L(trace.event.label),
      trace.event.expected.length===7 ? h('small', {}, L(['Expected month; exact date unconfirmed','预计月份，具体日期待确认'])) : null) : null,
    item('evidence', ['Evidence', '证据'], h('strong', { class:'ix-evidence-marker ' + trace.evidence, 'data-evidence':trace.evidence }, L(evidenceLabel[trace.evidence])),
      h('small', {}, h('b', {}, L(['What would change it: ', '什么会改变判断：'])), trace.changes.map(L).join(' · '))));
}
