import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

let sequence = 0;

/** Small native modal, including above an existing research/story modal. */
export function sourceButton(content, label = ['Source: Official', '来源：官方']) {
  const button = h('button', { type:'button', class:'source-popup-trigger', 'aria-haspopup':'dialog' },
    L(label), h('span', { 'aria-hidden':'true' }, ' ↗'));
  button.addEventListener('click', () => {
    const titleId = `source-popup-${++sequence}`;
    const close = () => dialog.close();
    const closeButton = h('button', { type:'button', class:'source-popup-close', onclick:close,
      'aria-label':L(['Close sources','关闭来源']) }, '×');
    const dialog = h('dialog', { class:'source-popup', 'aria-labelledby':titleId },
      h('header', {}, h('h3', { id:titleId }, L(['Sources & status','来源与状态'])), closeButton),
      h('div', { class:'source-popup-body' }, typeof content === 'function' ? content() : content.cloneNode(true)));
    // Local ownership: replacing the page/chapter also removes its popup.
    button.after(dialog);
    dialog.addEventListener('cancel', event => { event.preventDefault(); event.stopPropagation(); close(); });
    dialog.addEventListener('close', () => { dialog.remove(); button.focus({ preventScroll:true }); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    });
    dialog.showModal(); closeButton.focus({ preventScroll:true });
  });
  return button;
}

/** Preserve every source field; move only its presentation. */
export function compactSourceDrawers(root) {
  const ownerSelector = '.card, .public-history-card, .public-history-support';
  const owners = new Map();
  for (const drawer of root.querySelectorAll('.source-drawer')) {
    const owner = drawer.closest(ownerSelector) || drawer.parentElement;
    if (!owners.has(owner)) owners.set(owner, []);
    owners.get(owner).push(drawer);
  }
  for (const [owner, drawers] of owners) {
    const content = h('div', { class:'source-list' });
    drawers.forEach(drawer => drawer.querySelectorAll('.source-grid').forEach(grid => content.append(grid.cloneNode(true))));
    if (!content.children.length) continue;
    const note = [...owner.querySelectorAll('.meta-official, .meta-public, .meta-tp, .meta-supp, .meta-dev')]
      .find(node => (node.closest(ownerSelector) || node.parentElement) === owner);
    const button = sourceButton(content, note?.textContent || ['Sources & status','来源与状态']);
    if (note) note.replaceWith(button); else drawers[0].before(button);
    drawers.forEach(drawer => drawer.remove());
  }
}
