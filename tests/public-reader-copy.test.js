import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {app} from '../src/app/state.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {PUBLIC_READING_CATALOG} from '../src/experience/story/public/historyCatalog.js';
import {renderChapter} from '../src/experience/story/public/chapter.js';
import {createFormat} from '../src/markets/_shared/format.js';

// Only internal editorial-status families are forbidden. Real policy publication,
// consultation, auction and contract statuses remain legitimate source facts.
const internalStatus=/G-[12]|sign.off|签核|公共(?:逻辑|解读|迁移|重组)待确认|(?:public|relocation|interpretation) review pending|current review draft|no new Jerry/i;
function element(tag){return {nodeType:1,tag,attrs:{},children:[],style:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(){},append(...children){this.children.push(...children);},get textContent(){return this.children.map(x=>x.textContent??String(x)).join('');}};}
const descendants=node=>[node,...(node.children||[]).flatMap(descendants)];
async function historyFor(id){
  const owner=id.startsWith('jp_')?'jp':id;
  const {researchHistory}=await import('../src/markets/'+owner+'/history.js');
  let h;
  if(owner==='wa')h=researchHistory(await import('../src/markets/wa/ui.js'));
  else{
    const [{M},{MKT},{SRC}]=await Promise.all(['data','mkt','sources'].map(name=>import('../src/markets/'+owner+'/'+name+'.js')));
    h=researchHistory({M,SRC,...createFormat(MKT)});
  }
  return {...h,owner,marketId:id};
}
test('all eighteen public readers retain research and evidence without internal editorial labels in either language',async()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:element,createTextNode:text=>({nodeType:3,textContent:String(text)})};
  try{
    for(const id of Object.keys(PUBLIC_READING_CATALOG)){
      const data={...await loadPublicContent(id),historyResearch:await historyFor(id)};
      const approvalBefore=JSON.stringify(data.approvalRecords);
      for(const lang of ['en','zh']){
        app.lang=lang;
        for(const chapter of data.summary.historyOnly?['history','research']:['history','system','mechanism','storage','judgement','research']){
          const rendered=renderChapter(data,chapter,{researchUrl:'/markets/test/home',research(){},alive:()=>false});
          assert.doesNotMatch(rendered.textContent,internalStatus,id+'/'+lang+'/'+chapter);
          assert.ok(rendered.textContent.length>30);
          const links=descendants(rendered).filter(n=>n.tag==='a');
          assert.ok(links.some(n=>n.attrs.href==='/markets/test/home'),id+' research route');
          assert.ok(links.every(n=>!String(n.attrs.href).includes('/jerryyuan1996/BESS-research-platform')),id+' no code browsing');
          const excerpts=descendants(rendered).filter(n=>n.className==='public-reference');
          for(const excerpt of excerpts){
            const provenance=descendants(excerpt).find(n=>n.tag==='details');
            assert.ok(descendants(provenance).some(n=>n.tag==='a'),'excerpt links source title');
            assert.doesNotMatch(provenance.textContent,/claim-|shot-/);
          }
          if(data.latestCheckedOn)assert.ok(rendered.textContent.includes(data.latestCheckedOn));
          if(chapter==='judgement')assert.ok(rendered.textContent.includes(lang==='en'?'Fair evidence':'证据一般'));
        }
      }
      assert.equal(JSON.stringify(data.approvalRecords),approvalBefore,'rendering leaves approval evidence unchanged');
    }
  }finally{globalThis.document=previous;app.lang='en';}
});
test('public renderers do not expose shot IDs, claim IDs or approval record links',async()=>{
  for(const file of ['chapter.js','historyChapter.js','pack.js','scene.js']){
    const source=await readFile(new URL('../src/experience/story/public/'+file,import.meta.url),'utf8');
    assert.doesNotMatch(source,/approvalRecordUrl|e\.shotId|e\.claimIds|github\.com/);
    // Explicit projection rules may name the two internal source dispositions.
    if(file!=='chapter.js')assert.doesNotMatch(source,internalStatus);
  }
  const chapter=await readFile(new URL('../src/experience/story/public/chapter.js',import.meta.url),'utf8');
  assert.match(chapter,/source\.title/);
  assert.match(chapter,/source\.url/);
  assert.match(chapter,/not a dispatch model/);
});
