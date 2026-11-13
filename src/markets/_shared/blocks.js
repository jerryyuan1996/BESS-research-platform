/* ---------------------------------------------------------------------------
   DECLARATIVE BLOCK RENDERER - the heart of the GB/IE/RO/PL lineage.

   Markets describe each tab as a list of blocks; this engine draws them. It is
   what guarantees the four dashboards mirror one another, and it is why adding a
   section to one of them is a data edit rather than a code edit.

   Verbatim from the prototype (GB payload lines 781-998).
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { card } from '../../components/card.js';
import { badge, statusBadge as statusBadgeBase } from '../../components/badge.js';
import { chip } from '../../components/chip.js';
import { why } from '../../components/decisionLogic.js';
import { kpi, scoreRows, bandFor } from '../../components/metricCard.js';
import { sourceDrawer } from '../../components/sourceDrawer.js';
import { renderGeographicGridMap } from '../../components/geographicGridMap.js';
import { renderProjectPipeline, renderZoneAwards } from '../../projects/pipelineTable.js';
import { renderCongestionRegister } from '../../components/congestionPanel.js';
import { buildPathwayPanel } from '../../components/buildPathwayPanel.js';
import { mountInvestmentCase } from '../../components/investmentCaseLoader.js';
import { lineChart, barChart, waterfall, bandChart } from '../../charts/index.js';
import { GLOSS_CORE } from './glossary.js';
import { researchHistoryTimeline } from '../../components/researchHistoryTimeline.js';

/** @param {object} ctx  { MKT, M, T, state, render, fmt, compute, lab, exports } */
export function createBlocks(ctx){
  const { MKT, M, T, state, render } = ctx;
  const { fmtN, fmt1 } = ctx.fmt;
  const { at, liveFactors, liveScore, stageProb } = ctx.compute;
  const { blkLabInputs, blkLabOutputs, blkLabDuration, blkLabSnaps } = ctx.lab;
  const { blkDesignFit } = ctx.designFit;
  const { exportCsv, exportJson } = ctx.exports;

  // Each market stamps its own seed tag (GB_SEED_V1, IE_SEED_V1, ...).
  const statusBadge = (live) => statusBadgeBase(live, MKT.seedTag);
function B(parent, b){
  if (!b) return;
  if (Array.isArray(b)){ b.forEach(x => B(parent, x)); return; }
  switch (b.t){
    case 'card': {
      const c = card(b.title, (b.badges || []).concat(b.live === false ? [statusBadge(false)] : b.live ? [statusBadge(true)] : []));
      B(c, b.blocks);
      if (b.src) c.append(sourceDrawer(b.src, b.srcUse || ['Referenced in this card', '本卡片引用']));
      if (b.mt !== false) c.style.marginTop = '14px';
      parent.append(c);
      break;
    }
    case 'g2': case 'g3': {
      const g = h('div', { class: 'grid ' + (b.t === 'g2' ? 'g2' : 'g3'), style: 'margin-top:14px;' });
      (b.cards || []).forEach(cd => B(g, Object.assign({ t: 'card', mt: false }, cd)));
      parent.append(g);
      break;
    }
    case 'kpis':
      parent.append(h('div', { class: 'kpis' }, b.items.map(k =>
        kpi(L(k.l), k.v, k.d ? { text: L(k.d), cls: k.cls } : null, k.b))));
      break;
    case 'table': {
      const w = h('div', { class: 'tbl-wrap' });
      const num = b.num || [];
      w.append(h('table', {},
        b.head ? h('thead', {}, h('tr', {}, b.head.map((x, i) =>
          h('th', num.indexOf(i) >= 0 ? { class: 'num' } : {}, L(x))))) : null,
        h('tbody', {}, b.rows.map(r => h('tr', {}, r.map((cell, i) => {
          const td = h('td', num.indexOf(i) >= 0 ? { class: 'num' } : {});
          if (cell && cell.chip) td.append(chip(cell.chip, L(cell.text)));
          else if (cell && cell.b) td.append(h('b', {}, L(cell.b)));
          else td.append(document.createTextNode(cell == null ? '—' : L(cell)));
          return td;
        }))))));
      parent.append(w);
      break;
    }
    case 'line':   lineChart(parent, b.cfg); break;
    case 'bar':    barChart(parent, b.cfg); break;
    case 'wf':     waterfall(parent, b.cfg); break;
    case 'band':   bandChart(parent, b.cfg); break;
    case 'note':   parent.append(h('div', { class: 'note' }, b.b ? h('b', {}, L(b.b)) : null, L(b.text))); break;
    case 'reco':   parent.append(h('div', { class: 'reco' }, b.b ? h('b', {}, L(b.b)) : null, L(b.text))); break;
    case 'warn':   parent.append(h('div', { class: 'warnbox' }, L(b.text))); break;
    case 'proto':  parent.append(h('div', { class: 'proto' }, L(b.text))); break;
    case 'band-story': parent.append(h('div', { class: 'story-band' }, h('b', {}, L(b.b)), h('p', {}, L(b.text)))); break;
    case 'p':      parent.append(h('div', { class:'research-paragraph', style: 'font-size:var(--fs-xs);color:var(--ink2);margin:8px 0;' }, L(b.text))); break;
    case 'cap':    parent.append(h('div', { class: 'cap' }, L(b.text))); break;
    case 'sub':    parent.append(h('div', { style: 'font-size:var(--fs-2xs);color:var(--muted);margin:8px 0 4px;' }, L(b.text))); break;
    case 'chip':   parent.append(h('div', { style: 'margin:8px 0;' }, chip(b.cls, L(b.text)))); break;
    case 'why':    parent.append(why(b.text, b.sig)); break;
    case 'flow':
      parent.append(h('div', { class: 'flow' }, b.items.flatMap((x, i) => {
        const box = h('span', { class: 'fbox', style: (i === b.items.length - 1 && b.strongLast !== false) ? 'border-color:var(--s1);font-weight:var(--fw-medium);' : '' }, L(x));
        return i === 0 ? [box] : [h('span', { class: 'farr' }, b.sep || '→'), box];
      })));
      break;
    case 'meter':
      parent.append(h('div', { class: 'meter' }, h('div', { style: `width:${b.pct}%;background:var(--${b.color || 's1'});` })));
      break;
    case 'scores': parent.append(scoreRows(b.items, b.max || 100)); break;
    case 'list':
      parent.append(h(b.ol ? 'ol' : 'ul', { class: 'actions' }, b.items.map(it =>
        h('li', {}, L(it[0]), it[1] ? h('span', { class: 'trig' }, L(it[1])) : null))));
      break;
    case 'timeline':
      parent.append(researchHistoryTimeline(b.items));
      break;
    case 'phases':
      parent.append(h('div', { class: 'phase-grid' }, b.items.map(p => h('div', { class: 'phase' },
        h('div', { class: 'yr' }, L(p.yr)), h('h4', {}, L(p.h)), h('p', {}, L(p.p))))));
      break;
    case 'players':
      parent.append(h('div', { class: 'player-grid' }, b.items.map(p => h('div', { class: 'player' },
        h('div', { class: 'ptype' }, L(p.type)), h('h4', {}, L(p.n)),
        h('div', { class: 'pmet' }, p.met), h('p', {}, L(p.p))))));
      break;
    case 'exits':
      parent.append(h('div', {}, b.items.map(e => h('div', { class: 'exit' },
        h('div', {}, h('div', { class: 'ename' }, L(e.n)), h('div', { class: 'ecase' }, L(e.w))),
        h('div', {}, h('div', {}, L(e.d)), e.c ? h('div', { class: 'ecase' }, L(e.c)) : null)))));
      break;
    case 'cmp':
      parent.append(h('div', { class: 'cmp' }, b.items.map(x => h('div', {},
        h('div', { class: 'cmp-h' }, L(x.h)), h('div', { class: 'cmp-v' }, L(x.v)),
        h('div', { class: 'cmp-s' }, L(x.s))))));
      break;
    case 'gates':
      parent.append(h('div', {}, b.items.map(g => h('div', { class: 'gate' },
        h('div', { class: 'gname' }, L(g.n)), h('div', {}, L(g.d)),
        h('div', { class: 'gstat' }, chip(g.c, L(g.s)))))));
      break;
    case 'ladder':
      parent.append(h('div', { class: 'status-ladder' }, b.items.map(s => h('div', { class: 'status-step' },
        h('b', {}, L(s.n)), h('span', {}, L(s.d))))));
      break;
    case 'wfrows':
      parent.append(h('div', { class: 'waterfall-list' }, b.items.map(r => h('div', { class: 'wf-row' },
        h('div', {}, L(r.l)), h('div', { class: 'v' }, r.v), h('div', {}, L(r.n))))));
      break;
    case 'ic':
      parent.append(h('div', { class: 'ic-summary' }, h('b', {}, L(b.b)), h('div', { style:'margin-top:5px;font-size:var(--fs-xs);color:var(--ink2)' }, L(b.text))));
      break;
    case 'src': parent.append(sourceDrawer(b.src, b.use)); break;
    case 'geo-grid-map': renderGeographicGridMap(parent, b.data); break;
    /* How a project actually gets built. A block rather than a section so that
       a market can place it where its own argument wants it — Finland puts it
       under Grid Connection, next to the constraint that decides the project. */
    /* ---- shapes a deal file needs, in the shared vocabulary --------------
       `structure` and `sensGrid` live here rather than in projects/dossier/ so
       there is ONE block vocabulary: a market that later wants an ownership
       diagram should not have to discover a second renderer. They are small and
       pure-DOM, so carrying them costs a market chunk almost nothing.

       The `model` block is deliberately NOT here. It pulls in the whole model
       panel, and no market can use it — wiring it into the shared switch put
       that weight into all thirteen market chunks to serve a block only a
       confidential dossier can contain. It is handled in
       projects/dossier/blocks.js instead. */
    case 'structure': {
      /* An ownership and contract diagram as nested boxes rather than SVG.
         A deal structure is a tree with labelled edges, and a tree of divs
         reflows on a phone, prints, and is readable by a screen reader —
         none of which a hand-positioned SVG does. */
      const wrap = h('div', { class: 'deal-structure' });
      const node = (n, depth) => {
        const el = h('div', { class: 'ds-node depth-' + Math.min(depth, 3) },
          h('div', { class: 'ds-role' }, L(n.role)),
          n.name ? h('div', { class: 'ds-name' }, L(n.name)) : null,
          n.note ? h('div', { class: 'ds-note' }, L(n.note)) : null);
        if (n.children?.length){
          const kids = h('div', { class: 'ds-children' });
          for (const c of n.children){
            if (c.edge) kids.append(h('div', { class: 'ds-edge' }, L(c.edge)));
            kids.append(node(c, depth + 1));
          }
          el.append(kids);
        }
        return el;
      };
      for (const root of (b.nodes || [])) wrap.append(node(root, 0));
      if (b.cap) wrap.append(h('div', { class: 'cap' }, L(b.cap)));
      parent.append(wrap);
      break;
    }
    case 'sensGrid': {
      /* Two-axis sensitivity with the base case marked. The marked cell is the
         point: a grid of numbers without one says which combinations were
         tested and not which one is being proposed. */
      const w = h('div', { class: 'tbl-wrap' });
      const rows = b.rows || [];
      w.append(h('table', { class: 'sens-grid' },
        h('thead', {},
          h('tr', {},
            h('th', {}, L(b.rowLabel || ['', ''])),
            ...(b.cols || []).map(c => h('th', { class: 'num' }, L(c))))),
        h('tbody', {}, rows.map((r, ri) => h('tr', {},
          h('td', {}, h('b', {}, L(r.label))),
          ...(r.values || []).map((v, ci) => h('td', {
            class: 'num' + (b.base && b.base[0] === ri && b.base[1] === ci ? ' sens-base' : ''),
          }, String(v))))))));
      parent.append(w);
      if (b.cap) parent.append(h('div', { class: 'cap' }, L(b.cap)));
      break;
    }
    case 'pathway':
      if (b.pathway) parent.append(buildPathwayPanel(b.pathway, { sourceFor: b.sourceFor }));
      break;
    /* The verdicts and the entry ledger read the view store and the ledger
       registry by market id, so a section names its market and nothing else.
       Fetched on demand: only four markets have these tabs, and the method
       layer behind them must not ride in the chunk every market shares. */
    case 'investment-case': mountInvestmentCase(parent, b.marketId, 'case', ctx.finishResearch); break;
    case 'entry-ledger': mountInvestmentCase(parent, b.marketId, 'entry', ctx.finishResearch); break;
    /* The pipeline table and the map read one set of canonical project records,
       so a market cannot publish two different fleets. */
    case 'project-pipeline': renderProjectPipeline(parent, b); break;
    case 'zone-awards': renderZoneAwards(parent, b); break;
    /* The congestion register that belongs to the map above it. Both are joined
       to the market in gridMapRegistry.js, so they cannot disagree. */
    case 'congestion': renderCongestionRegister(parent, b.data); break;
    case 'walk':
      parent.append(h('div', { class: 'walk' }, b.items.map(x => h('button', {
        class: 'walk-step', onclick: () => { state.tab = x[3]; render(); window.scrollTo(0, 0); } },
        h('span', { class: 'n' }, x[0] + ' · ' + L(x[1])), h('b', {}, L(x[2]))))));
      break;
    case 'badges':
      parent.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;' },
        b.items.map(x => typeof x === 'string' ? badge(x) : x)));
      break;
    // ---- interactive blocks (engine-owned so behaviour matches across markets) ----
    case 'scorecard': blkScorecard(parent, b); break;
    case 'aug':       blkAugmentation(parent, b); break;
    case 'stageProb': blkStageProb(parent); break;
    case 'pipeChart': blkPipeChart(parent, b); break;
    case 'projTable': blkProjTable(parent, b); break;
    case 'labInputs': blkLabInputs(parent); break;
    case 'labOut':    blkLabOutputs(parent); break;
    case 'labDur':    blkLabDuration(parent); break;
    case 'designFit': blkDesignFit(parent); break;
    case 'labSnaps':  blkLabSnaps(parent); break;
    case 'exports':
      parent.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;' },
        h('button', { class: 'btn', onclick: exportCsv }, L(T.downloadCsv)),
        h('button', { class: 'btn', onclick: exportJson }, L(T.downloadJson))));
      break;
    case 'glossary': {
      const rows = GLOSS_CORE.concat(M.glossary || []);
      parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
        h('tbody', {}, rows.map(g => h('tr', {}, h('td', {}, g[0]), h('td', {}, g[1])))))));
      break;
    }
    default: break;
  }
}

// ---------------- interactive blocks ----------------
function blkScorecard(parent, b){
  // b.id and b.bands may be dotted paths ('regions.tokyo.durFactors') so a
  // multi-region market can score each region without duplicating the block.
  const id = b.id, factors = liveFactors(id), score = liveScore(id), band = bandFor(at(b.bands), score);
  const wrap = h('div', {});
  wrap.append(h('div', { style: 'margin:8px 0;' }, chip(band.c, L(band.n) + ' · ' + score + ' / 100')));
  const tbl = h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(T.factor)), h('th', { class: 'num' }, L(T.weight)),
      h('th', { class: 'num' }, L(T.score) + ' (0–3)'), h('th', { class: 'num' }, L(['Weighted', '加权'])))),
    h('tbody', {}, factors.map((f, i) => h('tr', {},
      h('td', {}, L(f.n)), h('td', { class: 'num' }, f.w + '%'),
      h('td', { class: 'num' }, (() => {
        const s = h('select', { class: 'inp', style: 'width:64px;',
          onchange: e => { state.scores[id][i] = +e.target.value; render(); } },
          [0, 1, 2, 3].map(v => { const o = h('option', { value: v }, String(v)); if (v === f.s) o.selected = true; return o; }));
        return s;
      })()),
      h('td', { class: 'num' }, fmt1(f.w * f.s / 3)))))));
  wrap.append(tbl);
  wrap.append(h('div', { class: 'note' }, h('b', {}, L(['Reading: ', '解读：'])), L(band.d || band.n)));
  parent.append(wrap);
}
function blkAugmentation(parent, b){
  if (!state.scores.aug) state.scores.aug = M.augDefaults.slice();
  const tot = state.scores.aug.reduce((a, x) => a + x, 0), max = M.augItems.length * 2;
  const pct = Math.round(tot / max * 100);
  const cls = pct >= 80 ? 'good' : pct >= 60 ? 'warn' : 'serious';
  parent.append(h('div', { style: 'margin:8px 0;' }, chip(cls,
    L(['Augmentation readiness', '增容准备度']) + ': ' + tot + ' / ' + max + ' (' + pct + '%)')));
  parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Readiness item', '准备度事项'])), h('th', { class: 'num' }, L(['0–2', '0–2'])))),
    h('tbody', {}, M.augItems.map((it, i) => h('tr', {},
      h('td', {}, L(it)),
      h('td', { class: 'num' }, (() => h('select', { class: 'inp', style: 'width:64px;',
        onchange: e => { state.scores.aug[i] = +e.target.value; render(); } },
        [0, 1, 2].map(v => { const o = h('option', { value: v }, String(v)); if (v === state.scores.aug[i]) o.selected = true; return o; })))())))))));
}
function blkStageProb(parent){
  parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Development stage', '开发阶段'])), h('th', { class: 'num' }, L(['Probability', '概率'])))),
    h('tbody', {}, M.stages.map(s => h('tr', {}, h('td', {}, L(s.n)), h('td', { class: 'num' }, s.p + '%')))))));
}
/* One registry with a region column, filtered on demand — rather than one project
   list per region, which would drift. `region` is optional and absent for every
   single-region market. */
function projectsIn(region){
  return region ? M.projects.filter(p => p.region === region) : M.projects;
}
function projectValue(p, unit){
  if (unit !== 'MWh') return Number.isFinite(p.mw) ? p.mw : 0;
  return Number.isFinite(p.mw) && Number.isFinite(p.h) ? p.mw * p.h : 0;
}
function pipelineByYear(unit, region){
  const src = projectsIn(region);
  const years = [...new Set(src.map(p => p.cod).filter(Number.isFinite))].sort();
  const raw = years.map(y => src.filter(p => p.cod === y)
    .reduce((a, p) => a + projectValue(p, unit), 0));
  const pw = years.map(y => src.filter(p => p.cod === y)
    .reduce((a, p) => a + projectValue(p, unit) * stageProb(p.st), 0));
  return { years, raw, pw };
}
function blkPipeChart(parent, b){
  // With `series:[{region,name,color}]` the chart compares regions instead of
  // announced-vs-weighted; both share one probability-weighting rule.
  if (Array.isArray(b.series) && b.series.length){
    const years = [...new Set(projectsIn().map(p => p.cod))].sort();
    barChart(parent, {
      xs: years.map(String), mode: 'group', yfmt: v => fmtN(v) + ' ' + b.unit, h: 250,
      series: b.series.map(s => ({
        name: s.name, color: s.color,
        vals: years.map(y => projectsIn(s.region).filter(p => p.cod === y)
          .reduce((a, p) => a + projectValue(p, b.unit) * (b.weighted === false ? 1 : stageProb(p.st)), 0)),
      })),
    });
    return;
  }
  const d = pipelineByYear(b.unit, b.region);
  barChart(parent, {
    xs: d.years.map(String), mode: 'group', yfmt: v => fmtN(v) + ' ' + b.unit, h: 250,
    series: [
      { name: ['Announced (raw)', '公告口径（未加权）'], color: 'var(--s3)', vals: d.raw },
      { name: ['Probability-weighted', '概率加权'], color: 'var(--s1)', vals: d.pw },
    ],
  });
}
function blkProjTable(parent, b){
  const projects = projectsIn(b && b.region);
  const showGate = projects.some(p => Object.hasOwn(p, 'gate'));
  const rows = projects.map(p => {
    const st = M.stages.find(s => s.id === p.st);
    const location = [p.owner, p.site || p.county || p.region].filter(Boolean).join(' · ') || '—';
    const cells = [
      h('td', {}, h('b', {}, p.n)), h('td', {}, location),
      h('td', { class: 'num' }, Number.isFinite(p.mw) ? fmtN(p.mw) : '—'),
      h('td', { class: 'num' }, Number.isFinite(p.h) ? fmt1(p.h) : '—'),
      h('td', { class: 'num' }, Number.isFinite(p.mw) && Number.isFinite(p.h) ? fmtN(p.mw * p.h) : '—'),
      h('td', { class: 'num' }, p.codDate || p.cod || '—'),
      h('td', {}, st ? L(st.n) : (p.statusRaw || '—')),
    ];
    if (showGate) cells.push(h('td', { class: 'num' }, p.gate || '—'));
    cells.push(h('td', { class: 'num' }, st ? st.p + '%' : '—'));
    return h('tr', {}, cells);
  });
  const heads = [
    h('th', {}, L(['Project', '项目'])), h('th', {}, L(['Owner / location', '业主/区位'])),
    h('th', { class: 'num' }, 'MW'), h('th', { class: 'num' }, L(['Hours', '小时'])),
    h('th', { class: 'num' }, 'MWh'), h('th', { class: 'num' }, L(['Effective date / COD', '生效日期/投运'])),
    h('th', {}, L(['Stage', '阶段'])),
  ];
  if (showGate) heads.push(h('th', { class: 'num' }, 'Gate'));
  heads.push(h('th', { class: 'num' }, L(['Analyst weight', '分析师权重'])));
  parent.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, heads)),
    h('tbody', {}, rows))));
}
  return { B, blkScorecard, blkAugmentation, blkStageProb, pipelineByYear, blkPipeChart, blkProjTable, projectsIn };
}
