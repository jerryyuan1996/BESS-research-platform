/* Chart-IE-CRM (ie-06).

   The observed layer is withheld under B-IE-RIGHTS, so this renderer draws the
   approved unscaled Example in §5: no observed value, no numeric tick, no
   tooltip and no auction date. The guard below makes the numeric branch
   unreachable until a separately authorised build replaces it, which is the
   point: a lazy import is not a publication gate.                          */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { s } from '../../../experience/story/kit/svg.js';
import { IE_CRM_AUCTIONS as crm } from '../data/crmAuctions.js';
import { parts, vocab, exampleTag } from './ui.js';

const text = (pair, values) => L(fillPair(pair, values));
const path = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

/* Drawing coordinates only. Their shape carries no Irish price, factor or
   delivery year, and the panels share no scale. */
const PRICE_EXAMPLE = [[16, 96], [58, 88], [100, 104], [142, 70], [184, 78], [226, 52], [268, 60], [310, 34], [352, 42], [394, 22]];
const CREDIT_EXAMPLE = [[16, 26], [58, 24], [100, 40], [142, 38], [184, 62], [226, 74], [268, 72], [310, 88], [352, 92], [394, 98]];
/* Four recent delivery auctions; the proportions are drawing units. */
const AWARD_EXAMPLE = [[38, 18], [34, 26], [46, 12], [30, 22]];

/**
 * panel(heading, trace, solidUntil): a title, one baseline and the trace.
 * From `solidUntil` on the line is dashed: the initial-pack convention, not a
 * second series and not a forecast.
 */
const panel = (heading, trace, solidUntil, values) => s('g', { class: 'ie-crm-panel' },
  s('text', { class: 'ie-crm-heading', x: 12, y: 16 }, text(heading, values)),
  s('line', { class: 'ie-crm-axis', x1: 12, x2: 408, y1: 118, y2: 118 }),
  s('path', { class: 'ie-crm-trace', d: path(trace.slice(0, solidUntil)) }),
  solidUntil < trace.length ? s('path', { class: 'ie-crm-trace ie-crm-future', d: path(trace.slice(solidUntil - 1)) }) : null);

/** The awarded-volume mode: the same chart, four recent delivery auctions. */
const awarded = (shot, values) => s('g', { class: 'ie-crm-awarded' },
  s('text', { class: 'ie-crm-heading', x: 12, y: 16 }, text([shot.labels.awarded[0] + ' · ' + shot.labels.awardedUnit[0], shot.labels.awarded[1] + ' · ' + shot.labels.awardedUnit[1]], values)),
  s('line', { class: 'ie-crm-axis', x1: 12, x2: 408, y1: 132, y2: 132 }),
  ...AWARD_EXAMPLE.map(([fresh, existing], i) => s('g', { 'data-row': i },
    s('rect', { class: 'ie-crm-new', x: 30 + i * 96, y: 132 - fresh, width: 26, height: fresh, rx: 2 }),
    s('rect', { class: 'ie-crm-existing', x: 58 + i * 96, y: 132 - existing, width: 26, height: existing, rx: 2 }))),
  s('text', { class: 'ie-crm-legend', x: 12, y: 152 }, L(shot.labels.newer)),
  s('text', { class: 'ie-crm-legend', x: 90, y: 152 }, L(shot.labels.existing)),
  s('text', { class: 'ie-crm-legend', x: 12, y: 180 }, L(shot.labels.initialPack)));

export function crmChart(shot, { values, mode = 'price' }) {
  if (crm.chart.quantitativeReady) {
    throw new Error('The observed CRM layer needs its own rights clearance and a separately authorised build');
  }
  const labels = shot.labels;
  const heading = (name, unit) => [labels[name][0] + ' · ' + labels[unit][0], labels[name][1] + ' · ' + labels[unit][1]];
  const awardedMode = mode === 'awarded';

  const drawing = awardedMode
    ? awarded(shot, values)
    : s('g', {},
      s('g', { transform: 'translate(0,34)', opacity: mode === 'price' ? 1 : 0.55 }, panel(heading('price', 'priceUnit'), PRICE_EXAMPLE, PRICE_EXAMPLE.length, values)),
      s('g', { transform: 'translate(0,164)', opacity: mode === 'credit' ? 1 : 0.55 }, panel(heading('credit', 'creditUnit'), CREDIT_EXAMPLE, 8, values)));

  const svg = s('svg', {
    class: 'ie-crm-drawing', viewBox: '0 0 420 300', role: 'img', 'aria-label': L(crm.chart.fallback),
    'data-chart': crm.chart.id, 'data-authority': 'example', 'data-scaled': 'false', 'data-mode': mode,
  },
  s('text', { class: 'ie-crm-title', x: 210, y: 18, 'text-anchor': 'middle' }, L(crm.chart.fallback)),
  drawing);

  const definitions = h('details', { class: 'ie-crm-definitions' },
    h('summary', {}, text(shot.controls[3], values)),
    h('p', {}, text(vocab('Signature chart axes'), values)),
    h('p', {}, text(vocab('Signature chart definition'), values)),
    h('p', {}, text(vocab('Signature chart accessible summary'), values)),
    awardedMode ? h('p', {}, text(vocab('Awarded scope'), values)) : null,
    h('p', {}, text(shot.caption, values)));

  return h('div', { class: 'ie-crm-chart', 'data-mode': mode },
    h('p', { class: 'ie-crm-status' }, exampleTag(), ' · ', L(parts('Loading / retry')[3])),
    h('div', { class: 'ie-crm-scroll', tabindex: '0', role: 'region', 'aria-label': L(crm.chart.fallback) }, svg),
    definitions);
}
