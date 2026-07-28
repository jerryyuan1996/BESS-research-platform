/* Barrel for the shared chart library — one implementation, used by every market
   and by the home cockpit. See docs/migration-notes.md section 2 for the diff
   proving these were byte-identical across all six prototype programs. */
export { lineChart } from './lineChart.js';
export { barChart } from './barChart.js';
export { waterfall } from './waterfallChart.js';
export { bandChart } from './bandChart.js';
export { scatterChart } from './scatterChart.js';
export { S, niceTicks, roundTopRect, roundBotRect, legendRow, SVGNS } from './chartUtils.js';
export { axisText } from './axes.js';
