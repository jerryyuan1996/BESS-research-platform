/* ---------------------------------------------------------------------------
   Status chip — a rounded pill with a leading status dot.

   Signature note: the cockpit's chip() called L() on its text; WA's did not,
   because WA callers passed an already-resolved string. L() is idempotent on a
   plain string, so calling it here is safe for both and preserves each.

   Variants: good | warn | serious | critical | info (see components.css).
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

export function chip(cls, text){
  return h('span', { class: 'chip ' + cls }, L(text));
}
