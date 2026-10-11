/* ---------------------------------------------------------------------------
   The scout cards, whole, with what the pass log says about them. A STUB.

   The real content is made at build time from view/scout/ by
   vite-plugin-scout.js. This file exists so plain Node can import the /scout
   page's modules in the test suite; the plugin replaces it in the dev server
   and in a build.

   Imported by the /scout page and by nothing else, so the cards are a chunk
   of their own that the home page never fetches.

   Everything on a card is public: a quotation from a public page, a grade
   against a published anchor, a verdict. A card has no private layer.
   --------------------------------------------------------------------------- */

export const SCOUT_DATA = { cards: {}, lastPass: {}, graduation: {}, streak: 0, passes: 0 };
