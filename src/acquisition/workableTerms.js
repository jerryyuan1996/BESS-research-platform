import { referenceInputs } from './reference.js';
import { acquisitionHeadroom, valueAcquisition, returnAtAcquisitionPrice } from './valuation.js';

const pick=(m,stage,u,key)=>referenceInputs(m,stage,u).find(c=>c.key===key)?.input;
function threshold(f,low,high,increasing){
  let fl=f(low),fh=f(high);
  if(fl==null||fh==null||!Number.isFinite(fl)||!Number.isFinite(fh))return null;
  if(increasing&&fl>=0)return low;
  if(!increasing&&fl<0||increasing&&fh<0)return null;
  if(!increasing&&fh>=0)return high;
  for(let i=0;i<36;i++){const mid=(low+high)/2,v=f(mid);if(v==null||!Number.isFinite(v))return null;if((v>=0)===increasing)high=mid;else low=mid;}
  return increasing?high:low;
}

/** Conditional, one-input-at-a-time reverse underwriting. Never changes the
 * project's existing model or promises that an offtaker will offer the terms. */
export function workableTerms(market,stage,investor,overrides={},caseKey='base'){
  const input=pick(market,stage,overrides,caseKey);
  if(!input)return null;
  const solved=valueAcquisition(input,investor);
  if(!solved.audit)return null;
  const target=overrides.targetReturn??Math.max(...solved.audit.map(a=>a.target));
  const price=overrides.purchasePricePerMW??0;
  const fixed={...overrides,targetReturn:target};
  const at=u=>pick(market,stage,{...fixed,...u},caseKey);
  const check=u=>{const c=at(u);return c?acquisitionHeadroom(c,investor,price):null;};
  const scale=Math.max(1,input.annual[0].secured+input.annual[0].renewal+input.annual[0].merchant);
  const contractYears=overrides.contractTenorYears??10;
  const contract={strategyId:'conditional-toll',contractMode:'assumed',contractTenorYears:contractYears};
  const minimumContractIncome=threshold(x=>check({...contract,contractIncomePerMW:x}),0,scale*20,true);
  let minimumContractYears=null;
  if(overrides.contractIncomePerMW>0){for(let years=1;years<=25;years++){const gap=check({...contract,contractTenorYears:years,contractIncomePerMW:overrides.contractIncomePerMW});if(gap!=null&&gap>=0){minimumContractYears=years;break;}}}
  const maxBuild=stage==='operating'?null:threshold(x=>check({remainingBuildPerMW:x,unfixedConstructionPerMW:0}),0,Math.max(scale*100,100000000),false);
  const cod=input.scenarios.find(s=>s.operates).codYears*12;
  const delays=stage==='operating'?[]:[6,12].map(months=>{
    const c=at({monthsToOperation:cod+months}),v=valueAcquisition(c,investor);
    return {months,pricePerMW:v.pricePerMW??0,atPrice:returnAtAcquisitionPrice(c,investor,price,{route:overrides.returnRoute})};
  });
  return {currency:input.currency,pricePerMW:price,targetReturn:target,caseKey,contractYears,minimumContractIncome,minimumContractYears,maxBuild,
    basePricePerMW:solved.pricePerMW??0,delays,
    priceSensitivity:[.08,.10,.12,.15].map(targetReturn=>{const v=valueAcquisition({...input,targetReturn},investor);return {targetReturn,pricePerMW:v.pricePerMW??0,status:v.status};})};
}
