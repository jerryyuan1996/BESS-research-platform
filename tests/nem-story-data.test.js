import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NEM_STORY_EVIDENCE as E } from '../src/markets/nem/data/storyEvidence.js';
import { NEM_STORY_VALUES as V } from '../src/markets/nem/data/storyEvidenceValues.js';
import { NEM_STORY_OBSERVED as O, NEM_STORY_OBSERVED_PROVENANCE as OP } from '../src/markets/nem/data/storyEvidenceObserved.js';

const SECTIONS = ['qed', 'cisa', 'register', 'history', 'teaching'];

test('every NEM evidence value carries a source, locator, unit, vintage, check date, arithmetic and rights', () => {
  const check = (p, path) => {
    assert.ok(p, `no provenance for ${path}`);
    assert.ok(E.sources[p.sourceRef], `${path}: unknown source ${p.sourceRef}`);
    for (const key of ['locator', 'unit', 'vintage', 'checkedOn', 'arithmetic', 'kind', 'rights']) assert.ok(p[key], `${path}.${key}`);
  };
  const visit = (v, path) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && !(path.startsWith('qed.') && path.split('.').length === 2)) for (const [k, x] of Object.entries(v)) visit(x, `${path}.${k}`);
    else check(E.provenance[path], path);
  };
  for (const section of SECTIONS) visit(E[section], section);
  for (const t of E.tenders) check(E.provenance[`tenders.${t.id}`], `tenders.${t.id}`);
  for (const key of ['nemSpreadAUDPerMWh', 'wemSpreadAUDPerMWh', 'reportText', 'regionalSpreadAUDPerMWh', 'timeOfDayPriceAUDPerMWh']) {
    assert.ok(O[key], key); assert.ok(E.sources[OP[key].sourceRef], key); assert.match(OP[key].rights, /Withheld/);
  }
  for (const s of Object.values(E.sources)) { assert.match(s.url, /^(https:\/\/|\/markets\/)/); assert.match(s.checkedOn, /^2026-1[01]-\d\d$/); }
});

test('Chart-NEM-SPREAD reconciles with the report text: $123 to $59 a year on, and $51 in the June quarter', () => {
  const at = q => O.quarters.indexOf(q);
  assert.deepEqual(O.quarters, V.qed.quarters);
  assert.equal(Math.round(O.nemSpreadAUDPerMWh[at('2025-Q3')]), O.reportText.nemSpreadYearBefore);
  assert.equal(Math.round(O.nemSpreadAUDPerMWh[at('2026-Q3')]), O.reportText.nemSpreadLatest);
  assert.equal(O.reportText.nemSpreadYearBefore, 123);
  assert.equal(O.reportText.nemSpreadLatest, 59);
  assert.equal(Math.round(O.nemSpreadAUDPerMWh[at('2026-Q2')]), O.reportText.q2Report.nemSpread);
  assert.equal(O.reportText.q2Report.nemSpread, 51);
  assert.equal(Math.round(O.wemSpreadAUDPerMWh[at('2025-Q3')]), O.reportText.wemSpreadYearBefore);
  assert.equal(Math.round(O.wemSpreadAUDPerMWh[at('2026-Q3')]), O.reportText.wemSpreadLatest);
  assert.deepEqual(V.qed.nemDischargeMW.map(Math.round), [86, 90, 98, 162, 215, 268, 359, 476, 680]);
  assert.deepEqual(O.nemSpreadAUDPerMWh.map(Math.round), [339, 243, 183, 342, 123, 104, 121, 51, 59]);
  assert.equal(O.timeOfDayPriceAUDPerMWh.q3_2026.length, 288);
  assert.equal(O.timeOfDayPriceAUDPerMWh.q3_2025.length, 288);
  assert.equal(O.regionalSpreadAUDPerMWh.latest.NSW1, 51);
  assert.equal(O.regionalSpreadAUDPerMWh.yearBefore.NSW1, 51 + 33);
});

test('no value is zero where the source is missing, and the register zero is a sourced count', () => {
  const zeros = [];
  const visit = (v, path) => {
    if (Array.isArray(v)) v.forEach((x, i) => visit(x, `${path}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) visit(x, `${path}.${k}`);
    else if (v === 0) zeros.push(path);
  };
  for (const section of [...SECTIONS, 'tenders']) visit(E[section], section);
  visit(O, 'observed');
  assert.deepEqual(zeros, ['register.batteryOperating']);
  assert.match(E.provenance['register.batteryOperating'].arithmetic, /Counted/);
  const t10 = E.tenders.find(t => t.id === 'tender-10');
  assert.equal(t10.status, 'assessing');
  for (const k of ['projects', 'mw', 'mwh']) assert.equal(t10[k], null);
  assert.equal(E.tenders.find(t => t.id === 'nsw-pilot').mwh, null);
  assert.equal(O.regionalSpreadAUDPerMWh.latest.TAS1, null);
});

test('the rights switch is off: price-derived fields are null and no runtime module imports the observed records', () => {
  assert.deepEqual([V.rights.status, V.rights.mode, V.rights.clearanceRef], ['rights-unresolved', 'example', null]);
  for (const k of ['nemSpreadAUDPerMWh', 'wemSpreadAUDPerMWh', 'regionalSpreadAUDPerMWh', 'timeOfDayPriceAUDPerMWh']) assert.equal(V.qed[k], null, k);
  const files = [];
  const walk = d => { for (const f of readdirSync(d)) { const p = `${d}/${f}`; if (statSync(p).isDirectory()) walk(p); else if (/\.(js|mjs)$/.test(f)) files.push(p); } };
  walk(fileURLToPath(new URL('../src', import.meta.url)));
  const nemImports = f => [...readFileSync(f, 'utf8').matchAll(/import[^'"]*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const inNem = f => /[\\/]src[\\/]markets[\\/]nem[\\/]/.test(f);
  const importers = files.filter(f => !/storyEvidence(Observed)?\.js$/.test(f)
    && nemImports(f).some(spec => /markets\/nem\/data\/storyEvidence(Observed)?\.js$/.test(spec)
      || (inNem(f) && /^\.\.?\/(data\/)?storyEvidence(Observed)?\.js$/.test(spec))));
  assert.deepEqual(importers, []);
  const shipped = readFileSync(new URL('../src/markets/nem/data/storyEvidenceProvenance.js', import.meta.url), 'utf8');
  assert.equal(/\$\d/.test(shipped), false, 'the shipped provenance quotes no price-derived value');
});
