/* ---------------------------------------------------------------------------
   AEMO Generation Information — NEM and WEM.

   AEMO collects existing, committed and proposed capacity from participants and
   republishes it quarterly with developer-estimated commissioning dates. Two
   markets, one instrument: the NEM workbook covers the eastern regions and the
   WEM workbook covers the SWIS, and this connector reads either.

   WHAT IS CARRIED, AND WHY THE QUEUE IS NOT.

   AEMO publishes four commitment classes. Only two describe an asset that exists
   or is being built:

     Existing    operating fleet
     Committed   AEMO applies PUBLISHED commitment criteria — finance, planning,
                 construction contract, connection agreement — so this is a
                 filtered pipeline rather than a wish list
     Anticipated met some but not all of those criteria. Not carried.
     Proposed    an announcement. Over 18.6 GW of it. Not carried.

   Carrying "proposed" would multiply Australia's storage pipeline several times
   over out of announcements, which is the specific failure this platform's
   governance model exists to prevent.

   COORDINATES. The Generation Information workbook publishes region and, in most
   vintages, no latitude or longitude. Where a coordinate column is absent these
   are pipeline-table rows with no map marker — which the schema supports on
   purpose. A DUID is kept so a future join to AEMO's registration list can
   supply a position without guessing one now.
   --------------------------------------------------------------------------- */
import { readSheet, num, isoDate, resolveColumns, sheetNames } from '../lib/workbook.mjs';
import { provenance, AUTHORITY } from '../lib/provenance.mjs';
import { PROJECT_STAGE, PROJECT_TECHNOLOGY } from '../../src/projects/schema.js';

export const SOURCE_ID = 'au-aemo-generation-information';

export const LICENCE = {
  id: 'aemo-terms',
  name: 'AEMO terms of use — attribution',
  attribution: 'AEMO — Generation Information',
  url: 'https://aemo.com.au/privacy-and-legal-notices/copyright-permissions',
  shareAlike: false,
};

/* NEM regions belong to the NEM; the SWIS is the WEM. A workbook usually
   contains one or the other, but the NEM file has carried WEM sheets in some
   vintages, so the region is checked rather than assumed from the filename. */
export const NEM_REGIONS = new Set(['NSW1', 'QLD1', 'SA1', 'TAS1', 'VIC1', 'NSW', 'QLD', 'SA', 'TAS', 'VIC']);
export const WEM_REGIONS = new Set(['WEM', 'SWIS', 'WA']);

export const MARKET_REGIONS = { nem: NEM_REGIONS, wa: WEM_REGIONS };

export const COLUMNS = {
  name: { required: true, aliases: [
    'station_name', 'project_name', 'site_name', 'generator_name', 'name'] },
  region: { required: true, aliases: ['region', 'region_id', 'nem_region', 'state'] },
  fuel: { required: true, aliases: [
    'fuel_type', 'technology_type', 'fuel_source_descriptor', 'technology', 'fuel_bucket_summary'] },
  status: { required: true, aliases: [
    'status', 'project_status', 'asset_status', 'commitment_status'] },
  capacityMW: { required: true, aliases: [
    'nameplate_capacity', 'reg_cap', 'registered_capacity', 'installed_capacity',
    'nameplate_capacity_mw', 'upper_nameplate_capacity'] },
  energyMWh: { aliases: [
    'storage_capacity', 'storage_capacity_mwh', 'energy_storage_capacity', 'usable_storage_capacity'] },
  owner: { aliases: ['owner', 'participant', 'participant_name', 'proponent'] },
  duid: { aliases: ['duid', 'duids', 'dispatchable_unit_identifier'] },
  cod: { aliases: [
    'expected_commissioning_date', 'expected_commercial_use_date', 'commissioning_date',
    'expected_full_operation_date', 'actual_or_expected_commissioning'] },
  lat: { aliases: ['latitude', 'lat'] },
  lon: { aliases: ['longitude', 'lon', 'long'] },
};

/* AEMO writes these with varying capitalisation and occasional qualifiers
   ("Committed*", "Existing Plant"). Matched on a normalised prefix rather than
   equality so a footnote marker does not silently drop a whole class. */
const STAGE_RULES = [
  [/^existing/, PROJECT_STAGE.OPERATING],
  [/^operating/, PROJECT_STAGE.OPERATING],
  [/^in service/, PROJECT_STAGE.OPERATING],
  [/^committed/, PROJECT_STAGE.UNDER_CONSTRUCTION],
  [/^under construction/, PROJECT_STAGE.UNDER_CONSTRUCTION],
  [/^commissioning/, PROJECT_STAGE.UNDER_CONSTRUCTION],
];

/** AEMO commitment class → canonical stage, or null to skip the row. */
export function stageOf(status){
  const key = String(status ?? '').trim().toLowerCase();
  if (!key) return null;
  /* Withdrawn and retired plant share a prefix with nothing above, but
     "Anticipated" and "Proposed" are deliberately unmatched: they are the queue. */
  for (const [pattern, stage] of STAGE_RULES){
    if (pattern.test(key)) return stage;
  }
  return null;
}

/* AEMO's fuel/technology strings for storage. Batteries are what the platform
   underwrites; pumped hydro is storage but not a battery and is a different
   asset class entirely, so it is excluded rather than silently mixed in. */
const BATTERY = /batter|bess/i;
const NOT_BATTERY = /pump|hydro/i;

export function isBattery(fuel){
  const text = String(fuel ?? '');
  return BATTERY.test(text) && !NOT_BATTERY.test(text);
}

const text = (value) => {
  const s = String(value ?? '').trim();
  return s || null;
};

const slug = (value) => String(value ?? '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Generation Information rows → canonical project records for one market.
 *
 * @param {object[]} rows
 * @param {object} ctx  { marketId, columns, publishedAt, ingestedAt }
 */
export function normalizeAemo(rows, { marketId, columns, publishedAt = null, ingestedAt }){
  const regions = MARKET_REGIONS[marketId];
  if (!regions) throw new Error(`aemo: ${marketId} has no region mapping`);

  const at = (row, field) => (columns[field] ? row[columns[field]] : undefined);
  const projects = [];

  for (const row of rows){
    const region = String(at(row, 'region') ?? '').trim().toUpperCase();
    if (!regions.has(region)) continue;
    if (!isBattery(at(row, 'fuel'))) continue;

    const stage = stageOf(at(row, 'status'));
    if (!stage) continue;                       // Anticipated and Proposed are queue

    const capacityMW = num(at(row, 'capacityMW'));
    if (!capacityMW || capacityMW <= 0) continue;

    const name = text(at(row, 'name'));
    if (!name) continue;

    const duid = text(at(row, 'duid'));
    const energyMWh = num(at(row, 'energyMWh'));

    const lat = num(at(row, 'lat'));
    const lon = num(at(row, 'lon'));
    const located = Number.isFinite(lat) && Number.isFinite(lon)
      && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;

    /* A DUID is AEMO's own identifier and the stable choice. Where a project has
       none — most committed plant does not until it registers — the id falls
       back to the region and name, which is deterministic and readable but not
       a publisher identifier, so `sourceRecordId` stays null rather than
       claiming one. */
    const idPart = duid ? slug(duid) : `${slug(region)}-${slug(name)}`;

    projects.push({
      id: `${marketId}-aemo-${idPart}`,
      marketId,
      name,
      technology: PROJECT_TECHNOLOGY.STORAGE,
      stage,
      statusRaw: text(at(row, 'status')) || '',
      capacityMW,
      /* Only where AEMO publishes an energy capacity. Some vintages carry the
         column and leave it blank for most rows; a blank is unknown, not zero. */
      durationHours: energyMWh != null && energyMWh > 0 ? energyMWh / capacityMW : null,
      operator: text(at(row, 'owner')),
      lat: located ? Math.round(lat * 10_000) / 10_000 : null,
      lon: located ? Math.round(lon * 10_000) / 10_000 : null,
      /* Developer-estimated, and AEMO labels it as such. Carried as published;
         a committed project with no stated date gets null rather than a guess
         from its commitment class. */
      expectedCod: isoDate(at(row, 'cod')),
      sourceIds: [SOURCE_ID],
      evidenceDate: ingestedAt,
      provenance: provenance({
        authority: AUTHORITY.OPERATOR,
        dataset: `AEMO Generation Information — ${marketId === 'wa' ? 'WEM' : 'NEM'}`,
        publisher: 'AEMO',
        sourceRecordId: duid,
        publishedAt,
        ingestedAt,
      }),
      sourceRef: { duid, region },
    });
  }

  /* A station can appear once per unit. Later rows win on a shared id, which for
     a DUID-keyed record is the same unit restated and for a name-keyed one is
     the same station — either way one record, not a double count. */
  const byId = new Map(projects.map(p => [p.id, p]));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Read a downloaded AEMO Generation Information workbook.
 *
 * AEMO names its sheets differently between vintages and between the NEM and WEM
 * files, so every sheet that resolves the required columns is read and the rest
 * are skipped. A workbook where NO sheet resolves is an error — that is a
 * restructured file, not an empty one.
 */
export async function readAemoWorkbook(file, { marketId, publishedAt = null, ingestedAt, sheets } = {}){
  const candidates = sheets || await sheetNames(file);
  const collected = [];
  const failures = [];

  for (const sheet of candidates){
    let parsed;
    try {
      parsed = await readSheet(file, { sheet, headerRow: 1 });
    } catch (error){
      failures.push(`${sheet}: ${error.message}`);
      continue;
    }
    let columns;
    try {
      columns = resolveColumns(parsed.headers, COLUMNS, `aemo ${sheet}`);
    } catch (error){
      failures.push(`${sheet}: ${error.message.split('\n')[0]}`);
      continue;                                  // a summary or notes tab
    }
    collected.push(...normalizeAemo(parsed.rows, { marketId, columns, publishedAt, ingestedAt }));
  }

  if (!collected.length && failures.length === candidates.length){
    throw new Error(
      `aemo ${marketId}: no sheet in the workbook resolved the required columns.\n  `
      + failures.join('\n  '));
  }

  const byId = new Map(collected.map(p => [p.id, p]));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
