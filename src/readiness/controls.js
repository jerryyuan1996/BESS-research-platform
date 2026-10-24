import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { readinessProfile } from './research.js';
import { readinessConfig, readinessFactor } from '../comparison/revenueReadiness.js';
import { runCase } from '../comparison/engine.js';
import { withOverrides } from '../comparison/scenario.js';
import './readiness.css';

const labels={energy:['Energy trading','能源交易'],services:['Ancillary / reserve services','辅助／备用服务'],capacity:['Capacity payments','容量付款'],contract:['Toll / floor / long-term award','Toll／保底／长期中标']};
export const readyTitle=['COD to revenue: start dates','COD到收入：起算时间'];
const pct=v=>v==null?'N/M':(v*100).toFixed(2)+'%';
const money=v=>Number.isFinite(v)?Math.round(v).toLocaleString('en-US'):'—';
const expanded=new Map();

export function readinessImpact(market,strategyId,exitYear,overrides={}){
  const variant=withOverrides(market,overrides);
  // Keep the selected revenue mix in the counterfactual; reset timing/costs only.
  const config=overrides.revenueReadiness??variant.comparison.economics.revenueReadiness??{};
  const ready=runCase(variant,strategyId,exitYear,{revenueReadiness:{...(config.reserveSharePct==null?{}:{reserveSharePct:config.reserveSharePct})}});
  const delayed=runCase(variant,strategyId,exitYear);
  return {ready,delayed};
}

export function renderReadinessControls(parent,market,strategyId,overrides,onChange){
  const id=market.manifest.id;
  if(!expanded.has(id))expanded.set(id,{});
  const opened=expanded.get(id);
  const config={...(overrides.revenueReadiness??market.comparison.economics.revenueReadiness??{})};
  const save=c=>onChange(c);
  const set=(key,v)=>{const c={...config};if(v==null)delete c[key];else c[key]=v;save(c);};
  const card=h('section',{class:'card readiness-controls',id:'revenue-start-inputs'},h('h2',{},L(readyTitle)),
    h('p',{class:'cap'},L(['Months after the contractual COD used in this calculation. Zero assumes readiness at COD; it is not a verified project date. Construction time remains separate. These inputs update the acquisition price, return comparison, debt sizing and saved case below.','以下均为相对本次测算所用合同COD的月数。零表示假设COD时已就绪，不代表已核实项目日期。建设期单独计算；这些输入会更新下方收购价格、回报对比、债务测算及保存的案例。'])));
  const fields=h('div',{class:'readiness-fields'});
  const number=(target,key,label,{max=240,placeholder='0',step='any'}={})=>{
    const n=h('input',{type:'number',min:0,max,step,placeholder,'aria-label':L(label),onchange:e=>{
      if(!n.checkValidity()){n.reportValidity();return;}
      set(key,n.value===''?null:Number(n.value));
    }});if(config[key]!=null)n.value=config[key];target.append(h('label',{},L(label),n));
  };
  for(const stream of Object.keys(labels))number(fields,stream+'Months',[labels[stream][0]+' start (months)',labels[stream][1]+'起算（月）']);
  card.append(fields);
  const extra=h('details',{class:'readiness-detail',ontoggle:()=>{opened.advanced=extra.open;}},h('summary',{},L(['Revenue mix, ramp-up and permit expiry','收入占比、爬坡及许可到期'])));
  extra.open=!!opened.advanced;
  const advanced=h('div',{class:'readiness-fields'});
  number(advanced,'reserveSharePct',['Reserve share of net trading revenue (%) — optional','备用占净交易收入比例（%）— 选填'],{max:100,placeholder:L(['Keep model split','沿用模型拆分'])});
  for(const stream of Object.keys(labels))number(advanced,stream+'RampMonths',[labels[stream][0]+' ramp (months)',labels[stream][1]+'爬坡（月）']);
  number(advanced,'permissionExpiryMonths',['Operating permission expires (month, optional)','运行许可到期（月，选填）'],{max:420,placeholder:L(['No expiry assumed','不设到期假设'])});
  number(advanced,'finalApprovalMonths',['Final approval / reinstatement (month, optional)','最终获批／恢复许可（月，选填）'],{max:420,placeholder:L(['No reinstatement assumed','不假设恢复'])});
  number(advanced,'extraCostPerMWMonth',[`Additional commissioning cost (${market.manifest.currency}/MW/month)`,`额外调试费用（${market.manifest.currency}／MW／月）`],{max:1e9});
  number(advanced,'extraCostMonths',['Additional cost duration (months)','额外费用持续（月）']);
  extra.append(h('p',{class:'cap'},L(['Changing the reserve share reallocates the existing net trading revenue; it does not add revenue. Optional permit expiry suspends all revenue until the entered final approval. Costs continue. Ramp-up is linear; settlement is a monthly eligibility screen with annual-end cash flows.','调整备用占比只重分配已有净交易收入，不增加收入。可选的许可到期将暂停所有收入，直至填入的最终获批时间，成本继续发生。爬坡按线性处理；月度准入计算汇总到年末现金流。'])),advanced);
  const profile=readinessProfile(market.manifest.id);
  if(profile){
    const productDetails=h('details',{class:'readiness-detail',ontoggle:()=>{opened.products=productDetails.open;}},h('summary',{},L(['Product-specific reserve starts','逐备用产品起算'])));
    productDetails.open=!!opened.products;
    productDetails.append(h('p',{class:'cap'},L(['Weights allocate reserve revenue, not simultaneous MW. They must sum to 100%. Use an optimiser’s feasible revenue mix; no product weights are inferred from national procurement.','权重分配备用收入，不代表可同时承诺的MW，合计须为100%。应采用优化商可行的收入组合；平台不从全国采购量推定权重。'])));
    const toggle=h('input',{type:'checkbox','aria-label':L(['Use product-specific reserve dates','启用逐备用产品日期']),onchange:()=>{
      const c={...config};if(toggle.checked)c.products=profile.products.map((id,i)=>({id,share:i===0?1:0,months:config.servicesMonths??0,rampMonths:config.servicesRampMonths??0}));else delete c.products;save(c);
    }});toggle.checked=!!config.products;productDetails.append(h('label',{},toggle,L([' Use product-specific reserve dates',' 启用逐备用产品日期'])));
    if(config.products){
      const body=h('tbody');
      config.products.forEach((p,i)=>{
        const edit=(key,max,mult=1)=>{const n=h('input',{type:'number',min:0,max,step:'any','aria-label':p.id+' '+L(key==='share'?['revenue share (%)','收入占比（%）']:key==='months'?['start (months)','起算（月）']:['ramp (months)','爬坡（月）']),onchange:()=>{
          if(!n.checkValidity()){n.reportValidity();return;}
          save({...config,products:config.products.map((v,j)=>j===i?{...v,[key]:Number(n.value)/mult}:v)});
        }});n.value=(p[key]??0)*mult;return n;};
        body.append(h('tr',{},h('th',{scope:'row'},p.id),h('td',{},edit('share',100,100)),h('td',{},edit('months',240)),h('td',{},edit('rampMonths',240))));
      });
      productDetails.append(h('div',{class:'tbl-wrap'},h('table',{},h('thead',{},h('tr',{},...['Product','Share %','Start / month','Ramp / months'].map((s,i)=>h('th',{},L([s,['产品','占比%','起算月','爬坡月数'][i]]))))),body)));
    }
    extra.append(productDetails);
  }
  card.append(extra);
  const result=h('div',{class:'readiness-impact','aria-live':'polite'});
  const {ready,delayed}=readinessImpact(market,strategyId,5,overrides);
  if(delayed.na||ready.na)result.append(h('p',{class:'warnbox'},L(delayed.na||ready.na)));
  else{
    const loss=ready.secY[0]+ready.aucY[0]+ready.mchY[0]-delayed.secY[0]-delayed.aucY[0]-delayed.mchY[0];
    const stat=(label,value)=>h('div',{},h('span',{},L(label)),h('strong',{},value));
    result.append(stat(['15-year hold IRR, ready at COD','COD全就绪的15年持有IRR'],pct(ready.irrHold)),
      stat(['With selected revenue starts','应用所选收入起算后'],pct(delayed.irrHold)),
      stat(['Year-1 revenue loss, USD/MW','首年收入减少，美元／MW'],money(loss)),
      stat(['Year-1 additional cost, USD/MW','首年额外费用，美元／MW'],money(delayed.readinessCostY[0])));
    card.append(h('p',{class:'cap'},L(['Fixed costs, degradation, expiry and debt timing continue. Lost revenue is not recovered in an extra operating year. Contract damages, settlement lag and exact seasonal dispatch require project cash flows.','固定费用、衰减、合同到期和债务时间表继续运行；损失收入不会通过增加运营年补回。合同赔偿、结算延迟及精确季节性调度须用项目现金流补充。'])));
  }
  card.append(result,h('button',{type:'button',class:'btn',onclick:()=>save({})},L(['Reset revenue timing assumptions','重置收入时间假设'])));
  parent.append(card);return card;
}

export function reserveMix(market){
  const e=market.comparison.economics;
  const energy=e.merchGross*(e.merchantNetOfFee?1:1-(e.feePct||0)/100),services=e.services||0;
  return energy+services>0?services/(energy+services):0;
}

export function readinessTimeline(config){
  const c=readinessConfig({revenueReadiness:config});
  const chart=h('div',{class:'readiness-timeline','aria-label':L(['Revenue eligibility in the first 18 months','前18个月收入准入情况'])});
  chart.append(h('div',{class:'readiness-timeline-row'},h('b',{},L(['Month after COD','COD后月份'])),...Array.from({length:18},(_,i)=>h('span',{},String(i+1)))));
  for(const stream of ['energy','services','contract'])chart.append(h('div',{class:'readiness-timeline-row'},h('b',{},L(labels[stream])),...Array.from({length:18},(_,i)=>{
    const f=readinessFactor(c,stream,i+1);return h('span',{class:f===0?'waiting':f<1?'ramping':'ready',title:Math.round(f*100)+'%'},f===0?'—':f<1?'◐':'●');
  })));
  return chart;
}
