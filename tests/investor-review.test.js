import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, caseFor, LENSES } from '../src/experience/model.js';
import { currentThesis, margin, marginText, availability } from '../src/experience/decision.js';
import { analyseRisk } from '../src/experience/riskAnalysis.js';
import { eventDue, eventCountdown } from '../src/news/eventDates.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,a+' != '+b);

test('all investor cases describe the current after-tax model, including the two new markets',()=>{
  for(const lens of Object.keys(LENSES))for(const row of opportunities(lens)){
    const words=currentThesis(row).join(' ');
    if(row.market.comparison.engineReady===false){
      assert.equal(row.investment,null);assert.equal(row.econ.hold,null);assert.match(words,/unpublished/);continue;
    }
    assert.match(words,new RegExp((row.econ.hold*100).toFixed(1).replace('.','\\.')+'%'));
    assert.match(words,/nominal after project tax/);
    near(row.investment.secured,row.investment.bridge.fixed/row.investment.bridge.gross);
    assert.ok(row.investment.peakEquityPerMW>0,row.id+' construction is not free');
    assert.equal(row.investment.purchasePricePerMW,0);
  }
});
test('Finland reference ratio is 40 percent and remains distinct from the stricter sourcing condition',()=>{
  const row=opportunities('infraFund').find(r=>r.id==='fi');
  assert.equal(Math.round(row.investment.secured*100),40);
  assert.match(currentThesis(row)[1],/40%/);
  assert.match(row.play.action.text[0],/half/);
});
test('matrix margin uses each markets actual hurdle and shows thin levered headroom',()=>{
  const row=opportunities('infraFund').find(r=>r.id==='ie');
  near(margin(row),row.econ.hold-row.econ.test.target);
  near(margin(row,'levered'),row.econ.levered-row.econ.test.leveredTarget);
  assert.ok(margin(row)<0 && margin(row,'levered')>=0 && margin(row,'levered')<.005);
  assert.match(marginText(row,'levered')[0],/thin margin/);
  const sa=opportunities('infraFund').find(r=>r.id==='sa');
  assert.equal(margin(sa),null);assert.match(availability(sa)[0],/payment is unpublished/);
});
test('approximate dates never become a made-up deadline',()=>{
  assert.equal(eventDue('2026-10'),'2026-10-31');
  for(const days of [0,1,31])assert.match(eventCountdown({expected:'2026-10',days})[0],/exact date unconfirmed/);
  assert.match(eventCountdown({expected:'2026-10',days:-1})[0],/outcome to confirm/);
  assert.equal(eventCountdown({expected:'2026-10-31',days:1})[0],'Tomorrow');
  assert.equal(eventCountdown({expected:null,days:null})[1],'日期待公布');
  assert.equal(eventDue('2028-02'),'2028-02-29');
});
test('downside reuses the original debt amount and reconciles to the published investment case',()=>{
  const row=opportunities('infraFund').find(r=>r.id==='de');
  const a=analyseRisk(row,'infraFund',caseFor(row).overrides);
  near(a.reference.holdReturn.annualReturn,row.investment.holdIRR);
  near(a.stressed.holdReturn.annualReturn,row.investment.bearHoldIRR);
  near(a.fixed.loanPerMW,row.investment.leverage.loanPerMW);
  assert.ok(a.fixed.annualReturn<row.investment.leveredIRR);
  assert.ok(Number.isFinite(a.minCover));
  const unchanged=analyseRisk(row,'infraFund',{});
  near(unchanged.fixed.annualReturn,row.investment.leveredIRR);
});
test('ungraded Spain and Ontario still have a comparable declared downside',()=>{
  for(const id of ['es','ca_on']){
    const row=opportunities('infraFund').find(r=>r.id===id);
    assert.ok(Number.isFinite(row.investment.bearHoldIRR),id);
    assert.ok(row.investment.bearHoldIRR<row.investment.holdIRR,id);
  }
});
