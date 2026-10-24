import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { homeState, labOverrides } from '../home/state.js';
import { runCase } from '../comparison/engine.js';
import { baseStrategy } from '../comparison/strategies.js';
import { REVIEWED, SOURCES, CHECKLIST, readinessProfile } from './research.js';
import { readinessTimeline, reserveMix } from './controls.js';
import './readiness.css';

const pct=v=>v==null?'N/M':(100*v).toFixed(2)+'%';
const change=(a,b)=>a==null||b==null?'N/M':((b-a)*100).toFixed(2)+' pp';
const label={grid:['Grid permission','电网许可'],energy:['Energy','能源'],services:['Ancillary services','辅助服务'],capacity:['Capacity','容量'],contract:['Contract payment','合同付款'],final:['Final compliance','最终合规']};
function launch(market,config,strategyId){
  homeState.labMarket=market.manifest.id;homeState.labStrategy=strategyId;
  labOverrides(market.manifest.id).revenueReadiness=config;
  navigate('/investment-lab');window.scrollTo(0,0);
}
export function renderReadinessPanel(parent,market){
  const p=readinessProfile(market.manifest.id);if(!p)return;
  const section=h('section',{class:'card readiness-research',id:'revenue-readiness'},
    h('div',{class:'readiness-eyebrow'},L(['GRID → PRODUCT APPROVAL → CASH','并网 → 产品获批 → 现金流'])),
    h('h2',{},L(['When can each revenue stream actually start?','每项收入究竟何时开始？'])),
    h('p',{class:'readiness-lead'},L(p.insight)),
    h('p',{class:'cap'},L(['Official sources reviewed ','官方来源复核于 '])+REVIEWED+' · '+L(['Project dates still require evidence','项目日期仍须取证'])));
  const rows=h('tbody');
  for(const r of p.rows)rows.append(h('tr',{},h('th',{scope:'row'},L(label[r.stream])),h('td',{},L(r.text)),h('td',{},L(r.evidence)),
    h('td',{},r.sources.map((key,i)=>h('a',{href:SOURCES[key].url,target:'_blank',rel:'noopener noreferrer',title:SOURCES[key].title},'['+(i+1)+'] ')))));
  section.append(h('div',{class:'tbl-wrap readiness-rules'},h('table',{},h('thead',{},h('tr',{},...[
    ['Gate','节点'],['Rule / diligence check','规则／核查事项'],['Evidence to obtain','应取得的证据'],['Source','来源'],
  ].map(t=>h('th',{},L(t))))),rows)));
  section.append(h('p',{class:'readiness-action'},L(p.action)));
  const ready=runCase(market,'mer',5);
  if(!ready.na){
    const share=reserveMix(market);
    section.append(h('h3',{},L(['Measure the gap against the revenue mix','按收入占比衡量空窗'])),h('p',{class:'cap'},L([
      `The current model allocates ${(share*100).toFixed(1)}% of net trading revenue to reserves. This is the platform assumption, not an observed share for your asset. The table holds the revenue level fixed and delays only reserve eligibility.`,
      `当前模型将净交易收入的${(share*100).toFixed(1)}%分配给备用服务。这是平台假设，不是你的资产实测占比。下表保持收入水平不变，仅延迟备用准入。`])));
    if(market.manifest.id==='fi')section.append(h('p',{class:'warnbox'},L([
      'Finland’s current reserve seed covers annual FCR-D allocation only and omits hourly reserve income. A small impact here does not prove a small risk for a reserve-led project. Test an evidenced project mix, or the explicitly illustrative 80% reserve case.',
      '芬兰当前备用种子值仅计年度FCR-D分摊，未计小时级备用收入。此处影响较小，不代表调频主导项目风险小；请使用有依据的项目收入组合，或下方明确标为示意的80%备用情景。'])));
    const sensitivity=h('tbody');
    for(const months of [0,3,6,12]){
      const r=runCase(market,'mer',5,{revenueReadiness:{servicesMonths:months}});
      sensitivity.append(h('tr',{},h('th',{scope:'row'},months+' '+L(['months','个月'])),h('td',{},pct(r.irrHold)),h('td',{},change(ready.irrHold,r.irrHold)),
        h('td',{},Math.round((ready.mchY[0]-r.mchY[0])/r.fxRate).toLocaleString('en-US')+' '+market.manifest.currency+'/MW')));
    }
    section.append(h('div',{class:'tbl-wrap'},h('table',{class:'readiness-sensitivity'},h('thead',{},h('tr',{},...[
      ['Reserve delay (assumed)','备用延迟（假设）'],['Merchant 15y hold IRR','市场化15年持有IRR'],['Change vs zero gap','相对无空窗变化'],['Year-1 revenue lost','首年收入损失'],
    ].map(t=>h('th',{},L(t))))),sensitivity)));
    section.append(h('p',{class:'cap'},L(['These 0/3/6/12-month cases are sensitivities, not forecasts or regulatory waiting periods. Fixed costs and asset ageing continue.','0／3／6／12个月为敏感性情景，不是预测或法规等待期。固定费用及资产老化持续发生。'])));
    section.append(readinessTimeline({servicesMonths:6,contractMonths:6}));
    section.append(h('p',{class:'cap'},L(['Illustration above: energy at COD; reserves and the floor start after six months. ● eligible · — not yet eligible. Eligibility does not guarantee an auction win.','上图示意：能源在COD开放，备用及保底六个月后开始。●可参与；—尚不可参与。具备资格不保证中标。'])));
    section.append(h('div',{class:'readiness-actions'},
      h('button',{type:'button',class:'btn',onclick:()=>launch(market,{servicesMonths:6,contractMonths:6},baseStrategy(market))},L(['Test six-month reserve and contract gap','测试备用及合同晚六个月'])),
      market.manifest.id==='fi'?h('button',{type:'button',class:'btn',onclick:()=>launch(market,{reserveSharePct:80,servicesMonths:6,contractMonths:6},'mer')},L(['Test 80% reserve mix (illustrative)','测试80%备用占比（示意）'])):null));
  }
  const checklist=h('details',{class:'readiness-detail'},h('summary',{},L(['Investment conditions and source register','投资条件及来源登记'])),
    h('ul',{},CHECKLIST.map(item=>h('li',{},L(item)))));
  const ids=[...new Set(p.rows.flatMap(r=>r.sources))];
  checklist.append(h('ul',{class:'readiness-sources'},ids.map(id=>h('li',{},h('a',{href:SOURCES[id].url,target:'_blank',rel:'noopener noreferrer'},SOURCES[id].title),h('p',{class:'cap'},SOURCES[id].scope)))));
  section.append(checklist);
  parent.prepend(section);
}

export function renderReadinessComparison(parent,markets){
  const card=h('section',{class:'card readiness-research'},h('h2',{},L(['Compare the COD-to-revenue gap','跨市场比较COD至收入空窗'])),
    h('p',{class:'cap'},L(['Every market is screened at the same six-month ancillary delay and its own existing revenue mix. These are sensitivities, not estimated local waiting times. Capacity and contract starts remain unchanged in this table; test those separately in the Lab.','按统一的六个月辅助服务延迟、各市场现有收入占比筛查。这里是敏感性测算，不是当地等待期预测。表内容量及合同起算不变，可在测算页单独测试。'])));
  const body=h('tbody');
  for(const m of markets){
    const p=readinessProfile(m.manifest.id);if(!p)continue;
    const strategy=baseStrategy(m),base=runCase(m,strategy,5),gap=runCase(m,strategy,5,{revenueReadiness:{servicesMonths:6}});
    body.append(h('tr',{},h('th',{scope:'row'},h('a',{href:'/markets/'+m.manifest.slug+'/entry'},L(m.manifest.shortName))),
      h('td',{},L(p.insight)),h('td',{},(reserveMix(m)*100).toFixed(1)+'%'),
      h('td',{},base.na||gap.na?'—':change(base.irrHold,gap.irrHold)),
      h('td',{},h('button',{type:'button',class:'btn',onclick:()=>launch(m,{servicesMonths:6},strategy)},L(['Test','测算'])))));
  }
  card.append(h('div',{class:'tbl-wrap'},h('table',{},h('thead',{},h('tr',{},...[
    ['Market','市场'],['Main gate to investigate','主要核查节点'],['Reserve share of net trading','备用占净交易收入'],['Base-route hold IRR change','基准收入路径持有IRR变化'],['Scenario','情景'],
  ].map(l=>h('th',{},L(l))))),body)));
  card.append(h('p',{class:'cap'},L(['Published reference returns assume all revenue gates are cleared at COD unless a dated scenario has been entered. A zero change under a toll or a zero services seed is not evidence of zero commissioning risk.','未输入项目时间情景时，已发布参考回报假设各收入节点在COD时均已完成。toll或备用种子值为零导致测算变化为零，不代表没有调试风险。'])));
  parent.append(card);
}
