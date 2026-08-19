/* Bar chart, verbatim from the prototype (lines 476-546).
   mode 'group' | 'stack'. Negative-aware domain: bars grow up from the zero baseline
   for positives and down for negatives (roundBotRect). */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { S, niceTicks, roundTopRect, roundBotRect, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
// Bar chart: mode 'group' | 'stack'; series [{name, color, vals[]}]
function barChart(parent, cfg){
  const W = 760, H = cfg.h || 250, padL = 58, padR = 16, padT = 14, padB = cfg.rotX ? 66 : 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xs = cfg.xs, n = xs.length, mode = cfg.mode || 'group';
  const sums = mode === 'stack'
    ? xs.map((_, i) => cfg.series.reduce((a, s) => a + (s.vals[i] || 0), 0))
    : cfg.series.flatMap(s => s.vals);
  const refYs = (cfg.refs || []).map(r => r.y);
  const hiv0 = Math.max(...sums, ...refYs, 1);
  // Negative-aware domain. For all-positive data lo0 is 0 and the axis is identical to
  // the WA v3 behaviour; series containing negatives (e.g. year-on-year declines) would
  // otherwise be drawn far below the plot and clipped by the viewBox.
  const lo0 = Math.min(0, ...sums, ...refYs);
  const ticks = niceTicks(lo0 === 0 ? 0 : lo0 * 1.05, hiv0 * 1.05, 4);
  const lo = ticks[0], hiv = ticks[ticks.length - 1];
  const Y = v => padT + plotH - (v - lo) / (hiv - lo) * plotH;
  const band = plotW / n;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  for (const tv of ticks){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 8, Y(tv) + 3.5, (cfg.yfmt || fmtN)(tv), 'end'));
  }
  xs.forEach((x, i) => {
    const cx = padL + band * (i + 0.5);
    svg.append(cfg.rotX ? axisText(cx, H - padB + 14, x, 'end', 'var(--fs-micro)', -30) : axisText(cx, H - 10, x));
  });
  const addBarTip = (r, name, val, cat) => {
    r.addEventListener('mousemove', ev => tipShow(`<b>${cat}</b><div class="tr"><span>${name}</span><b>${(cfg.yfmt || fmtN)(val)}</b></div>`, ev));
    r.addEventListener('mouseleave', tipHide);
  };
  xs.forEach((x, i) => {
    if (mode === 'stack'){
      const bw = Math.min(cfg.bw || 24, band - 16); let acc = 0;
      const nz = cfg.series.filter(s => (s.vals[i] || 0) > 0);
      nz.forEach((s, si) => {
        const v = s.vals[i] || 0, y1 = Y(acc + v), y0 = Y(acc);
        const gap = si < nz.length - 1 ? 2 : 0;
        const x0 = padL + band * (i + 0.5) - bw / 2;
        const topSeg = si === nz.length - 1;
        const seg = topSeg
          ? S('path', { d: roundTopRect(x0, y1, bw, Math.max(1, y0 - y1 - gap), 4), fill: s.color })
          : S('rect', { x: x0, y: y1 + gap, width: bw, height: Math.max(1, y0 - y1 - gap), fill: s.color });
        addBarTip(seg, L(s.name), v, x); svg.append(seg);
        acc += v;
      });
    } else {
      const m = cfg.series.length, bw = Math.min(24, (band - 14 - 2 * (m - 1)) / m);
      const grpW = bw * m + 2 * (m - 1), x0g = padL + band * (i + 0.5) - grpW / 2;
      cfg.series.forEach((s, si) => {
        const v = s.vals[i] || 0, x0 = x0g + si * (bw + 2);
        // grow up from the zero baseline for positives, down for negatives
        const yTop = Math.min(Y(0), Y(v)), hgt = Math.max(0.5, Math.abs(Y(0) - Y(v)));
        const bar = S('path', { d: v < 0 ? roundBotRect(x0, yTop, bw, hgt, 4) : roundTopRect(x0, yTop, bw, hgt, 4), fill: s.color });
        addBarTip(bar, L(s.name), v, x); svg.append(bar);
        if (cfg.labels && m === 1)
          svg.append(axisText(x0 + bw / 2, v < 0 ? yTop + hgt + 12 : yTop - 5, (cfg.yfmt || fmtN)(v), 'middle', 'var(--fs-micro)'));
      });
    }
  });
  svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(0), y2: Y(0), stroke: 'var(--baseline)', 'stroke-width': 1 }));
  for (const r of (cfg.refs || [])){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(r.y), y2: Y(r.y), stroke: r.color || 'var(--muted)', 'stroke-width': 1.2, 'stroke-dasharray': '2 3' }));
    svg.append(axisText(W - padR, Y(r.y) - 4, L(r.label), 'end', 'var(--fs-micro)'));
  }
  const wrap = h('div', { class: 'chart' });
  wrap.append(svg);
  const lg = legendRow(cfg.series.map(s => ({ ...s, type: 'bar' }))); if (lg) wrap.append(lg);
  parent.append(wrap);
  return wrap;
}

export { barChart };
