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
     3. PREREQUISITES are rendered as explicit edges — this artefact before that
        instrument — rather than as an implied sequence. Absence of an edge means
        unordered, not simultaneous.

   THERE IS NO ELAPSED TOTAL, deliberately. An earlier version summed the
   sequential stages and dropped every parallel one, which is not a critical
   path: it silently assumed a parallel stage never extends beyond the stage it
   runs alongside. The per-stage ranges and their basis labels stay, because
   those are the things the sources actually support.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { chip } from './chip.js';
import {
  STAGE_LABEL, OWNER_LABEL, DURATION_BASIS, DURATION_BASIS_LABEL,
  prerequisites, prerequisitesBefore,
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
  const gates = prerequisites(pathway);

  const c = card(
    ['How a project actually gets built here', '项目实际建设流程'],
    [badge('official'), badge('verify')]);

  c.append(h('div', { class: 'note' }, L(pathway.summary)));

  /* The limit, before the table rather than after it. A reader who takes the
     durations as commitments has been misled by the time they reach a footnote. */
  c.append(h('div', { class: 'warnbox' }, L(pathway.limit)));

  c.append(h('div', { class: 'kpis' },
    kpiBlock(['Stages', '阶段数'], String(pathway.stages.length), null),
    kpiBlock(['Published gating rules', '已公布的前置规则'],
      gates.length ? String(gates.length) : '—',
      gates.length
        ? ['An artefact that must be in hand before an instrument can be signed', '签署相应法律文件前必须先行取得的成果']
        : ['None published for this market', '本市场未公布相关规则'])));

  /* Rendered from the edges, not from the row order. Each line names the
     artefact, where it comes from and what it gates — which is what the
     operators publish, and is finer than "stage A precedes stage B". */
  if (gates.length){
    const list = h('div', { class: 'note' },
      h('b', {}, L(['Gating rules. ', '前置规则。'])));
    for (const g of gates){
      const src = sourceFor ? sourceFor(g.sourceKey) : null;
      list.append(h('div', { style: 'margin-top:5px;' },
        L(g.requires),
        ' → ',
        h('b', {}, L(g.instrument)),
        h('span', { class: 'cap', style: 'margin-left:6px;' },
          L(['from ', '来自']) + L(STAGE_LABEL[g.requiresFrom] || ['', ''])),
        src?.url
          ? h('a', { href: src.url, target: '_blank', rel: 'noopener', style: 'margin-left:6px;' },
              L(['source', '来源']))
          : null));
    }
    list.append(h('div', { class: 'cap', style: 'margin-top:6px;' }, L([
      'Anything not joined by a rule above is unordered rather than simultaneous — the workstreams may overlap, and where a market publishes no rule this section does not invent one.',
      '未被上述规则关联的环节属于无先后约束，而非同时进行 — 各项工作可能重叠；若某市场未公布相关规则，本节不作推断。',
    ])));
    c.append(list);
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
            ? chip('info', L(['commonly overlaps ', '通常与…重叠']) + L(STAGE_LABEL[stage.parallelWith] || ['', '']))
            : null,
          prerequisitesBefore(pathway, stage.id).length
            ? chip('warn', L(['gated', '有前置条件']))
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
