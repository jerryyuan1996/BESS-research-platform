/* Chart-NEM-SPREAD (nem-06), Chart-NEM-DAY (nem-05) and the nem-09 collar.
   Each chart takes `observed`: the AEMO records, or null. While the rights
   switch is off (NEM_STORY_VALUES.rights.mode 'example') the pack passes null
   and every chart draws its unscaled Example: the same shapes, no numeric
   axis, no value. No forecast, no model line and no award floor is ever drawn
   on a $/MWh axis. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { s, n2 } from '../../../experience/story/kit/svg.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { fillPair } from '../../../experience/story/contract.js';

/* replaceChildren prints null as text; skip empty slots. */
const fill = (el, ...kids) => el.replaceChildren(...kids.flat().filter(k => k != null && k !== false));
const T = {
  example: ['Example · unscaled; the observed layer waits for the price-data review', '示例 · 不设数值刻度；实测图层待价格数据权限审核'],
  observed: ['Observed (AEMO)', '实测（AEMO）'],
  withheld: ['Values withheld until the price-data review', '数值在价格数据权限审核前暂不显示'],
  table: ['Chart values', '图表数值'],
  quarter: ['Quarter', '季度'],
  midday: ['Daylight charging hours (10:00–16:00)', '白天充电时段（10:00–16:00）'],
  evening: ['Evening peak (16:00–21:00)', '傍晚高峰（16:00–21:00）'],
  noAward: ['No award', '无中标合同'],
};
const quarterLabel = q => { const [y, n] = q.split('-Q'); return [`${['Mar','Jun','Sep','Dec'][n-1]} qtr ${y}`, `${y}年第${['一','二','三','四'][n-1]}季度`]; };
const path = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${n2(x)},${n2(y)}`).join(' ');
const words = (pair, values) => L(fillPair(pair, values));
const label = (x, y, text, attrs = {}) => s('text', { x, y, class: 'nem-chart-label', ...attrs }, text);

/* Example shapes: generic, not derived from any record. */
const EX_SPREAD = [100, 86, 76, 72, 60, 52, 46, 34, 32];
const EX_OUTPUT = [10, 13, 18, 26, 36, 48, 60, 76, 100];
const EX_WEM_SPREAD = [70, 78, 52, 40, 44, 34, 20, 8, 10];
const EX_WEM_OUTPUT = [8, 18, 20, 28, 40, 52, 70, 66, 80];

/* ---- Chart-NEM-SPREAD ------------------------------------------------------ */
export function spreadChart(shot, { values }, { quarters, observed = null }) {
  const n = quarters.length, X = i => 78 + i * (520 / (n - 1));
  let focus = 0, wa = false;
  const host = h('div', { class: 'k-scene nem-chart', 'data-chart': 'Chart-NEM-SPREAD', 'data-mode': observed ? 'observed' : 'example' });
  const drawing = h('div', { class: 'nem-chart-frame' }), notes = h('div', {});
  const paint = () => {
    host.setAttribute('data-wa', String(wa));
    const svg = s('svg', { viewBox: '0 0 640 430', role: 'img', 'aria-label': words(shot.question, values) });
    const panel = (top, height, key, nem, wem, kind) => {
      const g = s('g', { 'data-panel': key, class: focus === (key === 'spread' ? 0 : 1) ? 'nem-panel nem-focus' : 'nem-panel' });
      g.append(s('text', { x: 20, y: top - 12, class: 'nem-chart-title' }, words(shot.labels[key === 'spread' ? 'spread' : 'discharge'], values)));
      const all = [...nem, ...(wa ? wem : [])].filter(Number.isFinite);
      const lo = Math.min(0, ...all), hi = Math.max(...all) || 1, Y = v => top + height - (v - lo) / (hi - lo) * height;
      g.append(s('line', { x1: 40, x2: 620, y1: Y(0), y2: Y(0), class: 'nem-axis' }));
      if (observed) for (const t of [0, hi / 2, hi].map(v => Math.round(v / 50) * 50)) {
        g.append(s('line', { x1: 40, x2: 620, y1: Y(t), y2: Y(t), class: 'nem-grid' }), label(36, Y(t) + 4, key === 'spread' ? `$${t}` : `${t}`, { 'text-anchor': 'end' }));
      }
      if (kind === 'bars') nem.forEach((v, i) => g.append(s('rect', { x: X(i) - 16, width: 32, y: Math.min(Y(v), Y(0)), height: Math.abs(Y(0) - Y(v)), class: observed ? 'nem-bar' : 'nem-bar nem-example', 'data-kind': observed ? 'observed' : 'example' })));
      else g.append(s('path', { d: path(nem.map((v, i) => [X(i), Y(v)])), class: observed ? 'nem-line' : 'nem-line nem-example', 'data-kind': observed ? 'observed' : 'example' }));
      if (wa) g.append(s('path', { d: path(wem.map((v, i) => [X(i), Y(v)])), class: 'nem-line nem-wem', 'data-kind': 'wem', 'data-layer': 'wa' }));
      return g;
    };
    const spreadNem = observed ? observed.nemSpreadAUDPerMWh : EX_SPREAD, spreadWem = observed ? observed.wemSpreadAUDPerMWh : EX_WEM_SPREAD;
    const outNem = observed ? observed.nemDischargeMW : EX_OUTPUT, outWem = observed ? observed.wemDischargeMW : EX_WEM_OUTPUT;
    svg.append(panel(40, 140, 'spread', spreadNem, spreadWem, 'bars'), panel(240, 120, 'discharge', outNem, outWem, 'line'));
    quarters.forEach((q, i) => svg.append(label(X(i), 392, L(quarterLabel(q)), { 'text-anchor': 'middle', class: 'nem-chart-label nem-tick' })));
    svg.append(label(20, 420, L(observed ? T.observed : T.example), { class: 'nem-chart-label nem-tag' }));
    fill(drawing, svg);
    fill(notes, 
      wa ? h('p', { class: 'nem-note', 'data-layer': 'wa' }, words(shot.labels.wem, values), ' · ', words(shot.labels.waPays, values), ' · ', words(shot.labels.nemPays, values)) : null,
      observed ? h('details', { class: 'nem-table' }, h('summary', {}, L(T.table)), h('table', {},
        h('thead', {}, h('tr', {}, [T.quarter, shot.labels.spread, shot.labels.discharge].map(p => h('th', { scope: 'col' }, words(p, values))))),
        h('tbody', {}, quarters.map((q, i) => h('tr', {}, h('th', { scope: 'row' }, L(quarterLabel(q))),
          h('td', {}, `$${Math.round(observed.nemSpreadAUDPerMWh[i])}`), h('td', {}, `${Math.round(observed.nemDischargeMW[i])}`))))))
        : h('p', { class: 'nem-note' }, L(T.withheld)));
  };
  host.append(
    toggleGroup({ label: fillPair(shot.question, values), value: focus, options: shot.controls.slice(0, 2).map((p, value) => ({ value, label: fillPair(p, values) })), onChange: v => { focus = v; paint(); } }),
    toggleGroup({ label: shot.controls[2], multi: true, options: [{ value: 'wa', label: fillPair(shot.controls[2], values), pressed: false }], onChange: (_, pressed) => { wa = pressed; paint(); } }),
    drawing, notes);
  paint();
  return host;
}

/* ---- Chart-NEM-DAY --------------------------------------------------------- */
/* Example day shapes by hour (25 points, 00:00 to 24:00): a year earlier with
   a deep midday trough and a tall evening peak; the latest flatter. */
const EX_DAY_BEFORE = [60, 58, 56, 55, 55, 57, 64, 74, 66, 46, 32, 24, 20, 20, 24, 34, 60, 92, 100, 94, 80, 72, 66, 62, 60];
const EX_DAY_LATEST = [50, 49, 48, 47, 47, 48, 52, 58, 54, 42, 32, 26, 24, 24, 26, 32, 46, 60, 64, 62, 58, 54, 52, 50, 50];

export function dayChart(shot, { values }, { observed = null } = {}) {
  let mode = 0, before = false;
  const host = h('div', { class: 'k-scene nem-chart', 'data-chart': 'Chart-NEM-DAY', 'data-mode': observed ? 'observed' : 'example' });
  const drawing = h('div', { class: 'nem-chart-frame' });
  const paint = () => {
    const latest = observed ? observed.q3_2026 : EX_DAY_LATEST, prior = observed ? observed.q3_2025 : EX_DAY_BEFORE;
    const X = i => 50 + i * (570 / (latest.length - 1)), hourX = hr => 50 + hr / 24 * 570;
    const all = [...latest, ...(before ? prior : [])], hi = Math.max(...all), Y = v => 210 - v / hi * 170;
    const svg = s('svg', { viewBox: '0 0 640 260', role: 'img', 'aria-label': words(shot.labels.title, values) });
    svg.append(s('rect', { x: hourX(10), width: hourX(16) - hourX(10), y: 30, height: 180, class: mode === 0 ? 'nem-band nem-on' : 'nem-band' }),
      s('rect', { x: hourX(16), width: hourX(21) - hourX(16), y: 30, height: 180, class: mode === 1 ? 'nem-band nem-on' : 'nem-band' }),
      s('line', { x1: 50, x2: 620, y1: 210, y2: 210, class: 'nem-axis' }),
      label(20, 20, words(shot.labels.title, values) + (observed ? ` · ${words(shot.labels.unit, values)}` : ''), { class: 'nem-chart-title' }));
    if (observed) for (const t of [0, 100, 200].filter(t => t <= hi)) svg.append(s('line', { x1: 50, x2: 620, y1: Y(t), y2: Y(t), class: 'nem-grid' }), label(46, Y(t) + 4, `$${t}`, { 'text-anchor': 'end' }));
    for (const hr of [0, 6, 12, 18, 24]) svg.append(label(hourX(hr), 228, `${String(hr).padStart(2, '0')}:00`, { 'text-anchor': 'middle', class: 'nem-chart-label nem-tick' }));
    if (before) svg.append(s('path', { d: path(prior.map((v, i) => [X(i), Y(v)])), class: observed ? 'nem-line nem-prior' : 'nem-line nem-prior nem-example', 'data-kind': observed ? 'observed' : 'example', 'data-series': 'year-before' }));
    svg.append(s('path', { d: path(latest.map((v, i) => [X(i), Y(v)])), class: observed ? 'nem-line' : 'nem-line nem-example', 'data-kind': observed ? 'observed' : 'example', 'data-series': 'latest' }));
    svg.append(label(hourX(13), 46, words(shot.labels.charging, values), { 'text-anchor': 'middle' }), label(hourX(18.5), 46, words(shot.labels.discharging, values), { 'text-anchor': 'middle' }),
      label(20, 250, L(observed ? T.observed : T.example), { class: 'nem-chart-label nem-tag' }));
    fill(drawing, svg,
      h('p', { class: 'nem-legend' }, h('span', { class: 'nem-key nem-key-latest' }), words(shot.labels.latest, values),
        before ? [' ', h('span', { class: 'nem-key nem-key-prior' }), words(shot.labels.yearBefore, values)] : null),
      h('p', { class: 'nem-note' }, L(mode === 0 ? T.midday : T.evening)));
  };
  host.append(
    toggleGroup({ label: fillPair(shot.question, values), value: mode, options: shot.controls.slice(0, 2).map((p, value) => ({ value, label: fillPair(p, values) })), onChange: v => { mode = v; paint(); } }),
    toggleGroup({ label: shot.controls[2], multi: true, options: [{ value: 'before', label: fillPair(shot.controls[2], values), pressed: false }], onChange: (_, pressed) => { before = pressed; paint(); } }),
    drawing);
  paint();
  return host;
}

/* ---- nem-09 collar ---------------------------------------------------------
   Unscaled teaching diagram. Only the two published percentages bind the
   slopes; floor, ceiling and the payment cap are Example positions. */
export function collarDiagram(shot, { values }, { floorSupportShare, ceilingSharingShare }) {
  const F = 30, C = 65, M = 100;
  const owner = x => x < F ? floorSupportShare * F + (1 - floorSupportShare) * x : x <= C ? x : C + (1 - ceilingSharingShare) * (x - C);
  const P = (x, y) => [70 + x * 5.2, 280 - y * 2.4];
  let mode = 0;
  const host = h('div', { class: 'k-scene nem-chart', 'data-chart': 'nem-collar' });
  const drawing = h('div', {});
  const paint = () => {
    const svg = s('svg', { viewBox: '0 0 640 320', role: 'img', 'aria-label': words(shot.question, values) });
    svg.append(
      s('path', { d: `M${P(0, 0)} L${P(M, 0)} M${P(0, 0)} L${P(0, M)}`, class: 'nem-axis' }),
      label(P(M, 0)[0], 300, words(shot.labels.market, values), { 'text-anchor': 'end' }),
      label(20, 26, words(shot.labels.owner, values)),
      s('rect', { x: P(8, 0)[0], y: 40, width: P(24, 0)[0] - P(8, 0)[0], height: 240, class: 'nem-band' }),
      label(P(8, 0)[0], 290, words(shot.labels.band, values), { class: 'nem-chart-label nem-small' }),
      s('path', { d: path([P(0, 0), P(M, M)]), class: mode === 0 ? 'nem-line' : 'nem-line nem-ghost', 'data-kind': 'no-award' }),
      label(P(84, 92)[0], P(84, 92)[1], L(T.noAward), { class: 'nem-chart-label nem-small' }));
    if (mode > 0) {
      const pts = [0, F, C, M].map(x => P(x, owner(x)));
      svg.append(s('path', { d: path(pts), class: 'nem-collar', 'data-kind': 'award' }),
        s('line', { x1: P(F, 0)[0], x2: P(F, 0)[0], y1: 40, y2: 280, class: 'nem-grid nem-dash' }), label(P(F, 0)[0] + 4, 56, words(shot.labels.floor, values), { class: 'nem-chart-label nem-small' }),
        s('line', { x1: P(C, 0)[0], x2: P(C, 0)[0], y1: 40, y2: 280, class: 'nem-grid nem-dash' }), label(P(C, 0)[0] + 4, 56, words(shot.labels.ceiling, values), { class: 'nem-chart-label nem-small' }));
    }
    if (mode === 2 || mode === 3) {
      const x = mode === 2 ? 16 : 90, from = P(x, x), to = P(x, owner(x));
      svg.append(s('circle', { cx: from[0], cy: from[1], r: 5, class: 'nem-point' }), s('line', { x1: from[0], y1: from[1], x2: to[0], y2: to[1], class: 'nem-arrow', 'data-kind': mode === 2 ? 'top-up' : 'paid-back' }),
        s('circle', { cx: to[0], cy: to[1], r: 5, class: 'nem-point nem-owner' }),
        label(to[0] + 8, (from[1] + to[1]) / 2, words(mode === 2 ? shot.labels.topUp : shot.labels.paidBack, values)),
        s('path', { d: `M${to[0] - 9},${to[1] - (mode === 2 ? 12 : -12)} h18`, class: 'nem-cap', 'data-kind': 'payment-cap' }),
        label(to[0] + 12, to[1] - (mode === 2 ? 14 : -22), words(shot.labels.cap, values), { class: 'nem-chart-label nem-small' }));
    }
    svg.append(label(20, 314, words(shot.labels.example, values), { class: 'nem-chart-label nem-tag' }));
    fill(drawing, svg);
  };
  host.append(toggleGroup({ label: fillPair(shot.question, values), value: mode, options: shot.controls.map((p, value) => ({ value, label: fillPair(p, values) })), onChange: v => { mode = v; paint(); } }), drawing);
  paint();
  return host;
}
export { quarterLabel };
