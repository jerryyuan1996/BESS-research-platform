import { IE_ECONOMICS_P0 as P } from './economicsP0.js';

const qualityChip = quality => ({
  chip:quality === 'VERIFIED' ? 'good' : quality === 'DERIVED' ? 'info' : 'warn',
  text:[quality, quality],
});

export function ieEconomicsP0Blocks(SRC){
  return [
    {
      t:'card',
      mt:false,
      title:['P0 Economics DNA — how all-island scarcity becomes BESS cash flow','P0经济DNA — 全岛稀缺如何转化为BESS现金流'],
      badges:['official', 'calc', 'verify'],
      blocks:[
        { t:'chip', cls:'warn', text:P.dna.type },
        { t:'flow', items:P.dna.chain, strongLast:true },
        {
          t:'why',
          text:[
            'Ireland pays strongly for de-rated dependable capacity, but the investor owns nameplate MW. Duration, MEC/MIC, qualification and delivery are the bridge between the two; energy and future services remain secondary until governed evidence supports them.',
            '爱尔兰对折减后的可靠容量支付较高，但投资者拥有的是铭牌MW。时长、MEC/MIC、资格及交付构成两者之间的桥梁；在受治理证据支持前，能源与未来服务仍属次要。',
          ],
          sig:['Underwrite the bridge to de-rated MW','承销通往折减MW的桥梁'],
        },
      ],
    },
    {
      t:'card',
      title:['Official first-pass economics — VERIFIED, DERIVED and PROXY','官方第一版经济指标 — VERIFIED、DERIVED及PROXY'],
      badges:['official', 'calc'],
      blocks:[
        {
          t:'table',
          head:[
            ['Metric', '指标'],
            ['Value', '数值'],
            ['Class', '分类'],
            ['Formula / official source', '公式 / 官方来源'],
            ['Limitation', '限制'],
          ],
          num:[1],
          rows:P.metrics.map(metric => [
            { b:metric.label },
            metric.display,
            qualityChip(metric.quality),
            `${metric.formula} Source: ${metric.source}.`,
            metric.limitation,
          ]),
        },
        {
          t:'note',
          text:[
            'VERIFIED is directly published official evidence; DERIVED is reproducible arithmetic; PROXY is explicitly non-final and cannot enter a transaction model without the stated replacement.',
            'VERIFIED为官方直接发布证据；DERIVED为可复现计算；PROXY明确为非最终值，在完成所述替换前不得进入交易模型。',
          ],
        },
      ],
      src:SRC.semo,
      srcUse:['SEMO final auction price, awarded capacity and technology-class competition evidence.', 'SEMO最终拍卖价格、授予容量及技术类别竞争证据。'],
    },
    {
      t:'card',
      title:['Capacity accreditation — approved de-rated MW drives cash','容量认证 — 获批折减MW驱动现金流'],
      badges:['official', 'calc', 'verify'],
      blocks:[
        { t:'flow', items:P.capacityLogic.chain },
        {
          t:'table',
          head:[
            ['Duration proxy', '时长代理'],
            ['Unverified factor', '未治理系数'],
            ['100 MW annual CRM proxy', '100MW年度CRM代理'],
            ['Release class', '发布分类'],
          ],
          num:[1, 2],
          rows:P.capacityLogic.proxyExamples.map(example => [
            `${example.hours}h`,
            `${Math.round(example.factor * 100)}%`,
            `€${example.value100Mw.toLocaleString('en-IE')}`,
            qualityChip('PROXY'),
          ]),
        },
        { t:'note', b:['Official formula: ', '官方公式：'], text:[P.capacityLogic.formula, P.capacityLogic.formula] },
        { t:'warn', text:[P.capacityLogic.limitation, P.capacityLogic.limitation] },
      ],
      src:SRC.semo,
      srcUse:['Official awarded de-rated MW and CMU payment prices; duration examples remain gated proxies.', '官方授予折减MW及CMU支付价格；时长示例仍为受限代理。'],
    },
    {
      t:'card',
      title:['Operating vs committed BESS competition — auction evidence within its boundary','在运与已承诺BESS竞争 — 在范围内使用拍卖证据'],
      badges:['official', 'verify'],
      blocks:[
        {
          t:'table',
          head:[
            ['Competition layer', '竞争层'],
            ['MW', 'MW'],
            ['Class', '分类'],
            ['What it actually means', '实际含义'],
          ],
          num:[1],
          rows:P.competition.rows.map(row => [
            { b:row.label },
            row.value,
            qualityChip(row.quality),
            row.definition,
          ]),
        },
        { t:'warn', text:[`${P.competition.status}: ${P.competition.boundary}`, `${P.competition.status}：${P.competition.boundary}`] },
      ],
      src:SRC.semo,
      srcUse:['Existing/new qualified and successful battery de-rated capacity in the 2028/29 T-4 auction.', '2028/29 T-4拍卖中的现有/新增合格及成功电池折减容量。'],
    },
    {
      t:'card',
      title:['Executable spread / capture-rate release gates','可执行价差 / 捕获率发布门槛'],
      badges:['verify'],
      live:true,
      blocks:[
        {
          t:'table',
          head:[
            ['Duration', '时长'],
            ['Status', '状态'],
            ['Required governed evidence', '所需受治理证据'],
            ['Current boundary', '当前边界'],
          ],
          rows:P.executionGates.map(gate => [
            { b:[`${gate.hours}h`, `${gate.hours}小时`] },
            { chip:'warn', text:[gate.status, gate.status] },
            gate.requirement,
            gate.currentEvidence,
          ]),
        },
        { t:'warn', text:['No 2h/4h/8h executable spread or capture-rate output is released until these interval-data gates pass. Existing spread seeds remain outside the investment conclusion.', '在区间数据门槛通过前，不发布任何2小时/4小时/8小时可执行价差或捕获率输出。现有价差种子值不进入投资结论。'] },
      ],
      src:SRC.semo,
      srcUse:['Future governed SEM interval-price and unit-dispatch backtest.', '未来受治理的SEM区间价格及机组调度回测。'],
    },
  ];
}
