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
  const W = 760, H = cfg.h || 320, padL = 62, padR = 26, padT = 20, padB = 46;
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
  /* Pad the y-domain by a fraction of its RANGE, not by scaling the endpoints.
     Scaling breaks the moment a value is negative — min × 0.85 moves −10 up to
     −8.5, putting the lowest point below the axis — and plotting several routes
     per market is exactly what puts a negative exit IRR on this chart. */
  const yLo = Math.min(...ys), yHi = Math.max(...ys);
  const yPad = (yHi - yLo) * 0.12 || Math.abs(yHi) * 0.1 || 1;
  const requestedYLo = cfg.ymin != null ? cfg.ymin : yLo - yPad;
  const requestedYHi = cfg.ymax != null ? cfg.ymax : yHi + yPad;
  const yt0 = niceTicks(requestedYLo, requestedYHi, 4);
  const yt = (() => {
    let ticks = yt0;
    if (cfg.ymin != null){
      ticks = ticks.filter(v => v >= cfg.ymin);
      if (ticks[0] !== cfg.ymin) ticks.unshift(cfg.ymin);
    }
    if (cfg.ymax != null){
      ticks = ticks.filter(v => v <= cfg.ymax);
      if (ticks[ticks.length - 1] !== cfg.ymax) ticks.push(cfg.ymax);
    }
    return ticks;
  })();
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
  /* Hollow points are drawn first so a filled one is never hidden behind an
     alternative route sitting at nearly the same coordinates. */
  const ordered = [...cfg.pts].sort((a, b) => (a.hollow ? 0 : 1) - (b.hollow ? 0 : 1));

  /* Points that land on the same pixel are drawn ONCE, with a count.

     The clamp below is what makes this necessary. Every route with a negative
     exit IRR is pinned to the 0% boundary, and every merchant route has a
     secured share of exactly zero — so thirteen of the thirty-four routes on the
     home page resolve to the same coordinate. Drawing them individually stacks
     thirteen circles in one place: the caption promises that no market
     disappears, and twelve of them had. A counted marker says how many are
     there and hands the reader all of them on hover. */
  const positioned = ordered.map(p => ({
    p,
    // clamp guards against a point escaping the plot if a domain is ever mis-sized
    cx: Math.max(padL, Math.min(W - padR, X(p.x))),
    cy: Math.max(padT, Math.min(padT + plotH, Y(p.y))),
  }));

  const stacks = new Map();
  for (const item of positioned){
    const key = `${Math.round(item.cx)},${Math.round(item.cy)}`;
    const stack = stacks.get(key);
    if (stack) stack.push(item);
    else stacks.set(key, [item]);
  }

  for (const stack of stacks.values()){
    if (stack.length > 1){
      drawStack(stack);
      continue;
    }
    const { p, cx, cy } = stack[0];
    /* Filled = the market's base route, the one every other section of the page
       reports. Hollow = an alternative route available in that market. Same
       colour, because they are the same market seen through a different
       contract. */
    const c = p.clippedLow
      ? S('circle', { cx, cy, r: 6, fill: 'var(--surface)', stroke: p.color,
        'stroke-width': 2.4, 'stroke-dasharray':'3 2' })
      : p.hollow ? S('circle', { cx, cy, r: 6, fill: 'var(--surface)', stroke: p.color, 'stroke-width': 2.4 })
        : S('circle', { cx, cy, r: 7, fill: p.color, stroke: 'var(--surface)', 'stroke-width': 2 });
    c.addEventListener('mousemove', ev => tipShow(p.tip, ev));
    c.addEventListener('mouseleave', tipHide);
    svg.append(c);
    // Only labelled points get text; with several routes per market, labelling
    // all of them would produce a chart of overlapping strings.
    if (p.label){
      // flip the label inward when the point sits near the right edge
      const right = cx > padL + plotW * 0.82;
      svg.append(axisText(cx + (right ? -11 : 11), cy + 4, p.label, right ? 'end' : 'start', 11));
    }
  }

  /** One marker for every point sharing a pixel, carrying the count. */
  function drawStack(stack){
    const { cx, cy } = stack[0];
    const points = stack.map(item => item.p);
    /* Dashed only when EVERY member was clipped. A stack that mixes a clipped
       route with a real one is not a "below 0%" marker and must not be drawn as
       though it were. */
    const allClipped = points.every(p => p.clippedLow);
    const r = 9;

    const node = S('circle', {
      cx, cy, r,
      fill: 'var(--surface)',
      stroke: 'var(--ink2)',
      'stroke-width': 2.2,
      ...(allClipped ? { 'stroke-dasharray': '3 2' } : {}),
    });

    /* The tooltip carries all of them, so nothing is reachable only by guessing
       which circle is on top. It uses each point's ONE-LINE form rather than its
       full block: thirteen six-row blocks would be several screens tall, and a
       tooltip is pointer-events:none so a reader cannot scroll it. A point that
       declares no short form falls back to its full one — correct for the small
       stacks, where there is room. */
    const heading = '<b>' + points.length + L([' routes at this point', ' 条路径重合于此']) + '</b>'
      + (allClipped ? '<div class="tr"><span>' + L(['All below 0% exit IRR', '退出IRR均低于0%'])
        + '</span></div>' : '');
    const compact = points.every(p => p.short);
    const tip = heading + (compact
      ? '<div class="tip-stack">' + points.map(p => '<div>' + p.short + '</div>').join('') + '</div>'
      : points.map(p => p.tip).join('<hr class="tip-rule">'));
    node.addEventListener('mousemove', ev => tipShow(tip, ev));
    node.addEventListener('mouseleave', tipHide);
    svg.append(node);

    const count = axisText(cx, cy + 3.5, String(points.length), 'middle', 10);
    count.setAttribute('class', 'scatter-stack-count');
    count.setAttribute('pointer-events', 'none');
    svg.append(count);

    /* Labels of the stacked markets, listed beside the marker rather than each
       drawn at the same coordinate — which is what made them illegible. */
    const labels = points.map(p => p.label).filter(Boolean);
    if (labels.length){
      const right = cx > padL + plotW * 0.82;
      svg.append(axisText(cx + (right ? -14 : 14), cy + 4,
        labels.join(', '), right ? 'end' : 'start', 10.5));
    }
  }

  const wrap = h('div', { class: 'chart' }); wrap.append(svg); parent.append(wrap);
}

export { scatterChart };
