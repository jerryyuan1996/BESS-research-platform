/* Shared original WA history inputs; values and the getter body are verbatim. */
export const HISTORY_SEED={asOf: '2026-07-26',
modelVersion: 'seed-1.3-wem-structure-nem-benchmark',
brcp2829: 488500,
rcp2728: 360700,
fleetMWh: 5140,
fleetMW: 1275,
get fleetAvgHours(){ return this.fleetMWh / this.fleetMW; },
esrYears: ['2024-25', '2025-26', '2026-27', '2027-28', '2028-29'],
esrPath: [4, 4, 4, 6, 7]};
export const HISTORY_WEM={cis: { tender2MW: 650, tender2MWh: 2600, tender2When:'Mar 2025',
    t56Projects: 10, t56GenGW: 1.886, t56StorageGWh: 3.683, t56InvestAbn: 5, t56Jobs: 7000, t56When:'2 May 2026',
    t6BessMW: 482, t6BessMWh: 3683 }};
