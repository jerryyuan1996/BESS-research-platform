/* ---------------------------------------------------------------------------
   Romania's scenes (WP-07), composed from the shared kit and this market's own
   records. Thirteen shots, thirteen drawings.

   Rules kept here, shot by shot: observations are solid and plans, estimates
   and model paths are dashed; a teaching unit is tagged Example; no drawing
   carries a figure that the content module does not bind; and no control
   writes the market row, a case input, the URL or the investment model. The
   floor is drawn as a bracket with no level and no tenor bar.
   --------------------------------------------------------------------------- */
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { fillPair } from '../../../experience/story/contract.js';
import {
  h, L, s, toggleGroup, fill, parts, scene, note, readout, diagram, text, stateFor, evidence,
  exampleTag, tags,
} from './ui.js';
import { signatureChart } from './chart.js';
import {
  ROMANIA, BULGARIA, HUNGARY, SERBIA, MOLDOVA, SEA, DANUBE, CARPATHIANS, BLACK_SEA_LABEL,
  FRAME,
} from './geo.js';
import { RO_HISTORY, RO_FLEET, RO_PLAN_2030, RO_GRANT_RULES } from '../data/storyEvidence.js';
import { datePair } from '../storyBindings.js';
import { story } from '../story.js';

const GREEN = 'var(--ix-green,#224e40)';
const MUTED = 'var(--ix-muted,#68766c)';
const RISK = 'var(--ix-risk,#9c5b40)';
const INK = 'var(--ix-ink,#193c32)';

/* Labels and controls are filled once here, so a control that names a bound
   duration reads "2 h" and a label that names a date carries it. */
const words = (shot, values) => ({
  title: fillPair(shot.question, values),
  label: (key) => fillPair(shot.labels?.[key] || ['', ''], values),
  control: (i) => fillPair(shot.controls?.[i] || ['', ''], values),
});
const t = (pair, values) => text(pair, values);
const controlRow = (...groups) => h('div', { class: 'k-control-row' }, ...groups);
const fmtMW = (v) => Math.round(v).toLocaleString('en-US');

/* ---- ro-00: the thumbnail beside the card ------------------------------- */

function thumbnail(shot, { values }){
  const w = words(shot, values);
  const svg = diagram(w.title, 220, 130,
    s('path', { d: 'M40,26 L108,12 L164,26 L196,54 L176,86 L120,100 L64,92 L34,66 Z', fill: '#e6e9dc', stroke: INK, 'stroke-width': 1.2 }),
    s('path', { d: 'M52,74 Q92,38 138,52 Q158,70 146,92', fill: 'none', stroke: '#9dae99', 'stroke-width': 1.6 }),
    s('path', { d: 'M34,66 L64,92 L120,100 L176,86', fill: 'none', stroke: '#7b8c9e', 'stroke-width': 2 }));
  svg.setAttribute('aria-hidden', 'true');
  return scene(svg);
}

/* ---- ro-01: one price zone, no capacity payment ------------------------- */

function map(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'zone' });
  const svg = diagram(w.title, FRAME[0], FRAME[1]);
  const draw = () => {
    const zone = state.view === 'zone';
    fill(svg, svg.firstChild,
      s('path', { d: HUNGARY, fill: '#efefe9', stroke: '#c6ceb5' }),
      s('path', { d: SERBIA, fill: '#efefe9', stroke: '#c6ceb5' }),
      s('path', { d: MOLDOVA, fill: '#efefe9', stroke: '#c6ceb5' }),
      s('path', { d: BULGARIA, fill: '#e6e9dc', stroke: INK, 'stroke-width': 1 }),
      s('path', { d: SEA, fill: '#d6dbe7', stroke: '#94a0b6' }),
      s('path', { d: ROMANIA, fill: zone ? '#b8cda4' : '#e6e9dc', stroke: INK, 'stroke-width': zone ? 2 : 1.2 }),
      s('path', { d: CARPATHIANS, fill: 'none', stroke: '#9dae99', 'stroke-width': 2 }),
      s('polyline', { points: DANUBE.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#7b8c9e', 'stroke-width': 2.2 }),
      /* one interconnection symbol per land border, drawn when coupling shows */
      [[150, 66], [232, 44], [424, 104], [444, 222]].map(([x, y], i) => s('g', { 'data-link': i },
        s('circle', { cx: x, cy: y, r: 5, fill: state.view === 'coupled' ? '#e2b84c' : '#fffefa', stroke: INK, 'stroke-width': 1.4 }))),
      s('text', { class: 'k-label', x: 262, y: 168, 'text-anchor': 'middle' }, t(w.label('l01'), values)),
      s('text', { class: 'k-label', x: 356, y: 286, 'text-anchor': 'middle' }, t(w.label('l02'), values)),
      s('text', { class: 'k-label', x: 108, y: 118, 'text-anchor': 'middle' }, t(w.label('l03'), values)),
      s('text', { class: 'k-label', x: 300, y: 214, 'text-anchor': 'middle' }, t(w.label('l04'), values)),
      s('text', { class: 'k-label', x: 268, y: 150, 'text-anchor': 'middle' }, t(w.label('l05'), values)),
      s('text', { class: 'k-label', x: BLACK_SEA_LABEL[0], y: BLACK_SEA_LABEL[1], 'text-anchor': 'middle' }, t(w.label('l06'), values)));
    svg.setAttribute('data-view', state.view);
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.view, options: [
      { value: 'zone', label: w.control(0) }, { value: 'coupled', label: w.control(1) },
    ], onChange: (v) => { state.view = v; save(); draw(); } })),
    svg,
    h('ul', { class: 'k-key' }, ['l07', 'l08', 'l09', 'l10', 'l11', 'l12'].map(key => h('li', {}, t(w.label(key), values)))),
    note(w.label('l13'), values),
    evidence(shot, values));
}

/* ---- ro-02 and ro-03: dated nodes --------------------------------------- */

function historyAt(id){ return RO_HISTORY.find(node => node.id === id); }

function timeline(shot, { values }){
  const w = words(shot, values);
  const nodes = shot.extra.historyNodes;
  const ids = ['H-RO-01', 'H-RO-02', 'H-RO-03'];
  const { state, save } = stateFor(shot.id, { node: 0, view: 'event' });
  const svg = diagram(w.title, FRAME[0], 200);
  const detail = h('div');
  const draw = () => {
    fill(svg, svg.firstChild,
      s('path', { d: ROMANIA, fill: '#e6e9dc', stroke: INK, 'stroke-width': 1.2 }),
      s('polyline', { points: DANUBE.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#7b8c9e', 'stroke-width': 2 }),
      /* three layers: the exchange, the three coupled neighbours, the border */
      s('circle', { cx: 292, cy: 146, r: 7, fill: state.node === 0 ? '#e2b84c' : '#fffefa', stroke: INK, 'stroke-width': 1.6 }),
      [[150, 66], [232, 44], [424, 104]].map(([x, y], i) => s('g', {},
        s('circle', { cx: x, cy: y, r: 6, fill: state.node === 1 ? '#e2b84c' : '#fffefa', stroke: INK, 'stroke-width': 1.4 }),
        s('line', { x1: 292, y1: 146, x2: x, y2: y, stroke: state.node === 1 ? '#e2b84c' : '#c6ceb5', 'stroke-width': state.node === 1 ? 2.4 : 1, 'stroke-dasharray': '5 4' }))),
      s('line', { x1: 292, y1: 190, x2: 356, y2: 258, stroke: state.node === 2 ? '#e2b84c' : '#c6ceb5', 'stroke-width': state.node === 2 ? 3 : 1, 'stroke-dasharray': '5 4' }));
    svg.setAttribute('data-node', String(state.node));
    const record = nodes[state.node];
    const date = historyAt(ids[state.node]);
    fill(detail,
      h('p', { class: 'k-readout' }, L(['Event date: ', '事件日期：']),
        L(date ? date.dates.map(d => datePair(d) || [d, d]).reduce((acc, pair) => [acc[0] + ' · ' + pair[0], acc[1] + ' · ' + pair[1]]) : ['', ''])),
      h('dl', { class: 'k-lane-terms' },
        ...[['constraint', 'choice', 'remains', 'effect']]
          .filter(([field]) => state.view === 'event' ? ['constraint', 'choice', 'remains'].includes(field) : field === 'effect')
          .flatMap(([field]) => [h('dt', {}, footerField(field)), h('dd', {}, t(record[field], values))])));
  };
  const footerField = (field) => L({ constraint: ['Constraint', '约束'], choice: ['Choice', '选择'], remains: ['What remains', '遗留'], effect: ['Why it matters', '投资含义'] }[field]);
  draw();
  return scene(
    controlRow(
      toggleGroup({ label: w.control(0), value: state.node, options: nodes.map((_, i) => ({ value: i, label: [ids[i], ids[i]] })), onChange: (v) => { state.node = v; save(); draw(); } }),
      toggleGroup({ label: w.control(1), value: state.view, options: [{ value: 'event', label: w.control(1) }, { value: 'why', label: w.control(2) }], onChange: (v) => { state.view = v; save(); draw(); } })),
    svg, detail, evidence(shot, values));
}

function rules(shot, { values }){
  const w = words(shot, values);
  const nodes = shot.extra.historyNodes;
  const ids = ['H-RO-04', 'H-RO-05', 'H-RO-06'];
  const { state, save } = stateFor(shot.id, { card: 0 });
  const svg = diagram(w.title, FRAME[0], 220);
  const detail = h('div');
  const draw = () => {
    const x = (i) => 24 + i * 186;
    fill(svg, svg.firstChild,
      nodes.map((_, i) => s('g', { 'data-card': i },
        s('rect', { x: x(i), y: 18, width: 168, height: 112, rx: 8, fill: state.card === i ? '#eef1e5' : '#fffefa', stroke: state.card === i ? GREEN : '#c6ceb5', 'stroke-width': state.card === i ? 2 : 1 }),
        s('text', { class: 'k-label', x: x(i) + 10, y: 40 }, t(w.control(i), values)))),
      /* the grant card's outcome sits beyond a checked boundary */
      s('line', { class: 'k-checked', x1: 24, x2: 576, y1: 168, y2: 168, stroke: RISK, 'stroke-width': 1.6, 'stroke-dasharray': '2 4' }),
      s('text', { class: 'k-label', x: 24, y: 160 }, t(w.label('l06'), values)),
      s('g', { 'data-beyond': 'checked' },
        s('rect', { x: 420, y: 176, width: 156, height: 28, rx: 6, fill: 'none', stroke: MUTED, 'stroke-dasharray': '5 4' }),
        s('text', { class: 'k-label', x: 428, y: 194 }, t(w.label('l05'), values))));
    svg.setAttribute('data-card', String(state.card));
    const record = nodes[state.card];
    fill(detail, h('dl', { class: 'k-lane-terms' },
      ...[['choice'], ['remains'], ['effect']].flatMap(([field]) => [h('dt', {}, L({ choice: ['Choice', '选择'], remains: ['What remains', '遗留'], effect: ['Why it matters', '投资含义'] }[field])), h('dd', {}, t(record[field], values))])));
  };
  draw();
  return scene(toggleGroup({ label: w.title, value: state.card, options: nodes.map((_, i) => ({ value: i, label: w.control(i) })), onChange: (v) => { state.card = v; save(); draw(); } }),
    svg, detail, note(w.label('l05'), values), evidence(shot, values));
}

/* ---- ro-04: the shape of a day, as an Example --------------------------- */

function dayShape(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'midday', spread: false });
  const svg = diagram(w.title, 600, 240);
  const H = 190, BASE = 40, TOP = 24;
  const price = (i) => {
    /* authored geometry, not a price: a midday trough and an evening peak */
    const hour = i / 2;
    const midday = Math.exp(-Math.pow(hour - 13, 2) / 9);
    const evening = Math.exp(-Math.pow(hour - 20, 2) / 5);
    return 0.20 + 0.62 * evening - 0.16 * midday;
  };
  const draw = () => {
    const pts = Array.from({ length: 48 }, (_, i) => {
      const x = BASE + (i / 47) * 520;
      const y = TOP + (1 - price(i)) * (H - TOP - 10);
      return [x, y];
    });
    const d = 'M' + pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
    fill(svg, svg.firstChild,
      s('rect', { x: BASE, y: TOP, width: 520, height: H - TOP - 10, fill: state.view === 'midday' ? '#eef1e5' : '#f6efe2' }),
      s('path', { 'data-price-shape': 'example', d, fill: 'none', stroke: state.view === 'midday' ? GREEN : RISK, 'stroke-width': 2.4 }),
      state.spread ? s('g', { 'data-spread': 'true' },
        s('line', { x1: BASE + 130, x2: 560, y1: pts[26][1], y2: pts[40][1], stroke: MUTED, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }),
        s('text', { class: 'k-label', x: 380, y: 30 }, t(w.label('l04'), values))) : null,
      s('text', { class: 'k-label', x: BASE + 8, y: 20 }, t(w.label('l02'), values)),
      s('text', { class: 'k-label', x: 470, y: 20 }, t(w.label('l03'), values)),
      /* the sources that set each end of the day */
      s('text', { class: 'k-label', x: BASE + 90, y: H - 6 }, t(w.label('l05'), values)),
      s('text', { class: 'k-label', x: 300, y: H - 6 }, t(w.label('l06'), values)),
      s('text', { class: 'k-label', x: 470, y: H - 6 }, t(w.label('l07'), values)));
    svg.setAttribute('data-view', state.view);
    svg.setAttribute('data-spread', String(state.spread));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.view, options: [{ value: 'midday', label: w.control(0) }, { value: 'evening', label: w.control(1) }], onChange: (v) => { state.view = v; save(); draw(); } })),
    h('p', { class: 'k-readout' }, exampleTag(), ' ', L(tags()[1])),
    svg, evidence(shot, values));
}

/* ---- ro-05: the neighbour's fleet behind the border --------------------- */

function border(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'midday' });
  const svg = diagram(w.title, FRAME[0], 240);
  const full = state.view === 'evening';
  const draw = () => {
    const batteries = (x0, count) => Array.from({ length: count }, (_, i) => s('rect', { x: x0 + (i % 4) * 16, y: 120 + Math.floor(i / 4) * 16, width: 10, height: 12, rx: 2, fill: INK, 'fill-opacity': .8 }));
    fill(svg, svg.firstChild,
      s('path', { d: ROMANIA, fill: '#e6e9dc', stroke: INK, 'stroke-width': 1.2 }),
      s('path', { d: BULGARIA, fill: '#dfe4d2', stroke: INK, 'stroke-width': 1.2 }),
      s('polyline', { points: DANUBE.map(p => p.join(',')).join(' '), fill: 'none', stroke: full ? RISK : '#7b8c9e', 'stroke-width': full ? 3.4 : 2 }),
      s('text', { class: 'k-label', x: 300, y: 176, 'text-anchor': 'middle' }, t(w.label('l03'), values)),
      s('text', { class: 'k-label', x: 300, y: 120, 'text-anchor': 'middle' }, t(w.label('l02'), values)),
      s('text', { class: 'k-label', x: 350, y: 282, 'text-anchor': 'middle' }, t(w.label('l01'), values)),
      batteries(300, 8), batteries(120, 3),
      full ? s('text', { class: 'k-label', x: 300, y: 200, 'text-anchor': 'middle' }, t(w.label('l04'), values)) : null);
    svg.setAttribute('data-border', full ? 'full' : 'open');
  };
  draw();
  return scene(toggleGroup({ label: w.title, value: state.view, options: [{ value: 'midday', label: w.control(0) }, { value: 'evening', label: w.control(1) }], onChange: (v) => { state.view = v; save(); draw(); } }),
    svg,
    /* the count is withheld while its reuse gate is open, so the label is a
       name and the dated figure appears only when the record is eligible */
    readout(t(w.label('l01'), values), values.bgFleetEnd2025 ? ' · ' + values.bgFleetEnd2025[0] : ''),
    evidence(shot, values));
}

/* ---- ro-06: the signature chart ---------------------------------------- */

function fleetChartScene(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { layer: 'fleet' });
  const points = RO_FLEET.observations.filter(o => Number.isFinite(o.mw)).map(o => ({ date: o.date, year: Number(o.date.slice(0, 4)), mw: o.mw, precision: o.datePrecision, status: o.status }));
  const estimate = Number.isFinite(RO_FLEET.yearEnd.additionsMW) && Number.isFinite(RO_FLEET.observations.find(o => o.date === '2026-08-01')?.mw)
    ? { year: 2026, mw: RO_FLEET.observations.find(o => o.date === '2026-08-01').mw + RO_FLEET.yearEnd.additionsMW }
    : null;
  const plan = Number.isFinite(RO_PLAN_2030.mw) ? { year: RO_PLAN_2030.year, mw: RO_PLAN_2030.mw } : null;
  const labels = {
    title: w.title, fleet: w.label('l01'), estimate: w.label('l02'), plan: w.label('l03'),
    model: w.label('l04'), example: w.label('l05'),
  };
  const svg = signatureChart({ points, estimate, plan, path: values.valueIndexPath, labels, compact: typeof matchMedia === 'function' && matchMedia('(max-width:560px)').matches });
  const detail = h('div');
  const table = h('table', { class: 'ix-table' },
    h('caption', {}, t(w.label('l01'), values)),
    h('thead', {}, h('tr', {}, [['Date', '日期'], ['MW', 'MW'], ['MWh', 'MWh']].map(x => h('th', { scope: 'col' }, L(x))))),
    h('tbody', {}, RO_FLEET.observations.map(o => h('tr', { 'data-record': o.id },
      h('th', { scope: 'row' }, o.date || L(['start of 2025', '2025年初'])),
      h('td', {}, o.mw == null ? '—' : fmtMW(o.mw)),
      h('td', {}, o.mwh == null ? '—' : fmtMW(o.mwh))))));
  const draw = () => {
    fill(detail, state.layer === 'definitions' ? definitions(w, values) : null);
    detail.setAttribute('data-layer', state.layer);
  };
  draw();
  return scene(
    toggleGroup({ label: w.title, value: state.layer, options: [{ value: 'fleet', label: w.control(0) }, { value: 'definitions', label: w.control(2) }], onChange: (v) => { state.layer = v; save(); draw(); } }),
    svg,
    svg.getAttribute('data-chart-state') === 'example' ? readout(exampleTag(), ' ', t(parts('Chart reading')[0], values)) : null,
    detail,
    h('details', { class: 'ix-details' }, h('summary', {}, L(['Dated points', '带日期的数据点'])), table),
    note(parts('Chart reading')[0], values),
    evidence(shot, values));

  function definitions(w2, vals){
    return h('dl', { class: 'k-lane-terms' },
      h('dt', {}, t(w2.label('l01'), vals)), h('dd', {}, L(['Connected storage, stand-alone and inside hybrid plants; MW is power, MWh energy where published', '已并网储能，含独立与混合电站；MW为功率，MWh为已公布的能源口径'])),
      h('dt', {}, t(w2.label('l02'), vals)), h('dd', {}, L(['The operator\u2019s approximate further additions, not a count', '运营商的近似新增估计，并非统计值'])),
      h('dt', {}, t(w2.label('l03'), vals)), h('dd', {}, L(['A national target, not a forecast and not a connected fleet', '国家目标，既非预测也非已并网规模'])),
      h('dt', {}, t(w2.label('l04'), vals)), h('dd', {}, L(['Basis 100 at the model\u2019s basis year; the level itself is not shown', '模型基准年取100；基期水平不展示'])));
  }
}

/* ---- ro-07: the response ladder ---------------------------------------- */

function ladder(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { rung: 0, many: false });
  const svg = diagram(w.title, FRAME[0], 220);
  const rungs = ['l01', 'l02', 'l03'];
  const draw = () => {
    const reserve = state.many ? 34 : 62;
    fill(svg, svg.firstChild,
      rungs.map((key, i) => s('g', { 'data-rung': i },
        s('line', { x1: 30, x2: 300, y1: 40 + i * 40, y2: 40 + i * 40, stroke: state.rung === i ? GREEN : '#c6ceb5', 'stroke-width': state.rung === i ? 4 : 1.4 }),
        s('text', { class: 'k-label', x: 30, y: 32 + i * 40 }, t(w.label(key), values)))),
      /* the block the operator buys does not grow; the symbols competing for it do */
      s('rect', { 'data-block': 'procured', x: 330, y: 150, width: 150, height: 18, fill: '#eef1e5', stroke: MUTED }),
      s('text', { class: 'k-label', x: 330, y: 142 }, t(w.label('l04'), values)),
      s('rect', { 'data-income': 'model', x: 330, y: 150 - reserve * 1.2, width: 150, height: reserve * 1.2, fill: GREEN, 'fill-opacity': '.22', stroke: GREEN, 'stroke-dasharray': '5 4' }),
      Array.from({ length: state.many ? 9 : 4 }, (_, i) => s('rect', { x: 500 + (i % 3) * 14, y: 120 + Math.floor(i / 3) * 16, width: 9, height: 11, rx: 2, fill: INK, 'fill-opacity': .75 })));
    svg.setAttribute('data-batteries', state.many ? 'more' : 'base');
  };
  draw();
  return scene(
    controlRow(
      toggleGroup({ label: w.title, value: state.rung, options: rungs.map((_, i) => ({ value: i, label: w.control(i) })), onChange: (v) => { state.rung = v; save(); draw(); } }),
      toggleGroup({ label: w.control(3), options: [{ value: 'many', label: w.control(3), pressed: state.many }], multi: true, onChange: (_, pressed) => { state.many = pressed; save(); draw(); } })),
    svg,
    readout(t(w.label('l05'), values), ' · ', exampleTag()),
    evidence(shot, values));
}

/* ---- ro-08: why two hours ---------------------------------------------- */

function station(shot, { values }){
  const w = words(shot, values);
  const hours = [Number(values.playDuration), Number(values.longerMerchantDuration)].filter(Number.isFinite);
  const { state, save } = stateFor(shot.id, { preset: 0 });
  const host = h('div');
  /* The teaching battery is the shared cutaway; the preset adds energy blocks
     and never reaches the case. */
  const draw = () => {
    const blocks = Math.max(1, hours[state.preset] || 2);
    fill(host,
      isoStage({
        title: w.title, sky: false, viewBox: [600, 260], origin: [230, 60],
        items: [
          { symbol: 'ground', at: [0, 0], opts: { w: 15, d: 9 } },
          { symbol: 'battery', at: [1, 3], opts: { count: blocks } },
          { symbol: 'pcs', at: [5, 3] }, { symbol: 'transformer', at: [7, 5] }, { symbol: 'pylon', at: [11, 7] },
        ],
        wires: [[[8, 5.5], [11, 7]]],
      }),
      diagram(w.title, 600, 90,
        s('text', { class: 'k-label', x: 12, y: 20 }, t(w.label('l03'), values)),
        s('rect', { x: 12, y: 30, width: 120 + blocks * 40, height: 16, fill: RISK, 'fill-opacity': '.25', stroke: RISK, 'stroke-dasharray': '5 4' }),
        s('rect', { x: 12, y: 54, width: 150 + blocks * 22, height: 16, fill: GREEN, 'fill-opacity': '.25', stroke: GREEN }),
        s('text', { class: 'k-label', x: 12, y: 86 }, t(w.label('l04'), values))));
    host.setAttribute('data-blocks', String(blocks));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.preset, options: hours.map((_, i) => ({ value: i, label: w.control(i) })), onChange: (v) => { state.preset = v; save(); draw(); } })),
    host,
    readout(exampleTag(), ' ', t(w.label('l05'), values), values.merchantValueBest ? ' · ' + values.merchantValueBest[0] : ''),
    h('a', { class: 'ix-text-link', href: '/markets/romania#route-options' }, L(w.control(2))),
    evidence(shot, values));
}

/* ---- ro-09: who trades it ---------------------------------------------- */

function lanes(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { lane: 0, committed: false });
  const svg = diagram(w.title, FRAME[0], 220);
  const laneNames = ['l01', 'l02', 'l03'];
  const draw = () => {
    fill(svg, svg.firstChild,
      s('rect', { x: 24, y: 20, width: 552, height: 22, fill: '#eef1e5', stroke: MUTED }),
      s('text', { class: 'k-label', x: 28, y: 36 }, t(w.label('l01'), values)),
      s('rect', { x: 24, y: 20, width: state.committed ? 552 * 0.55 : 552 * 0.3, height: 22, fill: RISK, 'fill-opacity': '.3', stroke: RISK }),
      state.committed ? s('text', { class: 'k-label', x: 200, y: 36 }, t(w.label('l02'), values)) : null,
      laneNames.map((key, i) => s('g', { 'data-lane': i },
        s('rect', { x: 24 + i * 186, y: 64, width: 168, height: 74, rx: 8, fill: state.lane === i ? '#eef1e5' : '#fffefa', stroke: state.lane === i ? GREEN : '#c6ceb5', 'stroke-width': state.lane === i ? 2 : 1 }),
        s('text', { class: 'k-label', x: 34 + i * 186, y: 86 }, t(w.label(key), values)),
        s('line', { x1: 34 + i * 186, x2: 174 + i * 186, y1: 112, y2: 112, stroke: '#c6ceb5' }))),
      s('text', { class: 'k-label', x: 24, y: 168 }, t(w.label('l03'), values)));
    svg.setAttribute('data-committed', String(state.committed));
  };
  draw();
  return scene(
    controlRow(
      toggleGroup({ label: w.title, value: state.lane, options: laneNames.map((_, i) => ({ value: i, label: w.control(i) })), onChange: (v) => { state.lane = v; save(); draw(); } }),
      toggleGroup({ label: w.control(3), options: [{ value: 'fee', label: w.control(3), pressed: state.committed }], multi: true, onChange: (_, pressed) => { state.committed = pressed; save(); draw(); } })),
    svg, note(w.label('l04'), values), evidence(shot, values));
}

/* ---- ro-10: who pays --------------------------------------------------- */

function payers(shot, { values }){
  const w = words(shot, values);
  const routes = shot.extra.routes;
  const { state, save } = stateFor(shot.id, { route: 0 });
  const panel = h('div');
  const draw = () => {
    const route = routes[state.route];
    const grant = route.id === 'grant';
    fill(panel,
      /* the route sentence already names payer, unit, obligation and evidence */
      h('p', { class: 'k-readout', 'data-route': route.id }, t(route.text, values)),
      grant ? h('dl', { class: 'k-lane-terms' },
        h('dt', {}, t(w.label('l07'), values)), h('dd', {}, values.grantNote ? values.grantNote[0] : '—'),
        h('dt', {}, t(w.label('l08'), values)), h('dd', {}, t(w.label('l05'), values))) : null);
    panel.setAttribute('data-route', route.id);
  };
  draw();
  return scene(
    toggleGroup({ label: w.title, value: state.route, options: routes.map((r, i) => ({ value: i, label: w.control(i) })), onChange: (v) => { state.route = v; save(); draw(); } }),
    panel,
    readout(t(w.label('l06'), values), ' · ', t(w.label('l05'), values)),
    evidence(shot, values));
}

/* ---- ro-11: the floor comes first -------------------------------------- */

function floor(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'merchant' });
  const svg = diagram(w.title, FRAME[0], 220);
  const checklist = ['l04', 'l05', 'l06', 'l07', 'l08', 'l09', 'l10'];
  const draw = () => {
    fill(svg, svg.firstChild,
      /* a band that stays merchant throughout: no level, no shading, no tenor */
      s('rect', { 'data-band': 'merchant', x: 40, y: 40, width: 520, height: 96, fill: GREEN, 'fill-opacity': '.1', stroke: GREEN }),
      s('text', { class: 'k-label', x: 48, y: 32 }, t(w.label('l01'), values)),
      s('path', { 'data-floor': 'bracket', d: 'M40,152 h150 m-150,-8 v16 m150,-16 v8', fill: 'none', stroke: RISK, 'stroke-width': 2, 'stroke-dasharray': '6 4' }),
      s('text', { class: 'k-label', x: 200, y: 158 }, t(w.label('l02'), values)));
    svg.setAttribute('data-view', state.view);
  };
  draw();
  const list = h('ul', { class: 'k-key' }, checklist.map(key => h('li', {}, t(w.label(key), values))));
  return scene(
    toggleGroup({ label: w.title, value: state.view, options: [{ value: 'merchant', label: w.control(0) }, { value: 'checklist', label: w.control(1) }], onChange: (v) => { state.view = v; save(); draw(); list.hidden = v !== 'checklist'; } }),
    svg,
    readout(t(w.label('l03'), values)),
    list,
    evidence(shot, values));
}

/* ---- ro-12: what could weaken it -------------------------------------- */

function factors(shot, { values }){
  const w = words(shot, values);
  const svg = diagram(w.title, FRAME[0], 150);
  fill(svg, svg.firstChild,
    s('line', { x1: 30, x2: 570, y1: 96, y2: 96, stroke: MUTED, 'stroke-width': 1.2 }),
    s('line', { x1: 330, x2: 570, y1: 96, y2: 96, stroke: MUTED, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }),
    s('line', { x1: 330, x2: 330, y1: 40, y2: 130, stroke: RISK, 'stroke-width': 1.6, 'stroke-dasharray': '2 4' }),
    s('text', { class: 'k-label', x: 330, y: 34, 'text-anchor': 'middle' }, t(parts('History legend')[3], values)),
    s('circle', { cx: 90, cy: 96, r: 5, fill: GREEN }),
    s('circle', { cx: 210, cy: 96, r: 5, fill: GREEN }),
    s('rect', { x: 380, y: 88, width: 40, height: 16, rx: 4, fill: 'none', stroke: MUTED, 'stroke-dasharray': '4 3' }),
    s('rect', { x: 440, y: 88, width: 40, height: 16, rx: 4, fill: 'none', stroke: MUTED, 'stroke-dasharray': '4 3' }),
    s('rect', { x: 500, y: 88, width: 56, height: 16, rx: 4, fill: 'none', stroke: MUTED, 'stroke-dasharray': '4 3' }),
    s('text', { class: 'k-label', x: 30, y: 140 }, values.nextTrigger ? values.nextTrigger[0] : ''));
  return scene(svg, evidence(shot, values));
}

export const scenes = {
  'ro-thumbnail': thumbnail,
  'ro-map': map,
  'ro-timeline': timeline,
  'ro-rules': rules,
  'ro-day-shape': dayShape,
  'ro-border': border,
  'ro-fleet-chart': fleetChartScene,
  'ro-ladder': ladder,
  'ro-station': station,
  'ro-lanes': lanes,
  'ro-payers': payers,
  'ro-floor': floor,
  'ro-factors': factors,
};
