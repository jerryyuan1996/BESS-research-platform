/* Authoritative full research history. Extracted verbatim from src/markets/pjm/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,fmtN,fmtC}=api;
  const O=M.official;
  
  return {head: ['PJM Market Story — from surplus to a two-auction shortfall',
         'PJM市场演进 — 从容量过剩到连续两次拍卖缺口'],
cap: ['PJM spent a decade with more capacity than it needed. Three things ended that, and all three are still running.',
        'PJM曾有十年容量富余。三项因素终结了这一局面，且三者至今仍在持续。'],
  cards:[
{ t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010s', t:['Structural surplus','结构性过剩'],
          p:['PJM cleared its capacity auctions comfortably above the reliability requirement for most of the decade. Capacity prices were low enough that storage had no contracted route worth modelling.',
             'PJM在该十年的大部分时间内，容量拍卖出清水平都明显高于可靠性需求。容量价格之低，使储能不存在值得建模的合同化路径。'],
          i:['There was no PJM capacity thesis to underwrite.','当时不存在可供承销的PJM容量投资逻辑。'] },
        { y:'2022–2025', t:['Coal retires, data centres arrive','燃煤退役，数据中心到来'],
          p:['Thermal retirement accelerated while the load forecast turned up sharply on data-centre interconnection. Coal fell ' + fmtN(Math.abs(O.coalChangeMW)) + ' MW UCAP into the ' + O.braDeliveryYear + ' auction alone, from retirements and gas conversions.',
             '火电退役加速，同时因数据中心并网，负荷预测大幅上调。仅在' + O.braDeliveryYear + '年度拍卖中，燃煤UCAP即因退役与燃气改造减少' + fmtN(Math.abs(O.coalChangeMW)) + 'MW。'],
          i:['Supply and demand crossed. The capacity price stopped being a rounding error.','供需关系反转。容量价格不再是可忽略的小数。'] },
        { y:'Jan 2025', t:['The price collar','价格上下限机制'],
          p:['Facing capacity costs rising into retail bills, PJM agreed a cap and floor with the thirteen state governors, later approved by FERC. It covers ' + O.collarAuctions + ' auctions and ends after ' + O.collarLastDeliveryYear + '.',
             '面对容量成本向零售电价传导，PJM与十三州州长达成价格上下限协议，其后获FERC批准。该机制覆盖' + O.collarAuctions + '次拍卖，至' + O.collarLastDeliveryYear + '年度后结束。'],
          i:['The published price is a policy ceiling, not a market clearing price.','所公布的价格是政策上限，而非市场出清价格。'] },
        { y:'Oct 2025', t:['The Regulation redesign','调频市场重构'],
          p:['Phase 1 consolidated RegA and RegD into a single bidirectional signal and terminated RegD-only participation. The market roughly doubled from about ' + fmtN(O.regMarketBeforeMW) + ' MW to about ' + fmtN(O.regMarketAfterMW) + ' MW.',
             '第一阶段将RegA与RegD合并为单一双向信号，并终止仅参与RegD的资格。市场规模由约' + fmtN(O.regMarketBeforeMW) + 'MW约增至' + fmtN(O.regMarketAfterMW) + 'MW。'],
          i:['A one-off doubling into a fleet of ~400 MW. That is what the February 2026 peak is.','这是一次性扩容一倍，而当时机组规模仅约400MW。2026年2月的峰值即源于此。'] },
        { y:'Dec 2025 – Jul 2026', t:['Two auctions short, both at the cap','连续两次拍卖出现缺口，且均以上限出清'],
          p:[O.prevBraDeliveryYear + ' cleared at ' + fmtC(O.prevBraPrice) + '/MW-day, roughly ' + fmtN(O.prevBraShortMW) + ' MW short. ' + O.braDeliveryYear + ' cleared at ' + fmtC(O.braPrice) + ', ' + fmtN(O.braShortMW) + ' MW short. The first two auctions in PJM history where the entire RTO fell short.',
             O.prevBraDeliveryYear + '年度以每MW每日' + fmtC(O.prevBraPrice) + '出清，缺口约' + fmtN(O.prevBraShortMW) + 'MW。' + O.braDeliveryYear + '年度以' + fmtC(O.braPrice) + '出清，缺口' + fmtN(O.braShortMW) + 'MW。这是PJM历史上首次连续两届整个RTO出现缺口。'],
          i:['Storage is being paid to solve a shortage, and 67 GW has queued up to do it.','储能因解决短缺而获得报酬，而已有67GW为此排队。'] },
      ] },
    ] }
  ]};
}
