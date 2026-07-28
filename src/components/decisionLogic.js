/* ---------------------------------------------------------------------------
   Decision-logic footnote — the "why" block.

   Verbatim from the prototype. One appears under every chart and every stat block
   so a reader always sees how the number changes an investment decision. `sig` is
   the short "so what" signal rendered as a trailing pill.

   This is the most distinctive element of the cockpit's design language; it is
   shared, not reimplemented per market.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

export function why(text, sig){
  const d = h('div', { class: 'why' }, h('b', {}, L(['Decision logic → ', '决策逻辑 → '])), L(text));
  if (sig) d.append(h('span', { class: 'sig' }, L(sig)));
  return d;
}
