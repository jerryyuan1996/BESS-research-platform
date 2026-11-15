import { evidenceOf } from '../governance/briefing.js';
import { gateLabel } from './labels.js';
import { eventDue } from '../news/eventDates.js';

const finite = Number.isFinite;
export const QUALIFIER_LABEL = {
	clears: ['clears target', '达到目标'],
	price: ['at a price', '须按价格买入'],
	below: ['below target', '低于目标'],
};
export const DEBT_LABEL = {
	adds: ['Debt adds return', '债务提升回报'],
	dilutes: ['Debt dilutes return', '债务摊薄回报'],
	neutral: ['Debt leaves return unchanged', '债务未改变回报'],
	unavailable: ['Debt effect not assessed', '债务影响未检验'],
};

/** Classify the displayed case, without changing its stored investment call. */
export function meetsTarget(row, basis = 'hold') {
	const target = basis === 'levered' ? row.econ?.test?.leveredTarget : row.econ?.test?.target;
	return finite(row.econ?.[basis]) && finite(target) ? row.econ[basis] >= target : null;
}
export function statedPrice(row) {
	const i = row.investment;
	if (i?.operatingPurchase?.maxPricePerMW > 0) return { amount: i.operatingPurchase.maxPricePerMW, operating: true };
	return i?.maxPricePerMW > 0 ? { amount: i.maxPricePerMW, operating: i.stage === 'operating' } : null;
}
export function returnPosition(row) {
	const meets = meetsTarget(row);
	return meets === null ? null : meets ? 'clears' : statedPrice(row) ? 'price' : 'below';
}
export const situationalQualifier = (row) => (row.call === 'opportunistic' ? returnPosition(row) : null);
export function debtEffect(investment) {
	const { holdIRR, leveredIRR } = investment || {};
	return !finite(holdIRR) || !finite(leveredIRR)
		? 'unavailable'
		: leveredIRR < holdIRR
			? 'dilutes'
			: leveredIRR > holdIRR
				? 'adds'
				: 'neutral';
}
export const passLast = (a, b) => Number(a.call === 'avoid') - Number(b.call === 'avoid');
export const canPromote = (row) => !['avoid', 'not-accessible'].includes(row.call);

/** The existing before-committing item, shared with the full decision rationale. */
export function commitmentGates(row) {
	const gates =
		row.id === 'it' && row.play?.route === 'cap'
			? [
					[
						'Verify the earlier capacity award, credited MW, price and transfer rights',
						'核验早先容量合同、计入 MW、价格与转让权利',
					],
					['Check zonal grid access and trading assumptions', '核验分区并网条件与交易收入假设'],
				]
			: row.market.comparison.refinement?.investmentGate || [];
	return gates.map((g) => (Array.isArray(g) ? g : gateLabel(g)));
}

const dated = (value) => typeof value === 'string' && /^\d{4}-\d{2}(?:-\d{2})?$/.test(value);
const periodEnd = eventDue;
/** Keep month precision. A review or unresolved overdue event retains its real date. */
export function nextDatedEvent(row, triggers, on) {
	const named = new Set([...(row.changesIf || []), row.next].filter(Boolean));
	const relevant = triggers.filter(
		(t) => t.market === row.id && !t.outcome && dated(t.expected) && (!named.size || named.has(t.id)),
	);
	const reviewBy = row.reviewBy || row.decision?.reviewBy;
	const events = [
		...relevant,
		...(dated(reviewBy) ? [{ expected: reviewBy, label: ['Review the investment call', '复核投资判断'] }] : []),
	];
	events.sort((a, b) => a.expected.localeCompare(b.expected));
	const event = events.find((t) => periodEnd(t.expected) >= on) || events.at(-1);
	return event ? { ...event, overdue: periodEnd(event.expected) < on } : null;
}
export function decisionTrace(row, triggers = [], on = new Date().toISOString().slice(0, 10)) {
	const gate = commitmentGates(row)[0] || [
		'Verify project contracts, grid access and remaining costs',
		'核验项目合同、并网条件及剩余成本',
	];
	const changes = triggers.filter((t) => !t.outcome && (row.changesIf || [row.next]).includes(t.id));
	return {
		gate,
		event: nextDatedEvent(row, triggers, on),
		debt: debtEffect(row.investment),
		evidence: row.evidence || evidenceOf(row.play?.econ || row.legacyEcon || row.econ, []),
		changes: changes.length
			? changes.map((t) => t.label)
			: [['Verified project evidence resolves this gate: ' + gate[0], '项目证据经核验并满足此项条件：' + gate[1]]],
	};
}

/** A display conversion only: published model results keep their original USD basis. */
export function localRevenueBridge(investment) {
	if (!investment?.bridge || !(investment.fxToUSD > 0)) return null;
	return Object.fromEntries(Object.entries(investment.bridge).map(([key, value]) => [key, value / investment.fxToUSD]));
}
