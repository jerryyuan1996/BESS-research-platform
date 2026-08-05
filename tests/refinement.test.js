import test from 'node:test';
import assert from 'node:assert/strict';

import { markets, byId } from '../src/markets/registry.js';
import { validateDecisionProfiles } from '../src/markets/decisionProfiles.js';
import {
  REVENUE_EVIDENCE_CLASS,
  isSecuredEligibleEvidence,
  validateRevenueEvidence,
} from '../src/governance/revenueEvidence.js';
import { pipelineEligibility } from '../src/projects/pipelineEligibility.js';
import { evaluateRevenueStackFeasibility } from '../src/economics/revenueStackFeasibility.js';
import {
  runScenarioSet,
  runEvidenceOnlyCase,
} from '../src/comparison/refinement.js';
import { runBaseCase } from '../src/comparison/engine.js';
import { runPortfolioScenarios } from '../src/comparison/portfolioScenario.js';
import { baseStrategy } from '../src/comparison/strategies.js';
import {
  setObservedFxSummary,
  activeFxState,
  clearObservedFx,
} from '../src/comparison/fx.js';

test('every market carries a valid IC decision profile', () => {
  assert.deepEqual(validateDecisionProfiles(markets.map(m => m.manifest.id)), []);
  for (const market of markets){
    assert.ok(market.comparison.refinement);
    assert.ok(market.comparison.refinement.investmentGate.length > 0);
  }
});

test('private proxies never qualify as evidence-secured or executed revenue', () => {
  assert.equal(isSecuredEligibleEvidence(REVENUE_EVIDENCE_CLASS.DERIVED_PRIVATE_PROXY), false);
  assert.equal(isSecuredEligibleEvidence(REVENUE_EVIDENCE_CLASS.PUBLISHED_MARKET_CLEARING), true);

  for (const id of ['nem', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido', 'ercot', 'caiso']){
    const result = runBaseCase(byId(id), 5);
    assert.equal(result.evidenceSecuredShare, 0, id + ': proxy fixed revenue must not be secured');
    assert.equal(result.executedShare, 0, id + ': no project award is loaded');
    assert.ok(result.modelledFixedShare >= result.proxyShare, id + ': proxy remains visible');
  }

  const wa = runBaseCase(byId('wa'), 5);
  assert.ok(wa.evidenceSecuredShare > 0, 'published WEM clearing remains evidence-secured');
  assert.equal(wa.executedShare, 0, 'market clearing is not an executed project award');
});

test('revenue evidence validation fails closed on incomplete records', () => {
  assert.ok(validateRevenueEvidence({
    evidenceClass:'private',
    valueClass:'proxy',
    projectBinding:true,
    basis:['Only English'],
    sources:[],
    asOf:'not-a-date',
  }).length >= 4);
});

test('owner Bear/Base/Bull ranges are monotonic wherever an IRR exists', () => {
  for (const market of markets){
    const set = runScenarioSet(market, baseStrategy(market), 5);
    const values = [set.bear, set.base, set.bull].map(item => item.result.irrHold);
    const finite = values.filter(Number.isFinite);
    for (let index = 1; index < finite.length; index++){
      assert.ok(finite[index] >= finite[index - 1] - 1e-10,
        market.manifest.id + ': owner scenarios must not reverse');
    }
  }
});

test('evidence-only cases remove proxy fixed revenue', () => {
  for (const id of ['nem', 'jp_tokyo', 'ercot', 'caiso']){
    const market = byId(id);
    const base = runBaseCase(market, 5);
    const evidence = runEvidenceOnlyCase(market, baseStrategy(market), 5).result;
    const baseIrr = Number.isFinite(base.irrHold) ? base.irrHold : -1;
    const evidenceIrr = Number.isFinite(evidence.irrHold) ? evidence.irrHold : -1;
    assert.ok(evidenceIrr <= baseIrr + 1e-10, id + ': proxy removal must not improve IRR');
  }
});

test('pipeline inclusion requires coverage, stable identity and de-duplication', () => {
  assert.equal(pipelineEligibility({ illustrative:true }).eligible, false);
  const complete = {
    coverageBoundary:'All transmission-scale projects in the market',
    sources:['Official queue'],
    lastUpdated:'2026-08-04',
    stableIdMethod:'Authority project identifier',
    deduplicationMethod:'One row per stable identifier',
    stageDefinition:'Published global taxonomy',
    durationCoverage:'MW and MWh, absence explicit',
    componentTreatment:'Hybrid components separated',
    inclusionRules:'Named projects with auditable stage',
    limitations:'Behind-the-meter projects excluded',
    namedProjects:true,
  };
  assert.equal(pipelineEligibility(complete).eligible, true);
});

test('revenue-stack feasibility is unknown without project constraints and fails overloads', () => {
  assert.equal(evaluateRevenueStackFeasibility(null).status, 'unknown');
  const pass = evaluateRevenueStackFeasibility({
    connectionMW:100,
    usableMWh:400,
    availabilityPct:95,
    commitments:[
      { id:'capacity', simultaneousMW:50, reservedMWh:200 },
      { id:'services', simultaneousMW:20, reservedMWh:50 },
    ],
  });
  assert.equal(pass.status, 'pass');

  const fail = evaluateRevenueStackFeasibility({
    connectionMW:100,
    usableMWh:400,
    availabilityPct:90,
    commitments:[
      { id:'capacity', simultaneousMW:80, reservedMWh:300 },
      { id:'services', simultaneousMW:30, reservedMWh:150 },
    ],
  });
  assert.equal(fail.status, 'fail');
  assert.equal(fail.allocationReady, false);
});

test('portfolio stress exposes correlated merchant and evidence-only downside', () => {
  const portfolio = runPortfolioScenarios(markets, 5);
  assert.ok(portfolio.correlatedMerchant.irr < portfolio.base.irr);
  assert.ok(portfolio.evidenceOnly.irr < portfolio.base.irr);
  assert.equal(portfolio.base.markets, markets.length);
});

test('FX uses fresh observations and rejects stale snapshots', () => {
  clearObservedFx();
  const summary = {
    source:{ name:'European Central Bank' },
    fetchedAt:'2026-08-04T00:00:00Z',
    refreshHours:24,
    staleAfterHours:96,
    derived:{ asOf:'2026-08-04', rates:{ EUR:1.2, GBP:1.4, AUD:0.7, JPY:0.0062 } },
  };
  const now = Date.parse('2026-08-04T12:00:00Z');
  assert.equal(setObservedFxSummary(summary, now), true);
  assert.equal(activeFxState().kind, 'observed');
  assert.equal(activeFxState().rates.EUR, 1.2);

  assert.equal(setObservedFxSummary({ ...summary, fetchedAt:'2026-07-01T00:00:00Z' }, now), false);
  assert.equal(activeFxState().kind, 'seed');
});

test('Poland defaults new entry to merchant and excludes the unnamed grant', () => {
  const market = byId('pl');
  assert.equal(baseStrategy(market), 'mer');
  assert.equal(market.comparison.economics.grantPct, 0);
  assert.equal(runBaseCase(market, 5).securedYears, 0);
});

