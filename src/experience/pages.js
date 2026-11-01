import { loadInvestmentSummary } from '../opportunities/summaryData.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { currentThesis, basisNote, decisionReasons, decisionPanel, contractEvidence, marginText, availability } from './decision.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, setLens, requestRender } from '../app/state.js';
import { markets } from '../markets/registry.js';
import { CALLS, LENSES, REGIONS, opportunities, storyRowsFor, caseFor, marketName, caseUrl, compareUrl,
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

let renderVersion=0;
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
  else renderMarket(container, rows.find(r => r.id === market.manifest.id), route);
  container.append(siteFooter());
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

let stopStoryPlace = null;
function renderMarket(container, row, route) {
  const data = caseFor(row), m = row.market, mf = m.manifest;
  const storyRows = storyRowsFor(row, lens());
  const content = main();
  content.append(h('nav', { class: 'ix-breadcrumb', 'aria-label': L(['Breadcrumb', '面包屑导航']) }, link('/', ['Investment brief', '投资简报']), ' / ', link('/returns', ['Global markets', '全球市场']), ' / ', h('span', {}, name(row))));
  content.append(metaBar('03', ['MARKET INTELLIGENCE', '市场详情']));
  const select = h('select', { 'aria-label': L(['Switch market', '切换市场']), onchange: e => {
    const anchor = link(`/markets/${e.target.value}`, ''); anchor.click();
  } }, markets.map(market => h('option', { value: market.manifest.slug }, L(market.manifest.name)))); select.value = mf.slug;
  content.append(h('section', { class: 'ix-market-intro' }, h('div', {}, eyebrow(['FROM MARKET SCREEN TO INVESTMENT CASE', '从市场筛选，走向投资方案']), h('h1', {}, name(row)), h('p', { class: 'ix-lead' }, L(routeName(row))), h('div', { class: 'ix-actions' }, tag(row), h('span', { class: 'ix-mono' }, `${row.investment?.currency||mf.currency} · ${row.play?.hours || m.comparison.archetype.durationHours}H`))),
    h('div', { class: 'ix-market-controls' }, select, button(['Print investment brief ↗', '打印投资简报 ↗'], () => window.print(), 'ix-outline'))));
  if (storyRows.length > 1) content.append(h('section', { class: 'ix-panel ix-play-choices', 'aria-label': L(['Two separate opportunities', '两类独立投资机会']) },
    h('h2', {}, L(['Two separate opportunities', '两类独立投资机会'])),
    h('div', { class: 'ix-dialog-grid', style: '--compare-count:2' }, storyRows.map(r => h('article', { class: 'ix-story-play', 'data-play': r.play.id },
      tag(r), h('h3', {}, L(playTitle(r.play, r.stage))),
      r.play.why ? h('p', {}, L(r.play.why)) : null,
      r.play.action?.text ? h('p', {}, L(r.play.action.text)) : null))),
    h('p', { class: 'ix-basis-note' }, L(['Financial case below: ', '下方财务测算对应：']), L(playTitle(row.play, row.stage)))));
  content.append(decisionPanel(row));
  const anchors = [['decision',['Decision','投资判断']],['overview', ['Overview', '市场概览']], ['revenue-drivers', ['Revenue drivers', '收入动因']], ['bankable', ['Bankable case', '可融资方案']], ['revenue', ['Revenue', '收益拆解']], ['execution', ['Execution', '执行步骤']], ['opportunity-comparison', ['Special opportunity', '特殊机会']], ['downside', ['Downside', '下行风险']], ['sources', ['Sources', '来源']]];
  content.append(h('nav', { class: 'ix-section-nav', 'aria-label': L(['Market sections', '市场详情章节']) }, anchors.map(([id, label]) => link(`#${id}`, label))));
  content.append(h('section', { id: 'overview', class: 'ix-section ix-overview' },
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
      ? story.load().then(pack=>{if(research.isConnected&&!storyOpen()&&!pack.open({row,rows:storyRows,result:data,name:marketName(row),trigger:research,openResearch,place,ui:{CALLS,returnPct,marginText,metric,playTitle}}))return openResearch(research);})
      : openResearch(research))
      .catch(()=>{research.textContent=L(['Could not load; click to retry','暂未载入，点击重试']);})
      .finally(()=>{research.disabled=false;});
  };
  const research=button(['Grid, history and full research context ↗','电网、历史与完整研究背景 ↗'],()=>openFrom(null),'ix-outline ix-full-research');
  content.querySelector('#overview').append(research);
  stopStoryPlace?.();
  stopStoryPlace=onStoryPlace((r,{samePage})=>{if(samePage&&r.story&&research.isConnected&&!storyOpen()&&storyFor(mf.id))openFrom(r.story);});
  if(route?.story&&storyFor(mf.id)&&!storyOpen())openFrom(route.story);
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
  for(const id of ['bankable','revenue']){const node=content.querySelector('#'+id);if(node)content.insertBefore(node,overview);}
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
