/* ---------------------------------------------------------------------------
   KPI tile and meter primitives, verbatim from the prototype.

   kpi() takes an already-resolved label (call sites pass L(...) themselves) and
   an HTML string for the value, because several call sites embed a <small> unit
   inside the number.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { toBadge } from './badge.js';

/**
 * @param {string} label      resolved label text
 * @param {string} value      HTML string (may contain <small>)
 * @param {{text:string, cls?:string}} [extra]  delta line under the value
 * @param {Array<Node|string>} [badges]  nodes, or badge keys ('official', 'calc', …)
 */
export function kpi(label, value, extra, badges){
  const k = h('div', { class: 'kpi' },
    h('div', { class: 'lbl' }, label),
    h('div', { class: 'val', html: value }));
  if (extra) k.append(h('div', { class: 'delta' + (extra.cls ? ' ' + extra.cls : '') }, extra.text));
  if (badges) k.append(h('div', { style: 'margin-top:6px; display:flex; gap:4px; flex-wrap:wrap;' },
    badges.map(toBadge)));
  return k;
}

/** Horizontal fill bar. `pct` is 0-100. */
export function meter(pct, color){
  return h('div', { class: 'meter' }, h('div', { style: `width:${pct}%;background:${color || 'var(--s1)'};` }));
}

/** Weighted score rows — label (weight%), bar, value / max. Verbatim from WA. */
export function scoreRows(items, max){
  return h('div', { style: 'margin-top:8px;' }, items.map(it => h('div', { class: 'score-row' },
    h('div', { class: 'sr-lbl' }, L(it.n) + ' (' + it.w + '%)'),
    h('div', { class: 'sr-bar' }, h('div', { style: `width:${it.s / max * 100}%;` })),
    h('div', { class: 'sr-val' }, it.s + ' / ' + max))));
}

/** Picks the band whose [lo, hi] contains `score`; falls through to the last. */
export function bandFor(bands, score){
  return bands.find(b => score >= b.lo && score <= b.hi) || bands[bands.length - 1];
}
