/* ---------------------------------------------------------------------------
   Public stand-in for a confidential section module.

   This file is real and resolvable by plain Node, which matters: the test suite
   imports the market registry, which reaches the WA dashboard, which reaches the
   Portfolio tab. An earlier version used a `virtual:` specifier here and broke
   every test that touched the registry, because a Vite virtual module does not
   exist outside Vite.

   In development, vite-plugin-local-data.js redirects imports of this path to
   `local-data/wa-portfolio-section.js` when that file is present. In a build, and
   in Node, the null export below is what callers get, and the public shim in
   markets/wa/sections/portfolio.js renders a withheld card instead.

   Keeping the substitution in the resolver rather than in a branch means the
   confidential module is never referenced by anything the bundler can see.
   --------------------------------------------------------------------------- */

/** Replaced by the local section in development. Null everywhere else. */
export const renderPortfolio = null;
