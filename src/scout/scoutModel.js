/* ---------------------------------------------------------------------------
   THE SCOUT PAGE, AS DATA.

   Everything /scout and the home board's scouting rows show about a market
   with no dashboard, worked out here and drawn elsewhere. No DOM.

   It decides nothing. A card is a record in the view store, read and handed
   on. What this adds is arrangement, and four things it will not do:

     · NO RETURN. There is no path from a card to a number that says what an
       asset earns. The Return pillar is the card's third-party signal, in its
       publisher's words, or the sentence "No return is modelled".
     · NO SINGLE SCORE. A card is graded on twelve dimensions in three pillars.
       With no Return pillar there is no fit, and the three pillar scores are
       never blended into one.
     · THE BARRIER LEADS. Where a grade on the card is one an investor cannot
       accept, the cell says so before it says the call.
     · A MARKET WITH NO CARD SAYS SO. Every roster market gets a row; one the
       agent has not written yet reads "no card written yet".

   Imports the method layer and the roster. Never the comparison engine, a
   market module or a ledger.
   --------------------------------------------------------------------------- */
import { ARCHETYPE_IDS, dimension, anchorText } from '../governance/investability.js';
import { ARCHETYPES, pillarScore, knockOuts } from '../governance/archetypes.js';
import {
  SCOUT_ROSTER, SCOUT_REGIONS, SCOUT_REGION_IDS, SCOUT_DIMENSION_IDS, SCOUT_PILLARS, SCOUT_EXIT_STREAK,
} from '../governance/scout.js';
import { scoutSources } from './sources.js';

/** What the Return pillar says on a card with no signal. */
export const NO_RETURN = ['No return is modelled', '未对回报建模'];

const written = (card) => Boolean(card) && (
  Object.keys(card.grades || {}).length || Object.keys(card.verdicts || {}).length
  || (card.facts || []).length || (card.triggers || []).length || card.returnSignal);

function cellFor(archetypeId, card, on){
  const verdict = card.verdicts[archetypeId] ?? null;
  const shutOut = knockOuts(archetypeId, card.grades, on).filter(d => SCOUT_DIMENSION_IDS.includes(d));
  return {
    archetype: archetypeId,
    call: verdict?.call ?? null,
    route: verdict?.route ?? null,
    because: verdict?.because ?? [],
    despite: verdict?.despite ?? null,
    reviewBy: verdict?.reviewBy ?? null,
    waitsFor: (verdict?.changesIf ?? []).map(id => card.triggers.find(t => t.id === id)).filter(Boolean),
    /* The barrier, from the grade. No machine writes "not accessible"; the
       card shows what shuts the investor out and lets the call stand beside it. */
    barriers: shutOut.map(d => ({ dimension: d, label: dimension(d).label, grade: card.grades[d].grade })),
    /* Null until every dimension of the pillar is graded: a partial pillar is
       shown as a gap, not as a lower score. */
    pillars: Object.fromEntries(SCOUT_PILLARS.map(p => [p, pillarScore(archetypeId, p, card.grades, on)])),
  };
}

/** One roster market as the page shows it. `card` may be null or empty. */
export function scoutRow(market, card, { on, lastPass = null, graduation = null } = {}){
  if (!written(card)) return { market, written: false };
  const sources = scoutSources(market.id);
  const link = (key) => (sources[key] ? { publisher: sources[key].publisher, url: sources[key].url } : { publisher: key, url: null });
  return {
    market, written: true, lastPass,
    cells: Object.fromEntries(ARCHETYPE_IDS.map(a => [a, cellFor(a, card, on)])),
    returnLine: card.returnSignal ? card.returnSignal.note : NO_RETURN,
    returnSignal: card.returnSignal,
    facts: card.facts,
    grades: SCOUT_DIMENSION_IDS.filter(d => card.grades[d]).map(d => {
      const g = card.grades[d];
      return {
        dimension: d, pillar: dimension(d).pillar, label: dimension(d).label, grade: g.grade, trend: g.trend,
        trendCause: g.trendCause ?? null, anchor: anchorText(d, g.grade), reason: g.reason ?? null,
        sources: g.evidence.map(link), asOf: g.asOf,
      };
    }),
    ungraded: SCOUT_DIMENSION_IDS.filter(d => !card.grades[d]).map(d => dimension(d).label),
    triggers: card.triggers,
    graduation: graduation ?? { passes: 0, needed: 2, archetype: null },
  };
}

/**
 * The page: the three regions, each with its markets in roster order.
 *
 * @param data  what vite-plugin-scout.js hands over: { cards, lastPass,
 *              graduation, streak, passes }
 * @param on    evaluation date, YYYY-MM-DD
 */
export function buildScoutPage(data, { on }){
  const regions = SCOUT_REGION_IDS.map(id => ({
    region: SCOUT_REGIONS[id],
    rows: SCOUT_ROSTER.filter(m => m.region === id).map(m => scoutRow(m, data.cards?.[m.id] ?? null, {
      on, lastPass: data.lastPass?.[m.id] ?? null, graduation: data.graduation?.[m.id] ?? null,
    })),
  }));
  const rows = regions.flatMap(r => r.rows);
  return {
    regions,
    writtenCount: rows.filter(r => r.written).length,
    total: rows.length,
    streak: data.streak ?? 0, streakNeeded: SCOUT_EXIT_STREAK, passes: data.passes ?? 0,
  };
}

/** An investor's label, for a caller that has only the id. */
export const archetypeLabel = (id) => ARCHETYPES[id].label;
