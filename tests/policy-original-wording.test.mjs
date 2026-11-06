import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarDatesInQuote,criticalValueInQuote} from '../policy/evidence-values.mjs';

test('the original English ordinal date in a formal commencement clause normalizes without inventing an instant',()=>{
  assert.deepEqual(calendarDatesInQuote('These Rules come into force on 17th July 2026.',{language:'en'}),['2026-07-17']);
  assert.deepEqual(calendarDatesInQuote('17nd July 2026',{language:'en'}),[]);
  assert.deepEqual(calendarDatesInQuote('17th July 2026',{language:'de'}),[]);
  assert.deepEqual(calendarDatesInQuote('31st February 2026',{language:'en'}),[]);
  assert.deepEqual(calendarDatesInQuote('Date of issue 2026.08.06',{language:'en'}),['2026-08-06']);
  assert.deepEqual(calendarDatesInQuote('2026.13.06',{language:'en'}),[]);
});
test('official legal wording is a representation check and still rejects explicit negation',()=>{
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'effective'},'These Rules come into force on 17th July 2026.'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'effective'},'These Rules have not yet come into force.'),false);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'The Commission has made a final determination\nand rule.'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'Market Rules made by the Minister for Energy.'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'We have decided to approve the methodology.'),true);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'Our minded-to decision to approve the methodology.'),false);
  assert.equal(criticalValueInQuote({kind:'legal_status',value:'adopted'},'A proposed determination is under consultation.'),false);
});
