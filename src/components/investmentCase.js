/* ---------------------------------------------------------------------------
   The Investment Case and Entry sections.

   What the rest of a dashboard does not say: whether a given investor should
   enter, what it costs them before the first dollar of revenue, and what would
   change the answer.

   Lives in components/ for the same reason the build-pathway panel does: WA's
   dashboard is hand-written and the others are drawn by the shared block
   engine, and a renderer either can append is the only way these sections read
   the same in both.

   FOUR THINGS THE LAYOUT ARGUES:

     1. THE VERDICT LEADS AND THE SCORE FOLLOWS. The analyst sets the call; the
        score checks it. So the call is the large thing and the score is a line
        beneath it.
     2. WHEN A CEILING APPLIES, THE SCORE IS NOT THE HEADLINE. A market can
        score well and be closed to an investor by the size of the cheque. The
        barrier is shown first and the score beside it, labelled as such — the
        whole point of a knock-out is that a good score cannot outvote it.
     3. EVERY VERDICT SHOWS THE STRONGEST ARGUMENT AGAINST ITSELF. `despite` is
        rendered with the same weight as `because`.
     4. A DISAGREEMENT BETWEEN CALL AND SCORE IS PRINTED, with the analyst's
        answer to it. Nothing is hidden by rounding the two together.
     5. WHERE THE ANALYST HOLDS A DIFFERENT VIEW FROM THE SOURCES, BOTH SHOW.
        The held grade is the one scored, and it is printed beside what public
        sources support: "1 · practitioner view; public sources support 2". A
        held view past its review date is not scored and is shown as lapsed —
        flagged, never silently dropped. The reason for it is never here.

   THE EVALUATION DATE IS THE READER'S. A held view lapses on the page the day
   after its review date with no rebuild, which is what "experience goes stale"
   has to mean on a static site.

   The pillars are never blended into one market-level number. The only single
   score on the page belongs to one investor.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { chip } from './chip.js';
import { badge } from './badge.js';
import { gradeNote, verdictNote, heldNote, privateMetrics, hasNotes } from '../local/notes.js';
import {
  PILLARS, PILLAR_LABEL, PILLAR_QUESTION, DIMENSIONS, dimension, anchorText,
  VERDICT, VERDICT_LABEL, VERDICT_MEANING, ROUTE_LABEL, ARCHETYPE_IDS, BASIS, BASIS_LABEL,
  CONFIDENCE_LABEL, effectiveGrade,
} from '../governance/investability.js';
import { ARCHETYPES, NOT_ACCESSIBLE, DISAGREEMENT_LABEL, METRIC, limitCheck } from '../governance/archetypes.js';
import { STAGE_LABEL } from '../governance/buildPathway.js';
import { byExpected } from '../governance/triggers.js';
import { ITEM_KIND_LABEL, ITEM_STATUS_LABEL, limitInputs } from '../entry/ledger.js';
import { assessMarket } from '../entry/assessment.js';
import { entryReturn } from '../entry/entryReturn.js';
import { DURATION_BASIS_LABEL } from '../governance/buildPathway.js';
import { caseViewFor, caseLedgerFor } from '../markets/caseRegistry.js';
import { byId } from '../markets/registry.js';
import { FX } from '../comparison/assumptions.js';

/* Tone carries no judgement the label does not already state; it only makes
   a row of four scannable. "Not accessible" and "Avoid" are deliberately not
   the same colour, because they are not the same statement. */
const VERDICT_TONE = {
  [VERDICT.ENTER_NOW]: 'good',
  [VERDICT.BUILD_POSITION]: 'good',
  [VERDICT.OPPORTUNISTIC]: 'info',
  [VERDICT.WAIT]: 'warn',
  [VERDICT.AVOID]: 'critical',
  [VERDICT.NOT_ACCESSIBLE]: 'serious',
};

const STATUS_TONE = { verified: 'good', verify: 'warn', unsourced: 'serious' };

const usd = (value) => {
  if (value === null || value === undefined) return '—';
  if (value >= 1e6) return 'USD ' + (value / 1e6).toFixed(value >= 1e8 ? 0 : 1) + 'm';
  if (value >= 1e3) return 'USD ' + Math.round(value / 1e3) + 'k';
  return 'USD ' + Math.round(value);
};

const atLeast = (total) => total.lowerBound ? [`at least ${usd(total.usd)}`, `至少 ${usd(total.usd)}`] : [usd(total.usd), usd(total.usd)];

const local = (amount) => {
  const n = (v) => v.toLocaleString('en-US');
  if (amount.perMW !== undefined) return [`${amount.currency} ${n(amount.perMW)} per MW`, `每MW ${amount.currency} ${n(amount.perMW)}`];
  if (amount.perKW !== undefined) return [`${amount.currency} ${n(amount.perKW)} per kW`, `每kW ${amount.currency} ${n(amount.perKW)}`];
  return [`${amount.currency} ${n(amount.fixed)}`, `${amount.currency} ${n(amount.fixed)}`];
};

/* The reader's own date, as YYYY-MM-DD. The one clock read in this feature;
   everything below it takes the date as an argument. */
const today = () => new Date().toISOString().slice(0, 10);

function load(marketId){
  const view = caseViewFor(marketId);
  const market = byId(marketId);
  if (!view || !market) return null;
  const ledger = caseLedgerFor(marketId);
  const on = today();
  /* Empty in a build, so the published page always gets the public answer. */
  const mine = privateMetrics(marketId);
  return { view, market, ledger, on, mine, result: assessMarket(view, market, ledger, FX, { on, privateMetrics: mine }) };
}

/* The analyst's own reason, from the private overlay. Present on his screen in
   development and never in a build — see src/local/notes.js. Marked so it is
   obvious a confidential value is on screen. */
const privateLine = (text) => h('div', { class: 'cap', style: 'margin-top:4px;' }, badge('conf'), ' ', L(text));

const line = (label, ...kids) => h('div', { style: 'margin-top:6px;' }, h('b', {}, L(label) + ' '), ...kids);

/* ---- the verdict for one investor ------------------------------------------- */

function verdictCard(a, view, entry = null){
  const arch = ARCHETYPES[a.archetype];
  const v = a.verdict;
  const c = card(arch.label, []);
  c.append(h('div', { class: 'cap' }, L(arch.who)));

  if (!v){
    c.append(h('div', { class: 'note' }, L(['No verdict set for this investor yet.', '尚未为这类投资者设定结论。'])));
    return c;
  }

  c.append(h('div', { style: 'margin:8px 0;' },
    chip(VERDICT_TONE[v.call] || 'info', L(VERDICT_LABEL[v.call])),
    h('span', { class: 'cap', style: 'margin-left:8px;' },
      L(ROUTE_LABEL[v.route]) + (v.where ? ' · ' + L(v.where) : ''))));
  c.append(h('div', { class: 'cap' }, L(VERDICT_MEANING[v.call])));

  const because = h('div', { class: 'note' }, h('b', {}, L(['Because', '理由'])));
  for (const reason of v.because){
    because.append(h('div', { style: 'margin-top:5px;' },
      h('b', {}, L(dimension(reason.dimension)?.label || ['', '']) + ' — '), L(reason.text)));
  }
  c.append(because);
  c.append(h('div', { class: 'note' }, h('b', {}, L(['Despite', '反方理由']) + ' — '), L(v.despite)));
  if (entry && !entry.withheld){
    c.append(line(['The return it reads', '其所看的回报'],
      L(['a buyer could pay ', '买方可支付 ']) + perMW(entry.rtbValuePerMW)
      + L([' for a ready-to-build project', '收购具备开工条件的项目'])
      + (entry.attrition === null ? '' : L(['; break-even attrition ', '；盈亏平衡的失败率 ']) + (entry.atMost ? L(['at most ', '至多 ']) : '') + (entry.attrition * 100).toFixed(0) + '%')
      + L(['. An ordering between markets, not a price; it scores nothing. See Entry.', '。仅用于市场间排序，并非价格；不计入评分。详见“进入与交付”。'])));
  }
  const mine = verdictNote(view.marketId, a.archetype);
  if (mine) c.append(privateLine(mine));

  const triggers = view.triggers.filter(t => v.changesIf.includes(t.id));
  if (triggers.length){
    const list = h('div', { class: 'cap' }, h('b', {}, L(['Changes if', '以下情况将改变结论'])));
    for (const t of byExpected(triggers)){
      list.append(h('div', { style: 'margin-top:3px;' },
        L(t.label), ' ',
        h('span', {}, '(' + (t.expected || L(['undated', '日期未定'])) + ')')));
    }
    c.append(list);
  }
  if (v.reviewBy) c.append(h('div', { class: 'cap' }, L(['Review by ', '复核日期：']) + v.reviewBy));

  /* The score, or — when a ceiling applies — the barrier with the score
     beside it. See point 2 in the header. */
  if (a.ceiling === NOT_ACCESSIBLE){
    const barriers = [
      ...a.knockOuts.map(id => L(dimension(id).label)),
      ...arch.limits.filter(l => a.limitsBreached.includes(l.id)).map(l => L(l.label)),
    ];
    c.append(h('div', { class: 'warnbox' },
      h('b', {}, L(['Closed on this route by: ', '此路径下被以下因素挡在门外：'])), barriers.join(' · '),
      h('div', { class: 'cap', style: 'margin-top:4px;' },
        L(['The score beside it is ', '与之并列的评分为 ']) + a.fit.toFixed(0)
        + L([' of 100. It does not open the market.', '（满分100）。评分再高也打不开这个市场。']))));
  } else if (a.fit !== null){
    c.append(line(['Score', '评分'],
      a.fit.toFixed(0) + ' / 100 · ',
      L(['reads as ', '对应区间：']) + L(VERDICT_LABEL[a.band])));
  }

  if (a.check?.disagrees){
    c.append(h('div', { class: 'warnbox' },
      h('b', {}, L(DISAGREEMENT_LABEL[a.check.kind]) + '. '),
      v.scoreNote ? L(v.scoreNote) : L(['No reason recorded.', '未记录原因。'])));
  }

  const unchecked = arch.limits.filter(l => a.limitsUnchecked.includes(l.id));
  if (unchecked.length){
    c.append(h('div', { class: 'cap' },
      h('b', {}, L(['Not yet checked: ', '尚未核查：'])),
      unchecked.map(l => L(l.label)).join(' · ')));
  }
  return c;
}

/* ---- the investment case ------------------------------------------------------ */

/**
 * The Investment Case section for one market, as an array of cards, or an
 * empty array when the market has no view.
 */
export function investmentCasePanel(marketId){
  const data = load(marketId);
  if (!data) return [];
  const { view, result, on } = data;
  const out = [];
  const anyHeld = ARCHETYPE_IDS.some(id => result.byArchetype[id].heldApplied.length);

  out.push(h('div', { class: 'note' }, L([
    'A verdict for each of four kinds of investor. The analyst sets each call; the score beneath it only checks the call and is printed when the two disagree. A barrier is a threshold, never a weight, so a market can score well and still be closed to an investor.',
    '针对四类投资者分别给出结论。每个结论由分析师设定；下方评分仅用于校验，二者不一致时会明确标出。门槛是硬性阈值而非权重，因此市场评分再高，也可能对某类投资者关闭。',
  ])));

  const grid = h('div', { class: 'grid g2' });
  /* The developer's own return is what a buyer would pay for a ready-to-build
     megawatt. Shown on its card; it scores nothing, because making it score
     would change the investor tables, which are methodology. */
  const entry = entryReturn(data.market, data.ledger, FX);
  for (const id of ARCHETYPE_IDS) grid.append(verdictCard(result.byArchetype[id], view, id === 'developer' ? entry : null));
  out.push(grid);

  /* Pillar by pillar, per investor. Deliberately no market-level total. */
  const pillars = card(['How each investor reads the four pillars', '各类投资者对四大支柱的读数'], []);
  pillars.append(h('div', { class: 'cap' }, L([
    'Out of 100, from the grades below read through each investor\'s own preferences. The same grade can be worth more to one than to another. There is no single score for the market.',
    '满分100，由下方评级经各类投资者自身偏好换算而来。同一评级对不同投资者的价值可以不同。本页不提供市场层面的单一总分。',
  ])));
  pillars.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Investor', '投资者'])),
      ...PILLARS.map(p => h('th', { class: 'num', title: L(PILLAR_QUESTION[p]) }, L(PILLAR_LABEL[p]))),
      h('th', { class: 'num' }, L(['Fit', '匹配度'])),
      /* Only when a held view is live: how far the analyst's own judgement
         moves the score from what public sources alone would give. */
      anyHeld ? h('th', { class: 'num' }, L(['On public sources alone', '仅按公开来源'])) : null)),
    h('tbody', {}, ARCHETYPE_IDS.map(id => {
      const a = result.byArchetype[id];
      return h('tr', {},
        h('td', {}, h('b', {}, L(ARCHETYPES[id].label))),
        ...PILLARS.map(p => h('td', { class: 'num' }, a.pillars[p] === null ? '—' : a.pillars[p].toFixed(0))),
        h('td', { class: 'num' }, a.fit === null ? '—' : h('b', {}, a.fit.toFixed(0))),
        anyHeld ? h('td', { class: 'num' }, a.fitSourced === null ? '—' : a.fitSourced.toFixed(0)) : null);
    })))));
  out.push(pillars);

  /* The grades themselves, each beside the anchor it was measured against. */
  const grades = card(['The grades, and what each one means', '各项评级及其含义'], []);
  grades.append(h('div', { class: 'cap' }, L([
    'Each dimension is graded 1 to 5 against a written anchor that means the same in every market. 5 is the condition most open to a new entrant; whether that is good depends on the investor. A grade marked practitioner judgement rests on the analyst\'s experience, not on a published source.',
    '每个维度按1至5评级，所对照的书面锚点在所有市场含义相同。5代表对新进入者最开放的状态；这是否有利取决于投资者类型。标注为"从业者判断"的评级基于分析师经验，而非公开来源。',
  ])));
  /* Who set each grade and verdict, and when it last moved, is not marked
     here. It is in the changelog, filtered to this market. */
  grades.append(h('div', { class: 'cap' }, h('a', { href: `/changes?market=${marketId}` }, L([
    'Who changed these, and on what evidence →', '这些评级与结论由谁改动、依据何在 →',
  ]))));
  grades.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Pillar', '支柱'])),
      h('th', {}, L(['Dimension', '维度'])),
      h('th', { class: 'num' }, L(['Grade', '评级'])),
      h('th', {}, L(['What that grade means', '该评级的含义'])),
      h('th', {}, L(['Basis', '依据'])))),
    h('tbody', {}, DIMENSIONS.map(d => {
      const g = view.grades[d.id];
      const e = effectiveGrade(g, on);
      const mine = g?.held ? heldNote(view.marketId, d.id) : null;
      return h('tr', {},
        h('td', {}, L(PILLAR_LABEL[d.pillar])),
        h('td', {}, h('b', {}, L(d.label))),
        h('td', { class: 'num' }, g ? e.grade + ' / 5' : '—',
          e.applied ? h('div', {}, chip('info', L(['Practitioner view', '从业者观点']))) : null,
          e.lapsed ? h('div', {}, chip('warn', L(['Practitioner view lapsed', '从业者观点已过期']))) : null),
        h('td', {},
          g ? L(anchorText(d.id, e.grade)) : L(['Not yet graded', '尚未评级']),
          /* Both grades, always, when a held view exists. */
          e.applied ? h('div', { class: 'note', style: 'margin-top:4px;' },
            h('b', {}, e.held + ' · ' + L(['practitioner view', '从业者观点']) + '; '
              + L(['public sources support ', '公开来源支持的评级为 ']) + e.sourced + '. '),
            L(CONFIDENCE_LABEL[e.confidence]) + L(['; to be reviewed by ', '；复核日期 ']) + e.reviewBy + '.',
            g.held.publicNote ? h('div', { style: 'margin-top:3px;' }, L(g.held.publicNote)) : null) : null,
          e.lapsed ? h('div', { class: 'warnbox', style: 'margin-top:4px;' }, L([
            `A practitioner view of ${e.held} was due for review by ${e.reviewBy} and has lapsed. The grade shown is what public sources support.`,
            `从业者观点（评级${e.held}）应于${e.reviewBy}前复核，现已过期。此处所示为公开来源支持的评级。`])) : null,
          g?.reason ? h('div', { class: 'cap', style: 'margin-top:3px;' },
            e.applied ? h('b', {}, L(['Public sources: ', '公开来源：'])) : null, L(g.reason)) : null,
          gradeNote(view.marketId, d.id) ? privateLine(gradeNote(view.marketId, d.id)) : null,
          mine ? privateLine(mine) : null,
          /* Only where the overlay exists, so only on the analyst's screen. */
          g?.held && !mine && hasNotes() ? privateLine(['This held view has no private reason in the overlay. Add one.', '该从业者观点在私有备注中没有对应理由，请补充。']) : null),
        h('td', {}, g ? chip(g.basis === BASIS.PRACTITIONER ? 'info' : 'good', L(BASIS_LABEL[g.basis])) : null));
    })))));
  out.push(grades);

  return out;
}

/* ---- entry ---------------------------------------------------------------------- */

/**
 * The Entry section for one market: what is spent or pledged before the
 * investment decision, and which investors' limits that breaches.
 */
/* ---- the return once getting in is counted --------------------------------- */

const pct = (v) => (v === null || v === undefined ? '—' : (v * 100).toFixed(1) + '%');
const perMW = (v) => (v < 0 ? '−' : '') + usd(Math.abs(v)) + L([' per MW', ' /MW']);

function entryReturnCard({ market, ledger }){
  const c = card(['The return once getting in is counted', '计入进入成本之后的回报'], [badge('calc'), badge('illus')]);
  c.append(h('div', { class: 'cap' }, L([
    'The comparison engine prices a project that arrives ready to build and has cost nothing to get there. These lines sit beside that figure and never replace it.',
    '比较引擎测算的是一个已具备开工条件、此前没有任何花费的项目。以下各行与该数字并列展示，并不取代它。',
  ])));
  const r = entryReturn(market, ledger, FX);
  if (r.withheld){
    c.append(h('div', { class: 'note' }, L(['The engine does not price this market, so there is no return to adjust.', '比较引擎未对该市场定价，因此没有可供调整的回报。'])));
    return c;
  }
  const most = r.atMost ? L(['at most ', '至多 ']) : '';
  const row = (label, value, detail) => h('tr', {},
    h('td', {}, h('b', {}, L(label))), h('td', { class: 'num' }, value), h('td', {}, L(detail)));

  const adjusted = r.entryAdjusted
    ? most + pct(r.entryAdjusted.low) + L([' to ', ' 至 ']) + pct(r.entryAdjusted.high)
    : L(['Not yet checked', '尚未核查']);
  const adjustedDetail = r.entryAdjusted
    ? [`Development of ${r.timing.monthsToRtb[0]} to ${r.timing.monthsToRtb[1]} months and a build of ${r.timing.buildMonths[0]} to ${r.timing.buildMonths[1]}, with the ledger's spend spread over development and its security held as cash. Basis of the range: ${DURATION_BASIS_LABEL[r.entryAdjusted.basis][0].toLowerCase()}. ${r.timing.note[0]}`,
       `开发期${r.timing.monthsToRtb[0]}至${r.timing.monthsToRtb[1]}个月、建设期${r.timing.buildMonths[0]}至${r.timing.buildMonths[1]}个月；台账中的支出在开发期内平均分摊，保证金按现金占用计。区间依据：${DURATION_BASIS_LABEL[r.entryAdjusted.basis][1]}。${r.timing.note[1]}`]
    : ['No development or build time is stated for this market, and the figure is never built on the engine\'s twelve-month seed.', '该市场尚未给出开发期与建设期，而该数字绝不以引擎默认的十二个月建设期推算。'];

  c.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Line', '指标'])), h('th', { class: 'num' }, L(['Figure', '数值'])), h('th', {}, L(['What it is', '含义'])))),
    h('tbody', {},
      row(['Asset IRR', '资产IRR'], pct(r.assetIrr),
        ['The engine\'s hold IRR: ready to build, twelve months to build, nothing spent beforehand.', '比较引擎的持有期IRR：已具备开工条件、建设期十二个月、此前没有任何花费。']),
      row(['Entry-adjusted IRR', '计入进入成本的IRR'], adjusted, adjustedDetail),
      row(['Break-even attrition', '盈亏平衡的失败率'], r.attrition === null ? L(['Not yet checked', '尚未核查']) : most + (r.attrition * 100).toFixed(0) + '%',
        ['The share of development attempts that can fail before a programme of them stops paying, when each success is sold at the value below. True attrition is published nowhere; this is the line to judge it against.', '在每个成功项目按下述价值出售的前提下，一组开发项目中可以失败而整体仍不亏损的比例。真实失败率没有任何公开数据；这是用来衡量它的参照线。']),
      row(['Implied ready-to-build value', '隐含的开工条件项目价值'], perMW(r.rtbValuePerMW),
        ['What a buyer pricing on the engine\'s own exit yields could pay for a consented, connected megawatt: the asset\'s value less its build cost. An ordering between markets, not a price, until the engine carries a terminal value.', '按比较引擎自身的退出收益率定价的买方，愿意为一个已获许可、已并网的MW支付的金额：资产价值减去建设成本。在引擎纳入终值之前，它只用于市场间排序，并非价格。'])))));

  const notes = [];
  if (r.atMost) notes.push(['"At most" because the ledger has an item before the decision with no amount: the true cost can only be higher.', '标注“至多”，是因为台账中有决策前的项目没有金额：真实成本只会更高。']);
  notes.push(['Security is treated as cash, which is an upper bound on what it costs: a bank guarantee costs a fee, not its face value. Where the ledger says how an item is lost, a failed attempt is taken to lose all of it.', '保证金按现金占用处理，这是其成本的上限：银行保函的成本是手续费，而非其面额。台账写明了损失情形的项目，按开发失败时全额损失计。']);
  if (r.rtbValuePerMW < 0) notes.push(['The value is negative: at the engine\'s yields a buyer would not pay for this project at all, so no development programme pays.', '该价值为负：按引擎的收益率，买方根本不会为该项目付费，因此任何开发项目组合都无法盈利。']);
  for (const n of notes) c.append(h('div', { class: 'cap', style: 'margin-top:6px;' }, L(n)));
  return c;
}

export function entryPanel(marketId){
  const data = load(marketId);
  if (!data || !data.ledger) return [];
  const { ledger, result, mine } = data;
  const totals = result.totals;
  const out = [];

  const c = card(['Capital at risk before the investment decision', '最终投资决策前的风险资本'], []);
  c.append(h('div', { class: 'note' }, L(ledger.summary)));
  /* The limit before the table, as on the pathway: a reader who takes a lower
     bound for a total has been misled by the time they reach a footnote. */
  c.append(h('div', { class: 'warnbox' }, L(ledger.limit)));

  const kpi = (label, value, detail) => h('div', { class: 'kpi' },
    h('div', { class: 'k' }, L(label)), h('div', { class: 'v' }, value),
    detail ? h('div', { class: 'd' }, L(detail)) : null);
  c.append(h('div', { class: 'kpis' },
    kpi(['Reference project', '参考项目'], usd(result.project?.costUSD),
      [`${ledger.basis.powerMW} MW · ${ledger.basis.durationHours}h, the project the comparison engine prices`, `${ledger.basis.powerMW} MW · ${ledger.basis.durationHours}小时，即比较引擎所定价的项目`]),
    kpi(['Spent or pledged before the decision', '决策前已支出或已提交'],
      totals.empty ? '—' : L(atLeast(totals.preFid)),
      totals.empty ? ['Nothing sourced', '尚无来源'] : ['In money: what an investor\'s own limit is compared with', '按金额计：用于对照投资者自身上限']),
    kpi(['As a share of project cost', '占项目投资的比例'],
      totals.shareOfCost === null ? '—' : (totals.preFid.lowerBound ? '≥ ' : '') + (totals.shareOfCost * 100).toFixed(1) + '%',
      ['As a share: what the capital-at-risk grade is measured on', '按比例计：风险资本评级所依据的口径'])));

  if (ledger.items.length){
    c.append(h('div', { class: 'tbl-wrap' }, h('table', {},
      h('thead', {}, h('tr', {},
        h('th', {}, L(['Item', '项目'])),
        h('th', {}, L(['Amount', '金额'])),
        h('th', {}, L(['When', '时点'])),
        h('th', {}, L(['How it is lost', '如何损失'])),
        h('th', {}, L(['Status', '状态'])))),
      h('tbody', {}, ledger.items.map(item => h('tr', {},
        h('td', {}, h('b', {}, L(item.label)), h('div', { class: 'cap' }, L(ITEM_KIND_LABEL[item.kind]) + ' · ' + L(item.form))),
        h('td', {}, item.amount ? L(local(item.amount)) : L(item.amountNote)),
        h('td', {}, L(STAGE_LABEL[item.postedAt]),
          item.beforeConsent === true ? h('div', { class: 'cap' }, L(['before consent', '早于取得许可'])) : null),
        h('td', {}, item.lostIf ? L(item.lostIf) : (item.refundable ? '—' : L(['Spent; not refundable', '已支出，不予退还']))),
        h('td', {}, chip(STATUS_TONE[item.status], L(ITEM_STATUS_LABEL[item.status])))))))));
  }
  out.push(c);

  out.push(entryReturnCard(data));

  /* Who that shuts out. Compared at origination, where these limits bind. */
  const limits = card(['Which investors that shuts out, at origination', '在项目发起阶段，这把哪些投资者挡在门外'], []);
  limits.append(h('div', { class: 'cap' }, L([
    'Each investor\'s own limit, compared with the figures above for a project it originates. A limit that could not be checked is shown as such; it has not been passed.',
    '将各类投资者自身的上限，与其自行发起项目时的上述数字相比较。无法核查的上限如实标注，并不代表已通过。',
  ])));
  /* The analyst's own figures, where he has them, in place of the public ones.
     `mine` is empty in a build, so this is the public check there. */
  const inputs = limitInputs(totals);
  const metrics = { ...inputs.metrics, ...mine };
  const incomplete = inputs.incomplete.filter(key => !(key in mine));
  limits.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Investor', '投资者'])),
      h('th', {}, L(['Limit', '上限'])),
      h('th', { class: 'num' }, L(['Its limit', '其上限'])),
      h('th', {}, L(['Result', '结果'])))),
    h('tbody', {}, ARCHETYPE_IDS.flatMap(id => {
      const arch = ARCHETYPES[id];
      /* Read at origination for every investor, including those whose usual
         route is to buy later: this table answers "could it start one here". */
      const check = limitCheck(arch, metrics, 'greenfield', incomplete);
      return arch.limits.filter(l => l.routes.includes('greenfield')).map(l => h('tr', {},
        h('td', {}, h('b', {}, L(arch.label))),
        h('td', {}, L(l.label)),
        h('td', { class: 'num' }, l.metric === METRIC.MONTHS_TO_RTB ? l.max + L([' months', '个月']) : usd(l.max)),
        h('td', {}, check.breached.includes(l.id) ? chip('serious', L(['Breached', '已超出']))
          : check.unchecked.includes(l.id) ? chip('warn', L(['Not yet checked', '尚未核查']))
          : chip('good', L(['Within', '在上限内'])),
          /* Checked against a deal-derived figure: say so, on the one screen
             that can show it. */
          l.metric in mine ? h('span', { style: 'margin-left:6px;' }, badge('conf')) : null)));
    })))));
  out.push(limits);
  return out;
}
