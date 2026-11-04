/* ---------------------------------------------------------------------------
   BUILD ANY MARKET'S SECTIONS WITHOUT A BROWSER.

   The NEM pilot (tests/helpers/nem-sections.mjs) proved that a section
   specification can be fingerprinted: it is bilingual strings, numbers and
   block objects, not DOM, so it can be built in Node against the market's real
   dataset, formatters, compute layer and sponsor assumptions and serialised.

   This is the same harness, parameterised by market id, for the controlled
   rollout (P1-C). The api is deliberately the same shape as the pilot's, so a
   digest taken before a split and one taken after it describe the same thing.
   Two additions the four rollout markets need:

     T       the shared text table. Their overview sections read T.yoy; the
             engine builds it from BASE_TEXT plus the market's overrides.
     h       a deterministic stand-in for the DOM factory. Two `data` sections
             put `h('span', …)` badges inside a spec. The real h needs a
             document; this one returns a plain, serialisable description, and
             it is used identically on both sides of the split.

   Deliberately NOT the engine: createMarketEngine() also builds the header,
   the tab strip and the renderers, and it needs a browser.
   --------------------------------------------------------------------------- */
import { createHash } from 'node:crypto';
import { BASE_TEXT } from '../../src/markets/_shared/text.js';
import { createFormat } from '../../src/markets/_shared/format.js';
import { createCompute } from '../../src/markets/_shared/compute.js';
import { createLab } from '../../src/markets/_shared/lab.js';
import { createDesignFitBlock } from '../../src/markets/_shared/designFitBlock.js';
import { createBlocks } from '../../src/markets/_shared/blocks.js';
import { createExports } from '../../src/markets/_shared/exports.js';
import { bandFor } from '../../src/components/metricCard.js';
import { applySponsorDataset } from '../../src/comparison/sponsorAssumptions.js';

/** The api the engine hands a market's sections, minus everything only a render reads. */
export async function marketApi(id){
  const base = `../../src/markets/${id}/`;
  const { MKT } = await import(`${base}mkt.js`);
  const { SRC } = await import(`${base}sources.js`);
  const { M: RAW } = await import(`${base}data.js`);

  /* Priced exactly as the engine prices it: the sponsor's buying position is
     applied at that one boundary, so a fingerprint describes what the site
     publishes. */
  const M = applySponsorDataset(RAW);
  const state = { codYear: MKT.codDefault, scores: {}, lab: null };
  const ctx = {
    MKT, M, SRC, state, T: { ...BASE_TEXT },
    LS: { get(){ return null; }, set(){} },
    render(){},
    fmt: createFormat(MKT),
    compute: createCompute({ M, state }),
  };
  ctx.lab = createLab(ctx);
  ctx.designFit = createDesignFitBlock(ctx);
  ctx.exports = createExports(ctx);
  ctx.blocks = createBlocks(ctx);

  /* A market's grid map registers itself, as it does in the browser: the grid
     section's `geo-grid-map` block holds whatever the registry returned. A
     fingerprint taken without it would compare two nulls. Not every market in
     the lineage has one, and that is not an error. */
  try { await import(`${base}gridMapData.js`); } catch { /* no grid map */ }

  /* L returns the pair unchanged rather than one language, so a fingerprint
     covers the Chinese sentence as well as the English one. */
  return {
    L: (pair) => pair,
    h: (tag, attrs, ...kids) => ({ __h: true, tag, attrs: attrs ?? null, kids }),
    MKT, M, SRC, state, T: ctx.T, bandFor,
    ...ctx.fmt, ...ctx.compute, ...ctx.lab, ...ctx.blocks, ...ctx.exports,
  };
}

/**
 * Every section this market can draw, built.
 *
 * A market whose sections load on demand declares `loadAllSections(api)`; a
 * market whose sections are one static file does not. Both shapes are handled,
 * which is what lets the fixture be taken BEFORE the split with the same
 * harness that verifies it afterwards.
 */
export async function buildAllMarketSections(id, api){
  const mod = await import(`../../src/markets/${id}/sections.js`);
  if (typeof mod.loadAllSections === 'function') await mod.loadAllSections(api ?? await marketApi(id));
  const built = mod.buildSections(api ?? await marketApi(id));
  const sections = typeof built === 'function' ? built() : built;
  const out = {};
  for (const key of Object.keys(sections)) out[key] = sections[key];
  return out;
}

/**
 * One stable digest per section. Functions are serialised by their own source
 * text rather than dropped: a chart's yfmt is part of what a section says.
 * Whitespace is collapsed so re-indenting an extracted module is not a content
 * change. This is byte-for-byte the pilot's digest function.
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
