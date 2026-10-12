/* Germany — capital at risk before the investment decision.

   What the repository held was one number with no source: `bkzDeposit: 1500`
   in data.js, and a glossary line calling it a realisation deposit credited
   against the later connection cost contribution. The four transmission
   operators' procedure documentation for the first maturity-assessment cycle
   (version 1.2, 16 June 2026) was opened on 2026-10-12 and carries the amount,
   when it is paid, what it is credited against and how it is lost.

   THE TIMING FLAGS ARE THE ANALYST'S STATEMENT, of 2026-10-12, and not
   something the procedure says:

     - the realisation deposit falls before the investment decision, so it is
       capital at risk;
     - the connection cost contribution falls after it, and is listed here so
       that a reader sees it and sees that it is not counted.

   What the procedure does say about the contribution is that its first
   tranche, 30 to 50%, falls due on signing the connection contract or the
   connection construction contract. Whether that signing precedes the
   decision in practice is the analyst's to state, and he has.

   `beforeConsent` IS NULL on the deposit. The procedure asks an applicant for
   a written permitting strategy and not for a permit, so a deposit CAN fall
   due with no consent in hand; it does not say that it does. Until a source
   establishes it, security before consent is a lower bound.

   TRANSMISSION LEVEL ONLY. The procedure governs connections to the
   extra-high-voltage grid. A 100 MW project may connect at 110 kV to a
   distribution operator, whose terms are its own and were not opened.

   EVERY ITEM IS "verify", including those whose source was opened: the pages
   were read by a drafting agent, and "verified" is reserved for a source the
   analyst has opened himself. */

export const ENTRY_LEDGER = {
  marketId: 'de',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'At transmission level a storage project pays a flat fee to apply and, on accepting a connection offer, a deposit of EUR 1,500 per MW that is credited against the connection cost contribution if the project is built. The contribution itself is far larger and falls due in three tranches from the signing of the connection contract; by the analyst\'s statement that is after the investment decision, so it is listed and not counted.',
    '在输电网层面，储能项目申请并网须缴纳一笔定额申请费；接受并网要约时，再按每MW 1,500欧元缴纳实现保证金，项目建成后该保证金抵扣并网工程费分摊（BKZ）。BKZ本身金额大得多，自签署并网合同起分三期支付；按分析师的判断，这发生在最终投资决策之后，因此此处仅列示、不计入。'],
  limit: [
    'This is the transmission operators\' procedure only; a 100 MW project connecting at 110 kV meets a distribution operator\'s own terms, which were not opened. Land options, studies and permitting cost before the decision are not sourced, so the total is a lower bound. Whether the deposit falls before consent is not established: the procedure asks for a permitting strategy, not a permit. The contribution has no transmission-level amount; the dashboard\'s EUR 110,000 to 165,000 per MW comes from two distribution operators\' tariff sheets.',
    '此处仅为输电运营商的程序；100MW项目若接入110千伏电网，适用配电运营商自身的条款，相关文件尚未查阅。决策前的土地期权、研究与许可费用没有来源，因此合计为下限。保证金是否在取得许可之前缴纳尚未确立：该程序只要求提交许可策略，并不要求已取得许可。BKZ在输电网层面没有金额；看板中每MW 11万至16.5万欧元来自两家配电运营商的价目表。'],
  items: [
    {
      id: 'application-fee', kind: 'fee',
      label: ['Connection application fee, per application', '并网申请费（每份申请）'],
      amount: { fixed: 50000, currency: 'EUR' },
      postedAt: 'application', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Invoiced by the transmission operator on receipt of the application; unpaid by the invoice date, the application counts as not made. Half is returned if the application is excluded for failing the minimum requirements; an admissible application that gets no offer carries into the next cycle without paying again',
             '输电运营商收到申请后开具发票；逾期未付的，视为未提交申请。申请因不满足最低要求被排除的，退还一半；申请合格但未获要约的，可转入下一周期而无需再次缴费'],
      evidence: ['rgvDoc'], status: 'verify',
    },
    {
      id: 'realisation-deposit', kind: 'deposit',
      label: ['Realisation deposit on accepting a connection offer', '接受并网要约时缴纳的实现保证金'],
      amount: { perMW: 1500, currency: 'EUR' },
      /* Credited against the contribution "later"; the procedure names no
         stage, so the last one is used and the carrying period is the longest
         it could be. */
      postedAt: 'studies', releasedAt: 'entry',
      /* beforeFid is the analyst's statement of 2026-10-12. */
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Cash against the operator\'s invoice, plus VAT where it applies, within one month of the offer; one operator also accepts it early, as a pledged bank balance, in place of a credit rating',
             '凭运营商发票以现金支付（如适用，另加增值税），须在收到要约后一个月内缴纳；其中一家运营商也接受提前以质押银行存款的方式缴纳，用以替代信用评级'],
      lostIf: ['The project is not carried out for reasons within the applicant\'s own sphere of risk. If it is built, the deposit is credited in full against the connection cost contribution',
               '项目因申请人自身风险范围内的原因未能实施。项目建成的，保证金全额抵扣并网工程费分摊（BKZ）'],
      evidence: ['rgvDoc'], status: 'verify',
    },
    {
      /* Known to exist, with no figure and no source. It is listed so that the
         total before the decision reads as a lower bound, which it is. */
      id: 'development-spend', kind: 'consent',
      label: ['Land options, studies and permitting before the decision', '决策前的土地期权、研究与许可费用'],
      amount: null,
      amountNote: ['Not sourced. The procedure asks for an agreement with the landowner, a land-register extract, a permitting strategy and a technical connection concept before an application is admissible; what those cost is not published',
                   '尚无来源。该程序要求在申请获准受理前提交与土地所有人的协议、土地登记簿摘录、许可策略及并网技术方案；这些工作的费用没有公开数据'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and authorities', '支付给土地所有人、咨询机构与主管机关'],
      evidence: [], status: 'unsourced',
    },
    {
      id: 'connection-contribution', kind: 'fee',
      label: ['Connection cost contribution (Baukostenzuschuss)', '并网工程费分摊（BKZ）'],
      amount: null,
      amountNote: ['Calculated by each operator on the capacity drawn; no transmission-level amount is published. The dashboard holds EUR 110,000 to 165,000 per MW from two distribution operators\' tariff sheets',
                   '由各运营商按取用容量核定；输电网层面没有公开金额。看板所载每MW 11万至16.5万欧元来自两家配电运营商的价目表'],
      postedAt: 'studies', releasedAt: null,
      /* The analyst's statement of 2026-10-12: it falls after the decision. */
      beforeFid: false, beforeConsent: null, refundable: false,
      form: ['Three tranches: 30 to 50% on signing the connection contract or the connection construction contract, 30 to 50% eighteen months later or at the start of construction, and 20% when the connection is commissioned. The realisation deposit is credited against it',
             '分三期支付：签署并网合同或并网建设合同时支付30%至50%；十八个月后或开工时支付30%至50%；并网点投运时支付20%。已缴纳的实现保证金可予抵扣'],
      evidence: ['rgvDoc', 'bkzFaq', 'bgh'], status: 'verify',
    },
  ],
};
