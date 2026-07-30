import { GB_GRID_MAP } from './gridMapData.js';

export function buildGBGridSection({ SRC }){
  return {
    head: [
      'Grid Connection — where power, demand and deliverability meet',
      '并网 — 电源、负荷与可交付性的交汇点',
    ],
    cap: [
      'An investor map and evidence journey for the GB connection system. Start with how the network is changing, then establish what Gate 1 and Gate 2 actually confer, who controls each dependency, and which documents turn an indicative date into an underwritable project.',
      '面向投资者的英国并网地图与证据路径。先了解电网结构如何变化，再明确Gate 1和Gate 2究竟赋予什么、各项依赖由谁控制，以及哪些文件可将指示性日期转化为可承销项目。',
    ],
    blocks: [
      {
        t:'card',
        mt:false,
        title:['Interactive GB grid — past structure, current pressure and future plan','英国电网交互地图 — 历史结构、当前压力与未来规划'],
        badges:['official','public'],
        blocks:[
          { t:'geo-grid-map', data:GB_GRID_MAP },
          { t:'why',
            text:[
              'The map is a national orientation tool, not a capacity heatmap. It exposes the structural shift from central thermal generation toward renewable supply in Scotland and the east, while demand remains dense around London, industrial clusters and emerging AIDC hubs. A project still needs its exact node, study background, works programme and connection offer.',
              '该地图是全国方位工具，而非容量热力图。它展示了供给由集中式火电向苏格兰及东部新能源转移，而负荷仍密集分布于伦敦、工业集群及新兴AIDC枢纽。具体项目仍需核查确切节点、研究背景、工程计划及并网要约。',
            ],
            sig:['Orientation, not headroom','用于方位判断，不代表可用容量'],
          },
          { t:'src', src:SRC.etysMap, use:['Representative transmission nodes and changing network structure','代表性输电节点及变化中的电网结构'] },
          { t:'src', src:SRC.connections360, use:['Project-level next step: lines, boundaries, sites and contracted projects','项目级下一步：线路、边界、站点及已签约项目'] },
          { t:'src', src:SRC.onsBoundary, use:['Great Britain country boundary used as the map base','地图采用的英国国家边界'] },
        ],
      },

      {
        t:'card',
        title:['Gate 1 and Gate 2 — the connection journey in plain language','Gate 1与Gate 2 — 通俗解释并网旅程'],
        badges:['official'],
        blocks:[
          { t:'phases', items:[
            {
              yr:['1 · Screen','1 · 初筛'],
              h:['Choose a node and route','选择节点与路径'],
              p:['Test land, planning, import/export need, network charges and plausible network works before paying for a full application.','在支付完整申请费用前，测试土地、规划、受入/送出需求、网络费用及可能的电网工程。'],
            },
            {
              yr:['2 · Apply','2 · 申请'],
              h:['Submit a technically credible project','提交技术可信的项目'],
              p:['Provide capacity, technology, control models, land status, target date and required securities to the relevant DNO or transmission process.','向相关配电运营商或输电流程提交容量、技术、控制模型、土地状态、目标日期及所需保证金。'],
            },
            {
              yr:['3 · Gate 1','3 · Gate 1'],
              h:['Indicative outcome only','仅为指示性结果'],
              p:['Gate 1 does not reserve capacity, a connection point, queue position, a protected date or a guaranteed connection. It is a route to reapply when the project can meet Gate 2.','Gate 1不预留容量、并网点、队列位置、受保护日期，也不保证并网。项目达到Gate 2条件后方可重新申请。'],
            },
            {
              yr:['4 · Gate 2 eligibility','4 · Gate 2资格'],
              h:['Ready and needed','已准备且系统需要'],
              p:['The project must evidence readiness—such as land rights—and be needed under the strategic network plan, or qualify through protection/designation rules.','项目须证明准备就绪（如土地权利），并符合战略网络规划的系统需要，或符合保护/指定规则。'],
            },
            {
              yr:['5 · Gate 2 offer','5 · Gate 2要约'],
              h:['Date, point, queue and cost','日期、节点、队列及成本'],
              p:['A full offer identifies the connection point, confirmed connection date, queue position, works, liabilities and securities. It is necessary, but delivery still depends on studies, consents and construction.','完整要约确定并网点、确认并网日期、队列位置、工程、责任及保证金。它是必要条件，但交付仍取决于研究、许可与施工。'],
            },
            {
              yr:['6 · Energise','6 · 送电'],
              h:['Build, test and register','建设、测试及注册'],
              p:['Complete developer and network works, satisfy planning conditions, demonstrate Grid Code/G99 compliance, commission metering and complete BSC/BMU market registration.','完成开发商及电网工程、满足规划条件、证明符合Grid Code/G99、调试计量并完成BSC/BMU市场注册。'],
            },
          ] },
          { t:'warn', text:[
            'Investor shorthand: Gate 1 is not a bankable connection right. Gate 2 is a much stronger contractual position, but it is not the same as an energised asset and does not eliminate construction or study delay.',
            '投资者速记：Gate 1并非可融资的并网权利。Gate 2是强得多的合同地位，但不等同于已送电资产，也不会消除施工或研究延误。',
          ] },
          { t:'src', src:SRC.gate1, use:['What Gate 1 does—and explicitly does not—provide','Gate 1提供及明确不提供的内容'] },
          { t:'src', src:SRC.ofgemTm04, use:['Approved “ready” and “needed” Gate 2 criteria and reform methodologies','获批的Gate 2“已准备”与“系统需要”标准及改革方法'] },
        ],
      },

      {
        t:'card',
        title:['Who controls the outcome — regulator, system operator, networks and developer','谁控制结果 — 监管机构、系统运营商、电网企业与开发商'],
        badges:['official'],
        blocks:[
          { t:'table',
            head:[['Actor','参与方'],['Connection role','并网职责'],['Investor evidence','投资者所需证据']],
            rows:[
              [{b:['DESNZ / UK Government','英国能源安全与净零部']},
                ['Sets energy policy, Clean Power 2030 capacity ranges and strategic-demand policy.','制定能源政策、清洁电力2030容量区间及战略负荷政策。'],
                ['Policy alignment is a planning input—not a project connection.','政策匹配是规划输入，并非项目并网权利。']],
              [{b:['Ofgem','Ofgem监管机构']},
                ['Regulates licensed companies, approves code and methodology changes, and enforces obligations.','监管持牌企业、批准规则及方法变更，并执行监管义务。'],
                ['Relevant decision, licence obligation and any enforcement/remedy affecting delivery.','相关决定、牌照义务及影响交付的执法/补救措施。']],
              [{b:['NESO','国家能源系统运营商']},
                ['Runs the reformed process, applies strategic need, coordinates the transmission queue and publishes network plans.','运行改革后流程、应用战略需要、协调输电队列并发布电网规划。'],
                ['Gate outcome, tranche, study assumptions and exact strategic-alignment basis.','Gate结果、批次、研究假设及确切战略匹配依据。']],
              [{b:['Transmission owners','输电资产所有者']},
                ['NGET, SSEN Transmission and SP Transmission design, consent, build and maintain transmission works.','NGET、SSEN Transmission及SP Transmission负责输电工程设计、许可、建设及维护。'],
                ['Named enabling works, outages, construction programme, asset-condition dependencies and cost estimate.','具名配套工程、停电计划、施工方案、资产状况依赖及成本估算。']],
              [{b:['Distribution network operator','配电运营商']},
                ['Receives distribution applications, studies local constraints and coordinates embedded-generation impacts with NESO.','受理配电申请、研究本地约束，并与NESO协调嵌入式发电影响。'],
                ['Accepted offer, export/import limits, statement of works, reinforcement and securities.','已接受要约、受入/送出限额、工程说明、增容及保证金。']],
              [{b:['Planning authorities / Planning Inspectorate','地方规划机构 / 规划监察局']},
                ['Determine local or nationally significant consents and enforce conditions.','决定地方或国家重大项目许可并执行条件。'],
                ['Implementable consent, discharged pre-commencement conditions and route/land rights.','可实施许可、已解除的开工前条件及线路/土地权利。']],
              [{b:['Developer, Elexon and market counterparties','开发商、Elexon及市场交易方']},
                ['Developer delivers the site and models; Elexon supports BSC registration and settlement; counterparties require commissioning evidence.','开发商交付场址及模型；Elexon支持BSC注册与结算；交易方要求投运证据。'],
                ['Responsibility matrix through energisation, Grid Code/G99 testing, metering, BMU/BSC and revenue-contract conditions precedent.','覆盖送电、Grid Code/G99测试、计量、BMU/BSC及收入合同先决条件的责任矩阵。']],
            ],
          },
        ],
      },

      {
        t:'card',
        title:['Connection reform — the queue is being rebuilt, not merely reordered','并网改革 — 队列正在重建，而非简单重排'],
        badges:['official'],
        blocks:[
          { t:'timeline', items:[
            {
              y:'2023–24',
              t:['Queue management starts','队列管理启动'],
              p:['Milestone-based termination and improved data begin removing projects that are not progressing.','以里程碑为基础的终止机制及改进数据开始清理未推进项目。'],
              i:['A historical queue number becomes less useful than current milestone compliance.','历史队列号不如当前里程碑合规重要。'],
            },
            {
              y:'Apr 2025',
              t:['Ofgem approves TM04+','Ofgem批准TM04+'],
              p:['The process moves to Gate 2 “ready and needed” criteria, with strategic alignment and project protections/designation.','流程转向Gate 2“已准备且系统需要”标准，并纳入战略匹配及项目保护/指定。'],
              i:['Strategic need joins readiness as a gate; land alone is not enough.','战略需要与准备程度共同成为门槛；仅有土地并不足够。'],
            },
            {
              y:'Dec 2025',
              t:['Reformed queue outcomes','改革后队列结果'],
              p:['Projects receive Gate outcomes and the system moves toward detailed Gate 2 offer tranches.','项目获得Gate结果，系统转向详细Gate 2要约批次。'],
              i:['Request the actual outcome notice and protection basis, not a sponsor summary.','应索取实际结果通知及保护依据，而非发起人摘要。'],
            },
            {
              y:'Feb 2026',
              t:['Offer programme re-baselined','要约计划重新定基'],
              p:['NESO and Ofgem update the timetable because higher Gate 2 volumes and construction planning require additional work.','因Gate 2容量高于预期及施工规划需要额外工作，NESO与Ofgem更新时间表。'],
              i:['Regulatory status does not eliminate engineering workload or sequencing risk.','监管地位无法消除工程工作量及排序风险。'],
            },
            {
              y:'May 2026–Mar 2027',
              t:['Gate 2 offers issued in phases','Gate 2要约分阶段发出'],
              p:['Protected and Phase 1/Phase 2 transmission and distribution offers are scheduled in separate batches.','受保护项目及输配电Phase 1/Phase 2要约按不同批次安排。'],
              i:['Underwrite the project’s exact batch and network-work dependency, not the programme headline.','应承销项目确切批次及电网工程依赖，而非总体计划标题。'],
            },
          ] },
          { t:'src', src:SRC.ofgemTm04, use:['Regulatory approval and reform architecture','监管批准及改革架构'] },
          { t:'src', src:SRC.reform, use:['Latest sequencing and offer-tranche timetable','最新排序及要约批次时间表'] },
          { t:'src', src:SRC.offerRebaseline, use:['Why the Gate 2 offer programme was re-baselined','Gate 2要约计划重新定基的原因'] },
        ],
      },

      {
        t:'g2',
        cards:[
          {
            title:['Technology case — Blackhillock grid-forming BESS','技术案例 — Blackhillock构网型储能'],
            badges:['official'],
            blocks:[
              { t:'p', text:[
                'Grid-following inverters synchronise to an existing voltage waveform. A grid-forming inverter establishes its own voltage and frequency reference, allowing a battery to contribute synthetic inertia and short-circuit strength in a weaker, renewables-led system.',
                '跟网型逆变器同步于现有电压波形；构网型逆变器可建立自身电压及频率基准，使电池在新能源主导的弱电网中提供合成惯量及短路强度。',
              ] },
              { t:'table', head:[['What it can solve','可以解决'],['What it cannot solve','无法解决']], rows:[
                [['Voltage/frequency reference, inertia response and short-circuit contribution','电压/频率基准、惯量响应及短路贡献'],
                 ['No automatic network capacity, queue priority or connection date','不会自动获得网络容量、队列优先级或并网日期']],
                [['A contracted stability need where control performance is demonstrated','在控制性能得到证明时满足合同化稳定性需求'],
                 ['No automatic revenue: controls, models, testing and a procured contract are still required','不会自动产生收入：仍需控制策略、模型、测试及采购合同']],
              ] },
              { t:'note', text:[
                'Blackhillock is the first grid-forming battery connected in GB and part of NESO’s Stability Pathfinder 2 portfolio. It proves technical capability—not universal bankability.',
                'Blackhillock是英国首个并网构网型电池，并属于NESO稳定性探路者2号项目组合。它证明了技术能力，而非普遍可融资性。',
              ] },
              { t:'src', src:SRC.blackhillock, use:['Technology definition, project case and contracted stability context','技术定义、项目案例及合同化稳定性背景'] },
            ],
          },
          {
            title:['Delay case — Harker 132 kV','延误案例 — Harker 132千伏变电站'],
            badges:['official','serious'],
            blocks:[
              { t:'p', text:[
                'Ofgem found failures in asset monitoring, maintenance and remediation at Harker between 2016 and 2021. Those failures delayed some embedded generation connections; NGET accepted licence failures and £20 million of redress payments.',
                'Ofgem认定Harker在2016至2021年间存在资产监测、维护及补救失误，导致部分嵌入式发电并网延误；NGET承认违反牌照义务并支付2,000万英镑补偿。',
              ] },
              { t:'table', head:[['Lesson','教训'],['Prevention in future deals','未来项目预防']], rows:[
                [['The offered date can depend on condition of existing assets','要约日期可能依赖既有资产状况'],
                 ['Asset-condition report, remediation register and named accountable network party','资产状况报告、补救事项登记及具名电网责任方']],
                [['Reinforcement delivery is not only a planning question','增容交付不只是规划问题'],
                 ['Integrated consent, procurement, outage and construction programme with monthly evidence updates','整合许可、采购、停电及施工计划，并每月更新证据']],
                [['Delay destroys revenue vintages','延误会损失收入年度'],
                 ['Long-stop tied to energisation, price ratchet, cost/security cap and termination right','最终截止日挂钩送电、价格递减、成本/保证金上限及终止权']],
              ] },
              { t:'src', src:SRC.harker, use:['Documented cause, affected connections and enforcement outcome','有记录的原因、受影响并网及执法结果'] },
            ],
          },
        ],
      },

      {
        t:'card',
        title:['2026 warning — even protected projects can slip','2026年警示 — 即使受保护项目也可能延误'],
        badges:['official','serious'],
        blocks:[
          { t:'p', text:[
            'Ofgem reported that some projects protected under TM04 could no longer meet their original connection dates. The wider offer programme was also re-baselined as network companies updated assumptions and construction planning. The lesson is specific: legal or reform status can protect a place in the process without making the physical works programme immutable.',
            'Ofgem报告称，部分在TM04下受保护的项目已无法实现原并网日期。随着电网企业更新假设及施工规划，更广泛的要约计划亦重新定基。具体教训是：法律或改革地位可保护项目在流程中的位置，但不会令实体工程计划不可变。',
          ] },
          { t:'reco',
            b:['Prevent the next delay: ','预防下一次延误：'],
            text:[
              'Maintain a live connection data room containing the outcome notice, accepted offer, single-line diagram, study background, works and outage programme, land/wayleaves, planning-condition tracker, securities ledger, Grid Code/G99 model status and an energisation-linked responsibility matrix. Refresh it monthly and before every investment committee.',
              '建立实时并网资料室，包含结果通知、已接受要约、单线图、研究背景、工程及停电计划、土地/通行权、规划条件跟踪、保证金台账、Grid Code/G99模型状态及与送电挂钩的责任矩阵。每月及每次投委会前更新。',
          ] },
          { t:'src', src:SRC.protectedDelay, use:['Protected-project date delays and Ofgem response','受保护项目日期延误及Ofgem回应'] },
          { t:'src', src:SRC.offerRebaseline, use:['Updated programme assumptions and phased delivery','更新后的计划假设及分阶段交付'] },
        ],
      },

      {
        t:'card',
        title:['Investor evidence gate — replace the score with documents','投资者证据门槛 — 用文件取代评分'],
        badges:['official'],
        blocks:[
          { t:'table',
            head:[['Question','问题'],['Evidence that passes','通过所需证据'],['Red flag','风险信号'],['Deal protection','交易保护']],
            rows:[
              [{b:['What connection right exists?','存在哪种并网权利？']},
                ['Gate outcome notice and accepted offer; exact site, MW, point, date and queue position.','Gate结果通知及已接受要约；确切场址、MW、节点、日期及队列位置。'],
                ['“Gate 2 aligned” in a teaser without the documents.','推介材料称“符合Gate 2”但无文件。'],
                ['Document delivery as a condition precedent.','文件交付作为先决条件。']],
              [{b:['Is it ready and needed?','是否已准备且系统需要？']},
                ['Land rights, implementable consent and written strategic-alignment/protection basis.','土地权利、可实施许可及书面战略匹配/保护依据。'],
                ['Option expiry before long-stop; consent conditions not costed.','土地期权在最终截止日前到期；许可条件未计价。'],
                ['Extension rights, consent holdback and seller warranty.','延期权、许可保留款及卖方保证。']],
              [{b:['What physical work delivers it?','哪些实体工程实现并网？']},
                ['Developer/DNO/TO scope split, named reinforcements, outages, programme and critical path.','开发商/配电/输电责任划分、具名增容、停电、计划及关键路径。'],
                ['Offer date without a construction programme or asset-condition evidence.','只有要约日期，无施工计划或资产状况证据。'],
                ['Long-stop tied to energisation; monthly evidence covenant.','最终截止日挂钩送电；每月证据承诺。']],
              [{b:['What can cost more?','哪些成本可能上升？']},
                ['Itemised connection cost, securities schedule, indexation and change-control mechanism.','分项并网成本、保证金计划、指数化及变更控制机制。'],
                ['Uncapped reinforcement liability or front-loaded security.','无上限增容责任或前置保证金。'],
                ['Cost cap, sharing threshold and milestone releases.','成本上限、分担阈值及里程碑释放。']],
              [{b:['Will the technology pass?','技术能否通过？']},
                ['Validated RMS/EMT models, Grid Code/G99 plan, protection study, harmonics and commissioning procedure.','经验证的RMS/EMT模型、Grid Code/G99计划、保护研究、谐波及调试程序。'],
                ['Grid-forming label without control specification or test obligations.','仅称构网型，但无控制规范或测试义务。'],
                ['OEM performance warranty and test-based payment milestone.','OEM性能保证及基于测试的付款里程碑。']],
              [{b:['Can it earn on day one?','投运首日能否盈利？']},
                ['Metering, BSC/BMU registration, BM parameters and revenue-contract commissioning conditions.','计量、BSC/BMU注册、BM参数及收入合同投运条件。'],
                ['Energisation treated as equivalent to commercial operation.','将送电等同于商业运营。'],
                ['Commercial-operation definition covering all registrations and tests.','商业运营定义覆盖全部注册及测试。']],
            ],
          },
          { t:'why', text:[
            'A weighted score can conceal one fatal missing document. This gate is intentionally non-additive: a project cannot compensate for an absent connection offer by having stronger land rights, or for an undeliverable works programme by installing better inverters.',
            '加权评分可能掩盖一个致命缺失文件。本门槛刻意不做加总：项目不能以更强土地权利来弥补缺失并网要约，也不能以更好的逆变器来弥补不可交付的工程计划。',
          ], sig:['Evidence is non-additive','证据不可加总替代'] },
        ],
      },
    ],
  };
}
