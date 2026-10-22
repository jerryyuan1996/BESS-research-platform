/** Public reference assumptions, approved for indicative screening on 19 Oct 2026.
 * Source facts and house sensitivities are distinct. None is a project quote. */
export const REFERENCE_DATE = '2026-10-23';
export const REFERENCE_SOURCES = {
  life:{label:['NREL: battery life and operating-cost framework','NREL：电池寿命与运营成本框架'],url:'https://atb-archive.nrel.gov/electricity/2020/index.php?t=st'},
  queue:{label:['Berkeley Lab: connection delays and withdrawals','伯克利实验室：并网等待与项目退出'],url:'https://emp.lbl.gov/queues'},
  retirement:{label:['NYSERDA: dismantling, recycling and site restoration','NYSERDA：拆除、回收与场地恢复'],url:'https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Clean-Energy-Siting/Decommissioning-and-End-of-Life-Considerations.pdf'},
  fx:{label:['ECB exchange rates, 16 October 2026','欧洲央行汇率，2026年10月16日'],url:'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'},
  au:{label:['Australian Taxation Office: company tax','澳大利亚税务局：公司税'],url:'https://www.ato.gov.au/tax-rates-and-codes/company-tax-rates'},
  gb:{label:['UK: corporation tax','英国：公司税'],url:'https://www.gov.uk/corporation-tax-rates'},
  de:{label:['Germany Trade & Invest: corporate taxation','德国联邦外贸与投资署：企业税'],url:'https://www.gtai.de/en/invest/investment-guide/corporate-taxation-in-germany'},
  it:{label:['Invest in Italy: IRES and IRAP','意大利投资署：所得税与地区生产税'],url:'https://www.investinitaly.gov.it/en/doing-business/taxation'},
  ie:{label:['Irish Revenue: trading-income tax','爱尔兰税务局：经营所得税'],url:'https://www.revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/basis-of-charge.aspx'},
  pillar2:{label:['Irish Revenue: minimum tax for large groups','爱尔兰税务局：大型集团最低税'],url:'https://www.revenue.ie/en/companies-and-charities/pillar-two/index.aspx'},
  pl:{label:['Poland: corporate-income tax rates','波兰：企业所得税率'],url:'https://www.podatki.gov.pl/en/corporate-income-tax/tax-rates/'},
  ro:{label:['Romanian Tax Administration: tax code','罗马尼亚税务局：税法'],url:'https://static.anaf.ro/static/10/Anaf/legislatie/Cod_fiscal_norme_2023.htm'},
  jp:{label:['JETRO: national and local corporate taxes','日本贸易振兴机构：国家及地方企业税'],url:'https://www.jetro.go.jp/en/invest/setting_up/section3/page3.html'},
  us:{label:['IRS: corporate income tax','美国国税局：企业所得税'],url:'https://www.irs.gov/publications/p542'},
  ca:{label:['California: business tax rates','加利福尼亚州：企业税率'],url:'https://www.ftb.ca.gov/file/business/tax-rates.html'},
  tx:{label:['Texas: franchise tax','得克萨斯州：特许经营税'],url:'https://comptroller.texas.gov/taxes/franchise/'},
  fi:{label:['Finnish Tax Administration: company income tax','芬兰税务局：企业所得税'],url:'https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/limited-companies-and-cooperatives/income-tax/'},
  inflation:{label:['ECB: inflation and nominal interest rates','欧洲央行：通胀与名义利率'],url:'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me/html/nominal_and_real_interest_rates.en.html'},
  taxMethod:{label:['UK capital allowances: depreciation tax relief depends on eligibility','英国资本扣除：折旧抵税须满足适用条件'],url:'https://www.gov.uk/capital-allowances/full-expensing'},
  returnCalibration:{label:['Gore Street FY2025: valuation rates and project differences','Gore Street 2025年报：估值利率与项目差异'],url:'https://www.gsenergystoragefund.com/content/news/archive/2025/170725.asp'},
  cis:{label:['DCCEEW: project-specific CIS revenue underwriting','澳洲能源部：按项目约定的CIS收入保障'],url:'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/open-cis-tenders/information-for-cisa-holders'},
  reserve:{label:['Fingrid: separate yearly and hourly reserve procurement','Fingrid：年度与小时级备用市场'],url:'https://www.fingrid.fi/en/electricity-market/reserves_and_balancing/'},
  itc:{label:['IRS: clean electricity investment credit eligibility','美国国税局：清洁电力投资抵免适用条件'],url:'https://www.irs.gov/credits-deductions/clean-electricity-investment-credit'},
};

// [lower, upper] tax proxies applied to positive operating cash before capex.
// No depreciation, interest relief, loss offsets, subsidies or future tax cuts.
const tax=(rates,sources,extra={})=>({taxRates:rates,sourceIds:sources,...extra});
export const MARKET_REFERENCE = {
  wa:tax([.30,.30],['au'],{greenfieldYears:[49/12,61/12],rtbYears:[1,1.5]}),nem:tax([.30,.30],['au']),gb:tax([.25,.25],['gb']),
  de:tax([.30,.33],['de']),it:tax([.279,.2882],['it']),
  ie:tax([.125,.15],['ie','pillar2'],{saleTaxRate:.33}),
  pl:tax([.19,.19],['pl','fx'],{currency:'PLN',unitsPerEUR:4.37}),
  ro:tax([.16,.16],['ro','fx'],{currency:'RON',unitsPerEUR:5.331,greenfieldYears:[44/12,56/12],rtbYears:[.75,1.25]}),
  jp_tokyo:tax([.3064,.35],['jp']),jp_kyushu:tax([.3064,.35],['jp']),jp_hokkaido:tax([.3064,.35],['jp']),
  pjm:tax([.21,.31],['us'],{usQueue:true}),
  ercot:tax([.21,.21],['us','tx'],{usQueue:true,turnoverTax:.0075}),
  caiso:tax([.279836,.279836],['us','ca'],{usQueue:true}),
  fi:tax([.20,.20],['fi']),
};

export const REFERENCE_CASES = [
  {id:'cautious',label:['Cautious case','偏保守情景'],revenueFactor:.8,opexFactor:1.1,
    buildFactor:1.15,gridReserve:.10,developmentShare:.05,retirementShare:.05,
    refurbishmentShare:.03,operatingAge:3,rtbYears:2,greenfieldYears:4,success:.5,
    usGreenfieldYears:6,usSuccess:.25,extraPremium:0,lifeYears:15,taxYears:15,reserveNet:0},
  {id:'base',label:['Reference case','基准情景'],revenueFactor:1,opexFactor:1,
    buildFactor:1.075,gridReserve:.05,developmentShare:.03,retirementShare:.03,
    refurbishmentShare:.02,operatingAge:1,rtbYears:1.5,greenfieldYears:3,success:.65,
    usGreenfieldYears:5,usSuccess:.4,extraPremium:0,lifeYears:20,taxYears:10,reserveNet:15000},
  {id:'favourable',label:['Favourable case','较有利情景'],revenueFactor:1,opexFactor:1,
    buildFactor:1.05,gridReserve:.03,developmentShare:.02,retirementShare:.02,
    refurbishmentShare:.01,operatingAge:0,rtbYears:1,greenfieldYears:2,success:.75,
    usGreenfieldYears:4,usSuccess:.5,extraPremium:0,lifeYears:25,taxYears:10,reserveNet:30000},
];

export const REFERENCE_METHOD = [
  'Compare a reference case with downside and improved conditions. Each price meets its own target on both applicable ownership routes. These are conditional scenarios, not a probability interval. Replace assumptions with project inputs.',
  '将基准情景与下行、改善条件比较。每个价格均须让适用的两条持有路线达到对应目标。这些是条件情景，并非概率区间；取得项目资料后可逐项替换。',
];
export const REFERENCE_NOTES = [
  ['A contract can be assumed for a conditional valuation without being verified. Auction renewals stay at risk. The downside uses 80% at-risk income and 110% operating cost; base and improved cases use the market model. Income schemes and evidence status are separate. The 2% inflation convention converts real cash flows to nominal; fixed nominal contracts do not inflate.',
   '条件估值可以假设取得合同，但不代表合同已经核实。未来拍卖续期仍属风险收入。下行情景取风险收入的80%、运营成本的110%；基准及改善情景沿用市场模型。收入条件与证据状态分别记录；2%通胀是平台换算假设，固定名义合同不随通胀上涨。'],
  ['Construction uses the existing equipment/EPC budget plus 5–15% contingency, and a 3–10% external grid allowance only when no grid contribution is specified. Greenfield development costs 2–5% of construction cost. The original construction bill is never charged again when buying an operating asset.',
   '建设沿用现有设备及施工预算，加5%–15%预备费；未列外部电网费用时，另预留建设费的3%–10%。绿地后续开发费按建设费的2%–5%。购买运营资产不会再扣一遍原始建设费。'],
  ['Missing retirement budgets use 2–5% of today’s construction cost, with no assumed salvage proceeds. Operating assets allow 1–3% for immediate repairs. These are house allowances; NYSERDA explains the cost items, not these percentages. Existing service costs and battery fade remain in the model; no second augmentation allowance is added.',
   '缺少退役预算时，按当前建设费的2%–5%预留，不假设回收残值；运营资产另留1%–3%接手改造费。这些比例是平台预算，NYSERDA资料说明费用范围，并未给出这些比例。模型保留既有服务费与电池衰减，不重复加扩容费用。'],
  ['Screening tax uses an assumed 85% depreciable basis, 10–15-year straight-line write-off, carried losses and interest deductions capped at 30% of positive operating earnings. These are house proxies, not local tax determinations. Asset sales reduce tax basis by depreciation; share purchases inherit basis. Explicit annual tax replaces the proxy. Tax credits and grants require a separate eligible-project scenario.',
   '税务初筛假设85%成本可折旧，按10–15年直线扣除，计亏损结转，利息扣除以正运营收益的30%为限。这些是平台代理，并非当地税务认定。资产出售的税基扣除已用折旧；股权收购承接原税基。明确的逐年税额可替代估算；税收抵免和补助须单独列明项目适用条件。'],
  ['Greenfield assumes secured land rights and a submitted grid application. A 50–75% completion probability over 2–4 years is a house assumption; US references use 25–50% over 4–6 years. A quarter of successful cases take one extra year. Failed cases lose their development budget; no land resale or refund is assumed. Berkeley Lab supports allowing for delays and withdrawals, not transferring US statistics to other countries.',
   '绿地假设土地权利已落实、并网申请已提交。平台暂取2–4年建成、成功率50%–75%；美国参考项目取4–6年、25%–50%。成功项目中四分之一再延期一年；失败情景损失开发预算，不计土地转售或退款。伯克利资料支持考虑延期和退出，不代表这些假设是各国实测成功率。'],
  ['Downside/base/improved lives are 15/20/25 years, less completed operating age. Contract expiry, continuing battery fade and the service schedule are included; no automatic renewal or extra free augmentation is assumed. A longer life is conditional on site rights, equipment performance and continued maintenance. RTB commissioning is normally 1–2 years; local WA/Romania pathway ranges apply.',
   '下行／基准／改善情景总运营期为15／20／25年，扣除已运行年数。计入合同到期、持续衰减和服务费，不自动续约或免费扩容。较长运营期以场地权利、设备性能和持续维护为条件。RTB通常再需1–2年投运；西澳及罗马尼亚沿用本地路径区间。'],
  ['Finland’s hourly reserves are not fully covered by the annual FCR-D seed. An additional net €0/15,000/30,000 per MW-year is a stated sensitivity for unused dispatch opportunity, fading with the battery. It is not a quoted Fingrid price; qualify each product and prevent simultaneous use of the same MW. CIS floor, ceiling, eligible-revenue definition and caps remain private project inputs.',
   '芬兰年度FCR-D种子值未覆盖完整小时级备用收入。平台以每MW每年额外净收入€0／15,000／30,000作未利用调度机会的敏感性假设，并随电池衰减；这不是Fingrid报价，实际须逐项确认准入且避免同一MW重复出清。CIS底线、上限、合同收入定义及支付限额仍属私下项目输入。'],
];
