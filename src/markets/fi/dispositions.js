/* ---------------------------------------------------------------------------
   FINLAND — THE SEVEN SECTIONS THAT PUBLISH NOTHING.

   The record of what was decided and why, for every section that argues nothing
   yet. Imported by the test suite and by no shipped module, so none of this
   prose reaches a reader who would never see it rendered — see the note in
   claims.js for how the bundle budget forced that split.

   The full set, published and not, is DISPOSITIONS. Coverage counts read it.
   --------------------------------------------------------------------------- */
import { READINESS } from '../../governance/claims.js';
import { CLAIMS } from './claims.js';

export const UNPUBLISHED = {
  /* ---- blocked ----------------------------------------------------------- */

  /* The section that the pilot chose Finland to test, and it comes out blocked,
     which is the correct answer rather than a disappointing one.

     A SUPPORTED CLAIM WAS AVAILABLE HERE AND IS DELIBERATELY NOT TAKEN. Two
     verified structural facts would carry one: reserves are open to storage in
     terms, and prequalification is per product with mFRR exempt. Both are true,
     both were read this week, and both are the section's CAVEAT rather than its
     argument. The section is titled "and why the revenue line is blank"; a
     claim about eligibility would answer a question it does not ask, while a
     supported badge sat above a withheld revenue line. That is precisely the
     peripheral-sentence move, and it is refused.

     THE EVIDENCE ALSO PARTLY CONTRADICTED THE SECTION, and the section was
     corrected rather than the finding softened — the forecast note had named
     the one fast product that declines and omitted the two that rise. See
     DEFECTS in sourceReview.js. Correcting misleading prose does not supply the
     missing price and eligible-versus-procured evidence, so this stays blocked. */
  services: {
    readiness: READINESS.BLOCKED,
    gaps: ['reserveRevenueGap'],
    reason: [
      'Since 2026-10-17 this section publishes a reserve level: the 2026 annual FCR-D clearing spread across the connected fleet, a floor-level observation. A supported claim about it still needs a published clearing-price series per product and an eligible-versus-procured basis, which the hourly markets would supply (gate FI-2).',
      '自2026-10-17起，本节发布备用收入水平：2026年度FCR-D出清收入按并网储能分摊，属保底水平的观测值。要就此作出有据结论，仍需按品种公布的出清价格序列及合格容量与采购容量基准，这需要小时级市场数据（研究缺口FI-2）。',
    ],
    requires: [
      'A published clearing-price series per product, and an eligible-versus-procured megawatt basis per product so the connected fleet and the obligation can be compared as like for like rather than subtracted.',
      '按品种公布的出清价格序列，以及按品种划分的合格容量与已采购容量基准，使已并网机组与需求量得以同口径比较，而非直接相减。',
    ],
  },

  /* ---- incomplete: drafted nothing, and why ------------------------------ */

  /* Every displayed figure traces to a source that could not be read. */
  energy: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'Both of this section’s sources were unreachable and every figure it shows depends on them. Nord Pool returns 403 to automated fetch, which almost certainly means the page is fine for a human and must not be replaced; the ENTSO-E record points at a portal root rather than a query, so the Finnish series cannot be reached by following the citation at all. The single bidding zone, the 15-minute market time unit and its October 2025 date, and the -500 EUR/MWh floor are all unverified.',
      '本节两个来源均无法访问，而其展示的全部数据均依赖于此。Nord Pool对自动抓取返回403，这几乎可以肯定意味着人工访问正常，故不应替换该来源；ENTSO-E记录指向门户根地址而非具体查询，因此按该引用根本无法定位芬兰数据序列。单一报价区、15分钟结算周期及其2025年10月生效日期、以及−500欧元/MWh的价格下限，均未经核验。',
    ],
    requires: [
      'A manual read of the Nord Pool market-time-unit material, and an ENTSO-E citation recording the specific Finnish day-ahead query rather than the portal root.',
      '人工查阅Nord Pool关于结算周期的材料，并将ENTSO-E引用改为记录芬兰日前电价的具体查询地址，而非门户根地址。',
    ],
  },

  /* The register defect that a link check cannot see. */
  story: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'This section cites one source and that source is a homepage. The record is titled as the Energy Authority’s national market report, but its URL is energiavirasto.fi’s front page, which carries nothing about the reliability standard, the strategic reserve position or adequacy at all. None of the three changes the section narrates is sourced: Olkiluoto 3 entering service, the reserve holding nothing since July 2022, and the move to a 15-minute market time unit on 1 October 2025. The citation returns 200 and reaches no evidence.',
      '本节仅引用一个来源，而该来源是一个首页。该记录题为能源局全国市场报告，但其URL指向energiavirasto.fi首页，该页面完全不涉及可靠性标准、战略备用状况或充裕度。本节所述三项变化均无来源支撑：Olkiluoto 3投运、战略备用自2022年7月起未持有任何容量、以及2025年10月1日转为15分钟结算周期。该引用返回200状态码，却未指向任何证据。',
    ],
    requires: [
      'The actual Energy Authority market report, identified by title and year, replacing the homepage URL; and a separate source for the market-time-unit change, which is a Nordic market matter rather than a regulator one.',
      '以能源局实际发布的市场报告（注明标题与年份）替换首页URL；并为结算周期变更单独提供来源 — 该事项属北欧市场层面而非监管机构层面。',
    ],
  },

  /* Verified mechanism, unverified everything the section displays. */
  capacity: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'The peak load capacity page was read and establishes the mechanism, its statutory basis in act 117/2011, and that its stated composition is power plants and demand-response facilities, which does not name storage. It does not establish any of the three figures this section shows: 0 MW procured for the 2025-26 period, dormant since July 2022, and the LOLE reliability standard. Those were sourced to the Energy Authority record, which turned out to be a homepage. A claim drawn from the verified half would carry a supported badge directly above three unverified numbers it says nothing about.',
      '峰荷容量页面已查阅，确立了该机制、其117/2011号法案的法定依据，以及其明示构成为发电厂与具备需求响应能力的设施 — 其中未提及储能。但该页面未能确立本节展示的三项数据：2025-26年度采购量0MW、自2022年7月起休眠、以及LOLE可靠性标准。上述数据原引自能源局记录，而该记录实为一个首页。若仅依据已核验部分提出结论，将使"有证据支持"标识直接置于三个其并未涵盖的未核验数字之上。',
    ],
    requires: [
      'The Energy Authority procurement decision for the 1 November 2025 to 31 October 2026 period, and the source stating the reliability standard in LOLE hours per year.',
      '能源局关于2025年11月1日至2026年10月31日期间的采购决定，以及载明以LOLE小时/年表示的可靠性标准的来源。',
    ],
  },

  /* Two verified grid facts, neither of which is this section's argument. */
  grid: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'The whole of this section’s argument — southern connections restricted until 2029, the restriction extended once from 2027, storage connection requests above 30,000 MW against roughly 1,800 MW contracted, and the north-to-south reinforcement — rests on a Fingrid news URL that returns 404. Two Fingrid grid pages were read in its place and neither mentions any storage connection restriction. What they do establish is different in kind: that consent must be legally valid before a connection agreement is signed, and that grid storage has its own code, SJV2024, confirmed on 20 March 2025. Both are real and neither is the scarcity argument the section makes.',
      '本节的全部论点 — 南部并网受限至2029年、该限制曾自2027年延长一次、储能并网申请超过30,000MW而已签约约1,800MW、以及由北向南的加强工程 — 均依赖于一个返回404的Fingrid新闻链接。已改为查阅两个Fingrid电网页面，二者均未提及任何储能并网限制。它们所确立的内容性质不同：并网协议签署前相关许可须已具法律效力；以及电网侧储能拥有其专属规范SJV2024，于2025年3月20日核准。上述两点均属事实，但都不是本节所主张的稀缺性论点。',
    ],
    requires: [
      'A current Fingrid statement of the southern connection restriction and its end date, and a source for the connection-request and contracted-capacity volumes, both of which are now uncited.',
      '一份关于南部并网限制及其截止时间的Fingrid现行说明，以及并网申请量与已签约容量的来源 — 目前二者均无引用支撑。',
    ],
  },

  /* Two rows verified, the premise of the table not. */
  pipeline: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'The Statkraft/OX2 rows are now verified precisely, including the site names Kannisto and Korkeamaa that the table does not yet carry. The rest is not. The Nivala and Uusikaupunki rows cite a tag index that lists neither project, so the weakest citations on the page turn out not to reach their evidence at all; and the section’s own premise, that Fingrid publishes storage capacity as an aggregate rather than a project register, was not tested against any Fingrid page.',
      'Statkraft/OX2相关行项现已获精确核验，包括本表尚未收录的场址名称Kannisto与Korkeamaa。其余部分则未获核验。Nivala与Uusikaupunki两行引用的标签索引页并未收录该两个项目，故本页最弱的来源实际上根本未指向其证据；此外，本节自身的前提 — 即Fingrid仅公布储能容量汇总值而非项目级登记册 — 未针对任何Fingrid页面进行验证。',
    ],
    requires: [
      'The individual trade-press articles for Nivala and Uusikaupunki, each with author and date, replacing the tag index; and confirmation from Fingrid of what project-level storage data it does and does not publish.',
      '以Nivala与Uusikaupunki各自的行业媒体原文（注明作者与日期）替换标签索引页；并向Fingrid确认其在项目层面公布与不公布哪些储能数据。',
    ],
  },

  /* Last, and held back on purpose. */
  home: {
    readiness: READINESS.INCOMPLETE,
    reason: [
      'Three of the four figures on this page are unverified: connected storage of 1,050 MW rests on a dead URL, the dormant adequacy mechanism on a homepage, and the southern restriction on a dead URL. Only the fast-reserve obligation is confirmed. The overview cannot be supported by summarising sections that are themselves incomplete, and it must not become the place where verified structural facts — reserve eligibility, a storage grid code, a consent sequence — are combined into an economic opportunity that no section is able to state on its own.',
      '本页四项数据中有三项未经核验：1,050MW已并网储能依赖于失效链接、容量机制休眠依赖于一个首页、南部限制依赖于失效链接。仅快速备用需求一项获得确认。概览页不能通过汇总本身即不完整的分节而获得支持；更不应成为将已核验的结构性事实 — 备用市场准入资格、储能电网规范、许可先行的流程 — 拼合成任何单一分节都无法作出的经济机会判断之处。',
    ],
    requires: [
      'The three underlying sections to reach supported first. The overview is the last thing that should become publishable, not the first.',
      '需先使上述三个相关分节达到"有证据支持"状态。概览应是最后而非最先具备发布条件的部分。',
    ],
  },
};

/** All eight analytical dispositions: the one that publishes, and the seven that do not. */
export const DISPOSITIONS = { ...CLAIMS, ...UNPUBLISHED };
