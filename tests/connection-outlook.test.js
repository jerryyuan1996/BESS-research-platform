/* ---------------------------------------------------------------------------
   THE CONNECTION-VALUE ENTRY on every market page.

   Every public market carries one entry. Each is bilingual, conclusion first,
   sourced and marked with one evidence level. It never retypes the analyst's
   grid-scarcity grade, which the reader reads from the view store, and it
   never types a model return. An end-of-life credit is proposed only where a
   public price exists, so a market marked Thin carries none.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { CONNECTION_OUTLOOK, OUTLOOK, SITE_VALUE_METHOD } from '../src/experience/connectionOutlook.js';
import { PUBLIC_READING_CATALOG } from '../src/experience/story/public/historyCatalog.js';
import { viewFor } from '../src/markets/viewRegistry.js';

const PAIRS = ['call', 'trend', 'price', 'changeIf'];
const CJK = /[一-鿿]/;
const isPair = (p) => Array.isArray(p) && p.length === 2 && p.every((t) => typeof t === 'string' && t.trim().length > 0) && CJK.test(p[1]);

/* The same patterns as tests/view-prose.test.js: a return figure typed into prose. */
const RETURN_EN = [/\b(?:returns?|hold|IRR)\b[^.;:]{0,20}?−?\d+(?:\.\d+)?%/i, /−?\d+(?:\.\d+)?%\s*(?:hold|IRR)\b/i];
const RETURN_ZH = [/(?:持有期回报|持有期IRR|回报为|回报仅|IRR为?)\s*−?\d/];
const typedReturn = ([en, zh]) => RETURN_EN.some((re) => re.test(en)) || RETURN_ZH.some((re) => re.test(zh));

test('every public market has exactly one connection-value entry', () => {
	assert.deepEqual(Object.keys(CONNECTION_OUTLOOK).sort(), Object.keys(PUBLIC_READING_CATALOG).sort());
});

for (const [id, entry] of Object.entries(CONNECTION_OUTLOOK)) {
	test(`${id}: a bilingual call, trend, price and change condition`, () => {
		assert.ok(Object.hasOwn(OUTLOOK, entry.outlook), `unknown outlook ${entry.outlook}`);
		assert.ok(['strong', 'fair', 'thin'].includes(entry.evidence), `unknown evidence ${entry.evidence}`);
		for (const field of PAIRS) assert.ok(isPair(entry[field]), `${field} must be an [en, zh] pair`);
		for (const field of [...PAIRS, 'scarcity']) if (entry[field]) assert.equal(typedReturn(entry[field]), false, `${field} types a return`);
		assert.ok(entry.sources.length > 0, 'at least one source');
		for (const src of entry.sources) {
			assert.ok(isPair(src.label), 'source label must be a pair');
			assert.match(src.url, /^https:\/\//);
		}
	});

	test(`${id}: the scarcity grade is read, not retyped`, () => {
		const graded = viewFor(id)?.grades?.gridScarcity;
		if (graded) assert.equal(entry.scarcity, undefined, 'a graded market reads its grade from the view store');
		else assert.ok(isPair(entry.scarcity), 'an ungraded market says so in both languages');
	});

	test(`${id}: an end-of-life credit only where a public price exists`, () => {
		if (!entry.siteValue) return;
		assert.notEqual(entry.evidence, 'thin');
		assert.ok(['GBP', 'EUR', 'USD'].includes(entry.siteValue.currency));
		assert.ok(entry.siteValue.perMW > 0);
		assert.ok(isPair(entry.siteValue.basis));
	});
}

test('the separate site-value scenario uses the signed weight and explains indexation in both languages', () => {
	assert.equal(SITE_VALUE_METHOD.weight, 0.5);
	assert.ok(isPair(SITE_VALUE_METHOD.text) && isPair(SITE_VALUE_METHOD.status));
	assert.match(SITE_VALUE_METHOD.text[0], /inflation/);
	assert.match(SITE_VALUE_METHOD.text[1], /通胀/);
});
