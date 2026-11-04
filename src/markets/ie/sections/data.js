/* Ireland — the `data` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.data = function (){
  const srcs = [SRC.semo, SRC.semc, SRC.eirgrid, SRC.fass, SRC.soni, SRC.cru, SRC.urni, SRC.cso, SRC.celtic, SRC.neso];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['What will capacity revenue be?','容量收入将是多少？']}, ['Auction results plus the de-rating table of that specific vintage','拍卖结果加上该拍卖年份对应的折减系数表'], ['Nameplate MW, a prior vintage table, or a peer market','铭牌MW、以往年份的表格、或同业市场']],
        [{b:['What merchant revenue is achievable?','可实现的市场化收入是多少？']}, ['Executable spread on a post-SDP-02 basis','SDP-02之后口径的可执行价差'], ['The published day-ahead spread, or a pre-2026 backtest','公布的日前价差，或2026年之前的回测']],
        [{b:['Can the project connect and cycle?','项目能否并网并循环？']}, ['Executed connection agreement showing both MEC and MIC','同时载明MEC与MIC的已签并网协议'], ['An ECP batch position, a technical assessment or an unaccepted offer','ECP批次位置、技术评估或未接受的报价']],
        [{b:['Will DS3/FASS revenue persist?','DS3/FASS收入能否持续？']}, ['Published DASSA parameters once available','DASSA参数正式发布后的文件'], ['Trailing DS3 revenue as a forward floor','以既往DS3收入作为远期下限']],
        [{b:['Is an LDES floor bankable?','长时储能保底是否可融资？']}, ['A final procurement award','最终采购授标'], ['A consultation, concept volume or ambition figure','征询文件、概念容量或政策目标数字']],
      ] },
      { t:'why', text:['Four of the five rows describe the same error: substituting an earlier, more available proxy for the definitive evidence. In Ireland that error has a consistent direction on the revenue side and a mixed one on the merchant side — nameplate exceeds de-rated MW and DS3 history exceeds forward services revenue, but pre-SDP-02 trading history understates what a modern asset can achieve. Getting the direction right for each line matters more than getting any single number right.',
        '五行中有四行描述的是同一错误：以更早、更易获得的替代指标取代决定性证据。在爱尔兰，该错误在收入侧方向一致，在市场化侧则方向不一 — 铭牌高于折减后MW、DS3历史高于远期服务收入，但SDP-02之前的交易历史却低估了现代资产的实际能力。为每条收入线判断正确的方向，比精确得到任何单一数字更重要。'],
        sig:['Direction per line beats precision','逐项判断方向优于追求精度'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['Jurisdiction discipline: ROI and NI sit in one market (SEM) but under two regulators, two transmission system operators and two connection processes. Keep ROI and NI evidence separate in diligence even though revenue is settled on an all-island basis.',
        '辖区纪律：爱尔兰共和国与北爱尔兰同属一个市场（SEM），但受两个监管方、两个输电系统运营方及两套并网流程管辖。尽管收入按全岛口径结算，尽调中仍须将两地证据分开保存。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'nameplate MW × de-rating factor(duration, auction vintage) × clearing price (€/kW/yr) × 1,000'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable spread','可执行价差']}, 'published spread − liquidity − RTE − dispatch/SNSP/constraint − availability − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable spread × duration factor × (RTE / 88) × saturation factor(COD year)'],
        [{b:['Duration-Need Index','时长需求指数']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: T-4 capacity clearing price ' + fmtC(O.crmPrice) + '/kW de-rated/yr for DY ' + O.crmDY + ' with ' + fmtN(O.crmAwardedMW) + ' MW de-rated awarded (verify against the current auction notice) · data centres ' + O.dcSharePct + '% of metered electricity and ' + fmtN(O.dcGWh2025) + ' GWh in 2025 · ROI wind dispatch-down ' + fmt1(O.windDispatchDownPct) + '% · constraint and curtailment cost ' + fmtCM(O.constraintCostM * 1e6) + ' for 2024/25, forecast ' + fmtCM(O.constraintForecastM * 1e6) + ' · SNSP limit ' + O.snspNow + '% with a ' + O.snsp2030 + '% policy direction · Greenlink ' + fmtN(O.greenlinkMW) + ' MW operational 2025 and Celtic ' + fmtN(O.celticMW) + ' MW expected 2028 · SDP-02 live ' + O.sdp02Live + ' · DS3 regulated-arrangements long-stop ' + O.ds3LongStop + '. De-rating factors, service tariffs and all series are illustrative seeds pending live ingestion. Northern Ireland is inside SEM and is covered here, not in the GB dashboard.',
        '官方数值，2026年7月刷新：交付年' + O.crmDY + '的T-4容量出清价' + fmtC(O.crmPrice) + '/kW折减/年，中标折减容量' + fmtN(O.crmAwardedMW) + 'MW（须以现行拍卖公告核验） · 2025年数据中心占计量用电' + O.dcSharePct + '%、' + fmtN(O.dcGWh2025) + 'GWh · 爱尔兰共和国风电限发' + fmt1(O.windDispatchDownPct) + '% · 2024/25约束与弃电成本' + fmtCM(O.constraintCostM * 1e6) + '，预测' + fmtCM(O.constraintForecastM * 1e6) + ' · 非同步渗透率上限' + O.snspNow + '%，政策方向' + O.snsp2030 + '% · Greenlink ' + fmtN(O.greenlinkMW) + 'MW于2025年运行，Celtic ' + fmtN(O.celticMW) + 'MW预计2028年 · SDP-02于' + O.sdp02Live + '生效 · DS3监管安排最终截止' + O.ds3LongStop + '。折减系数、服务费率及全部序列均为示例种子，待实时抓取替换。北爱尔兰属于SEM，由本看板覆盖，不在英国看板范围内。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Irish discussions: MEC versus MIC (export capacity pays capacity revenue, import capacity enables cycling — they are frequently different numbers), Reliability Option (the capacity payment carries a difference-payment obligation above a strike), de-rating factor (a duration-dependent multiplier set per auction vintage), and dispatch-down (curtailment plus constraint, the system problem storage is paid to solve). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在爱尔兰的讨论中最常被宽泛使用：MEC与MIC之别（送出容量决定容量收入，受入容量决定循环能力 — 两者常为不同数字）、可靠性期权（容量付费附带高于执行价时的差价支付义务）、折减系数（按拍卖年份设定、随时长变化的乘数）、以及限发（弃电加网络约束，即储能获付费所要解决的系统问题）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */

  return SEC_B.data;
}
