import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app } from '../app/state.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { strategyById } from '../comparison/strategies.js';
import { STAGE_LABEL } from '../acquisition/parameters.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { acquisitionCashFlows } from '../acquisition/valuation.js';
import { link, sectionTitle, eyebrow, metric } from '../experience/chrome.js';
import { money, pct } from '../experience/model.js';
import { SPECIAL_OPPORTUNITIES, SCOUT_OPPORTUNITIES, opportunitiesFor, opportunityById, RESEARCH_DATE } from './catalog.js';
import { compareOpportunity, defaultOpportunityStage, beatsConventional } from './model.js';
import { REVENUE_MECHANISMS, revenueMechanismsFor } from './revenue.js';

const session = new Map();
const external = (url, label) => h('a', { href:url, target:'_blank', rel:'noopener noreferrer' }, L(label), ' ↗');
const routeLabel = id => L(strategyById(id)?.n || id);
const moneyMW = (x,c) => Number.isFinite(x) ? money(x,c) + '/MW' : L(['No supported price','尚不支持出价']);
const returnLabel = r => r ? pct(r.annualReturn) : L(['No unique IRR','无唯一IRR']);
const ownedRoute = (r,investor) => r?.route === 'sale'
  ? L(investor === 'developer' ? ['Sale at COD','投运出售'] : ['Sale after 5 operating years','投运后第5年出售'])
  : L(['Long-term hold','长期持有']);


export function revenueMechanismSection(row) {
  const route = row.play?.route || 'mer';
  return h('section',{class:'ix-section',id:'revenue-drivers'},
    sectionTitle(['WHY THE REVENUE EXISTS','收入背后的经济动因'],['Who pays, and why?','谁在付钱，为什么付钱？'],
      ['Mechanism facts are linked below. Pricing incentives and investment implications are the platform’s economic interpretation.','机制事实附有来源；定价动因和投资含义为平台的经济解读。']),
    h('p',{class:'ix-caption'},L(['Current play: ','当前play：']),routeLabel(route),
      L(['. Applicability is different from a signed project contract.','. 机制适用性与项目已签合同分别判断。'])),
    ...[...revenueMechanismsFor(row.market,route), ...(row.id==='it'&&route!=='ltda'?['macse']:[])].map((id,i)=>{
      const m=REVENUE_MECHANISMS[id];
      return h('details',{class:'ix-mechanism',...(i===0?{open:''}:{})},
        h('summary',{},h('span',{class:'ix-step-number'},String(i+1).padStart(2,'0')),h('strong',{},L(m.title))),
        id==='macse'&&route!=='ltda'?h('p',{class:'ix-caption'},L(['Alternative award route, evaluated separately from the current capacity-market play.','另一条独立的中标路径，与当前容量市场play分别测算。'])):null,
        h('div',{class:'ix-mechanism-grid'},[
          [['Who pays','付款方'],'payer'],[['The problem it solves','解决什么矛盾'],'problem'],
          [['How the price forms','为什么这样定价'],'pricing'],[['Short- and long-term drivers','短期与长期驱动'],'drivers'],
        ].map(([label,key])=>h('article',{},h('h4',{},L(label)),h('p',{},L(m[key]))))),
        h('p',{class:'ix-mechanism-discipline'},h('strong',{},L(['Underwriting implication: ','对投资测算的含义：'])),L(m.discipline)),
        h('div',{class:'ix-mechanism-sources'},m.sources.map(([label,url])=>external(url,label))));
    }));
}

/* A special opportunity is valid when, at the default inputs, its all-equity
   IRR beats the conventional play's in the same market. */
const isValid = beatsConventional;
/** The valid special opportunities for this market and investor, and the
 * conventional case on its own for the delivery timeline when none is valid. */
export function specialOpportunityScreen(row, investor) {
  const screened = opportunitiesFor(row.id).map(o => ({ o, c: compareOpportunity(row.market, o, investor, row.play, {}) }));
  const priced = screened.find(x => !x.c.unavailable)?.c;
  return { valid: screened.filter(x => isValid(x.c)).map(x => x.o),
    conventional: priced ? { standard: priced.standard, stage: priced.stage } : null };
}

/** This same workbench is mounted in the overview and the Investment Lab.
 * Input state is session-local; deal prices are not sent to a service or URL. */
export function opportunityComparison(row, investor, {compact=false,only=null}={}) {
  const available = opportunitiesFor(row.id).filter(o => !only || only.some(v => v.id === o.id));
  if (!available.length) return null;
  const key=row.id+'/'+investor;
  const requested = new URLSearchParams(window.location.search).get('opportunity');
  if (!session.has(key)) session.set(key,{id:available.find(o=>o.id===requested)?.id||available[0].id,values:{}});
  const state=session.get(key);
  if (requested && available.some(o=>o.id===requested)) state.id=requested;
  const o = opportunityById(state.id);
  const section = h('section',{class:'ix-section ix-opportunity-comparison',id:'opportunity-comparison'},
    sectionTitle(['LIKE-FOR-LIKE UNDERWRITING','同口径投资测算'],['Conventional play or special opportunity?','常规play，还是特殊机会？'],
      ['Compare value from the same closing date. Both cases use the existing acquisition engine.','从同一交割日比较价值，两边均采用现有收购估值引擎。']));
  const controls=h('div',{class:'ix-opportunity-controls'});
  const stage=h('select',{'aria-label':L(['Comparison entry stage','比较进入阶段']),onchange:e=>{state.values.stage=e.target.value;draw();}});
  for(const s of ['greenfield','ready-to-build'].filter(s=>ARCHETYPES[investor].entersAt.includes(s)))stage.append(h('option',{value:s},L(STAGE_LABEL[s])));
  stage.value=state.values.stage||defaultOpportunityStage(investor);
  controls.append(h('label',{},L(['Same entry stage','相同进入阶段']),stage));
  const plays=Object.entries(HOME_BRIEFING.plays).filter(([k])=>k.startsWith(row.id+'/')).map(([,p])=>p);
  const selectedPlay=()=>plays.find(p=>p.id===state.playId)||row.play;
  if(plays.length){
    const select=h('select',{'aria-label':L(['Conventional play','常规play']),onchange:e=>{state.playId=e.target.value;draw();}},
      plays.map(p=>h('option',{value:p.id},L(p.label))));
    select.value=selectedPlay()?.id||plays[0].id;
    controls.append(h('label',{},L(['Conventional play','常规play']),select));
  }
  section.append(controls,h('div',{class:'ix-opportunity-thesis'},h('h3',{},L(o.label)),h('p',{},L(o.thesis)),
    h('p',{},h('strong',{},L(['Conditions: ','适用条件：'])),L(o.conditions)),
    h('p',{},h('strong',{},L(['What can erase the advantage: ','可能抵消优势的因素：'])),L(o.risk)),
    h('p',{class:'ix-caption'},external(o.source,['Rule / operator source','规则／运营商来源']),' · '+RESEARCH_DATE,
      ' · ',L([o.months.join('–')+' months is a research screening range from site control; the comparison below uses an editable closing-to-COD assumption.',
        o.months.join('–')+'个月为从场址控制起算的研究筛选区间；下方测算使用可编辑的交割至COD假设。']))));
  const inputs=h('details',{class:'ix-details ix-opportunity-inputs'},
    h('summary',{},L(['Set prices, timing and the differences between the projects','调整价格、时间及两种项目的差异'])));
  const form=h('div',{class:'ix-opportunity-form'}), fieldNodes=new Map();
  const definitions=[
    ['purchasePricePerMW',['Common site/project price / MW','两边共同的场址／项目收购价／MW'],0,1e12],
    ['nodePremiumPerMW',['Extra price for the special route / MW','特殊路径额外收购对价／MW'],0,1e12],
    ['targetPercent',['Common target return (%)','统一目标回报（%）'],.01,100],
    ['lifeYears',['Common operating life (years)','统一运营寿命（年）'],6,35,1],
    ['baselineMonths',['Conventional: closing to COD (months)','常规：交割至COD（月）'],0,240],
    ['specialMonths',['Special: closing to COD (months)','特殊：交割至COD（月）'],0,240],
    ['baselineQualificationMonths',['Conventional: COD to revenue eligibility (months)','常规：COD至收入资格（月）'],0,120],
    ['specialQualificationMonths',['Special: COD to revenue eligibility (months)','特殊：COD至收入资格（月）'],0,120],
    ['buildPremiumPct',['Special: build cost change (%)','特殊：单位建设费变化（%）'],-100,300],
    ['opexPremiumPct',['Special: operating cost change (%)','特殊：单位运维费变化（%）'],-100,300],
    ['retrofitPerMW',['Special: extra retrofit budget / MW','特殊：额外改造预算／MW'],0,1e12],
    ['avoidedGridPerMW',['Special: avoided works budget / MW','特殊：节省的电网工程预算／MW'],0,1e12],
    ['revenueHaircutPct',['Special: at-risk income haircut (%)','特殊：风险收入下调（%）'],0,100],
  ];
  for(const [id,label,min,max,step] of definitions){
    const input=h('input',{type:'number',min,max,step:step||'any','aria-label':L(label),
      onchange:e=>{
        if(!e.target.checkValidity()){e.target.reportValidity();return;}
        if(e.target.value==='')delete state.values[id];else state.values[id]=Number(e.target.value);
        draw();
      }});
    fieldNodes.set(id,input);form.append(h('label',{},L(label),input));
  }
  inputs.append(h('p',{class:'ix-caption'},L(['All money inputs use the underlying cash-flow currency per MW, shown below. Cost uplifts are editable house assumptions. Zero retrofit or avoided works is a scenario input, not a verified zero-cost quote.','所有金额均为下方标明的底层现金流原币／MW。成本上浮是可编辑的平台假设。改造或节省费用为零是情景输入，不代表已核实的零成本报价。'])),form);
  const output=h('div',{class:'ix-opportunity-output','aria-live':'polite'});
  const reset=h('button',{type:'button',class:'ix-button ix-outline',onclick:()=>{state.values={};stage.value=defaultOpportunityStage(investor);draw();}},L(['Reset scenario','重置情景']));
  const download=h('button',{type:'button',class:'ix-button ix-outline'},L(['Download assumptions & cash flows','下载假设与现金流']));
  section.append(inputs,output,h('div',{class:'ix-actions'},reset,download));
  function draw(){
    const c=compareOpportunity(row.market,o,investor,selectedPlay(),state.values);
    output.replaceChildren();
    if(c.unavailable){output.append(h('p',{class:'ix-model-error',role:'alert'},L(['This combination cannot be priced. Check entry stage, duration, budget and available revenue route.','此组合暂无法定价，请检查进入阶段、时长、预算及收入路径的适用性。'])));download.disabled=true;return;}
    download.disabled=false;
    for(const [id,input]of fieldNodes)input.value=c.inputs[id];
    const a=c.standard,b=c.alternative,currency=c.currency;
    output.append(h('p',{class:'ix-comparison-basis'},L([
      currency+' per MW · nominal after project tax · all cash before COD · '+c.inputs.lifeYears+' operating years · '+pct(c.targetReturn)+' common target',
      currency+'／MW · 税后名义回报 · 投运前全现金 · '+c.inputs.lifeYears+'年运营寿命 · 统一目标'+pct(c.targetReturn)
    ])));
    const rows=[
      [['Revenue route','收入路径'],routeLabel(a.input.strategyId),routeLabel(b.input.strategyId)],
      [['Power / duration','功率／时长'],a.input.powerMW+' MW / '+a.input.durationHours+'h',b.input.powerMW+' MW / '+b.input.durationHours+'h'],
      [['Closing → physical COD','交割→实际COD'],a.codMonths.toFixed(1)+L([' months','个月']),b.codMonths.toFixed(1)+L([' months','个月'])],
      [['Closing → revenue eligibility','交割→收入资格'],a.qualifiedMonths.toFixed(1)+L([' months','个月']),b.qualifiedMonths.toFixed(1)+L([' months','个月'])],
      [['Total purchase price / MW','总收购对价／MW'],money(a.price,currency),money(b.price,currency)],
      [['Remaining construction / grid / MW','剩余建设与并网／MW'],money(a.assumptions.buildBudget,currency),money(b.assumptions.buildBudget,currency)],
      [['First-year operating cost / MW','首年运营成本／MW'],money(a.input.annual[0].opex,currency),money(b.input.annual[0].opex,currency)],
      [['Return at the input price','按输入价格计算的回报'],returnLabel(a.atPrice),returnLabel(b.atPrice)],
      [['Long-hold IRR','长期持有IRR'],returnLabel(a.holdReturn),returnLabel(b.holdReturn)],
      [['Sale-route IRR','出售路线IRR'],returnLabel(a.saleReturn),returnLabel(b.saleReturn)],
      [['Binding return route','约束回报的持有方式'],ownedRoute(a.atPrice,investor),ownedRoute(b.atPrice,investor)],
      [['NPV at the common target / MW','统一目标下的NPV／MW'],money(a.npv,currency),money(b.npv,currency)],
      [['Total acquisition ceiling / MW','总收购上限／MW'],moneyMW(a.ceiling.pricePerMW,currency),moneyMW(b.ceiling.pricePerMW,currency)],
    ];
    const comparisonTable=h('div',{class:'ix-table-scroll'},h('table',{class:'ix-table ix-opportunity-table'},
      h('caption',{class:'sr-only'},L(['Conventional and special investment comparison','常规与特殊投资比较'])),
      h('thead',{},h('tr',{},...[['Metric','指标'],['Conventional play','常规play'],['Special opportunity','特殊机会']].map(x=>h('th',{scope:'col'},L(x))))),
      h('tbody',{},rows.map(([label,x,y])=>h('tr',{},h('th',{scope:'row'},L(label)),h('td',{},x),h('td',{},y))))));
    const hasPremiumBudget=c.safePremium!=null&&c.safePremium>1e-6;
    if(hasPremiumBudget)output.append(comparisonTable);
    output.append(h('div',{class:'ix-premium-result '+(c.comparable?'is-supported':'is-conditional')},
      eyebrow(['EXTRA CONNECTION / PROJECT RIGHTS','额外并网点／项目权利对价']),
      h('strong',{'data-premium-ceiling':''},c.safePremium==null?L(['No premium clears both tests','尚无溢价同时通过两项检验']):moneyMW(c.safePremium,currency)),
      c.safePremium==null?null:h('p',{},money(c.safePremiumPerMWh,currency)+'/MWh · '+money(c.safePremium*b.input.powerMW,currency)+L([' for this project','／本项目'])),
      h('p',{},L(c.comparable?['The input premium meets the common return target and preserves at least the conventional NPV on both ownership routes.','当前溢价达到统一目标回报，且两条持有路线的NPV均不低于常规方案。']:['Lower the acquisition price, improve costs or secure revenue before advancing this case. Earlier COD alone does not justify the current terms.','需降低收购对价、改善成本或落实收入后再推进；仅凭提前COD不足以支持当前条件。'])),
      h('p',{class:'ix-caption'},L(['Value-preserving extra price: ','维持相对价值的额外对价：']),moneyMW(c.relativeCeiling,currency),' · ',
        L(['Headroom at the target return: ','达到目标回报后的对价余量：']),moneyMW(c.targetHeadroom,currency)),
      h('p',{class:'ix-caption'},L(['Both limits include acquisition fees and future spending. This is an incremental rights budget above the common price, not an appraisal of a connection without transfer, import/export and permit evidence.','两项上限均计收购费用与未来投入。这是共同收购价以外的增量权利预算；没有转让、双向容量和许可证据，不能据此认定并网点的实际价值。']))));
    if(!hasPremiumBudget)output.append(h('details',{class:'ix-details ix-unpriced-details'},
      h('summary',{},L(['Inspect the calculation and assumptions','展开测算表与依据'])),comparisonTable));
    queueMicrotask(()=>section.dispatchEvent(new CustomEvent('opportunitychange',{bubbles:true,detail:c})));
    output.append(h('details',{class:'ix-details'},h('summary',{},L(['Read the comparison conventions','查看比较口径'])),
      h('p',{},L(['Both designs retain the existing model’s tax, inflation, depreciation, degradation, lifecycle costs and exit valuation. The common price defaults to zero for an incremental development screen, not a free asset offer. The premium ceiling is the lower of the target-return headroom and the value-preserving incremental price.','两种设计保留现有模型的税费、通胀、折旧、衰减、生命周期成本及退出估值。共同收购价默认为零，用于增量开发筛选，不代表资产免费。溢价上限取目标回报余量与维持相对价值的增量价格两者较低值。'])),
      h('p',{},L(['The platform requires both long hold and the investor’s sale route to meet its target; the reported return is the lower of those routes. Developer sale is at COD; other pre-operation buyers sell after five operating years. Development probabilities are unchanged between alternatives.','平台要求长持和该投资者的出售路线均达到目标，显示两者较低回报。开发商出售时点为COD，其他投运前买方为投运后第5年；两种方案采用相同开发概率。'])),
      h('p',{},L(['Revenue eligibility can follow COD. Annual income is prorated for the qualification delay while operating costs continue; contract expiry is not extended. Cash is booked at each operating year end, not immediately on the eligibility date. Hourly dispatch, calendar-vintage contract changes and individual product qualification still require project modelling.','收入资格可晚于COD。模型按资格延迟比例扣减年度收入，运营费照常发生，合同到期不顺延；现金按运营年末计入，并非资格取得当日收款。小时级调度、具体合同日历及逐产品资格仍需项目模型验证。']))));
    download.onclick=()=>{
      const payload={asOf:RESEARCH_DATE,opportunity:o,investor,play:selectedPlay(),assumptions:c.inputs,currency,
        premiumCeilingPerMW:c.safePremium,standard:a,alternative:b,
        cashFlows:Object.fromEntries([['conventional',a],['special',b]].map(([label,r])=>[label,
          Object.fromEntries(['hold','sale'].map(route=>[route,acquisitionCashFlows(r.input,investor,route,r.price).flows]))]))};
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
      const anchor=h('a',{href:url,download:o.id+'-comparison.json'});anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
  }
  draw();
  return section;
}
