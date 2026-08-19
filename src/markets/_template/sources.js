/* ---------------------------------------------------------------------------
   TEMPLATE — source register.

   Each market keeps its sources next to the market, not in a central file and
   never inside a presentation component (brief section 20).

   Rendering is shared: components/sourceDrawer.js turns these entries into
   "Source & status" drawers and quality badges. You supply data, not markup.
   --------------------------------------------------------------------------- */

export const sources = {
  regulatorDetermination: {
    file: 'Regulator — 2028 capacity price determination',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},   // drives the quality badge
    date: '1 January 2026',                        // as printed on the source
    cy: '2028-29',                                 // period the figure applies to
    url: 'https://example.org/determination',
    // quality: 'final',   // optional explicit badge key, overrides status inference
  },

  tsoOutlook: {
    file: 'TSO — capacity adequacy outlook',
    status: ['Official — Draft', '官方 — 草案'], provenance:{authority:'official',publication:'draft',availability:'public',verification:'verified'},
    date: '1 March 2026',
    cy: '2026-2035',
    url: 'https://example.org/outlook',
  },
};

export default sources;
