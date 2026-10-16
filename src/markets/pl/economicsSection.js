import { PL_ECONOMICS } from './economicsData.js';

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

export function buildPLEconomicsBlocks(){
  const E = PL_ECONOMICS;
  return [
    {
      t: 'card',
      title: ['Economics DNA — what creates and captures Polish BESS value', '经济性DNA——波兰储能价值如何形成与捕获'],
      badges: ['official', 'calc'],
      live: false,
      blocks: [
        { t: 'chip', cls: 'info', text: [E.dna.label, '容量保障合约+市场波动，并受并网和拍卖版本约束'] },
        { t: 'flow', items: E.dna.driverChain.map((x) => [x, x]), sep: '→' },
        { t: 'why', text: [E.dna.ownerRule, '容量市场收入=出清价×中标后的折减义务容量，绝不能用出清价直接乘以储能铭牌MW。'], sig: ['Paid obligation, not nameplate', '按义务容量付费，而非铭牌容量'] },
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
        { t: 'src', src: sourceRecord(E.metrics[0]), use: ['Final 2030 auction price and obligation totals', '2030年最终拍卖价格及义务总量'] },
        { t: 'src', src: sourceRecord(E.metrics[2]), use: ['Connection refusal pressure and duplicate-application caveat', '并网拒绝压力及重复申请口径说明'] },
        { t: 'src', src: sourceRecord(E.metrics[4]), use: ['Storage connection agreement and condition capacity', '储能并网协议及并网条件容量'] },
      ],
    },
    {
      t: 'card',
      title: ['Capacity and competition coverage', '容量与竞争覆盖'],
      badges: ['verify'],
      blocks: [
        { t: 'sub', text: ['Capacity evidence', '容量证据'] },
        { t: 'p', text: [E.coverage.capacity, '已覆盖官方市场价格与义务总量；仍须按拍卖版本重构储能铭牌、折减义务及合同期限。'] },
        { t: 'sub', text: ['Competition evidence', '竞争证据'] },
        { t: 'p', text: [E.coverage.competition, 'PSE并网协议/条件及URE拒绝数据仅为压力代理；尚无覆盖建设至运营的完整公开储能队列。'] },
      ],
    },
  ];
}

