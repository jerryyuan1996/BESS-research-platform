/* ---------------------------------------------------------------------------
   The story's day chart: one 24-hour profile in 30-minute intervals, the
   pattern each market's signature chart reuses (WP-06).

   Flat 2D SVG with units and times on the axes, built like the site's other
   charts (no charting dependency). What it draws:

     series     areas or lines in MW; an area may stack on another, so grid
                demand plus rooftop solar reads as their sum
     window     a band over whole intervals, e.g. AEMO's obligation window,
                drawn the full height of both panels
     highlight  a soft wash over the teaching control's time of day
     strip      an optional panel beneath, on its own MW scale and the same
                clock, for a teaching battery: what it can deliver (outline),
                the power it is credited for (solid) and energy kept back for
                fade (pale). Its title says Example
     scenario   series flagged `scenario` are dashed; observed data is solid

   Every word arrives as an [en, zh] pair and is rendered with L(), so the
   chart re-renders in the other language without new strings.
   --------------------------------------------------------------------------- */
import { L } from '../../../app/i18n.js';
import { niceTicks } from '../../../charts/chartUtils.js';
import { s, n2, uid } from './svg.js';

/* Two geometries. The wide one suits a desktop column; `compact` is drawn
   near 1:1 on a phone, so its 11px text stays readable instead of being
   scaled down to half size. The shell picks it for narrow screens. */
const WIDE = { W: 720, LEFT: 58, RIGHT: 18, MAIN_H: 230, tickEvery: 6 };
const COMPACT = { W: 400, LEFT: 44, RIGHT: 10, MAIN_H: 170, tickEvery: 12 };
const BOTTOM = 34;
const ROW_H = 30;
const LINE = 15;
const BAR_ORDER = { reserve: 0, credited: 1, output: 2 };

/** "HH:MM" to an interval index (0..47) on a 30-minute clock. */
export function intervalIndex(hhmm){
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 2 + (m >= 30 ? 1 : 0);
}

const fmtMW = (v) => Math.round(v).toLocaleString('en-US');

/* A legend line: swatch then words, one entry per line so long labels and
   Chinese never collide. */
const legendEntry = (cls, label, x, y) => s('g', { class: `k-legend ${cls}`, transform: `translate(${x},${y})` },
  s('rect', { class: 'k-swatch', x: 0, y: -8, width: 12, height: 8 }),
  s('text', { x: 17, y: 0 }, L(label)));

/**
 * spec: { title, desc, series: [{ key, values (48), kind: 'area'|'line',
 *   stackOn?, label, className?, scenario? }], window?: { first, last, label },
 *   highlight?: { first, last }, yLabel?, strip?: { maxMW, label, legend?:
 *   [{ kind, label }], rows: [{ label, bars: [{ first, last, mw, kind }] }] },
 *   compact?: boolean }
 */
export function dayChart(spec){
  const { W, LEFT, RIGHT, MAIN_H, tickEvery } = spec.compact ? COMPACT : WIDE;
  const n = 48;
  const series = spec.series || [];
  const rows = spec.strip?.rows || [];
  const top0 = 10 + LINE * series.length + (spec.window ? 12 : 0);
  const stripLegend = spec.strip?.legend || [];
  // compact: the strip legend goes on its own lines under the strip title
  const stripHead = 26 + (spec.compact ? LINE * stripLegend.length : 0);
  const stripH = rows.length ? stripHead + rows.length * ROW_H : 0;
  const H = top0 + MAIN_H + BOTTOM + stripH;
  const plotW = W - LEFT - RIGHT;
  const x = (i) => LEFT + (i / n) * plotW;
  const mid = (i) => x(i + 0.5);
  const ids = { title: uid('k-ctitle'), desc: uid('k-cdesc') };

  // stacked tops, for areas that sit on another series
  const byKey = Object.fromEntries(series.map(sr => [sr.key, sr]));
  const base = (sr) => sr.stackOn ? top(byKey[sr.stackOn]) : new Array(n).fill(0);
  function top(sr){
    const b = base(sr);
    return sr.values.map((v, i) => (Number.isFinite(v) ? v : 0) + b[i]);
  }
  const ticks = niceTicks(0, Math.max(1, ...series.flatMap(sr => top(sr))), 4);
  const yMax = ticks[ticks.length - 1];
  const y = (v) => top0 + MAIN_H - (v / yMax) * MAIN_H;

  const span = (first, last) => [x(intervalIndex(first)), x(intervalIndex(last) + 1)];
  const band = (first, last, cls, label, fullHeight) => {
    const [a, b] = span(first, last);
    const height = MAIN_H + 6 + (fullHeight && stripH ? stripH + BOTTOM - 8 : 0);
    return s('g', { class: cls },
      s('rect', { x: n2(a), y: top0 - 6, width: n2(b - a), height }),
      label ? s('text', { class: 'k-band-label', x: n2((a + b) / 2), y: top0 - 10, 'text-anchor': 'middle' }, L(label)) : null);
  };

  const seriesNodes = series.map(sr => {
    const t = top(sr), b = base(sr);
    const line = t.map((v, i) => `${i ? 'L' : 'M'}${n2(mid(i))},${n2(y(v))}`).join(' ');
    const cls = `${sr.className || ''}${sr.scenario ? ' k-scenario' : ''}`;
    if (sr.kind === 'line') return s('path', { class: `k-series k-line ${cls}`, d: line });
    const back = b.map((_, i) => `L${n2(mid(n - 1 - i))},${n2(y(b[n - 1 - i]))}`).join(' ');
    return s('g', { class: `k-series ${cls}` },
      s('path', { class: 'k-area', d: `${line} ${back} Z` }),
      s('path', { class: 'k-edge', d: line }));
  });

  const tickAt = Array.from({ length: 48 / tickEvery + 1 }, (_, k) => k * tickEvery);
  const xTicks = tickAt.map(i => s('g', { class: 'k-tick' },
    s('line', { x1: n2(x(i)), x2: n2(x(i)), y1: top0 + MAIN_H, y2: top0 + MAIN_H + 4 }),
    // the end labels sit inside the frame rather than centred on its edge
    s('text', { x: n2(x(i)), y: top0 + MAIN_H + 17, 'text-anchor': x(i) < 20 ? 'start' : x(i) > W - 20 ? 'end' : 'middle' }, `${String((i / 2) % 24).padStart(2, '0')}:00`)));
  const yTicks = ticks.map(v => s('g', { class: 'k-tick' },
    s('line', { class: 'k-grid', x1: LEFT, x2: W - RIGHT, y1: n2(y(v)), y2: n2(y(v)) }),
    s('text', { x: LEFT - 6, y: n2(y(v) + 4), 'text-anchor': 'end' }, fmtMW(v))));

  const legend = series.map((sr, i) => legendEntry(sr.className || '', sr.label, LEFT, 12 + i * LINE));

  let strip = null;
  if (rows.length){
    const s0 = top0 + MAIN_H + BOTTOM;
    const maxMW = spec.strip.maxMW || 100;
    const hy = (mw) => (Math.min(mw, maxMW) / maxMW) * (ROW_H - 8);
    strip = s('g', { class: 'k-strip' },
      s('text', { class: 'k-strip-title', x: LEFT, y: s0 + 10 }, L(spec.strip.label)),
      stripLegend.map((lg, i) => spec.compact
        ? legendEntry(`k-bar-${lg.kind}`, lg.label, LEFT, s0 + 10 + LINE * (i + 1))
        : legendEntry(`k-bar-${lg.kind}`, lg.label, W - RIGHT - 170 * (stripLegend.length - i), s0 + 10)),
      rows.map((row, r) => {
        const y0 = s0 + stripHead + r * ROW_H;
        const floor = y0 + ROW_H - 4;
        const bars = [...row.bars].sort((a, b) => (BAR_ORDER[a.kind || 'output'] ?? 3) - (BAR_ORDER[b.kind || 'output'] ?? 3));
        return s('g', { class: 'k-strip-row' },
          s('line', { class: 'k-strip-base', x1: LEFT, x2: W - RIGHT, y1: floor, y2: floor }),
          // inside the plot, left-aligned: long and Chinese labels never leave the frame
          s('text', { class: 'k-strip-label', x: LEFT + 4, y: floor - 4 }, L(row.label)),
          bars.map(bar => {
            const [a, b] = span(bar.first, bar.last);
            return s('rect', { class: `k-bar k-bar-${bar.kind || 'output'}`, x: n2(a), y: n2(floor - hy(bar.mw)), width: n2(b - a), height: n2(hy(bar.mw)) });
          }));
      }));
  }

  return s('svg', { class: 'k-chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-labelledby': `${ids.title} ${ids.desc}` },
    s('title', { id: ids.title }, spec.title ? L(spec.title) : ''),
    s('desc', { id: ids.desc }, spec.desc ? L(spec.desc) : ''),
    spec.window ? band(spec.window.first, spec.window.last, 'k-window', spec.window.label, true) : null,
    yTicks, seriesNodes,
    spec.highlight ? band(spec.highlight.first, spec.highlight.last, 'k-highlight', null, false) : null,
    xTicks,
    s('line', { class: 'k-axis', x1: LEFT, x2: W - RIGHT, y1: top0 + MAIN_H, y2: top0 + MAIN_H }),
    s('text', { class: 'k-axis-title', x: 12, y: top0 + MAIN_H / 2, transform: `rotate(-90 12 ${top0 + MAIN_H / 2})`, 'text-anchor': 'middle' }, L(spec.yLabel || ['MW', 'MW'])),
    legend, strip);
}
