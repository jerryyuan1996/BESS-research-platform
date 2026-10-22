/** Round display-only references and pool repeated market/scenario assumptions.
 * The full precision model and downloaded project inputs remain untouched. */
const rounded=(value,fx)=>JSON.parse(JSON.stringify(value,(key,v)=>{
  if(typeof v!=='number')return v;
  if(/PerMW$|^(development|buildBudget|gridAllowance|retirement|fixedFees)$/.test(key)&&Math.abs(v)>=100){const step=100/(key.includes('USD')?1:fx||1);return Math.round(Math.floor(v/step)*step);}
  return Math.abs(v)>=100?Math.round(v):Number(v.toFixed(5));
}));
const CASE_FIELDS=['key','status','pricePerMW','targetReturn','route','exitYear','returnBasis','remainingYears','equityPaymentPerMW','closingEquityPerMW','futureInvestmentPerMW','loanPerMW','atPrice','costGapPVPerMW'];
export function compactReferences(acquisitions={}){
  const assumptions=[],metadata=[];
  const intern=(pool,value)=>{const text=JSON.stringify(value),index=pool.findIndex(v=>JSON.stringify(v)===text);return index<0?pool.push(value)-1:index;};
  const rows=Object.fromEntries(Object.entries(acquisitions).map(([investor,list])=>[investor,list.map(original=>{
    if(original.status!=='reference')return original;
    const row=rounded(original,original.fxToUSD);
    const {asOf,baseRate,rateDate,rateSource,marketSourceDate,modelCurrency,localUnitsPerModelUnit,currency,fxToUSD,contractYears,strategyId,...rest}=row;
    const meta=intern(metadata,{asOf,baseRate,rateDate,rateSource,marketSourceDate,modelCurrency,localUnitsPerModelUnit,currency,fxToUSD,contractYears,strategyId});
    return {...rest,meta,referenceCases:rest.referenceCases.map(({assumptions:a,...c})=>[intern(assumptions,a),...CASE_FIELDS.map(k=>c[k]??null)])};
  })]));
  return {acquisitions:rows,acquisitionReferenceData:{assumptions,metadata}};
}
export function expandReferences(rows=[],data){
  return rows.map(row=>row.meta==null?row:{...data.metadata[row.meta],...row,referenceCases:row.referenceCases.map(c=>Array.isArray(c)?{
    ...Object.fromEntries(CASE_FIELDS.map((k,i)=>[k,c[i+1]])),assumptions:data.assumptions[c[0]],
  }:{...c,assumptions:data.assumptions[c.assumptionsIndex]})});
}
