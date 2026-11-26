import { buildSummary } from '../lib/summarize.mjs';
import { sha256 } from '../lib/envelope.mjs';
import { derivePriceMetrics } from '../../src/derive/priceMetrics.js';
import { arbitrageRevenuePerMW } from '../../src/derive/merchantBridge.js';
import { completeTariffDays, deriveNetworkValue } from '../../src/derive/networkValue.js';
import { STORAGE_TARIFFS } from '../../src/markets/nem/data/storageTariffs.js';
import { opportunityById } from '../../src/opportunities/catalog.js';

export function summarize(snapshot) {
  const reference = opportunityById('nem-sub5');
  const options = { powerMW: reference.powerMW, durationHours: reference.hours };
  const timezone = 'Australia/Brisbane'; // fixed UTC+10 NEM calendar
  const days = new Map([[timezone, completeTariffDays(snapshot.series, timezone)]]);
  const complete = days.get(timezone).flatMap(day => day.points.map(p => ({ t: new Date(p.ms).toISOString(), v: p.v })));
  const metrics = derivePriceMetrics(complete, { timezone, durationHours: options.durationHours });
  const summary = buildSummary(snapshot, metrics, { timezone, durationHours: options.durationHours, arbitrage: arbitrageRevenuePerMW(metrics) });
  const region = snapshot.datasetId.split('-')[1].toUpperCase();
  summary.dispatch = { region, calendar: 'AEST UTC+10', completeDays: days.get(timezone).length,
    underReviewAtIssue: snapshot.series.filter(p => p.dispatchStatus === 'NOT FIRM').length };
  const observedAt = snapshot.coverage.to?.slice(0,10);
  summary.storageTariffs = {};
  for (const tariff of STORAGE_TARIFFS.filter(t => t.region === region)) {
    const scenarios = tariff.id === 'sapn' ? [['sapn', false], ['sapn-cbd', true]] : [[tariff.id, false]];
    if (!days.has(tariff.timezone)) days.set(tariff.timezone, completeTariffDays(snapshot.series, tariff.timezone));
    const billingDays = days.get(tariff.timezone);
    for (const [id, cbd] of scenarios) {
      let result;
      if (observedAt && observedAt > tariff.effectiveTo) result = { status: 'tariff-expired', days: billingDays.length };
      else result = deriveNetworkValue(billingDays, tariff, { ...options, cbd }) ?? { status: 'insufficient-days', days: billingDays.length };
      summary.storageTariffs[id] = { ...result, financialYear: tariff.financialYear, ...options };
    }
  }
  delete summary.summaryChecksum;
  summary.contentChecksum = sha256({ source: summary.sourceSnapshot, dispatch: summary.dispatch, tariff: summary.storageTariffs, metrics: summary.derived, arbitrage: summary.arbitrage });
  summary.summaryChecksum = sha256(summary);
  return summary;
}
