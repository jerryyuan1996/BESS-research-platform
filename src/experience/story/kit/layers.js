/* ---------------------------------------------------------------------------
   The four layers of an explanatory scene, and their one legend.

   A scene that explains a market shows four different things moving between
   the same objects, and a reader who confuses them draws the wrong conclusion:
   that power delivered is money earned. So each layer has a line style no
   other layer uses, in every scene:

     physical power     solid lines; alternating current in blue, direct in
                        amber, with chevrons for direction
     control signals    thin dotted lines from whoever instructs to whatever
                        obeys
     obligations        a document mark, and a dashed link between the parties
                        it binds
     payments           tokens on a settlement rail drawn beneath the plant,
                        never along a wire

   The rail has three gates: qualified, awarded, performed. A token leaves the
   service that was delivered and stops at the first gate that is shut, so the
   drawing itself says that delivering a service does not by itself earn a
   payment.

   Screen-space primitives (the caller places them) except signalLine, which
   takes world points like every other line in the kit. No words: a caller
   passes labels as text already resolved for the language.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { s, n2, SVGNS } from './svg.js';
import { isoLine, at } from './iso.js';

/* ---- control signals ------------------------------------------------------ */
/** An instruction travelling along world points, ending in a dot at whatever obeys it. */
export function signalLine(list, { kind = '' } = {}){
  const [ex, ey] = at(...list[list.length - 1]);
  return s('g', { class: `k-signal ${kind ? 'k-signal-' + kind : ''}`.trim(), 'aria-hidden': 'true' },
    isoLine(list, { cls: 'k-signal-line' }),
    s('circle', { class: 'k-signal-end', cx: ex, cy: ey, r: 3 }));
}

/* ---- obligations ---------------------------------------------------------- */
/** A contract: a page with a folded corner. `signed` adds the seal; unsigned is an outline. */
export function documentMark(cx, cy, { signed = true, scale = 1 } = {}){
  return s('g', { class: `k-document ${signed ? 'is-signed' : 'is-unsigned'}`, transform: `translate(${n2(cx)},${n2(cy)}) scale(${scale})`, 'aria-hidden': 'true' },
    s('path', { class: 'k-document-page', d: 'M-8,-11 H3 L8,-6 V11 H-8 Z' }),
    s('path', { class: 'k-document-fold', d: 'M3,-11 V-6 H8' }),
    s('path', { class: 'k-document-lines', d: 'M-5,-3 H5 M-5,1 H5 M-5,5 H1' }),
    signed ? s('circle', { class: 'k-document-seal', cx: 4.5, cy: 7, r: 3.2 }) : null);
}

/** The link between two parties bound by a contract, with the document on it. */
export function contractLink(a, b, { signed = true } = {}){
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  return s('g', { class: `k-contract ${signed ? 'is-signed' : 'is-unsigned'}`, 'aria-hidden': 'true' },
    s('path', { class: 'k-contract-link', d: `M${n2(a[0])},${n2(a[1])} L${n2(b[0])},${n2(b[1])}` }),
    documentMark(mx, my, { signed }));
}

/* ---- payments ------------------------------------------------------------- */
/**
 * The settlement rail.
 *
 * @param {object} o
 * @param {number} o.x0, o.x1   the rail's ends, in screen units
 * @param {number} o.y          its centre line
 * @param {boolean[]} o.gates   [qualified, awarded, performed]
 * @param {string[]} [o.labels] a word under each gate, already in the reader's
 *                              language; omit where the drawing is too small
 * @param {string[]} [o.ends]   words under the two ends
 * @returns the group; `data-outcome` is paid | stopped-1 | stopped-2 | stopped-3
 */
export function settlementRail({ x0, x1, y, gates, labels = null, ends = null }){
  const span = x1 - x0;
  const gateX = [0, 1, 2].map(i => x0 + span * (i + 1) / 4);
  const shut = gates.findIndex(open => !open);
  const paid = shut < 0;
  /* The token rests just short of the gate that stopped it, or at the far end. */
  const tokenX = paid ? x1 : gateX[shut] - 22;
  const text = (x, word, cls = '') => s('text', { class: `k-rail-label ${cls}`.trim(), x: n2(x), y: y + 37, 'text-anchor': 'middle' }, word);
  return s('g', { class: 'k-rail', 'data-outcome': paid ? 'paid' : 'stopped-' + (shut + 1) },
    s('rect', { class: 'k-rail-track', x: x0 - 18, y: y - 13, width: span + 36, height: 26, rx: 13 }),
    s('path', { class: 'k-rail-way', d: `M${x0},${y} H${x1}` }),
    s('path', { class: 'k-rail-done', d: `M${x0},${y} H${n2(tokenX)}` }),
    /* where the claim starts: the service delivered */
    s('g', { class: 'k-rail-start', transform: `translate(${x0},${y})` },
      s('rect', { x: -9, y: -6, width: 18, height: 12, rx: 2 }), s('path', { d: 'M-4,-9 V-6 M4,-9 V-6' })),
    /* where it ends: the payment */
    s('g', { class: `k-rail-end ${paid ? 'is-paid' : ''}`.trim(), transform: `translate(${x1},${y})` },
      s('circle', { r: 11 })),
    gateX.map((gx, i) => s('g', { class: `k-gate ${gates[i] ? 'is-open' : 'is-shut'}`, 'data-gate': String(i + 1), transform: `translate(${n2(gx)},${y})` },
      s('path', { class: 'k-gate-post', d: 'M0,-19 V-13 M0,13 V19' }),
      gates[i]
        ? s('path', { class: 'k-gate-bar', d: 'M0,-13 L11,-24' })
        : s('path', { class: 'k-gate-bar', d: 'M0,-13 V13' }),
      s('circle', { class: 'k-gate-lamp', cy: -27, r: 7 }),
      gates[i] ? s('path', { class: 'k-gate-mark', d: 'M-3,-27 L-1,-25 L3.5,-30' }) : s('path', { class: 'k-gate-mark', d: 'M-2.6,-29.6 L2.6,-24.4 M2.6,-29.6 L-2.6,-24.4' }),
      s('text', { class: 'k-gate-no', y: -39, 'text-anchor': 'middle' }, String(i + 1)))),
    /* Placed by the outer group; the inner one is what a transition moves, so
       a style sheet's transform never fights the placement. */
    s('g', { class: `k-token ${paid ? 'is-paid' : 'is-claim'}`, transform: `translate(${n2(tokenX)},${y})` },
      s('g', { class: 'k-token-move', style: `--k-from:${n2(x0 - tokenX)}px` },
        s('circle', { class: 'k-token-disc', r: 9 }),
        paid ? s('path', { class: 'k-token-mark', d: 'M-4,-1.5 H4 M-4,2 H4' }) : null)),
    labels ? gateX.map((gx, i) => text(gx, labels[i], gates[i] ? '' : 'is-shut')) : null,
    ends ? [text(x0, ends[0]), text(x1, ends[1], paid ? '' : 'is-shut')] : null);
}

/* ---- the legend ----------------------------------------------------------- */
const swatch = (...kids) => {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 44 18'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'k-legend-swatch');
  svg.append(...kids);
  return svg;
};

/**
 * One legend for the four layers. `labels` is { ac, dc, signal, contract,
 * payment }, each already in the reader's language.
 */
export function layerLegend(labels, title){
  const item = (key, ...marks) => h('li', { 'data-layer': key }, swatch(...marks), h('span', {}, labels[key]));
  return h('ul', { class: 'k-layers', 'aria-label': title },
    item('ac', s('path', { class: 'public-ac-line', d: 'M3,9 H41' })),
    item('dc', s('path', { class: 'public-dc-line', d: 'M3,9 H41' })),
    item('signal', s('path', { class: 'k-signal-line', d: 'M3,9 H36' }), s('circle', { class: 'k-signal-end', cx: 39, cy: 9, r: 3 })),
    item('contract', s('path', { class: 'k-contract-link', d: 'M3,9 H41' }), documentMark(22, 9, { scale: 0.62 })),
    item('payment', s('rect', { class: 'k-rail-track', x: 2, y: 3, width: 40, height: 12, rx: 6 }), s('circle', { class: 'k-token-disc k-token-paid', cx: 22, cy: 9, r: 4.5 })));
}
