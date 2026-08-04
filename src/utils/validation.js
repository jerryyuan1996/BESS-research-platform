/* ---------------------------------------------------------------------------
   Market-module validation.

   Runs against the registry. Used by tests/registry.test.js and, in dev only, at
   boot — so a malformed market fails loudly at the point of registration instead
   of producing a silently wrong number on the home page.

   Returns problems; never throws and never mutates a market.
   --------------------------------------------------------------------------- */
import {
  REQUIRED_MANIFEST_FIELDS, ECONOMICS_FIELDS, CAPABILITY_FLAGS, RISK_CLASSES,
} from '../markets/schema.js';
import { FX } from '../comparison/assumptions.js';
import { validateMerchantVintage } from '../comparison/vintage.js';
import { baseStrategy } from '../comparison/strategies.js';

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * One year of an auction-renewal scenario.
 *
 * Checks that the year is explained rather than asserted: a named delivery year,
 * a clearing price in a stated unit, an accreditation factor, and the payment
 * those two produce. It does NOT check the shape of the path — see the note in
 * markets/schema.js for why a renewal year is allowed to sit above its secured
 * year.
 *
 * @param {object} y        the scenario entry
 * @param {?number} payment the curve value this entry must reconcile to
 * @param {string} where    label for the problem message
 * @param {(msg:string)=>void} at
 */
function checkRenewalYear(y, payment, where, at){
  if (!y || typeof y !== 'object'){ at(`${where} is not an object`); return; }
  if (typeof y.deliveryYear !== 'string' || !y.deliveryYear){
    at(`${where}.deliveryYear must name the delivery year the assumption applies to`);
  }
  if (!isNum(y.price) || y.price <= 0) at(`${where}.price must be a positive assumed clearing price`);
  if (typeof y.priceUnit !== 'string' || !y.priceUnit){
    at(`${where}.priceUnit must state the unit the price is in`);
  }
  if (!isNum(y.accreditation) || y.accreditation <= 0 || y.accreditation > 1){
    at(`${where}.accreditation must be a factor in (0, 1]`);
  }
  if (!isNum(y.paymentPerMWYr) || y.paymentPerMWYr < 0){
    at(`${where}.paymentPerMWYr must be a non-negative payment per MW per year`);
  }
  /* The payment has to BE the curve value. Without this the declared price and
     accreditation are decoration and the curve can drift away from the argument
     that justifies it — which is the whole failure this scenario prevents. */
  if (payment != null && isNum(y.paymentPerMWYr) && Math.abs(y.paymentPerMWYr - payment) > 1){
    at(`${where}.paymentPerMWYr (${y.paymentPerMWYr}) does not reconcile to its auctionRenewalCurve entry (${payment})`);
  }
}

/**
 * @param {object} market  a market module
 * @returns {string[]} problem descriptions, empty when valid
 */
export function validateMarket(market){
  const problems = [];
  const id = market?.manifest?.id ?? '(no id)';
  const at = (msg) => problems.push(`[${id}] ${msg}`);

  if (!market || typeof market !== 'object') return ['market module is not an object'];

  // ---- manifest -----------------------------------------------------------
  const mf = market.manifest;
  if (!mf) return [`[${id}] missing manifest`];

  for (const f of REQUIRED_MANIFEST_FIELDS){
    if (mf[f] === undefined || mf[f] === null || mf[f] === '') at(`manifest.${f} is missing`);
  }
  /* Ids may use underscores (jp_tokyo); slugs may not, because a slug is a URL
     segment and hyphens are the convention there. The two are separate fields
     precisely so an id can stay stable while a slug is chosen for readability. */
  if (mf.id && !/^[a-z0-9_-]+$/.test(mf.id)) at('manifest.id must be lowercase alphanumeric, hyphen or underscore');
  if (mf.slug && !/^[a-z0-9-]+$/.test(mf.slug)) at('manifest.slug must be URL-safe lowercase');
  for (const f of ['shortName', 'name', 'status']){
    if (mf[f] !== undefined && !isPair(mf[f])) at(`manifest.${f} must be an [en, zh] pair`);
  }
  if (mf.currency && FX[mf.currency] === undefined){
    at(`currency ${mf.currency} has no FX rate in comparison/assumptions.js — the market cannot be normalized`);
  }
  if (mf.dashboardId !== undefined && !/^[a-z0-9-]+$/.test(mf.dashboardId)){
    at('manifest.dashboardId must be lowercase alphanumeric/hyphen');
  }
  if (mf.region !== undefined && !/^[a-z0-9-]+$/.test(mf.region)){
    at('manifest.region must be lowercase alphanumeric/hyphen');
  }
  // A region only means something when another module owns the dashboard.
  if (mf.region && (mf.dashboardId === undefined || mf.dashboardId === mf.id)){
    at('manifest.region is set but dashboardId does not point at a shared dashboard');
  }

  // ---- comparison ---------------------------------------------------------
  const cmp = market.comparison;
  if (!cmp){
    at('missing comparison interface — the market will not appear in any home-page comparison');
    return problems;
  }

  if (!cmp.archetype || !isNum(cmp.archetype.powerMW) || !isNum(cmp.archetype.durationHours)){
    at('comparison.archetype needs numeric powerMW and durationHours');
  }
  if (!cmp.score || !isNum(cmp.score.composite) || !isNum(cmp.score.connectionRisk)){
    at('comparison.score needs numeric composite and connectionRisk');
  }
  if (!cmp.capabilities){
    at('comparison.capabilities is missing — no strategy will be considered available');
  } else {
    for (const k of Object.keys(cmp.capabilities)){
      if (!CAPABILITY_FLAGS.includes(k)) at(`unknown capability "${k}"`);
    }
  }

  const e = cmp.economics;
  if (!e){
    at('comparison.economics is missing');
  } else {
    for (const f of ECONOMICS_FIELDS.required){
      if (!isNum(e[f])) at(`economics.${f} must be a number`);
    }
    // Capability-conditional fields: required only where the capability is claimed.
    // Which fields satisfy `capacityMarket` depends on the risk class.
    if (cmp.capabilities?.capacityMarket){
      if (e.riskClass === 'auction-renewal'){
        if (!isNum(e.securedContracted)){
          at('economics.securedContracted is required for riskClass "auction-renewal"');
        } else if (e.securedContracted <= 0){
          at('capabilities.capacityMarket is true but economics.securedContracted is not positive');
        }
        if (!isNum(e.securedContractYears) || e.securedContractYears <= 0){
          at('economics.securedContractYears must be a positive number of years');
        }
        if (!Array.isArray(e.auctionRenewalCurve)){
          at('economics.auctionRenewalCurve must be an array (use [] to assume no renewal revenue)');
        } else if (e.auctionRenewalCurve.some(v => !isNum(v) || v < 0)){
          at('economics.auctionRenewalCurve entries must be non-negative numbers');
        } else if (e.auctionRenewalCurve.length > 0){
          /* Every uncleared year must be an explained analyst scenario, never a
             bare number. See markets/schema.js. */
          const s = e.auctionRenewalScenario;
          if (!s || typeof s !== 'object'){
            at('economics.auctionRenewalScenario is required whenever auctionRenewalCurve carries assumed years');
          } else {
            if (!isPair(s.basis)) at('auctionRenewalScenario.basis must be an [en, zh] pair');
            if (typeof s.source !== 'string' || !s.source){
              at('auctionRenewalScenario.source must name what the price and accreditation assumptions are built from');
            }
            checkRenewalYear(s.securedYear, e.securedContracted, 'auctionRenewalScenario.securedYear', at);
            if (s.securedYear && s.securedYear.cleared !== true){
              at('auctionRenewalScenario.securedYear.cleared must be true — it is the year an auction actually cleared');
            }
            if (!Array.isArray(s.years)){
              at('auctionRenewalScenario.years must be an array, one entry per auctionRenewalCurve year');
            } else {
              if (s.years.length !== e.auctionRenewalCurve.length){
                at(`auctionRenewalScenario.years has ${s.years.length} entries for ${e.auctionRenewalCurve.length} renewal years`);
              }
              s.years.forEach((y, i) => {
                checkRenewalYear(y, e.auctionRenewalCurve[i], `auctionRenewalScenario.years[${i}]`, at);
                if (y && y.cleared !== false){
                  at(`auctionRenewalScenario.years[${i}].cleared must be false — a cleared auction is a secured year, not a renewal assumption`);
                }
              });
            }
          }
        }
        if (e.contracted !== undefined){
          at('use securedContracted, not contracted, with riskClass "auction-renewal"');
        }
      } else {
        for (const f of ECONOMICS_FIELDS.capacityMarket){
          if (!isNum(e[f])) at(`economics.${f} is required because capabilities.capacityMarket is true`);
        }
        if (isNum(e.contracted) && e.contracted <= 0){
          at('capabilities.capacityMarket is true but economics.contracted is not positive');
        }
      }
    }
    if (e.riskClass !== undefined && !RISK_CLASSES.includes(e.riskClass)){
      at(`unknown economics.riskClass "${e.riskClass}"`);
    }
    if (cmp.capabilities?.tolling){
      if (!isNum(e.toll)) at('economics.toll is required because capabilities.tolling is true');
    }
    if (isNum(e.postFactor) && (e.postFactor < 0 || e.postFactor > 1)){
      at('economics.postFactor should be a fraction between 0 and 1');
    }
    if (isNum(e.feePct) && (e.feePct < 0 || e.feePct > 100)) at('economics.feePct should be 0-100');
    if (isNum(e.grantPct) && (e.grantPct < 0 || e.grantPct > 100)) at('economics.grantPct should be 0-100');
  }

  /* Both merchant legs must be priced at the same year, and that year must be
     the one the base route actually leaves exposed. See comparison/vintage.js —
     the rule exists because the first US build priced one leg at last calendar
     year and the other at a 2030 projection. */
  if (cmp.capabilities?.merchant && cmp.economics){
    for (const p of validateMerchantVintage(market, baseStrategy(market))) at(p);
  }

  if (!cmp.narrative || !isPair(cmp.narrative.archetype) || !isPair(cmp.narrative.thesis)){
    at('comparison.narrative needs [en, zh] archetype and thesis');
  }
  if (cmp.engineReady !== undefined && typeof cmp.engineReady !== 'boolean'){
    at('comparison.engineReady must be a boolean');
  }

  // ---- optional surfaces --------------------------------------------------
  if (market.tabs !== undefined){
    if (!Array.isArray(market.tabs)) at('tabs must be an array of [id, [en, zh]]');
    else for (const t of market.tabs){
      if (!Array.isArray(t) || typeof t[0] !== 'string' || !isPair(t[1])) at(`malformed tab entry: ${JSON.stringify(t)}`);
    }
  }
  if (market.dashboard !== undefined && typeof market.dashboard !== 'function'){
    at('dashboard must be a function (container, market) => void');
  }

  return problems;
}

/** Validates the whole registry, including cross-market uniqueness. */
export function validateRegistry(marketList){
  const problems = [];
  const ids = new Map(), slugs = new Map();

  for (const m of marketList){
    problems.push(...validateMarket(m));
    const id = m?.manifest?.id, slug = m?.manifest?.slug;
    if (id){
      if (ids.has(id)) problems.push(`duplicate market id "${id}"`);
      ids.set(id, true);
    }
    if (slug){
      if (slugs.has(slug)) problems.push(`duplicate market slug "${slug}"`);
      slugs.set(slug, true);
    }
  }
  return problems;
}
