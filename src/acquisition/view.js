import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { explanation } from '../components/explanation.js';
import { STAGES, STAGE_LABEL } from './parameters.js';
import { REFERENCE_CASES, REFERENCE_METHOD, REFERENCE_NOTES, REFERENCE_SOURCES } from './referencePolicy.js';
import { expandReferences } from './projection.js';

const pct = x => (100*x).toFixed(1)+'%';
const money = (value,currency) => new Intl.NumberFormat('en',{style:'currency',currency,maximumFractionDigits:0}).format(value);
export const BUYER_ADVICE = {
  greenfield:['Look for clear land rights and a credible path to a grid connection.','寻找土地权利清晰、并网路径可核实的项目。'],
  'ready-to-build':['Focus on permitted projects with the remaining construction costs established.','优先筛选许可齐全、剩余建设费用明确的项目。'],
  operating:['Look for transferable contracts and verified equipment condition, for long-term ownership.','优先收购合同可承接、设备状态可核实的资产，长期持有。'],
};

export function acquisitionPrice(result,{displayUSD=false}={}){
  if(result.status==='reference')return referencePrice(result,{displayUSD});
  const fx=displayUSD?result.fxToUSD:1,currency=displayUSD?'USD':result.currency;
  const amount=x=>money(x*fx,currency)+'/MW';
  const basis=result.returnBasis==='equity'?['Equity return','股东回报']:['All-cash return','全现金回报'];
  const route=result.route==='hold'?['Long-term hold','长期持有']
    : result.exitYear===0?['Sale at operation start','投运时出售']:[`Sale after ${result.exitYear} operating years`,`投运后第${result.exitYear}年出售`];
  const price=explanation(money(result.pricePerMW*fx,currency),['About this acquisition price','收购价格说明'],h('div',{},
    h('p',{},L(['The maximum price for the whole project, allowing for future spending and the required return.','这是整个项目的最高收购总价，已为后续投入和目标回报留出空间。'])),
    h('dl',{},[
      [['Payment to the seller for equity','预计卖方股权付款'],result.equityPaymentPerMW],
      [['Existing net debt assumed','承接净债务'],result.pricePerMW-result.equityPaymentPerMW],
      [['Further investment budget','买入后仍需投入'],result.futureInvestmentPerMW],
      [['Equity needed at closing','交割所需自有资金'],result.closingEquityPerMW],
    ].map(([label,value])=>h('div',{},h('dt',{},L(label)),h('dd',{},amount(value))))),
    h('p',{},L(['Future spending is the largest declared scenario budget, undiscounted. New borrowing funds the purchase; it does not reduce the seller’s equity payment.','后续投入为所列情景中的最高未折现预算。新增贷款用于筹资，不重复扣减卖方股权款。']))),{className:'acq-price'});
  const target=explanation(h('span',{},L(['Target annual return ','目标年化收益率 ']),h('strong',{},pct(result.targetReturn))),['About the return target','目标收益率说明'],h('div',{},
    h('p',{},L(route),' · ',L(basis)),
    h('p',{},L([`At this ceiling, this base-case route is expected to meet the ${pct(result.targetReturn)} required annual return, after project taxes and future costs.`,
      `按此上限收购，基准情景下这条路线预计刚好达到${pct(result.targetReturn)}的目标年化回报，已计入项目税费和后续成本。`])),
    result.returnBasis==='equity'?h('p',{},L(['Loan interest and principal repayments are included.','已计入贷款利息及偿还本金。'])):null,
    h('p',{},L([`Based on ${result.currency} cash flows. This is a required model return, not a guaranteed annual cash payout.`,
      `按${result.currency}现金流测算。这是测算要求的回报，不是每年分红或保证收益。`])),
    h('p',{},L([`The target includes a ${pct(result.baseRate)} long-term currency benchmark and ${pct(result.targetReturn-result.baseRate)} for investor, entry-stage and revenue risk.`,
      `目标由${pct(result.baseRate)}的本币长期基准，加上${pct(result.targetReturn-result.baseRate)}的投资者、进入阶段及收入风险补偿组成。`])),
    h('p',{},L(['Rate snapshot: ','利率快照：']),result.rateDate),
    result.rateSource?.startsWith('https://')?h('a',{href:result.rateSource,target:'_blank',rel:'noopener noreferrer'},L(['Long-term rate source','长期利率来源'])):null,
    h('details',{},h('summary',{},L(['Sources and assumptions','来源与假设'])),result.sources.map(source=>h('p',{},typeof source==='string'?source:source.label||source.url||JSON.stringify(source))))));
  return h('div',{class:'acq-price-group'},price,h('div',{class:'acq-unit'},currency+' / MW'),target,h('div',{class:'acq-basis'},L(basis),' · ',L(route)));
}

const referenceLabel=key=>L(REFERENCE_CASES.find(c=>c.id===key)?.label||[key,key]);
const rangeText=(values,format)=>{const sorted=[...new Set(values.filter(Number.isFinite).map(format))];return sorted.length===1?sorted[0]:sorted.join(' – ');};
const routeText=r=>L(r.route==='hold'?['Long-term hold','长期持有']:r.exitYear===0?['Sell at operation start','投运时出售']:[`Sell after ${r.exitYear} operating years`,`投运后第${r.exitYear}年出售`]);
export function referenceContract(result){
  if(result.commercialScenario==='conditional-floor')return [`Assumes a negotiated ${result.contractYears}-year floor`,`假设谈妥${result.contractYears}年保底合同`];
  if(result.commercialScenario==='conditional-toll')return [`Assumes a negotiated ${result.contractYears}-year fixed income contract`,`假设谈妥${result.contractYears}年固定收入合同`];
  const labels={cap:['Capacity payments + market revenue','容量付费＋市场化收入'],mer:['Market trading + grid services','市场交易＋电网服务'],
    toll:[`Assumed toll/floor: ${result.contractYears} years`,`假设租赁／保底合同：${result.contractYears}年`],
    ltda:[`Assumed long-term award: ${result.contractYears} years`,`假设长期中标合同：${result.contractYears}年`]};
  return labels[result.strategyId]||['Reference revenue model','参考收入模型'];
}

function referencePrice(result,{displayUSD=false}={}){
  const fx=displayUSD?result.fxToUSD:1,currency=displayUSD?'USD':result.currency,cases=result.referenceCases;
  // Round reference prices down to thousands, never imply single-dollar precision.
  const amount=x=>money(Math.floor(x*fx/1000)*1000,currency);
  const positive=cases.filter(c=>c.status==='priced'),base=cases.find(c=>c.key===result.baseCaseKey)||cases[0];
  const displayed=base.status==='priced'?base:positive.at(-1)||base;
  const priceLabel=base.status==='priced'?amount(base.pricePerMW)
    :positive.length?L(['With improved terms, up to ','条件改善后最高 '])+amount(displayed.pricePerMW):L(['Improve cost or income terms','需改善建设或收入条件']);
  const assumptions=h('div',{},h('p',{},L(REFERENCE_METHOD)),
    h('p',{},L(['Assumptions dated ','假设日期：']),result.asOf),
    cases.map(c=>{
      const a=c.assumptions;
      return h('section',{class:'acq-case-detail'},h('strong',{},referenceLabel(c.key)),
        h('p',{},c.status==='priced'?`${amount(c.pricePerMW)}/MW · ${pct(c.targetReturn)} · ${routeText(c)}`:L(['Even a zero purchase price misses the return target.','即使不支付收购款，仍未达到目标回报。'])),
        h('dl',{},[
          [['Operation after closing','交割至并网投运'],result.stage==='operating'?L(['Already operating','已投运']):`${Math.round(a.codYears*12)}–${Math.round(a.latestCodYears*12)} `+L(['months','个月'])],
          [['Years of operation remaining','剩余运营期'],c.remainingYears],
          [['Corporate tax rate','企业所得税率'],pct(a.taxRate)],
          [['Straight-line depreciation assumption','直线折旧假设'],`${a.depreciationYears??'—'} `+L(['years','年'])],
          [['Inflation assumption','通胀假设'],pct(a.inflation??0)],
          [['Additional net reserve income (assumed)','补充备用净收入（假设）'],amount(a.additionalReserveNetPerMW??0)+'/MW/'+L(['year','年'])],
          [['Unconfirmed revenue / model','未确认收入／平台参考值'],pct(a.revenueFactor)],
          [['Operating costs / model','运营费用／平台参考值'],pct(a.opexFactor)],
          [['Construction and grid budget','建设及并网预算'],amount(a.buildBudget)+'/MW'],
          [['Further development budget','后续开发预算'],amount(a.development)+'/MW'],
          [['Retirement budget','退役预算'],amount(a.retirement)+'/MW'],
          [['Completion assumption','建成概率假设'],pct(a.success)],
          [['Seller equity payment','卖方股权款'],c.equityPaymentPerMW==null?L(['Depends on final price','取决于最终价格']):amount(c.equityPaymentPerMW)+'/MW'],
          [['Net debt assumed','承接净债务'],c.equityPaymentPerMW==null?L(['To be provided','待提供']):amount(c.pricePerMW-c.equityPaymentPerMW)+'/MW'],
          [['New purchase loan','新增收购贷款'],amount(c.loanPerMW)+'/MW'],
          [['Equity needed at closing','交割所需自有资金'],c.closingEquityPerMW==null?L(['Depends on final price','取决于最终价格']):amount(c.closingEquityPerMW)+'/MW'],
          [['Further investment budget','后续投入预算'],amount(c.futureInvestmentPerMW)+'/MW'],
        ].map(([label,value])=>h('div',{},h('dt',{},L(label)),h('dd',{},value)))),
        a.contractConfirmed?h('p',{},L(['Contract confirmed in your inputs.','已按你的输入确认合同。'])):h('p',{},L(['Values assume the stated contract is obtained. This is a conditional comparison; no project contract or lender commitment has been verified.','价格以取得所列合同为条件测算；这是情景参照，尚未核实具体合同或银行承诺。'])),
        a.taxOverridden||a.annualOverridden||a.scenariosOverridden?h('p',{},L(['Your supplied project values replace the corresponding reference assumptions. A supplied annual schedule is used directly.','你提供的项目数值已替代对应参考假设；若提供逐年现金流，则直接使用该表。'])):null,
        c.status!=='priced'&&Number.isFinite(c.costGapPVPerMW)?h('p',{},L([`Future costs need to fall, or net revenue value needs to rise, by about ${amount(c.costGapPVPerMW)}/MW in today’s money before any purchase payment.`,
          `尚需减少未来成本或增加净收入，现值约${amount(c.costGapPVPerMW)}/MW，才开始有支付收购款的空间。`])):null);
    }),
    h('details',{},h('summary',{},L(['How the assumptions work','假设是如何设定的'])),REFERENCE_NOTES.map(note=>h('p',{},L(note))),
      h('p',{},L([`Market model last verified: ${result.marketSourceDate}.`,`市场模型最近核对日期：${result.marketSourceDate}。`])),
      result.modelCurrency!==result.currency?h('p',{},L([`The ${result.modelCurrency} model is translated at ${result.localUnitsPerModelUnit.toFixed(4)} ${result.currency} per ${result.modelCurrency}; ${result.currency} discount rates are used. Constant FX is a screening assumption, not a hedge.`,
        `将${result.modelCurrency}模型按1:${result.localUnitsPerModelUnit.toFixed(4)}折算为${result.currency}，采用${result.currency}折现率。固定汇率仅为初筛假设，不代表已对冲。`])):null),
    h('details',{},h('summary',{},L(['Public sources','公开资料来源'])),[...new Set(cases.flatMap(c=>c.assumptions.sourceIds))].map(id=>{
      const s=REFERENCE_SOURCES[id];return h('p',{},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},L(s.label)));
    }),...(result.customSources||[]).map(source=>h('p',{},L(['Your source: ','你提供的资料：']),typeof source==='string'?source:source.label||source.url||''))));
  const price=explanation(priceLabel,['Reference price and assumptions','参考价格与假设'],assumptions,{className:'acq-price'});
  const targets=pct(displayed.targetReturn);
  const target=explanation(L(['Target annual return ','目标年化收益率 '])+targets,['Price and return belong together','价格与回报如何对应'],h('div',{},
    h('p',{},L(['Each endpoint pairs its own price, completion timetable, income and return. It is not a range of returns at a single purchase price.','每个端点对应自己的价格、投运时间、收入和回报；并非同一收购价可以取得整段收益。'])),
    cases.map(c=>h('p',{},referenceLabel(c.key),'：',c.status==='priced'?amount(c.pricePerMW)+'/MW → '+pct(c.targetReturn):L(['Target not reached at zero acquisition payment: ','不付收购款仍未达目标：'])+pct(c.targetReturn),' · ',routeText(c))),
    h('p',{},L([`The displayed price and ${targets} target use the ${displayed.key} case. The target is your buying requirement; the return at a seller's asking price is calculated separately.`,
      `当前价格与${targets}目标属于同一情景。目标是买入要求；卖方实际报价下能赚多少，需要另行测算。`])),
    h('p',{},L([`Nominal ${result.currency} cash flows, after modelled tax and costs. The ${pct(result.baseRate)} currency benchmark is a dated screening proxy. Reference premiums are house conventions calibrated against disclosed valuations, not a claim about every institution's target.`,
      `按含通胀的${result.currency}现金流计算，已扣模型税费与成本。${pct(result.baseRate)}本币基准是有日期的初筛代理值；风险补偿参考公开估值校准，为平台约定，不能代表所有机构的要求。`])),
    displayed.returnBasis==='equity'?h('p',{},L(['Loan interest and principal repayments are included.','已计入贷款利息及偿还本金。'])):null,
    h('p',{},L(['At a positive ceiling, the modelled annual return meets that case’s target. This is an annualised cash-flow return, not annual cash distribution.','正收购上限对应的模型年化回报达到该情景目标；它是现金流年化回报，不是每年的现金分红。'])),
    h('a',{href:result.rateSource,target:'_blank',rel:'noopener noreferrer'},L(['Currency-rate source','币种利率来源']))));
  const zeroReturn=base.status!=='priced'&&result.quotedPricePerMW==null?base.atPrice?.annualReturn:null;
  return h('div',{class:'acq-price-group'},price,h('div',{class:'acq-unit'},currency+' / MW'),target,
    h('div',{class:'acq-scenario-label'},referenceLabel(displayed.key),L([' · nominal annual return',' · 含通胀的年化回报'])),
    h('div',{class:'acq-basis'},L(cases[0].returnBasis==='equity'?['Equity return · Long-term hold','股东回报 · 长期持有']:['All-cash return','全现金回报'])),
    Number.isFinite(zeroReturn)?h('div',{class:'acq-basis'},L(['Reference return with no payment for project rights: ','基准情景、不付项目权利收购款时回报：']),pct(zeroReturn)):null);
}

export function acquisitionList(rows,{marketName,marketLink,selectedStage,onStage,onCompare,referenceData}={}){
  rows=expandReferences(rows,referenceData);
  const available=STAGES.filter(stage=>rows.some(r=>r.stage===stage));
  if(!available.length)return null;
  const stage=available.includes(selectedStage)?selectedStage:available.includes('ready-to-build')?'ready-to-build':available[0];
  return h('section',{class:'card acq-home'},
    h('h2',{},L(['Acquisition reference by market','各市场收购参照'])),
    h('p',{class:'acq-basis'},L(['Compare the price, connection timetable and income terms together. Hover or tap a figure for assumptions.','将买入价、并网时间和收入条件一起比较；悬停或点击数字可查看假设。'])),
    available.length>1?h('div',{class:'acq-stages',role:'group','aria-label':L(['Acquisition stage','收购阶段'])},available.map(id=>h('button',{
      type:'button',class:'btn','aria-pressed':String(stage===id),onclick:()=>onStage?.(id)},L(STAGE_LABEL[id])))):null,
    h('div',{class:'acq-head', 'aria-hidden':'true'},L(['Market and asset','市场与方案']),L(['Price ceiling / MW and return','收购上限 / MW 与回报']),L(['Time to operation and income','投运时间与收入条件'])),
    rows.filter(r=>r.stage===stage).map(result=>h('article',{class:'acq-row'},
      h('div',{},marketLink?.(result)||h('strong',{},marketName?.(result.market)||result.market),
        h('div',{class:'acq-basis'},`${result.hours??result.durationHours}h · `,L(STAGE_LABEL[stage]))),
      acquisitionPrice(result,{displayUSD:true}),
      result.status==='reference'?h('div',{class:'acq-context'},
        h('p',{},stage==='operating'?L(['Already connected and operating','已并网投运']):L(['Operation in about ','预计并网投运约 '])+rangeText(result.referenceCases.map(c=>c.assumptions.codYears*12).sort((a,b)=>a-b),x=>String(Math.round(x)))+L([' months','个月'])),
        h('p',{},L(referenceContract(result))),
        result.workableBuildPerMW!=null?h('p',{class:'acq-basis'},L([`At the reference income, keep the construction and grid budget within about ${money(Math.floor(result.workableBuildPerMW*result.fxToUSD/1000)*1000,'USD')}/MW before paying for project rights.`,
          `按基准收入，建设与并网总预算需控制在约${money(Math.floor(result.workableBuildPerMW*result.fxToUSD/1000)*1000,'USD')}/MW，才开始有支付项目权利收购款的空间。`]))
          :h('p',{class:'acq-basis'},L(['The price assumes the stated income and completion timetable. Compare other income contracts in the project calculator.','价格以所列收入和投运时间为条件；可在项目测算中比较其他收入合同。'])),
        onCompare?h('a',{href:'/investment-lab',class:'acq-basis',onclick:e=>{e.preventDefault();onCompare(result);}},L(['Compare a real project','对照真实项目'])):null)
        :h('p',{},L(result.advice||BUYER_ADVICE[stage])))));
}
