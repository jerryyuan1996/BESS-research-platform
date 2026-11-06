/* Original research values, shared with data.js. No evaluated copy.
   Extracted verbatim from 247ce950c5c0db42fbe6125c7adb44eef6c8f552:src/markets/gb/data.js. */

export const HISTORY_DATA={asOf:'2026-07-29',
dataDate:'FES 2025 / TEC 29 Jul 2026 / TTM Apr 2026 / DY 2029-30',
modelVersion:'gb-governed-2.0-fes-tec',
realisedRatio:{ fleetMedian: 0.82, strong: 0.92, weak: 0.65 },
cmYears:['24/25', '25/26', '26/27', '27/28', '28/29', '29/30'],
t4Series:[18.00, 30.59, 63.00, 65.00, 60.00, 27.10],
derateHours:[1, 2, 4, 6, 8, 10, 12],
derateVintages:{
    'T-4 2028/29': [0.1047, 0.2094, 0.4174, 0.6267, 0.8347, 0.9299, 0.9299],
    'T-4 2029/30': [0.1099, 0.2198, 0.4396, 0.6608, 0.8777, 0.9216, 0.9216],
  },
official:{t4DY: '2029/30',
t4Price: 27.10,
t4AwardedMW: 40108.6,
ldesWindow1Projects: 16}};



export const HISTORY_FORMAT={locale: 'en-GB',cur: '£'};
