import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

const RO_GRID_MAP = gridMapById('ro-grid-map');

export function buildROGridSection({ SRC }){
  return {
    head:['Grid Connection — turn an ATR into deliverable capacity','并网 — 将ATR转化为可交付容量'],
    cap:['An investor guide to Romania’s network structure, connection evidence and 2026 anti-speculation reform. The map compares inherited topology, today’s queue pressure and the named reinforcements behind future connection offers.','面向投资者的罗马尼亚电网结构、并网证据及2026年反投机改革指南。地图对比既有拓扑、当前队列压力及未来并网要约背后的具名增容工程。'],
    blocks:[
      { t:'card', mt:false, title:['Interactive Romania grid — past, current and planned','罗马尼亚电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
        { t:'geo-grid-map', data:RO_GRID_MAP },
        { t:'why', text:['The map is an orientation and evidence tool, not a headroom heatmap. Its most important contrast is between the 81.3 GW holding valid renewable ATRs at 1 March 2026 and the 8.9 GW that also held connection contracts, construction permits and ANRE establishment authorisations.','该地图是方位及证据工具，而非可用容量热力图。最关键的对比是：截至2026年3月1日，有效新能源ATR为81.3GW，但同时具备并网合同、建设许可及ANRE设立许可的仅8.9GW。'], sig:['Map the evidence stage, not paper MW','应绘制证据阶段，而非纸面MW'] },
        { t:'src', src:SRC.gridPlan, use:['Transmission nodes, corridors and 2026–2035 reinforcement programme','输电节点、走廊及2026—2035增容计划'] },
        { t:'src', src:SRC.gridProjects, use:['Official project-stage funnel used to distinguish ATR capacity from mature projects','用于区分ATR容量与成熟项目的官方项目阶段漏斗'] },
        { t:'src', src:SRC.giscoBoundary, use:['Published country boundary used by the map','地图采用的公开国家边界'] },
      ]},
      { t:'congestion', data:congestionFor('ro') },
      { t:'card', title:['Connection journey — what each document actually proves','并网流程 — 每份文件究竟证明什么'], badges:['official'], blocks:[
        { t:'phases', items:[
          {yr:['1 · Screen','1 · 初筛'],h:['Node and route','节点与路径'],p:['Use Transelectrica’s indicative capacity map and development plan to choose scenarios. Neither creates a right.','利用Transelectrica示意容量地图及发展规划选择情景；两者均不产生权利。']},
          {yr:['2 · Study','2 · 研究'],h:['Technical solution','技术方案'],p:['The relevant network operator studies export/import power, voltage, fault level, protection and general reinforcement.','相关电网运营商研究送出/受入功率、电压、短路水平、保护及一般增容工程。']},
          {yr:['3 · ATR','3 · ATR'],h:['Technical connection permit','技术并网许可'],p:['The ATR identifies approved power, solution, works, cost and validity. It is evidence—but not an energised asset.','ATR确定核准功率、方案、工程、成本及有效期。它构成证据，但并非已送电资产。']},
          {yr:['4 · Contract','4 · 合同'],h:['Binding works and security','约束性工程及担保'],p:['The connection agreement fixes responsibilities, securities and milestones. Check every dependency against the ATR.','并网合同确定责任、担保及里程碑。须逐项对照ATR核查依赖。']},
          {yr:['5 · Permit and build','5 · 许可与建设'],h:['Two construction programmes','两套建设计划'],p:['Developer facilities and network reinforcements need separate land, permits, procurement, outage windows and completion evidence.','开发商设施与电网增容工程分别需要土地、许可、采购、停电窗口及完工证据。']},
          {yr:['6 · Energise','6 · 送电'],h:['Test, certify and register','测试、认证及注册'],p:['Complete compliance tests, connection certificate, metering, balancing responsibility and market registration before revenue starts.','收入开始前须完成合规测试、并网证书、计量、平衡责任及市场注册。']},
        ]},
        { t:'warn', text:['An ATR is the first meaningful project-level connection evidence, but it can expire and its network works can still slip. A signed connection agreement is stronger; unrestricted energisation remains the finish line.','ATR是首个有意义的项目级并网证据，但可能失效，其电网工程仍可能延误。已签并网合同更强；无限制送电才是终点。'] },
      ] },
      { t:'card', title:['Who controls the outcome','谁控制结果'], badges:['official'], blocks:[
        { t:'table', head:[['Actor','参与方'],['Role','职责'],['Investor evidence','投资者证据']], rows:[
          [{b:['ANRE','ANRE']},['Regulates connection, licences and guarantees; adopted the auction and anti-speculation reforms.','监管并网、牌照及担保；通过容量拍卖及反投机改革。'],['Applicable order, ATR validity, establishment authorisation and security release/forfeiture terms.','适用法令、ATR有效期、设立许可及担保释放/没收条款。']],
          [{b:['Transelectrica','Transelectrica']},['Operates the transmission system, runs capacity allocation and delivers transmission reinforcements.','运营输电系统、组织容量分配并交付输电增容工程。'],['Named node, study case, works owner, permit status, outage window and commissioning date.','具名节点、研究情景、工程责任方、许可状态、停电窗口及投运日期。']],
          [{b:['Distribution operator','配电运营商']},['Studies and contracts distribution-connected projects and coordinates upstream impacts.','研究并签约配电并网项目，协调上游影响。'],['DSO offer plus written upstream Transelectrica dependencies.','配电运营商要约及书面上游Transelectrica依赖。']],
          [{b:['Ministry / permitting authorities','能源部 / 许可机构']},['Set policy and issue or support sector, planning and construction approvals.','制定政策并签发或支持行业、规划及建设许可。'],['Permit register, appeal status and conditions precedent.','许可登记、申诉状态及先决条件。']],
          [{b:['Developer','开发商']},['Controls land, design data, securities, permits, equipment and compliance tests.','控制土地、设计数据、担保、许可、设备及合规测试。'],['Dated data room matched to the ATR and connection agreement.','与ATR及并网合同匹配且带日期的数据室。']],
        ]},
      ]},
      { t:'card', title:['2026 reform — why “paper megawatts” no longer pass diligence','2026年改革 — 为何“纸面兆瓦”无法通过尽调'], badges:['official','policy'], blocks:[
        { t:'table', head:[['Change','变化'],['Mechanism','机制'],['Investor reading','投资者解读']], rows:[
          [{b:['Capacity allocation','容量分配']},['Auction-based allocation applies to new generation/storage of at least 5 MW.','拍卖分配适用于至少5MW的新增发电/储能。'],['Auction eligibility and security are separate from winning and energisation.','拍卖资格与担保不同于中标及送电。']],
          [{b:['ATR security','ATR担保']},['ANRE raised the connection-tariff guarantee from 5% to 20% for covered projects.','ANRE将适用项目的并网费担保由5%提高至20%。'],['Model cash lock-up, release conditions and forfeiture—not only tariff cost.','须建模资金占用、释放条件及没收风险，而非仅并网费。']],
          [{b:['Licence milestones','牌照里程碑']},['Establishment authorisation deadlines are tied to the connection contract and ATR, with limited extension.','设立许可期限与并网合同及ATR挂钩，延期有限。'],['Calendar expiry is a title risk; put long-stop and price adjustment in the SPA.','期限失效属于权利风险；应在SPA中设置最终截止日及价格调整。']],
          [{b:['Project security','项目担保']},['A €30/kW establishment-authorisation guarantee targets non-delivery.','30欧元/kW设立许可担保针对项目不交付。'],['Verify current applicability and documentary release path transaction by transaction.','须逐交易核验现行适用性及书面释放路径。']],
        ]},
        { t:'src', src:SRC.anre, use:['Final reform announcement and current guarantee/milestone framework','最终改革公告及现行担保/里程碑框架'] },
        { t:'src', src:SRC.gridAuction, use:['Auction-based allocation for new generation, generation-consumption and storage of at least 5 MW, applying from 1 January 2026','拍卖分配适用于至少5MW的新增发电、发用电及储能项目，自2026年1月1日起实施'] },
      ]},
      { t:'card', title:['The delay lesson — project funnel, not queue headline','延误教训 — 看项目漏斗，而非队列标题'], badges:['official'], blocks:[
        { t:'kpis', items:[
          {l:['Valid renewable ATR capacity','有效新能源ATR容量'],v:'81.3<small>GW</small>',d:['1 March 2026','截至2026年3月1日'],b:['official']},
          {l:['With connection contract','具备并网合同'],v:'46.1<small>GW</small>',d:['still not construction-ready','仍不等于可建设'],b:['official']},
          {l:['Contract + construction permit','合同 + 建设许可'],v:'27.6<small>GW</small>',d:['595 projects','595个项目'],b:['official']},
          {l:['Plus ANRE establishment authorisation','另具ANRE设立许可'],v:'8.9<small>GW</small>',d:['193 projects','193个项目'],b:['official']},
        ]},
        { t:'why', text:['The national evidence shows why a connection date slips even when a headline ATR exists: each successive document removes a different failure mode. Prevention is a monthly evidence matrix covering ATR validity, contract, permits, securities, named reinforcement, land, procurement, outage window, compliance testing and energisation.','全国证据说明为何即使存在ATR标题，并网日期仍会延误：每一份后续文件消除的是不同失效模式。预防方法是建立月度证据矩阵，覆盖ATR有效期、合同、许可、担保、具名增容、土地、采购、停电窗口、合规测试及送电。'],sig:['Track conversion, not announcements','跟踪转化，而非公告']},
        { t:'src', src:SRC.gridProjects, use:['Official stage counts and approved export capacity','官方阶段数量及核准送出容量'] },
      ]},
    ],
  };
}
