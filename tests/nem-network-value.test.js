import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_TARIFFS } from '../src/markets/nem/data/storageTariffs.js';
import { completeTariffDays, deriveNetworkValue, signedNetworkPerMWYear } from '../src/derive/networkValue.js';

const tariff = id => STORAGE_TARIFFS.find(t=>t.id === id);
const options = { powerMW:4.5, durationHours:4 };
function series(start, count) {
  return Array.from({length:288*count}, (_,i) => {
    const h=Math.floor(i % 288 / 12);
    return {t:new Date(Date.parse(start)+i*300_000).toISOString(),v:h<5?40:h>=18&&h<22?100:70};
  });
}
const close = (a,b) => assert.ok(Math.abs(a-b)<0.000001, `${a} differs from ${b}`);

test('six FY27 network schedules carry source, date, page and units', () => {
  assert.equal(new Set(STORAGE_TARIFFS.map(t=>t.distributor)).size,6);
  for (const t of STORAGE_TARIFFS) {
    assert.match(t.source,/^https:\/\//);
    assert.ok(t.page && t.readOn && t.code);
    assert.equal(t.financialYear,'2026-27');
    assert.equal(t.energyUnit,'c/kWh');
    assert.equal(t.fixedUnit,'AUD/site/day');
    if(t.demand) assert.ok(t.demand.unit);
  }
});

test('replay allocates physical charge energy and separates merchant, energy and site charges', () => {
  const d=completeTariffDays(series('2026-08-01T00:00:00+10:00',31),'Australia/Brisbane');
  assert.equal(deriveNetworkValue(d.slice(0,27),tariff('energex'),options),null);
  const q=deriveNetworkValue(d,tariff('energex'),options);
  close(q.merchantPerMWYear,4*(100-40/.85)*365*.97*.70);
  close(signedNetworkPerMWYear(q),-74.237*365/4.5);
  const nsw=deriveNetworkValue(d,tariff('essential'),options);
  close(nsw.demandPerMWYearAtUnity,1000*3.8099*12);
  assert.equal(signedNetworkPerMWYear(nsw),null);
  close(signedNetworkPerMWYear(nsw,.95), -27.4319*365/4.5-1000*3.8099*12/.95);
  assert.equal(deriveNetworkValue(d,tariff('ausgrid'),options).status,'event-calendar');
  assert.equal(deriveNetworkValue(d,tariff('powercor'),options).demandPerMWYearAtUnity,null);
  const calendar={from:d[0].date,to:d.at(-1).date,starts:[]};
  const ordinary=deriveNetworkValue(d,tariff('ausgrid'),{...options,eventCalendar:calendar});
  close(ordinary.variableNetworkPerMWYear,-19.792*4/.85*365*.97);
});

test('local billing uses complete short and long daylight-saving days and detects duplicate positions', () => {
  const spring=series('2026-10-03T00:00:00+10:00',4);
  const local=() =>completeTariffDays(spring,'Australia/Sydney');
  assert.equal(local().find(d=>d.date==='2026-10-04').points.length,276);
  spring.push(spring[24]);
  assert.ok(!local().some(d=>d.date==='2026-10-03'));
  const autumn=completeTariffDays(series('2026-04-04T00:00:00+11:00',4),'Australia/Sydney');
  assert.equal(autumn.find(d=>d.date==='2026-04-05').points.length,300);
});

test('annual demand ratchets retain kW and kVA units and the full local history', () => {
  const input = series('2025-07-01T00:00:00+10:00',365);
  const days = completeTariffDays(input,'Australia/Brisbane');
  const powercor = deriveNetworkValue(days,tariff('powercor'),options);
  assert.equal(powercor.billing,'latest-rolling-annual-rate');
  close(powercor.demandPerMWYearAtUnity,1000*1.25*12);
  close(signedNetworkPerMWYear(powercor),-15000);
  // One cheap 30-minute import during each non-CBD summer evening. All
  // other peak slots have no import, so the highest four-hour mean is 125 kW/MW.
  const eveningDays = days.map(d => ({...d, points:d.points.map(p=>({...p,v: p.hour===17 && p.minute<30 ? -100 : p.v}))}));
  const sa = deriveNetworkValue(eveningDays,tariff('sapn'),options);
  close(sa.demandPerMWYearAtUnity,(125*0.2696+1000*0.0849)*365);
  assert.equal(signedNetworkPerMWYear(sa),null);
  close(signedNetworkPerMWYear(sa,0.95),-sa.demandPerMWYearAtUnity/0.95);
  assert.equal(deriveNetworkValue(days.slice(1),tariff('powercor'),options).demandPerMWYearAtUnity,null);
});

test('Endeavour charges a monthly half-hour maximum and excludes a gazetted weekday holiday', () => {
  const dates = completeTariffDays(series('2026-04-01T00:00:00+10:00',30),'Australia/Brisbane');
  const adjusted = day => dates.map(d=>({...d,points:d.points.map(p=>({...p,v:d.date===day&&p.hour===16&&p.minute===0?-1000:p.v}))}));
  const holiday=deriveNetworkValue(adjusted('2026-04-27'),tariff('endeavour'),options);
  const working=deriveNetworkValue(adjusted('2026-04-28'),tariff('endeavour'),options);
  close(holiday.demandPerMWYearAtUnity,0);
  close(working.demandPerMWYearAtUnity,(1000/6)*0.414*30*12);
});
