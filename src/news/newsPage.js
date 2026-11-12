import { eventDue, eventCountdown } from './eventDates.js';
/* ---------------------------------------------------------------------------
   MARKET WATCH — the calendar inside the shared intelligence reader.

   Two existing sources, presented on demand:

     the view store's triggers   every dated or announced event a call names in
                                 `changesIf`: auctions, rule changes, bills, grid
                                 orders. These are the analyst's own records.
     the industry-news feed      public RSS headlines, tagged to a market by
                                 governance/newsTags.js.

   THE BELL. An event that could open a market (direction up) or whose outcome
   decides the call (either) rings once it is dated inside twelve months. How
   loud depends on the time left: within 45 days it is ringing, within 120 the
   reader should prepare, inside a year it is an early warning. Each bell says
   which investors' calls it would move, what it would move, and the play's
   written next step, so the reader knows what to do before it lands.

   An event that would close a market (down) is not a bell; it sits on the risk
   watch, where the advice is to re-test before committing.

   Nothing here is written by a model. The words are the view store's (event
   labels, play actions) and the publishers' (headlines).
   --------------------------------------------------------------------------- */
import '../styles/news.css';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { newsTextPair } from './localization.js';
import { app, setLens, requestRender } from '../app/state.js';
import { byId } from '../markets/registry.js';
import { boardTriggers, boardViewFor } from '../markets/viewBoard.js';
import { dimension } from '../governance/investability.js';
import { isResolved, byExpected } from '../governance/triggers.js';
import { playTitle } from '../governance/playTitle.js';
import { CALLS, LENSES } from '../experience/model.js';
import { link, eyebrow, sectionTitle } from '../experience/chrome.js';

const DAY = 86_400_000;
const RING_DAYS = 45, PREPARE_DAYS = 120, WARN_DAYS = 365;

const lens = () => (LENSES[app.lens] ? app.lens : 'infraFund');
const zh = () => app.lang === 'zh';

/* ---- dates ---------------------------------------------------------------- */

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const dueOf = eventDue;
const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dateText(expected){
  if (!expected) return L(['Not yet dated', '日期未定']);
  const [y, m, d] = expected.split('-').map(Number);
  if (zh()) return d ? `${y}年${m}月${d}日` : `${y}年${m}月`;
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
}
const countdown = e => L(eventCountdown(e));
/* ---- events ---------------------------------------------------------------- */

const marketName = id => { const m = byId(id); return m ? L(m.manifest.shortName || m.manifest.name) : id; };
const marketFull = id => { const m = byId(id); return m ? L(m.manifest.name) : id; };
const marketHref = id => { const m = byId(id); return m ? `/markets/${m.manifest.slug}` : '/returns'; };

/** Every unresolved trigger, with the calls that name it, the plays behind them and the time left. */
export function upcomingEvents(today = todayISO()){
  return byExpected(boardTriggers().filter(t => !isResolved(t))).map(t => {
    const view = boardViewFor(t.market);
    const calls = [];
    for (const [id, v] of Object.entries(view?.verdicts || {})){
      if ((v.changesIf || []).includes(t.id)) calls.push({ lens: id, call: v.call, play: v.play || null, own: false });
    }
    for (const p of Object.values(view?.plays || {})){
      for (const [id, c] of Object.entries(p.calls || {})){
        if ((c.changesIf || []).includes(t.id)) calls.push({ lens: id, call: c.call, play: p.id, own: true });
      }
    }
    const due = dueOf(t.expected);
    const days = due ? daysBetween(today, due) : null;
    /* A play's next step belongs with the event when its own call names the
       event, or when it is due on or before the event lands. */
    const actions = [];
    const seen = new Set();
    for (const c of [...calls.filter(x => x.own), ...calls.filter(x => !x.own)]){
      const p = c.play && view?.plays?.[c.play];
      if (!p?.action || seen.has(p.id)) continue;
      if (!c.own && due && p.action.due && p.action.due > due) continue;
      seen.add(p.id);
      actions.push({ play: p, text: p.action.text, due: p.action.due || null });
    }
    const opens = t.direction === 'up' || t.direction === 'either';
    const bell = !opens || days === null || days > WARN_DAYS ? null
      : days <= RING_DAYS && t.expected?.length === 10 ? 'ring' : days <= PREPARE_DAYS ? 'prepare' : 'warn';
    return { ...t, calls, actions, due, days, bell };
  });
}

const BELL_LABEL = {
  ring: ['Ringing', '紧急提示'],
  prepare: ['Prepare now', '提前准备'],
  warn: ['Early warning', '早期预警'],
};
const DIRECTION_TEXT = {
  up: ['Could open the market', '可能打开市场'],
  either: ['Outcome decides the call', '结果决定投资结论'],
  down: ['Could close the market', '可能收紧市场'],
};
const HOW_TO_POSITION = {
  up: ['Line up sites, grid positions and price talks before it lands: the first movers price the opening.',
    '在事件落地前锁定场址、并网排位和价格谈判：先行者决定开放后的定价。'],
  either: ['Prepare both outcomes: the case re-runs on the result, and the call moves with it.',
    '为两种结果都做好准备：方案将按结果重新测算，投资结论随之调整。'],
};

const watchText = e => (e.watches || []).map(id => L(dimension(id)?.label || [id, id])).join(L([', ', '、']));

function callChips(e){
  if (!e.calls.length) return h('p', { class: 'nw-quiet' }, L(['No investor call names this event yet; it is tracked for the market view.', '尚无投资结论引用此事件；作为市场观点跟踪。']));
  const mine = lens();
  const byLens = new Map();
  for (const c of e.calls) if (!byLens.has(c.lens) || c.own) byLens.set(c.lens, c);
  const ordered = [...byLens.values()].sort((a, b) => (b.lens === mine) - (a.lens === mine));
  return h('ul', { class: 'nw-calls', 'aria-label': L(['Investor calls this event would move', '此事件将影响的投资结论']) },
    ordered.map(c => h('li', { class: c.lens === mine ? 'is-mine' : '' },
      h('span', {}, L(LENSES[c.lens] || [c.lens, c.lens])),
      h('span', { class: `ix-tag ${c.call}` }, L(CALLS[c.call] || [c.call, c.call])))));
}

function bellCard(e, headlines){
  const related = headlines.filter(n => n.markets.includes(e.market)).slice(0, 2);
  return h('article', { class: `nw-bell nw-${e.bell}`, 'data-market': e.market },
    h('div', { class: 'nw-bell-top' },
      h('span', { class: 'nw-bell-badge' }, h('span', { class: 'nw-bell-icon', 'aria-hidden': 'true' }), L(BELL_LABEL[e.bell])),
      h('span', { class: 'nw-when' }, h('strong', {}, dateText(e.expected)), h('span', {}, countdown(e)))),
    h('div', { class: 'nw-bell-market' }, link(marketHref(e.market), marketFull(e.market), 'nw-market-link'),
      h('span', { class: `nw-direction nw-${e.direction}` }, L(DIRECTION_TEXT[e.direction]))),
    h('h3', {}, L(e.label)),
    e.watches?.length ? h('p', { class: 'nw-moves' }, h('b', {}, L(['Would move: ', '将影响：'])), watchText(e)) : null,
    callChips(e),
    h('div', { class: 'nw-position' }, eyebrow(['POSITION BEFORE IT LANDS', '落地前的布局']),
      e.actions.length
        ? h('ul', {}, e.actions.map(a => h('li', {},
          h('b', {}, L(playTitle(a.play))), a.due ? h('span', { class: 'nw-due' }, L(['Action target ', '行动目标 ']), dateText(a.due)) : null,
          h('p', {}, L(a.text)))))
        : h('p', {}, L(HOW_TO_POSITION[e.direction]))),
    related.length ? h('div', { class: 'nw-related' }, h('span', { class: 'ix-mono' }, L(['OTHER NEWS FROM THIS MARKET', '该市场其他动态'])),
      related.map(n => h('a', { href: n.url, target: '_blank', rel: 'noopener noreferrer' }, L(newsTextPair(n)), ' ↗'))) : null,
    h('div', { class: 'nw-bell-foot' }, link(marketHref(e.market)+(e.actions[0]?.play?.id?'?play='+encodeURIComponent(e.actions[0].play.id)+'#route-options':''), ['Open the affected investment route ↗', '查看受影响的投资路线 ↗'], 'ix-text-link')));
}

function riskRow(e){
  return h('li', { class: 'nw-risk' },
    h('span', { class: 'nw-when' }, h('strong', {}, dateText(e.expected)), e.days !== null ? h('span', {}, countdown(e)) : null),
    h('div', {},
      h('div', { class: 'nw-risk-head' }, link(marketHref(e.market), marketName(e.market), 'nw-market-link'), ' · ', L(e.label)),
      h('p', { class: 'nw-moves' }, e.watches?.length ? [h('b', {}, L(['Would weaken: ', '将削弱：'])), watchText(e), ' · '] : null,
        e.calls.length ? L([`Named in ${new Set(e.calls.map(c => c.lens)).size} investor ${new Set(e.calls.map(c => c.lens)).size === 1 ? 'call' : 'calls'}. Re-test the case before committing capital.`,
          `被${new Set(e.calls.map(c => c.lens)).size}项投资结论引用。投入资本前请重新测试方案。`])
          : L(['Re-test the case before committing capital.', '投入资本前请重新测试方案。']))));
}

function calendar(events, today){
  const start = today.slice(0, 7);
  const [y0, m0] = start.split('-').map(Number);
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(y0, m0 - 1 + i, 1));
    return d.toISOString().slice(0, 7);
  });
  const dated = events.filter(e => e.expected && e.days !== null && e.days >= 0);
  const cols = months.map(month => ({ month, items: dated.filter(e => e.expected.slice(0, 7) === month) })).filter(c => c.items.length);
  const later = dated.filter(e => e.expected.slice(0, 7) > months[months.length - 1]);
  const undated = events.filter(e => !e.expected && e.direction !== 'down');
  const item = e => h('li', { class: `nw-cal-item nw-${e.direction}` + (e.bell ? ' has-bell' : '') },
    h('span', { class: 'nw-cal-date' }, dateText(e.expected)),
    h('span', {}, link(marketHref(e.market), marketName(e.market), 'nw-market-link'), ' — ', L(e.label)),
    e.bell ? h('span', { class: 'nw-cal-bell', title: L(BELL_LABEL[e.bell]) }, L(BELL_LABEL[e.bell])) : null);
  const monthName = key => { const [y, m] = key.split('-').map(Number); return zh() ? `${y}年${m}月` : `${MONTHS[m - 1]} ${y}`; };
  return h('div', { class: 'nw-calendar' },
    cols.map(c => h('div', { class: 'nw-cal-month' }, h('h4', {}, monthName(c.month)), h('ul', {}, c.items.map(item)))),
    later.length ? h('div', { class: 'nw-cal-month' }, h('h4', {}, L(['Beyond twelve months', '十二个月之后'])), h('ul', {}, later.map(item))) : null,
    undated.length ? h('div', { class: 'nw-cal-month nw-cal-undated' }, h('h4', {}, L(['Announced, not yet dated', '已宣布、日期未定'])), h('ul', {}, undated.map(item))) : null,
    h('p', { class: 'nw-legend' },
      h('span', { class: 'nw-up' }, L(['could open', '可能打开'])),
      h('span', { class: 'nw-either' }, L(['outcome decides', '结果决定'])),
      h('span', { class: 'nw-down' }, L(['could close', '可能收紧']))));
}

function metaBar(){
  const select = h('select', { 'aria-label': L(['Investor profile', '投资者类型']), onchange: e => { setLens(e.target.value); requestRender(); } },
    Object.entries(LENSES).map(([id, label]) => h('option', { value: id }, L(label))));
  select.value = lens();
  return h('div', { class: 'ix-meta-bar' }, h('span', { class: 'ix-mono' }, L(['MARKET WATCH', '市场观察'])),
    h('label', { class: 'ix-select-label' }, h('span', {}, L(['INVESTOR VIEW', '投资者视角'])), select));
}

export function renderEventWatch(container,{headlines=[],marketId=null}={}){
  const today=todayISO();
  const events=upcomingEvents(today).filter(e=>!marketId||e.market===marketId);
  const bells=events.filter(e=>e.bell);
  const risks=events.filter(e=>e.direction==='down'&&(e.days===null||(e.days>=0&&e.days<=WARN_DAYS)));
  const overdue=events.filter(e=>e.days!==null&&e.days<0);
  const content=h('div',{class:'nw-page'});
  content.append(metaBar());
  const bellHost = h('div', { class: 'nw-bells' });
  content.append(h('section', { class: 'ix-section', id: 'bell' },
    h('div', { class: 'ix-heading-row' }, sectionTitle(['THE OPPORTUNITY BELL', '机会提示'], ['Events that could open a market.', '可能打开市场的事件。'],
      ['Rings when an event that could open a market, or decide its call, is dated inside twelve months. Louder as the date gets closer.', '当可能打开市场或决定投资结论的事件在十二个月内有确定日期时提示；越临近，提示级别越高。'])),
    bellHost));
  content.append(h('section', { class: 'ix-section nw-two-col' },
    h('div', { id: 'risk-watch' }, sectionTitle(['RISK WATCH', '风险观察'], ['Events that could close one.', '可能收紧市场的事件。']),
      risks.length ? h('ul', { class: 'nw-risks' }, risks.map(riskRow)) : h('p', { class: 'nw-quiet' }, L(['No closing event is on the record.', '暂无记录在案的收紧事件。'])),
      overdue.length ? h('div', { class: 'nw-overdue' }, eyebrow(['DATE PASSED — OUTCOME TO CONFIRM', '日期已过 — 结果待确认']),
        h('ul', { class: 'nw-risks' }, overdue.map(riskRow))) : null),
    h('div', { id: 'calendar' }, sectionTitle(['POLICY & MARKET CALENDAR', '政策与市场日历'], ['The next twelve months.', '未来十二个月。']), calendar(events, today))));

  bellHost.replaceChildren(...(bells.length?bells.map(e=>bellCard(e,headlines)):[h('p',{class:'nw-quiet'},L(['No opportunity event is dated inside twelve months.','十二个月内暂无已定日期的机会事件。']))]));
  container.append(content);
}
