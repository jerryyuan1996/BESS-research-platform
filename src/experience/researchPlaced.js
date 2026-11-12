/* Lightweight availability only. The full map and research load on opening.
   Coverage tests hold these chapters and mechanism slots to actual cards. */
const CHAPTERS = ['system', 'mechanism', 'revenue-drivers', 'revenue', 'bankable', 'execution', 'downside', 'sources'];
const PAGE_CHAPTERS = CHAPTERS.filter(chapter => !['system', 'mechanism'].includes(chapter));
const SLOTS = ['award', 'merchant', 'ancillary'];
const placed = (across = false, chapters = CHAPTERS) => ({ across, chapters, slots: SLOTS });

export const RESEARCH_IN_CONTEXT = {
  nem: placed(), jp: placed(true), gb: placed(), de: placed(true),
  it: placed(true), ie: placed(), ro: placed(), pl: placed(), pjm: placed(),
  ercot: placed(true), caiso: placed(), fi: placed(),
  ca_on: placed(false, PAGE_CHAPTERS),
  // The unpriced Saudi case has research and execution, not modelled revenue/downside.
  sa: placed(false, PAGE_CHAPTERS.filter(chapter => !['revenue', 'downside'].includes(chapter))),
  es: placed(false, PAGE_CHAPTERS), wa: placed(),
};

/** Return a placed market, or null for a chapter with no matching research. */
export function researchPlaced(market, chapter = null, slot = null){
  const entry = RESEARCH_IN_CONTEXT[market.manifest.dashboardId || market.manifest.id];
  if (!entry || (chapter && !entry.chapters.includes(chapter))) return null;
  if (chapter === 'revenue-drivers' && slot && !entry.slots.includes(slot)) return null;
  return entry;
}
