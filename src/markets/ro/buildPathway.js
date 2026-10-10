/* ---------------------------------------------------------------------------
   Romania — how a BESS actually gets built.

   DRAFT FOR THE ANALYST. Reconstructed on 2026-10-11 from the Official Gazette
   texts of ANRE Orders 53/2024, 79/2025 and 15/2026, Transelectrica's
   allocation procedure of June 2026 and ANRE's press release of 21 May 2026,
   all opened and read in Romanian. What was not opened is named in `limit`
   and in the stage notes.

   WHAT MAKES ROMANIA DISTINCTIVE is that the connection right is now BOUGHT,
   ONCE A YEAR, TWO YEARS AHEAD. From 1 January 2026 a site of 5 MW or more,
   standalone storage included, reaches a technical connection permit (ATR)
   only through a capacity auction:

     · The calendar is fixed by order. From 2027: capacity published by
       15 January, requests by the end of February, the system study by
       15 June, daily auction sessions from 1 July.
     · Each auction allocates capacity for a ten-year period that begins two
       years after the auction year. A request names the commissioning year
       it wants, and the earliest it can name is that second year.

   So Romania has what Western Australia has and Finland does not: a calendar
   gate. The difference is where it sits. Western Australia's annual cycle
   decides capacity revenue for a plant that can otherwise proceed; Romania's
   decides whether there is a connection at all. Missing the February deadline
   costs a year of the whole project.

   THE SECOND FACT is that the sequence after the permit is policed by
   deadline rather than by order. The building permit and ANRE's establishment
   authorisation must both be in hand within 12 months of the connection
   contract and 18 months of the ATR. Miss either and the ATR lapses, the
   connection contract ends by operation of law and the connection guarantee
   is called. This is the anti-speculation reform, and it is why a Romanian
   programme has a long-stop where the others have a gate.

   2026 is a transition year and nothing has cleared yet. Requests were taken
   from 1 to 14 July and the first sessions are scheduled from 30 October, so
   there is no auction price, no observed time from contract to ATR and no
   precedent for how the deadlines are applied.
   --------------------------------------------------------------------------- */
import { OWNER, DURATION_BASIS } from '../../governance/buildPathway.js';

export const RO_BUILD_PATHWAY = {
  marketId: 'ro',

  summary: [
    'A connection is bought at an annual auction, for a year at least two years out. From 2026 a site of 5 MW or more reaches a technical connection permit (ATR) only by winning capacity at Transelectrica\'s auction: requests by the end of February, sessions from 1 July, capacity allocated from the second year after. What follows runs against a long-stop rather than in a fixed order: the building permit and ANRE\'s establishment authorisation must both be obtained within 12 months of the connection contract and 18 months of the ATR, or the permit lapses and the connection guarantee is called. There is no capacity mechanism, so no revenue calendar sits on top.',
    '并网权要靠年度拍卖买到，而且买到的最早也是两年之后的年份。自2026年起，装机5MW及以上的场址只有在Transelectrica的拍卖中拍得容量，才能取得技术并网许可（ATR）：2月底前提交申请，7月1日起开拍，所分配的容量自拍卖后第二年起算。此后的各环节不是按固定顺序推进，而是受最后期限约束：建设许可与ANRE设立许可须在并网合同签订后12个月内、且在ATR签发后18个月内取得，否则ATR失效，并网保函被执行。罗马尼亚没有容量机制，因此不存在另一份收入日程。',
  ],

  limit: [
    'The published framework, not a project plan. Auction bids beyond the published results, solution studies and correspondence with Transelectrica or a distribution operator are not public. No auction had cleared when this was drafted, so there is no price, and no elapsed time from allocation contract to ATR, to infer from. The consolidated Connection Regulation (Order 59/2013), the licensing regulation behind the establishment authorisation, the technical connection norms and the balancing prequalification rules were not opened: where a stage rests on them its duration is convention and its note says so. Order 53/2024 was read as first published, with the later changes taken from Orders 79/2025 and 15/2026 rather than from a consolidated text. This describes a standalone project above 5 MW; storage added behind an existing connection follows the same auction for any increase in export capacity, and that route is not worked through here.',
    '此为公开框架而非项目计划。除已公布的拍卖结果外，竞价情况、方案研究以及与Transelectrica或配电运营商的往来函件均不公开。起草本文时尚无任何一场拍卖成交，因此既没有价格，也没有从分配合同到ATR的实际耗时可供推断。合并版《并网规章》（第59/2013号令）、设立许可所依据的许可规章、并网技术规范以及平衡服务预审规则均未打开：凡依赖这些文件的阶段，其耗时均为行业惯例，并已在说明中注明。第53/2024号令读的是最初公布的文本，后续修改取自第79/2025号令和第15/2026号令，而非合并文本。本路径针对5MW以上的独立项目；在既有并网点后加装储能的，其新增送出容量同样须经拍卖，该路径此处未展开。',
  ],

  /* THREE GATES, ALL PUBLISHED BY ORDER.

     The first two are documents the connection request cannot be filed
     without. The third is the anti-speculation rule and runs the other way
     from Finland's: consent is not needed to reach the permit, but the permit
     does not survive without it. It is modelled as an edge into construction
     because the instrument it gates is the execution contract for the
     connection works. The 12- and 18-month long-stop is in the consent stage.

     The first two were read through the amending order: Order 53/2024 adds the
     allocation contract to article 13 of the Connection Regulation and rewrites
     the land document in article 14. The consolidated articles were not opened,
     so that these are the documents of the connection request is a reading. */
  prerequisites: [
    {
      id: 'ro-allocation-before-atr',
      requiresFrom: 'application',
      requires: ['Capacity allocation contract, won at the annual auction',
                 '在年度拍卖中取得的容量分配合同'],
      before: 'studies',
      instrument: ['Connection request leading to the technical connection permit (ATR)', '用以取得技术并网许可（ATR）的并网申请'],
      sourceKey: 'order53',
    },
    {
      id: 'ro-land-before-atr',
      requiresFrom: 'site',
      requires: ['Title or right of use over the land, valid to the end of the requested commissioning year',
                 '土地所有权或使用权凭证，有效期至少至所申请投运年份的年底'],
      before: 'studies',
      instrument: ['Connection request leading to the technical connection permit (ATR)', '用以取得技术并网许可（ATR）的并网申请'],
      sourceKey: 'order53',
    },
    {
      id: 'ro-consent-before-works',
      requiresFrom: 'consent',
      requires: ['Building permit and ANRE establishment authorisation',
                 '建设许可与ANRE设立许可'],
      before: 'construction',
      instrument: ['Execution contract for the connection installation', '并网设施的施工合同'],
      sourceKey: 'order15',
    },
  ],

  stages: [
    {
      id: 'site',
      owner: OWNER.SPONSOR,
      instrument: ['Ownership or a written right of use over the land, with the owner\'s consent to build where the sponsor is not the owner', '土地所有权或书面使用权；投资方非所有权人的，须取得所有权人同意建设的书面文件'],
      gate: ['Land rights that run to the end of the commissioning year, in a grid zone with capacity on offer', '在有容量可供分配的电网分区内，取得有效期覆盖至投运年年底的土地权利'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'order53',
      note: [
        'The allocation request asks only for the site\'s coordinates and grid zone; the land document is required later, with the connection request. So a sponsor can bid before the land is secured and then cannot use what it won. The auction is run by grid zone, which makes the zone a siting decision made before any capacity is known to be available. The range is convention.',
        '容量分配申请只要求填报场址坐标和所属电网分区；土地文件要到之后提交并网申请时才需要。因此投资方可以在尚未落实土地的情况下参拍，拍到之后却用不上。拍卖按电网分区进行，这意味着分区选择是在尚不知道是否有容量可拍之前就要作出的选址决定。此处区间为行业惯例。',
      ],
    },
    {
      id: 'application',
      owner: OWNER.TSO,
      instrument: ['Capacity allocation request and auction under ANRE Order 53/2024: to Transelectrica above 50 MW, to the distribution operator up to 50 MW', '依ANRE第53/2024号令提交容量分配申请并参加拍卖：50MW以上向Transelectrica提出，50MW及以下向配电运营商提出'],
      gate: ['Capacity allocation contract signed and the allocation price paid', '签署容量分配合同并付清分配价款'],
      months: [5, 11],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Development', '开发成本'],
      sourceKey: 'allocationProcedure',
      note: [
        'THE STAGE THAT RUNS ON A CALENDAR. From 2027 a request filed by the end of February reaches an auction session from 1 July; the contract follows within about ten working days and the price is payable within four months, which is the range. It does not include the wait for the window, up to a year for a project that is ready in March. Each auction allocates from the second year after it, so capacity won in 2027 is for 2029 at the earliest. Where requests in a zone do not exceed what is available, no session is held and the price is zero. The 2026 transition ran late: requests from 1 to 14 July, sessions from 30 October.',
        '这是按日历推进的阶段。自2027年起，2月底前提交的申请可参加7月1日起的拍卖；合同在其后约十个工作日内签署，价款须在四个月内付清，这就是此处区间的由来。区间不含等待窗口期的时间：3月才准备就绪的项目最多要再等一年。每场拍卖分配的是拍卖后第二年起的容量，因此2027年拍得的容量最早对应2029年。若某分区的申请量未超过可用容量，则不举行拍卖，价格为零。2026年的过渡安排整体推后：7月1日至14日受理申请，10月30日起开拍。',
      ],
    },
    {
      id: 'studies',
      owner: OWNER.TSO,
      instrument: ['Solution study, technical connection permit (ATR) and connection contract under the Connection Regulation, ANRE Order 59/2013', '依《并网规章》（ANRE第59/2013号令）开展方案研究、取得技术并网许可（ATR）并签订并网合同'],
      gate: ['Connection contract signed, with the connection guarantee posted', '签订并网合同，并已提交并网保函'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development, then capex', '先计入开发成本，后转入资本开支'],
      sourceKey: 'order53',
      note: [
        'Convention, and the weakest range in this pathway. The consolidated regulation that sets the study and permit timeframes was not opened; the one period read is that the permit is sent within ten calendar days of an approved solution study. No project has yet gone from an allocation contract to an ATR, so there is nothing to observe either. The ATR starts the 18-month clock on consent, and the guarantee of 20% of the connection tariff is posted before it is issued.',
        '此为行业惯例，也是本路径中依据最弱的一个区间。规定方案研究与许可时限的合并版规章未打开；读到的期限只有一条：方案研究获批后十个日历日内发出许可。目前尚无项目走完从分配合同到ATR的过程，因此也无从观察。ATR签发之日起，取得各项许可的18个月期限开始计算；相当于并网费20%的保函须在ATR签发前提交。',
      ],
    },
    {
      id: 'consent',
      owner: OWNER.GOVERNMENT,
      parallelWith: 'studies',
      instrument: ['Building permit from the local authority; establishment authorisation from ANRE for capacity above 1 MW', '地方机关核发的建设许可；1MW以上容量须取得ANRE设立许可'],
      gate: ['Both obtained within 12 months of the connection contract and 18 months of the ATR', '在并网合同签订后12个月内、且在ATR签发后18个月内取得上述两项许可'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Development', '开发成本'],
      sourceKey: 'order15',
      note: [
        'A LONG-STOP, NOT A STEP. Only the upper end is published: 18 months from the ATR and 12 from the connection contract, extendable once by up to 12 months where the delay is shown not to be the sponsor\'s, and by up to 60 days where ANRE already holds a complete application. The lower end is convention. Miss it and the ATR lapses, the connection contract ends by operation of law and the connection guarantee is called. An establishment authorisation carries its own guarantee of EUR 30 per kW, described in ANRE\'s press release; the licensing order behind it was not opened.',
        '这是最后期限，而不是一个步骤。已公布的只有上限：自ATR签发起18个月、自并网合同签订起12个月；能证明延误不可归责于投资方的，可延长一次，最长12个月；ANRE已收到完整申请的，可再延长最多60天。下限为行业惯例。逾期则ATR失效，并网合同依法终止，并网保函被执行。设立许可另须提交每千瓦30欧元的保函，见ANRE新闻稿；其所依据的许可规章未打开。',
      ],
    },
    {
      id: 'compliance',
      owner: OWNER.TSO,
      parallelWith: 'construction',
      instrument: ['Energisation for the test period and compliance tests under the technical connection norms; connection certificate', '试运行期送电及并网技术规范项下的符合性测试；并网证书'],
      gate: ['Connection certificate issued', '取得并网证书'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'order53',
      note: [
        'Convention. The technical norms that set the tests for storage were not opened. Nothing published was read for this stage beyond its existence: the amending orders refer to energisation for a test period and to a connection certificate, and give no period for either.',
        '此为行业惯例。规定储能测试要求的技术规范未打开。就这一阶段而言，除其存在之外未读到任何已公布的内容：修订令提到了试运行期送电和并网证书，但均未给出期限。',
      ],
    },
    {
      id: 'revenue',
      owner: OWNER.TSO,
      instrument: ['Prequalification with Transelectrica for balancing services: FCR, aFRR and mFRR', '向Transelectrica申请平衡服务预审：FCR、aFRR与mFRR'],
      gate: ['Prequalified, per service', '按服务品种通过预审'],
      months: [2, 6],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'tel',
      note: [
        'NO REVENUE CALENDAR, because there is no capacity mechanism: nothing here is auctioned years ahead and nothing can be missed by a week. That also means nothing is secured. The range is convention, and the cited register entry was not reopened for this draft; the prequalification rules themselves have not been read.',
        '这里没有收入日程，因为罗马尼亚没有容量机制：没有任何收入需要提前数年竞拍，也不存在差一周就错过的情形。这同时意味着没有任何收入是锁定的。此处区间为行业惯例；所引来源登记条目在本次起草中未重新打开，预审规则本身也尚未查阅。',
      ],
    },
    {
      id: 'procurement',
      owner: OWNER.COUNTERPARTY,
      instrument: ['EPC and equipment supply contracts; the execution contract for the connection installation', 'EPC与设备供应合同；并网设施的施工合同'],
      gate: ['Notice to proceed, with both consents in hand', '在两项许可齐备后发出开工令'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'order15',
      note: [
        'Sector convention for the range. The Romanian point is the order of signing: the building permit and the establishment authorisation are to be obtained by the date the execution contract for the connection works is concluded, so the network-side contract cannot lead the consents.',
        '区间为行业惯例。罗马尼亚的特殊之处在于签约顺序：建设许可与设立许可须在并网设施施工合同订立之日前取得，因此电网侧合同不可能先于许可签署。',
      ],
    },
    {
      id: 'construction',
      owner: OWNER.SPONSOR,
      instrument: ['Connection contract; allocation contract, which fixes the date of final energisation', '并网合同；容量分配合同（其中约定最终送电日期）'],
      gate: ['Works complete and the handover protocol signed', '工程完工并签署竣工验收纪要'],
      months: [9, 15],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'order53',
      note: [
        'The range is convention. The allocation contract fixes the year of final energisation, and lateness is priced: 0.01% of the contract value a day from the start of the following year, and termination with nothing refunded after five years. The operator owes the same daily rate if its own reinforcement is late, and may extend the connection contract in 12-month steps when it is.',
        '区间为行业惯例。容量分配合同约定了最终送电的年份，逾期有明确代价：自次年年初起按合同金额每日0.01%计罚，逾期超过五年则合同解除，已付款项不予退还。运营商自身增容工程延误的，按同一日费率向投资方支付罚金，并可按每次12个月延长并网合同。',
      ],
    },
    {
      id: 'entry',
      owner: OWNER.MARKET,
      instrument: ['Final energisation; ANRE licence for commercial operation; balancing responsibility and registration with the market operator', '最终送电；ANRE商业运营许可证；平衡责任安排及在市场运营机构注册'],
      gate: ['Licensed, energised and trading', '取得许可证、完成送电并开始交易'],
      months: [2, 6],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'anre',
      note: [
        'Convention; the licensing regulation and the market operator\'s registration rules were not opened. Final energisation is also what releases the connection guarantee, so this stage ends the exposure as well as starting the revenue.',
        '此为行业惯例；许可规章和市场运营机构的注册规则均未打开。并网保函也在最终送电时解除，因此这一阶段既是收入的起点，也是保函敞口的终点。',
      ],
    },
  ],
};

export default RO_BUILD_PATHWAY;
