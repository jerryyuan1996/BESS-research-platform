import test from 'node:test';
import assert from 'node:assert/strict';
import { markets, byId } from '../src/markets/registry.js';
import { runCase } from '../src/comparison/engine.js';
import { withOverrides } from '../src/comparison/scenario.js';
import { readinessConfig, readinessFactor, revenueStartDate } from '../src/comparison/revenueReadiness.js';
import { readinessProfile, SOURCES } from '../src/readiness/research.js';
import { createCaseRecord, replayCaseRecord } from '../src/comparison/caseRecord.js';
import { operatingReference } from '../src/acquisition/operating.js';
import { acquisitionInput, marketAcquisitionReference } from '../src/acquisition/reference.js';
import { nominalAnnual } from '../src/acquisition/cashflows.js';
import { sizeProjectDebt } from '../src/economics/projectDebt.js';
import { incomeScenario } from '../src/acquisition/scenarios.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
// Hand-checkable currency-neutral case: 120 energy, 240 services, 36 opex.
const fixture=()=>({...byId('fi'),manifest:{...byId('fi').manifest,currency:'USD'},comparison:{...byId('fi').comparison,
  capabilities:{...byId('fi').comparison.capabilities,capacityMarket:true},economics:{capexPerMW:1000,opexPerMW:36,
    merchGross:120,services:240,feePct:0,degr:2,contracted:120,contractYears:2,toll:180,tollYears:2,
    tollIsFloor:true,tollRevertsToMerchant:true}}});
const run=(config={},strategy='mer',m=fixture())=>runCase(m,strategy,5,{revenueReadiness:config});

test('zero timing retains baseline cashflows; delay removes only the specified stream, not costs or life',()=>{
  const base=run(),gap=run({servicesMonths:6});
  near(base.eb[0],324);near(gap.eb[0],204);near(gap.mchY[0],240);
  assert.equal(gap.eb.length,15);near(gap.eb[1],base.eb[1]);near(gap.exitVal,base.exitVal);
  assert.ok(gap.irrHold<base.irrHold);assert.ok(gap.irrExit<base.irrExit);
  near(run({energyMonths:6}).eb[0],264);
  const all=run({energyMonths:12,servicesMonths:12});near(all.eb[0],-36);
  near(all.eb[1],base.eb[1]);assert.equal(all.codOffset,base.codOffset);
});
test('fractional months, year boundaries and ramps integrate lost availability',()=>{
  near(run({servicesMonths:1.5}).mchY[0],330);
  const gap=run({servicesMonths:15});near(gap.mchY[0],120);near(gap.mchY[1],(120+240*.75)*.98);
  near(run({servicesRampMonths:12}).mchY[0],240);
  near(run({servicesMonths:3,servicesRampMonths:6}).mchY[0],240);
});
test('the last required gate wins, while an unknown gate remains unknown',()=>{
  assert.equal(revenueStartDate([{date:'2027-01-01'},{date:'2027-04-01'},{date:'2027-02-01'}]),'2027-04-01');
  assert.equal(revenueStartDate([{date:'2027-01-01'},{}]),null);
  assert.throws(()=>revenueStartDate([{date:'2027-02-30'}]));
});
test('reserve weights allocate an existing stack; no implicit equal split or stacking',()=>{
  const r=run({products:[{id:'mFRR',share:.25,months:0},{id:'FCR',share:.75,months:12}]});
  near(r.mchY[0],180);
  const split=run({reserveSharePct:80,servicesMonths:6});near(split.mchY[0],216);
  const reweighted=run({reserveSharePct:80});near(reweighted.mchY[0],360);
  for(const c of [{servicesMonths:-1},{energyMonths:NaN},{reserveSharePct:101},{products:[]},
    {products:[{id:'x',share:.8}]},{products:[{id:'x',share:.5},{id:'x',share:.5}]}])assert.ok(run(c).na);
});
test('temporary permission expiry cuts revenue until reinstated and does not cancel fixed costs',()=>{
  const r=run({permissionExpiryMonths:18,finalApprovalMonths:21});
  near(r.mchY[1],360*.98*.75);
  const unknown=run({permissionExpiryMonths:18});near(unknown.eb[2],-36);
  near(run({permissionExpiryMonths:18,finalApprovalMonths:12}).eb[1],run().eb[1]);
});
test('capacity windows expire on their existing dates; a delay does not extend the award',()=>{
  const a=run({},'cap'),b=run({capacityMonths:6},'cap');
  near(b.secY[0],60);near(b.secY[1],120);near(b.secY[2],0);
  near(b.mchY[0],a.mchY[0]);
});
test('a floor protects only eligible months and cannot backfill pre-commencement losses',()=>{
  const floor=run({servicesMonths:12},'toll');near(floor.secY[0]+floor.mchY[0],180);
  const gap=run({servicesMonths:12,contractMonths:6},'toll');near(gap.secY[0]+gap.mchY[0],150);
  near(gap.secY[0],90);near(gap.secY[2],0);
  near(run({servicesMonths:12,contractMonths:12},'toll').mchY[0],120);
});
test('a fixed toll and retained capacity use different gates',()=>{
  const m=fixture();Object.assign(m.comparison.economics,{tollIsFloor:false,tollAdditiveWithCapacity:true});
  const r=run({contractMonths:6,capacityMonths:0},'toll',m);near(r.secY[0],90+120);near(r.mchY[0],0);
  Object.assign(m.comparison.economics,{tollYears:20,contractYears:20});
  const extended=operatingReference(m,'toll',20,{revenueReadiness:{contractMonths:192,capacityMonths:0}});
  near(extended.annual[15].secured,120);near(extended.annual[16].secured,300);
});

test('a delayed product does not silently reprice an illustrative contract floor',()=>{
  const m=fixture(),base=incomeScenario(m,{strategyId:'conditional-floor'});
  near(base.variant.comparison.economics.toll,180);
  const gap=incomeScenario(withOverrides(m,{revenueReadiness:{servicesMonths:12,contractMonths:6}}),{strategyId:'conditional-floor'});
  near(gap.variant.comparison.economics.toll,base.variant.comparison.economics.toll);
});
test('auction secured, renewal and energy cash flows keep their separate gates',()=>{
  const m=fixture();Object.assign(m.comparison.economics,{riskClass:'auction-renewal',securedContracted:120,
    securedContractYears:1,auctionRenewalCurve:[120,120]});
  const r=run({capacityMonths:18,servicesMonths:6},'cap',m);
  near(r.secY[0],0);near(r.aucY[1],60);near(r.mchY[0],240);
});
test('additional commissioning costs reduce the operating line and exit tail once',()=>{
  const base=run(),gap=run({extraCostPerMWMonth:10,extraCostMonths:72});
  near(base.eb[0]-gap.eb[0],120);near(base.eb[5]-gap.eb[5],120);
  near(base.exitVal-gap.exitVal,120/1.07);near(base.eb[6],gap.eb[6]);
});
test('model, acquisition, nominal floor settlement and extended life reconcile',()=>{
  const m=withOverrides(fixture(),{revenueReadiness:{servicesMonths:12,contractMonths:6}});
  const op=operatingReference(m,'toll',25);
  near(op.annual[0].secured+op.annual[0].merchant,150);
  const acq=acquisitionInput(m,'ready-to-build',{strategyId:'toll',contractConfirmed:true,cashTaxRate:0});
  const nominal=nominalAnnual({...acq,inflationRate:0},{codYears:2});
  near(nominal[0].secured+nominal[0].merchant,150);near(nominal[0].opex,36);
  const expiry=withOverrides(fixture(),{revenueReadiness:{permissionExpiryMonths:180,finalApprovalMonths:198}});
  const extended=operatingReference(expiry,'mer',25);
  near(extended.annual[15].merchant,0);assert.ok(extended.annual[16].merchant>0);assert.ok(extended.annual[17].merchant>extended.annual[16].merchant);
});
test('CIS cannot start before its conditions; nominal settlement retains the gate',()=>{
  const m=withOverrides(byId('nem'),{merchGross:1,services:0,revenueReadiness:{contractMonths:12}});
  const r=runCase(m,'ltda',5);near(r.secY[0],0);
  const a=acquisitionInput(m,'ready-to-build',{strategyId:'ltda',contractConfirmed:true,cashTaxRate:0});
  near(nominalAnnual({...a,inflationRate:0},{codYears:1})[0].secured,0);
  assert.ok(r.secY[1]>0);
});
test('readiness reduces acquisition value and flows through debt and serialized cases',()=>{
  const m=byId('fi'),base=marketAcquisitionReference(m,'ready-to-build','infraFund',{strategyId:'mer'});
  const overrides={revenueReadiness:{servicesMonths:12,energyMonths:6,extraCostMonths:6,extraCostPerMWMonth:100}};
  const gap=marketAcquisitionReference(m,'ready-to-build','infraFund',{strategyId:'mer',economicOverrides:overrides});
  assert.equal(base.status,'reference');assert.equal(gap.status,'reference');
  assert.ok(gap.referenceCases.find(c=>c.key==='base').pricePerMW<base.referenceCases.find(c=>c.key==='base').pricePerMW);
  const r=runCase(withOverrides(m,overrides),'mer',5),b=runCase(m,'mer',5);
  const debt=sizeProjectDebt(r,{exitYear:5,riskClass:'merchant'}),baseline=sizeProjectDebt(b,{exitYear:5,riskClass:'merchant'});
  assert.ok(debt.totalDebt<=baseline.totalDebt);
  const saved=createCaseRecord({market:m,strategyId:'mer',exitYear:5,overrides});
  assert.deepEqual(replayCaseRecord(JSON.parse(JSON.stringify(saved))).result,saved.result);
  assert.equal(m.comparison.economics.revenueReadiness,undefined);
});
test('all registered markets have sourced, dated readiness research and finite gated outputs',()=>{
  for(const m of markets){
    const p=readinessProfile(m.manifest.id);assert.ok(p,m.manifest.id);
    for(const row of p.rows)for(const id of row.sources){assert.ok(SOURCES[id]);assert.equal(SOURCES[id].reviewed,'2026-10-24');assert.ok(SOURCES[id].url.startsWith('https://'));}
    const r=runCase(m,'mer',5,{revenueReadiness:{servicesMonths:6}});
    if(!r.na)assert.ok(r.eb.every(Number.isFinite));
  }
});
test('a service gate can precede final approval; FON is not an automatic reserve start date',()=>{
  const c=readinessConfig({revenueReadiness:{servicesMonths:3,finalApprovalMonths:12,permissionExpiryMonths:18}});
  near(readinessFactor(c,'services',4),1);
});
