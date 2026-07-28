/* ---------------------------------------------------------------------------
   Card — the primary content container.

   The two prototype implementations differed in exactly one respect: the
   cockpit's set an inline marginTop of 14px, WA's did not. Rather than pick a
   winner (which would move every card on one of the two pages), the margin is an
   option. The home cockpit passes { spaced: true }; market sections do not.

   WA's version also skipped falsy entries in the badges array, which several WA
   call sites rely on to render a badge conditionally. Both are handled.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { toBadge } from './badge.js';

/**
 * @param {[string,string]|string} title
 * @param {Array<Node|string|null>} [badges]  nodes, or badge keys ('official', 'calc', …)
 * @param {...Node} kids
 */
export function card(title, badges, ...kids){
  const head = h('h3', {}, L(title));
  (badges || []).forEach(b => { if (b) head.append(toBadge(b)); });
  return h('div', { class: 'card' }, head, ...kids);
}

/** Cockpit variant: identical markup plus the prototype's 14px top margin. */
export function spacedCard(title, badges, ...kids){
  const c = card(title, badges, ...kids);
  c.style.marginTop = '14px';
  return c;
}
