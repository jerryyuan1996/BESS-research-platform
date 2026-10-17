/* ---------------------------------------------------------------------------
   THE MARKET BRIEF — each market's landing tab, five minutes long.

   PR 5 of the guided-experience plan. For the investor chosen (the fund unless
   another is), in this order:

     the call       the call on each play, the thesis, what would change it
     what to build  the build line and the route × hours grid, with the why
     economics      value per MW, IRRs, secured share, payback, bear and bull
     risks          the strongest argument against, any barrier, the grades this
                    investor reads lowest, and catalysts that would close it
     catalysts      what is coming here, and what changed here
     next action    the analyst's next step on the play
     other views    the other three investors, and plays not on this lens
     go deeper      the tab that holds the evidence for each section

   and, folded, the four investors' verdict cards, the pillar table and the
   fourteen grades that used to open this tab.

   Every figure is the briefing's (briefing/model.js, built with the page), so
   the brief, the home page and the weekly digest quote the same numbers. The
   words are the view store's: the thesis, the play's line and action, the
   call's reasons.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, requestRender, setLens, DEFAULT_LENS } from '../app/state.js';
import { navigate } from '../app/router.js';
import { homeState } from '../home/state.js';
import { HOME_BRIEFING } from '../briefing/homeData.js';
import { percent, perMW, dateText } from '../briefing/sentences.js';
import { TIER_LABEL, EVIDENCE_LABEL, CHANGE_CLASS } from '../governance/briefing.js';
import { ARCHETYPE_IDS, VERDICT_LABEL, ROUTE_LABEL, dimension } from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { REVENUE_ROUTE_LABEL } from '../governance/plays.js';
import { byExpected, isResolved, TRIGGER_DIRECTION_LABEL } from '../governance/triggers.js';
import { verdictGlyph } from '../home/verdictGlyph.js';

const DAY = 86_400_000;
const ARROW = { up: '↗', down: '↘', either: '↔' };

const lensOf = () => (ARCHETYPE_IDS.includes(app.lens) ? app.lens : DEFAULT_LENS);
const playOf = (marketId, playId) => HOME_BRIEFING.plays[`${marketId}/${playId}`];

function go(href, before = null){
  return (event) => { event.preventDefault(); if (before) before(); navigate(href); window.scrollTo(0, 0); };
}

function card(title, ...kids){
  return h('section', { class: 'card bf-card' }, h('h3', { class: 'bf-h' }, L(title)), ...kids);
}

function when(expected){
  if (!expected) return L(['undated', '未定日期']);
  if (expected.length === 7) return L(dateText(expected));
  const days = Math.round((Date.parse(`${expected}T00:00:00Z`) - Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z')) / DAY);
  const rel = days === 0 ? ['today', '今天'] : days > 0 ? [`in ${days} days`, `${days}天后`] : [`${-days} days ago`, `${-days}天前`];
  return `${L(dateText(expected))} · ${L(rel)}`;
}

/* ---- the call ------------------------------------------------------------------ */

function theCall(marketId, view, lens, rows){
  const triggers = HOME_BRIEFING.triggers;
  const rates = rows.map(r => playOf(marketId, r.play)?.econ?.valuationRates).find(Boolean);
  const rateText = rates ? L([
    `value per MW at ${percent(rates.secured)} on secured, ${percent(rates.renewal)} on unawarded renewals and ${percent(rates.merchant)} on merchant revenue.`,
    `每MW价值按锁定收入${percent(rates.secured)}、未中标续约收入${percent(rates.renewal)}、市场化收入${percent(rates.merchant)}折现。`,
  ]) : L(['Valuation rates unavailable for unpriced cases.', '未定价情景无可用折现率。']);
  const callLines = rows.map(r => {
    const p = playOf(marketId, r.play);
    const next = r.next ? triggers[r.next] : null;
    return h('div', { class: 'mb-play' + (r.flag ? ' bf-flagged-block' : '') },
      h('div', { class: 'mb-callline' },
        verdictGlyph(r.call, 16), ' ',
        h('b', {}, L(VERDICT_LABEL[r.call] || [r.call, r.call])), ' · ', L(p.label),
        r.own ? h('span', { class: 'bf-own' }, L(['own call', '独立结论'])) : null,
        h('span', { class: `bf-ev bf-ev-${r.evidence} mb-ev` }, L(EVIDENCE_LABEL[r.evidence]))),
      p.why ? h('div', { class: 'bf-why' }, L(p.why)) : null,
      r.flag ? h('div', { class: 'bf-flag' }, '⚑ ', L(r.flagText)) : null,
      next ? h('div', { class: 'mb-changes' }, L(['Changes if: ', '改变条件：']), L(next.label), ' — ', when(next.expected)) : null);
  });
  const thesis = view.thesis || null;
  return h('section', { class: 'card bf-call' },
    h('div', { class: 'bf-kicker' }, L(['The brief', '要点']), ' · ', L(ARCHETYPES[lens].label)),
    thesis ? h('p', { class: 'bf-call-text mb-thesis' }, L(thesis)) : null,
    ...callLines,
    h('div', { class: 'bf-asof' }, L(['Figures built ', '数据生成于']), L(dateText(HOME_BRIEFING.builtAt.slice(0, 10))),
      L([`: unlevered, exit in operating year ${HOME_BRIEFING.exitYear}; `,
         `：无杠杆，投运后第${HOME_BRIEFING.exitYear}年退出；`]), rateText));
}

/* ---- what to build --------------------------------------------------------------- */

function routeName(route, plays){
  const p = plays.find(x => x.route === route);
  if (p) return [p.label[0].split(' · ')[0], p.label[1].split(' · ')[0]];
  return REVENUE_ROUTE_LABEL[route] || [route, route];
}

function whatToBuild(marketId, view){
  const line = HOME_BRIEFING.build.find(x => x.market === marketId)?.line;
  const grid = HOME_BRIEFING.grids?.[marketId];
  const plays = Object.values(view.plays || {});
  const kids = [line ? h('p', { class: 'mb-buildline' }, L(line)) : null];
  if (grid){
    const table = h('table', { class: 'bf-table mb-grid' },
      h('thead', {}, h('tr', {}, h('th', {}, L(['Hours', '时长'])),
        grid.routes.map(route => h('th', { class: 'num' }, L(routeName(route, plays)))))));
    const body = h('tbody', {});
    for (const hours of grid.hours){
      body.append(h('tr', { class: hours === grid.archetypeHours ? 'mb-arch' : '' },
        h('th', {}, `${hours}h`),
        grid.routes.map(route => {
          const c = grid.cells.find(x => x.route === route && x.hours === hours);
          if (!c || !c.priced) return h('td', { class: 'num mb-off' }, '—');
          const mark = c.best ? ' mb-best' : c.band ? ' mb-band' : '';
          return h('td', { class: 'num' + mark + (c.eligible ? '' : ' mb-off') },
            c.eligible ? L(perMW(c.value)).replace('/MW', '') : L(['fails floor', '不满足下限']),
            h('div', { class: 'bf-when' }, percent(c.hold)),
            c.archetype ? h('div', { class: 'bf-when' }, L(['modelled', '当前模型'])) : null);
        })));
    }
    table.append(body);
    kids.push(h('div', { class: 'table-wrap' }, table),
      h('div', { class: 'cap' }, L(['Each cell: value per MW at the platform\'s yields, then hold IRR. Bold is the best design; shaded is inside the band.',
        '每格：按平台收益率计算的每MW价值，其下为持有期IRR。粗体为最佳设计，底色为区间内设计。'])));
  }
  return card(['What to build and why', '应建什么，为什么'], ...kids,
    h('div', { class: 'bf-more-links' }, h('a', { href: `${base(marketId)}/revenue/duration`, onclick: go(`${base(marketId)}/revenue/duration`) },
      L(['The duration evidence ▸', '时长依据 ▸']))));
}

/* ---- economics ------------------------------------------------------------------ */

function economics(marketId, lens, rows){
  const r = rows.find(x => !x.own) || rows[0];
  if (!r) return null;
  const p = playOf(marketId, r.play);
  const e = p.econ;
  const field = HOME_BRIEFING.lenses[lens].returnField;
  if (e.withheld){
    return card(['Economics', '经济性'], h('p', {}, L(['Not priced: the engine withholds this market until its inputs are ready.', '未定价：在输入数据就绪之前，引擎暂不对该市场估值。'])));
  }
  const kpi = (label, value, sub = null) => h('div', { class: 'kpi' }, h('div', { class: 'lbl' }, L(label)), h('div', { class: 'val' }, value), sub ? h('div', { class: 'delta' }, sub) : null);
  const range = e.range && e.range.bear && e.range.bull
    ? `${percent(e.range.bear[field])} – ${percent(e.range.bull[field])}` : '—';
  return card(['Economics', '经济性'],
    h('div', { class: 'cap' }, L(p.label)),
    h('div', { class: 'kpis mb-kpis' },
      kpi(['Value per MW', '每MW价值'], e.priced && e.eligible ? L(perMW(e.value)) : L(['not compliant', '不合规'])),
      kpi(field === 'exit' ? ['Exit IRR', '退出IRR'] : ['Hold IRR', '持有期IRR'], percent(e[field]), L(['bear – bull: ', '悲观 – 乐观：']) + range),
      kpi(field === 'exit' ? ['Hold IRR', '持有期IRR'] : ['Exit IRR', '退出IRR'], percent(e[field === 'exit' ? 'hold' : 'exit'])),
      kpi(['Secured', '锁定收入'], Number.isFinite(e.secured) ? percent(e.secured) : '—', e.securedYears ? L([`for ${e.securedYears} years`, `${e.securedYears}年`]) : null),
      kpi(['Payback', '回收期'], e.payback ? L([`${e.payback} years`, `${e.payback}年`]) : L(['beyond the window', '超出测算期'])),
      kpi(['MOIC', '投资倍数'], Number.isFinite(e.moic) ? `${e.moic.toFixed(2)}×` : '—')),
    h('div', { class: 'bf-more-links' }, h('a', { href: '/investment-lab', onclick: go('/investment-lab', () => { homeState.labMarket = marketId; }) },
      L(['Retype the assumptions in the Investment Lab ▸', '在投资测算中修改假设 ▸']))));
}

/* ---- risks ------------------------------------------------------------------------ */

function risks(marketId, view, lens, rows, assessment){
  const r = rows.find(x => !x.own) || rows[0];
  const call = r?.own ? view.plays?.[r.play]?.calls?.[lens] : view.verdicts?.[lens];
  const items = [];
  const a = assessment?.byArchetype?.[lens];
  for (const k of a?.knockOuts || []){
    const d = dimension(k.dimension || k);
    items.push([['Barrier', '门槛'], d ? [`${d.label[0]} is graded ${k.grade ?? ''}: the investor is shut out.`, `${d.label[1]}评级为${k.grade ?? ''}：该投资者被挡在门外。`] : [String(k), String(k)]]);
  }
  if (call?.despite) items.push([['The strongest argument against', '最有力的反方理由'], call.despite]);
  /* The grades this investor reads lowest: where the market is weakest for them. */
  const reads = ARCHETYPES[lens]?.reads || {};
  const graded = Object.entries(view.grades || {}).map(([id, g]) => ({ id, grade: g.grade, read: reads[id]?.[g.grade] ?? reads[id]?.[String(g.grade)] }))
    .filter(x => Number.isFinite(x.read)).sort((x, y) => x.read - y.read).slice(0, 2);
  for (const x of graded){
    const d = dimension(x.id);
    const anchor = d?.anchors?.[x.grade] || d?.anchors?.[x.grade - 1];
    items.push([[`${d?.label?.[0] || x.id}: ${x.grade} of 5`, `${d?.label?.[1] || x.id}：5分中的${x.grade}分`], anchor || ['', '']]);
  }
  const down = byExpected((view.triggers || []).filter(t => t.direction === 'down' && !isResolved(t)));
  for (const t of down.slice(0, 2)) items.push([['Would close it further', '将进一步收紧'], [`${t.label[0]} (${dateText(t.expected)[0]})`, `${t.label[1]}（${dateText(t.expected)[1]}）`]]);
  return card(['Risks', '风险'],
    h('ul', { class: 'bf-list' }, items.slice(0, 5).map(([title, text]) => h('li', { class: 'bf-li' }, h('b', {}, L(title)), h('div', { class: 'bf-why' }, L(text))))),
    h('div', { class: 'bf-more-links' }, h('a', { href: `${base(marketId)}/entry`, onclick: go(`${base(marketId)}/entry`) }, L(['Entry and delivery ▸', '进入与交付 ▸']))));
}

/* ---- catalysts and changes --------------------------------------------------------- */

function catalysts(marketId, view){
  const today = new Date().toISOString().slice(0, 10);
  const open = byExpected((view.triggers || []).filter(t => !isResolved(t)));
  const ahead = open.filter(t => t.expected && (t.expected.length === 7 ? `${t.expected}-31` : t.expected) >= today);
  const undated = open.filter(t => !t.expected);
  const since = new Date(Date.now() - 45 * DAY).toISOString();
  const changes = HOME_BRIEFING.changes.filter(c => c.at >= since && (c.market === marketId || (c.markets || []).includes(marketId))).slice(0, 5);
  return card(['Catalysts and what changed', '触发事件与近期变化'],
    h('ul', { class: 'bf-list' },
      ahead.map(t => h('li', { class: 'bf-li' }, h('span', { class: 'bf-date bf-when' }, when(t.expected)), L(t.label), ' ',
        h('span', { class: `bf-dir bf-dir-${t.direction}`, title: L(TRIGGER_DIRECTION_LABEL[t.direction] || ['', '']) }, ARROW[t.direction] || ''))),
      undated.map(t => h('li', { class: 'bf-li' }, h('span', { class: 'bf-date bf-when' }, L(['undated', '未定日期'])), L(t.label), ' ',
        h('span', { class: `bf-dir bf-dir-${t.direction}` }, ARROW[t.direction] || '')))),
    changes.length ? h('div', { class: 'mb-sub' }, L(['Changed in the last 45 days', '最近45天的变化'])) : null,
    changes.length ? h('ul', { class: 'bf-list' }, changes.map(c => h('li', { class: 'bf-li' },
      h('span', { class: 'bf-date' }, L(dateText(c.at.slice(0, 10)))),
      c.cls === CHANGE_CLASS.NEWS ? h('a', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, c.title) : L(c.text)))) : null,
    h('div', { class: 'bf-more-links' }, h('a', { href: `/changes?market=${marketId}`, onclick: go(`/changes?market=${marketId}`) }, L(['Every change to this market ▸', '本市场的全部变更 ▸']))));
}

/* ---- the next action, the other investors, the other plays ---------------------- */

function nextAction(marketId, rows){
  const r = rows.find(x => !x.own) || rows[0];
  const actions = rows.map(x => playOf(marketId, x.play)).filter(p => p?.action);
  if (!actions.length) return card(['Next action', '下一步'], h('div', { class: 'bf-empty' }, L(['No action is written for this play yet.', '该方案尚无已写明的行动。'])));
  return card(['Next action', '下一步'], h('ul', { class: 'bf-list' }, actions.map(p => h('li', { class: 'bf-li' },
    h('span', { class: 'bf-date bf-when' }, p.action.due ? when(p.action.due) : L(['no date', '未定日期'])),
    h('b', {}, L(p.label)), h('div', { class: 'bf-why' }, L(p.action.text))))));
}

function otherViews(marketId, view, lens){
  const rowsFor = (a) => HOME_BRIEFING.lenses[a].rows.filter(r => r.market === marketId);
  const others = ARCHETYPE_IDS.filter(a => a !== lens);
  const list = h('ul', { class: 'bf-list' }, others.map(a => {
    const r = rowsFor(a).find(x => !x.own) || rowsFor(a)[0];
    if (!r) return null;
    const p = playOf(marketId, r.play);
    return h('li', { class: 'bf-li' },
      h('button', { class: 'btn lens-btn mb-lens', type: 'button', onclick: () => { const y = window.scrollY; setLens(a); requestRender(); window.scrollTo(0, y); } }, L(ARCHETYPES[a].label)),
      ' ', verdictGlyph(r.call, 14), ' ', h('b', {}, L(VERDICT_LABEL[r.call] || [r.call, r.call])), ' · ', L(ROUTE_LABEL[r.stage] || [r.stage, r.stage]),
      h('span', { class: 'bf-label' }, ' · ', L(p.label)));
  }));
  const shown = new Set(ARCHETYPE_IDS.flatMap(a => rowsFor(a).map(r => r.play)));
  const alternatives = Object.values(view.plays || {}).filter(p => !shown.has(p.id));
  return card(['The other investors', '其他投资者'], list,
    alternatives.length ? h('div', { class: 'mb-sub' }, L(['Plays no investor\'s call names', '未被任何结论引用的方案'])) : null,
    alternatives.length ? h('ul', { class: 'bf-list' }, alternatives.map(p => h('li', { class: 'bf-li' }, h('b', {}, L(p.label)), h('div', { class: 'bf-why' }, L(p.why))))) : null);
}

/* ---- go deeper ----------------------------------------------------------------------- */

const base = (marketId) => `/markets/${HOME_BRIEFING.markets[marketId]?.slug}`;

function goDeeper(marketId){
  const link = (path, label) => h('a', { class: 'btn', href: base(marketId) + path, onclick: go(base(marketId) + path) }, L(label));
  return h('div', { class: 'mb-deeper' },
    h('span', { class: 'lens-label' }, L(['Go deeper', '深入'])),
    link('/story', ['Market story', '市场演进']),
    link('/revenue', ['Revenue & design', '收入与设计']),
    link('/entry', ['Entry & delivery', '进入与交付']),
    link('/competition', ['Competition & demand', '竞争与需求']),
    link('/capital', ['Capital & exit', '资本与退出']),
    link('/evidence', ['Evidence', '证据']));
}

/**
 * The brief, as an array of nodes for the landing tab.
 *
 * @param marketId    the market (one Japanese area at a time)
 * @param view        the market's whole view record, from its own dashboard
 * @param assessment  assessMarket's result, for barriers
 * @param folded      the cards the tab used to open on, to fold beneath
 */
export function marketBrief(marketId, view, assessment, folded = []){
  const lens = lensOf();
  const rows = HOME_BRIEFING.lenses[lens]?.rows.filter(r => r.market === marketId) || [];
  if (!rows.length) return folded;
  const fold = h('details', { class: 'bf-fold' },
    h('summary', {}, L(['All four investors\' verdicts, the pillar scores and the fourteen grades', '四类投资者的结论、支柱得分与十四项评级'])),
    h('div', { class: 'bf-fold-body' }, folded));
  return [
    theCall(marketId, view, lens, rows),
    h('div', { class: 'grid g2 bf-pair' }, whatToBuild(marketId, view), economics(marketId, lens, rows)),
    h('div', { class: 'grid g2 bf-pair' }, risks(marketId, view, lens, rows, assessment), catalysts(marketId, view)),
    h('div', { class: 'grid g2 bf-pair' }, nextAction(marketId, rows), otherViews(marketId, view, lens)),
    goDeeper(marketId),
    fold,
  ];
}
