/* Poland: the registry entry, the tuple guard, the two opening markers and the
   story chunk's budget.

   A story that is registered but unreleased still emits its own chunk: the
   point of the entry is that the market page can open it in preview without
   every visitor paying for it. So the size assertion here measures the chunk
   AND everything it statically imports, which is what a reader downloads
   before the first shot appears.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STORIES, storyFor } from '../src/experience/story/registry.js';
import { story } from '../src/markets/pl/story.js';
import { storyValues, storyMatches, storyRows, reviewed, cardMarkers } from '../src/markets/pl/storyBindings.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';
import { marginText } from '../src/experience/decision.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.resolve(REPO, process.env.SCAN_DIR || 'dist');
const row = opportunities('infraFund').find(r => r.id === 'pl');

test('Poland is released lazily: the button opens it, and it still costs nothing up front', () => {
  const entry = STORIES.pl;
  assert.ok(entry, 'no Poland entry: the market page would never offer the story');
  assert.equal(entry.released, true, 'G-2 signed off 3 November 2026');
  assert.equal(typeof entry.load, 'function');
  assert.equal(storyFor('pl', ''), entry, 'the market button opens the story');
  assert.equal(storyFor('pl', '?story=other'), entry);
  assert.equal(storyFor('pl', '?story=preview'), entry, 'the preview route still resolves');
  /* The released entries are untouched. */
  for (const id of ['wa', 'fi', 'de', 'gb', 'it', 'ie', 'ro']) assert.equal(storyFor(id, ''), STORIES[id], id);
});

test('the reviewed tuple returns to research when the market, lens, call or duration moved', () => {
  const values = storyValues(row, { CALLS, returnPct, marginText });
  const live = { row, rows: storyRows(row).grant ? [storyRows(row).grant, storyRows(row).capacity] : [row], lens: 'infraFund', ui: { CALLS, returnPct, marginText } };
  assert.ok(reviewed(live), 'the live row opens the story');
  assert.equal(reviewed({ ...live, row: { ...row, id: 'ie' } }), null, 'another market returns to research');
  assert.equal(reviewed({ ...live, lens: 'strategic' }), null, 'another lens returns to research');
  assert.equal(reviewed({ ...live, row: { ...row, call: 'wait' } }), null, 'a moved call returns to research');
  assert.equal(reviewed({ ...live, row: { ...row, play: { ...row.play, hours: 2 } } }), null, 'a moved duration returns to research');
  assert.equal(Number(values.playDuration), story.reviewedAgainst.hours);
  assert.equal(storyMatches(story, row, 'infraFund'), true);
});

test('each opening card carries its own cohort’s evidence, and no shared financial case', () => {
  const { grant, capacity } = storyRows(row);
  const markers = cardMarkers([grant, capacity]);
  assert.equal(markers.length, 2);
  assert.equal(markers[0].play, 'pl-grant-4h');
  assert.equal(markers[1].play, 'pl-cap-4h');
  assert.deepEqual(markers[0].label, ['Fair evidence', '证据尚可']);
  assert.deepEqual(markers[1].label, ['Fair evidence', '证据尚可']);
  assert.equal(markers[0].level, grant.evidence);
  assert.equal(markers[1].level, capacity.evidence);
  assert.equal(Object.hasOwn(capacity, 'investment'), false, 'the capacity row owns no financial object');
  assert.equal(capacity.play.grantPct, undefined, 'and no grant share');
});

test('a missing row cannot produce a marker', () => {
  assert.deepEqual(cardMarkers([null, undefined]), []);
  assert.equal(cardMarkers([{ play: { id: 'x' } }]).length, 0);
});

/* ---- the chunk ---------------------------------------------------------- */

function chunks(){
  const dir = path.join(DIST, 'assets');
  const files = readdirSync(dir).filter(f => f.endsWith('.js'));
  const byName = new Map();
  for (const name of files){
    const buf = readFileSync(path.join(dir, name));
    const text = buf.toString('utf8');
    const imports = new Set([...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map(m => m[1]));
    byName.set(name, { name, gzip: gzipSync(buf).length, text, imports });
  }
  const entryName = /<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(readFileSync(path.join(DIST, 'index.html'), 'utf8'))?.[1];
  return { byName, entry: byName.get(entryName) };
}

test('the story chunk and what it adds to a market visit stay under 40 KiB gzip', (t) => {
  if (!existsSync(path.join(DIST, 'assets'))){
    assert.ok(process.env.REQUIRE_OUTPUT !== '1', 'REQUIRE_OUTPUT=1 but no build output was found');
    t.skip('no build output: run "npm run build" first');
    return;
  }
  const { byName, entry } = chunks();
  const chunk = [...byName.values()].find(c => c.name.startsWith('story-pl-'));
  assert.ok(chunk, 'no story-pl-*.js chunk: the pack is not loaded on demand, or it was inlined');

  const seen = new Set();
  const visit = (node) => { if (!node || seen.has(node)) return; seen.add(node); for (const name of node.imports) visit(byName.get(name)); };
  visit(chunk);

  /* What the reader already has before the button exists: the entry chunk and
     the briefing projection the market row is read from. */
  const already = new Set();
  const visitAlready = (node) => { if (!node || already.has(node)) return; already.add(node); for (const name of node.imports) visitAlready(byName.get(name)); };
  visitAlready(entry);
  const briefing = [...byName.values()].filter(c => c.name.startsWith('briefing-data-'));
  assert.ok(briefing.length, 'the briefing chunk has been renamed: the exclusion below is stale');
  briefing.forEach(visitAlready);

  const added = [...seen].filter(c => !already.has(c));
  const gzip = added.reduce((total, c) => total + c.gzip, 0);
  assert.ok(gzip / 1000 <= 40,
    `opening the Poland story adds ${(gzip / 1000).toFixed(2)} kB gzipped (${added.map(c => `${c.name} ${(c.gzip / 1000).toFixed(2)}`).join(', ')}), over 40`);
  t.diagnostic(`opening the Poland story adds ${(gzip / 1000).toFixed(2)} kB gzipped across ${added.length} chunks`);

  /* Nothing of it is fetched before the story opens. */
  const marker = 'Why did the earlier auctions build a contracted battery fleet?';
  assert.ok(chunk.text.includes(marker), 'the content probe has gone stale');
  assert.ok(!entry.text.includes(marker), 'the Poland story is in the entry chunk');
  /* No numeric auction figure may reach any chunk, because the layer is gated
     and the module that holds it is only fetched with the story. */
  for (const c of seen){
    if (c === chunk) continue;
    assert.ok(!c.text.includes('230.971552'), `${c.name}: carries a gated calculation`);
  }
});
