/* ---------------------------------------------------------------------------
   Revenue anatomy — year-1 revenue per MWh installed, by pay type.

   Dividing by duration is the point of the chart: it removes the distortion that
   made long-duration markets look better paid simply because they are bigger
   machines.

   N-market: the stacked series are built from the passed market list.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { barChart } from '../charts/index.js';
import { fmtUSDk, fmtPct } from '../utils/formatting.js';
import { runBaseCase } from '../comparison/engine.js';

/* Computed commentary. The claim is structural — per-MWh revenue converges while
   the payer changes — and the values are filled in from the current registry. */
const COMMENTARY = (lo, hi, n, secLo, secHi) => ([
  'Normalised per MWh the totals converge hard — roughly ' + lo + ' to ' + hi + '/MWh/yr across ' + n + ' very different market designs. That is the real apples-to-apples finding: a megawatt-hour of storage earns broadly the same gross revenue almost everywhere, and market design changes less about how much you are paid than about who pays you and for how long. The green share, not the bar height, is what a lender sizes against — and across this set it runs from ' + secLo + ' to ' + secHi + ' for the same physical product.',
  '按MWh归一化后，各市场总额显著收敛 — 在' + n + '种截然不同的市场设计下，约为' + lo + '至' + hi + '/MWh/年。这才是真正的同口径结论：一MWh储能在几乎任何地方所获毛收入大致相当，市场设计改变的与其说是"获得多少报酬"，不如说是"由谁支付、支付多久"。贷款人据以安排规模的是绿色占比而非柱高 — 在本样本中，对同一实体产品该占比从' + secLo + '到' + secHi + '不等。',
]);

export function renderStack(main, marketList, exitYear){
  const c = spacedCard(
    ['Same machine, different pay mix — year-1 revenue per MWh installed (USD, base strategy)',
     '同一台机器，不同报酬结构 — 第1年每MWh装机收入（美元，基准策略）'],
    [badge('calc')]);

  /* ENGINE-READY ONLY, and this is not a filter for tidiness.

     runBaseCase returns { na } for a market whose normalized inputs are
     incomplete — there is no capY, no mchY, nothing to divide by duration. Every
     line below indexes those arrays, so an unready market does not produce a
     short bar here, it throws and takes the whole home page with it.

     Finland is the first market to register with engineReady:false and was the
     first to prove that: the flag has existed since the registry was written and
     nothing had ever exercised it. The league table and the $1M engine handle
     `na` because they were built to show unavailable routes; this chart was
     built on the assumption that every market it is handed computes. */
  const drawable = marketList.filter(m => m.comparison?.engineReady !== false);
  const results = drawable.map(m => runBaseCase(m, exitYear));
  const hrs = drawable.map(m => m.comparison.archetype.durationHours);
  const held = marketList.length - drawable.length;
  /* Three segments, not two. A capacity payment that must be re-won each year is
     not the same asset as a 15-year contract, so it is stacked separately rather
     than counted as secured. Markets without an auction-renewal stream simply
     show a zero-height middle segment. */
  const fixedMWh = results.map((r, i) => (r.secY ? r.secY[0] : r.capY[0]) / hrs[i]);
  const aucMWh = results.map((r, i) => (r.aucY ? r.aucY[0] : 0) / hrs[i]);
  const mchMWh = results.map((r, i) => r.mchY[0] / hrs[i]);
  const secMWh = fixedMWh.map((value, i) => results[i].evidenceSecuredShare > 0 ? value : 0);
  const proxyMWh = fixedMWh.map((value, i) => value - secMWh[i] + aucMWh[i]);
  const tot = secMWh.map((v, i) => v + proxyMWh[i] + mchMWh[i]);

  const secShare = results.map(r => (r.evidenceSecuredShare || 0) * 100);

  barChart(c, {
    xs: drawable.map((m, i) => L(m.manifest.shortName) + ' · ' + hrs[i] + 'h'),
    mode: 'stack', bw: 40, yfmt: v => fmtUSDk(v), h: 280,
    series: [
      { name: ['Secured / contracted', '已锁定/合同化'], color: 'var(--s2)', vals: secMWh },
      { name: ['Modelled/proxy fixed revenue', '模型化/代理固定收入'], color: 'var(--s3)', vals: proxyMWh },
      { name: ['Merchant + services (net)', '市场化+服务（净）'], color: 'var(--s1)', vals: mchMWh },
    ],
  });

  if (held > 0){
    c.append(h('div', { class: 'cap' }, L([
      held + ' market' + (held === 1 ? '' : 's') + ' held out of this chart: their normalized inputs are incomplete, so there is no revenue to stack. They appear on the market cards and in their own dashboards.',
      '有' + held + '个市场未纳入本图：其归一化输入尚不完整，无收入可供堆叠。这些市场仍出现在市场卡片及各自看板中。',
    ])));
  }

  c.append(h('div', { class: 'cap' }, L([
    'Per MWh of energy installed — the unit an investor actually buys. Dividing by duration removes the distortion that made long-duration markets look better paid simply because they are bigger machines.',
    '按已装机MWh计 — 这才是投资人真正购买的单位。除以时长后，即可消除"长时市场因机器更大而显得报酬更高"的失真。',
  ])));

  c.append(why(COMMENTARY(
    fmtUSDk(Math.min(...tot)), fmtUSDk(Math.max(...tot)), drawable.length,
    fmtPct(Math.min(...secShare), 0), fmtPct(Math.max(...secShare), 0)),
    ['Per MWh, pay converges — payers do not', '按MWh报酬趋同，付款方不同']));
  main.append(c);
}
