import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

const PL_GRID_MAP = gridMapById('pl-grid-map');

export function buildPLGridSection({ SRC, M }){
  return {
    head:['Grid Connection — scarce capacity, changing flow and documentary proof','并网 — 稀缺容量、变化潮流与文件证据'],
    cap:['An investor map and evidence journey for Poland’s coal-to-coast transition. It shows how inherited thermal nodes, northern generation, new demand and PSE’s 2034 reinforcements interact—and which documents convert a location into an underwritable connection.','面向投资者的波兰“煤电向沿海转移”地图及证据路径。展示既有火电节点、北部发电、新增负荷及PSE 2034年前增容工程如何相互作用，并说明哪些文件可将区位转化为可承销并网。'],
    blocks:[
      { t:'card', mt:false, title:['Interactive Poland grid — past, current and planned','波兰电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
        { t:'geo-grid-map', data:PL_GRID_MAP },
        { t:'why', text:['The map makes the structural inversion visible: historic generation is concentrated in the centre and south, while the largest new wind and nuclear projects arrive on the Baltic coast. PSE’s northern 400 kV rail, central reinforcements and planned internal HVDC corridor are delivery dependencies—not automatic connection headroom.','地图清晰呈现结构反转：历史发电集中于中部及南部，而最大新增风电及核电项目位于波罗的海沿岸。PSE北部400千伏主干线、中部增容及规划国内高压直流走廊属于交付依赖，并非自动可用并网空间。'],sig:['A corridor is a chain of projects','一条走廊是一串项目']},
        { t:'src', src:SRC.gridPlan, use:['Published nodes, investment tasks, dates and system scenarios','公开节点、投资任务、日期及系统情景'] },
        { t:'src', src:SRC.giscoBoundary, use:['Published country boundary used by the map','地图采用的公开国家边界'] },
      ]},
      { t:'congestion', data:congestionFor('pl') },
      { t:'card', title:['Connection journey — from location to unrestricted operation','并网流程 — 从区位到无限制运行'], badges:['official'], blocks:[
        { t:'phases', items:[
          {yr:['1 · Screen','1 · 初筛'],h:['Choose operator and node','确定运营商及节点'],p:['Identify whether PSE or a DSO owns the relevant voltage level, then test the published plan and local network.','确定相关电压等级由PSE或配电运营商负责，再测试公开规划及本地网络。']},
          {yr:['2 · Apply','2 · 申请'],h:['Complete technical package','完整技术资料包'],p:['Submit capacity, import/export profile, technology, land basis, models, timetable and required application security.','提交容量、受入/送出曲线、技术、土地依据、模型、时间表及所需申请担保。']},
          {yr:['3 · Conditions','3 · 并网条件'],h:['First project-level evidence','首个项目级证据'],p:['Connection conditions define point, works, parameters and validity. They do not mean that works are built.','并网条件确定节点、工程、参数及有效期，但不代表工程已建成。']},
          {yr:['4 · Agreement','4 · 合同'],h:['Allocate scope and cost','分配范围及成本'],p:['The agreement fixes milestones, securities, works ownership and consequences of delay.','合同确定里程碑、担保、工程所有权及延误后果。']},
          {yr:['5 · Permit and build','5 · 许可与建设'],h:['Deliver both sides','双方交付'],p:['Developer and network works proceed through separate environmental, land, procurement, construction and outage programmes.','开发商及电网工程分别推进环境、土地、采购、施工及停电计划。']},
          {yr:['6 · Comply and energise','6 · 合规与送电'],h:['RfG, metering and market registration','RfG、计量及市场注册'],p:['Complete model validation, protection and compliance tests, metering, balancing responsibility and any capacity-market certification.','完成模型验证、保护及合规测试、计量、平衡责任及适用的容量市场认证。']},
        ]},
        { t:'warn', text:['Connection conditions are necessary for a bankable site and for capacity-market certification, but they remain time-limited documentary rights until the network works and compliance process are complete.','并网条件是可融资场址及容量市场认证的必要条件，但在电网工程及合规流程完成前，仍只是有期限的文件权利。'] },
      ]},
      { t:'card', title:['Who controls the outcome','谁控制结果'], badges:['official'], blocks:[
        { t:'table', head:[['Actor','参与方'],['Role','职责'],['Investor evidence','投资者证据']], rows:[
          [{b:['PSE','PSE']},['Transmission system operator, planning authority, connection counterparty and capacity-market operator.','输电系统运营商、规划机构、并网对手方及容量市场运营方。'],['Connection conditions/agreement, named task and date, study assumptions, capacity-market certificate.','并网条件/合同、具名任务及日期、研究假设、容量市场证书。']],
          [{b:['URE','URE']},['Regulates networks, monitors refusals and approves connection requirements.','监管电网、监测拒绝并批准并网要求。'],['Decision, applicable grid code/RfG requirement and any dispute or refusal record.','决定、适用电网规范/RfG要求及任何争议或拒绝记录。']],
          [{b:['Distribution operator','配电运营商']},['Studies distribution connections and coordinates upstream PSE impacts.','研究配电并网并协调上游PSE影响。'],['DSO conditions plus written PSE dependency and commercial-connection terms where used.','配电条件及书面PSE依赖；如采用商业并网，还须相关条款。']],
          [{b:['Ministry / permitting authorities','能源部 / 许可机构']},['Set energy policy and decide environmental, location and construction permissions.','制定能源政策并决定环境、区位及建设许可。'],['Final permits, appeal status and policy support distinguished from a grid right.','最终许可、申诉状态；政策支持须与电网权利区分。']],
          [{b:['Developer','开发商']},['Controls land, application quality, security, equipment models and project works.','控制土地、申请质量、担保、设备模型及项目工程。'],['Dated document register, interface matrix and evidence of compliance resources.','带日期的文件登记、接口矩阵及合规资源证明。']],
        ]},
      ]},
      { t:'card', title:['Why refusals are high — and what the headline does not mean','为何拒绝量高 — 标题数字不代表什么'], badges:['official'], blocks:[
        { t:'kpis', items:[
          {l:['All refused applications, 2024','2024年全部被拒申请'],v:'73.6<small>GW</small>',d:['aggregate requested capacity','申请容量合计'],b:['official']},
          {l:['RES refusal cases','新能源拒绝案件'],v:'6,259',d:['reported by URE','URE报告'],b:['official']},
          {l:['RES refused application MW','新能源被拒申请容量'],v:'42.4<small>GW</small>',d:['aggregate requests','申请合计'],b:['official']},
          {l:['New 400 kV circuits by 2034','2034年前新增400千伏回路'],v:'4,700<small>km</small>',d:['agreed PSE plan headline','PSE已同意规划标题'],b:['official']},
        ]},
        { t:'why', text:['URE explicitly warns that refused MW is not unique unconnected capacity because developers may submit the same project at multiple locations. Investors should therefore diligence the exact refusal reason and revised connection conditions—not apply a national refusal percentage to a site.','URE明确警告，被拒MW并非独立未并网容量，因为开发商可能将同一项目向多个地点重复申请。因此投资者应尽调确切拒绝原因及修订后的并网条件，而不应将全国拒绝比例套用于单一场址。'],sig:['Refused MW is not unique projects','被拒MW不等于独立项目']},
        { t:'src', src:SRC.conn, use:['Official refusal statistics and URE’s interpretation caveat','官方拒绝统计及URE解释口径'] },
      ]},
      { t:'card', title:['Reform and technology — unlock capacity without pretending it is spare','改革与技术 — 释放容量但不虚构可用空间'], badges:['official','policy'], blocks:[
        { t:'table', head:[['Mechanism','机制'],['What it can change','可改变内容'],['Investor evidence','投资者证据']], rows:[
          [{b:['Cable pooling','共用电缆/接入点']},['Shares one connection among complementary generation or storage profiles.','在互补发电或储能曲线之间共享一个并网点。'],['Operator-approved topology, metering, dispatch priority and curtailment allocation.','运营商批准的拓扑、计量、调度优先级及限发分配。']],
          [{b:['Commercial connection','商业并网']},['Can allocate reinforcement cost differently where public-law conditions are refused.','在公共法并网条件被拒时，可采用不同增容成本分配。'],['Signed scope, price cap, delivery responsibility and legal treatment.','已签工程范围、价格上限、交付责任及法律处理。']],
          [{b:['Digitalised process','数字化流程']},['Improves transparency and reduces duplicate/opaque queue handling.','提高透明度并减少重复/不透明队列处理。'],['Timestamped application, operator correspondence and published status.','带时间戳的申请、运营商往来及公开状态。']],
          [{b:['Grid-support capability','电网支撑能力']},['New RfG requirements and planned synchronous compensation address voltage, fault level and stability as inverter-based generation rises.','随着电力电子型发电增加，新RfG要求及规划同步补偿应对电压、短路水平及稳定性。'],['Approved dynamic models, fault-ride-through, reactive-power and control-mode test results.','获批动态模型、故障穿越、无功及控制模式测试结果。']],
        ]},
        { t:'why', text:['PSE’s plan includes 1,050 Mvar of new synchronous compensators and an internal HVDC system. These are system-strength and transfer tools; neither automatically gives a battery a connection. Prevention is an interface matrix that ties the project’s models and tests to the exact network works and Grid Code version.','PSE规划包含1,050Mvar新增同步调相机及国内高压直流系统。这些是系统强度及输送工具；均不会自动赋予电池并网权利。预防方法是建立接口矩阵，将项目模型及测试与确切电网工程及电网规范版本相绑定。'],sig:['Capability must be contracted and tested','能力须被合同化并完成测试']},
        { t:'src', src:SRC.gridReform, use:['URE proposals for digitisation, cable pooling and commercial connection','URE关于数字化、共用接入点及商业并网的建议'] },
        { t:'src', src:SRC.gridCode, use:['Approved 2025 generating-unit connection requirements','获批的2025年发电单元并网要求'] },
      ]},
      { t:'card', title:['The network build behind the refusals — named projects in the agreed PRSP','拒绝背后的电网建设 — 获同意PRSP中的具名项目'], badges:['official','forecast'], blocks:[
        { t:'table',
          head:[['Project','工程'],['Area','区域'],['Delivery body','交付主体'],['Position','进展状态'],['Scope','范围'],['Horizon','展望年份'],['Status','状态']], num:[5],
          rows: M.reinforcements.map(x => {
            const k = M.planClasses.find(c => c.id === x.cls);
            return [{ b:x.n }, x.region, [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope, String(x.year), x.status];
          }) },
        { t:'cap', text:['The PSE investments a Polish connection date depends on. Poland publishes no ISP-style status classification, so the position column separates what is physically underway from what the agreed plan merely lists.',
          '波兰并网日期所依赖的PSE投资项目。波兰不发布ISP式的状态分类，因此进展状态列区分"已实际开工"与"获同意规划仅作列示"。'] },
        { t:'table', head:[['Position','进展状态'],['What it does and does not confer','其赋予与不赋予的内容']],
          rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
        { t:'why', text:['This table is the counterweight to the refusal card above. The refusal statistics say capacity is scarce today; the plan says PLN 64bn and 4,700 km of 400 kV are coming. Both are true and neither dates your connection, because only one row here is actually under construction. Choczewo has a completion year because steel is in the ground; the north–south HVDC link — the project that would most change where a Polish battery is worth building — has no route, no consent and no in-service date, only a 2034 horizon. So the practical rule for a Polish site is to ask which PRSP entry your connection conditions assume, and then check whether that entry has moved out of the plan and into construction. Until it has, the reinforcement is an argument for where capacity will eventually exist, not evidence that a refusal will be reversed.',
          '本表是上方拒绝卡片的对照。拒绝统计说明当下容量稀缺；规划则说明640亿兹罗提与4,700公里400千伏线路即将到来。两者均为事实，且都无法确定你的并网日期，因为本表中真正在建的仅有一行。Choczewo之所以有完工年份，是因为工程实体已在地面；而南北高压直流联络线 — 最能改变波兰储能选址价值的项目 — 既无路径、无许可、也无投运日期，仅有2034年的展望。因此对波兰场址的实用规则是：追问你的并网条件假设了哪一条PRSP条目，再核查该条目是否已由规划进入施工。在此之前，增容工程只是关于"容量最终将存在于何处"的论据，而非"拒绝将被推翻"的证据。'],
          sig:['One row is built; the rest is a plan','仅一行在建，其余皆为规划'] },
        { t:'src', src:SRC.systemPlan, use:['Named investments, route kilometres, substation counts and the 2034 planning horizon','具名投资、线路公里数、变电站数量及2034年规划展望'] },
        { t:'src', src:SRC.gridPlan, use:['The agreed plan document and its offshore connection allocations','获同意的规划文件及其海上风电并网容量分配'] },
      ]},
    ],
  };
}
