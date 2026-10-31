/* ---------------------------------------------------------------------------
   Western Australia — the story's scenes (immersive-experience plan, WP-07).

   One builder per shot, keyed by the shot's `scene` id. Each returns a block
   that answers its shot's question before any control is touched; the
   controls change only this block's teaching state and never the case.
   Words come from the shot's own labels, so both languages and every bound
   figure follow the content. Values tagged Example (a 100 MW teaching unit,
   a fade step, service sizes) are teaching numbers, never the model's.

   Precision: generic symbols and schematic flows; the map is approximate and
   says so; the two charts are observed data (CALC-WA-DAY) against AEMO's
   printed window.
   --------------------------------------------------------------------------- */
import { L } from '../../../app/i18n.js';
import { h } from '../../../utils/dom.js';
import { fillPair } from '../../../experience/story/contract.js';
import { isoStage } from '../../../experience/story/kit/symbols.js';
import { dayChart, intervalIndex } from '../../../experience/story/kit/chart.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { s, n2, uid } from '../../../experience/story/kit/svg.js';
import { whenLabel } from '../../../experience/story/shell.js';
import { WA_STORY_DAY, WA_OBLIGATION_WINDOW } from '../data/storyDay.js';
import { WA_ISLAND_MAP } from './geo.js';

const UNIT_MW = 100;          // the teaching battery (Example)
const FADE = 0.10;            // the teaching fade step (Example)
const SERVICES_MW = 30;       // illustrative services commitment (Example)
const TRADING_MW = 70;        // illustrative midday trading (Example)

const narrow = () => typeof matchMedia === 'function' && matchMedia('(max-width: 560px)').matches;
const num = (v) => { const x = Number(v); return Number.isFinite(x) ? x : null; };
const hhmm = (i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;

/* The shot's words, filled with its bound values. */
function words(shot, values){
  return {
    label: (key) => fillPair(shot.labels?.[key] || ['', ''], values),
    control: (i) => fillPair(shot.controls?.[i] || ['', ''], values),
    title: fillPair(shot.question, values),
  };
}

/* A 2D diagram: an SVG named by its shot's question. */
function diagram(viewBox, title, cls, ...kids){
  const id = uid('k-dg');
  return s('svg', { class: `k-stage k-diagram ${cls}`, viewBox: `0 0 ${viewBox[0]} ${viewBox[1]}`, role: 'img', 'aria-labelledby': id, preserveAspectRatio: 'xMidYMid meet' },
    s('title', { id }, L(title)), ...kids);
}
const label = (x, y, pair, attrs = {}) => s('text', { class: 'k-label', x: n2(x), y: n2(y), ...attrs }, L(pair));
const scene = (...kids) => h('div', { class: 'k-scene' }, ...kids);
/* Replace a node's children; nested lists are flattened, empty slots skipped. */
const fill = (node, ...kids) => node.replaceChildren(...kids.flat(Infinity).filter(k => k !== null && k !== undefined && k !== false));

/* One town for the grid scenes (wa-02, wa-03, wa-14), laid out left to right:
   power station, transmission, substation, homes. World units; schematic. */
const TOWN = {
  view: { viewBox: [660, 340], origin: [340, 34] },
  ground: { symbol: 'ground', at: [0, 0], opts: { w: 18, d: 14 } },
  plant: [1, 11.5],
  pylons: [[5, 9.6], [8, 7.6]],
  wires: [[[3.2, 11.4], [5, 9.6]], [[5, 9.6], [8, 7.6]], [[8, 7.6], [10.6, 6.2]]],
  substation: [10, 4.6],
  homes: [[14.4, 5.6], [16.2, 4.4], [12.8, 7.6]],
  city: [14, 1.2],
  wind: [[3.4, 3], [5.8, 1.6]],
  battery: [8.4, 10.4],
  planned: [[12.6, 10.4], [15.4, 8.2]],
};

/* ---- wa-01: an island grid ------------------------------------------------- */
function islandMap(shot, { values }){
  const w = words(shot, values), M = WA_ISLAND_MAP, A = M.anchors, T = M.towns;
  const mid = [(T.perth[0] + A.adelaide[0]) / 2, (T.perth[1] + A.adelaide[1]) / 2];
  const svg = diagram(M.viewBox, w.title, 'k-map',
    s('path', { class: 'k-map-nt', d: M.nt }),
    s('path', { class: 'k-map-nem', d: M.nem }),
    s('path', { class: 'k-map-wa', d: M.wa }),
    s('path', { class: 'k-map-swis', d: M.swis }),
    s('path', { class: 'k-link-missing', d: `M${T.perth[0]},${T.perth[1]} L${A.adelaide[0]},${A.adelaide[1]}` }),
    s('path', { class: 'k-break', d: `M${n2(mid[0] - 7)},${n2(mid[1] - 7)} L${n2(mid[0] + 7)},${n2(mid[1] + 7)} M${n2(mid[0] + 7)},${n2(mid[1] - 7)} L${n2(mid[0] - 7)},${n2(mid[1] + 7)}` }),
    s('circle', { class: 'k-label-dot', cx: T.perth[0], cy: T.perth[1], r: 3.5 }),
    label(mid[0], mid[1] - 14, w.label('noLink'), { 'text-anchor': 'middle' }),
    label(T.perth[0] + 8, T.perth[1] + 4, w.label('perth'), { class: 'k-label k-halo' }),   // outlined: it sits on the dark SWIS fill
    label(A.swisLabel[0], A.swisLabel[1] + 30, w.label('swis'), { class: 'k-label k-map-swis-label' }),
    label(A.wa[0], A.wa[1], w.label('state'), { 'text-anchor': 'middle', class: 'k-label k-map-state-label' }),
    label(A.nem[0], A.nem[1], w.label('nem'), { 'text-anchor': 'middle' }),
    label(A.nt[0], A.nt[1], w.label('neither'), { 'text-anchor': 'middle', class: 'k-label k-muted' }));
  svg.setAttribute('data-view', 'system');
  const controls = toggleGroup({ label: w.title, value: 'system',
    options: [{ value: 'system', label: w.control(0) }, { value: 'state', label: w.control(1) }],
    onChange: (v) => svg.setAttribute('data-view', v) });
  return scene(controls, svg);
}

/* ---- wa-02: built for one-way supply --------------------------------------- */
function oneWayGrid(shot, { values }){
  const w = words(shot, values);
  const draw = (solar) => isoStage({
    ...TOWN.view, title: w.title,
    items: [
      TOWN.ground,
      { symbol: 'plant', at: TOWN.plant },
      ...TOWN.pylons.map(at => ({ symbol: 'pylon', at })),
      { symbol: 'substation', at: TOWN.substation },
      ...TOWN.homes.map(at => ({ symbol: solar ? 'homeSolar' : 'home', at })),
      { symbol: 'industry', at: [11.8, 0.6] },
      { symbol: 'flow', at: [3.6, 11], opts: { to: [9.8, 7], z: 4.2, count: 3 } },
      { symbol: 'flow', at: [12.4, 6.6], opts: { to: [15, 6.2], z: 0.3, count: 2, reverse: solar } },
    ],
    wires: TOWN.wires,
    labels: [
      { at: [TOWN.plant[0], TOWN.plant[1] + 3, 2.6], text: w.label('plant'), anchor: 'end', dx: -8, dy: 0 },
      { at: [8, 7.6, 5], text: w.label('wires') },
      { at: [16.2, 6.4, 1.6], text: w.label('homes'), dx: 8, dy: 6 },
    ],
  });
  const holder = h('div', {}, draw(false));
  const controls = toggleGroup({ label: w.title, value: 'earlier',
    options: [{ value: 'earlier', label: w.control(0) }, { value: 'solar', label: w.control(1) }],
    onChange: (v) => fill(holder, draw(v === 'solar')) });
  return scene(controls, holder, h('p', { class: 'k-readout' }, '› ', L(w.label('flow'))));
}

/* ---- wa-03: the choice that shapes the market ----------------------------- */
function timeline(shot, { values }){
  const w = words(shot, values);
  const nodes = shot.extra?.timeline || [];
  const draw = (k) => {
    const items = [
      TOWN.ground,
      { symbol: 'plant', at: TOWN.plant, opts: { future: k >= 4 } },
      ...TOWN.pylons.map(at => ({ symbol: 'pylon', at })),
      { symbol: 'substation', at: TOWN.substation },
      { symbol: 'city', at: TOWN.city },
      ...TOWN.homes.map(at => ({ symbol: k >= 1 ? 'homeSolar' : 'home', at })),
    ];
    const labels = [{ at: [TOWN.plant[0], TOWN.plant[1] + 3, 2.6], text: w.label('coal'), anchor: 'end', dx: -8, dy: 0, future: k >= 4 }];
    if (k >= 1){
      items.push(...TOWN.wind.map(at => ({ symbol: 'wind', at })));
      labels.push({ at: [TOWN.wind[1][0], TOWN.wind[1][1], 7], text: w.label('wind') });
    }
    if (k >= 2){
      items.push({ symbol: 'battery', at: TOWN.battery, opts: { count: k >= 3 ? 4 : 2, highlight: k === 3 } });
      labels.push({ at: [TOWN.battery[0], TOWN.battery[1] + 1, 1.1], text: w.label('storage'), anchor: 'end', dx: -8 });
    }
    if (k >= 4){
      items.push(...TOWN.planned.map(at => ({ symbol: 'battery', at, opts: { count: 2, future: true } })));
      labels.push({ at: [TOWN.planned[1][0] + 2.6, TOWN.planned[1][1], 1.1], text: w.label('planned'), future: true });
    }
    return isoStage({ ...TOWN.view, title: w.title, items, wires: TOWN.wires, labels });
  };
  const holder = h('div', {}, draw(0));
  const controls = toggleGroup({ label: w.label('pick'), value: 0,
    options: nodes.map((node, k) => ({ value: k, label: whenLabel(node.when) })),
    onChange: (k) => fill(holder, draw(k)) });
  return scene(controls, holder);
}

/* ---- wa-04: owning a battery is not being paid ----------------------------- */
function ruleOverlay(shot, { values }){
  const w = words(shot, values);
  const stage = isoStage({
    viewBox: [560, 270], origin: [140, 66], title: w.title, sky: false,
    items: [
      { symbol: 'pad', at: [0, 0], opts: { w: 9, d: 6 } },
      { symbol: 'battery', at: [1, 0.8], opts: { count: 3 } },
      { symbol: 'pcs', at: [5.2, 1.2] }, { symbol: 'pcs', at: [5.2, 2.8] },
      { symbol: 'transformer', at: [6.8, 3.6] },
      { symbol: 'pylon', at: [10.5, 6] },
    ],
    wires: [[[7.4, 4], [10.5, 6]]],
    labels: [{ at: [1, 4.6, 1.1], text: w.label('battery'), anchor: 'end', dx: -8 }],
  });
  const steps = ['certified', 'credited', 'obligated'].map((k, i) => s('g', { class: 'k-step', transform: `translate(350,${22 + i * 82})` },
    s('rect', { x: 0, y: 0, width: 196, height: 54, rx: 6 }),
    s('text', { class: 'k-step-no', x: 16, y: 34 }, String(i + 1)),
    s('text', { class: 'k-label', x: 42, y: 33 }, L(w.label(k))),
    i < 2 ? s('path', { class: 'k-step-arrow', d: 'M98,56 L98,80 M92,74 L98,80 L104,74' }) : null));
  stage.append(s('g', { class: 'k-rules' }, steps));
  stage.setAttribute('data-view', 'physical');
  const controls = toggleGroup({ label: w.title, value: 'physical',
    options: [{ value: 'physical', label: w.control(0) }, { value: 'rules', label: w.control(1) }],
    onChange: (v) => stage.setAttribute('data-view', v) });
  return scene(controls, stage);
}

/* ---- wa-05: midday ----------------------------------------------------------- */
function middayChart(shot, { values }){
  const w = words(shot, values);
  const total = WA_STORY_DAY.gridMW.map((g, i) => g + WA_STORY_DAY.rooftopMW[i]);
  const draw = (focus) => dayChart({
    title: w.title, desc: fillPair(shot.caption, values), compact: narrow(), yLabel: ['MW', 'MW'],
    series: [
      { key: 'grid', values: WA_STORY_DAY.gridMW, kind: 'area', label: w.label('grid'), className: 'k-s-grid' },
      { key: 'roof', values: WA_STORY_DAY.rooftopMW, kind: 'area', stackOn: 'grid', label: w.label('rooftop'), className: 'k-s-roof' },
      { key: 'total', values: total, kind: 'line', label: w.label('total'), className: 'k-s-line' },
    ],
    highlight: focus ? { first: '10:00', last: '13:30' } : null,
  });
  const holder = h('div', {}, draw(true));
  const controls = toggleGroup({ label: w.title, multi: true,
    options: [{ value: 'midday', label: w.control(0), pressed: true }],
    onChange: (_, pressed) => fill(holder, draw(pressed)) });
  return scene(controls, holder);
}

/* ---- wa-06: the long evening (the signature chart) ------------------------ */
function eveningChart(shot, { values }){
  const w = words(shot, values);
  const req = num(values.durationRequirement);
  const g = WA_STORY_DAY.gridMW;
  // the four-hour battery delivers over the eight highest intervals of the day
  const top8 = g.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 8).map(p => p[1]);
  const [peakFirst, peakLast] = [hhmm(Math.min(...top8)), hhmm(Math.max(...top8))];
  const win = { first: WA_OBLIGATION_WINDOW.firstInterval, last: WA_OBLIGATION_WINDOW.lastInterval };
  const state = { focus: 'evening', window: true };
  const draw = () => dayChart({
    title: w.title, desc: fillPair(shot.caption, values), compact: narrow(), yLabel: ['MW', 'MW'],
    series: [{ key: 'grid', values: g, kind: 'area', label: w.label('grid'), className: 'k-s-grid' }],
    window: state.window ? { ...win, label: w.label('window') } : null,
    highlight: state.focus === 'midday' ? { first: '10:00', last: '13:30' } : null,
    strip: req ? {
      maxMW: UNIT_MW, label: w.label('example'),
      legend: [{ kind: 'output', label: w.label('delivers') }, { kind: 'credited', label: w.label('credited') }],
      rows: [
        { label: w.label('short'), bars: [
          { ...win, mw: UNIT_MW * Math.min(1, 4 / req), kind: 'credited' },
          { first: peakFirst, last: peakLast, mw: UNIT_MW, kind: 'output' }] },
        { label: w.label('rule'), bars: [{ ...win, mw: UNIT_MW, kind: 'credited' }] },
      ] } : null,
  });
  const holder = h('div', {}, draw());
  const focus = toggleGroup({ label: w.title, value: 'evening',
    options: [{ value: 'midday', label: w.control(0) }, { value: 'evening', label: w.control(1) }],
    onChange: (v) => { state.focus = v; fill(holder, draw()); } });
  const windowSwitch = toggleGroup({ label: w.control(2), multi: true,
    options: [{ value: 'window', label: w.control(2), pressed: true }],
    onChange: (_, pressed) => { state.window = pressed; fill(holder, draw()); } });
  return scene(h('div', { class: 'k-control-row' }, focus, windowSwitch), holder);
}

/* ---- wa-07: fast response is a different job ------------------------------- */
function responseLadder(shot, { values }){
  const w = words(shot, values);
  const rungs = [['seconds', 'respond'], ['minutes', 'balance'], ['hours', 'shift']];
  const svg = diagram([600, 250], w.title, 'k-ladder',
    s('line', { class: 'k-ladder-rail', x1: 150, y1: 30, x2: 150, y2: 220 }),
    rungs.map(([t, job], i) => s('g', { class: `k-rung k-rung-${t}`, transform: `translate(0,${45 + i * 75})` },
      s('rect', { class: 'k-rung-bar', x: 140, y: -24, width: 440, height: 48, rx: 8 }),
      label(130, 5, w.label(t), { 'text-anchor': 'end' }),
      label(165, 5, w.label(job)))));
  svg.setAttribute('data-focus', 'hours');
  const controls = toggleGroup({ label: w.title, value: 'hours',
    options: [{ value: 'hours', label: w.control(0) }, { value: 'seconds', label: w.control(1) }],
    onChange: (v) => svg.setAttribute('data-focus', v) });
  return scene(controls, svg);
}

/* ---- wa-08: the rule plus the fade ----------------------------------------- */
function station(shot, { values }){
  const w = words(shot, values);
  const req = num(values.durationRequirement), play = num(values.playDuration);
  const sizes = [4, req, play];
  const state = { size: 2, aged: false };
  // a phone gets a narrower frame, so the hour ticks stay readable
  const [X0, PER_H] = narrow() ? [16, 30] : [60, 52];
  const svg = diagram([X0 + 10 * PER_H + 24, 190], w.title, 'k-energy');
  const readout = h('p', { class: 'k-readout', 'aria-live': 'polite' });
  const draw = () => {
    const hours = sizes[state.size] * (state.aged ? 1 - FADE : 1);
    const credited = req ? UNIT_MW * Math.min(1, hours / req) : null;
    const full = credited !== null && credited >= UNIT_MW - 1e-9;
    const ticks = Array.from({ length: 11 }, (_, i) => i);
    fill(svg, svg.firstChild,
      ticks.map(i => s('g', { class: 'k-tick' },
        s('line', { x1: X0 + i * PER_H, x2: X0 + i * PER_H, y1: 150, y2: 156 }),
        s('text', { x: X0 + i * PER_H, y: 172, 'text-anchor': 'middle' }, String(i)))),
      s('line', { class: 'k-axis', x1: X0, x2: X0 + 10 * PER_H, y1: 150, y2: 150 }),
      req ? s('g', { class: 'k-window' },
        s('rect', { x: X0, y: 34, width: req * PER_H, height: 116 }),
        label(X0 + 6, 28, w.label('window'))) : null,
      label(X0, 76, w.label('stored')),
      s('rect', { class: `k-energy-bar${full ? '' : ' k-short'}`, x: X0, y: 84, width: n2(hours * PER_H), height: 46, rx: 3 }));
    readout.replaceChildren(
      h('strong', {}, L(w.label('credited')), ': '),
      credited === null ? '—' : `${Math.round(credited)} MW / ${UNIT_MW} MW`,
      ' · ', L(full ? w.label('full') : w.label('below')),
      h('span', { class: 'k-tag' }, L(w.label('example'))));
  };
  draw();
  const size = toggleGroup({ label: w.label('size'), value: 2,
    options: [0, 1, 2].map(i => ({ value: i, label: w.control(i) })),
    onChange: (v) => { state.size = v; draw(); } });
  const age = toggleGroup({ label: w.label('age'), value: 'new',
    options: [{ value: 'new', label: w.control(3) }, { value: 'aged', label: w.control(4) }],
    onChange: (v) => { state.aged = v === 'aged'; draw(); } });
  return scene(h('div', { class: 'k-control-row' }, size, age), svg, readout);
}

/* ---- wa-09: what the investor owns ----------------------------------------- */
function cutaway(shot, { values }){
  const w = words(shot, values);
  const parts = Object.fromEntries((shot.extra?.hotspots || []).map(p => [p.id, p.name]));
  const L1 = 1.6, L2 = 3.8, L3 = 6;   // exploded heights, world units
  const stage = isoStage({
    viewBox: [560, 330], origin: [230, 120], title: w.title, sky: false,
    items: [
      { symbol: 'pad', at: [0, 0], opts: { w: 10, d: 7 } },
      { symbol: 'battery', at: [0.8, 1], opts: { count: 3 }, lift: L1 },
      { symbol: 'pcs', at: [5.2, 1.2], lift: L2 }, { symbol: 'transformer', at: [6.8, 3.4], lift: L2 },
      { symbol: 'controls', at: [3.6, 0.6], lift: L3 },
      { symbol: 'pylon', at: [11.5, 6.5] },
    ],
    wires: [[[7.4, 4], [11.5, 6.5]]],
    labels: [
      { at: [0, 7, 0], text: parts.site, cls: 'k-v-equipment', anchor: 'end', dx: -8, dy: 4 },
      { at: [0.8, 4.4, L1 + 1.1], text: parts.battery, cls: 'k-v-equipment', anchor: 'end', dx: -8 },
      { at: [6.1, 1.2, L2 + 1.1], text: parts.pcs, cls: 'k-v-equipment', dx: 10 },
      { at: [8.1, 3.4, L2 + 1.2], text: parts.transformer, cls: 'k-v-equipment', dx: 10 },
      { at: [3.6, 1.2, L3 + 0.9], text: parts.controls, cls: 'k-v-equipment', anchor: 'end', dx: -8 },
      { at: [11.5, 6.5, 5], text: parts.connection, cls: 'k-v-equipment', dx: 10 },
      { at: [11.5, 6.5, 5], text: w.label('connectionRight'), cls: 'k-v-rights', anchor: 'end', dx: -8 },
      { at: [0.8, 4.4, L1 + 1.1], text: w.label('capacityRight'), cls: 'k-v-rights', anchor: 'end', dx: -8 },
      { at: [0.8, 4.4, L1 + 1.1], text: w.label('obligation'), cls: 'k-v-rights', anchor: 'end', dx: -8, dy: 10 },
    ].filter(l => l.text),
  });
  stage.setAttribute('data-view', 'equipment');
  const controls = toggleGroup({ label: w.title, value: 'equipment',
    options: [{ value: 'equipment', label: w.control(0) }, { value: 'rights', label: w.control(1) }],
    onChange: (v) => stage.setAttribute('data-view', v) });
  return scene(controls, stage);
}

/* ---- wa-10: capacity first --------------------------------------------------- */
function paymentPath(shot, { values }){
  const w = words(shot, values);
  const lanes = shot.extra?.lanes || [];
  const panel = h('div', { class: 'k-lanes', 'aria-live': 'polite' });
  const draw = (k) => {
    const lane = lanes[k];
    if (!lane) return;
    panel.replaceChildren(
      h('ol', { class: 'k-lane' }, lane.steps.map(step => h('li', {}, L(fillPair(step, values))))),
      h('dl', { class: 'k-lane-terms' },
        h('dt', {}, L(w.label('unit'))), h('dd', {}, L(fillPair(lane.unit, values))),
        h('dt', {}, L(w.label('obligation'))), h('dd', {}, L(fillPair(lane.obligation, values))),
        h('dt', {}, L(w.label('evidence'))), h('dd', {}, L(fillPair(lane.evidence, values)))));
  };
  draw(0);
  const controls = toggleGroup({ label: w.title, value: 0,
    options: lanes.map((_, k) => ({ value: k, label: w.control(k) })),
    onChange: (k) => draw(k) });
  return scene(controls, panel);
}

/* ---- wa-11: one battery cannot promise everything ------------------------- */
function allocationBoard(shot, { values }){
  const w = words(shot, values);
  const on = { capacity: true, services: true, trading: true };
  const svg = diagram([600, 224], w.title, 'k-board');
  const readout = h('p', { class: 'k-readout', 'aria-live': 'polite' });
  const MAX = 140, Y0 = 190, PX = 120 / UNIT_MW;   // 100 MW = 120 px
  const draw = () => {
    const periods = [
      { key: 'midday', x: 120, parts: [on.trading && ['trading', TRADING_MW], on.services && ['services', SERVICES_MW]].filter(Boolean) },
      { key: 'window', x: 360, parts: [on.capacity && ['capacity', UNIT_MW], on.services && ['services', SERVICES_MW]].filter(Boolean) },
    ];
    const notes = [];
    fill(svg, svg.firstChild,
      s('line', { class: 'k-board-limit', x1: 60, x2: 580, y1: Y0 - UNIT_MW * PX, y2: Y0 - UNIT_MW * PX }),
      s('line', { class: 'k-axis', x1: 60, x2: 580, y1: Y0, y2: Y0 }),
      periods.map(p => {
        let y = Y0; const total = p.parts.reduce((t, [, mw]) => t + mw, 0);
        const blocks = p.parts.map(([kind, mw]) => {
          const hgt = Math.min(mw, MAX) * PX; y -= hgt;
          return s('rect', { class: `k-alloc k-alloc-${kind}`, x: p.x, y: n2(y), width: 160, height: n2(hgt) });
        });
        const over = total > UNIT_MW;
        notes.push(`${L(w.label(p.key))}: ${over ? L(w.label('conflict')) : `${L(w.label('headroom'))} ${UNIT_MW - total} MW`}`);
        return s('g', { class: over ? 'k-over' : '' }, blocks,
          label(p.x + 80, Y0 + 22, w.label(p.key), { 'text-anchor': 'middle' }),
          over ? label(p.x + 80, Y0 - total * PX - 8, w.label('conflict'), { 'text-anchor': 'middle', class: 'k-label k-conflict' }) : null);
      }));
    readout.replaceChildren(notes.join(' · '), ' · ', L(w.label('unknown')), h('span', { class: 'k-tag' }, L(w.label('example'))));
  };
  draw();
  const keys = ['capacity', 'services', 'trading'];
  const controls = toggleGroup({ label: w.title, multi: true,
    options: keys.map((k, i) => ({ value: k, label: w.control(i), pressed: true })),
    onChange: (k, pressed) => { on[k] = pressed; draw(); } });
  // an HTML key wraps at phone width, where SVG text would shrink and collide
  const key = h('ul', { class: 'k-key', 'aria-hidden': 'true' }, keys.map((k, i) =>
    h('li', {}, h('span', { class: `k-key-swatch k-alloc-${k}` }), L(w.control(i)))));
  return scene(controls, key, svg, readout);
}

/* ---- wa-14: what could weaken it ------------------------------------------- */
function overview(shot, { values }){
  const w = words(shot, values);
  return scene(isoStage({
    ...TOWN.view, time: 'dusk', title: w.title,
    items: [
      TOWN.ground,
      { symbol: 'city', at: TOWN.city },
      ...TOWN.homes.map(at => ({ symbol: 'homeSolar', at })),
      ...TOWN.pylons.map(at => ({ symbol: 'pylon', at })),
      { symbol: 'substation', at: TOWN.substation },
      { symbol: 'battery', at: TOWN.battery, opts: { count: 3, highlight: true } },
      ...TOWN.planned.map(at => ({ symbol: 'battery', at, opts: { count: 3, future: true } })),
      { symbol: 'battery', at: [3, 4], opts: { count: 2, future: true } },
    ],
    wires: TOWN.wires,
    labels: [
      { at: [TOWN.battery[0], TOWN.battery[1] + 1, 1.1], text: w.label('self'), anchor: 'end', dx: -8 },
      { at: [TOWN.planned[1][0] + 2.6, TOWN.planned[1][1] + 1, 1.1], text: w.label('others'), future: true, dx: 6, dy: 14 },
    ],
  }));
}

/** Scene builders by the shots' `scene` ids. */
export const scenes = {
  'island-map': islandMap,
  'one-way-grid': oneWayGrid,
  timeline,
  'rule-overlay': ruleOverlay,
  midday: middayChart,
  dusk: eveningChart,
  'response-ladder': responseLadder,
  station,
  cutaway,
  'payment-path': paymentPath,
  'allocation-board': allocationBoard,
  overview,
};
