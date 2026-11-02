/* Ireland: the registry entry, the tuple guard and the story chunk's budget.

   A story that is registered but unreleased still emits its own chunk: the
   point of the entry is that the market page can open it in preview without
   every visitor paying for it. So the size assertion here measures the chunk
   AND everything it statically imports, which is what a reader downloads
   before the first shot appears.                                            */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STORIES, storyFor } from '../src/experience/story/registry.js';
import { story } from '../src/markets/ie/story.js';
import { storyValues, storyMatches } from '../src/markets/ie/storyBindings.js';
import { opportunities, CALLS, returnPct } from '../src/experience/model.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.resolve(REPO, process.env.SCAN_DIR || 'dist');
const row = opportunities('infraFund').find((r) => r.id === 'ie');

test('Ireland is released lazily and opens without a preview flag', () => {
  const entry = STORIES.ie;
  assert.ok(entry, 'no Ireland entry: the market page would never offer the story');
  assert.equal(entry.released, true, 'Ireland has analyst G-2 release approval');
  assert.equal(typeof entry.load, 'function');
  assert.equal(storyFor('ie', ''), entry, 'the released story opens from the market button');
  assert.equal(storyFor('ie', '?story=other'), entry);
  assert.equal(storyFor('ie', '?story=preview'), entry, 'the analyst walks it in preview');
  assert.equal(storyFor('wa', ''), STORIES.wa, 'other markets keep their released entries');
  assert.equal(storyFor('fi', ''), STORIES.fi);
});

test('the reviewed tuple returns to research when the lens, call or duration moved', () => {
  const values = storyValues(row, { CALLS, returnPct });
  assert.ok(values.playDuration);
  assert.equal(storyMatches(story, row, 'infraFund'), true);
  assert.equal(storyMatches(story, row, 'strategic'), false);
  assert.equal(storyMatches(story, row, 'developer'), false);
  assert.equal(storyMatches(story, { ...row, call: 'research' }, 'infraFund'), false);
  assert.equal(storyMatches(story, { ...row, play: { ...row.play, hours: 8 } }, 'infraFund'), false);
});

function chunks() {
  const dir = path.join(DIST, 'assets');
  const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
  const byName = new Map();
  for (const name of files) {
    const buf = readFileSync(path.join(dir, name));
    const text = buf.toString('utf8');
    const imports = new Set([...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map((m) => m[1]));
    byName.set(name, { name, gzip: gzipSync(buf).length, text, imports });
  }
  const entryName = /<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(readFileSync(path.join(DIST, 'index.html'), 'utf8'))?.[1];
  return { byName, entry: byName.get(entryName) };
}

test('the story chunk and what it adds to a market visit stay under 40 KiB gzip', (t) => {
  if (!existsSync(path.join(DIST, 'assets'))) {
    assert.ok(process.env.REQUIRE_OUTPUT !== '1', 'REQUIRE_OUTPUT=1 but no build output was found');
    t.skip('no build output: run "npm run build" first');
    return;
  }
  const { byName, entry } = chunks();
  const story = [...byName.values()].find((c) => c.name.startsWith('story-ie-'));
  assert.ok(story, 'no story-ie-*.js chunk: the pack is not loaded on demand, or it was inlined');

  const seen = new Set();
  const visit = (chunk) => { if (!chunk || seen.has(chunk)) return; seen.add(chunk); for (const name of chunk.imports) visit(byName.get(name)); };
  visit(story);

  /* What the reader already has before the button exists: the entry chunk and
     the briefing projection the market row is read from. Everything else is
     what opening the story adds. */
  const already = new Set();
  const visitAlready = (chunk) => { if (!chunk || already.has(chunk)) return; already.add(chunk); for (const name of chunk.imports) visitAlready(byName.get(name)); };
  visitAlready(entry);
  const briefing = [...byName.values()].filter((c) => c.name.startsWith('briefing-data-'));
  assert.ok(briefing.length, 'the briefing chunk has been renamed: the exclusion below is stale');
  briefing.forEach(visitAlready);

  const added = [...seen].filter((chunk) => !already.has(chunk));
  const gzip = added.reduce((total, chunk) => total + chunk.gzip, 0);
  assert.ok(gzip / 1000 <= 40,
    `opening the story adds ${(gzip / 1000).toFixed(2)} kB gzipped (${added.map((c) => `${c.name} ${(c.gzip / 1000).toFixed(2)}`).join(', ')}), over 40`);

  /* Nothing of it is fetched before the story opens. */
  assert.ok(entry, 'no entry chunk');
  const marker = 'ie-crm-chart';
  assert.ok(story.text.includes(marker), 'the marker has gone stale');
  assert.ok(!entry.text.includes(marker), 'the Ireland story is in the entry chunk');
  for (const chunk of seen) assert.ok(!chunk.text.includes('135499'), 'a withheld value reached the bundle');
});
