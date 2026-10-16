/* ---------------------------------------------------------------------------
   Mounts the Investment Case or Entry section, fetching its code on demand.

   The component behind these two sections carries the whole method layer — the
   anchors, the four archetype tables, the view store and the ledgers — and only
   four markets have the tabs that use it. Importing it statically from the
   shared block engine put all of that into the chunk every market visit pays
   for, and tests/bundle-budget.test.js caught it. So it is its own chunk,
   fetched when one of the two tabs is opened and never otherwise.

   This file is the only thing the block engine and WA's hand-written dashboard
   import. It is small on purpose.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/**
 * @param parent    where the section's cards go
 * @param marketId  the market whose view and ledger to render
 * @param which     'case' or 'entry'
 */
export function mountInvestmentCase(parent, marketId, which){
  const holder = h('div', { class: 'cap' }, L(['Loading…', '加载中…']));
  parent.append(holder);
  import('./investmentCase.js').then(m => {
    const cards = which === 'entry' ? m.entryPanel(marketId) : m.briefPanel(marketId);
    cards.forEach((el, i) => { if (i) el.style.marginTop = '14px'; });
    holder.replaceWith(...cards);
  }).catch(() => {
    holder.textContent = L(['This section could not be loaded.', '本节未能加载。']);
  });
}

/**
 * The grades a tab's sections argue for, above them. Draws nothing for a tab
 * that has none, and nothing if the code cannot be fetched: the sections below
 * stand without it.
 */
export function mountTabGrades(parent, marketId, tabId){
  const holder = h('div', {});
  parent.append(holder);
  import('./investmentCase.js').then(m => {
    const c = m.tabGradesCard(marketId, tabId);
    if (c){ c.style.marginBottom = '14px'; holder.replaceWith(c); } else holder.remove();
  }).catch(() => holder.remove());
}
