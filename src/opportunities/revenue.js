// Mechanism facts come from the linked rule/operator sources. Pricing motives
// and investment implications are house economic interpretation, not quotes.
export const REVENUE_MECHANISMS = {
  toll: {
    title:['Fixed toll / revenue floor','固定Toll／收入保底'],
    payer:['Utilities, retailers and power traders; e.g. RWE, Shell or Centrica. An optimiser may only act as an agent, so identify the actual payment obligor.', '交易对手通常是公用事业公司、售电商和电力交易商，如RWE、Shell或Centrica。优化商也可能仅是代理，须识别实际付款义务人。'],
    problem:['The owner needs predictable cash to finance the asset; the buyer needs flexible dispatch to manage trading, customer demand and renewable-generation imbalances.', '业主需要稳定现金流支持融资；购买方需要灵活调度，以管理交易头寸、客户负荷与新能源发电偏差。'],
    pricing:['A buyer pays for dispatch optionality. Its expected trading and portfolio value must cover the fixed fee, losses, charges, operating constraints and risk capital. Competition determines how that value is shared.', '购买方为调度选择权付费。预期交易和组合价值须覆盖固定费、电损、收费、运行限制及风险资本；竞争决定双方如何分配价值。'],
    drivers:['Renewable output, demand shape, volatility, balancing exposure and competing flexibility drive future quotes. A signed fixed fee does not reprice with daily spreads unless the contract says so.', '新能源出力、负荷形态、波动率、平衡敞口和其他灵活资源决定未来报价。已签固定费是否随市场变化，以合同约定为准。'],
    discipline:['A fixed toll replaces the sold dispatch revenue; a floor only tops up eligible shortfalls and may share upside. Check credit support, cycling limits, availability deductions, termination and residual merchant exposure.', '固定Toll替代已出售调度权对应的收入；保底只补足合资格缺口，并可能分享超额收益。检查增信、循环限制、可用率扣款、终止条款及剩余市场敞口。'],
    sources:[['RWE / terralayr toll','https://www.rwe.com/en/press/rwe-supply-and-trading/2025-05-28-rwe-to-market-a-virtual-50mw-battery-from-terralayr-for-5-years/'],['Centrica / Return','https://www.centrica.com/media-centre/news/2026/centrica-and-return-partner-to-scale-battery-flexibility-in-germany/']],
  },
  merchant: {
    title:['Merchant energy trading','市场化电能量交易'],
    payer:['Wholesale market participants pay for discharged energy; the battery pays for charging energy, losses and applicable charges.', '批发市场参与者支付放电电量的价格；电池承担充电电费、电损和适用收费。'],
    problem:['Generation and demand do not coincide in time. Storage moves energy from surplus hours into higher-value hours and can manage local delivery constraints.', '发电与需求在时间上不匹配；储能将富余时段电量转移至高价值时段，并可管理局部交付约束。'],
    pricing:['Net value is discharge receipts minus charging cost adjusted for efficiency, fees and degradation. A daily high–low price spread is not a captured battery margin.', '净价值等于放电收入减去考虑效率后的充电成本、费用及衰减成本。每日最高与最低电价之差不等于电池可实现利润。'],
    drivers:['Near term: weather, outages, fuel/carbon cost, congestion and scarcity. Long term: renewable penetration and thermal retirement widen flexibility needs; competing storage, interconnectors and responsive demand can compress captured spreads.', '短期由天气、停机、燃料与碳价、拥塞及稀缺时段驱动。长期新能源增长与火电退出增加灵活性需求；新增储能、联络线和需求响应也会压缩可捕获价差。'],
    discipline:['Model the actual node, charging window, usable duration, efficiency and degradation. Falling volatility or a restricted import connection can remove the forecast margin even while electricity demand grows.', '按实际节点、充电窗口、可用时长、效率和衰减建模。即使电力需求增长，波动下降或进口受限也可能消除预测利润。'],
    sources:[['AEMO quarterly market dynamics','https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed'],['ERCOT market reports','https://www.ercot.com/mktinfo']],
  },
  ancillary: {
    title:['Ancillary and balancing services','辅助服务与平衡服务'],
    payer:['The system operator procures defined response or reserve products; settlement can include availability/capacity and activated energy. An aggregator may provide market access.', '系统运营商采购明确的响应或备用产品；结算可能包括可用容量和实际激活电量。聚合商可提供参与通道。'],
    problem:['Forecast errors, disturbances and reduced synchronous generation create a need for fast response and reserves to maintain frequency and balance.', '预测误差、扰动和同步机组减少，使系统需要快速响应和备用来维持频率与平衡。'],
    pricing:['Price depends on the volume procured and the marginal qualified offer, including the opportunity cost of reserved energy and headroom. Product prices and activation income have different settlement rules.', '价格取决于采购量及边际合资格报价，包括预留电量和功率的机会成本。产品容量价与激活收入适用不同结算规则。'],
    drivers:['Renewable variability and declining inertia support the need; batteries, demand response, market integration and revised procurement volumes change competition. A persistent system need does not guarantee persistent scarcity rents.', '新能源波动与惯量下降支撑需求；电池、需求响应、市场互联和采购量调整改变竞争。长期系统需求并不保证长期稀缺租金。'],
    discipline:['Require product prequalification, telemetry, state-of-charge recovery and availability. Co-optimise shared MW/MWh; do not add every service maximum to full arbitrage revenue.', '必须完成产品预认证、遥测、荷电状态恢复及可用率管理。同一MW/MWh须协同优化，不能将所有服务峰值与全额套利相加。'],
    sources:[['Fingrid reserve markets','https://www.fingrid.fi/en/electricity-market/reserves_and_balancing/'],['AEMO ancillary services','https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/system-operations/ancillary-services']],
  },
  macse: {
    title:['MACSE: procuring storage investment','MACSE：采购储能投资与服务'],
    payer:['Terna pays the awarded annual premium for contracted storage energy capacity under the executed agreement.', 'Terna按已签协议，为中标储能能量容量支付年度溢价。'],
    problem:['Italy needs storage alongside renewable growth, but uncertain merchant cash flows can delay investment or place it in the wrong areas. Long-term procurement coordinates capacity, location and delivery.', '意大利需要储能配合新能源增长，但不确定的市场收入可能延迟投资或造成区位错配。长期采购协调规模、区位与交付时间。'],
    pricing:['Battery awards run for 15 years and bids are expressed per MWh-year. A bid must recover investment, lifecycle and performance costs at the required return, after retained income allowed by the contract. Competitive bids can clear far below an auction cap.', '电池合同期为15年，报价按MWh／年。投标需在允许保留的收入之外，覆盖投资、生命周期及履约成本并达到回报要求；竞争可使中标价远低于竞拍上限。'],
    drivers:['System storage needs and regional constraints shape procurement. Equipment cost, financing, competition, duration and performance requirements shape bids; spot volatility is largely transferred through the contracted dispatch arrangement.', '系统储能需求和区域约束决定采购；设备成本、融资、竞争、时长及履约要求影响投标。现货波动主要通过约定的调度安排转移。'],
    discipline:['Contracted capacity is made available for energy-market time shifting and system services under the rules. Do not add unrestricted merchant earnings to the full premium; inspect dispatch rights, deductions, indexation and delivery penalties.', '中标容量按规则提供能量移峰及系统服务。不能将不受约束的市场收入全额叠加到溢价；须核实调度权、扣减、指数调整及延期罚则。'],
    sources:[['Terna MACSE mechanism','https://lightbox.terna.it/en/insight/m-for-macse'],['First MACSE auction','https://download.terna.it/terna/Terna_completed_first_MACSE_auction_8de00ea13c11e89.pdf']],
  },
  capacity: {
    title:['Capacity and resource adequacy','容量与资源充裕性'],
    payer:['A system operator, capacity-market settlement body or obligated utility/retailer buys accredited availability for future reliability needs.', '系统运营商、容量市场结算机构或承担义务的公用事业／售电商，为未来可靠性采购认可容量。'],
    problem:['Energy prices alone may not fund enough reliable capacity. Procurement pays for availability at stressed hours, rather than paying for every nameplate MW or every MWh generated.', '仅靠电能量价格可能不足以支持充裕的可靠容量；采购支付的是紧张时段的可用能力，具体以认可容量而非铭牌容量计算。'],
    pricing:['Rules combine demand for reliability, eligible supply, accreditation/derating and auction or bilateral prices. Some arrangements use an administered benchmark; the project payment still depends on assigned capacity and performance.', '定价由可靠性需求、合资格供给、容量认可／折减及拍卖或双边价格共同决定。部分安排采用行政基准，但项目收款仍取决于核定容量及履约。'],
    drivers:['Demand growth and thermal retirement support need; new supply lowers scarcity. Accreditation, duration rules and procurement reforms can change the paid quantity without changing the installed asset.', '需求增长与火电退役支撑需要；新增供给减少稀缺性。容量认可、时长规则及采购改革可能在实体资产不变时改变付费容量。'],
    discipline:['Value the exact contract vintage, credited MW, payment unit, deductions and expiry. Retain energy or services income only where rights and operating obligations allow.', '按具体合同批次、核定MW、计费单位、扣款及到期日估值；只有权利和运行义务允许时才保留能量或辅助服务收入。'],
    sources:[['AEMO reserve capacity','https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism'],['PJM capacity market','https://www.pjm.com/markets-and-operations/rpm'],['CAISO / CPUC RA','https://www.cpuc.ca.gov/ra']],
  },
  cis: {
    title:['CIS: a project-specific revenue collar','CIS：按项目约定的收入上下限'],
    payer:['The Australian Government provides contracted revenue support to eligible awarded projects.', '澳大利亚政府向合资格中标项目提供合同约定的收入支持。'],
    problem:['Storage is needed for the renewable transition, while volatile revenues can prevent financing. The scheme supports downside revenue while sharing some upside with the government.', '能源转型需要储能，但收入波动可能阻碍融资。该安排支持收入下行，同时与政府分享部分上行。'],
    pricing:['Bidders submit project-specific floor, ceiling and payment-cap terms. Support fills an eligible shortfall under those terms; it is not the floor amount added on top of merchant revenue.', '投标人提交按项目约定的下限、上限及支付限额。支持款按条款补足合资格缺口，不能将整个下限金额再加到市场收入之上。'],
    drivers:['Competition, costs and required financing drive the support bid. Renewable growth creates demand for firming; payments depend on eligible revenue and contract performance after the plant operates.', '竞争、成本及融资要求影响支持报价。新能源增长创造调节需求；投运后付款仍取决于合资格收入与合同履约。'],
    discipline:['Verify the signed agreement, eligible revenue, sharing percentages, annual cap and expiry. A public scheme announcement does not establish an asset-level floor.', '核实已签协议、合资格收入、分享比例、年度上限和到期日。公开机制公告不能证明具体资产已获得保底。'],
    sources:[['DCCEEW CIS','https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/progress-projects-tenders']],
  },
  ltda: {
    title:['Japan LTDA: long-term capacity investment','日本LTDA：长期容量投资'],
    payer:['The capacity-market arrangement provides long-term awarded payments for eligible decarbonisation investment.', '容量市场安排为合资格的脱碳投资提供长期中标付款。'],
    problem:['Japan seeks reliable decarbonised supply despite high initial capital cost and uncertain future energy margins.', '日本希望在初始资本支出较高、未来电能量利润不确定的条件下，取得可靠的脱碳供给。'],
    pricing:['The awarded price is linked to eligible investment and fixed-cost recovery under the bidding rules. Other-market profit sharing limits how much merchant upside the owner keeps.', '中标价格按投标规则与合资格投资及固定成本回收相关；其他市场利润分享限制业主可保留的市场化上行。'],
    drivers:['Adequacy, decarbonisation targets, technology eligibility and procurement competition drive investment. Minimum size/duration and supply-chain conditions can change by round.', '充裕性、脱碳目标、技术资格和采购竞争驱动投资；最低规模、时长与供应链条件可随轮次变化。'],
    discipline:['Use the actual award and applicable round. A sub-2 MW connection case cannot inherit a utility-scale LTDA award; do not stack full merchant profit on top of the capacity payment.', '采用实际中标合同及适用轮次；低于2MW接入项目不能继承大型LTDA中标收入，也不能叠加全部市场利润。'],
    sources:[['OCCTO 2026 LTDA rules','https://www.occto.or.jp/assets/260902_boshuyoukou_long_2026.pdf']],
  },
  lt2: {
    title:['Ontario LT2: long-term adequacy','Ontario LT2：长期充裕性'],
    payer:['IESO contracts for long-term capacity; the executed agreement defines the owner’s retained energy and other-product rights.', 'IESO签约采购长期容量；已签协议定义业主可保留的能量与其他产品权利。'],
    problem:['Demand growth and supply changes require dependable capacity; a long contract can support the substantial investment needed for long-duration batteries.', '需求增长和供给变化需要可靠容量；长期合同可以支持长时电池所需的大额投资。'],
    pricing:['Competitive offers trade off build cost, financing, usable duration and retained trading value. A MW-Business-Day quote must use contract business days, not 365 days.', '竞争报价权衡建设成本、融资、可用时长及保留的交易价值。MW工作日报价须采用合同工作日，不能乘365天。'],
    drivers:['Demand, system adequacy, procurement volumes and competition drive new awards. Trading remains exposed to prices, while availability and contract deadlines determine capacity receipts.', '需求、系统充裕性、采购规模与竞争影响新中标；交易仍暴露于电价，可用率和合同期限决定容量收款。'],
    discipline:['Window-1 contracts end on 30 April 2050; late COD does not restart a full 20-year term. Confirm availability deductions and exclusions for future capacity-related products.', '窗口1合同于2050年4月30日结束；迟延COD不会重启完整20年期限。核实可用率扣款及未来容量相关产品的例外。'],
    sources:[['IESO LT2 procurement','https://www.ieso.ca/Sector-Participants/Resource-Acquisition-and-Contracts/Long-Term-RFP-and-Expedited-Process']],
  },
};
export function revenueMechanismsFor(market, route) {
  const id = market.manifest.id;
  if (route === 'toll') return ['toll','merchant','ancillary'];
  if (route === 'ltda') return id === 'it' ? ['macse'] : [id === 'nem' ? 'cis' : 'ltda','merchant','ancillary'];
  if (route === 'cap') return [id === 'ca_on' ? 'lt2' : 'capacity','merchant','ancillary'];
  return ['merchant','ancillary'];
}
