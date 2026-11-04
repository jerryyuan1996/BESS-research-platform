/* Romania — the `data` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, fmtRON } = createShared(api);
  const SEC_B = {};

SEC_B.data = function (){
  const srcs = [SRC.opcom, SRC.tel, SRC.telmap, SRC.anre, SRC.scheme, SRC.ebrd, SRC.entsoe, SRC.bnr, SRC.pse];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator, market-operator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构、市场运营方或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['Can the project connect?','项目能否并网？']}, ['ATR plus an executed connection agreement','ATR加已签并网合同'], ['The indicative capacity map or an establishment authorisation','示意性容量地图或设立许可']],
        [{b:['Will the grant be received?','补贴能否到手？']}, ['A formal award letter','正式授予函'], ['The scheme budget, a call announcement or a submitted application','计划预算、申报公告或已提交申请']],
        [{b:['What spread is achievable?','可实现的价差是多少？']}, ['Executable margin after the full bridge of deductions','经全部扣减桥接后的可执行价差'], ['The published day-ahead top–bottom spread','公布的日前峰谷价差']],
        [{b:['Is balancing revenue real?','平衡收入是否真实？']}, ['Project prequalification plus a reproducible optimiser backtest','项目预认证加可复现的优化器回测'], ['Market-wide published results applied to an unqualified project','将全市场公开结果套用于未取得资格的项目']],
        [{b:['What is the euro return?','以欧元计的回报是多少？']}, ['The central-bank RON/EUR reference series','央行RON/EUR参考汇率序列'], ['A single illustrative mid-rate held flat','单一示意中间价并保持不变']],
      ] },
      { t:'why', text:['All five rows describe the same error in different clothes: substituting an earlier, more available proxy for definitive evidence. In Romania that error has a consistent direction — every convenient proxy is more optimistic than the real thing, and the currency row compounds it, because a flat exchange-rate assumption quietly removes a risk that is larger than most operating variables.',
        '五行描述的是同一错误的不同表现：以更早、更易获得的替代指标取代决定性证据。在罗马尼亚，该错误方向一致 — 每一个便利的替代指标都比真实情况更乐观；而汇率一行会放大这一效应，因为固定汇率假设悄然消除了一项大于多数运营变量的风险。'],
        sig:['Every convenient proxy flatters','每个便利替代指标都在美化'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['Currency discipline: the RON/EUR rate used throughout this dashboard is an illustrative mid-rate of ' + fmt1(M.fx) + '. Replace it with the central-bank reference series before any transaction use and model the exchange-rate path explicitly — for a euro-denominated investor it is a material risk, not a presentational convenience.',
        '汇率纪律：本看板全篇所用RON/EUR汇率为示意中间价' + fmt1(M.fx) + '。任何交易用途前须以央行参考序列替换，并对汇率路径显式建模 — 对以欧元计价的投资人而言，这是实质风险，而非表述上的便利。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'zero — Romania has no capacity mechanism'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable margin','可执行价差']}, 'published spread + intraday uplift − liquidity − RTE − availability − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable margin × duration factor × (RTE / 88) × dilution factor(COD year)'],
        [{b:['Net capex','净资本开支']}, 'gross capex − grant (only with a formal award letter)'],
        [{b:['Duration scorecard','时长评分卡']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: 2025 day-ahead weighted-average price ' + fmtRON(O.dam2025Wap) + '/MWh on ' + fmt1(O.dam2025TWh) + ' TWh traded, equal to ' + O.dam2025SharePct + '% of domestic consumption · 2025 intraday weighted average ' + fmtRON(O.idm2025Wap) + '/MWh · June 2026 day-ahead weighted average ' + fmtRON(O.damJun2026Wap) + '/MWh · ' + fmtCM(O.schemeBudgetEurM * 1e6) + ' standalone-storage state-aid scheme approved, with a policy minimum of ' + fmtN(O.schemeMinMWh) + ' MWh by 2030 and a further ' + fmtN(O.policyExtraMW) + ' MW of expectation · ' + fmtN(O.authFeb2026MW) + ' MW of storage-related authorisations approved in one February 2026 regulatory meeting. Guarantee levels, balancing volumes, price shapes and all project data are illustrative seeds pending live ingestion; the RON/EUR rate of ' + fmt1(M.fx) + ' is illustrative. Polish figures are peer-namespace context and never enter Romanian scoring.',
        '官方数值，2026年7月刷新：2025年日前加权均价' + fmtRON(O.dam2025Wap) + '/MWh，成交' + fmt1(O.dam2025TWh) + 'TWh，占国内消费' + O.dam2025SharePct + '% · 2025年日内加权均价' + fmtRON(O.idm2025Wap) + '/MWh · 2026年6月日前加权均价' + fmtRON(O.damJun2026Wap) + '/MWh · ' + fmtCM(O.schemeBudgetEurM * 1e6) + '独立储能国家援助计划已获批准，政策最低目标为2030年前' + fmtN(O.schemeMinMWh) + 'MWh，另有' + fmtN(O.policyExtraMW) + 'MW预期 · 2026年2月单次监管会议核准' + fmtN(O.authFeb2026MW) + 'MW储能相关许可。保函水平、平衡成交量、价格形态及全部项目数据均为示例种子，待实时抓取替换；RON/EUR汇率' + fmt1(M.fx) + '为示意值。波兰数值属同业命名空间背景资料，绝不进入罗马尼亚评分。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Romanian discussions: ATR (the technical connection permit — the first tier that constitutes evidence), establishment authorisation (a permit to develop, not capacity to connect), scheme budget versus award (a ceiling on total aid versus a project entitlement), and evidence tier (which of the five balancing-revidence levels a specific project has actually reached). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在罗马尼亚的讨论中最常被宽泛使用：ATR（技术并网许可 — 第一个构成证据的层级）、设立许可（开发许可，而非并网容量）、计划预算与正式授予之别（援助总额上限与项目权利之别），以及证据层级（具体项目在五级平衡收入证据阶梯中实际达到的层级）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};



  return SEC_B.data;
}
