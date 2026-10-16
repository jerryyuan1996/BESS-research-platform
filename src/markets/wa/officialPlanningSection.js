import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { card } from '../../components/card.js';
import { badge } from '../../components/badge.js';
import { WA_OFFICIAL_PLANNING as P } from './officialPlanning.js';

function renderWaQueueCoverage(main){
  const coverage = card(['Project pipeline — official coverage boundary', '项目管线 — 官方覆盖边界'], [badge('official'), badge('verify')]);
  coverage.append(h('div', { class:'warnbox' },
    h('b', {}, `${P.queueCoverage.status}: `),
    L(P.queueCoverage.statement)
  ));
  coverage.append(h('div', { class:'note' },
    h('b', {}, L(['Decision rule: ', '决策规则：'])),
    L(P.queueCoverage.implication)
  ));
  coverage.append(h('div', { class:'cap' }, L([
    'The detailed register below is retained as market intelligence, but it is not labelled or used as a complete official WA connection queue.',
    '下方详细登记保留为市场情报，但不会被标记或用作完整的西澳官方并网队列。'
  ])));
  main.append(coverage);
}

export { renderWaQueueCoverage };
