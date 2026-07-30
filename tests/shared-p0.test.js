import { test } from 'node:test';
import assert from 'node:assert/strict';

import { AUTHORITY } from '../src/governance/authority.js';
import {
  EVIDENCE_CONFIDENCE,
  EVIDENCE_CONFIDENCE_LABEL,
  EVIDENCE_STATUS,
  EVIDENCE_STATUS_LABEL,
  isEvidenceAuthorityCompatible,
  validateEvidence,
} from '../src/governance/evidenceStatus.js';
import {
  SOURCE_REGISTRY,
  sourceById,
  validateSourceRegistry,
} from '../src/governance/sourceRegistry.js';
import {
  areaBasis,
  capacityRevenue,
  captureRate,
  curtailmentRate,
  durationHours,
  executableContiguousWindowSpread,
  saturationProxy,
} from '../src/economics/valueMetrics.js';
import {
  SCENARIO_CASE,
  SCENARIO_LENS,
  SCENARIO_SEMANTICS,
  scenarioSemantics,
  validateScenarioDefinition,
} from '../src/forecast/scenarioSemantics.js';
import { validateForecastSeries } from '../src/forecast/schema.js';
import {
  VALUE_DRIVER_DIMENSIONS,
  VALUE_DRIVER_EVIDENCE,
  VALUE_DRIVER_MARKETS,
  VALUE_DRIVER_METRICS,
  validateValueDriverEvidence,
  valueDriverDimensionEvidence,
} from '../src/home/valueDriverData.js';
import { hasNoNegativeIrr } from '../src/home/allocationMatrix.js';

const bilingual = value => Array.isArray(value) && value.length === 2 && value.every(Boolean);

test('evidence statuses and confidence levels have bilingual labels', () => {
  for (const status of Object.values(EVIDENCE_STATUS)) assert.ok(bilingual(EVIDENCE_STATUS_LABEL[status]));
  for (const confidence of Object.values(EVIDENCE_CONFIDENCE)) assert.ok(bilingual(EVIDENCE_CONFIDENCE_LABEL[confidence]));
});

test('evidence status remains separate from authority and fails incompatible pairings', () => {
  assert.equal(isEvidenceAuthorityCompatible(EVIDENCE_STATUS.VERIFIED, AUTHORITY.OBSERVED), true);
  assert.equal(isEvidenceAuthorityCompatible(EVIDENCE_STATUS.VERIFIED, AUTHORITY.ANALYST), false);
  assert.equal(isEvidenceAuthorityCompatible(EVIDENCE_STATUS.DERIVED, AUTHORITY.DERIVED_OBSERVED), true);
  assert.equal(isEvidenceAuthorityCompatible(EVIDENCE_STATUS.TO_BUILD, AUTHORITY.METHODOLOGY), true);
});

test('the governed source registry, including exact P0 publications, is valid and public', () => {
  assert.deepEqual(validateSourceRegistry(), []);
  const required = [
    'wa-aemo-qed-q1-2026',
    'gb-neso-balancing-costs-2025',
    'ie-semo-fcar2930t4',
    'ie-eirgrid-renewable-dispatch-down-2024',
    'ie-eirgrid-gcs-2023-2032',
    'ie-eirgrid-airaa-2026-2035',
    'jp-occto-tokyo-curtailment-2026',
    'jp-occto-kyushu-curtailment-2026',
    'jp-occto-hokkaido-curtailment-2026',
  ];
  for (const id of required){
    const source = sourceById(id);
    assert.ok(source, `${id} must be registered`);
    assert.equal(new URL(source.canonicalUrl).protocol, 'https:');
    assert.ok(source.resourceLocator && source.format && source.cadence && source.automation);
    assert.ok(source.staleAfterDays > 0);
  }
  assert.equal(new Set(SOURCE_REGISTRY.map(source => source.id)).size, SOURCE_REGISTRY.length);
});

test('the underlying value-indicator matrix is complete and never fills evidence gaps with zero', () => {
  assert.deepEqual(VALUE_DRIVER_MARKETS, [
    'wa', 'gb', 'ie', 'pl', 'ro', 'jp_hokkaido', 'jp_tokyo', 'jp_kyushu',
  ]);
  assert.equal(VALUE_DRIVER_EVIDENCE.length, VALUE_DRIVER_MARKETS.length * VALUE_DRIVER_METRICS.length);
  assert.deepEqual(validateValueDriverEvidence(), []);
  for (const record of VALUE_DRIVER_EVIDENCE){
    assert.deepEqual(validateEvidence(record), []);
    if (record.status === EVIDENCE_STATUS.TO_BUILD){
      assert.equal(record.value, null);
      assert.deepEqual(record.sourceIds, []);
    } else {
      assert.ok(record.sourceIds.length > 0);
    }
  }
});

test('the governed value-driver model retains the exact eight investor dimensions', () => {
  assert.deepEqual(VALUE_DRIVER_DIMENSIONS.map(dimension => dimension.label[0]), [
    'Cheap Energy Formation',
    'Peak Scarcity',
    'Grid Constraint',
    'Firm Capacity Value',
    'Flexibility Need',
    'BESS Competition',
    'Revenue Visibility',
    'Forecast Confidence',
  ]);
  assert.equal(VALUE_DRIVER_DIMENSIONS.length, 8);
  for (const marketId of VALUE_DRIVER_MARKETS){
    for (const dimension of VALUE_DRIVER_DIMENSIONS){
      const record = valueDriverDimensionEvidence(marketId, dimension.id);
      assert.ok(record, `${marketId}/${dimension.id} requires an evidence envelope`);
      assert.deepEqual(validateEvidence(record), []);
      assert.ok(Object.values(EVIDENCE_STATUS).includes(record.status));
      assert.equal('score' in record, false);
    }
  }
});

test('the homepage opportunity filter removes routes with a negative hold or exit IRR', () => {
  assert.equal(hasNoNegativeIrr({ irrHold: 0.08, irrExit: 0.04 }), true);
  assert.equal(hasNoNegativeIrr({ irrHold: 0, irrExit: 0 }), true);
  assert.equal(hasNoNegativeIrr({ irrHold: -0.01, irrExit: 0.04 }), false);
  assert.equal(hasNoNegativeIrr({ irrHold: 0.08, irrExit: -0.01 }), false);
  assert.equal(hasNoNegativeIrr({ irrHold: null, irrExit: 0.04 }), false);
});

test('reusable economics helpers are deterministic and honest about absence', () => {
  assert.equal(durationHours({ powerMW: 2, energyMWh: 8 }), 4);
  assert.equal(durationHours({ powerMW: 0, energyMWh: 8 }), null);
  assert.equal(saturationProxy({ competingMW: 20, denominatorMW: 10 }), 2);
  assert.equal(saturationProxy({ competingMW: 20, denominatorMW: 0 }), null);
  assert.equal(capacityRevenue({ pricePerKWYear: 100, qualifiedMW: 2, deratingFactor: 0.5 }), 100000);
  assert.equal(capacityRevenue({ pricePerKWYear: 100, qualifiedMW: 2 }), null);
  assert.equal(captureRate({ realizedRevenue: 50, benchmarkRevenue: 100 }), 0.5);
  assert.equal(captureRate({ realizedRevenue: 50 }), null);
  assert.equal(curtailmentRate({ curtailedMWh: 10, availableMWh: 100 }), 0.1);
  assert.equal(curtailmentRate({ curtailedMWh: 110, availableMWh: 100 }), null);
  assert.equal(areaBasis({ areaPrice: 42, systemPrice: 40 }), 2);
  assert.equal(areaBasis({ areaPrice: 42 }), null);
});

test('executable spread enforces contiguous chronological non-overlapping windows', () => {
  const prices = [10, 10, 100, 100].map((v, hour) => ({
    t: `2026-01-01T${String(hour).padStart(2, '0')}:00:00Z`, v,
  }));
  const result = executableContiguousWindowSpread(prices, { durationHours: 1, pointsPerHour: 1 });
  assert.equal(result.spread, 90);
  assert.equal(result.margin, 90);
  assert.ok(result.charge.end < result.discharge.start);
  assert.equal(executableContiguousWindowSpread(prices.slice(0, 1), { durationHours: 1, pointsPerHour: 1 }), null);
});

test('scenario semantics keep BESS-owner and power-system Bull cases distinct', () => {
  for (const definition of Object.values(SCENARIO_SEMANTICS)){
    assert.deepEqual(validateScenarioDefinition(definition), []);
  }
  const ownerBull = scenarioSemantics(SCENARIO_LENS.BESS_OWNER, SCENARIO_CASE.BULL);
  const systemBull = scenarioSemantics(SCENARIO_LENS.SYSTEM, SCENARIO_CASE.BULL);
  assert.match(ownerBull.objective[0], /Higher project cash flow/);
  assert.match(systemBull.objective[0], /Lower reliability risk/);
  assert.notDeepEqual(ownerBull.objective, systemBull.objective);
});

test('analyst forecast series must declare scenario lens and case', () => {
  const common = { id: 'x', metricId: 'm', vintage: '2026', values: [{ year: 2030, value: 1 }] };
  const missing = validateForecastSeries({ ...common, authority: AUTHORITY.ANALYST_SCENARIO });
  assert.ok(missing.some(problem => /scenarioLens/.test(problem)));
  assert.ok(missing.some(problem => /caseId/.test(problem)));
  assert.deepEqual(validateForecastSeries({
    ...common,
    authority: AUTHORITY.ANALYST_SCENARIO,
    scenarioLens: SCENARIO_LENS.BESS_OWNER,
    caseId: SCENARIO_CASE.BASE,
  }), []);
  assert.deepEqual(validateForecastSeries({ ...common, authority: AUTHORITY.OFFICIAL_FORECAST }), []);
});
