/* PJM — capital at risk before the investment decision.

   LOOKED AT, AND NOTHING SOURCED. PJM's reformed cycle process is known to ask
   for study deposits and for readiness deposits that rise at each decision
   point, and for a share of network upgrade costs. On 2026-10-12 the
   operator's service-request page was opened and carries none of the terms,
   and the manual that does was too large to fetch.

   So the items are listed as known to exist, with no amount and no source.
   Nothing here is evidence; it is a list of what to open.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM. */

export const ENTRY_LEDGER = {
  marketId: 'pjm',
  basis: { powerMW: 90, durationHours: 4 },
  summary: [
    'Known to exist and not sourced: study deposits with an interconnection application, readiness deposits that step up through the cycle, and security for assigned network upgrades.',
    '已知存在但尚无来源：提交并网申请时的研究押金、随周期推进逐级提高的成熟度保证金，以及为所分摊电网升级费用提交的担保。'],
  limit: [
    'Nothing here is sourced, so nothing can be totalled and every limit reads as unchecked. The terms are in the operator\'s interconnection manual and tariff, which were not opened. The dashboard scores network upgrade cost allocation as a material risk, and that cost is per project.',
    '此处没有任何内容有来源，因此无法合计，各项上限均显示为未核查。相关条款载于运营机构的并网手册与费率文件，尚未查阅。看板将电网升级成本分摊列为重大风险，而该成本按项目核定。'],
  items: [
    {
      id: 'cycle-deposits', kind: 'security',
      label: ['Study and readiness deposits through the interconnection cycle', '并网周期各阶段的研究押金与成熟度保证金'],
      amount: null,
      amountNote: ['Not sourced. Set in the operator\'s interconnection manual and tariff', '尚无来源。标准载于运营机构的并网手册与费率文件'],
      postedAt: 'application', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Cash or a letter of credit, posted with the application and increased at each decision point of the cycle', '现金或信用证，随申请提交，并在周期的每个决策节点追加'],
      lostIf: ['Not sourced', '尚无来源'],
      evidence: [], status: 'unsourced',
    },
    {
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and permitting before the decision', '决策前的土地、研究与许可费用'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and county authorities', '支付给土地所有人、咨询机构与县级主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
