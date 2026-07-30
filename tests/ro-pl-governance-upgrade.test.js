import test from 'node:test';
import assert from 'node:assert/strict';

import { AUTHORITY } from '../src/governance/authority.js';
import {
  RO_OPPORTUNITY_LOGIC,
  RO_QUEUE_COVERAGE,
  RO_SYSTEM_EVOLUTION,
} from '../src/markets/ro/officialData.js';
import {
  PL_OPPORTUNITY_LOGIC,
  PL_QUEUE_COVERAGE,
  PL_SYSTEM_EVOLUTION,
} from '../src/markets/pl/officialData.js';
import { SRC as RO_SOURCES } from '../src/markets/ro/sources.js';
import { SRC as PL_SOURCES } from '../src/markets/pl/sources.js';

const sumDimensions = (confidence) =>
  Object.values(confidence.dimensions).reduce((sum, score) => sum + score, 0);

test('Romania preserves official planning years and leaves unsupported quantities N/A', () => {
  assert.deepEqual(RO_SYSTEM_EVOLUTION.years, [2026, 2030, 2035]);
  assert.equal(RO_SYSTEM_EVOLUTION.authority, AUTHORITY.OFFICIAL_FORECAST);
  assert.equal(RO_SYSTEM_EVOLUTION.coverage.status, 'partial');
  assert.match(RO_SYSTEM_EVOLUTION.coverage.rule, /N\/A/i);

  for (const point of RO_SYSTEM_EVOLUTION.points) {
    assert.equal(point.demandTWh, null);
    assert.equal(point.peakDemandGW, null);
    assert.equal(point.storageGW, null);
    assert.ok(point.evidence.length > 30);
  }

  assert.match(RO_SYSTEM_EVOLUTION.points[1].evidence, /Brașov–Sibiu South/);
  assert.match(RO_SYSTEM_EVOLUTION.provenance.url, /^https:\/\//);
  assert.match(RO_SYSTEM_EVOLUTION.provenance.automation, /^[A-D] —/);
  assert.equal(RO_SYSTEM_EVOLUTION.provenance.lastChecked, '2026-07-29');
});

test('Romania exposes the complete-queue gap and separates attractiveness from confidence', () => {
  assert.equal(RO_QUEUE_COVERAGE.completeOfficialBessQueue, false);
  assert.match(RO_QUEUE_COVERAGE.coverageStatement, /No single public official register/);
  assert.equal(RO_QUEUE_COVERAGE.knownOfficialFunnel.validAtrGW, 81.322);
  assert.match(RO_QUEUE_COVERAGE.knownOfficialFunnel.scope, /not a BESS-only queue/i);

  assert.ok(RO_OPPORTUNITY_LOGIC.attractiveness);
  assert.ok(RO_OPPORTUNITY_LOGIC.confidence);
  assert.notEqual(RO_OPPORTUNITY_LOGIC.attractiveness.rating, RO_OPPORTUNITY_LOGIC.confidence.label);
  assert.equal(sumDimensions(RO_OPPORTUNITY_LOGIC.confidence), RO_OPPORTUNITY_LOGIC.confidence.score);
  assert.equal(RO_OPPORTUNITY_LOGIC.confidence.score, 5);
  assert.equal(RO_OPPORTUNITY_LOGIC.confidence.label, 'Medium');
});

test('Poland uses Today/2030/2034 as the primary rail and keeps 2040 contextual', () => {
  assert.deepEqual(PL_SYSTEM_EVOLUTION.years, [2025, 2030, 2034]);
  assert.equal(PL_SYSTEM_EVOLUTION.authority, AUTHORITY.OFFICIAL_FORECAST);
  assert.equal(PL_SYSTEM_EVOLUTION.context2040.year, 2040);
  assert.equal(PL_SYSTEM_EVOLUTION.years.includes(2040), false);
  assert.match(PL_SYSTEM_EVOLUTION.context2040.note, /context only/i);

  const today = PL_SYSTEM_EVOLUTION.points.find((point) => point.year === 2025);
  const y2030 = PL_SYSTEM_EVOLUTION.points.find((point) => point.year === 2030);
  const y2034 = PL_SYSTEM_EVOLUTION.points.find((point) => point.year === 2034);

  assert.equal(today.observed, false);
  assert.match(today.note, /not an observed/i);
  assert.equal(y2030.storageNetCapacityGW, 5.865);
  assert.equal(y2034.storageNetCapacityGW, 15.207);
  assert.equal(y2034.annualDemandTWh, 243.2);
  assert.equal(y2034.winterPeakGW, 42.782);

  for (const point of PL_SYSTEM_EVOLUTION.points) {
    assert.match(point.basis, /planning capacity/i);
    assert.match(point.basis, /not capacity-market de-rated or contracted/i);
  }
});

test('Poland distinguishes connection, nameplate, de-rated and contracted capacity bases', () => {
  assert.equal(PL_QUEUE_COVERAGE.completeOfficialBessQueue, false);
  assert.equal(PL_QUEUE_COVERAGE.knownConnectionSnapshot.connectionAgreementMW, 1901.4);
  assert.equal(PL_QUEUE_COVERAGE.knownConnectionSnapshot.connectionConditionsMW, 9786.7);
  assert.match(PL_QUEUE_COVERAGE.knownConnectionSnapshot.basis, /not operating nameplate MW/i);
  assert.match(PL_QUEUE_COVERAGE.knownConnectionSnapshot.basis, /de-rated MW/i);
  assert.match(PL_QUEUE_COVERAGE.knownConnectionSnapshot.basis, /contracted capacity obligation/i);

  for (const field of Object.values(PL_QUEUE_COVERAGE.capacityMarketEvidence)) {
    assert.equal(field.value, null);
    assert.equal(field.display, 'N/A');
    assert.ok(field.reason.length > 20);
  }
});

test('Poland keeps investment attractiveness separate from deterministic confidence', () => {
  assert.ok(PL_OPPORTUNITY_LOGIC.attractiveness);
  assert.ok(PL_OPPORTUNITY_LOGIC.confidence);
  assert.notEqual(PL_OPPORTUNITY_LOGIC.attractiveness.rating, PL_OPPORTUNITY_LOGIC.confidence.label);
  assert.equal(sumDimensions(PL_OPPORTUNITY_LOGIC.confidence), PL_OPPORTUNITY_LOGIC.confidence.score);
  assert.equal(PL_OPPORTUNITY_LOGIC.confidence.score, 5);
  assert.equal(PL_OPPORTUNITY_LOGIC.confidence.label, 'Medium');
  assert.match(PL_OPPORTUNITY_LOGIC.confidence.rubric, /8–10 High/);
});

test('market-local public sources carry freshness and future-fetch metadata', () => {
  const sources = [
    RO_SOURCES.systemPlan,
    RO_SOURCES.projectFunnel,
    RO_SOURCES.capacityAllocation,
    RO_SOURCES.completeQueueGap,
    PL_SOURCES.systemPolicy,
    PL_SOURCES.necpWam,
    PL_SOURCES.systemPlan,
    PL_SOURCES.capacityMarketFinal,
    PL_SOURCES.completeQueueGap,
  ];

  for (const source of sources) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.authority);
    assert.ok(source.frequency);
    assert.ok(source.format);
    assert.ok(source.machineReadable);
    assert.match(source.automation, /^[A-D] —/);
    assert.equal(source.lastChecked, '2026-07-29');
    assert.ok(source.freshness);
  }
});

