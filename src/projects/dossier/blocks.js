/* ---------------------------------------------------------------------------
   The block vocabulary a dossier may use.

   Dossiers are drawn by the SAME block engine as the market dashboards, which is
   what keeps a deal file looking like the rest of the platform and stops a
   second rendering lineage growing beside the first. The two attached prototype
   dashboards each carried their own CSS, their own SVG and their own chart code;
   none of that enters here. A dossier is data.

   BUT NOT THE WHOLE VOCABULARY. `createBlocks(ctx)` closes over a market engine —
   a market's formatters, its scorecard compute layer, its Investment Lab and its
   CSV exporters. A dossier has none of those: it is a document about one project,
   not a model of a market.

   So this builds the smallest context the PRESENTATIONAL blocks need, and makes
   the engine-dependent ones fail loudly rather than silently rendering nothing.
   A dossier author reaching for `labInputs` gets told why it is not available
   here, which is more useful than an empty div.

   Available: card, g2, g3, kpis, table, note, warn, p, cap, why, src, line, bar,
   wf, timeline, phases, gates, ladder, flow, ic, structure, sensGrid.
   --------------------------------------------------------------------------- */
import { createBlocks } from '../../markets/_shared/blocks.js';
import { fmtN, fmt1 } from '../../utils/formatting.js';

/** Blocks that need a market engine. Named so the failure explains itself. */
const ENGINE_ONLY = [
  'labInputs', 'labOut', 'labDuration', 'labSnaps',
  'exportCsv', 'exportJson', 'liveScore', 'stageProb',
];

function unsupported(name){
  return () => {
    throw new Error(
      `[dossier] the "${name}" block needs a market engine and is not available in a dossier. ` +
      'A dossier is a document about one project, not a model of a market — put the ' +
      'numbers in a table or a chart block instead.');
  };
}

/**
 * A block renderer for dossier sections.
 *
 * Deliberately built once per page rather than memoised at module scope: the
 * context closes over nothing mutable, and a module-level singleton would be one
 * more thing holding a reference to confidential content after navigation.
 */
export function dossierBlocks(){
  const engineOnly = Object.fromEntries(ENGINE_ONLY.map(n => [n, unsupported(n)]));

  return createBlocks({
    /* No seed tag: a dossier has no market build to stamp, and statusBadge()
       renders "Base case" / "Live feed pending" from the tag-free path. */
    MKT: { seedTag: '' },
    M: {},
    T: {},
    state: {},
    render: () => {},
    fmt: { fmtN, fmt1 },
    compute: {
      at: () => null,
      liveFactors: () => ({}),
      liveScore: engineOnly.liveScore,
      stageProb: engineOnly.stageProb,
    },
    lab: {
      blkLabInputs: engineOnly.labInputs,
      blkLabOutputs: engineOnly.labOut,
      blkLabDuration: engineOnly.labDuration,
      blkLabSnaps: engineOnly.labSnaps,
    },
    exports: {
      exportCsv: engineOnly.exportCsv,
      exportJson: engineOnly.exportJson,
    },
  });
}
