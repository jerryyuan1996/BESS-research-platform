/* Ontario — capital at risk before the investment decision.

   Read from IESO's final LT2(c-1) RFP (10 November 2025) and contract
   (4 November 2025) on 2026-10-23. The entry cost in Ontario is the
   procurement, not the connection: a bid carries a fee and a letter of credit
   per MW, and the letter of credit becomes the contract's completion security
   on award and is drawn for delay. */

const RFP = {
  publisher: 'IESO — LT2(c-1) RFP, consolidated with Addenda 1–4',
  url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20251110-RFP-Consolidated-with-Addendum-1-2-3-4.pdf',
  access: 'opened',
};
const CONTRACT = {
  publisher: 'IESO — LT2(c-1) Contract, consolidated with Addenda 1–3',
  url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20251104-Contract-Consolidated-with-Addendum-1-and-2-and-3.pdf',
  access: 'opened',
};

export const ENTRY_LEDGER = {
  marketId: 'ca_on',
  basis: { powerMW: 50, durationHours: 8 },
  summary: [
    'A bid costs a C$11,300 fee and a letter of credit of C$35,000 per MW. On award the letter of credit becomes the contract\'s completion security, is drawn at C$150/MW per Business Day of delay, and steps down to C$20,000/MW at commercial operation.',
    '投标须缴纳11,300加元费用并提交每MW 35,000加元的信用证。中标后该信用证转为合同完工担保，每延误一个工作日按每MW 150加元扣收，并于商业运行时降至每MW 20,000加元。'],
  limit: [
    'The security is C$0.5m at least and C$15m at most per proposal. The C$20,000/MW held for the twenty-year term after commercial operation is not counted here because it falls after entry. Land, permitting, the environmental assessment and the connection studies before a bid are not sourced; Napanee Phase 2 was still in its environmental assessment after award.',
    '每份投标的担保最低50万加元、最高1,500万加元。商业运行后二十年期内持有的每MW 20,000加元担保发生在进入之后，未计入本表。投标前的土地、许可、环境评估与并网研究费用尚无来源；Napanee二期在中标后仍处于环境评估阶段。'],
  items: [
    {
      id: 'proposal-fee', kind: 'fee',
      label: ['LT2 proposal fee', 'LT2投标费'],
      amount: { fixed: 11300, currency: 'CAD' },
      postedAt: 'revenue', releasedAt: null,
      beforeFid: true, beforeConsent: true, refundable: false,
      form: ['Electronic funds transfer to the IESO, per proposal, HST included', '向IESO电汇，按每份投标计，含HST'],
      evidence: [RFP], status: 'verified',
    },
    {
      id: 'proposal-security', kind: 'security',
      label: ['Proposal security, converted to completion and performance security', '投标担保，转为完工与履约担保'],
      amount: { perMW: 35000, currency: 'CAD' },
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Irrevocable standby letter of credit in the IESO\'s form', 'IESO格式的不可撤销备用信用证'],
      lostIf: ['Drawn for delay liquidated damages of C$150/MW per Business Day after the 1 May 2030 milestone, for up to 548 days, and forfeit on default if commercial operation is not reached by the longstop eighteen months later', '自2030年5月1日里程碑起，每延误一个工作日按每MW 150加元扣收延误违约金，最长548天；若在其后十八个月的最终期限前仍未商业运行，则构成违约并被没收'],
      evidence: [RFP, CONTRACT], status: 'verified',
    },
  ],
};
