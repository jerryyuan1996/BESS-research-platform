import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {STORIES,storyFor} from '../src/experience/story/registry.js';
import {story} from '../src/markets/pjm/story.js';
import {storyMatches} from '../src/markets/pjm/storyBindings.js';
import {opportunities} from '../src/experience/model.js';
const dist=new URL('../dist/',import.meta.url);

test('PJM remains unreleased and lazy, with the reviewed tuple falling back to research',()=>{
  assert.equal(STORIES.pjm.released,false);
  assert.equal(storyFor('pjm',''),null);
  assert.equal(storyFor('pjm','?story=preview'),STORIES.pjm);
  const row=opportunities('infraFund').find(r=>r.id==='pjm');
  assert.equal(storyMatches(story,row,'infraFund'),true);
  for(const changed of [{...row,call:'avoid'},{...row,play:{...row.play,id:'other'}},{...row,play:{...row.play,hours:6}}])assert.equal(storyMatches(story,changed,'infraFund'),false);
  assert.equal(storyMatches(story,row,'strategic'),false);
});

test('the complete initial PJM static closure and styles fit 40 KiB without preloading locators',t=>{
  const assets=new URL('assets/',dist);
  if(!existsSync(assets)){assert.notEqual(process.env.REQUIRE_OUTPUT,'1');t.skip('build output absent');return;}
  const files=readdirSync(assets),chunks=new Map(files.filter(f=>f.endsWith('.js')).map(file=>{
    const buf=readFileSync(new URL(file,assets)),text=buf.toString('utf8');
    const imports=[...text.matchAll(/(?:^|[;}\n])import(?:\s*\{[^}]*\}\s*from|\s*[\w$]+\s*from|)\s*"\.\/([^"]+\.js)"/g)].map(m=>m[1]);
    return [file,{file,text,bytes:gzipSync(buf).length,imports}];
  }));
  const pack=[...chunks.values()].find(c=>c.file.startsWith('story-pjm-'));
  assert.ok(pack,'missing lazy pack');
  const entryName=/<script[^>]+src="\/assets\/([^"]+\.js)"/.exec(readFileSync(new URL('index.html',dist),'utf8'))?.[1];
  const visit=(file,set)=>{if(set.has(file)||!chunks.has(file))return;set.add(file);for(const dep of chunks.get(file).imports)visit(dep,set);};
  const closure=new Set(),before=new Set();visit(pack.file,closure);visit(entryName,before);
  for(const c of chunks.values())if(c.file.startsWith('briefing-data-'))visit(c.file,before);
  assert.ok(!before.has(pack.file),'story loads before opening');
  let bytes=[...closure].filter(file=>!before.has(file)).reduce((n,file)=>n+chunks.get(file).bytes,0);
  const initialCss=new Set([...readFileSync(new URL('index.html',dist),'utf8').matchAll(/href="\/assets\/([^"]+\.css)"/g)].map(m=>m[1]));
  for(const file of files.filter(f=>f.endsWith('.css')&&!initialCss.has(f))){
    const buf=readFileSync(new URL(file,assets)),css=buf.toString('utf8');
    if(css.includes('.pjm-')||css.includes('.k-world')||css.includes('.ix-story-dialog'))bytes+=gzipSync(buf).length;
  }
  assert.ok(bytes<40*1024,`PJM static closure ${bytes} bytes exceeds 40960`);
  assert.ok(files.some(f=>f.startsWith('storyEvidenceProvenance-')),'missing demand-loaded provenance');
  for(const file of closure)assert.equal(chunks.get(file).text.includes('Withheld: no analyst rights clearance'),false,`${file} preloads provenance`);
  t.diagnostic(`PJM static closure including styles: ${bytes} bytes gzip`);
});
