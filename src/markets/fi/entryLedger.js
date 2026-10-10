/* Finland — capital at risk before the investment decision.

   A short ledger, and the shortness is the finding. The operator's connection
   application page was opened on 2026-10-10: applying is free and the page
   names no deposit and no security. The one payment found is a fixed connection
   fee that falls due when the connection agreement is signed and is not
   refunded; its amount was not found, and that page was read from a search
   summary only.

   "None found" is not "none exists". What the application page does not mention
   it does not rule out, and the limit says so. */

const FINGRID_FEES = {
  publisher: 'Fingrid — main grid contract and service fees',
  url: 'https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/main-grid-contract-and-service-fees/',
  access: 'search-summary',
};

export const ENTRY_LEDGER = {
  marketId: 'fi',
  basis: { powerMW: 50, durationHours: 2 },
  summary: [
    'The connection application is free and names no deposit or security. A fixed, non-refundable connection fee falls due at signing of the connection agreement.',
    '并网申请免费，且未提及任何押金或担保。签署并网协议时须缴纳一笔固定且不予退还的并网费。'],
  limit: [
    'The connection fee has no amount here, so the total is a lower bound of zero and says nothing yet. No security was found on the pages opened, which is not proof that none is ever required. The cost of the land-use plan and building permit needed before applying is not sourced.',
    '并网费在此没有金额，因此合计只是零的下限，尚不能说明任何问题。在已打开的页面上未发现担保要求，但这并不证明任何情况下都无需担保。申请前所需的土地利用规划与建筑许可的费用尚无来源。'],
  items: [
    {
      id: 'connection-fee', kind: 'fee',
      label: ['Main-grid connection fee', '主网并网费'],
      amount: null,
      amountNote: ['A fixed lump sum set by the operator; the 2026 amount was not found', '由运营商核定的固定一次性费用；未查到2026年的金额'],
      postedAt: 'studies', releasedAt: null,
      /* Due at the connection agreement, which Finland signs only after final
         planning consent — see the two consent checkpoints in buildPathway.js. */
      beforeFid: true, beforeConsent: false, refundable: false,
      form: ['Cash, at signing of the connection agreement', '现金，于签署并网协议时支付'],
      evidence: [FINGRID_FEES, 'connectionPhases'], status: 'verify',
    },
  ],
};
