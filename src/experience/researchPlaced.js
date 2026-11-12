/* Research in context: the markets whose research is placed under the chapters
   of the market page, by the dashboard that owns the research.

   The placements themselves are src/experience/researchMap.js, which the page
   fetches only when a reader opens a disclosure. This is the one fact the page
   needs before that: whether to draw the closed disclosures at all. `across`
   says the market has research that spans the revenue mechanisms, which gets a
   disclosure of its own under WHY THE REVENUE EXISTS.

   tests/research-map.test.js holds this list to the map. */
export const RESEARCH_IN_CONTEXT = { nem: { across: false }, jp: { across: true } };

/** The entry for a registry market, or null when its research is not placed. */
export const researchPlaced = (market) => RESEARCH_IN_CONTEXT[market.manifest.dashboardId || market.manifest.id] || null;
