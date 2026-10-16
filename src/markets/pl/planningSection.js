import {
  PL_OPPORTUNITY_LOGIC,
  PL_QUEUE_COVERAGE,
  PL_SYSTEM_EVOLUTION,
} from './officialData.js';

const gw = (value) => value == null ? 'N/A' : `${value.toLocaleString('en-GB', { maximumFractionDigits: 3 })}<small> GW</small>`;
const twh = (value) => value == null ? 'N/A' : `${value.toLocaleString('en-GB', { maximumFractionDigits: 1 })}<small> TWh</small>`;

export function buildPLPlanningBlocks({ SRC }){
  const system = PL_SYSTEM_EVOLUTION;
  const queue = PL_QUEUE_COVERAGE;
  const opportunity = PL_OPPORTUNITY_LOGIC;
  const confidence = opportunity.confidence;

  return [
    {
      t: 'card',
      title: ['Official system evolution — adopted pathway and planning basis', '官方系统演进——已采纳路径与规划口径'],
      badges: ['official', 'forecast'],
      live: false,
      blocks: [
        {
          t: 'band-story',
          b: ['Authority and coverage', '权威性与覆盖范围'],
          text: [
            `${system.pathway} · ${system.vintage}. ${system.coverage.statement}`,
            '本卡采用已获采纳的NECP WAM情景与PSE 2025—2034输电网发展规划，保留来源定义与版本，不在不同规划年份之间静默插值。',
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
                  { l: ['Storage capacity', '储能容量'], v: gw(point.storageNetCapacityGW), d: [point.source, point.source], b: ['official'] },
                  { l: ['Solar capacity', '光伏容量'], v: gw(point.solarNetCapacityGW), d: [point.basis, '官方规划容量，并非容量市场折减或签约容量'], b: ['official'] },
                  { l: ['Offshore wind', '海上风电'], v: gw(point.offshoreWindNetCapacityGW), d: [point.source, point.source], b: ['official'] },
                  { l: ['Annual demand', '年度需求'], v: twh(point.annualDemandTWh), d: [point.note || 'Not published in this extracted point', point.note || '该提取点未发布'], b: ['official'] },
                ],
              },
              { t: 'note', text: [point.basis, '所有容量均为来源所述的净可用/装机规划容量，不是容量市场折减容量或签约义务。'] },
            ],
          })),
        },
        {
          t: 'note',
          text: [
            `2040 context only: WAM storage ${system.context2040.storageNetCapacityGW} GW, solar ${system.context2040.solarNetCapacityGW} GW and nuclear ${system.context2040.nuclearNetCapacityGW} GW. It is outside the primary 2025–2034 PSE planning rail.`,
            `2040仅作政策背景：WAM储能${system.context2040.storageNetCapacityGW}GW、光伏${system.context2040.solarNetCapacityGW}GW、核电${system.context2040.nuclearNetCapacityGW}GW；不进入PSE 2025—2034主规划时间轴。`,
          ],
        },
        { t: 'src', src: SRC.necpWam, use: ['Adopted WAM capacity pathway for 2025, 2030 and contextual 2040', '已采纳WAM情景中的2025、2030及背景性2040容量路径'] },
        { t: 'src', src: SRC.systemPlan, use: ['PSE 2034 DTS demand, peak and capacity planning evidence', 'PSE 2034 DTS需求、峰值及容量规划证据'] },
      ],
    },
    {
      t: 'card',
      title: ['Storage evidence — connection snapshot, not a complete queue', '储能证据——并网快照，不是完整队列'],
      badges: ['official', 'public'],
      live: false,
      blocks: [
        {
          t: 'g2',
          cards: [
            {
              title: ['Official connection snapshot', '官方并网快照'],
              badges: ['official'],
              blocks: [
                {
                  t: 'kpis',
                  items: [
                    { l: ['Connection agreements', '并网协议'], v: `${queue.knownConnectionSnapshot.connectionAgreementMW.toLocaleString('en-GB')}<small> MW</small>`, d: [`at ${queue.knownConnectionSnapshot.asOf}`, `截至${queue.knownConnectionSnapshot.asOf}`], b: ['official'] },
                    { l: ['Connection conditions', '并网条件'], v: `${queue.knownConnectionSnapshot.connectionConditionsMW.toLocaleString('en-GB')}<small> MW</small>`, d: ['less mature than an executed agreement', '成熟度低于已签署协议'], b: ['official'] },
                  ],
                },
                { t: 'why', text: [queue.knownConnectionSnapshot.basis, '这是PSE储能设施并网容量，并非在运铭牌MW、容量市场折减MW或签约容量义务。'], sig: ['Connection MW ≠ paid obligation MW', '并网MW不等于获付义务MW'] },
              ],
            },
            {
              title: ['Capacity-market evidence basis', '容量市场证据口径'],
              blocks: [
                {
                  t: 'table',
                  head: [['Measure', '指标'], ['Implemented value', '已实现值'], ['Why', '原因']],
                  rows: [
                    [{ b: ['Nameplate awards', '铭牌中标容量'] }, queue.capacityMarketEvidence.nameplateAwardMW.display, queue.capacityMarketEvidence.nameplateAwardMW.reason],
                    [{ b: ['De-rated obligation', '折减后义务'] }, queue.capacityMarketEvidence.deRatedObligationMW.display, queue.capacityMarketEvidence.deRatedObligationMW.reason],
                    [{ b: ['Contracted BESS obligation', '储能签约义务'] }, queue.capacityMarketEvidence.contractedBessObligationMW.display, queue.capacityMarketEvidence.contractedBessObligationMW.reason],
                  ],
                },
                { t: 'chip', cls: 'serious', text: ['Complete public BESS queue: not verified', '完整公开储能队列：未核实'] },
              ],
            },
          ],
        },
        { t: 'p', text: [queue.coverageStatement, '尚未核实存在一个官方公开登记册，可将每个波兰储能项目从并网、许可、融资、建设一直跟踪到运营。'] },
        {
          t: 'table',
          head: [['Source field', '来源字段'], ['Evidence', '证据'], ['Refresh / automation', '更新/自动化']],
          rows: system.provenance.map((source) => [
            { b: [source.owner, source.owner] },
            `${source.freshness} · ${source.machineReadable}`,
            source.automation,
          ]),
        },
        { t: 'src', src: SRC.capacityMarketFinal, use: ['Official final-results route for future reconstruction of auction-vintage nameplate and de-rated BESS obligations', '未来按拍卖版本重构储能铭牌与折减义务的官方最终结果路径'] },
      ],
    },
    {
      t: 'card',
      title: ['Poland opportunity logic — attractiveness is not confidence', '波兰机会逻辑——吸引力不等于置信度'],
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
                { t: 'p', text: [opportunity.attractiveness.statement, '煤电退役、储能增长及容量机制支撑投资逻辑，但项目价值取决于并网证据和对应拍卖版本的经济性。'] },
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
        { t: 'why', text: [`Strongest evidence: ${confidence.strongestEvidence} Largest uncertainty: ${confidence.largestUncertainty}`, `最强证据：${confidence.strongestEvidence} 最大不确定性：${confidence.largestUncertainty}`], sig: ['Do not use confidence as a return score', '不得将置信度当作回报评分'] },
      ],
    },
  ];
}

