import { marketAt } from '../comparison/designFit.js';

/** Keep the analyst's route, duration and awarded-grant cohort together. This
 * creates a scenario; it never edits the public market or the analyst's call. */
export function marketForPlay(market, play){
  if(!play)return market;
  let variant=market;
  if(Number.isFinite(play.grantPct))variant={...variant,comparison:{...variant.comparison,
    economics:{...variant.comparison.economics,grantPct:play.grantPct}}};
  const hours=play.hours??market.comparison.archetype.durationHours;
  if(hours!==market.comparison.archetype.durationHours){
    variant=marketAt(variant,play.route,hours);
  }
  return variant;
}
