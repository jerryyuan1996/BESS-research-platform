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

   ---------------------------------------------------------------------------
   ONLY THE PUBLISHED CLAIMS SHIP

   The three supported claims live here. The five sections that publish nothing
   live in dispositions.js, which no runtime module imports.

   The boundary is the same in every claim-enabled market. Finland forced it —
   registering all eight of its dispositions put that chunk over its budget,
   because sections rendering NOTHING were each carrying a bilingual paragraph
   explaining why. WA and PJM had the same defect and merely enough headroom to
   hide it. A reader should not download the reasoning for a claim they will
   never see.
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
};
