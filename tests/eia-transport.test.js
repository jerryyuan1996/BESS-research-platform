import test from 'node:test';
import assert from 'node:assert/strict';
import { boundedDownload } from '../etl/lib/bounded-download.mjs';
import { inspectZip,extractZipMember,crc32 } from '../etl/lib/bounded-zip.mjs';
import { zipFixture } from './helpers/eia-inventory-fixture.mjs';

const options={maxBytes:100,timeoutMs:100};
test('the body deadline remains active after response headers',async()=>{
  let cancelled=false;
  const body=new ReadableStream({start(c){c.enqueue(new Uint8Array([1]));},cancel(){cancelled=true;}});
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,timeoutMs:15,fetchImpl:async()=>new Response(body)}),/deadline/);
  assert.equal(cancelled,true);
});
test('streamed and declared byte caps, empty bodies and misleading MIME fail closed',async()=>{
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,maxBytes:3,fetchImpl:async()=>new Response('1234')}),/streamed size/);
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,maxBytes:3,fetchImpl:async()=>new Response('1',{headers:{'content-length':'4'}})}),/declared size/);
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,fetchImpl:async()=>new Response('')}),/empty body/);
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,contentType:/zip/,fetchImpl:async()=>new Response('<html/>',{headers:{'content-type':'text/html'}})}),/content type/);
});
test('authentication, rate limits and redirects are each attempted once',async()=>{
  for(const status of [301,302,401,403,429]){
    let calls=0;await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,fetchImpl:async(_,request)=>{calls++;assert.equal(request.redirect,'manual');return new Response(null,{status});}}),new RegExp('HTTP '+status));assert.equal(calls,1);
  }
});
test('304 requires an explicit previous-content contract',async()=>{
  const fetchImpl=async()=>new Response(null,{status:304});
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,fetchImpl}),/HTTP 304/);
  assert.equal((await boundedDownload('https://example.test/file',{...options,fetchImpl,allowNotModified:true})).notModified,true);
});
test('an outer abort bounds even a transport that ignores its signal',async()=>{
  const controller=new AbortController();setTimeout(()=>controller.abort(new Error('outer budget')),10);
  await assert.rejects(()=>boundedDownload('https://example.test/file',{...options,signal:controller.signal,fetchImpl:()=>new Promise(()=>{})}),/outer budget/);
});
const limits={maxBytes:1024*1024,maxEntries:10,maxExpandedBytes:1024*1024,maxMemberBytes:1024*1024};
test('ZIP selected members are exact, size checked and CRC verified',()=>{
  assert.equal(crc32(Buffer.from('123456789')),0xcbf43926);
  for(const method of [0,8]){
    const bytes=zipFixture([{name:'first.txt',bytes:'unrelated'},{name:'Storage.xlsx',bytes:'specific member',method}]);
    const zip=inspectZip(bytes,limits);assert.equal(extractZipMember(bytes,zip,/^Storage\.xlsx$/,100).bytes.toString(),'specific member');
    assert.throws(()=>extractZipMember(bytes,zip,/xlsx$/,2),/limit/);
    assert.throws(()=>extractZipMember(bytes,zip,/absent/,100),/absent/);
  }
});
test('ZIP duplicates, traversal, truncation and expanded-size bombs are rejected before parse',()=>{
  for(const entries of [[{name:'a',bytes:'a'},{name:'a',bytes:'b'}],[{name:'../outside',bytes:'x'}],[{name:'a\\b',bytes:'x'}]])assert.throws(()=>inspectZip(zipFixture(entries),limits),/duplicate|unsafe/);
  const bytes=zipFixture([{name:'large',bytes:'x'.repeat(20000)}]);
  assert.throws(()=>inspectZip(bytes,{...limits,maxExpandedBytes:1000}),/expanded/);
  assert.throws(()=>inspectZip(bytes,{...limits,maxMemberBytes:1000}),/member size/);
  assert.throws(()=>inspectZip(bytes.subarray(0,bytes.length-1),limits),/end record/);
});
test('ZIP wrong local metadata and CRC are rejected, not silently inflated',()=>{
  const original=zipFixture([{name:'storage',bytes:'synthetic payload',method:0}]);
  const damaged=Buffer.from(original);damaged[30+'storage'.length]^=1;
  assert.throws(()=>extractZipMember(damaged,inspectZip(damaged,limits),/^storage$/,100),/CRC/);
  const renamed=Buffer.from(original);renamed[30]='X'.charCodeAt(0);
  assert.throws(()=>extractZipMember(renamed,inspectZip(renamed,limits),/^storage$/,100),/local name/);
});
