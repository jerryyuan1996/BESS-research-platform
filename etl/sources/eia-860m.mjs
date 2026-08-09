/* ---------------------------------------------------------------------------
   EIA-860M — Preliminary Monthly Electric Generator Inventory.

   One dataset, three markets: PJM, ERCOT and CAISO are separated by balancing
   authority code rather than by state, because ERCOT is not Texas and CAISO is
   not California — both cover most of their state and neither covers all of it.

   Statutory monthly filing, so coverage is a legal obligation rather than a
   survey response, and it is US Government work in the public domain.

   WHAT IT DOES NOT CARRY. Coordinates. The monthly file is generator-level with
   a plant ID, a state and a county, and the latitude and longitude live on the
   ANNUAL EIA-860. Until that join is built these projects are pipeline-table
   rows with no map marker, which the schema supports on purpose: a project that
   cannot be plotted is not a project that does not exist. It also carries no
   energy capacity — `durationHours` stays null and every cluster containing one
   reports power only.

   EIA's own warning is worth repeating: monthly capacities are restated
   retroactively and are less reliable than the annual form. This is a pipeline
   register, not an accounting source.
   --------------------------------------------------------------------------- */
import { readSheet, num, isoDate, requireColumns } from '../lib/workbook.mjs';
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

const isBattery = (row) =>
  String(row.prime_mover_code ?? '').trim().toUpperCase() === BATTERY_PRIME_MOVER
  || BATTERY_TECHNOLOGY.test(String(row.technology ?? ''));

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
export function normalizeEia(rows, { marketId, evidenceDate, publishedAt = null }){
  const ba = MARKET_BA[marketId];
  if (!ba) throw new Error(`eia-860m: ${marketId} has no balancing authority mapping`);

  const projects = [];
  for (const row of rows){
    if (String(row.balancing_authority_code ?? '').trim().toUpperCase() !== ba) continue;
    if (!isBattery(row)) continue;

    const stage = stageOf(row.status);
    if (!stage) continue;                 // queue entries are not pipeline

    const capacityMW = num(row.nameplate_capacity);
    /* No capacity, no project: a battery of unknown size cannot be summed into a
       fleet total, and every total on the page would be wrong by an unknown
       amount rather than visibly missing a row. */
    if (!capacityMW || capacityMW <= 0) continue;

    const plantId = String(row.plant_id ?? '').trim();
    const generatorId = String(row.generator_id ?? '').trim();
    if (!plantId) continue;

    projects.push({
      id: `${marketId}-eia-${slug(plantId)}${generatorId ? '-' + slug(generatorId) : ''}`,
      marketId,
      name: String(row.plant_name ?? `EIA plant ${plantId}`).trim()
        + (generatorId ? ` (unit ${generatorId})` : ''),
      technology: PROJECT_TECHNOLOGY.STORAGE,
      stage,
      statusRaw: String(row.status ?? '').trim(),
      capacityMW,
      /* EIA-860M publishes no energy capacity. Null rather than a guessed
         duration — a two-hour assumption would flow straight into cluster
         labels and pipeline totals as though it had been observed. */
      durationHours: null,
      operator: String(row.entity_name ?? '').trim() || null,
      // Coordinates live on the annual EIA-860 and are not joined yet.
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
    });
  }

  // Deterministic order so an unchanged release produces an unchanged file.
  return projects.sort((a, b) => a.id.localeCompare(b.id));
}

/* The columns the transform depends on. Named explicitly so a release that
   renames one stops the run instead of publishing a register of nulls. */
export const REQUIRED_COLUMNS = [
  'plant_id', 'plant_name', 'entity_name', 'status',
  'nameplate_capacity', 'prime_mover_code', 'balancing_authority_code',
];

/**
 * Read one market's batteries from a downloaded EIA-860M workbook.
 *
 * The file is a manual download — EIA publishes no API — so this takes a path
 * rather than fetching. Operating and planned units live on separate sheets and
 * both are read: a battery under construction is pipeline, and one already
 * operating is the fleet it joins.
 */
export async function readEiaWorkbook(file, { marketId, evidenceDate, publishedAt = null, sheets = ['Operating', 'Planned'] } = {}){
  const all = [];
  for (const sheet of sheets){
    let read;
    try {
      read = await readSheet(file, { sheet, headerRow: 3 });
    } catch {
      continue;                           // a vintage without this tab is not an error
    }
    requireColumns(read.headers, REQUIRED_COLUMNS, `eia-860m ${sheet}`);
    all.push(...normalizeEia(read.rows, { marketId, evidenceDate, publishedAt }));
  }

  /* A generator can appear on both sheets across a status change; the last one
     wins, which is the operating row when a unit has just come online. */
  const byId = new Map(all.map(project => [project.id, project]));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
