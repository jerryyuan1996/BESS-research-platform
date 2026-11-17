// Shared explanation defaults. Schematic states explain existing research; no
// dispatch, price, contract award or investor result is inferred from a drawing.
export const SYSTEM_STEPS = [
	{
		label: ['01 · The mismatch', '01 · 时段错配'],
		title: ['Electricity can be abundant at the wrong hour.', '电量充足的时刻，不一定是最需要电的时刻。'],
		body: [
			'When solar output is strong and local export capacity is tight, extra electricity may have little local value. A battery needs a permitted place to charge.',
			'当光伏出力充足、当地外送空间有限时，新增电量在当地的价值可能走低。电池首先要有合法、可用的充电接入。',
		],
		takeaway: [
			'Check the local hourly price and charging access. Annual renewable share alone cannot price this opportunity.',
			'先查当地小时电价与充电准入；全年可再生能源占比无法给这个机会定价。',
		],
	},
	{
		label: ['02 · Store locally', '02 · 就地充电'],
		title: ['The battery carries energy into a later hour.', '电池把当前电量，留到之后使用。'],
		body: [
			'With charging access and spare energy capacity, the battery absorbs electricity locally. Conversion losses and cycling consume part of the value.',
			'在允许充电且有剩余容量时，电池吸收当地电量。转换损耗和循环衰减会消耗部分价值。',
		],
		takeaway: [
			'Check import power, usable MWh, efficiency and cycling cost together.',
			'把充电功率、可用电量、效率和循环成本放在一起核验。',
		],
	},
	{
		label: ['03 · Deliver later', '03 · 择时交付'],
		title: ['A later sale only works if the project can deliver.', '晚些时候有需求，还要能把电送出去。'],
		body: [
			'When demand rises and export access is available, the battery discharges. Its location and connection limit the power it can sell; storage does not remove a transmission bottleneck.',
			'需求上升且允许送出时，电池才可放电。选址和并网条件限制了可售功率，储能本身不会消除输电瓶颈。',
		],
		takeaway: [
			'Advance only with evidence for both a local spread and a usable charge/discharge connection.',
			'本地价差与可用的双向并网条件，两项都要有证据，才值得推进。',
		],
	},
];
export const REVENUE_ROUTES = {
	capacity: {
		label: ['Capacity market', '容量市场'],
		unit: 'MW',
		counterparty: ['Terna', 'Terna'],
		promise: ['Qualified available power', '经认定的可用功率'],
		right: ['Operate within availability and offer obligations', '在可用性与报价义务内运营'],
		pay: ['Contract premium for available capacity', '为可用容量支付合同费用'],
		net: [
			'Capacity premium + permitted trading income − clawbacks, penalties and costs',
			'容量费 + 允许保留的交易收入 − 回拨、考核与成本',
		],
		check: [
			'Confirm credited MW, delivery year, availability duties and revenue clawbacks in the actual contract.',
			'核对实际合同的认定 MW、交付年份、可用性义务及收入回拨条款。',
		],
		uses: [
			{
				title: ['System adequacy', '系统充裕度'],
				body: [
					'Credited power stays available for the hours when national supply is tight.',
					'在全国供电紧张的时段，保持经认定的功率可用。',
				],
			},
			{
				title: ['Mandatory market offers', '强制市场报价'],
				body: [
					'The contracted capacity must be offered in the energy and dispatching-services markets.',
					'签约容量须在电能量市场和调度服务市场报价。',
				],
			},
			{
				title: ['Price cap for consumers', '为用户封顶电价'],
				body: [
					'When the market price exceeds the strike price, the holder returns the difference to Terna.',
					'市场价格高于执行价时，持有方须向 Terna 返还差额。',
				],
			},
		],
		parties: [
			{
				role: ['Contract counterparty', '合同对手方'],
				who: ['Terna', 'Terna'],
				note: ['Runs the auction, signs the contract and settles the annual premium.', '组织拍卖、签订合同并结算年度容量费。'],
			},
			{
				role: ['Who uses it', '使用方'],
				who: ['The national power system', '全国电力系统'],
				note: [
					'No single buyer takes the energy; Terna holds the availability for adequacy.',
					'没有单一买方取得电量；Terna 持有这份可用性以保障充裕度。',
				],
			},
			{
				role: ['Who bears the cost', '成本承担方'],
				who: ['Electricity consumers', '电力用户'],
				note: [
					'Through a charge on bills set by ARERA, net of the amounts holders return.',
					'通过 ARERA 核定的电费附加承担，并扣除持有方返还的金额。',
				],
			},
		],
		sources: ['SRC-IT-07', 'SRC-IT-09', 'SRC-IT-11'],
	},
	macse: {
		label: ['MACSE storage contract', 'MACSE 储能合同'],
		unit: 'MWh',
		counterparty: ['Terna / time-shifting users', 'Terna／时移使用者'],
		promise: ['Contracted stored-energy capacity', '签约储存电量'],
		right: ['Contracted time-shifting use is allocated through the mechanism', '签约电量的时移使用权按机制分配'],
		pay: ['Fixed premium for contracted storage service', '为约定储能服务支付固定溢价'],
		net: [
			'Contract premium + allowed retained income − revenue returns, penalties and costs',
			'合同溢价 + 允许保留的收入 − 收益返还、考核与成本',
		],
		check: [
			'Establish who schedules the contracted capacity and which revenues the owner may retain. Full merchant upside cannot simply be added.',
			'先确定签约容量由谁安排调度、业主可保留哪些收益；不能再简单叠加全部市场化套利收益。',
		],
		uses: [
			{
				title: ['Shift renewable surplus', '转移可再生富余电量'],
				body: [
					'Charge in hours of solar and wind surplus and deliver later, mainly in the south and the islands.',
					'在光伏和风电富余时段充电、稍后放电，主要位于南部和岛屿。',
				],
			},
			{
				title: ['Time-shifting products', '时移产品'],
				body: [
					'Terna pools the contracted capacity by zone and sells its use as time-shifting products on a platform run by GME.',
					'Terna 按区域汇集签约容量，并在 GME 运营的平台上以时移产品出售其使用权。',
				],
			},
			{
				title: ['Dispatching services', '调度服务'],
				body: [
					'The asset must also be offered to Terna in the dispatching-services market.',
					'该资产还须在调度服务市场向 Terna 报价。',
				],
			},
		],
		parties: [
			{
				role: ['Contract counterparty', '合同对手方'],
				who: ['Terna', 'Terna'],
				note: [
					'Pays the fixed annual premium per MWh awarded for the contract term.',
					'在合同期内按中标 MWh 支付固定年度溢价。',
				],
			},
			{
				role: ['Who uses it', '使用方'],
				who: ['Market participants buying time-shifting products', '购买时移产品的市场主体'],
				note: [
					'Traders, producers and suppliers buy the right to move energy between hours; Terna decides which batteries deliver.',
					'交易商、发电商和售电商购买跨时段转移电量的权利；由 Terna 决定哪些电池履约。',
				],
			},
			{
				role: ['Who bears the cost', '成本承担方'],
				who: ['Electricity consumers, for the net cost', '电力用户（承担净成本）'],
				note: [
					'Proceeds from the time-shifting products reduce the cost; the remainder is recovered through a charge set by ARERA.',
					'时移产品的销售收入冲减成本；余额通过 ARERA 核定的收费回收。',
				],
			},
		],
		sources: ['SRC-IT-14', 'SRC-IT-16', 'SRC-IT-19', 'SRC-IT-20'],
	},
	merchant: {
		label: ['Merchant trading', '市场化交易'],
		unit: 'MWh',
		counterparty: ['Market counterparties', '市场交易对手'],
		promise: ['Energy sold and services actually delivered', '实际成交电量与交付服务'],
		right: ['Owner / optimiser chooses dispatch within grid and market rules', '业主／优化商在电网与市场规则内安排调度'],
		pay: ['Settlement for executed trades and services', '按成交与交付结果结算'],
		net: [
			'Settled sales − charging energy, fees, degradation and operating costs',
			'已结算售电收入 − 充电电费、交易费、衰减与运营成本',
		],
		check: [
			'Test realised local spreads after losses and fees, dispatch capability, and downside periods.',
			'核验损耗和费用后的当地实际价差、调度能力与不利时段表现。',
		],
		uses: [
			{
				title: ['Day-ahead and intraday arbitrage', '日前与日内套利'],
				body: [
					'Buy in low-price hours and sell in the evening peak at the price of the project’s own zone.',
					'在低价时段购电、晚高峰售电，按项目所在区域的价格结算。',
				],
			},
			{
				title: ['Dispatching services', '调度服务'],
				body: [
					'Offer reserve, balancing and congestion relief to Terna; only accepted offers are paid.',
					'向 Terna 提供备用、平衡和阻塞缓解报价；仅中标报价获得付款。',
				],
			},
		],
		parties: [
			{
				role: ['Energy markets', '电能量市场'],
				who: ['GME, as central counterparty', 'GME（中央对手方）'],
				note: ['Behind it, suppliers, traders and large consumers buy the energy.', '其背后的买方是售电商、交易商和大用户。'],
			},
			{
				role: ['Dispatching services', '调度服务'],
				who: ['Terna', 'Terna'],
				note: [
					'Buys the services for system security; consumers bear the cost through dispatching charges.',
					'为系统安全采购服务；成本通过调度费用由用户承担。',
				],
			},
			{
				role: ['Contract payer', '合同付款方'],
				who: ['None', '无'],
				note: ['Income exists only when a trade or an offer is executed.', '只有交易或报价成交，才有收入。'],
			},
		],
		sources: ['SRC-IT-05', 'SRC-IT-06', 'SRC-IT-21'],
	},
};
export const PAYMENT_STEPS = [
	['01 · What is sold', '01 · 卖什么'],
	['02 · Who controls it', '02 · 谁能使用'],
	['03 · What remains', '03 · 留下什么'],
];
export function deliveryState(step, blocked) {
	return step === 0 ? 'surplus' : step === 1 ? 'charging' : blocked ? 'constrained' : 'discharging';
}
