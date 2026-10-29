import { runCase } from '../comparison/engine.js';
import { withOverrides } from '../comparison/scenario.js';
import { baseStrategy, securedTenor } from '../comparison/strategies.js';
import { valueAcquisition, publicAcquisition, debtRiskClass, returnAtAcquisitionPrice } from './valuation.js';
import { STAGES, RATE_SNAPSHOT, INFLATION, ITC_TRANSFER_PRICE } from './parameters.js';
import { usSupplyCapex } from '../comparison/supplierQuote.js';
import { MARKET_REFERENCE, REFERENCE_CASES, REFERENCE_DATE, REFERENCE_SOURCES } from './referencePolicy.js';
import { REFERENCE_PREMIUM } from './parameters.js';
import { operatingReference } from './operating.js';
import { incomeScenario } from './scenarios.js';
import { constructionCeiling } from './construction.js';
import { referenceTerms } from './terms.js';
import { ARCHETYPES } from '../governance/archetypes.js';

/** Strict project adapter. Reference assumptions are added explicitly by
 * marketAcquisitionReference, never silently written into market evidence. */
export function acquisitionInput(market,stage,overrides={}){
  const declared=market.comparison?.acquisition || {};
  const u={...declared,...declared.stages?.[stage],...overrides};
  const {variant,strategyId,chosen,invalid}=incomeScenario(market,u);
  if(invalid)return {stage,conditionsMet:false,sources:[],reason:invalid};
  const life=u.economicLifeYears??15;
  const operating=operatingReference(variant,strategyId,life,u.runOptions||{}),result=operating.result;
  if(result.na) return {stage,conditionsMet:false,sources:[],reason:result.na};
  const e=variant.comparison.economics;
  const age=u.operatingAgeYears??0;
  const validAge=Number.isInteger(age)&&age>=0&&age<life&&Number.isInteger(life)&&life<=35;
  const taxKnown=Number.isFinite(u.cashTaxRate)&&u.cashTaxRate>=0&&u.cashTaxRate<=1;
  const annual=validAge?operating.annual.slice(age,life).map((cash,i)=>{
    const year=age+i,hasContract=(u.contractConfirmed||u.contractAssumed)&&u.contractMode!=='none';
    const inTerm=u.contractTenorYears==null||year<u.contractTenorYears;
    const secured=hasContract&&inTerm?cash.secured:0;
    // An expired fixed toll/award is not quietly re-awarded. Unsecured auction
    // renewals remain at risk; a signed or assumed contract is a separate case.
    const unconfirmed=inTerm?cash.secured:0;
    const renewal=(cash.renewal+(hasContract?0:unconfirmed))*(u.unsecuredRevenueFactor??1);
    const capex=cash.capex;
    const canTrade=strategyId!=='toll'||e.tollIsFloor||year>=(e.tollYears??15)&&e.tollRevertsToMerchant;
    const extraReserve=canTrade?(u.additionalReserveNetPerMW??0)*result.fxRate*(1-(e.degr||2)/100)**year:0;
    const merchant=(cash.merchant+extraReserve)*(u.unsecuredRevenueFactor??1);
    const opex=cash.opex*(u.operatingCostFactor??1);
    const adjustedRevenue=secured+renewal+merchant;
    return {secured,renewal,merchant,opex,capex,
      ...(cash.supportEligibleRevenue==null?{}:{supportEligibleRevenue:(cash.supportEligibleRevenue+extraReserve)*(u.unsecuredRevenueFactor??1)}),
      tax:u.taxPolicy?0:taxKnown?Math.max(0,adjustedRevenue-opex)*u.cashTaxRate+adjustedRevenue*(u.turnoverTaxRate??0):null};
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
    stage,strategyId,currency,fxToUSD:fx,powerMW:variant.comparison.archetype.powerMW,durationHours:variant.comparison.archetype.durationHours,
    commercialScenario:chosen,contractYears:operating.primaryTerm,
    annual:cashYears,operatingAgeYears:age,economicLifeYears:life,
    decommissioningPerMW:u.decommissioningPerMW,fixedFeesPerMW:u.fixedFeesPerMW,
    existingNetDebtPerMW:stage==='operating'?u.existingNetDebtPerMW:0,
    scenarios,developmentRiskConfirmed:u.developmentRiskConfirmed,developmentRiskAssumed:u.developmentRiskAssumed,
    conditionsMet:u.conditionsMet===true && result.feasibility?.status!=='fail',
    conditionsAssumed:u.conditionsAssumed===true && u.conditionsMet!==false && result.feasibility?.status!=='fail',
    saleTax:u.saleTax,additionalPremium:u.additionalPremium,
    cashFlowBasis:u.cashFlowBasis??(Array.isArray(u.annual)?'nominal':'real'),inflationRate:u.inflationRate??0,inflationPath:u.inflationPath??null,
    securedIndexation:u.securedIndexation??'fixed',taxPolicy:u.taxPolicy,
    revenueSupport:Array.isArray(u.annual)?null:e.ltda?.cis&&strategyId==='ltda'?{type:'cis',years:u.contractTenorYears??e.ltda.years,
      ...Object.fromEntries(Object.entries(e.ltda.cis).map(([k,v])=>[k,v*result.fxRate*factor])),assumed:!!(u.contractAssumed||u.contractConfirmed)}
      :strategyId==='toll'&&e.tollIsFloor?{type:'floor',years:e.tollYears,floor:e.toll*result.fxRate*factor,assumed:!!(u.contractAssumed||u.contractConfirmed)}:null,
    referencePremium:u.referencePremium,targetReturn:u.targetReturn,buyerDiscountRate:u.buyerDiscountRate,
    taxCreditBasisReduction:u.taxCreditBasisReduction??0,
    scalableTaxCreditBasisReduction:u.scalableTaxCreditBasisReduction??0,
    debt:stage==='operating'&&u.debt?{...u.debt,riskClass:u.debt.riskClass||debtRiskClass(cashYears,RATE_SNAPSHOT[currency]?.rate??0)}:null,
    sources:u.sources || [],
  };
}

export function marketAcquisition(market,stage,investor,overrides={}){
  const input=acquisitionInput(market,stage,overrides);
  const result=valueAcquisition(input,investor);
  return {input,result};
}

const supplied = object => Object.fromEntries(Object.entries(object||{}).filter(([,v])=>v!==undefined));

/** Two complete public scenarios. Project values (including explicit zero and
 * false) win. Missing data becomes a visible assumption, not a missing market. */
export function referenceInputs(market,stage,overrides={}){
  const policy=MARKET_REFERENCE[market.manifest.id];
  if(!policy || !market.comparison || market.comparison.engineReady===false)return [];
  const declared=market.comparison.acquisition||{};
  const u={...supplied(declared),...supplied(declared.stages?.[stage]),...supplied(overrides)};
  const {variant:incomeVariant,strategyId,chosen,invalid}=incomeScenario(market,u);
  if(invalid)return [];
  /* US new builds price a named DC-block supply: 'non-feoc' carries the 30%
     storage credit, 'chinese' carries none; 'as-entered' keeps the capex given. */
  const usSupply=policy.usQueue&&stage!=='operating'?(u.usSupply??'non-feoc'):null;
  const ve=incomeVariant.comparison.economics;
  const variant=usSupply&&usSupply!=='as-entered'?{...incomeVariant,comparison:{...incomeVariant.comparison,economics:{...ve,
    capexPerMW:usSupplyCapex(ve.capexPerMW,incomeVariant.comparison.archetype.durationHours,usSupply)}}}:incomeVariant;
  const supportCase=u.supportCase??(usSupply==='non-feoc'?'us-itc30':'none');
  const r=runCase(variant,strategyId,0,u.runOptions||{});
  if(r.na || r.feasibility?.status==='fail')return [];
  const e=variant.comparison.economics;
  const currency=u.cashFlowCurrency||u.currency||policy.currency||market.manifest.currency;
  const fx=u.fxToUSD??(policy.currency===currency?r.fxRate/policy.unitsPerEUR:r.fxRate);
  if(!(fx>0))return [];
  const build=r.buildCapexG/fx;
  const sourceIds=[...new Set([...policy.sourceIds,'life','queue','retirement','inflation','taxMethod','returnCalibration',...(e.ltda?.cis?['cis']:[]),...(market.manifest.id==='fi'?['reserve']:[]),...(supportCase.startsWith('us-itc')?['itc','creditPrice']:[]),...(usSupply?['feoc','usSupply']:[]),'leverage','equitySurvey'])];
  return REFERENCE_CASES.map(c=>{
    const cautious=c.id==='cautious';
    const age=u.operatingAgeYears??(stage==='operating'?c.operatingAge:0);
    const tax=u.cashTaxRate??policy.taxRates[cautious?1:0];
    const pathway=stage==='ready-to-build'?policy.rtbYears:policy.greenfieldYears;
    const localYears=pathway?(c.id==='base'?(pathway[0]+pathway[1])/2:pathway[cautious?1:0]):null;
    const defaultYears=localYears??(stage==='ready-to-build'?c.rtbYears:policy.usQueue?c.usGreenfieldYears:c.greenfieldYears);
    const years=u.monthsToOperation!=null?u.monthsToOperation/12:stage==='operating'?0:Math.max(defaultYears,(e.constructionMonths??0)/12);
    const development=u.developmentPerMW??build*c.developmentShare;
    const remainingBuild=u.remainingBuildPerMW??build;
    const contingency=u.unfixedConstructionPerMW!=null?u.unfixedConstructionPerMW*(stage==='greenfield'?.10:.075):remainingBuild*(c.buildFactor-1);
    // Existing grid contributions are in buildCapexG. Never add them twice.
    const grid=u.remainingBuildPerMW!=null || e.gridContributionPerMW!=null?0:build*c.gridReserve;
    const budget=remainingBuild+contingency+grid;
    const creditRate=stage==='operating'||!policy.usQueue?0:supportCase==='us-itc30'?.30:supportCase==='us-itc6'?.06:0;
    // The credit is earned on build cost before contingency and grid allowance.
    // A caller that supplies an all-in budget passes that pre-contingency cost.
    const creditBuild=u.creditBuildPerMW??remainingBuild;
    const creditBasis=u.eligibleTaxCreditBasisPerMW??creditBuild*.85;
    const grossCredit=creditBasis*creditRate,netCredit=grossCredit*(u.creditRealisationFactor??ITC_TRANSFER_PRICE);
    const grant=stage==='operating'?0:u.capitalSupportPerMW??r.grant/fx;
    const vat=budget*(e.vatPct||0)/100;
    const vatLag=(e.vatLagMonths>0?e.vatLagMonths:cautious?12:6)/12;
    const costs=cod=>[{kind:'construction',at:cod/2,amount:budget+vat}];
    const recoveries=cod=>[
      ...(e.vatRecoverable===false?[]:[{kind:'construction-vat',at:cod/2+vatLag,priceAt:cod/2,amount:vat}]),
      ...(netCredit>0?[{kind:u.eligibleTaxCreditBasisPerMW==null?'investment-credit':'fixed-investment-credit',at:cod+(u.supportLagMonths??12)/12,priceAt:cod/2,amount:netCredit}]:[]),
      ...(grant>0?[{kind:'capital-grant',at:cod+(u.supportLagMonths??12)/12,priceAt:cod/2,amount:grant}]:[]),
    ];
    const success=policy.usQueue?c.usSuccess:c.success;
    const onTime=u.onTimePercent!=null?u.onTimePercent/100:success*.75;
    const delayed=u.delayedPercent!=null?u.delayedPercent/100:success*.25;
    const lateYears=years+(u.delayMonths??12)/12;
    const scenarios=stage==='operating'?[{probability:1,codYears:0,operates:true,costs:[{at:0,amount:u.initialWorksPerMW??build*c.refurbishmentShare}],recoveries:[]}]
      :stage==='ready-to-build'?[{probability:1,codYears:years,operates:true,costs:costs(years),recoveries:recoveries(years)}]
      :[
        {probability:onTime,codYears:years,operates:true,costs:[{at:0,amount:development},...costs(years)],recoveries:recoveries(years)},
        {probability:delayed,codYears:lateYears,operates:true,costs:[{at:0,amount:development},...costs(lateYears)],recoveries:recoveries(lateYears)},
        {probability:1-onTime-delayed,codYears:0,operates:false,costs:[{at:0,amount:u.failureSpendPerMW??development}],recoveries:[{at:(u.refundMonths??12)/12,priceAt:0,amount:u.failureRefundPerMW??0}]},
      ];
    const defaults={cashFlowCurrency:currency,fxToUSD:fx,strategyId:chosen,
      economicLifeYears:c.lifeYears,operatingAgeYears:age,cashTaxRate:tax,turnoverTaxRate:policy.turnoverTax??0,
      unsecuredRevenueFactor:c.revenueFactor,operatingCostFactor:c.opexFactor,
      fixedFeesPerMW:build*(cautious?.005:.002),existingNetDebtPerMW:0,
      decommissioningPerMW:e.decommissioningPerMW!=null?e.decommissioningPerMW*r.fxRate/fx:build*c.retirementShare,
      conditionsAssumed:true,developmentRiskAssumed:true,contractConfirmed:false,contractAssumed:u.contractMode!=='none',scenarios,
      saleTax:{rate:policy.saleTaxRate??tax,basisPerMW:Math.max(0,budget+(stage==='greenfield'?development:0)-grossCredit*.5-grant),includePurchase:true,transactionType:'asset'},
      cashFlowBasis:'real',inflationRate:policy.inflationRate??INFLATION,securedIndexation:'indexed',
      // A market's dated path applies only while no rate is entered for the case.
      inflationPath:u.inflationRate==null?policy.inflationPath??null:null,
      referencePremium:REFERENCE_PREMIUM,
      additionalReserveNetPerMW:market.manifest.id==='fi'?c.reserveNet:0,
      taxPolicy:Array.isArray(u.annual)?null:{rate:tax,turnoverRate:policy.turnoverTax??0,depreciationYears:u.depreciationYears??policy.depreciationYears??c.taxYears,groupRelief:policy.groupRelief??false,
        basisPerMW:Math.max(0,(budget+(stage==='greenfield'?development:0))*.85-grossCredit*.5-grant),depreciableShare:.85,purchaseDepreciableShare:0,
        transactionType:u.transactionType??'asset',inheritedBasisPerMW:u.inheritedTaxBasisPerMW??build*.85*Math.max(0,1-age/(u.depreciationYears??policy.depreciationYears??c.taxYears)),
        lossOffsetShare:policy.lossOffsetShare??1,interestLimitShare:.3},
      additionalPremium:c.extraPremium,debt:stage==='operating'?{mode:'new'}:null};
    defaults.taxCreditBasisReduction=grossCredit*.5;
    defaults.scalableTaxCreditBasisReduction=u.eligibleTaxCreditBasisPerMW==null?grossCredit*.5:0;
    const complete={...defaults,...u,sources:[...sourceIds.map(id=>({label:REFERENCE_SOURCES[id].label[0],url:REFERENCE_SOURCES[id].url})),...(u.sources||[])]};
    const input=acquisitionInput(market,stage,complete);
    return {input,key:c.id,assumptions:{
      taxRate:complete.cashTaxRate,turnoverTaxRate:complete.turnoverTaxRate,age:complete.operatingAgeYears,
      revenueFactor:complete.unsecuredRevenueFactor,opexFactor:complete.operatingCostFactor,
      codYears:Math.min(...input.scenarios.filter(s=>s.operates).map(s=>s.codYears)),
      latestCodYears:Math.max(...input.scenarios.filter(s=>s.operates).map(s=>s.codYears)),
      success:input.scenarios.filter(s=>s.operates).reduce((sum,s)=>sum+s.probability,0),
      development:stage==='greenfield'?development:0,buildBudget:stage==='operating'?0:budget,
      gridAllowance:stage==='operating'?0:grid,retirement:input.decommissioningPerMW,fixedFees:input.fixedFeesPerMW,
      contractConfirmed:complete.contractConfirmed,sourceIds,
      contractAssumed:complete.contractAssumed,life:complete.economicLifeYears,inflation:complete.inflationRate,
      depreciationYears:complete.taxPolicy?.depreciationYears,transactionType:complete.taxPolicy?.transactionType,
      additionalReserveNetPerMW:complete.additionalReserveNetPerMW,
      capitalSupportPerMW:netCredit+grant,supportCase,usSupply,creditBuildPerMW:creditBuild,
      taxOverridden:u.cashTaxRate!=null,annualOverridden:Array.isArray(u.annual),scenariosOverridden:Array.isArray(u.scenarios),
      terms:referenceTerms(variant,input,complete,{buildBudget:budget,development,grant,modelToCash:r.fxRate/fx}),
    }};
  });
}

/** A reference can explain an uneconomic case instead of disappearing. Every
 * positive endpoint still uses min(hold ceiling, sale ceiling), never the max. */
export function marketAcquisitionReference(market,stage,investor,overrides={}){
  const cases=referenceInputs(market,stage,overrides);
  if(!cases.length)return {status:'incomplete',missing:['reference model']};
  const valued=cases.map(c=>({...c,result:valueAcquisition(c.input,investor)}));
  if(valued.some(c=>!['priced','no-positive-price'].includes(c.result.status)))return valued.find(c=>!['priced','no-positive-price'].includes(c.result.status)).result;
  const endpoints=valued.map(({key,input,result:r,assumptions})=>{
    const binding=r.status==='priced'?r:r.audit.filter(a=>a.status!=='priced').sort((a,b)=>a.npvAtFloor-b.npvAtFloor)[0];
    return {key,status:r.status,pricePerMW:r.pricePerMW??0,targetReturn:r.targetReturn??binding.target,
      route:r.route??binding.route,exitYear:r.exitYear??(binding.route==='sale'?(investor==='developer'?0:5):null),
      returnBasis:r.returnBasis??(input.debt?'equity':'all-cash'),remainingYears:input.annual.length,
      equityPaymentPerMW:r.equityPaymentPerMW??null,closingEquityPerMW:r.closingEquityPerMW??null,
      futureInvestmentPerMW:r.futureInvestmentPerMW??Math.max(...input.scenarios.map(s=>s.costs.reduce((sum,c)=>sum+c.amount,0))),loanPerMW:r.loanPerMW??0,
      atPrice:overrides.purchasePricePerMW!=null?returnAtAcquisitionPrice(input,investor,overrides.purchasePricePerMW,{route:overrides.returnRoute})
        :r.status==='no-positive-price'?returnAtAcquisitionPrice(input,investor,0):null,
      costGapPVPerMW:r.status==='priced'?0:Math.max(...r.audit.map(a=>Math.max(0,-(a.npvAtFloor??0)))),assumptions};
  });
  const baseCase=valued.find(c=>c.key==='base');
  const workableBuildPerMW=baseCase&&stage!=='operating'&&baseCase.result.status!=='priced'
    ?constructionCeiling(baseCase.input,investor,baseCase.assumptions.buildBudget,overrides.purchasePricePerMW??0):null;
  const prices=endpoints.map(r=>r.pricePerMW),first=cases[0].input;
  return {status:'reference',estimated:true,stage,investor,currency:first.currency,fxToUSD:first.fxToUSD,
    durationHours:first.durationHours,strategyId:first.strategyId,asOf:REFERENCE_DATE,
    contractYears:first.contractYears,commercialScenario:first.commercialScenario,
    pricePerMW:Math.min(...prices),priceRangePerMW:[Math.min(...prices),Math.max(...prices)],
    baseCaseKey:'base',
    quotedPricePerMW:overrides.purchasePricePerMW??null,
    workableBuildPerMW,
    targetReturn:endpoints[0].targetReturn,referenceCases:endpoints,
    baseRate:RATE_SNAPSHOT[first.currency].rate,rateDate:RATE_SNAPSHOT.date,rateSource:RATE_SNAPSHOT[first.currency].source,
    marketSourceDate:market.manifest.lastVerified||market.manifest.asOf,
    customSources:overrides.sources||[],
    modelCurrency:market.manifest.currency,localUnitsPerModelUnit:cases[0].input.fxToUSD?runCase(market,first.strategyId,0).fxRate/first.fxToUSD:1};
}

/** Exact project records take priority. Otherwise publish a labelled public
 * reference, including cases whose future costs leave no acquisition budget. */
export function acquisitionRecommendations(markets){
  const out={strategic:[],infraFund:[],foreignFirstTimer:[],developer:[]};
  for(const market of markets){
    for(const investor of Object.keys(out))for(const stage of STAGES){
      const declared=market.comparison?.acquisition;
      if(!ARCHETYPES[investor].entersAt.includes(stage))continue;
      const eligible=declared?.eligibleInvestors?.[stage];
      if(eligible&&!eligible.includes(investor))continue;
      const {input,result}=marketAcquisition(market,stage,investor);
      const priced=publicAcquisition(result)||marketAcquisitionReference(market,stage,investor);
      if(!['priced','reference'].includes(priced?.status))continue;
      if(!priced || !(priced.fxToUSD>0))continue;
      out[investor].push({...priced,market:market.manifest.id,hours:input.durationHours,
        priceUSDPerMW:priced.pricePerMW*priced.fxToUSD,
        strategyId:input.strategyId,reference:true});
    }
  }
  return out;
}
