import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, setLens, requestRender } from '../app/state.js';
import { markets } from '../markets/registry.js';
import { CALLS, LENSES, REGIONS, opportunities, caseFor, marketName, caseUrl, compareUrl,
  pct, share, multiple, money, finite, snapshotDate } from './model.js';
import { siteHeader, siteFooter, link, eyebrow, sectionTitle, metric } from './chrome.js';
import { opportunityMatrix, miniature, cashFlowChart, revenueWaterfall, revenueBar } from './charts.js';
import { gateLabel } from './labels.js';
import { labField } from '../comparison/ranges.js';
import { homeState } from '../home/state.js';
import { navigate } from '../app/router.js';

const lens = () => LENSES[app.lens] ? app.lens : 'infraFund';
const button = (label, onclick, cls = '') => h('button', { type: 'button', class: `ix-button ${cls}`, onclick }, L(label));
const name = row => L(marketName(row));
const tag = row => h('span', { class: `ix-tag ${row.call}` }, L(CALLS[row.call] || CALLS.research));
const routeName = row => row.play?.label || row.market.comparison.narrative.archetype;
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
  return h('div', { class: 'ix-meta-bar' }, h('span', { class: 'ix-mono' }, `${number} / ${L(title)}`), lensSelect());
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

export function renderExperience(container, route, market) {
  container.classList.add('ix-app');
  const rows = opportunities(lens());
  container.append(siteHeader(route.name));
  if (route.name === 'home') renderHome(container, rows);
  else if (route.name === 'returns') renderComparison(container, rows);
  else renderMarket(container, rows.find(r => r.id === market.manifest.id));
  container.append(siteFooter());
}

function renderHome(container, rows) {
  const lead = rows.find(r => r.econ.priced && r.play) || rows[0];
  const data = caseFor(lead);
  const content = main();
  content.append(metaBar('01', ['THE INVESTMENT BRIEF', '投资简报']));
  const hero = h('section', { class: 'ix-home-hero' },
    h('div', { class: 'ix-hero-copy' }, eyebrow(['GLOBAL ENERGY. FOCUSED CAPITAL.', '全球能源转型 · 精准配置资本']),
      h('h1', {}, L(['Find conviction.\nInvest in storage.', '看清机会，\n投资储能。'])),
      h('p', { class: 'ix-lead' }, L([`Prioritise ${name(lead)}. Focus capital on ${L(routeName(lead)).toLowerCase()}.`, `重点关注${name(lead)}，优先配置${L(routeName(lead))}。`])),
      h('div', { class: 'ix-actions' }, link(caseUrl(lead), ['Explore the investment case ↗', '查看投资方案 ↗'], 'ix-button'), link('/returns', ['Compare all markets →', '比较全球市场 →'], 'ix-text-link')),
      h('div', { class: 'ix-home-scope' }, h('span', { class: 'ix-status-dot' }), L([`${rows.length} markets. One investment perspective.`, `${rows.length}个市场，一个清晰的投资视角。`]))),
    h('article', { class: 'ix-featured' }, h('div', { class: 'ix-feature-top' }, eyebrow(['IN FOCUS / 01', '重点机会 / 01']), tag(lead)),
      h('div', { class: 'ix-feature-market' }, h('span', { class: 'ix-mono' }, lead.market.manifest.currency + ' / ' + (lead.play?.hours || lead.market.comparison.archetype.durationHours) + 'H'),
        h('h2', {}, name(lead)), h('p', {}, L(routeName(lead)))),
      h('div', { class: 'ix-feature-metrics' }, metric(['Unlevered hold IRR', '无杠杆持有期 IRR'], pct(lead.econ.hold)), metric(['Modelled fixed income', '模型固定收入占比'], share(lead.econ.secured))),
      !data.unavailable ? miniature(data.base.eb) : null,
      h('div', { class: 'ix-feature-foot' }, h('span', {}, L(['Operating cash flow · 15 years', '经营现金流 · 15年'])), link(caseUrl(lead), ['Open case ↗', '打开方案 ↗']))));
  content.append(hero);
  content.append(h('div', { class: 'ix-evidence-strip' },
    h('span', {}, L(['AN INVESTOR’S PERSPECTIVE', '从投资者的角度出发'])),
    ...[['Revenue quality', '收益质量'], ['Route to ownership', '投资进入路径'], ['Capital discipline', '资本纪律']].map(x => h('span', {}, '↗ ', L(x)))));

  const picks = rows.filter(r => r.play).slice(0, 3);
  content.append(h('section', { class: 'ix-section' }, h('div', { class: 'ix-heading-row' }, sectionTitle(['THE CAPITAL AGENDA', '本期投资重点'], ['Three places to start.', '从三个重点机会开始。']), link('/returns', ['View the full opportunity set ↗', '查看全部机会 ↗'], 'ix-text-link')),
    h('div', { class: 'ix-picks' }, picks.map((row, i) => h('article', { class: 'ix-pick' },
      h('div', { class: 'ix-pick-top' }, h('span', { class: 'ix-number' }, `0${i + 1}`), tag(row)),
      h('h3', {}, name(row)), h('p', {}, L(routeName(row))),
      h('div', { class: 'ix-pick-value' }, pct(row.econ.hold), h('span', {}, L(['Unlevered hold IRR', '无杠杆持有期 IRR']))),
      link(caseUrl(row), ['Read the market case ↗', '进入市场详情 ↗'], 'ix-text-link'))))));

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
      h('div', { class: 'ix-legend' }, h('span', { class: 'advance' }, L(['Advance / position', '推进 / 布局'])), h('span', { class: 'situational' }, L(['Situational', '择机'])), h('span', { class: 'watch' }, L(['Watch / research', '观察 / 研究'])))));
    if (!filtered.length) matrixPanel.append(h('div', { class: 'ix-empty', role: 'status' }, h('h3', {}, L(['No markets match your search.', '没有匹配的市场。'])), button(['Reset filters', '重置筛选'], () => { state.query = ''; state.region = 'all'; search.value = ''; for (const b of regions.children) b.setAttribute('aria-pressed', String(b.dataset.region === 'all')); saveFilters(); draw(); })));
    else {
      const selectedPanel = h('aside', { class: 'ix-matrix-detail', 'aria-live': 'polite' });
      const selectRow = row => { state.selected = row.id; selectedPanel.replaceChildren(eyebrow(['SELECTED MARKET', '当前市场']), tag(row), h('h3', {}, name(row)), h('p', {}, L(routeName(row))),
        h('div', { class: 'ix-selected-metrics' }, metric(['Hold IRR', '持有期 IRR'], pct(row.econ.hold)), metric(['Fixed share', '固定收入占比'], share(row.econ.secured))),
        link(caseUrl(row), ['Open market case ↗', '查看市场方案 ↗'], 'ix-button')); };
      selectRow(filtered.find(r => r.id === state.selected));
      matrixPanel.append(h('div', { class: 'ix-matrix-body' }, chartFrame(opportunityMatrix(filtered, state.selected, selectRow)), selectedPanel));
      matrixPanel.append(h('p', { class: 'ix-caption' }, L(['Same 15-year unlevered framework · USD amounts per MW · Market-specific duration and revenue route · Fixed share is modelled revenue, not evidence of a signed project contract.', '统一15年无杠杆框架 · 金额按美元/MW · 保留各市场时长与收入路径 · 固定占比为模型收入构成，不等同于已签署项目合同。'])));
    }
    const sort = h('select', { 'aria-label': L(['Sort markets', '市场排序']), onchange: event => { state.sort = event.target.value; saveFilters(); draw(); } },
      ...[['priority', ['Investment priority', '投资优先级']], ['return', ['Highest hold IRR', '持有期回报降序']], ['income', ['Highest fixed share', '固定收入占比降序']]].map(([id, label]) => h('option', { value: id }, L(label)))); sort.value = state.sort;
    results.replaceChildren(h('div', { class: 'ix-heading-row' }, sectionTitle(['THE OPPORTUNITY SET', '投资机会清单'], [`${filtered.length} ${filtered.length === 1 ? 'market' : 'markets'}. A consistent view.`, `${filtered.length}个市场，同一投资视图。`]), sort));
    const headers = [['Compare', '对比'], ['Market / investment route', '市场 / 投资路径'], ['Hold IRR', '持有期 IRR'], ['Fixed income', '固定收入'], ['Duration', '时长'], ['Action', '建议'], ['', '']];
    const table = h('table', { class: 'ix-table' }, h('caption', { class: 'ix-sr' }, L(['Comparable market investment cases', '跨市场投资方案对比'])),
      h('thead', {}, h('tr', {}, headers.map(label => h('th', { scope: 'col' }, L(label))))),
      h('tbody', {}, filtered.map(row => {
        const checkbox = h('input', { type: 'checkbox', 'aria-label': L([`Compare ${name(row)}`, `比较${name(row)}`]), onchange: () => toggleCompare(row, checkbox) }); checkbox.checked = state.compare.has(row.id);
        return h('tr', {}, h('td', {}, checkbox), h('th', { scope: 'row' }, link(caseUrl(row), name(row)), h('small', {}, L(routeName(row)))),
          h('td', { class: 'ix-table-number' }, pct(row.econ.hold)), h('td', {}, h('span', { class: 'ix-table-number' }, share(row.econ.secured)), revenueBar(row)),
          h('td', {}, `${row.play?.hours || row.market.comparison.archetype.durationHours}h`), h('td', {}, tag(row)), h('td', {}, link(caseUrl(row), '↗', 'ix-row-open', { 'aria-label': L([`Open ${name(row)}`, `打开${name(row)}`]) })));
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
    h('div', { class: 'ix-dialog-grid', style: `--compare-count:${rows.length}` }, rows.map(row => h('article', { class: 'ix-comparison-card' }, tag(row), h('h3', {}, name(row)), h('p', {}, L(routeName(row))),
      metric(['Unlevered hold IRR', '无杠杆持有期 IRR'], pct(row.econ.hold)), metric(['Modelled fixed income', '模型固定收入占比'], share(row.econ.secured)),
      metric(['Fixed revenue tenor', '固定收入年限'], finite(row.econ.securedYears) ? row.econ.securedYears + L([' years', '年']) : '—'),
      metric(['Storage duration', '储能时长'], `${row.play?.hours || row.market.comparison.archetype.durationHours}h`), link(caseUrl(row), ['Open market ↗', '进入市场 ↗'], 'ix-button')))));
  const previous = document.activeElement;
  dialog.addEventListener('close', () => { dialog.remove(); previous?.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.body.append(dialog); dialog.showModal(); close.focus();
  // SPA links remove the modal as part of navigation, keeping its focus trap out
  // of the new route. Escape and the close button retain native dialog behavior.
  dialog.querySelectorAll('a').forEach(a => a.addEventListener('click', e => { if (!e.metaKey && !e.ctrlKey) dialog.close(); }));
}

function renderMarket(container, row) {
  const data = caseFor(row), m = row.market, mf = m.manifest;
  const content = main();
  content.append(h('nav', { class: 'ix-breadcrumb', 'aria-label': L(['Breadcrumb', '面包屑导航']) }, link('/', ['Investment brief', '投资简报']), ' / ', link('/returns', ['Global markets', '全球市场']), ' / ', h('span', {}, name(row))));
  content.append(metaBar('03', ['MARKET INTELLIGENCE', '市场详情']));
  const select = h('select', { 'aria-label': L(['Switch market', '切换市场']), onchange: e => {
    const anchor = link(`/markets/${e.target.value}`, ''); anchor.click();
  } }, markets.map(market => h('option', { value: market.manifest.slug }, L(market.manifest.name)))); select.value = mf.slug;
  content.append(h('section', { class: 'ix-market-intro' }, h('div', {}, eyebrow(['FROM MARKET SCREEN TO INVESTMENT CASE', '从市场筛选，走向投资方案']), h('h1', {}, name(row)), h('p', { class: 'ix-lead' }, L(routeName(row))), h('div', { class: 'ix-actions' }, tag(row), h('span', { class: 'ix-mono' }, `${mf.currency} · ${row.play?.hours || m.comparison.archetype.durationHours}H`))),
    h('div', { class: 'ix-market-controls' }, select, button(['Print investment brief ↗', '打印投资简报 ↗'], () => window.print(), 'ix-outline'))));
  const anchors = [['overview', ['Overview', '市场概览']], ['bankable', ['Bankable case', '可融资方案']], ['revenue', ['Revenue', '收益拆解']], ['execution', ['Execution', '执行步骤']], ['downside', ['Downside', '下行风险']], ['sources', ['Sources', '来源']]];
  content.append(h('nav', { class: 'ix-section-nav', 'aria-label': L(['Market sections', '市场详情章节']) }, anchors.map(([id, label]) => link(`#${id}`, label))));
  content.append(h('section', { id: 'overview', class: 'ix-section ix-overview' },
    sectionTitle(['THE INVESTMENT VIEW', '市场投资判断'], ['Understand what drives the case.', '先理解这项投资，为什么成立。']),
    h('div', { class: 'ix-overview-body' }, h('div', {}, h('p', { class: 'ix-thesis' }, L(row.play?.why || m.comparison.narrative.thesis)),
      link(`${caseUrl(row)}/home`, ['Explore the full market research ↗', '阅读完整市场研究 ↗'], 'ix-text-link')),
      h('aside', { class: 'ix-next-action' }, eyebrow(['NEXT INVESTMENT ACTION', '下一项投资行动']), h('p', {}, L(row.play?.action?.text || m.comparison.refinement?.currentUpdate || m.comparison.narrative.thesis))))));
  if (!data.unavailable) {
    content.append(bankableSection(data), revenueSection(data));
  } else content.append(h('section', { id: 'bankable', class: 'ix-panel ix-section' }, h('h2', {}, L(['Investment case in research', '投资方案研究中'])), h('p', {}, L(['This market does not yet have a complete return model. Continue with the market research and execution plan.', '本市场尚无完整回报模型，可继续查看市场研究与执行计划。']))));
  content.append(executionSection(row));
  if (!data.unavailable) content.append(downsideSection(data));
  content.append(sourcesSection(row));
  content.append(nextSection(['Keep the opportunity in context.', '让投资判断，始终保有全球视角。'], ['Return to the matrix and compare this case with your next market.', '返回全球矩阵，将当前方案与下一个市场放在一起比较。'], compareUrl([row.id]), ['Back to global comparison ↗', '返回全球比较 ↗']));
  container.append(content);
}

function bankableSection(data) {
  const { row, base, debt } = data;
  return h('section', { id: 'bankable', class: 'ix-section' }, sectionTitle(['THE BANKABLE CASE', '可融资方案'], ['Turn the investment view into cash flow.', '把投资逻辑，落到现金流。'], ['Reference underwriting case · Same route and duration as the market screen.', '参考承销模型 · 与市场比较页采用相同收入路径与储能时长。']),
    h('div', { class: 'ix-kpis' }, metric(['Unlevered hold IRR', '无杠杆持有期 IRR'], pct(base.irrHold)), metric(['Modelled fixed revenue', '模型固定收入占比'], share(base.securedShare)), metric(['Modelled minimum DSCR', '模型最低 DSCR'], multiple(debt?.minDSCR)), metric(['Net investment / MW', '净投资额 / MW'], money(base.net))),
    card(h('div', { class: 'ix-panel-heading' }, h('h3', {}, L(['Cash generation & debt payments', '经营现金流与债务支付'])), h('div', { class: 'ix-legend' }, h('span', { class: 'advance' }, L(['Base cash flow', '基准现金流'])), h('span', { class: 'pale' }, L(['Downside cash flow', '下行现金流'])), h('span', { class: 'debt' }, L(['Debt + maturity', '偿债 + 到期本金'])))),
      chartFrame(cashFlowChart(data)), h('p', { class: 'ix-caption' }, L(['USD per MW. Debt uses the platform’s financing conventions; the line includes scheduled service and bullet repayment. Minimum DSCR above measures scheduled service. Downside keeps the base debt schedule.', '金额为美元/MW。债务采用平台融资参数，折线包含定期偿债与到期本金；上方最低DSCR按定期偿债计算。下行情景保留基准债务安排。']))),
    h('div', { class: 'ix-case-summary' }, h('span', {}, L(['Revenue route', '收入路径']), ' / ', L(routeName(row))), h('span', {}, L(['Modelled leverage', '模型杠杆']), ' / ', share(debt?.gearing)), h('span', {}, L(['Fixed-income tenor', '固定收入期']), ' / ', base.securedYears + L([' years', '年']))),
    h('details', { class: 'ix-details ix-valuation-basis' }, h('summary', {}, L(['Valuation basis', '估值口径'])),
      h('p', {}, L([`Discount rates: fixed income ${pct(base.valuationRates.secured)}; renewal ${pct(base.valuationRates.renewal)}; trading ${pct(base.valuationRates.merchant)}. These value cash flows and are separate from the reported hold IRR.`, `折现率：锁定收入${pct(base.valuationRates.secured)}；续约收入${pct(base.valuationRates.renewal)}；交易收入${pct(base.valuationRates.merchant)}。这些用于现金流估值，与上方持有期IRR分开呈现。`]))));
}

function revenueSection(data) {
  const b = data.bridge;
  const parts = [[['Fixed revenue', '固定收入'], b.fixed], [['Auction renewal', '拍卖续约'], b.renewal], [['Trading & ancillary services', '交易及辅助服务'], b.trading], [['OEM service cost', '设备服务成本'], -b.service], [['Other operating / lifecycle costs', '其他运营及生命周期成本'], -b.operating], [['Net operating cash', '净经营现金流'], b.net]];
  return h('section', { id: 'revenue', class: 'ix-section' }, sectionTitle(['REVENUE BREAKDOWN', '收益拆解'], ['Every return has a source.', '每一分收益，都有清晰来源。']),
    h('div', { class: 'ix-revenue-layout' }, h('aside', { class: 'ix-assumptions' }, eyebrow(['THE CASE IN NUMBERS', '核心经济参数']),
      metric(['Gross revenue / MW / year', '首年总收入 / MW'], money(b.gross)), metric(['Fixed income share', '固定收入占比'], share(data.base.securedShare)),
      metric(['Operating cash / MW / year', '首年经营现金流 / MW'], money(b.net)), h('p', {}, L(['All amounts follow the selected market design. Trading includes ancillary services; OEM service costs are deducted separately.', '所有金额跟随当前市场方案。交易收入已含辅助服务，设备服务成本单列扣除。']))),
      card(h('div', { class: 'ix-panel-heading' }, h('h3', {}, L(['Revenue → operating cash flow', '收入 → 经营现金流'])), h('span', { class: 'ix-mono' }, 'USD k / MW · Y1')), chartFrame(revenueWaterfall(b)),
        h('details', { class: 'ix-details' }, h('summary', {}, L(['See the exact breakdown', '查看精确拆解'])), h('table', { class: 'ix-table' }, h('tbody', {}, parts.map(([label, val]) => h('tr', {}, h('th', { scope: 'row' }, L(label)), h('td', { class: 'ix-table-number' }, money(val))))))))));
}

function executionSection(row) {
  const steps = [
    { title: ['Secure the asset and grid position', '锁定资产与并网权利'], owner: ['Investment team + legal', '投资团队 + 法律顾问'],
      copy: ['Confirm site control, connection rights, delivery milestones and transferability. Build the data room around the actual asset.', '确认土地权利、并网权益、交付里程碑与转让条件，围绕实际资产组织资料室。'], output: ['Title, connection offer, milestone register', '权属文件、并网要约、里程碑清单'] },
    { title: ['Contract the revenue route', '落实收入路径'], owner: ['Commercial lead + optimiser', '商务负责人 + 优化商'],
      copy: ['Document award or toll terms, revenue-sharing, dispatch rights, performance deductions and counterparty support.', '整理容量中标或租赁条款、收益分配、调度权、履约扣款与交易对手增信。'], output: ['Revenue term sheet and settlement model', '收入条款清单与结算模型'] },
    { title: ['Freeze design, budget and funding', '确定设计、预算与融资'], owner: ['Technical adviser + lenders', '技术顾问 + 贷款银行'],
      copy: ['Match duration and usable energy to the revenue obligation. Reconcile EPC cost, degradation, warranty and the lender’s cash-flow case.', '将储能时长与可用电量匹配收入义务，核对EPC造价、衰减、质保与银行现金流模型。'], output: ['EPC offer, warranty schedule, financing terms', 'EPC报价、质保计划、融资条款'] },
    { title: ['Commission, qualify and operate', '调试、准入与运营'], owner: ['EPC + operator + asset manager', 'EPC + 运营商 + 资产管理人'],
      copy: ['Complete grid tests and product qualification. Set dispatch limits, settlement checks and recurring warranty and covenant monitoring.', '完成并网测试与产品资格认证，设定调度边界、结算核查及持续质保和贷款契约监测。'], output: ['Commissioning record and operating playbook', '调试验收记录与运营手册'] },
  ];
  const section = h('section', { id: 'execution', class: 'ix-section' }, sectionTitle(['STEP-BY-STEP OPERATION GUIDANCE', '逐步执行指南'], ['A practical route from interest to operation.', '从投资意向，走到实际运营。'], ['Investment workstreams, with an owner and a tangible output at each step.', '每个工作阶段，都明确负责人和可检查的交付物。']),
    h('div', { class: 'ix-execution' }, steps.map((step, i) => h('details', { class: 'ix-execution-step', ...(i === 0 ? { open: '' } : {}) },
      h('summary', {}, h('span', { class: 'ix-step-number' }, String(i + 1).padStart(2, '0')), h('span', {}, h('strong', {}, L(step.title)), h('small', {}, L(step.owner))), h('span', { class: 'ix-expand', 'aria-hidden': 'true' }, '+')),
      h('div', { class: 'ix-step-body' }, h('p', {}, L(step.copy)), h('div', { class: 'ix-output' }, eyebrow(['OUTPUT', '交付物']), L(step.output)))))));
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
    [['Unlevered hold IRR', '无杠杆持有期 IRR'], pct(base.irrHold), pct(bear.irrHold)],
    [['Year-one operating cash / MW', '首年经营现金流 / MW'], money(base.eb[0]), money(bear.eb[0])],
    [['Minimum cover incl. maturity', '含到期本金的最低偿债覆盖'], multiple(data.coverBase), multiple(data.coverBear)],
  ];
  const profile = row.market.comparison.refinement;
  return h('section', { id: 'downside', class: 'ix-section' }, sectionTitle(['DOWNSIDE RISK', '下行风险'], ['Know what can weaken the case.', '看清风险，才能守住回报。']),
    card(h('div', { class: 'ix-panel-heading' }, h('h3', {}, L(['Base case vs. declared downside', '基准与既定下行情景'])), h('span', { class: 'ix-mono' }, L(['UNCHANGED BASE DEBT', '沿用基准债务']))),
      h('div', { class: 'ix-table-scroll' }, h('table', { class: 'ix-table ix-downside-table' }, h('thead', {}, h('tr', {}, ...[['Metric', '指标'], ['Base', '基准'], ['Downside', '下行']].map(x => h('th', { scope: 'col' }, L(x))))),
        h('tbody', {}, riskRows.map(([label, a, b]) => h('tr', {}, h('th', { scope: 'row' }, L(label)), h('td', { class: 'ix-table-number', 'data-label':L(['Base','基准']) }, a), h('td', { class: 'ix-table-number ix-risk-value', 'data-label':L(['Downside','下行']) }, b)))))),
      h('p', { class: 'ix-caption' }, L(['Downside uses the repository’s declared adverse input ranges for this exact design. It is a deterministic stress case, not a P90 forecast. Coverage includes maturity repayment and can be lower than scheduled-service DSCR.', '下行采用仓库对当前方案定义的不利输入边界，属于确定性压力情景，并非P90概率预测。偿债覆盖包含到期本金，因此可能低于按定期还本付息计算的DSCR。'])),
      h('details', { class: 'ix-details' }, h('summary', {}, L(['Inspect the downside inputs', '查看下行情景输入'])),
        h('div', { class: 'ix-input-grid' }, Object.entries(data.overrides).map(([key, value]) => inputLabel(key, value, row.market.manifest.currency))))),
    h('div', { class: 'ix-risk-grid' },
      h('article', {}, eyebrow(['01 / REVENUE', '01 / 收入']), h('h3', {}, L(['Separate the mechanism from the contract.', '区分市场机制与已签合同。'])), h('p', {}, L(base.fixedRevenueEvidence?.basis || ['Project contract evidence remains to be collected.', '仍需收集项目合同证据。'])), h('span', { class: 'ix-risk-stat' }, share(base.executedShare), ' ', L(['executed share in the model', '模型已签约占比']))),
      h('article', {}, eyebrow(['02 / DELIVERY', '02 / 交付']), h('h3', {}, L(['Protect the path to first revenue.', '守住首次收入的实现路径。'])), h('p', {}, L(profile?.currentUpdate || row.market.comparison.narrative.thesis))),
      h('article', {}, eyebrow(['03 / FINANCING', '03 / 融资']), h('h3', {}, L(['Plan for the debt maturity.', '提前安排债务到期偿付。'])), h('p', {}, debt?.refinanceYear ? L([`The model has a year-${debt.refinanceYear} maturity repayment of ${money(debt.balloon)} per MW. Match available cash, equity support and refinancing timing.`, `模型在第${debt.refinanceYear}年存在每MW ${money(debt.balloon)}的到期本金，需匹配可用现金、股东支持与再融资时间。`]) : L(['The selected structure has no modelled bullet repayment. Monitor covenants, cash reserves and operating performance throughout the debt term.', '当前债务结构未设置集中到期本金，仍需持续监测贷款契约、现金储备和运营表现。'])))));
}

function sourcesSection(row) {
  const sources = Object.entries(row.market.sources || {}).filter(([, source]) => /^https?:/.test(source.url || ''));
  const meta = row.market.manifest;
  return h('section', { id: 'sources', class: 'ix-section' }, sectionTitle(['RESEARCH & PROVENANCE', '研究与来源'], ['The evidence stays with the number.', '让证据，始终跟随数字。']),
    h('div', { class: 'ix-source-meta' }, metric(['Market data vintage', '市场数据口径'], meta.dataDate), metric(['Market model', '市场模型版本'], meta.modelVersion), metric(['Briefing built on', '简报生成日期'], snapshotDate)),
    h('details', { class: 'ix-details ix-source-list' }, h('summary', {}, L([`Open ${sources.length} source references`, `查看${sources.length}项来源`])),
      ...sources.map(([key, source]) => h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, h('span', {}, L(source.file || source.title || key)), h('small', {}, source.date || ''), h('span', { 'aria-hidden': 'true' }, '↗')))),
    h('div', { class: 'ix-actions' }, link(`${caseUrl(row)}/data`, ['Full market data & methodology ↗', '完整市场数据与方法 ↗'], 'ix-text-link'), button(['Model this market ↗', '进入本市场测算 ↗'], () => openUnderwriting(row), 'ix-outline')));
}
