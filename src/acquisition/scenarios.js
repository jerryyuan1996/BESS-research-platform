import { withOverrides } from '../comparison/scenario.js';
import { baseStrategy, supportedStrategies } from '../comparison/strategies.js';
import { runCase } from '../comparison/engine.js';
import { cisRevenue } from '../economics/revenueSupport.js';
import { marketForPlay } from './play.js';

export function incomeOptions(market){
  return [...supportedStrategies(market).map(s=>({id:s.id,label:s.n})),
    {id:'conditional-floor',label:['Negotiated floor (assumed)','谈判保底（假设）']},
    {id:'conditional-toll',label:['Fixed income contract (assumed)','固定收入合同（假设）']}];
}
/** Private quotes replace the reference's contract terms. Conditional contracts
 * are explicit counterfactuals, never a claim that an offtaker has offered them. */
export function incomeScenario(market,u){
  let variant=marketForPlay(market,u.play);
  if(variant.na)return {variant,strategyId:u.strategyId,chosen:u.strategyId,invalid:variant.na[0]};
  variant=u.economicOverrides?withOverrides(variant,u.economicOverrides):variant;
  const chosen=u.contractMode==='none'?'mer':u.strategyId||baseStrategy(market),conditional=chosen.startsWith('conditional-');
  const strategyId=conditional?'toll':chosen;
  const units=['pl','ro'].includes(market.manifest.id)?(market.manifest.id==='pl'?4.37:5.331):1;
  const changes={};
  if(conditional){
    // Quote an illustrative floor against the full-ready revenue stack. A
    // delayed start changes eligible cash, not the agreed annual floor rate.
    const readiness=variant.comparison.economics.revenueReadiness;
    const r=runCase(variant,'mer',0,{revenueReadiness:readiness?.reserveSharePct==null?{}:{reserveSharePct:readiness.reserveSharePct}});
    if(r.na)return {variant,strategyId,chosen,invalid:r.na[0]};
    const expected=(r.secY[0]+r.aucY[0]+r.mchY[0])/r.fxRate;
    variant={...variant,comparison:{...variant.comparison,capabilities:{...variant.comparison.capabilities,tolling:true},economics:{...variant.comparison.economics,
      toll:expected*(chosen==='conditional-floor'?.5:.75),tollYears:chosen==='conditional-floor'?7:10,
      tollIsFloor:chosen==='conditional-floor',tollAdditiveWithCapacity:false,tollRevertsToMerchant:true}}};
  }
  if(u.contractIncomePerMW!=null){
    const key=strategyId==='toll'?'toll':strategyId==='ltda'?'ltda.payment':'contracted';
    changes[key]=u.contractIncomePerMW/units;
  }
  if(u.contractTenorYears!=null){
    const key=strategyId==='toll'?'tollYears':strategyId==='ltda'?'ltda.years':'contractYears';changes[key]=u.contractTenorYears;
  }
  for(const [key,path] of [['cisFloorPerMW','floor'],['cisCeilingPerMW','ceiling'],['cisPaymentCapPerMW','paymentCap']])if(u[key]!=null)changes['ltda.cis.'+path]=u[key]/units;
  variant=withOverrides(variant,changes);
  if(strategyId==='ltda'&&variant.comparison.economics.ltda?.cis){try{cisRevenue(0,variant.comparison.economics.ltda.cis);}catch{return {variant,strategyId,chosen,invalid:'CIS floor must not exceed ceiling; caps must be nonnegative'};}}
  return {variant,strategyId,chosen};
}
