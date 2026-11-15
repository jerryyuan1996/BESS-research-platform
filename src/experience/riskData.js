import { REVENUE_EVIDENCE_CLASS } from '../governance/revenueEvidence.js';

/** A citation alone does not make a dispersed or practitioner band observed.
 * Keep the band's full bilingual basis beside this conservative short label. */
export function sensitivityEvidence(band) {
  const explanation = [band?.source, ...(band?.basis || [])].join(' ');
  const assumption = /assum|practitioner|judg[e]?ment|convention|placeholder|no (?:published|disclosed|measured|source)|never published|not sourced|platform seed|假设|惯例|占位|实务|未披露|无.*来源/i.test(explanation);
  return band?.source && band?.basis && ['sourced','limit'].includes(band.kind) && !assumption ? 'sourced' : 'assumed';
}

/** Rank by the largest absolute change from the same base all-equity IRR.
 * A failed return stays missing; it must never become a zero sensitivity. */
export function rankedSensitivities(ranges, baseIRR, evaluate) {
  return Object.entries(ranges).map(([key, band]) => {
    const ends = ['min','max'].filter(end => Number.isFinite(band?.[end])).map(end => {
      const value = band[end], hold = evaluate(key, value);
      return { end, value, hold, delta:Number.isFinite(hold) && Number.isFinite(baseIRR) ? hold-baseIRR : null };
    });
    const deltas = ends.map(e => e.delta).filter(Number.isFinite);
    return { key, band, evidence:sensitivityEvidence(band), ends,
      effect:deltas.length ? Math.max(...deltas.map(Math.abs)) : null };
  }).filter(f => f.ends.length).sort((a,b) => (b.effect ?? -1)-(a.effect ?? -1) || a.key.localeCompare(b.key));
}

/** The model currently carries one evidence record for its fixed-income pool.
 * Do not infer component weights (including a pooled toll/capacity case). */
export function fixedIncomeByEvidence(investment) {
  const total = investment.bridge.fixed / investment.fxToUSD;
  const evidence = investment.fixedRevenueEvidence;
  return { total, currency:investment.currency,
    contracted:investment.contractConfirmed && evidence?.projectBinding &&
      evidence.evidenceClass === REVENUE_EVIDENCE_CLASS.EXECUTED_OBSERVED_AWARD ? total : 0,
    classes:total === 0 ? [] : [{ evidenceClass:evidence?.evidenceClass ?? null, amount:total, evidence }] };
}
