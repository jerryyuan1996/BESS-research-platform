/** Compatibility, never a universal score, FX conversion or underwriting. */
export function impactCompatibility(a,b){
  if(!a||!b||a.lane==='not_quantifiable'||b.lane==='not_quantifiable')return {state:'not_available',reasons:['No sourced quantitative exhibit']};
  const keys=['lane','currency','denominator','period','technology','asOf','contract','taxTreatment','marketDefinition'];
  const missing=keys.filter(k=>a[k]==null||b[k]==null||a[k]===''||b[k]==='');
  const mismatch=keys.filter(k=>a[k]!==b[k]);
  return missing.length||mismatch.length?{state:'not_comparable',reasons:[...missing.map(k=>`Missing ${k}`),...mismatch.map(k=>`Different ${k}`)]}:{state:'comparable',reasons:['Same declared basis; no modelled return implied']};
}
