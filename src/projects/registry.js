/* ---------------------------------------------------------------------------
   THE PROJECT REGISTRY — one interface, every source.

   The dashboard asks "what projects does this market have" and gets the same
   answer shape whether they came from a statutory German register, a US monthly
   filing, an Australian operator survey or a volunteer OSM survey. It never
   learns which — except where the difference is something a reader should see,
   which is what `attribution()` and `coverage()` are for.

   WHAT THIS FILE MAY NOT DO. Parse anything. `exceljs`, the workbook adapter and
   every connector live in etl/ and run on a developer's machine; this reads the
   JSON they produce. tests/etl-boundary.test.js enforces it, and the bundle is
   the reason: a spreadsheet parser is several hundred kilobytes shipped to every
   visitor to support a job that runs monthly.

   REGISTRATION. A market appears here by having a source registered against it.
   A market with no verified source registers nothing and every accessor returns
   an empty, honest answer — which is the Romania case, and the reason
   `hasSource()` exists separately from "returned no projects".
   --------------------------------------------------------------------------- */
import { MAPPED_STAGES, isPlottable, energyMWh } from './projectValues.js';
import { fleetTotals } from './projectTotals.js';

/* marketId → { projects, licence, attribution, dataset, publishedAt, note }.
   Populated by `registerProjects` at module load from each market's own data
   file, exactly as gridMapRegistry joins maps to markets. */
const REGISTRY = new Map();
const SOURCE_MEMBERS = new Map();

/**
 * Register one market's project dataset.
 *
 * @param {string} marketId
 * @param {object} entry
 * @param {object[]} entry.projects   canonical records (src/projects/schema.js)
 * @param {object} entry.licence      terms, carried from the ETL artifact
 * @param {string} entry.dataset      the publication the records came from
 * @param {?string} [entry.publishedAt]
 * @param {[string,string]} [entry.note]  bilingual caveat shown with the layer
 */
export function registerProjects(marketId, entry){
  if (!marketId || !entry?.projects) return;
  const existing = REGISTRY.get(marketId);
  /* A market may draw on more than one source — the US markets take records
     from EIA-860M enriched by the annual EIA-860, and a market could later add
     a second register. Sources accumulate rather than replace. */
  if (existing){
    existing.projects = dedupe([...existing.projects, ...entry.projects]);
    existing.sources.push(describe(entry));
    return;
  }
  REGISTRY.set(marketId, {
    projects: dedupe(entry.projects),
    sources: [describe(entry)],
  });
}

const describe = (entry) => ({
  ...(entry.sourceKey ? { sourceKey:entry.sourceKey } : {}),
  dataset: entry.dataset,
  licence: entry.licence || null,
  publishedAt: entry.publishedAt ?? null,
  note: entry.note || null,
});

/** Replace one governed source's records, including removals, without altering
    legacy registrations or retaining retired IDs from an earlier revision. */
export function replaceProjectsForSource(marketId, entry){
  if (!marketId || !entry?.sourceKey || !Array.isArray(entry.projects)) throw new Error('project source identity and records required');
  const key=marketId+':'+entry.sourceKey, oldIds=SOURCE_MEMBERS.get(key)||new Set();
  const existing=REGISTRY.get(marketId);
  REGISTRY.set(marketId,{
    projects:dedupe([...(existing?.projects||[]).filter(p=>!oldIds.has(p.id)),...entry.projects]),
    sources:[...(existing?.sources||[]).filter(s=>s.sourceKey!==entry.sourceKey),describe(entry)],
  });
  SOURCE_MEMBERS.set(key,new Set(entry.projects.map(p=>p.id)));
}

/* Later registration wins on a shared id, so an enriched record replaces the
   bare one it was built from rather than doubling the fleet. */
function dedupe(projects){
  const byId = new Map(projects.map(project => [project.id, project]));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/** True when a market has any source at all. Distinct from "has no projects". */
export function hasSource(marketId){
  return REGISTRY.has(marketId);
}

/**
 * Every project the market publishes, in a stable order.
 *
 * Includes records with no coordinates: they belong in the pipeline table even
 * though the map cannot draw them.
 */
export function projectsFor(marketId){
  return REGISTRY.get(marketId)?.projects || [];
}

/** Only what the map may draw — plottable, and in a rendered stage. */
export function mappableProjects(marketId){
  return projectsFor(marketId).filter(p => isPlottable(p) && MAPPED_STAGES.includes(p.stage));
}

/** Fleet totals by stage, for the map caption and the pipeline header. */
export function fleetFor(marketId){
  return fleetTotals(projectsFor(marketId));
}

/**
 * What must be shown alongside the layer.
 *
 * ODbL requires visible attribution and the German register requires naming the
 * Bundesnetzagentur, so this is an obligation rather than a nicety.
 */
export function attribution(marketId){
  return (REGISTRY.get(marketId)?.sources || [])
    .map(source => source.licence?.attribution)
    .filter(Boolean);
}

/** The sources behind a market's layer, for the source drawer. */
export function sourcesFor(marketId){
  return REGISTRY.get(marketId)?.sources || [];
}

/**
 * What the market can and cannot say, so a renderer never implies more than the
 * data supports.
 *
 * `energyKnown` is the one that matters most: a fleet where no source publishes
 * MWh must report power only, and a caption that omitted that would read as a
 * fleet with no energy rather than an unpublished one.
 */
export function coverage(marketId){
  const projects = projectsFor(marketId);
  const mapped = projects.filter(p => MAPPED_STAGES.includes(p.stage));
  const withEnergy = mapped.filter(p => energyMWh(p) != null).length;
  const located = mapped.filter(isPlottable).length;

  return {
    hasSource: hasSource(marketId),
    records: mapped.length,
    located,
    unlocated: mapped.length - located,
    energyKnown: withEnergy,
    energyUnknown: mapped.length - withEnergy,
    /* A market whose records all lack coordinates has a pipeline table and no
       map layer. That is a legitimate state — EIA-860M before the annual join —
       and the renderer needs to distinguish it from an empty market. */
    mappable: located > 0,
  };
}

/** Markets with at least one registered source. */
export function registeredMarkets(){
  return [...REGISTRY.keys()].sort();
}

/** Test seam. Never called by the application. */
export function __resetRegistry(){
  REGISTRY.clear();
  SOURCE_MEMBERS.clear();
}
