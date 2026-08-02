/* ---------------------------------------------------------------------------
   The congestion registry — one entry per allocation market.

   Same rule as the market registry above it: this file is the only place the
   application learns that a market has a congestion register. The grid tabs, the
   maps and the home-page comparison all derive from it, so a market that gains a
   register joins all three without another edit.

   Japan appears three times because its three allocation points have genuinely
   different constraints — which is the one place on this platform where the
   regional split earns itself. Everything else about Japan is national.
   --------------------------------------------------------------------------- */
import { GB_CONGESTION } from './gb/congestion.js';
import { IE_CONGESTION } from './ie/congestion.js';
import { PL_CONGESTION } from './pl/congestion.js';
import { RO_CONGESTION } from './ro/congestion.js';
import { WA_CONGESTION } from './wa/congestion.js';
import { JP_CONGESTION } from './jp/congestion.js';
import { NEM_CONGESTION } from './nem/congestion.js';
import { DE_CONGESTION } from './de/congestion.js';
import { IT_CONGESTION } from './it/congestion.js';

export const CONGESTION_REGISTERS = [
  WA_CONGESTION,
  NEM_CONGESTION,
  GB_CONGESTION,
  DE_CONGESTION,
  IT_CONGESTION,
  IE_CONGESTION,
  RO_CONGESTION,
  PL_CONGESTION,
  JP_CONGESTION.tokyo,
  JP_CONGESTION.kyushu,
  JP_CONGESTION.hokkaido,
];

const byMarket = new Map(CONGESTION_REGISTERS.map(r => [r.marketId, r]));

/** The register for one allocation market, or null. */
export const congestionFor = (marketId) => byMarket.get(marketId) || null;

/**
 * The register a DASHBOARD should show.
 *
 * Three Japanese allocation markets share one dashboard, so the dashboard needs
 * the register for the region it is currently showing. Everything else resolves
 * to itself.
 */
export function congestionForDashboard(dashboardId, region){
  if (dashboardId === 'jp') return JP_CONGESTION[region] || JP_CONGESTION.tokyo;
  return byMarket.get(dashboardId) || null;
}

/** Every zone across every market, flattened, each carrying its market id. */
export function allZones(){
  return CONGESTION_REGISTERS.flatMap(r => r.zones.map(z => ({ marketId: r.marketId, ...z })));
}
