import { FX, FX_SEED_DATE } from './assumptions.js';
import { isPresentableAsCurrent } from '../live/freshness.js';

let observed = null;

export function setObservedFxSummary(summary, now = Date.now()){
  const rates = summary?.derived?.rates;
  if (!rates || !isPresentableAsCurrent(summary, now)){
    observed = null;
    return false;
  }
  const clean = { USD: 1 };
  for (const [currency, value] of Object.entries(rates)){
    if (Number.isFinite(value) && value > 0) clean[currency] = value;
  }
  observed = {
    rates: Object.freeze(clean),
    asOf: summary.derived.asOf || summary.coverage?.to || summary.fetchedAt,
    fetchedAt: summary.fetchedAt,
    source: summary.source?.name || 'European Central Bank',
  };
  return true;
}

export function clearObservedFx(){ observed = null; }

export function activeFxRate(currency, explicitRates = null){
  const explicit = explicitRates?.[currency];
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const live = observed?.rates?.[currency];
  if (Number.isFinite(live) && live > 0) return live;
  return FX[currency];
}

export function activeFxState(){
  return observed
    ? { kind:'observed', ...observed }
    : { kind:'seed', rates:FX, asOf:FX_SEED_DATE, fetchedAt:null, source:'Approved seed' };
}

