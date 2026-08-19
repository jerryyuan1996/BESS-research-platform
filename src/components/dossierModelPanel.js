/* ---------------------------------------------------------------------------
   The dossier model panel — shared rendering for project-specific arithmetic.

   Every visible thing here is built by the platform: the controls, the KPI row,
   the tables, the scenario buttons, the number formatting, the bilingual labels.
   The dossier supplies `calculate(inputs)` and gets to decide nothing about how
   its results look.

   That division is the architectural rule for this whole layer. A project model
   that rendered its own DOM would be a second dashboard framework living in
   local-data/, which is precisely what importing either attached prototype
   wholesale would have started.

   THREE THINGS THIS PANEL REFUSES TO DO.

     1. It will not render outputs from a model that fails its own golden checks.
        A transcription is a claim that this code reproduces that spreadsheet;
        the goldens are the evidence, and without them the numbers are plausible
        rather than verified. The failure is shown instead, naming the case.

     2. It will not hide the gap ledger. A model with unresolved ambiguity shows
        it beside the outputs, not in an appendix — a reader deciding how much
        weight to put on an IRR needs to know what could not be reconstructed.

     3. It will not substitute a platform assumption for a project one. The
        comparison table shows both and their difference, side by side, and the
        project value is what the model actually used. Silently replacing it
        would make the dossier agree with the platform by construction, which is
        the opposite of useful.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { chip } from './chip.js';
import { kpi } from './metricCard.js';
import { fmtN, fmt1, fmtPct, fmtX, NF2 } from '../utils/formatting.js';
import { createPrintContext, PRINT_STATUS } from '../print/printContext.js';
import { renderPrintSnapshot } from '../print/printSnapshot.js';
import { byId } from '../markets/registry.js';
import {
  GAP_LABEL, GAP_SEVERITY, GAP_SEVERITY_LABEL,
  baseInputs, scenarioInputs, readPath, verifyModel,
} from '../projects/dossier/model.js';

const SEVERITY_TONE = {
  [GAP_SEVERITY.BLOCKING]: 'critical',
  [GAP_SEVERITY.MATERIAL]: 'serious',
  [GAP_SEVERITY.NOTED]: 'info',
};

/** Formats by the unit a model declares. The model never formats anything. */
function fmtValue(v, unit){
  if (v == null || (typeof v === 'number' && !Number.isFinite(v))) return 'N/A';
  switch (unit){
    case 'pct':   return fmtPct(v * 100, 1);
    case 'pct1':  return fmt1(v) + '%';
    case 'x':     return fmt1(v) + '×';
    case 'yr':    return fmtN(v) + ' yr';
    case 'money': return fmtN(Math.round(v));
    /* A model denominated in millions loses its meaning at integer precision:
       an exit price of 51.2 and one of 51.8 are a different deal, and both
       render as "51" under `money`. */
    case 'dec2':  return NF2.format(v);
    case 'x2':    return fmtX(v);
    default:      return typeof v === 'number' ? fmtN(v) : String(v);
  }
}

/**
 * @param {object} model     the dossier's model
 * @param {object} [opts]
 * @param {string} [opts.marketId]  for the platform-reference comparison
 */
export function dossierModelPanel(model, { marketId } = {}){
  const verdict = verifyModel(model);

  const c = card(L(model.name), [badge('model'), badge('conf')]);

  /* Shape problems come first and stop everything: a malformed model cannot be
     trusted to have run at all. */
  if (verdict.shape.length){
    c.append(h('div', { class: 'warnbox' },
      h('b', {}, L(['This model does not satisfy the interface. ', '本模型不符合接口要求。'])),
      verdict.shape.join(' · ')));
    return c;
  }

  /* Local state. Held in the closure rather than in app state: a dossier is
     confidential and nothing about it should outlive the page. */
  let inputs = baseInputs(model);
  let activeScenario = null;

  const outputs = h('div');
  const controls = h('div', { class: 'frm' });

  const recompute = () => {
    outputs.innerHTML = '';
    renderOutputs(outputs, model, inputs, verdict,
      (model.scenarios || []).find(x => x.id === activeScenario) || null);
  };

  /* ---- scenarios --------------------------------------------------------- */
  if (model.scenarios?.length){
    const seg = h('div', { class: 'seg' },
      h('button', {
        class: 'btn' + (activeScenario === null ? ' active' : ''),
        onclick: (e) => {
          activeScenario = null; inputs = baseInputs(model);
          syncControls(); markActive(e.currentTarget); recompute();
        },
      }, L(['Base case', '基准情景'])),
      ...model.scenarios.map(s => h('button', {
        class: 'btn',
        onclick: (e) => {
          activeScenario = s.id; inputs = scenarioInputs(model, s.id);
          syncControls(); markActive(e.currentTarget); recompute();
        },
      }, L(s.name))));

    const markActive = (btn) => {
      [...seg.children].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };

    c.append(h('div', { class: 'lab-ctl' },
      h('div', { class: 'lab-ctl-lbl' }, L(['Scenario', '情景'])), seg));
  }

  /* ---- inputs ------------------------------------------------------------ */
  const fields = new Map();
  for (const spec of model.inputs){
    const input = h('input', {
      class: 'inp', type: 'number', value: String(inputs[spec.key]),
      min: spec.min != null ? String(spec.min) : null,
      max: spec.max != null ? String(spec.max) : null,
      step: spec.step != null ? String(spec.step) : 'any',
      oninput: (e) => {
        const v = Number(e.target.value);
        if (Number.isFinite(v)){ inputs = { ...inputs, [spec.key]: v }; recompute(); }
      },
    });
    fields.set(spec.key, input);

    const gap = (model.gaps || []).find(g => g.id === spec.gapId);
    controls.append(h('div', {},
      h('label', {}, L(spec.label),
        gap ? chip(SEVERITY_TONE[gap.severity] || 'info', L(['gap ', '缺口 ']) + gap.id) : null),
      input,
      spec.source
        ? h('div', { class: 'cap' }, typeof spec.source === 'string' ? spec.source : L(spec.source))
        : null));
  }
  const syncControls = () => {
    for (const [key, el] of fields) el.value = String(inputs[key]);
  };

  c.append(controls);
  c.append(outputs);
  recompute();

  /* ---- the ledger, always visible where there is one --------------------- */
  if (model.gaps?.length) c.append(gapLedger(model));

  /* ---- platform comparison, never a substitution ------------------------- */
  if (model.platformCompare?.length && marketId){
    c.append(platformComparison(model, marketId));
  }

  return c;
}

/* ---------------------------------------------------------------------------
   THE DOSSIER'S PRINT ADAPTER.

   Built here, inside the same synchronous pass that clears `outputs` and
   rebuilds it, from the very `inputs` object about to be handed to
   `calculate()`. Nothing re-reads a control, so the snapshot and the numbers
   below it cannot describe different input sets: a re-render replaces both or
   neither.

   The three withholding paths each produce a context too. A failed golden set,
   a blocking gap or a throw must still PRINT — saying what was withheld and
   why — rather than printing nothing, which on paper is indistinguishable from
   a model that was never run. */
export function printContextFor(model, inputs, verdict, scenario, out, status, reason){
  const assumptions = model.inputs.map(spec => ({
    label: spec.label,
    value: formatInput(inputs[spec.key], spec),
    unit: spec.unit ?? null,
    source: spec.source ?? null,
    status: spec.gapId ? 'see gap ' + spec.gapId : null,
  }));

  const material = (model.gaps || []).filter(g => g.severity !== 'noted');

  const outputs = status === PRINT_STATUS.OK && out
    ? (model.kpis || []).map(k => ({
        label: k.label, value: fmtValue(readPath(out, k.path), k.unit), unit: null,
      }))
    : [];

  return createPrintContext({
    status,
    statusReason: reason ?? null,
    scenario: scenario ? { id: scenario.id, name: scenario.name } : null,
    model: {
      id: L(model.name),
      version: model.version ?? null,
      vintage: model.vintage ?? null,
    },
    assumptions,
    gaps: material.map(g => ({ id: g.id, severity: g.severity, what: g.what })),
    outputs,
  });
}

/** An input value as the reader set it, not as the engine stores it. */
function formatInput(value, spec){
  if (value == null) return 'N/A';
  if (typeof value !== 'number') return String(value);
  if (spec.step && spec.step >= 1) return NF2.format(value).replace(/\.00$/, '');
  return NF2.format(value);
}

function renderOutputs(parent, model, inputs, verdict, scenario){
  /* A model that fails its goldens does not get to show numbers. */
  const failed = verdict.golden.filter(g => !g.ok);
  if (failed.length){
    parent.append(h('div', { class: 'warnbox' },
      h('b', {}, L(['Golden checks failed — outputs withheld. ', '基准校验未通过 — 输出暂缓发布。'])),
      L(['This transcription does not reproduce its source model, so its numbers are not shown. Failing cases: ',
         '本次转录未能复现源模型，故不展示其数值。未通过的用例：']),
      failed.map(f => f.id).join(', ')));
    parent.append(renderPrintSnapshot(printContextFor(model, inputs, verdict, scenario, null,
      PRINT_STATUS.WITHHELD,
      ['Outputs withheld: this transcription does not reproduce its source model. Failing golden checks: '
        + failed.map(f => f.id).join(', '),
       '输出暂缓发布：本次转录未能复现源模型。未通过的基准校验：'
        + failed.map(f => f.id).join(', ')])));
    return;
  }
  if (verdict.blocking.length){
    parent.append(h('div', { class: 'warnbox' },
      h('b', {}, L(['Blocking gap — outputs withheld. ', '阻断性缺口 — 输出暂缓发布。'])),
      verdict.blocking.map(g => L(g.what)).join(' · ')));
    parent.append(renderPrintSnapshot(printContextFor(model, inputs, verdict, scenario, null,
      PRINT_STATUS.WITHHELD,
      ['Outputs withheld by a blocking gap: ' + verdict.blocking.map(g => g.what[0]).join(' · '),
       '因阻断性缺口暂缓发布输出：' + verdict.blocking.map(g => g.what[1]).join(' · ')])));
    return;
  }

  let out;
  try {
    out = model.calculate(inputs);
  } catch (err){
    parent.append(h('div', { class: 'warnbox' },
      L(['The model threw on these inputs: ', '模型在当前输入下报错：']) + err.message));
    parent.append(renderPrintSnapshot(printContextFor(model, inputs, verdict, scenario, null,
      PRINT_STATUS.FAILED,
      ['The model did not produce a result for these inputs: ' + err.message,
       '模型在当前输入下未能得出结果：' + err.message])));
    return;
  }

  /* Immediately before the outputs, so a page break cannot separate them. */
  parent.append(renderPrintSnapshot(
    printContextFor(model, inputs, verdict, scenario, out, PRINT_STATUS.OK, null)));

  if (model.kpis?.length){
    parent.append(h('div', { class: 'kpis' }, model.kpis.map(k => {
      const v = readPath(out, k.path);
      return kpi(L(k.label), fmtValue(v, k.unit),
        k.detail ? { text: L(k.detail) } : null);
    })));
  }

  /* Tables the model declares by shape — columns, rows, units — and the panel
     draws. The model returns data; it never returns markup. */
  for (const t of model.tables || []){
    const rows = readPath(out, t.path) || [];
    const w = h('div', { class: 'tbl-wrap' });
    w.append(h('table', {},
      h('thead', {}, h('tr', {}, t.columns.map(col =>
        h('th', col.unit ? { class: 'num' } : {}, L(col.label))))),
      h('tbody', {}, rows.map(r => h('tr', {}, t.columns.map(col =>
        h('td', col.unit ? { class: 'num' } : {},
          fmtValue(r[col.key], col.unit))))))));
    parent.append(h('div', { class: 'cap', style: 'margin-top:10px;' }, L(t.label)));
    parent.append(w);
  }
}

function gapLedger(model){
  const c = h('div', { class: 'note', style: 'margin-top:14px;' },
    h('b', {}, L(['Model gap ledger. ', '模型缺口清单。'])),
    L(['Anything the source model left ambiguous is recorded here as N/A with a reason, never reconstructed as an inferred formula. A number that matched because the formula was guessed is worse than a number that is absent.',
       '源模型中任何未明确之处，均在此记录为N/A并附原因，绝不以推测公式还原。若数值仅因公式被猜中而吻合，其危害甚于数值缺失。']));

  const w = h('div', { class: 'tbl-wrap' });
  w.append(h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Ref', '编号'])),
      h('th', {}, L(['What', '事项'])),
      h('th', {}, L(['Kind', '类型'])),
      h('th', {}, L(['Severity', '影响程度'])),
      h('th', {}, L(['Why it is not resolved', '未解决原因'])))),
    h('tbody', {}, model.gaps.map(g => h('tr', {},
      h('td', {}, h('b', {}, g.id)),
      h('td', {}, L(g.what)),
      h('td', {}, L(GAP_LABEL[g.kind] || ['', ''])),
      h('td', {}, chip(SEVERITY_TONE[g.severity] || 'info', L(GAP_SEVERITY_LABEL[g.severity] || ['', '']))),
      h('td', {}, L(g.why)))))));
  c.append(w);
  return c;
}

function platformComparison(model, marketId){
  const market = byId(marketId);
  const c = h('div', { style: 'margin-top:14px;' },
    h('div', { class: 'cap' }, L([
      'Project model against this platform’s market reference. Shown for comparison only — the project value is what the model used, and the platform value never replaces it. Where they differ, the difference is the finding.',
      '项目模型与本平台市场参考值的对比。仅供比较 — 项目值为模型实际采用值，平台值不会将其替代。二者存在差异之处，差异本身即为结论。',
    ])));

  const w = h('div', { class: 'tbl-wrap' });
  w.append(h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Assumption', '假设项'])),
      h('th', { class: 'num' }, L(['Project model', '项目模型'])),
      h('th', { class: 'num' }, L(['Platform reference', '平台参考'])),
      h('th', { class: 'num' }, L(['Difference', '差异'])),
      h('th', {}, L(['Explanation', '说明'])))),
    h('tbody', {}, model.platformCompare.map(row => {
      const platform = market ? readPath(market.comparison, row.platformPath) : undefined;
      const project = row.projectValue;
      const diff = (Number.isFinite(platform) && Number.isFinite(project))
        ? project - platform : null;
      return h('tr', {},
        h('td', {}, h('b', {}, L(row.label))),
        h('td', { class: 'num' }, fmtValue(project, row.unit)),
        h('td', { class: 'num' }, Number.isFinite(platform) ? fmtValue(platform, row.unit) : 'N/A'),
        h('td', { class: 'num' }, diff == null ? 'N/A'
          : (diff > 0 ? '+' : '') + fmtValue(diff, row.unit)),
        h('td', {}, L(row.explanation)));
    }))));
  c.append(w);
  return c;
}
