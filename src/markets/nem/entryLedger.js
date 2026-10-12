/* The NEM — capital at risk before the investment decision.

   LOOKED AT, AND NOTHING SOURCED. A NEM project applies to a network service
   provider, pays for its studies and for the connection assets, and may post
   security under a tender or a renewable-zone access scheme. On 2026-10-12 the
   market operator's connections page refused an automated fetch, as its
   Western Australian pages did before it, and no network provider's schedule
   was opened.

   So the items are listed as known to exist, with no amount and no source.
   Nothing here is evidence; it is a list of what to open.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM. */

export const ENTRY_LEDGER = {
  marketId: 'nem',
  basis: { powerMW: 280, durationHours: 4 },
  summary: [
    'Known to exist and not sourced: connection application and study charges paid to the network service provider, and security under a tender award or a renewable-zone access scheme where one applies.',
    '已知存在但尚无来源：向电网服务商支付的并网申请与研究费用；以及在适用情形下，依据招标中标或可再生能源区接入机制须提交的担保。'],
  limit: [
    'Nothing here is sourced, so nothing can be totalled and every limit reads as unchecked. Connection charges are negotiated with each network service provider, and tender security terms are in each round\'s guidelines; none was opened.',
    '此处没有任何内容有来源，因此无法合计，各项上限均显示为未核查。并网费用须与各电网服务商协商确定，招标担保条款载于各轮招标指引；均未查阅。'],
  items: [
    {
      id: 'connection-charges', kind: 'study',
      label: ['Connection application and study charges', '并网申请与研究费用'],
      amount: null,
      amountNote: ['Not sourced. Charged by the network service provider, per project', '尚无来源。由电网服务商按项目收取'],
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Paid to the network service provider through the enquiry and application stages', '在咨询与申请阶段向电网服务商支付'],
      evidence: [], status: 'unsourced',
    },
    {
      id: 'tender-security', kind: 'security',
      label: ['Security under a tender award or access scheme', '招标中标或接入机制下的担保'],
      amount: null,
      amountNote: ['Not sourced. Set in each tender round\'s guidelines or each access scheme', '尚无来源。由各轮招标指引或各接入机制规定'],
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['A bid bond or performance security, where the project takes a tendered contract', '项目取得招标合同的，须提交投标保函或履约担保'],
      lostIf: ['Not sourced', '尚无来源'],
      evidence: [], status: 'unsourced',
    },
    {
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and planning approval before the decision', '决策前的土地、研究与规划审批费用'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and planning authorities', '支付给土地所有人、咨询机构与规划主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
