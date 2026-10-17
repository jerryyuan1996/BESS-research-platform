import { runBaseCase } from './engine.js';
/** Existing fifth-of-ranked-markets rule, separately for holding and selling. */
export function returnGradesFor(markets, exitYear = 5){
  const priced = markets.map(m => ({ id:m.manifest.id, result:runBaseCase(m,exitYear) }))
    .filter(row => !row.result.na && Number.isFinite(row.result.irrHold));
  const out = {};
  for (const [basis,key] of [['hold-irr','irrHold'],['exit-irr','irrExit']]){
    const rows = priced.filter(r => Number.isFinite(r.result[key])).sort((a,b) => b.result[key]-a.result[key]);
    rows.forEach((row,i) => { (out[row.id] ||= {})[basis] = {
      basis, rank:i+1, count:rows.length, grade:6-Math.ceil((i+1)*5/rows.length), value:row.result[key],
    }; });
  }
  return out;
}
