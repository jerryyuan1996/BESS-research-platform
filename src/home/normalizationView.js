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

  const results = marketList.map(m => runBaseCase(m, exitYear));
  const hrs = marketList.map(m => m.comparison.archetype.durationHours);
  /* Three segments, not two. A capacity payment that must be re-won each year is
     not the same asset as a 15-year contract, so it is stacked separately rather
     than counted as secured. Markets without an auction-renewal stream simply
     show a zero-height middle segment. */
  const secMWh = results.map((r, i) => (r.secY ? r.secY[0] : r.capY[0]) / hrs[i]);
  const aucMWh = results.map((r, i) => (r.aucY ? r.aucY[0] : 0) / hrs[i]);
  const mchMWh = results.map((r, i) => r.mchY[0] / hrs[i]);
  const tot = secMWh.map((v, i) => v + aucMWh[i] + mchMWh[i]);

  const secShare = results.map(r => (r.securedShare ?? r.contractedShare) * 100);

  barChart(c, {
    xs: marketList.map((m, i) => L(m.manifest.shortName) + ' · ' + hrs[i] + 'h'),
    mode: 'stack', bw: 40, yfmt: v => fmtUSDk(v), h: 280,
    series: [
      { name: ['Secured / contracted', '已锁定/合同化'], color: 'var(--s2)', vals: secMWh },
      { name: ['Auction-renewal (not secured)', '拍卖续约（未锁定）'], color: 'var(--s3)', vals: aucMWh },
      { name: ['Merchant + services (net)', '市场化+服务（净）'], color: 'var(--s1)', vals: mchMWh },
    ],
  });

  c.append(h('div', { class: 'cap' }, L([
    'Per MWh of energy installed — the unit an investor actually buys. Dividing by duration removes the distortion that made long-duration markets look better paid simply because they are bigger machines.',
    '按已装机MWh计 — 这才是投资人真正购买的单位。除以时长后，即可消除"长时市场因机器更大而显得报酬更高"的失真。',
  ])));

  c.append(why(COMMENTARY(
    fmtUSDk(Math.min(...tot)), fmtUSDk(Math.max(...tot)), marketList.length,
    fmtPct(Math.min(...secShare), 0), fmtPct(Math.max(...secShare), 0)),
    ['Per MWh, pay converges — payers do not', '按MWh报酬趋同，付款方不同']));
  main.append(c);
}
