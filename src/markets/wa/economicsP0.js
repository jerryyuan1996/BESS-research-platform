const qedUrl = 'https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed';
const esooUrl = 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo';
const brcpUrl = 'https://www.erawa.com.au/markets/wholesale-electricity-market-effectiveness-reports/price-setting/benchmark-reserve-capacity-prices/2026-benchmark-reserve-capacity-prices-apply-2028-29-capacity-year';

export const WA_ECONOMICS_P0 = {
  marketId:'wa',
  asOf:'2026-07-29',
  dna:{
    type:['Capacity-led; merchant and FCESS upside is already diluting','容量主导；市场化及FCESS上行已开始稀释'],
    chain:[
      ['Load growth + thermal retirement + seven-hour ESR rule','负荷增长 + 火电退役 + 七小时ESR规则'],
      ['Peak/Flexible Reserve Capacity Targets and network deliverability','峰值/灵活备用容量目标及网络可交付性'],
      ['CRC → NAQ → assigned Capacity Credits × RCP','CRC → NAQ → 获配容量信用 × RCP'],
      ['Energy volatility + FCESS as secondary revenue','能源波动 + FCESS作为次要收入'],
      ['Rapid operating BESS entry compresses spread and FCESS value','在运BESS快速增加，压缩价差及FCESS价值'],
      ['Contracted capacity anchor → EBITDA resilience → debt capacity','合同化容量锚 → EBITDA韧性 → 债务承载力'],
    ],
  },
  metrics:[
    {
      id:'wa-brcp-2028-29', label:['2028–29 Peak/Flexible BRCP','2028–29峰值/灵活BRCP'],
      value:488500, display:'A$488,500/MW/yr', quality:'VERIFIED',
      source:'ERA 2026 BRCP final determination', sourceUrl:brcpUrl,
      formula:'Published final determination; no dashboard transformation.',
      limitation:'BRCP is the benchmark new-entry cost, not the RCP actually paid and not a project revenue forecast.',
    },
    {
      id:'wa-operating-bess', label:['Operating WEM BESS, Q1 2026','2026年一季度WEM在运BESS'],
      value:1275, display:'1,275 MW / 5,140 MWh', quality:'VERIFIED',
      source:'AEMO Quarterly Energy Dynamics Q1 2026', sourceUrl:qedUrl,
      formula:'Published discharge capacity and energy stock.',
      limitation:'Quarter-end WEM stock; it does not include an official, complete future connection funnel.',
    },
    {
      id:'wa-average-duration', label:['Average operating duration','平均在运时长'],
      value:5140 / 1275, display:'4.03 h', quality:'DERIVED',
      source:'AEMO Quarterly Energy Dynamics Q1 2026', sourceUrl:qedUrl,
      formula:'5,140 MWh ÷ 1,275 MW = 4.03 hours.',
      limitation:'Fleet-weighted nameplate ratio; it is not usable duration, accreditation or dispatch availability.',
    },
    {
      id:'wa-fcess-revenue', label:['Battery FCESS revenue, Q1 2026','2026年一季度电池FCESS收入'],
      value:4.2, display:'A$4.2m', quality:'VERIFIED',
      source:'AEMO Quarterly Energy Dynamics Q1 2026', sourceUrl:qedUrl,
      formula:'Published quarterly aggregate.',
      limitation:'Whole-fleet quarterly revenue; it is not annualised project revenue and excludes the RCM.',
    },
    {
      id:'wa-spread-compression', label:['Achieved battery price-spread compression YoY','电池已实现价差同比压缩'],
      value:-74.509803922, display:'−74.5%', quality:'DERIVED',
      source:'AEMO Quarterly Energy Dynamics Q1 2026', sourceUrl:qedUrl,
      formula:'(A$13/MWh ÷ A$51/MWh − 1) × 100.',
      limitation:'Quarter-on-quarter seasonality is not removed; this is an observed market signal, not a forward curve.',
    },
    {
      id:'wa-achieved-spread-proxy', label:['Observed battery spread used as merchant proxy','用作市场化代理的电池已实现价差'],
      value:13, display:'A$13/MWh', quality:'PROXY',
      source:'AEMO Quarterly Energy Dynamics Q1 2026', sourceUrl:qedUrl,
      formula:'Published WEM battery discharge-to-charge price spread.',
      limitation:'Not an executable 2h/4h/8h capture rate; it omits project dispatch, degradation, losses, charges and optimiser fees.',
    },
    {
      id:'wa-operating-bess-peak-rct-penetration',
      label:['Operating BESS / 2026-27 Peak RCT','在运BESS / 2026-27峰值RCT'],
      value:1275 / 5720 * 100, display:'22.3%', quality:'PROXY',
      source:'AEMO QED Q1 2026 and 2026 WEM ESOO', sourceUrl:esooUrl,
      formula:'1,275 MW operating BESS / 5,720 MW 2026-27 Peak RCT x 100 = 22.3%.',
      limitation:'Cross-vintage market-saturation proxy only: operating BESS nameplate/discharge capacity is not accredited Peak Capacity Credits and the Peak RCT is a system requirement.',
    },
    {
      id:'wa-committed-bess-peak-rct-penetration',
      label:['Existing + committed BESS / 2028-29 Peak RCT','现有及已承诺BESS / 2028-29峰值RCT'],
      value:1666 / 6323 * 100, display:'26.3%', quality:'PROXY',
      source:'AEMO 2026 WEM ESOO', sourceUrl:esooUrl,
      formula:'1,666 MW existing + committed BESS / 6,323 MW 2028-29 Peak RCT x 100 = 26.3%.',
      limitation:'Nameplate/forecast-classification proxy, not accredited contribution: duration, CRC, NAQ, assigned credits, timing and availability can materially reduce effective capacity.',
    },
    {
      id:'wa-underlying-consumption-cagr',
      label:['Underlying consumption CAGR, 2025-26 to 2035-36','基础用电量复合年增长率，2025-26至2035-36'],
      value:(32.1 / 20.4) ** (1 / 10) - 1, display:'~4.7%/yr', quality:'DERIVED',
      source:'AEMO 2026 WEM ESOO', sourceUrl:esooUrl,
      formula:'(32.1 TWh / 20.4 TWh)^(1/10) - 1 = 4.64% per year.',
      limitation:'Expected-scenario system forecast, not project demand. AEMO notes true underlying consumption for some complex behind-the-meter industrial loads cannot be fully represented.',
    },
    {
      id:'wa-peak-rct-cagr',
      label:['Peak RCT CAGR, 2026-27 to 2035-36','峰值RCT复合年增长率，2026-27至2035-36'],
      value:(7454 / 5720) ** (1 / 9) - 1, display:'~3.0%/yr', quality:'DERIVED',
      source:'AEMO 2026 WEM ESOO', sourceUrl:esooUrl,
      formula:'(7,454 MW / 5,720 MW)^(1/9) - 1 = 2.98% per year.',
      limitation:'Expected-scenario system requirement after DER effects; it is not a forecast of battery awards, BESS revenue or connection capacity.',
    },
  ],
  capacityLogic:{
    chain:[
      ['Registered capability / DSOC','注册能力 / DSOC'],
      ['Certified Reserve Capacity under the applicable ESR duration requirement','按适用ESR时长要求认证备用容量'],
      ['Network Access Quantity','网络接入容量'],
      ['Assigned Peak/Flexible Capacity Credits','获配峰值/灵活容量信用'],
      ['Capacity Credits × actual RCP','容量信用 × 实际RCP'],
    ],
    formula:'Indicative benchmark value = assigned Capacity Credits (MW) × A$488,500/MW/year.',
    example:'100 MW with 100 MW assigned credits implies A$48.85m/year at BRCP.',
    limitation:'The example is DERIVED and deliberately not called revenue: CRC, NAQ, assigned credits, actual RCP, availability obligations and refunds can all reduce cash received. A new 2026-cycle ESR must satisfy the official seven-hour requirement for 2028–29.',
  },
  competition:{
    status:'INCOMPLETE',
    rows:[
      {
        label:['Operating stock, Q1 2026','2026年一季度在运存量'],
        value:'1,275 MW', quality:'VERIFIED',
        definition:'AEMO QED observed WEM discharge capacity.',
      },
      {
        label:['Existing + committed BESS by 2028–29','截至2028–29现有+已承诺BESS'],
        value:'1,666 MW', quality:'VERIFIED',
        definition:'AEMO 2026 WEM ESOO forecast classification.',
      },
      {
        label:['Incremental committed-equivalent build','增量已承诺等价建设量'],
        value:'391 MW', quality:'DERIVED',
        definition:'1,666 MW existing + committed less 1,275 MW Q1 operating stock; vintages differ, so use directionally.',
      },
    ],
    boundary:'No complete official public project-level WA BESS connection-to-COD register was verified. EOI, RCM/CIS and connection publications overlap; they must not be summed into a complete funnel.',
    source:'AEMO QED Q1 2026 and 2026 WEM ESOO',
    sourceUrl:esooUrl,
  },
  conclusion:{
    headline:['SELECTIVE — underwrite the capacity anchor, not a merchant recovery','选择性投资 — 承销容量锚，而非市场化反弹'],
    text:['A deliverable seven-hour asset with evidenced CRC/NAQ and a contracted or RCM-supported floor can remain investable. Energy and FCESS should be equity upside because official Q1 evidence already shows rapid cannibalisation.','具备可交付七小时时长、CRC/NAQ证据及合同化或RCM支撑下限的资产仍可投资。官方一季度证据已显示快速蚕食，因此能源与FCESS应仅作为股权上行。'],
  },
  scenarios:[
    {
      name:'Bear',
      owner:['BESS arrives faster; near-term capacity surplus persists; FCESS and spreads compress further.','BESS投运更快；近期容量盈余延续；FCESS及价差进一步压缩。'],
      system:['More flexible capacity improves reliability and lowers service/energy costs.','更多灵活容量改善可靠性并降低服务/能源成本。'],
      drivers:['Faster committed delivery','Coal retirement delay','Lower volatility','Full network delivery'],
    },
    {
      name:'Base',
      owner:['Official ESOO balance and retirement timing broadly hold; RCM is the floor and merchant lines remain secondary.','官方ESOO容量平衡及退役时点大致兑现；RCM构成下限，市场化收入仍属次要。'],
      system:['Adequacy is met near term and tightens in the 2030s as planned thermal exits occur.','近期充足性达标，并随计划火电退出在2030年代趋紧。'],
      drivers:['Official demand path','Expected thermal exits','Selective BESS delivery','Seven-hour accreditation'],
    },
    {
      name:'Bull',
      owner:['Thermal exits and load arrive before deliverable long-duration BESS; RCP and scarcity value strengthen.','火电退出及负荷增长早于可交付长时BESS；RCP及稀缺价值增强。'],
      system:['Reliability risk and procurement cost rise before replacement capacity connects.','替代容量并网前，系统可靠性风险及采购成本上升。'],
      drivers:['Faster load growth','On-time/early coal exit','Connection delays','Slow accredited BESS delivery'],
    },
  ],
  executionGates:[2, 4, 8].map(hours => ({
    hours,
    status:'TO_BUILD',
    metric:`Executable ${hours}h spread and capture rate`,
    requirement:'Governed WEM dispatch-interval charge/discharge prices, dispatch volumes, losses, availability, cycling/degradation, charges and optimiser fees.',
    currentEvidence:'AEMO’s A$13/MWh Q1 2026 achieved fleet spread is a market proxy only.',
  })),
};
