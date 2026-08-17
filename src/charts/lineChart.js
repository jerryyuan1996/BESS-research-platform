/* Line chart, verbatim from the prototype (lines 406-474).
   series: [{name:[en,zh], color, vals[], dash, step}] over categorical xs.
   null values break the line rather than interpolating. Crosshair + shared tooltip
   snap to the nearest x index. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { S, niceTicks, roundTopRect, roundBotRect, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
// Line chart: series [{name, color, vals[], dash, step}] over categorical xs
function lineChart(parent, cfg){
  const W = 760, H = cfg.h || 250, padL = 58, padR = cfg.padR || 20, padT = 14, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xs = cfg.xs, n = xs.length;
  const all = cfg.series.flatMap(s => s.vals).filter(v => v != null)
    .concat((cfg.refs || []).map(r => r.y));
  let lo = cfg.ymin != null ? cfg.ymin : Math.min(0, ...all), hiv = Math.max(...all);
  const ticks = niceTicks(lo, hiv, 4); lo = ticks[0]; hiv = ticks[ticks.length - 1];
  const X = i => padL + (n === 1 ? plotW / 2 : i * plotW / (n - 1));
  const Y = v => padT + plotH - (v - lo) / (hiv - lo) * plotH;
  const svg = S('svg', { viewBox: `0 0 ${W} ${H}` });
  for (const tv of ticks){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 8, Y(tv) + 3.5, (cfg.yfmt || fmtN)(tv), 'end'));
  }
  svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(lo), y2: Y(lo), stroke: 'var(--baseline)', 'stroke-width': 1 }));
  xs.forEach((x, i) => svg.append(axisText(X(i), H - 10, x)));
  for (const r of (cfg.refs || [])){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(r.y), y2: Y(r.y), stroke: r.color || 'var(--muted)', 'stroke-width': 1.2, 'stroke-dasharray': '2 3' }));
    svg.append(axisText(W - padR, Y(r.y) - 4, L(r.label), 'end', 10));
  }
  const cross = S('line', { y1: padT, y2: padT + plotH, stroke: 'var(--baseline)', 'stroke-width': 1, visibility: 'hidden' });
  svg.append(cross);
  for (const s of cfg.series){
    let d = '', pen = false;
    s.vals.forEach((v, i) => {
      if (v == null){ pen = false; return; }
      d += (pen ? (s.step ? ` L${X(i)},${Y(s.vals[i - 1] != null ? s.vals[i - 1] : v)} L${X(i)},${Y(v)}` : ` L${X(i)},${Y(v)}`) : `${d ? ' M' : 'M'}${X(i)},${Y(v)}`);
      pen = true;
    });
    svg.append(S('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      'stroke-dasharray': s.dash ? '6 4' : 'none' }));
    for (let i = n - 1; i >= 0; i--) if (s.vals[i] != null){
      svg.append(S('circle', { cx: X(i), cy: Y(s.vals[i]), r: 4.5, fill: s.color, stroke: 'var(--surface)', 'stroke-width': 2 }));
      break;
    }
  }
  for (const a of (cfg.ann || [])){
    const s = cfg.series[a.si], v = s.vals[a.i];
    if (v == null) continue;
    svg.append(S('circle', { cx: X(a.i), cy: Y(v), r: 5.5, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.4 }));
    svg.append(axisText(X(a.i), Y(v) - 10, a.text, a.i > n / 2 ? 'end' : 'start', 10.5));
  }
  const ov = S('rect', { x: padL, y: padT, width: plotW, height: plotH, fill: 'transparent' });
  ov.addEventListener('mousemove', ev => {
    const r = svg.getBoundingClientRect(), sx = W / r.width;
    const mx = (ev.clientX - r.left) * sx;
    let bi = 0, bd = 1e9;
    for (let i = 0; i < n; i++){ const dd = Math.abs(X(i) - mx); if (dd < bd){ bd = dd; bi = i; } }
    cross.setAttribute('x1', X(bi)); cross.setAttribute('x2', X(bi)); cross.setAttribute('visibility', 'visible');
    let html = `<b>${xs[bi]}</b>`;
    for (const s of cfg.series){
      const v = s.vals[bi];
      html += `<div class="tr"><span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${s.color};margin-right:5px"></span>${L(s.name)}</span><b>${v == null ? '—' : (cfg.yfmt || fmtN)(v)}</b></div>`;
    }
    tipShow(html, ev);
  });
  ov.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); tipHide(); });
  svg.append(ov);
  const wrap = h('div', { class: 'chart' });
  wrap.append(svg);
  const lg = legendRow(cfg.series); if (lg) wrap.append(lg);
  if (cfg.series.some(s => s.dash)) wrap.append(h('div', { style: 'font-size:10.5px;color:var(--muted);margin-top:3px;' },
    L(['* dashed = illustrative', '* 虚线 = 示例数据'])));
  parent.append(wrap);
  return wrap;
}

export { lineChart };
