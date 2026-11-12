import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* Exercise the actual dashboard wrapper with only its imports substituted.
   A lazy section must finish before it binds the shared regional namespace,
   and a detached reading must never rebind a newer Japanese page. */
async function harness(){
  const pending = [], excerpts = [], summaries = [];
  const activeRegion = { id: 'hokkaido' };
  const engine = {
    api: {}, state: {}, dashboard() {},
    researchExcerpt(route, markets, picks){
      excerpts.push({ region: activeRegion.id, route, picks });
      return [{ region: activeRegion.id }];
    },
    researchSummary(container, route){
      summaries.push({ region: activeRegion.id, container, route });
    },
  };
  const key = 'jp-research-lifecycle-' + Math.random();
  globalThis[key] = {
    createMarketEngine: () => engine, markets: [], MKT: {}, TABS: [], SRC: {}, M: {},
    REGIONS: [['tokyo'], ['kyushu'], ['hokkaido']], activeRegion,
    buildSections() {},
    loadSections: (api, ids) => new Promise(resolve => pending.push({ ids, resolve })),
    TOKYO_VIEW: {}, KYUSHU_VIEW: {}, HOKKAIDO_VIEW: {},
    TOKYO_ENTRY_LEDGER: {}, KYUSHU_ENTRY_LEDGER: {}, HOKKAIDO_ENTRY_LEDGER: {},
    registerCase() {},
  };
  const names = Object.keys(globalThis[key]).join(', ');
  const source = (await readFile(new URL('../src/markets/jp/dashboard.js', import.meta.url), 'utf8'))
    .replace(/^import[^\n]*$/gm, '');
  try {
    const module = await import('data:text/javascript;base64,' + Buffer.from(
      `const { ${names} } = globalThis[${JSON.stringify(key)}];\n` + source
    ).toString('base64'));
    return { ...module, pending, excerpts, summaries, activeRegion };
  } finally { delete globalThis[key]; }
}

test('a late detached Japanese excerpt cannot overwrite the newer regional binding', async () => {
  const h = await harness();
  const oldBody = { isConnected: true };
  const old = h.researchExcerpt({ region: 'kyushu' }, [{ section: 'energy' }],
    { isCurrent: () => oldBody.isConnected });
  assert.equal(h.activeRegion.id, 'hokkaido', 'loading alone cannot bind a region');
  assert.equal(h.excerpts.length, 0);

  oldBody.isConnected = false;
  const current = h.researchExcerpt({ region: 'tokyo' }, [{ section: 'grid' }]);
  assert.deepEqual(h.pending.map(p => p.ids), [['energy'], ['grid']]);
  h.pending[1].resolve();
  assert.deepEqual(await current, [{ region: 'tokyo' }]);
  h.pending[0].resolve();
  assert.deepEqual(await old, []);
  assert.equal(h.activeRegion.id, 'tokyo');
  assert.deepEqual(h.excerpts.map(call => call.region), ['tokyo']);

  const fallback = h.researchExcerpt({ region: 'unknown' }, []);
  h.pending[2].resolve(); await fallback;
  assert.equal(h.activeRegion.id, 'tokyo', 'invalid region keeps the existing Tokyo fallback');
});

test('a late detached Japanese summary cannot overwrite the newer regional binding', async () => {
  const h = await harness();
  const oldContainer = { isConnected: true };
  const old = h.researchSummary(oldContainer, { region: 'kyushu' });
  assert.equal(h.activeRegion.id, 'hokkaido');
  assert.equal(h.summaries.length, 0);

  oldContainer.isConnected = false;
  const currentContainer = { isConnected: true };
  const current = h.researchSummary(currentContainer, { region: 'tokyo' });
  assert.deepEqual(h.pending.map(p => p.ids), [['home', 'story'], ['home', 'story']]);
  h.pending[1].resolve(); await current;
  h.pending[0].resolve(); await old;
  assert.equal(h.activeRegion.id, 'tokyo');
  assert.deepEqual(h.summaries.map(call => call.region), ['tokyo']);
  assert.equal(h.summaries[0].container, currentContainer);
});
