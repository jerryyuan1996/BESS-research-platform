import { cisRevenue } from '../economics/revenueSupport.js';
/** Acquisition cash flows are valued in nominal local currency. Real reference
 * lines are inflated at their payment date; fixed nominal contracts stay fixed. */
export const nominalRate=(real,inflation)=>(1+real)*(1+inflation)-1;
export const realRate=(nominal,inflation)=>(1+nominal)/(1+inflation)-1;
/** Price level at `at` years after closing. A market may carry a dated path
 * (annual rates from closing, the last rate continuing); otherwise one rate. */
export function priceIndex(input,at){
  const path=input.inflationPath;
  if(!Array.isArray(path)||!path.length)return (1+(input.inflationRate??0))**at;
  let factor=1;
  for(let t=0;t<at;t++)factor*=(1+path[Math.min(t,path.length-1)])**Math.min(1,at-t);
  return factor;
}
export function nominalAmount(input,amount,at){
  return input.cashFlowBasis==='real'?amount*priceIndex(input,at):amount;
}
export function nominalAnnual(input,scenario){
  return input.annual.map((year,i)=>{
    const at=scenario.codYears+i+1;
    const nominal=Object.fromEntries(Object.entries(year).map(([key,value])=>{
      if(!['secured','renewal','merchant','opex','capex','tax'].includes(key))return [key,value];
      const indexed=key!=='secured'||input.securedIndexation!=='fixed';
      return [key,indexed?nominalAmount(input,value,at):value];
    }));
    const support=input.revenueSupport;
    if(support&&i+(input.operatingAgeYears??0)<support.years){
      const eligible=nominalAmount(input,year.supportEligibleRevenue,at);
      const settled=support.type==='cis'?cisRevenue(eligible,support):{total:Math.max(eligible,support.floor),secured:support.floor};
      nominal.secured=support.assumed?settled.secured:0;
      nominal.renewal=support.assumed?0:settled.secured;
      nominal.merchant=Math.max(0,settled.total-settled.secured);
    }
    // Optional opportunity scenario: qualification may follow physical COD.
    // Costs continue in full; each annual revenue bucket earns only its
    // eligible fraction. Contract expiry stays anchored to physical COD.
    const lag = input.revenueQualificationMonths ?? 0;
    const eligible = Math.max(0, Math.min(1, i + 1 - lag / 12));
    if (lag > 0) for (const key of ['secured','renewal','merchant']) nominal[key] *= eligible;
    return nominal;
  });
}

/** Straight-line screening tax account, with explicit asset/share purchase
 * basis, loss carry-forward, interest limits and separately depreciated works.
 * Annual project tax supplied without a policy is used as-is. */
export function taxSchedule(input,annual,scenario,price,interest=[]){
  const p=input.taxPolicy;
  if(!p)return {annual,depreciation:annual.map(()=>0),remainingBasis:input.saleTax?.basisPerMW??0};
  const age=input.operatingAgeYears??0,years=p.depreciationYears;
  let basis=input.stage==='operating'
    ? p.transactionType==='share'?(p.inheritedBasisPerMW??0):price*(p.depreciableShare??1)
    :nominalAmount(input,p.basisPerMW??0,scenario.codYears/2)+(p.purchaseDepreciableShare??0)*price;
  let losses=p.lossCarryForwardPerMW??0,remaining=basis;
  const remainingYears=input.stage==='operating'&&p.transactionType==='share'?Math.max(1,years-age):years;
  const yearly=basis/remainingYears,vintages=[],depreciation=[];
  const result=annual.map((y,i)=>{
    if(y.capex>0)vintages.push({amount:y.capex/years,end:i+years});
    const deduction=(i<remainingYears?yearly:0)+vintages.reduce((sum,v)=>sum+(i<v.end?v.amount:0),0);
    remaining=Math.max(0,remaining+y.capex-deduction);depreciation.push(deduction);
    const revenue=y.secured+y.renewal+y.merchant,ebitda=revenue-y.opex;
    const allowedInterest=Math.min(interest[i]??0,Math.max(0,ebitda)*(p.interestLimitShare??1));
    const taxable=ebitda-deduction-allowedInterest;
    // Group relief: the owner's group uses a loss in the year it arises, so the
    // project's tax can be negative and nothing is carried forward.
    if(p.groupRelief)return {...y,tax:taxable*p.rate+revenue*(p.turnoverRate??0)};
    const used=Math.min(losses,Math.max(0,taxable)*(p.lossOffsetShare??1));
    losses=Math.max(0,losses-used)+Math.max(0,-taxable);
    return {...y,tax:Math.max(0,taxable-used)*p.rate+revenue*(p.turnoverRate??0)};
  });
  return {annual:result,depreciation,remainingBasis:remaining,initialBasis:basis,losses};
}
