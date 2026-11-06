import test from 'node:test';
import assert from 'node:assert/strict';
import { auditIntervals } from '../etl/lib/interval-coverage.mjs';

const point = (t, v = 1) => ({ t, v });
test('interval coverage finds an internal hole even though its day is present', () => {
  const audit = auditIntervals([
    point('2026-11-01T00:00:00Z'), point('2026-11-01T01:00:00Z'),
  ]);
  assert.equal(audit.expectedIntervals, 3);
  assert.equal(audit.observedIntervals, 2);
  assert.deepEqual(audit.missing, ['2026-11-01T00:30:00.000Z']);
  assert.match(audit.scope, /first and last/);
});
test('duplicates and bad/off-grid points cannot masquerade as complete coverage', () => {
  const audit = auditIntervals([
    point('2026-11-01T08:00:00+08:00'), point('2026-11-01T00:00:00Z'),
    point('2026-11-01T01:00:00Z'), point('2026-11-01T00:05:00Z'),
    point('bad'), point('2026-11-01T00:30:00Z', null),
  ]);
  assert.equal(audit.duplicatePoints, 1);
  assert.equal(audit.offGridPoints, 1);
  assert.equal(audit.malformedPoints, 2);
  assert.equal(audit.missingIntervals, 1);
});
test('an empty audit makes no claim about missing dates outside observations', () => {
  const audit = auditIntervals([]);
  assert.equal(audit.from, null);
  assert.equal(audit.expectedIntervals, 0);
  assert.equal(audit.observedIntervals, 0);
  assert.throws(() => auditIntervals([], { intervalMinutes: 0 }), /Invalid/);
});
