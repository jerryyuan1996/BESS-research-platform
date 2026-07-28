/* ---------------------------------------------------------------------------
   Source register rendering.

   Each market keeps its own source register in markets/<id>/sources.js. This
   module renders it and must stay ignorant of which market it is showing — no
   source names, URLs, dates or statuses may be hardcoded here (brief section 20).

   A source entry is:
     { file, status:[en,zh], date, cy, url, quality? }
       file    human-readable document / page name
       status  official-final, official-draft, project study, model assumption, ...
       date    publication date, as printed on the source
       cy      coverage: which capacity year / period the figure applies to
       url     canonical public link
       quality optional explicit badge key; otherwise inferred from `status`
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { badge } from './badge.js';

/** Collapsible "Source & status" drawer. Verbatim from WA's sourceDrawer(). */
export function sourceDrawer(src, conclusion){
  if (!src) return null;
  return h('details', { class: 'source-drawer' },
    h('summary', {}, L(['Source & status', '来源与状态'])),
    h('div', { class: 'source-grid' },
      // A source without a public URL (e.g. a licensed vendor index) renders as
      // plain text rather than a dead link.
      h('b', {}, L(['File / page', '文件/页面'])),
      src.url ? h('a', { href: src.url, target: '_blank', rel: 'noopener' }, src.file) : h('span', {}, src.file),
      h('b', {}, L(['Status', '状态'])), h('span', {}, L(src.status)),
      h('b', {}, L(['Source date', '来源日期'])), h('span', {}, src.date),
      h('b', {}, L(['Applicable period', '适用期间'])), h('span', {}, src.cy),
      h('b', {}, L(['Use in dashboard', '看板用途'])), h('span', {}, L(conclusion))));
}

/* Maps a source's status text onto a quality badge. The prototype inferred this
   from substrings of the English status string; an explicit `quality` key on the
   source now takes precedence so a market can classify a source directly. */
export function sourceStatusBadge(src){
  if (src && src.quality) return badge(src.quality);
  const s = src && src.status ? src.status[0] : '';
  if (s.includes('Final')) return badge('final');
  if (s.includes('Draft')) return badge('draft');
  if (s.includes('technical')) return badge('project');
  if (s.includes('Financial')) return badge('model');
  if (s.includes('Consultation')) return badge('consult');   // GB/IE/RO/PL lineage
  return badge('dev');
}

/** Full source register table, for a Data & Methodology tab. */
export function sourceRegister(sources){
  const rows = Object.entries(sources).map(([key, s]) => h('tr', {},
    h('td', {}, h('b', {}, s.file), ' ', sourceStatusBadge(s)),
    h('td', {}, L(s.status)),
    h('td', {}, s.date),
    h('td', {}, s.cy),
    h('td', {}, s.url ? h('a', { href: s.url, target: '_blank', rel: 'noopener' }, L(['Open', '打开'])) : '—')));
  return h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Source', '来源'])),
      h('th', {}, L(['Status', '状态'])),
      h('th', {}, L(['Date', '日期'])),
      h('th', {}, L(['Coverage', '适用期间'])),
      h('th', {}, L(['Link', '链接'])))),
    h('tbody', {}, rows)));
}
