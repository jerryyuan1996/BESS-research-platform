/* ---------------------------------------------------------------------------
   SNAPSHOT VALIDATION — the gate "publishes automatically after validation"
   refers to.

   Automatic publication is only defensible if the thing being published has been
   checked. These are the checks. A snapshot that fails any of them is not
   written, the previous snapshot stays in place, and the run reports the failure
   — because a stale-but-correct number is recoverable and a fresh wrong one is
   not.

   The check worth explaining is `unitShift`. Upstream sources change units
   without announcement: £/MWh becomes p/kWh, a price becomes an index, a
   half-hourly series becomes hourly at double the magnitude. Every one of those
   arrives as perfectly valid JSON with plausible numbers, passes every
   shape check, and publishes a market that appears to have moved 100x overnight.
   Comparing the new central tendency against the previous snapshot catches it,
   and it is the single highest-value check in this file.
   --------------------------------------------------------------------------- */

/** Electricity prices go negative — that is a real and important market state,
    not an error. These bounds only catch nonsense. */
const PRICE_BOUNDS = { min: -100_000, max: 1_000_000 };

/** A new snapshot whose median is this many times the previous one is rejected
    pending human review. Wide enough for a genuine price spike, narrow enough to
    catch a unit change. */
const UNIT_SHIFT_FACTOR = 12;

export class ValidationResult {
  constructor(datasetId){
    this.datasetId = datasetId;
    this.errors = [];
    this.warnings = [];
  }
  error(msg){ this.errors.push(msg); return this; }
  warn(msg){ this.warnings.push(msg); return this; }
  get ok(){ return this.errors.length === 0; }
}

const isFiniteNum = (v) => typeof v === 'number' && Number.isFinite(v);

function median(values){
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Checks for a `feed` dataset: dated records with no measured quantity.
 *
 * The price checks do not transfer, so these replace them rather than relax
 * them. What can go wrong with a feed is different in kind: a parser that
 * silently starts returning empty titles, a publisher whose links become
 * relative, a duplicate flood from one source, or a clock skew that dates
 * tomorrow's article today. Each is checked here.
 *
 * @param {object} snapshot
 * @param {Array}  series
 * @param {ValidationResult} r
 * @returns {ValidationResult}
 */
function validateFeed(snapshot, series, r){
  const seen = new Set();
  let bad = 0, lastTs = null, outOfOrder = 0;
  /* An hour of slack. Publishers legitimately post-date by minutes and clocks
     disagree; a headline dated next week is a parse error. */
  const horizon = Date.now() + 60 * 60 * 1000;

  for (let i = 0; i < series.length; i++){
    const item = series[i];
    if (!item || typeof item !== 'object'){ bad++; continue; }

    const t = Date.parse(item.t);
    if (Number.isNaN(t)){
      bad++;
      if (bad <= 3) r.error(`series[${i}].t is not a parseable instant: ${item.t}`);
      continue;
    }
    if (lastTs !== null && t < lastTs) outOfOrder++;
    lastTs = t;

    if (t > horizon){
      r.error(`series[${i}] is dated in the future: ${item.t}`);
    }
    if (!item.id || typeof item.id !== 'string'){
      bad++;
      if (bad <= 3) r.error(`series[${i}] has no stable id`);
      continue;
    }
    if (seen.has(item.id)){
      r.error(`series[${i}] repeats id "${item.id}" — dedup ran wrong or the parser is looping`);
    }
    seen.add(item.id);

    if (!item.title || typeof item.title !== 'string'){
      bad++;
      if (bad <= 3) r.error(`series[${i}] has no title`);
    }
    /* Absolute http(s) only. A relative link is the shape of a parser that took
       the feed's own <link> element instead of the item's, and it would render
       as a dead link on this origin rather than an obviously broken one. */
    if (!/^https?:\/\//.test(String(item.url || ''))){
      bad++;
      if (bad <= 3) r.error(`series[${i}] has no absolute source URL: ${item.url}`);
    }
    if (!item.source || typeof item.source !== 'string'){
      bad++;
      if (bad <= 3) r.error(`series[${i}] does not name its publisher — an unattributed headline is not republishable`);
    }
  }

  if (outOfOrder > 0){
    r.error(`series is not chronologically ordered (${outOfOrder} items out of order)`);
  }
  if (bad > 0){
    const pct = bad / series.length;
    if (pct > 0.02) r.error(`${bad} of ${series.length} items are malformed (${(pct * 100).toFixed(1)}%)`);
    else r.warn(`${bad} malformed items skipped (${(pct * 100).toFixed(2)}%)`);
  }

  const cov = snapshot.coverage;
  if (cov && isFiniteNum(cov.points) && cov.points !== series.length){
    r.error(`coverage.points (${cov.points}) does not match series length (${series.length})`);
  }
  if (!snapshot.units || Object.keys(snapshot.units).length === 0){
    // Not a price unit, but the field still has to say what a record IS.
    r.error('units must be declared — state what one record represents');
  }

  return r;
}

/**
 * Validate a freshly built snapshot, optionally against the one it would replace.
 *
 * @param {object} snapshot   the candidate
 * @param {object} dataset    its catalogue entry
 * @param {object|null} previous  the snapshot currently on disk
 * @returns {ValidationResult}
 */
export function validateSnapshot(snapshot, dataset, previous = null){
  const r = new ValidationResult(dataset?.id ?? '(unknown)');

  if (!snapshot || typeof snapshot !== 'object'){
    return r.error('snapshot is not an object');
  }

  // ---- envelope completeness ----------------------------------------------
  for (const field of ['schemaVersion', 'datasetId', 'authority', 'source', 'fetchedAt', 'coverage', 'units', 'contentChecksum']){
    if (snapshot[field] === undefined || snapshot[field] === null){
      r.error(`envelope field "${field}" is missing`);
    }
  }
  if (snapshot.datasetId !== dataset.id){
    r.error(`datasetId "${snapshot.datasetId}" does not match catalogue id "${dataset.id}"`);
  }
  if (snapshot.authority !== 'observed'){
    // The ETL writes observed data. Anything else in this field means a
    // connector is claiming an authority it does not have.
    r.error(`authority must be "observed", got "${snapshot.authority}"`);
  }
  if (!snapshot.source?.url || !snapshot.source?.name){
    r.error('source must carry both a name and a URL — an unattributable number is not publishable');
  }
  if (Number.isNaN(Date.parse(snapshot.fetchedAt))){
    r.error(`fetchedAt is not a parseable instant: ${snapshot.fetchedAt}`);
  }

  // ---- licence -------------------------------------------------------------
  if (!dataset.republishable && Array.isArray(snapshot.series) && snapshot.series.length > 0){
    r.error('dataset is not republishable but the snapshot carries a raw series');
  }

  // ---- series --------------------------------------------------------------
  const series = snapshot.series;
  if (!Array.isArray(series)){
    r.error('series must be an array');
    return r;
  }

  if (dataset.republishable && series.length === 0){
    // Empty is never published: it is indistinguishable on screen from "the
    // market cleared at nothing".
    r.error('series is empty — refusing to publish; the previous snapshot will be kept');
    return r;
  }

  /* Everything above this line is true of any published snapshot. Everything
     below depends on what the payload IS, which the catalogue states rather than
     this function guessing. A feed of headlines has no median to compare and no
     units to shift, and running the price checks against it would reject every
     item for the crime of not being a number. */
  if (dataset.kind === 'feed') return validateFeed(snapshot, series, r);

  const prices = [];
  let badPoints = 0, lastTs = null, outOfOrder = 0;

  for (let i = 0; i < series.length; i++){
    const p = series[i];
    if (!p || typeof p !== 'object'){ badPoints++; continue; }

    const t = Date.parse(p.t);
    if (Number.isNaN(t)){
      badPoints++;
      if (badPoints <= 3) r.error(`series[${i}].t is not a parseable instant: ${p.t}`);
      continue;
    }
    if (lastTs !== null && t < lastTs) outOfOrder++;
    lastTs = t;

    if (!isFiniteNum(p.v)){
      badPoints++;
      if (badPoints <= 3) r.error(`series[${i}].v is not a finite number: ${p.v}`);
      continue;
    }
    if (p.v < PRICE_BOUNDS.min || p.v > PRICE_BOUNDS.max){
      r.error(`series[${i}].v is outside plausible bounds: ${p.v}`);
    }
    prices.push(p.v);
  }

  if (outOfOrder > 0){
    r.error(`series is not chronologically ordered (${outOfOrder} points out of order)`);
  }
  if (badPoints > 0){
    const pct = badPoints / series.length;
    // A few gaps are normal in market data; a mostly-broken series is not.
    if (pct > 0.02) r.error(`${badPoints} of ${series.length} points are malformed (${(pct * 100).toFixed(1)}%)`);
    else r.warn(`${badPoints} malformed points skipped (${(pct * 100).toFixed(2)}%)`);
  }

  // ---- coverage consistency ------------------------------------------------
  const cov = snapshot.coverage;
  if (cov){
    if (isFiniteNum(cov.points) && cov.points !== series.length){
      r.error(`coverage.points (${cov.points}) does not match series length (${series.length})`);
    }
    if (cov.from && cov.to && Date.parse(cov.from) > Date.parse(cov.to)){
      r.error(`coverage.from (${cov.from}) is after coverage.to (${cov.to})`);
    }
  }

  // ---- units ---------------------------------------------------------------
  if (!snapshot.units || Object.keys(snapshot.units).length === 0){
    r.error('units must be declared — an unlabelled price is not a number anyone can use');
  }

  // ---- unit-shift guard against the previous snapshot ----------------------
  if (previous && Array.isArray(previous.series) && previous.series.length > 0 && prices.length > 0){
    const prevUnits = JSON.stringify(previous.units ?? {});
    const nextUnits = JSON.stringify(snapshot.units ?? {});
    if (prevUnits !== nextUnits){
      r.error(`units changed from ${prevUnits} to ${nextUnits} — refusing to publish silently; review and approve the change`);
    }

    const prevPrices = previous.series.map(p => p?.v).filter(isFiniteNum);
    const prevMed = median(prevPrices);
    const nextMed = median(prices);

    // Only meaningful when the previous median is clear of zero; near zero, a
    // ratio explodes for reasons that have nothing to do with units.
    if (prevMed !== null && nextMed !== null && Math.abs(prevMed) > 1){
      const ratio = Math.abs(nextMed / prevMed);
      if (ratio > UNIT_SHIFT_FACTOR || ratio < 1 / UNIT_SHIFT_FACTOR){
        r.error(
          `median moved from ${prevMed.toFixed(2)} to ${nextMed.toFixed(2)} ` +
          `(${ratio.toFixed(1)}x) — this is the shape of an upstream unit change, ` +
          `not a market move. Refusing to publish; confirm the source's units.`);
      }
    }

    // Coverage should not go backwards. A source republishing an older window
    // usually means a partial outage upstream.
    if (cov?.to && previous.coverage?.to && Date.parse(cov.to) < Date.parse(previous.coverage.to)){
      r.warn(`coverage.to moved backwards: ${previous.coverage.to} → ${cov.to}`);
    }
  }

  return r;
}
