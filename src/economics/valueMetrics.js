/* Pure, reusable storage-value calculations.

   Every function returns null for missing, invalid or non-comparable inputs.
   Zero is preserved when it is a valid observed result; it is never used as a
   substitute for missing evidence. */

const finite = value => typeof value === 'number' && Number.isFinite(value);
const positive = value => finite(value) && value > 0;

export function durationHours({ powerMW, energyMWh } = {}){
  if (!positive(powerMW) || !finite(energyMWh) || energyMWh < 0) return null;
  return energyMWh / powerMW;
}

/**
 * Competition divided by the chosen need/market denominator. This is a proxy,
 * not a universal saturation score, so callers must name the denominator.
 */
export function saturationProxy({ competingMW, denominatorMW } = {}){
  if (!finite(competingMW) || competingMW < 0 || !positive(denominatorMW)) return null;
  return competingMW / denominatorMW;
}

/**
 * Gross annual capacity revenue. A price alone is not project revenue: both
 * qualified MW and the applicable de-rating/credit factor are required.
 */
export function capacityRevenue({
  pricePerKWYear,
  qualifiedMW,
  deratingFactor,
} = {}){
  if (!finite(pricePerKWYear) || pricePerKWYear < 0) return null;
  if (!finite(qualifiedMW) || qualifiedMW < 0) return null;
  if (!finite(deratingFactor) || deratingFactor < 0 || deratingFactor > 1) return null;
  return pricePerKWYear * 1000 * qualifiedMW * deratingFactor;
}

export function captureRate({ realizedRevenue, benchmarkRevenue } = {}){
  if (!finite(realizedRevenue) || !positive(benchmarkRevenue)) return null;
  return realizedRevenue / benchmarkRevenue;
}

export function curtailmentRate({ curtailedMWh, availableMWh } = {}){
  if (!finite(curtailedMWh) || curtailedMWh < 0 || !positive(availableMWh)) return null;
  if (curtailedMWh > availableMWh) return null;
  return curtailedMWh / availableMWh;
}

export function areaBasis({ areaPrice, systemPrice } = {}){
  if (!finite(areaPrice) || !finite(systemPrice)) return null;
  return areaPrice - systemPrice;
}

function normalizedSeries(series){
  if (!Array.isArray(series)) return [];
  return series
    .map((point, index) => {
      const value = finite(point?.v) ? point.v : finite(point?.value) ? point.value : null;
      const ms = point?.t == null ? index : Date.parse(point.t);
      return value === null || !finite(ms) ? null : { value, ms, t: point?.t ?? null };
    })
    .filter(Boolean)
    .sort((a, b) => a.ms - b.ms);
}

function inferredIntervalMs(points){
  if (points.length < 2) return null;
  const gaps = [];
  for (let i = 1; i < points.length; i += 1){
    const gap = points[i].ms - points[i - 1].ms;
    if (gap > 0) gaps.push(gap);
  }
  if (!gaps.length) return null;
  gaps.sort((a, b) => a - b);
  return gaps[Math.floor(gaps.length / 2)];
}

function windows(points, count, intervalMs){
  const out = [];
  for (let start = 0; start + count <= points.length; start += 1){
    const end = start + count - 1;
    let contiguous = true;
    for (let i = start + 1; i <= end; i += 1){
      if (Math.abs((points[i].ms - points[i - 1].ms) - intervalMs) > 1){
        contiguous = false;
        break;
      }
    }
    if (!contiguous) continue;
    const slice = points.slice(start, start + count);
    out.push({
      start,
      end,
      startTime: slice[0].t,
      endTime: slice[slice.length - 1].t,
      mean: slice.reduce((sum, point) => sum + point.value, 0) / count,
    });
  }
  return out;
}

/**
 * Best physically executable charge-then-discharge pair of contiguous windows.
 * The windows cannot overlap and chronology is enforced. The returned spread is
 * a price spread; efficiency-adjusted margin is provided separately.
 */
export function executableContiguousWindowSpread(series, {
  durationHours,
  pointsPerHour = null,
  roundTripEfficiency = 1,
} = {}){
  if (!positive(durationHours)) return null;
  if (!positive(roundTripEfficiency) || roundTripEfficiency > 1) return null;

  const points = normalizedSeries(series);
  const intervalMs = inferredIntervalMs(points);
  if (!intervalMs) return null;

  const inferredPointsPerHour = 3_600_000 / intervalMs;
  const pph = pointsPerHour ?? inferredPointsPerHour;
  if (!positive(pph)) return null;

  const count = durationHours * pph;
  if (!Number.isInteger(count) || count < 1 || points.length < count * 2) return null;

  const candidates = windows(points, count, intervalMs);
  let best = null;
  for (const charge of candidates){
    for (const discharge of candidates){
      if (charge.end >= discharge.start) continue;
      const spread = discharge.mean - charge.mean;
      const margin = discharge.mean - charge.mean / roundTripEfficiency;
      if (!best || margin > best.margin){
        best = { charge, discharge, spread, margin, durationHours, pointsPerHour: pph };
      }
    }
  }
  return best;
}

export function meanDailyExecutableSpread(series, {
  durationHours,
  pointsPerHour = null,
  roundTripEfficiency = 1,
  timezone = 'UTC',
  minimumDays = 30,
} = {}){
  if (!Array.isArray(series) || !positive(durationHours)) return null;
  const byDay = new Map();
  let dayFormatter;
  try {
    dayFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return null;
  }

  for (const point of series){
    const ms = Date.parse(point?.t);
    if (!finite(ms)) continue;
    const day = dayFormatter.format(new Date(ms));
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(point);
  }

  const days = [];
  for (const [day, points] of byDay){
    const result = executableContiguousWindowSpread(points, {
      durationHours,
      pointsPerHour,
      roundTripEfficiency,
    });
    if (result) days.push({ day, ...result });
  }
  if (days.length < minimumDays) return null;
  return {
    spreadMean: days.reduce((sum, day) => sum + day.spread, 0) / days.length,
    marginMean: days.reduce((sum, day) => sum + day.margin, 0) / days.length,
    days: days.length,
    durationHours,
  };
}

