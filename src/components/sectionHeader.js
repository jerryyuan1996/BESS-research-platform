/* ---------------------------------------------------------------------------
   Section heading with optional caption. Verbatim from the prototype.
   Appends itself to `parent` and returns the section element, because most call
   sites immediately append further children to it.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

export function sectionHead(parent, title, cap){
  const s = h('div', { class: 'sect' }, h('h2', {}, L(title)));
  if (cap) s.append(h('div', { class: 'cap' }, L(cap)));
  parent.append(s);
  return s;
}
