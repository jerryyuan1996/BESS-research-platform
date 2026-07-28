/* ---------------------------------------------------------------------------
   Co-optimisation scenario tables and the third-party MJA scenario layer.
   Verbatim from the prototype (lines 3439-3485).

   MJA2026 is [REDACTED-REPORT] in the prototype and chart-reconstructed.
   NOTE: this file ships in the public production bundle. See docs/data-policy.md -
   nothing in src/ is private. Migrated as-is to preserve behaviour; flagged for
   the confidential-data phase.
   --------------------------------------------------------------------------- */


// ---------------- Investment Lab: RCM × Energy × FCESS co-optimisation (spec update) ----------------
const OPT = {
  scnParams: {
    HIGH: { rcpFactor: 1.00, ccRet: 0.98, refundBase: 1.5, avail: 98.5, merchScale: 0.9, shadow: 1.3, vol: 0.10 },
    BASE: { rcpFactor: 0.90, ccRet: 0.95, refundBase: 3.0, avail: 97.0, merchScale: 1.0, shadow: 1.0, vol: 0.14 },
    LOW:  { rcpFactor: 0.60, ccRet: 0.88, refundBase: 5.0, avail: 95.5, merchScale: 1.2, shadow: 0.6, vol: 0.20 },
  },
  scnLabel: { HIGH: ['High RCM', 'RCM高情景'], BASE: ['Base RCM', 'RCM基准情景'], LOW: ['Low RCM', 'RCM低情景'], CUSTOM: ['Custom', '自定义'] },
  strat: {
    RCM_FIRST:          { energy: 0.55, fcess: 0.55, refundMult: 0.4, cycles: 220, socBuf: 88, vol: 0.65, n: ['RCM First', 'RCM优先'] },
    BALANCED:           { energy: 1.00, fcess: 1.00, refundMult: 1.0, cycles: 300, socBuf: 62, vol: 1.00, n: ['Balanced Co-optimisation', '平衡协同优化'] },
    FCESS_PRIORITY:     { energy: 0.70, fcess: 1.60, refundMult: 1.1, cycles: 280, socBuf: 58, vol: 1.05, n: ['FCESS Priority', 'FCESS优先'] },
    MERCHANT_UPSIDE:    { energy: 1.50, fcess: 0.60, refundMult: 1.7, cycles: 400, socBuf: 42, vol: 1.55, n: ['Merchant Upside', '现货收益优先'] },
    SCARCITY_DEFENSIVE: { energy: 0.45, fcess: 0.80, refundMult: 0.3, cycles: 200, socBuf: 92, vol: 0.55, n: ['Scarcity Defensive', '紧缺防御模式'] },
  },
  stratOrder: ['RCM_FIRST', 'BALANCED', 'FCESS_PRIORITY', 'MERCHANT_UPSIDE', 'SCARCITY_DEFENSIVE'],
  // illustrative WA daily price shape (A$/MWh, solar-trough midday, evening ramp) and Peak ESR window
  price24: [42, 38, 35, 33, 32, 34, 45, 60, 40, 18, 5, -4, -6, -2, 8, 28, 70, 150, 205, 190, 120, 70, 55, 48],
  oblStart: 17, oblEnd: 21,
};
// ---- Third-party confidential scenario layer: [REDACTED-ADVISER] Associates, 27 Feb 2026 (MJA report) ----
// NEVER badged official. Values are chart-reconstructed from the confidential report; kept separate
// from the official SEED and calculated layers (spec §5.1). Do not expose in a public deployment.
const MJA2026 = {
  id: 'MJA_2026_EXPECTED_CASE', sourceName: '[REDACTED-ADVISER] Associates', reportTitle: 'Utility Scale Storage in the WEM',
  reportDate: '2026-02-27', confidentiality: '[REDACTED-REPORT]', priceBasis: ['June 2025 real A$', '2025年6月不变价 A$'],
  status: 'THIRD_PARTY_MODELLED', scope: ['Project-specific WEM expected case (3 BESS)', '项目层面WEM期望情景（3个BESS）'],
  draftBrcp: 491700,          // draft 2026 BRCP (6h basis) — NOT the official 488,500
  esrHours: 6,                // MJA assumed benchmark/requirement — NOT the current 7h
  projects: [
    { id: 'BESS1', region: ['Metro South', '南都会区'], loc: '[REDACTED-SITE]', cod: '2029-10-01', installedMW: 341.5, installedMWh: 1506.8, dsocMW: 250, hoursAtDsoc: 6.0273, network: 'LOW_CONSTRAINT', refurbYear: 15 },
    { id: 'BESS2', region: ['Metro South', '南都会区'], loc: '[REDACTED-SITE]', cod: '2029-10-01', installedMW: 170.7, installedMWh: 753.4, dsocMW: 125, hoursAtDsoc: 6.0273, network: 'LOW_CONSTRAINT', refurbYear: 15 },
    { id: 'BESS3', region: ['North', '北部区'], loc: '[REDACTED-SITE]', cod: '2030-10-01', installedMW: 341.5, installedMWh: 1506.8, dsocMW: 250, originalDsocMW: 500, hoursAtDsoc: 6.0273, network: 'MATERIAL_MW_NB_CONSTRAINT', refurbYear: 15 },
  ],
  assumptions: {
    coalRetire: { Collie: 2027, MujaD: 2031, Bluewaters: 2034 },
    durationPathHours: { '2028-29': 6, '2031-32': 8, '2035-36': 10, '2041-42': 12 },
    peakSurplusPct: 2.5, flexiblePremium: false, rocofTotalCostAM: 43, rocofBessMaxSharePct: 65,
    spreadEarly: 47, spreadLate: 75, capacityFactorPct: 25, avgStorageCF: { 2025: 4.5, '2032-36': 15.7 },
    revenueMix: { capacity: 52, energy: 44, essRocof: 4 },
  },
  // representative 2035 BESS1 gross→net reconciliation point (chart-reconstructed, §3.3)
  recon2035: { dsocMW: 250, cfPct: 23, dwp: 130, lwp: 79, spread: 50, rte: 90 },
  labPreset: { mw: 250, hours: 6.03, life: 30, ccPct: 100, rcpPct: 100, degr: 1.5 },
  grossNotNetWarning: ['Published "Energy Arbitrage" stack appears to be gross discharge sales; deduct charging cost, efficiency loss, degradation and fees before use as net margin.',
    '报告中“现货套利”栏目似为毛放电销售额；用作净收益前须扣除充电成本、效率损失、衰减及费用。'],
};

export { OPT, MJA2026 };
