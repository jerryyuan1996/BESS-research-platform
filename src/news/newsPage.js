import { eventDue, eventCountdown } from './eventDates.js';
/* ---------------------------------------------------------------------------
   INDUSTRY NEWS — what is coming, and what just happened.

   Two sources, one page:

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
import { app, setLens, requestRender } from '../app/state.js';
import { byId } from '../markets/registry.js';
import { boardTriggers, boardViewFor } from '../markets/viewBoard.js';
import { tagHeadline } from '../governance/newsTags.js';
import { dimension } from '../governance/investability.js';
import { isResolved, byExpected } from '../governance/triggers.js';
import { playTitle } from '../governance/playTitle.js';
import { CALLS, LENSES } from '../experience/model.js';
import { siteHeader, siteFooter, link, eyebrow, sectionTitle } from '../experience/chrome.js';

const DATA_URL = '/data/public/industry-news.json';
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
const newsDate = value => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleDateString(zh() ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
};

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
      related.map(n => h('a', { href: n.url, target: '_blank', rel: 'noopener noreferrer' }, n.title, ' ↗'))) : null,
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

/* ---- headlines ------------------------------------------------------------- */

const CATEGORIES = [
  ['all', ['All', '全部']],
  ['platform', ['Platform markets', '平台覆盖市场']],
  ['capital', ['Capital & M&A', '资本与并购']],
  ['policy', ['Policy & trade', '政策与贸易']],
  ['grid', ['Grid & markets', '电网与市场']],
  ['technology', ['Technology', '储能技术']],
];

async function loadNews(){
  const response = await fetch(DATA_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`news snapshot ${response.status}`);
  const snapshot = await response.json();
  const items = [...(snapshot.series || [])].reverse().map(item => ({ ...item, markets: tagHeadline(item) }));
  return { snapshot, items };
}

function headline(item, eventMarkets){
  const linked = item.markets.some(m => eventMarkets.has(m));
  return h('article', { class: 'nw-item', 'data-news-category': item.category || 'grid' },
    h('div', { class: 'nw-item-meta' },
      h('span', {}, item.source), h('span', {}, item.categoryLabel || item.category), h('time', { datetime: item.t || '' }, newsDate(item.t))),
    h('a', { class: 'nw-item-title', href: item.url, target: '_blank', rel: 'noopener noreferrer' }, item.title),
    item.summary ? h('p', {}, item.summary.replace(/\s*The post .* appeared first on .*$/s, '')) : null,
    item.markets.length ? h('div', { class: 'nw-item-tags' },
      item.markets.map(m => link(marketHref(m), marketName(m), 'nw-chip')),
      linked ? h('span', { class: 'nw-chip nw-chip-bell' }, L(['Upcoming event in this market', '该市场有待发生事件'])) : null) : null);
}

function renderHeadlines(host, items, eventMarkets, snapshot){
  const state = { category: items.some(i => i.markets.length) ? 'platform' : 'all', market: 'all' };
  const list = h('div', { class: 'nw-list' });
  const tabs = h('div', { class: 'ix-segments nw-filters', role: 'group', 'aria-label': L(['Filter headlines', '筛选新闻']) });
  const covered = [...new Set(items.flatMap(i => i.markets))].sort((a, b) => marketName(a).localeCompare(marketName(b)));
  const select = h('select', { 'aria-label': L(['Filter by market', '按市场筛选']), onchange: e => { state.market = e.target.value; draw(); } },
    h('option', { value: 'all' }, L(['All markets', '全部市场'])), covered.map(m => h('option', { value: m }, marketName(m))));
  const draw = () => {
    for (const b of tabs.children) b.setAttribute('aria-pressed', String(b.dataset.category === state.category));
    const shown = items.filter(i =>
      (state.category === 'all' || (state.category === 'platform' ? i.markets.length : i.category === state.category))
      && (state.market === 'all' || i.markets.includes(state.market)));
    list.replaceChildren(...(shown.length ? shown.map(i => headline(i, eventMarkets))
      : [h('p', { class: 'nw-quiet' }, L(['No headline matches this filter.', '当前筛选条件下暂无新闻。']))]));
  };
  for (const [id, label] of CATEGORIES){
    tabs.append(h('button', { type: 'button', 'data-category': id, onclick: () => { state.category = id; draw(); } }, L(label)));
  }
  const sources = snapshot.derived?.sourceStatus || [];
  host.replaceChildren(
    h('div', { class: 'nw-filter-bar' }, tabs, select),
    list,
    h('p', { class: 'ix-caption nw-sources' }, L(['Public feeds: ', '公开新闻源：']),
      ...sources.flatMap((s, i) => [i ? ' · ' : '', h('a', { href: s.homepage, target: '_blank', rel: 'noopener noreferrer', class: s.status === 'ok' ? '' : 'nw-stale' }, s.source)]),
      ' · ', L(['latest item ', '最新条目 ']), newsDate(snapshot.coverage?.to),
      ' · ', L(['titles, short excerpts and links only; articles stay with their publishers.', '仅保留标题、短摘要与链接，全文归原发布方。'])));
  draw();
}

/* ---- page ------------------------------------------------------------------- */

function metaBar(){
  const select = h('select', { 'aria-label': L(['Investor profile', '投资者类型']), onchange: e => { setLens(e.target.value); requestRender(); } },
    Object.entries(LENSES).map(([id, label]) => h('option', { value: id }, L(label))));
  select.value = lens();
  return h('div', { class: 'ix-meta-bar' }, h('span', { class: 'ix-mono' }, `04 / ${L(['INDUSTRY NEWS', '行业新闻'])}`),
    h('label', { class: 'ix-select-label' }, h('span', {}, L(['INVESTOR VIEW', '投资者视角'])), select));
}

export function renderNewsPage(container){
  container.classList.add('ix-app');
  container.append(siteHeader('news'));
  const today = todayISO();
  const events = upcomingEvents(today);
  const bells = events.filter(e => e.bell);
  const ringing = bells.filter(e => e.bell === 'ring');
  const risks = events.filter(e => e.direction === 'down' && (e.days === null || (e.days >= 0 && e.days <= WARN_DAYS)));
  const overdue = events.filter(e => e.days !== null && e.days < 0);
  const eventMarkets = new Set(events.filter(e => e.days === null || e.days <= WARN_DAYS).map(e => e.market));

  const content = h('main', { id: 'ix-main', class: 'ix-container nw-page', tabindex: -1 });
  content.append(metaBar());
  content.append(h('section', { class: 'ix-page-intro nw-intro' },
    eyebrow(['WHAT IS COMING · WHAT JUST HAPPENED', '即将发生 · 刚刚发生']),
    h('h1', {}, L(['Policy moves first.\nCapital follows.', '政策先行，\n资本随后。'])),
    h('p', { class: 'ix-lead' }, L(['Auctions, rule changes and grid orders that can open a market, dated and tied to the investor calls they would move. Then the week’s storage headlines.',
      '可能打开市场的拍卖、规则变化与电网指令，按日期列出，并对应到将受影响的投资结论；随后是本周储能新闻。'])),
    h('div', { class: 'nw-summary' },
      h('div', {}, h('strong', {}, String(ringing.length)), h('span', {}, L(['ringing within 45 days', '45天内紧急提示']))),
      h('div', {}, h('strong', {}, String(bells.length)), h('span', {}, L(['opportunity bells in 12 months', '12个月内机会提示']))),
      h('div', {}, h('strong', {}, String(risks.length)), h('span', {}, L(['risks on watch', '风险观察']))),
      h('div', {}, h('strong', {}, String(new Set(events.map(e => e.market)).size)), h('span', {}, L(['markets with open events', '有待发生事件的市场']))))));

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

  const newsHost = h('div', { class: 'nw-news', 'aria-busy': 'true' }, h('p', { class: 'nw-quiet' }, L(['Loading the latest public feeds…', '正在读取最新公开新闻源…'])));
  content.append(h('section', { class: 'ix-section', id: 'headlines' },
    sectionTitle(['STORAGE HEADLINES', '储能新闻'], ['What the market is reading.', '市场正在关注什么。'],
      ['Tagged to the platform’s markets. A headline in a market with an upcoming event is flagged.', '已标注对应的平台市场；所在市场有待发生事件的新闻会被标出。']),
    newsHost));
  container.append(content, siteFooter());

  const drawBells = (headlines = []) => bellHost.replaceChildren(...(bells.length ? bells.map(e => bellCard(e, headlines))
    : [h('p', { class: 'nw-quiet' }, L(['No opportunity event is dated inside twelve months.', '十二个月内暂无已定日期的机会事件。']))]));
  drawBells();
  loadNews().then(({ snapshot, items }) => {
    if (!newsHost.isConnected) return;
    drawBells(items);
    renderHeadlines(newsHost, items, eventMarkets, snapshot);
    newsHost.setAttribute('aria-busy', 'false');
  }).catch(() => {
    if (!newsHost.isConnected) return;
    newsHost.replaceChildren(h('p', { class: 'nw-quiet' }, L(['The news snapshot is unavailable right now. The event radar above is unaffected.', '新闻快照暂不可用；上方事件提示不受影响。'])));
    newsHost.setAttribute('aria-busy', 'false');
  });
}
