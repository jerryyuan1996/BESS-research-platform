/* Italy — capital at risk before the investment decision.

   AN HONEST NEAR-EMPTY LEDGER. Two things are known to be asked of a storage
   project before it earns anything, and neither could be read at its source
   on 2026-10-12: the share of the connection charge paid on accepting the
   operator's connection quote, and the guarantees the storage auction
   requires. The operator's pages did not return their text to an automated
   fetch, and the auction rules were not found as a document.

   What was opened establishes that the mechanism exists and when its next
   auction is: the ministerial decree approving the auction rules, and the
   regulator's consultation of July 2026. Neither states an amount.

   So both items are listed with no amount and a pointer to where each was
   described, marked as reached through a search summary. Under the rule the
   claim pilot set, that establishes nothing; it tells a person what to open.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM.

   EVERY ITEM IS "verify" or "unsourced". */

export const ENTRY_LEDGER = {
  marketId: 'it',
  basis: { powerMW: 100, durationHours: 4 },
  summary: [
    'Two payments are known to fall before revenue and neither has a sourced amount: a share of the connection charge on accepting the transmission operator\'s connection quote, and the guarantees required to take part in the storage auction and to hold an award.',
    '已知有两笔款项发生在产生收入之前，但都没有可查证的金额：接受输电运营商并网方案时须支付的一部分并网费，以及参加储能拍卖和持有中标合同所需的各项保证金。'],
  limit: [
    'No amount here is sourced, so nothing can be totalled and every limit reads as unchecked. The connection quote\'s terms and the auction\'s guarantees were reached only through search summaries; the operator\'s grid code and the auction rules have to be opened before either is relied on. Regional authorisation cost is not sourced.',
    '此处没有任何金额有来源，因此无法合计，各项上限均显示为未核查。并网方案的条款与拍卖保证金仅见于检索摘要；在引用之前，须查阅运营商的电网规范与拍卖规则原文。大区层面的许可费用没有来源。'],
  items: [
    {
      id: 'connection-quote-acceptance', kind: 'fee',
      label: ['Share of the connection charge on accepting the connection quote', '接受并网方案时支付的部分并网费'],
      amount: null,
      amountNote: ['Described as 30% of the connection charge, paid on acceptance within 120 days of the quote; the charge is set per project. Not read at its source', '据称为并网费的30%，须在收到方案后120日内接受并支付；并网费按项目核定。尚未在原始出处查阅'],
      postedAt: 'studies', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Bank transfer, with proof uploaded to the operator\'s portal; without acceptance and payment in time the request lapses', '银行转账，并将凭证上传至运营商门户；逾期未接受并付款的，申请失效'],
      evidence: [{ publisher: 'Regione Emilia-Romagna environmental filings, reproducing a Terna connection quote', url: 'https://serviziambiente.regione.emilia-romagna.it/viavasweb/progettoIniziale/scaricaAllegato/646480/6781', access: 'search-summary' }],
      status: 'verify',
    },
    {
      id: 'auction-guarantees', kind: 'security',
      label: ['Storage auction guarantees, before and after award', '储能拍卖保证金（中标前与中标后）'],
      amount: null,
      amountNote: ['A pre-auction guarantee, post-award guarantees and a contribution to a guarantee fund, each set by an index in the auction rules; no amount was found', '包括拍卖前保证金、中标后保证金以及向保证基金缴纳的款项，均按拍卖规则中的指标确定；未能查到金额'],
      postedAt: 'revenue', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Described as a non-interest-bearing cash deposit before the auction, and a deposit or first-demand bank guarantee after award', '据称拍卖前为无息现金保证金，中标后为保证金或见索即付银行保函'],
      lostIf: ['Described as callable if the participant fails its obligations or its declarations prove untrue. Not read at its source', '据称在参与方未履行义务或其声明不实时可予没收。尚未在原始出处查阅'],
      evidence: ['dm346', { publisher: 'Solare Industriale, a third-party summary of the storage auction rules', url: 'https://www.solareindustriale.it/blog-fotovoltaico/macse-terna-come-partecipare', access: 'search-summary' }],
      status: 'verify',
    },
    {
      id: 'development-spend', kind: 'consent',
      label: ['Land, studies and authorisation before the decision', '决策前的土地、研究与许可费用'],
      amount: null,
      amountNote: ['Not sourced', '尚无来源'],
      postedAt: 'site', releasedAt: null,
      beforeFid: true, beforeConsent: null, refundable: false,
      form: ['Spent with landowners, consultants and the authorising bodies', '支付给土地所有人、咨询机构与许可主管机关'],
      evidence: [], status: 'unsourced',
    },
  ],
};
