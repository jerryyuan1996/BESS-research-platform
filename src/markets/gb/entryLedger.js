/* Great Britain — capital at risk before the investment decision.

   Empty, and deliberately present. The repository discusses connection security
   once, as a lesson from a delayed connection, and holds no amount, no
   instrument and no release rule. An absent ledger would read as "not looked
   at"; an empty one with a stated limit says what was looked for and not found.

   An empty ledger supplies no figure to an investor's limits, so every limit
   reads as unchecked rather than passed. */

export const ENTRY_LEDGER = {
  marketId: 'gb',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'Nothing sourced yet. Securities and commitments under a Gate 2 connection offer are known to exist and have not been read.',
    '尚无任何来源。已知Gate 2并网要约下存在担保与承诺义务，但尚未查阅原文。'],
  limit: [
    'No item is sourced: not the application fee, not the securities under a Gate 2 offer, not the capacity-auction credit cover. No total can be stated.',
    '没有任何一项已取得来源：申请费、Gate 2要约下的担保、容量拍卖的信用保证均未核实，无法给出合计。'],
  items: [],
};
