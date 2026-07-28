/* ---------------------------------------------------------------------------
   Page footer. Takes its lines as content so each page keeps its own wording.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/** @param {Array<*>} lines  first line is emphasised with a bottom margin */
export function renderFooter(lines){
  const f = h('div', { class: 'footer' });
  lines.forEach((line, i) => f.append(
    h('div', i === 0 ? { style: 'margin-bottom:6px;' } : {}, L(line))));
  return f;
}
