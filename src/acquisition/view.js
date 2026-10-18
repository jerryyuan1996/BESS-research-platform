import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { explanation } from '../components/explanation.js';
import { STAGES, STAGE_LABEL } from './parameters.js';

const pct = x => (100*x).toFixed(1)+'%';
const money = (value,currency) => new Intl.NumberFormat('en',{style:'currency',currency,maximumFractionDigits:0}).format(value);
export const BUYER_ADVICE = {
  greenfield:['Look for clear land rights and a credible path to a grid connection.','寻找土地权利清晰、并网路径可核实的项目。'],
  'ready-to-build':['Focus on permitted projects with the remaining construction costs established.','优先筛选许可齐全、剩余建设费用明确的项目。'],
  operating:['Look for transferable contracts and verified equipment condition, for long-term ownership.','优先收购合同可承接、设备状态可核实的资产，长期持有。'],
};

export function acquisitionPrice(result,{displayUSD=false}={}){
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

export function acquisitionList(rows,{marketName,marketLink,selectedStage,onStage}={}){
  const available=STAGES.filter(stage=>rows.some(r=>r.stage===stage));
  if(!available.length)return null;
  const stage=available.includes(selectedStage)?selectedStage:available.includes('ready-to-build')?'ready-to-build':available[0];
  return h('section',{class:'card acq-home'},
    h('h2',{},L(['Projects to look for','值得筛选的收购方向'])),
    available.length>1?h('div',{class:'acq-stages',role:'group','aria-label':L(['Acquisition stage','收购阶段'])},available.map(id=>h('button',{
      type:'button',class:'btn','aria-pressed':String(stage===id),onclick:()=>onStage?.(id)},L(STAGE_LABEL[id])))):null,
    h('div',{class:'acq-head', 'aria-hidden':'true'},L(['Market and asset','市场与方案']),L(['Suggested price ceiling / MW','建议收购上限 / MW']),L(['Buyer recommendation','买方建议'])),
    rows.filter(r=>r.stage===stage).map(result=>h('article',{class:'acq-row'},
      h('div',{},marketLink?.(result)||h('strong',{},marketName?.(result.market)||result.market),
        h('div',{class:'acq-basis'},`${result.hours??result.durationHours}h · `,L(STAGE_LABEL[stage]))),
      acquisitionPrice(result,{displayUSD:true}),
      h('p',{},L(result.advice||BUYER_ADVICE[stage])))));
}
