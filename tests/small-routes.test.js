import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app/state.js';
import { markets, byId } from '../src/markets/registry.js';
import { opportunities } from '../src/experience/model.js';
import { SMALL_ROUTES } from '../src/opportunities/smallRoutes.js';
import { opportunityById } from '../src/opportunities/catalog.js';
import { compareOpportunity, opportunityIRRs, breakEvenBuildPremium, beatsConventional } from '../src/opportunities/model.js';
import { smallRouteHeadline, smallRouteSection } from '../src/opportunities/smallRoute.js';
import { executionPlans } from '../src/opportunities/deliveryUI.js';

const KINDS = new Set(['priced', 'contract', 'gate', 'pending', 'watch', 'permit', 'none']);
const pair = (x) => Array.isArray(x) && x.length === 2 && x.every((s) => typeof s === 'string' && s.trim().length > 0);

/* A minimal DOM: enough for h() and the section's text, with null and
   undefined children kept visible so a missing field fails the test. */
class Element {
	constructor(tag) { this.tag = tag; this.nodeType = 1; this.children = []; this.attrs = {}; this.style = {}; this.className = ''; }
	setAttribute(k, v) { this.attrs[k] = String(v); }
	getAttribute(k) { return this.attrs[k] ?? null; }
	addEventListener() {}
	append(...kids) { this.children.push(...kids.map((k) => (k?.nodeType ? k : { nodeType: 3, textContent: String(k) }))); }
	replaceChildren(...kids) { this.children = []; this.append(...kids); }
	get textContent() { return this.children.map((n) => n.textContent).join(''); }
}
const descendants = (n) => [n, ...(n.children || []).flatMap(descendants)];
function withDom(fn) {
	const previous = globalThis.document, lang = app.lang;
	globalThis.document = {
		createElement: (tag) => new Element(tag),
		createElementNS: (_, tag) => new Element(tag),
		createTextNode: (text) => ({ nodeType: 3, textContent: String(text) }),
	};
	const restore = () => { globalThis.document = previous; app.lang = lang; };
	let result;
	try { result = fn(); } catch (error) { restore(); throw error; }
	return Promise.resolve(result).finally(restore);
}
const screenFor = (row, investor) => {
	const route = SMALL_ROUTES[row.id];
	if (route?.kind !== 'priced') return { small: null, values: {} };
	const o = opportunityById(route.opportunity), c = compareOpportunity(row.market, o, investor, row.play);
	return { small: c.unavailable ? null : { o, c, valid: beatsConventional(c) }, values: {} };
};

test('every registered market has one small-connection record, bilingual and sourced', () => {
	assert.deepEqual(new Set(Object.keys(SMALL_ROUTES)), new Set(markets.map((m) => m.manifest.id)));
	for (const [id, route] of Object.entries(SMALL_ROUTES)) {
		assert.ok(KINDS.has(route.kind), id + ' kind');
		for (const [label, url] of route.sources || []) {
			assert.ok(pair(label), id + ' source label');
			assert.match(url, /^https:\/\//, id + ' source url');
		}
		if (route.kind === 'priced') {
			const o = opportunityById(route.opportunity);
			assert.equal(o?.kind, 'small', id + ' names a small-route card');
			assert.equal(o.market, id);
			for (const key of ['avoids', 'changesIf']) assert.ok(pair(route[key]), id + ' ' + key);
		} else {
			for (const key of ['title', 'status', 'rule']) assert.ok(pair(route[key]), id + ' ' + key);
			if (route.kind !== 'none') for (const key of ['avoids', 'changesIf']) assert.ok(pair(route[key]), id + ' ' + key);
		}
		if (route.kind !== 'none') assert.ok(['strong', 'fair', 'thin'].includes(route.evidence), id + ' evidence');
	}
});

test('the headline reads its months and points from the paired comparison', () => {
	const row = opportunities('infraFund').find((r) => r.id === 'nem');
	const c = compareOpportunity(row.market, opportunityById('nem-sub5'), 'infraFund', row.play);
	const r = opportunityIRRs(c);
	const months = Number((c.standard.codMonths - c.alternative.codMonths).toFixed(1));
	const points = Number((Math.abs(r.special - r.conventional) * 100).toFixed(1));
	const [en, zh] = smallRouteHeadline(c);
	assert.ok(r.special < r.conventional && months > 0, 'the published case is sooner and behind');
	assert.equal(en, months + ' months sooner to COD, but ' + points + ' points behind on return.');
	assert.equal(zh, '投运提前 ' + months + ' 个月，但回报低 ' + points + ' 个百分点。');
	/* Equal timing and a missing IRR each have their own words. */
	const same = { ...c, alternative: { ...c.alternative, codMonths: c.standard.codMonths } };
	assert.match(smallRouteHeadline(same)[0], /^Same timetable, \d/);
	const none = { ...c, alternative: { ...c.alternative, holdReturn: null } };
	assert.equal(smallRouteHeadline(none)[0], 'No IRR on today’s revenue lines.');
});

test('the break-even build cost makes the two hold IRRs equal, and is null without an IRR', () => {
	for (const id of ['nem-sub5', 'ercot-small-dg', 'ro-sub5']) {
		const o = opportunityById(id), row = opportunities('infraFund').find((r) => r.id === o.market);
		const be = breakEvenBuildPremium(row.market, o, 'infraFund', row.play);
		assert.ok(be && be.pct < be.current, id + ' must be built cheaper to match');
		const r = opportunityIRRs(compareOpportunity(row.market, o, 'infraFund', row.play, { buildPremiumPct: be.pct }));
		assert.ok(Math.abs(r.special - r.conventional) < 1e-4, id + ' IRRs meet at the break-even');
	}
	const o = opportunityById('jp-tokyo-small');
	assert.equal(breakEvenBuildPremium(byId('jp_tokyo'), o, 'infraFund'), null);
});

test('the execution plans put the small route beside the conventional play once', () => {
	const row = opportunities('infraFund').find((r) => r.id === 'nem');
	const c = compareOpportunity(row.market, opportunityById('nem-sub5'), 'infraFund', row.play);
	const base = { standard: c.standard, stage: c.stage };
	assert.deepEqual(executionPlans(base, c).map((p) => p.id), ['standard', 'small']);
	/* A valid small route mounted as the special comparison is not shown twice. */
	assert.deepEqual(executionPlans(c, c).map((p) => p.id), ['standard', 'small']);
	assert.deepEqual(executionPlans(base).map((p) => p.id), ['standard']);
	assert.deepEqual(executionPlans({ ...c, opportunity: opportunityById('de-existing-node') }).map((p) => p.id), ['standard', 'alternative']);
});

test('every market page renders its small-route section in both languages without empty values', () => withDom(async () => {
	const breakEven = [];
	for (const lang of ['en', 'zh']) {
		app.lang = lang;
		for (const market of markets) {
			const id = market.manifest.id;
			const row = opportunities('infraFund').find((r) => r.id === id);
			const section = smallRouteSection(row, 'infraFund', screenFor(row, 'infraFund'));
			assert.ok(section, id + ' has a section');
			assert.equal(section.attrs.id, 'small-route');
			const text = section.textContent;
			assert.doesNotMatch(text, /\bnull\b|undefined|NaN|\[object/, id + ' ' + lang);
			const nodes = descendants(section);
			const priced = SMALL_ROUTES[id].kind === 'priced';
			assert.equal(nodes.some((n) => n.className === 'ix-return-bars'), priced, id + ' return bars');
			if (priced) breakEven.push([id, nodes.find((n) => n.attrs?.['data-break-even'])]);
		}
	}
	/* The break-even fills in after the page paints; wait for it to settle. */
	await new Promise((resolve) => setTimeout(resolve, 0));
	for (const [id, cell] of breakEven) {
		assert.notEqual(cell.attrs['data-break-even'], 'pending', id + ' break-even settles');
		assert.doesNotMatch(cell.textContent, /null|undefined|NaN/, id);
	}
}));
