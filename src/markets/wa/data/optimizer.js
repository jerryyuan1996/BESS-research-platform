/* ---------------------------------------------------------------------------
   Co-optimisation scenario tables (public) + the third-party MJA scenario layer
   (confidential, loaded only in development).

   OPT is the Investment Lab's own scenario configuration — RCM/energy/FCESS
   weightings, strategy definitions and an illustrative WA daily price shape. It
   is this platform's modelling, not anyone else's material, and it is public.

   MJA2026 is chart-reconstructed from a confidential third-party consultant
   report. The prototype's comment read "Do not expose in a public deployment",
   and it then shipped in the public bundle for the whole of the refactor. It now
   lives in `local-data/wa-mja2026.json`.

   Callers must branch on `hasMjaData` before reading MJA2026. In production it is
   null.
   --------------------------------------------------------------------------- */
import { loadLocal } from '../../../local/loader.js';

// ---------------- Investment Lab: RCM × Energy × FCESS co-optimisation ----------------
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

/* ---- Third-party confidential scenario layer ------------------------------
   Never badged official. In production this is null and every consumer renders
   its public content only. */
const MJA2026 = loadLocal('wa-mja2026');

/** True when the confidential MJA layer is available. Always false in a build. */
export const hasMjaData = MJA2026 !== null;

export { OPT, MJA2026 };
