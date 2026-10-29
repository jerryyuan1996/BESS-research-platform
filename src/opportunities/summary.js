import { markets, byId } from '../markets/registry.js';
import { SPECIAL_OPPORTUNITIES, SCOUT_OPPORTUNITIES } from './catalog.js';
import { compareOpportunity, opportunityIRRs, beatsConventional } from './model.js';
import { investmentMetrics, referenceInvestment } from './investment.js';
import { marketForPlay } from '../acquisition/play.js';
import { runScenarioSet } from '../comparison/refinement.js';

export function opportunitySummary(briefing, views = []) {
  return Object.fromEntries(Object.entries(briefing.lenses).map(([investor,lens])=>{
    const playFor=id=>{const row=lens.rows.find(r=>r.market===id);return row?briefing.plays[id+'/'+row.play]:null;};
    const screens=Object.fromEntries(SPECIAL_OPPORTUNITIES.map(o=>{
      const market=byId(o.market),play=playFor(o.market);
      return [o.id,compareOpportunity(market,o,investor,play)];
    }));
    const decisions = Object.fromEntries(markets.map(m => {
      const id=m.manifest.id,view=views.find(v=>v.marketId===id),p=playFor(id);
      const call=view?.plays?.[p?.id]?.calls?.[investor] || view?.verdicts?.[investor];
      const current = x => Array.isArray(x) && !x.some(t => /IRR|hold return|持有期|回报.{0,8}\d|收益率.{0,8}\d/i.test(t));
      const reason = call?.because?.find(x => !['assetReturn','revenueCertainty'].includes(x.dimension) && current(x.text))?.text;
      const event=Object.values(briefing.triggers||{}).find(t=>t.id === lens.rows.find(r=>r.market===id)?.next);
      return [id,{reason:reason || m.comparison.refinement?.consensus?.summary,
        counterpoint:current(call?.despite)?call.despite:null,
        asOf:call?.asOf || m.comparison.refinement?.reviewDate,reviewBy:call?.reviewBy,
        event:event?{label:event.label,expected:event.expected}:null}];
    }));
    const marketMetrics=Object.fromEntries(markets.map(market=>{
      const id=market.manifest.id,play=playFor(id),o=SPECIAL_OPPORTUNITIES.find(o=>o.market===id);
      const c=screens[o.id];
      const s=c.standard||referenceInvestment(market,investor,play)?.result;
      const metrics=investmentMetrics(s);
      if(metrics){
        const chosen=play||{route:s.input.strategyId,hours:s.input.durationHours};
        const variant=marketForPlay(market,chosen);
        const bear=runScenarioSet(variant,chosen.route,5,chosen.econ?.runOptions||{}).bear;
        const stressed=referenceInvestment(market,investor,chosen,{
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
    /* Only special opportunities whose IRR beats the conventional play. */
    const picks=SPECIAL_OPPORTUNITIES.filter(o=>beatsConventional(screens[o.id])).map(o=>{
      const id=o.id,c=screens[id];
      return {id,market:o.market,kind:o.kind,label:o.label,months:o.months,thesis:o.thesis,
        project:projectFor(o),irr:opportunityIRRs(c),
        economics:{safePremium:c.safePremium??null,currency:c.currency,
          baselineMonths:c.standard?.codMonths,specialMonths:c.alternative?.codMonths,target:c.targetReturn,
          buildBudget:c.alternative?.assumptions.buildBudget,buildChange:c.inputs?.buildPremiumPct,
          playHours:c.alternative?.input.durationHours}};
    });
    return [investor,{markets:marketMetrics,decisions,picks,
      scouts:SCOUT_OPPORTUNITIES}];
  }));
}
