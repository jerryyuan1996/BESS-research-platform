/* ---------------------------------------------------------------------------
   CONGESTION — a constraint, what a battery can earn from it, and when it ends.

   Every market on this platform has somewhere the network cannot move power
   that somebody wants moved. That is an investment opportunity, and it is the
   only revenue on this platform with a PUBLISHED EXPIRY DATE: the relief project
   is named, funded, and its own business case is usually the constraint saving
   itself. NESO values 2030 network delivery at £13.1bn of lifetime constraint
   savings — which is the same sentence as "£13.1bn of congestion revenue that
   will not exist".

   So a congestion entry is not a map annotation. It is a pair:

       the constraint          volume, cost, direction, and where it binds
       the thing that ends it  named project, operator, scope, expected date

   and between them, the question that decides whether it is investable at all:

       CAPTURE MECHANISM — how does a battery actually get paid for it?

   That is where these six markets differ most, and where the naive version of
   this analysis goes wrong. A constraint is not revenue unless a mechanism pays
   somebody to relieve it. Great Britain rejected zonal pricing in July 2025, so
   GB congestion never reaches the wholesale price and can only be captured
   through the Balancing Mechanism. Poland pays regulated compensation below the
   generator's actual loss. Ireland's binding constraint is a unit-commitment
   rule rather than a wire, so no amount of steel relieves it. Romania prices
   congestion at the CONNECTION stage through capacity auctions, which means it
   is a cost to the developer rather than a revenue to the operator.

   Deliberately absent: a modelled congestion revenue per MW. Nothing public
   supports one in any of these markets, and inventing one would put a number
   into the Investment Lab that no source could ever close. It is a named gate
   instead — see docs/external-view.md, G14.
   --------------------------------------------------------------------------- */

/**
 * How a battery gets paid for relieving a constraint. This is the field that
 * decides investability, so it is a controlled vocabulary rather than prose:
 * two markets claiming the same mechanism must mean the same thing.
 */
export const CAPTURE = {
  /** Dispatched and paid inside a balancing / redispatch market. */
  BALANCING: 'balancing',
  /** Non-market redispatch instruction with regulated compensation. */
  REGULATED_COMPENSATION: 'regulated-compensation',
  /** The constraint is an operational rule, not a wire — relief is a rule change. */
  UNIT_COMMITMENT: 'unit-commitment',
  /** Priced at the connection stage. A cost to the developer, not a revenue. */
  ACCESS_AUCTION: 'access-auction',
  /** Curtailment under an administered output-control regime. */
  OUTPUT_CONTROL: 'output-control',
  /** Shows up in capacity accreditation rather than in energy. */
  CAPACITY_ACCREDITATION: 'capacity-accreditation',

  /* No mechanism at all. The asset is constrained off and receives nothing —
     value exists only indirectly, by charging into the prices the constraint
     creates. The NEM is the case this exists for: generators and storage hold no
     firm transmission rights, and the Congestion Relief Market that would have
     paid for relief was recommended not to proceed. A vocabulary with no way to
     say "nobody pays for this" would have forced the NEM into a category that
     implies somebody does. */
  UNCOMPENSATED: 'uncompensated',

  /* A settlement multiplier rather than an event: every megawatt-hour is scaled
     by a locational loss factor, so the constraint is charged continuously and
     invisibly rather than during a constrained period. */
  LOSS_FACTOR: 'loss-factor',

  /* The constraint reaches the wholesale price directly, because the market
     settles by zone. Italy is the case this exists for, and it is the exact
     thing Great Britain and Germany each voted not to have in 2025: where they
     socialise congestion, an Italian battery captures it by sitting on the
     expensive side of a zonal boundary and doing nothing else. Distinct from
     BALANCING, which requires a dispatch instruction. */
  ZONAL_PRICE: 'zonal-price',

  /* The operator is PAID to relieve the constraint, in an auction it can win,
     at a price the buyer publishes by zone. Terna's MACSE is the case this
     exists for: the requirement was set at zero GWh in the North and the whole
     first tranche in the south and the islands, with Sicily clearing 30% above
     the southern mainland for the same product. The mirror image of
     ACCESS_AUCTION — same instrument shape, opposite money flow — and the
     reason that one is not reused here. */
  LOCATIONAL_PROCUREMENT: 'locational-procurement',
};

export const CAPTURE_LABEL = {
  [CAPTURE.BALANCING]: ['Balancing market', '平衡机制'],
  [CAPTURE.REGULATED_COMPENSATION]: ['Regulated compensation', '受管制补偿'],
  [CAPTURE.UNIT_COMMITMENT]: ['Operational rule', '运行规则'],
  [CAPTURE.ACCESS_AUCTION]: ['Connection auction', '并网权拍卖'],
  [CAPTURE.OUTPUT_CONTROL]: ['Output control', '出力控制'],
  [CAPTURE.CAPACITY_ACCREDITATION]: ['Capacity accreditation', '容量认定'],
  [CAPTURE.UNCOMPENSATED]: ['No compensation', '无补偿机制'],
  [CAPTURE.LOSS_FACTOR]: ['Loss factor', '边际损耗系数'],
  [CAPTURE.ZONAL_PRICE]: ['Zonal price', '分区电价'],
  [CAPTURE.LOCATIONAL_PROCUREMENT]: ['Zonal procurement', '分区采购'],
};

/**
 * Which way the money runs.
 *
 * Three states, not two. The first version of this file carried a boolean —
 * pays, or charges — and the NEM broke it: a battery constrained off in the
 * National Electricity Market is neither paid for the constraint nor charged for
 * it, because no firm access right and no congestion payment exist. Calling that
 * "charges" would have been as wrong as calling it "pays".
 */
export const CAPTURE_FLOW = {
  [CAPTURE.BALANCING]: 'pays',
  [CAPTURE.REGULATED_COMPENSATION]: 'pays',
  [CAPTURE.UNIT_COMMITMENT]: 'pays',
  [CAPTURE.OUTPUT_CONTROL]: 'pays',
  [CAPTURE.CAPACITY_ACCREDITATION]: 'pays',
  /* Italy: the zonal settlement price and Terna's zonal procurement both put
     money in the operator's pocket for being on the right side of a boundary. */
  [CAPTURE.ZONAL_PRICE]: 'pays',
  [CAPTURE.LOCATIONAL_PROCUREMENT]: 'pays',
  /* Romania: congestion is charged to the developer at the connection auction
     rather than paid to the operator afterwards. */
  [CAPTURE.ACCESS_AUCTION]: 'charges',
  /* The NEM's marginal loss factor is a permanent settlement haircut. */
  [CAPTURE.LOSS_FACTOR]: 'charges',
  [CAPTURE.UNCOMPENSATED]: 'neither',
};

export const CAPTURE_FLOW_LABEL = {
  pays: ['pays the operator', '向运营方付费'],
  charges: ['charges the developer', '由开发商承担'],
  neither: ['nobody pays for it', '无人为此付费'],
};

/** True only where the mechanism puts money in the operator's pocket. */
export const CAPTURE_PAYS = Object.fromEntries(
  Object.entries(CAPTURE_FLOW).map(([k, v]) => [k, v === 'pays']));

/** How far the relief project has actually got. */
export const RELIEF_STATUS = {
  PROPOSED: 'proposed',
  APPROVED: 'approved',
  UNDER_CONSTRUCTION: 'under-construction',
  OPERATIONAL: 'operational',
  /* No project exists, because no wire would help. Ireland's minimum-conventional
     -generation constraint is the case this value exists for. */
  RULE_CHANGE: 'rule-change',
};

export const RELIEF_STATUS_LABEL = {
  [RELIEF_STATUS.PROPOSED]: ['Proposed', '提议中'],
  [RELIEF_STATUS.APPROVED]: ['Approved', '已批准'],
  [RELIEF_STATUS.UNDER_CONSTRUCTION]: ['Under construction', '在建'],
  [RELIEF_STATUS.OPERATIONAL]: ['Operational', '已投运'],
  [RELIEF_STATUS.RULE_CHANGE]: ['Rule change, not a wire', '规则变更，非电网工程'],
};

/* A relief date this far out is not a date, it is a direction. Beyond it the
   register stops reporting a runway and says so. */
export const HORIZON_YEAR = 2045;

/**
 * Years from `from` until the constraint is relieved.
 * Null where no date is published — which is itself the finding for a market
 * whose relief project has no committed commissioning year.
 */
export function reliefRunway(zone, from){
  const year = zone?.relief?.expected;
  if (!Number.isFinite(year) || !Number.isFinite(from)) return null;
  if (year > HORIZON_YEAR) return null;
  return Math.max(0, year - from);
}

const bilingual = value => Array.isArray(value) && value.length === 2
  && value.every(part => typeof part === 'string' && part.trim().length > 0);
const isHttps = value => typeof value === 'string' && value.startsWith('https://');
const validCoord = c => Array.isArray(c) && c.length === 2
  && Number.isFinite(c[0]) && Number.isFinite(c[1])
  && c[0] >= -180 && c[0] <= 180 && c[1] >= -90 && c[1] <= 90;

/**
 * Validates one market's congestion register.
 *
 * The rules that matter, and why each exists:
 *   · every zone states a capture mechanism from the vocabulary — a constraint
 *     with no mechanism is a fact, not an opportunity
 *   · every zone states a relief entry, even when the answer is "no project" —
 *     the absence of a relief plan is the most investable thing on this page
 *   · every zone carries a public HTTPS source, like every other number here
 */
export function validateCongestion(register){
  const errors = [];
  const fail = message => errors.push(`${register?.marketId || 'unknown'}: ${message}`);
  if (!register || typeof register !== 'object') return ['unknown: congestion register is missing'];

  if (!register.marketId) fail('missing marketId');
  if (!bilingual(register.summary)) fail('summary must be bilingual');
  if (!Array.isArray(register.zones) || !register.zones.length) fail('needs at least one congestion zone');

  const ids = new Set();
  for (const zone of register.zones || []){
    const id = zone.id || '?';
    if (!zone.id) fail('zone missing id');
    if (ids.has(zone.id)) fail(`duplicate zone id ${zone.id}`);
    ids.add(zone.id);

    if (!bilingual(zone.name)) fail(`${id} name must be bilingual`);
    if (!bilingual(zone.investor)) fail(`${id} investor implication must be bilingual`);
    if (!['zone', 'interface'].includes(zone.shape)) fail(`${id} shape must be zone or interface`);
    if (zone.shape === 'zone' && !validCoord(zone.coord)) fail(`${id} needs a valid coord`);
    if (zone.shape === 'interface'
      && (!Array.isArray(zone.coords) || zone.coords.length < 2 || zone.coords.some(c => !validCoord(c)))){
      fail(`${id} needs at least two valid interface coordinates`);
    }
    if (!['export', 'import', 'both'].includes(zone.direction)) fail(`${id} direction is invalid`);

    /* The measured constraint. Units differ by market on purpose — GB publishes
       a balancing cost, Ireland a dispatch-down percentage, Poland a curtailed
       volume — so the register carries each metric WITH its own label and period
       rather than forcing them onto one scale that no source supports. The first
       entry is the headline; the rest are context. */
    if (!Array.isArray(zone.metrics) || !zone.metrics.length){
      fail(`${id} needs at least one measured metric`);
    }
    for (const [i, m] of (zone.metrics || []).entries()){
      if (!bilingual(m?.label)) fail(`${id} metric ${i} label must be bilingual`);
      if (!bilingual(m?.value)) fail(`${id} metric ${i} value must be bilingual`);
      if (!bilingual(m?.period)) fail(`${id} metric ${i} period must be bilingual`);
    }

    if (!Object.values(CAPTURE).includes(zone.capture?.mechanism)){
      fail(`${id} capture mechanism is not in the controlled vocabulary`);
    }
    if (!bilingual(zone.capture?.text)) fail(`${id} capture text must be bilingual`);

    if (!zone.relief) fail(`${id} needs a relief entry, even if the answer is that none exists`);
    if (zone.relief){
      if (!bilingual(zone.relief.project)) fail(`${id} relief project must be bilingual`);
      if (!bilingual(zone.relief.scope)) fail(`${id} relief scope must be bilingual`);
      if (!Object.values(RELIEF_STATUS).includes(zone.relief.status)) fail(`${id} relief status is invalid`);
      if (zone.relief.expected != null && !Number.isInteger(zone.relief.expected)){
        fail(`${id} relief expected year must be an integer or null`);
      }
    }

    /* Which normalized assumption this constraint is already inside.
       Declared by the market rather than inferred by the UI, because "the Polish
       merchant seed partly reflects congestion that ends in 2034" is an
       analytical claim about that market's own numbers, and the market is where
       such claims belong. The Investment Lab reads it to warn on the affected
       field; nothing derives a value from it. */
    if (zone.bearsOn != null && typeof zone.bearsOn !== 'string'){
      fail(`${id} bearsOn must name a normalized economics field, or be absent`);
    }

    if (!zone.source) fail(`${id} source label is missing`);
    if (!isHttps(zone.sourceUrl)) fail(`${id} sourceUrl must be public HTTPS`);
  }
  return errors;
}

export function validateCongestionCollection(registers){
  const errors = [];
  const seen = new Set();
  for (const register of registers){
    if (seen.has(register.marketId)) errors.push(`${register.marketId}: duplicate register`);
    seen.add(register.marketId);
    errors.push(...validateCongestion(register));
  }
  return errors;
}
