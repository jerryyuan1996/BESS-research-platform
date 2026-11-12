/* Japan — the `portfolio` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const SEC_B = {};

  SEC_B.portfolio = function (){
    return {
    head: ['Portfolio — region-aware project underwriting', '组合与基金视图 — 区域感知的项目承销'],
    cap: ['A shell, not a project. Japan project-specific evidence is deliberately absent from this public build.',
          '此为框架而非具体项目。本公开版本刻意不含日本项目层面的证据。'],
    blocks: [
      { t: 'card', mt: false, title: ['Evidence ladder', '证据阶梯'], badges: ['calc'], live: false, blocks: [
        { t: 'ladder', items: [
          { n: ['1 — Executed contract', '1 — 已执行合同'], d: ['LTDA / Capacity Securing Contract / toll / floor / offtake', '长期脱碳中标/容量确保合同/租赁/保底/购电'] },
          { n: ['2 — Final award', '2 — 最终中标'], d: ['Plus executable conditions', '附可执行条件'] },
          { n: ['3 — Binding offer', '3 — 具约束力报价'], d: ['Optimiser or offtaker', '优化商或购电方'] },
          { n: ['4 — Non-binding bid', '4 — 无约束力报价'], d: ['Indicative only', '仅为指示性'] },
          { n: ['5 — Independent forecast', '5 — 独立预测'], d: ['Third-party modelled', '第三方模型'] },
          { n: ['6 — Historical backtest', '6 — 历史回测'], d: ['Area price, not System Price', '区域价格，非系统价格'] },
          { n: ['7 — Developer assumption', '7 — 开发商假设'], d: ['Lowest weight', '权重最低'] },
        ] },
        { t: 'why', text: ['Japanese BESS transactions in 2026 mostly sit at rungs 5 to 7 on the revenue side while sitting at rung 1 or 2 on the technical side. That asymmetry is the deal: the technical package is complete long before the commercial package exists, so diligence spend belongs on the missing documents rather than on re-reviewing the studies.',
                           '2026年日本储能交易在收入侧多处于第5–7级，而在技术侧已达第1–2级。这种不对称正是交易的关键：技术资料包远早于商业资料包完成，因此尽调支出应投向缺失文件，而非重复审阅已有研究。'],
          sig: ['Technical complete, commercial absent', '技术完备，商业缺失'] } ] },

      { t: 'card', title: ['IC gates', '投委会门槛'], badges: ['calc'], live: false, blocks: [
        { t: 'gates', items: [
          { n: ['Grid', '电网'], d: ['Study complete, cost and schedule fixed', '检讨完成，造价与工期确定'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Import capability', '充电能力'], d: ['Approved import MW, separate from export', '获批充电MW，与放电分列'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Export capability', '放电能力'], d: ['Approved export MW', '获批放电MW'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Revenue', '收入'], d: ['Area-price backtest, not System Price', '区域价格回测，非系统价格'], c: 'serious', s: ['Fail without ETL', '无ETL则不通过'] },
          { n: ['Capex', '造价'], d: ['Reconciled to a real Japanese 4h build', '对照真实日本4小时项目核对'], c: 'serious', s: ['Fail without ETL', '无ETL则不通过'] },
          { n: ['Exit', '退出'], d: ['Buyer universe for a 1-year secured asset', '一年期锁定资产的买家群体'], c: 'warn', s: ['Conditional', '有条件'] },
        ] },
        { t: 'why', text: ['Two gates fail on this public build by design — revenue and capex both depend on the ETL that has not run. Showing them as conditional would misrepresent the state of the analysis. A gate that cannot be evidenced is a fail, not a caveat.',
                           '本公开版本中有两项门槛按设计即为不通过 — 收入与造价均依赖尚未执行的ETL。将其显示为“有条件”会歪曲分析现状。无法取证的门槛是“不通过”，而非“注意事项”。'],
          sig: ['Unevidenced is fail, not caveat', '无证据即不通过'] } ] },
    ] };
  };

  // ============================== DATA ==============================

  return SEC_B.portfolio;
}
