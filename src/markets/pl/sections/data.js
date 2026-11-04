/* Poland — the `data` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, capEurKW } = createShared(api);
  const SEC_B = {};

SEC_B.data = function (){
  const srcs = [SRC.pse, SRC.corr, SRC.tge, SRC.bal, SRC.ure, SRC.conn, SRC.nfos, SRC.entsoe, SRC.opcom];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. This is a from-scratch draft, so the capacity-market figures in particular are seed values badged "verify against current documents" and must be replaced with published results before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。本版本为从零起草，因此容量市场数值尤属标注“须以现行文件核验”的种子数值，任何投资用途前须以官方公布结果替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Published auction results plus the correction-factor table for that vintage','官方公布的拍卖结果加该年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['Can the project connect?','项目能否并网？']}, ['Issued connection conditions plus an executed connection agreement','已签发的并网条件加已签并网协议'], ['A connection application or a queue position','并网申请或队列位置']],
        [{b:['Will it clear the auction?','能否在拍卖中出清？']}, ['Certification status plus the auction demand curve and parameters','认证状态加拍卖需求曲线与参数'], ['An assumption that last auction’s outcome repeats','假设上一次拍卖结果会重演']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Executable margin on post-reform data only','仅基于改革后数据的可执行价差'], ['A backtest spanning the balancing reform','跨越平衡市场改革的回测']],
        [{b:['Can the obligation be met in year 12?','第12年能否履行义务？']}, ['A degradation model against the declared duration, plus an augmentation path','对照申报时长的衰减模型，加增容路径'], ['Year-1 duration and a warranty statement','第1年时长与质保声明']],
      ] },
      { t:'why', text:['All five rows describe the same error: substituting an earlier, more available proxy for definitive evidence. The Polish twist is the last row — the only market in this comparison set where the diligence question extends to year twelve, because the obligation does. A model that stops testing duration after year one has not tested the contract at all.',
        '五行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。波兰的特殊之处在最后一行 — 它是本对比样本中唯一尽调问题需延伸至第十二年的市场，因为义务本身如此。若模型在第一年之后即停止检验时长，那么它根本未检验合同。'],
        sig:['Diligence must reach year twelve','尽调须延伸至第十二年'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'proto', text:['Draft status: this is a from-scratch first build. The capacity-auction clearing prices, correction factors, contracted volumes, fleet and pipeline figures are seed values that set the analytical structure correctly but are not verified against published documents. Replace them before any investment use, and record the auction vintage in the model when you do.',
        '草案状态：本版本为从零起草的首个版本。容量拍卖出清价、折减系数、签约容量、在运机组与管线数值均为种子数值 — 它们正确设定了分析结构，但未与官方文件核验。任何投资用途前须予以替换，并在替换时于模型中记录拍卖年份。'] },
      { t:'note', text:['Currency discipline: the PLN/EUR rate used throughout is an illustrative mid-rate of ' + fmt1(M.fx) + '. Capacity revenue is set in zloty and most equity is measured in euro, so the exchange-rate path is a material risk over a ' + O.cmAgreementYears + '-year contract and should be modelled explicitly rather than held flat.',
        '汇率纪律：全篇所用PLN/EUR汇率为示意中间价' + fmt1(M.fx) + '。容量收入以兹罗提计价，而多数股权以欧元衡量，因此在' + O.cmAgreementYears + '年合同期内汇率路径是实质风险，应显式建模而非保持不变。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × correction factor(duration, auction vintage) × clearing price (' + MKT.cur + '/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable margin','可执行价差']}, 'published spread + intraday uplift − liquidity − RTE − availability − charges − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable margin × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Post-contract capacity revenue','合同期后容量收入']}, 'capacity revenue × re-contracting factor after year ' + O.cmAgreementYears],
        [{b:['Duration scorecard','时长评分卡']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Seed values used in this build, all requiring verification: capacity clearing price ' + fmtN(O.cmPricePln) + ' PLN/kW/yr for delivery year ' + O.cmDY + ' (≈' + fmtC(capEurKW) + '/kW at ' + fmt1(M.fx) + ' PLN/EUR) · new-build agreement length ' + O.cmAgreementYears + ' years · correction factors ' + fmtPct(M.deratingCurve[1] * 100, 0) + ' (1h) to ' + fmtPct(M.deratingCurve[8] * 100, 0) + ' (8h) · BESS capacity contracted ' + fmt1(O.cmAwardedBessGW) + ' GW · operating fleet ' + fmtN(O.fleetMW) + ' MW / ' + fmtN(O.fleetMWh) + ' MWh · connection pipeline ' + fmt1(O.pipelineGW) + ' GW · average daily day-ahead spread ' + fmtC(M.spreadSeries[5]) + '/MWh · negative-price hours ~' + fmtN(O.negHours) + ' in 2025 · coal share of generation ~' + O.coalSharePct + '% · balancing market reformed in ' + O.balancingReformYear + ' with 15-minute settlement. Romanian figures are peer-namespace context and never enter Polish scoring.',
        '本版本所用种子数值，均须核验：交付年' + O.cmDY + '的容量出清价' + fmtN(O.cmPricePln) + ' PLN/kW/年（按' + fmt1(M.fx) + ' PLN/EUR约合' + fmtC(capEurKW) + '/kW） · 新建协议年限' + O.cmAgreementYears + '年 · 折减系数由' + fmtPct(M.deratingCurve[1] * 100, 0) + '（1小时）至' + fmtPct(M.deratingCurve[8] * 100, 0) + '（8小时） · 已签约储能容量' + fmt1(O.cmAwardedBessGW) + 'GW · 在运机组' + fmtN(O.fleetMW) + 'MW/' + fmtN(O.fleetMWh) + 'MWh · 并网管线' + fmt1(O.pipelineGW) + 'GW · 日均日前价差' + fmtC(M.spreadSeries[5]) + '/MWh · 2025年负电价约' + fmtN(O.negHours) + '小时 · 煤电占发电量约' + O.coalSharePct + '% · 平衡市场于' + O.balancingReformYear + '年改革并采用15分钟结算。罗马尼亚数值属同业命名空间背景资料，绝不进入波兰评分。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Polish discussions: correction factor (the duration-dependent multiplier that decides how much of the nameplate is paid), capacity obligation (the delivery duty that accompanies the payment for the full contract term), connection conditions (the first tier of connection evidence, which also gates certification), and certification (declaring technical parameters and duration to the auction, where a declaration that cannot later be met becomes a penalty). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在波兰的讨论中最常被宽泛使用：折减系数（决定铭牌容量中多少获付费、随时长变化的乘数）、容量义务（伴随付费、贯穿整个合同期的交付责任）、并网条件（并网证据的第一层级，同时决定能否通过认证）、以及认证（向拍卖申报技术参数与时长，日后无法满足的申报将转化为罚金）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};



  return SEC_B.data;
}
