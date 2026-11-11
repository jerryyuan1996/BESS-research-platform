/* ---------------------------------------------------------------------------
   /desk — the analyst's queue.

   The briefing tells an investor what to do; this page tells the analyst which
   calls reality has moved past (guided-experience plan, decision 8: two lists,
   kept apart). Each item names the record to change. The fix is a change file
   through the analyst's own command line, which this page never touches.

   Read from BRIEFING, the whole briefing, which the build writes from the same
   model as the home page and the weekly digest. Fetched on demand.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { markets } from '../markets/registry.js';
import { BRIEFING } from '../briefing/briefingData.js';
import { QUEUE_ORDER } from '../briefing/queue.js';
import { ARCHETYPES } from '../governance/archetypes.js';

const KIND = {
  overdue:        [['Catalysts that passed with no outcome recorded', '已过期但尚未录入结果的触发事件'], ['Record what happened, or move the date.', '录入发生了什么，或调整日期。']],
  disagreement:   [['Calls that run against their economics', '与经济性不一致的结论'], ['Rule on the call, or on the design it names.', '对结论或其所针对的设计作出裁定。']],
  'stale-reason': [['Reasons that quote an old engine figure', '引用旧引擎数字的理由'], ['Rewrite the reason; the grade need not move.', '改写理由；评级不必随之变动。']],
  rule:           [['Rules near or over their line', '接近或越过阈值的规则'], ['A crossing is reported for an analyst decision; a refresh never applies it.', '越过阈值时仅报告并等待分析师决定；刷新不会应用该变更。']],
  review:         [['Reviews due within thirty days', '三十天内到期的复核'], ['Confirm the call, or change it.', '确认结论，或作出调整。']],
  action:         [['Actions past their date', '已逾期的行动'], ['Do it, re-date it, or drop it.', '执行、改期或撤销。']],
  soon:           [['Catalysts due within fourteen days', '十四天内到期的触发事件'], ['Be ready to record the outcome.', '准备录入结果。']],
  feed:           [['Stale feeds', '过期数据源'], ['Check the refresh job and the source.', '检查刷新任务与数据源。']],
};

const REVIEW_LABELS = {
  'observations available': ['Observations available', '已有观察数据'],
  'analysis not started': ['Analysis not started', '尚未分析'],
  'analysis complete': ['Analysis complete', '分析完成'],
  'awaiting decision': ['Awaiting decision', '等待决定'],
  approved: ['Approved', '已批准'], rejected: ['Rejected', '已拒绝'],
  deferred: ['Deferred', '已暂缓'], applied: ['Applied', '已应用'], released: ['Released', '已发布'],
};
const reviewStateLabel = status => REVIEW_LABELS[status] || [status, status];

export function renderDeskPage(app){
  const b = BRIEFING;
  app.append(renderHeader({
    title: ['The analyst desk', '分析台'],
    sub: ['The calls that reality has moved past, and the record to change for each. The briefing is for the investor; this is for keeping it true.',
      '现实已越过的结论，以及每一项需要修改的记录。简报面向投资者，分析台用于保持简报的真实性。'],
  }));
  app.append(marketNav(markets, 'desk'));
  const main = h('main', { class: 'desk' });
  app.append(main);

  main.append(h('div', { class: 'cap bf-asof' }, L([`${b.queue.length} items. Built ${b.builtAt.slice(0, 10)}.`, `${b.queue.length}项。生成于${b.builtAt.slice(0, 10)}。`])));
  if (!b.queue.length) main.append(h('div', { class: 'card' }, L(['Nothing is waiting. Every call is current.', '没有待办。所有结论均为最新。'])));

  if (b.reviewStatus?.length) main.append(h('section', { class: 'card bf-card', 'data-review-status': '' },
    h('h2', { class: 'bf-h' }, L(['Observation and strategy review', '数据观察与策略复核'])),
    h('ul', { class: 'bf-list' }, b.reviewStatus.map(r => h('li', { class: 'bf-li' },
      h('strong', {}, L(b.markets[r.market]?.name || [r.market, r.market])),
      h('div', {}, L(['Latest observation: ', '最近观察：']), r.latestObservation || '—'),
      h('div', {}, L(['Last analysed snapshot: ', '最近分析快照：']), r.lastAnalysedSnapshot || '—'),
      h('div', {}, L(['Approved strategy version: ', '已批准策略版本：']), h('code', {}, r.approvedStrategyVersion || '—')),
      h('div', {}, L(['Last approved change: ', '最近批准变更：']), r.lastApprovedChange || '—'),
      h('div', {}, L(['Review state: ', '复核状态：']), L(reviewStateLabel(r.status))))))));

  for (const kind of QUEUE_ORDER){
    const items = b.queue.filter(q => q.kind === kind);
    if (!items.length) continue;
    const [title, how] = KIND[kind] || [[kind, kind], ['', '']];
    const list = h('ul', { class: 'bf-list desk-list' });
    let lastLens = null;
    for (const q of items){
      if (kind === 'disagreement' && q.archetype !== lastLens){
        lastLens = q.archetype;
        list.append(h('li', { class: 'desk-lens' }, L(ARCHETYPES[q.archetype]?.label || [q.archetype, q.archetype])));
      }
      const slug = b.markets[q.market]?.slug;
      list.append(h('li', { class: 'bf-li desk-item' },
        h('div', {}, L(q.text)),
        h('div', { class: 'desk-path' },
          h('code', {}, q.path),
          slug ? [' · ', h('a', { href: `/markets/${slug}`, onclick: (e) => { e.preventDefault(); navigate(`/markets/${slug}`); window.scrollTo(0, 0); } }, L(['open the market', '打开该市场']))] : null)));
    }
    main.append(h('section', { class: 'card bf-card' },
      h('h2', { class: 'bf-h' }, L(title), h('span', { class: 'desk-count' }, ` ${items.length}`)),
      h('div', { class: 'cap' }, L(how)),
      list));
  }
  main.append(h('div', { class: 'cap' }, L([
    'A change is a file the analyst writes and applies through the analyst\'s own command line; every one leaves a line on /changes. See docs/governance.md.',
    '每项变更都由分析师撰写成文件，并通过其本人的命令行应用；每一项都会在/changes留下记录。详见docs/governance.md。',
  ])));
}
