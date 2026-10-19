/** Public reference assumptions, approved for indicative screening on 19 Oct 2026.
 * Source facts and house sensitivities are distinct. None is a project quote. */
export const REFERENCE_DATE = '2026-10-19';
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
    usGreenfieldYears:6,usSuccess:.25,extraPremium:.01},
  {id:'favourable',label:['Favourable case','较有利情景'],revenueFactor:1,opexFactor:1,
    buildFactor:1.05,gridReserve:.03,developmentShare:.02,retirementShare:.02,
    refurbishmentShare:.01,operatingAge:0,rtbYears:1,greenfieldYears:2,success:.75,
    usGreenfieldYears:4,usSuccess:.5,extraPremium:0},
];

export const REFERENCE_METHOD = [
  'A reference for comparing deals: each price is the most you could pay under that case and still meet its return target. These are scenario endpoints, not a forecast probability interval. Replace assumptions as project information arrives.',
  '用于对照真实项目：每个价格都是在该组条件下达到目标回报时最多能付的金额。两端是情景测算，不是统计预测区间；取得项目资料后可逐项替换。',
];
export const REFERENCE_NOTES = [
  ['Revenue uses the platform’s market model. Unconfirmed contracts and future awards are treated as at-risk income; they do not qualify for contracted debt. The cautious case takes 80% of unconfirmed revenue and 110% of operating costs; the favourable case uses the reference model. These percentages are house sensitivities, not published forecasts.',
   '收入沿用平台各市场模型。未确认合同及未来中标均按有风险收入处理，不据此使用合同型贷款。偏保守情景取未确认收入的80%、运营费用的110%；较有利情景使用参考模型。这些比例是平台敏感性假设，并非公开机构的预测。'],
  ['Construction uses the existing equipment/EPC budget plus 5–15% contingency, and a 3–10% external grid allowance only when no grid contribution is specified. Greenfield development costs 2–5% of construction cost. The original construction bill is never charged again when buying an operating asset.',
   '建设沿用现有设备及施工预算，加5%–15%预备费；未列外部电网费用时，另预留建设费的3%–10%。绿地后续开发费按建设费的2%–5%。购买运营资产不会再扣一遍原始建设费。'],
  ['Missing retirement budgets use 2–5% of today’s construction cost, with no assumed salvage proceeds. Operating assets allow 1–3% for immediate repairs. These are house allowances; NYSERDA explains the cost items, not these percentages. Existing service costs and battery fade remain in the model; no second augmentation allowance is added.',
   '缺少退役预算时，按当前建设费的2%–5%预留，不假设回收残值；运营资产另留1%–3%接手改造费。这些比例是平台预算，NYSERDA资料说明费用范围，并未给出这些比例。模型保留既有服务费与电池衰减，不重复加扩容费用。'],
  ['Tax rates are screening proxies over positive operating cash, without depreciation or interest deductions. Local/state and group taxes are approximated where relevant. Sale taxes use an asset-sale proxy; share-sale relief, tax credits and subsidies are excluded unless supplied. Transaction fees are 1.5% plus a fixed allowance of 0.2–0.5% of construction cost.',
   '税率用于估算正运营现金的税费，未计折旧或利息抵税；地区、州及集团税按需要近似处理。出售采用资产交易税费代理，不默认享有股权出售优惠、税收抵免或补贴。收购交易费为1.5%，另留建设费0.2%–0.5%的固定费用。'],
  ['Greenfield assumes secured land rights and a submitted grid application. A 50–75% completion probability over 2–4 years is a house assumption; US references use 25–50% over 4–6 years. A quarter of successful cases take one extra year. Failed cases lose their development budget; no land resale or refund is assumed. Berkeley Lab supports allowing for delays and withdrawals, not transferring US statistics to other countries.',
   '绿地假设土地权利已落实、并网申请已提交。平台暂取2–4年建成、成功率50%–75%；美国参考项目取4–6年、25%–50%。成功项目中四分之一再延期一年；失败情景损失开发预算，不计土地转售或退款。伯克利资料支持考虑延期和退出，不代表这些假设是各国实测成功率。'],
  ['RTB assumes permits and grid rights are secured, normally with 1–2 years to construction and commissioning. WA and Romania use the platform’s existing local-pathway timing ranges. Operating references assume 0–3 completed years and a 15-year total life. Long-term cash-flow contracts are model assumptions until a project agreement is supplied. Bank terms remain indicative, not a financing commitment.',
   'RTB假设关键许可和并网权已取得，通常再用1–2年建设投运；西澳和罗马尼亚沿用平台既有本地开发路径的时间区间。运营参考资产假设已运行0–3年，总运营期暂取15年。未提供项目协议前，长期收入合同均为情景假设。贷款条件仅供参考，不代表银行承诺。'],
];
