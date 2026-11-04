/* ---------------------------------------------------------------------------
   BUILD A MARKET'S SECTIONS WITHOUT A BROWSER.

   A section specification is data: bilingual strings, numbers, block objects.
   It is not DOM until `blocks.B()` draws it. So the whole of a market's
   analytical content can be built in Node — against the market's real dataset,
   the real formatters and the real compute layer — and serialised.

   That is what makes a content fingerprint possible, and the fingerprint is
   what makes a refactor of section code reviewable: extraction into modules,
   an asynchronous loader, a renamed file — none of them may move a number, a
   source reference or a Chinese sentence. tests/nem-section-parity.test.js
   holds the National Electricity Market to exactly that, and the fixture it
   compares against was taken from the single-file implementation before it was
   split (docs/p1-sections-pilot.md).

   Deliberately NOT the engine: createMarketEngine() also builds the header,
   the tab strip and the renderers, and it needs a browser. This is the
   smallest api a section actually reads.
   --------------------------------------------------------------------------- */
import { createHash } from 'node:crypto';
import { MKT } from '../../src/markets/nem/mkt.js';
import { SRC } from '../../src/markets/nem/sources.js';
import { M as RAW } from '../../src/markets/nem/data.js';
import { createFormat } from '../../src/markets/_shared/format.js';
import { createCompute } from '../../src/markets/_shared/compute.js';
import { createLab } from '../../src/markets/_shared/lab.js';
import { createDesignFitBlock } from '../../src/markets/_shared/designFitBlock.js';
import { createBlocks } from '../../src/markets/_shared/blocks.js';
import { createExports } from '../../src/markets/_shared/exports.js';
import { bandFor } from '../../src/components/metricCard.js';
import { applySponsorDataset } from '../../src/comparison/sponsorAssumptions.js';
/* The grid map registers itself, as it does in the browser: the grid section's
   `geo-grid-map` block holds whatever the registry returned, so a parity test
   that skipped this would compare two nulls and prove nothing about the map. */
import '../../src/markets/nem/gridMapData.js';

/** The api the engine hands a market's sections, minus everything only a render reads. */
export function nemApi(){
  /* Priced exactly as the engine prices it: the sponsor's buying position is
     applied at that one boundary, and a fingerprint taken before it would not
     describe what the site publishes. */
  const M = applySponsorDataset(RAW);
  const state = { codYear: MKT.codDefault, scores: {}, lab: null };
  const ctx = {
    MKT, M, SRC, state, T: {},
    LS: { get(){ return null; }, set(){} },
    render(){},
    fmt: createFormat(MKT),
    compute: createCompute({ M, state }),
  };
  ctx.lab = createLab(ctx);
  ctx.designFit = createDesignFitBlock(ctx);
  ctx.exports = createExports(ctx);
  ctx.blocks = createBlocks(ctx);
  /* L returns the pair unchanged rather than one language, so a fingerprint
     covers the Chinese sentence as well as the English one. */
  return {
    L: (pair) => pair,
    MKT, M, SRC, state, bandFor,
    ...ctx.fmt, ...ctx.compute, ...ctx.lab, ...ctx.blocks, ...ctx.exports,
  };
}

/**
 * Every section this market can draw, built.
 *
 * A market whose sections load on demand declares `loadAllSections(api)`; a
 * market whose sections are one static file does not, which is why this works
 * for both shapes and the parity test could be written before the split ran.
 */
export async function buildAllNemSections(api = nemApi()){
  const mod = await import('../../src/markets/nem/sections.js');
  if (typeof mod.loadAllSections === 'function') await mod.loadAllSections(api);
  const built = mod.buildSections(api);
  const sections = typeof built === 'function' ? built() : built;
  const out = {};
  for (const id of Object.keys(sections)) out[id] = sections[id];
  return out;
}

/**
 * One stable digest per section.
 *
 * Functions are serialised by their own source text rather than dropped: a
 * chart's `yfmt` is part of what a section says, and replacing it with a
 * placeholder would let a formatting change through unnoticed. Whitespace is
 * collapsed so that re-indenting an extracted module is not a content change.
 */
export function digests(sections){
  const out = {};
  for (const id of Object.keys(sections).sort()){
    const text = JSON.stringify(sections[id], (_key, value) =>
      typeof value === 'function' ? 'fn:' + value.toString().replace(/\s+/g, ' ') : value);
    out[id] = { bytes: text.length, sha: sha256(text) };
  }
  return out;
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
