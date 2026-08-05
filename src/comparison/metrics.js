/* ---------------------------------------------------------------------------
   Comparison metric catalogue.

   The prototype's league table hardcoded thirteen rows inline, each with its own
   value accessor and formatter. Those rows are now a catalogue: id, label,
   direction (is high good?), accessor, formatter, and whether the metric is
   rank-comparable at all.

   This is what makes the future "compare only these metrics across only these
   markets" UI a filter rather than a rewrite (brief section 23). The UI itself is
   deliberately not built.

   Rows, labels, order, formatters and the best/worst logic are unchanged from the
   prototype. Only the packaging differs.
   --------------------------------------------------------------------------- */
import { fmtN, fmtPct, fmtUSD, fmtUSDk, fmtIRR, fmtX, fmtIRRor } from '../utils/formatting.js';

/**
 * @typedef {object} Metric
 * @property {string}  id
 * @property {[string,string]} label
 * @property {boolean} [hi]        true = higher is better, false = lower is better
 * @property {boolean} [ctx]       context-only: shown but never ranked or coloured
 * @property {(m,r)=>number} [value]   ranking value; omitted for ctx metrics
 * @property {(m,r)=>string}  format
 */

/** @type {Metric[]} */
export const METRICS = [
  {
    id: 'composite', ctx: true,
    label: ['Composite score (own context — not comparable)', '综合评分（各自口径 — 不可比）'],
    format: (m) => m.comparison.score.composite + '/100',
  },
  /* "Secured", not "contracted".

     A Japanese Capacity Market main-auction payment covers one delivery year and
     must be re-won after that. Calling it contracted would put a 1-year award in
     the same row as Poland's 17-year contract. The next row keeps the tenor
     visible so the two are never confused. */
  {
    id: 'securedShare', hi: true,
    label: ['Secured share of year-1 revenue', '第1年已锁定收入占比'],
    value: (m, r) => (r.evidenceSecuredShare || 0) * 100,
    format: (m, r) => fmtPct((r.evidenceSecuredShare || 0) * 100, 0),
  },
  {
    id: 'securedTenor', hi: true,
    label: ['Secured tenor (years)', '锁定年限（年）'],
    value: (m, r) => r.evidenceSecuredYears || 0,
    format: (m, r) => {
      const y = r.evidenceSecuredYears || 0;
      return y || '—';
    },
  },
  {
    id: 'capacityRevenue', hi: true,
    label: ['Capacity revenue (USD k/MW/yr)', '容量收入（美元k/MW/年）'],
    value: (m, r) => r.capY[0],
    format: (m, r) => (r.capY[0] ? fmtUSDk(r.capY[0]) : '$0'),
  },
  /* The first year the capacity payment must be re-won. Year 1 is secured by
     construction, so year 2 is where the exposure actually starts. An em dash
     for markets whose capacity revenue is contracted for its full tenor — they
     have no re-auction exposure inside the window. */
  {
    id: 'reauctionExposure', hi: false,
    label: ['Capacity revenue exposed to re-auction (yr 2, USD k/MW)', '面临重新拍卖的容量收入（第2年，美元k/MW）'],
    value: (m, r) => (r.aucY ? r.aucY[1] : 0),
    format: (m, r) => {
      if (!r.aucY || r.riskClass !== 'auction-renewal') return '—';
      return r.aucY[1] ? fmtUSDk(r.aucY[1]) : '$0';
    },
  },
  {
    id: 'merchantRevenue', hi: true,
    label: ['Merchant + services, net (USD k/MW/yr)', '市场化+服务净收入（美元k/MW/年）'],
    value: (m, r) => r.mchY[0],
    format: (m, r) => fmtUSDk(r.mchY[0]),
  },
  {
    id: 'capexPerKWh', hi: false,
    label: ['Capex (USD/kWh)', '造价（美元/kWh）'],
    value: (m, r) => r.capexG / (m.comparison.archetype.durationHours * 1000),
    format: (m, r) => fmtUSD(r.capexG / (m.comparison.archetype.durationHours * 1000)),
  },
  {
    id: 'kwPerM', hi: true,
    label: ['kW controlled per $1M (net of grant)', '每100万美元可控kW（扣除补贴）'],
    value: (m, r) => r.kwPerM,
    format: (m, r) => fmtN(r.kwPerM),
  },
  {
    id: 'yield1', hi: true,
    label: ['Year-1 cash yield (EBITDA / net capex)', '第1年现金收益率（EBITDA/净造价）'],
    value: (m, r) => r.yield1 * 100,
    format: (m, r) => fmtPct(r.yield1 * 100),
  },
  {
    id: 'payback', hi: false,
    label: ['Simple payback (years)', '简单回收期（年）'],
    value: (m, r) => r.payback || 99,
    format: (m, r) => r.payback || '—',
  },
  {
    id: 'irrHold', hi: true,
    label: ['15-yr unlevered IRR', '15年无杠杆IRR'],
    value: (m, r) => r.irrHold,
    /* `localise` is supplied by the caller — see the note on fmtIRRor. A case
       whose cash flows never return the capital has no IRR to print, and that
       has to read differently from a route that does not exist. */
    format: (m, r, localise) => fmtIRRor(r.irrHold, r.irrHoldAbsent, localise),
  },
  {
    id: 'moic', hi: true,
    // exit year is interpolated by the caller
    label: (exitYear) => ['Exit MOIC at year ' + exitYear, '第' + exitYear + '年退出MOIC'],
    value: (m, r) => r.moic,
    format: (m, r) => fmtX(r.moic),
  },
  {
    id: 'connectionRisk', hi: false,
    label: ['Connection risk score (lower = safer)', '并网风险评分（越低越安全）'],
    value: (m) => m.comparison.score.connectionRisk,
    format: (m) => Math.round(m.comparison.score.connectionRisk) + '/100',
  },
  {
    id: 'pipelineRatio', ctx: true,
    label: ['Pipeline / operating ratio (own basis)', '管线对在运倍数（各自口径）'],
    format: (m) => m.comparison.narrative.pipelineRatio,
  },
  {
    id: 'executedShare', hi: true,
    label: ['Executed project share (yr 1)', '已执行项目占比（第1年）'],
    value: (m, r) => (r.executedShare || 0) * 100,
    format: (m, r) => fmtPct((r.executedShare || 0) * 100, 0),
  },
  {
    id: 'proxyShare', hi: false,
    label: ['Fixed revenue based on proxy (yr 1)', '基于代理值的固定收入（第1年）'],
    value: (m, r) => (r.proxyShare || 0) * 100,
    format: (m, r) => fmtPct((r.proxyShare || 0) * 100, 0),
  },
  {
    id: 'evidenceConfidence', hi: true,
    label: ['Evidence confidence', '证据置信度'],
    value: (m, r) => r.evidenceConfidenceScore,
    format: (m, r) => r.evidenceConfidenceScore + '/10',
  },
  {
    id: 'observedNpv', hi: true,
    label: ['Observed/disclosed share of revenue NPV', '收入NPV中已观察/已披露占比'],
    value: (m, r) => (r.evidenceNpv?.shares?.observed_disclosed || 0) * 100,
    format: (m, r) => fmtPct((r.evidenceNpv?.shares?.observed_disclosed || 0) * 100, 0),
  },
  {
    id: 'capexCompleteness', hi: true,
    label: ['All-in capex completeness', '全口径资本开支完整度'],
    value: (m, r) => (r.capexCompleteness?.score || 0) * 100,
    format: (m, r) => fmtPct((r.capexCompleteness?.score || 0) * 100, 0),
  },
];

/**
 * Best / worst index for a metric across N markets.
 *
 * Prototype behaviour, preserved exactly: sort a copy of the values, then
 * indexOf the extremes. With ties that means the first market in registry order
 * wins the highlight — which is what the prototype did.
 *
 * Markets whose result is unavailable (`na`) are excluded from ranking.
 */
export function rank(metric, markets, results){
  if (metric.ctx || !metric.value) return { best: -1, worst: -1 };
  const vals = markets.map(m => {
    const r = results.get(m.manifest.id);
    return r && !r.na ? metric.value(m, r) : null;
  });
  const live = vals.filter(v => v != null && Number.isFinite(v));
  if (live.length === 0) return { best: -1, worst: -1 };
  const sorted = live.slice().sort((a, b) => (metric.hi ? b - a : a - b));
  return { best: vals.indexOf(sorted[0]), worst: vals.indexOf(sorted[sorted.length - 1]) };
}

/** Resolves a metric label, which may be a function of exit year. */
export const metricLabel = (metric, exitYear) =>
  (typeof metric.label === 'function' ? metric.label(exitYear) : metric.label);
