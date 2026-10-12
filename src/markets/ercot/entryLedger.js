/* ERCOT — capital at risk before the investment decision.

   Read on 2026-10-12 from Section 5 of the ERCOT Planning Guide, the version
   posted for 1 August 2026. It says WHAT is paid and when. It does not say how
   much: the amounts are in the fee schedule of the Nodal Protocols, which was
   not opened, and the security is whatever the transmission provider's
   interconnection facilities cost.

   So every item here has a shape and no amount, and every total is a lower
   bound of nothing. That is an honest ledger for a market whose interconnection
   is known to be quick and cheap by reputation and whose figures nobody has
   put in front of this platform yet.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM. The two fees fall
   with the request and the study application. The security is given with the
   notice to proceed with construction of the interconnection, which is taken
   here to be at or after the investment decision.

   EVERY ITEM IS "verify" or "unsourced". */

export const ENTRY_LEDGER = {
  marketId: 'ercot',
  basis: { powerMW: 100, durationHours: 2 },
  summary: [
    'Two fees to the system operator, one with the interconnection request and one with the application for a full interconnection study, and then security to the transmission provider for the interconnection facilities when the project gives notice to proceed. None has a sourced amount.',
    '须向系统运营机构缴纳两笔费用：一笔随并网申请缴纳，一笔在申请完整并网研究时缴纳；项目发出开工通知时，再向输电服务商提交并网设施建设所需的担保。三者均没有可查证的金额。'],
  limit: [
    'No amount here is sourced, so nothing can be totalled and every limit reads as unchecked. The fees are set in the fee schedule of the Nodal Protocols, which was not opened; the transmission provider charges its own study costs on top; and the security equals the cost of the interconnection facilities, which is per project. Land, studies and permitting are not sourced.',
    '此处没有任何金额有来源，因此无法合计，各项上限均显示为未核查。两笔费用的标准载于《节点协议》的收费表，该表尚未查阅；输电服务商另行收取其自身的研究费用；担保金额等于并网设施的造价，按项目核定。土地、研究与许可费用没有来源。'],
  items: [
    {
      id: 'interconnection-fee', kind: 'fee',
      label: ['Generation interconnection fee', '发电并网申请费'],
      amount: null,
      amountNote: ['Set in the fee schedule of the Nodal Protocols, which was not opened', '标准载于《节点协议》收费表，该表尚未查阅'],
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Paid with the interconnection request; not refunded, even if the screening study is waived or the project is cancelled for incomplete information', '随并网申请缴纳；即使免做筛查研究，或项目因资料不全被取消，也不予退还'],
      evidence: ['planningGuide5'], status: 'verify',
    },
    {
      id: 'full-study-fee', kind: 'study',
      label: ['Full interconnection study application fee', '完整并网研究申请费'],
      amount: null,
      amountNote: ['Set by MW in the same fee schedule; the transmission provider\'s own study costs are charged separately', '按MW在同一收费表中规定；输电服务商自身的研究费用另行收取'],
      postedAt: 'studies', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Paid with the request for the full study, within 180 days of the screening result and with proof of site control', '在收到筛查结果后180日内，连同场址控制权证明，随完整研究申请缴纳'],
      evidence: ['planningGuide5'], status: 'verify',
    },
    {
      id: 'interconnection-security', kind: 'security',
      label: ['Security for the interconnection facilities', '并网设施建设担保'],
      amount: null,
      amountNote: ['Enough to fund the transmission provider\'s interconnection facilities, which are costed per project', '须足以支付输电服务商的并网设施造价，该造价按项目核定'],
      postedAt: 'construction', releasedAt: 'entry',
      /* A draft flag: given with the notice to proceed, taken to be at or
         after the investment decision. */
      beforeFid: false, beforeConsent: null, refundable: true,
      form: ['Given to the transmission provider under the interconnection agreement, with the notice to proceed with construction', '依据并网协议，在发出开工通知时提交给输电服务商'],
      lostIf: ['Not read: the terms are in the standard interconnection agreement, which was not opened', '尚未查阅：相关条款载于标准并网协议，该协议尚未查阅'],
      evidence: ['planningGuide5'], status: 'verify',
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
