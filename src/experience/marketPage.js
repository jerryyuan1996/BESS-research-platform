import { loadInvestmentSummary } from '../opportunities/summaryData.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { currentThesis, basisNote, decisionReasons, decisionPanel, contractEvidence, marginText, availability } from './decision.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, setLens, requestRender } from '../app/state.js';
import { markets } from '../markets/registry.js';
import { CALLS, LENSES, REGIONS, opportunities, caseFor, marketName, caseUrl, compareUrl,
  pct, returnPct, share, multiple, money, finite, snapshotDate, featuredOpportunity } from './model.js';
import { siteHeader, siteFooter, link, eyebrow, sectionTitle, metric } from './chrome.js';
import { opportunityMatrix, miniature, revenueWaterfall, revenueBar, MATRIX_BASIS } from './charts.js';
import { specialRecommendations } from '../opportunities/home.js';
import { countryAttrs, projectFacts, operatingPrice } from './projectFacts.js';
import { playTitle } from '../governance/playTitle.js';
import { gateLabel } from './labels.js';
import { labField } from '../comparison/ranges.js';
import { homeState } from '../home/state.js';
import { navigate, onStoryPlace } from '../app/router.js';
import { storyFor, publicStoryFor } from './story/registry.js';
import './story/public/overview.css';


/** Market details are loaded only on a market route. Shared UI conventions are passed unchanged. */
export function createMarketRenderer(ui) {
  const { lens, button, name, tag, HOLD_LABEL, LEVERED_LABEL, testText, debtText, usText, saleText, routeName, card, main, chartFrame, inputLabel, metaBar, nextSection, openUnderwriting } = ui;
let stopStoryPlace = null;
function renderMarket(container, row, route) {
  const data = caseFor(row), m = row.market, mf = m.manifest;
  const publicEntry = publicStoryFor(mf.id);
  let storyRows = [row], storyReady = Promise.resolve();
  const content = main();
  if(publicEntry) content.classList.add('public-market');
  content.append(h('nav', { class: 'ix-breadcrumb', 'aria-label': L(['Breadcrumb', '面包屑导航']) }, link('/', ['Investment brief', '投资简报']), ' / ', link('/returns', ['Global markets', '全球市场']), ' / ', h('span', {}, name(row))));
  content.append(metaBar('03', ['MARKET INTELLIGENCE', '市场详情']));
  const select = h('select', { 'aria-label': L(['Switch market', '切换市场']), onchange: e => {
    const anchor = link(`/markets/${e.target.value}`, ''); anchor.click();
  } }, markets.map(market => h('option', { value: market.manifest.slug }, L(market.manifest.name)))); select.value = mf.slug;
  content.append(h('section', { class: 'ix-market-intro' }, h('div', {}, eyebrow(['FROM MARKET SCREEN TO INVESTMENT CASE', '从市场筛选，走向投资方案']), h('h1', {}, name(row)), h('p', { class: 'ix-lead' }, L(routeName(row))), h('div', { class: 'ix-actions' }, tag(row), h('span', { class: 'ix-mono' }, `${row.investment?.currency||mf.currency} · ${row.play?.hours || m.comparison.archetype.durationHours}H`))),
    h('div', { class: 'ix-market-controls' }, select, button(['Print investment brief ↗', '打印投资简报 ↗'], () => window.print(), 'ix-outline'))));
  // Lightweight public reading precedes every investor-specific decision/card.
  const publicHost = publicEntry ? h('div',{class:'public-overview-loading','aria-busy':'true'},L(['Loading market background…','正在加载市场背景…'])) : null;
  if(publicHost) content.append(publicHost);
  if (['pl','it'].includes(row.id)) {
    const choices = h('div');
    content.append(choices);
    const investor = lens();
    storyReady = import('./playChoices.js').then(({ renderPlayChoices, storyRowsFor }) => {
      storyRows = storyRowsFor(row, investor);
      if (choices.isConnected) {
        if (storyRows.length > 1) choices.replaceWith(renderPlayChoices(storyRows, row, tag));
        else choices.remove();
      }
    });
  }
  content.append(decisionPanel(row));
  const anchors = [['decision',['Decision','投资判断']],['overview', ['Overview', '市场概览']], ['revenue-drivers', ['Revenue drivers', '收入动因']], ['bankable', ['Bankable case', '可融资方案']], ['revenue', ['Revenue', '收益拆解']], ['execution', ['Execution', '执行步骤']], ['opportunity-comparison', ['Special opportunity', '特殊机会']], ['downside', ['Downside', '下行风险']], ['sources', ['Sources', '来源']]];
  if(publicEntry) anchors.unshift(...anchors.splice(anchors.findIndex(([id])=>id==='overview'),1));
  content.append(h('nav', { class: 'ix-section-nav', 'aria-label': L(['Market sections', '市场详情章节']) }, anchors.map(([id, label]) => link(`#${id}`, label))));
  content.append(h('section', { id: publicEntry ? 'investment-overview' : 'overview', class: 'ix-section ix-overview' },
    sectionTitle(['THE INVESTMENT VIEW', '市场投资判断'], ['Understand what drives the case.', '先理解这项投资，为什么成立。']),
    h('div', { class: 'ix-overview-body' }, h('div', {}, h('p', { class: 'ix-thesis' }, L(currentThesis(row))),
      link(`${caseUrl(row)}/home`, ['Explore the full market research ↗', '阅读完整市场研究 ↗'], 'ix-text-link')),
      h('aside', { class: 'ix-next-action' }, eyebrow(['NEXT INVESTMENT ACTION', '下一项投资行动']), h('p', {}, L(row.play?.action?.text || m.comparison.refinement?.currentUpdate || m.comparison.narrative.thesis))))));
  /* A market with a story opens it here, with the full research one click
     deeper inside it (src/experience/story/registry.js); every other market
     opens the research dialog as before. */
  const openResearch=trigger=>import('./researchDialog.js').then(module=>{if(trigger.isConnected)module.openResearchDialog(m,name(row),trigger);});
  /* A link or Back to ?view=story opens the story at its place (WP-04);
     place is null when the reader pressed the button. */
  const storyOpen=()=>Boolean(document.querySelector('.ix-story-dialog'));
  const openFrom=(place)=>{
    research.disabled=true;
    const story=storyFor(mf.id);
    (story
      ? storyReady.then(()=>story.load()).then(pack=>{if(research.isConnected&&!storyOpen()&&!pack.open({row,rows:storyRows,lens:lens(),result:data,name:marketName(row),trigger:research,openResearch,place,ui:{CALLS,returnPct,marginText,metric,playTitle}}))return openResearch(research);})
      : openResearch(research))
      .catch(()=>{research.textContent=L(['Could not load; click to retry','暂未载入，点击重试']);})
      .finally(()=>{research.disabled=false;});
  };
  const research=button(['Grid, history and full research context ↗','电网、历史与完整研究背景 ↗'],()=>openFrom(null),'ix-outline ix-full-research');
  content.querySelector(publicEntry ? '#investment-overview' : '#overview').append(research);
  const openPublicFrom = async (place=null, trigger=content.querySelector('.public-story-trigger')) => {
    if(!publicEntry || storyOpen())return;
    if(trigger?.dataset.loadFailed){
      const params=new URLSearchParams(window.location.search);
      const edition=trigger.closest('[data-version]')?.dataset.version||'2026-11-06.1';
      params.set('view','story');params.set('chapter','history');params.set('shot',`public-${app.lang}-${edition.replace('.','-')}-history`);
      window.history.replaceState({},'',`${window.location.pathname}?${params}${window.location.hash}`);window.location.reload();return;
    }
    trigger?.setAttribute('aria-busy','true');
    try {
      const pack=await publicEntry.load();
      if(content.isConnected && !storyOpen()) pack.open({id:mf.id,name:marketName(row),trigger,place,openResearch,
        openLegacy:()=>document.querySelector('.ix-full-research')?.click(),researchUrl:`${caseUrl(row)}/home`});
    } catch {
      if(trigger)trigger.dataset.loadFailed='true';
      const status=content.querySelector('.public-status');
      if(status)status.textContent=L(['Story could not load. The summary remains available; press the button to retry.','叙事未能加载。摘要仍可阅读；再次点击按钮重试。']);
    } finally {trigger?.removeAttribute('aria-busy');}
  };
  if(publicEntry){
    const loadOverview=()=>publicEntry.loadOverview().then(module=>{
      if(!publicHost.isConnected)return;
      publicHost.replaceWith(module.renderPublicOverview(mf.id,{name:marketName(row),open:trigger=>openPublicFrom(null,trigger),researchUrl:`${caseUrl(row)}/home`}));
      if(route?.story?.shot?.startsWith('public-')&&!storyOpen())openPublicFrom(route.story);
      if(window.location.hash==='#overview')content.querySelector('#overview')?.scrollIntoView();
    }).catch(()=>{if(publicHost.isConnected)publicHost.replaceChildren(button(['Retry market background','重试市场背景'],loadOverview,'ix-outline'),link(`${caseUrl(row)}/home`,['Full research ↗','完整研究 ↗'],'ix-text-link'));});
    loadOverview();
  }
  stopStoryPlace?.();
  stopStoryPlace=onStoryPlace((r,{samePage})=>queueMicrotask(()=>{
    if(!samePage||!r.story||!research.isConnected||storyOpen())return;
    if(r.story.shot?.startsWith('public-')&&publicEntry)openPublicFrom(r.story);
    else if(storyFor(mf.id))openFrom(r.story);
  }));
  if(route?.story&&!route.story.shot?.startsWith('public-')&&storyFor(mf.id)&&!storyOpen())openFrom(route.story);
  /* Revenue drivers sit under the overview. The special-opportunity comparison
     appears only where one is valid, and then at the foot of the case, just
     above the downside. Otherwise the timeline shows the conventional play alone. */
  const opportunityHost = h('div', { 'aria-busy':'true' }, h('p', { class:'ix-caption' }, L(['Loading revenue drivers…','正在载入收入动因…'])));
  const specialHost = h('div');
  content.append(opportunityHost);
  const investor = lens();
  const dropSpecial = () => { specialHost.remove(); content.querySelector('.ix-section-nav a[href="#opportunity-comparison"]')?.remove(); };
  const loadOpportunity = () => import('../opportunities/ui.js').then(module => {
    if (!opportunityHost.isConnected) return;
    opportunityHost.replaceChildren(module.revenueMechanismSection(row));
    opportunityHost.setAttribute('aria-busy','false');
    const screen = module.specialOpportunityScreen(row, investor);
    const special = screen.valid.length ? module.opportunityComparison(row, investor, { only: screen.valid }) : null;
    if (special) specialHost.replaceChildren(special);
    else {
      dropSpecial();
      if (screen.conventional) content.dispatchEvent(new CustomEvent('opportunitychange', { detail: screen.conventional }));
    }
    if (window.location.hash === '#route-options') content.querySelector('#route-options')?.scrollIntoView();
    if (window.location.hash === '#opportunity-comparison') specialHost.querySelector('#opportunity-comparison')?.scrollIntoView();
  }).catch(() => {
    if (!opportunityHost.isConnected) return;
    opportunityHost.replaceChildren(button(['Retry the investment comparison','重新载入投资比较'],loadOpportunity,'ix-outline'));
    opportunityHost.setAttribute('aria-busy','false');
  });
  loadOpportunity();
  if (!data.unavailable) {
    content.append(bankableSection(data), revenueSection(data));
  } else content.append(h('section', { id: 'bankable', class: 'ix-panel ix-section' }, h('h2', {}, L(['Investment case in research', '投资方案研究中'])), h('p', {}, L(['This market does not yet have a complete return model. Continue with the market research and execution plan.', '本市场尚无完整回报模型，可继续查看市场研究与执行计划。']))));
  const routes=Object.entries(HOME_BRIEFING.plays).filter(([key])=>key.startsWith(row.id+'/')).map(([,p])=>p);
  if(routes.length){
    const requested=new URLSearchParams(window.location.search).get('play');
    content.append(h('section',{id:'route-options',class:'ix-section'},
      h('h2',{},L(['Current and alternative routes','当前方案与备选路线'])),
      h('p',{class:'ix-basis-note'},L(['The headline remains the selected reference case. Alternative routes require separate pricing.',
        '主回报仍对应上方当前参考方案；备选路线需要单独定价。'])),
      h('div',{class:'ix-route-options'},routes.map(p=>h('article',{class:p.id===requested?'is-requested':'','data-play':p.id},
        h('h3',{},L(p.label)),
        h('small',{},L(p.id===row.play?.id?['Current reference','当前参考情景']:['Alternative research route','备选研究路径'])),
        h('p',{},L(p.action?.text||['Review the route-specific evidence.','核查该路线的证据。'])),
        link(caseUrl(row)+'/revenue',['Revenue mechanism research ↗','查看收入机制研究 ↗'],'ix-text-link'))))));
  }
  const execution=executionSection(row);
  content.append(execution, specialHost);
  let timelineVersion=0;
  content.addEventListener('opportunitychange',async event=>{
    const version=++timelineVersion;
    const {executionTimelines}=await import('../opportunities/deliveryUI.js');
    if(!execution.isConnected||version!==timelineVersion)return;
    execution.querySelector('.ix-execution-timeline-host').replaceChildren(executionTimelines(event.detail,row,investor));
  });
  if (!data.unavailable) content.append(downsideSection(data));
  const overview=content.querySelector('#overview');
  if(!publicEntry)for(const id of ['bankable','revenue']){const node=content.querySelector('#'+id);if(node)content.insertBefore(node,overview);}
  if(data.unavailable) for(const id of ['revenue','downside'])content.querySelector('.ix-section-nav a[href="#'+id+'"]')?.remove();
  content.append(sourcesSection(row));
  content.append(nextSection(['Keep the opportunity in context.', '让投资判断，始终保有全球视角。'], ['Return to the matrix and compare this case with your next market.', '返回全球矩阵，将当前方案与下一个市场放在一起比较。'], compareUrl([row.id]), ['Back to global comparison ↗', '返回全球比较 ↗']));
  container.append(content);
  if (window.location.hash === '#route-options') requestAnimationFrame(()=>content.querySelector('#route-options')?.scrollIntoView());
  if (window.location.hash === '#opportunity-comparison') requestAnimationFrame(() => content.querySelector('#opportunity-comparison')?.scrollIntoView());
}

function leverageTable(inv) {
  const l = inv?.leverage;
  if (!l) return null;
  const rows = [
    [['Peak pre-COD equity / MW','投运前峰值股权资金／MW'],money(inv.peakEquityPerMW,inv.currency)],
    [['Debt / MW at COD', 'COD时债务／MW'], money(l.loanPerMW, inv.currency)],
    [['Net debt cash released at COD / MW','COD时可回收资金净额／MW'],money(l.loanPerMW-(l.fee||0)-(l.reserve||0),inv.currency)],
    [['Debt ratio (of build and grid capex)', '债务比例（占建设及并网资本开支）'], share(l.gearing) + (l.capBinds ? L([' · cap binds', ' · 受上限约束']) : '')],
    [['Contracted coverage', '合同现金流覆盖'], l.contractedDSCR ? l.contractedDSCR.toFixed(2) + 'x' : '—'],
    [['Merchant coverage', '市场现金流覆盖'], l.merchantDSCR.toFixed(2) + 'x'],
    [['Legal maturity / notional profile', '法定期限 / 名义摊还期'], `${l.legalYears} / ${l.notionalYears} ${L(['yrs', '年'])}`],
    [['All-in rate, year one', '首年综合利率'], pct(l.rate)],
    [['Lowest annual cover, before balloon', '最低年度覆盖（不含到期尾款）'], l.minCover ? l.minCover.toFixed(2) + 'x' : '—'],
    [['Balloon repaid by equity', '股权偿还尾款'], share(l.balloonShare)],
  ];
  return h('details', { class: 'ix-details' }, h('summary', {}, L(['Debt behind the levered return', '杠杆回报所用债务'])),
    h('table', { class: 'ix-table' }, h('tbody', {}, rows.map(([label, v]) => h('tr', {}, h('th', { scope: 'row' }, L(label)), h('td', { class: 'ix-table-number' }, v))))));
}

function bankableSection(data) {
  const { row, base, debt } = data;
  return h('section', { id: 'bankable', class: 'ix-section' }, sectionTitle(['THE BANKABLE CASE', '可融资方案'], ['Turn the investment view into cash flow.', '把投资逻辑，落到现金流。'], ['Reference underwriting case · Same route and duration as the market screen.', '参考承销模型 · 与市场比较页采用相同收入路径与储能时长。']),
    h('div', { class: 'ix-kpis' }, metric(HOLD_LABEL, returnPct(row.econ.hold), saleText(row)), metric(LEVERED_LABEL, returnPct(row.econ.levered), debtText(row.investment)), metric(['Investor target', '投资者目标回报'], pct(row.investment?.targetReturn), [`${testText(row.econ.test)[0]} · levered ${pct(row.econ.test?.leveredTarget)}`, `${testText(row.econ.test)[1]} · 杠杆后${pct(row.econ.test?.leveredTarget)}`]), metric(['Build and grid capex / MW', '建设及并网 Capex / MW'], money(row.investment?.capexPerMW,row.investment?.currency), usText(row.investment))),
    basisNote(row),contractEvidence(row),leverageTable(row.investment),
    h('div', { class: 'ix-case-summary' }, h('span', {}, L(['Revenue route', '收入路径']), ' / ', L(routeName(row))), h('span', {}, L(['RTB closing → COD', 'RTB交割→COD']), ' / ',row.investment?.rtbMonths,L([' months','个月'])), h('span', {}, L(['Operating life', '运营寿命']), ' / 20 ',L(['years','年']))),
    h('details', { class: 'ix-details ix-valuation-basis' }, h('summary', {}, L(['Valuation basis', '估值口径'])),
      h('p', {}, L(['The home card, global screen and conventional comparison column share this 20-year nominal after-tax RTB case, with the inflation and contract-indexation assumptions stated for each scenario; actual contract clauses require separate verification. The headline is the all-equity hold return. The levered return adds one project loan at COD: contracted cash covers 1.20–1.40x by contract type, merchant cash 2.00x, at least 60% is repaid by legal maturity and equity repays any balloon. The target test compares all-equity with the target, then levered with the target plus two points.','首页卡片、全球比较及测算表常规列共用20年、税后名义RTB投资模型，通胀与合同指数化采用各情景注明的比较假设，实际合同条款须另行核验。主回报为全股权长持回报；杠杆后回报在COD提取一笔项目贷款：合同现金流按合同类型1.20–1.40倍覆盖、市场现金流2.00倍，法定到期前至少偿还60%，尾款由股权偿还。目标检验先以全股权对比目标，再以杠杆后回报对比目标加2个百分点。'])),
      h('p', {}, L([`The previous operating-model IRR was ${pct(base.irrHold)} over 15 years before project tax. Operating-asset valuation rates remain: fixed ${pct(base.valuationRates.secured)}, renewal ${pct(base.valuationRates.renewal)}, trading ${pct(base.valuationRates.merchant)}.`,`旧版15年税前运营模型IRR为${pct(base.irrHold)}。运营资产估值参考折现率：锁定收入${pct(base.valuationRates.secured)}；续约收入${pct(base.valuationRates.renewal)}；交易收入${pct(base.valuationRates.merchant)}。`]))));
}

function revenueSection(data) {
  const b = data.investment?.bridge || data.bridge;
  const parts = [[['Fixed revenue', '固定收入'], b.fixed], [['Auction renewal', '拍卖续约'], b.renewal], [['Trading & ancillary services', '交易及辅助服务'], b.trading], [['Operating / lifecycle costs incl. OEM service', '运营及生命周期成本（含设备服务）'], -b.operating], [['Project tax','项目税费'],-(b.tax||0)], [['After-tax operating cash', '税后经营现金流'], b.net]];
  return h('section', { id: 'revenue', class: 'ix-section' }, sectionTitle(['REVENUE BREAKDOWN', '收益拆解'], ['Every return has a source.', '每一分收益，都有清晰来源。']),
    h('div', { class: 'ix-revenue-layout' }, h('aside', { class: 'ix-assumptions' }, eyebrow(['THE CASE IN NUMBERS', '核心经济参数']),
      metric(['Gross revenue / MW / year', '首年总收入 / MW'], money(b.gross)), metric(['Fixed income share', '固定收入占比'], share(b.gross>0?b.fixed/b.gross:0)),
      metric(['After-tax operating cash / MW / year', '首年税后经营现金流 / MW'], money(b.net)), h('p', {}, L(['First complete operating year in the same investment model as the headline return. Trading includes ancillary services; operating costs include OEM service.','采用与主回报相同的投资模型、首个完整运营年度；交易收入含辅助服务，运营成本含设备服务费。']))),
      card(h('div', { class: 'ix-panel-heading' }, h('h3', {}, L(['Revenue → operating cash flow', '收入 → 经营现金流'])), h('span', { class: 'ix-mono' }, 'USD k / MW · Y1')), chartFrame(revenueWaterfall(b)),
        h('details', { class: 'ix-details' }, h('summary', {}, L(['See the exact breakdown', '查看精确拆解'])), h('table', { class: 'ix-table' }, h('tbody', {}, parts.map(([label, val]) => h('tr', {}, h('th', { scope: 'row' }, L(label)), h('td', { class: 'ix-table-number' }, money(val))))))))));
}

function executionSection(row) {
  const section=h('section',{id:'execution',class:'ix-section'},
    sectionTitle(['STEP-BY-STEP OPERATION GUIDANCE','逐步执行指南'],
      ['One starting point. A dated path to cash.','统一起点，逐步走到现金回流。']),
    h('div',{class:'ix-execution-timeline-host','aria-live':'polite'},L(row.investment?['Preparing project milestones…','正在准备项目里程碑…']:['No priced model: verify the payment terms before scheduling investment cash flows.','尚无定价模型：先核实付费条款，再排定投资现金流。'])));
  section.append(h('div', { class: 'ix-market-gates' }, eyebrow(['MARKET-SPECIFIC EXECUTION CHECKS', '本市场执行核查']),
    h('ul', {}, (row.market.comparison.refinement?.investmentGate || []).map(g => h('li', {}, L(gateLabel(g))))),
    link(`${caseUrl(row)}/entry`, ['Open the local entry & delivery research ↗', '查看本地进入与交付研究 ↗'], 'ix-text-link')));
  // Only four markets have source-backed local pathways. Fetch a single pathway
  // on demand, and preserve explicit dependencies instead of inventing a schedule.
  const loaders = import.meta.glob('../markets/*/buildPathway.js');
  const path = `../markets/${row.id}/buildPathway.js`;
  if (loaders[path]) {
    const details = h('details', { class: 'ix-local-pathway ix-details' }, h('summary', {}, L(['Local delivery sequence & dependencies', '本地建设步骤与依赖关系'])));
    let loading = false;
    details.addEventListener('toggle', async () => {
      if (!details.open || loading) return; loading = true;
      const holder = h('div', { class: 'ix-pathway-body' }, L(['Loading local guidance…', '正在加载本地指南…'])); details.append(holder);
      try {
        const module = await loaders[path](), pathway = Object.values(module).find(x => x?.stages && x?.marketId);
        const labels = await import('../governance/buildPathway.js');
        holder.replaceChildren(h('p', {}, L(pathway.summary)), h('p', { class: 'ix-caption' }, L(['Local workstreams may overlap. Dependencies below govern the order; durations are not added together.', '本地工作可交叉进行，下列依赖决定先后关系，不能将各阶段时长简单相加。'])),
          h('ul', { class: 'ix-dependencies' }, (pathway.prerequisites || []).map(edge => h('li', {}, L(edge.requires), ' → ', L(edge.instrument)))),
          ...pathway.stages.map(stage => h('details', { class: 'ix-details' }, h('summary', {}, L(labels.STAGE_LABEL[stage.id])), h('p', {}, L(stage.instrument)), h('p', {}, L(stage.gate)),
            h('small', {}, L(labels.OWNER_LABEL[stage.owner]), ' · ', stage.months ? `${stage.months.join('–')} ${L(['months', '个月'])}` : L(['Timing not published', '时间未公布']), ' · ', L(labels.DURATION_BASIS_LABEL[stage.durationBasis])),
            h('p', { class: 'ix-caption' }, L(stage.note)))));
      } catch { holder.replaceChildren(h('p', {}, L(['Local guidance could not be loaded.', '本地指南未能加载。'])), button(['Retry', '重试'], () => { holder.remove(); loading = false; details.open = false; details.open = true; }, 'ix-outline')); }
    });
    section.append(details);
  }
  return section;
}

function downsideSection(data) {
  const { row, base, bear, debt } = data;
  const riskRows = [
    [HOLD_LABEL, returnPct(row.econ.hold), returnPct(row.investment?.bearHoldIRR)],
    [['Year-one after-tax cash / MW', '首年税后经营现金流 / MW'], money(row.investment?.bridge.net), money(row.investment?.bearNetUSD)],
  ];
  const profile = row.market.comparison.refinement;
  const explanation=h('div',{class:'ix-downside-explanation','aria-busy':'true'},h('p',{},L(['Loading the downside conditions and historical reference…','正在载入下行条件与历史参考…'])));
  import('./downsideNarrative.js').then(module=>{if(explanation.isConnected)explanation.replaceChildren(module.downsideNarrative(row,lens(),data.overrides));})
    .catch(()=>{explanation.replaceChildren(h('p',{},L(['Conditions could not be loaded; the exact stress inputs remain below.','下行解释暂未载入，仍可查看下方准确的压力输入。'])));})
    .finally(()=>explanation.setAttribute('aria-busy','false'));
  const analysis=h('details',{class:'ix-details ix-risk-analysis-host'},h('summary',{},L(['Sensitivity, fixed-debt stress and contract expiry','敏感性、固定贷款压力与合同到期'])));
  let loading=false;
  analysis.addEventListener('toggle',async()=>{if(!analysis.open||loading)return;loading=true;try{const module=await import('./riskAnalysis.js');analysis.append(module.riskAnalysis(row,lens(),data.overrides));}catch{loading=false;analysis.append(h('p',{},L(['Analysis unavailable; close and reopen to retry.','分析暂未载入，可关闭后重新展开。'])));}});
  return h('section', { id: 'downside', class: 'ix-section' }, sectionTitle(['DOWNSIDE RISK', '下行风险'], ['Know what can weaken the case.', '看清风险，才能守住回报。']),
    card(h('div', { class: 'ix-panel-heading' }, h('h3', {}, L(['Base case vs. declared downside', '基准与既定下行情景'])), h('span', { class: 'ix-mono' }, L(['ONE CASH-FLOW BASIS', '统一现金流口径']))),
      h('div', { class: 'ix-table-scroll' }, h('table', { class: 'ix-table ix-downside-table' }, h('thead', {}, h('tr', {}, ...[['Metric', '指标'], ['Base', '基准'], ['Downside', '下行']].map(x => h('th', { scope: 'col' }, L(x))))),
        h('tbody', {}, riskRows.map(([label, a, b]) => h('tr', {}, h('th', { scope: 'row' }, L(label)), h('td', { class: 'ix-table-number', 'data-label':L(['Base','基准']) }, a), h('td', { class: 'ix-table-number ix-risk-value', 'data-label':L(['Downside','下行']) }, b)))))),
      h('p', { class: 'ix-caption' }, L(['The downside applies the declared adverse inputs to the same RTB closing date, operating life, tax and ownership convention as the base investment case.','下行将既定不利输入应用于与基准相同的RTB交割起点、运营寿命、税费及持有方式。'])),
      explanation,
      h('details', { class: 'ix-details' }, h('summary', {}, L(['Inspect the downside inputs', '查看下行情景输入'])),
        h('div', { class: 'ix-input-grid' }, Object.entries(data.overrides).map(([key, value]) => inputLabel(key, value, row.market.manifest.currency))))),
    analysis,
    h('div', { class: 'ix-risk-grid' },
      h('article', {}, eyebrow(['01 / REVENUE', '01 / 收入']), h('h3', {}, L(['Separate the mechanism from the contract.', '区分市场机制与已签合同。'])), h('p', {}, L(base.fixedRevenueEvidence?.basis || ['Project contract evidence remains to be collected.', '仍需收集项目合同证据。'])), h('span', { class: 'ix-risk-stat' }, L(['Project contract documents not verified','项目合同文件尚未核验']))),
      h('article', {}, eyebrow(['02 / DELIVERY', '02 / 交付']), h('h3', {}, L(['Protect the path to first revenue.', '守住首次收入的实现路径。'])), h('p', {}, L(profile?.currentUpdate || row.market.comparison.narrative.thesis))),
      h('article', {}, eyebrow(['03 / FUNDING', '03 / 资金']), h('h3', {}, L(['Fund the delivery milestones.', '按交付里程碑落实资金。'])),
        h('p', {}, L(['Match equity funding to the construction, grid and revenue-qualification dates above. Keep a reserve for delayed works and the first operating period. Test project-specific financing in the Investment Lab.','按上方建设、并网与收入资格节点落实股权资金，为工程延期及初期运营预留现金。项目融资条件可在投资测算中另行核验。'])))));
}

function sourcesSection(row) {
  const sources = Object.entries(row.market.sources || {}).filter(([, source]) => /^https?:/.test(source.url || ''));
  const meta = row.market.manifest;
  return h('section', { id: 'sources', class: 'ix-section' }, sectionTitle(['RESEARCH & PROVENANCE', '研究与来源'], ['The evidence stays with the number.', '让证据，始终跟随数字。']),
    h('div', { class: 'ix-source-meta' }, metric(['Market data vintage', '市场数据口径'], meta.dataDate), metric(['Market model', '市场模型版本'], meta.modelVersion), metric(['Briefing built on', '简报生成日期'], snapshotDate)),
    h('details', { class: 'ix-details ix-source-list' }, h('summary', {}, L([`Open ${sources.length} source references`, `查看${sources.length}项来源`])),
      ...sources.map(([key, source]) => h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, h('span', {}, L(source.file || source.title || key)), h('small', {}, source.date || ''), h('span', { 'aria-hidden': 'true' }, '↗')))),
    h('div', { class: 'ix-actions' }, link(`${caseUrl(row)}/data`, ['Full market data & methodology ↗', '完整市场数据与方法 ↗'], 'ix-text-link'), row.investment?button(['Model this market ↗', '进入本市场测算 ↗'], () => openUnderwriting(row), 'ix-outline'):link(`${caseUrl(row)}/data`,['Evidence required before pricing ↗','查看定价前证据缺口 ↗'],'ix-text-link')));
}

return renderMarket;
}
