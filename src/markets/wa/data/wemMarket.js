/* ---------------------------------------------------------------------------
   WEM market structure - owners, exit routes, long-term holders.
   Verbatim from the prototype (lines 704-781).
   --------------------------------------------------------------------------- */


// ============================================================================
//  WEM MARKET STRUCTURE — who owns WA storage, how capital exits, who holds
//  long term. Compiled from public sources (project announcements, transaction
//  disclosures, CIS awards, AEMO/ERA publications), refreshed July 2026.
// ============================================================================
const WEM_MARKET = {
  records: {
    peakSharePct: 37.2, peakShareDate: '9 May 2026',
    renewShareThatDayPct: 78, renewShareQ1Pct: 46.1,
    rooftopSystems: 564000, rooftopGW: 3.17,
    derBessNowMW: 550, derBessTargetMW: 2300, derBessTargetYear: '2035-36',
  },
  cis: { tender2MW: 650, tender2MWh: 2600, tender2When:'Mar 2025',
    t56Projects: 10, t56GenGW: 1.886, t56StorageGWh: 3.683, t56InvestAbn: 5, t56Jobs: 7000, t56When:'2 May 2026',
    t6BessMW: 482, t6BessMWh: 3683 },
  // Ownership / strategy taxonomy of the WA storage market
  players: [
    { type:['State utility','国有电力'], n:'Synergy', met:'825+ MW / 3,500+ MWh',
      p:['Develop-and-hold for the whole asset life, directly serving the 2030 state coal exit. Moved off conventional EPC to an integrated project-management model to beat supply-chain queues.','开发并全生命周期持有，直接服务2030年州属煤电退出目标。已放弃传统EPC，转向一体化项目管理模式以突破供应链瓶颈。'] },
    { type:['Global IPP','国际IPP'], n:'Neoen / Brookfield', met:'724 MW / 3,145 MWh',
      p:['Scale developer-owner financed on portfolio facilities, not single-project debt. Every WA asset carries a contracted anchor (AEMO capacity contract, CIS or RCM).','规模化开发+持有，依托组合融资而非单项目融资。其西澳资产均带合同化收入锚（AEMO容量合约、CIS或RCM）。'] },
    { type:['Listed developer','上市开发商'], n:'Frontier Energy', met:'82 MW / 565 MWh (St.1)',
      p:['The only ASX-listed pure renewables-and-storage developer, so its Waroona funding stack and revenue build-up are publicly visible — a rare disclosure benchmark for WA.','唯一以新能源与储能为主业的ASX上市公司，其Waroona融资结构与收入构成公开可见 — 西澳罕见的披露基准。'] },
    { type:['Infra platform','基础设施平台'], n:'Atmos / Igneo', met:'100 MW / 400 MWh (Merredin)',
      p:['First WA greenfield storage to reach construction under CIS. Portfolio-level facility plus super-fund equity, refinanced into a green loan within six months of financial close.','西澳首个在CIS框架下进入建设期的绿地储能。采用组合级融资加养老基金股权，融资交割后六个月内再融资为绿色贷款。'] },
    { type:['Greenfield developer','绿地开发商'], n:'BLT Energy', met:'800 MW / 4,800 MWh (approved)',
      p:['Red Gully development approval next to a Western Power terminal — the largest WA storage proposal to date, still unfinanced. Represents the next wave, and the next competitor for credits.','Red Gully紧邻Western Power终端站获开发批准 — 迄今西澳最大储能提案，仍未融资。代表下一波增量，也是下一批容量信用竞争者。'] },
    { type:['OEM / supplier','设备商'], n:['CATL · Trina · BYD','宁德时代 · 天合 · 比亚迪'], met:'2,400 + 2,100 MWh',
      p:['Chinese suppliers are embedded as equipment and increasingly service providers rather than asset owners — CATL supplies Australia’s largest operating BESS; Trina holds a CIS-awarded WA hybrid.','中国厂商主要作为设备并逐步作为服务提供方嵌入，而非资产持有方 — 宁德时代供应澳洲最大在运储能；天合持有获CIS的西澳光储混合项目。'] },
  ],
  concentration: ['Synergy plus Neoen/Brookfield hold the great majority of operating MW. A new entrant competes against a state balance sheet and a global platform, not a fragmented merchant field.',
    'Synergy与Neoen/Brookfield持有绝大多数在运MW。新进入者面对的是国有资产负债表与全球平台，而非分散的市场化竞争者。'],
  // Capital-recycling routes observed across the Australian storage market
  exits: [
    { n:['1 · Develop and sell down','1 · 开发后出售'], w:['Most common route','最常见路径'],
      d:['The developer de-risks to a defined point — capacity or CIS contract awarded, connection approved, or financial close near — then sells to a long-term holder. Price is the DCF of contracted revenue plus a development premium.',
         '开发商将项目去风险至明确节点 — 取得容量或CIS合同、并网获批、或接近融资交割 — 再出售给长期持有方。价格为合同化收入的折现值加开发溢价。'],
      c:['Enervest → Octopus (1.2 GW / 4.8 GWh); CIP → Palisade/Intera (240 MW / 960 MWh, sold after build); Pacific Green → Palisade (250 MW / 500 MWh, ~A$460m)','Enervest→Octopus（1.2GW/4.8GWh）；CIP→Palisade/Intera（240MW/960MWh，建成后出售）；Pacific Green→Palisade（250MW/500MWh，约A$460m）'] },
    { n:['2 · Platform build and stake sale','2 · 平台化建设与股权引入'], w:['Manager-led','管理人主导'],
      d:['Acquire seed operating assets, wrap them in a branded platform, then sell a strategic stake or raise institutional capital against the platform. Recycles capital while retaining management economics.',
         '收购种子运营资产，包装为品牌平台，再出售战略股权或以平台为载体募集机构资金。在保留管理收益的同时回收资本。'],
      c:['HMC Capital: ~A$950m seed portfolio → A$603m strategic investment → rebranded platform with ~650 MW operating and a multi-GW pipeline','HMC Capital：约A$950m种子组合 → A$603m战略投资 → 品牌化平台，约650MW在运及数GW管线'] },
    { n:['3 · Corporate M&A','3 · 公司层面并购'], w:['Founder / PE exit','创始人/PE退出'],
      d:['The whole developer is sold, pricing operating assets and pipeline together. Buyers are global pension and alternative managers seeking a platform rather than single assets.',
         '整体出售开发商，将运营资产与管线一并定价。买方为寻求平台而非单一资产的全球养老金及另类资管机构。'],
      c:['Edify Energy → Canadian pension buyer (~A$1.1bn); Neoen → Brookfield, with Victorian assets divested for ACCC clearance','Edify Energy→加拿大养老金买方（约A$1.1bn）；Neoen→Brookfield，并为通过ACCC审批出售维州资产'] },
    { n:['4 · Refinancing','4 · 再融资'], w:['Post-COD','投运后'],
      d:['Once operating, replace expensive development equity with long-tenor non-recourse debt or a green loan, releasing capital without selling the asset. International banks are now writing 7-year non-recourse paper against storage.',
         '投运后以长期无追索权债务或绿色贷款置换高成本开发期股权，在不出售资产的前提下释放资本。国际银行已开始为储能提供7年期无追索权融资。'],
      c:['A$845m package supporting a 240 MW / 960 MWh acquisition (incl. A$150m 7-year non-recourse); A$1.4bn multi-bank green facility across new-build and existing assets','支持240MW/960MWh收购的A$845m融资包（含A$150m七年期无追索权）；覆盖新建与既有资产的A$1.4bn多银行绿色融资'] },
  ],
  // Implied transaction pricing observed in public disclosures (A$/kWh of installed energy)
  pricing: {
    opSystemLo: 400, opSystemHi: 600,      // operating-asset system-level (DC) valuation range
    acInstalledLo: 550, acInstalledHi: 800, // fully installed AC cost range 2025-26
    cellDeclinePct: 40,                     // battery cost decline over the trailing 12 months
    points: [
      { d:['State-built flagship, 500 MW / 2,400 MWh','国有旗舰，500MW/2,400MWh'], v:'~A$667/kWh', s:['Government investment, self-build','政府投资、自建'] },
      { d:['Late-construction asset, 250 MW / 500 MWh','建设后期资产，250MW/500MWh'], v:'~A$920/kWh', s:['Includes completion expectation','含完工预期'] },
      { d:['Development-stage build cost, 125 MW / 1,000 MWh','开发阶段建设成本，125MW/1,000MWh'], v:'~A$350/kWh', s:['Long-duration, 14-year contract','长时，14年合同'] },
    ],
  },
  // Who ultimately holds the asset, and on what terms
  holders: [
    { k:['State utility','国有电力'], who:['Synergy','Synergy'], hold:['20–25 yr+','20–25年以上'], ret:['Public-service plus cost recovery','公共服务+成本回收'], risk:['Low — government backed','低 — 政府支持'], pref:['Own-state SWIS assets, coal replacement','本州SWIS资产、替代煤电'] },
    { k:['Global infra fund','国际基础设施基金'], who:['Platform managers (HMC/Illuma, Palisade/Intera, Octopus)','平台型管理人'], hold:['10–20 yr','10–20年'], ret:['6–10% unlevered IRR on operating assets','已运营资产6–10%无杠杆IRR'], risk:['Low-to-moderate — contracted revenue','中低 — 依赖合同化收入'], pref:['Operating or near-operating, contracted','已运营或接近运营且已签约'] },
    { k:['Pension / super fund','养老与超级年金'], who:['APG, Cbus, Aware Super, HESTA, Rest, Hostplus, La Caisse, sovereign funds','APG、Cbus、Aware Super、HESTA、Rest、Hostplus、La Caisse、主权基金'], hold:['Indirect, long-dated','间接、长期'], ret:['Delivered through fund platforms','通过基金平台实现'], risk:['Low — accessed via managers','低 — 经管理人进入'], pref:['Long contracted cash flow, diversified','长期合同化现金流、分散配置'] },
    { k:['Renewables IPP','新能源IPP'], who:['Neoen/Brookfield, Akaysha/BlackRock','Neoen/Brookfield、Akaysha/BlackRock'], hold:['15–25 yr','15–25年'], ret:['8–12% project IRR','项目IRR 8–12%'], risk:['Moderate — develop and operate','中 — 开发+运营'], pref:['Whole-of-life ownership at scale','规模化全生命周期持有'] },
    { k:['Industrial self-supply','工业自用'], who:['Resources majors (Pilbara, off-SWIS)','资源类企业（Pilbara，非SWIS）'], hold:['Project life','项目生命周期'], ret:['Diesel and gas cost avoided','替代柴油与燃气的成本节省'], risk:['Low — behind the meter','低 — 自用为主'], pref:['Off-grid / NWIS, not WEM capacity','离网/NWIS，不参与WEM容量'] },
  ],
  superFundNote: ['Pension capital is the terminal buyer, but it buys through infrastructure-fund platforms and it buys contracted, operating or near-operating risk. That sets the exit specification for anyone developing in WA today: a long-dated contracted or floor-supported revenue line, deliverable capacity, and an operating track record — not a merchant thesis.',
  '养老金资本是最终买家，但其通过基础设施基金平台买入，且只买已签约、已运营或接近运营的风险。这为今天在西澳开发的任何主体设定了退出规格：长期合同或保底支撑的收入、可交付容量、以及运营业绩记录 — 而非市场化押注。'],
  uncertainties: [
    ['Coal-exit timing','煤电退出时点', 'Storage value in an islanded grid depends on the state coal retirement schedule actually being executed; slippage defers the structural capacity deficit and extends the surplus period.', '孤立电网中储能价值取决于州属煤电退役计划能否如期执行；延后将推迟结构性容量缺口并延长盈余期。'],
    ['Revenue-mix migration','收入结构迁移', 'Battery income has shifted from ancillary-service scarcity toward energy arbitrage, which is the more volatile and more contestable of the two — the stable-looking history is not the forward distribution.', '电池收入已从辅助服务稀缺转向电能量套利，而后者波动更大、更易被竞争摊薄 — 看似稳定的历史并非前瞻分布。'],
    ['Supply-chain concentration','供应链集中度', 'Chinese suppliers dominate on cost, which is why installed costs keep falling; the same concentration is a single-jurisdiction dependency for warranties, spares and augmentation over a 20-year life.', '中国厂商在成本上占主导，这也是安装成本持续下降的原因；但同一集中度在20年寿命内构成质保、备件与增容的单一司法辖区依赖。'],
  ],
};

export { WEM_MARKET };
