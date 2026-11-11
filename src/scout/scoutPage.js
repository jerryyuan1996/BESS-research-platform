/* ---------------------------------------------------------------------------
   /scout — the scouting tier: a card for each market with no dashboard.

   Nine markets in three regions. A card is a first screen: a few sourced
   facts, a grade on each dimension a public page can speak to, a verdict for
   each investor, and nothing about what a battery there earns.

   WHAT THE LAYOUT ARGUES, the same things the home board argues:

     1. THE VERDICT LEADS, by shape and by word. A card has no score to follow
        it: with no Return pillar there is no fit, and the three pillars it
        does have are never blended.
     2. THE BARRIER LEADS THE VERDICT, where a grade shuts an investor out.
     3. NO RETURN IS MODELLED, and the card says so in the place a return
        would be. A third party's index, when a listed page carries one, is
        quoted as a signal in its publisher's words.
     4. WHAT IS NOT KNOWN IS SAID. An ungraded dimension is listed as ungraded;
        a market with no card reads "no card written yet".

   No mark sits on any card or verdict to say who wrote it (plan §7.5). The
   page says once, at the top, what the tier is; the changelog is the record.

   FETCHED ON DEMAND, WITH THE CARDS. The home page carries each card's four
   calls and no more.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { spacedCard } from '../components/card.js';
import { markets } from '../markets/registry.js';
import {
  ARCHETYPE_IDS, PILLAR_LABEL, PILLAR_QUESTION, VERDICT_LABEL, VERDICT_MEANING, ROUTE_LABEL, TREND_LABEL,
} from '../governance/investability.js';
import { ARCHETYPES } from '../governance/archetypes.js';
import { SCOUT_PILLARS, GRADUATION_RULE, MAX_SCOUT_FACTS, RETURN_SIGNAL_LABEL } from '../governance/scout.js';
import { verdictGlyph } from '../home/verdictGlyph.js';
import { SCOUT_DATA } from './scoutCards.js';
import { buildScoutPage } from './scoutModel.js';

const today = () => new Date().toISOString().slice(0, 10);

const external = (url, label) => (url
  ? h('a', { class: 'vb-link', href: url, target: '_blank', rel: 'noopener noreferrer' }, label)
  : h('span', {}, label));

const internal = (href, label) => h('a', {
  class: 'vb-link', href, onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); },
}, label);

/* A quotation, with where it was found. */
function quotation(e){
  return h('div', { class: 'sc-quote' }, '“' + e.quote + '” — ', external(e.url, e.publisher));
}

function pillarStrips(cell){
  return h('div', { class: 'sc-pillars' }, SCOUT_PILLARS.map(p => {
    const score = cell.pillars[p];
    return h('div', { class: 'vb-pillar', title: L(PILLAR_QUESTION[p]) },
      h('span', { class: 'vb-pl' }, L(PILLAR_LABEL[p])),
      score === null
        ? h('span', { class: 'vb-withheld' }, L(['not fully graded', '尚未评全']))
        : h('span', { class: 'vb-bar', role: 'img', 'aria-label': L(PILLAR_LABEL[p]) + ' ' + score.toFixed(0) + ' / 100' },
            h('i', { style: `width:${Math.max(2, Math.min(100, score))}%` })),
      score === null ? null : h('span', { class: 'vb-pn' }, score.toFixed(0)));
  }));
}

function verdictCell(cell){
  const closed = cell.barriers.length > 0;
  return h('div', { class: 'vb-four-cell sc-cell' + (closed ? ' vb-closed' : ''),
    title: cell.call ? L(VERDICT_MEANING[cell.call]) : '' },
    h('div', { class: 'vb-sub' }, L(ARCHETYPES[cell.archetype].label)),
    closed ? h('div', { class: 'vb-line vb-barrier' },
      h('b', {}, L(['Shut out by: ', '被挡在门外的原因：'])),
      cell.barriers.map(b => L([`${b.label[0]} is graded ${b.grade} of 5`, `“${b.label[1]}”评级为${b.grade}（满分5）`])).join(L(['; ', '；']))) : null,
    h('div', { class: 'vb-call' }, verdictGlyph(cell.call),
      h('b', {}, cell.call ? L(VERDICT_LABEL[cell.call]) : L(['No verdict yet', '尚无结论']))),
    cell.call ? h('div', { class: 'vb-sub' }, L(ROUTE_LABEL[cell.route])) : null,
    cell.call ? pillarStrips(cell) : null,
    cell.because.length ? h('ul', { class: 'sc-list' }, cell.because.map(b => h('li', {}, L(b.text)))) : null,
    cell.despite ? h('div', { class: 'vb-line' }, h('b', {}, L(['Against: ', '反方理由：'])), L(cell.despite)) : null,
    cell.waitsFor.length ? h('div', { class: 'vb-line' }, h('b', {}, L(['Waiting for: ', '等待：'])),
      cell.waitsFor.map(t => L(t.label) + (t.expected ? L([' (', '（']) + t.expected + L([')', '）']) : '')).join(L(['; ', '；'])),
      cell.reviewBy ? L([`. Review by ${cell.reviewBy}`, `。复核日期 ${cell.reviewBy}`]) : '') : null);
}

function gradeRow(g){
  return h('tr', {},
    h('th', { scope: 'row' }, L(g.label), h('div', { class: 'vb-sub' }, L(PILLAR_LABEL[g.pillar]))),
    h('td', { class: 'sc-grade' }, h('b', {}, String(g.grade)), h('span', { class: 'vb-sub' }, ' / 5'),
      g.trend !== 'stable' ? h('div', { class: 'vb-sub' }, L(TREND_LABEL[g.trend])) : null),
    h('td', {},
      g.anchor ? h('div', { class: 'vb-sub' }, L(['Anchor: ', '锚定标准：']), L(g.anchor)) : null,
      g.reason ? h('div', {}, L(g.reason)) : null,
      g.trendCause ? h('div', { class: 'vb-sub' }, L(g.trendCause)) : null,
      h('div', { class: 'vb-sub' }, g.sources.flatMap((s, i) => [i ? ' · ' : null, external(s.url, s.publisher)]))));
}

function card(row){
  const m = row.market;
  const head = h('div', { class: 'sc-head' },
    h('span', { class: `flag fi fi-${m.flag}`, 'aria-hidden': 'true' }),
    h('h3', { class: 'sc-name' }, L(m.name)));

  if (!row.written){
    return h('section', { class: 'sc-card sc-empty', id: m.id, 'data-scout': m.id }, head,
      h('div', { class: 'vb-call' }, verdictGlyph(null), L(['No card written yet', '卡片尚未写成'])),
      h('div', { class: 'vb-sub' }, L([
        'Nothing is shown for this market until a card has been written from its listed sources.',
        '在依据所列来源写成卡片之前，该市场不显示任何内容。',
      ])));
  }

  const grad = row.graduation;
  return h('section', { class: 'sc-card', id: m.id, 'data-scout': m.id },
    head,
    row.lastPass ? h('div', { class: 'vb-sub' }, L(['Last reviewed ', '最近复核 ']) + row.lastPass.slice(0, 10)) : null,

    h('div', { class: 'sc-four' }, ARCHETYPE_IDS.map(a => verdictCell(row.cells[a]))),

    h('div', { class: 'sc-return' },
      h('b', {}, L(PILLAR_LABEL.return) + L([': ', '：'])),
      row.returnSignal ? h('span', {}, L(RETURN_SIGNAL_LABEL[row.returnSignal.kind]) + L([' — ', ' — '])) : null,
      L(row.returnLine),
      row.returnSignal ? row.returnSignal.evidence.map(quotation) : null,
      row.returnSignal ? h('div', { class: 'vb-sub' }, L([
        'A signal quoted from its publisher. It is not an underwriting number and nothing on this platform is computed from it.',
        '此为引自发布方的参考信号，并非承销用数字，本平台不据此做任何计算。',
      ])) : null),

    row.facts.length ? h('div', { class: 'sc-block' },
      h('h4', {}, L(['Facts', '事实'])),
      h('ol', { class: 'sc-facts' }, row.facts.map(f => h('li', {}, L(f.text), f.evidence.map(quotation))))) : null,

    row.grades.length ? h('details', { class: 'sc-block sc-grades' },
      h('summary', {}, L([`Grades — ${row.grades.length} of ${row.grades.length + row.ungraded.length} dimensions`,
        `评级 — ${row.grades.length + row.ungraded.length}个维度中已评${row.grades.length}个`])),
      h('div', { class: 'sc-scroll' }, h('table', { class: 'sc-table' }, h('tbody', {}, row.grades.map(gradeRow))))) : null,

    row.ungraded.length ? h('div', { class: 'vb-line' },
      h('b', {}, L(['Not graded — no listed page could be quoted: ', '尚未评级（所列页面无可引用内容）：'])),
      row.ungraded.map(l => L(l)).join(' · ')) : null,

    h('div', { class: 'vb-line vb-aside' },
      h('b', {}, L(['Graduation: ', '升级进度：'])),
      L([`${grad.passes} of ${grad.needed} consecutive reviews with an investor at Build position or Enter now`,
         `连续${grad.needed}次复核中，已有${grad.passes}次出现“建立仓位”或“现在进入”`]),
      grad.archetype ? L([` (${ARCHETYPES[grad.archetype].label[0]})`, `（${ARCHETYPES[grad.archetype].label[1]}）`]) : ''),

    h('div', { class: 'vb-line' }, internal('/changes?market=' + m.id, L(['Every change to this card →', '该卡片的全部变更 →']))));
}

export function renderScoutPage(app){
  const page = buildScoutPage(SCOUT_DATA, { on: today() });

  app.append(renderHeader({
    title: ['Scouting — markets with no dashboard', '观察名单 — 尚无看板的市场'],
    sub: [
      `${page.total} markets in three regions. A card is a first screen, not an underwriting case.`,
      `三个区域共${page.total}个市场。卡片只是初筛，不是承销结论。`,
    ],
  }));
  app.append(marketNav(markets, 'scout'));

  const intro = spacedCard(['What a scouting card is', '观察卡片是什么'], []);
  intro.append(h('div', { class: 'cap' }, L([
    'Scouting proposals are drafted by an AI agent from public pages the analyst listed, then reviewed and applied only by the analyst. Automatic analysis and publication are disabled. Every grade and verdict rests on a quotation that was found, word for word, in a page fetched in that run. No return is modelled: a card grades how a market can be entered, how durable the case is and how capital behaves, and says nothing about what an asset earns.',
    '观察卡片提案由AI智能体依据分析师列出的公开页面起草，仅由分析师审核并应用。自动分析与发布均已关闭。每一项评级和结论都以当次运行所抓取页面中逐字找到的引文为依据。本层不对回报建模：卡片只评估市场如何进入、投资逻辑是否持久以及资本条件如何，不涉及资产能赚多少。',
  ])));
  intro.append(h('div', { class: 'vb-line' }, L(GRADUATION_RULE)));
  intro.append(h('div', { class: 'vb-line vb-aside' },
    L([`${page.writtenCount} of ${page.total} cards written. `, `${page.total}张卡片中已写成${page.writtenCount}张。`]),
    L([`Consecutive clean passes by the agent: ${page.streak} of ${page.streakNeeded}. `, `智能体连续无拒绝的运行次数：${page.streak}/${page.streakNeeded}。`]),
    L([`A card holds at most ${MAX_SCOUT_FACTS} facts.`, `每张卡片最多${MAX_SCOUT_FACTS}条事实。`])));
  app.append(intro);

  for (const { region, rows } of page.regions){
    const block = spacedCard(region.label, []);
    block.append(h('div', { class: 'sc-region' }, rows.map(card)));
    app.append(block);
  }
  app.append(renderFooter([[
    'A card is a file in view/scout/ in the repository, and every change to one is a line in view/changelog.jsonl with the quotation it rests on.',
    '每张卡片是仓库 view/scout/ 中的一个文件；对卡片的每次变更都是 view/changelog.jsonl 中的一行，并附其所依据的引文。',
  ]]));
}
