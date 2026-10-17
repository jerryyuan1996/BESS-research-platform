import test from 'node:test';
import assert from 'node:assert/strict';
import { markets, byId } from '../src/markets/registry.js';
import { runCase, runBaseCase } from '../src/comparison/engine.js';
import { sizeProjectDebt, riskClassFor } from '../src/economics/projectDebt.js';
import { withOverrides } from '../src/comparison/scenario.js';
import { marketAt, sweepDesign } from '../src/comparison/designFit.js';
import { marketDesign, designEconomics, designGrid } from '../src/briefing/plays.js';
import { runScenarioSet } from '../src/comparison/refinement.js';
import { supportedStrategies } from '../src/comparison/strategies.js';

const near = (a,b,label) => assert.ok(Math.abs(a-b) < 1e-7 * Math.max(1,Math.abs(b)), `${label}: ${a} versus ${b}`);
// Independent annual NPV and IRR implementation, without the product helpers.
const npv = (flows,r) => flows.reduce((sum,cash,t)=>sum+cash/(1+r)**t,0);
const root = flows => {
  let a=-0.9,b=2;
  if (npv(flows,a)*npv(flows,b)>0) return null;
  for(let i=0;i<100;i++) { const m=(a+b)/2; if(npv(flows,a)*npv(flows,m)<=0)b=m;else a=m; }
  return (a+b)/2;
};

test('B1: all debt principal reconciles, and every maturity is paid once around exit', () => {
  for(const market of markets) for(const strategy of supportedStrategies(market)) for(const exitYear of [6,7,8,10,15]) {
    const r=runCase(market,strategy.id,exitYear); if(r.na)continue;
    const d=sizeProjectDebt(r,{exitYear,riskClass:riskClassFor(market,strategy.id)});
    let balance=d.totalDebt;
    for(const row of d.debtLedger) {
      near(row.opening,balance,'opening');
      near(row.opening-row.scheduledPrincipal-row.maturityRepayment,row.closing,'principal conservation');
      balance=row.closing;
    }
    near(balance,0,'fully repaid at life end');
    const independent=r.exitFlows.slice();
    d.debtDraws.forEach((cash,t)=>{independent[t]+=cash;});
    for(let y=1;y<=exitYear;y++) independent[r.codOffset+y]-=d.service[y-1]+d.maturityRepayment[y-1];
    independent[r.codOffset+exitYear]-=d.outstanding[exitYear-1];
    independent.forEach((cash,t)=>near(d.equityFlows[t],cash,'equity annual reconciliation'));
    const irr=root(independent);
    if(irr===null)assert.equal(d.irrLevered,null);else near(d.irrLevered,irr,'independent exit IRR');
    const hold=r.holdFlows.slice();
    d.debtDraws.forEach((cash,t)=>{hold[t]+=cash;});
    for(let y=1;y<=r.eb.length;y++)hold[r.codOffset+y]-=d.service[y-1]+d.maturityRepayment[y-1];
    hold.forEach((cash,t)=>near(d.holdFlows[t],cash,'hold cash reconciliation'));
    near(d.maturityFundingGap[6],Math.max(0,d.maturityRepayment[6]+d.service[6]-r.eb[6]),'maturity gap');
  }
});

test('B2: zero-debt equity uses the exact asset calendar, including delayed construction and VAT', () => {
  for(const market of markets) for(const months of [0,12,24,36]) {
    const variant=withOverrides(market,{constructionMonths:months});
    const r=runBaseCase(variant,5);if(r.na)continue;
    const d=sizeProjectDebt(r,{exitYear:5,conventions:{maxGearingSecured:0,maxGearingMarket:0}});
    assert.deepEqual(d.equityFlows,r.exitFlows);
    assert.deepEqual(d.holdFlows,r.holdFlows);
    assert.equal(d.irrLevered,r.irrExit);
    assert.equal(d.irrLeveredHold,r.irrHold);
  }
  const run=months=>sizeProjectDebt(runCase(withOverrides(byId('wa'),{constructionMonths:months}),'cap',5),{exitYear:5});
  assert.ok(run(36).irrLevered<run(12).irrLevered);
});

test('B3: post-contract capacity is unawarded, valued at renewal risk, and excluded from secured debt', () => {
  for(const id of ['wa','ie','caiso']) {
    const m=byId(id),r=runCase(m,'cap',5),term=m.comparison.economics.contractYears;
    assert.ok(r.secY[term-1]>0);
    assert.equal(r.aucY[term-1],0);
    assert.equal(r.secY[term],0);
    assert.ok(r.aucY[term]>0);
    for(let i=0;i<15;i++)near(r.secY[i]+r.aucY[i],r.capY[i],'capacity total unchanged');
    const rates=r.valuationRates;
    const tail=(values,rate)=>values.reduce((sum,cash,i)=>i>=5?sum+cash/(1+rate)**(i+1-5):sum,0);
    const expected=tail(r.secY,rates.secured)+tail(r.aucY,rates.renewal)+tail(r.mchY,rates.merchant)
      -tail(Array(15).fill(m.comparison.economics.opexPerMW*r.fxRate),rates.opex)-tail(r.svcY,rates.opex);
    near(r.exitVal,expected,'independent tail value');
    assert.ok(r.evidenceNpv.amounts.proxy>0 || Object.values(r.evidenceNpv.amounts).some(v=>v>0));
    const d=sizeProjectDebt(r,{exitYear:5});
    assert.ok(d.trancheA.tenor<=term+2);
    assert.equal(r.renewalEvidence,'unawarded-assumption');
  }
});

test('B4/B7: every eligible design agrees across grid and brief, with all pricing factors and yield overrides', () => {
  for(const market of markets) {
    const design=marketDesign(market);if(design.withheld)continue;
    const grid=designGrid(design);
    for(const point of design.sweep.points.filter(p=>p.priced&&p.eligible)) {
      const econ=designEconomics(market,design,point.route,point.hours);
      const r=runCase(marketAt(market,point.route,point.hours),point.route,5,point.runOptions);
      assert.equal(econ.hold,point.irrHold===null?null:Number(point.irrHold.toFixed(4)));
      assert.equal(econ.hold,grid.cells.find(p=>p.route===point.route&&p.hours===point.hours).hold);
      assert.equal(econ.exit,Number(r.irrExit?.toFixed(4)) || (r.irrExit===0?0:null));
      assert.deepEqual(econ.valuationRates,r.valuationRates);
      assert.deepEqual(econ.runOptions,point.runOptions);
    }
  }
  const market=byId('wa');
  const design=marketDesign(market);
  design.sweep=sweepDesign(market,{runOptions:{exitYContracted:0.08,exitYAuction:0.12,exitYMerchant:0.13}});
  const econ=designEconomics(market,design,'cap',7);
  assert.deepEqual(econ.valuationRates,{secured:0.08,renewal:0.12,merchant:0.13,opex:0.07});
  const point=design.sweep.points.find(p=>p.route==='cap'&&p.hours===7);
  const variant=marketAt(market,'cap',7);
  const stressed=runCase(withOverrides(variant,{degr:5}),'cap',5,point.runOptions);
  const base=runCase(variant,'cap',5,point.runOptions);
  assert.ok(stressed.capY[9]<base.capY[9],'a degradation stress also changes duration-linked capacity credit');
});

test('B5: duration-specific absolute stresses bracket the base; costs and revenues move in the intended direction', () => {
  let count=0;
  for(const market of markets) {
    const design=marketDesign(market);if(design.withheld)continue;
    for(const p of design.sweep.points.filter(p=>p.priced&&p.eligible)) {
      count++;
      const variant=marketAt(market,p.route,p.hours),e=variant.comparison.economics;
      const set=runScenarioSet(variant,p.route,5,p.runOptions);
      for(const key of ['capexPerMW','opexPerMW']) {
        if(set.bear.overrides[key]===undefined)continue;
        assert.ok(set.bear.overrides[key]>=e[key]-1e-7,`${market.manifest.id}/${p.hours}/${key}: bear cannot lower cost`);
        assert.ok(set.bull.overrides[key]<=e[key]+1e-7);
        const isolated=runCase(withOverrides(variant,{[key]:set.bear.overrides[key]}),p.route,5,p.runOptions);
        assert.ok(isolated.exitVal-isolated.net<=set.base.result.exitVal-set.base.result.net+1e-7);
      }
      for(const key of ['merchGross','contracted','securedContracted']) {
        if(set.bear.overrides[key]===undefined)continue;
        assert.ok(set.bear.overrides[key]<=e[key]+1e-7);
        assert.ok(set.bull.overrides[key]>=e[key]-1e-7);
      }
      if(e.serviceSchedulePerMW) {
        const k=p.hours/market.comparison.archetype.durationHours;
        e.serviceSchedulePerMW.forEach((value,i)=>near(value,market.comparison.economics.serviceSchedulePerMW[i]*k,'service scaling'));
      }
    }
  }
  assert.ok(count>100,'test the full eligible design set');
});
