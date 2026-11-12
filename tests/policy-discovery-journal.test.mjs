import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverPolicies } from '../policy/discovery.mjs';
import { documentLinkObservations,mergeDiscoveryJournal,metadataURLAllowed,JOURNAL_LIMITS,validateJournal,validateDiscoveryState } from '../policy/discovery-journal.mjs';
import { POLICY_SOURCES } from '../policy/source-inventory.mjs';
const source={id:'test',officialId:'TEST',jurisdiction:'TEST',markets:[],host:'official.example',url:'https://official.example/register',metadataScope:{reviewed:true,pageURLs:['https://official.example/register'],paths:['/register'],pdfDirectories:['/documents/']}};
const now='2026-11-10T06:17:00.000Z';
const document={url:source.url,contentHash:'sha256:'+'a'.repeat(64),observedAt:now};
const parse=body=>documentLinkObservations({source,document,body});
const entry=parse('<a href="/documents/one.pdf">Original &amp; title</a>').records[0];
const merge=(overrides={})=>mergeDiscoveryJournal({sources:[source],now,observations:[entry],...overrides});

test('only bounded approved original link metadata is kept; attachments are not requested',()=>{
  const result=parse('<script><a href="/documents/evil.pdf">fake</a></script><a href="/documents/one.pdf#page=2">Original &amp; title</a><a href="/documents/one.pdf">duplicate</a><a href="https://elsewhere.example/doc.pdf">outside</a><a href="/documents/one.html">non-pdf</a><a href="/other/two.pdf">outside path</a><a href="javascript:alert(1)">script</a>');
  assert.equal(result.records.length,1);assert.equal(result.records[0].title,'Original & title');assert.equal(result.records[0].url,'https://official.example/documents/one.pdf');
  assert.equal(entry.publishedAt,null);assert.equal(entry.effectiveAt,null);assert.equal(entry.firstObservedAt,now);assert.equal(entry.sourcePageHash,document.contentHash);
  assert.equal(metadataURLAllowed('https://official.example/documents-other/one.pdf',source),false);
  assert.equal(metadataURLAllowed('https://official.example/documents/../other/one.pdf',source),false);
  assert.equal(metadataURLAllowed('https://official.example/documents/%2e%2e%2fother/one.pdf',source),false);
});

test('fragment and all registered source-page links are excluded even with queries',()=>{
  const scoped={...source,metadataScope:{...source.metadataScope,pageURLs:[source.url,'https://official.example/canonical'],paths:['/register','/canonical']}};
  const result=documentLinkObservations({source:scoped,document,body:'<a href="#main">Skip to main content</a><a href="/register?view=print#main">Navigation</a><a href="https://official.example/canonical?variant=1">Inhalt</a><a href="/documents/one.pdf">Original document</a>'});
  assert.equal(result.records.length,1);assert.equal(result.records[0].url,entry.url);assert.equal(result.overflow,0);
});

test('legacy journal cleanup removes only definite source navigation and preserves first observations',()=>{
  const previous=merge();
  previous.records.push({...entry,url:source.url+'?view=print',title:'Skip to main content'});
  const original=structuredClone(previous);
  const cleaned=merge({previous,observations:[]});
  assert.equal(cleaned.prunedNavigation,1);assert.equal(cleaned.added,0);assert.equal(cleaned.baseline,'restored');
  assert.deepEqual(cleaned.records,[entry]);assert.deepEqual(previous,original);
  const repeated=merge({previous:cleaned,observations:[]});
  assert.equal(repeated.prunedNavigation,0);assert.deepEqual(repeated.records,[entry]);
  const wrapperSource={...source,metadataScope:{...source.metadataScope,directories:['/documents/']}};
  const wrapper={...entry,url:'https://official.example/documents/wrapper.html',title:'Document download page'};
  const wrappers=mergeDiscoveryJournal({sources:[wrapperSource],now,observations:[wrapper]});
  assert.deepEqual(wrappers.records,[wrapper]);
});

test('rechecks and failures preserve first observation and history; 90-day retention and capacity are explicit',()=>{
  const first=merge();const next='2026-11-11T06:17:00.000Z';
  assert.equal(first.baseline,'initial_seed');
  const updated=merge({previous:first,now:next,observations:[{...entry,title:'Revised link',firstObservedAt:next,lastObservedAt:next}]});
  assert.equal(updated.records[0].firstObservedAt,now);assert.equal(updated.records[0].lastObservedAt,next);assert.equal(updated.added,0);
  const failed=merge({previous:updated,now:next,observations:[]});assert.deepEqual(failed.records,updated.records);assert.equal(failed.historyComplete,false);
  assert.equal(merge({previous:first,now:'2027-02-10T06:17:00.000Z',observations:[]}).records.length,0);
  const bounded=mergeDiscoveryJournal({sources:[source],now,observations:[entry,{...entry,url:'https://official.example/documents/two.pdf'}]}, {...JOURNAL_LIMITS,records:1});
  assert.equal(bounded.records.length,1);assert.equal(bounded.overflow,1);assert.equal(bounded.historyComplete,false);
});

test('cached robots rules gate each approved redirect target before GET and preserve denials across days',async()=>{
  const redirected={...source,metadataScope:{...source.metadataScope,pageURLs:[source.url,'https://official.example/target']}};
  for(const deny of [true,false]){
    const calls=[];
    const result=await discoverPolicies({sources:[redirected],now,sleep:async()=>{},fetcher:async url=>{
      calls.push(url);
      if(url.endsWith('/robots.txt')){
        // A second robots request would be a denial. It must never be made.
        if(calls.filter(x=>x.endsWith('/robots.txt')).length>1)return new Response('',{status:403});
        return new Response('User-agent: *\n'+(deny?'Disallow: /target':'Allow: /'),{headers:{'content-type':'text/plain'}});
      }
      if(url===source.url)return new Response('',{status:302,headers:{location:'/target'}});
      return new Response('Reviewed target',{headers:{'content-type':'text/html'}});
    }});
    assert.deepEqual(calls,deny?['https://official.example/robots.txt',source.url]:['https://official.example/robots.txt',source.url,'https://official.example/target']);
    assert.equal(result.records[0].status,deny?'robots_denied':'changed');
    if(deny){
      assert.equal(result.records[0].stopReason,'robots_denied');
      let laterCalls=0;
      const later=await discoverPolicies({sources:[redirected],now:'2026-11-11T06:17:00.000Z',previous:result.records,fetcher:async()=>{laterCalls++;throw new Error('must_not_fetch');}});
      assert.equal(laterCalls,0);assert.equal(later.records[0].status,'blocked_after_denial');
    }
  }
});

test('robots HTTP 200 HTML error documents never become allow-all rules',async()=>{
  for(const [type,body] of [['text/html','Error'],['text/plain','<!doctype html><html><body>Error</body></html>']]){
    const calls=[];
    const result=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async url=>{calls.push(url);return new Response(body,{headers:{'content-type':type}});}});
    assert.deepEqual(calls,['https://official.example/robots.txt']);assert.equal(result.records[0].status,'invalid_robots_document');assert.equal(result.records[0].stopReason,'invalid_robots_document');
  }
});

test('empty, incomplete, duplicate or missing reports fail before collection even with a valid journal',async()=>{
  const report=await discoverPolicies({sources:POLICY_SOURCES,now,killSwitch:true});
  const journal=mergeDiscoveryJournal({sources:POLICY_SOURCES,now});
  let calls=0;
  for(const bad of [null,{...report,records:[]},{...report,records:report.records.slice(1)},{...report,records:report.records.map(()=>report.records[0])}]){
    await assert.rejects(async()=>{
      const state=validateDiscoveryState(bad,journal,POLICY_SOURCES);
      await discoverPolicies({sources:POLICY_SOURCES,now,...state,fetcher:async()=>{calls++;throw new Error('must_not_fetch');}});
    },/invalid_discovery_metadata/);
  }
  assert.equal(calls,0);
  const initial={...report,records:report.records.map(r=>({...r,status:'pending_source_review'}))};
  assert.equal(validateDiscoveryState(initial,null,POLICY_SOURCES).priorJournal,null);
  assert.equal(validateDiscoveryState(report,journal,POLICY_SOURCES).previous.length,POLICY_SOURCES.length);
});

test('malformed or out-of-scope restored metadata fails closed',()=>{
  for(const patch of [{url:'https://outside.example/a.pdf'},{sourcePageURL:'https://official.example/documents/one.pdf'},{title:'<script>bad</script>'},{title:'bad\u0001text'},{publishedAt:now},{firstObservedAt:'2027-01-01T00:00:00.000Z'},{body:'must never be stored'}]){
    const journal=merge();Object.assign(journal.records[0],patch);assert.throws(()=>validateJournal(journal,[source]),/invalid_discovery_journal/);
  }
});

test('metadata discovery is independent of broad rights/AI flags and never follows attachments',async()=>{
  const calls=[];const observations=[];
  const result=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async url=>{
    calls.push(url);return url.endsWith('/robots.txt')?new Response('',{status:404}):new Response('<a href="/documents/one.pdf">Original title</a>',{headers:{'content-type':'text/html'}});
  },onDocument:payload=>observations.push(...documentLinkObservations(payload).records)});
  assert.equal(result.changed,1);assert.equal(observations.length,1);assert.deepEqual(calls,['https://official.example/robots.txt',source.url]);
  const repeated=await discoverPolicies({sources:[source],now,previous:result.records,fetcher:()=>{throw new Error('must_not_fetch');}});
  assert.equal(repeated.records[0].status,'same_cycle_retained');
});

test('denials and unknown redirects are not retried; transient 503 stays bounded',async()=>{
  for(const status of [401,403,429,503]){
    let pages=0;const result=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async url=>url.endsWith('/robots.txt')?new Response('',{status:404}):(pages++,new Response('',{status}))});
    assert.equal(pages,status===503?3:1);assert.equal(result.records[0].status,`http_${status}`);
  }
  for(const location of ['/not-reviewed','/robots.txt','/register?utm_source=unapproved']){
    const calls=[];const result=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async url=>{
      calls.push(url);return url.endsWith('/robots.txt')?new Response('',{status:404}):new Response('',{status:302,headers:{location}});
    }});
    assert.deepEqual(calls,['https://official.example/robots.txt',source.url]);assert.equal(result.records[0].status,'unreviewed_redirect_path');
  }
});

test('actual active scopes do not allow attachment downloads or cross-host/path collection',()=>{
  const [de,gb,nem,wa]=POLICY_SOURCES;
  assert.equal(metadataURLAllowed('https://www.ofgem.gov.uk/sites/default/files/a.pdf',gb),true);
  assert.equal(metadataURLAllowed('https://assets.ofgem.gov.uk/sites/default/files/a.pdf',gb),false);
  assert.equal(metadataURLAllowed('https://www.ofgem.gov.uk/sites/default/files/a.html',gb),false);
  assert.equal(metadataURLAllowed('https://www.bundesnetzagentur.de/DE/Beschlusskammern/GBK/Ebene1_Rahmen/Other/start.html',de),false);
  assert.equal(nem.metadataScope,undefined);assert.equal(wa.metadataScope,undefined);
});

test('access refusal persists across days and disabled cycles until a new reviewed scope version',async()=>{
  for(const failure of ['http_401','http_403','http_429','robots_denied']){
    const fetcher=async url=>failure==='robots_denied'?new Response('User-agent: *\nDisallow: /',{headers:{'content-type':'text/plain'}}):url.endsWith('/robots.txt')?new Response('',{status:404}):new Response('',{status:Number(failure.slice(5))});
    const first=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher});
    assert.equal(first.records[0].stopReason,failure);
    const blocked=await discoverPolicies({sources:[source],now:'2026-11-11T06:17:00.000Z',previous:first.records,fetcher:()=>{throw new Error('must_not_fetch');}});
    assert.equal(blocked.records[0].status,'blocked_after_denial');assert.equal(blocked.records[0].stopReason,failure);
    const disabled=await discoverPolicies({sources:[source],now:'2026-11-12T06:17:00.000Z',previous:blocked.records,killSwitch:true});
    assert.equal(disabled.records[0].stopReason,failure);
    let calls=0;
    await discoverPolicies({sources:[{...source,metadataScope:{...source.metadataScope,reviewVersion:'new-explicit-review'}}],now:'2026-11-13T06:17:00.000Z',previous:disabled.records,sleep:async()=>{},fetcher:async()=>{calls++;return new Response('',{status:403});}});
    assert.equal(calls,1);
  }
});
