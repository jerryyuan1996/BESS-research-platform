/* ---------------------------------------------------------------------------
   THE MERCHANT BRIDGE — from an observed price series to something that can be
   compared with an approved revenue assumption.

   This module is where the platform is most at risk of saying more than it
   knows, so what it does and does not claim is written down rather than implied.

   IT COMPUTES an estimate of wholesale arbitrage revenue per MW per year, under
   stated parameters, from observed prices.

   IT DOES NOT claim that estimate equals `economics.merchGross`. It cannot.
   merchGross in this platform's markets bundles arbitrage with balancing,
   intraday and — depending on the market — ancillary revenue that no day-ahead
   price series contains. A pipeline that set merchGross to this number would be
   silently deleting revenue streams.

   So drift is measured as a RATIO against an anchor: the same calculation, run
   over the vintage of data the analyst was looking at when they approved
   merchGross. If the arbitrage index has risen 18% since the anchor, that is
   evidence — properly caveated — that merchGross is 18% stale. It is not proof,
   which is why it opens a pull request and not a commit.

   The ratio construction also cancels most of the parameter error. A wrong
   realisation factor or cycle count scales the anchor and the current estimate
   by the same amount and largely divides out. An absolute claim would carry the
   full error; a relative one mostly does not. That is the entire reason the
   anchor mechanism exists rather than a direct assignment.
   --------------------------------------------------------------------------- */
import {
  ROUND_TRIP_EFFICIENCY, CYCLES_PER_YEAR, AVAILABILITY, SPREAD_REALISATION, BRIDGE_CLAIM,
} from '../governance/derivation.js';

/**
 * Annual wholesale-arbitrage revenue per MW, in the price series' currency.
 *
 * Per cycle, per MW, the asset discharges `durationHours` MWh and must charge
 * `durationHours / η` MWh:
 *
 *     marginPerCycle = durationHours × (dischargeMean − chargeMean / η)
 *
 * then annualised by cycles, availability and the realisation factor.
 *
 * Returns null when the inputs do not support a number. Callers must render
 * absence as absence.
 *
 * @param {object} metrics  output of derivePriceMetrics()
 * @returns {{revenuePerMW:number, marginPerCycle:number, inputs:object}|null}
 */
export function arbitrageRevenuePerMW(metrics){
  if (!metrics) return null;
  const { chargeMean, dischargeMean, durationHours, spreadDays } = metrics;

  if (typeof chargeMean !== 'number' || typeof dischargeMean !== 'number') return null;
  if (!Number.isFinite(chargeMean) || !Number.isFinite(dischargeMean)) return null;
  if (typeof durationHours !== 'number' || durationHours <= 0) return null;

  /* Too few complete trading days to characterise a year. Publishing an
     annualised figure from a handful of days would put a confident number on
     what is really a sampling artefact. */
  if (!spreadDays || spreadDays < 28) return null;

  const marginPerCycle = durationHours * (dischargeMean - chargeMean / ROUND_TRIP_EFFICIENCY);

  /* A negative margin is a real market state — it means the observed spread did
     not cover round-trip losses over the window. It is reported, not floored at
     zero: clamping it would hide precisely the condition an investor most needs
     to see. */
  const revenuePerMW = marginPerCycle * CYCLES_PER_YEAR * AVAILABILITY * SPREAD_REALISATION;

  return {
    revenuePerMW,
    marginPerCycle,
    inputs: {
      chargeMean, dischargeMean, durationHours,
      roundTripEfficiency: ROUND_TRIP_EFFICIENCY,
      cyclesPerYear: CYCLES_PER_YEAR,
      availability: AVAILABILITY,
      spreadRealisation: SPREAD_REALISATION,
      spreadDays,
    },
    claim: BRIDGE_CLAIM,
  };
}

/**
 * Compare the current arbitrage index against the analyst's approved anchor.
 *
 * @param {number} current  arbitrage revenue per MW now
 * @param {object|null} anchor  { value, asOf, note } from governance/anchors.js
 * @returns {{computable:boolean, ratio:number|null, impliedMerchGross:number|null, reason:string[]}}
 */
export function bridgeAgainstAnchor(current, anchor, approvedMerchGross){
  if (typeof current !== 'number' || !Number.isFinite(current)){
    return { computable: false, ratio: null, impliedMerchGross: null,
      reason: ['Current arbitrage index not computable', '当前套利指数无法计算'] };
  }
  if (!anchor || typeof anchor.value !== 'number' || !Number.isFinite(anchor.value)){
    return { computable: false, ratio: null, impliedMerchGross: null,
      reason: [
        'No approved anchor set for this market — drift cannot be measured until an analyst records one. See src/governance/anchors.js.',
        '本市场尚未设定已批准锚点 — 在分析师记录锚点前无法度量偏移。参见 src/governance/anchors.js。',
      ] };
  }
  if (anchor.value === 0){
    return { computable: false, ratio: null, impliedMerchGross: null,
      reason: ['Anchor is zero — a ratio is undefined', '锚点为零 — 比值无定义'] };
  }

  const ratio = current / anchor.value;
  const impliedMerchGross = (typeof approvedMerchGross === 'number' && Number.isFinite(approvedMerchGross))
    ? approvedMerchGross * ratio
    : null;

  return {
    computable: true,
    ratio,
    impliedMerchGross,
    reason: [
      `Arbitrage index ${ratio >= 1 ? 'up' : 'down'} ${Math.abs((ratio - 1) * 100).toFixed(1)}% against the anchor set ${anchor.asOf}`,
      `套利指数较 ${anchor.asOf} 设定的锚点${ratio >= 1 ? '上升' : '下降'} ${Math.abs((ratio - 1) * 100).toFixed(1)}%`,
    ],
  };
}
