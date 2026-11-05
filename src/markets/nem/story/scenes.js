/* NEM story scenes: market-local compositions over the unchanged story kit.
   Teaching state is local to each scene; no control reaches the case. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { whenLabel } from '../../../experience/story/shell.js';
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { s, n2 } from '../../../experience/story/kit/svg.js';
import { WA_ISLAND_MAP } from '../../wa/story/geo.js';
import { NEM_STORY_VALUES as E } from '../data/storyEvidenceValues.js';
import { datePair, designCells, watchedTrigger } from '../storyBindings.js';
import { NEM_REGIONS } from './geo.js';
import { spreadChart, dayChart, collarDiagram } from './chart.js';
import { story } from '../story.js';

/* Region names, from nem-01's approved labels, reused by nem-07. */
const REGION_NAMES = story.chapters[0].shots[0].labels;

/* replaceChildren prints null as text; skip empty slots. */
const fill = (el, ...kids) => el.replaceChildren(...kids.flat().filter(k => k != null && k !== false));
const T = {
  example: ['Example', '示例'],
  observed: ['Observed (AEMO)', '实测（AEMO）'],
  withheld: ['Spread withheld until the price-data review', '价差在价格数据权限审核前暂不显示'],
  notStated: ['Not stated in the report', '报告未列明'],
  award: ['Award', '中标合同'],
  price: ['Regional price', '价区价格'],
  mwhNotStated: ['MWh total not stated', '未列明MWh总量'],
  projects: ['projects', '个项目'],
  share: ['Battery share', '电池占比'],
  volume: ['Fast-service volume', '快速调频服务量'],
  revenue: ['Battery revenue', '电池收入'],
  plant: ['Slower plant', '响应较慢的机组'],
  trace: ['Frequency dips at the fault', '故障时频率下跌'],
  day: ['Charge at midday, discharge in the evening', '中午充电，傍晚放电'],
  stage: ['Stage', '阶段'],
  operating: ['Operating', '已投运'],
  construction: ['Under construction', '建设中'],
  development: ['In development', '开发中'],
  noStage: ['No stage stated', '未注明阶段'],
  register: ['NEM battery agreements on the register', '登记册上的NEM电池协议'],
  hold: ['Return, building new', '新建情景回报'],
  target: ["Fund's target", '基金目标'],
  ceiling: ['Most the fund can pay, operating', '基金收购在运资产的最高价格'],
  capex: ['Build cost', '建设成本'],
  watched: ['Watched by this call', '本判断关注的事件'],
  context: ['Context, before the trigger', '触发事件之前的背景'],
  term: ['Secured for', '锁定期'],
  years: ['years', '年'],
  share1: ['Secured share of first-year modelled revenue', '首年模型收入中的锁定占比'],
  best: ['Best', '最优'],
  clears: ['Clears the platform\'s yields', '达到平台收益率要求'],
  noClear: ['Does not clear', '未达到'],
  waNode: ['Western Australia', '西澳'],
};
const W = (pair, values) => L(fillPair(pair, values));
const note = (pair, values) => h('p', { class: 'nem-note' }, Array.isArray(pair) ? W(pair, values || {}) : pair);
const readouts = entries => h('dl', { class: 'nem-readouts' }, entries.flatMap(([name, value]) => [h('dt', {}, L(name)), h('dd', {}, Array.isArray(value) ? L(value) : String(value ?? '—'))]));
const options = (pairs, values) => pairs.map((p, value) => ({ value, label: fillPair(p, values) }));

function interactive(shot, values, draw, { controls = shot.controls, initial = 0 } = {}) {
  let mode = initial;
  const host = h('div', { class: 'k-scene nem-scene' }), body = h('div', {});
  const paint = () => { host.setAttribute('data-state', String(mode)); fill(body, draw(mode)); };
  host.append(toggleGroup({ label: fillPair(shot.question, values), value: mode, options: options(controls, values), onChange: v => { mode = v; paint(); } }), body);
  paint();
  return host;
}

/* A small station: the kit's battery, substation and town, with optional
   dashed (future) batteries. */
function station({ title, time = 'day', batteries = 1, future = 0, labels = [] } = {}) {
  return isoStage({ title, desc: T.example, time, sky: false, viewBox: [640, 300], origin: [300, 60], items: [
    { symbol: 'ground', at: [0, 0] }, { symbol: 'solarFarm', at: [1, 2] }, { symbol: 'substation', at: [8, 3] },
    { symbol: 'city', at: [5, 9] },
    ...Array.from({ length: batteries }, (_, i) => ({ symbol: 'battery', at: [12 + (i % 3) * 2.6, 3 + Math.floor(i / 3) * 2.6] })),
    ...Array.from({ length: future }, (_, i) => ({ symbol: 'battery', at: [12 + (i % 3) * 2.6, 8.5 + Math.floor(i / 3) * 2.6], opts: { future: true } })),
  ], wires: [[[4, 4], [8.6, 4]], [[9.6, 4], [12.6, 4.4]], [[9, 5], [6.4, 9]]], labels });
}

/* ---- nem-00 ---------------------------------------------------------------- */
export function openingThumbnail() {
  const trace = s('svg', { viewBox: '0 0 220 40', role: 'img', 'aria-label': L(['Example: a price trace that fades', '示例：逐渐减弱的价格曲线']), class: 'nem-trace' },
    s('path', { d: 'M4,20 C20,2 30,38 46,20 C58,8 66,32 80,20 C90,12 98,28 110,20 C118,15 126,25 136,20 C144,17 152,23 160,20 L216,20', class: 'nem-line nem-example' }));
  return h('div', { class: 'nem-opening' },
    isoStage({ title: ['Example: an operating battery holding its award', '示例：持有中标合同的在运电池'], sky: false, viewBox: [320, 200], origin: [150, 40],
      items: [{ symbol: 'ground', at: [0, 0] }, { symbol: 'battery', at: [5, 3] }, { symbol: 'substation', at: [1, 1] }],
      wires: [[[2, 2], [5.4, 3.4]]], labels: [{ at: [6, 4, 3], text: T.award }] }),
    trace);
}

/* ---- nem-01 and nem-07: the region map ----------------------------------- */
function regionMap(shot, values, { view = 'grid', tags = null, small = false } = {}) {
  const M = WA_ISLAND_MAP, A = NEM_REGIONS.anchors, P = M.towns.perth, AD = M.anchors.adelaide;
  const mid = [(P[0] + AD[0]) / 2, (P[1] + AD[1]) / 2];
  const svg = s('svg', { viewBox: `0 0 ${M.viewBox[0]} ${M.viewBox[1]}`, role: 'img', 'aria-label': W(shot.question, values), class: `k-map nem-map${small ? ' nem-map-small' : ''}`, 'data-view': view },
    s('path', { class: 'k-map-nt', d: M.nt }), s('path', { class: 'k-map-wa', d: M.wa }), s('path', { class: 'k-map-swis', d: M.swis }),
    ...Object.entries(NEM_REGIONS.regions).map(([id, d]) => s('path', { d, class: 'nem-region', 'data-region': id })));
  if (view !== 'grid') for (const [a, b] of NEM_REGIONS.links) {
    svg.append(s('line', { x1: A[a][0], y1: A[a][1], x2: A[b][0], y2: A[b][1], class: 'nem-link', 'data-kind': 'interconnector' }));
  }
  for (const [id, [x, y]] of Object.entries(A)) {
    const tag = view === 'grid' ? null : tags ? tags[id] : L(T.price);
    svg.append(s('text', { x, y, class: 'nem-map-label', 'text-anchor': 'middle' }, W(REGION_NAMES[id], values)));
    if (tag) svg.append(s('g', { class: 'nem-tag', 'data-region-tag': id },
      s('rect', { x: x - 44, y: y + 6, width: 88, height: 18, rx: 3 }), s('text', { x, y: y + 19, 'text-anchor': 'middle' }, tag)));
  }
  if (view === 'grid') svg.append(s('text', { x: 415, y: 236, class: 'nem-map-label nem-strong', 'text-anchor': 'middle' }, W(shot.labels.nem, values)));
  if (view === 'wa') svg.append(
    s('path', { class: 'k-link-missing', d: `M${P[0]},${P[1]} L${AD[0]},${AD[1]}` }),
    s('path', { class: 'k-break', d: `M${n2(mid[0] - 7)},${n2(mid[1] - 7)} L${n2(mid[0] + 7)},${n2(mid[1] + 7)} M${n2(mid[0] + 7)},${n2(mid[1] - 7)} L${n2(mid[0] - 7)},${n2(mid[1] + 7)}` }),
    s('text', { x: mid[0], y: mid[1] - 14, class: 'nem-map-label', 'text-anchor': 'middle' }, W(shot.labels.noLink, values)),
    s('text', { x: M.anchors.swisLabel[0], y: M.anchors.swisLabel[1] + 30, class: 'nem-map-label nem-strong' }, W(shot.labels.swis, values)));
  return svg;
}

function regions(shot, { values }) {
  return interactive(shot, values, mode => h('div', {},
    regionMap(shot, values, { view: ['grid', 'regions', 'wa'][mode] }),
    mode === 1 ? note(shot.labels.link, values) : null));
}

/* ---- nem-02: six nodes, and WA in 2006 ------------------------------------ */
function history(shot, { values }) {
  const nodes = shot.extra.historyNodes, wa = shot.extra.waNode, fields = ['constraint', 'choice', 'remains', 'effect'];
  let node = 0, field = 0, showWa = false;
  const host = h('div', { class: 'k-scene nem-scene nem-history' }), body = h('div', {});
  const detail = (n, extraClass = '') => h('div', { class: `nem-history-detail${n.style === 'plan' ? ' nem-future' : ''}${extraClass}` },
    h('h5', {}, L(whenLabel(n.when)), ' · ', W(n.title, values)),
    h('p', {}, n[fields[field]] ? W(n[fields[field]], values) : L(['No statement for this field', '此项无内容'])));
  const paint = () => {
    host.setAttribute('data-node', nodes[node].id);
    const strip = s('svg', { viewBox: '0 0 640 70', role: 'img', 'aria-label': W(shot.question, values) },
      s('line', { x1: 30, x2: 610, y1: 30, y2: 30, class: 'nem-axis' }),
      ...nodes.map((n, i) => s('circle', { cx: 50 + i * 108, cy: 30, r: i === node ? 9 : 6, class: n.style === 'plan' ? 'nem-node nem-future' : 'nem-node', 'data-node': n.id })),
      ...nodes.map((n, i) => s('text', { x: 50 + i * 108, y: 58, 'text-anchor': 'middle', class: 'nem-chart-label nem-tick' }, L(whenLabel(n.when)))),
      showWa ? s('g', { 'data-layer': 'wa' }, s('rect', { x: 92, y: 20, width: 20, height: 20, class: 'nem-wa-marker' }), s('text', { x: 102, y: 14, 'text-anchor': 'middle', class: 'nem-chart-label' }, L(T.waNode))) : null);
    fill(body, strip, showWa
      ? h('div', { class: 'nem-pair' }, detail(nodes[0]), detail({ ...wa, style: 'observed', title: [`${L(T.waNode)} · ${wa.title[0]}`, `${L(T.waNode)} · ${wa.title[1]}`] }, ' nem-wa'))
      : detail(nodes[node]));
  };
  host.append(
    toggleGroup({ label: shot.controls[0], value: node, options: nodes.map((n, value) => ({ value, label: [`${whenLabel(n.when)[0]} · ${n.title[0]}`, `${whenLabel(n.when)[1]} · ${n.title[1]}`] })), onChange: v => { node = v; showWa = false; paint(); } }),
    toggleGroup({ label: fillPair(shot.question, values), value: field, options: options(shot.controls.slice(1, 5), values), onChange: v => { field = v; paint(); } }),
    toggleGroup({ label: shot.controls[5], multi: true, options: [{ value: 'wa', label: fillPair(shot.controls[5], values), pressed: false }], onChange: (_, pressed) => { showWa = pressed; paint(); } }),
    body);
  paint();
  return host;
}

/* ---- nem-03: seconds, hours, who supplies the services --------------------- */
function fastServices(shot, { values }) {
  const L2 = k => shot.labels[k];
  return interactive(shot, values, mode => {
    if (mode === 0) return h('div', {}, s('svg', { viewBox: '0 0 640 200', role: 'img', 'aria-label': W(L2('frequency'), values) },
      s('line', { x1: 40, x2: 620, y1: 60, y2: 60, class: 'nem-grid' }),
      s('path', { d: 'M40,60 L200,60 L220,140 L250,110 L300,80 L620,62', class: 'nem-line nem-example', 'data-kind': 'example' }),
      s('path', { d: 'M40,180 L215,180 L222,120 L620,120', class: 'nem-line nem-battery', 'data-kind': 'example' }),
      s('path', { d: 'M40,180 L215,180 L360,150 L620,140', class: 'nem-line nem-ghost', 'data-kind': 'example' }),
      s('text', { x: 40, y: 30, class: 'nem-chart-label' }, W(L2('frequency'), values)),
      s('text', { x: 230, y: 112, class: 'nem-chart-label' }, W(L2('battery'), values)),
      s('text', { x: 400, y: 158, class: 'nem-chart-label' }, L(T.plant))), note(T.trace));
    if (mode === 1) return h('div', {}, station({ title: W(L2('battery'), values), time: 'dusk' }), note(T.day), note(L2('shifting'), values));
    const bar = (label, share, key) => h('div', { class: 'nem-share', 'data-share': key },
      h('p', {}, L(label), ' · ', `${Math.round(share * 1000) / 10}%`),
      s('svg', { viewBox: '0 0 400 22', role: 'img', 'aria-label': `${L(label)} ${Math.round(share * 1000) / 10}%` },
        s('rect', { x: 0, y: 2, width: 400, height: 18, class: 'nem-rest' }), s('rect', { x: 0, y: 2, width: 400 * share, height: 18, class: 'nem-bar', 'data-kind': 'observed' })));
    return h('div', {}, bar([`${L(T.volume)}: ${L(T.share)}`, `${L(T.volume)}：${L(T.share)}`].map(String), E.qed.fcasVolumeShare, 'volume'),
      bar([`${W(L2('services'), values)} · ${L(T.revenue)}`, `${W(L2('services'), values)} · ${L(T.revenue)}`], E.qed.fcasRevenueShare, 'revenue'),
      note(L2('observed'), values));
  });
}

/* ---- nem-04: rounds, and what an award is -------------------------------- */
function tenders(shot, { values }) {
  const lb = shot.labels;
  return interactive(shot, values, mode => {
    if (mode === 1) return h('div', { class: 'nem-cards' },
      ...[lb.floor, lb.ceiling, lb.cap].map(p => h('div', { class: 'nem-card', 'data-term': p[0] }, W(p, values))),
      h('div', { class: 'nem-card nem-card-wide' }, W(lb.start, values)));
    return h('ol', { class: 'nem-rounds' }, ...E.tenders.map(t => h('li', { class: `nem-card${t.status === 'assessing' ? ' nem-open' : ''}`, 'data-round': t.id },
      h('strong', {}, W(t.kind === 'pilot' ? lb.pilot : lb.round, values)), ' · ',
      t.status === 'assessing' ? W(lb.assessing, values) : L(datePair(t.announcedOn)),
      h('br', {}),
      t.status === 'assessing' ? '' : t.mwh ? `${t.mwh.toLocaleString('en-US')} MWh · ${t.projects} ${L(T.projects)}` : `${L(T.mwhNotStated)} · ${t.projects} ${L(T.projects)}`)),
      h('li', { class: 'nem-card nem-edge', 'aria-hidden': 'true' }, ''));
  });
}

/* ---- nem-05, nem-06, nem-07: rights-gated observations ---------------------- */
export function makeScenes({ observed = null } = {}) {
  const spreadObserved = observed ? { ...observed, nemDischargeMW: E.qed.nemDischargeMW, wemDischargeMW: E.qed.wemDischargeMW } : null;

  function day(shot, ctx) {
    return h('div', { class: 'nem-day' }, station({ title: W(shot.question, ctx.values), time: 'day', batteries: 2 }),
      dayChart(shot, ctx, { observed: observed?.timeOfDayPriceAUDPerMWh ? { q3_2026: observed.timeOfDayPriceAUDPerMWh.q3_2026, q3_2025: observed.timeOfDayPriceAUDPerMWh.q3_2025 } : null }));
  }
  function spread(shot, ctx) {
    return spreadChart(shot, ctx, { quarters: E.qed.quarters, observed: spreadObserved });
  }
  function location(shot, { values }) {
    const r = observed?.regionalSpreadAUDPerMWh;
    const fmt = v => Number.isFinite(v) ? `$${v}/MWh` : L(T.notStated);
    return interactive(shot, values, mode => {
      if (mode === 1) return h('div', {}, s('svg', { viewBox: '0 0 640 200', role: 'img', 'aria-label': W(shot.labels.loss, values) },
        s('circle', { cx: 150, cy: 110, r: 70, class: 'nem-dial' }),
        s('line', { x1: 150, y1: 110, x2: 200, y2: 70, class: 'nem-arrow', 'data-kind': 'example' }),
        s('text', { x: 150, y: 200, 'text-anchor': 'middle', class: 'nem-chart-label' }, W(shot.labels.point, values)),
        s('text', { x: 260, y: 90, class: 'nem-chart-label' }, W(shot.labels.loss, values)),
        s('path', { d: 'M260,130 l0,-30 l40,8 l-40,8', class: 'nem-flag' }),
        s('text', { x: 310, y: 120, class: 'nem-chart-label' }, W(shot.labels.curtail, values))), note(T.example));
      const tags = r ? Object.fromEntries(Object.keys(NEM_REGIONS.regions).map(id => [id, fmt(r.latest[id])])) : Object.fromEntries(Object.keys(NEM_REGIONS.regions).map(id => [id, L(T.example)]));
      return h('div', {}, regionMap(shot, values, { view: 'regions', tags, small: true }),
        r ? h('table', { class: 'nem-table' }, h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, W(shot.labels.byRegion, values)), h('th', {}, W(shot.labels.yearBefore, values)))),
          h('tbody', {}, Object.keys(NEM_REGIONS.regions).map(id => h('tr', {}, h('th', { scope: 'row' }, W(REGION_NAMES[id], values)), h('td', {}, fmt(r.latest[id])), h('td', {}, fmt(r.yearBefore[id]))))))
          : note(T.withheld),
        note(r ? shot.labels.observed : T.example, values));
    });
  }

  return {
    'nem-00': () => openingThumbnail(), 'nem-01': regions, 'nem-02': history, 'nem-03': fastServices,
    'nem-04': tenders, 'nem-05': day, 'nem-06': spread, 'nem-07': location, 'nem-08': duration,
    'nem-09': collar, 'nem-10': payment, 'nem-11': operating, 'nem-12': closing,
  };
}

/* ---- nem-08: why four hours ------------------------------------------------ */
function duration(shot, { values }) {
  const cells = designCells(), hours = [...new Set(cells.map(c => c.hours))];
  const routes = [['ltda', shot.labels.award], ['mer', shot.labels.merchant], ['toll', shot.labels.toll]];
  let index = Math.max(0, hours.indexOf(Number(values.playDuration))), view = 0;
  const host = h('div', { class: 'k-scene nem-scene' }), body = h('div', {});
  const paint = () => {
    const hr = hours[index];
    host.setAttribute('data-hours', String(hr));
    fill(body, note(T.example),
      station({ title: [`${E.teaching.powerMW} MW · ${hr}h`, `${E.teaching.powerMW}MW · ${hr}小时`], batteries: Math.max(1, Math.ceil(hr / 2)) }),
      readouts([[T.example, `${E.teaching.powerMW} MW · ${E.teaching.powerMW * hr} MWh`]]),
      note([`${shot.labels.energy[0]} · ${shot.labels.capital[0]}`, `${shot.labels.energy[1]} · ${shot.labels.capital[1]}`]),
      h('table', { class: 'nem-routes' }, h('tbody', {}, routes.map(([route, name]) => {
        const c = cells.find(x => x.route === route && x.hours === hr);
        const best = (view === 1 && route === 'ltda' && c?.best) || (view === 2 && route === 'mer' && hr === Number(values.merchantBest));
        return h('tr', { class: best ? 'nem-best' : '', 'data-route': route, ...(view === 2 && route !== 'mer' ? { hidden: '' } : {}) },
          h('th', { scope: 'row' }, W(name, values)),
          h('td', {}, W(c?.priced ? shot.labels.priced : shot.labels.notPriced, values)),
          h('td', {}, c?.valueText ? L(c.valueText) : '—'),
          h('td', {}, c?.priced ? L(c.value > 0 ? T.clears : T.noClear) : ''));
      }))),
      view === 1 ? note(shot.labels.design, values) : null,
      view === 2 ? note([`${L(T.best)}: ${values.merchantBest}h`, `${L(T.best)}：${values.merchantBest}小时`]) : null);
  };
  host.append(
    toggleGroup({ label: fillPair(shot.controls[0], values), value: index, options: hours.map((x, value) => ({ value, label: [`${x}h`, `${x}小时`] })), onChange: v => { index = v; paint(); } }),
    toggleGroup({ label: fillPair(shot.question, values), value: view, options: [{ value: 0, label: ['Each duration', '逐一时长'] }, ...options(shot.controls.slice(1), values).map(o => ({ ...o, value: o.value + 1 }))], onChange: v => { view = v; if (v === 1) index = Math.max(0, hours.indexOf(Number(values.bestDuration))); if (v === 2) index = Math.max(0, hours.indexOf(Number(values.merchantBest))); paint(); } }),
    body);
  paint();
  return host;
}

/* ---- nem-09 ---------------------------------------------------------------- */
function collar(shot, ctx) {
  return collarDiagram(shot, ctx, { floorSupportShare: E.cisa.floorSupportShare, ceilingSharingShare: E.cisa.ceilingSharingShare });
}

/* ---- nem-10: who pays ------------------------------------------------------ */
function payment(shot, { values }) {
  return interactive(shot, values, mode => h('div', { class: mode === 3 ? 'nem-future' : '' },
    h('p', { class: `nem-flow${mode === 3 ? ' nem-dashed' : ''}`, 'data-route': ['award', 'energy', 'services', 'toll'][mode] }, W(shot.extra.routes[mode], values)),
    mode === 0 ? readouts([[T.share1, values.securedShare], [T.term, `${values.securedTenor} ${L(T.years)}`]]) : null,
    mode === 0 ? note(shot.labels.after, values) : null));
}

/* ---- nem-11: bought at a price ------------------------------------------- */
function operating(shot, { values }) {
  const r = E.register.nem;
  return interactive(shot, values, mode => {
    if (mode === 0) return h('div', {}, station({ title: W(shot.labels.built, values), future: 1, batteries: 0 }),
      readouts([[T.hold, values.holdReturn], [T.target, values.targetReturn]]), note(shot.labels.built, values));
    if (mode === 1) return h('div', {}, station({ title: W(shot.labels.most, values), batteries: 2 }),
      readouts([[T.ceiling, values.operatingCeiling], [T.capex, values.buildCapex]]), note(shot.labels.most, values));
    return h('div', {}, station({ title: W(shot.labels.queue, values), batteries: 0, future: Math.min(6, r.batteryConstruction) }),
      readouts([[T.register, String(r.batteryAgreements)], [T.operating, r.batteryOperating === 0 ? ['None', '无'] : String(r.batteryOperating)], [T.construction, String(r.batteryConstruction)], [T.development, String(r.batteryDevelopment)], [T.noStage, String(r.batteryNoStage)]]),
      note([`${shot.labels.queue[0]} · ${datePair(E.register.correctAsAt)[0]}`, `${shot.labels.queue[1]} · ${datePair(E.register.correctAsAt)[1]}`]));
  });
}

/* ---- nem-12: what to watch ------------------------------------------------- */
function closing(shot, { values, row }) {
  const trigger = watchedTrigger(row);
  return interactive(shot, values, mode => h('div', {},
    h('ol', { class: 'nem-steps' },
      ...shot.extra.steps.map(step => h('li', { class: 'nem-card nem-future', 'data-step': 'context' }, h('small', {}, L(T.context)), h('br', {}), L(datePair(step.when)), ' · ', W(step.label, values))),
      trigger ? h('li', { class: 'nem-card nem-future nem-watched', 'data-step': 'trigger' }, h('small', {}, L(T.watched)), h('br', {}), L(datePair(trigger.expected)), ' · ', L(trigger.label)) : null),
    station({ title: W(shot.question, values), time: 'dusk', batteries: 2, future: mode === 0 ? 3 : 0 }),
    h('p', { class: 'nem-factor' }, h('strong', {}, W(shot.controls[mode], values)), ' ', W(shot.extra.factors[mode].affects, values)),
    h('p', { class: 'nem-factor' }, W(shot.extra.factors[5].affects, values))));
}

/* Observed layers follow the rights switch in the evidence values. */
export const scenes = makeScenes({ observed: E.rights.mode === 'observed' ? E.qed : null });
