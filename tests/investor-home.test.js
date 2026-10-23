import test from 'node:test';
import assert from 'node:assert/strict';
import { briefingFromDisk } from '../src/briefing/disk.js';
import { markets } from '../src/markets/registry.js';
import { ARCHETYPES } from '../src/governance/archetypes.js';
import { referenceInputs,marketAcquisitionReference } from '../src/acquisition/reference.js';
import { displayedCase } from '../src/acquisition/presentation.js';
import { nominalAnnual } from '../src/acquisition/cashflows.js';
import { marketForPlay } from '../src/acquisition/play.js';
import { operatingReference } from '../src/acquisition/operating.js';
import { runCase } from '../src/comparison/engine.js';

const briefing=await briefingFromDisk({now:new Date('2026-10-23T10:00:00Z')});
const close=(a,b)=>assert.ok(Math.abs(a-b)<Math.max(1e-6,Math.abs(b)*1e-9),`${a} != ${b}`);

test('each opportunity prices its recommended play and respects investor entry scope',()=>{
  for(const [investor,rows] of Object.entries(briefing.acquisitions)){
    assert.ok(rows.length>0);
    for(const r of rows){
      assert.ok(ARCHETYPES[investor].entersAt.includes(r.stage),`${investor}: ${r.stage}`);
      assert.equal(r.strategyId,r.play.route);assert.equal(r.durationHours,r.play.hours);
      assert.equal(r.hours,r.play.hours);assert.equal(r.investor,investor);
      assert.ok(!['avoid','not-accessible'].includes(r.call));
    }
  }
  assert.ok(!briefing.acquisitions.foreignFirstTimer.some(r=>r.market==='nem'));
  assert.ok(briefing.acquisitions.infraFund.some(r=>r.market==='ca_on'&&r.researchAssumed));
});

test('published costs, income and coverage reconcile to the same priced annual cash flows',()=>{
  for(const investor of ['infraFund','developer'])for(const r of briefing.acquisitions[investor]){
    const market=markets.find(m=>m.manifest.id===r.market);
    const inputs=referenceInputs(market,r.stage,{play:r.play,strategyId:r.strategyId,runOptions:r.runOptions});
    for(const c of r.referenceCases){
      const {input}=inputs.find(x=>x.key===c.key),t=c.assumptions.terms;
      const y=nominalAnnual(input,input.scenarios.find(s=>s.operates))[0];
      close(t.firstOpexPerMW,y.opex);close(t.contractIncomePerMW,y.secured);
      close(t.firstRevenuePerMW,y.secured+y.renewal+y.merchant);
      close(t.securedRevenueShare,t.firstRevenuePerMW>0?y.secured/t.firstRevenuePerMW:0);
      assert.equal(t.lifeYears,input.annual.length);
      assert.equal(t.remainingContractYears,Math.max(0,input.contractYears-input.operatingAgeYears));
    }
  }
});

test('the Poland grant cohort keeps its grant without inventing a fixed income contract',()=>{
  const r=briefing.acquisitions.infraFund.find(r=>r.playId==='pl-grant-4h');
  assert.equal(r.play.grantPct,37.9);assert.equal(r.strategyId,'mer');
  const market=markets.find(m=>m.manifest.id==='pl');
  const granted=referenceInputs(market,r.stage,{play:r.play,strategyId:r.strategyId}).find(c=>c.key==='base');
  const without=referenceInputs(market,r.stage,{play:{...r.play,grantPct:0},strategyId:r.strategyId}).find(c=>c.key==='base');
  assert.ok(granted.assumptions.terms.grantPerMW>0);
  assert.equal(granted.assumptions.terms.capacityShare,0);
  const cash=granted.input.scenarios[0].recoveries.find(c=>c.kind==='capital-grant');
  close(cash.amount,granted.assumptions.terms.grantPerMW);
  assert.equal(without.assumptions.terms.grantPerMW,0);
  const noGrant=marketAcquisitionReference(market,r.stage,'infraFund',{play:{...r.play,grantPct:0},strategyId:r.strategyId});
  assert.ok(displayedCase(r).pricePerMW>=displayedCase(noGrant).pricePerMW);
});

test('WA co-investment uses the eight-hour play and its annual capacity derating',()=>{
  const r=briefing.acquisitions.infraFund.find(r=>r.market==='wa');
  assert.equal(r.hours,8);assert.equal(r.coInvest,true);assert.equal(r.stage,'ready-to-build');
  const market=markets.find(m=>m.manifest.id==='wa'),variant=marketForPlay(market,r.play);
  const first=operatingReference(variant,r.strategyId,25,r.runOptions);
  const expected=runCase(variant,r.strategyId,0,r.runOptions);
  for(let i=0;i<15;i++){close(first.annual[i].secured,expected.secY[i]);close(first.annual[i].renewal,expected.aucY[i]);}
  assert.equal(market.comparison.archetype.durationHours,7,'scenario scaling must not edit the market');
});

test('fixed toll, floor and CIS are distinct and preserve capacity versus income denominators',()=>{
  const gb=briefing.acquisitions.infraFund.find(r=>r.market==='gb'),t=displayedCase(gb).assumptions.terms;
  assert.equal(t.kind,'fixed');assert.equal(t.capacityShare,1);assert.ok(t.quotedIncomePerMW>0);
  const nem=briefing.acquisitions.infraFund.find(r=>r.market==='nem'),cis=displayedCase(nem).assumptions.terms;
  assert.equal(cis.kind,'collar');assert.equal(cis.capacityShare,null);
  assert.ok(cis.floorPerMW>cis.contractIncomePerMW);assert.equal(cis.topUpShare,.9);
  const it=briefing.acquisitions.infraFund.find(r=>r.market==='it'),cap=displayedCase(it).assumptions.terms;
  assert.equal(cap.kind,'capacity');assert.equal(cap.capacityShare,null);
  assert.ok(cap.securedRevenueShare>0&&cap.securedRevenueShare<1);
});

test('operating assumptions show remaining life, remaining contracts and works rather than another build',()=>{
  for(const r of Object.values(briefing.acquisitions).flat().filter(r=>r.stage==='operating'))for(const c of r.referenceCases){
    const t=c.assumptions.terms;
    assert.equal(t.buildPerMW,0);assert.ok(t.worksPerMW>=0);
    assert.equal(t.lifeYears,c.remainingYears);
    assert.equal(t.remainingContractYears,Math.max(0,r.contractYears-t.age));
    assert.equal(c.route,'hold');assert.equal(c.exitYear,null);
  }
});

test('the chosen scenario owns every visible input as well as the price and target',()=>{
  const cases=[{key:'base',status:'no-positive-price',assumptions:{terms:{firstOpexPerMW:20}}},
    {key:'favourable',status:'priced',pricePerMW:100,targetReturn:.1,assumptions:{terms:{firstOpexPerMW:15}}}];
  const chosen=displayedCase({baseCaseKey:'base',referenceCases:cases});
  assert.equal(chosen.key,'favourable');assert.equal(chosen.assumptions.terms.firstOpexPerMW,15);
});
