import { byId } from '../markets/registry.js';
import { SPECIAL_OPPORTUNITIES, SCOUT_OPPORTUNITIES } from './catalog.js';
import { compareOpportunity } from './model.js';

// Build-time projection: home gets small, current model outputs and prose;
// the full acquisition engine is fetched only when a comparison is opened.
export function opportunitySummary(briefing) {
  return Object.fromEntries(Object.entries(briefing.lenses).map(([investor,lens]) => [investor,{
    picks:['nem-sub5','ercot-small-dg','de-existing-node'].map(id=>{
      const o=SPECIAL_OPPORTUNITIES.find(o=>o.id===id);
      const row=lens.rows.find(r=>r.market===o.market);
      const play=row?briefing.plays[o.market+'/'+row.play]:null;
      const c=compareOpportunity(byId(o.market),o,investor,play);
      return {id:o.id,market:o.market,kind:o.kind,label:o.label,months:o.months,thesis:o.thesis,
        economics:{safePremium:c.safePremium??null,currency:c.currency,
          baselineMonths:c.standard?.codMonths,specialMonths:c.alternative?.codMonths,target:c.targetReturn,
          buildBudget:c.alternative?.assumptions.buildBudget,buildChange:c.inputs?.buildPremiumPct,
          playHours:c.alternative?.input.durationHours}};
    }),
    other:SPECIAL_OPPORTUNITIES.filter(o=>!['nem-sub5','ercot-small-dg','de-existing-node'].includes(o.id))
      .map(({id,market,label})=>({id,market,label})),
    scouts:SCOUT_OPPORTUNITIES,
  }]));
}
