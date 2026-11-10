import test from 'node:test';
import assert from 'node:assert/strict';
import { discoveryCoverage, discoverySummary } from '../policy/discovery-report.mjs';
import { discoverPolicies } from '../policy/discovery.mjs';
import { POLICY_SOURCES } from '../policy/source-inventory.mjs';

test('inactive inventory entries report zero actual coverage without network calls', async () => {
  let calls = 0;
  const report = await discoverPolicies({sources: POLICY_SOURCES.filter(s=>!s.metadataScope?.reviewed), fetcher: async () => { calls++; throw new Error('unexpected_fetch'); }});
  assert.equal(calls, 0);
  assert.deepEqual(discoveryCoverage(report.records), {
    registered: 2, checked: 0, changed: 0, pendingReview: 2,
    disabled: 0, duplicates: 0, retained: 0, failed: 0, status: 'no_sources_checked',
  });
  assert.match(discoverySummary(report), /No source was checked successfully/);
});

test('freshness counts use this cycle status, never retained last-known-good evidence', () => {
  const records = ['changed', 'unchanged', 'pending_source_review', 'disabled', 'duplicate', 'robots_denied', 'http_403'].map(status => ({status, lastKnownGood: {contentHash: 'old'}}));
  assert.deepEqual(discoveryCoverage(records), {
    registered: 7, checked: 2, changed: 1, pendingReview: 1,
    disabled: 1, duplicates: 1, retained: 0, failed: 2, status: 'partial_coverage',
  });
  assert.equal(discoveryCoverage([{status: 'future_unknown_status'}]).failed, 1);
  assert.equal(discoveryCoverage([]).status, 'no_sources');
  assert.equal(discoveryCoverage([{status: 'unchanged'}]).status, 'all_registered_pages_checked');
});

test('summary limits claims and does not interpolate untrusted source text', () => {
  const summary = discoverySummary({records: [{status: 'changed', title: 'UNTRUSTED_SOURCE_TEXT'}]});
  assert.doesNotMatch(summary, /UNTRUSTED_SOURCE_TEXT/);
  for (const text of ['not a verified policy release', 'not real-time monitoring', 'No policy AI analysis', 'not a durable cumulative policy archive']) assert.ok(summary.includes(text));
});

test('artifact summary carries the reviewed agency attribution and use terms',()=>{
  const summary=discoverySummary({records:[]});
  assert.match(summary,/Bundesnetzagentur attribution/);
  assert.match(summary,/www\.bundesnetzagentur\.de\/DE\/Service\/Impressum\/start\.html/);
  assert.match(summary,/Contains public sector information licensed under the Open Government Licence v3\.0/);
  assert.match(summary,/www\.ofgem\.gov\.uk\/c-ofgem-2026/);
});