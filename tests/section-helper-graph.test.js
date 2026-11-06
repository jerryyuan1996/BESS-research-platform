import test from 'node:test';
import assert from 'node:assert/strict';
import {assertSectionHelperImports} from './helpers/section-helper-graph.js';

const section='src/markets/nem/sections/story.js',entry='src/markets/nem/history.js';
const factory='export function researchHistory(api){return api.M.timeline;}';
async function check(files){
  return assertSectionHelperImports({source:"import {researchHistory} from '../history.js';",moduleId:section,
    allowed:new Set(),readSource:async id=>{assert.ok(files[id],'all transitive modules are read: '+id);return files[id];}});
}
test('a section can share an API-fed factory and a transitive pure formatter',async()=>{
  await check({[entry]:"import {format} from './format.js'; export function researchHistory(api){return format(api.M.timeline);}",
    'src/markets/nem/format.js':'export const format=value=>value;'});
  await check({[entry]:factory});
});
test('section helper graph rejects datasets, sources, sections and dashboards behind re-exports',async()=>{
  for(const target of ['data.js','historyData.js','renamedData.js','data/official.js','sources.js','sections/case.js','dashboard.js','../_shared/engine.js']){
    await assert.rejects(check({[entry]:"export {researchHistory} from './bridge.js';",
      'src/markets/nem/bridge.js':`export * from './${target}';`}),/forbidden helper dependency/,target);
  }
});
test('dynamic edges cannot hide a dataset or an opaque dependency',async()=>{
  await assert.rejects(check({[entry]:"export async function researchHistory(api){return import('./data.js');}"}),/forbidden helper dependency/);
  await assert.rejects(check({[entry]:'export async function researchHistory(api){return import(api.module); }'}),/opaque dynamic import/);
  await assert.rejects(check({[entry]:"export function researchHistory(api){return import.meta.glob('./*.js');}"}),/opaque bundler dependency/);
});
test('renaming a dataset or using ambient state does not make an API-fed factory',async()=>{
  for(const source of ["export const facts={timeline:[]};",'export function read(api){return fetch(api.url);}',
    "import './side-effect.js'; export function read(api){return api.M;}",
    'export function read(api){api.M.timeline=[];return api.M;}'])
    await assert.rejects(check({[entry]:source}),/module data or evaluation|ambient runtime state|side-effect helper import|mutates external state/);
});
