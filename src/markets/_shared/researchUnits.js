/* ---------------------------------------------------------------------------
   THE CARDS OF A RESEARCH SECTION, NAMED.

   Research in context lifts cards out of a market's research and shows them
   under the chapter of the market page they explain (src/experience/
   researchMap.js says which card goes where). To do that a card needs a name
   that survives a re-render, a language switch and a regional lens, and a
   section needs one reading of "what are its cards" that the engine, the map
   and the coverage test all share. This module is that reading.

   A UNIT is one card as the research tab draws it, together with whatever the
   section places directly after it and before the next card: a congestion
   register under its map, a reading note under a scorecard. Those trailing
   blocks travel with the card, in the order the research wrote them.

     card                     one unit
     g2 / g3                  one unit per card in the row
     anything else            trails the card before it; before the first card
                              it is the section's LEAD when it is plain text,
                              and a unit of its own when it is a component
                              (the entry ledger and the investment case are
                              whole sections with no card around them)

   A unit is matched by a phrase of its English title, never by position, so
   reordering a section moves nothing and renaming a card fails the coverage
   test instead of silently showing a different card. The English half of a
   title is the stable half: Japan builds `L(region) + ' — duration need
   index'`, whose tail reads the same in either language.

   Pure data in, pure data out: no DOM, no import, so the coverage test and
   scripts/research/coverage.mjs read sections exactly as the page does.
   --------------------------------------------------------------------------- */

/** Text a section may open with before its first card. */
const LEAD_TYPES = new Set(['p', 'sub', 'cap', 'note', 'warn', 'proto', 'chip', 'why', 'band-story', 'reco']);

/** Blocks that are a picture of the data: what a chapter shows first. */
const VISUAL_TYPES = new Set(['line', 'bar', 'wf', 'band', 'pipeChart', 'geo-grid-map', 'timeline', 'phases', 'flow']);

const nested = (block) => [...(block.blocks || []), ...(block.cards || [])].filter(Boolean);
const holdsVisual = (block) => VISUAL_TYPES.has(block.t) || nested(block).some(holdsVisual);

/** The English half of a title, or '' for a block that has none. */
const english = (title) => (Array.isArray(title) ? String(title[0] ?? '') : typeof title === 'string' ? title : '');

/**
 * A section's lead and its units, in reading order.
 *
 * @param {{blocks?: Array}} spec  a section as buildSections() returns it
 * @returns {{lead: object[], units: Array<{key:string, title:(string[]|null), badges:string[], visual:boolean, blocks:object[]}>}}
 */
export function researchUnits(spec){
  const lead = [];
  const units = [];
  const add = (block, title) => units.push({
    key: english(title) || '#' + block.t,
    title: Array.isArray(title) ? title : null,
    badges: (block.badges || []).filter(b => typeof b === 'string'),
    visual: holdsVisual(block),
    blocks: [block],
  });
  for (const block of (spec?.blocks || [])){
    if (!block) continue;
    if (block.t === 'card') add(block, block.title);
    else if (block.t === 'g2' || block.t === 'g3'){
      for (const member of (block.cards || [])) if (member) add({ t: 'card', ...member }, member.title);
    }
    else if (units.length){
      const owner = units[units.length - 1];
      owner.blocks.push(block);
      if (holdsVisual(block)) owner.visual = true;
    }
    else if (LEAD_TYPES.has(block.t)) lead.push(block);
    else add(block, null);
  }
  return { lead, units };
}

/**
 * The units a phrase names. A phrase matches when the unit's key contains it;
 * `#type` names a component unit exactly. More than one result, or none, is a
 * map error the coverage test reports — the page draws the first and goes on.
 */
export function unitsMatching(units, phrase){
  return phrase.startsWith('#')
    ? units.filter(u => u.key === phrase)
    : units.filter(u => !u.key.startsWith('#') && u.key.includes(phrase));
}

/**
 * The units one pick takes, in the section's own reading order.
 *
 * @param pick  { cards?: string[], rest?: boolean, except?: string[] }
 *   `cards` are the cards named; `rest` adds every other card of the section
 *   not named in `except`; a pick with neither takes the whole section.
 */
export function pickUnits(units, pick){
  const named = new Set((pick.cards || []).flatMap(phrase => unitsMatching(units, phrase)));
  const left = new Set((pick.except || []).flatMap(phrase => unitsMatching(units, phrase)));
  const others = pick.rest || !pick.cards;
  return units.filter(unit => named.has(unit) || (others && !left.has(unit)));
}
