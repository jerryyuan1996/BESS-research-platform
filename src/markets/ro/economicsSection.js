import { RO_ECONOMICS } from './economicsData.js';

const statusCell = (status) => ({
  chip: status === 'VERIFIED' ? 'good' : status === 'DERIVED' ? 'info' : 'warn',
  text: [status, status],
});

const sourceRecord = (metric) => ({
  file: `${metric.source.owner} — ${metric.label}`,
  status: ['Official public source', '官方公开来源'],
  date: metric.source.vintage,
  cy: `${metric.status} · ${metric.authority}`,
  url: metric.source.url,
});

export function buildROEconomicsBlocks(){
  const E = RO_ECONOMICS;
  return [
    {
      t: 'card',
      title: ['Economics DNA — what creates and captures Romanian BESS value', '经济性DNA——罗马尼亚储能价值如何形成与捕获'],
      badges: ['official', 'calc'],
      live: false,
      blocks: [
        { t: 'chip', cls: 'info', text: [E.dna.label, '市场化电能+平衡可选性，且无容量付费保底'] },
        { t: 'flow', items: E.dna.driverChain.map((x) => [x, x]), sep: '→' },
        { t: 'why', text: [E.dna.ownerRule, '国家援助降低风险资本，但不是运营收入；计划预算也不等于项目中标。'], sig: ['Capital support is not revenue', '资本支持不等于收入'] },
      ],
    },
    {
      t: 'card',
      title: ['Governed first pass — verified facts, derived signals and proxies', '治理化第一版——已核实事实、衍生信号与代理指标'],
      badges: ['official', 'public'],
      live: false,
      blocks: [
        {
          t: 'table',
          head: [['Metric', '指标'], ['Value', '数值'], ['Class', '分类'], ['Formula / definition', '公式/定义'], ['Limitation', '局限']],
          rows: E.metrics.map((m) => [
            { b: [m.label, m.label] },
            `${m.display} ${m.unit}`,
            statusCell(m.status),
            m.formula,
            m.limitation,
          ]),
        },
        { t: 'src', src: sourceRecord(E.metrics[0]), use: ['Official 2025 DAM price, volume, share and turnover', '官方2025年日前市场价格、交易量、份额及交易额'] },
        { t: 'src', src: sourceRecord(E.metrics[4]), use: ['Official renewable-project administrative funnel', '官方可再生能源项目行政阶段漏斗'] },
      ],
    },
    {
      t: 'card',
      title: ['Capacity and competition coverage', '容量与竞争覆盖'],
      badges: ['verify'],
      blocks: [
        { t: 'sub', text: ['Capacity evidence', '容量证据'] },
        { t: 'p', text: [E.coverage.capacity, '罗马尼亚是单一电能量市场，容量市场收入为N/A；只有取得项目级正式授予后，国家支持才可计入净资本开支。'] },
        { t: 'sub', text: ['Competition evidence', '竞争证据'] },
        { t: 'p', text: [E.coverage.competition, 'ANRE提供全体可再生能源行政漏斗，可反映转化压力，但不是完整储能队列。'] },
      ],
    },
  ];
}

