/* ---------------------------------------------------------------------------
   The ESR Duration Requirement by Reserve Capacity Cycle, in Trading Intervals
   (30 minutes each) and hours. Its own small module so the WA research story
   tab (data/rcmHistory.js) and the market story (storyBindings.js) read one
   table without the story loading the whole RCM history.

   Sources: AEMO 2026 WEM ESOO, Table 24 (p. 75) and p. 78; ESM Rules,
   Peak Electric Storage Resource Obligation Duration.
   --------------------------------------------------------------------------- */
export const ESR_REQUIREMENT = [
  { cyc:['≤ 2024 Reserve Capacity Cycle','2024及之前容量周期'], ti:8,  h:4, note:['Grandfathered for credits already allocated','已获配信用适用祖父条款'] },
  { cyc:['2025 cycle → 2027-28','2025周期 → 2027-28'],        ti:12, h:6, note:['First increase; 4 h fleet begins to be de-rated','首次上调；4小时机组开始折减'] },
  { cyc:['2026 cycle → 2028-29','2026周期 → 2028-29'],        ti:14, h:7, note:['Current requirement — longer, flatter evening peak','现行要求 — 晚峰更长更平'] },
];
