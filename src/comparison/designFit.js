/* ---------------------------------------------------------------------------
   DESIGN FIT — which route to market and which duration a market pays for.

   docs/duration-and-route-fit-plan.md, Part A, approved by the analyst on
   2026-10-15. The engine prices one duration per market, the archetype. This
   module asks the same engine what every other declared duration would earn on
   every route the market supports, and which of those designs is worth most.

   IT IS NOT A SECOND MODEL. Each design is the market's own comparison
   interface with the duration-dependent lines rescaled, run through `runCase`
   unchanged. At the archetype every rescaling factor is exactly 1, so the sweep
   reproduces the league table to the bit — tests/design-fit.test.js asserts it
   for every market and every route. The dashboards' prototype sweep
   (_shared/lab.js) is the model this replaces, and on 2026-10-15 it picked a
   different duration from the archetype in six of eleven markets.

   SHAPES, NOT LEVELS. A market's `durationResponse` says how a line SCALES with
   duration; the level stays the engine's. Every curve is read relative to its
   own value at the archetype, so a de-rating table whose 4h point disagrees with
   the engine's capacity line (GB's dashboard row carries 0.45 where the engine
   carries 0.38) still only contributes its shape. Capex is treated the same
   way: the component stack says how the total scales, `capexPerMW` stays the
   authority.

       capex      capexPerMW × stack(h) / stack(h0)           src/comparison/capex.js
       opex       opexPerMW × (1 + s × (h/h0 − 1))             s = opexEnergyShare
       merchant   merchGross × h/h0 × capture(h) / capture(h0)
       services   unchanged — bought in MW
       capacity   line × derating(h) / derating(h0), or the linear floor rule
       toll       only at the duration it was quoted at
       award      per kW unchanged, per kWh scaled, or only where quoted

   THE OBJECTIVE (decision 1). Value per MW of connection at the platform's own
   exit yields: the exit value at commercial operation — every stream discounted
   at the yield assumptions.js already gives it — less the capital it took to
   build. No new discount rate is introduced, and a contracted megawatt-hour is
   worth more than a merchant one exactly as everywhere else on the platform.
   Capital spent before COD is not compounded to COD, which flatters a long
   build slightly; the engine's exit pricing makes the same simplification.

   THE BAND. Every design within DESIGN_FIT_TOLERANCE of the archetype's net
   capital of the best one. The sweep cannot separate them honestly, so it does
   not pretend to.

   FLOORS HOLD FOR THE TERM (decision 6). Under the analyst's ruling of
   2026-10-12 there is no augmentation cost, so capacity fades. A route that pays
   only above a duration floor is tested on the usable duration at the END of its
   term, through the same degradation the revenue line takes:

       binary   below the floor the route is closed. A design that clears the
                floor at COD but not at the end of the term is priced, shown,
                and excluded from the fit, with the duration that would hold.
       linear   capacity is credited in proportion to usable duration below the
                floor (WA's ESR requirement). The fade is applied year by year.

   How each scheme actually treats fade is research gate DG-5; a scheme the gate
   clears declares `holdForTerm: false` and is tested at COD only.

   WHAT IT DOES NOT PRICE. Co-location, grid-forming contracts and congestion
   relief (plan §10). Tolls and long-term awards away from the duration their
   price was quoted at. A duration outside a market's declared curve.

   Authority: the outputs are model outputs, recomputed on approved inputs. The
   inputs (`comparison.durationResponse`) are classified in
   src/governance/authority.js; the objective, the band and the floor test are
   methodology, listed there as the `design-fit` surface.

   Layering: imports the engine, the strategy catalogue, the capex stack and the
   assumptions. No DOM, no market module, no ETL code.
   --------------------------------------------------------------------------- */
import { runCase, degradationFactor } from './engine.js';
import { supportedStrategies, baseStrategy, STRATEGY_IDS } from './strategies.js';
import { buildCapex, stackFrom } from './capex.js';
import { DESIGN_FIT_TOLERANCE, LIFE } from './assumptions.js';

/**
 * Where a point on a declared curve came from, weakest last. A fit that rests
 * on a `fill` or a `seed` point says so.
 */
export const INPUT_BASIS = ['published', 'rule', 'observed', 'reported', 'fill', 'seed'];
const WEAK_BASIS = new Set(['fill', 'seed']);

/** How a duration floor binds. See the header. */
export const FLOOR_KIND = { BINARY: 'binary', LINEAR: 'linear' };

/** What a long-term award is paid on. */
export const PAYMENT_BASIS = { KW: 'kW', KWH: 'kWh', QUOTED: 'quoted' };

/** The leaves a route rule may carry. Anything else fails validation. */
const RULE_LEAVES = new Set(['quotedHours', 'floorHours', 'floorKind', 'termYears', 'holdForTerm', 'paymentBasis', 'note']);

const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(s => typeof s === 'string' && s.length > 0);
const fmtH = (h) => (Math.round(h * 10) / 10).toString();

/** The market's declared duration response, or null. */
export function durationResponseOf(market){
  return market?.comparison?.durationResponse || null;
}

/** Value of an hour-aligned curve at a declared duration; undefined off the grid. */
function curveAt(dr, field, hours){
  const curve = dr?.[field];
  if (!Array.isArray(curve)) return undefined;
  const i = dr.hours.indexOf(hours);
  return i >= 0 ? curve[i] : undefined;
}

function basisAt(dr, field, hours){
  const b = dr?.[field + 'Basis'];
  if (typeof b === 'string') return b;
  if (!Array.isArray(b)) return null;
  const i = dr.hours.indexOf(hours);
  return i >= 0 ? b[i] : null;
}

/**
 * Structural problems with a market's duration response. Empty when sound.
 * The suite runs this over every registered market.
 */
export function validateDurationResponse(market){
  const dr = durationResponseOf(market);
  if (!dr) return [];
  const id = market?.manifest?.id || '?';
  const h0 = market.comparison?.archetype?.durationHours;
  const problems = [];
  const at = (msg) => problems.push(`${id}: durationResponse.${msg}`);

  const hours = dr.hours;
  if (!Array.isArray(hours) || !hours.length) at('hours must be a non-empty array');
  else {
    if (!hours.every(h => Number.isFinite(h) && h > 0)) at('hours must be positive numbers');
    if (hours.some((h, i) => i > 0 && h <= hours[i - 1])) at('hours must be strictly ascending');
    if (!hours.includes(h0)) at(`hours must contain the archetype duration (${h0}h)`);
  }
  const n = Array.isArray(hours) ? hours.length : 0;

  const curve = (field, { required, min }) => {
    const c = dr[field];
    if (c === undefined){ if (required) at(`${field} is required`); return; }
    if (!Array.isArray(c) || c.length !== n) { at(`${field} must have one value per declared hour`); return; }
    if (!c.every(v => Number.isFinite(v) && v >= min)) at(`${field} values must be finite and ≥ ${min}`);
    if (Array.isArray(hours) && hours.includes(h0) && !(c[hours.indexOf(h0)] > 0)) at(`${field} must be positive at the archetype`);
    const b = dr[field + 'Basis'];
    if (b === undefined) at(`${field}Basis is required`);
    else if (typeof b === 'string'){ if (!INPUT_BASIS.includes(b)) at(`${field}Basis "${b}" is not a known basis`); }
    else if (!Array.isArray(b) || b.length !== n || !b.every(x => INPUT_BASIS.includes(x))) at(`${field}Basis must be a known basis, or one per declared hour`);
  };
  curve('merchantCapture', { required: true, min: 0 });
  curve('capacityDerating', { required: false, min: 0 });

  if (!(Number.isFinite(dr.opexEnergyShare) && dr.opexEnergyShare >= 0 && dr.opexEnergyShare <= 1)){
    at('opexEnergyShare must be a number between 0 and 1');
  }
  if (dr.note !== undefined && !isPair(dr.note)) at('note must be an [en, zh] pair');

  for (const [route, rule] of Object.entries(dr.routeRules || {})){
    if (!STRATEGY_IDS.includes(route)){ at(`routeRules names an unknown route "${route}"`); continue; }
    for (const leaf of Object.keys(rule || {})) if (!RULE_LEAVES.has(leaf)) at(`routeRules.${route}.${leaf} is not a known leaf`);
    if (rule.quotedHours !== undefined && !(Number.isFinite(rule.quotedHours) && rule.quotedHours > 0)) at(`routeRules.${route}.quotedHours must be a positive number`);
    if (rule.floorHours !== undefined && !(Number.isFinite(rule.floorHours) && rule.floorHours > 0)) at(`routeRules.${route}.floorHours must be a positive number`);
    if (rule.termYears !== undefined && !(Number.isInteger(rule.termYears) && rule.termYears > 0)) at(`routeRules.${route}.termYears must be a positive integer`);
    if (rule.floorKind !== undefined && !Object.values(FLOOR_KIND).includes(rule.floorKind)) at(`routeRules.${route}.floorKind "${rule.floorKind}" is not known`);
    if (rule.holdForTerm !== undefined && typeof rule.holdForTerm !== 'boolean') at(`routeRules.${route}.holdForTerm must be true or false`);
    if (rule.paymentBasis !== undefined && !Object.values(PAYMENT_BASIS).includes(rule.paymentBasis)) at(`routeRules.${route}.paymentBasis "${rule.paymentBasis}" is not known`);
    if (rule.paymentBasis === PAYMENT_BASIS.QUOTED && !Number.isFinite(rule.quotedHours)) at(`routeRules.${route}: a quoted payment needs quotedHours`);
    if (rule.note !== undefined && !isPair(rule.note)) at(`routeRules.${route}.note must be an [en, zh] pair`);
  }
  return problems;
}

/* ---- the rescaling ------------------------------------------------------- */

/** Installed capex at `hours` relative to the archetype, from the component stack. */
function capexRatio(e, h0, hours){
  const stack = e.capexStack || stackFrom(e.capexPerMW, h0);
  const at0 = buildCapex(stack, h0).total;
  return at0 > 0 ? buildCapex(stack, hours).total / at0 : null;
}

/** The duration a route's price was quoted at, if it is priced at one duration only. */
function quotedHoursOf(market, route){
  const cmp = market.comparison;
  const rule = cmp.durationResponse?.routeRules?.[route] || {};
  if (Number.isFinite(rule.quotedHours)) return rule.quotedHours;
  /* Fail closed. A toll, or an award with no declared payment basis, is a
     single deal at a single size; extrapolating it to another duration would be
     inventing a price nobody quoted. */
  if (route === 'toll') return cmp.archetype.durationHours;
  if (route === 'ltda' && (!rule.paymentBasis || rule.paymentBasis === PAYMENT_BASIS.QUOTED)) return cmp.archetype.durationHours;
  return null;
}

/**
 * The duration floor a route carries, or null. A long-term award's floor and
 * term are the scheme's own fields (`economics.ltda.minDurationHours`, `.years`)
 * and are read from there rather than restated.
 */
export function floorOf(market, route){
  const cmp = market.comparison, e = cmp.economics;
  const rule = cmp.durationResponse?.routeRules?.[route] || {};
  const hours = rule.floorHours ?? (route === 'ltda' ? e.ltda?.minDurationHours : undefined);
  if (!Number.isFinite(hours)) return null;
  const termYears = rule.termYears
    ?? (route === 'ltda' ? e.ltda?.years : route === 'cap' ? e.contractYears : undefined)
    ?? LIFE;
  return {
    hours,
    termYears,
    kind: rule.floorKind || FLOOR_KIND.BINARY,
    holdForTerm: rule.holdForTerm !== false,
  };
}

/** Usable duration over the term against a floor, and the build that would hold it. */
export function termCheck(market, floor, hours){
  const e = market.comparison.economics;
  const fadeAtEnd = degradationFactor(e, floor.termYears);
  const usableAtTermEnd = hours * fadeAtEnd;
  return {
    ...floor,
    usableAtTermEnd,
    holdsAtCod: hours >= floor.hours,
    holdsForTerm: usableAtTermEnd >= floor.hours,
    requiredHours: fadeAtEnd > 0 ? floor.hours / fadeAtEnd : null,
  };
}

/* Year-by-year credit under a linear floor, relative to the credit at COD. */
function linearFadeFactors(market, floor, hours){
  const e = market.comparison.economics;
  const atCod = Math.min(1, hours / floor.hours);
  if (!(atCod > 0)) return null;
  return Array.from({ length: LIFE }, (_, i) =>
    Math.min(1, hours * degradationFactor(e, i + 1) / floor.hours) / atCod);
}

/** How the capacity line scales with duration, relative to the archetype, or null. */
function capacityRatio(market, hours){
  const cmp = market.comparison, dr = cmp.durationResponse;
  const h0 = cmp.archetype.durationHours;
  /* At the archetype the line is the engine's own, whether or not a curve says
     how it scales — a market that declares no response is still priced there. */
  if (hours === h0) return 1;
  const floor = floorOf(market, 'cap');
  if (floor && floor.kind === FLOOR_KIND.LINEAR){
    return Math.min(1, hours / floor.hours) / Math.min(1, h0 / floor.hours);
  }
  const d = curveAt(dr, 'capacityDerating', hours);
  const d0 = curveAt(dr, 'capacityDerating', h0);
  if (!Number.isFinite(d) || !(d0 > 0)) return null;
  return d / d0;
}

/**
 * The market as it would be at `hours` on `route`: the same comparison
 * interface with the duration-dependent lines rescaled. At the archetype every
 * factor is exactly 1, which is what the parity test leans on.
 *
 * @returns {object} a market-shaped object, or { na:[en,zh] }
 */
export function marketAt(market, route, hours){
  const cmp = market.comparison, e = cmp.economics, dr = cmp.durationResponse;
  const h0 = cmp.archetype.durationHours;
  const k = hours / h0;
  const econ = { ...e };

  const cr = capexRatio(e, h0, hours);
  if (cr == null) return { na: ['No capital cost declared to scale', '未声明可缩放的资本成本'] };
  econ.capexPerMW = e.capexPerMW * cr;
  econ.opexPerMW = e.opexPerMW * (1 + (dr.opexEnergyShare ?? 0) * (k - 1));

  const c = curveAt(dr, 'merchantCapture', hours);
  const c0 = curveAt(dr, 'merchantCapture', h0);
  if (!Number.isFinite(c) || !(c0 > 0)){
    return { na: ['No merchant capture declared at ' + fmtH(hours) + 'h', '未声明' + fmtH(hours) + '小时下的市场化捕获系数'] };
  }
  econ.merchGross = e.merchGross * k * (c / c0);

  if (route === 'cap' || (route === 'toll' && e.tollAdditiveWithCapacity)){
    const ratio = capacityRatio(market, hours);
    if (ratio == null){
      return { na: ['No capacity response is declared away from the modelled duration',
                    '未声明当前模型时长以外的容量响应'] };
    }
    if (Number.isFinite(e.contracted)) econ.contracted = e.contracted * ratio;
    if (Number.isFinite(e.securedContracted)) econ.securedContracted = e.securedContracted * ratio;
    if (Array.isArray(e.auctionRenewalCurve)) econ.auctionRenewalCurve = e.auctionRenewalCurve.map(v => v * ratio);
  }

  if (route === 'ltda' && e.ltda && dr.routeRules?.ltda?.paymentBasis === PAYMENT_BASIS.KWH){
    econ.ltda = { ...e.ltda, payment: e.ltda.payment * k };
  }

  return {
    ...market,
    comparison: { ...cmp, archetype: { ...cmp.archetype, durationHours: hours }, economics: econ },
  };
}

/* A ratio is only as good as the weaker of the two points it divides. */
const weaker = (a, b) => (INPUT_BASIS.indexOf(a) >= INPUT_BASIS.indexOf(b) ? a : b);

/**
 * What a design's rescaled lines rest on. At the archetype nothing is rescaled,
 * so nothing is reported: the lines are the engine's own.
 */
function inputsAt(market, route, hours){
  const cmp = market.comparison, dr = cmp.durationResponse;
  const h0 = cmp.archetype.durationHours;
  if (hours === h0) return {};
  const usesCapacity = route === 'cap'
    || (route === 'toll' && cmp.economics.tollAdditiveWithCapacity);
  const floor = usesCapacity ? floorOf(market, 'cap') : null;
  const ratioBasis = (field) => {
    const a = basisAt(dr, field, hours), b = basisAt(dr, field, h0);
    return a && b ? weaker(a, b) : (a || b);
  };
  const out = {
    capture: { value: curveAt(dr, 'merchantCapture', hours) ?? null, basis: ratioBasis('merchantCapture') },
  };
  if (usesCapacity){
    out.capacity = floor && floor.kind === FLOOR_KIND.LINEAR
      ? { value: Math.min(1, hours / floor.hours), basis: 'rule' }
      : { value: curveAt(dr, 'capacityDerating', hours) ?? null, basis: ratioBasis('capacityDerating') };
  }
  return out;
}

/* ---- one design ---------------------------------------------------------- */

function pricePoint(market, route, hours, { termTest, runOptions }){
  const h0 = market.comparison.archetype.durationHours;
  const point = { route, hours, archetype: hours === h0 };

  const quoted = quotedHoursOf(market, route);
  if (quoted != null && hours !== quoted){
    return { ...point, priced: false, eligible: false,
      reason: ['Priced only at ' + fmtH(quoted) + 'h, the duration its price was quoted at',
               '仅在报价所依据的' + fmtH(quoted) + '小时时长下定价'] };
  }

  const floor = floorOf(market, route);
  const term = floor ? termCheck(market, floor, hours) : null;
  if (floor && floor.kind === FLOOR_KIND.BINARY && !term.holdsAtCod){
    return { ...point, priced: false, eligible: false, term,
      reason: ['Below the ' + fmtH(floor.hours) + 'h floor this route requires',
               '低于该路径要求的' + fmtH(floor.hours) + '小时下限'] };
  }

  const variant = marketAt(market, route, hours);
  if (variant.na) return { ...point, priced: false, eligible: false, term, reason: variant.na };

  const opts = { ...runOptions };
  if (floor && floor.kind === FLOOR_KIND.LINEAR && floor.holdForTerm && termTest){
    const factors = linearFadeFactors(market, floor, hours);
    if (factors) opts.capacityFactors = factors;
  }

  /* Exit year 0: the exit value at commercial operation, which is the
     objective's discounting with nothing added. */
  const r = runCase(variant, route, 0, opts);
  if (!r || r.na) return { ...point, priced: false, eligible: false, term, reason: r?.na || null };

  let eligible = true, reason = null;
  if (floor && floor.kind === FLOOR_KIND.BINARY && floor.holdForTerm && termTest && !term.holdsForTerm){
    eligible = false;
    reason = [
      'Holds ' + fmtH(term.usableAtTermEnd) + 'h in year ' + floor.termYears + ' against a ' + fmtH(floor.hours)
        + 'h floor; ' + fmtH(term.requiredHours) + 'h at COD would hold it',
      '第' + floor.termYears + '年可用时长为' + fmtH(term.usableAtTermEnd) + '小时，低于' + fmtH(floor.hours)
        + '小时下限；投运时需' + fmtH(term.requiredHours) + '小时方可维持',
    ];
  }

  return {
    ...point, priced: true, eligible, reason, term,
    value: r.exitVal - r.net,
    valuePerCapital: r.net > 0 ? r.exitVal / r.net - 1 : null,
    exitValAtCod: r.exitVal,
    net: r.net,
    /* USD per unit of the market's currency, so a dashboard can show the value
       in its own currency without a second conversion table. */
    fxRate: r.fxRate,
    irrHold: r.irrHold,
    securedShare: r.securedShare,
    inputs: inputsAt(market, route, hours),
  };
}

/* ---- the sweep and the fit ----------------------------------------------- */

/**
 * Every declared duration on every route the market supports.
 *
 * @param {object} market
 * @param {object} [options]
 * @param {boolean} [options.termTest=true]  false tests floors at COD only
 * @param {object} [options.runOptions]      passed to runCase (FX overrides, yields)
 */
export function sweepDesign(market, options = {}){
  const cmp = market?.comparison;
  if (!cmp || !cmp.economics) return { na: ['Economics unavailable', '经济性数据不可用'] };
  if (cmp.engineReady === false) return { na: ['Normalized inputs pending', '归一化输入待补'] };
  const dr = cmp.durationResponse;
  if (!dr) return { na: ['No duration response declared for this market', '本市场未声明时长响应'] };

  const termTest = options.termTest !== false;
  const runOptions = options.runOptions || {};
  const routes = supportedStrategies(market).map(s => s.id);
  const points = [];
  for (const route of routes){
    for (const hours of dr.hours) points.push(pricePoint(market, route, hours, { termTest, runOptions }));
  }
  return {
    marketId: market.manifest.id,
    currency: 'USD',
    archetypeHours: cmp.archetype.durationHours,
    baseRoute: baseStrategy(market),
    hours: dr.hours.slice(),
    routes,
    termTest,
    points,
  };
}

const pick = (p) => p ? { route: p.route, hours: p.hours, value: p.value } : null;
const best = (pts) => pts.reduce((a, b) => (b.value > a.value ? b : a));

/**
 * The best design, the band around it, the best duration on each route, and
 * what the archetype gives up.
 */
export function fitOf(market, options = {}){
  const sweep = options.sweep || sweepDesign(market, options);
  if (sweep.na) return sweep;

  const archetypePoint = sweep.points.find(p => p.route === sweep.baseRoute && p.archetype) || null;
  const candidates = sweep.points.filter(p => p.priced && p.eligible);
  const tolerance = (options.tolerance ?? DESIGN_FIT_TOLERANCE)
    * (archetypePoint?.priced ? archetypePoint.net : (candidates[0]?.net ?? 0));

  const byRoute = {};
  for (const route of sweep.routes){
    const pts = candidates.filter(p => p.route === route);
    if (!pts.length){
      const blocked = sweep.points.find(p => p.route === route && p.term && !p.eligible && p.priced);
      byRoute[route] = {
        best: null, band: [],
        reason: blocked?.reason || ['No declared duration is priced and eligible on this route',
          '该路径下没有既已定价又符合资格的已声明时长'],
        requiredHours: blocked?.term?.requiredHours ?? null,
      };
      continue;
    }
    const rb = best(pts);
    byRoute[route] = { best: pick(rb), band: pts.filter(p => p.value >= rb.value - tolerance).map(p => p.hours) };
  }

  if (!candidates.length){
    return { marketId: sweep.marketId, tolerance, best: null, band: [], byRoute,
      archetype: archetypePoint ? { ...pick(archetypePoint), eligible: archetypePoint.eligible, inBand: false } : null,
      restsOnWeakInput: [], reason: ['No design is both priced and eligible', '没有既已定价又符合资格的设计'] };
  }

  const top = best(candidates);
  const band = candidates.filter(p => p.value >= top.value - tolerance);
  const weak = [];
  for (const [line, input] of Object.entries(top.inputs || {})){
    if (input && WEAK_BASIS.has(input.basis)) weak.push({ line, basis: input.basis });
  }
  return {
    marketId: sweep.marketId,
    tolerance,
    best: pick(top),
    band: band.map(pick),
    byRoute,
    archetype: archetypePoint ? {
      ...pick(archetypePoint),
      priced: archetypePoint.priced,
      eligible: archetypePoint.eligible,
      reason: archetypePoint.reason,
      inBand: band.some(p => p.route === archetypePoint.route && p.hours === archetypePoint.hours),
      /* Only meaningful for a design that could be built as modelled. An
         archetype that fails its own floor gives up nothing to the fit; it is
         not a candidate, and `reason` says why. */
      valueGivenUp: archetypePoint.priced && archetypePoint.eligible ? top.value - archetypePoint.value : null,
    } : null,
    restsOnWeakInput: weak,
  };
}
