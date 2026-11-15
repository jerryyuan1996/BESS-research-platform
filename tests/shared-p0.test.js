import { test } from 'node:test';
import assert from 'node:assert/strict';

import { AUTHORITY } from '../src/governance/authority.js';

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





const bilingual = value => Array.isArray(value) && value.length === 2 && value.every(Boolean);





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
