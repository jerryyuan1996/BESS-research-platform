/* Japan — capital at risk before the investment decision, for the three
   allocation points.

   Three ledgers, because the store and the registries are keyed by market id.
   They differ only in what each area's network company has published, which
   the dashboard already records in regions.js:

     Tokyo     a deposit of 10% and a first contribution of at least 50% of
               the construction-cost contribution, for applications from
               1 April 2026
     Kyushu    a first contribution of 50%; no deposit rule recorded
     Hokkaido  terms to be verified against the network company's own pages

   Those are schedules against a connection charge whose amount is set per
   project and is not published (gate G26), so NO ITEM HERE HAS AN AMOUNT and
   every total is a lower bound of nothing.

   The network companies' pages were not re-opened on 2026-10-12: Tokyo's
   refused an automated fetch. What is stated here is what the register
   already held as verified.

   THE TIMING FLAGS ARE A DRAFT FOR THE ANALYST TO CONFIRM.

   EVERY ITEM IS "verify" or "unsourced". */

const BASIS = { powerMW: 50, durationHours: 6 };

const development = {
  id: 'development-spend', kind: 'consent',
  label: ['Land, studies and permitting before the decision', '决策前的土地、研究与许可费用'],
  amount: null,
  amountNote: ['Not sourced', '尚无来源'],
  postedAt: 'site', releasedAt: null,
  beforeFid: true, beforeConsent: null, refundable: false,
  form: ['Spent with landowners, consultants and local authorities', '支付给土地所有人、咨询机构与地方主管机关'],
  evidence: [], status: 'unsourced',
};

const contribution = (pct, evidence, status) => ({
  id: 'first-contribution', kind: 'fee',
  label: ['First payment of the construction-cost contribution', '工程费负担金首期付款'],
  amount: null,
  amountNote: pct
    ? [`At least ${pct}% of the construction-cost contribution, which is set per project and not published`, `不低于工程费负担金的${pct}%；负担金按项目核定，并不公开`]
    : ['The schedule was not established; the contribution is set per project and not published', '付款安排尚未确立；负担金按项目核定，并不公开'],
  postedAt: 'studies', releasedAt: null,
  beforeFid: true, beforeConsent: null, refundable: false,
  form: ['Paid to the network company under the connection contract', '依据并网合同向电网公司支付'],
  evidence, status,
});

export const TOKYO_ENTRY_LEDGER = {
  marketId: 'jp_tokyo',
  basis: BASIS,
  summary: [
    'For applications from 1 April 2026 the network company asks a battery project for a deposit of 10% and a first payment of at least 50% of the construction-cost contribution. The contribution is set per project, so neither has an amount.',
    '对2026年4月1日起提出的申请，电网公司要求储能项目缴纳工程费负担金10%的保证金，并支付不低于50%的首期款。负担金按项目核定，因此两者均没有金额。'],
  limit: [
    'No item has an amount, so nothing can be totalled and every limit reads as unchecked: both payments are percentages of a connection charge that is not published. When the deposit is returned or kept was not read. The long-term auction\'s bid security is not sourced.',
    '各项均没有金额，因此无法合计，各项上限均显示为未核查：两笔款项都是按未公开的并网费用的一定比例计算。保证金何时退还或被没收，尚未查阅。长期脱碳电源拍卖的投标保证金没有来源。'],
  items: [
    {
      id: 'connection-deposit', kind: 'deposit',
      label: ['Connection deposit', '并网保证金'],
      amount: null,
      amountNote: ['10% of the construction-cost contribution, which is set per project and not published', '工程费负担金的10%；负担金按项目核定，并不公开'],
      postedAt: 'studies', releasedAt: 'entry',
      beforeFid: true, beforeConsent: null, refundable: true,
      form: ['Paid to the network company with the connection contract application', '提出并网合同申请时向电网公司缴纳'],
      lostIf: ['Not read. The notice was not re-opened', '尚未查阅。未重新打开该通知'],
      evidence: ['tepcoDeposit'], status: 'verify',
    },
    contribution(50, ['tepcoDeposit'], 'verify'),
    development,
  ],
};

export const KYUSHU_ENTRY_LEDGER = {
  marketId: 'jp_kyushu',
  basis: BASIS,
  summary: [
    'The network company asks for a first payment of 50% of the construction-cost contribution. No deposit rule is recorded for this area, and the contribution is set per project, so nothing has an amount.',
    '电网公司要求支付工程费负担金50%的首期款。该区域未见保证金规定的记录；负担金按项目核定，因此各项均没有金额。'],
  limit: [
    'No item has an amount, so nothing can be totalled and every limit reads as unchecked. Whether a deposit like Tokyo\'s applies here was not established. The long-term auction\'s bid security is not sourced.',
    '各项均没有金额，因此无法合计，各项上限均显示为未核查。此处是否适用类似东京的保证金规定，尚未确立。长期脱碳电源拍卖的投标保证金没有来源。'],
  items: [contribution(50, ['kyudenContribution'], 'verify'), development],
};

export const HOKKAIDO_ENTRY_LEDGER = {
  marketId: 'jp_hokkaido',
  basis: BASIS,
  summary: [
    'The network company\'s current terms for a deposit and for the construction-cost contribution were not established for this area; the dashboard records them as to be verified.',
    '该区域电网公司现行的保证金与工程费负担金条款尚未确立；看板将其记为有待核实。'],
  limit: [
    'Nothing here has an amount or an established schedule, so nothing can be totalled and every limit reads as unchecked. The long-term auction\'s bid security is not sourced.',
    '此处各项既没有金额，也没有已确立的付款安排，因此无法合计，各项上限均显示为未核查。长期脱碳电源拍卖的投标保证金没有来源。'],
  items: [contribution(null, ['hepcoAccess'], 'verify'), development],
};
