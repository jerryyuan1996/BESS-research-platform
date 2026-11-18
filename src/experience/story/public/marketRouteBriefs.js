// What the battery does on each revenue route, and who pays, uses and finally
// bears the cost. Mechanism descriptions only: no price, award or result is
// stated here. Italy keeps its own entries in logicChapterContent.js.
const u = (title, body) => ({ title, body });
const p = (role, who, note) => ({ role, who, note });

const COUNTERPARTY = ['Contract counterparty', '合同对手方'];
const SETTLES = ['Who settles', '结算方'];
const USES = ['Who uses it', '使用方'];
const BEARS = ['Who bears the cost', '成本承担方'];
const BUYERS = ['Who buys the energy', '电量买方'];
const NO_PAYER = p(
	['Contract payer', '合同付款方'],
	['None', '无'],
	['Income exists only when a trade or an offer is executed.', '只有交易或报价成交，才有收入。'],
);
const GRANT_USER = p(
	USES,
	['No offtaker', '无购买方'],
	[
		'The grant funds the build only; operating income still needs a market or a contract.',
		'补贴只资助建设；运营收入仍须来自市场或合同。',
	],
);

const toll = (who, markets) => ({
	uses: [
		u(
			['Fixed fee for control', '以固定费用让渡调度权'],
			[
				'The owner hands dispatch of the contracted capability to the toller for a fixed fee over the term.',
				'业主在合同期内把签约能力的调度权交给承租方，换取固定费用。',
			],
		),
		u(['Toller trades the asset', '承租方经营资产'], markets),
		u(
			['Financeable income', '可融资的收入'],
			[
				'A fixed fee from a creditworthy counterparty can support debt that merchant income cannot.',
				'来自信用良好对手方的固定费用，可以支撑市场化收入无法支撑的债务。',
			],
		),
	],
	parties: [
		p(COUNTERPARTY, who, [
			'Pays the fixed fee and takes the market risk for the term.',
			'支付固定费用，并在合同期内承担市场风险。',
		]),
		p(
			USES,
			['The toller', '承租方'],
			['Schedules the battery within the agreed cycle and availability limits.', '在约定的循环与可用率范围内安排电池运行。'],
		),
		p(
			BEARS,
			['The toller, then the owner after expiry', '承租方；到期后转为业主'],
			[
				'The owner carries availability deductions now and merchant exposure once the toll ends.',
				'业主现阶段承担可用率扣款，租赁到期后承担市场风险。',
			],
		),
	],
});

const floor = (markets) => ({
	uses: [
		u(
			['Minimum revenue', '最低收入'],
			[
				'The optimiser promises a minimum annual revenue in return for the right to trade the battery.',
				'优化商承诺最低年度收入，换取电池的交易权。',
			],
		),
		u(['Optimiser trades the asset', '优化商经营资产'], markets),
		u(
			['Shared upside', '超额分成'],
			[
				'Revenue above the floor is split under the agreed formula; the floor is not added on top of trading.',
				'超过保底的收入按约定公式分成；保底不能另外加在交易收入之上。',
			],
		),
	],
	parties: [
		p(
			COUNTERPARTY,
			['The contracted optimiser', '签约优化商'],
			[
				'Settles the floor and the sharing formula; its credit stands behind the floor.',
				'结算保底与分成；保底的可靠性取决于其信用。',
			],
		),
		p(
			USES,
			['The optimiser, in public markets', '优化商（在公共市场中）'],
			[
				'The underlying cash still comes from the market operator and system operator.',
				'底层现金仍来自市场运营机构和系统运营商。',
			],
		),
		p(
			BEARS,
			['The optimiser, for any shortfall', '优化商（承担差额）'],
			['If markets pay less than the floor, the optimiser makes up the difference.', '市场收入低于保底时，由优化商补足差额。'],
		),
	],
});

const SHARED_JP = {
	ltda: {
		uses: [
			u(
				['Fixed capacity income', '固定容量收入'],
				[
					'The award pays a fixed annual capacity amount over a long term, sized to recover the build and fixed costs.',
					'中标后长期获得固定年度容量款，用于回收建设与固定成本。',
				],
			),
			u(
				['Supply in tight hours', '供需紧张时段供电'],
				['The battery must be available and discharge when the area needs supply.', '区域需要供电时，电池须保持可用并放电。'],
			),
			u(
				['Other markets, mostly returned', '其他市场收益大部分返还'],
				[
					'The asset may trade in other markets, but most of that profit is returned under the award rules.',
					'资产可参与其他市场，但大部分利润须按中标规则返还。',
				],
			),
		],
		parties: [
			p(
				COUNTERPARTY,
				['OCCTO', 'OCCTO 电力广域运营推进机构'],
				['Runs the auction and pays the contracted capacity amount.', '组织拍卖并支付合同容量款。'],
			),
			p(
				USES,
				['The national power system', '全国电力系统'],
				[
					'Capacity is held for supply adequacy and decarbonisation, not sold to one buyer.',
					'容量用于保障供应充裕与脱碳，不出售给单一买方。',
				],
			),
			p(
				BEARS,
				['Retail suppliers, then consumers', '售电企业，最终为用户'],
				[
					'Retail suppliers and transmission operators pay contributions to OCCTO and pass them on in tariffs.',
					'售电企业与输配电企业向 OCCTO 缴纳分摊款，并计入电价。',
				],
			),
		],
	},
	merchant: {
		uses: [
			u(
				['JEPX spot and intraday', 'JEPX 现货与日内交易'],
				[
					'Charge in low-price half-hours, often solar hours, and sell into the evening at the area price.',
					'在低价半小时时段（常为光伏时段）充电，傍晚按区域价格售电。',
				],
			),
			u(
				['Balancing market', '供需调整市场'],
				[
					'Offer primary to tertiary reserve products to the area transmission operator.',
					'向区域输配电企业提供一次至三次调整力产品。',
				],
			),
		],
		parties: [
			p(
				BUYERS,
				['JEPX, then retail suppliers', 'JEPX，背后为售电企业'],
				[
					'The exchange clears trades; retail suppliers buy the energy for their customers.',
					'交易所清算成交；售电企业为其用户购电。',
				],
			),
			p(
				['Balancing services', '调整力服务'],
				['The area transmission and distribution operator', '区域输配电企业'],
				[
					'Buys reserve for system security and recovers it through network tariffs.',
					'为系统安全采购调整力，并通过输配电费回收。',
				],
			),
			NO_PAYER,
		],
	},
};

export const ROUTE_BRIEFS = {
	wa: {
		capacity: {
			uses: [
				u(
					['Evening peak reliability', '晚高峰可靠性'],
					[
						'Certified capacity must be available in the peak intervals when the south-west grid is tightest.',
						'经认证的容量须在西南电网最紧张的高峰时段保持可用。',
					],
				),
				u(
					['Duration-based credits', '按时长认定信用'],
					['Storage earns credits according to how long it can sustain output.', '储能按持续放电时长获得容量信用。'],
				),
				u(
					['Energy and services alongside', '同时参与电量与服务'],
					[
						'Capacity duties set the minimum energy held back; the rest can trade.',
						'容量义务决定须预留的最低电量，其余可参与交易。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['AEMO', 'AEMO'],
					['Certifies capacity, assigns credits and settles capacity payments.', '认证容量、分配信用并结算容量款。'],
				),
				p(
					USES,
					['The south-west power system', '西南电力系统'],
					[
						'AEMO sets the reserve requirement; no single buyer takes the capacity.',
						'由 AEMO 设定储备要求；容量不出售给单一买方。',
					],
				),
				p(
					BEARS,
					['Retailers, then consumers', '售电商，最终为用户'],
					[
						'Market customers pay by their share of peak demand and pass it on in bills.',
						'市场用户按其高峰负荷份额付费，并转入电费。',
					],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Shift rooftop solar to the evening', '把屋顶光伏转到傍晚'],
					[
						'Charge in the midday solar surplus and discharge into the evening peak in the real-time market.',
						'在午间光伏富余时充电，在实时市场的晚高峰放电。',
					],
				),
				u(
					['Five-minute price moves', '五分钟价格波动'],
					['Respond to short price spikes when supply tightens.', '在供应趋紧时捕捉短时价格尖峰。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['AEMO, as market operator', 'AEMO（市场运营机构）'],
					['Settles energy sold and bought in the real-time market.', '结算实时市场的售电与购电。'],
				),
				p(
					BUYERS,
					['Retailers and large customers', '售电商与大用户'],
					['They buy the energy for their customers.', '为其用户购买电量。'],
				),
				NO_PAYER,
			],
		},
		services: {
			uses: [
				u(['Frequency regulation', '频率调节'], ['Continuously correct small frequency deviations.', '持续纠正小幅频率偏差。']),
				u(
					['Contingency reserve', '事故备用'],
					['Respond within seconds if a large generator or load trips.', '大型机组或负荷跳闸时在数秒内响应。'],
				),
				u(
					['Rate-of-change control', '频率变化率控制'],
					['Fast injection that slows how quickly frequency falls.', '快速注入功率，减缓频率下降速度。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['AEMO', 'AEMO'],
					['Procures each service with energy dispatch and settles it.', '与电量调度联合采购各项服务并结算。'],
				),
				p(
					USES,
					['The south-west power system', '西南电力系统'],
					['Services keep the isolated grid secure.', '各项服务保障这一孤立电网的安全。'],
				),
				p(
					BEARS,
					['Market participants, then consumers', '市场主体，最终为用户'],
					[
						'Costs are allocated to generators and market customers under the market rules.',
						'成本按市场规则分摊给发电方和市场用户。',
					],
				),
			],
		},
	},
	nem: {
		merchant: {
			uses: [
				u(
					['Daily solar spread', '日内光伏价差'],
					[
						'Charge in low or negative midday prices and sell into the evening peak.',
						'在午间低价或负电价时充电，在晚高峰售电。',
					],
				),
				u(
					['Price spikes', '价格尖峰'],
					['Five-minute settlement pays fast assets for short scarcity intervals.', '五分钟结算让快速资产在短时稀缺时段获益。'],
				),
				u(
					['Hedge contracts', '对冲合约'],
					['Retailers may buy cap contracts that a battery can back.', '售电商可能购买电池能够支撑的封顶合约。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['AEMO, as pool operator', 'AEMO（电力池运营机构）'],
					[
						'All energy is sold into the regional pool and settled at the regional price.',
						'所有电量售入区域电力池，按区域价格结算。',
					],
				),
				p(
					BUYERS,
					['Retailers and large customers', '售电商与大用户'],
					['They buy from the pool and often hedge with contracts.', '从电力池购电，并常以合约对冲。'],
				),
				NO_PAYER,
			],
		},
		fcas: {
			uses: [
				u(
					['Regulation FCAS', '调节类 FCAS'],
					['Follow AEMO signals to correct frequency continuously.', '按 AEMO 信号持续校正频率。'],
				),
				u(
					['Contingency FCAS', '事故类 FCAS'],
					['Raise or lower output within one second to minutes after a large trip.', '大型跳闸后在一秒到数分钟内升降出力。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['AEMO', 'AEMO'],
					['Enables FCAS with energy every five minutes and settles it.', '每五分钟与电量联合启用 FCAS 并结算。'],
				),
				p(
					USES,
					['The national electricity system', '国家电力系统'],
					['FCAS holds frequency within the standard.', 'FCAS 将频率维持在标准范围内。'],
				),
				p(
					BEARS,
					['Generators and market customers', '发电方与市场用户'],
					[
						'Costs are allocated under AEMO’s rules and reach consumers through bills.',
						'成本按 AEMO 规则分摊，并经电费传导给用户。',
					],
				),
			],
		},
		cis: {
			uses: [
				u(
					['Revenue collar', '收入区间'],
					[
						'If market revenue falls below the agreed floor, the government tops it up; above the ceiling, revenue is shared back.',
						'市场收入低于约定下限时由政府补足；高于上限时须分成返还。',
					],
				),
				u(
					['New dispatchable capacity', '新增可调度容量'],
					['The scheme exists to bring firm capacity into the market as coal retires.', '该机制旨在煤电退出时引入可靠容量。'],
				),
				u(
					['Normal market operation', '照常参与市场'],
					[
						'The project still trades energy and FCAS; support only adjusts net revenue.',
						'项目仍参与电量和 FCAS 交易；支持款只调整净收入。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['Australian Government', '澳大利亚政府'],
					['Signs the agreement after a competitive tender and settles the collar.', '经竞争性招标后签约，并结算收入区间。'],
				),
				p(
					USES,
					['The national electricity market', '国家电力市场'],
					['Energy and services still go to the market, not to the government.', '电量和服务仍进入市场，而不是交给政府。'],
				),
				p(
					BEARS,
					['Taxpayers', '纳税人'],
					[
						'Top-up payments come from the federal budget; shared upside returns to it.',
						'补足款来自联邦预算；超额分成也返还预算。',
					],
				),
			],
		},
	},
	gb: {
		services: {
			uses: [
				u(
					['Dynamic frequency response', '动态频率响应'],
					[
						'Hold power ready to respond automatically to frequency in day-ahead auctions.',
						'在日前拍卖中中标，预留功率自动响应频率。',
					],
				),
				u(
					['Balancing Mechanism', '平衡机制'],
					[
						'Submit bids and offers that NESO can accept to balance the system in real time.',
						'提交报价，供 NESO 实时接受以平衡系统。',
					],
				),
				u(['Reserve', '备用'], ['Stand ready to change output within minutes when instructed.', '按指令在数分钟内调整出力。']),
			],
			parties: [
				p(
					COUNTERPARTY,
					['NESO', 'NESO 国家能源系统运营商'],
					['Procures response and reserve and accepts Balancing Mechanism actions.', '采购响应与备用，并接受平衡机制调用。'],
				),
				p(
					SETTLES,
					['Elexon', 'Elexon'],
					['Settles Balancing Mechanism actions and imbalance.', '结算平衡机制调用与不平衡电量。'],
				),
				p(
					BEARS,
					['Suppliers, then consumers', '售电商，最终为用户'],
					['Costs are recovered through balancing charges on demand.', '成本通过向用电侧收取的平衡费用回收。'],
				),
			],
		},
		capacity: {
			uses: [
				u(
					['System stress events', '系统紧张事件'],
					['Deliver de-rated capacity when a stress event is called.', '发布紧张事件时，交付折减后的容量。'],
				),
				u(
					['Long agreements for new build', '新建项目的长期协议'],
					[
						'Auctions four years and one year ahead; new build can win multi-year agreements.',
						'提前四年和一年拍卖；新建项目可获得多年期协议。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['Electricity Settlements Company', '电力结算公司'],
					['Pays capacity awards; NESO runs the auctions.', '支付容量中标款；拍卖由 NESO 组织。'],
				),
				p(
					USES,
					['The GB power system', '英国电力系统'],
					['Capacity is held for security of supply.', '容量用于保障供应安全。'],
				),
				p(
					BEARS,
					['Suppliers, then consumers', '售电商，最终为用户'],
					[
						'Suppliers pay a levy by their share of peak demand and pass it on in bills.',
						'售电商按高峰负荷份额缴费，并计入电费。',
					],
				),
			],
		},
		toll: toll(
			['A utility, trader or optimiser', '电力公司、交易商或优化商'],
			[
				'The toller earns from wholesale trading, the Balancing Mechanism and response.',
				'承租方通过批发交易、平衡机制与响应服务获利。',
			],
		),
	},
	de: {
		merchant: {
			uses: [
				u(
					['Day-ahead and intraday', '日前与日内交易'],
					[
						'Charge in solar and wind surplus hours and sell when prices rise, in auctions and continuous trading.',
						'在光伏和风电富余时充电，价格上升时通过拍卖和连续交易售电。',
					],
				),
				u(
					['Intraday forecast errors', '日内预测偏差'],
					['Trade the late changes in renewable forecasts.', '交易可再生能源预测的临时变化。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['The power exchange’s clearing house', '电力交易所清算机构'],
					[
						'Clears exchange trades; bilateral trades settle with each counterparty.',
						'清算交易所成交；双边交易与各对手方结算。',
					],
				),
				p(
					BUYERS,
					['Suppliers, traders and large consumers', '售电商、交易商与大用户'],
					['They buy the energy for their portfolios and customers.', '为其组合与用户购电。'],
				),
				NO_PAYER,
			],
		},
		balancing: {
			uses: [
				u(
					['Frequency containment reserve', '频率控制备用 FCR'],
					['Respond automatically to frequency within seconds.', '在数秒内自动响应频率。'],
				),
				u(
					['Automatic and manual restoration', '自动与手动恢复备用'],
					[
						'aFRR and mFRR restore frequency after an imbalance, paid for capacity and for energy.',
						'aFRR 与 mFRR 在不平衡后恢复频率，按容量和电量付费。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['The four German TSOs', '德国四家输电运营商'],
					['Procure reserves jointly through common tenders.', '通过统一招标联合采购备用。'],
				),
				p(USES, ['The German and European grid', '德国及欧洲电网'], ['Reserves keep frequency stable.', '备用保障频率稳定。']),
				p(
					BEARS,
					['Consumers and balance groups', '用户与平衡责任方'],
					[
						'Capacity costs go into network charges; energy costs fall on balance groups through imbalance prices.',
						'容量成本计入电网费；电量成本通过不平衡价格由平衡责任方承担。',
					],
				),
			],
		},
		toll: toll(
			['A utility, trader or optimiser', '电力公司、交易商或优化商'],
			['The toller earns from wholesale trading and balancing reserves.', '承租方通过批发交易与平衡备用获利。'],
		),
	},
	fi: {
		reserves: {
			uses: [
				u(
					['FCR-N and FCR-D', 'FCR-N 与 FCR-D'],
					[
						'Hold power for normal frequency control and for disturbances, paid per MW per hour.',
						'为正常频率控制与扰动响应预留功率，按每小时每 MW 付费。',
					],
				),
				u(
					['aFRR, mFRR and FFR', 'aFRR、mFRR 与 FFR'],
					[
						'Restore frequency after an imbalance, or inject fast power when inertia is low.',
						'在不平衡后恢复频率，或在惯量低时快速注入功率。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['Fingrid', 'Fingrid'],
					['Procures reserves in its reserve markets and settles them.', '在其备用市场采购备用并结算。'],
				),
				p(
					USES,
					['The Nordic power system', '北欧电力系统'],
					['Reserves keep the shared frequency stable.', '备用保障共同频率稳定。'],
				),
				p(
					BEARS,
					['Grid users, then consumers', '电网用户，最终为用户'],
					[
						'Fingrid recovers reserve costs through grid fees and balancing charges.',
						'Fingrid 通过电网费与平衡费用回收备用成本。',
					],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Wind-driven spreads', '风电带来的价差'],
					['Charge when wind pushes prices down and sell when it drops.', '风电压低电价时充电，风电回落时售电。'],
				),
				u(
					['Day-ahead and intraday', '日前与日内交易'],
					['Trade in the Nordic exchange auctions and continuous market.', '参与北欧交易所的拍卖与连续交易。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['The power exchange', '电力交易所'],
					['Clears trades in the Finnish bidding zone.', '清算芬兰报价区的交易。'],
				),
				p(
					BUYERS,
					['Suppliers and large consumers', '售电商与大用户'],
					['They buy the energy for their customers.', '为其用户购电。'],
				),
				NO_PAYER,
			],
		},
		floor: floor([
			'The optimiser runs the battery in Fingrid reserves and energy markets.',
			'优化商安排电池参与 Fingrid 备用与电能量市场。',
		]),
	},
	ie: {
		capacity: {
			uses: [
				u(
					['All-island adequacy', '全岛供应充裕'],
					['Awarded capacity must be available in tight hours on the island.', '中标容量须在全岛供需紧张时段保持可用。'],
				),
				u(
					['Reliability option', '可靠性期权'],
					[
						'When the market price exceeds the strike price, the holder pays back the difference.',
						'市场价格高于执行价时，持有方须返还差额。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['SEMO', 'SEMO 单一电力市场运营机构'],
					['Settles capacity payments; EirGrid and SONI run the auctions.', '结算容量款；拍卖由 EirGrid 与 SONI 组织。'],
				),
				p(
					USES,
					['The all-island power system', '全岛电力系统'],
					['Capacity is held for security of supply.', '容量用于保障供应安全。'],
				),
				p(
					BEARS,
					['Suppliers, then consumers', '售电商，最终为用户'],
					[
						'Suppliers pay capacity charges, net of difference payments, and pass them on in bills.',
						'售电商支付扣除差额返还后的容量费，并计入电费。',
					],
				),
			],
		},
		services: {
			uses: [
				u(
					['Fast frequency response', '快速频率响应'],
					['Inject power within seconds to support a grid with high wind output.', '在数秒内注入功率，支撑高风电出力的电网。'],
				),
				u(
					['Operating reserves', '运行备用'],
					[
						'Provide primary to tertiary reserve under the current and future procurement.',
						'按现行及未来采购安排提供一次至三次备用。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['EirGrid and SONI', 'EirGrid 与 SONI'],
					['Procure system services for Ireland and Northern Ireland.', '为爱尔兰与北爱尔兰采购系统服务。'],
				),
				p(
					USES,
					['The all-island power system', '全岛电力系统'],
					['Services keep the grid stable as wind rises.', '风电占比上升时，系统服务保障电网稳定。'],
				),
				p(
					BEARS,
					['Suppliers, then consumers', '售电商，最终为用户'],
					[
						'Costs are recovered through regulated charges approved by the two regulators.',
						'成本通过两地监管机构核准的收费回收。',
					],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Wind-driven spreads', '风电带来的价差'],
					['Charge in windy low-price hours and sell into the peak.', '在多风低价时段充电，在高峰售电。'],
				),
				u(
					['Balancing market', '平衡市场'],
					[
						'Trade day-ahead and intraday, then settle deviations in the balancing market.',
						'参与日前与日内交易，偏差在平衡市场结算。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['SEMO and the SEM exchange', 'SEMO 与单一电力市场交易所'],
					['Clear and settle energy trades across the island.', '清算并结算全岛电量交易。'],
				),
				p(BUYERS, ['Suppliers', '售电商'], ['They buy the energy for their customers.', '为其用户购电。']),
				NO_PAYER,
			],
		},
	},
	pl: {
		capacity: {
			uses: [
				u(
					['Stress-period delivery', '紧张时段交付'],
					['Deliver the corrected capacity when PSE declares a stress period.', 'PSE 宣布紧张时段时，交付修正后的容量。'],
				),
				u(
					['Multi-year agreements', '多年期协议'],
					['New units can win agreements of several years in the main auction.', '新建机组可在主拍卖中获得多年期协议。'],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['PSE and the settlement company', 'PSE 与结算公司'],
					[
						'PSE runs the auctions; the state settlement company pays capacity remuneration.',
						'PSE 组织拍卖；国有结算公司支付容量报酬。',
					],
				),
				p(
					USES,
					['The Polish power system', '波兰电力系统'],
					['Capacity is held for security of supply.', '容量用于保障供应安全。'],
				),
				p(
					BEARS,
					['Electricity consumers', '电力用户'],
					['Through the capacity fee on electricity bills.', '通过电费中的容量费承担。'],
				),
			],
		},
		grant: {
			uses: [
				u(
					['Lower construction funding', '降低建设资金需求'],
					['The grant reimburses part of eligible capex once milestones are met.', '达到节点后，补贴报销部分合格投资。'],
				),
				u(
					['Stacking limits', '叠加限制'],
					[
						'Conditions can limit other support, such as capacity awards, on the same asset.',
						'资助条件可能限制同一资产取得其他支持，如容量中标。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['NFOŚiGW', 'NFOŚiGW 国家环境保护与水资源管理基金'],
					['Signs the funding agreement and pays out against eligible expenditure.', '签署资助协议，并按合格支出拨款。'],
				),
				GRANT_USER,
				p(
					BEARS,
					['EU Modernisation Fund', '欧盟现代化基金'],
					['Funded from EU carbon-allowance revenue, not from electricity bills.', '资金来自欧盟碳配额收入，而非电费。'],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Day-ahead and intraday', '日前与日内交易'],
					['Charge in low-price hours and sell into the evening peak.', '在低价时段充电，在晚高峰售电。'],
				),
				u(
					['Balancing market', '平衡市场'],
					[
						'Offer balancing capacity and energy to PSE in the reformed balancing market.',
						'在改革后的平衡市场向 PSE 提供平衡容量与电量。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['TGE and its clearing house', 'TGE 及其清算机构'],
					['Clear exchange energy trades.', '清算交易所电量交易。'],
				),
				p(
					['Balancing services', '平衡服务'],
					['PSE', 'PSE'],
					[
						'Buys balancing for system security; costs reach consumers through tariffs.',
						'为系统安全采购平衡服务；成本经电价传导给用户。',
					],
				),
				NO_PAYER,
			],
		},
	},
	ro: {
		merchant: {
			uses: [
				u(
					['Day-ahead and intraday', '日前与日内交易'],
					[
						'Charge in solar hours and sell into the evening peak on the Romanian exchange.',
						'在光伏时段充电，在罗马尼亚交易所晚高峰售电。',
					],
				),
				u(
					['Balancing services', '平衡服务'],
					[
						'After qualification, offer FCR, aFRR and mFRR to Transelectrica.',
						'取得资格后，向 Transelectrica 提供 FCR、aFRR 与 mFRR。',
					],
				),
			],
			parties: [
				p(SETTLES, ['OPCOM', 'OPCOM'], ['Operates and clears the energy exchange.', '运营并清算电能量交易所。']),
				p(
					['Balancing services', '平衡服务'],
					['Transelectrica', 'Transelectrica'],
					[
						'Buys balancing for system security; costs reach consumers through tariffs.',
						'为系统安全采购平衡服务；成本经电价传导给用户。',
					],
				),
				NO_PAYER,
			],
		},
		floor: floor([
			'The optimiser runs the battery in the Romanian energy and balancing markets.',
			'优化商安排电池参与罗马尼亚电能量与平衡市场。',
		]),
		grant: {
			uses: [
				u(
					['Lower construction funding', '降低建设资金需求'],
					['The grant reimburses part of eligible capex once milestones are met.', '达到节点后，补贴报销部分合格投资。'],
				),
				u(
					['Grant conditions', '资助条件'],
					[
						'The award can require a minimum operating period and limit other support.',
						'资助可能要求最短运营期，并限制其他支持。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['The administering ministry', '管理部委'],
					['Selects projects and pays out against eligible expenditure.', '遴选项目，并按合格支出拨款。'],
				),
				GRANT_USER,
				p(
					BEARS,
					['EU Modernisation Fund', '欧盟现代化基金'],
					['Funded from EU carbon-allowance revenue, not from electricity bills.', '资金来自欧盟碳配额收入，而非电费。'],
				),
			],
		},
	},
	pjm: {
		capacity: {
			uses: [
				u(
					['Capacity Performance', '容量表现义务'],
					[
						'Cleared, accredited MW must perform during emergency events or pay penalties.',
						'出清的核定 MW 须在紧急事件中履约，否则须支付罚款。',
					],
				),
				u(
					['Accredited by ELCC', '按 ELCC 核定'],
					[
						'Storage is credited by its effective load-carrying capability, not nameplate.',
						'储能按有效载荷能力核定，而非铭牌容量。',
					],
				),
			],
			parties: [
				p(SETTLES, ['PJM', 'PJM'], ['Runs the auctions and settles capacity payments.', '组织拍卖并结算容量款。']),
				p(USES, ['The PJM region', 'PJM 区域'], ['Capacity is held for resource adequacy.', '容量用于保障资源充足。']),
				p(
					BEARS,
					['Load-serving entities, then consumers', '售电主体，最终为用户'],
					['They pay a locational reliability charge and pass it on in retail rates.', '支付分区可靠性费用，并计入零售电价。'],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Energy arbitrage', '电能量套利'],
					[
						'Buy and sell at the project’s node in the day-ahead and real-time markets.',
						'在日前与实时市场按项目节点价格买卖。',
					],
				),
				u(
					['Regulation and reserves', '调频与备用'],
					['Follow fast regulation signals or hold synchronised reserve.', '跟随快速调频信号，或提供同步备用。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['PJM', 'PJM'],
					['Settles energy at nodal prices and pays for services.', '按节点价格结算电量并支付服务费。'],
				),
				p(
					BUYERS,
					['Load-serving entities', '售电主体'],
					['They buy energy and services for their customers.', '为其用户购买电量和服务。'],
				),
				NO_PAYER,
			],
		},
	},
	ercot: {
		merchant: {
			uses: [
				u(
					['Nodal energy arbitrage', '节点电能量套利'],
					[
						'Charge in low solar and wind hours and sell into the evening ramp.',
						'在光伏和风电低价时段充电，在傍晚负荷爬坡时售电。',
					],
				),
				u(
					['Scarcity pricing', '稀缺定价'],
					[
						'An energy-only market lets prices rise sharply when reserves run short.',
						'在纯电能量市场中，备用不足时价格可大幅上涨。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['ERCOT, through a scheduling entity', 'ERCOT（经调度主体）'],
					[
						'Settles energy at nodal prices with the project’s qualified scheduling entity.',
						'按节点价格与项目的合格调度主体结算电量。',
					],
				),
				p(
					BUYERS,
					['Retail providers and large loads', '零售电力商与大负荷'],
					['They buy the energy for their customers.', '为其用户购电。'],
				),
				NO_PAYER,
			],
		},
		ancillary: {
			uses: [
				u(['Regulation', '调频'], ['Correct frequency continuously in both directions.', '双向持续校正频率。']),
				u(
					['Responsive and contingency reserves', '响应与事故备用'],
					[
						'Hold power for fast response, ERCOT contingency reserve and non-spinning reserve.',
						'为快速响应、ERCOT 事故备用与非旋转备用预留功率。',
					],
				),
			],
			parties: [
				p(SETTLES, ['ERCOT', 'ERCOT'], ['Procures services with energy and settles them.', '与电量联合采购服务并结算。']),
				p(
					USES,
					['The ERCOT grid', 'ERCOT 电网'],
					['Services keep the isolated Texas grid secure.', '服务保障相对孤立的得州电网安全。'],
				),
				p(
					BEARS,
					['Load, then consumers', '负荷侧，最终为用户'],
					['Costs are charged to load by its share and passed on in retail rates.', '成本按份额向负荷侧收取，并计入零售电价。'],
				),
			],
		},
		toll: toll(
			['A utility, retailer or trader', '电力公司、零售商或交易商'],
			['The toller earns from nodal energy and ancillary services.', '承租方通过节点电能量与辅助服务获利。'],
		),
	},
	caiso: {
		ra: {
			uses: [
				u(
					['Meet a buyer’s RA obligation', '满足买方 RA 义务'],
					[
						'The buyer counts the battery towards the capacity it must show for each month and hour slice.',
						'买方将电池计入其各月、各时段须证明的容量。',
					],
				),
				u(
					['Must-offer', '必须报价'],
					[
						'Sold RA capacity must be offered to CAISO and charged enough to deliver.',
						'已售 RA 容量须向 CAISO 报价，并保持足够充电以便交付。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['A load-serving entity', '售电主体'],
					[
						'A utility, community choice aggregator or retailer pays under a bilateral contract.',
						'公用事业、社区选择聚合商或售电商按双边合同付款。',
					],
				),
				p(
					USES,
					['The buyer, for compliance', '买方（用于合规）'],
					['The state regulator sets the requirement; CAISO enforces must-offer.', '州监管机构设定要求；CAISO 执行必须报价。'],
				),
				p(BEARS, ['The buyer’s customers', '买方的用户'], ['Through retail rates.', '通过零售电价承担。']),
			],
		},
		merchant: {
			uses: [
				u(
					['Solar shift', '光伏时移'],
					['Charge in the midday solar surplus and sell into the evening ramp.', '在午间光伏富余时充电，在傍晚爬坡时售电。'],
				),
				u(
					['Regulation and reserves', '调频与备用'],
					['Provide regulation and spinning reserve alongside energy.', '在参与电量的同时提供调频和旋转备用。'],
				),
			],
			parties: [
				p(
					SETTLES,
					['CAISO', 'CAISO'],
					['Settles energy at nodal prices and pays for services.', '按节点价格结算电量并支付服务费。'],
				),
				p(
					BUYERS,
					['Load-serving entities', '售电主体'],
					['They buy energy and services for their customers.', '为其用户购买电量和服务。'],
				),
				NO_PAYER,
			],
		},
	},
	es: {
		merchant: {
			uses: [
				u(
					['Solar spread', '光伏价差'],
					['Charge in low or zero midday prices and sell into the evening peak.', '在午间低价或零电价时充电，在晚高峰售电。'],
				),
				u(
					['Balancing and voltage services', '平衡与电压服务'],
					[
						'After qualification, offer aFRR, mFRR and voltage control to REE.',
						'取得资格后，向 REE 提供 aFRR、mFRR 与电压控制。',
					],
				),
			],
			parties: [
				p(
					SETTLES,
					['OMIE', 'OMIE'],
					['Runs and settles the Iberian day-ahead and intraday markets.', '运营并结算伊比利亚日前与日内市场。'],
				),
				p(
					['Balancing services', '平衡服务'],
					['REE', 'REE'],
					[
						'Buys services for system security; costs reach consumers through charges.',
						'为系统安全采购服务；成本经收费传导给用户。',
					],
				),
				NO_PAYER,
			],
		},
		capacity: {
			uses: [
				u(
					['Firm capacity', '可靠容量'],
					['An award pays for capacity available in the system’s stress hours.', '中标后为系统紧张时段的可用容量付费。'],
				),
				u(
					['Stacking with grants', '与补贴叠加'],
					[
						'Auction rules can reduce or bar remuneration for assets that already hold support.',
						'拍卖规则可能对已获支持的资产减少或取消报酬。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['Settlement under the award', '中标后的结算'],
					[
						'The system operator runs the auctions; payment starts only after a qualifying award.',
						'系统运营商组织拍卖；只有合格中标后才开始付款。',
					],
				),
				p(
					USES,
					['The Spanish power system', '西班牙电力系统'],
					['Capacity is held for security of supply.', '容量用于保障供应安全。'],
				),
				p(
					BEARS,
					['Suppliers, then consumers', '售电商，最终为用户'],
					[
						'Suppliers and direct consumers pay by their demand and pass it on in bills.',
						'售电商与直接用户按用电量付费，并计入电费。',
					],
				),
			],
		},
		grant: {
			uses: [
				u(
					['Lower construction funding', '降低建设资金需求'],
					['The grant reimburses part of eligible capex once milestones are met.', '达到节点后，补贴报销部分合格投资。'],
				),
				u(
					['Bid interaction', '与投标的关系'],
					['Support already received must be reconciled with any capacity bid.', '已获支持须与容量投标协调。'],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['IDAE', 'IDAE 能源多元化与节能研究所'],
					['Runs the calls and pays out against eligible expenditure.', '组织申报并按合格支出拨款。'],
				),
				GRANT_USER,
				p(
					BEARS,
					['EU funds', '欧盟资金'],
					['Funded from EU recovery and regional funds, not from electricity bills.', '资金来自欧盟复苏与区域基金，而非电费。'],
				),
			],
		},
	},
	ca_on: {
		capacity: {
			uses: [
				u(
					['Contracted capacity', '签约容量'],
					[
						'Monthly payments for available capacity that Ontario needs as demand grows.',
						'为安大略负荷增长所需的可用容量按月付款。',
					],
				),
				u(
					['Must-offer into the market', '须向市场报价'],
					['The contract requires the capacity to be offered into the IESO market.', '合同要求容量向 IESO 市场报价。'],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['IESO', 'IESO 独立电力系统运营商'],
					['Signs the contract and settles monthly.', '签订合同并按月结算。'],
				),
				p(USES, ['The Ontario power system', '安大略电力系统'], ['Capacity is held for reliability.', '容量用于保障可靠性。']),
				p(
					BEARS,
					['Electricity consumers', '电力用户'],
					['Through the Global Adjustment on bills.', '通过电费中的全球调整费承担。'],
				),
			],
		},
		merchant: {
			uses: [
				u(
					['Day-ahead and real-time energy', '日前与实时电能量'],
					['Trade at locational prices in the renewed IESO market.', '在改革后的 IESO 市场按节点价格交易。'],
				),
				u(
					['Operating reserve', '运行备用'],
					['Hold power for reserve within the contract’s limits.', '在合同限制内为备用预留功率。'],
				),
			],
			parties: [
				p(SETTLES, ['IESO', 'IESO'], ['Settles energy and reserve in the market.', '结算市场中的电量与备用。']),
				p(
					BUYERS,
					['Local distributors and large customers', '本地配电企业与大用户'],
					['They buy the energy for their customers.', '为其用户购电。'],
				),
				p(
					['Contract adjustment', '合同调整'],
					['The LT2 contract', 'LT2 合同'],
					['Settlement terms can adjust how much market income the owner keeps.', '结算条款可能调整业主可保留的市场收入。'],
				),
			],
		},
	},
	sa: {
		ssa: {
			uses: [
				u(
					['Shift solar to the evening', '把光伏转到傍晚'],
					[
						'Store large-scale solar output and deliver it in the evening and night peak.',
						'储存大型光伏出力，在傍晚与夜间高峰交付。',
					],
				),
				u(
					['Grid support', '电网支撑'],
					[
						'Provide the services specified in the agreement when the grid operator dispatches.',
						'按协议约定的服务，在电网调度时提供支撑。',
					],
				),
			],
			parties: [
				p(
					COUNTERPARTY,
					['SPPC', 'SPPC 沙特电力采购公司'],
					['The principal buyer pays under the agreement.', '主买方按协议付款。'],
				),
				p(
					USES,
					['The national grid', '国家电网'],
					[
						'The grid operator dispatches the battery; there is no merchant market to trade in.',
						'由电网运营方调度电池；没有可供交易的批发市场。',
					],
				),
				p(
					BEARS,
					['The regulated power sector', '受监管的电力部门'],
					[
						'Costs sit within a single-buyer system funded by regulated tariffs and the state.',
						'成本由受管制电价与国家资金支撑的单一买方体系承担。',
					],
				),
			],
		},
	},
	jp_tokyo: SHARED_JP,
	jp_kyushu: SHARED_JP,
	jp_hokkaido: SHARED_JP,
};
