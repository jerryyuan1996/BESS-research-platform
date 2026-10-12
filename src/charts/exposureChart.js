/* Exposure curve: a step line of capital at risk over months from site control.

   Not in the barrel on purpose. Only the Entry tab draws it, and an export
   from index.js would put it in the chart chunk every market visit fetches.

   Takes curves already computed by src/entry/exposureCurve.js and decides
   nothing: where a step falls, and whether a stretch is a lower bound, are the
   curve's. The first curve is the market the page belongs to and gets the
   markers, the fast-to-slow bands and the decision; the others are drawn thin
   on the same axes for comparison.

   A lower-bound stretch is dashed. Markers are numbered and the page's table
   carries what each one is, because how a security is lost is a sentence and
   a sentence does not fit beside a point. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { S, niceTicks, legendRow } from './chartUtils.js';
import { axisText } from './axes.js';
import { markers } from '../entry/exposureCurve.js';

const kUSD = (v) => v >= 1000 ? Math.round(v / 1000) + 'k' : String(Math.round(v));

/**
 * @param parent  where the chart goes
 * @param cfg     { curves: [{ curve, name, color }], narrow }
 */
function exposureChart(parent, cfg){
  const narrow = !!cfg.narrow;
  const W = narrow ? 380 : 760, H = narrow ? 280 : 320;
  const padL = narrow ? 40 : 52, padR = 14, padT = 30, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const [own, ...others] = cfg.curves;

  const xMax = Math.ceil(Math.max(...cfg.curves.map(c => c.curve.firstRevenue.slow)) / 12) * 12;
  const ticks = niceTicks(0, Math.max(...cfg.curves.map(c => c.curve.peak.usdPerMW), 1) * 1.12, 4);
  const yMax = ticks[ticks.length - 1];
  const X = m => padL + m / xMax * plotW;
  const Y = v => padT + plotH - v / yMax * plotH;

  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': L(['Capital at risk by month from site control', '自取得场址起各月的风险资本']) });
  for (const tv of ticks){
    svg.append(S('line', { x1: padL, x2: W - padR, y1: Y(tv), y2: Y(tv), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(padL - 6, Y(tv) + 3.5, kUSD(tv), 'end'));
  }
  for (let m = 0; m <= xMax; m += xMax > 48 && narrow ? 24 : 12) svg.append(axisText(X(m), padT + plotH + 14, String(m)));
  svg.append(axisText(padL + plotW / 2, H - 6, L(['Months from site control', '自取得场址起的月数'])));
  svg.append(axisText(padL - (narrow ? 34 : 46), padT - 14, L(['USD per MW', '美元/MW']), 'start'));

  /* The decision and first revenue, each as wide as its stated range. */
  const d = own.curve.decision, r = own.curve.firstRevenue;
  for (const [range, label] of [[d, ['Decision', '投资决策']], [r, ['First revenue', '首笔收入']]]){
    svg.append(S('rect', { x: X(range.fast), y: padT, width: Math.max(1, X(range.slow) - X(range.fast)), height: plotH, fill: 'var(--muted)', opacity: 0.14 }));
    svg.append(axisText(X(range.slow), padT - 5, L(label), 'end'));
  }

  const draw = ({ curve, color }, mine) => {
    const line = (x1, y1, x2, y2, dashed) => svg.append(S('line', {
      x1, y1, x2, y2, stroke: color, 'stroke-width': mine ? 2.2 : 1.4, 'stroke-linecap': 'round',
      ...(dashed ? { 'stroke-dasharray': mine ? '6 5' : '4 4' } : {}), ...(mine ? {} : { opacity: 0.75 }),
    }));
    let x = X(0), dashed = false;
    for (const e of curve.events){
      const ex = X(e.month.central);
      /* The band a step can fall in, between the fast case and the slow one. */
      if (mine && e.before !== e.after){
        svg.append(S('rect', { x: X(e.month.fast), y: Y(Math.max(e.before, e.after)), width: Math.max(1, X(e.month.slow) - X(e.month.fast)),
          height: Math.abs(Y(e.before) - Y(e.after)), fill: color, opacity: 0.14 }));
      }
      line(x, Y(e.before), ex, Y(e.before), dashed);
      line(ex, Y(e.before), ex, Y(e.after), dashed || e.lowerBound);
      x = ex; dashed = e.lowerBound;
    }
    line(x, Y(curve.end), X(curve.firstRevenue.central), Y(curve.end), dashed);
  };
  for (const other of others) draw(other, false);
  draw(own, true);

  for (const m of markers(own.curve)){
    const cx = X(m.month.central), cy = Y(m.after);
    svg.append(S('circle', { cx, cy, r: 8, fill: own.color, stroke: 'var(--surface)', 'stroke-width': 1.5 }));
    const t = axisText(cx, cy + 3.5, String(m.n));
    t.setAttribute('fill', 'var(--surface)'); t.style.fontWeight = '700';
    svg.append(t);
  }

  const wrap = h('div', { class: 'chart' }); wrap.append(svg);
  const legend = legendRow(cfg.curves.map(c => ({ name: c.name, color: c.color })));
  if (legend) wrap.append(legend);
  parent.append(wrap); return wrap;
}

export { exposureChart };
