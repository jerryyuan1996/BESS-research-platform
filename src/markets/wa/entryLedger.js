/* Western Australia — capital at risk before the investment decision.

   The repository held nothing on security or guarantees for this market.

   Both pages behind this ledger have now been opened. The market operator's
   page on Reserve Capacity Security — the one large item — was opened by the
   analyst on 2026-10-11, after an automated reader was stopped by a bot check;
   that item is "verified". The network operator's fee schedule was opened the
   same day by the drafting agent, so its fees stay at "verify".

   The security for connection works was "unsourced" until the regulator's
   approved access arrangement was opened: the standard access contract and the
   Contributions Policy set out what is secured, when and how it is released.
   They give a rule and no number — the amount depends on each project's works —
   so the item is sourced and still has no amount. NO DEAL FIGURE BELONGS HERE.
   An amount seen in one project's contract is deal-derived however it is
   rounded, and stays in the private overlay until a public document gives one.

   The security amount is DERIVED, and the derivation is the fragile part. The
   rule is 25% of the Peak Benchmark Reserve Capacity Price multiplied by the
   Peak Certified Reserve Capacity ASSIGNED — not by nameplate. This ledger
   takes the whole 200 MW as assigned; a seven-hour battery certified for less
   posts less, in proportion. */

/* 2028-29 Benchmark Reserve Capacity Price, A$ per MW per year — the ERA final
   determination already cited as `brcp` in sources.js and verified in claims.js. */
const BRCP_AUD_PER_MW = 488500;
const SECURITY_SHARE_OF_BRCP = 0.25;

const AEMO_RCS = {
  publisher: 'AEMO — Reserve Capacity Security',
  url: 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-security',
  access: 'opened',
};
const WP_FEES = {
  publisher: 'Western Power — contracts, costs and timeframes',
  url: 'https://www.westernpower.com.au/products-services/install-something-new/connect-my-home-or-business/transmission-connected-loads-generators/contracts-costs-and-timeframes/',
  access: 'opened',
};

/* The access arrangement approved by the regulator on 31 March 2023, for
   1 July 2023 to 30 June 2027. A new one is due from 1 July 2027. */
const CONTRIBUTIONS_POLICY = {
  publisher: 'Economic Regulation Authority — approved access arrangement, Appendix C.1: Contributions Policy',
  url: 'https://www.erawa.com.au/sites/default/files/23690/WP-AA5-Approved-Access-Arrangement-Appendix-C-1-Contributions-Policy-Clean-PDF-Version.PDF',
  access: 'opened',
};
const STANDARD_ACCESS_CONTRACT = {
  publisher: 'Economic Regulation Authority — approved access arrangement, Appendix A: Electricity Transfer Access Contract',
  url: 'https://www.erawa.com.au/sites/default/files/23688/WP-AA5-Approved-Access-Arrangement-Appendix-A-Electricity-Transfer-Access-Contract-Clean-PDF-Version.PDF',
  access: 'opened',
};

const fee = (id, label, amount, postedAt) => ({
  id, kind: 'fee', label,
  amount: { fixed: amount, currency: 'AUD' },
  postedAt, releasedAt: null,
  beforeFid: true, beforeConsent: null, refundable: false,
  form: ['Cash fee to the network operator', '向电网运营商支付的现金费用'],
  evidence: [WP_FEES], status: 'verify',
});

export const ENTRY_LEDGER = {
  marketId: 'wa',
  basis: { powerMW: 200, durationHours: 7 },
  summary: [
    'The dominant item is Reserve Capacity Security, posted to the market operator for each megawatt certified, ahead of the Capacity Year it covers. The network operator\'s published fees and studies before an access offer are small beside it.',
    '最大的一项是备用容量保证金：按每一兆瓦认证容量向市场运营机构提交，且早于其对应的容量年度。与之相比，取得接入要约前电网运营商公布的各项费用与研究费很小。'],
  limit: [
    'The security is 25% of the benchmark price for each megawatt of Peak Certified Reserve Capacity assigned; it is taken here on the full 200 MW and is lower if less is assigned. Security for connection works is discretionary and set per project, so it has no amount and every total is a lower bound; the capital contribution for those works is likewise project-specific and is not listed. The network operator states its fees are estimates, reconciled to actual cost. Project scoping is entered at the low end of its published range, and studies after the access offer are left out.',
    '保证金为基准价的25%乘以所获分配的高峰认证备用容量；此处按200MW全额计，若获分配容量较少则相应减少。并网工程担保由运营商酌定并按项目确定，因此没有金额，所有合计均为下限；并网工程的出资额同样因项目而异，未予列示。电网运营商说明其费用为估算，最终按实际成本结算。项目范围界定按公布区间的下限计入，接入要约之后的研究未计入。'],
  items: [
    {
      id: 'reserve-capacity-security', kind: 'security',
      label: ['Reserve Capacity Security', '备用容量保证金'],
      amount: { perMW: BRCP_AUD_PER_MW * SECURITY_SHARE_OF_BRCP, currency: 'AUD' },
      /* Due once Certified Reserve Capacity is assigned to a facility that has
         yet to enter service; if it is not provided in the right amount and
         form by the due date, the certification lapses. */
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Guarantee, bank undertaking or security deposit, held by the market operator', '保函、银行承诺函或保证金存款，由市场运营机构持有'],
      lostIf: ['The facility has not met its operating requirements by the end of the Capacity Year: the participant may have to pay the market an amount equal to the security, and the operator may apply the security to it. Returned once the facility runs at 90% of its Required Level in two Trading Intervals, or an independent expert confirms it can, and is in Commercial Operation.',
               '设施在容量年度结束时仍未达到运行要求：参与者可能须向市场支付与保证金等额的款项，运营机构可直接以保证金抵付。设施在两个交易时段内达到要求出力水平的90%（或经独立专家确认具备该能力）并进入商业运行后，保证金予以返还。'],
      evidence: [AEMO_RCS, 'brcp'], status: 'verified',
    },
    fee('connection-application-fee', ['Connection application fee', '并网申请费'], 5000, 'application'),
    fee('options-assessment-fee', ['Options assessment fee', '方案评估费'], 25000, 'studies'),
    /* Steady-state study 35k, grid input package 30k, model due diligence 10k,
       performance-standards validation 15k and scope definition 35k: the
       operator-performed versions a generator needs before scoping. */
    fee('initiation-studies', ['Initiation studies and scope definition', '启动阶段研究与范围界定'], 125000, 'studies'),
    fee('project-scoping', ['Project scoping, low end of A$75,000–350,000', '项目范围界定（公布区间A$75,000–350,000的下限）'], 75000, 'studies'),
    fee('offer-preparation-fee', ['Access offer preparation fee', '接入要约编制费'], 55000, 'studies'),
    {
      id: 'network-works-security', kind: 'security',
      label: ['Security for connection works', '并网工程担保'],
      amount: null,
      amountNote: ['At the network operator\'s discretion: up to the lesser of the estimated new revenue and the forecast cost of the works allocated to the project. Project-specific; no amount is published',
                   '由电网运营商酌定：以预计新增收入与分摊至本项目的工程预测成本两者中较低者为限。因项目而异，没有公开金额'],
      /* Due before the works start. Whether that falls before the investment
         decision depends on the project; taken as before, so that the total
         stays a lower bound rather than omitting it. */
      postedAt: 'procurement', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Unconditional, irrevocable bank guarantee or equivalent, required only where the network operator sees a risk of not recovering the revenue', '无条件、不可撤销的银行保函或同等金融工具；仅在电网运营商认为存在收入无法收回的风险时才要求提供'],
      lostIf: ['Called if the revenue it guarantees is not received. Reviewed 24 months after the service starts: returned if the risk has gone, reduced if it has abated. A separate guarantee may be required for a contribution paid in instalments', '所担保的收入未能收到时即可兑付。服务开始24个月后复核：风险消除则退还，风险减轻则调减。出资额分期支付的，可另行要求提供保函'],
      evidence: [CONTRIBUTIONS_POLICY, STANDARD_ACCESS_CONTRACT], status: 'verify',
    },
  ],
};
