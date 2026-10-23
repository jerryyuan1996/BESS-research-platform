import { ARCHETYPES } from '../governance/archetypes.js';
import { baseStrategy } from '../comparison/strategies.js';
import { marketAcquisitionReference } from './reference.js';
import { displayedCase } from './presentation.js';
export { displayedCase } from './presentation.js';

/** Price the analyst's recommended design at this investor's entry stage,
 * including a play-specific grant. Source records are never changed. */
export function investorOpportunities(markets,lenses,plays){
  const out={};
  for(const investor of Object.keys(ARCHETYPES)){
    const rows=[],seen=new Set(),allowed=ARCHETYPES[investor].entersAt;
    const declared=lenses[investor]?.rows||[];
    const records=[...declared];
    for(const market of markets){
      if(declared.some(r=>r.market===market.manifest.id))continue;
      const stage=ARCHETYPES[investor].defaultRoute,route=baseStrategy(market);
      records.push({market:market.manifest.id,call:'opportunistic',stage,implicit:true,
        playRecord:{id:market.manifest.id+'-reference',route,hours:market.comparison.archetype.durationHours,stage},researchAssumed:true});
    }
    for(const record of records){
      if(['avoid','not-accessible'].includes(record.call))continue;
      const market=markets.find(m=>m.manifest.id===record.market);
      if(!market)continue;
      const play=plays[`${record.market}/${record.play}`]||record.playRecord;
      if(!play)continue;
      // Co-investment is ownership, not a construction milestone. An unbuilt
      // minority investment uses RTB project economics and says so explicitly.
      const coInvest=record.stage==='co-invest',stage=coInvest?'ready-to-build':record.stage;
      if(!allowed.includes(stage))continue;
      const eligible=market.comparison.acquisition?.eligibleInvestors?.[stage];
      if(eligible&&!eligible.includes(investor))continue;
      const key=[market.manifest.id,play.id,stage].join('/');
      if(seen.has(key))continue;
      seen.add(key);
      const spec={id:play.id,route:play.route,hours:play.hours,
        ...(Number.isFinite(play.grantPct)?{grantPct:play.grantPct}:{})};
      const runOptions=play.econ?.runOptions||{};
      const result=marketAcquisitionReference(market,stage,investor,{play:spec,strategyId:play.route,runOptions});
      if(result.status!=='reference')continue;
      const selected=displayedCase(result),base=result.referenceCases.find(c=>c.key==='base');
      const watch=record.call==='wait'||play.econ?.eligible===false;
      const decision=watch?'watch':base.status==='priced'&&['enter-now','build-position'].includes(record.call)&&!record.researchAssumed?'priority':'conditional';
      rows.push({...result,market:record.market,hours:play.hours,playId:play.id,play:spec,runOptions,
        playLabel:play.label||null,where:record.where||null,coInvest,call:record.call,decision,
        researchAssumed:!!record.researchAssumed,priceUSDPerMW:selected.pricePerMW*result.fxToUSD,
        recommendedOrder:records.indexOf(record)});
    }
    // A large price ceiling or high hurdle alone does not make an investment
    // attractive. Executable economics comes before the existing analyst order.
    const rank=r=>r.decision==='watch'?4:displayedCase(r).status!=='priced'?3:r.decision==='priority'?0:
      r.referenceCases.find(c=>c.key==='base')?.status==='priced'?1:2;
    rows.sort((a,b)=>rank(a)-rank(b)||a.recommendedOrder-b.recommendedOrder||a.market.localeCompare(b.market));
    out[investor]=rows;
  }
  return out;
}
