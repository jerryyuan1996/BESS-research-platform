/* ---------------------------------------------------------------------------
   Marktstammdatenregister — German electricity storage units.

   The Bundesnetzagentur's statutory register. Registration is a legal obligation
   rather than a survey response, which makes it the most complete storage source
   on this platform: unit id, operator, gross and net power, usable energy
   capacity, commissioning date and WGS84 coordinates, all in one row.

   Licence: Datenlizenz Deutschland – Namensnennung – Version 2.0. Free to use
   and republish with attribution to the Bundesnetzagentur.

   INPUT. A CSV/XLSX export from the Erweiterte Einheitenübersicht, filtered to
   Stromspeichereinheiten, or the equivalent slice of the Gesamtdatenexport. This
   is a manual download — the bulk export is a multi-hundred-megabyte XML archive
   and the register publishes no project-level API suited to a scheduled job.

   COLUMN NAMES. Declared as aliases below rather than hard-coded, because the
   register publishes German headers whose exact spelling varies between the web
   export and the bulk export, and because a renamed column must fail the run
   rather than produce a register of nulls. The aliases follow the published
   field documentation; the first real download that disagrees will say so
   loudly, and the fix is one line here.

   UNITS. MaStR publishes power in kW and energy in kWh. The platform is MW and
   MWh throughout, so both are divided by 1,000 at the boundary — the one place
   that conversion happens.
   --------------------------------------------------------------------------- */
import { readSheet, num, isoDate, resolveColumns } from '../lib/workbook.mjs';
import { provenance, AUTHORITY } from '../lib/provenance.mjs';
import { PROJECT_STAGE, PROJECT_TECHNOLOGY } from '../../src/projects/schema.js';

export const SOURCE_ID = 'de-mastr';
export const MARKET_ID = 'de';

export const LICENCE = {
  id: 'dl-de-by-2.0',
  name: 'Datenlizenz Deutschland – Namensnennung – Version 2.0',
  attribution: 'Bundesnetzagentur — Marktstammdatenregister',
  url: 'https://www.govdata.de/dl-de/by-2-0',
  shareAlike: false,
};

/* What this connector needs, and every header spelling seen for it. Normalised
   by `defaultHeader`, so umlauts are folded and unit annotations in brackets are
   already gone: "Nutzbare Speicherkapazität (kWh)" arrives as
   `nutzbare_speicherkapazitat`. */
export const COLUMNS = {
  unitId: { required: true, aliases: [
    'mastr_nr_der_einheit', 'einheitmastrnummer', 'mastr_nr_einheit', 'einheit_mastr_nummer'] },
  name: { required: true, aliases: [
    'anzeige_name_der_einheit', 'name_der_einheit', 'einheitname', 'anzeigename_der_einheit'] },
  status: { required: true, aliases: [
    'betriebs_status', 'betriebsstatus', 'einheitbetriebsstatus'] },
  grossPowerKW: { required: true, aliases: [
    'bruttoleistung_der_einheit', 'bruttoleistung', 'bruttoleistungdereinheit'] },
  netPowerKW: { aliases: ['nettonennleistung_der_einheit', 'nettonennleistung'] },
  energyKWh: { aliases: [
    'nutzbare_speicherkapazitat', 'nutzbare_speicherkapazitat_der_einheit', 'nutzbarespeicherkapazitat'] },
  commissioned: { aliases: [
    'inbetriebnahmedatum_der_einheit', 'inbetriebnahmedatum', 'geplantes_inbetriebnahmedatum'] },
  lat: { aliases: ['koordinate_breitengrad', 'breitengrad'] },
  lon: { aliases: ['koordinate_langengrad', 'langengrad', 'koordinate_laengengrad'] },
  operator: { aliases: [
    'name_des_anlagenbetreibers', 'anlagenbetreiber', 'betreiber_der_einheit'] },
  state: { aliases: ['bundesland'] },
  technology: { aliases: ['batterietechnologie', 'technologie_der_speichereinheit'] },
  energySource: { aliases: ['energietrager', 'hauptbrennstoff_der_einheit'] },
};

/* Register statuses the platform maps. "In Planung" is a planning entry — a
   queue, not a pipeline — and is deliberately absent, as are the two retirement
   states: a decommissioned battery is not part of an operating fleet. */
const STAGE_BY_STATUS = new Map([
  ['in betrieb', PROJECT_STAGE.OPERATING],
  ['in_betrieb', PROJECT_STAGE.OPERATING],
  ['inbetrieb', PROJECT_STAGE.OPERATING],
  ['vorübergehend stillgelegt', PROJECT_STAGE.OPERATING],   // built, connected, temporarily out
  ['voruebergehend stillgelegt', PROJECT_STAGE.OPERATING],
  ['in bau', PROJECT_STAGE.UNDER_CONSTRUCTION],
]);

/** German operational status → canonical stage, or null to skip the row. */
export function stageOf(status){
  const key = String(status ?? '').trim().toLowerCase();
  return STAGE_BY_STATUS.get(key) ?? null;
}

/* A storage unit registered against a household PV system is a home battery, and
   there are millions of them. The platform underwrites grid-scale assets, so a
   floor is applied — stated here rather than hidden in a filter, because it is a
   scoping decision and not a fact about the register. */
export const MIN_MW = 1;

const kwToMw = (value) => {
  const kw = num(value);
  return kw == null ? null : kw / 1000;
};

const text = (value) => {
  const s = String(value ?? '').trim();
  return s || null;
};

/**
 * MaStR export rows → canonical project records.
 *
 * @param {object[]} rows
 * @param {object} ctx  { columns, publishedAt, ingestedAt, minMW }
 */
export function normalizeMastr(rows, { columns, publishedAt = null, ingestedAt, minMW = MIN_MW }){
  const at = (row, field) => (columns[field] ? row[columns[field]] : undefined);
  const projects = [];

  for (const row of rows){
    const stage = stageOf(at(row, 'status'));
    if (!stage) continue;

    /* Gross power is the register's headline rating and the one every German
       capacity figure is quoted against. Net is carried through as a fallback
       only — never averaged with gross, which would invent a third number. */
    const capacityMW = kwToMw(at(row, 'grossPowerKW')) ?? kwToMw(at(row, 'netPowerKW'));
    if (!capacityMW || capacityMW < minMW) continue;

    const unitId = text(at(row, 'unitId'));
    if (!unitId) continue;                  // no stable id, no traceable record

    const energyMWh = kwToMw(at(row, 'energyKWh'));
    const lat = num(at(row, 'lat'));
    const lon = num(at(row, 'lon'));
    /* Both or neither. A half-declared position would put the unit on the null
       island rather than leaving it off the map, and the schema rejects it. */
    const located = Number.isFinite(lat) && Number.isFinite(lon)
      && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;

    projects.push({
      id: `${MARKET_ID}-mastr-${unitId.toLowerCase()}`,
      marketId: MARKET_ID,
      name: text(at(row, 'name')) || `MaStR ${unitId}`,
      technology: PROJECT_TECHNOLOGY.STORAGE,
      stage,
      statusRaw: text(at(row, 'status')) || '',
      capacityMW,
      /* Derived from the register's own kWh where it publishes one, and null
         where it does not. Never a default duration: a two-hour assumption
         would flow into every cluster label and fleet total as observed fact. */
      durationHours: energyMWh != null && energyMWh > 0 ? energyMWh / capacityMW : null,
      operator: text(at(row, 'operator')),
      lat: located ? Math.round(lat * 10_000) / 10_000 : null,
      lon: located ? Math.round(lon * 10_000) / 10_000 : null,
      /* The register records when a unit went into operation. For an operating
         unit that is its COD; for one under construction the same column carries
         the planned date. Either way it is the register's own date, not ours. */
      expectedCod: isoDate(at(row, 'commissioned')),
      sourceIds: [SOURCE_ID],
      evidenceDate: ingestedAt,
      provenance: provenance({
        authority: AUTHORITY.STATUTORY,
        dataset: 'Marktstammdatenregister — Stromspeichereinheiten',
        publisher: 'Bundesnetzagentur',
        sourceRecordId: unitId,
        publishedAt,
        ingestedAt,
      }),
      sourceRef: {
        unitId,
        state: text(at(row, 'state')),
        batteryTechnology: text(at(row, 'technology')),
      },
    });
  }

  /* Deterministic order, and a stable id wins over row order: the register does
     not guarantee row order between exports. */
  const byId = new Map(projects.map(p => [p.id, p]));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/** Read a downloaded MaStR storage export. */
export async function readMastrWorkbook(file, { publishedAt = null, ingestedAt, sheet, minMW } = {}){
  const { rows, headers } = await readSheet(file, { sheet, headerRow: 1 });
  const columns = resolveColumns(headers, COLUMNS, 'mastr');
  return normalizeMastr(rows, { columns, publishedAt, ingestedAt, minMW });
}
