/* ---------------------------------------------------------------------------
   The dossier list for a market's Portfolio tab.

   THIS IS WHERE "WITHHELD" BELONGS, and it is the only place. A withheld card
   here is attached to a published, non-confidential descriptor — the market's
   own portfolio tab, which exists whether or not any deal does — so it says
   "there is a confidential layer and it is not in this build" without confirming
   anything about what that layer contains.

   The /projects/<slug> route deliberately does the opposite and 404s, because a
   withheld page rendered only for REAL slugs would be an oracle confirming which
   codenames exist. Same word, two different situations; the difference is
   whether something public is already standing there to hang it on.

   In a build this always renders the withheld card. In development with dossiers
   present it renders one link per dossier, which is the "click the project and
   jump to the project page" path.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { navigate } from '../../app/router.js';
import { card } from '../../components/card.js';
import { badge } from '../../components/badge.js';
import { WITHHELD_NOTICE } from '../../local/loader.js';
import { dossiersForMarket, dossierPath } from './registry.js';

/**
 * @param {string} marketId
 * @param {[string,string]} [emptyNote]  market-specific wording for the
 *   withheld case, so a dashboard can say what its public layer still covers
 * @returns {HTMLElement}
 */
export function dossierList(marketId, emptyNote){
  const list = dossiersForMarket(marketId);

  if (!list.length){
    const c = card(['Project layer withheld', '项目层内容未发布'], [badge('conf')]);
    c.append(h('div', { class: 'note' }, L(WITHHELD_NOTICE)));
    if (emptyNote) c.append(h('div', { class: 'cap' }, L(emptyNote)));
    return c;
  }

  const c = card(['Projects', '项目'], [badge('conf')]);
  c.append(h('div', { class: 'note' }, L([
    'Confidential project files, available in this development build only. They are structurally absent from any published build — not hidden in it.',
    '保密项目档案，仅在本开发构建中可用。它们在任何已发布构建中均为结构性缺失，而非被隐藏。',
  ])));

  const grid = h('div', { class: 'dossier-list' });
  for (const d of list){
    const href = dossierPath(d);
    grid.append(h('a', {
      class: 'dossier-card',
      href,
      onclick: (e) => { e.preventDefault(); navigate(href); },
    },
      h('div', { class: 'dc-name' }, L(d.name)),
      d.sub ? h('div', { class: 'dc-sub' }, L(d.sub)) : null,
      d.headline ? h('div', { class: 'dc-headline' }, L(d.headline)) : null));
  }
  c.append(grid);
  return c;
}
