import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { card } from '../../components/card.js';
import { badge } from '../../components/badge.js';
import { why } from '../../components/decisionLogic.js';
import { WA_OFFICIAL_PLANNING as P } from './officialPlanning.js';

const displayValue = (value, unit) => {
  if (value == null) return 'N/A';
  const rendered = Number.isInteger(value)
    ? value.toLocaleString('en-AU')
    : value.toLocaleString('en-AU', { maximumFractionDigits: 1 });
  return `${rendered} ${unit}`;
};

const sourceById = new Map(P.sources.map(source => [source.id, source]));

function renderWaOfficialPlanning(main){
  const evolution = card(P.title, [badge('official'), badge('forecast'), badge('public')]);
  evolution.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Metric and authority', '指标与权威性'])),
      ...P.years.map(year => h('th', { class:'num' }, L(year.label))),
      h('th', {}, L(['Definition / coverage', '定义 / 覆盖范围']))
    )),
    h('tbody', {}, P.series.map(series => h('tr', {},
      h('td', {},
        h('b', {}, L(series.label)),
        h('div', { class:'cap' }, series.authority)
      ),
      ...series.values.map(value => h('td', { class:'num' }, displayValue(value, series.unit))),
      h('td', {}, L(series.definition))
    )))
  )));
  evolution.append(h('div', { class:'note' },
    h('b', {}, L(['Horizon discipline: ', '时间范围纪律：'])),
    L([
      'Today, Capacity Year 2030–31 and the official 2035–36 ESOO endpoint are named explicitly. N/A means the cited official publication does not provide a verified like-for-like value; no hidden interpolation is used.',
      '明确展示当前、2030–31容量年度及ESOO官方终点2035–36。N/A表示引用的官方文件未提供经核验的同口径数值；不进行任何隐含插值。'
    ])
  ));
  evolution.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Official source', '官方来源'])),
      h('th', {}, L(['Vintage / last checked', '版本 / 最近核验'])),
      h('th', {}, L(['Refresh / automation', '更新频率 / 自动化'])),
      h('th', {}, L(['Coverage', '覆盖范围']))
    )),
    h('tbody', {}, P.sources.map(source => h('tr', {},
      h('td', {}, h('a', { href:source.url, target:'_blank', rel:'noopener' }, `${source.owner} — ${source.title}`)),
      h('td', {}, `${source.vintage} · checked ${source.checkedAt}`),
      h('td', {}, `${source.cadence} · ${source.automation}`),
      h('td', {}, source.coverage)
    )))
  )));
  evolution.append(why([
    'This is the system-need evidence layer, not a project-delivery forecast. The official capacity balance can support an investment thesis while the absence of a complete public project funnel still limits competition and timing confidence.',
    '这是系统需求证据层，而非项目交付预测。官方容量平衡可以支持投资逻辑，但缺少完整的公开项目漏斗仍会限制对竞争与时点的置信度。'
  ], ['Official need is not delivered supply', '官方需求不等于已交付供给']));
  main.append(evolution);

  const opportunity = card(['Opportunity logic — attractiveness is separate from confidence', '机会逻辑 — 吸引力与预测置信度分开'], [badge('official'), badge('verify')]);
  const rows = [
    [
      ['Market attractiveness', '市场吸引力'],
      P.opportunity.attractiveness.label,
      P.opportunity.attractiveness.rationale
    ],
    [
      ['Forecast confidence', '预测置信度'],
      P.opportunity.forecastConfidence.label,
      P.opportunity.forecastConfidence.rationale
    ],
    [
      ['Thesis invalidation', '投资逻辑失效条件'],
      ['Monitor explicitly', '必须显式监测'],
      P.opportunity.invalidation
    ],
  ];
  opportunity.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Decision axis', '决策维度'])),
      h('th', {}, L(['Current read', '当前判断'])),
      h('th', {}, L(['Evidence-based rationale', '证据基础']))
    )),
    h('tbody', {}, rows.map(row => h('tr', {},
      h('td', {}, h('b', {}, L(row[0]))),
      h('td', {}, L(row[1])),
      h('td', {}, L(row[2]))
    )))
  )));
  opportunity.append(why([
    'A market can be attractive because the official need is large while the forecast remains uncertain because the competitive delivery queue is incomplete. These two axes are never blended into a single score.',
    '市场可能因官方需求规模较大而具吸引力，同时又因竞争性交付队列不完整而存在预测不确定性。这两个维度不会被混合为一个评分。'
  ], ['Two axes, two decisions', '两个维度，两项决策']));
  main.append(opportunity);
}

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

export { renderWaOfficialPlanning, renderWaQueueCoverage };
