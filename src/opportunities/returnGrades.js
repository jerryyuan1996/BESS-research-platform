/* ---------------------------------------------------------------------------
   THE ASSET-RETURN GRADE, ON THE INVESTMENT MODEL.

   Signed off by the analyst on 16 November 2026
   (docs/return-model-alignment-plan-2026-11-15.md, decisions 1–6):

     · WHAT IS GRADED  the case on the investor's card: its recommended play at
                       its hours, bought ready-to-build at zero price for the
                       project rights, construction still to pay
     · WHICH RETURN    the all-equity hold return, for all four investors. It
                       is the number printed on the card
     · THE SET         every market the model prices, graded or not

   A COMMON ASSET BENCHMARK, NOT AN INVESTOR'S OBJECTIVE. Each investor's own
   tests — the 5-year sale, the levered return, the target and the price
   ceiling — are untouched and stay where they act. A developer's economics are
   not measured by a hold return at all; it shares the benchmark and is
   labelled so.

   The figure is worked out exactly as the card's is (src/opportunities/
   summary.js), and tests/return-grades.test.js holds the two equal.

   Layering: no DOM. Imports the investment model, so it runs where that runs.
   --------------------------------------------------------------------------- */
import { ARCHETYPE_IDS, ASSET_GRADE_BASIS } from '../governance/investability.js';
import { gradeByFifths } from '../comparison/returnGrades.js';
import { referenceInvestment, INVESTMENT_STAGE } from './investment.js';
import { SPECIAL_OPPORTUNITIES } from './catalog.js';

/** The all-equity hold return on an investor's card for one market, or null where the model prices nothing. */
export function cardHoldReturn(market, investor, play = null){
  const screening = SPECIAL_OPPORTUNITIES.find(o => o.market === market.manifest.id)?.screeningByInvestor?.[investor] || {};
  let reference = null;
  try { reference = referenceInvestment(market, investor, play, { ...screening, stage: INVESTMENT_STAGE }); }
  catch { reference = null; }
  const value = reference?.result?.holdReturn?.annualReturn;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Grades for every priced market and every investor.
 *
 * @param markets  the registry's markets
 * @param playFor  (investor, marketId) → the play on that investor's card, or
 *                 null for the market's standard design
 * @returns marketId → investor → { basis, rank, count, grade, value, play }
 */
export function headlineReturnGrades(markets, playFor = () => null){
  const out = {};
  for (const investor of ARCHETYPE_IDS){
    const plays = new Map(markets.map(m => [m.manifest.id, playFor(investor, m.manifest.id) || null]));
    const graded = gradeByFifths(markets.map(m => [m.manifest.id, cardHoldReturn(m, investor, plays.get(m.manifest.id))]));
    for (const [id, grade] of Object.entries(graded)){
      const play = plays.get(id);
      (out[id] ||= {})[investor] = {
        basis: ASSET_GRADE_BASIS, ...grade,
        play: play ? { id: play.id, route: play.route, hours: play.hours } : null,
      };
    }
  }
  return out;
}

/** The one grade all four investors give a market, or null when they differ or none is computed. */
export function commonGrade(byInvestor){
  const grades = ARCHETYPE_IDS.map(id => byInvestor?.[id]?.grade).filter(g => Number.isInteger(g));
  return grades.length === ARCHETYPE_IDS.length && grades.every(g => g === grades[0]) ? grades[0] : null;
}
