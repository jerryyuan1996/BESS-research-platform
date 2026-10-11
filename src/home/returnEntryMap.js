/* ---------------------------------------------------------------------------
   The return-by-entry map — the home page's one chart.

   Return on the vertical axis, the chosen investor's Entry pillar on the
   horizontal one, a verdict's shape at each point. It is the picture of the
   plan's diagnosis (section 2.2): the richest markets are not the open ones,
   so a ranking by return runs against where capital can actually go.

   ONE POINT PER MARKET, AND NONE IS LEFT OFF FOR WANT OF AN AXIS.

     - A market with grades and a return sits in the plot.
     - A market that has not been graded has a return and no Entry score. It
       goes in the column on the right, at its return, with an open dashed
       mark. Placing it anywhere along the horizontal axis would be a guess.
     - A market whose return the engine does not price (Finland) has an Entry
       score and no return. It goes in the band along the bottom, at its Entry
       score. Placing it at zero would say it returns nothing.

   The whisker runs from the base case to the bull case. The bull cases are
   range extremes and several run past 50%, so the axis is scaled to the base
   cases and a whisker that runs off the top ends in an arrow; its figure is in
   the tooltip.

   With no investor chosen the four investors' Entry scores for a market are
   drawn on one line, each with that investor's verdict: the width of the line
   is how differently the same market reads to them.

   Drawn with the shared chart primitives rather than scatterChart, which draws
   circles only and has no second channel for the verdict.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { S, niceTicks, axisText } from '../charts/index.js';
import { tipShow, tipHide } from '../components/tooltip.js';
import { PILLAR_LABEL, VERDICT_IDS, VERDICT_LABEL, ARCHETYPE_IDS } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { returnKeyFor } from './boardModel.js';
import { verdictShape, verdictGlyph } from './verdictGlyph.js';

const W = 760, H = 410;
const PAD_L = 54, PAD_T = 30, PAD_R = 8;
const GUTTER_W = 150, GUTTER_GAP = 16;
const BAND_H = 38, PAD_B = 44;

const pct = (v) => (v === null ? 'N/M' : (v * 100).toFixed(1) + '%');
const row = (label, value) => `<div class="tr"><span>${label}</span><b>${value}</b></div>`;

function hover(node, html, plain){
  node.addEventListener('mousemove', ev => tipShow(html, ev));
  node.addEventListener('mouseleave', tipHide);
  const title = S('title'); title.textContent = plain; node.append(title);
  return node;
}

/**
 * @param parent  where the chart goes
 * @param board   the result of buildBoard
 */
export function renderReturnEntryMap(parent, board){
  const lens = board.lens;
  const key = returnKeyFor(lens);
  const returnLabel = key === 'hold'
    ? ['Hold IRR, base case', '持有期IRR（基准情景）']
    : [`Exit IRR at year ${board.exitYear}, base case`, `第${board.exitYear}年退出IRR（基准情景）`];

  const plotX0 = PAD_L, plotX1 = W - PAD_R - GUTTER_W - GUTTER_GAP;
  const plotY0 = PAD_T, plotY1 = H - PAD_B - BAND_H;
  const gutterX = plotX1 + GUTTER_GAP;

  /* What each market has to be placed with. */
  const items = board.rows.map(r => {
    const base = r.ret.withheld ? null : r.ret[key].base;
    const bull = r.ret.withheld ? null : r.ret[key].bull;
    const marks = !r.graded ? []
      : (lens ? [lens] : ARCHETYPE_IDS).map(id => ({ id, entry: r.cells[id].pillars.entry, call: r.cells[id].call }))
          .filter(m => m.entry !== null);
    return { r, name: L(r.market.manifest.shortName), full: L(r.market.manifest.name), base, bull, marks };
  });

  const bases = items.map(i => i.base).filter(v => v !== null).map(v => v * 100);
  const lo = Math.min(0, ...bases), hi = Math.max(5, ...bases);
  const ticks = niceTicks(lo, hi + (hi - lo) * 0.12, 5);
  const yLo = ticks[0], yHi = ticks[ticks.length - 1];
  const X = (v) => plotX0 + (v / 100) * (plotX1 - plotX0);
  const Y = (v) => plotY1 - (v - yLo) / (yHi - yLo) * (plotY1 - plotY0);

  const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': L(['Return against ease of entry, one point per market', '回报与进入难易程度对照图，每个市场一个点']) });

  /* ---- frame ---- */
  for (const t of ticks){
    svg.append(S('line', { x1: plotX0, x2: W - PAD_R, y1: Y(t), y2: Y(t), stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(plotX0 - 8, Y(t) + 3.5, t.toFixed(0) + '%', 'end'));
  }
  for (const t of [0, 25, 50, 75, 100]){
    svg.append(S('line', { x1: X(t), x2: X(t), y1: plotY0, y2: plotY1 + BAND_H, stroke: 'var(--grid)', 'stroke-width': 1 }));
    svg.append(axisText(X(t), plotY1 + BAND_H + 14, String(t)));
  }
  svg.append(axisText(plotX0, 14, L(returnLabel), 'start'));
  svg.append(axisText((plotX0 + plotX1) / 2, H - 6,
    lens
      ? L([`${PILLAR_LABEL.entry[0]} pillar as the ${ARCHETYPES[lens].label[0].toLowerCase()} reads it — higher is easier to enter`,
           `${ARCHETYPES[lens].label[1]}眼中的“${PILLAR_LABEL.entry[1]}”支柱 — 越高越容易进入`])
      : L([`${PILLAR_LABEL.entry[0]} pillar, one mark per investor — higher is easier to enter`,
           `“${PILLAR_LABEL.entry[1]}”支柱，每类投资者一个标记 — 越高越容易进入`]),
    'middle'));

  /* The band for markets with no priced return, and the column for markets
     with no Entry score. Both are set apart by a rule and named. */
  svg.append(S('line', { x1: plotX0, x2: plotX1, y1: plotY1, y2: plotY1, stroke: 'var(--border)', 'stroke-width': 1 }));
  svg.append(axisText(plotX0 - 8, plotY1 + BAND_H / 2 + 3.5, L(['withheld', '暂不披露']), 'end'));
  svg.append(S('line', { x1: gutterX - GUTTER_GAP / 2, x2: gutterX - GUTTER_GAP / 2, y1: plotY0 - 14, y2: plotY1 + BAND_H,
    stroke: 'var(--border)', 'stroke-width': 1, 'stroke-dasharray': '4 3' }));
  svg.append(axisText(gutterX, 14, L(['Not yet graded — no Entry score', '尚未评级 — 无进入评分']), 'start'));

  const tipFor = (item, extra = '') => `<b>${item.full}</b>${extra}`
    + (item.r.ret.withheld
      ? row(L(['Return', '回报']), L(['withheld', '暂不披露']))
      : row(L(returnLabel), pct(item.base)) + row(L(['Bull case', '乐观情景']), pct(item.bull)));

  const unplaced = [];

  /* ---- graded markets ---- */
  for (const item of items.filter(i => i.r.graded)){
    if (!item.marks.length){ unplaced.push(item.name); continue; }
    const inBand = item.base === null;
    const cy = inBand ? plotY1 + BAND_H / 2 : Y(item.base * 100);
    const xs = item.marks.map(m => X(m.entry));

    if (!inBand && item.bull !== null){
      /* Base to bull, clipped at the top of the axis with an arrow. */
      const cx = lens ? xs[0] : (Math.min(...xs) + Math.max(...xs)) / 2;
      const top = Math.max(plotY0, Y(item.bull * 100));
      const clipped = item.bull * 100 > yHi;
      svg.append(S('line', { x1: cx, x2: cx, y1: cy, y2: top, stroke: 'var(--ink2)', 'stroke-width': 1.4 }));
      svg.append(clipped
        ? S('path', { d: `M${cx - 4},${top + 6} L${cx},${top} L${cx + 4},${top + 6}`, fill: 'none', stroke: 'var(--ink2)', 'stroke-width': 1.4 })
        : S('line', { x1: cx - 4, x2: cx + 4, y1: top, y2: top, stroke: 'var(--ink2)', 'stroke-width': 1.4 }));
    }
    if (xs.length > 1){
      svg.append(S('line', { x1: Math.min(...xs), x2: Math.max(...xs), y1: cy, y2: cy, stroke: 'var(--ink2)', 'stroke-width': 1.2 }));
    }
    for (const m of item.marks){
      const arch = ARCHETYPES[m.id];
      const verdict = m.call ? L(VERDICT_LABEL[m.call]) : L(['No verdict set', '尚未设定结论']);
      const html = tipFor(item,
        row(L(arch.label), verdict) + row(L(PILLAR_LABEL.entry), m.entry.toFixed(0) + ' / 100'));
      svg.append(hover(verdictShape(m.call, X(m.entry), cy, 7), html,
        `${item.full} · ${L(arch.label)} · ${verdict}`));
    }
    const right = Math.max(...xs);
    const flip = right > plotX0 + (plotX1 - plotX0) * 0.86;
    const label = axisText(flip ? Math.min(...xs) - 11 : right + 11, cy + 4, item.name, flip ? 'end' : 'start', 'var(--fs-2xs)');
    label.setAttribute('fill', 'var(--ink)');
    svg.append(label);
  }

  /* ---- markets not yet graded: at their return, in the column ---- */
  const column = items.filter(i => !i.r.graded && i.base !== null)
    .map(i => ({ item: i, cy: Y(i.base * 100) }))
    .sort((a, b) => a.cy - b.cy);
  for (const i of items.filter(i => !i.r.graded && i.base === null)) unplaced.push(i.name);

  /* Several sit within a point of each other, so labels are spaced apart and
     tied back to their marks rather than printed on top of one another. */
  const STEP = 12;
  let labelY = -Infinity;
  const labels = column.map(c => (labelY = Math.max(c.cy, labelY + STEP)));
  const overflow = labels.length ? labels[labels.length - 1] - (plotY1 - 2) : 0;
  if (overflow > 0){
    for (let i = labels.length - 1, floor = plotY1 - 2; i >= 0; i--, floor -= STEP) labels[i] = Math.min(labels[i], floor);
  }
  column.forEach((c, i) => {
    const cx = gutterX + 10, ly = labels[i];
    if (Math.abs(ly - c.cy) > 1){
      svg.append(S('line', { x1: cx + 6, x2: cx + 20, y1: c.cy, y2: ly, stroke: 'var(--border)', 'stroke-width': 1 }));
    }
    svg.append(hover(verdictShape(null, cx, c.cy, 6),
      tipFor(c.item, row(L(['Verdict', '结论']), L(['Not yet graded', '尚未评级']))),
      `${c.item.full} · ${L(['Not yet graded', '尚未评级'])} · ${pct(c.item.base)}`));
    const label = axisText(cx + 22, ly + 3.5, c.item.name + ' ' + pct(c.item.base), 'start', 'var(--fs-micro)');
    svg.append(label);
  });

  parent.append(h('div', { class: 'chart rem-chart' }, svg));

  /* ---- legend: every verdict, shape and word ---- */
  parent.append(h('div', { class: 'legend rem-legend' },
    VERDICT_IDS.map(call => h('span', { class: 'li' }, verdictGlyph(call, 14), L(VERDICT_LABEL[call]))),
    h('span', { class: 'li' }, verdictGlyph(null, 14), L(['Not yet graded', '尚未评级'])),
    h('span', { class: 'li' }, L(['│ base case to bull case', '│ 基准情景至乐观情景']))));

  if (unplaced.length){
    parent.append(h('div', { class: 'cap' },
      L(['Not drawn, having neither a priced return nor an Entry score: ', '既无测算回报也无进入评分，故未绘出：']) + unplaced.join(', ')));
  }
}
