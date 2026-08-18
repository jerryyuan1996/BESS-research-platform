/* ---------------------------------------------------------------------------
   Public stand-in for the confidential project dossiers.

   Same arrangement as payload.js and portfolioSection.js, generalised from one
   hardcoded section to N dossiers. In development, vite-plugin-local-data.js
   replaces this module's contents with an index built from local-data/dossiers/.
   In a build, and under plain Node, the empty array below is what callers get.

   WHY AN ARRAY AND NOT A MAP. The registry keys by slug, and a slug is data the
   dossier itself carries — putting it in the filename too would let the two
   disagree, and the one that renders in the URL would be the filename. One
   source for the slug, and it is the dossier.

   ABSENCE IS THE NORMAL CASE. In production it always is, and the whole public
   shell is built to be complete without a single dossier present: the portfolio
   list renders a withheld card, and /projects/<anything> is a 404 rather than an
   oracle confirming which codenames exist. See docs/data-policy.md.
   --------------------------------------------------------------------------- */

/** Confidential dossier modules. Empty unless the plugin has substituted them. */
export const DOSSIERS = [];

/** True only when the plugin has substituted real dossiers. */
export const AVAILABLE = false;

export default DOSSIERS;
