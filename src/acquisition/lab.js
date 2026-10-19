import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, setLens } from '../app/state.js';
import { homeState } from '../home/state.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { STAGES, STAGE_LABEL } from './parameters.js';
import { marketAcquisition, marketAcquisitionReference, referenceInputs } from './reference.js';
import { returnAtAcquisitionPrice } from './valuation.js';
import { MARKET_REFERENCE } from './referencePolicy.js';
import { explanation } from '../components/explanation.js';
import { acquisitionPrice } from './view.js';

const inputs=new Map();
const reasons={
  'remaining operating cash flows':['Remaining cash-flow evidence','剩余运营现金流依据'],
  'decommissioning cost':['Decommissioning budget','退役费用预算'],
  'existing net debt':['Existing net debt','承接净债务'],
  'fixed transaction fees':['Fixed transaction fees','固定交易费用'],
  'remaining cost schedule':['Remaining investment schedule, including immediate works','剩余投入计划，含接手后立即需要的改造'],
  'remaining development/construction scenarios':['Remaining development and construction costs/timing','后续开发建设的成本及时间'],
  'sale tax and tax basis':['Sale tax and cost basis','出售税率及计税成本'],
  'development success/delay/failure evidence':['Development success, delay and failure assumptions','开发成功、延期和失败情景依据'],
  'entry, technical and contractual conditions':['Verified entry, equipment and contract conditions','已核实的进入、技术和合同条件'],
  'source or stated assumption provenance':['Sources for the project inputs','项目输入资料来源'],
  'cash-flow currency':['Underlying cash-flow currency and conversion','底层现金流币种与换算'],
};

/** Private, session-local project inputs. No personal deal data enters the
 * public market snapshot. The same valuation serves the home and this form. */
export function renderAcquisitionLab(parent,market,strategyId,economicOverrides={}){
  const id=market.manifest.id;
  if(!inputs.has(id))inputs.set(id,{stage:homeState.acquisitionStage,useDebt:true,...(market.comparison.acquisition||{})});
  const state=inputs.get(id),investor=app.lens&&ARCHETYPES[app.lens]?app.lens:'infraFund';
  if(investor==='developer'&&state.stage==='operating')state.stage='ready-to-build';
  const card=h('section',{class:'card acq-lab'},h('h2',{},L(['What is the most I should pay?','这项资产最多值得付多少钱？'])));
  const fields=h('div',{class:'acq-form'});
  const change=(key,value)=>{state[key]=value;if(key==='stage')homeState.acquisitionStage=value;requestRender();};
  const stage=h('select',{'aria-label':L(['Acquisition stage','收购阶段']),onchange:event=>change('stage',event.target.value)},STAGES.filter(s=>!(investor==='developer'&&s==='operating')).map(s=>h('option',{value:s},L(STAGE_LABEL[s]))));
  stage.value=state.stage;
  const buyer=h('select',{'aria-label':L(['Buyer type','买方类型']),onchange:event=>{setLens(event.target.value);requestRender();}},
    Object.keys(ARCHETYPES).map(key=>h('option',{value:key},L(ARCHETYPES[key].label))));buyer.value=investor;
  card.append(h('label',{},L(['Buyer type ','买方类型 ']),buyer),' ',h('label',{},L(['Acquisition stage ','收购阶段 ']),stage),fields);
  card.append(h('p',{class:'acq-basis'},L(['Blank fields use the public reference assumptions. Change any known project input to update the price and return.','留空项采用公开资料与参考假设；拿到真实项目后，修改已知项即可更新价格和回报。'])));
  const inputCurrency=MARKET_REFERENCE[id]?.currency||market.manifest.currency;
  fields.append(h('div',{class:'acq-form-note'},L([`Money inputs below are ${inputCurrency} per MW.`,`以下金额单位均为${inputCurrency}／MW。`])));
  const number=(key,label,{max=1e12,min=0,step='any'}={})=>{
    const input=h('input',{type:'number',min,max,step,'aria-label':L(label),onchange:event=>{
      if(!event.target.checkValidity()){event.target.reportValidity();return;}
      change(key,event.target.value===''?undefined:Number(event.target.value));
    }});if(state[key]!=null)input.value=state[key];
    fields.append(h('label',{},L(label),input));
  };
  number('purchasePricePerMW',['Seller asking price / MW (optional)','卖方报价／MW（选填）']);
  number('taxPercent',['Cash tax on positive operating income (%)','正运营现金收入适用的现金税率（%）'],{max:100});
  number('decommissioningPerMW',['Decommissioning / MW, native currency','退役费用／MW，原币']);
  number('fixedFeesPerMW',['Fixed transaction fees / MW, native currency','固定交易费用／MW，原币']);
  if(state.stage==='operating'){
    number('initialWorksPerMW',['Immediate refurbishment budget / MW, native currency','接手后立即所需改造预算／MW，原币']);
    number('existingNetDebtPerMW',['Net debt assumed / MW, native currency','承接净债务／MW，原币'],{min:-1e12});
    number('operatingAgeYears',['Completed operating years','已完整运行年数'],{max:14,step:1});
  }else{
    number('remainingBuildPerMW',['Remaining construction and grid budget / MW','剩余建设及并网预算／MW']);
    number('unfixedConstructionPerMW',['Of that: construction not under fixed-price contracts / MW','其中：未锁定价格的施工成本／MW']);
    number('monthsToOperation',['Months from closing to operation','交割至投运所需月数'],{max:240});
    number('saleTaxPercent',['Tax on sale gain (%)','出售收益税率（%）'],{max:100});
    number('saleTaxBasisPerMW',['Sale tax cost basis excluding purchase / MW','出售计税成本（不含收购价）／MW']);
  }
  const check=(key,label)=>{const input=h('input',{type:'checkbox',onchange:event=>change(key,event.target.checked)});input.checked=!!state[key];card.append(h('label',{class:'acq-check'},input,L(label)));};
  check('contractConfirmed',['Selected revenue contracts have been obtained and can be transferred','所选收入合同已取得且可转让']);
  check('conditionsMet',['Entry, equipment and remaining cost conditions have been checked','已核实进入条件、设备要求及剩余成本范围']);
  if(state.stage==='operating')check('useDebt',['Test a new loan using the platform screening terms','按平台初筛条件测算新增贷款']);
  const source=h('input',{type:'text','aria-label':L(['Source document / assumption reference','资料或假设依据']),onchange:event=>change('source',event.target.value.trim())});source.value=state.source||'';
  card.append(h('label',{class:'acq-source'},L(['Source document / assumption reference','资料或假设依据']),source));
  card.append(h('p',{class:'cap'},L(['The cash-tax estimate does not assume depreciation or interest tax relief. Construction contingencies apply only to the unfixed-price portion.','现金税费暂不假定折旧或利息抵税；建设预备费只加在尚未锁定价格的施工部分。'])));
  if(state.stage==='greenfield'){
    number('developmentPerMW',['Remaining development spending / MW','剩余开发支出／MW']);
    number('onTimePercent',['Chance of completion on time (%)','按时建成的估计概率（%）'],{max:100});
    number('delayedPercent',['Chance of delayed completion (%)','延期建成的估计概率（%）'],{max:100});
    number('delayMonths',['Delay if completion is late (months)','延期情景多等几个月'],{max:240});
    number('failureSpendPerMW',['Cash spent if development fails / MW','开发失败前累计花出的现金／MW']);
    number('failureRefundPerMW',['Refund after failure / MW','失败后可退回的金额／MW']);
    number('refundMonths',['Months to receive a failure refund','失败后等待退款的月数'],{max:240});
    card.append(h('p',{class:'cap'},L(['The remaining probability is development failure. Leave unknown items blank to use the reference range.','剩余概率按开发失败处理；未知项可留空，采用参考情景区间。'])));
  }
  const underwrite={...state,strategyId,economicOverrides,
    conditionsMet:state.conditionsMet?true:undefined,
    cashTaxRate:state.taxPercent==null?state.cashTaxRate:state.taxPercent/100,
    sources:state.source?[state.source]:state.sources||[],
    debt:state.stage==='operating'&&state.useDebt?{mode:'new'}:null,
    saleTax:state.saleTaxPercent==null?state.saleTax:{rate:state.saleTaxPercent/100,basisPerMW:state.saleTaxBasisPerMW,includePurchase:true},
    ...(state.stage==='ready-to-build'&&Number.isFinite(state.remainingBuildPerMW)&&Number.isFinite(state.unfixedConstructionPerMW)&&state.unfixedConstructionPerMW<=state.remainingBuildPerMW&&state.monthsToOperation>0?{
      scenarios:[{probability:1,codYears:state.monthsToOperation/12,operates:true,costs:[{at:state.monthsToOperation/24,amount:state.remainingBuildPerMW+state.unfixedConstructionPerMW*.075}],recoveries:[]}],
    }:{}),
  };
  const greenKeys=['remainingBuildPerMW','unfixedConstructionPerMW','monthsToOperation','developmentPerMW','onTimePercent','delayedPercent','delayMonths','failureSpendPerMW','failureRefundPerMW','refundMonths'];
  if(state.stage==='greenfield'&&greenKeys.every(key=>Number.isFinite(state[key])&&state[key]>=0)&&state.monthsToOperation>0&&state.onTimePercent+state.delayedPercent<=100&&state.unfixedConstructionPerMW<=state.remainingBuildPerMW){
    const costs=codYears=>[{at:0,amount:state.developmentPerMW},{at:codYears/2,amount:state.remainingBuildPerMW+state.unfixedConstructionPerMW*.1}];
    underwrite.scenarios=[
      {probability:state.onTimePercent/100,codYears:state.monthsToOperation/12,operates:true,costs:costs(state.monthsToOperation/12),recoveries:[]},
      {probability:state.delayedPercent/100,codYears:(state.monthsToOperation+state.delayMonths)/12,operates:true,costs:costs((state.monthsToOperation+state.delayMonths)/12),recoveries:[]},
      {probability:1-(state.onTimePercent+state.delayedPercent)/100,codYears:0,operates:false,costs:[{at:0,amount:state.failureSpendPerMW}],recoveries:[{at:state.refundMonths/12,amount:state.failureRefundPerMW}]},
    ];underwrite.developmentRiskConfirmed=true;
  }
  const project=marketAcquisition(market,state.stage,investor,underwrite),input=project.input;
  const result=project.result.status==='priced'?project.result:marketAcquisitionReference(market,state.stage,investor,underwrite);
  const output=h('div',{class:'acq-lab-output','aria-live':'polite'});
  if(['priced','reference'].includes(result.status)){
    output.append(acquisitionPrice(result));
    if(Number.isFinite(state.purchasePricePerMW)){
      const outcomes=result.status==='reference'?result.referenceCases.map(c=>c.atPrice):[returnAtAcquisitionPrice(input,investor,state.purchasePricePerMW)];
      const returns=outcomes.map(o=>o?.annualReturn).filter(Number.isFinite).sort((a,b)=>a-b);
      const distinct=[...new Set(returns.map(r=>(r*100).toFixed(1)+'%'))];
      output.append(h('div',{class:'acq-at-price'},h('strong',{},L(['Expected annual return at your price','按你的报价测算的年化回报'])),
        h('p',{},returns.length===outcomes.length?distinct.join(' – '):L(['These cash flows do not produce one reliable annual return.','这组现金流无法给出唯一可靠的年化回报。'])),
        explanation(L(['How this was calculated','这项回报如何计算']),['Return at your purchase price','按报价计算回报'],h('p',{},L([
          'Uses your asking price, the inputs above and reference assumptions for anything left blank. For greenfield and RTB, shows the lower return from holding or selling; operating assets are held. Development returns use probability-weighted cash flows. Project taxes and future spending are included.',
          '使用你输入的收购价和项目资料，留空项采用参考假设。绿地和RTB比较长持、出售两条路线，显示较低回报；运营资产按长持计算。开发情景采用按概率加权的现金流，已计项目税费和后续投入。'])))));
    }
    if(!ARCHETYPES[investor].entersAt.includes(state.stage))output.append(h('p',{class:'cap'},L(['Scenario reference: this buyer’s usual entry conditions are not cleared by calculating a price.','情景参考：算得出价格，不表示这类买方已满足该阶段的进入条件。'])));
    const download=h('button',{class:'btn',type:'button',onclick:()=>{
      const snapshot={version:2,kind:'acquisition-case',savedAt:new Date().toISOString(),market:id,investor,input,
        ...(result.status==='reference'?{referenceInputs:referenceInputs(market,state.stage,underwrite)}:{}),result};
      const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));
      const link=h('a',{href:url,download:`${id}-${state.stage}-acquisition.json`});link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }},L(['Save this calculation','保存本次测算']));output.append(download);
  }else if(result.status==='no-positive-price')output.append(h('p',{},L(['No positive purchase price meets the required return on every applicable route. Reassess future costs and revenues.','当前没有正收购价能让所有适用路线达到目标回报；需重新评估后续成本和收入。'])));
  else {
    const labels=[...new Map(result.missing.map(key=>{
      const label=reasons[key]||(key.startsWith('year ')?['Annual revenue, costs and tax schedule','各年收入、成本和税费']:['Project input: '+key,'项目输入：'+key]);
      return [label[0],label];
    })).values()];
    output.append(h('p',{},L(['Complete the project inputs to see the ceiling and its return target.','填写项目资料后，显示收购上限及对应目标回报。'])),
      h('details',{},h('summary',{},L(['What still needs checking','还需核实哪些资料'])),h('ul',{},labels.map(label=>h('li',{},L(label))))));
  }
  card.append(output);parent.append(card);
}
