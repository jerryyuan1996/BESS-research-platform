/* ---------------------------------------------------------------------------
   Confidential-data loader — STUB. Not implemented; see ./README.md.

   Deliberately does nothing rather than doing something plausible. A loader that
   appeared to work would invite callers to depend on data that can only ever be
   present in development, and would tempt someone into shipping it.

   Callers must treat absence as the normal case: in production it always is.
   --------------------------------------------------------------------------- */

const IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);

let warned = false;

/**
 * @param {string} key  logical dataset name, e.g. 'projects'
 * @returns {null} always — the interface is not built
 */
export function loadLocal(key){
  if (IS_DEV && !warned){
    warned = true;
    console.info(
      '[local] loadLocal(%o): the confidential-data interface is not implemented. ' +
      'See src/local/README.md and docs/data-policy.md.', key);
  }
  return null;
}

/** True when confidential data could be available at all. Always false today. */
export const hasLocalData = () => false;
