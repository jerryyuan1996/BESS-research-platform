/* Fan / band chart, verbatim from the prototype (lines 588-644).
   low/base/high envelopes over categorical xs, with optional confidence zones and an
   'official' marker ring. Used by the WA ten-year BRCP forecast. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { S, niceTicks, roundTopRect, roundBotRect, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
// Fan chart: low/base/high bands over categorical xs, with confidence-zone shading
function bandChart(parent, cfg){
  const W = 760, H = cfg.h || 300, padL = 62, padR = 56, padT = 30, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xs = cfg.xs, n = xs.length;
  const all = cfg.low.concat(cfg.high, cfg.base).filter(v => v != null);
  let lo = Math.min(...all), hiv = Math.max(...all);
  const mrg = (hiv - lo) * 0.12 || 1; lo -= mrg; hiv += mrg;
  const ticks = niceTicks(lo, hiv, 4); lo = ticks[0]; hiv = ticks[ticks.length - 1];
  const X = i => padL + (n === 1 ? plotW / 2 : i * plotW / (n - 1));
  const Y = v => padT + plotH - (v - lo) / (hiv - lo) * plotH;
  const yf = cfg.yfmt || fmtN;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  for (const z of (cfg.zones || [])){
    const x1 = X(Math.max(0, z.from - 0.5)), x2 = X(Math.min(n - 1, z.to + 0.5));
    if (z.from > 0) svg.append(S('rect', { x: x1, y: padT, width: Math.max(0, x2 - x1), height: plotH, fill: 'var(--muted)', opacity: 0.06 }));
    svg.append(axisText((x1 + x2) / 2, padT - 8, L(z.label), 'middle', 'var(--fs-micro)'));
  }
  for (const tv of ticks){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 8, Y(tv) + 3.5, yf(tv), 'end'));
  }
  xs.forEach((x, i) => svg.append(axisText(X(i), H - 12, x, 'middle', 'var(--fs-micro)')));
  const linePath = arr => arr.map((v, i) => (i ? 'L' : 'M') + X(i) + ',' + Y(v)).join(' ');
  let poly = ''; for (let i = 0; i < n; i++) poly += (i ? 'L' : 'M') + X(i) + ',' + Y(cfg.high[i]);
  for (let i = n - 1; i >= 0; i--) poly += 'L' + X(i) + ',' + Y(cfg.low[i]);
  svg.append(S('path', { d: poly + 'Z', fill: cfg.color || 'var(--s1)', opacity: 0.12 }));
  svg.append(S('path', { d: linePath(cfg.high), fill: 'none', stroke: cfg.color || 'var(--s1)', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', opacity: 0.6 }));
  svg.append(S('path', { d: linePath(cfg.low), fill: 'none', stroke: cfg.color || 'var(--s1)', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', opacity: 0.6 }));
  svg.append(S('path', { d: linePath(cfg.base), fill: 'none', stroke: cfg.color || 'var(--s1)', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  if (cfg.official != null){
    svg.append(S('circle', { cx: X(cfg.official.i), cy: Y(cfg.official.y), r: 6, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.6 }));
    svg.append(S('circle', { cx: X(cfg.official.i), cy: Y(cfg.official.y), r: 3, fill: 'var(--ink)' }));
    svg.append(axisText(X(cfg.official.i) + 8, Y(cfg.official.y) - 8, L(['official', '官方']), 'start', 'var(--fs-micro)'));
  }
  const ei = n - 1;
  svg.append(S('circle', { cx: X(ei), cy: Y(cfg.base[ei]), r: 4.5, fill: cfg.color || 'var(--s1)', stroke: 'var(--surface)', 'stroke-width': 2 }));
  svg.append(axisText(W - padR + 4, Y(cfg.base[ei]) + 3.5, yf(cfg.base[ei]), 'start', 'var(--fs-micro)'));
  svg.append(axisText(W - padR + 4, Y(cfg.high[ei]) + 3.5, yf(cfg.high[ei]), 'start', 'var(--fs-micro)'));
  svg.append(axisText(W - padR + 4, Y(cfg.low[ei]) + 3.5, yf(cfg.low[ei]), 'start', 'var(--fs-micro)'));
  const cross = S('line', { y1: padT, y2: padT + plotH, stroke: 'var(--baseline)', 'stroke-width': 1, visibility: 'hidden' });
  svg.append(cross);
  const ov = S('rect', { x: padL, y: padT, width: plotW, height: plotH, fill: 'transparent' });
  ov.addEventListener('mousemove', ev => {
    const r = svg.getBoundingClientRect(), sx = W / r.width, mx = (ev.clientX - r.left) * sx;
    let bi = 0, bd = 1e9; for (let i = 0; i < n; i++){ const dd = Math.abs(X(i) - mx); if (dd < bd){ bd = dd; bi = i; } }
    cross.setAttribute('x1', X(bi)); cross.setAttribute('x2', X(bi)); cross.setAttribute('visibility', 'visible');
    let html = `<b>${xs[bi]}</b>`;
    html += `<div class="tr"><span>${L(['High', '高'])}</span><b>${yf(cfg.high[bi])}</b></div>`;
    html += `<div class="tr"><span>${L(['Base', '基准'])}</span><b>${yf(cfg.base[bi])}</b></div>`;
    html += `<div class="tr"><span>${L(['Low', '低'])}</span><b>${yf(cfg.low[bi])}</b></div>`;
    tipShow(html, ev);
  });
  ov.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); tipHide(); });
  svg.append(ov);
  const wrap = h('div', { class: 'chart' }); wrap.append(svg); parent.append(wrap); return wrap;
}

export { bandChart };
