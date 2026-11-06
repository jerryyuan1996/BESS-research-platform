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

let renderVersion=0, marketRenderer=null;
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
  else if (route.name === 'returns') renderComparison(container, rows);
  else {
    try {
      const module = await import('./marketPage.js');
      if(version!==renderVersion||window.location.pathname!==pathname||lens()!==investor)return;
      marketRenderer ??= module.createMarketRenderer({lens, button, name, tag, HOLD_LABEL, LEVERED_LABEL, testText, debtText, usText, saleText, routeName, card, main, chartFrame, inputLabel, metaBar, nextSection, openUnderwriting});
      marketRenderer(container, rows.find(r => r.id === market.manifest.id), route);
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
  content.append(metaBar('01', ['THE INVESTMENT BRIEF', '投资简报']));
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

function renderComparison(container, rows) {
  const params = new URLSearchParams(window.location.search);
  const state = { region: params.get('region') || 'all', query: params.get('q') || '', sort: params.get('sort') || 'priority', selected: rows[0].id,
    basis: MATRIX_BASIS[params.get('basis')] ? params.get('basis') : 'hold',
    compare: new Set((params.get('compare') || '').split(',').filter(id => rows.some(r => r.id === id)).slice(0, 3)) };
  if (!REGIONS[state.region]) state.region = 'all';
  const content = main(); content.append(metaBar('02', ['GLOBAL OPPORTUNITIES', '全球机会']));
  content.append(h('section', { class: 'ix-page-intro' }, eyebrow(['THE MARKET SCREEN', '跨市场投资筛选']), h('h1', {}, L(['A world of opportunity.\nA sharper shortlist.', '全球机会，一目了然。\n重点市场，清晰可选。'])),
    h('p', { class: 'ix-lead' }, L(['Compare income quality with return. Follow the opportunity into an investable case.', '把收益质量与回报放在一起比较，再把重点机会推进为投资方案。']))));
  const saveFilters = () => {
    const p = new URLSearchParams();
    if (state.region !== 'all') p.set('region', state.region);
    if (state.query) p.set('q', state.query);
    if (state.sort !== 'priority') p.set('sort', state.sort);
    if (state.basis !== 'hold') p.set('basis', state.basis);
    if (state.compare.size) p.set('compare', [...state.compare].join(','));
    window.history.replaceState({}, '', `/returns${p.size ? '?' + p : ''}`);
  };
  const filters = h('div', { class: 'ix-filter-bar' });
  const regions = h('div', { class: 'ix-segments', role: 'group', 'aria-label': L(['Market region', '市场地区']) });
  for (const [id, title] of [['all', ['All markets', '全部市场']], ...Object.entries(REGIONS)]) {
    regions.append(h('button', { type: 'button', 'aria-pressed': String(state.region === id), onclick: () => {
      state.region = id; for (const b of regions.children) b.setAttribute('aria-pressed', String(b === regions.querySelector(`[data-region="${id}"]`))); saveFilters(); draw();
    }, 'data-region': id }, L(title)));
  }
  const search = h('input', { type: 'search', value: state.query, placeholder: L(['Search a market…', '搜索市场…']), 'aria-label': L(['Search markets', '搜索市场']), oninput: event => { state.query = event.target.value; saveFilters(); draw(); } });
  filters.append(regions, h('div', { class: 'ix-search' }, h('span', { 'aria-hidden': 'true' }, '⌕'), search));
  content.append(filters);
  const matrixPanel = h('section', { class: 'ix-panel ix-matrix-panel' });
  const results = h('section', { class: 'ix-section ix-results' });
  const tray = h('div', { class: 'ix-compare-tray', 'aria-live': 'polite' });
  const visibleRows = () => rows.filter(r => (state.region === 'all' || r.region === state.region) &&
    `${marketName(r).join(' ')} ${r.id} ${r.market.manifest.name.join(' ')}`.toLowerCase().includes(state.query.toLowerCase().trim()))
    .sort((a, b) => state.sort === 'return' ? (b.econ.hold ?? -99) - (a.econ.hold ?? -99) : state.sort === 'income' ? (b.econ.secured ?? -1) - (a.econ.secured ?? -1) : a.rank - b.rank);

  function drawTray() {
    tray.replaceChildren(); tray.hidden = !state.compare.size;
    if (!state.compare.size) return;
    tray.append(h('span', {}, L([`${state.compare.size}/3 markets selected`, `已选${state.compare.size}/3个市场`])),
      h('span', { class: 'ix-tray-names' }, rows.filter(r => state.compare.has(r.id)).map(name).join(' · ')),
      button(['Clear', '清空'], () => { state.compare.clear(); saveFilters(); draw(); }, 'ix-ghost'),
      button(['Compare side by side ↗', '并排比较 ↗'], () => compareDialog(rows.filter(r => state.compare.has(r.id)))));
  }
  function toggleCompare(row, checkbox) {
    if (state.compare.has(row.id)) state.compare.delete(row.id);
    else if (state.compare.size < 3) state.compare.add(row.id);
    else { checkbox.checked = false; tray.querySelector('span').textContent = L(['Compare up to three markets. Remove one to add another.', '最多比较三个市场，请先移除一个。']); return; }
    saveFilters(); drawTray();
  }
  function draw() {
    const filtered = visibleRows();
    if (!filtered.some(r => r.id === state.selected)) state.selected = filtered[0]?.id;
    matrixPanel.replaceChildren(h('div', { class: 'ix-panel-heading' }, h('div', {}, eyebrow(['GLOBAL OPPORTUNITY MATRIX', '全球机会矩阵']), h('h2', {}, L(['Income quality meets return.', '收益质量，与投资回报相遇。']))),
      h('div', { class: 'ix-matrix-controls' },
        h('div', { class: 'ix-segments ix-basis-switch', role: 'group', 'aria-label': L(['Return basis', '回报口径']) },
          [['hold', ['All-equity', '全股权']], ['levered', ['Levered', '杠杆后']]].map(([id, label]) => h('button', { type: 'button', 'aria-pressed': String(state.basis === id),
            onclick: () => { if (state.basis === id) return; state.basis = id; saveFilters(); draw(); } }, L(label)))),
        h('div', { class: 'ix-legend' }, h('span', { class: 'advance' }, L(['Advance / position', '推进 / 布局'])), h('span', { class: 'situational' }, L(['Situational', '择机'])), h('span', { class: 'watch' }, L(['Watch / research', '观察 / 研究'])),
          h('span', { class: 'size' }, L(['Dot area = project total capex (USD)', '圆点面积 = 项目总资本开支（美元）']))))));
    if (!filtered.length) matrixPanel.append(h('div', { class: 'ix-empty', role: 'status' }, h('h3', {}, L(['No markets match your search.', '没有匹配的市场。'])), button(['Reset filters', '重置筛选'], () => { state.query = ''; state.region = 'all'; search.value = ''; for (const b of regions.children) b.setAttribute('aria-pressed', String(b.dataset.region === 'all')); saveFilters(); draw(); })));
    else {
      const selectedPanel = h('aside', { class: 'ix-matrix-detail', 'aria-live': 'polite' });
      const selectRow = row => { state.selected = row.id; selectedPanel.replaceChildren(
        h('div',{class:'ix-selected-summary'},
          h('div',{class:'ix-selected-identity'},eyebrow(['SELECTED MARKET','当前市场']),h('div',{class:'ix-selected-title'},h('h3',{},name(row)),tag(row)),h('p',{},L(routeName(row)))),
          h('div',{class:'ix-selected-metrics'},metric(HOLD_LABEL,returnPct(row.econ.hold)),metric(LEVERED_LABEL,returnPct(row.econ.levered)),metric(['Fixed share','固定收入占比'],share(row.econ.secured))),
          link(caseUrl(row),['Open market case ↗','查看市场方案 ↗'],'ix-button')),
        h('details',{class:'ix-details ix-selected-evidence'},h('summary',{},L(['Investment rationale and project assumptions','投资依据与项目参数'])),
          basisNote(row),decisionReasons(row),contractEvidence(row),projectFacts(row.investment)));
        Object.entries(countryAttrs(row.id)).forEach(([k,v])=>selectedPanel.setAttribute(k,v)); };
      selectRow(filtered.find(r => r.id === state.selected));
      matrixPanel.append(h('div', { class: 'ix-matrix-body' }, chartFrame(opportunityMatrix(filtered, state.selected, selectRow, { basis: state.basis })), selectedPanel));
      const unpriced=filtered.filter(row=>!finite(row.econ[state.basis]));
      if(unpriced.length)matrixPanel.append(h('div',{class:'ix-unpriced-markets'},
        h('strong',{},L(['Returns not priced — see the evidence gap','暂未定价：先核查缺失的依据'])),
        unpriced.map(row=>h('button',{type:'button',class:'ix-unpriced-market',onclick:()=>{
          matrixPanel.querySelectorAll('.ix-point').forEach(p=>{p.classList.remove('selected');p.setAttribute('aria-pressed','false');});
          selectRow(row);
        }},name(row),' · N/M'))));
      matrixPanel.append(h('p', { class: 'ix-caption' }, L([
        'Same RTB closing date · 20 operating years · nominal after project tax. The vertical axis shows actual modelled IRR; apply your own return target. Fixed share is modelled first-year fixed revenue, not proof of bankability. Dot area shows typical project build/grid capex in USD, not market size. Contract and inflation assumptions appear in each case.',
        '统一RTB交割起点 · 20年运营 · 税后名义。纵轴展示模型IRR，可自行对照回报目标。固定收入占比为模型首年口径，不代表项目已可融资。圆面积表示典型项目建设及并网资本开支（美元），不代表市场规模；合同与通胀假设见各市场详情。',
      ])));

    }
    const sort = h('select', { 'aria-label': L(['Sort markets', '市场排序']), onchange: event => { state.sort = event.target.value; saveFilters(); draw(); } },
      ...[['priority', ['Investment priority', '投资优先级']], ['return', ['Highest investment IRR', '投资回报降序']], ['income', ['Highest fixed share', '固定收入占比降序']]].map(([id, label]) => h('option', { value: id }, L(label)))); sort.value = state.sort;
    results.replaceChildren(h('div', { class: 'ix-heading-row' }, sectionTitle(['THE OPPORTUNITY SET', '投资机会清单'], [`${filtered.length} ${filtered.length === 1 ? 'market' : 'markets'}. A consistent view.`, `${filtered.length}个市场，同一投资视图。`]), sort));
    const headers = [['Compare', '对比'], ['Market / investment route', '市场 / 投资路径'], HOLD_LABEL, LEVERED_LABEL, ['Target test', '目标检验'], ['Fixed income', '固定收入'], ['Action', '建议']];
    const table = h('table', { class: 'ix-table ix-opportunity-set' }, h('caption', { class: 'ix-sr' }, L(['Comparable market investment cases', '跨市场投资方案对比'])),
      h('thead', {}, h('tr', {}, headers.map(label => h('th', { scope: 'col' }, L(label))))),
      h('tbody', {}, filtered.map(row => {
        const checkbox = h('input', { type: 'checkbox', 'aria-label': L([`Compare ${name(row)}`, `比较${name(row)}`]), onchange: () => toggleCompare(row, checkbox) }); checkbox.checked = state.compare.has(row.id);
        return h('tr', { 'data-market-row':row.id }, h('td', {}, checkbox), h('th', { scope: 'row' }, link(caseUrl(row), name(row)), h('small', {}, L(routeName(row)))),
          h('td', { class: 'ix-table-number', 'data-label':L(HOLD_LABEL) }, returnPct(row.econ.hold), h('small', { class: 'ix-operating-note' }, L(saleText(row))), usText(row.investment) ? h('small', { class: 'ix-operating-note' }, L(usText(row.investment))) : null, operatingPrice(row.investment) ? h('small', { class: 'ix-operating-note' }, L(['New build. ', '新建情景。']), L(operatingPrice(row.investment))) : null),
          h('td', { class: 'ix-table-number', 'data-label':L(LEVERED_LABEL) }, returnPct(row.econ.levered), h('small', { class: 'ix-operating-note', title: L(debtText(row.investment)) }, L(debtShort(row.investment)))),
          h('td', { 'data-label':L(['Target test','目标检验']) }, h('span', { class: `ix-target-test ${row.econ.test?.basis || 'neither'}` }, L(testText(row.econ.test))), row.econ.test ? h('small', { class: 'ix-operating-note' }, L([`Targets ${pct(row.econ.test.target)} / ${pct(row.econ.test.leveredTarget)}`, `目标 ${pct(row.econ.test.target)} / ${pct(row.econ.test.leveredTarget)}`])) : null, h('small',{class:'ix-operating-note'},L(marginText(row))),h('small',{class:'ix-operating-note'},L(marginText(row,'levered')))),
          h('td', { 'data-label':L(['Modelled fixed revenue','模型固定收入']) }, h('span', { class: 'ix-table-number' }, share(row.econ.secured)), revenueBar(row)),
          h('td', { 'data-label':L(['Investment call','投资建议']) }, tag(row),h('small',{class:'ix-operating-note'},row.investment?L(gateLabel(row.market.comparison.refinement?.investmentGate?.[0]||'')):L(availability(row)))));
      })));
    results.append(h('div', { class: 'ix-table-scroll', tabindex: 0, 'aria-label': L(['Scrollable market comparison table', '可横向滚动的市场对比表']) }, table));
    drawTray();
  }
  content.append(matrixPanel, results, nextSection(['The shortlist is only the beginning.', '筛选只是开始，现金流才是关键。'], ['Open a market to see how its revenue is earned, delivered and protected.', '打开市场详情，理解收益从哪里来、如何实现，以及如何控制下行。'], caseUrl(rows[0]), ['Explore a market case ↗', '查看市场方案 ↗']), tray);
  container.append(content); draw();
}

function compareDialog(rows) {
  const dialog = h('dialog', { class: 'ix-dialog', 'aria-label': L(['Market comparison', '市场并排比较']) });
  const close = button(['Close ×', '关闭 ×'], () => dialog.close(), 'ix-ghost');
  dialog.append(h('div', { class: 'ix-heading-row' }, h('h2', {}, L(['Your shortlist, side by side.', '重点市场，并排比较。'])), close),
    h('div', { class: 'ix-dialog-grid', style: `--compare-count:${rows.length}` }, rows.map(row => h('article', { class: 'ix-comparison-card', ...countryAttrs(row.id) }, tag(row), h('h3', {}, name(row)), h('p', {}, L(routeName(row))),
      metric(HOLD_LABEL, returnPct(row.econ.hold)), metric(LEVERED_LABEL, returnPct(row.econ.levered), debtText(row.investment)), metric(['Target test', '目标检验'], L(testText(row.econ.test))), metric(['Modelled fixed income', '模型固定收入占比'], share(row.econ.secured)),
      metric(['Fixed revenue tenor', '固定收入年限'], finite(row.econ.securedYears) ? row.econ.securedYears + L([' years', '年']) : '—'),
      basisNote(row),decisionReasons(row,true),contractEvidence(row),projectFacts(row.investment), link(caseUrl(row), ['Open market ↗', '进入市场 ↗'], 'ix-button')))));
  const previous = document.activeElement;
  dialog.addEventListener('close', () => { dialog.remove(); previous?.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.body.append(dialog); dialog.showModal(); close.focus();
  // SPA links remove the modal as part of navigation, keeping its focus trap out
  // of the new route. Escape and the close button retain native dialog behavior.
  dialog.querySelectorAll('a').forEach(a => a.addEventListener('click', e => { if (!e.metaKey && !e.ctrlKey) dialog.close(); }));
}

