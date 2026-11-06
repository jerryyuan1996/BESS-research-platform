/* Read-only coverage audit. This does not impute values, classify unpublished
   intervals, or change the rolling-window/merge semantics of any connector. */
export function auditIntervals(series, { intervalMinutes = 30 } = {}){
  if (!Number.isInteger(intervalMinutes) || intervalMinutes < 1) throw new Error('Invalid interval minutes');
  const step = intervalMinutes * 60_000;
  const times = new Set();
  let duplicatePoints = 0, malformedPoints = 0, offGridPoints = 0;
  for (const p of Array.isArray(series) ? series : []){
    const ms = Date.parse(p?.t);
    if (!Number.isFinite(ms) || typeof p?.v !== 'number' || !Number.isFinite(p.v)){
      malformedPoints++;
      continue;
    }
    if (ms % step !== 0){ offGridPoints++; continue; }
    if (times.has(ms)) duplicatePoints++;
    times.add(ms);
  }
  const sorted = [...times].sort((a, b) => a - b);
  const missing = [];
  const from = sorted[0], to = sorted.at(-1);
  if (sorted.length && (to - from) / step > 2_000_000) throw new Error('Coverage audit exceeds bounded interval count');
  for (let t = from; t <= to; t += step){
    if (!times.has(t)) missing.push(new Date(t).toISOString());
  }
  return {
    scope: 'between first and last valid observed interval only', intervalMinutes,
    from: sorted.length ? new Date(from).toISOString() : null,
    to: sorted.length ? new Date(to).toISOString() : null,
    expectedIntervals: sorted.length ? (to - from) / step + 1 : 0,
    observedIntervals: times.size, missingIntervals: missing.length,
    duplicatePoints, malformedPoints, offGridPoints, missing,
  };
}
