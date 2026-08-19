/* ---------------------------------------------------------------------------
   WA SECTION CLAIMS — accepted 2026-08-19.

   Three supported, five incomplete. Every supported claim rests on the ERA's
   2028/29 benchmark reserve capacity price final determination, which was
   opened and read; the evidence, locators and limits are in ./sourceReview.js.

   The five incomplete are not failures of drafting. Three depend on AEMO
   publications that return 403 to an automated fetch, one on a market study
   with no url and no named author, and one is a synthesis that cannot precede
   the sections it summarises.

   WHAT IS DELIBERATELY ABSENT FROM THE SUPPORTED THREE

   The BRCP value. It is verified ($488,500 per MW per year, Table 3) and is
   recorded in the review, but none of these three sentences needs it and a
   number invites being quoted away from the methodology that produced it.

   Any statement that the Network Access Quantity is determined annually. The
   footnote establishing the cap is cut mid-sentence at "AEMO", so the cadence
   is unverified — and the word "annually" elsewhere in the document attaches to
   the ERA setting the BRCP, not to anyone setting the NAQ. Reading it across
   would be the one-clause overreach this whole process exists to catch.
   --------------------------------------------------------------------------- */
import { READINESS, CLAIM_BASIS } from '../../governance/claims.js';

export const CLAIMS = {

  /* ---- supported --------------------------------------------------------- */

  rcm: {
    readiness: READINESS.SUPPORTED,
    /* POLICY, not measured. The sentence describes an administered
       price-setting methodology, not something observed in a market. */
    basis: CLAIM_BASIS.POLICY,
    evidence: ['brcp'],
    text: [
      'WA’s 2028/29 benchmark reserve capacity price was determined by the Economic Regulation Authority on 13 March 2026 under a benchmark methodology based on the expected cost of building and connecting a new-entrant battery to the South West Interconnected System.',
      '西澳2028-29年度基准备用容量价格由经济监管局于2026年3月13日裁定，采用以新进入者在南西互联系统建设并接入电池储能设施的预期成本为基础的基准方法。',
    ],
    /* The distinction the section caveat already makes, kept visible beside the
       claim so the two cannot drift apart. The determination says it plainly:
       the BRCP does not guarantee revenues, AEMO uses it to set the reserve
       capacity price, and it is the reserve capacity price that is paid. */
    caveat: [
      'The benchmark price is an input, not project revenue: AEMO uses the BRCP to determine the Peak and Flexible Reserve Capacity Prices, and it is the reserve capacity price that is paid to capacity providers. The determination states that the BRCP does not guarantee revenues over time, and that a project’s capacity revenue can change through the reserve capacity price, the adjustment factor for excess capacity, and the quantity of Capacity Credits allocated.',
      '基准价格是计价输入而非项目收入：AEMO以基准备用容量价格确定峰值与灵活备用容量价格，实际支付给容量提供者的是备用容量价格。该裁定明确指出，基准备用容量价格并不保证长期收入，项目的容量收入会因备用容量价格、盈余容量调整系数以及所获配容量信用数量的变化而变动。',
    ],
  },

  story: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.POLICY,
    evidence: ['brcp'],
    text: [
      'WA replaced the 160 MW open-cycle gas turbine benchmark used through 2026/27 with a 200 MW / 800 MWh battery for 2027/28, then increased the battery benchmark to six hours for 2028/29.',
      '西澳将2026-27年度之前采用的160MW开式燃气轮机基准，替换为2027-28年度的200MW/800MWh电池储能基准，并于2028-29年度将该电池基准的时长提高至六小时。',
    ],
    caveat: [
      'The ERA reports this as the reference technology behind the price, and reports the six-hour specification as a determination of the Coordinator of Energy. The change is to the benchmark used to set the price, not to what any project must build.',
      '经济监管局将其作为定价所依据的参考技术予以说明，并指出六小时规格系能源协调官的裁定。该变更针对的是用于设定价格的基准技术，而非对任何项目建设标准的要求。',
    ],
  },

  grid: {
    readiness: READINESS.SUPPORTED,
    basis: CLAIM_BASIS.POLICY,
    evidence: ['brcp'],
    /* The evidence is a footnote in the price determination rather than a
       network document, which is unusual enough to declare: the ERA states the
       NAQ rule while explaining why its benchmark battery is sited in an
       unconstrained part of the network. */
    text: [
      'WA’s Network Access Quantity framework caps the capacity credits a facility can receive according to the available network capacity at its connection point.',
      '西澳的网络接入容量框架依据设施接入点的可用网络容量，对其可获得的容量信用数量设定上限。',
    ],
    caveat: [
      'Who sets that quantity and how often is not established by this evidence and is not claimed here.',
      '该数量由谁确定、多久确定一次，现有证据尚未确立，此处亦不作主张。',
    ],
  },

  /* ---- incomplete: drafted or deferred, not published --------------------- */

  duration: {
    readiness: READINESS.INCOMPLETE,
    basis: CLAIM_BASIS.POLICY,
    evidence: ['esoo'],
    text: [
      'WA’s energy storage duration requirement rises to fourteen trading intervals for 2028/29, so four-hour assets outside the grandfathered cohort no longer meet the full-credit standard.',
      '西澳储能时长要求于2028-29年度提高至十四个交易时段，故不适用祖父条款的四小时资产已不满足全额容量信用标准。',
    ],
    blockedBy: ['aemo-access'],
    note: [
      'Drafted, not published. All four elements — fourteen intervals, the 2028/29 effective period, the grandfathering boundary and the full-credit consequence — are unverified: aemo.com.au returns 403 to an automated fetch and the archive fallback is unreachable. The price determination does not carry the duration requirement.',
      '已起草，未发布。四项要素——十四个交易时段、2028-29适用期、祖父条款边界及全额容量信用后果——均未核验：aemo.com.au对自动抓取返回403，且存档回退不可达。价格裁定文件不包含时长要求内容。',
    ],
  },

  energy: {
    readiness: READINESS.INCOMPLETE,
    basis: CLAIM_BASIS.MEASURED,
    evidence: ['qed'],
    text: [
      'WA discharge spreads fell 74% year-on-year over the same period the storage fleet grew more than fivefold, on a single year of observation.',
      '西澳放电价差同比下降74%，同期储能装机增长逾五倍，观测期仅为一年。',
    ],
    blockedBy: ['aemo-access'],
    note: [
      'Drafted with the causal reading removed — the section prose says spreads collapsed "as the fleet grew", which the evidence does not establish. Neither figure, nor whether the two are measured over comparable periods, has been verified against the quarterly report.',
      '已起草并移除因果表述——章节原文称价差随装机增长而崩塌，现有证据无法支持该因果关系。两项数值本身，以及二者观测期是否可比，均未与季度报告核验。',
    ],
  },

  fcess: {
    readiness: READINESS.INCOMPLETE,
    evidence: ['qed'],
    blockedBy: ['aemo-access'],
    note: [
      'No claim drafted. The revenue and enablement-share figures behind this section have not been read.',
      '未起草结论。本节所依据的收入与投入份额数据尚未阅读。',
    ],
  },

  pipeline: {
    readiness: READINESS.INCOMPLETE,
    evidence: ['mkt'],
    reason: [
      'Source identity unavailable.',
      '来源主体不可考。',
    ],
    note: [
      'The market study has no url and names no author. Its third-party classification requires attribution before it can support a claim, and attribution cannot be produced from the record. Identifying the underlying study is new sourcing and belongs in the research backlog.',
      '该市场研究无网址且未署名作者。其第三方来源分类要求先行标注出处方可支撑结论，而现有记录无法提供该出处。查明原始研究属于新增取证工作，应列入研究待办。',
    ],
  },

  home: {
    readiness: READINESS.INCOMPLETE,
    note: [
      'Dependency-ordered and drafted last. It synthesises six sections, of which three are now supported; a synthesis written over three accepted and three unverified inputs would be a claim about the platform rather than about the market.',
      '按依赖顺序最后起草。本节综合六个分节，其中三项现已获支持；若在三项已确认与三项未核验的基础上撰写综合结论，将成为关于平台自身而非关于市场的论断。',
    ],
  },
};
