import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, pct, returnPct } from './model.js';
import { referenceInvestment,selectedSupplyOptions } from '../opportunities/investment.js';
import { opportunitiesFor } from '../opportunities/catalog.js';
import { sizeLeverage, leveredReturn } from '../acquisition/leverage.js';
import { nominalAnnual, taxSchedule } from '../acquisition/cashflows.js';
import { labField } from '../comparison/ranges.js';

const cash=y=>y.secured+y.renewal+y.merchant-y.opex-y.capex-y.tax;
/** Single-factor tests share the headline case's date, price and hold policy. */
export function analyseRisk(row,investor,overrides) {
  const options={...opportunitiesFor(row.id)[0]?.screeningByInvestor?.[investor],...selectedSupplyOptions(row)};
  const reference=referenceInvestment(row.market,investor,row.play,options)?.result;
  if(!reference)return null;
  const stressed=referenceInvestment(row.market,investor,row.play,{...options,economicOverrides:overrides})?.result;
  const debt=sizeLeverage(reference.input,reference.assumptions.buildBudget,reference.assumptions.terms,reference.price);
  const fixed=stressed&&debt?leveredReturn(stressed.input,investor,stressed.price,{
    buildBudget:reference.assumptions.buildBudget,terms:reference.assumptions.terms,fixedDebt:debt}):null;
  let minCover=null,liquidityGap=0;
  if(stressed&&debt) {
    const input=stressed.input,s=input.scenarios.find(x=>x.operates);
    const years=taxSchedule(input,nominalAnnual(input,s),s,stressed.price,debt.interest).annual;
    const ratios=[];
    years.forEach((y,i)=>{const payment=(debt.payments[i]||0)+(debt.balloons[i]||0);
      if(payment>0){ratios.push(cash(y)/payment);liquidityGap=Math.max(liquidityGap,payment-cash(y));}
    });
    minCover=ratios.length?Math.min(...ratios):null;
  }
  const factors=Object.entries(overrides).map(([key,value])=>{
    const r=referenceInvestment(row.market,investor,row.play,{...options,economicOverrides:{[key]:value}})?.result;
    return {key,value,hold:r?.holdReturn?.annualReturn??null,
      delta:r?.holdReturn?.annualReturn == null?null:r.holdReturn.annualReturn-reference.holdReturn.annualReturn};
  });
  return {reference,stressed,factors,fixed,minCover,liquidityGap,debt};
}
export function riskAnalysis(row,investor,overrides) {
  const a=analyseRisk(row,investor,overrides);
  if(!a)return h('p',{},L(['Pricing inputs are incomplete.','定价输入尚不完整。']));
  const {reference:r,factors,fixed,minCover,liquidityGap}=a;
  const box=h('div',{class:'ix-risk-analysis'});
  box.append(h('p',{},L(['Single-factor effects on all-equity hold IRR; the combined downside is not their sum. These are declared scenarios, not probability estimates.',
    '各因素单独作用于全股权长持IRR；组合下行不等于这些变化之和。以下为既定情景，不是概率预测。'])));
  const max=Math.max(.001,...factors.map(f=>Math.abs(f.delta||0)));
  for(const f of factors)box.append(h('div',{class:'ix-sensitivity-row'},
    h('span',{},L(labField(f.key)?.label||[f.key,f.key])),
    h('div',{class:'ix-sensitivity-track'},h('i',{style:'width:'+Math.abs(f.delta||0)/max*100+'%;background:'+(f.delta>=0?'#315f4c':'#9c5b40')})),
    h('strong',{},f.delta==null?'—':(f.delta>=0?'+':'')+(f.delta*100).toFixed(2)+' pp'),
    h('small',{},returnPct(f.hold))));
  box.append(h('p',{class:'ix-basis-note'},L(['Baseline debt kept unchanged: loan amount, rate, repayment and balloon. No debt is resized in the downside below.',
    '下方保持基准贷款金额、利率、偿还安排和尾款；压力情景不重新缩减债务。'])),
    h('dl',{class:'ix-project-facts'},
      ...[[['Downside levered IRR, base debt','下行杠杆后IRR（基准贷款）'],returnPct(fixed?.annualReturn)],
        [['Minimum cover incl. balloon','含到期尾款的最低覆盖'],minCover==null?'—':minCover.toFixed(2)+'x'],
        [['Largest annual debt funding gap / MW','最大年度偿债缺口／MW'],money(liquidityGap,r.input.currency)]].map(([k,v])=>h('div',{},h('dt',{},L(k)),h('dd',{},v)))));
  const life=h('div',{class:'ix-life-revenue','aria-label':L(['Model revenue mix by operating year','按运营年展示的模型收入结构'])});
  const top=Math.max(1,...r.annual.map(y=>y.secured+y.renewal+y.merchant));
  for(const [index,y] of r.annual.entries())life.append(h('div',{class:'ix-life-year',title:'Y'+(index+1)+' · '+money(y.secured+y.renewal+y.merchant,r.input.currency)+'/MW'},
    h('div',{},...[['fixed',y.secured],['renewal',y.renewal],['merchant',y.merchant]].map(([k,v])=>h('i',{class:k,style:'height:'+v/top*125+'px'}))),
    h('small',{},index+1)));
  box.append(h('h3',{},L(['Contract expiry and the revenue tail','合同到期与尾部收入'])),
    h('p',{},L(['Modelled annual gross revenue per MW, cash-flow currency. Dark: fixed; gold: renewal; light: trading. This is not equity distribution.',
      '各运营年的模型毛收入／MW，采用现金流原币。深色为固定，金色为续约，浅色为交易；股权分配需另扣成本、税费及债务。'])),life,
    h('p',{class:'ix-caption'},L(['Model contract tenor: ','模型合同期限：']),r.input.contractYears,L([' years','年'])));
  return box;
}
