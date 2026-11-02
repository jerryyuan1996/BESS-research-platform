/* ---------------------------------------------------------------------------
   Chart-RO-FLEET: one signature chart, two panels, one calendar axis.

   Upper panel: connected battery power in MW. Dated operator counts are solid
   points that keep their own population definition; the operator's year-end
   addition is a dashed, approximate point; the national plan is a dashed
   reference labelled as a plan. Lower panel: the model's two-hour day-ahead
   value as an index of its basis year, wholly dashed, with no point for 2026.

   The panels share a calendar and nothing else: two ordinates, two titles, no
   crossing, no break-even date, no four-hour line and no floor line. The
   comparison panel measures a model index, not realised revenue.

   When no dated count is eligible, neither panel can carry a number and the
   approved qualitative form stands in: same frame, no numeric axis, no numeric
   points, no numeric tooltip, tagged Example.

   Everything here composes the kit's own SVG factory; it draws no map and
   reads no model.
   --------------------------------------------------------------------------- */
import { L } from '../../../app/i18n.js';
import { s, n2, uid } from '../../../experience/story/kit/svg.js';
import { niceTicks } from '../../../charts/chartUtils.js';
import { chartFrame } from './ui.js';

const WIDE = { W: 720, H: 350, LEFT: 58, RIGHT: 20 };
const COMPACT = { W: 400, H: 330, LEFT: 46, RIGHT: 12 };
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
const GREEN = 'var(--ix-green,#224e40)';
const MUTED = 'var(--ix-muted,#68766c)';
const RISK = 'var(--ix-risk,#9c5b40)';

const mw = (v) => Math.round(v).toLocaleString('en-US');
const idx = (v) => Number(v.toFixed(1)).toString();

/**
 * spec: { points, estimate, plan, path, labels, compact, expected }
 *   points   eligible dated observations: { date, mw, mwh, status }
 *   estimate { forDate, mw } | null
 *   plan     { year, mw } | null
 *   path     the index points from storyBindings.indexPath
 *   labels   { fleet, estimate, plan, model, basis } — each an [en, zh] pair
 */
export function fleetChart(spec){
  const { W, H, LEFT, RIGHT } = spec.compact ? COMPACT : WIDE;
  const labels = spec.labels;
  const points = spec.points || [];
  const path = spec.path || [];
  const years = YEARS;
  const plotW = W - LEFT - RIGHT;
  const topA = 34, highA = spec.compact ? 118 : 132;
  const topB = topA + highA + 46, highB = spec.compact ? 92 : 104;
  const axisY = topB + highB + 26;
  const x = (year) => LEFT + ((year - years[0]) / (years[years.length - 1] - years[0])) * plotW;

  const powerValues = [...points.map(p => p.mw), spec.estimate?.mw, spec.plan?.mw].filter(Number.isFinite);
  const yTicks = niceTicks(0, Math.max(1, ...powerValues), 4);
  const yMax = yTicks[yTicks.length - 1];
  const yA = (v) => topA + highA - (v / yMax) * highA;

  const indexValues = path.filter(p => Number.isFinite(p.value)).map(p => p.value);
  const iTicks = niceTicks(Math.max(0, Math.floor((Math.min(...indexValues, 100) - 4) / 5) * 5), Math.ceil(Math.max(...indexValues, 100) / 5) * 5, 3);
  const iLo = iTicks[0], iHi = iTicks[iTicks.length - 1];
  const yB = (v) => topB + highB - ((v - iLo) / (iHi - iLo || 1)) * highB;

  const aria = uid('ro-fleet');
  const nodes = [];

  /* upper: grid, points, estimate, plan */
  nodes.push(...yTicks.map(v => s('g', { class: 'k-tick' },
    s('line', { class: 'k-grid', x1: LEFT, x2: W - RIGHT, y1: n2(yA(v)), y2: n2(yA(v)) }),
    s('text', { x: LEFT - 6, y: n2(yA(v) + 4), 'text-anchor': 'end' }, mw(v)))));
  if (spec.plan) nodes.push(s('line', {
    class: 'k-plan-reference', 'data-series': 'plan', x1: LEFT, x2: W - RIGHT,
    y1: n2(yA(spec.plan.mw)), y2: n2(yA(spec.plan.mw)), stroke: MUTED, 'stroke-width': 1.4, 'stroke-dasharray': '7 4',
  }));
  if (spec.estimate) nodes.push(s('circle', {
    'data-series': 'estimate', 'data-approximate': 'true', cx: n2(x(spec.estimate.year)), cy: n2(yA(spec.estimate.mw)), r: 5,
    fill: '#fffefa', stroke: MUTED, 'stroke-width': 2, 'stroke-dasharray': '3 2',
  }));
  for (const point of points){
    nodes.push(s('g', { 'data-series': 'observed', 'data-date': point.date, 'data-precision': point.precision || 'day' },
      s('circle', { cx: n2(x(point.year)), cy: n2(yA(point.mw)), r: 5, fill: GREEN })));
  }

  /* lower: the model index, wholly dashed, no 2026 point */
  nodes.push(...iTicks.map(v => s('g', { class: 'k-tick' },
    s('line', { class: 'k-grid', x1: LEFT, x2: W - RIGHT, y1: n2(yB(v)), y2: n2(yB(v)) }),
    s('text', { x: LEFT - 6, y: n2(yB(v) + 4), 'text-anchor': 'end' }, idx(v)))));
  const [basis, ...rest] = path;
  if (basis) nodes.push(s('circle', { 'data-series': 'model-basis', cx: n2(x(basis.year)), cy: n2(yB(basis.value)), r: 4, fill: '#fffefa', stroke: GREEN, 'stroke-width': 2, 'stroke-dasharray': '3 2' }));
  const segments = [];
  const firstModel = rest.find(p => Number.isFinite(p.value));
  if (basis && firstModel) segments.push([basis, firstModel]);
  for (let i = 0; i < rest.length; i++){
    if (Number.isFinite(rest[i].value) && Number.isFinite(rest[i + 1]?.value)) segments.push([rest[i], rest[i + 1]]);
  }
  for (const [a, b] of segments) nodes.push(s('path', {
    'data-series': 'model', fill: 'none', stroke: GREEN, 'stroke-width': 1.8, 'stroke-dasharray': '6 4',
    d: `M${n2(x(a.year))},${n2(yB(a.value))} L${n2(x(b.year))},${n2(yB(b.value))}`,
  }));
  for (const point of rest.filter(p => Number.isFinite(p.value))){
    nodes.push(s('circle', { 'data-series': 'model-point', cx: n2(x(point.year)), cy: n2(yB(point.value)), r: 3, fill: GREEN }));
  }

  /* axes */
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topA + highA, y2: topA + highA }));
  nodes.push(s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topB + highB, y2: topB + highB }));
  for (const year of years) nodes.push(s('g', { class: 'k-tick' },
    s('line', { x1: n2(x(year)), x2: n2(x(year)), y1: axisY - 4, y2: axisY }),
    s('text', { x: n2(x(year)), y: axisY + 14, 'text-anchor': 'middle' }, String(year))));

  nodes.push(s('text', { class: 'k-axis-title', x: 13, y: topA + highA / 2, transform: `rotate(-90 13 ${topA + highA / 2})`, 'text-anchor': 'middle' }, L(labels.fleet)));
  nodes.push(s('text', { class: 'k-axis-title', x: 13, y: topB + highB / 2, transform: `rotate(-90 13 ${topB + highB / 2})`, 'text-anchor': 'middle' }, L(labels.model)));
  nodes.push(s('text', { class: 'k-legend-label', x: LEFT, y: 14 }, L(labels.estimate)));

  const svg = chartFrame(labels.title, W, H, nodes);
  svg.setAttribute('data-chart-state', 'numeric');
  svg.setAttribute('data-index-years', rest.filter(p => Number.isFinite(p.value)).map(p => p.year).join(','));
  return svg;
}

/**
 * The approved fallback: the same two panels and the same calendar, drawn as
 * a shape with no numeric axis, no numeric point and no numeric tooltip. The
 * accessible description says what it is.
 */
export function qualitativeFleetChart({ labels, compact }){
  const { W, H, LEFT, RIGHT } = compact ? COMPACT : WIDE;
  const plotW = W - LEFT - RIGHT;
  const topA = 30, highA = 96, topB = topA + highA + 42, highB = 84;
  const x = (i) => LEFT + (i / 5) * plotW;
  const nodes = [
    s('path', { 'data-series': 'example-fleet', fill: 'none', stroke: GREEN, 'stroke-width': 2, d: `M${x(0)},${topA + highA} Q${x(2.2)},${topA + highA - 40} ${x(5)},${topA + 8}` }),
    s('path', { 'data-series': 'example-estimate', fill: 'none', stroke: MUTED, 'stroke-width': 1.6, 'stroke-dasharray': '7 4', d: `M${x(5)},${topA + 8} L${x(5.6)},${topA + 2}` }),
    s('line', { 'data-series': 'example-plan', x1: LEFT, x2: W - RIGHT, y1: topA + 2, y2: topA + 2, stroke: MUTED, 'stroke-width': 1.4, 'stroke-dasharray': '7 4' }),
    s('path', { 'data-series': 'example-model', fill: 'none', stroke: RISK, 'stroke-width': 1.8, 'stroke-dasharray': '6 4', d: `M${x(0)},${topB + 10} Q${x(2)},${topB + 44} ${x(5)},${topB + 52}` }),
    s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: topB + highB, y2: topB + highB }),
    s('text', { class: 'k-axis-title', x: 13, y: topA + highA / 2, transform: `rotate(-90 13 ${topA + highA / 2})`, 'text-anchor': 'middle' }, L(labels.fleet)),
    s('text', { class: 'k-axis-title', x: 13, y: topB + highB / 2, transform: `rotate(-90 13 ${topB + highB / 2})`, 'text-anchor': 'middle' }, L(labels.model)),
    s('text', { class: 'k-legend-label', x: LEFT, y: 14 }, L(labels.example)),
  ];
  const svg = chartFrame(labels.title, W, H, nodes);
  svg.setAttribute('data-chart-state', 'example');
  return svg;
}

/** Which form the chart takes: a number only where a dated count is eligible. */
export function signatureChart({ points, estimate, plan, path, labels, compact }){
  return points?.length
    ? fleetChart({ points, estimate, plan, path, labels, compact })
    : qualitativeFleetChart({ labels, compact });
}
