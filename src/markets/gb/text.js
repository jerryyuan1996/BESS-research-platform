/* ---------------------------------------------------------------------------
   Great Britain 鈥?market-specific UI string overrides, verbatim from the
   prototype (lines 1325-1327).

   The prototype did Object.assign(T, {...}) at module scope; the engine now
   merges these over the shared BASE_TEXT instead, so one market's override
   cannot leak into another.
   --------------------------------------------------------------------------- */

export const textOverrides = {
  srcHealth: ['Source health: base case — public sources refreshed Jul 2026, automated checks not yet running', '数据源状态：基准情景 — 公开来源已于2026年7月刷新，自动检测尚未运行'],
};