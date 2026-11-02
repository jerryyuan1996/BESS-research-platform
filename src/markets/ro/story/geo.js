/* Romania and Bulgaria as schematic shapes, in a 600 × 320 frame.
   These are drawing coordinates, not geography: no border length, no plant
   location, no interconnector count and no measured flow is encoded here, and
   the caption says so. The 600-unit frame matches the kit's stage width. */
export const FRAME = [600, 320];

export const ROMANIA = 'M150,66 L232,44 L306,58 L372,78 L424,104 L452,146 L468,186 L444,222 L392,242 L330,250 L262,244 L196,224 L160,192 L128,148 Z';
export const BULGARIA = 'M262,254 L330,258 L392,250 L444,230 L474,252 L456,292 L392,306 L318,308 L272,286 Z';
export const HUNGARY = 'M58,96 L148,70 L166,150 L158,196 L96,192 L60,150 Z';
export const SERBIA = 'M96,200 L158,200 L196,228 L186,262 L120,258 L92,232 Z';
export const MOLDOVA = 'M372,60 L440,86 L446,138 L404,150 L372,120 Z';
export const SEA = 'M480,120 L516,150 L520,236 L480,250 L470,190 Z';

/** The Danube along the southern border, then north-west. */
export const DANUBE = [[92,196],[140,204],[196,226],[262,246],[330,252],[392,244],[444,226],[468,214]];
/** The Carpathian arc: a schematic ridge, not a watershed boundary. */
export const CARPATHIANS = 'M196,158 Q246,96 314,112 Q356,146 336,196';
export const BLACK_SEA_LABEL = [498,196];

/** Neighbour labels, placed inside their shapes. */
export const NEIGHBOURS = [
  { key: 'hungary', at: [108,132] },
  { key: 'serbia', at: [142,232] },
  { key: 'bulgaria', at: [356,286] },
  { key: 'moldova', at: [404,100] },
];
