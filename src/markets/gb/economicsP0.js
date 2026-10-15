const cmUrl = 'https://www.neso.energy/what-we-do/energy-markets/electricity-market-reform-emr-delivery-body/capacity-market';
const deratingUrl = 'https://www.neso.energy/data-portal/capacity-market-register/capacity_market_de-rating_factors';
const tecUrl = 'https://www.neso.energy/data-portal/transmission-entry-capacity-tec-register/tec_register';
const fesUrl = 'https://www.neso.energy/data-portal/future-energy-scenario-electricity-supply-data-table-es1/electricity_supply_data_table_es1_2025';
const bmrsUrl = 'https://bmrs.elexon.co.uk/';
const balancingCostUrl = 'https://www.neso.energy/document/362561/download';

export const GB_ECONOMICS_P0 = {
  marketId:'gb',
  asOf:'2026-07-29',
  dna:{
    type:['Diversified merchant/BM market with a small CM floor and contractable toll upside','多元市场化/平衡机制市场，辅以较小容量下限及可合同化toll上行'],
    chain:[
      ['Electrification + wind build + thermal/nuclear availability','电气化 + 风电建设 + 火电/核电可用率'],
      ['Boundary constraints + forecast error + scarcity events','输电边界约束 + 预测误差 + 稀缺事件'],
      ['Day-ahead/intraday + BM + ancillary + CM/toll value','日前/日内 + 平衡机制 + 辅助服务 + 容量/toll价值'],
      ['Connection reform + TEC/REPD delivery funnel','并网改革 + TEC/REPD交付漏斗'],
      ['BESS entry + transmission delivery compress service and spread value','BESS进入 + 输电交付压缩服务及价差价值'],
      ['Realised capture → EBITDA → contracted share → debt/exit value','实际捕获 → EBITDA → 合同化占比 → 债务/退出价值'],
    ],
  },
  metrics:[
    {
      id:'gb-t4-price', label:['T-4 2029/30 clearing price','T-4 2029/30出清价格'],
      value:27.10, display:'£27.10/kW/yr', quality:'VERIFIED',
      source:'NESO T-4 2029/30 final auction results', sourceUrl:cmUrl,
      formula:'Published clearing price.',
      limitation:'Applied to de-rated MW, not nameplate MW; individual agreement terms and obligations still govern cash flow.',
    },
    {
      id:'gb-t4-awarded', label:['T-4 2029/30 awarded capacity','T-4 2029/30授予容量'],
      value:40108.608, display:'40,108.608 MW de-rated', quality:'VERIFIED',
      source:'NESO T-4 2029/30 final auction results', sourceUrl:cmUrl,
      formula:'Published auction total.',
      limitation:'All technologies, not BESS-only; it is system procurement rather than a storage addressable pool.',
    },
    {
      id:'gb-four-hour-factor', label:['4h storage de-rating factor, T-4 2029/30','4小时储能折减系数，T-4 2029/30'],
      value:0.4396, display:'43.96%', quality:'VERIFIED',
      source:'NESO Capacity Auction Guidelines, T-4 2029/30, Table 3', sourceUrl:deratingUrl,
      formula:'Published auction-vintage storage factor (Scaled EFC, Rule 2.3.5).',
      limitation:'Auction-vintage specific and applied through CMU/component rules; do not carry it into another auction automatically.',
    },
    {
      id:'gb-four-hour-cm-value', label:['Indicative 4h CM value per nameplate MW','每铭牌MW的4小时容量价值示意'],
      value:11913, display:'£11,913/MW/yr', quality:'DERIVED',
      source:'NESO auction result and de-rating table', sourceUrl:deratingUrl,
      formula:'£27.10/kW/year × 1,000 kW/MW × 43.96% = £11,913/nameplate MW/year.',
      limitation:'Before availability/penalty exposure and not a full BESS revenue stack.',
    },
    {
      id:'gb-tec-built', label:['TEC exact-ESS records marked Built','TEC中标记为Built的精确ESS记录'],
      value:3627.9, display:'3,627.9 MW', quality:'DERIVED',
      source:'NESO TEC Register, normalized 29 Jul 2026', sourceUrl:tecUrl,
      formula:'Deduplicate exact “Energy Storage System” records by Project ID and sum cumulative capacity where status is Built.',
      limitation:'TEC scope differs from total operating GB BESS and may omit distribution-connected assets.',
    },
    {
      id:'gb-fes-current-stock-proxy', label:['FES 2024 network-battery capacity used as stock proxy','用作存量代理的FES 2024网络电池容量'],
      value:6.587378, display:'6.59 GW', quality:'PROXY',
      source:'NESO FES 2025 ES1 — Ten Year Forecast pathway', sourceUrl:fesUrl,
      formula:'Published 2024 network-battery capacity point.',
      limitation:'Scenario-table scope and vintage differ from live operating telemetry; do not reconcile mechanically with TEC Built.',
    },
    {
      id:'gb-balancing-cost-total',
      label:['Total balancing cost, FY2024/25','平衡总成本，2024/25财年'],
      value:2.7, display:'\u00a32.7bn', quality:'VERIFIED',
      source:'NESO Annual Balancing Costs Report 2024/25', sourceUrl:balancingCostUrl,
      formula:'Published financial-year total balancing cost.',
      limitation:'Whole-system balancing cost, not a BESS revenue pool or addressable market; costs include multiple actions, technologies and system needs.',
    },
    {
      id:'gb-thermal-constraint-cost',
      label:['Thermal constraint cost, FY2024/25','热约束成本，2024/25财年'],
      value:1.7, display:'\u00a31.7bn', quality:'VERIFIED',
      source:'NESO Annual Balancing Costs Report 2024/25', sourceUrl:balancingCostUrl,
      formula:'Published financial-year thermal constraint cost.',
      limitation:'System constraint cost, not storage capture. It includes the cost of replacement actions and cannot be converted directly into project revenue.',
    },
    {
      id:'gb-thermal-constraint-share',
      label:['Thermal constraints / total balancing cost','热约束成本 / 平衡总成本'],
      value:1.7 / 2.7 * 100, display:'~63.0%', quality:'DERIVED',
      source:'NESO Annual Balancing Costs Report 2024/25', sourceUrl:balancingCostUrl,
      formula:'\u00a31.7bn / \u00a32.7bn x 100 = 62.96%.',
      limitation:'Ratio of rounded published totals; use it as a scale indicator only, not a precise allocation or forecast.',
    },
  ],
  capacityLogic:{
    chain:[
      ['CMU connection/nameplate capacity','CMU并网/铭牌容量'],
      ['Auction-vintage storage de-rating factor','拍卖年份储能折减系数'],
      ['De-rated capacity with an awarded agreement','获授协议的折减后容量'],
      ['De-rated MW × clearing price; subject to CM obligations','折减后MW × 出清价；受容量义务约束'],
    ],
    formula:'Indicative annual CM value = nameplate MW × de-rating factor × £27.10/kW/year × 1,000.',
    examples:[
      { hours:2, factor:0.2198, valuePerMw:5957, value100Mw:595700 },
      { hours:4, factor:0.4396, valuePerMw:11913, value100Mw:1191300 },
      { hours:8, factor:0.8777, valuePerMw:23786, value100Mw:2378600 },
    ],
    limitation:'The 2h/4h/8h bridge isolates the CM line only. It is not a duration recommendation and excludes merchant/BM capture, penalties, degradation and agreement-specific terms.',
  },
  competition:{
    status:'INCOMPLETE',
    rows:[
      {
        label:['Operating/Built evidence','在运/Built证据'],
        value:'3,627.9 MW', quality:'DERIVED',
        definition:'Exact-ESS TEC records marked Built; transmission-register scope only.',
      },
      {
        label:['Committed BESS total','已承诺BESS总量'],
        value:'N/A', quality:'VERIFIED',
        definition:'No complete official public GB project funnel with connection, planning, finance, construction and duration was verified.',
      },
      {
        label:['Gate 2 forward capacity proxy','Gate 2前瞻容量代理'],
        value:'7,778.4 MW', quality:'PROXY',
        definition:'Exact-ESS TEC Gate 2 forward records; Gate 2 is not finance, construction or energisation.',
      },
      {
        label:['All exact-ESS forward TEC capacity','全部精确ESS前瞻TEC容量'],
        value:'177,195.8 MW', quality:'DERIVED',
        definition:'Includes Gate 1 and unpopulated-gate records; never use as expected delivery.',
      },
    ],
    boundary:'TEC has 0% duration coverage and does not provide a complete distribution-plus-transmission finance-to-COD funnel. REPD can cross-check planning but cannot make the queue complete.',
    source:'NESO TEC Register; DESNZ REPD is a future planning cross-check',
    sourceUrl:tecUrl,
  },
  conclusion:{
    headline:['SELECTIVE — buy realised dispatch and connection certainty, not headline pipeline MW','选择性投资 — 购买实际调度及并网确定性，而非标题式管线MW'],
    text:['The CM provides a modest, duration-sensitive floor; most equity value still depends on realised DA/ID/BM capture or a bankable toll. Connection certainty, dispatch evidence and contracted share therefore dominate generic storage scarcity.','容量市场提供较小且受时长影响的下限；大部分股权价值仍依赖实际日前/日内/平衡机制捕获或可融资toll。因此，并网确定性、调度证据及合同化占比优先于笼统储能稀缺。'],
  },
  scenarios:[
    {
      name:'Bear',
      owner:['Gate 2 projects and network reinforcements deliver quickly; ancillary and BM scarcity rents compress.','Gate 2项目及网络强化快速交付；辅助服务及平衡机制稀缺租金压缩。'],
      system:['More storage and transmission reduce balancing cost and constraint exposure.','更多储能及输电降低平衡成本与约束敞口。'],
      drivers:['Fast BESS delivery','On-time transmission','Lower skip-rate opportunity','Ancillary saturation'],
    },
    {
      name:'Base',
      owner:['FES/CP2030 build broadly progresses, delivery remains selective, and CM plus contracted structures anchor part of revenue.','FES/CP2030建设大致推进，交付保持选择性，容量市场及合同结构锚定部分收入。'],
      system:['Clean-power build raises balancing need while planned network works progressively relieve boundaries.','清洁电力建设提高平衡需求，规划网络工程逐步缓解边界。'],
      drivers:['Official system path','Selective Gate 2 conversion','Moderate reinforcement delay','Partial tolling'],
    },
    {
      name:'Bull',
      owner:['Wind build and thermal tightness outrun reinforcement and deliverable BESS; DA/BM scarcity and toll demand strengthen.','风电建设及火电趋紧快于网络强化及可交付BESS；日前/平衡机制稀缺与toll需求增强。'],
      system:['Constraint and balancing costs rise before network and flexibility catch up.','网络及灵活性赶上前，约束与平衡成本上升。'],
      drivers:['Faster wind/load','Thermal/nuclear outage risk','Network delay','Slow finance-to-COD conversion'],
    },
  ],
  executionGates:[2, 4, 8].map(hours => ({
    hours,
    status:'TO_BUILD',
    metric:`Executable ${hours}h spread and capture rate`,
    requirement:'Governed Elexon half-hourly settlement/BM data joined to unit dispatch, state of charge, losses, availability, degradation, network charges and optimiser fees.',
    currentEvidence:'Existing realised-ratio and spread-bridge seeds are not a governed duration-specific interval backtest.',
    sourceUrl:bmrsUrl,
  })),
};
