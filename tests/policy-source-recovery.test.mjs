import {test} from 'node:test';
import assert from 'node:assert/strict';
import {discoverPolicies,validRobotsDocument} from '../policy/discovery.mjs';
import {migrateDiscoveryInventory,validateDiscoveryState,mergeDiscoveryJournal,metadataURLAllowed} from '../policy/discovery-journal.mjs';
import {POLICY_SOURCES} from '../policy/source-inventory.mjs';
const now='2026-11-12T12:00:00.000Z';
test('mislabeled plain robots rules are parsed; challenges and mixed HTML stay blocked',async()=>{
  const body='User-agent: *\nDisallow: /SiteGlobals';
  assert.equal(validRobotsDocument(body,'text/html;charset=utf-8'),true);
  for(const bad of ['Error','Access denied','<html>'+body+'</html>',body+'\n<script>bad</script>',body+'\nPlease enable cookies'])assert.equal(validRobotsDocument(bad,'text/html'),false);
  const source={...POLICY_SOURCES[0],url:'https://www.bundesnetzagentur.de/SiteGlobals/private',metadataScope:{...POLICY_SOURCES[0].metadataScope,pageURLs:['https://www.bundesnetzagentur.de/SiteGlobals/private']}};
  const calls=[];const r=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async url=>{calls.push(url);return new Response(body,{headers:{'content-type':'text/html'}});}});
  assert.equal(calls.length,1);assert.equal(r.records[0].status,'robots_denied');
});
test('a new relevant same-day review can resolve a stop without deleting its history',async()=>{
  const source=POLICY_SOURCES[0];
  const first=await discoverPolicies({sources:[source],now,sleep:async()=>{},fetcher:async()=>new Response('Error',{headers:{'content-type':'text/html'}})});
  const renewed={...source,metadataScope:{...source.metadataScope,reviewVersion:'explicit-new-review'}};
  const fetcher=async url=>new Response(url.endsWith('/robots.txt')?'User-agent: *\nDisallow: /SiteGlobals':'Official register',{headers:{'content-type':'text/html'}});
  const fixed=await discoverPolicies({sources:[renewed],now,previous:first.records,fetcher,sleep:async()=>{}});
  assert.equal(fixed.records[0].status,'changed');assert.equal(fixed.records[0].accessHistory[0].reason,'invalid_robots_document');assert.equal(fixed.records[0].stopReason,undefined);
  const repeated=await discoverPolicies({sources:[renewed],now,previous:fixed.records,fetcher:()=>{throw Error('unexpected');}});
  assert.equal(repeated.records[0].status,'same_cycle_retained');assert.deepEqual(repeated.records[0].accessHistory,fixed.records[0].accessHistory);
});
test('inventory upgrade requires the complete former report and preserves refused sources',async()=>{
  const old=POLICY_SOURCES.slice(0,4);
  const report={...await discoverPolicies({sources:old,now,killSwitch:true}),inventoryVersion:2};
  Object.assign(report.records[0],{status:'http_403',stopReason:'http_403',stopScopeVersion:'old',stoppedAt:now});
  const journal=mergeDiscoveryJournal({sources:old,now});
  const migrated=migrateDiscoveryInventory(report,journal,POLICY_SOURCES);
  const state=validateDiscoveryState(migrated,journal,POLICY_SOURCES);
  assert.equal(state.previous.length,8);assert.deepEqual(state.previous.slice(0,4),report.records);
  assert.throws(()=>migrateDiscoveryInventory({...report,records:report.records.slice(1)},journal,POLICY_SOURCES),/invalid_discovery_metadata/);
  assert.throws(()=>validateDiscoveryState({...migrated,records:migrated.records.slice(0,4)},journal,POLICY_SOURCES),/invalid_discovery_metadata/);
  assert.equal(POLICY_SOURCES.find(s=>s.id==='wa-wic').metadataScope,undefined);
  assert.equal(POLICY_SOURCES.find(s=>s.id==='nem-iess').metadataScope,undefined);
});
test('alternative scopes cannot fetch originals or unrelated documents',()=>{
  const nem=POLICY_SOURCES.find(s=>s.id==='nem-iess-aemo'),wa=POLICY_SOURCES.find(s=>s.id==='wa-wic-aemo');
  assert.equal(metadataURLAllowed(nem.url,nem),true);assert.equal(metadataURLAllowed(wa.url,wa),true);
  assert.equal(metadataURLAllowed('https://www.aemc.gov.au/rule-changes/integrating-energy-storage-systems-nem',nem),false);
  assert.equal(metadataURLAllowed('https://www.aemo.com.au/consultations/unrelated',wa),false);
  assert.equal(metadataURLAllowed('https://www.aemo.com.au/-/media/files/stakeholder_consultation/consultations/wa_wem_consultation_documents/2025/aepc_2025_21/aepc_2025_21-procedure-change-report.pdf',wa),true);
});
