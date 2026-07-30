/*
 * Market-local evidence contract for the WA system-planning view.
 * Null means the cited official publication does not provide an extracted,
 * like-for-like value for that display year. No interpolation is permitted.
 */
export const WA_OFFICIAL_PLANNING = {
  id:'wa-official-system-evolution',
  title:['Official system evolution — 2026 WEM ESOO','官方系统演进 — 2026年WEM ESOO'],
  years:[
    { key:'today', label:['Today · 2026 Q1','当前 · 2026年一季度'] },
    { key:'2030', label:['2030 · Capacity Year 2030–31','2030 · 2030–31容量年度'] },
    { key:'end', label:['Official end · 2035–36','官方终点 · 2035–36'] },
  ],
  series:[
    {
      id:'wa-peak-rct', label:['Peak Reserve Capacity Target','峰值备用容量目标'], unit:'MW',
      authority:'official-forecast', sourceId:'wa-aemo-esoo-2026',
      values:[null, 6644, 7454],
      definition:['AEMO planning requirement for the relevant Capacity Year','AEMO对相关容量年度的规划要求'],
    },
    {
      id:'wa-existing-committed-balance', label:['Existing + committed balance vs Peak RCT','现有+已承诺容量相对峰值RCT余额'], unit:'MW',
      authority:'official-forecast', sourceId:'wa-aemo-esoo-2026',
      values:[null, -207, -2161],
      definition:['Positive = surplus; negative = shortfall. This is not a price forecast.','正值=盈余；负值=缺口。该指标不是价格预测。'],
    },
    {
      id:'wa-anticipated-balance', label:['Balance including anticipated projects','含预期项目后的容量余额'], unit:'MW',
      authority:'official-forecast', sourceId:'wa-aemo-esoo-2026',
      values:[null, 454, -1565],
      definition:['AEMO anticipated-project case; not committed capacity or a delivery forecast','AEMO预期项目情景；并非已承诺容量或交付预测'],
    },
    {
      id:'wa-operating-bess', label:['Operating grid-scale BESS','在运大型电池储能'], unit:'MW',
      authority:'observed', sourceId:'wa-aemo-qed-q1-2026',
      values:[1275, null, null],
      definition:['Observed Q1 2026 stock; the ESOO display years do not publish the same extracted operating-stock series','2026年一季度观察值；ESOO展示年份未提供同口径在运存量序列'],
    },
    {
      id:'wa-consumption', label:['Annual electricity consumption','年度用电量'], unit:'TWh',
      authority:'official-forecast', sourceId:'wa-aemo-esoo-2026',
      values:[null, null, 32.1],
      definition:['Only the verified 2035–36 value is shown; other cells remain N/A','仅显示已核验的2035–36数值；其他单元格保持N/A'],
    },
  ],
  sources:[
    {
      id:'wa-aemo-esoo-2026', owner:'Australian Energy Market Operator',
      title:'2026 WEM Electricity Statement of Opportunities and Data Register',
      url:'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo',
      vintage:'2026 WEM ESOO', publishedAt:'2026-07-15', checkedAt:'2026-07-29',
      cadence:'Annual', automation:'B/C', authority:'official-forecast',
      coverage:'Capacity Years 2028–29 to 2035–36; ten-year reliability outlook',
    },
    {
      id:'wa-aemo-qed-q1-2026', owner:'Australian Energy Market Operator',
      title:'Quarterly Energy Dynamics — Q1 2026',
      url:'https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed',
      vintage:'Q1 2026', publishedAt:'2026-04-30', checkedAt:'2026-07-29',
      cadence:'Quarterly', automation:'B', authority:'observed',
      coverage:'Observed market and system outcomes through Q1 2026',
    },
  ],
  queueCoverage:{
    status:'INCOMPLETE',
    label:['Complete-queue gap','完整队列缺口'],
    statement:[
      'No complete official public project-level WA BESS connection register with owner, MW, MWh, stage and COD was verified. AEMO EOI/CIS/RCM publications and Western Power connection insights are overlapping subsets, not one complete delivery funnel.',
      '尚未核实到同时包含业主、MW、MWh、阶段及投运日期的完整西澳官方公开BESS并网登记。AEMO EOI/CIS/RCM发布及Western Power并网洞察为相互重叠的子集，并非完整交付漏斗。',
    ],
    implication:[
      'Do not convert announced MW or the private financing register into a market-wide delivery probability. Use official aggregate awards and capacity balances, and show project-level competition as N/A until entity resolution is complete.',
      '不可将公告MW或私人融资登记转化为全市场交付概率。应采用官方汇总授标及容量平衡；在完成实体匹配前，项目级竞争应显示N/A。',
    ],
  },
  opportunity:{
    attractiveness:{
      label:['Selective — timing-led capacity opportunity','选择性 — 时点主导的容量机会'],
      rationale:[
        'Official ESOO balances move from a modest 2030–31 shortfall to a much larger 2035–36 shortfall, supporting long-duration capacity value if the asset survives the near-term surplus and secures credits.',
        '官方ESOO容量余额由2030–31的小幅缺口转为2035–36的较大缺口；若资产能跨越近期盈余并取得容量信用，长时容量价值获得支持。',
      ],
    },
    forecastConfidence:{
      label:['Medium-high for official capacity need; low for complete competitive delivery','官方容量需求为中高置信；完整竞争交付为低置信'],
      rationale:[
        'AEMO publishes an annual ten-year outlook and downloadable register, but the public project-level connection funnel is incomplete and future project delivery is not observed.',
        'AEMO每年发布十年展望及可下载登记，但公开项目级并网漏斗不完整，未来项目交付尚不可观察。',
      ],
    },
    invalidation:[
      'Anticipated projects commission earlier than assumed and keep the capacity balance inside the pricing deadband.',
      '预期项目较假设更早投运，使容量平衡持续位于定价死区间内。',
    ],
  },
};
