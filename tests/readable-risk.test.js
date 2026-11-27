import test from 'node:test';
import assert from 'node:assert/strict';
import { rankedSensitivities, sensitivityEvidence } from '../src/experience/riskData.js';
import { cumulativeEquityCash, monthlyCashSeries } from '../src/opportunities/monthlyCash.js';
import { opportunities, LENSES, caseFor } from '../src/experience/model.js';
import { selectedInvestmentCase } from '../src/experience/selectedInvestmentCase.js';
import { investmentRowsFor } from '../src/experience/storyRows.js';
import { analyseRisk } from '../src/experience/riskAnalysis.js';
import { acquisitionCashFlows } from '../src/acquisition/valuation.js';
import { referenceInvestment } from '../src/opportunities/investment.js';
import { opportunitiesFor } from '../src/opportunities/catalog.js';

test('tornado ranks absolute effects, evaluates both ends, retains missing and one-sided returns',()=>{
  const ranges={small:{min:1,max:2},large:{min:3,max:4},missing:{min:5},one:{max:6}};
  const values={1:.09,2:.12,3:.04,4:.14,5:null,6:.13},calls=[];
  const rows=rankedSensitivities(ranges,.1,(key,value)=>{calls.push([key,value]);return values[value];});
  assert.deepEqual(rows.map(r=>r.key),['large','one','small','missing']);
  assert.equal(calls.length,6);assert.deepEqual(rows[0].ends.map(e=>e.end),['min','max']);
  assert.equal(rows.at(-1).effect,null);assert.equal(rows.at(-1).ends[0].delta,null);
  assert.equal(rows[1].ends.length,1);
  assert.deepEqual(ranges,{small:{min:1,max:2},large:{min:3,max:4},missing:{min:5},one:{max:6}});
});

test('sourced/assumed labels read basis and source, including a mixed practitioner band',()=>{
  const observed={kind:'sourced',source:'Published auction results',basis:['Two observed endpoints','两个观测端点']};
  assert.equal(sensitivityEvidence(observed),'sourced');
  assert.equal(sensitivityEvidence({...observed,kind:'part-sourced'}),'assumed');
  assert.equal(sensitivityEvidence({...observed,kind:'dispersed'}),'assumed');
  assert.equal(sensitivityEvidence({...observed,source:null}),'assumed');
  const fi=opportunities('infraFund').find(r=>r.id==='fi').market.comparison.ranges;
  assert.equal(sensitivityEvidence(fi.services),'sourced');
  assert.equal(sensitivityEvidence(fi.merchGross),'assumed');
  assert.equal(sensitivityEvidence(fi.toll),'assumed');
  assert.equal(sensitivityEvidence(fi.feePct),'assumed');
});

test('every selected case exposes the unchanged minimum annual debt cover',()=>{
  for(const lens of Object.keys(LENSES))for(const row of opportunities(lens))for(const choice of investmentRowsFor(row,lens)){
    const i=selectedInvestmentCase(row,lens,choice.play?.id,choice.supplyCase).investment;
    if(!i)continue;
    const l=i.leverage,ratios=l?.coverByYear.filter(y=>Number.isFinite(y.dscr))||[];
    if(l) {
      assert.equal(l.coverByYear.length,i.lifeYears);
      assert.deepEqual(l.coverByYear.map(y=>y.year),Array.from({length:i.lifeYears},(_,t)=>t+1));
      assert.equal(Math.min(...ratios.map(y=>y.dscr)),l.minCover,lens+'/'+row.id);
      assert.ok(l.coverByYear.filter(y=>y.year>l.legalYears).every(y=>y.dscr===null));
      if(choice.play?.id===row.play?.id&&!choice.supplyCase)assert.equal(l.minCover,row.investment.leverage.minCover);
    }
  }
});

test('ranked endpoints reconcile to direct all-equity model runs and the published compound downside',()=>{
  for(const id of ['it','ro']) {
    const row=selectedInvestmentCase(opportunities('infraFund').find(r=>r.id===id),'infraFund'),a=analyseRisk(row,'infraFund',caseFor(row).overrides);
    assert.equal(a.reference.holdReturn.annualReturn,row.investment.holdIRR);
    assert.equal(a.stressed.holdReturn.annualReturn,row.investment.bearHoldIRR);
    for(let n=1;n<a.factors.length;n++)assert.ok((a.factors[n-1].effect??-1)>=(a.factors[n].effect??-1));
    const options=opportunitiesFor(id)[0]?.screeningByInvestor?.infraFund;
    for(const f of a.factors)for(const end of f.ends) {
      const result=referenceInvestment(row.market,'infraFund',row.play,{...options,economicOverrides:{[f.key]:end.value}})?.result;
      assert.equal(end.hold,result?.holdReturn?.annualReturn??null);
    }
    const flows=acquisitionCashFlows(a.reference.input,'infraFund','hold',a.reference.price).flows;
    const cash=cumulativeEquityCash(flows,a.reference.input.powerMW),monthly=monthlyCashSeries(flows,a.reference.input.powerMW);
    assert.ok(Math.abs(cash.series.at(-1).cumulative-monthly.at(-1).cumulative)<1e-6);
    assert.equal(cash.peakCashAtRisk,-Math.min(...cash.series.map(p=>p.cumulative)));
  }
});

test('cumulative cash groups simultaneous payments and keeps payback at a model date',()=>{
  const flows=[{at:0,amount:-5},{at:1.25,amount:-100},{at:1.25,amount:10},{at:3.25,amount:40},{at:4.25,amount:60}];
  const result=cumulativeEquityCash(flows,2);
  assert.equal(result.peakCashAtRisk,190);assert.equal(result.peak.at,1.25);assert.equal(result.payback.at,4.25);
  assert.equal(result.series.at(-1).cumulative,10);assert.equal(result.series.length,4);
  assert.equal(cumulativeEquityCash(flows.slice(0,-1)).payback,null);
});
