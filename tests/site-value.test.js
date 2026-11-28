/* ---------------------------------------------------------------------------
   END-OF-LIFE SITE VALUE — hand checks (docs/site-value-plan-2026-11-27.md).

   The credit enters the last operating year on the hold route and the
   five-year buyer's terminal value on the sale route, after the 1.5% sale fee
   and the sale-gain tax on a written-off site. It reaches a return only when a
   case supplies it: the reference input never carries it, so the headline is
   unchanged until the analyst signs the before/after table.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { acquisitionCashFlows, returnAtAcquisitionPrice, validateAcquisition } from '../src/acquisition/valuation.js';
import { priceIndex } from '../src/acquisition/cashflows.js';
import { referenceInputs } from '../src/acquisition/reference.js';
import { RATE_SNAPSHOT, FEES } from '../src/acquisition/parameters.js';
import { SITE_VALUE, SITE_VALUE_WEIGHT, siteValueCredit } from '../src/acquisition/siteValue.js';
import { markets } from '../src/markets/registry.js';

const near = (a, b, t = 1e-9) => assert.ok(Math.abs(a - b) <= t, `${a} != ${b}`);
const annual = () => Array.from({ length: 15 }, () => ({ secured: 0, merchant: 100, renewal: 0, opex: 10, capex: 0, tax: 5 }));
const operating = () => ({
	stage: 'operating', currency: 'EUR', powerMW: 1, durationHours: 2, existingNetDebtPerMW: 0, fixedFeesPerMW: 0,
	annual: annual(), decommissioningPerMW: 10, conditionsMet: true, sources: ['Synthetic hand-check'], targetReturn: 0.1,
	scenarios: [{ probability: 1, codYears: 0, operates: true, costs: [], recoveries: [] }],
});
const rtb = () => ({
	...operating(), stage: 'ready-to-build',
	scenarios: [{ probability: 1, codYears: 1, operates: true, costs: [{ at: 0.5, amount: 500 }], recoveries: [] }],
	saleTax: { rate: 0.2, basisPerMW: 0, includePurchase: false, transactionType: 'asset' },
});
const cashAt = (flows, at) => flows.filter((f) => Math.abs(f.at - at) < 1e-9).reduce((s, f) => s + f.amount, 0);

test('hold: the credit lands in the last operating year after the sale fee', () => {
	const without = acquisitionCashFlows(operating(), 'infraFund', 'hold', 1000).flows;
	const withSite = acquisitionCashFlows({ ...operating(), siteValuePerMW: 100 }, 'infraFund', 'hold', 1000).flows;
	near(cashAt(withSite, 15) - cashAt(without, 15), 100 * (1 - FEES.sale));
	near(withSite.reduce((s, f) => s + f.amount, 0) - without.reduce((s, f) => s + f.amount, 0), 100 * (1 - FEES.sale));
});

test('hold: a real credit is indexed to the last year and taxed as a gain on a written-off site', () => {
	const input = { ...operating(), cashFlowBasis: 'real', inflationRate: 0.025, saleTax: { rate: 0.25, basisPerMW: 0 } };
	const without = acquisitionCashFlows(input, 'infraFund', 'hold', 1000).flows;
	const withSite = acquisitionCashFlows({ ...input, siteValuePerMW: 100 }, 'infraFund', 'hold', 1000).flows;
	near(cashAt(withSite, 15) - cashAt(without, 15), 100 * priceIndex(input, 15) * (1 - FEES.sale) * (1 - 0.25), 1e-7);
});

test('sale: the five-year buyer prices the credit at its own rate, then the seller pays fee and gain tax', () => {
	const input = rtb(), credit = 100, life = 15, exitYear = 5, codYears = 1;
	const without = acquisitionCashFlows(input, 'infraFund', 'sale', 1000).flows;
	const withSite = acquisitionCashFlows({ ...input, siteValuePerMW: credit }, 'infraFund', 'sale', 1000).flows;
	const buyerRate = RATE_SNAPSHOT.EUR.rate + 0.03 + 0.04; // all-merchant remaining income
	const proceeds = credit * (1 - FEES.sale) * (1 - input.saleTax.rate);
	const terminalDelta = proceeds / (1 + buyerRate) ** (life - exitYear);
	near(cashAt(withSite, codYears + exitYear) - cashAt(without, codYears + exitYear), terminalDelta * (1 - FEES.sale) * (1 - input.saleTax.rate), 1e-7);
	assert.equal(withSite.filter((f) => f.at > codYears + exitYear).length, 0, 'the seller holds nothing after the sale');
});

test('a base-year site value is indexed even when operating cash flows are already nominal', () => {
	const input = { ...operating(), cashFlowBasis: 'nominal', inflationRate: 0.03 };
	const without = acquisitionCashFlows(input, 'infraFund', 'hold', 1000).flows;
	const withSite = acquisitionCashFlows({ ...input, siteValuePerMW: 100 }, 'infraFund', 'hold', 1000).flows;
	near(cashAt(withSite, 15) - cashAt(without, 15), 100 * 1.03 ** 15 * (1 - FEES.sale));
});

test('a zero or absent credit changes nothing, and a negative one is rejected', () => {
	const input = rtb();
	for (const route of ['hold', 'sale'])
		assert.deepEqual(returnAtAcquisitionPrice({ ...input, siteValuePerMW: 0 }, 'infraFund', 100, { route }), returnAtAcquisitionPrice(input, 'infraFund', 100, { route }));
	assert.ok(validateAcquisition({ ...input, siteValuePerMW: -1 }).includes('end-of-life site value'));
});

test('the table credits half the observed price, only in its own currency', () => {
	assert.equal(SITE_VALUE_WEIGHT, 0.5);
	assert.deepEqual(Object.keys(SITE_VALUE).sort(), ['ercot', 'es', 'gb', 'it']);
	for (const [id, sv] of Object.entries(SITE_VALUE)) {
		assert.equal(siteValueCredit(id, sv.currency), sv.perMW * 0.5);
		assert.equal(siteValueCredit(id, 'JPY'), null);
		assert.match(sv.url, /^https:\/\//);
	}
	assert.equal(siteValueCredit('pjm', 'USD'), null, 'PJM carries no credit until a rights price is public (D5)');
});

test('reference cases carry the credit beside the input, never inside it', () => {
	for (const id of ['gb', 'it', 'es', 'ercot', 'pjm', 'de']) {
		const market = markets.find((m) => m.manifest.id === id);
		const base = referenceInputs(market, 'ready-to-build', { economicLifeYears: 20 }).find((c) => c.key === 'base');
		assert.equal(base.input.siteValuePerMW, undefined, `${id}: the headline input must not carry the credit`);
		assert.equal(base.siteValuePerMW, SITE_VALUE[id] ? SITE_VALUE[id].perMW * 0.5 : null, id);
	}
});
