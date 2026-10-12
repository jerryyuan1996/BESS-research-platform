/* Ireland — capital at risk before the investment decision.

   The dashboard held one weighted line, "cost and security certainty", and no
   amounts. Two documents were opened on 2026-10-12: ESB Networks' page of
   application fees for 2026/2027, and the regulator's decision paper on the
   connection policy for generation and system services (CRU/2024101).

   ONE FLAG IS ESTABLISHED BY A SOURCE. A storage project that is not
   co-located follows the route for projects outside RED III, and on that route
   planning permission must be granted before a grid application may be made.
   So everything here falls AFTER consent, and `beforeConsent` is false.

   THE OTHER FLAG IS A DRAFT FOR THE ANALYST TO CONFIRM. The fee falls with the
   application. The first stage payment and the capacity bond follow the
   connection offer; they are counted as before the investment decision until
   he says otherwise.

   Two items have no amount. The first stage payment is a formula on a
   connection cost that is set per project, and the decision states it for
   distribution-connected generators. The capacity bond is required above
   5 MW and its amount is in a document that was not opened.

   The later information notes that amend the decision were not opened.

   EVERY ITEM IS "verify": the pages were read by a drafting agent, and
   "verified" is reserved for a source the analyst has opened himself. */

export const ENTRY_LEDGER = {
  marketId: 'ie',
  basis: { powerMW: 50, durationHours: 4 },
  summary: [
    'A project applies only once planning permission is granted, so what it pays the network falls after consent: an application fee of about EUR 158,000 on the 50 MW reference project, then a first stage payment and a capacity bond on accepting a connection offer.',
    '项目须先取得规划许可才能申请并网，因此向电网支付的款项都发生在取得许可之后：以50MW参考项目计，申请费约15.8万欧元；接受并网要约时，再缴纳第一阶段付款并提交容量保证金。'],
  limit: [
    'Two of the three network items have no amount, so the total is a lower bound: the first stage payment depends on a connection cost set per project, and the capacity bond\'s amount was not found in the documents opened. The fee table is the distribution operator\'s; the transmission operator\'s pages could not be opened. Refund terms were not found. The cost of reaching planning permission is not sourced, and on this route it comes first.',
    '三项电网款项中有两项没有金额，因此合计为下限：第一阶段付款取决于按项目核定的并网费用；容量保证金的金额在已查阅的文件中未能找到。费用表出自配电运营商；输电运营商的页面未能打开。退款条款未能找到。取得规划许可的成本没有来源，而在这条路径上它发生得最早。'],
  items: [
    {
      id: 'application-fee', kind: 'fee',
      label: ['Grid application fee', '并网申请费'],
      /* Table 1, 2026/2027, more than 20 MW and up to 100 MW, excluding VAT:
         45,772 on import capacity + 61,332 on installed generation + 51,055
         for shallow works, before any credit for earlier studies. */
      amount: { fixed: 158159, currency: 'EUR' },
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: false, refundable: false,
      form: ['A deposit with the pre-application notification and the balance with the grid application, before the batch closing date. Whether any of it is refunded was not found',
             '提交预申请通知时缴纳定金，余款在批次截止日前随并网申请缴清。是否可退，未能查到'],
      evidence: ['esbnEcpFees', 'cruEcpGss'], status: 'verify',
    },
    {
      id: 'first-stage-payment', kind: 'fee',
      label: ['First stage payment on accepting a connection offer', '接受并网要约时的第一阶段付款'],
      amount: null,
      amountNote: ['For a distribution-connected generator: the greater of 10% of the connection cost, or the lesser of EUR 10,000 per MW and half the connection cost. The connection cost is set per project',
                   '对接入配电网的发电项目：取并网费用的10%，与“每MW 1万欧元和并网费用一半二者中的较低者”相比的较高值。并网费用按项目核定'],
      postedAt: 'studies', releasedAt: null,
      /* A draft flag: the analyst states whether this precedes his decision. */
      beforeFid: true, beforeConsent: false, refundable: false,
      form: ['Paid on acceptance of the connection offer; the remaining stage payments follow the operators\' charging principles, which were not opened',
             '接受并网要约时支付；其余各阶段付款按运营商的收费原则执行，相关文件尚未查阅'],
      evidence: ['cruEcpGss'], status: 'verify',
    },
    {
      id: 'capacity-bond', kind: 'security',
      label: ['Capacity bond', '容量保证金'],
      amount: null,
      amountNote: ['Required for a connection offer above 5 MW; the amount was not in the documents opened', '并网要约超过5MW的须提交；金额未见于已查阅的文件'],
      postedAt: 'studies', releasedAt: 'entry',
      /* A draft flag, as above. */
      beforeFid: true, beforeConsent: false, refundable: true,
      form: ['A financial commitment given with the connection offer; its form was not read', '随并网要约提供的资金承诺；具体形式尚未查阅'],
      lostIf: ['Not read. The decision says only that its purpose is a level of financial commitment from the applicant', '尚未查阅。该决定仅说明其目的在于要求申请人作出一定程度的资金承诺'],
      evidence: ['cruEcpGss'], status: 'verify',
    },
    {
      /* Known to exist, with no figure and no source. */
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and planning permission', '土地、研究与规划许可'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'consent', releasedAt: null,
      beforeFid: true, beforeConsent: true, refundable: false,
      form: ['Spent with landowners, consultants and the planning authority before a grid application can be made', '在可以提出并网申请之前，支付给土地所有人、咨询机构与规划主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
