import { runCase, serviceCostPerMW, degradationFactor } from '../comparison/engine.js';
import { cisRevenue } from '../economics/revenueSupport.js';

/** Complete operating line in the comparison model's real USD. The first 15
 * years reconcile to the engine. Later years expire actual contracts, continue
 * physical fade and pay the quoted service schedule; they never renew a toll. */
export function operatingReference(market,strategyId,years=15){
  const r=runCase(market,strategyId,0);
  if(r.na)return {result:r,annual:[]};
  const e=market.comparison.economics,fx=r.fxRate;
  const merchantCase=runCase(market,'mer',0);
  const primaryTerm=strategyId==='ltda'?e.ltda?.years??0:strategyId==='toll'?e.tollYears??15:
    strategyId==='cap'?e.securedContractYears??e.contractYears??0:0;
  const annual=[];
  for(let y=1;y<=years;y++){
    const i=y-1,augmentation=(e.augmentationSchedule||[]).filter(a=>a.year===y).reduce((s,a)=>s+(a.amountPerMW??0)*fx+r.capexG*(a.pctOfCapex??0)/100,0);
    let secured,renewal,merchant,opex;
    if(y<=r.eb.length){
      secured=r.secY[i];renewal=r.aucY[i];merchant=r.mchY[i];
      const retirement=y===15?(e.decommissioningPerMW??0)*fx:0;
      opex=Math.max(0,secured+renewal+merchant-r.eb[i]-augmentation-retirement);
    }else{
      const fade=degradationFactor(e,y)/degradationFactor(e,15);
      const unrestricted=merchantCase.na?0:merchantCase.mchY[14]*fade;
      secured=0;renewal=0;merchant=unrestricted;
      if(y<=primaryTerm){
        secured=(strategyId==='ltda'?e.ltda?.payment:strategyId==='toll'?e.toll:e.securedContracted??e.contracted??0)*fx;
        if(strategyId==='ltda')merchant=unrestricted*(e.ltda?.merchantRetention??1);
        if(strategyId==='toll')merchant=e.tollIsFloor?Math.max(0,unrestricted-secured):0;
      }else if(strategyId==='cap'){
        renewal=e.riskClass==='auction-renewal'?(e.auctionRenewalCurve?.[y-primaryTerm-1]??0)*fx:(e.contracted??0)*(e.postFactor??0)*fx;
      }
      if(strategyId==='toll'&&!e.tollIsFloor&&y>primaryTerm&&!e.tollRevertsToMerchant)merchant=0;
      if(strategyId==='toll'&&e.tollAdditiveWithCapacity&&y<=(e.contractYears??0))secured+=(e.contracted??0)*fx;
      if(strategyId==='ltda'&&e.ltda?.cis&&y<=primaryTerm){const c=cisRevenue(unrestricted/fx,e.ltda.cis);secured=c.secured*fx;merchant=c.total*fx-secured;}
      opex=e.opexPerMW*fx+serviceCostPerMW(e,y)*fx;
    }
    const supportEligibleRevenue=(strategyId==='ltda'&&e.ltda?.cis||strategyId==='toll'&&e.tollIsFloor)
      ?(y<=15?merchantCase.mchY[i]:merchantCase.mchY[14]*degradationFactor(e,y)/degradationFactor(e,15)):undefined;
    annual.push({secured,renewal,merchant,opex,capex:augmentation,tax:0,...(supportEligibleRevenue==null?{}:{supportEligibleRevenue})});
  }
  return {result:r,annual,primaryTerm};
}
