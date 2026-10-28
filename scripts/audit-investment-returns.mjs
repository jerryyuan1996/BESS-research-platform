import fs from 'node:fs';
import assert from 'node:assert/strict';
import { opportunities, LENSES } from '../src/experience/model.js';
import { opportunitiesFor } from '../src/opportunities/catalog.js';
import { compareOpportunity } from '../src/opportunities/model.js';
import { acquisitionCashFlows } from '../src/acquisition/valuation.js';
const pct=x=>Number.isFinite(x)?(x*100).toFixed(2)+'%':'N/M';
const rows=[];
for(const investor of Object.keys(LENSES))for(const row of opportunities(investor)){
  const c=compareOpportunity(row.market,opportunitiesFor(row.id)[0],investor,row.play);
  assert.ok(!c.unavailable,investor+'/'+row.id);
  const s=c.standard,m=row.investment;
  assert.equal(m.irr,s.atPrice?.annualReturn??null);
  assert.equal(m.capexPerMW,s.assumptions.buildBudget);
  assert.equal(m.rtbMonths,s.codMonths);
  assert.equal(m.stage,'ready-to-build');
  assert.equal(m.lifeYears,20);
  if(s.atPrice){
    const flows=acquisitionCashFlows(s.input,investor,s.atPrice.route,s.price).flows;
    const residual=flows.reduce((sum,f)=>sum+f.amount/(1+s.atPrice.annualReturn)**f.at,0);
    assert.ok(Math.abs(residual)<Math.max(.01,m.capexPerMW*1e-8),investor+'/'+row.id+' IRR residual');
  }
  rows.push({investor,market:row.id,play:row.play?.id,
    legacy15YearPretax:row.legacyEcon.hold,hold20YearAfterTax:m.holdIRR,
    sale20YearAfterTax:m.saleIRR,publishedIRR:m.irr,target:m.targetReturn,
    currency:m.currency,capexPerMW:m.capexPerMW,rtbMonths:m.rtbMonths});
}
const header='# Investment-return reconciliation — 28 October 2026\n\n'+
  'The website now uses one RTB-close, 20-operating-year, nominal after-project-tax acquisition case. Pre-operation funding is all cash. Headline, global comparison, market detail and the default conventional column publish the same lower-of-hold-and-sale return. Target return is a hurdle, not the calculated IRR.\n\n'+
  'The old Italian 14.6% was a rounded 15-year before-project-tax operating-model hold IRR. Its new infrastructure-fund reference is approximately 9.6%, including the construction calendar, tax, contingencies, fees and sale policy. Legacy engine fixtures are retained as an operating-model calculation check.\n\n'+
  'Two implementation issues were corrected: route/duration-specific capacity pricing options now reach the acquisition adapter, and special designs are repriced at their actual duration before applying cost differences. In particular, an eight-hour MACSE alternative no longer inherits a four-hour construction budget.\n\n'+
  'Capex below includes remaining construction, grid and reference contingency, excluding acquisition consideration, recoverable VAT and capital support. T+0 is investment closing / first capital commitment. N/M means the cash-flow solver does not provide a unique IRR. No number is substituted for that outcome.\n\n'+
  '| Investor | Market | Play | Old 15y pretax | New hold | New sale | Published | Target | Capex / MW | RTB–COD |\n'+
  '|---|---|---|---:|---:|---:|---:|---:|---:|---:|\n';
const lines=rows.map(r=>'| '+[r.investor,r.market,r.play,pct(r.legacy15YearPretax),pct(r.hold20YearAfterTax),
  pct(r.sale20YearAfterTax),pct(r.publishedIRR),pct(r.target),r.currency+' '+Math.round(r.capexPerMW).toLocaleString('en-US'),r.rtbMonths+'m'].join(' | ')+' |').join('\n');
fs.writeFileSync('docs/investment-return-audit-2026-10-28.md',header+lines+'\n');
fs.writeFileSync('investment-return-audit.json',JSON.stringify(rows,null,2));
console.log('Audited '+rows.length+' market × investor cases: shared values and cash-flow IRR residuals reconcile.');
