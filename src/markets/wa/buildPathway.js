/* ---------------------------------------------------------------------------
   Western Australia — how a BESS actually gets built on the SWIS.

   Reconstructed entirely from public material: the WEM Rules, AEMO's Reserve
   Capacity Cycle documents and registration pages, Western Power's own published
   connection process, and dated approvals for named WA projects.

   WHAT MAKES WA DISTINCTIVE, and it is the first thing a reader should take:
   the revenue qualification runs on a CALENDAR, not on the project. The Reserve
   Capacity Cycle is an annual machine with fixed dates, and the 2026 cycle
   certifies capacity for the 2028-29 Capacity Year. Miss a cycle and the
   consequence is not a delay of weeks; it is a year, and the whole programme
   re-plans around the next one. Nothing in the connection process cares about
   that calendar, so the two have to be run against each other from the start.

   The second thing: WA PERMITS MORE OF THE CONNECTION AND CONSENTING WORK TO
   PROCEED IN PARALLEL. Western Power's access process and the planning and
   environmental approvals advance independently — a sponsor can be negotiating
   an Access Offer while an environmental referral is still open, and a
   development approval is not a stated precondition of the access process.

   Finland front-loads instead: site control and environmental evidence before
   the letter of intent, final planning consent before the connection agreement.
   Both markets overlap the two workstreams to some degree; what differs is which
   gates bind at which point, and that difference changes what a development
   programme risks more than any single duration does.

   DURATIONS ARE THE WEAK PART and are marked accordingly. Western Power and
   AEMO publish process steps, not elapsed times. Where a range appears against
   an approval it is inferred from dated announcements — sector averages of about
   twelve months for federal environmental approval and fourteen for a
   development application, against a spread that runs from under a month to
   years. Binningup cleared the federal screen in under a month; that is the fast
   tail, not the expectation.
   --------------------------------------------------------------------------- */
import { OWNER, DURATION_BASIS } from '../../governance/buildPathway.js';

export const WA_BUILD_PATHWAY = {
  marketId: 'wa',

  summary: [
    'Two clocks running at once. Western Power\'s connection process — application under the Application and Queuing Policy, an Access Offer, then an executed Interconnection Works Contract and Electricity Transfer Access Contract — proceeds in parallel with planning and environmental consent. Against both sits the Reserve Capacity Cycle, an annual calendar that decides whether the project has capacity revenue at all: the 2026 cycle certifies for the 2028-29 Capacity Year.',
    '两条时间线并行推进。西澳电网公司的并网流程 — 依《申请与排队政策》提交申请、取得接入要约，再签署互联工程合同（IWC）与电力传输接入合同（ETAC） — 与规划及环境许可同步进行。二者之上还有备用容量周期这一年度日程，它决定项目能否获得容量收入：2026年周期对应2028-29容量年度。',
  ],

  limit: [
    'This is the published framework, not a project plan. Correspondence between a developer and Western Power is not public, and neither are queue positions, study results or negotiated dates. Stage sequence and the instruments governing each stage are documented; elapsed times are inferred from dated announcements for other projects and carry the wide spread that implies.',
    '此为公开框架而非项目计划。开发商与西澳电网公司之间的往来函件不属公开信息，队列位置、研究结果及协商日期亦然。各阶段的顺序与所依据的规则文件均有据可查；而各阶段耗时系依据其他项目的公开公告推断，因而区间较宽。',
  ],

  /* One published gating rule, and it is the non-obvious one. Western Power and
     AEMO do not gate the access process on a development approval — which is
     what "more work proceeds in parallel" means concretely — but the GPS
     submission cannot start before the ETAC application exists. */
  prerequisites: [
    {
      id: 'wa-gps-after-etac',
      requiresFrom: 'studies',
      requires: ['A submitted Electricity Transfer Access Contract application',
                 '已提交的电力传输接入合同（ETAC）申请'],
      before: 'compliance',
      instrument: ['Generator Performance Standards submission to Western Power and AEMO',
                   '向西澳电网公司与AEMO提交的发电机性能标准（GPS）'],
      sourceKey: 'registration',
    },
  ],

  stages: [
    {
      id: 'site',
      owner: OWNER.SPONSOR,
      instrument: ['Land tenure; local planning scheme', '土地权属；地方规划方案'],
      gate: ['Site secured with tenure sufficient to support an application', '取得足以支撑申请的土地权属'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'connection',
      note: [
        'Within the sponsor\'s control and therefore the stage most often compressed in a programme — which is why it is also the one most often the real cause of a later delay. WA\'s advantage is space; the constraint is proximity to a connection point with headroom.',
        '该阶段处于投资方自身控制之下，因而在进度计划中最常被压缩 — 这也正是它常成为后续延误真实成因的原因。西澳的优势在于土地充裕；制约因素则是与具备余量的并网点之间的距离。',
      ],
    },
    {
      id: 'application',
      owner: OWNER.TSO,
      instrument: ['Western Power Application and Queuing Policy; Electricity Networks Access Code', '西澳电网公司《申请与排队政策》；《电网接入准则》'],
      gate: ['Application accepted and a queue position established', '申请受理并确立队列位置'],
      months: [1, 3],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'connection',
      note: [
        'The application is made to Western Power as network operator, and the queue is governed by the Application and Queuing Policy rather than by negotiation. A queue position is not headroom and not a connection — it is a place in a process.',
        '申请向作为电网运营商的西澳电网公司提出，队列依《申请与排队政策》管理而非通过协商确定。队列位置既不等于可用容量，也不等于并网权 — 它只是流程中的一个位次。',
      ],
    },
    {
      id: 'studies',
      owner: OWNER.TSO,
      instrument: ['Access Offer negotiated under the AQP; SWIS model and study package', '依《申请与排队政策》协商接入要约；SWIS模型与研究包'],
      gate: ['Executed Interconnection Works Contract and Electricity Transfer Access Contract', '签署互联工程合同（IWC）与电力传输接入合同（ETAC）'],
      months: [9, 24],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development, then capex', '先计入开发成本，后转入资本开支'],
      sourceKey: 'connection',
      note: [
        'Western Power issues and negotiates an Access Offer, with the project modelled through the SWIS study package and the outcomes verified by Western Power. An executed IWC and ETAC are what move a project into the execution stage — this is the commercial gate of the whole programme, and the ETAC is the contract the asset later operates under.',
        '西澳电网公司发出并协商接入要约，项目通过SWIS研究包建模、由西澳电网公司核验结果。已签署的IWC与ETAC是项目进入执行阶段的条件 — 这是整个开发计划的商务关口，且资产日后即在ETAC项下运行。',
      ],
    },
    {
      id: 'consent',
      owner: OWNER.GOVERNMENT,
      parallelWith: 'studies',
      instrument: ['EPBC Act referral (federal); Environmental Protection Act Part IV (WA EPA); development approval', '《环境保护与生物多样性保护法》联邦转介；《环境保护法》第四部分（西澳环保局）；开发许可'],
      gate: ['Not a controlled action, or approval granted; development approval issued', '认定为非受控行为或获得批准；取得开发许可'],
      months: [1, 24],
      durationBasis: DURATION_BASIS.OBSERVED,
      cost: ['Development', '开发成本'],
      sourceKey: 'consent',
      note: [
        'Runs alongside the connection process rather than gating it, which is where WA and Finland differ — Fingrid makes final planning consent a prerequisite of the connection agreement, and Western Power does not. The spread is real rather than a hedge: Binningup was determined not a controlled action within a month of referral in January 2026, while sector averages run to about twelve months federally and fourteen for a development application. Synergy\'s Tathra was decided by the WA EPA not to require formal Part IV assessment, which is the outcome that makes a programme fast.',
        '该阶段与并网流程并行推进，而非成为其前置条件 — 这正是西澳与芬兰的差异所在：Fingrid将最终规划许可设为并网协议的前提，西澳电网公司则未如此规定。区间宽并非保守取值：Binningup项目于2026年1月转介后一个月内即被认定为非受控行为；而行业平均值约为联邦层面12个月、开发许可14个月。Synergy的Tathra项目经西澳环保局决定无需按第四部分正式评估，此种结果正是加快进度的关键。',
      ],
    },
    {
      id: 'compliance',
      owner: OWNER.TSO,
      instrument: ['Generator Performance Standards under the WEM Rules', '《WEM规则》项下的发电机性能标准（GPS）'],
      gate: ['GPS accepted by Western Power and AEMO', 'GPS获西澳电网公司与AEMO接受'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'registration',
      note: [
        'The sequencing is documented and worth knowing: for a transmission-connected facility the Market Participant initiates the GPS submission process with Western Power AND AEMO AFTER submitting the ETAC application. Two counterparties, one submission, and it cannot start earlier.',
        '该顺序有明确规定且值得注意：对于接入输电网的设施，市场参与者须在提交ETAC申请之后，方可向西澳电网公司与AEMO同时启动GPS提交流程。两个对手方、一次提交，且无法提前启动。',
      ],
    },
    {
      id: 'revenue',
      owner: OWNER.MARKET,
      instrument: ['Reserve Capacity Cycle under the WEM Rules — Expression of Interest, Certified Reserve Capacity application, Capacity Credit assignment', '《WEM规则》项下的备用容量周期 — 意向登记、认证备用容量申请、容量信用分配'],
      gate: ['Capacity Credits assigned for the relevant Capacity Year', '取得相应容量年度的容量信用'],
      months: [12, 24],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Development', '开发成本'],
      sourceKey: 'crc',
      note: [
        'THE STAGE THAT RUNS ON A CALENDAR RATHER THAN ON THE PROJECT. The 2026 Reserve Capacity Cycle certifies for the 2028-29 Capacity Year, and the sequence — Expression of Interest, Certified Reserve Capacity application, ESOO publication, Capacity Credit assignment — has fixed dates AEMO publishes in advance. Early Certified Reserve Capacity exists for later years, with the 2027 cycle reaching 2029-30 and the 2028 cycle 2030-31. Missing a cycle costs a year, not a quarter.',
        '这是按日历而非按项目推进的阶段。2026年备用容量周期对应2028-29容量年度，其流程 — 意向登记、认证备用容量申请、ESOO发布、容量信用分配 — 均有AEMO事先公布的固定日期。针对更晚年度另设有提前认证备用容量机制，2027年周期对应2029-30年度，2028年周期对应2030-31年度。错过一个周期的代价是一年，而非一个季度。',
      ],
    },
    {
      id: 'procurement',
      owner: OWNER.COUNTERPARTY,
      instrument: ['EPC and equipment supply contracts', 'EPC与设备供应合同'],
      gate: ['Notice to proceed', '开工令'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'connection',
      note: [
        'Ordinarily overlapped with the later stages of the connection process. The WA-specific point is that cell and transformer lead times are set globally while the Capacity Year is set locally — the two calendars are unrelated and both are binding.',
        '通常与并网流程后段重叠。西澳特有的问题在于：电芯与变压器的交付周期由全球供应链决定，而容量年度由本地规则决定 — 两套时间表互不相关，却都具有约束力。',
      ],
    },
    {
      id: 'construction',
      owner: OWNER.SPONSOR,
      instrument: ['Interconnection Works Contract; construction and commissioning programme', '互联工程合同；施工与调试计划'],
      gate: ['Connection assets constructed and commissioned', '并网设施建成并完成调试'],
      months: [12, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'connection',
      note: [
        'The Interconnection Works Contract governs the works on the network side. Western Power describes execution, operation and close-out as its own phase, which is a reminder that the sponsor\'s construction programme and the network\'s are separate programmes with separate float.',
        '互联工程合同规范电网侧的工程实施。西澳电网公司将执行、运行与收尾作为独立阶段管理，这提示投资方的施工计划与电网侧计划是两套独立计划，各自留有不同的机动时间。',
      ],
    },
    {
      id: 'entry',
      owner: OWNER.MARKET,
      instrument: ['Facility registration under the WEM Rules; Approval to Generate Notification', '《WEM规则》项下的设施注册；发电许可通知'],
      gate: ['Registered facility operating under the ETAC with approval to generate', '完成设施注册，在ETAC项下运行并获发电许可'],
      months: [2, 6],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'registration',
      note: [
        'The facility is registered in the WEM as Scheduled, Semi-Scheduled or Non-Scheduled, and once constructed and commissioned the connection assets operate under the ETAC. For generation, operation is subject to an Approval to Generate Notification under the WEM Rules — the last permission in the sequence, and the one that makes everything before it revenue.',
        '设施在WEM中注册为计划类、半计划类或非计划类，建成调试后，并网设施即在ETAC项下运行。就发电而言，运行还须取得《WEM规则》项下的发电许可通知 — 这是流程中的最后一道许可，也是使此前所有工作转化为收入的关键。',
      ],
    },
  ],
};

export default WA_BUILD_PATHWAY;
