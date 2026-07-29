/* ---------------------------------------------------------------------------
   MATERIALITY — when drift is worth a human's attention.

   Drift is the gap between what a public source now says and what the approved
   assumption says. Some gaps deserve a pull request. Most deserve a line in a
   report. A great many deserve nothing at all, and a pipeline that cannot tell
   the difference trains its reader to ignore it.

   Three bands:

     NOISE        below the field's floor. Not reported. Daily FX wobble.
     REPORTABLE   real, but does not move a decision. Drift report only.
     MATERIAL     opens an evidence-backed pull request. Never auto-merges.

   Two gates decide MATERIAL, and the second is the one that matters:

     1. Input gate    — the observed value differs from the approved value by
                        more than the field's declared floor.
     2. Impact gate   — recomputing the model with the observed value moves a
                        published output by more than a decision-relevant amount.

   A change is material when it passes the input gate AND moves the model, or
   when the input move is so large that it warrants a look regardless of what the
   model does with it.

   The impact gate exists because input-space thresholds alone are misleading
   here. FX is the clean example: the comparison converts capex and revenue at
   the same rate, so a 5% FX move barely touches IRR — it rescales the USD
   headline and leaves the ordering intact. Filing a PR that says "GBP moved 5%,
   IRR unchanged" every month is how a governance process dies. Conversely a
   modest merchant-revenue revision can move IRR by a full point, because it is
   net of opex and lands entirely in the cash flow.

   Thresholds are declared per field, never inferred. They are methodology and
   live under analyst control like any other — automation reads them and does not
   write them.
   --------------------------------------------------------------------------- */

export const BAND = {
  NOISE: 'noise',
  REPORTABLE: 'reportable',
  MATERIAL: 'material',
};

/**
 * Per-field drift thresholds, as fractions of the approved value.
 *
 *   floor     below this, the difference is noise and is not reported at all.
 *   ceiling   at or above this, the difference is material regardless of the
 *             modelled impact — a move this large is a fact about the market
 *             worth surfacing even when the IRR happens not to care.
 *
 * Where a field has no entry the DEFAULT_THRESHOLD applies. Fields whose
 * authority is METHODOLOGY never reach this code: automation cannot propose
 * against them, so no threshold is meaningful.
 */
export const DRIFT_THRESHOLDS = {
  // FX: floors set above ordinary daily movement. High ceiling because the
  // impact gate almost never fires for FX (see the module note above), so the
  // ceiling is what actually surfaces a genuine regime change in a currency.
  'FX.AUD': { floor: 0.02, ceiling: 0.08 },
  'FX.GBP': { floor: 0.02, ceiling: 0.08 },
  'FX.EUR': { floor: 0.02, ceiling: 0.08 },
  'FX.JPY': { floor: 0.02, ceiling: 0.08 },

  // Merchant revenue is the most impactful input in the model: it is gross of
  // nothing and net of opex, so it flows almost entirely into the cash flow.
  // A low floor is justified because the impact gate will filter it anyway.
  'economics.merchGross': { floor: 0.03, ceiling: 0.20 },
  'economics.services': { floor: 0.05, ceiling: 0.30 },

  // Capacity revenue: auction clearing prices are published facts, so drift is
  // unambiguous and the floor can be tight.
  'economics.contracted': { floor: 0.02, ceiling: 0.10 },
  'economics.securedContracted': { floor: 0.02, ceiling: 0.10 },

  // Capex: moves slowly, sourced from cost indices rather than a live feed.
  'economics.capexPerMW': { floor: 0.04, ceiling: 0.15 },
  'economics.opexPerMW': { floor: 0.05, ceiling: 0.20 },

  // Tenor fields are integers; any change at all is structural, so the floor is
  // effectively "not equal".
  'economics.contractYears': { floor: 0.001, ceiling: 0.001 },
  'economics.securedContractYears': { floor: 0.001, ceiling: 0.001 },

  'economics.grantPct': { floor: 0.001, ceiling: 0.001 },
};

export const DEFAULT_THRESHOLD = { floor: 0.05, ceiling: 0.25 };

/**
 * Impact gate, in output space. Applied to the model outputs a reader actually
 * makes decisions on.
 *
 * 50 bps of IRR is roughly the resolution at which this platform's league table
 * reorders; below that a change is not visible in any conclusion the site draws.
 */
export const IMPACT_THRESHOLDS = {
  irrExit: 0.005,        // 50 bps on exit IRR
  irrHold: 0.005,        // 50 bps on hold-to-life IRR
  moic: 0.05,            // 0.05x on multiple
  securedShare: 0.03,    // 3 percentage points on the secured-revenue share
};

/** Threshold pair for a field. */
export function thresholdFor(path){
  return DRIFT_THRESHOLDS[path] ?? DEFAULT_THRESHOLD;
}

/**
 * Relative difference between an observed and an approved value.
 * Returns null when the comparison is not meaningful — a non-finite input, or an
 * approved value of zero, where "percent change" has no defined meaning and
 * pretending otherwise would produce an infinite drift every run.
 */
export function relativeDelta(approved, observed){
  if (typeof approved !== 'number' || typeof observed !== 'number') return null;
  if (!Number.isFinite(approved) || !Number.isFinite(observed)) return null;
  if (approved === 0) return null;
  return (observed - approved) / Math.abs(approved);
}

/**
 * Does a recomputed model result differ from the approved result by enough to
 * matter? Compares every gated output and returns the ones that breached.
 *
 * @param {object} approvedCase  engine result under approved assumptions
 * @param {object} proposedCase  engine result under the observed value
 * @returns {{breached: boolean, moves: Array<{metric, approved, proposed, delta, threshold}>}}
 */
export function impactOf(approvedCase, proposedCase){
  const moves = [];
  if (!approvedCase || !proposedCase || approvedCase.na || proposedCase.na){
    return { breached: false, moves };
  }

  for (const [metric, threshold] of Object.entries(IMPACT_THRESHOLDS)){
    const a = approvedCase[metric], p = proposedCase[metric];
    if (typeof a !== 'number' || typeof p !== 'number') continue;
    if (!Number.isFinite(a) || !Number.isFinite(p)) continue;
    const delta = p - a;
    if (Math.abs(delta) >= threshold){
      moves.push({ metric, approved: a, proposed: p, delta, threshold });
    }
  }
  return { breached: moves.length > 0, moves };
}

/**
 * Classify one drift observation into a band.
 *
 * `impact` is optional. When it is absent — because the field does not feed the
 * comparison engine, or the market is not engine-ready — the input gate decides
 * alone, and the field must clear its ceiling to be material. That is the
 * conservative reading: with no way to show downstream impact, only an
 * unambiguously large move justifies a pull request.
 *
 * @param {string} path      dotted field path, e.g. 'economics.merchGross'
 * @param {number} approved  the approved value
 * @param {number} observed  the value the source now reports
 * @param {object} [impact]  result of impactOf(), when computable
 * @returns {{band, path, approved, observed, delta, pct, threshold, impact, reason}}
 */
export function classifyDrift(path, approved, observed, impact = null){
  const pct = relativeDelta(approved, observed);
  const threshold = thresholdFor(path);
  const base = { path, approved, observed, delta: observed - approved, pct, threshold, impact };

  if (pct === null){
    // Not comparable as a ratio. Report it so a human sees the source changed
    // shape, but never escalate to a PR on a number the pipeline cannot reason
    // about.
    return {
      ...base, band: BAND.REPORTABLE,
      reason: ['Not comparable as a ratio — reported for review', '无法按比例比较 — 提交人工复核'],
    };
  }

  const magnitude = Math.abs(pct);

  if (magnitude < threshold.floor){
    return {
      ...base, band: BAND.NOISE,
      reason: [`Within the ${(threshold.floor * 100).toFixed(1)}% noise floor`,
        `处于 ${(threshold.floor * 100).toFixed(1)}% 噪声阈值内`],
    };
  }

  if (magnitude >= threshold.ceiling){
    return {
      ...base, band: BAND.MATERIAL,
      reason: [`Moved ${(magnitude * 100).toFixed(1)}%, at or above the ${(threshold.ceiling * 100).toFixed(1)}% always-material ceiling`,
        `变动 ${(magnitude * 100).toFixed(1)}%，达到或超过 ${(threshold.ceiling * 100).toFixed(1)}% 重大性上限`],
    };
  }

  if (impact && impact.breached){
    const led = impact.moves[0];
    return {
      ...base, band: BAND.MATERIAL,
      reason: [`Moves ${led.metric} by ${formatMove(led)} — past the decision threshold`,
        `使 ${led.metric} 变动 ${formatMove(led)} — 超过决策阈值`],
    };
  }

  return {
    ...base, band: BAND.REPORTABLE,
    reason: impact
      ? ['Real but does not move any published output past its threshold', '确有变动，但未使任何已发布指标越过阈值']
      : ['Real; downstream impact not computable for this field', '确有变动；该字段的下游影响无法计算'],
  };
}

function formatMove(move){
  return move.metric === 'moic'
    ? `${move.delta >= 0 ? '+' : ''}${move.delta.toFixed(3)}x`
    : `${move.delta >= 0 ? '+' : ''}${(move.delta * 100).toFixed(2)} pp`;
}
