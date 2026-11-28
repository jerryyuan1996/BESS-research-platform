/* ---------------------------------------------------------------------------
   END-OF-LIFE SITE VALUE — before/after table for the headline sign-off.

   For every investor's card case (the play the asset-return grade ranks,
   priced ready-to-build), this prints the all-equity hold, the five-year sale
   and the lower of the two, without and with the site value, and what the
   fifths ranking would give if the credit moved into the headline.

   Writes docs/site-value-impact-2026-11-27.md. Reads nothing confidential.
   Plan: docs/site-value-plan-2026-11-27.md §5 step 4.
   --------------------------------------------------------------------------- */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markets } from '../src/markets/registry.js';
import { briefingFromDisk } from '../src/briefing/disk.js';
import { referenceInvestment, INVESTMENT_STAGE } from '../src/opportunities/investment.js';
import { returnAtAcquisitionPrice } from '../src/acquisition/valuation.js';
import { SPECIAL_OPPORTUNITIES } from '../src/opportunities/catalog.js';
import { gradeByFifths } from '../src/comparison/returnGrades.js';
import { ARCHETYPE_IDS } from '../src/governance/investability.js';
import { SITE_VALUE, SITE_VALUE_WEIGHT } from '../src/acquisition/siteValue.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pct = (x) => (Number.isFinite(x) ? (x * 100).toFixed(2) + '%' : 'N/M');
const pts = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? (b - a >= 0 ? '+' : '') + ((b - a) * 100).toFixed(2) : '—');

const briefing = await briefingFromDisk({ root: ROOT, now: new Date('2026-11-27T00:00:00Z') });

/* The card uses the first row for this investor and market, or the standard
   design when no row is published (src/opportunities/summary.js). */
function cardCase(market, investor) {
	const id = market.manifest.id;
	const row = briefing.lenses[investor].rows.find((r) => r.market === id);
	const play = row ? briefing.plays[id + '/' + row.play] : null;
	const published = briefing.returnGrades?.[id]?.[investor];
	if (!published) {
		assert.ok(!SITE_VALUE[id], 'An adopted site benchmark has no priced card: ' + id);
		return null;
	}
	const screening = SPECIAL_OPPORTUNITIES.find((o) => o.market === id)?.screeningByInvestor?.[investor] ?? {};
	const ref = referenceInvestment(market, investor, play, { ...screening, stage: INVESTMENT_STAGE })?.result;
	assert.ok(ref, 'Missing investment reference for ' + investor + '/' + id);
	const hold = ref.holdReturn.annualReturn;
	assert.equal(Number(hold.toFixed(4)), published.value, investor + '/' + id + ': card hold return');
	const sale = ref.saleReturn?.annualReturn ?? null;
	const credit = ref.siteValuePerMW ?? 0;
	const withSite = { ...ref.input, siteValuePerMW: credit };
	const at = (route) => returnAtAcquisitionPrice(withSite, investor, ref.price, { route })?.annualReturn ?? null;
	const holdS = at('hold'), saleS = at('sale');
	if (credit > 0) assert.equal(holdS, ref.holdReturnWithSite?.annualReturn, id + ': separate card return');
	const lower = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? Math.min(a, b) : null);
	return { id, investor, play: play?.id ?? 'standard', credit, currency: ref.input.currency, hold, holdS, sale, saleS, low: lower(hold, sale), lowS: lower(holdS, saleS), target: ref.input.targetReturn };
}

const rows = [];
const gradeShift = [];
for (const investor of ARCHETYPE_IDS) {
	const cases = markets.map((m) => cardCase(m, investor));
	const before = gradeByFifths(cases.map((c, i) => [markets[i].manifest.id, c?.hold ?? null]));
	const after = gradeByFifths(cases.map((c, i) => [markets[i].manifest.id, c?.holdS ?? null]));
	for (const c of cases.filter(Boolean)) {
		const published = briefing.returnGrades?.[c.id]?.[investor];
		assert.equal(before[c.id]?.grade, published.grade, c.id + ': published grade');
		assert.equal(before[c.id]?.rank, published.rank, c.id + ': published rank');
		rows.push({ ...c, gradeBefore: before[c.id]?.grade ?? null, gradeAfter: after[c.id]?.grade ?? null, rankBefore: before[c.id]?.rank ?? null, rankAfter: after[c.id]?.rank ?? null });
		if ((before[c.id]?.grade ?? null) !== (after[c.id]?.grade ?? null)) gradeShift.push(`${investor} · ${c.id}: grade ${before[c.id]?.grade} → ${after[c.id]?.grade}`);
	}
}

const priced = rows.filter((r) => r.credit > 0);
const others = rows.filter((r) => !(r.credit > 0));
const unchanged = others.every((r) => r.hold === r.holdS && r.sale === r.saleS);
assert.ok(unchanged, 'Hold or sale returns changed in a market with no site benchmark');
const table =
	'| Investor | Market | Play | Credit / MW (2026) | Hold | Hold with site | Δ pts | Sale | Sale with site | Δ pts | Lower of | Lower with site | Target | Grade (rank) | Grade with site (rank) |\n' +
	'|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n' +
	priced
		.map((r) =>
			'| ' +
			[r.investor, r.id, r.play, `${r.currency} ${Math.round(r.credit).toLocaleString('en-US')}`, pct(r.hold), pct(r.holdS), pts(r.hold, r.holdS), pct(r.sale), pct(r.saleS), pts(r.sale, r.saleS), pct(r.low), pct(r.lowS), pct(r.target), `${r.gradeBefore ?? '—'} (${r.rankBefore ?? '—'})`, `${r.gradeAfter ?? '—'} (${r.rankAfter ?? '—'})`].join(' | ') +
			' |',
		)
		.join('\n');

const prices = Object.entries(SITE_VALUE)
	.map(([id, sv]) => `- **${id}**: ${sv.currency} ${sv.perMW.toLocaleString('en-US')}/MW × ${SITE_VALUE_WEIGHT * 100}% — ${sv.arithmetic} ([source](${sv.url}))`)
	.join('\n');

const doc = `# End-of-life site value — before/after, 27 November 2026

Generated by \`node scripts/site-value-impact.mjs\`. This is the table for the headline sign-off in [site-value-plan-2026-11-27.md](site-value-plan-2026-11-27.md) §5 step 5. The headline is unchanged until that sign-off.

**What changes:** in the four markets with an adopted pre-construction site benchmark, the all-equity hold return *with site value* differs from the headline by the Δ column. The other ${new Set(others.map((r) => r.id)).size} priced markets give identical hold and sale returns. Saudi Arabia has no priced reference case.
**Grade effect if adopted:** ${gradeShift.length ? gradeShift.join('; ') : 'no asset-return grade changes for any investor.'}

Credit: the market benchmark × 50%, indexed with the model's inflation to the last operating year, then through the 1.5% sale fee and the sale-gain tax on a written-off site. The retirement allowance is unchanged (D3). The five-year buyer prices the credit at its own rate (D4).

${prices}

Cases: each investor's card case (the play the asset-return grade ranks), ready-to-build, at the card's purchase price. "Lower of" is the lower of hold and sale. Grade and rank are the fifths ranking across all priced markets for that investor.

${table}
`;
fs.writeFileSync(path.join(ROOT, 'docs/site-value-impact-2026-11-27.md'), doc);
console.log(`Wrote ${priced.length} priced rows; ${others.length} other rows unchanged: ${unchanged}. Grade shifts: ${gradeShift.length}.`);
console.log('Recomputed grades and ranks match the published briefing for every priced market and investor.');
