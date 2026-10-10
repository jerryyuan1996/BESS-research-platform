/* Western Australia — capital at risk before the investment decision.

   The repository held nothing on security or guarantees for this market.

   The network operator's fee schedule was opened on 2026-10-11 and its fees
   are as first found. The market operator's page on Reserve Capacity Security
   — the one large item — still has NOT been opened: it sits behind a bot check
   that an automated reader must not pass. Under the claim pilot's rule a
   source that was not opened establishes nothing, so that item rests on a
   search summary until a person opens it. Everything stays at "verify" either
   way, because the schedule was read by an agent and not by the analyst, and
   one item is "unsourced".

   The security amount is DERIVED, and the derivation is the fragile part:
   25% of the benchmark price, per megawatt certified, taking the whole 200 MW
   as certified. A seven-hour battery may be certified for less than nameplate,
   which would lower it. */

/* 2028-29 Benchmark Reserve Capacity Price, A$ per MW per year — the ERA final
   determination already cited as `brcp` in sources.js and verified in claims.js. */
const BRCP_AUD_PER_MW = 488500;
const SECURITY_SHARE_OF_BRCP = 0.25;

const AEMO_RCS = {
  publisher: 'AEMO — Reserve Capacity Security',
  url: 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-security',
  access: 'search-summary',
};
const WP_FEES = {
  publisher: 'Western Power — contracts, costs and timeframes',
  url: 'https://www.westernpower.com.au/products-services/install-something-new/connect-my-home-or-business/transmission-connected-loads-generators/contracts-costs-and-timeframes/',
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
    'The page behind the security has not been opened. The security is derived as 25% of the benchmark price on the full 200 MW and would be lower if less is certified. The network operator\'s fee page names no security for connection works; whether one is required is not sourced and has no amount, so every total is a lower bound. The network operator states its fees are estimates, reconciled to actual cost. Project scoping is entered at the low end of its published range, and studies after the access offer are left out.',
    '保证金所依据的页面尚未打开核对。保证金按基准价的25%、以200MW全额认证推算；若认证容量低于装机，金额会相应减少。电网运营商的收费页面未提及并网工程担保；是否需要担保尚无来源、没有金额，因此所有合计均为下限。电网运营商说明其费用为估算，最终按实际成本结算。项目范围界定按公布区间的下限计入，接入要约之后的研究未计入。'],
  items: [
    {
      id: 'reserve-capacity-security', kind: 'security',
      label: ['Reserve Capacity Security', '备用容量保证金'],
      amount: { perMW: BRCP_AUD_PER_MW * SECURITY_SHARE_OF_BRCP, currency: 'AUD' },
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Security lodged with the market operator', '向市场运营机构提交的担保'],
      lostIf: ['The facility does not meet its Reserve Capacity obligations for the Capacity Year — return conditions not yet read from the rule', '设施未能在相应容量年度履行备用容量义务——返还条件尚未对照规则原文核实'],
      evidence: [AEMO_RCS, 'brcp'], status: 'verify',
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
      amountNote: ['Not named on the network operator\'s fee page; whether it is required, and how much, is not sourced', '电网运营商收费页面未提及；是否需要、金额多少，均尚无来源'],
      postedAt: 'studies', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Not sourced', '尚无来源'],
      lostIf: ['Not sourced', '尚无来源'],
      evidence: [], status: 'unsourced',
    },
  ],
};
