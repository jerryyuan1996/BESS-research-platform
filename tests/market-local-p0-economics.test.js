import test from 'node:test';
import assert from 'node:assert/strict';

import { PL_ECONOMICS } from '../src/markets/pl/economicsData.js';
import { RO_ECONOMICS } from '../src/markets/ro/economicsData.js';
import { JP_ECONOMICS } from '../src/markets/jp/economicsData.js';
import { buildPLEconomicsBlocks } from '../src/markets/pl/economicsSection.js';
import { buildROEconomicsBlocks } from '../src/markets/ro/economicsSection.js';
import { buildJPEconomicsBlocks } from '../src/markets/jp/economicsSection.js';

const assertMetricContract = (metric) => {
  assert.ok(metric.id);
  assert.ok(metric.label);
  assert.ok(['VERIFIED', 'DERIVED', 'PROXY'].includes(metric.status));
  assert.ok(metric.authority);
  assert.ok(metric.formula);
  assert.ok(metric.limitation);
  assert.match(metric.source.url, /^https:\/\//);
  assert.ok(metric.source.vintage);
};

const assertScenarioTree = (economics) => {
  const scenarios = Array.isArray(economics.scenarios)
    ? Object.fromEntries(economics.scenarios.map((scenario) => [scenario.case, scenario]))
    : economics;
  for (const name of ['Bear', 'Base', 'Bull']) {
    assert.ok(scenarios[name], `${name} scenario missing`);
    assert.ok(scenarios[name].bessOwner, `${name}: BESS-owner outcome missing`);
    assert.ok(scenarios[name].system, `${name}: system outcome missing`);
    assert.notEqual(scenarios[name].bessOwner, scenarios[name].system);
    assert.ok(scenarios[name].drivers);
  }
};

const blockTitles = (blocks) =>
  blocks.flatMap((block) => {
    const own = block?.title ? [Array.isArray(block.title) ? block.title[0] : block.title] : [];
    const nested = block?.cards ? blockTitles(block.cards) : [];
    return own.concat(nested);
  });

test('Poland economics uses official auction facts and fails closed on un-ingested owner economics', () => {
  PL_ECONOMICS.metrics.forEach(assertMetricContract);
  assert.deepEqual(new Set(PL_ECONOMICS.metrics.map((metric) => metric.status)), new Set(['VERIFIED', 'DERIVED', 'PROXY']));
  assert.equal(PL_ECONOMICS.metrics.find((metric) => metric.id === 'pl-cm-2030-price').value, 465.02);
  assert.equal(PL_ECONOMICS.metrics.find((metric) => metric.id === 'pl-cm-2030-total-obligation').value, 21.8);
  assert.match(PL_ECONOMICS.coverage.capacity, /BESS nameplate, de-rated obligation/i);
  assert.match(PL_ECONOMICS.coverage.competition, /not verified/i);
  assertScenarioTree(PL_ECONOMICS);
  assert.deepEqual(
    PL_ECONOMICS.toBuild.map((gate) => gate.id),
    ['pl-interval-spread', 'pl-capture', 'pl-lng-srmc'],
  );
  assert.ok(PL_ECONOMICS.toBuild.every((gate) => gate.status === 'TO_BUILD'));
  assert.ok(blockTitles(buildPLEconomicsBlocks()).some((title) => /Economics DNA/.test(title)));
});

test('Romania economics keeps merchant value separate from market level and administrative funnel MW', () => {
  RO_ECONOMICS.metrics.forEach(assertMetricContract);
  assert.deepEqual(new Set(RO_ECONOMICS.metrics.map((metric) => metric.status)), new Set(['VERIFIED', 'DERIVED', 'PROXY']));
  assert.equal(RO_ECONOMICS.metrics.find((metric) => metric.id === 'ro-dam-wap-2025').value, 575.22);
  assert.equal(RO_ECONOMICS.metrics.find((metric) => metric.id === 'ro-dam-volume-2025').value, 15.691726);
  assert.equal(RO_ECONOMICS.metrics.find((metric) => metric.id === 'ro-res-valid-atr').value, 81.322);
  assert.match(RO_ECONOMICS.coverage.capacity, /capacity-market revenue is N\/A/i);
  assert.match(RO_ECONOMICS.coverage.competition, /not a complete BESS queue/i);
  assertScenarioTree(RO_ECONOMICS);
  const gates = new Set(RO_ECONOMICS.toBuild.map((gate) => gate.id));
  for (const required of ['ro-interval-spread', 'ro-capture', 'ro-hydrology', 'ro-lng-srmc']) {
    assert.ok(gates.has(required));
  }
  assert.ok(blockTitles(buildROEconomicsBlocks()).some((title) => /Economics DNA/.test(title)));
});

test('Japan retains one national rulebook and three complete regional economics overlays', () => {
  JP_ECONOMICS.nationalMetrics.forEach(assertMetricContract);
  assert.equal(JP_ECONOMICS.architecture.rulebook, 'One national rulebook');
  assert.deepEqual(JP_ECONOMICS.architecture.overlays, ['tokyo', 'kyushu', 'hokkaido']);
  assert.match(JP_ECONOMICS.architecture.onlineOfflineLogic, /online\/offline/i);
  assert.match(JP_ECONOMICS.architecture.onlineOfflineLogic, /no.*generic online premium/i);
  assert.equal(JP_ECONOMICS.nationalMetrics.find((metric) => metric.id === 'jp-cm-2029-total').value, 166.079863);

  const expected = {
    tokyo: [15111, 52.376601, 20, 11],
    kyushu: [15112, 18.363521, 50, 8],
    hokkaido: [14972, 5.461594, 36, 5],
  };
  for (const [id, [price, contracted, curtailment, studyCap]] of Object.entries(expected)) {
    const region = JP_ECONOMICS.regions[id];
    assert.equal(region.capacityPriceJPYkWYr, price);
    assert.equal(region.contractedCapacityGW, contracted);
    assert.equal(region.curtailmentDays, curtailment);
    assert.equal(region.studyCap, studyCap);
    assert.match(region.competitionSignal, /not a complete|partial|subset|proxies/i);
    assertScenarioTree(region.scenario);
  }

  const gates = new Set(JP_ECONOMICS.toBuild.map((gate) => gate.id));
  for (const required of ['jp-area-interval-spread', 'jp-area-capture', 'jp-area-basis', 'jp-hydrology', 'jp-lng-srmc']) {
    assert.ok(gates.has(required));
  }
  assert.ok(JP_ECONOMICS.toBuild.every((gate) => gate.status === 'TO_BUILD'));
  assert.ok(blockTitles(buildJPEconomicsBlocks()).some((title) => /one national rulebook/i.test(title)));
});

