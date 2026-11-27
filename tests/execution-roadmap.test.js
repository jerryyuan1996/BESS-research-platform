import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, LENSES } from '../src/experience/model.js';
import { compareOpportunity } from '../src/opportunities/model.js';
import { opportunitiesFor } from '../src/opportunities/catalog.js';
import { deliveryTimeline } from '../src/opportunities/delivery.js';
import { deliveryPhases } from '../src/opportunities/deliveryRoadmap.js';

test('the roadmap places every step on one axis and every in-window cash entry in exactly one step', () => {
	for (const investor of Object.keys(LENSES))
		for (const row of opportunities(investor)) {
			if (row.market.comparison.engineReady === false) continue;
			const c = compareOpportunity(row.market, opportunitiesFor(row.id)[0], investor, row.play);
			for (const reference of [c.standard, c.alternative].filter(Boolean)) {
				const t = deliveryTimeline(reference, investor, row.id, { route: 'hold' });
				const { end, steps, cash } = deliveryPhases(t);
				const where = investor + '/' + row.id;
				assert.equal(steps.length, 6, where);
				assert.equal(steps[0].start, 0, where + ' starts at T+0');
				assert.ok(steps.every((s) => Array.isArray(s.phase) && s.phase.length === 2), where + ' bilingual phase names');
				assert.ok(steps.every((s, i) => s.stop >= s.start && (i === 0 || s.start >= steps[i - 1].start)), where + ' ordered spans');
				assert.ok(end >= t.codMonths + 12 - 1e-9 && end >= t.qualifiedMonths, where + ' axis reaches the first annual cash');
				const placed = steps.flatMap((s) => s.cash);
				assert.equal(placed.length, cash.length, where + ' each cash entry once');
				const sum = (list) => list.reduce((total, x) => total + x.amount, 0);
				assert.ok(Math.abs(sum(placed) - sum(cash)) < 1e-6, where + ' cash reconciles');
			}
		}
});
