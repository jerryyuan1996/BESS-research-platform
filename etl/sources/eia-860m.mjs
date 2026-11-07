/* ---------------------------------------------------------------------------
   EIA-860M — Preliminary Monthly Electric Generator Inventory.

   One dataset, three markets: PJM, ERCOT and CAISO are separated by balancing
   authority code rather than by state, because ERCOT is not Texas and CAISO is
   not California — both cover most of their state and neither covers all of it.

   Statutory monthly filing, so coverage is a legal obligation rather than a
   survey response, and it is US Government work in the public domain.

   Current monthly releases also carry nameplate MWh and coordinates (verified
   on September 2026 bytes). The legacy transform remains nullable by default;
   the governed inventory explicitly opts into these dated observations.
   Annual charge/discharge MW and discharge hours remain a separate supplement,
   never a duration multiplied by monthly nameplate MW.

   EIA's own warning is worth repeating: monthly capacities are restated
   retroactively and are less reliable than the annual form. This is a pipeline
   register, not an accounting source.
   --------------------------------------------------------------------------- */
import { readSheets, num, isoDate, requireColumns } from '../lib/workbook.mjs';
import { provenance, AUTHORITY } from '../lib/provenance.mjs';
import { PROJECT_STAGE, PROJECT_TECHNOLOGY } from '../../src/projects/schema.js';

export const SOURCE_ID = 'us-eia-860m';

export const LICENCE = {
  id: 'us-gov-public-domain',
  name: 'US Government work — public domain',
  attribution: 'U.S. Energy Information Administration, Form EIA-860M',
  url: 'https://www.eia.gov/electricity/data/eia860m/',
  shareAlike: false,
};

/** Balancing authority code per allocation market. */
export const MARKET_BA = { pjm:'PJM', ercot:'ERCO', caiso:'CISO' };

/* Prime mover BA is battery storage. EIA also uses "Batteries" in the technology
   column, and both are checked: the prime mover is the stable machine-readable
   field and the technology string is the human-readable one that occasionally
   carries a unit the prime mover does not. */
const BATTERY_PRIME_MOVER = 'BA';
const BATTERY_TECHNOLOGY = /batter/i;

/* EIA writes status as "(OP) Operating", "(V) Under construction" and so on.
   Only the two the platform maps are carried; everything else — permitted,
   planned, cancelled — is a queue entry and a queue is not a pipeline. */
const STAGE_BY_CODE = {
  OP: PROJECT_STAGE.OPERATING,
  SB: PROJECT_STAGE.OPERATING,          // standby, but built and connected
  V: PROJECT_STAGE.UNDER_CONSTRUCTION,  // under construction, > 50% complete
  U: PROJECT_STAGE.UNDER_CONSTRUCTION,  // under construction, < 50% complete
  TS: PROJECT_STAGE.UNDER_CONSTRUCTION, // construction complete, in testing
};

/** "(V) Under construction" → the canonical stage, or null to skip the row. */
export function stageOf(status){
  const code = String(status ?? '').match(/\(([A-Z]{1,2})\)/)?.[1];
  return code ? (STAGE_BY_CODE[code] ?? null) : null;
}

const isBattery = (row) => {
  const code = String(row.prime_mover_code ?? '').trim().toUpperCase();
  return code ? code === BATTERY_PRIME_MOVER : BATTERY_TECHNOLOGY.test(String(row.technology ?? ''));
};

/** Statistical cells with an explicit unit must not accept strings such as GW. */
export function eiaNumber(value){
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const text = String(value ?? '').trim();
  if (!/^-?(?:\d+(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?)$/.test(text)) return null;
  const result = Number(text.replace(/,/g, ''));
  return Number.isFinite(result) ? result : null;
}

/** Month + year columns → an ISO date. EIA splits them; the schema wants one. */
export function codOf(row){
  const year = num(row.planned_operation_year) ?? num(row.operating_year);
  if (!year) return null;
  const month = num(row.planned_operation_month) ?? num(row.operating_month) ?? 1;
  return isoDate(`${year}-${String(Math.min(Math.max(month, 1), 12)).padStart(2, '0')}`);
}

const slug = (value) => String(value ?? '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Rows from one EIA-860M sheet → canonical project records for one market.
 *
 * @param {object[]} rows
 * @param {object} ctx  { marketId, evidenceDate }
 */
export function normalizeEia(rows, { marketId, evidenceDate, publishedAt = null, reportingPeriod = null, includeObservations = false }){
  const ba = MARKET_BA[marketId];
  if (!ba) throw new Error(`eia-860m: ${marketId} has no balancing authority mapping`);

  const projects = [];
  for (const row of rows){
    if (String(row.balancing_authority_code ?? '').trim().toUpperCase() !== ba) continue;
    if (!isBattery(row)) continue;
    if (includeObservations && String(row.prime_mover_code ?? '').trim().toUpperCase() !== 'BA') continue;

    const stage = stageOf(row.status);
    if (!stage) continue;                 // queue entries are not pipeline

    const capacityMW = (includeObservations ? eiaNumber : num)(row.nameplate_capacity);
    /* No capacity, no project: a battery of unknown size cannot be summed into a
       fleet total, and every total on the page would be wrong by an unknown
       amount rather than visibly missing a row. */
    if (!capacityMW || capacityMW <= 0) continue;

    const plantId = String(row.plant_id ?? '').trim();
    const generatorId = String(row.generator_id ?? '').trim();
    if (!plantId || !generatorId) continue;

    const project = {
      id: `${marketId}-eia-${slug(plantId)}${generatorId ? '-' + slug(generatorId) : ''}`,
      marketId,
      name: String(row.plant_name ?? `EIA plant ${plantId}`).trim()
        + (generatorId ? ` (unit ${generatorId})` : ''),
      technology: PROJECT_TECHNOLOGY.STORAGE,
      stage,
      statusRaw: String(row.status ?? '').trim(),
      capacityMW,
      /* No common discharge-power duration is supplied. Null rather than a guessed
         duration — a two-hour assumption would flow straight into cluster
         labels and pipeline totals as though it had been observed. */
      durationHours: null,
      operator: String(row.entity_name ?? '').trim() || null,
      // Legacy shape; the governed inventory opts into current monthly fields.
      lat: null,
      lon: null,
      expectedCod: codOf(row),
      sourceIds: [SOURCE_ID],
      evidenceDate,
      provenance: provenance({
        /* A statutory monthly filing: coverage is a legal obligation rather than
           a survey response, which is a different claim from AEMO's operator
           reporting or OSM's volunteer mapping. */
        authority: AUTHORITY.STATUTORY,
        dataset: 'EIA-860M',
        publisher: 'U.S. Energy Information Administration',
        /* Plant id plus generator id is EIA's own compound key and the join key
           the annual EIA-860 enrichment uses. */
        sourceRecordId: generatorId ? `${plantId}:${generatorId}` : plantId,
        publishedAt,
        ingestedAt: evidenceDate,
      }),
      /* Kept so the annual-860 join has something to match on, and so a reader
         can find the row in the source file. */
      sourceRef: { plantId, generatorId: generatorId || null, state: row.plant_state ?? null },
    };
    if (includeObservations){
      const mwh = eiaNumber(row.nameplate_energy_capacity);
      const lat = eiaNumber(row.latitude), lon = eiaNumber(row.longitude);
      const located = lat != null && lon != null && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0);
      const year = eiaNumber(row.planned_operation_year) ?? eiaNumber(row.operating_year);
      const month = eiaNumber(row.planned_operation_month) ?? eiaNumber(row.operating_month);
      project.expectedCod = Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12
        ? `${year}-${String(month).padStart(2,'0')}-01` : null;
      project.codPrecision = project.expectedCod ? 'month' : year ? 'year' : null;
      project.reportedCodYear = year;
      project.sourceRef.balancingAuthority = ba;
      project.sourceRef.primeMover = 'BA';
      project.sourceRef.operatingYear = eiaNumber(row.operating_year);
      project.sourceRef.operatingMonth = eiaNumber(row.operating_month);
      project.energyObservation = mwh > 0 ? { value:mwh, unit:'MWh', basis:'monthly-nameplate', reportingPeriod, sourceId:SOURCE_ID, sourceRecordId:`${plantId}:${generatorId}` } : null;
      project.lat = located ? lat : null; project.lon = located ? lon : null;
      project.coordinateEvidence = { sourceId:located ? SOURCE_ID : null, basis:located ? 'monthly-reported' : 'missing', reportingPeriod, confidence:located ? 'reported' : 'none' };
      project.inventoryPeriod = reportingPeriod;
    }
    projects.push(project);
  }

  // Deterministic order so an unchanged release produces an unchanged file.
  return projects.sort((a, b) => a.id.localeCompare(b.id));
}

/* The columns the transform depends on. Named explicitly so a release that
   renames one stops the run instead of publishing a register of nulls. */
export const REQUIRED_COLUMNS = [
  'plant_id', 'generator_id', 'plant_name', 'entity_name', 'status',
  'nameplate_capacity', 'prime_mover_code', 'balancing_authority_code',
];

/**
 * Read one market's batteries from a downloaded EIA-860M workbook.
 *
 * This parser takes an already-downloaded workbook path. Official public files
 * can be fetched separately; release discovery is not implemented here.
 * Operating and planned units live on separate sheets and
 * both are read: a battery under construction is pipeline, and one already
 * operating is the fleet it joins.
 */
export async function readEiaWorkbook(file, { sheets = ['Operating', 'Planned'], ...context } = {}){
  const reads = await readSheets(file, sheets.map(sheet => ({ sheet, headerRow:3, exactSheet:true, rejectDuplicateHeaders:true, textColumns:['plant_id','generator_id'] })));
  return eiaProjectsFromSheets(reads, context);
}

/** Operating wins a cross-tab transition. Within-tab contradictions fail closed. */
export function eiaProjectsFromSheets(reads, context){
  const byId = new Map();
  for (const read of reads){
    requireColumns(read.headers, REQUIRED_COLUMNS, `eia-860m ${read.sheetName}`);
    const rank = read.sheetName.trim().toLowerCase() === 'operating' ? 2 : 1;
    for (const project of normalizeEia(read.rows, context)){
      const prior = byId.get(project.id);
      if (prior){
        if (prior.project.sourceRef.plantId !== project.sourceRef.plantId || prior.project.sourceRef.generatorId !== project.sourceRef.generatorId) throw new Error('eia-860m: project ID collision');
        if (prior.rank === rank && JSON.stringify(prior.project) !== JSON.stringify(project)) throw new Error('eia-860m: conflicting duplicate compound ID');
      }
      if (!prior || rank > prior.rank) byId.set(project.id, { project, rank });
    }
  }
  return [...byId.values()].map(p => p.project).sort((a,b) => a.id.localeCompare(b.id));
}
