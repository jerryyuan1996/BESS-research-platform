/* ---------------------------------------------------------------------------
   The SWIS Transmission Plan register — WA's equivalent of the NEM's ISP
   appendix, at the same project-level granularity.

   Two documents, and they are not interchangeable. Energy Policy WA's SWIS
   Transmission Plan (announced 18 September 2025) sets the phased capacity
   ambition; Western Power's Clean Energy Link program delivers the named
   projects inside it. Neither is the ISP: the SWIS is islanded, the plan runs
   on state policy rather than the National Electricity Rules, and there is no
   actionable/future classification because there is no RIT-T to trigger.

   What WA has instead is a statutory priority-project mechanism under the State
   Development Act 2025, which streamlines approvals and cross-government
   coordination. That is the rung the `cls` column records — and, exactly as
   with an actionable ISP project, it is an administrative status rather than a
   construction start.

   The discipline this register must not break: enabling MW is not Capacity
   Credits. A corridor that "unlocks 1,000 MW" says nothing about any single
   project's DSOC → CRC → NAQ chain, which binds at sub-boundary level. Every
   figure here is programme capability.
   --------------------------------------------------------------------------- */

const WA_TSP = {
  planAnnounced: '18 September 2025',
  fundAnnounced: '27 April 2026',

  // Phase One capacity ambition, and what it is being built against.
  phaseOneGW: 2.6, northGW: 1.0, eastGW: 1.6,
  celCombinedGW: 3, celJobs: 800,
  coalRetireGW: 1.4, coalRetireBy: 2030,
  industrialMW: 1500, kwinanaMW: 900,
  fundAbn: 1.4,

  // Clean Energy Link — North specifics, the only project with steel in the ground.
  northKm: 290, northContractsAM: 342, northEnableMW: 1000, northReliefMW: 400,

  projects: [
    {
      n: ['Clean Energy Link — North', 'Clean Energy Link — 北部'],
      operator: 'Western Power',
      corridor: ['Northern Terminal (Malaga) → Three Springs', '北部终端（Malaga）→ Three Springs'],
      cls: 'construction',
      scope: ['290 km of existing 132 kV converted to 330 kV via Pinjar, Regans, Cataby and Eneabba, plus a new double-circuit line to Eneabba Terminal; A$342m of contracts signed July 2025',
              '经Pinjar、Regans、Cataby及Eneabba，将290公里既有132千伏线路升压至330千伏，另新建至Eneabba终端的双回线路；2025年7月已签署A$3.42亿合同'],
      mw: 1000,
      year: 2027,
      status: ['Construction commenced November 2025; in service late 2027', '2025年11月开工；2027年底投运'],
      c: 'good',
    },
    {
      n: ['Clean Energy Link — East', 'Clean Energy Link — 东部'],
      operator: 'Western Power',
      corridor: ['New terminal east of Collie → Shotts and Muja terminals', 'Collie以东新建终端 → Shotts与Muja终端'],
      cls: 'priority',
      scope: ['A new transmission terminal east of Collie connected to the existing Shotts and Muja terminals by two new high-voltage lines; the larger half of Phase One',
              '在Collie以东新建输电终端，通过两条新建高压线路接入既有Shotts与Muja终端；为第一阶段中规模较大的一半'],
      mw: 1600,
      year: 2029,
      status: ['Declared a priority project under the State Development Act 2025; expected online by end 2029', '已依《2025年州发展法》宣布为优先项目；预计2029年底前投运'],
      c: 'warn',
    },
    {
      n: ['Clean Energy Link — Kwinana', 'Clean Energy Link — Kwinana'],
      operator: 'Western Power',
      corridor: ['Kwinana Strategic Industrial Area / Western Trade Coast', 'Kwinana战略工业区 / 西部贸易海岸'],
      cls: 'priority-pending',
      scope: ['New terminals and transmission lines supporting new industrial demand in the Western Trade Coast. This is a demand-side reinforcement, not a generation corridor',
              '新建终端及输电线路，支撑西部贸易海岸新增工业负荷。属负荷侧增容，而非发电送出走廊'],
      mw: 900,
      year: null,
      status: ['Priority-project declaration foreshadowed, not yet made; no published in-service date', '已预告将宣布为优先项目但尚未落实；未公布投运日期'],
      c: 'serious',
    },
    {
      n: ['Phase One industrial capacity releases', '第一阶段工业容量释放'],
      operator: 'Energy Policy WA / Western Power',
      corridor: ['Kwinana SIA, Coolangatta Industrial Estate, Kemerton SIA', 'Kwinana战略工业区、Coolangatta工业园、Kemerton战略工业区'],
      cls: 'plan',
      scope: ['Upgrades across the three strategic industrial areas making a combined 1,500 MW available to support industrial growth', '三个战略工业区的升级工程，合计释放1,500MW以支撑工业增长'],
      mw: 1500,
      year: null,
      status: ['Named in the plan with a capacity figure; no project, route or date published', '规划中已具名并给出容量数字；未公布项目、路径或日期'],
      c: 'serious',
    },
    {
      n: ['SWIS Transmission Plan — Phase Two', 'SWIS输电规划 — 第二阶段'],
      operator: 'Energy Policy WA',
      corridor: ['Chittering, Moora, Collie and metropolitan Perth', 'Chittering、Moora、Collie及珀斯都市圈'],
      cls: 'plan',
      scope: ['The plan\'s second phase, expanding capacity in four further areas', '规划的第二阶段，在另外四个区域扩容'],
      mw: null,
      year: null,
      status: ['Areas named; no capacity, project or date published', '仅列出区域；未公布容量、项目或日期'],
      c: 'serious',
    },
    {
      n: ['Clean Energy Fund', '清洁能源基金'],
      operator: 'Government of Western Australia',
      corridor: ['SWIS-wide, focused on Perth and the South West', '覆盖全SWIS，重点为珀斯及西南部'],
      cls: 'funding',
      scope: ['A$1.4bn committed on 27 April 2026 to a pipeline of transmission and generation projects ahead of the state-owned coal closures', '2026年4月27日承诺投入A$14亿，用于国有煤电关停前的输电与发电项目管线'],
      mw: null,
      year: null,
      status: ['A funding envelope covering many projects — the weakest relief evidence here', '覆盖多个项目的资金额度 — 本表中证据力最弱'],
      c: 'serious',
    },
  ],

  /* WA's status vocabulary. Unlike the ISP's, it has no regulatory-test rung,
     because the SWIS has no RIT-T: a WA project moves from plan to priority
     declaration to construction, and the middle rung is an approvals mechanism
     rather than an economic test. */
  classes: [
    { id: 'construction', n: ['Under construction', '在建'], c: 'good',
      d: ['Contracts let and works underway with a published in-service date. The only class where a WA transmission date carries weight.', '合同已签、工程已开工并公布投运日期。这是西澳输电日期唯一具有分量的类别。'] },
    { id: 'priority', n: ['Priority project declared', '已宣布优先项目'], c: 'warn',
      d: ['Declared under the State Development Act 2025, which streamlines approvals and coordinates government. It accelerates a process; it is not a construction start or a funded scope.', '依《2025年州发展法》宣布，可简化审批并协调各政府部门。它加快的是流程，而非开工或已获资金的工程范围。'] },
    { id: 'priority-pending', n: ['Declaration foreshadowed', '已预告将宣布'], c: 'serious',
      d: ['Government has said a priority declaration is coming but has not made it. Nothing is conferred until it does.', '政府已表示将作出优先项目宣布，但尚未实施。在此之前不产生任何效力。'] },
    { id: 'plan', n: ['Named in the plan', '规划中具名'], c: 'serious',
      d: ['Listed in the SWIS Transmission Plan with an area and sometimes a capacity figure, but no project, route or date. A phase is not a schedule.', '在SWIS输电规划中列出区域、有时列出容量数字，但无项目、路径或日期。阶段不等于进度表。'] },
    { id: 'funding', n: ['Funding envelope', '资金额度'], c: 'serious',
      d: ['State money committed across a pipeline. It makes delivery more likely and dates no more certain.', '州政府在项目管线层面承诺的资金。它提高交付可能性，但不使日期更确定。'] },
  ],
};

export { WA_TSP };
