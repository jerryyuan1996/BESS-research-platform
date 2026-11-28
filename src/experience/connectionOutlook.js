/* ---------------------------------------------------------------------------
   GRID CONNECTION VALUE, market by market.

   What a connection is worth today, where policy and scarcity are taking it,
   and how the platform proposes to value it once the first battery retires.
   Written at the analyst's request on 27 November 2026, from the research in
   docs/terminal-value-research-2026-11-27.md, and approved by him as drafted
   the same day (docs/site-value-plan-2026-11-27.md, D1–D6). The end-of-life
   credit is shown beside the headline return; moving it into the headline
   needs its own sign-off on docs/site-value-impact-2026-11-27.md.

   Rules for an entry, the same as the rest of the site's prose:
     - conclusion first: the call on the connection's future value, then why;
     - no model figure typed into the text. Observed prices, fees, queue sizes
       and dates are quoted from their source;
     - the analyst's grid-scarcity grade is read from the view store at render
       time and never retyped here;
     - one evidence marker (strong, fair, thin) plus what would change it;
     - English and Simplified Chinese with the same meaning.
   --------------------------------------------------------------------------- */

import { SITE_VALUE, SITE_VALUE_WEIGHT } from '../acquisition/siteValue.js';

export const OUTLOOK_AS_OF = '2026-11-27';

/** The call on where the value of a held connection is going. */
export const OUTLOOK = {
	rising: ['Rising', '上升'],
	peaking: ['Rising, then easing', '先升后降'],
	holding: ['Holding', '持平'],
	falling: ['Falling', '下降'],
};

/** The end-of-life credit, shared by every market that has a price. */
export const SITE_VALUE_METHOD = {
	weight: SITE_VALUE_WEIGHT,
	text: [
		'If the lease, consents and grid access survive retirement, a buyer can reuse the site. The scenario takes half the reference value of a comparable pre-construction site, indexes it to retirement using the model’s inflation assumption, then deducts selling costs and tax on the gain. Removal costs are charged separately.',
		'如果退役后租约、许可和并网权仍然有效，买方可以继续利用场址。该情景取可比施工前场址参考估值的一半，按模型通胀假设折算至退役时点，再扣除出售费用及收益税。拆除费用单独计提。',
	],
	status: ['Separate end-of-life scenario', '寿命期末残值情景'],
};

const s = (label, url) => ({ label, url });

const SRC = {
	escQueue: s(
		['ESS News — GB removes 153 GW of stalled projects from the queue (Dec 2025)', 'ESS News — 英国清除153GW停滞项目（2025年12月）'],
		'https://www.ess-news.com/2025/12/09/great-britain-axes-153-gw-of-zombie-projects-to-clear-the-queue-for-shovel-ready-bess/',
	),
	cmp470: s(
		['bess.farm — CMP470 commitment fee proposal (secondary; confirm with Ofgem)', 'bess.farm — CMP470承诺费提案（二手资料，以Ofgem为准）'],
		'https://www.bess.farm/policy-and-future/ofgem-cmp470-new-financial-rules-for-the-uk-battery-queue.html',
	),
	gsfRights: s(
		['Gore Street — Strategy and Capital Allocation Plan, 30 July 2025', 'Gore Street — 战略与资本配置计划（2025年7月30日）'],
		'https://www.lse.co.uk/rns/strategy-and-capital-allocation-plan-56rlzoqduhfxjip.html',
	),
	modoHeit: s(
		['Modo Energy — Harmony Energy Income Trust cash offer, 18 March 2025', 'Modo Energy — Harmony Energy Income Trust现金收购要约（2025年3月18日）'],
		'https://modoenergy.com/research/listed-battery-funds-harmony-heit-possible-cash-offer-march-2025',
	),
	rgvPress: s(
		['50Hertz, Amprion, TenneT, TransnetBW — maturity assessment procedure, 5 Feb 2026', '四家德国输电运营商 — 成熟度评估程序（2026年2月5日）'],
		'https://www.50hertz.com/Portals/1/Dokumente/Medien/Pressemitteilungen/2026/260205_Reifegradverfahren_EN.pdf',
	),
	reifegrad: s(
		['BESS-Kompass — application fee and deposit in the maturity procedure', 'BESS-Kompass — 成熟度程序的申请费与保证金'],
		'https://bess-kompass.de/reifegradverfahren-netzanschluss-batteriespeicher/',
	),
	bkz: s(['STW — construction-cost contribution (BKZ) for batteries, 2026', 'STW — 储能建设成本分摊费（BKZ），2026年'], 'https://stw-group.de/2026/08/28/baukostenzuschuss-batteriespeicher/'),
	agnes: s(
		['Modo Energy — German grid fees: the AgNes proposal for batteries', 'Modo Energy — 德国网费：AgNes储能方案'],
		'https://modoenergy.com/research/germany-grid-fees-agnes-netzentgelte-bess-batteries-bnetza-update-capacity-fees-may-2026',
	),
	omsi: s(['OMSI — marketplace for storage project rights (asking prices)', 'OMSI — 储能项目权交易平台（挂牌价）'], 'https://omsi24.com/marktplatz/projektrechte'),
	aurivolt: s(
		['industriebox — aurivolt buys battery project rights', 'industriebox — aurivolt收购储能项目权'],
		'https://www.industriebox.de/2026/09/03/aurivolt-kauft-projektrechte-fr-batteriespeicher-zwischen-einem-und-zehn-megawatt/',
	),
	ternaQueue: s(['Euronews — Italy’s battery gold rush, 29 Sep 2026', 'Euronews — 意大利储能热潮（2026年9月29日）'], 'https://www.euronews.com/2026/09/29/italys-battery-gold-rush-energy-storage-creates-a-new-market'),
	itPermits: s(['Modo Energy — Italy BESS development timeline and permitting', 'Modo Energy — 意大利储能开发周期与审批'], 'https://modoenergy.com/research/en/italy-bess-development-timeline-permitting'),
	itRtb: s(
		['ESS News — Italian ready-to-build BESS prices slide (nTeaser data), 14 Apr 2026', 'ESS News — 意大利可开工储能项目价格下滑（nTeaser数据），2026年4月14日'],
		'https://www.ess-news.com/2026/04/14/italian-ready-to-build-bess-market-prices-slide-amid-regulatory-uncertainty-macse-misfire/',
	),
	esRtb: s(
		['ION Analytics — Spanish BESS project values rise (nTeaser data)', 'ION Analytics — 西班牙储能项目估值上升（nTeaser数据）'],
		'https://ionanalytics.com/insights/uncategory/spanish-solar-project-prices-plummet-as-bess-values-soar-2/',
	),
	esPermits: s(
		['Energy-Storage.News — how a Spanish battery makes money today', 'Energy-Storage.News — 西班牙储能当前如何盈利'],
		'https://www.energy-storage.news/how-a-spanish-battery-makes-money-today-and-what-lenders-will-finance-tomorrow/',
	),
	esAccess: s(
		['PF Nexus — grid connection in Spain (secondary)', 'PF Nexus — 西班牙并网指南（二手资料）'],
		'https://www.pfnexus.com/guides/grid-connection-in-spain-rules-timelines-costs-for-renewable-and-bess-projects',
	),
	plConditions: s(
		['Szumski Consulting — in Poland the scarce asset is the connection (secondary)', 'Szumski Consulting — 波兰稀缺的是并网权（二手资料）'],
		'https://www.szumskiconsulting.com/blog/battery-grid-connection-poland.html',
	),
	plSale: s(
		['ESS News — Greenvolt sells two Polish battery projects, 26 Oct 2026', 'ESS News — Greenvolt出售两个波兰储能项目（2026年10月26日）'],
		'https://www.ess-news.com/2026/10/26/greenvolt-sells-off-two-800-mwh-polish-battery-projects-for-438-million/',
	),
	roAuction: s(
		['ANRE — auction-based connection allocation rules, 30 July 2024', 'ANRE — 基于拍卖的并网容量分配规则（2024年7月30日）'],
		'https://anre.ro/informare-de-presa-30-07-2024-anre-aproba-reguli-noi-privind-racordarea-pe-baza-de-licitatie-a-locurilor-de-producere-a-energiei-electrice-la-retelele-de-interes-public/',
	),
	roPipeline: s(['Romania Insider — battery pipeline exceeds 9 GW, July 2026', 'Romania Insider — 储能储备项目超过9GW（2026年7月）'], 'https://www.romania-insider.com/battery-storage-pipeline-romania-july-2026'),
	ieEcp: s(
		['CRU — Electricity Connection Policy, decision CRU/2024101', 'CRU — 电力并网政策决定 CRU/2024101'],
		'https://cruie-live-96ca64acab2247eca8a850a7e54b-5b34f62.divio-media.com/documents/CRU2024101_Electricity_Connection_Policy_Generation__System_Services_Decision_Paper.pdf',
	),
	ieLeu: s(
		['DLA Piper — Ireland’s large energy users connection policy, 7 Jan 2026', 'DLA Piper — 爱尔兰大型用电户并网政策（2026年1月7日）'],
		'https://www.dlapiper.com/en-us/insights/publications/2026/01/new-irish-large-energy-users-connection-policy',
	),
	ieRtb: s(
		['ESS News — 680 MWh of ready-to-build Irish BESS acquired, 21 Aug 2026', 'ESS News — 680MWh爱尔兰可开工储能被收购（2026年8月21日）'],
		'https://www.ess-news.com/2026/08/21/global-clean-investor-snaps-up-680-mwh-of-ready-to-build-irish-bess/',
	),
	fingrid: s(
		['Fingrid — restrictions on new storage connections in southern Finland', 'Fingrid — 芬兰南部新增储能并网限制'],
		'https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland/',
	),
	fiRtb: s(
		['Energy Global — Luxcara acquires a construction-ready Finnish battery, 27 Feb 2026', 'Energy Global — Luxcara收购芬兰可开工储能项目（2026年2月27日）'],
		'https://www.energyglobal.com/energy-storage/27022026/luxcara-acquires-construction-ready-battery-storage-project-in-finland',
	),
	tepcoCap: s(
		['TEPCO Power Grid — concurrent connection-study cap', '东京电力PG — 同时进行的并网研究数量上限'],
		'https://www.tepco.co.jp/pg/consignment/workshop/information/renewable/adjustment/20260724_01.html',
	),
	kyudenCap: s(
		['Kyushu Electric Power T&D — connection applications and study cap', '九州电力送配电 — 并网申请与研究数量上限'],
		'https://www.kyuden.co.jp/td/application/electric-power-generation-business/application.html',
	),
	hepcoCap: s(['HEPCO Network — grid-battery connection-study cap', '北海道电力网络 — 电网侧储能并网研究上限'], 'https://www.hepco.co.jp/network/info/info2026/1253145_2078.html'),
	hepcoCharge: s(
		['HEPCO Network — early connection on charging-control terms', '北海道电力网络 — 充电控制条件下的提前并网'],
		'https://www.hepco.co.jp/network/info/info2026/1253068_2078.html',
	),
	jpLadder: s(['Scix — grid-scale battery transactions in Japan (advisory firm)', 'Scix — 日本电网侧储能交易（咨询机构）'], 'https://www.scix.co.jp/en/knowledge'),
	jpSale: s(
		['Business Wire — Nuvve Japan sells a 2 MW / 8 MWh project, 9 Mar 2026', 'Business Wire — Nuvve日本出售2MW/8MWh项目（2026年3月9日）'],
		'https://secure.businesswire.com/news/home/20260309871339/en/NUVVE-JAPAN-Finalizes-First-Sale-Agreement-for-2MW-8MWh-Battery-Storage-Project-in-Mino-Gifu-for-%243.35-million-%C2%A5520-Million',
	),
	pjmQueue: s(['PJM — reopened interconnection queue and Transition Cycle 1', 'PJM — 重新开放的并网队列与第一过渡周期'], 'https://www.pjm.com/planning/service-requests/services-request-status'),
	pjmReplace: s(
		['PJM Inside Lines — FERC approves the replacement-generation process', 'PJM Inside Lines — FERC批准替代机组并网程序'],
		'https://insidelines.pjm.com/ferc-approves-streamlined-process-to-replace-retiring-facilities/',
	),
	pjmCosts: s(
		['Modo Energy — PJM Transition Cycle 1 results and upgrade costs', 'Modo Energy — PJM第一过渡周期结果与升级成本'],
		'https://modoenergy.com/research/en/pjm-transition-cycle-1-battery-storage-bess-buildout-interconnection-costs-arbitrage-revenue-developers',
	),
	ercotQueue: s(['ERCOT — generation interconnection status and large-load queue', 'ERCOT — 电源并网状态与大负荷队列'], 'https://www.ercot.com/gridinfo/resource'),
	ercotRevenue: s(['Modo Energy — ERCOT BESS buildout, Q3 2026', 'Modo Energy — ERCOT储能建设进展（2026年第三季度）'], 'https://modoenergy.com/research/en/ercot-bess-buildout-q3-2026'),
	usDeals: s(
		['Enerdatics — US development-stage battery deals', 'Enerdatics — 美国开发阶段储能交易'],
		'https://www.enerdatics.com/insights/why-two-projects-carry-the-economics-of-a-2-3-gw-battery-deal',
	),
	caisoC15: s(
		['CAISO — informational report on Cluster 15, 29 Jul 2025', 'CAISO — 第15批次并网信息报告（2025年7月29日）'],
		'https://www.caiso.com/documents/jul-29-2025-informational-report-on-cluster-15-interconnection-process-enhancements-2023-er24-2671.pdf',
	),
	caisoRetain: s(
		['CAISO — final proposal on retaining interconnection service and deliverability, 23 Jun 2026', 'CAISO — 保留并网服务与可交付容量的最终方案（2026年6月23日）'],
		'https://stakeholdercenter.caiso.com/InitiativeDocuments/Final-Proposal-Retention-of-Interconnection-Service-and-Deliverability-for-Retirements-Final-Proposal-Jun-23-26.pdf',
	),
	nemAccess: s(
		['EnergyCo — access rights in two renewable energy zones', 'EnergyCo — 两个可再生能源区的接入权'],
		'https://www.energyco.nsw.gov.au/news/access-rights-two-renewable-energy-zones-give-certainty-investors-and-communities',
	),
	nemScheme: s(['EnergyCo — Central-West Orana access scheme', 'EnergyCo — 中西部奥拉纳接入方案'], 'https://www.energyco.nsw.gov.au/central-west-orana-access-scheme'),
	nemRtb: s(
		['pv magazine Australia — BW ESS buys a 250 MW / 1,000 MWh Riverina project', 'pv magazine Australia — BW ESS收购里弗赖纳250MW/1,000MWh项目'],
		'https://pv-magazine-australia.com/2026/08/13/bw-ess-acquires-250-mw-1000-mwh-battery-storage-project-in-the-riverina/',
	),
	waTsp: s(['Western Power — Transmission System Plan', 'Western Power — 输电系统规划'], 'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/'),
	waCel: s(
		['Western Power — Clean Energy Link program', 'Western Power — 清洁能源连接计划'],
		'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/clean-energy-link-program/',
	),
	ieso: s(
		['IESO — Long Term 2 capacity stream results, 18 June 2026', 'IESO — 第二轮长期采购容量类结果（2026年6月18日）'],
		'https://ieso.ca/Sector-Participants/IESO-News/2026/06/June-18---Long-Term-2-Capacity-Stream-Results-Announced',
	),
	iesoPrice: s(['mgrid — IESO awards 640 MW of storage below its last procurement', 'mgrid — IESO以低于上轮的价格授予640MW储能'], 'https://mgrid.org/2026/06/17/ontarios-ieso-awards-640-mw-of-battery-storage-at-costs-36-below-its-last-procurement/'),
	sppc: s(
		['Energy-Storage.News — SPPC awards 2 GW / 8 GWh of storage contracts', 'Energy-Storage.News — SPPC授予2GW/8GWh储能合同'],
		'https://www.energy-storage.news/saudi-power-procurement-company-awards-2gw-8gwh-battery-storage-contracts/',
	),
};

const JP_PRICE = [
	'One advisory firm’s price ladder for a typical small grid-scale unit, first half of 2026: rights only ¥150–200m against ¥700–800m for the completed plant, so the rights are about 20–27% of completed value. One disclosed sale: 2 MW / 8 MWh for ¥520m.',
	'某咨询机构2026年上半年对典型小型电网侧储能的价格梯度：仅权利为1.5–2亿日元，建成电站为7–8亿日元，即权利约占建成价值的20–27%。一笔已披露的交易：2MW/8MWh项目成交价5.2亿日元。',
];
const JP_TREND = [
	'Utilities now cap how many connection studies one operator may hold at once, from August 2026, in response to speculative applications from grid-battery developers. Long-term decarbonisation auction awards secure most revenue for twenty years, so a connection that wins one carries the contract’s value.',
	'自2026年8月起，各电网公司限制单一运营方同时进行的并网研究数量，以应对电网侧储能开发商的投机性申请。长期脱碳电源拍卖中标项目可锁定二十年的大部分收入，因此中标项目的并网点承载着合同的价值。',
];

/** Each market's entry. Prices are per MW of connection before construction unless stated. */
export const CONNECTION_OUTLOOK = {
	gb: {
		outlook: 'rising',
		evidence: 'fair',
		call: [
			'A connected GB site is becoming harder to replace. Reform now rations new battery connections, and a fee is proposed on queue places while batteries run ahead of the 2030 plan.',
			'已并网的英国场址越来越难以替代。电网改革正在对新增储能并网实行配给，并拟在储能规模超前于2030年规划期间对排队席位收取承诺费。',
		],
		trend: [
			'Connection reform cut about 153 GW of stalled projects from the queue in December 2025, and places are now offered through Gate 2 in line with Clean Power 2030. The CMP470 proposal would charge battery Gate 2 places £3k/MW, rising to £25k/MW while battery capacity stays more than 50% above its target. The consultation closed on 1 October 2026 without a decision.',
			'2025年12月的并网改革从队列中清除了约153GW停滞项目，此后并网席位通过与“2030清洁电力”对齐的Gate 2发放。CMP470提案拟对储能Gate 2席位收取每MW 3千英镑的承诺费，在储能容量高于目标50%以上期间逐步提高至每MW 2.5万英镑。该征询已于2026年10月1日截止，尚无决定。',
		],
		price: [
			'Gore Street attributed about 8% of its March 2025 net asset value to 495 MW of pre-construction projects across GB, Ireland and Texas. That implies about £84k/MW for sites with land, planning consent and near-term grid access. The GB scenario uses this blended portfolio valuation.',
			'Gore Street披露，2025年3月净资产中约8%来自英国、爱尔兰和得州合计495MW的施工前项目，折合约每MW 8.4万英镑。这些场址已取得土地、规划许可和近期并网权。英国情景采用这项跨市场组合估值。',
		],
		siteValue: SITE_VALUE.gb,
		changeIf: [
			'A final decision against the CMP470 fee, with most battery applicants offered Gate 2 dates within three years. Connections would then be easy to obtain and the premium would fall.',
			'若CMP470承诺费最终被否决，且多数储能申请人在三年内获得Gate 2并网日期，并网将容易取得，溢价随之下降。',
		],
		sources: [SRC.escQueue, SRC.cmp470, SRC.gsfRights, SRC.modoHeit],
	},
	de: {
		outlook: 'rising',
		evidence: 'fair',
		call: [
			'Requests for transmission connections run at about four times the commitments issued, and allocation now goes by a maturity ranking in fixed cycles. A commitment already held is the scarce asset.',
			'输电网并网申请约为已发放承诺的四倍，且容量改按成熟度排名分周期分配。已持有的并网承诺是稀缺资产。',
		],
		trend: [
			'The four transmission operators moved battery connections to a maturity-ranked procedure in 2026. Each application costs €50k, plus a €1,500/MW deposit that is credited against the later construction-cost contribution (BKZ). The regulator’s AgNes proposal would add a storage capacity fee of roughly €4–7k/MW a year from 2029.',
			'2026年起，四家输电运营商将储能并网改为按成熟度排名的程序。每项申请5万欧元，另缴每MW 1,500欧元保证金，可抵扣后续的建设成本分摊费（BKZ）。监管机构的AgNes方案拟自2029年起对储能另收约每MW每年4–7千欧元的容量费。',
		],
		price: [
			'No transaction statistics are public. Asking prices for connected rights on one marketplace are €124–223/kW, for 3.4 MW and 10 MW projects. One buyer of rights reports that less than a tenth of the battery connection capacity requested is granted. TransnetBW’s extra-high-voltage BKZ is €96.91/kW before its regional factor.',
			'尚无公开成交统计。某交易平台上已获并网的项目权挂牌价为每kW 124–223欧元，对应3.4MW和10MW项目。一家项目权收购方称，储能申请的并网容量中获批的不到十分之一。TransnetBW超高压BKZ为每kW 96.91欧元（未计区域系数）。',
		],
		siteValue: null,
		changeIf: [
			'Commitments issued in line with requests in the next cycles would remove the scarcity. Final AgNes fees well above the proposal would cut what a battery can earn on any connection.',
			'若后续周期发放的承诺与申请量相当，稀缺将消失；若AgNes最终费率远高于方案，储能在任何并网点的收益都会下降。',
		],
		sources: [SRC.rgvPress, SRC.reifegrad, SRC.bkz, SRC.agnes, SRC.omsi, SRC.aurivolt],
	},
	it: {
		outlook: 'holding',
		evidence: 'fair',
		call: [
			'Requests are abundant on paper but few become buildable. The value sits in authorised projects and in MACSE awards, not in a queue position.',
			'纸面上的并网申请非常充足，但能够开工的很少。价值集中在已获批项目和MACSE中标项目上，而不在排队席位本身。',
		],
		trend: [
			'Storage connection requests to Terna at high and extra-high voltage reached about 300 GW by the end of 2025. Of these, 56 GW had a go-ahead and 6.8 GW were ready to build. Storage is now contracted centrally through MACSE auctions by zone, and the median time to a permit rose from 12 to 19 months in 2026.',
			'截至2025年底，向Terna提交的高压及超高压储能并网申请约300GW，其中56GW获得许可，6.8GW具备开工条件。储能现由MACSE拍卖按区域集中签约，2026年取得许可的中位用时从12个月增至19个月。',
		],
		price: [
			'nTeaser deal data: ready-to-build median €44k/MW in Q4 2025, falling to €37.5k/MW in Q1 2026, with a range of €15–55k/MW. Projects with connection rights, environmental authorisation and land carry a clear premium.',
			'nTeaser交易数据：可开工项目中位价2025年第四季度为每MW 4.4万欧元，2026年第一季度降至每MW 3.75万欧元，区间为每MW 1.5–5.5万欧元。同时具备并网权、环评许可和土地的项目溢价明显。',
		],
		siteValue: SITE_VALUE.it,
		changeIf: [
			'A MACSE round clearing well above expectations, or Terna pruning unbuildable requests, would lift the value. A further slide in ready-to-build prices would confirm a fall.',
			'若MACSE某轮出清价远超预期，或Terna清理无法建设的申请，价值将上升；若可开工项目价格继续下滑，则确认价值下降。',
		],
		sources: [SRC.ternaQueue, SRC.itPermits, SRC.itRtb],
	},
	es: {
		outlook: 'rising',
		evidence: 'fair',
		call: [
			'Ready-to-build battery prices have risen since 2024, because access permits, not equipment, decide who gets to build.',
			'自2024年以来，可开工储能项目价格持续上升，因为决定谁能建设的是电网准入许可，而不是设备。',
		],
		trend: [
			'About 34 GW of storage holds access permits against roughly 0.3 GW in service. Spain is reworking access rules for storage, including access that is not permanently reserved.',
			'约34GW储能持有电网准入许可，而在运行的仅约0.3GW。西班牙正在修订储能准入规则，包括无需永久预留容量的接入方式。',
		],
		price: [
			'nTeaser: ready-to-build battery projects averaged €71.5k/MW in the quarter reported in June 2026, up from €42k/MW in Q3 2024. Top deals reached about €112k/MW.',
			'nTeaser：截至2026年6月公布的季度，可开工储能项目均价为每MW 7.15万欧元，高于2024年第三季度的每MW 4.2万欧元；最高成交约每MW 11.2万欧元。',
		],
		scarcity: [
			'Not graded. The gap between permits held and batteries in service shows that the permit, not the equipment, is the bottleneck.',
			'未评级。已持许可与在运储能之间的差距表明，瓶颈在于许可而非设备。',
		],
		siteValue: SITE_VALUE.es,
		changeIf: [
			'Flexible access for storage granted widely. New batteries could then connect without a firm permit, and the premium would compress.',
			'若储能灵活接入被广泛批准，新储能无需固定准入许可即可并网，溢价将被压缩。',
		],
		sources: [SRC.esRtb, SRC.esPermits, SRC.esAccess],
	},
	pl: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Speculative connection conditions are being purged, which helps real connections. But falling balancing prices lower what a battery earns on any connection.',
			'投机性的并网条件正在被清理，这对真实的并网有利；但平衡市场价格下降，会降低储能在任何并网点的收益。',
		],
		trend: [
			'Issued connection conditions reserve about 240 GW, 90 GW of it for storage. From 30 April 2026 the connection advance doubled to PLN 60k/MW, and a new application fee and security apply. The 17-year capacity-market contract remains what makes a new battery bankable.',
			'已发放的并网条件预留约240GW，其中储能90GW。自2026年4月30日起，并网预付款翻倍至每MW 6万兹罗提，并新增申请费和保证金。17年期容量市场合同仍是新建储能可获融资的关键。',
		],
		price: [
			'No public price for connection conditions. For an operating comparator, Greenvolt sold 400 MW / 1.6 GWh for €311.5m at closing, plus €80m contingent on the projects being approved for balancing markets.',
			'并网条件尚无公开价格。作为已运营项目的参照，Greenvolt以交割时3.115亿欧元出售400MW/1.6GWh项目，另有8,000万欧元取决于项目获准进入平衡市场。',
		],
		siteValue: null,
		changeIf: [
			'A disclosed sale of a project that holds conditions and a capacity contract, or the purge cutting storage conditions well below 90 GW.',
			'出现一笔已披露的、同时持有并网条件和容量合同的项目交易，或清理使储能并网条件大幅低于90GW。',
		],
		sources: [SRC.plConditions, SRC.plSale],
	},
	ro: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Outside the full south-east, auctions now put a price on new connections, which caps what an existing connection there can fetch. In the south-east a held connection keeps its value.',
			'在已满的东南部以外，新增并网现通过拍卖定价，这限制了当地存量并网权的价格上限；在东南部，已持有的并网权保持其价值。',
		],
		trend: [
			'ANRE moved allocation of connections of at least 5 MW to auctions, under rules approved in July 2024 and applied from 1 January 2026. The battery pipeline exceeds 9 GW.',
			'ANRE已将5MW及以上并网容量的分配改为拍卖，相关规则于2024年7月批准，自2026年1月1日起实施。储能储备项目超过9GW。',
		],
		price: ['No public price for a connection right.', '并网权尚无公开价格。'],
		siteValue: null,
		changeIf: [
			'Auction results with high clearing prices for connection capacity would lift the value. A pipeline that builds out faster than demand would cut it.',
			'若拍卖显示并网容量出清价较高，价值将上升；若储备项目建设快于需求增长，价值将下降。',
		],
		sources: [SRC.roAuction, SRC.roPipeline],
	},
	ie: {
		outlook: 'rising',
		evidence: 'thin',
		call: [
			'Near Dublin the value is rising. New data centres must bring their own dispatchable generation or storage, so a connection close to large demand gains value. Elsewhere it holds.',
			'都柏林附近价值上升：新建数据中心须自带可调度电源或储能，靠近大负荷的并网点因此增值。其他地区保持持平。',
		],
		trend: [
			'Connection offers are issued in two batches a year, closing on 31 March and 30 September, to projects that already hold planning permission. The December 2025 large energy users policy requires data centres of 10 MVA or more to provide new dispatchable generation or storage on site or nearby.',
			'并网要约每年分两批发放，分别于3月31日和9月30日截止，对象是已取得规划许可的项目。2025年12月的大型用电户政策要求10MVA及以上的数据中心在现场或附近配置新的可调度电源或储能。',
		],
		price: [
			'Ready-to-build sales in 2026 were undisclosed. Gore Street’s figure of about £84k/MW for pre-construction rights includes Irish rights.',
			'2026年的可开工项目交易均未披露价格。Gore Street约每MW 8.4万英镑的施工前并网权估值中包含爱尔兰项目。',
		],
		siteValue: null,
		changeIf: [
			'System operators finding ample capacity for new demand near Dublin, or a disclosed ready-to-build price.',
			'若系统运营商评估认为都柏林附近有充足容量接纳新负荷，或出现已披露的可开工项目价格。',
		],
		sources: [SRC.ieEcp, SRC.ieLeu, SRC.ieRtb, SRC.gsfRights],
	},
	fi: {
		outlook: 'holding',
		evidence: 'fair',
		call: [
			'The value holds until 2029. Fingrid restricts new storage connections in the south to keep capacity for consumption and industry, so a southern connection held today is scarce; the north is open.',
			'价值在2029年前保持。Fingrid限制南部新增储能并网，为用电增长和工业保留容量，因此目前已持有的南部并网权稀缺；北部仍可接入。',
		],
		trend: [
			'New storage connections in southern Finland are restricted until 2029, when the Hikiä–Toivila reinforcement completes. More than 30,000 MW of storage requests compete for about 1,800 MW contracted, while several thousand MW are available in Ostrobothnia and the north.',
			'芬兰南部新增储能并网受限至2029年Hikiä–Toivila加强工程完工。超过30,000MW的储能申请对应约1,800MW已签约容量，而奥斯特罗波的尼亚和北部仍有数千MW可用。',
		],
		price: [
			'Ready-to-build sales in 2026 (Luxcara, Foresight, Nala) did not disclose prices. A binding Fingrid connection agreement is the headline term in each.',
			'2026年的可开工项目交易（Luxcara、Foresight、Nala）均未披露价格，每笔交易都以具有约束力的Fingrid并网协议为核心条款。',
		],
		siteValue: null,
		changeIf: [
			'Fingrid lifting the southern restriction early would lower the value; extending it beyond 2029 would raise it.',
			'若Fingrid提前解除南部限制，价值下降；若限制延长至2029年以后，价值上升。',
		],
		sources: [SRC.fingrid, SRC.fiRtb],
	},
	jp_tokyo: {
		outlook: 'rising',
		evidence: 'thin',
		call: [
			'Tokyo is the largest demand area, and a cap of eleven concurrent studies per operator slows new entrants. A firm connection here is the hardest piece of a project to replace.',
			'东京是最大的负荷中心，每个运营方同时进行的并网研究以十一项为上限，延缓了新进入者。在这里，固定并网是项目中最难替代的部分。',
		],
		trend: JP_TREND,
		price: JP_PRICE,
		siteValue: null,
		changeIf: [
			'Disclosed sales of connection rights in the TEPCO area, or study caps lifted once speculative applications clear.',
			'东京电力辖区出现已披露的并网权交易，或投机性申请清退后研究上限被取消。',
		],
		sources: [SRC.tepcoCap, SRC.jpLadder, SRC.jpSale],
	},
	jp_kyushu: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Kyushu’s solar surplus keeps batteries useful, and connection is rationed by an eight-study cap rather than by capacity. A held connection keeps its value but does not gain.',
			'九州的光伏过剩使储能持续有用，而并网是通过八项研究上限而非容量来配给的。已持有的并网点保值但不增值。',
		],
		trend: JP_TREND,
		price: JP_PRICE,
		siteValue: null,
		changeIf: [
			'Curtailment falling as interconnectors to Honshu expand would reduce what charging is worth here. A disclosed rights sale would set a price.',
			'若通往本州的联络线扩容使弃电减少，本地充电的价值将下降；出现已披露的权利交易，则可形成价格。',
		],
		sources: [SRC.kyudenCap, SRC.jpLadder, SRC.jpSale],
	},
	jp_hokkaido: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Firm connections are scarce, but early connection on charging-control terms at 27 systems gives a cheaper non-firm route. That route caps what a firm connection can command.',
			'固定并网稀缺，但在二十七个指定系统上可按充电控制条件提前并网，提供了更便宜的非固定接入途径，这限制了固定并网的溢价空间。',
		],
		trend: JP_TREND,
		price: JP_PRICE,
		siteValue: null,
		changeIf: [
			'Firm capacity released at more systems would lower the value; the charging-control route closing to new entrants would raise it.',
			'若更多系统释放固定容量，价值下降；若充电控制途径不再向新进入者开放，价值上升。',
		],
		sources: [SRC.hepcoCap, SRC.hepcoCharge, SRC.jpLadder],
	},
	pjm: {
		outlook: 'rising',
		evidence: 'fair',
		call: [
			'Batteries queue far beyond what PJM can study and connect, and existing Capacity Interconnection Rights can now pass to a replacement resource. A connected site therefore carries a right it can hand on.',
			'排队的储能远超PJM的研究和接入能力，而现有容量并网权（CIR）现在可以转给替代机组。因此已并网场址持有一项可以传承的权利。',
		],
		trend: [
			'FERC accepted PJM’s replacement-generation process from 30 January 2026. Capacity Interconnection Rights end one year after a unit deactivates unless a replacement or new request uses them, and they may be transferred to a third party.',
			'FERC批准PJM的替代机组并网程序，自2026年1月30日起生效。机组退役一年后，若无替代机组或新申请使用，容量并网权即告终止；该权利可转让给第三方。',
		],
		price: [
			'No public price for the rights. As a measure of what a new entrant pays to get one, Transition Cycle 1 batteries were allocated network upgrades averaging $206/kW.',
			'该权利尚无公开价格。作为新进入者取得该权利所付代价的参照，第一过渡周期储能项目分摊的电网升级费用平均为每kW 206美元。',
		],
		siteValue: null,
		changeIf: [
			'Cycle 1 delivering agreements to most of the queued storage within two years would reduce the scarcity.',
			'若第一周期在两年内向大部分排队储能发放并网协议，稀缺程度将下降。',
		],
		sources: [SRC.pjmQueue, SRC.pjmReplace, SRC.pjmCosts],
	},
	ercot: {
		outlook: 'falling',
		evidence: 'fair',
		call: [
			'For storage the value is falling. Connection is open under connect-and-manage and battery revenue has fallen sharply as the fleet grew, so a connection is worth little more than the time it saves. Co-location with large new loads is the upside.',
			'对储能而言价值下降。在“先接入、后管理”模式下并网是开放的，而随着储能规模扩大，收入大幅下滑，因此并网权的价值基本只等于其节省的时间。上行空间在于与大型新负荷共址。',
		],
		trend: [
			'Average ERCOT battery revenue fell to $24/kW-year in 2026 to mid-August, from $193/kW-year in 2023. The large-load queue is about 474 GW, around 90% of it data centres, and data-centre interconnections were paused on 3 August 2026 pending an audit.',
			'2026年截至8月中旬，ERCOT储能平均收入降至每kW每年24美元，2023年为193美元。大负荷并网队列约474GW，其中约90%为数据中心；2026年8月3日起数据中心并网暂停，等待审查。',
		],
		price: [
			'Enerdatics counts five development-stage battery deals in ERCOT since 2024, at $29–74k/MW.',
			'据Enerdatics统计，2024年以来ERCOT有五笔开发阶段储能交易，价格为每MW 2.9–7.4万美元。',
		],
		siteValue: SITE_VALUE.ercot,
		changeIf: [
			'Large-load rules that favour sites with existing generation or storage would turn a connection into a co-location asset and lift its value.',
			'若大负荷并网规则优先考虑已有电源或储能的场址，并网点将成为共址资产，价值随之上升。',
		],
		sources: [SRC.ercotQueue, SRC.ercotRevenue, SRC.usDeals],
	},
	caiso: {
		outlook: 'holding',
		evidence: 'fair',
		call: [
			'Deliverability is finite, and CAISO is moving to let a site that retires or repowers keep it. That protects a connected site’s value.',
			'可交付容量是有限的，CAISO正推动让退役或改造的场址保留这一容量，从而保护已并网场址的价值。',
		],
		trend: [
			'Cluster 15 drew about 347 GW of requests from 541 projects. CAISO’s June 2026 final proposal keeps interconnection service and deliverability for units that retire or repower.',
			'第15批次共收到541个项目约347GW的并网申请。CAISO于2026年6月提出的最终方案为退役或改造机组保留并网服务和可交付容量。',
		],
		price: [
			'One development-stage deal at $400k/MW (Enerdatics). That is a single point, not a market price.',
			'一笔开发阶段交易为每MW 40万美元（Enerdatics），属单一数据点，不构成市场价格。',
		],
		siteValue: null,
		changeIf: [
			'The final retention rule narrowing what a retiring unit keeps, or a run of disclosed site sales.',
			'若最终保留规则收窄退役机组可保留的权利，或出现一系列已披露的场址交易。',
		],
		sources: [SRC.caisoC15, SRC.caisoRetain, SRC.usDeals],
	},
	nem: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Inside renewable energy zones access is rationed through paid access rights; elsewhere it is open but carries connection-study risk. A site with approved access and performance standards keeps its value, without a clear rise.',
			'在可再生能源区内，接入通过付费接入权配给；区外接入开放，但存在并网研究风险。已获批接入及性能标准的场址保值，但无明显上升。',
		],
		trend: [
			'NSW allocates access rights in its renewable energy zones. Central-West Orana granted 7.15 GW to ten projects, which pay an annual access fee per connection point once commissioning starts.',
			'新南威尔士州在可再生能源区内分配接入权。中西部奥拉纳区向十个项目授予7.15GW接入权，项目自开始调试起按并网点缴纳年度接入费。',
		],
		price: [
			'Ready-to-build sales, such as a 250 MW / 1 GWh Riverina project, were undisclosed.',
			'可开工项目交易均未披露价格，例如里弗赖纳一个250MW/1GWh项目。',
		],
		siteValue: null,
		changeIf: ['Access fees for storage set high in the next zones, or a disclosed ready-to-build price.', '后续可再生能源区对储能设定较高的接入费，或出现已披露的可开工项目价格。'],
		sources: [SRC.nemAccess, SRC.nemScheme, SRC.nemRtb],
	},
	wa: {
		outlook: 'peaking',
		evidence: 'fair',
		call: [
			'A connection with network access holds a premium until the Clean Energy Link projects relieve the export limits, expected at the end of 2029. After that the premium eases.',
			'在清洁能源连接项目缓解外送限制之前（预计2029年底），拥有网络接入量的并网点保有溢价；此后溢价回落。',
		],
		trend: [
			'Network access quantities cap export in the constrained areas until the transmission relief arrives. Western Power’s Clean Energy Link program is the named relief, with its scope and timing set in the Transmission System Plan.',
			'在输电加强工程投运之前，网络接入量限制受约束区域的外送。Western Power的清洁能源连接计划是指定的缓解工程，其范围和时间见输电系统规划。',
		],
		price: ['No public price for a connection right.', '并网权尚无公开价格。'],
		siteValue: null,
		changeIf: ['A delay to the Clean Energy Link would extend the premium; early relief would end it sooner.', '清洁能源连接工程延误会延长溢价期；提前投运则会使溢价更早消失。'],
		sources: [SRC.waTsp, SRC.waCel],
	},
	ca_on: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'Ontario buys storage through 20-year IESO contracts, so the value sits in the contract rather than the connection. LT2 drew more capacity than its target, at lower prices than the last round.',
			'安大略通过IESO的20年期合同采购储能，价值在合同而非并网权本身。LT2吸引的容量超过目标，价格低于上一轮。',
		],
		trend: [
			'In June 2026 the IESO awarded three new battery projects 640 MW of 20-year capacity contracts in LT2, against a 600 MW target. The weighted price was about 36% below the previous round.',
			'2026年6月，IESO在LT2中向三个新建储能项目授予640MW的20年期容量合同，目标为600MW，加权价格比上一轮低约36%。',
		],
		price: ['No public price for a connection right.', '并网权尚无公开价格。'],
		scarcity: [
			'Not graded. Connection follows the IESO contract, and no public measure of connection scarcity has been found.',
			'未评级。并网跟随IESO合同，目前未找到衡量并网稀缺程度的公开指标。',
		],
		siteValue: null,
		changeIf: ['An IESO round that falls short of its target would make held connections scarcer.', '若某轮IESO采购未达目标，已持有的并网点将更为稀缺。'],
		sources: [SRC.ieso, SRC.iesoPrice],
	},
	sa: {
		outlook: 'holding',
		evidence: 'thin',
		call: [
			'The value is tied to the contract. SPPC buys storage on 15-year build-own-operate agreements and the connection comes with the award, so there is no separate market for a connection right.',
			'价值与合同绑定。SPPC以15年期建设—拥有—运营协议采购储能，并网随中标一并取得，因此不存在独立的并网权市场。',
		],
		trend: [
			'SPPC signed four 15-year storage service agreements in August 2026 for 2 GW / 8 GWh, and is qualifying bidders for a second round of 3 GW / 12 GWh.',
			'SPPC于2026年8月签署四份15年期储能服务协议，共2GW/8GWh，并正在为第二轮3GW/12GWh招标进行资格预审。',
		],
		price: ['No market for connection rights.', '不存在并网权市场。'],
		scarcity: [
			'Not graded. The single buyer allocates the connection with the contract.',
			'未评级。由单一购买方随合同分配并网。',
		],
		siteValue: null,
		changeIf: ['SPPC terms that let an owner re-contract or sell services after year 15.', 'SPPC条款允许业主在第15年后重新签约或出售服务。'],
		sources: [SRC.sppc],
	},
};

export const connectionOutlookFor = (marketId) => CONNECTION_OUTLOOK[marketId] || null;
