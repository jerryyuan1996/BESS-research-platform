import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* Exercise the actual state module with the shell/router substituted, without
   importing DOM or changing its runtime API. This holds the lifecycle boundary
   even on runners without a browser. Browser tests exercise real renderers. */
async function harness(){
  let renders = 0;
  const navigations = [];
  const key = 'wa-research-render-' + Math.random();
  globalThis[key] = {
    app: { lang: 'en', theme: 'light' }, LS: { get: () => null },
    requestRender: () => renders++, navigate: path => navigations.push(path),
  };
  const source = (await readFile(new URL('../src/markets/wa/state.js', import.meta.url), 'utf8'))
    .replace(/^import .*;$/gm, '');
  const module = await import('data:text/javascript;base64,' + Buffer.from(
    `const {app, LS, requestRender, navigate} = globalThis[${JSON.stringify(key)}];\n` + source
  ).toString('base64'));
  delete globalThis[key];
  return { ...module, renders: () => renders, navigations };
}
const basePath = '/markets/western-australia';

test('WA research repaint is local, synchronised, and stops when nodes disconnect', async () => {
  const before = globalThis.window;
  globalThis.window = { location: { pathname: basePath } };
  try {
    const h = await harness();
    const a = { isConnected: true }, b = { isConnected: true };
    let paintsA = 0, paintsB = 0;
    h.registerResearchExcerpt(a, () => paintsA++, basePath);
    h.registerResearchExcerpt(b, () => paintsB++, basePath);
    h.render();
    assert.deepEqual([paintsA, paintsB, h.renders()], [1, 1, 0]);
    a.isConnected = false;
    h.render();
    assert.deepEqual([paintsA, paintsB, h.renders()], [1, 2, 0]);
    b.isConnected = false;
    h.render();
    assert.equal(h.renders(), 1);
  } finally { globalThis.window = before; }
});

test('WA bridge links navigate even to the same stored tab; dashboard assignments keep shell behaviour', async () => {
  const before = globalThis.window;
  globalThis.window = { location: { pathname: basePath } };
  try {
    const h = await harness();
    h.state.tab = 'duration';
    h.registerResearchExcerpt({ isConnected: true }, () => assert.fail('bridge must navigate'), basePath);
    h.state.tab = 'duration'; h.render();
    assert.deepEqual(h.navigations, [basePath + '/duration']);
    // A connected old node cannot capture the first render of a new route.
    window.location.pathname = basePath + '/rcm';
    h.state.tab = 'rcm'; h.render();
    assert.equal(h.renders(), 1);
    assert.deepEqual(h.navigations, [basePath + '/duration']);
  } finally { globalThis.window = before; }
});

test('WA off-DOM siblings can be assembled before cleanup, and abandoned excerpts are discarded', async () => {
  const before = globalThis.window;
  globalThis.window = { location: { pathname: basePath } };
  try {
    const h = await harness();
    const a = { isConnected: false }, b = { isConnected: false };
    let paints = 0;
    h.registerResearchExcerpt(a, () => paints++, basePath);
    h.registerResearchExcerpt(b, () => paints++, basePath);
    a.isConnected = b.isConnected = true;
    await Promise.resolve(); h.render();
    assert.equal(paints, 2);
    h.registerResearchExcerpt({ isConnected: false }, () => assert.fail('abandoned'), basePath);
    await Promise.resolve(); h.render();
    assert.equal(paints, 4);
    window.location.pathname = '/markets/nem'; h.render();
    assert.equal(h.renders(), 1);
  } finally { globalThis.window = before; }
});
