/* ---------------------------------------------------------------------------
   The home board's scouting rows, as data.

   Every roster market gets a row below the board's second divider: its name,
   its region and its four calls where a card has been written, or "no card
   written yet". Calls only. The home page never loads a card, a source list
   or a quotation, which is what keeps its first view inside its budget: this
   module imports the roster and the verdict vocabulary and nothing else.

   No return appears in a scouting row. A core market that has not been graded
   shows the return the engine prices; a scout market has no engine to ask.
   --------------------------------------------------------------------------- */
import { ARCHETYPE_IDS } from '../governance/investability.js';
import { SCOUT_ROSTER, SCOUT_REGIONS } from '../governance/scout.js';

/**
 * @param calls  { id: { archetype: { call, route } } } from scoutIndex.js
 * @param lens   an archetype id, or null for all four
 */
export function scoutBoardRows(calls = {}, lens = null){
  return SCOUT_ROSTER.map(market => {
    const card = calls[market.id] ?? null;
    return {
      market, region: SCOUT_REGIONS[market.region],
      calls: card ? Object.fromEntries(ARCHETYPE_IDS.map(a => [a, card[a] ?? null])) : null,
      call: card && lens ? (card[lens] ?? null) : null,
    };
  });
}
