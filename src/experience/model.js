import { markets, byId } from '../markets/registry.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { marketAt } from '../comparison/designFit.js';
import { runCase, runBaseCase } from '../comparison/engine.js';
import { runScenarioSet } from '../comparison/refinement.js';
import { sizeProjectDebt, riskClassFor } from '../economics/projectDebt.js';

export const CALLS = {
  'enter-now': ['Advance', '优先推进'],
  'build-position': ['Build position', '提前布局'],
  opportunistic: ['Situational', '择机投入'],
  wait: ['Watch', '保持观察'],
  avoid: ['Pass', '暂缓投入'],
  'not-accessible': ['Not accessible', '暂不开放'],
  research: ['Research', '继续研究'],
};
export const REGIONS = {
  europe: ['Europe', '欧洲'], apac: ['Asia Pacific', '亚太'], americas: ['North America', '北美'],
};
export const LENSES = {
  infraFund: ['Infrastructure fund', '基础设施基金'],
  strategic: ['Strategic investor', '战略投资者'],
  foreignFirstTimer: ['New market entrant', '首次进入者'],
  developer: ['Developer', '开发商'],
};
export const snapshotDate = HOME_BRIEFING.on;
export function regionFor(market) {
  const currency = market.manifest.currency;
  return ['USD', 'CAD'].includes(currency) ? 'americas' : ['AUD', 'JPY'].includes(currency) ? 'apac' : 'europe';
}

export function opportunities(lens = 'infraFund') {
  const chosen = HOME_BRIEFING.lenses[lens] || HOME_BRIEFING.lenses.infraFund;
  const seen = new Set();
  const rows = chosen.rows.filter(row => !seen.has(row.market) && seen.add(row.market)).map(row => {
    const market = byId(row.market);
    const play = HOME_BRIEFING.plays[`${row.market}/${row.play}`];
    return { ...row, market, play, econ: play?.econ || {}, region: regionFor(market) };
  });
  for (const market of markets) {
    if (seen.has(market.manifest.id)) continue;
    const result = runBaseCase(market, 5);
    rows.push({ market, play: null, call: 'research', fit: null, region: regionFor(market),
      econ: { priced: !result.na, hold: result.irrHold, exit: result.irrExit,
        secured: result.securedShare, securedYears: result.securedYears, moic: result.moic } });
  }
  return rows.map((row, index) => ({ ...row, rank: index + 1, id: row.market.manifest.id }));
}

export function caseFor(row) {
  let market = row.market;
  if (Number.isFinite(row.play?.grantPct)) {
    market = { ...market, comparison: { ...market.comparison,
      economics: { ...market.comparison.economics, grantPct: row.play.grantPct } } };
  }
  const variant = row.play ? marketAt(market, row.play.route, row.play.hours) : market;
  if (variant.na || row.econ.priced === false) return { row, unavailable: true };
  const base = row.play ? runCase(variant, row.play.route, 5, row.econ.runOptions || {}) : runBaseCase(variant, 5);
  if (base.na) return { row, unavailable: true };
  const scenarios = runScenarioSet(variant, base.strategyId, 5, row.econ.runOptions || {});
  const debt = sizeProjectDebt(base, { riskClass: riskClassFor(variant, base.strategyId) });
  const bridge = revenueBridge(base);
  // Keep the original base debt schedule in downside comparisons. Re-sizing debt
  // in a downside would silently remove the very funding risk being inspected.
  const cover = result => {
    const ratios = base.eb.map((_, i) => {
      const payment = (debt?.service[i] || 0) + (debt?.maturityRepayment[i] || 0);
      return payment > 0 ? (result.eb[i] || 0) / payment : null;
    }).filter(Number.isFinite);
    return ratios.length ? Math.min(...ratios) : null;
  };
  return { row, variant, base, bear: scenarios.bear.result, debt, bridge,
    coverBase: cover(base), coverBear: cover(scenarios.bear.result), overrides: scenarios.bear.overrides };
}

export function revenueBridge(result) {
  const fixed = result.secY?.[0] ?? result.capY?.[0] ?? 0;
  const renewal = result.aucY?.[0] ?? 0;
  const trading = result.mchY?.[0] ?? 0;
  // svcY is the OEM service COST, not ancillary-services revenue. Trading already
  // includes ancillary services; the engine does not expose a separate net split.
  const service = result.svcY?.[0] ?? 0;
  const operating = fixed + renewal + trading - service - result.eb[0];
  return { fixed, renewal, trading, service, operating, net: result.eb[0], gross: fixed + renewal + trading };
}

export function marketName(row) { return HOME_BRIEFING.markets[row.id]?.name || row.market.manifest.name; }
export function caseUrl(row) { return `/markets/${row.market.manifest.slug}`; }
export function compareUrl(ids = []) { return `/returns${ids.length ? `?compare=${ids.join(',')}` : ''}`; }
export const finite = Number.isFinite;
export const pct = value => finite(value) ? `${(value * 100).toFixed(1)}%` : '—';
export const share = value => finite(value) ? `${Math.round(value * 100)}%` : '—';
export const multiple = value => finite(value) ? `${value.toFixed(2)}×` : '—';
export function money(value, currency = 'USD') {
  if (!finite(value)) return '—';
  const abs = Math.abs(value);
  return `${currency} ${abs >= 1e6 ? (value / 1e6).toFixed(2) + 'm' : (value / 1e3).toFixed(1) + 'k'}`;
}
