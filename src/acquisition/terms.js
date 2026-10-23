import { nominalAnnual } from './cashflows.js';

/** Facts beside an IRR come from its exact priced cash flows, not the market's
 * default design. Money is per whole-project MW in the cash-flow currency. */
export function referenceTerms(market,input,u,{buildBudget,development,grant,modelToCash=1}){
  const e=market.comparison.economics,age=input.operatingAgeYears??0;
  const scenario=input.scenarios.find(s=>s.operates);
  const first=nominalAnnual(input,scenario)[0];
  const total=first.secured+first.merchant+first.renewal;
  const remaining=Math.max(0,(input.contractYears??0)-age);
  const kind=input.strategyId==='mer'?'merchant':input.revenueSupport?.type==='cis'?'collar'
    :input.revenueSupport?.type==='floor'?'floor':input.strategyId==='toll'?'fixed'
      :input.strategyId==='ltda'?'award':'capacity';
  // The current public plays price whole-project contracts. This is an explicit
  // scenario assumption, not a claim about a signed project or a revenue share.
  const capacityShare=kind==='merchant'||remaining===0?0:kind==='fixed'||kind==='floor'?1:null;
  const support=input.revenueSupport;
  return {kind,remainingContractYears:remaining,capacityShare,
    securedRevenueShare:total>0?first.secured/total:0,
    contractIncomePerMW:remaining>0?first.secured:0,firstRevenuePerMW:total,
    quotedIncomePerMW:remaining>0&&kind==='fixed'?e.toll*modelToCash:null,
    merchantIncomePerMW:first.merchant+first.renewal,
    floorPerMW:support?.floor??null,ceilingPerMW:support?.ceiling??null,
    paymentCapPerMW:support?.paymentCap??null,
    topUpShare:support?.supportShare??.9,repaymentShare:support?.sharingShare??.5,
    firstOpexPerMW:first.opex,
    buildPerMW:input.stage==='operating'?0:buildBudget,
    developmentPerMW:input.stage==='greenfield'?development:0,
    worksPerMW:input.stage==='operating'?scenario.costs.reduce((sum,c)=>sum+c.amount,0):0,
    grantPerMW:grant,constructionMonths:e.constructionMonths??null,
    modelMonthsToOperation:scenario.codYears*12,
    lifeYears:input.annual.length,age,
    indexed:input.securedIndexation!=='fixed',contractAssumed:!u.contractConfirmed,
    costBasis:'current',opexBasis:'first-full-year',
  };
}
