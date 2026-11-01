import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, storyRowsFor, caseFor, revenueBridge, LENSES } from '../src/experience/model.js';
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

test('Polish opening separates grant and ordinary capacity calls without sharing financial results', () => {
  const selected = opportunities('infraFund').find(r => r.id === 'pl');
  const rows = storyRowsFor(selected, 'infraFund');
  assert.equal(rows[0], selected);
  assert.deepEqual(new Set(rows.map(r => r.play.id)), new Set(['pl-grant-4h', 'pl-cap-4h']));
  const grant = rows.find(r => r.play.id === 'pl-grant-4h');
  const ordinary = rows.find(r => r.play.id === 'pl-cap-4h');
  assert.equal(grant.call, 'opportunistic');
  assert.equal(ordinary.call, 'wait');
  assert.ok(grant.investment);
  assert.equal(ordinary.investment, undefined, 'the grant financial summary cannot price an ordinary project');
  assert.equal(ordinary.play.grantPct, undefined);
  assert.notDeepEqual(ordinary.play.action.text, grant.play.action.text);
  const other = opportunities('infraFund').find(r => r.id === 'wa');
  assert.deepEqual(storyRowsFor(other, 'infraFund'), [other]);
});

