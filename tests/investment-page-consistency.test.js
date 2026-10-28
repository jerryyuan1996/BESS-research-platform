import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { opportunities, LENSES, featuredOpportunity } from '../src/experience/model.js';
import { opportunitiesFor, opportunityById } from '../src/opportunities/catalog.js';
import { compareOpportunity } from '../src/opportunities/model.js';
import { deliveryTimeline, T_ZERO } from '../src/opportunities/delivery.js';
import { acquisitionCashFlows } from '../src/acquisition/valuation.js';
const near=(a,b,tolerance=.01)=>assert.ok(Math.abs(a-b)<tolerance,a+' != '+b);

test('all 64 headline returns, capex and construction dates equal the default conventional column',()=>{
  for(const investor of Object.keys(LENSES))for(const row of opportunities(investor)){
    const c=compareOpportunity(row.market,opportunitiesFor(row.id)[0],investor,row.play);
    assert.ok(!c.unavailable,investor+'/'+row.id);
    assert.equal(row.econ.hold,c.standard.atPrice?.annualReturn??null);
    assert.equal(row.investment.capexPerMW,c.standard.assumptions.buildBudget);
    assert.equal(row.investment.rtbMonths,c.standard.codMonths);
    assert.equal(c.standard.input.annual.length,20);
    assert.equal(c.standard.input.stage,'ready-to-build');
    const r=c.standard.atPrice;
    if(r){
      const f=acquisitionCashFlows(c.standard.input,investor,r.route,c.standard.price).flows;
      near(f.reduce((s,x)=>s+x.amount/(1+r.annualReturn)**x.at,0),0,Math.max(.01,row.investment.capexPerMW*1e-8));
    }
  }
});

test('foreign first-timers feature Finland without changing the research ranking',()=>{
  const rows=opportunities('foreignFirstTimer');
  assert.equal(featuredOpportunity(rows,'foreignFirstTimer').id,'fi');
  assert.equal(new Set(rows.map(r=>r.rank)).size,16);
  assert.equal(featuredOpportunity(opportunities('infraFund'),'infraFund').id,'it');
});

test('eight-hour MACSE has its own energy-scaled construction budget and keeps the two routes separate',()=>{
  const row=opportunities('infraFund').find(r=>r.id==='it');
  const c=compareOpportunity(row.market,opportunityById('it-macse'),'infraFund',row.play);
  assert.equal(c.standard.input.strategyId,'cap');
  assert.equal(c.alternative.input.strategyId,'ltda');
  assert.equal(c.standard.input.durationHours,4);
  assert.equal(c.alternative.input.durationHours,8);
  assert.ok(c.alternative.assumptions.buildBudget>c.standard.assumptions.buildBudget*1.5);
  assert.ok(Math.abs(row.legacyEcon.hold-.146)<.0001);
  assert.ok(Math.abs(row.investment.irr-.096174)<.00001);
});

test('the common T+0 and milestone cash flows reconcile to the investment model in all markets',()=>{
  for(const investor of Object.keys(LENSES))for(const row of opportunities(investor)){
    const c=compareOpportunity(row.market,opportunitiesFor(row.id)[0],investor,row.play);
    for(const reference of [c.standard,c.alternative]){
      const t=deliveryTimeline(reference,investor,row.id);
      assert.deepEqual(t.milestones.find(m=>m.kind==='delivery'&&m.month===0).title,T_ZERO);
      near(t.codMonths,reference.codMonths);
      near(t.qualifiedMonths,reference.qualifiedMonths);
      near(t.allCash.reduce((s,x)=>s+x.amount,0),t.rawCash.reduce((s,x)=>s+x.amount,0),.02);
      const rate=.1;
      near(t.allCash.reduce((s,x)=>s+x.amount/(1+rate)**(x.month/12),0),
        t.rawCash.reduce((s,x)=>s+x.amount/(1+rate)**x.at,0),.05);
      assert.ok(t.milestones.some(m=>m.title[0]==='Revenue eligibility achieved'));
    }
  }
});

test('every opportunity country watermark is a local SVG asset',()=>{
  for(const country of ['australia','germany','britain','ireland','romania','poland','japan','usa','finland','italy','canada']){
    const text=fs.readFileSync('public/country-maps/'+country+'.svg','utf8');
    assert.match(text,/<svg[^>]*viewBox="0 0 300 300"/);
    assert.match(text,/<path fill=/);
  }
});
