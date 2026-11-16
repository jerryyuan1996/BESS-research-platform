import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, LENSES, featuredOpportunity } from '../src/experience/model.js';
import { HOME_BRIEFING } from '../src/briefing/homeData.js';
import { investorOpportunities } from '../src/acquisition/opportunities.js';
import { byId } from '../src/markets/registry.js';
import { returnPosition, situationalQualifier, meetsTarget, debtEffect, decisionTrace,
  nextDatedEvent, localRevenueBridge, canPromote, passLast } from '../src/experience/traceability.js';

const example = (hold, price = null) => ({ call:'opportunistic', econ:{hold,levered:.14,test:{target:.1,leveredTarget:.12}},
  investment:{maxPricePerMW:price} });
test('Situational qualifier uses all-equity target, then a supported positive price',()=>{
  assert.equal(situationalQualifier(example(.1)), 'clears');
  assert.equal(situationalQualifier(example(.099, 100)), 'price');
  assert.equal(situationalQualifier(example(.099, 0)), 'below');
  assert.equal(situationalQualifier(example(.099, -100)), 'below');
  assert.equal(situationalQualifier(example(null)), null);
  const operating={...example(.05),investment:{operatingPurchase:{maxPricePerMW:200}}};
  assert.equal(situationalQualifier(operating),'price');
  assert.equal(situationalQualifier({...example(.05),call:'wait'}),null);
  assert.equal(meetsTarget(example(.05),'levered'),true,'matrix toggle uses its own target');
  assert.equal(returnPosition(example(.05)),'below','debt cannot clear the all-equity qualifier');
});
test('fund Situational groups reflect the approved Polish grant Watch',()=>{
  const groups=key=>opportunities('infraFund').filter(r=>situationalQualifier(r)===key).map(r=>r.id).sort();
  assert.deepEqual(groups('clears'),['fi','wa']);
  assert.deepEqual(groups('price'),['caiso','gb','jp_hokkaido','jp_kyushu','jp_tokyo','nem','ro']);
  /* ERCOT left the Situational group on 16 November 2026: the fund call is Pass. */
  assert.deepEqual(groups('below'),['de']);
  assert.equal(opportunities('infraFund').find(r=>r.id==='pl').call,'wait');
  const rows=opportunities('infraFund');
  assert.equal(rows.find(r=>r.id==='ercot').call,'avoid');
  assert.equal(rows.at(-1).id,'ercot','a Pass row is shown, last');
});
test('debt flags dilution explicitly, including a negative levered return',()=>{
  assert.equal(debtEffect({holdIRR:.1,leveredIRR:.09}),'dilutes');
  assert.equal(debtEffect({holdIRR:.01,leveredIRR:-.01}),'dilutes');
  assert.equal(debtEffect({holdIRR:.1,leveredIRR:.11}),'adds');
  assert.equal(debtEffect({holdIRR:.1,leveredIRR:.1}),'neutral');
  assert.equal(debtEffect({holdIRR:null,leveredIRR:.1}),'unavailable');
});
test('Pass acquisitions are visible, last and never promoted; not-accessible stays excluded',()=>{
  const it={market:'it',call:'avoid',stage:'ready-to-build',playRecord:{id:'test-it',route:'cap',hours:4}};
  const gb={market:'gb',call:'wait',stage:'ready-to-build',playRecord:{id:'test-gb',route:'toll',hours:2}};
  const lenses=Object.fromEntries(Object.keys(LENSES).map(id=>[id,{rows:[it,gb]}]));
  const result=investorOpportunities([byId('it'),byId('gb')],lenses,{});
  for(const rows of Object.values(result)){
    assert.equal(rows.length,2);
    assert.equal(rows.at(-1).call,'avoid');
    assert.equal(rows.at(-1).decision,'pass');
    assert.equal(canPromote(rows.at(-1)),false);
  }
  const blocked=Object.fromEntries(Object.keys(LENSES).map(id=>[id,{rows:[{...it,call:'not-accessible'},gb]}]));
  for(const rows of Object.values(investorOpportunities([byId('it'),byId('gb')],blocked,{})))assert.deepEqual(rows.map(r=>r.market),['gb']);
  const rows=[{id:'fi',call:'avoid',play:{},econ:{priced:true}},{id:'it',call:'enter-now',play:{},econ:{priced:true}}];
  assert.equal([...rows].sort(passLast).at(-1).id,'fi');
  assert.equal(featuredOpportunity(rows,'foreignFirstTimer').id,'it');
});
test('all 17 priced cases in every lens have the trace fields and a reconciled target',()=>{
  for(const lens of Object.keys(LENSES)){
    const rows=opportunities(lens).filter(r=>r.investment);
    assert.equal(rows.length,17);
    for(const row of rows){
      const trace=decisionTrace(row,Object.values(HOME_BRIEFING.triggers),'2026-11-14');
      assert.ok(trace.gate.every(Boolean),`${lens}/${row.id}: gate`);
      assert.ok(trace.changes.every(x=>x.length===2&&x.every(Boolean)));
      assert.ok(['strong','fair','thin'].includes(trace.evidence));
      assert.notEqual(trace.debt,'unavailable');
      const b=row.investment.targetBuildUp;
      assert.ok(Object.values(b).every(Number.isFinite));
      assert.ok(Math.abs(b.government+b.investorStage+b.merchant-row.investment.test.target)<1e-12);
      if(trace.event)assert.match(trace.event.expected,/^\d{4}-\d{2}(?:-\d{2})?$/);
    }
  }
});
test('dated events preserve month precision, ignore resolved events and omit missing dates',()=>{
  const row={id:'it',reviewBy:'2027-03-31'};
  const events=[{market:'it',expected:'2027-01-01',outcome:{}},{market:'it',expected:null},{market:'it',expected:'2027-02',label:['Event','事件']}];
  assert.equal(nextDatedEvent(row,events,'2026-11-14').expected,'2027-02');
  assert.equal(nextDatedEvent(row,events,'2027-03-01').expected,'2027-03-31');
  assert.equal(nextDatedEvent({id:'it'},[],'2026-11-14'),null);
  assert.equal(nextDatedEvent({id:'it',reviewBy:'2026-01'},[],'2026-11-14').overdue,true);
  assert.equal(nextDatedEvent({...row,next:'named-undated'},[
    {id:'named-undated',market:'it',expected:null},
    {id:'other-route',market:'it',expected:'2026-12-01'},
  ],'2026-11-14').expected,'2027-03-31','an unrelated route event cannot make this call look dated');
});
test('bridge display conversion preserves all model fields and reconciles local cash',()=>{
  for(const row of opportunities('infraFund').filter(r=>r.investment)){
    const i=row.investment,before=JSON.stringify(i),local=localRevenueBridge(i);
    for(const [key,value] of Object.entries(i.bridge))assert.ok(Math.abs(local[key]*i.fxToUSD-value)<1e-6);
    assert.ok(Math.abs(local.fixed+local.renewal+local.trading-local.service-local.operating-local.tax-local.net)<1e-6);
    assert.equal(JSON.stringify(i),before);
  }
});
