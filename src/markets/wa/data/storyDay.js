/* ---------------------------------------------------------------------------
   CALC-WA-DAY: the representative day behind the WA story's wa-05 and wa-06.

   The median business day of the 2025-26 Hot Season, from AEMO WEM public data,
   signed off at G-1 on 30 October 2026. The calculation record is in
   docs/immersive-experience-plan/source-register.md (Calculation records).

     grid      Unscheduled Operational Demand, MW: what the grid itself supplies,
               without large-scale battery charging (AEMO 2026 ESOO, §1.6.1)
     rooftop   Estimated DPV Generation, MW
     method    mean of the six 5-minute values in each 30-minute Trading
               Interval (labelled by its start, AWST, UTC+8, no daylight
               saving), then the median across 82 business days, 1 December
               2025 to 31 March 2026, weekends and WA public holidays excluded

   A median profile, not one observed day, and not a forecast. Refresh after a
   Hot Season by re-running the recorded method; keep the earlier vintage.
   --------------------------------------------------------------------------- */

export const WA_STORY_DAY = {
  id: 'CALC-WA-DAY',
  vintage: 'Hot Season 2025-26',
  days: 82,
  timezone: 'AWST (UTC+8)',
  source: {
    name: 'AEMO WEM data: Operational Demand and Withdrawal; Estimated DPV',
    url: 'https://data.wa.aemo.com.au/public/public-data/datafiles/',
    licence: 'AEMO copyright permissions: any use with accurate attribution',
    extracted: ['2026-07-30', '2026-06-26', '2026-10-30'],
  },
  /* 48 Trading Intervals, 00:00 to 23:30, each labelled by its start. */
  gridMW: [
    2032.6, 1982.5, 1951.0, 1915.9, 1890.2, 1870.3, 1869.5, 1850.7,
    1863.7, 1884.6, 1945.9, 1965.6, 2035.3, 2055.8, 2029.7, 1902.3,
    1791.8, 1686.7, 1610.3, 1526.9, 1484.2, 1432.1, 1423.2, 1463.0,
    1489.4, 1547.1, 1589.9, 1697.2, 1802.7, 1905.2, 2034.9, 2215.2,
    2408.1, 2617.7, 2765.0, 2855.2, 2893.6, 2908.0, 2871.1, 2806.4,
    2740.3, 2646.3, 2545.1, 2453.9, 2350.0, 2258.4, 2190.4, 2112.0
  ],
  rooftopMW: [
    0.8, 0.7, 0.6, 0.6, 0.5, 0.5, 0.6, 0.6,
    0.6, 0.6, 1.3, 2.5, 47.3, 168.3, 352.5, 597.2,
    859.3, 1118.0, 1346.8, 1559.2, 1741.3, 1865.0, 1958.5, 2005.9,
    2026.5, 2029.8, 2010.6, 1991.5, 1931.4, 1833.7, 1693.0, 1510.5,
    1270.2, 1004.0, 736.8, 485.1, 268.6, 108.2, 14.3, 2.2,
    1.7, 1.3, 1.1, 1.0, 0.9, 0.9, 0.9, 0.8
  ],
};

/* The 2028-29 obligation window for storage first credited in the 2026
   cycle, summer business days, as AEMO printed it: Trading Intervals starting
   15:30 to 22:00, so 15:30 to 22:30 on the clock (2026 ESOO, Table 28, p. 81).
   The ESM Rules' Peak ESROD definition would put it one interval later
   (CF-WA-02); AEMO sets the exact intervals each Trading Day. */
export const WA_OBLIGATION_WINDOW = {
  firstInterval: '15:30', lastInterval: '22:00', capacityYear: '2028-29',
  source: 'AEMO, 2026 WEM Electricity Statement of Opportunities, Table 28',
};
