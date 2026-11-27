import test from 'node:test';
import assert from 'node:assert/strict';
import { POLICY_SHIFT, SHIFT_TYPE, CHANNEL, EVIDENCE_LABEL } from '../src/news/policyShift.js';
import { viewFiles } from '../src/markets/viewRegistry.js';
import { DIMENSIONS } from '../src/governance/investability.js';

const pair = (v) => Array.isArray(v) && v.length === 2 && v.every((s) => typeof s === 'string' && s.trim().length > 0);
const triggers = new Map(viewFiles().flatMap((v) => v.triggers || []).map((t) => [t.id, t]));

test('every policy-shift entry names a real trigger and is complete in both languages', () => {
	for (const [id, entry] of Object.entries(POLICY_SHIFT)) {
		assert.ok(triggers.has(id), id + ' is a trigger in the view store');
		assert.ok(SHIFT_TYPE[entry.type], id + ': known shift type');
		assert.ok(EVIDENCE_LABEL[entry.evidence], id + ': evidence is strong, fair or thin');
		for (const field of ['shift', 'channel', 'forStorage', 'against', 'changeIt']) assert.ok(pair(entry[field]), id + '.' + field);
		/* A closing event sits on the risk watch, not the bell. */
		assert.notEqual(triggers.get(id).direction, 'down', id + ' is not a closing event');
	}
});

test('the channel fallback covers every investability dimension', () => {
	for (const d of DIMENSIONS) assert.ok(pair(CHANNEL[d.id]), d.id);
});

test('policy-shift prose carries no model result fields or disclaimer wording', () => {
	for (const [id, entry] of Object.entries(POLICY_SHIFT))
		for (const field of ['shift', 'channel', 'forStorage', 'against', 'changeIt']) {
			const [en] = entry[field];
			assert.doesNotMatch(en, /\bIRR\b|\bNPV\b|\bDSCR\b/, id + '.' + field + ' types no model result');
			assert.doesNotMatch(en, /not (?:investment|financial) advice|disclaimer/i, id + '.' + field);
		}
});
