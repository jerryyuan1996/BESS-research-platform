import { runCase, serviceCostPerMW, degradationFactor } from '../comparison/engine.js';
import { cisRevenue } from '../economics/revenueSupport.js';
import { servicesFactor } from '../comparison/capacityLine.js';
import { settleReadyYear, splitTradingRevenue, readinessExtraCost } from '../comparison/revenueReadiness.js';

/** Complete operating line in the comparison model's real USD. The first 15
 * years reconcile to the engine. Later years expire actual contracts, continue
 * physical fade and pay the quoted service schedule; they never renew a toll. */
export function operatingReference(market,strategyId,years=15,options={}){
  const r=runCase(market,strategyId,0,options);
  if(r.na)return {result:r,annual:[]};
  const e=market.comparison.economics,fx=r.fxRate;
  const merchantCase=runCase(market,'mer',0,options);
  const primaryTerm=strategyId==='ltda'?e.ltda?.years??0:strategyId==='toll'?e.tollYears??15:
    strategyId==='cap'?e.securedContractYears??e.contractYears??0:0;
  const annual=[];
  for(let y=1;y<=years;y++){
    const i=y-1,augmentation=(e.augmentationSchedule||[]).filter(a=>a.year===y).reduce((s,a)=>s+(a.amountPerMW??0)*fx+r.capexG*(a.pctOfCapex??0)/100,0);
    let secured,renewal,merchant,opex,supportMonths=r.supportMonthsY?.[i];
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
      const additional=strategyId==='toll'&&e.tollAdditiveWithCapacity&&y<=(e.contractYears??0)?(e.contracted??0)*fx:0;
      secured+=additional;
      if(strategyId==='ltda'&&e.ltda?.cis&&y<=primaryTerm){const c=cisRevenue(unrestricted/fx,e.ltda.cis);secured=c.secured*fx;merchant=c.total*fx-secured;}
      if(options.capacityFloor && strategyId==='cap'){
        const atCod=Math.min(1,options.capacityFloor.hours/options.capacityFloor.requiredHours);
        const f=Math.min(1,options.capacityFloor.hours*degradationFactor(e,y)/options.capacityFloor.requiredHours)/atCod;
        secured*=f;renewal*=f;
      }
      opex=e.opexPerMW*fx+serviceCostPerMW(e,y)*fx;
      if(r.revenueReadiness.adjusted){
        const c=r.revenueReadiness;
        const split=splitTradingRevenue(e.merchGross*(e.merchantNetOfFee?1:1-(e.feePct||0)/100),e.services||0,c);
        const fade=degradationFactor(e,y)*(e.naqFactor??1)*fx;
        const retention=strategyId==='ltda'&&!e.ltda?.cis?(e.ltda?.merchantRetention??1):1;
        const canTrade=strategyId!=='toll'||e.tollIsFloor||y>primaryTerm&&e.tollRevertsToMerchant;
        const settled=settleReadyYear(c,y,{
          energy:canTrade?split.energy*servicesFactor(e.merchantCurve,15)*fade*retention:0,
          services:canTrade?split.services*servicesFactor(e.servicesCurve,15)*fade*retention:0,
          primary:secured+renewal-additional,primarySecured:secured-additional,additional,
          primaryStream:strategyId==='cap'?'capacity':'contract',
          floor:strategyId==='toll'&&e.tollIsFloor&&y<=primaryTerm,
          cis:strategyId==='ltda'&&y<=primaryTerm?e.ltda?.cis:null,fx,
        });
        secured=settled.secured;renewal=settled.renewal;merchant=settled.merchant;supportMonths=settled.supportMonths;
        opex+=readinessExtraCost(c,y)*fx;
      }
    }
    const supportEligibleRevenue=(strategyId==='ltda'&&e.ltda?.cis||strategyId==='toll'&&e.tollIsFloor)
      ?(y<=15?merchantCase.mchY[i]:merchantCase.mchY[14]*degradationFactor(e,y)/degradationFactor(e,15)):undefined;
    annual.push({secured,renewal,merchant,opex,capex:augmentation,tax:0,...(supportEligibleRevenue==null?{}:{supportEligibleRevenue}),
      ...(supportMonths?.length?{supportMonths}: {})});
  }
  return {result:r,annual,primaryTerm};
}
