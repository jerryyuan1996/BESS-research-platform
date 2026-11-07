/* Shared ETL/browser contract. No workbook parser, filesystem or investment
   model is reachable from here. Monthly and annual observations stay distinct. */
import { energyMWh, isPlottable } from './projectValues.js';
import { validateProjects } from './projectValidation.js';

export const EIA_DATASET_ID = 'us-eia-storage-projects';
export const EIA_MARKETS = { pjm:'PJM', ercot:'ERCO', caiso:'CISO' };
export const EIA_MAX_PROJECTS = 5000;
export const EIA_MAX_REVISIONS = 240;
const positive = value => Number.isFinite(value) && value > 0;
const monthPattern = /^20\d{2}-(0[1-9]|1[0-2])$/;
const hashPattern = /^[a-f0-9]{64}$/;
const checksumPattern = /^sha256:[a-f0-9]{64}$/;
const datePattern = /^20\d{2}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const rounded = n => Math.round(n * 1e6) / 1e6;

export function inventoryCoverage(projects){
  const result = {};
  for (const market of Object.keys(EIA_MARKETS)){
    const rows = projects.filter(p => p.marketId === market);
    const annual = rows.filter(p => p.storageEvidence?.match === 'exact-plant-generator');
    const energy = rows.filter(p => energyMWh(p) != null);
    const reasons = {};
    for (const p of rows) if (p.storageEvidence?.reason) reasons[p.storageEvidence.reason] = (reasons[p.storageEvidence.reason] || 0) + 1;
    result[market] = {
      units:rows.length, operating:rows.filter(p => p.stage === 'operating').length,
      underConstruction:rows.filter(p => p.stage === 'under_construction').length,
      nameplateMW:rounded(rows.reduce((n,p) => n+p.capacityMW,0)),
      monthlyEnergyKnown:energy.length, monthlyEnergyMissing:rows.length-energy.length,
      monthlyKnownEnergyMWh:rounded(energy.reduce((n,p) => n+energyMWh(p),0)),
      located:rows.filter(isPlottable).length,
      monthlyLocations:rows.filter(p => p.coordinateEvidence?.basis === 'monthly-reported').length,
      annualExactLocations:rows.filter(p => p.coordinateEvidence?.basis === 'annual-plant-code').length,
      annualNameStateLocations:rows.filter(p => p.coordinateEvidence?.basis === 'annual-name-state').length,
      annualIdentityMatched:annual.length, annualIdentityUnmatched:rows.length-annual.length,
      annualEnergyKnown:annual.filter(p => positive(p.storageEvidence.energyMWh)).length,
      annualDischargeHoursKnown:annual.filter(p => positive(p.storageEvidence.durationHours)).length,
      annualPowerDiffersFromMonthly:annual.filter(p => p.storageEvidence.maximumDischargeMW != null && Math.abs(p.capacityMW-p.storageEvidence.maximumDischargeMW)>1e-8).length,
      annualEnergyDiffersFromMonthly:annual.filter(p => p.energyObservation && p.storageEvidence.energyMWh != null && Math.abs(p.energyObservation.value-p.storageEvidence.energyMWh)>1e-8).length,
      annualUnmatchedReasons:Object.fromEntries(Object.entries(reasons).sort(([a],[b])=>a.localeCompare(b))),
    };
  }
  return result;
}

export function isOfficialEiaURL(value, kind){
  try {
    const url = new URL(value);
    const path = kind === 'monthly'
      ? /^\/electricity\/data\/eia860m\/xls\/(january|february|march|april|may|june|july|august|september|october|november|december)_generator20\d{2}\.xlsx$/
      : /^\/electricity\/data\/eia860\/xls\/eia86020\d{2}\.zip$/;
    return url.origin === 'https://www.eia.gov' && !url.username && !url.password && !url.search && !url.hash && path.test(url.pathname);
  } catch { return false; }
}

export function validateEiaInventory(snapshot){
  const errors = [], fail = message => errors.push(message);
  if (snapshot?.datasetId !== EIA_DATASET_ID || snapshot.schemaVersion !== 1 || snapshot.authority !== 'observed') fail('inventory identity/schema/authority');
  if (snapshot?.marketId !== null || snapshot?.source?.name !== 'U.S. Energy Information Administration') fail('inventory publisher/scope');
  const units = snapshot?.units;
  if (!units || Object.keys(units).sort().join(',') !== 'duration,energy,power' || units.power !== 'MW' || units.energy !== 'MWh' || units.duration !== 'h') fail('inventory units');
  const inventory = snapshot?.derived?.inventory, sources = inventory?.sources;
  const monthly = sources?.monthly, annual = sources?.annual;
  if (!monthPattern.test(monthly?.period || '') || !datePattern.test(monthly?.publishedAt || '') || !isOfficialEiaURL(monthly?.url,'monthly') || !hashPattern.test(monthly?.sha256 || '')) fail('monthly source/version');
  if (!Number.isInteger(annual?.reportingYear) || !isOfficialEiaURL(annual?.url,'annual') || !hashPattern.test(annual?.sha256 || '') || !hashPattern.test(annual?.storage?.sha256 || '') || !hashPattern.test(annual?.plant?.sha256 || '')) fail('annual source/version');
  const rows = snapshot?.series;
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > EIA_MAX_PROJECTS) return [...errors,'inventory record limit/empty'];
  if (rows.some(p=>!p || typeof p!=='object' || Array.isArray(p))) return [...errors,'malformed inventory record'];
  errors.push(...validateProjects(rows));
  const keys = new Set(); let lastId = '';
  const nullFields = ['annualNameplateMW','energyMWh','maximumChargeMW','maximumDischargeMW','durationHours'];
  for (const p of rows){
    const prefix = 'project '+String(p.id)+': ', bad = message => fail(prefix+message);
    const ref = p.sourceRef, key = `${ref?.plantId}:${ref?.generatorId}`;
    if (!EIA_MARKETS[p.marketId] || ref?.balancingAuthority !== EIA_MARKETS[p.marketId]) bad('authority/market mismatch');
    if (!/^\d+$/.test(ref?.plantId || '') || typeof ref?.generatorId !== 'string' || !ref.generatorId || ref.generatorId.length > 50 || /[\x00-\x1f:]/.test(ref.generatorId)) bad('compound ID');
    if (p.id !== `${p.marketId}-eia-${slug(ref?.plantId)}-${slug(ref?.generatorId)}` || keys.has(key) || String(p.id)<=lastId) bad('duplicate/colliding/unordered ID');
    keys.add(key); lastId = p.id;
    if (p.technology !== 'storage' || !['operating','under_construction'].includes(p.stage) || p.durationHours !== null || p.capacityMW > 1e6) bad('technology/stage/monthly power');
    const monthlyCode=String(p.statusRaw).match(/\(([A-Z]+)\)/)?.[1];
    if(ref?.primeMover!=='BA' || ({OP:'operating',SB:'operating',V:'under_construction',U:'under_construction',TS:'under_construction'})[monthlyCode]!==p.stage) bad('monthly technology/status mapping');
    if (p.inventoryPeriod !== monthly?.period || (p.energyObservation && p.energyObservation.reportingPeriod !== monthly?.period)) bad('monthly period');
    if (p.provenance?.sourceRecordId !== key || p.provenance?.publishedAt !== monthly?.publishedAt) bad('monthly provenance');
    if (p.energyObservation?.value > 1e9) bad('monthly energy limit');
    const coord = p.coordinateEvidence;
    if (!coord || !['monthly-reported','annual-plant-code','annual-name-state','missing'].includes(coord.basis)) bad('coordinate provenance');
    if (coord?.basis === 'monthly-reported' && (coord.sourceId !== 'us-eia-860m' || coord.reportingPeriod !== monthly?.period || !isPlottable(p))) bad('monthly coordinate provenance');
    if (typeof coord?.basis==='string' && coord.basis.startsWith('annual-') && (coord.sourceId !== 'us-eia-860-annual' || coord.reportingYear !== annual?.reportingYear || !isPlottable(p))) bad('annual coordinate provenance');
    const evidence = p.storageEvidence;
    if (!evidence || evidence.sourceId !== 'us-eia-860-annual-storage' || evidence.sourceRecordId !== key || evidence.reportingYear !== annual?.reportingYear) { bad('annual provenance'); continue; }
    if (evidence.match === 'none'){
      if (!evidence.reason || nullFields.some(k => evidence[k] !== null)) bad('unmatched annual values must remain null');
    } else if (evidence.match === 'exact-plant-generator'){
      const [y,m] = String(monthly?.period).split('-').map(Number), lag=(y-evidence.reportingYear)*12+m-12;
      if (lag<0 || lag>18 || !['OP','SB'].includes(evidence.statusRaw) || evidence.statusRaw !== String(p.statusRaw).match(/\(([A-Z]+)\)/)?.[1]) bad('annual status/vintage');
      if (nullFields.some(k => evidence[k] !== null && (!positive(evidence[k]) || evidence[k] > 1e9))) bad('annual quantities');
      const expected = evidence.energyMWh != null && evidence.maximumDischargeMW != null ? evidence.energyMWh/evidence.maximumDischargeMW : null;
      if (expected === null ? evidence.durationHours !== null : !positive(evidence.durationHours) || Math.abs(evidence.durationHours-expected)>1e-10*Math.max(1,expected)) bad('annual MWh/discharge MW duration identity');
      if (evidence.durationBasis !== 'annual nameplate MWh / annual maximum discharge MW') bad('annual denominator');
    } else bad('annual match type');
  }
  for (const market of Object.keys(EIA_MARKETS)) if (!rows.some(p=>p.marketId===market)) fail('inventory missing market '+market);
  const expectedCoverage = inventoryCoverage(rows);
  if (JSON.stringify(inventory?.markets) !== JSON.stringify(expectedCoverage)) fail('inventory coverage audit');
  const month = monthly?.period || '', year = Number(month.slice(0,4)), number=Number(month.slice(5));
  const lastDay = new Date(Date.UTC(year,number,0)).getUTCDate();
  if (snapshot.coverage?.points !== rows.length || snapshot.coverage?.resolution !== 'monthly-generator-inventory' || snapshot.coverage?.from !== month+'-01' || snapshot.coverage?.to !== month+'-'+String(lastDay).padStart(2,'0')) fail('inventory period coverage');
  const revisions = inventory?.revisions;
  if (!Array.isArray(revisions) || revisions.length < 1 || revisions.length > EIA_MAX_REVISIONS) fail('inventory revision ledger');
  else revisions.forEach((r,i)=>{
    if (!r || typeof r!=='object'){ fail('inventory revision entry'); return; }
    if (r.sequence !== i+1 || !checksumPattern.test(r.contentId || '') || !checksumPattern.test(r.observationsChecksum || '') || !datePattern.test(String(r.observedAt).slice(0,10)) || !monthPattern.test(r.period || '') || !Number.isInteger(r.annualYear) || !hashPattern.test(r.monthlySha256 || '') || !hashPattern.test(r.annualSha256 || '')) fail('inventory revision entry');
    if (!Array.isArray(r.changes?.added) || !Array.isArray(r.changes?.removed) || !Array.isArray(r.changes?.changed)) fail('inventory revision differences');
  });
  const latest=revisions?.at?.(-1);
  if(latest && (latest.period!==monthly?.period || latest.annualYear!==annual?.reportingYear || latest.monthlySha256!==monthly?.sha256 || latest.annualSha256!==annual?.sha256 || latest.observedAt!==snapshot.fetchedAt)) fail('current revision/source mismatch');
  return errors;
}
