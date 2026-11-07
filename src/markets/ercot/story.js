/* The ERCOT market story: page text transcribed from the signed G-1 script
   (docs/immersive-experience-plan/ercot-storyboard.md, approved 1 November
   2026) and its "Analyst decisions — 1 November 2026". Every figure is a
   {token} resolved by storyBindings.js from a field the card or market page
   already reads, or from the fixed-vintage records in data/storyEvidence.js.

   Where the build-evidence record (ercot-build-evidence.md) sets the wording,
   it governs the script's draft:
     - ercot-05 and ercot-06 use the §5 Example-state copy while the fleet and
       reserve-price series are gated; the signed numerical sentences return
       only with cleared records and a content change.
     - ercot-11 uses the §8 scoped toll wording and the "Contract price
       unverified" label.
   No toll price, range or proxy appears anywhere in this file. */
import { ERCOT_STORY_SOURCES as RECORD_SOURCES } from './data/storyEvidence.js';

const ex = (en, zh) => [en, zh];

/* Sources the page links to: the fixed-vintage records that carry a URL, plus
   public pages the canonical register names (source-register.md
   #g1-ercot-evidence). Unopened operator notices without a URL (SRC-ERCOT-14,
   SRC-ERCOT-19) and the unread capacity workbook are not linked. */
const linked = Object.fromEntries(Object.entries(RECORD_SOURCES)
  .filter(([, s]) => s.url).map(([id, s]) => [id, { title: s.title, url: s.url, publisher: s.publisher }]));
const SOURCES = {
  ...linked,
  'SRC-ERCOT-09': { publisher: 'Public Utility Commission of Texas', title: 'PUCT Approves New ERCOT Process to Manage Electricity Requests from Data Centers, Large Power Users', url: 'https://ftp.puc.texas.gov/public/puct-info/agency/resources/pubs/news/2026/PUCT-Approves-New-ERCOT-Process-to-Manage-Electricity-Requests-from-Data-Centers-Large-Power-Users.pdf' },
  'SRC-ERCOT-11': { publisher: 'ERCOT', title: 'Resource adequacy (MORA reports)', url: 'https://www.ercot.com/gridinfo/resource' },
  'SRC-ERCOT-12': { publisher: 'Federal Energy Regulatory Commission', title: 'Electric Reliability Council of Texas (ERCOT)', url: 'https://www.ferc.gov/industries-data/electric/electric-power-markets/ercot' },
  'SRC-ERCOT-13': { publisher: 'Potomac Economics', title: 'ERCOT: Independent Market Monitor', url: 'https://www.potomaceconomics.com/markets-monitored/ercot/' },
  'SRC-ERCOT-15': { publisher: 'Texas Legislature', title: 'S.B. No. 2116, 87th Legislature (2021), enrolled: Business & Commerce Code §113.002', url: 'https://capitol.texas.gov/tlodocs/87R/billtext/html/SB02116F.htm' },
  'REPO-ERCOT-LIVE': { publisher: 'This platform', title: 'ERCOT investment case: Bankable case', url: '/markets/ercot#bankable' },
};

export const story = {
  storySchemaVersion: 1,
  contentVersion: '2026-11-07',
  marketId: 'ercot',
  systemBoundary: ['ERCOT grid: most of Texas, not synchronously connected to the rest of the US grid', 'ERCOT电网：覆盖得州大部分地区，与美国其他电网没有同步连接'],
  supportedLocales: ['en', 'zh'],
  playRef: 'ercot-toll-2h',
  /* The G-1 approval date is kept, not today's computation (build evidence §4). */
  reviewedAgainst: { playRef: 'ercot-toll-2h', hours: 2, call: 'opportunistic', on: '2026-11-01' },
  sources: SOURCES,
  claims: {
    'CL-ERCOT-02': { sources: ['SRC-ERCOT-01', 'SRC-ERCOT-12', 'SRC-ERCOT-13'] },
    'CL-ERCOT-03': { sources: ['SRC-ERCOT-01', 'SRC-ERCOT-06', 'SRC-ERCOT-07', 'SRC-ERCOT-08'] },
    'CL-ERCOT-04': { sources: ['SRC-ERCOT-10'] },
    'CL-ERCOT-05': { sources: ['SRC-ERCOT-01', 'SRC-ERCOT-02', 'SRC-ERCOT-03', 'SRC-ERCOT-05', 'REPO-ERCOT-LIVE'] },
    'CL-ERCOT-06': { sources: ['SRC-ERCOT-04', 'SRC-ERCOT-03', 'SRC-ERCOT-01'] },
    'CL-ERCOT-07': { sources: ['SRC-ERCOT-01'] },
    'CL-ERCOT-08': { sources: ['SRC-ERCOT-01', 'SRC-ERCOT-02'] },
    'CL-ERCOT-09': { sources: ['SRC-ERCOT-01'] },
    'CL-ERCOT-10': { sources: ['SRC-ERCOT-01', 'SRC-ERCOT-09'] },
    'CL-ERCOT-11': { sources: ['REPO-ERCOT-LIVE', 'SRC-ERCOT-01'] },
    'CL-ERCOT-12': { sources: ['SRC-ERCOT-01'] },
    /* DRRS: SRC-ERCOT-17 is unopened; the opened monitor report corroborates. */
    'CL-ERCOT-13': { sources: ['SRC-ERCOT-01'] },
    'CL-ERCOT-14': { sources: ['SRC-ERCOT-11', 'SRC-ERCOT-01', 'REPO-ERCOT-LIVE'] },
    'CL-ERCOT-15': { sources: ['SRC-ERCOT-15'] },
  },
  opening: {
    id: 'ercot-00', chapter: 'opening', scene: 'ercot-00',
    question: ['What is the call here, and what would make it investable?', '这里的投资判断是什么？怎样才值得投资？'],
    copy: [
      'The existing play card: {call} · {play} · {cardFigures} · {nextActionClause}. Beneath it: "Fastest to connect, hardest to get paid. Even with a toll, the reference case falls short of the fund\'s target, so only a toll already signed at a known price can make a case."',
      '沿用现有方案卡：{call} · {play} · {cardFigures} · {nextActionClause}。卡片下方一行：“并网最快，回款最难。即便有租赁，参考情景仍达不到基金的目标回报；只有已经签署、价格明确的租赁，才可能让投资成立。”',
    ],
    meaning: null,
    marker: { level: 'play' },
    controls: [['Start the story', '开始阅读'], ['Go to the investment case', '前往投资方案']],
    claims: ['CL-ERCOT-11'],
  },
  chapters: [
    { id: 'origins', title: ['Origins', '系统起点'], shots: [
      { id: 'ercot-01', chapter: 'origins', scene: 'ercot-01',
        question: ['Which grid is this, and what sets it apart?', '这是哪张电网？它有何与众不同？'],
        copy: [
          'ERCOT runs most of Texas as a grid of its own. It is not synchronously connected to the rest of the US grid: a few direct-current ties, {dcTieCapacity} in all, link it to its neighbours. Texas, through its Public Utility Commission, regulates ERCOT and its market.',
          'ERCOT将得州大部分地区作为一张独立电网运行。它与美国其他电网没有同步连接，仅靠几条直流联络线与邻近电网相连，总容量为{dcTieCapacity}。ERCOT及其市场由得州通过公用事业委员会监管。',
        ],
        meaning: ['A grid with its own regulator could choose its own market design: pay only for energy and reserves, and connect new plants fast.', '拥有自己监管机构的电网，可以自行选择市场设计：只为电能量和备用付费，并让新电源快速并网。'],
        marker: { level: 'strong', change: ["a new synchronous link to a neighbouring grid, or a change in who regulates ERCOT's wholesale market.", '与邻近电网新建同步联络，或ERCOT批发市场的监管归属发生变化。'] },
        controls: [["ERCOT's grid", 'ERCOT电网'], ['Links to neighbours', '与邻近电网的联络'], ['Who sets the rules', '谁制定规则']],
        claims: ['CL-ERCOT-02'],
        labels: {
          texas: ['Texas', '得克萨斯州'],
          grid: ["ERCOT's grid (schematic)", 'ERCOT电网（示意）'],
          tie: ['Direct-current tie', '直流联络线'],
          spp: ['Southwest Power Pool', '西南电力联营'],
          mexico: ['Mexico', '墨西哥'],
          puct: ['Public Utility Commission of Texas', '得州公用事业委员会'],
        },
        caption: ['Schematic. Texas outline: Natural Earth. No ERCOT boundary is drawn; ties are links, not flows.', '示意图。得州轮廓：Natural Earth。图中未绘制ERCOT边界；联络线表示连接，而非潮流。'],
      },
    ] },
    { id: 'choices', title: ['Historical choices', '历史选择'], shots: [
      { id: 'ercot-02', chapter: 'choices', scene: 'ercot-02',
        question: ['How does a market without capacity payments pay for reliability?', '没有容量付费的市场，如何为可靠性付费？'],
        copy: [
          'ERCOT pays for energy and reserves, not for capacity. Reliability is meant to be paid through scarcity prices, which rise when reserves run short, up to a cap of {offerCap}. The regulator adopted a reliability credit in 2023, then decided on 19 December 2024 not to take it forward.',
          'ERCOT为电能量和备用付费，不为容量付费。可靠性本应通过稀缺电价获得回报：备用不足时电价上升，上限为{offerCap}。监管机构曾于2023年通过一项可靠性信用机制，又于2024年12月19日决定不再推进。',
        ],
        meaning: ["Nothing in this market pays the play's battery for being available; it earns only when it sells energy or reserves.", '这个市场不会因本方案的电池“随时可用”而付钱；它只有在出售电能量或备用时才有收入。'],
        marker: { level: 'strong', change: ['the regulator adopting a capacity or reliability payment that a battery can earn.', '监管机构推出电池能够获得的容量或可靠性付费。'] },
        controls: [['Select a node', '选择节点'], ['Constraint', '约束'], ['Choice', '选择'], ['What remains', '遗留'], ['Effect today', '今日影响']],
        claims: ['CL-ERCOT-03', 'CL-ERCOT-12'],
        labels: {
          cap: ['Offer cap: {offerCap}', '报价上限：{offerCap}'],
          oldCap: ['Before 2022: {oldOfferCap}', '2022年以前：{oldOfferCap}'],
          curve: ['Scarcity price rises as reserves run short', '备用越紧张，稀缺电价越高'],
          short: ['Reserves short', '备用短缺'],
          ample: ['Reserves ample', '备用充裕'],
          closed: ['Adopted, then not taken forward', '已通过，后未推进'],
          curves: ['Since December 2025: reserve demand curves', '自2025年12月起：备用需求曲线'],
          schematic: ['Schematic', '示意'],
        },
        /* Six dated records (data/storyEvidence.js ERCOT_HISTORY); ercot-04 shows H-ERCOT-02 and -05. */
        extra: {
          historyNodes: [
            { id: 'H-ERCOT-01', style: 'observed',
              title: ex('Scarcity priced through a reserve curve', '通过备用曲线为稀缺定价'),
              constraint: ex('A market without capacity payments had to pay enough in tight hours to keep and attract plants.', '没有容量付费的市场，必须在供应紧张时付出足够高的价格，才能留住并吸引电厂。'),
              choice: ex('Add a price adder that rises automatically as operating reserves fall.', '引入随运行备用下降而自动上升的价格加价。'),
              remains: ex('Scarcity is priced inside energy and reserve prices; since December 2025, through reserve demand curves.', '稀缺性计入电能量与备用价格；自2025年12月起改由备用需求曲线定价。'),
              effect: ex('A battery earns scarcity value only in the hours when reserves run short.', '电池只有在备用短缺的时段才能获得稀缺价值。') },
            { id: 'H-ERCOT-02', style: 'observed',
              title: ex('Winter Storm Uri', 'Uri冬季风暴'),
              constraint: ex('Extreme cold cut supply as demand soared, and ERCOT ordered outages for days.', '极寒天气使供给锐减而需求激增，ERCOT连续数日下令停电。'),
              choice: ex('Run the grid more cautiously, with far more reserves held ready.', '以更审慎的方式运行电网，保持多得多的备用待命。'),
              remains: ex('Larger reserve purchases.', '更大规模的备用采购。'),
              effect: ex('Larger reserve purchases expanded an opportunity batteries could compete for.', '备用采购扩大了电池可以争取的收入机会。') },
            { id: 'H-ERCOT-03', style: 'observed',
              title: ex('A lower price cap', '更低的价格上限'),
              constraint: ex('After the storm, the regulator found the old cap a liability for market participants and customers.', '寒潮之后，监管机构认为原有上限已成为市场参与者和用户的负担。'),
              choice: ex("Lower the offer cap from {oldOfferCap} to {offerCap}, from 2022, and keep the market's design.", '将报价上限由{oldOfferCap}降至{offerCap}，自2022年起执行，并保留市场设计。'),
              remains: ex('The lower cap.', '较低的上限。'),
              effect: ex('Scarcity hours pay less than they once could.', '稀缺时段的收益上限低于从前。') },
            { id: 'H-ERCOT-04', style: 'closed',
              title: ex('A reliability credit, adopted then set aside', '可靠性信用机制：通过后搁置'),
              constraint: ex('After the storm, pressure to pay for supply that can run on demand.', '寒潮之后，各方要求为可按需出力的电源付费。'),
              choice: ex("Adopt a performance credit mechanism in January 2023 and wait for the legislature; on 19 December 2024, adopt staff's recommendation not to take it forward.", '2023年1月通过绩效信用机制并等待州议会审议；2024年12月19日采纳工作人员建议，不再推进。'),
              remains: ex('No capacity payment.', '没有容量付费。'),
              effect: ex('A battery earns from energy, reserves or a private contract.', '电池的收入来自电能量、备用或私人合同。') },
            { id: 'H-ERCOT-05', style: 'observed',
              title: ex('A new reserve, ECRS', '新增备用产品ECRS'),
              constraint: ex('ERCOT wanted more reserve that can restore frequency within ten minutes.', 'ERCOT需要更多能在十分钟内恢复频率的备用。'),
              choice: ex('Add the ERCOT Contingency Reserve Service, almost doubling the ten-minute reserves bought.', '新增ERCOT应急备用服务（ECRS），十分钟备用采购量几乎翻倍。'),
              remains: ex('A larger reserve market.', '更大的备用市场。'),
              effect: ex('Its prices were high at first, then fell as batteries crowded in.', '其价格起初很高，随电池大量涌入而回落。') },
            { id: 'H-ERCOT-06', style: 'observed',
              title: ex('Real-time co-optimisation', '实时联合优化'),
              constraint: ex('Reserves were bought only a day ahead.', '备用原先只在日前市场采购。'),
              choice: ex('Buy energy and reserves together every five minutes, and shorten the energy a battery must hold behind some reserves.', '每五分钟同时采购电能量与备用，并缩短部分备用要求电池预留电量的时长。'),
              remains: ex('More resources can offer each reserve.', '每种备用都有更多资源可以报价。'),
              effect: ex('Better dispatch for one battery; more competition for the same reserve.', '单个电池调度更灵活，同一份备用的竞争更激烈。') },
          ],
        },
      },
      { id: 'ercot-03', chapter: 'choices', scene: 'ercot-03',
        question: ['Why could so many batteries connect so quickly?', '为什么这么多电池能这么快并网？'],
        copy: [
          'ERCOT lets a new plant connect without first paying for wider network upgrades, then manages congestion by redispatching or curtailing it. Its requests reached a signed interconnection agreement in {monthsToAgreement} on average, faster than comparable requests elsewhere in the US.',
          'ERCOT允许新电源在无需先承担更大范围电网升级费用的情况下并网，之后再通过再调度或限电管理阻塞。平均而言，其并网申请在{monthsToAgreement}内即可签署并网协议，快于美国其他地区的同类申请。',
        ],
        meaning: ["Fast connection gets the play's battery to market sooner, and every competitor too.", '快速并网让本方案的电池更早进入市场，也让每一个竞争者同样如此。'],
        marker: { level: 'fair', change: ["ERCOT's interconnection rules read at source, or queue data showing its timelines lengthening.", '直接核读ERCOT的并网规则，或排队数据显示其并网周期变长。'] },
        controls: [['ERCOT', 'ERCOT'], ['Elsewhere in the US', '美国其他地区']],
        claims: ['CL-ERCOT-04'],
        labels: {
          connect: ['Connect, then manage congestion', '先并网，再管理阻塞'],
          upgrade: ['Upgrade first, then connect', '先升级，后并网'],
          curtailed: ['Curtailed when congested', '阻塞时限电'],
          schematic: ['Schematic', '示意'],
        },
      },
      { id: 'ercot-04', chapter: 'choices', scene: 'ercot-04',
        question: ['Where did the first batteries earn their money?', '第一批电池靠什么赚钱？'],
        copy: [
          'After Winter Storm Uri, ERCOT adopted a more cautious operating posture and increased reserve procurement. ECRS added another product. These changes expanded opportunities that batteries could compete for; the market monitor reports that reserves accounted for much of their early income.',
          'Uri冬季风暴之后，ERCOT采用更审慎的运行方式并增加备用采购，ECRS又新增了一项产品。这些变化扩大了电池可以争取的收入机会；市场监测报告指出，备用占早期电池收入的较大部分。',
        ],
        meaning: ['Reserve purchases, battery entry and other market changes jointly shaped the opportunity.', '备用采购、电池进入及其他市场变化共同塑造了这项机会。'],
        marker: { level: 'fair', change: ['the operator’s procurement records or a different explanation supported by the market monitor.', '运营商采购记录，或市场监测报告支持的其他解释。'] },
        controls: [['The storm', '寒潮'], ['A new reserve', '新增备用'], ['Who supplied it', '由谁提供']],
        claims: ['CL-ERCOT-06'],
        labels: {
          outages: ['Outages', '停电'],
          reserves: ['Reserves bought', '采购的备用'],
          batteries: ['Batteries', '电池'],
          gas: ['Gas plants', '燃气电厂'],
          schematic: ['Schematic', '示意'],
        },
      },
    ] },
    { id: 'tensions', title: ["Today's tensions", '当下矛盾'], shots: [
      { id: 'ercot-05', chapter: 'tensions', scene: 'ercot-05',
        question: ['How fast did batteries arrive?', '电池来得有多快？'],
        /* Build evidence §5: Example-state copy while the installed-capacity series is gated. */
        copy: [
          'Public monitoring reports rapid battery growth. The installed-capacity series is awaiting source verification; the picture is an unscaled Example.',
          '公开监测报告记载电池装机快速增长。装机序列仍待来源核验；图中展示未按比例绘制的示例。',
        ],
        meaning: ["Every new battery competes with the play's battery for the same reserves and the same price spreads.", '每一个新电池，都在与本方案的电池争夺同样的备用和同样的价差。'],
        marker: { level: 'strong', change: ["ERCOT's own installed-capacity series differing materially from the market monitor's year-end figures.", 'ERCOT自身的装机序列与市场监测机构的年末数据存在实质差异。'] },
        controls: [['2021', '2021'], ['2022', '2022'], ['2023', '2023'], ['2024', '2024'], ['2025', '2025']],
        claims: ['CL-ERCOT-05'],
        labels: {
          installed: ['Installed battery power', '电池装机功率'],
          yearEnd: ['End of year', '年末'],
          schematic: ['Schematic, not to scale', '示意，未按比例'],
          example: ['Example', '示例'],
        },
        caption: ['Observed series awaiting publication clearance; showing an Example.', '观测序列待确认发布权限；当前展示示例。'],
      },
      { id: 'ercot-06', chapter: 'tensions', scene: 'ercot-06',
        question: ['What happened to reserve prices as batteries arrived?', '电池大量进入后，备用价格发生了什么？'],
        /* Build evidence §5: Example-state copy; the monitor's revenue change is a
           separately cleared statistic bound to its own record and qualifier. */
        copy: [
          'The market monitor reports that reserve prices fell as batteries entered. The price series is awaiting publication clearance; the picture is an unscaled Example. Prices are not captured revenue. Revenue per kilowatt of battery fell by {revenuePerKwChange} in 2025 alone.',
          '市场监测报告记载，随着电池进入，备用价格下跌。价格序列仍待确认发布权限；图中展示未按比例绘制的示例。价格不等于实际取得的收入。仅2025年，每千瓦电池的收入就下降了{revenuePerKwChange}。',
        ],
        meaning: ["The reserve income that paid the first batteries cannot carry the play's case.", '曾为第一批电池带来收入的备用，已不能支撑本方案的投资逻辑。'],
        marker: { level: 'strong', change: ['ERCOT buying materially more reserves, or the market monitor revising its price table.', 'ERCOT大幅增加备用采购量，或市场监测机构修订其价格表。'] },
        controls: [['Responsive reserve', '响应备用'], ['ECRS', 'ECRS'], ['Regulation up', '上调调频'], ['Regulation down', '下调调频'], ['Non-spinning reserve', '非旋转备用'], ['How measured', '如何计算']],
        claims: ['CL-ERCOT-07', 'CL-ERCOT-08'],
        labels: {
          installed: ['Installed battery power', '电池装机功率'],
          price: ['Average day-ahead reserve price', '日前备用年均价格'],
          example: ['Example', '示例'],
        },
        extra: {
          measured: [
            ex('Reserve prices are paid per MW held ready, per hour; they are never compared with energy prices per MWh.', '备用价格按待命MW、按小时计；不与按MWh计的电能量价格比较。'),
            ex("The observed layer will use the annual averages of day-ahead clearing prices in one report vintage: the market monitor's 2025 State of the Market Report.", '观测图层将采用同一期报告中的日前出清价格年均值：市场监测机构的《2025 State of the Market Report》。'),
            ex('ECRS began in June 2023. A price is not the revenue a battery captured.', 'ECRS自2023年6月起实施。价格不等于电池实际取得的收入。'),
          ],
        },
        caption: ['Example: battery power rising, reserve prices falling; no values. Observed series awaiting publication clearance.', '示例：电池装机上升、备用价格下降；不显示数值。观测序列待确认发布权限。'],
      },
      { id: 'ercot-07', chapter: 'tensions', scene: 'ercot-07',
        question: ['Does this market still pay for scarcity?', '这个市场还会为稀缺付费吗？'],
        copy: [
          'Rarely. With more batteries and solar and little extra peak demand, reserves stayed ample. In 2025 scarcity pricing was active for only {ordcHours} and added {ordcAdder} to the average real-time price, the least since it began in 2014. A tight year can still bring high prices, but no one can say when.',
          '很少了。电池和光伏增加，而峰值负荷增长有限，备用一直充裕。2025年，稀缺定价仅在{ordcHours}内生效，使实时均价仅增加{ordcAdder}，为2014年启用以来最低。偏紧的年份仍可能带来高价，但无人能预知何时出现。',
        ],
        meaning: ['Scarcity revenue is real but rare and unpredictable, so it cannot be underwritten; that is why the play needs a contracted fee.', '稀缺收益确实存在，但罕见且难以预测，无法作为承销依据；这正是本方案需要合同固定费用的原因。'],
        marker: { level: 'strong', change: ['a run of tight years, from extreme weather or fast load growth, that brings scarcity pricing back.', '极端天气或负荷快速增长带来连续偏紧的年份，使稀缺定价重新频繁出现。'] },
        controls: [['A recent year', '近期年份'], ['A tight year (Example)', '偏紧年份（示例）']],
        claims: ['CL-ERCOT-09', 'CL-ERCOT-10'],
        labels: {
          reserves: ['Reserves', '备用'],
          scarcity: ['Scarcity price', '稀缺电价'],
          example: ['Example', '示例'],
        },
      },
    ] },
    { id: 'battery', title: ['Add a battery', '加入电池'], shots: [
      { id: 'ercot-08', chapter: 'battery', scene: 'ercot-08',
        question: ['What can a {playDuration}-hour battery sell here?', '{playDuration}小时电池在这里能卖什么？'],
        copy: [
          'It can charge when solar floods the middle of the day and discharge into the morning and evening ramps, or hold its power ready as a reserve. Each upward reserve requires the battery to keep energy behind its offer: {reserveDurationRules}. The same megawatts cannot be sold twice.',
          '它可以在中午光伏大发时充电，在早晚负荷爬坡时放电；也可以把功率作为备用保持待命。每种上调备用都要求电池为其报价预留电量：{reserveDurationRules}。同样的兆瓦不能卖两次。',
        ],
        meaning: ["The play's battery earns from moving energy and from reserves, and other batteries keep entering both.", '本方案的电池靠转移电能和提供备用赚钱，而这两个市场都在不断涌入其他电池。'],
        marker: { level: 'fair', change: ['ERCOT changing the reserve duration rules, or tested limits for the actual battery.', 'ERCOT调整备用时长规则，或实际电池的测试限制。'] },
        controls: [['Move energy', '转移电能'], ['Hold a reserve', '保持备用'], ['Reset example', '重置示例']],
        claims: ['CL-ERCOT-12'],
        labels: {
          charge: ['Charge at midday', '中午充电'],
          discharge: ['Discharge on the ramps', '爬坡时放电'],
          held: ['Energy held for the reserve', '为备用预留的电量'],
          battery: ['Example: {teachingPower} MW battery', '示例：{teachingPower}MW电池'],
        },
        extra: {
          products: [ex('Regulation up', '上调调频'), ex('Responsive reserve', '响应备用'), ex('ECRS', 'ECRS'), ex('Non-spinning reserve', '非旋转备用')],
        },
      },
      { id: 'ercot-09', chapter: 'battery', scene: 'ercot-09',
        question: ['Why a toll, and why {playDuration} hours?', '为什么选择租赁，为什么是{playDuration}小时？'],
        copy: [
          "In the platform's design test, a toll at {playDuration} hours loses the least value of any priced design. Selling at market prices loses more at every duration, and more the longer the battery. Tolls at other durations are not priced. {playDuration} hours is also close to what ERCOT's fleet builds.",
          '在本平台的设计测试中，{playDuration}小时的租赁方案在所有已定价设计中价值损失最小。按市场价格运营，在每个时长下损失都更大，且时长越长损失越大。其他时长的租赁尚未定价。{playDuration}小时也接近ERCOT机组的实际建设时长。',
        ],
        meaning: ["The toll is chosen because it loses the least, not because it clears the fund's target.", '选择租赁是因为它损失最小，而不是因为它达到了基金的目标回报。'],
        marker: { level: 'fair', change: ["a lower battery cost, or a toll priced at another duration, that moves the design grid's best cell.", '电池成本下降，或其他时长的租赁获得定价，使设计表的最优单元改变。'] },
        controls: [['Current play', '当前方案'], ['Merchant at each duration', '各时长市场化方案'], ['Open the design grid', '查看设计表']],
        claims: ['CL-ERCOT-11', 'CL-ERCOT-05'],
        labels: {
          toll: ['Toll', '租赁'],
          merchant: ['Merchant', '市场化'],
          notPriced: ['Not priced', '未定价'],
          least: ['Least value lost', '价值损失最小'],
        },
        extra: {
          /* Build addition for G-2: the fleet comparator, bound to its record. */
          fleet: ex("ERCOT's fleet average at the end of 2025, per the market monitor: {fleetAverageDuration}", '据市场监测机构，ERCOT电池机组2025年底的平均时长：{fleetAverageDuration}'),
        },
      },
    ] },
    { id: 'payment', title: ['Who pays', '谁来付钱'], shots: [
      { id: 'ercot-10', chapter: 'payment', scene: 'ercot-10',
        question: ['Who pays a battery in ERCOT, and for what?', '在ERCOT，谁为电池付费？为什么付费？'],
        copy: [
          "ERCOT's market pays for energy delivered and for reserves held ready, and load-serving entities bear the cost of reserves. Nobody pays for capacity. A toll replaces all of this with one private contract: a counterparty pays a fixed fee and takes the battery's market revenue.",
          'ERCOT市场为送出的电能量和保持待命的备用付费，备用成本由售电主体承担。没有人为容量付费。租赁以一份私人合同取代上述全部收入：交易对手支付固定费用，并取得电池的市场收入。',
        ],
        meaning: ["During a toll, the owner's revenue depends on the fee and the counterparty, not on market prices.", '在租赁期内，业主收入取决于租赁费和交易对手，而不是市场价格。'],
        marker: { level: 'fair', change: ["an executed toll's terms: dispatch rights, deductions, who pays for charging, and termination.", '已签租赁的条款，包括调度权、扣款、充电成本由谁承担及终止条件。'] },
        controls: [['Energy', '电能量'], ['Reserves', '备用'], ['Capacity', '容量'], ['Toll', '租赁']],
        claims: ['CL-ERCOT-03', 'CL-ERCOT-11'],
        labels: {
          energy: ['Paid per MWh delivered', '按送出的MWh付费'],
          reserves: ['Paid per MW held ready, per hour', '按待命MW、按小时付费'],
          capacity: ['No capacity payment', '无容量付费'],
          toll: ['Fixed fee from a counterparty', '交易对手支付的固定费用'],
        },
        extra: {
          routes: [
            ex('ERCOT settlement → battery. Who pays: the market, at the nodal price. Obligation: follow dispatch. Evidence: mechanism sourced.', 'ERCOT结算 → 电池。付款方：市场，按节点电价。义务：按调度指令运行。证据：机制已有出处。'),
            ex('ERCOT → battery: ERCOT buys the reserve; load-serving entities bear its cost, by metered load. Obligation: keep the energy the product requires and respond when deployed. Evidence: mechanism sourced.', 'ERCOT → 电池：ERCOT采购备用；成本由售电主体按计量负荷分摊。义务：保留该产品要求的电量，并在调用时响应。证据：机制已有出处。'),
            ex('No path: nothing in ERCOT pays a battery for being available. Evidence: mechanism sourced.', '无路径：ERCOT没有任何机制为电池“随时可用”付费。证据：机制已有出处。'),
            ex("Counterparty → owner: a fixed fee; the counterparty takes the battery's market revenue. Obligation: the contract's terms. Evidence: the model's assumed route; counterparty, fee and terms unverified.", '交易对手 → 业主：固定费用；交易对手取得电池的市场收入。义务：合同条款。证据：模型假设的路径；交易对手、费用与条款均未核验。'),
          ],
        },
      },
      { id: 'ercot-11', chapter: 'payment', scene: 'ercot-11',
        question: ['What must be true before this play is worth buying?', '这个方案要满足什么条件，才值得买入？'],
        /* Build evidence §8: the scoped toll wording replaces the draft's universal claim. */
        copy: [
          'The reference case assumes a toll covering {securedShare} of first-year revenue for {securedTenor} years, followed by merchant revenue. These are model assumptions; no executed toll or toll price has been verified for this reference investment. Even with that assumption, its all-equity return is {holdIrr}, {marginToTarget}. Only an executed agreement with a readable price, full terms and acceptable counterparty credit can be underwritten.',
          '参考情景假设一份租赁，覆盖首年收入的{securedShare}，期限为{securedTenor}年，此后转为市场化收入。这些都是模型假设；本参考投资尚未核验已签租赁及其价格。即便采用这一假设，其全股权回报仍为{holdIrr}，{marginToTarget}。只有价格可读取、条款完整且交易对手信用可接受的已签协议，才可用于投资承销。',
        ],
        meaning: ["The executed toll's price, not the market's growth, decides whether this play can reach the fund's target.", '决定本方案能否达到基金目标的，是已签租赁的价格，而不是市场的增长。'],
        marker: { level: 'fair', change: ["an executed toll's price and full terms, including tenor, indexation, availability deductions and counterparty credit.", '已签租赁的价格与完整条款，包括期限、指数化、可用率扣款及交易对手信用。'] },
        controls: [['During the toll', '租赁期内'], ['After expiry', '到期以后'], ['Contract checks', '合同核查']],
        claims: ['CL-ERCOT-11'],
        labels: {
          toll: ['Modelled toll (assumption)', '模型租赁（假设）'],
          price: ['Contract price unverified', '合同价格未核验'],
          after: ['Market revenue after expiry', '到期后的市场收入'],
          counterparty: ['Counterparty', '交易对手'],
          tenor: ['Tenor', '期限'],
          indexation: ['Indexation', '指数化'],
          deductions: ['Availability deductions', '可用率扣款'],
          dispatch: ['Dispatch rights', '调度权'],
        },
        extra: {
          checks: [
            ex('Who pays the fee, and the credit support behind it.', '由谁支付费用，以及背后的信用支持。'),
            ex('How many years the fee runs; merchant revenue follows.', '费用持续多少年；此后转为市场化收入。'),
            ex('Whether, and how, the fee moves with prices over the term.', '费用在合同期内是否以及如何随价格调整。'),
            ex('What is deducted when the battery is not available.', '电池不可用时扣减多少。'),
            ex('Who decides when the battery charges and discharges, and who pays for charging.', '由谁决定电池何时充放电，以及充电成本由谁承担。'),
          ],
        },
      },
    ] },
    { id: 'investment', title: ['The investment', '回到投资'], shots: [
      { id: 'ercot-12', chapter: 'investment', scene: 'ercot-12',
        question: ['What would make this play less attractive, and what should I read next?', '什么会让这个方案失去吸引力？下一步该读什么？'],
        copy: [
          'More batteries, lower reserve prices, a weaker or shorter toll, and rules that cut how much reserve ERCOT buys can all weaken it. Faster load growth, mostly data centres, is what could tighten the market again; today it is a queue, not committed demand. Next: {nextAction}',
          '更多电池、更低的备用价格、更弱或更短的租赁，以及削减ERCOT备用采购量的规则，都可能削弱本方案。负荷加速增长（主要来自数据中心）可能使市场重新趋紧；但目前它只是排队申请，并非已确定的需求。下一步：{nextAction}',
        ],
        meaning: ["The toll's price and term decide the case; adequacy reports describe the market behind it, not its price.", '决定方案的是租赁的价格和期限；资源充裕度报告描述的是其背后的市场，而不是租赁价格。'],
        marker: { level: 'fair', change: ["ERCOT's next adequacy outlook, due on {nextEventDate}; the regulator's decision on next year's reserve quantities; or an executed toll.", '预计于{nextEventDate}发布的ERCOT下一期资源充裕度月报、监管机构对下一年度备用采购量的决定，或已签署的租赁。'] },
        controls: [['More batteries', '更多电池'], ['Reserve rules', '备用规则'], ['Toll terms', '租赁条款'], ['Load growth', '负荷增长'], ['Ownership check', '所有权检查'], ['Bankable case', '可融资方案'], ['Revenue', '收益拆解'], ['Execution', '执行步骤'], ['Downside', '下行风险']],
        claims: ['CL-ERCOT-07', 'CL-ERCOT-09', 'CL-ERCOT-10', 'CL-ERCOT-13', 'CL-ERCOT-14', 'CL-ERCOT-15'],
        labels: {
          next: ['Next public event', '下一个公开事件'],
          event: ['{nextEvent} · {nextEventDate}', '{nextEvent} · {nextEventDate}'],
          pending: ['Pending or future', '待定或未来'],
          drrs: ["New reliability reserve: storage's role unsettled", '新的可靠性备用：储能能否参与尚未确定'],
          quantities: ["Next year's reserve quantities: awaiting the regulator", '下一年度备用采购量：待监管机构决定'],
          queue: ['Load growth: a queue, not commitments', '负荷增长：排队申请，并非确定需求'],
          more: ['More batteries', '更多电池'],
        },
        extra: {
          factors: [
            { affects: ex('Affects reserve and energy income; see Downside', '影响备用和电能量收入；见下行风险') },
            { affects: ex('Affects reserve income: ERCOT sets quantities each year, and the market monitor argues they are too high; see Revenue', '影响备用收入：ERCOT每年确定采购量，市场监测机构认为采购量过高；见收益拆解') },
            { affects: ex('Affects secured revenue and its tenor; see Bankable case', '影响锁定收入及其期限；见可融资方案') },
            { affects: ex('Could raise prices if demand arrives; it is a queue today; see Revenue', '需求到来可能推高价格；目前仍只是排队；见收益拆解') },
            /* Analyst decision, 1 November 2026: a short ownership check here;
               detailed ownership and supply diligence belongs to the new-entrant lens. */
            { affects: ex('State law bars agreements giving certain foreign-owned companies access to or control of critical infrastructure; check owners, operator and suppliers; see Execution', '州法禁止与特定外国所有公司签订使其能够访问或控制关键基础设施的协议；须核查所有者、运营方和供应商；见执行步骤') },
          ],
          exits: [
            { label: ex('Bankable case', '可融资方案'), anchor: 'bankable' },
            { label: ex('Revenue', '收益拆解'), anchor: 'revenue' },
            { label: ex('Execution', '执行步骤'), anchor: 'execution' },
            { label: ex('Downside', '下行风险'), anchor: 'downside' },
          ],
        },
      },
    ] },
  ],
  tokens: [],
};

/* Token → field. R: the market row; I: row.investment; E: the fixed-vintage
   evidence records; B: HOME_BRIEFING; T: the local teaching configuration.
   `ui` formats use the market page's own helpers, passed through the pack. */
export const FIELD_BINDINGS = {
  call: { path: 'R.call', format: 'call' },
  play: { path: 'R.play', format: 'play' },
  cardFigures: { path: 'I.holdIRR', format: 'cardFigures' },
  nextAction: { path: 'R.play.action.text', format: 'pair' },
  /* ercot-00 prints the action mid-sentence: the same field without its full stop. */
  nextActionClause: { path: 'R.play.action.text', format: 'clause' },
  playDuration: { path: 'R.play.hours', format: 'text' },
  holdIrr: { path: 'I.holdIRR', format: 'return' },
  marginToTarget: { path: 'I.holdIRR', format: 'margin' },
  securedShare: { path: 'I.secured', format: 'share' },
  securedTenor: { path: 'I.securedYears', format: 'text' },
  nextEvent: { path: 'R.decision.event.label', format: 'pair' },
  nextEventDate: { path: 'R.decision.event.expected', format: 'date' },
  dcTieCapacity: { path: 'E.dcTies.totalTransferMW', format: 'mw' },
  offerCap: { path: 'E.offerCap.currentUSDPerMWh', format: 'usdPerMWh' },
  oldOfferCap: { path: 'E.offerCap.priorUSDPerMWh', format: 'usdPerMWh' },
  monthsToAgreement: { path: 'E.connection.meanRequestToAgreementMonths', format: 'months' },
  revenuePerKwChange: { path: 'E.revenuePerKW2025', format: 'qualifiedPct' },
  ordcHours: { path: 'E.ordc2025.activeHours', format: 'hours' },
  ordcAdder: { path: 'E.ordc2025', format: 'adderBound' },
  reserveDurationRules: { path: 'E.reserveRules', format: 'durationRules' },
  fleetAverageDuration: { path: 'E.fleetDuration2025.hours', format: 'hours' },
  teachingPower: { path: 'T.powerMW', format: 'text' },
};

/* Declared tokens: every token the copy uses, from the bindings. */
story.tokens = Object.keys(FIELD_BINDINGS);
