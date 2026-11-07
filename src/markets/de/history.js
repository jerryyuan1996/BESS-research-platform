/* Authoritative full research history. Extracted verbatim from src/markets/de/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,fmtC}=api;
  const O=M.official;
  
  return {head: ['Germany Market Story — from generation beside load to wind north, load south',
         '德国市场演进 — 从电源紧邻负荷到风电在北、负荷在南'],
cap: ['The German transmission problem is younger than it looks. It was created by two policy decisions and is being solved by four wires.',
        '德国的输电难题比表面看起来更为新近。它由两项政策决定造成，并正由四条线路加以解决。'],
  cards:[
{ t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010', t:['Generation sat beside load','电源紧邻负荷'],
          p:['Rhenish lignite served Ruhr industry and Bavarian nuclear served Bavarian industry. The transmission system moved relatively little power over long distances, and congestion was a local matter.',
             '莱茵褐煤供应鲁尔工业，巴伐利亚核电供应巴伐利亚工业。输电系统的长距离输送量相对有限，拥塞属于本地问题。'],
          i:['There was no national north–south transfer problem to invest around.','当时不存在可供投资的全国性南北输送难题。'] },
        { y:'2011–2023', t:['The nuclear exit removed southern generation','弃核移除了南部电源'],
          p:['Southern baseload closed while northern wind grew. The gap between them became the German congestion problem, and it is a transmission problem rather than a generation one.',
             '南部基荷电源关停，而北部风电增长。两者之间的缺口成为德国的拥塞问题，且属于输电问题而非电源问题。'],
          i:['Congestion cost is a transfer constraint, so it is fixed by wires — and wires have dates.','拥塞成本源于输送约束，因此靠线路解决 — 而线路有明确日期。'] },
        { y:'2025', t:['Two decisions closed the locational route','两项决定关闭了区位路径'],
          p:['ENTSO-E published its bidding zone review in April, finding every German split configuration more efficient. Germany notified rejection by end-October and confirmed it in December, publishing a grid action plan instead.',
             'ENTSO-E于4月发布报价区研究，认为任何德国拆分方案都更具效率。德国于10月底通知否决，并于12月确认，转而发布电网行动计划。'],
          i:['Congestion stays socialised. A battery cannot be paid for where it sits.','拥塞成本继续社会化分摊。储能无法因所处位置获得报酬。'] },
        { y:'2026', t:['A capacity market that this asset cannot enter','一个该类资产无法进入的容量市场'],
          p:['The StromVKG auction opened at ' + O.capAuctionGW + ' GW with ' + O.capYears + '-year contracts and a ' + fmtC(O.capCapPerMW) + '/MW/yr cap — and a ' + O.capMinHours + '-hour minimum discharge that excludes two- and four-hour batteries. State-aid approval was still pending when it opened.',
             'StromVKG拍卖以' + O.capAuctionGW + 'GW规模启动，合同期' + O.capYears + '年，上限' + fmtC(O.capCapPerMW) + '/MW/年 — 但' + O.capMinHours + '小时最低放电时长要求将两小时与四小时储能排除在外。启动时国家补助审批仍未完成。'],
          i:['Contracted revenue is unavailable, not merely thin. Tolling is the substitute.','合同化收入并非稀薄，而是无从获得。租赁是其替代方案。'] },
      ] },
    ] }
  ]};
}
