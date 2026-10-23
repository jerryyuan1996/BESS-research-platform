import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { STAGE_LABEL } from '../acquisition/parameters.js';
import { expandReferences } from '../acquisition/projection.js';
import { displayedCase, INVESTOR_STRATEGY, DECISION_LABEL, INCOME_LABEL } from '../acquisition/presentation.js';
import { acquisitionPrice } from '../acquisition/view.js';
import { explanation } from '../components/explanation.js';
import { homeState } from './state.js';

const percent=x=>Math.round(x*100)+'%';
const rowKey=r=>[r.investor,r.market,r.playId,r.stage].join('/');
const money=(r,value,mode)=>{
  if(!Number.isFinite(value))return L(['See assumptions','见假设']);
  const currency=mode==='local'?r.currency:'USD',n=value*(mode==='local'?1:r.fxToUSD);
  const number=Math.abs(n)>=1e6?(n/1e6).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+'m'
    :Math.abs(n)>=1000?Math.round(n/1000)+'k':Math.round(n).toLocaleString('en');
  return `${currency} ${number}`;
};
const timeText=(r,c)=>r.stage==='operating'?L(['Already operating','已投运']):
  [...new Set([c.assumptions.codYears,c.assumptions.latestCodYears].map(y=>Math.round(y*12)))].join('–')+L([' months','个月']);

function incomeText(t){
  const years=t.remainingContractYears;
  if(t.kind==='merchant'||!years)return L(['Market trading and grid services; no fixed income assumed.','依靠市场交易与电网服务，未假设固定收入。']);
  if(t.kind==='fixed')return L([`Assumes ${percent(t.capacityShare)} of capacity earns fixed toll payments for ${years} remaining years.`,
    `假设${percent(t.capacityShare)}容量取得固定租赁收入，剩余合同期${years}年。`]);
  if(t.kind==='floor')return L([`Assumes a floor on ${percent(t.capacityShare)} of capacity for ${years} remaining years; trading above the floor adds income.`,
    `假设${percent(t.capacityShare)}容量获得收入保底，剩余保障期${years}年；只另计超过保底的交易收入。`]);
  if(t.kind==='collar')return L([`Assumes ${years} remaining years of CIS protection: ${percent(t.topUpShare)} of a shortfall is covered, subject to caps and upside sharing.`,
    `假设剩余${years}年CIS保障：收入不足部分按${percent(t.topUpShare)}补足，受支付上限和超额回拨约束。`]);
  return L([`About ${percent(t.securedRevenueShare)} of first-year modelled revenue is contracted, for ${years} remaining years; the rest is market-dependent.`,
    `首年预计收入约${percent(t.securedRevenueShare)}来自剩余${years}年的合同，其余依赖市场收入。`]);
}

function bar(value,label,kind='income'){
  return h('div',{class:`ip-bar ip-bar-${kind}`,role:'img','aria-label':label},
    h('span',{style:`width:${Math.max(0,Math.min(100,value*100))}%`}));
}

function termsHelp(r,c,mode){
  const t=c.assumptions.terms,unit=L(['/MW/year','／MW／年']);
  return explanation(L(['Assumptions & ranges','假设与范围']),['What this return is based on','这项回报基于什么'],h('div',{},
    h('p',{},r.playLabel?L(r.playLabel):L(INCOME_LABEL[t.kind])),
    h('p',{},L(['The route, storage duration and any grant belong to this recommended play. Values below use the same scenario as the displayed price and target.','收入方式、储能时长及补助均跟随这项推荐方案。下列条件与当前收购价和目标回报来自同一情景。'])),
    h('p',{},incomeText(t)),
    t.quotedIncomePerMW==null?null:h('p',{},L(['Fixed toll quote per contracted MW: ','每签约MW的固定租赁报价：']),money(r,t.quotedIncomePerMW,mode)+unit),
    t.kind==='collar'?h('p',{},L(['Income ceiling: ','收入上限：']),money(r,t.ceilingPerMW,mode)+unit,
      L([`; payment cap ${money(r,t.paymentCapPerMW,mode)}${unit}; ${percent(t.repaymentShare)} of income above the ceiling is shared back.`,
        `；支付上限${money(r,t.paymentCapPerMW,mode)}${unit}；超过收入上限部分按${percent(t.repaymentShare)}回拨。`])):null,
    h('p',{},L([`Remaining operating life: ${t.lifeYears} years; completed age: ${t.age} years.`,
      `剩余运营期${t.lifeYears}年，已运营${t.age}年。`])),
    h('p',{},L(['Construction is the remaining build, grid and contingency budget in current prices, excluding the acquisition price, separately shown development costs and recoverable VAT. Operating costs are the first full operating year, including recurring modelled service costs, before separately modelled tax and lifecycle spending. Fees already netted from revenue are not charged twice.',
      '建设金额为当前价格下剩余建设、并网及预备费，不含收购款、另列开发费及可退增值税。运营费取首个完整运营年，含模型经常性服务费；税费、设备更换与退役另计。已从收入扣除的费用不重复加算。'])),
    ...r.referenceCases.map(x=>{const q=x.assumptions.terms;return h('p',{},
      L(x.key==='base'?['Reference','基准']:x.key==='cautious'?['Cautious','偏保守']:['Improved','较有利']),
      `: ${timeText(r,x)} · `,L(['build / immediate works ','建设／接手改造 ']),money(r,r.stage==='operating'?q.worksPerMW:q.buildPerMW,mode),
      L(['; annual operating cost ','；年运营费 ']),money(r,q.firstOpexPerMW,mode));}),
    h('p',{},L(['These are coherent scenarios around the market play, not a statistical confidence range. Contract assumptions are conditional, not a signed offer. Source links and detailed tax, rate and funding assumptions are available on the price above.',
      '这些是围绕该市场方案的连贯情景，不是统计置信区间。假设合同是测算条件，不代表已签约报价。公开来源与税费、利率、资金安排可在收购价格说明中查看。'])),
    mode==='usd'?h('p',{},L([`Amounts translated to USD for comparison. The IRR still uses ${r.currency} cash flows; translation does not hedge currency risk.`,
      `金额折成USD方便比较；IRR仍按${r.currency}现金流计算，金额换算不代表汇率已对冲。`])):null));
}

function termsView(r,mode,maxMonths){
  const c=displayedCase(r),t=c.assumptions.terms;
  if(!t)return null;
  const perYear=L(['/MW/year','／MW／年']),perMW=L(['/MW','／MW']);
  const amount=t.kind==='floor'||t.kind==='collar'?t.floorPerMW:t.contractIncomePerMW;
  const label=t.kind==='floor'||t.kind==='collar'?['Income floor','收入下限']:t.kind==='merchant'||!t.remainingContractYears?['Modelled market income','预计市场收入']:['Annual contract income','合同年收入'];
  const annual=t.kind==='merchant'||!t.remainingContractYears?t.firstRevenuePerMW:amount;
  const coverage=t.kind==='collar'?t.topUpShare:t.capacityShare!=null?t.capacityShare:t.securedRevenueShare;
  const coverageLabel=t.kind==='collar'?L([`${percent(coverage)} shortfall support, capped`,`${percent(coverage)}缺口补足，有上限`]):t.capacityShare!=null?L([`${percent(coverage)} of capacity covered`,`${percent(coverage)}容量覆盖`]):
    L([`${percent(coverage)} of first-year revenue contracted`,`${percent(coverage)}首年预计收入来自合同`]);
  return h('div',{class:'ip-terms'},
    h('p',{class:'ip-assumption-sentence'},L(r.stage==='operating'?
      [`Already operating; ${t.lifeYears} operating years remaining.`,`已投运，按剩余${t.lifeYears}年运营测算。`]:
      [`Assumes operation starts ${timeText(r,c)} after closing.`,`预计交割后${timeText(r,c)}并网投运。`]),
      r.stage!=='operating'&&t.constructionMonths&&t.constructionMonths<=c.assumptions.codYears*12?L([
        ` About ${t.constructionMonths} months are construction. `,` 其中施工约${t.constructionMonths}个月。 `]):' ',incomeText(t)),
    h('div',{class:'ip-miniatures'},
      h('div',{},h('span',{class:'ip-small-label'},timeText(r,c)),bar(c.assumptions.codYears*12/maxMonths,L(['Months from closing to operation','交割至投运月数']),'time')),
      h('div',{},h('span',{class:'ip-small-label'},coverageLabel),bar(coverage,coverageLabel,t.kind==='floor'||t.kind==='collar'?'floor':'income'))),
    h('dl',{class:'ip-inputs'},
      h('div',{},h('dt',{},L(label)),h('dd',{},money(r,annual,mode)),h('span',{},perYear)),
      h('div',{},h('dt',{},L(r.stage==='operating'?['Immediate equipment works','接手设备投入']:['Build & grid budget','建设及并网'])),h('dd',{},money(r,r.stage==='operating'?t.worksPerMW:t.buildPerMW,mode)),h('span',{},perMW)),
      h('div',{},h('dt',{},L(['First-year operating costs','首年运营费'])),h('dd',{},money(r,t.firstOpexPerMW,mode)),h('span',{},perYear))),
    t.grantPerMW>0?h('p',{class:'ip-condition'},L(['Requires the play’s awarded capital support: ','须具备该方案的已获批补助：']),money(r,t.grantPerMW,mode)+perMW):null,
    c.key==='base'&&c.status!=='priced'&&Number.isFinite(r.workableBuildPerMW)?h('p',{class:'ip-condition'},L([
      `At this income, build and grid costs must fall to about ${money(r,r.workableBuildPerMW,mode)}/MW before there is room to pay for project rights.`,
      `按这套收入，建设及并网预算需降至约${money(r,r.workableBuildPerMW,mode)}/MW，才开始有支付项目权利收购款的空间。`])):null,
    r.coInvest?h('p',{class:'ip-condition'},L(['Minority co-investment with a local sponsor; price shown for 100% of the RTB project.','跟随本地投资方少数股权跟投；金额按100%可开工项目计算。'])):null,
    termsHelp(r,c,mode));
}

/** Four investor strategies on one page. Every row keeps its own price, target
 * and input scenario; the comparison is presentation-only. */
export function investorHome(briefing,{marketLink,marketName,onProject}={}){
  const all=Object.fromEntries(Object.keys(ARCHETYPES).map(id=>[id,expandReferences(briefing.acquisitions[id]||[],briefing.acquisitionReferenceData)]));
  const flat=Object.values(all).flat(),mode=homeState.referenceCurrency||'usd';
  const maxMonths=Math.max(60,...flat.map(r=>displayedCase(r).assumptions.latestCodYears*12));
  const selected=new Set((homeState.comparisonKeys||[]).filter(key=>flat.some(r=>rowKey(r)===key)));
  const root=h('section',{class:'ip-home acq-home'},
    h('div',{class:'ip-intro'},h('h1',{},L(['Where to invest, and on what terms','投向哪里，什么条件下值得买'])),
      h('p',{},L(['Prioritize workable income and grid access, then set the price. Compare the assumptions beside each return.','先看收入和并网能否落实，再决定买入价格。每项回报旁都列出成立条件。']))));
  const filter=homeState.investorFilter||'all';
  root.append(h('div',{class:'bf-lens ip-toolbar',role:'group','aria-label':L(['Investor view','投资者视角'])},
    ...['all',...Object.keys(ARCHETYPES)].map(id=>h('button',{type:'button',class:'btn', 'aria-pressed':String(filter===id),
      onclick:()=>{homeState.investorFilter=id;requestRender();}},id==='all'?L(['All investors','全部投资者']):L(ARCHETYPES[id].label))),
    h('label',{class:'ip-currency'},L(['Amounts ','金额 ']),h('select',{'aria-label':L(['Display currency','金额显示币种']),onchange:e=>{homeState.referenceCurrency=e.target.value;requestRender();}},
      h('option',{value:'usd',...(mode==='usd'?{selected:''}:{})},'USD'),h('option',{value:'local',...(mode==='local'?{selected:''}:{})},L(['Local currency','本币']))))));
  const comparison=h('section',{class:'ip-comparison','aria-live':'polite'});
  const count=h('span',{class:'ip-selection-count'});
  const checks=[];
  const drawComparison=()=>{
    homeState.comparisonKeys=[...selected];
    count.textContent=selected.size?L([`${selected.size}/3 selected`, `已选${selected.size}/3`]):'';
    for(const {input,key} of checks){input.checked=selected.has(key);input.disabled=selected.size>=3&&!selected.has(key);}
    comparison.replaceChildren();
    const chosen=flat.filter(r=>selected.has(rowKey(r)));
    if(chosen.length<2)return;
    comparison.append(h('h2',{},L(['Compare the investment conditions','比较投资成立的条件'])),
      h('div',{class:'ip-comparison-grid',style:`--compare-count:${chosen.length}`},chosen.map(r=>h('article',{class:'ip-compare-item'},
        h('h3',{},marketName(r.market),` · ${r.hours}h`),h('p',{class:'acq-basis'},L(ARCHETYPES[r.investor].label),' · ',L(STAGE_LABEL[r.stage])),
        acquisitionPrice(r,{displayUSD:mode==='usd'}),termsView(r,mode,maxMonths)))),
      h('button',{type:'button',class:'btn',onclick:()=>{selected.clear();drawComparison();}},L(['Clear comparison','清除对比'])));
  };
  root.append(h('div',{class:'ip-compare-guide'},L(['Select up to three opportunities to compare their terms.','可勾选最多三项机会，直接对比条件。']),count),comparison);
  for(const investor of Object.keys(ARCHETYPES)){
    if(filter!=='all'&&filter!==investor)continue;
    const rows=all[investor],acting=rows.filter(r=>r.decision!=='watch');
    const featured=acting.slice(0,2),rest=rows.filter(r=>!featured.includes(r));
    const group=h('section',{class:'ip-investor','data-investor':investor},
      h('header',{},h('h2',{},L(ARCHETYPES[investor].label)),h('p',{},L(INVESTOR_STRATEGY[investor]))));
    const renderRow=r=>{
      const c=displayedCase(r),key=rowKey(r),input=h('input',{type:'checkbox','aria-label':L([`Compare ${marketName(r.market)} for ${ARCHETYPES[investor].label[0]}`,`比较${marketName(r.market)}的${ARCHETYPES[investor].label[1]}方案`]),onchange:e=>{
        if(e.target.checked&&selected.size<3)selected.add(key);else selected.delete(key);drawComparison();}});
      checks.push({input,key});
      const context=L(STAGE_LABEL[r.stage])+` · ${r.hours}h`;
      return h('article',{class:'ip-opportunity acq-row','data-play':r.playId,'data-stage':r.stage},
        h('div',{class:'ip-choice'},h('span',{class:'ip-decision ip-'+r.decision},L(DECISION_LABEL[r.decision])),
          h('h3',{},marketLink(r)),h('p',{class:'ip-asset'},context),r.where?h('p',{class:'acq-basis'},L(r.where)):null,
          h('p',{class:'ip-buy'},L(r.stage==='operating'?['Buy transferable income and a working asset.','寻找合同可承接、设备状态可核实的资产。']:r.stage==='greenfield'?['Secure land and grid access; keep the build budget within reach.','先锁定土地与并网路径，控制后续建设投入。']:['Buy with permits, grid access and remaining costs established.','落实许可、并网和剩余造价后谈收购。'])),
          h('label',{class:'ip-select'},input,L(['Compare','对比']))),
        h('div',{class:'ip-price'},acquisitionPrice(r,{displayUSD:mode==='usd'}),
          h('p',{class:'ip-price-label'},L(r.stage==='operating'?['Maximum whole-project purchase price','项目总收购上限']:['Maximum price for project rights','项目权利收购上限'])),
          h('p',{class:'acq-basis'},r.currency+' IRR · ',L(c.route==='hold'?['Long-term hold','长期持有']:c.exitYear===0?['Sell at commissioning','投运出售']:[`Sell in operating year ${c.exitYear}`,`投运后第${c.exitYear}年出售`])),
          onProject?h('a',{href:'/investment-lab',class:'ip-project',onclick:e=>{e.preventDefault();onProject(r);}},L(['Compare a real project','对照真实项目'])):null),
        termsView(r,mode,maxMonths));
    };
    group.append(...featured.map(renderRow));
    if(rest.length)group.append(h('details',{class:'ip-more'},h('summary',{},L([`Other opportunities and watchlist (${rest.length})`,`其他机会与观察清单（${rest.length}）`])),...rest.map(renderRow)));
    if(!rows.length)group.append(h('p',{},L(['Review the market research for a suitable entry route.','可在市场研究中寻找适合的进入路径。'])));
    root.append(group);
  }
  drawComparison();
  return root;
}
