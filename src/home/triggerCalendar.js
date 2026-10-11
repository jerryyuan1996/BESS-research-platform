/* ---------------------------------------------------------------------------
   The trigger calendar — what is due to happen, market by market.

   A knowledge base records that an event is coming. A decision tool has to
   say when to look again. This lays the view store's triggers out over the
   next twelve months from the reader's own date, one lane per market, and
   then lists them in the order they fall due.

   The grid is for the shape of the year; the list is what a phone reads and
   what a screen reader reads. Both are drawn from the same records.

   NOTHING IS DROPPED FOR BEING UNTIDY. A trigger whose date has passed is
   listed as overdue, because somebody has to establish whether it happened.
   One beyond the window and one with no date are each listed under their own
   heading. Every market file is read, graded or not: seven markets have
   triggers and no grades yet.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { byId } from '../markets/registry.js';
import { dimension } from '../governance/investability.js';
import { TRIGGER_DIRECTION_LABEL } from '../governance/triggers.js';
import { DIRECTION_MARK, whenLabel } from './verdictBoard.js';

const marketName = (id) => {
  const market = byId(id);
  return market ? L(market.manifest.shortName) : id;
};

const marketLink = (id) => {
  const market = byId(id);
  if (!market) return h('b', {}, id);
  const href = '/markets/' + market.manifest.slug;
  return h('a', { class: 'vb-name', href, onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); } },
    L(market.manifest.shortName));
};

const monthHead = (key) => {
  const [year, month] = key.split('-').map(Number);
  const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
  return [L([en, month + '月']), String(year).slice(2)];
};

const watches = (t) => t.watches.map(id => L(dimension(id)?.label || [id, id])).join(L([', ', '、']));

const plain = (t) => `${marketName(t.market)} · ${whenLabel(t.expected)} · ${L(t.label)} · ${L(TRIGGER_DIRECTION_LABEL[t.direction])}`;

function item(t){
  return h('li', { class: 'tc-item' },
    h('span', { class: 'tc-when' }, whenLabel(t.expected)),
    h('span', {},
      marketLink(t.market), ' — ', L(t.label), ' ',
      h('span', { class: 'vb-dir', title: L(TRIGGER_DIRECTION_LABEL[t.direction]) }, DIRECTION_MARK[t.direction]),
      h('div', { class: 'vb-sub' },
        L(TRIGGER_DIRECTION_LABEL[t.direction]) + L([' · would move: ', ' · 将影响：']) + watches(t))));
}

function group(title, list, cls = ''){
  if (!list.length) return null;
  return h('div', { class: 'tc-group ' + cls },
    h('div', { class: 'tc-group-h' }, L(title) + ' (' + list.length + ')'),
    h('ul', { class: 'tc-list' }, list.map(item)));
}

/**
 * @param parent    where the calendar goes
 * @param calendar  the result of boardModel.triggerCalendar
 */
export function renderTriggerCalendar(parent, calendar){
  if (calendar.lanes.length){
    const table = h('table', { class: 'tc-grid' },
      h('thead', {}, h('tr', {},
        h('th', {}, L(['Market', '市场'])),
        calendar.months.map(m => {
          const [month, year] = monthHead(m);
          return h('th', { class: 'tc-m' }, month, h('div', { class: 'tc-y' }, "'" + year));
        }))),
      h('tbody', {}, calendar.lanes.map(lane => h('tr', {},
        h('th', { class: 'tc-lane' }, marketName(lane.market)),
        lane.cells.map(cell => h('td', { class: 'tc-m' + (cell.length ? ' tc-on' : '') },
          cell.map(t => h('span', { class: 'tc-mark', title: plain(t), role: 'img', 'aria-label': plain(t) },
            DIRECTION_MARK[t.direction]))))))));
    parent.append(h('div', { class: 'tbl-wrap' }, table));
    parent.append(h('div', { class: 'cap' }, L([
      '↗ would open the market further · ↘ would close it further · ↔ the outcome decides. Hover a mark, or read the list below.',
      '↗ 将使市场更为开放 · ↘ 将使市场进一步收紧 · ↔ 方向取决于结果。可将鼠标悬停在标记上，或阅读下方列表。',
    ])));
  }

  const groups = [
    group(['Overdue — to be checked', '已逾期 — 有待核实'], calendar.overdue, 'tc-overdue'),
    group(['In the next twelve months', '未来十二个月内'], calendar.upcoming),
    group(['Beyond twelve months', '十二个月之后'], calendar.later),
    group(['Announced, not yet dated', '已宣布、日期未定'], calendar.undated),
  ].filter(Boolean);

  if (!groups.length){
    parent.append(h('div', { class: 'note' }, L(['No trigger is recorded yet.', '尚未记录任何触发事件。'])));
    return;
  }
  parent.append(...groups);
}
