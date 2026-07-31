/* ---------------------------------------------------------------------------
   Routes to market ("strategies").

   Each strategy declares the capability a market must have for the strategy to
   apply, and the message shown when it does not. The prototype hardcoded these
   checks inside runCase():

       if (!e.contracted) return { na: ['No capacity mechanism', '无容量机制'] };
       if (!e.toll)       return { na: ['No market precedent', '无市场先例'] };

   Same strings, same outcome — but now a market declares its capabilities and the
   engine reads them, instead of the engine inferring capability from whether a
   number happens to be zero. Adding a fourth route means adding an entry here and
   a capability flag to the markets that support it.
   --------------------------------------------------------------------------- */

export const STRATEGIES = [
  {
    id: 'cap',
    n: ['Capacity-backed', '容量支撑'],
    d: ['Capacity / CRM contract + merchant + services', '容量合同 + 市场化 + 系统服务'],
    requires: 'capacityMarket',
    na: ['No capacity mechanism', '无容量机制'],
  },
  {
    id: 'mer',
    n: ['Merchant', '纯市场化'],
    d: ['Merchant + services only — skip the capacity mechanism', '仅市场化与系统服务 — 放弃容量机制'],
    requires: 'merchant',
    na: ['No merchant exposure', '无市场化敞口'],
  },
  {
    id: 'toll',
    n: ['Tolled / floor', '租赁/保底'],
    d: ['Fixed toll replaces market exposure', '以固定租赁付费取代市场敞口'],
    requires: 'tolling',
    na: ['No market precedent', '无市场先例'],
  },
  /* Long-term decarbonization / fixed-award route.

     This was declared but disabled everywhere, on the grounds that an award is
     project-specific rather than a market benchmark, and showing it by default
     would imply every project in the market wins one. That reasoning still
     stands, and any market enabling it must badge the case illustrative/project.

     What changed is that in Japan it is now the only route with a six-hour-plus
     product: LTDA Round 3 (May 2026) eliminated the 3-6h bracket entirely. A
     four-hour Japanese battery cannot bid. Leaving the route off therefore
     stopped being conservative and started being distortive — the model was
     publishing the residual case as if it were the mainstream one.

     The route carries two pieces of structure the others do not:
       · a long secured tenor (20-year CRA; the 15-year window never sees it end)
       · `merchantRetention` — the award claws back ~90% of net profit earned in
         other markets, so LTDA and merchant are very nearly mutually exclusive
         rather than additive. See docs/external-view.md §3. */
  {
    id: 'ltda',
    n: ['Long-term award', '长期脱碳拍卖'],
    d: ['Fixed long-term capacity award, net of other-market revenue sharing',
        '固定长期容量中标，已扣除其他市场收入分享'],
    requires: 'longTermAward',
    na: ['No representative award scenario loaded', '未载入代表性中标情景'],
  },
];

export const STRATEGY_IDS = STRATEGIES.map(s => s.id);

export const strategyById = (id) => STRATEGIES.find(s => s.id === id);

/** True when the market declares the capability this strategy requires. */
export function supports(market, strategyId){
  const s = strategyById(strategyId);
  if (!s) return false;
  return Boolean(market.comparison.capabilities?.[s.requires]);
}

/** The strategies a market can actually be modelled under, in canonical order. */
export function supportedStrategies(market){
  return STRATEGIES.filter(s => supports(market, s.id));
}

/**
 * The strategy a market is presented under by default.
 *
 * Prototype: `baseStrat(m) = m.econ.contracted ? 'cap' : 'mer'` — capacity-backed
 * wherever a capacity mechanism exists, merchant otherwise. Expressed through
 * capabilities, this is identical for the five migrated markets. A market may
 * override it explicitly with comparison.baseStrategy.
 */
export function baseStrategy(market){
  const explicit = market.comparison.baseStrategy;
  if (explicit && supports(market, explicit)) return explicit;
  return market.comparison.capabilities?.capacityMarket ? 'cap' : 'mer';
}

/**
 * How long year-1 revenue is actually secured, in years.
 * A capacity payment won one delivery year at a time is secured for one year,
 * however many years the asset remains eligible to bid.
 *
 * The toll answer is deliberately the toll's own tenor and not the modelled life.
 * GB's precedent is ten years (Drax/Fidra), against a fifteen-year window — the
 * gap is a merchant tail, and calling it secured is the error this function
 * exists to prevent. It is also what the project-debt layer sizes against.
 */
export function securedTenor(market, strategyId){
  const e = market.comparison.economics;
  if (strategyId === 'cap'){
    return e.riskClass === 'auction-renewal' ? (e.securedContractYears || 0) : (e.contractYears || 0);
  }
  if (strategyId === 'toll') return e.tollYears || 0;
  if (strategyId === 'ltda') return e.ltda?.years || 0;
  return 0;
}
