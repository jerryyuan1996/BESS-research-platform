import test from 'node:test';
import assert from 'node:assert/strict';
import { markets, byId } from '../src/markets/registry.js';
import { opportunities, LENSES } from '../src/experience/model.js';
import { compareOpportunity } from '../src/opportunities/model.js';
import { SPECIAL_OPPORTUNITIES, opportunityById, SCOUT_OPPORTUNITIES } from '../src/opportunities/catalog.js';
import { acquisitionCashFlows, validateAcquisition } from '../src/acquisition/valuation.js';
import { nominalAnnual } from '../src/acquisition/cashflows.js';
import { revenueMechanismsFor, REVENUE_MECHANISMS } from '../src/opportunities/revenue.js';
const close = (a,b,tolerance=1e-5) => assert.ok(Math.abs(a-b)<tolerance, a+' != '+b);
const pv = (flows,r) => flows.reduce((s,c)=>s+c.amount/(1+r)**c.at,0);

test('every modelled market has a sourced opportunity; scouts remain unpriced',()=>{
  assert.deepEqual(new Set(SPECIAL_OPPORTUNITIES.map(o=>o.market)),new Set(markets.map(m=>m.manifest.id)));
  assert.equal(new Set(SPECIAL_OPPORTUNITIES.map(o=>o.id)).size,SPECIAL_OPPORTUNITIES.length);
  assert.equal(SCOUT_OPPORTUNITIES.length,8);
  for(const o of SPECIAL_OPPORTUNITIES){
    assert.match(o.source,/^https:\/\//);
    for(const key of ['label','thesis','conditions','risk'])assert.equal(o[key].length,2);
    assert.ok(o.months[1]>=o.months[0]);
  }
});

test('identical timing, cost and rights produce identical cash flows and no extra rights value',()=>{
  const c=compareOpportunity(byId('fi'),opportunityById('fi-available-node'),'infraFund',null,
    {baselineMonths:18,specialMonths:18,targetPercent:5});
  assert.ok(!c.unavailable);
  assert.deepEqual(c.standard.input.annual,c.alternative.input.annual);
  close(c.standard.npv,c.alternative.npv);
  close(c.standard.atPrice.annualReturn,c.alternative.atPrice.annualReturn);
  close(c.relativeCeiling,0);
  close(c.safePremium,0);
});

test('rights budget preserves each conventional route and the target, after fees and costs',()=>{
  const market=byId('de'),o=opportunityById('de-existing-node');
  const values={baselineMonths:36,specialMonths:12,targetPercent:5,buildPremiumPct:0};
  const c=compareOpportunity(market,o,'infraFund',null,values);
  assert.ok(c.safePremium>1000);
  const residuals=[];
  for(const route of ['hold','sale']){
    const conventional=pv(acquisitionCashFlows(c.standard.input,'infraFund',route,c.commonPrice).flows,c.targetReturn);
    const special=pv(acquisitionCashFlows(c.alternative.input,'infraFund',route,c.commonPrice+c.safePremium).flows,c.targetReturn);
    assert.ok(special>=-1e-5);
    assert.ok(special>=conventional-1e-5);
    residuals.push(special-conventional);
  }
  close(Math.min(...residuals),0,1e-4);
  const tooMuch=compareOpportunity(market,o,'infraFund',null,{...values,nodePremiumPerMW:c.safePremium+100});
  assert.equal(tooMuch.comparable,false);
  close(c.safePremiumPerMWh,c.safePremium/c.alternative.input.durationHours);
});

test('qualification lag reduces income but not costs or the fixed contract expiry',()=>{
  const input={cashFlowBasis:'nominal',revenueQualificationMonths:6,annual:[
    {secured:100,renewal:20,merchant:80,opex:30,capex:4,tax:0},
    {secured:0,renewal:0,merchant:100,opex:30,capex:4,tax:0},
  ]};
  const annual=nominalAnnual(input,{codYears:1});
  close(annual[0].secured,50);close(annual[0].merchant,40);close(annual[0].renewal,10);
  close(annual[0].opex,30);close(annual[0].capex,4);
  close(annual[1].secured,0);close(annual[1].merchant,100);
  const floor={...input,revenueSupport:{type:'floor',years:1,floor:200,assumed:true},
    annual:input.annual.map(y=>({...y,supportEligibleRevenue:100}))};
  close(nominalAnnual(floor,{codYears:1})[0].secured,100);
  const m=byId('fi'),o=opportunityById('fi-available-node');
  const fast=compareOpportunity(m,o,'infraFund',null,{specialMonths:12,targetPercent:5});
  const late=compareOpportunity(m,o,'infraFund',null,{specialMonths:12,targetPercent:5,specialQualificationMonths:12});
  assert.ok(late.alternative.npv<fast.alternative.npv);
  close(late.alternative.codMonths,fast.alternative.codMonths);
  close(late.alternative.qualifiedMonths,fast.alternative.qualifiedMonths+12);
});

test('small routes have actual small MW, no automatic long-term award and explicit cost penalties',()=>{
  for(const id of ['nem-sub5','ercot-small-dg','jp-tokyo-small','ro-sub5']){
    const o=opportunityById(id),m=byId(o.market);
    const c=compareOpportunity(m,o,'strategic',null,{buildPremiumPct:15,opexPremiumPct:15});
    assert.ok(!c.unavailable,id);
    assert.equal(c.alternative.input.powerMW,o.powerMW);
    assert.equal(c.alternative.input.strategyId,'mer');
    assert.equal(c.alternative.input.revenueSupport,null);
    assert.equal(c.alternative.assumptions.capitalSupportPerMW,0);
    close(c.alternative.assumptions.buildBudget,c.standard.assumptions.buildBudget*1.15);
    close(c.alternative.input.annual[0].opex,c.standard.input.annual[0].opex*1.15);
  }
});

test('all investor comparisons validate, retain currencies and preserve original play/market data',()=>{
  const before=JSON.stringify(markets.map(m=>m.comparison));
  for(const investor of Object.keys(LENSES)){
    const rows=opportunities(investor);
    for(const o of SPECIAL_OPPORTUNITIES){
      const row=rows.find(r=>r.id===o.market),playBefore=JSON.stringify(row.play);
      const c=compareOpportunity(row.market,o,investor,row.play);
      assert.ok(!c.unavailable,investor+'/'+o.id+': '+c.unavailable);
      for(const side of [c.standard,c.alternative]){
        assert.deepEqual(validateAcquisition(side.input),[]);
        assert.equal(side.input.targetReturn,c.targetReturn);
        assert.equal(side.input.annual.length,20);
        assert.equal(side.input.debt,null);
      }
      assert.equal(c.standard.input.currency,c.alternative.input.currency);
      assert.deepEqual(c.standard.input.scenarios.map(s=>s.probability),c.alternative.input.scenarios.map(s=>s.probability));
      assert.equal(JSON.stringify(row.play),playBefore);
    }
  }
  assert.equal(JSON.stringify(markets.map(m=>m.comparison)),before);
});

test('infeasible budgets, invalid inputs and ineligible entry routes do not become free connections',()=>{
  const m=byId('de'),o=opportunityById('de-existing-node');
  for(const values of [{avoidedGridPerMW:1e12},{specialMonths:NaN},{nodePremiumPerMW:-1},{lifeYears:20.5},{stage:'operating'}])
    assert.ok(compareOpportunity(m,o,'infraFund',null,values).unavailable);
  assert.ok(compareOpportunity(m,o,'foreignFirstTimer',null,{stage:'greenfield'}).unavailable);
  const c=compareOpportunity(m,o,'infraFund',null,{targetPercent:80});
  assert.equal(c.safePremium,null);assert.equal(c.comparable,false);
});

test('mechanism explanation follows the actual revenue route and distinguishes MACSE, toll and merchant',()=>{
  assert.deepEqual(revenueMechanismsFor(byId('it'),'cap'),['capacity','merchant','ancillary']);
  assert.deepEqual(revenueMechanismsFor(byId('it'),'ltda'),['macse']);
  assert.equal(revenueMechanismsFor(byId('nem'),'ltda')[0],'cis');
  assert.equal(revenueMechanismsFor(byId('jp_tokyo'),'ltda')[0],'ltda');
  assert.equal(revenueMechanismsFor(byId('ca_on'),'cap')[0],'lt2');
  assert.equal(revenueMechanismsFor(byId('de'),'toll')[0],'toll');
  assert.deepEqual(revenueMechanismsFor(byId('ercot'),'mer'),['merchant','ancillary']);
  for(const m of Object.values(REVENUE_MECHANISMS))for(const k of ['title','payer','problem','pricing','drivers','discipline'])assert.equal(m[k].length,2);
});
