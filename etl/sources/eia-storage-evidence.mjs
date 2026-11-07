/* Annual energy is an explicitly dated supplement. Coordinate/name matching
   never supplies identity here, and monthly nameplate MW is never replaced. */
import { eiaNumber } from './eia-860m.mjs';

export const SOURCE_ID = 'us-eia-860-annual-storage';
const keyOf = (plant, generator) => `${String(plant ?? '').trim()}:${String(generator ?? '').trim()}`;
const goodId = value => typeof value === 'string' && value.length > 0 && value.length <= 50 && !/[\x00-\x1f:]/.test(value);

export function buildStorageIndex(rows, plantRows, reportingYear){
  const byKey = new Map(), plants = new Map();
  let missingIds = 0;
  for (const row of rows){
    const plant = String(row.plant_code ?? '').trim(), generator = String(row.generator_id ?? '').trim();
    if (!goodId(plant) || !goodId(generator)){ missingIds++; continue; }
    const key = keyOf(plant,generator);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(row);
  }
  for (const row of plantRows){
    const id = String(row.plant_code ?? '').trim(); if (!goodId(id)) continue;
    if (!plants.has(id)) plants.set(id, []);
    plants.get(id).push(row);
  }
  return { byKey, plants, reportingYear, audit:{ missingIds, duplicateKeys:[...byKey.values()].filter(rows => rows.length > 1).length } };
}

export function attachStorageEvidence(projects, index, reportingPeriod){
  return projects.map(project => {
    const plant = project.sourceRef?.plantId, generator = project.sourceRef?.generatorId;
    const key = keyOf(plant,generator), year = index.reportingYear;
    const evidence = { sourceId:SOURCE_ID, reportingYear:year, sourceRecordId:key, match:'none', reason:null,
      annualNameplateMW:null, energyMWh:null, maximumChargeMW:null, maximumDischargeMW:null,
      durationHours:null, durationBasis:'annual nameplate MWh / annual maximum discharge MW', statusRaw:null };
    const fail = reason => ({ ...project, storageEvidence:{ ...evidence, reason } });
    if (!goodId(plant) || !goodId(generator)) return fail('missing-compound-id');
    const [periodYear,month] = String(reportingPeriod).split('-').map(Number);
    const lag = (periodYear - year) * 12 + month - 12;
    if (!Number.isInteger(year) || !Number.isInteger(month) || lag < 0) return fail('annual-vintage-incompatible');
    if (lag > 18) return fail('annual-vintage-too-old');
    const matches = index.byKey.get(key);
    if (!matches) return fail('annual-key-absent');
    if (matches.length !== 1) return fail('ambiguous-annual-key');
    const row = matches[0];
    if (String(row.prime_mover ?? '').trim() !== 'BA' || !/batter/i.test(String(row.technology ?? ''))) return fail('annual-technology-mismatch');
    const status = String(row.status ?? '').trim();
    const monthlyStatus = String(project.statusRaw).match(/\(([A-Z]+)\)/)?.[1];
    if (!['OP','SB'].includes(status) || status !== monthlyStatus) return fail('annual-status-mismatch');
    const plantMatches = index.plants.get(plant);
    if (!plantMatches || plantMatches.length !== 1) return fail('annual-plant-authority-ambiguous');
    if (project.sourceRef.state && String(row.state ?? '').trim() && project.sourceRef.state !== String(row.state).trim()) return fail('annual-state-mismatch');
    if (String(plantMatches[0].balancing_authority_code ?? '').trim() !== project.sourceRef.balancingAuthority) return fail('annual-authority-mismatch');
    const operatingYear = eiaNumber(row.operating_year), operatingMonth = eiaNumber(row.operating_month);
    if (operatingYear != null && (!Number.isInteger(operatingYear) || operatingYear > year)) return fail('annual-operating-year-invalid');
    if (project.sourceRef.operatingYear != null && operatingYear != null && project.sourceRef.operatingYear !== operatingYear) return fail('operating-date-mismatch');
    if (project.sourceRef.operatingMonth && operatingMonth && project.sourceRef.operatingMonth !== operatingMonth) return fail('operating-date-mismatch');
    const positive = value => { const n = eiaNumber(value); return n > 0 ? n : null; };
    evidence.match = 'exact-plant-generator'; evidence.statusRaw = status;
    evidence.annualNameplateMW = positive(row.nameplate_capacity);
    evidence.energyMWh = positive(row.nameplate_energy_capacity);
    evidence.maximumChargeMW = positive(row.maximum_charge_rate);
    evidence.maximumDischargeMW = positive(row.maximum_discharge_rate);
    evidence.durationHours = evidence.energyMWh != null && evidence.maximumDischargeMW != null ? evidence.energyMWh / evidence.maximumDischargeMW : null;
    evidence.reason = evidence.energyMWh == null ? 'annual-energy-missing' : evidence.maximumDischargeMW == null ? 'annual-discharge-missing' : null;
    return { ...project, sourceIds:[...new Set([...project.sourceIds,SOURCE_ID])], storageEvidence:evidence };
  });
}
