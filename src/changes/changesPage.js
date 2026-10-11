/* ---------------------------------------------------------------------------
   /changes — every change to the view, with who made it and on what.

   A grade or a verdict can be changed by the analyst, by a rule he wrote in
   advance, or — once it is live — by an agent with a fetched source. No badge
   marks which: that is the analyst's decision (plan section 7.5), and its
   other half is this page. The changelog is the record, so the record has to
   be readable. Every line here says who, when, which record, what it held
   before and after, the reason given, and the evidence.

   Filterable by market and by author, with the filters in the URL so "every
   change a rule has made in Western Australia" is a link.

   FETCHED ON DEMAND, WITH THE CHANGELOG. The home page carries ten lines of
   the changelog and no more. The whole of it — every line, with both records
   — is a chunk of its own that only this route loads, so the entry chunk and
   the home page's first view do not grow as the changelog does.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { markets, byId } from '../markets/registry.js';
import { scoutMarket } from '../governance/scout.js';
import { VIEW_CHANGELOG } from '../markets/viewChangelog.js';
import {
  AUTHOR_LABEL, filterChanges, filterOptions, describeChange, authorLine, recordLabel, changesHref, pathParts,
} from './changeModel.js';

/** Lines drawn at first, and added by each "show more". */
const PAGE = 40;
let shown = PAGE;
let lastFilter = '';

/* A registered market by its short name, a scout market by its roster name. */
const marketName = (id) => { const m = byId(id); return m ? L(m.manifest.shortName) : scoutMarket(id) ? L(scoutMarket(id).name) : id; };

/* A trigger's label, from wherever the changelog last held the record: a rule
   is named by what it watches, even after the trigger itself is gone. */
function triggerLabels(entries){
  const labels = new Map();
  for (const e of entries){
    const { section, key } = pathParts(e.path);
    const record = e.to || e.from;
    if (section === 'triggers' && key && Array.isArray(record?.label)) labels.set(`${e.market}/${key}`, record.label);
  }
  return labels;
}

function select(label, value, options, onChange){
  const control = h('select', { class: 'inp cl-select', 'aria-label': label, onchange: (e) => onChange(e.target.value || null) },
    options.map(([id, text]) => h('option', { value: id }, text)));
  control.value = value || '';
  return h('label', { class: 'cl-filter' }, h('span', { class: 'cl-filter-label' }, label), control);
}

function fieldRow(f){
  const value = (v) => v ? L(v) : L(['(text)', '（文字内容）']);
  return h('li', {},
    h('span', { class: 'cl-field' }, L(f.label)), ' ',
    f.from || f.to
      ? h('span', {}, h('span', { class: 'cl-was' }, value(f.from)), ' → ', h('b', {}, value(f.to)))
      : h('span', { class: 'cl-was' }, L(['rewritten', '已改写'])));
}

function evidenceRow(e){
  const reading = e.field
    ? L([`${e.field} read ${e.observed}, against a line of ${e.op || ''} ${e.threshold}`, `${e.field} 读数为 ${e.observed}，阈值为 ${e.op || ''} ${e.threshold}`])
    : null;
  return h('li', {},
    e.url ? h('a', { href: e.url, target: '_blank', rel: 'noopener noreferrer' }, e.publisher || e.url) : (e.publisher || ''),
    reading ? h('span', {}, ' — ', reading) : null,
    e.quote ? h('span', { class: 'cl-quote' }, ' — “', e.quote, '”') : null,
    e.retrievedAt ? h('span', { class: 'cl-was' }, ' · ', L(['retrieved ', '获取于 ']), String(e.retrievedAt).slice(0, 10)) : null);
}

function entryCard(entry, labels){
  const { section, key } = pathParts(entry.path);
  const triggerLabel = section === 'triggers' ? labels.get(`${entry.market}/${key}`) : null;
  const ruleLabel = entry.trigger ? labels.get(`${entry.market}/${entry.trigger}`) : null;
  const change = describeChange(entry);
  const kind = entry.author?.kind;

  const what = change.kind === 'created' ? L(['Added', '新增'])
    : change.kind === 'removed' ? L(['Removed', '移除'])
    : L(['Changed', '修改']);

  return h('li', { class: 'cl-entry' },
    h('div', { class: 'cp-meta' },
      h('span', { class: 'cp-date' }, String(entry.at).slice(0, 16).replace('T', ' '), ' UTC'),
      h('b', {}, marketName(entry.market)),
      h('span', { class: 'cp-author' + (kind && kind !== 'analyst' ? ' cl-machine' : '') }, L(authorLine(entry, ruleLabel)))),
    h('div', { class: 'cp-path' }, h('b', {}, what), ' · ', L(recordLabel(entry.path, triggerLabel)), ' ', h('code', {}, entry.path)),
    change.headline ? h('div', { class: 'cl-headline' }, L(change.headline)) : null,
    change.fields.length > 0 ? h('ul', { class: 'cl-fields' }, change.fields.map(fieldRow)) : null,
    h('div', { class: 'cp-reason' }, L(entry.reason)),
    entry.reverts ? h('div', { class: 'cl-note' }, L(['Reverts the change recorded as ', '撤销了以下变更：']), h('code', {}, entry.reverts)) : null,
    entry.gap ? h('div', { class: 'cl-note' }, L([
      `A practitioner view of ${entry.gap.held ?? '—'} sits on this grade; public sources support ${entry.gap.sourced}.`,
      `该评级之上有一项从业者观点（${entry.gap.held ?? '—'}）；公开来源支持的评级为${entry.gap.sourced}。`,
    ])) : null,
    Array.isArray(entry.evidence) && entry.evidence.length > 0 ? h('div', { class: 'cl-evidence' },
      h('div', { class: 'cl-field' }, L(['Evidence', '证据'])),
      h('ul', {}, entry.evidence.map(evidenceRow))) : null);
}

/**
 * @param app     the mount point
 * @param filter  { market, author } from the route
 */
export function renderChangesPage(app, filter = {}){
  const options = filterOptions(VIEW_CHANGELOG);
  const market = options.markets.some(m => m.id === filter.market) ? filter.market : null;
  const author = AUTHOR_LABEL[filter.author] ? filter.author : null;
  const key = `${market}|${author}`;
  if (key !== lastFilter){ shown = PAGE; lastFilter = key; }

  const entries = filterChanges(VIEW_CHANGELOG, { market, author });
  const labels = triggerLabels(VIEW_CHANGELOG);
  const go = (next) => navigate(changesHref({ market, author, ...next }));

  app.append(renderHeader({
    title: ['What changed, and who changed it', '改了什么，由谁改的'],
    sub: [
      'Every change to a grade, a verdict, a trigger or the thesis, newest first. Nothing on any other page marks who made a change. This page is the record.',
      '评级、结论、触发事件与投资论点的每一次变更，按时间倒序排列。其他页面不标注变更由谁作出，以本页记录为准。',
    ],
  }));
  app.append(marketNav(markets, 'changes'));

  const main = h('main', { class: 'verdict-home' });
  app.append(main);

  const machine = VIEW_CHANGELOG.filter(e => e.author?.kind && e.author.kind !== 'analyst').length;
  main.append(h('div', { class: 'note' }, L([
    `${VIEW_CHANGELOG.length} changes are recorded. ${machine === 0 ? 'All of them were made by the analyst: no rule has fired and the agent does not write yet.' : `${machine} were made by a rule or an agent; the rest by the analyst.`} A rule is a change the analyst wrote in advance, applied when a published figure crosses the line he set. Weights, grade anchors, limits, score bands and discount rates are not in this record because nothing automatic can change them.`,
    `共记录${VIEW_CHANGELOG.length}项变更。${machine === 0 ? '全部由分析师作出：尚无规则触发，智能体目前也不写入。' : `其中${machine}项由规则或智能体作出，其余由分析师作出。`}规则是分析师事先写好的变更，在公开数据越过他设定的阈值时自动执行。权重、评分锚定标准、限额、评分区间与折现率不在此记录之列，因为任何自动化都无法改动它们。`,
  ])));

  const card = h('div', { class: 'card' });
  main.append(card);
  card.append(h('div', { class: 'cl-filters' },
    select(L(['Market', '市场']), market,
      [['', L(['All markets', '全部市场'])], ...options.markets.map(m => [m.id, `${marketName(m.id)} (${m.count})`])],
      (value) => go({ market: value })),
    select(L(['Author', '作者']), author,
      [['', L(['Anyone', '不限'])], ...options.authors.map(a => [a.id, `${L(AUTHOR_LABEL[a.id])} (${a.count})`])],
      (value) => go({ author: value })),
    (market || author) ? h('a', { class: 'cl-clear', href: '/changes', onclick: (e) => { e.preventDefault(); navigate('/changes'); } },
      L(['Clear filters', '清除筛选'])) : null));

  if (!entries.length){
    card.append(h('div', { class: 'note' }, L(['No change matches these filters.', '没有符合筛选条件的变更。'])));
  } else {
    const list = h('ol', { class: 'cp-list cl-list' }, entries.slice(0, shown).map(e => entryCard(e, labels)));
    card.append(list);
    card.append(h('div', { class: 'cap' }, L([
      `Showing ${Math.min(shown, entries.length)} of ${entries.length}.`,
      `共${entries.length}项，当前显示${Math.min(shown, entries.length)}项。`,
    ])));
    if (entries.length > shown){
      card.append(h('button', { class: 'btn', type: 'button', onclick: () => { shown += PAGE; app.innerHTML = ''; renderChangesPage(app, filter); } },
        L(['Show more', '显示更多'])));
    }
  }

  app.append(renderFooter([[
    'The record is view/changelog.jsonl in the repository: append-only, one line per change. A change is undone by a later line, never by removing one.',
    '记录即仓库中的 view/changelog.jsonl：只增不改，每项变更一行。撤销变更是追加一行新记录，而不是删除旧记录。',
  ]]));
}
