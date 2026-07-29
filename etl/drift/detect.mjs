/* ---------------------------------------------------------------------------
   DRIFT DETECTION.

   Compares what the sources now say against what the analyst has approved, and
   decides which of three things happens:

     nothing          the gap is inside the noise floor
     a report line    the gap is real but moves no published conclusion
     a pull request   the gap is material — evidence attached, human decides

   Nothing here writes. It returns findings; the runner acts on them, and the
   only action available for an analyst-controlled value is opening a pull
   request. That separation is deliberate — detection code that could also apply
   its own conclusions is one refactor away from being an autonomous analyst.

   Impact is computed by re-running the real comparison engine with the proposed
   value substituted into a COPY of the market. The engine is never given a
   mutated registry, so a drift calculation cannot leak into what the site
   renders.
   --------------------------------------------------------------------------- */
import { runBaseCase } from '../../src/comparison/engine.js';
import { FX, FX_SEED_DATE, EXIT_YEARS } from '../../src/comparison/assumptions.js';
import { classifyDrift, impactOf, BAND } from '../../src/governance/materiality.js';
import {
  comparisonAuthority, assumptionAuthority, canMachinePropose,
} from '../../src/governance/authority.js';
import { anchorFor } from '../../src/governance/anchors.js';
import { derivePriceMetrics } from '../../src/derive/priceMetrics.js';
import { arbitrageRevenuePerMW, bridgeAgainstAnchor } from '../../src/derive/merchantBridge.js';

/** Exit year the impact is measured at. The middle of the offered range. */
const IMPACT_EXIT_YEAR = EXIT_YEARS[1] ?? 7;

/** Deep clone a market with one economics field replaced. */
function marketWithOverride(market, path, value){
  const [section, field] = path.split('.');
  const clone = {
    manifest: market.manifest,
    comparison: {
      ...market.comparison,
      [section]: { ...market.comparison[section], [field]: value },
    },
  };
  return clone;
}

/**
 * Impact of substituting one economics value, measured on the real engine.
 * Returns null when the market cannot be run at all — the impact gate then
 * abstains and materiality falls back to the input ceiling.
 */
function economicsImpact(market, path, proposedValue){
  if (!market?.comparison?.economics) return null;
  if (!path.startsWith('economics.')) return null;

  const approvedCase = runBaseCase(market, IMPACT_EXIT_YEAR);
  if (!approvedCase || approvedCase.na) return null;

  const proposedCase = runBaseCase(marketWithOverride(market, path, proposedValue), IMPACT_EXIT_YEAR);
  if (!proposedCase || proposedCase.na) return null;

  return { ...impactOf(approvedCase, proposedCase), exitYear: IMPACT_EXIT_YEAR, approvedCase, proposedCase };
}

/**
 * FX drift. The observation is direct — ECB publishes the rate — so no bridge
 * or anchor is needed.
 *
 * Impact is measured across every market using that currency, because a single
 * FX rate reprices all of them at once. In practice the engine is close to
 * FX-invariant in IRR terms (capex and revenue convert at the same rate), which
 * is why the FX thresholds lean on the always-material ceiling rather than the
 * impact gate. See src/governance/materiality.js.
 */
function detectFxDrift(observations, markets){
  const findings = [];

  for (const [path, observed] of Object.entries(observations || {})){
    if (!path.startsWith('FX.')) continue;

    const authority = assumptionAuthority(path);
    if (!canMachinePropose(authority)) continue;

    const ccy = path.slice(3);
    const approved = FX[ccy];
    if (typeof approved !== 'number') continue;

    /* No impact measurement is attached to an FX finding, deliberately.

       The engine reads FX from module scope rather than from the market, so
       there is no honest way to substitute one rate for a single market the way
       economicsImpact() substitutes an economics field. More importantly, the
       measurement would mostly show nothing: the model converts capex and
       revenue at the same rate, so IRR is very nearly FX-invariant and only the
       USD headline moves. Reporting "IRR unchanged" would understate a rate
       move that genuinely changes every published dollar figure.

       So FX relies on its input thresholds, which are set with that in mind. */
    findings.push({
      kind: 'fx',
      marketId: null,
      path,
      authority,
      approved,
      observed,
      evidence: {
        source: 'ECB euro foreign-exchange reference rates',
        approvedAsOf: FX_SEED_DATE,
        note: 'Approved rate lives in src/comparison/assumptions.js and is frozen until merged.',
        affectedMarkets: markets.filter(m => m.manifest.currency === ccy).map(m => m.manifest.id),
      },
      ...classifyDrift(path, approved, observed, null),
    });
  }

  return findings;
}

/**
 * Merchant-revenue drift, measured through the arbitrage bridge against an
 * analyst-set anchor.
 *
 * With no anchor recorded this returns an informational finding and never a
 * proposal — the platform has an observation but nothing to compare it to, and
 * inventing the comparison is exactly the judgement it must not make.
 */
function detectMerchantDrift(dataset, snapshot, market){
  const path = 'economics.merchGross';
  const authority = comparisonAuthority(path);
  if (!canMachinePropose(authority)) return null;

  const durationHours = market?.comparison?.archetype?.durationHours;
  const timezone = market?.manifest?.timezone;
  if (!durationHours || !timezone) return null;

  const metrics = derivePriceMetrics(snapshot.series, { timezone, durationHours });
  const arb = arbitrageRevenuePerMW(metrics);

  if (!arb){
    return {
      kind: 'merchant', marketId: market.manifest.id, path, authority,
      band: BAND.NOISE, informational: true,
      metrics,
      reason: [
        `Not enough complete trading days to compute an arbitrage index (${metrics.spreadDays} of 28 needed)`,
        `完整交易日不足，无法计算套利指数（${metrics.spreadDays}/28）`,
      ],
    };
  }

  const approved = market.comparison.economics.merchGross;
  const anchor = anchorFor(market.manifest.id, path);
  const bridge = bridgeAgainstAnchor(arb.revenuePerMW, anchor, approved);

  /* SEASONALITY GUARD.

     An arbitrage index over a partial year is not comparable with one over a
     full year, and the error is systematic rather than random: spreads in most
     of these markets are far wider in winter than in shoulder season, so a
     window that happens to be mid-summer understates and a mid-winter one
     overstates. Compared against an annual anchor, either produces a confident
     proposal to move merchGross by tens of percent for no reason but the
     calendar.

     This bites hardest on a cold start, when backfill is still filling the
     window a few weeks per run — exactly when someone is most likely to be
     watching and least likely to question a number that looks precise.

     So a short window is reported, never proposed. */
  const SEASONALLY_SAFE_DAYS = 300;
  const seasonallyComparable = metrics.spreadDays >= SEASONALLY_SAFE_DAYS
    && (!anchor?.windowDays || Math.abs(metrics.spreadDays - anchor.windowDays) <= 60);

  if (!bridge.computable){
    /* The useful state on a fresh install: the index is computed and printed so
       the analyst can record it as an anchor, but nothing is proposed. */
    return {
      kind: 'merchant', marketId: market.manifest.id, path, authority,
      band: BAND.NOISE, informational: true, anchorMissing: !anchor,
      currentIndex: arb.revenuePerMW, metrics, bridge, arb,
      reason: bridge.reason,
    };
  }

  const proposed = bridge.impliedMerchGross;
  const impact = economicsImpact(market, path, proposed);

  const base = {
    kind: 'merchant', marketId: market.manifest.id, path, authority,
    currentIndex: arb.revenuePerMW, anchor, metrics, bridge, arb,
    evidence: {
      source: dataset.source.name,
      url: dataset.source.url,
      coverage: snapshot.coverage,
      spreadDays: metrics.spreadDays,
      spreadMean: metrics.spreadMean,
      anchorAsOf: anchor.asOf,
      anchorNote: anchor.note,
      anchorWindowDays: anchor.windowDays ?? null,
    },
    ...classifyDrift(path, approved, proposed, impact),
    impact,
  };

  if (!seasonallyComparable && base.band === BAND.MATERIAL){
    // Demote rather than drop: the reader still sees it, with the reason.
    return {
      ...base,
      band: BAND.REPORTABLE,
      demotedFrom: BAND.MATERIAL,
      reason: [
        `Would be material, but the ${metrics.spreadDays}-day window is not seasonally comparable` +
        `${anchor.windowDays ? ` with the ${anchor.windowDays}-day anchor` : ' with an annual anchor'}` +
        ` — proposing a change on it would be measuring the calendar, not the market`,
        `本应判定为重大，但 ${metrics.spreadDays} 天窗口在季节性上不可比` +
        `${anchor.windowDays ? `（锚点为 ${anchor.windowDays} 天）` : '（锚点为年度窗口）'}` +
        ` — 据此提出变更实为度量季节而非市场`,
      ],
    };
  }

  return base;
}

/**
 * Run every detector over the run's results.
 *
 * @param {object} args
 * @param {Array}  args.results   per-dataset { dataset, snapshot, observations }
 * @param {Array}  args.markets   the registry
 * @returns {{findings: Array, material: Array, reportable: Array, informational: Array}}
 */
export function detectDrift({ results, markets }){
  const findings = [];

  for (const r of results){
    if (!r.snapshot) continue;

    if (r.observations){
      findings.push(...detectFxDrift(r.observations, markets));
    }

    if (r.dataset.marketId && Array.isArray(r.snapshot.series) && r.snapshot.series.length > 0){
      const market = markets.find(m => m.manifest.id === r.dataset.marketId);
      if (market){
        const f = detectMerchantDrift(r.dataset, r.snapshot, market);
        if (f) findings.push(f);
      }
    }
  }

  return {
    findings,
    material: findings.filter(f => f.band === BAND.MATERIAL),
    reportable: findings.filter(f => f.band === BAND.REPORTABLE),
    informational: findings.filter(f => f.informational),
  };
}

export { BAND };
