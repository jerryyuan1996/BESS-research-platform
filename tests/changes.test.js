/* ---------------------------------------------------------------------------
   /changes — the changelog as a page.

   No badge marks a verdict a rule moved; the changelog is the record. So the
   page that shows it is tested for the one thing it exists to do: for any
   line, say who made the change and on what. And for the thing it must not
   do: ride into the entry chunk or the home page's first view as it grows.

   The reading of a line is tested here on built records. That the page
   reaches the real changelog, and that the chunk is where it should be, is
   tested against dist/ when a build exists.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseRoute } from '../src/app/router.js';
import {
  AUTHOR_KINDS, AUTHOR_LABEL, describeChange, authorLine, recordLabel, filterChanges, filterOptions, changesHref,
} from '../src/changes/changeModel.js';
import { VIEW_CHANGELOG } from '../src/markets/viewChangelog.js';
import { fullChangelog, digestChangelog } from '../vite-plugin-view-changes.js';
import { PERMITTED_AUTHORS } from '../view/schema/view.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bilingual = (pair) => Array.isArray(pair) && pair.length === 2 && pair.every(s => typeof s === 'string' && s.trim());

const grade = (patch = {}) => ({ dimension: 'assetReturn', grade: 4, trend: 'stable', basis: 'derived', evidence: ['comparison-engine'],
  reason: ['Fourth of fourteen.', '十四个市场中排第四。'], asOf: '2026-10-10', author: 'analyst', lockedUntil: null, ...patch });
const line = (patch = {}) => ({
  id: 'x', at: '2026-10-12T06:00:00.000Z', market: 'wa', author: { kind: 'analyst' }, path: 'grades.assetReturn',
  from: grade(), to: grade({ grade: 3 }), reason: ['Because.', '原因如此。'], evidence: [], ...patch,
});
const ruleLine = line({
  author: { kind: 'rule', rule: 'wa-wem-spread-compression', run: '2026-10-12T06:00:00.000Z' }, trigger: 'wa-wem-spread-compression',
  to: grade({ trend: 'deteriorating', trendCause: ['Spreads are narrowing.', '价差正在收窄。'], author: 'rule', asOf: '2026-10-12' }),
  evidence: [{ publisher: 'AEMO WEM Data', url: 'https://data.wa.aemo.com.au/', class: 'official', retrievedAt: '2026-10-12T04:00:00.000Z',
    sha256: `sha256:${'a'.repeat(64)}`, dataset: 'wa-wem-prices', field: 'derived.spreadMean', observed: 44.2, op: '<', threshold: 45.05 }],
});

test('/changes is a route, and its two filters ride in the query', () => {
  assert.deepEqual(parseRoute('/changes'), { name: 'changes', market: null, author: null, region: null });
  assert.deepEqual(parseRoute('/changes/', '?market=wa&author=rule'), { name: 'changes', market: 'wa', author: 'rule', region: null });
  assert.equal(parseRoute('/changes/extra').name, 'notFound');
  assert.equal(parseRoute('/markets/changes').name, 'market');
  assert.equal(changesHref(), '/changes');
  assert.equal(changesHref({ market: 'wa' }), '/changes?market=wa');
  assert.equal(changesHref({ market: 'wa', author: 'rule' }), '/changes?market=wa&author=rule');
  assert.equal(changesHref({ author: 'agent', market: null }), '/changes?author=agent');
});

test('a line says who made the change, and a rule is named', () => {
  /* The page knows the same three authors the store does. */
  assert.deepEqual(AUTHOR_KINDS, PERMITTED_AUTHORS);
  for (const kind of AUTHOR_KINDS) assert.ok(bilingual(AUTHOR_LABEL[kind]));

  assert.deepEqual(authorLine(line()), ['Analyst', '分析师']);
  /* "A rule" is not an answer to "who": the rule's own label is. */
  const label = ['Trailing-year spread falls a fifth', '近一年价差下降五分之一'];
  assert.deepEqual(authorLine(ruleLine, label), ['Rule: Trailing-year spread falls a fifth', '规则：近一年价差下降五分之一']);
  assert.deepEqual(authorLine(ruleLine), ['Rule: wa-wem-spread-compression', '规则：wa-wem-spread-compression']);
  const agent = authorLine(line({ author: { kind: 'agent', run: '2026-10-12T05:43:10.000Z', model: 'claude-opus-5-5', prompt: 'v1' } }));
  assert.match(agent[0], /Agent run of 2026-10-12 05:43 UTC \(claude-opus-5-5, prompt v1\)/);
  assert.ok(bilingual(agent));
  assert.deepEqual(authorLine(line({ author: { kind: 'etl' } })), ['Unknown author', '作者不详']);
  assert.deepEqual(authorLine(line({ author: undefined })), ['Unknown author', '作者不详']);
});

test('a line says what moved: only the fields that differ, never the stamps', () => {
  const moved = describeChange(ruleLine);
  assert.equal(moved.kind, 'changed');
  assert.deepEqual(moved.fields.map(f => f.field), ['trend', 'trendCause']);
  assert.deepEqual(moved.fields[0].from, ['Stable', '保持稳定']);
  assert.deepEqual(moved.fields[0].to, ['Deteriorating', '趋于恶化']);
  /* Prose is named as changed and not printed inline. */
  assert.equal(moved.fields[1].to, null);
  for (const f of moved.fields) assert.ok(bilingual(f.label), `${f.field} has no label`);

  assert.deepEqual(describeChange(line()).fields.map(f => [f.field, f.from[0], f.to[0]]), [['grade', '4', '3']]);
  const verdict = (call) => ({ archetype: 'developer', call, route: 'greenfield', because: [], despite: ['a', '甲'], changesIf: [], author: 'analyst', asOf: '2026-10-10', lockedUntil: null });
  const called = describeChange(line({ path: 'verdicts.developer', from: verdict('wait'), to: verdict('opportunistic') }));
  assert.deepEqual(called.fields.map(f => [f.field, f.from, f.to]), [['call', ['Wait', '暂时观望'], ['Opportunistic', '择机而动']]]);

  /* Created and removed records get a headline instead of a field list. */
  const created = describeChange(line({ from: null }));
  assert.equal(created.kind, 'created');
  assert.deepEqual(created.headline, ['Grade 3, stable', '评级3，保持稳定']);
  assert.equal(describeChange(line({ to: null })).kind, 'removed');
  const held = describeChange(line({ path: 'grades.assetReturn.held', from: null, to: { grade: 1, confidence: 'high', asOf: '2026-10-11', reviewBy: '2027-04-11', publicNote: null } }));
  assert.deepEqual(held.headline, ['Practitioner view: grade 1', '从业者观点：评级1']);
  /* A trigger that carries an effect is announced as a rule when it is added. */
  const trigger = { id: 'wa-x', kind: 'data', market: 'wa', label: ['A line is crossed', '越过阈值'], effect: [{ path: 'grades.assetReturn.trend', to: 'deteriorating' }] };
  assert.match(describeChange(line({ path: 'triggers.wa-x', from: null, to: trigger })).headline[0], /^A rule:/);
  assert.equal(describeChange(line({ path: 'triggers.wa-x', from: null, to: { ...trigger, effect: null } })).headline, null);
  /* The thesis is one value. */
  assert.deepEqual(describeChange(line({ path: 'thesis', from: ['a', '甲'], to: ['b', '乙'] })).fields, []);

  assert.deepEqual(recordLabel('grades.capitalAtRisk.held'), ['Grade · Capital at risk before FID · practitioner view', '评级 · 最终投资决策前的风险资本 · 从业者观点']);
  assert.deepEqual(recordLabel('triggers.wa-x', trigger.label), ['Trigger · A line is crossed', '触发事件 · 越过阈值']);
  assert.ok(bilingual(recordLabel('thesis')));
});

test('the filters narrow by market and by author, newest first', () => {
  const entries = [
    line({ id: 'a', at: '2026-10-10T00:00:00.000Z', market: 'fi' }),
    line({ id: 'b', at: '2026-10-12T00:00:00.000Z' }),
    { ...ruleLine, id: 'c', at: '2026-10-11T00:00:00.000Z' },
  ];
  assert.deepEqual(filterChanges(entries).map(e => e.id), ['b', 'c', 'a']);
  assert.deepEqual(filterChanges(entries, { market: 'wa' }).map(e => e.id), ['b', 'c']);
  assert.deepEqual(filterChanges(entries, { author: 'rule' }).map(e => e.id), ['c']);
  assert.deepEqual(filterChanges(entries, { market: 'fi', author: 'rule' }), []);
  assert.deepEqual(filterChanges(entries, { market: 'nowhere' }), []);
  assert.deepEqual(filterOptions(entries), {
    markets: [{ id: 'fi', count: 1 }, { id: 'wa', count: 2 }],
    authors: [{ id: 'analyst', count: 2 }, { id: 'rule', count: 1 }, { id: 'agent', count: 0 }],
  });
});

test('the page gets every line of the changelog and the home page gets ten', async () => {
  const text = await readFile(path.join(REPO, 'view/changelog.jsonl'), 'utf8');
  const full = fullChangelog(text);
  assert.equal(full.length, text.split('\n').filter(Boolean).length);
  /* In full: the records before and after, the reason and the evidence. */
  for (const entry of full){
    for (const key of ['id', 'at', 'market', 'author', 'path', 'from', 'to', 'reason', 'evidence']) assert.ok(key in entry, `${entry.id}: no ${key}`);
    /* Every line on the page can be read: an author it can name and a record it can label. */
    assert.ok(bilingual(authorLine(entry)));
    assert.ok(bilingual(recordLabel(entry.path)));
    const change = describeChange(entry);
    assert.ok(['created', 'removed', 'changed'].includes(change.kind));
    for (const f of change.fields) assert.ok(bilingual(f.label), `${entry.id}: field ${f.field} has no label in both languages`);
  }
  assert.deepEqual(fullChangelog(''), []);
  /* The home digest names the rule when a rule wrote the line, and only then. */
  const digest = digestChangelog([JSON.stringify(ruleLine), JSON.stringify(line({ at: '2026-10-11T00:00:00.000Z' }))].join('\n'));
  assert.equal(digest.recent[0].rule, 'wa-wem-spread-compression');
  assert.ok(!('rule' in digest.recent[1]));
  assert.ok(!('from' in digest.recent[0]) && !('evidence' in digest.recent[0]));
  /* What plain Node sees is the stub; the plugin fills it in a build. */
  assert.deepEqual(VIEW_CHANGELOG, []);
});

test('only the changes page imports the whole changelog, and it is loaded on demand', async () => {
  const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : /\.js$/.test(e.name) ? [path.join(dir, e.name)] : []))).flat();
  const importers = [];
  for (const file of await walk(path.join(REPO, 'src'))){
    const source = await readFile(file, 'utf8');
    const rel = path.relative(REPO, file).replace(/\\/g, '/');
    if (/from\s+['"][^'"]*viewChangelog\.js['"]/.test(source)) importers.push(rel);
    /* The page itself is only ever reached by a dynamic import. */
    assert.ok(!/from\s+['"][^'"]*changesPage\.js['"]/.test(source), `${rel} imports the changes page statically`);
  }
  assert.deepEqual(importers, ['src/changes/changesPage.js']);
  const app = await readFile(path.join(REPO, 'src/app/app.js'), 'utf8');
  assert.match(app, /import\('\.\.\/changes\/changesPage\.js'\)/);
  /* The home panel and the market's Investment Case tab both link to it. */
  assert.match(await readFile(path.join(REPO, 'src/home/changesPanel.js'), 'utf8'), /href: '\/changes'/);
  assert.match(await readFile(path.join(REPO, 'src/components/investmentCase.js'), 'utf8'), /\/changes\?market=\$\{marketId\}/);
});

test('in a build, the changelog is in the changes chunk and nowhere a first view loads', async (t) => {
  const assets = path.join(REPO, 'dist', 'assets');
  if (!existsSync(assets)) return t.skip('no dist/ — run `npm run build` first');
  const files = (await readdir(assets)).filter(f => f.endsWith('.js'));
  const chunk = files.find(f => f.startsWith('changes-'));
  assert.ok(chunk, 'no changes chunk in the build');
  const lines = (await readFile(path.join(REPO, 'view/changelog.jsonl'), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l));
  /* A changelog id appears in the bundle only where the full record is. */
  const marker = lines[0].id;
  const holders = [];
  for (const f of files) if ((await readFile(path.join(assets, f), 'utf8')).includes(marker)) holders.push(f);
  assert.deepEqual(holders, [chunk], 'the full changelog is in a chunk other than the changes page\'s');
});
