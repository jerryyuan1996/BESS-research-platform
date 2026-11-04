/* ---------------------------------------------------------------------------
   THE DEEP LAYER SAYS WHAT THE BRIEF SAYS (guided-experience plan, PR 7).

   The Brief states the call, what to build and the numbers. These guards keep
   the tabs underneath from contradicting it again:

     - no disclaimer band, and no retired stance word, anywhere in the source
     - a deep tab that names a duration reads it through designAnswer.js, which
       reads the briefing the Brief reads; WA keeps no duration of its own
     - no card is authored only to be removed at runtime
     - /returns names what it leaves out and every market is on its globe
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { HOME_BRIEFING } from '../src/briefing/homeData.js';
import { designLine, designBest, routeFit } from '../src/markets/_shared/designAnswer.js';
import { waDesign } from '../src/markets/wa/lib/design.js';
import { markets } from '../src/markets/registry.js';
import { SEED } from '../src/markets/wa/data/seed.js';
import { DESIGN } from '../src/briefing/designData.js';
import { designProjection } from '../src/briefing/model.js';
import { briefingFromDisk } from '../src/briefing/disk.js';
import { designModule } from '../vite-plugin-briefing.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

function walk(dir, out = []){
  for (const name of readdirSync(dir)){
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.m?js$/.test(name)) out.push(p);
  }
  return out;
}
const FILES = walk(SRC).map(p => ({ rel: path.relative(ROOT, p).split(path.sep).join('/'), text: readFileSync(p, 'utf8') }));
const file = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

/** A market's sections, whether they are one file or one module per section.
 *  The P1 rollout moved GB's deep tabs into sections/*.js; a guard held against
 *  a single filename would go blind rather than fail, so it reads the whole
 *  market's section source. */
const marketSections = (rel) => {
  const dir = path.join(ROOT, path.dirname(rel), 'sections');
  if (!existsSync(dir)) return file(rel);
  const parts = [file(rel)];
  for (const name of readdirSync(dir).filter(n => n.endsWith('.js')))
    parts.push(file(path.join(path.dirname(rel), 'sections', name)));
  return parts.join('\n');
};

/* Source without its comments, so a comment may name what the rule forbids. A
   "//" after a colon is a URL, not a comment. */
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');

test('no page carries a disclaimer band', () => {
  const offenders = FILES.filter(f => /renderDisclaimer|\bDISCLAIMER\b/.test(code(f.text))).map(f => f.rel);
  assert.deepEqual(offenders, []);
  assert.doesNotMatch(file('src/styles/components.css'), /\.disc\b/, 'the band\'s styles went with it');
});

test('the retired stance word is gone from everything a page can show', () => {
  const offenders = FILES
    .filter(f => /\bselective(ly)?\b|选择性/i.test(code(f.text)))
    .map(f => f.rel);
  assert.deepEqual(offenders, [], '"Selective" is retired vocabulary (src/governance/briefing.js)');
});

test('the deep tabs read what to build from the briefing the Brief reads', () => {
  for (const build of HOME_BRIEFING.build){
    assert.deepEqual(designLine(build.market), build.line, `${build.market}: the tab and the Brief say the same sentence`);
  }
  const gb = designBest('gb');
  const gbBuild = HOME_BRIEFING.build.find(b => b.market === 'gb').best;
  assert.equal(gb.route, gbBuild.route);
  assert.equal(gb.hours, gbBuild.hours);

  /* A route's answer is the engine's per-route fit, carried in the grid. */
  for (const [id, grid] of Object.entries(HOME_BRIEFING.grids)){
    if (!grid) continue;
    for (const [route, r] of Object.entries(grid.byRoute || {})){
      const fit = routeFit(id, route);
      if (r.best === null){ assert.equal(fit, null); continue; }
      assert.equal(fit.hours, r.best, `${id} ${route}`);
      assert.ok(fit.low <= fit.hours && fit.hours <= fit.high, `${id} ${route}: the best sits inside its band`);
      const top = Math.max(...grid.cells.filter(c => c.route === route && c.priced && c.eligible).map(c => c.value));
      const atBest = grid.cells.find(c => c.route === route && c.hours === r.best);
      assert.equal(atBest.value, top, `${id} ${route}: the route's best is its most valuable eligible design`);
    }
  }

  for (const rel of ['src/markets/gb/sections.js', 'src/markets/jp/sections.js', 'src/markets/wa/lib/design.js']){
    assert.match(marketSections(rel), /_shared\/designAnswer\.js/, `${rel} names durations through designAnswer.js`);
  }
  for (const rel of ['src/markets/wa/sections/home.js', 'src/markets/wa/sections/duration.js', 'src/markets/wa/sections/story.js']){
    assert.match(file(rel), /lib\/design\.js/, `${rel} reads WA's design from the engine`);
  }
});

test('a dashboard carries the design projection, which is what the build serves, and small', async () => {
  const NOW = new Date('2026-10-16T00:00:00Z');
  const text = await designModule(ROOT, NOW);
  const served = JSON.parse(text.replace(/^export const DESIGN = /, '').replace(/;\n$/, ''));
  assert.deepEqual(served, JSON.parse(JSON.stringify(designProjection(await briefingFromDisk({ now: NOW })))));
  assert.deepEqual(Object.keys(DESIGN).sort(), ['build', 'byRoute'], 'the projection holds what to build and nothing else');
  assert.ok(text.length < 8000, `the design projection is ${text.length} bytes; every GB, WA and Japan visit carries it`);
});

test('WA keeps no duration recommendation of its own', () => {
  assert.equal(SEED.durationSig.recoInitial, undefined);
  assert.equal(SEED.durationSig.recoExpand, undefined);
  assert.equal(FILES.some(f => /durationSig\.reco/.test(code(f.text))), false);
  const wa = waDesign();
  assert.ok(wa && wa.hours === HOME_BRIEFING.build.find(b => b.market === 'wa').best.hours,
    'WA builds what the Brief says WA builds');
});

test('no card is authored only to be removed at runtime', () => {
  const enhancer = code(file('src/components/pageEnhancements.js'));
  for (const fn of ['removeUnquantifiedCards', 'removeWaRcmCards', 'removePresentationOrder']){
    assert.doesNotMatch(enhancer, new RegExp(fn), `${fn} hid authored content; the content went at source instead`);
  }
  const hidden = [/Recommended presentation order/, /title: ?\['Investment conclusion/, /Bear \/ Base \/ Bull/];
  for (const f of FILES){
    for (const re of hidden) assert.doesNotMatch(code(f.text), re, `${f.rel}`);
  }
});

test('/returns names what it leaves out and puts every market on the globe', () => {
  const globe = file('src/home/marketGlobe.js');
  const onGlobe = new Set([...globe.matchAll(/\{ id:'([a-z_]+)'/g)].map(m => m[1]));
  const missing = markets.map(m => m.manifest.id).filter(id => !onGlobe.has(id));
  assert.deepEqual(missing, [], 'every registered market is on the globe');

  const matrix = code(file('src/home/allocationMatrix.js'));
  assert.doesNotMatch(matrix, /only in GB/, 'the toll precedent is listed from capabilities');
  assert.match(matrix, /not priced/, 'a withheld market is named, not dropped');

  const returns = code(file('src/home/returnsPage.js'));
  assert.doesNotMatch(returns, /'20\d\d-\d\d-\d\d'/, 'the review date comes from the manifests, never typed');
  assert.doesNotMatch(returns, /screening only/i);
});
