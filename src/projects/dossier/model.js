/* ---------------------------------------------------------------------------
   THE DOSSIER MODEL INTERFACE.

   A project's financial model is project-specific arithmetic. A platform that
   tried to generalise it would either constrain what a deal may model or quietly
   substitute its own assumptions for the sponsor's — and the second is the
   failure this whole layer exists to prevent.

   So the split is:

     THE DOSSIER OWNS      inputs, formulas, scenario logic, golden expectations,
                           and the ledger of what it could not resolve.
     THE PLATFORM OWNS     controls, tables, charts, formatting, layout, i18n.

   A project model MUST NOT create DOM, CSS or SVG. `calculate(inputs)` is a pure
   function from an input object to a plain result object; everything visible is
   rendered by shared components from that result. That rule is what keeps a
   second dashboard framework from growing inside local-data/, which is exactly
   what the two attached prototypes would have brought with them.

   ---------------------------------------------------------------------------
   WHY GOLDEN CHECKS ARE PART OF THE INTERFACE

   A transcribed model is a claim that this code reproduces that spreadsheet.
   Nothing about running it proves that — it will produce numbers either way, and
   plausible wrong numbers are the worst possible output for a document someone
   underwrites from.

   So a model declares `golden`: input sets with expected outputs and an explicit
   tolerance. `runGoldenChecks()` is what turns "I ported the formulas" into a
   statement that can fail. A model whose goldens do not pass is not published —
   `verifyModel()` reports it and the panel renders the failure rather than the
   numbers.

   ---------------------------------------------------------------------------
   THE GAP LEDGER, AND WHY IT IS VISIBLE

   Transcription meets ambiguity: a constant with no derivation, a scenario
   override with no stated reason, a cell referencing a workbook nobody has.
   The tempting move is to infer a formula that reproduces the displayed output.
   That manufactures false precision — the number matches, and the reason it
   matches is invented.

   The rule is: anything ambiguous becomes N/A with a reason, and the reason is
   RENDERED. `gaps` is that ledger. It is not an appendix; a model with unresolved
   gaps shows them beside its outputs, because a reader deciding how much weight
   to put on an IRR needs to know what could not be reconstructed.
   --------------------------------------------------------------------------- */

/** What kind of gap. Named so the ledger can be read at a glance. */
export const GAP = {
  /** A constant with no derivation in the source. */
  HARDCODED: 'hardcoded',
  /** A value whose as-of date or vintage is not stated. */
  MISSING_VINTAGE: 'missing-vintage',
  /** A scenario changes an input and the source does not say why. */
  UNEXPLAINED_OVERRIDE: 'unexplained-override',
  /** The source cell references something not supplied. */
  EXTERNAL_DEPENDENCY: 'external-dependency',
  /** The transcription and the source disagree within a stated bound. */
  RECONCILIATION: 'reconciliation',
};

export const GAP_LABEL = {
  [GAP.HARDCODED]:            ['Hard-coded, no derivation', '硬编码，无推导过程'],
  [GAP.MISSING_VINTAGE]:      ['Vintage not stated', '未注明数据年份'],
  [GAP.UNEXPLAINED_OVERRIDE]: ['Scenario override unexplained', '情景调整原因未说明'],
  [GAP.EXTERNAL_DEPENDENCY]:  ['Depends on a source not supplied', '依赖未提供的外部来源'],
  [GAP.RECONCILIATION]:       ['Does not reconcile exactly', '未能完全勾稽一致'],
};

/* A gap that changes a headline output is not the same as one that moves a
   footnote, and a ledger that did not distinguish them would be ignored. */
export const GAP_SEVERITY = { BLOCKING: 'blocking', MATERIAL: 'material', NOTED: 'noted' };

export const GAP_SEVERITY_LABEL = {
  [GAP_SEVERITY.BLOCKING]: ['Blocking — output withheld', '阻断性 — 相关输出暂缓发布'],
  [GAP_SEVERITY.MATERIAL]: ['Material to an output', '对输出有实质影响'],
  [GAP_SEVERITY.NOTED]:    ['Noted, not material', '已记录，无实质影响'],
};

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';

/**
 * Problems with a model's SHAPE. Content is the dossier's business.
 *
 * Strict about the things the panel depends on and about the things that would
 * let false precision through — every input needs a base value the golden checks
 * can start from, and every gap needs a reason a reader can act on.
 */
export function validateModel(model){
  const problems = [];
  if (!model) return [];                       // a dossier without a model is fine
  const at = (m) => problems.push(m);

  if (!isPair(model.name)) at('model.name must be an [en, zh] pair');
  if (typeof model.calculate !== 'function') at('model.calculate(inputs) must be a function');

  if (!Array.isArray(model.inputs) || !model.inputs.length){
    at('model.inputs must list at least one input');
  } else {
    const keys = new Set();
    for (const i of model.inputs){
      if (!i.key || keys.has(i.key)) at(`model.inputs: duplicate or missing key "${i.key}"`);
      keys.add(i.key);
      if (!isPair(i.label)) at(`input ${i.key}: label must be an [en, zh] pair`);
      if (!Number.isFinite(i.base)) at(`input ${i.key}: base must be a number — the golden checks start from it`);
      if (i.min != null && i.max != null && !(i.min <= i.base && i.base <= i.max)){
        at(`input ${i.key}: base sits outside [min, max]`);
      }
      /* Where an input came from is not optional. A slider with no provenance
         invites a reader to move it and treat the output as sourced. */
      if (!i.source && !i.gapId) at(`input ${i.key}: needs a source, or a gapId naming why it has none`);
    }
  }

  for (const s of model.scenarios || []){
    if (!s.id) at('a scenario has no id');
    if (!isPair(s.name)) at(`scenario ${s.id}: name must be an [en, zh] pair`);
    if (!s.overrides || typeof s.overrides !== 'object') at(`scenario ${s.id}: overrides must be an object`);
  }

  if (!Array.isArray(model.golden) || !model.golden.length){
    at('model.golden must declare at least the base case — a transcription with no golden check is an untested claim');
  } else {
    for (const g of model.golden){
      if (!g.id) at('a golden case has no id');
      if (!g.expect || typeof g.expect !== 'object') at(`golden ${g.id}: expect must be an object of output paths`);
    }
  }

  for (const gap of model.gaps || []){
    if (!gap.id) at('a gap has no id');
    if (!Object.values(GAP).includes(gap.kind)) at(`gap ${gap.id}: unknown kind "${gap.kind}"`);
    if (!Object.values(GAP_SEVERITY).includes(gap.severity)) at(`gap ${gap.id}: unknown severity`);
    if (!isPair(gap.what)) at(`gap ${gap.id}: what must be an [en, zh] pair`);
    if (!isPair(gap.why)) at(`gap ${gap.id}: why must be an [en, zh] pair — a gap without a reason is just a missing number`);
  }

  for (const row of model.platformCompare || []){
    if (!isPair(row.label)) at('a platformCompare row needs an [en, zh] label');
    if (!row.platformPath) at('a platformCompare row needs a platformPath to read the shared value from');
    if (!isPair(row.explanation)) at('a platformCompare row needs an explanation of the difference');
  }
  return problems;
}

/** Base inputs, as declared. The starting point for every scenario and golden. */
export const baseInputs = (model) =>
  Object.fromEntries((model.inputs || []).map(i => [i.key, i.base]));

/** Base inputs with a named scenario's overrides applied. */
export function scenarioInputs(model, scenarioId){
  const s = (model.scenarios || []).find(x => x.id === scenarioId);
  return s ? { ...baseInputs(model), ...s.overrides } : baseInputs(model);
}

/** Reads a dotted path out of a result object. */
export function readPath(obj, path){
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * Runs a model's declared golden cases.
 *
 * Tolerance is per-case and explicit: a transcription that agrees to the cent is
 * a different claim from one that agrees to a basis point, and the model says
 * which it is making. Absent tolerance means exact.
 *
 * @returns {{id:string, ok:boolean, failures:Array}[]}
 */
export function runGoldenChecks(model){
  return (model.golden || []).map(g => {
    const inputs = g.scenarioId
      ? scenarioInputs(model, g.scenarioId)
      : { ...baseInputs(model), ...(g.inputs || {}) };

    let out;
    try {
      out = model.calculate(inputs);
    } catch (err){
      return { id: g.id, ok: false, failures: [{ path: '(threw)', message: err.message }] };
    }

    const failures = [];
    for (const [path, expected] of Object.entries(g.expect)){
      const actual = readPath(out, path);
      const tol = g.tolerance?.[path] ?? g.tolerance?.default ?? 0;

      if (typeof expected === 'number'){
        if (!Number.isFinite(actual)){
          failures.push({ path, expected, actual, message: 'not a number' });
        } else if (Math.abs(actual - expected) > tol){
          failures.push({ path, expected, actual, tol,
            message: `differs by ${Math.abs(actual - expected)}, tolerance ${tol}` });
        }
      } else if (actual !== expected){
        failures.push({ path, expected, actual, message: 'not equal' });
      }
    }
    return { id: g.id, ok: failures.length === 0, failures };
  });
}

/**
 * Everything the panel needs to decide what it may render.
 *
 * A model that fails its goldens, or carries a blocking gap, does not get to
 * show its outputs — the panel shows the failure instead. That is the whole
 * point of declaring them.
 */
export function verifyModel(model){
  const shape = validateModel(model);
  const golden = runGoldenChecks(model);
  const blocking = (model.gaps || []).filter(g => g.severity === GAP_SEVERITY.BLOCKING);
  return {
    shape,
    golden,
    blocking,
    publishable: shape.length === 0 && golden.every(g => g.ok) && blocking.length === 0,
  };
}
