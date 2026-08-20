/* ---------------------------------------------------------------------------
   DETERMINISTIC URL VALIDATION.

   No network request. Everything here is decidable from the string, which is
   why it can run on every change without going red for reasons the author
   cannot fix. Reachability is a scheduled audit that reports; see
   scripts/link-audit.mjs.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markets } from '../src/markets/registry.js';
import { evidenceRecords } from '../src/governance/claims.js';
import { validateSourceUrl, registrableDomain, URL_EXEMPT } from '../src/governance/sourceUrls.js';

/* Japan's three allocation points share one register; dedupe so a defect is
   reported once rather than three times. */
const REGISTERS = [...new Map(markets.map(m => [m.sources, m])).values()];

test('every source url is well formed, or explicitly exempt', () => {
  const problems = [];
  for (const m of REGISTERS){
    for (const [id, rec] of Object.entries(evidenceRecords(m))){
      problems.push(...validateSourceUrl(`${m.manifest.id}:${id}`, rec));
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('every exemption names a real record and gives a reason', () => {
  /* An exemption list that outlives its records is how a rule quietly stops
     applying to anything. */
  for (const [key, reason] of Object.entries(URL_EXEMPT)){
    const [marketId, id] = key.split(':');
    const m = markets.find(x => x.manifest.id === marketId);
    assert.ok(m, `URL_EXEMPT names market "${marketId}", which does not exist`);
    assert.ok(evidenceRecords(m)[id], `URL_EXEMPT names ${key}, which is not a record`);
    assert.ok(reason && reason.length > 30, `${key} needs a real reason, not a note`);
    assert.ok(!evidenceRecords(m)[id].url, `${key} is exempt but now HAS a url — remove the exemption`);
  }
});

test('placeholder and malformed urls are refused', () => {
  for (const bad of ['#', 'TODO', 'https://example.com/x', 'http://localhost:3000',
                     'not a url', 'https://nohost']){
    assert.ok(validateSourceUrl('x:y', { url: bad }).length, `${bad} should be refused`);
  }
  assert.deepEqual(validateSourceUrl('x:y', { url: 'https://www.erawa.com.au/markets' }), []);
});

test('http is refused; a source must be fetched over https', () => {
  assert.ok(validateSourceUrl('x:y', { url: 'http://www.pjm.com/x' })
    .some(p => /must use https/.test(p)));
});

test('a record with no url and no exemption fails', () => {
  assert.ok(validateSourceUrl('pjm:ghost', {}).some(p => /not in URL_EXEMPT/.test(p)));
});

test('registrable domain is what the publisher-change check compares', () => {
  /* Crude on purpose: a subdomain move within a publisher is not a change of
     publisher, and flagging it would train people to ignore the flag. */
  assert.equal(registrableDomain('https://www.pjm.com/a/b'), 'pjm.com');
  assert.equal(registrableDomain('https://docs.nrel.gov/x.pdf'), 'nrel.gov');
  assert.equal(registrableDomain('nonsense'), null);
});

test('REPORT: source url inventory by domain', () => {
  const byDomain = new Map();
  let noUrl = 0, total = 0;
  for (const m of REGISTERS){
    for (const [, rec] of Object.entries(evidenceRecords(m))){
      total++;
      if (!rec.url){ noUrl++; continue; }
      const d = registrableDomain(rec.url) || '(unparsed)';
      byDomain.set(d, (byDomain.get(d) || 0) + 1);
    }
  }
  const top = [...byDomain].sort((a, b) => b[1] - a[1]).slice(0, 10);
  console.log(['source urls: ' + total + ' records, ' + noUrl + ' without a url',
    ...top.map(([d, n]) => '  ' + String(n).padStart(3) + '  ' + d)].join(String.fromCharCode(10)));
  assert.ok(total > 0);
});
