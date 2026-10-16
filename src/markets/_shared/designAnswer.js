/* ---------------------------------------------------------------------------
   WHAT TO BUILD, AS THE BRIEF SAYS IT (guided-experience plan, PR 7).

   A deep tab that names a duration takes it from here, and this takes it from
   the briefing the market's Brief reads, through its design projection
   (src/briefing/designData.js), so a tab and the Brief cannot disagree on what
   to build. The briefing ran the engine's design sweep
   (src/comparison/designFit.js) at build time; nothing here prices anything.
   --------------------------------------------------------------------------- */
import { DESIGN } from '../../briefing/designData.js';

const buildOf = (marketId) => DESIGN.build.find(x => x.market === marketId) || null;

/** The Brief's own sentence on what to build, [en, zh], or null. */
export const designLine = (marketId) => buildOf(marketId)?.line || null;

/** The best design the engine prices: { route, hours, name: [en, zh] } or null. */
export const designBest = (marketId) => buildOf(marketId)?.best || null;

/**
 * One route's answer: its best duration and the durations the engine cannot
 * separate from it there. `span` reads "2–4h" across a band, "7h" without one.
 * Null where the route has no priced, eligible design.
 */
export function routeFit(marketId, route){
  const r = DESIGN.byRoute?.[marketId]?.[route];
  if (!r || r.best === null) return null;
  const low = Math.min(r.best, ...r.band), high = Math.max(r.best, ...r.band);
  return {
    hours: r.best, low, high,
    span: low < high ? [`${low}–${high}h`, `${low}–${high}小时`] : [`${r.best}h`, `${r.best}小时`],
  };
}
