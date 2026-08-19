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

  collar: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded URL (pjm.com public-disclosures) returns a PJM 404 page. This is a dead link in the register, not a research gap: the collar parameters themselves are established by the Base Residual Auction report, which was read. Finding the Board decision document is new sourcing and belongs in the backlog.',
    establishes: [],
    doesNotEstablish: [
      'The provenance of the collar decision, the approving body, and whether any approval beyond the PJM Board was required. The capacity claim therefore rests on the auction report alone and says nothing about who imposed the collar.',
    ],
  },
};
