/* ---------------------------------------------------------------------------
   PJM SOURCE REVIEW — opened 2026-08-19.

   The capacity review needed two records aligned: the auction result and the
   collar it ran under. Only one of them opened — and it turned out to carry
   both, which is why the section is supported anyway.

   THE RESULT REVERSED THE EXPECTED WORDING. The draft phrasing prepared in
   advance said the auction "cleared within" its bounds. It did not: every price
   cleared AT the cap. Having the sentence ready before the document was read is
   exactly how that would have shipped.
   --------------------------------------------------------------------------- */
import { ACCESS } from '../../governance/sourceReview.js';

export const REVIEW = {

  bra2829: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: '2028/2029 Base Residual Auction Report',
    confirmedPublisher: 'PJM Interconnection, L.L.C.',
    confirmedDate: '14 July 2026',
    locator: 'Executive Summary, p.3-4 (clearing volumes, Table 1 narrative); planning-parameter change list, p.4; Locational Deliverability Area Definition, p.2; Map 1',
    establishes: [
      'Delivery year and auction type: the 2028/2029 Reliability Pricing Model Base Residual Auction.',
      'Planning-parameter list — "Implemented a cap of $256.75 $/MW-ICAP ($325.00 $/MW-UCAP) and a floor of $138.25 $/MW-ICAP ($175.00 $/MW-UCAP) to the VRR Curve."',
      'The same list — "This cap and floor were also in effect for the 2026/2027 and 2027/2028 BRAs. All offers below the floor were cleared, and all offers above the cap were not cleared."',
      'Table 1 narrative — "Table 1 summarizes the prices ($/MW-day UCAP) from the previous BRA and this BRA. For the 2028/2029 BRA, all prices cleared at the cap ($325.00)."',
      'The comparison is therefore unit-aligned and geography-aligned: the cap and the clearing prices are both $/MW-day UCAP, the cap applies to the VRR Curve, and the report states ALL prices cleared at it rather than an RTO figure only.',
      'For contrast, the prior year — "In the 2027/2028 BRA, the RTO cleared at the price cap of $333.44."',
      'The RTO cleared 138,317.8 MW UCAP, 6,831.3 MW UCAP below the RTO Reliability Requirement including FRR.',
      'Sixteen LDAs were modelled: MAAC, EMAAC, SWMAAC, PSEG, PS-NORTH, DPL-SOUTH, PEPCO, ATSI, ATSI-Cleveland, COMED, BGE, PPL, DAY, DOM, DEOK and JCPL.',
    ],
    doesNotEstablish: [
      'Who set the collar, or whether it required approval beyond the PJM Board. The report attributes the cap and floor to the VRR Curve implementation and names no approving body. FERC involvement is NOT established here and must not be asserted.',
      'Why the cap was set where it was. The report notes only that "A price cap below the established VRR Curve can reduce the amount of investment, and therefore supply, in the PJM region."',
      'Any battery-specific outcome. The clearing prices are market-wide; nothing here is storage-specific, and the ELCC accreditation that governs what a battery is paid for sits in a different record.',
      'That the cap CAUSED the shortage. The auction cleared below the reliability requirement and also at the cap; the report does not assert a causal link between them and neither may a claim.',
    ],
    excerpt: 'For the 2028/2029 BRA, all prices cleared at the cap ($325.00). In the 2027/2028 BRA, the RTO cleared at the price cap of $333.44.',
  },


  /* ---- opened for the batch --------------------------------------------- */

  regRedesign: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'Regulation Redesign Phase 1 Frequently Asked Questions (FAQ)',
    confirmedPublisher: 'PJM Interconnection, L.L.C.',
    confirmedDate: 'revised 4 April 2025',
    locator: 'Q1/A1 p.1; Q2/A2 p.1; Q5/A5 and Table A5 p.1-2; Q21/A21 and Q22/A22; implementation timeline rows 8-9',
    establishes: [
      'A1 — "As filed and approved by FERC, Regulation Redesign Phase 1 is scheduled to go live on Oct. 1, 2025." FERC approval IS established here, unlike the capacity collar.',
      'A5 — "Regulation Redesign Phase 1 consolidates the current RegA and RegD bidirectional signals into a single bidirectional signal that all resources assigned Regulation will follow."',
      'Table A5 row 1 — the change is from two bidirectional signals to one that all resources assigned Regulation in a market interval follow.',
      'Table A5 row 3 — performance scoring changes from accuracy, delay and precision.',
      'A21/A22 — PJM stopped the qualification test for new RegD resources on 1 Sep 2025 and retesting for existing RegD resources on 22 Sep 2025.',
      'A2 — RegUp and RegDn arrive in Phase 2, also FERC-approved, going live 1 Oct 2026.',
      'Timeline — Phase 1 market opened 25 Sep 2025; cutover 1 Oct 2025 at 00:00.',
    ],
    doesNotEstablish: [
      'Any regulation clearing price, revenue, or the share of regulation awarded to batteries. The FAQ carries none, and the section argument needs all three.',
      'What consolidation does to storage revenue. RegD was the fast signal storage competed in; whether merging it into one signal helps or harms a battery is precisely the open question, and this document does not answer it.',
      'Whether storage is advantaged or disadvantaged by the new performance scoring.',
    ],
    excerpt: 'Regulation Redesign Phase 1 consolidates the current RegA and RegD bidirectional signals into a single bidirectional signal that all resources assigned Regulation will follow.',
  },

  elcc2829: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'ELCC Class Ratings for the 2028/2029 Base Residual Auction',
    confirmedPublisher: 'PJM Interconnection, L.L.C.',
    confirmedDate: '25 February 2026',
    reviewedUrl: 'https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf',
    /* The landing page is a fallback, not the source. It carries no ratings —
       following through to the document is what turned a publication status
       into an analytical proposition. */
    fallbackUrl: 'https://www.pjm.com/planning/resource-adequacy-planning/effective-load-carrying-capability',
    locator: 'ELCC Class Ratings table, p.1 of the class-ratings PDF; RAA Schedule 9.2 note, sections C(2) and D(1)(b), p.1',
    establishes: [
      'The class ratings applied to the 2028/2029 BRA, by storage duration: 4-hr Storage 59%, 6-hr Storage 68%, 8-hr Storage 71%, 10-hr Storage 78%.',
      'For comparison in the same table: Onshore Wind 34%, Tracking Solar 10%, Gas Combined Cycle 78%, Nuclear 96%, Demand Resource 91%.',
      'Duration converts directly into accredited capacity, and therefore into what a capacity price is paid on.',
      'Pursuant to RAA Schedule 9.2 — no class rating is determined for Combination Resources, the Complex Hybrid Class, or any class whose members are too distinct for one rating; those get a resource-specific ELCC analysis instead.',
    ],
    doesNotEstablish: [
      'Any revenue figure. A rating is a quantity multiplier, not a price, and the two must not be combined into a revenue claim from this document alone.',
      'A rating for a hybrid or co-located resource, which is explicitly excluded from class rating and analysed resource-specifically.',
      'That the ratings are stable. They are stated for this auction; the 2027/2028 ratings are a separate record and were not opened.',
      'Why the ratings sit where they do. No methodology is reproduced here.',
    ],
    excerpt: '4-hr Storage 59%  6-hr Storage 68%  8-hr Storage 71%  10-hr Storage 78%',
  },

  ancillaryLanding: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Ancillary Services',
    confirmedPublisher: 'PJM Interconnection, L.L.C.',
    confirmedDate: 'Phase 2 materials dated to 10 August 2026',
    locator: 'pjm.com ancillary-services index; "Market-Based Regulation" section',
    establishes: [
      'PJM operates four ancillary service markets, of which the Regulation Market is real-time only.',
      'The Regulation Redesign is in two phases, with Phase 1 and Phase 2 material sets published.',
    ],
    doesNotEstablish: [
      'Any clearing price, revenue figure, or storage share of regulation awards. The page carries none, which is why the section rests on gap records rather than on this.',
    ],
  },

  collar: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded URL (pjm.com public-disclosures) returns a PJM 404 page. This is a dead link in the register, not a research gap: the collar parameters themselves are established by the Base Residual Auction report, which was read. Finding the Board decision document is new sourcing and belongs in the backlog.',
    establishes: [],
    doesNotEstablish: [
      'The provenance of the collar decision, the approving body, and whether any approval beyond the PJM Board was required. The capacity claim therefore rests on the auction report alone and says nothing about who imposed the collar.',
    ],
  },

  /* ---- could not be opened ----------------------------------------------- */

  tb4: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded modoenergy.com URL returns HTTP 404. Not a paywall — the address itself is gone. Without the article, the author, date and locator cannot be established, and observed values cannot be separated from forecast, which is the whole reason third-party material needs opening.',
    establishes: [],
    doesNotEstablish: [
      'Any TB4 spread value, its period, or whether a given figure is measured or projected.',
      'The attribution that a third-party record requires before it can support a published claim.',
    ],
  },

  modoStack: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded modoenergy.com URL also returns HTTP 404. Two of two Modo links in the register are dead.',
    establishes: [],
    doesNotEstablish: [
      'Any battery revenue-stack figure, and the split between regulation and arbitrage that the services section argument turns on.',
    ],
  },

  queue: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Cycle Service Request Status',
    confirmedPublisher: 'PJM Interconnection, L.L.C.',
    confirmedDate: 'current at review',
    locator: 'Followed a two-step redirect: the recorded services-request-status URL is now a notice, which points to serial-service-request-status, which states TC2 data there is no longer current and points to cycle-service-request-status. Reviewed the last of these.',
    registerDateDiffers: false,
    establishes: [
      'The interconnection queue is administered in cluster cycles — Transition Cycle 1 and 2 and successors — rather than serially.',
      'The cycle table lists 1,792 projects at the time of review, including Storage, Solar, Wind, Natural Gas and Offshore Wind entries.',
    ],
    doesNotEstablish: [
      'Any megawatt total, by fuel type or otherwise. The page carries a project table and no aggregates.',
      'Any storage-specific volume, which is what both the pipeline and grid sections need.',
      'Anything about DELIVERABILITY. The queue records requests and their study status; capacity interconnection rights and network deliverability are a separate question and must not be inferred from queue volume.',
      'The export files are generated by script rather than served at a stable address, so the underlying dataset was not retrieved.',
    ],
  },
};
