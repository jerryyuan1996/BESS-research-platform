/* Small dated fleet totals, shared by pipeline tables without loading map clustering. */
import { energyMWh,isPlottable,MAPPED_STAGES } from './projectValues.js';
const sum=values=>values.reduce((total,value)=>total+value,0);

export function energyPeriod(projects, knownCount){
  const observed=projects.filter(p=>p.energyObservation && energyMWh(p)!=null);
  if(!observed.length)return {};
  const periods=[...new Set(observed.map(p=>p.energyObservation.reportingPeriod))];
  if(periods.length!==1 || (knownCount===projects.length && observed.length!==projects.length))return {energyPeriodsMixed:true};
  return {energyPeriod:periods[0]};
}


/** Totals for a market's drawable fleet, split by stage. Feeds the map caption
    and the pipeline section header from one calculation. */
export function fleetTotals(projects){
  const out = {};
  for (const stage of MAPPED_STAGES){
    const inStage = projects.filter(p => p.stage === stage);
    const energies = inStage.map(energyMWh);
    const known = energies.filter(v => v != null);
    const period=energyPeriod(inStage,known.length);
    out[stage] = {
      count: inStage.length,
      powerMW: sum(inStage.map(p => p.capacityMW)),
      energyMWh: inStage.length && known.length === inStage.length && !period.energyPeriodsMixed ? sum(known) : null,
      energyKnown: known.length,
      ...period,
      plottable: inStage.filter(isPlottable).length,
    };
  }
  return out;
}
