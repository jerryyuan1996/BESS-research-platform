/* ---------------------------------------------------------------------------
   THE BRIEFING — the home page, conclusion first.

   PR 4 of the guided-experience plan. Six answers, in the order a reader with
   thirty seconds needs them, for the investor chosen (the infrastructure fund
   unless another is):

     1  the call                what to do across the platform
     2  what changed            since this reader's last visit on this device
     3  what's coming           dated catalysts in the next ninety days
     4  where to focus          the shortlist of plays: call, then value
     5  what to build           one line per market on route and hours
     6  next actions            the analyst's next steps for this investor

   Below them, folded, the board that used to be the home page: every
   investor's verdicts, the return-against-entry map and the full calendar.

   Everything here is read from HOME_BRIEFING, which the build writes from the
   same model as the weekly digest (briefing/model.js). This module computes
   nothing an investor reads except dates relative to the reader's own clock
   and the cut at "since your last visit".

   Fetched on demand by homePage.js.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, setLens, readSeen, writeSeen, DEFAULT_LENS } from '../app/state.js';
import { navigate } from '../app/router.js';
import { markets, byId } from '../markets/registry.js';
import { marketFlagCode } from '../components/navigation.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { nextSeen } from '../briefing/since.js';
import { percent, perMW, dateText } from '../briefing/sentences.js';
import {
  TIER_ORDER, TIER_LABEL, TIER_MEANING, EVIDENCE_LABEL, CHANGE_CLASS, CHANGE_CLASS_ORDER, MAX_CHANGES, CATALYST_WINDOW_DAYS,
} from '../governance/briefing.js';
import { ARCHETYPE_IDS } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { TRIGGER_DIRECTION_LABEL } from '../governance/triggers.js';
import { verdictGlyph } from './verdictGlyph.js';

const DAY = 86_400_000;
const ARROW = { up: '↗', down: '↘', either: '↔' };

/* ---- small pieces ---------------------------------------------------------------- */

function go(href){
  return (event) => { event.preventDefault(); navigate(href); window.scrollTo(0, 0); };
}

function marketLink(id){
  const m = byId(id);
  const slug = HOME_BRIEFING.markets[id]?.slug;
  const name = HOME_BRIEFING.markets[id]?.name || [id, id];
  return h('a', { class: 'bf-mkt', href: `/markets/${slug}`, onclick: go(`/markets/${slug}`) },
    m ? h('span', { class: `market-flag fi fi-${marketFlagCode(m)}`, 'aria-hidden': 'true' }) : null,
    L(name));
}

/** A date as the reader reads it: "24 Nov 2026 · in 39 days". A bare month reads as the month. */
function when(expected, todayMs){
  if (!expected) return L(['undated', '未定日期']);
  const due = Date.parse(`${expected.length === 7 ? `${expected}-28` : expected}T00:00:00Z`);
  const days = Math.round((due - todayMs) / DAY);
  const rel = expected.length === 7
    ? (days < 0 ? ['passed', '已过'] : ['', ''])
    : days === 0 ? ['today', '今天'] : days > 0 ? [`in ${days} days`, `${days}天后`] : [`${-days} days ago`, `${-days}天前`];
  const date = dateText(expected);
  return L(date) + (rel[0] ? ` · ${L(rel)}` : '');
}

const shortDay = (iso) => {
  const d = new Date(iso);
  return L([`${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}`,
    `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`]);
};

function section(title, sub, ...kids){
  return h('section', { class: 'card bf-card' },
    h('h2', { class: 'bf-h' }, L(title)),
    sub ? h('div', { class: 'cap' }, L(sub)) : null,
    ...kids);
}

/* ---- the lens -------------------------------------------------------------------- */

const lensOf = () => (ARCHETYPE_IDS.includes(app.lens) ? app.lens : DEFAULT_LENS);

function lensBar(lens){
  const button = (id) => h('button', {
    class: 'btn lens-btn', type: 'button', 'aria-pressed': String(lens === id),
    onclick: () => { const y = window.scrollY; setLens(id); requestRender(); window.scrollTo(0, y); },
  }, L(ARCHETYPES[id].label));
  return h('div', { class: 'lens-bar bf-lens', role: 'group', 'aria-label': L(['Investor lens', '投资者视角']) },
    h('span', { class: 'lens-label' }, L(['Reading as', '视角'])),
    ARCHETYPE_IDS.map(button));
}

/* ---- the six answers --------------------------------------------------------------- */

function theCall(b, lens, view, seen){
  const flagged = view.rows.filter(r => r.flag);
  const built = new Date(b.builtAt);
  const sinceText = seen.firstVisit
    ? L(['First visit on this device: changes are from the last seven days.', '本设备首次访问：变化取自最近七天。'])
    : L([`Since your last visit on this device, ${shortDay(new Date(seen.since).toISOString())}.`, `自您上次在本设备访问（${shortDay(new Date(seen.since).toISOString())}）以来。`]);
  return h('section', { class: 'card bf-call' },
    h('div', { class: 'bf-kicker' }, L(['The call', '结论']), ' · ', L(ARCHETYPES[lens].label)),
    h('p', { class: 'bf-call-text' }, L(view.call)),
    flagged.length ? h('div', { class: 'bf-call-flag' }, '⚑ ',
      L([`${flagged.length} ${flagged.length === 1 ? 'call runs' : 'calls run'} against the economics on this list. `,
         `本列表中有${flagged.length}个结论与经济性不一致。`]),
      h('a', { href: '/desk', onclick: go('/desk') }, L(['Review on the desk ▸', '在分析台复核 ▸']))) : null,
    h('div', { class: 'bf-asof' },
      L(['Built ', '生成于']), L(dateText(built.toISOString().slice(0, 10))), ' · ', sinceText));
}

function whatChanged(b, lens, seen){
  const since = new Date(seen.since).toISOString();
  const all = b.changes.filter(c => c.at >= since && (!c.archetype || c.archetype === lens));
  const views = all.filter(c => c.cls === CHANGE_CLASS.VIEW);
  const rest = all.filter(c => c.cls !== CHANGE_CLASS.VIEW)
    .sort((a, c) => CHANGE_CLASS_ORDER.indexOf(a.cls) - CHANGE_CLASS_ORDER.indexOf(c.cls) || c.at.localeCompare(a.at));
  const shown = rest.slice(0, MAX_CHANGES);
  const list = h('ul', { class: 'bf-list' });
  for (const c of shown){
    if (c.cls === CHANGE_CLASS.NEWS){
      list.append(h('li', { class: 'bf-li bf-news' },
        h('span', { class: 'bf-date' }, shortDay(c.at)),
        h('span', { class: 'bf-tags' }, c.markets.map(m => h('span', { class: 'bf-tag' }, L(b.markets[m]?.name || [m, m])))),
        h('a', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, c.title),
        h('span', { class: 'bf-src' }, ` · ${c.publisher}`)));
    } else {
      list.append(h('li', { class: `bf-li bf-${c.cls}` }, h('span', { class: 'bf-date' }, shortDay(c.at)), h('span', {}, L(c.text))));
    }
  }
  if (views.length){
    list.append(h('li', { class: 'bf-li bf-view' }, h('span', { class: 'bf-date' }, shortDay(views[0].at)),
      h('span', {}, L([`${views.length} ${views.length === 1 ? 'thesis or play was' : 'theses and plays were'} written or rewritten.`,
        `${views.length}项投资论点或方案已撰写或更新。`]))));
  }
  const empty = !shown.length && !views.length;
  return section(['What changed', '有何变化'],
    seen.firstVisit ? ['The last seven days: calls, catalysts, price moves and headlines about these markets.', '最近七天：结论、触发事件、价格变动及与这些市场相关的新闻。']
      : ['Since your last visit: calls, catalysts, price moves and headlines about these markets.', '自上次访问以来：结论、触发事件、价格变动及与这些市场相关的新闻。'],
    empty ? h('div', { class: 'bf-empty' }, L(['Nothing material.', '没有重要变化。'])) : list,
    h('div', { class: 'bf-more-links' },
      h('a', { href: '/changes', onclick: go('/changes') }, L(['Every change ▸', '全部变更 ▸'])), ' · ',
      h('a', { href: '/news', onclick: go('/news') }, L(['Every headline ▸', '全部新闻 ▸']))));
}

function whatsComing(b, view, todayMs){
  const today = new Date(todayMs).toISOString().slice(0, 10);
  const horizon = new Date(todayMs + CATALYST_WINDOW_DAYS * DAY).toISOString().slice(0, 10);
  const open = new Set(view.rows.filter(r => r.tier !== 'park').map(r => r.market));
  const due = (t) => (t.expected.length === 7 ? `${t.expected}-28` : t.expected);
  const items = b.catalysts.map(id => b.triggers[id])
    .filter(t => t && open.has(t.market) && (t.expected.length === 7 ? `${t.expected}-31` : t.expected) >= today && due(t) <= horizon);
  const list = h('ul', { class: 'bf-list' }, items.map(t => h('li', { class: 'bf-li' },
    h('span', { class: 'bf-date bf-when' }, when(t.expected, todayMs)),
    marketLink(t.market),
    h('span', {}, ' ', L(t.label), ' '),
    h('span', { class: `bf-dir bf-dir-${t.direction}`, title: L(TRIGGER_DIRECTION_LABEL[t.direction] || ['', '']) }, ARROW[t.direction] || ''))));
  return section(['What\'s coming', '即将发生'],
    [`Dated catalysts in the next ${CATALYST_WINDOW_DAYS} days for the markets on this list. ↗ would open a market further, ↘ close it further, ↔ the outcome decides.`,
     `未来${CATALYST_WINDOW_DAYS}天内与本列表市场相关、已定日期的触发事件。↗ 将使市场更开放，↘ 将进一步收紧，↔ 视结果而定。`],
    items.length ? list : h('div', { class: 'bf-empty' }, L(['No dated catalyst in the window.', '窗口期内没有已定日期的触发事件。'])),
    h('div', { class: 'bf-more-links' }, L(['Later and undated catalysts are in the full calendar below.', '更远及未定日期的触发事件见下方完整日历。'])));
}

function whereToFocus(b, view, todayMs){
  const retName = view.returnField === 'exit' ? ['Exit IRR', '退出IRR'] : ['Hold IRR', '持有期IRR'];
  const table = h('table', { class: 'bf-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Play', '方案'])), h('th', { class: 'num' }, L(['Value / MW', '每MW价值'])), h('th', { class: 'num' }, L(retName)),
      h('th', { class: 'num' }, L(['Secured', '锁定收入'])), h('th', {}, L(['Evidence', '证据'])), h('th', {}, L(['Next catalyst', '下一事件'])))));
  const body = h('tbody', {});
  for (const tier of TIER_ORDER){
    const rows = view.rows.filter(r => r.tier === tier);
    if (!rows.length) continue;
    body.append(h('tr', { class: `bf-tier bf-tier-${tier}` }, h('th', { colspan: '6' },
      verdictGlyph(rows[0].call, 14), ' ', L(TIER_LABEL[tier]), h('span', { class: 'bf-tier-mean' }, ' — ', L(TIER_MEANING[tier])))));
    for (const r of rows){
      const p = b.plays[`${r.market}/${r.play}`];
      const e = p.econ;
      const value = e.withheld ? L(['not priced', '未定价']) : !e.eligible ? L(['not compliant', '不合规']) : L(perMW(e.value));
      const secured = e.secured === null || e.secured === undefined ? '—' : `${percent(e.secured)}${e.securedYears ? L([` · ${e.securedYears}y`, ` · ${e.securedYears}年`]) : ''}`;
      const next = r.next ? b.triggers[r.next] : null;
      body.append(h('tr', { class: 'bf-row' + (r.flag ? ' bf-flagged' : '') },
        h('td', { class: 'bf-play' },
          marketLink(r.market), h('span', { class: 'bf-label' }, ' · ', L(p.label)),
          r.own ? h('span', { class: 'bf-own' }, L(['own call', '独立结论'])) : null,
          p.why ? h('div', { class: 'bf-why' }, L(p.why)) : null,
          r.flag ? h('div', { class: 'bf-flag' }, '⚑ ', L(r.flagText)) : null),
        h('td', { class: 'num' + (e.value < 0 ? ' bf-neg' : '') }, value),
        h('td', { class: 'num' }, percent(e[view.returnField])),
        h('td', { class: 'num' }, secured),
        h('td', {}, h('span', { class: `bf-ev bf-ev-${r.evidence}` }, L(EVIDENCE_LABEL[r.evidence]))),
        h('td', { class: 'bf-next' }, next ? [L(next.label), h('div', { class: 'bf-when' }, when(next.expected, todayMs))] : '—')));
    }
  }
  table.append(body);
  return section(['Where to focus', '重点方向'],
    [`Every play for this investor, by call and then by value per MW at the platform's yields (7.5% on secured revenue, 11.5% on merchant). Returns are unlevered, exit year ${b.exitYear}. ⚑ marks a call that runs against its economics.`,
     `该投资者的全部方案，先按结论、再按平台收益率下的每MW价值排序（锁定收入7.5%，市场化收入11.5%）。回报为无杠杆、第${b.exitYear}年退出。⚑ 表示结论与经济性不一致。`],
    h('div', { class: 'table-wrap' }, table));
}

function whatToBuild(b){
  const list = h('ul', { class: 'bf-list bf-build' }, b.build.map(x => {
    const text = L(x.line);
    const cut = text.search(/[:：]/);
    return h('li', { class: 'bf-li' }, cut > 0 ? [h('b', {}, text.slice(0, cut + 1)), text.slice(cut + 1)] : text);
  }));
  return section(['What to build', '应建什么'],
    ['The route and hours each market pays for, from the engine\'s design-fit sweep, at the platform\'s yields.', '各市场为何种路径与时长付费，来自引擎的设计匹配扫描，按平台收益率计算。'],
    list);
}

function nextActions(b, view, todayMs){
  const list = h('ul', { class: 'bf-list' }, view.actions.map(a => {
    const p = b.plays[`${a.market}/${a.play}`];
    return h('li', { class: 'bf-li' },
      h('span', { class: 'bf-date bf-when' }, a.due ? when(a.due, todayMs) : L(['no date', '未定日期'])),
      marketLink(a.market), h('span', { class: 'bf-label' }, ' · ', L(p.label)), h('div', { class: 'bf-why' }, L(a.text)));
  }));
  const q = b.queueSummary;
  return section(['Your next actions', '下一步行动'],
    ['The analyst\'s next step on each play in an acting tier, soonest first.', '处于行动层级的各方案的下一步，按时间先后排列。'],
    view.actions.length ? list : h('div', { class: 'bf-empty' }, L(['No action is written for this investor yet.', '该投资者尚无已写明的行动。'])),
    h('div', { class: 'bf-more-links' },
      h('a', { href: '/desk', onclick: go('/desk') },
        L([`The analyst desk: ${q.total} ${q.total === 1 ? 'item' : 'items'} to keep the calls current ▸`, `分析台：${q.total}项待办，用于保持结论最新 ▸`]))));
}

/* ---- the fold ----------------------------------------------------------------------- */

let board = null;

function theFold(){
  const holder = h('div', { class: 'bf-fold-body' });
  const details = h('details', { class: 'bf-fold' },
    h('summary', {}, L(['Every investor\'s verdicts, the return-against-entry map and the full calendar', '全部投资者的结论、回报与进入难易对照图及完整日历'])),
    holder);
  details.addEventListener('toggle', () => {
    if (!details.open || holder.childNodes.length) return;
    const draw = (m) => { holder.innerHTML = ''; m.renderVerdictHome(holder); };
    if (board) return void draw(board);
    holder.append(h('div', { class: 'dash-skeleton', 'aria-busy': 'true' }, h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
    import('./verdictHome.js').then(m => { board = m; if (holder.isConnected) draw(m); })
      .catch(() => { holder.innerHTML = ''; holder.append(h('div', { class: 'warnbox' }, L(['The board could not be loaded. Reloading fixes that.', '看板未能加载，刷新即可。']))); });
  });
  return details;
}

/* ---- the page ------------------------------------------------------------------------ */

export function renderBriefingHome(main){
  const b = HOME_BRIEFING;
  const lens = lensOf();
  const view = b.lenses[lens];
  const todayMs = Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
  const seen = nextSeen(readSeen(), Date.now());
  writeSeen(seen);

  main.append(lensBar(lens));
  main.append(theCall(b, lens, view, seen));
  main.append(h('div', { class: 'grid g2 bf-pair' }, whatChanged(b, lens, seen), whatsComing(b, view, todayMs)));
  main.append(whereToFocus(b, view, todayMs));
  main.append(h('div', { class: 'grid g2 bf-pair' }, whatToBuild(b), nextActions(b, view, todayMs)));
  main.append(theFold());
}

export { markets };
