import test from 'node:test';
import assert from 'node:assert/strict';
import { byId } from '../src/markets/registry.js';
import { referenceInvestment, investmentMetrics } from '../src/opportunities/investment.js';
import { viewFor } from '../src/markets/viewRegistry.js';

test('Ireland uses the approved six-hour candidate while retaining the four-hour scaling anchor', () => {
  const market = byId('ie'), view = viewFor('ie');
  assert.equal(market.comparison.archetype.durationHours, 4);
  assert.deepEqual(market.comparison.durationResponse.capacityDerating, [.072, .143, .277, .425, .549]);
  assert.equal(view.verdicts.infraFund.call, 'wait');
  assert.equal(view.verdicts.infraFund.play, 'ie-cap-6h');
  assert.equal(view.plays['ie-cap-6h'].hours, 6);
  assert.equal(view.plays['ie-cap-4h'], undefined);
  assert.equal(market.comparison.economics.services, 8000);
});

test('Ireland duration returns match the independently reconstructed investment cash flows', () => {
  const metric = hours => investmentMetrics(referenceInvestment(byId('ie'), 'infraFund', {
    route: 'cap', hours, stage: 'ready-to-build',
  }).result);
  const four = metric(4), six = metric(6), eight = metric(8);
  for (const [actual, expected] of [[four.holdIRR, .03980658], [six.holdIRR, .04433057],
    [eight.holdIRR, .04121741], [six.leveredIRR, .03646018], [six.targetReturn, .09673972]]) {
    assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);
  }
  assert.ok(six.holdIRR > four.holdIRR && six.holdIRR > eight.holdIRR);
  assert.ok(six.holdIRR < six.targetReturn);
  assert.ok(six.leveredIRR < six.holdIRR);
});
