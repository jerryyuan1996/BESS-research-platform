/* ---------------------------------------------------------------------------
   /data — the data-status page.

   A public accounting of every feed: what is fetched, from where, under what
   licence, how fresh it is, and — the part that matters most — what automation
   is and is not permitted to do with it.

   This page exists because the platform's credibility rests on a claim that
   cannot be verified by looking at a dashboard: that the numbers driving the
   investment conclusions are analyst-set, and that the machine only observes.
   Stating that in a README is worth something. Publishing a live page where a
   reader can see which feeds are stale, which assumptions have drifted, and that
   no assumption has silently moved, is worth considerably more.

   It also does the unglamorous operational job. When a source breaks — and over
   a year, several will — this is the page that says which one, and since when,
   without anyone reading a CI log.
   --------------------------------------------------------------------------- */
import { siteHeader } from '../experience/chrome.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { sectionHead } from '../components/sectionHeader.js';
import { marketNav } from '../components/navigation.js';
import { markets } from '../markets/registry.js';
import { DATASETS, snapshotPath } from '../governance/datasets.js';
import { AUTHORITY } from '../governance/authority.js';
import { DERIVATION_PARAMETERS } from '../governance/derivation.js';
import { loadSummary } from './client.js';
import { freshnessOf, ageLabel } from './freshness.js';
import { liveBadge, observedNote } from './liveValue.js';

function num(v, dp = 2){
  return (typeof v === 'number' && Number.isFinite(v))
    ? v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
    : '—';
}

/* ---- what automation may do — stated before any data is shown ------------- */

let governancePage=null;
function renderGovernance(main){
  if(governancePage)return void governancePage.renderGovernance(main,AUTHORITY);
  const holder=h('div',{},h('p',{class:'note',role:'status'},L(['Loading','加载中'])));
  main.append(holder);
  import('./dataGovernance.js').then(module=>{
    governancePage=module;
    if(!holder.isConnected)return;
    holder.replaceChildren();module.renderGovernance(holder,AUTHORITY);
  }).catch(error=>{
    console.error('[data-governance] page failed to load:',error);
    if(!holder.isConnected)return;
    holder.replaceChildren(h('button',{onclick:()=>window.location.reload()},L(['Reload','刷新'])));
  });
}

/* ---- the feed table ------------------------------------------------------- */

function renderFeeds(main){
  const c = spacedCard(
    ['Feeds', '数据源'],
    []);

  const body = h('tbody', {});
  const table = h('table', { class: 'ds-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Dataset', '数据集'])),
      h('th', {}, L(['Market', '市场'])),
      h('th', {}, L(['Source', '来源'])),
      h('th', {}, L(['Coverage', '覆盖期'])),
      h('th', { class: 'num' }, L(['Points', '数据点'])),
      h('th', {}, L(['Freshness', '时效'])))),
    body);

  for (const d of DATASETS){
    const market = d.marketId ? markets.find(m => m.manifest.id === d.marketId) : null;
    const tr = h('tr', { class: 'absent' });

    tr.append(
      h('td', {}, h('b', {}, L(d.title)), h('br'),
        h('span', { class: 'obs-tag' }, d.id)),
      h('td', {}, market ? (market.manifest.flag + ' ' + L(market.manifest.shortName)) : L(['Global', '全局'])),
      h('td', {}, h('a', { href: d.source.url, target: '_blank', rel: 'noopener noreferrer' }, d.source.name),
        h('br'), h('span', { class: 'obs-tag' }, d.source.licence)),
      h('td', {}, '—'),
      h('td', { class: 'num' }, '—'),
      h('td', {}, liveBadge(null)));

    const reproductionNotice = d.source.notice;
    if (reproductionNotice){
      tr.children[2].append(h('div', { class: 'obs-hint', style: 'max-width:28rem;white-space:normal' }, reproductionNotice));
    }
    body.append(tr);

    /* Each row fills itself in when its summary arrives. Rendering the whole
       table up front means a reader immediately sees which feeds are configured,
       even the ones that have never published — which is exactly the case an
       operator most needs to notice. */
    loadSummary(d.id).then(summary => {
      if (!summary) {
        tr.children[5].replaceChildren(liveBadge(null),
          h('span', { class: 'obs-hint' }, ' ',
            L(d.requiresKey
              ? ['credential may not be configured', '凭据可能未配置']
              : ['never published', '尚未发布'])));
        return;
      }
      const f = freshnessOf(summary);
      tr.classList.remove('absent');

      const cov = summary.coverage;
      if (summary.source?.notice && !reproductionNotice){
        tr.children[2].append(h('div', { class: 'obs-hint', style: 'max-width:28rem;white-space:normal' }, summary.source.notice));
      }
      tr.children[3].textContent = cov?.from
        ? `${cov.from.slice(0, 10)} → ${cov.to.slice(0, 10)}`
        : '—';
      const zonalCoverage = summary.zonal?.coverageAudit;
      if (zonalCoverage){
        tr.children[3].append(h('br'), h('span', { class: 'obs-hint' }, L([
          zonalCoverage.completeRollingDays + ' complete days; ' + zonalCoverage.pendingReportFiles.length + ' reports pending',
          zonalCoverage.completeRollingDays + ' 个完整日；' + zonalCoverage.pendingReportFiles.length + ' 份报表待归档',
        ])));
      }
      tr.children[4].textContent = (cov?.points ?? 0).toLocaleString('en-US');
      tr.children[5].replaceChildren(liveBadge(summary),
        h('span', { class: 'obs-hint' }, ' ' + L(ageLabel(f.ageHours))));
    });
  }

  c.append(table);
  c.append(h('div', { class: 'cap' }, L([
    'Each feed publishes two files: a summary this page and the dashboards read, and the full observed series kept as an audit artefact. Both carry a checksum over their contents.',
    '每个数据源发布两个文件：本页与各看板读取的摘要，以及作为审计凭证保留的完整实测序列。两者均带有内容校验和。',
  ])));
  main.append(c);
}

/* ---- derived metrics, per market ------------------------------------------ */

function renderDerived(main){
  const c = spacedCard(
    ['Derived metrics — computed, not judged', '衍生指标 — 计算所得，非人工判断'],
    []);

  c.append(h('div', { class: 'note' }, L([
    'These are deterministic functions of the observed price series and the market\'s own reference archetype. The same inputs always produce the same outputs, which is why they publish without review. None of them feeds the investment model — they are evidence shown next to the analyst\'s assumptions, never merged into them.',
    '以下均为实测电价序列与各市场参考原型的确定性函数：相同输入恒产生相同输出，故无需复核即可发布。它们不进入投资模型 — 仅作为证据与分析师假设并列展示，绝不并入其中。',
  ])));

  const body = h('tbody', {});
  c.append(h('table', { class: 'ds-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Market', '市场'])),
      h('th', { class: 'num' }, L(['Mean price', '均价'])),
      h('th', { class: 'num' }, L(['Mean daily spread', '日均价差'])),
      h('th', { class: 'num' }, L(['Negative hours', '负电价占比'])),
      h('th', { class: 'num' }, L(['Trading days', '交易日'])),
      h('th', { class: 'num' }, L(['Arbitrage index /MW/yr', '套利指数 /MW/年'])))),
    body));

  for (const d of DATASETS.filter(x => x.marketId)){
    const market = markets.find(m => m.manifest.id === d.marketId);
    if (!market) continue;

    loadSummary(d.id).then(summary => {
      if (!summary?.derived) return;
      const dv = summary.derived;
      const unit = summary.units?.price || '';

      body.append(h('tr', {},
        h('td', {}, market.manifest.flag + ' ' + L(market.manifest.shortName),
          h('br'), h('span', { class: 'obs-tag' }, `${dv.durationHours}h · ${unit}`)),
        h('td', { class: 'num' }, num(dv.mean)),
        h('td', { class: 'num' }, num(dv.spreadMean)),
        h('td', { class: 'num' }, dv.negativeHoursPct == null ? '—'
          : (dv.negativeHoursPct * 100).toFixed(1) + '%'),
        h('td', { class: 'num' }, String(dv.spreadDays ?? '—')),
        h('td', { class: 'num' }, summary.arbitrage
          ? Math.round(summary.arbitrage.revenuePerMW).toLocaleString('en-US')
          : '—')));
    });
  }

  c.append(h('div', { class: 'cap' }, L([
    'The arbitrage index is wholesale arbitrage only — it excludes capacity, ancillary and balancing revenue, which is why it is smaller than any market\'s merchant assumption and must never be read as a substitute for it. Spread is measured over the market\'s own trading day for the archetype duration shown, not as a simple daily high minus low.',
    '套利指数仅计批发套利，不含容量、辅助服务与平衡市场收入 — 故其数值低于任何市场的市场化收入假设，且绝不可视为其替代。价差按各市场本地交易日、依所示原型时长计算，而非简单的日内最高减最低。',
  ])));

  const params = DERIVATION_PARAMETERS.map(p => `${L(p.label)} ${p.value}`).join(' · ');
  c.append(h('div', { class: 'cap' }, L(['Bridge parameters: ', '换算参数：']) + params));

  main.append(c);
}

/* ---- entry ---------------------------------------------------------------- */

export function renderDataStatus(app){
  app.append(siteHeader('resources'));
  app.append(h('div', { class: 'hdr' }, h('div', {},
    h('h1', {}, L(['Data status', '数据状态'])),
    h('div', { class: 'sub' }, L([
      'What is fetched automatically, how fresh it is, and what automation is permitted to change',
      '自动获取的内容、其时效，以及自动化的可修改范围',
    ])))));

  app.append(marketNav(markets, 'home'));

  const main = h('div', { class: 'wrap' });
  app.append(main);

  sectionHead(main,['Investment conventions','投资比较口径'],['Read these before comparing a return','比较回报前先看这些假设']);
  main.append(h('div',{class:'card'},h('p',{},L(['RTB closing, 20 operating years, nominal after project tax. Project-rights price defaults to zero; construction and fees remain payable. Levered returns draw debt at COD after equity funds construction.',
    'RTB交割起算、20年运营、税后名义。项目权利对价默认为零，另需支付建设与费用；杠杆情景先由股权承担建设，在COD提取贷款。'])),
    h('p',{},L(['Model indexation is a comparison assumption, not a verified contract term. Spain’s future capacity award is fixed nominal if modelled; current Spain receipts exclude capacity and balancing. Saudi returns are withheld pending the SSA price.',
      '模型指数化是比较假设，并非已核验合同条款。西班牙未来容量合同如被计入须采用名义固定价格；当前西班牙未计容量及平衡收入。沙特待取得SSA付费后才能测算回报。'])),
    h('p',{},L(['A fresh price feed does not mean the revenue forecast or investment view was re-approved. Feed timestamps appear below; model versions and view-review dates appear in each case.',
      '电价源刚更新不代表收入预测或投资观点也已重新审核。下方显示数据获取时间，各市场显示模型版本与观点复核日期。']))));
  sectionHead(main, ['Governance', '治理'],
    ['Who is allowed to change what', '谁有权修改什么']);
  renderGovernance(main);

  sectionHead(main, ['Feeds', '数据源'],
    ['Every automated source, with its licence and freshness', '全部自动化来源及其许可与时效']);
  renderFeeds(main);

  sectionHead(main, ['Derived', '衍生指标'],
    ['Deterministic calculations over observed data', '基于实测数据的确定性计算']);
  renderDerived(main);

  main.append(observedNote());
}
