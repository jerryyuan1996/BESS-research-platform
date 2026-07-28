/* Shared SVG chart primitives, verbatim from the prototype (lines 366-383, 389-404).

   The prototype carried six byte-identical copies of this library - one in the shell
   and one inside each embedded dashboard. This is the single copy every market and
   the home cockpit now import. See docs/migration-notes.md section 2. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

const SVGNS = 'http://www.w3.org/2000/svg';
function S(tag, attrs){
  const e = document.createElementNS(SVGNS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
function niceTicks(lo, hi, n = 4){
  if (hi === lo) hi = lo + 1;
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  let step = mag; for (const m of [1, 2, 2.5, 5, 10]) if (step0 <= m * mag){ step = m * mag; break; }
  const t0 = Math.floor(lo / step) * step, ticks = [];
  for (let v = t0; v <= hi + step * 0.001; v += step) ticks.push(+v.toPrecision(12));
  // Guard: callers use ticks[last] as the axis maximum, so the top tick must cover `hi`.
  // Without this a max that falls between the last tick and `hi` is drawn off-plot.
  if (ticks[ticks.length - 1] < hi) ticks.push(+(ticks[ticks.length - 1] + step).toPrecision(12));
  return ticks;
}
function roundTopRect(x, y, w, hh, r){
  r = Math.min(r, w / 2, hh);
  return `M${x},${y + hh} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + hh} Z`;
}
// mirror of roundTopRect for bars that hang below the zero baseline
function roundBotRect(x, y, w, hh, r){
  r = Math.min(r, w / 2, hh);
  return `M${x},${y} L${x},${y + hh - r} Q${x},${y + hh} ${x + r},${y + hh} L${x + w - r},${y + hh} Q${x + w},${y + hh} ${x + w},${y + hh - r} L${x + w},${y} Z`;
}
function legendRow(series){
  if (series.length < 2) return null;
  return h('div', { class: 'legend' }, series.map(s => h('span', { class: 'li' },
    h('span', { class: s.type === 'bar' ? 'lg-swatch' : 'lg-line' + (s.dash ? ' dash' : ''),
      style: (s.type === 'bar' ? 'background:' : 'border-top-color:') + s.color }),
    L(s.name) + (s.dash ? ' *' : ''))));
}

export { SVGNS, S, niceTicks, roundTopRect, roundBotRect, legendRow };
