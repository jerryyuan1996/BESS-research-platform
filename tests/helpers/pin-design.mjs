/* ---------------------------------------------------------------------------
   RENDER SECTIONS AGAINST THE PINNED DESIGN ANSWER, NOT TODAY'S.

   Import this BEFORE anything that loads src/briefing/designData.js, and load
   the section harness with a dynamic import() after it: a static sibling
   import is resolved before this module runs.

   From then on, in this process only, every import of
   src/briefing/designData.js resolves to tests/helpers/pinned-design.mjs,
   which exports the DESIGN recorded in tests/fixtures/sections-design-vintage.json
   (see scripts/pin-section-design.mjs for why and how it was taken). The site
   and the build are untouched.
   --------------------------------------------------------------------------- */
import * as nodeModule from 'node:module';

export const PINNED_URL = new URL('./pinned-design.mjs', import.meta.url).href;
const TARGET = '/src/briefing/designData.js';

if (typeof nodeModule.registerHooks === 'function'){
  /* Node 22.15+ and 23.5+: synchronous, in-thread hooks. */
  nodeModule.registerHooks({
    resolve(specifier, context, nextResolve){
      const resolved = nextResolve(specifier, context);
      return resolved.url.endsWith(TARGET) ? { ...resolved, url: PINNED_URL, shortCircuit: true } : resolved;
    },
  });
} else {
  /* Node 22.12–22.14 (the engines floor): the older off-thread hooks. */
  nodeModule.register('./pin-design-hooks.mjs', import.meta.url, { data: { pinnedUrl: PINNED_URL, target: TARGET } });
}
