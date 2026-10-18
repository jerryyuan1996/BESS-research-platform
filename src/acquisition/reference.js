import { runCase } from '../comparison/engine.js';
import { withOverrides } from '../comparison/scenario.js';
import { baseStrategy } from '../comparison/strategies.js';
import { valueAcquisition, publicAcquisition, debtRiskClass } from './valuation.js';
import { STAGES, RATE_SNAPSHOT } from './parameters.js';

/** No assumed tax rate, free grid connection, free development or free
 * retirement is invented to make an incomplete market appear investable. */
export function acquisitionInput(market,stage,overrides={}){
  const declared=market.comparison?.acquisition || {};
  const u={...declared,...declared.stages?.[stage],...overrides};
  const strategyId=u.strategyId || baseStrategy(market);
  const variant=u.economicOverrides?withOverrides(market,u.economicOverrides):market;
  const result=runCase(variant,strategyId,0);
  if(result.na) return {stage,conditionsMet:false,sources:[],reason:result.na};
  const e=variant.comparison.economics;
  const age=u.operatingAgeYears??0;
  // Longer lives need new cash-flow evidence, not repeated year-15 revenue.
  const life=u.economicLifeYears??15;
  const validAge=Number.isInteger(age)&&age>=0&&age<life&&life<=result.eb.length;
  const taxKnown=Number.isFinite(u.cashTaxRate)&&u.cashTaxRate>=0&&u.cashTaxRate<=1;
  const annual=validAge?result.eb.slice(age,life).map((cash,i)=>{
    const year=age+i, secured=u.contractConfirmed?result.secY[year]:0;
    const renewal=(result.aucY?.[year]||0)+(u.contractConfirmed?0:result.secY[year]);
    // eb already deducts declared lifecycle costs. Keep its total exactly once.
    const originalRetirement=year===14?(e.decommissioningPerMW??0)*result.fxRate:0;
    const revenue=result.secY[year]+(result.aucY?.[year]||0)+result.mchY[year];
    const beforeTax=cash+originalRetirement;
    const capex=(e.augmentationSchedule||[]).filter(item=>item.year===year+1).reduce((total,item)=>total+(item.amountPerMW??0)*result.fxRate+result.capexG*(item.pctOfCapex??0)/100,0);
    return {secured,renewal,merchant:result.mchY[year],opex:Math.max(0,revenue-beforeTax-capex),capex,
      tax:taxKnown?Math.max(0,beforeTax+capex)*u.cashTaxRate:null};
  }):[];
  // Comparisons for PL/RO are displayed in EUR but contain local-currency
  // streams translated using separate assumptions. Require an explicit mapping.
  const currency=u.cashFlowCurrency || u.currency || (['pl','ro'].includes(market.manifest.id)?null:market.manifest.currency);
  const fx=u.fxToUSD??result.fxRate;
  const factor=currency===market.manifest.currency?1/result.fxRate:(Number.isFinite(u.fxToUSD)&&u.fxToUSD>0?1/u.fxToUSD:null);
  const normalized=annual.map(y=>Object.fromEntries(Object.entries(y).map(([k,v])=>[k,v==null||factor==null?null:v*factor])));
  const cashYears=Array.isArray(u.annual)?u.annual:normalized;
  const scenarios=stage==='operating'?(u.scenarios||[{probability:1,codYears:0,operates:true,costs:[{at:0,amount:u.initialWorksPerMW}],recoveries:[]}]):u.scenarios;
  return {
    stage,strategyId,currency,fxToUSD:fx,powerMW:market.comparison.archetype.powerMW,durationHours:market.comparison.archetype.durationHours,
    annual:cashYears,operatingAgeYears:age,economicLifeYears:life,
    decommissioningPerMW:u.decommissioningPerMW,fixedFeesPerMW:u.fixedFeesPerMW,
    existingNetDebtPerMW:stage==='operating'?u.existingNetDebtPerMW:0,
    scenarios,developmentRiskConfirmed:u.developmentRiskConfirmed,
    conditionsMet:u.conditionsMet===true && result.feasibility?.status!=='fail',
    saleTax:u.saleTax,additionalPremium:u.additionalPremium,
    debt:stage==='operating'&&u.debt?{...u.debt,riskClass:u.debt.riskClass||debtRiskClass(cashYears,RATE_SNAPSHOT[currency]?.rate??0)}:null,
    sources:u.sources || [],
  };
}

export function marketAcquisition(market,stage,investor,overrides={}){
  const input=acquisitionInput(market,stage,overrides);
  const result=valueAcquisition(input,investor);
  return {input,result};
}

/** Compact build-time projection; internal missing inputs never become home rows.
 * A published reference must explicitly clear the investor's entry conditions.
 * This prevents a computed hypothetical price from changing a stage restriction. */
export function acquisitionRecommendations(markets){
  const out={strategic:[],infraFund:[],foreignFirstTimer:[],developer:[]};
  for(const market of markets){
    for(const investor of Object.keys(out))for(const stage of STAGES){
      const declared=market.comparison?.acquisition;
      if(!declared?.eligibleInvestors?.[stage]?.includes(investor))continue;
      const {input,result}=marketAcquisition(market,stage,investor);
      const priced=publicAcquisition(result);
      if(!priced || !(input.fxToUSD>0))continue;
      out[investor].push({...priced,market:market.manifest.id,hours:input.durationHours,
        priceUSDPerMW:priced.pricePerMW*input.fxToUSD,
        strategyId:input.strategyId,reference:true});
    }
  }
  return out;
}
