/* Western Australia — capital at risk before the investment decision.

   The repository held nothing on security or guarantees for this market. What
   is here was found on 2026-10-10 and NONE OF IT HAS BEEN OPENED: the market
   operator's page refused an automated fetch and the network operator's fee
   schedule was read from a search summary. Under the claim pilot's rule a
   source that was not opened establishes nothing, so every item is "verify"
   and one is "unsourced". The ledger exists to say what has to be opened, and
   to carry the figures once somebody has.

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
  access: 'search-summary',
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
    'The dominant item is Reserve Capacity Security, posted to the market operator for each megawatt certified, ahead of the Capacity Year it covers. Published network fees before an offer are small beside it.',
    '最大的一项是备用容量保证金：按每一兆瓦认证容量向市场运营机构提交，且早于其对应的容量年度。与之相比，取得并网要约前已公布的电网费用很小。'],
  limit: [
    'No source here has been opened. The security is derived as 25% of the benchmark price on the full 200 MW and would be lower if less is certified. The security the network operator requires for connection works is not sourced and has no amount, so every total is a lower bound. Study costs are charged on top of the published fees and are not included.',
    '此处所有来源均未实际打开核对。保证金按基准价的25%、以200MW全额认证推算；若认证容量低于装机，金额会相应减少。电网运营商就并网工程要求的担保尚无来源、没有金额，因此所有合计均为下限。研究费用在已公布费用之外另行收取，未计入。'],
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
    fee('offer-preparation-fee', ['Access offer preparation fee', '接入要约编制费'], 55000, 'studies'),
    {
      id: 'network-works-security', kind: 'security',
      label: ['Security for connection works', '并网工程担保'],
      amount: null,
      amountNote: ['Required by the network operator against the works it builds; amount and terms not sourced', '电网运营商就其承建工程要求的担保；金额与条款尚无来源'],
      postedAt: 'studies', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Not sourced', '尚无来源'],
      lostIf: ['Not sourced', '尚无来源'],
      evidence: [], status: 'unsourced',
    },
  ],
};
