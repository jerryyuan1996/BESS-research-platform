/* ---------------------------------------------------------------------------
   EVIDENCE RESOLUTION THROUGH THE PUBLIC CONTRACT.

   The display layer looked up a market with `byId.get(marketId)` because the
   name reads like a Map. The registry exports a FUNCTION, so the call threw and
   took down the whole WA dashboard chunk.

   A test asserting `typeof byId === 'function'` would have caught the type and
   not the mistake. What matters is the path a claim actually travels: market id
   in, evidence record out, through the same call the renderer makes. So this
   exercises that route end to end and never touches the internal map.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { byId, markets } from '../src/markets/registry.js';
import { evidenceRecords, authorityOf } from '../src/governance/claims.js';
import { CLAIMS } from '../src/markets/wa/claims.js';
import { claimFor } from '../src/markets/claimRegistry.js';
import { READINESS } from '../src/governance/claims.js';

test('a claim evidence id resolves to a record through byId()', () => {
  /* Exactly what sectionClaim() does: resolve the market, then the record. */
  const market = byId('wa');
  assert.ok(market, 'byId("wa") must return the market');
  const records = evidenceRecords(market);
  const rec = records[CLAIMS.rcm.evidence[0]];
  assert.ok(rec, 'the rcm claim evidence must resolve to a real record');
  assert.ok(rec.url, 'and that record must carry a resolvable url');
  assert.equal(authorityOf(rec, 'brcp'), 'official');
});

test('every published claim resolves all of its evidence through byId()', () => {
  /* The full path, for every market that has claims, exactly as rendered. */
  for (const m of markets){
    const id = m.manifest.id;
    for (const [section] of Object.entries(CLAIMS)){
      const claim = claimFor(id, section);
      if (!claim || claim.readiness !== READINESS.SUPPORTED) continue;
      const market = byId(id);
      assert.ok(market, `byId("${id}") returned nothing`);
      const records = evidenceRecords(market);
      for (const ev of claim.evidence){
        assert.ok(records[ev], `${id}/${section} cites ${ev}, which does not resolve via byId()`);
      }
    }
  }
});

test('byId is called, not indexed — the mistake that broke the dashboard', () => {
  /* A Map-style call must fail loudly rather than return undefined, so the same
     error cannot reappear as a silent no-op. */
  assert.throws(() => byId.get('wa'), TypeError);
  assert.equal(byId('no-such-market'), null, 'an unknown id resolves to null, not undefined');
});
