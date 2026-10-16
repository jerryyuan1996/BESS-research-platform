/* ---------------------------------------------------------------------------
   Cross-market congestion — where it is worth siting for congestion, and for
   how long.

   The allocation question this answers is narrower than it sounds, and the
   narrowing is the point. "Which market is most congested?" cannot be answered
   across this set and should not be: Great Britain publishes a balancing cost,
   Ireland a dispatch-down percentage, Poland a curtailed volume, Japan an
   output-control rate, Western Australia an access framework with no per-facility
   data at all. Forcing five incompatible units onto one scale would produce a
   ranking that no source supports — the same mistake the league table refuses to
   make when it marks context-only rows as non-comparable.

   Two columns ARE comparable across all six, and between them they decide the
   question:

     RUNWAY     years from 2026 to the published commissioning year of the relief
                project. A number, from a named project, in every market.

     MECHANISM  how a battery is actually paid. Categorical, from a controlled
                vocabulary, and the column that most often kills a case — a deep
                constraint reached by no mechanism is worth nothing, and Romania's
                mechanism charges the developer rather than paying the operator.

   Everything else on this card is shown in its own market's units and labelled
   as not rank-comparable.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { chip } from '../components/chip.js';
import { why } from '../components/decisionLogic.js';
import {
  CAPTURE_LABEL, CAPTURE_PAYS, CAPTURE_FLOW, CAPTURE_FLOW_LABEL,
  RELIEF_STATUS_LABEL, reliefRunway,
} from '../governance/congestion.js';

import { congestionFor } from '../markets/congestionRegistry.js';
import { RUNWAY_FROM } from '../components/congestionPanel.js';

/* Green only where the mechanism pays. Amber — not green — where nobody pays at
   all, because "no congestion payment exists" is a finding an investor has to
   act on, not a neutral fact. */
const FLOW_TONE = { pays: 'ok', charges: 'bad', neither: 'warn' };

/**
 * The zone that decides a market's congestion case.
 *
 * Ranked on INTENSITY, not on runway. Runway-first ranking picks whichever
 * constraint has no published relief date, which is the vaguest entry rather
 * than the most binding one — it selected Great Britain's zonal-pricing decision
 * over the Scotland–England boundary, and Ireland's unquantified local
 * constraints over the minimum-generation rule that causes 83% of its
 * curtailment. Intensity is the analyst's ranking of what actually binds, so it
 * leads, and runway breaks ties.
 *
 * Zones whose mechanism charges the developer rather than paying the operator
 * are used only when a market has nothing else — Romania is that market, and the
 * row is labelled accordingly rather than quietly promoted.
 */
function headlineZone(register){
  const paid = register.zones.filter(z => CAPTURE_PAYS[z.capture.mechanism]);
  const pool = paid.length ? paid : register.zones;
  return [...pool].sort((a, b) => {
    const byIntensity = (b.intensity ?? 0) - (a.intensity ?? 0);
    if (Math.abs(byIntensity) > 1e-9) return byIntensity;
    const ra = reliefRunway(a, RUNWAY_FROM);
    const rb = reliefRunway(b, RUNWAY_FROM);
    // An unpublished relief date outlasts every published one.
    if (ra == null && rb == null) return 0;
    if (ra == null) return -1;
    if (rb == null) return 1;
    return rb - ra;
  })[0];
}

function runwayCell(runway, status){
  if (runway == null){
    return h('td', { class: 'num' },
      chip('info', L(['open-ended', '无终止日期'])),
      h('span', { class: 'cong-metric-label' }, L(RELIEF_STATUS_LABEL[status])));
  }
  const tone = runway <= 3 ? 'bad' : runway <= 8 ? 'warn' : 'ok';
  return h('td', { class: 'num' },
    chip(tone, L([runway + ' yr', runway + '年'])));
}

export function renderCongestionView(main, marketList){
  const rows = marketList
    .map(m => ({ market: m, register: congestionFor(m.manifest.id) }))
    .filter(x => x.register);
  if (!rows.length) return;

  const c = spacedCard(
    ['Congestion runway — how long the constraint outlives the reinforcement that ends it',
     '拥塞剩余年限 — 约束能比终结它的增容工程多存续多久'],
    [badge('official'), badge('public')]);

  c.append(h('div', { class: 'note' },
    h('b', {}, L(['Two comparable columns, deliberately. ', '刻意仅设两个可比列。'])),
    L([
      'Runway and capture mechanism are the same question in every market. The measured constraint is not — each operator publishes a different quantity, so it is shown in its own units and is not rank-comparable. Runway is years from ' + RUNWAY_FROM + ' to the relief project\'s published commissioning year.',
      '剩余年限与捕获机制在各市场含义一致，而实测约束数据则不然 — 各运营商公布的量纲各异，因此按其本身单位展示，不可用于排序比较。剩余年限为自' + RUNWAY_FROM + '年至缓解工程公开投运年份的年数。',
    ])));

  const body = rows.map(({ market, register }) => {
    const zone = headlineZone(register);
    const runway = reliefRunway(zone, RUNWAY_FROM);
    const flow = CAPTURE_FLOW[zone.capture.mechanism];
    const head = zone.metrics[0];

    return h('tr', {},
      h('td', {}, h('b', {}, market.manifest.flag + ' ' + L(market.manifest.shortName)),
        h('span', { class: 'cong-metric-label' }, L(zone.name))),
      h('td', { class: 'ctx' }, L(head.value),
        h('span', { class: 'cong-metric-label' }, L(head.label), ' · ', L(head.period))),
      h('td', {},
        chip(FLOW_TONE[flow], L(CAPTURE_LABEL[zone.capture.mechanism])),
        flow === 'pays' ? null
          : h('span', { class: 'cong-charges' }, L(CAPTURE_FLOW_LABEL[flow]))),
      h('td', {}, L(zone.relief.project),
        h('span', { class: 'cong-metric-label' },
          zone.relief.expected ? String(zone.relief.expected) + ' · ' : '',
          L(RELIEF_STATUS_LABEL[zone.relief.status]))),
      runwayCell(runway, zone.relief.status));
  });

  c.append(h('div', { class: 'tbl-wrap' }, h('table', { class: 'cong-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Market · binding constraint', '市场 · 主要约束'])),
      h('th', {}, L(['Measured — own units, not rank-comparable', '实测数据 — 各自单位，不可排序比较'])),
      h('th', {}, L(['How a battery is paid', '储能获取方式'])),
      h('th', {}, L(['What ends it', '终止因素'])),
      h('th', { class: 'num' }, L(['Runway', '剩余年限'])))),
    h('tbody', {}, body))));

  c.append(h('div', { class: 'cap' }, L([
    'One row per market, showing the constraint a battery could actually be paid for and that lasts longest. Each market\'s full register — every constraint, all its measurements and the investor implication — is on its own Grid Connection tab.',
    '每个市场一行，展示储能实际可获得回报且存续最久的约束。各市场的完整登记表 — 包含全部约束、实测数据及投资者影响 — 见其“并网”页签。',
  ])));

  c.append(h('div', { class: 'warnbox' }, '⚠ ' + L([
    'No market on this platform carries a modelled congestion revenue, and the Investment Lab does not price one. Nothing public gives per-MW congestion revenue for a battery in any of these markets, so the register reports the pool and the mechanism and stops there — research gate G14.',
    '本平台任何市场均未采用建模的拥塞收入，投资测算模块亦不对其定价。上述各市场均无公开来源提供储能每MW的拥塞收入，因此登记表仅呈现资金池与机制，不再深入 — 研究缺口G14。',
  ])));

  c.append(why([
    'Read the runway column against your hold period, then the mechanism column against your route to market — in that order, because the second one disqualifies more cases than the first. Great Britain has the deepest constraint pool in the set and rejected zonal pricing in July 2025, so all of it must be earned through Balancing Mechanism actions: a GB congestion thesis is a statement about your optimiser, not your site. Romania is the mirror image — its congestion is priced openly, annually and per zone, but at the connection auction, so it is a cost the developer pays rather than a revenue the operator earns. And Poland and Japan, which look like the patient trades on runway alone, are patient for opposite reasons: Poland because relief is a 2034 corridor that is still only proposed, Japan because an eleven-to-thirteen-year interconnector build started in 2024 cannot relieve anything inside a fifteen-year window.',
    '应先以剩余年限对照持有期，再以捕获机制对照售电路径 — 顺序不可颠倒，因为后者淘汰的方案远多于前者。英国拥有本样本中最深的约束资金池，却于2025年7月否决了分区电价，因此全部价值只能通过平衡机制指令获取：英国的拥塞投资逻辑说的是优化商，而非场址。罗马尼亚恰好相反 — 其拥塞被公开、按年、分区域明码定价，但发生在并网拍卖环节，因而是开发商支付的成本，而非运营方赚取的收入。而仅从剩余年限看似同属“长线”的波兰与日本，其原因截然相反：波兰是因为2034年的走廊工程仍停留在提议阶段，日本则是因为2024年启动、工期十一至十三年的联络线，在十五年窗口内无法缓解任何约束。',
  ], ['Runway sets the size, mechanism decides if there is a trade at all', '剩余年限决定规模，捕获机制决定是否成立']));

  main.append(c);
}
