/* Spain — capital at risk before the investment decision.

   Read on 2026-10-29. The entry cost in Spain is the connection queue: storage
   that exports applies for access and connection as a generator does and
   posts a guarantee of €40/kW installed, returned when the plant reaches
   operation and lost if the project falls away. The figure comes from the
   Galician government's official guide to the national rule, so the item
   stays at "verify" until the consolidated royal decree is read. */

const GUARANTEE_GUIDE = {
  publisher: 'Xunta de Galicia — guide to grid access and connection guarantees',
  url: 'https://ficheiros-web.xunta.gal/cei/enerxia/guia-garantias-redes-enerxia-electrica-cas.pdf',
  access: 'opened',
};

export const ENTRY_LEDGER = {
  marketId: 'es',
  basis: { powerMW: 50, durationHours: 4 },
  summary: [
    'An access and connection application posts a guarantee of €40/kW installed — €2m for 50 MW — returned at operation. Saturated nodes are allocated by tender.',
    '接入与并网申请须按装机每kW €40提交担保 — 50MW为200万欧元 — 投运后退还。饱和节点通过招标分配。'],
  limit: [
    'Land, the environmental assessment, the administrative authorisations and the cost of a capacity tender are not sourced. A 2026 change repealed the separate guarantee regime for demand and storage connections in article 23 bis; whether that touches the generation rule shown here has not been read.',
    '土地、环境评估、行政许可及容量招标的费用尚无来源。2026年的一项修订废止了第23条之二中针对需求侧与储能接入的单独担保制度；该修订是否影响此处所示的发电规则尚未核阅。'],
  items: [
    {
      id: 'access-guarantee', kind: 'security',
      label: ['Access and connection guarantee', '接入与并网担保'],
      amount: { perMW: 40000, currency: 'EUR' },
      postedAt: 'application', releasedAt: 'entry',
      beforeFid: true, beforeConsent: true, refundable: true,
      form: ['Bank guarantee or cash deposit lodged before the application is admitted', '在申请受理前提交银行保函或现金存款'],
      lostIf: ['Forfeit if the project withdraws or does not reach operation within the deadlines the access permit sets', '若项目撤回或未在接入许可规定期限内投运则被没收'],
      evidence: [GUARANTEE_GUIDE], status: 'verify',
    },
  ],
};
