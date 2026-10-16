/* ---------------------------------------------------------------------------
   What to build, for the deep tabs, as data. WHAT PLAIN NODE SEES.

   Replaced on the dev server and in a build by vite-plugin-briefing.js with
   designProjection(briefing) written out as a literal: each market's build
   line and best design, and each route's best duration and band. A dashboard
   tab that names a duration reads this (src/markets/_shared/designAnswer.js)
   instead of the whole briefing. Here, for scripts and tests, it is worked
   out through the same two functions.
   --------------------------------------------------------------------------- */
import { briefingFromDisk } from './disk.js';
import { designProjection } from './model.js';

export const DESIGN = designProjection(await briefingFromDisk());
