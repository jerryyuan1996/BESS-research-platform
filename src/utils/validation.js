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

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

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
