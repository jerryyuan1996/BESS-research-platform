/* ---------------------------------------------------------------------------
   A verdict's mark — shape first, colour second.

   Six verdicts cannot rest on six colours (plan section 6.6): two of them are
   green, and a reader who cannot tell red from green must still be able to run
   an eye down fifteen rows. So each verdict has its own SHAPE, the word is
   always printed beside it, and colour only repeats what the shape already
   said.

       enter now        filled circle      the bar is cleared
       build position   filled triangle    pointing at something still to do
       opportunistic    filled diamond     a specific situation
       wait             open circle        nothing committed
       avoid            cross              a mismatch
       not accessible   barred square      a door that is shut

   "Avoid" and "not accessible" are deliberately unlike each other: they are
   different statements, and investability.js says a page must keep them apart.

   One function draws the shape at a point, so the board's row and the map's
   marker are the same drawing.
   --------------------------------------------------------------------------- */
import { S } from '../charts/index.js';
import { VERDICT } from '../governance/investability.js';

const COLOR = {
  [VERDICT.ENTER_NOW]: 'var(--good)',
  [VERDICT.BUILD_POSITION]: 'var(--good)',
  [VERDICT.OPPORTUNISTIC]: 'var(--s1)',
  [VERDICT.WAIT]: 'var(--warn)',
  [VERDICT.AVOID]: 'var(--critical)',
  [VERDICT.NOT_ACCESSIBLE]: 'var(--serious)',
};

export const verdictColor = (call) => COLOR[call] || 'var(--muted)';

/**
 * The shape for a verdict, centred on (cx, cy), as an SVG group.
 * An unknown or absent call draws a dashed open circle: "nothing set".
 */
export function verdictShape(call, cx, cy, r = 6){
  const g = S('g', { class: 'verdict-shape' });
  const color = verdictColor(call);
  const filled = { fill: color, stroke: 'var(--surface)', 'stroke-width': 1.2 };
  const open = { fill: 'var(--surface)', stroke: color, 'stroke-width': 2 };

  if (call === VERDICT.ENTER_NOW){
    g.append(S('circle', { cx, cy, r, ...filled }));
  } else if (call === VERDICT.BUILD_POSITION){
    const k = r * 1.15;
    g.append(S('path', { d: `M${cx},${cy - k} L${cx + k},${cy + k * 0.8} L${cx - k},${cy + k * 0.8} Z`, ...filled }));
  } else if (call === VERDICT.OPPORTUNISTIC){
    const k = r * 1.2;
    g.append(S('path', { d: `M${cx},${cy - k} L${cx + k},${cy} L${cx},${cy + k} L${cx - k},${cy} Z`, ...filled }));
  } else if (call === VERDICT.WAIT){
    g.append(S('circle', { cx, cy, r: r - 1, ...open }));
  } else if (call === VERDICT.AVOID){
    const k = r * 0.8;
    g.append(S('path', {
      d: `M${cx - k},${cy - k} L${cx + k},${cy + k} M${cx + k},${cy - k} L${cx - k},${cy + k}`,
      fill: 'none', stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round',
    }));
  } else if (call === VERDICT.NOT_ACCESSIBLE){
    const k = r * 0.9;
    g.append(S('rect', { x: cx - k, y: cy - k, width: k * 2, height: k * 2, ...open }));
    g.append(S('line', { x1: cx - k, x2: cx + k, y1: cy, y2: cy, stroke: color, 'stroke-width': 2 }));
  } else {
    g.append(S('circle', { cx, cy, r: r - 1, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.6, 'stroke-dasharray': '2 2' }));
  }
  return g;
}

/** The same shape as a small inline icon, for use beside the verdict's word. */
export function verdictGlyph(call, size = 16){
  const svg = S('svg', { viewBox: '0 0 16 16', width: size, height: size, class: 'verdict-glyph', 'aria-hidden': 'true' });
  svg.append(verdictShape(call, 8, 8, 5.5));
  return svg;
}
