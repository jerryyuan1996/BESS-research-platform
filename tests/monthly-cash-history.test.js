import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyCashSeries } from '../src/opportunities/monthlyCash.js';
import { historicalPressure, stressConditions } from '../src/experience/downsideHistory.js';
import { opportunities, LENSES } from '../src/experience/model.js';
import { opportunitiesFor } from '../src/opportunities/catalog.js';
import { compareOpportunity } from '../src/opportunities/model.js';
import { deliveryTimeline } from '../src/opportunities/delivery.js';
import { acquisitionCashFlows } from '../src/acquisition/valuation.js';
const sum=a=>a.reduce((s,x)=>s+x,0);
test('monthly cash keeps fractional original dates, zero-payment months and offsetting payments',()=>{
  const flows=[{at:0,amount:-10},{at:7.5/12,amount:-100},{at:7.5/12,amount:20},{at:27/12,amount:50},{at:255/12,amount:-5}];
  const before=JSON.stringify(flows),m=monthlyCashSeries(flows,200);
  assert.equal(m.length,256);assert.equal(m[7].net,-16000);
  assert.deepEqual(m[7].payments,[{month:7.5,amount:-20000},{month:7.5,amount:4000}]);
  assert.equal(m[8].net,0);assert.equal(m[8].cumulative,m[7].cumulative);
  assert.equal(m.at(-1).cumulative,-9000);assert.equal(JSON.stringify(flows),before);
  assert.deepEqual(monthlyCashSeries([]),[]);
});
test('all priced investor plans reconcile monthly project totals to the unchanged hold engine',()=>{
  for(const investor of Object.keys(LENSES))for(const row of opportunities(investor)){
    if(!row.investment)continue;
    const c=compareOpportunity(row.market,opportunitiesFor(row.id)[0],investor,row.play);
    for(const reference of [c.standard,c.alternative].filter(Boolean)){
      const t=deliveryTimeline(reference,investor,row.id,{route:'hold'});
      const original=acquisitionCashFlows(reference.input,investor,'hold',reference.price).flows;
      assert.deepEqual(t.rawCash,original);
      const m=monthlyCashSeries(t.rawCash,t.powerMW),total=sum(original.map(f=>f.amount*t.powerMW));
      assert.ok(Math.abs(m.at(-1).cumulative-total)<Math.max(.001,Math.abs(total)*1e-12),investor+'/'+row.id);
      assert.equal(t.route,'hold');
      assert.equal(m.at(-1).month,Math.floor(Math.max(...original.map(f=>f.at*12))+1e-6));
      if(reference===c.standard)assert.equal(reference.holdReturn?.annualReturn??null,row.econ.hold);
    }
  }
});
function sample(){
  const means=[100,50,75,25,40],daily=[];
  means.forEach((spread,i)=>{for(let d=1;d<=new Date(Date.UTC(2025,i+1,0)).getUTCDate();d++)daily.push({d:'2025-'+String(i+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),spread});});
  return {fetchedAt:'2025-06-15T00:00:00Z',daily,derived:{durationHours:4},source:{name:'Test primary source',url:'https://example.org'}};
}
test('historical frequency uses completed, sufficiently covered, consecutive months only',()=>{
  const s=sample(),r=historicalPressure(s,.25);
  assert.equal(r.count,2);assert.equal(r.total,4);assert.equal(r.frequency,.5);
  assert.deepEqual(r.events.map(e=>e.to),['2025-02','2025-04']);
  assert.equal(historicalPressure({...s,fetchedAt:'2025-04-17T00:00:00Z'},.25).total,2);
  s.daily=s.daily.filter(d=>!d.d.startsWith('2025-03')||Number(d.d.slice(-2))<=10);
  const gap=historicalPressure(s,.25);assert.equal(gap.total,2);assert.equal(gap.count,1);
  s.daily.push(s.daily[0]);assert.equal(historicalPressure(s,.25).total,2);
  assert.equal(historicalPressure(s,0),null);assert.equal(historicalPressure({},.2),null);
  assert.equal(historicalPressure(sample(),.9).count,0);
});
test('plain-language conditions use effective dates and secured-income terms rather than ineffective overrides',()=>{
  const base={codMonths:36,assumptions:{buildBudget:100},input:{currency:'EUR',annual:[{secured:50,merchant:30,opex:5},{secured:50},{secured:50}]}};
  const stress={codMonths:36,assumptions:{buildBudget:120},input:{currency:'EUR',annual:[{secured:40,merchant:20,opex:7},{secured:0},{secured:0}]}};
  const c=stressConditions(base,stress);
  assert.deepEqual(c.map(x=>x.kind),['build','fixed','term','trading','opex']);
  assert.deepEqual(c.find(x=>x.kind==='term'),{kind:'term',base:3,stress:1,currency:'EUR'});
  assert.deepEqual(stressConditions(base,base),[]);
});
