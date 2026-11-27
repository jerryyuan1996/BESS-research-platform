/* ---------------------------------------------------------------------------
   THE POLICY SHIFT behind each opportunity bell.

   The bell says that an event is coming and whose call it moves. This module
   says what is actually shifting, how it reaches the investment case, what each
   outcome would mean, how well evidenced the shift is, and what would change
   that reading. Written for the analyst's review and published with his
   approval; it restates the trigger records, their notes and the market views
   (view/markets/*.json, src/markets/decisionProfiles.js) in plain words.

   Rules for an entry, the same as the rest of the site's prose:
     - conclusion first; no model figure typed into the text (published
       schedule dates, caps and clearing prices are quoted from their source);
     - one evidence marker (strong, fair, thin) plus what would change it;
     - English and Simplified Chinese with the same meaning.

   Keyed by trigger id. A bell without an entry still gets the channel through
   which its watched dimensions reach the case (CHANNEL below).
   --------------------------------------------------------------------------- */

/** What kind of shift an entry is, for the bell's overview strip. */
export const SHIFT_TYPE = {
	award: ['Auctions & awards', '拍卖与中标'],
	rule: ['Market rules', '市场规则'],
	grid: ['Grid access & charges', '并网与网费'],
	grant: ['Grants', '补助'],
	outlook: ['Adequacy outlook', '充裕度展望'],
};

/** How a watched dimension reaches the investment case. */
export const CHANNEL = {
	assetReturn: ['the return the project earns on the same build cost', '同等建设成本下的项目回报'],
	revenueCertainty: ['how much revenue is secured, and the debt it can carry', '锁定收入的比例及其可支撑的债务'],
	capitalAtRisk: ['the capital at risk before revenue starts', '收入开始前承担的风险资本'],
	approvalTransparency: ['how predictable approvals are', '审批的可预期程度'],
	timeToRevenue: ['how long until the first revenue', '距首笔收入的时间'],
	gridScarcity: ['when and where a project can connect', '项目何时、何地能够并网'],
	foreignEntry: ['whether a foreign investor can own the project', '外国投资者能否持有项目'],
	supplyChainOrigin: ['which equipment qualifies', '哪些设备符合资格'],
	policyStability: ['how much of the case rests on rules that are still moving', '方案中仍取决于未定规则的部分'],
	demandGrowth: ['the scarcity that supports prices', '支撑价格的供需紧张程度'],
	saturation: ['how many batteries compete for the same revenue', '争夺同一收入的储能规模'],
	debtAvailability: ['what lenders will finance', '贷款方愿意融资的范围'],
	exitLiquidity: ['who will buy the asset later', '日后由谁接手资产'],
	scaleRepeatability: ['whether the case repeats at scale', '方案能否规模化复制'],
};

const LTDA_ROUND_4 = {
	type: 'award',
	evidence: 'strong',
	shift: [
		'Round 4 of the long-term decarbonisation auction closes bids on 26 January 2027. Lithium-ion batteries now compete inside a hard 400 MW cap, and projects using certified cells clear first.',
		'长期脱碳电源拍卖第四轮于2027年1月26日截止投标。锂离子电池须在40万kW的硬性上限内竞争，使用认定电芯的项目优先中标。',
	],
	channel: [
		'An award secures nearly all revenue for twenty years at a regulated return, so who wins decides which operating assets an investor can buy, and at what price.',
		'中标可在受监管回报下锁定二十年的绝大部分收入，因此中标结果决定投资者可以收购哪些在运资产、以何种价格收购。',
	],
	forStorage: [
		'More award holders with certified cells widen the pool of operating assets a fund can buy at a discount.',
		'使用认定电芯的中标项目越多，基金可以折价收购的在运资产就越多。',
	],
	against: [
		'The cap and the certified-cell priority hold awards down: fewer holders, fewer sellers and less pricing tension for a buyer.',
		'上限与认定电芯优先规则压低中标规模：持有方更少，卖方更少，买方的议价空间也更小。',
	],
	changeIt: [
		'OCCTO’s results, targeted about three months after bidding closes: awarded MW in this area and the clearing price.',
		'电力广域的运营推进机关预计在投标截止约三个月后公布的结果：本区域中标容量及出清价格。',
	],
};

export const POLICY_SHIFT = {
	'de-capacity-round-open-to-storage': {
		type: 'award',
		evidence: 'fair',
		shift: [
			'Germany adds a capacity round (StromVKG) to an energy-only market, and storage can enter it in May 2027 without a long-duration test. EU state-aid approval was reported on 2 September 2026.',
			'德国在纯电量市场之外引入容量招标（StromVKG），储能可在2027年5月参加且无需满足长时要求。欧盟国家援助批准已于2026年9月2日见诸报道。',
		],
		channel: [
			'A capacity award would add a secured line the four-hour case does not carry today, raising the contracted share and the debt it supports.',
			'容量中标将为当前不含容量收入的4小时方案增加一项锁定收入，提高合同收入占比及其可支撑的债务。',
		],
		forStorage: [
			'Storage clears at a workable de-rating: merchant and toll projects gain a secured layer, and a toll stops being the only way to secure revenue.',
			'储能以可行的折减系数中标：市场化及租赁项目都多出一层锁定收入，租赁不再是锁定收入的唯一途径。',
		],
		against: [
			'A deep de-rating or a clearing price set by gas plant leaves the case as priced today: merchant or toll, with no capacity revenue assumed.',
			'若折减幅度大，或出清价由燃气机组决定，方案维持现状：市场化或租赁，不计容量收入。',
		],
		changeIt: [
			'The round’s published de-rating for four-hour storage and the contract length on offer.',
			'招标公布的4小时储能折减系数及合同期限。',
		],
	},
	'ercot-february-2027-mora': {
		type: 'outlook',
		evidence: 'strong',
		shift: [
			'Not a rule change: ERCOT’s own read of winter scarcity. The February 2027 outlook shows how tight reserves are expected to be and how much battery capacity is counted.',
			'这不是规则变化，而是ERCOT对冬季稀缺程度的判断。2027年2月的充裕度月报将显示预期备用的紧张程度及计入的电池容量。',
		],
		channel: [
			'Scarcity drives the price spikes that pay merchant batteries and, through them, what an offtaker will pay for a toll.',
			'稀缺程度决定价格尖峰，尖峰支付市场化电池的收入，并进而影响承购方愿为租赁支付的价格。',
		],
		forStorage: [
			'A tight winter margin supports spike revenue and gives toll buyers a reason to contract.',
			'冬季裕度偏紧将支撑尖峰收入，并促使租赁买方签约。',
		],
		against: [
			'A comfortable margin with more batteries counted confirms the saturation already pulling revenue down; the Avoid call stands.',
			'若裕度充足且计入更多电池，则印证饱和正在压低收入；回避结论不变。',
		],
		changeIt: [
			'The reserve margin ERCOT reports for February 2027 and the battery capacity it counts.',
			'ERCOT公布的2027年2月备用裕度及计入的电池容量。',
		],
	},
	'fi-grid-priority-bill': {
		type: 'grid',
		evidence: 'thin',
		shift: [
			'Finland’s government is preparing rules on which grid connections come first, in response to the surge of data-centre connection requests. The bill was expected this autumn; its text is not yet public.',
			'芬兰政府正在制定并网优先顺序规则，以应对数据中心并网申请激增。该法案预计于今秋提出，文本尚未公开。',
		],
		channel: [
			'Connection order decides which storage sites can be built and when; the call already prefers sites outside the restricted south.',
			'并网顺序决定哪些储能场址能建、何时能建；当前结论已偏好受限南部以外的场址。',
		],
		forStorage: [
			'Priority for flexible connections, or for storage that relieves congestion, shortens the wait for a ready-to-build site.',
			'若灵活接入或可缓解拥塞的储能获得优先，具备开工条件的场址等待时间将缩短。',
		],
		against: [
			'Priority for large loads pushes storage back in the queue and adds months before first revenue, most of all in the south.',
			'若大型负荷优先，储能排位后移，首笔收入推迟数月，南部尤甚。',
		],
		changeIt: ['The bill as tabled: whether storage or flexible connections receive priority.', '正式提出的法案文本：储能或灵活接入是否获得优先。'],
	},
	'ie-ds3-long-stop': {
		type: 'rule',
		evidence: 'strong',
		shift: [
			'Ireland’s regulated DS3 system-services tariffs end at the 30 September 2027 long-stop. Their successor, competitive day-ahead procurement (DASSA, under FASS), has no go-live date since the TSOs withdrew May 2027 in June 2026.',
			'爱尔兰受监管的DS3系统服务费率于2027年9月30日最终截止。后继的日前竞争性采购（FASS框架下的DASSA）自输电运营商于2026年6月撤回2027年5月上线计划后，尚无上线日期。',
		],
		channel: [
			'The case already treats services income as uncontracted and declining; the shift decides whether that line has a market at all for a period.',
			'方案已将系统服务收入视为未锁定且递减；这一变化决定该收入在一段时间内是否还有市场。',
		],
		forStorage: [
			'DASSA goes live before the long-stop: services income continues, priced competitively rather than at legacy tariffs.',
			'DASSA在最终截止日前上线：系统服务收入延续，但按竞争价格而非旧费率计价。',
		],
		against: [
			'A gap between the long-stop and DASSA leaves fast-response services unpaid for months and leans the case harder on capacity and wholesale.',
			'若最终截止日与DASSA上线之间出现空档，快速响应服务将有数月无偿，方案更依赖容量与批发收入。',
		],
		changeIt: ['A firm DASSA go-live date, or a DS3 extension that bridges the gap.', '确定的DASSA上线日期，或填补空档的DS3延期安排。'],
	},
	'it-macse-second-auction': {
		type: 'award',
		evidence: 'strong',
		shift: [
			'Terna’s second MACSE auction (24 November 2026) ran under a lower cap of €27,000/MWh-year. The first cleared at 35% of its cap, won by projects of about 6.6–6.7 hours.',
			'Terna第二次MACSE拍卖（2026年11月24日）的上限降至每MWh每年€27,000。首次拍卖以上限的35%出清，中标项目时长约6.6–6.7小时。',
		],
		channel: [
			'MACSE pays per MWh-year of contracted storage for fifteen years, so the clearing price sets the secured revenue of every MACSE design and the value of a longer build.',
			'MACSE按签约储能电量每MWh每年付费十五年，因此出清价决定所有MACSE设计的锁定收入以及更长时长的价值。',
		],
		forStorage: [
			'A clear close to the first auction’s, despite the lower cap, keeps six- to seven-hour designs investable at a competitive marginal energy-block cost.',
			'尽管上限下调，若出清价接近首次拍卖，6至7小时设计在具竞争力的边际电池舱成本下仍可投资。',
		],
		against: [
			'A lower clear means MACSE pays only at energy-block costs well below today’s turnkey quotes; the capacity-market and toll routes carry the case.',
			'若出清价更低，MACSE仅在远低于当前交钥匙报价的电池舱成本下才划算，方案改由容量市场与租赁路径支撑。',
		],
		changeIt: ['Terna’s published clearing price and awarded durations by zone.', 'Terna公布的出清价格及各区域中标时长。'],
	},
	'jp-tokyo-ltda-round-4-bids': LTDA_ROUND_4,
	'jp-kyushu-ltda-round-4-bids': LTDA_ROUND_4,
	'jp-hokkaido-ltda-round-4-bids': LTDA_ROUND_4,
	'nem-exemption-guide-draft': {
		type: 'rule',
		evidence: 'fair',
		shift: [
			'AEMO is redrafting its guide to registration exemptions. The draft due on 18 December proposes the size below which a battery need not register as a market participant.',
			'AEMO正在修订注册豁免指南。预计12月18日发布的草案将提出电池无需注册为市场参与者的规模门槛。',
		],
		channel: [
			'The threshold decides whether a small battery can run on the lighter distribution route or must carry the fixed costs of full registration.',
			'该门槛决定小型电池能否走较轻的配网路径，还是必须承担完整注册的固定成本。',
		],
		forStorage: ['A higher threshold lets more small projects use the lighter route.', '门槛提高，更多小型项目可走较轻路径。'],
		against: [
			'A lower threshold pulls small batteries into full registration and erodes the small-project case.',
			'门槛降低，小型电池须完整注册，小型项目方案随之削弱。',
		],
		changeIt: ['The battery threshold in the draft, then in the final guide.', '草案及最终指南中的电池门槛。'],
	},
	'nem-storage-tariffs-fy28': {
		type: 'grid',
		evidence: 'strong',
		shift: [
			'Distributors’ FY2027–28 price lists take effect on 1 July 2027, including the storage tariffs that charge or credit a battery by time window.',
			'配网商2027–28财年价表于2027年7月1日生效，其中包括按时段向电池收费或给予抵扣的储能费率。',
		],
		channel: [
			'Network charges and credits sit inside a small battery’s margin; their windows decide when charging is cheap and export is paid.',
			'网费与抵扣直接计入小型电池的利润；其时段决定何时充电便宜、何时放电有收益。',
		],
		forStorage: [
			'Wider credit windows or lower charging tariffs lift the network line of a distribution-connected battery.',
			'抵扣时段更宽或充电费率更低，将提升配网接入电池的网费收益。',
		],
		against: [
			'Higher demand charges or narrower export credits cut that line and can push a marginal small project below its yield.',
			'需量电费提高或放电抵扣收窄将削减该收益，并可能使边际小型项目低于收益要求。',
		],
		changeIt: ['The approved price lists at the six reference distributors.', '六家样本配网商获批的价表。'],
	},
	'pjm-backstop-filing-suspension-ends': {
		type: 'rule',
		evidence: 'fair',
		shift: [
			'PJM’s Reliability Backstop Procurement would add a long-term route for new capacity beside the one-year auction. FERC suspended the filing to 28 February 2027, the requested effective date for most amendments.',
			'PJM的可靠性兜底采购将在一年期拍卖之外增加新增容量的长期路径。FERC将该申请中止至2027年2月28日，即多数修订申请的生效日。',
		],
		channel: [
			'A long-term backstop award would turn one-year capacity revenue into a secured term, which is what the reference project lacks.',
			'长期兜底中标可将一年期容量收入变为锁定期限，而这正是参考项目所欠缺的。',
		],
		forStorage: [
			'FERC accepts the filing with storage eligible: a long-term path exists and the Wait call can move to pricing a project.',
			'FERC批准且储能具备资格：长期路径成立，观望结论可转向对具体项目定价。',
		],
		against: [
			'Rejection or further delay leaves the annual auction, one year at a time, and points to a scoped Pass.',
			'若被驳回或继续推迟，只剩逐年拍卖，结论将指向限定范围的放弃。',
		],
		changeIt: ['FERC’s order on the filing and the rules on storage eligibility.', 'FERC对该申请的裁定及储能资格规则。'],
	},
	'pjm-capacity-auction-2029-30': {
		type: 'award',
		evidence: 'strong',
		shift: [
			'The December 2026 auction for 2029/30 runs under a cap of $337.83/MW-day, after the 2028/29 auction cleared at its cap and fell 6,831 MW short.',
			'2026年12月的2029/30年度拍卖上限为每MW每日337.83美元；此前2028/29年度拍卖以上限出清，缺口6,831MW。',
		],
		channel: [
			'The clearing price is the capacity line of the case for one delivery year; it secures nothing beyond it.',
			'出清价是方案中一个交付年度的容量收入，对之后的年份不提供锁定。',
		],
		forStorage: [
			'Another clear at the cap confirms scarcity and supports pricing a four-hour project, still one year at a time.',
			'若再次以上限出清，稀缺性得到确认，可支撑4小时项目定价，但仍是逐年锁定。',
		],
		against: [
			'A clear below the cap, or with lower storage accreditation, shrinks the capacity line that carries the case.',
			'若出清低于上限，或储能认证系数下降，支撑方案的容量收入将缩小。',
		],
		changeIt: ['The 2029/30 clearing price and the shortfall against the reliability requirement.', '2029/30年度出清价及相对可靠性需求的缺口。'],
	},
	'pjm-elcc-2030-31-rating': {
		type: 'rule',
		evidence: 'strong',
		shift: [
			'PJM posts the 2030/31 ELCC class ratings on 11 January 2027: the share of a four-hour battery’s MW that counts as capacity.',
			'PJM将于2027年1月11日公布2030/31年度ELCC分类评级，即4小时电池容量中可计为容量的比例。',
		],
		channel: [
			'Accreditation multiplies the capacity price: each point of ELCC lost is capacity revenue lost on the same MW.',
			'认证系数与容量价格相乘：ELCC每下降一个百分点，同等容量的容量收入随之减少。',
		],
		forStorage: [
			'A stable or higher four-hour rating protects the capacity line as more storage joins.',
			'4小时评级持平或上升，可在储能增多时保住容量收入。',
		],
		against: [
			'A lower rating erodes capacity revenue for every year it applies and favours longer durations.',
			'评级下调将在其适用的每一年削减容量收入，并使更长时长更具优势。',
		],
		changeIt: ['The posted four-hour storage rating against the 2029/30 rating.', '公布的4小时储能评级与2029/30年度评级的对比。'],
	},
	'pjm-rbp-participation-review': {
		type: 'rule',
		evidence: 'fair',
		shift: [
			'Not a market event: the analyst’s checkpoint on whether the Reliability Backstop gives this case an executable way in.',
			'这不是市场事件，而是分析师的检查点：可靠性兜底采购是否为本方案提供可执行的参与路径。',
		],
		channel: [
			'A verified path would make a long-term secured term available to the reference project.',
			'若路径得到核实，参考项目将可获得长期锁定的收入期限。',
		],
		forStorage: [
			'Rules, eligibility and an executable participation path are verified: the analyst can approve following the proposed May results.',
			'规则、资格及可执行的参与路径得到核实：分析师可批准继续跟进5月的拟议结果。',
		],
		against: [
			'No actionable path by 31 March: the fund, strategic and new-entrant calls move to a scoped Pass.',
			'若3月31日前仍无可行路径：基金、战略及新进入者结论转为限定范围的放弃。',
		],
		changeIt: ['FERC’s order and PJM’s published participation rules.', 'FERC的裁定及PJM公布的参与规则。'],
	},
	'pjm-rbp-proposed-results': {
		type: 'award',
		evidence: 'thin',
		shift: [
			'PJM’s proposed schedule puts the first backstop results in May 2027; the date is not confirmed and no target award or price is known.',
			'PJM的拟议时间表将首批兜底采购结果定于2027年5月；日期尚未确认，亦无已知的目标中标或价格。',
		],
		channel: [
			'The results would show the price and term a long-term storage award actually carries.',
			'结果将显示长期储能中标的实际价格与期限。',
		],
		forStorage: [
			'Storage wins at a workable price and term: the first evidence for a secured PJM case.',
			'储能以可行的价格与期限中标：首次为PJM锁定收入方案提供证据。',
		],
		against: [
			'Few or no storage awards, or a slipped schedule, leaves the case on the annual auction.',
			'若储能中标寥寥或时间表推迟，方案仍只能依赖年度拍卖。',
		],
		changeIt: ['A confirmed results date, then the awarded MW, term and price.', '确认的结果发布日期，以及中标容量、期限与价格。'],
	},
	'pl-grant-project-terms-review': {
		type: 'grant',
		evidence: 'thin',
		shift: [
			'Poland’s 2025 storage grant cohort is the one route with support while the capacity framework is unsettled. This checkpoint tests whether a grant-holding project with executable terms exists.',
			'在容量机制未定之际，波兰2025年储能补助批次是唯一获得支持的路径。本检查点核实是否存在持有补助且条款可执行的项目。',
		],
		channel: [
			'A capital grant lowers the equity at risk; without one, an uncontracted project loses value at the platform’s yields.',
			'资本补助可降低股权风险资本；若无补助，未签约项目在平台收益率下将损失价值。',
		],
		forStorage: [
			'A target project with evidenced grant, payment and transfer terms keeps the grant play open for pricing.',
			'若目标项目的补助、付款及转让条款均有证据，补助路径可继续定价。',
		],
		against: [
			'No identifiable target with executable terms by 31 January: the grant route moves to a scoped Pass.',
			'若1月31日前仍无条款可执行的明确目标：补助路径转为限定范围的放弃。',
		],
		changeIt: [
			'Grant award and payment evidence for a named project, and any deduction from capacity payments.',
			'具名项目的补助授予及付款证据，以及是否从容量付费中扣减。',
		],
	},
	'ro-grant-status-review': {
		type: 'grant',
		evidence: 'thin',
		shift: [
			'Romania’s Modernisation Fund call for stand-alone batteries is the capital grant the Romanian case assumes. Its 30 October closing and a reported extension still need an accessible official amendment.',
			'罗马尼亚现代化基金针对独立电池储能的申请是罗马尼亚方案所假设的资本补助。其10月30日截止日及据报的延期仍需可查阅的官方修订确认。',
		],
		channel: [
			'The grant cuts the capex the two-hour merchant case must recover from spreads; no revenue floor is priced yet.',
			'补助降低2小时市场化方案需从价差中回收的资本开支；目前尚未计入收入保底。',
		],
		forStorage: [
			'An official extension or award list that includes the target project confirms the grant and keeps the merchant case at its current value.',
			'若官方延期或中标名单包含目标项目，补助得到确认，市场化方案维持现有价值。',
		],
		against: [
			'No grant for the target leaves a no-grant valuation on merchant spreads alone, while the home fleet doubles.',
			'若目标项目未获补助，估值只能依赖市场化价差，而本国储能规模正在翻倍。',
		],
		changeIt: ['The ministry’s published amendment or award list, and the grant’s payment terms.', '部委公布的修订或中标名单，以及补助的付款条款。'],
	},
	'wa-2027-cycle-access-quantities': {
		type: 'award',
		evidence: 'strong',
		shift: [
			'AEMO assigns Capacity Credits and notifies Network Access Quantities for the 2027 Reserve Capacity cycle.',
			'AEMO为2027年备用容量周期分配容量信用并通知网络接入量。',
		],
		channel: [
			'Credits and access quantities fix how many MW are paid the benchmark capacity price, and capacity carries most of year-one revenue.',
			'容量信用与接入量决定多少MW可按基准容量价获得付费，而容量收入占首年收入的大部分。',
		],
		forStorage: [
			'Full credits and access for the target project make the secured revenue certain: the fund’s condition to enter.',
			'目标项目获得全额信用与接入量，锁定收入随之确定，这正是基金进入的条件。',
		],
		against: [
			'Reduced access because of network constraints cuts the paid MW until reinforcement arrives.',
			'若因网络约束而削减接入量，在电网增容前可获付费的容量将减少。',
		],
		changeIt: ['The credited MW and access quantity AEMO notifies for the target project.', 'AEMO为目标项目通知的信用容量与接入量。'],
	},
	'wa-access-arrangement-2027': {
		type: 'grid',
		evidence: 'fair',
		shift: [
			'Western Power’s next access arrangement replaces AA5 on 1 July 2027, with a revised policy on what connecting customers contribute to network works.',
			'Western Power的下一期接入安排将于2027年7月1日取代AA5，并修订接入用户须分担的电网工程费用政策。',
		],
		channel: [
			'Capital contributions and network tariffs sit in the capital at risk before the first Capacity Credit is paid.',
			'资本分摊与网费计入首笔容量信用付费前的风险资本。',
		],
		forStorage: [
			'Lower or shared contributions for works that also serve other users reduce the capital at risk.',
			'若惠及其他用户的工程分摊降低或共同承担，风险资本随之减少。',
		],
		against: ['Higher contributions raise capex before any capacity revenue.', '分摊提高将在获得容量收入前推高资本开支。'],
		changeIt: [
			'The regulator’s final decision on the access arrangement and its contributions policy.',
			'监管机构对接入安排及费用分摊政策的最终决定。',
		],
	},
	'wa-benchmark-price-2029-30': {
		type: 'award',
		evidence: 'strong',
		shift: [
			'The regulator sets the benchmark reserve capacity price for 2029–30. The 2028–29 final was A$488,500/MW (13 March 2026).',
			'监管机构将确定2029–30年度基准备用容量价格。2028–29年度最终裁定为每MW A$488,500（2026年3月13日）。',
		],
		channel: [
			'The benchmark sets the capacity price that carries most of year-one revenue.',
			'基准价决定占首年收入大部分的容量价格。',
		],
		forStorage: ['A benchmark at or above the current level holds the capacity line.', '基准价持平或上升，容量收入得以维持。'],
		against: [
			'A lower benchmark, for example after a cheaper reference plant, cuts the capacity line directly.',
			'若基准价下降（例如参考机组成本更低），容量收入将直接减少。',
		],
		changeIt: ['The regulator’s draft and final 2029–30 determination.', '监管机构2029–30年度的草案及最终裁定。'],
	},
	'wa-benchmark-technology-review': {
		type: 'rule',
		evidence: 'fair',
		shift: [
			'The regulator is reviewing the reference plant whose cost sets the benchmark capacity price. The review date has passed; its outcome is still to confirm.',
			'监管机构正在审查用于确定基准容量价格的参考机组。审查日期已过，结果仍待确认。',
		],
		channel: [
			'Changing the reference plant resets the benchmark price for every later cycle.',
			'更换参考机组将重设此后各周期的基准价格。',
		],
		forStorage: [
			'A reference plant that costs as much or more holds the benchmark, and with it the capacity line.',
			'若参考机组成本持平或更高，基准价及容量收入得以维持。',
		],
		against: [
			'A cheaper reference plant lowers the benchmark from the next determination onward.',
			'若参考机组更便宜，基准价将自下一次裁定起下降。',
		],
		changeIt: ['The review’s final report and the reference plant it chooses.', '审查的最终报告及其选定的参考机组。'],
	},
};

export const EVIDENCE_LABEL = { strong: ['Strong', '充分'], fair: ['Fair', '尚可'], thin: ['Thin', '单薄'] };

/** The analysis for a trigger, or null when none is written. */
export const policyShiftFor = (triggerId) => POLICY_SHIFT[triggerId] || null;
