import { markets, byId } from '../markets/registry.js';
import { SPECIAL_OPPORTUNITIES, SCOUT_OPPORTUNITIES } from './catalog.js';
import { compareOpportunity } from './model.js';
import { investmentMetrics, referenceInvestment } from './investment.js';
import { marketForPlay } from '../acquisition/play.js';
import { runScenarioSet } from '../comparison/refinement.js';

export function opportunitySummary(briefing) {
  return Object.fromEntries(Object.entries(briefing.lenses).map(([investor,lens])=>{
    const playFor=id=>{const row=lens.rows.find(r=>r.market===id);return row?briefing.plays[id+'/'+row.play]:null;};
    const screens=Object.fromEntries(SPECIAL_OPPORTUNITIES.map(o=>{
      const market=byId(o.market),play=playFor(o.market);
      return [o.id,compareOpportunity(market,o,investor,play)];
    }));
    const marketMetrics=Object.fromEntries(markets.map(market=>{
      const id=market.manifest.id,play=playFor(id),o=SPECIAL_OPPORTUNITIES.find(o=>o.market===id);
      const c=screens[o.id];
      const s=c.standard||referenceInvestment(market,investor,play)?.result;
      const metrics=investmentMetrics(s);
      if(metrics&&play){
        const variant=marketForPlay(market,play);
        const bear=runScenarioSet(variant,play.route,5,play.econ?.runOptions||{}).bear;
        const stressed=referenceInvestment(market,investor,play,{
          ...(o.screeningByInvestor?.[investor]||{}),economicOverrides:bear.overrides});
        const b=investmentMetrics(stressed?.result);
        metrics.bearIRR=b?.irr??null;metrics.bearHoldIRR=b?.holdIRR??null;metrics.bearNetUSD=b?.bridge.net??null;
      }
      /* US new builds carry two supply cases. The headline is a non-FEOC DC block
         with the 30% credit; the alternative is a Chinese block with none. */
      if(metrics&&play&&metrics.usSupply){
        const alt=investmentMetrics(referenceInvestment(market,investor,play,{
          ...(o.screeningByInvestor?.[investor]||{}),usSupply:'chinese'})?.result);
        metrics.usAlternative=alt?{usSupply:'chinese',holdIRR:alt.holdIRR,irr:alt.irr,leveredIRR:alt.leveredIRR,
          capexPerMW:alt.capexPerMW,gearing:alt.leverage?.gearing??null,test:alt.test}:null;
      }
      /* The headline stays the one new-build case every market shares. Where
         this investor's call is to buy an operating asset, also give the most
         it can pay for one and still meet its target. */
      const entry=lens.rows.find(r=>r.market===id)?.stage;
      if(metrics&&play&&entry==='operating'){
        const operating=referenceInvestment(market,investor,play,{stage:'operating'});
        const ceiling=operating?.result.ceiling;
        metrics.operatingPurchase=ceiling?.status==='priced'
          ?{maxPricePerMW:ceiling.pricePerMW,targetReturn:ceiling.targetReturn}:null;
      }
      return [id,metrics];
    }));
    const projectFor=o=>{
      const c=screens[o.id],m=investmentMetrics(c.alternative);
      return m?{currency:m.currency,powerMW:m.powerMW,hours:m.hours,capexPerMW:m.capexPerMW,
        capexTotal:m.capexTotal,rtbMonths:m.rtbMonths}:null;
    };
    const picks=['nem-sub5','ercot-small-dg','de-existing-node'].map(id=>{
      const o=SPECIAL_OPPORTUNITIES.find(o=>o.id===id),c=screens[id];
      return {id,market:o.market,kind:o.kind,label:o.label,months:o.months,thesis:o.thesis,
        project:projectFor(o),
        economics:{safePremium:c.safePremium??null,currency:c.currency,
          baselineMonths:c.standard?.codMonths,specialMonths:c.alternative?.codMonths,target:c.targetReturn,
          buildBudget:c.alternative?.assumptions.buildBudget,buildChange:c.inputs?.buildPremiumPct,
          playHours:c.alternative?.input.durationHours}};
    });
    return [investor,{markets:marketMetrics,picks,
      other:SPECIAL_OPPORTUNITIES.filter(o=>!picks.some(p=>p.id===o.id))
        .map(o=>({id:o.id,market:o.market,label:o.label,project:projectFor(o)})),
      scouts:SCOUT_OPPORTUNITIES}];
  }));
}
