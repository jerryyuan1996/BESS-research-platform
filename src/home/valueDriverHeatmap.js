import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import {
  EVIDENCE_CONFIDENCE_LABEL,
  EVIDENCE_STATUS,
  EVIDENCE_STATUS_LABEL,
} from '../governance/evidenceStatus.js';
import { sourceById } from '../governance/sourceRegistry.js';
import {
  VALUE_DRIVER_MARKETS,
  VALUE_DRIVER_DIMENSIONS,
  valueDriverDimensionEvidence,
} from './valueDriverData.js';

const T = {
  title: ['What Drives BESS Value?', '什么驱动储能价值？'],
  intro: [
    'A governed evidence map across the eight investor dimensions that should enter underwriting. Cell colour shows evidence maturity—not market attractiveness—and blanks remain explicit build gaps rather than invented estimates.',
    '覆盖八项储能投资者承销维度的治理证据图。单元格颜色表示证据成熟度，而非市场吸引力；空缺明确标记为待建数据，绝不以主观估值填补。',
  ],
  source: ['Open official source', '打开公开官方来源'],
  methodology: ['Method', '方法'],
  proxyFor: ['Proxy for', '代理对象'],
  gap: ['Evidence gap', '证据缺口'],
  buildPlan: ['Build next', '下一步建设'],
  sourceNote: [
    'All populated cells link to public primary sources registered with a refresh cadence and automation grade. Derived and proxy values disclose their calculation or limitation.',
    '所有已填充单元格均链接至已登记刷新频率和自动化等级的公开一手来源；衍生值与代理值均披露计算方法或局限。',
  ],
};

const STATUS_ORDER = [
  EVIDENCE_STATUS.VERIFIED,
  EVIDENCE_STATUS.DERIVED,
  EVIDENCE_STATUS.PROXY,
  EVIDENCE_STATUS.TO_BUILD,
];

function marketHeading(market){
  if (!market) return '';
  return h('span', { class: 'value-driver-market' },
    h('span', { class: 'value-driver-flag' }, market.manifest.flag),
    h('span', {}, L(market.manifest.shortName)));
}

function evidenceDetails(record){
  const rows = [];
  if (record.method) rows.push(h('div', {}, h('b', {}, L(T.methodology) + ': '), L(record.method)));
  if (record.proxyFor) rows.push(h('div', {}, h('b', {}, L(T.proxyFor) + ': '), L(record.proxyFor)));
  if (record.gap) rows.push(h('div', {}, h('b', {}, L(T.gap) + ': '), L(record.gap)));
  if (record.buildPlan) rows.push(h('div', {}, h('b', {}, L(T.buildPlan) + ': '), L(record.buildPlan)));

  const source = record.sourceIds?.length ? sourceById(record.sourceIds[0]) : null;
  if (source){
    rows.push(h('a', {
      href: source.canonicalUrl,
      target: '_blank',
      rel: 'noreferrer',
      class: 'value-driver-source',
    }, L(T.source) + ' ↗'));
  }
  if (!rows.length) return null;
  return h('details', { class: 'value-driver-details' },
    h('summary', {}, L(['Evidence', '证据'])),
    ...rows);
}

function evidenceCell(record){
  return h('td', { class: 'value-evidence value-evidence--' + record.status },
    h('div', { class: 'value-evidence-value' },
      record.display ? L(record.display) : L(EVIDENCE_STATUS_LABEL[record.status])),
    h('div', { class: 'value-evidence-meta' },
      h('span', { class: 'value-evidence-status' }, L(EVIDENCE_STATUS_LABEL[record.status])),
      h('span', {}, L(EVIDENCE_CONFIDENCE_LABEL[record.confidence]))),
    evidenceDetails(record));
}

export function renderValueDriverHeatmap(main, marketList){
  const marketById = new Map(marketList.map(market => [market.manifest.id, market]));
  const table = h('table', { class: 'hm value-driver-hm' },
    h('thead', {}, h('tr', {},
      h('th', { class: 'rowlbl' }, L(['Value driver', '价值驱动因素'])),
      VALUE_DRIVER_MARKETS.map(marketId => h('th', {}, marketHeading(marketById.get(marketId)))))),
    h('tbody', {}, VALUE_DRIVER_DIMENSIONS.map(dimension => h('tr', {},
      h('td', { class: 'rowlbl' },
        h('b', {}, L(dimension.label)),
        h('span', { class: 'value-driver-description' }, L(dimension.description))),
      VALUE_DRIVER_MARKETS.map(marketId => evidenceCell(valueDriverDimensionEvidence(marketId, dimension.id)))))));

  const legend = h('div', { class: 'value-driver-legend' },
    ...STATUS_ORDER.map(status => h('span', { class: 'value-evidence-key value-evidence--' + status },
      L(EVIDENCE_STATUS_LABEL[status]))));

  const card = spacedCard(T.title, [badge('official'), badge('calc')],
    h('p', { class: 'value-driver-intro' }, L(T.intro)),
    legend,
    h('div', { class: 'tbl-wrap' }, table),
    h('p', { class: 'cap value-driver-note' }, L(T.sourceNote)));
  main.append(card);
}
