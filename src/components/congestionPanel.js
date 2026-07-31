/* ---------------------------------------------------------------------------
   THE CONGESTION REGISTER — a constraint, its mechanism, and its expiry date.

   One renderer, six markets, reached from every grid tab. It takes a congestion
   register and nothing else, so a dashboard cannot show a different answer from
   the map beside it or the home-page comparison above it.

   The table is arranged to be read left to right as a single argument:

       what binds  →  how big  →  who pays you for it  →  what ends it  →  when

   and the last two columns are the ones this platform exists to add. Constraint
   maps are common. A constraint map with a commissioning date attached to every
   entry is a statement about how long the revenue lasts, and that is the only
   version of this analysis an investment committee can act on.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { chip } from './chip.js';
import { why } from './decisionLogic.js';
import {
  CAPTURE_LABEL, CAPTURE_PAYS, RELIEF_STATUS, RELIEF_STATUS_LABEL, reliefRunway,
} from '../governance/congestion.js';

/** Matches the map's reference year so the two cannot drift apart. */
export const RUNWAY_FROM = 2026;

/* Runway bands. Short runways are not automatically bad — they are bad for a
   case that depends on congestion, which is the only kind of case this table is
   used to underwrite. */
function runwayChip(runway, status){
  if (runway == null){
    return chip(status === RELIEF_STATUS.RULE_CHANGE ? 'warn' : 'info',
      L(['no committed date', '无确定日期']));
  }
  if (runway <= 3) return chip('bad', L([runway + ' yr', runway + '年']));
  if (runway <= 8) return chip('warn', L([runway + ' yr', runway + '年']));
  return chip('ok', L([runway + ' yr', runway + '年']));
}

/**
 * @param {HTMLElement} parent
 * @param {object} register  a market's congestion register
 */
export function renderCongestionRegister(parent, register){
  if (!register || !register.zones?.length) return;

  const c = card(
    ['Congestion register — the constraint, the mechanism and the expiry date',
     '拥塞登记表 — 约束、捕获机制与终止日期'],
    [badge('official'), badge('public')]);

  c.append(h('div', { class: 'note' }, L(register.summary)));

  const rows = register.zones.map(zone => {
    const runway = reliefRunway(zone, RUNWAY_FROM);
    const pays = CAPTURE_PAYS[zone.capture.mechanism];
    const head = zone.metrics[0];

    return h('tr', {},
      h('td', {}, h('b', {}, L(zone.name)),
        h('span', { class: 'cong-dir' }, L(
          zone.direction === 'export' ? ['export constrained', '送出受限']
            : zone.direction === 'import' ? ['import constrained', '受入受限']
            : ['both directions', '双向受限']))),
      h('td', {}, h('b', {}, L(head.value)),
        h('span', { class: 'cong-metric-label' }, L(head.label), ' · ', L(head.period))),
      h('td', {},
        chip(pays ? 'ok' : 'bad', L(CAPTURE_LABEL[zone.capture.mechanism])),
        pays ? null : h('span', { class: 'cong-charges' },
          L(['charges the developer', '由开发商承担']))),
      h('td', {}, h('b', {}, L(zone.relief.project)),
        h('span', { class: 'cong-metric-label' }, L(RELIEF_STATUS_LABEL[zone.relief.status]))),
      h('td', { class: 'num' }, runwayChip(runway, zone.relief.status)));
  });

  c.append(h('div', { class: 'tbl-wrap' }, h('table', { class: 'cong-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['What binds', '约束内容'])),
      h('th', {}, L(['Measured', '实测数据'])),
      h('th', {}, L(['How a battery is paid', '储能获取方式'])),
      h('th', {}, L(['What ends it', '终止因素'])),
      h('th', { class: 'num' }, L(['Runway from ' + RUNWAY_FROM, '自' + RUNWAY_FROM + '年起剩余'])))),
    h('tbody', {}, rows))));

  c.append(h('div', { class: 'cap' }, L([
    'Select a constraint on the map above for the full measurement set, the capture mechanism in detail and the investor implication. Runway is years from ' + RUNWAY_FROM + ' to the published commissioning year of the relief project; "no committed date" means no year has been published, which for a rule change usually means none will be.',
    '在上方地图中选择某项约束，可查看完整实测数据、详细捕获机制及投资者影响。剩余年限为自' + RUNWAY_FROM + '年至缓解工程公开投运年份的年数；“无确定日期”表示尚未公布年份，若属规则变更则通常不会公布。',
  ])));

  if (register.gateNote){
    c.append(h('div', { class: 'warnbox' }, '⚠ ' + L(register.gateNote)));
  }

  c.append(why([
    'Congestion is the only revenue on this platform with a published expiry date, and the expiry is usually funded by the same body that publishes the constraint. NESO values 2030 network delivery at £13.1bn of lifetime constraint savings — read from the other side, that is £13.1bn of congestion revenue scheduled to stop existing. So the question is never "is this market congested?" but "is it congested for longer than my hold period, and is there a mechanism that pays me while it is?" A market can fail that test on either half: Great Britain has the deepest constraint pool and no locational price to reach it with, and Romania charges its congestion to the developer at the connection auction instead of paying it to the operator afterwards.',
    '拥塞是本平台上唯一具有公开终止日期的收入来源，且其终止通常由公布该约束的同一机构出资实现。NESO评估2030年电网交付可带来131亿英镑的全寿命期约束成本节约 — 从另一面看，这正是131亿英镑即将消失的拥塞收入。因此问题从来不是“该市场是否拥塞”，而是“其拥塞是否长于我的持有期，且期间是否存在向我付费的机制”。市场可能在任一环节不合格：英国拥有最深的约束资金池，却没有可触达它的区位价格；罗马尼亚则在并网拍卖阶段向开发商收取拥塞成本，而非事后向运营方支付。',
  ], ['Congestion is a depleting asset with a funded end date', '拥塞是有出资终止日期的递耗资产']));

  parent.append(c);
}

export default renderCongestionRegister;
