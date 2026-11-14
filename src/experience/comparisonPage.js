import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';
import {REGIONS,marketName,caseUrl,share,returnPct,pct,finite} from './model.js';
import {link,eyebrow,sectionTitle,metric} from './chrome.js';
import {opportunityMatrix,revenueBar,MATRIX_BASIS} from './charts.js';
import {countryAttrs,projectFacts,operatingPrice} from './projectFacts.js';
import {basisNote,decisionReasons,contractEvidence,marginText,availability} from './decision.js';
import {gateLabel} from './labels.js';

// The comparison table and atlas are needed only on /returns, not on arrival.
export function createComparisonRenderer(ui){
 const {button,name,tag,HOLD_LABEL,LEVERED_LABEL,testText,debtText,usText,debtShort,saleText,routeName,main,chartFrame,metaBar,nextSection}=ui;
function renderComparison(container, rows) {
  rows = rows.filter(row => row.id !== 'sa' && row.region !== 'mea');
  const params = new URLSearchParams(window.location.search);
  const state = { region: params.get('region') || 'all', query: params.get('q') || '', sort: params.get('sort') || 'priority', selected: rows[0].id,
    view: params.get('matrix') === 'overview' ? 'overview' : 'irr', unit: params.get('unit') === 'gwh' ? 'gwh' : 'gw',
    basis: MATRIX_BASIS[params.get('basis')] ? params.get('basis') : 'hold',
    compare: new Set((params.get('compare') || '').split(',').filter(id => rows.some(r => r.id === id)).slice(0, 3)) };
  if (!REGIONS[state.region] || state.region === 'mea') state.region = 'all';
  const content = main(); content.append(metaBar('02', ['GLOBAL OPPORTUNITIES', '全球机会']));
  content.append(h('section', { class: 'ix-page-intro' }, eyebrow(['THE MARKET SCREEN', '跨市场投资筛选']), h('h1', {}, L(['A world of opportunity.\nA sharper shortlist.', '全球机会，一目了然。\n重点市场，清晰可选。'])),
    h('p', { class: 'ix-lead' }, L(['Compare income quality with return. Follow the opportunity into an investable case.', '把收益质量与回报放在一起比较，再把重点机会推进为投资方案。']))));
  const saveFilters = () => {
    const p = new URLSearchParams();
    if (state.region !== 'all') p.set('region', state.region);
    if (state.query) p.set('q', state.query);
    if (state.sort !== 'priority') p.set('sort', state.sort);
    if (state.basis !== 'hold') p.set('basis', state.basis);
    if (state.view !== 'irr') p.set('matrix', state.view);
    if (state.unit !== 'gw') p.set('unit', state.unit);
    if (state.compare.size) p.set('compare', [...state.compare].join(','));
    window.history.replaceState({}, '', `/returns${p.size ? '?' + p : ''}`);
  };
  const filters = h('div', { class: 'ix-filter-bar' });
  const regions = h('div', { class: 'ix-segments', role: 'group', 'aria-label': L(['Market region', '市场地区']) });
  for (const [id, title] of [['all', ['All markets', '全部市场']], ...Object.entries(REGIONS).filter(([id])=>id!=='mea')]) {
    regions.append(h('button', { type: 'button', 'aria-pressed': String(state.region === id), onclick: () => {
      state.region = id; for (const b of regions.children) b.setAttribute('aria-pressed', String(b === regions.querySelector(`[data-region="${id}"]`))); saveFilters(); draw();
    }, 'data-region': id }, L(title)));
  }
  const search = h('input', { type: 'search', value: state.query, placeholder: L(['Search a market…', '搜索市场…']), 'aria-label': L(['Search markets', '搜索市场']), oninput: event => { state.query = event.target.value; saveFilters(); draw(); } });
  filters.append(regions, h('div', { class: 'ix-search' }, h('span', { 'aria-hidden': 'true' }, '⌕'), search));
  content.append(filters);
  const matrixPanel = h('section', { class: 'ix-panel ix-matrix-panel' });
  let atlasModule = null, matrixDraw = 0;
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
    const run = ++matrixDraw;
    const filtered = visibleRows();
    if (!filtered.some(r => r.id === state.selected)) state.selected = filtered[0]?.id;
    matrixPanel.replaceChildren(
      h('div',{class:'ix-segments ix-matrix-view-switch',role:'group','aria-label':L(['Matrix view','矩阵视图'])},
        [['irr',['Investment returns','投资回报 · IRR']],['overview',['Market overview','市场概览 · 电力与储能']]].map(([id,label])=>h('button',{type:'button','data-matrix-view':id,'aria-pressed':String(state.view===id),onclick:()=>{
          state.view=id;saveFilters();draw();matrixPanel.querySelector(`[data-matrix-view="${id}"]`)?.focus({preventScroll:true});
        }},L(label)))),
      h('div', { class: 'ix-panel-heading' }, h('div', {}, eyebrow(['GLOBAL OPPORTUNITY MATRIX', '全球机会矩阵']), h('h2', {}, L(state.view==='irr'?['Income quality meets return.', '收益质量，与投资回报相遇。']:['Different systems. Different storage opportunities.','看清电力底色，理解储能机会。']))),
      state.view==='irr'?h('div', { class: 'ix-matrix-controls' },
        h('div', { class: 'ix-segments ix-basis-switch', role: 'group', 'aria-label': L(['Return basis', '回报口径']) },
          [['hold', ['All-equity', '全股权']], ['levered', ['Levered', '杠杆后']]].map(([id, label]) => h('button', { type: 'button', 'aria-pressed': String(state.basis === id),
            onclick: () => { if (state.basis === id) return; state.basis = id; saveFilters(); draw(); } }, L(label)))),
        h('div', { class: 'ix-legend' }, h('span', { class: 'advance' }, L(['Advance / position', '推进 / 布局'])), h('span', { class: 'situational' }, L(['Situational', '择机'])), h('span', { class: 'watch' }, L(['Watch / research', '观察 / 研究'])),
          h('span', { class: 'size' }, L(['Dot area = project total capex (USD)', '圆点面积 = 项目总资本开支（美元）'])))):null));
    if (!filtered.length) matrixPanel.append(h('div', { class: 'ix-empty', role: 'status' }, h('h3', {}, L(['No markets match your search.', '没有匹配的市场。'])), button(['Reset filters', '重置筛选'], () => { state.query = ''; state.region = 'all'; search.value = ''; for (const b of regions.children) b.setAttribute('aria-pressed', String(b.dataset.region === 'all')); saveFilters(); draw(); })));
    else if(state.view==='overview') {
      const host=h('div',{'aria-busy':'true',class:'ix-atlas-host'},L(['Loading the country matrix…','正在载入国家对比矩阵…']));
      matrixPanel.append(host);
      const load=async()=>{
        try{
          atlasModule ||= await import('./marketAtlas.js');
          if(run!==matrixDraw||!host.isConnected)return;
          const render=()=>{host.replaceChildren(atlasModule.renderMarketAtlas(filtered,{selected:state.selected,unit:state.unit,
            onSelect:row=>{state.selected=row.id;},onUnit:unit=>{state.unit=unit;saveFilters();render();host.querySelector('.atlas-unit button[aria-pressed="true"]')?.focus({preventScroll:true});}}));};
          render();host.setAttribute('aria-busy','false');
        }catch{if(run===matrixDraw&&host.isConnected){host.setAttribute('aria-busy','false');host.replaceChildren(button(['Retry country matrix','重试国家矩阵'],load,'ix-outline'));}}
      };load();
    } else {
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


return renderComparison;
}
