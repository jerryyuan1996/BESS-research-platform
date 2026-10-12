/* CAISO — capital at risk before the investment decision.

   Read on 2026-10-12 from Appendix KK of the CAISO tariff, the Resource
   Interconnection Standards, in the version dated 25 June 2025. Whether a
   later version is in force was not checked.

   Three sums accompany an interconnection request, and all three are stated
   in the tariff: a small fee that is kept, a study deposit that is spent on
   the cluster study and refunded where unspent, and a commercial readiness
   deposit of twice the study deposit. The readiness deposit then rises to 5%
   of the network upgrade cost the study assigns, which is per project and is
   why the total is a lower bound.

   NOT AN ITEM, AND WORTH KNOWING: a request needs 90% site control. Where
   regulation makes that unobtainable, a deposit in lieu of USD 10,000 per MW,
   between USD 500,000 and USD 2,000,000, stands in for it. It is conditional,
   so it is described in `limit` and not counted.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM. All three fall with
   the request and are taken to be before the investment decision.
   `beforeConsent` is null: the tariff asks for site control, not a permit.

   EVERY ITEM IS "verify": the tariff was read by a drafting agent, and
   "verified" is reserved for a source the analyst has opened himself. */

export const ENTRY_LEDGER = {
  marketId: 'caiso',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'An interconnection request carries a USD 5,000 fee, a USD 150,000 study deposit and a commercial readiness deposit of USD 300,000, about USD 455,000 on the 100 MW reference project. The readiness deposit is then topped up to 5% of the network upgrade cost assigned by the cluster study.',
    '提交并网申请须缴纳5,000美元申请费、15万美元研究押金，以及30万美元的商业成熟度保证金；以100MW参考项目计，合计约45.5万美元。其后，商业成熟度保证金须补足至集群研究所分摊电网升级费用的5%。'],
  limit: [
    'The top-up of the readiness deposit and the later postings depend on the network upgrade cost assigned to the project, which is not public, so the total is a lower bound. A project without 90% site control because of a regulatory limitation posts a further USD 10,000 per MW, between USD 500,000 and USD 2,000,000; that is conditional and not counted. Land, studies and permitting are not sourced. The tariff version read is dated June 2025.',
    '商业成熟度保证金的补足额及其后各次缴款取决于分摊给项目的电网升级费用，该费用并不公开，因此合计为下限。因监管限制而未能取得90%场址控制权的项目，须另按每MW 1万美元缴纳替代押金（不低于50万美元、不高于200万美元）；该项视情形而定，未计入。土地、研究与许可费用没有来源。所查阅的费率文本版本日期为2025年6月。'],
  items: [
    {
      id: 'application-fee', kind: 'fee',
      label: ['Interconnection application fee', '并网申请费'],
      amount: { fixed: 5000, currency: 'USD' },
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Paid with the interconnection request in the cluster application window; forfeited if the request is withdrawn or found invalid', '在集群申请窗口期内随并网申请缴纳；申请撤回或被认定无效的，不予退还'],
      evidence: ['tariffKK'], status: 'verify',
    },
    {
      id: 'study-deposit', kind: 'deposit',
      label: ['Interconnection study deposit', '并网研究押金'],
      /* USD 150,000 for a request of 80 MW to under 200 MW. */
      amount: { fixed: 150000, currency: 'USD' },
      postedAt: 'application', releasedAt: 'studies',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Cash held by the operator in an interest-bearing account and applied to the cost of the cluster study', '以现金缴纳，由运营机构存入计息账户，用于支付集群研究费用'],
      lostIf: ['Spent on the study. Whatever the study does not cost is returned, with interest, including on withdrawal', '用于支付研究费用。研究未用完的部分连同利息退还，申请撤回时亦同'],
      evidence: ['tariffKK'], status: 'verify',
    },
    {
      id: 'commercial-readiness-deposit', kind: 'security',
      label: ['Commercial readiness deposit', '商业成熟度保证金'],
      /* Twice the study deposit at the request. The later top-up to 5% of the
         assigned network upgrade cost has no public figure. */
      amount: { fixed: 300000, currency: 'USD' },
      postedAt: 'application', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['An irrevocable letter of credit, cash, a surety bond or other security acceptable to the transmission owner; raised after the cluster study to 5% of the assigned network upgrade cost', '不可撤销信用证、现金、履约保函或输电资产所有者认可的其他担保；集群研究完成后须补足至所分摊电网升级费用的5%'],
      lostIf: ['A withdrawal penalty is taken from it if the request is withdrawn or the plant does not reach commercial operation, unless the withdrawal harms no other request in the cluster or follows a rise of more than 25% in the assigned upgrade cost', '申请撤回或电站未能投入商业运行的，从中扣收撤回罚金；但撤回对同一集群内其他申请没有实质影响，或是在所分摊升级费用上涨超过25%之后撤回的除外'],
      evidence: ['tariffKK'], status: 'verify',
    },
    {
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and permitting before the decision', '决策前的土地、研究与许可费用'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and the permitting authorities', '支付给土地所有人、咨询机构与许可主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
