import { acquisitionCashFlows } from '../acquisition/valuation.js';
export const T_ZERO=['Investment closing and first capital commitment','投资交割并开始承担项目现金流'];
const local={
  wa:[['Western Power: connection design and works','Western Power：接入设计与电网工程'],['AEMO: WEM registration and capacity-credit conditions','AEMO：WEM注册与容量信用条件']],
  nem:[['DNSP: protection, dynamic models and two-way connection tests','配网公司：保护、动态模型及双向接入测试'],['Aggregator / IRP and FCAS product qualification','聚合商／IRP及FCAS产品资格']],
  gb:[['DNO / NESO: deliverable Gate 2 offer, works and energisation','DNO／NESO：落实Gate 2要约、工程和送电'],['Metering, trading / BM route and contracted obligations','计量、交易／BM路径及合同义务']],
  de:[['DSO / TSO: import/export envelope, BKZ and any flexibility limits','配网／输电公司：双向容量、BKZ及灵活接入限制'],['Trading access and FCR / aFRR prequalification as applicable','交易准入及适用的FCR／aFRR预认证']],
  it:[['Terna / DSO: connection works and energisation tests','Terna／配网：接入工程与送电测试'],['Capacity-market or MACSE acceptance, kept as separate routes','容量市场或MACSE验收，按独立路径执行']],
  ie:[['ESB Networks / EirGrid: modification or new-connection scope','ESB Networks／EirGrid：改造或新接入范围'],['Capacity and system-service qualification under the applicable arrangements','按适用安排完成容量与系统服务资格']],
  ro:[['Grid operator: ATR conditions, works and charging/export rights','电网公司：ATR条件、工程及充放电权'],['Registration, balancing and eligible reserve products','注册、平衡安排及合资格备用产品']],
  pl:[['PSE / DSO: connection agreement and energisation works','PSE／配网：并网协议及送电工程'],['Capacity-contract vintage, accredited MW and reserve qualification','容量合同批次、认可MW及备用资格']],
  jp_tokyo:[['TEPCO: study, connection payments and network works','东京电力：研究、接入付款及网络工程'],['Aggregator, balancing products or the specific LTDA award','聚合商、平衡产品或具体LTDA合同']],
  jp_kyushu:[['Kyushu utility: accepted study and usable charging windows','九州电力：受理研究与可用充电窗口'],['Regional trading / balancing access or LTDA obligations','区域交易／平衡准入或LTDA义务']],
  jp_hokkaido:[['Hokkaido utility: network works and winter-ready delivery','北海道电力：网络工程与冬季交付准备'],['Trading / balancing qualification or awarded LTDA acceptance','交易／平衡资格或已获LTDA验收']],
  pjm:[['Utility / PJM: approved ISA or surplus scope and charging access','电网／PJM：已批准ISA或剩余接入范围及充电权'],['PJM telemetry, market entry and separate capacity accreditation','PJM遥测、市场准入及独立容量认可']],
  ercot:[['Utility / ERCOT: DG connection works and charging/export capacity','电网／ERCOT：DG接入工程与充放电容量'],['QSE, telemetry and resource / ancillary-product qualification','QSE、遥测及资源／辅助服务产品资格']],
  caiso:[['Utility / CAISO: connection, deliverability and local fire approvals','电网／CAISO：接入、可交付性及地方消防审批'],['Market registration and contracted RA acceptance','市场注册及已签RA验收']],
  fi:[['DSO / Fingrid: confirmed available node and connection tests','配网／Fingrid：可用节点确认及接入测试'],['Fingrid product prequalification, telemetry and optimiser onboarding','Fingrid产品预认证、遥测及优化商接入']],
  es:[['REE / DSO: access and connection permit, guarantee and energisation works','REE／配网：接入与并网许可、担保及送电工程'],['OMIE market entry and REE balancing qualification','进入OMIE市场及REE平衡服务资格认证']],
  sa:[['SPPC / National Grid SA: site handover and connection at the named site','SPPC／沙特国家电网公司：指定场址移交与并网'],['SPPC acceptance and availability payments under the SSA','SPPC验收及按储能服务协议收取可用性付费']],
  ca_on:[['Utility / IESO: connection, LT2 milestones and usable duration','电网／IESO：接入、LT2里程碑及可用时长'],['IESO acceptance and capacity payments under the contract calendar','IESO验收及按合同日历收取容量费']],
};
export function deliveryTimeline(reference, investor, marketId, options={}){
  const {input}=reference,cod=reference.codMonths,qualified=reference.qualifiedMonths;
  const route=options.route||reference.atPrice?.route||(investor==='developer'?'sale':'hold');
  const raw=acquisitionCashFlows(input,investor,route,reference.price).flows;
  const grouped=new Map();
  for(const f of raw){const key=Number((f.at*12).toFixed(6));grouped.set(key,(grouped.get(key)||0)+f.amount);}
  const firstAnnual=cod+12,exit=route==='sale'?cod+(investor==='developer'?0:60):null;
  const fundingAt=month=>input.scenarios.flatMap(s=>[
    ...s.costs.map(x=>({...x,direction:'cost'})),...s.recoveries.map(x=>({...x,direction:'recovery'}))
  ]).filter(x=>Math.abs(x.at*12-month)<1e-5);
  const cash=[...grouped].filter(([,amount])=>Math.abs(amount)>.005).map(([month,amount])=>({
    month,amount,kind:'cash',
    title:month===0?['Closing consideration, fees and immediate works','交割对价、费用及即时投入']:
      exit!=null&&Math.abs(month-exit)<1e-5?['Sale proceeds and tax settlement','出售回款与税费结算']:
      Math.abs(month-firstAnnual)<1e-5?['First operating-year net cash settlement','首个运营年度净现金流结算']:
      fundingAt(month).some(x=>x.kind==='construction-vat')?['Recoverable construction VAT refund','可抵扣建设增值税回款']:
      fundingAt(month).some(x=>x.direction==='cost'&&x.kind==='construction')?['Construction / grid payment, including recoverable VAT','建设／并网付款，含可抵扣增值税']:
      month<cod?['Development funding / other recoveries','开发投入／其他回款']:
      ['Operating net cash / recoveries','经营净现金流／回款'],
  }));
  const checks=local[marketId];
  const milestones=[
    {month:0,kind:'delivery',title:T_ZERO,owner:['Investor + legal','投资者＋法律顾问'],
      output:input.stage==='greenfield'?['Secure the site and connection-application route; fund permitting, studies and the later build.','锁定场址和接入申请路径，落实许可、研究及后续建设资金。']:
        ['Transfer site, connection and revenue-contract rights; verify the RTB conditions and funding budget.','交割土地、并网及收入合同权利，核实RTB条件与资金预算。']},
    {month:Math.min(1,cod*.1),kind:'delivery',title:['Design and procurement release','设计冻结与设备采购'],owner:['EPC + technical adviser','EPC＋技术顾问'],
      output:['Approve single-line design, usable energy, warranty, grid envelope and purchase orders.','确认一次系统、可用电量、质保、并网运行边界及采购订单。']},
    {month:cod*.25,kind:'delivery',title:['Civil works and network coordination','土建开工与电网协同'],owner:['EPC + grid operator','EPC＋电网公司'],output:checks[0]},
    {month:cod*.75,kind:'delivery',title:['Install and test the complete plant','设备安装与整站测试'],owner:['EPC + OEM + grid operator','EPC＋设备商＋电网公司'],
      output:['Complete civil/electrical works, protection, metering, communications and energisation readiness.','完成土建与电气工程、保护、计量、通信及送电准备。']},
    {month:cod,kind:'delivery',title:['Physical COD / commissioning acceptance','实际COD／调试验收'],owner:['Grid operator + owner','电网公司＋业主'],
      output:['Record the accepted export/import envelope and hand over operating responsibilities.','记录获准充放电运行边界，移交运营责任。']},
    {month:qualified,kind:'delivery',title:['Revenue eligibility achieved','取得收入资格'],owner:['Operator + market / offtaker','运营商＋市场／承购方'],output:checks[1]},
  ];
  const firstWindow=Math.max(firstAnnual,qualified);
  return {currency:input.currency,powerMW:input.powerMW,route,codMonths:cod,qualifiedMonths:qualified,
    milestones:[...milestones,...cash.filter(c=>c.month<=firstWindow+.00001)].sort((a,b)=>a.month-b.month||(a.kind===b.kind?0:a.kind==='delivery'?-1:1)),
    laterCash:cash.filter(c=>c.month>firstWindow+.00001),
    allCash:cash,rawCash:raw,
    targetBasis:['Delivery targets are scheduled back from the model COD. Cash entries use the exact model payment dates; annual project cash settles at operating year end and can include grants or other recoveries.','交付目标按模型COD倒排；现金条目取自模型的实际支付时点，年度项目现金按运营年末结算，可能包含补助及其他回款。']};
}
