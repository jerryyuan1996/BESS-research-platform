/* Poland — capital at risk before the investment decision.

   The dashboard held one weighted line, "deposits, securities and release
   path", and no amounts. The amounts are statutory: Article 7 of the Energy
   Law, read on 2026-10-12 in the consolidated text the Sejm's chancellery
   dates 22 July 2026. That text carries the higher figures (PLN 60 per kW,
   capped at PLN 6 million) and not the PLN 30 and PLN 3 million that older
   operator forms still quote.

   AMOUNTS ARE IN ZŁOTY, AND THE PLATFORM HOLDS NO ZŁOTY RATE. The rate table
   in comparison/assumptions.js is methodology and has no PLN entry, so no
   total here converts to dollars and every limit reads as unchecked. The
   amounts are stated in the currency the statute states them in; a rate is
   the analyst's to add.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM. The application
   fee and the advance fall with the application, which is taken here to be
   before the investment decision. The security follows the connection
   agreement by fourteen days; whether that is before or after his decision is
   his to state, and it is counted as before until he says otherwise.

   `beforeConsent` is null throughout. The statute asks an applicant for a
   declaration that the site is admissible under the local plan (para 8d); it
   does not say where the building permit sits.

   EVERY ITEM IS "verify": the text was read by a drafting agent, and
   "verified" is reserved for a source the analyst has opened himself. */

export const ENTRY_LEDGER = {
  marketId: 'pl',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'Three statutory payments for a connection above 1 kV: a small fee to apply, an advance on the connection fee of PLN 60 per kW within fourteen days of applying, and security of PLN 30 per kW within fourteen days of the connection agreement. On the 100 MW reference project that is PLN 100,000, PLN 6 million and PLN 3 million.',
    '接入1千伏以上电网须依法缴纳三笔款项：金额不大的申请费；提交申请后14日内按每千瓦60兹罗提预缴的并网费预付款；以及签订并网协议后14日内按每千瓦30兹罗提提交的履约担保。以100MW参考项目计，分别为10万、600万和300万兹罗提。'],
  limit: [
    'The amounts are in złoty and the platform holds no złoty rate, so no total converts to dollars and no limit can be checked. The advance cannot exceed the expected connection fee, which is set per project, so PLN 6 million is its ceiling and not a finding. Land, studies and permitting before the decision are not sourced. Whether the security falls before the investment decision, and whether any of this falls before consent, is not established.',
    '金额以兹罗提计，而本平台没有兹罗提汇率，因此合计无法折算为美元，各项上限也无从核查。预付款不得超过预计并网费，而并网费按项目核定，因此600万兹罗提只是其上限，并非实际数额。决策前的土地、研究与许可费用没有来源。履约担保是否在投资决策之前提交，以及上述款项是否发生在取得许可之前，均未确立。'],
  items: [
    {
      id: 'application-fee', kind: 'fee',
      label: ['Fee for the application for connection conditions', '并网条件申请费'],
      /* PLN 1 per kW, capped at PLN 100,000: the cap binds at 100 MW. */
      amount: { fixed: 100000, currency: 'PLN' },
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Paid separately for each connection point, with proof attached to the application; without it the application is not considered. Not returned',
             '按每个并网点分别缴纳，缴费凭证随申请提交；未缴纳的，申请不予受理。不予退还'],
      evidence: ['energyLawArt7'], status: 'verify',
    },
    {
      id: 'connection-advance', kind: 'deposit',
      label: ['Advance on the connection fee', '并网费预付款'],
      /* PLN 60 per kW, capped at PLN 6,000,000 and at the expected connection
         fee: the PLN 6 million cap binds at 100 MW. */
      amount: { fixed: 6000000, currency: 'PLN' },
      postedAt: 'application', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Cash to the operator within fourteen days of applying, or the application is not considered. Set against the connection fee; any excess over that fee is returned with statutory interest',
             '提交申请后14日内以现金缴至运营商，否则申请不予受理。用于抵扣并网费；超出并网费的部分连同法定利息退还'],
      lostIf: ['Returned at once if the operator refuses conditions or a connection agreement for want of technical or economic conditions. What becomes of it if the applicant withdraws was not read',
               '运营商以不具备技术或经济条件为由拒绝出具并网条件或签订并网协议的，立即退还。申请人自行撤回时如何处理，尚未查阅'],
      evidence: ['energyLawArt7'], status: 'verify',
    },
    {
      id: 'connection-security', kind: 'security',
      label: ['Security for performance of the connection agreement', '并网协议履约担保'],
      /* PLN 30 per kW on the first 100 MW, PLN 60 above, capped at PLN 12m. */
      amount: { perKW: 30, currency: 'PLN' },
      postedAt: 'studies', releasedAt: 'entry',
      /* A draft flag: the analyst states whether this precedes his decision. */
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['A deposit on an interest-bearing account, an insurance or bank guarantee, or a parent-company surety, filed within fourteen days of the connection agreement or the agreement lapses by law. A cash deposit may be set against the connection fee on request',
             '可采用计息账户保证金、保险或银行保函，或母公司担保，须在签订并网协议后14日内提交，否则协议依法失效。现金保证金可应申请抵扣并网费'],
      lostIf: ['The applicant does not seek a connection agreement, or refuses one, while the conditions are valid; or the agreement is ended more than 36 months after signing for reasons other than the operator\'s fault',
               '申请人在并网条件有效期内未申请签订或拒绝签订并网协议；或并网协议在签订满36个月之后因运营商过错以外的原因被解除'],
      evidence: ['energyLawArt7'], status: 'verify',
    },
    {
      /* Known to exist, with no figure and no source. Listed so that the total
         before the decision reads as a lower bound, which it is. */
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and permitting before the decision', '决策前的土地、研究与许可费用'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and authorities', '支付给土地所有人、咨询机构与主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
