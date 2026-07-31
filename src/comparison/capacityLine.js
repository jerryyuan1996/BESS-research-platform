/* ---------------------------------------------------------------------------
   The capacity line, derived rather than asserted.

   Every capacity-backed market in this platform used to publish a single number:

       contracted: 39585,   // ≈€60.9/kW × 0.65 correction factor (seed, verify)

   The components were in a comment. That is where they die. Poland's availability
   correction factor went 95% → 60% → 13.39% across three auctions while the
   clearing price rose 76%; both moved, in opposite directions, and a fused
   number cannot show that, cannot be checked against a source, and cannot be
   proposed against by the ETL one component at a time.

   So a market now declares the parts and this module multiplies them:

       capacity: {
         price: 465.02, unit: 'kW', priceCurrency: 'PLN', fxToMarket: 1 / 4.30,
         derating: 0.1339,
         ...provenance
       }

   and `contracted` becomes a derived value. The engine is unchanged — it still
   reads `economics.contracted` — but the drift report, the source drawer and a
   human reading the file all see price and de-rating separately.

   This module is pure arithmetic over declared inputs. It imports nothing.
   --------------------------------------------------------------------------- */

/**
 * Capacity revenue per MW of nameplate per year, in the market's own currency.
 *
 * @param {object} c
 * @param {number} c.price          clearing price, per `unit` per year, in `priceCurrency`
 * @param {'kW'|'MW'} [c.unit]      what the price is quoted per. Default 'kW'.
 * @param {number} [c.fxToMarket]   multiply by this to reach the market currency. Default 1.
 * @param {number} [c.derating]     de-rating / availability correction factor. Default 1.
 * @returns {number} currency units per nameplate MW per year
 */
export function capacityRevenuePerMW(c){
  if (!c || typeof c.price !== 'number') return 0;
  const perMW = c.unit === 'MW' ? c.price : c.price * 1000;
  return perMW * (c.fxToMarket ?? 1) * (c.derating ?? 1);
}

/**
 * The same number, plus the working, for display and for the drift report.
 * Rendering code should prefer this over recomputing the multiplication itself.
 */
export function capacityLine(c){
  const value = capacityRevenuePerMW(c);
  return {
    value,
    price: c.price,
    unit: c.unit ?? 'kW',
    priceCurrency: c.priceCurrency ?? null,
    fxToMarket: c.fxToMarket ?? 1,
    derating: c.derating ?? 1,
    auction: c.auction ?? null,
    deliveryYear: c.deliveryYear ?? null,
    source: c.source ?? null,
    note: c.note ?? null,
  };
}

/**
 * A services multiplier curve, evaluated at a year.
 *
 * Ancillary and system-services revenue does not decay smoothly — it steps, when
 * a procurement regime changes. Ireland's DS3 ends and FASS begins; Great Britain
 * already lived through exactly this when Dynamic Containment saturated. A flat
 * line with 2%/yr degradation cannot represent a cliff, so markets exposed to one
 * declare a curve of multipliers instead.
 *
 * A curve shorter than the modelled life holds its last value: the tail of these
 * curves is a floor, and extending a floor is not an extra assumption.
 *
 * @param {number[]|undefined} curve  multipliers, index 0 = year 1
 * @param {number} year               1-based
 * @returns {number} multiplier, 1 when no curve is declared
 */
export function servicesFactor(curve, year){
  if (!Array.isArray(curve) || curve.length === 0) return 1;
  const i = Math.max(0, Math.min(curve.length - 1, year - 1));
  const v = curve[i];
  return Number.isFinite(v) ? v : 1;
}
