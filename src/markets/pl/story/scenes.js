/* ---------------------------------------------------------------------------
   Poland's scenes (WP-07), composed from the shared kit and this market's own
   records. Thirteen shots, thirteen drawings.

   Rules kept here, shot by shot: an observed auction result or a decided rule
   is solid, a boundary or a plan is dashed, and a teaching readout is tagged
   Example; no drawing carries a figure the content module does not bind; and
   no control writes the market row, a case input, the URL or the model. The
   signature chart's numeric form exists but is not drawn until the analyst
   accepts it at G-2 (chart.js, PL_CHART.quantitativeReady).
   --------------------------------------------------------------------------- */
import { fillPair } from '../../../experience/story/contract.js';
import { HOME_BRIEFING } from '../../../briefing/homeData.js';
import {
  h, L, s, toggleGroup, fill, scene, diagram, text, stateFor, evidence, exampleTag,
} from './ui.js';
import { signatureChart, auctionTable } from './chart.js';
import { POLAND, FRAME, SLOTS } from './geo.js';
import { PL_AUCTIONS, PL_RULES, PL_CHART, PL_SUCCESSOR, auctionSeries } from '../data/capacityAuctions.js';
import { story } from '../story.js';

const GREEN = 'var(--ix-green,#224e40)';
const MUTED = 'var(--ix-muted,#68766c)';
const RISK = 'var(--ix-risk,#9c5b40)';
const INK = 'var(--ix-ink,#193c32)';
const PAPER = '#fffefa';

const words = (shot, values) => ({
  title: fillPair(shot.question, values),
  label: (key) => fillPair(shot.labels?.[key] || ['', ''], values),
  control: (i) => fillPair(shot.controls?.[i] || ['', ''], values),
});
const t = (pair, values) => text(pair, values);
const controlRow = (...groups) => h('div', { class: 'k-control-row' }, ...groups);

/** The country outline every drawing starts from. */
const outline = (fillTone = '#e6e9dc') => s('path', { d: POLAND, fill: fillTone, stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' });

/* ---- pl-00: the small map beside the card ------------------------------- */

export function openingThumbnail(){
  return scene(diagram(['Poland', '波兰'], 220, 130,
    s('path', { d: POLAND, fill: '#e6e9dc', stroke: INK, 'stroke-width': 1, transform: 'translate(20,4) scale(0.29)' }),
    s('circle', { cx: 74, cy: 44, r: 4, fill: GREEN }),
    s('circle', { cx: 146, cy: 44, r: 4, fill: RISK })));
}

function opening(shot, { values }){
  return openingThumbnail();
}

/* ---- pl-01: a system built around coal -------------------------------- */

function coalSystem(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'fleet' });
  const svg = diagram(w.title, FRAME[0], FRAME[1]);
  const draw = () => {
    const limited = state.view === 'limited';
    fill(svg, svg.firstChild,
      outline(),
      SLOTS.wires.map(points => s('polyline', { points: points.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#9dae99', 'stroke-width': 1.6 })),
      SLOTS.units.map(([x, y]) => s('rect', { x: x - 6, y: y - 6, width: 12, height: 12, rx: 1, fill: '#b9b3a4', stroke: INK, 'stroke-width': 1 })),
      SLOTS.loads.map(([x, y], i) => s('g', { 'data-load': i },
        s('circle', { cx: x, cy: y, r: 7, fill: limited ? '#d9ded2' : '#e2b84c', stroke: INK, 'stroke-width': 1, 'fill-opacity': limited ? 0.5 : 1 }),
        limited ? s('line', { x1: x - 5, y1: y - 5, x2: x + 5, y2: y + 5, stroke: RISK, 'stroke-width': 1.6 }) : null,
        limited ? s('line', { x1: x + 5, y1: y - 5, x2: x - 5, y2: y + 5, stroke: RISK, 'stroke-width': 1.6 }) : null)),
      s('text', { class: 'k-label', x: 300, y: 246, 'text-anchor': 'middle' }, t(w.label('l01'), values)),
      s('text', { class: 'k-label', x: 452, y: 96, 'text-anchor': 'middle' }, t(w.label('l02'), values)),
      limited ? s('text', { class: 'k-label', x: 452, y: 78, 'text-anchor': 'middle' }, t(w.label('l03'), values)) : null);
    svg.setAttribute('data-view', state.view);
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.view, options: [
      { value: 'fleet', label: w.control(0) }, { value: 'limited', label: w.control(1) },
    ], onChange: (v) => { state.view = v; save(); draw(); } })),
    svg,
    evidence(shot, values));
}

/* ---- pl-02: paying for capacity, by unit type -------------------------- */

function capacityMarket(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { unit: 0 });
  const terms = [PL_RULES.existingMaxYears, PL_RULES.modernisedMaxYears, PL_RULES.newMaxYears];
  const svg = diagram(w.title, 600, 240);
  const draw = () => {
    const scale = 320 / 17;
    fill(svg, svg.firstChild,
      s('circle', { cx: 70, cy: 120, r: 26, fill: '#e6e9dc', stroke: INK, 'stroke-width': 1.4 }),
      s('text', { class: 'k-label', x: 70, y: 124, 'text-anchor': 'middle' }, 'PSE'),
      terms.map((years, i) => s('g', { 'data-unit': i },
        s('line', { x1: 100, y1: 82 + i * 40, x2: 120 + years * scale, y2: 82 + i * 40, stroke: state.unit === i ? GREEN : MUTED, 'stroke-width': state.unit === i ? 9 : 6, 'stroke-linecap': 'round', 'stroke-opacity': state.unit === i ? 0.9 : 0.45 }),
        s('text', { class: 'k-label', x: 128 + years * scale, y: 86 + i * 40 }, t(w.label(`l0${i + 1}`), values)))),
      s('line', { x1: 100, y1: 200, x2: 100, y2: 58, stroke: INK, 'stroke-width': 1, 'stroke-dasharray': '4 3' }));
    svg.setAttribute('data-unit', String(state.unit));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: String(state.unit), options: [
      { value: '0', label: w.control(0) }, { value: '1', label: w.control(1) }, { value: '2', label: w.control(2) },
    ], onChange: (v) => { state.unit = Number(v); save(); draw(); } })),
    svg,
    h('ul', { class: 'k-key' }, ['l04', 'l05'].map(key => h('li', {}, t(w.label(key), values)))),
    evidence(shot, values));
}

/* ---- pl-03: near-full credit ------------------------------------------- */

function batteryEntry(shot, { values, row }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { delivery: 0 });
  const first = PL_AUCTIONS.find(r => r.id === 'main-2027');
  const second = PL_AUCTIONS.find(r => r.id === 'main-2028');
  const picked = state.delivery ? second : first;
  const power = row?.investment?.powerMW ?? null;
  const certified = power == null ? null : Math.min(power, (power * picked.batteryFactorPct) / 100);
  const svg = diagram(w.title, 600, 260);
  const draw = () => {
    const peak = Math.max(first.batteryObligationMW, second.batteryObligationMW);
    fill(svg, svg.firstChild,
      /* the gauge: certified power x factor = obligation, at drawing scale */
      s('rect', { x: 60, y: 46, width: 300, height: 22, rx: 2, fill: '#d9ded2' }),
      s('rect', { x: 60, y: 46, width: (picked.batteryFactorPct / 100) * 300, height: 22, rx: 2, fill: GREEN, 'fill-opacity': 0.28 }),
      s('text', { class: 'k-label', x: 60, y: 38 }, t(w.label('l01'), values)),
      s('text', { class: 'k-label', x: 366, y: 62 }, `${picked.batteryFactorPct.toFixed(2)}%`),
      s('text', { class: 'k-label', x: 60, y: 96 }, `${t(w.label('l03'), values)}${certified == null ? '' : ` · ${Math.round(certified)} MW`}`),
      [first, second].map((record, i) => {
        const x = 420 + i * 70;
        const height = (record.batteryObligationMW / peak) * 130;
        return s('g', { 'data-bar': i },
          s('rect', { x, y: 200 - height, width: 34, height, rx: 2, fill: state.delivery === i ? GREEN : '#d9ded2', stroke: INK, 'stroke-width': 1 }),
          s('text', { class: 'k-label', x: x + 17, y: 216, 'text-anchor': 'middle' }, String(record.deliveryYear)),
          s('text', { class: 'k-value', x: x + 17, y: 194 - height, 'text-anchor': 'middle' }, `${Math.round(record.batteryObligationMW).toLocaleString('en-US')}`));
      }),
      s('text', { class: 'k-label', x: 470, y: 236, 'text-anchor': 'middle' }, t(w.label('l04'), values)));
    svg.setAttribute('data-delivery', String(picked.deliveryYear));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: String(state.delivery), options: [
      { value: '0', label: w.control(0) }, { value: '1', label: w.control(1) },
    ], onChange: (v) => { state.delivery = Number(v); save(); draw(); } })),
    svg,
    h('p', { class: 'k-readout' }, exampleTag(), ' ', t(w.label('l02'), values)),
    evidence(shot, values));
}

/* ---- pl-04: the calendar that stops ------------------------------------ */

function endDate(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { band: 0 });
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const svg = diagram(w.title, 600, 240);
  const x = (year) => 60 + ((year - 2020) / 11) * 500;
  const draw = () => {
    fill(svg, svg.firstChild,
      s('line', { x1: 60, x2: 560, y1: 130, y2: 130, stroke: INK, 'stroke-width': 1 }),
      years.map(year => s('g', {},
        s('line', { x1: x(year), x2: x(year), y1: 126, y2: 134, stroke: INK }),
        s('text', { class: 'k-label', x: x(year), y: 150, 'text-anchor': 'middle' }, String(year)),
        s('circle', { cx: x(year), cy: 130, r: 3.4, fill: GREEN }))),
      /* one-year auctions for existing units, ending at the supplementary date */
      s('rect', { x: 60, y: 74, width: x(2028) - 60, height: 14, rx: 2, fill: GREEN, 'fill-opacity': 0.22 }),
      s('text', { class: 'k-label', x: 64, y: 66 }, t(w.label('l03'), values)),
      /* the boundary, dashed: no main auction scheduled in law */
      s('line', { x1: x(2030), x2: 560, y1: 130, y2: 130, stroke: MUTED, 'stroke-width': 1.6, 'stroke-dasharray': '7 4' }),
      s('rect', { x: x(2030), y: 96, width: 560 - x(2030), height: 26, fill: 'none', stroke: MUTED, 'stroke-dasharray': '6 4' }),
      s('text', { class: 'k-label', x: x(2030) + 6, y: 90 }, t(w.label('l02'), values)),
      s('text', { class: 'k-label', x: 60, y: 190 }, t(w.label('l04'), values)));
    svg.setAttribute('data-band', state.band ? 'one-year' : 'main');
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: String(state.band), options: [
      { value: '0', label: w.control(0) }, { value: '1', label: w.control(1) },
    ], onChange: (v) => { state.band = Number(v); save(); draw(); } })),
    svg,
    h('p', { class: 'k-readout' }, t(shot.caption, values)),
    evidence(shot, values));
}

/* ---- pl-05: the signature chart ---------------------------------------- */

function auctionChartScene(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { panel: 'both' });
  const rows = auctionSeries();
  const labels = {
    l01: w.label('l01'), l02: w.label('l02'), l03: w.label('l03'), l04: w.label('l04'),
    l05: w.label('l05'), l06: w.label('l06'), l07: w.label('l07'), l08: w.label('l08'),
  };
  const ready = PL_CHART.quantitativeReady;
  const table = auctionTable({ rows, labels, ready });
  const node = h('div', {},
    ready ? null : h('p', { class: 'k-readout' }, exampleTag(), ' ', text(story.text['Example reading'], values)),
    signatureChart({ rows, boundary: PL_SUCCESSOR.firstUnscheduledDeliveryYear, labels, ready }),
    ready && table ? h('details', { class: 'ix-story-sources' },
      h('summary', {}, L(['Data table', '数据表'])),
      h('table', { class: 'k-table' },
        h('caption', {}, t(labels.l01, values)),
        h('thead', {}, h('tr', {}, table.head.map(cell => h('th', { scope: 'col' }, cell)))),
        h('tbody', {}, table.cells.map(row => h('tr', {}, row.map(cell => h('td', {}, cell))))))) : null);
  const chosen = (panel) => {
    if (typeof node.querySelector !== 'function') return;
    const svg = node.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('data-panel', panel);
    svg.querySelectorAll('[data-series="contract"]').forEach(el => { el.style.display = panel === 'price' ? 'none' : ''; });
    svg.querySelectorAll('[data-series="price"]').forEach(el => { el.style.display = panel === 'contract' ? 'none' : ''; });
  };
  chosen(state.panel);
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.panel, options: [
      { value: 'both', label: w.control(2) }, { value: 'price', label: w.control(0) }, { value: 'contract', label: w.control(1) },
    ], onChange: (v) => { state.panel = v; save(); chosen(v); } })),
    node,
    h('p', { class: 'k-readout' }, t(shot.caption, values)),
    evidence(shot, values));
}

/* ---- pl-06: four doors -------------------------------------------------- */

function fourDoors(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { door: 0 });
  const doors = [
    { key: 'main', label: w.label('l01'), who: w.label('l02'), tone: 'closed' },
    { key: 'quarterly', label: w.label('l03'), who: w.label('l02'), tone: 'open' },
    { key: 'supplementary', label: w.label('l04'), who: w.label('l02'), tone: 'open' },
    { key: 'successor', label: w.label('l05'), who: w.control(3), tone: 'dashed' },
  ];
  const panel = h('div', { class: 'k-readout' });
  const draw = () => {
    fill(panel, doors.map((door, i) => h('p', {},
      h('button', {
        type: 'button', class: 'ix-button ix-outline ix-small',
        'aria-pressed': String(i === state.door),
        onclick: () => { state.door = i; save(); draw(); },
      }, t(door.label, values)), ' ',
      i === state.door ? t(door.who, values) : '')));
  };
  draw();
  return scene(panel, evidence(shot, values));
}

/* ---- pl-07: a teaching day -------------------------------------------- */

function teachingDay(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { mode: 'charge' });
  const svg = diagram(w.title, 600, 240);
  /* A day shape in drawing units only: no axis, no price, no unit. */
  const curve = [0.72, 0.66, 0.58, 0.52, 0.5, 0.55, 0.62, 0.58, 0.4, 0.28, 0.22, 0.3, 0.44, 0.52, 0.62, 0.74, 0.86, 0.9, 0.82, 0.7, 0.64, 0.6, 0.66, 0.7];
  const x = (i) => 50 + (i / (curve.length - 1)) * 500;
  const y = (v) => 190 - v * 120;
  const draw = () => {
    const charging = state.mode === 'charge';
    fill(svg, svg.firstChild,
      s('path', { fill: 'none', stroke: MUTED, 'stroke-width': 2, d: curve.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') }),
      curve.map((v, i) => ((charging ? v < 0.36 : v > 0.78)
        ? s('rect', { x: x(i) - 5, y: y(v), width: 10, height: 190 - y(v), fill: RISK, 'fill-opacity': 0.18 })
        : null)),
      s('line', { x1: 50, x2: 550, y1: 190, y2: 190, stroke: INK, 'stroke-width': 1 }),
      s('text', { class: 'k-label', x: 50, y: 212 }, t(w.label('l02'), values)));
    svg.setAttribute('data-mode', state.mode);
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.mode, options: [
      { value: 'charge', label: w.control(0) }, { value: 'discharge', label: w.control(1) },
    ], onChange: (v) => { state.mode = v; save(); draw(); } })),
    svg,
    h('p', { class: 'k-readout' }, exampleTag(), ' ', t(w.label('l01'), values)),
    h('p', { class: 'k-readout' }, t(w.label('l03'), values)),
    evidence(shot, values));
}

/* ---- pl-08: why four hours -------------------------------------------- */

function certification(shot, { values, row }){
  const w = words(shot, values);
  const hours = row?.play?.hours ?? PL_RULES.certificationHours;
  const { state, save } = stateFor(shot.id, { preset: 'full' });
  const band = HOME_BRIEFING.grids?.pl?.byRoute?.mer?.band || [];
  const shorter = band.find(entry => entry < hours) || Math.max(1, hours - 2);
  const selected = state.preset === 'short' ? shorter : hours;
  const power = row?.investment?.powerMW ?? null;
  const energy = power == null ? null : power * selected;
  const certified = power == null ? null : Math.min(power, energy / PL_RULES.certificationHours);
  const svg = diagram(w.title, 600, 220);
  const draw = () => {
    const blocks = selected;
    fill(svg, svg.firstChild,
      s('rect', { x: 60, y: 70, width: 340, height: 60, rx: 4, fill: 'none', stroke: INK, 'stroke-width': 1.4 }),
      Array.from({ length: blocks }, (_, i) => s('rect', { x: 66 + i * (328 / blocks), y: 76, width: 328 / blocks - 4, height: 48, rx: 2, fill: GREEN, 'fill-opacity': 0.2 + 0.6 / blocks })),
      s('text', { class: 'k-label', x: 60, y: 58 }, t(w.label('l02'), values)),
      s('text', { class: 'k-label', x: 60, y: 162 }, `${t(w.label('l01'), values)}${certified == null ? '' : ` · ${Math.round(certified)} MW`}`));
    svg.setAttribute('data-preset', state.preset);
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.preset, options: [
      { value: 'short', label: w.control(0) }, { value: 'full', label: w.control(1) },
    ], onChange: (v) => { state.preset = v; save(); draw(); } })),
    svg,
    h('p', { class: 'k-readout' }, exampleTag(), ' ', t(w.label('l03'), values)),
    evidence(shot, values));
}

/* ---- pl-09: what the investor buys ------------------------------------ */

function rights(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { layer: 0 });
  const svg = diagram(w.title, 600, 260);
  const draw = () => {
    fill(svg, svg.firstChild,
      [0, 1, 2].map(i => s('g', { 'data-layer': i },
        s('path', {
          d: `M${150 + i * 18},${190 - i * 42} L${380 + i * 18},${190 - i * 42} L${420 + i * 18},${164 - i * 42} L${190 + i * 18},${164 - i * 42} Z`,
          fill: i === state.layer ? '#cfe0c0' : '#e6e9dc', stroke: INK, 'stroke-width': 1.2, 'fill-opacity': i === state.layer ? 1 : 0.8,
        }),
        s('text', { class: 'k-label', x: 150 + i * 18, y: 186 - i * 42 }, `${i + 1}`))),
      s('text', { class: 'k-label', x: 300, y: 246, 'text-anchor': 'middle' }, t(w.control(1), values)));
    svg.setAttribute('data-layer', String(state.layer));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: String(state.layer), options: [
      { value: '0', label: w.control(0) }, { value: '1', label: w.control(1) },
    ], onChange: (v) => { state.layer = Number(v); save(); draw(); } })),
    svg,
    evidence(shot, values));
}

/* ---- pl-10: two cohorts, two payers ---------------------------------- */

function paymentPaths(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { route: 0 });
  const routes = [
    { steps: 3, recurring: true },
    { steps: 2, recurring: false },
    { steps: 1, recurring: true },
  ];
  const svg = diagram(w.title, 600, 240);
  const draw = () => {
    const route = routes[state.route];
    fill(svg, svg.firstChild,
      Array.from({ length: route.steps }, (_, i) => s('g', {},
        s('circle', { cx: 120 + i * 160, cy: 110, r: 20, fill: i === state.route ? '#cfe0c0' : '#e6e9dc', stroke: INK, 'stroke-width': 1.2 }),
        i ? s('line', { x1: 140 + (i - 1) * 160, x2: 100 + i * 160, y1: 110, y2: 110, stroke: INK, 'stroke-width': 1.6, 'stroke-dasharray': route.recurring ? null : '5 3' }) : null)),
      s('text', { class: 'k-label', x: 300, y: 176, 'text-anchor': 'middle' },
        route.recurring ? t(w.label('l04'), values) : t(w.label('l05'), values)));
    svg.setAttribute('data-route', String(state.route));
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: String(state.route), options: [
      { value: '0', label: w.control(0) }, { value: '1', label: w.control(1) }, { value: '2', label: w.control(2) },
    ], onChange: (v) => { state.route = Number(v); save(); draw(); } })),
    svg,
    h('ul', { class: 'k-key' }, ['l01', 'l02', 'l03'].map(key => h('li', {}, t(w.label(key), values)))),
    evidence(shot, values));
}

/* ---- pl-11: the capital stack ---------------------------------------- */

function capitalStack(shot, { values }){
  const w = words(shot, values);
  const { state, save } = stateFor(shot.id, { view: 'grant' });
  const svg = diagram(w.title, 600, 240);
  const share = typeof values.grantShare === 'string' ? Number.parseFloat(values.grantShare) / 100 : 0;
  const draw = () => {
    const withGrant = state.view !== 'plain';
    const barW = 300, x = 120, y = 60;
    fill(svg, svg.firstChild,
      s('rect', { x, y, width: barW, height: 28, rx: 2, fill: 'none', stroke: INK, 'stroke-width': 1.2 }),
      s('rect', { x, y, width: withGrant ? barW * (1 - share) : barW, height: 28, rx: 2, fill: GREEN, 'fill-opacity': 0.7 }),
      withGrant ? s('rect', { x: x + barW * (1 - share), y, width: barW * share, height: 28, rx: 2, fill: '#e2b84c', 'fill-opacity': 0.85 }) : null,
      s('text', { class: 'k-label', x, y: y - 8 }, t(w.label('l01'), values)),
      withGrant ? s('text', { class: 'k-label', x: x + barW * (1 - share) + 6, y: y + 44 }, `${t(w.label('l02'), values)} ${values.grantShare}`) : null,
      s('text', { class: 'k-label', x, y: y + 66 }, t(w.label('l03'), values)),
      s('text', { class: 'k-label', x, y: y + 100 }, t(w.label('l04'), values)),
      state.view === 'both' ? s('text', { class: 'k-label', x, y: y + 130 }, `${t(w.label('l05'), values)} · ${L(['Unpriced', '尚未定价'])}`) : null);
    svg.setAttribute('data-view', state.view);
  };
  draw();
  return scene(
    controlRow(toggleGroup({ label: w.title, value: state.view, options: [
      { value: 'plain', label: w.control(0) }, { value: 'grant', label: w.control(1) }, { value: 'both', label: w.control(2) },
    ], onChange: (v) => { state.view = v; save(); draw(); } })),
    svg,
    h('p', { class: 'k-readout' }, t(w.label('l06'), values)),
    evidence(shot, values));
}

/* ---- pl-12: what could weaken it ------------------------------------- */

function factors(shot, { values }){
  const w = words(shot, values);
  const svg = diagram(w.title, 600, 220);
  fill(svg, svg.firstChild,
    s('path', { d: POLAND, fill: '#f0f2ea', stroke: INK, 'stroke-width': 1, transform: 'translate(30,6) scale(0.9)' }),
    /* the future fleet, dashed: no MW, no arrival probability, no site */
    SLOTS.future.map(([x, y]) => s('rect', { x: x - 8, y: y - 8, width: 16, height: 16, rx: 2, fill: 'none', stroke: MUTED, 'stroke-width': 1.4, 'stroke-dasharray': '4 3' })),
    s('text', { class: 'k-label', x: 300, y: 208, 'text-anchor': 'middle' }, t(w.label('l01'), values)));
  return scene(
    controlRow(h('p', { class: 'k-readout' }, t(w.label('l02'), values))),
    svg,
    evidence(shot, values));
}

export const scenes = {
  'pl-opening': opening,
  'pl-coal-system': coalSystem,
  'pl-capacity-market': capacityMarket,
  'pl-battery-entry': batteryEntry,
  'pl-end-date': endDate,
  'pl-auction-chart': auctionChartScene,
  'pl-four-doors': fourDoors,
  'pl-teaching-day': teachingDay,
  'pl-certification': certification,
  'pl-rights': rights,
  'pl-payment-paths': paymentPaths,
  'pl-capital-stack': capitalStack,
  'pl-factors': factors,
};
