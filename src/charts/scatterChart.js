/* Scatter chart, verbatim from the prototype (lines 839-872).
   Home-cockpit only in the prototype; now a shared primitive available to any market.
   Points carry pre-rendered tooltip HTML. Labels flip inward near the right edge and
   coordinates are clamped to the plot box. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { S, niceTicks, roundTopRect, roundBotRect, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
// ---------------- scatter (hub-only chart) ----------------
function scatterChart(parent, cfg){
  const W = 760, H = 320, padL = 62, padR = 26, padT = 20, padB = 46;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xs = cfg.pts.map(p => p.x), ys = cfg.pts.map(p => p.y);
  /* `xmax` is a hard ceiling, not a hint. niceTicks rounds the requested top up
     to a round number, which is right for an open-ended quantity and wrong for a
     share: a set whose largest point is 100% would otherwise be plotted on an
     axis running to 150%, implying headroom that cannot exist. */
  const xt0 = niceTicks(cfg.xmin != null ? cfg.xmin : Math.min(0, ...xs),
    cfg.xmax != null ? cfg.xmax : Math.max(...xs) * 1.1, 4);
  const xt = cfg.xmax == null ? xt0 : (() => {
    const kept = xt0.filter(v => v <= cfg.xmax);
    if (kept[kept.length - 1] !== cfg.xmax) kept.push(cfg.xmax);
    return kept;
  })();
  const yt = niceTicks(Math.min(...ys) * 0.85, Math.max(...ys) * 1.1, 4);
  const xlo = xt[0], xhi = xt[xt.length - 1], ylo = yt[0], yhi = yt[yt.length - 1];
  const X = v => padL + (v - xlo) / (xhi - xlo) * plotW;
  const Y = v => padT + plotH - (v - ylo) / (yhi - ylo) * plotH;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  for (const tv of yt){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 8, Y(tv) + 3.5, (cfg.yfmt || fmtN)(tv), 'end'));
  }
  for (const tv of xt){
    svg.append(S('line', { y1: padT, y2: padT + plotH, x1: X(tv), x2: X(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(X(tv), H - 26, (cfg.xfmt || fmtN)(tv)));
  }
  svg.append(axisText(padL + plotW / 2, H - 8, L(cfg.xlabel), 'middle', 10.5));
  for (const p of cfg.pts){
    // clamp guards against a point escaping the plot if a domain is ever mis-sized
    const cx = Math.max(padL, Math.min(W - padR, X(p.x)));
    const cy = Math.max(padT, Math.min(padT + plotH, Y(p.y)));
    const c = S('circle', { cx, cy, r: 7, fill: p.color, stroke: 'var(--surface)', 'stroke-width': 2 });
    c.addEventListener('mousemove', ev => tipShow(p.tip, ev));
    c.addEventListener('mouseleave', tipHide);
    svg.append(c);
    // flip the label inward when the point sits near the right edge
    const right = cx > padL + plotW * 0.82;
    svg.append(axisText(cx + (right ? -11 : 11), cy + 4, p.label, right ? 'end' : 'start', 11));
  }
  const wrap = h('div', { class: 'chart' }); wrap.append(svg); parent.append(wrap);
}

export { scatterChart };
