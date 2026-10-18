import { RATE_SNAPSHOT, INVESTOR_PREMIUM, STAGES, FEES, DEBT } from './parameters.js';

const finite = x => typeof x === 'number' && Number.isFinite(x);
const nonnegative = x => finite(x) && x >= 0;
const pv = (cash,at,rate) => cash/(1+rate)**at;
const sum = values => values.reduce((a,b)=>a+b,0);
const annuity = (rate,years) => rate === 0 ? 1/years : rate/(1-(1+rate)**-years);

/** Explicit remaining, nominal cash flows, per MW in one currency. Every annual
 * record declares tax paid, recurring costs AND lifecycle capex. Missing != 0.
 * Original construction costs are never deducted from an operating purchase. */
export function validateAcquisition(input){
  const missing=[];
  if (!input || !STAGES.includes(input.stage)) return ['stage'];
  if (!RATE_SNAPSHOT[input.currency]) missing.push('cash-flow currency');
  if (!finite(input.existingNetDebtPerMW)) missing.push('existing net debt');
  if (!nonnegative(input.fixedFeesPerMW)) missing.push('fixed transaction fees');
  if (!(finite(input.powerMW) && input.powerMW>0)) missing.push('project MW');
  if (!(finite(input.durationHours) && input.durationHours>0)) missing.push('storage duration');
  if (!Array.isArray(input.annual) || !input.annual.length) missing.push('remaining operating cash flows');
  else input.annual.forEach((year,i)=>{
    if (!['secured','merchant','renewal','opex','capex','tax'].every(k=>nonnegative(year[k]))) missing.push(`year ${i+1} revenues/costs/tax`);
  });
  if (!nonnegative(input.decommissioningPerMW)) missing.push('decommissioning cost');
  if (!Array.isArray(input.scenarios) || !input.scenarios.length) missing.push('remaining development/construction scenarios');
  else {
    if (Math.abs(sum(input.scenarios.map(s=>finite(s.probability)?s.probability:0))-1)>1e-8) missing.push('scenario probabilities');
    if (!input.scenarios.some(s=>s.operates&&s.probability>0)) missing.push('operating scenario');
    for (const s of input.scenarios){
      if (!nonnegative(s.probability) || s.probability>1 || !nonnegative(s.codYears) || typeof s.operates!=='boolean') missing.push('scenario timing');
      if (!Array.isArray(s.costs) || s.costs.some(c=>!nonnegative(c.at)||!nonnegative(c.amount))) missing.push('remaining cost schedule');
      if (!Array.isArray(s.recoveries) || s.recoveries.some(c=>!nonnegative(c.at)||!nonnegative(c.amount))) missing.push('recoveries');
    }
  }
  if(input.stage==='operating' && (input.scenarios?.length!==1 || input.scenarios[0]?.codYears!==0 || !input.scenarios[0]?.operates)) missing.push('operating acquisition starts at closing');
  if(input.stage!=='operating' && (!input.saleTax || !nonnegative(input.saleTax.rate) || input.saleTax.rate>1 || !nonnegative(input.saleTax.basisPerMW))) missing.push('sale tax and tax basis');
  if(input.stage!=='operating' && input.debt) missing.push('pre-operation acquisitions must be all-cash');
  if(input.stage!=='operating' && input.existingNetDebtPerMW!==0) missing.push('debt-free pre-operation closing');
  if(input.stage==='greenfield' && input.developmentRiskConfirmed!==true) missing.push('development success/delay/failure evidence');
  if(input.conditionsMet!==true) missing.push('entry, technical and contractual conditions');
  if(!Array.isArray(input.sources) || !input.sources.length || !input.sources.every(source=>
    typeof source==='string'?source.trim().length>0:source&&typeof source==='object'&&
      [source.label,source.url].some(value=>typeof value==='string'&&value.trim().length>0))) missing.push('source or stated assumption provenance');
  if(input.additionalPremium!=null && !nonnegative(input.additionalPremium)) missing.push('additional risk premium');
  if(input.debt){
    const d=input.debt;
    if(!['contracted','mixed','merchant'].includes(d.riskClass)) missing.push('debt risk class');
    if(d.mode==='assume' && (!d.transferConfirmed || !nonnegative(d.balancePerMW))) missing.push('transferable existing loan');
    if(!['assume','new'].includes(d.mode)) missing.push('debt mode');
    for(const key of ['rate','ltv','dscr','years','commitmentPerMW','bankValuePerMW']) if(d[key]!=null && !nonnegative(d[key])) missing.push(`debt ${key}`);
    if(d.ltv>1 || d.dscr===0 || d.years===0 || d.rate<=-1) missing.push('debt bounds');
  }
  return [...new Set(missing)];
}

function merchantShare(years,base){
  const all=sum(years.map((y,i)=>pv(y.secured+y.merchant+y.renewal,i+1,base)));
  return all>0 ? sum(years.map((y,i)=>pv(y.merchant+y.renewal,i+1,base)))/all : 1;
}
export function debtRiskClass(years,base){
  const share=merchantShare(years,base);
  if(share>=.8)return 'merchant';
  if(share<=.2&&years.filter(y=>y.secured>0).length>=5)return 'contracted';
  return 'mixed';
}
const cashOf = y => y.secured+y.merchant+y.renewal-y.opex-y.capex-y.tax;

function finance(input,price,base){
  if(!input.debt) return {loan:0,flows:[],reserve:0,fee:0};
  const d=input.debt, rule=DEBT[d.riskClass];
  const years=Math.min(Math.floor(d.years??rule.years),input.annual.length-2,
    d.riskClass==='contracted' ? input.annual.findLastIndex(y=>y.secured>0) : input.annual.length);
  if(years<=0) return {loan:0,flows:[],reserve:0,fee:0,invalid:d.mode==='assume'&&d.balancePerMW>0};
  const rate=d.rate??base+rule.margin, servicePerDollar=annuity(rate,years), dscr=d.dscr??rule.dscr;
  const capacity=Math.max(0,Math.min(...input.annual.slice(0,years).map(y=>cashOf(y)/dscr/servicePerDollar)));
  const ltv=d.ltv??rule.ltv;
  const cap=Math.min(price*ltv,capacity,d.commitmentPerMW??Infinity,(d.bankValuePerMW??Infinity)*ltv);
  const loan=d.mode==='assume' ? d.balancePerMW : Math.max(0,cap);
  if(loan>cap+1e-5) return {invalid:true};
  const payment=loan*servicePerDollar, reserve=payment*FEES.reserveMonths/12;
  return {loan,years,rate,payment,reserve,fee:d.mode==='assume'?0:loan*FEES.financing,
    flows:Array.from({length:input.annual.length},(_,i)=>i<years?-payment+(i===years-1?reserve:0):0)};
}

/** Both routes are priced separately. Only the lower ceiling and ITS target
 * leave this module's public result. Audit alternatives stay in `audit`. */
export function valueAcquisition(input,investor,{snapshot=RATE_SNAPSHOT}={}){
  const premium=INVESTOR_PREMIUM[investor]?.[input?.stage];
  if(premium==null) return {status:'not-applicable',missing:[]};
  const missing=validateAcquisition(input);
  if(missing.length) return {status:'incomplete',missing};
  const base=snapshot[input.currency]?.rate;
  if(!nonnegative(base)) return {status:'incomplete',missing:['rate snapshot']};
  const annual=input.annual,life=annual.length, extra=input.additionalPremium??0;
  const exitYear=investor==='developer'?0:5;
  if(input.stage!=='operating' && exitYear>=life) return {status:'incomplete',missing:['remaining life beyond planned sale']};
  const routes=input.stage==='operating'?['hold']:['hold','sale'];
  const audit=[];
  for(const route of routes){
    const years=route==='sale' && exitYear>0?annual.slice(0,exitYear):annual;
    const target=base+premium+.03*merchantShare(years,base)+extra;
    const buyerRate=base+.03+.04*merchantShare(annual.slice(exitYear),base)+extra;
    const terminal=sum(annual.slice(exitYear).map((y,i)=>pv(cashOf(y),i+1,buyerRate)))
      -pv(input.decommissioningPerMW,life-exitYear,buyerRate);
    const evaluate=price=>{
      const debt=input.stage==='operating'?finance(input,price,base):{loan:0,flows:[],reserve:0,fee:0};
      if(debt.invalid) return {npv:-Infinity,debt};
      let npv=-price*(1+FEES.acquisition)-(input.fixedFeesPerMW??0)+debt.loan-debt.reserve-debt.fee;
      for(const s of input.scenarios){
        let value=-sum(s.costs.map(c=>pv(c.amount,c.at,target)))+sum(s.recoveries.map(c=>pv(c.amount,c.at,target)));
        if(s.operates){
          const end=route==='hold'?life:exitYear;
          value+=sum(annual.slice(0,end).map((y,i)=>pv(cashOf(y)+(debt.flows[i]??0),s.codYears+i+1,target)));
          if(route==='hold') value-=pv(input.decommissioningPerMW,s.codYears+life,target);
          else {
            const taxBasis=input.saleTax.basisPerMW+(input.saleTax.includePurchase?price:0);
            const saleTax=Math.max(0,terminal-taxBasis)*input.saleTax.rate;
            value+=pv(terminal*(1-FEES.sale)-saleTax,s.codYears+exitYear,target);
          }
        }
        npv+=s.probability*value;
      }
      return {npv,debt};
    };
    // An assumed loan's outstanding balance sets a feasible lower EV bound.
    let low=input.debt?.mode==='assume'?input.debt.balancePerMW/(input.debt.ltv??DEBT[input.debt.riskClass].ltv):0;
    const start=evaluate(low);
    if(!(start.npv>0)) {audit.push({route,target,status:'no-positive-price',npvAtFloor:start.npv});continue;}
    let high=Math.max(1,low*2,sum(annual.map(y=>Math.max(0,cashOf(y)))));
    while(evaluate(high).npv>0 && high<1e12) high*=2;
    if(high>=1e12 && evaluate(high).npv>0) return {status:'incomplete',missing:['bounded price solution']};
    for(let i=0;i<80;i++){const mid=(low+high)/2;if(evaluate(mid).npv>0)low=mid;else high=mid;}
    const price=(low+high)/2, solved=evaluate(price);
    audit.push({status:'priced',route,target,pricePerMW:price,npv:solved.npv,debt:solved.debt});
  }
  if(audit.some(r=>r.status!=='priced')) return {status:'no-positive-price',missing:[],audit};
  const binding=[...audit].sort((a,b)=>a.pricePerMW-b.pricePerMW || (a.route==='hold'?-1:1))[0];
  const price=binding.pricePerMW;
  return {status:'priced',stage:input.stage,investor,currency:input.currency,fxToUSD:input.fxToUSD??null,
    pricePerMW:price,targetReturn:binding.target,route:binding.route,
    returnBasis:input.stage==='operating'&&input.debt?'equity':'all-cash',exitYear:binding.route==='sale'?exitYear:null,
    equityPaymentPerMW:price-input.existingNetDebtPerMW,
    futureInvestmentPerMW:Math.max(...input.scenarios.filter(s=>s.probability>0).map(s=>sum(s.costs.map(c=>c.amount))+(s.operates?sum(annual.map(y=>y.capex)):0))),
    closingEquityPerMW:price*(1+FEES.acquisition)+(input.fixedFeesPerMW??0)-binding.debt.loan+binding.debt.fee+binding.debt.reserve+
      Math.max(...input.scenarios.filter(s=>s.probability>0).map(s=>sum(s.costs.filter(c=>c.at===0).map(c=>c.amount)))),
    loanPerMW:binding.debt.loan,debtRiskClass:input.debt?.riskClass??null,remainingYears:life,baseRate:base,rateDate:snapshot.date??RATE_SNAPSHOT.date,
    rateSource:snapshot[input.currency].source??null,
    sources:input.sources,audit};
}

export function publicAcquisition(result){
  if(result?.status!=='priced' || !(result.pricePerMW>0) || !finite(result.targetReturn)) return null;
  const {audit,...publicResult}=result;
  return publicResult;
}
