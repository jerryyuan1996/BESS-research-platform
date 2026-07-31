/* ---------------------------------------------------------------------------
   GB — congestion register.

   Great Britain is the market where the congestion opportunity is largest and
   the way to capture it is narrowest, and both halves of that sentence are July
   2025 policy rather than physics.

   THE OPPORTUNITY. Balancing the system cost £3.1bn in the year to March 2026,
   up from £2.7bn, with thermal constraints £1.7bn of it. In calendar 2025 that
   split into £380m paid to turn Scottish wind OFF and £1.08bn paid to turn
   English gas ON — the same constraint, billed twice, and the gap between the
   two is what a battery on the right side of the boundary is competing for.

   THE CATCH. REMA concluded on 10 July 2025 that GB keeps a single national
   wholesale price: zonal pricing was rejected in favour of "reformed national
   pricing", with the Strategic Spatial Energy Plan as its centrepiece from 2026.
   So none of this congestion reaches the wholesale price a battery trades. It is
   reachable ONLY through the Balancing Mechanism, which means the optimiser's BM
   access and track record are worth more than the site's proximity to the
   constraint. A GB congestion thesis is a route-to-market thesis.

   THE EXPIRY. Eastern Green Link 2 — 2 GW, Peterhead to Drax, £4.3bn, under
   construction since September 2024 — commissions in 2029, and NESO puts the
   whole 2030 network delivery at £13.1bn of lifetime constraint savings. That
   figure is the reason to read this register as a depleting resource: it is the
   value of the congestion revenue that is scheduled to stop existing.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  balancing: 'https://www.neso.energy/industry-information/balancing-costs',
  egl2: 'https://www.ssen-transmission.co.uk/projects/project-map/eastern-green-link-2/',
  cp2030: 'https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report',
  rema: 'https://www.gov.uk/government/publications/review-of-electricity-market-arrangements-rema-summer-update',
};

export const GB_CONGESTION = {
  marketId: 'gb',
  summary: [
    'The largest constraint pool in the set and the narrowest way to reach it: GB rejected zonal pricing in July 2025, so congestion never reaches the wholesale price and is capturable only through the Balancing Mechanism. Eastern Green Link 2 removes a large part of the boundary constraint in 2029.',
    '本样本中约束规模最大、但获取路径最窄的市场：英国于2025年7月否决了分区电价，因此拥塞不会传导至批发电价，只能通过平衡机制捕获。东方绿色互联2号线将于2029年消除相当部分的断面约束。',
  ],
  gateNote: [
    'No public source gives per-MW congestion revenue for a GB battery. The register reports the system-level pool and the mechanism; it does not model a share of it — gate G14.',
    '目前无公开来源提供英国储能每MW的拥塞收入。本登记表仅呈现系统层面的资金池及捕获机制，不对其份额建模 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'gb-b6',
      bearsOn: 'merchGross',
      name: ['B6 — Scotland to England transfer', 'B6断面 — 苏格兰至英格兰输送'],
      shape: 'interface',
      coords: [[-4.85, 55.00], [-3.50, 55.15], [-2.10, 55.45]],
      direction: 'export',
      /* The largest single transfer boundary in GB and the one the reported
         constraint payments are attributed to, so it leads the market even
         though the northern boundaries bind more often. */
      intensity: 1.0,
      metrics: [
        { label: ['Settlement periods constrained', '受约束结算时段占比'],
          value: ['~30%', '约30%'], period: ['2025', '2025年'] },
        { label: ['Paid to turn Scottish wind off', '为压减苏格兰风电所付费用'],
          value: ['£380m', '£3.80亿'], period: ['calendar 2025', '2025日历年'] },
      ],
      capture: {
        mechanism: CAPTURE.BALANCING,
        text: [
          'A battery south of the boundary is paid to absorb; north of it, to discharge. Both are Balancing Mechanism actions, so BM registration and an optimiser with a demonstrated BM record are prerequisites, not refinements.',
          '断面以南的储能因吸纳电量获得报酬，以北则因放电获得报酬。二者均属平衡机制指令，因此平衡机制注册及具备实证调用记录的优化商是前提条件，而非加分项。',
        ],
      },
      relief: {
        project: ['Eastern Green Link 2', '东方绿色互联2号线'],
        operator: 'SSEN Transmission / National Grid Electricity Transmission',
        scope: ['2 GW HVDC, Peterhead to Drax, £4.3bn; 436 km subsea and 69 km underground',
                '2GW高压直流，彼得黑德至德拉克斯，造价43亿英镑；海底电缆436公里、地下电缆69公里'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'The clearest congestion opportunity on the platform and the one with the hardest published end date. Construction started in September 2024 and commissioning is 2029, so a project reaching COD in 2028 has roughly one year of this constraint at full width. Underwrite the BM revenue on the years before 2029, not on a fifteen-year average.',
        '本平台中最明确的拥塞机会，也是终止日期最确凿的一个。工程于2024年9月开工，2029年投运，因此2028年投运的项目大约仅有一年时间可享受该约束的完整宽度。平衡机制收入应按2029年之前的年份承销，而非按十五年平均值。',
      ],
      source: 'NESO Annual Balancing Costs Report; SSEN Transmission EGL2',
      sourceUrl: URL.egl2,
    },

    {
      id: 'gb-north-scotland',
      bearsOn: 'merchGross',
      name: ['B2 / B4 / B5 — northern Scottish boundaries', 'B2/B4/B5断面 — 苏格兰北部'],
      shape: 'interface',
      coords: [[-5.60, 56.45], [-4.10, 56.35], [-2.30, 56.50]],
      direction: 'export',
      intensity: 0.9,
      metrics: [
        { label: ['Settlement periods constrained', '受约束结算时段占比'],
          value: ['~40%', '约40%'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.BALANCING,
        text: [
          'Constrained more often than B6 and further from demand, so a northern battery sees more constraint hours but pays more to export whenever it is not constrained. The two effects work against each other and both belong in the same case.',
          '受约束频率高于B6断面且距负荷更远，因此北部储能可享有更多受约束小时数，但在不受约束时的送出成本更高。两种效应方向相反，须纳入同一投资测算。',
        ],
      },
      relief: {
        project: ['Clean Power 2030 / Beyond 2030 reinforcement package', '2030清洁电力及2030后增容工程包'],
        operator: 'NESO / transmission owners',
        scope: ['Multiple onshore and offshore reinforcements north of B6; the package, not one project',
                'B6断面以北的多项陆上及海上增容工程；为工程包而非单一项目'],
        expected: 2030,
        status: RELIEF_STATUS.APPROVED,
      },
      investor: [
        'A package date is weaker evidence than a project date. Ask which named reinforcement your constraint depends on and what its tranche is — "Clean Power 2030" is a programme, and programmes slip in pieces rather than all at once.',
        '工程包日期的证据力弱于单一项目日期。应追问所依赖的约束具体对应哪项具名增容工程及其批次 — “2030清洁电力”是一个计划，而计划是分块延期而非整体延期。',
      ],
      source: 'NESO Annual Balancing Costs Report; Clean Power 2030 Action Plan',
      sourceUrl: URL.cp2030,
    },

    {
      id: 'gb-thermal-redispatch',
      bearsOn: 'merchGross',
      name: ['English thermal re-dispatch', '英格兰火电再调度'],
      shape: 'zone',
      coord: [-1.10, 53.60],
      direction: 'import',
      intensity: 0.85,
      metrics: [
        { label: ['Paid to turn English gas on', '为启动英格兰燃气机组所付费用'],
          value: ['£1.08bn', '£10.8亿'], period: ['calendar 2025', '2025日历年'] },
        { label: ['Thermal constraint share of balancing cost', '火电约束占平衡成本比例'],
          value: ['£1.7bn of £3.1bn', '31亿英镑中的17亿英镑'], period: ['year to March 2026', '截至2026年3月的年度'] },
      ],
      capture: {
        mechanism: CAPTURE.BALANCING,
        text: [
          'The south side of the same constraint: gas is paid to run because power cannot arrive from Scotland. A battery here competes directly with that gas on price, which caps what it can earn at the gas plant\'s offer.',
          '同一约束的南侧：因电力无法自苏格兰输入，燃气机组获得报酬运行。此处的储能在价格上与该燃气机组直接竞争，因此其收入上限受制于燃气机组的报价。',
        ],
      },
      relief: {
        project: ['2030 network delivery programme', '2030年电网交付计划'],
        operator: 'NESO',
        scope: ['Valued by NESO at £13.1bn of constraint savings across asset lifetime',
                'NESO评估其全寿命期约束成本节约达131亿英镑'],
        expected: 2030,
        status: RELIEF_STATUS.APPROVED,
      },
      investor: [
        'Read NESO\'s £13.1bn saving as the size of the revenue pool being removed, not only as a consumer benefit. NESO also warns balancing costs reach £6.4–8.3bn by 2030 if the network is late — which is the same statement with the sign reversed, and is why delivery risk is an upside for an incumbent battery and a downside for the consumer.',
        'NESO所称131亿英镑的节约，不应仅视为消费者收益，同时也是被移除的收入池规模。NESO另警告，若电网延期，平衡成本到2030年将达64–83亿英镑 — 这是同一事实的反向表述，也说明交付延误对已投运储能是上行因素、对消费者则是下行因素。',
      ],
      source: 'NESO Annual Balancing Costs Report 2026',
      sourceUrl: URL.balancing,
    },

    {
      id: 'gb-no-locational-price',
      bearsOn: 'merchGross',
      name: ['No locational wholesale price', '批发电价无区位信号'],
      shape: 'zone',
      coord: [-1.55, 52.45],
      direction: 'both',
      intensity: 0.5,
      metrics: [
        { label: ['Zonal pricing decision', '分区电价决定'],
          value: ['Rejected', '已否决'], period: ['REMA Summer Update, 10 July 2025', 'REMA夏季更新，2025年7月10日'] },
      ],
      capture: {
        mechanism: CAPTURE.BALANCING,
        text: [
          'Not a constraint but the rule that governs all of them: one national wholesale price means siting next to congestion changes nothing about the price a battery trades at. Every pound of GB congestion value must be earned through balancing actions.',
          '这并非某项约束，而是支配所有约束的规则：全国单一批发电价意味着邻近拥塞选址并不改变储能的成交价格。英国拥塞价值的每一分钱都必须通过平衡机制指令赚取。',
        ],
      },
      relief: {
        project: ['Reformed national pricing / Strategic Spatial Energy Plan', '改革后的全国统一电价 / 战略空间能源规划'],
        operator: 'DESNZ / NESO',
        scope: ['Locational signals to move into network charging and spatial planning rather than the wholesale price; first SSEP iteration due 2026',
                '区位信号将转移至网络收费及空间规划，而非批发电价；首版战略空间能源规划预计2026年发布'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'The single most important line for a GB congestion thesis, and it is a policy line rather than an engineering one. Until the SSEP and network-charging reforms are specified, a site cannot be underwritten on locational price capture — only on Balancing Mechanism access. Treat any model that prices GB congestion into the wholesale spread as modelling a market that was explicitly rejected.',
        '这是英国拥塞投资逻辑中最重要的一行，且属政策而非工程问题。在战略空间能源规划及网络收费改革明确之前，场址无法以区位价格兑现为承销依据，只能依靠平衡机制准入。任何将英国拥塞价值计入批发价差的模型，都是在为一个已被明确否决的市场建模。',
      ],
      source: 'DESNZ REMA Summer Update, July 2025',
      sourceUrl: URL.rema,
    },
  ],
};

export default GB_CONGESTION;
