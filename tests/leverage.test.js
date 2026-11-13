import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities } from '../src/experience/model.js';
import { contractedDSCR, targetTest } from '../src/acquisition/leverage.js';
import { LEVERAGE, LEVERED_PREMIUM } from '../src/acquisition/parameters.js';
import { selectedInvestmentCase } from '../src/experience/selectedInvestmentCase.js';
import {investmentRowsFor} from '../src/experience/storyRows.js';
import {revenueRoute} from '../src/experience/investmentCase.js';

const rows = opportunities('infraFund');
const row = id => rows.find(r => r.id === id).investment;

test('contracted coverage follows contract quality inside 1.20-1.40x; merchant is 2.00x', () => {
  assert.equal(contractedDSCR('capacity', 15), 1.20);
  assert.equal(contractedDSCR('award', 20), 1.20);
  assert.equal(contractedDSCR('fixed', 10), 1.30);
  assert.equal(contractedDSCR('fixed', 5), 1.40);
  assert.equal(contractedDSCR('floor', 7), 1.40);
  assert.equal(contractedDSCR('collar', 15), 1.40);
  assert.equal(contractedDSCR('merchant', 0), null);
  assert.equal(LEVERAGE.dscr.merchant, 2.00);
});

test('debt ratios match the table the analyst confirmed on 29 Oct 2026', () => {
  const confirmed = { it:.600, ie:.499, wa:.750, pl:.339, fi:.600, de:.655, ro:.376, nem:.581,
    gb:.549, caiso:.499, pjm:.270, ercot:.407, ca_on:.502,
    // Japan moved off the 75% cap when it took the Bank of Japan core-CPI path (29 Oct 2026).
    jp_kyushu:.749, jp_tokyo:.745, jp_hokkaido:.733 };
  for (const [id, gearing] of Object.entries(confirmed))
    assert.ok(Math.abs(row(id).leverage.gearing - gearing) < .0015, `${id}: ${row(id).leverage.gearing}`);
});

test('every levered case covers its tests, repays 60% by maturity and stays under its cap', () => {
  for (const r of rows){
    const l = r.investment?.leverage;
    if (!l) continue;
    assert.ok(l.minCover >= Math.min(l.contractedDSCR ?? 2, 2) - 1e-6, r.id + ' cover ' + l.minCover);
    assert.ok(l.balloonShare <= 1 - LEVERAGE.minRepaid + 1e-6, r.id + ' balloon ' + l.balloonShare);
    assert.ok(l.gearing <= LEVERAGE.gearingCap.contracted + 1e-9, r.id + ' gearing');
    assert.ok(l.legalYears >= LEVERAGE.miniPermYears && l.legalYears <= LEVERAGE.maxLegalYears);
  }
});

test('two layers: all-equity against the target, levered against the target plus two points', () => {
  assert.deepEqual(targetTest(.11, .15, .10).basis, 'all-equity');
  assert.deepEqual(targetTest(.09, .125, .10).basis, 'levered');
  assert.deepEqual(targetTest(.09, .115, .10).basis, 'neither');
  assert.equal(targetTest(.09, .115, .10).leveredTarget, .10 + LEVERED_PREMIUM);
  assert.equal(row('it').test.basis, 'all-equity');
  assert.equal(row('ie').test.basis, 'neither');
  assert.equal(row('de').test.basis, 'neither');
});

test('US rows carry both supply cases', () => {
  for (const id of ['pjm', 'ercot', 'caiso']){
    assert.equal(row(id).usSupply, 'non-feoc');
    assert.equal(row(id).usAlternative.usSupply, 'chinese');
    assert.ok(row(id).usAlternative.capexPerMW < row(id).capexPerMW);
  }
  assert.equal(row('de').usAlternative, undefined);
});

test('Italy selection reprices the complete play and attributes exactly the same loan by income', () => {
  const initial=rows.find(r=>r.id==='it');
  const cap=selectedInvestmentCase(initial,'infraFund','it-cap-4h');
  const macse=selectedInvestmentCase(initial,'infraFund','it-ltda-6h');
  assert.equal(cap.investment.holdIRR,initial.investment.holdIRR);
  assert.equal(cap.investment.leveredIRR,initial.investment.leveredIRR);
  assert.equal(cap.investment.leverage.loanPerMW,initial.investment.leverage.loanPerMW);
  assert.equal(cap.investment.hours,4);assert.equal(macse.investment.hours,6);
  assert.notEqual(macse.investment.holdIRR,cap.investment.holdIRR);
  assert.notEqual(macse.investment.leverage.minCover,cap.investment.leverage.minCover);
  assert.notEqual(macse.investment.capexPerMW,cap.investment.capexPerMW);
  for(const selected of [cap,macse]) {
    const l=selected.investment.leverage;
    const sum=key=>l.contributions.reduce((n,c)=>n+c[key],0);
    assert.ok(Math.abs(sum('loanPerMW')-l.loanPerMW)<1e-7);
    assert.ok(Math.abs(sum('gearing')-l.gearing)<1e-12);
    assert.ok(Math.abs(sum('capacityPerMW')-l.capacityPerMW)<1e-7);
    assert.deepEqual(l.contributions.map(c=>[c.kind,c.dscr]),[['contracted',1.2],['merchant',2]]);
    for(const c of l.contributions) assert.ok(Math.abs(c.loanPerMW/c.capacityPerMW-l.loanPerMW/l.capacityPerMW)<1e-12);
    assert.equal(selected.econ.hold,selected.investment.holdIRR);
    assert.equal(selected.econ.levered,selected.investment.leveredIRR);
    assert.equal(selected.investment.bearHoldIRR==null,false);
  }
  assert.equal(cap.investment.leverage.capBinds,true);
  assert.equal(macse.investment.leverage.capBinds,false);
  assert.equal(selectedInvestmentCase(initial,'infraFund','invalid').play.id,initial.play.id);
});

test('every investor and market keeps its published primary case and each selectable reference has its own debt',()=>{
  for(const investor of ['infraFund','strategic','foreignFirstTimer','developer'])for(const initial of opportunities(investor)){
    const base=selectedInvestmentCase(initial,investor,null);
    if(!initial.investment){assert.equal(base.investment,initial.investment);continue;}
    for(const key of ['holdIRR','leveredIRR','capexPerMW','rtbMonths','hours','powerMW','secured'])assert.equal(base.investment[key],initial.investment[key],`${investor}/${initial.id}/${key}`);
    assert.deepEqual(base.investment.usAlternative,initial.investment.usAlternative);
    assert.deepEqual(base.investment.operatingPurchase,initial.investment.operatingPurchase);
    assert.equal(selectedInvestmentCase(initial,investor,'another-market').investment.holdIRR,initial.investment.holdIRR);
    for(const choice of investmentRowsFor(initial,investor)){
      const selected=selectedInvestmentCase(initial,investor,choice.play?.id,choice.supplyCase),i=selected.investment,l=i.leverage;
      assert.equal(i.hours,choice.play?.hours||initial.investment.hours);
      assert.equal(selected.econ.hold,i.holdIRR);assert.equal(selected.econ.levered,i.leveredIRR);
      assert.ok(Math.abs(l.contributions.reduce((n,c)=>n+c.loanPerMW,0)-l.loanPerMW)<1e-6);
      assert.ok(Math.abs(l.contributions.reduce((n,c)=>n+c.gearing,0)-l.gearing)<1e-12);
      assert.equal(l.contractedDSCR,contractedDSCR(i.contract.kind,i.contract.remainingContractYears));
      assert.equal(l.merchantDSCR,2);
      if(choice.referenceOnly)assert.equal(selected.call,'reference','no call borrowed from another lens');
      if(choice.supplyCase)assert.equal(i.usSupply,choice.supplyCase);
      assert.equal(i.currency,initial.investment.currency);
      assert.equal(initial.econ.hold,initial.investment.holdIRR,'selection never mutates the briefing');
    }
  }
});

test('contract labels and support terms remain market-specific instead of following route codes alone',()=>{
  const selected=(id,play,supply)=>selectedInvestmentCase(rows.find(r=>r.id===id),'infraFund',play,supply);
  assert.match(revenueRoute(selected('nem'))[0],/CIS/);
  assert.equal(selected('nem').investment.contract.kind,'collar');
  assert.match(revenueRoute(selected('fi'))[0],/floor/);
  assert.equal(selected('fi').investment.leverage.contractedDSCR,1.4);
  for(const id of ['jp_tokyo','jp_kyushu','jp_hokkaido']){
    const r=selected(id);assert.match(revenueRoute(r)[0],/LTDA/);assert.doesNotMatch(revenueRoute(r)[0],/MACSE/);
    assert.equal(r.investment.hours,9);assert.ok(r.investment.inflationPath.length);
  }
  assert.match(revenueRoute(selected('caiso'))[0],/Adequacy/);
  assert.equal(selected('pjm').investment.securedYears,1);
  assert.equal(selected('de').investment.rtbMonths,36);
  const grant=selected('pl','pl-grant-4h'),capacity=selected('pl','pl-cap-4h');
  assert.ok(grant.investment.capitalGrantPerMW>0);assert.equal(capacity.investment.capitalGrantPerMW,0);
  assert.equal(grant.investment.leverage.contractedDSCR,null);assert.equal(capacity.investment.leverage.contractedDSCR,1.2);
  const us=selected('caiso',null,'chinese');
  assert.notEqual(us.investment.capexPerMW,selected('caiso').investment.capexPerMW);
  assert.notEqual(us.investment.leverage.gearing,selected('caiso').investment.leverage.gearing);
});
