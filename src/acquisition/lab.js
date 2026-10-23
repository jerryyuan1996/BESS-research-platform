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
import { incomeOptions } from './scenarios.js';
import { workableTerms } from './workableTerms.js';

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
  const selectedIncome=state.incomeScenario||strategyId;
  if(investor==='developer'&&state.stage==='operating')state.stage='ready-to-build';
  const card=h('section',{class:'card acq-lab'},h('h2',{},L(['What is the most I should pay?','这项资产最多值得付多少钱？'])));
  const fields=h('div',{class:'acq-form'});
  const change=(key,value)=>{state[key]=value;if(key==='stage')homeState.acquisitionStage=value;requestRender();};
  const stage=h('select',{'aria-label':L(['Acquisition stage','收购阶段']),onchange:event=>change('stage',event.target.value)},STAGES.filter(s=>!(investor==='developer'&&s==='operating')).map(s=>h('option',{value:s},L(STAGE_LABEL[s]))));
  stage.value=state.stage;
  const buyer=h('select',{'aria-label':L(['Buyer type','买方类型']),onchange:event=>{setLens(event.target.value);requestRender();}},
    Object.keys(ARCHETYPES).map(key=>h('option',{value:key},L(ARCHETYPES[key].label))));buyer.value=investor;
  card.append(h('label',{},L(['Buyer type ','买方类型 ']),buyer),' ',h('label',{},L(['Acquisition stage ','收购阶段 ']),stage),fields);
  const income=h('select',{'aria-label':L(['Income arrangement','收入方案']),onchange:e=>change('incomeScenario',e.target.value)},incomeOptions(market).map(o=>h('option',{value:o.id},L(o.label))));income.value=selectedIncome;
  const incomeHelp=explanation(L(['How income contracts change the return','收入合同怎样改变回报']),['Income assumptions','收入条件说明'],h('p',{},L(['Compare the market route with a negotiated floor or fixed income contract. Assumed contracts are conditional scenarios, not offers from an offtaker. A fixed fee replaces trading income for its term; a floor keeps only trading income above the floor.','可对比市场交易、谈判保底与固定收入合同。假设合同是条件情景，不代表已有交易对手报价。固定付费在合同期内替代交易收入；保底只另计超过底线的交易收入。'])));
  card.append(h('label',{class:'acq-source'},L(['Income arrangement ','收入方案 ']),income),incomeHelp);
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
  number('targetPercent',['Your target annual return (%)','你要求的目标年化回报（%）'],{max:100});
  number('economicLifeYears',['Total operating life from commissioning (years)','从投运起的总运营年限（年）'],{min:1,max:35,step:1});
  if(selectedIncome!=='mer'){
    number('contractIncomePerMW',['Fixed annual contract income / MW','每年固定合同收入／MW']);
    number('contractTenorYears',['Contract term from commissioning (years)','从投运起的合同年限（年）'],{min:1,max:35,step:1});
  }
  if(id==='nem'&&selectedIncome==='ltda'){
    number('cisFloorPerMW',['CIS eligible-revenue floor / MW/year','CIS合同口径收入底线／MW／年']);
    number('cisCeilingPerMW',['CIS eligible-revenue ceiling / MW/year','CIS合同口径收入上限／MW／年']);
    number('cisPaymentCapPerMW',['CIS annual support payment cap / MW','CIS年度补足款上限／MW']);
  }
  number('taxPercent',['Corporate income tax (%)','企业所得税率（%）'],{max:100});
  number('depreciationYears',['Tax depreciation period (years, assumed)','税务折旧年限（假设）'],{min:1,max:40,step:1});
  number('inflationPercent',['Inflation assumption (%)','通胀假设（%）'],{max:20});
  number('decommissioningPerMW',['Decommissioning / MW, native currency','退役费用／MW，原币']);
  number('fixedFeesPerMW',['Fixed transaction fees / MW, native currency','固定交易费用／MW，原币']);
  if(state.stage==='operating'){
    number('initialWorksPerMW',['Immediate refurbishment budget / MW, native currency','接手后立即所需改造预算／MW，原币']);
    number('existingNetDebtPerMW',['Net debt assumed / MW, native currency','承接净债务／MW，原币'],{min:-1e12});
    number('operatingAgeYears',['Completed operating years','已完整运行年数'],{max:34,step:1});
    const transaction=h('select',{'aria-label':L(['Purchase structure','交易结构']),onchange:e=>change('transactionType',e.target.value)},[
      h('option',{value:'asset'},L(['Asset purchase: tax basis linked to price','资产收购：税基与买入价关联'])),h('option',{value:'share'},L(['Share purchase: inherit project tax basis','股权收购：承接项目原税基']))]);transaction.value=state.transactionType||'asset';
    fields.append(h('label',{},L(['Purchase structure','交易结构']),transaction));
    if(state.transactionType==='share')number('inheritedTaxBasisPerMW',['Inherited depreciable tax basis / MW','承接的可折旧税基／MW']);
  }else{
    number('remainingBuildPerMW',['Remaining construction and grid budget / MW','剩余建设及并网预算／MW']);
    number('unfixedConstructionPerMW',['Of that: construction not under fixed-price contracts / MW','其中：未锁定价格的施工成本／MW']);
    number('monthsToOperation',['Months from closing to operation','交割至投运所需月数'],{max:240});
    number('saleTaxPercent',['Tax on sale gain (%)','出售收益税率（%）'],{max:100});
    number('saleTaxBasisPerMW',['Sale tax cost basis excluding purchase / MW','出售计税成本（不含收购价）／MW']);
    number('capitalSupportPerMW',['Other capital grant received after operation / MW','投运后收到的其他资本补助／MW']);
    number('supportLagMonths',['Months after operation to receive support','投运后等待补助或抵免款的月数'],{max:120});
    if(['pjm','ercot','caiso'].includes(id)){
      const support=h('select',{'aria-label':L(['US investment credit scenario','美国投资抵免情景']),onchange:e=>change('supportCase',e.target.value)},[
        h('option',{value:'none'},L(['No investment credit assumed','暂不假设投资抵免'])),
        h('option',{value:'us-itc6'},L(['6% credit if eligible','假设符合6%抵免条件'])),h('option',{value:'us-itc30'},L(['30% credit if enhanced requirements are met','假设满足提高至30%的条件']))]);support.value=state.supportCase||'none';
      fields.append(h('label',{},L(['US investment credit scenario','美国投资抵免情景']),support));
      number('eligibleTaxCreditBasisPerMW',['Eligible investment-credit cost basis / MW','可申请投资抵免的合资格成本／MW']);
      card.append(explanation(L(['Investment credit assumptions','投资抵免假设']),['Conditional tax support','有条件的税收支持'],h('p',{},L(['Only tests a qualifying new-storage project. Eligibility, wage and apprenticeship requirements, timing, ownership and supply-chain restrictions require project evidence. Default eligible basis is 85% of construction, with 95% cash realisation one year after operation and a tax-basis reduction of half the gross credit. No bonus credit is assumed.','仅测算假设合资格的新建储能项目。适用资格、工资与学徒条件、时间、所有权及供应链限制须用项目资料核实。缺资料时假设85%建设费合资格、95%抵免金额在投运后一年变现，税基减少抵免额的一半；不自动增加额外奖励抵免。']))));
    }
  }
  const check=(key,label)=>{const input=h('input',{type:'checkbox',onchange:event=>change(key,event.target.checked)});input.checked=!!state[key];card.append(h('label',{class:'acq-check'},input,L(label)));};
  check('contractConfirmed',['Selected revenue contracts have been obtained and can be transferred','所选收入合同已取得且可转让']);
  check('conditionsMet',['Entry, equipment and remaining cost conditions have been checked','已核实进入条件、设备要求及剩余成本范围']);
  if(state.stage==='operating')check('useDebt',['Test a new loan using the platform screening terms','按平台初筛条件测算新增贷款']);
  const source=h('input',{type:'text','aria-label':L(['Source document / assumption reference','资料或假设依据']),onchange:event=>change('source',event.target.value.trim())});source.value=state.source||'';
  card.append(h('label',{class:'acq-source'},L(['Source document / assumption reference','资料或假设依据']),source));
  card.append(explanation(L(['Tax, inflation and lifetime assumptions','税费、通胀与运营年限说明']),['Calculation basis','测算口径'],h('p',{},L(['Returns are nominal and after modelled project tax. The reference uses straight-line depreciation on an assumed 85% depreciable cost share, loss carry-forward and interest deductions limited to 30% of positive operating earnings. Local allowances and eligibility can differ; replace the tax basis and period with project evidence. References compare 15, 20 and 25 years with contract expiry, battery fade and ongoing service costs.','回报采用含通胀、扣项目税后的口径。参考情景假设85%成本可按直线折旧，计入亏损结转，利息扣除暂以正运营收益的30%为限；各地实际规则可能不同，可用项目税基和折旧年限替换。15／20／25年情景均计合同到期、衰减和持续服务费。']))));
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
  const underwrite={...state,strategyId:selectedIncome,economicOverrides,
    targetReturn:state.targetPercent==null?undefined:state.targetPercent/100,
    inflationRate:state.inflationPercent==null?undefined:state.inflationPercent/100,
    conditionsMet:state.conditionsMet?true:undefined,
    cashTaxRate:state.taxPercent==null?state.cashTaxRate:state.taxPercent/100,
    sources:state.source?[state.source]:state.sources||[],
    debt:state.stage==='operating'&&state.useDebt?{mode:'new'}:null,
    saleTax:state.saleTaxPercent==null?state.saleTax:{rate:state.saleTaxPercent/100,basisPerMW:state.saleTaxBasisPerMW,includePurchase:true},
  };
  const project=marketAcquisition(market,state.stage,investor,underwrite),input=project.input;
  const result=project.result.status==='priced'&&Array.isArray(underwrite.annual)?project.result:marketAcquisitionReference(market,state.stage,investor,underwrite);
  const output=h('div',{class:'acq-lab-output','aria-live':'polite'});
  if(['priced','reference'].includes(result.status)){
    output.append(acquisitionPrice(result));
    if(Number.isFinite(state.purchasePricePerMW)){
      const outcomes=result.status==='reference'?result.referenceCases.map(c=>c.atPrice):[returnAtAcquisitionPrice(input,investor,state.purchasePricePerMW,{route:state.returnRoute})];
      const returns=outcomes.map(o=>o?.annualReturn).filter(Number.isFinite).sort((a,b)=>a-b);
      const format=r=>(r*100).toFixed(1)+'%';
      const baseIndex=result.status==='reference'?result.referenceCases.findIndex(c=>c.key==='base'):0;
      const central=outcomes[Math.max(0,baseIndex)]?.annualReturn;
      output.append(h('div',{class:'acq-at-price'},h('strong',{},L(['Expected annual return at your price','按你的报价测算的年化回报'])),
        h('p',{},Number.isFinite(central)?format(central):L(['These cash flows do not produce one reliable annual return.','这组现金流无法给出唯一可靠的年化回报。'])),
        returns.length>1?h('div',{class:'acq-basis'},L(['Reference case above; scenario range: ','上方为基准情景；情景区间：']),format(returns[0])+' – '+format(returns.at(-1))):null,
        explanation(L(['How this was calculated','这项回报如何计算']),['Return at your purchase price','按报价计算回报'],h('p',{},L([
          'Uses your asking price and the selected ownership route; blank inputs use reference assumptions. The default compares holding and selling and displays the lower return. The price ceiling continues to require both applicable routes. Operating assets are held. Development cash flows are probability weighted. Tax and future spending are included.',
          '使用你输入的收购价与选定的持有方式，留空项采用参考假设。默认比较长持与出售，显示较低回报；收购上限仍要求适用的两条路线均达到目标。运营资产按长持计算。开发现金流按概率加权，已扣税费和后续投入。'])))));
    }
    const route=h('select',{'aria-label':L(['Return ownership route','回报计算的持有方式']),onchange:e=>change('returnRoute',e.target.value)},[
      ...(state.stage==='operating'?[]:[h('option',{value:'conservative'},L(['Lower of holding and selling','长持与出售回报取较低值']))]),
      h('option',{value:'hold'},L(['Long-term hold','长期持有'])),
      ...(state.stage==='operating'?[]:[h('option',{value:'sale'},L(investor==='developer'?['Sell at operation start','投运时出售']:['Sell after five operating years','投运后第5年出售']))])]);route.value=state.stage==='operating'?'hold':state.returnRoute||'conservative';
    output.append(h('label',{class:'acq-source'},L(['Return ownership route','回报计算的持有方式']),route));
    const termsContent=h('div',{class:'acq-workable-content'});
    const terms=h('details',{class:'acq-workable',ontoggle:()=>{
      if(!terms.open||termsContent.childElementCount)return;
      const t=workableTerms(market,state.stage,investor,underwrite);if(!t)return;
      const money=x=>new Intl.NumberFormat('en',{style:'currency',currency:t.currency,maximumFractionDigits:0}).format(x),pct=x=>(x*100).toFixed(1)+'%';
      termsContent.append(h('p',{},L([`At a purchase price of ${money(t.pricePerMW)}/MW and a ${pct(t.targetReturn)} target, the reference case supports these conditional terms:`,`按收购价${money(t.pricePerMW)}/MW、目标回报${pct(t.targetReturn)}，基准情景反推条件如下：`])),
        t.maxBuild==null?null:h('p',{},L(['Maximum fully priced construction and grid budget: ','已全部定价的建设与并网总预算上限：']),h('strong',{},money(Math.floor(t.maxBuild/1000)*1000)+'/MW')),
        t.minimumContractIncome==null?null:h('p',{},L([`Minimum annual fixed income for ${t.contractYears} years: `,`${t.contractYears}年固定收入合同，每年至少需要：`]),h('strong',{},money(Math.ceil(t.minimumContractIncome/1000)*1000)+'/MW')),
        t.minimumContractYears==null?null:h('p',{},L(['Minimum term at your fixed contract income: ','按你输入的固定收入，至少需要签约：']),t.minimumContractYears,L([' years','年'])),
        h('p',{class:'acq-basis'},L(['Each condition moves one input. Fixed fees replace trading during the term, followed by assumed market income. A minimum term does not lock in the lifetime return. An offtaker must offer these terms. The conservative ceiling still requires both ownership routes.','各条件分别只改变一个输入。固定收入在合同期内替代交易，期满后恢复假设的市场收入；最短合同不代表锁定全周期回报。须有交易对手提供这些条件，保守上限仍要求两条持有路线均达标。'])),
        h('table',{class:'acq-sensitivity'},h('caption',{},L(['Your return requirement and the price it supports','你的回报要求与对应收购上限'])),
          h('thead',{},h('tr',{},h('th',{},L(['Target','目标回报'])),h('th',{},L(['Maximum price / MW','收购上限／MW'])))),
          h('tbody',{},t.priceSensitivity.map(c=>h('tr',{},h('td',{},pct(c.targetReturn)),h('td',{},c.status==='priced'?money(Math.floor(c.pricePerMW/1000)*1000):L(['Requires improved terms','需改善条件'])))))),
        ...t.delays.map(d=>h('p',{},L([`If operation is delayed ${d.months} months: `,`若投运推迟${d.months}个月：`]),L(['price ceiling ','收购上限 ']),money(Math.floor(d.pricePerMW/1000)*1000)+'/MW',d.atPrice?L(['; return at your price ','；按当前报价的回报 '])+pct(d.atPrice.annualReturn):'')));
    }},h('summary',{},L(['What price, build budget or contract would meet my target?','什么价格、建设预算或合同条件能达到我的目标？'])),termsContent);output.append(terms);
    if(!ARCHETYPES[investor].entersAt.includes(state.stage))output.append(h('p',{class:'cap'},L(['Scenario reference: this buyer’s usual entry conditions are not cleared by calculating a price.','情景参考：算得出价格，不表示这类买方已满足该阶段的进入条件。'])));
    const download=h('button',{class:'btn',type:'button',onclick:()=>{
      const refs=result.status==='reference'?referenceInputs(market,state.stage,underwrite):null;
      const snapshot={version:3,kind:'acquisition-case',savedAt:new Date().toISOString(),market:id,investor,input:refs?.find(c=>c.key==='base')?.input??input,
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
