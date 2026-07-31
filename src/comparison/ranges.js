/* ---------------------------------------------------------------------------
   ASSUMPTION RANGES — the bounds a reader may move an input between.

   The home-page Investment Lab lets a reader retype every normalized economic
   input. Left unbounded that is a random-number generator: a user can produce a
   30% IRR for Romania and the page will render it without comment. A bound is
   what turns an editable field into an argument — it says what the evidence
   actually supports, and it says who says so.

   So a range is not a slider hint. It is governed data with the same status as
   the seed it surrounds, and it is declared by the MARKET, next to the economics
   it bounds, for the same reason every other market fact is: there is no
   `if (market === 'wa')` in this codebase, and there is not going to be one here.

       market/comparison.js  ──►  ranges  ──►  Investment Lab
                                 (this file supplies the vocabulary)

   HOW A BAND IS DERIVED. Two rules, and every declared band states which it used.

     SOURCED       both endpoints are named observations — two auction clears, a
                   published price ceiling, a regulator's correction factor before
                   and after a change. Preferred wherever the evidence is
                   two-sided. `band()` still guarantees the seed sits inside.

     DISPERSED     only one endpoint is observable, so the other is the seed moved
                   by DISPERSION. That figure is not invented: it is the width of
                   the 2026 European turnkey BESS market, €180-260/kWh installed
                   about a €220 midpoint, i.e. ±18%. Using one number everywhere
                   means a reader can discount all of them at once if they
                   disagree with it, which a per-input fudge factor would not
                   allow.

   Inputs with no market-specific published series — opex, degradation, optimiser
   fee — say so in their basis and carry a gate. They are the weakest bands on the
   page and are labelled that way rather than being quietly rounded.
   --------------------------------------------------------------------------- */

/** Width of the 2026 European turnkey band (€180-260/kWh about €220). */
export const DISPERSION = 0.18;

export const DISPERSION_NOTE = [
  'Where only one endpoint is observable the other is the seed ±18% — the width of the 2026 European turnkey market, €180–260/kWh installed about a €220 midpoint.',
  '当仅有一端可观测时，另一端取种子值±18% — 该幅度为2026年欧洲交钥匙市场的区间宽度：安装成本€180–260/kWh，中值€220。',
];

/**
 * A governed band around a seed.
 *
 * The seed is passed in rather than restated so the band cannot silently drift
 * away from the value it bounds, and so the widening arithmetic is applied by
 * this file instead of by hand in eight market files.
 *
 * @param {number} seed        the value declared in economics
 * @param {number|null} low    lowest sourced observation, or null if none
 * @param {number|null} high   highest sourced observation, or null if none
 * @param {object} meta        { basis:[en,zh], source, gate }
 */
export function band(seed, low, high, meta = {}){
  const meta_ = { basis: meta.basis || null, source: meta.source || null, gate: meta.gate || null };

  /* Two observations that already contain the seed ARE the band. Widening them
     to a fixed ±18% would throw away exactly the precision the evidence gives —
     GB's toll band of £70-80k/MW/yr is a tighter statement than ±18% of the
     midpoint, and it should stay tighter. */
  if (low != null && high != null && low <= seed && seed <= high){
    return { seed, min: low, max: high, kind: 'sourced', ...meta_ };
  }

  const floor = seed * (1 - DISPERSION);
  const ceil = seed * (1 + DISPERSION);
  return {
    seed,
    min: Math.min(low == null ? floor : low, floor),
    max: Math.max(high == null ? ceil : high, ceil),
    /* One end observed, the other dispersed — which happens whenever the seed
       sits outside the published range, and that is itself worth seeing. */
    kind: (low != null || high != null) ? 'part-sourced' : 'dispersed',
    ...meta_,
  };
}

/**
 * A band whose endpoints are hard limits rather than observations — a percentage
 * that cannot exceed 100, a contract length the scheme does not offer, a
 * step-down factor bounded by nothing at all above 1. No widening is applied:
 * these are the limits, not an estimate of them.
 */
export function limits(seed, min, max, meta = {}){
  return {
    seed, min, max,
    /* Defaults to 'limit' — a rule, not an estimate. A declaration overrides it
       where the endpoints happen to be observations that simply must not be
       widened (SOFR, the reported gearing ceilings) or an unsourced analyst
       band that should be labelled as one. */
    kind: meta.kind || 'limit',
    basis: meta.basis || null,
    source: meta.source || null,
    gate: meta.gate || null,
  };
}

/* ---------------------------------------------------------------------------
   The editable surface.

   One catalogue for every market. A field appears in the Lab only if the market
   declares a range for it, which is how Romania (no capacity mechanism) and
   Japan (an auction-renewal risk class with a different revenue shape) get the
   right form without anybody testing a market id.

   `unit` drives formatting and the input step, nothing else:
     cur   market currency per MW (per year where the field is a revenue)
     pct   already a percentage, e.g. 20 for 20%
     frac  a 0-1 factor shown as a percentage
     yr    whole years
   --------------------------------------------------------------------------- */
export const LAB_GROUPS = [
  { id: 'capital', title: ['Capital', '资本开支'] },
  { id: 'contracted', title: ['Contracted revenue', '合同化收入'] },
  { id: 'market', title: ['Market revenue', '市场化收入'] },
];

export const LAB_FIELDS = [
  { key: 'capexPerMW', group: 'capital', unit: 'cur',
    label: ['Capex per MW', '每MW资本开支'] },
  { key: 'grantPct', group: 'capital', unit: 'pct',
    label: ['Capital grant, % of capex', '资本补贴占造价%'] },
  { key: 'opexPerMW', group: 'capital', unit: 'cur',
    label: ['Fixed opex per MW/yr', '每MW/年固定运维'] },

  { key: 'contracted', group: 'contracted', unit: 'cur',
    label: ['Contracted revenue per MW/yr', '每MW/年合同化收入'] },
  { key: 'contractYears', group: 'contracted', unit: 'yr',
    label: ['Contract length', '合同年限'] },
  { key: 'postFactor', group: 'contracted', unit: 'frac',
    label: ['Revenue retained after expiry', '到期后收入留存比例'] },

  /* Auction-renewal markets separate the executed award from the years that must
     be re-won. Both are editable; the renewal curve is not, because it is a
     scenario rather than a number. */
  { key: 'securedContracted', group: 'contracted', unit: 'cur',
    label: ['Secured award per MW/yr', '每MW/年已锁定中标金额'] },
  { key: 'securedContractYears', group: 'contracted', unit: 'yr',
    label: ['Years secured', '已锁定年限'] },
  { key: 'ltda.payment', group: 'contracted', unit: 'cur',
    label: ['Long-term award per MW/yr', '每MW/年长期中标金额'] },

  { key: 'toll', group: 'contracted', unit: 'cur',
    label: ['Toll fee per MW/yr', '每MW/年租赁费'] },
  { key: 'tollYears', group: 'contracted', unit: 'yr',
    label: ['Toll tenor', '租赁期限'] },

  { key: 'merchGross', group: 'market', unit: 'cur',
    label: ['Merchant revenue per MW/yr, gross', '每MW/年市场化收入（毛）'] },
  { key: 'feePct', group: 'market', unit: 'pct',
    label: ['Optimiser fee, % of market revenue', '优化商费用占市场化收入%'] },
  { key: 'services', group: 'market', unit: 'cur',
    label: ['System services per MW/yr', '每MW/年系统服务收入'] },
  { key: 'naqFactor', group: 'market', unit: 'frac',
    label: ['Network access retained', '电网接入headroom留存'] },
  { key: 'degr', group: 'market', unit: 'pct',
    label: ['Merchant degradation, %/yr', '市场化收入年衰减%'] },
];

const FIELD_BY_KEY = new Map(LAB_FIELDS.map(f => [f.key, f]));
export const labField = (key) => FIELD_BY_KEY.get(key) || null;

/** Reads a possibly dotted path — `ltda.payment` — off an economics object. */
export function readPath(obj, path){
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

/**
 * The fields a market actually exposes: declared range, and a value to bound.
 * Order follows LAB_FIELDS so every market's form reads the same way.
 */
export function labFieldsFor(market){
  const ranges = market?.comparison?.ranges || {};
  const econ = market?.comparison?.economics || {};
  return LAB_FIELDS
    .filter(f => ranges[f.key] && readPath(econ, f.key) != null)
    .map(f => ({ ...f, range: ranges[f.key], value: readPath(econ, f.key) }));
}

/* ---------------------------------------------------------------------------
   Financing conventions.

   Split deliberately. The PRICED inputs are observations that move with the
   market and are editable inside their observed range. The coverage tests,
   tranche split, tenor caps and rollover allowance are METHODOLOGY — they encode
   how a lender sizes rather than what a lender charges — and stay human-set, as
   src/economics/projectDebt.js says they do.
   --------------------------------------------------------------------------- */
export const DEBT_FIELDS = [
  { key: 'baseRate', unit: 'frac', label: ['Base rate', '基准利率'] },
  { key: 'margin', unit: 'frac', label: ['Senior margin', '优先级债务利差'] },
  { key: 'maxGearingSecured', unit: 'frac', label: ['Gearing ceiling — contracted', '杠杆上限 — 合同化'] },
  { key: 'maxGearingMarket', unit: 'frac', label: ['Gearing ceiling — merchant', '杠杆上限 — 市场化'] },
];

export const DEBT_RANGES = {
  baseRate: limits(0.0365, 0.030, 0.045, {
    kind: 'sourced',
    basis: [
      'SOFR was 3.65% on 29 July 2026 and 3.57% on 20 July, down from 4.34% in August 2025. The band spans the 2025–26 observed range with room either side of it.',
      'SOFR于2026年7月29日为3.65%、7月20日为3.57%，较2025年8月的4.34%下行。该区间覆盖2025–26年实测范围并留有余地。',
    ],
    source: 'Federal Reserve Bank of New York, SOFR reference rates',
  }),
  margin: limits(0.0225, 0.0200, 0.0250, {
    kind: 'dispersed',
    basis: [
      'The weakest input on the page. BESS-specific senior margins are not publicly quoted; 200–250bp is an assumption band, not an observation, and every levered IRR moves with it.',
      '本页最薄弱的输入。储能项目优先级债务利差无公开报价；200–250个基点为假设区间而非实测值，本页所有杠杆后IRR均随之变动。',
    ],
    source: 'Assumption band — no public quotation found (searched July 2026)',
    gate: 'G10',
  }),
  maxGearingSecured: limits(0.75, 0.60, 0.75, {
    kind: 'sourced',
    basis: [
      'Reported gearing for contracted BESS runs 60–75%; the 80–85% seen in mature solar and wind is rare. The ceiling is the top of the reported band and coverage usually binds before it.',
      '合同化储能的市场杠杆区间为60–75%；成熟光伏风电的80–85%极为罕见。上限取区间顶部，且通常覆盖倍数先于其约束。',
    ],
    source: 'Modo European BESS Capital Markets Q1 2026; BBDF 2026 finance panel',
  }),
  maxGearingMarket: limits(0.60, 0.50, 0.60, {
    kind: 'sourced',
    basis: [
      'Merchant BESS gearing is reported at 50–60%. Lenders do finance merchant assets, but through mini-perms and tighter coverage rather than more debt.',
      '市场化储能杠杆区间为50–60%。贷款人确实为市场化资产融资，但采用短期过桥结构与更严格的覆盖倍数，而非提高杠杆。',
    ],
    source: 'Modo European BESS Capital Markets Q1 2026',
  }),
};

/** Clamp a typed value into its band. Returns the seed for anything unparseable. */
export function clampToRange(value, range){
  if (range == null) return value;
  if (!Number.isFinite(value)) return range.seed;
  return Math.min(range.max, Math.max(range.min, value));
}

/** True when the value has been moved off its seed by more than rounding. */
export function isMoved(value, range){
  if (range == null || !Number.isFinite(value)) return false;
  const scale = Math.abs(range.seed) || 1;
  return Math.abs(value - range.seed) / scale > 1e-9;
}
