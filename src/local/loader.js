/* ---------------------------------------------------------------------------
   Confidential-data loader.

   Reads datasets placed in local-data/ at DEVELOPMENT time only. In any
   production build this returns null for every key, because the data is not in
   the bundle to return — see vite-plugin-local-data.js, which gives the build an
   empty module rather than trusting tree-shaking to remove a branch.

   The contract callers must respect, unchanged from when this was a stub:

       ABSENCE IS THE NORMAL CASE. In production it always is.

   So a caller never renders a confidential value without first asking whether it
   exists, and never does arithmetic on what it got back without checking. The
   surrounding code is built so the public layer stands on its own and the
   confidential layer is additive — not so that removing it leaves holes.

   What this is NOT: security. It keeps confidential data out of the public
   artefact, which is a different and achievable goal. Anyone with the repository
   and the local-data/ directory has the data. See docs/data-policy.md.
   --------------------------------------------------------------------------- */
import LOCAL, { AVAILABLE } from './payload.js';

const IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);

let warned = false;

/**
 * @param {string} key  dataset name, matching local-data/<key>.json
 * @returns {object|null} the parsed dataset, or null when it is not present
 */
export function loadLocal(key){
  const value = (LOCAL && Object.prototype.hasOwnProperty.call(LOCAL, key))
    ? LOCAL[key]
    : null;

  if (IS_DEV && value === null && !warned){
    warned = true;
    console.info(
      '[local] loadLocal(%o) found nothing. Place local-data/%s.json to load it in ' +
      'development. Production always returns null. See docs/data-policy.md.', key, key);
  }
  return value;
}

/** True when any confidential dataset is present. Always false in a build. */
export const hasLocalData = () => Boolean(AVAILABLE);

/**
 * True when one specific dataset is present.
 * Prefer this over hasLocalData() at a call site: a section should render on the
 * strength of the data it actually needs, not on whether some other file exists.
 */
export const hasLocal = (key) => loadLocal(key) !== null;

/**
 * Bilingual notice for a block whose confidential layer is absent.
 * Shared so every withheld block says the same thing, and so a reader can tell
 * "withheld" apart from "we have no data" — they are different statements.
 */
export const WITHHELD_NOTICE = [
  'Confidential layer withheld from the public build. The public market data above stands on its own.',
  '保密层未包含在公开构建中。上方公开市场数据独立成立。',
];
