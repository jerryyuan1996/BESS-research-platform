/* Ireland — the `services` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, perNameplate } = createShared(api);
  const SEC_B = {};

SEC_B.services = function (){
  const tot = M.services.reduce((a, s) => a + s.reqMW, 0), qual = M.services.reduce((a, s) => a + s.qualMW, 0);
  return {
  head: ['DS3, FASS & DASSA — the revenue line that built the fleet is being replaced','DS3、FASS与DASSA — 支撑机组建设的收入线正被取代'],
  cap: ['DS3 made 0.5–1 hour batteries highly profitable and specified essentially the whole existing Irish fleet. Effective revenue has already fallen more than ' + O.ds3DeclinePct + '%, and competitive day-ahead procurement is due to replace administered tariffs. This is the largest near-term reform exposure in the Irish stack.',
        'DS3使0.5–1小时电池高度盈利，并基本决定了爱尔兰现有机组的规格。其有效收入已下降超过' + O.ds3DeclinePct + '%，且竞争性日前采购将取代行政费率。这是爱尔兰收入结构中最大的近期改革敞口。'],
  blocks: [
    { t:'card', mt:false, title:['Service suite — requirement, qualified supply and tariff','服务组合 — 需求、合格供给与费率'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Service','服务'],['Response window','响应窗口'],['Requirement (MW)','需求(MW)'],['Qualified supply (MW)','合格供给(MW)'],['Supply / requirement','供给需求比'],['Tariff (€/MW/h)','费率(€/MW/h)']], num:[2,3,4,5],
        rows: M.services.map(s => [{ b: [s.id + ' — ' + s.n[0], s.id + ' — ' + s.n[1]] }, s.resp,
          fmtN(s.reqMW), fmtN(s.qualMW), fmt1(s.qualMW / s.reqMW) + '×', fmtC(s.tariff)]) },
      { t:'bar', cfg:{ xs: M.services.map(s => s.id), mode:'group', bw: 20, yfmt: v => fmtN(v) + ' MW', h: 250,
        series:[
          { name:['Requirement','需求'], color:'var(--s1)', vals: M.services.map(s => s.reqMW) },
          { name:['Qualified supply','合格供给'], color:'var(--s6)', vals: M.services.map(s => s.qualMW) },
        ] } },
      { t:'why', text:['Qualified supply is ' + fmt1(qual / tot) + '× the total requirement, and the imbalance is worst in the fast products where batteries dominate — ' + fmt1(M.services[1].qualMW / M.services[1].reqMW) + '× in Primary Operating Reserve. Under administered tariffs this surplus produced scalar and tariff reductions; under a competitive auction it will produce clearing prices set by the marginal accredited MW. The direction is not in doubt, only the magnitude and the date.',
        '合格供给为总需求的' + fmt1(qual / tot) + '倍，且在电池主导的快速响应产品中失衡最严重 — 一次运行备用达' + fmt1(M.services[1].qualMW / M.services[1].reqMW) + '倍。在行政费率下，这种盈余导致系数与费率下调；在竞争性拍卖下，它将导致出清价由边际认证MW决定。方向毫无疑问，不确定的只是幅度与时点。'],
        sig:['Surplus decides the price either way','无论何种机制，盈余决定价格'] },
      { t:'src', src: SRC.fass, use:['FASS design, DASSA parameters and transition timetable','FASS设计、DASSA参数与过渡时间表'] },
    ] },

    { t:'card', title:['FASS transition bridge — a legacy 1-hour unit (€k/MW/yr)','FASS过渡桥 — 既有1小时机组（€k/MW/年）'], badges:['illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.fassBridge } },
      { t:'kpis', items:[
        { l:['Modelled transition haircut','模型过渡折减'], v:M.fassHaircutPct + '<small>%</small>', d:['illustrative — verify against DASSA parameters','示例 — 须以DASSA参数核验'], b:['illus'] },
        { l:['Regulated-arrangements long-stop','监管安排最终截止'], v:O.ds3LongStop, d:['or earlier DASSA go-live','或DASSA提前上线'], b:['official'] },
        { l:['Disclosed decline since 2022','自2022年披露降幅'], v:'>' + O.ds3DeclinePct + '<small>%</small>', d:['before the auction transition','尚在拍卖过渡之前'], cls:'down', b:['dev'] },
      ] },
      { t:'why', text:['A legacy short-duration unit that earned around €55k/MW/yr from DS3 is modelled at roughly €30k after the transition — and that is before the competitive auction has actually cleared. The point is not the precise number, which is illustrative, but the direction and its consequence: a 1-hour Irish asset loses its primary revenue line and has almost no capacity revenue to fall back on at a ' + fmtPct(M.deratingCurve[1] * 100, 0) + ' de-rating factor. Short-duration Ireland is not an investable archetype at a 2028–2030 COD.',
        '一台在DS3下年收入约€55k/MW的既有短时机组，过渡后模型值约为€30k — 且这尚在竞争性拍卖实际出清之前。要点不在于该具体数值（其为示例），而在于方向及其后果：1小时的爱尔兰资产将失去主要收入来源，而在' + fmtPct(M.deratingCurve[1] * 100, 0) + '的折减系数下几乎没有容量收入可作依托。对2028–2030年投运而言，爱尔兰短时资产不是可投资的原型。'],
        sig:['1-hour Ireland is not investable','爱尔兰1小时资产不具投资性'] },
    ] },

    { t:'card', title:['Underwriting rule for the system-services line','系统服务收入的承销规则'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['Never a long-run floor','绝非长期下限'], d:['Legacy DS3 revenue is evidence of what the system needed, not of what a 2029 asset will earn.','既往DS3收入是系统需求的证据，而非2029年投运资产将获收入的依据。'] },
        { n:['Model the auction, not the tariff','按拍卖而非费率建模'], d:['DASSA clearing will be set by the marginal accredited MW, and qualified supply already exceeds requirement several times over.','DASSA出清价将由边际认证MW决定，而合格供给已数倍于需求。'] },
        { n:['Re-opener in every contract','每份合同均设重议条款'], d:['Any acquisition, toll or offtake should carry a FASS revenue re-opener and DASSA-parameter triggers.','任何收购、代工或售电协议均应包含FASS收入重议条款及DASSA参数触发机制。'] },
        { n:['Exclude from debt sizing','排除于债务规模测算之外'], d:['Lenders should size against the capacity agreement. Services are equity upside in Ireland as elsewhere.','贷款人应以容量协议安排规模。与其他市场一样，服务收入在爱尔兰属股权上行。'] },
      ] },
      { t:'why', text:['At the modelled post-transition level, the services line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + M.lab.servicesKW * 1000) * 100, 0) + '% of a 4-hour asset’s contracted-plus-services revenue — small enough that removing it entirely should not break the investment case. If it does, the case is a DS3 case rather than a storage case, and DS3 in its original form no longer exists.',
        '按过渡后的模型水平，服务收入约占4小时资产“合同化加服务”收入的' + fmtPct(M.lab.servicesKW * 1000 / (perNameplate(4) + M.lab.servicesKW * 1000) * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论。若剔除后逻辑崩塌，那么它是DS3投资逻辑而非储能投资逻辑，而原形态的DS3已不复存在。'],
        sig:['Remove it; if the case breaks, it was a DS3 case','剔除后若逻辑崩塌，说明那是DS3逻辑'] },
    ] },
  ] };
};

// ============================== DURATION & LDES ==============================

  return SEC_B.services;
}
