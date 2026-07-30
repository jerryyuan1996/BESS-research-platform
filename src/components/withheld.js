/* ---------------------------------------------------------------------------
   A card standing in for a confidential block that is not in this build.

   One shared implementation so every withheld block reads identically. The
   wording matters: it says the layer is withheld from the PUBLIC BUILD, which is
   a statement about publication, not about the research. A reader should not be
   left wondering whether the analysis was dropped, never done, or is simply not
   theirs to see.

   Kept in components/ rather than in local/ because it touches the DOM, and
   src/local/loader.js is imported by data modules that must stay DOM-free.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { WITHHELD_NOTICE } from '../local/loader.js';

/**
 * @param {[string,string]} title  the block's normal title, so the page keeps its shape
 * @param {[string,string]} [note] an override for the standard notice
 */
export function withheldCard(title, note){
  const c = card(title, [badge('conf')]);
  c.append(h('div', { class: 'note' }, L(note || WITHHELD_NOTICE)));
  return c;
}
