/* Finland — capital at risk before the investment decision.

   A short ledger with one large line in it. The operator's connection
   application page was opened on 2026-10-10: applying is free and the page
   names no deposit and no security. On 2026-10-11 the operator's 2026 fee
   schedule was opened as well, and the first reading of this market — "almost
   nothing at risk" — did not survive it: a connection to an existing 110 kV
   substation carries a fixed fee of EUR 1,000,000, and the connection agreement
   takes effect only once it is paid.

   On a 50 MW project that is about 5% of project cost, spent and not pledged.
   It is the same sum for a 50 MW project and a 300 MW one, which is the
   opposite of every other market here: in Finland the entry cost falls as a
   share as the project grows.

   The schedule was read by an agent, not by a person, so the item stays at
   "verify" until the analyst has looked at it.

   "None found" is not "none exists". What the application page does not mention
   it does not rule out, and the limit says so. */

const FINGRID_AGREEMENT = {
  publisher: 'Fingrid — connection agreement and grid connection fees',
  url: 'https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/liittymissopimus-ja--maksut/',
  access: 'opened',
};
const FINGRID_FEES_2026 = {
  publisher: 'Fingrid — main grid connection fees 2026',
  url: 'https://www.fingrid.fi/globalassets/dokumentit/fi/palvelut/kulutuksen-ja-tuotannon-liittaminen-kantaverkkoon/connection-fees-2026.pdf',
  access: 'opened',
};

export const ENTRY_LEDGER = {
  marketId: 'fi',
  basis: { powerMW: 50, durationHours: 2 },
  summary: [
    'The connection application is free and names no deposit or security. A fixed connection fee of EUR 1,000,000 for a 110 kV substation connection is paid for the connection agreement to take effect.',
    '并网申请免费，且未提及任何押金或担保。接入110kV变电站须缴纳100万欧元的固定并网费，缴费后并网协议方才生效。'],
  limit: [
    'The fee shown is for an existing 110 kV substation. A connection to a 110 kV power line is charged per 25 MVA of transformer rating, up to two fees, so the same project could pay EUR 2,000,000; 220 kV and 400 kV connections cost more. No security was found on the pages opened, which is not proof that none is ever required. The cost of the land-use plan and building permit needed before applying is not sourced.',
    '所示费用适用于接入既有110kV变电站。接入110kV线路则按变压器额定容量每25MVA计收一笔、最多两笔，同一项目可能须缴200万欧元；220kV与400kV接入费用更高。在已打开的页面上未发现担保要求，但这并不证明任何情况下都无需担保。申请前所需的土地利用规划与建筑许可的费用尚无来源。'],
  items: [
    {
      id: 'connection-fee', kind: 'fee',
      label: ['Main-grid connection fee, existing 110 kV substation', '主网并网费（接入既有110kV变电站）'],
      amount: { fixed: 1000000, currency: 'EUR' },
      postedAt: 'studies', releasedAt: null,
      /* Paid for the connection agreement to take effect, and Finland signs
         that agreement only after final planning consent — see the two consent
         checkpoints in buildPathway.js. */
      beforeFid: true, beforeConsent: false, refundable: false,
      form: ['Cash, paid for the connection agreement to take effect', '现金；缴纳后并网协议方才生效'],
      evidence: [FINGRID_FEES_2026, FINGRID_AGREEMENT, 'connectionPhases'], status: 'verify',
    },
  ],
};
