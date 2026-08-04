/* ---------------------------------------------------------------------------
   Capital cost: components, entry price and the spend profile.

   The engine used to spend one number at t=0 and start earning at t=1. That is
   right only for a project bought at COD with no tax and no build time, which is
   not the case this platform underwrites — it underwrites at RTB, in markets
   whose connection charges and VAT treatment differ by more than the equipment
   does, and where an HV connection can add years of transformer lead time before
   the first megawatt-hour.

   Three additions, each of which must be invisible when it is not declared:

     capexStack          component build-up; absent, `capexPerMW` is used as-is
     devCost + rtbPremium  the RTB entry price; absent, zero is added
     constructionMonths   the spend profile; absent or ≤12, one outflow at t=0

   That last rule is what keeps tests/baseline.test.js green without regenerating
   the fixture. A market that declares none of this gets exactly the cash-flow
   vector it got before, to the bit.

   Everything here is per MW and in the market's own currency. The engine applies
   FX once, at the point it already did.
   --------------------------------------------------------------------------- */

/**
 * Build capex per MW from its components.
 *
 * Returns `null` when no stack is declared, which tells the caller to fall back
 * to the market's flat `capexPerMW`. Never invents a total from a partial stack:
 * a missing component is zero, and a market with no stack has no total here.
 *
 * @param {object} stack      economics.capexStack
 * @param {number} hours      archetype duration, for the per-kWh components
 * @returns {?{total:number, parts:object}}
 */
export function buildCapex(stack, hours){
  if (!stack) return null;
  const h = hours || 0;
  const kwh = h * 1000;                       // kWh per MW at this duration

  /* Energy-scaling components. The DC block is the only one that is genuinely a
     traded commodity — it is priced per kWh and moves with the cell market, not
     with the country it lands in. */
  const dcBlock = (stack.dcBlockPerKWh || 0) * kwh;
  const bopEnergy = (stack.bopPerKWh || 0) * kwh;

  /* Power-scaling components. The HV transformer is separate from the PCS
     because only some connections need one, and where they do it is the long-lead
     item that sets the construction programme rather than a cost line. */
  const pcs = stack.pcsPerMW || 0;
  const transformerHv = stack.transformerHvPerMW || 0;
  const bopPower = stack.bopPerMW || 0;

  const equipment = dcBlock + pcs + transformerHv;
  const duty = equipment * (stack.dutyPct || 0) / 100;
  const bop = bopEnergy + bopPower;

  /* EPC is a percentage of what is being installed rather than a rate, because
     that is how it is quoted and how it scales with a bigger battery. */
  const epc = (equipment + duty + bop) * (stack.epcPct || 0) / 100;

  const connection = stack.connectionFeePerMW || 0;
  const other = stack.otherPerMW || 0;

  const total = equipment + duty + bop + epc + connection + other;
  return {
    total,
    parts: { dcBlock, pcs, transformerHv, duty, bop, epc, connection, other },
  };
}

/* ---------------------------------------------------------------------------
   The global component split.

   No market publishes a component breakdown of its own installed cost — that is
   gate G24 — so the shares below are the industry structure applied uniformly,
   and the market-specific lines (connection charge, duty, VAT) are declared
   separately rather than buried inside them.

   Shares are of installed cost, from the 2026 trade literature: the DC block
   dominates and tracks the cell market; PCS plus transformer is consistently
   quoted at 10-15%; balance of plant at 20-30% and highly site-dependent; EPC
   and engineering the remainder.

   Two consequences worth stating plainly. First, these shares differentiate
   nothing between markets — until G24 closes, the split is descriptive, and only
   the total it reconciles to is market evidence. Second, because the residual
   lands in EPC, `stackFrom(total)` reproduces `total` exactly, which is what lets
   the stack be introduced without moving a single published IRR.
   --------------------------------------------------------------------------- */
export const CAPEX_SHARES = { dcBlock: 0.56, pcs: 0.09, transformerHv: 0.04, bop: 0.19, epc: 0.12 };

/**
 * Component rates that reconcile exactly to a published installed cost.
 *
 * @param {number} total  installed capex per MW, in market currency
 * @param {number} hours  archetype duration
 * @param {object} over   per-market overrides, e.g. a published connection charge
 */
export function stackFrom(total, hours, over = {}){
  const s = CAPEX_SHARES;
  const kwh = (hours || 0) * 1000;
  const installed = s.dcBlock + s.pcs + s.transformerHv + s.bop;   // 0.88
  return {
    dcBlockPerKWh: kwh ? total * s.dcBlock / kwh : 0,
    pcsPerMW: total * s.pcs,
    transformerHvPerMW: total * s.transformerHv,
    bopPerMW: total * s.bop,
    /* Expressed as a percentage of what is installed, so the residual closes on
       the published total whatever the other shares are set to. */
    epcPct: 100 * s.epc / installed,
    ...over,
  };
}

/**
 * Development cost and the price paid for a ready-to-build project.
 *
 * `devCostPct` is what it costs the developer to reach RTB — land options,
 * planning, grid studies, legal, and the connection application. The premium on
 * top is the developer's margin, and no market publishes it: an RTB trade is a
 * private bilateral, so the platform takes it as an input and shows the £/MW it
 * implies rather than pretending to observe one.
 *
 * @returns {{devCost:number, premium:number, rtbPrice:number}}
 */
export function rtbEntry(e, buildCapexPerMW){
  const devCost = buildCapexPerMW * (e.devCostPct || 0) / 100;
  const premium = devCost * (e.rtbPremiumPct || 0) / 100;
  return { devCost, premium, rtbPrice: devCost + premium };
}

/**
 * How many yearly periods the build spends over.
 *
 * Both 0 and 12 months give one period, and that is deliberate: a one-year build
 * pays up front and earns from the following year, which is exactly the legacy
 * shape. Only a build longer than a year splits the outflow.
 */
export function spendPeriods(constructionMonths){
  const m = constructionMonths || 0;
  return Math.max(1, Math.ceil(m / 12));
}

/**
 * S-curve spend weights across `n` periods, summing to 1.
 *
 * Construction spend is slow at first (mobilisation, civils), heavy in the
 * middle (equipment delivery and install) and light at the end (commissioning).
 * A flat profile would understate the drag, because the money that hurts an IRR
 * most is the money committed earliest.
 */
export function spendCurve(n){
  if (n <= 1) return [1];
  if (n === 2) return [0.4, 0.6];
  if (n === 3) return [0.2, 0.6, 0.2];
  /* Longer programmes: a raised-cosine bell, normalised. Keeps the same shape
     without a table per length. */
  const raw = Array.from({ length: n }, (_, i) => 1 - Math.cos(2 * Math.PI * (i + 0.5) / n));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(v => v / sum);
}

/**
 * The capital side of the cash-flow vector.
 *
 * Returns the outflows indexed from t=0, plus the offset at which operating cash
 * flow begins. With no construction period declared the result is a single
 * outflow and an offset of 0 — the legacy vector, unchanged.
 *
 * VAT is handled as timing rather than cost wherever it is recoverable. It is
 * paid with each construction instalment and refunded after the market's own
 * lag, so it is a working-capital drag on IRR and not an addition to project
 * cost. Where it is not recoverable it capitalises, which is the case that
 * actually moves the return.
 *
 * @param {object} e            market economics
 * @param {number} entryPerMW   build capex + RTB price, net of grant
 * @param {number} vatBase      the portion of spend VAT applies to
 * @returns {{flows:number[], codOffset:number, vatDrag:number}}
 */
export function capitalFlows(e, entryPerMW, vatBase){
  const n = spendPeriods(e.constructionMonths);
  const curve = spendCurve(n);
  const flows = new Array(n).fill(0);

  for (let i = 0; i < n; i++) flows[i] -= entryPerMW * curve[i];

  const vatPct = e.vatPct || 0;
  let vatDrag = 0;
  if (vatPct > 0 && vatBase > 0){
    const recoverable = e.vatRecoverable !== false;
    const lagYears = Math.max(0, Math.round((e.vatLagMonths || 0) / 12));
    for (let i = 0; i < n; i++){
      const vat = vatBase * curve[i] * vatPct / 100;
      if (!recoverable){
        /* Capitalises: a permanent addition to project cost. */
        flows[i] -= vat;
        vatDrag += vat;
        continue;
      }
      flows[i] -= vat;
      const back = i + lagYears;
      while (flows.length <= back) flows.push(0);
      flows[back] += vat;
    }
  }

  /* Operating cash flow starts the year after the build finishes. With one
     spend period that is t=1, which is where it has always started. */
  return { flows, codOffset: n - 1, vatDrag };
}
