/* ---------------------------------------------------------------------------
   THE ROLLED-OUT MARKETS STILL SAY EXACTLY WHAT THEY SAID.

   Great Britain, Ireland, Poland and Romania each had one 900–1,200-line
   sections.js. Each was cut into one module per domain and a loader was put in
   front of it (P1-C, docs/p1-sections-rollout.md). Nothing about a page was
   meant to change: not a number, not a source reference, not a Chinese
   sentence, not the order of a block inside a card.

   "Looked the same in the browser" is not evidence. These fixtures are: every
   section specification, built against the market's own dataset, formatters,
   compute layer and sponsor assumptions, serialised with functions included,
   hashed. Each was taken from the single-file implementation BEFORE that
   market was split, by scripts/generate-section-fixtures.mjs using the same
   tests/helpers/market-sections.mjs harness this test runs.

   WHEN THIS FAILS, the answer is almost never "regenerate the fixture". Find
   what moved. Regenerating is for a deliberate content change, and a change
   that moves a published number needs the analyst's sign-off (AGENTS.md).

   ONE INPUT IS PINNED. GB's home, duration and portfolio sections quote the
   Brief's design answer (src/briefing/designData.js), which is built from the
   ETL's live snapshots on the wall clock: each six-hourly data commit can move
   it (a new ECB GBP rate turned "−$277k/MW" into "−$279k/MW" on 5 Nov 2026).
   That is the briefing changing, not a section, so these sections are rendered
   against the design answer as it stood when the fixtures were taken
   (tests/fixtures/sections-design-vintage.json, scripts/pin-section-design.mjs).
   Everything a section's own code says is still compared byte for byte.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PINNED_URL } from './helpers/pin-design.mjs';
/* Loaded after the pin is registered: a static import would resolve first. */
const { buildAllMarketSections, digests, marketApi } = await import('./helpers/market-sections.mjs');
const { DESIGN: PINNED, PINNED_VINTAGE } = await import(PINNED_URL);
const { designLine } = await import('../src/markets/_shared/designAnswer.js');
const { briefingFromDisk } = await import('../src/briefing/disk.js');
const { designProjection } = await import('../src/briefing/model.js');

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKETS = ['gb', 'ie', 'pl', 'ro'];

const fixtureFor = (id) => {
  const file = path.join(REPO, 'tests/fixtures', `${id}-sections-content.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
};

/* The pin must be what the sections actually read, or the fingerprints below
   would be compared against live data again without anyone noticing. */
test('sections read the pinned design answer, not the live one', () => {
  assert.ok(PINNED_VINTAGE.dataCommit && PINNED_VINTAGE.now, 'the pin records the data commit and clock it was taken at');
  for (const id of MARKETS){
    const pinned = PINNED.build.find(x => x.market === id)?.line || null;
    assert.deepEqual(designLine(id), pinned, `${id}: designAnswer.js is not reading the pin`);
  }
});

/* The pin freezes values, not the projection's form. If designProjection()
   gains, loses or renames a field, the sections would read a stale shape:
   re-pin at the recorded vintage (node scripts/pin-section-design.mjs) and
   check every fingerprint still passes. */
test('the pinned design answer has the live projection\'s shape', async () => {
  const live = designProjection(await briefingFromDisk());
  const shape = (value) => {
    if (Array.isArray(value) || value === null || typeof value !== 'object') return 'value';
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, shape(value[k])]));
  };
  assert.deepEqual(Object.keys(live).sort(), Object.keys(PINNED).sort(), 'design projection top-level fields');
  for (const id of MARKETS){
    const was = PINNED.build.find(x => x.market === id), is = live.build.find(x => x.market === id);
    assert.deepEqual(shape(was), shape(is), `${id}: the build entry's shape changed — re-pin`);
    assert.deepEqual(shape(PINNED.byRoute[id]), shape(live.byRoute[id]), `${id}: the per-route answer's shape changed — re-pin`);
  }
});

/** A floor per market, deliberately well below what any of them carries. */
const MIN_TOTAL_BYTES = { gb: 250_000, ie: 270_000, pl: 150_000, ro: 150_000 };

for (const id of MARKETS){
  const FIXTURE = fixtureFor(id);

  test(`${id}: every section is byte-for-byte what the pre-split file produced`, async () => {
    assert.ok(FIXTURE, `${id} has no pre-split fixture — run scripts/generate-section-fixtures.mjs first`);
    const sections = await buildAllMarketSections(id, await marketApi(id));
    const now = digests(sections);

    assert.deepEqual(Object.keys(now).sort(), Object.keys(FIXTURE.sections).sort(),
      `${id}: a section has appeared or disappeared since the fixture was taken`);

    const moved = [];
    for (const [sectionId, was] of Object.entries(FIXTURE.sections)){
      const is = now[sectionId];
      if (was.sha !== is.sha || was.bytes !== is.bytes)
        moved.push(`${sectionId}: ${was.bytes} B → ${is.bytes} B`);
    }
    assert.deepEqual(moved, [],
      `${id}: these sections changed while being extracted. The fixture is the ` +
      'pre-split content of that market\'s sections.js.');
  });

  test(`${id}: the fingerprint is substantial, and both languages survive`, async () => {
    if (!FIXTURE) return;
    const ids = Object.keys(FIXTURE.sections);
    assert.equal(ids.length, 13, `${id}: twelve routed sections plus the unrouted peer benchmark`);

    const total = Object.values(FIXTURE.sections).reduce((sum, section) => sum + section.bytes, 0);
    assert.ok(total > (MIN_TOTAL_BYTES[id] || 100_000),
      `${id}: the fixture holds only ${total} bytes of specification — the harness has gone blind`);

    for (const [sectionId, section] of Object.entries(FIXTURE.sections)){
      assert.match(section.sha, /^[0-9a-f]{16}$/, `${id}/${sectionId}: not a digest`);
      if (sectionId === 'case' || sectionId === 'entry') continue;   // pointers to a shared component
      assert.ok(section.bytes > 2_000, `${id}/${sectionId} is ${section.bytes} bytes: a section that lost its body`);
    }

    /* The digest covers both halves of a bilingual pair, but a copy that
       dropped the Chinese and kept the English would still hash differently —
       this is the direct check, counted rather than inspected. */
    const sections = await buildAllMarketSections(id, await marketApi(id));
    const cjk = (value) => {
      if (typeof value === 'string') return (value.match(/[\u4e00-\u9fff]/g) || []).length;
      if (Array.isArray(value)) return value.reduce((n, v) => n + cjk(v), 0);
      if (value && typeof value === 'object') return Object.values(value).reduce((n, v) => n + cjk(v), 0);
      return 0;
    };
    const counts = Object.fromEntries(Object.entries(sections).map(([sectionId, spec]) => [sectionId, cjk(spec)]));
    /* The pilot's floor was 500, measured on the NEM. These four markets have
       a shorter `pipeline` section (385–489 Chinese characters), so the floor
       is 300 here: still far above a section that lost one language, and the
       total below cannot be met by one section alone. */
    const thin = Object.entries(counts).filter(([sectionId, n]) => !['case', 'entry'].includes(sectionId) && n < 300);
    assert.deepEqual(thin, [], `${id}: a section lost its Chinese wording: ` + JSON.stringify(counts));
    assert.ok(Object.values(counts).reduce((a, b) => a + b, 0) > 20_000,
      `${id}: the market's sections hold too few Chinese characters`);
  });
}
