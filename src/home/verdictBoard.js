/* ---------------------------------------------------------------------------
   The verdict board — every market, for the chosen investor.

   Draws what boardModel.js worked out. Four things the layout argues, the same
   four the Investment Case tab argues, because a reader moves between the two:

     1. THE VERDICT LEADS AND THE SCORE FOLLOWS. The word and its shape are the
        large thing in a row; the fit is a number beside it.
     2. WHEN A CEILING APPLIES, THE BARRIER LEADS. The fit cell says "barrier"
        and not a number, and the line beneath says what shuts the investor
        out. The score is still printed, labelled as something that does not
        open the market.
     3. A DISAGREEMENT BETWEEN CALL AND SCORE IS PRINTED, with the analyst's
        answer to it where one is recorded.
     4. A MARKET THAT HAS NOT BEEN GRADED SAYS SO. It shows its return and no
        verdict. An empty cell is better than a guessed one.

   Four pillar strips a market, always in the same order, so an eye can run
   down a column (plan section 6.6). They are never blended into a market-level
   number: the only single score in a row belongs to one investor.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { badge } from '../components/badge.js';
import { marketFlagCode } from '../components/navigation.js';
import { regionFor } from '../markets/regions.js';
import { fmtIRR } from '../utils/formatting.js';
import {
  PILLARS, PILLAR_LABEL, PILLAR_QUESTION, VERDICT_LABEL, VERDICT_MEANING, ROUTE_LABEL, ARCHETYPE_IDS,
} from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { TRIGGER_DIRECTION_LABEL } from '../governance/triggers.js';
import { verdictGlyph } from './verdictGlyph.js';

const link = (href, label, cls = 'vb-link') => h('a', {
  class: cls,
  href,
  onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); },
}, label);

const casePath = (market) => '/markets/' + market.manifest.slug + '/case';

const irr = (v) => (v === null ? 'N/M' : fmtIRR(v));

export const DIRECTION_MARK = { up: '↗', down: '↘', either: '↔' };

/** "2027-04" → "Apr 2027" / "2027年4月"; a full date is kept as written. */
export function whenLabel(expected){
  if (expected === null) return L(['undated', '日期未定']);
  if (expected.length !== 7) return expected;
  const [year, month] = expected.split('-').map(Number);
  const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1] + ' ' + year;
  return L([en, `${year}年${month}月`]);
}

function marketCell(market, href){
  const mf = market.manifest;
  const region = regionFor(mf.id);
  return h('div', { class: 'vb-mkt' },
    h('span', { class: `flag fi fi-${marketFlagCode(market)}`, 'aria-hidden': 'true' }),
    h('div', {},
      link(href, L(mf.name), 'vb-name'),
      region ? h('div', { class: 'vb-sub' }, L(region.label)) : null));
}

function pillarStrips(cell){
  return h('div', { class: 'vb-pillars' }, PILLARS.map(p => {
    const score = cell.pillars[p];
    const withheld = p === 'return' && cell.returnWithheld;
    return h('div', { class: 'vb-pillar', title: L(PILLAR_QUESTION[p]) },
      h('span', { class: 'vb-pl' }, L(PILLAR_LABEL[p])),
      withheld
        ? h('span', { class: 'vb-withheld' }, L(['withheld', '暂不披露']))
        : h('span', { class: 'vb-bar', role: 'img',
            'aria-label': L(PILLAR_LABEL[p]) + ' ' + (score === null ? '—' : score.toFixed(0) + ' / 100') },
            h('i', { style: `width:${score === null ? 0 : Math.max(2, Math.min(100, score))}%` })),
      withheld ? null : h('span', { class: 'vb-pn' }, score === null ? '—' : score.toFixed(0)));
  }));
}

/* The line under a row: the barrier when one applies, otherwise the event that
   would change the call. */
function reasonLine(cell){
  if (cell.headline === 'ceiling'){
    return h('div', { class: 'vb-line vb-barrier' },
      h('b', {}, L(['Shut out by: ', '被挡在门外的原因：'])),
      cell.barriers.flatMap((b, i) => [i ? L(['; ', '；']) : null, L(b.text), b.confidential ? ' ' : null, b.confidential ? badge('conf') : null]),
      cell.fit === null ? null : h('span', { class: 'vb-aside' },
        L(['. The score of ', '。评分 ']) + cell.fit.toFixed(0)
        + L([' of 100 does not open the market.', '（满分100）再高也打不开这个市场。'])));
  }
  const t = cell.changesIf;
  if (!t) return null;
  return h('div', { class: 'vb-line' },
    h('b', {}, L(['Changes if: ', '以下情况将改变结论：'])),
    L(t.label), L([' (', '（']), whenLabel(t.expected),
    t.overdue ? L([', now overdue — to be checked', '，已逾期，有待核实']) : null, L([') ', '）']),
    h('span', { class: 'vb-dir', title: L(TRIGGER_DIRECTION_LABEL[t.direction]) }, DIRECTION_MARK[t.direction]),
    t.others > 0 ? h('span', { class: 'vb-aside' },
      L([` and ${t.others} more`, ` 另有${t.others}项`])) : null);
}

function flagLine(cell){
  if (!cell.flag) return null;
  return h('div', { class: 'vb-line vb-flag' },
    h('b', {}, '⚑ ' + L(cell.flag.label) + '. '),
    cell.flag.note ? L(cell.flag.note) : L(['No reason recorded.', '未记录原因。']));
}

function lensRow(row){
  const cell = row.cell;
  const href = casePath(row.market);
  const closed = cell.headline === 'ceiling';

  const verdict = cell.call
    ? h('div', { class: 'vb-verdict', title: L(VERDICT_MEANING[cell.call]) },
        h('div', { class: 'vb-call' }, verdictGlyph(cell.call), h('b', {}, L(VERDICT_LABEL[cell.call]))),
        h('div', { class: 'vb-sub' }, L(ROUTE_LABEL[cell.route]) + (cell.where ? ' · ' + L(cell.where) : '')))
    : h('div', { class: 'vb-verdict' },
        h('div', { class: 'vb-call' }, verdictGlyph(null), L(['No verdict set', '尚未设定结论'])));

  /* The barrier leads: where a ceiling applies this cell carries no number. */
  const fit = closed
    ? h('div', { class: 'vb-fit' }, h('span', { class: 'vb-fit-n' }, '—'),
        h('span', { class: 'vb-sub' }, L(['barrier', '门槛'])))
    : h('div', { class: 'vb-fit' }, h('span', { class: 'vb-fit-n' }, cell.fit === null ? '—' : cell.fit.toFixed(0)),
        h('span', { class: 'vb-sub' }, L(['fit / 100', '匹配度'])));

  return h('div', { class: 'vb-row' + (closed ? ' vb-closed' : ''), 'data-market': row.market.manifest.id },
    h('div', { class: 'vb-head' }, marketCell(row.market, href), verdict, fit),
    pillarStrips(cell),
    reasonLine(cell),
    flagLine(cell),
    cell.unchecked.length ? h('div', { class: 'vb-line vb-aside' },
      h('b', {}, L(['Not yet checked: ', '尚未核查：'])), cell.unchecked.map(l => L(l)).join(' · ')) : null,
    h('div', { class: 'vb-line' }, link(href, L(['Investment case →', '查看投资判断 →']))));
}

/* With no lens chosen: the same market read by all four investors, side by side. */
function allFourRow(row){
  const href = casePath(row.market);
  const cells = ARCHETYPE_IDS.map(id => {
    const cell = row.cells[id];
    const closed = cell.headline === 'ceiling';
    return h('div', { class: 'vb-four-cell' + (closed ? ' vb-closed' : ''),
      title: cell.call ? L(VERDICT_MEANING[cell.call]) : '' },
      h('div', { class: 'vb-sub' }, L(ARCHETYPES[id].label)),
      h('div', { class: 'vb-call' }, verdictGlyph(cell.call),
        h('b', {}, cell.call ? L(VERDICT_LABEL[cell.call]) : L(['No verdict set', '尚未设定结论']))),
      h('div', { class: 'vb-sub' },
        closed ? L(['barrier applies', '触及门槛'])
          : cell.fit === null ? '—' : L(['fit ', '匹配度 ']) + cell.fit.toFixed(0),
        cell.flag ? h('span', { class: 'vb-flagmark', title: L(cell.flag.label) }, ' ⚑ ' + L(['disagrees with score', '与评分不一致'])) : null));
  });
  return h('div', { class: 'vb-row', 'data-market': row.market.manifest.id },
    h('div', { class: 'vb-head vb-head-four' }, marketCell(row.market, href),
      h('div', { class: 'vb-four' }, cells)),
    h('div', { class: 'vb-line' }, link(href, L(['Investment case →', '查看投资判断 →']))));
}

function ungradedRow(row){
  const mf = row.market.manifest;
  const href = '/markets/' + mf.slug;
  const ret = row.ret;
  return h('div', { class: 'vb-row vb-ungraded', 'data-market': mf.id },
    h('div', { class: 'vb-head' }, marketCell(row.market, href),
      h('div', { class: 'vb-verdict' },
        h('div', { class: 'vb-call' }, verdictGlyph(null), L(['Not yet graded', '尚未评级']))),
      h('div', { class: 'vb-fit' })),
    h('div', { class: 'vb-return' },
      ret.withheld
        ? [L(['Return withheld', '回报暂不披露'])]
        : [h('span', {}, L(['Hold IRR ', '持有期IRR ']), h('b', {}, irr(ret.hold.base))),
           ' · ',
           h('span', {}, L([`Exit IRR, year ${ret.exitYear} `, `第${ret.exitYear}年退出IRR `]), h('b', {}, irr(ret.exit.base))),
           h('span', { class: 'vb-aside' }, L([' base case', ' 基准情景']))]),
    h('div', { class: 'vb-line' }, link(href, L(['Open dashboard →', '进入看板 →']))));
}

/**
 * @param parent  where the board goes
 * @param board   the result of buildBoard
 */
export function renderVerdictBoard(parent, board){
  const wrap = h('div', { class: 'vb' });
  for (const row of board.rows.filter(r => r.graded)){
    wrap.append(board.lens ? lensRow(row) : allFourRow(row));
  }
  if (board.ungradedCount){
    wrap.append(h('div', { class: 'vb-divider' }, L([
      `Not yet graded — ${board.ungradedCount} markets. Each shows the return the comparison engine prices and no verdict: an empty cell is better than a guessed one.`,
      `尚未评级 — ${board.ungradedCount}个市场。此处只列出比较引擎测算的回报，不给结论：留空好过猜测。`,
    ])));
    for (const row of board.rows.filter(r => !r.graded)) wrap.append(ungradedRow(row));
  }
  parent.append(wrap);
}
