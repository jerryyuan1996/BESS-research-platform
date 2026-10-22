import { acquisitionHeadroom } from './valuation.js';

/** Inverse budget with the same cash dates, VAT recovery and tax account.
 * Construction alone moves; development, income and return assumptions do not. */
export function atConstructionBudget(input,oldBudget,newBudget){
  const ratio=oldBudget>0?newBudget/oldBudget:0;
  const creditChange=(input.scalableTaxCreditBasisReduction??0)*(ratio-1);
  return {...input,scenarios:input.scenarios.map(s=>({...s,
    costs:s.costs.map(c=>c.kind==='construction'?{...c,amount:c.amount*ratio}:c),
    recoveries:s.recoveries.map(c=>['construction-vat','investment-credit'].includes(c.kind)?{...c,amount:c.amount*ratio}:c)})),
    taxPolicy:input.taxPolicy?{...input.taxPolicy,basisPerMW:Math.max(0,input.taxPolicy.basisPerMW+(newBudget-oldBudget)*.85-creditChange)}:null,
    saleTax:{...input.saleTax,basisPerMW:Math.max(0,input.saleTax.basisPerMW+newBudget-oldBudget-creditChange)}};
}
export function constructionCeiling(input,investor,budget,price=0){
  if(input.stage==='operating'||!(budget>0)||!input.scenarios.some(s=>s.costs.some(c=>c.kind==='construction')))return null;
  const f=x=>acquisitionHeadroom(atConstructionBudget(input,budget,x),investor,price);
  if(!(f(0)>=0))return null;
  let lo=0,hi=budget*2;while(f(hi)>0&&hi<budget*100)hi*=2;
  if(f(hi)>0)return null;
  for(let i=0;i<36;i++){const mid=(lo+hi)/2;if(f(mid)>=0)lo=mid;else hi=mid;}
  return lo;
}
