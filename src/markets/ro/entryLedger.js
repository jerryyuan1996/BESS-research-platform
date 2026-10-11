/* Romania — capital at risk before the investment decision.

   The one market where the repository already held this as a card: three
   guarantees, published by the regulator, shown on the grid tab with a
   "verify" badge on each.

   The three amounts are the dashboard's own: `official.auctionGuarEurMW`,
   `estabGuarEurKW` and `connTariffGuarPct` in data.js. They are restated here
   rather than imported, because importing data.js would pull the whole Romanian
   dashboard payload into the chunk that renders every market's Investment Case.
   tests/entry-ledger.test.js asserts the two agree, so they cannot drift.

   DRAFT, 2026-10-11. The orders in force were opened and read: ANRE Order
   53/2024 as first published, Order 15/2026 and Transelectrica's procedure of
   June 2026. Two of the three guarantees are now "verified" on amount, release
   and forfeiture. The establishment guarantee stays at "verify": its terms come
   from the regulator's press release, and the licensing order behind it was
   not opened.

   Two items are new, and both follow from winning the auction: the price of
   the capacity itself, and a 1% guarantee that the price will be paid. Neither
   has an amount, because no auction had cleared when this was written.

   `beforeConsent` is left as it was set. What the orders say is that the
   connection guarantee is posted before the ATR is issued, and that the
   deadlines for the building permit and the establishment authorisation run
   from the ATR; whether that settles the flag is the analyst's call. */
const O = { auctionGuarEurMW: 20000, estabGuarEurKW: 30, connTariffGuarPct: 20 };

/* EVERY ITEM IS "verify", including those whose source was opened. The pages
   were read by a drafting agent on 2026-10-11, and "verified" is reserved for
   a source the analyst has opened himself — the same rule the other ledgers
   follow. An item moves up when he has looked at it. */

export const ENTRY_LEDGER = {
  marketId: 'ro',
  basis: { powerMW: 50, durationHours: 2 },
  summary: [
    'Three guarantees and one purchase fall due before financial close. A guarantee to take part in the capacity auction is returned within days of signing the allocation contract, and the auction price then falls due within four months. A guarantee against the connection tariff is posted before the permit is issued, and one against the establishment authorisation when it is applied for.',
    '融资交割前须提交三项保函并支付一笔价款。参与容量拍卖的保函在签署分配合同后数日内退还，拍卖价款随后须在四个月内付清。并网费保函须在技术并网许可签发前提交，设立许可保函则在申请该许可时提交。'],
  limit: [
    'Three of the five items have no amount, so every total here is a lower bound: the connection tariff is set per project, and no capacity auction had cleared when this was drafted, so neither the price of capacity nor the guarantee tied to it can be stated. The participation guarantee is returned before the auction price falls due, so the two are not outstanding together and the total overstates the peak for that pair. The establishment guarantee rests on the regulator\'s press release; the licensing order was not opened. Development spend other than these items is not sourced.',
    '五项中有三项没有金额，因此此处所有合计均为下限：并网费按项目核定；起草本文时尚无任何一场容量拍卖成交，容量价款及与之挂钩的保函金额都无从给出。参与保函在拍卖价款到期之前即已退还，二者不会同时占用资金，因此合计高估了这两项的峰值。设立许可保函依据的是监管机构的新闻稿，许可规章本身未打开。除上述各项之外的开发支出尚无来源。'],
  items: [
    {
      id: 'auction-guarantee', kind: 'security',
      label: ['Allocation-auction participation guarantee', '容量分配拍卖参与保函'],
      /* The 2026 amount. From 2027 it is the lower of this and the weighted
         average contract price of the previous year's auctions. */
      amount: { perMW: O.auctionGuarEurMW, currency: 'EUR' },
      postedAt: 'application', releasedAt: 'application',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Bank guarantee letter, term deposit or direct payment to Transelectrica, filed with the allocation request; irrevocable and payable on first demand', '银行保函、定期存款或直接向Transelectrica付款，随容量分配申请一并提交；不可撤销，见索即付'],
      lostIf: ['A winning bidder does not return the signed allocation contract, with proof of the payment guarantee, within five working days. Otherwise returned within two working days of the auction to a losing bidder, or of the signed contract to a winner', '中标方未在五个工作日内交回已签署的分配合同及价款支付保函的凭证。其余情形下，未中标的在拍卖结束后两个工作日内退还，中标的在交回已签合同后两个工作日内退还'],
      evidence: ['order15', 'allocationProcedure'], status: 'verify',
    },
    {
      id: 'allocation-payment-guarantee', kind: 'security',
      label: ['Guarantee for payment of the allocated capacity', '已分配容量价款支付保函'],
      amount: null,
      amountNote: ['1% of the allocation contract value; no auction had cleared, so there is no value to take 1% of', '分配合同金额的1%；尚无拍卖成交，因此没有可供计算的合同金额'],
      postedAt: 'application', releasedAt: 'application',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Bank guarantee letter, term deposit or direct payment, filed with the signed allocation contract', '银行保函、定期存款或直接付款，随已签署的分配合同一并提交'],
      lostIf: ['The price is not paid on the contract\'s terms, or the sponsor asks to end the contract; the allocated capacity is lost with it. Released within two working days of payment in full', '未按合同约定付清价款，或投资方主动要求终止合同；已分配的容量同时丧失。价款付清后两个工作日内解除'],
      evidence: ['order53', 'allocationProcedure'], status: 'verify',
    },
    {
      id: 'allocation-price', kind: 'fee',
      label: ['Price of the allocated capacity', '已分配容量的价款'],
      amount: null,
      amountNote: ['Allocated MW times the auction price, plus a share of the system study; zero where requests in a zone do not exceed available capacity. No auction had cleared', '分配容量（MW）乘以拍卖价格，另加系统研究费用的分摊份额；某分区申请量未超过可用容量的，价格为零。尚无拍卖成交'],
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: true, refundable: false,
      form: ['Cash by bank transfer: at least 20% within 30 days of the contract and the balance within four months', '银行转账支付现金：合同签订后30日内支付至少20%，余款在四个月内付清'],
      evidence: ['order53', 'allocationProcedure'], status: 'verify',
    },
    {
      id: 'establishment-guarantee', kind: 'security',
      label: ['Establishment-authorisation guarantee', '设立许可保函'],
      amount: { perKW: O.estabGuarEurKW, currency: 'EUR' },
      postedAt: 'consent', releasedAt: 'construction',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Financial guarantee per kW of installed power, valid until the handover protocol at completion of the works', '按装机容量每千瓦计的财务保函，有效期至工程竣工验收纪要出具之日'],
      lostIf: ['Called at the regulator\'s request if the works are not completed and handed over within the authorisation\'s validity, or if the holder gives the project up. As described in the press release; not checked against the licensing order', '未在许可有效期内完工并办理验收，或持有人放弃项目的，经监管机构要求予以执行。以上依据新闻稿，尚未对照许可规章核实'],
      evidence: ['anre'], status: 'verify',
    },
    {
      id: 'connection-tariff-guarantee', kind: 'security',
      label: ['Connection-tariff guarantee', '并网费保函'],
      amount: null,
      amountNote: [`${O.connTariffGuarPct}% of the connection tariff before VAT, above 1 MW; the tariff is set per project and not published`,
                   `不含增值税并网费的${O.connTariffGuarPct}%，适用于1MW以上；并网费按项目核定，未公开`],
      postedAt: 'studies', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Financial guarantee in favour of the network operator, posted before the technical connection permit is issued and kept for the life of the connection contract', '以电网运营商为受益人的财务保函，须在技术并网许可签发前提交，并在并网合同存续期间持续有效'],
      lostIf: ['The building permit or the establishment authorisation is not obtained in time; the connection contract is not requested or signed before the permit expires; the tariff is not paid on its terms; the installation or its development stages are not delivered; or the holder gives the permit up. Returned at final energisation', '未按期取得建设许可或设立许可；未在许可到期前申请或签署并网合同；未按约定支付并网费；未按约定建成用户设施或完成各开发阶段；或持有人主动放弃许可。最终送电时退还'],
      evidence: ['order15', 'order53', 'anre'], status: 'verify',
    },
  ],
};
