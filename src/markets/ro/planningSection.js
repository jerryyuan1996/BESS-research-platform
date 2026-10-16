import {
  RO_OPPORTUNITY_LOGIC,
  RO_QUEUE_COVERAGE,
  RO_SYSTEM_EVOLUTION,
} from './officialData.js';

const na = 'N/A';
const valueOrNA = (value, suffix = '') =>
  value == null ? na : `${Number(value).toLocaleString('en-GB')}${suffix}`;

export function buildROPlanningBlocks({ SRC }){
  const system = RO_SYSTEM_EVOLUTION;
  const queue = RO_QUEUE_COVERAGE;
  const opportunity = RO_OPPORTUNITY_LOGIC;
  const confidence = opportunity.confidence;

  return [
    {
      t: 'card',
      title: ['Official system evolution — named plan years, no invented bridge', '官方系统演进——具名规划年份，不虚构中间值'],
      badges: ['official', 'forecast'],
      live: false,
      blocks: [
        {
          t: 'band-story',
          b: ['Authority and coverage', '权威性与覆盖范围'],
          text: [
            `${system.pathway} · ${system.vintage}. This is an official forecast/planning pathway, not the dashboard house view. ${system.coverage.statement}`,
            '本卡采用Transelectrica官方输电发展规划，保留情景、版本和年份。它是官方规划路径，并非看板自行预测；公开英文摘要未提供三个展示年份可直接比较的全国需求与储能序列。',
          ],
        },
        {
          t: 'g3',
          cards: system.points.map((point) => ({
            title: [point.label, point.label],
            badges: ['official'],
            blocks: [
              {
                t: 'kpis',
                items: [
                  { l: ['National demand', '全国需求'], v: valueOrNA(point.demandTWh, '<small> TWh</small>'), d: ['not published on a comparable basis', '未按可比口径发布'], b: ['official'] },
                  { l: ['Peak demand', '峰值需求'], v: valueOrNA(point.peakDemandGW, '<small> GW</small>'), d: ['not published on a comparable basis', '未按可比口径发布'], b: ['official'] },
                  { l: ['Storage capacity', '储能容量'], v: valueOrNA(point.storageGW, '<small> GW</small>'), d: ['not evidenced in the plan synthesis', '规划摘要未提供证据'], b: ['official'] },
                ],
              },
              { t: 'p', text: [point.evidence, point.evidence] },
            ],
          })),
        },
        {
          t: 'note',
          text: [
            `${system.coverage.rule} The 2030 evidence is therefore a dated reinforcement programme, while 2035 is the official horizon rather than a fabricated capacity point.`,
            '不支持的全国量化指标统一显示N/A，不在规划年份之间插值。2030年的证据是具名且有日期的增容工程，2035年仅作为官方规划终点。',
          ],
        },
        { t: 'src', src: SRC.systemPlan, use: ['Planning years, named reinforcements, authority and source vintage', '规划年份、具名增容工程、权威性及来源版本'] },
      ],
    },
    {
      t: 'card',
      title: ['Public pipeline evidence — useful funnel, incomplete BESS queue', '公开项目证据——漏斗有用，但并非完整储能队列'],
      badges: ['official', 'public'],
      live: false,
      blocks: [
        {
          t: 'g2',
          cards: [
            {
              title: ['What the official snapshot does show', '官方快照能够说明什么'],
              badges: ['official'],
              blocks: [
                {
                  t: 'kpis',
                  items: [
                    { l: ['Valid ATR', '有效ATR'], v: `${queue.knownOfficialFunnel.validAtrGW}<small> GW</small>`, d: ['all renewables · 1 Mar 2026', '所有可再生能源·2026年3月1日'], b: ['official'] },
                    { l: ['Connection contract', '并网合同'], v: `${queue.knownOfficialFunnel.connectionContractGW}<small> GW</small>`, d: ['administrative stage, not operating MW', '行政阶段，并非在运MW'], b: ['official'] },
                    { l: ['Contract + construction permit', '合同+施工许可'], v: `${queue.knownOfficialFunnel.contractAndConstructionPermitGW}<small> GW</small>`, d: ['nested within the funnel', '漏斗内的嵌套阶段'], b: ['official'] },
                    { l: ['Plus ANRE establishment authorisation', '另有ANRE设立许可'], v: `${queue.knownOfficialFunnel.plusAnreEstablishmentAuthorisationGW}<small> GW</small>`, d: ['most advanced reported stage', '已报告的最成熟阶段'], b: ['official'] },
                  ],
                },
              ],
            },
            {
              title: ['What it does not show', '该快照不能说明什么'],
              blocks: [
                { t: 'chip', cls: 'serious', text: ['Complete public BESS queue: not verified', '完整公开储能队列：未核实'] },
                { t: 'p', text: [queue.coverageStatement, '尚未核实存在一个官方公开登记册，可将每个罗马尼亚储能项目从并网、许可、融资、建设一直跟踪到运营。'] },
                { t: 'why', text: [queue.knownOfficialFunnel.basis, '这些全国总量代表连续行政阶段，彼此嵌套，不能相加，也不能当作储能在运规模。'], sig: ['Stage evidence is not delivery evidence', '阶段证据不等于交付证据'] },
              ],
            },
          ],
        },
        {
          t: 'table',
          head: [['Source field', '来源字段'], ['Evidence', '证据'], ['Refresh / automation', '更新/自动化']],
          rows: [
            [{ b: ['Plan provenance', '规划来源'] }, system.provenance.owner, `${system.provenance.freshness} · ${system.provenance.automation}`],
            [{ b: ['Queue coverage', '队列覆盖'] }, queue.provenance.freshness, queue.provenance.automation],
          ],
        },
        { t: 'src', src: SRC.projectFunnel, use: ['Observed renewable-project stage funnel and explicit BESS coverage gap', '可再生能源项目阶段漏斗及明确的储能覆盖缺口'] },
      ],
    },
    {
      t: 'card',
      title: ['Romania opportunity logic — attractiveness is not confidence', '罗马尼亚机会逻辑——吸引力不等于置信度'],
      badges: ['calc', 'policy'],
      live: false,
      blocks: [
        { t: 'flow', items: opportunity.logic.map((item) => [item, item]), sep: '→' },
        {
          t: 'g2',
          cards: [
            {
              title: ['Investment attractiveness', '投资吸引力'],
              badges: ['policy'],
              blocks: [
                { t: 'p', text: [opportunity.attractiveness.statement, '强劲的市场波动与资本支持可能具备吸引力，但前提是项目已经提供并网进展证据，并具备可融资的下行收入结构。'] },
                { t: 'note', text: ['This is an analyst methodology judgement. Automation may not rewrite it.', '这是分析方法判断，自动化流程不得自行改写。'] },
              ],
            },
            {
              title: ['Forecast confidence', '预测置信度'],
              badges: ['calc'],
              blocks: [
                { t: 'chip', cls: 'warn', text: [`${confidence.score}/10 · ${confidence.label}`, `${confidence.score}/10 · 中等`] },
                {
                  t: 'scores',
                  max: 2,
                  items: Object.entries(confidence.dimensions).map(([name, score]) => ({
                    n: [name[0].toUpperCase() + name.slice(1), name],
                    w: 20,
                    s: score,
                  })),
                },
                { t: 'cap', text: [confidence.rubric, '五个维度各0—2分；8—10为高，5—7为中，0—4为低。'] },
              ],
            },
          ],
        },
        { t: 'why', text: [`Strongest evidence: ${confidence.strongestEvidence} Largest uncertainty: ${confidence.largestUncertainty}`, `最强证据：${confidence.strongestEvidence} 最大不确定性：${confidence.largestUncertainty}`], sig: ['Attractive can still be medium-confidence', '有吸引力仍可能只有中等置信度'] },
      ],
    },
  ];
}

