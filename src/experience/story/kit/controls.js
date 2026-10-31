/* ---------------------------------------------------------------------------
   Teaching controls for story scenes (WP-06/07).

   A row of toggle buttons with aria-pressed, labelled from [en, zh] pairs.
   They change only the scene's own teaching state: no control here can reach
   the investment case, which the story never holds.
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';

/**
 * One choice from several (aria-pressed on the chosen one), or independent
 * switches when `multi` is set. `options`: [{ value, label: [en, zh] }].
 * `onChange(value, pressed)` runs after the buttons update.
 */
export function toggleGroup({ label, options, value, multi = false, onChange }){
  const group = h('div', { class: 'k-controls', role: 'group', 'aria-label': L(label) });
  const buttons = options.map(opt => {
    const b = h('button', { type: 'button', class: 'k-toggle', 'aria-pressed': String(multi ? Boolean(opt.pressed) : opt.value === value) }, L(opt.label));
    b.addEventListener('click', () => {
      if (multi){
        const pressed = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(pressed));
        onChange?.(opt.value, pressed);
      } else {
        buttons.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
        onChange?.(opt.value, true);
      }
    });
    return b;
  });
  group.append(...buttons);
  return group;
}
