/* The small-connection route in every market: NEM Sub-5 and its analogues.
   Research cut 26 November 2026 (docs/sub5-small-connection-plan-2026-11-26.md,
   section 3). A priced route names its special-opportunity card, and every
   figure shown for it is read from compareOpportunity(); the text here carries
   only rules and market facts, never a model result.

   kind:  priced   a small-route card the engine prices against the conventional play
          contract a contract-backed route that waits for an awarded price
          gate     a possible route that waits for a published position
          pending  blocked until a named decision
          watch    a program not yet open to standalone storage
          permit   a lighter permit only; the connection is unchanged
          none     no small route worth a fund's time */
import { connectionNotes } from './connectionNotes.js';

export const SMALL_ROUTE_RESEARCH_DATE = '2026-11-26';

const jp = (area) => ({
	kind: 'priced',
	opportunity: 'jp-' + area + '-small',
	avoids: [
		'A battery under 2 MW stays on the high-voltage network instead of an extra-high-voltage connection, and since April 2026 units under 50 kW can be aggregated for the balancing market. It gives up the long-term auction, so it earns trading and balancing revenue only.',
		'低于 2 MW 的储能接入高压电网，无需特高压接入；自 2026 年 4 月起，低于 50 kW 的单元还可聚合参与平衡市场。该路径放弃长期脱碳电源拍卖，只赚取交易与平衡服务收入。',
	],
	evidence: 'thin',
	changesIf: [
		'Two disclosed small high-voltage sites with their duration, and the balancing-market rules for aggregated low-voltage units.',
		'两个披露时长的小型高压项目，以及低压聚合单元参与平衡市场的规则。',
	],
	sources: [
		[['Grid access rules (OCCTO)', '电网接入规则（OCCTO）'], 'https://www.occto.or.jp/access/'],
		[['Low-voltage aggregation pilot', '低压聚合试点'], 'https://japanenergyhub.com/news/gates-low-voltage-bess/'],
	],
});

const permit = (id, title, avoids, changesIf, extra = []) => ({
	kind: 'permit',
	title,
	status: ['A lighter permit, not a faster connection.', '许可更轻，接入并不更快。'],
	rule: connectionNotes[id].text,
	avoids,
	evidence: 'thin',
	changesIf,
	sources: [[['Permit rule', '许可规则'], connectionNotes[id].source], ...extra],
});

export const SMALL_ROUTES = {
	nem: {
		kind: 'priced',
		opportunity: 'nem-sub5',
		avoids: [
			'Each system under 5 MW is exempt from AEMO registration and generator performance standards, connects to the distribution network near a zone substation and sells through an aggregator. It gives up regulation FCAS and the Capacity Investment Scheme, whose tenders need 30 MW.',
			'每套低于 5 MW 的系统免于 AEMO 注册和发电机性能标准，就近接入配网区域变电站，由聚合商代为交易。该路径放弃调节类调频服务和容量投资计划（招标门槛为 30 MW）。',
		],
		evidence: 'thin',
		changesIf: [
			'A published small-site quote or a verified tariff credit for evening exports. AEMO’s draft report on registration exemptions, due 18 December 2026, may raise the battery threshold to 15 MW.',
			'披露的小型储能报价，或经核实的晚高峰送电配网抵扣。AEMO 关于注册豁免的征求意见稿预计 2026 年 12 月 18 日发布，可能将储能门槛提高到 15 MW。',
		],
		sources: [
			[['Small resource aggregators (AEMO)', '小型资源聚合商（AEMO）'], 'https://aemo.com.au/-/media/files/electricity/nem/participant_information/registration/2024/registration-fact-sheet-nem-small-resource-aggregators.pdf'],
			[['Exemption guide review (AEMO)', '注册豁免指引修订（AEMO）'], 'https://www.aemo.com.au/consultations/current-and-closed-consultations/guide-to-registration-exemptions-and-production-unit-classifications'],
			[['Sub-5 build timing', 'Sub-5 建设工期'], 'https://enervest.com.au/sub-5-projects/'],
		],
	},
	ercot: {
		kind: 'priced',
		opportunity: 'ercot-small-dg',
		avoids: [
			'A distribution generator up to 10 MW skips the ERCOT transmission queue, where the median battery now waits 4.4 years from queue entry to operation. Twelve of the 20 batteries that began operating in Q2 2026 were 9.9 MW sites.',
			'10 MW 以内的配网电源可绕开 ERCOT 输电排队；储能项目从入队到投运的中位时长已达 4.4 年。2026 年第二季度投运的 20 座储能中，有 12 座为 9.9 MW 项目。',
		],
		evidence: 'thin',
		changesIf: [
			'Two disclosed 9.9 MW projects with their duration, utility charges and lease or toll terms.',
			'两个披露时长、配网费用及租赁或托管条款的 9.9 MW 项目。',
		],
		sources: [
			[['Distribution generation registration (ERCOT)', '配网电源注册（ERCOT）'], 'https://www.ercot.com/services/rq/re/dgresource'],
			[['Texas buildout and small sites', '得州储能投运与小型项目'], 'https://modoenergy.com/research/en/ercot-bess-buildout-16-gw-q2-2026-growth-slowing'],
		],
	},
	ro: {
		kind: 'priced',
		opportunity: 'ro-sub5',
		avoids: [
			'Projects under 5 MW stay outside the grid-capacity auction ANRE introduced for 2026, and its €20,000/MW participation guarantee. They still pay for ATR studies and local works.',
			'低于 5 MW 的项目不参加 ANRE 自 2026 年实行的电网容量拍卖，也无需缴纳每 MW 两万欧元的参拍保证金，但仍需承担 ATR 研究和当地接入工程费用。',
		],
		evidence: 'fair',
		changesIf: [
			'The first auction clearing prices. Once a project of 5 MW or more carries that cost, the small route’s advantage shows in the comparison.',
			'首轮拍卖的出清价格。一旦 5 MW 及以上项目须承担这笔成本，小型路径的优势就会在比较中体现。',
		],
		sources: [
			[['Grid-capacity auction (CMS)', '电网容量拍卖（CMS）'], 'https://cms.law/en/rou/legal-updates/romania-s-energy-authority-amends-electricity-grid-capacity-allocation-mechanism'],
			[['2026 auction guarantee (CMS)', '2026 年拍卖保证金（CMS）'], 'https://cms.law/en/rou/legal-updates/romania-tightens-electricity-grid-access-and-licensing'],
		],
	},
	jp_tokyo: jp('tokyo'),
	jp_kyushu: jp('kyushu'),
	jp_hokkaido: jp('hokkaido'),
	pjm: {
		kind: 'contract',
		title: ['State distributed-storage contracts', '州级配网储能合同'],
		status: ['A contracted small route, not yet priced.', '有合同支撑的小型路径，尚未定价。'],
		rule: [
			'Maryland targets 150 MW of distribution-connected storage through competitive utility procurement: 50 MW by November 2027 and 150 MW by November 2028. New Jersey’s Phase 2 program pays fixed and performance incentives to distributed storage.',
			'马里兰州计划通过电网公司竞争性采购建设 150 MW 配网储能：2027 年 11 月前 50 MW，2028 年 11 月前 150 MW。新泽西州第二阶段计划向分布式储能支付固定与绩效激励。',
		],
		avoids: [
			'A distribution site avoids the PJM queue and holds a state contract, which the NEM and Texas small routes lack.',
			'配网项目可绕开 PJM 排队，并取得州级合同；澳大利亚和得州的小型路径都没有这类合同。',
		],
		evidence: 'fair',
		changesIf: [
			'An awarded contract price per kW-year and its term, from a Maryland tranche or the New Jersey final order.',
			'马里兰州某批次的中标价格，或新泽西州最终命令中的每 kW 年合同价格及期限。',
		],
		sources: [
			[['Energy storage (Maryland PSC)', '储能（马里兰州公用事业委员会）'], 'https://psc.maryland.gov/regulated-utilities/electricity/renewable-energy/energy-storage/'],
			[['Phase 2 storage program (NJBPU)', '第二阶段储能计划（NJBPU）'], 'https://www.nj.gov/bpu/pdf/publicnotice/Phase2%20Block1_Sep%202026%20Public%20Stakeholder%20Meeting.pdf'],
		],
	},
	fi: {
		kind: 'gate',
		title: ['Under 5 MW on a distribution network', '配网接入的 5 MW 以下储能'],
		status: ['A possible way round the southern restriction, not yet priced.', '可能绕开南部接入限制的路径，尚未定价。'],
		rule: [
			'Fingrid restricts new storage connections in southern Finland until 2029, and every storage project above 5 MW must send it a connection inquiry. 56% of Finnish storage already sits on distribution networks.',
			'Fingrid 在 2029 年前限制芬兰南部新增储能接入，且所有 5 MW 以上储能项目都须向其提交接入询问。芬兰已有 56% 的储能接入配网。',
		],
		avoids: [
			'A sub-5 MW battery on a distributor’s network stays below the inquiry threshold. Whether a southern distributor will connect it while the restriction holds is unconfirmed.',
			'接入配网的 5 MW 以下储能低于询问门槛。限制期间南部配网公司是否接受接入，尚未确认。',
		],
		evidence: 'thin',
		changesIf: [
			'A southern distributor’s published position on small storage connections, with its storage tariff.',
			'南部配网公司对小型储能接入的公开立场及其储能费率。',
		],
		sources: [
			[['Southern connection restriction (Fingrid)', '南部接入限制（Fingrid）'], 'https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland'],
			[['Storage connection principles (Fingrid)', '储能接入原则（Fingrid）'], 'https://www.fingrid.fi/en/news/news/2024/changes-to-the-main-grid-fees-and-connection-principles-for-electricity-storages/'],
		],
	},
	caiso: {
		kind: 'pending',
		title: ['Rule 21 Fast Track, up to 5 MVA', 'Rule 21 快速通道（5 MVA 以内）'],
		status: ['Blocked above 1 MVA until the CPUC rules.', '在 CPUC 裁决前，1 MVA 以上项目受阻。'],
		rule: [
			'Rule 21 lets a distribution project up to 5 MVA take Fast Track review, but CAISO requires any wholesale-exporting project above 1 MVA to interconnect under its own tariff.',
			'Rule 21 允许 5 MVA 以内的配网项目走快速审查，但 CAISO 要求 1 MVA 以上、向批发市场送电的项目按其自身规则接入。',
		],
		avoids: [
			'A 1–5 MVA wholesale battery would skip the CAISO queue. Today it cannot.',
			'1–5 MVA 的批发市场储能本可绕开 CAISO 排队，但目前不行。',
		],
		evidence: 'thin',
		changesIf: [
			'A CPUC decision in R.25-08-004 that raises the Screen Q threshold from 1 to 5 MVA.',
			'CPUC 在 R.25-08-004 中将 Screen Q 门槛从 1 MVA 提高到 5 MVA 的决定。',
		],
		sources: [
			[['Rule 21 rulemaking (CPUC)', 'Rule 21 规则制定（CPUC）'], 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/rule-21-interconnection/rulemaking-and-regulatory-history'],
		],
	},
	ca_on: {
		kind: 'watch',
		title: ['Local Generation Program, 100 kW–10 MW', '本地发电计划（100 kW–10 MW）'],
		status: ['A program to watch; standalone storage is not yet eligible.', '值得跟踪的计划；独立储能尚不符合资格。'],
		rule: [
			'The IESO is designing a competitive program for distribution-connected resources of 100 kW to 10 MW that stay outside the market. Facilities over 10 MW typically need connection impact assessments.',
			'IESO 正在设计面向 100 kW 至 10 MW、不参与市场的配网资源的竞争性计划。10 MW 以上设施通常需要接入影响评估。',
		],
		avoids: [
			'A site under 10 MW would avoid the connection impact assessment. Storage is confirmed only as an addition to an existing facility.',
			'10 MW 以下项目可免于接入影响评估。目前仅确认储能可作为既有设施的扩建部分参与。',
		],
		evidence: 'thin',
		changesIf: ['Program documents that admit standalone storage.', '明确允许独立储能参与的计划文件。'],
		sources: [
			[['Local Generation Program (IESO)', '本地发电计划（IESO）'], 'https://ieso.ca/Sector-Participants/Engagement-Initiatives/Engagements/Local-Generation-Program'],
		],
	},
	pl: permit(
		'pl',
		['Storage register below 10 MW', '10 MW 以下储能登记'],
		[
			'It avoids the storage licence. It does not avoid the distribution connection, which is the binding constraint.',
			'可免于储能许可证，但无法绕开配网接入，而接入才是真正的约束。',
		],
		[
			'Evidence that small storage connects faster or more cheaply, such as a connection-fee relief limited by size.',
			'小型储能接入更快或更便宜的证据，例如按规模限定的接入费减免。',
		],
	),
	it: permit(
		'it',
		['Free-activity permit below 10 MW', '10 MW 以下自由建设程序'],
		[
			'It avoids the single authorisation. It does not avoid the TICA connection, and balancing access through aggregated units is unverified.',
			'可免于单一授权，但仍须取得 TICA 接入；聚合单元参与平衡市场的资格尚未核实。',
		],
		[
			'A connection or market-access advantage for small units, beyond the lighter permit.',
			'小型单元在接入或市场准入上的优势，而不仅是许可更轻。',
		],
		[[['Storage permitting in Italy', '意大利储能许可'], 'https://www.osborneclarke.com/insights/battery-energy-storage-systems-bess']],
	),
	es: permit(
		'es',
		['Regional authorisation up to 50 MW', '50 MW 以下由自治区审批'],
		[
			'It moves the permit from the ministry to the region, which handled 66 of 87 storage projects in Q3 2026. It does not avoid access and connection rights, which are the binding constraint.',
			'审批从中央部委转到自治区；2026 年第三季度，自治区处理了 87 个储能项目中的 66 个。但无法绕开电网准入与接入权，而这才是真正的约束。',
		],
		[
			'Evidence that small projects obtain access and connection rights faster.',
			'小型项目更快取得电网准入与接入权的证据。',
		],
		[[['Spain storage approvals, Q3 2026', '西班牙 2026 年第三季度储能审批'], 'https://www.ess-news.com/2026/10/21/spain-advances-1-9-gw-of-energy-storage-projects/']],
	),
	wa: permit(
		'wa',
		['Small facility below 10 MW', '10 MW 以下小型设施'],
		[
			'It can avoid market registration. Whether an unregistered sub-5 MW battery can earn capacity credits, the line the WA case rests on, is unverified.',
			'可免于市场注册。但未注册的 5 MW 以下储能能否取得容量信用尚未核实，而西澳方案正依赖这条收入。',
		],
		['Confirmation that a small battery can hold capacity credits.', '确认小型储能可以持有容量信用。'],
	),
	gb: {
		kind: 'none',
		title: ['No size route', '无规模门槛路径'],
		status: ['No small route worth a fund’s time.', '没有值得基金投入的小型路径。'],
		rule: [
			'Only projects below the Transmission Impact Assessment limit, 1 MW in England and Wales and 200 kW in Scotland, skip a Gate 2 application, and batteries are already oversupplied against the 2030 range.',
			'只有低于输电影响评估门槛的项目（英格兰和威尔士为 1 MW，苏格兰为 200 kW）可免于 Gate 2 申请，而储能相对 2030 年规划区间已经过剩。',
		],
		sources: [
			[['Connections reform and battery capacity', '接入改革与储能容量'], 'https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity'],
		],
	},
	ie: {
		kind: 'none',
		title: ['No size route', '无规模门槛路径'],
		status: ['No small route worth a fund’s time.', '没有值得基金投入的小型路径。'],
		rule: [
			'No size threshold was found: the batch connection process that replaced the old gate applies to every project.',
			'未发现规模门槛：取代旧批次制度的集中接入流程适用于所有项目。',
		],
		sources: [],
	},
	de: {
		kind: 'none',
		title: ['No size route', '无规模门槛路径'],
		status: ['No small route worth a fund’s time.', '没有值得基金投入的小型路径。'],
		rule: [
			'Germany has no size threshold. Developers target 10–30 MW medium-voltage sites for shorter development, and flexible connection agreements are the route to watch.',
			'德国没有规模门槛。开发商以 10–30 MW 的中压项目缩短开发周期，灵活接入协议是值得跟踪的路径。',
		],
		sources: [
			[['Grid connection for storage (Rödl & Partner)', '储能并网（Rödl & Partner）'], 'https://www.roedl.com/en/insights/germany-battery-storage-energy-transition-grid-connection-regulation-economic-risks-challenges-storage-projects/'],
		],
	},
	sa: {
		kind: 'none',
		title: ['No size route', '无规模门槛路径'],
		status: ['No small route worth a fund’s time.', '没有值得基金投入的小型路径。'],
		rule: [
			'A single buyer procures storage through state rounds, so there is no small route to enter.',
			'储能由单一购买方通过国家轮次采购，因此不存在可进入的小型路径。',
		],
		sources: [],
	},
};

export const smallRouteFor = (marketId) => SMALL_ROUTES[marketId] ?? null;
