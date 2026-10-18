import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, setLens } from '../app/state.js';
import { homeState } from '../home/state.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { STAGES, STAGE_LABEL } from './parameters.js';
import { marketAcquisition } from './reference.js';
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
  if(!inputs.has(id))inputs.set(id,{stage:homeState.acquisitionStage,...(market.comparison.acquisition||{})});
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
  const number=(key,label,{max=1e12,min=0,step='any'}={})=>{
    const input=h('input',{type:'number',min,max,step,'aria-label':L(label),onchange:event=>{
      if(!event.target.checkValidity()){event.target.reportValidity();return;}
      change(key,event.target.value===''?undefined:Number(event.target.value));
    }});if(state[key]!=null)input.value=state[key];
    fields.append(h('label',{},L(label),input));
  };
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
    card.append(h('p',{class:'cap'},L(['The remaining probability is development failure. Supply a source for these assumptions; none is pre-filled.','剩余概率按开发失败处理。请为这些假设提供依据，平台不预填统一成功率。'])));
  }
  const underwrite={...state,strategyId,economicOverrides,
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
  const {input,result}=marketAcquisition(market,state.stage,investor,underwrite);
  const output=h('div',{class:'acq-lab-output','aria-live':'polite'});
  if(result.status==='priced'){
    output.append(acquisitionPrice(result));
    if(!ARCHETYPES[investor].entersAt.includes(state.stage))output.append(h('p',{class:'cap'},L(['Scenario reference: this buyer’s usual entry conditions are not cleared by calculating a price.','情景参考：算得出价格，不表示这类买方已满足该阶段的进入条件。'])));
    const download=h('button',{class:'btn',type:'button',onclick:()=>{
      const snapshot={version:1,kind:'acquisition-case',savedAt:new Date().toISOString(),market:id,investor,input,result};
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
