/** Round display-only references and pool repeated market/scenario assumptions.
 * The full precision model and downloaded project inputs remain untouched. */
const rounded=value=>JSON.parse(JSON.stringify(value,(_key,v)=>typeof v==='number'?Math.abs(v)>=100?Math.round(v):Number(v.toFixed(5)):v));
export function compactReferences(acquisitions={}){
  const assumptions=[],metadata=[];
  const intern=(pool,value)=>{const text=JSON.stringify(value),index=pool.findIndex(v=>JSON.stringify(v)===text);return index<0?pool.push(value)-1:index;};
  const rows=Object.fromEntries(Object.entries(acquisitions).map(([investor,list])=>[investor,list.map(original=>{
    if(original.status!=='reference')return original;
    const row=rounded(original);
    const {asOf,baseRate,rateDate,rateSource,marketSourceDate,modelCurrency,localUnitsPerModelUnit,currency,fxToUSD,contractYears,strategyId,...rest}=row;
    const meta=intern(metadata,{asOf,baseRate,rateDate,rateSource,marketSourceDate,modelCurrency,localUnitsPerModelUnit,currency,fxToUSD,contractYears,strategyId});
    return {...rest,meta,referenceCases:rest.referenceCases.map(({assumptions:a,...c})=>({...c,assumptionsIndex:intern(assumptions,a)}))};
  })]));
  return {acquisitions:rows,acquisitionReferenceData:{assumptions,metadata}};
}
export function expandReferences(rows=[],data){
  return rows.map(row=>row.meta==null?row:{...data.metadata[row.meta],...row,referenceCases:row.referenceCases.map(c=>({...c,assumptions:data.assumptions[c.assumptionsIndex]}))});
}
