import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, caseFor, revenueBridge, LENSES } from '../src/experience/model.js';
import { markets } from '../src/markets/registry.js';

test('all investor screens cover each registered market exactly once', () => {
  for (const lens of Object.keys(LENSES)) {
    const rows = opportunities(lens);
    assert.equal(rows.length, markets.length);
    assert.equal(new Set(rows.map(r => r.id)).size, markets.length);
    for (const row of rows) assert.ok(row.market && row.region);
  }
});

test('the market case replays the same route, duration and grant as the screen', () => {
  for (const lens of Object.keys(LENSES)) for (const row of opportunities(lens)) {
    const data = caseFor(row);
    if (data.unavailable) { assert.equal(row.econ.priced, false); continue; }
    assert.ok(Math.abs(data.base.irrHold - row.legacyEcon.hold) < .000051, `${lens}/${row.id}: legacy return drift`);
    if (row.play) {
      assert.equal(data.variant.comparison.archetype.durationHours, row.play.hours);
      assert.equal(data.base.strategyId, row.play.route);
    }
    const b = data.bridge;
    assert.ok(Math.abs(b.fixed + b.renewal + b.trading - b.service - b.operating - b.net) < 1e-7);
    assert.equal(b.net, data.base.eb[0]);
    const payments = data.debt.service.map((v, i) => v + data.debt.maturityRepayment[i]);
    const cover = payments.map((v, i) => v > 0 ? data.bear.eb[i] / v : null).filter(Number.isFinite);
    assert.equal(data.coverBear, cover.length ? Math.min(...cover) : null);
  }
});

test('the bridge treats OEM service as cost and does not double-count ancillary income', () => {
  const bridge = revenueBridge({ secY:[20], aucY:[5], mchY:[75], svcY:[10], eb:[60] });
  assert.deepEqual(bridge, { fixed:20, renewal:5, trading:75, service:10, operating:30, net:60, gross:100 });
});

