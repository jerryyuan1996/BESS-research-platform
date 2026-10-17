import test from 'node:test';
import assert from 'node:assert/strict';
import { byId } from '../src/markets/registry.js';
import { createCaseRecord,replayCaseRecord,entryPriceAtHurdle } from '../src/comparison/caseRecord.js';
import { DEBT_CONVENTIONS } from '../src/economics/projectDebt.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { projectEvidenceStatus } from '../src/comparison/projectEvidence.js';
test('a serialized case reproduces all asset and equity cash flows with overrides and explicit FX',()=>{
  const record=createCaseRecord({market:byId('wa'),strategyId:'cap',exitYear:10,
    overrides:{constructionMonths:36},runOptions:{exitYContracted:0.08,fxRates:{AUD:0.7}},
    conventions:DEBT_CONVENTIONS,modelCommit:'test-commit'});
  const replay=replayCaseRecord(JSON.parse(JSON.stringify(record)));
  assert.deepEqual(replay.result,record.result);
  assert.deepEqual(replay.debt,record.debt);
  assert.equal(record.modelCommit,'test-commit');
  assert.equal(record.runOptions.fxRates.AUD,0.7);
  assert.deepEqual(record.unresolvedGates,record.result.investmentGate);
});
test('a user-set hurdle solves zero NPV after the incremental entry price, with no assumed default',()=>{
  const result=runBaseCase(byId('wa'),5);
  assert.equal(entryPriceAtHurdle(result,null),null);
  for(const hurdle of [0,0.08,0.15,0.25]) {
    const p=entryPriceAtHurdle(result,hurdle);
    const flows=result.exitFlows.slice();flows[0]-=p.entryPremiumPerMW;
    const npv=flows.reduce((sum,cash,t)=>sum+cash/(1+hurdle)**t,0);
    assert.ok(Math.abs(npv)<1e-6);
  }
  assert.ok(entryPriceAtHurdle(result,0.25).entryPremiumPerMW<entryPriceAtHurdle(result,0.08).entryPremiumPerMW);
});
test('a project gate needs a document reference or exclusion reason; missing inputs stay unresolved',()=>{
  assert.ok(projectEvidenceStatus().every(g=>g.status==='unresolved'));
  const gates=projectEvidenceStatus({connection:{status:'provided'},land:{status:'not-applicable',sourceRef:'Lease inside acquisition company'}});
  assert.equal(gates.find(g=>g.id==='connection').status,'unresolved');
  assert.equal(gates.find(g=>g.id==='land').status,'not-applicable');
});
