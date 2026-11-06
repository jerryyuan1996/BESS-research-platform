/* ---------------------------------------------------------------------------
   EIA-860 annual → coordinates and stable plant metadata for EIA-860M records.

   The monthly inventory is generator-level and carries no position. The annual
   EIA-860 does, on its Plant schedule, and the two share EIA's own plant code.
   Joining them is what turns a US pipeline row into a map marker.

   THE JOIN, AND WHAT IT REFUSES TO DO.

   `plantId` is the primary key and it is an official identifier issued by EIA.
   A match on it is exact and needs no interpretation, so it is reported as
   confidence `exact`.

   A fallback exists because plant codes are occasionally reassigned or a
   monthly row precedes the annual file that first lists the plant. It matches on
   normalised plant name WITHIN a single state, which makes it deterministic —
   name alone would match "Gateway" in four states. It is reported as confidence
   `name-state`, and a caller may discard those without losing any exact match.
   An ambiguous fallback — the same normalised name twice in one state — is NOT
   resolved by picking one. It is left unmatched and counted.

   WHAT THIS JOIN NEVER ADDS. Energy capacity or duration. It reads the Plant
   schedule only. Annual EIA-860's separate 3_4_Energy_Storage workbook DOES
   publish MWh and maximum charge/discharge MW (verified 2026-11-06), but is not
   joined here. That requires a plant+generator match and an explicit power
   denominator; a plant-coordinate match cannot imply a battery's duration.
   --------------------------------------------------------------------------- */
import { readSheet, num, resolveColumns } from '../lib/workbook.mjs';

export const SOURCE_ID = 'us-eia-860-annual';

/** How a record acquired its position. Carried on the record itself. */
export const MATCH = {
  EXACT: 'exact',            // EIA plant code, an official identifier
  NAME_STATE: 'name-state',  // deterministic fallback, explicitly weaker
  NONE: 'none',
};

export const COLUMNS = {
  plantId: { required: true, aliases: ['plant_code', 'plant_id', 'plantcode'] },
  plantName: { required: true, aliases: ['plant_name', 'plantname'] },
  state: { required: true, aliases: ['state', 'plant_state'] },
  lat: { required: true, aliases: ['latitude', 'lat'] },
  lon: { required: true, aliases: ['longitude', 'lon', 'long'] },
  county: { aliases: ['county'] },
  balancingAuthority: { aliases: ['balancing_authority_code', 'balancing_authority'] },
  utilityName: { aliases: ['utility_name', 'utility'] },
};

/** Plant name reduced to a comparable key. Deterministic and documented. */
export function nameKey(value){
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    /* Corporate and descriptive suffixes that differ between the two forms for
       the same plant. Removed by an explicit list rather than by a fuzzy score,
       so a match can be reasoned about and reproduced. */
    .replace(/\b(llc|inc|lp|ltd|co|corp|company|project|facility|plant|station|bess|energy storage|storage)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const validCoord = (lat, lon) =>
  Number.isFinite(lat) && Number.isFinite(lon)
  && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
  /* Null island is in the Gulf of Guinea. A US plant is never there, and a pair
     of zeroes is the classic signature of an empty cell read as a number. */
  && !(lat === 0 && lon === 0);

/**
 * Build the lookup from an annual EIA-860 plant sheet.
 *
 * @returns {{byId: Map, byNameState: Map, ambiguous: Set, count: number}}
 */
export function buildPlantIndex(rows, columns){
  const at = (row, field) => (columns[field] ? row[columns[field]] : undefined);
  const byId = new Map();
  const byNameState = new Map();
  const seenNameState = new Map();

  for (const row of rows){
    const plantId = String(at(row, 'plantId') ?? '').trim();
    const lat = num(at(row, 'lat'));
    const lon = num(at(row, 'lon'));
    if (!plantId || !validCoord(lat, lon)) continue;

    const state = String(at(row, 'state') ?? '').trim().toUpperCase();
    const plantName = String(at(row, 'plantName') ?? '').trim();

    const record = {
      plantId,
      plantName,
      state,
      lat: Math.round(lat * 10_000) / 10_000,
      lon: Math.round(lon * 10_000) / 10_000,
      county: String(at(row, 'county') ?? '').trim() || null,
      balancingAuthority: String(at(row, 'balancingAuthority') ?? '').trim() || null,
      utilityName: String(at(row, 'utilityName') ?? '').trim() || null,
    };
    byId.set(plantId, record);

    const key = `${state}|${nameKey(plantName)}`;
    if (!key.endsWith('|')){
      seenNameState.set(key, (seenNameState.get(key) || 0) + 1);
      byNameState.set(key, record);
    }
  }

  /* A name that occurs twice in one state cannot be resolved deterministically,
     so it resolves to nothing. Picking the first row would be arbitrary and the
     wrong plant half the time. */
  const ambiguous = new Set([...seenNameState].filter(([, n]) => n > 1).map(([key]) => key));
  for (const key of ambiguous) byNameState.delete(key);

  return { byId, byNameState, ambiguous, count: byId.size };
}

/**
 * Attach coordinates and plant metadata to EIA-860M records.
 *
 * Returns new records; nothing is mutated. Every record gains an `enrichment`
 * block saying how — or whether — it matched, so a reader can discard weak
 * matches and a reconciliation check can count them.
 *
 * @param {object[]} projects  canonical records from eia-860m.mjs
 * @param {object} index       from buildPlantIndex
 * @param {object} [options]
 * @param {boolean} [options.allowNameFallback=true]
 */
export function enrichProjects(projects, index, { allowNameFallback = true } = {}){
  return projects.map(project => {
    const plantId = project.sourceRef?.plantId;
    const state = String(project.sourceRef?.state ?? '').trim().toUpperCase();

    let plant = plantId ? index.byId.get(String(plantId)) : null;
    let confidence = plant ? MATCH.EXACT : MATCH.NONE;
    let matchedOn = plant ? 'plant_code' : null;

    if (!plant && allowNameFallback && state){
      /* The monthly file appends "(unit X)" to the name this connector builds,
         so the fallback keys on the plant name as EIA published it, recovered
         from the record's own name by stripping that suffix. */
      const bare = project.name.replace(/\s*\(unit\s+[^)]*\)\s*$/i, '');
      const key = `${state}|${nameKey(bare)}`;
      if (index.ambiguous.has(key)){
        // Explicitly unresolved rather than arbitrarily resolved.
        confidence = MATCH.NONE;
        matchedOn = 'ambiguous-name-state';
      } else {
        plant = index.byNameState.get(key) || null;
        if (plant){
          confidence = MATCH.NAME_STATE;
          matchedOn = 'plant_name+state';
        }
      }
    }

    const enrichment = {
      source: SOURCE_ID,
      confidence,
      matchedOn,
      matchedPlantId: plant?.plantId ?? null,
    };

    if (!plant) return { ...project, enrichment };

    return {
      ...project,
      /* Position from the annual form. The monthly record had none, so this is
         the only place a US project can get one. */
      lat: plant.lat,
      lon: plant.lon,
      /* This Plant-only join supplies no generator-level energy observation.
         The annual storage schedule needs its own explicit integration. */
      durationHours: project.durationHours,
      sourceIds: [...new Set([...project.sourceIds, SOURCE_ID])],
      sourceRef: {
        ...project.sourceRef,
        county: plant.county,
        utilityName: plant.utilityName,
        balancingAuthority: plant.balancingAuthority,
      },
      enrichment,
    };
  });
}

/** Read the annual plant sheet and build the index. */
export async function readPlantIndex(file, { sheet = 'Plant', headerRow = 2 } = {}){
  const { rows, headers } = await readSheet(file, { sheet, headerRow });
  const columns = resolveColumns(headers, COLUMNS, 'eia-860 annual plant');
  return buildPlantIndex(rows, columns);
}

/** Counts a reconciliation check can assert on. */
export function enrichmentSummary(projects){
  const summary = { total: projects.length, exact: 0, nameState: 0, none: 0, located: 0 };
  for (const project of projects){
    const confidence = project.enrichment?.confidence ?? MATCH.NONE;
    if (confidence === MATCH.EXACT) summary.exact += 1;
    else if (confidence === MATCH.NAME_STATE) summary.nameState += 1;
    else summary.none += 1;
    if (Number.isFinite(project.lat) && Number.isFinite(project.lon)) summary.located += 1;
  }
  return summary;
}
