/* Schematic layout only: no map, power flow or investment sites.
 * Shared kit symbols carry Germany's changing supply and connection layers. */
export const GRID = {
  view: { viewBox: [640, 340], origin: [320, 32] },
  ground: { symbol: 'ground', at: [0, 0], opts: { w: 18, d: 14 } },
  plant: [1, 10], wind: [[3, 2], [6, 1]], solar: [2, 5],
  pylons: [[6, 10], [9, 7]], substation: [11, 5],
  city: [15, 1], homes: [[14, 5], [15, 8]], battery: [8, 11], booster: [2, 1],
  wires: [[[4, 11], [6, 10]], [[6, 10], [9, 7]], [[9, 7], [12, 6]]],
};
export const HISTORY_SHOTS = ['de-02', 'de-03', 'de-04', 'de-05', 'de-07', 'de-11'];
export const HISTORY_IDS = ['H-DE-01', 'H-DE-02', 'H-DE-03', 'H-DE-04', 'H-DE-05', 'H-DE-06'];
