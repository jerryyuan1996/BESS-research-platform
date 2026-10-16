import { JP_ECONOMICS } from './economicsData.js';

const sourceRecord = (metric) => ({
  file: `${metric.source.owner} — ${metric.label}`,
  status: ['Official public source', '官方公开来源'],
  date: metric.source.vintage,
  cy: `${metric.status} · ${metric.authority}`,
  url: metric.source.url,
});

export function buildJPEconomicsBlocks(){
  const E = JP_ECONOMICS;
  const regions = Object.values(E.regions);
  return [
    {
      t: 'card',
      title: ['Economics DNA — one national rulebook, three regional value engines', '经济性DNA——一套全国规则，三个区域价值引擎'],
      badges: ['official', 'calc'],
      live: false,
      blocks: [
        { t: 'chip', cls: 'info', text: [E.dna.label, '全国市场可选性+区域价格捕获+场址可交付性'] },
        { t: 'flow', items: E.dna.driverChain.map((x) => [x, x]), sep: '→' },
        { t: 'g3', cards: regions.map((r) => ({
          title: [r.label, r.label],
          badges: [`jp-${r.id}`],
          blocks: [
            { t: 'p', text: [r.dna, r.dna] },
            { t: 'chip', cls: 'warn', text: [r.conclusion, r.conclusion] },
          ],
        })) },
        { t: 'why', text: [E.dna.ownerRule, '容量价格属于官方市场证据，但业主付款仍取决于中标的期待容量；LTDA其他市场收入返还规则也禁止把全部长期付款与全部市场化收入叠加。'], sig: [E.architecture.rulebook, '一套全国规则'] },
      ],
    },
    {
      t: 'card',
      title: ['Governed first pass — official capacity economics and regional proxies', '治理化第一版——官方容量经济性与区域代理指标'],
      badges: ['official', 'public'],
      live: false,
      blocks: [
        {
          t: 'table',
          head: [['Area', '区域'], ['2029 price', '2029价格'], ['Contracted capacity', '签约容量'], ['Official pool value', '官方池价值'], ['Curtailment proxy', '弃电代理'], ['Study cap proxy', '接入研究上限代理']],
          rows: regions.map((r) => [
            { b: [r.label, r.label] },
            `${r.capacityPriceJPYkWYr.toLocaleString('en-GB')} JPY/kW/yr · VERIFIED`,
            `${r.contractedCapacityGW.toFixed(3)} GW · VERIFIED`,
            `${r.capacityPoolJPYbn.toFixed(3)} JPY bn · VERIFIED`,
            `${r.curtailmentDays} days · PROXY`,
            `${r.studyCap} · PROXY`,
          ]),
        },
        {
          t: 'table',
          head: [['Metric', '指标'], ['Value', '数值'], ['Class', '分类'], ['Formula', '公式'], ['Limitation', '局限']],
          rows: E.nationalMetrics.map((m) => [
            { b: [m.label, m.label] },
            `${m.display} ${m.unit}`,
            { chip: m.status === 'VERIFIED' ? 'good' : 'info', text: [m.status, m.status] },
            m.formula,
            m.limitation,
          ]),
        },
        { t: 'src', src: sourceRecord(E.nationalMetrics[0]), use: ['OCCTO FY2029 price, contracted capacity and pool value', 'OCCTO FY2029价格、签约容量及池价值'] },
        { t: 'note', text: [E.architecture.onlineOfflineLogic, '保留已核实的online/offline品种准入逻辑；不得添加笼统的“online溢价”。'] },
      ],
    },
    {
      t: 'card',
      title: ['Capacity and competition coverage', '容量与竞争覆盖'],
      badges: ['verify'],
      blocks: [
        { t: 'sub', text: ['Capacity evidence', '容量证据'] },
        { t: 'p', text: [E.coverage.capacity, 'OCCTO覆盖市场级区域价格、容量及池价值；本第一版尚未拆分储能专属中标期待容量。'] },
        { t: 'sub', text: ['Competition evidence', '竞争证据'] },
        { t: 'p', text: [E.coverage.competition, '弃电天数、研究上限、已披露项目及北海道队列/注册信号均为部分代理；尚无完整全国储能公开队列。'] },
      ],
    },
  ];
}

