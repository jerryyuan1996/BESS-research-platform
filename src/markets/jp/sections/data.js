/* Japan — the `data` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { O, N } = createShared(api);
  const SEC_B = {};

  SEC_B.data = function (){
    return {
    head: ['Data & Methodology', '数据与方法'],
    cap: ['Source hierarchy, the ETL gates that stand between this build and an investable model, and the bilingual glossary.',
          '来源层级、当前版本与可投资模型之间的ETL门槛，以及双语术语表。'],
    blocks: [
      { t: 'card', mt: false, title: ['ETL gates — what must be replaced before use', 'ETL门槛 — 使用前必须替换的内容'],
        badges: ['illus'], live: true, blocks: [
        { t: 'table',
          head: [['Input', '输入'], ['Current status', '当前状态'], ['Required before engineReady', '达到engineReady前所需']],
          rows: [
            [{ b: ['JPY/USD FX', '日元/美元汇率'] }, { chip: 'warn', text: ['Dated seed 2026-07-28', '种子数据，日期2026-07-28'] }, ['Dated rate at model date', '模型日期的定期汇率']],
            [{ b: ['Capex per MW / kWh', '每MW/kWh造价'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Reconciled to a real Japanese 4h build', '对照真实日本4小时项目核对']],
            [{ b: ['Fixed O&M', '固定运维'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Vendor or operating benchmark', '供应商或运营基准']],
            [{ b: ['Merchant margin by area', '各区域市场化收益'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['12-month optimised Area Price backtest, per region', '各区域12个月优化区域价格回测']],
            [{ b: ['Incremental balancing value', '调整力增量价值'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Gross less JEPX opportunity cost, SOC cost, degradation, fees', '毛值扣除JEPX机会成本、SOC成本、衰减与费用']],
            [{ b: ['Expected-capacity factor', '期待容量系数'] }, { chip: 'critical', text: ['Illustrative 0.70', '示例0.70'] }, ['Sourced from the current rule vintage', '取自现行规则版本']],
            [{ b: ['Auction-renewal curve', '拍卖续约曲线'] }, { chip: 'critical', text: ['Illustrative 90% → 60%', '示例90%→60%'] }, ['Documented scenario with stated drivers', '有明确驱动因素的书面情景']],
            [{ b: ['Connection / duration scores', '并网/时长评分'] }, { chip: 'warn', text: ['Seed', '种子'] }, ['Re-scored against evidence', '依据证据重新评分']],
            [{ b: ['Capacity Market area prices', '容量市场区域价格'] }, { chip: 'good', text: ['Anchored — OCCTO 2029', '已锚定 — OCCTO 2029'] }, ['—']],
            [{ b: ['Curtailment days', '弃电天数'] }, { chip: 'good', text: ['Anchored — OCCTO verified', '已锚定 — OCCTO核验'] }, ['—']],
            [{ b: ['Study caps / interconnector / queue', '检讨上限/联络线/队列'] }, { chip: 'good', text: ['Anchored — TSO published', '已锚定 — 电网运营商公布'] }, ['—']],
          ] },
        { t: 'why', text: ['Eight of eleven inputs are still seed. The three that are anchored happen to be the ones that differentiate the regions structurally, which is why the qualitative ranking in this dashboard is more trustworthy than the IRRs. Read the ordering; do not quote the numbers.',
                           '11项输入中仍有8项为种子数据。已锚定的3项恰是结构性区分各区域的关键，因此本看板的定性排序比IRR更可信。请阅读排序，勿引用具体数值。'],
          sig: ['Trust the ordering, not the IRR', '相信排序，而非IRR'] } ] },

      { t: 'card', title: ['Evidence contract — forecast, scenario and coverage stay separate',
                           '证据契约 — 预测、情景与覆盖范围保持分离'],
        badges: ['official', 'calc'], live: false, blocks: [
        { t: 'table',
          head: [['Layer', '层级'], ['Authority', '权威类别'], ['Japan implementation', '日本实施']],
          rows: [
            [{ b: ['System evolution', '系统演进'] }, ['Official forecast', '官方预测'], ['OCCTO FY2025 / FY2030 / FY2034 source points; no hidden 2035 interpolation', 'OCCTO FY2025/FY2030/FY2034来源点；不进行隐含2035插值']],
            [{ b: ['Market observations', '市场观测'] }, ['Observed / derived-observed', '观测/观测衍生'], ['JEPX area prices, OCCTO capacity awards, TSO curtailment and balancing records', 'JEPX区域电价、OCCTO容量中标、TSO弃电与调整力记录']],
            [{ b: ['Base / Bear / Bull', '基准/悲观/乐观'] }, ['Analyst scenario', '分析师情景'], ['Human-approved revenue capture and delivery overlays; never machine-written', '人工批准的收入捕获与交付叠加层；不得由机器改写']],
            [{ b: ['Project funnel', '项目漏斗'] }, ['Coverage-limited', '覆盖受限'], ['Official awards and named disclosures only; complete queue shown as N/A', '仅含官方中标与具名披露；完整队列显示为N/A']],
            [{ b: ['Economics', '经济性'] }, ['Illustrative seed until ETL', 'ETL前为示例种子'], ['No public-build IRR is promoted to observed or official evidence', '公开版本IRR不得被提升为观测或官方证据']],
          ] },
        { t: 'kpis', items: [
          { l: ['Forecast confidence', '预测置信度'], v: M.forecastGovernance.confidenceScore + '/10', d: M.forecastGovernance.confidenceBand, b: ['calc'] },
          { l: ['Planning horizon', '规划时点'], v: 'FY2034', d: ['Nearest official year to 2035', '最接近2035的官方年份'], b: ['official', 'forecast'] },
          { l: ['Complete public BESS queue', '完整公开储能队列'], v: 'N/A', d: ['Coverage gap, not zero', '覆盖缺口，并非零'], b: ['verify'] },
        ] },
        { t: 'note', text: M.forecastGovernance.invalidation },
        { t: 'why', text: [
          'This is the architecture control that prevents a strong national framework from being translated into a false regional return forecast. Official need, analyst revenue capture and project deliverability are three different statements and remain separately sourced.',
          '该架构控制可防止将强劲的全国制度错误转化为虚假的区域回报预测。官方需求、分析师收入捕获与项目可交付性是三类不同陈述，须分别溯源。',
        ], sig: ['Confidence measures evidence, not attractiveness', '置信度衡量证据，而非吸引力'] },
      ] },

      { t: 'card', title: ['Source registry', '数据源登记'], badges: ['official'], live: false, blocks: [
        { t: 'table',
          head: [['Source', '来源'], ['Status', '状态'], ['Date', '日期'], ['Coverage', '适用期间'], ['Refresh', '刷新']],
          rows: Object.values(SRC).map(s => [{ b: s.file }, s.status, s.date, s.cy, s.automation ? s.automation + ' · ' + s.format : 'C · HTML/PDF']) },
        { t: 'note', text: ['A/B sources are machine-fetchable or transformable; C sources require a controlled manual refresh. Every update retains the official vintage and locator.', 'A/B类来源可机器抓取或转换；C类来源需受控人工刷新。每次更新均保留官方版本与定位信息。'] } ] },

      { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
        { t: 'wfrows', items: [
          { l: ['Area basis', '区域价差'], v: '=', n: ['Area Price − System Price', '区域价格 − 系统价格'] },
          { l: ['Net JEPX energy margin', 'JEPX净电能量收益'], v: '=', n: ['Discharge receipts − charging cost − RTE loss − degradation − fees', '放电收入 − 充电成本 − 效率损失 − 衰减 − 费用'] },
          { l: ['Incremental balancing', '调整力增量'], v: '=', n: ['Gross − JEPX opportunity cost − SOC cost − degradation − penalties', '毛值 − JEPX机会成本 − SOC成本 − 衰减 − 罚则'] },
          { l: ['Secured CM revenue', '锁定容量收入'], v: '=', n: ['Area price × expected capacity × secured delivery period', '区域价格 × 期待容量 × 锁定交付期'] },
          { l: ['Curtailment-driven value', '弃电驱动价值'], v: '=', n: ['Merchant NPV with observed windows − NPV under a non-curtailed profile', '含实际窗口的市场化NPV − 无弃电情形下的NPV'] },
        ] },
        { t: 'note', b: ['Anti-double-count: ', '防重复计算：'],
          text: ['LTDA headline payment is never added to full JEPX plus balancing revenue; other-market revenue sharing applies. Future Capacity Market re-auction revenue is never treated as contracted.',
                 '长期脱碳拍卖中标金额绝不与完整的JEPX及调整力收入直接相加，须适用其他市场收入分享机制。未来容量市场再拍卖收入绝不视为已签约收入。'] } ] },

      { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
        { t: 'glossary' },
        { t: 'exports' } ] },
    ] };
  };

  /* Investment Case and Entry: the investment-view revision. Three allocation
     points share this dashboard and each has its own view and ledger, so the
     shared component is mounted once for each region in view: one in a
     regional lens, all three side by side in compare mode. */


  return SEC_B.data;
}
