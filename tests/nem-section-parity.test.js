/* ---------------------------------------------------------------------------
   THE NEM'S SECTIONS STILL SAY EXACTLY WHAT THEY SAID.

   The single 1,173-line sections.js was cut into one module per domain, and a
   loader was put in front of it. Nothing about the page was meant to change:
   not a number, not a source reference, not a Chinese sentence, not the order
   of a block inside a card.

   "Looked the same in the browser" is not evidence of that. The digest below
   is: every section specification, built against the market's real dataset and
   formatters, serialised with functions included, hashed. The fixture was
   taken from the single-file implementation immediately before it was split —
   the same harness, the same dataset — so a diff here is a change to something
   a reader sees.

   WHEN THIS FAILS, the answer is almost never "regenerate the fixture". It is
   to find what moved. Regenerating is for a deliberate content change, and
   then the diff is the point: it belongs in the commit message, and a change
   that moves a published number needs the analyst's sign-off (AGENTS.md).
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildAllNemSections, digests } from './helpers/nem-sections.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = JSON.parse(readFileSync(path.join(REPO, 'tests/fixtures/nem-sections-content.json'), 'utf8'));

/* The pre-split fixture remains frozen. On 10 November 2026 the analyst
   authorised correcting the Very Fast FCAS rule/launch dates and adding their
   primary source. Assert those exact new fields before reversing only them for
   the original digest. All other fields, including the investment meaning and
   every other history node, still have to match the pre-split content. */
function beforeApprovedFcasCorrection(sections){
  const story=sections.story,card=story.blocks[1],timeline=card.blocks[1],event=timeline.items[0];
  assert.equal(timeline.t,'timeline');
  assert.equal(event.y,'2017–2023');
  assert.deepEqual(event.p,[
    'The first large NEM batteries earned most of their revenue in FCAS as synchronous plant retired and inertia thinned. The AEMC made the final rule for very fast raise and lower FCAS on 15 July 2021; AEMO opened those markets on 9 October 2023.',
    '随着同步机组退役、惯量下降，NEM首批大型电池的收入主要来自FCAS。AEMC于2021年7月15日制定极快速上调与下调FCAS的最终规则；AEMO于2023年10月9日启动这两个市场。',
  ]);
  assert.deepEqual(card.blocks[3],{
    t:'src',
    src:{
      file:'AEMO — Fast Frequency Response',status:['Official — Public','官方 — 公开'],
      provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
      date:'9 Oct 2023',cy:'Very Fast FCAS: final rule 15 July 2021; market commencement 9 October 2023',
      url:'https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/fast-frequency-response',
      lastChecked:'2026-11-10',
    },
    use:['Very Fast FCAS final rule on 15 July 2021 and market commencement on 9 October 2023','极快速FCAS最终规则制定于2021年7月15日，市场启动于2023年10月9日'],
  },'only this exact sourced correction is excluded from the original content digest');
  const originalEvent={...event,y:'2017–2021',p:[
    'The first large NEM batteries earned most of their revenue in FCAS, and AEMO introduced very fast raise and lower markets in 2021 as synchronous plant retired and inertia thinned.',
    'NEM首批大型电池的收入主要来自FCAS；随着同步机组退役、惯量下降，AEMO于2021年设立了极快速上调与下调市场。',
  ]};
  const originalTimeline={...timeline,items:[originalEvent,...timeline.items.slice(1)]};
  const originalCard={...card,blocks:card.blocks.filter((_,i)=>i!==3).map((b,i)=>i===1?originalTimeline:b)};
  return {...sections,story:{...story,blocks:story.blocks.map((b,i)=>i===1?originalCard:b)}};
}

test('every NEM section is byte-for-byte what the pre-split file produced', async () => {
  const sections = await buildAllNemSections();
  const now = digests(beforeApprovedFcasCorrection(sections));

  assert.deepEqual(Object.keys(now).sort(), Object.keys(FIXTURE.sections).sort(),
    'a section has appeared or disappeared since the fixture was taken');

  const moved = [];
  for (const [id, was] of Object.entries(FIXTURE.sections)){
    const is = now[id];
    if (was.sha !== is.sha || was.bytes !== is.bytes) moved.push(`${id}: ${was.bytes} B → ${is.bytes} B`);
  }
  assert.deepEqual(moved, [],
    'these sections changed while being extracted. The fixture is the pre-split ' +
    'content of src/markets/nem/sections.js; see docs/p1-sections-pilot.md.');
});

test('the fingerprint is not empty, and every section in it is substantial', async () => {
  /* The guard that keeps the test above from passing on nothing: a harness that
     silently built zero sections would produce two empty objects and agree with
     itself. Sizes are floors, not targets. */
  const ids = Object.keys(FIXTURE.sections);
  assert.equal(ids.length, 13, 'thirteen sections: twelve tabs plus the unrouted peer benchmark');

  const total = Object.values(FIXTURE.sections).reduce((sum, section) => sum + section.bytes, 0);
  assert.ok(total > 200_000, `the fixture holds only ${total} bytes of specification — the harness has gone blind`);

  for (const [id, section] of Object.entries(FIXTURE.sections)){
    assert.match(section.sha, /^[0-9a-f]{16}$/, `${id}: not a digest`);
    if (id === 'case' || id === 'entry') continue;   // two short pointers to a shared component
    assert.ok(section.bytes > 2_000, `${id} is ${section.bytes} bytes: a section that lost its body`);
  }
});

test('both languages survive the extraction', async () => {
  /* Every section carries its Chinese wording in the same object as its
     English, so a copy that dropped one half would still hash — the digest
     cannot tell "translated" from "translated, then stripped". Counted rather
     than inspected: a floor per section, well below what any of them carries,
     and a total that cannot be met by one section alone. */
  const sections = await buildAllNemSections();
  const cjk = (value) => {
    if (typeof value === 'string') return (value.match(/[\u4e00-\u9fff]/g) || []).length;
    if (Array.isArray(value)) return value.reduce((n, v) => n + cjk(v), 0);
    if (value && typeof value === 'object') return Object.values(value).reduce((n, v) => n + cjk(v), 0);
    return 0;
  };
  const counts = Object.fromEntries(Object.entries(sections).map(([id, spec]) => [id, cjk(spec)]));

  const thin = Object.entries(counts).filter(([id, n]) => id !== 'case' && id !== 'entry' && n < 500);
  assert.deepEqual(thin, [], 'a section lost its Chinese wording: ' + JSON.stringify(counts));

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  assert.ok(total > 20_000, `the market's sections hold only ${total} Chinese characters`);
});
