/* ---------------------------------------------------------------------------
   Public stand-in for the confidential dataset payload.

   A real, Node-resolvable module — deliberately, not a `virtual:` specifier. The
   test suite imports the market registry, which reaches the WA data modules,
   which reach the loader; a Vite virtual module does not exist outside Vite and
   broke every one of those tests with ERR_UNSUPPORTED_ESM_URL_SCHEME.

   In development, vite-plugin-local-data.js replaces this module's contents with
   the parsed JSON from local-data/. In a build, and under plain Node, the empty
   defaults below are what callers get — which is the same thing the loader
   promises: absence is the normal case.
   --------------------------------------------------------------------------- */

/** Keyed by filename stem, e.g. LOCAL['wa-mja2026']. Empty unless replaced. */
export default {};

/** True only when the plugin has substituted real payloads. */
export const AVAILABLE = false;
