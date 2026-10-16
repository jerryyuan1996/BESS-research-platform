/* ---------------------------------------------------------------------------
   WA's design, as the Brief states it (guided-experience plan, PR 7).

   The seed used to carry its own recommendation: 8h built with a path to 10h.
   The engine prices WA's capacity route best at 7h, with 8h inside the band
   and 10h far outside it, so every WA tab that names a duration reads the
   engine's answer, through the briefing the Brief reads, instead.
   --------------------------------------------------------------------------- */
import { routeFit } from '../../_shared/designAnswer.js';

/** The capacity route's answer: { hours, low, high, span } or null. */
export const waDesign = () => routeFit('wa', 'cap');

/** "7 h (band 7–8 h)", or "7 h" where the band is one duration, [en, zh]. */
export function waDesignText(){
  const f = waDesign();
  if (!f) return ['not priced', '未定价'];
  return f.low < f.high
    ? [`${f.hours} h (band ${f.low}–${f.high} h)`, `${f.hours}小时（区间${f.low}–${f.high}小时）`]
    : [`${f.hours} h`, `${f.hours}小时`];
}
