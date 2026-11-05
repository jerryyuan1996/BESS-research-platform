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
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildAllMarketSections, digests, marketApi } from './helpers/market-sections.mjs';
import { designLine } from '../src/markets/_shared/designAnswer.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKETS = ['gb', 'ie', 'pl', 'ro'];

const fixtureFor = (id) => {
  const file = path.join(REPO, 'tests/fixtures', `${id}-sections-content.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
};

/** A floor per market, deliberately well below what any of them carries. */
const MIN_TOTAL_BYTES = { gb: 250_000, ie: 270_000, pl: 150_000, ro: 150_000 };

/* The GB portfolio includes a live briefing projection, intentionally following
   committed observed FX. Pin only that sentence to the public-data vintage used
   by the original fingerprint; preserve every other string, number and function.
   Its runtime value is checked below, rather than discarded from coverage. */
function staticGbProjection(sections){
  const original=JSON.parse(readFileSync(path.join(REPO,'tests/fixtures/gb-section-design-projection.json'),'utf8')).line;
  const current=designLine('gb');
  assert.ok(current?.length===2,'GB briefing projection must remain bilingual');
  const counts=[0,0];
  const visit=value=>{
    if(typeof value==='string'){
      let out=value;
      for(let i=0;i<2;i++)if(out.includes(current[i])){counts[i]++;out=out.replace(current[i],original[i]);}
      return out;
    }
    if(Array.isArray(value))return value.map(visit);
    if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,visit(v)]));
    return value;
  };
  const portfolio=visit(sections.portfolio);
  assert.deepEqual(counts,[1,1],'The GB portfolio must carry exactly one current Brief sentence per language');
  return {...sections,portfolio};
}

for (const id of MARKETS){
  const FIXTURE = fixtureFor(id);

  test(`${id}: every section is byte-for-byte what the pre-split file produced`, async () => {
    assert.ok(FIXTURE, `${id} has no pre-split fixture — run scripts/generate-section-fixtures.mjs first`);
    const sections = await buildAllMarketSections(id, await marketApi(id));
    const now = digests(id === 'gb' ? staticGbProjection(sections) : sections);

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
