import { referenceInputs } from '../acquisition/reference.js';
import { valueAcquisition, returnAtAcquisitionPrice, acquisitionCashFlows } from '../acquisition/valuation.js';
import { nominalAnnual, taxSchedule } from '../acquisition/cashflows.js';
import { designRunOptions } from '../comparison/designFit.js';
import { leveredReturn, targetTest } from '../acquisition/leverage.js';
import { baseStrategy } from '../comparison/strategies.js';

export const INVESTMENT_LIFE = 20;
export const INVESTMENT_STAGE = 'ready-to-build';
export const investmentPV = (flows, rate) => flows.reduce((sum,c)=>sum+c.amount/(1+rate)**c.at,0);
export const investmentRoutes = input => input.stage==='operating'?['hold']:['hold','sale'];
export function pricingOptions(market, play){
  const { capacityFloor, capacityFactors, ...rest } = play?.econ?.runOptions || {};
  return designRunOptions(market,play.route,play.hours,rest);
}
export function evaluateInvestment(reference, investor, price, targetReturn){
  const input=reference.input;
  input.targetReturn=targetReturn;
  const first=input.scenarios.find(s=>s.operates);
  const annual=taxSchedule(input,nominalAnnual(input,first),first,price).annual;
  const operating=annual.map(y=>y.secured+y.renewal+y.merchant-y.opex-y.capex-y.tax);
  return {...reference,ceiling:valueAcquisition(input,investor),
    atPrice:returnAtAcquisitionPrice(input,investor,price),
    holdReturn:returnAtAcquisitionPrice(input,investor,price,{route:'hold'}),
    saleReturn:returnAtAcquisitionPrice(input,investor,price,{route:'sale'}),
    npv:Math.min(...investmentRoutes(input).map(route=>
      investmentPV(acquisitionCashFlows(input,investor,route,price).flows,targetReturn))),
    levered:leveredReturn(input,investor,price,{buildBudget:reference.assumptions.buildBudget,terms:reference.assumptions.terms}),
    annual,operating,price,codMonths:reference.assumptions.codYears*12,
    qualifiedMonths:reference.assumptions.codYears*12+(input.revenueQualificationMonths??0)};
}
export function referenceInvestment(market, investor, play, values={}){
  const chosen=play||{route:baseStrategy(market),hours:market.comparison.archetype.durationHours};
  const stage=values.stage||INVESTMENT_STAGE;
  const options={play:chosen,strategyId:chosen.route,economicLifeYears:values.lifeYears??INVESTMENT_LIFE,
    operatingAgeYears:0,debt:null,runOptions:pricingOptions(market,chosen),
    economicOverrides:values.economicOverrides,
    ...(values.usSupply==null?{}:{usSupply:values.usSupply}),
    ...(values.baselineMonths==null?{}:{monthsToOperation:values.baselineMonths})};
  const reference=referenceInputs(market,stage,options).find(c=>c.key==='base');
  if(!reference)return null;
  const initial=valueAcquisition(reference.input,investor);
  const target=values.targetPercent!=null?values.targetPercent/100:
    initial.targetReturn??Math.max(...(initial.audit||[]).map(a=>a.target));
  if(!Number.isFinite(target))return null;
  reference.input.revenueQualificationMonths=values.baselineQualificationMonths??0;
  return {result:evaluateInvestment(reference,investor,values.purchasePricePerMW??0,target),
    options,target,play:chosen,stage};
}
export function investmentMetrics(reference){
  if(!reference)return null;
  const {input,annual}=reference,y=annual[0],gross=y.secured+y.renewal+y.merchant;
  const fx=input.fxToUSD;
  const holdIRR=reference.holdReturn?.annualReturn??null,lev=reference.levered;
  const leveredIRR=lev?.annualReturn??null;
  return {irr:reference.atPrice?.annualReturn??null,holdIRR,
    saleIRR:reference.saleReturn?.annualReturn??null,route:reference.atPrice?.route??null,
    leveredIRR,leverage:lev?{gearing:lev.gearing,loanPerMW:lev.loanPerMW,contractedDSCR:lev.contractedDSCR,
      merchantDSCR:lev.merchantDSCR,legalYears:lev.legalYears,notionalYears:lev.notionalYears,rate:lev.rate,
      minCover:lev.minCover,balloonShare:lev.balloonShare,capBinds:lev.capBinds}:null,
    test:targetTest(holdIRR,leveredIRR,input.targetReturn),
    usSupply:reference.assumptions.usSupply??null,
    currency:input.currency,fxToUSD:fx,powerMW:input.powerMW,hours:input.durationHours,
    capexPerMW:reference.assumptions.buildBudget,capexPerMWh:reference.assumptions.buildBudget/input.durationHours,
    capexTotal:reference.assumptions.buildBudget*input.powerMW,
    rtbMonths:reference.codMonths,qualifiedMonths:reference.qualifiedMonths,
    lifeYears:input.annual.length,stage:input.stage,targetReturn:input.targetReturn,
    secured:gross>0?y.secured/gross:0,securedYears:input.contractYears,
    bridge:{fixed:y.secured*fx,renewal:y.renewal*fx,trading:y.merchant*fx,service:0,
      operating:(y.opex+y.capex)*fx,tax:y.tax*fx,net:reference.operating[0]*fx,gross:gross*fx},
    operatingUSD:reference.operating.map(v=>v*fx)};
}
