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
      t: 'g2',
      cards: [
        {
          title: ['Capacity and competition coverage', '容量与竞争覆盖'],
          badges: ['verify'],
          blocks: [
            { t: 'sub', text: ['Capacity evidence', '容量证据'] },
            { t: 'p', text: [E.coverage.capacity, '罗马尼亚是单一电能量市场，容量市场收入为N/A；只有取得项目级正式授予后，国家支持才可计入净资本开支。'] },
            { t: 'sub', text: ['Competition evidence', '竞争证据'] },
            { t: 'p', text: [E.coverage.competition, 'ANRE提供全体可再生能源行政漏斗，可反映转化压力，但不是完整储能队列。'] },
          ],
        },
        {
          title: ['Investment conclusion', '投资结论'],
          badges: ['policy'],
          blocks: [
            { t: 'chip', cls: 'warn', text: [E.conclusion.rating, '选择性机会'] },
            { t: 'p', text: [E.conclusion.text, '只有具备ATR及并网交付证据、备用资格，并能在未获补贴情景下承受下行压力的项目，才可利用罗马尼亚的市场化机会。'] },
            { t: 'note', text: ['Attractiveness remains separate from forecast confidence and from the official evidence classes.', '吸引力继续与预测置信度及官方证据分类分离。'] },
          ],
        },
      ],
    },
    {
      t: 'card',
      title: ['Bear / Base / Bull driver tree — BESS-owner result versus system result', '悲观/基准/乐观驱动树——储能业主结果与系统结果分离'],
      badges: ['forecast', 'calc'],
      live: false,
      blocks: [
        {
          t: 'table',
          head: [['Case', '情景'], ['BESS-owner outcome', '储能业主结果'], ['System outcome', '系统结果'], ['Drivers', '驱动因素']],
          rows: E.scenarios.map((s) => [{ b: [s.case, s.case] }, s.bessOwner, s.system, s.drivers]),
        },
        { t: 'why', text: ['The owner Bull case can be a poor system outcome: dry hydro, expensive fuel and delayed reinforcement increase scarcity. The asset benefits only if it is already connected.', '业主乐观情景可能对应较差的系统结果：枯水、高燃料成本及网架延迟推高稀缺性，而且只有已并网资产才能受益。'], sig: ['Scarcity helps only a connected asset', '稀缺性只利好已并网资产'] },
        {
          t: 'table',
          head: [['Gate', '待建门槛'], ['Required governed input', '所需治理化输入'], ['Output', '输出'], ['Release rule', '放行规则']],
          rows: E.toBuild.map((g) => [{ b: [g.status, g.status] }, g.required, g.output, g.gate]),
        },
      ],
    },
  ];
}

