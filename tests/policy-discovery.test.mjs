import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverPolicies,canonicalURL,robotsPermit,cycleId } from '../policy/discovery.mjs';
const source={id:'official-test',officialId:'TEST-1',jurisdiction:'AU-NEM',markets:['nem'],language:'en',title:'Synthetic policy register',url:'https://official.example/register',host:'official.example',reviewed:true,rightsReviewed:true};
const sleep=async()=>{};
const mock=(body='Version one')=>async url=>url.endsWith('/robots.txt')?new Response('User-agent: *\nAllow: /',{headers:{'content-type':'text/plain'}}):new Response(body,{headers:{'content-type':'text/html'}});
const run=(overrides={})=>discoverPolicies({sources:[source],fetcher:mock(),sleep,now:new Date('2026-11-05T06:17:00Z'),...overrides});
test('a changed source produces a hash candidate, never a legal claim or invented date',async()=>{
  const r=await run();assert.equal(r.changed,1);assert.equal(r.verifiedPolicyClaims,0);assert.equal(r.records[0].lastKnownGood.publishedAt,null);assert.equal(r.records[0].lastKnownGood.effectiveAt,null);assert.match(r.records[0].lastKnownGood.contentHash,/^sha256:/);
});
test('same-day replay and next-day unchanged checks do not manufacture a content change',async()=>{
  const first=await run();const repeat=await run({previous:first.records});const next=await run({previous:repeat.records,now:new Date('2026-11-06T06:17:00Z')});
  assert.equal(repeat.changed,0);assert.equal(first.contentHash,repeat.contentHash);assert.equal(repeat.contentHash,next.contentHash);assert.deepEqual(first.records[0].lastKnownGood,next.records[0].lastKnownGood);
});
test('same title with changed text changes identity digest; URL-only move preserves source identity',async()=>{
  const first=await run();const changed=await run({previous:first.records,fetcher:mock('Version two')});assert.equal(changed.changed,1);
  const moved=await run({previous:first.records,sources:[{...source,url:'https://official.example/new-register'}]});assert.equal(moved.changed,0);assert.equal(moved.records[0].identity,first.records[0].identity);
});
test('duplicate canonical URL and duplicate official identifier cannot double process',async()=>{
  const r=await run({sources:[source,{...source,id:'duplicate-test',url:source.url+'?utm_source=test'}]});assert.equal(r.changed,1);assert.equal(r.records[1].status,'duplicate');
  assert.equal(canonicalURL('https://official.example/register?b=2&a=1#section'),'https://official.example/register?a=1&b=2');
});
test('source blackout retains last-known-good and records explicit failure',async()=>{
  const first=await run();let calls=0;const r=await run({previous:first.records,fetcher:async()=>{calls++;throw new Error('offline');}});assert.equal(r.changed,0);assert.equal(r.records[0].status,'offline');assert.deepEqual(r.records[0].lastKnownGood,first.records[0].lastKnownGood);assert.equal(calls,3);
});
test('robots denial and unreviewed rights stop before fetching the document',async()=>{
  let doc=0;const fetcher=async url=>{if(!url.endsWith('/robots.txt'))doc++;return new Response('User-agent: *\nDisallow: /register',{headers:{'content-type':'text/plain'}});};
  const denied=await run({fetcher});assert.equal(denied.records[0].status,'robots_denied');assert.equal(doc,0);
  const unreviewed=await run({sources:[{...source,rightsReviewed:false}],fetcher:async()=>{throw new Error('should_not_fetch');}});assert.equal(unreviewed.records[0].status,'pending_source_review');
});
test('redirect cannot cross the reviewed host and no credential is supplied',async()=>{
  let outside=false;const r=await run({fetcher:async(url,options)=>{assert.equal(options.redirect,'manual');assert.equal(options.headers.authorization,undefined);if(url.includes('unreviewed'))outside=true;return url.endsWith('/robots.txt')?new Response('',{status:404}):new Response('',{status:302,headers:{location:'https://unreviewed.example/record'}});}});assert.equal(r.records[0].status,'unreviewed_redirect');assert.equal(outside,false);
});
test('oversize and unsupported binary bodies quarantine rather than replace a verified document',async()=>{
  const first=await run();const tooLarge=await run({previous:first.records,limits:{bytes:5,timeoutMs:1000,retries:0,redirects:1},fetcher:mock('Very long content')});assert.equal(tooLarge.records[0].status,'size_limit');assert.deepEqual(tooLarge.records[0].lastKnownGood,first.records[0].lastKnownGood);
  const binary=await run({fetcher:async url=>url.endsWith('/robots.txt')?new Response('',{status:404}):new Response('pdf',{headers:{'content-type':'application/pdf'}})});assert.equal(binary.records[0].status,'unsupported_document_type');
});
test('NEM, WA and non-dashboard jurisdiction coverage remain independent',async()=>{
  const r=await run({sources:[source,{...source,id:'wa-test',jurisdiction:'AU-WA',markets:['wa'],officialId:'WA-TEST',url:'https://official.example/wa'},{...source,id:'nz-test',jurisdiction:'NZ',markets:[],officialId:'NZ-TEST',url:'https://official.example/nz'}]});assert.deepEqual(r.records.map(x=>x.markets),[['nem'],['wa'],[]]);assert.equal(r.changed,3);
});
test('kill switch prevents every network call; UTC calendar identity is stable',async()=>{
  const r=await run({killSwitch:true,fetcher:async()=>{throw new Error('should_not_fetch');}});assert.equal(r.changed,0);assert.equal(r.records[0].status,'disabled');assert.equal(cycleId('2026-11-05T23:59:59Z'),'2026-11-05');
});
test('robots supports wildcard paths and a more specific allow without trusting unknown groups',()=>{
  assert.equal(robotsPermit('User-agent: *\nDisallow: /private/*','/private/a'),false);
  assert.equal(robotsPermit('User-agent: *\nDisallow: /private/\nAllow: /private/public','/private/public'),true);
});
