import { GB_ECONOMICS_P0 as P } from './economicsP0.js';

const qualityChip = quality => ({
  chip:quality === 'VERIFIED' ? 'good' : quality === 'DERIVED' ? 'info' : 'warn',
  text:[quality, quality],
});

export function gbEconomicsP0Blocks(SRC){
  return [
    {
      t:'card',
      mt:false,
      title:['P0 Economics DNA — how GB system stress becomes BESS cash flow','P0经济DNA — 英国系统压力如何转化为BESS现金流'],
      badges:['official', 'calc', 'verify'],
      blocks:[
        { t:'chip', cls:'warn', text:P.dna.type },
        { t:'flow', items:P.dna.chain, strongLast:true },
        {
          t:'why',
          text:[
            'GB is not a single-revenue market. The investable edge is the conversion from system need into realised dispatch and contracted cash flow after connection, skip-rate and saturation losses — not the size of the storage queue.',
            '英国并非单一收入市场。可投资优势来自系统需求经并网、跳过率及饱和损失后转化为实际调度及合同现金流，而非储能队列规模。',
          ],
          sig:['Realised capture, not theoretical scarcity','实际捕获，而非理论稀缺'],
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
            'VERIFIED = directly stated official observation/rule; DERIVED = transparent arithmetic over official inputs; PROXY = official scoped series used for a narrower decision because the exact project metric is unavailable.',
            'VERIFIED = 官方直接发布的观察值/规则；DERIVED = 对官方输入进行透明计算；PROXY = 在精确项目指标缺失时，将有明确范围的官方序列用于较窄决策。',
          ],
        },
      ],
      src:SRC.cmreg,
      srcUse:['Auction price and awarded de-rated capacity; de-rating values use the linked NESO data table noted in each metric.', '拍卖价格及授予折减容量；折减数值使用各指标注明的NESO数据表。'],
    },
    {
      t:'card',
      title:['Capacity accreditation — nameplate is not paid capacity','容量认证 — 铭牌容量不等于获付容量'],
      badges:['official', 'calc'],
      blocks:[
        { t:'flow', items:P.capacityLogic.chain },
        {
          t:'table',
          head:[
            ['Duration', '时长'],
            ['T-4 2029/30 factor', 'T-4 2029/30系数'],
            ['Value / nameplate MW / yr', '每铭牌MW年价值'],
            ['100 MW example', '100MW示例'],
          ],
          num:[1, 2, 3],
          rows:P.capacityLogic.examples.map(example => [
            `${example.hours}h`,
            `${Math.round(example.factor * 100)}%`,
            `£${example.valuePerMw.toLocaleString('en-GB')}`,
            `£${example.value100Mw.toLocaleString('en-GB')}`,
          ]),
        },
        { t:'note', b:['Formula: ', '公式：'], text:[P.capacityLogic.formula, P.capacityLogic.formula] },
        { t:'warn', text:[P.capacityLogic.limitation, P.capacityLogic.limitation] },
      ],
      src:SRC.derate,
      srcUse:['Auction-vintage storage de-rating and the nameplate-to-paid-capacity bridge.', '拍卖年份储能折减及铭牌至获付容量桥接。'],
    },
    {
      t:'card',
      title:['Operating vs committed BESS competition — coverage boundary first','在运与已承诺BESS竞争 — 覆盖边界优先'],
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
      src:SRC.tec,
      srcUse:['Built and forward exact-ESS TEC aggregates; no duration or complete project-delivery claim.', 'Built及前瞻精确ESS TEC汇总；不声称包含时长或完整项目交付。'],
    },
    {
      t:'card',
      title:['Investment conclusion and Bear / Base / Bull driver tree','投资结论及熊市 / 基准 / 牛市驱动树'],
      badges:['forecast', 'verify'],
      blocks:[
        { t:'reco', b:P.conclusion.headline, text:P.conclusion.text },
        {
          t:'table',
          head:[
            ['Case', '情景'],
            ['BESS-owner perspective', 'BESS业主视角'],
            ['System / consumer perspective', '系统 / 消费者视角'],
            ['Binding drivers', '关键驱动'],
          ],
          rows:P.scenarios.map(scenario => [
            { b:[scenario.name, scenario.name] },
            scenario.owner,
            scenario.system,
            scenario.drivers.join(' · '),
          ]),
        },
        {
          t:'why',
          text:[
            'The BESS-owner and system cases deliberately run in opposite directions: conditions that create scarcity rent for an owner often mean higher balancing and constraint cost for the system.',
            'BESS业主与系统情景刻意采用相反方向：为业主创造稀缺租金的条件，往往意味着系统承担更高的平衡及约束成本。',
          ],
          sig:['Investor bull can be system bear','投资者牛市可能是系统熊市'],
        },
      ],
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
        { t:'warn', text:['No 2h/4h/8h executable spread or capture-rate output is released until these interval-data gates pass. Missing evidence is TO_BUILD, never zero.', '在区间数据门槛通过前，不发布任何2小时/4小时/8小时可执行价差或捕获率输出。缺失证据标记为TO_BUILD，绝不视为零。'] },
      ],
      src:SRC.bmrs,
      srcUse:['Future governed interval-price, imbalance and Balancing Mechanism backtest.', '未来受治理的区间价格、不平衡及平衡机制回测。'],
    },
  ];
}
