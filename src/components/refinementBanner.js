/* ---------------------------------------------------------------------------
   The line above a market's tabs: what is new in this market, and when it was
   last reviewed.

   It used to be a card of caveats — "Screening only", a consensus chip, the
   next approval gate, "Evidence confidence N/10" and a note that the pipeline
   is excluded from decision metrics. The guided-experience plan (2026-10-16,
   decision 4) replaced those with one evidence marker per play, on the brief
   the landing tab now opens with, so this says the one thing that changes
   between visits and nothing else.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

export function refinementBanner(market){
  const profile = market?.comparison?.refinement;
  if (!profile?.currentUpdate) return null;
  return h('div', { class: 'refinement-banner mb-update' },
    profile.reviewDate ? h('span', { class: 'bf-date' }, L(['Reviewed ', '复核于 ']) + profile.reviewDate) : null,
    h('span', {}, L(profile.currentUpdate)));
}
