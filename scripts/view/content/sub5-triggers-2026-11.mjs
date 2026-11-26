import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createViewStore } from '../writer.mjs';

const events = [
  {
    id:'nem-exemption-guide-draft', market:'nem', expected:'2026-12',
    watches:['revenueCertainty','policyStability'],
    label:['AEMO registration exemption guide draft','AEMO 注册豁免指南草案'],
    note:['Read the draft expected on 18 December, then the final report. Check the proposed battery threshold before revising the small route.',
      '查阅预计 12 月 18 日发布的草案，并跟进最终报告。核实拟议的储能门槛后再调整小型项目范围。'],
    source:{publisher:'AEMO',url:'https://www.aemo.com.au/consultations/current-and-closed-consultations/guide-to-registration-exemptions-and-production-unit-classifications',access:'opened'},
  },
  {
    id:'nem-storage-tariffs-fy28', market:'nem', expected:'2027-07', watches:['assetReturn'],
    label:['FY2027–28 distribution storage tariffs','2027–28 财年配网储能费率'],
    note:['Check the new price lists effective 1 July at the six reference distributors and recalculate dispatch against eligible tariff windows.',
      '核实六家样本配网商于 7 月 1 日生效的新价表，并按适用的费率时段重算充放电。'],
    source:{publisher:'Australian Energy Regulator',url:'https://www.aer.gov.au/industry/networks/pricing-proposals',access:'opened'},
  },
  {
    id:'caiso-rule21-screen-q', market:'caiso', expected:null, watches:['revenueCertainty'],
    label:['CPUC Rule 21 Screen Q decision','加州公用事业委员会 Rule 21 Screen Q 决定'],
    note:['Review the commission’s decision in R.25-08-004 for any change to the distribution review threshold for wholesale exports.',
      '跟进 R.25-08-004 程序的裁定，核查批发送电项目的配网审查门槛有无调整。'],
    source:{publisher:'CPUC',url:'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/rule-21-interconnection/rulemaking-and-regulatory-history',access:'opened'},
  },
];

export async function smallConnectionChanges(store) {
  const changes = [];
  for (const event of events) {
    const view = await store.read(event.market);
    const trigger = { ...event, kind:'event', direction:'either', effect:null };
    const existing = view.triggers.find(t => t.id === event.id);
    if (existing) {
      if (!Object.entries(trigger).every(([key,value]) => isDeepStrictEqual(existing[key],value)))
        throw new Error('Existing trigger differs: ' + event.id);
      continue;
    }
    changes.push({market:event.market,path:'triggers.'+event.id,author:{kind:'analyst'},
      reason:event.note,to:trigger});
  }
  return changes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2];
  if (!['--check','--apply'].includes(mode)) throw new Error('Choose --check or --apply');
  const store = createViewStore();
  const changes = await smallConnectionChanges(store);
  if (changes.length) {
    if (mode === '--apply') await store.applyBatch(changes,new Date());
    else await store.prepareBatch(changes,new Date());
  }
  console.log(changes.length + (mode === '--apply' ? ' events applied.' : ' proposed events pass validation.'));
}
