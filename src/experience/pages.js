import {renderPerspectives} from './perspectives.js';
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
import { storyFor } from './story/registry.js';

const lens = () => LENSES[app.lens] ? app.lens : 'infraFund';
const button = (label, onclick, cls = '') => h('button', { type: 'button', class: `ix-button ${cls}`, onclick }, L(label));
const name = row => L(marketName(row));
const tag = row => h('span', { class: `ix-tag ${row.call}` }, L(CALLS[row.call] || CALLS.research));
/* Returns, 29 Oct 2026: the all-equity hold is the headline. The levered equity
   return, the debt ratio and the 5-year-sale test sit beside it, and the target
   test is two-layered: all-equity against the target, levered against target + 2. */
const HOLD_LABEL = ['All-equity IRR (hold)', '全股权IRR（长持）'];
const LEVERED_LABEL = ['Levered equity IRR', '杠杆后股权IRR'];
const testText = t => !t ? ['—', '—'] : t.basis === 'all-equity' ? ['Meets target all-equity', '全股权即达标']
  : t.basis === 'levered' ? ['Meets target with debt', '加杠杆后达标'] : ['Below target both ways', '两种口径均未达标'];
const debtText = inv => inv?.leverage ? [`Debt ${share(inv.leverage.gearing)} of capex · ${inv.leverage.contractedDSCR ? inv.leverage.contractedDSCR.toFixed(2) + 'x contracted, ' : ''}2.00x merchant`,
  `债务占资本开支${share(inv.leverage.gearing)} · ${inv.leverage.contractedDSCR ? '合同' + inv.leverage.contractedDSCR.toFixed(2) + '倍、' : ''}市场2.00倍`] : ['No debt sized', '未测算债务'];
const usText = inv => inv?.usAlternative ? [`Chinese DC block, no credit: ${returnPct(inv.usAlternative.holdIRR)} all-equity, ${returnPct(inv.usAlternative.leveredIRR)} levered`,
  `中国电池舱、无抵免：全股权${returnPct(inv.usAlternative.holdIRR)}，杠杆后${returnPct(inv.usAlternative.leveredIRR)}`] : null;
/* Short forms for the opportunity-set table, so each row stays two lines. */
const debtShort = inv => inv?.leverage ? [`Debt ${share(inv.leverage.gearing)} · DSCR ${inv.leverage.contractedDSCR ? inv.leverage.contractedDSCR.toFixed(2) + '/' : ''}2.00x`,
  `债务${share(inv.leverage.gearing)} · 覆盖${inv.leverage.contractedDSCR ? inv.leverage.contractedDSCR.toFixed(2) + '/' : ''}2.00倍`] : ['No debt sized', '未测算债务'];
const saleText = row => [`With 5-yr sale test: ${returnPct(row.econ.lowerOf)}`, `含5年出售检验：${returnPct(row.econ.lowerOf)}`];
/* The design, at the stage this investor's call enters it. */
const routeName = row => row.play ? playTitle(row.play, row.stage) : row.market.comparison.narrative.archetype;
const card = (...children) => h('div', { class: 'ix-panel' }, ...children);
const main = () => h('main', { id: 'ix-main', class: 'ix-container', tabindex: -1 });
const chartFrame = chart => h('div', { class: 'ix-chart-frame' },
  h('div', { class: 'ix-chart-scroll', tabindex: 0, role: 'group', 'aria-label': L(['Chart. Scroll horizontally to view all years or categories.', '图表。可左右滚动查看全部年度或分类。']) }, chart),
  h('p', { class: 'ix-chart-hint' }, L(['Swipe to explore the full chart →', '左右滑动，查看完整图表 →'])));
function inputLabel(key, value, currency) {
  const field = labField(key);
  const extra = { taxTariffPct:['Tax and tariff rate', '税费率'], gridContributionPerMW:['Grid contribution / MW', '并网支出 / MW'] };
  const unit = field?.unit;
  const formatted = unit === 'cur' ? money(value, currency) : unit === 'pct' ? value.toFixed(2) + '%' : unit === 'frac' ? share(value) : Number(value.toFixed(2)).toLocaleString();
  return h('div', {}, h('span', {}, L(field?.label || extra[key] || key)), h('strong', {}, formatted));
}
function lensSelect() {
  const select = h('select', { 'aria-label': L(['Investor profile', '投资者类型']), onchange: e => { setLens(e.target.value); requestRender(); } },
    Object.entries(LENSES).map(([id, label]) => h('option', { value: id }, L(label))));
  select.value = lens();
  return h('label', { class: 'ix-select-label' }, h('span', {}, L(['INVESTOR VIEW', '投资者视角'])), select);
}
function metaBar(number, title) {
  return h('div', { class: 'ix-meta-bar' }, h('span', { class: 'ix-mono' }, `${number} / ${L(title)} · ${snapshotDate}`), lensSelect());
}
function nextSection(title, text, href, label) {
  return h('section', { class: 'ix-next' }, h('div', {}, eyebrow(['YOUR NEXT MOVE', '下一步']), h('h2', {}, L(title)), h('p', {}, L(text))), link(href, label, 'ix-button ix-light'));
}
function openUnderwriting(row) {
  homeState.labMarket = row.id;
  homeState.labStrategy = row.play?.route || null;
  homeState.acquisitionSelection = null;
  if (row.play) {
    const stage = row.stage === 'co-invest' ? 'ready-to-build' : row.stage;
    const play = { id: row.play.id, route: row.play.route, hours: row.play.hours,
      ...(finite(row.play.grantPct) ? { grantPct: row.play.grantPct } : {}) };
    homeState.acquisitionStage = stage;
    homeState.acquisitionSelection = { key: [lens(), row.id, play.id, stage].join('/'),
      market: row.id, stage, play, runOptions: row.econ.runOptions || {} };
  }
  navigate('/investment-lab'); window.scrollTo({ top: 0, behavior: 'instant' });
}

let renderVersion=0, marketRenderer=null, comparisonRenderer=null;
export async function renderExperience(container, route, market) {
  const version=++renderVersion,investor=lens(),pathname=window.location.pathname;
  const pending=h('p',{class:'ix-container',role:'status'},L(['Preparing the investor case…','正在准备投资方案…']));
  container.append(pending);
  try{await loadInvestmentSummary(investor);}catch{
    if(pending.isConnected)pending.replaceChildren(button(['Retry','重试'],()=>renderExperience(container,route,market)));
    return;
  }
  if(version!==renderVersion||window.location.pathname!==pathname||lens()!==investor)return;
  container.replaceChildren();
  container.classList.add('ix-app');
  const rows = opportunities(lens());
  container.append(siteHeader(route.name));
  if (route.name === 'home') renderHome(container, rows);
  else if (route.name === 'returns') {
    try {
      const module=await import('./comparisonPage.js');
      if(version!==renderVersion||window.location.pathname!==pathname||lens()!==investor)return;
      comparisonRenderer??=module.createComparisonRenderer({button,name,tag,HOLD_LABEL,LEVERED_LABEL,testText,debtText,usText,debtShort,saleText,routeName,main,chartFrame,metaBar,nextSection});
      comparisonRenderer(container,rows);
    } catch { container.append(button(['Reload global markets','重新载入全球市场'],()=>window.location.reload())); }
  }
  else {
    try {
      const module = await import('./marketPage.js');
      if(version!==renderVersion||window.location.pathname!==pathname||lens()!==investor)return;
      marketRenderer ??= module.createMarketRenderer({lens, button, name, tag, HOLD_LABEL, LEVERED_LABEL, testText, debtText, usText, saleText, routeName, card, main, chartFrame, inputLabel, metaBar, nextSection, openUnderwriting});
      let row = rows.find(r => r.id === market.manifest.id);
      if (row) {
        const {selectedInvestmentCase} = await import('./selectedInvestmentCase.js');
        if(version!==renderVersion||window.location.pathname!==pathname||lens()!==investor)return;
        const params=new URLSearchParams(window.location.search);
        row = selectedInvestmentCase(row, investor, params.get('play'),params.get('supply'));
      }
      marketRenderer(container, row, route);
    } catch {
      container.append(button(['Reload market case','重新载入市场方案'],()=>window.location.reload()));
    }
  }
  container.append(siteFooter());
  // Policy sidecars belong to the requested market page, not the eager shell.
  // Recheck this render after the lazy module arrives, just as above.
  if(market)import('../policy/notice.js').then(module=>{
    if(version===renderVersion&&window.location.pathname===pathname&&lens()===investor)
      module.attachReviewNotice(container,market);
  }).catch(()=>{});
}

function renderHome(container, rows) {
  const lead = featuredOpportunity(rows,lens());
  const content = main();
  content.append(metaBar('01', ['THE INVESTMENT BRIEF', '投资简报']),renderPerspectives());
  const hero = h('section', { class: 'ix-home-hero' },
    h('div', { class: 'ix-hero-copy' }, eyebrow(['GLOBAL ENERGY. FOCUSED CAPITAL.', '全球能源转型 · 精准配置资本']),
      h('h1', {}, L(['Capital priorities.\nConditions first.', '投资重点，\n进入条件。'])),
      h('p', { class: 'ix-lead' }, L([`Prioritise ${name(lead)}. Focus capital on ${L(routeName(lead)).toLowerCase()}.`, `重点关注${name(lead)}，优先配置${L(routeName(lead))}。`])),
      h('div', { class: 'ix-actions' }, link(caseUrl(lead), ['Explore the investment case ↗', '查看投资方案 ↗'], 'ix-button'), link('/returns', ['Compare all markets →', '比较全球市场 →'], 'ix-text-link')),
      h('div', { class: 'ix-home-scope' }, h('span', { class: 'ix-status-dot' }), L([`${rows.length} markets · ${rows.filter(r=>finite(r.econ.hold)).length} priced · ${rows.filter(r=>!finite(r.econ.hold)).length} withheld.`, `${rows.length}个市场 · ${rows.filter(r=>finite(r.econ.hold)).length}个可测算 · ${rows.filter(r=>!finite(r.econ.hold)).length}个暂不能测算。`]))),
    h('article', { class: 'ix-featured', ...countryAttrs(lead.id) }, h('div', { class: 'ix-feature-top' }, eyebrow(['IN FOCUS / 01', '重点机会 / 01']), tag(lead)),
      h('div', { class: 'ix-feature-market' }, h('span', { class: 'ix-mono' }, (lead.investment?.currency||lead.market.manifest.currency) + ' / ' + (lead.play?.hours || lead.market.comparison.archetype.durationHours) + 'H'),
        h('h2', {}, name(lead)), h('p', {}, L(routeName(lead)))),
      h('div', { class: 'ix-feature-metrics' }, metric(HOLD_LABEL, returnPct(lead.econ.hold)), metric(LEVERED_LABEL, returnPct(lead.econ.levered), debtText(lead.investment)), metric(['Modelled fixed income', '模型固定收入占比'], share(lead.econ.secured))),
      basisNote(lead),
      h('p',{class:'ix-feature-risk'},L(['Declared downside: ','既定下行：']),returnPct(lead.investment?.bearHoldIRR)),
      projectFacts(lead.investment),
      lead.investment ? miniature(lead.investment.operatingUSD) : null,
      h('div', { class: 'ix-feature-foot' }, h('span', {}, L(['After-tax cash flow · 20 years', '税后经营现金流 · 20年'])), link(caseUrl(lead), ['Open case ↗', '打开方案 ↗']))));
  content.append(hero);
  content.append(h('div', { class: 'ix-evidence-strip' },
    h('span', {}, L(['AN INVESTOR’S PERSPECTIVE', '从投资者的角度出发'])),
    ...[['Revenue quality', '收益质量'], ['Route to ownership', '投资进入路径'], ['Capital discipline', '资本纪律']].map(x => h('span', {}, '↗ ', L(x)))));

  const picks = rows.filter(r => r.play).slice(0, 3);
  content.append(h('section', { class: 'ix-section' }, h('div', { class: 'ix-heading-row' }, sectionTitle(['THE CAPITAL AGENDA', '本期投资重点'], ['Three places to start.', '从三个重点机会开始。']), link('/returns', ['View the full opportunity set ↗', '查看全部机会 ↗'], 'ix-text-link')),
    h('div', { class: 'ix-picks' }, picks.map((row, i) => h('article', { class: 'ix-pick', ...countryAttrs(row.id) },
      h('div', { class: 'ix-pick-top' }, h('span', { class: 'ix-number' }, `0${i + 1}`), tag(row)),
      h('h3', {}, name(row)), h('p', {}, L(routeName(row))),
      h('div', { class: 'ix-pick-value' }, returnPct(row.econ.hold), h('span', {}, L(HOLD_LABEL), ' · ', L(LEVERED_LABEL), ' ', returnPct(row.econ.levered))),
      decisionReasons(row,true),
      h('p',{class:'ix-margin'},L(marginText(row))),
      projectFacts(row.investment),
      link(caseUrl(row), ['Read the market case ↗', '进入市场详情 ↗'], 'ix-text-link'))))));

  content.append(specialRecommendations(rows, lens()));
  content.append(h('section', { class: 'ix-section ix-process-section' },
    sectionTitle(['FROM A VIEW TO A DECISION', '从观点到投资决策'], ['A clear path through the opportunity.', '让每一步都更接近投资决策。']),
    h('div', { class: 'ix-process' }, [
      ['01', ['Get the investment view', '先看投资结论'], ['Start with the markets and ownership routes that deserve your attention.', '用简洁的投资建议，确定值得投入时间的市场与进入方式。'], '/', ['Investment brief', '投资简报']],
      ['02', ['Compare the economics', '再比较经济性'], ['Place return, income quality and capital needs side by side.', '在同一视图比较回报、收入结构与资本需求。'], '/returns', ['Global markets', '全球市场']],
      ['03', ['Build the bankable case', '最后落实投资方案'], ['Follow the cash flow, delivery steps and risks into the market detail.', '进入市场，逐项拆解现金流、执行步骤与下行风险。'], caseUrl(lead), ['Market intelligence', '市场详情']],
    ].map(([n, title, sub, href, label]) => h('div', {}, h('span', { class: 'ix-step-number' }, n), h('h3', {}, L(title)), h('p', {}, L(sub)), link(href, [label[0] + ' →', label[1] + ' →'], 'ix-text-link'))))));
  content.append(nextSection(['Put your next market in perspective.', '把下一个投资市场，放进全球视野。'], ['Compare the opportunities, then go straight to the case.', '比较机会，聚焦市场，进入可执行的投资方案。'], '/returns', ['Open global markets ↗', '打开全球市场 ↗']));
  container.append(content);
}

