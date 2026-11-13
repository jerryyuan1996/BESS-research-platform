import test from 'node:test';
import assert from 'node:assert/strict';
import { conciseResearchSpec, conciseResearchSections } from '../src/markets/_shared/conciseResearch.js';
import { buildAllMarketSections, marketApi, digests } from './helpers/market-sections.mjs';
import { DETAIL_DASHBOARDS } from '../src/markets/registry.js';
import { createExports } from '../src/markets/_shared/exports.js';

const options = { scoreKpis: ['Duration-Need Index'], scoreRows: ['Duration scorecard'] };
const flatten = blocks => (blocks || []).filter(Boolean).flatMap(block => [block, ...flatten(block.blocks), ...flatten(block.cards)]);

test('Romania omits manual scores and dependent summaries without moving economic inputs or sources', async () => {
  const raw = await buildAllMarketSections('ro', await marketApi('ro'));
  const before = digests(raw);
  const shown = Object.fromEntries(Object.entries(raw).map(([id, spec]) => [id, conciseResearchSpec(spec, options)]));
  const duration = flatten(shown.duration.blocks);
  assert.deepEqual(duration.filter(b => b.t === 'card').map(b => b.title[0]), [
    'Duration answers three different questions', 'Duration and route — what each design is worth',
  ]);
  assert.ok(!Object.values(shown).flatMap(s => flatten(s.blocks)).some(b => ['scorecard', 'aug'].includes(b.t)));
  const homeKpis = flatten(shown.home.blocks).filter(b => b.t === 'kpis').flatMap(b => b.items);
  assert.ok(!homeKpis.some(kpi => kpi.l[0] === 'Duration-Need Index'));
  assert.ok(!flatten(shown.data.blocks).filter(b => b.t === 'table').flatMap(b => b.rows).some(row => row[0]?.b?.[0] === 'Duration scorecard'));
  for (const section of ['capacity', 'energy', 'services', 'duration']) {
    const was = flatten(raw[section].blocks), now = flatten(shown[section].blocks);
    for (const type of ['src', 'wf', 'line', 'designFit']) assert.deepEqual(now.filter(b => b.t === type), was.filter(b => b.t === type), section + ': ' + type);
  }
  const all = Object.values(shown).flatMap(s => flatten(s.blocks));
  assert.ok(all.every(block => !('live' in block) && !(block.badges || []).some(b => ['illus','verify'].includes(b))));
  assert.ok(all.filter(b => b.t === 'kpis').flatMap(b => b.items).every(item => !(item.b || []).some(b => ['illus','verify'].includes(b))));
  assert.deepEqual(digests(raw), before, 'presentation must not mutate source research');
  assert.deepEqual(conciseResearchSpec(shown.home, options), shown.home, 'presentation is idempotent');
});

test('whole scoring units and their trailing explanation disappear while useful grouped cards survive', () => {
  const input = { blocks: [
    { t:'card', title:['Score','评分'], blocks:[{ t:'scorecard' }] },
    { t:'why', text:['Score explanation','评分解释'] },
    { t:'g2', cards:[
      { title:['Readiness','准备度'], blocks:[{ t:'aug' }] },
      { title:['Cash flow','现金流'], blocks:[{ t:'p', text:['Keep this decision','保留此判断'] }] },
    ] },
  ] };
  const shown = conciseResearchSpec(input);
  assert.equal(shown.blocks.length, 1);
  assert.equal(shown.blocks[0].cards.length, 1);
  assert.equal(shown.blocks[0].cards[0].title[0], 'Cash flow');
});

test('a concise reader does not load or evaluate unrelated sections', () => {
  let calls = 0;
  const build = () => () => ({ get duration() { calls++; return { blocks:[] }; } });
  const sections = conciseResearchSections(build, options)({})();
  assert.equal(calls, 0);
  void sections.duration;
  void sections.duration;
  assert.equal(calls, 2, 'each read still evaluates in the current language');
});

test('every declarative market removes manual scores and dependencies while preserving research inputs', async () => {
  for (const market of DETAIL_DASHBOARDS()) {
    const owner = market.manifest.dashboardId || market.manifest.id;
    if (owner === 'wa') continue; // hand-written renderer is covered in the browser
    const api = await marketApi(owner);
    if (owner === 'jp') Object.assign(api,{region:()=> 'tokyo',isCompare:()=>false,lensRegions:()=>['tokyo'],marketEntry:()=>null});
    const raw = await buildAllMarketSections(owner, api);
    const before = digests(raw);
    for (const spec of Object.values(raw)) {
      const shown = conciseResearchSpec(spec);
      const blocks = flatten(shown.blocks);
      assert.ok(!blocks.some(b=>['scorecard','aug'].includes(b.t)), owner);
      assert.ok(!blocks.filter(b=>b.t==='kpis').flatMap(b=>b.items).some(item=>/duration.need index|时长需求指数/i.test(JSON.stringify(item.l))),owner);
      assert.ok(!blocks.filter(b=>b.t==='table').flatMap(b=>b.rows).some(row=>/duration.need index|duration scorecard|时长需求指数|时长评分卡/i.test(JSON.stringify(row[0]))),owner);
      assert.deepEqual(conciseResearchSpec(shown),shown,owner+' is idempotent');
    }
    assert.deepEqual(digests(raw),before,owner+' source research is unchanged');
  }
});

test('research downloads omit retired manual scores and retain the economic evidence', async () => {
  const oldDocument = globalThis.document, oldCreate = URL.createObjectURL;
  const blobs = [];
  globalThis.document = {createElement:()=>({click(){}})};
  URL.createObjectURL = blob => {blobs.push(blob);return 'blob:concise-research-test';};
  const M = {official:{spread:42},kpiExport:[['Executable spread',42,'EUR/MWh'],['Duration-Need Index',65,'0-100']]};
  try {
    const exports = createExports({M,MKT:{id:'test',ns:'test'},state:{},compute:{liveScore(){throw new Error('retired score must not run');}}});
    exports.exportCsv(); exports.exportJson();
    const csv = await blobs[0].text(), json = JSON.parse(await blobs[1].text());
    assert.ok(csv.includes('Executable spread,42,EUR/MWh'));
    assert.ok(!csv.includes('Duration-Need'));
    assert.deepEqual(json.official,M.official);
    assert.ok(!Object.hasOwn(json,'calculated'));
    assert.equal(M.kpiExport.length,2,'source evidence is not rewritten');
  } finally {globalThis.document = oldDocument;URL.createObjectURL = oldCreate;}
});
