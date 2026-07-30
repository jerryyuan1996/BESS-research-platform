import test from 'node:test';
import assert from 'node:assert/strict';

import { AUTHORITY, canMachineWrite } from '../src/governance/authority.js';
import {
  SOURCE_REGISTRY, sourcesForMarket, sourceById, validateSourceRegistry,
} from '../src/governance/sourceRegistry.js';
import {
  METRICS, metricById, metricsForMarket, validateMetricRegistry,
} from '../src/governance/metrics.js';
import { datasetById } from '../src/governance/datasets.js';
import { validateProjects } from '../src/projects/schema.js';
import {
  GB_SYSTEM_EVOLUTION, GB_TEC_PIPELINE, GB_TEC_PROJECTS,
} from '../src/markets/gb/officialData.js';
import { M } from '../src/markets/gb/data.js';
import { transformFes2025 } from '../etl/sources/neso-fes.mjs';
import { normalizeTecRegister } from '../etl/sources/neso-tec-register.mjs';

test('the governed GB source registry is complete and internally valid', () => {
  assert.deepEqual(validateSourceRegistry(), []);
  assert.ok(sourcesForMarket('gb').length >= 10);
  for (const id of [
    'gb-neso-capacity-market-register',
    'gb-neso-tec-register',
    'gb-neso-fes-es1-2025',
    'gb-neso-fes-ed1-2025',
    'gb-desnz-repd',
  ]){
    assert.ok(sourceById(id), `${id} is not registered`);
  }
  assert.equal(datasetById('gb-day-ahead').sourceId, 'gb-entsoe-transparency');
});

test('every upgraded GB metric resolves to an authority, unit and official source', () => {
  assert.deepEqual(validateMetricRegistry(), []);
  assert.ok(metricsForMarket('gb').length >= 10);
  for (const metric of metricsForMarket('gb')){
    assert.ok(metric.sourceIds.every(sourceById), `${metric.id}: unresolved source`);
    assert.ok(metric.transformation.length > 20, `${metric.id}: transformation is too vague`);
  }
  assert.equal(metricById('gb-fes-network-battery-capacity').authority, AUTHORITY.OFFICIAL_FORECAST);
  assert.equal(metricById('gb-tec-exact-ess-forward-capacity').authority, AUTHORITY.DERIVED_OBSERVED);
  assert.equal(metricById('gb-tec-exact-ess-analyst-weighted-forward').authority, AUTHORITY.ANALYST_SCENARIO);
});

test('official forecasts may publish but analyst scenarios remain human controlled', () => {
  assert.equal(canMachineWrite(AUTHORITY.OFFICIAL_FORECAST), true);
  assert.equal(canMachineWrite(AUTHORITY.DERIVED_OBSERVED), true);
  assert.equal(canMachineWrite(AUTHORITY.ANALYST_SCENARIO), false);
  assert.equal(canMachineWrite(AUTHORITY.ILLUSTRATIVE_SEED), false);
});

test('the FES system card preserves source years, pathway and definition', () => {
  assert.deepEqual(GB_SYSTEM_EVOLUTION.years, [2024, 2030, 2035]);
  assert.equal(GB_SYSTEM_EVOLUTION.pathway, 'Ten Year Forecast');
  assert.deepEqual(GB_SYSTEM_EVOLUTION.demand.totalGWh.values, [289650, 330877, 396764]);
  assert.deepEqual(GB_SYSTEM_EVOLUTION.demand.peakGW.values, [58.339, 63.552, 71.914]);
  assert.deepEqual(GB_SYSTEM_EVOLUTION.capacity.batteryGW.values, [6.587378, 23.865084, 28.181512]);
  assert.match(metricById('gb-fes-network-battery-capacity').transformation, /exclude Distributed-Micro/i);
});

test('official TEC rows replace all illustrative GB project names without inventing duration', () => {
  assert.deepEqual(validateProjects(GB_TEC_PROJECTS), []);
  assert.equal(GB_TEC_PROJECTS.length, 12);
  assert.ok(GB_TEC_PROJECTS.every(project => project.sourceIds.includes('gb-neso-tec-register')));
  assert.ok(GB_TEC_PROJECTS.every(project => project.durationHours === null));
  assert.ok(M.projects.every(project => !project.n.startsWith('Seed example')));
  assert.ok(M.projects.every(project => project.h === null));
});

test('TEC coverage math reconciles and stays separate from a delivery forecast', () => {
  const sum = values => Math.round(values.reduce((total, value) => total + value, 0) * 10) / 10;
  assert.equal(sum(GB_TEC_PIPELINE.rawMW), GB_TEC_PIPELINE.forwardMW);
  assert.equal(
    Math.round((GB_TEC_PIPELINE.gate2ForwardMW + GB_TEC_PIPELINE.gate1ForwardMW + GB_TEC_PIPELINE.gateUnpopulatedForwardMW) * 10) / 10,
    GB_TEC_PIPELINE.forwardMW,
  );
  assert.equal(sum(GB_TEC_PIPELINE.analystWeightedMW), GB_TEC_PIPELINE.analystWeightedForwardMW);
  assert.equal(GB_TEC_PIPELINE.durationCoveragePct, 0);
  assert.equal(GB_TEC_PIPELINE.uniqueProjects, 714);
});

test('FES transformer preserves pathway filters and excludes micro batteries', () => {
  const years = { 2024: 1000, 2030: 2000, 2035: 3000 };
  const supply = (Type, Connection = 'Transmission', multiplier = 1) => ({
    Pathway: 'Ten Year Forecast',
    Variable: 'Capacity (MW)',
    Type,
    Connection,
    2024: years[2024] * multiplier,
    2030: years[2030] * multiplier,
    2035: years[2035] * multiplier,
  });
  const demand = (item, Unit, values) => ({
    Pathway: 'Ten Year Forecast',
    'Data item': item,
    Unit,
    2024: values[0],
    2030: values[1],
    2035: values[2],
  });
  const result = transformFes2025({
    supplyRows: [
      supply('Battery'), supply('Battery', 'Distributed', 0.5), supply('Battery', 'Distributed - Micro', 9),
      supply('Onshore Wind'), supply('Offshore Wind'), supply('Solar PV'), supply('Gas'),
      supply('Nuclear'), supply('Interconnectors'), supply('Long Duration Energy Storage'),
    ],
    demandRows: [
      demand('GBFES System Demand: Total', 'GWh', [10, 20, 30]),
      demand('GBFES Peak Customer Demand: Total Consumption plus Losses ', 'GW', [1, 2, 3]),
      demand('Data Centre Demand', 'GWh', [4, 5, 6]),
    ],
  });

  assert.deepEqual(result.capacity.batteryNetworkGW, [1.5, 3, 4.5]);
  assert.deepEqual(result.capacity.windGW, [2, 4, 6]);
  assert.deepEqual(result.demand.peakGW, [1, 2, 3]);
});

test('TEC transformer deduplicates deterministically and preserves missing Gate and duration', () => {
  const row = (overrides = {}) => ({
    'Project ID': 'p1',
    'Project Number': 'PRO-1',
    'Project Name': 'Alpha BESS',
    'Plant Type': 'Energy Storage System',
    'Cumulative Total Capacity (MW)': 100,
    'MW Effective From': '2028-01-01',
    'Project Status': 'Consents Approved',
    Gate: 2,
    ...overrides,
  });
  const result = normalizeTecRegister([
    row(),
    row({ 'Cumulative Total Capacity (MW)': 150, 'MW Effective From': '2029-01-01' }),
    row({ 'Project ID': 'p2', 'Project Number': 'PRO-2', 'Project Name': 'Beta BESS', 'Cumulative Total Capacity (MW)': 50, Gate: null }),
    row({ 'Project ID': 'p3', 'Project Number': 'PRO-3', 'Project Name': 'Built BESS', 'Cumulative Total Capacity (MW)': 75, 'Project Status': 'Built', 'MW Effective From': null }),
    row({ 'Project ID': 'hybrid', 'Plant Type': 'Energy Storage System;Solar PV', 'Cumulative Total Capacity (MW)': 999 }),
  ]);

  assert.equal(result.sourceRecords, 5);
  assert.equal(result.exactEssRows, 4);
  assert.equal(result.uniqueProjects, 3);
  assert.equal(result.forwardMW, 200);
  assert.equal(result.builtMW, 75);
  assert.deepEqual(result.rawMW, [50, 150]);
  assert.ok(result.projects.every(project => project.durationHours === null));
  assert.equal(result.projects.find(project => project.sourceProjectId === 'p2').gate, null);
});

