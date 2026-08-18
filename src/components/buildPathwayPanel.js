/* ---------------------------------------------------------------------------
   The build-pathway section.

   Renders one market's pathway: what a sponsor does, in what order, with whom,
   and what each step can stop.

   Lives in components/ rather than in either market lineage because both need
   it. WA's dashboard is hand-written and Finland's is drawn by the shared block
   engine; a renderer either of them can append is the only way this section
   looks the same in both.

   THREE THINGS THE LAYOUT ARGUES, and they are why this is a table rather than
   a timeline chart:

     1. OWNER is the column a development team reads first, because it answers
        "who can stop me". A Gantt bar hides that; a column does not.
     2. The DURATION BASIS sits next to every duration. A range whose provenance
        is invisible reads as a measurement, and most of these are conventions.
     3. Stages that run in PARALLEL are marked and excluded from the total, so
        nobody sums nine rows into a programme nobody has run.

   The order deviation is computed rather than written, so the sentence
   "consent runs before application here" cannot drift out of step with the rows
   above it.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { chip } from './chip.js';
import {
  STAGE_LABEL, OWNER_LABEL, DURATION_BASIS, DURATION_BASIS_LABEL,
  pathwayMonths, orderDeviation,
} from '../governance/buildPathway.js';

/* A convention-based duration is the weakest thing on the page and is toned to
   say so. Published is the only one that carries an operator's commitment. */
const BASIS_TONE = {
  [DURATION_BASIS.PUBLISHED]: 'ok',
  [DURATION_BASIS.OBSERVED]: 'info',
  [DURATION_BASIS.CONVENTION]: 'warn',
};

const months = (stage) => (Array.isArray(stage.months)
  ? stage.months[0] + '–' + stage.months[1]
  : '—');

/**
 * @param {object} pathway  from markets/buildPathwayRegistry.js
 * @param {object} [opts]
 * @param {(key:string)=>object} [opts.sourceFor]  resolves a stage's sourceKey
 *   to the market's own source-register entry, so the citation column links to
 *   the same register the rest of the dashboard uses
 */
export function buildPathwayPanel(pathway, { sourceFor } = {}){
  const total = pathwayMonths(pathway);
  const deviations = orderDeviation(pathway);

  const c = card(
    ['How a project actually gets built here', '项目实际建设流程'],
    [badge('official'), badge('verify')]);

  c.append(h('div', { class: 'note' }, L(pathway.summary)));

  /* The limit, before the table rather than after it. A reader who takes the
     durations as commitments has been misled by the time they reach a footnote. */
  c.append(h('div', { class: 'warnbox' }, L(pathway.limit)));

  if (total){
    c.append(h('div', { class: 'kpis' },
      kpiBlock(['Stages', '阶段数'], String(pathway.stages.length), null),
      kpiBlock(['Elapsed, sequential', '顺序推进总耗时'],
        total.min + '–' + total.max + '<small> months</small>',
        total.parallel
          ? [total.parallel + ' stage(s) run in parallel and are excluded',
             '有' + total.parallel + '个阶段并行推进，未计入合计']
          : ['No stages run in parallel', '无并行阶段']),
      kpiBlock(['Order', '流程顺序'],
        deviations.length ? String(deviations.length) : '—',
        deviations.length
          ? ['Departure(s) from the conventional order — see below', '与常规顺序存在差异 — 详见下文']
          : ['Conventional order', '常规顺序'])));
  }

  /* Computed, not written. The whole value of this sentence is that it stays
     true when someone reorders the stages above. */
  if (deviations.length){
    c.append(h('div', { class: 'note' },
      h('b', {}, L(['Ordering. ', '顺序差异。'])),
      L(deviations.map(d =>
        L(STAGE_LABEL[d.runsEarlier]) + ' → ' + L(STAGE_LABEL[d.insteadOf])).join(' · ')),
      ' ',
      L(['This market gates those stages earlier than the conventional sequence. The workstreams may still overlap; what differs is which approvals must be in hand before the next instrument can be signed, and that changes where a programme puts capital at risk.',
         '本市场对上述阶段的把关时点早于常规顺序。各项工作仍可能并行推进；差异在于签署下一份法律文件前必须先行取得哪些许可，而这改变了开发计划中资金承压的时点。'])));
  }

  const wrap = h('div', { class: 'tbl-wrap' });
  const table = h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Stage', '阶段'])),
      h('th', {}, L(['With whom', '对手方'])),
      h('th', {}, L(['Instrument', '依据文件'])),
      h('th', { class: 'num' }, L(['Months', '月数'])),
      h('th', {}, L(['What ends it', '结束标志'])))),
    h('tbody', {}, pathway.stages.map(stage => {
      const label = STAGE_LABEL[stage.id] || [stage.id, stage.id];
      return h('tr', {},
        h('td', {},
          h('b', {}, L(label)),
          stage.parallelWith
            ? chip('info', L(['parallel with ', '与…并行']) + L(STAGE_LABEL[stage.parallelWith] || ['', '']))
            : null),
        h('td', {}, L(OWNER_LABEL[stage.owner] || ['', ''])),
        h('td', {}, L(stage.instrument)),
        h('td', { class: 'num' },
          months(stage), ' ',
          chip(BASIS_TONE[stage.durationBasis] || 'info',
            L(DURATION_BASIS_LABEL[stage.durationBasis] || ['', '']))),
        h('td', {}, L(stage.gate)));
    })));
  wrap.append(table);
  c.append(wrap);

  /* Per-stage commentary below the table rather than inside it: the notes are
     where the market-specific argument lives, and a table cell that long stops
     being a table. */
  for (const stage of pathway.stages){
    if (!stage.note) continue;
    const src = sourceFor ? sourceFor(stage.sourceKey) : null;
    c.append(h('div', { class: 'cap' },
      h('b', {}, L(STAGE_LABEL[stage.id] || ['', '']) + ' — '),
      L(stage.note),
      src?.url
        ? h('a', { href: src.url, target: '_blank', rel: 'noopener', style: 'margin-left:6px;' },
            L(['source', '来源']))
        : null));
  }

  return c;
}

function kpiBlock(label, value, detail){
  const el = h('div', { class: 'kpi' },
    h('div', { class: 'k' }, L(label)),
    h('div', { class: 'v' }));
  el.querySelector('.v').innerHTML = value;
  if (detail) el.append(h('div', { class: 'd' }, L(detail)));
  return el;
}
