/* ---------------------------------------------------------------------------
   THE LINK AUDIT'S CLASSIFICATION, WITHOUT A NETWORK.

   The audit itself runs on a schedule and reports. What is worth testing here
   is the judgement it encodes, because that judgement is the whole point:
   telling a publisher blocking a robot apart from a publisher deleting a
   document. Getting that wrong sends someone to replace a working source.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { classify, collectUrls, HEALTH } from '../scripts/link-audit.mjs';

test('403 is automation blocking, not removal', () => {
  /* Every aemo.com.au url returns 403 to a fetch and every one of those
     documents opens fine in a browser. Classifying that as missing would be
     actively harmful advice. */
  assert.equal(classify({ status: 403 }), HEALTH.AUTOMATION_BLOCKED);
  assert.equal(classify({ status: 429 }), HEALTH.AUTOMATION_BLOCKED);
  assert.equal(classify({ status: 401 }), HEALTH.AUTOMATION_BLOCKED);
});

test('404 and 410 are removal, and nothing else is', () => {
  assert.equal(classify({ status: 404 }), HEALTH.MISSING);
  assert.equal(classify({ status: 410 }), HEALTH.MISSING);
  assert.notEqual(classify({ status: 403 }), HEALTH.MISSING);
  assert.notEqual(classify({ status: 500 }), HEALTH.MISSING);
});

test('a redirect that resolves is healthy but recorded as moved', () => {
  assert.equal(classify({ status: 200, redirected: false }), HEALTH.HEALTHY);
  assert.equal(classify({ status: 200, redirected: true }), HEALTH.REDIRECTED);
});

test('transient failures are held for review, not escalated', () => {
  /* A 5xx or a timeout is the network having a bad minute. It must not read as
     a dead link on one sighting. */
  assert.equal(classify({ status: 503 }), HEALTH.MANUAL_REVIEW);
  assert.equal(classify({ error: 'timeout' }), HEALTH.TIMEOUT);
  assert.equal(classify({ error: 'ECONNRESET' }), HEALTH.MANUAL_REVIEW);
});

test('the audit collects distinct urls, not distinct records', () => {
  /* Several records share one address — both PJM auction records point at the
     RPM page. Probing it once is politeness and accuracy at the same time. */
  const targets = collectUrls('pjm');
  const urls = targets.map(t => t.url);
  assert.equal(urls.length, new Set(urls).size, 'each url appears once');
  const shared = targets.find(t => t.keys.length > 1);
  assert.ok(shared, 'the shared RPM url should be collected once with both keys');
});

test('the audit is not wired into any blocking gate', () => {
  /* The property that keeps it useful. If this ever becomes a test dependency,
     a publisher outage starts failing unrelated pull requests. */
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const scripts = Object.entries(pkg.scripts || {});
  for (const [name, cmd] of scripts){
    if (/^(test|build)/.test(name))
      assert.ok(!/link-audit/.test(cmd), `${name} must not run the link audit`);
  }
});
