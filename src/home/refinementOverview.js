import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { chip } from '../components/chip.js';
import { scatterChart } from '../charts/index.js';
import { fmtIRRor, fmtPct } from '../utils/formatting.js';
import { runScenarioSet } from '../comparison/refinement.js';
import { runPortfolioScenarios } from '../comparison/portfolioScenario.js';
import { baseStrategy } from '../comparison/strategies.js';

const CONSENSUS = {
  aligned: ['Aligned', '一致'],
  more_bullish: ['Dashboard more bullish', '看板偏乐观'],
  stale: ['Corrected', '已更正'],
};

const CONSENSUS_CHIP = { aligned:'good', more_bullish:'serious', stale:'warn' };

const irr = result => fmtIRRor(result?.irrHold, result?.irrHoldAbsent, L);
const pct = value => fmtPct((value || 0) * 100, 0);

function decisionRows(marketList, exitYear){
  return marketList.map(market => {
    const scenarios = runScenarioSet(market, baseStrategy(market), exitYear);
    return { market, scenarios, result:scenarios.base.result, profile:market.comparison.refinement };
  });
}

function scenarioTable(rows){
  const head = [
    ['Market', '市场'],
    ['Bear / Base / Bull hold IRR', '悲观/基准/乐观持有IRR'],
    ['Secured', '已锁定'],
    ['Executed', '已执行'],
    ['Proxy fixed', '代理固定收入'],
    ['Evidence', '证据'],
    ['Review position', '复核立场'],
    ['Next approval gate', '下一审批门槛'],
  ];
  return h('div', { class:'tbl-wrap hm' }, h('table', {},
    h('thead', {}, h('tr', {}, head.map((label, index) =>
      h('th', { class:index > 1 && index < 6 ? 'num' : '' }, L(label))))),
    h('tbody', {}, rows.map(({ market, scenarios, result, profile }) =>
      h('tr', {},
        h('td', {}, h('b', {}, market.manifest.flag + ' ' + L(market.manifest.shortName))),
        h('td', {}, [scenarios.bear, scenarios.base, scenarios.bull].map(item => irr(item.result)).join(' / ')),
        h('td', { class:'num' }, pct(result.evidenceSecuredShare)),
        h('td', { class:'num' }, pct(result.executedShare)),
        h('td', { class:'num' }, pct(result.proxyShare)),
        h('td', { class:'num' }, profile.confidenceScore + '/10'),
        h('td', {}, chip(CONSENSUS_CHIP[profile.consensus.status] || 'info',
          CONSENSUS[profile.consensus.status] || ['Review required', '需要复核'])),
        h('td', {}, profile.investmentGate?.[0] || L(['Project evidence', '项目证据'])))))));
}

function evidenceScatter(card, rows){
  const points = rows
    .filter(({ result }) => Number.isFinite(result?.irrHold))
    .map(({ market, result, profile }) => ({
      x:result.irrHold * 100,
      y:profile.confidenceScore,
      color:market.manifest.color,
      label:L(market.manifest.shortName),
      tip:'<b>' + market.manifest.flag + ' ' + L(market.manifest.name) + '</b>' +
        '<div class="tr"><span>' + L(['Base hold IRR', '基准持有IRR']) + '</span><b>' + irr(result) + '</b></div>' +
        '<div class="tr"><span>' + L(['Evidence confidence', '证据置信度']) + '</span><b>' + profile.confidenceScore + '/10</b></div>' +
        '<div class="tr"><span>' + L(['Secured / proxy', '已锁定/代理']) + '</span><b>' +
          pct(result.evidenceSecuredShare) + ' / ' + pct(result.proxyShare) + '</b></div>',
    }));
  scatterChart(card, {
    pts:points,
    xfmt:value => value.toFixed(0) + '%',
    yfmt:value => value.toFixed(0) + '/10',
    xlabel:['Base hold IRR (%) — evidence confidence on the y-axis',
            '基准持有IRR（%）— 纵轴为证据置信度'],
  });
}

function portfolioCard(main, marketList, exitYear){
  const portfolio = runPortfolioScenarios(marketList, exitYear);
  const c = spacedCard(
    ['Portfolio stress — equal capital across all allocation markets',
     '组合压力测试 — 在全部配置市场等额配置'],
    [badge('calc'), badge('illus')]);
  const values = [
    [['Owner base', '业主基准'], portfolio.base],
    [['Correlated merchant -35%', '相关性市场化收入-35%'], portfolio.correlatedMerchant],
    [['Evidence-only fixed revenue', '仅证据化固定收入'], portfolio.evidenceOnly],
    [['Current run-rate bridge', '当前运行水平过渡'], portfolio.currentRunRate],
  ];
  c.append(h('div', { class:'kpis' }, values.map(([label, value]) =>
    h('div', { class:'kpi' },
      h('div', { class:'l' }, L(label)),
      h('div', { class:'v' }, fmtIRRor(value.irr, value.irr == null ? { reason:'no_solution' } : null, L)),
      h('div', { class:'s' }, value.markets + L([' markets', '个市场']))))));
  c.append(h('div', { class:'note' },
    h('b', {}, L(['Base merchant exposure: ', '基准市场化敞口：'])),
    fmtPct(portfolio.merchantExposure * 100, 0),
    ' · ',
    L(['Diversification does not remove a shared merchant or auction-price shock.',
       '分散配置无法消除共同的市场化收入或拍卖价格冲击。'])));
  main.append(c);
}

function contractRiskCard(main, rows){
  const c = spacedCard(
    ['Contract-risk diligence matrix', '合同风险尽调矩阵'],
    [badge('model')]);
  c.append(h('div', { class:'tbl-wrap hm' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Market', '市场'])),
      h('th', {}, L(['Counterparty / mechanism', '交易对手/机制'])),
      h('th', {}, L(['Dispatch', '调度'])),
      h('th', {}, L(['Penalties', '违约责任'])),
      h('th', {}, L(['Refinancing evidence', '再融资证据'])))),
    h('tbody', {}, rows.map(({ market, profile }) => {
      const risk = profile.contractRisk || {};
      return h('tr', {},
        h('td', {}, h('b', {}, market.manifest.flag + ' ' + L(market.manifest.shortName))),
        h('td', {}, L(risk.counterparty)),
        h('td', {}, L(risk.dispatch)),
        h('td', {}, L(risk.penalties)),
        h('td', {}, L(risk.refinancing)));
    })))));
  c.append(h('div', { class:'cap' }, L([
    'Unknown means project documents are required; it is not a zero-risk assumption.',
    '“未知”表示需要项目文件，并不代表风险为零。',
  ])));
  main.append(c);
}

export function renderRefinementOverview(main, marketList, exitYear){
  const rows = decisionRows(marketList, exitYear);
  const corrected = rows.filter(row => row.profile.consensus.status === 'stale').length;
  const bullish = rows.filter(row => row.profile.consensus.status === 'more_bullish').length;
  const proxy = rows.filter(row => row.result.proxyShare > 0).length;
  const allocationReady = rows.filter(row => row.result.allocationReady).length;

  const c = spacedCard(
    ['IC decision surface — ranges, evidence and approval gates',
     '投委会决策界面 — 区间、证据与审批门槛'],
    [badge('calc'), badge('illus')]);
  c.append(h('div', { style:'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;' },
    chip('serious', ['Release Gate: screening only', '发布门槛：仅供筛选']),
    chip(allocationReady ? 'warn' : 'critical',
      [allocationReady + ' allocation-ready', allocationReady + '个可配置']),
    h('span', { class:'muted' },
      corrected + L([' corrected · ', '个已更正 · ']) +
      bullish + L([' more bullish than review · ', '个较复核偏乐观 · ']) +
      proxy + L([' carrying proxy fixed revenue', '个含代理固定收入']))));
  c.append(h('div', { class:'warnbox' }, L([
    'No market clears the underwriting release gate until capex scope, project eligibility, revenue evidence and stack feasibility are complete. Point estimates below are always paired with owner Bear/Base/Bull cases.',
    '在造价范围、项目资格、收入证据及收入叠加可行性完整前，任何市场均不通过承销发布门槛。以下点估值始终与业主悲观/基准/乐观情景并列。',
  ])));
  c.append(scenarioTable(rows));
  evidenceScatter(c, rows);
  c.append(h('div', { class:'cap' }, L([
    'Attractiveness is not confidence. A high-return, low-evidence point stays a research priority rather than becoming an allocation recommendation.',
    '吸引力不等于置信度。高回报、低证据的市场仍是研究优先项，而不会自动成为配置建议。',
  ])));
  main.append(c);

  portfolioCard(main, marketList, exitYear);
  contractRiskCard(main, rows);
}

