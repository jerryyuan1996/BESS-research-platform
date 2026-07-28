/* ---------------------------------------------------------------------------
   Table helpers.

   The prototype built tables inline with h() everywhere. That is kept — this
   module only factors out the horizontal-scroll wrapper and the header row, which
   were repeated verbatim dozens of times. Column definitions stay at the call
   site so nothing has to be pushed through a generic column abstraction.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/** Wraps a table so wide content scrolls inside the card instead of the page. */
export function tableWrap(table, extraClass){
  return h('div', { class: 'tbl-wrap' + (extraClass ? ' ' + extraClass : '') }, table);
}

/**
 * Header row from column specs.
 * @param {Array<{label:[string,string]|string, num?:boolean, cls?:string}>} cols
 */
export function thead(cols){
  return h('thead', {}, h('tr', {}, cols.map(c =>
    h('th', { class: (c.num ? 'num' : '') + (c.cls ? ' ' + c.cls : '') }, L(c.label)))));
}
