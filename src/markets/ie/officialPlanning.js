/*
 * Market-local evidence contract for the all-island SEM planning view.
 * Null is a deliberate coverage state. Values are never silently interpolated
 * between the GCS/AIRAA, SOEF, CSO and project-publication horizons.
 */
export const IE_OFFICIAL_PLANNING = {
  id:'ie-official-system-evolution',
  title:['Official system evolution — GCS/AIRAA, SOEF and CSO','官方系统演进 — GCS/AIRAA、SOEF及CSO'],
  years:[
    { key:'today', label:['Today · 2025 actual / 2026 status','当前 · 2025实际 / 2026状态'] },
    { key:'2030', label:['2030 · SOEF policy horizon','2030 · SOEF政策终点'] },
    { key:'end', label:['Official end · AIRAA 2034','官方终点 · AIRAA 2034'] },
  ],
  series:[
    {
      id:'ie-data-centre-electricity', label:['Data-centre metered electricity','数据中心计量用电'], unit:'GWh',
      authority:'observed', sourceId:'ie-cso-data-centres-2025',
      values:[7663, null, null],
      definition:['CSO calendar-2025 observation; no official like-for-like 2030/2034 series is inserted here','CSO 2025日历年观察值；此处不填入非同口径2030/2034序列'],
    },
    {
      id:'ie-snsp-limit', label:['SNSP operating limit / policy direction','SNSP运行上限 / 政策方向'], unit:'%',
      authority:'official-forecast', sourceId:'ie-eirgrid-soef',
      values:[75, 95, null],
      definition:['Today is the current operating limit; 2030 is a policy direction, not guaranteed operation','当前值为运行上限；2030为政策方向，并非保证运行值'],
    },
    {
      id:'ie-storage-ambition', label:['Storage ambition','储能目标'], unit:'MW',
      authority:'official-forecast', sourceId:'ie-eirgrid-soef',
      values:[null, 2000, null],
      definition:['2030 ambition only; no complete official operating-stock series or 2034 target is shown','仅为2030目标；未显示完整官方在运存量序列或2034目标'],
    },
    {
      id:'ie-adequacy-outlook', label:['All-island adequacy requirement / surplus','全岛充足性要求 / 余额'], unit:'MW',
      authority:'official-forecast', sourceId:'ie-airaa-2025-2034',
      values:[null, null, null],
      definition:['AIRAA publishes the official outlook to 2034, but no unverified table values are transcribed; coverage is visible as N/A rather than fabricated','AIRAA发布至2034年的官方展望，但此处不转录未经核验的表格值；以N/A显示覆盖缺口而非虚构数值'],
    },
    {
      id:'ie-interconnection', label:['Operational / planned interconnection','在运 / 规划互联能力'], unit:'MW',
      authority:'derived-observed', sourceId:'ie-eirgrid-interconnection',
      values:[1500, 2200, 2200],
      definition:['Transparent sum of published project ratings: Moyle 500 + EWIC 500 + Greenlink 500; Celtic adds 700 by its project milestone. This is not availability or firm import.','公开项目额定值透明加总：Moyle 500 + EWIC 500 + Greenlink 500；Celtic按项目里程碑增加700。该值不代表可用率或可靠受入。'],
    },
  ],
  sources:[
    {
      id:'ie-airaa-2025-2034', owner:'EirGrid and SONI',
      title:'All-Island Resource Adequacy Assessment 2025–2034',
      url:'https://cms.eirgrid.ie/sites/default/files/publications/AIRAA-2025-2034.pdf',
      vintage:'AIRAA 2025–2034', publishedAt:'2025', checkedAt:'2026-07-29',
      cadence:'Annual', automation:'C', authority:'official-forecast',
      coverage:'All-island adequacy outlook to 2034; use 2034, never interpolate a 2035 point',
    },
    {
      id:'ie-eirgrid-soef', owner:'EirGrid',
      title:'Shaping Our Electricity Future Roadmap',
      url:'https://cms.eirgrid.ie/shaping-our-electricity-future-roadmap',
      vintage:'Current roadmap', publishedAt:'Periodic', checkedAt:'2026-07-29',
      cadence:'Periodic', automation:'C', authority:'official-forecast',
      coverage:'Grid transformation and renewable-integration policy milestones to 2030',
    },
    {
      id:'ie-cso-data-centres-2025', owner:'Central Statistics Office Ireland',
      title:'Data Centres Metered Electricity Consumption 2025',
      url:'https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/',
      vintage:'Calendar 2025', publishedAt:'2026', checkedAt:'2026-07-29',
      cadence:'Annual', automation:'A/B', authority:'observed',
      coverage:'Annual metered electricity consumption, 2015–2025',
    },
    {
      id:'ie-eirgrid-interconnection', owner:'EirGrid and SONI',
      title:'Interconnection and project publications',
      url:'https://www.eirgrid.ie/industry/interconnection',
      vintage:'Current project status', publishedAt:'Periodic', checkedAt:'2026-07-29',
      cadence:'Project milestone', automation:'C', authority:'derived-observed',
      coverage:'Published project ratings and status; not hourly availability or firm import',
    },
  ],
  queueCoverage:{
    status:'INCOMPLETE',
    label:['Complete-queue gap','完整队列缺口'],
    statement:[
      'No single complete official all-island BESS funnel through connection, planning, finance, construction and COD was verified. ROI and NI have separate operators and connection processes; financing status is rarely official/public.',
      '尚未核实到覆盖并网、规划、融资、施工及投运日期的单一完整全岛官方BESS漏斗。爱尔兰共和国与北爱尔兰具有不同运营商及并网流程，融资状态通常并非官方公开数据。',
    ],
    implication:[
      'The existing seed project register must not drive pipeline MW, COD distributions or competition scores. Official aggregate connection, auction and constraint evidence can be shown; complete project-level MW/MWh and delivery probabilities remain N/A.',
      '现有种子项目登记不得驱动管线MW、投运分布或竞争评分。可显示官方汇总并网、拍卖及约束证据；完整项目级MW/MWh及交付概率保持N/A。',
    ],
  },
  opportunity:{
    attractiveness:{
      label:['Selective — capacity and flexibility value','选择性 — 容量及灵活性价值'],
      rationale:[
        'High de-rated capacity value, rising data-centre demand and physical wind constraints support storage, while added interconnection and system-service competition compress merchant and ancillary upside.',
        '高折减容量价值、上升的数据中心负荷及风电物理约束支持储能；新增互联及系统服务竞争则压缩市场化与辅助服务上行。',
      ],
    },
    forecastConfidence:{
      label:['Medium for system direction; low for complete competitive delivery','系统方向为中等置信；完整竞争交付为低置信'],
      rationale:[
        'Official GCS/AIRAA/SOEF publications establish the planning horizons, but there is no complete public BESS delivery register and several exact series remain N/A pending governed extraction.',
        '官方GCS/AIRAA/SOEF确定了规划终点，但不存在完整公开BESS交付登记，且多项精确序列在受治理提取前保持N/A。',
      ],
    },
    invalidation:[
      'Interconnection and network delivery reduce constraints faster than capacity/adequacy and data-centre growth create storage value.',
      '互联及网络交付缓解约束的速度快于容量/充足性及数据中心增长创造储能价值的速度。',
    ],
  },
};
