/* Great Britain — capital at risk before the investment decision.

   DRAFT, 2026-10-11. Until now this ledger was empty on purpose: the
   repository mentioned connection security once and held no amount, no
   instrument and no release rule. NESO's connections pages and CUSC Section 15
   have since been opened, and what they say is recorded here.

   The finding is that almost nothing has a published number. One item does:
   the cap on the cancellation charge before the trigger date, GBP 1,000 per MW
   in the first financial year. The rest is real and unquantified — a fee set
   by a schedule that was not opened, a liability that depends on each
   project's works, a commitment fee that exists in the code and is switched
   off, and capacity-auction credit cover whose amount was found only in
   secondary summaries that disagree.

   So the total is a lower bound, and a low one. It must not be read as "Great
   Britain asks for little": every investor limit stays unchecked rather than
   passed. See limitInputs in src/entry/ledger.js.

   The `beforeFid` and `beforeConsent` flags are a first reading for the
   analyst to confirm. They rest on one fact from the sources: a Gate 2 offer
   is open to a project with land rights and no planning consent, and security
   falls due a month after it is signed. */

/* EVERY ITEM IS "verify", including those whose source was opened. The pages
   were read by a drafting agent on 2026-10-11, and "verified" is reserved for
   a source the analyst has opened himself — the same rule the other ledgers
   follow. An item moves up when he has looked at it. */

/* Found by search and not opened: an explanatory memorandum to the 2026
   capacity regulations. A second summary gives different figures. */
const CM_CREDIT_COVER = {
  publisher: 'UK Parliament — explanatory memorandum to the Electricity Capacity (Amendment and Transitional Provision) Regulations 2026',
  url: 'https://commonsbusiness.parliament.uk/Document/106496/Pdf',
  access: 'search-summary',
};

export const ENTRY_LEDGER = {
  marketId: 'gb',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'One figure is published and four are not. Security against the cancellation charge starts at up to £1,000 per MW when a Gate 2 offer is signed and rises with the project\'s own network works; the application fee, the dormant commitment fee and capacity-auction credit cover have no amount here.',
    '只有一项金额是公开的，其余四项都没有。取消费用担保在签署Gate 2要约时最高为每MW 1,000英镑，此后随项目自身的电网工程而增加；申请费、尚未启用的进度承诺费以及容量拍卖的信用保证，在此均无金额。'],
  limit: [
    'Four of five items have no amount, so the total is a lower bound and a low one. The application fee is set by a charging schedule that was not opened. The cancellation charge after the trigger date depends on each project\'s works and is not public, and the share of it that must be secured is set in an annual statement that was not opened. The one figure given is a cap, not a quote. Capacity-auction credit cover was found only in secondary summaries that disagree. Land, planning and study costs are not sourced.',
    '五项中有四项没有金额，因此合计只是下限，而且偏低。申请费由一份未打开的收费表确定。触发日之后的取消费用取决于各项目的电网工程，并不公开；其中须提供担保的比例由一份未打开的年度说明规定。唯一给出的数字是上限，而不是报价。容量拍卖的信用保证只在相互矛盾的二手摘要中查到。土地、规划及研究费用尚无来源。'],
  items: [
    {
      id: 'application-fee', kind: 'fee',
      label: ['Connection application fee', '并网申请费'],
      amount: null,
      amountNote: ['Set by the charging statement by connection type, size and location, and capped at £400,000 for generation; the schedule was not opened', '由收费说明按并网类型、规模和区位确定，发电类上限为40万英镑；收费表未打开'],
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: true, refundable: false,
      form: ['Cash with the application; a variable fee is reconciled to the time spent, and may be returned in full on a very early withdrawal', '随申请以现金缴纳；选择浮动收费的，按实际耗用工时结算，极早撤回的可全额退还'],
      evidence: ['queueFaq'], status: 'verify',
    },
    {
      id: 'cancellation-security-pre-trigger', kind: 'security',
      label: ['Security for the cancellation charge before the trigger date, first financial year', '触发日前取消费用担保（首个财政年度）'],
      /* A cap under the fixed option: the lower of this and the charge three
         financial years before the charging year. It rises to 2,000 and then
         3,000 per MW in the second and third years. */
      amount: { perMW: 1000, currency: 'GBP' },
      postedAt: 'studies', releasedAt: 'entry',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Cash, parent company guarantee, letter of credit or bond, within a month of signing the offer; the share to be secured is set in the annual cancellation charge statement', '现金、母公司担保、信用证或履约保函，须在签署要约后一个月内提供；须提供担保的比例由年度取消费用说明规定'],
      lostIf: ['The agreement is terminated or its capacity reduced before completion, when the cancellation charge becomes payable. The cap rises to £2,000 per MW in the second financial year and £3,000 from the third', '协议在完工前终止或容量被调减的，取消费用即应支付。该上限在第二个财政年度升至每MW 2,000英镑，自第三个财政年度起为每MW 3,000英镑'],
      evidence: ['cusc15', 'queueFaq'], status: 'verify',
    },
    {
      id: 'cancellation-security-post-trigger', kind: 'security',
      label: ['Security for the cancellation charge from the trigger date', '触发日起的取消费用担保'],
      amount: null,
      amountNote: ['The cost of the works attributable to the project, plus a wider charge; set out in each project\'s cancellation charge statement and not public', '归属于本项目的电网工程费用，另加一项广域费用；载于各项目的取消费用说明，并不公开'],
      /* The trigger date is the 1 April three financial years before the year
         of connection — for most projects, before the investment decision. */
      postedAt: 'procurement', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['The same instruments, re-stated for each security period', '担保形式同上，按各担保期重新核定'],
      lostIf: ['The agreement is terminated or its capacity reduced before completion', '协议在完工前终止或容量被调减'],
      evidence: ['cusc15'], status: 'verify',
    },
    {
      id: 'progression-commitment-fee', kind: 'security',
      label: ['Progression Commitment Fee', '进度承诺费'],
      amount: null,
      amountNote: ['Dormant at nil. If activated, £2,500 per MW rising every six months to £10,000; activation needs more than 6.5 GW of terminations before the end of 2030, and the count stood at 0 MW', '目前未启用，金额为零。一旦启用，起始为每MW 2,500英镑，每六个月上调一次，上限为每MW 10,000英镑；启用条件是2030年底前终止的容量累计超过6.5GW，而当前统计为0MW'],
      postedAt: 'studies', releasedAt: 'consent',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Security posted on activation by a project holding a Gate 2 offer that has not yet submitted for planning', '启用后，由已持有Gate 2要约但尚未提交规划申请的项目提供担保'],
      lostIf: ['The project terminates or reduces its capacity before submitting for planning (milestone M1). Returned once M1 is met', '项目在提交规划申请（里程碑M1）之前终止或调减容量。达到M1后退还'],
      evidence: ['pcf'], status: 'verify',
    },
    {
      id: 'capacity-market-credit-cover', kind: 'security',
      label: ['Capacity Market credit cover for a new build', '新建项目的容量市场信用保证'],
      amount: null,
      amountNote: ['Charged per de-rated MW. Regulations in force from July 2026 changed the amount; the figures found, £10,000 rising to £13,000 per MW, come from summaries that disagree and were not checked against the regulations', '按折减后容量每MW计收。2026年7月生效的条例调整了金额；查到的数字为每MW 10,000英镑升至13,000英镑，但出自相互矛盾的摘要，尚未对照条例原文核实'],
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Credit cover under the Capacity Market Rules; when it falls due was not verified', '《容量市场规则》项下的信用保证；何时须提交尚未核实'],
      lostIf: ['Release and forfeiture conditions not yet verified', '释放与没收条件尚未核实'],
      evidence: [CM_CREDIT_COVER], status: 'verify',
    },
  ],
};
