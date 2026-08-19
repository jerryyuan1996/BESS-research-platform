/* ---------------------------------------------------------------------------
   WA SOURCE REVIEW — what was opened on 2026-08-19, and what it showed.

   One pass over the URLs already in the register. Opening an already-cited
   source is editorial evidence review; finding a replacement source is not, and
   nothing here does that.

   THE HEADLINE RESULT: the two regulator sites answered and the market operator
   did not. Every AEMO URL returns 403 to an automated fetch, and the archive
   fallback is unavailable from this environment, so the ESOO, the quarterly
   dynamics report and the reserve-capacity timetable were NOT read. The
   sections resting on them stay incomplete for an access reason, which is
   different from a research gap and is recorded as such.

   What did open changed two dispositions and turned up two stale register
   dates, which is a better return than the pass looked like it would give.
   --------------------------------------------------------------------------- */
import { ACCESS } from '../../governance/sourceReview.js';

export const REVIEW = {

  /* ---- opened, and decisive ---------------------------------------------- */

  /* THE DOCUMENT ITSELF, not the page about it. Fetched as a PDF and read by
     decompressing its content streams — the page linking it carries none of
     this. It answers three sections, which is why it was worth the trouble. */
  brcp: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: '2026 Benchmark Reserve Capacity Prices for the 2028/29 capacity year — Final determination',
    confirmedPublisher: 'Economic Regulation Authority, Western Australia',
    confirmedDate: '13 March 2026',
    documentRef: 'D307789',
    locator: 'Cover page (title, "Final determination", 13 March 2026); §1.2 regulatory framework; §1.2.1 p.10; §2.1 and Table 3 p.24; Figure 1 and its note p.25; footnote 1; footnote 100 pp.27-28; §3.1 p.28',
    establishes: [
      'Table 3, p.24 — the Peak BRCP and the Flexible BRCP for the 2028/29 capacity year are both $488,500 per MW per year.',
      'Figure 1 note, p.25 — "For the 2021/22 to 2026/27 capacity years, the BRCP was based on a 160 MW open-cycle gas turbine."',
      'Figure 1 note, p.25 — "Both of the Peak and Flexible BRCPs for 2027/28 were determined based on a 200 MW / 800 MWh BESS benchmark technology."',
      'Figure 1 note, p.25 — "The 2028/29 BRCPs were determined based on a 200 MW / 1,200 MWh BESS for both Peak and Flexible capacity."',
      'p.25 — "AEMO will use the BRCP to determine the Peak and Flexible Reserve Capacity Prices for 2028/29."',
      '§1.2 — "The ERA determines the BRCPs annually following the method outlined in the BRCP WEM Procedure."',
      'Footnote 1 — the Peak Reserve Capacity Price is what is PAID to capacity providers per MW made available, and all Capacity Credit holders receive capacity payments. The BRCP is the benchmark; the RCP is the payment.',
      'Risk-premium discussion — "the BRCP does not guarantee revenues over time", and capacity revenue for a BESS can change through the BRCP, the Reserve Capacity Price, the adjustment factor for excess capacity, and the quantity of Capacity Credits allocated.',
      'Footnote 100, p.27 — "The Network Access Quantity (NAQ) is a feature of the RCM that provides a cap on the amount of capacity credits a Facility can receive based on the available network capacity at the relevant connection point."',
      '§1.2.1, p.10 — on 30 September 2025 the Coordinator determined both Benchmark Technologies must be a lithium BESS with 200 MW injection and 1,200 MWh (6-hour) storage at a 330 kV connection.',
    ],
    doesNotEstablish: [
      'WHO determines the Network Access Quantity, or how often. Footnote 100 continues "AEMO" and the sentence is cut at the page break in the extracted text, so the cadence is UNVERIFIED. A claim must not say the quantity is determined annually on this evidence.',
      'The word "annually" in this document attaches to the ERA determining the BRCP, not to anyone determining the NAQ. Reading it across would be exactly the one-clause overreach this review exists to catch.',
      'The Energy Storage Resource Duration Requirement in trading intervals. That is a rules and ESOO matter and appears nowhere here.',
      'That any particular project holds Capacity Credits, or receives capacity revenue at all.',
      'The Coordinator determination is reported BY the ERA. Claims resting on it are limited to what the ERA states in this document.',
    ],
    excerpt: 'The Network Access Quantity (NAQ) is a feature of the RCM that provides a cap on the amount of capacity credits a Facility can receive based on the available network capacity at the relevant connection point.',
  },

  rules: {
    reviewedAt: '2026-08-19',
    access: ACCESS.LANDING_PAGE,
    confirmedTitle: 'Electricity System and Market Rules',
    confirmedPublisher: 'Department of Energy and Economic Diversification — Energy Policy WA',
    confirmedDate: '1 July 2026',
    /* Kept apart deliberately. One date is the instrument in force; the other
       is a set of instruments that are not. Collapsing them into a single
       "current" date would hide that the framework is mid-transition, which is
       the fact an investor most needs from this record. */
    consolidatedVersionDate: '1 July 2026',
    pendingAmendments: [
      'Electricity System and Market Amendment (Tranche 9) Rules 2025 — schedules commence at specified future dates',
      'Electricity System and Market Amendment (Tranche 8) Rules 2025 — phased commencement',
      'Wholesale Electricity Market Amendment (RCM Reviews Sequencing) Rules 2025',
      'Wholesale Electricity Market Amendment (Reserve Capacity Reform) Rules 2023',
    ],
    locator: 'wa.gov.au document collection page; current rules listed as "Electricity System and Market Rules – 1 July 2026", plus amending rules awaiting commencement (Tranches 8 and 9, RCM Reviews Sequencing, Reserve Capacity Reform 2023)',
    registerDateDiffers: true,
    registerDateNote: 'The register records 2023–2025. The consolidated instrument in force is dated 1 July 2026, and four amending instruments await commencement. The register date is not replaced here: the version date and the pending set are recorded as separate fields, because they are different facts and only one of them is a vintage. Note also that the ERA determination cites the rules as at 26 February 2026, so more than one dated version is in legitimate circulation.',
    establishes: [
      'A consolidated Electricity System and Market Rules instrument current at 1 July 2026 exists, published by Energy Policy WA.',
      'Amending rules are awaiting commencement, including Reserve Capacity Reform 2023 and RCM Reviews Sequencing 2025, so the capacity framework is mid-transition.',
    ],
    doesNotEstablish: [
      'How Capacity Credits are assigned.',
      'How the reserve capacity price relates to the BRCP.',
      'The Energy Storage Resource Duration Requirement, in trading intervals or otherwise.',
      'All three sit inside the rules PDFs, which were not opened. The collection page carries none of them.',
    ],
  },

  swisPlan: {
    reviewedAt: '2026-08-19',
    access: ACCESS.PUBLISHER,
    confirmedTitle: 'The South West Interconnected System Transmission Plan: A Future-Ready Transmission Network for WA’s Main Electricity System',
    confirmedPublisher: 'Energy Policy WA, supported by Western Power',
    /* Two dates, neither overwriting the other, because the discrepancy is not
       resolved and guessing which one is "the" date would destroy the evidence
       that there is a question here at all. */
    publicationDate: '18 September 2025 (as recorded in the register; not confirmed on the page)',
    pageLastUpdated: '4 March 2026 (stated on the page)',
    confirmedDate: 'unresolved — see publicationDate and pageLastUpdated',
    locator: 'Energy Policy WA plan page; headings "The South West Interconnected System Transmission Plan", Phase One / Phase Two / Phase Three',
    registerDateDiffers: true,
    registerDateNote: 'The register records 18 Sep 2025; the page reports last updated 4 March 2026. These need not conflict — one may be publication and the other a page edit — and the distinction was NOT resolved. Both are retained as distinct fields until it is.',
    establishes: [
      'The plan is structured in three phases, the first being the Clean Energy Link projects connecting new generation as coal retires.',
      'The plan sets out the State Government vision for the transmission network ALONG WITH THE INVESTMENT NEEDED to deliver it — that is, it identifies required investment.',
    ],
    doesNotEstablish: [
      'Any megawatt figure or target year. The page states phase objectives and no quantities.',
      'That funding is committed. The plan expresses a vision and the investment needed for it, which is not an appropriation and must not be read as one.',
      'Anything about network access quantity or deliverability for a particular connection.',
    ],
  },

  /* ---- could not be opened ----------------------------------------------- */

  esoo: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch. The archive fallback (web.archive.org) is not reachable from this environment. Neither the ESOO landing page nor the publication was read.',
    establishes: [],
    doesNotEstablish: [
      'The four elements the duration claim needs — fourteen trading intervals, the 2028-29 effective period, the grandfathering boundary and the full-credit consequence — are all unverified.',
    ],
  },

  qed: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch; archive fallback unreachable. The quarterly dynamics report was not read.',
    establishes: [],
    doesNotEstablish: [
      'The discharge-spread figures and the fleet-growth figures, and crucially whether the two are measured over comparable periods, are all unverified.',
    ],
  },

  crc: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'aemo.com.au returns HTTP 403 to an automated fetch; archive fallback unreachable.',
    establishes: [],
    doesNotEstablish: [
      'The scope of "certified reserve capacity" and whether the term applies to storage as used in the earlier draft claim.',
    ],
  },

  consent: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The recorded URL is the EPA WA homepage, which the fetch layer could not verify as safe to retrieve. Separately, a bare organisation homepage cannot be a locator for a specific approval requirement even if it were readable.',
    establishes: [],
    doesNotEstablish: [
      'Any specific approval requirement or timeframe for grid-scale storage.',
      'The record own authority. It describes observed approvals across WA and federal processes, which reads as an internal compilation rather than a single regulator publication, but that was NOT confirmed and the record stays unclassified rather than being assigned an author from its description.',
    ],
  },

  mkt: {
    reviewedAt: '2026-08-19',
    access: ACCESS.INACCESSIBLE,
    accessNote: 'The record carries NO url and names no author. There is nothing to open. Identifying the underlying study is new sourcing, which is outside an editorial review pass, so it goes to the research backlog rather than being guessed at from the description.',
    establishes: [],
    doesNotEstablish: [
      'The ownership-concentration and exit-channel findings the pipeline section rests on.',
      'Its own authorship, which its third-party classification requires before it can support any published claim.',
    ],
  },
};
