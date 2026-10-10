/* ---------------------------------------------------------------------------
   Investment Case and Entry tabs.

   Not from the prototype: these two sections are the investment-view revision.
   WA's dashboard is hand-written, so they are wired here; the content comes
   from the same shared component every other dashboard uses, which reads the
   view store and the capital-at-risk ledger by market id and is fetched on
   demand so it stays out of this market's own chunk.
   --------------------------------------------------------------------------- */
import { sectionHead } from '../../../components/sectionHeader.js';
import { mountInvestmentCase } from '../../../components/investmentCaseLoader.js';

export const CASE_HEAD = [
  ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'],
  ['The most secured revenue of any market here, and closed at origination to three of the four kinds of investor. The barrier is the size of the project and the security posted before revenue, not the return.',
   '锁定收入为各市场之最，却在项目发起阶段对四类投资者中的三类关闭。门槛在于项目规模与产生收入前须提交的保证金，而非回报。'],
];

export const ENTRY_HEAD = [
  ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'],
  ['What is spent or pledged before the investment decision, when, and how it is lost. No source behind these figures has been opened yet; each row says so.',
   '最终投资决策之前要支出或提交什么、在何时、如何损失。这些数字背后的来源尚未实际打开核对，各行均已标明。'],
];

export function renderCase(main){
  sectionHead(main, ...CASE_HEAD);
  mountInvestmentCase(main, 'wa', 'case');
}

export function renderEntry(main){
  sectionHead(main, ...ENTRY_HEAD);
  mountInvestmentCase(main, 'wa', 'entry');
}
