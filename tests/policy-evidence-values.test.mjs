import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarDatesInQuote,criticalValueInQuote,isCalendarDate} from '../policy/evidence-values.mjs';
import {validatePolicySnapshot} from '../policy/schema.mjs';
import {fixture,CONTEXT} from './helpers/policy-fixture.mjs';
import {sourceDigest} from '../policy/integrity.mjs';

test('official date spellings normalize to a calendar day without inventing a UTC instant',()=>{
  assert.deepEqual(calendarDatesInQuote('3 June 2024 and 9. Dezember 2021'),['2024-06-03','2021-12-09']);
  assert.deepEqual(calendarDatesInQuote('April 15, 2025'),['2025-04-15']);
  assert.deepEqual(calendarDatesInQuote('3. M\u00e4rz 2025'),['2025-03-03']);
  assert.deepEqual(calendarDatesInQuote('03/06/2024 and 31 February 2025'),[]);
  assert.deepEqual(calendarDatesInQuote('18.09.2026'),[]);
  assert.deepEqual(calendarDatesInQuote('18.09.2026',{language:'de'}),['2026-09-18']);
  assert.deepEqual(calendarDatesInQuote('31.02.2026',{language:'de'}),[]);
  assert.deepEqual(calendarDatesInQuote('09/10/2026',{language:'de'}),[]);
  assert.equal(isCalendarDate('2025-02-29'),false);
  assert.equal(criticalValueInQuote({kind:'date',value:'2024-06-03'},'3 June 2024'),true);
  assert.equal(criticalValueInQuote({kind:'date',value:'2024-06-03T00:00:00Z'},'3 June 2024'),false);
});
test('state representation permits original German/English terms but refuses negation and number substrings',()=>{
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'consultation'},'Konsultation des Entwurfs'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'approved'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'not yet approved'),false);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'consultation'),false);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'withdrawn'},'zur\u00fcckgezogen'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'amended'},'ge\u00e4ndert'),true);
  assert.equal(criticalValueInQuote({kind:'number',value:10},'100 MW'),false);
  assert.equal(criticalValueInQuote({kind:'number',value:10},'10 MW'),true);
});
test('a source-backed calendar-day event validates without fabricated time or translated quotations',()=>{
  const snapshot=fixture();const body='Konsultation des Entwurfs. Issued 1 January 2025. Closes 2. Januar 2025.';
  snapshot.sources[0].language='de';snapshot.sources[0].contentHash=sourceDigest(body);snapshot.sources[0].issuedAt='2025-01-01';
  snapshot.events[0].publishedAt='2025-01-01';snapshot.events[0].consultationClosesAt='2025-01-02';
  snapshot.claims[0].evidence[0].quote='Konsultation des Entwurfs';
  snapshot.claims.push({...structuredClone(snapshot.claims[0]),id:'close-date',kind:'date',predicate:'consultation_closes_at',value:'2025-01-02',text:['Closes on 2025-01-02.','截止日为2025-01-02。'],evidence:[{source:'test-source',locator:'section 1',quote:'2. Januar 2025',supports:'date'}]});
  snapshot.events[0].claimIds.push('close-date');
  assert.deepEqual(validatePolicySnapshot(snapshot,{...CONTEXT,evidenceBodies:new Map([['test-source',body]])}),[]);
  snapshot.claims[1].value='2025-01-03';assert.ok(validatePolicySnapshot(snapshot,{...CONTEXT,evidenceBodies:new Map([['test-source',body]])}).length);
});
