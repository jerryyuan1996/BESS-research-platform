/* Romania — capital at risk before the investment decision.

   The one market where the repository already held this as a card: three
   guarantees, published by the regulator, shown on the grid tab with a
   "verify" badge on each.

   The three amounts are the dashboard's own: `official.auctionGuarEurMW`,
   `estabGuarEurKW` and `connTariffGuarPct` in data.js. They are restated here
   rather than imported, because importing data.js would pull the whole Romanian
   dashboard payload into the chunk that renders every market's Investment Case.
   tests/entry-ledger.test.js asserts the two agree, so they cannot drift.

   All three stay at status "verify", because the dashboard itself says so: the
   release and forfeiture mechanics are still evolving and have not been checked
   against the order in force. */
const O = { auctionGuarEurMW: 20000, estabGuarEurKW: 30, connTariffGuarPct: 20 };

export const ENTRY_LEDGER = {
  marketId: 'ro',
  basis: { powerMW: 50, durationHours: 2 },
  summary: [
    'Three guarantees fall due before financial close: one to take part in the connection-capacity auction, one against the establishment authorisation and one against the connection tariff.',
    '融资交割前须提交三项保函：参与并网容量拍卖的保函、设立许可保函，以及并网费保函。'],
  limit: [
    'The connection tariff is project-specific and unpublished, so the third guarantee has no amount and every total here is a lower bound. Release and forfeiture conditions have not been verified against the order in force. Development spend other than guarantees is not sourced.',
    '并网费因项目而异且未公开，因此第三项保函没有金额，此处所有合计均为下限。保函的释放与没收条件尚未对照现行法令核实。除保函之外的开发支出尚无来源。'],
  items: [
    {
      id: 'auction-guarantee', kind: 'security',
      label: ['Allocation-auction participation guarantee', '容量分配拍卖参与保函'],
      amount: { perMW: O.auctionGuarEurMW, currency: 'EUR' },
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Guarantee posted to take part in the auction', '为参与拍卖而提交的保函'],
      lostIf: ['Forfeiture conditions not yet verified against the order in force', '没收条件尚未对照现行法令核实'],
      evidence: ['gridAuction', 'anre'], status: 'verify',
    },
    {
      id: 'establishment-guarantee', kind: 'security',
      label: ['Establishment-authorisation guarantee', '设立许可保函'],
      amount: { perKW: O.estabGuarEurKW, currency: 'EUR' },
      postedAt: 'consent', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Guarantee posted against the establishment authorisation', '针对设立许可提交的保函'],
      lostIf: ['Return and forfeiture conditions not yet verified', '返还与没收条件尚未核实'],
      evidence: ['anre'], status: 'verify',
    },
    {
      id: 'connection-tariff-guarantee', kind: 'security',
      label: ['Connection-tariff guarantee', '并网费保函'],
      amount: null,
      amountNote: [`${O.connTariffGuarPct}% of the connection tariff, which is set per project and not published`,
                   `并网费的${O.connTariffGuarPct}%；并网费按项目核定，未公开`],
      postedAt: 'studies', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Guarantee against the connection tariff', '针对并网费提交的保函'],
      lostIf: ['Applicability and forfeiture conditions not yet verified', '适用范围与没收条件尚未核实'],
      evidence: ['anre'], status: 'verify',
    },
  ],
};
