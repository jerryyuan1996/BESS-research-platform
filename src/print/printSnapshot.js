/* ---------------------------------------------------------------------------
   THE ASSUMPTION SNAPSHOT — the one renderer both tools print through.

   Hidden on screen, where the controls are visible and are the better
   interface. Shown in print, where they are not.

   It renders immediately before the outputs it governs, so a page break can
   separate a table from its assumptions only by separating the whole block, and
   an IRR can never appear on paper without the input set that produced it.

   THE PRINT DATE IS STAMPED AT PRINT TIME, not at render time. A dashboard left
   open overnight would otherwise print yesterday's date on today's numbers,
   which is a small lie of exactly the kind this module exists to prevent.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { PRINT_STATUS } from './printContext.js';

/* One listener for the whole document, attached lazily. Every snapshot on the
   page carries a [data-print-stamp] node and all of them are refreshed. */
let stampWired = false;
function wireStamp(){
  if (stampWired || typeof window === 'undefined' || !window.addEventListener) return;
  stampWired = true;
  const stamp = () => {
    const now = new Date();
    const text = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
    for (const el of document.querySelectorAll('[data-print-stamp]')){
      el.textContent = text;
      el.setAttribute('datetime', now.toISOString());
    }
  };
  window.addEventListener('beforeprint', stamp);
  /* Safari and the print-to-PDF paths in some browsers fire the media query
     rather than beforeprint. Both are wired; stamping twice is harmless. */
  if (window.matchMedia){
    const mq = window.matchMedia('print');
    if (mq.addEventListener) mq.addEventListener('change', (e) => { if (e.matches) stamp(); });
  }
}

const STATUS_LABEL = {
  [PRINT_STATUS.OK]: ['Calculated', '已计算'],
  [PRINT_STATUS.WITHHELD]: ['Outputs withheld', '输出暂缓发布'],
  [PRINT_STATUS.FAILED]: ['No result', '无结果'],
};

/**
 * Render a print context.
 *
 * @param {object} ctx  a context from createPrintContext()
 * @returns {HTMLElement}
 */
export function renderPrintSnapshot(ctx){
  wireStamp();

  /* MODEL VERSION IS PROVENANCE, NOT DISPLAY COPY.

     It is reproduced exactly as the market or model declares it, including
     historical identifiers whose naming convention has since been abandoned.
     An export that quietly modernises an identifier cannot be matched back to
     the run that produced it, which defeats the purpose of printing it at all.

     It sits in the metadata, labelled as a version, rather than in the line a
     reader takes as the model's name. */
  const meta = [];
  meta.push([L(['Model', '模型']), ctx.model.id]);
  if (ctx.scenario) meta.push([L(['Scenario', '情景']), L(ctx.scenario.name)]);
  meta.push([L(['Status', '状态']), L(STATUS_LABEL[ctx.status] || ['—', '—'])]);
  if (ctx.model.vintage) meta.push([L(['Assumption vintage', '假设版本日期']), ctx.model.vintage]);

  const root = h('section', { class: 'print-snap', 'data-print-snapshot': ctx.status });

  root.append(h('h4', { class: 'print-snap-title' },
    L(['Assumptions governing the figures below', '下列数据所依据的假设'])));

  /* Header line: what ran, on which basis, and when this sheet was printed. */
  const head = h('dl', { class: 'print-snap-meta' });
  for (const [k, v] of meta){ head.append(h('dt', {}, k), h('dd', {}, v)); }
  head.append(h('dt', {}, L(['Printed', '打印时间'])),
              h('dd', {}, h('time', { 'data-print-stamp': '' }, '—')));
  root.append(head);

  /* Calculation provenance, last and in its own line, so the identifier is
     legible as a reference rather than read as part of the model's name. */
  if (ctx.model.version){
    root.append(h('p', { class: 'print-snap-provenance' },
      h('span', {}, L(['Model version', '模型版本']) + ': '),
      h('code', {}, ctx.model.version)));
  }

  /* A withheld or failed run says so here, in place of the numbers. The reason
     is not shortened for print: it is the most important thing on the page. */
  if (ctx.status !== PRINT_STATUS.OK && ctx.statusReason){
    root.append(h('p', { class: 'print-snap-status' }, L(ctx.statusReason)));
  }

  if (ctx.assumptions.length){
    const t = h('table', { class: 'print-snap-table' },
      h('thead', {}, h('tr', {},
        h('th', {}, L(['Assumption', '假设项'])),
        h('th', { class: 'num' }, L(['Value', '取值'])),
        h('th', {}, L(['Unit', '单位'])),
        h('th', {}, L(['Source or status', '来源或状态'])))),
      h('tbody', {}, ctx.assumptions.map(a => h('tr', {},
        h('td', {}, L(a.label)),
        h('td', { class: 'num' }, a.value),
        h('td', {}, a.unit || '—'),
        h('td', {}, a.source || a.status || '—')))));
    root.append(t);
  }

  if (ctx.extra.length){
    const t = h('table', { class: 'print-snap-table' },
      h('tbody', {}, ctx.extra.map(e => h('tr', {},
        h('td', {}, L(e.label)), h('td', {}, e.value)))));
    root.append(t);
  }

  /* Gaps print at full weight. They are the reason a number is or is not
     trustworthy, and a printed sheet is exactly where that gets forgotten. */
  if (ctx.gaps.length){
    root.append(h('h5', { class: 'print-snap-subtitle' },
      L(['Material gaps and unresolved assumptions', '重要缺口与未决假设'])));
    root.append(h('ul', { class: 'print-snap-gaps' }, ctx.gaps.map(g =>
      h('li', {}, (g.id ? g.id + ' — ' : '') + L(g.what)
        + (g.severity ? ' (' + g.severity + ')' : '')))));
  }

  return root;
}
