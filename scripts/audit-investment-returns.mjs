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
    levered:m.leveredIRR,gearing:m.leverage?.gearing??null,dscr:m.leverage?.contractedDSCR??null,
    test:m.test.basis,leveredTarget:m.test.leveredTarget,usAlternative:m.usAlternative?.holdIRR??null,
    currency:m.currency,capexPerMW:m.capexPerMW,rtbMonths:m.rtbMonths});
}
const header='# Investment-return reconciliation — 29 October 2026\n\n'+
  'Conventions approved by the analyst on 29 October 2026: revenue and every secured contract escalate at 2.5% (Japan: Bank of Japan core-CPI path 2.45%, 2.2%, then 2.0%, the index its LTDA payments are corrected by); US and GB write the basis off in year one and the owner group uses losses; US new builds price a non-FEOC DC block with the 30% credit (US alt. hold: Chinese block, no credit). The headline is the all-equity hold return. The levered return adds one project loan at COD: contracted cash 1.20–1.40x by contract type, merchant 2.00x, at least 60% repaid by legal maturity, gearing capped at 60–75% of the build budget, equity repays any balloon. Target test: all-equity against the target, else levered against the target plus two points.\n\n'+
  'Capex below includes remaining construction, grid and reference contingency, excluding acquisition consideration, recoverable VAT and capital support. Debt ratio is debt over that capex. N/M means the cash-flow solver does not provide a unique IRR.\n\n'+
  '| Investor | Market | Play | Old 15y pretax | All-equity hold | Sale | Lower of hold/sale | Levered | Debt ratio | Contracted DSCR | Target | Levered target | Test | US alt. hold | Capex / MW | RTB–COD |\n'+
  '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|---:|\n';
const lines=rows.map(r=>'| '+[r.investor,r.market,r.play,pct(r.legacy15YearPretax),pct(r.hold20YearAfterTax),
  pct(r.sale20YearAfterTax),pct(r.publishedIRR),pct(r.levered),pct(r.gearing),r.dscr?r.dscr.toFixed(2)+'x':'—',pct(r.target),pct(r.leveredTarget),r.test,
  r.usAlternative==null?'':pct(r.usAlternative),r.currency+' '+Math.round(r.capexPerMW).toLocaleString('en-US'),r.rtbMonths+'m'].join(' | ')+' |').join('\n');
fs.writeFileSync('docs/investment-return-audit-2026-10-29.md',header+lines+'\n');
fs.writeFileSync('investment-return-audit.json',JSON.stringify(rows,null,2));
console.log('Audited '+rows.length+' market × investor cases: shared values and cash-flow IRR residuals reconcile.');
