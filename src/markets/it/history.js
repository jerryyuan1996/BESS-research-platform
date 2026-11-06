/* Authoritative full research history. Extracted verbatim from src/markets/it/sections.js.
   Original facts, interpretations, scope and live data bindings are preserved.
   Public relocation is an editorial draft, not a new content approval. */
export function researchHistory(api){
  const {M,SRC,fmtN}=api;
  const O=M.official;
  
  return {head: ['Italy Market Story — from thermal beside load to a TSO that buys storage by zone',
         '意大利市场演进 — 从火电紧邻负荷到电网运营商按区域采购储能'],
cap: ['Italy did not arrive at a locational storage market by accident. It kept zonal pricing when its neighbours dropped it, and then built a procurement mechanism shaped like the constraint.',
        '意大利并非偶然形成了区位化的储能市场。在邻国放弃分区电价时它予以保留，随后又建立了一套与约束形态相匹配的采购机制。'],
  cards:[
{ t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010', t:['Thermal generation beside northern load','火电紧邻北部负荷'],
          p:['The Po Valley gas fleet supplied the industrial north and the islands ran as weakly connected systems of their own. Zonal prices existed but the constraint that now defines the market had not formed.',
             '波河谷燃气机组为北部工业区供电，岛屿则作为弱联网的独立系统运行。当时已有分区电价，但如今定义该市场的约束尚未形成。'],
          i:['Zonal pricing was a settlement convention, not an investment signal.','分区电价当时只是一种结算惯例，而非投资信号。'] },
        { y:'2015–2024', t:['Renewables built in the south, demand stayed in the north','新能源建于南部，需求仍在北部'],
          p:['Wind and solar concentrated in the south and the islands while industrial demand stayed in the Po Valley. Renewables reached ' + O.renewShare2025Pct + '% of national demand in 2025.',
             '风电与光伏集中于南部与岛屿地区，而工业需求仍位于波河谷。2025年新能源占全国需求的' + O.renewShare2025Pct + '%。'],
          i:['The north–south transfer became the Italian constraint, and it is a transmission problem.','南北输送成为意大利的约束，且属于输电问题。'] },
        { y:'Feb 2025', t:['A national storage requirement, set by decree','以法令形式确定的全国储能需求'],
          p:['MASE ' + O.maseDecree + ' set the national storage requirement to 2028, giving Terna a mandate to procure rather than merely to plan.',
             'MASE' + O.maseDecree + '确定了至2028年的全国储能需求，赋予Terna采购授权而不仅是规划职能。'],
          i:['The buyer became the TSO. That is what makes the Italian contract bankable.','买方成为电网运营商。这正是意大利合同具备可融资性的原因。'] },
        { y:'Sep 2025', t:['MACSE clears — and clears by zone','MACSE出清 — 且按区域出清'],
          p:[O.macseAwardedMWh.toLocaleString('en-GB') + ' MWh awarded across ' + O.macseProjects + ' projects at a weighted average of €' + fmtN(O.macseWavg) + '/MWh/yr, 15 years from ' + O.macseDelivery + '. The requirement for the North and Centre-North was set at zero.',
             '共' + O.macseAwardedMWh.toLocaleString('en-GB') + 'MWh在' + O.macseProjects + '个项目中中标，加权平均每MWh每年€' + fmtN(O.macseWavg) + '，自' + O.macseDelivery + '年起为期十五年。北部与中北部的需求被设为零。'],
          i:['The clearest published locational signal on this platform, with a price attached.','本平台最清晰的公开区位信号，且附有价格。'] },
        { y:'2026', t:['A second auction, tilted further south','第二次拍卖，进一步向南倾斜'],
          p:['Scheduled for ' + O.macseAuction2Date + ' at ' + O.macseAuction2GWh + ' GWh, up from ' + O.macseAuction1GWh + '. South and Calabria\'s ceiling rises from ' + O.macseSudCeil1 + ' to ' + O.macseSudCeil2 + ' GWh and Sicily\'s floor doubles to ' + O.macseSiciFloor2 + ' GWh.',
             '定于' + O.macseAuction2Date + '举行，规模' + O.macseAuction2GWh + 'GWh，高于此前的' + O.macseAuction1GWh + 'GWh。南部与卡拉布里亚的上限由' + O.macseSudCeil1 + 'GWh升至' + O.macseSudCeil2 + 'GWh，西西里下限翻倍至' + O.macseSiciFloor2 + 'GWh。'],
          i:['No reserve premium published. A 2026 MACSE result does not yet exist.','尚未公布保留溢价。2026年MACSE结果尚不存在。'] },
      ] },
      { t:'why', text:['Read the sequence rather than the endpoint. Great Britain rejected zonal pricing in July 2025 and Germany in December, on the same finding that a split would be more efficient. Italy already had zonal pricing and, instead of stopping there, added a zonal procurement on top of it. The result is that an Italian battery has two locational signals — a settlement price that varies by zone and a TSO that will or will not buy storage in that zone at all — where a German or British one has neither. That is the single structural reason Italy carries four routes and Germany carries two.',
        '应关注这一序列本身而非终点。英国于2025年7月、德国于12月否决分区电价，二者所依据的研究结论均为拆分更具效率。意大利本就实行分区电价，并未止步于此，而是在其之上叠加了分区采购。结果是意大利储能拥有两重区位信号 — 随区域变动的结算价格，以及电网运营商是否会在该区域采购储能 — 而德国或英国储能两者皆无。这正是意大利拥有四条路径而德国仅有两条的唯一结构性原因。'],
        sig:['Two locational signals where its neighbours have none','邻国均无区位信号，而意大利有两重'] },
      { t:'src', src:SRC.macse, use:['Auction volumes, zonal requirements and clearing prices','拍卖规模、分区需求与出清价格'] },
    ] }
  ]};
}
