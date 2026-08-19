/* Waterfall chart, verbatim from the prototype (lines 548-586).
   steps: [{l:[en,zh], v, t:'start'|'d'|'total'}]. Deltas are green when positive and
   red when negative; start/total bars use the primary series colour. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { S, niceTicks, roundTopRect, roundBotRect, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
// Waterfall: steps [{l:[en,zh], v, t:'start'|'d'|'total'}]
function waterfall(parent, cfg){
  const W = 760, H = cfg.h || 270, padL = 62, padR = 16, padT = 16, padB = 64;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const steps = cfg.steps; const n = steps.length;
  let cum = 0; const bars = [];
  for (const st of steps){
    if (st.t === 'start' || st.t === 'total'){ bars.push({ ...st, from: cfg.zeroBase ? 0 : Math.min(0, st.v), to: st.v }); cum = st.v; }
    else { bars.push({ ...st, from: cum, to: cum + st.v }); cum += st.v; }
  }
  let lo = Math.min(...bars.map(b => Math.min(b.from, b.to))), hiv = Math.max(...bars.map(b => Math.max(b.from, b.to)));
  if (cfg.floor != null) lo = cfg.floor;
  const ticks = niceTicks(lo, hiv * 1.02, 4); lo = ticks[0]; hiv = ticks[ticks.length - 1];
  const Y = v => padT + plotH - (v - lo) / (hiv - lo) * plotH;
  const band = plotW / n, bw = Math.min(30, band - 18);
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  for (const tv of ticks){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 8, Y(tv) + 3.5, (cfg.yfmt || fmtN)(tv), 'end'));
  }
  bars.forEach((b, i) => {
    const x0 = padL + band * (i + 0.5) - bw / 2;
    const yTop = Y(Math.max(b.from, b.to)), yBot = Y(Math.max(Math.min(b.from, b.to), lo));
    const color = b.t === 'd' ? (b.v >= 0 ? 'var(--s2)' : 'var(--s6)') : 'var(--s1)';
    const bar = S('path', { d: roundTopRect(x0, yTop, bw, Math.max(2, yBot - yTop), 4), fill: color });
    bar.addEventListener('mousemove', ev => tipShow(`<b>${L(b.l)}</b><div class="tr"><span></span><b>${(b.t === 'd' && b.v > 0 ? '+' : '') + (cfg.yfmt || fmtN)(b.v)}</b></div>`, ev));
    bar.addEventListener('mouseleave', tipHide);
    svg.append(bar);
    svg.append(axisText(x0 + bw / 2, yTop - 5, (b.t === 'd' && b.v > 0 ? '+' : '') + (cfg.yfmt || fmtN)(b.v), 'middle', 'var(--fs-micro)'));
    if (i < n - 1)
      svg.append(S('line', { x1: x0 + bw, x2: padL + band * (i + 1.5) - bw / 2, y1: Y(b.to), y2: Y(b.to), stroke: 'var(--baseline)', 'stroke-width': 1 }));
    svg.append(axisText(padL + band * (i + 0.5) + 4, H - padB + 14, L(b.l), 'end', 'var(--fs-micro)', -30));
  });
  svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(Math.max(0, lo)), y2: Y(Math.max(0, lo)), stroke: 'var(--baseline)', 'stroke-width': 1 }));
  const wrap = h('div', { class: 'chart' });
  wrap.append(svg);
  parent.append(wrap);
  return wrap;
}

export { waterfall };
