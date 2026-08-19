/* ---------------------------------------------------------------------------
   THE PRINT CONTEXT — one contract, two adapters, one renderer.

   A printed page of returns is worthless without the assumptions that produced
   them, and worse than worthless if the two disagree. The screen does not have
   this problem: a reader can see the slider. Paper cannot, so the assumptions
   have to travel with the numbers.

   ---------------------------------------------------------------------------
   WHY A CONTRACT RATHER THAN A SHARED STATE CONTAINER

   The Investment Lab and the dossier model panel are different tools. The Lab
   runs a shared market engine over app-level state; a dossier runs its own
   pure `calculate(inputs)` over closure-local state that deliberately does not
   outlive the page. Forcing them into one container would make the confidential
   tool depend on the public one's architecture, for a formatting benefit.

   So each owns a small adapter that produces THIS shape, and both hand it to
   the same renderer. Two adapters is the design. Two renderers, or a second
   copy of the selected values, is not.

   The shape is extensible on purpose: `extra` carries whatever a tool has that
   the other does not, rather than either tool dropping detail to look like its
   sibling.

   ---------------------------------------------------------------------------
   CAPTURED FROM THE RUN, NEVER RE-READ FROM THE CONTROLS

   The context is built from the same inputs object that was just passed to the
   calculation, in the same synchronous pass that renders its outputs. It is
   never assembled by reading the controls at print time.

   That distinction is the whole safety property. Re-reading controls would let
   a reader move a slider, print before the recalculation lands, and get new
   assumptions above old numbers — a document that is internally contradictory
   and looks authoritative. Because the snapshot and the outputs are produced
   together and replaced together, the pair is always consistent: mid-update the
   page shows the previous assumptions above the previous outputs, which is
   stale but true.

   Values arrive pre-formatted. The two tools format differently — one in AUD
   millions, the other in USD per MW — and a renderer that re-derived them would
   be a third opinion about what the number means.
   --------------------------------------------------------------------------- */

/** Calculation status. Anything but OK means no headline result may print. */
export const PRINT_STATUS = {
  OK: 'ok',
  /** Ran, but outputs are deliberately withheld — a blocking gap, say. */
  WITHHELD: 'withheld',
  /** Did not produce a result: threw, or required evidence is absent. */
  FAILED: 'failed',
};

const isPair = (v) => Array.isArray(v) && v.length >= 2 && typeof v[0] === 'string';

/**
 * Validate a print context. Returns problems; empty means usable.
 *
 * Deliberately strict about the one thing that matters: a context claiming OK
 * must carry both the assumptions and the outputs. A snapshot with no
 * assumptions is the failure this whole module exists to prevent, and it would
 * otherwise render as a tidy, empty, entirely plausible box.
 */
export function validatePrintContext(ctx){
  const problems = [];
  if (!ctx || typeof ctx !== 'object') return ['no print context'];

  if (!Object.values(PRINT_STATUS).includes(ctx.status))
    problems.push(`status must be one of ${Object.values(PRINT_STATUS).join(', ')}`);

  if (!ctx.model || typeof ctx.model.id !== 'string' || !ctx.model.id)
    problems.push('model.id is required — a printed result must say what produced it');

  if (!Array.isArray(ctx.assumptions))
    problems.push('assumptions must be an array');
  else for (const [i, a] of ctx.assumptions.entries()){
    if (!isPair(a.label)) problems.push(`assumptions[${i}] needs an [en, zh] label`);
    if (a.value == null || a.value === '') problems.push(`assumptions[${i}] needs a value`);
  }

  if (!Array.isArray(ctx.outputs)) problems.push('outputs must be an array');
  if (!Array.isArray(ctx.gaps)) problems.push('gaps must be an array');

  if (ctx.status === PRINT_STATUS.OK){
    if (!ctx.assumptions?.length)
      problems.push('a successful run must print the assumptions that governed it');
    if (!ctx.outputs?.length)
      problems.push('status is ok but there are no outputs — use withheld or failed');
  } else if (ctx.outputs?.length){
    problems.push(`status is ${ctx.status} but outputs are present; a non-ok run must not ` +
                  'print a headline result');
  }

  if (ctx.status !== PRINT_STATUS.OK && !isPair(ctx.statusReason))
    problems.push('a withheld or failed run must say why, in [en, zh]');

  return problems;
}

/**
 * Build a validated, frozen print context.
 *
 * Frozen because a context is a record of one calculation that already
 * happened. Anything that wants to change it wants a different run.
 */
export function createPrintContext(fields){
  const ctx = {
    status: fields.status,
    statusReason: fields.statusReason ?? null,
    scenario: fields.scenario ?? null,
    model: {
      id: fields.model?.id ?? '',
      version: fields.model?.version ?? null,
      vintage: fields.model?.vintage ?? null,
    },
    assumptions: (fields.assumptions ?? []).map(a => ({
      label: a.label, value: String(a.value), unit: a.unit ?? null,
      source: a.source ?? null, status: a.status ?? null,
    })),
    gaps: (fields.gaps ?? []).map(g => ({
      id: g.id ?? null, severity: g.severity ?? null, what: g.what,
    })),
    outputs: (fields.outputs ?? []).map(o => ({
      label: o.label, value: String(o.value), unit: o.unit ?? null,
    })),
    /* Project-specific detail neither tool should have to drop. */
    extra: (fields.extra ?? []).map(e => ({ label: e.label, value: String(e.value) })),
  };

  const problems = validatePrintContext(ctx);
  if (problems.length){
    /* Loud, because the alternative is a printed page that quietly omits the
       assumptions it was built to carry. */
    throw new Error('invalid print context: ' + problems.join('; '));
  }

  Object.freeze(ctx.model);
  ctx.assumptions.forEach(Object.freeze);
  ctx.gaps.forEach(Object.freeze);
  ctx.outputs.forEach(Object.freeze);
  ctx.extra.forEach(Object.freeze);
  return Object.freeze(ctx);
}
