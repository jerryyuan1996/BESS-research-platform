/* Ireland's schematic geography (ie-01, ie-02, ie-12).

   A drawing convention, not a survey: two landmasses for the all-island
   system, one boundary between them, and abstract DC connectors. No landing
   point, cable route, interconnector capacity or coastline detail is claimed
   (GAP-IE-LINKS). Coordinates are drawing units inside a 600 x 420 viewBox. */

export const ISLAND = {
  viewBox: [600, 420],
  /* Rough, deliberately simplified outlines. */
  ireland: 'M196,196 L252,176 L300,198 L318,244 L306,300 L268,340 L226,352 L192,326 L180,276 L184,232 Z',
  northernIreland: 'M258,150 L310,140 L336,166 L330,196 L286,204 L254,186 Z',
  britain: 'M452,58 L512,44 L556,72 L566,132 L544,190 L556,244 L520,268 L486,240 L470,186 L438,150 L444,100 Z',
  france: 'M420,352 L486,338 L548,352 L556,394 L486,404 L430,392 Z',
  /* Two abstract DC connectors to Great Britain, and the planned Celtic link.
     Straight lines only: the drawing says "DC" and "planned", not where. */
  dc: [
    [[330, 178], [452, 150]],
    [[300, 236], [470, 210]],
  ],
  celtic: [[210, 336], [432, 372]],
  labels: {
    ireland: [214, 272],
    northernIreland: [286, 160],
    greatBritain: [500, 150],
    france: [486, 372],
  },
};

/** One closed path for the all-island system's outer edge, for a wash. */
export const ISLAND_WASH = ISLAND.ireland;
