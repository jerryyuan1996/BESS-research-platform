/* ---------------------------------------------------------------------------
   Great Britain — how a BESS actually gets built.

   DRAFT FOR THE ANALYST. Reconstructed on 2026-10-11 from Ofgem's decision on
   the Gate 2 Criteria Methodology, NESO's connections pages, CUSC Section 15,
   NESO's Grid Code compliance process, the planning legislation and guidance
   for England, and the July 2026 Capacity Market parameters letter. Each was
   opened; what was not opened is named in `limit` and in the stage notes.

   WHAT MAKES GREAT BRITAIN DISTINCTIVE is that the connection process no longer
   has a door a sponsor can walk up to. Since the 2025 reform an application for
   a firm offer is made in a WINDOW, and a project is admitted only if it is
   both ready and needed:

     · READY is evidenced by land. For most projects that means an option, a
       lease or ownership over the site; a project that must follow the
       Development Consent Order route may show an accepted application
       instead. Planning consent is NOT the test, which is the opposite of
       Finland, where consent gates the connection agreement.
     · NEEDED is strategic alignment: a second, separate test against the
       capacity the plan permits for that technology. Land does not buy it.

   The first window closed on 26 August 2025 and its offers are being issued in
   batches to March 2027. NESO has published no date for the next one. So the
   honest answer to "when can a new project apply" is that nobody has said, and
   the pathway carries that as a null rather than as a guess.

   THE SECOND FACT is that the revenue calendar is NOT a gate on first revenue
   here. The Capacity Market runs once a year and its main auction buys
   capacity four years ahead, but a battery earns from trading and balancing
   services from the day it exports. Western Australia's annual cycle decides
   whether there is capacity revenue at all; Great Britain's decides one line
   of it.

   What decides a British date is the network. A Gate 2 offer names a
   connection date, and that date depends on transmission works whose
   programmes are not public and have already slipped for some protected
   projects. Every duration below stops at the sponsor's side of that.
   --------------------------------------------------------------------------- */
import { OWNER, DURATION_BASIS } from '../../governance/buildPathway.js';

export const GB_BUILD_PATHWAY = {
  marketId: 'gb',

  summary: [
    'Entry is through a window, and land is the ticket. A firm (Gate 2) connection offer is open only to a project that shows land rights over its site and is also needed under the strategic plan; planning consent is not required to apply, and the Interim Operational Notification is required before first export. The first window closed in August 2025 and NESO has published no date for the next. Capacity Market auctions run once a year, but a battery earns from trading and balancing services as soon as it exports, so that calendar decides one revenue line rather than the first pound.',
    '进入要等窗口期，而土地是入场券。只有既能证明拥有场址土地权利、又符合战略规划需要的项目，才能申请确定性的（Gate 2）并网要约；申请时不要求已取得规划许可，但首次送电之前必须取得临时运行通知。首个窗口已于2025年8月关闭，NESO尚未公布下一个窗口的日期。容量市场拍卖每年一次，但电池一旦送电即可从交易和平衡服务中获得收入，因此这份日程决定的只是其中一项收入，而不是第一笔收入何时到来。',
  ],

  limit: [
    'The published framework, not a project plan. Queue positions, study results, the works behind an offered date and correspondence with NESO, a transmission owner or a distribution operator are not public. The date of the next Gate 2 application window is not published, so the wait before applying is unknown and is not in any range here. NESO\'s Gate 2 Criteria Methodology and queue management guidance were read through Ofgem\'s decision rather than directly, and the annual cancellation charge statement, the Capacity Market timetable and the Elexon registration rules were not opened. Durations marked as convention are inferred, not committed to by anyone. This covers a transmission-connected project in England; distribution connections and the Scottish and Welsh consenting regimes are not described.',
    '此为公开框架而非项目计划。队列位置、研究结果、要约日期所依赖的电网工程，以及与NESO、输电资产所有者或配电运营商的往来函件均不公开。下一个Gate 2申请窗口的日期尚未公布，因此申请前要等多久无从得知，也未计入此处任何区间。NESO的《Gate 2标准方法》与队列管理指引是通过Ofgem的决定间接了解的，并未直接查阅；年度取消费用说明、容量市场时间表及Elexon的注册规则均未打开。标注为行业惯例的耗时均为推断，无人对其作出承诺。本路径针对英格兰接入输电网的项目，未涵盖配电网接入，也未涵盖苏格兰和威尔士的许可制度。',
  ],

  /* TWO PUBLISHED GATES, and neither is consent.

     The first is the reform itself: land rights before a Gate 2 application.
     The second is operational: no export without an Interim Operational
     Notification. Planning consent gates neither instrument — a project
     applies, receives an offer and posts security before it has consent, and
     the offer then sets milestones for obtaining it. */
  prerequisites: [
    {
      id: 'gb-gate2-land',
      requiresFrom: 'site',
      requires: ['Land rights over the site: an option, a lease or ownership',
                 '场址土地权利：期权、租约或所有权'],
      before: 'application',
      instrument: ['Gate 2 application and Readiness Declaration', 'Gate 2申请与准备就绪声明'],
      sourceKey: 'gate2Criteria',
    },
    {
      id: 'gb-ion-before-export',
      requiresFrom: 'compliance',
      requires: ['Interim Operational Notification issued by NESO',
                 'NESO签发的临时运行通知（ION）'],
      before: 'entry',
      instrument: ['First export of active or reactive power', '首次送出有功或无功功率'],
      sourceKey: 'compliance',
    },
  ],

  stages: [
    {
      id: 'site',
      owner: OWNER.SPONSOR,
      instrument: ['Option, lease or ownership over the site, within the red line boundary and at the minimum acreage in NESO\'s Energy Density Table', '场址的期权、租约或所有权；须落在红线范围内，并达到NESO《能量密度表》规定的最小面积'],
      gate: ['Land rights secured that meet the Gate 2 readiness criteria', '取得符合Gate 2准备就绪标准的土地权利'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'gate2Criteria',
      note: [
        'THE STAGE THAT ADMITS A PROJECT TO THE PROCESS. Ofgem chose land rights as the readiness test because they are what a developer secures before submitting for planning, and because they can be verified. A site below the acreage threshold may argue for less in its Readiness Declaration. The range is convention: nobody publishes how long a British option takes to sign.',
        '这是决定项目能否进入流程的阶段。Ofgem之所以选择土地权利作为准备就绪的检验标准，是因为开发商通常在提交规划申请之前先取得土地权利，而且这一点可以核验。场址面积低于门槛的，可在准备就绪声明中说明理由。此处区间为行业惯例：没有人公布过在英国签下一份土地期权需要多久。',
      ],
    },
    {
      id: 'application',
      owner: OWNER.TSO,
      instrument: ['Gate 2 application to NESO in an application window, under the CUSC as amended by CMP434; embedded projects apply through the distribution operator', '在申请窗口内依经CMP434修订的CUSC向NESO提交Gate 2申请；嵌入式项目通过配电运营商申请'],
      gate: ['Application assessed as meeting both the readiness and the strategic alignment criteria', '申请经评估同时满足准备就绪标准与战略匹配标准'],
      /* Null on purpose. The stage is a wait for a window that has no date. */
      months: null,
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Development', '开发成本'],
      sourceKey: 'reform',
      note: [
        'NO DURATION, BECAUSE THE NEXT WINDOW HAS NO DATE. The first window closed on 26 August 2025. NESO\'s timeline now says the earlier "no earlier than" date for the next one has been removed. Meeting the land test is necessary and not sufficient: a project must also be needed under the strategic plan, and one that is not receives a Gate 1 outcome, which reserves no capacity, no queue position and no date. An application fee is payable; see the entry ledger.',
        '此处不给出耗时，因为下一个窗口没有日期。首个窗口已于2025年8月26日关闭。NESO的时间表显示，原先为下一个窗口设定的“不早于”日期已被取消。满足土地标准是必要条件而非充分条件：项目还须符合战略规划的需要，否则只能得到Gate 1结果，既不预留容量，也不给队列位置和日期。申请须缴纳申请费，详见进入成本台账。',
      ],
    },
    {
      id: 'studies',
      owner: OWNER.TSO,
      instrument: ['Gate 2 offer: construction agreement and bilateral connection agreement under the CUSC', 'Gate 2要约：CUSC项下的建设协议与双边并网协议'],
      gate: ['Gate 2 offer signed, with a confirmed connection point, connection date and queue position', '签署Gate 2要约，确定并网点、并网日期与队列位置'],
      months: [6, 19],
      durationBasis: DURATION_BASIS.OBSERVED,
      cost: ['Development, then capex', '先计入开发成本，后转入资本开支'],
      sourceKey: 'reform',
      note: [
        'The range is what the first reformed exercise took, not a promise: its window closed on 26 August 2025 and offers were scheduled from 13 February 2026 to mid-March 2027, after the programme was re-baselined once. NESO\'s standing commitment is shorter, an offer within three months of clock start and 90 days to sign. Security against the cancellation charge falls due a month after signing, which is before consent for most projects.',
        '该区间是首轮改革后流程的实际耗时，而非承诺：窗口于2025年8月26日关闭，要约计划自2026年2月13日起分批发出，至2027年3月中旬结束，其间时间表曾调整过一次。NESO的常规承诺更短：自计时起三个月内发出要约，90天内签署。签署一个月后须提交取消费用担保，对多数项目而言这早于取得规划许可。',
      ],
    },
    {
      id: 'consent',
      owner: OWNER.GOVERNMENT,
      parallelWith: 'studies',
      instrument: ['Planning permission from the local planning authority under the Town and Country Planning Act 1990; battery storage has been outside the national infrastructure regime since December 2020', '依《1990年城乡规划法》向地方规划机关申请规划许可；自2020年12月起，电池储能不再适用国家重大基础设施制度'],
      gate: ['Planning permission granted and pre-commencement conditions discharged', '取得规划许可并解除开工前条件'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'planningTimes',
      note: [
        'Runs alongside the connection process rather than gating it. The statutory limits are the floor, not the range: 13 weeks for a major application, 16 with an environmental impact assessment, 26 under the planning guarantee, with a right of appeal if the authority does not decide. Pre-application work and discharging conditions sit on either side of that and are why the range is convention. The offer sets its own milestones for submitting and obtaining consent; their periods were not opened.',
        '该阶段与并网流程并行，而不是其前置条件。法定时限只是下限而非区间：重大项目申请13周，需环境影响评价的16周，规划保证为26周；机关逾期不作决定的，申请人有权上诉。申请前的准备工作与事后解除许可条件分别占去两头的时间，因此区间只能按行业惯例估计。要约另行设定提交及取得许可的里程碑，其具体期限未查阅。',
      ],
    },
    {
      id: 'compliance',
      owner: OWNER.TSO,
      parallelWith: 'construction',
      instrument: ['Grid Code compliance process: data submissions, then Energisation, Interim and Final Operational Notifications', '《电网规范》符合性流程：先提交数据，再依次取得送电、临时与最终运行通知'],
      gate: ['Final Operational Notification issued', '取得最终运行通知（FON）'],
      months: [9, 33],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Capex', '资本开支'],
      sourceKey: 'compliance',
      note: [
        'Only the first nine months sit before revenue. NESO asks for the control point nine months ahead of energisation, the first compliance submission at six months and the final one at three. The Interim Operational Notification then permits export and lasts 24 months, within which every open item must be closed to reach the final notification. So the long end of this range is time spent operating, not time spent waiting.',
        '只有前九个月发生在取得收入之前。NESO要求在送电前九个月确认控制点，前六个月首次提交符合性材料，前三个月提交终稿。此后临时运行通知允许送电，有效期24个月，其间须解决全部遗留事项才能取得最终通知。因此区间的上限是运行中的时间，而不是等待的时间。',
      ],
    },
    {
      id: 'revenue',
      owner: OWNER.MARKET,
      instrument: ['Capacity Market prequalification and the T-4 and T-1 auctions under the Capacity Market Rules', '依《容量市场规则》进行的容量市场预审，以及T-4与T-1拍卖'],
      gate: ['Capacity agreement awarded for a delivery year', '取得某一交付年度的容量协议'],
      months: [6, 45],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Development', '开发成本'],
      sourceKey: 'cmParameters',
      note: [
        'AN ANNUAL CALENDAR THAT DOES NOT GATE FIRST REVENUE. The July 2026 letter sets one T-1 auction for delivery year 2027/28 and one T-4 for 2030/31, both to be held in early 2027; the range is from those auctions to the start of the year each buys. A battery trades and sells balancing services from first export whether or not it holds an agreement, so missing a round costs one revenue line for a year, not the project. Prequalification dates and the credit cover a new build must post were not opened.',
        '这是一份年度日程，但并不决定第一笔收入。2026年7月的函件确定：针对2027/28交付年度的T-1拍卖和针对2030/31年度的T-4拍卖各举行一次，均在2027年初；区间即从拍卖到所购年度开始之间的时间。无论是否持有容量协议，电池自首次送电起即可参与交易并出售平衡服务，因此错过一轮只是损失一年的一项收入，而不是失去项目。预审日期和新建项目须提交的信用保证未查阅。',
      ],
    },
    {
      id: 'procurement',
      owner: OWNER.COUNTERPARTY,
      instrument: ['EPC and equipment supply contracts; route-to-market or optimisation agreement', 'EPC与设备供应合同；售电路径或优化服务协议'],
      gate: ['Final investment decision, which the queue records as milestone M7', '最终投资决策，即队列管理中的里程碑M7'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'gate2Criteria',
      note: [
        'Sector convention; no British source was opened for it. The local point is that the investment decision is itself a queue milestone: Ofgem\'s decision names M7 as final investment decision and uses it, with consent, to identify projects close enough to connection to be protected.',
        '此为行业惯例，未查阅任何英国来源。本地的特殊之处在于，投资决策本身就是队列里程碑：Ofgem的决定将M7界定为最终投资决策，并将其与规划许可一并用于识别临近并网、应予保护的项目。',
      ],
    },
    {
      id: 'construction',
      owner: OWNER.SPONSOR,
      instrument: ['Construction agreement with NESO; the transmission owner\'s enabling works', '与NESO签订的建设协议；输电资产所有者的配套工程'],
      gate: ['Sponsor\'s works and the network\'s works both complete', '投资方工程与电网侧工程均告完成'],
      months: [12, 24],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'protectedDelay',
      note: [
        'The battery is the short programme and the network is the long one. The range is convention for the sponsor\'s own works. It says nothing about the transmission works an offered date depends on, which are not public and which, on the grid tab of this dashboard, Ofgem is recorded as reporting to have slipped for some protected projects; that update was not reopened for this draft. A British connection date in the early 2030s is a network date, and this row cannot see it.',
        '电池本身的工期短，电网侧的工期长。此区间是投资方自身工程的行业惯例，并不反映要约日期所依赖的输电工程；后者并不公开；本平台并网页签记录了Ofgem披露的部分受保护项目日期延后的情况，但本次起草未重新查阅该文件。2030年代初的英国并网日期其实是电网的日期，本行无从反映。',
      ],
    },
    {
      id: 'entry',
      owner: OWNER.MARKET,
      instrument: ['Energisation and Interim Operational Notifications from NESO; registration under the Balancing and Settlement Code and Elexon\'s approval to energise', 'NESO签发的送电与临时运行通知；依《平衡与结算规则》注册并取得Elexon的送电批准'],
      gate: ['Interim Operational Notification issued and first export', '取得临时运行通知并首次送电'],
      months: [1, 3],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'compliance',
      note: [
        'Short, because nothing here waits for a calendar. The published steps are a notice of intention to synchronise 28 days ahead, certificates of readiness between a month and a week ahead, and the energisation notification and Elexon\'s approval a week ahead. The registration rules themselves were not opened, so the range is convention.',
        '这一阶段很短，因为没有任何环节需要等日程。已公布的步骤包括：提前28天发出并列意向通知，提前一个月至一周提交就绪证明，提前一周取得送电通知与Elexon的批准。注册规则本身未查阅，因此区间按行业惯例估计。',
      ],
    },
  ],
};

export default GB_BUILD_PATHWAY;
