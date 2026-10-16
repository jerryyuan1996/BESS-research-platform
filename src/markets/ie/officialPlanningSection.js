import { IE_OFFICIAL_PLANNING as P } from './officialPlanning.js';

const displayValue = (value, unit) => {
  if (value == null) return 'N/A';
  const rendered = Number.isInteger(value)
    ? value.toLocaleString('en-IE')
    : value.toLocaleString('en-IE', { maximumFractionDigits: 1 });
  return `${rendered} ${unit}`;
};

export function ieOfficialPlanningBlocks(){
  return [
    {
      t:'card',
      mt:false,
      title:['Official system evolution — GCS/AIRAA, SOEF and CSO', '官方系统演进 — GCS/AIRAA、SOEF与CSO'],
      badges:['official', 'forecast', 'public'],
      blocks:[
        {
          t:'table',
          head:[
            ['Metric', '指标'],
            ['Authority', '权威性'],
            ...P.years.map(year => year.label),
            ['Definition / coverage', '定义 / 覆盖范围'],
          ],
          num:[2, 3, 4],
          rows:P.series.map(series => [
            { b:series.label },
            series.authority,
            ...series.values.map(value => displayValue(value, series.unit)),
            series.definition,
          ]),
        },
        {
          t:'note',
          b:['Horizon discipline: ', '时间范围纪律：'],
          text:[
            'Today, the 2030 policy horizon and AIRAA’s official 2034 endpoint are named explicitly. AIRAA does not provide a 2035 endpoint, so no 2035 value is interpolated. N/A is a visible coverage state.',
            '明确展示当前、2030政策终点及AIRAA官方终点2034。AIRAA未提供2035终点，因此不插值得出2035数值。N/A是显式的覆盖缺口状态。',
          ],
        },
        {
          t:'table',
          head:[
            ['Official public source', '官方公共来源'],
            ['Vintage / last checked', '版本 / 最近核验'],
            ['Refresh / automation', '更新频率 / 自动化'],
            ['Authority / coverage', '权威性 / 覆盖范围'],
          ],
          rows:P.sources.map(source => [
            { b:[`${source.owner} — ${source.title}`, `${source.owner} — ${source.title}`] },
            `${source.vintage} · checked ${source.checkedAt}`,
            `${source.cadence} · ${source.automation}`,
            `${source.authority} · ${source.coverage}`,
          ]),
        },
        {
          t:'cap',
          text:[
            'Public, fetchable URLs are stored with every source record. Automation grades: A = machine-readable/API, B = stable downloadable table/file, C = governed document extraction.',
            '每条来源记录均保存公开、可获取的URL。自动化等级：A = 机器可读/API，B = 稳定可下载表格/文件，C = 受治理的文件提取。',
          ],
        },
        {
          t:'why',
          text:[
            'This is the official system-need layer, not a project-delivery forecast. Published adequacy and policy horizons can support the direction of the thesis without pretending that unavailable project-level delivery data is known.',
            '这是官方系统需求层，而非项目交付预测。已发布的充足性与政策终点可支持投资逻辑的方向，但不会假装掌握并不存在的项目级交付数据。',
          ],
          sig:['Official direction, explicit gaps', '官方方向，显式缺口'],
        },
      ],
    },
    {
      t:'card',
      title:['Opportunity logic — attractiveness is separate from confidence', '机会逻辑 — 吸引力与预测置信度分开'],
      badges:['official', 'verify'],
      blocks:[
        {
          t:'table',
          head:[
            ['Decision axis', '决策维度'],
            ['Current read', '当前判断'],
            ['Evidence-based rationale', '证据基础'],
          ],
          rows:[
            [
              { b:['Market attractiveness', '市场吸引力'] },
              P.opportunity.attractiveness.label,
              P.opportunity.attractiveness.rationale,
            ],
            [
              { b:['Forecast confidence', '预测置信度'] },
              P.opportunity.forecastConfidence.label,
              P.opportunity.forecastConfidence.rationale,
            ],
            [
              { b:['Thesis invalidation', '投资逻辑失效条件'] },
              ['Monitor explicitly', '必须显式监测'],
              P.opportunity.invalidation,
            ],
          ],
        },
        {
          t:'why',
          text:[
            'Capacity and flexibility value can make an Irish project attractive while incomplete all-island delivery data keeps the competitive forecast at low confidence. The two axes are never blended into one score.',
            '容量与灵活性价值可使爱尔兰项目具备吸引力，而不完整的全岛交付数据使竞争预测保持低置信度。这两个维度不会被混合为一个评分。',
          ],
          sig:['Two axes, two decisions', '两个维度，两项决策'],
        },
      ],
    },
  ];
}

export function ieQueueCoverageBlock(){
  return {
    t:'card',
    mt:false,
    title:['Project pipeline — official coverage boundary', '项目管线 — 官方覆盖边界'],
    badges:['official', 'verify'],
    blocks:[
      {
        t:'warn',
        text:[
          `${P.queueCoverage.status}: ${P.queueCoverage.statement[0]}`,
          `${P.queueCoverage.status}：${P.queueCoverage.statement[1]}`,
        ],
      },
      {
        t:'note',
        b:['Decision rule: ', '决策规则：'],
        text:P.queueCoverage.implication,
      },
      {
        t:'table',
        head:[
          ['Decision output', '决策输出'],
          ['Current status', '当前状态'],
          ['Reason', '原因'],
        ],
        rows:[
          [
            { b:['Complete all-island project MW / MWh', '完整全岛项目MW / MWh'] },
            { chip:'warn', text:['N/A — coverage gap', 'N/A — 覆盖缺口'] },
            ['ROI and NI use separate connection processes; no complete official combined register was verified.', '爱尔兰共和国与北爱尔兰采用不同并网流程；未核实到完整的官方合并登记。'],
          ],
          [
            { b:['Probability-weighted COD pipeline', '概率加权投运管线'] },
            { chip:'warn', text:['N/A — not supportable', 'N/A — 无法支持'] },
            ['Official public sources do not provide a complete finance-to-COD funnel.', '官方公共来源未提供从融资到投运的完整漏斗。'],
          ],
          [
            { b:['Official aggregate evidence', '官方汇总证据'] },
            { chip:'good', text:['Use with scope label', '标注范围后使用'] },
            ['Connection, auction, adequacy and constraint publications may be used within their stated coverage.', '并网、拍卖、充足性与约束发布物可在其明确覆盖范围内使用。'],
          ],
        ],
      },
    ],
  };
}
