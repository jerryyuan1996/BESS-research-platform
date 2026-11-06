import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {createPinnedPDFExtractor,PDF_REVIEW_VERSION} from '../scripts/policy/pinned-pdf-extractor.mjs';

const bytes=Buffer.from('%PDF-synthetic-process-boundary-test');
function fakeProcess(action,capture={}){
  return (command,args,options)=>{
    Object.assign(capture,{command,args,options});
    const child=new EventEmitter();
    child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new PassThrough();
    child.kill=()=>{capture.killed=true;};
    const chunks=[];child.stdin.on('data',chunk=>chunks.push(chunk));
    child.stdin.on('finish',()=>{capture.input=JSON.parse(Buffer.concat(chunks));queueMicrotask(()=>action(child,capture));});
    return child;
  };
}
const response=()=>({engine:'pypdf',version:PDF_REVIEW_VERSION,pages:[{page:1,text:'Synthetic page'}]});
const reply=result=>child=>{child.stdout.write(JSON.stringify(result));child.emit('close',0);};

test('manual extractor fixes the engine/helper and strips provider credentials from the child environment',async()=>{
  const prior=process.env.ANTHROPIC_API_KEY;process.env.ANTHROPIC_API_KEY='synthetic-not-a-credential';
  const capture={};
  try{
    const extractor=createPinnedPDFExtractor({spawnProcess:fakeProcess(reply(response()),capture)});
    assert.deepEqual(await extractor.extract({bytes,pages:[1]}),response().pages);
    assert.equal(extractor.version,'6.21.4');assert.equal(capture.args[0],'-I');
    assert.match(capture.args[1],/extract-review-pdf\.py$/);assert.equal(capture.options.windowsHide,true);
    assert.equal(capture.options.env.ANTHROPIC_API_KEY,undefined);
    assert.equal(capture.input.bytes,bytes.toString('base64'));assert.deepEqual(capture.input.pages,[1]);
  }finally{if(prior===undefined)delete process.env.ANTHROPIC_API_KEY;else process.env.ANTHROPIC_API_KEY=prior;}
});
test('invalid input and page order never start a parser',async()=>{
  let calls=0;const extractor=createPinnedPDFExtractor({spawnProcess:()=>{calls++;throw Error('unreachable');}});
  for(const request of [{bytes:Buffer.from('HTML'),pages:[1]},{bytes,pages:[2,1]},{bytes,pages:[1,1]},{bytes,pages:[0]},{bytes,pages:Array.from({length:13},(_,i)=>i+1)}])await assert.rejects(()=>extractor.extract(request));
  assert.equal(calls,0);
});
test('parser version drift, wrong pages and extra receipt fields fail closed',async()=>{
  for(const value of [{...response(),version:'different'},{...response(),pages:[{page:2,text:'Synthetic page'}]},{...response(),approved:true}]){
    const extractor=createPinnedPDFExtractor({spawnProcess:fakeProcess(reply(value))});
    await assert.rejects(()=>extractor.extract({bytes,pages:[1]}),/engine, version or pages differ/);
  }
});
test('malformed parser JSON and a failed process cannot become evidence',async()=>{
  for(const action of [child=>{child.stdout.write('not JSON');child.emit('close',0);},child=>child.emit('close',2)]){
    const extractor=createPinnedPDFExtractor({spawnProcess:fakeProcess(action)});
    await assert.rejects(()=>extractor.extract({bytes,pages:[1]}));
  }
});
test('an oversized response and a stalled helper stop only the owned child',async()=>{
  for(const action of [child=>child.stdout.write(Buffer.alloc(1_000_001)),()=>{}]){
    const capture={};const extractor=createPinnedPDFExtractor({timeoutMs:30,spawnProcess:fakeProcess(action,capture)});
    await assert.rejects(()=>extractor.extract({bytes,pages:[1]}),/exceeds bound|timed out/);assert.equal(capture.killed,true);
  }
});
